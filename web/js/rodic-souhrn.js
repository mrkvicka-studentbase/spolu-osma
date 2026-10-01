// =====================================================================
// rodic-souhrn.js — semafor, souhrn lekce a SOS na stránce rodiče (R17; agenti/07 body 6–8)
//
// - Semafor: barva = barvaSemaforu(volba, spravnostUlohy(odpovědi úlohy)) z vyhodnoceni.js
//   (matice kostra/02; správnost = POSLEDNÍ odpověď `final` od dítěte i rodiče).
// - R8: „Kontrola pro vás: …" v textu semaforu je vždy sbalená (rozdelKontrolu).
// - Souhrn: {barvy, hlavniBarva, doporuceni} → dokoncitSezeni (SouhrnSezeni v supabase.js).
// - SOS: 2 dokončené lekce po sobě v téže kapitole (a témže předmětu) s hlavní barvou červenou (dveCerveneVRade).
// =====================================================================

import { el, ikona, toast, formatDatum } from './ui.js';
import { h } from './hlasky.js';
import { rozdelKontrolu, nazevKapitoly, NAZVY_TYPU } from './obsah.js';
import { barvaSemaforu, spravnostUlohy, VOLBY_RODICE } from './vyhodnoceni.js';
import { ulozSemafor, historieDitete, dveCerveneVRade } from './supabase.js';
import { SOS_EMAIL } from './config.js';
import { md, vytvorRozbalovaci, jeKontrolniUloha } from './rodic-karta.js';
import { kapitolaLekce } from './simulace.js';
import { predmetLekce } from './predmet.js';

export const LABEL_BARVA = { zelena: 'Zelená', oranzova: 'Oranžová', cervena: 'Červená' };
const IKONA_BARVA = { zelena: 'fajfka', oranzova: 'opakovat', cervena: 'stop' };
const IKONA_VOLBA = { sam: 'fajfka', s_otazkou: 'bublina', chyba_pocty: 'kalkulacka', nevedel: 'stop' };
const HLASKA_VOLBA = {
  sam: 'rodic.volba_sam', s_otazkou: 'rodic.volba_s_otazkou',
  chyba_pocty: 'rodic.volba_chyba_pocty', nevedel: 'rodic.volba_nevedel',
};

/** Úloha, ze které se bere hlavní barva lekce: kontrolní — typ „semafor" (kostra/03) nebo „kontrolni" (čeština, FORMAT-CJ §2), jinak poslední. */
export function hlavniUloha(lekce) {
  return lekce.ulohy.find(jeKontrolniUloha) || lekce.ulohy[lekce.ulohy.length - 1];
}

/** Text semaforu rozdělený podle R8 → [doporučení, sbalená kontrola | null]. */
function textSemaforu(uloha, barva) {
  const { text, kontrola } = rozdelKontrolu(uloha.semafor?.[barva] || '');
  return [
    el('div', { class: 'semafor-vysledek__doporuceni' }, md(text)),
    kontrola ? vytvorRozbalovaci('oko', h('rodic.ukazat_kontrolu'), kontrola) : null,
  ];
}

// ---------------------------------------------------------------------
// Semafor jedné úlohy
// ---------------------------------------------------------------------

function vyplnVysledek(s, kontejner, uloha, barva) {
  kontejner.className = `semafor-vysledek semafor-vysledek--${barva}`;
  kontejner.hidden = false;
  // nativní replaceChildren převádí null na text „null" → jen uzly, bez prázdných položek (QA V1)
  kontejner.replaceChildren(...[
    el('div', { class: 'semafor-vysledek__barva' }, ikona(IKONA_BARVA[barva]), h(`rodic.barva_${barva}`)), // A5
    ...textSemaforu(uloha, barva),
    s.poznamkySemafor[uloha.id] === 'priste-bez-otazky'
      ? el('p', { class: 'semafor-vysledek__doporuceni', text: h('rodic.zelena_s_otazkou') }) : null,
    el('p', { class: 'semafor-vysledek__zmena', text: h('rodic.zmenit_volbu') }),
  ].filter(Boolean));
}

/**
 * Sekce „Co jste viděli?" se 4 tlačítky (lze změnit).
 * @param {object} s  stav stránky (rodic.js)
 * @param {object} uloha
 * @param {{nactiStav: () => Promise<void>, poVolbe: (uloha: object) => Promise<void>|void, nadpis?: boolean}} akce
 *   nactiStav = čerstvé odpovědi dítěte před výpočtem barvy; poVolbe = překreslení (souhrn po 4. úloze);
 *   nadpis: false = bez „Co jste viděli?" (nadpis nese krok 4 postupu, A3)
 */
