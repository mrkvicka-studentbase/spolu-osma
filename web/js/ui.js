// =====================================================================
// ui.js — sdílené DOM helpery pro všechny stránky (R2, R3)
//
// - Při importu nesahá na DOM ani na síť → modul jde importovat i v Node (testy formatCislo, formatDatum…).
// - supabase.js se načítá až uvnitř napojFrontuUkladani() a chranStranku() (dynamický import),
//   stránky ho ale klidně importují samy — instance klienta je jedna (cache modulů).
// - Texty pro uživatele bere z hlasky.js.
// Třídy komponent: web/DESIGN.md.
// =====================================================================

import { h } from './hlasky.js';

// ---------------------------------------------------------------------
// el() — tvorba DOM
// ---------------------------------------------------------------------

/**
 * Hodnota potomka pro el(): text, uzel, pole (zploští se); null/undefined/false se ignoruje.
 * @typedef {string|number|Node|null|undefined|false|Array<PotomekEl>} PotomekEl
 */

/**
 * Vytvoří HTML element.
 *
 * Atributy (objekt, může být null):
 * - `class`: string nebo pole (falsy položky se vynechají) → `el('div', {class: ['krok', hotovy && 'krok--hotovy']})`
 * - `text`: textContent (bezpečné; přepíše děti)
 * - `htmlBezpecne`: innerHTML — JEN pro HTML, které je bezpečné (výstup renderMarkdown/KaTeX, vlastní konstanty).
 *   Nikdy nevkládej text od uživatele ani z DB bez sanitizace.
 * - `on<Udalost>`: posluchač, např. `onClick`, `onInput`, `onKeydown` → addEventListener('click', …)
 * - `dataset`: objekt → data-* (`{dataset: {id: 'a'}}` → `data-id="a"`)
 * - `aria-*`, `role`, `id`, `href`, `type`, … : setAttribute (hodnota převedena na string)
 * - boolean atributy: `true` → atribut bez hodnoty (`disabled`, `hidden`, `required`), `false`/null/undefined → vynechá se.
 *   Pozor: `aria-pressed` a jiné aria-* s hodnotou true/false předávej jako string ('true'/'false').
 * - `value`, `checked`, `selected`: nastaví se jako vlastnost (property) prvku.
 *
 * @param {string} tag  název tagu, např. 'button'
 * @param {Object<string, any>|null} [atributy]
 * @param {...PotomekEl} deti
 * @returns {HTMLElement}
 * @example
 * el('button', {class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => ulozit()}, ikona('fajfka'), 'Uložit')
 */
export function el(tag, atributy = null, ...deti) {
  const uzel = document.createElement(tag);
  nastavAtributy(uzel, atributy);
  pridejDeti(uzel, deti);
  return uzel;
}

function nastavAtributy(uzel, atributy) {
  if (!atributy) return;
  for (const [nazev, hodnota] of Object.entries(atributy)) {
    if (hodnota === undefined || hodnota === null || hodnota === false) continue;
    if (nazev === 'class') {
      const tridy = Array.isArray(hodnota) ? hodnota.filter(Boolean).join(' ') : String(hodnota);
      if (tridy) uzel.setAttribute('class', tridy);
    } else if (nazev === 'text') {
      uzel.textContent = String(hodnota);
    } else if (nazev === 'htmlBezpecne') {
      uzel.innerHTML = String(hodnota);
    } else if (nazev === 'dataset') {
      for (const [k, v] of Object.entries(hodnota)) if (v !== undefined && v !== null) uzel.dataset[k] = String(v);
    } else if (/^on[A-Z]/.test(nazev) && typeof hodnota === 'function') {
      uzel.addEventListener(nazev.slice(2).toLowerCase(), hodnota);
    } else if (nazev === 'value' || nazev === 'checked' || nazev === 'selected') {
      uzel[nazev] = hodnota;
    } else if (hodnota === true) {
      uzel.setAttribute(nazev, '');
    } else {
      uzel.setAttribute(nazev, String(hodnota));
    }
  }
}

