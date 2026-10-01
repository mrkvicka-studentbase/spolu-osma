// =====================================================================
// vstupy-cj.js — vstupy dítěte pro češtinu (cestina/Obsah/FORMAT-CJ.md §3.2, ZADANI-CESTINA §6.1, §8.2).
// Typy: dlazdice_vice, klik_ve_textu, oznac_role, doplnit_pismeno, kratky_text, seradit, poslech, diktat.
// Vyhodnocení je v vyhodnoceni-cj.js (čisté funkce); tady jen DOM.
//
// Rozhraní je stejné jako u vstupů v lekce.js:
//   vytvorVstupCj(uloha, krok, { idPopisku, odevzdat, vytvorVstup })
//     → { uzel, pole, hodnota() → {vyhodnoceni, ulozeni}, oznac(druh, hodnota), zamknout(), fokus() }
//   druh = 'spravne' | 'nesedi' | null. oznac() se volá i při obnovení sezení s uloženou hodnotou → stav se
//   z hodnoty obnoví. `vytvorVstup` = tvorba vstupu z lekce.js (poslech jím vytvoří vnořené dlaždice Matematiky).
//
// Pravidla (SABLONA-CJ §3, zásady Matematiky): dítě nevidí správnou odpověď ani přepis nahrávky; po chybě se
// v textu nic nezvýrazní (zpětnou vazbu „zatím nesedí" píše lekce.js); vybrané = zelená (.je-vybrano), ne „správně";
// cíle pro prst ≥ 44 px (cestina.css). Texty z hlasky.js (skupina cj.*).
// =====================================================================

import { el, ikona } from './ui.js';
import { h, HLASKY } from './hlasky.js';
import { rozlozDlazdice } from './obsah.js';
import { tokenizuj, rozdelDoplnovacku, TYPY_VSTUPU_CJ } from './vyhodnoceni-cj.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Ikona „přehrát" (trojúhelník; v ui.js IKONY není, sdílený kód neměníme). */
function ikonaPrehrat() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'ikona ikona--plna');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const p = document.createElementNS(SVG_NS, 'path');
  p.setAttribute('d', 'M8 5.5v13l10.5-6.5z');
  svg.append(p);
  return svg;
}

/** Vybráno / nevybráno: třída design systému + aria-pressed. */
function nastavVybrano(tlacitko, ano) {
  tlacitko.classList.toggle('je-vybrano', ano);
  tlacitko.setAttribute('aria-pressed', String(ano));
}

/** Obal vstupu; `je-spravne` jen po správném pokusu (po chybě se nic nezvýrazní). */
function obalVstupu(typ, idPopisku, ...deti) {
  return el('div', { class: ['krok__vstup', 'cj-vstup', `cj-vstup--${typ}`], role: 'group', 'aria-labelledby': idPopisku }, ...deti);
}
const oznacObal = (obal, druh) => obal.classList.toggle('je-spravne', druh === 'spravne');

// ---------------------------------------------------------------------
// Text rozdělený na slova (klik_ve_textu, oznac_role)
// ---------------------------------------------------------------------

/**
 * Věta jako odstavec: slova podle tokenizuj() (index od 0, interpunkce se nepočítá), interpunkce drží u slova
 * (řádek se láme jen v mezerách), volitelně místo za slovem (klik na mezeru = kam patří čárka).
 * @param {string} text
 * @param {(t: {i: number, slovo: string}) => Node} slovo
 * @param {((i: number) => Node)|null} mistoZa  místo za slovem i (ne za posledním)
 */
function textSeSlovy(text, slovo, mistoZa = null) {
  const s = String(text ?? '');
  const tokeny = tokenizuj(s);
  const odstavec = el('p', { class: 'cj-text' });
  let skupina = null;
  const zavri = () => { if (skupina) odstavec.append(skupina); skupina = null; };
  const doSkupiny = (uzel) => { if (!skupina) skupina = el('span', { class: 'cj-nezalomit' }); skupina.append(uzel); };
  const mezera = (kus) => {
    // úsek mezi slovy: znaky bez mezer drží u sousedního slova, mezery lámou řádek
    for (const cast of kus.split(/(\s+)/)) {
      if (!cast) continue;
      if (/^\s+$/.test(cast)) { zavri(); odstavec.append(document.createTextNode(' ')); } else doSkupiny(el('span', { class: 'cj-interpunkce', text: cast }));
    }
  };
  let pozice = 0;
  tokeny.forEach((t, i) => {
    mezera(s.slice(pozice, t.od));
    doSkupiny(slovo(t));
    if (mistoZa && i < tokeny.length - 1) doSkupiny(mistoZa(i));
    pozice = t.do;
  });
  mezera(s.slice(pozice));
  zavri();
  return odstavec;
}

