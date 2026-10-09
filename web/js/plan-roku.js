// =====================================================================
// plan-roku.js — Spolu 8 na celý školní rok (ZADANI-OSMA §9, PLAN-ROZSIRENI.md; Pavel 9. 10. 2026).
// Čisté funkce bez DOM a sítě (testy/plan-roku.test.js).
//
// Druhy lekcí (podle id, DB se nemění):
//   učební   M8-T03-L2    cj-t3-l10
//   naostro  M8-T03-L2N   cj-t3-l10n    — dvojče učební lekce, o kus těžší („teď ukaž, že to umíš“)
//   B        M8-T03-L2B   cj-t3-l10b    — stejná lekce s jinými slovy/čísly, nabídne se jen po ČERVENÉ
//            M8-T03-L2NB  cj-t3-l10nb     (i k naostro lekci)
//   testy    M8-T00-DIAG  cj-t0-diag    — úvodní;  M8-T00-POL  cj-t0-pol — pololetní (od 11. týdne kalendáře)
// Pořadí v tématu s odstupem: L1, L2, L1N, L3, L2N, L4, L3N, L4N (naostro o jednu lekci později).
// Témata podle úvodního (po pololetním podle pololetního) testu: nesilná v pořadí osnovy, silná na konec.
// Celý rok jsou v plánu všechny lekce (i silných témat — ta jdou na konec), B-varianty v plánu nejsou.
// Kalendář pro každé dítě: od jeho prvního sezení v předmětu je otevřeno 3 × (počet započatých týdnů) lekcí plánu.
// Hotové a rozpracované lekce jsou vždy otevřené a v plánu jdou první (v pořadí, jak je dítě začalo),
// takže pololetní test přeskládá jen to, co ještě zbývá.
// =====================================================================

/** Lekcí týdně v jednom předmětu (ZADANI-OSMA §9 bod 1). */
export const LEKCI_TYDNE = 3;
/** Pololetní test se otevře na začátku 11. týdne kalendáře dítěte (start v listopadu → leden). */
export const TYDEN_POLOLETNIHO = 10;
const DEN = 24 * 3600 * 1000;

const RE_MAT = /^M8-T(\d{2})-(?:L([1-4])(N?)(B?)|(DIAG|POL))$/;
const RE_CJ = /^cj-t(\d{1,2})-(?:l(\d{1,2})(n?)(b?)|(diag|pol))$/;

/**
 * Rozbor id lekce Spolu 8.
 * @param {string} id
 * @returns {{predmet: 'matematika'|'cestina', tema: number, naostro: boolean, b: boolean, test: 'uvodni'|'pololetni'|null,
 *   hlavni: string, ucebni: string}|null}  hlavni = id bez B; ucebni = id bez N a B
 */
export function druhLekce(id) {
  const s = String(id || '');
  let m = RE_MAT.exec(s);
  if (m) {
    const test = m[5] ? (m[5] === 'DIAG' ? 'uvodni' : 'pololetni') : null;
    const ucebni = test ? s : `M8-T${m[1]}-L${m[2]}`;
    return { predmet: 'matematika', tema: Number(m[1]), naostro: m[3] === 'N', b: m[4] === 'B', test, hlavni: test ? s : `${ucebni}${m[3]}`, ucebni };
  }
  m = RE_CJ.exec(s);
  if (m) {
    const test = m[5] ? (m[5] === 'diag' ? 'uvodni' : 'pololetni') : null;
    const ucebni = test ? s : `cj-t${m[1]}-l${m[2]}`;
    return { predmet: 'cestina', tema: Number(m[1]), naostro: m[3] === 'n', b: m[4] === 'b', test, hlavni: test ? s : `${ucebni}${m[3]}`, ucebni };
  }
  return null;
}

export const jeBVarianta = (l) => Boolean(druhLekce(l?.id)?.b);
export const jeNaostro = (l) => Boolean(druhLekce(l?.id)?.naostro);
export const jePololetniTest = (l) => druhLekce(l?.id)?.test === 'pololetni';
export const jeUvodniTest = (l) => druhLekce(l?.id)?.test === 'uvodni';

/** Id B-varianty k lekci (učební i naostro). */
export function idBVarianty(id) {
  const d = druhLekce(id);
  if (!d || d.test || d.b) return null;
  return d.predmet === 'matematika' ? `${id}B` : `${id}b`;
}

/**
 * Lekce jednoho tématu v pořadí s odstupem: L1, L2, L1N, L3, L2N, L4, L3N, L4N (chybějící se přeskočí).
 * @param {Array<{id: string, poradi: number}>} lekceTematu  bez B-variant a testů
 */
export function poradiVTematu(lekceTematu) {
  const klic = (l) => `${Number(l.poradi)}${jeNaostro(l) ? 'N' : ''}`;
  const podle = new Map(lekceTematu.map((l) => [klic(l), l]));
  const vzor = ['1', '2', '1N', '3', '2N', '4', '3N', '4N'];
  const serazene = vzor.map((k) => podle.get(k)).filter(Boolean);
  const zbytek = lekceTematu.filter((l) => !serazene.includes(l)); // nečekané poradi (5+) na konec tématu
  return [...serazene, ...zbytek];
}

/**
 * Plán roku jednoho předmětu: nejdřív začaté lekce (v pořadí, jak je dítě začalo), pak zbytek po tématech
 * v pořadí `poradiTemat`, uvnitř tématu s odstupem. B-varianty a testy v plánu nejsou.
 * @param {Array<object>} lekce  položky lekceProDite jednoho předmětu
 * @param {number[]} poradiTemat  doporučené pořadí témat (doporuceni.js doporucenePoradiTemat)
 * @returns {Array<object>}
 */
