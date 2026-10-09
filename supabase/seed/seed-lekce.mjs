#!/usr/bin/env node
// =====================================================================
// seed-lekce.mjs — validace a nahrání lekcí z obsah/lekce/*.json do tabulky public.lekce
//
// Použití (z kořene repa):
//   node supabase/seed/seed-lekce.mjs --jen-validace        jen kontrola, bez sítě a bez klíče
//   node supabase/seed/seed-lekce.mjs --suchy-beh --otevrit-od 2026-11-02   zjistí, co by se změnilo, nic nezapíše
//   node supabase/seed/seed-lekce.mjs --otevrit-od 2026-11-02               validace + upsert změněných lekcí
// Volby:
//   --adresar <cesta>             jiný adresář s JSON lekcemi (výchozí obsah/lekce; čeština obsah/cestina/lekce)
//   --soubor <cesta>              jen tento soubor (smí se opakovat; adresář se pak nečte)
//   --lekce <id>[,<id>…]          jen tyto lekce podle id (M8-… v obsah/lekce, cj-… v obsah/cestina/lekce);
//                                 smí se opakovat. Pro autory: rychlá kontrola jednoho souboru.
//   --vcetne-nezkontrolovanych    nahraje i lekce s kontrola.jistota 'nizka' / 'neurceno'
//   --otevrit-od RRRR-MM-DD       Spolu 8 (fáze osma, oba předměty): den, kdy se otevřou VŠECHNY lekce najednou
//                                 (půlnoc v Praze). Bez něj se fáze osma nenahraje.
//   --verejna                     lekce fáze osma budou „verejna“ (vidí je každý přihlášený i před --otevrit-od);
//                                 bez volby verejna = false
//   --otevrit-od-zaklady RRRR-MM-DD  (jen starší fáze zaklady ze Spolu) týden 1 ten den, další týdny v pondělí.
//
// Spolu 8: v obsah/ smí být jen lekce fáze osma (ZADANI-OSMA §5). Matematika v obsah/lekce, čeština v obsah/cestina/lekce.
// Seed na konci vypíše, které z 40 lekcí a diagnostiky v daném předmětu ještě chybí (jen informace).
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
import { zkontrolujLekci, kontrolaParuSimulaci, nactiSlovnikChyb, jeObjekt, kanonickyJson, OSMA } from './validator.mjs';
import { parsujSlovnikChybCj } from './validator-cj.mjs';
import { parsujDatum, otevritOdZaklady, pulnocVPraze } from './otevreni-cj.mjs';

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
// SPOLU_AUDIO_MD: jiný seznam nahrávek (testy se syntetickými lekcemi, testy/data/osma/AUDIO.md)
const CESTA_AUDIO_CJ = process.env.SPOLU_AUDIO_MD ? path.resolve(process.env.SPOLU_AUDIO_MD) : path.join(KOREN_REPA, 'cestina', 'Obsah', 'AUDIO.md');

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
/** Hodnoty volby: `--x hodnota` i `--x=hodnota`, volba se smí opakovat. Process.exit je tu bezpečný (ještě žádná síť). */
function hodnotyVolby(jmeno) {
  const vysledek = [];
  argv.forEach((a, i) => {
    if (a === jmeno) {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) { console.error(`Chybí hodnota za ${jmeno}.`); process.exit(1); }
      vysledek.push(argv[i + 1]);
    } else if (a.startsWith(`${jmeno}=`)) vysledek.push(a.slice(jmeno.length + 1));
  });
  return vysledek;
}
function datumVolby(jmeno) {
  const h = hodnotyVolby(jmeno);
  if (!h.length) return undefined;
  const d = parsujDatum(h[h.length - 1]);
  if (!d) { console.error(`Neplatné datum za ${jmeno}: "${h[h.length - 1]}" (čekám RRRR-MM-DD).`); process.exit(1); }
  return d;
}
const adresare = hodnotyVolby('--adresar');
if (adresare.length) volby.adresar = path.resolve(adresare[adresare.length - 1]);
volby.soubory = hodnotyVolby('--soubor').map((s) => path.resolve(s));
volby.lekce = hodnotyVolby('--lekce').flatMap((s) => s.split(',')).map((s) => s.trim()).filter(Boolean);
volby.spusteniZaklady = datumVolby('--otevrit-od-zaklady');
volby.otevritOd = datumVolby('--otevrit-od');
volby.verejna = argv.includes('--verejna');

