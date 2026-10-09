// =====================================================================
// prehled.js — Spolu 8: přehled dítěte (rodič i žák, jiný důraz) + volba role (obr. 3) + modal režimu (obr. 5).
//
// Záložky „Matematika | Čeština“ (předměty dítěte, výchozí oba; zdroj pravdy URL ?predmet=, localStorage jen pohodlí).
// V záložce: úvodní test (25 min) → „Doporučeno teď“ → 10 témat („Téma 3 · Zlomky I“), u každého učební
// a naostro lekce v pořadí s odstupem (plan-roku.js). Doporučené pořadí témat: po úvodním (pololetním) testu slabá
// témata nahoru, silná na konec; bez testu pořadí osnovy. Celý rok (ZADANI-OSMA §9): kalendář dítěte otevírá
// 3 lekce týdně od prvního sezení; B-varianta (jiné úlohy) se nabídne jen po červené; pololetní test od 11. týdne.
// Bez přijímaček, pilotu, fází, platby, dotazníku, simulací a bloků; časová osa sezóny (R63) je pryč, odznaky (R62) zůstaly.
// Rodič navíc: manuál „Jak vést lekci“, SOS u kapitoly (mailto), výsledek úvodního testu, souhrn hotové lekce (R19).
// Výsledek testu se bere ze souhrnu sezení diagnostiky; když chybí, dopočítá se z odpovědí v DB (bez nové tabulky).
// =====================================================================

import { el, ikona, chranStranku, nacitani, chybaStranky, otevritModal, zavritModal, formatDatum } from './ui.js';
import { h } from './hlasky.js';
import { nazevKapitoly, nactiLekciObsah } from './obsah.js';
import { mojeDeti, lekceProDite, stavSezeni } from './supabase.js';
import { ziskejRoli, ziskejDite, nastavDite, stranaLekce, vykresliVolbuRole } from './role.js';
import { napojMenu, otevritManual, nastavPredmet } from './menu.js';
import { otevritPridaniDitete, otevritPredmetyDitete } from './dite-formular.js';
import {
  PREDMETY, predmetLekce, predmetyDitete, zvolPredmet, ulozenyPredmet, ulozPredmet,
} from './predmet.js';
import { pocetOdevzdanych } from './diagnostika.js';
import {
  jeDiagnostikaOsma, jeSouhrnOsma, sestavSouhrnOsma, mapaKapitolNaTemata, doporucenePoradiTemat, cislaTemat,
} from './doporuceni.js';
import {
  druhLekce, jeBVarianta, jePololetniTest, poradiVTematu, planRoku, zacatekKalendare, kalendar, otevreniPololetniho,
  bVariantaPoCervene, dalsiLekceRoku,
} from './plan-roku.js';
import { nazevTematu, pocetUlohLekce, casLekce, zeZ } from './temata.js';
import * as KONFIG from './config.js';
import { spocitejOdznaky, svgOdznaku } from './odznaky.js';
import { radekOdznaku, ukazNoveOdznaky } from './odznaky-ui.js';
import { dveSamoZaSebou } from './samo.js';

const BARVY = {
  zelena: { ikona: 'fajfka', klic: 'rodic.barva_zelena' },
  oranzova: { ikona: 'opakovat', klic: 'rodic.barva_oranzova' },
  cervena: { ikona: 'stop', klic: 'rodic.barva_cervena' },
};
/** Štítek tématu podle úvodního testu (ikona + text, nikdy jen barva; slabé oranžově, ne červeně). */
const STAV_TEMATU = {
  slabe: { ikona: 'hledat', trida: 'stitek--oranzova', klic: 'osma.tema_slabe' },
  nejiste: { ikona: 'opakovat', trida: 'stitek--navy', klic: 'osma.tema_nejiste' },
  silne: { ikona: 'fajfka', trida: 'stitek--zelena', klic: 'osma.tema_silne' },
};

const stav = { rodina: null, deti: [], dite: null, role: null, vybranaLekce: null, odznaky: null, predmet: 'matematika', lekce: [], podleId: new Map() };

const $ = (id) => document.getElementById(id);

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

