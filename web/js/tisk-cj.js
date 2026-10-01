// =====================================================================
// tisk-cj.js — tisk lekce češtiny (ZADANI-CESTINA-ZAKLADY §6.3, §6.4, §8.2 „Tisk“; FORMAT-CJ §6). Používá tisk.js.
//
// List dítěte (jako u Matematiky jen zadání `tisk.zadani`, žádné řešení):
//   - `diktat`: pokyn + u každé věty číslo a prázdné linky na psaní. Text vět na listu dítěte NIKDY není.
//   - `poslech`: pokyn „Poslechni si nahrávku (pustí ti ji rodič).“, když ho tisk.zadani nemá. Přepis ne.
//   - pojistka: odstavec tisk.zadani, který obsahuje celou větu diktátu nebo přepisu, se vynechá (chyba autora).
//   - `doplnit_pismeno`: samostatné „_“ v tisk.zadani = linka na jedno písmeno (ne podtržítko 2 mm).
//   - `klik_ve_textu` s `cil: "mezery"`: věta z `vstup.text` v tisk.zadani s většími mezerami (místo na čárku).
// List pro rodiče (samostatný poslední list A4, jen když lekce má diktát nebo poslech): text diktátu a přepis
//   nahrávky. Na obrazovce je text skrytý (tisk.html otevírá i dítě v papírovém režimu), vytiskne se vždy.
//   Netiskne se, když tisk otevřelo zařízení dítěte (role „zak“ nebo návrat na lekce.html) — rodič má text
//   i přehrávač na své stránce (rodic-cj.js). Klíč ani tahák se netisknou (stejně jako Matematika).
// Texty jsou tady (ne v obsah/hlasky.md), dokud je správce hlášek nepřevezme; klíče viz TEXTY.
// =====================================================================

import { el, param } from './ui.js';
import { ziskejRoli } from './role.js';

/** Texty tisku češtiny (kandidáti do obsah/hlasky.md, skupina „cj.tisk_*“). */
export const TEXTY = Object.freeze({
  pokyn_diktat: 'Poslouchej větu (pustí ti ji rodič) a napiš ji.',
  pokyn_poslech: 'Poslechni si nahrávku (pustí ti ji rodič).',
  veta: 'Věta',
  rodic_nadpis: 'Pro rodiče',
  rodic_nedavat: 'Nedávejte dítěti. Tento list oddělte, než dítě začne psát.',
  rodic_prehravac: 'Nahrávky pouštíte z telefonu: stránka rodiče, u úlohy je přehrávač.',
  rodic_skryto: 'Text je na obrazovce skrytý, aby ho dítě nezahlédlo. Vytiskne se jako samostatný poslední list.',
  rodic_ukazat: 'Ukázat text (jen rodič)',
  rodic_skryt: 'Skrýt text',
  diktat_nadpis: 'text diktátu',
  diktat_pokyn: 'Nečtěte dítěti, pusťte nahrávku. Jen když nejde, čtěte pomalu, každou větu dvakrát.',
  diktat_bez_interpunkce: 'Čárky a tečky neříkejte.',
  poslech_nadpis: 'co zazní v nahrávce',
  poslech_pokyn: 'Nečtěte nahlas, pusťte nahrávku.',
  uloha: 'Úloha',
});

const LINEK_NA_VETU = 2;

/** Lekce češtiny? */
export const jeCestina = (lekce) => lekce?.predmet === 'cestina';

/** Vstupy kroků úlohy daného typu. */
const vstupy = (uloha, typ) => (uloha?.kroky || []).map((k) => k.vstup).filter((v) => v?.typ === typ);

/** Text bez velikosti písmen, interpunkce a přebytečných mezer (pro porovnání vět). */
export const normalizuj = (s) => String(s ?? '').toLocaleLowerCase('cs').normalize('NFC')
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/**
 * Věty, které dítě nesmí vidět: věty diktátu a věty přepisů poslechu (jen věty aspoň o 3 slovech —
 * jednotlivá slova z nahrávky smí být v nabídce „Zakroužkuj: a) koupil …“).
 * @param {object} uloha
 * @returns {string[]}  normalizované věty
 */
