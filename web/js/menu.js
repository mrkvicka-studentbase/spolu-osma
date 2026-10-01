// =====================================================================
// menu.js — společné menu v hlavičce přihlášených stránek (prehled, lekce, rodic, dotaznik)
// + textové modaly pro rodiče: manuál „Jak vést lekci" a slovníček „Jak číst zápisy nahlas".
//
// HTML stránky obsahuje jen hlavičku s logem (odkaz na prehled.html):
//   <header class="hlavicka"><div class="hlavicka__vnitrek"><a class="logo" href="prehled.html">…</a></div></header>
// napojMenu() do ní přidá tlačítko „Menu" a <dialog class="modal"> s položkami:
//   přepínač role zařízení (role.js) · Jak vést lekci + Jak číst zápisy nahlas (jen rodič)
//   · Zpět na přehled · Vzhled (Světlý / Tmavý / Podle zařízení, R26) · Odhlásit se
// Přepínač motivu jen vykreslí tlačítka [data-motiv-nastav]; kliknutí a uložení (localStorage
// `spolu.motiv`) obsluhuje inline skript motivu v <head> každé stránky (window.spoluMotiv).
// Texty modalů: web/js/manual.js a web/js/cteni-zapisu.js (generuje nastroje/generuj-hlasky.mjs).
// Čeština (KONTROLA-2026-09-30 C4): stránka zavolá nastavPredmet('cestina') → manuál z web/js/manual-cj.js
// (zdroj cestina/Obsah/manual-rodice-cj.md), bez „Jak číst zápisy nahlas“ (to je matematika), vlastní
// „přečteno“ v localStorage a „Zpět na přehled“ vede na záložku Čeština. Bez volání = matematika jako dřív.
// =====================================================================

import { el, ikona, otevritModal, zavritModal } from './ui.js';
import { h } from './hlasky.js';
import { ziskejRoli, prepinacRole } from './role.js';
import { nacistKnihovny, renderMarkdown, renderManual } from './obsah.js';
import { MANUAL_NADPIS, MANUAL_MD } from './manual.js';
import { MANUAL_CJ_NADPIS, MANUAL_CJ_MD } from './manual-cj.js';
import { CTENI_NADPIS, CTENI_MD } from './cteni-zapisu.js';
import { vytvorOsuSezony } from './osa-sezony.js';

const KLIC_MANUAL = 'spolu.manual-precteno';
const KLIC_MANUAL_CJ = 'spolu.manual-precteno.cestina';

let predmetStranky = 'matematika';
let odkazPrehled = null; // „Zpět na přehled“ v menu (jedno menu na stránku)

const jeCestina = () => predmetStranky === 'cestina';
const adresaPrehledu = () => (jeCestina() ? 'prehled.html?predmet=cestina' : 'prehled.html');

/**
 * Předmět stránky pro manuál a menu ('matematika' | 'cestina'; jiné = matematika).
 * Volá přehled podle záložky, rodic.js / lekce.js podle načtené lekce (predmetLekce z predmet.js).
 * @param {string} predmet
 */
export function nastavPredmet(predmet) {
  predmetStranky = predmet === 'cestina' ? 'cestina' : 'matematika';
  if (odkazPrehled) odkazPrehled.href = adresaPrehledu();
}

// ---------------------------------------------------------------------
// Textové modaly (Markdown + KaTeX)
// ---------------------------------------------------------------------

const modaly = new Map(); // id → dialog

/**
 * Modal s Markdown textem; vytvoří se při prvním otevření. Když CDN knihovny nejdou načíst,
 * ukáže text bez formátování (lepší než nic).
 * @param {{id: string, nadpis: string, md: string, rozumim?: boolean, dalsi?: Element|null,
 *   render?: (md: string) => Node, trida?: string}} volby  render: výchozí renderMarkdown (manuál: renderManual, H1)
 * @returns {Promise<string>}
 */
