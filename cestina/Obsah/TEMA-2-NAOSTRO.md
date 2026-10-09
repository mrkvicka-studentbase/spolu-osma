# Téma 2 — Podstatná jména: NAOSTRO lekce (Spolu 8)

Verze 1.0, 9. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení), korektora (Ověření ÚJČ, Nejistoty), autora nahrávek (Nahrávky). Podle rozpisu jsou napsané `obsah/cestina/lekce/cj-t2-l5n.json` až `cj-t2-l8n.json` — naostro dvojčata učebních lekcí `cj-t2-l5` až `cj-t2-l8` (ZADANI-OSMA §9, PLAN-ROZSIRENI §3).

**Závazné vstupy:** `ZADANI-OSMA.md` (§3, §4, §8, §9), `PLAN-ROZSIRENI.md`, `cestina/Obsah/OSNOVA.md` (§2–§4, §6, §16), `FORMAT-CJ.md`, `TYPY-CHYB.md`, `TERMINOLOGIE.md`, `AUDIO.md`, `obsah/SABLONA.md` §8, §9, §18, §19, rozpis učebních lekcí `TEMA-2.md` a lekce `cj-t2-l5` … `cj-t2-l8`.

## Společné pro všechny čtyři naostro lekce

- **Hlavička:** `id` = id učební lekce + `n`, `tema`, `kapitola` (`podstatna-jmena`) a `poradi` stejné jako učební lekce, `tyden` 2, `faze` `osma`, `cas_min` 25 (4 + 5 + 5 + 5 + 6). Úlohy `<id>-U1` … `-U5` ve stejném pořadí typů; poslech ve stejné úloze jako učební lekce (L5n a L6n, U3); L8n U5 `tydenni: true` + `semafor_tydne`. Bez diktátu (T2, ZADANI-OSMA §8 bod 2).
- **Těžší / objemnější:** v každé úloze víc položek (rozcvičky 5 řad místo 4, přiřazení 6 slov místo 4, poslech 3 otázky místo 2, detektiv 4 Petrova slova místo 3, kontrolní úlohy o 1–2 slova / 2 koncovky víc), delší věty a texty, smíšené jevy z celé lekce, nenápadnější chyba detektiva (chybné slovo vypadá stejně jako správná slova kolem).
- **Nic převzatého:** žádná věta, slovo v mezeře ani hodnocené slovo z učebních lekcí `cj-t2-l5` … `l8` (kontrolováno proti všem čtyřem, nejen proti dvojčeti). Vzory a pádové otázky jsou samozřejmě stejné.
- **Méně opory:** `uvod_pravidla` jen připomínají test (3 řádky ≤ 36 znaků, bez hodnocených slov), `uvod_pro_rodice` říká „Naostro: tuhle látku dítě dělalo v lekci „…““. Tahák (vysvětlení, řešení, 3 otázky, otočená role, typická chyba) a semafor jsou plné jako u učební lekce; slovníček stejných pojmů s jinými příklady.
- **„Dnes samo“:** otázky taháku neříkají odpověď žádného kroku a v detektivu neukazují na chybné slovo (např. L8n: otázka ke kroku 2 nejmenuje vzory píseň/kost, protože by ukázala na jediné slovo toho typu).
- **Hranice tématu (OSNOVA §6, §16):** v mezerách jen volba *i × y* po obojetné souhlásce, nikdy celé koncovky; nehodnotí se *-i × -ové*, 6. p. *-u × -e*, 3./6. p. *-ovi × -u*. U jmen rodu ženského na souhlásku jen slova, která podle výkladu id=251 mezi *píseň* a *kost* nekolísají. Nehodnocená slova se dvěma hesly (osoba × věc) vyřazena, zvířata se dvěma hesly (*krab, jeřáb, los, kozel, rys, mol*) korektor 9. 10. vyřadil (dílčí hesla v ÚJČ neověřitelná). Žádné sloveso v minulém čase s doplňovaným jménem jako podmětem.
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv; *Honzík* se nepoužívá. Jména se nehodnotí.
- **Kódy chyb** jen z `TYPY-CHYB.md` (stejná sada jako učební lekce + `pad-6-za-3`, `pad-3-za-6`); nový kód není potřeba. Kódy `vzor-*` „zamění X/Y“ používám v obou směrech (jako učební lekce: *hřiště → kuře* = `vzor-more-za-kure`).