function pridejDeti(uzel, deti) {
  for (const d of deti) {
    if (d === null || d === undefined || d === false || d === true) continue;
    if (Array.isArray(d)) pridejDeti(uzel, d);
    else if (typeof d === 'string' || typeof d === 'number') uzel.append(document.createTextNode(String(d)));
    else uzel.append(d);
  }
}

// ---------------------------------------------------------------------
// Ikony (tabulka v web/DESIGN.md)
// ---------------------------------------------------------------------

/** Cesty ikon (viewBox 0 0 24 24). Názvy dle DESIGN.md; 'obnovit' = 'opakovat'. */
export const IKONY = Object.freeze({
  fajfka: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  hvezda: '<path d="M12 3.5l2.6 5.4 5.9.9-4.3 4.1 1 5.9L12 17l-5.2 2.8 1-5.9-4.3-4.1 5.9-.9z" fill="currentColor" stroke="none"/>', // R61: štítek „Celá správně"
  zamek: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  hodiny: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  'sipka-vpravo': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'sipka-vlevo': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  obnovit: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>',
  opakovat: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>',
  pozor: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 16.8h.01"/>',
  bublina: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M10 9a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9v.2M12 13.6h.01"/>',
  krizek: '<path d="M6 6l12 12M18 6L6 18"/>',
  tiskarna: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  obrazovka: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  telefon: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>',
  smazat: '<path d="M9 5h11v14H9l-6-7z"/><path d="M12 9.5l5 5M17 9.5l-5 5"/>',
  stop: '<path d="M8 8h8v8H8z"/>',
  hledat: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  prazdno: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/>',
  zarovka: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  otocit: '<path d="M4 8h15l-3.5-3.5M20 16H5l3.5 3.5"/>',
  oko: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  dolu: '<path d="M6 9l6 6 6-6"/>',
  sos: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
  uzivatel: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  kniha: '<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h8"/>',
  stahnout: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  tuzka: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  kalkulacka: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>',
});

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Inline SVG ikona `<svg class="ikona" viewBox="0 0 24 24" aria-hidden="true">`.
 * Ikona je dekorativní (aria-hidden); smysl nese text vedle ní nebo aria-label tlačítka.
 * 'stop' dostane automaticky `ikona--plna`.
 * @param {keyof IKONY|string} nazev  např. 'fajfka', 'pozor', 'sipka-vpravo'
 * @param {{trida?: string}} [volby]  další třídy, např. 'ikona--velka' nebo 'semafor-volba__zaskrt'
 * @returns {SVGSVGElement}
 */
export function ikona(nazev, { trida = '' } = {}) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const tridy = ['ikona', nazev === 'stop' && 'ikona--plna', trida].filter(Boolean).join(' ');
  svg.setAttribute('class', tridy);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const cesty = IKONY[nazev];
  if (cesty === undefined) console.warn(`ui.js: neznámá ikona „${nazev}"`);
  else svg.innerHTML = cesty; // statické konstanty výše, bezpečné
  return svg;
}

// ---------------------------------------------------------------------
// Toast, modal
// ---------------------------------------------------------------------

/**
 * Krátké oznámení dole (≈3 s). Kontejner `.toasty` najde na stránce, případně ho vytvoří na konci <body>.
 * @param {string} text
 * @param {{typ?: 'uspech'|'varovani', trvani?: number}} [volby]  výchozí 'uspech' (ikona fajfka), 'varovani' = oranžová ikona pozor
 * @returns {HTMLElement} prvek toastu
 */
export function toast(text, { typ = 'uspech', trvani = 3000 } = {}) {
  let kontejner = document.querySelector('.toasty');
  if (!kontejner) {
    kontejner = el('div', { class: 'toasty', 'aria-live': 'polite' });
    document.body.append(kontejner);
  }
  const t = el('div', { class: ['toast', typ === 'varovani' && 'toast--varovani'] },
    ikona(typ === 'varovani' ? 'pozor' : 'fajfka'),
    el('span', { class: 'toast__text', text }));
  kontejner.append(t);
  setTimeout(() => {
    t.classList.add('je-odchazi');
    setTimeout(() => t.remove(), 200);
  }, trvani);
  return t;
}

