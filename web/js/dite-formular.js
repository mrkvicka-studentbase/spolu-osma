// =====================================================================
// dite-formular.js — modal „Přidat druhé dítě" / „Přidejte profil dítěte" (QA B1)
//
// Stejná pole a komponenty jako registrace (křestní jméno, typ školy, známka 1–5).
// Uloží přes pridatDite() (supabase.js; max 2 děti hlídá DB trigger + RLS).
// Použití (prehled.js):
//   const dite = await otevritPridaniDitete({ prvni: deti.length === 0 });  // null = zavřeno
//
// Předměty dítěte (ZADANI-CESTINA §8.2, deti.predmety z migrace 0007): zaškrtávátka Matematika / Čeština,
// aspoň jeden. Jen když řádky dětí z DB sloupec `predmety` mají (= migrace proběhla, maSloupecPredmety);
// jinak se formulář nemění a `predmety` se do DB neposílají (sloupec by neexistoval).
//   otevritPridaniDitete({ prvni, predmety: true })       // + zaškrtávátka (výchozí Matematika)
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

/** Skupina radio voleb `.volby` (stejné komponenty jako registrace.html). */
function volby(id, legenda, nazev, moznosti, trida = '') {
  return el('fieldset', { class: ['volby', trida], id, 'aria-describedby': `${id}-chyba` },
    el('legend', { text: legenda }),
    moznosti.map(([hodnota, text]) => el('label', { class: 'volba' },
      el('input', { class: 'volba__vstup', type: 'radio', name: nazev, value: hodnota }),
      el('span', { class: 'volba__obsah', text }))));
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
 * @param {{prvni?: boolean, predmety?: boolean}} [volby]  prvni = rodina nemá žádné dítě (jiný nadpis a text);
 *   predmety = ukázat volbu předmětů (jen po migraci 0007)
 * @returns {Promise<import('./supabase.js').Dite|null>}  null = zavřeno bez uložení
 */
export function otevritPridaniDitete({ prvni = false, predmety = false } = {}) {
  const p = `dite${++citac}`;
  const jmeno = el('input', { class: 'pole', id: `${p}-jmeno`, maxlength: '50', autocomplete: 'off', 'aria-describedby': `${p}-jmeno-chyba` });
  const skola = volby(`${p}-skola`, 'Na jakou školu se hlásí?', `${p}-typ_skoly`, [['gymnazium', 'Gymnázium'], ['ss_maturita', 'SŠ s maturitou']]);
  const znamka = volby(`${p}-znamka`, 'Známka z matematiky na konci 8. třídy', `${p}-znamka`,
    [1, 2, 3, 4, 5].map((n) => [String(n), String(n)]), 'volby--stupnice');
  const chyba = (id) => el('p', { class: 'pole-chyba', id: `${id}-chyba`, hidden: true });
  const chJmeno = chyba(`${p}-jmeno`);
  const chSkola = chyba(`${p}-skola`);
  const chZnamka = chyba(`${p}-znamka`);
  const predm = predmety ? volbyPredmetu(`${p}-predmety`, `${p}-predmety`, ['matematika']) : null;
  const chPredmety = predm ? chyba(`${p}-predmety`) : null;
  const chybaFormu = el('div', { class: 'hlaska hlaska--varovani', role: 'alert', hidden: true },
    ikona('pozor'), el('div', { class: 'hlaska__text' }, el('strong')));
  const odeslat = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'submit' }, h('dite.ulozit'));

  const form = el('form', { class: 'formular', novalidate: true },
    el('p', { class: 'text-tlumeny', text: prvni ? h('prazdny.deti') : h('dite.pridat_text') }),
    chybaFormu,
    el('div', { class: 'pole-skupina' },
      el('label', { class: 'pole-popisek', for: `${p}-jmeno`, text: 'Křestní jméno dítěte' }), jmeno, chJmeno),
    el('div', { class: 'pole-skupina' }, skola, chSkola),
    el('div', { class: 'pole-skupina' }, znamka, chZnamka),
    predm ? el('div', { class: 'pole-skupina' }, predm.uzel, chPredmety) : null,
    odeslat);

  const nadpisId = `${p}-nadpis`;
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': nadpisId },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: nadpisId, text: prvni ? h('dite.prvni_nadpis') : h('dite.pridat_nadpis') }),
      el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit', type: 'button', 'aria-label': 'Zavřít' }, ikona('krizek')),
      form));
  document.body.append(dialog);

  let nove = null;
  const vybrano = (nazev) => form.querySelector(`input[name="${nazev}"]:checked`)?.value ?? null;
  jmeno.addEventListener('input', () => nastavChybu(jmeno, chJmeno, null));
  skola.addEventListener('change', () => nastavChybu(skola, chSkola, null));
  znamka.addEventListener('change', () => nastavChybu(znamka, chZnamka, null));
  predm?.uzel.addEventListener('change', () => nastavChybu(predm.uzel, chPredmety, null));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    chybaFormu.hidden = true;
    const hodnoty = { jmeno: jmeno.value.trim(), typSkoly: vybrano(`${p}-typ_skoly`), znamka: vybrano(`${p}-znamka`) };
    const chyby = [
      [jmeno, chJmeno, hodnoty.jmeno ? null : h('ucet.chyba_dite')],
      [skola, chSkola, hodnoty.typSkoly ? null : h('ucet.chyba_skola')],
      [znamka, chZnamka, hodnoty.znamka ? null : h('ucet.chyba_znamka')],
    ];
    if (predm) chyby.push([predm.uzel, chPredmety, predm.hodnota().length ? null : h('dite.predmety_chyba')]);
    let prvniChyba = null;
    for (const [pole, chybaEl, text] of chyby) {
      nastavChybu(pole, chybaEl, text);
      if (text && !prvniChyba) prvniChyba = pole;
    }
    if (prvniChyba) { (prvniChyba.tagName === 'FIELDSET' ? prvniChyba.querySelector('input') : prvniChyba).focus(); return; }

    odeslat.disabled = true;
    odeslat.classList.add('je-nacitani');
    try {
      nove = await pridatDite({
        jmeno: hodnoty.jmeno, typSkoly: hodnoty.typSkoly, znamka8: Number(hodnoty.znamka),
        ...(predm ? { predmety: predm.hodnota() } : {}), // bez migrace 0007 se sloupec neposílá
      });
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
 * Formulář „Předměty: {jméno}“ — úprava deti.predmety (jen po migraci 0007; volající to ověří přes maSloupecPredmety).
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
