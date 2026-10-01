// =====================================================================
// rodic-cj.js — bloky karty rodiče pro nové vstupy češtiny (ZADANI-CESTINA §6.3, §6.4, §8.2;
// cestina/Obsah/FORMAT-CJ.md §3.2, §8). Volá je rodic-karta.js; Matematiky se nic netýká.
//
//  - nahledKrokuCj:      „Co vidí dítě" jen ke čtení (bez řešení; přepis poslechu a text diktátu sbalené)
//  - odpovedDiteteCj:    „Dítě odevzdalo" — co dítě vybralo / napsalo, co chybí, co je navíc, známá chyba + otázka
//  - vytvorPapirCj:      papírový režim — „Správně je: …" slovy + Sedí / Nesedí (hodnota { rodic: 'sedi'|'nesedi' })
//  - vytvorSlovnicek:    „Co ta slova znamenají" (lekce.slovnicek_pro_rodice) v úvodu lekce
// Rodič nic neopravuje ani nečte nahlas (zásada 1); výjimka „Číst sám" u diktátu, jen když nahrávka nejde.
// DOM přes el() z ui.js, texty z hlasky.js (skupina cj.*). Styly: web/css/cestina-rodic.css.
// =====================================================================

import { el, ikona } from './ui.js';
import { h } from './hlasky.js';
import { renderMarkdown } from './obsah.js';
import { vyhodnotKrok } from './vyhodnoceni.js';
import { tokenizuj, rozdelDoplnovacku, TYPY_VSTUPU_CJ } from './vyhodnoceni-cj.js';
import { vytvorSediNesedi } from './vstupy-f2.js';
import { nazevKategorie } from './vstupy-cj.js';

/** Je typ vstupu nový vstup češtiny (včetně `poslech`)? */
export const jeVstupCj = (typ) => TYPY_VSTUPU_CJ.includes(typ);

/**
 * Má krok v papírovém režimu Sedí / Nesedí češtiny? Ne u dlaždic ani u poslechu s vnořenými dlaždicemi —
 * ty rodič klikne jako v Matematice (vytvorVstupFinal).
 */
export function jePapirCj(krok) {
  const typ = krok?.vstup?.typ;
  if (typ === 'poslech') return jeVstupCj(krok.vstup.vnoreny_vstup?.typ);
  return jeVstupCj(typ);
}

/** Krok s vnořeným vstupem poslechu na místě `vstup` (spravne / zname_chyby zůstávají na kroku). */
const vnitrniKrok = (krok) => (krok?.vstup?.typ === 'poslech' && krok.vstup.vnoreny_vstup
  ? { ...krok, vstup: krok.vstup.vnoreny_vstup } : krok);

const uvoz = (x) => `„${x}“`;
const seznam = (polozky) => polozky.filter((x) => x !== null && x !== undefined && x !== '').join(', ');
const stitekText = (klic) => h(klic, { odpoved: '', slova: '' }).replace(/[\s:]+$/, '') + ':';

// ---------------------------------------------------------------------
// Věta po slovech (klik_ve_textu, oznac_role) — slova jako <span>, mezi nimi původní text
// ---------------------------------------------------------------------

/**
 * @param {string} text
 * @param {{slovo?: (i: number) => (string|false|null), mezera?: (i: number) => (string|false|null)}} tridy
 *   slovo(i) = třída slova i (nebo nic); mezera(i) = třída značky místa za slovem i (jen `cil: mezery`)
 */
function vykresliVetu(text, { slovo = () => null, mezera = null } = {}) {
  const tokeny = tokenizuj(text);
  const deti = [];
  let pozice = 0;
  for (const t of tokeny) {
    if (t.od > pozice) deti.push(text.slice(pozice, t.od));
    deti.push(el('span', { class: ['cjr-veta__slovo', slovo(t.i)] }, t.slovo));
    if (mezera && t.i < tokeny.length - 1) {
      const trida = mezera(t.i);
      deti.push(el('span', { class: ['cjr-veta__mezera', trida], 'aria-hidden': 'true' }));
    }
    pozice = t.do;
  }
  if (pozice < text.length) deti.push(text.slice(pozice));
  return el('p', { class: 'cjr-veta' }, deti);
}