/** Text zámku karty: kdy se otevře (kalendář dítěte nebo seed --otevrit-od), u uzavřeného účtu konec. Nikdy cena. */
function textZamku(l) {
  if (l.zamceno === 'uzavreno') return h('osma.zamceno_uzavreno');
  if (l.zamceno === 'kalendar') return h(jePololetniTest(l) ? 'osma.pol_zamceno' : 'osma.zamceno_kalendar', { datum: formatDatum(l.kalendarOd).replace(/\.$/, '') });
  const od = Date.parse(l.otevrit_od || '');
  if (Number.isFinite(od) && od > Date.now()) return h('zamceno.faze', { datum: formatDatum(l.otevrit_od).replace(/\.$/, '') });
  return h('osma.zamceno');
}

/**
 * Výsledek úvodního testu předmětu: souhrn dokončeného sezení diagnostiky; když chybí nebo je starý,
 * dopočítá se z odpovědí v DB (obsah diagnostiky + odpovedi). null = test není hotový.
 */
async function vysledekTestu(diag, katalogPredmetu) {
  if (!diag?.dokoncene) return null;
  if (jeSouhrnOsma(diag.dokoncene.souhrn)) return diag.dokoncene.souhrn;
  try {
    const [obsah, data] = await Promise.all([nactiLekciObsah(diag.id), stavSezeni(diag.dokoncene.id)]);
    return sestavSouhrnOsma(obsah, data.odpovedi, {
      predmet: stav.predmet, mapaKapitol: mapaKapitolNaTemata(katalogPredmetu), temata: cislaTemat(katalogPredmetu),
      rezim: diag.dokoncene.rezim || 'app',
    });
  } catch (e) {
    console.warn('úvodní test: výsledek se nepodařilo dopočítat', e);
    return null;
  }
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

/** Fajfka v rohu hotové karty (R61). */
const ROH_FAJFKA = '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#1FC27E" stroke="#0F172A" stroke-width="3"/><path d="M13 22.5l6 6 12-12" fill="none" stroke="#0F172A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** „Lekce 2“ / „Lekce 2 · naostro“ / „Lekce 4 · kontrola tématu“ / „Lekce 2 · jiné úlohy“ (B-varianta). */
function textPoradi(l) {
  const d = druhLekce(l.id);
  if (d?.b) return h('osma.lekce_b', { n: l.poradi });
  if (Number(l.poradi) === 4) return h(d?.naostro ? 'osma.lekce_kontrola_naostro' : 'osma.lekce_kontrola', { n: l.poradi });
  return h(d?.naostro ? 'osma.lekce_naostro' : 'osma.lekce_poradi', { n: l.poradi });
}

/**
 * Karta lekce. `doporucena` = „Doporučeno teď“ (nahoře název tématu).
 * @param {object} l  položka lekceProDite
 * @param {number|null} pokrok  hotové úlohy rozpracovaného sezení
 */
function kartaLekce(l, pokrok, { doporucena = false } = {}) {
  const poradi = el('span', { class: 'karta-lekce__poradi', text: doporucena
    ? h('osma.tema_nadpis', { tema: l.tyden, nazev: nazevTematu(stav.predmet, l.tyden, stav.lekce) })
    : textPoradi(l) });
  const tema = el('h3', { class: 'karta-lekce__tema', text: l.tema });

  if (l.zamceno) {
    return el('article', { class: 'karta-lekce karta-lekce--zamceno', 'aria-disabled': 'true' },
      el('div', { class: 'karta-lekce__hlavicka' }, poradi, el('span', { class: 'stitek' }, ikona('zamek'), h('osma.zamceno'))),
      tema, el('p', { class: 'karta-lekce__zamek' }, ikona('zamek'), textZamku(l)));
  }

  const rodic = stav.role === 'rodic';
  const n = pocetUlohLekce(l);
  const meta = el('div', { class: 'karta-lekce__meta' },
    el('span', null, ikona('hodiny'), `${casLekce(l)} min`), el('span', { text: h(n >= 5 ? 'osma.pocet_uloh_5' : 'osma.pocet_uloh_2', { n }) }));
  let stitek;
  let akce;
  let vysledek = null;
  let roh = null;
  const celaSpravne = l.stavLekce === 'hotovo' && Boolean(stav.odznaky?.celaSpravne.has(l.id));
  if (l.stavLekce === 'probiha') {
    const rezim = l.sezeni?.rezim;
    stitek = el('span', { class: 'stitek stitek--navy', text: `Probíhá${pokrok != null ? ` · ${pokrok}/${n}` : ''}${rezim === 'papir' ? ' · papír' : ''}${rezim === 'samo' ? ` · ${h('samo.stitek')}` : ''}` });
    akce = el('button', {
      class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button',
      onClick: () => { location.href = stranaLekce(stav.role, l.id, stav.dite.id, rezim); },
    }, 'Pokračovat', ikona('sipka-vpravo'));
  } else if (l.stavLekce === 'hotovo') {
    // R61: hotová lekce zřetelně (zelená karta + fajfka v rohu), celá správně ještě výrazněji (zlatá + hvězda)
    stitek = celaSpravne
      ? el('span', { class: 'stitek--hvezda' }, ikona('hvezda'), 'Celá správně')
      : el('span', { class: 'stitek' }, ikona('fajfka'), 'Hotovo');
    roh = el('span', { class: 'karta-lekce__roh', 'aria-hidden': 'true', htmlBezpecne: celaSpravne ? svgOdznaku('spravne') : ROH_FAJFKA });
    vysledek = vysledekLekce(l.souhrn?.hlavniBarva);
    if (l.dokoncene?.rezim === 'samo') vysledek = [vysledek, el('span', { class: 'stitek stitek--samo', text: h('samo.stitek') })]; // R64
    const znovu = el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: () => otevritRezim(l) }, ikona('opakovat'), 'Projít znovu');
    // ZADANI-OSMA §9 bod 4: po červené B-varianta (stejná látka, jiné úlohy); oranžová jen ústní pětiminutovka rodiče
    const b = bVariantaPoCervene(l, stav.podleId);
    if (b && b.stavLekce === 'hotovo') vysledek = [vysledek, el('span', { class: 'stitek' }, ikona('fajfka'), h('osma.b_hotovo'))];
    else if (b && !b.zamceno) {
      vysledek = [vysledek, el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => otevritRezim(b) }, ikona('opakovat'), h('osma.b_tlacitko'))];
    }
    // R19: rodič vidí souhrn posledního dokončeného sezení (jen pro čtení), žák jen „Projít znovu"
    akce = rodic && l.sezeni?.stav === 'dokonceno'
      ? [el('a', {
        class: 'tlacitko tlacitko--sekundarni',
        href: `rodic.html?${new URLSearchParams({ lekce: l.id, dite: stav.dite.id, sezeni: l.sezeni.id })}`,
      }, ikona('oko'), 'Zobrazit souhrn'), znovu]
      : znovu;
  } else {
    stitek = el('span', { class: 'stitek', text: 'Nezačato' });
    akce = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button', onClick: () => otevritRezim(l) }, 'Začít lekci');
  }
  return el('article', { class: ['karta-lekce', `karta-lekce--${l.stavLekce}`, celaSpravne && 'karta-lekce--hvezda', doporucena && 'karta-lekce--doporucena'] },
    roh,
    el('div', { class: 'karta-lekce__hlavicka' }, poradi, stitek),
    doporucena ? el('p', { class: 'karta-lekce__popis text-tlumeny', text: textPoradi(l) }) : null,
    doporucena && l.bPo ? el('p', { class: 'karta-lekce__popis', text: h('osma.b_popis') }) : null,
    tema, meta, vysledek,
    el('div', { class: 'karta-lekce__akce' }, akce, rodic ? tlacitkoSos(l) : null));
}

