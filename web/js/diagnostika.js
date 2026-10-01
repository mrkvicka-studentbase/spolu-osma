// =====================================================================
// diagnostika.js — vstupní diagnostika Fáze 1 (týden 0): výpočet reportu rodiči. Čisté funkce bez DOM
// (importovatelné v Node, testy testy/diagnostika.test.js). Algoritmus 1:1 podle obsah/diagnostika-report.md §7,
// popisy chyb pro rodiče §5, názvy týdnů §6. Obrazovky: obsah/diagnostika-obrazovka.md, R37.
// Výstup jde do sezeni.souhrn ({typ: 'diagnostika', …}); texty v něm nejsou (UI je skládá z hlášek diag.*).
// =====================================================================

import { popisChyby } from './chyby.js';

/** Je lekce diagnostika? (podle obsahu `typ`; katalog bez obsahu: tyden 0 ve Fázi 1) */
export function jeDiagnostika(lekce) {
  return lekce?.typ === 'diagnostika' || lekce?.obsah?.typ === 'diagnostika';
}

/** Přehled (katalog lekcí nemá obsah): diagnostika = Fáze 1, týden 0. */
export function jeDiagnostikaVKatalogu(l) {
  return jeDiagnostika(l) || (l?.faze === 'faze1' && Number(l?.tyden) === 0);
}

/** Počet úloh s odevzdaným krokem `final` (z řádků odpovedi; bez ohledu na správnost). */
export function pocetOdevzdanych(odpovedi) {
  return new Set((odpovedi || []).filter((o) => o.krok_id === 'final').map((o) => o.uloha_id)).size;
}

/** Názvy týdnů Fáze 1 pro „Týden 2 · zlomky" (report §6, osnova §2). */
export const NAZVY_TYDNU = Object.freeze({
  1: 'početní operace a celá čísla',
  2: 'zlomky',
  3: 'desetinná čísla a poměr',
  4: 'procenta',
  5: 'jednotky a slovní úlohy',
  6: 'výrazy a rovnice',
  7: 'obvod a obsah',
  8: 'opakování a generálka',
});

