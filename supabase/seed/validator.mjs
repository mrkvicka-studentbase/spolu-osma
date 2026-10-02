// =====================================================================
// validator.mjs — validace JSON lekcí (schéma + doménové kontroly)
// Používá supabase/seed/seed-lekce.mjs a testy v testy/validator.test.js.
// Čisté funkce bez sítě; jediný vstup z disku je nactiSlovnikChyb().
// =====================================================================

import { readFile } from 'node:fs/promises';
import { domenoveKontrolyCj } from './validator-cj.mjs';
import { KAPITOLY } from '../../web/js/hlasky.js';

export const PORADI_TYPU_ULOH = ['rozcvicka', 'detektiv', 'cermat', 'semafor'];

/** Pseudo-kapitoly lekce (ne obsah): smíšený blok, simulace, diagnostika. */
const PSEUDO_KAPITOLY = ['mix', 'simulace', 'diagnostika'];

/** Spolu 8: počet témat a lekcí v tématu (ZADANI-OSMA §2). */
export const OSMA = Object.freeze({ temat: 10, lekciVTematu: 4, diagUloh: [20, 25], casDiag: 25 });

/**
 * Kapitola mimo známé kódy (obsah/hlasky.md, tabulka „Názvy kapitol“ → web/js/hlasky.js KAPITOLY).
 * Schéma pustí každý kód ve tvaru ^[a-z][a-z-]+$; neznámý se hlásí jako VAROVÁNÍ, ne chyba (osnovy Spolu 8 se ještě píšou).
 * @param {string} kod
 * @returns {string|null} text varování, nebo null
 */
export function varovaniKapitoly(kod, kde = 'kapitola') {
  if (typeof kod !== 'string' || !/^[a-z][a-z-]+$/.test(kod) || PSEUDO_KAPITOLY.includes(kod)) return null;
  if (Object.prototype.hasOwnProperty.call(KAPITOLY, kod)) return null;
  return `${kde}: kapitola "${kod}" zatím není v obsah/hlasky.md (tabulka „Názvy kapitol“) — doplň řádek a spusť node nastroje/generuj-hlasky.mjs`;
}

// ---------------------------------------------------------------------
// Pomocné funkce
// ---------------------------------------------------------------------

/** JSON se seřazenými klíči — pro porovnání obsahu nezávisle na pořadí klíčů. */
export function kanonickyJson(h) {
  if (Array.isArray(h)) return '[' + h.map(kanonickyJson).join(',') + ']';
  if (h && typeof h === 'object') {
    return '{' + Object.keys(h).sort().map((k) => JSON.stringify(k) + ':' + kanonickyJson(h[k])).join(',') + '}';
  }
  return JSON.stringify(h);
}

export const jeObjekt = (h) => h !== null && typeof h === 'object' && !Array.isArray(h);
const pocetSlov = (s) => (typeof s === 'string' ? s.trim().split(/\s+/).filter(Boolean).length : 0);
const nsd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

// ---------------------------------------------------------------------
// Mini validátor JSON Schema (podmnožina draft 2020-12, kterou používá obsah/schema.json):
// type, const, enum, required, properties, patternProperties, additionalProperties,
// items, prefixItems, minItems, maxItems, minLength, maxLength, pattern, minimum, maximum,
// allOf, oneOf, if/then/else, dependentRequired, $ref (#/$defs/...)
// ---------------------------------------------------------------------
function typSedi(typ, h) {
  switch (typ) {
    case 'object': return jeObjekt(h);
    case 'array': return Array.isArray(h);
    case 'string': return typeof h === 'string';
    case 'integer': return Number.isInteger(h);
    case 'number': return typeof h === 'number' && Number.isFinite(h);
    case 'boolean': return typeof h === 'boolean';
    case 'null': return h === null;
    default: throw new Error(`Validátor nezná typ "${typ}"`);
  }
}

function vyresRef(ref, koren) {
  if (!ref.startsWith('#/')) throw new Error(`Nepodporovaný $ref: ${ref}`);
  let uzel = koren;
  for (const cast of ref.slice(2).split('/')) {
    uzel = uzel?.[cast.replace(/~1/g, '/').replace(/~0/g, '~')];
    if (uzel === undefined) throw new Error(`Neexistující $ref: ${ref}`);
  }
  return uzel;
}

/**
 * Ověří data proti schématu. Vrací pole chybových hlášek (prázdné = platné).
 * @param {object|boolean} schema
 * @param {*} data
 * @param {string} cesta   JSON cesta pro hlášky, např. "ulohy[2].kroky[0]"
 * @param {object} koren  kořen schématu (pro $ref)
 * @returns {string[]}
 */
