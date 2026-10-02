// =====================================================================
// admin.js — admin.html: přehled rodin, ruční uzavření / znovuotevření účtu, statistiky (agenti/08-admin.md; Spolu 8 bez platby)
//
// Používá jen hotové helpery: web/js/supabase.js (`admin.*`, `jeAdmin`), web/js/ui.js, web/js/obsah.js,
// web/js/hlasky.js. Nic mimo web/admin.html + web/js/admin.js se v tomto zadání nemění.
// Read-only kromě: admin.odemknout (= znovu otevřít uzavřený účet), admin.uzavrit, admin.ulozitPoznamku.
// =====================================================================

import {
  el, ikona, toast, formatCislo, formatDatum, nacitani, chybaStranky, chranStranku,
  otevritModal, zavritModal,
} from './ui.js';
import { admin } from './supabase.js';
import { nazevKapitoly } from './obsah.js';
import { h } from './hlasky.js';
import { popisChyby, jeDetektivniChyba } from './chyby.js';
import { mapaKapitolUloh, premapujStatistiky } from './simulace.js';

// Slovník typů chyb (popisChyby, jeDetektivniChyba) je od R34 ve sdíleném js/chyby.js (i pro rodiče).

// ---------------------------------------------------------------------
// Malé slovníky pro popisky
// ---------------------------------------------------------------------

const STAV_NAZEV = { aktivni: 'Aktivní', uzavreny: 'Uzavřeno' };
const STAV_TRIDA = { aktivni: 'stitek--zelena', uzavreny: '' };
const BARVA_SLOVO = { zelena: 'Zelená', oranzova: 'Oranžová', cervena: 'Červená' };
const REZIM_SLOVO = { app: 'V aplikaci', papir: 'Na papír', samo: 'Samo (bez rodiče)' }; // R64
const VOLBA_SLOVO = {
  sam: h('rodic.volba_sam'),
  s_otazkou: h('rodic.volba_s_otazkou'),
  chyba_pocty: h('rodic.volba_chyba_pocty'),
  nevedel: h('rodic.volba_nevedel'),
};

function stitekStavu(stav) {
  return el('span', { class: ['stitek', STAV_TRIDA[stav]], text: STAV_NAZEV[stav] || stav });
}

/** Sekundy → 'm:ss'. */
function formatDobaS(s) {
  if (s === null || s === undefined || !Number.isFinite(Number(s))) return '—';
  const n = Math.round(Number(s));
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')} min`;
}

/** Hodnota z odpovedi.hodnota (jsonb) na krátký čitelný text. */
function formatHodnota(h1) {
  if (h1 === null || h1 === undefined) return '—';
  if (Array.isArray(h1)) return h1.join(' → '); // F1 poradi: id operací v pořadí kliknutí
  if (typeof h1 === 'object') {
    if ('cela' in h1 && 'c' in h1 && 'j' in h1) return `${h1.cela} celá ${h1.c}/${h1.j}`;
    if ('c' in h1 && 'j' in h1) return `${h1.c}/${h1.j}`;
    return JSON.stringify(h1);
  }
  return String(h1);
}

/** Kolečko semaforu (barva + ikona), viz DESIGN.md .semafor-znak. */
function znakSemaforu(barva, { mala = true } = {}) {
  return el('span', { class: ['semafor-znak', mala && 'semafor-znak--mala', `semafor-znak--${barva}`] },
    ikona(barva === 'zelena' ? 'fajfka' : barva === 'oranzova' ? 'opakovat' : 'stop'));
}

function semaforTecky(semafory, { mala = true } = {}) {
  const razene = [...(semafory || [])].sort((a, b) => String(a.uloha_id).localeCompare(String(b.uloha_id)));
  if (!razene.length) return el('span', { class: 'text-tlumeny', text: '—' });
  const popis = razene.map((s) => BARVA_SLOVO[s.barva] || s.barva).join(', ');
  return el('div', { class: 'semafor-tecky', role: 'img', 'aria-label': `Úlohy: ${popis}` },
    razene.map((s) => znakSemaforu(s.barva, { mala })));
}

// ---------------------------------------------------------------------
// Malý SVG helper (namespace) — pro čisté inline SVG grafy bez knihoven
// ---------------------------------------------------------------------

const SVG_NS = 'http://www.w3.org/2000/svg';

function elSvg(tag, atributy = {}, ...deti) {
  const uzel = document.createElementNS(SVG_NS, tag);
  for (const [nazev, hodnota] of Object.entries(atributy || {})) {
    if (hodnota === undefined || hodnota === null || hodnota === false) continue;
    uzel.setAttribute(nazev, String(hodnota));
  }
  for (const d of deti.flat()) {
    if (d === null || d === undefined || d === false) continue;
    uzel.append(d);
  }
  return uzel;
}

// ---------------------------------------------------------------------
// Potvrzovací dialog (sdílený pro Odemknout / Uzavřít)
// ---------------------------------------------------------------------

const dialogPotvrdit = document.getElementById('modalPotvrdit');
const textPotvrdit = document.getElementById('modalPotvrditText');
document.getElementById('modalPotvrditOk').addEventListener('click', () => zavritModal(dialogPotvrdit, 'ok'));
document.getElementById('modalPotvrditZrusit').addEventListener('click', () => zavritModal(dialogPotvrdit, ''));

