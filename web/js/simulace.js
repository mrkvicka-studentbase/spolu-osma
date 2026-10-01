// =====================================================================
// simulace.js — Fáze 2: simulace přijímačky (2 navazující lekce, 50 bodů) a blok na čas.
// Čisté funkce bez DOM (importovatelné v Node, testy testy/simulace.test.js).
// Zdroj pravidel: obsah/osnova-faze2.md §3 (simulace), §4 (vstupy), obsah/SABLONA.md §20, R38, R39.
//
// - odpočet 70 min přes obě části (casSimulace), rozdělení na dva večery (> 30 min pauza → 35 min),
// - body jen pro rodiče (vyhodnotUlohu, sestavSouhrnSimulace): body kroků, povinný postup, úloha 11,
//   konstrukce „Sedí" = plné body; dítě vidí jen čísla úloh, které sedí (sediciPozice),
// - co rodič kontroluje (polozkyKontroly), „Správně: … (uznává se i …)" (spravneTex, uznavaSeI),
// - písmena dlaždic A–E / A/N / A–F (pismenaKroku),
// - mapa pozice → lekce pro doporučení (stejná logika jako report diagnostiky: MAPA_KAPITOL).
// Texty pro UI tu nejsou (jen kódy); skládá je rodic-simulace.js / simulace-zak.js z hlášek sim.*.
// =====================================================================

import { naRacionalni, vyrazNaLatex, vyhodnotKrok } from './vyhodnoceni.js';
import { MAPA_KAPITOL } from './diagnostika.js';

export const VERZE_SIMULACE = 1;
/** Jeden odpočet pro obě části (osnova §3.1). */
export const ODPOCET_MIN = 70;
/** Pauza mezi částmi, po které se simulace bere jako „rozdělená" na dva večery. */
export const ROZDELENI_PAUZA_MIN = 30;
/** Jemná připomínka tempa (osnova §3.1). */
export const PRIPOMINKA_MIN = 40;
export const BODY_CASTI = 25;
/** Kódy, které nejsou matematická chyba (detektiv, obecná chyba výpočtu) — do „nejčastějších chyb" nejdou. */
const NEPOCITAT_DO_CHYB = new Set(['oznacil-radek-pred-chybou', 'nasel-az-dusledek', 'numericka-chyba']);
export const KOD_BEZ_POSTUPU = 'jen-vysledek-bez-postupu';
export const KOD_DVA_KRIZKY = 'dva-krizky';

// ---------------------------------------------------------------------
// Typ lekce
// ---------------------------------------------------------------------

const typLekce = (l) => l?.typ ?? l?.obsah?.typ ?? null;
/** Lekce (obsah) je část simulace. */
export const jeSimulace = (l) => typLekce(l) === 'simulace';
/** Lekce (obsah) je blok na čas. */
export const jeBlok = (l) => typLekce(l) === 'blok';

/**
 * Typ lekce v katalogu přehledu (katalog lekcí nemá obsah ani `typ`, R41): simulace = kapitola `simulace`,
 * blok = kapitola `mix` a téma „Blok …" (osnova §2: bloky se jmenují „Blok 1" až „Blok 14").
 * @param {{kapitola?: string, tema?: string}} l
 * @returns {'simulace'|'blok'|null}
 */
export function typVKatalogu(l) {
  if (l?.kapitola === 'simulace') return 'simulace';
  if (l?.kapitola === 'mix' && /^blok\b/i.test(String(l?.tema || '').trim())) return 'blok';
  return null;
}

/**
 * Kapitola, podle které se lekce počítá v SOS a statistikách: u pseudo-kapitol `mix` / `simulace`
 * kapitola hlavní úlohy (typ `semafor`, jinak poslední), jinak kapitola lekce (osnova §3.5).
 * @param {{kapitola?: string, ulohy?: Array<{typ?: string, kapitola?: string}>}} lekce
 * @returns {string|null}
 */
export function kapitolaLekce(lekce) {
  const k = lekce?.kapitola ?? null;
  if (k !== 'mix' && k !== 'simulace') return k;
  const ulohy = lekce?.ulohy || [];
  const hlavni = ulohy.find((u) => u.typ === 'semafor' || u.typ === 'kontrolni') || ulohy[ulohy.length - 1]; // kontrolni = čeština
  return hlavni?.kapitola || k;
}

// ---------------------------------------------------------------------
// Písmena dlaždic (osnova §4, SABLONA §20.2–20.4)
// ---------------------------------------------------------------------

export const PISMENA = Object.freeze({ 'A-E': ['A', 'B', 'C', 'D', 'E'], AN: ['A', 'N'], 'A-F': ['A', 'B', 'C', 'D', 'E', 'F'] });

