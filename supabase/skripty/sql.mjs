#!/usr/bin/env node
// =====================================================================
// sql.mjs — spustí SQL proti databázi (Node + pg) a vypíše výsledky jako tabulky
//
// Použití (z kořene repa):
//   npm run sql -- "select stav, count(*) from rodiny group by stav"
//   npm run sql -- --soubor supabase/testy-rls.sql
//   npm run sql -- --jako-uzivatel <uuid> "select * from lekce"
//
// Více příkazů v jednom vstupu je povoleno (oddělené středníkem); vypíše se výsledek každého.
// Bez --jako-uzivatel běží jako postgres (obchází RLS!) v režimu autocommit.
// --jako-uzivatel <uuid>: vše se obalí do transakce jako role authenticated s JWT claims
//   {"sub":"<uuid>","role":"authenticated"} a na konci se VŽDY rollbackne (test RLS, nic nezapíše).
// Připojení: SUPABASE_DB_URL z .env.
// =====================================================================

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pripojDb } from './env.mjs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function napoveda() {
  console.error('Použití: node supabase/skripty/sql.mjs [--jako-uzivatel <uuid>] ("<SQL>" | --soubor <cesta.sql>)');
}

function argumenty(argv) {
  const volby = { sql: null, soubor: null, uzivatel: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--soubor') volby.soubor = argv[++i];
    else if (a === '--jako-uzivatel') volby.uzivatel = argv[++i];
    else if (a === '--help' || a === '-h') return null;
    else if (volby.sql === null) volby.sql = a;
    else volby.sql += ' ' + a;
  }
  return volby;
}

/** Vypíše jeden výsledek pg (příkaz, počet řádků, tabulka). */
function vypis(vysledek, poradi, celkem) {
  const hlavicka = celkem > 1 ? `[${poradi}/${celkem}] ` : '';
  const prikaz = vysledek.command || '(prázdný příkaz)';
  if (vysledek.fields?.length) {
    console.log(`${hlavicka}${prikaz}: ${vysledek.rowCount ?? vysledek.rows.length} řádků`);
    if (vysledek.rows.length) {
      // jsonb/objekty vypiš jako text, ať console.table neřeže strukturu
      const radky = vysledek.rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [
        k, v !== null && typeof v === 'object' && !(v instanceof Date) ? JSON.stringify(v) : v,
      ])));
      console.table(radky);
    }
  } else {
    console.log(`${hlavicka}${prikaz}${vysledek.rowCount !== null && vysledek.rowCount !== undefined ? ` (${vysledek.rowCount} řádků)` : ''}`);
  }
}

async function hlavni() {
  const volby = argumenty(process.argv.slice(2));
  if (!volby) { napoveda(); return 0; }
  if (volby.soubor) {
    volby.sql = (await readFile(path.resolve(volby.soubor), 'utf8')).replace(/^﻿/, '');
  }
  if (!volby.sql || !volby.sql.trim()) { napoveda(); return 1; }
  if (volby.uzivatel !== null && !UUID.test(volby.uzivatel || '')) {
    console.error('--jako-uzivatel vyžaduje platné uuid (Authentication → Users → User UID).');
    return 1;
  }

  const db = await pripojDb();
  try {
    if (volby.uzivatel) {
      // uuid je ověřené regexem výše → bezpečné vložit do literálu
      const claims = JSON.stringify({ sub: volby.uzivatel.toLowerCase(), role: 'authenticated' });
      await db.query('begin');
      await db.query(`set local role authenticated; set local request.jwt.claims = '${claims}'`);
      console.log(`(jako uživatel ${volby.uzivatel}, role authenticated — na konci rollback)`);
    }
    let vysledky;
    try {
      vysledky = await db.query(volby.sql);
    } finally {
      if (volby.uzivatel) await db.query('rollback').catch(() => {});
    }
    const pole = Array.isArray(vysledky) ? vysledky : [vysledky];
    pole.forEach((v, i) => vypis(v, i + 1, pole.length));
    return 0;
  } catch (e) {
    console.error(`CHYBA: ${e.message}`);
    if (e.detail) console.error(`  detail: ${e.detail}`);
    if (e.hint) console.error(`  hint: ${e.hint}`);
    if (e.position && volby.sql) {
      const pred = volby.sql.slice(0, Number(e.position));
      console.error(`  řádek ${pred.split('\n').length}`);
    }
    return 1;
  } finally {
    await db.end();
  }
}

try {
  process.exitCode = await hlavni();
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
