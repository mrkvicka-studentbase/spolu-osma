// =====================================================================
// role.js — role zařízení (rodič / žák) a vybrané dítě (kostra/01 „Účty a role", obrazovka 3 z kostra/04)
//
// localStorage: 'spolu.role' = 'rodic' | 'zak', 'spolu.dite' = id dítěte (uuid).
// Přístup ke storage je v try/catch (soukromé okno, zakázané úložiště) — pak se role prostě nepamatuje.
// Čisté funkce (ziskejRoli, stranaLekce…) jdou importovat i v Node; DOM jen ve vykresli*/prepinac*.
// =====================================================================

import { el, ikona } from './ui.js';

const KLIC_ROLE = 'spolu.role';
const KLIC_DITE = 'spolu.dite';

/** @typedef {'rodic'|'zak'} Role */

/** Platné role. */
export const ROLE = Object.freeze(['rodic', 'zak']);

/** Lidské názvy rolí (do přepínače). */
export const NAZVY_ROLI = Object.freeze({ rodic: 'Rodič', zak: 'Žák' });

function cti(klic) {
  try { return globalThis.localStorage?.getItem(klic) ?? null; } catch { return null; }
}

function zapis(klic, hodnota) {
  try {
    if (hodnota === null || hodnota === undefined) globalThis.localStorage?.removeItem(klic);
    else globalThis.localStorage?.setItem(klic, String(hodnota));
  } catch { /* úložiště nedostupné — nevadí */ }
}

/**
 * Role tohoto zařízení, nebo null (ještě nevybráno → ukaž vykresliVolbuRole).
 * @returns {Role|null}
 */
export function ziskejRoli() {
  const r = cti(KLIC_ROLE);
  return ROLE.includes(r) ? r : null;
}

/**
 * Uloží roli zařízení.
 * @param {Role} role
 * @throws {Error} neplatná role
 */
export function nastavRoli(role) {
  if (!ROLE.includes(role)) throw new Error(`Neplatná role: ${role}`);
  zapis(KLIC_ROLE, role);
}

/**
 * Id naposledy vybraného dítěte (přepínač dětí v přehledu), nebo null.
 * Volající ověří, že id je mezi mojeDeti(); jinak vezme první dítě a zavolá nastavDite().
 * @returns {string|null}
 */
export function ziskejDite() {
  return cti(KLIC_DITE) || null;
}

/**
 * Uloží vybrané dítě (null = zapomenout).
 * @param {string|null} id
 */
export function nastavDite(id) {
  zapis(KLIC_DITE, id || null);
}

/**
 * Adresa stránky lekce podle role.
 * @param {Role} role
 * @param {string} lekceId   např. 'P1'
 * @param {string} diteId
 * @param {'app'|'papir'} [rezim]  když chybí, parametr se vynechá
 * @returns {string} 'rodic.html?lekce=P1&dite=…&rezim=app' | 'lekce.html?lekce=P1&dite=…&rezim=app'
 */
export function stranaLekce(role, lekceId, diteId, rezim) {
  const p = new URLSearchParams({ lekce: lekceId });
  if (diteId) p.set('dite', diteId);
  if (rezim) p.set('rezim', rezim);
  return `${role === 'rodic' ? 'rodic.html' : 'lekce.html'}?${p}`;
}

/**
 * Obrazovka 3 (kostra/04): dvě velké karty „Jsem rodič" / „Jsem žák". Vyprázdní uzel a vykreslí volbu.
 * Po kliknutí uloží roli (nastavRoli) a zavolá poVolbe(role).
 * @param {Element} uzel
 * @param {(role: Role) => void} [poVolbe]  typicky překreslení přehledu
 * @returns {HTMLElement} kořen volby
 */
export function vykresliVolbuRole(uzel, poVolbe) {
  const karta = (role, ikonaNazev, nazev, popis) => el('button', {
    class: 'volba-karta',
    type: 'button',
    dataset: { role },
    onClick: () => {
      nastavRoli(role);
      if (poVolbe) poVolbe(role);
    },
  },
  el('span', { class: 'ikona-kruh' }, ikona(ikonaNazev)),
  el('span', { class: 'volba-karta__nazev', text: nazev }),
  el('span', { class: 'volba-karta__popis', text: popis }));

  const koren = el('section', { class: 'zasobnik', 'aria-labelledby': 'volba-role-nadpis' },
    el('h1', { id: 'volba-role-nadpis', text: 'Kdo používá toto zařízení?' }),
    el('p', { class: 'text-tlumeny', text: 'Vybíráte jednou, změnit to jde kdykoli v menu.' }),
    el('div', { class: 'volby-karet' },
      karta('rodic', 'telefon', 'Jsem rodič', 'Mám telefon s tahákem.'),
      karta('zak', 'obrazovka', 'Jsem žák', 'Mám počítač nebo tablet.')));
  uzel.replaceChildren(koren);
  return koren;
}

/**
 * Přepínač role do menu (`.prepinac`, dvě tlačítka s aria-pressed). Vloží se na konec uzlu.
 * Po změně: na lekce.html ↔ rodic.html přejde na protějšek se stejnými parametry, jinde zavolá
 * poZmene(role), a když chybí, obnoví stránku.
 * @param {Element} uzel
 * @param {{poZmene?: (role: Role) => void}} [volby]
 * @returns {HTMLElement} prvek přepínače
 */
export function prepinacRole(uzel, { poZmene } = {}) {
  const aktualni = ziskejRoli();
  const tlacitka = ROLE.map((role) => el('button', {
    class: 'prepinac__volba',
    type: 'button',
    'aria-pressed': String(role === aktualni),
    onClick: () => {
      if (role === ziskejRoli()) return;
      nastavRoli(role);
      for (const t of tlacitka) t.setAttribute('aria-pressed', String(t === tlacitka[ROLE.indexOf(role)]));
      const stranka = location.pathname.split('/').pop();
      if (stranka === 'lekce.html' || stranka === 'rodic.html') {
        location.href = (role === 'rodic' ? 'rodic.html' : 'lekce.html') + location.search;
      } else if (poZmene) {
        poZmene(role);
      } else {
        location.reload();
      }
    },
  }, NAZVY_ROLI[role]));
  const prepinac = el('div', { class: 'prepinac', role: 'group', 'aria-label': 'Toto zařízení používá' }, tlacitka);
  uzel.append(prepinac);
  return prepinac;
}
