// =====================================================================
// lekce.js — obrazovka 6 z kostra/04: lekce žáka (lekce.html?lekce=P1&dite=…&rezim=app|papir)
//
// Průběh: úlohy × kroky (matematika 4, čeština Spolu 8 5 úloh — počet vždy z dat; vstupy češtiny ve vstupy-cj.js); každá odpověď se hned ukládá (ulozOdpoved, rostoucí `pokus`);
// max 2 pokusy na krok, pak další krok. Správný výsledek se žákovi NIKDY neukazuje.
// Obnovení: načte stavSezeni() (+ neodeslanou frontu ze sessionStorage) a pokračuje prvním
// nevyřešeným krokem. Žádné skóre, procenta ani „Nevím". Odpočet je jen doporučení.
// Vývoj: ?lokalne=1 čte obsah ze souboru; když sezení nejde založit (lekce není v DB),
// běží stránka bez ukládání s viditelnou poznámkou.
// =====================================================================

import {
  el, ikona, toast, param, chranStranku, napojFrontuUkladani, nacitani, chybaStranky, aktualniStranka,
} from './ui.js';
import { h } from './hlasky.js';
import { nacistKnihovny, nactiLekciObsah, renderMarkdown, rozlozDlazdice, rozlozZadani, NAZVY_TYPU } from './obsah.js';
import { pripravenoDnes, vykresliPripravit } from './pripravit.js';
import { jeDiagnostika } from './diagnostika.js';
import { sestavSouhrnOsma, mapaKapitolNaTemata, cislaTemat } from './doporuceni.js';
import { zeZ } from './temata.js';
import { najdiSezeniDiagnostiky, vykresliPrestavku, vykresliKonecDiagnostiky, prestavkaPo } from './diagnostika-zak.js';
import { vytvorVstupVyraz, vytvorVstupPoradi, vytvorObrazek } from './vstupy-f1.js';
import { stitekPismene, vytvorVstupRysovani } from './vstupy-f2.js';
import { jeSimulace, jeBlok } from './simulace.js';
import {
  casCasti, spustOdpocetSimulace, vykresliStartSimulace, vykresliKonecCasti1, vykresliKonecSimulace,
  vykresliPapirSimulace, vysledekProDite, posledniSezeniCasti,
} from './simulace-zak.js';
import { vyhodnotKrok, normalizujCislo, barvaSemaforu } from './vyhodnoceni.js';
import { TYPY_VSTUPU_CJ } from './vyhodnoceni-cj.js';
import { vytvorVstupCj, hlaskaNeplatneCj } from './vstupy-cj.js';
import {
  mojeDeti, aktualniSezeni, zacitSezeni, stavSezeni, ulozOdpoved, neulozeneOdpovedi, platneSezeni, lekceProDite,
  ulozSemafor, dokoncitSezeni, katalogLekci,
} from './supabase.js';
import { lzeSamo, volbaSamo, napovedaZOtazky, napovedyAzPoPokusu, MAX_NAPOVED } from './samo.js';
import { popisChyby, jeDetektivniChyba } from './chyby.js';
import { sestavSouhrn } from './rodic-souhrn.js';
import { spocitejOdznaky } from './odznaky.js';
import { ukazNoveOdznaky } from './odznaky-ui.js';
import { ziskejDite, nastavDite } from './role.js';
import { napojMenu, nastavPredmet } from './menu.js';
import { predmetLekce } from './predmet.js';
import { pripojKlavesnici } from './klavesnice.js';

const MAX_POKUSU = 2;
/** Diagnostika (R37): 1 pokus na úlohu, neutrální „Uloženo.“ */
const maxPokusu = () => (stav.diag || stav.sim ? 1 : MAX_POKUSU);
/** Diagnostika a simulace (R37, R38): neutrální tok — 1 pokus, „Uloženo.", bez ✔/✘, další úloha sama. */
const neutralni = () => stav.diag || stav.sim;

/** Výzvy při nečitelném vstupu (vyhodnoceni: neplatne) — nepočítá se jako pokus. */
const TYPY_NEPLATNE = ['dlazdice', 'cislo', 'zlomek', 'smisene', 'text', 'vyraz', 'poradi'];
/** Čeština: nové vstupy mají hlášky cj.neplatne_* (vstupy-cj.js), poslech podle vnořeného vstupu. */
const hlaskaNeplatne = (krok, hodnota) => {
  const vstup = krok.vstup?.typ === 'poslech' ? krok.vstup.vnoreny_vstup : krok.vstup;
  if (TYPY_VSTUPU_CJ.includes(vstup?.typ)) return hlaskaNeplatneCj(vstup, hodnota);
  return h(`zak.neplatne_${TYPY_NEPLATNE.includes(vstup?.typ) ? vstup.typ : 'text'}`);
};

const stav = {
  lekce: null,
  dite: null,
  sezeni: null,
  bezUkladani: false,
  kroky: new Map(), // `${ulohaId}/${krokId}` → {pokusy: [{hodnota, spravne}], hotovo: boolean}
  ulohaIndex: 0,
  casovac: null,
  diag: false,          // vstupní diagnostika (týden 0, R37)
  prestavkaVidena: false,
  sim: false,           // simulace přijímaček (Fáze 2, R38): tok jako diagnostika + odpočet 70 min přes 2 části
  simCas: null,         // {start, minut, rozdeleno} (simulace-zak.js casCasti)
  samo: false,          // R64 „Dnes samo": aplikace místo rodiče (nápovědy, semafor, ukončení lekce)
  samoBarvy: {},        // uloha_id → barva semaforu spočítaná aplikací
};

// ---------------------------------------------------------------------
// R64: lekce bez rodiče — nápovědy (počet na úlohu v localStorage sezení) a semafor místo rodiče
// ---------------------------------------------------------------------

const klicNapoved = () => `spolu.samo.napovedy.${stav.sezeni?.id}`;
function napovedy() {
  try { return JSON.parse(localStorage.getItem(klicNapoved()) || '{}') || {}; } catch { return {}; }
}
/** Stav nápověd úlohy: n = kolik jich dítě otevřelo (pro semafor), i = které (indexy otázek). */
function napovedyUlohy(uloha) {
  const x = napovedy()[uloha.id];
  return typeof x === 'number' ? { n: x, i: [...Array(x).keys()] } : { n: x?.n || 0, i: Array.isArray(x?.i) ? x.i : [] };
}
function ulozNapovedy(uloha, stavUlohy) {
  const x = napovedy();
  x[uloha.id] = stavUlohy;
  try { localStorage.setItem(klicNapoved(), JSON.stringify(x)); } catch { /* bez úložiště jen do obnovení */ }
}

/** Tip po známé chybě (fáze A: popis typu chyby; fáze B přinese cílené otázky s výběrem). */
function tipKChybe(typ) {
  if (!typ) return null;
  if (jeDetektivniChyba(typ)) {
    return typ === 'oznacil-radek-pred-chybou' ? 'Tenhle řádek je ještě správně. Hledej dál.' : 'Tady se chyba jen projevila. Hledej, kde vznikla.';
  }
  const popis = popisChyby(typ);
  return popis && popis !== typ ? h('samo.chyba_tip', { popis: popis.charAt(0).toLowerCase() + popis.slice(1) }) : null;
}

/**
 * Nápovědy úlohy: tlačítko „Nevím, jak dál" odkrývá Otázky 1–3 z taháku jako nápovědy pro dítě.
 * U rozcvičky s otázkami po příkladech (A, B, C) přijde nápověda k příkladu, který dítě právě řeší
 * (popisek kroku „Příklad B: …"); jinak postupně 1 → 2 → 3.
 */
