// =====================================================================
// tahaky-ui.js — taháky a měsíční výzva v rozhraní (R78, reporty/2026-10-08-spec-tahaky-vyzvy.md).
// - řádek „Taháky: x z N“ na přehledu (odkaz na tahaky.html), karta měsíční výzvy s ukazatelem;
// - mřížka kartiček na stránce „Moje taháky“, tahák v modalu (bloky přes Markdown + KaTeX), tisková verze;
// - nově odemčené taháky jako karty k otočení (odznaky-karty.js, oknoKaret).
// Které taháky už dítě na TOMTO zařízení vidělo, se pamatuje v localStorage `spolu.tahaky.videno.<diteId>`
// (jako odznaky; první zobrazení na zařízení tiše). Výpočty jsou v tahaky.js, databáze se nemění.
// =====================================================================

import { el, ikona, otevritModal, zavritModal } from './ui.js';
import { h } from './hlasky.js';
import { nacistKnihovny, renderMarkdown } from './obsah.js';
import {
  DATA, vsechnyTahaky, tydenniTahaky, najdiTahak, jeBonus, noveTahaky, odemceneTahaky, obdobiVyzvy, pocetVMesici, konecVyzvy, sezonaZamcena,
} from './tahaky.js';
import { oknoKaret } from './odznaky-karty.js';

// ---------------------------------------------------------------------
// Čas: v produkci vždy teď; na lokálním vývojovém serveru jde podstrčit ?datum=2026-11-20 (snímky výzvy)
// ---------------------------------------------------------------------

/** Aktuální čas (ms). `?datum=…` platí jen na localhost / 127.0.0.1 (jinde se ignoruje). */
export function tedNyni() {
  try {
    const p = new URLSearchParams(location.search).get('datum');
    if (p && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
      const t = Date.parse(p);
      if (Number.isFinite(t)) return t;
    }
  } catch { /* mimo prohlížeč */ }
  return Date.now();
}

// ---------------------------------------------------------------------
// Vzhled taháku: barva podle předmětu, obrázek (SVG řetězec)
// ---------------------------------------------------------------------

/** zelena = matematika, modra = čeština, zlata = bonus (spec §1). */
export const barvaTahaku = (t) => (jeBonus(t) ? 'zlata' : t.predmet === 'cestina' ? 'modra' : 'zelena');
const NAZEV_PREDMETU = { zelena: 'Matematika', modra: 'Čeština', zlata: 'Bonus' };
export const predmetTahaku = (t) => NAZEV_PREDMETU[barvaTahaku(t)];

const BARVY_SVG = {
  zelena: { telo: '#1FC27E', znak: '#0F172A' },
  modra: { telo: '#3B82F6', znak: '#FFFFFF' },
  zlata: { telo: '#F5C518', znak: '#0F172A' },
};
const ZNAK_SVG = {
  zelena: (b) => `<text x="35" y="33" text-anchor="middle" font-family="Sora, sans-serif" font-weight="800" font-size="17" fill="${b.znak}">x²</text>`,
  modra: (b) => `<text x="35" y="33" text-anchor="middle" font-family="Sora, sans-serif" font-weight="800" font-size="16" fill="${b.znak}">Aa</text>`,
  zlata: (b) => `<path d="M35 15.5l3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1z" fill="${b.znak}"/>`,
};

/** Obrázek taháku: lístek v barvě předmětu se znakem a řádky (72 × 72). */
export function svgTahaku(t, { titulek = '' } = {}) {
  const barva = barvaTahaku(t);
  const b = BARVY_SVG[barva];
  const pristup = titulek ? `role="img" aria-label="${String(titulek).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}"` : 'aria-hidden="true"';
  return `<svg viewBox="0 0 72 72" ${pristup} focusable="false">`
    + '<rect x="21" y="11" width="40" height="53" rx="6" fill="#0F172A" opacity=".28" transform="rotate(9 41 37)"/>'
    + '<rect x="13" y="8" width="44" height="57" rx="7" fill="#0F172A"/>'
    + `<rect x="15.5" y="10.5" width="39" height="52" rx="5" fill="${b.telo}"/>${ZNAK_SVG[barva](b)}`
    + `<path d="M23 44h24M23 50.5h24M23 57h14" stroke="${b.znak}" stroke-width="2.6" stroke-linecap="round" opacity=".6"/></svg>`;
}

