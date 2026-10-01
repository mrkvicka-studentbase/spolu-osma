// Sdílené pomocné funkce pro skripty v supabase/skripty: ruční načtení .env a připojení přes pg.
// Bez balíčku dotenv. Proměnné prostředí mají přednost před .env.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const KOREN_REPA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Načte .env z kořene repa (KLIC=hodnota, # komentáře, volitelné uvozovky, prefix export).
 * @returns {Promise<Record<string, string>>} spojené hodnoty (process.env má přednost)
 */
export async function nactiEnv() {
  const hodnoty = {};
  const cesta = path.join(KOREN_REPA, '.env');
  if (existsSync(cesta)) {
    const text = (await readFile(cesta, 'utf8')).replace(/^﻿/, '');
    for (const radek of text.split(/\r?\n/)) {
      const r = radek.trim();
      if (!r || r.startsWith('#')) continue;
      const m = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(r);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      else v = v.replace(/\s+#.*$/, '');
      hodnoty[m[1]] = v;
    }
  }
  for (const [k, v] of Object.entries(process.env)) if (v) hodnoty[k] = v;
  return hodnoty;
}

/**
 * Vytvoří a připojí pg klienta podle SUPABASE_DB_URL.
 * SSL bez ověření certifikátu (Supabase pooler); sslmode z URL odstraníme, jinak by
 * pg (parser connection stringu) přepsal naše nastavení ssl a spojení by spadlo na certifikátu.
 * NOTICE zprávy (raise notice) vypisuje na konzoli.
 * @returns {Promise<import('pg').Client>}
 */
export async function pripojDb() {
  const env = await nactiEnv();
  const url = env.SUPABASE_DB_URL;
  if (!url) {
    throw new Error('Chybí SUPABASE_DB_URL v .env (kořen repa). Viz .env.example a PRISTUP-SUPABASE.md.');
  }
  let pg;
  try {
    pg = (await import('pg')).default;
  } catch {
    throw new Error('Chybí balíček pg. Spusťte v kořeni repa: npm install');
  }
  const u = new URL(url);
  for (const p of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) u.searchParams.delete(p);
  const klient = new pg.Client({
    connectionString: u.toString(),
    ssl: { rejectUnauthorized: false },
    application_name: 'spolu-skripty',
  });
  klient.on('notice', (n) => console.log(`NOTICE: ${n.message}`));
  await klient.connect();
  return klient;
}