/** Slovo věty pro rodiče: „pes“; slovo, které je ve větě víckrát, dostane pořadí („zelená“ (3. slovo)). */
function slovoVety(tokeny, i) {
  const t = tokeny[i];
  if (!t) return uvoz(String(i));
  const vic = tokeny.filter((x) => x.slovo.toLocaleLowerCase('cs') === t.slovo.toLocaleLowerCase('cs')).length > 1;
  return vic ? `${uvoz(t.slovo)} (${h('cj.slovo_cislo', { n: i + 1 })})` : uvoz(t.slovo);
}

/** Prvek odpovědi (index slova / místa / řetězec / klíč role) slovy — nikdy index. */
function prvekSlovy(vstup, x) {
  if (vstup.typ === 'dlazdice_vice') return uvoz(x);
  const tokeny = tokenizuj(vstup.text || '');
  if (vstup.typ === 'klik_ve_textu' && vstup.cil === 'mezery') return h('cj.mezera_za', { slovo: tokeny[x]?.slovo ?? String(x) });
  return slovoVety(tokeny, Number.parseInt(String(x), 10));
}

/** Klíč položky oznac_role („5" nebo „5.pad") slovy: „tráva“ (pád). */
function polozkaRoleSlovy(vstup, kde) {
  const [klic, kat] = String(kde).split('.');
  const slovo = prvekSlovy(vstup, klic);
  return kat ? `${slovo} (${nazevKategorie(kat).toLocaleLowerCase('cs')})` : slovo;
}

/** Hodnota role: řetězec, nebo {kategorie: hodnota} → „pád: 4., číslo: jednotné". */
const roleText = (r) => (r && typeof r === 'object' ? Object.entries(r).map(([k, v]) => `${nazevKategorie(k).toLocaleLowerCase('cs')}: ${v}`).join(', ') : String(r ?? '—'));

/**
 * Doplňovačka jako text s písmeny v mezerách. `pismeno(i)` = co ukázat v mezeře i, `trida(i)` = třída mezery.
 * Vrací i slova kolem mezer (pro „nesedí u: …“).
 */
function vykresliDoplnovacku(text, { pismeno, trida = () => null }) {
  const casti = rozdelDoplnovacku(text);
  let slozeny = '';
  const pozice = [];
  const deti = casti.map((c) => {
    if (c.mezera === undefined) { slozeny += c.text; return c.text; }
    const p = pismeno(c.mezera);
    pozice[c.mezera] = slozeny.length;
    slozeny += p || '_';
    return el('span', { class: ['cjr-mezera', trida(c.mezera)] }, p || ' ');
  });
  // slovo, ve kterém mezera leží (po doplnění)
  const slova = tokenizuj(slozeny);
  const slovoMezery = (i) => slova.find((t) => t.od <= pozice[i] && pozice[i] < t.do)?.slovo ?? '';
  return { uzel: el('p', { class: 'cjr-veta cjr-veta--doplnovacka' }, deti), slovoMezery };
}

// ---------------------------------------------------------------------
// a) „Co vidí dítě" — jen ke čtení, bez řešení
// ---------------------------------------------------------------------

/** Přehrávač pro papírový režim (rodič pustí nahrávku dítěti, které píše na papír). */
function prehravac(audio, popisek) {
  if (!audio) return null;
  return el('div', { class: 'cjr-audio' },
    popisek ? el('span', { class: 'cjr-audio__popisek', text: popisek }) : null,
    el('audio', { class: 'cjr-audio__prehravac', controls: true, preload: 'none', src: audio, 'aria-label': popisek || h('cj.prehrat') }));
}

/** Nabídka (chips) — dlaždice více, role, položky k seřazení. */
const nabidka = (polozky, trida = '') => el('ul', { class: ['cjr-nabidka', trida] },
  polozky.map((p) => el('li', { class: 'cjr-stitek', text: String(p) })));

