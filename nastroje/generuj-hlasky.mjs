#!/usr/bin/env node
// Generátor web/js/hlasky.js z obsah/hlasky.md.
// Spuštění z kořene repa:  node nastroje/generuj-hlasky.mjs
//
// Čte markdownové tabulky:
//  - řádky `| `skupina.klic` | kdy | text |`  → HLASKY[klic] = text   (poslední buňka = text)
//  - tabulku za nadpisem/odstavcem „Názvy kapitol" `| `kod` | název |` → KAPITOLY[kod] = název
// `\n` v textu se převede na skutečný nový řádek.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generujTypyChybCj } from './generuj-typy-chyb-cj.mjs';

const koren = join(dirname(fileURLToPath(import.meta.url)), '..');
const zdroj = join(koren, 'obsah', 'hlasky.md');
const cil = join(koren, 'web', 'js', 'hlasky.js');

const md = readFileSync(zdroj, 'utf8').replace(/\r\n/g, '\n');
const hlasky = {};
const kapitoly = {};
let vKapitolach = false;
const chyby = [];

const radky = md.split('\n');
for (const [i, radek] of radky.entries()) {
  if (/^Názvy kapitol/i.test(radek.trim())) { vKapitolach = true; continue; }
  if (/^#/.test(radek)) vKapitolach = false;
  if (!radek.trim().startsWith('|')) continue;
  if (/^\|[\s:|-]+\|$/.test((radky[i + 1] || '').trim())) continue; // záhlaví tabulky (pod ním je |---|)
  const bunky = radek.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((b) => b.trim());
  const klic = /^`([^`]+)`$/.exec(bunky[0] || '')?.[1];
  if (!klic) continue; // oddělovač |---| nebo řádek bez klíče
  if (vKapitolach && bunky.length === 2) {
    kapitoly[klic] = bunky[1];
    continue;
  }
  // skupina smí mít číslici (f2.*, Fáze 2)
  if (!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(klic)) { chyby.push(`ř. ${i + 1}: neplatný klíč „${klic}"`); continue; }
  if (bunky.length < 3) { chyby.push(`ř. ${i + 1}: chybí text u „${klic}"`); continue; }
  if (hlasky[klic] !== undefined) chyby.push(`ř. ${i + 1}: duplicitní klíč „${klic}"`);
  hlasky[klic] = bunky[bunky.length - 1].replace(/\\n/g, '\n');
}

if (chyby.length) {
  console.error('Chyby v obsah/hlasky.md:\n' + chyby.join('\n'));
  process.exit(1);
}

const radkyHlasek = Object.entries(hlasky).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n');
const radkyKapitol = Object.entries(kapitoly).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n');

const vystup = `// GENEROVÁNO z obsah/hlasky.md — needitovat ručně.
// Přegenerování: node nastroje/generuj-hlasky.mjs
//
// Použití:  import { h } from './hlasky.js';
//           el('p', { text: h('zamceno.faze', { datum: '1. 11.' }) })
// Výstup h() je PROSTÝ TEXT — vkládej přes textContent / el({text}), nikdy jako HTML.
// Čisté funkce bez DOM, importovatelné i v Node.

/** Všechny hlášky: klíč 'skupina.nazev' → text s proměnnými {nazev}. */
export const HLASKY = Object.freeze({
${radkyHlasek}
});

/** Názvy kapitol pro {kapitola_nazev}: kód kapitoly (lekce.kapitola) → název malými písmeny. */
export const KAPITOLY = Object.freeze({
${radkyKapitol}
});

/**
 * Vrátí text hlášky s dosazenými proměnnými.
 * Neznámý klíč → vrátí klíč samotný a console.warn. Chybějící proměnná zůstane jako {nazev}.
 * @param {string} klic  např. 'zak.spravne'
 * @param {Object<string, string|number>} [promenne]  např. { n: 2 } pro 'Úloha {n} ze 4 …'
 * @returns {string}
 * @example h('zak.uloha_hotova', { n: 2 }) // 'Úloha 2 ze 4 je hotová. Pokračuj další.'
 */
export function h(klic, promenne = {}) {
  const text = HLASKY[klic];
  if (text === undefined) {
    console.warn(\`hlasky.js: neznámý klíč „\${klic}"\`);
    return klic;
  }
  return text.replace(/\\{([a-z0-9_]+)\\}/gi, (cely, nazev) =>
    (promenne[nazev] === undefined || promenne[nazev] === null ? cely : String(promenne[nazev])));
}
`;

writeFileSync(cil, vystup, 'utf8');
console.log(`Zapsáno ${cil}: ${Object.keys(hlasky).length} hlášek, ${Object.keys(kapitoly).length} kapitol.`);

