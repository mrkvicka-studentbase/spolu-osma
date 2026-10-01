// =====================================================================
// klavesnice.js — matematická klávesnice pro dotyková zařízení (kostra/01, web/DESIGN.md)
//
// - Zobrazí se jen na dotykovém zařízení (pointer: coarse) při fokusu do pole kroku.
// - Pole na dotyku dostanou inputmode="none" (nevyjede systémová klávesnice); na PC zůstává
//   decimal/numeric. Když dítě začne psát fyzickou klávesnicí, naše klávesnice se skryje
//   a polím se vrátí původní inputmode (do konce načtení stránky).
// - Klávesy nekradou fokus (pointerdown → preventDefault); znak se vloží na místo kurzoru.
// - „Hotovo" = Enter, „Zlomek" = „/" — pošlou do pole syntetický keydown, takže platí stejná
//   pravidla jako u fyzické klávesnice (lekce.js: Enter odevzdá, „/" přesune do jmenovatele).
//   Když „/" nikdo neobslouží (obyčejné číselné pole), vloží se znak „/" (vyhodnocení bere „3/4").
// =====================================================================

import { el } from './ui.js';

/** Rozložení kláves (5 sloupců) — pořadí přesně jako v komponenty.html. */
const KLAVESY = [
  ['7'], ['8'], ['9'], ['(', 'levá závorka', true], [')', 'pravá závorka', true],
  ['4'], ['5'], ['6'], ['·', 'krát', true], [':', 'děleno', true],
  ['1'], ['2'], ['3'], ['+', 'plus', true], ['−', 'minus', true],
  ['0'], [',', 'desetinná čárka'], ['x', null, true], ['²', 'na druhou', true], ['√', 'odmocnina', true],
];

let fyzickaKlavesnice = false;
const aktivni = new Set(); // připojené klávesnice (kvůli skrytí při fyzické klávesnici)

/** Je zařízení dotykové (hrubý ukazatel)? Na PC s myší false. */
export function jeDotykove() {
  try {
    return !fyzickaKlavesnice && window.matchMedia('(pointer: coarse)').matches;
  } catch {
    return false;
  }
}

function zapnoutFyzickou() {
  if (fyzickaKlavesnice) return;
  fyzickaKlavesnice = true;
  for (const k of aktivni) k.vypnout();
}

// Skutečný stisk klávesy (ne náš syntetický) = dítě má fyzickou klávesnici.
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (!e.isTrusted) return;
    if (e.key && (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter')) zapnoutFyzickou();
  }, true);
}

/** Vloží text na místo kurzoru a vyvolá událost input. */
function vloz(pole, text) {
  const zac = pole.selectionStart ?? pole.value.length;
  const kon = pole.selectionEnd ?? pole.value.length;
  pole.setRangeText(text, zac, kon, 'end');
  pole.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Smaže znak před kurzorem (nebo výběr). */
function smaz(pole) {
  let zac = pole.selectionStart ?? pole.value.length;
  const kon = pole.selectionEnd ?? pole.value.length;
  if (zac === kon) {
    if (zac === 0) return;
    zac -= 1;
  }
  pole.setRangeText('', zac, kon, 'end');
  pole.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Syntetický keydown; vrátí true, když ho nikdo nezrušil (preventDefault). */
function posliKlavesu(pole, key) {
  return pole.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

/**
 * Připojí matematickou klávesnici k polím jednoho kroku.
 * Na zařízení bez dotyku jen vrátí objekt s prázdnými metodami (nic nevykreslí).
 * @param {HTMLInputElement[]} pole  vstupní pole kroku (číslo / čitatel, jmenovatel / celá část…)
 * @param {{vlozZa: Element}} volby  za který prvek klávesnici vložit (typicky `.krok__vstup`)
 * @returns {{odpojit: () => void}}  odpojit = skrýt a odstranit (po dokončení kroku)
 */
export function pripojKlavesnici(pole, { vlozZa }) {
  const puvodniInputmode = new Map(pole.map((p) => [p, p.getAttribute('inputmode')]));
  let posledni = pole[0] || null;
  let prvek = null;

  const vratitInputmode = () => {
    for (const [p, im] of puvodniInputmode) {
      if (im) p.setAttribute('inputmode', im); else p.removeAttribute('inputmode');
    }
  };

  const ovladac = {
    vypnout() {
      vratitInputmode();
      if (prvek) prvek.hidden = true;
    },
    odpojit() {
      aktivni.delete(ovladac);
      for (const p of pole) p.removeEventListener('focus', priFokusu);
      prvek?.remove();
      prvek = null;
    },
  };

  if (!jeDotykove() || !pole.length) return ovladac;

  for (const p of pole) p.setAttribute('inputmode', 'none');

  const klavesa = ([znak, popis, operator]) => el('button', {
    class: ['klavesnice__klavesa', operator && 'klavesnice__klavesa--operator'],
    type: 'button',
    'aria-label': popis || null,
    dataset: { znak },
  }, znak === '²' ? el('span', null, 'x', el('sup', { text: '2' })) : znak);

  prvek = el('div', { class: 'klavesnice', role: 'group', 'aria-label': 'Matematická klávesnice', hidden: true },
    KLAVESY.map(klavesa),
    el('button', { class: 'klavesnice__klavesa klavesnice__klavesa--funkce klavesnice__klavesa--siroka', type: 'button', dataset: { akce: 'zlomek' } }, 'a/b Zlomek'),
    el('button', { class: 'klavesnice__klavesa klavesnice__klavesa--smazat', type: 'button', dataset: { akce: 'smazat' } }, 'Smazat'),
    el('button', { class: 'klavesnice__klavesa klavesnice__klavesa--hotovo klavesnice__klavesa--siroka', type: 'button', dataset: { akce: 'hotovo' } }, 'Hotovo'));

  // Klávesa nesmí vzít fokus z pole (jinak by zmizel kurzor).
  prvek.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
  prvek.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
  prvek.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    const cil = document.activeElement && pole.includes(document.activeElement) ? document.activeElement : posledni;
    if (!b || !cil || cil.disabled) return;
    cil.focus({ preventScroll: true });
    const { znak, akce } = b.dataset;
    if (znak) vloz(cil, znak);
    else if (akce === 'smazat') smaz(cil);
    else if (akce === 'zlomek') { if (posliKlavesu(cil, '/')) vloz(cil, '/'); }
    else if (akce === 'hotovo') posliKlavesu(cil, 'Enter');
  });

  function priFokusu(e) {
    posledni = e.currentTarget;
    if (prvek && !fyzickaKlavesnice) prvek.hidden = false;
  }
  for (const p of pole) p.addEventListener('focus', priFokusu);

  vlozZa.after(prvek);
  if (pole.includes(document.activeElement)) prvek.hidden = false;
  aktivni.add(ovladac);
  return ovladac;
}