/**
 * @param {string} text
 * @returns {Promise<boolean>} true = potvrzeno
 */
async function potvrdit(text) {
  textPotvrdit.textContent = text;
  const hodnota = await otevritModal(dialogPotvrdit);
  return hodnota === 'ok';
}

// ---------------------------------------------------------------------
// Stav aplikace (jen v paměti stránky)
// ---------------------------------------------------------------------

const stav = {
  rodiny: [],           // aktuálně načtený (filtrovaný) seznam z admin.prehledRodin()
  filtrStav: '',
  hledat: '',
  razeni: 'aktivita',    // 'aktivita' | 'registrace'
  rozbaleneRodiny: new Set(),
  detailCache: new Map(), // rodina_id → výsledek admin.detailRodiny()
  souhrn: null,          // admin.statistiky() — načte se jednou, použije se v hlavičce i v Statistikách
  statistikyNacteny: false,
};

// ---------------------------------------------------------------------
// Kostra stránky (záložky Rodiny / Statistiky)
// ---------------------------------------------------------------------

const koren = document.getElementById('obsah');
let panelRodiny;
let panelStatistiky;
let hlavickaPocty;

function sestavKostru() {
  const zalozkaRodiny = el('button', { class: 'prepinac__volba', role: 'tab', id: 'zalozkaRodiny', 'aria-controls': 'panelRodiny', 'aria-selected': 'true', type: 'button' }, 'Rodiny');
  const zalozkaStatistiky = el('button', { class: 'prepinac__volba', role: 'tab', id: 'zalozkaStatistiky', 'aria-controls': 'panelStatistiky', 'aria-selected': 'false', type: 'button' }, 'Statistiky');

  panelRodiny = el('div', { id: 'panelRodiny', role: 'tabpanel', 'aria-labelledby': 'zalozkaRodiny' });
  panelStatistiky = el('div', { id: 'panelStatistiky', role: 'tabpanel', 'aria-labelledby': 'zalozkaStatistiky', hidden: true });
  hlavickaPocty = el('span', { class: 'text-tlumeny' });

  function vyberZalozku(otevriStatistiky) {
    zalozkaRodiny.setAttribute('aria-selected', otevriStatistiky ? 'false' : 'true');
    zalozkaStatistiky.setAttribute('aria-selected', otevriStatistiky ? 'true' : 'false');
    panelRodiny.hidden = otevriStatistiky;
    panelStatistiky.hidden = !otevriStatistiky;
    if (otevriStatistiky && !stav.statistikyNacteny) {
      stav.statistikyNacteny = true;
      nactiStatistiky().catch((e) => chybaStranky(panelStatistiky, e.message || String(e)));
    }
  }
  zalozkaRodiny.addEventListener('click', () => vyberZalozku(false));
  zalozkaStatistiky.addEventListener('click', () => vyberZalozku(true));

  koren.replaceChildren(
    el('div', { class: 'radek radek--mezi' },
      el('h1', null, 'Admin'),
      hlavickaPocty),
    el('div', { class: 'prepinac', role: 'tablist', 'aria-label': 'Sekce' }, zalozkaRodiny, zalozkaStatistiky),
    panelRodiny,
    panelStatistiky);
}

// ---------------------------------------------------------------------
// Záložka Rodiny
// ---------------------------------------------------------------------

function sestavPanelRodiny() {
  const poleHledat = el('input', { class: 'pole', id: 'aHledat', type: 'search', placeholder: 'Jméno, e-mail, dítě' });
  const poleStav = el('select', { class: 'pole', id: 'aStav' },
    el('option', { value: '' }, 'Všechny'),
    el('option', { value: 'aktivni' }, 'Aktivní'),
    el('option', { value: 'uzavreny' }, 'Uzavřené'));
  const poleRazeni = el('select', { class: 'pole', id: 'aRazeni' },
    el('option', { value: 'aktivita' }, 'Poslední aktivita'),
    el('option', { value: 'registrace' }, 'Datum registrace'));
  const tlacitkoExport = el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button' }, ikona('stahnout'), 'Export CSV');

  const filtry = el('form', { class: 'filtry', role: 'search', onSubmit: (e) => e.preventDefault() },
    el('div', { class: 'filtry__pole filtry__pole--hledat' },
      el('label', { for: 'aHledat' }, 'Hledat'),
      el('div', { class: 'pole-hledat' }, ikona('hledat'), poleHledat)),
    el('div', { class: 'filtry__pole' }, el('label', { for: 'aStav' }, 'Stav'), poleStav),
    el('div', { class: 'filtry__pole' }, el('label', { for: 'aRazeni' }, 'Řadit'), poleRazeni),
    el('div', { class: 'filtry__akce' }, tlacitkoExport));

  const obsahTabulky = el('div');
  panelRodiny.replaceChildren(filtry, obsahTabulky);

  let casovac = null;
  poleHledat.addEventListener('input', () => {
    clearTimeout(casovac);
    casovac = setTimeout(() => { stav.hledat = poleHledat.value; nactiRodiny(obsahTabulky); }, 300);
  });
  poleStav.addEventListener('change', () => { stav.filtrStav = poleStav.value; nactiRodiny(obsahTabulky); });
  poleRazeni.addEventListener('change', () => { stav.razeni = poleRazeni.value; vykresliTabulkuRodin(obsahTabulky); });
  tlacitkoExport.addEventListener('click', () => stahnoutCsv());

  return obsahTabulky;
}