export function vytvorSemaforSekci(s, uloha, { nactiStav, poVolbe, nadpis = true }) {
  const vysledek = el('div', { class: 'semafor-vysledek', role: 'status', hidden: true });
  const tlacitka = VOLBY_RODICE.map((volba) => el('button', {
    class: 'semafor-volba', type: 'button', dataset: { volba },
    'aria-pressed': String(volba === s.volby[uloha.id]),
  }, ikona(IKONA_VOLBA[volba]), h(HLASKA_VOLBA[volba]), ikona('fajfka', { trida: 'semafor-volba__zaskrt' })));

  let probiha = false;
  const klik = async (volba) => {
    if (probiha) return;
    probiha = true;
    for (const t of tlacitka) { t.setAttribute('aria-pressed', String(t.dataset.volba === volba)); t.disabled = true; }
    try {
      try { await nactiStav(); } catch (e) { toast(e.message || h('chyba.nacteni'), { typ: 'varovani' }); }
      const spravne = spravnostUlohy((s.odpovedi || []).filter((o) => o.uloha_id === uloha.id));
      const { barva, poznamka } = barvaSemaforu(volba, spravne);
      s.volby[uloha.id] = volba;
      s.barvy[uloha.id] = barva;
      s.lokalniSemafory[uloha.id] = { barva, volba };
      s.poznamkySemafor[uloha.id] = poznamka;
      vyplnVysledek(s, vysledek, uloha, barva);
      try {
        await ulozSemafor({
          sezeniId: s.sezeni.id, ulohaId: uloha.id, volbaRodice: volba,
          spravneAuto: spravne, barva, doporuceni: uloha.semafor?.[barva] || null,
        });
      } catch (e) {
        toast(e.message || h('chyba.ulozeni'), { typ: 'varovani' });
      }
    } finally {
      for (const t of tlacitka) t.disabled = false;
      probiha = false;
    }
    await poVolbe(uloha);
  };
  for (const btn of tlacitka) btn.addEventListener('click', () => klik(btn.dataset.volba));

  if (s.barvy[uloha.id]) vyplnVysledek(s, vysledek, uloha, s.barvy[uloha.id]);

  return el('section', { class: 'zasobnik zasobnik--tesny', 'aria-label': h('rodic.semafor_nadpis') },
    nadpis ? el('h2', { text: h('rodic.semafor_nadpis') }) : null,
    el('div', { class: 'semafor-volby' }, tlacitka),
    vytvorKlic(),
    vysledek);
}

/**
 * R21: rozhodovací klíč pod tlačítky (obsah/semafor-klic.md). Úvodní věta viditelná, 4 věty
 * k volbám sbalené pod „Jak vybrat?" — na 375 px by věty pod každým tlačítkem odsunuly výsledek pod ohyb.
 */