/**
 * Karta úvodního testu (diagnostika Spolu 8): nabídka „Úvodní test (25 min)“ na začátku předmětu.
 * Test dělá dítě samo v aplikaci (bez taháku); rodič ho spustí a sleduje, po dokončení „Výsledek úvodního testu“.
 */
function kartaTestu(l, pokrok, vysledek) {
  const rodic = stav.role === 'rodic';
  const pol = jePololetniTest(l);
  const celkem = Number(l.pocet_uloh) || null;
  const hlavicka = (stitek) => el('div', { class: 'karta-lekce__hlavicka' }, el('span', { class: 'karta-lekce__poradi', text: h(pol ? 'osma.pol_stitek' : 'osma.test_stitek') }), stitek);
  const nazev = el('h3', { class: 'karta-lekce__tema', text: h(pol ? 'osma.pol_nazev' : 'osma.test_nazev', { min: l.cas_min || 25 }) });
  if (l.zamceno) {
    return el('article', { class: 'karta-lekce karta-lekce--zamceno karta-lekce--diagnostika', 'aria-disabled': 'true' },
      hlavicka(el('span', { class: 'stitek' }, ikona('zamek'), h('osma.zamceno'))), nazev,
      el('p', { class: 'karta-lekce__zamek' }, ikona('zamek'), textZamku(l)));
  }
  let stitek;
  let akce = null;
  let text = h(pol ? (rodic ? 'osma.pol_text_rodic' : 'osma.pol_text_zak') : (rodic ? 'osma.test_text_rodic' : 'osma.test_text_zak'));
  if (l.stavLekce === 'probiha') {
    stitek = el('span', { class: 'stitek stitek--navy', text: 'Probíhá' });
    akce = [el('button', {
      class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button',
      onClick: () => { location.href = stranaLekce(stav.role, l.id, stav.dite.id, l.sezeni?.rezim || 'app'); },
    }, 'Pokračovat', ikona('sipka-vpravo')),
    rodic && pokrok != null && celkem ? el('p', { class: 'text-tlumeny', text: h('diag.rodic_odevzdano', { x: pokrok, celkem, z: zeZ(celkem) }) }) : null];
  } else if (l.stavLekce === 'hotovo') {
    stitek = el('span', { class: 'stitek' }, ikona('fajfka'), h('diag.karta_hotovo'));
    text = h(rodic && vysledek ? 'osma.test_hotovo_rodic' : 'osma.test_hotovo_zak');
    akce = rodic && l.dokoncene
      ? el('a', {
        class: 'tlacitko tlacitko--sekundarni',
        href: `rodic.html?${new URLSearchParams({ lekce: l.id, dite: stav.dite.id, sezeni: l.dokoncene.id })}`,
      }, ikona('oko'), h(pol ? 'osma.pol_vysledek' : 'osma.test_vysledek'))
      : null;
  } else {
    stitek = el('span', { class: 'stitek', text: 'Nezačato' });
    akce = el('button', {
      class: 'tlacitko tlacitko--primarni tlacitko--velke', type: 'button',
      onClick: () => { location.href = stranaLekce(stav.role, l.id, stav.dite.id, 'app'); },
    }, h(rodic ? 'osma.test_zacit_rodic' : 'osma.test_zacit_zak'));
  }
  return el('article', { class: ['karta-lekce', `karta-lekce--${l.stavLekce}`, 'karta-lekce--diagnostika'] },
    hlavicka(stitek), nazev,
    el('p', { class: 'karta-lekce__popis text-tlumeny', text }),
    akce ? el('div', { class: 'karta-lekce__akce' }, akce) : null);
}

