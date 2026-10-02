// =====================================================================
// rodic-karta.js — karta úlohy na stránce rodiče (R17): přepínač úloh, stav žáka, úvod lekce
// v blocích (A1), karta úlohy jako očíslovaný postup 1–4 (A3), řešení jako výpočet (A4), papírový vstup.
// Čte starý i nový formát obsahu (R23: otazky string|{k,text}, uvod_pravidla, moznost.stitek).
//
// Funkce dostávají stav stránky `s` (objekt `stranka` z rodic.js) a vracejí DOM (R2).
// Nic tu nečte ani nepřekresluje celou stránku — o to se stará rodic.js přes callbacky.
// =====================================================================

import { el, ikona, toast, formatCas } from './ui.js';
import { h } from './hlasky.js';
import { zeZ } from './temata.js';
import { renderMarkdown, renderReseni, normalizujOtazku, finalKrok, rozlozDlazdice, rozlozZadani, NAZVY_TYPU } from './obsah.js';
import { vyhodnotKrok } from './vyhodnoceni.js';
import { ulozOdpoved } from './supabase.js';
import { vytvorVstupVyraz, vykresliPoradi, vytvorObrazek, vytvorPoradiRodic } from './vstupy-f1.js';
import { stitekPismene, vytvorSediNesedi, vytvorRysovaniRodic } from './vstupy-f2.js';
import { popisChyby, otazkaChyby } from './chyby.js';
import { jeVstupCj, jePapirCj, nahledKrokuCj, odpovedDiteteCj, vytvorPapirCj, vytvorSlovnicek } from './rodic-cj.js';

export const md = (text, inline = false) => renderMarkdown(text, { inline });

// E1: rozložení dlaždic a zmenšení vzorců (obsah.js) — úklid ResizeObserverů při přepnutí úlohy
let uklidy = [];
const rozloz = (prvek, volby) => { uklidy.push(rozlozDlazdice(prvek, volby)); return prvek; };
/** Odpojí sledování rozložení z minulé úlohy. Volá rodic.js před vykreslením další úlohy. */
export function uklidRozlozeni() {
  for (const f of uklidy) { try { f(); } catch { /* nic */ } }
  uklidy = [];
}

/**
 * Mřížka dlaždic stejně jako u žáka (lekce.js): štítek nad výrazem, detektiv / štítky v 1 sloupci,
 * rozložení E1. `interaktivni: false` = jen náhled („Co vidí dítě").
 * @returns {{mrizka: HTMLElement, tlacitka: HTMLButtonElement[], sloupec: boolean}}
 */
function vytvorDlazdice(uloha, moznosti, { interaktivni = true, vybrano = null, krok = null } = {}) {
  const sloupec = uloha?.typ === 'detektiv' || moznosti.some((m) => m.stitek) || Boolean(krok?.vstup?.pismena);
  const tlacitka = moznosti.map((m, i) => el('button', {
    class: ['dlazdice', sloupec && 'dlazdice--radek', vybrano === m.id && 'je-vybrano'], type: 'button',
    'aria-pressed': String(vybrano === m.id), dataset: { id: m.id }, disabled: !interaktivni, tabindex: interaktivni ? null : '-1',
  }, el('span', { class: 'dlazdice__text' },
    krok ? stitekPismene(krok, i) : null, // F2: A)–E), A/N, A)–F) (R39)
    m.stitek ? el('span', { class: 'dlazdice__stitek', text: m.stitek }) : null,
    el('span', { class: 'dlazdice__vyraz' }, md(m.text, true)))));
  const mrizka = rozloz(el('div', { class: ['dlazdice-mrizka', sloupec && 'dlazdice-mrizka--sloupec', !interaktivni && 'dlazdice-mrizka--nahled'] }, tlacitka), { zalomit: true });
  return { mrizka, tlacitka, sloupec };
}

/** Kontrolní úloha lekce: `semafor` (Matematika) nebo `kontrolni` (čeština, FORMAT-CJ §2) — rodič mlčí do odevzdání (R55, R58). */
export const jeKontrolniUloha = (uloha) => uloha?.typ === 'semafor' || uloha?.typ === 'kontrolni';

/**
 * „Co vidí dítě": zadání + kroky (popisek, dlaždice) — jen ke čtení, rozložení jako u žáka.
 * Čeština: nové vstupy vykreslí rodic-cj.js (vnořené dlaždice poslechu stejně jako tady); `papir` = přehrávač nahrávek.
 */
function vytvorCoVidiDite(uloha, { papir = false } = {}) {
  const det = vytvorRozbalovaci('obrazovka', h('rodic.co_vidi_dite'), uloha.zadani, { zadani: true });
  const obsah = det.querySelector('.rozbalovaci__obsah');
  uklidy.push(rozlozZadani(obsah)); // E1 jako u žáka (display vzorce i řádky Petrova výpočtu)
  obsah.append(vytvorObrazek(uloha, { popisek: true }) || ''); // F1: obrázek + „Na obrázku: …" pro rodiče
  for (const [i, k] of (uloha.kroky || []).entries()) {
    obsah.append(el('div', { class: 'co-vidi-dite__krok' },
      el('p', { class: 'co-vidi-dite__popisek' }, el('span', { class: 'krok__cislo', text: `Krok ${i + 1}` }), ' ', md(k.popisek || '', true)),
      k.vstup?.typ === 'dlazdice' ? vytvorDlazdice(uloha, k.vstup.moznosti || [], { interaktivni: false, krok: k }).mrizka : null,
      k.vstup?.typ === 'rysovani' ? el('p', { class: 'text-tlumeny', text: h('f2.co_vidi_rysovani') }) : null,
      k.vstup?.typ === 'poradi' ? el('div', { class: 'poradi poradi--nahled' }, vykresliPoradi(k).uzel) : null,
      k.vstup?.typ === 'poradi' ? vytvorPoradiRodic(k) : null, // R34: „Správně: ① … → ② …"
      jeVstupCj(k.vstup?.typ) ? nahledKrokuCj(k, {
        papir, dlazdice: (kd) => vytvorDlazdice(uloha, kd.vstup.moznosti || [], { interaktivni: false, krok: kd }).mrizka,
      }) : null));
  }
  return det;
}