// ---------------------------------------------------------------------
// dlazdice_vice — výběr více možností (dlaždice Matematiky se zaškrtnutím)
// ---------------------------------------------------------------------

function vstupDlazdiceVice(krok, { idPopisku }) {
  const moznosti = (krok.vstup.moznosti || []).map(String);
  const vybrano = new Set();
  const dlazdice = moznosti.map((m) => {
    const d = el('button', {
      class: 'dlazdice cj-dlazdice-vice', type: 'button', 'aria-pressed': 'false', dataset: { hodnota: m },
      onClick: () => { vybrano.has(m) ? vybrano.delete(m) : vybrano.add(m); obnov(); },
    },
    el('span', { class: 'cj-zaskrtnuti', 'aria-hidden': 'true' }, ikona('fajfka')),
    el('span', { class: 'dlazdice__text' }, el('span', { class: 'dlazdice__vyraz', text: m })),
    el('span', { class: 'dlazdice__znak dlazdice__znak--spravne' }, ikona('fajfka')));
    return d;
  });
  const obnov = () => { for (const d of dlazdice) { nastavVybrano(d, vybrano.has(d.dataset.hodnota)); d.classList.remove('je-spravne'); } };
  const mrizka = el('div', { class: 'dlazdice-mrizka cj-mrizka-vice', role: 'group', 'aria-labelledby': idPopisku }, dlazdice);
  rozlozDlazdice(mrizka, { zalomit: true }); // jako Matematika: 2 sloupce, nebo všechny pod sebou, když se slovo nevejde
  const obal = obalVstupu('dlazdice_vice', null, mrizka);
  obal.removeAttribute('role');
  const hodnota = () => moznosti.filter((m) => vybrano.has(m));
  return {
    uzel: obal,
    pole: [],
    hodnota: () => ({ vyhodnoceni: hodnota(), ulozeni: hodnota() }),
    oznac(druh, h) {
      if (Array.isArray(h)) { vybrano.clear(); for (const x of h) if (moznosti.includes(x)) vybrano.add(x); }
      obnov();
      if (druh === 'spravne') for (const d of dlazdice) if (vybrano.has(d.dataset.hodnota)) { d.classList.remove('je-vybrano'); d.classList.add('je-spravne'); }
    },
    zamknout() { for (const d of dlazdice) d.disabled = true; },
    fokus() { (dlazdice.find((d) => vybrano.has(d.dataset.hodnota) && !d.disabled) || dlazdice.find((d) => !d.disabled))?.focus({ preventScroll: true }); },
  };
}

// ---------------------------------------------------------------------
// klik_ve_textu — klik na slova, nebo na místa mezi slovy (čárka)
// ---------------------------------------------------------------------

function vstupKlikVeTextu(krok, { idPopisku }) {
  const v = krok.vstup;
  const mezery = v.cil === 'mezery';
  const max = Number.isInteger(v.max) && v.max > 0 ? v.max : Infinity;
  const vybrano = new Set();
  const cile = new Map(); // index → tlačítko
  const info = el('p', { class: 'cj-info', 'aria-live': 'polite' });

  const obnov = () => {
    for (const [i, b] of cile) {
      nastavVybrano(b, vybrano.has(i));
      if (mezery) b.querySelector('.cj-mezera__carka').textContent = vybrano.has(i) ? ',' : '';
    }
  };
  const prepni = (i) => {
    info.textContent = '';
    if (vybrano.has(i)) vybrano.delete(i);
    else if (max === 1) { vybrano.clear(); vybrano.add(i); } // jediná volba: nový klik nahradí předchozí
    else if (vybrano.size >= max) { info.textContent = h('cj.max_vyber', { n: max }); return; }
    else vybrano.add(i);
    obal.classList.remove('je-spravne');
    obnov();
  };

  const slovo = (t) => {
    if (mezery) return el('span', { class: 'cj-slovo-pevne', text: t.slovo });
    const b = el('button', { class: 'cj-slovo', type: 'button', 'aria-pressed': 'false', dataset: { i: t.i }, onClick: () => prepni(t.i) }, t.slovo);
    cile.set(t.i, b);
    return b;
  };
  const mistoZa = mezery ? (i) => {
    const b = el('button', {
      class: 'cj-mezera', type: 'button', 'aria-pressed': 'false', dataset: { i },
      'aria-label': h('cj.misto_za', { n: i + 1 }), onClick: () => prepni(i),
    }, el('span', { class: 'cj-mezera__carka', 'aria-hidden': 'true' }));
    cile.set(i, b);
    return b;
  } : null;

  const obal = obalVstupu('klik_ve_textu', idPopisku, textSeSlovy(v.text, slovo, mistoZa), info);
  const hodnota = () => [...vybrano].sort((a, b) => a - b);
  return {
    uzel: obal,
    pole: [],
    hodnota: () => ({ vyhodnoceni: hodnota(), ulozeni: hodnota() }),
    oznac(druh, h) {
      if (Array.isArray(h)) { vybrano.clear(); for (const i of h) if (cile.has(i)) vybrano.add(i); }
      info.textContent = '';
      obnov();
      oznacObal(obal, druh);
    },
    zamknout() { for (const b of cile.values()) b.disabled = true; info.textContent = ''; obal.classList.add('je-zamceno'); },
    fokus() { const b = [...cile.values()].find((x) => !x.disabled); b?.focus({ preventScroll: true }); },
  };
}

