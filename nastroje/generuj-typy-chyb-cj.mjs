#!/usr/bin/env node
// Generátor web/js/typy-chyb-cj.js ze slovníku chyb češtiny cestina/Obsah/TYPY-CHYB.md.
// Spouští ho i node nastroje/generuj-hlasky.mjs (jedním příkazem se přegenerují všechny texty webu);
// samostatně:  node nastroje/generuj-typy-chyb-cj.mjs
//
// Čte tabulky se záhlavím „Kód | … | Otázka pro rodiče": 1. buňka kód(y), 2. buňka „Co dítě udělá / Co se stane",
// poslední buňka otázka pro rodiče. Pravidla převodu:
//  - „`a` / `b`" v buňce kódu = dva kódy se stejným řádkem; vyjmenovaná slova `vs-<p>-<x>-za-<y>` dostanou
//    popis „Po P napíše x místo y" (řádek má jen souhrnné „i/y po B"), příklady „*a* / *b*" se rozdělí po kódech;
//  - popis jen z příkladu (*malý psi*) → „Napíše „malý psi"“; „totéž …" (popis i otázka) = předchozí řádek;
//  - poznámky pro tým v závorce („(doplněno …)", „(kód ponechán …)", „(upřesněno / přejmenováno / rozšířeno …)") a „— *pozn.: …*" se vypouštějí;
//  - kód se zástupným jevem (`diktat-pravopis-<kód>`) se negeneruje: popis i otázku skládá chyby.js z jevu.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const koren = join(dirname(fileURLToPath(import.meta.url)), '..');

const bezMd = (t) => String(t ?? '').replace(/\*\*/g, '').replace(/`/g, '').trim();
const velke = (t) => (t ? t.charAt(0).toLocaleUpperCase('cs') + t.slice(1) : t);
const bezPoznamek = (t) => String(t)
  .replace(/\s*\((?:doplněno|kód ponechán|upřesněno|přejmenováno|rozšířeno)[^)]*\)/gi, '')
  .replace(/\s*[—–-]\s*\*pozn\.[^*]*\*\s*$/i, '')
  .trim();

/** Přímá řeč „…“ z buňky otázky (bez poznámek za ní); bez uvozovek vrátí text celý. */
function otazkaZBunky(bunka) {
  const t = bezPoznamek(bunka);
  const od = t.indexOf('„');
  const po = t.lastIndexOf('“');
  return od >= 0 && po > od ? t.slice(od, po + 1) : bezMd(t);
}

/** Popis z buňky „Co dítě udělá": kurzíva samotná (jen příklad) → „Napíše „…““. */
function popisZBunky(bunka) {
  const t = bezPoznamek(bunka);
  const kurzivy = /^\*[^*]+\*(\s*\/\s*\*[^*]+\*)*$/.test(t);
  if (kurzivy) return `Napíše ${t.split(/\s*\/\s*/).map((x) => `„${x.replace(/\*/g, '').trim()}“`).join(' / ')}`;
  return velke(t.replace(/\*/g, '').trim());
}

export function nactiTypyChybCj(soubor = join(koren, 'cestina', 'Obsah', 'TYPY-CHYB.md')) {
  const radky = readFileSync(soubor, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const typy = {};
  const chyby = [];
  let sloupce = null; // index sloupců aktuální tabulky {popis, priklad, otazka}
  let predchozi = null; // {popis, otazka} předchozího řádku (pro „totéž")
  for (const [i, radek] of radky.entries()) {
    if (!radek.trim().startsWith('|')) { sloupce = null; continue; }
    const bunky = radek.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((b) => b.trim());
    if (/^kód$/i.test(bunky[0])) {
      const idx = (re) => bunky.findIndex((b) => re.test(b));
      sloupce = { popis: 1, priklad: idx(/^příklad$/i), otazka: idx(/^otázka pro rodiče$/i) };
      if (sloupce.otazka < 0) sloupce = null;
      predchozi = null;
      continue;
    }
    if (!sloupce || /^[\s:-]+$/.test(bunky[0])) continue;
    const kody = [...bunky[0].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (!kody.length) continue;
    const surovyPopis = bunky[sloupce.popis] || '';
    const surovaOtazka = bunky[sloupce.otazka] || '';
    const popisRadku = /^totéž/i.test(surovyPopis.trim()) && predchozi ? predchozi.popis : popisZBunky(surovyPopis);
    const otazkaRadku = /^totéž/i.test(surovaOtazka.trim()) && predchozi ? predchozi.otazka : otazkaZBunky(surovaOtazka);
    const priklady = sloupce.priklad >= 0 ? bezPoznamek(bunky[sloupce.priklad] || '').split(/\s*\/\s*/) : [];
    predchozi = { popis: popisRadku, otazka: otazkaRadku };
    for (const [k, kod] of kody.entries()) {
      if (/[<>]/.test(kod)) continue; // zástupný kód (diktat-pravopis-<kód>) skládá chyby.js
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(kod)) { chyby.push(`ř. ${i + 1}: neplatný kód „${kod}“`); continue; }
      if (typy[kod]) { chyby.push(`ř. ${i + 1}: duplicitní kód „${kod}“`); continue; }
      let popis = popisRadku;
      const vs = /^vs-([a-z])-([iy])-za-([iy])$/.exec(kod);
      if (vs) {
        const priklad = kody.length > 1 && priklady.length === kody.length ? priklady[k].replace(/\(.*\)/, '').replace(/\*/g, '').trim() : '';
        popis = `Po ${vs[1].toUpperCase()} napíše ${vs[2]} místo ${vs[3]}${priklad ? ` („${priklad}“)` : ''}`;
      }
      if (!popis || !otazkaRadku) { chyby.push(`ř. ${i + 1}: kód „${kod}“ nemá popis nebo otázku`); continue; }
      typy[kod] = { popis, otazka: otazkaRadku };
    }
  }
  return { typy, chyby };
}

export function generujTypyChybCj() {
  const { typy, chyby } = nactiTypyChybCj();
  if (chyby.length) {
    console.error('Chyby v cestina/Obsah/TYPY-CHYB.md:\n' + chyby.join('\n'));
    process.exit(1);
  }
  const soubor = join(koren, 'web', 'js', 'typy-chyb-cj.js');
  writeFileSync(soubor, `// GENEROVÁNO z cestina/Obsah/TYPY-CHYB.md — needitovat ručně.
// Přegenerování: node nastroje/generuj-hlasky.mjs (nebo node nastroje/generuj-typy-chyb-cj.mjs)
// Použití přes web/js/chyby.js: popisChyby(kod), otazkaChyby(kod) — i složené kódy diktat-pravopis-<kód>.

/** Kód typ_chyby češtiny → { popis: co dítě udělalo, otazka: otázka pro rodiče „…“ }. */
export const TYPY_CHYB_CJ = Object.freeze({
${Object.entries(typy).map(([k, v]) => `  ${JSON.stringify(k)}: Object.freeze(${JSON.stringify(v)}),`).join('\n')}
});
`, 'utf8');
  console.log(`Zapsáno ${soubor}: ${Object.keys(typy).length} typů chyb češtiny.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) generujTypyChybCj();