/** Popisy typů chyb pro rodiče (report §5): dítě je podmět, přítomný čas, bez hodnocení. */
export const POPIS_CHYB_RODIC = Object.freeze({
  "nasobil-pred-mocninou": "Když je v příkladu mocnina i násobení, začne násobením. Mocnina má ale přednost.",
  "mocnina-jako-dvojnasobek": "Druhou mocninu počítá jako násobení dvěma: čtyři na druhou mu vyjde osm místo šestnácti.",
  "odmocnina-jako-deleni-dvema": "Odmocninu počítá jako dělení dvěma: odmocnina z osmdesáti jedné mu vyjde přes čtyřicet místo devíti.",
  "nsd-nsn-zamena": "Plete si největšího společného dělitele a nejmenší společný násobek.",
  "rozklad-bez-opakovani": "Při rozkladu čísla na prvočísla vynechá ta, která se opakují, a najde tak menšího dělitele, než má.",
  "minus-krat-minus": "Mínus krát mínus mu vychází mínus. Správně je to plus.",
  "plus-krat-minus": "Kladné číslo krát záporné mu vychází kladné. Správně je to záporné.",
  "odcitani-zaporneho": "Odečíst záporné číslo počítá jako odečíst kladné. Správně se přičítá.",
  "mocnina-zaporneho-bez-zavorky": "U „mínus pět na druhou“ bez závorky umocní i mínus. Bez závorky se umocňuje jen pětka.",
  "zaporna-mocnina-v-zavorce": "Záporné číslo v závorce na druhou nechá záporné. Správně vyjde kladné.",
  "z-celku-misto-ze-zbytku": "Počítá část z celku, i když zadání říká „ze zbytku“.",
  "zlomek-z-cisla-jen-deleni": "U „dvou pětin z čísla“ jen vydělí pěti a zapomene vynásobit dvěma.",
  "zamenil-cast-a-zbytek": "Odpoví druhou částí: místo toho, na co se úloha ptá, napíše, co zbylo (nebo naopak).",
  "smisene-nasobil-po-castech": "Smíšená čísla násobí po částech: celé s celým a zlomek se zlomkem.",
  "smisene-jako-soucin": "Smíšené číslo bere jako násobení celé části a zlomku.",
  "smisene-scital-celou-cast": "Při převodu smíšeného čísla na zlomek přičte celou část k čitateli, místo aby ji násobilo jmenovatelem.",
  "scital-pred-nasobenim": "Počítá zleva doprava a sčítá nebo odčítá dřív, než násobí a dělí.",
  "delil-bez-prevraceni": "Při dělení zlomků zapomene druhý zlomek převrátit.",
  "neprepocital-citatel": "Při sčítání a odčítání zlomků změní jmenovatel, ale čitatele nepřepočítá.",
  "o-tretinu-z-vysledku": "U „o třetinu víc“ nebo „po slevě o 20 %“ počítá část z výsledku, ne z původního čísla.",
  "jen-cast-bez-celku": "Spočítá jen tu část (třetinu, procenta) a zapomene ji k číslu přičíst nebo od něj odečíst.",
  "carka-pri-nasobeni": "Při násobení desetinných čísel dá desetinnou čárku na špatné místo.",
  "carka-pri-deleni": "Při dělení desetinným číslem posune čárku jen u jednoho z obou čísel.",
  "zlomek-jako-cislice-s-carkou": "Zlomek převádí na desetinné číslo „po číslicích“: tři čtvrtiny zapíše jako tři celé čtyři.",
  "desetinne-jako-zlomek-spatne": "Desetinné číslo převádí na zlomek se špatným jmenovatelem, například třicet pět setin jako třicet pět desetin.",
  "deleni-v-pomeru-bez-souctu-dilu": "Při dělení v poměru nedělí celkový počet dílů: u poměru čtyři ku pěti dělí dvěma místo devíti.",
  "deleni-v-pomeru-prohodil": "Při dělení v poměru spočítá obě části, ale přiřadí je obráceně.",
  "pomer-jako-hodnoty": "Čísla z poměru bere přímo jako výsledek.",
  "neprima-jako-prima": "U úloh typu „víc malířů, míň dní“ počítá, jako by víc znamenalo víc.",
  "umera-jako-soucet": "U úměry přičítá nebo odčítá rozdíl, místo aby násobilo nebo dělilo.",
  "procento-jako-desetina": "Jedno procento počítá jako desetinu čísla, ne jako setinu.",
  "zdrazeni-sleva-zamena": "Prohodí zdražení a slevu: kde má přičítat, odečítá, nebo naopak.",
  "vysledek-bez-prevodu-na-procenta": "Správně vydělí, ale výsledek nepřevede na procenta: napíše nula celá sedmdesát pět místo sedmdesáti pěti procent.",
  "obsah-po-desitkach": "Jednotky obsahu (centimetry a decimetry čtvereční) převádí po deseti místo po stu.",
  "zapomnel-prevest-jednotky": "Sčítá čísla v různých jednotkách, aniž by je převedlo na stejnou jednotku.",
  "objem-po-desitkach-nebo-stovkach": "Jednotky objemu (centimetry a decimetry krychlové) převádí po deseti nebo po stu místo po tisíci.",
  "jednotka-ve-vysledku-spatne": "Počítá dobře, ale výsledek napíše v jiné jednotce, než na kterou se úloha ptá.",
  "cas-po-stovkach": "S časem počítá, jako by hodina měla sto minut.",
  "cas-desetinne-jako-minuty": "Desetinnou část hodiny bere jako minuty: jedna a půl hodiny je pro něj hodina a padesát minut.",
  "deleni-obracene": "Dělí obráceně: menší číslo větším místo většího menším.",
  "min-a-h-smichane": "V jedné úloze míchá minuty a hodiny a nepřevede je.",
  "znamenko-pred-zavorkou": "Když je před závorkou mínus, nezmění znaménka všech členů v závorce.",
  "roznasobil-jen-prvni-clen": "Číslem před závorkou vynásobí jen první člen v závorce.",
  "scital-nestejne-cleny": "Sčítá dohromady členy, které sečíst nejdou, například číslo s x.",
  "vytknuti-minus-znamenka": "Když vytýká mínus před závorku, nezmění znaménka v závorce.",
  "vytknul-neuplne": "Při vytýkání vydělí jen jeden člen, ostatní nechá, jak byly.",
  "prevod-bez-zmeny-znamenka": "Když v rovnici převádí číslo na druhou stranu, nezmění mu znaménko.",
  "x-odecetl-koeficient": "Z rovnice „dvě x se rovná čtrnáct“ číslo před x odečte, místo aby jím dělilo.",
  "chybi-zavorka": "Při přepisu věty do výpočtu vynechá závorku, a tak počítá v jiném pořadí, než věta říká.",
  "strana-z-obvodu-bez-poloviny": "Z obvodu obdélníku dopočítá chybějící stranu, ale zapomene, že každá strana je v obvodu dvakrát.",
  "odpovida-na-jinou-otazku": "Spočítá mezivýsledek a odpoví jím, ne tím, na co se úloha ptá.",
  "pocital-se-vsemi-cisly": "Vynásobí nebo sečte všechna čísla ze zadání, aniž by si rozmyslelo, co znamenají.",
  // Fáze 2 (souhrn simulace, R38): kódy, jejichž první věta ve slovníku obsahuje vzorec nebo je příliš technická
  "dvojclen-na-druhou-bez-soucinu": "Závorku na druhou umocní po členech a vynechá prostřední dvojnásobný součin.",
  "dvojnasobny-soucin-bez-dvojky": "Při umocnění závorky zapomene prostřední člen vynásobit dvěma.",
  "ctverec-rozdilu-znamenko": "U rozdílu na druhou dá špatné znaménko u prostředního nebo posledního členu.",
  "dosadil-do-stejne-rovnice": "V soustavě dosadí vyjádřenou neznámou zpátky do stejné rovnice, takže nic nezjistí.",
  "prehledl-pravy-uhel": "Přehlédne značku pravého úhlu nebo kolmost a úhel dopočítá jinak.",
  "rada-n-krat-prvni": "U řady obrazců vynásobí první obrazec pořadím, místo aby přičítalo stejný přírůstek.",
  "rada-posun-o-jednu": "U řady obrazců započítá o jeden přírůstek víc nebo méně.",
  "vybral-mezivysledek": "U výběru z možností zvolí mezivýsledek, který je v nabídce jako past.",
  "jina-hodnota-prehledl": "Svůj výsledek v nabídce nenajde, ale místo „jiná hodnota“ vybere nejbližší číslo.",
  "tipnul-bez-vypoctu": "U výběru nebo ANO/NE tipuje, místo aby si to spočítalo.",
  "jen-vysledek-bez-postupu": "U úlohy s povinným postupem napíše jen výsledek. U zkoušky je to za 0 bodů.",
  "prepsal-do-archu-spatne": "V sešitě má správný výsledek, ale do záznamového archu ho přepíše jinak.",
  "odpoved-do-spatneho-policka": "Odpověď zapíše nebo zakřížkuje do políčka jiné podúlohy.",
  "dva-krizky": "Zakřížkuje dvě možnosti nebo opraví křížek bez zabarvení původního pole, takže odpověď neplatí.",
});