// ---------------------------------------------------------------------
/** Název kategorie oznac_role pro dítě i rodiče: klíč v datech (rod, cislo, pad …) → „Rod“, „Číslo“, „Pád“; neznámý klíč beze změny. */
export const nazevKategorie = (k) => (HLASKY[`cj.kategorie_${k}`] !== undefined ? h(`cj.kategorie_${k}`) : String(k));

// oznac_role — u podtržených slov vybrat roli (jednoduché role, nebo více kategorií)
// ---------------------------------------------------------------------

function vstupOznacRole(krok, { idPopisku }) {
  const v = krok.vstup;
  const kategorie = Array.isArray(v.role) ? null : Object.keys(v.role || {});
  const slova = (v.slova || []).map(Number);
  const tokeny = tokenizuj(v.text);
  const odp = {}; // index → role | {kategorie: hodnota}
  const tlacitka = new Map();
  const stitky = new Map();
  let aktivni = null;
  let zamceno = false;

  const nabidka = el('div', { class: 'cj-nabidka', hidden: true, id: `${idPopisku || 'cj'}-nabidka` });

  const kompletni = (i) => (kategorie ? kategorie.every((k) => odp[i]?.[k] !== undefined) : odp[i] !== undefined);
  const textStitku = (i) => {
    const x = odp[i];
    if (x === undefined) return '…';
    return kategorie ? kategorie.map((k) => x[k] ?? '…').join(' · ') : x;
  };
  const obnovSlovo = (i) => {
    const b = tlacitka.get(i);
    const st = stitky.get(i);
    st.textContent = textStitku(i);
    st.classList.toggle('je-prazdny', odp[i] === undefined);
    b.classList.toggle('je-vybrano', odp[i] !== undefined);
    b.classList.toggle('je-aktivni', aktivni === i);
    b.setAttribute('aria-expanded', String(aktivni === i));
    b.setAttribute('aria-label', `${tokeny[i]?.slovo ?? ''}: ${odp[i] === undefined ? '…' : textStitku(i)}`);
  };
  const obnovVse = () => { for (const i of tlacitka.keys()) obnovSlovo(i); };

  const zavri = () => { aktivni = null; nabidka.hidden = true; nabidka.replaceChildren(); obnovVse(); };
  const skupina = (nazev, moznosti, vybrana, vyber) => el('div', { class: 'cj-nabidka__skupina', role: 'group', 'aria-label': nazev || null },
    nazev ? el('p', { class: 'cj-nabidka__nazev', text: nazev }) : null,
    el('div', { class: 'cj-volby' }, moznosti.map((m) => {
      const b = el('button', { class: 'cj-volba', type: 'button', onClick: () => vyber(m) }, String(m));
      nastavVybrano(b, vybrana === m);
      return b;
    })));

  function otevri(i) {
    if (zamceno) return;
    aktivni = i;
    obal.classList.remove('je-spravne');
    const dalsi = () => slova.find((j) => j !== i && !kompletni(j));
    const skupiny = kategorie
      ? kategorie.map((k) => skupina(nazevKategorie(k), v.role[k] || [], odp[i]?.[k], (m) => { odp[i] = { ...(odp[i] || {}), [k]: m }; otevri(i); }))
      : [skupina(null, v.role || [], odp[i], (m) => {
        odp[i] = m;
        // po výběru rovnou další slovo bez role (u posledního se nabídka zavře)
        const j = dalsi();
        if (j !== undefined) { otevri(j); tlacitka.get(j).scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }); } else { zavri(); tlacitka.get(i).focus({ preventScroll: true }); }
      })];
    nabidka.replaceChildren(...[
      el('p', { class: 'cj-nabidka__slovo', text: h('cj.role_vyber', { slovo: tokeny[i]?.slovo ?? '' }) }),
      ...skupiny,
      kategorie ? el('div', { class: 'cj-nabidka__akce' },
        el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', onClick: () => { const b = tlacitka.get(i); zavri(); b.focus({ preventScroll: true }); } }, h('cj.role_hotovo'))) : null,
    ].filter(Boolean));
    nabidka.hidden = false;
    obnovVse();
    nabidka.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }

  const slovo = (t) => {
    if (!slova.includes(t.i)) return el('span', { class: 'cj-slovo-pevne', text: t.slovo });
    const b = el('button', {
      class: 'cj-slovo cj-slovo--role', type: 'button', dataset: { i: t.i }, 'aria-controls': nabidka.id, 'aria-expanded': 'false',
      onClick: () => otevri(t.i),
    }, t.slovo);
    const st = el('span', { class: 'cj-stitek-role je-prazdny', 'aria-hidden': 'true', text: '…' });
    tlacitka.set(t.i, b);
    stitky.set(t.i, st);
    return el('span', { class: 'cj-slovo-s-roli' }, b, st);
  };

  const obal = obalVstupu('oznac_role', idPopisku, textSeSlovy(v.text, slovo), nabidka);
  obnovVse();
  /** Odpověď se stálým pořadím klíčů (podle `slova`) — lekce.js porovnává pokusy přes JSON. */
  const hodnota = () => {
    const o = {};
    for (const i of slova) {
      if (odp[i] === undefined) continue;
      o[String(i)] = kategorie ? Object.fromEntries(kategorie.filter((k) => odp[i][k] !== undefined).map((k) => [k, odp[i][k]])) : odp[i];
    }
    return o;
  };
  return {
    uzel: obal,
    pole: [],
    hodnota: () => ({ vyhodnoceni: hodnota(), ulozeni: hodnota() }),
    oznac(druh, h) {
      if (h && typeof h === 'object' && !Array.isArray(h)) {
        for (const k of Object.keys(odp)) delete odp[k];
        for (const i of slova) {
          const x = h[String(i)];
          if (x === undefined || x === null) continue;
          odp[i] = kategorie ? { ...x } : x;
        }
      }
      if (aktivni !== null) zavri(); else obnovVse();
      oznacObal(obal, druh);
    },
    zamknout() {
      zamceno = true;
      zavri();
      for (const b of tlacitka.values()) { b.disabled = true; b.removeAttribute('aria-expanded'); }
      obal.classList.add('je-zamceno');
    },
    fokus() {
      if (zamceno) return;
      const i = slova.find((j) => !kompletni(j)) ?? slova[0];
      tlacitka.get(i)?.focus({ preventScroll: true });
    },
  };
}

