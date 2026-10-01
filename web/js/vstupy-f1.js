// =====================================================================
// vstupy-f1.js — Fáze 1 (R30): vstupy `vyraz` a `poradi` a obrázek úlohy (`obrazek` + `obrazek_popis`).
// Formát: kostra/03 „Doplněno 25. 9.", obsah/SABLONA.md §15–17, osnova-faze1 §6.2–6.3, ODPOVED-D body 1, 2, 6.
// Vyhodnocení je v vyhodnoceni.js (čisté funkce, testy v testy/vyraz-poradi.test.js).
//
// Používá: lekce.js (žák), rodic-karta.js („Co vidí dítě", papír), tisk.js (obrázek).
// Rozhraní vstupu žáka je stejné jako u ostatních vstupů v lekce.js:
//   { uzel, pole, hodnota() → {vyhodnoceni, ulozeni}, oznac(druh, hodnota), zamknout(), fokus() }
// Vše vyžaduje `await nacistKnihovny()` (obsah.js).
// =====================================================================

import { el, ikona } from './ui.js';
import { h, HLASKY } from './hlasky.js';
import { renderTex, sanitizujSvg, rozlozDlazdice } from './obsah.js';
import { vyrazNaLatex } from './vyhodnoceni.js';

// ---------------------------------------------------------------------
// vyraz — textové pole + živý náhled KaTeX (dítě vidí, jak aplikace jeho zápis čte)
// ---------------------------------------------------------------------

/**
 * Vstup `vyraz` pro žáka (a v jednodušší podobě pro rodiče v papírovém režimu).
 * @param {object} krok
 * @param {{idPopisku?: string|null, ariaLabel?: string|null, odevzdat?: () => void}} [volby]
 * @returns {{uzel: HTMLElement, pole: HTMLInputElement[], hodnota: () => {vyhodnoceni: string, ulozeni: string},
 *   oznac: (druh: 'spravne'|'nesedi'|null, h?: string) => void, zamknout: () => void, fokus: () => void, nastav: (h: string) => void}}
 */
export function vytvorVstupVyraz(krok, { idPopisku = null, ariaLabel = null, odevzdat = null } = {}) {
  const promenne = krok.vstup?.promenne?.length ? krok.vstup.promenne : ['x'];
  const pole = el('input', {
    class: 'pole pole--vyraz', type: 'text', inputmode: 'text', autocomplete: 'off', autocapitalize: 'off',
    spellcheck: 'false', maxlength: '80', 'aria-labelledby': idPopisku, 'aria-label': ariaLabel,
    'aria-describedby': null,
  });
  const nahledVzorec = el('span', { class: 'vyraz-nahled__vzorec' });
  const nahled = el('p', { class: 'vyraz-nahled', 'aria-live': 'polite', hidden: true },
    el('span', { class: 'vyraz-nahled__popisek', text: h('zak.vyraz_nahled') }), ' ', nahledVzorec);
  const obnovNahled = () => {
    const text = pole.value.trim();
    nahled.hidden = !text;
    if (!text) return;
    const tex = vyrazNaLatex(text, promenne);
    nahled.classList.toggle('je-nejde', !tex);
    nahledVzorec.replaceChildren(tex ? renderTex(tex) : el('span', { text: h('zak.vyraz_nahled_nejde') }));
  };
  const oznacTridu = (trida) => {
    pole.classList.remove('je-spravne', 'je-nesedi');
    if (trida) pole.classList.add(trida);
  };
  pole.addEventListener('input', () => { if (!pole.disabled) oznacTridu(null); obnovNahled(); });
  if (odevzdat) pole.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); odevzdat(); } });
  const nastav = (hodnota) => { pole.value = hodnota ?? ''; obnovNahled(); };
  return {
    uzel: el('div', { class: 'krok__vstup vyraz-vstup' }, pole, nahled),
    pole: [pole],
    hodnota: () => ({ vyhodnoceni: pole.value, ulozeni: pole.value.trim() }),
    oznac(druh, hodnota) {
      if (hodnota !== undefined) nastav(hodnota);
      oznacTridu(druh === 'spravne' ? 'je-spravne' : druh === 'nesedi' ? 'je-nesedi' : null);
    },
    zamknout() { pole.disabled = true; },
    fokus() { if (!pole.disabled) { pole.focus({ preventScroll: true }); pole.select(); } },
    nastav,
  };
}