/** Písmena štítků kroku (pevné pořadí podle `moznosti`), nebo null (dlaždice bez písmen). */
export function pismenaKroku(krok) {
  return PISMENA[krok?.vstup?.pismena] || null;
}

/** Písmeno možnosti (podle pořadí v `moznosti`), nebo null. */
export function pismenoMoznosti(krok, idMoznosti) {
  const p = pismenaKroku(krok);
  if (!p) return null;
  const i = (krok.vstup.moznosti || []).findIndex((m) => m.id === idMoznosti);
  return i >= 0 ? p[i] ?? null : null;
}

// ---------------------------------------------------------------------
// Odpočet přes obě části (osnova §3.1)
// ---------------------------------------------------------------------

const cas = (x) => (x === null || x === undefined ? NaN : typeof x === 'number' ? x : Date.parse(x));

/**
 * Konec 1. části: `konec` sezení, jinak čas poslední odpovědi DÍTĚTE (created_at), jinak začátek.
 * @param {{zacatek?: string, konec?: string|null}|null} sezeni1
 * @param {Array<{created_at?: string, zadal?: string}>} [odpovedi1]
 * @returns {string|null}
 */
export function konecCasti(sezeni1, odpovedi1 = []) {
  if (!sezeni1) return null;
  if (sezeni1.konec) return sezeni1.konec;
  const casy = (odpovedi1 || []).filter((o) => (o.zadal || 'dite') === 'dite').map((o) => cas(o.created_at)).filter(Number.isFinite);
  return casy.length ? new Date(Math.max(...casy)).toISOString() : sezeni1.zacatek ?? null;
}

/**
 * Odpočet simulace. Část 1: od začátku části 1. Část 2: od začátku části 1 (jeden odpočet 70 min);
 * když se část 2 začala víc než 30 min po konci části 1 (nebo část 1 chybí), vlastní odpočet 35 min
 * od začátku části 2 a `rozdeleno: true`.
 * @param {{cast: 1|2, zacatek1?: string|number|null, konec1?: string|number|null, zacatek2?: string|number|null, odpocetMin?: number}} v
 * @returns {{start: number, minut: number, rozdeleno: boolean}}  start v ms (epoch)
 */
export function casSimulace({ cast: c, zacatek1 = null, konec1 = null, zacatek2 = null, odpocetMin = ODPOCET_MIN }) {
  const t1 = cas(zacatek1);
  const t2 = cas(zacatek2);
  const polovina = Math.round(odpocetMin / 2);
  if (c !== 2) return { start: Number.isFinite(t1) ? t1 : t2, minut: odpocetMin, rozdeleno: false };
  if (!Number.isFinite(t1)) return { start: t2, minut: polovina, rozdeleno: true };
  const k1 = Number.isFinite(cas(konec1)) ? cas(konec1) : t1;
  if (Number.isFinite(t2) && t2 - k1 > ROZDELENI_PAUZA_MIN * 60000) return { start: t2, minut: polovina, rozdeleno: true };
  return { start: t1, minut: odpocetMin, rozdeleno: false };
}

/**
 * Stav tempa v čase `ted` (hlášky: start, ve 40. minutě, po vypršení; tvrdý stop není).
 * @param {{start: number, minut: number, rozdeleno: boolean}} c  z casSimulace
 * @param {number} ted  ms
 * @returns {{uplynuloMin: number, zbyvaS: number, pripominka: boolean, vyprselo: boolean}}
 */
export function stavTempa({ start, minut, rozdeleno }, ted) {
  const uplynuloS = Math.max(0, Math.floor((ted - start) / 1000));
  const zbyvaS = Math.max(0, minut * 60 - uplynuloS);
  const uplynuloMin = Math.floor(uplynuloS / 60);
  return {
    uplynuloMin,
    zbyvaS,
    pripominka: !rozdeleno && uplynuloMin >= PRIPOMINKA_MIN && zbyvaS > 0,
    vyprselo: zbyvaS === 0,
  };
}

// ---------------------------------------------------------------------
// Odpovědi a body (osnova §3.4, SABLONA §20.8)
// ---------------------------------------------------------------------

/** Id pseudo-kroku, pod kterým rodič ukládá „Je v rámečku postup?" (odpovedi.krok_id, DB beze změny). */
export const postupKrokId = (krokId) => `${krokId}_postup`;