export function validuj(schema, data, cesta, koren) {
  if (schema === true || schema === undefined) return [];
  if (schema === false) return [`${cesta}: pole není povoleno`];
  const chyby = [];
  const kde = cesta || '(lekce)';

  if (schema.$ref) chyby.push(...validuj(vyresRef(schema.$ref, koren), data, cesta, koren));

  if (schema.type !== undefined) {
    const typy = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!typy.some((t) => typSedi(t, data))) {
      chyby.push(`${kde}: očekáván typ ${typy.join(' | ')}, je ${data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data}`);
      return chyby; // další klíčová slova nemá smysl kontrolovat
    }
  }
  if ('const' in schema && kanonickyJson(schema.const) !== kanonickyJson(data)) {
    chyby.push(`${kde}: musí být ${JSON.stringify(schema.const)}, je ${JSON.stringify(data)}`);
  }
  if (schema.enum && !schema.enum.some((e) => kanonickyJson(e) === kanonickyJson(data))) {
    chyby.push(`${kde}: musí být jedna z hodnot ${schema.enum.map((e) => JSON.stringify(e)).join(', ')}, je ${JSON.stringify(data)}`);
  }

  if (typeof data === 'string') {
    if (schema.minLength !== undefined && data.length < schema.minLength) chyby.push(`${kde}: text je prázdný nebo příliš krátký`);
    if (schema.maxLength !== undefined && data.length > schema.maxLength) chyby.push(`${kde}: text je delší než ${schema.maxLength} znaků`);
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(data)) chyby.push(`${kde}: "${data}" neodpovídá vzoru ${schema.pattern}`);
  }
  if (typeof data === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) chyby.push(`${kde}: ${data} je menší než ${schema.minimum}`);
    if (schema.maximum !== undefined && data > schema.maximum) chyby.push(`${kde}: ${data} je větší než ${schema.maximum}`);
  }

  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) chyby.push(`${kde}: má ${data.length} položek, minimum je ${schema.minItems}`);
    if (schema.maxItems !== undefined && data.length > schema.maxItems) chyby.push(`${kde}: má ${data.length} položek, maximum je ${schema.maxItems}`);
    const prefix = schema.prefixItems || [];
    data.forEach((polozka, i) => {
      const sub = i < prefix.length ? prefix[i] : schema.items;
      if (sub !== undefined) chyby.push(...validuj(sub, polozka, `${cesta}[${i}]`, koren));
    });
  }

  if (jeObjekt(data)) {
    for (const pole of schema.required || []) {
      if (!(pole in data)) chyby.push(`${kde}: chybí povinné pole "${pole}"`);
    }
    for (const [pole, zavisla] of Object.entries(schema.dependentRequired || {})) {
      if (!(pole in data)) continue;
      for (const z of zavisla) if (!(z in data)) chyby.push(`${kde}: pole "${pole}" vyžaduje i pole "${z}"`);
    }
    const vlastnosti = schema.properties || {};
    const vzory = Object.entries(schema.patternProperties || {}).map(([v, s]) => [new RegExp(v, 'u'), s]);
    for (const [klic, hodnota] of Object.entries(data)) {
      const podcesta = cesta ? `${cesta}.${klic}` : klic;
      let znamy = false;
      if (klic in vlastnosti) { znamy = true; chyby.push(...validuj(vlastnosti[klic], hodnota, podcesta, koren)); }
      for (const [re, s] of vzory) if (re.test(klic)) { znamy = true; chyby.push(...validuj(s, hodnota, podcesta, koren)); }
      if (!znamy && schema.additionalProperties !== undefined) {
        if (schema.additionalProperties === false) chyby.push(`${kde}: nepovolené pole "${klic}" (překlep? vlastní pole jen s prefixem x_)`);
        else chyby.push(...validuj(schema.additionalProperties, hodnota, podcesta, koren));
      }
    }
  }

  for (const sub of schema.allOf || []) chyby.push(...validuj(sub, data, cesta, koren));

  if (schema.oneOf) {
    const vysledky = schema.oneOf.map((sub) => validuj(sub, data, cesta, koren));
    const platne = vysledky.filter((v) => v.length === 0).length;
    if (platne === 0) {
      // ukaž chyby varianty, která je nejblíž (nejméně chyb)
      const nejblizsi = vysledky.reduce((a, b) => (b.length < a.length ? b : a));
      chyby.push(...nejblizsi);
    } else if (platne > 1) {
      chyby.push(`${kde}: odpovídá více variantám oneOf najednou`);
    }
  }

  if (schema.if !== undefined) {
    const podminka = validuj(schema.if, data, cesta, koren).length === 0;
    if (podminka && schema.then !== undefined) chyby.push(...validuj(schema.then, data, cesta, koren));
    if (!podminka && schema.else !== undefined) chyby.push(...validuj(schema.else, data, cesta, koren));
  }

  return chyby;
}

// ---------------------------------------------------------------------
// Doménové kontroly (co JSON Schema neumí nebo co chceme hlásit srozumitelněji)
// ---------------------------------------------------------------------
const ZAKAZANY_ZACATEK_POPISKU = /^(vypo[čc][íi]tej|spo[čc][íi]tej|se[čc]ti|ode[čc]ti|vyn[áa]sob|vyd[ěe]l|zkra[ťt]|rozlo[žz]|p[řr]eve[ďd]|dosa[ďd])/i;

function lichyPocetDolaru(s) {
  return typeof s === 'string' && (s.match(/(?<!\\)\$/g) || []).length % 2 === 1;
}

// ---------------------------------------------------------------------
// Slovník typů chyb (obsah/typy-chyb.md)
// ---------------------------------------------------------------------

/**
 * Vytáhne kódy typů chyb z Markdownu slovníku: první buňka řádku tabulky ve tvaru | `kod` | …
 * (nadpisy s kódy kapitol se záměrně nepočítají).
 * @param {string} md
 * @returns {Set<string>}
 */
export function parsujSlovnikChyb(md) {
  const kody = new Set();
  // Počítají se jen tabulky, jejichž záhlaví má v 1. sloupci „kód" (jiné tabulky, např.
  // přehled kapitol, mají v 1. sloupci také kódy v backtickách, ale nejsou to typy chyb).
  let vTabulceKodu = false;
  let predchoziByloZahlavi = false;
  for (const radek of md.split(/\r?\n/)) {
    if (!/^\s*\|/.test(radek)) { vTabulceKodu = false; predchoziByloZahlavi = false; continue; }
    const prvni = radek.split('|')[1]?.trim() ?? '';
    if (/^:?-{3,}/.test(prvni)) { predchoziByloZahlavi = false; continue; }   // oddělovač |---|
    if (!predchoziByloZahlavi && !vTabulceKodu && !prvni.startsWith('`')) {
      vTabulceKodu = /^kód$/i.test(prvni.replace(/\*/g, ''));                // řádek záhlaví
      predchoziByloZahlavi = true;
      continue;
    }
    const m = /^`([a-z0-9]+(?:-[a-z0-9]+)*)`$/.exec(prvni);
    if (vTabulceKodu && m) kody.add(m[1]);
  }
  return kody;
}

/** Načte a naparsuje slovník ze souboru. @returns {Promise<Set<string>>} */
export async function nactiSlovnikChyb(cesta) {
  return parsujSlovnikChyb(await readFile(cesta, 'utf8'));
}

function kontrolaTypuChyby(kod, kde, chyba, slovnik) {
  if (!slovnik || typeof kod !== 'string' || !kod.trim()) return;
  if (!slovnik.has(kod)) chyba(`${kde}: typ_chyby "${kod}" není ve slovníku obsah/typy-chyb.md`);
}

// ---------------------------------------------------------------------
// Vstup `vyraz` — jen hrubá kontrola (skutečný parser je ve frontendu)
// ---------------------------------------------------------------------
/**
 * Hrubá kontrola zápisu výrazu (spravne.vyraz, zname_chyby[].vyraz).
 * @param {string} v
 * @param {string[]} [promenne=['x']]  vstup.promenne kroku (frontend je bere stejně)
 * @returns {string|null} popis problému, nebo null = v pořádku
 */
