// =====================================================================
// tahaky.js — sbírka taháků a měsíční výzvy (R78 + R82, převzato ze Spolu 9 a upraveno na Spolu 8).
// Čisté funkce bez DOM a bez sítě (jako odznaky.js): počítá se při načtení stránky z katalogu s průběhem
// (lekceProDite), databáze se nemění. Obsah taháků je ve statických modulech:
//   tahaky-matematika.js (TAHAKY_MATEMATIKA), tahaky-cestina.js (TAHAKY_CESTINA), tahaky-bonus.js (VYZVY, TAHAKY_BONUS).
// Obsahové moduly se načítají dynamicky: když některý chybí nebo má chybu, stránka běží dál bez něj
// (prázdné pole + varování v konzoli), nikdy se kvůli tomu nerozbije přehled ani lekce.
// Každá funkce bere volitelně `data` (testy si podstrčí vlastní vzorek).
//
// Spolu 8:
// - „týden“ taháku = `tyden` v katalogu = číslo tématu 1–10 (fáze `osma`); id `t:<predmet>:osma:<tema>`.
// - Tahák se odemkne dokončením všech UČEBNÍCH lekcí tématu (L1–L4). Naostro dvojčata, B-varianty a testy
//   (úvodní, pololetní; tyden 0) se do podmínky nepočítají (plan-roku.js druhLekce).
// - Výzva: v kalendářním měsíci (Praha) aspoň `cil` různých lekcí, oba předměty se sčítají; počítají se jen
//   hlavní lekce (učební a naostro), ne B-varianty ani testy. Sezóna listopad 2026 – květen 2027.
// - Zlaté taháky se všem (s otevřeným účtem) odemknou 1. 6. 2027, po konci sezóny.
// =====================================================================

import { druhLekce } from './plan-roku.js';

const nacti = (cesta) => import(cesta).catch((e) => {
  console.warn(`taháky: ${cesta} se nenačetl (${e?.message || e})`);
  return {};
});
const [MAT, CJ, BONUS] = await Promise.all([nacti('./tahaky-matematika.js'), nacti('./tahaky-cestina.js'), nacti('./tahaky-bonus.js')]);

/** Načtený obsah (pole jsou vždy pole, i když modul chybí). */
export const DATA = Object.freeze({
  matematika: Array.isArray(MAT.TAHAKY_MATEMATIKA) ? MAT.TAHAKY_MATEMATIKA : [],
  cestina: Array.isArray(CJ.TAHAKY_CESTINA) ? CJ.TAHAKY_CESTINA : [],
  bonus: Array.isArray(BONUS.TAHAKY_BONUS) ? BONUS.TAHAKY_BONUS : [],
  vyzvy: Array.isArray(BONUS.VYZVY) ? BONUS.VYZVY : [],
});

/** Od tohoto dne (Europe/Prague) má každý všechny zlaté taháky (po konci sezóny Spolu 8, poslední výzva je květnová). */
export const ODEMCENI_BONUSU = '2027-06-01';

const FORMAT_PRAHA = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit' });

/** Kalendářní datum v Praze jako 'RRRR-MM-DD' (31. 10. 23:30 UTC = '2026-11-01'). */
export function datumVPraze(cas) {
  return FORMAT_PRAHA.format(new Date(cas));
}

const dnyOd1970 = (datum) => { const [r, m, d] = datum.split('-').map(Number); return Math.round(Date.UTC(r, m - 1, d) / 86400000); };
const posledniDenMesice = (mesic) => { const [r, m] = mesic.split('-').map(Number); return `${mesic}-${String(new Date(Date.UTC(r, m, 0)).getUTCDate()).padStart(2, '0')}`; };

const PORADI_PREDMETU = { matematika: 0, cestina: 1 };
const PORADI_FAZI = { osma: 0 };

/** Učební lekce (ne naostro, ne B, ne test). Neznámé id se bere jako učební (testovací vzorky). */
export const jeUcebniLekce = (l) => { const d = druhLekce(l?.id); return !d || (!d.b && !d.naostro && !d.test); };
/** Hlavní lekce pro výzvu: učební nebo naostro (ne B-varianta, ne test). */
export const jeLekceVyzvy = (l) => { const d = druhLekce(l?.id); return !d || (!d.b && !d.test); };