// ---------------------------------------------------------------------
// doplnit_pismeno — tlačítka přímo ve slově, vybrané písmeno se doplní, jde změnit
// ---------------------------------------------------------------------

function vstupDoplnitPismeno(krok, { idPopisku }) {
  const v = krok.vstup;
  const mezery = v.mezery || [];
  const odp = mezery.map(() => null);
  const obaly = [];
  let zamceno = false;

  const vykresliMezeru = (i) => {
    const o = obaly[i];
    if (odp[i] !== null) {
      o.replaceChildren(el('button', {
        class: 'cj-doplneno', type: 'button', 'aria-label': h('cj.zmenit_pismeno', { p: odp[i] }), disabled: zamceno,
        onClick: () => { odp[i] = null; obal.classList.remove('je-spravne'); vykresliMezeru(i); o.querySelector('button')?.focus({ preventScroll: true }); },
      }, odp[i]));
    } else {
      o.replaceChildren(...(mezery[i]?.moznosti || []).map((m) => el('button', {
        class: 'cj-pismeno', type: 'button', disabled: zamceno, dataset: { hodnota: m },
        onClick: () => { odp[i] = m; obal.classList.remove('je-spravne'); vykresliMezeru(i); o.querySelector('button')?.focus({ preventScroll: true }); },
      }, m)));
    }
    o.classList.toggle('je-doplneno', odp[i] !== null);
  };

  // slovo s mezerou se nezalomí (řádek se láme jen v mezerách mezi slovy)
  const odstavec = el('p', { class: 'cj-text cj-text--doplnit' });
  let skupina = null;
  const zavri = () => { if (skupina) odstavec.append(skupina); skupina = null; };
  const doSkupiny = (u) => { if (!skupina) skupina = el('span', { class: 'cj-nezalomit' }); skupina.append(u); };
  for (const c of rozdelDoplnovacku(v.text)) {
    if ('mezera' in c) {
      const o = el('span', { class: 'cj-mezera-pismeno', role: 'group', 'aria-label': `${c.mezera + 1}.` });
      obaly[c.mezera] = o;
      doSkupiny(o);
      continue;
    }
    for (const cast of c.text.split(/(\s+)/)) {
      if (!cast) continue;
      if (/^\s+$/.test(cast)) { zavri(); odstavec.append(document.createTextNode(' ')); } else doSkupiny(document.createTextNode(cast));
    }
  }
  zavri();
  obaly.forEach((_, i) => vykresliMezeru(i));

  const obal = obalVstupu('doplnit_pismeno', idPopisku, odstavec);
  return {
    uzel: obal,
    pole: [],
    hodnota: () => ({ vyhodnoceni: [...odp], ulozeni: [...odp] }),
    oznac(druh, h) {
      if (Array.isArray(h)) h.forEach((x, i) => { if (i < odp.length) odp[i] = mezery[i]?.moznosti?.includes(x) ? x : null; });
      obaly.forEach((_, i) => vykresliMezeru(i));
      oznacObal(obal, druh);
    },
    zamknout() { zamceno = true; obaly.forEach((_, i) => vykresliMezeru(i)); obal.classList.add('je-zamceno'); },
    fokus() {
      if (zamceno) return;
      const i = odp.findIndex((x) => x === null);
      obaly[i === -1 ? 0 : i]?.querySelector('button')?.focus({ preventScroll: true });
    },
  };
}

