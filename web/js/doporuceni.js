// =====================================================================
// doporuceni.js — Spolu 8: úvodní test (diagnostika) → silná a slabá témata → doporučené pořadí lekcí.
// Čisté funkce bez DOM a sítě (testy/doporuceni.test.js). Žádná nová tabulka: výsledek testu se počítá
// z odpovědí diagnostiky v DB (sezení M8-T00-DIAG / cj-t0-diag) a ukládá do sezeni.souhrn (typ 'diagnostika', osma: true).
//
// Téma = číslo tématu (lekce.tyden 1–10, „Téma 3 · Zlomky I“). Úloha diagnostiky patří k tématu podle
// pole `tema` (číslo); bez něj podle `kapitola` → všechna témata, jejichž lekce mají tuto kapitolu (katalog).
// Pravidla stavu tématu jsou stejná jako u kapitol diagnostiky Spolu (diagnostika.js stavKapitoly):
//   ≥ 80 % správně = silné, < 50 % (a aspoň 2 úlohy) = slabé, jinak nejisté; odevzdáno < polovina = nezjištěno.
//   Čeština: co není silné, je slabé (rozhodnutí vedoucího 1. 10., u 2 úloh 0–1 správně = slabé).
// Doporučené pořadí (rozhodnutí vedoucího 1. 10., obsah/OSNOVA-MATEMATIKA.md §6 a §8 bod 9): slabá, nejistá,
// nezjištěná i témata bez úlohy v testu v JEDNÉ skupině v pořadí osnovy, silná až na konec. Bez úvodního testu = osnova.
// Lekce uvnitř tématu: nesilné téma = L1 → L4; silné téma = jen L4 (kontrola tématu), L1–L3 jsou volitelné.
// Čeština (ZADANI-OSMA §8 bod 10): 7 a více slabých témat → pořadí osnovy (test pak o pořadí nic neříká).
//   Položka diagnostiky s víc mezerami / slovy se počítá jen celá — vyhodnocení kroku je vždy celé (spravne true/false).
// Pojistka: když L4 silného tématu dopadne oranžově nebo červeně (souhrn.hlavniBarva = barva semaforu kontrolní úlohy),
// doporučí se L1–L3 tématu a po nich znovu L4.
// =====================================================================

import { stavKapitoly, celkovePasmo } from './diagnostika.js';

/** Počet témat v předmětu (ZADANI-OSMA §2). */
export const POCET_TEMAT = 10;
/** Čeština: od kolika slabých témat platí pořadí osnovy (ZADANI-OSMA §8 bod 10). */
export const MEZ_SLABYCH_CJ = 7;
export const VERZE_DOPORUCENI = 2;

/** Stav kapitoly (diagnostika.js) → stav tématu Spolu 8. */
const STAV_TEMATU = { jista: 'silne', nejista: 'nejiste', slaba: 'slabe', nezjisteno: 'nezjisteno' };

/** Kódy chyb, které do „nejčastějších chyb“ nepatří (detektiv, numerika). */
const NEPOCITAT = new Set(['oznacil-radek-pred-chybou', 'nasel-az-dusledek', 'numericka-chyba']);

/** Je položka katalogu / lekce diagnostika Spolu 8 (tyden 0 ve fázi osma, nebo typ diagnostika)? */
export function jeDiagnostikaOsma(l) {
  return l?.typ === 'diagnostika' || (l?.faze === 'osma' && Number(l?.tyden) === 0);
}

/**
 * Kapitola → čísla témat, ve kterých se vyskytuje (z lekcí katalogu daného předmětu, bez diagnostiky).
 * @param {Array<{tyden: number, kapitola: string, predmet?: string}>} katalog
 * @param {string|null} [predmet]  jen lekce tohoto předmětu (položka bez predmet = matematika)
 * @returns {Map<string, number[]>}
 */
export function mapaKapitolNaTemata(katalog, predmet = null) {
  const mapa = new Map();
  for (const l of katalog || []) {
    if (predmet && (l.predmet || 'matematika') !== predmet) continue;
    const t = Number(l.tyden);
    if (!Number.isInteger(t) || t < 1 || jeDiagnostikaOsma(l)) continue;
    const seznam = mapa.get(l.kapitola) || [];
    if (!seznam.includes(t)) seznam.push(t);
    mapa.set(l.kapitola, seznam.sort((a, b) => a - b));
  }
  return mapa;
}

