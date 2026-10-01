// =====================================================================
// rodic-simulace.js — simulace přijímačky na stránce rodiče (osnova Fáze 2 §3.2–3.4, R38).
// Obě části (lekce „simulace" 1–8 a 9–16) na jedné stránce, bez ohledu na to, kterou kartu rodič otevřel:
//   A) během testu jen karta „Simulace běží" (odpočet 70 min, 3 pravidla, hlášky tempa) — žádný tahák, klíč
//      ani řešení; v aplikaci počet odevzdaných úloh (polling 30 s, kostra 01);
//   B) „Dítě odevzdalo" (potvrzení) odemkne Kontrolu po číslech archu: výsledek Sedí / Nesedí, uzavřená úloha =
//      klepnutí na písmeno (aplikace vyhodnotí sama), povinný postup Ano / Ne, konstrukce obrázek + otázky
//      Sedí / Nesedí, sbalené „Ukázat řešení"; v aplikaci jen postup a konstrukce;
//   C) souhrn jen pro rodiče: orientační body, rozpad po částech testu, 3 nejčastější chyby, doporučení lekcí.
// Rodič nic nepočítá ani nepíše. Klepnutí = odpovědi se zadal 'rodic' (DB beze změny); souhrn → sezeni.souhrn
// obou částí přes dokoncitSezeni(). „Dítě odevzdalo" si pamatuje jen toto zařízení (localStorage).
//
// Vykreslovací funkce (vytvorBezi, vytvorKontrolu, vytvorSouhrnSimulace) jsou čisté DOM bez sítě — testuje je
// nastroje/screenshoty.mjs (--f2); síť a řízení je ve spustSimulaciRodic().
// =====================================================================

import { el, ikona, toast, param, otevritModal, zavritModal, chybaStranky } from './ui.js';
import { h } from './hlasky.js';
import { renderMarkdown, renderReseni, nactiLekciObsah, renderTex, rozlozDlazdice, MIN_PISMO_VZORCE } from './obsah.js';
import { vyhodnotKrok } from './vyhodnoceni.js';
import { popisChybyRodic } from './diagnostika.js';
import {
  casSimulace, stavTempa, konecCasti, polozkyKontroly, postupKrokId, spravneTex, uznavaSeI,
  posledniOdpoved, sestavSouhrnSimulace, KOD_BEZ_POSTUPU, KOD_DVA_KRIZKY,
} from './simulace.js';
import { vytvorSediNesedi, vytvorRysovaniRodic, textPismene } from './vstupy-f2.js';
import { vytvorRozbalovaci } from './rodic-karta.js';
import { posledniSezeniCasti } from './simulace-zak.js';

const INTERVAL_POLLINGU = 30000;
const md = (t, inline = false) => renderMarkdown(t, { inline });
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const klicOdevzdano = (sezeni1Id) => `spolu.sim.odevzdano.${sezeni1Id}`;

/** „1, 2 a 5". */
function seznam(polozky) {
  const p = polozky.map(String);
  return p.length <= 1 ? p.join('') : `${p.slice(0, -1).join(', ')} a ${p.at(-1)}`;
}

// ---------------------------------------------------------------------
// A) Během testu (čistý DOM)
// ---------------------------------------------------------------------

/**
 * Karta „Simulace běží".
 * @param {{cislo: number|null, rezim: 'app'|'papir', cas: {start: number, minut: number, rozdeleno: boolean},
 *   ted?: number, odevzdano?: number|null, celkem?: number}} data
 * @param {{odevzdalo?: () => void, obnovit?: () => void}} [akce]
 * @returns {HTMLElement}  uzel s metodou `.tik()` (překreslí odpočet a hlášky tempa)
 */