const casRadku = (o) => { const t = Date.parse(o.created_at); return Number.isFinite(t) ? t : Infinity; };
const idRadku = (o) => (o.id === null || o.id === undefined || !Number.isFinite(Number(o.id)) ? Infinity : Number(o.id));
const porovnej = (x, y) => (x === y ? 0 : x < y ? -1 : 1);

/**
 * Poslední odpověď na krok (dítě i rodič, podle času uložení; řádky ve frontě bez created_at jsou nejnovější).
 * @param {Array<object>} odpovedi  řádky tabulky odpovedi (libovolné sezení části)
 * @param {string} ulohaId
 * @param {string} krokId
 * @param {{jenSHodnocenim?: boolean}} [volby]  jenSHodnocenim = přeskočit řádky se spravne null („Hotovo" u rýsování)
 * @returns {object|null}
 */
export function posledniOdpoved(odpovedi, ulohaId, krokId, { jenSHodnocenim = false } = {}) {
  const r = (odpovedi || []).filter((o) => o.uloha_id === ulohaId && o.krok_id === krokId
    && (!jenSHodnocenim || (o.spravne !== null && o.spravne !== undefined)));
  if (!r.length) return null;
  r.sort((a, b) => porovnej(casRadku(a), casRadku(b)) || porovnej(idRadku(a), idRadku(b)) || porovnej(a.pokus ?? 0, b.pokus ?? 0));
  return r[r.length - 1];
}

const bodyKroku = (k) => (Number.isInteger(k?.body) ? k.body : 0);
/** Maximum bodů úlohy (součet `body` kroků). */
export const maxBodyUlohy = (uloha) => (uloha?.kroky || []).reduce((s, k) => s + bodyKroku(k), 0);

/**
 * Vyhodnocení jedné úlohy simulace.
 * - krok: poslední odpověď se spravne true/false; bez odpovědi „neodevzdano" (0 bodů); spravne null → „ceka",
 * - `postup: true`: správný výsledek platí jen s „Ano" rodiče (bez postupu 0, kód jen-vysledek-bez-postupu),
 * - rýsování: „Sedí" = plné body úlohy, „Nesedí" 0, dítě jen „Hotovo" → čeká na rodiče,
 * - úloha 11 (pozice 11): všechna tvrzení správně = plné body, o jedno méně = polovina (4 → 2), jinak 0.
 * @param {object} uloha
 * @param {Array<object>} odpovedi  odpovědi sezení části, kam úloha patří
 * @returns {{id: string, pozice: number|null, kapitola: string|null, max: number, body: number, ceka: boolean,
 *   sedi: boolean, kroky: Array<{id: string, vysledek: 'spravne'|'chyba'|'neodevzdano'|'ceka', postup: 'ano'|'ne'|'ceka'|null}>,
 *   chyby: string[]}}
 */
/** Číslo podúlohy z popisku kroku („3.1 levý rámeček" → „3.1"), jinak null. */
function cisloPodulohy(krok) {
  const m = /^(\d+(?:\.\d+)?)(?:\s|$)/.exec(String(krok?.popisek ?? '').trim());
  return m ? m[1] : null;
}