/**
 * Účet bez sezóny: některá lekce je zamčená platbou ('platba', Spolu 8 platbu zatím nemá) nebo je účet uzavřený
 * ('uzavreno', rodiny.stav = uzavreny). Výzva se pak nezobrazuje (cíl by byl nesplnitelný) a zlaté taháky
 * se neodemknou ani 1. 6. (jsou součástí sezóny). Zámek datem ('datum') ani kalendářem sezónu nezamyká.
 */
export const sezonaZamcena = (lekce) => (lekce || []).some((l) => l?.zamceno === 'platba' || l?.zamceno === 'uzavreno');

/** Bonusový (zlatý) tahák za výzvu: id `b:RRRR-MM`. */
export const jeBonus = (t) => String(t?.id || '').startsWith('b:');

/** Taháky témat (matematika, pak čeština; podle čísla tématu). */
export function tydenniTahaky({ data = DATA } = {}) {
  return [...data.matematika, ...data.cestina].slice().sort((a, b) =>
    (PORADI_PREDMETU[a.predmet] ?? 9) - (PORADI_PREDMETU[b.predmet] ?? 9)
    || (PORADI_FAZI[a.faze] ?? 9) - (PORADI_FAZI[b.faze] ?? 9)
    || Number(a.tyden) - Number(b.tyden));
}

/** Všechny taháky: matematika, čeština, bonusové (v pořadí výzev). */
export function vsechnyTahaky({ data = DATA } = {}) {
  const bonus = data.bonus.slice().sort((a, b) => String(a.mesic).localeCompare(String(b.mesic)));
  return [...tydenniTahaky({ data }), ...bonus];
}

/** Tahák podle id, nebo null. */
export function najdiTahak(id, { data = DATA } = {}) {
  return vsechnyTahaky({ data }).find((t) => t.id === id) || null;
}

/** Konce dokončení podle lekce (poslední dokončené sezení); `navic` = právě dokončená lekce (jako u odznaků). */
function konceDokonceni(lekce, navic) {
  const konce = new Map();
  for (const l of lekce) if (l.dokoncene?.konec) konce.set(l.id, l.dokoncene.konec);
  // právě dokončená lekce je nejnovější dokončení (i když jde o opakování) → přepíše starší konec
  if (navic?.id) konce.set(navic.id, navic.konec || new Date().toISOString());
  return konce;
}

/**
 * Celé týdny (Spolu 8: témata): klíč `predmet:faze:tyden` pro každé téma předmětu se 2+ učebními lekcemi,
 * kde jsou všechny učební lekce dokončené. Naostro, B-varianty a testy se nepočítají; tyden 0 nikdy.
 */
export function celeTydny(lekce, { navic = null } = {}) {
  const hotove = konceDokonceni(lekce, navic);
  const tydny = new Map();
  for (const l of lekce.filter(jeUcebniLekce)) {
    const k = `${l.predmet || 'matematika'}:${l.faze}:${l.tyden}`;
    tydny.set(k, [...(tydny.get(k) || []), l.id]);
  }
  return new Set([...tydny].filter(([k, ids]) => !k.endsWith(':0') && ids.length >= 2 && ids.every((id) => hotove.has(id))).map(([k]) => k));
}

/** Konec výzvy jako 'RRRR-MM-DD' (volitelné `do` v datech, jinak poslední den měsíce). */
export function konecVyzvy(v) {
  return v?.do || posledniDenMesice(v.mesic);
}

/**
 * Kolik různých hlavních lekcí (oba předměty, učební i naostro) má aspoň jedno dokončení v měsíci výzvy
 * (do jejího konce), v Praze. R82: `dokonceniVse` (konce všech dokončených sezení z lekceProDite) — zopakování
 * listopadové lekce v prosinci tak listopadovou výzvu nezruší na žádném zařízení. Bez pole jen poslední dokončení.
 */