/** Adresář s lekcemi předmětu (výchozí). */
const ADR_MAT = path.join(KOREN_REPA, 'obsah', 'lekce');
const ADR_CJ = path.join(KOREN_REPA, 'obsah', 'cestina', 'lekce');
// --lekce M8-T03-L2 → obsah/lekce/M8-T03-L2.json; cj-… → obsah/cestina/lekce (pokud není dán --adresar)
for (const id of volby.lekce) {
  const adr = adresare.length ? volby.adresar : (/^cj-/.test(id) ? ADR_CJ : ADR_MAT);
  volby.soubory.push(path.join(adr, `${id}.json`));
}
/** Je soubor v obsah/ (ostrý obsah Spolu 8)? Tam smí být jen fáze osma. */
const vObsahu = (cesta) => path.resolve(cesta).startsWith(path.join(KOREN_REPA, 'obsah') + path.sep);

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

  let cesty;
  if (volby.soubory.length) {
    const chybi = volby.soubory.filter((c) => !existsSync(c));
    if (chybi.length) konec(`Soubor neexistuje: ${chybi.map((c) => path.relative(process.cwd(), c)).join(', ')}`);
    cesty = [...new Set(volby.soubory)];
    console.log(`Kontroluji ${cesty.length} ${cesty.length === 1 ? 'soubor' : cesty.length < 5 ? 'soubory' : 'souborů'}\n`);
  } else {
    if (!existsSync(volby.adresar)) konec(`Adresář s lekcemi neexistuje: ${volby.adresar}`);
    const nazvy = (await readdir(volby.adresar)).filter((n) => n.endsWith('.json')).sort();
    if (nazvy.length === 0) {
      // Spolu 8: autoři teprve píšou — prázdná složka obsahu není chyba validace
      if (volby.jenValidace && vObsahu(path.join(volby.adresar, 'x'))) { console.log(`V ${path.relative(process.cwd(), volby.adresar)} zatím nejsou žádné lekce.`); return; }
      konec(`V ${volby.adresar} nejsou žádné .json lekce.`);
    }
    cesty = nazvy.map((n) => path.join(volby.adresar, n));
    console.log(`Kontroluji ${cesty.length} lekcí v ${path.relative(process.cwd(), volby.adresar) || '.'}\n`);
  }
  const soubory = cesty;

  let lekce = [];
  const vsechnyNactene = [];
  const videnaIdLekci = new Map();
  const videnaIdUloh = new Map();
  let celkemChyb = 0;
  let celkemVarovani = 0;

  for (const cesta of soubory) {
    const nazev = path.basename(cesta);
    let data;
    const chyby = [];
    let varovani = [];
    try {
      data = JSON.parse((await readFile(cesta, 'utf8')).replace(/^\uFEFF/, ''));
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
      if (jeObjekt(data) && /^F2-VZOR-/.test(String(data.id)) && vObsahu(cesta)) {
        chyby.push(`${data.id} je vzorová lekce frontendu — patří do testy/data, ne do obsah/lekce`);
      }
      // Spolu 8: v obsah/ jen fáze osma, každý předmět ve své složce (ZADANI-OSMA §5)
      if (jeObjekt(data) && vObsahu(cesta)) {
        if (data.faze !== 'osma') chyby.push(`v obsah/ patří jen lekce Spolu 8 ("faze": "osma"), je "${data.faze}"`);
        const slozkaCj = path.dirname(path.resolve(cesta)) === ADR_CJ;
        if (cj && !slozkaCj) chyby.push('lekce češtiny patří do obsah/cestina/lekce');
        if (!cj && slozkaCj) chyby.push('lekce matematiky patří do obsah/lekce');
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
  if (!volby.soubory.length) vypisChybejici(vsechnyNactene);
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
  // Spolu 8 (fáze osma): všechny lekce se otevřou najednou v den --otevrit-od (rozhodne Pavel před spuštěním).
  const osma = lekce.filter((l) => l.faze === 'osma');
  if (osma.length && !volby.otevritOd) {
    konec(`\nLekce Spolu 8 (${osma.length}×) potřebují den otevření: --otevrit-od RRRR-MM-DD (volitelně --verejna). Nic se nenahrálo.`);
  }
  // Starší čeština Spolu (fáze zaklady): datum spuštění je parametr; zápis jen po migraci se sloupcem predmet (ověří se níž).
  const zaklady = cestina.filter((l) => l.faze === 'zaklady');
  if (zaklady.length && !volby.spusteniZaklady) {
    konec(`\nLekce češtiny (${zaklady.map((l) => l.id).join(', ')}) potřebují den spuštění: --otevrit-od-zaklady RRRR-MM-DD. Nic se nenahrálo.`);
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

  // Pojistka: bez sloupce lekce.predmet (supabase/migrations/0001_schema.sql Spolu 8) se nic nezapíše.
  if (cestina.length || osma.length) {
    let test;
    try {
      test = await fetch(`${url}/rest/v1/lekce?select=predmet&limit=1`, { headers: hlavicky(klic) });
    } catch (e) {
      konec(`\nNepodařilo se spojit se Supabase (${url}): ${e.message}`);
    }
    if (!test.ok) {
      konec(`\nTabulka lekce nemá sloupec predmet (HTTP ${test.status}) — migrace supabase/migrations/ (0001_schema.sql Spolu 8, ` +
            'dříve 0007_predmet.sql) ještě není aplikovaná (nejdřív npm run migrovat). Nic se nezapsalo.');
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
      varianta: l.varianta || (l.faze === 'osma' ? 'z8' : 'z9'), // Spolu 8 = z8 (čeština pole nemá)
      obsah: l,
      verejna: l.faze === 'osma' ? volby.verejna : l.faze === 'pilot',
      otevrit_od: l.faze === 'osma' ? pulnocVPraze(volby.otevritOd)
        : cj ? otevritOdZaklady(l.tyden, volby.spusteniZaklady) : OTEVRIT_OD[l.faze],
    };
    // predmet: Spolu 8 vždy (DB ho má od 0001); starší matematika bez něj (výchozí 'matematika')
    if (cj || l.faze === 'osma') radek.predmet = cj ? 'cestina' : 'matematika';
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
  const dotaz = `${url}/rest/v1/lekce?select=id,faze,tyden,poradi,tema,kapitola,varianta,obsah,verejna,otevrit_od,verze${cestina.length || osma.length ? ',predmet' : ''}` +
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

/**
 * Spolu 8: které lekce předmětu ještě chybí (celý rok: 160 lekcí + 2 testy). Jen informace pro autory, ne chyba.
 * @param {object[]} nactene
 */
function vypisChybejici(nactene) {
  const osma = nactene.filter((l) => jeObjekt(l) && l.faze === 'osma');
  if (!osma.length) return;
  const ma = new Set(osma.map((l) => l.id));
  for (const cj of [false, true]) {
    if (!osma.some((l) => (l.predmet === 'cestina') === cj)) continue;
    // celý rok (ZADANI-OSMA §9): učební + naostro + B-varianty obou, úvodní a pololetní test = 162 souborů
    const ocekavane = cj ? ['cj-t0-diag', 'cj-t0-pol'] : ['M8-T00-DIAG', 'M8-T00-POL'];
    for (let t = 1; t <= OSMA.temat; t++) {
      for (let n = 1; n <= OSMA.lekciVTematu; n++) {
        const id = cj ? `cj-t${t}-l${(t - 1) * OSMA.lekciVTematu + n}` : `M8-T${String(t).padStart(2, '0')}-L${n}`;
        for (const pripona of cj ? ['', 'n', 'b', 'nb'] : ['', 'N', 'B', 'NB']) ocekavane.push(`${id}${pripona}`);
      }
    }
    const chybi = ocekavane.filter((id) => !ma.has(id));
    console.log(`${cj ? 'Čeština' : 'Matematika'} Spolu 8: ${ocekavane.length - chybi.length}/${ocekavane.length} souborů` +
      (chybi.length ? `; chybí: ${chybi.length > 12 ? `${chybi.slice(0, 12).join(', ')} … (+${chybi.length - 12})` : chybi.join(', ')}` : ' — kompletní'));
  }
}

try {
  await hlavni();
} catch (e) {
  if (!(e instanceof KonecBehu)) throw e;
  console.error(e.message);
  process.exitCode = e.kod;
}
