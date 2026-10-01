// =====================================================================
// nove-heslo.js — nové heslo po odkazu z e-mailu (R20)
//
// Jak to funguje (ověřeno v @supabase/auth-js 2.116, GoTrueClient._initialize):
// - Klient má flowType 'implicit' (výchozí) a detectSessionInUrl: true (supabase.js).
// - Odkaz z e-mailu vede přes Supabase /verify sem s `#access_token=…&type=recovery`.
//   Klient při inicializaci session z URL uloží, hash smaže a vyšle událost PASSWORD_RECOVERY.
// - Chyba v odkazu (vypršel, už použitý) přijde jako `#error=…&error_code=otp_expired…` — hash
//   se nemaže, session nevznikne. Proto hash čteme DŘÍV, než se supabase.js načte (dynamický import).
// - Stránka funguje i po obnovení (session už je v localStorage) — pak prostě nastaví heslo přihlášenému.
// =====================================================================

import { el, ikona, toast } from './ui.js';
import { h } from './hlasky.js';

const $ = (id) => document.getElementById(id);
const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
const chybaVOdkazu = hash.get('error_code') || hash.get('error');

function nastavChybuPole(pole, chybaEl, text) {
  chybaEl.hidden = !text;
  chybaEl.replaceChildren(...(text ? [ikona('pozor'), document.createTextNode(text)] : []));
  if (text) pole.setAttribute('aria-invalid', 'true');
  else pole.removeAttribute('aria-invalid');
}

function ukazNeplatny() {
  $('nacitani').hidden = true;
  $('neplatny-text').textContent = h('ucet.odkaz_neplatny');
  $('sekce-neplatny').hidden = false;
}

function ukazFormular(uzivatel) {
  $('nacitani').hidden = true;
  $('nove-heslo-ucet').textContent = uzivatel?.email ? `Účet: ${uzivatel.email}` : '';
  $('sekce-formular').hidden = false;
  $('n-heslo').focus();
}

async function ulozit(e, sb) {
  e.preventDefault();
  const heslo = $('n-heslo').value;
  const heslo2 = $('n-heslo2').value;
  const chyba1 = heslo.length >= 8 ? null
    : heslo.length ? h('ucet.chyba_heslo_kratke_pocet', { n: heslo.length }) : h('ucet.chyba_heslo_kratke');
  const chyba2 = !chyba1 && heslo !== heslo2 ? h('ucet.chyba_hesla_neshoda') : null;
  nastavChybuPole($('n-heslo'), $('n-heslo-chyba'), chyba1);
  nastavChybuPole($('n-heslo2'), $('n-heslo2-chyba'), chyba2);
  if (chyba1) { $('n-heslo').focus(); return; }
  if (chyba2) { $('n-heslo2').focus(); return; }

  const box = $('heslo-chyba');
  box.hidden = true;
  const tlacitko = e.currentTarget.querySelector('button[type="submit"]');
  tlacitko.disabled = true;
  tlacitko.classList.add('je-nacitani');
  try {
    await sb.nastavitHeslo(heslo);
    const ok = $('heslo-ok');
    ok.querySelector('[data-text]').textContent = h('ucet.nove_heslo_ulozeno');
    ok.hidden = false;
    toast(h('chyba.ulozeni_ok'));
    setTimeout(() => location.replace('prehled.html'), 1500);
  } catch (chyba) {
    box.querySelector('[data-text]').textContent = chyba?.message || h('chyba.nacteni');
    box.hidden = false;
    tlacitko.disabled = false;
    tlacitko.classList.remove('je-nacitani');
    if (chyba?.kod === 'neprihlasen') ukazNeplatny();
  }
}

function napojZobrazeniHesla() {
  const t = $('n-zobrazit');
  t.addEventListener('click', () => {
    const zobrazit = $('n-heslo').type === 'password';
    for (const id of ['n-heslo', 'n-heslo2']) $(id).type = zobrazit ? 'text' : 'password';
    t.setAttribute('aria-pressed', String(zobrazit));
    t.querySelector('span').textContent = zobrazit ? 'Skrýt heslo' : 'Zobrazit heslo';
  });
}

async function start() {
  napojZobrazeniHesla();
  let sb;
  try {
    sb = await import('./supabase.js');
  } catch (e) {
    console.error(e);
    $('nacitani').replaceWith(el('div', { class: 'hlaska hlaska--varovani', role: 'alert' },
      el('div', { class: 'hlaska__text', text: h('ucet.nenacteno') })));
    return;
  }
  if (chybaVOdkazu) { ukazNeplatny(); return; }
  // getSession() počká, až klient dokončí inicializaci (včetně session z URL)
  const { data } = await sb.supabase.auth.getSession();
  const uzivatel = data?.session?.user;
  if (!uzivatel) { ukazNeplatny(); return; }
  $('formular-heslo').addEventListener('submit', (e) => ulozit(e, sb));
  for (const id of ['n-heslo', 'n-heslo2']) {
    $(id).addEventListener('input', () => nastavChybuPole($(id), $(`${id}-chyba`), null));
  }
  ukazFormular(uzivatel);
}

start();
