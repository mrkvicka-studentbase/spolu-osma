# Téma 2 — Podstatná jména: B-varianty (Spolu 8)

Verze 1.0, 9. 10. 2026. Rozpis B-variant lekcí tématu 2 (ZADANI-OSMA §9 bod 4: po **červeném** semaforu aplikace nabídne stejnou lekci s jinými slovy a větami). Soubor sdílejí dva autoři: každý píše jen do svého oddílu. **Pro:** vedoucího (schválení), korektora (Ověření ÚJČ, Nejistoty), autora nahrávek (Nahrávky ke sloučení do `AUDIO.md`).

## B-varianty učebních lekcí (l5b–l8b)

Autor: metodik a autor úloh ČJ Spolu 8, 9. 10. 2026. Lekce: `obsah/cestina/lekce/cj-t2-l5b.json` … `cj-t2-l8b.json`. Tabulky níže jsou vygenerované z JSON (indexy, správné odpovědi a kódy souhlasí); texty taháku, semaforu a tisku jsou jen v JSON.

### Společné pro l5b–l8b

- **Hlavička:** `id` = id hlavní lekce + `b`; `tema`, `kapitola` (`podstatna-jmena`), `tyden` 2, `poradi`, `faze` `osma`, `cas_min` 25 stejné jako hlavní lekce. Úlohy `<id>-U1` … `-U5`, poslední krok `final`. `uvod_pro_rodice` jednou větou říká, že jde o opakování po červeném semaforu. `uvod_pravidla` jako u hlavní lekce (u L6b třetí řádek `bez kuřete × bez moře` místo příkladu *kotě* z hlavní lekce); žádný řádek neobsahuje hodnocené slovo B-varianty.
- **Struktura 1:1 s hlavní lekcí** (kontrolováno skriptem): stejné typy úloh, počet kroků, `vstup.typ` v každém kroku, počet a pořadí dlaždic (správná na stejné pozici), stejné kódy na stejných volbách, stejný počet mezer, označených slov a rolí, stejné pozice známých chyb v doplňovačkách, stejné vzory odpovědí (L7b U2 i, y, y, y, i, i; L8b U5 i, y, i, i, i, y, y, i, y, y …). Poslech v L5b a L6b U3 (2 otázky, `max_prehrani: 0`), L8b U5 `tydenni: true` + stejné `semafor_tydne`. Diktát v tématu 2 není.
- **Stejná obtížnost, jiná slova:** stejné pasti (jméno na *-a* a *-e* rodu mužského, životnost u rostliny, slovo slyšené v jiném pádě, *-iště* × kuře, *-ost* × píseň, životná jména 1. × 4. pád, 7. p. vzorů hrad, stroj nebo muž, kost). Žádné hodnocené slovo ani věta z `cj-t2-l5` … `l8` ani z naostro dvojic `l5n` … `l8n` (korektura 12. 10. překryv ověřila skriptem proti hodnoceným místům všech osmi lekcí: žádný). Mezi B-variantami se několik slov opakuje (např. *šachista*, *policista*, *pomeranč*, *kachně*, *tábořiště*, *sob*, *sup*, *hýl*, *vychovatel*); jsou to různé lekce.
- **Hranice tématu (OSNOVA §6, §16):** v mezerách jen *i × y* po obojetné souhlásce; dubleta *-i/-ové* (*sobi/sobové, supi/supové, hýli/hýlové, kozli/kozlové, pudli/pudlové*) mezeře nevadí. Slova kolísající mezi pán a muž (*rorýs*), jména vzoru muž na *-z* (*šimpanz*: šimpanze) a jména kolísající mezi hrad a stroj (*kotel*: kotle i kotly, 7. p. mn. kotli i kotly) se nehodnotí. Jména rodu ženského na souhlásku jen bez kolísání mezi *píseň* a *kost* (ÚJČ id=251: *-ost* = skupina A, *láhev, obec* = skupina H, *předsíň* má v tabulce tvarů jen *předsíně*); vyřazeny *zeď, ves* (skupiny B, E). Slovesa u doplňovaných jmen jen v přítomném nebo budoucím čase.
- **„Dnes samo“:** otázky taháku neprozrazují odpověď ani chybné slovo detektiva; přepis nahrávky není v zadání, tisku, popisku ani otázce.
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv; Honzík se nepoužívá.
- **Kódy chyb:** jen z `TYPY-CHYB.md`, stejná sada jako hlavní lekce.

### cj-t2-l5b — Vzory rodu mužského (B-varianta, `poradi` 1)

**Cíl:** Dítě testem „vidím ___“ rozhodne, jestli je jméno rodu mužského životné, a podle 1. a 2. pádu ho přiřadí k jednomu ze šesti vzorů, i když končí na -a (gymnasta) nebo na -e (tvůrce).