export function vyhodnotUlohu(uloha, odpovedi) {
  const max = maxBodyUlohy(uloha);
  const chyby = [];
  const kroky = (uloha.kroky || []).map((k) => {
    const hodnocena = posledniOdpoved(odpovedi, uloha.id, k.id, { jenSHodnocenim: true });
    const jakakoli = hodnocena || posledniOdpoved(odpovedi, uloha.id, k.id);
    let vysledek;
    if (hodnocena) vysledek = hodnocena.spravne ? 'spravne' : 'chyba';
    else vysledek = jakakoli ? 'ceka' : 'neodevzdano';
    if (vysledek === 'chyba' && hodnocena.typ_chyby) chyby.push(hodnocena.typ_chyby);
    // R50: nezkrácený zlomek tam, kde zadání chce základní tvar, je u zkoušky bez bodu
    if (vysledek === 'spravne' && k.kontrola_tvaru === 'zakladni_tvar' && hodnocena.hodnota != null
      && vyhodnotKrok(k, hodnocena.hodnota).poznamka === 'nezkraceno') {
      vysledek = 'chyba';
      chyby.push('nezkratil');
    }
    let postup = null;
    if (k.postup) {
      const p = posledniOdpoved(odpovedi, uloha.id, postupKrokId(k.id), { jenSHodnocenim: true });
      postup = p ? (p.spravne ? 'ano' : 'ne') : 'ceka';
      if (vysledek === 'spravne' && postup === 'ne') chyby.push(KOD_BEZ_POSTUPU);
    }
    return { id: k.id, vysledek, postup, body: bodyKroku(k), rysovani: k.vstup?.typ === 'rysovani', skupina: cisloPodulohy(k) };
  });

  let body = 0;
  let ceka = false;
  const rysovani = kroky.filter((k) => k.rysovani);
  if (rysovani.length) {
    // konstrukce: rozhoduje rodičovo „Sedí / Nesedí", rozbor dlaždicemi body nemá.
    // Jeden rýsovací krok = plné body; víc kroků s vlastními body (9.1, 9.2) = součet po krocích (R50).
    if (rysovani.some((k) => k.vysledek === 'ceka')) ceka = true;
    else if (rysovani.length > 1 && rysovani.some((k) => k.body)) body = rysovani.reduce((s, k) => s + (k.vysledek === 'spravne' ? k.body : 0), 0);
    else if (rysovani.every((k) => k.vysledek === 'spravne')) body = max;
  } else {
    const platne = kroky.map((k) => {
      if (k.vysledek === 'ceka') { ceka = true; return false; }
      if (k.vysledek !== 'spravne') return false;
      if (k.postup === 'ceka') { ceka = true; return false; }
      return k.postup !== 'ne';
    });
    // R50: kroky se stejným číslem podúlohy, z nichž některý má 0 bodů (dva rámečky, dvě čísla poměru),
    // dají body jen tehdy, když sedí všechny
    for (const g of new Set(kroky.map((k) => k.skupina).filter(Boolean))) {
      const idx = kroky.map((k, i) => (k.skupina === g ? i : -1)).filter((i) => i >= 0);
      if (idx.length > 1 && idx.some((i) => !kroky[i].body) && idx.some((i) => !platne[i])) idx.forEach((i) => { platne[i] = false; });
    }
    if (uloha.pozice === 11 && kroky.length > 1) {
      const n = platne.filter(Boolean).length;
      body = n === kroky.length ? max : n === kroky.length - 1 ? Math.floor(max / 2) : 0;
    } else {
      body = kroky.reduce((s, k, i) => s + (platne[i] ? k.body : 0), 0);
    }
  }
  return {
    id: uloha.id,
    pozice: Number.isInteger(uloha.pozice) ? uloha.pozice : null,
    kapitola: uloha.kapitola ?? null,
    max,
    body,
    ceka,
    sedi: !ceka && max > 0 && body === max,
    kroky: kroky.map(({ id, vysledek, postup }) => ({ id, vysledek, postup })),
    chyby,
  };
}

/** Čísla úloh (pozice), které sedí — jediné, co dítě po testu vidí (bez počtu a procent). */
export function sediciPozice(vysledky) {
  return (vysledky || []).filter((v) => v.sedi).map((v) => v.pozice).filter(Number.isInteger).sort((a, b) => a - b);
}

// ---------------------------------------------------------------------
// Souhrn pro rodiče
// ---------------------------------------------------------------------

/** Části testu pro rozpad (osnova §3.4). Názvy jsou v hláškách sim.skupina_<klic>. */
export const SKUPINY_POZIC = Object.freeze([
  { klic: 'cisla', od: 1, do: 2 },
  { klic: 'algebra', od: 3, do: 4 },
  { klic: 'slovni', od: 5, do: 8 },
  { klic: 'konstrukce', od: 9, do: 10 },
  { klic: 'uzavrene', od: 11, do: 15 },
  { klic: 'uloha16', od: 16, do: 16 },
]);

/** Pozice v testu → lekce Fáze 2, které ji trénují (osnova §2, tabulka lekcí). */
export const MAPA_POZIC = Object.freeze({
  1: [],
  2: ['F2-T05-L1'],
  3: ['F2-T01-L1', 'F2-T01-L2', 'F2-T01-L3', 'F2-T05-L1'],
  4: ['F2-T01-L4', 'F2-T02-L1', 'F2-T02-L2'],
  5: ['F2-T02-L3'],
  6: ['F2-T02-L3'],
  7: ['F2-T03-L4', 'F2-T03-L3'],
  8: ['F2-T03-L1', 'F2-T02-L4'],
  9: ['F2-T04-L1'],
  10: ['F2-T04-L2'],
  11: ['F2-T04-L3'],
  12: ['F2-T05-L2', 'F2-T03-L2'],
  13: ['F2-T03-L2', 'F2-T05-L2'],
  14: ['F2-T03-L3', 'F2-T05-L2'],
  15: ['F2-T05-L2'],
  16: ['F2-T04-L4'],
});

