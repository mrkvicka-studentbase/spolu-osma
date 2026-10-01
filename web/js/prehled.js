// =====================================================================
// prehled.js — obrazovka 4 z kostra/04: týdenní přehled (rodič i žák, jiný důraz)
// + volba role (obr. 3) při prvním příchodu + modal volby režimu (obr. 5).
//
// Rodič navíc: manuál „Jak vést lekci" (modal), SOS u kapitoly (mailto), výzva k dotazníku
// po 4. pilotní lekci, informace o platbě u zamčených lekcí.
// Manuál a slovníček „Jak číst zápisy nahlas": menu.js (texty generované z obsah/*.md).
// Hotová lekce u rodiče (R19): „Zobrazit souhrn" (rodic.html?…&sezeni=<poslední dokončené>) + „Projít znovu".
// Dva předměty (ZADANI-CESTINA §8.2, predmet.js): záložky „Matematika | Čeština“ jen u dítěte s oběma předměty
// (deti.predmety, migrace 0007); zdroj pravdy URL ?predmet=, localStorage spolu.predmet jen pohodlí.
// Sekce, „Tento týden“, pokroky, výzvy i zámky se počítají jen z lekcí vybraného předmětu.
// Bez migrace (katalog bez predmet, dítě bez predmety) = vše matematika, přehled beze změny.
// =====================================================================

import { el, ikona, chranStranku, nacitani, chybaStranky, otevritModal, zavritModal, formatDatum, textSOdkazy } from './ui.js';
import { h } from './hlasky.js';
import { nazevKapitoly } from './obsah.js';
import { mojeDeti, lekceProDite, stavSezeni } from './supabase.js';
import { ziskejRoli, ziskejDite, nastavDite, stranaLekce, vykresliVolbuRole } from './role.js';
import { napojMenu, otevritManual, nastavPredmet } from './menu.js';
import { otevritPridaniDitete, otevritPredmetyDitete } from './dite-formular.js';
import {
  PREDMETY, predmetLekce, predmetyDitete, maSloupecPredmety, zvolPredmet, ulozenyPredmet, ulozPredmet,
} from './predmet.js';
import { jeDiagnostikaVKatalogu, pocetOdevzdanych } from './diagnostika.js';
import { typVKatalogu } from './simulace.js';
import * as KONFIG from './config.js';
import { spocitejOdznaky, svgOdznaku } from './odznaky.js';
import { radekOdznaku, ukazNoveOdznaky } from './odznaky-ui.js';
import { dveSamoZaSebou } from './samo.js';

const NAZVY_FAZI = { pilot: 'Pilot', faze1: 'Fáze 1', faze2: 'Fáze 2', zaklady: 'Čeština' };
const KONEC_PREDPRODEJE = new Date(2026, 11, 1); // od 1. 12. 2026 platí 990 Kč (posun 25. 9., R35)
const BARVY = {
  zelena: { ikona: 'fajfka', klic: 'rodic.barva_zelena' },
  oranzova: { ikona: 'opakovat', klic: 'rodic.barva_oranzova' },
  cervena: { ikona: 'stop', klic: 'rodic.barva_cervena' },
};

const stav = { rodina: null, deti: [], dite: null, role: null, vybranaLekce: null, odznaky: null, predmet: 'matematika' };

const $ = (id) => document.getElementById(id);

const slovoLekce = (n) => (n >= 1 && n <= 4 ? 'lekce' : 'lekcí');

// ---------------------------------------------------------------------
// Pomocné výpočty
// ---------------------------------------------------------------------

/** Kolik úloh rozpracovaného sezení je hotových (výsledek odevzdán nebo semafor kliknut). */
function hotoveUlohy({ odpovedi, semafory }) {
  const hotove = new Set(semafory.map((s) => s.uloha_id));
  for (const o of odpovedi) {
    if (o.krok_id === 'final' && (o.spravne !== false || o.pokus >= 2 || o.zadal === 'rodic')) hotove.add(o.uloha_id);
  }
  return hotove.size;
}

