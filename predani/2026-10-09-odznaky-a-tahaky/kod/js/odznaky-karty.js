// =====================================================================
// odznaky-karty.js — nový odznak jako sběratelská karta (Pavel 6. 10.: „jako FIFA balíčky“, menší, uprostřed).
// Redesign 8. 10. podle návrhu designérky: tmavá scéna s neonovým titulkem, karta se vznáší a naklání za myší/prstem
// (odlesk), rub s otáčejícím se duhovým okrajem, prolétajícími světly a zlatou koulí s otazníkem; po otočení líc
// s oknem (mřížka, paprsky, jiskry), odznak „vyskočí“, razítko „Získáno!“ a text vyjede zdola.
// Víc nových odznaků najednou = karty vedle sebe, listuje se šipkami, prstem nebo tečkami.
// prefers-reduced-motion: karty rovnou lícem, bez animací.
// R78: stejné karty i pro nově odemčené taháky (oknoKaret s tlačítkem „Otevřít tahák“ na líci, tahaky-ui.js).
// =====================================================================

import { el, otevritModal, zavritModal } from './ui.js';
import { najdiOdznak, htmlOdznaku } from './odznaky.js';
import { h } from './hlasky.js';

const DRUH = { zlata: 'Zlatý odznak', zelena: 'Zelený odznak', modra: 'Modrý odznak' };
const predmetOdznaku = (id) => (id.startsWith('cj:') ? 'Čeština' : id.startsWith('oba:') ? 'Oba předměty'
  : id.startsWith('vyzva:') || id.startsWith('sber:') ? 'Výzvy a taháky' : 'Matematika');
const bezAnimaci = () => Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
const dnes = () => new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\s/g, ' ');

/** Popis odznaku pro kartu (oknoKaret). */
function popisOdznaku(id) {
  const o = najdiOdznak(id);
  const barva = o?.barva || 'zelena';
  return {
    barva, predmet: predmetOdznaku(id), obrazek: htmlOdznaku(id, { titulek: o?.nazev || '' }),
    druh: DRUH[barva] || 'Odznak', nazev: o?.nazev || '', pochvala: o?.pochvala || '',
  };
}

const span = (trida, ...deti) => el('span', { class: trida }, ...deti);
/** Prolétající světla (v návrhu .streak a–e). */
const svetla = (pismena) => el('span', { class: 'karta-odznaku__svetla', 'aria-hidden': 'true' },
  pismena.map((x) => span(`karta-odznaku__svetlo karta-odznaku__svetlo--${x}`)));

/**
 * Jedna karta. `p` = {barva, predmet, obrazek (HTML/SVG řetězec), druh, nazev, pochvala, akce?: {text, onClick?, hodnota?}}.
 * R78: `akce` = tlačítko na líci (tahák: „Otevřít tahák“). Je mimo tlačítko karty (tlačítko v tlačítku nejde),
 * jen položené na líc; viditelné až po otočení. V tlačítku karty jsou jen spany.
 */