export function problemVyrazu(v, promenne = ['x']) {
  if (typeof v !== 'string' || !v.trim()) return 'výraz je prázdný';
  const pismena = (Array.isArray(promenne) && promenne.length ? promenne : ['x']).filter((z) => /^[a-z]$/.test(z)).join('');
  const povolene = new RegExp(`^[0-9${pismena}+\\-*·/^²³(),. ]+$`);
  if (!povolene.test(v)) {
    const zle = [...new Set([...v].filter((z) => !povolene.test(z)))].join(' ');
    return `nepovolené znaky: ${zle} (povoleno 0-9 ${[...pismena].join(' ')} + - * · / ^ ² ( ) , . mezera; proměnné podle vstup.promenne)`;
  }
  let hloubka = 0;
  for (const z of v) {
    if (z === '(') hloubka += 1;
    if (z === ')') hloubka -= 1;
    if (hloubka < 0) return 'závorka „)" bez otevírací';
  }
  if (hloubka !== 0) return 'neuzavřená závorka';
  const s = v.replace(/\s+/g, '');
  if (/\(\)/.test(s)) return 'prázdná závorka';
  if (/[+\-*·/^]$/.test(s) || /^[+*·/^]/.test(s)) return 'výraz začíná nebo končí operátorem';
  if (/[+\-*·/^]{2,}/.test(s.replace(/[*·/^]-/g, '#'))) return 'dva operátory za sebou';
  if (/\([+*·/^)]/.test(s) || /[+\-*·/^]\)/.test(s)) return 'operátor u závorky bez operandu';
  return null;
}

const normalizujVyraz = (v) => String(v).replace(/\s+/g, '').replace(/\*/g, '·').replace(/\^2/g, '²');

// ---------------------------------------------------------------------
// Vstup `poradi`
// ---------------------------------------------------------------------

/** Id operací z maker \op{id}{…} ve výrazu, v pořadí výskytu. */
export function idOperaciZVyrazu(vyraz) {
  return [...String(vyraz || '').matchAll(/\\op\{([^}]*)\}/g)].map((m) => m[1]);
}

function jePermutace(poradi, ids) {
  return Array.isArray(poradi) && poradi.length === ids.length && new Set(poradi).size === poradi.length &&
    poradi.every((x) => ids.includes(x));
}

function kontrolaPoradi(k, kde, chyba, varovani) {
  const vyrazIds = idOperaciZVyrazu(k.vstup.vyraz);
  const operace = Array.isArray(k.vstup.operace) ? k.vstup.operace : [];
  const ids = operace.map((o) => o?.id);
  if (vyrazIds.length === 0) chyba(`${kde}: vstup.vyraz neobsahuje žádné \\op{id}{znak}`);
  if (new Set(vyrazIds).size !== vyrazIds.length) chyba(`${kde}: ve výrazu se opakuje \\op se stejným id`);
  if (new Set(ids).size !== ids.length) chyba(`${kde}: duplicitní id v operace[]`);
  if (ids.length > 6) chyba(`${kde}: nejvýš 6 operací, je ${ids.length}`);
  for (const id of vyrazIds) if (!ids.includes(id)) chyba(`${kde}: \\op{${id}} ve výrazu nemá položku v operace[]`);
  for (const id of ids) if (!vyrazIds.includes(id)) chyba(`${kde}: operace "${id}" není ve výrazu jako \\op{${id}}{…}`);

  const povolena = Array.isArray(k.spravne?.poradi) ? k.spravne.poradi : [];
  const klice = new Set();
  povolena.forEach((p, i) => {
    if (!jePermutace(p, ids)) chyba(`${kde}: spravne.poradi[${i}] není pořadí všech operací (${ids.join(', ')})`);
    const klic = JSON.stringify(p);
    if (klice.has(klic)) chyba(`${kde}: spravne.poradi[${i}] je duplicitní`);
    klice.add(klic);
  });
  (Array.isArray(k.zname_chyby) ? k.zname_chyby : []).forEach((z, i) => {
    if (!jePermutace(z?.poradi, ids)) chyba(`${kde}.zname_chyby[${i}]: poradi není pořadí všech operací (${ids.join(', ')})`);
    else if (klice.has(JSON.stringify(z.poradi))) chyba(`${kde}.zname_chyby[${i}]: pořadí je shodné se správným`);
  });
  if (povolena.length > 4) varovani(`${kde}: víc než 4 povolená pořadí — výraz je příliš volný`);
}

// Dlaždice s písmeny (osnova-faze2 §4): počet možností podle druhu, text bez vlastního „A)"
const POCET_PISMEN = { 'A-E': 5, AN: 2, 'A-F': 6 };
const VLASTNI_PISMENO = /^\s*\(?[A-FN]\s*(\)|\.|:|—|–|-)/;