## cj-t2-l5n — Vzory rodu mužského (naostro, `poradi` 1)

**Cíl:** Dítě samo určí vzor u jmen rodu mužského ve větách i v delším textu: o životnosti rozhodne testem „vidím ___“ a vzor vybere podle 2. pádu a konce slova, i u jmen, která slyší jen v nahrávce.

**Platí:** `Vidím ___: jako pána, nebo hrad?` · `Bez ___: pána, hradu, muže, stroje` · `Na -a předseda, na -e soudce`

| úloha | co hodnotí | krok | správně | známé chyby |
|---|---|---|---|---|
| U1 rozcvicka (4) | Ledoborec ze společného základu (Z2): určit pád jména rodu mužského ve větě i tam, kde jméno stojí za slovesem nebo nemá předložku; pasti 1. × 4., 2. × 4., 3. × 6., 2. a 3. × 6. a 4. × 7. pád. | k1 | 1. pád | 4. pád → `pad-4-za-1` |
|  |  | k2 | 4. pád | 1. pád → `pad-1-za-4` · 2. pád → `pad-2-za-4` |
|  |  | k3 | 3. pád | 6. pád → `pad-6-za-3` |
|  |  | k4 | 6. pád | 2. pád → `pad-2-za-6` · 3. pád → `pad-3-za-6` |
|  |  | final | 7. pád | 4. pád → `pad-4-za-7` |
| U2 nova (5) | Přiřadit ke vzoru šest jmen rodu mužského, u kterých se vzor plete: ředitel a zajíc (muž), koberec (stroj), florbalista (předseda), poradce (soudce) a buk (hrad, i když roste). | k1 | muž | pán → `vzor-pan-za-muz` · soudce → `vzor-muz-za-soudce` |
|  |  | k2 | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k3 | předseda | pán → `vzor-pan-za-predseda` |
|  |  | k4 | soudce | muž → `vzor-muz-za-soudce` |
|  |  | k5 | muž | pán → `vzor-pan-za-muz` |
|  |  | final | hrad | pán → `zivotnost-podle-vyznamu` · stroj → `vzor-hrad-za-stroj` |
| U3 nova (5) | Určit vzor tří jmen rodu mužského, která dítě jen slyší v jiném pádě (turistu, jezevčíkem, strážci): samo si je vrátí do 1. pádu. | k1 | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | k2 | pán | muž → `vzor-pan-za-muz` |
|  |  | final | soudce | muž → `vzor-muz-za-soudce` |
| U4 detektiv (5) | Najít u Petra neživotné jméno na -ec, které dal ke vzoru hrad (kopec), mezi třemi slovy, která má u vzorů hrad a pán správně, a vybrat správný vzor. | k1 | *kopec* | klik výletě, nováčka, parkem → `detektiv-jine-slovo` |
|  |  | final | stroj | hrad → `detektiv-oprava-jine-chyby` · pán → `detektiv-oprava-jine-chyby` · muž → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor šesti jmen rodu mužského v delším textu, každé k jinému vzoru: ochránce (soudce), starosta (předseda), smrk (hrad, roste), jezevec (muž, zvíře), keř (stroj), brouk (pán). | final | Ochránce soudce, starostu předseda, smrku hrad, jezevce muž, keřem stroj, brouka pán | smrku pán → `zivotnost-podle-vyznamu` · starostu pán → `vzor-pan-za-predseda` · Ochránce muž → `vzor-muz-za-soudce` · keřem hrad → `vzor-hrad-za-stroj` |

U4 k1 text: „Na výletě vedl Adam nováčka na kopec za parkem.“

U5 final text: „Ochránce přírody provázel po naučné stezce starostu a naši třídu. Ve stínu smrku nám ukázal stopy jezevce. Pod keřem jsme pak našli brouka.“

