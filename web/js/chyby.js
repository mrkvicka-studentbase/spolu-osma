// =====================================================================
// chyby.js — lidský popis kódu typ_chyby (R9, R34): admin (statistiky, detail) i rodič („Co dítě odevzdalo").
// Čisté funkce bez DOM.
// =====================================================================

import { POPISY_TYPU_CHYB, DETEKTIVNI_KODY } from './typy-chyb.js';
import { TYPY_CHYB_CJ } from './typy-chyb-cj.js';

// ---------------------------------------------------------------------
// Ruční krátké popisy typů chyb (dřív v admin.js). Kód, který tu chybí, vezme první větu ze slovníku
// obsah/typy-chyb.md (generovaný web/js/typy-chyb.js). Na hostingu složka obsah/ není (R9).
// Detektivní kódy (oddíl B) se ve statistikách/detailu zobrazují ZVLÁŠŤ (ROZHODNUTI.md R16, typy-chyb.md).
// ---------------------------------------------------------------------

const POPIS_CHYB = Object.freeze({
  // A — Pořadí operací
  'scital-pred-nasobenim': 'Sčítal/odčítal dřív, než násobil/dělil',
  'poradi-nezalezi': 'Myslí si, že na pořadí operací nezáleží',
  'ignoroval-zavorku': 'Nespočítal závorku jako první',
  'umocnil-jen-cast-zavorky': 'Umocnil jen část závorky',
  'nasobil-pred-mocninou': 'Násobil dřív, než umocnil',
  'mocnina-jako-dvojnasobek': 'Druhou mocninu spočítal jako násobení dvěma',
  'mocnina-na-cely-vyraz': 'Umocnil víc, než k čemu exponent patří',
  'chybi-zavorka': 'Při přepisu slov do výrazu vynechal závorku',
  'kolikrat-jako-o-kolik': 'Místo „kolikrát" (dělení) počítal „o kolik" (odčítání)',
  'o-kolik-jako-kolikrat': 'Místo „o kolik" (rozdíl) počítal „kolikrát" (podíl)',
  'deleni-obracene': 'Vydělil v opačném pořadí (menší větším)',
  'zapomnel-odmocninu': 'Vynechal odmocninu, počítal s číslem pod ní',
  'odmocnina-jako-deleni-dvema': 'Druhou odmocninu spočítal jako dělení dvěma',
  'odmocnina-jen-z-casti': 'Odmocnil jen část výrazu pod odmocninou',
  'odmocnina-po-clenech': 'Odmocnil součet/rozdíl po členech',
  'numericka-chyba': 'Obecná chyba ve výpočtu (postup správně)',
  // C — Celá čísla
  'minus-krat-minus': 'Součin/podíl dvou záporných dal záporný výsledek',
  'plus-krat-minus': 'Součin kladného a záporného dal kladný výsledek',
  'pravidlo-znamenek-pri-scitani': 'Použil pravidlo znamének u násobení i při sčítání',
  'odcitani-zaporneho': 'Odečtení záporného čísla počítal jako odečtení kladného',
  'posun-spatnym-smerem': 'Na číselné ose/teploměru se posunul opačným směrem',
  'mensi-minus-vetsi': 'Od menšího odečetl větší a zapomněl minus',
  'ztratil-znamenko': 'Postup správně, ale ztratil znaménko minus',
  'znamenko-pred-zavorkou': 'Minus před závorkou změnil jen u části členů',
  'mocnina-zaporneho-bez-zavorky': 'U −a² umocnil i znaménko minus',
  'zaporna-mocnina-v-zavorce': 'U (−a)² nechal výsledek záporný',
  'porovnani-zapornych': 'Záporné číslo s větší absolutní hodnotou považuje za větší',
  'absolutni-hodnota-zaporna': 'Absolutní hodnotu záporného čísla nechal zápornou',
  // D — Zlomky
  'scital-citatele-i-jmenovatele': 'Sečetl/odečetl zvlášť čitatele a zvlášť jmenovatele',
  'neprepocital-citatel': 'Našel společného jmenovatele, ale nerozšířil čitatele',
  'nezkratil': 'Výsledek správně, ale ne v základním tvaru',
  'upravil-jen-cast-zlomku': 'Při krácení/rozšiřování upravil jen čitatele nebo jen jmenovatele',
  'pricetl-misto-nasobeni': 'Při krácení/rozšiřování přičetl/odečetl místo násobení/dělení',
  'kratil-ruznym-cislem': 'Čitatele a jmenovatele vydělil dvěma různými čísly',
  'kratil-jen-castecne': 'Krátil, ale ne největším společným dělitelem',
  'kratil-pres-scitani': 'Krátil jednotlivé sčítance, ne celý čitatel',
  'cele-cislo-do-citatele-i-jmenovatele': 'Celé číslo násobil s čitatelem i jmenovatelem',
  'desetinne-jako-zlomek-spatne': 'Chybný převod desetinného čísla na zlomek (nebo naopak)',
  'porovnal-podle-jmenovatele': 'Zlomky porovnal jen podle jmenovatele',
  'delil-bez-prevraceni': 'Při dělení zlomků nepřevrátil (dělil čitatel čitatelem, jmenovatel jmenovatelem)',
  'prevratil-prvni': 'Při dělení převrátil první zlomek (dělence) místo druhého',
  'prevratil-oba': 'Při dělení převrátil oba zlomky',
  'spolecny-jmenovatel-pri-nasobeni': 'Při násobení zlomků zbytečně hledal společného jmenovatele',
  'mocnina-jen-citatele': 'Umocnil jen čitatele (nebo jen jmenovatele)',
  'slozeny-zlomek-prevratil-horni': 'U složeného zlomku převrátil horní zlomek místo dolního',
  'smisene-scital-celou-cast': 'Při převodu smíšeného čísla přičetl celou část místo násobení',
  'smisene-zmenil-jmenovatel': 'Při převodu smíšeného čísla změnil jmenovatel',
  'smisene-nasobil-po-castech': 'Smíšená čísla násobil po částech (celé × celé, zlomek × zlomek)',
  'znamenko-zlomku': 'Ztratil nebo přesunul znaménko minus u zlomku',
});

