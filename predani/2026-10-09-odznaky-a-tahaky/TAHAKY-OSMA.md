# Taháky Spolu 8: co napsat (kostra je hotová, obsah chybí)

Zapsal vývojář 15. 10. 2026 při převzetí R78 + R82 ze Spolu 9. Kód je hotový, chybí jen obsah taháků.
Obsah se píše **jen** do tří souborů a kód se při tom nemění:
- `web/js/tahaky-matematika.js` (`TAHAKY_MATEMATIKA`, 10 taháků);
- `web/js/tahaky-cestina.js` (`TAHAKY_CESTINA`, 10 taháků);
- `web/js/tahaky-bonus.js` (`VYZVY` a `TAHAKY_BONUS`, 7 zlatých taháků za měsíční výzvy).

Každý záznam už má správné `id`, `predmet`, `faze`, `tyden`, `nazev` (název tématu z `obsah/hlasky.md`) a `podnazev`.
Zatím má jeden zástupný blok `{ nadpis: 'Připravujeme', text: '…' }`. Ten se nahradí 3–6 bloky obsahu.
**`id`, `predmet`, `faze`, `tyden` a `mesic` neměnit:** podle nich se tahák odemyká a pamatuje, co dítě už vidělo.
`nazev` a `podnazev` jde upravit.

## Kdy se tahák odemkne (pro představu autora)
- **Tahák tématu:** dítě dokončí všechny 4 učební lekce tématu (L1–L4). Naostro lekce, B-varianty („jiné úlohy“) a testy se nepočítají. Tahák tedy přijde zhruba v polovině tématu: po něm ještě běží naostro lekce L3N a L4N a tahák k nim slouží jako opora.
- **Zlatý tahák:** splněná měsíční výzva (počet lekcí v měsíci, oba předměty se sčítají). Od 1. 6. 2027 má všechny každý účet se sezónou.

## Pravidla formátu (kontroluje `testy/tahaky.test.js`)
- **3–6 bloků** `{ nadpis, text, priklad? }`. Test „3–6 bloků“ je teď označený jako *todo*, protože kostra má 1 blok. Až bude obsah hotový, vedoucí odstraní `todo` u testu „obsah taháků: 3–6 bloků“ a v hlavním testu formátu změní spodní mez z 1 na 3.
- **`text` a `priklad`** jsou markdown s KaTeXem (`$…$`, párové dolary). Zpětné lomítko v LaTeXu je v JS řetězci zdvojené: `'$\\frac{1}{4}$'`. Jednotky jako `$3\\ \\text{cm}^2$`, desetinná čárka `$1{,}5$`.
- **Blok** = jedno pravidlo nebo postup a k němu vzorový příklad. Nejčastější chybu napiš do příkladu jako „Pozor: …“.
- **Příklady musí být jiné než v úlohách lekcí** (tahák nesmí být klíčem k úlohám). Test strojově porovná každý výraz v `$…$` z `priklad` (aspoň 8 znaků bez mezer) s JSON lekcí tématu. Jiná čísla a jiná slova ale hlídá i autor.
- **Spolu 8 bez přijímaček:** žádné „přijímačky“ ani „CERMAT“ (test). Výjimka je jen obsah bonusu „Co mě čeká v 9. třídě“, a i tam opatrně.
- **Úroveň:** 8. třída opakuje 6.–7. ročník (`ZADANI-OSMA.md` §4). V matematice mocniny, odmocniny, Pythagorova věta a mnohočleny nejsou, v češtině ne rozbory souvětí 9. ročníku.
- **Čeština:** každé pravidlo a tvar ověřené v IJP ÚJČ, bez dublet. Pravidla o čárkách ověřit jako pravidlo, ne jen na příkladu.
- **Matematika:** všechny příklady přepočítat.
- **Tón:** tykání dítěti, krátké věty, žádné termíny, které lekce nepoužívá.
- **Vzory formátu ze Spolu 9:** `vzory-obsahu/` v této složce (obsah je pro 9. třídu, nepřebírat).