/**
 * Otevře `<dialog class="modal">` jako modální okno. Esc zavírá sám (prohlížeč); navíc zavře
 * tlačítko `.modal__zavrit` a klik na závoj mimo panel. Po zavření vrátí fokus tam, kde byl.
 * @param {HTMLDialogElement} dialog
 * @returns {Promise<string>} splní se při zavření s `dialog.returnValue` (např. hodnota z zavritModal(d, 'papir'))
 * @example
 * const volba = await otevritModal(document.getElementById('modalRezim')); // '' = zavřeno bez volby
 */
export function otevritModal(dialog) {
  const predtim = document.activeElement;
  dialog.returnValue = '';
  if (!dialog.dataset.napojeno) {
    dialog.dataset.napojeno = '1';
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) zavritModal(dialog); // klik na závoj
      else if (e.target.closest?.('.modal__zavrit')) zavritModal(dialog);
    });
  }
  return new Promise((splnit) => {
    let hotovo = false;
    const dokoncit = () => {
      if (hotovo) return;
      hotovo = true;
      delete dialog._spolZavreno;
      if (predtim && typeof predtim.focus === 'function' && predtim.isConnected) predtim.focus();
      splnit(dialog.returnValue);
    };
    // Událost 'close' prohlížeč posílá asynchronně (ve skryté záložce ji může odložit),
    // proto zavritModal() splní Promise i sám; Esc a dialog.close() jinde řeší 'close'.
    dialog._spolZavreno = dokoncit;
    dialog.addEventListener('close', dokoncit, { once: true });
    if (!dialog.open) dialog.showModal();
  });
}

/**
 * Zavře modal.
 * @param {HTMLDialogElement} dialog
 * @param {string} [hodnota='']  návratová hodnota pro Promise z otevritModal()
 */
export function zavritModal(dialog, hodnota = '') {
  if (dialog.open) dialog.close(hodnota);
  dialog._spolZavreno?.();
}

// ---------------------------------------------------------------------
// Text s odkazy (PLATBA_TEXT obsahuje URL platby) — bezpečně, bez innerHTML (dotazník, přehled)
// ---------------------------------------------------------------------

/**
 * Rozdělí prostý text na textové uzly a <a> pro http(s) odkazy.
 * @param {string} text
 * @returns {Array<string|HTMLElement>}
 */
export function textSOdkazy(text) {
  const casti = [];
  const re = /https?:\/\/[^\s<>"]+/g;
  let posledni = 0;
  for (const m of text.matchAll(re)) {
    let url = m[0];
    const konec = /[.,;:!?)]+$/.exec(url); // interpunkce za odkazem do odkazu nepatří
    if (konec) url = url.slice(0, -konec[0].length);
    if (m.index > posledni) casti.push(text.slice(posledni, m.index));
    casti.push(el('a', { href: url, target: '_blank', rel: 'noopener', text: url }));
    posledni = m.index + url.length;
  }
  if (posledni < text.length) casti.push(text.slice(posledni));
  return casti;
}

// ---------------------------------------------------------------------
// Formátování (čisté funkce, fungují i v Node)
// ---------------------------------------------------------------------

/**
 * Číslo v českém formátu: desetinná čárka, mezery mezi tisíci (od 10 000).
 * @param {number} n
 * @param {{maxDesetin?: number}} [volby]  výchozí 2
 * @returns {string} např. formatCislo(2.9) → '2,9'; formatCislo(12345) → '12 345' (nezlomitelná mezera)
 */
export function formatCislo(n, { maxDesetin = 2 } = {}) {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '';
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: maxDesetin }).format(Number(n));
}

/** Převede Date | ISO řetězec | 'RRRR-MM-DD' na Date. Samotné datum bere v místním čase (bez posunu dne). */
function naDatum(d) {
  if (d instanceof Date) return d;
  const s = String(d ?? '');
  const jenDatum = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (jenDatum) return new Date(Number(jenDatum[1]), Number(jenDatum[2]) - 1, Number(jenDatum[3]));
  return new Date(s);
}

/**
 * Datum česky: '1. 11.' (výchozí), s rokem '1. 11. 2026', s časem '1. 11. 19:42'.
 * @param {Date|string} d  Date, ISO řetězec, nebo 'RRRR-MM-DD'
 * @param {{rok?: boolean, cas?: boolean}} [volby]
 * @returns {string} '' pro neplatné datum
 */
