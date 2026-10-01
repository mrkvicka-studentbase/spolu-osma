// =====================================================================
// pripravit.js — H2 (R29): obrazovka „Připrav si" u žáka před 1. úlohou (před odpočtem).
// Položky = lekce.pomucky (výchozí sešit, propiska, tužka — pomuckyLekce() v obsah.js).
// Stav jen v localStorage `spolu.pripraveno.<lekce>` = datum RRRR-MM-DD: týž den se neukazuje znovu
// (ani při obnovení rozpracované lekce). Do DB nic. Rodič tuto obrazovku nevidí.
// =====================================================================

import { el, ikona } from './ui.js';
import { h } from './hlasky.js';
import { pomuckyLekce } from './obsah.js';

const PREFIX_PRIPRAVENO = 'spolu.pripraveno.';

function dnesniDatum() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function pripravenoDnes(lekceId) {
  try { return localStorage.getItem(`${PREFIX_PRIPRAVENO}${lekceId}`) === dnesniDatum(); } catch { return false; }
}

function ulozPripraveno(lekceId) {
  try { localStorage.setItem(`${PREFIX_PRIPRAVENO}${lekceId}`, dnesniDatum()); } catch { /* bez úložiště se ukáže znovu */ }
}

/**
 * Obrazovka „Připrav si": odškrtávací pomůcky (lekce.pomucky, výchozí sešit/propiska/tužka);
 * „Mám připraveno, jdu na to" se odemkne po odškrtnutí všeho, pak se spustí odpočet a 1. úloha.
 * @param {HTMLElement} plocha  kam vykreslit (lekce.html #plocha)
 * @param {{id: string, cas_min?: number, pomucky?: string[]}} lekce
 * @param {() => void} poPotvrzeni  spustí odpočet a 1. úlohu
 */
export function vykresliPripravit(plocha, lekce, poPotvrzeni) {
  const odpocetCas = document.getElementById('odpocetCas');
  if (odpocetCas) odpocetCas.textContent = `${Number(lekce.cas_min) || 20}:00`; // odpočet ještě neběží
  const polozky = pomuckyLekce(lekce).map((nazev) => el('input', { type: 'checkbox', value: nazev }));
  const tlacitko = el('button', {
    class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button', disabled: true,
    onClick: () => { ulozPripraveno(lekce.id); poPotvrzeni(); },
  }, h('zak.pripravit_tlacitko'), ikona('sipka-vpravo'));
  const zbyva = el('p', { class: 'pripravit__zbyva', id: 'pripravitZbyva', text: h('zak.pripravit_zbyva') });
  tlacitko.setAttribute('aria-describedby', 'pripravitZbyva');
  const obnov = () => {
    const vse = polozky.every((p) => p.checked);
    tlacitko.disabled = !vse;
    zbyva.hidden = vse;
  };
  polozky.forEach((p) => p.addEventListener('change', obnov));
  plocha.replaceChildren(el('section', { class: 'karta pripravit', 'aria-labelledby': 'pripravitNadpis' },
    el('div', { class: 'pripravit__hlavicka' },
      el('span', { class: 'ikona-kruh' }, ikona('tuzka')),
      el('h2', { id: 'pripravitNadpis', text: h('zak.pripravit_nadpis') })),
    el('p', { text: h('zak.pripravit_text') }),
    el('ul', { class: 'pripravit__seznam' }, polozky.map((vstup) => el('li', null,
      el('label', { class: 'pripravit__polozka' }, vstup, el('span', { text: vstup.value }))))),
    tlacitko, zbyva));
  window.scrollTo({ top: 0 });
}