function vytvorNapovedy(uloha) {
  const otazky = (uloha.tahak?.otazky || []).map(napovedaZOtazky).filter((o) => o.text).slice(0, MAX_NAPOVED);
  const poPrikladech = otazky.length > 0 && otazky.every((o) => o.k && /^[A-F](?=$|[\s,])/.test(o.k));
  const seznam = el('div', { class: 'zasobnik samo-napovedy' });
  const tlacitko = el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button' }, ikona('bublina'), h('samo.napoveda_tlacitko'));
  const vykresli = () => {
    const { i: ukazane } = napovedyUlohy(uloha);
    seznam.replaceChildren(...ukazane.map((idx, poradi) => {
      const o = otazky[idx];
      if (!o) return null;
      return el('div', { class: 'hlaska hlaska--info samo-napoveda', role: 'status' }, ikona('bublina'),
        el('div', { class: 'hlaska__text' },
          el('strong', { text: h('samo.napoveda_nadpis', { n: poradi + 1 }) + (o.k ? ` · ${o.k}` : '') }), el('br'),
          renderMarkdown(o.text, { inline: true })));
    }).filter(Boolean));
    if (ukazane.length >= otazky.length) { tlacitko.disabled = true; tlacitko.replaceChildren(h('samo.napovedy_dosly')); }
  };
  const dalsiIndex = (ukazane) => {
    if (poPrikladech) {
      const krok = uloha.kroky.find((k) => !zaznam(uloha, k).hotovo);
      // matematika „Příklad B: …“, čeština „Řada B“ (FORMAT-CJ §4: otázky rozcvičky {k: 'B', text})
      const pismeno = /(?:Příklad|Řada)\s+([A-F])\b/.exec(krok?.popisek || '')?.[1];
      const idx = otazky.findIndex((o, i) => !ukazane.includes(i) && o.k.startsWith(pismeno || '#'));
      if (idx >= 0) return idx;
    }
    return otazky.findIndex((_, i) => !ukazane.includes(i));
  };
  tlacitko.addEventListener('click', () => {
    const st = napovedyUlohy(uloha);
    const idx = dalsiIndex(st.i);
    if (idx < 0) return;
    ulozNapovedy(uloha, { n: st.n + 1, i: [...st.i, idx] });
    vykresli();
    seznam.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  vykresli();
  if (!otazky.length) tlacitko.hidden = true;
  // kontrolní / samostatná úloha: nápovědy až po prvním odevzdání (událost spolu:pokus z odevzdat())
  const ceka = el('p', { class: 'text-tlumeny samo-ceka', text: h('samo.kontrolni_ceka') });
  const maPokus = () => uloha.kroky.some((k) => zaznam(uloha, k).pokusy.length > 0);
  const odemknout = () => { tlacitko.hidden = !otazky.length; ceka.hidden = true; };
  if (napovedyAzPoPokusu(uloha) && otazky.length && !maPokus()) {
    tlacitko.hidden = true;
    const poPokusu = (e) => {
      if (e.detail?.ulohaId !== uloha.id) return;
      document.removeEventListener('spolu:pokus', poPokusu);
      odemknout();
    };
    document.addEventListener('spolu:pokus', poPokusu);
  } else ceka.hidden = true;
  return el('section', { class: 'samo-napoveda-blok', 'aria-label': 'Nápovědy' }, seznam, ceka, el('div', { class: 'krok__akce' }, tlacitko));
}

/** Semafor úlohy místo rodiče: volba z průběhu (samo.js), barva maticí kostry 02, uloží se jako rodičův. */
function semaforSamo(uloha) {
  const final = uloha.kroky.find((k) => k.id === 'final') || uloha.kroky[uloha.kroky.length - 1];
  const posledni = zaznam(uloha, final).pokusy.at(-1);
  const spravne = posledni ? posledni.spravne : null;
  const volba = volbaSamo({ spravne, napovedy: napovedyUlohy(uloha).n });
  const { barva } = barvaSemaforu(volba, spravne);
  stav.samoBarvy[uloha.id] = barva;
  if (stav.bezUkladani) return;
  ulozSemafor({ sezeniId: stav.sezeni.id, ulohaId: uloha.id, volbaRodice: volba, spravneAuto: spravne, barva, doporuceni: uloha.semafor?.[barva] || null })
    .catch((e) => { console.error(e); toast(e?.message || h('chyba.ulozeni'), { typ: 'varovani' }); });
}

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------------
// Záznamy kroků (paměť) a obnovení
// ---------------------------------------------------------------------

function zaznam(uloha, krok) {
  const klic = `${uloha.id}/${krok.id}`;
  if (!stav.kroky.has(klic)) stav.kroky.set(klic, { pokusy: [], hotovo: false });
  return stav.kroky.get(klic);
}

function jeHotovy(z) {
  const posledni = z.pokusy[z.pokusy.length - 1];
  return Boolean(posledni) && (posledni.spravne !== false || z.pokusy.length >= maxPokusu());
}

function obnovZOdpovedi(odpovedi) {
  const razene = [...odpovedi].filter((o) => (o.zadal || 'dite') === 'dite')
    .sort((a, b) => a.pokus - b.pokus || (a.id ?? Infinity) - (b.id ?? Infinity));
  for (const o of razene) {
    const z = zaznam({ id: o.uloha_id }, { id: o.krok_id });
    if (z.pokusy.length >= o.pokus) continue; // duplicita (DB + fronta)
    z.pokusy.push({ hodnota: o.hodnota, spravne: o.spravne });
  }
  for (const z of stav.kroky.values()) z.hotovo = jeHotovy(z);
}

/** Index první úlohy s nevyřešeným krokem; 4 = vše hotovo. */
function prvniNehotovaUloha() {
  const i = stav.lekce.ulohy.findIndex((u) => u.kroky.some((k) => !zaznam(u, k).hotovo));
  return i === -1 ? stav.lekce.ulohy.length : i;
}

// ---------------------------------------------------------------------
// Ukládání
// ---------------------------------------------------------------------

function ulozit(uloha, krok, pokus, hodnota, v, casS) {
  if (stav.bezUkladani) return;
  ulozOdpoved({
    sezeniId: stav.sezeni.id, ulohaId: uloha.id, krokId: krok.id, hodnota,
    spravne: v.spravne, typChyby: v.typ_chyby, pokus, casS,
  }).catch((e) => {
    console.error(e);
    toast(e?.message || h('chyba.ulozeni'), { typ: 'varovani', trvani: 6000 });
    zkontrolujSezeni();
  });
}

/**
 * R18: když druhé zařízení mé sezení označilo 'preruseno' (souběh při startu), přepni se na platné
 * probíhající sezení — odpovědi převede platneSezeni(), stránka se znovu načte bez ?rezim=
 * (aby se režim platného sezení nepřepsal). Volá se po každé úloze, při návratu na stránku
 * a při chybě uložení.
 */
let kontrolaSezeni = null;
function zkontrolujSezeni() {
  if (stav.bezUkladani || !stav.sezeni || kontrolaSezeni) return kontrolaSezeni;
  kontrolaSezeni = platneSezeni(stav.sezeni)
    .then((platne) => {
      if (!platne) return;
      const url = new URL(location.href);
      url.searchParams.delete('rezim');
      location.replace(url.href);
    })
    .catch((e) => console.warn('R18: kontrola sezení selhala', e))
    .finally(() => { kontrolaSezeni = null; });
  return kontrolaSezeni;
}

document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') zkontrolujSezeni(); });

// ---------------------------------------------------------------------
// Vstupy (DESIGN.md: dlaždice, číslo s jednotkou, zlomek, smíšené, text)
// ---------------------------------------------------------------------

const naCislo = (s) => {
  const n = Number(normalizujCislo(s));
  return Number.isFinite(n) ? n : String(s ?? '').trim();
};
const naCeleNeboNull = (s) => (String(s ?? '').trim() === '' ? null : naCislo(s));
const doPole = (x) => (x === null || x === undefined ? '' : String(x).replace('.', ','));

function poleCisla(atributy) {
  return el('input', { class: 'pole pole--cislo', type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false', ...atributy });
}

/** Společné chování polí: stav třídou na obalech, zamknutí, fokus. */
function vstupZPoli(uzel, pole, obaly, { hodnota, nastav }) {
  const oznac = (trida) => {
    for (const o of obaly) o.classList.remove('je-spravne', 'je-nesedi');
    if (trida) for (const o of obaly) o.classList.add(trida);
  };
  for (const p of pole) p.addEventListener('input', () => { if (!p.disabled) oznac(null); });
  return {
    uzel, pole, hodnota,
    oznac(druh, h) { nastav(h); oznac(druh === 'spravne' ? 'je-spravne' : druh === 'nesedi' ? 'je-nesedi' : null); },
    zamknout() { for (const p of pole) p.disabled = true; },
    fokus() {
      const p = pole.find((x) => !x.disabled);
      if (p) { p.focus({ preventScroll: true }); p.select?.(); }
    },
  };
}

function vytvorVstup(uloha, krok, idPopisku, odevzdat) {
  const typ = krok.vstup?.typ;
  const enter = (e) => { if (e.key === 'Enter') { e.preventDefault(); odevzdat(); } };

  // Čeština (FORMAT-CJ §3.2): nové vstupy ve vstupy-cj.js; poslech si vnořené dlaždice vytvoří touto funkcí
  if (TYPY_VSTUPU_CJ.includes(typ)) return vytvorVstupCj(uloha, krok, { idPopisku, odevzdat, vytvorVstup });

  if (typ === 'dlazdice') {
    let vybrano = null;
    const moznosti = krok.vstup.moznosti || [];
    // B3 (R23): detektivní řádky a dlaždice se štítkem vždy v 1 sloupci, štítek nad výrazem
    // F2: dlaždice s písmeny pod sebou jako nabídka v testu (štítek písmene zabírá místo)
    const sloupec = uloha.typ === 'detektiv' || moznosti.some((m) => m.stitek) || Boolean(krok.vstup?.pismena);
    const dlazdice = moznosti.map((m, i) => el('button', {
      class: ['dlazdice', sloupec && 'dlazdice--radek'],
      type: 'button', 'aria-pressed': 'false', dataset: { id: m.id },
      onClick: () => vyber(m.id),
    },
    el('span', { class: 'dlazdice__text' },
      stitekPismene(krok, i), // F2: A)–E), A/N, A)–F) v pevném pořadí (R39), nemíchá se
      m.stitek ? el('span', { class: 'dlazdice__stitek', text: m.stitek }) : null,
      el('span', { class: 'dlazdice__vyraz' }, renderMarkdown(m.text, { inline: true }))),
    el('span', { class: 'dlazdice__znak dlazdice__znak--spravne' }, ikona('fajfka')),
    el('span', { class: 'dlazdice__znak dlazdice__znak--nesedi' }, ikona('opakovat'))));
    function vyber(id) {
      vybrano = id;
      for (const d of dlazdice) {
        const ano = d.dataset.id === id;
        d.classList.toggle('je-vybrano', ano);
        d.setAttribute('aria-pressed', String(ano));
      }
    }
    const mrizka = el('div', { class: ['dlazdice-mrizka', sloupec && 'dlazdice-mrizka--sloupec'], role: 'group', 'aria-labelledby': idPopisku }, dlazdice);
    rozlozDlazdice(mrizka, { zalomit: true }); // E1: 2 sloupce, nebo všechny pod sebou; vzorec bez posuvníku (zmenší se)
    return {
      uzel: mrizka,
      pole: [],
      hodnota: () => ({ vyhodnoceni: vybrano, ulozeni: vybrano }),
      oznac(druh, id) {
        const d = dlazdice.find((x) => x.dataset.id === id);
        if (!d) return;
        if (!druh) { vyber(id); return; } // simulace: neutrálně, jen zůstane vybraná (bez ✔/✘)
        if (druh === 'spravne') {
          vyber(id);
          d.classList.remove('je-vybrano');
          d.classList.add('je-spravne');
        } else {
          vyber(null);
          d.classList.add('je-nesedi');
          d.disabled = true;
        }
      },
      zamknout() { for (const d of dlazdice) d.disabled = true; },
      fokus() { (dlazdice.find((d) => d.getAttribute('aria-pressed') === 'true') || dlazdice.find((d) => !d.disabled))?.focus({ preventScroll: true }); },
    };
  }

  if (typ === 'cislo') {
    const p = poleCisla({ 'aria-labelledby': idPopisku });
    p.addEventListener('keydown', enter);
    const obal = krok.vstup.jednotka
      ? el('div', { class: 'pole-cislo' }, p, el('span', { class: 'pole-cislo__jednotka', text: krok.vstup.jednotka }))
      : p;
    return vstupZPoli(el('div', { class: 'krok__vstup' }, obal), [p], [obal], {
      hodnota: () => ({ vyhodnoceni: p.value, ulozeni: naCislo(p.value) }),
      nastav: (x) => { p.value = doPole(x); },
    });
  }

  if (typ === 'zlomek' || typ === 'smisene') {
    const c = poleCisla({ inputmode: 'numeric', 'aria-label': 'Čitatel' });
    const j = poleCisla({ inputmode: 'numeric', 'aria-label': 'Jmenovatel' });
    const zlomek = el('div', { class: 'zlomek-vstup', role: 'group', 'aria-label': 'Zlomek' },
      c, el('span', { class: 'zlomek-vstup__cara', 'aria-hidden': 'true' }), j);
    // Enter / šipka dolů / „/" v čitateli → jmenovatel (Tab funguje sám)
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === '/') { e.preventDefault(); j.focus(); j.select(); }
    });
    // Záloha pro klávesnice bez keydown („/" přijde jen jako input) a pro vložení „3/4"
    c.addEventListener('input', () => {
      const i = c.value.indexOf('/');
      if (i === -1) return;
      const zbytek = c.value.slice(i + 1).replace(/\//g, '');
      c.value = c.value.slice(0, i);
      if (zbytek) j.value = zbytek;
      j.focus();
    });
    j.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || (e.key === 'Backspace' && j.value === '')) { e.preventDefault(); c.focus(); }
      else if (e.key === '/') e.preventDefault();
      else enter(e);
    });
    if (typ === 'zlomek') {
      return vstupZPoli(el('div', { class: 'krok__vstup', role: 'group', 'aria-labelledby': idPopisku }, zlomek), [c, j], [zlomek], {
        hodnota: () => ({ vyhodnoceni: { c: c.value, j: j.value }, ulozeni: { c: naCeleNeboNull(c.value), j: naCeleNeboNull(j.value) } }),
        nastav: (x) => { c.value = doPole(x?.c); j.value = doPole(x?.j); },
      });
    }
    const cela = poleCisla({ class: 'pole pole--cislo smisene-vstup__cela', inputmode: 'numeric', 'aria-label': 'Celá část' });
    cela.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === '/' || e.key === ' ' || e.key === 'ArrowRight' && cela.selectionStart === cela.value.length) {
        e.preventDefault(); c.focus(); c.select();
      }
    });
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && c.value === '') { e.preventDefault(); cela.focus(); }
    });
    const smisene = el('div', { class: 'smisene-vstup', role: 'group', 'aria-label': 'Smíšené číslo' }, cela, zlomek);
    return vstupZPoli(el('div', { class: 'krok__vstup', role: 'group', 'aria-labelledby': idPopisku }, smisene), [cela, c, j], [smisene, zlomek], {
      hodnota: () => ({
        vyhodnoceni: { cela: cela.value, c: c.value, j: j.value },
        ulozeni: { cela: naCeleNeboNull(cela.value), c: naCeleNeboNull(c.value), j: naCeleNeboNull(j.value) },
      }),
      nastav: (x) => { cela.value = doPole(x?.cela); c.value = doPole(x?.c); j.value = doPole(x?.j); },
    });
  }

  // Fáze 1 (R30): výraz s náhledem KaTeX, pořadí operací klikáním (vstupy-f1.js)
  if (typ === 'vyraz') return vytvorVstupVyraz(krok, { idPopisku, odevzdat });
  if (typ === 'poradi') return vytvorVstupPoradi(krok, { idPopisku });
  // Fáze 2 (R38): rýsuje se na papír, tady jen pokyn a „Hotovo" (porovná rodič)
  if (typ === 'rysovani') return vytvorVstupRysovani({ idPopisku });

  // text (krátký, hodnotí rodič)
  const p = el('input', { class: 'pole', type: 'text', maxlength: '200', autocomplete: 'off', 'aria-labelledby': idPopisku });
  p.addEventListener('keydown', enter);
  return vstupZPoli(el('div', { class: 'krok__vstup' }, p), [p], [p], {
    hodnota: () => ({ vyhodnoceni: p.value, ulozeni: p.value.trim() }),
    nastav: (x) => { p.value = x ?? ''; },
  });
}