**Platí:** `Životné: vidím pána, ne pán` · `2. p.: pána, hradu, muže, stroje` · `-a předseda · -e soudce`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Ledoborec ze společného základu (Z2): určit pád jména rodu mužského ve větě otázkou ze slova ve větě; pasti 1. × 4., 2. × 4., 2. × 6. a 4. × 7. pád. | k1 | `dlazdice` | 1. pád | 4. pád → `pad-4-za-1` |
|  |  | k2 | `dlazdice` | 4. pád | 1. pád → `pad-1-za-4` · 2. pád → `pad-2-za-4` |
|  |  | k3 | `dlazdice` | 6. pád | 2. pád → `pad-2-za-6` |
|  |  | final | `dlazdice` | 7. pád | 4. pád → `pad-4-za-7` |
| U2 nova (5) | Přiřadit ke vzoru čtyři jména rodu mužského, u kterých se vzor plete: řidič (muž), měsíc (stroj), gymnasta (předseda) a tvůrce (soudce). | k1 | `dlazdice` | muž | pán → `vzor-pan-za-muz` · soudce → `vzor-muz-za-soudce` |
|  |  | k2 | `dlazdice` | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k3 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` |
|  |  | final | `dlazdice` | soudce | muž → `vzor-muz-za-soudce` |
| U3 nova (5) | Určit vzor jmen rodu mužského, která dítě jen slyší v jiném pádě (hrdinou, kamaráda): samo si je vrátí do 1. pádu. | k1 | `poslech` | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | final | `poslech` | pán | — |
| U4 detektiv (5) | Najít u Petra jméno rodu mužského na -a, které dal ke vzoru pán (šachista), a vybrat správný vzor. | k1 | `klik_ve_textu` | *Šachista* (0) | klik na *hasiči* / *čaj* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | předseda | muž → `detektiv-oprava-jine-chyby` · stroj → `detektiv-oprava-jine-chyby` · hrad → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor pěti jmen rodu mužského v textu: zachránce (soudce), kluk (pán), kaštan (hrad, neživotný), policista (předseda), pomeranč (stroj). | final | `oznac_role` | *Zachránce* (0) soudce · *kluka* (4) pán · *kaštanem* (7) hrad · *policista* (9) předseda · *pomeranč* (13) stroj | *kaštanem* pán → `zivotnost-podle-vyznamu` · *policista* pán → `vzor-pan-za-predseda` · *Zachránce* muž → `vzor-muz-za-soudce` · *pomeranč* hrad → `vzor-hrad-za-stroj` |

Texty ke klikání a označování: U4 k1: „Šachista nalil hasiči čaj.“ · U5 final: „Zachránce na koupališti uviděl kluka pod vysokým kaštanem. Jeden policista mu potom přinesl pomeranč z bufetu.“

### cj-t2-l6b — Vzory rodu ženského a středního (B-varianta, `poradi` 2)

**Cíl:** Dítě přiřadí jméno rodu ženského ke vzoru žena, růže, píseň nebo kost a jméno rodu středního ke vzoru město, moře, kuře nebo stavení podle 1. a 2. pádu (bez písně × bez kosti, bez kuřete × bez moře).

**Platí:** `Vzor podle 1. a 2. pádu (bez ___)` · `píseň – písně · kost – kosti` · `bez kuřete × bez moře`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat vzory rodu mužského z lekce 5 na nových slovech: lyžař (muž), policista (předseda), pomeranč (stroj), tvůrce (soudce). | k1 | `dlazdice` | muž | pán → `vzor-pan-za-muz` · soudce → `vzor-muz-za-soudce` |
|  |  | k2 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` |
|  |  | k3 | `dlazdice` | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | final | `dlazdice` | soudce | muž → `vzor-muz-za-soudce` |
| U2 nova (5) | Přiřadit ke vzorům žena, růže, píseň, kost čtyři jména rodu ženského: kapuce (růže), lenost (kost), láhev (píseň), kniha (žena). | k1 | `dlazdice` | růže | píseň → `vzor-ruze-za-pisen` |
|  |  | k2 | `dlazdice` | kost | píseň → `vzor-pisen-za-kost` |
|  |  | k3 | `dlazdice` | píseň | kost → `vzor-pisen-za-kost` |
|  |  | final | `dlazdice` | žena | — |
| U3 nova (5) | Určit vzor dvou jmen rodu středního, která dítě jen slyší: listí (stavení) a kachnětem (kuře, slyší v 7. pádě). | k1 | `poslech` | stavení | moře → `vzor-more-za-staveni` |
|  |  | final | `poslech` | kuře | moře → `vzor-more-za-kure` |
| U4 detektiv (5) | Najít u Petra jméno rodu středního, které dal ke vzoru kuře (ohniště), a vybrat správný vzor. | k1 | `klik_ve_textu` | *ohniště* (3) | klik na *Kachně* / *tábořiště* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | moře | kuře → `detektiv-oprava-jine-chyby` · město → `detektiv-oprava-jine-chyby` · stavení → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor šesti jmen rodu ženského a středního v textu: tábořiště, kachně, zranění, předsíň, něžnost, rukavice (šest různých vzorů). | final | `oznac_role` | *tábořiště* (1) moře · *kachně* (4) kuře · *zraněním* (6) stavení · *předsíni* (10) píseň · *něžností* (12) kost · *rukavici* (15) růže | *rukavici* píseň → `vzor-ruze-za-pisen` · *zraněním* moře → `vzor-more-za-staveni` · *tábořiště* kuře + *kachně* moře → `vzor-more-za-kure` · *předsíni* kost + *něžností* píseň → `vzor-pisen-za-kost` |

Texty ke klikání a označování: U4 k1: „Kachně běhalo kolem ohniště u tábořiště.“ · U5 final: „Z tábořiště jsme přinesli kachně se zraněním. Klára ho v předsíni s něžností zahřívá v rukavici.“

### cj-t2-l7b — Koncovky i/y podle vzoru (B-varianta, `poradi` 3)

**Cíl:** Dítě doplní i, nebo y v koncovce podstatného jména po obojetné souhlásce tak, že určí vzor a řekne ho ve stejném tvaru (s kamarády → s pány → y; kamarádi → páni → i).

**Platí:** `Nevím i/y? Dosadím vzor` · `s kamarády → s pány → y` · `kamarádi (1. p.) → páni → i`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat vzory z lekcí 5 a 6: dvě jména rodu mužského (gymnasta, gauč), jedno ženského (zvědavost) a jedno středního (bydliště). | k1 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | k2 | `dlazdice` | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k3 | `dlazdice` | kost | píseň → `vzor-pisen-za-kost` |
|  |  | final | `dlazdice` | moře | kuře → `vzor-more-za-kure` |
| U2 nova (5) | Doplnit i/y v šesti koncovkách podstatných jmen po obojetné souhlásce tak, že dítě určí vzor a dosadí ho ve stejném tvaru. | final | `doplnit_pismeno` | Sob**i** odpočívají ve stínu skál**y**. Děti fotí sob**y** mobil**y**. Sup**i** krouží nad chatam**i**. | mezera 1 = y → `koncovka-podst-y-za-i` · mezera 2 = i → `koncovka-podst-i-za-y` · mezera 3 = i → `koncovka-podst-i-za-y` · mezera 6 = y → `koncovka-podst-y-za-i` |
| U3 nova (5) | Místo nejčastější chyby: u životných jmen rozlišit 1. pád množného čísla (dva hýli → páni → i) a 4. pád (fotí hýly → pány → y). | k1 | `doplnit_pismeno` | Na krmítku sedí dva hýl**i**. | mezera 1 = y → `koncovka-podst-y-za-i` |
|  |  | k2 | `doplnit_pismeno` | V zoo pozorujeme krokodýl**y**. | mezera 1 = i → `koncovka-podst-i-za-y` |
|  |  | k3 | `doplnit_pismeno` | Ve výběhu stojí dva sob**i**. | mezera 1 = y → `koncovka-podst-y-za-i` |
|  |  | final | `doplnit_pismeno` | Lucka si na zahradě fotí hýl**y**. | mezera 1 = i → `koncovka-podst-i-za-y` |
| U4 detektiv (5) | Najít u Petra koncovku i místo y (pod trámi) a vybrat vzor ve stejném tvaru, který chybu ukáže (pod hrady). | k1 | `klik_ve_textu` | *trámi* (3) | klik na *Kozli* / *kůlny* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | pod hrady | páni → `detektiv-oprava-jine-chyby` · pod stroji → `detektiv-oprava-jine-chyby` · bez ženy → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně doplnit i/y v osmi koncovkách podstatných jmen všech tří rodů v souvislém textu. | final | `doplnit_pismeno` | Ve čtvrtek jedeme s vítěz**i** soutěže na tábor. Kuchař vaří s vychovatel**i** guláš, nad lesem krouží sup**i** a na stole leží gum**y**. Odpoledne hrajeme fotbal s tým**y** z vesnice a večer zpíváme s kytaram**i**. Potom se soutěží mezi družstv**y** a na statku krmíme sob**y**. | mezera 3 = y → `koncovka-podst-y-za-i` · mezera 5 = i → `koncovka-podst-i-za-y` · mezera 7 = i → `koncovka-podst-i-za-y` · mezera 6 = y → `koncovka-podst-y-za-i` |

Texty ke klikání a označování: U4 k1: „Kozli odpočívají pod trámi staré kůlny.“

### cj-t2-l8b — Kontrola tématu: podstatná jména (B-varianta, `poradi` 4)

**Cíl:** Dítě u jmen v textu samo určí vzor a v deseti koncovkách doplní i, nebo y a u každé řekne, který vzor dosadilo.

