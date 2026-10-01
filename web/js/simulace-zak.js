// =====================================================================
// simulace-zak.js — simulace přijímačky u žáka (osnova Fáze 2 §3.1, §3.4; R38). Úlohy vykresluje lekce.js
// stejným tokem jako diagnostiku (1 pokus, neutrální „Uloženo.", bez ✔/✘, bez taháku a semaforu);
// tady jsou obrazovky navíc (start s tempem, konec 1. části, konec testu, papír), odpočet 70 min přes
// obě části s hláškami tempa a výsledek pro dítě (jen čísla úloh, které sedí, bez počtu a procent).
// Čtení sezení je jen při načtení / tlačítkem (žádná synchronizace, kostra 01).
// =====================================================================

import { el, ikona } from './ui.js';
import { h } from './hlasky.js';
import { casSimulace, stavTempa, konecCasti, sestavSouhrnSimulace } from './simulace.js';

/**
 * Poslední sezení dítěte v lekci (probíhající nebo dokončené; bez limitu 24 h — část 2 může být druhý den).
 * @param {string} diteId
 * @param {string} lekceId
 * @returns {Promise<object|null>}
 */
export async function posledniSezeniCasti(diteId, lekceId) {
  const { supabase } = await import('./supabase.js');
  const { data, error } = await supabase.from('sezeni').select('*')
    .eq('dite_id', diteId).eq('lekce_id', lekceId).in('stav', ['probiha', 'dokonceno'])
    .order('zacatek', { ascending: false }).limit(1);
  if (error) throw new Error(h('chyba.nacteni'));
  return data?.[0] || null;
}

/**
 * Odpočet části (osnova §3.1): část 1 od svého začátku; část 2 čte při načtení `sezeni.zacatek` části 1
 * (a konec části 1 = poslední odpověď dítěte), jinak vlastní 35 min („rozděleno").
 * @param {{lekce: object, sezeni: object|null, diteId: string}} v
 * @returns {Promise<{start: number, minut: number, rozdeleno: boolean}>}
 */
export async function casCasti({ lekce, sezeni, diteId }) {
  const sim = lekce.simulace || {};
  const odpocetMin = Number(sim.odpocet_min) || Number(lekce.cas_min) || 70;
  const ted = Date.now();
  if (sim.cast !== 2) return casSimulace({ cast: 1, zacatek1: sezeni?.zacatek ?? ted, odpocetMin });
  let s1 = null;
  let odpovedi1 = [];
  try {
    s1 = sim.prvni_cast ? await posledniSezeniCasti(diteId, sim.prvni_cast) : null;
    if (s1 && !s1.konec) {
      const { stavSezeni } = await import('./supabase.js');
      odpovedi1 = (await stavSezeni(s1.id)).odpovedi;
    }
  } catch (e) { console.warn('simulace: 1. část se nepodařilo načíst, odpočet 2. části běží samostatně', e); }
  return casSimulace({ cast: 2, zacatek1: s1?.zacatek ?? null, konec1: konecCasti(s1, odpovedi1), zacatek2: sezeni?.zacatek ?? ted, odpocetMin });
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Odpočet v liště žáka + hlášky tempa (40. min, konec). Tvrdý stop není.
 * @param {{start: number, minut: number, rozdeleno: boolean}} cas
 * @param {{odpocet: HTMLElement, odpocetCas: HTMLElement, systemove: HTMLElement}} uzly
 * @returns {() => void} zastavení
 */
export function spustOdpocetSimulace(cas, { odpocet, odpocetCas, systemove }) {
  let pripominkaVidena = false;
  let casovac = null;
  const hlaska = (klic, id) => {
    if (document.getElementById(id)) return;
    systemove.append(el('div', { class: 'hlaska hlaska--info', role: 'status', id }, ikona(klic === 'sim.tempo_70' ? 'hodiny' : 'info'),
      el('div', { class: 'hlaska__text', text: h(klic) })));
  };
  const tik = () => {
    const t = stavTempa(cas, Date.now());
    if (t.vyprselo) {
      odpocet.classList.add('je-vyprselo');
      odpocetCas.textContent = 'Čas vypršel';
      odpocet.setAttribute('aria-label', 'Čas testu vypršel');
      document.getElementById('simTempo40')?.remove();
      hlaska('sim.tempo_70', 'simTempo70');
      clearInterval(casovac);
      return;
    }
    odpocetCas.textContent = mmss(t.zbyvaS);
    odpocet.setAttribute('aria-label', `Zbývá ${Math.ceil(t.zbyvaS / 60)} min`);
    if (t.pripominka && !pripominkaVidena) { pripominkaVidena = true; hlaska('sim.tempo_40', 'simTempo40'); }
  };
  tik();
  if (!odpocet.classList.contains('je-vyprselo')) casovac = setInterval(tik, 1000);
  return () => clearInterval(casovac);
}

// ---------------------------------------------------------------------
// Obrazovky
// ---------------------------------------------------------------------

/** Start části: tempo (osnova §3.1) + „Začít test". */
export function vykresliStartSimulace(plocha, { cast, rozdeleno }, zacit) {
  const tlacitko = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button', onClick: zacit },
    h('sim.start_tlacitko'), ikona('sipka-vpravo'));
  const text = cast === 2 ? h(rozdeleno ? 'sim.start_2_rozdeleno' : 'sim.start_2_text') : null;
  plocha.replaceChildren(el('section', { class: 'karta konec-lekce sim-start', 'aria-labelledby': 'simStart' },
    el('span', { class: 'ikona-kruh' }, ikona('hodiny')),
    el('h2', { id: 'simStart', text: h(cast === 2 ? 'sim.start_2_nadpis' : 'sim.start_nadpis') }),
    text ? el('p', { class: 'text-tlumeny', text }) : null,
    el('div', { class: 'hlaska hlaska--info sim-tempo' }, ikona('info'),
      el('div', { class: 'hlaska__text' }, el('p', { text: h('sim.start_text') }), el('p', { text: h('sim.start_text_app') }))),
    tlacitko));
  window.scrollTo({ top: 0 });
  tlacitko.focus({ preventScroll: true });
}