async function nactiRodiny(obsahTabulky) {
  nacitani(obsahTabulky, 'Načítám rodiny…');
  try {
    stav.rodiny = await admin.prehledRodin({ stav: stav.filtrStav || undefined, hledat: stav.hledat || undefined });
    obsahTabulky.removeAttribute('aria-busy');
    vykresliTabulkuRodin(obsahTabulky);
  } catch (e) {
    chybaStranky(obsahTabulky, e.message || String(e));
  }
}

function serazenaData() {
  const pole = [...stav.rodiny];
  if (stav.razeni === 'registrace') {
    pole.sort((a, b) => String(b.registrace_at).localeCompare(String(a.registrace_at)));
  } else {
    pole.sort((a, b) => String(b.posledni_aktivita || '').localeCompare(String(a.posledni_aktivita || '')));
  }
  return pole;
}

const POCET_SLOUPCU = 9;

function vykresliTabulkuRodin(obsahTabulky) {
  const radky = serazenaData();
  if (!radky.length) {
    obsahTabulky.replaceChildren(el('div', { class: 'prazdny-stav' },
      el('span', { class: 'ikona-kruh' }, ikona('hledat')),
      el('h2', { class: 'prazdny-stav__nadpis' }, 'Nic nenalezeno'),
      el('p', { class: 'prazdny-stav__text' }, 'Žádná rodina neodpovídá filtru.')));
    return;
  }

  const tbody = el('tbody');
  for (const r of radky) tbody.append(...radekRodiny(r));

  obsahTabulky.replaceChildren(
    el('div', { class: 'tabulka-obal' },
      el('table', { class: 'tabulka' },
        el('thead', null, el('tr', null,
          el('th', { scope: 'col' }, el('span', { class: 'jen-ctecka' }, 'Detail')),
          el('th', { scope: 'col' }, 'Rodina'),
          el('th', { scope: 'col' }, 'Děti'),
          el('th', { scope: 'col' }, 'Stav'),
          el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Lekce'),
          el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Červené 7 dní'),
          el('th', { scope: 'col' }, 'Aktivita'),
          el('th', { scope: 'col' }, 'Poznámka'),
          el('th', { scope: 'col' }, el('span', { class: 'jen-ctecka' }, 'Akce')))),
        tbody)));
}

function radekRodiny(r) {
  const idDetail = `detail-${r.rodina_id}`;
  const otevreno = stav.rozbaleneRodiny.has(r.rodina_id);

  const tlacitkoDetail = el('button', {
    class: 'tlacitko tlacitko--male tlacitko--tiche tlacitko--ikona', type: 'button',
    'aria-expanded': String(otevreno), 'aria-controls': idDetail, 'aria-label': otevreno ? 'Skrýt detail' : 'Zobrazit detail',
  }, ikona('dolu'));

  const bunkaPoznamka = el('td', null, bunkaPoznamkyObsah(r));

  const akce = [];
  if (r.stav !== 'uzavreny') {
    akce.push(el('button', { class: 'tlacitko tlacitko--male tlacitko--tiche', type: 'button', onClick: () => editovatPoznamku(r, bunkaPoznamka) }, 'Poznámka'));
  }
  if (r.stav === 'uzavreny') {
    akce.push(el('button', { class: 'tlacitko tlacitko--male tlacitko--primarni', type: 'button', onClick: (e) => akceOdemknout(r, e.currentTarget) }, 'Znovu otevřít'));
  }
  if (r.stav !== 'uzavreny') {
    akce.push(el('button', { class: 'tlacitko tlacitko--male tlacitko--sekundarni', type: 'button', onClick: (e) => akceUzavrit(r, e.currentTarget) }, 'Uzavřít'));
  }

  const cervene = Number(r.cervene_7d) || 0;

  const hlavniRadek = el('tr', null,
    el('td', null, tlacitkoDetail),
    el('td', null,
      el('strong', { text: r.jmeno_rodice || '(bez jména)' }),
      el('span', { class: 'tabulka__sekundarni', text: r.email })),
    el('td', { text: r.deti_jmena || '—' }),
    el('td', null, stitekStavu(r.stav)),
    el('td', { class: 'tabulka__cislo', text: formatCislo(r.dokonceno_lekci ?? 0) }),
    el('td', { class: 'tabulka__cislo' }, cervene > 0
      ? el('span', { class: 'stitek stitek--cervena', text: formatCislo(cervene) })
      : el('span', { class: 'text-tlumeny', text: '0' })),
    el('td', { class: 'tabulka__nezalamovat' },
      r.posledni_aktivita
        ? el('strong', { text: formatDatum(r.posledni_aktivita, { cas: true }) })
        : el('span', { class: 'text-tlumeny', text: 'Nikdy' }),
      el('span', { class: 'tabulka__sekundarni', text: `registrace ${formatDatum(r.registrace_at, { rok: true })}` })),
    bunkaPoznamka,
    el('td', null, el('div', { class: 'tabulka__akce' }, akce)));

  const radekDetail = el('tr', { id: idDetail, hidden: !otevreno }, el('td', { colspan: POCET_SLOUPCU }));
  tlacitkoDetail.addEventListener('click', () => prepniDetail(r, tlacitkoDetail, radekDetail));
  if (otevreno) nactiDetailDo(r.rodina_id, radekDetail.firstElementChild);

  return [hlavniRadek, radekDetail];
}