export function pocetVMesici(lekce, mesic, { navic = null, konec = posledniDenMesice(mesic) } = {}) {
  const vMesici = (cas) => { const d = datumVPraze(cas); return d.startsWith(`${mesic}-`) && d <= konec; };
  let n = 0;
  for (const l of lekce) {
    if (!jeLekceVyzvy(l)) continue;
    const konce = [...(Array.isArray(l.dokonceniVse) ? l.dokonceniVse : []), l.dokoncene?.konec, navic?.id === l.id ? (navic.konec || new Date().toISOString()) : null].filter(Boolean);
    if (konce.some(vMesici)) n += 1;
  }
  return n;
}

/** Klíč týdne taháku (z polí, nebo z id `t:predmet:faze:tyden`). */
function klicTahaku(t) {
  if (t.predmet && t.faze && t.tyden !== undefined) return `${t.predmet}:${t.faze}:${t.tyden}`;
  return String(t.id || '').replace(/^t:/, '');
}

/**
 * Odemčené taháky (Set id).
 * - taháky témat: všechny učební lekce tématu hotové (celeTydny);
 * - bonusové: splněná výzva svého měsíce, nebo `ted` ≥ ODEMCENI_BONUSU (Praha) — pak všechny; bez sezóny žádné.
 * @param {Array<object>} lekce  katalog s průběhem (lekceProDite): id, predmet?, faze, tyden, dokoncene {konec}, dokonceniVse?
 * @param {{ted?: number|string|Date, navic?: {id: string, konec?: string}, data?: object}} [volby]
 */
export function odemceneTahaky(lekce, { ted = Date.now(), navic = null, data = DATA } = {}) {
  const odemcene = new Set();
  const tydny = celeTydny(lekce, { navic });
  for (const t of tydenniTahaky({ data })) if (tydny.has(klicTahaku(t))) odemcene.add(t.id);
  if (sezonaZamcena(lekce)) return odemcene; // bez sezóny žádné zlaté taháky (R82)
  const vsechnyBonusy = datumVPraze(ted) >= ODEMCENI_BONUSU;
  for (const b of data.bonus) {
    const v = data.vyzvy.find((x) => x.mesic === b.mesic);
    if (vsechnyBonusy || (v && pocetVMesici(lekce, v.mesic, { navic, konec: konecVyzvy(v) }) >= Number(v.cil))) odemcene.add(b.id);
  }
  return odemcene;
}

/**
 * Stav výzvy aktuálního měsíce, nebo null (mimo období výzev).
 * @returns {{mesic: string, nazev: string, cil: number, hotovo: number, zbyvaDni: number, splneno: boolean,
 *   odmena: object|null, konec: string}|null}  zbyvaDni včetně dneška (poslední den = 1)
 */
export function stavVyzvy(lekce, ted = Date.now(), { navic = null, data = DATA } = {}) {
  const dnes = datumVPraze(ted);
  const v = data.vyzvy.find((x) => x.mesic === dnes.slice(0, 7));
  if (!v) return null;
  const konec = konecVyzvy(v);
  if (dnes > konec) return null;
  const cil = Number(v.cil);
  const hotovo = pocetVMesici(lekce, v.mesic, { navic, konec });
  return {
    mesic: v.mesic, nazev: v.nazev, cil, hotovo,
    zbyvaDni: dnyOd1970(konec) - dnyOd1970(dnes) + 1,
    splneno: hotovo >= cil,
    odmena: data.bonus.find((b) => b.mesic === v.mesic) || null,
    konec,
  };
}

/**
 * Proč je bonusový tahák (ne)dostupný: 'budouci' (výzva teprve bude), 'bezi' (výzva právě běží),
 * 'skoncila' (výzva skončila nesplněná; odemkne se ODEMCENI_BONUSU).
 */
export function obdobiVyzvy(b, ted = Date.now(), { data = DATA } = {}) {
  const dnes = datumVPraze(ted);
  const v = data.vyzvy.find((x) => x.mesic === b.mesic) || { mesic: b.mesic };
  if (dnes < `${v.mesic}-01`) return 'budouci';
  return dnes <= konecVyzvy(v) ? 'bezi' : 'skoncila';
}

/** Nově odemčené taháky proti už viděným (v pořadí sbírky). */
export function noveTahaky(odemcene, videne, { data = DATA } = {}) {
  const v = new Set(videne || []);
  return vsechnyTahaky({ data }).filter((t) => odemcene.has(t.id) && !v.has(t.id)).map((t) => t.id);
}