// ---------------------------------------------------------------------
// Markdown + KaTeX (stejně jako md() v rodic-karta.js; bez načtených knihoven aspoň čitelný text)
// ---------------------------------------------------------------------

function md(text, inline = false) {
  try { return renderMarkdown(text, { inline }); } catch { return document.createTextNode(String(text ?? '')); }
}

/** Načte knihovny pro vzorce; když CDN nejde, taháky se ukážou jako prostý text. */
export async function pripravVzorce() {
  try { await nacistKnihovny(); } catch (e) { console.warn('taháky: knihovny pro vzorce se nenačetly', e); }
}

// ---------------------------------------------------------------------
// Texty
// ---------------------------------------------------------------------

const MESICE_V = ['v lednu', 'v únoru', 'v březnu', 'v dubnu', 'v květnu', 'v červnu', 'v červenci', 'v srpnu', 'v září', 'v říjnu', 'v listopadu', 'v prosinci'];
/** '2026-11' → „v listopadu“ */
export const vMesici = (mesic) => MESICE_V[Number(String(mesic).slice(5, 7)) - 1] || '';
const slovoLekce = (n) => (n >= 1 && n <= 4 ? 'lekce' : 'lekcí');
const zbyvaDni = (n) => (n === 1 ? h('vyzva.zbyva_1') : n >= 2 && n <= 4 ? h('vyzva.zbyva_2_4', { n }) : h('vyzva.zbyva_5', { n }));

/** Co udělat pro zamčený tahák (text na šedé kartičce). */
export function textZamku(t, { lekce = [], ted = Date.now() } = {}) {
  if (!jeBonus(t)) return t.faze === 'pilot' ? h('tahaky.zamceno_pilot') : h('tahaky.zamceno_tyden', { tyden: t.tyden });
  if (sezonaZamcena(lekce)) return h('tahaky.zamceno_bez_sezony');
  const v = DATA.vyzvy.find((x) => x.mesic === t.mesic) || { mesic: t.mesic, cil: 0 };
  const obdobi = obdobiVyzvy(t, ted);
  if (obdobi === 'skoncila') return h('tahaky.zamceno_vyzva_skoncila');
  if (obdobi === 'bezi') return h('tahaky.zamceno_vyzva_bezi', { x: pocetVMesici(lekce, v.mesic, { konec: konecVyzvy(v) }), cil: v.cil, mesic: vMesici(v.mesic) });
  return h('tahaky.zamceno_vyzva', { cil: v.cil, lekci: slovoLekce(Number(v.cil)), mesic: vMesici(v.mesic) });
}

// ---------------------------------------------------------------------
// Viděné taháky (localStorage) a odemčené pro dítě
// ---------------------------------------------------------------------

const klicVidene = (diteId) => `spolu.tahaky.videno.${diteId}`;

function nactiVidene(diteId) {
  try {
    const x = JSON.parse(localStorage.getItem(klicVidene(diteId)) || 'null');
    return Array.isArray(x) ? x : null; // null = na tomto zařízení ještě nikdy
  } catch { return []; }
}

function ulozVidene(diteId, ids) {
  try { localStorage.setItem(klicVidene(diteId), JSON.stringify([...new Set(ids)])); } catch { /* bez úložiště se ukáže znovu */ }
}

/**
 * Odemčené taháky dítěte. Navíc: zlatý tahák, který už dítě na tomto zařízení dostalo, zůstává odemčený,
 * i když se počet lekcí v měsíci výzvy později sníží (lekce zopakovaná v dalším měsíci má nové datum dokončení).
 * @param {string} diteId
 * @param {Array<object>} lekce  lekceProDite
 * @param {{ted?: number, navic?: {id: string, konec?: string}}} [volby]
 */
export function odemceneTahakyDitete(diteId, lekce, { ted = tedNyni(), navic = null } = {}) {
  const odemcene = odemceneTahaky(lekce, { ted, navic });
  const bonusy = new Set(DATA.bonus.map((b) => b.id));
  for (const id of nactiVidene(diteId) || []) if (bonusy.has(id)) odemcene.add(id);
  return odemcene;
}

