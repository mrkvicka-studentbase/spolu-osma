// =====================================================================
// rodic-diagnostika.js — vstupní diagnostika (týden 0) na stránce rodiče (obsah/diagnostika-obrazovka.md §3–5, R37).
// Během diagnostiky: „Dítě pracuje, x z 24 odevzdáno" (polling 30 s), uplynulý čas, rady, „Zobrazit výsledek".
// Papír: seznam 24 polí (přepsat, co dítě napsalo; po uložení jen „Uloženo", žádné ✔/✘).
// Výsledek: celková věta, plán Fáze 1 po týdnech, 0–3 nejčastější chyby, kapitoly (sbalené), jak s výsledkem naložit.
// Bez taháku, semaforu, procent a známek. Výpočet: diagnostika.js (čisté funkce), uložení do sezeni.souhrn.
//
// Vykreslovací funkce (vytvorPrubeh, vytvorPapirDiagnostiky, vytvorVysledek) jsou čisté DOM bez sítě —
// testuje je nastroje/screenshoty.mjs (--diag); síť a řízení je ve spustDiagnostikuRodic().
// =====================================================================

import { el, ikona, toast, param, formatDatum, otevritModal, zavritModal, chybaStranky } from './ui.js';
import { h } from './hlasky.js';
import { nazevKapitoly, finalKrok } from './obsah.js';
import { vyhodnotKrok } from './vyhodnoceni.js';
import {
  sestavSouhrnDiagnostiky, pocetOdevzdanych, popisChybyRodic, VERZE_ALGORITMU, NAZVY_TYDNU, MAPA_KAPITOL,
} from './diagnostika.js';
import { najdiSezeniDiagnostiky, prestavkaPo } from './diagnostika-zak.js';
import { sestavSouhrnOsma, jeSouhrnOsma, mapaKapitolNaTemata, cislaTemat } from './doporuceni.js';
import { nazevTematu, zeZ } from './temata.js';
import { popisChyby } from './chyby.js';
import { predmetLekce } from './predmet.js';
import { vytvorVstupFinal } from './rodic-karta.js';

const INTERVAL_POLLINGU = 30000;
const CAS_UPOZORNENI_MIN = 35; // Spolu 8: test ~25 min

/** Štítek důrazu týdne: ikona + text, nikdy jen barva; slabý týden oranžově, ne červeně. */
const DURAZ = {
  dukladne: { ikona: 'hledat', trida: 'stitek--oranzova' },
  normalne: { ikona: 'hodiny', trida: 'stitek--navy' },
  rychleji: { ikona: 'sipka-vpravo', trida: 'stitek--zelena' },
  nezjisteno: { ikona: 'info', trida: '' },
  opakovani: { ikona: 'opakovat', trida: 'stitek--navy' },
};
/** Štítek stavu kapitoly. */
const STAV = {
  jista: { ikona: 'fajfka', trida: 'stitek--zelena' },
  nejista: { ikona: 'opakovat', trida: 'stitek--navy' },
  slaba: { ikona: 'hledat', trida: 'stitek--oranzova' },
  nezjisteno: { ikona: 'info', trida: '' },
};

/** „A", „A a B", „A, B a C". */
function seznamSlovy(polozky) {
  const p = polozky.filter(Boolean);
  if (p.length <= 1) return p.join('');
  return `${p.slice(0, -1).join(', ')} a ${p.at(-1)}`;
}

const stitek = (mapa, klic, text) => el('span', { class: ['stitek', 'diag-stitek', mapa[klic]?.trida] }, ikona(mapa[klic]?.ikona || 'info'), text);

// ---------------------------------------------------------------------
// Výsledek (čistý DOM)
// ---------------------------------------------------------------------

