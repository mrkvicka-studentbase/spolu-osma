// =====================================================================
// obsah.js — načtení lekce a render Markdown + KaTeX (R2, R3, R8)
//
// Knihovny z CDN (jsDelivr), pinované verze — ověřeno 24. 9. 2026 (HTTP 200):
//   KaTeX     0.16.47  https://cdn.jsdelivr.net/npm/katex@0.16.47/dist/katex.mjs  (+ katex.min.css)
//   marked    18.0.14  https://cdn.jsdelivr.net/npm/marked@18.0.14/lib/marked.esm.js
//   DOMPurify 3.4.16   https://cdn.jsdelivr.net/npm/dompurify@3.4.16/dist/purify.es.mjs
// Změna verze = upravit konstanty níže + zapsat do reporty/ROZHODNUTI.md (R2).
//
// KaTeX CSS: nacistKnihovny() vloží <link> do <head> sama (jednou) a počká na jeho načtení.
// Stránky ho do <head> dávat NEMUSÍ. Kdo ho tam přesto dá (např. tisk.html kvůli tisku),
// musí použít přesně KATEX_CSS — pak se druhý <link> nepřidá.
//
// Postup na stránce:
//   await nacistKnihovny();                     // jednou, před prvním renderMarkdown
//   const lekce = await nactiLekciObsah('P1');  // DB; s ?lokalne=1 ze souboru
//   uzel.append(renderMarkdown(uloha.zadani));
//
// Čisté funkce (rozdelKontrolu, ulohaPodleId, finalKrok, nazevKapitoly, NAZVY_TYPU) jdou použít i v Node.
// =====================================================================

import { KAPITOLY } from './hlasky.js';
import { param, el, ikona, IKONY } from './ui.js';

const CDN = 'https://cdn.jsdelivr.net/npm';
/** URL stylu KaTeX (pinovaná verze). */
export const KATEX_CSS = `${CDN}/katex@0.16.47/dist/katex.min.css`;
const KATEX_JS = `${CDN}/katex@0.16.47/dist/katex.mjs`;
const MARKED_JS = `${CDN}/marked@18.0.14/lib/marked.esm.js`;
const DOMPURIFY_JS = `${CDN}/dompurify@3.4.16/dist/purify.es.mjs`;

// ---------------------------------------------------------------------
// Konstanty a čisté pomocné funkce
// ---------------------------------------------------------------------

/** Lidské názvy typů úloh (uloha.typ → text do štítků a souhrnu). */
export const NAZVY_TYPU = Object.freeze({
  rozcvicka: 'Rozcvička',
  detektiv: 'Detektiv',
  cermat: 'Hlavní úloha',          // Spolu 8: typ cermat = hlavní úloha lekce, nikdy „CERMAT“ (rozhodnutí 1. 10.)
  semafor: 'Sám/sama',
  nova: 'Nová látka',          // čeština (FORMAT-CJ §2)
  kontrolni: 'Sám/sama',       // čeština: role semaforu Matematiky
  diagnostika: 'Diagnostika',
  simulace: 'Úloha testu',
});

/**
 * Název kapitoly malými písmeny (z obsah/hlasky.md), např. 'pocetni-operace' → 'početní operace'.
 * Neznámý kód vrátí beze změny.
 * @param {string} kod  lekce.kapitola
 * @returns {string}
 */
export function nazevKapitoly(kod) {
  return KAPITOLY[kod] ?? String(kod ?? '');
}

const ZNACKA_KONTROLY = /Kontrola pro vás:\s*/i;

/**
 * R8: rozdělí semaforový text na část pro dítě a „Kontrolu pro vás" (výsledky jen pro rodiče,
 * zobrazují se sbalené za tlačítkem „Ukázat kontrolu"). Značka je vždy na konci textu.
 * @param {string} text  např. semafor.oranzova
 * @returns {{text: string, kontrola: string|null}}  kontrola bez úvodní značky; null, když značka chybí
 * @example rozdelKontrolu('Zítra 5 minut… Kontrola pro vás: $23$.') // {text: 'Zítra 5 minut…', kontrola: '$23$.'}
 */
export function rozdelKontrolu(text) {
  const s = String(text ?? '');
  const m = ZNACKA_KONTROLY.exec(s);
  if (!m) return { text: s.trim(), kontrola: null };
  const kontrola = s.slice(m.index + m[0].length).trim();
  return { text: s.slice(0, m.index).trim(), kontrola: kontrola || null };
}

/**
 * Otázka taháku ve starém i novém formátu (R23): řetězec, nebo `{ k: 'A', text: '„…“' }`.
 * @param {string|{k?: string, text: string}} otazka
 * @returns {{k: string|null, text: string}}
 */
export function normalizujOtazku(otazka) {
  if (otazka && typeof otazka === 'object') return { k: otazka.k ? String(otazka.k) : null, text: String(otazka.text ?? '') };
  return { k: null, text: String(otazka ?? '') };
}

/** H2 (R29): výchozí pomůcky, když lekce nemá pole `pomucky`. */
export const VYCHOZI_POMUCKY = Object.freeze(['sešit', 'propiska', 'tužka']);

