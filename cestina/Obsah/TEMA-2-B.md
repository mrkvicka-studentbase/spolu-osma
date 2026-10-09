# Téma 2 — Podstatná jména: B-varianty (Spolu 8)

Verze 1.0, 9. 10. 2026. Rozpis B-variant lekcí tématu 2 (ZADANI-OSMA §9 bod 4: po **červeném** semaforu aplikace nabídne stejnou lekci s jinými slovy a větami). Soubor sdílejí dva autoři: každý píše jen do svého oddílu. **Pro:** vedoucího (schválení), korektora (Ověření ÚJČ, Nejistoty), autora nahrávek (Nahrávky ke sloučení do `AUDIO.md`).

## B-varianty učebních lekcí (l5b–l8b)

Autor: metodik a autor úloh ČJ Spolu 8, 9. 10. 2026. Lekce: `obsah/cestina/lekce/cj-t2-l5b.json` … `cj-t2-l8b.json`. Tabulky níže jsou vygenerované z JSON (indexy, správné odpovědi a kódy souhlasí); texty taháku, semaforu a tisku jsou jen v JSON.

### Společné pro l5b–l8b

- **Hlavička:** `id` = id hlavní lekce + `b`; `tema`, `kapitola` (`podstatna-jmena`), `tyden` 2, `poradi`, `faze` `osma`, `cas_min` 25 stejné jako hlavní lekce. Úlohy `<id>-U1` … `-U5`, poslední krok `final`. `uvod_pro_rodice` jednou větou říká, že jde o opakování po červeném semaforu. `uvod_pravidla` jako u hlavní lekce (u L6b třetí řádek `bez kuřete × bez moře` místo příkladu *kotě* z hlavní lekce); žádný řádek neobsahuje hodnocené slovo B-varianty.
- **Struktura 1:1 s hlavní lekcí** (kontrolováno skriptem): stejné typy úloh, počet kroků, `vstup.typ` v každém kroku, počet a pořadí dlaždic (správná na stejné pozici), stejné kódy na stejných volbách, stejný počet mezer, označených slov a rolí, stejné pozice známých chyb v doplňovačkách, stejné vzory odpovědí (L7b U2 i, y, y, y, i, i; L8b U5 i, y, i, i, i, y, y, i, y, y …). Poslech v L5b a L6b U3 (2 otázky, `max_prehrani: 0`), L8b U5 `tydenni: true` + stejné `semafor_tydne`. Diktát v tématu 2 není.
- **Stejná obtížnost, jiná slova:** stejné pasti (jméno na *-a* a *-e* rodu mužského, životnost u rostliny, slovo slyšené v jiném pádě, *-iště* × kuře, *-ost* × píseň, životná jména 1. × 4. pád, 7. p. vzorů hrad, stroj, kost). Žádné hodnocené slovo ani věta z `cj-t2-l5` … `l8` ani z naostro dvojic `l5n` … `l8n` v twin lekcích (hlavní a naostro téhož čísla) se hodnocená slova nepřekrývají; s jinými lekcemi tématu se po korektuře 9. 10. několik slov překrývá, protože cache ÚJČ jinou ověřenou náhradu nemá (viz Nejistoty). Mezi B-variantami se několik slov opakuje (např. *šachista*, *sídliště*, *kachně*, *sob*); jsou to různé lekce.
- **Hranice tématu (OSNOVA §6, §16):** v mezerách jen *i × y* po obojetné souhlásce; dubleta *-i/-ové* (*sobi/sobové, kosi/kosové, sysli/syslové*) mezeře nevadí. Slova kolísající mezi pán a muž (*rorýs*) a jména vzoru muž na *-z* (*šimpanz*: šimpanze) se nehodnotí. Jména rodu ženského na souhlásku jen bez kolísání mezi *píseň* a *kost* (ÚJČ id=251: *-ost* = skupina A, *láhev, obec* = skupina H, *předsíň* má v tabulce tvarů jen *předsíně*); vyřazeny *zeď, ves* (skupiny B, E). Slovesa u doplňovaných jmen jen v přítomném nebo budoucím čase.
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
| U3 nova (5) | Určit vzor jmen rodu mužského, která dítě jen slyší v jiném pádě (tenistou, kamaráda): samo si je vrátí do 1. pádu. | k1 | `poslech` | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | final | `poslech` | pán | — |
| U4 detektiv (5) | Najít u Petra jméno rodu mužského na -a, které dal ke vzoru pán (šachista), a vybrat správný vzor. | k1 | `klik_ve_textu` | *Šachista* (0) | klik na *hasiči* / *čaj* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | předseda | muž → `detektiv-oprava-jine-chyby` · stroj → `detektiv-oprava-jine-chyby` · hrad → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor pěti jmen rodu mužského v textu: vůdce (soudce), kluk (pán), dub (hrad, neživotný), policista (předseda), pomeranč (stroj). | final | `oznac_role` | *Vůdce* (0) soudce · *kluka* (5) pán · *dubem* (8) hrad · *policista* (10) předseda · *pomeranč* (14) stroj | *dubem* pán → `zivotnost-podle-vyznamu` · *policista* pán → `vzor-pan-za-predseda` · *Vůdce* muž → `vzor-muz-za-soudce` · *pomeranč* hrad → `vzor-hrad-za-stroj` |