export function tajneVety(uloha) {
  const texty = [
    ...vstupy(uloha, 'diktat').flatMap((v) => (v.vety || []).map((x) => x.text)),
    ...vstupy(uloha, 'poslech').flatMap((v) => String(v.prepis || '').split(/(?<=[.!?…])\s+/)),
  ];
  return [...new Set(texty.map(normalizuj).filter((t) => t.split(' ').length >= 3))];
}

/**
 * tisk.zadani pro list dítěte: vynechá odstavce s větou diktátu / přepisu (pojistka proti chybě autora),
 * samostatné „_“ nahradí značkou písmene (tisk.js ji po sazbě Markdownu vymění za linku, viz upravZadaniCj).
 * @param {object} uloha
 * @returns {string}
 */
export function zadaniCj(uloha) {
  const tajne = tajneVety(uloha);
  const odstavce = String(uloha?.tisk?.zadani ?? '').replace(/\r\n/g, '\n').split(/\n\s*\n/);
  const bezpecne = odstavce.filter((o) => {
    const n = ` ${normalizuj(o)} `;
    const unik = tajne.some((t) => n.includes(` ${t} `));
    if (unik) console.warn(`tisk-cj: ${uloha?.id}: odstavec tisk.zadani obsahuje text nahrávky, na listu dítěte se vynechá`);
    return !unik;
  });
  return bezpecne.join('\n\n').replace(/(?<!_)_(?!_)/g, ZNACKA_PISMENE);
}

/** Značka jedné mezery na písmeno (soukromý znak Unicode; Markdown ani DOMPurify ho nemění). */
const ZNACKA_PISMENE = '\uE000';

/**
 * Po sazbě tisk.zadani: značky → linka na písmeno; věta klik_ve_textu s cílem „mezery“ → širší mezery.
 * @param {HTMLElement} uzel  .tisk-uloha__zadani
 * @param {object} uloha
 */
export function upravZadaniCj(uzel, uloha) {
  const pruchod = document.createTreeWalker(uzel, NodeFilter.SHOW_TEXT);
  const uzly = [];
  while (pruchod.nextNode()) if (pruchod.currentNode.nodeValue.includes(ZNACKA_PISMENE)) uzly.push(pruchod.currentNode);
  for (const t of uzly) {
    const casti = t.nodeValue.split(ZNACKA_PISMENE);
    t.replaceWith(...casti.flatMap((c, i) => (i ? [el('span', { class: 'tisk-cj-pismeno', 'aria-label': 'doplň písmeno' }), c] : [c])));
  }
  const vetyMezer = new Set((uloha?.kroky || []).map((k) => k.vstup)
    .filter((v) => v?.typ === 'klik_ve_textu' && v.cil === 'mezery').map((v) => normalizuj(v.text)).filter(Boolean));
  if (!vetyMezer.size) return;
  for (const p of uzel.querySelectorAll('p, li')) {
    if (vetyMezer.has(normalizuj(p.textContent))) p.classList.add('tisk-cj-mezery');
  }
}

/**
 * Doplněk úlohy na listu dítěte: pokyn k poslechu (když ho zadání nemá) a linky diktátu (bez textu vět).
 * @param {object} uloha
 * @param {string} textZadani  tisk.zadani po zadaniCj
 * @returns {Array<Element>}
 */
export function doplnekUlohyCj(uloha, textZadani) {
  const maPokyn = /poslouch|poslechni|poslech/i.test(textZadani);
  const vysledek = [];
  if (vstupy(uloha, 'poslech').length && !vstupy(uloha, 'diktat').length && !maPokyn) {
    vysledek.push(el('p', { class: 'tisk-cj-pokyn', text: TEXTY.pokyn_poslech }));
  }
  for (const v of vstupy(uloha, 'diktat')) {
    const vety = v.vety || [];
    vysledek.push(el('div', { class: 'tisk-cj-diktat' },
      maPokyn ? null : el('p', { class: 'tisk-cj-pokyn', text: TEXTY.pokyn_diktat }),
      el('ol', { class: 'tisk-cj-diktat__vety' }, vety.map((_, i) => el('li', { class: 'tisk-cj-diktat__veta' },
        el('span', { class: 'tisk-cj-diktat__cislo', text: `${TEXTY.veta} ${i + 1}` }),
        el('span', { class: 'tisk-cj-diktat__linky', 'aria-hidden': 'true' },
          Array.from({ length: LINEK_NA_VETU }, () => el('span', { class: 'tisk-cj-linka' }))))))));
  }
  return vysledek;
}

