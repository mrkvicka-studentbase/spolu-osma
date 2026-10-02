// =====================================================================
// tisk-f2.js — tisk Fáze 2 (osnova Fáze 2 §3.3, §4; SABLONA §20): záznamový arch generovaný z kroků
// (autor ho nekreslí), testový sešit simulace (obě části, zadání 1–16), strana se vzorci a tabulkou mocnin,
// rámečky ve stylu archu u běžných lekcí Fáze 2, rýsovací pole v měřítku 1 : 1 (`obrazek_mm`).
// Klíč ani tahák se netisknou. Používá tisk.js; vše vyžaduje `await nacistKnihovny()`.
// =====================================================================

import { el } from './ui.js';
import { h } from './hlasky.js';
import { renderMarkdown, renderTex } from './obsah.js';
import { pismenaKroku } from './simulace.js';
import { textPismene } from './vstupy-f2.js';
import { vytvorObrazek } from './vstupy-f1.js';

const LINEK_POSTUPU = 7;
const maRysovani = (uloha) => (uloha.kroky || []).some((k) => k.vstup?.typ === 'rysovani');
/** Lekce má krok `rysovani` (tisk: pokyn „tiskněte ve skutečné velikosti (100 %)"). */
export const lekceMaRysovani = (lekce) => (lekce?.ulohy || []).some(maRysovani);

/**
 * Kontrolní úsečka 5 cm (R46): rodič po tisku přiloží pravítko — nesedí-li, tiskl s „Přizpůsobit stránce".
 * @param {string} klicTextu  hláška pod úsečkou
 */
export function kontrolniUsecka(klicTextu = 'f2.tisk_kontrola') {
  return el('span', { class: 'arch-meritko' },
    el('span', { class: 'arch-meritko__cara', 'aria-hidden': 'true' }), el('small', { text: h(klicTextu) }));
}

/**
 * Obrázek úlohy pro tisk. `obrazek_mm` = skutečná šířka v mm (výjimka z limitu 60 mm); u konstrukce
 * v zadání (sešit, lekce) náhled nejvýš 60 mm, v rýsovacím poli vždy 1 : 1.
 * @param {object} uloha
 * @param {{meritko11?: boolean}} [volby]
 * @returns {HTMLElement|null}
 */
export function obrazekTisk(uloha, { meritko11 = false } = {}) {
  const o = vytvorObrazek(uloha, { tisk: true });
  if (!o) return null;
  const svg = o.querySelector('svg');
  const mm = Number(uloha.obrazek_mm);
  if (svg && mm > 0 && (meritko11 || !maRysovani(uloha))) {
    svg.style.width = `${mm}mm`;
    svg.style.maxWidth = 'none';
    o.classList.add('obrazek-ulohy--mm');
  }
  return o;
}

/** Označení rámečku v archu: krátký popisek celý („2.1", „4.2 $x$"), dlouhý jen číslo podúlohy, jinak „Krok n". */
function oznaceni(krok, index) {
  const p = String(krok.popisek || '').trim();
  if (p && p.length <= 12) return renderMarkdown(p, { inline: true });
  const cislo = /^\d+(\.\d+)?/.exec(p);
  return cislo ? cislo[0] : `Krok ${index + 1}`;
}

/** Křížková pole A–E / A–N / A–F (pevné pořadí, písmena doplní aplikace). */
function krizky(krok) {
  return el('span', { class: 'arch-krizky' }, (pismenaKroku(krok) || []).map((p) => el('span', { class: 'arch-krizek' },
    el('span', { class: 'arch-krizek__pismeno', text: p }), el('span', { class: 'arch-krizek__pole' }))));
}

/**
 * Rámeček jednoho kroku ve stylu záznamového archu (osnova §3.3):
 * výsledek = bílý rámeček s označením a jednotkou za ním; `postup` = rámeček přes celou šířku s linkami
 * a nadpisem „Celý postup"; `pismena` = křížková pole; `rysovani` = rýsovací pole se zadáním 1 : 1
 * (v běžné lekci a bloku s kontrolní úsečkou 5 cm a pokynem o tisku 100 %; arch simulace má úsečku v hlavičce).
 * @param {object} uloha
 * @param {object} krok
 * @param {number} index
 * @param {{kontrola?: boolean}} [volby]  kontrola = kontrolní úsečka 5 cm v rýsovacím poli
 * @returns {HTMLElement}
 */