/**
 * Pomůcky lekce pro „Připrav si" (žák) a řádek v tisku. Chybí-li / je prázdné → výchozí trojice.
 * @param {{pomucky?: string[]}} lekce
 * @returns {string[]}
 */
export function pomuckyLekce(lekce) {
  const p = Array.isArray(lekce?.pomucky) ? lekce.pomucky.map((x) => String(x ?? '').trim()).filter(Boolean) : [];
  return p.length ? p : [...VYCHOZI_POMUCKY];
}

const RE_MATEMATIKA = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;

/**
 * Čistá funkce: rozdělí `tahak.reseni` na řádky podle R23.
 * - odstavce oddělené prázdným řádkem = řádky; `#### A) …` = oddíl; `**Výsledek:** …` = výsledek,
 * - řádek s matematikou a závorkou NA KONCI mimo `$…$` → výpočet + vysvětlivka,
 * - řádek začínající matematikou → výpočet, jinak obyčejný text (starý souvislý formát zůstane textem).
 * @param {string} text
 * @returns {Array<{druh: 'oddil'|'vysledek'|'vypocet'|'text', text: string, vysvetlivka?: string|null}>}
 */
export function rozdelReseni(text) {
  return String(text ?? '').replace(/\r\n/g, '\n').split(/\n\s*\n/).map((r) => r.trim()).filter(Boolean).map((radek) => {
    const oddil = /^#{1,6}\s+(.+)$/.exec(radek);
    if (oddil) return { druh: 'oddil', text: oddil[1].trim() };
    if (/^\*\*Výsledek:?\*\*/i.test(radek)) return { druh: 'vysledek', text: radek.replace(/^\*\*Výsledek:?\*\*\s*/i, '') };
    const bezMat = radek.replace(RE_MATEMATIKA, (m) => '\u0001'.repeat(m.length)); // pozice zachované
    const zavorka = /\s*\(([^()\u0001]*)\)\s*\.?$/.exec(bezMat);
    const maMat = bezMat.includes('\u0001');
    if (maMat && zavorka && zavorka.index > 0) {
      return { druh: 'vypocet', text: radek.slice(0, zavorka.index).trim(), vysvetlivka: zavorka[1].trim() };
    }
    if (bezMat.startsWith('\u0001')) return { druh: 'vypocet', text: radek, vysvetlivka: null };
    return { druh: 'text', text: radek };
  });
}

/**
 * `tahak.reseni` vysázené jako výpočet (A4, R23): výpočet velký, vysvětlivka menší šedá pod ním,
 * oddíly A/B/C, výsledek zvýrazněný. Vyžaduje `await nacistKnihovny()`.
 * @param {string} text
 * @returns {HTMLElement}  <div class="reseni">
 */
export function renderReseni(text) {
  const obal = document.createElement('div');
  obal.className = 'reseni';
  for (const r of rozdelReseni(text)) {
    const radek = document.createElement('div');
    radek.className = `reseni__${r.druh}`;
    if (r.druh === 'vysledek') {
      const stitek = document.createElement('span');
      stitek.className = 'reseni__vysledek-stitek';
      stitek.textContent = 'Výsledek';
      radek.append(stitek);
    }
    const hlavni = document.createElement(r.druh === 'oddil' ? 'h4' : 'div');
    hlavni.className = r.druh === 'oddil' ? 'reseni__oddil-nadpis' : 'reseni__radek';
    hlavni.append(renderMarkdown(r.text, { inline: true }));
    radek.append(hlavni);
    if (r.vysvetlivka) {
      const vys = document.createElement('div');
      vys.className = 'reseni__vysvetlivka';
      vys.append(renderMarkdown(r.vysvetlivka, { inline: true }));
      radek.append(vys);
    }
    obal.append(radek);
  }
  // E1 (QA 27. 9.): dlouhý řádek výpočtu se na telefonu rodiče zmenší (nejvýš na 16 px), jinak zalomí za +, −, =
  rozlozDlazdice(obal, {
    vyraz: '.reseni__radek, .reseni__vysvetlivka', sloupce: false, jednotne: false, minPismo: MIN_PISMO_VZORCE, zalomit: true,
  });
  return obal;
}

/**
 * Úloha lekce podle id.
 * @param {{ulohy: Array<object>}} lekce
 * @param {string} id  např. 'P1-U3'
 * @returns {object|null}
 */
export function ulohaPodleId(lekce, id) {
  return lekce?.ulohy?.find((u) => u.id === id) ?? null;
}

/**
 * Krok `final` úlohy (výsledek — podle něj rodič v režimu papír zadává výsledek dítěte).
 * Když chybí krok s id 'final', vrátí poslední krok.
 * @param {{kroky: Array<object>}} uloha
 * @returns {object|null}
 */
export function finalKrok(uloha) {
  const kroky = uloha?.kroky || [];
  return kroky.find((k) => k.id === 'final') ?? kroky[kroky.length - 1] ?? null;
}

// ---------------------------------------------------------------------
// Načtení lekce
// ---------------------------------------------------------------------