Texty ke klikání a označování: U4 k1: „Šachista nalil hasiči čaj.“ · U5 final: „Vůdce oddílu na koupališti uviděl kluka pod vysokým dubem. Jeden policista mu potom přinesl pomeranč z bufetu.“

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
| U4 detektiv (5) | Najít u Petra jméno rodu středního, které dal ke vzoru kuře (parkoviště), a vybrat správný vzor. | k1 | `klik_ve_textu` | *parkoviště* (3) | klik na *Kachně* / *tábořiště* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | moře | kuře → `detektiv-oprava-jine-chyby` · město → `detektiv-oprava-jine-chyby` · stavení → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor šesti jmen rodu ženského a středního v textu: tábořiště, kachně, zranění, předsíň, něžnost, rukavice (šest různých vzorů). | final | `oznac_role` | *tábořiště* (1) moře · *kachně* (4) kuře · *zraněním* (6) stavení · *předsíni* (10) píseň · *něžností* (12) kost · *rukavici* (15) růže | *rukavici* píseň → `vzor-ruze-za-pisen` · *zraněním* moře → `vzor-more-za-staveni` · *tábořiště* kuře + *kachně* moře → `vzor-more-za-kure` · *předsíni* kost + *něžností* píseň → `vzor-pisen-za-kost` |

Texty ke klikání a označování: U4 k1: „Kachně běhalo kolem parkoviště u tábořiště.“ · U5 final: „Z tábořiště jsme přinesli kachně se zraněním. Klára ho v předsíni s něžností zahřívá v rukavici.“

### cj-t2-l7b — Koncovky i/y podle vzoru (B-varianta, `poradi` 3)

**Cíl:** Dítě doplní i, nebo y v koncovce podstatného jména po obojetné souhlásce tak, že určí vzor a řekne ho ve stejném tvaru (s kamarády → s pány → y; kamarádi → páni → i).

**Platí:** `Nevím i/y? Dosadím vzor` · `s kamarády → s pány → y` · `kamarádi (1. p.) → páni → i`

| úloha | co hodnotí | krok | vstup | správně | známé chyby |
|---|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat vzory z lekcí 5 a 6: dvě jména rodu mužského (gymnasta, gauč), jedno ženského (zvědavost) a jedno středního (bydliště). | k1 | `dlazdice` | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | k2 | `dlazdice` | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k3 | `dlazdice` | kost | píseň → `vzor-pisen-za-kost` |
|  |  | final | `dlazdice` | moře | kuře → `vzor-more-za-kure` |
| U2 nova (5) | Doplnit i/y v šesti koncovkách podstatných jmen po obojetné souhlásce tak, že dítě určí vzor a dosadí ho ve stejném tvaru. | final | `doplnit_pismeno` | Sob**i** odpočívají ve stínu hor**y**. Děti fotí sob**y** mobil**y**. Kos**i** zpívají nad chatam**i**. | mezera 1 = y → `koncovka-podst-y-za-i` · mezera 2 = i → `koncovka-podst-i-za-y` · mezera 3 = i → `koncovka-podst-i-za-y` · mezera 6 = y → `koncovka-podst-y-za-i` |
| U3 nova (5) | Místo nejčastější chyby: u životných jmen rozlišit 1. pád množného čísla (dva sobi → páni → i) a 4. pád (pozorujeme soby → pány → y). | k1 | `doplnit_pismeno` | Na střeše zpívají dva kos**i**. | mezera 1 = y → `koncovka-podst-y-za-i` |
|  |  | k2 | `doplnit_pismeno` | V zoo pozorujeme sob**y**. | mezera 1 = i → `koncovka-podst-i-za-y` |
|  |  | k3 | `doplnit_pismeno` | Ve výběhu stojí dva sob**i**. | mezera 1 = y → `koncovka-podst-y-za-i` |
|  |  | final | `doplnit_pismeno` | Lucka si na zahradě fotí kos**y**. | mezera 1 = i → `koncovka-podst-i-za-y` |
| U4 detektiv (5) | Najít u Petra koncovku i místo y (pod trámi) a vybrat vzor ve stejném tvaru, který chybu ukáže (pod hrady). | k1 | `klik_ve_textu` | *trámi* (3) | klik na *Kosi* / *kůlny* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | pod hrady | páni → `detektiv-oprava-jine-chyby` · pod stroji → `detektiv-oprava-jine-chyby` · bez ženy → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně doplnit i/y v osmi koncovkách podstatných jmen všech tří rodů v souvislém textu. | final | `doplnit_pismeno` | Ve čtvrtek jedeme s vítěz**i** soutěže na tábor. Kuchař přiveze vozík s pytl**i** brambor, u kuchyně poskakují kos**i** a na stole leží gum**y**. Odpoledne hrajeme fotbal s tým**y** z vesnice a večer zpíváme s kytaram**i**. Potom se soutěží mezi družstv**y** a na statku krmíme sob**y**. | mezera 3 = y → `koncovka-podst-y-za-i` · mezera 5 = i → `koncovka-podst-i-za-y` · mezera 7 = i → `koncovka-podst-i-za-y` · mezera 6 = y → `koncovka-podst-y-za-i` |

