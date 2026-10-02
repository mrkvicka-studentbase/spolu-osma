// =====================================================================
// tisk.js — tisková verze lekce na papír (web/tisk.html), viz agenti/09-tisk.md,
// kostra/04-obrazovky.md bod 8, kostra/03-format-obsahu.md (pole `tisk.zadani`).
//
// URL: tisk.html?lekce=P1[,P2…][&dite=<id-ditete>][&zpet=<stránka>][&lokalne=1]
//   Víc lekcí čárkou: list každé lekce; obě části simulace = testový sešit + vzorce + záznamový arch (tisk-f2.js).
// - H3/R29: tisk se otevírá VE STEJNÉ KARTĚ (location.href, žádné window.open — na Androidu nová karta
//   bez okna/po přesměrování opener stránky = bílá stránka). Nahoře „Zpět k lekci" (jen obrazovka) →
//   `zpet` (ověří bezpecnyZpet: jen stránka ve stejné složce), bez něj prehled.html.
//   Tlačítko tisku je v tisk.html hned; povolí se po vykreslení listu a nejpozději 2 s čekání na písma.
//   Jakákoli chyba (přihlášení, síť, CDN) = čitelná hláška, nikdy bílá stránka.
// - `lokalne=1`: JEN pro vývoj bez přihlášení. nactiLekciObsah() (obsah.js) pak čte
//   ../obsah/lekce/<id>.json místo Supabase. Navíc tady přeskakujeme chranStranku() —
//   ta by nepřihlášeného vývojáře přesměrovala na registraci. V produkci (Endora) se
//   tisk.html vždy otevírá už přihlášené (z modalu na prehled.html / rodic.html), takže
//   chranStranku() běží normálně.
// - `dite`: id dítěte pro jméno v záhlaví (viz mojeDeti() v supabase.js). Chybí-li, nebo
//   se jméno nepodaří načíst (nepřihlášeno, cizí/neplatné id, výpadek sítě), necháme
//   místo jména jen prázdný řádek — viz nactiJmenoDitete().
// =====================================================================

import { el, param, chybaStranky, chranStranku, bezpecnyZpet } from './ui.js';
import { h } from './hlasky.js';
import { vytvorObrazek } from './vstupy-f1.js';
import { jeDiagnostika } from './diagnostika.js';
import { prestavkaPo } from './diagnostika-zak.js';
import { nacistKnihovny, nactiLekciObsah, renderMarkdown, rozlozDlazdice, NAZVY_TYPU, pomuckyLekce } from './obsah.js';
import { jeSimulace } from './simulace.js';
import { archKroky, obrazekTisk, sesitSimulace, stranaVzorcu, archSimulace, lekceMaRysovani } from './tisk-f2.js';
import { jeCestina, zadaniCj, upravZadaniCj, doplnekUlohyCj, listRodiceCj, tisknoutProRodice } from './tisk-cj.js';

const RE_ZAKROUZKUJ = /zakroužkuj/i;

/**
 * Jméno dítěte pro záhlaví, nebo null (nezobrazí se — prázdný řádek k dopsání rukou).
 * @param {string|null} diteId
 * @returns {Promise<string|null>}
 */
async function nactiJmenoDitete(diteId) {
  if (!diteId) return null;
  try {
    const { mojeDeti } = await import('./supabase.js');
    const deti = await mojeDeti();
    return deti.find((d) => d.id === diteId)?.krestni_jmeno || null;
  } catch (e) {
    console.warn('tisk.js: jméno dítěte se nepodařilo načíst, nechávám prázdný řádek', e);
    return null;
  }
}

/**
 * Rámeček „Výpočet" (rozcvička 4 cm, ostatní typy 8 cm) + řádek „Výsledek: ______".
 * Výsledek se vynechává jen u rozcvičky, kde se zadání kroužkuje (obsahuje „zakroužkuj").
 * @param {{typ: string}} uloha
 * @param {string} textZadani  tisk.zadani (pro rozpoznání „zakroužkuj")
 * @returns {Array<Element|false>}
 */