/**
 * Lekce jako jeden objekt: obsah (jsonb, kostra/03) + metadata z řádku tabulky `lekce`
 * (metadata mají přednost). Pro lokální vývoj s `?lokalne=1` v URL čte soubor místo DB.
 * @param {string} id  např. 'P1'
 * @param {{lokalne?: boolean}} [volby]  výchozí: podle URL parametru lokalne=1
 * @returns {Promise<{id: string, faze: string, tyden: number, poradi: number, tema: string, kapitola: string,
 *   varianta: string, cil_pro_rodice: string, uvod_pro_rodice: string, cas_min: number,
 *   ulohy: Array<object>, verejna?: boolean, otevrit_od?: string, verze?: number}>}
 * @throws {ChybaSpolu} kod 'zamceno' (lekce neexistuje / je zamčená), 'sit', …
 */
export async function nactiLekciObsah(id, { lokalne = param('lokalne') === '1' } = {}) {
  if (lokalne) return nactiLekciZeSouboru(id);
  const { nactiLekci } = await import('./supabase.js');
  const radek = await nactiLekci(id);
  const { obsah, ...meta } = radek;
  return { ...(obsah || {}), ...meta };
}

/**
 * JEN lokální vývoj / náhled bez DB: načte `../obsah/lekce/<id>.json` relativně ke stránce, když tam není,
 * `../testy/data/<id>.json` (vzorové lekce Fáze 2, R38). Čeština (`cj-…`): `../obsah/cestina/lekce/<id>.json`.
 * V produkci (Endora) složka obsah/ není → volá se jen s `?lokalne=1` (viz nactiLekciObsah).
 * Server musí běžet z kořene repa: `python -m http.server 8771 --bind 127.0.0.1`.
 * @param {string} id
 * @returns {Promise<object>} obsah JSON lekce
 */
export async function nactiLekciZeSouboru(id) {
  if (!/^[A-Za-z0-9_-]+$/.test(String(id))) throw new Error(`Neplatné id lekce: ${id}`);
  // Fáze 2: vzorové lekce frontendu (F2-VZOR-*) jsou jen v testy/data — tam se hledá, když obsah/lekce soubor nemá
  let posledni = null;
  // čeština jen ve své složce (žádný zbytečný 404 v konzoli)
  const slozky = /^cj-/.test(id) ? ['../obsah/cestina/lekce/'] : ['../obsah/lekce/', '../testy/data/'];
  for (const slozka of slozky) {
    const odp = await fetch(new URL(`${slozka}${id}.json`, location.href), { cache: 'no-store' });
    if (odp.ok) return odp.json();
    posledni = odp.status;
  }
  throw new Error(`Soubor lekce ${id} nelze načíst (HTTP ${posledni}). Běží server z kořene repa?`);
}

// ---------------------------------------------------------------------
// Knihovny z CDN
// ---------------------------------------------------------------------

let knihovny = null;       // {katex, marked, DOMPurify} po načtení
let slibKnihoven = null;

function nactiKatexCss() {
  const existujici = [...document.querySelectorAll('link[rel="stylesheet"]')].find((l) => l.href === KATEX_CSS);
  if (existujici) return Promise.resolve();
  return new Promise((splnit) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = KATEX_CSS;
    link.addEventListener('load', () => splnit(), { once: true });
    link.addEventListener('error', () => { console.warn('obsah.js: KaTeX CSS se nenačetlo'); splnit(); }, { once: true });
    setTimeout(splnit, 5000); // nečekat donekonečna
    document.head.append(link);
  });
}

/**
 * Načte KaTeX (JS + CSS), marked a DOMPurify z CDN. Opakované volání vrátí stejný Promise.
 * Musí doběhnout před prvním renderMarkdown().
 * @returns {Promise<void>}
 * @throws {Error} když CDN nejde načíst (offline) — stránka má ukázat chybaStranky()
 */
export function nacistKnihovny() {
  if (!slibKnihoven) {
    slibKnihoven = Promise.all([
      import(KATEX_JS),
      import(MARKED_JS),
      import(DOMPURIFY_JS),
      nactiKatexCss(),
    ]).then(([katexMod, markedMod, purifyMod]) => {
      const { Marked } = markedMod;
      knihovny = {
        katex: katexMod.default,
        marked: new Marked({ gfm: true, breaks: false }),
        DOMPurify: purifyMod.default,
      };
    }).catch((e) => {
      slibKnihoven = null; // dovolit další pokus
      throw e;
    });
  }
  return slibKnihoven;
}

// ---------------------------------------------------------------------
// Render Markdown + KaTeX
// ---------------------------------------------------------------------

// Zástupné znaky z Private Use Area — marked ani DOMPurify je nemění a v obsahu se nevyskytují.
const Z_ZAC = '\uE000';
const Z_KON = '\uE001';
const Z_DOLAR = '\uE002';
const RE_TOKEN = /\uE000(\d+)\uE001/g;

/**
 * Markdown s matematikou → DocumentFragment (sanitizovaný).
 * Postup: `\$` = doslovný dolar; `$$…$$` (display) a `$…$` (inline, na jednom řádku) se vyjmou na
 * zástupné tokeny → marked → DOMPurify → tokeny nahradí KaTeX (throwOnError: false, output 'html').
 * Vyžaduje dokončené `await nacistKnihovny()`.
 * @param {string} text  Markdown z obsahu lekce
 * @param {{inline?: boolean, poradi?: boolean}} [volby]  inline: true = bez obalového <p> a bez bloků (dlaždice, popisky kroků);
 *   poradi: true = makro `\op{id}{znak}` jako `[data-op]` (tisk: kroužky nad operacemi), jinak `\op` = jen znak
 * @returns {DocumentFragment}
 * @throws {Error} když knihovny nejsou načtené
 * @example popisek.append(renderMarkdown(krok.popisek, {inline: true}))
 */