/** Konec 1. části (aplikace): odkaz na 2. část, odpočet běží dál. */
export function vykresliKonecCasti1(plocha, hrefDalsi) {
  plocha.removeAttribute('aria-busy');
  plocha.replaceChildren(el('div', { class: 'karta konec-lekce' },
    el('span', { class: 'ikona-kruh ikona-kruh--zelena' }, ikona('fajfka')),
    el('h2', { text: h('sim.konec_1_nadpis') }),
    el('p', { class: 'text-tlumeny', text: h('sim.konec_1_text') }),
    el('a', { class: 'tlacitko tlacitko--primarni tlacitko--velke', href: hrefDalsi }, h('sim.dalsi_cast'), ikona('sipka-vpravo'))));
  window.scrollTo({ top: 0 });
}

/**
 * Konec testu pro dítě (osnova §3.4): „Test máš za sebou. Tyhle úlohy sedí: 1, 2, 5…" — jen čísla zeleně,
 * bez počtu a procent; „Zítra spolu projdeme 4 úlohy.".
 * @param {HTMLElement} plocha
 * @param {{sedi: number[], ceka?: boolean, obnovit?: (() => void)|null}} v
 */
export function vykresliKonecSimulace(plocha, { sedi = [], ceka = false, obnovit = null }) {
  plocha.removeAttribute('aria-busy');
  const cisla = sedi.length
    ? [el('p', { class: 'sim-sedi__nadpis', text: h('sim.konec_sedi') }),
      el('ul', { class: 'sim-sedi', 'aria-label': h('sim.konec_sedi') }, sedi.map((p) => el('li', { class: 'sim-sedi__cislo', text: String(p) })))]
    : [el('p', { class: 'text-tlumeny', text: h('sim.konec_zadna') })];
  plocha.replaceChildren(el('div', { class: 'karta konec-lekce sim-konec' },
    el('span', { class: 'ikona-kruh ikona-kruh--zelena' }, ikona('fajfka')),
    el('h2', { text: h('sim.konec_nadpis') }),
    ...cisla,
    ceka ? el('p', { class: 'text-tlumeny', text: h('sim.konec_ceka') }) : null,
    el('p', { class: 'text-tucny', text: h('sim.konec_zitra') }),
    el('div', { class: 'radek radek--stred' },
      obnovit ? el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: obnovit }, ikona('obnovit'), h('sim.papir_obnovit')) : null,
      el('a', { class: 'tlacitko tlacitko--tiche', href: 'prehled.html' }, ikona('sipka-vlevo'), 'Zpět na přehled'))));
  window.scrollTo({ top: 0 });
}