function blokVypocet(uloha, textZadani) {
  const velky = uloha.typ !== 'rozcvicka' && uloha.typ !== 'diagnostika';
  const maly = uloha.typ === 'diagnostika'; // diagnostika: 24 úloh, menší místo na výpočet (blok ≈ 2 strany A4)
  // Řádek „Výsledek:" jen když ho zadání nemá samo (tisk.zadani často končí „Výsledek: ______").
  const vynechatVysledek = (uloha.typ === 'rozcvicka' && RE_ZAKROUZKUJ.test(textZadani))
    || /výsledek/i.test(textZadani) || /_{3,}/.test(textZadani);
  return [
    el('div', { class: ['tisk-vypocet', velky && 'tisk-vypocet--velky', maly && 'tisk-vypocet--diag'] }),
    !vynechatVysledek && el('div', { class: 'tisk-vysledek' }, 'Výsledek:'),
  ];
}

const RE_MAT = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;
const RE_VOLBA = /(^|\s)([a-f])\)\s/g;

/**
 * Odstavec s volbami „… — a) … b) … c) …" → {kmen, volby}; jinak null. Značky a) b) c) se hledají
 * jen mimo matematiku `$…$`, musí jít po sobě od „a" a být aspoň dvě.
 * @param {string} odstavec
 * @returns {{kmen: string, volby: string[]}|null}
 */
export function rozdelVolby(odstavec) {
  const maska = odstavec.replace(RE_MAT, (m) => '\u0001'.repeat(m.length));
  const znacky = [...maska.matchAll(RE_VOLBA)].map((m) => ({ pismeno: m[2], od: m.index + m[1].length }));
  if (znacky.length < 2 || znacky.some((z, i) => z.pismeno !== 'abcdef'[i])) return null;
  const kmen = odstavec.slice(0, znacky[0].od).trim().replace(/\s*[—–-]\s*$/, '');
  const volby = znacky.map((z, i) => odstavec.slice(z.od, znacky[i + 1]?.od ?? odstavec.length).trim());
  return { kmen, volby };
}

/** Zadání pro tisk: odstavce Markdownu; volby a) b) c) každá na vlastním řádku. */
function zadaniTisk(text) {
  const uzel = el('div', { class: 'tisk-uloha__zadani' });
  let blok = []; // po sobě jdoucí odstavce bez voleb → jeden Markdown (číslované řádky „1. řádek" zůstanou 1–4)
  // F1 poradi: `\op{id}{znak}` v tisk.zadani → kroužek nad znakem (CSS [data-op]) + pokyn nad výrazem (osnova §6.3)
  const vyprazdni = () => { if (blok.length) uzel.append(renderMarkdown(blok.join('\n\n'), { poradi: true })); blok = []; };
  for (const odstavec of String(text).replace(/\r\n/g, '\n').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)) {
    const v = rozdelVolby(odstavec);
    // „2) Zapiš …" je podúloha, ne seznam: marked by z „N)" udělal <ol> (styl Petrova výpočtu, číslo 1.)
    if (!v) {
      if (/\\op\{/.test(odstavec)) blok.push(`*${h('oba.poradi_tisk')}*`);
      blok.push(odstavec.replace(/^(\d+)\)(?=\s)/, '$1\\)'));
      continue;
    }
    vyprazdni();
    if (v.kmen) uzel.append(el('p', null, renderMarkdown(v.kmen, { inline: true, poradi: true })));
    uzel.append(el('ul', { class: 'tisk-volby' }, v.volby.map((t) => el('li', null, renderMarkdown(t, { inline: true, poradi: true })))));
  }
  vyprazdni();
  // E1: volba ani hlavní výraz nikdy nepřetečou šířku listu — široký vzorec se zmenší (každý zvlášť)
  rozlozDlazdice(uzel, { vyraz: '.tisk-volby > li, .katex-display, p', sloupce: false, jednotne: false });
  return uzel;
}

