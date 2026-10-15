// =====================================================================
// odznaky.js — hotová lekce, „celá správně", témata, řady a odznaky (zadání 30. 9., B–C; R61, R62; Spolu 8: téma, úvodní test, předmět).
// Čisté funkce bez DOM a bez sítě: počítá se při načtení stránky z uložených dat (sezení + souhrn),
// databáze se nemění. Obrázek odznaku: htmlOdznaku (R81, vrstvy HTML/CSS podle návrhu designérky; DOM z něj dělá
// odznaky-ui.js a odznaky-karty.js); starší svgOdznaku zůstává pro malou hvězdu v rohu karty lekce a pro testy.
// =====================================================================

import { jeBVarianta } from './plan-roku.js';
import { DATA as DATA_TAHAKU, tydenniTahaky, odemceneTahaky, pocetVMesici, konecVyzvy, sezonaZamcena } from './tahaky.js';

/**
 * Řada (R62): mezi dvěma sousedními dokončenými lekcemi nejvýš 7 KALENDÁŘNÍCH dní v Europe/Prague
 * (pondělí večer → další pondělí ráno i večer je v řadě; víkend ani týden pauzy ji neruší).
 */
export const MAX_PAUZA_RADY_DNU = 7;

const FORMAT_PRAHA = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit' });

/** Pořadové číslo kalendářního dne v Praze (nezávislé na změně času). */
export function denVPraze(cas) {
  const [r, m, d] = FORMAT_PRAHA.format(new Date(cas)).split('-').map(Number);
  return Math.round(Date.UTC(r, m - 1, d) / 86400000);
}

const BARVY = {
  zelena: { telo: '#1FC27E', znak: '#FFFFFF', krouzek: '#FFFFFF' },
  zlata: { telo: '#F5C518', znak: '#0F172A', krouzek: '#0F172A' },
  modra: { telo: '#3B82F6', znak: '#FFFFFF', krouzek: '#FFFFFF' },
};