function jeDnes(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

/**
 * Text zámku na kartě / řádku týdne (zadání 30. 9., A): nikdy cena — jen kdy se otevře, jinak „Zamčeno".
 * Cena a výzva k platbě jsou jednou v bloku nad zamčenou částí (jen rodič, textZamku({zamceno:'platba'})).
 */
function textZamkuKarty(l) {
  if (l.zamceno === 'uzavreno') return 'Sezóna skončila.';
  const od = Date.parse(l.otevrit_od || '');
  if (Number.isFinite(od) && od > Date.now()) return h('zamceno.faze', { datum: formatDatum(l.otevrit_od).replace(/\.$/, '') });
  return 'Zamčeno';
}

function textZamku(l) {
  // formatDatum vrací „1. 12." a hláška končí tečkou → bez koncové tečky data
  if (l.zamceno === 'datum') return h('zamceno.faze', { datum: formatDatum(l.otevrit_od).replace(/\.$/, '') });
  if (l.zamceno === 'uzavreno') return 'Sezóna skončila.';
  if (l.zamceno === 'predmet') return h('zamceno.predmet'); // čeština: žádné dítě rodiny ji nemá zapnutou (0007)
  if (stav.rodina?.dotaznik_vyplnen) return h('zamceno.platba_dotaznik');
  return new Date() < KONEC_PREDPRODEJE ? h('zamceno.platba_predprodej') : h('zamceno.platba');
}

function skupinyPoTydnech(lekce) {
  const skupiny = new Map();
  for (const l of lekce) {
    const klic = `${l.faze}|${l.tyden}`;
    if (!skupiny.has(klic)) skupiny.set(klic, { faze: l.faze, tyden: l.tyden, lekce: [] });
    skupiny.get(klic).lekce.push(l);
  }
  return [...skupiny.values()];
}

/** „Tento týden" = první týden s otevřenou nedokončenou lekcí, jinak poslední otevřený. */
function aktualniTyden(vsechny) {
  // diagnostika (týden 0) je doporučená, ne povinná — „tento týden" z ní neděláme, když jsou i jiné týdny
  const bezDiag = vsechny.filter((s) => !(s.faze === 'faze1' && Number(s.tyden) === 0));
  const skupiny = bezDiag.length ? bezDiag : vsechny;
  return skupiny.find((s) => s.lekce.some((l) => !l.zamceno && l.stavLekce !== 'hotovo'))
    || [...skupiny].reverse().find((s) => s.lekce.some((l) => !l.zamceno))
    || skupiny[0];
}

// ---------------------------------------------------------------------
// Karty lekcí
// ---------------------------------------------------------------------

function sosOdkaz(l) {
  const kapitola = nazevKapitoly(l.kapitola);
  const predmet = h('sos.mailto_predmet', { kapitola_nazev: kapitola, jmeno_ditete: stav.dite.krestni_jmeno });
  const telo = h('sos.mailto_telo', {
    kapitola_nazev: kapitola, jmeno_ditete: stav.dite.krestni_jmeno, lekce_tema: l.tema, lekce_id: l.id,
    jmeno_rodice: stav.rodina?.jmeno_rodice || '',
  });
  return `mailto:${KONFIG.SOS_EMAIL || ''}?subject=${encodeURIComponent(predmet)}&body=${encodeURIComponent(telo.replace(/\n/g, '\r\n'))}`;
}

function tlacitkoSos(l) {
  const href = sosOdkaz(l);
  return el('a', {
    class: 'tlacitko tlacitko--tiche', href,
    'aria-label': `SOS: ${nazevKapitoly(l.kapitola)}`,
    onClick: (e) => { e.preventDefault(); otevritSos(l, href); },
  }, ikona('sos'), 'SOS');
}

function vysledekLekce(barva) {
  const b = BARVY[barva];
  if (!b) return null;
  const [nazev, ...zbytek] = h(b.klic).split(':');
  return el('div', { class: 'karta-lekce__vysledek' },
    el('span', { class: `semafor-znak semafor-znak--${barva}`, 'aria-hidden': 'true' }, ikona(b.ikona)),
    el('span', null, el('strong', { text: nazev }), zbytek.length ? ` — ${zbytek.join(':').trim()}` : ''));
}

/**
 * Karta vstupní diagnostiky (týden 0, obrazovka §1, R37): doporučená, jednorázová; žák výsledek nevidí,
 * rodič po dokončení „Výsledek diagnostiky". Zamčená stejně jako Fáze 1 (větev l.zamceno v kartaLekce).
 */
function kartaDiagnostiky(l, pokrok) {
  const rodic = stav.role === 'rodic';
  const celkem = 24;
  const meta = el('div', { class: 'karta-lekce__meta' },
    el('span', null, ikona('hodiny'), `${l.cas_min || 40} min`), el('span', { text: `${celkem} úloh` }));
  const popis = el('p', { class: 'karta-lekce__popis text-tlumeny', text: h('diag.karta_podtitul') });
  let stitek;
  let akce = null;
  if (l.stavLekce === 'probiha') {
    stitek = el('span', { class: 'stitek stitek--navy', text: `Probíhá${l.sezeni?.rezim === 'papir' ? ' · papír' : ''}` });
    akce = [el('button', {
      class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button',
      onClick: () => { location.href = stranaLekce(stav.role, l.id, stav.dite.id, l.sezeni?.rezim); },
    }, 'Pokračovat', ikona('sipka-vpravo')),
    rodic && pokrok != null ? el('p', { class: 'text-tlumeny', text: h('diag.rodic_odevzdano', { x: pokrok, celkem }) }) : null];
  } else if (l.stavLekce === 'hotovo') {
    stitek = el('span', { class: 'stitek' }, ikona('fajfka'), h('diag.karta_hotovo'));
    // žák: jen „Hotovo" (výsledek nevidí); rodič: výsledek (jen pro čtení)
    akce = rodic && l.sezeni?.stav === 'dokonceno'
      ? el('a', {
        class: 'tlacitko tlacitko--sekundarni',
        href: `rodic.html?${new URLSearchParams({ lekce: l.id, dite: stav.dite.id, sezeni: l.sezeni.id })}`,
      }, ikona('oko'), h('diag.karta_vysledek'))
      : null;
  } else {
    stitek = el('span', { class: 'stitek', text: 'Nezačato' });
    akce = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button', onClick: () => otevritRezim(l) },
      rodic ? h('diag.karta_zacit') : h('diag.karta_zacit_zak'));
  }
  return el('article', { class: `karta-lekce karta-lekce--${l.stavLekce} karta-lekce--diagnostika` },
    el('div', { class: 'karta-lekce__hlavicka' }, el('span', { class: 'karta-lekce__poradi', text: 'Týden 0' }), stitek),
    el('h3', { class: 'karta-lekce__tema', text: l.tema }),
    popis, meta,
    rodic && l.stavLekce === 'nezacato' ? el('p', { class: 'karta-lekce__popis', text: h('diag.karta_doporuceni') }) : null,
    akce ? el('div', { class: 'karta-lekce__akce' }, akce) : null);
}