export function archKrok(uloha, krok, index, { kontrola = true } = {}) {
  const typ = krok.vstup?.typ;
  const stitek = el('span', { class: 'arch-oznaceni' }, oznaceni(krok, index));
  if (typ === 'rysovani') {
    // víc rýsovacích kroků jedné úlohy (9.1 osa, 9.2 obdélník, R50) = jedno společné pole; další krok jen odkáže
    const prvniRysovani = (uloha.kroky || []).findIndex((k) => k.vstup?.typ === 'rysovani');
    if (prvniRysovani >= 0 && prvniRysovani < index) {
      return el('p', { class: 'arch-radek arch-rysovani__dalsi' }, stitek, el('span', { text: h('f2.tisk_rysovani_stejne_pole') }));
    }
    const obrazek = obrazekTisk(uloha, { meritko11: true });
    return el('div', { class: 'arch-rysovani' },
      el('div', { class: 'arch-rysovani__hlavicka' },
        el('span', { class: 'arch-rysovani__popisek', text: h('f2.tisk_rysovani') }),
        kontrola ? kontrolniUsecka() : null),
      obrazek || el('div', { class: 'arch-rysovani__prazdne' }),
      kontrola ? el('p', { class: 'arch-rysovani__pokyn', text: h('f2.tisk_100') }) : null);
  }
  if (pismenaKroku(krok)) return el('div', { class: 'arch-radek arch-radek--krizky' }, stitek, krizky(krok));
  const ramecek = el('span', { class: 'arch-ramecek' });
  const jednotka = krok.vstup?.jednotka ? el('span', { class: 'arch-jednotka', text: krok.vstup.jednotka }) : null;
  if (krok.postup) {
    return el('div', { class: 'arch-postup' },
      el('div', { class: 'arch-postup__hlavicka' }, stitek, el('span', { class: 'arch-postup__nadpis', text: h('f2.tisk_postup') })),
      el('div', { class: 'arch-postup__linky' }, Array.from({ length: LINEK_POSTUPU }, () => el('span', { class: 'arch-linka' }))),
      el('div', { class: 'arch-radek arch-radek--vysledek' }, el('span', { class: 'arch-oznaceni arch-oznaceni--male', text: h('f2.tisk_vysledek') }), ramecek, jednotka));
  }
  return el('div', { class: 'arch-radek' }, stitek, ramecek, jednotka);
}

/** Všechny kroky úlohy jako rámečky archu (u běžných lekcí Fáze 2 pod místem na výpočet). */
export function archKroky(uloha, volby = {}) {
  return el('div', { class: 'arch-kroky' }, (uloha.kroky || []).map((k, i) => archKrok(uloha, k, i, volby)));
}

// ---------------------------------------------------------------------
// Simulace: testový sešit, strana se vzorci, záznamový arch
// ---------------------------------------------------------------------

const hlavicka = (nadpis, podnadpis, jmeno) => el('header', { class: 'tisk-zahlavi' },
  el('div', { class: 'tisk-zahlavi__lekce' }, nadpis, el('small', { text: podnadpis })),
  el('div', { class: 'tisk-zahlavi__jmeno' },
    'Jméno: ', jmeno ? el('strong', { text: jmeno }) : el('span', { class: 'tisk-linka' }),
    el('br'), 'Datum: ', el('span', { class: 'tisk-linka' })));

/** Nabídka A)–E) / A)–F) v sešitu (u přiřazování jednou pro všechny položky; ANO/NE nabídku nemá). */
function nabidka(uloha) {
  const krok = (uloha.kroky || []).find((k) => ['A-E', 'A-F'].includes(k.vstup?.pismena));
  if (!krok) return null;
  return el('ul', { class: 'tisk-nabidka' }, (krok.vstup.moznosti || []).map((m, i) => el('li', null,
    el('strong', { text: `${textPismene(krok, i)} ` }), renderMarkdown(m.text, { inline: true }))));
}

/**
 * Testový sešit simulace (obě části): zadání 1–16 jako u CERMAT, bez bodů a bez klíče.
 * @param {object[]} casti  lekce části 1 a 2
 * @param {{zadani: (text: string) => HTMLElement, jmeno?: string|null}} v  zadani = sazba tisk.zadani z tisk.js
 */