/**
 * Doporučení lekcí „před zkouškou projděte znovu" (stejná logika jako report diagnostiky: pozice → lekce F2,
 * u úloh 1–8 navíc první lekce Fáze 1 kapitoly úlohy podle MAPA_KAPITOL). Nejvýš 3 úlohy s největší ztrátou.
 * @param {Array<{pozice: number|null, kapitola: string|null, max: number, body: number}>} vysledky
 * @returns {Array<{pozice: number, lekce: string[]}>}
 */
export function doporuceniLekci(vysledky, { nejvys = 3 } = {}) {
  const kapitoly = new Map(MAPA_KAPITOL.map((m) => [m.kapitola, m]));
  return (vysledky || [])
    .filter((v) => Number.isInteger(v.pozice) && v.max > 0 && v.body < v.max)
    .sort((a, b) => (b.max - b.body) - (a.max - a.body) || a.pozice - b.pozice)
    .slice(0, nejvys)
    .map((v) => {
      const f2 = (MAPA_POZIC[v.pozice] || []).slice(0, 2);
      const f1 = v.pozice <= 8 ? (kapitoly.get(v.kapitola)?.lekce || []).slice(0, 1) : [];
      return { pozice: v.pozice, lekce: [...new Set([...f2, ...f1])] };
    })
    .filter((d) => d.lekce.length);
}

/**
 * Souhrn simulace pro `sezeni.souhrn` obou částí (DB beze změny). Body vidí jen rodič.
 * @param {{lekce1: object, lekce2: object, odpovedi1?: Array<object>, odpovedi2?: Array<object>,
 *   rezim?: 'app'|'papir', rozdeleno?: boolean, ted?: string}} v
 * @returns {object}
 */
export function sestavSouhrnSimulace({ lekce1, lekce2, odpovedi1 = [], odpovedi2 = [], rezim = 'app', rozdeleno = false, ted = new Date().toISOString() }) {
  const v1 = (lekce1?.ulohy || []).map((u) => ({ ...vyhodnotUlohu(u, odpovedi1), cast: 1 }));
  const v2 = (lekce2?.ulohy || []).map((u) => ({ ...vyhodnotUlohu(u, odpovedi2), cast: 2 }));
  const vse = [...v1, ...v2];
  const soucet = (arr, pole) => arr.reduce((s, v) => s + v[pole], 0);

  const skupiny = SKUPINY_POZIC.map((g) => {
    const jeji = vse.filter((v) => v.pozice >= g.od && v.pozice <= g.do);
    return { klic: g.klic, od: g.od, do: g.do, body: soucet(jeji, 'body'), max: soucet(jeji, 'max') };
  }).filter((g) => g.max > 0);

  const kody = new Map();
  for (const v of vse) {
    for (const kod of v.chyby) {
      if (!kod || NEPOCITAT_DO_CHYB.has(kod)) continue;
      if (!kody.has(kod)) kody.set(kod, { typ_chyby: kod, pocet: 0, pozice: [], prvni: v.pozice ?? 99 });
      const g = kody.get(kod);
      g.pocet += 1;
      if (Number.isInteger(v.pozice) && !g.pozice.includes(v.pozice)) g.pozice.push(v.pozice);
    }
  }
  const chyby = [...kody.values()].sort((a, b) => b.pocet - a.pocet || a.prvni - b.prvni).slice(0, 3)
    .map(({ typ_chyby, pocet, pozice }) => ({ typ_chyby, pocet, pozice }));

  return {
    typ: 'simulace',
    verze: VERZE_SIMULACE,
    cislo: lekce1?.simulace?.cislo ?? lekce2?.simulace?.cislo ?? null,
    lekce: [lekce1?.id ?? null, lekce2?.id ?? null],
    vypocteno: ted,
    rezim,
    rozdeleno: Boolean(rozdeleno),
    body: soucet(vse, 'body'),
    max: soucet(vse, 'max'),
    casti: [
      { cast: 1, lekce_id: lekce1?.id ?? null, body: soucet(v1, 'body'), max: soucet(v1, 'max') },
      { cast: 2, lekce_id: lekce2?.id ?? null, body: soucet(v2, 'body'), max: soucet(v2, 'max') },
    ],
    skupiny,
    chyby,
    sedi: sediciPozice(vse),
    ceka: vse.filter((v) => v.ceka).length,
    doporuceni: doporuceniLekci(vse),
    ulohy: vse.map(({ id, pozice, kapitola, cast: c, body, max, sedi }) => ({ id, pozice, kapitola, cast: c, body, max, sedi })),
  };
}

// ---------------------------------------------------------------------
// Kontrola rodiče (osnova §3.2)
// ---------------------------------------------------------------------

