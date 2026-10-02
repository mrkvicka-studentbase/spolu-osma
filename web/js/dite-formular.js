// =====================================================================
// dite-formular.js — modal „Přidat druhé dítě" / „Přidejte profil dítěte" (QA B1)
//
// Spolu 8: křestní jméno a předměty (zaškrtávátka Matematika / Čeština, výchozí obě, aspoň jeden).
// Typ školy ani známku nechceme (sloupce v DB zůstaly, plní se null). Uloží přes pridatDite()
// (supabase.js; max 2 děti hlídá DB trigger + RLS).
// Použití (prehled.js):
//   const dite = await otevritPridaniDitete({ prvni: deti.length === 0 });  // null = zavřeno
//   const d = await otevritPredmetyDitete(dite);          // úprava předmětů existujícího dítěte; null = zavřeno
// =====================================================================

import { el, ikona, otevritModal, zavritModal, toast } from './ui.js';
import { h } from './hlasky.js';
import { pridatDite, upravitDite } from './supabase.js';
import { PREDMETY, predmetyDitete } from './predmet.js';

let citac = 0;

function nastavChybu(pole, chybaEl, text) {
  chybaEl.hidden = !text;
  chybaEl.replaceChildren(...(text ? [ikona('pozor'), document.createTextNode(text)] : []));
  if (text) pole.setAttribute('aria-invalid', 'true');
  else pole.removeAttribute('aria-invalid');
}

/**
 * Zaškrtávátka předmětů (`.volby` s checkboxy — stejné komponenty jako radio volby).
 * @returns {{uzel: HTMLFieldSetElement, hodnota: () => string[]}}
 */
function volbyPredmetu(id, nazev, vybrane) {
  const uzel = el('fieldset', { class: 'volby', id, 'aria-describedby': `${id}-chyba` },
    el('legend', { text: h('dite.predmety_legenda') }),
    PREDMETY.map((p) => el('label', { class: 'volba' },
      el('input', { class: 'volba__vstup', type: 'checkbox', name: nazev, value: p, checked: vybrane.includes(p) }),
      el('span', { class: 'volba__obsah', text: h(`predmet.${p}`) }))));
  const hodnota = () => [...uzel.querySelectorAll('input:checked')].map((x) => x.value);
  return { uzel, hodnota };
}

/**
 * Otevře formulář a po úspěšném uložení vrátí nové dítě.
 * @param {{prvni?: boolean}} [volby]  prvni = rodina nemá žádné dítě (jiný nadpis a text)
 * @returns {Promise<import('./supabase.js').Dite|null>}  null = zavřeno bez uložení
 */
export function otevritPridaniDitete({ prvni = false } = {}) {
  const p = `dite${++citac}`;
  const jmeno = el('input', { class: 'pole', id: `${p}-jmeno`, maxlength: '50', autocomplete: 'off', 'aria-describedby': `${p}-jmeno-chyba` });
  const chyba = (id) => el('p', { class: 'pole-chyba', id: `${id}-chyba`, hidden: true });
  const chJmeno = chyba(`${p}-jmeno`);
  const predm = volbyPredmetu(`${p}-predmety`, `${p}-predmety`, ['matematika', 'cestina']);
  const chPredmety = chyba(`${p}-predmety`);
  const chybaFormu = el('div', { class: 'hlaska hlaska--varovani', role: 'alert', hidden: true },
    ikona('pozor'), el('div', { class: 'hlaska__text' }, el('strong')));
  const odeslat = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'submit' }, h('dite.ulozit'));

  const form = el('form', { class: 'formular', novalidate: true },
    el('p', { class: 'text-tlumeny', text: prvni ? h('prazdny.deti') : h('dite.pridat_text') }),
    chybaFormu,
    el('div', { class: 'pole-skupina' },
      el('label', { class: 'pole-popisek', for: `${p}-jmeno`, text: 'Křestní jméno dítěte' }), jmeno, chJmeno),
    el('div', { class: 'pole-skupina' }, predm.uzel, chPredmety),
    odeslat);

  const nadpisId = `${p}-nadpis`;
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': nadpisId },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: nadpisId, text: prvni ? h('dite.prvni_nadpis') : h('dite.pridat_nadpis') }),
      el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit', type: 'button', 'aria-label': 'Zavřít' }, ikona('krizek')),
      form));
  document.body.append(dialog);

  let nove = null;
  jmeno.addEventListener('input', () => nastavChybu(jmeno, chJmeno, null));
  predm.uzel.addEventListener('change', () => nastavChybu(predm.uzel, chPredmety, null));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    chybaFormu.hidden = true;
    const hodnoty = { jmeno: jmeno.value.trim() };
    const chyby = [
      [jmeno, chJmeno, hodnoty.jmeno ? null : h('ucet.chyba_dite')],
      [predm.uzel, chPredmety, predm.hodnota().length ? null : h('dite.predmety_chyba')],
    ];
    let prvniChyba = null;
    for (const [pole, chybaEl, text] of chyby) {
      nastavChybu(pole, chybaEl, text);
      if (text && !prvniChyba) prvniChyba = pole;
    }
    if (prvniChyba) { (prvniChyba.tagName === 'FIELDSET' ? prvniChyba.querySelector('input') : prvniChyba).focus(); return; }

    odeslat.disabled = true;
    odeslat.classList.add('je-nacitani');
    try {
      nove = await pridatDite({ jmeno: hodnoty.jmeno, predmety: predm.hodnota() });
      toast(h('dite.pridano', { jmeno: nove.krestni_jmeno }));
      zavritModal(dialog, 'ok');
    } catch (chybaUlozeni) {
      console.error(chybaUlozeni);
      chybaFormu.querySelector('strong').textContent = chybaUlozeni?.kod === 'max_2_deti'
        ? h('dite.max_2') : (chybaUlozeni?.message || h('chyba.ulozeni'));
      chybaFormu.hidden = false;
    } finally {
      odeslat.disabled = false;
      odeslat.classList.remove('je-nacitani');
    }
  });

  const vysledek = otevritModal(dialog).then(() => { dialog.remove(); return nove; });
  jmeno.focus();
  return vysledek;
}

