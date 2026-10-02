// =====================================================================
// rodic.js — stránka rodiče (telefon): řízení stránky, sezení, polling, odpočet, manuál (R17)
// (agenti/07-frontend-rodic.md body 1–9, kostra/04 bod 7)
//
// URL: rodic.html?lekce=<id>&dite=<id>&rezim=app|papir   (dite, rezim volitelné)
//      rodic.html?lekce=<id>&dite=<id>&sezeni=<id>       (R19: souhrn dokončené lekce jen pro čtení;
//                                                         je-li sezení ještě `probiha`, normální režim)
// Moduly: rodic-karta.js (tahák, stav žáka, papír), rodic-souhrn.js (semafor, souhrn, SOS),
//         rodic-blok.js (blok na čas: „Blok na čas běží" → procházení „Po bloku", R46).
// Render přes malé funkce vracející DOM (R2); žádná real-time synchronizace — polling 30 s.
// =====================================================================

import {
  el, ikona, toast, otevritModal, zavritModal, param, nacitani, chybaStranky,
  napojFrontuUkladani, chranStranku, aktualniStranka,
} from './ui.js';
import { h } from './hlasky.js';
import { nacistKnihovny, nactiLekciObsah, NAZVY_TYPU } from './obsah.js';
import {
  zacitSezeni, aktualniSezeni, stavSezeni, dokoncitSezeni, mojeDeti, neulozeneOdpovedi, lekceProDite,
} from './supabase.js';
import { spocitejOdznaky } from './odznaky.js';
import { ukazNoveOdznaky } from './odznaky-ui.js';
import { lzeSamo } from './samo.js';
import { ziskejDite, nastavDite } from './role.js';
import { napojMenu, otevritManual, manualPrecteny, nastavPredmet } from './menu.js';
import { predmetLekce } from './predmet.js';
import {
  vytvorPrepinacUloh, vytvorStavZaka, vytvorKartuUlohy, vytvorPapir, coChybi, uklidRozlozeni, vytvorRysovaniLekce,
} from './rodic-karta.js';
import { jeSimulace, jeBlok, pocetOdevzdanychBloku } from './simulace.js';
import {
  vytvorBlokBezi, potvrdPrechod, nactiFaziBloku, ulozFaziBloku, uplynuloMin, vytvorCoZadalo,
} from './rodic-blok.js';
import { spustSimulaciRodic } from './rodic-simulace.js';
import { vytvorSemaforSekci, vytvorSouhrn, sestavSouhrn, pripravSouhrnData } from './rodic-souhrn.js';
import { jeDiagnostika } from './diagnostika.js';
import { spustDiagnostikuRodic } from './rodic-diagnostika.js';

const INTERVAL_POLLINGU = 30000;

/** Stav stránky — sdílí se s rodic-karta.js a rodic-souhrn.js (předává se jako `s`). */
const stranka = {
  lekce: null,
  sezeni: null,
  rezim: 'app',
  jenCteni: false,             // R19: souhrn dokončené lekce
  diteId: null,
  diteJmeno: '',
  jmenoRodice: '',
  ulohaIndex: 0,
  odpovedi: [],                // řádky z DB + neuložené z fronty (pro pokus a spravnostUlohy)
  poUlohach: {},               // ulohaId → krokId → poslední odpověď (stavSezeni)
  posledniAktualizace: null,
  barvy: {},                   // ulohaId → barva
  volby: {},                   // ulohaId → volba_rodice
  lokalniSemafory: {},         // co rodič klikl na TOMTO zařízení (má přednost před DB, i když se ještě ukládá)
  poznamkySemafor: {},         // ulohaId → 'priste-bez-otazky' | null (jen runtime)
  pokusRodice: {},             // ulohaId → poslední použitý pokus rodiče (režim papír)
  uvodOtevrit: false,          // F1: „Než začnete" rozbalit (první otevření lekce na zařízení)
  obnovPostup: null,           // F1: nastaví karta úlohy — přepočítá fajfky ①–④
  otevrenoOtazek: new Map(),   // ulohaId → počet odkrytých otázek (1..3)
  odpocetStart: null,
  odpocetInterval: null,
  pollInterval: null,
  souhrnZobrazen: false,
  sosAktivni: false,
  uzelStavZaka: null,
  blok: null,                  // R46 blok na čas: {faze: 'bezi' | 'po', uzel} (null = běžná lekce)
};