export function vytvorBezi({ cislo, rezim, cas, ted = Date.now(), odevzdano = null, celkem = 16 }, { odevzdalo, obnovit } = {}) {
  const odpocet = el('p', { class: 'sim-odpocet', role: 'timer' });
  const tempo = el('div', { class: 'zasobnik zasobnik--tesny', 'aria-live': 'polite' });
  const papir = rezim === 'papir';
  const citace = (klicUvod, klicText) => el('div', { class: 'hlaska hlaska--info sim-citace' }, ikona('bublina'),
    el('div', { class: 'hlaska__text' }, el('strong', { text: h(klicUvod) }), el('p', { text: `„${h(klicText)}“` })));

  const tik = (t = Date.now()) => {
    const s = stavTempa(cas, t);
    odpocet.replaceChildren(ikona('hodiny', { trida: 'ikona--velka' }),
      el('span', { class: 'sim-odpocet__cas', text: s.vyprselo ? 'Čas vypršel' : mmss(s.zbyvaS) }),
      el('span', { class: 'sim-odpocet__popis', text: s.vyprselo ? '' : `z ${cas.minut} minut` }));
    odpocet.classList.toggle('je-vyprselo', s.vyprselo);
    const deti = [];
    if (papir && s.uplynuloMin < 5 && !s.vyprselo) deti.push(citace('sim.rodic_start', 'sim.start_text'));
    if (s.pripominka) deti.push(citace(papir ? 'sim.rodic_precist' : 'sim.rodic_vidi', 'sim.tempo_40'));
    if (s.vyprselo) deti.push(citace(papir ? 'sim.rodic_precist' : 'sim.rodic_vidi', 'sim.tempo_70'));
    tempo.replaceChildren(...deti);
    return s;
  };
  tik(ted);

  const uzel = el('div', { class: 'zasobnik zasobnik--volny sim-bezi' },
    el('header', null,
      el('h1', { text: h('sim.rodic_bezi_nadpis') }),
      el('p', { class: 'text-tlumeny', text: `Simulace ${cislo ?? ''} · ${h('sim.rodic_bezi_text')}` })),
    el('section', { class: 'karta sim-bezi__karta' },
      odpocet,
      cas.rozdeleno ? el('p', { class: 'text-tlumeny', text: h('sim.rodic_rozdeleno') }) : null,
      !papir && odevzdano !== null ? el('div', { class: 'stav-zaka', role: 'status' },
        ikona('tuzka', { trida: 'ikona--velka' }),
        el('div', { class: 'stav-zaka__text' }, el('strong', { text: h('sim.rodic_odevzdano', { x: odevzdano, celkem }) })),
        obnovit ? el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona', type: 'button', 'aria-label': h('rodic.stav_obnovit'), onClick: obnovit }, ikona('obnovit')) : null) : null),
    tempo,
    el('section', { class: 'pravidla-rodic sim-pravidla', 'aria-labelledby': 'simPravidla' },
      el('p', { class: 'pravidla-rodic__nadpis', id: 'simPravidla' }, ikona('info'), h('sim.rodic_pravidla_nadpis')),
      el('ol', { class: 'pravidla-rodic__seznam' }, [1, 2, 3].map((i) => el('li', { text: h(`sim.rodic_pravidlo_${i}`) })))),
    odevzdalo ? el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button', onClick: odevzdalo },
      ikona('fajfka'), h('sim.rodic_odevzdalo')) : null);
  uzel.tik = tik;
  return uzel;
}

// ---------------------------------------------------------------------
// B) Kontrola (čistý DOM + callback uložení)
// ---------------------------------------------------------------------

/** Poslední odpověď RODIČE na (pseudo)krok. */
const odpovedRodice = (odpovedi, ulohaId, krokId) => posledniOdpoved((odpovedi || []).filter((o) => o.zadal === 'rodic'), ulohaId, krokId);

/**
 * Jedna položka Kontroly (výsledek / písmena / postup / rýsování).
 * @param {{uloha: object, krok: object, druh: string, odpovedi: Array<object>, rezim: string,
 *   ulozit: (z: {krokId: string, hodnota: string, spravne: boolean, typChyby: string|null}) => Promise<void>}} v
 */
function polozka({ uloha, krok, druh, odpovedi, rezim, ulozit, poUlozeni = () => {} }) {
  const stavText = el('span', { class: 'sim-polozka__stav', role: 'status' });
  const oznacHotovo = () => { stavText.replaceChildren(ikona('fajfka'), h('sim.kontrola_ulozeno')); };
  const uloz = async (z) => {
    try { await ulozit(z); oznacHotovo(); poUlozeni(); } catch (e) { console.error(e); toast(e?.message || h('chyba.ulozeni'), { typ: 'varovani' }); }
  };
  const popisek = el('p', { class: 'sim-polozka__popisek' }, md(krok.popisek || '', true), druh === 'postup' ? ' · postup' : '');
  let obsah;
  let krokId = krok.id;

  if (druh === 'vysledek') {
    const uznava = uznavaSeI(krok).map((u) => [h(`sim.uznava_${u.druh}`), u.tex ? [' ', renderTex(u.tex)] : null]);
    const pred = odpovedRodice(odpovedi, uloha.id, krok.id);
    const volba = vytvorSediNesedi({
      vybrano: pred?.hodnota ?? null, popisek: h('sim.kontrola_porovnejte'),
      onVolba: (hodnota) => uloz({ krokId, hodnota, spravne: hodnota === 'sedi', typChyby: null }),
    });
    obsah = [
      el('p', { class: 'sim-spravne' }, el('strong', { text: `${h('sim.kontrola_spravne')} ` }), md(spravneTex(krok) || '—', true)),
      uznava.length ? el('p', { class: 'sim-uznava' }, `${h('sim.kontrola_uznava')} `, uznava.flatMap((u, i) => (i ? ['; ', ...u] : u))) : null,
      el('p', { class: 'text-tlumeny', text: h('sim.kontrola_porovnejte') }),
      volba.uzel,
    ];
  } else if (druh === 'pismena') {
    const pred = odpovedRodice(odpovedi, uloha.id, krok.id);
    const moznosti = krok.vstup.moznosti || [];
    const volby = [
      ...moznosti.map((m, i) => ({ hodnota: m.id, text: [el('strong', { class: 'sim-pismeno', text: textPismene(krok, i) || m.id }), ' ', md(m.text, true)] })),
      { hodnota: 'nic', text: h('sim.kontrola_nic') },
      { hodnota: 'dva', text: h('sim.kontrola_dva') },
    ];
    const volba = vytvorSediNesedi({
      volby, vybrano: pred?.hodnota ?? null, trida: 'sim-pismena', popisek: h('sim.kontrola_pismena'),
      onVolba: (hodnota) => {
        if (hodnota === 'nic') return uloz({ krokId, hodnota, spravne: false, typChyby: null });
        if (hodnota === 'dva') return uloz({ krokId, hodnota, spravne: false, typChyby: KOD_DVA_KRIZKY });
        const v = vyhodnotKrok(krok, hodnota); // aplikace vyhodnotí sama, rodič správné písmeno znát nemusí
        return uloz({ krokId, hodnota, spravne: v.spravne === true, typChyby: v.typ_chyby });
      },
    });
    obsah = [el('p', { class: 'text-tlumeny', text: h('sim.kontrola_pismena') }), volba.uzel];
  } else if (druh === 'postup') {
    krokId = postupKrokId(krok.id);
    const pred = odpovedRodice(odpovedi, uloha.id, krokId);
    const volba = vytvorSediNesedi({
      volby: [{ hodnota: 'ano', text: h('sim.ano'), ikona: 'fajfka' }, { hodnota: 'ne', text: h('sim.ne'), ikona: 'krizek' }],
      vybrano: pred?.hodnota ?? null, popisek: h('sim.kontrola_postup'),
      onVolba: (hodnota) => uloz({ krokId, hodnota, spravne: hodnota === 'ano', typChyby: hodnota === 'ne' ? KOD_BEZ_POSTUPU : null }),
    });
    obsah = [el('p', { class: 'text-tucny', text: h('sim.kontrola_postup') }),
      el('p', { class: 'text-tlumeny', text: h('sim.kontrola_postup_pozn') }), volba.uzel];
  } else {
    const pred = odpovedRodice(odpovedi, uloha.id, krok.id);
    const dite = (odpovedi || []).some((o) => o.uloha_id === uloha.id && o.krok_id === krok.id && (o.zadal || 'dite') === 'dite');
    obsah = [vytvorRysovaniRodic(uloha, {
      vybrano: pred?.hodnota ?? null, ceka: rezim === 'app' && !dite, nadpis: false,
      onVolba: (hodnota) => uloz({ krokId, hodnota, spravne: hodnota === 'sedi', typChyby: null }),
    })];
  }
  if (odpovedRodice(odpovedi, uloha.id, krokId)) oznacHotovo();
  return el('div', { class: ['sim-polozka', `sim-polozka--${druh}`], dataset: { krok: krokId } },
    el('div', { class: 'sim-polozka__hlavicka' }, popisek, stavText), ...obsah);
}

/**
 * Kontrola po číslech archu (obě části).
 * @param {{casti: Array<{cast: 1|2, lekce: object, odpovedi: Array<object>}>, rezim: 'app'|'papir'}} data
 * @param {{ulozit: (cast: 1|2, uloha: object, z: object) => Promise<void>, souhrn: () => void}} akce
 * @returns {HTMLElement}
 */
export function vytvorKontrolu({ casti, rezim }, { ulozit, souhrn }) {
  const pocet = { vse: 0 };
  const zbyva = el('p', { class: 'text-tlumeny sim-kontrola__zbyva', role: 'status' });
  const obnovZbyva = (koren) => {
    const vse = koren.querySelectorAll('.sim-polozka').length;
    const hotove = koren.querySelectorAll('.sim-polozka__stav .ikona').length;
    zbyva.textContent = vse - hotove > 0 ? h('sim.kontrola_zbyva', { n: vse - hotove }) : h('sim.kontrola_hotovo');
  };
  const sekce = casti.map(({ cast, lekce, odpovedi }) => {
    const ulohy = polozkyKontroly(lekce, rezim);
    const pozice = lekce.ulohy.map((u) => u.pozice).filter(Number.isInteger);
    const nadpis = el('h2', { class: 'diag-nadpis', text: h('sim.kontrola_cast', { cast, od: Math.min(...pozice), do: Math.max(...pozice) }) });
    if (!ulohy.length) return el('section', { class: 'zasobnik' }, nadpis, el('p', { class: 'text-tlumeny', text: h('sim.kontrola_prazdna') }));
    return el('section', { class: 'zasobnik' }, nadpis, ulohy.map(({ uloha, polozky }) => {
      pocet.vse += polozky.length;
      const t = uloha.tahak || {};
      const reseni = t.reseni ? vytvorRozbalovaci('oko', h('rodic.ukazat_reseni'), '', { reseni: true }) : null;
      if (reseni) reseni.querySelector('.rozbalovaci__obsah').replaceChildren(renderReseni(t.reseni));
      return el('article', { class: 'karta sim-kontrola__uloha', 'aria-label': h('sim.kontrola_uloha', { pozice: uloha.pozice }) },
        el('h3', { class: 'sim-kontrola__cislo' }, el('span', { class: 'sim-kontrola__kruh', text: String(uloha.pozice ?? '') }), h('sim.kontrola_uloha', { pozice: uloha.pozice })),
        polozky.map(({ krok, druh }) => polozka({
          uloha, krok, druh, odpovedi, rezim,
          ulozit: (z) => ulozit(cast, uloha, z),
          poUlozeni: () => obnovZbyva(koren),
        })),
        t.typicka_chyba ? vytvorRozbalovaci('pozor', h('sim.kontrola_typicka_chyba'), t.typicka_chyba) : null,
        reseni);
    }));
  });
  const koren = el('div', { class: 'zasobnik zasobnik--volny sim-kontrola' },
    el('header', null, el('h1', { text: h('sim.kontrola_nadpis') }),
      el('p', { class: 'text-tlumeny', text: h(rezim === 'papir' ? 'sim.kontrola_uvod_papir' : 'sim.kontrola_uvod_app') })),
    ...sekce, zbyva,
    el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button', onClick: souhrn }, h('sim.kontrola_souhrn')));
  obnovZbyva(koren);
  // E1 (QA 27. 9.): „Správně:“, „Uznává se i:“ a písmena s dlouhým vzorcem se na telefonu zmenší / zalomí, nikdy scroll
  rozlozDlazdice(koren, {
    vyraz: '.sim-polozka p, .sim-pismena > .tlacitko', sloupce: false, jednotne: false, minPismo: MIN_PISMO_VZORCE, zalomit: true,
  });
  return koren;
}

// ---------------------------------------------------------------------
// C) Souhrn jen pro rodiče (čistý DOM)
// ---------------------------------------------------------------------

/**
 * Souhrn simulace (osnova §3.4). Nikde hranice typu „stačí na gymnázium" (přijetí rozhoduje pořadí).
 * @param {object} souhrn  z sestavSouhrnSimulace (sezeni.souhrn)
 * @param {{jmeno?: string, temata?: Map<string, string>, upravit?: (() => void)|null}} [volby]
 * @returns {HTMLElement}
 */
export function vytvorSouhrnSimulace(souhrn, { jmeno = '', temata = new Map(), upravit = null } = {}) {
  const [c1, c2] = souhrn.casti || [];
  const lekce = (id) => {
    if (temata.get(id)) return temata.get(id);
    const m = /^F(d)-T(d+)-L(d+)$/.exec(id); // bez katalogu aspoň lidsky, ne kód lekce
    return m ? h('sim.lekce_bez_tematu', { faze: m[1], tyden: Number(m[2]), poradi: m[3] }) : id;
  };
  const skupiny = el('ul', { class: 'sim-skupiny' }, (souhrn.skupiny || []).map((g) => el('li', { class: 'sim-skupina' },
    el('span', { class: 'sim-skupina__nazev', text: h(`sim.skupina_${g.klic}`) }),
    el('span', { class: 'sim-skupina__body', text: h('sim.skupina_body', { body: g.body, max: g.max }) }),
    el('span', { class: 'sim-skupina__pruh', 'aria-hidden': 'true' }, el('span', { style: `width:${g.max ? Math.round((g.body / g.max) * 100) : 0}%` })))));
  const chyby = (souhrn.chyby || []).length
    ? el('ul', { class: 'diag-chyby' }, souhrn.chyby.map((c) => el('li', { class: 'diag-chyby__polozka' },
      el('p', { class: 'diag-chyby__text', text: popisChybyRodic(c.typ_chyby) }),
      el('p', { class: 'diag-chyby__pozn', text: h((c.pozice || []).length === 1 ? 'sim.souhrn_chyby_pozice_1' : 'sim.souhrn_chyby_pozice', { pozice: seznam(c.pozice || []) }) }))))
    : el('p', { class: 'text-tlumeny', text: h('sim.souhrn_chyby_prazdne') });
  const doporuceni = (souhrn.doporuceni || []).length
    ? el('ul', { class: 'diag-jak' }, souhrn.doporuceni.map((d) => el('li', {
      text: h('sim.souhrn_doporuceni_uloha', { pozice: d.pozice, lekce: seznam(d.lekce.map(lekce)) }) })))
    : el('p', { class: 'text-tlumeny', text: h('sim.souhrn_doporuceni_prazdne') });
  return el('div', { class: 'zasobnik zasobnik--volny sim-souhrn' },
    el('header', { class: 'diag-vysledek__hlavicka' },
      el('h1', { text: h('sim.souhrn_nadpis', { cislo: souhrn.cislo ?? '' }) }),
      jmeno ? el('p', { class: 'text-tlumeny', text: jmeno }) : null),
    el('div', { class: 'hlaska hlaska--info sim-souhrn__body', role: 'status' }, ikona('info'),
      el('div', { class: 'hlaska__text' },
        el('strong', { text: h('sim.souhrn_body', { body: souhrn.body, max: souhrn.max, b1: c1?.body ?? 0, m1: c1?.max ?? 0, b2: c2?.body ?? 0, m2: c2?.max ?? 0 }) }),
        el('p', { text: h('sim.souhrn_dite') }),
        el('p', { class: 'text-tucny', text: h('sim.souhrn_orientacni') }),
        souhrn.rozdeleno ? el('p', { text: h('sim.souhrn_rozdeleno') }) : null)),
    el('p', { class: 'sim-souhrn__dite' }, ikona('oko'),
      (souhrn.sedi || []).length ? h('sim.souhrn_sedi', { pozice: seznam(souhrn.sedi) }) : h('sim.souhrn_nic_nesedi')),
    el('section', { class: 'zasobnik', 'aria-labelledby': 'simCasti' }, el('h2', { class: 'diag-nadpis', id: 'simCasti', text: h('sim.souhrn_casti_nadpis') }), skupiny),
    el('section', { class: 'zasobnik', 'aria-labelledby': 'simChyby' }, el('h2', { class: 'diag-nadpis', id: 'simChyby', text: h('sim.souhrn_chyby_nadpis') }), chyby),
    el('section', { class: 'zasobnik', 'aria-labelledby': 'simDoporuceni' }, el('h2', { class: 'diag-nadpis', id: 'simDoporuceni', text: h('sim.souhrn_doporuceni_nadpis') }), doporuceni),
    el('div', { class: 'zasobnik' },
      el('a', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', href: 'prehled.html' }, h('sim.na_prehled')),
      upravit ? el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: upravit }, ikona('sipka-vlevo'), h('sim.upravit_kontrolu')) : null));
}

// ---------------------------------------------------------------------
// Řízení stránky (síť)
// ---------------------------------------------------------------------

async function potvrd(text, ano, ne) {
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': 'simPotvrzeni' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'simPotvrzeni', text: h('sim.rodic_odevzdalo') }),
      el('p', { text }),
      el('div', { class: 'modal__akce' },
        el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => zavritModal(dialog, 'ne') }, ne),
        el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => zavritModal(dialog, 'ano') }, ano))));
  document.body.append(dialog);
  const volba = await otevritModal(dialog);
  dialog.remove();
  return volba === 'ano';
}