## Seznam taháků k naplnění

Sloupec „lekce“ říká, z čeho tahák čerpá: pravidla z `uvod_pravidla`, rámečky pro rodiče, kapitoly a typy chyb lekcí.
Učební lekce jsou zdroj pravidel, naostro lekce (stejné téma, o kus těžší) ukazují, co má tahák pokrýt.

### Matematika (`web/js/tahaky-matematika.js`)

| id | téma | lekce, ze kterých tahák čerpá |
|---|---|---|
| `t:matematika:osma:1` | Přirozená čísla a dělitelnost | `obsah/lekce/M8-T01-L1.json` (Pořadí operací a závorky)<br>`obsah/lekce/M8-T01-L2.json` (Dělitelnost a prvočísla)<br>`obsah/lekce/M8-T01-L3.json` (Dělitel a násobek v úlohách)<br>`obsah/lekce/M8-T01-L4.json` (Kontrola: čísla a dělitelnost)<br>naostro: `M8-T01-L1N`, `M8-T01-L2N`, `M8-T01-L3N`, `M8-T01-L4N` |
| `t:matematika:osma:2` | Desetinná čísla | `obsah/lekce/M8-T02-L1.json` (Porovnání a zaokrouhlení)<br>`obsah/lekce/M8-T02-L2.json` (Desetinná čísla: plus, mínus)<br>`obsah/lekce/M8-T02-L3.json` (Desetinná čísla: krát, děleno)<br>`obsah/lekce/M8-T02-L4.json` (Kontrola: desetinná čísla)<br>naostro: `M8-T02-L1N`, `M8-T02-L2N`, `M8-T02-L3N`, `M8-T02-L4N` |
| `t:matematika:osma:3` | Jednotky, obvod a obsah | `obsah/lekce/M8-T03-L1.json` (Převody délky a hmotnosti)<br>`obsah/lekce/M8-T03-L2.json` (Převody obsahu)<br>`obsah/lekce/M8-T03-L3.json` (Obvod a obsah obdélníku)<br>`obsah/lekce/M8-T03-L4.json` (Kontrola: jednotky a obsah)<br>naostro: `M8-T03-L1N`, `M8-T03-L2N`, `M8-T03-L3N`, `M8-T03-L4N` |
| `t:matematika:osma:4` | Zlomky I | `obsah/lekce/M8-T04-L1.json` (Krácení a rozšiřování)<br>`obsah/lekce/M8-T04-L2.json` (Porovnání zlomků)<br>`obsah/lekce/M8-T04-L3.json` (Sčítání a odčítání zlomků)<br>`obsah/lekce/M8-T04-L4.json` (Kontrola: zlomky I)<br>naostro: `M8-T04-L1N`, `M8-T04-L2N`, `M8-T04-L3N`, `M8-T04-L4N` |
| `t:matematika:osma:5` | Zlomky II | `obsah/lekce/M8-T05-L1.json` (Násobení, zlomek z čísla)<br>`obsah/lekce/M8-T05-L2.json` (Dělení zlomků)<br>`obsah/lekce/M8-T05-L3.json` (Smíšená čísla)<br>`obsah/lekce/M8-T05-L4.json` (Kontrola: zlomky II)<br>naostro: `M8-T05-L1N`, `M8-T05-L2N`, `M8-T05-L3N`, `M8-T05-L4N` |
| `t:matematika:osma:6` | Celá a racionální čísla | `obsah/lekce/M8-T06-L1.json` (Záporná čísla na ose)<br>`obsah/lekce/M8-T06-L2.json` (Plus a mínus se zápornými)<br>`obsah/lekce/M8-T06-L3.json` (Krát a děleno se zápornými)<br>`obsah/lekce/M8-T06-L4.json` (Kontrola: záporná čísla)<br>naostro: `M8-T06-L1N`, `M8-T06-L2N`, `M8-T06-L3N`, `M8-T06-L4N` |
| `t:matematika:osma:7` | Úhly, trojúhelníky, souměrnost | `obsah/lekce/M8-T07-L1.json` (Úhly v trojúhelníku)<br>`obsah/lekce/M8-T07-L2.json` (Trojúhelník a souměrnost)<br>`obsah/lekce/M8-T07-L3.json` (Obsah trojúhelníku a lichoběžníku)<br>`obsah/lekce/M8-T07-L4.json` (Kontrola: úhly a útvary)<br>naostro: `M8-T07-L1N`, `M8-T07-L2N`, `M8-T07-L3N`, `M8-T07-L4N` |
| `t:matematika:osma:8` | Poměr, měřítko, úměrnost | `obsah/lekce/M8-T08-L1.json` (Poměr a dělení v poměru)<br>`obsah/lekce/M8-T08-L2.json` (Měřítko mapy)<br>`obsah/lekce/M8-T08-L3.json` (Přímá a nepřímá úměrnost)<br>`obsah/lekce/M8-T08-L4.json` (Kontrola: poměr a úměrnost)<br>naostro: `M8-T08-L1N`, `M8-T08-L2N`, `M8-T08-L3N`, `M8-T08-L4N` |
| `t:matematika:osma:9` | Procenta a úrok | `obsah/lekce/M8-T09-L1.json` (Procento jako setina)<br>`obsah/lekce/M8-T09-L2.json` (Kolik procent, celek)<br>`obsah/lekce/M8-T09-L3.json` (Sleva, zdražení, úrok)<br>`obsah/lekce/M8-T09-L4.json` (Kontrola: procenta)<br>naostro: `M8-T09-L1N`, `M8-T09-L2N`, `M8-T09-L3N`, `M8-T09-L4N` |
| `t:matematika:osma:10` | Tělesa a slovní úlohy | `obsah/lekce/M8-T10-L1.json` (Povrch kvádru a krychle)<br>`obsah/lekce/M8-T10-L2.json` (Objem a litry)<br>`obsah/lekce/M8-T10-L3.json` (Objem a povrch hranolu)<br>`obsah/lekce/M8-T10-L4.json` (Tělesa ve slovních úlohách)<br>naostro: `M8-T10-L1N`, `M8-T10-L2N`, `M8-T10-L3N`, `M8-T10-L4N` |