export function renderMarkdown(text, { inline = false, poradi = false } = {}) {
  if (!knihovny) throw new Error('obsah.js: nejdřív zavolej await nacistKnihovny()');
  const { katex, marked, DOMPurify } = knihovny;
  // `\op{id}{znak}` (krok poradi) mimo krok: jen znak; s `poradi: true` (tisk) klikací místo [data-op] → kroužek (CSS)
  const volbyKatex = poradi
    ? { macros: { ...MAKRA_PORADI }, trust: (k) => k.command === '\\htmlData' }
    : { macros: { '\\op': '#2' } };

  const vzorce = [];
  const zastup = (tex, display) => {
    vzorce.push({ tex: tex.trim(), display });
    return `${Z_ZAC}${vzorce.length - 1}${Z_KON}`;
  };
  const md = String(text ?? '')
    .replace(/\\\$/g, Z_DOLAR)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => zastup(tex, true))
    .replace(/\$([^$\n]+?)\$/g, (_, tex) => zastup(tex, false));

  const html = inline ? marked.parseInline(md) : marked.parse(md);
  const cisty = DOMPurify.sanitize(html);

  const vysledek = cisty
    .replace(RE_TOKEN, (_, i) => {
      const v = vzorce[Number(i)];
      return v ? katex.renderToString(v.tex, { throwOnError: false, output: 'html', displayMode: v.display, strict: 'ignore', ...volbyKatex }) : '';
    })
    .replaceAll(Z_DOLAR, '$');

  const sablona = document.createElement('template');
  sablona.innerHTML = vysledek;
  // Petrův výpočet „1. řádek: …": slovo „řádek:" do `.radek-popisek` — na obrazovce ho číslo vlevo nahradí
  // (CSS), vzorec má celou šířku a nezalomí se hned za popiskem (zadavatel 27. 9.)
  for (const li of sablona.content.querySelectorAll('ol > li')) {
    const cil = li.querySelector(':scope > p') || li;
    const t = cil.firstChild;
    const m = t?.nodeType === 3 ? /^\s*řádek:\s*/.exec(t.textContent) : null;
    if (!m) continue;
    t.textContent = t.textContent.slice(m[0].length);
    cil.prepend(el('span', { class: 'radek-popisek', text: 'řádek: ' }));
  }
  return sablona.content;
}

// ---------------------------------------------------------------------
// Fáze 1 (R30): samostatný vzorec (vyraz náhled, poradi) a obrázek (inline SVG)
// ---------------------------------------------------------------------

/** Makro kroku `poradi`: klikací operace → `<span data-op="id">` (osnova §6.2). \mathbin drží mezery u znaménka. */
const MAKRA_PORADI = Object.freeze({ '\\op': '\\mathbin{\\htmlData{op=#1}{#2}}' });

/**
 * Jeden vzorec přes KaTeX (bez Markdownu). Vyžaduje `await nacistKnihovny()`.
 * @param {string} tex
 * @param {{display?: boolean, poradi?: boolean}} [volby]  poradi: makro `\op{id}{znak}` + `trust` JEN pro
 *   `\htmlData` (ODPOVED-D bod 6: jen v kroku poradi; obsah je náš JSON, ne text od uživatele)
 * @returns {DocumentFragment}
 */
export function renderTex(tex, { display = false, poradi = false } = {}) {
  if (!knihovny) throw new Error('obsah.js: nejdřív zavolej await nacistKnihovny()');
  const html = knihovny.katex.renderToString(String(tex ?? ''), {
    throwOnError: false, output: 'html', displayMode: display, strict: 'ignore',
    ...(poradi ? { macros: { ...MAKRA_PORADI }, trust: (k) => k.command === '\\htmlData' } : {}),
  });
  const sablona = document.createElement('template');
  sablona.innerHTML = html;
  return sablona.content;
}

/**
 * Inline SVG úlohy (`uloha.obrazek`) přes DOMPurify s profilem SVG (ODPOVED-D bod 1, kostra/03).
 * Zakázané prvky a odkazy se vyhodí; barvy natvrdo validátor seedu hlásí (tady se nepřebarvují).
 * Bez `viewBox` nebo s chybou → null (volající ukáže `obrazek_popis`). Vyžaduje `await nacistKnihovny()`.
 * @param {string} svg
 * @returns {SVGSVGElement|null}
 */
export function sanitizujSvg(svg) {
  if (!knihovny || typeof svg !== 'string' || !svg.trim()) return null;
  const frag = knihovny.DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true },
    FORBID_TAGS: ['script', 'foreignObject', 'image', 'use', 'a', 'style', 'animate', 'set', 'animateMotion', 'animateTransform', 'filter'],
    FORBID_ATTR: ['href', 'xlink:href', 'style', 'class', 'id'],
    RETURN_DOM_FRAGMENT: true,
  });
  const koren = frag.firstElementChild;
  if (!koren || koren.nodeName.toLowerCase() !== 'svg' || !koren.getAttribute('viewBox')) return null;
  koren.removeAttribute('width');
  koren.removeAttribute('height');
  return koren;
}