**V čem je těžší než cj-t2-l5:** rozcvička 5 řad a 6 pádů v nabídce (navíc 3. × 6. pád, jméno za slovesem, 7. pád bez předložky); přiřazení 6 slov místo 4 (navíc zvíře u vzoru muž – *zajíc* – a rostoucí strom u hradu – *buk*); poslech delší, 3 otázky (předseda, pán, soudce, všechna slova v jiném pádě); detektiv: chyba *kopec → hrad* mezi třemi správnými „hrady“; kontrolní 6 slov všech šesti vzorů místo 5.


## cj-t2-l6n — Vzory rodu ženského a středního (naostro, `poradi` 2)

**Cíl:** Dítě samo přiřadí jména rodu ženského a středního ke všem osmi vzorům podle 1. a 2. pádu, i v delším textu a v nahrávce, kde slova zazní v jiném tvaru.

**Platí:** `1. pád s ta/to, 2. pád s bez` · `bez písně × bez kosti` · `bez kuřete × bez moře`

| úloha | co hodnotí | krok | správně | známé chyby |
|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat vzory rodu mužského z lekce 5 na pěti nových slovech: spisovatel (muž), tenista (předseda), nůž (stroj), dárce (soudce), hmyz (hrad, i když žije). | k1 | muž | pán → `vzor-pan-za-muz` · soudce → `vzor-muz-za-soudce` |
|  |  | k2 | předseda | pán → `vzor-pan-za-predseda` |
|  |  | k3 | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k4 | soudce | muž → `vzor-muz-za-soudce` |
|  |  | final | hrad | pán → `zivotnost-podle-vyznamu` |
| U2 nova (5) | Přiřadit ke vzorům žena, růže, píseň, kost šest jmen rodu ženského; čtyři z nich končí souhláskou a liší se až 2. pádem (kancelář, kolej × část, vlastnost). | k1 | píseň | kost → `vzor-pisen-za-kost` |
|  |  | k2 | kost | píseň → `vzor-pisen-za-kost` |
|  |  | k3 | růže | píseň → `vzor-ruze-za-pisen` |
|  |  | k4 | píseň | kost → `vzor-pisen-za-kost` |
|  |  | k5 | kost | píseň → `vzor-pisen-za-kost` |
|  |  | final | žena | obecná |
| U3 nova (5) | Určit vzor tří jmen rodu středního, která dítě jen slyší, dvě z nich v jiném pádě: pobřeží (stavení), slunci (moře), mládětem (kuře). | k1 | stavení | moře → `vzor-more-za-staveni` |
|  |  | k2 | moře | kuře → `vzor-more-za-kure` · stavení → `vzor-more-za-staveni` |
|  |  | final | kuře | moře → `vzor-more-za-kure` |
| U4 detektiv (5) | Najít u Petra jméno rodu středního na -iště, které dal ke vzoru stavení (sídliště), vedle slova, které ke stavení opravdu patří (zábradlí), a vybrat správný vzor. | k1 | *sídlišti* | klik zábradlí, taškou, rajčat → `detektiv-jine-slovo` |
|  |  | final | moře | stavení → `detektiv-oprava-jine-chyby` · žena → `detektiv-oprava-jine-chyby` · kuře → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně určit vzor osmi jmen rodu ženského a středního v delším textu, každé k jinému vzoru (všech osm vzorů): pondělí, tabule, sedadlo, house, garáž, klubovna, trpělivost, ovoce. | final | pondělí stavení, tabule růže, sedadlo město, house kuře, garáži píseň, klubovnou žena, trpělivostí kost, ovoce moře | garáži kost, trpělivostí píseň → `vzor-pisen-za-kost` · pondělí moře → `vzor-more-za-staveni` · house moře, ovoce kuře → `vzor-more-za-kure` · tabule píseň → `vzor-ruze-za-pisen` |

U4 k1 text: „Na sídlišti u zábradlí čekala Ema s taškou plnou rajčat.“