/** Jedna úloha na listu: číslo, typ (NAZVY_TYPU), zadání (Markdown + KaTeX), místo na výpočet. */
function blokUlohy(uloha, index, lekce = null) {
  // Čeština (tisk-cj.js): tisk.zadani bez vět diktátu/přepisu (pojistka), „_" = linka na písmeno
  const cj = jeCestina(lekce);
  const textZadani = cj ? zadaniCj(uloha) : (uloha.tisk?.zadani ?? '');
  // Fáze 2 (osnova F2 §3.3, pilíř 8): u každého kroku rámeček ve stylu záznamového archu místo řádku „Výsledek:"
  const f2 = lekce?.faze === 'faze2';
  // Čeština: bez rámečku „Výpočet" a řádku „Výsledek:" — tisk.zadani má vlastní „Podtrhni… / Zakroužkuj…" (FORMAT-CJ §6)
  const vypocet = cj ? [] : blokVypocet(uloha, textZadani);
  const zadani = zadaniTisk(textZadani);
  if (cj) upravZadaniCj(zadani, uloha);
  return el('section', { class: ['tisk-uloha', f2 && 'tisk-uloha--f2'] },
    el('div', { class: 'tisk-uloha__hlavicka' },
      el('span', { class: 'tisk-uloha__cislo', text: String(index + 1) }),
      uloha.typ === 'diagnostika' ? null : el('span', { class: 'tisk-uloha__typ', text: NAZVY_TYPU[uloha.typ] || uloha.typ })),
    zadani,
    f2 ? obrazekTisk(uloha) : vytvorObrazek(uloha, { tisk: true }), // F1: max 60 mm; F2: obrazek_mm
    // čeština: pokyn k poslechu, linky diktátu (text vět dítě nikdy nevidí — je jen na listu pro rodiče)
    cj ? doplnekUlohyCj(uloha, textZadani) : null,
    ...(f2 ? [vypocet[0], archKroky(uloha)] : vypocet));
}

/** List A4 jedné lekce (ovládání nad listem je v tisk.html). */
function vytvorList(lekce, jmeno) {
  return (
    el('article', { class: 'tisk-list' },
      el('header', { class: 'tisk-zahlavi' },
        el('div', { class: 'tisk-zahlavi__lekce' },
          jeDiagnostika(lekce) ? `Spolu 8 — ${lekce.tema}` : `Spolu 8 — Lekce ${lekce.id}: ${lekce.tema}`,
          el('small', { text: `Doporučený čas ${lekce.cas_min ?? 20} min` })),
        el('div', { class: 'tisk-zahlavi__jmeno' },
          'Jméno: ', jmeno ? el('strong', { text: jmeno }) : el('span', { class: 'tisk-linka' }),
          el('br'), 'Datum: ', el('span', { class: 'tisk-linka' }))),
      // H2: řádek „Připrav si: sešit, propiska, tužka" pod záhlavím
      el('p', { class: 'tisk-pripravit', text: h('oba.pripravit_tisk', { pomucky: pomuckyLekce(lekce).join(', ') }) }),
      // R46: rýsovací pole 1 : 1 jen při tisku ve skutečné velikosti (kontrolní úsečka 5 cm je u pole)
      lekceMaRysovani(lekce) ? el('p', { class: 'tisk-pokyn tisk-pokyn--meritko', text: h('f2.tisk_100') }) : null,
      lekce.ulohy.map((u, i) => [
        blokUlohy(u, i, lekce),
        // diagnostika: předěl po 12. úloze + nová strana (obrazovka §5)
        jeDiagnostika(lekce) && i === prestavkaPo(lekce.ulohy.length) - 1 && lekce.ulohy.length > prestavkaPo(lekce.ulohy.length)
          ? el('div', { class: 'tisk-predel' }, h('diag.tisk_prestavka')) : null,
      ]),
      el('footer', { class: 'tisk-paticka' },
        el('span', { text: 'studentbase.cz' }),
        el('span', { text: 'výsledky zapisuje rodič do telefonu' }))));
}

/**
 * Vykreslí listy do uzlu: `?lekce=A,B` s oběma částmi simulace = testový sešit (zadání 1–16) + strana se vzorci
 * + záznamový arch (osnova F2 §3.3, klíč se netiskne); jiné lekce = list každé lekce za sebou.
 */