// ---------------------------------------------------------------------
// Krok
// ---------------------------------------------------------------------

function zpetnaVazba(uzel, druh, text, ikonaNazev) {
  uzel.className = `zpetna-vazba zpetna-vazba--${druh}`;
  uzel.replaceChildren(ikona(ikonaNazev || (druh === 'nesedi' ? 'opakovat' : 'fajfka')), el('span', { text }));
  uzel.hidden = false;
}

/** Poznámky „správně, ale…" (vyhodnoceni.js) → klíč hlášky. */
/** Označení pole po pokusu; v diagnostice neutrálně (bez zelené i šedomodré, R37). */
const druhOznaceni = (spravne) => (neutralni() ? null : spravne === false ? 'nesedi' : 'spravne');

const POZNAMKY_SPRAVNE = { nezkraceno: 'zak.spravne_zkrat' };
/** R43: hodnota sedí, ale výraz není dokončený — nesedí (před posledním pokusem s vlastní hláškou). */
const POZNAMKY_NESEDI = { 'neni-soucin': 'zak.vyraz_soucin', zjednodus: 'zak.vyraz_zjednodus', roznasob: 'zak.vyraz_roznasob' };

/** Text a druh zpětné vazby pro výsledek pokusu. */
function vazbaPokusu(pokus, cislo, poznamka, krok = null) {
  if (stav.diag) return ['poznamka', h('diag.ulozeno'), 'info']; // diagnostika: bez ✔/✘ (R37)
  if (stav.sim) return ['poznamka', h('sim.ulozeno'), 'info']; // simulace: bez ✔/✘ (osnova F2 §3.4)
  if (pokus.spravne === null && krok?.vstup?.typ === 'rysovani') return ['poznamka', h('f2.rysovani_odevzdano'), 'fajfka'];
  if (pokus.spravne === null) return ['poznamka', h('zak.odevzdano_text'), 'fajfka'];
  if (pokus.spravne) return POZNAMKY_SPRAVNE[poznamka] ? ['poznamka', h(POZNAMKY_SPRAVNE[poznamka]), 'fajfka'] : ['spravne', h('zak.spravne')];
  // vyraz: hodnota sedí, ale tvar ne (součin / zjednodušit / roznásobit) — nesedí, poslední pokus jde dál jako jindy (R43)
  if (POZNAMKY_NESEDI[poznamka] && cislo < maxPokusu()) return ['nesedi', h(POZNAMKY_NESEDI[poznamka])];
  return ['nesedi', cislo >= maxPokusu() ? h('zak.nesedi_dal') : h('zak.zkus_znovu')];
}