**Platí:** `Vzor: rod + 1. a 2. pád` · `Dosadím vzor ve stejném pádě` · `u stodoly → u ženy → y`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat celé téma po kouskách: vzor jména rodu mužského (gymnasta), životnost (baobab), koncovku 4. pádu životného jména (soby) a vzor jména rodu středního (oddělení). | k1 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | k2 | `dlazdice` | neživotný | životný → `zivotnost-podle-vyznamu` |
|  |  | k3 | `dlazdice` | y | i → `koncovka-podst-i-za-y` |
|  |  | final | `dlazdice` | stavení | moře → `vzor-more-za-staveni` |
| U2 nova (5) | Určit vzor u sedmi jmen všech tří rodů ve dvou větách; vzory jsou rozdělené po rodech (nejvýš 8 tlačítek v kroku). | k1 | `oznac_role` | *Šachista* (0) předseda · *vítězi* (2) muž · *pomeranč* (3) stroj | *Šachista* pán → `vzor-pan-za-predseda` · *vítězi* pán → `vzor-pan-za-muz` · *vítězi* soudce → `vzor-muz-za-soudce` · *pomeranč* hrad → `vzor-hrad-za-stroj` |
|  |  | final | `oznac_role` | *Hříbě* (0) kuře · *výstaviště* (2) moře · *vesnice* (4) růže · *sladkost* (8) kost | *Hříbě* moře + *výstaviště* kuře → `vzor-more-za-kure` · *vesnice* píseň → `vzor-ruze-za-pisen` · *sladkost* píseň → `vzor-pisen-za-kost` |
| U3 nova (5) | Doplnit i/y v šesti koncovkách na místech nejčastější chyby: 1. × 4. pád životných jmen (pudli × pudly, hýli), 7. pád jmen podle vzorů hrad, muž a kost. | final | `doplnit_pismeno` | V boudě spí dva pudl**i**. Ema češe pudl**y** kartáčem. Na stole mezi mobil**y** leží nabíječka. Jídlo nosíme s vychovatel**i** a krabice s drobnostm**i** necháváme u vchodu. Na krmítku sedí dva hýl**i**. | mezera 1 = y → `koncovka-podst-y-za-i` · mezera 2 = i → `koncovka-podst-i-za-y` · mezera 3 = i → `koncovka-podst-i-za-y` · mezera 6 = y → `koncovka-podst-y-za-i` |
| U4 detektiv (5) | Najít u Petra jméno rodu ženského na -e, které dal ke vzoru píseň (jeskyně), a vybrat správný vzor. | k1 | `klik_ve_textu` | *jeskyni* (1) | klik na *horou* / *listí* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | růže | píseň → `detektiv-oprava-jine-chyby` · stavení → `detektiv-oprava-jine-chyby` · žena → `detektiv-oprava-jine-chyby` |
| U5 kontrolni **týdenní** (6) | Kontrola tématu: samostatně určit vzor pěti jmen všech tří rodů a doplnit i/y v deseti koncovkách; semafor tématu podle doplňování (krok final). | k1 | `oznac_role` | *Policista* (0) předseda · *tábořiště* (3) moře · *silnicí* (5) růže · *kachně* (7) kuře · *gauč* (10) stroj | *Policista* pán → `vzor-pan-za-predseda` · *gauč* hrad → `vzor-hrad-za-stroj` · *silnicí* píseň → `vzor-ruze-za-pisen` · *tábořiště* kuře + *kachně* moře → `vzor-more-za-kure` |
|  |  | final | `doplnit_pismeno` | V neděli pojedeme se sestram**i** na výlet. Sejdeme se ráno u chalup**y** s vítěz**i** soutěže. Vodu poneseme v láhv**i**. Na louce pobíhají dva kozl**i** a u břehu čekají loďky s vesl**y**. V zoo budeme pozorovat sup**y** a v ohradě se pasou sob**i**. Večer se vyfotíme s krokodýl**y** a doma budeme dělat pokus**y** s vodou. | mezera 5 = y → `koncovka-podst-y-za-i` · mezera 7 = i → `koncovka-podst-i-za-y` · mezera 9 = i → `koncovka-podst-i-za-y` · mezera 8 = y → `koncovka-podst-y-za-i` |

Texty ke klikání a označování: U2 k1: „Šachista podal vítězi pomeranč.“ · U2 final: „Hříbě z výstaviště u vesnice dostalo za odměnu sladkost.“ · U4 k1: „V jeskyni pod horou leží staré listí.“ · U5 k1: „Policista našel u tábořiště za silnicí malé kachně a starý gauč.“

### Nahrávky (pro AUDIO.md, oddíl l5b–l8b)