U5 final text: „V pondělí jdeme po škole do klubovny. U tabule tam stojí staré sedadlo z autobusu a na něm leží plyšové house. V garáži za klubovnou opravuje Adam s velkou trpělivostí kolo a Ema mu nosí ovoce.“

**V čem je těžší než cj-t2-l6:** rozcvička 5 řad (navíc *hmyz* – životnost); přiřazení 6 slov místo 4, čtyři zakončená souhláskou (rozhodne až 2. pád); poslech 3 otázky místo 2, slova v 6. a 7. pádě; detektiv: *sídliště → stavení* vedle opravdového *zábradlí* (obě slova ve větě končí na -i); kontrolní 8 slov = všech 8 vzorů místo 6.


## cj-t2-l7n — Koncovky i/y podle vzoru (naostro, `poradi` 3)

**Cíl:** Dítě samo doplní i, nebo y v koncovkách podstatných jmen všech tří rodů v delším textu: určí vzor a řekne ho ve stejném tvaru, i když jméno stojí na začátku věty, za předložkou nebo v jednotném čísle.

**Platí:** `Dosadím vzor ve stejném tvaru` · `Kdo to dělá? páni → i` · `Koho vidím? pány → y`

| úloha | co hodnotí | krok | správně | známé chyby |
|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat vzory z lekcí 5 a 6 na pěti nových slovech: houslista (předseda), talíř (stroj), rychlost (kost), sídliště (moře) a děvče (kuře). | k1 | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` |
|  |  | k2 | stroj | hrad → `vzor-hrad-za-stroj` |
|  |  | k3 | kost | píseň → `vzor-pisen-za-kost` |
|  |  | k4 | moře | kuře → `vzor-more-za-kure` · stavení → `vzor-more-za-staveni` |
|  |  | final | kuře | moře → `vzor-more-za-kure` |
| U2 nova (5) | Doplnit i/y v osmi koncovkách podstatných jmen všech tří rodů po obojetné souhlásce; jména stojí v 1., 2., 4. i 7. pádě a dvě jsou v jednotném čísle (podle mapy, na židli). | final | y, i, y, i, i, y, i, y | m1 y → `koncovka-podst-y-za-i` · m5 i → `koncovka-podst-i-za-y` · m4 y → `koncovka-podst-y-za-i` · m7 i → `koncovka-podst-i-za-y` |
| U3 nova (5) | Místo nejčastější chyby v těžší podobě: u životných jmen rozlišit 1. pád množného čísla (i) od 4. a 7. pádu (y), i když jméno stojí na začátku věty nebo za předložkou. | k1 | i | m0 y → `koncovka-podst-y-za-i` |
|  |  | k2 | y | m0 i → `koncovka-podst-i-za-y` |
|  |  | k3 | i | m0 y → `koncovka-podst-y-za-i` |
|  |  | k4 | y | m0 i → `koncovka-podst-i-za-y` |
|  |  | final | y | m0 i → `koncovka-podst-i-za-y` |
| U4 detektiv (5) | Najít u Petra koncovku y místo i u životného jména v 1. pádě (jestřáby krouží) mezi třemi správnými koncovkami na y a vybrat vzor ve stejném tvaru, který chybu ukáže. | k1 | *jestřáby* | klik kobyly, osly, ploty → `detektiv-jine-slovo` |
|  |  | final | páni krouží | fotíme pány → `detektiv-oprava-jine-chyby` · fotíme ženy → `detektiv-oprava-jine-chyby` · nad hrady → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Samostatně doplnit i/y v deseti koncovkách podstatných jmen všech tří rodů v delším textu, v jednotném i množném čísle. | final | y, y, y, i, i, y, y, i, i, i | m3 y → `koncovka-podst-y-za-i` · m0 i → `koncovka-podst-i-za-y` · m7 y → `koncovka-podst-y-za-i` · m5 i → `koncovka-podst-i-za-y` |

U2 final text: „Podle map_ najdeme výběh, kde spí dva osl_. Ošetřovatel hází vydrám ryb_. Na ostrůvku běhají sysl_. Lucka si sedne na židl_ a fotí jestřáb_. Pak mluvíme s ošetřovatel_ o zvířatech. Domů jedeme autobusem s měkkými sedadl_.“

U3 k1 text: „Nad mořem plachtí dva albatros_.“

U3 k2 text: „Sysl_ na louce vidíme jen v létě.“

U3 k3 text: „Po výběhu pobíhají pštros_.“

U3 k4 text: „V zoo se Ema dlouho dívá na páv_.“

U3 final text: „V africké rezervaci žijí zebry spolu s buvol_.“

U4 k1 text: „Na farmě fotíme kobyly a osly, nad ploty krouží jestřáby.“

U5 final text: „V sobotu jedeme s turist_ z oddílu na chatu. Cesta vede mezi les_ a na louce rostou houb_. Ve výběhu za chatou žijí páv_. Večer hrajeme fotbal s obyvatel_ vesnice. V kůlně nad stol_ visí pil_. Králík v ohradě čichá k mrkv_ a na pastvině odpočívají buvol_. Ráno Tomáš nakrájí k snídani cibul_.“

**V čem je těžší než cj-t2-l7:** rozcvička 5 řad (dvojice *sídliště × děvče*); doplňovačka 8 mezer místo 6, všechny rody, i jednotné číslo (*podle mapy, na židli*); místo nejčastější chyby 5 vět místo 4, navíc jméno na začátku věty, které nic nedělá (*Sysly vidíme*), a 7. pád (*s buvoly*); detektiv: chybné *jestřáby* mezi třemi správnými koncovkami na y; kontrolní 10 mezer místo 8 (navíc *k mrkvi, cibuli, s turisty*).


## cj-t2-l8n — Kontrola tématu: podstatná jména (naostro, `poradi` 4)

**Cíl:** Dítě u jmen v textu samo určí vzor a ve dvanácti koncovkách delšího textu doplní i, nebo y; u každé umí říct, který vzor dosadilo.

**Platí:** `Vzor: rod, 1. a 2. pád` · `Vzor řeknu ve stejném tvaru` · `páni → i, pány → y`

| úloha | co hodnotí | krok | správně | známé chyby |
|---|---|---|---|---|
| U1 rozcvicka (4) | Zopakovat celé téma po kouskách: vzor jména rodu mužského (vůdce), životnost (buk), koncovku 4. a 1. pádu životného jména (pštrosy, albatrosi) a vzor jména rodu středního (nádobí). | k1 | soudce | muž → `vzor-muz-za-soudce` |
|  |  | k2 | neživotný | životný → `zivotnost-podle-vyznamu` |
|  |  | k3 | y | i → `koncovka-podst-i-za-y` |
|  |  | k4 | stavení | moře → `vzor-more-za-staveni` |
|  |  | final | i | y → `koncovka-podst-y-za-i` |
| U2 nova (5) | Určit vzor u devíti jmen všech tří rodů ve dvou delších větách; vzory jsou rozdělené po rodech (nejvýš 8 tlačítek v kroku). | k1 | zástupce soudce, soupeři muž, pohár hrad, pianistovi předseda | zástupce muž, soupeři soudce → `vzor-muz-za-soudce` · pianistovi pán → `vzor-pan-za-predseda` · soupeři pán → `vzor-pan-za-muz` · pohár stroj → `vzor-hrad-za-stroj` |
|  |  | final | plavání stavení, skříně píseň, koupaliště moře, čepici růže, kůzle kuře | plavání moře → `vzor-more-za-staveni` · koupaliště kuře, kůzle moře → `vzor-more-za-kure` · čepici píseň → `vzor-ruze-za-pisen` · skříně kost → `vzor-pisen-za-kost` |
| U3 nova (5) | Doplnit i/y v osmi koncovkách na místech nejčastější chyby: jednotné číslo vzoru růže (na židli), 7. pád vzorů předseda a muž, 1. pád životných × neživotných jmen (pávi × dopisy, dresy) a 1. pád vzoru žena (šály). | final | i, y, y, y, y, i, y, i | m0 y → `koncovka-podst-y-za-i` · m1 i → `koncovka-podst-i-za-y` · m5 y → `koncovka-podst-y-za-i` · m6 i → `koncovka-podst-i-za-y` |
| U4 detektiv (5) | Najít u Petra jméno rodu ženského zakončené měkkou souhláskou, které dal ke vzoru píseň (řeč, bez řeči → kost), a vybrat správný vzor; tři další slova má Petr dobře. | k1 | *řeč* | klik koncertu, ředitel, tělocvičně → `detektiv-jine-slovo` |
|  |  | final | kost | píseň → `detektiv-oprava-jine-chyby` · hrad → `detektiv-oprava-jine-chyby` · muž → `detektiv-oprava-jine-chyby` · žena → `detektiv-oprava-jine-chyby` |
| U5 kontrolni (6) | Kontrola tématu naostro: samostatně určit vzor šesti jmen všech tří rodů a doplnit i/y ve dvanácti koncovkách delšího textu; semafor tématu podle doplňování (krok final). | k1 | strážci soudce, koláč stroj, kuchaři muž, věže píseň, údolí stavení, plotem hrad | strážci muž → `vzor-muz-za-soudce` · kuchaři pán → `vzor-pan-za-muz` · věže kost → `vzor-pisen-za-kost` · koláč hrad, plotem stroj → `vzor-hrad-za-stroj` |
|  |  | final | y, y, i, i, y, i, y, y, i, y, y, i | m5 y → `koncovka-podst-y-za-i` · m6 i → `koncovka-podst-i-za-y` · m7 i → `koncovka-podst-i-za-y` · m8 y → `koncovka-podst-y-za-i` |

U2 k1 text: „Po finále soutěže podal zástupce školy ruku soupeři a předal pohár mladému pianistovi.“

U2 final text: „Po plavání si Ema uložila do skříně u koupaliště čepici a plyšové kůzle.“

U3 final text: „Ve čtvrtek sedí Klára na židl_ v klubovně s kytarist_ z kapely. Na stole leží dopis_ od posluchačů a na stěně visí dres_ a šál_ fanoušků. Venku na trávníku se procházejí páv_. Jeden z kytaristů si nervózně prohrábne vlas_. Nakonec besedujeme se spisovatel_ o hudbě.“

U4 k1 text: „Na konci koncertu měl ředitel v tělocvičně dlouhou řeč.“

U5 k1 text: „Ve hře pomáhá Adam strážci najít koláč, který zmizel kuchaři z věže. Leží v údolí za plotem.“

U5 final text: „O víkendu jedeme s volejbalist_ na hory. Na dveřích visí map_ a na tabul_ v kuchyni je rozpis služeb. Ve stáj_ za chalupou spí koně a kobyl_. Na louce se pasou osl_ a na obloze pozorujeme jestřáb_. Pod smrky sbíráme houb_. Odpoledne pomáháme na zahradě: Ema nese v konv_ vodu a Tomáš uklízí v kůlně mezi kol_ a na stěnu věší pil_. Večer hrajeme hry s obyvatel_ vesnice.“

**V čem je těžší než cj-t2-l8:** rozcvička 5 řad (dvě koncovky: 4. a 1. pád); vzory u 9 slov místo 7; doplňovačka 8 mezer místo 6 (jednotné číslo vzoru růže, neživotné × životné v 1. pádě, 1. pád vzoru žena); detektiv: *řeč → píseň* (měkká souhláska, rozhodne 2. pád); kontrola tématu 6 vzorů + 12 koncovek místo 5 + 10, `semafor_tydne` zelená 11, oranžová 8 z 12.

---

## Nahrávky (pro AUDIO.md)

Formát podle `cestina/Obsah/AUDIO.md` (hlas Jana, Eleven v4, tempo 0,9 přes ffmpeg). Diktát v tématu 2 není. Soubory `web/audio/cestina/t2/…`, nové ID s `n` (nekoliduje s `l5-u3`, `l6-u3`). Validátor teď hlásí jen „nahrávka nemá řádek v AUDIO.md“ — vedoucí řádky sloučí do AUDIO.md.

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t2/l5n-u3.mp3` | 5n / úloha 3 (`k1`, `k2` i `final`) | poslech | Na horách jsme potkali turistu s jezevčíkem a pak jsme poděkovali strážci parku za mapu. | Oznamovací intonace, nic nezdůrazňovat. Koncovky „turistu“ (-u), „jezevčíkem“ (-em) a „strážci“ (-i) vyslovit zřetelně, nepolykat. Cca 6 s. | čeká na Pavla |
| `t2/l6n-u3.mp3` | 6n / úloha 3 (`k1`, `k2` i `final`) | poslech | Z pobřeží jsme pozorovali vydru s mládětem, jak se vyhřívají na slunci. | Oznamovací intonace, nic nezdůrazňovat. „pobřeží“ s dlouhým „í“, „mládětem“ celé a zřetelně (slabika „-dě-“ se nesmí ztratit), „slunci“ bez důrazu. Cca 5 s. | čeká na Pavla |