// ---------------------------------------------------------------------
// poradi — klikání na operace (\op{id}{znak} → [data-op]), štítky 1, 2, 3…
// ---------------------------------------------------------------------

/**
 * Výraz kroku `poradi` jako KaTeX s místy [data-op]; volitelně se štítky pořadí.
 * @param {object} krok
 * @param {{poradi?: string[]|null, mrizka?: boolean}} [volby]  poradi = štítky 1…n (náhled rodiče)
 * @returns {{uzel: HTMLElement, mista: Map<string, HTMLElement>, stitkuj: (poradi: string[]) => void}}
 */
export function vykresliPoradi(krok, { poradi = null } = {}) {
  const vyraz = el('div', { class: 'poradi__vyraz' }, renderTex(krok.vstup?.vyraz || '', { display: true, poradi: true }));
  const mista = new Map([...vyraz.querySelectorAll('[data-op]')].map((m) => [m.dataset.op, m]));
  const popisy = new Map((krok.vstup?.operace || []).map((o) => [o.id, o.popis || o.id]));
  const stitkuj = (p) => {
    for (const [id, m] of mista) {
      m.querySelector(':scope > .poradi__stitek')?.remove();
      const n = p.indexOf(id);
      m.classList.toggle('je-vybrano', n >= 0);
      m.setAttribute('aria-label', n >= 0 ? `${popisy.get(id)}, ${n + 1}.` : popisy.get(id));
      if (n >= 0) m.append(el('span', { class: 'poradi__stitek', 'aria-hidden': 'true', text: String(n + 1) }));
    }
  };
  if (poradi) stitkuj(poradi);
  else stitkuj([]);
  // E1: široký výraz se zmenší, nikdy posuvník
  rozlozDlazdice(vyraz, { vyraz: '.katex-display', sloupce: false, jednotne: false });
  return { uzel: vyraz, mista, stitkuj };
}

/**
 * Vstup `poradi` pro žáka. Klik (nebo Enter/mezerník) na operaci = další číslo; klik na očíslovanou
 * operaci číslo zruší a ostatní se přečíslují. Po chybě štítky zůstanou, nic se nezvýrazní (ODPOVED-D bod 6).
 * @param {object} krok
 * @param {{idPopisku?: string}} [volby]
 */
export function vytvorVstupPoradi(krok, { idPopisku = null } = {}) {
  const { uzel: vyraz, mista, stitkuj } = vykresliPoradi(krok);
  let poradi = [];
  let zamceno = false;
  for (const m of mista.values()) {
    m.setAttribute('role', 'button');
    m.setAttribute('tabindex', '0');
  }
  const obal = el('div', { class: 'krok__vstup poradi', role: 'group', 'aria-labelledby': idPopisku });
  const prepni = (id) => {
    if (zamceno || !mista.has(id)) return;
    poradi = poradi.includes(id) ? poradi.filter((x) => x !== id) : [...poradi, id];
    obal.classList.remove('je-spravne');
    stitkuj(poradi);
  };
  vyraz.addEventListener('click', (e) => {
    const m = e.target.closest('[data-op]');
    if (m && vyraz.contains(m)) prepni(m.dataset.op);
  });
  vyraz.addEventListener('keydown', (e) => {
    const m = e.target.closest?.('[data-op]');
    if (m && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); prepni(m.dataset.op); }
  });
  const znovu = el('button', {
    class: 'tlacitko tlacitko--tiche poradi__znovu', type: 'button',
    onClick: () => { if (!zamceno) { poradi = []; stitkuj(poradi); } },
  }, ikona('smazat'), h('zak.poradi_znovu'));
  obal.append(vyraz, el('div', { class: 'poradi__pata' },
    el('p', { class: 'poradi__napoveda', text: h('zak.poradi_napoveda') }), znovu));
  return {
    uzel: obal,
    pole: [],
    hodnota: () => ({ vyhodnoceni: [...poradi], ulozeni: [...poradi] }),
    oznac(druh, hodnota) {
      if (Array.isArray(hodnota)) { poradi = hodnota.filter((id) => mista.has(id)); stitkuj(poradi); }
      obal.classList.toggle('je-spravne', druh === 'spravne'); // po chybě nic nezvýrazňujeme
    },
    zamknout() {
      zamceno = true;
      znovu.remove();
      obal.classList.add('je-zamceno');
      for (const m of mista.values()) { m.setAttribute('tabindex', '-1'); m.setAttribute('aria-disabled', 'true'); }
    },
    fokus() { if (!zamceno) [...mista.values()][0]?.focus({ preventScroll: true }); },
  };
}