// ---------------------------------------------------------------------
// Modaly: režim, SOS
// ---------------------------------------------------------------------

function otevritRezim(l) {
  stav.vybranaLekce = l;
  const rodic = stav.role === 'rodic';
  $('modalRezimNadpis').textContent = rodic ? 'Jak dnes budete pracovat?' : 'Jak dnes budeš pracovat?';
  $('rezimAppPopis').textContent = rodic ? 'Dítě řeší na počítači nebo tabletu.' : 'Řešíš na počítači nebo tabletu.';
  $('rezimPapirPopis').textContent = rodic ? 'Vytisknete úlohy, výsledky zadáte vy.' : 'Píšeš na papír, výsledky zadá rodič.';
  // R64 „Dnes samo": běžná lekce obou předmětů; žák potvrdí, že rodič ví (lzeSamo rozhodne v lekci podle obsahu)
  $('rezimSamo').hidden = false;
  $('rezimSamoPopis').textContent = h(rodic ? 'samo.volba_popis_rodic' : 'samo.volba_popis_zak');
  $('rezimSamoPotvrzeni').hidden = rodic;
  $('rezimSamoSouhlas').checked = false;
  $('rezimSamo').disabled = !rodic;
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
    // H3 (R29): papír = nejdřív tisk VE STEJNÉ KARTĚ; „Zpět k lekci" v tisku vede na stránku lekce v režimu papír
    location.href = rezim === 'papir'
      ? `tisk.html?${new URLSearchParams({ lekce: l.id, dite: stav.dite.id, zpet: lekce })}`
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

function hlavickaPrehledu() {
  const prepinacDeti = stav.deti.length > 1
    ? el('div', { class: 'prepinac', role: 'group', 'aria-label': 'Dítě' }, stav.deti.map((d) => el('button', {
      class: 'prepinac__volba', type: 'button', 'aria-pressed': String(d.id === stav.dite.id),
      onClick: () => { if (d.id !== stav.dite.id) { nastavDite(d.id); vykresli(); } },
    }, d.krestni_jmeno)))
    : null;
  const pridat = stav.deti.length < 2
    ? el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: () => pridatDite() }, ikona('uzivatel'), h('dite.pridat_tlacitko'))
    : null;
  const predmety = stav.role === 'rodic'
    ? el('button', { class: 'tlacitko tlacitko--tiche', type: 'button', onClick: () => upravitPredmety() }, ikona('tuzka'), h('dite.predmety_tlacitko'))
    : null;
  return el('div', { class: 'prehled-hlavicka' },
    el('div', { class: 'radek radek--mezi' }, el('h1', { text: stav.dite.krestni_jmeno }), prepinacDeti,
      el('div', { class: 'radek' }, pridat, predmety)),
    prepinacPredmetu(),
    el('p', { class: 'text-tlumeny', text: h('osma.rytmus') }));
}