function karta(p, poradi, celkem, { datum = dnes() } = {}) {
  const lic = span('karta-odznaku__lic',
    span('karta-odznaku__okraj'),
    span('karta-odznaku__plocha',
      span('karta-odznaku__hlavicka',
        el('span', { text: p.predmet }),
        el('span', { text: `${String(poradi).padStart(2, '0')}/${String(celkem).padStart(2, '0')}` })),
      span('karta-odznaku__okno',
        el('span', { class: 'karta-odznaku__paprsky', 'aria-hidden': 'true' }),
        svetla(['b', 'd']),
        [1, 2, 3, 4].map((i) => el('span', { class: `karta-odznaku__jiskra karta-odznaku__jiskra--${i}`, 'aria-hidden': 'true' })),
        el('span', { class: 'karta-odznaku__obrazek', htmlBezpecne: p.obrazek }),
        el('span', { class: 'karta-odznaku__razitko', 'aria-hidden': 'true' },
          el('span', { class: 'karta-odznaku__neon karta-odznaku__neon--mata', text: h('odznaky.razitko') }))),
      span('karta-odznaku__text',
        el('span', { class: 'karta-odznaku__druh', text: p.druh }),
        el('strong', { class: 'karta-odznaku__nazev', text: p.nazev }),
        el('span', { class: 'karta-odznaku__pochvala', text: p.pochvala })),
      p.akce ? el('span', { class: 'karta-odznaku__misto-akce', 'aria-hidden': 'true' }) : null,
      span('karta-odznaku__pata',
        el('span', { class: 'karta-odznaku__tecka', text: 'Spolu' }),
        datum ? el('span', { text: datum }) : null),
      el('span', { class: 'karta-odznaku__lesk', 'aria-hidden': 'true' })));
  const rub = el('span', { class: 'karta-odznaku__rub', 'aria-hidden': 'true' },
    span('karta-odznaku__okraj'),
    span('karta-odznaku__plocha',
      svetla(['a', 'b', 'c', 'd', 'e']),
      el('span', { class: 'karta-odznaku__roh karta-odznaku__roh--nahore', text: 'Spolu' }),
      el('span', { class: 'karta-odznaku__roh karta-odznaku__roh--dole', text: 'Spolu' }),
      span('karta-odznaku__koule-obal',
        span('karta-odznaku__vlna'), span('karta-odznaku__vlna karta-odznaku__vlna--2'),
        span('karta-odznaku__koule', el('span', { class: 'karta-odznaku__otaznik', text: '?' }))),
      el('span', { class: 'karta-odznaku__vyzva karta-odznaku__neon karta-odznaku__neon--mata', text: 'Klepni a otoč' }),
      span('karta-odznaku__lesk')));
  const tlacitko = el('button', { class: 'karta-odznaku__tlacitko', type: 'button', 'aria-label': `Otoč kartu ${poradi} z ${celkem}` },
    span('karta-odznaku__naklon',
      span('karta-odznaku__vnitrek', rub, lic)));
  const akce = p.akce ? el('button', { class: 'tlacitko tlacitko--primarni karta-odznaku__akce', type: 'button' }, p.akce.text) : null;
  return el('div', { class: ['karta-odznaku', `karta-odznaku--${p.barva}`, akce && 'karta-odznaku--s-akci'], 'data-i': String(poradi - 1) },
    el('div', { class: 'karta-odznaku__vznaseni' },
      el('span', { class: 'karta-odznaku__zare', 'aria-hidden': 'true' }), tlacitko, akce));
}

/**
 * Naklánění aktuální karty za prstem/myší (3D náklon s odleskem z návrhu): --rx, --ry, --mx, --my
 * (+ --mxf zrcadlově pro líc, který je otočený o 180°).
 */
function napojNaklon(k) {
  const cil = k.querySelector('.karta-odznaku__naklon');
  const reset = () => { for (const v of ['--rx', '--ry', '--mx', '--mxf', '--my']) cil.style.removeProperty(v); };
  k.addEventListener('pointermove', (e) => {
    if (!k.classList.contains('je-aktualni') || bezAnimaci()) return;
    const r = cil.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const omez = (v) => Math.max(-0.4, Math.min(1.4, v));
    const x = omez((e.clientX - r.left) / r.width); const y = omez((e.clientY - r.top) / r.height);
    cil.style.setProperty('--rx', `${((0.5 - y) * 22).toFixed(2)}deg`);
    cil.style.setProperty('--ry', `${((x - 0.5) * 28).toFixed(2)}deg`);
    cil.style.setProperty('--mx', `${Math.round(x * 100)}%`);
    cil.style.setProperty('--mxf', `${Math.round((1 - x) * 100)}%`);
    cil.style.setProperty('--my', `${Math.round(y * 100)}%`);
  });
  k.addEventListener('pointerleave', reset);
}

const TEXTY_ODZNAKU = {
  titulek: (n, prohlizeni) => (prohlizeni ? 'Tvůj odznak' : n > 1 ? `Nové odznaky: ${n}` : 'Nový odznak!'),
  seber: (n) => (n > 1 ? 'Seber odznaky' : 'Seber odznak'),
  oznameni: 'Nový odznak',
  pas: 'Karty odznaků, listuj doleva a doprava',
};