Dvě nahrávky poslechu, stejný hlas a nastavení jako `t2/l5-u3.mp3` a `t2/l6-u3.mp3` (`NAHRAVKY-NAVOD.md`). `AUDIO.md` jsem nepsal; do sloučení hlásí `seed:validace` u L5b a L6b chybu „nahrávka nemá řádek v AUDIO.md“ (jediná chyba validátoru).

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t2/l5b-u3.mp3` | cj-t2-l5b / úloha 3 (`k1` i `final`) | poslech | Tomáš uviděl kamaráda s hrdinou turnaje. | Oznamovací věta. Nezdůrazňovat „kamaráda“ ani „hrdinou“; koncovky „-a“ v „kamaráda“ a „-ou“ v „hrdinou“ vyslovit zřetelně, nepolykat. Cca 3 s. | čeká na Pavla |
| `t2/l6b-u3.mp3` | cj-t2-l6b / úloha 3 (`k1` i `final`) | poslech | Klára si v listí hrála s malým kachnětem. | Oznamovací věta. Nezdůrazňovat „listí“ ani „kachnětem“; „listí“ s dlouhým „í“, „kachnětem“ celé a zřetelně (slabika „-ně-“ se nesmí ztratit). Cca 3 s. | čeká na Pavla |

### Ověření ÚJČ (l5b–l8b)

- **Ověřeno v tabulkách tvarů** (`nastroje/ujc.sh`; 9. 10. z cache, 12. 10. znovu a nově na serveru ÚJČ): telefon, bratr, sport, otec, hrnek, řidič, měsíc, gymnasta, tvůrce, hrdina, kamarád, šachista, hasič, čaj, zachránce, kluk, kaštan, policista, pomeranč, výr, gauč, lyžař, koncert, žák, kapuce, lenost, láhev, kniha, večeře, listí, kachně, kůzle, bydliště, oddělení, ohniště, tábořiště, zranění, předsíň, něžnost, rukavice, učebnice, zvědavost, chránič, sob, skála, mobil, sup, chata, hýl, krokodýl, kozel, trám, kůlna, dopis, vítěz, vychovatel, guma, tým, kytara, družstvo, baobab, obydlí, ananas, hříbě, výstaviště, vesnice, sladkost, pudl, drobnost, jeskyně, hora, silnice, sestra, chalupa, veslo, pokus. Pozor: *gymnasta* má v 1. p. mn. jen *gymnasté*, *šachista/policista* *-isté/-isti* (dubleta) — v mezeře se nehodnotí, jen vzor.
- **Výklady:** id=222 (vzory), id=251 (*-ost* = skupina A, čistě *kost*: lenost, něžnost, zvědavost, sladkost, drobnost — u těchto pěti i tabulky tvarů; v semaforu mladost, šikovnost, věrnost; *láhev, obec* = skupina H, čistě *píseň*). Vyřazeno: *zeď* (skupina B), *ves* (E).
- **Vyřazeno po ověření 12. 10.:** *kotel* (ÚJČ: 1. p. mn. kotle i kotly, 7. p. mn. kotli i kotly — kolísá mezi stroj a hrad, dubleta); *los, rys, krab* mají v ÚJČ dvě hesla (živ. × neživ.), nepoužity.
- **Neověřené slovo v hodnoceném místě ani v nahrávce:** žádné. Slova z dřívějšího seznamu „zatím neověřeno“ (*ježek, šimpanz, palma, červ, rorýs, kompas, tulipán, sele, jedle, hala, větev, hotel, vůz*) v lekcích nejsou; *hrdina, zachránce, kaštan, ohniště, pudl, vychovatel* jsou ověřené výš.

### Nejistoty a poznámky (l5b–l8b)

1. **Korektura 12. 10.** (ÚJČ zase odpovídá): překryvy s ostatními lekcemi tématu odstraněny ověřenými slovy ve stejné pasti — L5b *tenista → hrdina* (nahrávka U3), *vůdce → zachránce*, *dub → kaštan*; L6b *parkoviště → ohniště* (parkoviště hodnotí `cj-t2-l8`); L7b *kos* (hodnotí `cj-t2-l8`) → *sup, hýl, kozel, krokodýl*, *pytel* (`cj-t2-l8`) → *vychovatel*; L8b *děvče, sídliště, buvol, ošetřovatel, sysel* (`l6n`, `l7n`), *čáp, lípa, orel* (`cj-t2-l7`) → *hříbě, výstaviště, pudl, vychovatel, kozel, chalupa, sup, krokodýl*. Dvě mezery po tvrdé souhlásce (L7b *hor_*, L8b *kopyt_* — jev Z5, ne téma 2, a lehčí než hlavní lekce) nahrazeny mezerami po obojetné souhlásce (*skál_*, *vesl_*).
2. **Opakování slov mezi B-variantami** (viz Společné): B-varianty jsou různé lekce a dítě je dělá jen po červené; v rámci jedné lekce se slovo opakuje jen tam, kde to dělá i hlavní lekce (L6b *kachně* U3/U4/U5 jako *kotě, štěně* v L6, L7b *sob* U2/U3/U5 jako *holub, sokol* v L7).
3. **Nahrávka `t2/l5b-u3.mp3`** má nové znění (*s hrdinou turnaje*); zatím není natočená. Při další změně `…n` lekcí je dobré překryv znovu zkontrolovat (`node /tmp/kor-b2/hodn.mjs` vypíše hodnocená slova lekce).

## B-varianty naostro lekcí (l5nb–l8nb)

Autor: metodik a autor úloh ČJ Spolu 8, 14. 10. 2026. Lekce: `obsah/cestina/lekce/cj-t2-l5nb.json` … `cj-t2-l8nb.json` — B-varianty naostro lekcí `cj-t2-l5n` … `l8n` (rozpis `TEMA-2-NAOSTRO.md`). Tabulky níže jsou vygenerované z JSON (indexy, správné odpovědi a kódy souhlasí); texty taháku, semaforu a tisku jsou jen v JSON. Generátory a kontrolní skripty: `/tmp/b-cj2nb/` (`gen-l*nb.mjs`, `kontrola.mjs`, `hodn.mjs`).

### Společné pro l5nb–l8nb

- **Hlavička:** `id` = id naostro lekce + `b`; `tema`, `kapitola` (`podstatna-jmena`), `tyden` 2, `poradi`, `faze` `osma`, `cas_min` 25 a `cil_pro_rodice` stejné jako naostro lekce. Úlohy `<id>-U1` … `-U5`, poslední krok `final`. `uvod_pro_rodice` jednou větou říká, že jde o opakování po červeném semaforu. `uvod_pravidla` a slovníček beze změny z naostro lekce (žádný řádek neobsahuje hodnocené slovo B-varianty).
- **Struktura 1:1 s naostro lekcí:** každý soubor vznikl kopií struktury své naostro lekce a přepsáním textů, takže typy úloh, počty kroků, `vstup.typ` v každém kroku, počet a pořadí dlaždic (správná na stejné pozici, stejné kódy na stejných volbách), počet označených slov a nabídka rolí, počet mezer, vzory odpovědí v doplňovačkách (L7nb U2 y, i, y, i, i, y, i, y; U5 y, y, y, i, i, y, y, i, i, i; L8nb U3 i, y, y, y, y, i, y, i; U5 y, y, i, i, y, i, y, y, i, y, y, i) a pozice známých chyb jsou stejné; `kontrola.mjs` to ověřuje i proti hlavní lekci (multiset rolí, podpisy dlaždic a známých chyb). Poslech v L5nb a L6nb U3 (3 otázky, `max_prehrani: 0`), L8nb U5 `tydenni: true` + `semafor_tydne` stejné jako L8n (zelená 11, oranžová 8 z 12). Diktát v tématu 2 není.
- **Stejná obtížnost, jiná slova:** stejné pasti jako naostro lekce (pády za slovesem a bez předložky; zvíře u vzoru muž, rostoucí strom u hradu; slovo slyšené v jiném pádě; -ec → hrad místo stroj; jména rodu ženského na souhlásku rozhodne 2. pád; -iště × stavení; 1. × 4. × 7. pád životných jmen i se jménem na začátku věty; chybné y mezi třemi správnými y; rod ženský na souhlásku k písni místo ke kosti). Žádné hodnocené slovo ani věta z `cj-t2-l5` … `l8`, `l5n` … `l8n` ani `l5b` … `l8b` (`hodn.mjs`: 0 shod; podobné, ale jiné slovo: *starost* × *starostu*, *kozy* × *kozli*, *dárek* × *dárce*). Mezi naostro B-variantami se opakují *basketbalista, motocyklista, vynálezce, tvář, postel, pánev, šakal, losos, vůl, tetřev, datel* (různé lekce). V L7nb se jako v L7n jedno zvíře vrací v jiné úloze (*šakali* U2 / *šakaly* U3, *mývali* U2 / *mývaly* U4, *voly* U4 / *voli* U5).
- **Hranice tématu (OSNOVA §6, §16, doplněk dávky):** v mezerách jen *i × y*; jména rodu ženského na souhlásku jen bez kolísání mezi *píseň* a *kost* (id=251: *-ost, bolest, závist* = skupina A; *obec* = H; *tvář, broskev, postel, pánev* mají v tabulce tvarů jen tvary vzoru píseň). Vyřazená slova z id=251 (*myš, sůl, paměť, trať, obuv, zeď, ves*), *počítač, rádce, javor, les, kotel* v lekcích nejsou. 1. p. mn. s dubletou *-i/-ové* (*šakali, mývali, datli, tetřevi, voli, dikobrazi*) mezeře nevadí. Mezery *s motocyklist_* (L7nb) a *s basketbalist_*, *s alpinist_* (L8nb) zrcadlí *s turist_*, *s kytarist_*, *s volejbalist_* naostro lekcí (7. p. vzoru předseda, jiný vzor se tu dosadit nedá); žádná jiná mezera po tvrdé souhlásce. Slovesa u doplňovaných jmen jen v přítomném nebo budoucím čase.
- **„Dnes samo“:** otázky taháku neprozrazují odpověď ani chybné slovo detektiva (obecné otázky jako v naostro lekci); přepis nahrávky není v zadání, tisku, popisku ani otázce (validátor).
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv; Honzík se nepoužívá.
- **Kódy chyb:** jen z `TYPY-CHYB.md`, stejná sada jako naostro lekce; `vzor-*` oboustranně, nový kód není.

### cj-t2-l5nb — Vzory rodu mužského (B-varianta naostro, `poradi` 1)

**Cíl:** Dítě samo určí vzor u jmen rodu mužského ve větách i v delším textu: o životnosti rozhodne testem „vidím ___“ a vzor vybere podle 2. pádu a konce slova, i u jmen, která slyší jen v nahrávce.

**Platí:** `Vidím ___: jako pána, nebo hrad?` · `Bez ___: pána, hradu, muže, stroje` · `Na -a předseda, na -e soudce`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Ledoborec ze společného základu (Z2): určit pád jména rodu mužského ve větě i tam, kde jméno stojí za slovesem nebo nemá předložku; pasti 1. × 4., 2. × 4., 3. × 6., 2. a 3. × 6. a 4. × 7. pád. | k1 | `dlazdice` | 1. pád | 4. pád → `pad-4-za-1` |
|  |  | k2 | `dlazdice` | 4. pád | 1. pád → `pad-1-za-4` · 2. pád → `pad-2-za-4` |
|  |  | k3 | `dlazdice` | 3. pád | 6. pád → `pad-6-za-3` |
|  |  | k4 | `dlazdice` | 6. pád | 2. pád → `pad-2-za-6` · 3. pád → `pad-3-za-6` |
|  |  | final | `dlazdice` | 7. pád | 4. pád → `pad-4-za-7` |
| U2 nova (5) | Přiřadit ke vzoru šest jmen rodu mužského, u kterých se vzor plete: pekař a mravenec (muž), kalendář (stroj), basketbalista (předseda), vládce (soudce) a modřín (hrad, i když roste). | k1 | `dlazdice` | muž | pán → `vzor-pan-za-muz` · soudce → `vzor-muz-za-soudce` |
|  |  | k2 | `dlazdice` | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k3 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` |
|  |  | k4 | `dlazdice` | soudce | muž → `vzor-muz-za-soudce` |
|  |  | k5 | `dlazdice` | muž | pán → `vzor-pan-za-muz` |
|  |  | final | `dlazdice` | hrad | pán → `zivotnost-podle-vyznamu` · stroj → `vzor-hrad-za-stroj` |
| U3 nova (5) | Určit vzor tří jmen rodu mužského, která dítě jen slyší v jiném pádě (motocyklistu, bernardýnem, vynálezci): samo si je vrátí do 1. pádu. | k1 | `poslech` | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | k2 | `poslech` | pán | muž → `vzor-pan-za-muz` |
|  |  | final | `poslech` | soudce | muž → `vzor-muz-za-soudce` |
| U4 detektiv (5) | Najít u Petra neživotné jméno na -ec, které dal ke vzoru hrad (hrnec), mezi třemi slovy, která má u vzorů hrad a pán správně, a vybrat správný vzor. | k1 | `klik_ve_textu` | *hrnec* (5) | klik na *pikniku* / *skautovi* / *stanu* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | stroj | hrad → `detektiv-oprava-jine-chyby` · pán → `detektiv-oprava-jine-chyby` · muž → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor šesti jmen rodu mužského v delším textu, každé k jinému vzoru: prodejce (soudce), finalista (předseda), topol (hrad, roste), vrabec (muž, zvíře), okraj (stroj), pavouk (pán). | final | `oznac_role` | *Prodejce* (0) soudce · *finalistu* (6) předseda · *topolu* (13) hrad · *vrabce* (16) muž · *okraji* (18) stroj · *pavouka* (23) pán | *topolu* pán → `zivotnost-podle-vyznamu` · *finalistu* pán → `vzor-pan-za-predseda` · *Prodejce* muž → `vzor-muz-za-soudce` · *okraji* hrad → `vzor-hrad-za-stroj` |