function kartaLekce(l, pokrok) {
  const poradi = el('span', { class: 'karta-lekce__poradi', text: `Lekce ${l.poradi}` });
  const tema = el('h3', { class: 'karta-lekce__tema', text: l.tema });

  if (l.zamceno) {
    const text = textZamkuKarty(l); // bez ceny (zadání 30. 9., A)
    return el('article', { class: 'karta-lekce karta-lekce--zamceno', 'aria-disabled': 'true' },
      el('div', { class: 'karta-lekce__hlavicka' }, poradi, el('span', { class: 'stitek' }, ikona('zamek'), 'Zamčeno')),
      tema,
      text !== 'Zamčeno' ? el('p', { class: 'karta-lekce__zamek' }, ikona('zamek'), text) : null);
  }

  if (jeDiagnostikaVKatalogu(l)) return kartaDiagnostiky(l, pokrok);
  const rodic = stav.role === 'rodic';
  // Fáze 2 (R38): štítek typu (blok na čas / simulace · část); simulace = dvě navazující karty
  const typ = typVKatalogu(l);
  const sim = typ === 'simulace';
  const stitekTypu = typ === 'blok'
    ? el('span', { class: 'stitek stitek--navy karta-lekce__typ' }, ikona('hodiny'), h('blok.stitek'))
    : sim ? el('span', { class: 'stitek stitek--navy karta-lekce__typ', text: h('sim.stitek', { cast: l.simCast || 1 }) }) : null;
  const cj = predmetLekce(l) === 'cestina'; // čeština: 6 úloh, 30 min (FORMAT-CJ)
  const pocetUloh = sim ? 8 : cj ? 6 : 4;
  const meta = el('div', { class: 'karta-lekce__meta' },
    el('span', null, ikona('hodiny'), `${l.cas_min || (cj ? 30 : 20)} min`), el('span', { text: sim ? h('sim.karta_uloh') : cj ? '6 úloh' : '4 úlohy' }));
  const popisSim = sim ? el('p', { class: 'karta-lekce__popis text-tlumeny', text: h(l.simCast === 2 ? 'sim.karta_popis_2' : 'sim.karta_popis_1') }) : null;
  let stitek;
  let akce;
  let vysledek = null;
  let roh = null;
  const celaSpravne = l.stavLekce === 'hotovo' && Boolean(stav.odznaky?.celaSpravne.has(l.id));
  if (l.stavLekce === 'probiha') {
    const papir = l.sezeni?.rezim === 'papir';
    stitek = el('span', { class: 'stitek stitek--navy', text: `Probíhá${pokrok != null ? ` · ${pokrok}/${pocetUloh}` : ''}${papir ? ' · papír' : ''}` });
    akce = el('button', {
      class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button',
      onClick: () => { location.href = stranaLekce(stav.role, l.id, stav.dite.id, l.sezeni?.rezim); },
    }, 'Pokračovat', ikona('sipka-vpravo'));
  } else if (l.stavLekce === 'hotovo') {
    // R61: hotová lekce zřetelně (zelená karta + fajfka v rohu), celá správně ještě výrazněji (zlatá + hvězda)
    stitek = celaSpravne
      ? el('span', { class: 'stitek--hvezda' }, ikona('hvezda'), 'Celá správně')
      : el('span', { class: 'stitek' }, ikona('fajfka'), 'Hotovo'); // neutrální — barvu nese semafor vedle
    roh = el('span', { class: 'karta-lekce__roh', 'aria-hidden': 'true', htmlBezpecne: celaSpravne ? svgOdznaku('spravne') : ROH_FAJFKA });
    vysledek = vysledekLekce(l.souhrn?.hlavniBarva);
    if (l.dokoncene?.rezim === 'samo') vysledek = [vysledek, el('span', { class: 'stitek stitek--samo', text: h('samo.stitek') })]; // R64
    const znovu = el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: () => otevritRezim(l) }, ikona('opakovat'), 'Projít znovu');
    // R19: rodič vidí souhrn posledního dokončeného sezení (jen pro čtení), žák jen „Projít znovu"
    akce = rodic && l.sezeni?.stav === 'dokonceno'
      ? [el('a', {
        class: 'tlacitko tlacitko--sekundarni',
        href: `rodic.html?${new URLSearchParams({ lekce: l.id, dite: stav.dite.id, sezeni: l.sezeni.id })}`,
      }, ikona('oko'), sim ? h('sim.karta_souhrn') : 'Zobrazit souhrn'), znovu]
      : znovu;
  } else {
    stitek = el('span', { class: 'stitek', text: 'Nezačato' });
    akce = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button', onClick: () => otevritRezim(l) },
      sim && rodic ? h('sim.karta_zacit') : 'Začít lekci');
  }
  // SOS u bloků a simulací nabízí souhrn lekce podle kapitoly úlohy (katalog kapitolu úloh nezná)
  return el('article', { class: ['karta-lekce', `karta-lekce--${l.stavLekce}`, typ && `karta-lekce--${typ}`, celaSpravne && 'karta-lekce--hvezda'] },
    roh,
    el('div', { class: 'karta-lekce__hlavicka' }, poradi, stitek),
    stitekTypu, tema, popisSim, meta, vysledek,
    el('div', { class: 'karta-lekce__akce' }, akce, rodic && !typ ? tlacitkoSos(l) : null));
}