// ---------------------------------------------------------------------
// poradi u rodiče (R34): „Správně: ① … → ② …" a „Dítě klikalo: …" z dat, bez nového pole v JSON
// ---------------------------------------------------------------------

const KROUZKY = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

/** Hláška, nebo výchozí text, dokud klíč v hlasky.md není (R34 — hlášky doplní vedoucí po metodikovi). */
function text(klic, vychozi, promenne) {
  return HLASKY[klic] !== undefined ? h(klic, promenne) : vychozi;
}

/**
 * Pořadí operací slovy: „① mocnina → ② násobení šestnácti → …" (popisy z `vstup.operace`).
 * @param {object} krok  krok typu poradi
 * @param {string[]} poradi  id operací
 * @returns {string}
 */
export function textPoradi(krok, poradi) {
  const popisy = new Map((krok.vstup?.operace || []).map((o) => [o.id, o.popis || o.id]));
  return (poradi || []).map((id, i) => `${KROUZKY[i] || `${i + 1}.`} ${popisy.get(id) || id}`).join(' → ');
}

/**
 * Blok pro rodiče u kroku `poradi` (R34): „Správně: …" (první povolené pořadí) a „Správně je i: …" (další),
 * volitelně nahoře „Dítě klikalo: …" z odpovědi (`odpovedi.hodnota`) a u známé chyby její lidský popis.
 * @param {object} krok
 * @param {{odpoved?: {hodnota: string[], spravne: boolean|null, typ_chyby?: string|null}|null, popisChyby?: (kod: string) => string}} [volby]
 * @returns {HTMLElement}
 */
export function vytvorPoradiRodic(krok, { odpoved = null, popisChyby = (k) => k } = {}) {
  const povolena = krok.spravne?.poradi || [];
  const radek = (stitek, obsah, trida) => el('p', { class: ['poradi-rodic__radek', trida] },
    el('strong', { class: 'poradi-rodic__stitek', text: stitek }), ' ', obsah);
  const dite = odpoved && Array.isArray(odpoved.hodnota) ? [
    radek(text('rodic.poradi_dite', 'Dítě klikalo:'), textPoradi(krok, odpoved.hodnota),
      odpoved.spravne === false ? 'poradi-rodic__radek--nesedi' : 'poradi-rodic__radek--sedi'),
    odpoved.spravne === false && odpoved.typ_chyby
      ? radek(text('rodic.poradi_chyba', 'Typická chyba:'), popisChyby(odpoved.typ_chyby), 'poradi-rodic__radek--chyba') : null,
  ] : [];
  return el('div', { class: 'poradi-rodic' },
    dite,
    povolena[0] ? radek(text('rodic.poradi_spravne', 'Správně:'), textPoradi(krok, povolena[0])) : null,
    povolena.slice(1).map((p) => radek(text('rodic.poradi_spravne_i', 'Správně je i:'), textPoradi(krok, p), 'poradi-rodic__radek--i')));
}

// ---------------------------------------------------------------------
// obrazek + obrazek_popis
// ---------------------------------------------------------------------

/**
 * Obrázek úlohy pod zadáním. SVG přes DOMPurify (profil SVG), barvy dědí `currentColor` (tmavý motiv).
 * Když SVG nejde vykreslit, ukáže se `obrazek_popis`.
 * @param {{obrazek?: string, obrazek_popis?: string}} uloha
 * @param {{popisek?: boolean, tisk?: boolean}} [volby]  popisek = figcaption s popisem (rodič); tisk = max 60 mm
 * @returns {HTMLElement|null}
 */
export function vytvorObrazek(uloha, { popisek = false, tisk = false } = {}) {
  if (!uloha?.obrazek) return null;
  const popis = String(uloha.obrazek_popis || '').trim();
  const svg = sanitizujSvg(uloha.obrazek);
  if (!svg) {
    return popis ? el('p', { class: 'obrazek-ulohy obrazek-ulohy--nahrada' }, ikona('info'), h('rodic.obrazek_popis', { popis })) : null;
  }
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', popis || 'Obrázek k úloze');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('obrazek-ulohy__svg');
  return el('figure', { class: ['obrazek-ulohy', tisk && 'obrazek-ulohy--tisk'] },
    svg,
    popisek && popis ? el('figcaption', { class: 'obrazek-ulohy__popis', text: h('rodic.obrazek_popis', { popis }) }) : null);
}
