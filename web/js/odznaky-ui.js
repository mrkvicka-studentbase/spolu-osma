// =====================================================================
// odznaky-ui.js — odznaky v rozhraní (zadání 30. 9., C; R62; R81 nový vzhled): řádek „Odznaky: x z N" na přehledu,
// okno všech odznaků (dlaždice „Získáno“ / „Zamčeno“, získaný jde otevřít jako karta) a nové odznaky jako karty
// k otočení (odznaky-karty.js). Které odznaky už dítě/rodič na TOMTO zařízení vidělo, se pamatuje v localStorage
// (databáze se nemění); klíč `spolu.odznaky.videno.<diteId>` zůstává z R62, ať se už viděné odznaky neukazují znovu.
// =====================================================================

import { el, otevritModal, zavritModal } from './ui.js';
import { ODZNAKY, htmlOdznaku, noveOdznaky } from './odznaky.js';
import { h } from './hlasky.js';
import { oknoNovychOdznaku } from './odznaky-karty.js';

/**
 * Sekce okna odznaků v pořadí zobrazení: [{nadpis, sada}]. Spolu 8: odznaky patří dítěti (oba předměty dohromady).
 * @param {object} [volby]
 */
export function sekceOdznaku(volby = {}) { // eslint-disable-line no-unused-vars
  return [{ nadpis: h('odznaky.sekce_lekce'), sada: ODZNAKY }];
}

/** Všechny odznaky k zobrazení (pořadí okna). */
const sadaOdznaku = (volby) => sekceOdznaku(volby).flatMap((s) => s.sada);

const klicVidene = (diteId) => `spolu.odznaky.videno.${diteId}`;

/** Už ukázané odznaky na tomto zařízení; null = ještě nikdy. */
export function nactiVidene(diteId) {
  try {
    const x = JSON.parse(localStorage.getItem(klicVidene(diteId)) || 'null');
    return Array.isArray(x) ? x : null; // null = na tomto zařízení ještě nikdy
  } catch { return []; }
}

function ulozVidene(diteId, ids) {
  try { localStorage.setItem(klicVidene(diteId), JSON.stringify([...new Set(ids)])); } catch { /* bez úložiště se ukáže znovu */ }
}

/**
 * Obrázek odznaku v novém stylu (htmlOdznaku). `ziskan: false` = šedý se zámkem (pod 56 px jen šedý).
 * @param {string} id
 * @param {{ziskan?: boolean, titulek?: string, velikost?: number|null}} [volby]  velikost v px (jinak podle CSS)
 */
export function obrazekOdznaku(id, { ziskan = true, titulek = '', velikost = null } = {}) {
  const t = document.createElement('template');
  t.innerHTML = htmlOdznaku(id, { zamceno: !ziskan, titulek, velikost });
  return t.content.firstElementChild || el('span');
}

/** Mřížka odznaků: dlaždice „Získáno“ (bílá, otevře kartu) a „Zamčeno“ (čárkovaná, s popisem, co pro odznak udělat). */
function mrizkaOdznaku(ziskane, sada) {
  return el('div', { class: 'odznaky' }, sada.map((o) => {
    const ma = ziskane.has(o.id);
    const obsah = [obrazekOdznaku(o.id, { ziskan: ma }),
      el('span', { class: 'odznak__text' },
        el('span', { class: 'odznak__stav', text: h(ma ? 'odznaky.ziskano' : 'odznaky.zamceno') }),
        el('span', { class: 'odznak__nazev', text: o.nazev }),
        el('small', { class: 'odznak__popis', text: ma ? o.pochvala : o.popis }))];
    // získaný odznak jde otevřít znovu jako karta (s otočením)
    return ma
      ? el('button', { class: 'odznak odznak--ziskany odznak--tlacitko', type: 'button', 'aria-label': `${o.nazev}: zobrazit kartu`, onClick: () => oknoNovychOdznaku([o.id], { prohlizeni: true }) }, ...obsah)
      : el('div', { class: 'odznak odznak--chybi' }, ...obsah);
  }));
}

/**
 * Okno se všemi odznaky.
 * @param {Set<string>} ziskane
 * @param {object} [volby]  viz sekceOdznaku
 */
export async function otevritOdznaky(ziskane, volby = {}) {
  const sekce = sekceOdznaku(volby);
  const vse = sekce.flatMap((s) => s.sada);
  const pocet = vse.filter((o) => ziskane.has(o.id)).length;
  const d = el('dialog', { class: 'modal modal--odznaky', 'aria-labelledby': 'odznakyNadpis' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'odznakyNadpis', text: `Odznaky: ${pocet} z ${vse.length}` }),
      el('p', { class: 'text-tlumeny', text: 'Zelené za vytrvalost, zlaté za milník a za lekci celou správně.' }),
      sekce.map((s) => [el('h3', { class: 'odznaky__nadpis', text: s.nadpis }), mrizkaOdznaku(ziskane, s.sada)]),
      el('div', { class: 'modal__akce' },
        el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => zavritModal(d) }, 'Zavřít'))));
  document.body.append(d);
  await otevritModal(d);
  d.remove();
}

/**
 * Řádek „Odznaky: x z N" pro přehled (dítě i rodič): získané barevně, pak nejbližší nezískané šedé.
 * Klik otevře přehled všech odznaků.
 * @param {Set<string>} ziskane
 * @param {object} [volby]  viz sekceOdznaku
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
      ukazat.map((o) => obrazekOdznaku(o.id, { ziskan: ziskane.has(o.id), velikost: 40 }))));
}

/**
 * Ukáže nově získané odznaky (všechny najednou jako karty k otočení) a zapamatuje si je jako viděné.
 * Na zařízení, kde se odznaky ještě nikdy neukazovaly, se existující odznaky jen tiše zapamatují
 * (žádná vlna oken), pokud `prvniTise` není false.
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
  // viděné hned, ať se při zavření stránky neukážou znovu
  ulozVidene(diteId, [...(videne || []), ...nove]);
  await oknoNovychOdznaku(nove);
  return nove;
}