// ---------------------------------------------------------------------
// kratky_text — napiš tvar (přesná shoda po normalizaci, vyhodnocení automaticky)
// ---------------------------------------------------------------------

function vstupKratkyText(krok, { idPopisku, odevzdat }) {
  const idNapovedy = krok.vstup.napoveda_formatu ? `${idPopisku || 'cj'}-format` : null;
  const p = el('input', {
    class: 'pole cj-pole', type: 'text', maxlength: '120', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off',
    spellcheck: 'false', lang: 'cs', 'aria-labelledby': idPopisku, 'aria-describedby': idNapovedy,
  });
  p.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); odevzdat?.(); } });
  const oznacPole = (trida) => {
    p.classList.remove('je-spravne', 'je-nesedi');
    if (trida) p.classList.add(trida);
  };
  p.addEventListener('input', () => { if (!p.disabled) oznacPole(null); });
  const obal = obalVstupu('kratky_text', null, p,
    idNapovedy ? el('p', { class: 'cj-info', id: idNapovedy, text: krok.vstup.napoveda_formatu }) : null);
  obal.removeAttribute('role');
  return {
    uzel: obal,
    pole: [p],
    hodnota: () => ({ vyhodnoceni: p.value, ulozeni: p.value.trim() }),
    // pole jako v Matematice: po chybě neutrální „nesedí" (šedomodrá), po úpravě zmizí
    oznac(druh, h) {
      if (typeof h === 'string') p.value = h;
      oznacPole(druh === 'spravne' ? 'je-spravne' : druh === 'nesedi' ? 'je-nesedi' : null);
    },
    zamknout() { p.disabled = true; },
    fokus() { if (!p.disabled) { p.focus({ preventScroll: true }); p.select(); } },
  };
}

// ---------------------------------------------------------------------
// seradit — klikání v pořadí (štítky 1, 2, 3…), další klik číslo zruší
// ---------------------------------------------------------------------