const INTERVAL_BLOK_CAS = 15000; // překreslení uplynulého času během bloku (jen text, bez sítě)

const elStrankaRodic = document.getElementById('strankaRodic');
const elListaLekce = document.getElementById('listaLekce');
const elObsah = document.getElementById('obsah');
const elSpodniLista = document.getElementById('spodniLista');

const ulohaAktualni = () => stranka.lekce.ulohy[stranka.ulohaIndex];
const jePosledniUloha = (uloha) => stranka.lekce.ulohy[stranka.lekce.ulohy.length - 1].id === uloha.id;

// ---------------------------------------------------------------------
// Data ze Supabase (stav dítěte, semafory)
// ---------------------------------------------------------------------

/** Znovu načte odpovědi a semafory sezení do stranka.*. Nepřekresluje DOM. */
async function nactiStavZaka() {
  const data = await stavSezeni(stranka.sezeni.id);
  stranka.sezeni = data.sezeni;
  stranka.odpovedi = data.odpovedi.concat(neulozeneOdpovedi({ sezeniId: stranka.sezeni.id }));
  stranka.poUlohach = data.poUlohach;
  stranka.posledniAktualizace = new Date();
  const barvy = {};
  const volby = {};
  for (const x of data.semafory) { barvy[x.uloha_id] = x.barva; volby[x.uloha_id] = x.volba_rodice; }
  for (const [id, { barva, volba }] of Object.entries(stranka.lokalniSemafory)) { barvy[id] = barva; volby[id] = volba; }
  stranka.barvy = barvy;
  stranka.volby = volby;
  return data;
}

function prekresliStavZaka() {
  if (stranka.rezim !== 'app' || stranka.souhrnZobrazen || !stranka.uzelStavZaka?.isConnected) return;
  const novy = vytvorStavZaka(stranka, ulohaAktualni(), () => obnovStavZaka());
  stranka.uzelStavZaka.replaceWith(novy);
  stranka.uzelStavZaka = novy;
}

/**
 * Obnoví stav dítěte a v místě přepíše jen blok „Dítě odevzdalo" (tlačítko Obnovit i polling) —
 * neruší rozpracovaný vstup v taháku ani v papírovém poli.
 * R18: když druhé zařízení mezitím sezení označilo jako přerušené, stránka se znovu načte
 * a připojí se k platnému (nejstaršímu) sezení.
 */
async function obnovStavZaka(tiche = false) {
  try {
    const idUlohy = stranka.lekce.ulohy[stranka.ulohaIndex]?.id;
    const barvaPred = stranka.barvy[idUlohy];
    await nactiStavZaka();
    // F1: semafor z jiného zařízení = úloha hotová → odškrtnout postup a odemknout „Další úlohu"
    if (!stranka.souhrnZobrazen && !barvaPred && stranka.barvy[idUlohy]) {
      stranka.obnovPostup?.();
      vykresliSpodniListu();
    }
    if (stranka.sezeni.stav === 'preruseno') {
      // bez ?rezim= a ?sezeni=, aby se připojila k platnému sezení a nepřepsala jeho režim
      const url = new URL(location.href);
      url.searchParams.delete('rezim');
      url.searchParams.delete('sezeni');
      location.replace(url.href);
      return;
    }
    if (stranka.blok?.faze === 'bezi') { obnovBlok(); return; }
    prekresliStavZaka();
  } catch (e) {
    console.error(e);
    if (!tiche) toast(e.message || h('chyba.nacteni'), { typ: 'varovani' });
  }
}

function spustPolling() {
  const tik = () => {
    if (stranka.rezim === 'app' && document.visibilityState === 'visible' && !stranka.souhrnZobrazen && !stranka.jenCteni) {
      obnovStavZaka(true);
    }
  };
  stranka.pollInterval = setInterval(tik, INTERVAL_POLLINGU);
  // po návratu k telefonu (odemčení, přepnutí aplikace) načti hned, ne až za 30 s
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') tik(); });
}

// ---------------------------------------------------------------------
// Odpočet (lokální, nezávislý na žákovi)
// ---------------------------------------------------------------------

const klicOdpocet = (sezeniId) => `spolu.odpocet.${sezeniId}`;

function nactiOdpocetStart(sezeniId) {
  try { const v = sessionStorage.getItem(klicOdpocet(sezeniId)); return v ? Number(v) : null; } catch { return null; }
}