async function zeptejSeNaRezim() {
  const karta = (rezim, ik, nazev, popis) => el('button', { class: 'volba-karta', type: 'button', onClick: () => zavritModal(dialog, rezim) },
    el('span', { class: 'ikona-kruh' }, ikona(ik)), el('span', { class: 'volba-karta__nazev', text: nazev }), el('span', { class: 'volba-karta__popis', text: popis }));
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': 'simRezim' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'simRezim', text: 'Jak dnes budete pracovat?' }),
      el('p', { class: 'modal__text', text: h('sim.modal_text') }),
      el('div', { class: 'volby-karet' },
        karta('papir', 'tiskarna', 'Na papír', 'Vytisknete testový sešit a záznamový arch.'),
        karta('app', 'obrazovka', 'V aplikaci', 'Dítě zadává výsledky na počítači nebo tabletu.'))));
  document.body.append(dialog);
  const volba = await otevritModal(dialog);
  dialog.remove();
  return volba === 'app' ? 'app' : 'papir';
}

/** Počet úloh s odevzdaným krokem `final` od dítěte. */
const odevzdanoUloh = (odpovedi) => new Set((odpovedi || []).filter((o) => o.krok_id === 'final' && (o.zadal || 'dite') === 'dite').map((o) => o.uloha_id)).size;