/** Detektivní kódy (typy-chyb.md, oddíl B) — dovednost najít chybu, ne matematická chyba. Zvlášť ve statistikách. */
const POPIS_CHYB_DETEKTIV = Object.freeze({
  'oznacil-radek-pred-chybou': 'Označil řádek PŘED chybou (ten je správně)',
  'nasel-az-dusledek': 'Ukázal až na důsledek chyby, ne na místo, kde vznikla',
});

/** @param {string|null} kod @returns {boolean} */
export function jeDetektivniChyba(kod) {
  return Boolean(kod) && (Object.prototype.hasOwnProperty.call(POPIS_CHYB_DETEKTIV, kod) || DETEKTIVNI_KODY.includes(kod));
}

/**
 * Lidský popis typu chyby. Neznámý kód se zobrazí syrový (dle zadání).
 * @param {string|null} kod
 * @returns {string}
 */
export function popisChyby(kod) {
  if (!kod) return '—';
  if (POPIS_CHYB_DETEKTIV[kod]) return `${POPIS_CHYB_DETEKTIV[kod]} (detektivní dovednost)`;
  return POPIS_CHYB[kod] || POPISY_TYPU_CHYB[kod] || popisChybyCj(kod) || kod;
}

// ---------------------------------------------------------------------
// Čeština (cestina/Obsah/TYPY-CHYB.md → generovaný web/js/typy-chyb-cj.js): popis i otázka pro rodiče.
// Diktát skládá kód s jevem: `diktat-pravopis-<kód>` → popis i otázka jevu.
// ---------------------------------------------------------------------

const PREFIX_DIKTAT = 'diktat-pravopis-';

/** Záznam slovníku češtiny {popis, otazka} (u diktat-pravopis-<kód> záznam jevu), nebo null. */
function typChybyCj(kod) {
  if (!kod) return null;
  const has = (k) => Object.prototype.hasOwnProperty.call(TYPY_CHYB_CJ, k);
  if (has(kod)) return TYPY_CHYB_CJ[kod];
  if (kod.startsWith(PREFIX_DIKTAT) && has(kod.slice(PREFIX_DIKTAT.length))) return TYPY_CHYB_CJ[kod.slice(PREFIX_DIKTAT.length)];
  return null;
}

function popisChybyCj(kod) {
  const typ = typChybyCj(kod);
  if (!typ) return null;
  if (!kod.startsWith(PREFIX_DIKTAT) || Object.prototype.hasOwnProperty.call(TYPY_CHYB_CJ, kod)) return typ.popis;
  return `Pravopis: ${typ.popis.charAt(0).toLocaleLowerCase('cs')}${typ.popis.slice(1)}`;
}

/**
 * Otázka pro rodiče ke kódu chyby (slovník češtiny; u diktátu otázka jevu). Matematika otázky nemá → null.
 * Otázka je přímá řeč „…“ a nikdy neříká správnou odpověď (TYPY-CHYB.md).
 * @param {string|null} kod
 * @returns {string|null}
 */
export function otazkaChyby(kod) {
  return typChybyCj(kod)?.otazka || null;
}