function spustitCas() {
  stranka.odpocetStart = Date.now();
  try { sessionStorage.setItem(klicOdpocet(stranka.sezeni.id), String(stranka.odpocetStart)); } catch { /* nevadí */ }
  clearInterval(stranka.odpocetInterval);
  stranka.odpocetInterval = setInterval(aktualizujOdpocet, 1000);
  vykresliListuLekce();
}

function aktualizujOdpocet() {
  const odpocetEl = document.getElementById('odpocet');
  const casEl = document.getElementById('odpocetCas');
  if (!odpocetEl || !casEl) return;
  const celkemS = Math.max(60, Math.round((stranka.lekce.cas_min || 20) * 60));
  const zbyvaS = celkemS - Math.floor((Date.now() - stranka.odpocetStart) / 1000);
  if (zbyvaS <= 0) {
    if (!odpocetEl.classList.contains('je-vyprselo')) {
      odpocetEl.classList.add('je-vyprselo');
      odpocetEl.replaceChildren(ikona('hodiny'), el('span', { text: 'Čas vypršel' }));
      odpocetEl.setAttribute('aria-label', 'Doporučený čas vypršel');
      if (!document.getElementById('hlaskaCasVyprsel')) {
        elObsah.prepend(el('div', { class: 'hlaska hlaska--info', id: 'hlaskaCasVyprsel', role: 'status' },
          ikona('info'), el('div', { class: 'hlaska__text', text: h('oba.cas_vyprsel') })));
      }
    }
    clearInterval(stranka.odpocetInterval);
    stranka.odpocetInterval = null;
    return;
  }
  const min = Math.floor(zbyvaS / 60);
  const sek = zbyvaS % 60;
  casEl.textContent = `${min}:${String(sek).padStart(2, '0')}`;
  if (sek === 59) odpocetEl.setAttribute('aria-label', `Zbývá ${min + 1} minut`);
}

// ---------------------------------------------------------------------
// Horní a spodní lišta
// ---------------------------------------------------------------------

function vykresliListuLekce() {
  const beziBlok = stranka.blok?.faze === 'bezi';
  const uloha = stranka.souhrnZobrazen || beziBlok ? null : ulohaAktualni();
  const stavUzel = el('div', { class: 'lista-lekce__stav' });
  if (stranka.jenCteni || stranka.blok) {
    // souhrn dokončené lekce: bez odpočtu; blok na čas (R46): čas ukazuje karta bloku, procházení je bez odpočtu
  } else if (stranka.odpocetStart) {
    stavUzel.append(el('div', { class: 'odpocet', id: 'odpocet', role: 'timer' },
      ikona('hodiny'), el('span', { class: 'odpocet__cas', id: 'odpocetCas' })));
  } else {
    stavUzel.append(el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: spustitCas },
      ikona('hodiny'), 'Spustit čas'));
  }
  const podtitul = beziBlok ? `Lekce ${stranka.lekce.poradi} · ${h('blok.stitek')}`
    : uloha
      ? `Lekce ${stranka.lekce.poradi} · ${stranka.blok ? `${h('blok.podtitul_po')} · ` : ''}${NAZVY_TYPU[uloha.typ] || uloha.typ}`
      : `Lekce ${stranka.lekce.poradi} · souhrn`;
  elListaLekce.replaceChildren(
    el('div', { class: 'lista-lekce__tema' }, stranka.lekce.tema, el('span', { class: 'lista-lekce__podtitul', text: podtitul })),
    stavUzel);
  elListaLekce.hidden = false;
  if (stranka.odpocetStart && !stranka.jenCteni) aktualizujOdpocet();
}

function naUlohu(index) {
  stranka.ulohaIndex = Math.max(0, Math.min(index, stranka.lekce.ulohy.length - 1));
  vykresliUlohu();
  window.scrollTo({ top: 0 });
}