/**
 * Co rodič při Kontrole u kroku dělá:
 * - 'rysovani' (vždy): obrázek řešení + kontrolní otázky → Sedí / Nesedí,
 * - 'postup' (vždy, u kroku s postup: true): „Je v rámečku postup?" Ano / Ne,
 * - 'pismena' (papír): „Co dítě zakřížkovalo?" → písmeno, aplikace vyhodnotí,
 * - 'vysledek' (papír): „Správně: … (uznává se i …)" → Sedí / Nesedí.
 * V režimu aplikace je vše ostatní vyhodnocené automaticky.
 * @param {object} lekce
 * @param {'app'|'papir'} rezim
 * @returns {Array<{uloha: object, polozky: Array<{krok: object, druh: 'rysovani'|'postup'|'pismena'|'vysledek'}>}>}
 */
export function polozkyKontroly(lekce, rezim) {
  const papir = rezim === 'papir';
  return (lekce?.ulohy || []).map((uloha) => {
    const polozky = [];
    for (const krok of uloha.kroky || []) {
      const typ = krok.vstup?.typ;
      if (typ === 'rysovani') polozky.push({ krok, druh: 'rysovani' });
      else if (papir) polozky.push({ krok, druh: typ === 'dlazdice' ? 'pismena' : 'vysledek' });
      if (krok.postup) polozky.push({ krok, druh: 'postup' });
    }
    return { uloha, polozky };
  }).filter((x) => x.polozky.length);
}

/** Číslo jako TeX s desetinnou čárkou a mezerou po tisících (1 200; 0,65). */
export function cisloNaTex(n) {
  const r = naRacionalni(n);
  if (r === null) return String(n ?? '');
  const s = String(n).replace(/[\s  ]/g, '').replace(',', '.');
  const [cela, des] = s.replace(/^[+-]/, '').split('.');
  const minus = s.startsWith('-') ? '-' : '';
  const skupiny = cela.length > 3 ? cela.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : cela;
  return `${minus}${skupiny}${des ? `{,}${des}` : ''}`;
}

/**
 * Správný výsledek kroku jako Markdown s TeXem pro rodiče („Správně: …"). Dlaždice: „B) text".
 * @param {object} krok
 * @returns {string|null}  null u rýsování
 */
export function spravneTex(krok) {
  const s = krok?.spravne;
  const j = krok?.vstup?.jednotka ? ` ${krok.vstup.jednotka}` : '';
  switch (krok?.vstup?.typ) {
    case 'cislo': return `$${cisloNaTex(s?.hodnota)}$${j}`;
    case 'zlomek': return `$${s.c < 0 ? '-' : ''}\\frac{${Math.abs(s.c)}}{${s.j}}$${j}`;
    case 'smisene': return `$${s.cela}\\frac{${s.c}}{${s.j}}$${j}`;
    case 'vyraz': {
      const tex = vyrazNaLatex(s?.vyraz, krok.vstup?.promenne?.length ? krok.vstup.promenne : ['x']);
      return tex ? `$${tex}$` : String(s?.vyraz ?? '');
    }
    case 'dlazdice': {
      const m = (krok.vstup.moznosti || []).find((x) => x.spravne);
      if (!m) return null;
      const p = pismenoMoznosti(krok, m.id);
      return p ? `${p}) ${m.text}` : m.text;
    }
    case 'text': return null;
    default: return null;
  }
}

/** Desetinný zápis zlomku, když je konečný (jmenovatel jen z 2 a 5), jinak null. */
function desetinne(c, j) {
  let jj = j < 0n ? -j : j;
  let n2 = 0; let n5 = 0;
  while (jj % 2n === 0n) { jj /= 2n; n2 += 1; }
  while (jj % 5n === 0n) { jj /= 5n; n5 += 1; }
  if (jj !== 1n) return null;
  const mist = Math.max(n2, n5);
  if (mist === 0) return null; // celé číslo
  const nasob = 10n ** BigInt(mist);
  const citatel = (c * nasob) / j;
  const minus = citatel < 0n ? '-' : '';
  const a = (citatel < 0n ? -citatel : citatel).toString().padStart(mist + 1, '0');
  return `${minus}${a.slice(0, -mist)}.${a.slice(-mist)}`;
}

/**
 * Co se uznává i jinak než „Správně: …" (rodič porovnává s archem). Kódy → hlášky sim.uznava_<druh>.
 * @param {object} krok
 * @returns {Array<{druh: 'nezkraceny'|'desetinne'|'zlomek'|'nepravy'|'poradi_clenu', tex?: string}>}
 */
