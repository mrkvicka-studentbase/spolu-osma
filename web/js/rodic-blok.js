// =====================================================================
// rodic-blok.js — blok na čas na stránce rodiče (R46, testovací rodič F2 Top 5 bod 1).
// Během bloku: jen karta „Blok na čas běží" (doporučený čas, uplynulý čas od začátku sezení bez tvrdého stopu),
// „Odevzdáno x ze 4" (v aplikaci, polling 30 s v rodic.js), jediné pravidlo a tlačítko „Čas vypršel, projdeme to spolu".
// Žádný tahák, řešení, rady ani brána ①–④. Po bloku: běžná karta ①–④ (rodic-karta.js) a v kroku ① „Dítě zadalo: …".
// Fáze (běží / po) je jen v localStorage (sezení), do DB nic nového; semafor v DB = procházení už začalo.
// Vykreslovací funkce jsou čisté DOM bez sítě (snímky: nastroje/screenshoty-f2.mjs --blok).
// =====================================================================

import { el, ikona, otevritModal, zavritModal, formatCas } from './ui.js';
import { h } from './hlasky.js';
import { renderMarkdown, renderTex } from './obsah.js';
import { odpovedDitete, posledniOdpoved } from './simulace.js';

const klicFaze = (sezeniId) => `spolu.blok.${sezeniId}`;

/** Uložená fáze bloku na tomto zařízení: 'po' | null. */
export function nactiFaziBloku(sezeniId) {
  try { return localStorage.getItem(klicFaze(sezeniId)) === 'po' ? 'po' : null; } catch { return null; }
}

export function ulozFaziBloku(sezeniId) {
  try { localStorage.setItem(klicFaze(sezeniId), 'po'); } catch { /* bez úložiště jen do obnovení stránky */ }
}

/** Celé minuty od začátku sezení (null bez začátku). */
export function uplynuloMin(zacatek, ted = Date.now()) {
  const t = Date.parse(zacatek || '');
  return Number.isFinite(t) ? Math.max(0, Math.floor((ted - t) / 60000)) : null;
}

/**
 * Karta „Blok na čas běží" (čistý DOM).
 * @param {{lekce: object, rezim: 'app'|'papir', zacatek?: string|null, odevzdano?: number, naposledy?: Date|null}} data
 * @param {{prejit?: () => void, obnovit?: () => void}} [akce]  prejit = do procházení (tlačítko), obnovit = načíst stav hned
 * @returns {HTMLElement}  uzel s metodou `.tik(ted?)` (překreslí uplynulý čas a zvýraznění tlačítka)
 */
export function vytvorBlokBezi({ lekce, rezim, zacatek = null, odevzdano = 0, naposledy = null }, { prejit, obnovit } = {}) {
  const casMin = Number(lekce.cas_min) || 20;
  const celkem = lekce.ulohy.length;
  const papir = rezim === 'papir';
  const cas = el('p', { class: 'blok-bezi__cas', role: 'timer' });
  const vyprselo = el('div', { class: 'hlaska hlaska--info', role: 'status', hidden: true }, ikona('hodiny'),
    el('div', { class: 'hlaska__text', text: h('blok.cas_vyprsel') }));
  const tlacitko = prejit ? el('button', {
    class: 'tlacitko tlacitko--sekundarni tlacitko--velke tlacitko--cela-sirka blok-bezi__prejit', type: 'button', onClick: prejit,
  }, ikona('sipka-vpravo'), h('blok.tlacitko')) : null;

  const tik = (ted = Date.now()) => {
    const min = uplynuloMin(zacatek, ted);
    const pres = min !== null && min >= casMin;
    // velké číslo = uplynulé minuty od začátku sezení, vedle doporučený čas (odpočet se nezastaví, tvrdý stop není)
    cas.replaceChildren(
      el('span', { class: 'blok-bezi__uplynulo', text: min === null ? `${casMin} min` : `${min} min` }),
      el('span', { class: 'blok-bezi__doporuceno', text: min === null ? h('blok.cas_doporuceno', { cas: casMin }) : h('blok.cas', { cas: casMin }) }));
    cas.classList.toggle('je-vyprselo', pres);
    vyprselo.hidden = !pres;
    if (tlacitko) {
      tlacitko.classList.toggle('tlacitko--primarni', pres); // po doporučeném čase zvýrazněné
      tlacitko.classList.toggle('tlacitko--sekundarni', !pres);
    }
    return { min, pres };
  };
  tik();

  const stav = papir ? null : el('div', { class: 'stav-zaka blok-bezi__stav', role: 'status' },
    ikona(odevzdano >= celkem ? 'fajfka' : 'tuzka', { trida: 'ikona--velka' }),
    el('div', { class: 'stav-zaka__text' },
      el('strong', { class: 'blok-bezi__pocet', text: h('blok.odevzdano', { x: odevzdano, celkem }) }),
      el('ol', { class: 'blok-bezi__dilky', 'aria-hidden': 'true' }, lekce.ulohy.map((_, i) => el('li', { class: i < odevzdano ? 'je-hotovo' : null }))),
      naposledy ? el('small', { text: h('rodic.stav_naposledy', { cas: formatCas(naposledy) }) }) : null),
    obnovit ? el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona', type: 'button', 'aria-label': h('rodic.stav_obnovit'), onClick: obnovit }, ikona('obnovit')) : null);

  const uzel = el('div', { class: 'zasobnik zasobnik--volny blok-bezi' },
    el('section', { class: 'karta blok-bezi__karta', 'aria-labelledby': 'blokBeziNadpis' },
      el('h1', { class: 'blok-bezi__nadpis', id: 'blokBeziNadpis' }, ikona('hodiny'), h('blok.bezi_nadpis')),
      // úvod lekce (délka bloku + procházení, „do 24 hodin") — úvod v taháku je až po bloku (bod E 27. 9.)
      lekce.uvod_pro_rodice ? el('p', { class: 'blok-bezi__uvod' }, renderMarkdown(lekce.uvod_pro_rodice, { inline: true })) : null,
      cas,
      stav,
      el('div', { class: 'hlaska hlaska--info blok-pruh', role: 'note' }, ikona('bublina'),
        el('div', { class: 'hlaska__text', text: h('blok.pravidlo') })),
      el('p', { class: 'text-tlumeny blok-bezi__konec', text: papir ? h('blok.konec_papir', { cas: casMin }) : h('blok.konec_app') })),
    vyprselo,
    tlacitko);
  uzel.tik = tik;
  return uzel;
}

/**
 * Potvrzení přechodu do procházení, když doporučený čas ještě neuplynul (rodič by pak viděl řešení).
 * @returns {Promise<boolean>}
 */
export async function potvrdPrechod() {
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': 'blokPotvrzeni' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'blokPotvrzeni', text: h('blok.potvrzeni_nadpis') }),
      el('p', { text: h('blok.potvrzeni') }),
      el('div', { class: 'modal__akce' },
        el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => zavritModal(dialog, 'zpet') }, h('blok.potvrzeni_zpet')),
        el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => zavritModal(dialog, 'ano') }, h('blok.potvrzeni_ano')))));
  document.body.append(dialog);
  const volba = await otevritModal(dialog);
  dialog.remove();
  return volba === 'ano';
}