### Čeština (`web/js/tahaky-cestina.js`)

| id | téma | lekce, ze kterých tahák čerpá |
|---|---|---|
| `t:cestina:osma:1` | Slovní druhy | `obsah/cestina/lekce/cj-t1-l1.json` (Ohebné slovní druhy)<br>`obsah/cestina/lekce/cj-t1-l2.json` (Neohebné slovní druhy)<br>`obsah/cestina/lekce/cj-t1-l3.json` (Všech deset druhů: rozhoduje věta)<br>`obsah/cestina/lekce/cj-t1-l4.json` (Kontrola tématu: slovní druhy)<br>naostro: `cj-t1-l1n`, `cj-t1-l2n`, `cj-t1-l3n`, `cj-t1-l4n` |
| `t:cestina:osma:2` | Podstatná jména: vzory a koncovky | `obsah/cestina/lekce/cj-t2-l5.json` (Vzory rodu mužského)<br>`obsah/cestina/lekce/cj-t2-l6.json` (Vzory rodu ženského a středního)<br>`obsah/cestina/lekce/cj-t2-l7.json` (Koncovky i/y podle vzoru)<br>`obsah/cestina/lekce/cj-t2-l8.json` (Kontrola tématu: podstatná jména)<br>naostro: `cj-t2-l5n`, `cj-t2-l6n`, `cj-t2-l7n`, `cj-t2-l8n` |
| `t:cestina:osma:3` | Přídavná jména | `obsah/cestina/lekce/cj-t3-l9.json` (Druhy přídavných jmen a stupňování)<br>`obsah/cestina/lekce/cj-t3-l10.json` (Koncovky -ý/-í tvrdých přídavných jmen)<br>`obsah/cestina/lekce/cj-t3-l11.json` (Přivlastňovací přídavná jména)<br>`obsah/cestina/lekce/cj-t3-l12.json` (Kontrola tématu: přídavná jména)<br>naostro: `cj-t3-l9n`, `cj-t3-l10n`, `cj-t3-l11n`, `cj-t3-l12n` |
| `t:cestina:osma:4` | Zájmena a číslovky | `obsah/cestina/lekce/cj-t4-l13.json` (Druhy zájmen a vztažné jenž)<br>`obsah/cestina/lekce/cj-t4-l14.json` (Tvary zájmen: mě/mně, ji/jí, něho)<br>`obsah/cestina/lekce/cj-t4-l15.json` (Číslovky: druhy a tvary dva, oba, tři, čtyři)<br>`obsah/cestina/lekce/cj-t4-l16.json` (Kontrola tématu: zájmena a číslovky)<br>naostro: `cj-t4-l13n`, `cj-t4-l14n`, `cj-t4-l15n`, `cj-t4-l16n` |
| `t:cestina:osma:5` | Slovesa: způsob, vid, rod | `obsah/cestina/lekce/cj-t5-l17.json` (Slovesný způsob a tvary bychom, byste)<br>`obsah/cestina/lekce/cj-t5-l18.json` (Slovesný vid)<br>`obsah/cestina/lekce/cj-t5-l19.json` (Rod činný a trpný)<br>`obsah/cestina/lekce/cj-t5-l20.json` (Kontrola tématu: slovesa)<br>naostro: `cj-t5-l17n`, `cj-t5-l18n`, `cj-t5-l19n`, `cj-t5-l20n` |
| `t:cestina:osma:6` | Vyjmenovaná slova | `obsah/cestina/lekce/cj-t6-l21.json` (Vyjmenovaná slova po B, L, M)<br>`obsah/cestina/lekce/cj-t6-l22.json` (Vyjmenovaná slova po P, S, V, Z)<br>`obsah/cestina/lekce/cj-t6-l23.json` (Předpona vy-/vý- a dvojice slov)<br>`obsah/cestina/lekce/cj-t6-l24.json` (Kontrola: vyjmenovaná slova)<br>naostro: `cj-t6-l21n`, `cj-t6-l22n`, `cj-t6-l23n`, `cj-t6-l24n` |
| `t:cestina:osma:7` | Shoda přísudku s podmětem | `obsah/cestina/lekce/cj-t7-l25.json` (Shoda s jedním podmětem)<br>`obsah/cestina/lekce/cj-t7-l26.json` (Shoda s více podměty)<br>`obsah/cestina/lekce/cj-t7-l27.json` (Děti, lidé, rodiče, koně)<br>`obsah/cestina/lekce/cj-t7-l28.json` (Kontrola tématu: shoda)<br>naostro: `cj-t7-l25n`, `cj-t7-l26n`, `cj-t7-l27n`, `cj-t7-l28n` |
| `t:cestina:osma:8` | Větné členy | `obsah/cestina/lekce/cj-t8-l29.json` (Přísudek slovesný a jmenný)<br>`obsah/cestina/lekce/cj-t8-l30.json` (Předmět a příslovečné určení)<br>`obsah/cestina/lekce/cj-t8-l31.json` (Přívlastek shodný a neshodný)<br>`obsah/cestina/lekce/cj-t8-l32.json` (Kontrola tématu: větné členy)<br>naostro: `cj-t8-l29n`, `cj-t8-l30n`, `cj-t8-l31n`, `cj-t8-l32n` |
| `t:cestina:osma:9` | Souvětí a čárka | `obsah/cestina/lekce/cj-t9-l33.json` (Souvětí: věta hlavní a vedlejší)<br>`obsah/cestina/lekce/cj-t9-l34.json` (Čárka v souvětí)<br>`obsah/cestina/lekce/cj-t9-l35.json` (Čárka ve větě jednoduché)<br>`obsah/cestina/lekce/cj-t9-l36.json` (Kontrola tématu: souvětí a čárka)<br>naostro: `cj-t9-l33n`, `cj-t9-l34n`, `cj-t9-l35n`, `cj-t9-l36n` |
| `t:cestina:osma:10` | Stavba slova a pravopis na švu | `obsah/cestina/lekce/cj-t10-l37.json` (Stavba slova: dvě stejné souhlásky a ú)<br>`obsah/cestina/lekce/cj-t10-l38.json` (Předpony s-, z-, vz- a předložky s, z)<br>`obsah/cestina/lekce/cj-t10-l39.json` (Skupiny bě/bje, vě/vje, mě/mně)<br>`obsah/cestina/lekce/cj-t10-l40.json` (Kontrola tématu: pravopis na švu)<br>naostro: `cj-t10-l37n`, `cj-t10-l38n`, `cj-t10-l39n`, `cj-t10-l40n` |