Texty ke klikání a označování: U4 k1: „Na pikniku podal Adam skautovi hrnec ze stanu.“ · U5 final: „Prodejce v zahradnictví provázel po skleníku finalistu soutěže a naši třídu. Ve stínu topolu nám ukázal vrabce. Na okraji záhonu jsme pak našli pavouka.“

### cj-t2-l6nb — Vzory rodu ženského a středního (B-varianta naostro, `poradi` 2)

**Cíl:** Dítě samo přiřadí jména rodu ženského a středního ke všem osmi vzorům podle 1. a 2. pádu, i v delším textu a v nahrávce, kde slova zazní v jiném tvaru.

**Platí:** `1. pád s ta/to, 2. pád s bez` · `bez písně × bez kosti` · `bez kuřete × bez moře`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat vzory rodu mužského z lekce 5 na pěti nových slovech: cestovatel (muž), flétnista (předseda), plášť (stroj), zrádce (soudce), kaktus (hrad, i když roste). | k1 | `dlazdice` | muž | pán → `vzor-pan-za-muz` · soudce → `vzor-muz-za-soudce` |
|  |  | k2 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` |
|  |  | k3 | `dlazdice` | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k4 | `dlazdice` | soudce | muž → `vzor-muz-za-soudce` |
|  |  | final | `dlazdice` | hrad | pán → `zivotnost-podle-vyznamu` |
| U2 nova (5) | Přiřadit ke vzorům žena, růže, píseň, kost šest jmen rodu ženského; čtyři z nich končí souhláskou a liší se až 2. pádem (tvář, broskev × závist, starost). | k1 | `dlazdice` | píseň | kost → `vzor-pisen-za-kost` |
|  |  | k2 | `dlazdice` | kost | píseň → `vzor-pisen-za-kost` |
|  |  | k3 | `dlazdice` | růže | píseň → `vzor-ruze-za-pisen` |
|  |  | k4 | `dlazdice` | píseň | kost → `vzor-pisen-za-kost` |
|  |  | k5 | `dlazdice` | kost | píseň → `vzor-pisen-za-kost` |
|  |  | final | `dlazdice` | žena | — |
| U3 nova (5) | Určit vzor tří jmen rodu středního, která dítě jen slyší, dvě z nich v jiném pádě: křoví (stavení), pastvišti (moře), jehnětem (kuře). | k1 | `poslech` | stavení | moře → `vzor-more-za-staveni` |
|  |  | k2 | `poslech` | moře | kuře → `vzor-more-za-kure` · stavení → `vzor-more-za-staveni` |
|  |  | final | `poslech` | kuře | moře → `vzor-more-za-kure` |
| U4 detektiv (5) | Najít u Petra jméno rodu středního na -iště, které dal ke vzoru stavení (tržiště), vedle slova, které ke stavení opravdu patří (podloubí), a vybrat správný vzor. | k1 | `klik_ve_textu` | *tržišti* (1) | klik na *podloubí* / *bednou* / *selat* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | moře | stavení → `detektiv-oprava-jine-chyby` · žena → `detektiv-oprava-jine-chyby` · kuře → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor osmi jmen rodu ženského a středního v delším textu, každé k jinému vzoru (všech osm vzorů): cvičení, schodiště, postel, slůně, police, zrcadlo, pečlivost, mikina. | final | `oznac_role` | *cvičení* (1) stavení · *schodišti* (5) moře · *posteli* (9) píseň · *slůně* (13) kuře · *polici* (16) růže · *zrcadla* (18) město · *pečlivostí* (25) kost · *mikinu* (27) žena | *posteli* kost + *pečlivostí* píseň → `vzor-pisen-za-kost` · *cvičení* moře → `vzor-more-za-staveni` · *schodišti* kuře + *slůně* moře → `vzor-more-za-kure` · *polici* píseň → `vzor-ruze-za-pisen` |

Texty ke klikání a označování: U4 k1: „Na tržišti u podloubí čekala Ema s bednou plnou selat.“ · U5 final: „Po cvičení jde Lucka po schodišti do pokoje. Na posteli tam sedí plyšové slůně a na polici u zrcadla stojí budík. Ema mezitím s velkou pečlivostí skládá mikinu.“

### cj-t2-l7nb — Koncovky i/y podle vzoru (B-varianta naostro, `poradi` 3)

**Cíl:** Dítě samo doplní i, nebo y v koncovkách podstatných jmen všech tří rodů v delším textu: určí vzor a řekne ho ve stejném tvaru, i když jméno stojí na začátku věty, za předložkou nebo v jednotném čísle.

**Platí:** `Dosadím vzor ve stejném tvaru` · `Kdo to dělá? páni → i` · `Koho vidím? pány → y`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat vzory z lekcí 5 a 6 na pěti nových slovech: karatista (předseda), cíl (stroj), opatrnost (kost), bludiště (moře) a zvíře (kuře). | k1 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | k2 | `dlazdice` | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k3 | `dlazdice` | kost | píseň → `vzor-pisen-za-kost` |
|  |  | k4 | `dlazdice` | moře | kuře → `vzor-more-za-kure` · stavení → `vzor-more-za-staveni` |
|  |  | final | `dlazdice` | kuře | moře → `vzor-more-za-kure` |
| U2 nova (5) | Doplnit i/y v osmi koncovkách podstatných jmen všech tří rodů po obojetné souhlásce; jména stojí v 1., 2., 4. i 7. pádě a dvě jsou v jednotném čísle (z budovy, na chvíli). | final | `doplnit_pismeno` | Z budov**y** u vchodu vidíme výběh, kde spí dva šakal**i**. Ošetřovatelka plní vodou mís**y**. Na stromě šplhají mýval**i**. Lucka se na chvíl**i** zastaví a fotí dikobraz**y**. Pak mluvíme s chovatel**i** o zvířatech. U jezírka mávají pelikáni křídl**y**. | mezera 2 = y → `koncovka-podst-y-za-i` · mezera 6 = i → `koncovka-podst-i-za-y` · mezera 5 = y → `koncovka-podst-y-za-i` · mezera 8 = i → `koncovka-podst-i-za-y` |
| U3 nova (5) | Místo nejčastější chyby v těžší podobě: u životných jmen rozlišit 1. pád množného čísla (i) od 4. a 7. pádu (y), i když jméno stojí na začátku věty nebo za předložkou. | k1 | `doplnit_pismeno` | Na stromě ťukají dva datl**i**. | mezera 1 = y → `koncovka-podst-y-za-i` |
|  |  | k2 | `doplnit_pismeno` | Šakal**y** v noci slyšíme až z dálky. | mezera 1 = i → `koncovka-podst-i-za-y` |
|  |  | k3 | `doplnit_pismeno` | V řece plavou losos**i**. | mezera 1 = y → `koncovka-podst-y-za-i` |
|  |  | k4 | `doplnit_pismeno` | Ve sklepě se Tomáš s hrůzou dívá na šváb**y**. | mezera 1 = i → `koncovka-podst-i-za-y` |
|  |  | final | `doplnit_pismeno` | Na výpravu jedeme spolu s fotograf**y**. | mezera 1 = i → `koncovka-podst-i-za-y` |
| U4 detektiv (5) | Najít u Petra koncovku y místo i u životného jména v 1. pádě (mývaly pobíhají) mezi třemi správnými koncovkami na y a vybrat vzor ve stejném tvaru, který chybu ukáže. | k1 | `klik_ve_textu` | *mývaly* (9) | klik na *kozy* / *voly* / *kameny* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | páni pobíhají | fotíme pány → `detektiv-oprava-jine-chyby` · fotíme ženy → `detektiv-oprava-jine-chyby` · mezi hrady → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně doplnit i/y v deseti koncovkách podstatných jmen všech tří rodů v delším textu, v jednotném i množném čísle. | final | `doplnit_pismeno` | V sobotu jedeme s motocyklist**y** z klubu na farmu. Cesta vede mezi dom**y** a u potoka rostou vrb**y**. V lese za farmou žijí tetřev**i**. Večer hrajeme fotbal s pořadatel**i** soutěže. V chlévě nad žlab**y** visí lamp**y**. Koza čichá k tykv**i** a na pastvině odpočívají vol**i**. Ráno si Tomáš obleče košil**i**. | mezera 4 = y → `koncovka-podst-y-za-i` · mezera 1 = i → `koncovka-podst-i-za-y` · mezera 8 = y → `koncovka-podst-y-za-i` · mezera 6 = i → `koncovka-podst-i-za-y` |

Texty ke klikání a označování: U4 k1: „U potoka fotíme kozy a voly, mezi kameny pobíhají mývaly.“

### cj-t2-l8nb — Kontrola tématu: podstatná jména (B-varianta naostro, `poradi` 4)

**Cíl:** Dítě u jmen v textu samo určí vzor a ve dvanácti koncovkách delšího textu doplní i, nebo y; u každé umí říct, který vzor dosadilo.

**Platí:** `Vzor: rod, 1. a 2. pád` · `Vzor řeknu ve stejném tvaru` · `páni → i, pány → y`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat celé téma po kouskách: vzor jména rodu mužského (nástupce), životnost (jasan), koncovku 4. a 1. pádu životného jména (šakaly, lososi) a vzor jména rodu středního (koření). | k1 | `dlazdice` | soudce | muž → `vzor-muz-za-soudce` |
|  |  | k2 | `dlazdice` | neživotný | životný → `zivotnost-podle-vyznamu` |
|  |  | k3 | `dlazdice` | y | i → `koncovka-podst-i-za-y` |
|  |  | k4 | `dlazdice` | stavení | moře → `vzor-more-za-staveni` |
|  |  | final | `dlazdice` | i | y → `koncovka-podst-y-za-i` |
| U2 nova (5) | Určit vzor u devíti jmen všech tří rodů ve dvou delších větách; vzory jsou rozdělené po rodech (nejvýš 8 tlačítek v kroku). | k1 | `oznac_role` | *obhájce* (4) soudce · *spoluhráči* (7) muž · *dárek* (10) hrad · *trumpetistovi* (12) předseda | *obhájce* muž + *spoluhráči* soudce → `vzor-muz-za-soudce` · *trumpetistovi* pán → `vzor-pan-za-predseda` · *spoluhráči* pán → `vzor-pan-za-muz` · *dárek* stroj → `vzor-hrad-za-stroj` |
|  |  | final | `oznac_role` | *bruslení* (1) stavení · *tvář* (5) píseň · *kluziště* (8) moře · *ptáčeti* (10) kuře · *sklenice* (13) růže | *bruslení* moře → `vzor-more-za-staveni` · *kluziště* kuře + *ptáčeti* moře → `vzor-more-za-kure` · *sklenice* píseň → `vzor-ruze-za-pisen` · *tvář* kost → `vzor-pisen-za-kost` |
| U3 nova (5) | Doplnit i/y v osmi koncovkách na místech nejčastější chyby: jednotné číslo vzoru růže (na zemi), 7. pád vzorů předseda a muž, 1. pád životných × neživotných jmen (datli × diplomy, obrazy) a 1. pád vzoru žena (helmy). | final | `doplnit_pismeno` | Ve středu sedí Ema v hale na zem**i** s basketbalist**y** z oddílu. Na stole leží diplom**y** týmu a na stěně visí obraz**y** a helm**y**. Venku na staré hrušni ťukají datl**i**. Jeden z basketbalistů si nervózně vyhrne rukáv**y**. Nakonec besedujeme se zakladatel**i** klubu. | mezera 1 = y → `koncovka-podst-y-za-i` · mezera 2 = i → `koncovka-podst-i-za-y` · mezera 6 = y → `koncovka-podst-y-za-i` · mezera 7 = i → `koncovka-podst-i-za-y` |
| U4 detektiv (5) | Najít u Petra jméno rodu ženského zakončené souhláskou, které dal ke vzoru píseň (bolest, bez bolesti → kost), a vybrat správný vzor; tři další slova má Petr dobře. | k1 | `klik_ve_textu` | *bolest* (9) | klik na *hráč* / *šatně* / *kotníku* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | kost | píseň → `detektiv-oprava-jine-chyby` · hrad → `detektiv-oprava-jine-chyby` · muž → `detektiv-oprava-jine-chyby` · žena → `detektiv-oprava-jine-chyby` |
| U5 kontrolni **týdenní** (6) | Kontrola tématu naostro: samostatně určit vzor šesti jmen všech tří rodů a doplnit i/y ve dvanácti koncovkách delšího textu; semafor tématu podle doplňování (krok final). | k1 | `oznac_role` | *vynálezci* (4) soudce · *plášť* (6) stroj · *rytíři* (9) muž · *obce* (11) píseň · *nádvoří* (14) stavení · *altánem* (16) hrad | *vynálezci* muž → `vzor-muz-za-soudce` · *rytíři* pán → `vzor-pan-za-muz` · *obce* kost → `vzor-pisen-za-kost` · *plášť* hrad + *altánem* stroj → `vzor-hrad-za-stroj` |
|  |  | final | `doplnit_pismeno` | O prázdninách jedeme s alpinist**y** na hory. Kolem chaty létají vos**y** a v kapl**i** pod kopcem zvoní zvon. Ema smaží v pánv**i** vajíčka. Ve chlévě spí kráv**y** a na louce se pasou vol**i**. V lese pozorujeme tetřev**y**. Pod stromy sbíráme slív**y**. Na postel**i** v podkroví leží spacáky a Adam uklízí v kůlně mezi kladiv**y** a na stěnu věší lamp**y**. Večer hrajeme hry s majitel**i** chaty. | mezera 6 = y → `koncovka-podst-y-za-i` · mezera 7 = i → `koncovka-podst-i-za-y` · mezera 8 = i → `koncovka-podst-i-za-y` · mezera 9 = y → `koncovka-podst-y-za-i` |

Texty ke klikání a označování: U2 k1: „Po vyhlášení výsledků podal obhájce titulu ruku spoluhráči a předal dárek mladému trumpetistovi.“ · U2 final: „Po bruslení si Lucka utřela tvář a u kluziště dala ptáčeti vodu ze sklenice.“ · U4 k1: „Po utkání cítil hráč v šatně v kotníku ostrou bolest.“ · U5 k1: „Ve hře pomáhá Klára vynálezci najít plášť, který zmizel rytíři z obce. Leží na nádvoří za altánem.“

### Nahrávky (pro AUDIO.md, oddíl l5nb–l8nb)

Dvě nahrávky poslechu, stejný hlas a nastavení jako `t2/l5n-u3.mp3` a `t2/l6n-u3.mp3` (`NAHRAVKY-NAVOD.md`, hlas Jana, Eleven v4, tempo 0,9). `AUDIO.md` jsem nepsal; do sloučení hlásí `seed:validace` u L5nb a L6nb chybu „nahrávka nemá řádek v AUDIO.md“ (jediná chyba validátoru).

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t2/l5nb-u3.mp3` | cj-t2-l5nb / úloha 3 (`k1`, `k2` i `final`) | poslech | Na výstavě jsme potkali motocyklistu s bernardýnem a pak jsme poděkovali vynálezci za ukázku. | Oznamovací intonace, nic nezdůrazňovat. Koncovky „motocyklistu“ (-u), „bernardýnem“ (-em) a „vynálezci“ (-i) vyslovit zřetelně, nepolykat. Cca 6 s. | čeká na Pavla |
| `t2/l6nb-u3.mp3` | cj-t2-l6nb / úloha 3 (`k1`, `k2` i `final`) | poslech | Z křoví jsme pozorovali ovci s jehnětem, jak se pasou na pastvišti. | Oznamovací intonace, nic nezdůrazňovat. „křoví“ s dlouhým „í“, „jehnětem“ celé a zřetelně (slabika „-ně-“ se nesmí ztratit), „pastvišti“ bez důrazu. Cca 5 s. | čeká na Pavla |

