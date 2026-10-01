#!/usr/bin/env node
// =====================================================================
// migrovat.mjs — aplikuje supabase/migrations/*.sql na databázi (Node + pg)
//
// Použití (z kořene repa):
//   npm run migrovat                      aplikuje nové migrace
//   npm run migrovat -- --suchy-beh       vypíše plán, NEPŘIPOJUJE se k DB a nečte .env
//   npm run migrovat -- --vynutit         znovu spustí i aplikované migrace se ZMĚNĚNÝM obsahem
//                                         (migrace jsou psané idempotentně) a uloží nový součet
//
// Připojení: SUPABASE_DB_URL z .env (Session pooler URI). Viz PRISTUP-SUPABASE.md.
// Evidence: tabulka public._migrace (nazev, aplikovano_at, kontrolni_soucet) — není vystavená
// přes Data API (revoke anon/authenticated + RLS bez politik).
// Každá migrace běží ve vlastní transakci; při chybě se vrátí jen ta jedna a skript skončí.
// =====================================================================

import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { KOREN_REPA, pripojDb } from './env.mjs';

const ADRESAR = path.join(KOREN_REPA, 'supabase', 'migrations');
const argv = process.argv.slice(2);
const SUCHY_BEH = argv.includes('--suchy-beh');
const VYNUTIT = argv.includes('--vynutit');

// Zámek proti souběžnému spuštění (libovolné pevné číslo)
const ZAMEK = 7201926;

const SQL_EVIDENCE = `
create table if not exists public._migrace (
  nazev            text primary key,
  aplikovano_at    timestamptz not null default now(),
  kontrolni_soucet text
);
revoke all on public._migrace from anon, authenticated;
alter table public._migrace enable row level security;
`;

/** Obsah migrace + sha256 (konce řádků sjednocené na LF, ať git autocrlf nemění součet). */
async function nactiMigrace() {
  const nazvy = (await readdir(ADRESAR)).filter((n) => /^\d{4}_.+\.sql$/.test(n)).sort();
  const migrace = [];
  for (const nazev of nazvy) {
    const sql = (await readFile(path.join(ADRESAR, nazev), 'utf8')).replace(/^﻿/, '').replace(/\r\n/g, '\n');
    if (/^\s*(begin|commit|rollback)\s*;/im.test(sql)) {
      throw new Error(`${nazev}: migrace nesmí obsahovat vlastní begin/commit (transakci řídí tento skript).`);
    }
    migrace.push({ nazev, sql, soucet: createHash('sha256').update(sql).digest('hex') });
  }
  return migrace;
}

async function hlavni() {
  const migrace = await nactiMigrace();
  if (migrace.length === 0) throw new Error(`Žádné migrace v ${ADRESAR}`);

  if (SUCHY_BEH) {
    console.log('Suchý běh — bez připojení k DB. Pořadí migrací (aplikované se přeskočí):');
    for (const m of migrace) console.log(`  ${m.nazev}  sha256 ${m.soucet.slice(0, 12)}…  ${m.sql.split('\n').length} řádků`);
    return 0;
  }

  const db = await pripojDb();
  try {
    await db.query('select pg_advisory_lock($1)', [ZAMEK]);
    await db.query(SQL_EVIDENCE);
    const { rows } = await db.query('select nazev, kontrolni_soucet, aplikovano_at from public._migrace');
    const aplikovane = new Map(rows.map((r) => [r.nazev, r]));

    const zmenene = migrace.filter((m) => aplikovane.has(m.nazev) && aplikovane.get(m.nazev).kontrolni_soucet !== m.soucet);
    const chybejici = [...aplikovane.keys()].filter((n) => !migrace.some((m) => m.nazev === n));
    for (const n of chybejici) console.warn(`VAROVÁNÍ: ${n} je v _migrace, ale soubor chybí.`);

    if (zmenene.length && !VYNUTIT) {
      console.error('Aplikované migrace se od té doby změnily:');
      for (const m of zmenene) console.error(`  ${m.nazev} (aplikováno ${aplikovane.get(m.nazev).aplikovano_at.toISOString()})`);
      console.error('Nic se nespustilo. Změny patří do NOVÉ migrace; pokud je změna záměrná a migrace idempotentní, spusťte s --vynutit.');
      return 1;
    }

    const kSpusteni = migrace.filter((m) => !aplikovane.has(m.nazev) || (VYNUTIT && zmenene.includes(m)));
    if (kSpusteni.length === 0) {
      console.log(`Databáze je aktuální (${migrace.length} migrací).`);
      return 0;
    }

    for (const m of kSpusteni) {
      const znovu = aplikovane.has(m.nazev);
      process.stdout.write(`${znovu ? '↻' : '→'} ${m.nazev} … `);
      try {
        await db.query('begin');
        await db.query(m.sql);
        await db.query(
          `insert into public._migrace (nazev, kontrolni_soucet) values ($1, $2)
           on conflict (nazev) do update set kontrolni_soucet = excluded.kontrolni_soucet, aplikovano_at = now()`,
          [m.nazev, m.soucet],
        );
        await db.query('commit');
        console.log('OK');
      } catch (e) {
        await db.query('rollback').catch(() => {});
        console.log('CHYBA');
        console.error(`\n${m.nazev}: ${e.message}`);
        if (e.position) {
          const pred = m.sql.slice(0, Number(e.position));
          console.error(`  řádek ${pred.split('\n').length}: ${m.sql.split('\n')[pred.split('\n').length - 1].trim()}`);
        }
        if (e.detail) console.error(`  detail: ${e.detail}`);
        if (e.hint) console.error(`  hint: ${e.hint}`);
        console.error('Migrace vrácena (rollback), další se nespouštějí.');
        return 1;
      }
    }
    console.log(`\nHotovo: spuštěno ${kSpusteni.length} migrací.`);
    return 0;
  } finally {
    await db.query('select pg_advisory_unlock($1)', [ZAMEK]).catch(() => {});
    await db.end();
  }
}

try {
  process.exitCode = await hlavni();
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
