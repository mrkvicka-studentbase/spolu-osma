// =====================================================================
// dotaznik.js — obrazovka 9 (kostra/04): dotazník po pilotu (rodič)
//
// Chráněná stránka (chranStranku). Už vyplněno (rodina.dotaznik_vyplnen) → rovnou poděkování + platba.
// Odeslání → odeslatDotaznik(odpovedi); DB trigger nastaví dotaznik_vyplnen (nárok na 790 Kč).
// Struktura odpovedi (jsonb v tabulce dotazniky), verze 1:
//   { verze: 1,
//     srozumitelnost_tahaku: 1–5, delka_lekce: 'kratka'|'akorat'|'dlouha', ochota_ditete: 1–5,
//     rezim: 'app'|'papir'|'oboje', co_chybelo: string|null, cena_990: 'ano'|'ne'|'za_790_ano' }
// =====================================================================

import { el, ikona, nacitani, chybaStranky, chranStranku, textSOdkazy } from './ui.js';
import { h } from './hlasky.js';
import { napojMenu } from './menu.js';
import { PLATBA_TEXT, SOS_EMAIL } from './config.js';

const $ = (id) => document.getElementById(id);
const obsah = $('obsah');

/** Povinné otázky s výběrem: name radio → [id fieldsetu, chybová hláška]. */
const POVINNE = {
  srozumitelnost_tahaku: ['d-tahak', h('dotaznik.chyba_stupnice')],
  delka_lekce: ['d-delka', h('dotaznik.chyba_volba')],
  ochota_ditete: ['d-ochota', h('dotaznik.chyba_stupnice')],
  rezim: ['d-rezim', h('dotaznik.chyba_volba')],
  cena_990: ['d-cena', h('dotaznik.chyba_volba')],
};
const CISELNE = new Set(['srozumitelnost_tahaku', 'ochota_ditete']);

// ---------------------------------------------------------------------
// Poděkování (+ platba)
// ---------------------------------------------------------------------

/**
 * @param {import('./supabase.js').Rodina|null} rodina
 * @param {{prave: boolean}} volby  prave = odesláno právě teď (jinak už dřív)
 */
function vykresliPodekovani(rodina, { prave }) {
  const aktivni = rodina?.stav === 'aktivni';
  const deti = [];

  if (aktivni) {
    deti.push(el('div', { class: 'hlaska hlaska--uspech', role: 'status' },
      ikona('fajfka'),
      el('div', { class: 'hlaska__text' },
        el('strong', { text: h('dotaznik.aktivni_nadpis') }),
        h('dotaznik.aktivni'))));
  } else {
    deti.push(el('div', { class: 'hlaska hlaska--uspech', role: 'status' },
      ikona('fajfka'),
      el('div', { class: 'hlaska__text' },
        el('strong', { text: h('dotaznik.narok_nadpis') }),
        prave ? h('dotaznik.odeslano') : h('dotaznik.uz_vyplneno'))));

    deti.push(el('section', { class: 'karta zasobnik', 'aria-labelledby': 'platba-nadpis' },
      el('h2', { id: 'platba-nadpis', text: 'Jak zaplatit' }),
      el('p', { class: 'text-stredni' }, textSOdkazy(PLATBA_TEXT)),
      el('p', { class: 'text-tlumeny', text: h('zamceno.po_platbe', { email: SOS_EMAIL }) })));
  }

  deti.push(el('a', { class: 'tlacitko tlacitko--sekundarni tlacitko--velke tlacitko--cela-sirka', href: 'prehled.html' },
    ikona('sipka-vlevo'), 'Zpět na přehled'));

  const nadpis = el('h1', { tabindex: '-1', text: prave ? h('dotaznik.odeslany_nadpis') : h('dotaznik.vyplneny_nadpis') });
  obsah.removeAttribute('aria-busy');
  obsah.replaceChildren(el('div', { class: 'zasobnik' }, nadpis, ...deti));
  if (prave) nadpis.focus();
  document.title = 'Děkujeme — Spolu na přijímačky';
}