function kontrolaKroku(k, kde, chyba, varovani, slovnik = null) {
  if (!jeObjekt(k) || !jeObjekt(k.vstup)) return;
  const typ = k.vstup.typ;

  (Array.isArray(k.zname_chyby) ? k.zname_chyby : []).forEach((z, i) =>
    kontrolaTypuChyby(z?.typ_chyby, `${kde}.zname_chyby[${i}]`, chyba, slovnik));
  (Array.isArray(k.vstup.moznosti) ? k.vstup.moznosti : []).forEach((m, i) =>
    kontrolaTypuChyby(m?.typ_chyby, `${kde}.moznosti[${i}]`, chyba, slovnik));

  if (typ === 'poradi') kontrolaPoradi(k, kde, chyba, varovani);
  else if (k.vstup.vyraz !== undefined || k.vstup.operace !== undefined) {
    varovani(`${kde}: vstup.vyraz / vstup.operace mají smysl jen u vstupu poradi`);
  }

  if (typ === 'vyraz') {
    const p = problemVyrazu(k.spravne?.vyraz, k.vstup.promenne);
    if (p) chyba(`${kde}: spravne.vyraz „${k.spravne?.vyraz}" — ${p}`);
    (Array.isArray(k.zname_chyby) ? k.zname_chyby : []).forEach((z, i) => {
      const pz = problemVyrazu(z?.vyraz, k.vstup.promenne);
      if (pz) chyba(`${kde}.zname_chyby[${i}]: vyraz „${z?.vyraz}" — ${pz}`);
      else if (!p && normalizujVyraz(z.vyraz) === normalizujVyraz(k.spravne.vyraz)) {
        chyba(`${kde}.zname_chyby[${i}]: známá chyba je shodná se správným výrazem`);
      }
    });
    if (k.vstup.vytknout !== undefined) {
      if (k.kontrola_tvaru !== 'soucin') chyba(`${kde}: vstup.vytknout má smysl jen s kontrola_tvaru soucin`);
      const pv = problemVyrazu(k.vstup.vytknout, k.vstup.promenne);
      if (pv) chyba(`${kde}: vstup.vytknout „${k.vstup.vytknout}" — ${pv}`);
    }
  } else if (k.vstup.vytknout !== undefined) {
    varovani(`${kde}: vstup.vytknout má smysl jen u vstupu vyraz`);
  }

  if (typeof k.popisek === 'string' && ZAKAZANY_ZACATEK_POPISKU.test(k.popisek.trim())) {
    varovani(`${kde}: popisek „${k.popisek}" možná prozrazuje postup (kostra 03 — popisek má být neutrální)`);
  }
  if (lichyPocetDolaru(k.popisek)) varovani(`${kde}: popisek má lichý počet $ (neuzavřená matematika?)`);

  if (typ === 'dlazdice') {
    const moznosti = Array.isArray(k.vstup.moznosti) ? k.vstup.moznosti : [];
    const spravnych = moznosti.filter((m) => m?.spravne === true).length;
    if (spravnych !== 1) chyba(`${kde}: dlaždice musí mít právě 1 správnou možnost, má ${spravnych}`);
    const ids = new Set();
    moznosti.forEach((m, i) => {
      if (!jeObjekt(m)) return;
      if (ids.has(m.id)) chyba(`${kde}.moznosti[${i}]: duplicitní id "${m.id}"`);
      ids.add(m.id);
      if (m.spravne === false && !(typeof m.typ_chyby === 'string' && m.typ_chyby.trim())) {
        chyba(`${kde}.moznosti[${i}] ("${m.id}"): špatná možnost musí mít typ_chyby`);
      }
      if (m.spravne === true && m.typ_chyby) varovani(`${kde}.moznosti[${i}]: správná možnost má typ_chyby — omyl?`);
      if (lichyPocetDolaru(m.text)) varovani(`${kde}.moznosti[${i}]: lichý počet $ v textu`);
      if (k.vstup.pismena && typeof m.text === 'string' && VLASTNI_PISMENO.test(m.text)) {
        chyba(`${kde}.moznosti[${i}]: text „${m.text}" má vlastní písmeno — štítek A)… doplní aplikace (pismena)`);
      }
    });
    if (k.vstup.pismena && POCET_PISMEN[k.vstup.pismena] && moznosti.length !== POCET_PISMEN[k.vstup.pismena]) {
      chyba(`${kde}: pismena "${k.vstup.pismena}" vyžaduje ${POCET_PISMEN[k.vstup.pismena]} možností, má ${moznosti.length}`);
    }
    if (k.spravne !== undefined && k.spravne !== null) varovani(`${kde}: u dlaždic se „spravne" nepoužívá (správnost je v moznosti.spravne)`);
  } else if (k.vstup.moznosti !== undefined) {
    varovani(`${kde}: „moznosti" mají smysl jen u vstupu dlazdice`);
  }
  if (k.vstup.pismena !== undefined && typ !== 'dlazdice') chyba(`${kde}: pismena jen u vstupu dlazdice`);

  if (typ === 'rysovani') {
    if (k.spravne !== undefined) chyba(`${kde}: rysovani nesmí mít „spravne" (kontroluje rodič podle tahak.reseni_obrazek)`);
    if (k.zname_chyby !== undefined) chyba(`${kde}: rysovani nesmí mít „zname_chyby"`);
  }

  const chybyZname = Array.isArray(k.zname_chyby) ? k.zname_chyby : [];
  if (typ === 'cislo' && jeObjekt(k.spravne)) {
    chybyZname.forEach((z, i) => {
      if (z?.hodnota === k.spravne.hodnota) chyba(`${kde}.zname_chyby[${i}]: známá chyba se rovná správnému výsledku`);
    });
  }
  if (typ === 'zlomek' && jeObjekt(k.spravne) && Number.isInteger(k.spravne.c) && Number.isInteger(k.spravne.j) && k.spravne.j !== 0) {
    const { c, j } = k.spravne;
    if (k.kontrola_tvaru === 'zakladni_tvar' && nsd(c, j) !== 1) {
      chyba(`${kde}: kontrola_tvaru je zakladni_tvar, ale správný výsledek ${c}/${j} není v základním tvaru`);
    }
    chybyZname.forEach((z, i) => {
      if (!Number.isInteger(z?.c) || !Number.isInteger(z?.j) || z.j === 0) return;
      if (z.c === c && z.j === j) chyba(`${kde}.zname_chyby[${i}]: známá chyba ${z.c}/${z.j} je shodná se správným výsledkem`);
      else if (z.c * j === c * z.j && k.kontrola_tvaru !== 'zakladni_tvar') {
        varovani(`${kde}.zname_chyby[${i}]: ${z.c}/${z.j} má stejnou hodnotu jako výsledek — bez kontrola_tvaru se nikdy nepoužije`);
      }
    });
  }
  if (typ === 'smisene' && jeObjekt(k.spravne)) {
    const { cela, c, j } = k.spravne;
    if (Number.isInteger(c) && Number.isInteger(j) && c >= j) varovani(`${kde}: smíšené číslo má čitatel ≥ jmenovatel (${c}/${j})`);
    chybyZname.forEach((z, i) => {
      if (z?.cela === cela && z?.c === c && z?.j === j) chyba(`${kde}.zname_chyby[${i}]: známá chyba je shodná se správným výsledkem`);
    });
  }
  if (k.kontrola_tvaru && !['zlomek', 'smisene', 'text', 'vyraz'].includes(typ)) {
    varovani(`${kde}: kontrola_tvaru u vstupu "${typ}" nemá účinek`);
  }
}

