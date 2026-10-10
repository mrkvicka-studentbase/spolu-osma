// =====================================================================
// odznaky.js — hotová lekce, „celá správně", týdny, řady a odznaky (zadání 30. 9., B–C; R61, R62).
// Čisté funkce bez DOM a bez sítě: počítá se při načtení stránky z uložených dat (sezení + souhrn),
// databáze se nemění. Obrázky odznaků jsou SVG řetězce tady v repozitáři (DOM z nich dělá odznaky-ui.js).
// =====================================================================

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
  { id: 'tyden', pochvala: 'Celý týden hotový. To je vytrvalost!', nazev: 'Celý týden', popis: 'Dokonči všechny lekce jednoho týdne.', barva: 'zelena',
    znak: (b) => `<rect x="21" y="23" width="30" height="27" rx="4" fill="none" stroke="${b.znak}" stroke-width="3"/><path d="M21 31h30M28 19v7M44 19v7" stroke="${b.znak}" stroke-width="3" stroke-linecap="round"/><path d="M28 40l5 5 9-9" fill="none" stroke="${b.znak}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'rada3', pochvala: 'Tři lekce za sebou. Jen tak dál!', nazev: 'Řada 3', popis: 'Tři lekce za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '3', 41, 24) + SIPKY(b) },
  { id: 'rada5', pochvala: 'Pět lekcí za sebou. Výborně!', nazev: 'Řada 5', popis: 'Pět lekcí za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '5', 41, 24) + SIPKY(b) },
  { id: 'rada10', pochvala: 'Deset lekcí za sebou. Klobouk dolů!', nazev: 'Řada 10', popis: 'Deset lekcí za sebou (pauza nejvýš týden).', barva: 'zelena', znak: (b) => CISLO(b, '10', 41, 22) + SIPKY(b) },
  { id: 'pilot', pochvala: 'Všechny pilotní lekce hotové!', nazev: 'Pilot hotový', popis: 'Dokonči všechny pilotní lekce.', barva: 'zlata',
    znak: (b) => `<path d="M26 54V18" stroke="${b.znak}" stroke-width="3.4" stroke-linecap="round"/><path d="M27 20h21l-5 7 5 7H27z" fill="${b.znak}"/>` },
  { id: 'faze1', pochvala: 'Celá Fáze 1 hotová. Obrovský kus práce!', nazev: 'Fáze 1 hotová', popis: 'Dokonči všechny lekce Fáze 1 (i vstupní diagnostiku).', barva: 'zlata',
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
 * Stav odznaků dítěte z katalogu s průběhem (lekceProDite): každá lekce má `id`, `faze`, `tyden`
 * a `dokoncene` = poslední dokončené sezení ({konec, souhrn}) nebo null.
 * @param {Array<object>} lekce
 * @param {{navic?: {id: string, konec: string}}} [volby]  navic = právě dokončená lekce, která v DB ještě dokončená není
 *   (žák na obrazovce „Hotovo" — rodič ještě kliká semafor); počítá se jen do dokončení a řad, ne do „celá správně"
 * @returns {{ziskane: Set<string>, hotove: Set<string>, celaSpravne: Set<string>, rada: {nejlepsi: number, aktualni: number},
 *   pocetHotovych: number, pocetCelkem: number}}
 */
export function spocitejOdznaky(lekce, { navic = null } = {}) {
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
  for (const l of lekce) {
    const k = `${l.predmet || 'matematika'}|${l.faze}|${l.tyden}`; // R66: týden každého předmětu zvlášť
    tydny.set(k, [...(tydny.get(k) || []), l.id]);
  }
  // jen týdny se 2+ lekcemi — týden 0 (diagnostika, 1 lekce) by dal „celý týden" zadarmo (ODPOVED 30. 9., bod 3)
  if ([...tydny.values()].some((ids) => ids.length >= 2 && ids.every((id) => hotove.has(id)))) ziskane.add('tyden');
  const rada = rady([...konce.values()]);
  for (const n of [3, 5, 10]) if (rada.nejlepsi >= n) ziskane.add(`rada${n}`);
  const pilot = lekce.filter((l) => l.faze === 'pilot');
  if (pilot.length && pilot.every((l) => hotove.has(l.id))) ziskane.add('pilot');
  const f1 = lekce.filter((l) => l.faze === 'faze1'); // včetně diagnostiky (ODPOVED 30. 9., bod 3)
  if (f1.length && f1.every((l) => hotove.has(l.id))) ziskane.add('faze1');

  return { ziskane, hotove, celaSpravne, rada, pocetHotovych: hotove.size, pocetCelkem: lekce.length };
}

/** Nově získané odznaky proti seznamu už ukázaných (v pořadí sady). */
export function noveOdznaky(ziskane, videne) {
  const v = new Set(videne || []);
  return [...ODZNAKY, ...ODZNAKY_CESTINY, ...ODZNAKY_OBA].filter((o) => ziskane.has(o.id) && !v.has(o.id)).map((o) => o.id);
}

// ---------------------------------------------------------------------
// R69 (Pavel 1. 10.): odznaky zvlášť pro matematiku a češtinu + společné za oba předměty.
// Matematika má id beze změny (už viděné odznaky se neukážou znovu), čeština „cj:<id>“, společné „oba:<id>“.
// ---------------------------------------------------------------------

/** Odznaky češtiny: jen ty, které jdou splnit se 4 pilotními lekcemi (řada 5 a 10 ne, Fáze 1 je jen matematika). */
const ZAKLAD_CESTINY = ['prvni', 'spravne', 'tyden', 'rada3', 'pilot'];
const BARVA_CESTINY = { zelena: 'modra', zlata: 'zlata' };
BARVY.modra = { telo: '#3B82F6', znak: '#FFFFFF', krouzek: '#FFFFFF' };

export const ODZNAKY_CESTINY = Object.freeze(ZAKLAD_CESTINY.map((id) => {
  const o = ODZNAKY.find((x) => x.id === id);
  return { ...o, id: `cj:${id}`, zaklad: id, nazev: `${o.nazev} z češtiny`, barva: BARVA_CESTINY[o.barva] };
}));

export const ODZNAKY_OBA = Object.freeze([
  { id: 'oba:prvni', pochvala: 'Matematika i čeština. Skvělý začátek!', nazev: 'Oba předměty', popis: 'Dokonči lekci z matematiky i z češtiny.', barva: 'zlata',
    znak: (b) => CISLO(b, '1+1', 44, 19) },
  { id: 'oba:tyden', pochvala: 'Celý týden matematiky i češtiny. Dvojnásobná vytrvalost!', nazev: 'Dvojitý týden', popis: 'Dokonči všechny lekce stejného týdne v matematice i v češtině.', barva: 'zlata',
    znak: (b) => `<rect x="21" y="23" width="30" height="27" rx="4" fill="none" stroke="${b.znak}" stroke-width="3"/><path d="M21 31h30M28 19v7M44 19v7" stroke="${b.znak}" stroke-width="3" stroke-linecap="round"/>${CISLO(b, '2×', 46, 14)}` },
  { id: 'oba:rada', pochvala: 'Řada v matematice i v češtině. Jen tak dál!', nazev: 'Dvojitá řada', popis: 'Tři lekce za sebou v matematice i v češtině.', barva: 'zlata',
    znak: (b) => CISLO(b, '3+3', 41, 18) + SIPKY(b) },
]);

/** Definice odznaku podle id (matematika, cj:…, oba:…). */
export function najdiOdznak(id) {
  return ODZNAKY.find((x) => x.id === id) || ODZNAKY_CESTINY.find((x) => x.id === id) || ODZNAKY_OBA.find((x) => x.id === id) || null;
}

/** Odznaky k zobrazení pro předmět (společné zvlášť přes ODZNAKY_OBA). */
export function odznakyPredmetu(predmet) {
  return predmet === 'cestina' ? ODZNAKY_CESTINY : ODZNAKY;
}

/**
 * Odznaky po předmětech (R69): spocitejOdznaky zvlášť pro matematiku a češtinu + společné.
 * `ziskane` obsahuje všechna id (matematika bez předpony, cj:…, oba:…); hotove a celaSpravne jsou sjednocení.
 * @param {Array<object>} lekce  katalog s průběhem (lekceProDite), `predmet` chybí = matematika
 * @param {{navic?: {id: string, konec: string}}} [volby]
 */
export function spocitejOdznakyPredmetu(lekce, { navic = null } = {}) {
  const predmet = (l) => l.predmet || 'matematika';
  const mat = lekce.filter((l) => predmet(l) === 'matematika');
  const cj = lekce.filter((l) => predmet(l) === 'cestina');
  const navicV = (seznam) => (navic && seznam.some((l) => l.id === navic.id) ? navic : null);
  const m = spocitejOdznaky(mat, { navic: navicV(mat) });
  const c = spocitejOdznaky(cj, { navic: navicV(cj) });
  const oba = new Set();
  if (cj.length && mat.length) {
    if (m.hotove.size && c.hotove.size) oba.add('oba:prvni');
    const celeTydny = (seznam, hotove) => {
      const t = new Map();
      for (const l of seznam) { const k = `${l.faze}|${l.tyden}`; t.set(k, [...(t.get(k) || []), l.id]); }
      return new Set([...t].filter(([, ids]) => ids.length >= 2 && ids.every((id) => hotove.has(id))).map(([k]) => k));
    };
    const tm = celeTydny(mat, m.hotove);
    if ([...celeTydny(cj, c.hotove)].some((k) => tm.has(k))) oba.add('oba:tyden');
    if (m.rada.nejlepsi >= 3 && c.rada.nejlepsi >= 3) oba.add('oba:rada');
  }
  const ziskane = new Set([...m.ziskane,
    ...ODZNAKY_CESTINY.filter((o) => c.ziskane.has(o.zaklad)).map((o) => o.id), ...oba]);
  return {
    ziskane, matematika: m, cestina: c, oba,
    hotove: new Set([...m.hotove, ...c.hotove]), celaSpravne: new Set([...m.celaSpravne, ...c.celaSpravne]),
    maObaPredmety: Boolean(cj.length && mat.length),
  };
}