/**
 * Vykreslí krok. Hotový krok (obnovení) je zamčený s poslední zpětnou vazbou.
 * @param {() => void} poDokonceni  zavolá se jednou, když krok právě skončil (ne při obnovení hotového)
 */
function vykresliKrok(uloha, krok, poradi, poDokonceni) {
  const z = zaznam(uloha, krok);
  const idPopisku = `popisek-${uloha.id}-${krok.id}`;
  const zpetna = el('div', { class: 'zpetna-vazba', role: 'status', hidden: true });
  const vstup = vytvorVstup(uloha, krok, idPopisku, () => odevzdat());
  const rysovani = krok.vstup?.typ === 'rysovani';
  const tlacitko = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button', onClick: () => odevzdat() },
    rysovani ? [ikona('fajfka'), h('f2.rysovani_hotovo')] : 'Odevzdat krok');
  const akce = el('div', { class: 'krok__akce' }, tlacitko);
  const sekce = el('section', { class: 'krok', 'aria-labelledby': idPopisku },
    el('span', { class: 'krok__cislo', text: `Krok ${poradi}` }),
    el('h3', { class: 'krok__popisek', id: idPopisku }, renderMarkdown(krok.popisek, { inline: true })),
    // simulace v aplikaci (osnova F2 §3.1): povinný postup píše dítě na papír, sem jen výsledek
    stav.sim && krok.postup ? el('p', { class: 'krok__postup' }, ikona('tuzka'), h('f2.postup_zak')) : null,
    vstup.uzel, zpetna, akce);

  let klavesnice = null;
  let zobrazeno = performance.now();

  const uzavrit = () => {
    vstup.zamknout();
    akce.remove();
    klavesnice?.odpojit();
    sekce.classList.add('krok--hotovy');
  };

  // Předchozí pokusy (obnovení rozpracovaného sezení)
  z.pokusy.forEach((p, i) => {
    vstup.oznac(druhOznaceni(p.spravne), p.hodnota);
    if (i === z.pokusy.length - 1) {
      const poznamka = p.spravne !== null ? vyhodnotKrok(krok, p.hodnota)?.poznamka : null;
      zpetnaVazba(zpetna, ...vazbaPokusu(p, i + 1, poznamka, krok));
    }
  });
  if (z.hotovo) {
    uzavrit();
    return { sekce, fokus() {} };
  }

  // Vstupní pole z předchozího nesedícího pokusu se dají přepsat — zpětná vazba zmizí až po úpravě
  function odevzdat() {
    if (z.hotovo) return;
    const hodnota = vstup.hodnota();
    const v = vyhodnotKrok(krok, hodnota.vyhodnoceni);
    if (v.neplatne) {
      zpetnaVazba(zpetna, 'poznamka', hlaskaNeplatne(krok, hodnota.vyhodnoceni), 'info');
      vstup.fokus();
      return;
    }
    if (z.pokusy.some((p) => JSON.stringify(p.hodnota) === JSON.stringify(hodnota.ulozeni))) {
      zpetnaVazba(zpetna, 'poznamka', h('zak.opakovana_odpoved'), 'info');
      vstup.fokus();
      return;
    }
    const pokus = { hodnota: hodnota.ulozeni, spravne: v.spravne };
    z.pokusy.push(pokus);
    document.dispatchEvent(new CustomEvent('spolu:pokus', { detail: { ulohaId: uloha.id } })); // samo: odemkne nápovědy kontrolní úlohy
    const cislo = z.pokusy.length;
    ulozit(uloha, krok, cislo, hodnota.ulozeni, v, (performance.now() - zobrazeno) / 1000);

    vstup.oznac(druhOznaceni(v.spravne), hodnota.ulozeni);
    zpetnaVazba(zpetna, ...vazbaPokusu(pokus, cislo, v.poznamka, krok));
    // R64: bez rodiče aplikace řekne, jaká chyba to asi je (místo rodičovy otázky z typické chyby)
    const tip = stav.samo && v.spravne === false ? tipKChybe(v.typ_chyby) : null;
    if (tip) zpetna.append(el('p', { class: 'samo-tip', text: tip }));
    z.hotovo = jeHotovy(z);
    if (z.hotovo) {
      uzavrit();
      poDokonceni();
    } else {
      vstup.fokus();
    }
  }

  return {
    sekce,
    pripojit() {
      // matematická klávesnice jen u polí Matematiky (čeština píše písmena: kratky_text, diktat)
      if (vstup.pole.length && krok.vstup?.typ !== 'text' && !TYPY_VSTUPU_CJ.includes(krok.vstup?.typ)) klavesnice = pripojKlavesnici(vstup.pole, { vlozZa: vstup.uzel });
      zobrazeno = performance.now();
    },
    fokus() { vstup.fokus(); },
  };
}

// ---------------------------------------------------------------------
// Úloha
// ---------------------------------------------------------------------