function vykresliSpodniListu() {
  if (stranka.blok?.faze === 'bezi' && !stranka.jenCteni) {
    elSpodniLista.replaceChildren(); // během bloku jen karta bloku, žádná brána ①–④
    elSpodniLista.hidden = true;
    return;
  }
  if (stranka.jenCteni) {
    elSpodniLista.replaceChildren(el('a', { class: 'tlacitko tlacitko--primarni', href: 'prehled.html' }, ikona('sipka-vlevo'), 'Zpět na přehled'));
  } else if (stranka.souhrnZobrazen) {
    elSpodniLista.replaceChildren(
      el('button', {
        class: 'tlacitko tlacitko--sekundarni tlacitko--ikona', type: 'button', 'aria-label': h('rodic.souhrn_upravit'),
        onClick: () => { stranka.souhrnZobrazen = false; naUlohu(stranka.lekce.ulohy.length - 1); },
      }, ikona('sipka-vlevo')),
      el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', id: 'btnUkoncitLekci', onClick: ukoncitLekci },
        h('rodic.konec_tlacitko')));
  } else {
    const i = stranka.ulohaIndex;
    const posledni = i === stranka.lekce.ulohy.length - 1;
    // F1: vpřed až po ①–④; pod tlačítkem, co chybí. Zpět jde vždy.
    const chybi = coChybi(stranka, ulohaAktualni());
    elSpodniLista.replaceChildren(...[
      el('button', {
        class: 'tlacitko tlacitko--sekundarni tlacitko--ikona', type: 'button', 'aria-label': 'Předchozí úloha',
        disabled: i === 0, onClick: () => naUlohu(i - 1),
      }, ikona('sipka-vlevo')),
      posledni && !chybi
        ? el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', onClick: zobrazSouhrn }, 'Souhrn lekce', ikona('sipka-vpravo'))
        : el('button', {
          class: 'tlacitko tlacitko--primarni', type: 'button', disabled: Boolean(chybi), 'aria-describedby': chybi ? 'coChybi' : null,
          onClick: () => naUlohu(i + 1),
        }, posledni ? 'Souhrn lekce' : 'Další úloha', ikona('sipka-vpravo')),
      chybi ? el('p', { class: 'spodni-lista__chybi', id: 'coChybi', role: 'status', text: chybi }) : null,
    ].filter(Boolean));
    const nahore = document.getElementById('dalsiUlohaNahore');
    if (nahore) nahore.disabled = posledni || Boolean(chybi);
  }
  elSpodniLista.hidden = false;
}

// ---------------------------------------------------------------------
// Vykreslení úlohy / souhrnu
// ---------------------------------------------------------------------

async function poVolbeSemaforu(uloha) {
  prekresliStavZaka();
  stranka.obnovPostup?.(); // F1: volba semaforu = ④ hotový
  if (jePosledniUloha(uloha)) await zobrazSouhrn();
  else vykresliSpodniListu();
}

async function zobrazSouhrn() {
  stranka.souhrnZobrazen = true;
  await pripravSouhrnData(stranka);
  vykresliUlohu();
  window.scrollTo({ top: 0 });
}

/** H3 (R29): odkaz na tiskovou verzi ve stejné kartě; „Zpět k lekci" v tisku vrátí na tuto stránku. */
function odkazTisk() {
  const p = new URLSearchParams({ lekce: stranka.lekce.id, dite: stranka.diteId, zpet: aktualniStranka() });
  if (param('lokalne') === '1') p.set('lokalne', '1');
  return el('div', { class: 'radek radek--konec' },
    el('a', { class: 'tlacitko tlacitko--tiche', href: `tisk.html?${p}` }, ikona('tiskarna'), h('oba.tisk_odkaz')));
}