function bunkaPoznamkyObsah(r) {
  return r.poznamka_admin
    ? el('span', { text: r.poznamka_admin })
    : el('span', { class: 'text-tlumeny', text: '—' });
}

function editovatPoznamku(r, bunkaPoznamka) {
  const textarea = el('textarea', { class: 'pole admin-poznamka', rows: 2 }, r.poznamka_admin || '');
  const ulozit = el('button', { class: 'tlacitko tlacitko--male tlacitko--primarni', type: 'button' }, 'Uložit');
  const zrusit = el('button', { class: 'tlacitko tlacitko--male tlacitko--tiche', type: 'button' }, 'Zrušit');
  bunkaPoznamka.replaceChildren(el('div', { class: 'zasobnik zasobnik--tesny' }, textarea, el('div', { class: 'radek' }, ulozit, zrusit)));
  textarea.focus();

  zrusit.addEventListener('click', () => bunkaPoznamka.replaceChildren(bunkaPoznamkyObsah(r)));
  ulozit.addEventListener('click', async () => {
    ulozit.disabled = true;
    ulozit.classList.add('je-nacitani');
    try {
      const aktualizovana = await admin.ulozitPoznamku(r.rodina_id, textarea.value);
      r.poznamka_admin = aktualizovana.poznamka_admin;
      bunkaPoznamka.replaceChildren(bunkaPoznamkyObsah(r));
      toast('Poznámka uložena.');
    } catch (e) {
      toast(e.message || String(e), { typ: 'varovani' });
    } finally {
      ulozit.disabled = false;
      ulozit.classList.remove('je-nacitani');
    }
  });
}

async function akceOdemknout(r, tlacitko) {
  const ano = await potvrdit(`Znovu otevřít účet rodiny ${r.jmeno_rodice || r.email}? Stav se změní na „aktivní" a rodina zase uvidí lekce.`);
  if (!ano) return;
  tlacitko.disabled = true;
  tlacitko.classList.add('je-nacitani');
  try {
    const aktualizovana = await admin.odemknout(r.rodina_id);
    Object.assign(r, aktualizovana);
    obnovRadek(r);
    toast('Účet je znovu otevřený.');
  } catch (e) {
    toast(e.message || String(e), { typ: 'varovani' });
  } finally {
    tlacitko.disabled = false;
    tlacitko.classList.remove('je-nacitani');
  }
}

async function akceUzavrit(r, tlacitko) {
  const ano = await potvrdit(`Uzavřít účet rodiny ${r.jmeno_rodice || r.email}? Rodina uvidí jen stránku s poděkováním a lekce jí zmizí.`);
  if (!ano) return;
  tlacitko.disabled = true;
  tlacitko.classList.add('je-nacitani');
  try {
    const aktualizovana = await admin.uzavrit(r.rodina_id);
    Object.assign(r, aktualizovana);
    obnovRadek(r);
    toast('Účet uzavřen.');
  } catch (e) {
    toast(e.message || String(e), { typ: 'varovani' });
  } finally {
    tlacitko.disabled = false;
    tlacitko.classList.remove('je-nacitani');
  }
}

/** Po akci obnov jen daný řádek (bez nového dotazu na celý seznam). */
function obnovRadek(r) {
  const tbody = panelRodiny.querySelector('tbody');
  if (!tbody) return;
  const [novyHlavni, novyDetail] = radekRodiny(r);
  const detailStary = tbody.querySelector(`#detail-${CSS.escape(r.rodina_id)}`);
  const hlavniStary = detailStary?.previousElementSibling;
  if (hlavniStary && detailStary) {
    hlavniStary.replaceWith(novyHlavni);
    detailStary.replaceWith(novyDetail);
  }
}

function prepniDetail(r, tlacitko, radekDetail) {
  const otevreno = !radekDetail.hidden;
  if (otevreno) {
    radekDetail.hidden = true;
    tlacitko.setAttribute('aria-expanded', 'false');
    tlacitko.setAttribute('aria-label', 'Zobrazit detail');
    stav.rozbaleneRodiny.delete(r.rodina_id);
  } else {
    radekDetail.hidden = false;
    tlacitko.setAttribute('aria-expanded', 'true');
    tlacitko.setAttribute('aria-label', 'Skrýt detail');
    stav.rozbaleneRodiny.add(r.rodina_id);
    nactiDetailDo(r.rodina_id, radekDetail.firstElementChild);
  }
}