export function formatDatum(d, { rok = false, cas = false } = {}) {
  const x = naDatum(d);
  if (Number.isNaN(x.getTime())) return '';
  let s = `${x.getDate()}. ${x.getMonth() + 1}.`;
  if (rok) s += ` ${x.getFullYear()}`;
  if (cas) s += ` ${formatCas(x)}`;
  return s;
}

/**
 * Čas 'HH:MM' (např. pro „Naposledy načteno v {cas}").
 * @param {Date|string} d
 * @returns {string}
 */
export function formatCas(d) {
  const x = naDatum(d);
  if (Number.isNaN(x.getTime())) return '';
  return `${x.getHours()}:${String(x.getMinutes()).padStart(2, '0')}`;
}

/**
 * Parametr z URL aktuální stránky (`?lekce=P1` → param('lekce') === 'P1'). Mimo prohlížeč null.
 * @param {string} nazev
 * @returns {string|null}
 */
export function param(nazev) {
  if (typeof location === 'undefined') return null;
  return new URLSearchParams(location.search).get(nazev);
}

/**
 * Ověří návratovou adresu z `?zpet=` (proti přesměrování na cizí web).
 * Povolí jen relativní odkaz na .html stránku ve stejné složce, např. 'lekce.html?lekce=P1'.
 * @param {string|null} zpet
 * @param {string} [vychozi='prehled.html']
 * @returns {string}
 */
export function bezpecnyZpet(zpet, vychozi = 'prehled.html') {
  if (!zpet) return vychozi;
  return /^[a-z0-9-]+\.html(?:[?#][^\s]*)?$/i.test(zpet) ? zpet : vychozi;
}

/**
 * Aktuální stránka jako relativní adresa pro `?zpet=` (projde bezpecnyZpet), např. 'rodic.html?lekce=P1&rezim=papir'.
 * @returns {string}
 */
export function aktualniStranka() {
  if (typeof location === 'undefined') return 'prehled.html';
  return (location.pathname.split('/').pop() || 'prehled.html') + location.search;
}

// ---------------------------------------------------------------------
// Stavy obsahu
// ---------------------------------------------------------------------

/**
 * Odstraní všechny potomky uzlu.
 * @param {Element} uzel
 * @returns {Element} týž uzel (pro řetězení)
 */
export function vyprazdni(uzel) {
  uzel.replaceChildren();
  return uzel;
}

/**
 * Nahradí obsah uzlu stavem načítání (`.nacitani` s točítkem) a nastaví aria-busy.
 * Až budou data, obsah prostě přepiš (vyprazdni + append) a zavolej `uzel.removeAttribute('aria-busy')`.
 * @param {Element} uzel
 * @param {string} [text='Načítám…']
 * @returns {HTMLElement} prvek `.nacitani`
 */
export function nacitani(uzel, text = 'Načítám…') {
  const prvek = el('div', { class: 'nacitani', role: 'status' }, el('span', { class: 'tocitko', 'aria-hidden': 'true' }), text);
  uzel.setAttribute('aria-busy', 'true');
  uzel.replaceChildren(prvek);
  return prvek;
}

/**
 * Nahradí obsah uzlu chybovou hláškou `.hlaska--varovani` s tlačítkem „Obnovit stránku".
 * @param {Element} uzel
 * @param {string} [text]  výchozí h('chyba.nacteni'); typicky `e.message` z ChybaSpolu
 * @returns {HTMLElement} prvek hlášky
 */
export function chybaStranky(uzel, text = h('chyba.nacteni')) {
  const prvek = el('div', { class: 'hlaska hlaska--varovani', role: 'alert' },
    ikona('pozor'),
    el('div', { class: 'hlaska__text' },
      el('strong', { text }),
      el('div', { class: 'hlaska__akce' },
        el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => location.reload() },
          ikona('obnovit'), 'Obnovit stránku'))));
  uzel.removeAttribute('aria-busy');
  uzel.replaceChildren(prvek);
  return prvek;
}