function vykresliUlohu() {
  uklidRozlozeni(); // E1: odpojit ResizeObservery dlaždic minulé úlohy
  vykresliListuLekce();
  elObsah.removeAttribute('aria-busy');
  if (stranka.souhrnZobrazen) {
    stranka.uzelStavZaka = null;
    elObsah.replaceChildren(...vytvorSouhrn(stranka));
    vykresliSpodniListu();
    return;
  }

  // R46 blok na čas: během bloku jen karta „Blok na čas běží" (čas, odevzdáno x ze 4, pravidlo, přechod)
  if (stranka.blok?.faze === 'bezi') {
    vykresliBlokBezi();
    return;
  }

  const uloha = ulohaAktualni();
  const deti = [vytvorPrepinacUloh(stranka, naUlohu)];
  // R46 po bloku: pruh nad každou úlohou — projděte spolu úlohy 1–4 od začátku
  if (stranka.blok) {
    deti.push(el('div', { class: 'hlaska hlaska--info blok-pruh', role: 'note' }, ikona('hodiny'), el('div', { class: 'hlaska__text', text: h('blok.pruh') })));
  }
  stranka.uzelStavZaka = null;
  if (stranka.rezim === 'app') {
    stranka.uzelStavZaka = vytvorStavZaka(stranka, uloha, () => obnovStavZaka());
    deti.push(stranka.uzelStavZaka);
  } else if (!stranka.jenCteni) {
    deti.push(odkazTisk()); // H3: papír — úlohy k tisku kdykoli znovu (stejná karta, návrat sem)
  }
  // A3 + F1: očíslovaný postup s odškrtáváním; papírový výsledek a semafor v posledním kroku ④
  deti.push(vytvorKartuUlohy(stranka, uloha, {
    papir: stranka.rezim === 'papir' ? vytvorPapir(stranka, uloha, () => obnovStavZaka(true)) : null,
    rysovani: vytvorRysovaniLekce(stranka, uloha, () => obnovStavZaka(true)), // F2: rodič porovná s obrázkem
    semafor: vytvorSemaforSekci(stranka, uloha, { nactiStav: nactiStavZaka, poVolbe: poVolbeSemaforu, nadpis: false }),
    // R46: po bloku v aplikaci krok ① „Dítě zadalo: …" (na papíře výsledek opíše rodič v kroku ④)
    coZadalo: stranka.blok && stranka.rezim === 'app' ? vytvorCoZadalo(uloha, stranka.odpovedi) : null,
    poZmene: vykresliSpodniListu,
  }));

  elObsah.replaceChildren(...deti.filter(Boolean));
  vykresliSpodniListu();
}

// ---------------------------------------------------------------------
// Blok na čas (R46): „Blok na čas běží" → procházení „Po bloku"
// ---------------------------------------------------------------------

const odevzdanoBloku = () => pocetOdevzdanychBloku(stranka.lekce, stranka.odpovedi);
const vseOdevzdano = () => stranka.rezim === 'app' && odevzdanoBloku() >= stranka.lekce.ulohy.length;

function vykresliBlokBezi() {
  stranka.uzelStavZaka = null;
  stranka.blok.uzel = vytvorBlokBezi({
    lekce: stranka.lekce, rezim: stranka.rezim, zacatek: stranka.sezeni.zacatek,
    odevzdano: odevzdanoBloku(), naposledy: stranka.posledniAktualizace,
  }, {
    prejit: () => prejdiNaProchazeni(),
    obnovit: stranka.rezim === 'app' ? () => obnovStavZaka() : null,
  });
  elObsah.replaceChildren(stranka.blok.uzel);
  vykresliSpodniListu();
}

/** Po načtení stavu během bloku: všechny 4 odevzdané (nebo semafor z jiného zařízení) → procházení, jinak překreslit kartu. */
function obnovBlok() {
  if (vseOdevzdano() || Object.keys(stranka.barvy).length) { prejdiNaProchazeni({ auto: true }); return; }
  vykresliBlokBezi();
}

/**
 * Přechod do procházení: automaticky (vše odevzdáno) nebo tlačítkem „Čas vypršel, projdeme to spolu" —
 * před uplynutím doporučeného času s potvrzením (rodič pak vidí řešení). Procházení začíná úlohou 1.
 */
async function prejdiNaProchazeni({ auto = false } = {}) {
  if (stranka.blok?.faze !== 'bezi') return;
  if (!auto && !vseOdevzdano()) {
    const min = uplynuloMin(stranka.sezeni.zacatek);
    if ((min === null || min < (Number(stranka.lekce.cas_min) || 20)) && !(await potvrdPrechod())) return;
    if (stranka.blok?.faze !== 'bezi') return; // mezitím přepnul polling
  }
  stranka.blok.faze = 'po';
  stranka.blok.uzel = null;
  ulozFaziBloku(stranka.sezeni.id);
  naUlohu(0);
  if (auto) toast(h('blok.auto'), { trvani: 6000 });
}

/** R62 (ODPOVED 30. 9., otázka 3): rodič uvidí nový odznak v souhrnu hned po ukončení lekce. */
async function ukazOdznakyRodici() {
  try {
    const { ziskane } = spocitejOdznaky(await lekceProDite(stranka.diteId));
    await ukazNoveOdznaky(stranka.diteId, ziskane);
  } catch (e) {
    console.warn('odznaky v souhrnu:', e); // odznak není důležitější než souhrn — chyba se jen zaloguje
  }
}