**Celkem 2 nahrávky** (poslech), obě ≤ 20 s. Po sloučení přegenerovat `node nastroje/seznam-nahravek.mjs`.

---

## Ověření ÚJČ

Autor ověřoval 9. 10. 2026 přes `bash nastroje/ujc.sh`; server byl přetížený a část slov zůstala neověřená. **Korektura 9. 10. 2026 (korektor):** každý hodnocený tvar (správné odpovědi, dlaždice, Petrova slova v detektivech, mezery, text nahrávek) a každé slovo v „Kontrole pro vás“ semaforů znovu ověřen v tabulce tvarů ÚJČ (`nastroje/ujc.sh`, cache). Opakované dotazy na zbylá neověřená hesla ÚJČ odmítal celé odpoledne („je ještě vyhodnocován“, server přetížen), proto korektor podle zadání **všechna neověřitelná slova nahradil už ověřenými slovy se stejným jevem**. Dílčí hesla *krab_1*, *jeřáb_1* se také ověřit nepodařilo → tato slova i ostatní zvířata se dvěma hesly (*los, kozel, rys, mol*) z lekcí vypadla.

| lekce | ověřeno v tabulce tvarů (hodnocená slova a „Kontrola pro vás“) | nahrazeno (neověřitelné → ověřené) |
|---|---|---|
| cj-t2-l5n | *autobus, bratranec, dědeček, zápas* (6. p. *zápase/zápasu*), *štětec, ředitel, koberec, florbalista, poradce, zajíc, buk, turista, jezevčík, strážce, výlet* (6. p. *výletě/výletu*), *nováček, kopec, park, ochránce, starosta, smrk, jezevec, keř, brouk, malíř, pomeranč, pianista, dárce, houslista, havran, vrabec, deštník, obličej, bratr* | *most → park* (U4) |
| cj-t2-l6n | *spisovatel, tenista, nůž, dárce, hmyz, kancelář, část, lžíce, kolej, vlastnost, tráva, pobřeží, slunce, mládě, vydra, sídliště, zábradlí, taška, rajče, pondělí, tabule, sedadlo, house, garáž, klubovna, trpělivost, ovoce, hasič, houslista, obličej, pláž, bolest, rukavice, kachně, koupaliště, listí, bydliště, čepice, stáj, okno, kůzle, brouk* | *mech → hmyz* (U1), *tuleň → vydra* (nahrávka U3), *nástupiště → sídliště* (U4), *přízemí, křeslo, hříbě, budova → pondělí, sedadlo, house, klubovna* (U5); v semaforech *povinnost, sklenice, tele, srdce, cvičiště → bolest, rukavice / čepice, kachně, koupaliště, bydliště* |
| cj-t2-l7n | *houslista, talíř, rychlost, sídliště, děvče, mapa, osel, ryba, vydra, sysel, židle, jestřáb, ošetřovatel, sedadlo, albatros, pštros, páv, buvol, kobyla, plot, turista, les, houba, obyvatel, stůl, pila, mrkev, cibule, volejbalista, koberec, vlastnost, house* | *kluziště, koště → sídliště, děvče* (U1); *skála, krokodýl, křeslo → mapa, osel, sedadlo* (U2); *datel, jeřáb, krab, šakal → albatros, sysel, pštros, buvol* (U3); *sup, antilopa, baobab → jestřáb, kobyla, osel, plot* (U4); *koza, los, lampa, vůl, košile → houba, páv, pila, buvol, cibule* (U5); semafory *tele, rys, mol → house, pštros, sysel* |
| cj-t2-l8n | *vůdce, buk, pštros, nádobí, albatros, zástupce, soupeř, pohár, pianista, plavání, skříň, koupaliště, čepice, kůzle, židle, kytarista, dopis, dres, šála, páv, vlas* (heslo *vlasy*), *spisovatel, koncert, ředitel, tělocvična, řeč, strážce, koláč, kuchař, věž, údolí, plot, volejbalista, mapa, tabule, stáj, kobyla, osel, jestřáb, houba, konev, kolo, pila, obyvatel, poradce, kopec, listí, dárce, deštník, kolej, kachně, pláž, tenista, cibule, sysel* | *vynálezce, kaktus, náčiní, losos → vůdce, buk, nádobí, albatros* (U1); *obhájce, vyučování, jeviště, kytice, medvídě → zástupce, plavání, koupaliště, čepice, kůzle* (U2); *neděle, zub, obraz, dikobraz, chvíle, badatel → židle, dopis, dres, šála, páv, spisovatel* (U3, nový text); *rok → koncert* (U4); *zrádce, král, meč, poklad, podzemí → strážce, kuchař, koláč, plot, údolí* (U5 k1); *chalupa, vrchol, kozel, tetřev, hřib, kaple, majitel → mapa, kobyla, osel, jestřáb, houba, pila, obyvatel* (U5 final, nový text); semafory *košile, los, skála → cibule, sysel* |