// ---------------------------------------------------------------------
// Modaly: režim, SOS, manuál, menu
// ---------------------------------------------------------------------

function otevritRezim(l) {
  stav.vybranaLekce = l;
  const rodic = stav.role === 'rodic';
  $('modalRezimNadpis').textContent = rodic ? 'Jak dnes budete pracovat?' : 'Jak dnes budeš pracovat?';
  $('rezimAppPopis').textContent = rodic ? 'Dítě řeší na počítači nebo tabletu.' : 'Řešíš na počítači nebo tabletu.';
  $('rezimPapirPopis').textContent = rodic ? 'Vytisknete úlohy, výsledky zadáte vy.' : 'Počítáš na papíře, výsledky zadá rodič.';
  // diagnostika: navíc věta pro rodiče (obrazovka §1)
  let diagText = $('rezimDiagText');
  if (!diagText) {
    diagText = el('p', { class: 'modal__text', id: 'rezimDiagText' });
    $('modalRezimNadpis').after(diagText);
  }
  const simulace = typVKatalogu(l) === 'simulace';
  diagText.textContent = simulace ? h('sim.modal_text') : h('diag.start_rodic');
  diagText.hidden = !(rodic && (jeDiagnostikaVKatalogu(l) || simulace));
  // R64 „Dnes samo": jen běžná lekce (ne blok, simulace, diagnostika); žák potvrdí, že rodič ví
  const samo = !typVKatalogu(l) && !jeDiagnostikaVKatalogu(l) && predmetLekce(l) !== 'cestina'; // čeština jen s rodičem (R66)
  $('rezimSamo').hidden = !samo;
  $('rezimSamoPopis').textContent = h(rodic ? 'samo.volba_popis_rodic' : 'samo.volba_popis_zak');
  $('rezimSamoPotvrzeni').hidden = !samo || rodic;
  $('rezimSamoSouhlas').checked = false;
  $('rezimSamo').disabled = samo && !rodic;
  otevritModal($('modalRezim'));
}