**Celkem 2 nahrávky** (poslech), obě ≤ 20 s. Po sloučení přegenerovat `node nastroje/seznam-nahravek.mjs`.

### Ověření ÚJČ (l5nb–l8nb)

- **Ověřeno v tabulkách tvarů 14. 10.** (`nastroje/ujc.sh`; ÚJČ odpovídal, nová slova dotazem na server, zbytek z cache): rod, životnost, 2. pád a tvar v hodnoceném místě u každého hodnoceného slova, slov nahrávek a slov v „Kontrole pro vás“ — L5nb: *budík, lékař, zubař, úkol, smeták, pekař, kalendář, basketbalista, vládce, mravenec, modřín, motocyklista, bernardýn, vynálezce, piknik, skaut, hrnec, stan, prodejce, finalista, topol, vrabec, okraj, pavouk, hráč, plášť, zrádce, spoluhráč, dárek*; L6nb: *cestovatel, flétnista, kaktus, tvář, závist, dálnice, broskev, starost, sova, křoví, pastviště, jehně, tržiště, podloubí, bedna, sele, cvičení, schodiště, postel, slůně, police, zrcadlo, pečlivost, mikina, pánev, bolest, lavice, bludiště, zvíře, košile, křídlo*; L7nb: *karatista, cíl, opatrnost, budova, šakal, mísa, mýval, chvíle, dikobraz, chovatel, datel, losos, šváb, fotograf, koza, vůl, kámen, dům, vrba, tetřev, pořadatel, žlab, lampa, tykev*; L8nb: *nástupce, jasan, koření, obhájce, trumpetista, bruslení, kluziště, ptáče, sklenice, země, diplom, obraz, helma, rukáv, zakladatel, šatna, kotník, plášť, rytíř, obec, nádvoří, altán, alpinista, vosa, kaple, kráva, slíva, kladivo, majitel*.
- **Výklady:** id=222 (vzory), id=226 (1. p. mn. -i/-ové), id=251 (*-ost, bolest, závist* skupina A = kost; *obec* skupina H = píseň).
- **Dublety jen mimo hodnocení:** *budík* (2. p. budíku/budíka) a *úkol* (6. p. úkole/úkolu) jen v rozcvičce na pád; 3. p. *-i/-ovi* (*zubaři, vynálezci, spoluhráči, rytíři*) a 1. p. mn. *-i/-ové* se nehodnotí tvarem, jen pádem, vzorem nebo i × y.
- **Vyřazeno po ověření 14. 10.:** *lev* (dvě hesla: zvíře × měna), *karas, ibis, konipas, platýs* (4. a 7. p. mn. kolísá mezi pán a muž: karasy/karase, s karasy/karasi), *kalous* (skloňuje se podle vzoru muž: kalouse), *mops* (ÚJČ ho vede pod heslem *mopsl*), *pes* (*psi* hodnotí `cj-t2-l7`, *ps_* `cj-t2-l8`), *lavice* (hodnotí `cj-t2-l8`). Náhrady jsou ověřená slova ve stejné pasti (*šváb, mýval, šakal, datel, sklenice*).
- **Neověřené slovo v hodnoceném místě ani v nahrávce:** žádné. Všechny čtyři lekce `kontrola.jistota: "jista"`, `zkontroloval: "autor"`.