// ---------------------------------------------------------------------
// Napojení na supabase.js (dynamický import — až při volání)
// ---------------------------------------------------------------------

/**
 * Trvalá hláška o neuložených odpovědích. Zobrazí `.hlaska--varovani` „Nepodařilo se uložit…"
 * s tlačítkem „Zkusit znovu" (→ opakovatNeulozene()), dokud je fronta v supabase.js neprázdná;
 * po vyprázdnění hlášku skryje a ukáže toast „Uloženo.". Volej jednou po načtení stránky
 * (lekce.html, rodic.html).
 * @param {{kontejner?: Element}} [volby]  kam hlášku vložit (na začátek); výchozí <main>, jinak <body>
 * @returns {Promise<() => void>} funkce, která posluchače odpojí a hlášku odstraní
 */
export async function napojFrontuUkladani({ kontejner } = {}) {
  const { priZmeneFronty, opakovatNeulozene } = await import('./supabase.js');
  const [hlavni, ...zbytek] = h('chyba.ulozeni').split(/(?<=\.)\s/); // 1. věta tučně
  const tlacitko = el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button' }, ikona('obnovit'), 'Zkusit znovu');
  const hlaska = el('div', { class: 'hlaska hlaska--varovani', role: 'alert', hidden: true },
    ikona('pozor'),
    el('div', { class: 'hlaska__text' }, el('strong', { text: hlavni }), zbytek.join(' '),
      el('div', { class: 'hlaska__akce' }, tlacitko)));
  tlacitko.addEventListener('click', async () => {
    tlacitko.disabled = true;
    tlacitko.classList.add('je-nacitani');
    try { await opakovatNeulozene(); } catch (e) { console.error(e); } finally {
      tlacitko.disabled = false;
      tlacitko.classList.remove('je-nacitani');
    }
  });
  (kontejner || document.querySelector('main') || document.body).prepend(hlaska);

  let bylaChyba = false;
  const odhlasit = priZmeneFronty(({ pocet }) => {
    if (pocet > 0) {
      hlaska.hidden = false;
      bylaChyba = true;
    } else {
      hlaska.hidden = true;
      if (bylaChyba) toast(h('chyba.ulozeni_ok'));
      bylaChyba = false;
    }
  });
  return () => { odhlasit(); hlaska.remove(); };
}

/**
 * Strážce stránky. Volej na začátku každé stránky za přihlášením:
 * ```js
 * const s = await chranStranku();          // admin.html: chranStranku({vyzadujeAdmina: true})
 * if (!s) return;                           // přesměrovává se
 * const { uzivatel, rodina } = s;
 * ```
 * - nepřihlášen → `registrace.html?prihlaseni=1&zpet=<aktuální stránka>`
 * - vyzadujeAdmina a uživatel není admin → `prehled.html`
 * - rodina.stav 'uzavreny' (a nejde o admina) → `uzavreno.html`
 * Síťové chyby vyhodí jako ChybaSpolu (zobraz přes chybaStranky(uzel, e.message)).
 * @param {{vyzadujeAdmina?: boolean}} [volby]
 * @returns {Promise<{uzivatel: object, rodina: import('./supabase.js').Rodina|null}|null>} null = probíhá přesměrování
 */
export async function chranStranku({ vyzadujeAdmina = false } = {}) {
  const sb = await import('./supabase.js');
  const stranka = location.pathname.split('/').pop() || 'index.html';
  const uzivatel = await sb.aktualniUzivatel();
  if (!uzivatel) {
    const zpet = stranka + location.search + location.hash;
    location.replace(`registrace.html?prihlaseni=1&zpet=${encodeURIComponent(zpet)}`);
    return null;
  }
  if (vyzadujeAdmina) {
    if (!(await sb.jeAdmin())) {
      location.replace('prehled.html');
      return null;
    }
    const rodina = await sb.mojeRodina().catch(() => null); // admin nemusí mít rodinu
    return { uzivatel, rodina };
  }
  const rodina = await sb.mojeRodina();
  if (rodina?.stav === 'uzavreny' && stranka !== 'uzavreno.html') {
    location.replace('uzavreno.html');
    return null;
  }
  return { uzivatel, rodina };
}