const OTAZKA_UROVEN = ['vlastními slovy', 'první krok', 'mezikrok']; // pevná struktura L1–L3 (kostra/03)
/** Štítek otázky i: čeština má vlastní (obecná → test na slově → nápověda, FORMAT-CJ §4). */
const urovenOtazky = (s, i) => (s.lekce?.predmet === 'cestina' && i < 3 ? h(`cj.otazka_${i + 1}`) : OTAZKA_UROVEN[i] || '');

// ---------------------------------------------------------------------
// Drobné pomocné funkce
// ---------------------------------------------------------------------

/** Popisek kroku pro stav žáka, např. „krok 2". */
function nazevKroku(uloha, krokId) {
  const i = (uloha.kroky || []).findIndex((k) => k.id === krokId);
  return `krok ${i >= 0 ? i + 1 : (uloha.kroky || []).length}`;
}

/** Poslední odevzdaný krok úlohy (podle pořadí kroky[]), nebo null. */
function posledniKrok(s, uloha) {
  const zaznamy = s.poUlohach[uloha.id] || {};
  let posledni = null;
  (uloha.kroky || []).forEach((k) => { if (zaznamy[k.id]) posledni = zaznamy[k.id]; });
  return posledni;
}

/**
 * Sbalovací sekce `.rozbalovaci` (details/summary), obsah Markdown. Používá i souhrn (R8 kontrola).
 * @param {string} ikonaNazev
 * @param {string} nadpis
 * @param {string} text  Markdown
 * @param {{reseni?: boolean, otevreno?: boolean, inline?: boolean, vnorene?: boolean, zadani?: boolean}} [volby]
 *   vnorene = rozbalovací uvnitř jiného (vzorová odpověď); zadani = text zadání úlohy (styl `.zadani` jako u žáka)
 * @returns {HTMLDetailsElement}
 */
export function vytvorRozbalovaci(ikonaNazev, nadpis, text, {
  reseni = false, otevreno = false, inline = false, vnorene = false, zadani = false,
} = {}) {
  return el('details', { class: ['rozbalovaci', reseni && 'rozbalovaci--reseni', vnorene && 'rozbalovaci--vnorene'], open: otevreno },
    el('summary', null, ikona(ikonaNazev), nadpis, ikona('dolu', { trida: 'rozbalovaci__sipka' })),
    el('div', { class: ['rozbalovaci__obsah', zadani && 'zadani'] }, text ? md(text, inline) : null));
}

// ---------------------------------------------------------------------
// Přepínač úloh a stav žáka
// ---------------------------------------------------------------------

/**
 * „‹ Úloha 2 ze 4 ›".
 * @param {object} s  stav stránky
 * @param {(index: number) => void} naUlohu
 */
export function vytvorPrepinacUloh(s, naUlohu) {
  const i = s.ulohaIndex;
  const pocet = s.lekce.ulohy.length;
  const uloha = s.lekce.ulohy[i];
  return el('nav', { class: 'prepinac-uloh', 'aria-label': 'Úlohy' },
    el('button', {
      class: 'tlacitko tlacitko--sekundarni tlacitko--ikona', type: 'button',
      'aria-label': 'Předchozí úloha', disabled: i === 0, onClick: () => naUlohu(i - 1),
    }, ikona('sipka-vlevo')),
    el('div', { class: 'prepinac-uloh__nazev' },
      el('strong', { text: `Úloha ${i + 1} ${zeZ(pocet)} ${pocet}` }),
      el('span', { text: NAZVY_TYPU[uloha.typ] || uloha.typ })),
    el('button', {
      class: 'tlacitko tlacitko--sekundarni tlacitko--ikona', type: 'button', id: 'dalsiUlohaNahore',
      // F1: vpřed až po ①–④ (s.jenCteni = souhrn R19, tam se nic nezamyká)
      'aria-label': 'Další úloha', disabled: i === pocet - 1 || (!s.jenCteni && Boolean(coChybi(s, uloha))),
      onClick: () => naUlohu(i + 1),
    }, ikona('sipka-vpravo')));
}

/**
 * „Dítě odevzdalo: krok 2 ✔" + tlačítko Obnovit (kostra/04 bod 7).
 * @param {object} s
 * @param {object} uloha
 * @param {() => void} obnovit
 */