const SIPKY = (b) => `<path d="M26 49l4 3-4 3M34 49l4 3-4 3M42 49l4 3-4 3" fill="none" stroke="${b.znak}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
const CISLO = (b, t, y = 47, vel = 30) => `<text x="36" y="${y}" text-anchor="middle" font-family="Sora, sans-serif" font-weight="700" font-size="${vel}" fill="${b.znak}">${t}</text>`;

/**
 * Sada odznaků (pořadí = pořadí zobrazení). 7 za vytrvalost a dokončení, 1 za přesnost (zadání: aspoň polovina za vytrvalost).
 * @type {ReadonlyArray<{id: string, pochvala: string, nazev: string, popis: string, barva: 'zelena'|'zlata', znak: (b: object) => string}>}
 */
export const ODZNAKY = Object.freeze([
  { id: 'prvni', pochvala: 'Máš za sebou první lekci. Tak se začíná!', nazev: 'První lekce', popis: 'Dokonči první lekci.', barva: 'zelena', znak: (b) => CISLO(b, '1') },
  { id: 'spravne', pochvala: 'Všechny úlohy lekce zelené. Paráda!', nazev: 'Celá správně', popis: 'Lekce, kde jsou všechny úlohy zelené.', barva: 'zlata',
    znak: (b) => `<path d="M36 17l5.6 11.6 12.7 1.8-9.2 8.9 2.2 12.6L36 46l-11.3 5.9 2.2-12.6-9.2-8.9 12.7-1.8z" fill="${b.znak}"/>` },
  { id: 'tyden', pochvala: 'Celé téma hotové. To je vytrvalost!', nazev: 'Celé téma', popis: 'Dokonči všechny lekce jednoho tématu (i naostro).', barva: 'zelena',
    znak: (b) => `<rect x="21" y="23" width="30" height="27" rx="4" fill="none" stroke="${b.znak}" stroke-width="3"/><path d="M21 31h30M28 19v7M44 19v7" stroke="${b.znak}" stroke-width="3" stroke-linecap="round"/><path d="M28 40l5 5 9-9" fill="none" stroke="${b.znak}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'rada3', pochvala: 'Tři lekce za sebou. Jen tak dál!', nazev: 'Řada 3', popis: 'Tři lekce za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '3', 41, 24) + SIPKY(b) },
  { id: 'rada5', pochvala: 'Pět lekcí za sebou. Výborně!', nazev: 'Řada 5', popis: 'Pět lekcí za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '5', 41, 24) + SIPKY(b) },
  { id: 'rada10', pochvala: 'Deset lekcí za sebou. Klobouk dolů!', nazev: 'Řada 10', popis: 'Deset lekcí za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '10', 41, 22) + SIPKY(b) },
  // R80: delší řady (rok má 160 hlavních lekcí, 6 týdně; přes Vánoce delší pauza řadu přeruší)
  { id: 'rada20', pochvala: 'Dvacet lekcí za sebou. To je síla!', nazev: 'Řada 20', popis: 'Dvacet lekcí za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '20', 41, 22) + SIPKY(b) },
  { id: 'rada30', pochvala: 'Třicet lekcí za sebou. Obdivuhodná vytrvalost!', nazev: 'Řada 30', popis: 'Třicet lekcí za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '30', 41, 22) + SIPKY(b) },
  { id: 'test', pochvala: 'Úvodní test hotový. Teď víme, kde začít!', nazev: 'Úvodní test', popis: 'Dokonči úvodní test v jednom předmětu.', barva: 'zlata',
    znak: (b) => `<path d="M26 54V18" stroke="${b.znak}" stroke-width="3.4" stroke-linecap="round"/><path d="M27 20h21l-5 7 5 7H27z" fill="${b.znak}"/>` },
  { id: 'predmet', pochvala: 'Celý předmět hotový. Obrovský kus práce!', nazev: 'Celý předmět', popis: 'Dokonči všech 40 lekcí jednoho předmětu.', barva: 'zlata',
    znak: (b) => `<path d="M25 20h22v8a11 11 0 0 1-22 0z" fill="${b.znak}"/><path d="M25 23h-5a5 5 0 0 0 5 8M47 23h5a5 5 0 0 1-5 8" fill="none" stroke="${b.znak}" stroke-width="2.6"/><path d="M36 39v7M28 52h16M31 46h10" stroke="${b.znak}" stroke-width="3.4" stroke-linecap="round"/>` },
]);

/** SVG odznaku jako řetězec (72 × 72 viewBox). `titulek` = přístupný název (jinak aria-hidden). */
export function svgOdznaku(id, { titulek = '' } = {}) {
  const o = najdiOdznak(id);
  if (!o) return '';
  const b = BARVY[o.barva];
  const pristup = titulek ? `role="img" aria-label="${titulek.replace(/"/g, '&quot;')}"` : 'aria-hidden="true"';
  return `<svg viewBox="0 0 72 72" ${pristup} focusable="false"><circle cx="36" cy="36" r="34" fill="#0F172A"/><circle cx="36" cy="36" r="29" fill="${b.telo}"/>`
    + `<circle cx="36" cy="36" r="25" fill="none" stroke="${b.krouzek}" stroke-opacity=".3" stroke-width="1.5" stroke-dasharray="3 3"/>${o.znak(b)}</svg>`;
}

/**
 * „Celá správně" (R61): běžná lekce, blok nebo rozbor — v souhrnu dokončeného sezení má KAŽDÁ úloha semafor zelený.
 * Zelená podle matice kostry 02 = správně „sám" i „s otázkou". Simulace a diagnostika semafor u úloh nemají → nikdy.
 * @param {object|null} souhrn  sezeni.souhrn = { barvy: {uloha_id: barva}, pocetUloh?, typ? }
 */
export function jeCelaSpravne(souhrn) {
  if (!souhrn || souhrn.typ === 'simulace' || souhrn.typ === 'diagnostika') return false;
  const barvy = Object.values(souhrn.barvy || {});
  const pocet = Number(souhrn.pocetUloh) || 4; // starší souhrny počet neukládají — běžná lekce i blok mají 4 úlohy
  return barvy.length >= pocet && barvy.every((b) => b === 'zelena');
}

/**
 * Nejdelší řada dokončených lekcí: časy dokončení seřazené, řada pokračuje, když mezi sousedními
 * je nejvýš MAX_PAUZA_RADY_DNU kalendářních dní (Europe/Prague). Vrací {nejlepsi, aktualni} (aktualni = řada končící posledním dokončením).
 * @param {Array<string|number>} casy  ISO nebo ms
 */
export function rady(casy) {
  const t = casy.map((c) => (typeof c === 'number' ? c : Date.parse(c))).filter(Number.isFinite).sort((a, b) => a - b);
  let nejlepsi = 0; let aktualni = 0; let predchozi = null;
  for (const x of t) {
    aktualni = predchozi !== null && denVPraze(x) - denVPraze(predchozi) <= MAX_PAUZA_RADY_DNU ? aktualni + 1 : 1;
    nejlepsi = Math.max(nejlepsi, aktualni);
    predchozi = x;
  }
  return { nejlepsi, aktualni };
}

/**
 * Stav odznaků dítěte z katalogu s průběhem (lekceProDite): každá lekce má `id`, `predmet`, `faze`, `tyden`
 * a `dokoncene` = poslední dokončené sezení ({konec, souhrn}) nebo null (R82: i `dokonceniVse`).
 * @param {Array<object>} lekce
 * @param {{navic?: {id: string, konec: string}, ted?: number|string, videne?: string[]|null}} [volby]
 *   navic = právě dokončená lekce, která v DB ještě dokončená není (žák na obrazovce „Hotovo" — rodič ještě kliká
 *   semafor); počítá se jen do dokončení, řad, výzev a taháků, ne do „celá správně";
 *   ted = čas pro taháky (zlaté taháky se odemknou k datu, sbírka je ale jen z taháků témat);
 *   videne = už ukázané odznaky z tohoto zařízení: R80 — jednou viděný odznak se nikdy neodebírá
 *   (např. výzva po opakování lekce v dalším měsíci, celý předmět po doplnění lekcí do katalogu)
 * @returns {{ziskane: Set<string>, hotove: Set<string>, celaSpravne: Set<string>, rada: {nejlepsi: number, aktualni: number},
 *   pocetHotovych: number, pocetCelkem: number, maObaPredmety: boolean}}
 */
export function spocitejOdznaky(lekce, { navic = null, ted = Date.now(), videne = null } = {}) {
  const konce = new Map();
  const celaSpravne = new Set();
  for (const l of lekce) {
    if (l.dokoncene?.konec) konce.set(l.id, l.dokoncene.konec);
    if (l.dokoncene && jeCelaSpravne(l.dokoncene.souhrn)) celaSpravne.add(l.id);
  }
  if (navic?.id && !konce.has(navic.id)) konce.set(navic.id, navic.konec || new Date().toISOString());
  const hotove = new Set(konce.keys());

  const ziskane = new Set();
  if (hotove.size >= 1) ziskane.add('prvni');
  if (celaSpravne.size >= 1) ziskane.add('spravne');
  const tydny = new Map();
  for (const l of lekce.filter((x) => !jeBVarianta(x) && Number(x.tyden) > 0)) {
    // Spolu 8: téma = předmět + číslo tématu (matematika i čeština mají témata 1–10 ve stejné fázi);
    // B-varianty (jen po červené, ZADANI-OSMA §9) se do celého tématu ani předmětu nepočítají
    const k = `${l.predmet || 'matematika'}|${l.faze}|${l.tyden}`;
    tydny.set(k, [...(tydny.get(k) || []), l.id]);
  }
  // jen týdny se 2+ lekcemi; R80: téma 0 (úvodní + pololetní test, od 9. 10. dvě lekce) se nepočítá nikdy
  if ([...tydny.values()].some((ids) => ids.length >= 2 && ids.every((id) => hotove.has(id)))) ziskane.add('tyden');
  const rada = rady([...konce.values()]);
  for (const n of [3, 5, 10, 20, 30]) if (rada.nejlepsi >= n) ziskane.add(`rada${n}`);
  // Spolu 8: úvodní test (diagnostika, tyden 0) v aspoň jednom předmětu; celý předmět = všechny lekce kromě testu
  if (lekce.some((l) => Number(l.tyden) === 0 && hotove.has(l.id))) ziskane.add('test');
  for (const p of ['matematika', 'cestina']) {
    const lp = lekce.filter((l) => (l.predmet || 'matematika') === p && Number(l.tyden) > 0 && !jeBVarianta(l));
    if (lp.length >= 4 && lp.every((l) => hotove.has(l.id))) ziskane.add('predmet');
  }

  // R80: oba předměty, výzvy a sbírka taháků; jednou viděný odznak zůstává
  const oba = odznakyObaPredmetu(lekce, konce);
  for (const id of oba.ziskane) ziskane.add(id);
  for (const id of odznakyVyzevATahaku(lekce, { navic, ted })) ziskane.add(id);
  for (const id of videne || []) if (najdiOdznak(id)) ziskane.add(id);

  return { ziskane, hotove, celaSpravne, rada, pocetHotovych: hotove.size, pocetCelkem: lekce.length, maObaPredmety: oba.maOba };
}

/** Nově získané odznaky proti seznamu už ukázaných (v pořadí sady). */
export function noveOdznaky(ziskane, videne) {
  const v = new Set(videne || []);
  return VSECHNY_ODZNAKY().filter((o) => ziskane.has(o.id) && !v.has(o.id)).map((o) => o.id);
}

// ---------------------------------------------------------------------
// R80 (převzato ze Spolu 9, upraveno na Spolu 8): odznaky za oba předměty, za splněné měsíční výzvy
// a za sbírku taháků. Odznaky Spolu 8 patří dítěti (sada ODZNAKY za oba předměty dohromady), proto
// odznaky jen jednoho předmětu (cj:…) nejsou; za oba předměty jsou dva nové (oba:…).
// ---------------------------------------------------------------------

export const ODZNAKY_OBA = Object.freeze([
  { id: 'oba:prvni', pochvala: 'Matematika i čeština. Skvělý začátek!', nazev: 'Oba předměty', popis: 'Dokonči lekci z matematiky i z češtiny.', barva: 'zlata',
    znak: (b) => CISLO(b, '1+1', 44, 19) },
  { id: 'oba:rada', pochvala: 'Řada v matematice i v češtině. Jen tak dál!', nazev: 'Dvojitá řada', popis: 'Tři lekce za sebou v matematice i v češtině.', barva: 'zlata',
    znak: (b) => CISLO(b, '3+3', 41, 18) + SIPKY(b) },
]);

/** Odznaky za oba předměty z konců dokončení (Map id → konec, včetně právě dokončené lekce). */
function odznakyObaPredmetu(lekce, konce) {
  const predmet = (l) => l.predmet || 'matematika';
  const mat = lekce.filter((l) => predmet(l) === 'matematika');
  const cj = lekce.filter((l) => predmet(l) === 'cestina');
  const ziskane = new Set();
  const maOba = Boolean(mat.length && cj.length);
  if (maOba) {
    const casy = (seznam) => seznam.filter((l) => konce.has(l.id)).map((l) => konce.get(l.id));
    const cm = casy(mat); const cc = casy(cj);
    if (cm.length && cc.length) ziskane.add('oba:prvni');
    if (rady(cm).nejlepsi >= 3 && rady(cc).nejlepsi >= 3) ziskane.add('oba:rada');
  }
  return { ziskane, maOba };
}

const MESIC_V = { '01': 'v lednu', '02': 'v únoru', '03': 'v březnu', '04': 'v dubnu', '05': 'v květnu', '06': 'v červnu', '09': 'v září', '10': 'v říjnu', '11': 'v listopadu', '12': 'v prosinci' };
const MESIC_ZKR = { '01': 'LED', '02': 'ÚNO', '03': 'BŘE', '04': 'DUB', '05': 'KVĚ', '06': 'ČVN', '09': 'ZÁŘ', '10': 'ŘÍJ', '11': 'LIS', '12': 'PRO' };
const HVEZDA = (b) => `<path d="M36 15l3.2 6.6 7.2 1-5.2 5 1.3 7.2L36 31.4l-6.5 3.4 1.3-7.2-5.2-5 7.2-1z" fill="${b.znak}"/>`;
const KARTICKY = (b, t) => `<rect x="23" y="17" width="20" height="25" rx="3" fill="none" stroke="${b.znak}" stroke-width="2.4" opacity=".55"/>`
  + `<rect x="28" y="21" width="21" height="26" rx="3" fill="${b.telo}" stroke="${b.znak}" stroke-width="2.6"/>${CISLO(b, t, 40, t.length > 2 ? 11 : 14)}`;
const slovoLekci = (n) => (n === 1 ? 'lekci' : n >= 2 && n <= 4 ? 'lekce' : 'lekcí');

/** Odznak za každou měsíční výzvu z tahaky-bonus.js (VYZVY): `vyzva:RRRR-MM`, zlatý kruh s hvězdou a zkratkou měsíce. */
export const ODZNAKY_VYZEV = Object.freeze(DATA_TAHAKU.vyzvy.map((v) => {
  const m = v.mesic.slice(5);
  return {
    id: `vyzva:${v.mesic}`, mesic: v.mesic, barva: 'zlata', nazev: v.nazev,
    pochvala: 'Výzva splněna. Zlatý tahák je tvůj!',
    popis: `Dokonči ${v.cil} ${slovoLekci(Number(v.cil))} ${MESIC_V[m] || ''}`.trim().replace(/\.?$/, '.'),
    znak: (b) => HVEZDA(b) + CISLO(b, MESIC_ZKR[m] || m, 52, 13),
  };
}));

export const ODZNAKY_SBIRKY = Object.freeze([
  { id: 'sber:5', nazev: 'Sběratel', pochvala: 'Pět taháků ve sbírce!', popis: 'Odemkni 5 taháků.', barva: 'zelena', pocet: 5, znak: (b) => KARTICKY(b, '5') },
  { id: 'sber:15', nazev: 'Velký sběratel', pochvala: 'Patnáct taháků ve sbírce. Paráda!', popis: 'Odemkni 15 taháků.', barva: 'zelena', pocet: 15, znak: (b) => KARTICKY(b, '15') },
  { id: 'sber:vse', nazev: 'Celá sbírka', pochvala: 'Máš taháky ke všem tématům. Paráda!', popis: 'Odemkni taháky všech témat.', barva: 'zlata', pocet: Infinity, znak: (b) => KARTICKY(b, 'vše') },
]);

/** Výzvy a sbírka v jednom seznamu (pořadí zobrazení). */
export const ODZNAKY_VYZVY_A_TAHAKY = Object.freeze([...ODZNAKY_VYZEV, ...ODZNAKY_SBIRKY]);

/** Všechny odznaky v pořadí zobrazení (za lekce, oba předměty, výzvy, sbírka). */
const VSECHNY_ODZNAKY = () => [...ODZNAKY, ...ODZNAKY_OBA, ...ODZNAKY_VYZVY_A_TAHAKY];

/**
 * Získané odznaky za výzvy a sbírku taháků. Výzva = aspoň `cil` hlavních lekcí dokončených v měsíci (tahaky.js
 * pocetVMesici, R82 i opakování); bez sezóny se výzvy nepočítají. Sbírka = počet odemčených taháků TÉMAT
 * (zlaté se nepočítají); `sber:vse` = všechny taháky témat.
 */
export function odznakyVyzevATahaku(lekce, { navic = null, ted = Date.now() } = {}) {
  const ziskane = new Set();
  if (!sezonaZamcena(lekce)) for (const v of DATA_TAHAKU.vyzvy) {
    if (pocetVMesici(lekce, v.mesic, { navic, konec: konecVyzvy(v) }) >= Number(v.cil)) ziskane.add(`vyzva:${v.mesic}`);
  }
  const tematu = [...odemceneTahaky(lekce, { ted, navic })].filter((id) => !id.startsWith('b:')).length;
  const celkem = tydenniTahaky().length;
  for (const o of ODZNAKY_SBIRKY) if (celkem && tematu >= Math.min(o.pocet, celkem)) ziskane.add(o.id);
  return ziskane;
}

/** Definice odznaku podle id (za lekce, oba:…, vyzva:…, sber:…). */
export function najdiOdznak(id) {
  return VSECHNY_ODZNAKY().find((x) => x.id === id) || null;
}

// ---------------------------------------------------------------------
// R81 (převzato ze Spolu 9, návrh designérky 8. 10.): odznak z vrstev (rám, pruhovaný kruh, jádro, líc
// s odleskem a přejíždějícím leskem), tvar podle skupiny, tón podle barvy, znak v currentColor.
// Vykresluje se jako HTML řetězec (htmlOdznaku); styly v design-system.css, sekce „Redesign odznaků a karet“.
// ---------------------------------------------------------------------

const ZNAK_HVEZDA = (velka = false) => `<svg class="odz__hvezda${velka ? ' odz__hvezda--velka' : ''}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">`
  + '<path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z"/></svg>';
const ZNAK_SIPKY = '<svg class="odz__sipky" viewBox="0 0 30 12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
  + '<path d="M3 2l5 4-5 4M12.5 2l5 4-5 4M22 2l5 4-5 4"/></svg>';
const ZNAK_CISLO = (t, maly = false) => `<span class="odz__cislo${maly ? ' odz__cislo--maly' : ''}">${t}</span>`;
const ZNAK_POHAR = '<svg class="odz__pohar" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
  + '<path d="M7.5 4h9v4.5a4.5 4.5 0 0 1-9 0z"/><path d="M7.5 5.5H4.5v1.5a3 3 0 0 0 3 3M16.5 5.5h3v1.5a3 3 0 0 1-3 3M12 13v4" fill="none"/><path d="M8.5 17.5h7v2.5h-7z"/></svg>';
/** Kalendář (tvar ze SVG „Celé téma“) s fajfkou. */
const ZNAK_KALENDAR = '<svg class="odz__ikona" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
  + '<rect x="3.5" y="5.5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10.5h17M8 3v4.5M16 3v4.5"/><path d="M8.4 15.6l2.6 2.6 4.8-4.8" stroke-width="2.4"/></svg>';
const ZNAK_VLAJKA = '<svg class="odz__ikona" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">'
  + '<path d="M6.5 21.5V3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M7.5 3.8h12l-3.2 4.4 3.2 4.4h-12z"/></svg>';
const ZNAK_ZAMEK = '<span class="odz__zamek" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">'
  + '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>';

/** Znaky odznaků (id → HTML). Řady mají číslo a šipky, úvodní test vlajku, celý předmět pohár. */
const ZNAKY = {
  prvni: () => ZNAK_CISLO('1'),
  spravne: () => ZNAK_HVEZDA(true),
  tyden: () => ZNAK_KALENDAR,
  rada3: () => ZNAK_CISLO('3') + ZNAK_SIPKY,
  rada5: () => ZNAK_CISLO('5') + ZNAK_SIPKY,
  rada10: () => ZNAK_CISLO('10') + ZNAK_SIPKY,
  rada20: () => ZNAK_CISLO('20') + ZNAK_SIPKY,
  rada30: () => ZNAK_CISLO('30') + ZNAK_SIPKY,
  'oba:prvni': () => ZNAK_CISLO('1+1', true),
  'oba:rada': () => ZNAK_CISLO('3+3', true) + ZNAK_SIPKY,
  test: () => ZNAK_VLAJKA,
  predmet: () => ZNAK_POHAR,
};

function znakOdznaku(o) {
  if (o.id.startsWith('vyzva:')) return `${ZNAK_HVEZDA()}<span class="odz__zkratka">${MESIC_ZKR[o.mesic.slice(5)] || o.mesic.slice(5)}</span>`;
  if (o.id.startsWith('sber:')) {
    const t = o.id === 'sber:vse' ? 'vše' : o.id.slice(5);
    return `<span class="odz__karticky${t.length > 2 ? ' odz__karticky--maly' : ''}">${t}</span>`;
  }
  return (ZNAKY[o.id] || ZNAKY[o.zaklad] || (() => ''))();
}

/**
 * Tvar a tón odznaku (Spolu 8): odznaky za lekce (sada bez předpony, patří dítěti za oba předměty) kruh;
 * čeština (`cj:`, kdyby se sada dělila po předmětech) štít; za oba předměty (`oba:`) a sbírka taháků (`sber:`)
 * šestiúhelník; měsíční výzvy (`vyzva:`) kruh. Tón = barva odznaku (zelena, zlata, modra).
 * @returns {{tvar: 'kruh'|'stit'|'sestiuhelnik', ton: 'zelena'|'zlata'|'modra'}|null}
 */
export function vzhledOdznaku(id) {
  const o = najdiOdznak(id);
  if (!o) return null;
  const tvar = id.startsWith('cj:') ? 'stit' : id.startsWith('oba:') || id.startsWith('sber:') ? 'sestiuhelnik' : 'kruh';
  return { tvar, ton: o.barva };
}

const escAtribut = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Odznak v novém stylu jako HTML řetězec (span, uvnitř jen spany a SVG — smí do tlačítka).
 * @param {string} id
 * @param {{velikost?: number|null, zamceno?: boolean, titulek?: string}} [volby]
 *   velikost = px (jinak ji určí CSS, výchozí 96 px; pod 56 px bez lesku a bez zámku), zamceno = šedý se zámkem,
 *   titulek = přístupný název (jinak aria-hidden)
 */
export function htmlOdznaku(id, { velikost = null, zamceno = false, titulek = '' } = {}) {
  const o = najdiOdznak(id);
  if (!o) return '';
  const { tvar, ton } = vzhledOdznaku(id);
  const px = Number(velikost) || 0;
  const maly = px > 0 && px < 56;
  const tridy = ['odz', `odz--${tvar}`, `odz--${ton}`, zamceno && 'odz--zamceno', maly && 'odz--maly'].filter(Boolean).join(' ');
  const pristup = titulek ? `role="img" aria-label="${escAtribut(titulek)}"` : 'aria-hidden="true"';
  return `<span class="${tridy}" ${pristup}${px ? ` style="--s:${px}px"` : ''} data-odznak="${escAtribut(id)}">`
    + '<span class="odz__ram"></span><span class="odz__pruhy"></span><span class="odz__jadro"></span>'
    + `<span class="odz__lic">${znakOdznaku(o)}</span>${zamceno && !maly ? ZNAK_ZAMEK : ''}</span>`;
}