/** Hodnota odpovědi jako DOM (TeX / Markdown z obsahu lekce / prostý text dítěte). */
function hodnotaUzel(o) {
  const hodnota = o.druh === 'tex' ? renderTex(o.obsah)
    : o.druh === 'md' ? renderMarkdown(o.obsah, { inline: true })
      : el('span', { class: 'blok-zadalo__text', text: o.obsah });
  return el('span', { class: 'blok-zadalo__hodnota' }, hodnota, o.jednotka ? ` ${o.jednotka}` : null);
}

/**
 * Po bloku, krok ① v aplikaci: „Dítě zadalo:" po krocích — poslední odpověď dítěte, sedí / nesedí (text + ikona,
 * nikdy jen barva, chyba ne červeně), „na 2. pokus". Úloha bez odpovědi: „Na tuhle úlohu dítě v bloku nedošlo…".
 * @param {object} uloha
 * @param {Array<object>} odpovedi  řádky sezení (dítě i rodič; bere se jen dítě)
 * @returns {HTMLElement}
 */
export function vytvorCoZadalo(uloha, odpovedi) {
  const dite = (odpovedi || []).filter((o) => (o.zadal || 'dite') === 'dite' && o.uloha_id === uloha.id);
  if (!dite.length) {
    return el('div', { class: 'hlaska hlaska--info blok-zadalo', role: 'note' }, ikona('info'),
      el('div', { class: 'hlaska__text', text: h('blok.zadalo_nic') }));
  }
  const kroky = uloha.kroky || [];
  const radky = kroky.map((k, i) => {
    const posl = posledniOdpoved(dite, uloha.id, k.id);
    const o = posl ? odpovedDitete(k, posl.hodnota) : null;
    const popisek = el('span', { class: 'blok-zadalo__krok' }, kroky.length > 1 ? `${i + 1}. ` : '',
      k.popisek && String(k.popisek).length <= 40 ? renderMarkdown(k.popisek, { inline: true }) : `krok ${i + 1}`);
    if (!posl) return el('li', { class: 'blok-zadalo__radek' }, popisek, el('span', { class: 'blok-zadalo__stav', text: h('blok.zadalo_chybi') }));
    if (o.druh === 'poradi') return null; // pořadí ukazuje stav dítěte nahoře (vytvorPoradiRodic)
    if (o.druh === 'rysovani') return el('li', { class: 'blok-zadalo__radek' }, popisek, el('span', { class: 'blok-zadalo__stav', text: h('blok.zadalo_rysovani') }));
    const pokusy = new Set(dite.filter((x) => x.krok_id === k.id).map((x) => Number(x.pokus) || 0)).size;
    const stav = posl.spravne === true ? ['fajfka', h('blok.zadalo_sedi')] : posl.spravne === false ? ['opakovat', h('blok.zadalo_nesedi')] : null;
    return el('li', { class: ['blok-zadalo__radek', posl.spravne === false && 'blok-zadalo__radek--nesedi'] },
      popisek, hodnotaUzel(o),
      stav ? el('span', { class: 'blok-zadalo__stav' }, ikona(stav[0]), stav[1], pokusy > 1 ? ` (${h('blok.zadalo_pokus', { n: pokusy })})` : '') : null);
  }).filter(Boolean);
  return el('div', { class: 'blok-zadalo' },
    el('p', { class: 'blok-zadalo__nadpis', text: h('blok.zadalo_nadpis') }),
    el('ul', { class: 'blok-zadalo__seznam' }, radky));
}