/**
 * Čísla témat v pořadí osnovy (tyden lekcí 1–10, bez diagnostiky).
 * @param {Array<{tyden: number}>} lekce
 * @returns {number[]}
 */
export function cislaTemat(lekce) {
  return [...new Set((lekce || []).filter((l) => !jeDiagnostikaOsma(l)).map((l) => Number(l.tyden)))]
    .filter((t) => Number.isInteger(t) && t >= 1).sort((a, b) => a - b);
}

/**
 * Témata, ke kterým úloha diagnostiky patří.
 * @param {{tema?: number, kapitola?: string}} uloha
 * @param {Map<string, number[]>} [mapaKapitol]
 * @returns {number[]}
 */
export function temataUlohy(uloha, mapaKapitol = new Map()) {
  if (Number.isInteger(uloha?.tema)) return [uloha.tema];
  return mapaKapitol.get(uloha?.kapitola) || [];
}

/**
 * Poslední odpověď na krok `final` u každé úlohy → výsledek úlohy.
 * @returns {Map<string, {vysledek: 'spravne'|'chyba'|'neodevzdano', typ_chyby: string|null}>}
 */
function vysledkyUloh(lekce, odpovedi) {
  const posledni = new Map();
  for (const o of odpovedi || []) {
    if (o.krok_id !== 'final') continue;
    const p = posledni.get(o.uloha_id);
    if (!p || o.pokus > p.pokus || (o.pokus === p.pokus && (o.id ?? 0) > (p.id ?? 0))) posledni.set(o.uloha_id, o);
  }
  return new Map((lekce?.ulohy || []).map((u) => {
    const o = posledni.get(u.id);
    const vysledek = !o || o.spravne === null || o.spravne === undefined ? 'neodevzdano' : o.spravne ? 'spravne' : 'chyba';
    return [u.id, { vysledek, typ_chyby: vysledek === 'chyba' ? (o.typ_chyby || null) : null }];
  }));
}

/** Nejsilnější „slabý“ stav podle předmětu: čeština zná jen silné / slabé (+ nezjištěno). */
const stavPodlePredmetu = (stavTematu, predmet) => (predmet === 'cestina' && stavTematu === 'nejiste' ? 'slabe' : stavTematu);

/**
 * Výsledek po tématech.
 * @param {object} lekce  obsah diagnostiky (ulohy[].tema / kapitola)
 * @param {Array<object>} odpovedi  řádky tabulky odpovedi pro sezení diagnostiky
 * @param {Map<string, number[]>} [mapaKapitol]
 * @returns {Array<{tema: number, stav: 'silne'|'nejiste'|'slabe'|'nezjisteno', uloh: number, odevzdano: number, spravne: number, kapitoly: string[]}>}
 *   jen témata, která mají v testu aspoň jednu úlohu, seřazená podle čísla tématu
 */
export function vysledekPoTematech(lekce, odpovedi, mapaKapitol = new Map(), predmet = lekce?.predmet || 'matematika') {
  const vysledky = vysledkyUloh(lekce, odpovedi);
  const temata = new Map();
  for (const u of lekce?.ulohy || []) {
    for (const t of temataUlohy(u, mapaKapitol)) {
      if (!temata.has(t)) temata.set(t, { tema: t, uloh: 0, odevzdano: 0, spravne: 0, kapitoly: [] });
      const x = temata.get(t);
      const v = vysledky.get(u.id);
      x.uloh += 1;
      if (v.vysledek !== 'neodevzdano') x.odevzdano += 1;
      if (v.vysledek === 'spravne') x.spravne += 1;
      if (u.kapitola && !x.kapitoly.includes(u.kapitola)) x.kapitoly.push(u.kapitola);
    }
  }
  return [...temata.values()].sort((a, b) => a.tema - b.tema)
    .map((x) => ({ ...x, stav: stavPodlePredmetu(STAV_TEMATU[stavKapitoly(x.uloh, x.odevzdano, x.spravne)] || 'nezjisteno', predmet) }));
}

