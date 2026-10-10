// =====================================================================
// odznaky-karty.js — nový odznak jako sběratelská karta (Pavel 6. 10.: „jako FIFA balíčky“, menší, uprostřed).
// Karta přijede rubem nahoru a „nabíjí se“; klepnutí (nebo tlačítko) ji otočí: záblesk, jiskry, lesk.
// Víc nových odznaků najednou = karty vedle sebe, listuje se šipkami, prstem nebo tečkami.
// Lícem nahoru se karta naklání za prstem/myší (holografický lesk). prefers-reduced-motion: karty rovnou lícem, bez animací.
// =====================================================================

import { el, otevritModal, zavritModal } from './ui.js';
import { najdiOdznak, svgOdznaku } from './odznaky.js';

const DRUH = { zlata: 'Zlatý odznak', zelena: 'Zelený odznak', modra: 'Modrý odznak' };
const predmetOdznaku = (id) => (id.startsWith('cj:') ? 'Čeština' : id.startsWith('oba:') ? 'Oba předměty' : 'Matematika');
const bezAnimaci = () => Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
const dnes = () => new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\s/g, ' ');
const JISKER = 12;

function karta(id, poradi, celkem, { datum = dnes() } = {}) {
  const o = najdiOdznak(id);
  const barva = o?.barva || 'zelena';
  const lic = el('div', { class: 'karta-odznaku__lic' },
    el('div', { class: 'karta-odznaku__hlavicka' },
      el('span', { text: predmetOdznaku(id) }),
      el('span', { text: `${String(poradi).padStart(2, '0')}/${String(celkem).padStart(2, '0')}` })),
    el('div', { class: 'karta-odznaku__okno' },
      el('span', { class: 'karta-odznaku__obrazek', htmlBezpecne: svgOdznaku(id, { titulek: o?.nazev || '' }) })),
    el('span', { class: 'karta-odznaku__druh', text: DRUH[barva] || 'Odznak' }),
    el('strong', { class: 'karta-odznaku__nazev', text: o?.nazev || '' }),
    el('span', { class: 'karta-odznaku__pochvala', text: o?.pochvala || '' }),
    el('div', { class: 'karta-odznaku__pata' },
      el('span', { class: 'karta-odznaku__tecka', text: 'Spolu' }),
      datum ? el('span', { text: datum }) : null),
    el('span', { class: 'karta-odznaku__lesk', 'aria-hidden': 'true' }));
  const rub = el('div', { class: 'karta-odznaku__rub', 'aria-hidden': 'true' },
    el('span', { class: 'karta-odznaku__otaznik', text: '?' }),
    el('span', { class: 'karta-odznaku__vyzva', text: 'Klepni a otoč' }));
  const efekty = el('span', { class: 'karta-odznaku__efekty', 'aria-hidden': 'true' },
    el('span', { class: 'karta-odznaku__vlna' }),
    Array.from({ length: JISKER }, (_, i) => el('span', { class: 'karta-odznaku__jiskra', style: `--a:${(360 / JISKER) * i}deg;--d:${70 + (i % 3) * 22}px` })));
  const tlacitko = el('button', { class: 'karta-odznaku__tlacitko', type: 'button', 'aria-label': `Otoč kartu ${poradi} z ${celkem}` },
    el('span', { class: 'karta-odznaku__naklon' },
      el('span', { class: 'karta-odznaku__vnitrek' }, rub, lic)));
  return el('div', { class: `karta-odznaku karta-odznaku--${barva}`, 'data-i': String(poradi - 1) }, efekty, tlacitko);
}

/** Naklánění lícem otočené karty za prstem/myší (--rx, --ry, --mx, --my). */
function napojNaklon(k) {
  const cil = k.querySelector('.karta-odznaku__naklon');
  const reset = () => { cil.style.removeProperty('--rx'); cil.style.removeProperty('--ry'); };
  k.addEventListener('pointermove', (e) => {
    if (!k.classList.contains('je-otocena') || bezAnimaci()) return;
    const r = cil.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
    cil.style.setProperty('--ry', `${(x - 0.5) * 18}deg`);
    cil.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
    cil.style.setProperty('--mx', `${Math.round(x * 100)}%`);
    cil.style.setProperty('--my', `${Math.round(y * 100)}%`);
  });
  k.addEventListener('pointerleave', reset);
}

/**
 * Okno s kartami nových odznaků. Vrátí se po „Seber odznak(y)“ (nebo Esc).
 * @param {string[]} ids
 * @param {{prohlizeni?: boolean}} [volby]  prohlížení už získaného odznaku z přehledu odznaků (Pavel 6. 10.): jiný nadpis, „Zavřít“
 */