Texty ke klikání a označování: U4 k1: „Kosi hnízdí pod trámi staré kůlny.“

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
|  |  | final | `oznac_role` | *Děvče* (0) kuře · *sídliště* (2) moře · *vesnice* (4) růže · *sladkost* (8) kost | *Děvče* moře + *sídliště* kuře → `vzor-more-za-kure` · *vesnice* píseň → `vzor-ruze-za-pisen` · *sladkost* píseň → `vzor-pisen-za-kost` |
| U3 nova (5) | Doplnit i/y v šesti koncovkách na místech nejčastější chyby: 1. × 4. pád životných jmen (buvoli × buvoly, čápi), 7. pád jmen podle vzorů hrad, muž a kost. | final | `doplnit_pismeno` | V ohradě spí dva buvol**i**. Ema hladí buvol**y** po hřbetě. Na stole mezi mobil**y** leží nabíječka. Krmení nosíme s ošetřovatel**i** a krabice s drobnostm**i** necháváme u vchodu. Na střeše stojí dva čáp**i**. | mezera 1 = y → `koncovka-podst-y-za-i` · mezera 2 = i → `koncovka-podst-i-za-y` · mezera 3 = i → `koncovka-podst-i-za-y` · mezera 6 = y → `koncovka-podst-y-za-i` |
| U4 detektiv (5) | Najít u Petra jméno rodu ženského na -e, které dal ke vzoru píseň (jeskyně), a vybrat správný vzor. | k1 | `klik_ve_textu` | *jeskyni* (1) | klik na *horou* / *listí* → `detektiv-jine-slovo` |
|  |  | final | `dlazdice` | růže | píseň → `detektiv-oprava-jine-chyby` · stavení → `detektiv-oprava-jine-chyby` · žena → `detektiv-oprava-jine-chyby` |
| U5 kontrolni **týdenní** (6) | Kontrola tématu: samostatně určit vzor pěti jmen všech tří rodů a doplnit i/y v deseti koncovkách; semafor tématu podle doplňování (krok final). | k1 | `oznac_role` | *Policista* (0) předseda · *tábořiště* (3) moře · *silnicí* (5) růže · *kachně* (7) kuře · *gauč* (10) stroj | *Policista* pán → `vzor-pan-za-predseda` · *gauč* hrad → `vzor-hrad-za-stroj` · *silnicí* píseň → `vzor-ruze-za-pisen` · *tábořiště* kuře + *kachně* moře → `vzor-more-za-kure` |
|  |  | final | `doplnit_pismeno` | V neděli pojedeme se sestram**i** na výlet. Sejdeme se ráno u líp**y** s vítěz**i** soutěže. Vodu poneseme v láhv**i**. Na louce pobíhají dva sysl**i** a koně dupou kopyt**y**. Na statku budeme pozorovat čáp**y** a v ohradě se pasou sob**i**. Večer se vyfotíme s orl**y** a doma budeme dělat pokus**y** s vodou. | mezera 5 = y → `koncovka-podst-y-za-i` · mezera 7 = i → `koncovka-podst-i-za-y` · mezera 9 = i → `koncovka-podst-i-za-y` · mezera 8 = y → `koncovka-podst-y-za-i` |

Texty ke klikání a označování: U2 k1: „Šachista podal vítězi pomeranč.“ · U2 final: „Děvče ze sídliště u vesnice dostalo za odměnu sladkost.“ · U4 k1: „V jeskyni pod horou leží staré listí.“ · U5 k1: „Policista našel u tábořiště za silnicí malé kachně a starý gauč.“

### Nahrávky (pro AUDIO.md, oddíl l5b–l8b)