export function uznavaSeI(krok) {
  const s = krok?.spravne;
  const out = [];
  switch (krok?.vstup?.typ) {
    case 'zlomek': {
      if (!s || !Number.isInteger(s.c) || !Number.isInteger(s.j)) break;
      out.push({ druh: 'nezkraceny' });
      const d = desetinne(BigInt(s.c), BigInt(s.j));
      if (d) out.push({ druh: 'desetinne', tex: cisloNaTex(d) });
      break;
    }
    case 'cislo': {
      const r = naRacionalni(s?.hodnota);
      if (r && r.j !== 1n) out.push({ druh: 'zlomek', tex: `${r.c < 0n ? '-' : ''}\\frac{${r.c < 0n ? -r.c : r.c}}{${r.j}}` });
      break;
    }
    case 'smisene': {
      if (s && Number.isInteger(s.cela)) out.push({ druh: 'nepravy', tex: `\\frac{${s.cela * s.j + s.c}}{${s.j}}` });
      break;
    }
    case 'vyraz': out.push({ druh: 'poradi_clenu' }); break;
    default: break;
  }
  return out;
}

// ---------------------------------------------------------------------
// Statistiky adminu: u bloků a simulací kapitola úlohy místo pseudo-kapitol mix / simulace (osnova §3.5)
// ---------------------------------------------------------------------

const PSEUDO_KAPITOLY = new Set(['mix', 'simulace']);

/**
 * Mapa uloha_id → kapitola úlohy z obsahu lekcí (jen úlohy, které kapitolu mají).
 * @param {Array<{ulohy?: Array<{id: string, kapitola?: string}>}>} lekce
 * @returns {Map<string, string>}
 */
export function mapaKapitolUloh(lekce) {
  const m = new Map();
  for (const l of lekce || []) for (const u of l?.ulohy || []) if (u?.id && u.kapitola) m.set(u.id, u.kapitola);
  return m;
}

/**
 * Přepočet řádků statistik (DB pohledy seskupují podle lekce.kapitola; DB se nemění):
 * - semafory (v_semafory_dle_kapitoly, řádky je_celkem): pseudo-kapitoly se nahradí počty podle kapitoly úlohy
 *   ze `semaforyUloh` (řádky {uloha_id, barva} lekcí mix / simulace),
 * - časy (v_cas_na_ulohu) a červené (v_cervene): řádek úlohy dostane kapitolu úlohy.
 * @param {{semafory?: object[], casy?: object[], cervene?: object[]}} radky
 * @param {Map<string, string>} mapa  z mapaKapitolUloh
 * @param {Array<{uloha_id: string, barva: string}>} [semaforyUloh]
 */
export function premapujStatistiky({ semafory = [], casy = [], cervene = [] }, mapa, semaforyUloh = []) {
  const kapitola = (r) => (PSEUDO_KAPITOLY.has(r.kapitola) && r.uloha_id && mapa.has(r.uloha_id) ? mapa.get(r.uloha_id) : r.kapitola);
  const celkem = semafory.filter((r) => !(r.je_celkem && PSEUDO_KAPITOLY.has(r.kapitola))).map((r) => ({ ...r }));
  const zbylePseudo = semafory.filter((r) => r.je_celkem && PSEUDO_KAPITOLY.has(r.kapitola)).map((r) => ({ ...r }));
  for (const s of semaforyUloh) {
    const k = mapa.get(s.uloha_id);
    if (!k) continue;
    const pseudo = zbylePseudo.find((r) => r.barva === s.barva && r.pocet > 0);
    if (pseudo) pseudo.pocet -= 1; // tenhle semafor už je rozpuštěný do kapitoly úlohy
    let r = celkem.find((x) => x.je_celkem && x.kapitola === k && x.barva === s.barva);
    if (!r) { r = { kapitola: k, barva: s.barva, pocet: 0, je_celkem: true }; celkem.push(r); }
    r.pocet += 1;
  }
  return {
    semafory: [...celkem, ...zbylePseudo.filter((r) => r.pocet > 0)],
    casy: casy.map((r) => (r.je_kapitola ? r : { ...r, kapitola: kapitola(r) })),
    cervene: cervene.map((r) => ({ ...r, kapitola: kapitola(r) })),
  };
}

// ---------------------------------------------------------------------
// Blok na čas u rodiče (R46): „Odevzdáno x ze 4" a odpovědi dítěte při procházení po bloku
// ---------------------------------------------------------------------

/** Pokusy na krok u žáka v běžné lekci a bloku (lekce.js MAX_POKUSU). */
export const MAX_POKUSU_BLOK = 2;