/**
 * Simulace na rodic.html (volá rodic.js, když lekce je typu simulace).
 * @param {{lekce: object, dite: {id: string, krestni_jmeno: string}, elObsah: HTMLElement, elListaLekce: HTMLElement, elSpodniLista?: HTMLElement}} k
 */
export async function spustSimulaciRodic({ lekce, dite, elObsah, elListaLekce, elSpodniLista }) {
  const sb = await import('./supabase.js');
  elListaLekce.hidden = true;
  if (elSpodniLista) elSpodniLista.hidden = true;
  const ukaz = (...deti) => { elObsah.removeAttribute('aria-busy'); elObsah.replaceChildren(...deti); window.scrollTo({ top: 0 }); };

  const sim = lekce.simulace || {};
  const druhaId = sim.cast === 2 ? sim.prvni_cast : sim.druha_cast;
  const druha = await nactiLekciObsah(druhaId);
  const [lekce1, lekce2] = sim.cast === 2 ? [druha, lekce] : [lekce, druha];

  let temata = new Map();
  try { temata = new Map((await sb.katalogLekci()).map((l) => [l.id, l.tema])); } catch { /* bez témat: „lekce F2-…" */ }
  const zobrazSouhrn = (souhrn, upravit = null) => ukaz(vytvorSouhrnSimulace(souhrn, { jmeno: dite.krestni_jmeno, temata, upravit }));

  // --- sezení: ?sezeni= (souhrn z přehledu), jinak rozpracovaná / dokončená / nová (jen s ?rezim=)
  const idZUrl = param('sezeni');
  if (idZUrl) {
    const { sezeni } = await sb.stavSezeni(idZUrl);
    if (sezeni.dite_id === dite.id && sezeni.souhrn?.typ === 'simulace') { zobrazSouhrn(sezeni.souhrn); return; }
  }
  let s1 = await posledniSezeniCasti(dite.id, lekce1.id);
  let s2 = await posledniSezeniCasti(dite.id, lekce2.id);
  const rezimUrl = ['app', 'papir'].includes(param('rezim')) ? param('rezim') : null;
  if (s1?.stav === 'dokonceno' && s1.souhrn?.typ === 'simulace' && !rezimUrl) { zobrazSouhrn(s1.souhrn); return; }
  if (!s1 || s1.stav !== 'probiha') {
    const rezim = rezimUrl || await zeptejSeNaRezim();
    s1 = (await sb.zacitSezeni(dite.id, lekce1.id, rezim)).sezeni;
  }
  if (s2 && Date.parse(s2.zacatek) < Date.parse(s1.zacatek)) s2 = null; // 2. část z minulé simulace
  const rezim = s1.rezim;

  let odpovedi1 = [];
  let odpovedi2 = [];
  const nacti = async () => {
    odpovedi1 = (await sb.stavSezeni(s1.id)).odpovedi.concat(sb.neulozeneOdpovedi({ sezeniId: s1.id }));
    if (!s2) {
      const kandidat = await posledniSezeniCasti(dite.id, lekce2.id);
      if (kandidat && Date.parse(kandidat.zacatek) >= Date.parse(s1.zacatek)) s2 = kandidat;
    }
    odpovedi2 = s2 ? (await sb.stavSezeni(s2.id)).odpovedi.concat(sb.neulozeneOdpovedi({ sezeniId: s2.id })) : [];
  };
  const casTestu = () => (s2
    ? casSimulace({ cast: 2, zacatek1: s1.zacatek, konec1: konecCasti(s1, odpovedi1), zacatek2: s2.zacatek, odpocetMin: sim.odpocet_min || 70 })
    : casSimulace({ cast: 1, zacatek1: s1.zacatek, odpocetMin: sim.odpocet_min || 70 }));

  // --- C) souhrn
  const dokoncit = async () => {
    await nacti().catch(() => {});
    const c = casTestu();
    const souhrn = sestavSouhrnSimulace({ lekce1, lekce2, odpovedi1, odpovedi2, rezim, rozdeleno: rezim === 'app' && c.rozdeleno });
    zobrazSouhrn(souhrn, () => kontrola());
    try {
      await sb.dokoncitSezeni(s1.id, souhrn);
      if (s2) await sb.dokoncitSezeni(s2.id, souhrn);
      toast(h('chyba.ulozeni_ok'));
    } catch (e) {
      console.error(e);
      toast(e.message || h('chyba.ulozeni'), { typ: 'varovani', trvani: 6000 });
    }
  };

  // --- B) Kontrola
  const pokusy = new Map();
  async function kontrola() {
    await nacti();
    if (!s2) s2 = (await sb.zacitSezeni(dite.id, lekce2.id, rezim)).sezeni; // papír: 2. část zakládá až Kontrola
    ukaz(vytvorKontrolu({
      rezim,
      casti: [{ cast: 1, lekce: lekce1, odpovedi: odpovedi1 }, { cast: 2, lekce: lekce2, odpovedi: odpovedi2 }],
    }, {
      ulozit: async (cast, uloha, z) => {
        const sezeni = cast === 1 ? s1 : s2;
        const odpovedi = cast === 1 ? odpovedi1 : odpovedi2;
        const klic = `${cast}/${uloha.id}/${z.krokId}`;
        const dosud = odpovedi.filter((o) => o.uloha_id === uloha.id && o.krok_id === z.krokId && o.zadal === 'rodic')
          .reduce((m, o) => Math.max(m, Number(o.pokus) || 0), 0);
        const pokus = Math.max(dosud, pokusy.get(klic) || 0) + 1;
        pokusy.set(klic, pokus);
        await sb.ulozOdpoved({ sezeniId: sezeni.id, ulohaId: uloha.id, krokId: z.krokId, hodnota: z.hodnota, spravne: z.spravne, typChyby: z.typChyby, pokus, zadal: 'rodic' });
        odpovedi.push({ uloha_id: uloha.id, krok_id: z.krokId, hodnota: z.hodnota, spravne: z.spravne, typ_chyby: z.typChyby, pokus, zadal: 'rodic', created_at: new Date().toISOString() });
      },
      souhrn: dokoncit,
    }));
  }

  try {
    if (localStorage.getItem(klicOdevzdano(s1.id))) { await kontrola(); return; }
  } catch { /* bez úložiště: začne se kartou „běží" */ }

  // --- A) během testu
  await nacti();
  let karta = null;
  let casovac = null;
  let poll = null;
  const odevzdalo = async () => {
    if (!(await potvrd(h('sim.rodic_potvrzeni'), h('sim.rodic_potvrzeni_ano'), h('sim.rodic_zpet')))) return;
    clearInterval(casovac);
    clearInterval(poll);
    try { localStorage.setItem(klicOdevzdano(s1.id), new Date().toISOString()); } catch { /* nevadí */ }
    try { await kontrola(); } catch (e) { console.error(e); chybaStranky(elObsah, e.message || h('chyba.nacteni')); }
  };
  const vykresli = ({ nahoru = true } = {}) => {
    karta = vytvorBezi({
      cislo: sim.cislo ?? null, rezim, cas: casTestu(),
      odevzdano: rezim === 'app' ? odevzdanoUloh(odpovedi1) + odevzdanoUloh(odpovedi2) : null,
      celkem: lekce1.ulohy.length + lekce2.ulohy.length,
    }, { odevzdalo, obnovit: () => nacti().then(vykresli).catch((e) => toast(e.message || h('chyba.nacteni'), { typ: 'varovani' })) });
    if (nahoru) ukaz(karta);
    else { elObsah.removeAttribute('aria-busy'); elObsah.replaceChildren(karta); } // polling nemění pozici stránky
  };
  vykresli();
  casovac = setInterval(() => karta?.tik(), 1000);
  if (rezim === 'app') {
    poll = setInterval(() => {
      if (document.visibilityState !== 'visible' || document.querySelector('dialog[open]')) return;
      nacti().then(() => vykresli({ nahoru: false })).catch(() => {});
    }, INTERVAL_POLLINGU);
  }
}