// ---------------------------------------------------------------------
// Tahák: obsah (modal i tisk)
// ---------------------------------------------------------------------

/** Tahák jako <article>: štítek (předmět · fáze · týden), název, bloky s pravidlem a příkladem. */
export function vykresliTahak(t, { tisk = false, nadpisId = null } = {}) {
  return el('article', { class: ['tahak', `tahak--${barvaTahaku(t)}`, tisk && 'tahak--tisk'] },
    el('header', { class: 'tahak__hlavicka' },
      el('span', { class: 'tahak__obrazek', htmlBezpecne: svgTahaku(t) }),
      el('div', { class: 'tahak__titulek' },
        el('span', { class: 'tahak__stitek', text: `${predmetTahaku(t)} · ${t.podnazev || ''}` }),
        el('h2', { class: 'tahak__nazev', id: nadpisId, text: t.nazev }))),
    el('div', { class: 'tahak__bloky' }, (t.bloky || []).map((b) => el('section', { class: 'tahak__blok' },
      el('h3', { class: 'tahak__nadpis', text: b.nadpis }),
      el('div', { class: 'tahak__text' }, md(b.text)),
      b.priklad ? el('div', { class: 'tahak__priklad' },
        el('span', { class: 'tahak__priklad-popisek', text: h('tahaky.priklad') }),
        el('div', { class: 'tahak__priklad-text' }, md(b.priklad))) : null))),
    tisk ? el('footer', { class: 'tahak__pata' }, el('span', { text: 'Spolu na přijímačky' }), el('span', { text: 'StudentBase.cz' })) : null);
}

/** Tahák v modalu ve čitelné velikosti. */
export async function otevritTahak(t) {
  if (!t) return;
  await pripravVzorce();
  const d = el('dialog', { class: 'modal modal--tahak', 'aria-labelledby': 'tahakNadpis' },
    el('div', { class: 'modal__panel' },
      el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit', type: 'button', 'aria-label': 'Zavřít' }, ikona('krizek')),
      vykresliTahak(t, { nadpisId: 'tahakNadpis' }),
      el('div', { class: 'modal__akce' },
        el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => zavritModal(d) }, 'Zavřít'))));
  document.body.append(d);
  await otevritModal(d);
  d.remove();
}

/**
 * Tisková verze: odemčené taháky po dvou na list A4 (CSS @media print v design-system.css, sekce R78).
 * Na obrazovce je schovaná; tiskne se tlačítkem „Vytisknout odemčené“ i Ctrl+P.
 */
export function tiskovaVerze(tahaky) {
  const listy = [];
  for (let i = 0; i < tahaky.length; i += 2) {
    listy.push(el('div', { class: 'tahaky-tisk__list' }, tahaky.slice(i, i + 2).map((t) => vykresliTahak(t, { tisk: true }))));
  }
  return el('div', { class: 'tahaky-tisk', 'aria-hidden': 'true' }, listy);
}

// ---------------------------------------------------------------------
// Stránka „Moje taháky“: kartičky
// ---------------------------------------------------------------------

/** Kartička taháku: odemčená = tlačítko v barvě předmětu, zamčená = šedá s tím, co pro ni udělat. */
export function kartickaTahaku(t, { odemceny, lekce = [], ted = Date.now() } = {}) {
  const obsah = [
    el('span', { class: 'tahak-karticka__obrazek', htmlBezpecne: svgTahaku(t) }),
    el('span', { class: 'tahak-karticka__text' },
      el('span', { class: 'tahak-karticka__podnazev', text: t.podnazev || '' }),
      el('strong', { class: 'tahak-karticka__nazev', text: t.nazev }),
      odemceny
        ? el('span', { class: 'tahak-karticka__akce' }, h('tahaky.otevrit'), ikona('sipka-vpravo'))
        : el('span', { class: 'tahak-karticka__zamek' }, ikona('zamek'), textZamku(t, { lekce, ted })))];
  return el('li', { class: 'tahaky-mrizka__polozka' }, odemceny
    ? el('button', { class: ['tahak-karticka', `tahak-karticka--${barvaTahaku(t)}`], type: 'button', 'aria-label': `${t.nazev} (${predmetTahaku(t)}, ${t.podnazev || ''}): ${h('tahaky.otevrit')}`, onClick: () => otevritTahak(t) }, ...obsah)
    : el('div', { class: 'tahak-karticka tahak-karticka--zamceno', 'aria-disabled': 'true' }, ...obsah));
}