Klíčová zjištění:
- id=251: *myš* (skupina D), *sůl*, *mysl* (E), *paměť* (B), *trať* (F) kolísají mezi *píseň* a *kost* → v lekcích nejsou. Použito jen nekolísající: *kancelář, kolej, garáž, skříň, věž, stáj, konev, mrkev, pláž* (2. p. -e, píseň); *část, vlastnost, trpělivost, rychlost, řeč, bolest* (skupina A, kost). *obuv* vyřazena. Ověřeno i v tabulkách (*řeč: řečem, řečmi*).
- *počítač* a *rádce* (dvě hesla) a *javor* (2. p. *javora/javoru*), *les* (2. p. *lesa*) k určení vzoru nepoužity; *les* jen v mezeře *mezi les_* (7. p. mn. *lesy*). *sklep* (2. p. *sklepa/sklepu*) a *láhev/lahev* jako náhrady odmítnuty.
- 1. p. mn. s dubletou *-i/-ové* (*albatrosi/-ové, osli/oslové, sysli/syslové* ap.) se nehodnotí celou koncovkou, jen *i × y*; *y* je chyba v každém výkladu.
- Rozvrh: hodnocená slova se neopakují z učebních lekcí `cj-t2-l5` … `l8` (kontrolováno skriptem proti všem čtyřem).

## Nejistoty

- Žádné hodnocené slovo není neověřené; všechny čtyři lekce mají `kontrola.jistota: "jista"`.
- *strážce* (L5n U3, L8n U5) má v 1. p. mn. *strážci/strážcové* — nehodnotí se; v lekcích je jen 3. p. j. č. *strážci* (ÚJČ: *strážci, strážcovi*), dítě určuje jen vzor.
- Kódy `vzor-more-za-staveni`, `vzor-hrad-za-stroj`, `vzor-pan-za-muz` jsou použité oboustranně (popis v TYPY-CHYB je „zamění X/Y“) — rozhodnutí vedoucího, nový kód se nezavádí.
- Prahy `semafor_tydne` L8n při 12 koncovkách: zelená 11, oranžová 8 — schválil vedoucí.
- Validátor: jediná chyba je „nahrávka nemá řádek v AUDIO.md“ (2 nahrávky, řádky výše; po změně L6n platí znění s *vydru*).