// ---------------------------------------------------------------------
// H1 (R29): manuál rodiče z obsah/manual-rodice.md — bloky s ikonou a barevným pruhem
// ---------------------------------------------------------------------

const BARVY_BLOKU = Object.freeze(['zelena', 'oranzova', 'semafor', 'hlavni']);
const RE_BLOK_ZAC = /^:::\s*blok\b(.*)$/;
const RE_BLOK_KON = /^:::\s*$/;

/**
 * Nadpis bloku = první tučná věta na začátku těla. `**Otázky.** První…` → „Otázky"; když tučný
 * úsek jen začíná větu (`**Zítra** se řiďte …:`), nadpisem je celá první věta.
 * @param {string} telo
 * @returns {{nadpis: string|null, telo: string}}
 */
function vyjmiNadpis(telo) {
  const m = /^\*\*(.+?)\*\*[ \t]*/.exec(telo);
  if (!m) return { nadpis: null, telo };
  let nadpis = m[1].trim();
  let zbytek = telo.slice(m[0].length);
  if (!/[.:!?]$/.test(nadpis) && /^\p{Ll}/u.test(zbytek)) {
    const konec = /^[^\n]*?[.:!?](?=\s|$)/.exec(zbytek);
    if (konec) { nadpis = `${nadpis} ${konec[0]}`; zbytek = zbytek.slice(konec[0].length); }
  }
  return { nadpis: nadpis.replace(/[.:]$/, '').trim(), telo: zbytek.trim() };
}

/**
 * Čistá funkce: rozdělí Markdown manuálu na volný text a bloky (R29).
 * Blok: řádek `::: blok barva=zelena|oranzova|semafor|hlavni ikona=<název z ui.js IKONY>`, tělo
 * (běžný Markdown), řádek `:::`. Neuzavřený blok končí koncem textu. Neznámá barva → zelena.
 * @param {string} md
 * @returns {Array<{druh: 'md', text: string} | {druh: 'blok', barva: string, ikona: string|null, nadpis: string|null, telo: string}>}
 */