/**
 * Formulář „Předměty: {jméno}“ — úprava deti.predmety.
 * @param {import('./supabase.js').Dite} dite
 * @returns {Promise<import('./supabase.js').Dite|null>}  uložené dítě, null = zavřeno bez uložení
 */
export function otevritPredmetyDitete(dite) {
  const p = `predmety${++citac}`;
  const predm = volbyPredmetu(`${p}-volby`, `${p}-volby`, predmetyDitete(dite));
  const chPredmety = el('p', { class: 'pole-chyba', id: `${p}-volby-chyba`, hidden: true });
  const chybaFormu = el('div', { class: 'hlaska hlaska--varovani', role: 'alert', hidden: true },
    ikona('pozor'), el('div', { class: 'hlaska__text' }, el('strong')));
  const odeslat = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'submit' }, h('dite.predmety_ulozit'));
  const form = el('form', { class: 'formular', novalidate: true },
    el('p', { class: 'text-tlumeny', text: h('dite.predmety_text', { jmeno: dite.krestni_jmeno }) }),
    chybaFormu,
    el('div', { class: 'pole-skupina' }, predm.uzel, chPredmety),
    odeslat);
  const nadpisId = `${p}-nadpis`;
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': nadpisId },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: nadpisId, text: h('dite.predmety_nadpis', { jmeno: dite.krestni_jmeno }) }),
      el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit', type: 'button', 'aria-label': 'Zavřít' }, ikona('krizek')),
      form));
  document.body.append(dialog);

  let ulozene = null;
  predm.uzel.addEventListener('change', () => nastavChybu(predm.uzel, chPredmety, null));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    chybaFormu.hidden = true;
    const vybrane = predm.hodnota();
    if (!vybrane.length) {
      nastavChybu(predm.uzel, chPredmety, h('dite.predmety_chyba'));
      predm.uzel.querySelector('input').focus();
      return;
    }
    odeslat.disabled = true;
    odeslat.classList.add('je-nacitani');
    try {
      ulozene = await upravitDite(dite.id, { predmety: vybrane });
      toast(h('dite.predmety_ulozeno'));
      zavritModal(dialog, 'ok');
    } catch (chybaUlozeni) {
      console.error(chybaUlozeni);
      chybaFormu.querySelector('strong').textContent = chybaUlozeni?.message || h('chyba.ulozeni');
      chybaFormu.hidden = false;
    } finally {
      odeslat.disabled = false;
      odeslat.classList.remove('je-nacitani');
    }
  });

  const vysledek = otevritModal(dialog).then(() => { dialog.remove(); return ulozene; });
  predm.uzel.querySelector('input').focus();
  return vysledek;
}