async function nactiDetailDo(rodinaId, bunka) {
  if (stav.detailCache.has(rodinaId)) {
    bunka.replaceChildren(vykresliDetail(stav.detailCache.get(rodinaId)));
    return;
  }
  nacitani(bunka, 'Načítám detail…');
  try {
    const detail = await admin.detailRodiny(rodinaId);
    stav.detailCache.set(rodinaId, detail);
    bunka.replaceChildren(vykresliDetail(detail));
  } catch (e) {
    chybaStranky(bunka, e.message || String(e));
  }
}

function vykresliDetail(detail) {
  if (!detail.deti.length) return el('p', { class: 'text-tlumeny' }, 'Rodina zatím nemá založené žádné dítě.');
  return el('div', { class: 'zasobnik' }, detail.deti.map((dite) => {
    const sezeniDitete = detail.sezeni.filter((s) => s.dite_id === dite.id);
    return el('div', { class: 'karta karta--tesna zasobnik zasobnik--tesny' },
      el('div', { class: 'radek radek--mezi' },
        el('strong', { text: dite.krestni_jmeno }),
        el('span', { class: 'text-tlumeny', text: (dite.predmety || ['matematika', 'cestina']).map((p) => (p === 'cestina' ? 'čeština' : 'matematika')).join(' + ') })),
      sezeniDitete.length
        ? el('div', { class: 'zasobnik zasobnik--tesny' }, sezeniDitete.map(sezeniDetail))
        : el('p', { class: 'text-tlumeny' }, 'Zatím žádné sezení.'));
  }));
}

function sezeniDetail(s) {
  const doba = s.konec
    ? `${Math.max(0, Math.round((Date.parse(s.konec) - Date.parse(s.zacatek)) / 60000))} min`
    : 'probíhá';
  const nazev = s.lekce ? `${s.lekce_id} — ${s.lekce.tema}` : s.lekce_id;
  const diag = s.souhrn?.typ === 'diagnostika' ? s.souhrn : null; // souhrn diagnostiky nemá barvy
  const sim = s.souhrn?.typ === 'simulace' ? s.souhrn : null; // F2 simulace: orientační body (admin je vidět smí)

  return el('details', { class: 'rozbalovaci' },
    el('summary', null,
      el('span', { class: 'radek' },
        el('strong', { text: nazev }),
        el('span', { class: 'text-tlumeny', text: `${formatDatum(s.zacatek, { rok: true, cas: true })} · ${REZIM_SLOVO[s.rezim] || s.rezim} · ${doba}` }),
        diag ? el('span', { class: 'stitek stitek--navy', text: `Diagnostika · ${PASMO_ADMIN[diag.celkove] || diag.celkove}` })
          : sim ? el('span', { class: 'stitek stitek--navy', text: `Simulace ${sim.cislo ?? ''} · ${sim.body} z ${sim.max} b.${sim.rozdeleno ? ' · rozděleno' : ''}` })
            : semaforTecky(s.semafory)),
      ikona('dolu', { trida: 'rozbalovaci__sipka' })),
    el('div', { class: 'rozbalovaci__obsah zasobnik' }, diag ? souhrnDiagnostiky(diag) : null, sim ? souhrnSimulace(sim) : null, tabulkaOdpovedi(s.odpovedi)));
}

/** Simulace (souhrn.typ = 'simulace'): body po částech testu, nejčastější chyby, zelené pozice dítěte. */
function souhrnSimulace(d) {
  return el('div', { class: 'zasobnik zasobnik--tesny' },
    el('p', { text: `${d.body} z ${d.max} bodů (1. část ${d.casti?.[0]?.body ?? 0}, 2. část ${d.casti?.[1]?.body ?? 0}) · ${REZIM_SLOVO[d.rezim] || d.rezim}${d.rozdeleno ? ' · rozděleno na 2 dny' : ''}` }),
    el('p', { class: 'text-tlumeny', text: (d.skupiny || []).map((g) => `úlohy ${g.od}–${g.do}: ${g.body}/${g.max}`).join(' · ') }),
    (d.chyby || []).length ? el('p', { class: 'text-tlumeny', text: `Nejčastější chyby: ${d.chyby.map((c) => `${popisChyby(c.typ_chyby)} (${c.pocet}×)`).join('; ')}` }) : null,
    el('p', { class: 'text-tlumeny', text: `Dítě vidí zeleně: ${(d.sedi || []).join(', ') || '—'}` }));
}

const PASMO_ADMIN = { pevne: 'pevné', vetsinou: 'většinou', cast: 'část', zacatek: 'začátek', nezjisteno: 'nezjištěno' };
const STAV_KAPITOLY_ADMIN = { jista: 'jistá', nejista: 'nejistá', slaba: 'slabá', nezjisteno: 'nezjištěno' };