export function rozdelManual(md) {
  const casti = [];
  let volny = [];
  let blok = null;
  const uzavriVolny = () => { const t = volny.join('\n').trim(); if (t) casti.push({ druh: 'md', text: t }); volny = []; };
  const uzavriBlok = () => {
    const { nadpis, telo } = vyjmiNadpis(blok.radky.join('\n').trim());
    casti.push({ druh: 'blok', barva: blok.barva, ikona: blok.ikona, nadpis, telo });
    blok = null;
  };
  for (const radek of String(md ?? '').replace(/\r\n/g, '\n').split('\n')) {
    const zac = RE_BLOK_ZAC.exec(radek.trim());
    if (!blok && zac) {
      uzavriVolny();
      const atr = Object.fromEntries([...zac[1].matchAll(/([a-z]+)=("[^"]*"|\S+)/g)].map((a) => [a[1], a[2].replace(/^"|"$/g, '')]));
      blok = { barva: BARVY_BLOKU.includes(atr.barva) ? atr.barva : 'zelena', ikona: atr.ikona || null, radky: [] };
    } else if (blok && RE_BLOK_KON.test(radek.trim())) {
      uzavriBlok();
    } else if (blok) {
      blok.radky.push(radek);
    } else {
      volny.push(radek);
    }
  }
  if (blok) uzavriBlok();
  uzavriVolny();
  return casti;
}

/** `==text==` → `<mark>` (mimo matematiku `$…$`; marked i DOMPurify <mark> nechají). */
function zvyrazneni(md) {
  const vzorce = [];
  const bez = String(md).replace(RE_MATEMATIKA, (m) => { vzorce.push(m); return `${vzorce.length - 1}`; });
  return bez.replace(/==(?=\S)(.+?)(?<=\S)==/g, '<mark class="manual-blok__zvyrazneni">$1</mark>')
    .replace(/(\d+)/g, (_, i) => vzorce[Number(i)]);
}

const SEMAFOR_BARVY = Object.freeze([
  // bez \b — „á" není pro JS slovní znak, \b za „Zelená" by nikdy nesedělo
  ['zelena', /^Zelená(?=[\s:.,]|$)/, 'fajfka'],
  ['oranzova', /^Oranžová(?=[\s:.,]|$)/, 'opakovat'],
  ['cervena', /^Červená(?=[\s:.,]|$)/, 'stop'],
]);

function znakSemaforu(barva, ikonaNazev, mala = true) {
  return el('span', { class: ['semafor-znak', mala && 'semafor-znak--mala', `semafor-znak--${barva}`], 'aria-hidden': 'true' }, ikona(ikonaNazev));
}

/**
 * Manuál rodiče (H1, R29): Markdown s bloky `::: blok …` → DOM. Každý blok = karta s ikonou
 * v prstenci, nadpisem (první tučná věta) a barevným levým pruhem (stejný jazyk jako žebříček
 * „Platí:" a kroky ①–④): `zelena` = co dělat, `oranzova` = pozor/past, `hlavni` = výrazný rámeček
 * nahoře, `semafor` = semaforová kolečka (R27: plné kolečko s ikonou + slovo) u položek
 * „Zelená / Oranžová / Červená …" a v hlavičce. `==text==` = zvýrazněná klíčová fráze.
 * Vyžaduje `await nacistKnihovny()`.
 * @param {string} md
 * @returns {DocumentFragment}
 */
export function renderManual(md) {
  const frag = document.createDocumentFragment();
  for (const cast of rozdelManual(md)) {
    if (cast.druh === 'md') { frag.append(renderMarkdown(zvyrazneni(cast.text))); continue; }
    const obsah = el('div', { class: 'manual-blok__obsah' });
    if (cast.telo) obsah.append(renderMarkdown(zvyrazneni(cast.telo)));
    const semafor = cast.barva === 'semafor';
    if (semafor) {
      // položky „Zelená: …" dostanou plné semaforové kolečko a tučné slovo barvy
      for (const li of obsah.querySelectorAll('li')) {
        const text = li.textContent.trim();
        const shoda = SEMAFOR_BARVY.find(([, re]) => re.test(text));
        if (!shoda) continue;
        const [barva, re, ik] = shoda;
        const prvni = li.firstChild;
        if (prvni?.nodeType === 3) {
          const slovo = re.exec(prvni.textContent.trimStart())?.[0];
          if (slovo) {
            prvni.textContent = prvni.textContent.trimStart().slice(slovo.length);
            li.prepend(el('strong', { text: slovo }));
          }
        }
        const obal = el('span', { class: 'manual-blok__semafor-text' }, ...li.childNodes); // text zůstane jeden řádkový tok
        li.replaceChildren(znakSemaforu(barva, ik), obal);
        li.classList.add('manual-blok__semafor-polozka');
      }
    }
    const znak = semafor
      ? el('span', { class: 'manual-blok__semafor', 'aria-hidden': 'true' }, SEMAFOR_BARVY.map(([b, , ik]) => znakSemaforu(b, ik)))
      : el('span', { class: 'manual-blok__ikona', 'aria-hidden': 'true' }, ikona(cast.ikona && IKONY[cast.ikona] ? cast.ikona : 'info'));
    frag.append(el('section', { class: ['manual-blok', `manual-blok--${cast.barva}`] },
      cast.nadpis ? el('h3', { class: 'manual-blok__nadpis' }, znak, el('span', null, renderMarkdown(cast.nadpis, { inline: true }))) : znak,
      obsah));
  }
  return frag;
}

/**
 * Pohodlná varianta: vyprázdní uzel a vloží do něj renderMarkdown(text, volby).
 * @param {Element} uzel
 * @param {string} text
 * @param {{inline?: boolean}} [volby]
 * @returns {Element} týž uzel
 */
export function vlozMarkdown(uzel, text, volby) {
  uzel.replaceChildren(renderMarkdown(text, volby));
  return uzel;
}

// ---------------------------------------------------------------------
// E1 (25. 9.): dlaždice a vzorce bez posuvníků
// ---------------------------------------------------------------------

/** Šířka obsahu prvku bez paddingu (px). */
function sirkaObsahu(e) {
  const cs = getComputedStyle(e);
  return e.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
}

/**
 * Místo pro prvek (px). U dlaždice = obsah dlaždice bez paddingu (výraz je shrink-to-fit, jeho clientWidth nic neříká).
 */
function mistoPro(p) {
  const dlazdice = p.closest('.dlazdice');
  if (dlazdice) {
    // QA 27. 9.: písmeno A)–E) (nebo jiný prvek) vedle výrazu v řádku bere místo — odečíst ho
    let misto = sirkaObsahu(dlazdice);
    const text = p.closest('.dlazdice__text');
    if (text && text !== p && getComputedStyle(text).flexDirection.startsWith('row')) {
      const ostatni = [...text.children].filter((c) => c !== p && !c.contains(p));
      misto -= ostatni.reduce((s, c) => s + c.getBoundingClientRect().width, 0)
        + ostatni.length * (parseFloat(getComputedStyle(text).columnGap) || 0);
    }
    return misto;
  }
  // blokový prvek (řádek zadání, display vzorec, řádek řešení): jeho vlastní obsah, ale nejvýš obsah
  // rodiče (flex/grid položka bez min-width: 0 by se roztáhla na šířku vzorce a nic by nenaměřila)
  const rodic = p.parentElement;
  const vlastni = getComputedStyle(p).display === 'inline' ? Infinity : sirkaObsahu(p);
  const zRodice = rodic ? sirkaObsahu(rodic) : Infinity;
  const misto = Math.min(vlastni, zRodice);
  return Number.isFinite(misto) ? misto : 0;
}
/**
 * Poměr místo / potřeba (< 1 = nevejde se). KaTeX kreslí odmocninu o 1–2 px za svůj box → tolerance 2 px;
 * při zmenšování v dlaždici jen 1 px (QA 27. 9.: vzorec 96 px v obsahu 94 px vyčníval do paddingu; o 1 / 2 sloupcích
 * dál rozhoduje tolerance 2 px, aby se rozložení lekcí P1–P4 neměnilo).
 */
function pomerMista(p, { zmensovani = false } = {}) {
  const misto = mistoPro(p);
  const potreba = p.scrollWidth;
  if (misto <= 0) return 1;
  return potreba > misto + (zmensovani && p.closest('.dlazdice') ? 1 : 2) ? misto / potreba : 1;
}
const pretekaPrvek = (p) => pomerMista(p) < 1;

/** Největší velikost písma (px) vzorců v prvcích — při měřítku 1 (před zmenšením). */
function pismoVzorcu(prvky) {
  let max = 0;
  for (const p of prvky) {
    for (const k of p.matches('.katex') ? [p] : p.querySelectorAll('.katex')) {
      max = Math.max(max, parseFloat(getComputedStyle(k).fontSize) || 0);
    }
  }
  return max;
}

/**
 * Poslední záchrana E1 (QA 27. 9.): vzorec, který se nevejde ani zmenšený na minimum čitelnosti, smí
 * přejít na další řádek — ale jen za znaménkem +, −, = mimo závorky (KaTeX dělí výraz na `.base` za každým
 * znaménkem na nejvyšší úrovni; báze uvnitř závorky a za ⋅ / × se slepí do nedělitelné `.vzorec-cast`).
 * Nikdy uprostřed závorky, zlomku ani čísla. Třída `.vzorec-zalomit` na prvku zapne zalamování (CSS).
 */
function seskupVzorec(katex) {
  const html = katex.querySelector('.katex-html');
  if (!html || html.dataset.skupiny) return;
  html.dataset.skupiny = '1';
  let hloubka = 0;
  let skupina = null;
  for (const b of [...html.children]) {
    if (!b.classList.contains('base')) { skupina = null; continue; }
    if (!skupina) {
      skupina = document.createElement('span');
      skupina.className = 'vzorec-cast';
      b.before(skupina);
    }
    skupina.append(b);
    let posledni = null;
    for (const c of b.children) {
      if (c.classList.contains('mopen')) hloubka += 1;
      else if (c.classList.contains('mclose')) hloubka = Math.max(0, hloubka - 1);
      if (!c.classList.contains('mspace') && !c.classList.contains('strut')) posledni = c;
    }
    const nasobeni = posledni?.classList.contains('mbin') && /[⋅·×]/.test(posledni.textContent);
    if (hloubka === 0 && !nasobeni) skupina = null;
  }
}
function povolZalomeni(prvek) {
  for (const k of prvek.matches('.katex') ? [prvek] : prvek.querySelectorAll('.katex')) {
    if (!k.parentElement?.closest('.katex')) seskupVzorec(k);
  }
  prvek.classList.add('vzorec-zalomit');
}

/**
 * Rozloží dlaždice kroku a zmenší vzorce tak, aby nikde nebyl posuvník ani zalomený vzorec (E1).
 * 1. Mřížka `.dlazdice-mrizka` (bez `--sloupec`): zkusí 2 sloupce; když se nejdelší možnost nevejde,
 *    přidá `.dlazdice-mrizka--jeden-sloupec` → VŠECHNY dlaždice kroku pod sebou (sloupce se nemíchají).
 * 2. Když se vzorec nevejde ani na celou šířku, nastaví CSS proměnnou `--meritko-vzorce`
 *    (0,6–1; jednotně pro celou mřížku, nebo zvlášť pro každý prvek s `jednotne: false`).
 *    Spodní mez: `minPismo` (px) = vzorec nikdy menší než minimum čitelnosti (DESIGN: 16 px), jinak `minMeritko`.
 * 3. `zalomit: true`: co se nevejde ani na spodní mezi, přejde na další řádek za +, −, = mimo závorky
 *    (`.vzorec-zalomit`; zadání, řešení a dlaždice kroku — v dlaždici až pod měřítkem 0,6, tj. detektivní řádek na telefonu).
 * Měří se jen „listy": prvek, který obsahuje jiný měřený prvek (odstavec s display vzorcem, `li` s `p`), se přeskočí.
 * Přepočítá se při změně šířky (ResizeObserver) a po načtení písem. Prvek nemusí být v DOM —
 * první výpočet proběhne, až dostane šířku.
 *
 * @param {HTMLElement} mrizka  `.dlazdice-mrizka`, nebo jiný kontejner (zadání, seznam voleb v tisku)
 * @param {object} [volby]
 * @param {string} [volby.vyraz='.dlazdice__vyraz']  co se měří (prvky uvnitř mřížky)
 * @param {boolean} [volby.sloupce=true]  přepínat 2 sloupce / 1 sloupec (jen pro .dlazdice-mrizka)
 * @param {boolean} [volby.jednotne=true]  jedno měřítko pro všechny prvky (dlaždice kroku) / každý zvlášť
 * @param {number} [volby.minMeritko=0.6]  spodní mez měřítka, když není `minPismo`
 * @param {number} [volby.minPismo=0]  spodní mez velikosti vzorce v px (má přednost před `minMeritko`)
 * @param {boolean} [volby.zalomit=false]  poslední záchrana: zalomit za +, −, = mimo závorky
 * @returns {() => void}  odpojí sledování (volat není nutné — při odebrání z DOM se nic neděje)
 * @example rozlozDlazdice(mrizka)                                              // dlaždice kroku
 * @example rozlozZadani(zadani)                                                // zadání / „Co vidí dítě" (níže)
 */
export function rozlozDlazdice(mrizka, {
  vyraz = '.dlazdice__vyraz', sloupce = true, jednotne = true, minMeritko = 0.6, minPismo = 0, zalomit = false,
} = {}) {
  const prvky = () => {
    const vse = [...mrizka.querySelectorAll(vyraz)].concat(mrizka.matches(vyraz) ? [mrizka] : []);
    return vse.filter((p) => !vse.some((q) => q !== p && p.contains(q)));
  };
  const smiSloupce = sloupce && mrizka.classList.contains('dlazdice-mrizka') && !mrizka.classList.contains('dlazdice-mrizka--sloupec');

  /** @returns {boolean} true = vejde se */
  function zmensi(cile, nastav) {
    const pismo = minPismo > 0 ? pismoVzorcu(cile) : 0;
    if (minPismo > 0 && !pismo) return !cile.some(pretekaPrvek); // bez vzorce není co zmenšit
    const mez = minPismo > 0 ? Math.min(1, minPismo / pismo) : minMeritko;
    let meritko = 1;
    for (let i = 0; i < 6; i += 1) {
      const pomery = cile.map((p) => pomerMista(p, { zmensovani: true })).filter((x) => x < 1);
      if (!pomery.length) return true;
      if (meritko <= mez) return false;
      meritko = Math.max(mez, meritko * Math.min(...pomery) * 0.98);
      nastav(meritko.toFixed(3));
    }
    return !cile.some(pretekaPrvek);
  }

  function prepocitej() {
    if (!mrizka.isConnected || mrizka.clientWidth === 0) return;
    const vse = prvky();
    // výchozí stav: 2 sloupce, plná velikost, bez zalomení
    mrizka.style.removeProperty('--meritko-vzorce');
    for (const p of vse) { p.style.removeProperty('--meritko-vzorce'); p.classList.remove('vzorec-zalomit'); }
    if (smiSloupce) {
      mrizka.classList.remove('dlazdice-mrizka--jeden-sloupec');
      if (vse.some(pretekaPrvek)) mrizka.classList.add('dlazdice-mrizka--jeden-sloupec');
    }
    if (jednotne) {
      if (!zmensi(vse, (m) => mrizka.style.setProperty('--meritko-vzorce', m)) && zalomit) {
        for (const p of vse) if (pretekaPrvek(p)) povolZalomeni(p);
      }
    } else {
      for (const p of vse) {
        if (!zmensi([p], (m) => p.style.setProperty('--meritko-vzorce', m)) && zalomit) povolZalomeni(p);
      }
      // řádky jednoho seznamu (Petrův výpočet v detektivovi) mají vzorce stejně velké — jako list v sešitě
      const seznamy = new Map();
      for (const p of vse) {
        const ol = p.closest('ol, ul');
        if (ol && mrizka.contains(ol)) seznamy.set(ol, [...(seznamy.get(ol) || []), p]);
      }
      for (const radky of seznamy.values()) {
        const m = Math.min(...radky.map((p) => parseFloat(p.style.getPropertyValue('--meritko-vzorce')) || 1));
        if (m < 1) for (const p of radky) p.style.setProperty('--meritko-vzorce', m.toFixed(3));
      }
    }
  }

  let sirka = -1;
  const pozorovatel = typeof ResizeObserver === 'function'
    ? new ResizeObserver((zaznamy) => {
      const w = Math.round(zaznamy[0].contentRect.width);
      if (w !== sirka) { sirka = w; prepocitej(); }
    })
    : null;
  pozorovatel?.observe(mrizka);
  // písma KaTeX se načítají až při prvním použití → přepočítat po každém dočtení písem
  const pisma = globalThis.document?.fonts;
  let bylVDom = false;
  const poPismech = () => {
    if (mrizka.isConnected) { bylVDom = true; sirka = -1; prepocitej(); } else if (bylVDom) odpojit();
  };
  pisma?.addEventListener?.('loadingdone', poPismech);
  pisma?.ready?.then(poPismech);
  function odpojit() { pozorovatel?.disconnect(); pisma?.removeEventListener?.('loadingdone', poPismech); }
  return odpojit;
}

/** Minimum čitelnosti vzorce po zmenšení (web/DESIGN.md: text ≥ 16 px). */
export const MIN_PISMO_VZORCE = 16;

/**
 * E1 pro text zadání (žák `.karta-ulohy__zadani`, rodič „Co vidí dítě"): display vzorce i řádky s vloženými
 * vzorci (odstavce, řádky Petrova výpočtu) se zmenší nejvýš na 16 px; co se nevejde ani tak, zalomí se
 * za +, −, = mimo závorky. Nikdy vodorovný posuvník.
 * @param {HTMLElement} uzel
 * @returns {() => void} odpojí sledování
 */
export function rozlozZadani(uzel) {
  return rozlozDlazdice(uzel, {
    vyraz: '.katex-display, p, li', sloupce: false, jednotne: false, minPismo: MIN_PISMO_VZORCE, zalomit: true,
  });
}