// E2 (25. 9.): ve vzorci se zvýrazňují jednotlivé znaky — listové prvky KaTeX (číslo, znaménko,
// závorka, proměnná). Číslo o víc číslicích nebo s desetinnou čárkou („25", „2,5") je jeden znak:
// sousední číslicové listy na stejné účaří se zvýrazní spolu (rozhoduje poloha, ne struktura KaTeX).
const TRIDY_ZNAKU = ['mord', 'mbin', 'mrel', 'mopen', 'mclose', 'mpunct', 'mop', 'minner'];
const SELEKTOR_ZNAKU = TRIDY_ZNAKU.map((t) => `.katex-html .${t}`).join(',');
const RE_CISLICE = /^[\d.,{}]+$/;

/** Listové prvky vzorce (bez vnořených znaků, s textem). */
function znakyVzorce(katex) {
  return [...katex.querySelectorAll(SELEKTOR_ZNAKU)]
    .filter((z) => z.textContent.trim() && !z.querySelector(SELEKTOR_ZNAKU));
}

/** Znak + sousední číslice/čárky na stejném řádku sazby (celé číslo „25", „2,5"). */
function celeCislo(znak) {
  if (!RE_CISLICE.test(znak.textContent.trim())) return [znak];
  const vse = [...znak.closest('.katex').querySelectorAll('.zvyraznitelne--znak')];
  const i = vse.indexOf(znak);
  const skupina = [znak];
  const vedle = (a, b) => {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const em = parseFloat(getComputedStyle(a).fontSize) || 16;
    return Math.abs(ra.bottom - rb.bottom) < em * 0.15 && rb.left - ra.right < em * 0.2 && rb.left >= ra.left;
  };
  for (let j = i + 1; j < vse.length && RE_CISLICE.test(vse[j].textContent.trim()) && vedle(skupina.at(-1), vse[j]); j += 1) skupina.push(vse[j]);
  for (let j = i - 1; j >= 0 && RE_CISLICE.test(vse[j].textContent.trim()) && vedle(vse[j], skupina[0]); j -= 1) skupina.unshift(vse[j]);
  return skupina;
}

/** Obalí slova zadání do `.zvyraznitelne` a znaky vzorců označí `.zvyraznitelne--znak`;
 *  klik přepne žluté podtržení (jen vizuální pomůcka, nic se neukládá — kostra 04 bod 6). */
function pripravZvyrazneni(uzel) {
  for (const k of [...uzel.querySelectorAll('.katex')]) {
    if (k.parentElement.closest('.katex')) continue;
    for (const z of znakyVzorce(k)) z.classList.add('zvyraznitelne', 'zvyraznitelne--znak');
  }
  const chodec = document.createTreeWalker(uzel, NodeFilter.SHOW_TEXT);
  const texty = [];
  while (chodec.nextNode()) {
    const t = chodec.currentNode;
    if (t.textContent.trim() && !t.parentElement.closest('.katex, .zvyraznitelne')) texty.push(t);
  }
  for (const t of texty) {
    const frag = document.createDocumentFragment();
    for (const cast of t.textContent.split(/(\s+)/)) {
      if (!cast) continue;
      if (/[\p{L}\p{N}]/u.test(cast)) frag.append(el('span', { class: 'zvyraznitelne', text: cast }));
      else frag.append(cast);
    }
    t.replaceWith(frag);
  }
  uzel.addEventListener('click', (e) => {
    const cil = e.target.closest('.zvyraznitelne');
    if (!cil || !uzel.contains(cil)) return;
    const zapnout = !cil.classList.contains('je-zvyrazneno');
    for (const c of cil.classList.contains('zvyraznitelne--znak') ? celeCislo(cil) : [cil]) c.classList.toggle('je-zvyrazneno', zapnout);
  });
}

function vykresliUlohu(index, { obnoveni = false } = {}) {
  stav.ulohaIndex = index;
  const { lekce } = stav;
  const plocha = $('plocha');
  if (index >= lekce.ulohy.length) { vykresliKonec(); return; }
  const uloha = lekce.ulohy[index];
  aktualizujListu();

  const zadani = el('div', { class: 'karta-ulohy__zadani zadani', id: `zadani-${uloha.id}` }, renderMarkdown(uloha.zadani));
  pripravZvyrazneni(zadani);
  rozlozZadani(zadani); // E1: široký vzorec se zmenší (min. 16 px), jinak zalomí za +, −, = — nikdy nescrolluje
  const prvniLekce = index === 0 && lekce.tyden === 1 && lekce.poradi === 1;
  // B1: na PC je karta se zadáním v levém sloupci přilepená (sticky, CSS); na tabletu na výšku
  // přilepená nahoře a jde sbalit (tlačítko je vidět jen v jednom sloupci, CSS)
  const sbalit = el('button', {
    class: 'tlacitko tlacitko--tiche karta-ulohy__sbalit', type: 'button', 'aria-expanded': 'true', 'aria-controls': zadani.id,
    onClick: () => {
      const sbaleno = karta.classList.toggle('je-sbalene');
      sbalit.setAttribute('aria-expanded', String(!sbaleno));
      sbalit.replaceChildren(ikona('dolu'), sbaleno ? 'Zobrazit zadání' : 'Skrýt zadání');
    },
  }, ikona('dolu'), 'Skrýt zadání');
  const karta = el('article', { class: 'karta-ulohy', 'aria-label': `Úloha ${index + 1} ${zeZ(lekce.ulohy.length)} ${lekce.ulohy.length}` },
    el('div', { class: 'karta-ulohy__hlavicka' },
      el('span', { class: 'stitek stitek--navy', text: `Úloha ${stav.sim && uloha.pozice ? uloha.pozice : index + 1}` }), // simulace: číslo v testu
      el('span', { class: 'stitek', text: NAZVY_TYPU[uloha.typ] || uloha.typ }),
      sbalit),
    zadani,
    vytvorObrazek(uloha), // F1: obrázek pod zadáním (SVG přes DOMPurify, popis jako aria-label)
    el('p', { class: 'karta-ulohy__napoveda', text: prvniLekce ? h('zak.tip_zvyrazneni') : h('zak.napoveda_zvyrazneni') }));
  const kroky = el('div', { class: 'zasobnik' });

  const napovedyBlok = stav.samo ? vytvorNapovedy(uloha) : null;
  plocha.replaceChildren(...[
    obnoveni && el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('info'),
      el('div', { class: 'hlaska__text', text: h('obnoveni.zak', { n: index + 1 }) })),
    stav.samo && index === 0 && !obnoveni && el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('info'),
      el('div', { class: 'hlaska__text', text: h('samo.uvod') })),
    el('div', { class: 'lekce-zak' }, karta, napovedyBlok ? el('div', { class: 'zasobnik' }, kroky, napovedyBlok) : kroky),
  ].filter(Boolean));
  hlidejPokracovaniZadani(karta, zadani);

  let posledni = null;
  const dalsiKrok = (ki) => {
    if (ki >= uloha.kroky.length) { ulohaHotova(uloha, index, kroky); return; }
    const krok = vykresliKrok(uloha, uloha.kroky[ki], ki + 1, () => dalsiKrok(ki + 1));
    kroky.append(krok.sekce);
    if (zaznam(uloha, uloha.kroky[ki]).hotovo) { dalsiKrok(ki + 1); return; }
    krok.pripojit();
    if (posledni) krok.sekce.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    krok.fokus();
    posledni = krok;
  };
  window.scrollTo({ top: 0 });
  dalsiKrok(0);
}

/**
 * Přilepená karta zadání (B1) má na tabletu a telefonu výšku nejvýš 50 % obrazovky a vlastní posuv. Když zadání
 * pokračuje pod okrajem (nabídka A)–E), věta „V testu bys…", testovací rodič F2-T03-L2), dole v kartě je pruh
 * „Zadání pokračuje" se šipkou; klepnutí posune rámeček, na konci zadání pruh zmizí. Bez přetečení se neukáže.
 * @param {HTMLElement} karta  .karta-ulohy (scroll kontejner)
 * @param {HTMLElement} zadani  obsah, jehož výška se mění (KaTeX, obrázek, rozlozDlazdice)
 */