function napojRezim() {
  $('rezimSamoSouhlas').addEventListener('change', (e) => { $('rezimSamo').disabled = !e.target.checked; });
  $('modalRezim').addEventListener('click', (e) => {
    const volba = e.target.closest('[data-rezim]');
    const l = stav.vybranaLekce;
    if (!volba || !l) return;
    const rezim = volba.dataset.rezim;
    zavritModal($('modalRezim'), rezim);
    const lekce = stranaLekce(stav.role, l.id, stav.dite.id, rezim);
    // H3 (R29): papír = nejdřív tisk VE STEJNÉ KARTĚ (žádné window.open — na Androidu bílá stránka);
    // „Zpět k lekci" v tisku vede na stránku lekce v režimu papír (rodič: krok ④ Výsledek dítěte).
    // simulace: tisk obou částí najednou (testový sešit + záznamový arch, osnova F2 §3.3)
    const tiskLekce = l.simPar ? l.simPar.join(',') : l.id;
    location.href = rezim === 'papir'
      ? `tisk.html?${new URLSearchParams({ lekce: tiskLekce, dite: stav.dite.id, zpet: lekce })}`
      : lekce;
  });
}

function otevritSos(l, href) {
  $('sosText').textContent = h('sos.text');
  $('sosKapitola').textContent = `Kapitola: ${nazevKapitoly(l.kapitola)} · ${stav.dite.krestni_jmeno}`;
  $('sosOdkaz').href = href;
  otevritModal($('modalSos'));
}



// ---------------------------------------------------------------------
// Vykreslení přehledu
// ---------------------------------------------------------------------

function hlavickaPrehledu(tyden) {
  const hotovo = tyden ? tyden.lekce.filter((l) => l.stavLekce === 'hotovo').length : 0;
  const pocet = tyden ? tyden.lekce.length : 0;
  const prepinacDeti = stav.deti.length > 1
    ? el('div', { class: 'prepinac', role: 'group', 'aria-label': 'Dítě' }, stav.deti.map((d) => el('button', {
      class: 'prepinac__volba', type: 'button', 'aria-pressed': String(d.id === stav.dite.id),
      onClick: () => { if (d.id !== stav.dite.id) { nastavDite(d.id); vykresli(); } },
    }, d.krestni_jmeno)))
    : null;
  // QA B1: druhé dítě jde přidat, dokud má rodina méně než 2 profily
  const pridat = stav.deti.length < 2
    ? el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: () => pridatDite() }, ikona('uzivatel'), h('dite.pridat_tlacitko'))
    : null;
  // předměty dítěte: jen rodič a jen po migraci 0007 (řádek dítěte má sloupec predmety)
  const predmety = stav.role === 'rodic' && maSloupecPredmety(stav.dite)
    ? el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: () => upravitPredmety() }, ikona('tuzka'), h('dite.predmety_tlacitko'))
    : null;
  // „Pilot · týden 1" nese nadpis sekce s kartami lekcí — v hlavičce se neopakuje
  return el('div', { class: 'prehled-hlavicka' },
    el('div', { class: 'radek radek--mezi' }, el('h1', { text: stav.dite.krestni_jmeno }), prepinacDeti,
      predmety ? el('div', { class: 'radek' }, pridat, predmety) : pridat),
    prepinacPredmetu(),
    tyden ? el('div', { class: 'prehled-hlavicka__tyden' },
      el('span', { text: `Tento týden: ${pocet} ${slovoLekce(pocet)}, hotovo ${hotovo}` }),
      el('div', {
        class: 'pruh', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(pocet), 'aria-valuenow': String(hotovo),
        'aria-label': `Hotovo ${hotovo} ze ${pocet} ${slovoLekce(pocet)}`,
      }, el('span', { class: 'pruh__vypln', style: `width:${pocet ? Math.round((hotovo / pocet) * 100) : 0}%` }))) : null,
    el('p', { class: 'text-tlumeny', text: 'Doporučujeme nejvýš jednu lekci denně.' }));
}