### Nejistoty a poznámky (l5nb–l8nb)

1. **Mezera po *t* u vzoru předseda** (L7nb *s motocyklist_*, L8nb *s basketbalist_*, *s alpinist_*): zrcadlí naostro lekce (*s turist_*, *s kytarist_*, *s volejbalist_*); jméno vzoru předseda s obojetnou souhláskou před koncovkou v běžné slovní zásobě není. Pokud vedoucí chce i tady jen obojetné souhlásky, bylo by nutné změnit i naostro lekce.
2. **Méně známá slova** v hodnocených místech: *slepýš, tetřev, dikobraz, žlab, měšec, nástupce, obhájce (titulu)* — vzor i koncovka jdou určit testem, význam pro úlohu není potřeba; korektor může vyměnit za ověřené slovo se stejnou pastí.
3. **Opakování zvířat mezi L7nb a L8nb** (*šakal, losos, vůl, tetřev, datel*): po vyřazení *lev, pes, karas, ibis, konipas, kalous, mops* zbylo málo běžných životných jmen na obojetnou souhlásku, která nejsou v jiných lekcích tématu. Jsou to různé lekce a dítě je dělá jen po červené.
4. **Nahrávky `t2/l5nb-u3.mp3`, `t2/l6nb-u3.mp3`** zatím nejsou; řádky výše čekají na sloučení do `AUDIO.md`.