async function ukoncitLekci() {
  const btn = document.getElementById('btnUkoncitLekci');
  if (!btn) return;
  btn.disabled = true;
  btn.classList.add('je-nacitani');
  try {
    stranka.sezeni = await dokoncitSezeni(stranka.sezeni.id, sestavSouhrn(stranka));
    clearInterval(stranka.pollInterval);
    clearInterval(stranka.odpocetInterval);
    stranka.jenCteni = true;
    toast(h('rodic.lekce_ukoncena'));
    vykresliListuLekce();
    vykresliSpodniListu();
    ukazOdznakyRodici();
  } catch (e) {
    toast(e.message || h('chyba.ulozeni'), { typ: 'varovani' });
    btn.disabled = false;
    btn.classList.remove('je-nacitani');
  }
}

// ---------------------------------------------------------------------
// Modal volby režimu (manuál a slovníček: menu.js)
// ---------------------------------------------------------------------

async function zeptejSeNaRezim({ samo = false } = {}) {
  const karta = (rezim, ikonaNazev, nazev, popis) => el('button', {
    class: 'volba-karta', type: 'button', onClick: () => zavritModal(dialog, rezim),
  }, el('span', { class: 'ikona-kruh' }, ikona(ikonaNazev)),
  el('span', { class: 'volba-karta__nazev', text: nazev }),
  el('span', { class: 'volba-karta__popis', text: popis }));
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': 'modalRezimNadpis' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'modalRezimNadpis', text: 'Jak dnes budete pracovat?' }),
      el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit', type: 'button', 'aria-label': 'Zavřít' }, ikona('krizek')),
      el('div', { class: 'volby-karet' },
        karta('app', 'obrazovka', 'V aplikaci', 'Dítě řeší na počítači nebo tabletu.'),
        karta('papir', 'tiskarna', 'Na papír', 'Vytisknete úlohy, výsledky zadáte vy.'),
        samo ? karta('samo', 'uzivatel', h('samo.volba_nazev'), h('samo.volba_popis_rodic')) : null)));
  document.body.append(dialog);
  const volba = await otevritModal(dialog);
  dialog.remove();
  return ['papir', 'samo'].includes(volba) ? volba : 'app'; // zavřeno bez volby → výchozí V aplikaci
}

// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------

async function zajistiDite() {
  const deti = await mojeDeti();
  if (!deti.length) throw new Error(h('prazdny.deti'));
  const dite = deti.find((d) => d.id === param('dite')) || deti.find((d) => d.id === ziskejDite()) || deti[0];
  nastavDite(dite.id);
  return dite;
}

/** Sezení podle URL: ?sezeni= (R19), jinak rozpracované / nové (R18 v zacitSezeni). */
async function zajistiSezeni(lekceId) {
  const idZUrl = param('sezeni');
  if (idZUrl) {
    const { sezeni } = await stavSezeni(idZUrl);
    if (sezeni.dite_id !== stranka.diteId) throw new Error(h('chyba.nacteni'));
    if (sezeni.stav !== 'probiha') stranka.jenCteni = true;
    return sezeni;
  }
  const existujici = await aktualniSezeni(stranka.diteId, lekceId);
  const zUrl = param('rezim');
  let rezim = ['papir', 'app', 'samo'].includes(zUrl) ? zUrl : (existujici?.rezim || null);
  if (rezim === 'samo' && !lzeSamo(stranka.lekcePred)) rezim = null; // R64: rýsování kontroluje rodič
  if (!rezim) rezim = await zeptejSeNaRezim({ samo: lzeSamo(stranka.lekcePred) });
  return (await zacitSezeni(stranka.diteId, lekceId, rezim)).sezeni;
}

