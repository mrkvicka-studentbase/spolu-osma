// =====================================================================
// vstupy-f2.js — Fáze 2 (R38, R39, osnova Fáze 2 §4): štítky písmen u dlaždic (A)–E), A/N, A)–F)),
// vstup `rysovani` u žáka (text + „Hotovo") a u rodiče (obrázek řešení + kontrolní otázky + Sedí / Nesedí),
// sdílená komponenta Sedí / Nesedí (převzatá z papírového režimu `poradi`, rodic-karta.js).
//
// Používá: lekce.js (žák), rodic-karta.js (tahák, „Co vidí dítě", papír), rodic-simulace.js (Kontrola), tisk.js.
// Vše vyžaduje `await nacistKnihovny()` (obsah.js).
// =====================================================================

import { el, ikona } from './ui.js';
import { h } from './hlasky.js';
import { renderMarkdown } from './obsah.js';
import { pismenaKroku } from './simulace.js';
import { vytvorObrazek } from './vstupy-f1.js';

// ---------------------------------------------------------------------
// Písmena dlaždic: pevné pořadí podle `moznosti`, štítek doplní aplikace
// ---------------------------------------------------------------------

/**
 * Text štítku písmene: „A)" (A–E, A–F), u ANO/NE jen „A" / „N" (R39: „A —" / „N —" jako předpona textu).
 * @param {object} krok
 * @param {number} index  pořadí možnosti
 * @returns {string|null}
 */
export function textPismene(krok, index) {
  const p = pismenaKroku(krok)?.[index];
  if (!p) return null;
  return krok.vstup.pismena === 'AN' ? p : `${p})`;
}

/**
 * Štítek písmene před textem dlaždice (žák, rodič, náhled). null = dlaždice bez písmen.
 * @param {object} krok
 * @param {number} index
 * @returns {HTMLElement|null}
 */
export function stitekPismene(krok, index) {
  const t = textPismene(krok, index);
  return t ? el('span', { class: 'dlazdice__pismeno', text: t }) : null;
}

// ---------------------------------------------------------------------
// Sedí / Nesedí (a obecně volba ze 2–3 tlačítek) — z papírového režimu `poradi`
// ---------------------------------------------------------------------

/**
 * Řada tlačítek s jednou volbou (aria-pressed). Výchozí Sedí / Nesedí.
 * @param {{volby?: Array<{hodnota: string, text: string, ikona?: string}>, vybrano?: string|null,
 *   onVolba?: (hodnota: string, tlacitko: HTMLButtonElement) => (void|Promise<void>), trida?: string, popisek?: string|null}} [v]
 * @returns {{uzel: HTMLElement, tlacitka: HTMLButtonElement[], nastav: (hodnota: string|null) => void}}
 */
export function vytvorSediNesedi({
  volby = [{ hodnota: 'sedi', text: h('f2.sedi'), ikona: 'fajfka' }, { hodnota: 'nesedi', text: h('f2.nesedi'), ikona: 'opakovat' }],
  vybrano = null, onVolba = null, trida = '', popisek = null,
} = {}) {
  const tlacitka = volby.map((v) => el('button', {
    class: 'tlacitko tlacitko--sekundarni', type: 'button', 'aria-pressed': String(vybrano === v.hodnota), dataset: { hodnota: v.hodnota },
  }, v.ikona ? ikona(v.ikona) : null, v.text));
  const nastav = (hodnota) => { for (const t of tlacitka) t.setAttribute('aria-pressed', String(t.dataset.hodnota === hodnota)); };
  let probiha = false;
  for (const t of tlacitka) {
    t.addEventListener('click', async () => {
      if (probiha) return;
      probiha = true;
      nastav(t.dataset.hodnota);
      for (const x of tlacitka) x.disabled = true;
      try { await onVolba?.(t.dataset.hodnota, t); } finally {
        for (const x of tlacitka) x.disabled = false;
        probiha = false;
      }
    });
  }
  const uzel = el('div', { class: ['radek', 'sedi-nesedi', trida], role: 'group', 'aria-label': popisek }, tlacitka);
  return { uzel, tlacitka, nastav };
}

// ---------------------------------------------------------------------
// rysovani — žák
// ---------------------------------------------------------------------

/**
 * Vstup `rysovani` pro žáka: jen pokyn „Rýsuj na papír…"; odevzdání je tlačítko „Hotovo" (lekce.js).
 * Rozhraní jako ostatní vstupy lekce.js.
 * @param {{idPopisku?: string|null}} [volby]
 */
export function vytvorVstupRysovani({ idPopisku = null } = {}) {
  const uzel = el('div', { class: 'krok__vstup rysovani', role: 'note', 'aria-labelledby': idPopisku },
    el('span', { class: 'ikona-kruh' }, ikona('tuzka')),
    el('p', { class: 'rysovani__text', text: h('f2.rysovani_zak') }));
  return {
    uzel,
    pole: [],
    hodnota: () => ({ vyhodnoceni: 'hotovo', ulozeni: 'hotovo' }),
    oznac() {},
    zamknout() { uzel.classList.add('je-zamceno'); },
    fokus() {},
  };
}

// ---------------------------------------------------------------------
// rysovani — rodič: obrázek řešení + kontrola_rodice + Sedí / Nesedí
// ---------------------------------------------------------------------

/**
 * Blok pro rodiče ke kroku `rysovani` (lekce, blok i Kontrola simulace). Rodič nerýsuje ani nepočítá:
 * porovná papír dítěte s `tahak.reseni_obrazek` podle `tahak.kontrola_rodice` a klepne Sedí / Nesedí.
 * @param {object} uloha
 * @param {{vybrano?: 'sedi'|'nesedi'|null, ceka?: boolean, onVolba: (hodnota: 'sedi'|'nesedi') => Promise<void>|void,
 *   nadpis?: boolean}} v
 *   ceka = dítě v aplikaci ještě neklepnulo Hotovo (jen informace, volbu to neblokuje)
 * @returns {HTMLElement}
 */
export function vytvorRysovaniRodic(uloha, { vybrano = null, ceka = false, onVolba, nadpis = true }) {
  const t = uloha.tahak || {};
  const obrazek = t.reseni_obrazek
    ? vytvorObrazek({ obrazek: t.reseni_obrazek, obrazek_popis: t.reseni_obrazek_popis || uloha.obrazek_popis }, { popisek: true })
    : null;
  const otazky = Array.isArray(t.kontrola_rodice) && t.kontrola_rodice.length
    ? [el('p', { class: 'rysovani-rodic__otazky-nadpis', text: h('f2.rysovani_otazky') }),
      el('ol', { class: 'rysovani-rodic__otazky' }, t.kontrola_rodice.map((q) => el('li', null, renderMarkdown(q, { inline: true }))))]
    : [];
  const volba = vytvorSediNesedi({ vybrano, onVolba, popisek: h('f2.rysovani_nadpis') });
  return el('section', { class: 'tahak__sekce rysovani-rodic' },
    nadpis ? el('h2', { class: 'tahak__nadpis' }, ikona('tuzka'), h('f2.rysovani_nadpis')) : null,
    ceka ? el('p', { class: 'text-tlumeny', text: h('f2.rysovani_ceka') }) : null,
    el('p', { class: 'text-tlumeny', text: h('f2.rysovani_text') }),
    obrazek, ...otazky, volba.uzel);
}