export function planRoku(lekce, poradiTemat) {
  const hlavni = lekce.filter((l) => { const d = druhLekce(l.id); return d && !d.b && !d.test; });
  const zacatek = (l) => Date.parse(prvniZacatek(l) || '') || Infinity;
  const zacate = hlavni.filter((l) => l.stavLekce === 'hotovo' || l.stavLekce === 'probiha')
    .sort((a, b) => zacatek(a) - zacatek(b) || String(a.id).localeCompare(String(b.id)));
  const zbyva = hlavni.filter((l) => !zacate.includes(l));
  const temata = [...poradiTemat, ...[...new Set(zbyva.map((l) => Number(l.tyden)))].filter((t) => !poradiTemat.includes(t)).sort((a, b) => a - b)];
  const dalsi = temata.flatMap((t) => poradiVTematu(zbyva.filter((l) => Number(l.tyden) === t)));
  return [...zacate, ...dalsi];
}

/** Nejstarší známý začátek lekce (dokončené i rozpracované sezení). */
function prvniZacatek(l) {
  const casy = [l.dokoncene?.zacatek, l.sezeni?.zacatek].filter(Boolean);
  return casy.sort()[0] || null;
}

/**
 * Začátek kalendáře dítěte v předmětu = první sezení (lekce i testy) v tomto předmětu; null = ještě nic nezačalo.
 * @param {Array<object>} lekcePredmetu  položky lekceProDite (i testy a B-varianty)
 * @returns {Date|null}
 */
export function zacatekKalendare(lekcePredmetu) {
  const casy = lekcePredmetu.map(prvniZacatek).filter(Boolean).map((x) => Date.parse(x)).filter(Number.isFinite);
  return casy.length ? new Date(Math.min(...casy)) : null;
}

/** Půlnoc (místní čas) dne `d`. */
const pulnoc = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

/** Kolikátý týden kalendáře právě běží (0 = první). Bez začátku = 0. */
export function tydenKalendare(start, ted = new Date()) {
  if (!start) return 0;
  return Math.max(0, Math.floor((pulnoc(ted) - pulnoc(start)) / (7 * DEN)));
}

/**
 * Kalendář dítěte: které lekce plánu jsou otevřené a od kdy se otevřou ostatní.
 * @param {Array<object>} plan  planRoku
 * @param {Date|null} start  zacatekKalendare (null = dítě ještě nezačalo → první týden je dnes)
 * @param {Date} [ted]
 * @returns {Map<string, {otevreno: boolean, od: Date}>}
 */
export function kalendar(plan, start, ted = new Date()) {
  const zacatek = pulnoc(start || ted);
  const otevreno = LEKCI_TYDNE * (tydenKalendare(zacatek, ted) + 1);
  return new Map(plan.map((l, i) => {
    const od = new Date(zacatek.getTime() + Math.floor(i / LEKCI_TYDNE) * 7 * DEN);
    const zacata = l.stavLekce === 'hotovo' || l.stavLekce === 'probiha';
    return [l.id, { otevreno: zacata || i < otevreno, od }];
  }));
}

/** Od kdy je otevřený pololetní test (začátek 11. týdne kalendáře). null = dítě ještě nezačalo. */
export function otevreniPololetniho(start) {
  if (!start) return null;
  return new Date(pulnoc(start).getTime() + TYDEN_POLOLETNIHO * 7 * DEN);
}

/**
 * B-varianta k lekci, když je potřeba: lekce je hotová s ČERVENOU (souhrn.hlavniBarva) a B-varianta existuje.
 * Oranžová B-variantu nedostává (ústní pětiminutovka rodiče, ZADANI-OSMA §9 bod 4).
 * @param {object} l  hlavní lekce (lekceProDite)
 * @param {Map<string, object>} podleId  všechny lekce předmětu podle id
 * @returns {object|null}  položka B-varianty
 */
export function bVariantaPoCervene(l, podleId) {
  if (l?.stavLekce !== 'hotovo' || l.souhrn?.hlavniBarva !== 'cervena') return null;
  return podleId.get(idBVarianty(l.id)) || null;
}

/**
 * „Doporučeno teď“ v roce: rozpracovaná lekce (i B) → nedodělaná B-varianta po červené (nejstarší) →
 * první otevřená nehotová lekce plánu. Zamčené (DB nebo kalendář) se přeskočí.
 * @param {Array<object>} plan
 * @param {Map<string, {otevreno: boolean}>} kal
 * @param {Map<string, object>} podleId
 * @returns {object|null}  lekce; u B-varianty kopie s `bPo` = id hlavní lekce
 */
export function dalsiLekceRoku(plan, kal, podleId) {
  const rozpracovana = [...podleId.values()].find((l) => l.stavLekce === 'probiha' && !l.zamceno && !druhLekce(l.id)?.test);
  if (rozpracovana) return jeBVarianta(rozpracovana) ? { ...rozpracovana, bPo: druhLekce(rozpracovana.id).hlavni } : rozpracovana;
  for (const l of plan) {
    const b = bVariantaPoCervene(l, podleId);
    if (b && !b.zamceno && b.stavLekce !== 'hotovo') return { ...b, bPo: l.id };
  }
  return plan.find((l) => !l.zamceno && kal.get(l.id)?.otevreno && l.stavLekce !== 'hotovo') || null;
}