/** Mřížka kartiček jedné skupiny (matematika / čeština / zlaté). */
export function mrizkaTahaku(tahaky, volby) {
  return el('ul', { class: 'tahaky-mrizka' }, tahaky.map((t) => kartickaTahaku(t, { ...volby, odemceny: volby.odemcene.has(t.id) })));
}

// ---------------------------------------------------------------------
// Přehled: řádek „Taháky: x z N“ a karta výzvy
// ---------------------------------------------------------------------

/** Řádek pod odznaky (vzhled jako řádek odznaků), odkaz na tahaky.html. Bez obsahu taháků null. */
export function radekTahaku(odemcene) {
  const tydenni = tydenniTahaky();
  if (!tydenni.length && !DATA.bonus.length) return null;
  const x = tydenni.filter((t) => odemcene.has(t.id)).length;
  const zlate = DATA.bonus.filter((t) => odemcene.has(t.id)).length;
  const vse = vsechnyTahaky();
  const ukazat = [...vse.filter((t) => odemcene.has(t.id)), ...tydenni.filter((t) => !odemcene.has(t.id))].slice(0, 6);
  const titulek = `${h('tahaky.radek', { x, n: tydenni.length })}${zlate ? ` · ${h('tahaky.radek_bonus', { x: zlate })}` : ''}`;
  return el('a', { class: 'karta karta--tesna odznaky-radek tahaky-radek', href: 'tahaky.html', 'aria-label': `${titulek}. ${h('tahaky.nadpis')}.` },
    el('span', { class: 'odznaky-radek__hlavicka' },
      el('strong', { text: titulek }),
      el('span', { class: 'text-tlumeny', text: h('tahaky.zobrazit') })),
    el('span', { class: 'odznaky-radek__pas tahaky-radek__pas', 'aria-hidden': 'true' },
      ukazat.map((t) => el('span', { class: ['tahak-mini', !odemcene.has(t.id) && 'tahak-mini--zamceno'], htmlBezpecne: svgTahaku(t) }))));
}

/**
 * Karta měsíční výzvy (spec §2): „Listopadová výzva: 7 z 12 lekcí · zbývá 9 dní · odměna: zlatý tahák“
 * s ukazatelem; po splnění „Výzva splněna! Tahák … je tvůj.“ (rodič: „je odemčený“). Bez výzvy null.
 * @param {ReturnType<import('./tahaky.js').stavVyzvy>} s
 */
export function kartaVyzvy(s, { rodic = false } = {}) {
  if (!s) return null;
  const nazevOdmeny = s.odmena?.nazev || '';
  const nadpis = s.splneno
    ? h(rodic ? 'vyzva.splneno_rodic' : 'vyzva.splneno_zak', { nazev: nazevOdmeny })
    : h('vyzva.karta', { nazev: s.nazev, x: s.hotovo, cil: s.cil });
  const meta = s.splneno ? h('vyzva.karta', { nazev: s.nazev, x: s.hotovo, cil: s.cil }) : `${zbyvaDni(s.zbyvaDni)} · ${h('vyzva.odmena')}`;
  const plne = Math.min(s.hotovo, s.cil);
  const ukazatel = s.cil <= 15
    ? el('div', { class: 'vyzva__segmenty', style: `--pocet:${s.cil}` }, Array.from({ length: s.cil }, (_, i) => el('span', { class: i < plne ? 'je-hotovo' : null })))
    : el('div', { class: 'vyzva__podil' }, el('span', { style: `width:${Math.round((plne / s.cil) * 100)}%` }));
  ukazatel.setAttribute('role', 'progressbar');
  ukazatel.setAttribute('aria-valuemin', '0');
  ukazatel.setAttribute('aria-valuemax', String(s.cil));
  ukazatel.setAttribute('aria-valuenow', String(plne));
  ukazatel.setAttribute('aria-label', h('vyzva.karta', { nazev: s.nazev, x: s.hotovo, cil: s.cil }));
  const odmena = s.odmena ? { ...s.odmena } : { id: 'b:', mesic: s.mesic };
  return el('section', { class: ['karta', 'karta--tesna', 'vyzva', s.splneno && 'vyzva--splneno'], 'aria-labelledby': 'vyzvaNadpis' },
    el('div', { class: 'vyzva__hlavicka' },
      el('span', { class: 'vyzva__obrazek', htmlBezpecne: svgTahaku(odmena) }),
      el('div', { class: 'vyzva__text' },
        el('h2', { class: 'vyzva__nadpis', id: 'vyzvaNadpis', text: nadpis }),
        el('p', { class: 'vyzva__meta', text: meta }))),
    ukazatel,
    s.splneno && s.odmena
      ? el('div', { class: 'vyzva__akce' }, el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => otevritTahak(s.odmena) }, ikona('kniha'), h('tahaky.otevrit')))
      : el('p', { class: 'vyzva__popis', text: h('vyzva.popis', { mesic: vMesici(s.mesic) }) }));
}