/**
 * Doporučené pořadí témat: všechna nesilná témata (slabá, nejistá, nezjištěná, bez úlohy) v pořadí osnovy, silná na konec.
 * @param {number[]} temata  čísla témat v pořadí osnovy (např. [1..10])
 * @param {Array<{tema: number, stav: string}>|null} vysledek  z vysledekPoTematech; null = bez úvodního testu
 * @param {{predmet?: string}} [volby]  čeština: 7+ slabých témat = pořadí osnovy
 * @returns {number[]}
 */
export function doporucenePoradiTemat(temata, vysledek = null, { predmet = 'matematika' } = {}) {
  const osnova = [...temata];
  if (!vysledek?.length) return osnova;
  if (predmet === 'cestina' && vysledek.filter((v) => v.stav === 'slabe').length >= MEZ_SLABYCH_CJ) return osnova;
  const stav = new Map(vysledek.map((v) => [v.tema, v.stav]));
  const skupina = (t) => (stav.get(t) === 'silne' ? 1 : 0);
  return osnova.map((t, i) => ({ t, i })).sort((a, b) => skupina(a.t) - skupina(b.t) || a.i - b.i).map((x) => x.t);
}

/**
 * Souhrn úvodního testu Spolu 8 pro sezeni.souhrn.
 * @param {object} lekce  obsah diagnostiky
 * @param {Array<object>} odpovedi
 * @param {{predmet?: string, mapaKapitol?: Map<string, number[]>, temata?: number[], rezim?: string, ted?: string}} [volby]
 *   temata = čísla témat předmětu v pořadí osnovy (výchozí 1–10)
 */
export function sestavSouhrnOsma(lekce, odpovedi, {
  predmet = lekce?.predmet || 'matematika', mapaKapitol = new Map(), temata = null, rezim = 'app', ted = new Date().toISOString(),
} = {}) {
  const vysledky = vysledkyUloh(lekce, odpovedi);
  const poTematech = vysledekPoTematech(lekce, odpovedi, mapaKapitol, predmet);
  const osnova = temata?.length ? temata : Array.from({ length: POCET_TEMAT }, (_, i) => i + 1);
  // nejčastější chyby (max 3), k nim témata
  const skupiny = new Map();
  (lekce?.ulohy || []).forEach((u, i) => {
    const v = vysledky.get(u.id);
    if (v.vysledek !== 'chyba' || !v.typ_chyby || NEPOCITAT.has(v.typ_chyby)) return;
    if (!skupiny.has(v.typ_chyby)) skupiny.set(v.typ_chyby, { typ_chyby: v.typ_chyby, pocet: 0, prvni: i, temata: [] });
    const g = skupiny.get(v.typ_chyby);
    g.pocet += 1;
    for (const t of temataUlohy(u, mapaKapitol)) if (!g.temata.includes(t)) g.temata.push(t);
  });
  const chyby = [...skupiny.values()].sort((a, b) => b.pocet - a.pocet || a.prvni - b.prvni).slice(0, 3)
    .map(({ typ_chyby, pocet, temata: t }) => ({ typ_chyby, pocet, temata: t.sort((x, y) => x - y) }));
  const N = vysledky.size;
  const O = [...vysledky.values()].filter((v) => v.vysledek !== 'neodevzdano').length;
  const S = [...vysledky.values()].filter((v) => v.vysledek === 'spravne').length;
  return {
    typ: 'diagnostika',
    osma: true,
    verze: VERZE_DOPORUCENI,
    predmet,
    lekce_id: lekce?.id,
    vypocteno: ted,
    rezim,
    celkem: N,
    odevzdano: O,
    spravne: S,
    neuplne: O < N,
    celkove: celkovePasmo(N, O, S),
    temata: poTematech,
    poradi: doporucenePoradiTemat(osnova, poTematech, { predmet }),
    chyby,
    ulohy: (lekce?.ulohy || []).map((u) => ({ id: u.id, kapitola: u.kapitola ?? null, tema: u.tema ?? null, ...vysledky.get(u.id) })),
  };
}

/** Je souhrn sezení platný souhrn úvodního testu Spolu 8? */
export function jeSouhrnOsma(souhrn) {
  return Boolean(souhrn && souhrn.typ === 'diagnostika' && souhrn.osma && Number(souhrn.verze) >= VERZE_DOPORUCENI && Array.isArray(souhrn.temata));
}