### Zlaté taháky za výzvy (`web/js/tahaky-bonus.js`)

| id | výzva (cíl) | název taháku | z čeho čerpat |
|---|---|---|---|
| `b:2026-11` | Listopadový start (12 lekcí) | Nejčastější chyby v matematice | typy chyb matematiky (`obsah/typy-chyb.md`), časté chyby z recenzí lekcí M |
| `b:2026-12` | Adventní výzva (12 lekcí) | Nejčastější chyby v češtině | typy chyb češtiny (`cestina/Obsah/` slovník chyb, `web/js/typy-chyb-cj.js`), korektury ÚJČ |
| `b:2027-01` | Novoroční výzva (15 lekcí) | Jak číst zadání | úlohy detektiv a hlavní úloha (M), zadání úloh ČJ; jak podtrhnout, co se ptá, jednotky |
| `b:2027-02` | Únorová výzva (12 lekcí) | Jak se učit 20 minut denně | rytmus Spolu 8 (3 + 3 lekce týdně, 20–25 min), „Dnes samo“, manuál rodiče (`obsah/hlasky.md`) |
| `b:2027-03` | Jarní výzva (16 lekcí) | Velký přehled vzorců | vzorce a pravidla témat M1–M10 (`obsah/OSNOVA-MATEMATIKA.md`) |
| `b:2027-04` | Dubnová výzva (16 lekcí) | Velký přehled pravopisu | pravopis témat ČJ1–ČJ10 (`cestina/Obsah/OSNOVA.md`), ověřit v IJP |
| `b:2027-05` | Májový finiš (8 lekcí) | Co mě čeká v 9. třídě | co přijde v 9. třídě (mocniny, Pythagorova věta, výrazy, souvětí) a jak navázat; bez konkrétních slibů |
## Výzvy (`VYZVY` v `web/js/tahaky-bonus.js`)
- Sezóna listopad 2026 – květen 2027, jedna výzva na měsíc. Cíl = počet různých lekcí dokončených v měsíci (Praha). Počítají se učební i naostro lekce obou předmětů, i zopakovaná lekce. B-varianty a testy se nepočítají.
- Plán je 6 lekcí týdně (3 M + 3 ČJ). Cíl je asi 60–70 % plánu měsíce bez prázdnin:
  - listopad 12 (začátek sezóny, úvodní testy; datum otevření zatím není rozhodnuté);
  - prosinec 12 (vánoční prázdniny);
  - leden 15;
  - únor 12 (jarní prázdniny);
  - březen 16;
  - duben 16;
  - květen 8 (lekce roku dětem, které začaly včas, končí na začátku května; počítá se i zopakovaná lekce).
- Cíl, název nebo konec výzvy (`do: 'RRRR-MM-DD'`) se mění jen tady. Kód se nemění.