async function otevritTextovyModal({ id, nadpis, md, rozumim = false, dalsi = null, render = renderMarkdown, trida = '' }) {
  let dialog = modaly.get(id);
  if (!dialog) {
    const obsah = el('div', { class: ['zasobnik', 'modal__markdown', trida] });
    try {
      await nacistKnihovny();
      obsah.append(render(md));
    } catch (e) {
      console.error(e);
      obsah.append(el('p', { text: md.replace(/\*\*|\$|==|^:::.*$/gm, '') }));
    }
    const akce = [];
    if (dalsi) akce.push(dalsi);
    if (rozumim) {
      akce.push(el('button', {
        class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => zavritModal(dialog, 'ok'),
      }, 'Rozumím'));
    }
    dialog = el('dialog', { class: 'modal', id, 'aria-labelledby': `${id}Nadpis` },
      el('div', { class: 'modal__panel' },
        el('h2', { class: 'modal__nadpis', id: `${id}Nadpis`, text: nadpis }),
        el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit', type: 'button', 'aria-label': 'Zavřít' }, ikona('krizek')),
        obsah,
        akce.length ? el('div', { class: 'modal__akce' }, akce) : null));
    document.body.append(dialog);
    modaly.set(id, dialog);
  }
  return otevritModal(dialog);
}

/** Slovníček „Jak číst zápisy nahlas" (obsah/cteni-zapisu.md). */
export function otevritCteni() {
  return otevritTextovyModal({ id: 'modalCteni', nadpis: CTENI_NADPIS, md: CTENI_MD });
}

/**
 * Manuál rodiče (obsah/manual-rodice.md) s tlačítkem „Rozumím" a odkazem na slovníček.
 * U češtiny (nastavPredmet) manuál cestina/Obsah/manual-rodice-cj.md bez slovníčku zápisů.
 * Zapamatuje si, že ho rodič viděl (localStorage) — viz manualPrecteny().
 */
export function otevritManual() {
  if (jeCestina()) {
    try { localStorage.setItem(KLIC_MANUAL_CJ, '1'); } catch { /* nevadí */ }
    return otevritTextovyModal({
      id: 'modalManualCj', nadpis: MANUAL_CJ_NADPIS, md: MANUAL_CJ_MD, rozumim: true, render: renderManual, trida: 'manual',
    });
  }
  try { localStorage.setItem(KLIC_MANUAL, '1'); } catch { /* nevadí */ }
  const odkazCteni = el('button', {
    class: 'tlacitko tlacitko--sekundarni', type: 'button',
    onClick: () => { zavritModal(modaly.get('modalManual')); otevritCteni(); },
  }, ikona('bublina'), h('rodic.cteni_zapisu'));
  return otevritTextovyModal({
    id: 'modalManual', nadpis: MANUAL_NADPIS, md: MANUAL_MD, rozumim: true, dalsi: odkazCteni, render: renderManual, trida: 'manual',
  });
}

/** Viděl už rodič na tomto zařízení manuál (předmětu stránky)? @returns {boolean} */
export function manualPrecteny() {
  try { return localStorage.getItem(jeCestina() ? KLIC_MANUAL_CJ : KLIC_MANUAL) === '1'; } catch { return false; }
}

// ---------------------------------------------------------------------
// Přepínač motivu (R26)
// ---------------------------------------------------------------------

/**
 * Segmentový přepínač Světlý / Tmavý / Podle zařízení. Stav (aria-pressed) nastaví
 * window.spoluMotiv.pouzij() z inline skriptu v <head>; bez něj přepínač nic nedělá.
 * @returns {HTMLElement}
 */
export function prepinacMotivu() {
  const volba = window.spoluMotiv?.volba?.() || 'auto';
  return el('div', { class: 'prepinac prepinac--motiv', role: 'group', 'aria-label': 'Vzhled' },
    [['svetly', 'Světlý'], ['tmavy', 'Tmavý'], ['auto', 'Podle zařízení']].map(([hodnota, text]) => el('button', {
      class: 'prepinac__volba', type: 'button', 'aria-pressed': String(volba === hodnota), dataset: { motivNastav: hodnota },
    }, text)));
}

