// =====================================================================
// diagnostika-zak.js — vstupní diagnostika (týden 0) u žáka a společné hledání sezení (R37,
// obsah/diagnostika-obrazovka.md §1–2). Samotné úlohy vykresluje lekce.js (stejné vstupy jako lekce),
// tady jsou jen obrazovky navíc: přestávka po 12. úloze a konec. Žák výsledek nikdy nevidí.
// =====================================================================

import { el, ikona } from './ui.js';
import { h } from './hlasky.js';

/** Po které úloze je přestávka (2 bloky po 12). */
export const PRESTAVKA_PO = 12;

/**
 * Sezení diagnostiky dítěte: probíhající (NEJSTARŠÍ, bez limitu 24 h — diagnostiku jde dokončit jindy)
 * a poslední dokončené. Diagnostika je jednorázová: když existuje dokončené, nové se nezakládá.
 * @param {string} diteId
 * @param {string} lekceId
 * @returns {Promise<{probiha: object|null, dokonceno: object|null}>}
 */
export async function najdiSezeniDiagnostiky(diteId, lekceId) {
  const { supabase } = await import('./supabase.js');
  const { data, error } = await supabase.from('sezeni').select('*')
    .eq('dite_id', diteId).eq('lekce_id', lekceId).in('stav', ['probiha', 'dokonceno'])
    .order('zacatek', { ascending: true });
  if (error) throw new Error(h('chyba.nacteni'));
  const radky = data || [];
  return {
    probiha: radky.find((s) => s.stav === 'probiha') || null,
    dokonceno: radky.filter((s) => s.stav === 'dokonceno').at(-1) || null,
  };
}

/**
 * Přestávka po 12. úloze: „Pokračovat" / „Dokončím jindy" (na přehled, sezení zůstává rozpracované).
 * @param {HTMLElement} plocha
 * @param {() => void} pokracovat
 */
export function vykresliPrestavku(plocha, pokracovat) {
  const tlacitko = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button', onClick: pokracovat },
    h('diag.prestavka_pokracovat'), ikona('sipka-vpravo'));
  plocha.replaceChildren(el('section', { class: 'karta konec-lekce diag-prestavka', 'aria-labelledby': 'diagPrestavka' },
    el('span', { class: 'ikona-kruh' }, ikona('hodiny')),
    el('h2', { id: 'diagPrestavka', text: h('diag.prestavka_nadpis') }),
    el('p', { class: 'text-tlumeny', text: h('diag.prestavka_text') }),
    el('div', { class: 'radek radek--stred' }, tlacitko,
      el('a', { class: 'tlacitko tlacitko--tiche', href: 'prehled.html' }, h('diag.prestavka_jindy')))));
  window.scrollTo({ top: 0 });
  tlacitko.focus({ preventScroll: true });
}

/**
 * Konec diagnostiky u žáka: bez počtu správných. Sezení neuzavírá (to udělá rodič „Zobrazit výsledek");
 * jen si zapamatuje, že žák skončil (`spolu.diag.konec.<sezeni>`).
 * @param {HTMLElement} plocha
 * @param {string|null} sezeniId
 */
export function vykresliKonecDiagnostiky(plocha, sezeniId) {
  try { if (sezeniId) localStorage.setItem(`spolu.diag.konec.${sezeniId}`, new Date().toISOString()); } catch { /* nevadí */ }
  plocha.removeAttribute('aria-busy');
  plocha.replaceChildren(el('div', { class: 'karta konec-lekce' },
    el('span', { class: 'ikona-kruh ikona-kruh--zelena' }, ikona('fajfka')),
    el('h2', { text: h('diag.konec_nadpis') }),
    el('p', { class: 'text-tlumeny', text: h('diag.konec_text') }),
    el('a', { class: 'tlacitko tlacitko--tiche', href: 'prehled.html' }, ikona('sipka-vlevo'), 'Zpět na přehled')));
  window.scrollTo({ top: 0 });
}
