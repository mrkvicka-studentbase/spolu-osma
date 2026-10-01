#!/usr/bin/env node
// Spojí supabase/migrations/*.sql (seřazené podle názvu) do supabase/vse-v-jednom.sql,
// který lze celý vložit do Supabase → SQL Editor a spustit jedním kliknutím.
// Spuštění: node supabase/skripty/spoj-migrace.mjs
// Bez závislostí. Po každé změně migrací spustit znovu.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const adresarMigraci = path.join(koren, 'migrations');
const vystup = path.join(koren, 'vse-v-jednom.sql');

const soubory = (await readdir(adresarMigraci))
  .filter((n) => /^\d{4}_.+\.sql$/.test(n))
  .sort();

if (soubory.length === 0) {
  console.error('Žádné migrace v', adresarMigraci);
  process.exit(1);
}

const casti = [
  '-- =====================================================================',
  '-- vse-v-jednom.sql — VYGENEROVÁNO skriptem supabase/skripty/spoj-migrace.mjs',
  '-- NEUPRAVUJTE ručně; upravte migrace v supabase/migrations/ a vygenerujte znovu.',
  `-- Obsahuje: ${soubory.join(', ')}`,
  '-- Použití: Supabase → SQL Editor → New query → vložit celý soubor → Run.',
  '-- Vše běží v jedné transakci: při chybě se neprovede nic.',
  '-- =====================================================================',
  '',
  'begin;',
  '',
];

for (const nazev of soubory) {
  const sql = (await readFile(path.join(adresarMigraci, nazev), 'utf8')).replace(/^﻿/, '');
  if (/^\s*(begin|commit)\s*;/im.test(sql)) {
    console.error(`${nazev}: migrace nesmí obsahovat vlastní begin/commit (obaluje je tento skript).`);
    process.exit(1);
  }
  casti.push(`-- >>>>> ${nazev} >>>>>`, sql.trimEnd(), `-- <<<<< konec ${nazev} <<<<<`, '');
}

casti.push('commit;', '');
await writeFile(vystup, casti.join('\n'), 'utf8');
console.log(`Zapsáno: ${path.relative(process.cwd(), vystup)} (${soubory.length} migrací)`);