function hlidejPokracovaniZadani(karta, zadani) {
  const pruh = el('button', {
    class: 'karta-ulohy__pokracuje', type: 'button', hidden: true, 'aria-controls': zadani.id,
    onClick: () => karta.scrollBy({ top: Math.round(karta.clientHeight * 0.7), behavior: 'smooth' }),
  }, ikona('dolu'), h('zak.zadani_pokracuje'));
  karta.append(pruh);
  let ro = null;
  const obnov = () => {
    if (!karta.isConnected) { ro?.disconnect(); return; }
    const pretece = !karta.classList.contains('je-sbalene') && karta.scrollHeight > karta.clientHeight + 4;
    pruh.hidden = !(pretece && karta.scrollHeight - karta.clientHeight - karta.scrollTop > 12);
  };
  karta.addEventListener('scroll', obnov, { passive: true });
  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(obnov);
    ro.observe(karta);
    ro.observe(zadani);
  }
  requestAnimationFrame(obnov);
}

/** „Úloha n ze 4 je hotová." — lekce s jiným počtem úloh (čeština: 6) má počet z lekce. */
function textUlohaHotova(n) {
  const celkem = stav.lekce.ulohy.length;
  return celkem === 4 ? h('zak.uloha_hotova', { n }) : h('cj.uloha_hotova', { n, celkem, z: zeZ(celkem) });
}

function ulohaHotova(uloha, index, kroky) {
  if (stav.diag) { setTimeout(() => dalsiDiagnostika(index + 1), 800); return; } // bez brány, žák jde sám
  if (stav.sim) { setTimeout(() => dalsiSimulace(index + 1), 800); return; }
  if (stav.samo) { semaforSamo(uloha); document.querySelector('.samo-napoveda-blok .krok__akce')?.remove(); }
  const posledniUloha = index >= stav.lekce.ulohy.length - 1;
  const tlacitko = el('button', {
    class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button',
    onClick: () => vykresliUlohu(index + 1),
  }, posledniUloha ? 'Dokončit lekci' : 'Další úloha', ikona('sipka-vpravo'));
  const panel = el('div', { class: 'karta zasobnik', role: 'status' },
    el('p', { class: 'text-tucny', text: posledniUloha ? h('zak.posledni_uloha_hotova') : textUlohaHotova(index + 1) }),
    el('div', { class: 'krok__akce' }, tlacitko));
  kroky.append(panel);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  tlacitko.focus({ preventScroll: true });
  zkontrolujSezeni(); // R18
}

/** Diagnostika: další úloha, po 12. přestávka (jednou, jen když ještě nic z 2. bloku), po poslední konec. */
function dalsiDiagnostika(index) {
  const n = stav.lekce.ulohy.length;
  if (index >= n) {
    stav.ulohaIndex = n;
    aktualizujListu();
    const osma = stav.lekce.faze === 'osma';
    vykresliKonecDiagnostiky($('plocha'), stav.sezeni?.id || null, osma ? { text: h('osma.test_konec_zak') } : undefined);
    if (osma) dokoncitTestOsma();
    return;
  }
  const po = prestavkaPo(n);
  const druhyBlok = stav.lekce.ulohy.slice(po).some((u) => u.kroky.some((k) => zaznam(u, k).pokusy.length));
  if (index === po && !stav.prestavkaVidena && !druhyBlok && n > po) {
    stav.prestavkaVidena = true;
    stav.ulohaIndex = index;
    aktualizujListu();
    vykresliPrestavku($('plocha'), () => vykresliUlohu(index));
    return;
  }
  vykresliUlohu(index);
}

/**
 * Spolu 8: úvodní test dělá dítě samo, a tak ho po poslední úloze uzavře samo — výsledek po tématech
 * (doporuceni.js) do sezeni.souhrn. Přehled podle něj seřadí lekce; rodič ho uvidí v „Výsledek úvodního testu“.
 */
async function dokoncitTestOsma() {
  if (stav.bezUkladani || !stav.sezeni?.id || stav.sezeni.stav === 'dokonceno') return;
  try {
    const [katalog, data] = await Promise.all([katalogLekci(), stavSezeni(stav.sezeni.id)]);
    const predmet = predmetLekce(stav.lekce);
    const lekcePredmetu = katalog.filter((l) => predmetLekce(l) === predmet);
    const odpovedi = data.odpovedi.concat(neulozeneOdpovedi({ sezeniId: stav.sezeni.id }));
    const souhrn = sestavSouhrnOsma(stav.lekce, odpovedi, {
      predmet, mapaKapitol: mapaKapitolNaTemata(lekcePredmetu), temata: cislaTemat(lekcePredmetu), rezim: stav.sezeni.rezim || 'app',
    });
    stav.sezeni = await dokoncitSezeni(stav.sezeni.id, souhrn);
  } catch (e) {
    // nevadí: přehled i rodič výsledek dopočítají z odpovědí; dítě nic dalšího dělat nemusí
    console.warn('úvodní test: souhrn se neuložil', e);
  }
}

/** Simulace (R38): další úloha; po poslední konec části (1. část → odkaz na 2. část, 2. část → výsledek pro dítě). */
function dalsiSimulace(index) {
  const n = stav.lekce.ulohy.length;
  if (index < n) { vykresliUlohu(index); return; }
  stav.ulohaIndex = n;
  aktualizujListu();
  zkontrolujSezeni(); // R18
  const sim = stav.lekce.simulace || {};
  if (sim.cast === 1 && sim.druha_cast) {
    const p = new URLSearchParams({ lekce: sim.druha_cast, dite: stav.dite.id, rezim: 'app' });
    if (param('lokalne') === '1') p.set('lokalne', '1');
    vykresliKonecCasti1($('plocha'), `lekce.html?${p}`);
    return;
  }
  zobrazVysledekSimulace();
}

/** Konec testu u žáka: čísla úloh, které sedí (bez počtu a procent); v aplikaci hned, na papíře po Kontrole. */
async function zobrazVysledekSimulace({ odpovedi = null } = {}) {
  const plocha = $('plocha');
  try {
    const v = await vysledekProDite({ lekce: stav.lekce, sezeni: stav.bezUkladani ? null : stav.sezeni, diteId: stav.dite.id,
      odpovedi: stav.bezUkladani ? [] : odpovedi });
    if (stav.sezeni?.rezim === 'papir' && !v.hotovo) { vykresliPapirSim(); return; }
    zastavOdpocet();
    $('odpocet').hidden = true; // test skončil, odpočet už nic neříká
    vykresliKonecSimulace(plocha, { sedi: v.sedi, ceka: v.ceka, obnovit: v.hotovo ? null : () => location.reload() });
  } catch (e) {
    console.error(e);
    chybaStranky(plocha, e?.message || h('chyba.nacteni'));
  }
}

/** Simulace na papír: tisk testového sešitu a archu obou částí (tisk.html?lekce=A,B), výsledek až po rodičově Kontrole. */
function vykresliPapirSim() {
  const sim = stav.lekce.simulace || {};
  const ids = sim.cast === 2 ? [sim.prvni_cast, stav.lekce.id] : [stav.lekce.id, sim.druha_cast];
  const p = new URLSearchParams({ lekce: ids.filter(Boolean).join(','), dite: stav.dite.id, zpet: aktualniStranka() });
  if (param('lokalne') === '1') p.set('lokalne', '1');
  vykresliPapirSimulace($('plocha'), { tiskHref: `tisk.html?${p}`, obnovit: () => zobrazVysledekSimulace() });
}

function vykresliKonec() {
  stav.ulohaIndex = stav.lekce.ulohy.length;
  aktualizujListu();
  zastavOdpocet();
  if (stav.samo) { vykresliKonecSamo(); return; }
  $('plocha').replaceChildren(el('div', { class: 'karta konec-lekce' },
    el('span', { class: 'ikona-kruh ikona-kruh--zelena' }, ikona('fajfka')),
    el('h2', { text: h('zak.konec_nadpis') }),
    el('p', { class: 'text-tlumeny', text: h(jeBlok(stav.lekce) ? 'blok.zak_konec' : 'zak.konec') }), // R46: po bloku projdou úlohy spolu
    el('a', { class: 'tlacitko tlacitko--tiche', href: 'prehled.html' }, ikona('sipka-vlevo'), 'Zpět na přehled')));
  window.scrollTo({ top: 0 });
  ukazOdznakyPoLekci();
}