Dvě nahrávky poslechu, stejný hlas a nastavení jako `t2/l5-u3.mp3` a `t2/l6-u3.mp3` (`NAHRAVKY-NAVOD.md`). `AUDIO.md` jsem nepsal; do sloučení hlásí `seed:validace` u L5b a L6b chybu „nahrávka nemá řádek v AUDIO.md“ (jediná chyba validátoru).

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t2/l5b-u3.mp3` | cj-t2-l5b / úloha 3 (`k1` i `final`) | poslech | Tomáš vyfotil kamaráda s tenistou. | Oznamovací věta. Nezdůrazňovat „kamaráda“ ani „tenistou“; koncovky „-a“ v „kamaráda“ a „-ou“ v „tenistou“ vyslovit zřetelně, nepolykat. Cca 3 s. | čeká na Pavla |
| `t2/l6b-u3.mp3` | cj-t2-l6b / úloha 3 (`k1` i `final`) | poslech | Klára si v listí hrála s malým kachnětem. | Oznamovací věta. Nezdůrazňovat „listí“ ani „kachnětem“; „listí“ s dlouhým „í“, „kachnětem“ celé a zřetelně (slabika „-ně-“ se nesmí ztratit). Cca 3 s. | čeká na Pavla |

### Ověření ÚJČ (l5b–l8b)

- **Ověřeno v tabulkách tvarů** (`nastroje/ujc.sh`, 9. 10.): telefon, bratr, sport, otec, hrnek, řidič, měsíc, gymnasta, tvůrce, šachista, policista, hasič, čaj, kamarád, koláč, koupaliště, výr, gauč, lyžař, pomeranč, koncert, žák, čepice, lenost, láhev, kniha, kapuce, listí, kůzle, kachně, bydliště, oddělení, obydlí, tábořiště, zranění, předsíň, rukavice, učebnice, chránič, sob, ananas, trám, kůlna, bota, guma, šála, dopis, mobil, kytara, družstvo, albatros, vítěz, vesnice, jeskyně, hora, sestra, osel. Pozor: *gymnasta* má v 1. p. mn. jen *gymnasté*, *šachista/policista* *-isté/-isti* (dubleta) — v mezeře se nehodnotí, jen vzor.
- **Výklady:** id=222 (vzory), id=251 (*-ost* = skupina A, čistě *kost*: lenost, něžnost, zvědavost, sladkost, drobnost; v semaforu mladost, šikovnost, věrnost; *láhev, obec* = skupina H, čistě *píseň*). Vyřazeno: *zeď* (skupina B), *ves* (E).
- **Zatím neověřeno** (ÚJČ 9. 10. přetížený, sdílená fronta opakovaně neodpověděla): L5b *hrdina, zachránce, ježek, kaštan*; L6b *ohniště*; L7b *šimpanz, palma, pudl, červ, rorýs, vychovatel, kotel, kompas*; L8b *tulipán, pudl, sele, jedle, hala, vychovatel, větev, šimpanz, hotel, rorýs, kotel, vůz*. Proto `kontrola.jistota: "stredni"` u všech čtyř lekcí; korektor ověří a přepne na `jista`. Očekávané tvary: hrdina 2. p. hrdiny (předseda); zachránce 2. p. zachránce (soudce, m. živ.); ježek 4. p. ježka; kaštan m. neživ., 2. p. kaštanu; ohniště 2. p. ohniště (moře); šimpanz/pudl/rorýs/sob/červ 1. p. mn. *-i*, 4. a 7. p. mn. *-y*; palma 2. p. palmy; vychovatel 7. p. mn. vychovateli; kotel m. neživ., 2. p. kotle, 7. p. mn. kotli (stroj); kompas, hotel, vůz 7. p. mn. kompasy, hotely, vozy; tulipán m. neživ.; sele 2. p. selete (kuře); jedle 6./7. p. jedli/jedlí (růže); hala 2. p. haly; větev 2. p. větve, 6. p. větvi (píseň).

### Nejistoty a poznámky (l5b–l8b)

1. **Neověřená slova** viz výš; když korektor některé neuzná, náhrada je v rámci stejné pasti (např. *kaštan* → jiný strom rodu mužského neživotného, *kotel* → jiné jméno vzoru stroj na *-l*).
2. **Opakování slov mezi B-variantami** (*šachista, policista, gymnasta, tvůrce, kachně, pudl, šimpanz, rorýs, vychovatel, kotel*): B-varianty jsou různé lekce a dítě je dělá jen po červené; v rámci jedné lekce se slovo opakuje jen tam, kde to dělá i hlavní lekce (L6b *kůzle* U3/U4, L8b *kotel* U3/U5 jako *pytel* v L8).
3. **Naostro dvojice se během psaní měnily** (`l5n`–`l8n` upraveny 9. 10. odpoledne); po jejich změně jsem z B-variant odstranil překryvy (*zápas, kůzle, čepice, sídliště, albatros, kobyla, houba, dres*). Po dalších úpravách `…n` je dobré překryv znovu zkontrolovat.