// ---------------------------------------------------------------------
// Formulář
// ---------------------------------------------------------------------

function nastavChybu(fieldset, text) {
  const chybaEl = $(`${fieldset.id}-chyba`);
  if (text) {
    chybaEl.replaceChildren(ikona('pozor'), document.createTextNode(text));
    chybaEl.hidden = false;
    fieldset.setAttribute('aria-invalid', 'true');
  } else {
    chybaEl.hidden = true;
    chybaEl.replaceChildren();
    fieldset.removeAttribute('aria-invalid');
  }
}

/** Posbírá odpovědi; při chybě označí pole, dá fokus na první a vrátí null. */
function posbirej(form) {
  const odpovedi = { verze: 1 };
  let prvni = null;
  for (const [nazev, [idFieldsetu, hlaska]] of Object.entries(POVINNE)) {
    const fieldset = $(idFieldsetu);
    const hodnota = form.querySelector(`input[name="${nazev}"]:checked`)?.value ?? null;
    nastavChybu(fieldset, hodnota ? null : hlaska);
    if (!hodnota && !prvni) prvni = fieldset;
    odpovedi[nazev] = hodnota && CISELNE.has(nazev) ? Number(hodnota) : hodnota;
  }
  if (prvni) {
    prvni.querySelector('input').focus();
    return null;
  }
  odpovedi.co_chybelo = $('d-chybelo').value.trim() || null;
  // pořadí klíčů jako v zadání (čitelnější v adminu)
  const { verze, srozumitelnost_tahaku, delka_lekce, ochota_ditete, rezim, co_chybelo, cena_990 } = odpovedi;
  return { verze, srozumitelnost_tahaku, delka_lekce, ochota_ditete, rezim, co_chybelo, cena_990 };
}

function vykresliFormular(rodina) {
  const sablona = $('sablona-formular').content.cloneNode(true);
  obsah.removeAttribute('aria-busy');
  obsah.replaceChildren(sablona);
  const form = $('formular-dotaznik');

  // po výběru možnosti chybu u otázky schovej
  form.addEventListener('change', (e) => {
    const fieldset = e.target.closest('fieldset[aria-invalid]');
    if (fieldset) nastavChybu(fieldset, null);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const box = $('dotaznik-chyba');
    box.hidden = true;
    const odpovedi = posbirej(form);
    if (!odpovedi) return;

    const tlacitko = form.querySelector('button[type="submit"]');
    tlacitko.disabled = true;
    tlacitko.classList.add('je-nacitani');
    tlacitko.replaceChildren(el('span', { class: 'tocitko', 'aria-hidden': 'true' }), 'Odesílám…');
    try {
      const { odeslatDotaznik } = await import('./supabase.js');
      const { uzOdeslany } = await odeslatDotaznik(odpovedi);
      vykresliPodekovani(rodina, { prave: !uzOdeslany });
      window.scrollTo({ top: 0 });
    } catch (chyba) {
      console.error(chyba);
      box.querySelector('[data-text]').textContent = chyba?.message || h('dotaznik.chyba_odeslani');
      box.hidden = false;
      box.scrollIntoView({ block: 'center', behavior: 'smooth' });
      tlacitko.disabled = false;
      tlacitko.classList.remove('je-nacitani');
      tlacitko.textContent = 'Odeslat dotazník';
    }
  });
}

// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------

async function start() {
  nacitani(obsah, 'Načítám…');
  try {
    const s = await chranStranku();
    if (!s) return; // přesměrování
    napojMenu({ role: false });
    if (s.rodina?.dotaznik_vyplnen) vykresliPodekovani(s.rodina, { prave: false });
    else vykresliFormular(s.rodina);
  } catch (chyba) {
    console.error(chyba);
    chybaStranky(obsah, chyba?.message);
  }
}

start();
