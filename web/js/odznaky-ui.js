// =====================================================================
// odznaky-ui.js — odznaky v rozhraní (zadání 30. 9., C; R62): řádek „Odznaky: x z 8" na přehledu,
// přehled všech odznaků (modal), okno „Nový odznak" s lehkou animací a tlačítkem „Seber odznak".
// Které odznaky už dítě/rodič na TOMTO zařízení vidělo, se pamatuje v localStorage (databáze se nemění).
// =====================================================================

import { el, otevritModal, zavritModal } from './ui.js';
import { ODZNAKY, svgOdznaku, noveOdznaky } from './odznaky.js';

const klicVidene = (diteId) => `spolu.odznaky.videno.${diteId}`;

function nactiVidene(diteId) {
  try {
    const x = JSON.parse(localStorage.getItem(klicVidene(diteId)) || 'null');
    return Array.isArray(x) ? x : null; // null = na tomto zařízení ještě nikdy
  } catch { return []; }
}

function ulozVidene(diteId, ids) {
  try { localStorage.setItem(klicVidene(diteId), JSON.stringify([...new Set(ids)])); } catch { /* bez úložiště se ukáže znovu */ }
}

/** Obrázek odznaku (span se SVG). `ziskan: false` = šedý. */
export function obrazekOdznaku(id, { ziskan = true, titulek = '' } = {}) {
  return el('span', { class: ['odznak__obrazek', !ziskan && 'odznak__obrazek--chybi'], htmlBezpecne: svgOdznaku(id, { titulek }) });
}

/** Mřížka všech 8 odznaků (získané barevně, nezískané šedé s popisem, co pro ně udělat). */
function mrizkaOdznaku(ziskane) {
  return el('div', { class: 'odznaky' }, ODZNAKY.map((o) => {
    const ma = ziskane.has(o.id);
    return el('figure', { class: ['odznak', !ma && 'odznak--chybi'] },
      obrazekOdznaku(o.id, { ziskan: ma }),
      el('figcaption', { class: 'odznak__nazev', text: o.nazev }),
      el('small', { class: 'odznak__popis', text: ma ? o.pochvala : o.popis }));
  }));
}

/** Modal se všemi odznaky. */
export async function otevritOdznaky(ziskane) {
  const d = el('dialog', { class: 'modal modal--odznaky', 'aria-labelledby': 'odznakyNadpis' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'odznakyNadpis', text: `Odznaky: ${ziskane.size} z ${ODZNAKY.length}` }),
      el('p', { class: 'text-tlumeny', text: 'Zelené za vytrvalost, zlaté za milník a za lekci celou správně.' }),
      mrizkaOdznaku(ziskane),
      el('div', { class: 'modal__akce' },
        el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => zavritModal(d) }, 'Zavřít'))));
  document.body.append(d);
  await otevritModal(d);
  d.remove();
}

/**
 * Řádek „Odznaky: x z 8" pro přehled (dítě i rodič): získané barevně, pak nejbližší nezískané šedé.
 * Klik otevře přehled všech odznaků.
 */
export function radekOdznaku(ziskane) {
  const ukazat = [...ODZNAKY.filter((o) => ziskane.has(o.id)), ...ODZNAKY.filter((o) => !ziskane.has(o.id))].slice(0, 6);
  return el('button', { class: 'karta karta--tesna odznaky-radek', type: 'button', onClick: () => otevritOdznaky(ziskane),
    'aria-label': `Odznaky: ${ziskane.size} z ${ODZNAKY.length}. Zobrazit všechny.` },
    el('span', { class: 'odznaky-radek__hlavicka' },
      el('strong', { text: `Odznaky: ${ziskane.size} z ${ODZNAKY.length}` }),
      el('span', { class: 'text-tlumeny', text: 'Zobrazit' })),
    el('span', { class: 'odznaky-radek__pas', 'aria-hidden': 'true' },
      ukazat.map((o) => obrazekOdznaku(o.id, { ziskan: ziskane.has(o.id) }))));
}

/** Jedno okno „Nový odznak" (čeká na „Seber odznak"). */
async function oknoNovehoOdznaku(id, { dalsi = false } = {}) {
  const o = ODZNAKY.find((x) => x.id === id);
  const d = el('dialog', { class: 'modal modal--novy-odznak', 'aria-labelledby': 'novyOdznakNadpis' },
    el('div', { class: 'modal__panel novy-odznak' },
      el('p', { class: 'novy-odznak__stitek', text: 'Nový odznak!' }),
      el('div', { class: 'novy-odznak__obrazek' }, obrazekOdznaku(id, { titulek: o.nazev })),
      el('h2', { class: 'novy-odznak__nazev', id: 'novyOdznakNadpis', text: o.nazev }),
      el('p', { class: 'novy-odznak__popis', text: o.pochvala }),
      el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button',
        onClick: () => { d.classList.add('je-sebrano'); setTimeout(() => zavritModal(d, 'sebrano'), sebratZpozdeni()); } },
      dalsi ? 'Seber odznak a další' : 'Seber odznak')));
  document.body.append(d);
  await otevritModal(d);
  d.remove();
}

const sebratZpozdeni = () => (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 420);

/**
 * Ukáže nově získané odznaky (jeden po druhém) a zapamatuje si je jako viděné.
 * Na zařízení, kde se odznaky ještě nikdy neukazovaly, se existující odznaky jen tiše zapamatují
 * (žádná vlna oken), pokud `prvniTiše` není false.
 * @param {string} diteId
 * @param {Set<string>} ziskane
 * @param {{prvniTise?: boolean}} [volby]  žák po dokončení lekce: false (odznak právě získal)
 * @returns {Promise<string[]>} ukázané odznaky
 */
export async function ukazNoveOdznaky(diteId, ziskane, { prvniTise = true } = {}) {
  const videne = nactiVidene(diteId);
  if (videne === null && prvniTise) { ulozVidene(diteId, [...ziskane]); return []; }
  const nove = noveOdznaky(ziskane, videne || []);
  const hotove = [...(videne || [])];
  for (let i = 0; i < nove.length; i++) {
    await oknoNovehoOdznaku(nove[i], { dalsi: i < nove.length - 1 });
    hotove.push(nove[i]);
    ulozVidene(diteId, hotove); // i při zavření stránky mezi okny se už neukáže znovu
  }
  return nove;
}