/** Lidský popis chyby pro rodiče; kód mimo tabulku → popisChyby (chyby.js / slovník). */
export function popisChybyRodic(kod) {
  return POPIS_CHYB_RODIC[kod] || popisChyby(kod);
}

// ---------------------------------------------------------------------
// Algoritmus reportu (report §7) — beze změny proti zadání
// ---------------------------------------------------------------------

export const VERZE_ALGORITMU = 1;

/** Kapitola → týden Fáze 1, lekce týdne, pilotní lekce navíc při „slabé“. Pořadí = pořadí v reportu. */
export const MAPA_KAPITOL = [
  { kapitola: 'pocetni-operace', tyden: 1, lekce: ['F1-T01-L1', 'F1-T01-L3'], pilot: ['P1'] },
  { kapitola: 'cela-cisla', tyden: 1, lekce: ['F1-T01-L2', 'F1-T01-L4'], pilot: ['P2'] },
  { kapitola: 'zlomky', tyden: 2, lekce: ['F1-T02-L1', 'F1-T02-L2', 'F1-T02-L3', 'F1-T02-L4'], pilot: ['P3', 'P4'] },
  { kapitola: 'desetinna-cisla', tyden: 3, lekce: ['F1-T03-L1', 'F1-T03-L2'], pilot: [] },
  { kapitola: 'pomer', tyden: 3, lekce: ['F1-T03-L3', 'F1-T03-L4'], pilot: [] },
  { kapitola: 'procenta', tyden: 4, lekce: ['F1-T04-L1', 'F1-T04-L2', 'F1-T04-L3', 'F1-T04-L4'], pilot: [] },
  { kapitola: 'jednotky', tyden: 5, lekce: ['F1-T05-L1', 'F1-T05-L2', 'F1-T05-L3'], pilot: [] },
  { kapitola: 'slovni-ulohy', tyden: 5, lekce: ['F1-T05-L4'], pilot: [] },
  { kapitola: 'vyrazy', tyden: 6, lekce: ['F1-T06-L1', 'F1-T06-L2'], pilot: [] },
  { kapitola: 'rovnice', tyden: 6, lekce: ['F1-T06-L3', 'F1-T06-L4'], pilot: [] },
  { kapitola: 'geometrie', tyden: 7, lekce: ['F1-T07-L1', 'F1-T07-L2', 'F1-T07-L3', 'F1-T07-L4'], pilot: [] },
];
export const TYDNY_S_DIAGNOZOU = [1, 2, 3, 4, 5, 6, 7];   // týden 8 = opakování, vždy „opakovani“
const DETEKTIVNI_KODY = ['oznacil-radek-pred-chybou', 'nasel-az-dusledek'];
const NEPOCITAT_DO_CHYB = new Set([...DETEKTIVNI_KODY, 'numericka-chyba']);