/** Simulace na papír: odkaz na tisk sešitu a archu (obě části), výsledek až po rodičově kontrole. */
export function vykresliPapirSimulace(plocha, { tiskHref, obnovit }) {
  plocha.removeAttribute('aria-busy');
  plocha.replaceChildren(el('div', { class: 'karta konec-lekce' },
    el('span', { class: 'ikona-kruh' }, ikona('tiskarna')),
    el('h2', { text: h('sim.papir_nadpis') }),
    el('p', { class: 'text-tlumeny', text: h('sim.papir_text') }),
    el('div', { class: 'hlaska hlaska--info sim-tempo' }, ikona('info'), el('div', { class: 'hlaska__text', text: h('sim.start_text') })),
    el('div', { class: 'radek radek--stred' },
      el('a', { class: 'tlacitko tlacitko--sekundarni', href: tiskHref }, ikona('tiskarna'), h('oba.tisk_odkaz')),
      el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: obnovit }, ikona('obnovit'), h('sim.papir_obnovit')))));
  window.scrollTo({ top: 0 });
}

// ---------------------------------------------------------------------
// Výsledek pro dítě
// ---------------------------------------------------------------------

/**
 * Co dítě uvidí: souhrn od rodiče (po Kontrole) má přednost; jinak průběžný výpočet z odpovědí obou částí
 * (v aplikaci: úlohy s postupem a rýsováním čekají na rodiče, `ceka: true`).
 * @param {{lekce: object, sezeni: object|null, diteId: string, odpovedi?: Array<object>}} v  lekce = aktuální část
 * @returns {Promise<{sedi: number[], ceka: boolean, hotovo: boolean}>}  hotovo = rodič souhrn uložil
 */
export async function vysledekProDite({ lekce, sezeni, diteId, odpovedi = null }) {
  const sb = await import('./supabase.js');
  const { nactiLekciObsah } = await import('./obsah.js');
  const sim = lekce.simulace || {};
  const druhaId = sim.cast === 2 ? sim.prvni_cast : sim.druha_cast;
  let tato = { sezeni, odpovedi: odpovedi || [] };
  if (sezeni && !odpovedi) {
    const st = await sb.stavSezeni(sezeni.id);
    tato = { sezeni: st.sezeni, odpovedi: st.odpovedi.concat(sb.neulozeneOdpovedi({ sezeniId: sezeni.id })) };
  }
  if (tato.sezeni?.souhrn?.typ === 'simulace') return { sedi: tato.sezeni.souhrn.sedi || [], ceka: false, hotovo: true };
  const [druha, sezeni2] = await Promise.all([nactiLekciObsah(druhaId), druhaId ? posledniSezeniCasti(diteId, druhaId) : null]);
  if (sezeni2?.souhrn?.typ === 'simulace' && sezeni2.stav === 'dokonceno') return { sedi: sezeni2.souhrn.sedi || [], ceka: false, hotovo: true };
  const odpovedi2 = sezeni2 ? (await sb.stavSezeni(sezeni2.id)).odpovedi : [];
  const [lekce1, lekce2, odpovedi1, odpovediDruhe] = sim.cast === 2
    ? [druha, lekce, odpovedi2, tato.odpovedi] : [lekce, druha, tato.odpovedi, odpovedi2];
  const s = sestavSouhrnSimulace({ lekce1, lekce2, odpovedi1, odpovedi2: odpovediDruhe, rezim: tato.sezeni?.rezim || 'app' });
  return { sedi: s.sedi, ceka: s.ceka > 0, hotovo: false };
}