async function start() {
  nacitani(elObsah, 'Načítám lekci…');
  napojMenu();
  const frontaSlot = el('div', { id: 'frontaSlot' });
  elStrankaRodic.insertBefore(frontaSlot, elListaLekce);

  try {
    const stav = await chranStranku();
    if (!stav) return; // probíhá přesměrování
    const lekceId = param('lekce');
    if (!lekceId && !param('sezeni')) { location.replace('prehled.html'); return; }

    const dite = await zajistiDite();
    stranka.diteId = dite.id;
    stranka.diteJmeno = dite.krestni_jmeno;
    stranka.jmenoRodice = stav.rodina?.jmeno_rodice || '';

    await nacistKnihovny();
    // Diagnostika (týden 0, R37): bez taháku a semaforu — vlastní obrazovky (rodic-diagnostika.js)
    if (lekceId) {
      const lekce = await nactiLekciObsah(lekceId);
      stranka.lekcePred = lekce; // R64: nabídka „Dnes samo" podle obsahu lekce
      // Simulace (Fáze 2, R38): obě části na jedné stránce — odpočet, „Dítě odevzdalo", Kontrola, souhrn (rodic-simulace.js)
      if (jeSimulace(lekce)) {
        stranka.lekce = lekce;
        document.title = `${lekce.tema} · Rodič · Spolu 8`;
        await spustSimulaciRodic({ lekce, dite, elObsah, elListaLekce, elSpodniLista });
        return;
      }
      if (jeDiagnostika(lekce)) {
        stranka.lekce = lekce;
        document.title = `${lekce.tema} · Rodič · Spolu 8`;
        await spustDiagnostikuRodic({ lekce, dite, elObsah, elListaLekce });
        return;
      }
    }
    const sezeni = await zajistiSezeni(lekceId);
    stranka.sezeni = sezeni;
    stranka.rezim = sezeni.rezim;
    if (sezeni.rezim === 'samo' && sezeni.stav === 'probiha' && !stranka.jenCteni) {
      // R64: dítě pracuje samo — rodič nemá bránu ani semafor, jen informaci
      elObsah.removeAttribute('aria-busy');
      elObsah.replaceChildren(el('div', { class: 'karta konec-lekce' },
        el('span', { class: 'ikona-kruh' }, ikona('uzivatel')),
        el('p', { text: h('samo.rodic_bezi') }),
        el('a', { class: 'tlacitko tlacitko--sekundarni', href: 'prehled.html' }, ikona('sipka-vlevo'), 'Zpět na přehled')));
      return;
    }
    stranka.lekce = await nactiLekciObsah(sezeni.lekce_id || lekceId);
    nastavPredmet(predmetLekce(stranka.lekce)); // čeština: manuál češtiny, bez „Jak číst zápisy nahlas“ (C4)
    document.title = `${stranka.lekce.tema} · Rodič · Spolu 8`;
    stranka.odpocetStart = jeBlok(stranka.lekce) ? null : nactiOdpocetStart(sezeni.id); // blok: čas ukazuje karta bloku
    // F1: „Než začnete" rozbalené jen při úplně prvním otevření lekce na tomto zařízení
    try {
      const klicUvod = `spolu.uvod-videno.${stranka.lekce.id}`;
      stranka.uvodOtevrit = !localStorage.getItem(klicUvod);
      localStorage.setItem(klicUvod, '1');
    } catch { stranka.uvodOtevrit = false; }

    await nactiStavZaka();

    // R46 blok na čas: procházení, když už začalo (tady nebo semafor z jiného zařízení) nebo dítě odevzdalo všechny 4
    if (jeBlok(stranka.lekce)) {
      const po = stranka.jenCteni || nactiFaziBloku(sezeni.id) === 'po' || Object.keys(stranka.barvy).length > 0 || vseOdevzdano();
      stranka.blok = { faze: po ? 'po' : 'bezi', uzel: null };
      if (po && !stranka.jenCteni) ulozFaziBloku(sezeni.id);
    }

    const posledniUloha = stranka.lekce.ulohy[stranka.lekce.ulohy.length - 1];
    if (stranka.jenCteni || stranka.barvy[posledniUloha.id]) {
      stranka.souhrnZobrazen = true;
      await pripravSouhrnData(stranka);
    } else {
      const prvniNehotova = stranka.lekce.ulohy.findIndex((u) => !stranka.barvy[u.id]);
      stranka.ulohaIndex = prvniNehotova >= 0 ? prvniNehotova : 0;
    }
    vykresliUlohu();
    if (stranka.jenCteni && sezeni.rezim === 'samo') {
      elObsah.prepend(el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('uzivatel'), el('div', { class: 'hlaska__text', text: h('samo.souhrn') })));
    }
    if (stranka.jenCteni) return;

    await napojFrontuUkladani({ kontejner: frontaSlot });
    if (stranka.odpocetStart) stranka.odpocetInterval = setInterval(aktualizujOdpocet, 1000);
    if (stranka.blok) setInterval(() => { if (stranka.blok.faze === 'bezi') stranka.blok.uzel?.tik?.(); }, INTERVAL_BLOK_CAS);
    spustPolling();

    if (!manualPrecteny()) otevritManual();
  } catch (e) {
    console.error(e);
    chybaStranky(elObsah, e.message || h('chyba.nacteni'));
  }
}

start();