/** Stav kapitoly z počtu úloh n, odevzdaných o a správných s (celočíselně, bez zaokrouhlování). */
export function stavKapitoly(n, o, s) {
  if (n === 0) return null;
  if (o * 2 < n) return 'nezjisteno';        // odevzdáno méně než polovina úloh kapitoly
  if (s * 5 >= n * 4) return 'jista';         // ≥ 80 % všech úloh kapitoly
  if (n >= 2 && s * 2 < n) return 'slaba';    // < 50 %; u 1 úlohy nikdy „slabá“
  return 'nejista';
}

/**
 * Celkové pásmo z počtu úloh N, odevzdaných O a správných S.
 * Počítá se z odevzdaných úloh (nedokončená diagnostika se nepenalizuje dvakrát —
 * nestihnuté kapitoly už jsou „nezjisteno“); pod polovinou odevzdaných = „nezjisteno“.
 */
export function celkovePasmo(N, O, S) {
  if (O === 0 || O * 2 < N) return 'nezjisteno';
  if (S * 6 >= O * 5) return 'pevne';         // při 24 odevzdaných: 20–24
  if (S * 8 >= O * 5) return 'vetsinou';      // 15–19
  if (S * 8 >= O * 3) return 'cast';          // 9–14
  return 'zacatek';                           // 0–8
}

/**
 * @param {object} lekce     obsah JSON F1-T00-DIAG (lekce.obsah)
 * @param {Array<{id?:number, uloha_id:string, krok_id:string, spravne:boolean|null, typ_chyby:string|null, pokus:number}>} odpovedi
 *                           všechny řádky tabulky odpovedi pro sezení (libovolné pořadí)
 * @param {{rezim?: 'app'|'papir', ted?: string}} [volby]
 * @returns {object} hodnota pro sezeni.souhrn
 */