/**
 * Tiskne se list pro rodiče? Ne, když tisk otevřelo zařízení dítěte (role „zak“, nebo návrat na lekce.html
 * = žák v papírovém režimu). Rodič má text a přehrávač i na své stránce.
 */
export function tisknoutProRodice() {
  if (ziskejRoli() === 'zak') return false;
  return !/^lekce\.html/i.test(param('zpet') || '');
}

/**
 * Samostatný list pro rodiče: text diktátu a přepisy poslechu po úlohách. null, když lekce nic takového nemá.
 * @param {object} lekce
 * @returns {HTMLElement|null}
 */
export function listRodiceCj(lekce) {
  const bloky = [];
  (lekce.ulohy || []).forEach((u, i) => {
    const cislo = `${TEXTY.uloha} ${i + 1}`;
    for (const v of vstupy(u, 'diktat')) {
      bloky.push(el('section', { class: 'tisk-rodic__blok' },
        el('h2', { class: 'tisk-rodic__nadpis', text: `${cislo} — ${TEXTY.diktat_nadpis}` }),
        el('p', { class: 'tisk-rodic__pokyn', text: [TEXTY.diktat_pokyn, v.hodnotit_interpunkci ? null : TEXTY.diktat_bez_interpunkce].filter(Boolean).join(' ') }),
        el('ol', { class: 'tisk-rodic__vety' }, (v.vety || []).map((x, i) => el('li', null,
          el('span', { class: 'tisk-rodic__cislo', text: `${TEXTY.veta} ${i + 1}` }), el('span', { text: x.text }))))));
    }
    const prepisy = [...new Set(vstupy(u, 'poslech').map((v) => String(v.prepis || '').trim()).filter(Boolean))];
    for (const prepis of prepisy) {
      bloky.push(el('section', { class: 'tisk-rodic__blok' },
        el('h2', { class: 'tisk-rodic__nadpis', text: `${cislo} — ${TEXTY.poslech_nadpis}` }),
        el('p', { class: 'tisk-rodic__pokyn', text: TEXTY.poslech_pokyn }),
        el('p', { class: 'tisk-rodic__prepis', text: prepis })));
    }
  });
  if (!bloky.length) return null;

  const obsah = el('div', { class: 'tisk-rodic__obsah', id: `tiskRodic-${lekce.id}` }, bloky);
  const list = el('article', { class: ['tisk-list', 'tisk-list--rodic', 'tisk-rodic--skryte'] });
  const tlacitko = el('button', {
    class: 'tlacitko tlacitko--sekundarni jen-obrazovka', type: 'button', 'aria-expanded': 'false', 'aria-controls': obsah.id,
    text: TEXTY.rodic_ukazat,
  });
  tlacitko.addEventListener('click', () => {
    const skryte = list.classList.toggle('tisk-rodic--skryte');
    tlacitko.setAttribute('aria-expanded', String(!skryte));
    tlacitko.textContent = skryte ? TEXTY.rodic_ukazat : TEXTY.rodic_skryt;
  });
  list.append(
    el('header', { class: 'tisk-zahlavi tisk-rodic__zahlavi' },
      el('div', { class: 'tisk-zahlavi__lekce' },
        `${TEXTY.rodic_nadpis} — Lekce ${lekce.id}: ${lekce.tema}`,
        el('small', { text: TEXTY.rodic_nedavat }))),
    el('p', { class: 'tisk-pokyn', text: TEXTY.rodic_prehravac }),
    el('div', { class: 'tisk-rodic__skryto jen-obrazovka' }, el('p', { text: TEXTY.rodic_skryto }), tlacitko),
    obsah,
    el('footer', { class: 'tisk-paticka' }, el('span', { text: 'studentbase.cz' }), el('span', { text: TEXTY.rodic_nadpis })));
  return list;
}