/** Záložky „Matematika | Čeština“ — u dítěte s oběma předměty (výchozí). Klik: URL ?predmet= (zpět v prohlížeči funguje). */
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

async function upravitPredmety() {
  const ulozene = await otevritPredmetyDitete(stav.dite);
  if (!ulozene) return;
  try { stav.deti = await mojeDeti(); } catch (e) { console.error(e); stav.deti = stav.deti.map((d) => (d.id === ulozene.id ? ulozene : d)); }
  await vykresli();
}

async function pridatDite() {
  const nove = await otevritPridaniDitete({ prvni: stav.deti.length === 0 });
  if (!nove) return;
  try { stav.deti = await mojeDeti(); } catch (e) { console.error(e); stav.deti = [...stav.deti, nove]; }
  nastavDite(nove.id);
  await vykresli();
}

/** Ukazatel postupu: hotové lekce předmětu (bez úvodního testu), přes celou šířku přehledu. */
function ukazatelPostupu(lekce, od) {
  const nazev = h(`predmet.${stav.predmet}`);
  const hotovo = lekce.filter((l) => od.hotove.has(l.id)).length;
  const procent = lekce.length ? Math.round((hotovo / lekce.length) * 100) : 0;
  const text = h('osma.postup', { hotovo, celkem: lekce.length, z: zeZ(lekce.length) });
  return el('div', { class: 'postup-pruh', role: 'img', 'aria-label': `${nazev}: ${text}` },
    el('div', { class: 'postup-pruh__popis' }, el('strong', { text: nazev }), el('span', { text })),
    el('div', { class: 'postup-podil' }, el('span', { style: `width:${procent}%` })));
}

/** Zamčené téma jedním řádkem: témata lekcí + kdy se otevře. */
function radekZamcenehoTematu(lekce) {
  return el('div', { class: 'tyden-zamceny', 'aria-disabled': 'true' },
    ikona('zamek'),
    el('div', { class: 'tyden-zamceny__text' },
      el('p', { class: 'tyden-zamceny__temata', text: lekce.map((l) => l.tema).join(' · ') }),
      el('p', { class: 'tyden-zamceny__stav', text: textZamku(lekce[0]) })));
}

function hlaska(druh, ikonaNazev, obsah) {
  return el('div', { class: `hlaska hlaska--${druh}`, role: 'status' }, ikona(ikonaNazev), el('div', { class: 'hlaska__text' }, obsah));
}

