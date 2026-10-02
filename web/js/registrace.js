// =====================================================================
// registrace.js — obrazovka 2 (kostra/04): registrace (Spolu 8: jméno rodiče, e-mail, heslo, jméno dítěte) a přihlášení
//
// - ?prihlaseni=1 otevře přihlášení; ?zpet=<stránka.html…> po přihlášení vrátí (bezpecnyZpet), jinak prehled.html.
// - Registrace posílá údaje 1. dítěte v metadatech, rodinu i dítě zakládá DB trigger (R6).
// - Potvrzení e-mailu je v projektu zapnuté → po registraci obrazovka „Zkontrolujte svůj e-mail".
// - Přihlášený uživatel na této stránce → rovnou dál (volbu role i chybějící dítě řeší přehled).
// - ?obnova=1 otevře „Zapomenuté heslo" (R20): obnovitHeslo(email) → e-mail s odkazem na nove-heslo.html.
// Chyby polí: .pole-chyba (oranžová) + aria-invalid; chyby serveru: .hlaska--varovani nad formulářem.
// Texty: obsah/hlasky.md (ucet.*) přes h().
// =====================================================================

import { el, ikona, param, bezpecnyZpet } from './ui.js';
import { h } from './hlasky.js';

const CIL = bezpecnyZpet(param('zpet'), 'prehled.html');
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** supabase.js se načítá dynamicky, aby šlo ukázat hlášku, když CDN/síť nejde. */
let sb = null;

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------------
// Přepínání Registrace / Přihlášení
// ---------------------------------------------------------------------

const TITULKY = {
  registrace: 'Registrace — Spolu 8',
  prihlaseni: 'Přihlášení — Spolu 8',
  obnova: 'Zapomenuté heslo — Spolu 8',
};

/**
 * Přepne zobrazený formulář a upraví URL (zachová ?zpet=).
 * @param {'registrace'|'prihlaseni'|'obnova'} rezim
 * @param {{fokus?: boolean}} [volby]
 */
function prepni(rezim, { fokus = false } = {}) {
  $('sekce-registrace').hidden = rezim !== 'registrace';
  $('sekce-prihlaseni').hidden = rezim !== 'prihlaseni';
  $('sekce-obnova').hidden = rezim !== 'obnova';
  $('sekce-potvrzeni').hidden = true;
  $('prepinac').hidden = rezim === 'obnova';
  for (const t of document.querySelectorAll('#prepinac [data-rezim]')) {
    t.setAttribute('aria-pressed', String(t.dataset.rezim === rezim));
  }
  document.title = TITULKY[rezim];

  const url = new URL(location.href);
  if (rezim === 'prihlaseni') url.searchParams.set('prihlaseni', '1');
  else url.searchParams.delete('prihlaseni');
  if (rezim === 'obnova') url.searchParams.set('obnova', '1');
  else url.searchParams.delete('obnova');
  history.replaceState(null, '', url.pathname.split('/').pop() + url.search + url.hash);

  if (rezim === 'obnova') {
    if (!$('o-email').value) $('o-email').value = $('p-email').value;
    $('obnova-odeslano').hidden = true;
  }
  if (fokus) ({ prihlaseni: $('p-email'), obnova: $('o-email') }[rezim] || $('r-jmeno')).focus();
}

// ---------------------------------------------------------------------
// Chyby polí a formuláře
// ---------------------------------------------------------------------

/**
 * Ukáže/skryje chybu u pole. `pole` = input nebo fieldset (radio skupina).
 * @param {HTMLElement} pole
 * @param {HTMLElement} chybaEl  .pole-chyba
 * @param {string|null} text     null = skrýt
 */
function nastavChybuPole(pole, chybaEl, text) {
  if (text) {
    chybaEl.replaceChildren(ikona('pozor'), document.createTextNode(text));
    chybaEl.hidden = false;
    pole.setAttribute('aria-invalid', 'true');
  } else {
    chybaEl.hidden = true;
    chybaEl.replaceChildren();
    pole.removeAttribute('aria-invalid');
  }
}

/**
 * Hláška nad formulářem (chyba serveru). akce = volitelná tlačítka/odkazy.
 * @param {HTMLElement} box  .hlaska
 * @param {string|null} text
 * @param {HTMLElement[]} [akce]
 */