export async function oknoNovychOdznaku(ids, { prohlizeni = false } = {}) {
  if (!ids.length) return;
  const n = ids.length;
  const karty = ids.map((id, i) => karta(id, i + 1, n, { datum: prohlizeni ? '' : dnes() })); // u prohlížení datum získání neznáme
  const pas = el('div', { class: 'karty-odznaku__pas', tabindex: n > 1 ? '0' : null, 'aria-label': n > 1 ? 'Karty odznaků, listuj doleva a doprava' : null }, karty);
  const oznameni = el('p', { class: 'jen-ctecka', role: 'status', 'aria-live': 'polite' });
  const tecky = n > 1 ? el('div', { class: 'karty-odznaku__tecky', 'aria-hidden': 'true' }, ids.map(() => el('span'))) : null;
  const sipka = (smer, text) => (n > 1 ? el('button', { class: `karty-odznaku__sipka karty-odznaku__sipka--${smer}`, type: 'button', 'aria-label': text }) : null);
  const vlevo = sipka('vlevo', 'Předchozí karta');
  const vpravo = sipka('vpravo', 'Další karta');
  const hlavni = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button' });
  const d = el('dialog', { class: 'modal modal--karty-odznaku', 'aria-labelledby': 'kartyOdznakuNadpis' },
    el('div', { class: 'karty-odznaku' },
      el('p', { class: 'karty-odznaku__titulek', id: 'kartyOdznakuNadpis', text: prohlizeni ? 'Tvůj odznak' : n > 1 ? `Nové odznaky: ${n}` : 'Nový odznak!' }),
      el('div', { class: 'karty-odznaku__scena' }, vlevo, pas, vpravo),
      tecky, oznameni, hlavni));

  let aktualni = 0;
  const otocene = new Set();
  const obnov = () => {
    karty.forEach((k, i) => k.classList.toggle('je-aktualni', i === aktualni));
    tecky?.querySelectorAll('span').forEach((t, i) => t.classList.toggle('je-aktualni', i === aktualni));
    if (vlevo) vlevo.disabled = aktualni === 0;
    if (vpravo) vpravo.disabled = aktualni === n - 1;
    const vse = otocene.size === n;
    hlavni.textContent = !otocene.has(aktualni) ? 'Otoč kartu' : vse ? (prohlizeni ? 'Zavřít' : n > 1 ? 'Seber odznaky' : 'Seber odznak') : 'Další karta';
  };
  const naKartu = (i, plynule = true) => {
    aktualni = Math.max(0, Math.min(n - 1, i));
    const k = karty[aktualni];
    pas.scrollTo({ left: k.offsetLeft - (pas.clientWidth - k.offsetWidth) / 2, behavior: plynule && !bezAnimaci() ? 'smooth' : 'auto' });
    obnov();
  };
  const otoc = (i) => {
    if (otocene.has(i)) return;
    otocene.add(i);
    const k = karty[i];
    k.classList.add('je-otocena');
    if (!bezAnimaci()) { k.classList.add('je-vybuch'); setTimeout(() => k.classList.remove('je-vybuch'), 1400); }
    const o = najdiOdznak(ids[i]);
    k.querySelector('.karta-odznaku__tlacitko').setAttribute('aria-label', `${o?.nazev}: ${o?.pochvala}`);
    oznameni.textContent = `Nový odznak: ${o?.nazev}. ${o?.pochvala}`;
    obnov();
  };
  karty.forEach((k, i) => {
    k.querySelector('.karta-odznaku__tlacitko').addEventListener('click', () => { if (i !== aktualni) naKartu(i); else otoc(i); });
    napojNaklon(k);
  });
  vlevo?.addEventListener('click', () => naKartu(aktualni - 1));
  vpravo?.addEventListener('click', () => naKartu(aktualni + 1));
  // listování prstem: aktuální = karta nejblíž středu pásu
  let cekani = null;
  pas.addEventListener('scroll', () => {
    clearTimeout(cekani);
    cekani = setTimeout(() => {
      const stred = pas.scrollLeft + pas.clientWidth / 2;
      const i = karty.reduce((nej, k, j) => (Math.abs(k.offsetLeft + k.offsetWidth / 2 - stred) < Math.abs(karty[nej].offsetLeft + karty[nej].offsetWidth / 2 - stred) ? j : nej), 0);
      if (i !== aktualni) { aktualni = i; obnov(); }
    }, 90);
  });
  pas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); naKartu(aktualni - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); naKartu(aktualni + 1); }
  });
  hlavni.addEventListener('click', () => {
    if (!otocene.has(aktualni)) { otoc(aktualni); return; }
    const dalsi = karty.findIndex((_, i) => !otocene.has(i));
    if (dalsi >= 0) { naKartu(dalsi); return; }
    d.classList.add('je-sebrano');
    setTimeout(() => zavritModal(d, 'sebrano'), bezAnimaci() ? 0 : 520);
  });
  // klik vedle karty okno nezavírá (dítě by o odznak přišlo dřív, než ho uvidí); Esc ano
  d.addEventListener('click', (e) => { if (e.target === d) e.stopImmediatePropagation(); });

  if (bezAnimaci()) karty.forEach((k, i) => { otocene.add(i); k.classList.add('je-otocena'); });
  obnov();
  document.body.append(d);
  const hotovo = otevritModal(d);
  naKartu(0, false);
  hlavni.focus();
  await hotovo;
  d.remove();
}