// ---------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------

/**
 * Přidá do hlavičky tlačítko Menu a vytvoří dialog menu.
 * @param {Object} [volby]
 * @param {Element} [volby.hlavicka]      kam tlačítko vložit; výchozí první `.hlavicka__vnitrek`
 * @param {boolean} [volby.role=true]     ukázat přepínač role zařízení
 * @param {(role: 'rodic'|'zak') => void} [volby.poZmeneRole]  jen mimo lekce.html/rodic.html (tam role.js přepne stránku sama)
 * @param {boolean} [volby.prehled=true]  položka „Zpět na přehled" (na prehled.html false)
 * @returns {{otevrit: () => Promise<string>, dialog: HTMLDialogElement}}
 */
export function napojMenu({ hlavicka, role = true, poZmeneRole, prehled = true } = {}) {
  const cil = hlavicka || document.querySelector('.hlavicka__vnitrek');
  const slotRole = el('div');
  const btnManual = el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button' }, ikona('kniha'), 'Jak vést lekci');
  const btnCteni = el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button' }, ikona('bublina'), h('rodic.cteni_zapisu'));
  const btnOdhlasit = el('button', { class: 'tlacitko tlacitko--tiche', type: 'button' }, 'Odhlásit se');

  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': 'modalMenuNadpis' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'modalMenuNadpis', text: 'Menu' }),
      el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit', type: 'button', 'aria-label': 'Zavřít' }, ikona('krizek')),
      el('div', { class: 'zasobnik' },
        role ? el('p', { class: 'text-tlumeny', text: 'Toto zařízení používá:' }) : null,
        role ? slotRole : null,
        btnManual, btnCteni,
        prehled ? (odkazPrehled = el('a', { class: 'tlacitko tlacitko--sekundarni', href: adresaPrehledu() }, ikona('sipka-vlevo'), 'Zpět na přehled')) : null,
        el('p', { class: 'text-tlumeny', text: 'Vzhled:' }),
        prepinacMotivu(),
        btnOdhlasit)));
  document.body.append(dialog);

  const otevrit = () => {
    if (role) {
      // přepínač vždy znovu — role se mohla změnit jinde na stránce (volba role v přehledu)
      slotRole.replaceChildren();
      prepinacRole(slotRole, poZmeneRole ? { poZmene: (r) => { zavritModal(dialog); poZmeneRole(r); } } : {});
    }
    const jeRodic = ziskejRoli() === 'rodic';
    btnManual.hidden = !jeRodic;
    btnCteni.hidden = !jeRodic || jeCestina(); // zápisy matematiky u češtiny nedávají smysl
    window.spoluMotiv?.pouzij?.(); // aria-pressed přepínače motivu podle aktuální volby
    return otevritModal(dialog);
  };

  btnManual.addEventListener('click', () => { zavritModal(dialog); otevritManual(); });
  btnCteni.addEventListener('click', () => { zavritModal(dialog); otevritCteni(); });
  btnOdhlasit.addEventListener('click', async () => {
    btnOdhlasit.disabled = true;
    btnOdhlasit.classList.add('je-nacitani');
    try {
      const { odhlasit } = await import('./supabase.js');
      await odhlasit();
    } catch (e) {
      console.error(e);
    }
    location.href = 'registrace.html?prihlaseni=1';
  });

  // R63 (Pavel 30. 9.): časová osa sezóny v hlavičce mezi „Spolu na přijímačky" a menu
  if (cil && !cil.querySelector('.osa-sezony')) cil.append(vytvorOsuSezony());
  cil?.append(el('button', {
    class: 'tlacitko tlacitko--na-tmave tlacitko--ikona', type: 'button', 'aria-label': 'Menu', 'aria-haspopup': 'dialog',
    onClick: () => otevrit(),
  }, ikona('menu')));

  return { otevrit, dialog };
}