function nastavHlasku(box, text, akce = []) {
  if (!text) { box.hidden = true; return; }
  box.querySelector('[data-text]').textContent = text;
  const akceEl = box.querySelector('[data-akce]');
  akceEl.replaceChildren(...akce);
  akceEl.hidden = akce.length === 0;
  box.hidden = false;
  box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function zapniNacitani(tlacitko, text) {
  tlacitko.dataset.puvodni = tlacitko.textContent;
  tlacitko.disabled = true;
  tlacitko.classList.add('je-nacitani');
  tlacitko.replaceChildren(el('span', { class: 'tocitko', 'aria-hidden': 'true' }), text);
}

function vypniNacitani(tlacitko) {
  tlacitko.disabled = false;
  tlacitko.classList.remove('je-nacitani');
  tlacitko.textContent = tlacitko.dataset.puvodni || tlacitko.textContent;
}

/** Hodnota vybraného radio v rámci formuláře, nebo null. */
function radio(form, nazev) {
  return form.querySelector(`input[name="${nazev}"]:checked`)?.value ?? null;
}

async function nactiSupabase() {
  if (sb) return sb;
  sb = await import('./supabase.js');
  return sb;
}

const HLASKA_NENACTENO = h('ucet.nenacteno');

// ---------------------------------------------------------------------
// Registrace
// ---------------------------------------------------------------------

/** Validace registrace. Vrátí data, nebo null (a označí chyby, fokus na první). */
function validujRegistraci(form) {
  const jmeno = $('r-jmeno').value.trim();
  const email = $('r-email').value.trim();
  const heslo = $('r-heslo').value;
  const dite = $('r-dite').value.trim();
  const souhlas = $('r-souhlas').checked;

  const chyby = [
    [$('r-jmeno'), $('r-jmeno-chyba'), jmeno ? null : h('ucet.chyba_jmeno')],
    [$('r-email'), $('r-email-chyba'), !email ? h('ucet.chyba_email_prazdny')
      : RE_EMAIL.test(email) ? null : h('ucet.chyba_email_tvar')],
    [$('r-heslo'), $('r-heslo-chyba'), heslo.length >= 8 ? null
      : heslo.length ? h('ucet.chyba_heslo_kratke_pocet', { n: heslo.length }) : h('ucet.chyba_heslo_kratke')],
    [$('r-dite'), $('r-dite-chyba'), dite ? null : h('ucet.chyba_dite')],
    [$('r-souhlas'), $('r-souhlas-chyba'), souhlas ? null : h('ucet.chyba_souhlas')],
  ];
  let prvni = null;
  for (const [pole, chybaEl, text] of chyby) {
    nastavChybuPole(pole, chybaEl, text);
    if (text && !prvni) prvni = pole;
  }
  if (prvni) {
    (prvni.tagName === 'FIELDSET' ? prvni.querySelector('input') : prvni).focus();
    return null;
  }
  return {
    jmenoRodice: jmeno,
    email,
    heslo,
    zdroj: $('r-odkud').value || null,
    dite: { jmeno: dite }, // Spolu 8: typ školy ani známku nechceme; předměty = výchozí oba (DB)
  };
}

async function odesliRegistraci(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const box = $('registrace-chyba');
  nastavHlasku(box, null);
  const udaje = validujRegistraci(form);
  if (!udaje) return;

  const tlacitko = form.querySelector('button[type="submit"]');
  zapniNacitani(tlacitko, 'Registruji…');
  try {
    const { registrovat } = await nactiSupabase().catch(() => { throw new Error(HLASKA_NENACTENO); });
    const { potvrditEmail } = await registrovat(udaje);
    if (!potvrditEmail) {
      location.replace('prehled.html');
      return;
    }
    // Potvrzení e-mailu: session zatím není → výzva ke kontrole schránky
    $('potvrzeni-email').textContent = udaje.email;
    $('p-email').value = udaje.email;
    form.reset();
    $('sekce-registrace').hidden = true;
    $('prepinac').hidden = true;
    $('sekce-potvrzeni').hidden = false;
    $('potvrzeni-nadpis').focus();
    document.title = 'Zkontrolujte e-mail — Spolu 8';
  } catch (chyba) {
    // Nepoužitelná adresa (email_address_invalid / _not_authorized → prelozChybu) → chyba přímo u pole
    if (chyba?.kod === 'spatny_email') {
      nastavChybuPole($('r-email'), $('r-email-chyba'), chyba.message);
      $('r-email').focus();
      return;
    }
    const akce = [];
    if (chyba?.kod === 'email_existuje') {
      $('p-email').value = udaje.email;
      akce.push(el('button', {
        class: 'tlacitko tlacitko--sekundarni', type: 'button',
        onClick: () => { prepni('prihlaseni'); $('p-heslo').focus(); },
      }, 'Přejít na přihlášení'));
    }
    nastavHlasku(box, chyba?.message || 'Registrace se nepovedla. Zkuste to prosím znovu.', akce);
  } finally {
    vypniNacitani(tlacitko);
  }
}

// ---------------------------------------------------------------------
// Přihlášení
// ---------------------------------------------------------------------

async function odesliPrihlaseni(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const box = $('prihlaseni-chyba');
  nastavHlasku(box, null);

  const email = $('p-email').value.trim();
  const heslo = $('p-heslo').value;
  const chybaEmail = !email ? h('ucet.chyba_email_prazdny') : RE_EMAIL.test(email) ? null : h('ucet.chyba_email_kratce');
  const chybaHeslo = heslo ? null : h('ucet.chyba_heslo_prazdne');
  nastavChybuPole($('p-email'), $('p-email-chyba'), chybaEmail);
  nastavChybuPole($('p-heslo'), $('p-heslo-chyba'), chybaHeslo);
  if (chybaEmail) { $('p-email').focus(); return; }
  if (chybaHeslo) { $('p-heslo').focus(); return; }

  const tlacitko = form.querySelector('button[type="submit"]');
  zapniNacitani(tlacitko, 'Přihlašuji…');
  try {
    const { prihlasit } = await nactiSupabase().catch(() => { throw new Error(HLASKA_NENACTENO); });
    await prihlasit(email, heslo);
    location.replace(CIL);
  } catch (chyba) {
    nastavHlasku(box, chyba?.message || 'Přihlášení se nepovedlo. Zkuste to prosím znovu.');
    vypniNacitani(tlacitko);
  }
}

// ---------------------------------------------------------------------
// Zapomenuté heslo (R20)
// ---------------------------------------------------------------------

async function odesliObnovu(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const box = $('obnova-chyba');
  nastavHlasku(box, null);
  $('obnova-odeslano').hidden = true;

  const email = $('o-email').value.trim();
  const chybaEmail = !email ? h('ucet.chyba_email_prazdny') : RE_EMAIL.test(email) ? null : h('ucet.chyba_email_kratce');
  nastavChybuPole($('o-email'), $('o-email-chyba'), chybaEmail);
  if (chybaEmail) { $('o-email').focus(); return; }

  const tlacitko = form.querySelector('button[type="submit"]');
  zapniNacitani(tlacitko, 'Posílám…');
  try {
    const { obnovitHeslo } = await nactiSupabase().catch(() => { throw new Error(HLASKA_NENACTENO); });
    await obnovitHeslo(email);
    $('obnova-odeslano-nadpis').textContent = h('ucet.obnova_odeslano_nadpis');
    $('obnova-odeslano-text').textContent = h('ucet.obnova_odeslano', { email });
    $('obnova-odeslano').hidden = false;
    $('obnova-odeslano').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  } catch (chyba) {
    if (chyba?.kod === 'spatny_email') {
      nastavChybuPole($('o-email'), $('o-email-chyba'), chyba.message);
      $('o-email').focus();
    } else {
      nastavHlasku(box, chyba?.message || h('chyba.nacteni'));
    }
  } finally {
    vypniNacitani(tlacitko);
  }
}

// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------

function napojZobrazeniHesla() {
  for (const t of document.querySelectorAll('[data-zobrazit-heslo]')) {
    t.addEventListener('click', () => {
      const pole = $(t.dataset.zobrazitHeslo);
      const zobrazit = pole.type === 'password';
      pole.type = zobrazit ? 'text' : 'password';
      t.setAttribute('aria-pressed', String(zobrazit));
      t.querySelector('span').textContent = zobrazit ? 'Skrýt heslo' : 'Zobrazit heslo';
    });
  }
}

/** Po opravě pole chybu hned schovej (ne při každém psaní znovu validuj). */
function napojMazaniChyb() {
  const dvojice = [
    ['r-jmeno', 'r-jmeno-chyba'], ['r-email', 'r-email-chyba'], ['r-heslo', 'r-heslo-chyba'],
    ['r-dite', 'r-dite-chyba'],
    ['r-souhlas', 'r-souhlas-chyba'], ['p-email', 'p-email-chyba'], ['p-heslo', 'p-heslo-chyba'],
    ['o-email', 'o-email-chyba'],
  ];
  for (const [idPole, idChyby] of dvojice) {
    const pole = $(idPole);
    const handler = () => { if (pole.getAttribute('aria-invalid')) nastavChybuPole(pole, $(idChyby), null); };
    pole.addEventListener('input', handler);
    pole.addEventListener('change', handler);
  }
}

async function start() {
  prepni(param('obnova') === '1' ? 'obnova' : param('prihlaseni') === '1' ? 'prihlaseni' : 'registrace');

  for (const t of document.querySelectorAll('#prepinac [data-rezim]')) {
    t.addEventListener('click', () => prepni(t.dataset.rezim));
  }
  for (const odkaz of document.querySelectorAll('[data-prepnout]')) {
    odkaz.addEventListener('click', (e) => {
      e.preventDefault();
      prepni(odkaz.dataset.prepnout, { fokus: true });
    });
  }
  napojZobrazeniHesla();
  napojMazaniChyb();
  $('formular-registrace').addEventListener('submit', odesliRegistraci);
  $('formular-prihlaseni').addEventListener('submit', odesliPrihlaseni);
  $('formular-obnova').addEventListener('submit', odesliObnovu);

  // Už přihlášený → rovnou dál
  try {
    const { aktualniUzivatel } = await nactiSupabase();
    if (await aktualniUzivatel()) location.replace(CIL);
  } catch (chyba) {
    console.error(chyba);
    const box = $('sekce-prihlaseni').hidden ? $('registrace-chyba') : $('prihlaseni-chyba');
    nastavHlasku(box, HLASKA_NENACTENO);
  }
}

start();