export function vytvorStavZaka(s, uloha, obnovit) {
  const posl = posledniKrok(s, uloha);
  let text;
  let spravne = null;
  if (!posl) {
    text = h('rodic.stav_nic');
  } else {
    spravne = posl.spravne;
    const nazev = nazevKroku(uloha, posl.krok_id);
    // kontrolní úloha: otázky až po odevzdání a u konkrétní chyby → odkaz na typickou chybu (ODPOVED po bodu E)
    const nesedi = jeKontrolniUloha(uloha) ? 'rodic.stav_nesedi_kontrolni' : 'rodic.stav_nesedi';
    text = spravne === false ? h(nesedi, { krok: nazev }) : h('rodic.stav_spravne', { krok: nazev });
  }
  const naposledy = s.posledniAktualizace ? h('rodic.stav_naposledy', { cas: formatCas(s.posledniAktualizace) }) : '';
  // R34: u kroků `poradi` pořadí, jak dítě klikalo (+ popis známé chyby a správné pořadí) — rodič ho najde tady,
  // když dítě „nesedí"
  const zaznamy = s.poUlohach?.[uloha.id] || {};
  const poradi = (uloha.kroky || []).filter((k) => k.vstup?.typ === 'poradi' && zaznamy[k.id])
    .map((k) => vytvorPoradiRodic(k, { odpoved: zaznamy[k.id], popisChyby }));
  // čeština: u nových vstupů co dítě vybralo / napsalo, co chybí, co je navíc, známá chyba + otázka (FORMAT-CJ §8)
  const odpovediCj = (uloha.kroky || []).filter((k) => jeVstupCj(k.vstup?.typ) && zaznamy[k.id] && zaznamy[k.id].zadal !== 'rodic')
    .map((k) => odpovedDiteteCj(k, zaznamy[k.id].hodnota, {
      popisChyby, otazkaChyby, nadpis: uloha.kroky.length > 1 ? nazevKroku(uloha, k.id).replace(/^k/, 'K') : null,
    }));
  return el('div', { class: 'stav-zaka', role: 'status' },
    ikona(spravne === false ? 'opakovat' : 'fajfka', { trida: 'ikona--velka stav-zaka__fajfka' }),
    el('div', { class: 'stav-zaka__text' },
      el('strong', { text }),
      naposledy && el('small', { text: naposledy }),
      poradi, odpovediCj),
    el('button', {
      class: 'tlacitko tlacitko--tiche tlacitko--ikona', type: 'button', 'aria-label': h('rodic.stav_obnovit'),
      onClick: () => obnovit(),
    }, ikona('obnovit')));
}

// ---------------------------------------------------------------------
// Tahák
// ---------------------------------------------------------------------

/** Otázky po příkladech (rozcvička A, B, C / podúlohy 15.1, 15.2): každá patří k jinému příkladu, ne úroveň 1–3. */
const RE_OTAZKA_PRIKLADU = /^([A-F]|\d+\.\d+)(?=$|[\s,])/;
export function otazkyPoPrikladech(uloha, otazky) {
  const n = (otazky || []).map(normalizujOtazku);
  return uloha?.typ === 'rozcvicka' && n.length > 0 && n.every(({ k }) => k && RE_OTAZKA_PRIKLADU.test(k));
}

function vytvorOtazky(s, uloha, otazky) {
  // bod E (testovací rodič T6, 2. kolo): u otázek po příkladech všechny najednou, jen se štítkem příkladu
  const poPrikladech = otazkyPoPrikladech(uloha, otazky);
  const odkryto = () => (poPrikladech ? otazky.length : s.otevrenoOtazek.get(uloha.id) || 1);
  const seznam = el('ol', { class: ['otazky', poPrikladech && 'otazky--po-prikladech'] }, otazky.map(normalizujOtazku).map(({ k, text }, i) => el('li', { class: 'otazka', hidden: i >= odkryto() },
    el('span', { class: 'otazka__uroven' },
      k ? el('span', { class: 'otazka__k', text: k }) : null, // R23: ke kterému příkladu/kroku otázka patří
      poPrikladech ? null : `Otázka ${i + 1} · ${urovenOtazky(s, i)}`),
    el('p', { class: 'otazka__text' }, md(text, true)))));

  const vse = () => odkryto() >= otazky.length;
  const btn = el('button', { class: 'tlacitko tlacitko--sekundarni tlacitko--cela-sirka', type: 'button', disabled: vse() },
    vse() ? h('rodic.vsechny_otazky') : h('rodic.dalsi_otazka'));
  btn.addEventListener('click', () => {
    const aktualni = odkryto();
    if (aktualni >= otazky.length) return;
    s.otevrenoOtazek.set(uloha.id, aktualni + 1);
    const polozka = seznam.children[aktualni];
    polozka.hidden = false;
    polozka.classList.add('je-nova');
    if (vse()) { btn.disabled = true; btn.textContent = h('rodic.vsechny_otazky'); }
  });
  if (poPrikladech) btn.hidden = true; // všechny otázky jsou vidět, tlačítko „Další otázka" nemá smysl
  return [seznam, btn, poPrikladech];
}

/**
 * H4 (R29): znak žebříčku „Platí:" přes KaTeX (inline). Zlomek (`\frac`) se sází v \displaystyle a tučně
 * (\boldsymbol), aby čitatel i jmenovatel vypadaly jako ostatní (tučné) znaky (CSS `.zebricek__znak--zlomek`).
 */
function znakZebricku(znak) {
  const text = String(znak ?? '');
  const zlomek = /\$[^$]*\\frac/.test(text);
  const tex = zlomek ? text.replace(/\$([^$]+)\$/g, (m, t) => (/\\frac/.test(t) ? `$\\displaystyle\\boldsymbol{${t}}$` : m)) : text;
  return el('span', { class: ['zebricek__znak', zlomek && 'zebricek__znak--zlomek'] }, md(tex, true));
}

/** Podíl šířky řádku, nad kterým jde text žebříčku pod znak (zadavatel 27. 9., bod E). */
const ZEBRICEK_POD_SEBOU = 0.35;

/**
 * Žebříček „Platí:" na úzkém displeji: když je nejširší znak (přirozená šířka, na jeden řádek) širší než 35 %
 * řádku, dostane celý žebříček `.zebricek--pod-sebou` (text pod znakem) — jednotně pro všechny řádky.
 * Měří se až při zobrazení (úvod bývá sbalený v <details>), znovu při změně šířky a po dočtení písem.
 * @param {HTMLElement} zebricek
 * @returns {HTMLElement}
 */