/**
 * Záložky „Matematika | Čeština“ (ZADANI-CESTINA §8.2) — jen když má dítě aktivní oba předměty.
 * Klik: URL ?predmet= (zdroj pravdy, zpět v prohlížeči funguje), localStorage jen pohodlí.
 */
function prepinacPredmetu() {
  const aktivni = predmetyDitete(stav.dite);
  if (aktivni.length < 2) return null;
  return el('div', null, el('div', { class: 'prepinac prepinac--predmet', role: 'group', 'aria-label': h('predmet.prepinac') },
    PREDMETY.filter((p) => aktivni.includes(p)).map((p) => el('button', {
      class: 'prepinac__volba', type: 'button', 'aria-pressed': String(p === stav.predmet), dataset: { predmet: p },
      onClick: () => {
        if (p === stav.predmet) return;
        ulozPredmet(p);
        const url = new URL(location.href);
        url.searchParams.set('predmet', p);
        url.hash = '';
        history.pushState(null, '', url);
        vykresli();
      },
    }, h(`predmet.${p}`)))));
}

/** Formulář předmětů dítěte (jen po migraci 0007) → obnovit děti a překreslit. */
async function upravitPredmety() {
  const ulozene = await otevritPredmetyDitete(stav.dite);
  if (!ulozene) return;
  try { stav.deti = await mojeDeti(); } catch (e) { console.error(e); stav.deti = stav.deti.map((d) => (d.id === ulozene.id ? ulozene : d)); }
  await vykresli();
}

/** Formulář nového dítěte (dite-formular.js) → obnovit děti a přepnout na nové. */
async function pridatDite() {
  // volba předmětů jen když DB sloupec deti.predmety má (migrace 0007) — u prvního dítěte to nepoznáme
  const nove = await otevritPridaniDitete({ prvni: stav.deti.length === 0, predmety: stav.deti.some(maSloupecPredmety) });
  if (!nove) return;
  try { stav.deti = await mojeDeti(); } catch (e) { console.error(e); stav.deti = [...stav.deti, nove]; }
  nastavDite(nove.id);
  await vykresli();
}

/**
 * Simulace (R38) = dvě navazující lekce s kapitolou `simulace` (katalog nemá obsah): v pořadí katalogu
 * první = 1. část, druhá = 2. část. Doplní `simCast` (1|2) a `simPar` ([id 1. části, id 2. části]).
 */
function oznacCastiSimulace(lekce) {
  let prvni = null;
  for (const l of lekce) {
    if (typVKatalogu(l) !== 'simulace') { prvni = null; continue; }
    if (!prvni) { prvni = l; l.simCast = 1; continue; }
    l.simCast = 2;
    l.simPar = [prvni.id, l.id];
    prvni.simPar = [prvni.id, l.id];
    prvni = null;
  }
}

/** Fajfka v rohu hotové karty (R61). */
const ROH_FAJFKA = '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#1FC27E" stroke="#0F172A" stroke-width="3"/><path d="M13 22.5l6 6 12-12" fill="none" stroke="#0F172A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';


/** Ukazatel postupu (R63): hotové lekce aktuální fáze, přes celou šířku přehledu. Časová osa je v hlavičce (osa-sezony.js). */
function ukazatelPostupu(lekce, od, tyden) {
  // hotové lekce aktuální fáze z katalogu (Fáze 1 včetně diagnostiky), přes celou šířku (R63, Pavel 30. 9.)
  const faze = tyden ? lekce.filter((l) => l.faze === tyden.faze) : [];
  const fazeHotovo = faze.filter((l) => od.hotove.has(l.id)).length;
  const nazevFaze = tyden ? NAZVY_FAZI[tyden.faze] || tyden.faze : '';
  const procent = faze.length ? Math.round((fazeHotovo / faze.length) * 100) : 0;
  return el('div', { class: 'postup-pruh', role: 'img', 'aria-label': `${nazevFaze}: hotovo ${fazeHotovo} z ${faze.length} lekcí` },
    el('div', { class: 'postup-pruh__popis' }, el('strong', { text: nazevFaze }), el('span', { text: `hotovo ${fazeHotovo} z ${faze.length} ${faze.length === 1 ? 'lekce' : 'lekcí'}` })),
    el('div', { class: 'postup-podil' }, el('span', { style: `width:${procent}%` })));
}