/** Diagnostika (souhrn.typ = 'diagnostika'): místo 4 barev souhrn kapitol s čísly (admin čísla vidět smí). */
function souhrnDiagnostiky(d) {
  return el('div', { class: 'zasobnik zasobnik--tesny' },
    el('p', { text: `Odevzdáno ${d.odevzdano} z ${d.celkem}, správně ${d.spravne} · pásmo: ${PASMO_ADMIN[d.celkove] || d.celkove}${d.chyby_nezarazene ? ` · chyb bez kódu: ${d.chyby_nezarazene}` : ''}` }),
    el('div', { class: 'tabulka-obal' }, el('table', { class: 'tabulka' },
      el('thead', null, el('tr', null,
        el('th', { scope: 'col' }, 'Kapitola'), el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Týden'),
        el('th', { scope: 'col' }, 'Stav'), el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Správně / úloh'),
        el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Odevzdáno'))),
      el('tbody', null, (d.kapitoly || []).map((k) => el('tr', null,
        el('td', { text: nazevKapitoly(k.kapitola) }), el('td', { class: 'tabulka__cislo', text: k.tyden }),
        el('td', { text: STAV_KAPITOLY_ADMIN[k.stav] || k.stav }), el('td', { class: 'tabulka__cislo', text: `${k.spravne} / ${k.uloh}` }),
        el('td', { class: 'tabulka__cislo', text: k.odevzdano })))))),
    (d.chyby || []).length ? el('p', { class: 'text-tlumeny', text: `Nejčastější chyby: ${d.chyby.map((c) => `${popisChyby(c.typ_chyby)} (${c.pocet}×)`).join('; ')}` }) : null);
}

function tabulkaOdpovedi(odpovedi) {
  if (!odpovedi.length) return el('p', { class: 'text-tlumeny' }, 'Žádné uložené odpovědi.');
  return el('div', { class: 'tabulka-obal' },
    el('table', { class: 'tabulka' },
      el('thead', null, el('tr', null,
        el('th', { scope: 'col' }, 'Úloha'),
        el('th', { scope: 'col' }, 'Krok'),
        el('th', { scope: 'col' }, 'Hodnota'),
        el('th', { scope: 'col' }, 'Správně'),
        el('th', { scope: 'col' }, 'Typ chyby'),
        el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Pokus'),
        el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Čas'),
        el('th', { scope: 'col' }, 'Zadal'))),
      el('tbody', null, odpovedi.map((o) => el('tr', null,
        el('td', { text: o.uloha_id }),
        el('td', { text: o.krok_id }),
        el('td', { text: formatHodnota(o.hodnota) }),
        el('td', { text: o.spravne === null ? '—' : o.spravne ? 'Ano' : 'Ne' }),
        el('td', { text: popisChyby(o.typ_chyby), class: jeDetektivniChyba(o.typ_chyby) ? 'text-tlumeny' : undefined }),
        el('td', { class: 'tabulka__cislo', text: o.pokus }),
        el('td', { class: 'tabulka__cislo', text: o.cas_s === null ? '—' : `${formatCislo(o.cas_s, { maxDesetin: 0 })} s` }),
        el('td', { text: o.zadal === 'dite' ? 'Dítě' : 'Rodič' }))))));
}

// ---------------------------------------------------------------------
// Export CSV (UTF-8 s BOM, středník — pro Excel CZ; data z admin.exportCsvData)
// ---------------------------------------------------------------------

async function stahnoutCsv() {
  try {
    const { csv } = await admin.exportCsvData({ stav: stav.filtrStav || undefined });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const odkaz = el('a', { href: URL.createObjectURL(blob), download: `rodiny-${new Date().toISOString().slice(0, 10)}.csv` });
    document.body.append(odkaz);
    odkaz.click();
    odkaz.remove();
    setTimeout(() => URL.revokeObjectURL(odkaz.href), 5000);
  } catch (e) {
    toast(e.message || String(e), { typ: 'varovani' });
  }
}

// ---------------------------------------------------------------------
// Záložka Statistiky
// ---------------------------------------------------------------------

async function nactiStatistiky() {
  nacitani(panelStatistiky, 'Načítám statistiky…');
  try {
    const [semaforyDb, casyDb, cerveneDb, souhrn, pseudo] = await Promise.all([
      admin.semaforyDleKapitoly(), admin.casNaUlohu(), admin.cervene({ dni: 30 }), admin.statistiky(),
      admin.ulohyPseudoKapitol().catch((e) => { console.warn('F2: kapitoly úloh bloků nejdou načíst', e); return { lekce: [], semafory: [] }; }),
    ]);
    // F2 (R38): bloky a simulace (kapitola lekce mix / simulace) se počítají podle kapitoly úlohy
    const { semafory, casy, cervene } = premapujStatistiky({ semafory: semaforyDb, casy: casyDb, cervene: cerveneDb },
      mapaKapitolUloh(pseudo.lekce), pseudo.semafory);
    stav.souhrn = souhrn;
    aktualizujHlavicku();
    panelStatistiky.removeAttribute('aria-busy');
    panelStatistiky.replaceChildren(
      sekceKonverze(souhrn),
      sekceGrafSemaforu(semafory),
      sekceCasNaUlohu(casy),
      sekceCervene(cervene),
      sekceDokonceneTydny(souhrn.dokoncenoPoTydnech));
  } catch (e) {
    chybaStranky(panelStatistiky, e.message || String(e));
  }
}

function nadpisSekce(text) {
  return el('h2', { class: 'nadpis-sekce admin-nadpis' }, text);
}

function sekceKonverze(s) {
  const dlazdice = (cislo, popisek) => el('div', { class: 'karta karta--tesna admin-dlazdice' },
    el('div', { class: 'admin-dlazdice__cislo', text: formatCislo(cislo) }),
    el('div', { class: 'text-tlumeny', text: popisek }));
  return el('section', null,
    nadpisSekce('Rodiny'),
    el('div', { class: 'radek radek--mezi' },
      dlazdice(s.rodinyDleStavu.aktivni, 'Aktivní'),
      dlazdice(s.rodinyDleStavu.uzavreny, 'Uzavřeno'),
      dlazdice(s.celkem, 'Celkem rodin')));
}

function sekceGrafSemaforu(radky) {
  const celkove = radky.filter((r) => r.je_celkem);
  const kapitoly = [...new Set(celkove.map((r) => r.kapitola))].sort();
  if (!kapitoly.length) {
    return el('section', null, nadpisSekce('Semafory podle kapitoly'), el('p', { class: 'text-tlumeny' }, 'Zatím žádná data.'));
  }
  const data = kapitoly.map((kapitola) => {
    const zelena = celkove.find((r) => r.kapitola === kapitola && r.barva === 'zelena')?.pocet || 0;
    const oranzova = celkove.find((r) => r.kapitola === kapitola && r.barva === 'oranzova')?.pocet || 0;
    const cervena = celkove.find((r) => r.kapitola === kapitola && r.barva === 'cervena')?.pocet || 0;
    return { kapitola, zelena, oranzova, cervena, celkem: zelena + oranzova + cervena };
  });

  const legenda = el('div', { class: 'radek admin-legenda' },
    ['zelena', 'oranzova', 'cervena'].map((b) => el('span', { class: 'radek admin-legenda__polozka' },
      znakSemaforu(b), BARVA_SLOVO[b])));

  return el('section', null, nadpisSekce('Semafory podle kapitoly'), legenda, grafSemaforu(data));
}

function grafSemaforu(data) {
  const sirkaSloupce = 56;
  const mezera = 28;
  const vyskaGrafu = 180;
  const horniOkraj = 12;
  const popiskyVyska = 46;
  const offset = 8;
  const maxCelkem = Math.max(1, ...data.map((d) => d.celkem));
  const sirka = offset * 2 + data.length * (sirkaSloupce + mezera);
  const vyska = horniOkraj + vyskaGrafu + popiskyVyska;
  const yPodstava = horniOkraj + vyskaGrafu;

  const popisSouhrn = data.map((d) => `${nazevKapitoly(d.kapitola)}: zelená ${d.zelena}, oranžová ${d.oranzova}, červená ${d.cervena}`).join('; ');

  const prvky = data.flatMap((d, i) => {
    const x = offset + i * (sirkaSloupce + mezera) + mezera / 2;
    const hZ = (d.zelena / maxCelkem) * vyskaGrafu;
    const hO = (d.oranzova / maxCelkem) * vyskaGrafu;
    const hC = (d.cervena / maxCelkem) * vyskaGrafu;
    // odspoda nahoru: zelená, oranžová, červená
    const segmenty = [];
    let yAktualni = yPodstava;
    for (const [barva, vyskaUseku, pocet] of [['zelena', hZ, d.zelena], ['oranzova', hO, d.oranzova], ['cervena', hC, d.cervena]]) {
      if (vyskaUseku > 0) {
        yAktualni -= vyskaUseku;
        segmenty.push(elSvg('rect', { x, y: yAktualni, width: sirkaSloupce, height: vyskaUseku, class: `admin-graf__usek admin-graf__usek--${barva}`, rx: 3 }));
        segmenty.push(elSvg('text', { x: x + sirkaSloupce + 6, y: yAktualni + vyskaUseku / 2 + 4, 'font-size': 11, class: 'admin-graf__popisek' }, String(pocet)));
      }
    }
    // rámeček sloupce (i pro 0, ať je vidět, kde je)
    segmenty.push(elSvg('rect', { x, y: yPodstava - Math.max(hZ + hO + hC, 1), width: sirkaSloupce, height: Math.max(hZ + hO + hC, 1), fill: 'none', stroke: 'var(--barva-okraj)', 'stroke-width': 1, rx: 3 }));
    segmenty.push(elSvg('text', { x: x + sirkaSloupce / 2, y: yPodstava + 18, 'text-anchor': 'middle', 'font-size': 12, class: 'admin-graf__kapitola' }, nazevKapitoly(d.kapitola)));
    segmenty.push(elSvg('text', { x: x + sirkaSloupce / 2, y: yPodstava + 34, 'text-anchor': 'middle', 'font-size': 11, class: 'admin-graf__popisek' }, `celkem ${d.celkem}`));
    return segmenty;
  });

  return elSvg('svg', { viewBox: `0 0 ${sirka} ${vyska}`, role: 'img', 'aria-label': `Semafory podle kapitoly: ${popisSouhrn}`, class: 'admin-graf', style: `max-width:${sirka}px` }, // max-width dynamická (počet kapitol)
    elSvg('line', { x1: 0, y1: yPodstava, x2: sirka, y2: yPodstava, class: 'admin-graf__osa' }),
    prvky);
}

function sekceCasNaUlohu(radky) {
  const kapitoly = [...new Set(radky.map((r) => r.kapitola))].sort();
  const tbody = [];
  for (const kapitola of kapitoly) {
    const souhrn = radky.find((r) => r.kapitola === kapitola && r.je_kapitola);
    if (souhrn) {
      tbody.push(el('tr', { class: 'admin-radek-souhrn' },
        el('td', { text: nazevKapitoly(kapitola) }), el('td', { text: '— (celá kapitola)' }),
        el('td', { class: 'tabulka__cislo', text: formatDobaS(souhrn.prumer_cas_s) }),
        el('td', { class: 'tabulka__cislo', text: formatCislo(souhrn.pocet_mereni) })));
    }
    for (const r of radky.filter((x) => x.kapitola === kapitola && !x.je_kapitola).sort((a, b) => String(a.uloha_id).localeCompare(String(b.uloha_id)))) {
      tbody.push(el('tr', null,
        el('td', { class: 'text-tlumeny' }, ''),
        el('td', { text: `${r.lekce_id} · ${r.uloha_id}` }),
        el('td', { class: 'tabulka__cislo', text: formatDobaS(r.prumer_cas_s) }),
        el('td', { class: 'tabulka__cislo', text: formatCislo(r.pocet_mereni) })));
    }
  }
  return el('section', null,
    nadpisSekce('Průměrný čas na úlohu'),
    radky.length
      ? el('div', { class: 'tabulka-obal' }, el('table', { class: 'tabulka' },
          el('thead', null, el('tr', null, el('th', { scope: 'col' }, 'Kapitola'), el('th', { scope: 'col' }, 'Úloha'),
            el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Průměrný čas'), el('th', { scope: 'col', class: 'tabulka__cislo' }, 'Počet měření'))),
          el('tbody', null, tbody)))
      : el('p', { class: 'text-tlumeny' }, 'Zatím žádná data.'));
}

function sekceCervene(radky) {
  return el('section', null,
    nadpisSekce('Červené za posledních 30 dní'),
    radky.length
      ? el('div', { class: 'tabulka-obal' }, el('table', { class: 'tabulka' },
          el('thead', null, el('tr', null,
            el('th', { scope: 'col' }, 'Datum'), el('th', { scope: 'col' }, 'Dítě'), el('th', { scope: 'col' }, 'Rodina'),
            el('th', { scope: 'col' }, 'Lekce'), el('th', { scope: 'col' }, 'Úloha'), el('th', { scope: 'col' }, 'Volba rodiče'))),
          el('tbody', null, radky.map((r) => el('tr', null,
            el('td', { class: 'tabulka__nezalamovat', text: formatDatum(r.datum, { rok: true, cas: true }) }),
            el('td', { text: r.krestni_jmeno }),
            el('td', null, el('a', { href: `mailto:${r.email}` }, r.jmeno_rodice)),
            el('td', { text: `${nazevKapitoly(r.kapitola)} · ${r.lekce_id}` }),
            el('td', { text: r.uloha_id }),
            el('td', { text: VOLBA_SLOVO[r.volba_rodice] || r.volba_rodice }))))))
      : el('p', { class: 'text-tlumeny' }, 'Žádné červené za posledních 30 dní.'));
}

function sekceDokonceneTydny(tydny) {
  const max = Math.max(1, ...tydny.map((t) => t.pocet));
  return el('section', null,
    nadpisSekce('Dokončené lekce po týdnech'),
    tydny.length
      ? el('div', { class: 'zasobnik zasobnik--tesny' }, tydny.map((t) => el('div', { class: 'radek admin-tyden' },
          el('span', { class: 'tabulka__nezalamovat admin-tyden__datum', text: formatDatum(t.tyden, { rok: true }) }),
          el('div', { class: 'pruh admin-tyden__pruh', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': t.pocet, 'aria-label': `Týden ${t.tyden}: ${t.pocet} dokončených lekcí` },
            el('span', { class: 'pruh__vypln', style: `width:${Math.round((t.pocet / max) * 100)}%` })),
          el('span', { class: 'admin-tyden__pocet', text: formatCislo(t.pocet) }))))
      : el('p', { class: 'text-tlumeny' }, 'Zatím žádná dokončená lekce.'));
}

function aktualizujHlavicku() {
  if (!stav.souhrn) return;
  const s = stav.souhrn.rodinyDleStavu;
  hlavickaPocty.textContent = `${formatCislo(stav.souhrn.celkem)} rodin · ${formatCislo(s.aktivni)} aktivní · ${formatCislo(s.uzavreny)} uzavřené`;
}

// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------

async function start() {
  const s = await chranStranku({ vyzadujeAdmina: true });
  if (!s) return; // probíhá přesměrování (ne-admin → prehled.html)
  document.getElementById('adminEmail').textContent = s.uzivatel.email || '';
  sestavKostru();
  const obsahTabulky = sestavPanelRodiny();
  // souhrn (pro hlavičku) načteme na pozadí hned, ať čísla naskočí i bez otevření Statistik
  admin.statistiky().then((souhrn) => { stav.souhrn = souhrn; aktualizujHlavicku(); }).catch(() => {});
  await nactiRodiny(obsahTabulky);
}

start().catch((e) => {
  console.error(e);
  chybaStranky(koren, e.message || String(e));
});