// ---------------------------------------------------------------------
// Obrázek (inline SVG) — ODPOVED-D bod 1, R30
// ---------------------------------------------------------------------
const ZAKAZANE_V_SVG = [
  [/<script\b/i, '<script>'],
  [/<foreignObject\b/i, '<foreignObject>'],
  [/<image\b/i, '<image> (externí/vložený obrázek)'],
  [/<(iframe|object|embed|audio|video|animate|set)\b/i, 'nepovolený prvek'],
  [/(^|[\s:])href\s*=/i, 'odkaz (href / xlink:href)'],
  [/\son[a-z]+\s*=/i, 'obsluha události (on…=)'],
  [/url\s*\(/i, 'url(…) (i ve style)'],
  [/javascript:/i, 'javascript:'],
  [/<!(DOCTYPE|ENTITY)/i, '<!DOCTYPE>/<!ENTITY>'],
  [/@import/i, '@import'],
];
const POVOLENE_BARVY = new Set(['none', 'currentcolor', 'transparent', 'inherit', 'var', 'rgb', 'rgba', 'hsl', 'hsla']); // rgb/hsl hlásí kontrola výše

/**
 * Kontrola inline SVG úlohy.
 * @param {string} svg
 * @returns {{chyby: string[], varovani: string[]}}
 */
export function problemyObrazku(svg) {
  const chyby = [];
  const varovani = [];
  if (typeof svg !== 'string') return { chyby: ['obrazek musí být řetězec s SVG'], varovani };
  const s = svg.trim();
  if (!/^<svg[\s>]/i.test(s) || !/<\/svg>$/i.test(s)) chyby.push('obrazek musí být jeden prvek <svg>…</svg>');
  for (const [re, popis] of ZAKAZANE_V_SVG) if (re.test(s)) chyby.push(`obrazek obsahuje zakázané: ${popis}`);
  if (/#[0-9a-f]{3,8}\b/i.test(s) || /\b(rgba?|hsla?)\s*\(/i.test(s)) {
    varovani.push('obrazek má barvy natvrdo (#… / rgb(…)) — použij currentColor nebo var(--…) kvůli tmavému režimu');
  }
  const pojmenovane = [...s.matchAll(/\b(fill|stroke|stop-color|color)\s*[:=]\s*["']?\s*([a-z]+)\b/gi)]
    .map((m) => m[2].toLowerCase())
    .filter((b) => !POVOLENE_BARVY.has(b));
  if (pojmenovane.length) {
    varovani.push(`obrazek má pojmenované barvy (${[...new Set(pojmenovane)].join(', ')}) — použij currentColor nebo var(--…)`);
  }
  chyby.push(...textyMimoViewBox(s));
  return { chyby, varovani };
}

/** Šířka znaku v písmu Sora ≈ 0,62 × font-size (odhad z testovacího rodiče T7; Sora je širší než Arial). */
const SIRKA_ZNAKU_SORA = 0.62;
const TOLERANCE_SVG = 2;

/**
 * Popisky SVG, které (podle odhadu šířky) přečnívají viewBox. Na `overflow: visible` se nespoléháme:
 * tisk, export a jiné prohlížeče obrázek ořežou a z „15 m" zbyde „5 m" (testovací rodič T7, L3 U4).
 * @param {string} svg
 * @returns {string[]}
 */
export function textyMimoViewBox(svg) {
  const vb = /<svg\b[^>]*\bviewBox\s*=\s*["']\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)/i.exec(svg);
  if (!vb) return [];
  const [x0, y0, w, h] = vb.slice(1).map(Number);
  const atribut = (tag, jmeno) => {
    const m = new RegExp(`\\s${jmeno}\\s*=\\s*["']([^"']*)["']`, 'i').exec(tag);
    return m ? m[1] : null;
  };
  const koren = /<svg\b[^>]*>/i.exec(svg)[0];
  const vychoziPismo = Number(atribut(koren, 'font-size')) || 16;
  const nalezy = [];
  for (const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)) {
    const tag = m[1];
    const obsah = m[2].replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, '_').trim();
    if (!obsah) continue;
    const pismo = Number(atribut(tag, 'font-size')) || vychoziPismo;
    const x = Number(String(atribut(tag, 'x') ?? '0').split(/[\s,]+/)[0]);
    const y = Number(String(atribut(tag, 'y') ?? '0').split(/[\s,]+/)[0]);
    const sirka = [...obsah].length * SIRKA_ZNAKU_SORA * pismo;
    const kotva = atribut(tag, 'text-anchor') || 'start';
    const levy = kotva === 'end' ? x - sirka : kotva === 'middle' ? x - sirka / 2 : x;
    const pravy = levy + sirka;
    const horni = y - 0.72 * pismo; // výška verzálek a číslic Sora
    const dolni = y + 0.25 * pismo;
    const mimo = [];
    if (levy < x0 - TOLERANCE_SVG) mimo.push(`vlevo o ${Math.round(x0 - levy)}`);
    if (pravy > x0 + w + TOLERANCE_SVG) mimo.push(`vpravo o ${Math.round(pravy - x0 - w)}`);
    if (horni < y0 - TOLERANCE_SVG) mimo.push(`nahoře o ${Math.round(y0 - horni)}`);
    if (dolni > y0 + h + TOLERANCE_SVG) mimo.push(`dole o ${Math.round(dolni - y0 - h)}`);
    if (mimo.length) nalezy.push(`popisek „${obsah}" přečnívá viewBox (${mimo.join(', ')}; odhad šířky Sora ${SIRKA_ZNAKU_SORA} × font-size) — posuň ho nebo zvětši viewBox`);
  }
  return nalezy;
}

// ---------------------------------------------------------------------
// Zlomky v textu — R29 H4: všude \frac v matematice, nikdy 3/4 v textu ani ¾
// ---------------------------------------------------------------------
const UNICODE_ZLOMKY = /[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞↉]/;
const LOMITKO_MEZI_CISLY = /[0-9]\s*\/\s*[0-9]/;
// Pole, která nejsou text pro člověka (SVG, strojový zápis výrazu, LaTeX výraz kroku poradi, id…)
const NETEXTOVA_POLE = new Set(['obrazek', 'reseni_obrazek', 'id', '$schema', 'datum', 'pismena', 'druha_cast', 'prvni_cast']);

/** Odstraní matematiku $$…$$ a $…$ (nepočítá escapované \$). */
export function bezMatematiky(s) {
  return String(s)
    .replace(/(?<!\\)\$\$[\s\S]*?(?<!\\)\$\$/g, ' ')
    .replace(/(?<!\\)\$(?:\\\$|[^$])*?(?<!\\)\$/g, ' ');
}

/**
 * Najde zlomky zapsané lomítkem mimo $…$ a unicode zlomky kdekoli v textových polích lekce.
 * @param {object} lekce
 * @returns {string[]} chybové hlášky
 */
export function zlomkyVTextu(lekce) {
  const nalezy = [];
  const projdi = (h, cesta, rodic) => {
    if (typeof h === 'string') {
      // Řídicí znak = typicky rozbitý LaTeX z JSON: "\f" (form feed) místo "\\frac", "\t" místo "\\times"…
      const ridici = /[\u0000-\u0009\u000b-\u001f]/.exec(h);
      if (ridici) nalezy.push(`${cesta}: řídicí znak U+${ridici[0].charCodeAt(0).toString(16).padStart(4, '0')} — nejspíš rozbitý LaTeX (v JSON piš \\\\frac, \\\\times…)`);
      if (/první volb/i.test(h)) nalezy.push(`${cesta}: „první volba" rodič na obrazovce nevidí — piš „v kroku 1"`);
      if (UNICODE_ZLOMKY.test(h)) nalezy.push(`${cesta}: unicode zlomek „${h.match(UNICODE_ZLOMKY)[0]}" — piš $\\frac{…}{…}$`);
      // spravne.vyraz / zname_chyby[].vyraz jsou strojový zápis, vstup.vyraz (poradi) je celý LaTeX
      if (rodic === 'vyraz') return;
      const m = bezMatematiky(h).match(LOMITKO_MEZI_CISLY);
      if (m) nalezy.push(`${cesta}: zlomek „${m[0]}" mimo matematiku — piš $\\frac{…}{…}$`);
      return;
    }
    if (Array.isArray(h)) { h.forEach((x, i) => projdi(x, `${cesta}[${i}]`, rodic)); return; }
    if (jeObjekt(h)) {
      for (const [k, v] of Object.entries(h)) {
        if (NETEXTOVA_POLE.has(k)) continue;
        projdi(v, cesta ? `${cesta}.${k}` : k, k);
      }
    }
  };
  projdi(lekce, '', null);
  return nalezy;
}

// ---------------------------------------------------------------------
// Simulace (osnova-faze2 §3): 2 části po 8 úlohách, každá 25 bodů, dohromady 50
// ---------------------------------------------------------------------
export const BODY_CASTI_SIMULACE = 25;

/** Součet bodů přes všechny kroky lekce. */
export function bodyLekce(l) {
  return (Array.isArray(l?.ulohy) ? l.ulohy : [])
    .flatMap((u) => (Array.isArray(u?.kroky) ? u.kroky : []))
    .reduce((s, k) => s + (Number.isInteger(k?.body) ? k.body : 0), 0);
}

function kontrolaSimulaceLekce(l, chyba) {
  const cast = l.simulace?.cast;
  const soucet = bodyLekce(l);
  if (soucet !== BODY_CASTI_SIMULACE) chyba(`simulace: součet bodů části je ${soucet}, má být ${BODY_CASTI_SIMULACE}`);
  const [od, doPozice] = cast === 2 ? [9, 16] : [1, 8];
  const pozice = (Array.isArray(l.ulohy) ? l.ulohy : []).map((u) => u?.pozice);
  pozice.forEach((p, i) => {
    if (Number.isInteger(p) && (p < od || p > doPozice)) chyba(`ulohy[${i}]: pozice ${p} nepatří do ${cast}. části (${od}–${doPozice})`);
    if (i > 0 && Number.isInteger(p) && Number.isInteger(pozice[i - 1]) && p <= pozice[i - 1]) {
      chyba(`ulohy[${i}]: pozice musí jít vzestupně (${pozice[i - 1]} → ${p})`);
    }
  });
  const odkaz = cast === 1 ? l.simulace?.druha_cast : l.simulace?.prvni_cast;
  if (odkaz && odkaz === l.id) chyba('simulace: část odkazuje sama na sebe');
}

/**
 * Kontrola párů simulace napříč soubory: část 1 ↔ část 2, stejné číslo simulace, 25 + 25 = 50 bodů.
 * @param {object[]} lekce  všechny načtené lekce
 * @returns {string[]} chyby
 */
export function kontrolaParuSimulaci(lekce) {
  const chyby = [];
  const podleId = new Map(lekce.filter(jeObjekt).map((l) => [l.id, l]));
  for (const l of lekce) {
    if (!jeObjekt(l) || l.typ !== 'simulace' || !jeObjekt(l.simulace)) continue;
    const { cast, cislo } = l.simulace;
    const druhaId = cast === 1 ? l.simulace.druha_cast : l.simulace.prvni_cast;
    const druha = podleId.get(druhaId);
    if (!druha) { chyby.push(`${l.id}: simulace odkazuje na ${druhaId}, ten soubor chybí`); continue; }
    const zpet = cast === 1 ? druha.simulace?.prvni_cast : druha.simulace?.druha_cast;
    if (druha.typ !== 'simulace' || druha.simulace?.cast === cast || zpet !== l.id) {
      chyby.push(`${l.id}: ${druhaId} není protější část této simulace (odkazy musí vést oběma směry)`);
      continue;
    }
    if (druha.simulace?.cislo !== cislo) chyby.push(`${l.id}: číslo simulace ${cislo} ≠ ${druha.simulace?.cislo} v ${druhaId}`);
    if (cast === 1) {
      const celkem = bodyLekce(l) + bodyLekce(druha);
      if (celkem !== 2 * BODY_CASTI_SIMULACE) chyby.push(`${l.id} + ${druhaId}: simulace má ${celkem} bodů, má mít ${2 * BODY_CASTI_SIMULACE}`);
    }
  }
  return chyby;
}

/**
 * Diagnostika Spolu 8: úloha má `kapitola` (povinné) a volitelně `tema` = číslo tématu 1–10.
 * Varuje, když se témata nedají přiřadit (žádná úloha s tema) nebo když některé téma nemá ani jednu úlohu.
 * @param {object[]} ulohy
 * @param {(m: string) => void} var_
 */
export function kontrolaTematDiagnostiky(ulohy, var_, chyba = var_) {
  const temata = new Set(ulohy.map((u) => u?.tema).filter(Number.isInteger));
  // každá úloha musí mít tema: kapitoly geometrie / jednotky pokrývají víc témat (OSNOVA-MATEMATIKA §8 bod 2)
  const bez = ulohy.filter((u) => jeObjekt(u) && !Number.isInteger(u.tema)).map((u) => u.id);
  if (bez.length) chyba(`diagnostika: úlohy bez „tema“ (číslo tématu 1–${OSMA.temat}): ${bez.join(', ')}`);
  if (!temata.size) return;
  const chybi = [];
  for (let t = 1; t <= OSMA.temat; t++) if (!temata.has(t)) chybi.push(t);
  if (chybi.length) var_(`diagnostika: témata bez úlohy: ${chybi.join(', ')} (o nich diagnostika nic neřekne)`);
}

/**
 * Úplná kontrola jedné lekce: JSON Schema + doménové kontroly.
 * @param {*} data            obsah JSON souboru
 * @param {string} nazevSouboru
 * @param {{schema: object, slovnik?: Set<string>|null}} volby
 * @returns {{chyby: string[], varovani: string[]}}
 */
export function zkontrolujLekci(data, nazevSouboru, { schema, slovnik = null, audioMd = null, audioExistuje = null }) {
  const chyby = validuj(schema, data, '', schema);
  const dom = domenoveKontroly(data, nazevSouboru, slovnik, { audioMd, audioExistuje });
  return { chyby: [...new Set([...chyby, ...dom.chyby])], varovani: dom.varovani };
}

/**
 * Doménové kontroly jedné lekce.
 * @returns {{chyby: string[], varovani: string[]}}
 */
export function domenoveKontroly(l, nazevSouboru, slovnik = null, { audioMd = null, audioExistuje = null } = {}) {
  const chyby = [];
  const varovani = [];
  const chyba = (m) => chyby.push(m);
  const var_ = (m) => varovani.push(m);
  if (!jeObjekt(l)) return { chyby: ['soubor neobsahuje objekt lekce'], varovani };

  // Čeština (cestina/Obsah/FORMAT-CJ.md): vlastní doménové kontroly, slovník cestina/Obsah/TYPY-CHYB.md
  if (l.predmet === 'cestina') {
    const cj = domenoveKontrolyCj(l, nazevSouboru, { slovnik, audioMd, audioExistuje });
    // kontrola.poznamka je interní záznam týmu (nikdo ho nevidí) — „36/35/25 znaků“ tam zlomek není
    return { chyby: [...cj.chyby, ...zlomkyVTextu({ ...l, kontrola: undefined })], varovani: cj.varovani };
  }

  if (nazevSouboru !== `${l.id}.json`) chyba(`název souboru má být "${l.id}.json"`);

  let m;
  if (typeof l.id === 'string' && (m = /^M8-T(\d{2})-(L([1-4])|DIAG)$/.exec(l.id))) {
    // Spolu 8 (ZADANI-OSMA §5): M8-T01-L1 … M8-T10-L4, diagnostika M8-T00-DIAG
    if (l.faze !== 'osma') chyba(`id ${l.id}: faze musí být "osma"`);
    if (l.tyden !== Number(m[1])) chyba(`id ${l.id}: tyden musí být ${Number(m[1])}`);
    if (m[3] && l.poradi !== Number(m[3])) chyba(`id ${l.id}: poradi musí být ${m[3]}`);
    if (m[2] === 'DIAG' && (l.typ !== 'diagnostika' || m[1] !== '00')) chyba(`id ${l.id}: diagnostika je jen M8-T00-DIAG s "typ": "diagnostika"`);
    if (m[2] !== 'DIAG' && (Number(m[1]) < 1 || Number(m[1]) > OSMA.temat)) chyba(`id ${l.id}: téma musí být 01–${OSMA.temat}`);
  } else if (l.faze === 'osma') {
    chyba(`faze "osma" má id M8-T<tt>-L<n> nebo M8-T00-DIAG, je ${l.id}`);
  } else if (typeof l.id === 'string' && /^P\d+$/.test(l.id)) {
    if (l.faze !== 'pilot') chyba(`id ${l.id}: pilotní lekce musí mít faze "pilot"`);
  } else if (typeof l.id === 'string' && (m = /^F([12])-T(\d{2})-(L([1-4])|DIAG)$/.exec(l.id))) {
    if (l.faze !== `faze${m[1]}`) chyba(`id ${l.id}: faze musí být "faze${m[1]}"`);
    if (l.tyden !== Number(m[2])) chyba(`id ${l.id}: tyden musí být ${Number(m[2])}`);
    if (m[4] && l.poradi !== Number(m[4])) chyba(`id ${l.id}: poradi musí být ${m[4]}`);
    if (m[3] === 'DIAG' && l.typ !== 'diagnostika') chyba(`id ${l.id}: diagnostika musí mít "typ": "diagnostika"`);
  }

  const jeDiag = l.typ === 'diagnostika';
  const jeSimulace = l.typ === 'simulace';
  const ulohy = Array.isArray(l.ulohy) ? l.ulohy : [];

  if (l.faze === 'faze2' && Number.isInteger(l.tyden) && l.tyden > 13) chyba(`faze2 má týdny 1–13, tyden je ${l.tyden}`);
  if ((l.kapitola === 'mix' || jeSimulace) && ulohy.some((u) => jeObjekt(u) && !u.kapitola)) {
    chyba(`lekce s kapitolou "${l.kapitola}": každá úloha musí mít vlastní kapitolu (SOS a statistiky)`);
  }
  if (jeSimulace) kontrolaSimulaceLekce(l, chyba);

  // pseudo-kapitoly: mix (blok, rozbor), simulace (jen typ simulace), diagnostika (jen diagnostika); úloha je mít nesmí
  if (l.kapitola === 'simulace' && !jeSimulace) chyba('kapitola "simulace" jen u lekce typu simulace');
  if (l.kapitola === 'diagnostika' && !jeDiag) chyba('kapitola "diagnostika" jen u diagnostiky');
  ulohy.forEach((u, i) => {
    if (jeObjekt(u) && PSEUDO_KAPITOLY.includes(u.kapitola)) chyba(`ulohy[${i}].kapitola: "${u.kapitola}" je pseudo-kapitola lekce, úloha potřebuje skutečnou kapitolu`);
  });
  // kapitoly: známé kódy jsou v obsah/hlasky.md; nový kód projde s varováním
  const vk = varovaniKapitoly(l.kapitola);
  if (vk) var_(vk);
  ulohy.forEach((u, i) => { const v = jeObjekt(u) && varovaniKapitoly(u.kapitola, `ulohy[${i}] (${u.id})`); if (v) var_(v); });

  if (l.faze === 'osma') {
    if (l.varianta !== 'z8') var_(`varianta je "${l.varianta}" — lekce Spolu 8 mají "varianta": "z8"`);
    // Spolu 8: bez přijímaček (ZADANI-OSMA §1) — úlohy jsou vlastní
    ulohy.forEach((u, i) => {
      if (jeObjekt(u) && typeof u.zdroj === 'string' && /cermat|klon/i.test(u.zdroj)) {
        var_(`ulohy[${i}] (${u.id}): zdroj „${u.zdroj}" — Spolu 8 nemá úlohy CERMAT, úlohy jsou vlastní ("zdroj": "vlastni")`);
      }
    });
    if (jeDiag) {
      const [min, max] = OSMA.diagUloh;
      if (ulohy.length < min || ulohy.length > max) var_(`diagnostika má ${ulohy.length} úloh (Spolu 8: ${min}–${max})`);
      if (Number.isInteger(l.cas_min) && Math.abs(l.cas_min - OSMA.casDiag) > 5) var_(`diagnostika má cas_min ${l.cas_min} (Spolu 8: ~${OSMA.casDiag} min)`);
      kontrolaTematDiagnostiky(ulohy, var_, chyba);
    } else {
      if (l.typ === 'blok' || l.typ === 'simulace') chyba(`Spolu 8 nemá bloky ani simulace (typ "${l.typ}")`);
      if (Number.isInteger(l.cas_min) && (l.cas_min < 15 || l.cas_min > 25)) var_(`cas_min lekce je ${l.cas_min} (Spolu 8: lekce matematiky ~20 min)`);
    }
  }

  if (!jeDiag && ulohy.length === 4) {
    const typy = ulohy.map((u) => u?.typ);
    if (typy.join() !== PORADI_TYPU_ULOH.join()) {
      chyba(`pořadí typů úloh musí být ${PORADI_TYPU_ULOH.join(' → ')}, je ${typy.join(' → ')}`);
    }
    const soucet = ulohy.reduce((s, u) => s + (Number.isInteger(u?.cas_min) ? u.cas_min : 0), 0);
    if (soucet !== l.cas_min) var_(`součet cas_min úloh (${soucet}) ≠ cas_min lekce (${l.cas_min})`);
  }
  if (pocetSlov(l.uvod_pro_rodice) > 60) var_(`uvod_pro_rodice má ${pocetSlov(l.uvod_pro_rodice)} slov (max 60)`);

  const idUloh = new Set();
  ulohy.forEach((u, i) => {
    if (!jeObjekt(u)) return;
    const kde = `ulohy[${i}] (${u.id})`;
    if (idUloh.has(u.id)) chyba(`${kde}: duplicitní id úlohy`);
    idUloh.add(u.id);
    if (typeof u.id === 'string' && typeof l.id === 'string' && !u.id.startsWith(`${l.id}-`)) {
      chyba(`${kde}: id úlohy musí začínat "${l.id}-"`);
    }

    const kroky = Array.isArray(u.kroky) ? u.kroky : [];
    if (kroky.length && kroky[kroky.length - 1]?.id !== 'final') chyba(`${kde}: poslední krok musí mít id "final"`);
    const idKroku = new Set();
    kroky.forEach((k, j) => {
      if (!jeObjekt(k)) return;
      const kk = `${kde}.kroky[${j}] (${k.id})`;
      if (idKroku.has(k.id)) chyba(`${kk}: duplicitní id kroku`);
      idKroku.add(k.id);
      if (k.id === 'final' && j !== kroky.length - 1) chyba(`${kk}: krok "final" musí být poslední`);
      kontrolaKroku(k, kk, chyba, var_, slovnik);
      if (jeSimulace && !Number.isInteger(k.body)) chyba(`${kk}: krok simulace musí mít body`);
      if (!jeSimulace && k.body !== undefined) chyba(`${kk}: body jen v simulaci`);
      if (k.vstup?.typ === 'rysovani' && !u.tahak?.reseni_obrazek) {
        chyba(`${kk}: rysovani potřebuje tahak.reseni_obrazek (rodič porovnává s obrázkem)`);
      }
      if (k.vstup?.typ === 'rysovani' && !u.tahak?.kontrola_rodice) {
        var_(`${kk}: u rysovani doplň tahak.kontrola_rodice (2–3 otázky pro rodiče)`);
      }
      if (k.vstup?.typ === 'poradi' && (u.typ === 'semafor' || u.typ === 'detektiv')) {
        var_(`${kk}: vstup poradi nepatří do úlohy ${u.typ} (osnova §6.1)`);
      }
    });

    for (const [pole, svg] of [['obrazek', u.obrazek], ['tahak.reseni_obrazek', u.tahak?.reseni_obrazek]]) {
      if (svg === undefined) continue;
      const o = problemyObrazku(svg);
      o.chyby.forEach((c) => chyba(`${kde}: ${pole}: ${c}`));
      o.varovani.forEach((v) => var_(`${kde}: ${pole}: ${v}`));
    }

    if (u.typ === 'semafor' && kroky.length !== 1) chyba(`${kde}: úloha semafor má mít jen krok "final"`);
    if (u.typ === 'detektiv' && kroky[0]?.vstup?.typ !== 'dlazdice') var_(`${kde}: detektiv má mít k1 = dlaždice (řádky s chybou)`);
    if (jeDiag) {
      const f = kroky[kroky.length - 1];
      if (f && f.vstup?.typ !== 'dlazdice' && !(Array.isArray(f.zname_chyby) && f.zname_chyby.length)) {
        chyba(`${kde}: úloha diagnostiky musí mít zname_chyby s typ_chyby`);
      }
    }

    if (lichyPocetDolaru(u.zadani)) var_(`${kde}: zadání má lichý počet $ (neuzavřená matematika?)`);
    if (lichyPocetDolaru(u.tisk?.zadani)) var_(`${kde}: tisk.zadani má lichý počet $`);
    if (jeObjekt(u.tahak)) {
      if (pocetSlov(u.tahak.vysvetleni) > 70) var_(`${kde}: tahak.vysvetleni má ${pocetSlov(u.tahak.vysvetleni)} slov (max 70)`);
      for (const [klic, text] of Object.entries(u.tahak)) {
        const texty = Array.isArray(text) ? text : [text];
        if (klic !== 'reseni_obrazek' && texty.some(lichyPocetDolaru)) var_(`${kde}: tahak.${klic} má lichý počet $`);
      }
    }
  });

  zlomkyVTextu(l).forEach(chyba);

  const jistota = l.kontrola?.jistota;
  if (jistota === 'nizka' || jistota === 'neurceno') var_(`kontrola.jistota = "${jistota}" — lekce ještě neprošla kontrolou`);
  if (jistota === 'stredni') var_('kontrola.jistota = "stredni" — vedoucí ji má dořešit na "jista"');

  return { chyby, varovani };
}