/** Zamčený týden jedním řádkem: témata lekcí + kdy se otevře (bez ceny). */
function radekZamcenehoTydne(s) {
  return el('div', { class: 'tyden-zamceny', 'aria-disabled': 'true' },
    ikona('zamek'),
    el('div', { class: 'tyden-zamceny__text' },
      el('p', { class: 'tyden-zamceny__temata', text: s.lekce.map((l) => l.tema).join(' · ') }),
      el('p', { class: 'tyden-zamceny__stav', text: textZamkuKarty(s.lekce[0]) })));
}

function hlaska(druh, ikonaNazev, obsah) {
  return el('div', { class: `hlaska hlaska--${druh}`, role: 'status' }, ikona(ikonaNazev), el('div', { class: 'hlaska__text' }, obsah));
}

async function vykresli() {
  const obsah = $('obsah');
  stav.role = ziskejRoli();
  if (!stav.role) {
    vykresliVolbuRole(obsah, () => vykresli());
    return;
  }
  if (!stav.deti.length) {
    // registrace bez dítěte (trigger ho nezaložil) → místo lekcí nabídka profilu
    obsah.removeAttribute('aria-busy');
    obsah.replaceChildren(el('div', { class: 'prazdny-stav' },
      el('span', { class: 'ikona-kruh' }, ikona('uzivatel')),
      el('h1', { class: 'prazdny-stav__nadpis', text: h('dite.prvni_nadpis') }),
      el('p', { class: 'prazdny-stav__text', text: h('prazdny.deti') }),
      el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button', onClick: () => pridatDite() },
        h('dite.prvni_tlacitko'))));
    return;
  }
  stav.dite = stav.deti.find((d) => d.id === ziskejDite()) || stav.deti[0];
  nastavDite(stav.dite.id);
  // předmět: URL → uložená volba → první aktivní předmět dítěte (jen z aktivních; bez migrace vždy matematika)
  const zUrl = new URLSearchParams(location.search).get('predmet');
  stav.predmet = zvolPredmet({ url: zUrl, ulozeny: ulozenyPredmet(), aktivni: predmetyDitete(stav.dite) });
  if (zUrl === stav.predmet) ulozPredmet(stav.predmet);
  else if (predmetyDitete(stav.dite).length > 1) {
    // se záložkami nese předmět vždy URL (zpět v prohlížeči vrátí předchozí záložku)
    const url = new URL(location.href);
    url.searchParams.set('predmet', stav.predmet);
    history.replaceState(null, '', url);
  }
  nastavPredmet(stav.predmet); // manuál rodiče podle předmětu (menu.js)

  nacitani(obsah, 'Načítám lekce…');
  try {
    // semafor, pokroky, „Tento týden“, výzvy i zámky jen v rámci vybraného předmětu
    const vsechny = await lekceProDite(stav.dite.id);
    const lekce = vsechny.filter((l) => predmetLekce(l) === stav.predmet);
    oznacCastiSimulace(lekce);
    const pokroky = new Map(await Promise.all(lekce.filter((l) => l.stavLekce === 'probiha' && l.sezeni)
      .map((l) => stavSezeni(l.sezeni.id).then((s) => [l.id, jeDiagnostikaVKatalogu(l) || typVKatalogu(l) === 'simulace' ? pocetOdevzdanych(s.odpovedi) : hotoveUlohy(s)])
        .catch(() => [l.id, null]))));

    const rodic = stav.role === 'rodic';
    const skupiny = skupinyPoTydnech(lekce);
    const tyden = aktualniTyden(skupiny);
    stav.odznaky = spocitejOdznaky(vsechny); // R61–R63: z uložených sezení, bez změny DB; odznaky patří dítěti, ne předmětu (R66)
    const casti = [hlavickaPrehledu(tyden), ukazatelPostupu(lekce, stav.odznaky, tyden), radekOdznaku(stav.odznaky.ziskane)];

    if (rodic && dveSamoZaSebou(vsechny)) casti.push(hlaska('info', 'uzivatel', h('samo.pripominka'))); // R64 (Pavel: ano)
    if (lekce.some((l) => l.sezeni?.stav === 'dokonceno' && jeDnes(l.sezeni.konec))) {
      casti.push(hlaska('info', 'info', h('oba.max_lekce_den')));
    }
    if (rodic) {
      if (!stav.rodina?.dotaznik_vyplnen && lekce.some((l) => l.faze === 'pilot' && l.poradi >= 4 && l.stavLekce === 'hotovo')) {
        casti.push(hlaska('uspech', 'bublina', [h('dotaznik.vyzva'),
          el('div', { class: 'hlaska__akce' }, el('a', { class: 'tlacitko tlacitko--primarni', href: 'dotaznik.html' }, 'Vyplnit dotazník'))]));
      }
      casti.push(el('div', { class: 'radek' },
        el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: otevritManual }, ikona('kniha'), 'Jak vést lekci')));
    }
    // cena a výzva k platbě jednou, nad první zamčenou částí (jen rodič; žák cenu nevidí) — zadání 30. 9., A
    let blokPlatby = rodic && lekce.some((l) => l.zamceno === 'platba')
      ? hlaska('info', 'zamek', [el('strong', { text: textZamku({ zamceno: 'platba' }) }),
        KONFIG.PLATBA_TEXT ? el('p', null, textSOdkazy(KONFIG.PLATBA_TEXT)) : null, // odkaz klikací (ODPOVED 30. 9., bod 6)
        el('p', { class: 'text-maly', text: h('zamceno.po_platbe', { email: KONFIG.SOS_EMAIL || '' }) })])
      : null;

    if (!lekce.length) {
      casti.push(el('div', { class: 'prazdny-stav' },
        el('span', { class: 'ikona-kruh' }, ikona('prazdno')),
        el('h2', { class: 'prazdny-stav__nadpis', text: 'Zatím žádná lekce' }),
        el('p', { class: 'prazdny-stav__text', text: stav.predmet === 'cestina' ? h('predmet.prazdny') : h('prazdny.lekce') })));
    }
    for (const s of skupiny) {
      const nadpis = s.faze === 'faze1' && Number(s.tyden) === 0 ? h('diag.karta_sekce') : `${NAZVY_FAZI[s.faze] || s.faze} · týden ${s.tyden}`;
      if (blokPlatby && s.lekce.some((l) => l.zamceno === 'platba')) { casti.push(blokPlatby); blokPlatby = null; }
      // celý zamčený týden (2+ lekce) = jeden řádek místo karet se zámky (zadání 30. 9., A)
      const celyZamceny = s.lekce.length > 1 && s.lekce.every((l) => l.zamceno);
      // kotva #faze1-t2 — odkazy z výsledku diagnostiky na týden
      casti.push(el('section', { class: ['zasobnik', celyZamceny && 'tyden--zamceny'], id: `${s.faze}-t${s.tyden}`, 'aria-label': nadpis },
        el('h2', { class: 'nadpis-sekce', text: nadpis }),
        celyZamceny ? radekZamcenehoTydne(s) : el('div', { class: 'mrizka-karet' }, s.lekce.map((l) => kartaLekce(l, pokroky.get(l.id))))));
    }
    obsah.removeAttribute('aria-busy');
    obsah.replaceChildren(...casti);
    // R62: nově získané odznaky (dítě i rodič, na každém zařízení jednou); první načtení na zařízení tiše
    ukazNoveOdznaky(stav.dite.id, stav.odznaky.ziskane).catch((e) => console.warn('odznaky:', e));
  } catch (e) {
    console.error(e);
    chybaStranky(obsah, e?.message || h('chyba.nacteni'));
  }
}

async function start() {
  const obsah = $('obsah');
  nacitani(obsah, 'Načítám…');
  try {
    const s = await chranStranku();
    if (!s) return;
    stav.rodina = s.rodina;
    napojMenu({ prehled: false, poZmeneRole: () => vykresli() });
    napojRezim();
    // zpět/vpřed mezi záložkami předmětu (?predmet=); jiné změny historie (kotvy) nepřekreslují
    addEventListener('popstate', () => {
      const p = new URLSearchParams(location.search).get('predmet');
      if (p && p !== stav.predmet) vykresli();
    });
    stav.deti = await mojeDeti();
    await vykresli();
  } catch (e) {
    console.error(e);
    chybaStranky(obsah, e?.message || h('chyba.nacteni'));
  }
}

start();