/**
 * Text diktátu sbalený (rodič ho nečte nahlas) + pod ním sbalené záložní „Číst sám" (jen když nahrávka dítěti nejde).
 * @param {object} vstup  vstup `diktat`
 */
function textDiktatu(vstup) {
  const vety = vstup.vety || [];
  const velke = el('ol', { class: 'cjr-cist-sam', hidden: true }, vety.map((v) => el('li', { text: v.text })));
  const tlacitko = el('button', { class: 'tlacitko tlacitko--sekundarni', type: 'button', 'aria-expanded': 'false' },
    ikona('kniha'), h('cj.cist_sam'));
  tlacitko.addEventListener('click', () => {
    velke.hidden = !velke.hidden;
    tlacitko.setAttribute('aria-expanded', String(!velke.hidden));
  });
  return el('details', { class: 'rozbalovaci rozbalovaci--vnorene cjr-diktat-text' },
    el('summary', null, ikona('oko'), h('cj.diktat_text_nadpis'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
    el('div', { class: 'rozbalovaci__obsah' },
      el('ol', { class: 'cjr-diktat-text__vety' }, vety.map((v) => el('li', { text: v.text }))),
      el('details', { class: 'rozbalovaci rozbalovaci--vnorene cjr-cist-sam-blok' },
        el('summary', null, ikona('pozor'), h('cj.cist_sam_odkaz'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
        el('div', { class: 'rozbalovaci__obsah' },
          el('p', { class: 'text-tlumeny', text: h('cj.cist_sam_pozn') }), tlacitko, velke))));
}

/**
 * „Co vidí dítě" pro nový vstup češtiny (jen ke čtení, nic neprozradí).
 * @param {object} krok
 * @param {{dlazdice?: ((krokDlazdic: object) => Element)|null, papir?: boolean}} [volby]
 *   dlazdice = vykreslí vnořené dlaždice poslechu stejně jako karta (rodic-karta.js);
 *   papir = u poslechu a diktátu přehrávač (dítě píše na papír, nahrávku pouští rodič)
 * @returns {Element|null}
 */
export function nahledKrokuCj(krok, { dlazdice = null, papir = false } = {}) {
  const v = krok?.vstup;
  if (!v || !jeVstupCj(v.typ)) return null;
  switch (v.typ) {
    case 'klik_ve_textu':
      return el('div', { class: 'cjr-nahled' }, vykresliVetu(v.text || '', {
        slovo: () => (v.cil === 'mezery' ? null : 'cjr-veta__slovo--klikaci'),
        mezera: v.cil === 'mezery' ? () => 'cjr-veta__mezera--klikaci' : null,
      }));
    case 'oznac_role': {
      const podtrzena = new Set((v.slova || []).map(Number));
      const role = Array.isArray(v.role)
        ? [nabidka(v.role)]
        : Object.entries(v.role || {}).map(([kat, moznosti]) => el('div', null, el('span', { class: 'cjr-nahled__kategorie', text: `${nazevKategorie(kat)}:` }), nabidka(moznosti)));
      return el('div', { class: 'cjr-nahled' },
        vykresliVetu(v.text || '', { slovo: (i) => podtrzena.has(i) && 'cjr-veta__slovo--podtrzene' }),
        el('p', { class: 'cjr-nahled__popisek', text: h('cj.nabidka') }), ...role);
    }
    case 'dlazdice_vice':
      return el('div', { class: 'cjr-nahled' }, nabidka(v.moznosti || []));
    case 'doplnit_pismeno': {
      const mezery = v.mezery || [];
      return el('div', { class: 'cjr-nahled' }, vykresliDoplnovacku(v.text || '', {
        pismeno: () => '', trida: () => 'cjr-mezera--prazdna',
      }).uzel, el('p', { class: 'text-tlumeny cjr-nahled__popisek', text: seznam([...new Set(mezery.map((m) => (m.moznosti || []).join(' / ')))]) }));
    }
    case 'kratky_text':
      return el('div', { class: 'cjr-nahled' },
        el('div', { class: 'cjr-pole', 'aria-hidden': 'true' }, v.napoveda_formatu ? el('span', { class: 'cjr-pole__napoveda', text: v.napoveda_formatu }) : ' '));
    case 'seradit':
      return el('div', { class: 'cjr-nahled' }, nabidka(v.polozky || []));
    case 'poslech': {
      const vnoreny = v.vnoreny_vstup;
      const vnitrni = vnoreny?.typ === 'dlazdice'
        ? (dlazdice ? dlazdice({ ...krok, vstup: vnoreny }) : nabidka((vnoreny.moznosti || []).map((m) => m.text)))
        : nahledKrokuCj({ ...krok, vstup: vnoreny }, { dlazdice, papir });
      return el('div', { class: 'cjr-nahled' },
        el('p', { class: 'cjr-nahled__poslech' }, ikona('bublina'), h('cj.co_vidi_poslech')),
        papir ? prehravac(v.audio, h('cj.papir_prehrat')) : null,
        v.otazka ? el('p', { class: 'cjr-nahled__otazka' }, renderMarkdown(v.otazka, { inline: true })) : null,
        vnitrni,
        el('details', { class: 'rozbalovaci rozbalovaci--vnorene cjr-prepis' },
          el('summary', null, ikona('oko'), h('cj.prepis_nadpis'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
          el('div', { class: 'rozbalovaci__obsah' }, el('p', { text: v.prepis || '' }))));
    }
    case 'diktat': {
      const vety = v.vety || [];
      return el('div', { class: 'cjr-nahled' },
        el('p', { class: 'cjr-nahled__poslech' }, ikona('tuzka'), h('cj.co_vidi_diktat', { pocet: vety.length })),
        papir ? el('div', { class: 'cjr-audio-seznam' },
          el('p', { class: 'text-tlumeny', text: h('cj.papir_prehrat') }),
          vety.map((veta, i) => prehravac(veta.audio, h('cj.papir_veta', { n: i + 1 })))) : null,
        textDiktatu(v));
    }
    default:
      return null;
  }
}

// ---------------------------------------------------------------------
// b) Odpověď dítěte — „Dítě odevzdalo:" u nového vstupu
// ---------------------------------------------------------------------

const radek = (stitek, obsah, trida = null) => el('div', { class: ['cjr-odpoved__radek', trida] },
  stitek ? el('strong', { class: 'cjr-odpoved__stitek', text: stitek }) : null, stitek ? ' ' : null, obsah);

/** Známé chyby (kódy) jako „Známá chyba: … Zeptejte se: „…““ — každý kód jednou, u něj slova, kterých se týká. */
function zname(chyby, kdeSlovy, { popisChyby, otazkaChyby }) {
  const kody = [...new Set((chyby || []).map((c) => c.kod).filter(Boolean))];
  return kody.map((kod) => {
    const kde = seznam([...new Set(chyby.filter((c) => c.kod === kod && c.kde !== undefined && c.kde !== null)
      .map((c) => kdeSlovy(c.kde)).filter(Boolean))]);
    const otazka = otazkaChyby?.(kod);
    return el('div', { class: 'cjr-odpoved__chyba' },
      el('p', null, el('strong', { text: h('cj.znama_chyba') }), ' ', popisChyby ? popisChyby(kod) : kod, kde ? ` (${kde})` : ''),
      otazka ? el('p', { class: 'cjr-odpoved__otazka' }, el('strong', { text: h('cj.zeptejte_se') }), ' ', otazka) : null);
  });
}

/** Diktát: věta → dítě napsalo → má být → otázka (ZADANI §6.3), jen slova, která nesedí. */
function porovnaniDiktatu(detail, { otazkaChyby }) {
  const radky = [];
  for (const v of detail?.vety || []) {
    for (const s of v.slova || []) {
      if (s.stav === 'shoda') continue;
      radky.push(el('li', { class: 'cjr-diktat-porovnani__radek' },
        el('dl', null,
          el('dt', { text: h('cj.diktat_veta') }), el('dd', { text: String(v.veta + 1) }),
          el('dt', { text: h('cj.diktat_napsalo') }), el('dd', { class: 'cjr-diktat-porovnani__dite', text: s.napsano ?? '—' }),
          el('dt', { text: h('cj.diktat_ma_byt') }), el('dd', { text: s.ocekavano ?? '—' }),
          otazkaChyby?.(s.kod) ? [el('dt', { class: 'cjr-diktat-porovnani__otazka', text: h('cj.zeptejte_se') }), el('dd', { class: 'cjr-diktat-porovnani__otazka', text: otazkaChyby(s.kod) })] : null)));
    }
  }
  if (!radky.length) return el('p', { class: 'cjr-odpoved__radek', text: h('cj.diktat_bez_chyby') });
  return el('ol', { class: 'cjr-diktat-porovnani' }, radky);
}

/**
 * Co dítě u nového vstupu odevzdalo — slovy, ne indexy. Rodič nic neopravuje: vidí, co chybí / co je navíc,
 * u známé chyby její popis a otázku ze slovníku chyb češtiny.
 * @param {object} krok
 * @param {*} hodnota  uložená hodnota odpovědi dítěte (stejná, jakou bere vyhodnotKrok)
 * @param {{popisChyby?: (kod: string) => string, otazkaChyby?: (kod: string) => (string|null), nadpis?: string|null}} [slovnik]
 *   nadpis = „Krok 2“ u úlohy s víc kroky
 * @returns {Element|null}
 */
export function odpovedDiteteCj(krok, hodnota, { popisChyby = null, otazkaChyby = null, nadpis = null } = {}) {
  if (!krok?.vstup || !jeVstupCj(krok.vstup.typ) || hodnota === null || hodnota === undefined) return null;
  if (typeof hodnota === 'object' && !Array.isArray(hodnota) && 'rodic' in hodnota) return null; // Sedí/Nesedí rodiče
  let vysl;
  try { vysl = vyhodnotKrok(krok, hodnota); } catch { return null; }
  if (vysl.neplatne) return null;
  const vnitrni = vnitrniKrok(krok);
  const v = vnitrni.vstup;
  const slovnik = { popisChyby, otazkaChyby };
  const nesedi = vysl.spravne === false;
  const detail = vysl.detail || {};
  const deti = [];
  const kdeSlovy = (kde) => {
    if (v.typ === 'oznac_role') return polozkaRoleSlovy(v, kde);
    if (v.typ === 'doplnit_pismeno') return null; // mezery ukazuje „nesedí u:" níže
    if (v.typ === 'klik_ve_textu' || v.typ === 'dlazdice_vice') return prvekSlovy(v, kde);
    return null;
  };

  switch (v.typ) {
    case 'dlazdice': { // poslech s vnořenými dlaždicemi
      const m = (v.moznosti || []).find((x) => x.id === (typeof hodnota === 'object' ? hodnota?.id : hodnota));
      if (m) deti.push(radek(h('cj.vybralo'), el('span', null, renderMarkdown(m.text, { inline: true })), nesedi && 'cjr-odpoved__radek--nesedi'));
      if (nesedi && vysl.typ_chyby) deti.push(...zname([{ kod: vysl.typ_chyby }], () => null, slovnik));
      break;
    }
    case 'klik_ve_textu':
    case 'dlazdice_vice': {
      const vybrane = Array.isArray(hodnota) ? hodnota : [];
      if (v.typ === 'klik_ve_textu') {
        const mnozina = new Set(vybrane);
        const mezery = v.cil === 'mezery';
        deti.push(radek(h('cj.vybralo'), null));
        deti.push(vykresliVetu(v.text || '', {
          slovo: (i) => !mezery && mnozina.has(i) && 'cjr-veta__slovo--vybrano',
          mezera: mezery ? (i) => mnozina.has(i) && 'cjr-veta__mezera--vybrano' : null,
        }));
      } else {
        deti.push(radek(h('cj.vybralo'), vybrane.length ? seznam(vybrane.map((x) => prvekSlovy(v, x))) : h('cj.nic')));
      }
      if (nesedi) {
        if (detail.chybi?.length) deti.push(radek(null, h('cj.chybi', { slova: seznam(detail.chybi.map((x) => prvekSlovy(v, x))) }), 'cjr-odpoved__radek--nesedi'));
        if (detail.navic?.length) deti.push(radek(null, h('cj.navic', { slova: seznam(detail.navic.map((x) => prvekSlovy(v, x))) }), 'cjr-odpoved__radek--nesedi'));
      }
      break;
    }
    case 'oznac_role': {
      const spatne = (detail.polozky || []).filter((p) => !p.ok);
      if (spatne.length) {
        deti.push(radek(null, h('cj.nesedi_u', {
          slova: seznam(spatne.map((p) => `${polozkaRoleSlovy(v, p.kategorie === null ? p.klic : `${p.klic}.${p.kategorie}`)} (${h('cj.dite_dalo', { hodnota: p.odpoved ?? h('cj.nic') })})`)),
        }), 'cjr-odpoved__radek--nesedi'));
      }
      break;
    }
    case 'doplnit_pismeno': {
      const odp = Array.isArray(hodnota) ? hodnota : [];
      const mezery = detail.mezery || [];
      const { uzel, slovoMezery } = vykresliDoplnovacku(v.text || '', {
        pismeno: (i) => odp[i] ?? '',
        trida: (i) => (mezery[i] && !mezery[i].ok ? 'cjr-mezera--nesedi' : 'cjr-mezera--dite'),
      });
      deti.push(radek(h('cj.doplnilo'), null), uzel);
      const spatne = mezery.filter((m) => !m.ok);
      if (spatne.length) deti.push(radek(null, h('cj.nesedi_u', { slova: seznam(spatne.map((m) => uvoz(slovoMezery(m.i)))) }), 'cjr-odpoved__radek--nesedi'));
      break;
    }
    case 'kratky_text':
      deti.push(radek(h('cj.napsalo'), uvoz(String(hodnota)), nesedi && 'cjr-odpoved__radek--nesedi'));
      break;
    case 'seradit':
      deti.push(radek(h('cj.seradilo'), (Array.isArray(hodnota) ? hodnota : []).join(' → '), nesedi && 'cjr-odpoved__radek--nesedi'));
      break;
    case 'diktat':
      deti.push(porovnaniDiktatu(detail, slovnik));
      break;
    default:
      return null;
  }
  // známé chyby (u diktátu je otázka přímo v porovnání po slovech)
  if (nesedi && v.typ !== 'diktat' && v.typ !== 'dlazdice') deti.push(...zname(vysl.chyby, kdeSlovy, slovnik));
  return deti.length ? el('div', { class: 'cjr-odpoved' }, nadpis ? el('p', { class: 'cjr-odpoved__krok', text: nadpis }) : null, deti) : null;
}

// ---------------------------------------------------------------------
// c) Papírový režim — „Správně je: …" + Sedí / Nesedí
// ---------------------------------------------------------------------

/**
 * Správná odpověď kroku slovy (text, ne indexy) — pro rodiče, který porovná papír dítěte.
 * @param {object} krok
 * @returns {Element}
 */
export function spravnaOdpovedCj(krok) {
  const k = vnitrniKrok(krok);
  const v = k.vstup;
  const sp = k.spravne;
  const stitek = stitekText('cj.papir_spravne');
  const obal = (...deti) => el('div', { class: 'cjr-spravne' }, ...deti);
  const volitelne = (v.volitelne || []).length
    ? el('p', { class: 'text-tlumeny', text: h('cj.volitelne', { slova: seznam(v.volitelne.map((x) => prvekSlovy(v, x))) }) }) : null;
  switch (v.typ) {
    case 'klik_ve_textu': {
      const mnozina = new Set(sp || []);
      const mezery = v.cil === 'mezery';
      return obal(
        radek(stitek, seznam((sp || []).map((x) => prvekSlovy(v, x)))),
        vykresliVetu(v.text || '', {
          slovo: (i) => !mezery && mnozina.has(i) && 'cjr-veta__slovo--spravne',
          mezera: mezery ? (i) => mnozina.has(i) && 'cjr-veta__mezera--spravne' : null,
        }),
        volitelne);
    }
    case 'dlazdice_vice':
      return obal(radek(stitek, seznam((sp || []).map((x) => prvekSlovy(v, x)))), volitelne);
    case 'oznac_role':
      return obal(radek(stitek, null),
        el('ul', { class: 'cjr-spravne__seznam' }, Object.entries(sp || {}).map(([klic, r]) => el('li', { text: `${prvekSlovy(v, klic)} = ${roleText(r)}` }))));
    case 'doplnit_pismeno':
      return obal(radek(stitek, null), vykresliDoplnovacku(v.text || '', {
        pismeno: (i) => (sp || [])[i] ?? '', trida: () => 'cjr-mezera--spravne',
      }).uzel);
    case 'kratky_text': {
      const varianty = k.varianty || [];
      return obal(radek(stitek, uvoz(sp ?? '')),
        varianty.length ? el('p', { class: 'text-tlumeny', text: h('cj.uzna_se_i', { varianty: seznam(varianty.map(uvoz)) }) }) : null);
    }
    case 'seradit':
      return obal(radek(stitek, null), el('ol', { class: 'cjr-spravne__seznam' }, (sp || []).map((x) => el('li', { text: String(x) }))));
    case 'diktat':
      return obal(radek(stitek, null), el('ol', { class: 'cjr-spravne__seznam' }, (v.vety || []).map((x) => el('li', { text: x.text }))));
    default:
      return obal();
  }
}

/**
 * Papírový režim nového vstupu: rodič nic nepřepisuje, porovná papír se „Správně je: …" a klikne Sedí / Nesedí.
 * @param {{krok: object, vybrano?: 'sedi'|'nesedi'|null, onVolba: (hodnota: {rodic: 'sedi'|'nesedi'}) => (void|Promise<void>)}} p
 * @returns {HTMLElement}
 */
export function vytvorPapirCj({ krok, vybrano = null, onVolba }) {
  const volba = vytvorSediNesedi({
    volby: [{ hodnota: 'sedi', text: h('cj.papir_sedi'), ikona: 'fajfka' }, { hodnota: 'nesedi', text: h('cj.papir_nesedi'), ikona: 'opakovat' }],
    vybrano, trida: 'cjr-papir__volba', popisek: h('cj.papir_nadpis'),
    onVolba: (hodnota) => onVolba({ rodic: hodnota }),
  });
  return el('section', { class: 'tahak__sekce cjr-papir' },
    el('h2', { class: 'tahak__nadpis' }, ikona('tuzka'), h('cj.papir_nadpis')),
    krok.popisek ? el('p', { class: 'text-tlumeny' }, renderMarkdown(krok.popisek, { inline: true })) : null,
    spravnaOdpovedCj(krok),
    volba.uzel);
}

// ---------------------------------------------------------------------
// Slovníček pojmů v úvodu lekce (zásada 9: rodič nemusí znát gramatický pojem)
// ---------------------------------------------------------------------

/**
 * „Co ta slova znamenají" z `lekce.slovnicek_pro_rodice` ({pojem: vysvětlení}). Bez slovníčku null.
 * @param {object} lekce
 * @returns {HTMLDetailsElement|null}
 */
export function vytvorSlovnicek(lekce) {
  const s = lekce?.slovnicek_pro_rodice;
  const polozky = Array.isArray(s)
    ? s.map((x) => [x?.pojem ?? x?.slovo, x?.vysvetleni ?? x?.text])
    : s && typeof s === 'object' ? Object.entries(s) : [];
  const platne = polozky.filter(([p, t]) => p && t);
  if (!platne.length) return null;
  return el('details', { class: 'rozbalovaci rozbalovaci--vnorene cjr-slovnicek' },
    el('summary', null, ikona('kniha'), h('cj.slovnicek_nadpis'), ikona('dolu', { trida: 'rozbalovaci__sipka' })),
    el('dl', { class: 'rozbalovaci__obsah cjr-slovnicek__seznam' },
      platne.map(([p, t]) => [el('dt', { text: String(p) }), el('dd', { text: String(t) })])));
}
