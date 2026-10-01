#!/usr/bin/env node
// =====================================================================
// seed-lekce.mjs — validace a nahrání lekcí z obsah/lekce/*.json do tabulky public.lekce
//
// Použití (z kořene repa):
//   node supabase/seed/seed-lekce.mjs --jen-validace        jen kontrola, bez sítě a bez klíče
//   node supabase/seed/seed-lekce.mjs --suchy-beh           zjistí, co by se změnilo, nic nezapíše
//   node supabase/seed/seed-lekce.mjs                       validace + upsert změněných lekcí
// Volby:
//   --adresar <cesta>             jiný adresář s JSON lekcemi (výchozí obsah/lekce)
//   --vcetne-nezkontrolovanych    nahraje i lekce s kontrola.jistota 'nizka' / 'neurceno'
//   --otevrit-od-zaklady RRRR-MM-DD  den spuštění češtiny (fáze zaklady): týden 1 se otevře ten den,
//                                 další týdny vždy v pondělí (supabase/seed/otevreni-cj.mjs). Bez něj
//                                 se čeština nenahraje; s --jen-validace jen vypíše plán otevírání.
//
// Čeština (--adresar obsah/cestina/lekce) jde do DB jen po migraci supabase/migrations/0007_predmet.sql
// (sloupec lekce.predmet). Seed to před zápisem ověří a bez migrace nic nezapíše.
//
// Klíče: soubor .env v kořeni repa (nebo proměnné prostředí):
//   SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY=sb_secret_...   (nebo starý service_role JWT)
// Service key NIKDY nepatří do web/ ani do gitu.
//
// Bez externích závislostí (Node 18+; fetch je vestavěný).
// =====================================================================

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { zkontrolujLekci, kontrolaParuSimulaci, nactiSlovnikChyb, jeObjekt, kanonickyJson } from './validator.mjs';
import { parsujSlovnikChybCj } from './validator-cj.mjs';
import { parsujDatum, otevritOdZaklady } from './otevreni-cj.mjs';

const KOREN_REPA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CESTA_SCHEMATU = path.join(KOREN_REPA, 'obsah', 'schema.json');

/** Datum otevření podle fáze (kostra/02). */
const OTEVRIT_OD = {
  pilot: '2026-10-01T00:00:00+02:00',
  faze1: '2026-12-01T00:00:00+01:00',
  faze2: '2027-02-01T00:00:00+01:00',
};

const CESTA_SLOVNIKU = path.join(KOREN_REPA, 'obsah', 'typy-chyb.md');
// Čeština (cestina/Obsah/FORMAT-CJ.md): vlastní slovník chyb a seznam nahrávek; audio je ve web/audio/cestina/
const CESTA_SLOVNIKU_CJ = path.join(KOREN_REPA, 'cestina', 'Obsah', 'TYPY-CHYB.md');
const CESTA_AUDIO_CJ = path.join(KOREN_REPA, 'cestina', 'Obsah', 'AUDIO.md');

// ---------------------------------------------------------------------
// Argumenty
// ---------------------------------------------------------------------
const argv = process.argv.slice(2);
const volby = {
  jenValidace: argv.includes('--jen-validace'),
  suchyBeh: argv.includes('--suchy-beh'),
  vcetneNezkontrolovanych: argv.includes('--vcetne-nezkontrolovanych'),
  adresar: path.join(KOREN_REPA, 'obsah', 'lekce'),
};
const iAdr = argv.indexOf('--adresar');
if (iAdr !== -1) {
  if (!argv[iAdr + 1]) {
    console.error('Chybí cesta za --adresar.');
    process.exit(1); // ještě před jakoukoli sítí — tady je process.exit bezpečný
  }
  volby.adresar = path.resolve(argv[iAdr + 1]);
}
// --otevrit-od-zaklady 2026-10-05 i --otevrit-od-zaklady=2026-10-05
const iOtv = argv.findIndex((a) => a === '--otevrit-od-zaklady' || a.startsWith('--otevrit-od-zaklady='));
if (iOtv !== -1) {
  const hodnota = argv[iOtv].includes('=') ? argv[iOtv].split('=')[1] : argv[iOtv + 1];
  volby.spusteniZaklady = parsujDatum(hodnota);
  if (!volby.spusteniZaklady) {
    console.error(`Neplatné datum za --otevrit-od-zaklady: "${hodnota ?? ''}" (čekám RRRR-MM-DD).`);
    process.exit(1);
  }
}