function hlidejZebricek(zebricek) {
  if (typeof ResizeObserver !== 'function') return zebricek;
  let sirka = -1;
  const zmer = () => {
    const w = zebricek.clientWidth;
    if (!w || w === sirka) return;
    sirka = w;
    const znaky = [...zebricek.querySelectorAll('.zebricek__znak')];
    for (const z of znaky) z.classList.add('zebricek__znak--mereni');
    const nejsirsi = Math.max(0, ...znaky.map((z) => z.getBoundingClientRect().width));
    for (const z of znaky) z.classList.remove('zebricek__znak--mereni');
    zebricek.classList.toggle('zebricek--pod-sebou', nejsirsi > w * ZEBRICEK_POD_SEBOU);
  };
  new ResizeObserver(zmer).observe(zebricek);
  // písma KaTeX a Sora se dočítají později → znaky zširoknou; změřit znovu po každém dočtení písem
  const znovu = () => { if (zebricek.isConnected) { sirka = -1; zmer(); } };
  globalThis.document?.fonts?.addEventListener?.('loadingdone', znovu);
  globalThis.document?.fonts?.ready?.then(znovu);
  return zebricek;
}

/**
 * A1 (R23): úvod lekce v blocích — 1 věta, žebříček „Platí:" z `uvod_pravidla` (velké číslice,
 * znak + slovo) a rámeček „Pravidla pro vás" (hlášky, stejný v každé lekci).
 * Starý formát (dlouhý `uvod_pro_rodice`, bez `uvod_pravidla`) se vykreslí jako odstavec.
 */
export function vytvorUvod(lekce) {
  const pravidla = Array.isArray(lekce.uvod_pravidla) ? lekce.uvod_pravidla : [];
  return el('section', { class: 'uvod-lekce', 'aria-labelledby': 'uvodNadpis' },
    el('h2', { class: 'uvod-lekce__nadpis', id: 'uvodNadpis', text: h('rodic.uvod_nadpis') }),
    lekce.uvod_pro_rodice ? el('div', { class: 'uvod-lekce__veta' }, md(lekce.uvod_pro_rodice)) : null,
    pravidla.length ? hlidejZebricek(el('div', { class: 'zebricek' },
      el('p', { class: 'zebricek__nadpis', text: h('rodic.plati') }),
      el('ol', { class: 'zebricek__kroky' }, pravidla.map((p, i) => el('li', { class: 'zebricek__krok' },
        el('span', { class: 'zebricek__cislo', 'aria-hidden': 'true', text: String(i + 1) }),
        znakZebricku(p.znak),
        el('span', { class: 'zebricek__text' }, md(String(p.text ?? ''), true))))))) : null,
    vytvorSlovnicek(lekce), // čeština: „Co ta slova znamenají" (slovnicek_pro_rodice); Matematika ho nemá
    el('div', { class: 'pravidla-rodic' },
      el('p', { class: 'pravidla-rodic__nadpis' }, ikona('info'), h('rodic.pravidla_nadpis')),
      el('ul', { class: 'pravidla-rodic__seznam' },
        ['rodic.pravidla_1', 'rodic.pravidla_2', 'rodic.pravidla_3'].map((k) => el('li', { text: h(k) })))));
}

// ---------------------------------------------------------------------
// F1: postup ①–④ s odškrtáváním — stav jen v localStorage (sezení × úloha), do DB nic nového.
// Semafor uložený v DB (s.barvy) = celá úloha hotová (i na jiném zařízení).
// ---------------------------------------------------------------------

const klicPostupu = (s, uloha) => `spolu.postup.${s.sezeni?.id}.${uloha.id}`;

/** Uložený stav postupu úlohy: {hotovo: ['cteni', …], otazka: bool (rodič použil otázku)}. */
function nactiPostup(s, uloha) {
  try {
    const x = JSON.parse(localStorage.getItem(klicPostupu(s, uloha)) || 'null');
    return { hotovo: Array.isArray(x?.hotovo) ? x.hotovo : [], otazka: Boolean(x?.otazka) };
  } catch { return { hotovo: [], otazka: false }; }
}

function ulozPostup(s, uloha, stav) {
  try { localStorage.setItem(klicPostupu(s, uloha), JSON.stringify(stav)); } catch { /* bez úložiště jen do obnovení */ }
}

/** Klíče kroků, které úloha má (② jen s otázkami, ③ jen s otočenou rolí). */
export function krokyUlohy(uloha) {
  const t = uloha.tahak || {};
  return ['cteni', t.otazky?.length && 'otazky', t.otocena_role && 'otocena', 'semafor'].filter(Boolean);
}

/** Množina hotových kroků; semafor v DB (nebo kliknutý tady) znamená hotovou celou úlohu. */
function hotoveKroky(s, uloha) {
  if (s.barvy?.[uloha.id]) return new Set(krokyUlohy(uloha));
  return new Set(nactiPostup(s, uloha).hotovo);
}

/**
 * Brána „Další úloha": text, co ještě chybí, nebo null (úloha je hotová).
 * @param {object} s
 * @param {object} uloha
 * @returns {string|null}
 */
export function coChybi(s, uloha) {
  const klice = krokyUlohy(uloha);
  const hotovo = hotoveKroky(s, uloha);
  const chybi = klice.findIndex((k) => !hotovo.has(k));
  if (chybi < 0) return null;
  return klice[chybi] === 'semafor' ? h('rodic.chybi_semafor') : h('rodic.chybi_krok', { n: chybi + 1 });
}