/**
 * Obrazovka výsledku diagnostiky (obrazovka §4).
 * @param {object} souhrn  z sestavSouhrnDiagnostiky (sezeni.souhrn)
 * @param {{jmeno?: string, datum?: string|Date|null, temata?: Map<string, string>, faze1Otevrena?: boolean}} [volby]
 *   temata = id lekce → téma (katalog); chybějící lekce se napíše číslem („lekce 2 a 4")
 * @returns {HTMLElement}
 */
export function vytvorVysledek(souhrn, { jmeno = '', datum = null, temata = new Map(), faze1Otevrena = true } = {}) {
  const nazevLekce = (id) => temata.get(id) || null;
  const lekceSlovy = (ids) => {
    const znama = ids.map(nazevLekce);
    if (znama.every(Boolean)) return seznamSlovy(znama);
    return `lekce ${seznamSlovy(ids.map((id) => /-L(\d+)$/.exec(id)?.[1] || id))}`;
  };

  const tydny = el('ol', { class: 'diag-plan' }, (souhrn.tydny || []).map((t) => el('li', null,
    el('a', { class: 'diag-plan__tyden', href: `prehled.html?predmet=matematika#faze1-t${t.tyden}` }, // záložka Matematika (dítě může mít i češtinu)
      el('span', { class: 'diag-plan__nazev', text: h('diag.tyden_nazev', { tyden: t.tyden, nazev: NAZVY_TYDNU[t.tyden] || '' }) }),
      stitek(DURAZ, t.duraz, h(`diag.duraz_${t.duraz}`)),
      el('span', { class: 'diag-plan__text', text: h(`diag.tyden_${t.duraz}`) }),
      t.lekce_duraz?.length ? el('span', { class: 'diag-plan__doplnek', text: h('diag.tyden_lekce_duraz', { lekce: lekceSlovy(t.lekce_duraz) }) }) : null,
      t.pilot?.length ? el('span', { class: 'diag-plan__doplnek', text: h('diag.tyden_pilot', { pilot: seznamSlovy(t.pilot.map((p) => temata.get(p) ? `${p} (${temata.get(p)})` : p)) }) }) : null))));

  const chyby = souhrn.chyby || [];
  const chybyObsah = chyby.length
    ? el('ul', { class: 'diag-chyby' }, chyby.map((c) => el('li', { class: 'diag-chyby__polozka' },
      el('p', { class: 'diag-chyby__text', text: popisChybyRodic(c.typ_chyby) }),
      el('p', { class: 'diag-chyby__pozn', text: [h('diag.chyby_trenuje', { tydny: seznamSlovy((c.tydny || []).map(String)) }), c.pocet >= 2 ? h('diag.chyby_vickrat') : ''].filter(Boolean).join(' ') }))))
    : el('p', { class: 'text-tlumeny', text: souhrn.chyby_nezarazene > 0 ? h('diag.chyby_prazdne_prehlednuti') : h('diag.chyby_prazdne') });

  const poradiKapitol = new Map(MAPA_KAPITOL.map((m, i) => [m.kapitola, i]));
  const kapitoly = [...(souhrn.kapitoly || [])].sort((a, b) => (poradiKapitol.get(a.kapitola) ?? 99) - (poradiKapitol.get(b.kapitola) ?? 99));
  const kapitolyDet = el('details', { class: 'rozbalovaci diag-kapitoly' },
    el('summary', null, ikona('kniha'), h('diag.kapitoly_nadpis'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
    el('div', { class: 'rozbalovaci__obsah' }, el('ul', { class: 'diag-kapitoly__seznam' }, kapitoly.map((k) => el('li', { class: 'diag-kapitola' },
      el('span', { class: 'diag-kapitola__nazev' }, nazevKapitoly(k.kapitola), el('small', { text: ` · ${h('diag.kapitola_tyden', { tyden: k.tyden })}` })),
      stitek(STAV, k.stav, h(`diag.stav_${k.stav}`)),
      el('span', { class: 'diag-kapitola__text', text: [h(`diag.kapitola_${k.stav}`), k.uloh === 1 && k.stav !== 'nezjisteno' ? h('diag.kapitola_jedna_uloha') : ''].filter(Boolean).join(' ') }))))));

  const datumText = datum ? formatDatum(datum, { rok: true }) : '';
  return el('div', { class: 'zasobnik zasobnik--volny diag-vysledek' },
    el('header', { class: 'diag-vysledek__hlavicka' },
      el('h1', { text: h('diag.vysledek_nadpis') }),
      el('p', { class: 'text-tlumeny', text: [jmeno, datumText].filter(Boolean).join(', ') })),
    el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('info'),
      el('div', { class: 'hlaska__text' },
        el('strong', { text: h(`diag.celkem_${souhrn.celkove}`) }),
        souhrn.neuplne && souhrn.celkove !== 'nezjisteno' ? el('p', { text: h('diag.celkem_neuplne', { odevzdano: souhrn.odevzdano, celkem: souhrn.celkem }) }) : null)),
    el('section', { class: 'zasobnik', 'aria-labelledby': 'diagPlan' }, el('h2', { class: 'diag-nadpis', id: 'diagPlan', text: h('diag.plan_nadpis') }), tydny),
    el('section', { class: 'zasobnik', 'aria-labelledby': 'diagChyby' }, el('h2', { class: 'diag-nadpis', id: 'diagChyby', text: h('diag.chyby_nadpis') }), chybyObsah),
    kapitolyDet,
    el('section', { class: 'zasobnik', 'aria-labelledby': 'diagJak' },
      el('h2', { class: 'diag-nadpis', id: 'diagJak', text: h('diag.jak_nalozit_nadpis') }),
      el('ul', { class: 'diag-jak' }, [1, 2, 3].map((i) => el('li', { text: h(`diag.jak_nalozit_${i}`) })))),
    el('div', { class: 'zasobnik' },
      el('a', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', href: 'prehled.html' }, h('diag.na_prehled')),
      faze1Otevrena ? el('a', { class: 'tlacitko tlacitko--tiche', href: 'rodic.html?lekce=F1-T01-L1' }, h('diag.zacit_tyden_1'), ikona('sipka-vpravo')) : null));
}

// ---------------------------------------------------------------------
// Spolu 8: výsledek úvodního testu (čistý DOM) — krátce: co jde, co nejde, kde začít
// ---------------------------------------------------------------------

/**
 * Report rodiči po úvodním testu Spolu 8 (souhrn z doporuceni.js sestavSouhrnOsma).
 * @param {object} souhrn
 * @param {{jmeno?: string, datum?: string|Date|null, lekce?: Array<object>}} [volby]  lekce = katalog předmětu (názvy témat)
 * @returns {HTMLElement}
 */
export function vytvorVysledekOsma(souhrn, { jmeno = '', datum = null, lekce = [] } = {}) {
  const predmet = souhrn.predmet || 'matematika';
  const nazev = (t) => {
    const n = nazevTematu(predmet, t, lekce);
    return n ? h('osma.tema_nadpis', { tema: t, nazev: n }) : `Téma ${t}`;
  };
  const temata = souhrn.temata || [];
  const skupina = (stavy) => temata.filter((t) => stavy.includes(t.stav)).map((t) => t.tema);
  const seznam = (cisla, ikonaNazev) => (cisla.length
    ? el('ul', { class: 'diag-jak' }, cisla.map((t) => el('li', null, ikona(ikonaNazev), ` ${nazev(t)}`)))
    : el('p', { class: 'text-tlumeny', text: h('osma.vysledek_nic') }));
  const jde = skupina(['silne']);
  const nejde = skupina(['slabe']);
  const napul = skupina(['nejiste']);
  const prvni = (souhrn.poradi || []).find((t) => !jde.includes(t));
  const popis = (kod) => (predmet === 'cestina' ? popisChyby(kod) : popisChybyRodic(kod));
  const sekce = (id, nadpis, obsah) => el('section', { class: 'zasobnik', 'aria-labelledby': id },
    el('h2', { class: 'diag-nadpis', id, text: nadpis }), obsah);
  const datumText = datum ? formatDatum(datum, { rok: true }) : '';
  return el('div', { class: 'zasobnik zasobnik--volny diag-vysledek diag-vysledek--osma' },
    el('header', { class: 'diag-vysledek__hlavicka' },
      el('h1', { text: h(/-(POL|pol)$/.test(String(souhrn.lekce_id || '')) ? 'osma.pol_vysledek' : 'osma.vysledek_nadpis') }),
      el('p', { class: 'text-tlumeny', text: [h(`predmet.${predmet}`), jmeno, datumText].filter(Boolean).join(' · ') }),
      el('p', { text: h('osma.vysledek_celkem', { odevzdano: souhrn.odevzdano, celkem: souhrn.celkem, z: zeZ(souhrn.celkem) }) })),
    souhrn.celkove === 'nezjisteno' ? el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('info'),
      el('div', { class: 'hlaska__text', text: h('osma.vysledek_nezjisteno') })) : null,
    sekce('osmaZacit', h('osma.vysledek_zacit'), el('div', { class: 'hlaska hlaska--uspech', role: 'status' }, ikona('sipka-vpravo'),
      el('div', { class: 'hlaska__text', text: prvni ? h('osma.vysledek_zacit_text', { tema: nazev(prvni) }) : h('osma.vysledek_zacit_vse') }))),
    sekce('osmaNejde', h('osma.vysledek_nejde'), seznam(nejde, 'hledat')),
    napul.length ? sekce('osmaNapul', h('osma.vysledek_nejiste'), seznam(napul, 'opakovat')) : null,
    sekce('osmaJde', h('osma.vysledek_jde'), seznam(jde, 'fajfka')),
    (souhrn.chyby || []).length ? sekce('osmaChyby', h('osma.vysledek_chyby'),
      el('ul', { class: 'diag-chyby' }, souhrn.chyby.map((c) => el('li', { class: 'diag-chyby__polozka' },
        el('p', { class: 'diag-chyby__text', text: popis(c.typ_chyby) }),
        c.pocet >= 2 ? el('p', { class: 'diag-chyby__pozn', text: h('diag.chyby_vickrat') }) : null)))) : null,
    el('section', { class: 'zasobnik', 'aria-labelledby': 'diagJak' },
      el('h2', { class: 'diag-nadpis', id: 'diagJak', text: h('diag.jak_nalozit_nadpis') }),
      el('ul', { class: 'diag-jak' }, [1, 2].map((i) => el('li', { text: h(`diag.jak_nalozit_${i}`) })))),
    el('div', { class: 'zasobnik' },
      el('a', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', href: `prehled.html?predmet=${predmet}` }, h('osma.vysledek_tlacitko'))));
}

// ---------------------------------------------------------------------
// Průběh (čistý DOM)
// ---------------------------------------------------------------------

/**
 * Obrazovka rodiče během diagnostiky (obrazovka §3). V papíru místo stavu žáka pokyn a „Přepsat výsledky".
 * @param {{lekce: object, odevzdano: number, zacatek?: string|null, rezim?: 'app'|'papir', naposledy?: Date|null}} data
 * @param {{obnovit?: () => void, zobrazit?: () => void, prepsat?: () => void}} [akce]
 */
export function vytvorPrubeh({ lekce, odevzdano, zacatek = null, rezim = 'app', naposledy = null }, { obnovit, zobrazit, prepsat } = {}) {
  const celkem = lekce.ulohy.length;
  const min = zacatek ? Math.max(0, Math.floor((Date.now() - Date.parse(zacatek)) / 60000)) : null;
  const stavZaka = rezim === 'app'
    ? el('div', { class: 'stav-zaka diag-stav', role: 'status' },
      ikona('tuzka', { trida: 'ikona--velka' }),
      el('div', { class: 'stav-zaka__text' },
        el('strong', { class: 'diag-stav__pocet', text: h('diag.rodic_odevzdano', { x: odevzdano, celkem, z: zeZ(celkem) }) }),
        el('small', { text: [odevzdano < prestavkaPo(celkem) ? h('diag.rodic_polovina_1') : h('diag.rodic_polovina_2'),
          naposledy ? h('rodic.stav_naposledy', { cas: naposledy.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }) }) : ''].filter(Boolean).join(' · ') })),
      obnovit ? el('button', { class: 'tlacitko tlacitko--tiche tlacitko--ikona', type: 'button', 'aria-label': h('rodic.stav_obnovit'), onClick: obnovit }, ikona('obnovit')) : null)
    : el('div', { class: 'zasobnik' },
      el('p', { text: h('diag.papir_uvod') }),
      prepsat ? el('button', { class: 'tlacitko tlacitko--sekundarni tlacitko--cela-sirka', type: 'button', onClick: prepsat }, ikona('tuzka'), h('diag.papir_prepsat')) : null);
  return el('div', { class: 'zasobnik zasobnik--volny diag-prubeh' },
    el('header', null, el('h1', { text: lekce.tema }), el('p', { class: 'text-tlumeny', text: h('diag.rodic_uvod') })),
    stavZaka,
    min !== null ? el('p', { class: 'diag-cas' }, ikona('hodiny'), h('diag.rodic_uplynulo', { min })) : null,
    min !== null && min >= CAS_UPOZORNENI_MIN ? el('div', { class: 'hlaska hlaska--info', role: 'status' }, ikona('info'), el('div', { class: 'hlaska__text', text: h('diag.rodic_cas') })) : null,
    el('details', { class: 'rozbalovaci' },
      el('summary', null, ikona('bublina'), h('diag.rodic_rady_nadpis'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
      el('div', { class: 'rozbalovaci__obsah' }, el('ul', { class: 'diag-jak' }, [1, 2, 3].map((i) => el('li', { text: h(`diag.rodic_rada_${i}`) }))))),
    zobrazit ? el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button', onClick: zobrazit }, h('diag.rodic_zobrazit')) : null);
}

// ---------------------------------------------------------------------
// Papír: 24 polí (čistý DOM + callback uložení)
// ---------------------------------------------------------------------

/**
 * Seznam 24 polí po blocích (obrazovka §5). Uložení: jen vyplněná pole, zadal 'rodic'; po uložení „Uloženo" u pole.
 * @param {object} lekce
 * @param {{odpovedi?: Array<object>, ulozit: (polozky: Array<{uloha: object, krok: object, hodnota: any, v: object}>) => Promise<void>}} volby
 */
export function vytvorPapirDiagnostiky(lekce, { odpovedi = [], ulozit }) {
  const pole = lekce.ulohy.map((u, i) => {
    const krok = finalKrok(u);
    const predchozi = odpovedi.filter((o) => o.uloha_id === u.id && o.krok_id === krok.id && o.zadal === 'rodic').at(-1) || null;
    const vstup = vytvorVstupFinal(krok, predchozi);
    const stavUzel = el('span', { class: 'diag-papir__stav', role: 'status' }, predchozi ? h('diag.ulozeno') : '');
    const chyba = el('p', { class: 'pole-chyba', hidden: true }, ikona('pozor'), el('span', { text: h('rodic.papir_neplatne') }));
    return { u, krok, vstup, stavUzel, chyba, li: el('li', { class: 'diag-papir__uloha' },
      el('span', { class: 'diag-papir__cislo', text: `Úloha ${i + 1}` }), vstup.uzel, stavUzel, chyba) };
  });
  const prazdne = (x) => x === null || x === undefined || (typeof x === 'string' && !x.trim())
    || (typeof x === 'object' && Object.values(x).every((y) => String(y ?? '').trim() === ''));
  const tlacitko = el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button' }, h('diag.papir_ulozit'));
  tlacitko.addEventListener('click', async () => {
    const k = [];
    let chybne = false;
    for (const p of pole) {
      p.chyba.hidden = true;
      const hodnota = p.vstup.ziskej();
      if (prazdne(hodnota)) continue; // prázdné = neodevzdáno, nic se neukládá
      const v = vyhodnotKrok(p.krok, hodnota);
      if (v.neplatne) { p.chyba.hidden = false; chybne = true; continue; }
      k.push({ ...p, hodnota, v });
    }
    if (chybne) return;
    tlacitko.disabled = true;
    tlacitko.classList.add('je-nacitani');
    try {
      await ulozit(k);
      for (const p of k) p.stavUzel.textContent = h('diag.ulozeno'); // žádné ✔/✘
    } finally {
      tlacitko.disabled = false;
      tlacitko.classList.remove('je-nacitani');
    }
  });
  const blok = (od, doo, klic) => el('section', { class: 'zasobnik' }, el('h2', { class: 'diag-nadpis', text: h(klic) }),
    el('ol', { class: 'diag-papir' }, pole.slice(od, doo).map((p) => p.li)));
  return el('div', { class: 'zasobnik zasobnik--volny diag-papir-obal' },
    el('p', { class: 'hlaska hlaska--info' }, ikona('info'), el('span', { class: 'hlaska__text', text: h('diag.papir_pokyn') })),
    blok(0, prestavkaPo(pole.length), 'diag.papir_blok_1'), blok(prestavkaPo(pole.length), pole.length, 'diag.papir_blok_2'), tlacitko);
}

// ---------------------------------------------------------------------
// Řízení stránky (síť)
// ---------------------------------------------------------------------

/**
 * Souhrn ze sezení; přepočet, když chybí, je jiného typu nebo starší verze (obrazovka §4).
 * Spolu 8 (lekce.faze 'osma'): souhrn po tématech (doporuceni.js), `katalog` = lekce předmětu (kapitola → téma).
 */
export function souhrnSezeni(lekce, sezeni, odpovedi, { katalog = [] } = {}) {
  const s = sezeni?.souhrn;
  const osma = lekce?.faze === 'osma';
  if (osma ? jeSouhrnOsma(s) : (s && s.typ === 'diagnostika' && Number(s.verze) >= VERZE_ALGORITMU && Array.isArray(s.tydny))) return { souhrn: s, prepocitano: false };
  if (!odpovedi?.some((o) => o.krok_id === 'final')) return { souhrn: null, prepocitano: false };
  return { souhrn: spocitejSouhrn(lekce, odpovedi, { rezim: sezeni?.rezim || 'app', katalog }), prepocitano: true };
}

/** Souhrn diagnostiky z odpovědí: Spolu 8 po tématech, jinak Spolu (Fáze 1 po týdnech). */
function spocitejSouhrn(lekce, odpovedi, { rezim = 'app', katalog = [] } = {}) {
  if (lekce?.faze !== 'osma') return sestavSouhrnDiagnostiky(lekce, odpovedi, { rezim });
  const predmet = predmetLekce(lekce);
  const lekcePredmetu = katalog.filter((l) => predmetLekce(l) === predmet);
  return sestavSouhrnOsma(lekce, odpovedi, { predmet, mapaKapitol: mapaKapitolNaTemata(lekcePredmetu), temata: cislaTemat(lekcePredmetu), rezim });
}

async function potvrdUkonceni(odevzdano, celkem) {
  const dialog = el('dialog', { class: 'modal', 'aria-labelledby': 'diagPotvrzeni' },
    el('div', { class: 'modal__panel' },
      el('h2', { class: 'modal__nadpis', id: 'diagPotvrzeni', text: h('diag.rodic_zobrazit') }),
      el('p', { text: h('diag.rodic_ukoncit_potvrzeni', { x: odevzdano, celkem, z: zeZ(celkem) }) }),
      odevzdano < prestavkaPo(celkem) ? el('p', { class: 'text-tlumeny', text: h('diag.rodic_orientacni') }) : null,
      el('div', { class: 'modal__akce' },
        el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => zavritModal(dialog, 'zpet') }, h('diag.rodic_zpet')),
        el('button', { class: 'tlacitko tlacitko--primarni', type: 'button', onClick: () => zavritModal(dialog, 'ano') }, h('diag.rodic_ano')))));
  document.body.append(dialog);
  const volba = await otevritModal(dialog);
  dialog.remove();
  return volba === 'ano';
}

/**
 * Diagnostika na rodic.html. Volá rodic.js, když lekce je typu diagnostika (místo taháku a semaforu).
 * @param {{lekce: object, dite: {id: string, krestni_jmeno: string}, elObsah: HTMLElement, elListaLekce: HTMLElement}} kontext
 */
export async function spustDiagnostikuRodic({ lekce, dite, elObsah, elListaLekce }) {
  const sb = await import('./supabase.js');
  elListaLekce.hidden = true;
  const ukaz = (...deti) => { elObsah.removeAttribute('aria-busy'); elObsah.replaceChildren(...deti); window.scrollTo({ top: 0 }); };

  // sezení: ?sezeni= (odkaz z přehledu), jinak rozpracované (bez limitu 24 h) / dokončené / nové
  let sezeni = null;
  const idZUrl = param('sezeni');
  if (idZUrl) {
    sezeni = (await sb.stavSezeni(idZUrl)).sezeni;
    if (sezeni.dite_id !== dite.id) sezeni = null;
  } else {
    const { probiha, dokonceno } = await najdiSezeniDiagnostiky(dite.id, lekce.id);
    sezeni = probiha || dokonceno;
    if (!sezeni) {
      const rezim = param('rezim') === 'papir' ? 'papir' : 'app';
      sezeni = (await sb.zacitSezeni(dite.id, lekce.id, rezim)).sezeni;
    }
  }
  if (!sezeni) {
    ukaz(el('div', { class: 'prazdny-stav' }, el('span', { class: 'ikona-kruh' }, ikona('info')),
      el('h1', { class: 'prazdny-stav__nadpis', text: h('diag.zadna') }),
      el('a', { class: 'tlacitko tlacitko--primarni', href: 'prehled.html' }, h('diag.na_prehled'))));
    return;
  }

  let temata = new Map();
  let faze1Otevrena = false;
  let katalog = [];
  try {
    katalog = await sb.katalogLekci();
    temata = new Map(katalog.map((l) => [l.id, l.tema]));
    faze1Otevrena = katalog.some((l) => l.id === 'F1-T01-L1' && !l.zamceno); // „Začít týden 1" jen u otevřené Fáze 1
  } catch { /* bez témat: „lekce 2 a 4" */ }

  const osma = lekce.faze === 'osma';
  const zobrazVysledek = (souhrn, datum) => ukaz(osma
    ? vytvorVysledekOsma(souhrn, { jmeno: dite.krestni_jmeno, datum, lekce: katalog.filter((l) => predmetLekce(l) === predmetLekce(lekce)) })
    : vytvorVysledek(souhrn, { jmeno: dite.krestni_jmeno, datum, temata, faze1Otevrena }));

  if (sezeni.stav === 'dokonceno') {
    const { odpovedi } = await sb.stavSezeni(sezeni.id);
    const { souhrn, prepocitano } = souhrnSezeni(lekce, sezeni, odpovedi, { katalog });
    if (!souhrn) { chybaStranky(elObsah, h('diag.nesestaveno')); return; }
    zobrazVysledek(souhrn, sezeni.konec);
    if (prepocitano) sb.dokoncitSezeni(sezeni.id, souhrn).catch((e) => console.warn('diagnostika: přepočtený souhrn se neuložil', e));
    return;
  }

  // průběh
  let odpovedi = [];
  let naposledy = null;
  let casovac = null;
  const nacti = async () => {
    const data = await sb.stavSezeni(sezeni.id);
    sezeni = data.sezeni;
    odpovedi = data.odpovedi.concat(sb.neulozeneOdpovedi({ sezeniId: sezeni.id }));
    naposledy = new Date();
  };
  const zobrazit = async () => {
    const odevzdano = pocetOdevzdanych(odpovedi);
    if (odevzdano < lekce.ulohy.length && !(await potvrdUkonceni(odevzdano, lekce.ulohy.length))) return;
    clearInterval(casovac);
    await nacti().catch(() => {});
    const souhrn = spocitejSouhrn(lekce, odpovedi, { rezim: sezeni.rezim || 'app', katalog });
    zobrazVysledek(souhrn, new Date());
    const ulozit = async () => {
      try {
        await sb.dokoncitSezeni(sezeni.id, souhrn);
        toast(h('chyba.ulozeni_ok'));
      } catch (e) {
        console.error(e);
        const tl = el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => { hl.remove(); ulozit(); } }, ikona('obnovit'), 'Zkusit znovu');
        const hl = el('div', { class: 'hlaska hlaska--varovani', role: 'alert' }, ikona('pozor'),
          el('div', { class: 'hlaska__text' }, el('strong', { text: h('chyba.ulozeni') }), el('div', { class: 'hlaska__akce' }, tl)));
        elObsah.prepend(hl);
      }
    };
    await ulozit();
  };
  const prepsat = () => ukaz(vytvorPapirDiagnostiky(lekce, {
    odpovedi,
    ulozit: async (polozky) => {
      for (const p of polozky) {
        const pokus = odpovedi.filter((o) => o.uloha_id === p.u.id && o.krok_id === p.krok.id && o.zadal === 'rodic')
          .reduce((m, o) => Math.max(m, Number(o.pokus) || 0), 0) + 1;
        await sb.ulozOdpoved({ sezeniId: sezeni.id, ulohaId: p.u.id, krokId: p.krok.id, hodnota: p.hodnota,
          spravne: p.v.spravne, typChyby: p.v.typ_chyby, pokus, zadal: 'rodic' });
      }
      await nacti();
      toast(h('diag.ulozeno'));
      elObsah.append(el('button', { class: 'tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka', type: 'button', onClick: zobrazit }, h('diag.rodic_zobrazit')));
    },
  }), el('a', { class: 'tlacitko tlacitko--tiche', href: location.href }, ikona('sipka-vlevo'), 'Zpět'));

  const vykresliPrubeh = () => {
    // Spolu 8: dítě test uzavře samo (lekce.js dokoncitTestOsma) → rodič hned vidí výsledek
    if (sezeni.stav === 'dokonceno') {
      clearInterval(casovac);
      const { souhrn } = souhrnSezeni(lekce, sezeni, odpovedi, { katalog });
      if (souhrn) { zobrazVysledek(souhrn, sezeni.konec); return; }
    }
    ukaz(vytvorPrubeh(
      { lekce, odevzdano: pocetOdevzdanych(odpovedi), zacatek: sezeni.zacatek, rezim: sezeni.rezim, naposledy },
      { obnovit: () => nacti().then(vykresliPrubeh).catch((e) => toast(e.message || h('chyba.nacteni'), { typ: 'varovani' })), zobrazit, prepsat },
    ));
  };
  await nacti();
  vykresliPrubeh();
  if (sezeni.rezim === 'app') {
    casovac = setInterval(() => {
      // neobnovovat, když je otevřené potvrzení
      if (document.querySelector('dialog[open]')) return;
      nacti().then(vykresliPrubeh).catch(() => {});
    }, INTERVAL_POLLINGU);
  }
}
