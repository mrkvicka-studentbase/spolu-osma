// =====================================================================
// tahaky-stranka.js — stránka „Moje taháky“ (tahaky.html, R78, reporty/2026-10-08-spec-tahaky-vyzvy.md).
// Přihlášení a výběr dítěte jako přehled (chranStranku, mojeDeti, ziskejDite); průběh z lekceProDite.
// Mřížka kartiček (matematika, čeština, zlaté za výzvy), tahák v modalu, „Vytisknout odemčené“ (A4, 2 na list),
// karta výzvy a nově odemčené taháky jako karty k otočení. Komponenty: tahaky-ui.js, výpočty: tahaky.js.
// =====================================================================

import { el, ikona, chranStranku, nacitani, chybaStranky } from './ui.js';
import { h } from './hlasky.js';
import { mojeDeti, lekceProDite } from './supabase.js';
import { ziskejRoli, ziskejDite, nastavDite } from './role.js';
import { napojMenu } from './menu.js';
import { vsechnyTahaky, tydenniTahaky, jeBonus, stavVyzvy, sezonaZamcena } from './tahaky.js';
import {
  tedNyni, pripravVzorce, odemceneTahakyDitete, mrizkaTahaku, kartaVyzvy, tiskovaVerze, ukazNoveTahaky,
} from './tahaky-ui.js';

const stav = { deti: [], dite: null };
const $ = (id) => document.getElementById(id);

function prepinacDeti() {
  if (stav.deti.length < 2) return null;
  return el('div', { class: 'prepinac', role: 'group', 'aria-label': 'Dítě' }, stav.deti.map((d) => el('button', {
    class: 'prepinac__volba', type: 'button', 'aria-pressed': String(d.id === stav.dite.id),
    onClick: () => { if (d.id !== stav.dite.id) { nastavDite(d.id); vykresli(); } },
  }, d.krestni_jmeno)));
}

function skupina(nadpis, tahaky, volby) {
  if (!tahaky.length) return null;
  const ma = tahaky.filter((t) => volby.odemcene.has(t.id)).length;
  return el('section', { class: 'tahaky-skupina', 'aria-label': nadpis },
    el('h2', { class: 'tahaky-skupina__nadpis' }, nadpis, el('span', { class: 'text-tlumeny', text: ` ${ma} z ${tahaky.length}` })),
    mrizkaTahaku(tahaky, volby));
}

async function vykresli() {
  const obsah = $('obsah');
  if (!stav.deti.length) {
    obsah.removeAttribute('aria-busy');
    obsah.replaceChildren(el('div', { class: 'prazdny-stav' },
      el('span', { class: 'ikona-kruh' }, ikona('uzivatel')),
      el('p', { class: 'prazdny-stav__text', text: h('prazdny.deti') }),
      el('a', { class: 'tlacitko tlacitko--primarni', href: 'prehled.html' }, h('tahaky.zpet'))));
    return;
  }
  stav.dite = stav.deti.find((d) => d.id === ziskejDite()) || stav.deti[0];
  nastavDite(stav.dite.id);
  nacitani(obsah, 'Načítám taháky…');
  try {
    const [lekce] = await Promise.all([lekceProDite(stav.dite.id), pripravVzorce()]);
    const ted = tedNyni();
    const odemcene = odemceneTahakyDitete(stav.dite.id, lekce, { ted });
    const tydenni = tydenniTahaky();
    const volby = { odemcene, lekce, ted };
    const vse = vsechnyTahaky();
    const bonusy = vse.filter(jeBonus);
    const odemceneTahaky = vse.filter((t) => odemcene.has(t.id));
    const tisk = el('button', {
      class: 'tlacitko tlacitko--sekundarni', type: 'button', disabled: !odemceneTahaky.length,
      'aria-describedby': odemceneTahaky.length ? null : 'tahakyTiskNic', onClick: () => window.print(),
    }, ikona('tiskarna'), h('tahaky.tisk'));

    const casti = [
      el('div', { class: 'tahaky-hlavicka' },
        el('a', { class: 'tlacitko tlacitko--tiche tahaky-hlavicka__zpet', href: 'prehled.html' }, ikona('sipka-vlevo'), h('tahaky.zpet')),
        el('div', { class: 'radek radek--mezi tahaky-hlavicka__radek' },
          el('div', { class: 'radek' }, el('h1', { text: h('tahaky.nadpis') }), prepinacDeti()),
          vse.length ? tisk : null),
        el('p', { class: 'tahaky-hlavicka__uvod', text: h('tahaky.uvod') }),
        vse.length ? el('p', { class: 'text-tlumeny' },
          el('strong', { text: `${stav.dite.krestni_jmeno}: ` }), h('tahaky.pocet', { x: odemceneTahaky.length, n: vse.length }),
          odemceneTahaky.length ? null : el('span', { id: 'tahakyTiskNic', text: `. ${h('tahaky.tisk_nic')}` })) : null),
      sezonaZamcena(lekce) ? null : kartaVyzvy(stavVyzvy(lekce, ted), { rodic: ziskejRoli() === 'rodic' }),
    ];
    if (!vse.length) {
      casti.push(el('div', { class: 'prazdny-stav' },
        el('span', { class: 'ikona-kruh' }, ikona('kniha')),
        el('p', { class: 'prazdny-stav__text', text: h('tahaky.zadne') })));
    }
    casti.push(
      skupina(h('tahaky.sekce_matematika'), tydenni.filter((t) => t.predmet !== 'cestina'), volby),
      skupina(h('tahaky.sekce_cestina'), tydenni.filter((t) => t.predmet === 'cestina'), volby),
      skupina(h('tahaky.sekce_bonus'), bonusy, volby));
    obsah.removeAttribute('aria-busy');
    obsah.replaceChildren(...casti.filter(Boolean));
    // tisková verze: mimo <main>, na obrazovce schovaná (design-system.css, sekce R78)
    document.querySelector('.tahaky-tisk')?.remove();
    if (odemceneTahaky.length) document.body.append(tiskovaVerze(odemceneTahaky));
    ukazNoveTahaky(stav.dite.id, odemcene).catch((e) => console.warn('taháky:', e));
  } catch (e) {
    console.error(e);
    chybaStranky(obsah, e?.message || h('chyba.nacteni'));
  }
}

async function start() {
  const obsah = $('obsah');
  nacitani(obsah, 'Načítám…');
  try {
    const s = await chranStranku();
    if (!s) return;
    napojMenu({ poZmeneRole: () => vykresli() });
    stav.deti = await mojeDeti();
    await vykresli();
  } catch (e) {
    console.error(e);
    chybaStranky(obsah, e?.message || h('chyba.nacteni'));
  }
}

start();