function vstupSeradit(krok, { idPopisku }) {
  const polozky = (krok.vstup.polozky || []).map(String);
  let poradi = [];
  let zamceno = false;
  const tlacitka = polozky.map((p) => el('button', {
    class: 'cj-polozka', type: 'button', dataset: { hodnota: p },
    onClick: () => prepni(p),
  }, el('span', { class: 'cj-polozka__cislo', 'aria-hidden': 'true' }), el('span', { class: 'cj-polozka__text', text: p })));
  const obnov = () => {
    for (const b of tlacitka) {
      const n = poradi.indexOf(b.dataset.hodnota);
      b.classList.toggle('je-vybrano', n >= 0);
      b.querySelector('.cj-polozka__cislo').textContent = n >= 0 ? String(n + 1) : '';
      b.setAttribute('aria-label', n >= 0 ? `${b.dataset.hodnota}, ${n + 1}.` : b.dataset.hodnota);
    }
  };
  function prepni(p) {
    if (zamceno) return;
    poradi = poradi.includes(p) ? poradi.filter((x) => x !== p) : [...poradi, p];
    obal.classList.remove('je-spravne');
    obnov();
  }
  const znovu = el('button', {
    class: 'tlacitko tlacitko--tiche', type: 'button',
    onClick: () => { if (!zamceno) { poradi = []; obnov(); tlacitka[0]?.focus({ preventScroll: true }); } },
  }, ikona('smazat'), h('zak.poradi_znovu'));
  const obal = obalVstupu('seradit', idPopisku,
    el('div', { class: 'cj-polozky' }, tlacitka),
    el('div', { class: 'cj-pata' }, el('p', { class: 'cj-info', text: h('cj.seradit_napoveda') }), znovu));
  obnov();
  return {
    uzel: obal,
    pole: [],
    hodnota: () => ({ vyhodnoceni: [...poradi], ulozeni: [...poradi] }),
    oznac(druh, h) {
      if (Array.isArray(h)) { poradi = h.filter((x, i) => polozky.includes(x) && h.indexOf(x) === i); obnov(); }
      oznacObal(obal, druh);
    },
    zamknout() { zamceno = true; for (const b of tlacitka) b.disabled = true; znovu.remove(); obal.classList.add('je-zamceno'); },
    fokus() { if (!zamceno) (tlacitka.find((b) => !poradi.includes(b.dataset.hodnota)) || tlacitka[0])?.focus({ preventScroll: true }); },
  };
}

// ---------------------------------------------------------------------
// Přehrávač nahrávky (poslech, diktát): nativní <audio>, velké tlačítko, počítadlo přehrání
// ---------------------------------------------------------------------

/** Počet přehrání přežije obnovení stránky (sessionStorage; bez úložiště se počítá jen v paměti). */
function pocitadloUloziste(klic) {
  const k = `spolu.cj.prehrano.${klic}`;
  return {
    nacti() { try { return Number(sessionStorage.getItem(k)) || 0; } catch { return 0; } },
    uloz(n) { try { sessionStorage.setItem(k, String(n)); } catch { /* jen v paměti */ } },
  };
}

/**
 * @param {string} src  cesta z JSON relativně k web/ (lekce.html je ve web/)
 * @param {{max?: number, popisek: string, klic: string}} v  max 0 = bez omezení
 */
function vytvorPrehravac(src, { max = 0, popisek, klic }) {
  const uloziste = pocitadloUloziste(klic);
  let prehrano = uloziste.nacti();
  let url = null;
  try { url = src ? new URL(src, location.href).href : null; } catch { url = null; }
  const audio = el('audio', { preload: 'metadata', class: 'cj-audio' });
  const chyba = el('p', { class: 'cj-audio-chyba', role: 'status', hidden: true }, ikona('info'), el('span', { text: h('cj.audio_chyba') }));
  const pocitadlo = el('span', { class: 'cj-prehravac__pocet', 'aria-live': 'polite' });
  const text = el('span', { text: popisek });
  const znak = el('span', { class: 'cj-prehravac__znak' }, ikonaPrehrat());
  const tlacitko = el('button', { class: 'tlacitko tlacitko--navy tlacitko--velke cj-prehravac__tlacitko', type: 'button' }, znak, text);
  let hraje = false;

  const vycerpano = () => max > 0 && prehrano >= max;
  const obnov = () => {
    pocitadlo.textContent = max > 0 ? h('cj.prehrano', { n: prehrano, max }) : '';
    znak.replaceChildren(hraje ? ikona('stop') : ikonaPrehrat());
    text.textContent = hraje ? h('cj.zastavit') : popisek;
    tlacitko.disabled = !url || (!hraje && vycerpano());
  };
  const ukazChybu = () => { chyba.hidden = false; hraje = false; obnov(); };

  tlacitko.addEventListener('click', () => {
    if (hraje) { audio.pause(); audio.currentTime = 0; hraje = false; obnov(); return; }
    if (vycerpano() || !url) return;
    chyba.hidden = true;
    try { audio.currentTime = 0; } catch { /* metadata ještě nejsou */ }
    const p = audio.play();
    hraje = true;
    prehrano += 1;
    uloziste.uloz(prehrano);
    obnov();
    if (p && typeof p.catch === 'function') {
      p.catch((e) => {
        if (e?.name === 'AbortError') return; // zastaveno tlačítkem
        prehrano = Math.max(0, prehrano - 1); // nepřehrálo se → nepočítá se
        uloziste.uloz(prehrano);
        ukazChybu();
      });
    }
  });
  audio.addEventListener('ended', () => { hraje = false; obnov(); });
  audio.addEventListener('error', ukazChybu);
  if (url) audio.src = url; else chyba.hidden = false;
  obnov();

  return {
    uzel: el('div', { class: 'cj-prehravac' }, el('div', { class: 'cj-prehravac__radek' }, tlacitko, pocitadlo), chyba, audio),
    zastavit() { if (hraje) { audio.pause(); hraje = false; obnov(); } },
    tlacitko,
  };
}