export function sesitSimulace(casti, { zadani, jmeno = null }) {
  const cislo = casti[0]?.simulace?.cislo ?? '';
  const ulohy = casti.flatMap((l) => l.ulohy);
  return el('article', { class: 'tisk-list tisk-list--sesit' },
    hlavicka(`Spolu 8 — Simulace ${cislo}`, `${h('sim.tisk_sesit')} · 70 minut`, jmeno),
    el('p', { class: 'tisk-pokyn', text: h('sim.tisk_prepiste') }),
    ulohy.map((u) => el('section', { class: 'tisk-uloha tisk-uloha--sesit' },
      el('div', { class: 'tisk-uloha__hlavicka' }, el('span', { class: 'tisk-uloha__cislo', text: String(u.pozice ?? '') })),
      zadani(u.tisk?.zadani ?? u.zadani ?? ''),
      obrazekTisk(u),
      nabidka(u),
      u.pozice && u.pozice <= 8 && !maRysovani(u) ? el('div', { class: 'tisk-misto', 'aria-hidden': 'true' }) : null)),
    el('footer', { class: 'tisk-paticka' }, el('span', { text: 'studentbase.cz' }), el('span', { text: h('sim.tisk_sesit') })));
}

/** Poslední strana sešitu: tabulka druhých mocnin 11–20, π, kruh, vzorce rozkladu (osnova §1.2). */
export function stranaVzorcu() {
  const mocniny = Array.from({ length: 10 }, (_, i) => i + 11);
  const vzorce = [
    '\\pi \\doteq 3{,}14',
    'o = 2\\pi r = \\pi d',
    'S = \\pi r^2',
    '(a + b)^2 = a^2 + 2ab + b^2',
    '(a - b)^2 = a^2 - 2ab + b^2',
    'a^2 - b^2 = (a + b)(a - b)',
  ];
  return el('article', { class: 'tisk-list tisk-list--vzorce' },
    el('h2', { class: 'tisk-nadpis', text: h('sim.tisk_vzorce') }),
    el('table', { class: 'tisk-mocniny' },
      el('caption', { text: h('sim.tisk_mocniny') }),
      el('tbody', null,
        el('tr', null, el('th', { scope: 'row' }, renderTex('n')), mocniny.map((n) => el('td', { text: String(n) }))),
        el('tr', null, el('th', { scope: 'row' }, renderTex('n^2')), mocniny.map((n) => el('td', { text: String(n * n) }))))),
    el('ul', { class: 'tisk-vzorce' }, vzorce.map((v) => el('li', null, renderTex(v)))));
}

/**
 * Záznamový arch simulace (osnova §3.3): hlavička (jméno, simulace, datum, začátek/konec), kontrolní úsečka 5 cm,
 * každá úloha = číslo v kroužku + rámečky kroků, dole pokyn o křížcích. Generuje se z kroků.
 * @param {object[]} casti
 * @param {{jmeno?: string|null}} [v]
 */
export function archSimulace(casti, { jmeno = null } = {}) {
  const cislo = casti[0]?.simulace?.cislo ?? '';
  const ulohy = casti.flatMap((l) => l.ulohy);
  const cas = (klic) => el('span', { class: 'arch-cas' }, `${h(klic)} `, el('span', { class: 'arch-cas__pole' }), ' : ', el('span', { class: 'arch-cas__pole' }));
  return el('article', { class: 'tisk-list tisk-list--arch' },
    hlavicka(`${h('sim.tisk_arch')} — Simulace ${cislo}`, 'Spolu 8', jmeno),
    el('div', { class: 'arch-hlavicka' }, cas('sim.tisk_zacatek'), cas('sim.tisk_konec'),
      kontrolniUsecka('sim.tisk_meritko')),
    ulohy.map((u) => el('section', { class: ['arch-uloha', maRysovani(u) && 'arch-uloha--rysovani'] },
      el('span', { class: 'arch-uloha__cislo', text: String(u.pozice ?? '') }),
      archKroky(u, { kontrola: false }))), // úsečka 5 cm je v hlavičce archu
    el('p', { class: 'arch-pokyn', text: h('sim.tisk_krizky') }));
}