/** Jeden očíslovaný krok postupu rodiče jako rozbalovací blok (F1). */
function krokPostupu(klic, cislo, nadpis, obsah) {
  const znak = el('span', { class: 'postup-rodice__cislo', 'aria-hidden': 'true', text: String(cislo) });
  const stavText = el('span', { class: 'jen-ctecka' });
  const detail = el('details', { class: 'postup-rodice__detail' },
    el('summary', { class: 'postup-rodice__hlavicka' },
      znak, el('h2', { class: 'postup-rodice__nadpis', text: nadpis }), stavText,
      ikona('dolu', { trida: 'rozbalovaci__sipka postup-rodice__sipka' })),
    el('div', { class: 'postup-rodice__obsah' }, ...obsah));
  const li = el('li', { class: 'postup-rodice__krok', dataset: { krok: klic } }, detail);
  return { klic, cislo, li, detail, znak, stavText };
}

/**
 * A3 + F1: karta úlohy rodiče jako očíslovaný postup s odškrtáváním:
 * „O co jde" nahoře → ① Dítě čte a řeší [Hotovo] → ② Zasekne se? otázky L1→L3 [Hotovo | Nezaseklo se]
 * → ③ otočená role [Hotovo] → ④ (papír: Výsledek dítěte) + semafor (volba = fajfka).
 * Aktivní (rozbalený) je vždy jen první nehotový krok; hotový krok jde znovu rozbalit.
 * Typická chyba a řešení níž, sbalené.
 * @param {object} s
 * @param {object} uloha
 * @param {{semafor: Element, papir?: Element|null, rysovani?: Element|null, coZadalo?: Element|null, poZmene?: () => void}} casti
 *   semafor/papir = hotové bloky z rodic-souhrn.js / vytvorPapir(); coZadalo = po bloku „Dítě zadalo:" v kroku ①
 *   (rodic-blok.js); poZmene = překreslit bránu „Další úloha"
 */
