// =====================================================================
// predmet.js — dva předměty ve stejném webu: Matematika a Čeština (ZADANI-CESTINA §8.2, R65)
//
// - Předmět lekce: `l.predmet ?? 'matematika'` (před migrací 0007 katalog `predmet` nevrací → vše je matematika).
//   Kde lekci nemáme (historie sezení bez sloupce predmet), rozhodne id: čeština má vždy prefix `cj-`
//   (kontrola lekce_predmet_faze_check v supabase/migrations/0007_predmet.sql).
// - Předměty dítěte: `dite.predmety ?? ['matematika']` (sloupec deti.predmety přinese migrace 0007).
// - Volba předmětu v přehledu: zdroj pravdy je URL `?predmet=`, localStorage `spolu.predmet` je jen pohodlí
//   (návrat na prehled.html bez parametru). Storage vždy v try/catch.
// Čisté funkce bez DOM, importovatelné i v Node (testy/predmet.test.js).
// =====================================================================

/** Předměty v pořadí záložek. */
export const PREDMETY = Object.freeze(['matematika', 'cestina']);

/** Názvy předmětů pro záložky a formulář. */
export const NAZVY_PREDMETU = Object.freeze({ matematika: 'Matematika', cestina: 'Čeština' });

const KLIC_PREDMET = 'spolu.predmet';

const jePredmet = (p) => PREDMETY.includes(p);

/**
 * Předmět podle id lekce (čeština = `cj-…`). Pro řádky, kde katalog/lekce není k dispozici.
 * @param {string|null|undefined} id
 * @returns {'matematika'|'cestina'}
 */
export function predmetZId(id) {
  return /^cj-/.test(String(id || '')) ? 'cestina' : 'matematika';
}

/**
 * Předmět lekce (položka katalogu nebo celá lekce). Bez pole `predmet` = matematika.
 * @param {{predmet?: string|null}|null|undefined} l
 * @returns {'matematika'|'cestina'}
 */
export function predmetLekce(l) {
  return jePredmet(l?.predmet) ? l.predmet : 'matematika';
}

/**
 * Aktivní předměty dítěte v pořadí záložek. Bez sloupce `predmety` (před migrací) nebo s prázdným polem = jen matematika.
 * @param {{predmety?: string[]|null}|null|undefined} dite
 * @returns {Array<'matematika'|'cestina'>}
 */
export function predmetyDitete(dite) {
  const p = Array.isArray(dite?.predmety) ? PREDMETY.filter((x) => dite.predmety.includes(x)) : [];
  return p.length ? p : ['matematika'];
}

/**
 * Má řádek dítěte z DB sloupec `predmety`? (= migrace 0007 proběhla; jinak se volba předmětů neukazuje ani neukládá)
 * @param {object|null|undefined} dite
 * @returns {boolean}
 */
export function maSloupecPredmety(dite) {
  return Boolean(dite) && Array.isArray(dite.predmety);
}

/**
 * Který předmět přehled ukáže: URL (když ho dítě má) → uložená volba (když ho dítě má) → první aktivní.
 * @param {{url?: string|null, ulozeny?: string|null, aktivni: string[]}} volby
 * @returns {'matematika'|'cestina'}
 */
export function zvolPredmet({ url = null, ulozeny = null, aktivni }) {
  const moznosti = aktivni?.length ? aktivni : ['matematika'];
  if (moznosti.includes(url)) return url;
  if (moznosti.includes(ulozeny)) return ulozeny;
  return moznosti[0];
}

/** Uložená volba předmětu (localStorage), nebo null. @returns {string|null} */
export function ulozenyPredmet() {
  try {
    const p = globalThis.localStorage?.getItem(KLIC_PREDMET) ?? null;
    return jePredmet(p) ? p : null;
  } catch { return null; }
}

/** Zapamatuje volbu předmětu (jen pohodlí; když storage nejde, nevadí). @param {string} p */
export function ulozPredmet(p) {
  try { if (jePredmet(p)) globalThis.localStorage?.setItem(KLIC_PREDMET, p); } catch { /* nevadí */ }
}