/**
 * Úloha bloku je odevzdaná: dítě dokončilo její poslední krok (`final`) — poslední pokus sedí nebo se nehodnotí
 * (rýsování „Hotovo"), nebo vyčerpalo pokusy. Stejné pravidlo jako lekce.js jeHotovy(); počítají se jen odpovědi dítěte.
 * @param {object} uloha
 * @param {Array<object>} odpovedi  řádky sezení (DB + fronta, duplicitní pokus se počítá jednou)
 * @param {number} [maxPokusu]
 * @returns {boolean}
 */
export function ulohaOdevzdana(uloha, odpovedi, maxPokusu = MAX_POKUSU_BLOK) {
  const kroky = uloha?.kroky || [];
  const fin = kroky.find((k) => k.id === 'final') ?? kroky[kroky.length - 1];
  if (!fin) return false;
  const pokusy = new Map();
  for (const o of odpovedi || []) {
    if (o.uloha_id !== uloha.id || o.krok_id !== fin.id || (o.zadal || 'dite') !== 'dite') continue;
    pokusy.set(Number(o.pokus) || 0, o);
  }
  if (!pokusy.size) return false;
  const posledni = pokusy.get(Math.max(...pokusy.keys()));
  return posledni.spravne !== false || pokusy.size >= maxPokusu;
}

/** Počet odevzdaných úloh bloku (ulohaOdevzdana). */
export function pocetOdevzdanychBloku(lekce, odpovedi, maxPokusu = MAX_POKUSU_BLOK) {
  return (lekce?.ulohy || []).filter((u) => ulohaOdevzdana(u, odpovedi, maxPokusu)).length;
}

/**
 * Odpověď dítěte na krok pro rodiče („Dítě zadalo: …"). Text dítěte se nikdy nesází jako Markdown.
 * @param {object} krok
 * @param {*} hodnota  uložená hodnota (lekce.js `ulozeni`)
 * @returns {{druh: 'tex'|'md'|'text'|'rysovani'|'poradi', obsah: string, jednotka?: string}}
 *   tex = TeX bez dolarů, md = text možnosti z obsahu lekce (Markdown), text = prostý text; jednotka jako prostý text
 */
export function odpovedDitete(krok, hodnota) {
  const jednotka = krok?.vstup?.jednotka || '';
  const cele = (x) => (Number.isInteger(Number(x)) && x !== null && x !== '' ? String(Number(x)) : null);
  switch (krok?.vstup?.typ) {
    case 'rysovani': return { druh: 'rysovani', obsah: '' };
    case 'poradi': return { druh: 'poradi', obsah: '' };
    case 'cislo': {
      const r = naRacionalni(hodnota);
      return r === null ? { druh: 'text', obsah: String(hodnota ?? '') } : { druh: 'tex', obsah: cisloNaTex(hodnota), jednotka };
    }
    case 'zlomek': {
      const c = cele(hodnota?.c); const jm = cele(hodnota?.j);
      if (c === null || jm === null) return { druh: 'text', obsah: `${hodnota?.c ?? ''}/${hodnota?.j ?? ''}` };
      return { druh: 'tex', obsah: `${c.startsWith('-') ? '-' : ''}\\frac{${c.replace(/^-/, '')}}{${jm}}`, jednotka };
    }
    case 'smisene': {
      const ce = cele(hodnota?.cela); const c = cele(hodnota?.c); const jm = cele(hodnota?.j);
      if (ce === null || c === null || jm === null) return { druh: 'text', obsah: `${hodnota?.cela ?? ''} ${hodnota?.c ?? ''}/${hodnota?.j ?? ''}` };
      return { druh: 'tex', obsah: `${ce}\\frac{${c}}{${jm}}`, jednotka };
    }
    case 'vyraz': {
      const tex = typeof hodnota === 'string' ? vyrazNaLatex(hodnota, krok.vstup?.promenne?.length ? krok.vstup.promenne : ['x']) : null;
      return tex ? { druh: 'tex', obsah: tex } : { druh: 'text', obsah: String(hodnota ?? '') };
    }
    case 'dlazdice': {
      const m = (krok.vstup.moznosti || []).find((x) => x.id === hodnota);
      if (!m) return { druh: 'text', obsah: String(hodnota ?? '') };
      const p = pismenoMoznosti(krok, m.id);
      const text = m.stitek ? `${m.stitek}: ${m.text}` : m.text; // detektiv: „2. řádek: …"
      return { druh: 'md', obsah: p ? `${p}${krok.vstup.pismena === 'AN' ? ' —' : ')'} ${text}` : text };
    }
    default: return { druh: 'text', obsah: String(hodnota ?? '') };
  }
}