// ---------------------------------------------------------------------
// poslech — nahrávka + (otázka) + vnořený vstup (dlaždice Matematiky přes vytvorVstup z lekce.js)
// ---------------------------------------------------------------------

function vstupPoslech(uloha, krok, { idPopisku, odevzdat, vytvorVstup }) {
  const v = krok.vstup;
  const prehravac = vytvorPrehravac(v.audio, { max: Number(v.max_prehrani) || 0, popisek: h('cj.prehrat'), klic: `${uloha?.id}/${krok.id}` });
  const idOtazky = v.otazka ? `${idPopisku || `cj-${krok.id}`}-otazka` : null;
  const vnorenyKrok = { ...krok, vstup: v.vnoreny_vstup || {} };
  const typ = vnorenyKrok.vstup.typ;
  let vnoreny;
  if (TYPY_VSTUPU_CJ.includes(typ) && typ !== 'poslech' && typ !== 'diktat') {
    vnoreny = vytvorVstupCj(uloha, vnorenyKrok, { idPopisku: idOtazky || idPopisku, odevzdat, vytvorVstup });
  } else if (typeof vytvorVstup === 'function') {
    vnoreny = vytvorVstup(uloha, vnorenyKrok, idOtazky || idPopisku, odevzdat);
  } else {
    throw new Error(`vstupy-cj: vnořený vstup „${typ}" potřebuje vytvorVstup z lekce.js`);
  }
  const obal = el('div', { class: ['krok__vstup', 'cj-vstup', 'cj-vstup--poslech'] },
    prehravac.uzel,
    v.otazka ? el('p', { class: 'cj-otazka', id: idOtazky, text: v.otazka }) : null,
    el('div', { class: 'cj-vnoreny' }, vnoreny.uzel));
  return {
    uzel: obal,
    pole: vnoreny.pole,
    hodnota: () => vnoreny.hodnota(),
    oznac: (druh, h) => vnoreny.oznac(druh, h),
    zamknout() { prehravac.zastavit(); vnoreny.zamknout(); },
    fokus: () => vnoreny.fokus(),
  };
}

// ---------------------------------------------------------------------
// diktat — věta po větě: přehrát (max. max_prehrani×), napsat, „Další věta"; odpověď = pole textů
// ---------------------------------------------------------------------

function vstupDiktat(uloha, krok, { idPopisku }) {
  const v = krok.vstup;
  const vety = v.vety || [];
  const max = Number(v.max_prehrani) || 0;
  let odhaleno = 1;          // kolik vět už dítě vidí (Další věta)
  let zamceno = false;
  const radky = [];
  const pole = [];
  const prehravace = [];
  const seznam = el('ol', { class: 'cj-diktat' });
  const dalsi = el('button', { class: 'tlacitko tlacitko--sekundarni cj-diktat__dalsi', type: 'button', onClick: () => odhal(odhaleno + 1, true) },
    h('cj.dalsi_veta'), ikona('sipka-vpravo'));
  const konec = el('p', { class: 'cj-info', text: h('cj.posledni_veta'), hidden: true });

  vety.forEach((veta, i) => {
    const idStavu = `${idPopisku || `cj-${krok.id}`}-veta-${i}`;
    const p = vytvorPrehravac(veta.audio, { max, popisek: h('cj.prehrat_vetu', { n: i + 1 }), klic: `${uloha?.id}/${krok.id}/${i}` });
    const t = el('textarea', {
      class: 'pole cj-pole cj-diktat__pole', rows: '2', maxlength: '300', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off',
      spellcheck: 'false', lang: 'cs', 'aria-labelledby': idStavu,
    });
    // Enter nepíše nový řádek: odhalí další větu (nebo nic); odevzdává se tlačítkem
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (i === odhaleno - 1 && odhaleno < vety.length) odhal(odhaleno + 1, true);
      else pole[i + 1]?.focus();
    });
    const radek = el('li', { class: 'cj-diktat__veta', hidden: i > 0 },
      el('p', { class: 'cj-diktat__stav', id: idStavu, text: h('cj.veta_z', { n: i + 1, pocet: vety.length }) }), p.uzel, t);
    radky.push(radek);
    pole.push(t);
    prehravace.push(p);
    seznam.append(radek);
  });

  function odhal(n, fokus = false) {
    odhaleno = Math.max(1, Math.min(vety.length, n));
    radky.forEach((r, i) => { r.hidden = i >= odhaleno; });
    for (const p of prehravace.slice(0, odhaleno - 1)) p.zastavit();
    dalsi.hidden = zamceno || odhaleno >= vety.length;
    konec.hidden = zamceno || odhaleno < vety.length;
    if (fokus) {
      const p = prehravace[odhaleno - 1];
      (p.tlacitko.disabled ? pole[odhaleno - 1] : p.tlacitko).focus({ preventScroll: true });
      radky[odhaleno - 1].scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    }
  }
  odhal(1);

  const obal = obalVstupu('diktat', idPopisku, seznam, dalsi, konec);
  const texty = () => pole.map((t) => t.value.trim());
  return {
    uzel: obal,
    pole,
    // Dokud dítě neprošlo všechny věty, odpověď je neúplná (null → neplatne, hláška cj.neplatne_diktat_dalsi)
    hodnota: () => ({ vyhodnoceni: odhaleno >= vety.length ? pole.map((t) => t.value) : null, ulozeni: texty() }),
    oznac(druh, h) {
      if (Array.isArray(h)) {
        pole.forEach((t, i) => { t.value = typeof h[i] === 'string' ? h[i] : ''; });
        odhal(vety.length); // uložená odpověď = dítě už prošlo všechny věty
      }
      oznacObal(obal, druh);
    },
    zamknout() {
      zamceno = true;
      for (const t of pole) t.disabled = true;
      for (const p of prehravace) p.zastavit();
      odhal(vety.length);
      obal.classList.add('je-zamceno');
    },
    fokus() { if (!zamceno) (pole.slice(0, odhaleno).find((t) => !t.value.trim()) || pole[odhaleno - 1])?.focus({ preventScroll: true }); },
  };
}