export function sestavSouhrnDiagnostiky(lekce, odpovedi, { rezim = 'app', ted = new Date().toISOString() } = {}) {
  // 1) poslední odpověď na krok final u každé úlohy
  const posledni = new Map();
  for (const o of odpovedi || []) {
    if (o.krok_id !== 'final') continue;
    const p = posledni.get(o.uloha_id);
    if (!p || o.pokus > p.pokus || (o.pokus === p.pokus && (o.id ?? 0) > (p.id ?? 0))) posledni.set(o.uloha_id, o);
  }
  const ulohy = lekce.ulohy.map((u, i) => {
    const o = posledni.get(u.id);
    const vysledek = !o || o.spravne === null || o.spravne === undefined ? 'neodevzdano' : o.spravne ? 'spravne' : 'chyba';
    return { id: u.id, poradi: i + 1, kapitola: u.kapitola, vysledek, typ_chyby: vysledek === 'chyba' ? (o.typ_chyby || null) : null };
  });

  // 2) kapitoly
  const tydenKapitoly = new Map(MAPA_KAPITOL.map((m) => [m.kapitola, m]));
  const kapitoly = [];
  for (const m of MAPA_KAPITOL) {
    const jeji = ulohy.filter((u) => u.kapitola === m.kapitola);
    const n = jeji.length;
    if (n === 0) continue;
    const o = jeji.filter((u) => u.vysledek !== 'neodevzdano').length;
    const s = jeji.filter((u) => u.vysledek === 'spravne').length;
    kapitoly.push({ kapitola: m.kapitola, tyden: m.tyden, stav: stavKapitoly(n, o, s), uloh: n, odevzdano: o, spravne: s });
  }

  // 3) týdny
  const tydny = TYDNY_S_DIAGNOZOU.map((t) => {
    const kt = kapitoly.filter((k) => k.tyden === t);
    const stavy = kt.map((k) => k.stav);
    let duraz;
    if (kt.length === 0 || stavy.every((x) => x === 'nezjisteno')) duraz = 'nezjisteno';
    else if (stavy.includes('slaba')) duraz = 'dukladne';
    else if (stavy.includes('nejista') || stavy.includes('nezjisteno')) duraz = 'normalne';
    else duraz = 'rychleji';
    const slabe = kt.filter((k) => k.stav === 'slaba').map((k) => k.kapitola);
    const lekceDuraz = duraz === 'dukladne' && slabe.length < kt.length
      ? slabe.flatMap((k) => tydenKapitoly.get(k).lekce) : [];
    const pilot = slabe.flatMap((k) => tydenKapitoly.get(k).pilot);
    return { tyden: t, duraz, kapitoly: kt.map((k) => k.kapitola), kapitoly_slabe: slabe, lekce_duraz: lekceDuraz, pilot };
  });
  tydny.push({ tyden: 8, duraz: 'opakovani', kapitoly: [], kapitoly_slabe: [], lekce_duraz: [], pilot: [] });

  // 4) nejčastější typy chyb (max 3)
  const skupiny = new Map();
  for (const u of ulohy) {
    if (u.vysledek !== 'chyba' || !u.typ_chyby || NEPOCITAT_DO_CHYB.has(u.typ_chyby)) continue;
    if (!skupiny.has(u.typ_chyby)) skupiny.set(u.typ_chyby, { typ_chyby: u.typ_chyby, pocet: 0, prvni: u.poradi, ulohy: [], tydny: [] });
    const g = skupiny.get(u.typ_chyby);
    g.pocet += 1;
    g.ulohy.push(u.id);
    const t = tydenKapitoly.get(u.kapitola)?.tyden;
    if (t && !g.tydny.includes(t)) g.tydny.push(t);
  }
  const chyby = [...skupiny.values()]
    .sort((a, b) => b.pocet - a.pocet || a.prvni - b.prvni)
    .slice(0, 3)
    .map(({ typ_chyby, pocet, ulohy: ids, tydny: t }) => ({ typ_chyby, pocet, ulohy: ids, tydny: t.sort((x, y) => x - y) }));
  const chybyNezarazene = ulohy.filter((u) => u.vysledek === 'chyba' && !u.typ_chyby).length;

  // 5) celkem
  const N = ulohy.length;
  const O = ulohy.filter((u) => u.vysledek !== 'neodevzdano').length;
  const S = ulohy.filter((u) => u.vysledek === 'spravne').length;

  return {
    typ: 'diagnostika',
    verze: VERZE_ALGORITMU,
    lekce_id: lekce.id,
    vypocteno: ted,
    rezim,
    celkem: N,
    odevzdano: O,
    spravne: S,
    neuplne: O < N,
    celkove: celkovePasmo(N, O, S),
    kapitoly,
    tydny,
    chyby,
    chyby_nezarazene: chybyNezarazene,
    ulohy: ulohy.map(({ id, kapitola, vysledek, typ_chyby }) => ({ id, kapitola, vysledek, typ_chyby })),
  };
}