export function vytvorKartuUlohy(s, uloha, { semafor, papir = null, rysovani = null, coZadalo = null, poZmene = () => {} }) {
  const t = uloha.tahak || {};
  const bloky = [];
  const tlacitko = (text, klic, trida = 'tlacitko--primarni', extra = {}) => el('button', {
    class: ['tlacitko', trida, 'tlacitko--cela-sirka'], type: 'button', onClick: () => oznac(klic, extra),
  }, ikona('fajfka'), text);
  // R46: procházení po bloku na čas — dítě už úlohu vyřešilo; ① ukáže, co zadalo, ② se ptá „Nesedělo to?"
  const poBloku = s.blok?.faze === 'po';
  const nadpis1 = poBloku ? h(s.rezim === 'papir' ? 'blok.postup_1_papir' : 'blok.postup_1')
    : h(jeKontrolniUloha(uloha) ? 'rodic.postup_1_kontrolni' : 'rodic.postup_1');

  bloky.push(krokPostupu('cteni', bloky.length + 1, nadpis1, [
    coZadalo,
    uloha.zadani ? vytvorCoVidiDite(uloha, { papir: s.rezim === 'papir' }) : null,
    tlacitko(h('rodic.krok_hotovo'), 'cteni'),
  ]));
  if (t.otazky?.length) {
    const [seznam, dalsi, poPrikladech] = vytvorOtazky(s, uloha, t.otazky);
    dalsi.addEventListener('click', () => { const st = nactiPostup(s, uloha); st.otazka = true; ulozPostup(s, uloha, st); obnov(); });
    bloky.push(krokPostupu('otazky', bloky.length + 1, h(poBloku ? 'blok.postup_2' : 'rodic.postup_2'), [
      el('p', { class: 'postup-rodice__pozn', text: h(poPrikladech ? 'rodic.postup_2_pozn_priklady' : 'rodic.postup_2_pozn') }), seznam, dalsi,
      el('div', { class: 'postup-rodice__akce' },
        tlacitko(h('rodic.krok_hotovo'), 'otazky', 'tlacitko--primarni', { otazka: true }),
        tlacitko(h(poBloku ? 'blok.nezaseklo' : 'rodic.nezaseklo'), 'otazky', 'tlacitko--sekundarni')),
    ]));
  }
  if (t.otocena_role) {
    bloky.push(krokPostupu('otocena', bloky.length + 1, h('rodic.postup_3'), [
      el('div', { class: 'otazka otazka--otocena' }, el('p', { class: 'otazka__text' }, md(t.otocena_role, true))),
      // R21: vzorová odpověď dítěte — rodič bez matematiky pozná, zda dítě vysvětlilo správně
      t.otocena_role_odpoved ? vytvorRozbalovaci('fajfka', h('rodic.otocena_odpoved'), t.otocena_role_odpoved, { vnorene: true }) : null,
      tlacitko(h('rodic.krok_hotovo'), 'otocena'),
    ]));
  }
  // ④ papírový výsledek patří před semafor (F1); F2 rýsování: rodič porovná s obrázkem (Sedí / Nesedí) před semaforem
  bloky.push(krokPostupu('semafor', bloky.length + 1, h('rodic.postup_4'), [rysovani, papir, semafor]));

  // jemná nápověda u „Potřeboval(a) otázku", když rodič otázky použil (nic se nepředvybírá)
  const napoveda = el('span', { class: 'semafor-volba__napoveda', text: h('rodic.pouzili_otazku'), hidden: true });
  semafor.querySelector('.semafor-volba[data-volba="s_otazkou"]')?.append(napoveda);

  function obnov({ otevritAktivni = false } = {}) {
    const hotovo = hotoveKroky(s, uloha);
    const aktivni = bloky.find((b) => !hotovo.has(b.klic)) || null;
    for (const b of bloky) {
      const je = hotovo.has(b.klic);
      b.li.classList.toggle('je-hotovo', je);
      b.li.classList.toggle('je-aktivni', b === aktivni);
      b.znak.replaceChildren(je ? ikona('fajfka') : String(b.cislo));
      b.stavText.textContent = je ? ` (${h('rodic.krok_hotovo_stav')})` : '';
      if (otevritAktivni) b.detail.open = b === aktivni;
    }
    napoveda.hidden = !nactiPostup(s, uloha).otazka;
  }

  function oznac(klic, { otazka = false } = {}) {
    const st = nactiPostup(s, uloha);
    if (!st.hotovo.includes(klic)) st.hotovo.push(klic);
    if (otazka) st.otazka = true;
    ulozPostup(s, uloha, st);
    obnov({ otevritAktivni: true });
    const aktivni = bloky.find((b) => b.li.classList.contains('je-aktivni'));
    aktivni?.li.scrollIntoView({ behavior: 'smooth', block: 'start' });
    poZmene();
  }

  // rodic.js po volbě semaforu zavolá (semafor = ④ hotový, sbalit, nic dalšího neotvírat)
  s.obnovPostup = () => obnov({ otevritAktivni: true });
  obnov({ otevritAktivni: true });

  const pomucky = [];
  if (t.typicka_chyba) pomucky.push(vytvorRozbalovaci('pozor', 'Typická chyba', t.typicka_chyba));
  if (t.reseni) {
    const reseni = vytvorRozbalovaci('oko', h('rodic.ukazat_reseni'), '', { reseni: true });
    reseni.querySelector('.rozbalovaci__obsah').replaceChildren(renderReseni(t.reseni)); // A4 (R23)
    pomucky.push(reseni);
  }

  return el('div', { class: 'tahak' },
    // F1: „Než začnete" vždy pod šipkou; rozbalené jen při úplně prvním otevření lekce na zařízení
    // (s.uvodOtevrit nastaví rodic.js), u 1. úlohy
    el('details', { class: 'rozbalovaci rozbalovaci--uvod', open: Boolean(s.uvodOtevrit && s.ulohaIndex === 0) },
      el('summary', null, ikona('info'), h('rodic.uvod_nadpis'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
      el('div', { class: 'rozbalovaci__obsah' }, vytvorUvod(s.lekce))),
    t.vysvetleni ? el('section', { class: 'tahak__sekce tahak__sekce--vysvetleni' },
      el('h2', { class: 'tahak__nadpis' }, ikona('zarovka'), 'O co jde'),
      el('div', null, md(t.vysvetleni))) : null,
    el('ol', { class: 'postup-rodice' }, bloky.map((b) => b.li)),
    pomucky.length ? el('section', { class: 'tahak__pomucky', 'aria-label': h('rodic.pro_jistotu') },
      el('h2', { class: 'nadpis-sekce', text: h('rodic.pro_jistotu') }), pomucky) : null);
}


// ---------------------------------------------------------------------
// Režim papír — „Výsledek dítěte" (agenti/07 bod 5)
// ---------------------------------------------------------------------

/**
 * Vstup stejného typu jako final krok úlohy, předvyplněný poslední hodnotou od rodiče.
 * @returns {{uzel: Element, ziskej: () => any, oznacStav: (trida: string|null) => void}}
 */
export function vytvorVstupFinal(krok, predchozi) {
  const typ = krok.vstup?.typ;
  const hodnotaPredchozi = predchozi?.hodnota;
  const stavObalu = (uzel) => (trida) => {
    uzel.classList.remove('je-spravne', 'je-nesedi');
    if (trida) uzel.classList.add(trida);
  };
  const cislo = (popisek, trida = '') => el('input', {
    class: ['pole pole--cislo', trida], inputmode: 'numeric', autocomplete: 'off', 'aria-label': popisek,
  });

  if (typ === 'cislo') {
    const input = el('input', { class: 'pole pole--cislo', inputmode: 'decimal', autocomplete: 'off', 'aria-label': 'Výsledek dítěte' });
    if (hodnotaPredchozi !== undefined && hodnotaPredchozi !== null) input.value = String(hodnotaPredchozi).replace('.', ',');
    const jednotka = krok.vstup.jednotka;
    const uzel = jednotka
      ? el('div', { class: 'pole-cislo' }, input, el('span', { class: 'pole-cislo__jednotka', text: jednotka }))
      : input;
    return { uzel, ziskej: () => input.value, oznacStav: stavObalu(uzel) };
  }

  if (typ === 'zlomek' || typ === 'smisene') {
    const c = cislo('Čitatel');
    const j = cislo('Jmenovatel');
    if (hodnotaPredchozi) { c.value = hodnotaPredchozi.c ?? ''; j.value = hodnotaPredchozi.j ?? ''; }
    const zlomek = el('div', { class: 'zlomek-vstup', role: typ === 'zlomek' ? 'group' : null, 'aria-label': typ === 'zlomek' ? 'Výsledek dítěte, zlomek' : null },
      c, el('span', { class: 'zlomek-vstup__cara', 'aria-hidden': 'true' }), j);
    if (typ === 'zlomek') return { uzel: zlomek, ziskej: () => ({ c: c.value, j: j.value }), oznacStav: stavObalu(zlomek) };
    const cela = cislo('Celá část', 'smisene-vstup__cela');
    if (hodnotaPredchozi) cela.value = hodnotaPredchozi.cela ?? '';
    const uzel = el('div', { class: 'smisene-vstup', role: 'group', 'aria-label': 'Výsledek dítěte, smíšené číslo' }, cela, zlomek);
    return { uzel, ziskej: () => ({ cela: cela.value, c: c.value, j: j.value }), oznacStav: stavObalu(uzel) };
  }

  // čeština: poslech s vnořenými dlaždicemi = dlaždice (rodič klikne, co dítě zakroužkovalo)
  const dlazdicePoslechu = typ === 'poslech' && krok.vstup.vnoreny_vstup?.typ === 'dlazdice';
  if (typ === 'dlazdice' || dlazdicePoslechu) {
    let vybrano = typeof hodnotaPredchozi === 'string' ? hodnotaPredchozi : null;
    const krokDlazdic = dlazdicePoslechu ? { ...krok, vstup: krok.vstup.vnoreny_vstup } : krok;
    // stejné dlaždice jako u žáka (štítek, 1 sloupec u řádků, rozložení E1)
    const { mrizka, tlacitka } = vytvorDlazdice(null, krokDlazdic.vstup.moznosti || [], { vybrano, krok: krokDlazdic });
    for (const btn of tlacitka) {
      btn.addEventListener('click', () => {
        vybrano = btn.dataset.id;
        for (const t of tlacitka) {
          t.classList.toggle('je-vybrano', t === btn);
          t.classList.remove('je-spravne', 'je-nesedi'); // nová volba ruší předchozí vyhodnocení
          t.setAttribute('aria-pressed', String(t === btn));
        }
      });
    }
    return {
      uzel: mrizka,
      ziskej: () => vybrano,
      oznacStav: (trida) => {
        for (const t of tlacitka) t.classList.remove('je-spravne', 'je-nesedi');
        const vybranyBtn = tlacitka.find((t) => t.dataset.id === vybrano);
        if (trida && vybranyBtn) vybranyBtn.classList.add(trida);
      },
    };
  }

  if (typ === 'vyraz') {
    // F1: rodič opíše výraz z papíru; náhled KaTeX ukáže, jak ho aplikace čte
    const v = vytvorVstupVyraz(krok, { ariaLabel: 'Výsledek dítěte, výraz' });
    if (typeof hodnotaPredchozi === 'string') v.nastav(hodnotaPredchozi);
    return {
      uzel: v.uzel,
      ziskej: () => v.hodnota().vyhodnoceni,
      oznacStav: (trida) => v.oznac(trida === 'je-spravne' ? 'spravne' : trida === 'je-nesedi' ? 'nesedi' : null),
    };
  }

  // text
  const input = el('input', { class: 'pole', autocomplete: 'off', 'aria-label': 'Výsledek dítěte' });
  if (typeof hodnotaPredchozi === 'string') input.value = hodnotaPredchozi;
  return { uzel: input, ziskej: () => input.value, oznacStav: stavObalu(input) };
}

/** Odpovědi rodiče na final krok úlohy (DB + fronta), od nejstarší. */
function odpovediRodice(s, uloha) {
  return (s.odpovedi || []).filter((o) => o.uloha_id === uloha.id && o.krok_id === 'final' && o.zadal === 'rodic');
}

/**
 * Sekce „Výsledek dítěte (papír)": vstup typu final → vyhodnotKrok → ulozOdpoved(zadal 'rodic').
 * `pokus` rodiče roste (unikátní klíč v DB) — počítá se z DB, z fronty i z lokálního čítače,
 * aby se nový zápis nezahodil jako duplicita, když předchozí ještě čeká ve frontě.
 * @param {object} s
 * @param {object} uloha
 * @param {() => Promise<void>} poUlozeni  typicky tiché obnovení stavu (rodic.js)
 */
export function vytvorPapir(s, uloha, poUlozeni) {
  const krok = finalKrok(uloha);
  if (!krok) return null;
  // F2 rýsování: výsledek se neopisuje, rodič porovná s obrázkem (vytvorRysovaniLekce); zbývá jen případné poradi
  if (krok.vstup?.typ === 'rysovani') {
    const poradi = (uloha.kroky || []).filter((k) => k.vstup?.typ === 'poradi').map((k) => vytvorPapirPoradi(s, uloha, k, poUlozeni));
    return poradi.length ? el('div', { class: 'zasobnik' }, poradi) : null;
  }

  const predchozi = odpovediRodice(s, uloha).at(-1) || null;
  // čeština (FORMAT-CJ §3.2): nové vstupy rodič nepřepisuje — „Správně je: …" + Sedí / Nesedí ({ rodic: … })
  if (jePapirCj(krok)) {
    return vytvorPapirCj({
      krok, vybrano: predchozi?.hodnota?.rodic ?? null,
      onVolba: (hodnota) => ulozVolbuRodice(s, uloha, krok.id, hodnota, vyhodnotKrok(krok, hodnota).spravne, poUlozeni),
    });
  }
  const vstup = vytvorVstupFinal(krok, predchozi);
  const chyba = el('p', { class: 'pole-chyba', hidden: true }, ikona('pozor'), el('span', { text: h('rodic.papir_neplatne') }));
  const poznamka = el('p', { class: 'text-tlumeny', hidden: true });
  const tlacitko = el('button', { class: 'tlacitko tlacitko--navy tlacitko--cela-sirka', type: 'button' }, 'Vyhodnotit');

  tlacitko.addEventListener('click', async () => {
    const hodnota = vstup.ziskej();
    const vysledek = vyhodnotKrok(krok, hodnota);
    chyba.hidden = true;
    poznamka.hidden = true;
    vstup.oznacStav(null);
    if (vysledek.neplatne) { chyba.hidden = false; return; }

    vstup.oznacStav(vysledek.spravne === false ? 'je-nesedi' : 'je-spravne');
    // R43: u výrazu „hodnota sedí, ale…“ = nesedí (zjednodus, roznasob, neni-soucin); nezkrácený zlomek = správně s poznámkou
    const klicPoznamky = { nezkraceno: 'zak.spravne_zkrat', zjednodus: 'rodic.vyraz_zjednodus', roznasob: 'rodic.vyraz_roznasob', 'neni-soucin': 'rodic.vyraz_soucin' }[vysledek.poznamka];
    if (klicPoznamky) { poznamka.textContent = h(klicPoznamky); poznamka.hidden = false; }

    const dosud = odpovediRodice(s, uloha).reduce((max, o) => Math.max(max, Number(o.pokus) || 0), 0);
    const pokus = Math.max(dosud, s.pokusRodice[uloha.id] || 0) + 1;
    s.pokusRodice[uloha.id] = pokus;

    tlacitko.disabled = true;
    tlacitko.classList.add('je-nacitani');
    try {
      await ulozOdpoved({
        sezeniId: s.sezeni.id, ulohaId: uloha.id, krokId: 'final',
        hodnota, spravne: vysledek.spravne, typChyby: vysledek.typ_chyby, pokus, zadal: 'rodic',
      });
      await poUlozeni();
      toast(h('chyba.ulozeni_ok'));
    } catch (e) {
      toast(e.message || h('chyba.ulozeni'), { typ: 'varovani' });
    } finally {
      tlacitko.disabled = false;
      tlacitko.classList.remove('je-nacitani');
    }
  });

  return el('div', { class: 'zasobnik' },
    (uloha.kroky || []).filter((k) => k.vstup?.typ === 'poradi').map((k) => vytvorPapirPoradi(s, uloha, k, poUlozeni)),
    el('section', { class: 'tahak__sekce' },
      el('h2', { class: 'tahak__nadpis' }, ikona('tuzka'), h('rodic.papir_nadpis')),
      el('p', { class: 'text-tlumeny', text: h('rodic.papir_vysledek') }),
      vstup.uzel, chyba, poznamka, tlacitko));
}

/**
 * F1 `poradi` v papírovém režimu (osnova §6.3): rodič nic nezadává — vidí výraz se správným pořadím
 * (štítky 1–n; víc povolených pořadí pod sebou) a klikne Sedí / Nesedí. Ukládá se jako odpověď rodiče
 * na tento krok (hodnota 'sedi' | 'nesedi'), `typ_chyby` se neukládá.
 */
/** Uloží rodičovu volbu u kroku (Sedí / Nesedí u `poradi` a `rysovani`) jako odpověď rodiče s rostoucím `pokus`. */
async function ulozVolbuRodice(s, uloha, krokId, hodnota, spravne, poUlozeni) {
  const dosud = (s.odpovedi || []).filter((o) => o.uloha_id === uloha.id && o.krok_id === krokId && o.zadal === 'rodic')
    .reduce((max, o) => Math.max(max, Number(o.pokus) || 0), 0);
  const klic = `${uloha.id}/${krokId}`;
  const pokus = Math.max(dosud, s.pokusRodice[klic] || 0) + 1;
  s.pokusRodice[klic] = pokus;
  try {
    await ulozOdpoved({ sezeniId: s.sezeni.id, ulohaId: uloha.id, krokId, hodnota, spravne, typChyby: null, pokus, zadal: 'rodic' });
    await poUlozeni();
    toast(h('chyba.ulozeni_ok'));
  } catch (e) {
    toast(e.message || h('chyba.ulozeni'), { typ: 'varovani' });
  }
}

function vytvorPapirPoradi(s, uloha, krok, poUlozeni) {
  const povolena = krok.spravne?.poradi || [];
  const predchozi = (s.odpovedi || []).filter((o) => o.uloha_id === uloha.id && o.krok_id === krok.id && o.zadal === 'rodic').at(-1);
  // komponenta Sedí / Nesedí je sdílená s rýsováním (vstupy-f2.js)
  const volba = vytvorSediNesedi({
    volby: [{ hodnota: 'sedi', text: h('rodic.poradi_sedi'), ikona: 'fajfka' }, { hodnota: 'nesedi', text: h('rodic.poradi_nesedi'), ikona: 'opakovat' }],
    vybrano: predchozi?.hodnota ?? null, trida: 'poradi__sedi',
    onVolba: (hodnota) => ulozVolbuRodice(s, uloha, krok.id, hodnota, hodnota === 'sedi', poUlozeni),
  });
  return el('section', { class: 'tahak__sekce' },
    el('h2', { class: 'tahak__nadpis' }, ikona('tuzka'), h('rodic.poradi_papir_nadpis')),
    el('p', { class: 'text-tlumeny' }, md(krok.popisek || '', true)),
    el('p', { class: 'text-tlumeny', text: h(povolena.length > 1 ? 'rodic.poradi_papir_vice' : 'rodic.poradi_papir_text') }),
    povolena.map((p) => el('div', { class: 'poradi poradi--nahled' }, vykresliPoradi(krok, { poradi: p }).uzel)),
    volba.uzel);
}

/**
 * F2 rýsování (R38) v běžné lekci a bloku: obrázek řešení + kontrolní otázky + Sedí / Nesedí. Volba se uloží
 * jako odpověď rodiče na krok `rysovani` (spravne true/false) — semafor ji bere jako poslední odpověď `final`.
 * V aplikaci i na papíře (rodič nic nerýsuje ani nepočítá).
 * @returns {HTMLElement|null}
 */
export function vytvorRysovaniLekce(s, uloha, poUlozeni) {
  const krok = (uloha.kroky || []).find((k) => k.vstup?.typ === 'rysovani');
  if (!krok) return null;
  const odpovedi = (s.odpovedi || []).filter((o) => o.uloha_id === uloha.id && o.krok_id === krok.id);
  const rodic = odpovedi.filter((o) => o.zadal === 'rodic').at(-1) || null;
  const dite = odpovedi.some((o) => (o.zadal || 'dite') === 'dite');
  return vytvorRysovaniRodic(uloha, {
    vybrano: rodic?.hodnota ?? null,
    ceka: s.rezim === 'app' && !dite,
    onVolba: (hodnota) => ulozVolbuRodice(s, uloha, krok.id, hodnota, hodnota === 'sedi', poUlozeni),
  });
}
