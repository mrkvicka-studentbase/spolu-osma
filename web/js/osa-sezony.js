// =====================================================================
// osa-sezony.js — časová osa sezóny v hlavičce (R63, Pavel 30. 9.): 1. 10. → přijímačky 12. 4. 2027,
// tečka = dnešek. Bez odpočtu. Nepotřebuje data (jen dnešní datum), vkládá ji menu.js na všech stránkách s menu.
// =====================================================================

import { el } from './ui.js';

/** Začátek sezóny (spuštění pilotu) a 1. den přijímaček (Pavel 30. 9.). */
export const ZACATEK_SEZONY = new Date(2026, 9, 1);
export const PRIJIMACKY = new Date(2027, 3, 12);

const CIL_VLAJKA = '<svg viewBox="0 0 12 14" width="12" height="14"><path d="M1.5 14V1" stroke="#F5C518" stroke-width="2"/><path d="M2 1h9l-2.5 3L11 7H2z" fill="#F5C518"/></svg>';

/** Podíl 0–1 polohy `x` mezi `od` a `doKdy`. */
export const podilOsy = (od, doKdy, x) => Math.min(1, Math.max(0, (x - od) / (doKdy - od)));

/**
 * Osa sezóny do hlavičky: popisek „1. 10. … přijímačky 12. 4.", pruh s ryskami měsíců, tečka dneška, vlaječka.
 * @param {number} [ted=Date.now()]
 * @returns {HTMLElement}
 */
export function vytvorOsuSezony(ted = Date.now()) {
  const tiky = [];
  for (let m = new Date(ZACATEK_SEZONY.getFullYear(), ZACATEK_SEZONY.getMonth() + 1, 1); m < PRIJIMACKY; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) {
    tiky.push(el('span', { class: 'postup-osa__tik', style: `left:${(podilOsy(ZACATEK_SEZONY, PRIJIMACKY, m) * 100).toFixed(1)}%` }));
  }
  const dnes = (podilOsy(ZACATEK_SEZONY, PRIJIMACKY, ted) * 100).toFixed(1);
  return el('div', { class: 'osa-sezony', role: 'img', 'aria-label': 'Sezóna od 1. října do přijímaček 12. dubna, tečka ukazuje dnešek' },
    el('div', { class: 'osa-sezony__popis' }, el('span', { text: '1. 10.' }), el('span', { text: 'přijímačky 12. 4.' })),
    el('div', { class: 'postup-osa' },
      el('span', { class: 'postup-osa__pruh' }), el('span', { class: 'postup-osa__ubehlo', style: `width:${dnes}%` }), ...tiky,
      el('span', { class: 'postup-osa__dnes', style: `left:${dnes}%` }),
      el('span', { class: 'postup-osa__cil', htmlBezpecne: CIL_VLAJKA })));
}