function vykresliListy(uzel, lekce, jmeno) {
  const simulace = lekce.length >= 1 && lekce.every(jeSimulace);
  document.title = simulace
    ? `Tisk — Simulace ${lekce[0].simulace?.cislo ?? ''}`
    : `Tisk — ${lekce.map((l) => `${l.id}: ${l.tema}`).join(', ')}`;
  uzel.removeAttribute('aria-busy');
  if (simulace) {
    const casti = [...lekce].sort((a, b) => (a.simulace?.cast ?? 0) - (b.simulace?.cast ?? 0));
    uzel.replaceChildren(sesitSimulace(casti, { zadani: zadaniTisk, jmeno }), stranaVzorcu(), archSimulace(casti, { jmeno }));
    pokynNadListem(h('f2.tisk_100')); // arch má kontrolní úsečku 5 cm a rýsovací pole 1 : 1
    return;
  }
  // čeština: list pro rodiče (text diktátu, přepis poslechu) až za všemi listy dítěte, vždy na novém listu A4
  const proRodice = lekce.some(jeCestina) && tisknoutProRodice() ? lekce.filter(jeCestina).map(listRodiceCj) : [];
  uzel.replaceChildren(...lekce.map((l) => vytvorList(l, jmeno)), ...proRodice.filter(Boolean));
  // R46: pokyn k tisku 100 % i nad listem (jen obrazovka), než rodič klepne na Vytisknout
  if (lekce.some(lekceMaRysovani)) pokynNadListem(h('f2.tisk_100'));
}

function pokynNadListem(text) {
  const ovladani = document.getElementById('ovladani');
  if (!ovladani || document.getElementById('tiskPokyn100')) return;
  ovladani.append(el('p', { class: 'tisk-ovladani__pokyn', id: 'tiskPokyn100', role: 'note', text }));
}

const MAX_CEKANI_PISMA_MS = 2000;
const cekej = (ms) => new Promise((splnit) => { setTimeout(splnit, ms); });

/**
 * „Zpět k lekci" (H3): `?zpet=` (rodic.html / lekce.html v režimu papír, prehled.html). Bez parametru
 * prehled.html. Odkaz je v tisk.html; tady jen cíl a text.
 */
function napojZpet() {
  const odkaz = document.getElementById('tiskZpet');
  const text = document.getElementById('tiskZpetText');
  const zpet = bezpecnyZpet(param('zpet'));
  if (!odkaz) return;
  odkaz.href = zpet;
  if (text) text.textContent = /^(rodic|lekce)\.html/.test(zpet) ? h('oba.tisk_zpet_lekce') : h('oba.tisk_zpet_prehled');
}

async function hlavni() {
  window.spoluTiskBezi = true; // pojistka v tisk.html (modul se spustil)
  const uzel = document.getElementById('obsah');
  const tlacitkoTisk = document.getElementById('tiskTlacitko');
  napojZpet();
  tlacitkoTisk?.addEventListener('click', () => {
    try { window.print(); } catch (e) { console.error(e); chybaStranky(uzel, h('chyba.tisk')); }
  });

  // Pojistka: kdyby se něco zaseklo (síť, CDN), za 15 s místo točítka hláška — nikdy bílá stránka.
  let hotovo = false;
  const hlidac = setTimeout(() => { if (!hotovo) chybaStranky(uzel, h('chyba.tisk_nenacteno')); }, 15000);

  try {
    if (param('lokalne') !== '1') {
      // Stránka je za přihlášením jako ostatní (viz ui.js). Přeskakuje se JEN v lokálním
      // vývoji (?lokalne=1) — tam obsah stejně nejde z DB, takže RLS/session nejsou potřeba.
      const stav = await chranStranku();
      if (!stav) { hotovo = true; clearTimeout(hlidac); return; } // chranStranku už přesměrovává
    }

    const lekceId = param('lekce');
    if (!lekceId) throw new Error('V adrese chybí lekce (např. ?lekce=P1).');

    // ?lekce=A,B: víc lekcí najednou (simulace = obě části, osnova F2 §3.3)
    const idLekci = lekceId.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
    const [lekce, jmeno] = await Promise.all([
      Promise.all(idLekci.map((id) => nactiLekciObsah(id))),
      nactiJmenoDitete(param('dite')),
      nacistKnihovny(),
    ]);
    vykresliListy(uzel, lekce, jmeno);
    hotovo = true;
    clearTimeout(hlidac);
    // KaTeX je vykreslený synchronně výše; na písma čekáme nejvýš 2 s, pak tisk povolíme tak jako tak
    await Promise.race([document.fonts?.ready ?? Promise.resolve(), cekej(MAX_CEKANI_PISMA_MS)]);
    if (tlacitkoTisk) tlacitkoTisk.disabled = false;
  } catch (e) {
    hotovo = true;
    clearTimeout(hlidac);
    console.error(e);
    chybaStranky(uzel, e?.message ? `${h('chyba.tisk_nenacteno')} (${e.message})` : h('chyba.tisk_nenacteno'));
  }
}

hlavni();