### Korektura (l5nb–l8nb, korektor 14. 10. 2026)

1. **Jazykové chyby v hodnocených tvarech: 0**, dublety v hodnoceném místě 0, sporné jevy OSNOVA §16 nehodnoceny. Nezávisle znovu ověřeno přes `nastroje/ujc.sh` (ÚJČ byl večer nedostupný — dotazy na *meč* v 18:2x a 18:51 bez odpovědi — proto vše z cache nástroje, žádné neověřené slovo): rod, životnost, 2. pád a tvar v hodnoceném místě u všech hodnocených slov, slov nahrávek a „Kontroly pro vás“; id=251 (*závist, starost, pečlivost, opatrnost, bolest* jen tvary kost; *tvář, broskev, postel, pánev, tykev, obec* jen tvary píseň). Dublety jen mimo hodnocení (*budík* 2./4. p., *úkol* 6. p., *kámen* 2. p., 3./6. p. *-i/-ovi*, 1. p. mn. *-i/-ové*; *fotograf* má v 1. p. mn. jen *fotografové*, v L7nb je jen 7. p. *s fotografy*). Indexy přepočítány.
2. **Opravy:**
   - L5nb U5: *slepýš* → *vrabec* (méně známé slovo; *vrabec* m. živ., bez vrabce → muž, stejná past „zvíře, a přesto ne pán“, index 16 beze změny), i v taháku, semaforu, tisku a tabulce výše.
   - L8nb U5 krok 1: *měšec* → *plášť* (méně známé slovo; *plášť* m. neživ., bez pláště → stroj, past hrad a známá chyba beze změny, index 6). *Meč* by byl lepší, ale nešel ověřit; *plášť* je ověřený a hodnocený jen v B-variantě L6nb (opakování mezi naostro B-variantami je přijaté).
   - L7nb U5 tahák: otočená role „Vrby rostou: taky co?, ale…“ → „Vrby rostou: co roste? Vrba je jako žena…“.
3. **Posouzeno a ponecháno:** *dikobraz, žlab, tetřev, nástupce, obhájce (titulu)* osmák zná (zoo, okap/koryto, přírodopis, sportovní zpravodajství). *Slíva* je spisovná (SSČ: plod slivoně). Mezery po *t* u vzoru předseda: L7nb 1 (= L7n), L8nb 2 na stejných místech jako L8n — zrcadlí, nejsou navíc. Opakování zvířat L7nb × L8nb (*šakal, losos, datel, vůl, tetřev*) zůstává, každé v jiné větě: připravené náhrady (*krab* C, *šimpanz* E v L8nb U1, *rys* v L8nb U5; skript `/tmp/kor-nb2/l8nb-oprava.py krab simpanz rys`) nešly kvůli výpadku ÚJČ ověřit — [OVĚŘIT] až ÚJČ odpoví (*krab* a *rys* mají dvě hesla, živ. = `?id=krab_1`, `?id=rys_1`; zkontrolovat 4. a 7. p. mn.). Tahákové otázky ve všech čtyřech lekcích neprozrazují odpověď ani chybné slovo detektiva; přepisy nahrávek nejsou v zadání, tisku, popisku ani otázce.

Kontrola: `/tmp/kor-nb2/kor.mjs` (`vyhodnotKrok`, `vzorovaOdpoved`: vzorová odpověď každého kroku, každá dlaždice, každá známá chyba se svým kódem, opačné písmeno v každé mezeře, indexy, slovní limity SABLONA §4) — 0 chyb; autorův `/tmp/b-cj2nb/kontrola.mjs` (struktura 1:1 s naostro lekcí) a `hodn.mjs` (0 přesných shod s l5–l8, l5n–l8n, l5b–l8b) — 0 chyb. Všechny čtyři lekce `kontrola.jistota: "jista"`, `zkontroloval: "korektor"`.