/**
 * Lekce předmětu v doporučeném pořadí: témata podle `poradi`, uvnitř tématu podle lekce.poradi.
 * Diagnostika ani lekce mimo `poradi` (téma bez čísla) se nevynechají: jdou na konec.
 * @param {Array<{id: string, tyden: number, poradi: number}>} lekce  bez diagnostiky
 * @param {number[]} poradi  doporučené pořadí témat
 */
export function seradLekce(lekce, poradi) {
  const index = new Map(poradi.map((t, i) => [t, i]));
  return [...lekce].sort((a, b) => (index.get(Number(a.tyden)) ?? 99) - (index.get(Number(b.tyden)) ?? 99)
    || Number(a.poradi) - Number(b.poradi) || String(a.id).localeCompare(String(b.id)));
}

/**
 * Lekce v doporučeném pořadí podle výsledku testu: nesilné téma L1 → L4, silné téma jen L4;
 * po oranžové / červené L4 silného tématu (pojistka) L1–L3 a znovu L4.
 * Vrací položky {lekce, znovu} — znovu = L4 po pojistce (lekce je hotová, ale doporučuje se projít znovu).
 * @param {Array<{id: string, tyden: number, poradi: number, stavLekce?: string, souhrn?: object, dokoncene?: object}>} lekce  bez diagnostiky
 * @param {number[]} poradi  doporučené pořadí témat
 * @param {Set<number>} [silna]  silná témata z úvodního testu
 * @returns {Array<{lekce: object, znovu: boolean}>}
 */
export function planLekci(lekce, poradi, silna = new Set()) {
  const plan = [];
  const serazene = seradLekce(lekce, poradi);
  const temata = [...new Set(serazene.map((l) => Number(l.tyden)))];
  for (const t of temata) {
    const lt = serazene.filter((l) => Number(l.tyden) === t);
    if (!silna.has(t)) { lt.forEach((l) => plan.push({ lekce: l, znovu: false })); continue; }
    const kontrola = lt.find((l) => Number(l.poradi) === 4) || lt.at(-1);
    const ostatni = lt.filter((l) => l !== kontrola);
    plan.push({ lekce: kontrola, znovu: false });
    if (kontrola.stavLekce === 'hotovo' && ['oranzova', 'cervena'].includes(kontrola.souhrn?.hlavniBarva)) {
      ostatni.forEach((l) => plan.push({ lekce: l, znovu: false }));
      // po L1–L3 znovu L4 (dalsiDoporucenaLekce ji nabídne, jen když jsou L1–L3 hotové PO poslední L4)
      plan.push({ lekce: kontrola, znovu: true });
    }
  }
  return plan;
}

/**
 * „Doporučeno teď“: rozpracovaná lekce má přednost; jinak první lekce plánu (planLekci), která je otevřená
 * a ještě není hotová (u „znovu“ = L4 po pojistce: když už jsou L1–L3 hotové po poslední L4).
 * @param {Array<object>} lekce  bez diagnostiky (položky lekceProDite)
 * @param {number[]} poradi
 * @param {Set<number>} [silna]
 * @returns {object|null}  lekce (s příznakem `znovu` v návratové kopii, když jde o opakování L4)
 */
export function dalsiDoporucenaLekce(lekce, poradi, silna = new Set()) {
  const plan = planLekci(lekce, poradi, silna);
  const rozpracovana = plan.find((p) => !p.lekce.zamceno && p.lekce.stavLekce === 'probiha');
  if (rozpracovana) return rozpracovana.lekce;
  for (const [i, p] of plan.entries()) {
    if (p.lekce.zamceno) continue;
    if (!p.znovu && p.lekce.stavLekce !== 'hotovo') return p.lekce;
    if (p.znovu) {
      const konecKontroly = Date.parse(p.lekce.dokoncene?.konec || '') || 0;
      const predtim = plan.slice(0, i).filter((x) => Number(x.lekce.tyden) === Number(p.lekce.tyden) && x.lekce !== p.lekce);
      const opakovanoPo = predtim.every((x) => (Date.parse(x.lekce.dokoncene?.konec || '') || 0) > konecKontroly);
      if (opakovanoPo && predtim.every((x) => x.lekce.stavLekce === 'hotovo')) return { ...p.lekce, znovu: true };
    }
  }
  return null;
}