/** Sekce tématu: „Téma 3 · Zlomky I“ + štítek z testu + karty učebních a naostro lekcí v pořadí s odstupem (bez B-variant). */
function sekceTematu(t, lekceTematu, stavTematu, pokroky) {
  const nadpis = h('osma.tema_nadpis', { tema: t, nazev: nazevTematu(stav.predmet, t, stav.lekce) });
  const s = STAV_TEMATU[stavTematu];
  const celeZamcene = lekceTematu.length > 1 && lekceTematu.every((l) => l.zamceno);
  return el('section', { class: ['zasobnik', 'tema-sekce', celeZamcene && 'tyden--zamceny'], id: `${stav.predmet}-t${t}`, 'aria-label': nadpis },
    el('div', { class: 'radek radek--mezi tema-sekce__hlavicka' },
      el('h2', { class: 'nadpis-sekce', text: nadpis }),
      s ? el('span', { class: ['stitek', s.trida] }, ikona(s.ikona), h(s.klic)) : null),
    celeZamcene ? radekZamcenehoTematu(lekceTematu)
      : el('div', { class: 'mrizka-karet' }, lekceTematu.map((l) => kartaLekce(l, pokroky.get(l.id)))));
}

async function vykresli() {
  const obsah = $('obsah');
  stav.role = ziskejRoli();
  if (!stav.role) {
    vykresliVolbuRole(obsah, () => vykresli());
    return;
  }
  if (!stav.deti.length) {
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
  // předmět: URL → uložená volba → první aktivní předmět dítěte
  const zUrl = new URLSearchParams(location.search).get('predmet');
  stav.predmet = zvolPredmet({ url: zUrl, ulozeny: ulozenyPredmet(), aktivni: predmetyDitete(stav.dite) });
  if (zUrl === stav.predmet) ulozPredmet(stav.predmet);
  else if (predmetyDitete(stav.dite).length > 1) {
    const url = new URL(location.href);
    url.searchParams.set('predmet', stav.predmet);
    history.replaceState(null, '', url);
  }
  nastavPredmet(stav.predmet); // manuál rodiče podle předmětu (menu.js)

  nacitani(obsah, 'Načítám lekce…');
  try {
    const vsechny = await lekceProDite(stav.dite.id);
    const predmetu = vsechny.filter((l) => predmetLekce(l) === stav.predmet);
    const testy = predmetu.filter(jeDiagnostikaOsma);
    const diag = testy.find((l) => !jePololetniTest(l)) || null;
    const lekce = predmetu.filter((l) => !jeDiagnostikaOsma(l));
    const hlavni = lekce.filter((l) => !jeBVarianta(l)); // učební + naostro; B-varianty jen po červené
    stav.lekce = hlavni;
    const pokroky = new Map(await Promise.all(predmetu.filter((l) => l.stavLekce === 'probiha' && l.sezeni)
      .map((l) => stavSezeni(l.sezeni.id).then((s) => [l.id, jeDiagnostikaOsma(l) ? pocetOdevzdanych(s.odpovedi) : hotoveUlohy(s)])
        .catch(() => [l.id, null]))));

    const rodic = stav.role === 'rodic';
    stav.odznaky = spocitejOdznaky(vsechny); // R61–R63: odznaky patří dítěti, ne předmětu
    const casti = [hlavickaPrehledu(), ukazatelPostupu(hlavni, stav.odznaky), radekOdznaku(stav.odznaky.ziskane)];

    if (rodic && dveSamoZaSebou(vsechny)) casti.push(hlaska('info', 'uzivatel', h('samo.pripominka'))); // R64
    if (lekce.some((l) => l.dokoncene && jeDnes(l.dokoncene.konec))) {
      casti.push(hlaska('info', 'info', h('osma.max_lekce_den', { predmet: h(`predmet.${stav.predmet}`).toLowerCase() })));
    }
    if (rodic) {
      casti.push(el('div', { class: 'radek' },
        el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: otevritManual }, ikona('kniha'), 'Jak vést lekci')));
    }

    if (!lekce.length && !diag) {
      casti.push(el('div', { class: 'prazdny-stav' },
        el('span', { class: 'ikona-kruh' }, ikona('prazdno')),
        el('h2', { class: 'prazdny-stav__nadpis', text: 'Zatím žádná lekce' }),
        el('p', { class: 'prazdny-stav__text', text: h('predmet.prazdny') })));
    }

    // úvodní (po něm pololetní) test → doporučené pořadí témat (bez testu pořadí osnovy)
    const start = zacatekKalendare(predmetu);
    const odPol = otevreniPololetniho(start);
    const pol = testy.find(jePololetniTest);
    const polZobraz = pol && !pol.zamceno && pol.stavLekce === 'nezacato' && (!odPol || odPol > new Date())
      ? { ...pol, zamceno: 'kalendar', kalendarOd: odPol } : pol;
    const vysledekUvodni = await vysledekTestu(diag, predmetu);
    const vysledekPol = await vysledekTestu(pol, predmetu);
    const vysledek = vysledekPol || vysledekUvodni;
    const stavTemat = new Map((vysledek?.temata || []).map((x) => [x.tema, x.stav]));
    const poradi = doporucenePoradiTemat(cislaTemat(hlavni), vysledek?.temata || null, { predmet: stav.predmet });

    // plán roku + kalendář dítěte (3 týdně); lekce zamčená jen kalendářem dostane zamceno 'kalendar' + datum
    const plan = planRoku(hlavni, poradi);
    const kal = kalendar(plan, start);
    const zobraz = (l) => {
      const k = kal.get(l.id);
      return !l.zamceno && k && !k.otevreno ? { ...l, zamceno: 'kalendar', kalendarOd: k.od } : l;
    };
    const planZobraz = plan.map(zobraz);
    stav.podleId = new Map([...lekce.map((l) => [l.id, l]), ...planZobraz.map((l) => [l.id, l])]);

    // úvodní test je nahoře, dokud není hotový; hotový jde pod „Doporučeno teď“
    const sekceTestu = diag ? el('section', { class: 'zasobnik', 'aria-label': h('osma.test_stitek') }, kartaTestu(diag, pokroky.get(diag.id), vysledekUvodni)) : null;
    if (sekceTestu && diag.stavLekce !== 'hotovo') casti.push(sekceTestu);
    // pololetní test: jen když už dítě začalo (kalendář běží); po hotovém testu dolů k úvodnímu
    const sekcePol = pol && start ? el('section', { class: 'zasobnik', 'aria-label': h('osma.pol_stitek') }, kartaTestu(polZobraz, pokroky.get(pol.id), vysledekPol)) : null;
    if (sekcePol && !polZobraz.zamceno && pol.stavLekce !== 'hotovo') casti.push(sekcePol);
    if (hlavni.length) {
      const dalsi = dalsiLekceRoku(planZobraz, kal, stav.podleId);
      const podnadpis = vysledekPol ? 'osma.doporuceno_podle_pololetniho' : vysledek ? 'osma.doporuceno_podle_testu' : diag ? 'osma.doporuceno_bez_testu' : 'osma.doporuceno_osnova';
      casti.push(el('section', { class: 'zasobnik doporuceno', 'aria-labelledby': 'doporucenoNadpis' },
        el('h2', { class: 'nadpis-sekce', id: 'doporucenoNadpis', text: h('osma.doporuceno_nadpis') }),
        el('p', { class: 'text-tlumeny', text: h(podnadpis) }),
        dalsi ? kartaLekce(dalsi, pokroky.get(dalsi.id), { doporucena: true })
          : hlaska('uspech', 'fajfka', h(hlavni.every((l) => l.stavLekce === 'hotovo') ? 'osma.vse_hotovo' : 'osma.nic_otevreno'))));
    }
    if (sekcePol && (polZobraz.zamceno || pol.stavLekce === 'hotovo')) casti.push(sekcePol);
    if (sekceTestu && diag.stavLekce === 'hotovo') casti.push(sekceTestu);

    // témata v doporučeném pořadí, v každém učební a naostro lekce s odstupem
    for (const t of poradi) {
      const lekceTematu = poradiVTematu(planZobraz.filter((l) => Number(l.tyden) === t));
      if (lekceTematu.length) casti.push(sekceTematu(t, lekceTematu, stavTemat.get(t), pokroky));
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