function vytvorKlic() {
  return el('div', { class: 'semafor-klic' },
    el('p', { class: 'semafor-klic__uvod', text: h('rodic.klic_uvod') }),
    el('details', { class: 'rozbalovaci rozbalovaci--vnorene' },
      el('summary', null, ikona('info'), h('rodic.klic_tlacitko'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
      el('dl', { class: 'rozbalovaci__obsah semafor-klic__seznam' },
        VOLBY_RODICE.map((volba) => [el('dt', { text: h(HLASKA_VOLBA[volba]) }), el('dd', { text: h(`rodic.klic_${volba}`) })]))));
}

// ---------------------------------------------------------------------
// Souhrn a SOS
// ---------------------------------------------------------------------

/**
 * Souhrn k uložení při dokončení (SouhrnSezeni v supabase.js).
 * @param {object} s
 * @returns {{barvy: Object<string, string>, hlavniBarva: string|null, doporuceni: string}}
 */
export function sestavSouhrn(s) {
  const barvy = {};
  for (const u of s.lekce.ulohy) if (s.barvy[u.id]) barvy[u.id] = s.barvy[u.id];
  const doporuceni = s.lekce.ulohy
    .filter((u) => barvy[u.id] && barvy[u.id] !== 'zelena')
    .map((u) => rozdelKontrolu(u.semafor?.[barvy[u.id]] || '').text) // R8: bez kontroly
    .filter(Boolean)
    .join('\n\n');
  // F2 (R38): u bloků (kapitola `mix`) se SOS a historie řídí kapitolou hlavní úlohy — uloží se do souhrnu
  // pocetUloh: „celá správně“ (R61) pozná i lekci ukončenou dřív, než rodič klikl semafor u všech úloh
  return { barvy, hlavniBarva: barvy[hlavniUloha(s.lekce).id] || null, doporuceni, kapitola: kapitolaLekce(s.lekce), pocetUloh: s.lekce.ulohy.length };
}

/**
 * Zjistí, zda nabídnout SOS (s.sosAktivni). Aktuální lekci (ještě neukončenou) přidá na konec
 * historie s její hlavní barvou; u dokončené (jen pro čtení) už v historii je.
 * @param {object} s
 */
export async function pripravSouhrnData(s) {
  s.sosAktivni = false;
  try {
    const historie = (await historieDitete(s.diteId)).filter((x) => x.sezeniId !== s.sezeni.id);
    const kapitola = kapitolaLekce(s.lekce);
    const predmet = predmetLekce(s.lekce); // SOS per předmět (ZADANI-CESTINA §8.2); matematika = jako dřív
    historie.push({ sezeniId: s.sezeni.id, predmet, kapitola, hlavniBarva: sestavSouhrn(s).hlavniBarva });
    s.sosAktivni = dveCerveneVRade(historie, kapitola, predmet);
  } catch (e) {
    console.error('SOS: historii se nepodařilo načíst', e);
  }
}

function vytvorSosOdkaz(s) {
  const kapitolaNazev = nazevKapitoly(kapitolaLekce(s.lekce));
  const predmet = h('sos.mailto_predmet', { kapitola_nazev: kapitolaNazev, jmeno_ditete: s.diteJmeno });
  const telo = h('sos.mailto_telo', {
    kapitola_nazev: kapitolaNazev, jmeno_ditete: s.diteJmeno,
    lekce_tema: s.lekce.tema, lekce_id: s.lekce.id, jmeno_rodice: s.jmenoRodice,
  });
  const href = `mailto:${SOS_EMAIL}?subject=${encodeURIComponent(predmet)}&body=${encodeURIComponent(telo.replace(/\n/g, '\r\n'))}`;
  return el('a', { class: 'tlacitko tlacitko--sekundarni', href }, ikona('mail'), h('sos.tlacitko'));
}

function vytvorPolozku(s, uloha, jeHlavni) {
  const barva = s.barvy[uloha.id] || null;
  const znak = el('span', {
    class: ['semafor-znak', jeHlavni && 'semafor-znak--velka', `semafor-znak--${barva || 'zadna'}`], 'aria-hidden': 'true',
  }, barva ? ikona(IKONA_BARVA[barva]) : null);
  const nazev = el('span', { class: 'souhrn__uloha-nazev', text: NAZVY_TYPU[uloha.typ] || uloha.typ });
  const barvaText = el('span', { class: 'souhrn__uloha-barva', text: barva ? LABEL_BARVA[barva] : '—' });
  if (!jeHlavni) return el('li', { class: 'souhrn__uloha' }, znak, nazev, barvaText);
  return el('li', { class: 'souhrn__uloha souhrn__uloha--hlavni' }, znak,
    el('span', null, el('span', { class: 'souhrn__stitek-hlavni', text: h('rodic.souhrn_hlavni') }), nazev, barvaText));
}

/**
 * Obsah souhrnu (4 barvy, hlavní zvýrazněná, „Na zítra", případně SOS).
 * @param {object} s
 * @returns {Element[]}
 */
export function vytvorSouhrn(s) {
  const ulohy = s.lekce.ulohy;
  const hlavni = hlavniUloha(s.lekce);
  // hlavní úloha první — manuál: „Je-li cvičení víc, stačí to u poslední úlohy"
  const neZelene = [hlavni, ...ulohy.filter((u) => u !== hlavni)]
    .filter((u) => s.barvy[u.id] && s.barvy[u.id] !== 'zelena');
  const hlavniBarva = s.barvy[hlavni.id];
  // manuál „Zítra se řiďte barvou lekce v souhrnu na konci"
  const zitra = hlavniBarva ? el('div', { class: `hlaska hlaska--info souhrn__zitra souhrn__zitra--${hlavniBarva}`, role: 'status' },
    ikona(IKONA_BARVA[hlavniBarva]), el('div', { class: 'hlaska__text', text: h(`rodic.zitra_${hlavniBarva}`) })) : null;

  const naZitra = neZelene.length ? el('div', { class: 'zasobnik zasobnik--tesny' },
    el('h2', { text: h('rodic.souhrn_na_zitra') }),
    neZelene.map((u) => {
      const barva = s.barvy[u.id];
      return el('div', { class: `semafor-vysledek semafor-vysledek--${barva}` },
        el('div', { class: 'semafor-vysledek__barva' }, ikona(IKONA_BARVA[barva]), `${NAZVY_TYPU[u.typ] || u.typ}: ${LABEL_BARVA[barva]}`),
        ...textSemaforu(u, barva));
    })) : null;

  const sos = s.sosAktivni ? el('div', { class: 'hlaska hlaska--info' },
    ikona('sos'),
    el('div', { class: 'hlaska__text' },
      el('strong', { text: h('rodic.sos_nadpis', { kapitola_nazev: nazevKapitoly(kapitolaLekce(s.lekce)) }) }),
      h('rodic.sos_nabidka'),
      el('div', { class: 'hlaska__akce' }, vytvorSosOdkaz(s)))) : null;

  const uvod = s.jenCteni
    ? h('rodic.souhrn_jen_cteni', { datum: formatDatum(s.sezeni.konec || s.sezeni.zacatek, { rok: true }) })
    : h('rodic.konec');

  return [
    el('h1', { text: h('rodic.souhrn_nadpis') }),
    el('p', { class: 'text-tlumeny', text: uvod }),
    el('div', { class: 'souhrn' },
      el('ol', { class: 'souhrn__ulohy' }, ulohy.map((u) => vytvorPolozku(s, u, u === hlavni))),
      zitra, naZitra, sos),
  ];
}