// ---------------------------------------------------------------------
// Nově odemčené taháky jako karty k otočení
// ---------------------------------------------------------------------

const TEXTY_KARET = {
  titulek: (n) => (n > 1 ? h('tahaky.karta_nove', { n }) : h('tahaky.karta_novy')),
  seber: (n) => (n > 1 ? h('tahaky.karta_seber_vice') : h('tahaky.karta_seber')),
  get oznameni() { return h('tahaky.karta_oznameni'); },
  pas: 'Karty taháků, listuj doleva a doprava',
};

function popisKarty(t) {
  return {
    barva: barvaTahaku(t), predmet: predmetTahaku(t), obrazek: svgTahaku(t, { titulek: t.nazev }),
    druh: h(jeBonus(t) ? 'tahaky.karta_druh_bonus' : 'tahaky.karta_druh'), nazev: t.nazev, pochvala: t.podnazev || '',
    // „Otevřít tahák“ otevře tahák nad kartami; po zavření se dítě vrátí ke kartám (další ještě neotočené)
    akce: { text: h('tahaky.otevrit'), onClick: () => otevritTahak(t) },
  };
}

/**
 * Ukáže nově odemčené taháky (karty k otočení) a zapamatuje si je jako viděné.
 * Na zařízení, kde se taháky ještě nikdy neukazovaly, se odemčené jen tiše zapamatují (`prvniTise`, jako odznaky).
 * Po lekci (`prvniTise: false`) se na takovém zařízení ukážou jen taháky odemčené právě touto lekcí (`predtim` = bez ní).
 * @param {string} diteId
 * @param {Set<string>} odemcene
 * @param {{prvniTise?: boolean, predtim?: Set<string>|null}} [volby]
 * @returns {Promise<string[]>} ukázané taháky
 */
export async function ukazNoveTahaky(diteId, odemcene, { prvniTise = true, predtim = null } = {}) {
  let videne = nactiVidene(diteId);
  if (videne === null) {
    if (prvniTise) { ulozVidene(diteId, [...odemcene]); return []; }
    videne = predtim ? [...predtim] : [];
  }
  const nove = noveTahaky(odemcene, videne);
  ulozVidene(diteId, [...videne, ...nove]); // viděné hned, ať se při zavření stránky neukážou znovu
  if (!nove.length) return [];
  await pripravVzorce();
  await oknoKaret(nove.map((id) => popisKarty(najdiTahak(id))), { texty: TEXTY_KARET });
  return nove;
}

/**
 * Po dokončení lekce (lekce.js): taháky odemčené právě dokončenou lekcí (`navic`, v DB ještě nemusí být dokončená).
 * @param {string} diteId
 * @param {Array<object>} lekce  lekceProDite
 * @param {{id: string, konec: string}} navic
 */
export async function ukazNoveTahakyPoLekci(diteId, lekce, navic) {
  const ted = tedNyni();
  const bez = lekce.map((l) => (l.id === navic.id ? { ...l, dokoncene: null } : l));
  return ukazNoveTahaky(diteId, odemceneTahakyDitete(diteId, lekce, { ted, navic }),
    { prvniTise: false, predtim: odemceneTahakyDitete(diteId, bez, { ted }) });
}