// ---------------------------------------------------------------------
// Markdownové texty pro rodiče → web/js/*.js (na hostingu složka obsah/ není).
// První řádek „# Nadpis" jde do <PREFIX>_NADPIS (nese ho nadpis modalu), zbytek do <PREFIX>_MD;
// stránky text vykreslí přes renderMarkdown (obsah.js) — i matematiku $…$ a tabulky.
// `adresar` = složka zdroje od kořene repa (výchozí obsah/; manuál češtiny je v cestina/Obsah/).
// ---------------------------------------------------------------------
function generujMarkdown({ zdroj, cil, prefix, vychoziNadpis, adresar = 'obsah' }) {
  const text = readFileSync(join(koren, adresar, zdroj), 'utf8').replace(/\r\n/g, '\n').trim();
  const nadpis = /^#\s+(.+)$/.exec(text.split('\n')[0])?.[1]?.trim() || vychoziNadpis;
  const telo = text.replace(/^#\s+.+\n+/, '').trim();
  const soubor = join(koren, 'web', 'js', cil);
  writeFileSync(soubor, `// GENEROVÁNO z ${adresar}/${zdroj} — needitovat ručně.
// Přegenerování: node nastroje/generuj-hlasky.mjs
//
// Použití:  import { ${prefix}_NADPIS, ${prefix}_MD } from './${cil}';
//           uzel.append(renderMarkdown(${prefix}_MD));   // obsah.js, po await nacistKnihovny()

/** Nadpis (první řádek „# …" ze zdroje). */
export const ${prefix}_NADPIS = ${JSON.stringify(nadpis)};

/** Text v Markdownu (bez úvodního nadpisu). */
export const ${prefix}_MD = ${JSON.stringify(telo)};
`, 'utf8');
  console.log(`Zapsáno ${soubor}: „${nadpis}", ${telo.length} znaků.`);
}

// ---------------------------------------------------------------------
// Slovník typů chyb obsah/typy-chyb.md → web/js/typy-chyb.js (R34: popis typ_chyby i u rodiče, ne jen v adminu).
// Tabulky se záhlavím „kód": 1. buňka `kod` (případný odkaz „(A)" za kódem se ignoruje), 2. buňka popis →
// první věta bez Markdownu. Kód definovaný víckrát (oddíl K odkazuje na A, E) bere první výskyt.
// Oddíl B = detektivní kódy (ve statistikách zvlášť).
// ---------------------------------------------------------------------
function generujTypyChyb() {
  const radkyMd = readFileSync(join(koren, 'obsah', 'typy-chyb.md'), 'utf8').replace(/\r\n/g, '\n').split('\n');
  const popisy = {};
  const detektiv = [];
  let oddil = null;
  let vTabulce = false;
  for (const radek of radkyMd) {
    const nadpis = /^##\s+([A-Z]{1,2})\.\s/.exec(radek); // oddíly A–Z a AA–AD (Fáze 2)
    // Nadpis „## X." určuje oddíl; jiný nadpis 1.–2. úrovně oddíl ruší; podnadpisy (###, např. D1, D2) ho drží.
    if (/^#/.test(radek)) {
      if (nadpis) oddil = nadpis[1];
      else if (/^#{1,2}\s/.test(radek)) oddil = null;
      vTabulce = false;
      continue;
    }
    if (!radek.trim().startsWith('|')) { vTabulce = false; continue; }
    const bunky = radek.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((b) => b.trim());
    if (/^kód$/i.test(bunky[0])) { vTabulce = true; continue; }
    if (!vTabulce || !oddil) continue;
    const kod = /^`([a-z0-9-]+)`/.exec(bunky[0])?.[1];
    if (!kod || popisy[kod] !== undefined) continue;
    const text = (bunky[1] || '').replace(/\*\*/g, '').replace(/\$/g, '').replace(/`/g, '').trim();
    const veta = (/^.*?[.!?](?=\s|$)/.exec(text)?.[0] || text).replace(/\.$/, '');
    popisy[kod] = veta.charAt(0).toUpperCase() + veta.slice(1);
    if (oddil === 'B') detektiv.push(kod);
  }
  const soubor = join(koren, 'web', 'js', 'typy-chyb.js');
  writeFileSync(soubor, `// GENEROVÁNO z obsah/typy-chyb.md — needitovat ručně.
// Přegenerování: node nastroje/generuj-hlasky.mjs
// Ruční kratší popisy pro admin a rodiče mají přednost: web/js/chyby.js (popisChyby).

/** Kód typ_chyby → popis (první věta ze slovníku). */
export const POPISY_TYPU_CHYB = Object.freeze({
${Object.entries(popisy).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')}
});

/** Detektivní kódy (oddíl B) — ve statistikách zvlášť. */
export const DETEKTIVNI_KODY = Object.freeze(${JSON.stringify(detektiv)});
`, 'utf8');
  console.log(`Zapsáno ${soubor}: ${Object.keys(popisy).length} typů chyb (detektivních ${detektiv.length}).`);
}

generujTypyChyb();
generujTypyChybCj(); // čeština: cestina/Obsah/TYPY-CHYB.md → web/js/typy-chyb-cj.js (popis + otázka pro rodiče)
generujMarkdown({ zdroj: 'manual-rodice.md', cil: 'manual.js', prefix: 'MANUAL', vychoziNadpis: 'Jak vést lekci' });
// čeština (KONTROLA-2026-09-30 C4): manuál rodiče pro lekce češtiny — menu.js ho vybere podle předmětu stránky
generujMarkdown({ zdroj: 'manual-rodice-cj.md', adresar: 'cestina/Obsah', cil: 'manual-cj.js', prefix: 'MANUAL_CJ', vychoziNadpis: 'Jak vést lekci češtiny' });
generujMarkdown({ zdroj: 'cteni-zapisu.md', cil: 'cteni-zapisu.js', prefix: 'CTENI', vychoziNadpis: 'Jak číst zápisy nahlas' });