/** R64: bez rodiče aplikace lekci sama ukončí (souhrn s barvami jako od rodiče + samo) a pak ukáže odznaky. */
async function vykresliKonecSamo() {
  $('plocha').replaceChildren(el('div', { class: 'karta konec-lekce' },
    el('span', { class: 'ikona-kruh ikona-kruh--zelena' }, ikona('fajfka')),
    el('h2', { text: h('zak.konec_nadpis') }),
    el('p', { class: 'text-tlumeny', text: h('samo.konec') }),
    el('a', { class: 'tlacitko tlacitko--tiche', href: 'prehled.html' }, ikona('sipka-vlevo'), 'Zpět na přehled')));
  window.scrollTo({ top: 0 });
  for (const u of stav.lekce.ulohy) if (!stav.samoBarvy[u.id]) semaforSamo(u); // obnovená lekce: úlohy z minula
  if (!stav.bezUkladani && stav.sezeni?.stav !== 'dokonceno') {
    try {
      const souhrn = { ...sestavSouhrn({ lekce: stav.lekce, barvy: stav.samoBarvy }), samo: true };
      stav.sezeni = await dokoncitSezeni(stav.sezeni.id, souhrn);
    } catch (e) {
      console.error(e);
      toast(e?.message || h('chyba.ulozeni'), { typ: 'varovani', trvani: 6000 });
    }
  }
  ukazOdznakyPoLekci();
}

/**
 * R62 (zadání 30. 9., C; Pavel 30. 9. „hned po lekci“): hned po lekci nový odznak („Seber odznak“). Právě dokončená lekce v DB ještě
 * dokončená není (rodič kliká semafor), proto se započítá navíc — do dokončení a řad, ne do „celá správně“.
 */
async function ukazOdznakyPoLekci() {
  try {
    const lekce = await lekceProDite(stav.dite.id);
    const { ziskane } = spocitejOdznaky(lekce, { navic: { id: stav.lekce.id, konec: new Date().toISOString() } });
    await ukazNoveOdznaky(stav.dite.id, ziskane, { prvniTise: false });
  } catch (e) {
    console.warn('odznaky po lekci:', e); // odznak není důležitější než lekce — chyba se jen zaloguje
  }
}

function vykresliPapir() {
  // H3: tisk ve stejné kartě, „Zpět k lekci" vrátí sem
  const p = new URLSearchParams({ lekce: stav.lekce.id, dite: stav.dite.id, zpet: aktualniStranka() });
  if (param('lokalne') === '1') p.set('lokalne', '1');
  const app = new URLSearchParams({ lekce: stav.lekce.id, dite: stav.dite.id, rezim: 'app' });
  $('plocha').replaceChildren(el('div', { class: 'karta konec-lekce' },
    el('span', { class: 'ikona-kruh' }, ikona('tiskarna')),
    el('h2', { text: h('zak.papir_nadpis') }),
    el('p', { class: 'text-tlumeny', text: h('zak.papir_text') }),
    el('div', { class: 'radek' },
      el('a', { class: 'tlacitko tlacitko--sekundarni', href: `tisk.html?${p}` }, ikona('tiskarna'), h('oba.tisk_odkaz')),
      el('a', { class: 'tlacitko tlacitko--tiche', href: `lekce.html?${app}` }, ikona('obrazovka'), 'Chci počítat v aplikaci'))));
}

// ---------------------------------------------------------------------
// Horní lišta: téma, odpočet, průběh
// ---------------------------------------------------------------------

function vykresliListu() {
  const { lekce } = stav;
  $('lista').replaceChildren(el('div', { class: 'lista-lekce' },
    el('div', { class: 'lista-lekce__tema' }, lekce.tema, el('span', { class: 'lista-lekce__podtitul', id: 'podtitul' })),
    el('div', { class: 'lista-lekce__stav' },
      // R37: v diagnostice dítě odpočet nevidí v žádném stavu (ani na „Připrav si" před 1. úlohou)
      el('div', { class: 'odpocet', id: 'odpocet', role: 'timer', hidden: Boolean(stav.diag) }, ikona('hodiny'), el('span', { class: 'odpocet__cas', id: 'odpocetCas' })),
      el('div', { class: 'prubeh' },
        el('span', { id: 'prubehText' }),
        // diagnostika / simulace mají místo dílků tenký pruh (aktualizujListu) — 24 dílků by na telefonu přetekly
        el('ol', { class: 'prubeh__kroky', 'aria-hidden': 'true', id: 'prubehKroky', hidden: Boolean(stav.diag || stav.sim) },
          lekce.ulohy.map(() => el('li', { class: 'prubeh__krok' })))))));
}

function aktualizujListu() {
  const { lekce, ulohaIndex } = stav;
  const n = lekce.ulohy.length;
  if (stav.diag || stav.sim) {
    // diagnostika: „Úloha 7 z 24“, odpočet žák nevidí; simulace: „Úloha 12 · 2. část“ a odpočet 70 min.
    // Obojí tenký ukazatel po dílcích (bez barev správně/špatně).
    const sim = stav.lekce.simulace || {};
    const pozice = lekce.ulohy[Math.min(ulohaIndex, n - 1)]?.pozice ?? Math.min(ulohaIndex + 1, n);
    $('podtitul').textContent = stav.sim ? `Simulace ${sim.cislo ?? ''} · ${sim.cast ?? 1}. část`.replace('  ', ' ')
      : lekce.faze === 'osma' ? h('osma.test_stitek') : 'Fáze 1 · týden 0';
    $('prubehText').textContent = stav.sim
      ? (ulohaIndex >= n ? `${sim.cast ?? 1}. část · hotovo` : h('sim.prubeh', { pozice, cast: sim.cast ?? 1 }))
      : h('diag.prubeh', { n: Math.min(ulohaIndex + 1, n), celkem: n, z: zeZ(n) });
    $('prubehKroky').hidden = true;
    if (stav.diag) $('odpocet').hidden = true;
    let pruh = $('diagPruh');
    if (!pruh) {
      pruh = el('div', {
        class: 'pruh pruh--diag', id: 'diagPruh', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(n), style: `--dilky:${n}`,
      }, el('span', { class: 'pruh__vypln' }));
      $('lista').append(pruh);
    }
    const hotovo = Math.min(ulohaIndex, n);
    pruh.setAttribute('aria-valuenow', String(hotovo));
    pruh.setAttribute('aria-label', h('diag.prubeh', { n: Math.min(ulohaIndex + 1, n), celkem: n, z: zeZ(n) }));
    pruh.firstChild.style.width = `${Math.round((hotovo / n) * 100)}%`;
    return;
  }
  const uloha = lekce.ulohy[Math.min(ulohaIndex, n - 1)];
  $('podtitul').textContent = ulohaIndex >= n ? `Lekce ${lekce.poradi} · hotovo` : `Lekce ${lekce.poradi} · ${NAZVY_TYPU[uloha.typ] || ''}`;
  $('prubehText').textContent = `Úloha ${Math.min(ulohaIndex + 1, n)}/${n}`;
  [...$('prubehKroky').children].forEach((li, i) => {
    li.classList.toggle('je-hotovo', i < ulohaIndex);
    li.classList.toggle('je-aktualni', i === ulohaIndex);
  });
}

function spustOdpocet() {
  const celkem = (Number(stav.lekce.cas_min) || 20) * 60;
  const klic = `spolu.odpocet.${stav.sezeni?.id || stav.lekce.id}`;
  let start = Date.now();
  try {
    const ulozeny = Number(localStorage.getItem(klic));
    if (ulozeny && Date.now() - ulozeny < 24 * 3600 * 1000) start = ulozeny;
    else localStorage.setItem(klic, String(start));
  } catch { /* bez úložiště odpočet začne znovu */ }
  let posledniMinuta = null;
  const tik = () => {
    const zbyva = Math.max(0, Math.round(celkem - (Date.now() - start) / 1000));
    const odpocet = $('odpocet');
    if (zbyva === 0) {
      odpocet.classList.add('je-vyprselo');
      $('odpocetCas').textContent = 'Čas vypršel';
      odpocet.setAttribute('aria-label', 'Doporučený čas vypršel');
      $('systemove').append(el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('info'),
        el('div', { class: 'hlaska__text', text: h('oba.cas_vyprsel') })));
      zastavOdpocet();
      return;
    }
    const min = Math.floor(zbyva / 60);
    $('odpocetCas').textContent = `${min}:${String(zbyva % 60).padStart(2, '0')}`;
    if (min !== posledniMinuta) {
      posledniMinuta = min;
      odpocet.setAttribute('aria-label', min ? `Zbývá ${min} min` : 'Zbývá méně než minuta');
    }
  };
  tik();
  if (!$('odpocet').classList.contains('je-vyprselo')) stav.casovac = setInterval(tik, 1000);
}