/**
 * Okno s kartami nových odznaků. Vrátí se po „Seber odznak(y)“ (nebo Esc).
 * @param {string[]} ids
 * @param {{prohlizeni?: boolean}} [volby]  prohlížení už získaného odznaku z přehledu odznaků (Pavel 6. 10.): jiný nadpis, „Zavřít“
 */
export async function oknoNovychOdznaku(ids, { prohlizeni = false } = {}) {
  return oknoKaret(ids.map(popisOdznaku), { prohlizeni, texty: TEXTY_ODZNAKU });
}

/**
 * Okno s kartami k otočení (odznaky; R78 i nově odemčené taháky). Vrátí se po hlavním tlačítku nebo Esc.
 * @param {Array<object>} polozky  popisy karet (viz karta())
 * @param {{prohlizeni?: boolean, texty?: {titulek: (n: number, prohlizeni: boolean) => string, seber: (n: number) => string, oznameni: string, pas: string}}} [volby]
 * @returns {Promise<string>} '' / 'sebrano', nebo `akce.hodnota` tlačítka na líci (tahák: „Otevřít tahák“)
 */
export async function oknoKaret(polozky, { prohlizeni = false, texty = TEXTY_ODZNAKU } = {}) {
  if (!polozky.length) return '';
  const n = polozky.length;
  const karty = polozky.map((p, i) => karta(p, i + 1, n, { datum: prohlizeni ? '' : dnes() })); // u prohlížení datum získání neznáme
  const pas = el('div', { class: 'karty-odznaku__pas', tabindex: n > 1 ? '0' : null, 'aria-label': n > 1 ? texty.pas : null }, karty);
  const oznameni = el('p', { class: 'jen-ctecka', role: 'status', 'aria-live': 'polite' });
  const tecky = n > 1 ? el('div', { class: 'karty-odznaku__tecky', 'aria-hidden': 'true' }, polozky.map(() => el('span'))) : null;
  const sipka = (smer, text) => (n > 1 ? el('button', { class: `karty-odznaku__sipka karty-odznaku__sipka--${smer}`, type: 'button', 'aria-label': text }) : null);
  const vlevo = sipka('vlevo', 'Předchozí karta');
  const vpravo = sipka('vpravo', 'Další karta');
  const hlavni = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button' });
  const d = el('dialog', { class: 'modal modal--karty-odznaku', 'aria-labelledby': 'kartyOdznakuNadpis' },
    el('div', { class: 'karty-odznaku' },
      el('p', { class: 'karty-odznaku__titulek', id: 'kartyOdznakuNadpis', text: texty.titulek(n, prohlizeni) }),
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
    hlavni.textContent = !otocene.has(aktualni) ? 'Otoč kartu' : vse ? (prohlizeni ? 'Zavřít' : texty.seber(n)) : 'Další karta';
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
    k.classList.add('je-otocena'); // CSS: otočení, odznak vyskočí, razítko, text vyjede
    const p = polozky[i];
    k.querySelector('.karta-odznaku__tlacitko').setAttribute('aria-label', `${p.nazev}: ${p.pochvala}`);
    oznameni.textContent = `${texty.oznameni}: ${p.nazev}. ${p.pochvala}`;
    obnov();
  };
  karty.forEach((k, i) => {
    k.querySelector('.karta-odznaku__tlacitko').addEventListener('click', () => { if (i !== aktualni) naKartu(i); else otoc(i); });
    const akce = k.querySelector('.karta-odznaku__akce');
    // akce.onClick (tahák: otevře se nad kartami), jinak zavře okno s hodnotou akce; bez naklánění: tlačítko na líci by „ujíždělo“
    if (akce) akce.addEventListener('click', () => { const a = polozky[i].akce; if (a.onClick) a.onClick(); else zavritModal(d, a.hodnota || ''); });
    else napojNaklon(k);
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
  const volba = await hotovo;
  d.remove();
  return volba;
}