/** Ukončení běhu s hláškou. Nepoužíváme process.exit() — na Windows po fetch padá (libuv assert). */
class KonecBehu extends Error {
  constructor(zprava, kod) { super(zprava); this.kod = kod; }
}
function konec(zprava, kod = 1) {
  throw new KonecBehu(zprava, kod);
}

// ---------------------------------------------------------------------
// Načtení .env (ručně, bez balíčku dotenv)
// ---------------------------------------------------------------------
async function nactiEnv() {
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
  const z = (k) => process.env[k] || hodnoty[k];
  return {
    url: (z('SUPABASE_URL') || '').replace(/\/+$/, ''),
    klic: z('SUPABASE_SERVICE_KEY') || z('SUPABASE_SERVICE_ROLE_KEY') || z('SUPABASE_SECRET_KEY') || '',
  };
}

function hlavicky(klic) {
  const h = { apikey: klic, 'Content-Type': 'application/json' };
  // Nové klíče (sb_secret_…) patří jen do apikey; starý service_role JWT i do Authorization.
  if (!klic.startsWith('sb_')) h.Authorization = `Bearer ${klic}`;
  return h;
}

// ---------------------------------------------------------------------
// Hlavní běh
// ---------------------------------------------------------------------
async function hlavni() {
  const schema = JSON.parse(await readFile(CESTA_SCHEMATU, 'utf8'));
  if (!existsSync(CESTA_SLOVNIKU)) konec(`Chybí slovník typů chyb: ${CESTA_SLOVNIKU}`);
  const slovnik = await nactiSlovnikChyb(CESTA_SLOVNIKU);
  if (slovnik.size === 0) konec(`Ve slovníku ${CESTA_SLOVNIKU} nejsou žádné kódy (řádky tabulky ve tvaru | \`kod\` | …).`);
  const slovnikCj = existsSync(CESTA_SLOVNIKU_CJ) ? parsujSlovnikChybCj(await readFile(CESTA_SLOVNIKU_CJ, 'utf8')) : null;
  const audioMdCj = existsSync(CESTA_AUDIO_CJ) ? await readFile(CESTA_AUDIO_CJ, 'utf8') : '';
  const audioExistuje = (a) => existsSync(path.join(KOREN_REPA, 'web', a));

  if (!existsSync(volby.adresar)) konec(`Adresář s lekcemi neexistuje: ${volby.adresar}`);
  const soubory = (await readdir(volby.adresar)).filter((n) => n.endsWith('.json')).sort();
  if (soubory.length === 0) konec(`V ${volby.adresar} nejsou žádné .json lekce.`);

  console.log(`Kontroluji ${soubory.length} lekcí v ${path.relative(process.cwd(), volby.adresar) || '.'}\n`);

  let lekce = [];
  const vsechnyNactene = [];
  const videnaIdLekci = new Map();
  const videnaIdUloh = new Map();
  let celkemChyb = 0;
  let celkemVarovani = 0;

  for (const nazev of soubory) {
    let data;
    const chyby = [];
    let varovani = [];
    try {
      data = JSON.parse((await readFile(path.join(volby.adresar, nazev), 'utf8')).replace(/^﻿/, ''));
    } catch (e) {
      chyby.push(`neplatný JSON: ${e.message}`);
    }
    if (data !== undefined) {
      const cj = jeObjekt(data) && data.predmet === 'cestina';
      const vysledek = zkontrolujLekci(data, nazev, cj
        ? { schema, slovnik: slovnikCj, audioMd: audioMdCj, audioExistuje }
        : { schema, slovnik });
      chyby.push(...vysledek.chyby);
      varovani = vysledek.varovani;
      // vzorové lekce frontendu Fáze 2 patří jen do testy/data (schema je kvůli nim povoluje)
      if (jeObjekt(data) && /^F2-VZOR-/.test(String(data.id)) && volby.adresar === path.join(KOREN_REPA, 'obsah', 'lekce')) {
        chyby.push(`${data.id} je vzorová lekce frontendu — patří do testy/data, ne do obsah/lekce`);
      }

      if (jeObjekt(data) && typeof data.id === 'string') {
        if (videnaIdLekci.has(data.id)) chyby.push(`id lekce "${data.id}" už má soubor ${videnaIdLekci.get(data.id)}`);
        videnaIdLekci.set(data.id, nazev);
        for (const u of Array.isArray(data.ulohy) ? data.ulohy : []) {
          if (typeof u?.id !== 'string') continue;
          if (videnaIdUloh.has(u.id) && videnaIdUloh.get(u.id) !== nazev) chyby.push(`id úlohy "${u.id}" je i v ${videnaIdUloh.get(u.id)}`);
          videnaIdUloh.set(u.id, nazev);
        }
      }
    }
    const unikatniChyby = [...new Set(chyby)];
    celkemChyb += unikatniChyby.length;
    celkemVarovani += varovani.length;
    const znacka = unikatniChyby.length ? '✘' : '✔';
    console.log(`${znacka} ${nazev}${unikatniChyby.length ? ` — ${unikatniChyby.length} chyb` : ' — OK'}${varovani.length ? `, ${varovani.length} varování` : ''}`);
    for (const c of unikatniChyby) console.log(`    CHYBA: ${c}`);
    for (const v of varovani) console.log(`    varování: ${v}`);
    if (!unikatniChyby.length) lekce.push(data);
    if (data !== undefined) vsechnyNactene.push(data);
  }

  // Kontroly napříč soubory: páry simulací (část 1 ↔ část 2, 25 + 25 bodů)
  const chybyParu = kontrolaParuSimulaci(vsechnyNactene);
  for (const c of chybyParu) console.log(`✘ simulace — CHYBA: ${c}`);
  celkemChyb += chybyParu.length;

  console.log(`\nCelkem: ${soubory.length} souborů, ${celkemChyb} chyb, ${celkemVarovani} varování.`);
  if (celkemChyb > 0) konec('\nOprav chyby a spusť znovu. Nic se nenahrálo.');

  const cestina = lekce.filter((l) => l.predmet === 'cestina');
  if (cestina.length && volby.spusteniZaklady) {
    console.log(`\nPlán otevírání češtiny (spuštění ${volby.spusteniZaklady.toISOString().slice(0, 10)}):`);
    const tydny = [...new Set(cestina.map((l) => l.tyden))].sort((a, b) => a - b);
    for (const t of tydny) {
      const idcka = cestina.filter((l) => l.tyden === t).map((l) => l.id).join(', ');
      console.log(`  týden ${t}: ${otevritOdZaklady(t, volby.spusteniZaklady)}  (${idcka})`);
    }
  }
  if (volby.jenValidace) {
    console.log('Režim --jen-validace: nic se nenahrává.');
    return;
  }

  // ---------- Nahrání ----------
  // Čeština: datum spuštění je parametr (zatím nerozhodnuté) a zápis jen po migraci 0007 (ověří se níž).
  if (cestina.length && !volby.spusteniZaklady) {
    konec(`\nLekce češtiny (${cestina.map((l) => l.id).join(', ')}) potřebují den spuštění: --otevrit-od-zaklady RRRR-MM-DD. Nic se nenahrálo.`);
  }

  // Ven jde jen obsah s jistotou 'jista' (kostra 03: 'stredni' dořeší vedoucí, 'nizka' jde Pavlovi).
  // Nezkontrolované lekce se přeskočí, ostatní se nahrají.
  const nezkontrolovane = lekce.filter((l) => l.kontrola?.jistota !== 'jista');
  if (nezkontrolovane.length && !volby.vcetneNezkontrolovanych) {
    console.log(`\nPřeskakuji lekce bez dokončené kontroly (jistota ≠ jista): ${nezkontrolovane.map((l) => l.id).join(', ')}.` +
                '\nPro testovací nahrání přidej --vcetne-nezkontrolovanych.');
    lekce = lekce.filter((l) => !nezkontrolovane.includes(l));
    if (!lekce.length) konec('\nŽádná lekce k nahrání.');
  }

  const { url, klic } = await nactiEnv();
  if (!url || !klic) konec('\nChybí SUPABASE_URL nebo SUPABASE_SERVICE_KEY v .env (kořen repa). Viz supabase/README.md.');

  // Pojistka češtiny: bez sloupce lekce.predmet (migrace supabase/migrations/0007_predmet.sql) se nic nezapíše.
  if (cestina.length) {
    let test;
    try {
      test = await fetch(`${url}/rest/v1/lekce?select=predmet&limit=1`, { headers: hlavicky(klic) });
    } catch (e) {
      konec(`\nNepodařilo se spojit se Supabase (${url}): ${e.message}`);
    }
    if (!test.ok) {
      konec(`\nTabulka lekce nemá sloupec predmet (HTTP ${test.status}) — migrace supabase/migrations/0007_predmet.sql ještě není ` +
            'aplikovaná (nejdřív npm run migrovat, cestina/REPORT-SPUSTENI.md). Lekce češtiny se nenahrály, nic se nezapsalo.');
    }
  }

  /** Řádek tabulky lekce z JSON souboru. */
  function radekLekce(l) {
    const cj = l.predmet === 'cestina';
    const radek = {
      id: l.id,
      faze: l.faze,
      tyden: l.tyden,
      poradi: l.poradi,
      tema: l.tema,
      kapitola: l.kapitola,
      varianta: l.varianta || 'z9',
      obsah: l,
      verejna: l.faze === 'pilot',
      otevrit_od: cj ? otevritOdZaklady(l.tyden, volby.spusteniZaklady) : OTEVRIT_OD[l.faze],
    };
    // predmet posíláme jen u češtiny — Matematika se tak dá nahrát i do DB bez migrace 0007 (výchozí 'matematika')
    if (cj) radek.predmet = 'cestina';
    return radek;
  }

  function seLisi(novy, stary) {
    for (const k of ['faze', 'tyden', 'poradi', 'tema', 'kapitola', 'varianta', 'verejna', ...('predmet' in novy ? ['predmet'] : [])]) {
      if (novy[k] !== stary[k]) return true;
    }
    if (new Date(novy.otevrit_od).getTime() !== new Date(stary.otevrit_od).getTime()) return true;
    return kanonickyJson(novy.obsah) !== kanonickyJson(stary.obsah);
  }

  const idcka = lekce.map((l) => l.id);
  const dotaz = `${url}/rest/v1/lekce?select=id,faze,tyden,poradi,tema,kapitola,varianta,obsah,verejna,otevrit_od,verze${cestina.length ? ',predmet' : ''}` +
                `&id=in.${encodeURIComponent(`(${idcka.join(',')})`)}`;
  let odpoved;
  try {
    odpoved = await fetch(dotaz, { headers: hlavicky(klic) });
  } catch (e) {
    konec(`\nNepodařilo se spojit se Supabase (${url}): ${e.message}`);
  }
  if (!odpoved.ok) konec(`\nČtení stávajících lekcí selhalo: HTTP ${odpoved.status} ${await odpoved.text()}`);
  const stavajici = new Map((await odpoved.json()).map((r) => [r.id, r]));

  const kNahrani = [];
  for (const l of lekce) {
    const novy = radekLekce(l);
    const stary = stavajici.get(l.id);
    if (stary && !seLisi(novy, stary)) {
      console.log(`  = ${l.id} beze změny (verze ${stary.verze})`);
      continue;
    }
    novy.verze = (stary?.verze || 0) + 1;
    console.log(`  ${stary ? '↑' : '+'} ${l.id} → verze ${novy.verze}${stary ? '' : ' (nová)'}`);
    kNahrani.push(novy);
  }

  if (kNahrani.length === 0) {
    console.log('\nVše je aktuální, nic se nenahrává.');
    return;
  }
  if (volby.suchyBeh) {
    console.log(`\nRežim --suchy-beh: nahrálo by se ${kNahrani.length} lekcí. Nic se nezapsalo.`);
    return;
  }

  const zapis = await fetch(`${url}/rest/v1/lekce?on_conflict=id`, {
    method: 'POST',
    headers: { ...hlavicky(klic), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(kNahrani),
  });
  if (!zapis.ok) konec(`\nZápis selhal: HTTP ${zapis.status} ${await zapis.text()}`);
  console.log(`\nHotovo: nahráno ${kNahrani.length} lekcí.`);
}

try {
  await hlavni();
} catch (e) {
  if (!(e instanceof KonecBehu)) throw e;
  console.error(e.message);
  process.exitCode = e.kod;
}
