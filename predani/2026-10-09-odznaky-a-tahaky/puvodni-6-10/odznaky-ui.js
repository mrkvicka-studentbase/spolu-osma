// =====================================================================
// odznaky-ui.js — odznaky v rozhraní (zadání 30. 9., C; R62): řádek „Odznaky: x z 8" na přehledu,
// přehled všech odznaků (modal); nové odznaky jako karty k otočení (odznaky-karty.js, Pavel 6. 10.).
// Které odznaky už dítě/rodič na TOMTO zařízení vidělo, se pamatuje v localStorage (databáze se nemění).
// =====================================================================

import { el, otevritModal, zavritModal } from './ui.js';
import { ODZNAKY, ODZNAKY_OBA, svgOdznaku, noveOdznaky, odznakyPredmetu } from './odznaky.js';
import { oknoNovychOdznaku } from './odznaky-karty.js';

/** R69: odznaky k zobrazení — předmět (výchozí matematika) a společné, když dítě má oba předměty. */
const sadaOdznaku = ({ predmet = 'matematika', oba = false } = {}) => [...odznakyPredmetu(predmet), ...(oba ? ODZNAKY_OBA : [])];
const NAZEV_PREDMETU = { matematika: 'matematika', cestina: 'čeština' };

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

/** Mřížka odznaků (získané barevně, nezískané šedé s popisem, co pro ně udělat). */
function mrizkaOdznaku(ziskane, sada = ODZNAKY) {
  return el('div', { class: 'odznaky' }, sada.map((o) => {
    const ma = ziskane.has(o.id);
    const obsah = [obrazekOdznaku(o.id, { ziskan: ma }),
      el('span', { class: 'odznak__nazev', text: o.nazev }),
      el('small', { class: 'odznak__popis', text: ma ? o.pochvala : o.popis })];
    // Pavel 6. 10.: získaný odznak jde otevřít znovu jako karta (s otočením)
    return ma
      ? el('button', { class: 'odznak odznak--tlacitko', type: 'button', 'aria-label': `${o.nazev}: zobrazit kartu`, onClick: () => oknoNovychOdznaku([o.id], { prohlizeni: true }) }, ...obsah)
      : el('div', { class: 'odznak odznak--chybi' }, ...obsah);
  }));
}

/** Modal se všemi odznaky. */
export async function otevritOdznaky(ziskane, volby = {}) {
  const predmet = odznakyPredmetu(volby.predmet || 'matematika');
  const pocet = (sada) => sada.filter((o) => ziskane.has(o.id)).length;
  const vse = sadaOdznaku(volby);
  const d = el('dialog', { class: 'modal modal--odznaky', 'aria-labelledby': 'odznakyNadpis' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'odznakyNadpis', text: `Odznaky: ${pocet(vse)} z ${vse.length}` }),
      el('p', { class: 'text-tlumeny', text: volby.predmet === 'cestina' ? 'Modré za vytrvalost v češtině, zlaté za milník a za lekci celou správně.' : 'Zelené za vytrvalost, zlaté za milník a za lekci celou správně.' }),
      volby.oba ? el('h3', { class: 'odznaky__nadpis', text: `Předmět: ${NAZEV_PREDMETU[volby.predmet || 'matematika']}` }) : null,
      mrizkaOdznaku(ziskane, predmet),
      volby.oba ? el('h3', { class: 'odznaky__nadpis', text: 'Za oba předměty' }) : null,
      volby.oba ? mrizkaOdznaku(ziskane, ODZNAKY_OBA) : null,
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
export function radekOdznaku(ziskane, volby = {}) {
  const sada = sadaOdznaku(volby);
  const ma = sada.filter((o) => ziskane.has(o.id)).length;
  const ukazat = [...sada.filter((o) => ziskane.has(o.id)), ...sada.filter((o) => !ziskane.has(o.id))].slice(0, 6);
  return el('button', { class: 'karta karta--tesna odznaky-radek', type: 'button', onClick: () => otevritOdznaky(ziskane, volby),
    'aria-label': `Odznaky: ${ma} z ${sada.length}. Zobrazit všechny.` },
    el('span', { class: 'odznaky-radek__hlavicka' },
      el('strong', { text: `Odznaky: ${ma} z ${sada.length}` }),
      el('span', { class: 'text-tlumeny', text: 'Zobrazit' })),
    el('span', { class: 'odznaky-radek__pas', 'aria-hidden': 'true' },
      ukazat.map((o) => obrazekOdznaku(o.id, { ziskan: ziskane.has(o.id) }))));
}

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
  if (!nove.length) return [];
  // Pavel 6. 10.: všechny nové odznaky najednou jako karty (odznaky-karty.js); viděné hned, ať se při zavření stránky neukážou znovu
  ulozVidene(diteId, [...(videne || []), ...nove]);
  await oknoNovychOdznaku(nove);
  return nove;
}