function zastavOdpocet() {
  clearInterval(stav.casovac);
  stav.casovac = null;
  stav.simStop?.();
  stav.simStop = null;
}

/** Simulace: jeden odpočet 70 min přes obě části (část 2 čte začátek části 1), hlášky tempa (simulace-zak.js). */
function spustOdpocetSim() {
  if (!stav.simCas) return;
  stav.simStop = spustOdpocetSimulace(stav.simCas, { odpocet: $('odpocet'), odpocetCas: $('odpocetCas'), systemove: $('systemove') });
}

// ---------------------------------------------------------------------
// Menu a start
// ---------------------------------------------------------------------

async function start() {
  const plocha = $('plocha');
  nacitani(plocha, 'Načítám lekci…');
  try {
    const s = await chranStranku();
    if (!s) return;
    napojMenu();
    const lekceId = param('lekce');
    if (!lekceId) { location.replace('prehled.html'); return; }

    const deti = await mojeDeti();
    const dite = deti.find((d) => d.id === param('dite')) || deti.find((d) => d.id === ziskejDite()) || deti[0];
    if (!dite) { chybaStranky(plocha, h('prazdny.deti')); return; }
    nastavDite(dite.id);
    stav.dite = dite;

    const [lekce] = await Promise.all([nactiLekciObsah(lekceId), nacistKnihovny()]);
    stav.lekce = lekce;
    if (lekce.predmet === 'cestina') document.documentElement.dataset.predmet = 'cestina'; // cestina.css: slova v dlaždicích se nedělí
    nastavPredmet(predmetLekce(lekce)); // menu: manuál a „Zpět na přehled“ podle předmětu lekce
    document.title = `${lekce.tema} · Spolu 8`;

    const rezim = ['app', 'papir', 'samo'].includes(param('rezim')) ? param('rezim') : null;
    let pokracovani = false;
    stav.diag = jeDiagnostika(lekce);
    stav.sim = jeSimulace(lekce);
    try {
      // Simulace bez ?rezim= (návrat z tisku, „Zkontrolovat znovu"): rozpracovaná část, jinak poslední dokončená
      // (výsledek pro dítě) — nové sezení se zakládá jen s ?rezim= (Začít / Projít znovu z přehledu).
      if (stav.sim && !rezim) {
        const existujici = await aktualniSezeni(dite.id, lekceId);
        const posledni = existujici || await posledniSezeniCasti(dite.id, lekceId);
        if (posledni?.stav === 'dokonceno') {
          stav.sezeni = posledni;
          vykresliListu();
          stav.ulohaIndex = lekce.ulohy.length;
          aktualizujListu();
          $('odpocet').hidden = true;
          await zobrazVysledekSimulace();
          return;
        }
      }
      // Diagnostika je jednorázová (obrazovka §1): dokončená → jen konec; rozpracovaná (i starší než 24 h) → pokračovat
      const diag = stav.diag ? await najdiSezeniDiagnostiky(dite.id, lekceId) : null;
      if (diag && !diag.probiha && diag.dokonceno) {
        stav.sezeni = diag.dokonceno;
        vykresliListu();
        stav.ulohaIndex = lekce.ulohy.length;
        aktualizujListu();
        vykresliKonecDiagnostiky(plocha, diag.dokonceno.id);
        return;
      }
      // Bez ?rezim= pokračujeme v režimu rozpracovaného sezení (zacitSezeni by přepnulo na 'app').
      const existujici = diag ? diag.probiha : rezim ? null : await aktualniSezeni(dite.id, lekceId);
      if (existujici) {
        stav.sezeni = existujici;
        pokracovani = true;
      } else {
        ({ sezeni: stav.sezeni, pokracovani } = await zacitSezeni(dite.id, lekceId, rezim || 'app'));
      }
    } catch (e) {
      if (param('lokalne') !== '1') throw e;
      console.warn('Sezení nejde založit — vývojový režim bez ukládání', e);
      stav.bezUkladani = true;
      $('systemove').append(el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('info'),
        el('div', { class: 'hlaska__text', text: 'Vývojový náhled (?lokalne=1): odpovědi se neukládají.' })));
    }

    stav.samo = stav.sezeni?.rezim === 'samo';
    if (stav.samo && !lzeSamo(lekce)) {
      // R64: rýsování / volný text kontroluje rodič — tuhle lekci jen spolu
      plocha.removeAttribute('aria-busy');
      plocha.replaceChildren(el('div', { class: 'karta konec-lekce' }, el('span', { class: 'ikona-kruh' }, ikona('info')),
        el('p', { text: h('samo.nelze') }),
        el('a', { class: 'tlacitko tlacitko--primarni', href: `lekce.html?${new URLSearchParams({ lekce: lekce.id, dite: dite.id, rezim: 'app' })}` }, 'Začít s rodičem'),
        el('a', { class: 'tlacitko tlacitko--tiche', href: 'prehled.html' }, ikona('sipka-vlevo'), 'Zpět na přehled')));
      return;
    }
    vykresliListu();
    if (stav.sezeni?.rezim === 'papir') {
      aktualizujListu();
      $('odpocet').hidden = true;
      $('prubehText').closest('.prubeh').hidden = true;
      if (stav.sim) vykresliPapirSim(); // simulace: tisk obou částí najednou (osnova F2 §3.3)
      else vykresliPapir();
      plocha.removeAttribute('aria-busy');
      return;
    }

    let odpovedi = [];
    if (pokracovani && stav.sezeni) {
      odpovedi = (await stavSezeni(stav.sezeni.id)).odpovedi;
      odpovedi = odpovedi.concat(neulozeneOdpovedi({ sezeniId: stav.sezeni.id }));
      obnovZOdpovedi(odpovedi);
    }
    if (!stav.bezUkladani) napojFrontuUkladani({ kontejner: $('systemove') });
    plocha.removeAttribute('aria-busy');
    const index = prvniNehotovaUloha();
    if (stav.sim) stav.simCas = await casCasti({ lekce, sezeni: stav.bezUkladani ? null : stav.sezeni, diteId: dite.id });
    const zacit = () => {
      if (stav.diag) { dalsiDiagnostika(index); return; } // bez odpočtu (R37), přestávka / konec podle stavu
      if (stav.sim) {
        spustOdpocetSim();
        // start části s tempem (osnova F2 §3.1) jen na úplném začátku; rozpracovaná část pokračuje rovnou
        if (index === 0 && !odpovedi.length) {
          vykresliStartSimulace(plocha, { cast: lekce.simulace?.cast ?? 1, rozdeleno: stav.simCas?.rozdeleno }, () => vykresliUlohu(0));
        } else {
          dalsiSimulace(index);
        }
        return;
      }
      spustOdpocet();
      vykresliUlohu(index, { obnoveni: odpovedi.length > 0 && index < lekce.ulohy.length });
    };
    // H2: „Připrav si" před 1. úlohou a před odpočtem; týž den (lekce × datum) se znovu neukazuje
    if (index < lekce.ulohy.length && !pripravenoDnes(lekce.id)) vykresliPripravit($('plocha'), lekce, zacit);
    else zacit();
  } catch (e) {
    console.error(e);
    chybaStranky(plocha, e?.message || h('chyba.nacteni'));
    plocha.append(el('p', null, el('a', { href: 'prehled.html' }, 'Zpět na přehled')));
  }
}

start();
