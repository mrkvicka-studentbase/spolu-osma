// Založí (nebo smaže) testovací účty pro vývoj a QA. Přihlašovací údaje uloží do
// testy/testovaci-ucty.local.json (v .gitignore). PŘED SPUŠTĚNÍM PILOTU SMAZAT: --smazat
//
//   node supabase/skripty/testovaci-ucty.mjs            založí chybějící účty
//   node supabase/skripty/testovaci-ucty.mjs --smazat   smaže všechny účty @example.com z tohoto skriptu

import { writeFile, mkdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { nactiEnv, pripojDb, KOREN_REPA } from './env.mjs';

const UCTY = [
  { klic: 'rodina_pilot', email: 'test-pilot@example.com', jmeno_rodice: 'Test Pilotní',
    dite: { dite_jmeno: 'Adam', typ_skoly: 'gymnazium', znamka_8: '3' }, stav: 'pilot' },
  { klic: 'rodina_aktivni', email: 'test-aktivni@example.com', jmeno_rodice: 'Test Aktivní',
    dite: { dite_jmeno: 'Bára', typ_skoly: 'ss_maturita', znamka_8: '2' }, stav: 'aktivni',
    druheDite: { krestni_jmeno: 'Cyril', typ_skoly: 'gymnazium', znamka_8: 4 } },
  { klic: 'admin', email: 'test-admin@example.com', jmeno_rodice: 'Test Admin', admin: true },
];

const env = await nactiEnv();
const url = env.SUPABASE_URL;
const klic = env.SUPABASE_SERVICE_KEY;
if (!url || !klic) throw new Error('Chybí SUPABASE_URL nebo SUPABASE_SERVICE_KEY v .env');
const hlavicky = { apikey: klic, Authorization: `Bearer ${klic}`, 'Content-Type': 'application/json' };

const db = await pripojDb();
try {
  if (process.argv.includes('--smazat')) {
    for (const u of UCTY) {
      const r = await db.query('select id from auth.users where email = $1', [u.email]);
      for (const { id } of r.rows) {
        const o = await fetch(`${url}/auth/v1/admin/users/${id}`, { method: 'DELETE', headers: hlavicky });
        console.log(`${o.ok ? '✔ smazán' : '✘ nepodařilo se smazat'} ${u.email}`);
      }
    }
  } else {
    const vystup = {};
    for (const u of UCTY) {
      const heslo = 'Test-' + randomBytes(9).toString('base64url');
      let id = (await db.query('select id from auth.users where email = $1', [u.email])).rows[0]?.id;
      if (id) {
        // existuje → jen nastav nové heslo, ať jsou údaje v souboru platné
        const o = await fetch(`${url}/auth/v1/admin/users/${id}`, {
          method: 'PUT', headers: hlavicky, body: JSON.stringify({ password: heslo }) });
        if (!o.ok) throw new Error(`Změna hesla ${u.email}: HTTP ${o.status} ${await o.text()}`);
      } else {
        const o = await fetch(`${url}/auth/v1/admin/users`, {
          method: 'POST', headers: hlavicky,
          body: JSON.stringify({ email: u.email, password: heslo, email_confirm: true,
            user_metadata: { jmeno_rodice: u.jmeno_rodice, zdroj: 'test', ...(u.dite || {}) } }) });
        if (!o.ok) throw new Error(`Založení ${u.email}: HTTP ${o.status} ${await o.text()}`);
        id = (await o.json()).id;
      }
      if (u.stav && u.stav !== 'pilot') await db.query('update public.rodiny set stav = $2 where id = $1', [id, u.stav]);
      if (u.druheDite) {
        await db.query(`insert into public.deti (rodina_id, krestni_jmeno, typ_skoly, znamka_8)
                        select $1, $2, $3, $4 where not exists (select 1 from public.deti where rodina_id = $1 and poradi = 2)`,
          [id, u.druheDite.krestni_jmeno, u.druheDite.typ_skoly, u.druheDite.znamka_8]);
      }
      if (u.admin) await db.query('insert into public.admini (uid) values ($1) on conflict do nothing', [id]);
      vystup[u.klic] = { email: u.email, heslo, id };
      console.log(`✔ ${u.email}`);
    }
    const soubor = path.join(KOREN_REPA, 'testy', 'testovaci-ucty.local.json');
    await mkdir(path.dirname(soubor), { recursive: true });
    await writeFile(soubor, JSON.stringify(vystup, null, 2) + '\n');
    console.log(`Údaje uloženy do ${path.relative(KOREN_REPA, soubor)} (mimo git).`);
  }
} finally {
  await db.end();
}