// ---------------------------------------------------------------------
// Rozcestník + hlášky
// ---------------------------------------------------------------------

/**
 * Vstup češtiny se stejným rozhraním jako vstupy v lekce.js.
 * @param {object} uloha
 * @param {object} krok
 * @param {{idPopisku?: string|null, odevzdat?: () => void,
 *   vytvorVstup?: (uloha: object, krok: object, idPopisku: string|null, odevzdat: () => void) => object}} [volby]
 *   vytvorVstup = tvorba vstupu Matematiky (lekce.js) — poslech jím vykreslí vnořené dlaždice
 */
export function vytvorVstupCj(uloha, krok, { idPopisku = null, odevzdat = null, vytvorVstup = null } = {}) {
  const volby = { idPopisku, odevzdat, vytvorVstup };
  switch (krok?.vstup?.typ) {
    case 'dlazdice_vice': return vstupDlazdiceVice(krok, volby);
    case 'klik_ve_textu': return vstupKlikVeTextu(krok, volby);
    case 'oznac_role': return vstupOznacRole(krok, volby);
    case 'doplnit_pismeno': return vstupDoplnitPismeno(krok, volby);
    case 'kratky_text': return vstupKratkyText(krok, volby);
    case 'seradit': return vstupSeradit(krok, volby);
    case 'poslech': return vstupPoslech(uloha, krok, volby);
    case 'diktat': return vstupDiktat(uloha, krok, volby);
    default: throw new Error(`vstupy-cj: neznámý typ vstupu „${krok?.vstup?.typ}"`);
  }
}

/**
 * Výzva k doplnění, když je odpověď neúplná (vyhodnoceni: neplatne; nepočítá se jako pokus).
 * @param {object} vstup  krok.vstup (u poslechu vnořený vstup řeší volající)
 * @param {*} hodnota  hodnota().vyhodnoceni
 * @returns {string}
 */
export function hlaskaNeplatneCj(vstup, hodnota) {
  switch (vstup?.typ) {
    case 'klik_ve_textu': {
      const n = Array.isArray(hodnota) ? hodnota.length : 0;
      const min = Math.max(1, Number(vstup.min) || 1);
      if (n > 0 && n < min) return h('cj.neplatne_klik_min', { n: min });
      return h(vstup.cil === 'mezery' ? 'cj.neplatne_klik_mezery' : 'cj.neplatne_klik');
    }
    case 'dlazdice_vice': return h('cj.neplatne_vice');
    case 'doplnit_pismeno': return h('cj.neplatne_doplnit');
    case 'oznac_role': return h('cj.neplatne_role');
    case 'seradit': return h('cj.neplatne_seradit');
    case 'kratky_text': return h('cj.neplatne_kratky_text');
    case 'diktat': return h(hodnota === null ? 'cj.neplatne_diktat_dalsi' : 'cj.neplatne_diktat');
    default: return h('zak.neplatne_text');
  }
}
