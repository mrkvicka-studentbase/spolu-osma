# Téma 1 — Slovní druhy, B-varianty (Spolu 8)

Verze 1.0, 9. 10. 2026. **Pro:** vedoucího (schválení), korektora ÚJČ (tabulky „Ověření ÚJČ“), autora nahrávek (oddíly „Nahrávky“ ke sloučení do `AUDIO.md`).

Podle `ZADANI-OSMA.md` §9 bod 4: B-varianta je stejná lekce s jinými větami a slovy, kterou aplikace nabídne po červeném semaforu (oranžová → jen ústní pětiminutovka). Soubor sdílí dva autoři: oddíl „B-varianty učebních lekcí“ (`cj-t1-l1b` … `cj-t1-l4b`) a oddíl „B-varianty naostro lekcí“ (`cj-t1-l1nb` … `cj-t1-l4nb`); každý píše jen do svého.

---

## B-varianty učebních lekcí

Autor: metodik a autor úloh ČJ Spolu 8, 9. 10. 2026. Podle `ZADANI-OSMA.md` §9 bod 4: ke každé učební lekci tématu 1 je B-varianta, kterou aplikace nabídne po **červené**. Stejná lekce, stejná obtížnost a stejné jevy, jen jiné věty a slova. JSON: `obsah/cestina/lekce/cj-t1-l1b.json` až `cj-t1-l4b.json`. Tabulky níže jsou vygenerované z JSON (indexy, správné odpovědi a kódy souhlasí); texty taháku, semaforu a tisku jsou jen v JSON.

**Společné:** hlavička (`tema`, `kapitola`, `tyden` 1, `poradi`, `cas_min` 25, `faze`) a `uvod_pravidla` jsou stejné jako u hlavní lekce (žádný řádek „Platí“ neobsahuje odpověď ani hodnocené slovo B-varianty); `uvod_pro_rodice` jednou větou říká, že jde o opakování po červené. Úlohy 1:1 s hlavní lekcí: stejné typy, `vstup.typ`, počty kroků, dlaždic, slov a rolí, poslech ve stejné úloze (L1b U3, L3b U2), L4b U5 týdenní (`tydenni`, `semafor_tydne` 9/7/0 beze změny), stejné kódy známých chyb a jejich počet. Hodnocená slova a věty nejsou z hlavní lekce ani z jejího naostro dvojčete; výjimky jsou nutné a jsou v „Nejistoty“.

### LEKCE 1b — Ohebné slovní druhy, B-varianta (`cj-t1-l1b`) · poslech U3

B-varianta `cj-t1-l1`. `tema` „Ohebné slovní druhy“ · `kapitola` `slovni-druhy` · `tyden` 1, `poradi` 1 · `cas_min` 25.

**Platí:** `Ohebné slovo mění tvar: pes – psa` (co to je) · `Zkus: bez ___, k ___, já/on ___` (test) · `šestý = číslovka · tvůj = zájmeno` (příklad)

| # | Typ | Co hodnotí | Vstup | Správně | Známé chyby | Jiné než hlavní lekce |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4) | Ledoborec ze společného základu (Z1): poznat podstatné jméno (ten, ta, to), přídavné jméno (jaký?) a sloveso (on ___) a nenechat se zmást slovem, které říká jak nebo kdy. | `k1` `dlazdice` „Řada A“: skáče · smutný · smutně · smutek<br>`k2` `dlazdice` „Řada B“: čistota · čistil · čistý · čistě<br>`k3` `dlazdice` „Řada C“: lyžování · lyžuje · lyžařský · často<br>`final` `dlazdice` „Řada D“: zpěv · zpívá · zpěvně · zpěvný | `k1` smutek<br>`k2` čistota<br>`k3` lyžuje<br>`final` zpěvný | `k1` skáče → `sd-sloveso-za-podstatne`; smutný → `sd-pridavne-za-podstatne`; smutně → `sd-prislovce-za-podstatne`<br>`k2` čistil → `sd-sloveso-za-podstatne`; čistý → `sd-pridavne-za-podstatne`; čistě → `sd-prislovce-za-podstatne`<br>`k3` lyžování → `sd-podstatne-za-sloveso`; lyžařský → `sd-pridavne-za-sloveso`; často → obecná<br>`final` zpěv → `sd-podstatne-za-pridavne`; zpívá → `sd-sloveso-za-pridavne`; zpěvně → `sd-prislovce-za-pridavne` | jiné rodiny slov (smutek, čistota, lyžování, zpěv), pasti stejného druhu |
| 2 | nová (5) | Rozhodnout u osmi slov, která mění tvar (ohebná), a nenechat se zmást stupňováním příslovce (pozdě – později). | `final` `dlazdice_vice`: Ema · pozdě · napsal · v · čtyři · nějaký · protože · široký | `final` Ema, napsal, čtyři, nějaký, široký | `final` navíc pozdě → `ohebnost-stupnovani`; ostatní → obecná | jiných 8 slov, past pozdě místo rychle |
| 3 | nová (5) | Ve slyšené větě určit druh slova sedmé (číslovka, ne přídavné jméno) a slova vy (zájmeno, ne podstatné jméno). | `k1` `poslech` `audio/cestina/t1/l1b-u3.mp3`, otázka „Jaký slovní druh je slovo „sedmé“?“, dlaždice: podstatné jméno · přídavné jméno · zájmeno · číslovka<br>`final` `poslech` `audio/cestina/t1/l1b-u3.mp3`, otázka „Jaký slovní druh je slovo „vy“?“, dlaždice: podstatné jméno · přídavné jméno · zájmeno · číslovka | `k1` číslovka<br>`final` zájmeno | `k1` podstatné jméno → obecná; přídavné jméno → `cislovka-za-pridavne`; zájmeno → obecná<br>`final` podstatné jméno → `zajmeno-za-podstatne`; přídavné jméno → obecná; číslovka → obecná | jiná věta, sedmé a vy místo pátý a my |
| 4 | detektiv (5) | Najít u Petra přivlastňovací zájmeno (Její) určené jako přídavné jméno a říct správný druh. | `k1` `klik_ve_textu` max 1, tokeny: Její(0) bratr(1) chová(2) pět(3) koček(4)<br>`final` `dlazdice` „Jaký druh to slovo je?“: číslovka · zájmeno · sloveso · podstatné jméno | `k1` Její(0)<br>`final` zájmeno | `k1` navíc bratr, pět → `detektiv-jine-slovo`; ostatní → obecná<br>`final` číslovka → `detektiv-oprava-jine-chyby`; sloveso → `detektiv-oprava-jine-chyby`; podstatné jméno → `detektiv-oprava-jine-chyby` | jiná věta, Její místo Můj |
| 5 | kontrolní (6) | Samostatně určit pět ohebných druhů u šesti slov ve dvou větách, včetně pastí Jejich, prvním a několik. | `final` `oznac_role` (5 rolí), `slova`: Jejich(0), pes(1), běhal(2), prvním(6), několik(9), dlouhých(10) | `final` Jejich zájmeno, pes podstatné jméno, běhal sloveso, prvním číslovka, několik číslovka, dlouhých přídavné jméno | `final` Jejich → přídavné jméno → `zajmeno-za-pridavne`; prvním → přídavné jméno → `cislovka-za-pridavne`; několik → zájmeno → `cislovka-jen-cislice`; několik → přídavné jméno → `cislovka-jen-cislice`; ostatní → obecná | jiná věta, Jejich a prvním místo Naše a Třetí; několik zůstává (jediná číslovka neurčitá bez sporu) |

Přepis nahrávky (jen pro rodiče, sbalený): **„Sedmé kolo soutěže jste vy dva vyhráli úplně bez chyby.“**

### LEKCE 2b — Neohebné slovní druhy, B-varianta (`cj-t1-l2b`)

B-varianta `cj-t1-l2`. `tema` „Neohebné slovní druhy“ · `kapitola` `slovni-druhy` · `tyden` 1, `poradi` 2 · `cas_min` 25.

**Platí:** `Příslovce: jak? kde? kdy? (doma)` (co to je) · `Předložka stojí před jménem: na` (test) · `nebo = spojka · fuj = citoslovce` (příklad)

| # | Typ | Co hodnotí | Vstup | Správně | Známé chyby | Jiné než hlavní lekce |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4) | Ledoborec z lekce 1: najít zájmeno, číslovku, ohebné slovo a přídavné jméno; pasti tvůj a desátý (mění se jako přídavná jména) a vysoko (jde stupňovat). | `k1` `dlazdice` „Řada A“: sestra · chytrý · ona · pozdě<br>`k2` `dlazdice` „Řada B“: čtvrtý · hřiště · domů · starý<br>`k3` `dlazdice` „Řada C“: letos · sešit · vysoko · vždycky<br>`final` `dlazdice` „Řada D“: radost · tvůj · radostný · desátý | `k1` ona<br>`k2` čtvrtý<br>`k3` sešit<br>`final` radostný | `k1` sestra → obecná; chytrý → obecná; pozdě → obecná<br>`k2` hřiště → obecná; domů → obecná; starý → obecná<br>`k3` letos → obecná; vysoko → `ohebnost-stupnovani`; vždycky → obecná<br>`final` radost → `sd-podstatne-za-pridavne`; tvůj → `zajmeno-za-pridavne`; desátý → `cislovka-za-pridavne` | jiné řady, pasti tvůj, desátý, vysoko, radost místo můj, pátý, rychle, moře |
| 2 | nová (5) | Přiřadit k tučnému slovu ve větě jeden z pěti neohebných druhů podle jeho testu. | `k1` `dlazdice` „A) dole“: příslovce · předložka · spojka · částice · citoslovce<br>`k2` `dlazdice` „B) mezi“: příslovce · předložka · spojka · částice · citoslovce<br>`k3` `dlazdice` „C) když“: příslovce · předložka · spojka · částice · citoslovce<br>`final` `dlazdice` „D) Ať“: příslovce · předložka · spojka · částice · citoslovce | `k1` příslovce<br>`k2` předložka<br>`k3` spojka<br>`final` částice | `k1` předložka → `prislovce-za-predlozku`; spojka → obecná; částice → obecná; citoslovce → obecná<br>`k2` příslovce → `predlozka-za-prislovce`; spojka → obecná; částice → obecná; citoslovce → obecná<br>`k3` příslovce → obecná; předložka → obecná; částice → `spojka-za-castici`; citoslovce → obecná<br>`final` příslovce → obecná; předložka → obecná; spojka → `spojka-za-castici`; citoslovce → obecná | dole, v, když, Ať místo venku, pod, ale, Kéž |
| 3 | nová (5) | Poznat, že o druhu slova vedle rozhoduje věta: stojí samo (příslovce), nebo před jménem (předložka). | `k1` `dlazdice` „A) Adam střílel **vedle**.“: příslovce · předložka<br>`final` `dlazdice` „B) Ema si sedla **vedle** Lucky.“: příslovce · předložka | `k1` příslovce<br>`final` předložka | `k1` předložka → `prislovce-za-predlozku`<br>`final` příslovce → `predlozka-za-prislovce` | vedle místo kolem (SSČ přísl. i předl.) |
| 4 | detektiv (5) | Najít u Petra příslovce vesele určené jako přídavné jméno a říct správný druh. | `k1` `klik_ve_textu` max 1, tokeny: Klára(0) běžela(1) vesele(2) domů(3) když(4) skončila(5) škola(6)<br>`final` `dlazdice` „Jaký druh to slovo je?“: spojka · příslovce · předložka · přídavné jméno | `k1` vesele(2)<br>`final` příslovce | `k1` navíc domů, když → `detektiv-jine-slovo`; ostatní → obecná<br>`final` spojka → `detektiv-oprava-jine-chyby`; předložka → `detektiv-oprava-jine-chyby`; přídavné jméno → `sd-prislovce-za-pridavne` | jiná věta, vesele místo rychle |
| 5 | kontrolní (6) | Samostatně určit pět neohebných druhů u šesti slov ve dvou větách (s před jménem, Kéž s přáním, a mezi dvěma větami). | `final` `oznac_role` (5 rolí), `slova`: Jejda(0), letos(1), s(3), Kéž(7), dlouho(10), a(11) | `final` Jejda citoslovce, letos příslovce, s předložka, Kéž částice, dlouho příslovce, a spojka | `final` Kéž → spojka → `spojka-za-castici`; a → částice → `spojka-za-castici`; s → příslovce → `predlozka-za-prislovce`; letos → předložka → `prislovce-za-predlozku`; ostatní → obecná | jiná věta, Jejda, letos, s, dlouho místo Hurá, zítra, k, hezky; a spojuje dvě věty; Kéž zůstává (jen kéž/ať) |

### LEKCE 3b — Všech deset druhů: rozhoduje věta, B-varianta (`cj-t1-l3b`) · poslech U2

B-varianta `cj-t1-l3`. `tema` „Všech deset druhů: rozhoduje věta“ · `kapitola` `slovni-druhy` · `tyden` 1, `poradi` 3 · `cas_min` 25.

**Platí:** `Druh určuje věta, ne slovo samo` (co to je) · `Je před ním ten? Ptám se kdy?` (test) · `vedle domu × sedí vedle` (příklad)

| # | Typ | Co hodnotí | Vstup | Správně | Známé chyby | Jiné než hlavní lekce |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4) | Ledoborec z lekce 2: určit neohebný druh tučného slova ve větě (nahoru, v, protože, Bum). | `k1` `dlazdice` „Řada A“: příslovce · předložka · spojka · částice · citoslovce<br>`k2` `dlazdice` „Řada B“: příslovce · předložka · spojka · částice · citoslovce<br>`k3` `dlazdice` „Řada C“: příslovce · předložka · spojka · částice · citoslovce<br>`final` `dlazdice` „Řada D“: příslovce · předložka · spojka · částice · citoslovce | `k1` příslovce<br>`k2` předložka<br>`k3` spojka<br>`final` citoslovce | `k1` předložka → `prislovce-za-predlozku`; spojka → obecná; částice → obecná; citoslovce → obecná<br>`k2` příslovce → `predlozka-za-prislovce`; spojka → obecná; částice → obecná; citoslovce → obecná<br>`k3` příslovce → obecná; předložka → obecná; částice → `spojka-za-castici`; citoslovce → obecná<br>`final` příslovce → obecná; předložka → obecná; spojka → obecná; částice → obecná | nahoru, v, protože, Bum místo dolů, na, nebo, Fuj |
| 2 | nová (5) | Ve slyšené větě určit druh slov večer (příslovce: kdy?) a naproti (předložka: naproti kinu) podle toho, jak jsou ve větě použitá. | `k1` `poslech` `audio/cestina/t1/l3b-u2.mp3`, otázka „Jaký slovní druh je ve větě slovo „večer“?“, dlaždice: podstatné jméno · příslovce · předložka · číslovka<br>`final` `poslech` `audio/cestina/t1/l3b-u2.mp3`, otázka „Jaký slovní druh je ve větě slovo „naproti“?“, dlaždice: podstatné jméno · příslovce · předložka · číslovka | `k1` příslovce<br>`final` předložka | `k1` podstatné jméno → `sd-prislovce-za-podstatne`; předložka → obecná; číslovka → obecná<br>`final` podstatné jméno → obecná; příslovce → `predlozka-za-prislovce`; číslovka → obecná | jiná nahrávka, naproti místo kolem; večer je jev lekce |
| 3 | nová (5) | V jedné větě určit druh šesti slov z nabídky osmi druhů, včetně slova večer jako podstatného jména (tento večer). | `final` `oznac_role` (8 rolí), `slova`: Tento(0), večer(1), v(3), spolu(5), čtyři(8), filmy(9) | `final` Tento zájmeno, večer podstatné jméno, v předložka, spolu příslovce, čtyři číslovka, filmy podstatné jméno | `final` večer → příslovce → `sd-podstatne-za-prislovce`; Tento → přídavné jméno → `zajmeno-za-pridavne`; čtyři → přídavné jméno → `cislovka-za-pridavne`; v → příslovce → `predlozka-za-prislovce`; ostatní → obecná | jiná věta, Tento, v, spolu, čtyři místo Ten, s, dlouho, dvě |
| 4 | detektiv (5) | Najít u Petra slovo večer určené jako podstatné jméno tam, kde odpovídá na kdy? (příslovce). | `k1` `klik_ve_textu` max 1, tokeny: Lucka(0) šla(1) ven(2) teprve(3) večer(4)<br>`final` `dlazdice` „Jaký druh to slovo je?“: sloveso · podstatné jméno · příslovce · předložka | `k1` večer(4)<br>`final` příslovce | `k1` navíc šla, ven → `detektiv-jine-slovo`; ostatní → obecná<br>`final` sloveso → `detektiv-oprava-jine-chyby`; podstatné jméno → `sd-prislovce-za-podstatne`; předložka → `detektiv-oprava-jine-chyby` | jiná věta (Lucka šla ven teprve večer.) |
| 5 | kontrolní (6) | Samostatně určit druh osmi slov ve dvou větách se všemi pastmi tématu (Její, šestý, večer, uprostřed, nahoře). | `final` `oznac_role` (8 rolí), `slova`: Její(0), šestý(1), závod(2), večer(4), Běžela(5), uprostřed(6), protože(8), nahoře(9) | `final` Její zájmeno, šestý číslovka, závod podstatné jméno, večer příslovce, Běžela sloveso, uprostřed předložka, protože spojka, nahoře příslovce | `final` večer → podstatné jméno → `sd-prislovce-za-podstatne`; uprostřed → příslovce → `predlozka-za-prislovce`; Její → přídavné jméno → `zajmeno-za-pridavne`; šestý → přídavné jméno → `cislovka-za-pridavne`; ostatní → obecná | jiná věta, Její, šestý, uprostřed, nahoře místo Náš, pátý, kolem, venku |

Přepis nahrávky (jen pro rodiče, sbalený): **„Večer jsme stáli naproti kinu a čekali na Lucku.“**

### LEKCE 4b — Kontrola tématu: slovní druhy, B-varianta (`cj-t1-l4b`)

B-varianta `cj-t1-l4`. `tema` „Kontrola tématu: slovní druhy“ · `kapitola` `slovni-druhy` · `tyden` 1, `poradi` 4 · `cas_min` 25.

**Platí:** `Ohebné: 5 druhů, neohebné: 5 druhů` (co to je) · `Test: ten? jaký? on ___? kolik? kde?` (test) · `kolem domu = předložka` (příklad)

| # | Typ | Co hodnotí | Vstup | Správně | Známé chyby | Jiné než hlavní lekce |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4) | Ledoborec z lekcí 1–3: ohebnost slova hezky, druh slov okolo (samo), několik a kéž (přání). | `k1` `dlazdice` „Řada A“: ano · ne<br>`k2` `dlazdice` „Řada B“: příslovce · předložka · spojka · částice<br>`k3` `dlazdice` „Řada C“: číslovka · zájmeno · přídavné jméno · příslovce<br>`final` `dlazdice` „Řada D“: spojka · částice · příslovce · citoslovce | `k1` ne<br>`k2` příslovce<br>`k3` číslovka<br>`final` částice | `k1` ano → `ohebnost-stupnovani`<br>`k2` předložka → `prislovce-za-predlozku`; spojka → obecná; částice → obecná<br>`k3` zájmeno → `cislovka-jen-cislice`; přídavné jméno → `cislovka-jen-cislice`; příslovce → obecná<br>`final` spojka → `spojka-za-castici`; příslovce → obecná; citoslovce → obecná | hezky, okolo, Kéž místo rychle, kolem, Ať; několik v nové větě |
| 2 | nová (5) | Vybrat z osmi slov všechna neohebná, i pozdě (stupňuje se, ale tvar nemění) a vždycky; šest nechat stranou (mění tvar). | `final` `dlazdice_vice`: pozdě · šest · vždycky · k · sešit · fuj · když · četla | `final` pozdě, vždycky, k, fuj, když | `final` chybí pozdě → `ohebnost-stupnovani`; ostatní → obecná | jiných 8 slov, past pozdě místo rychle, vždycky místo bohužel |
| 3 | nová (5) | Určit druh u čtyř pastí tématu ve větě: Moje (zájmeno), sedmý (číslovka), večer (kdy? příslovce) a Kéž (přání, částice). | `k1` `dlazdice` „A) Moje“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice<br>`k2` `dlazdice` „B) sedmý“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice<br>`k3` `dlazdice` „C) večer“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice<br>`final` `dlazdice` „D) Kéž“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice | `k1` zájmeno<br>`k2` číslovka<br>`k3` příslovce<br>`final` částice | `k1` přídavné jméno → `zajmeno-za-pridavne`; číslovka → obecná; podstatné jméno → obecná; příslovce → obecná; částice → obecná<br>`k2` přídavné jméno → `cislovka-za-pridavne`; zájmeno → obecná; podstatné jméno → obecná; příslovce → obecná; částice → obecná<br>`k3` přídavné jméno → obecná; zájmeno → obecná; číslovka → obecná; podstatné jméno → `sd-prislovce-za-podstatne`; částice → obecná<br>`final` přídavné jméno → obecná; zájmeno → obecná; číslovka → obecná; podstatné jméno → obecná; příslovce → obecná | Moje, sedmý, Kéž místo Náš, třetí, Ať; večer v nové větě |
| 4 | detektiv (5) | Najít u Petra číslovku několik určenou jako zájmeno a říct správný druh. | `k1` `klik_ve_textu` max 1, tokeny: V(0) bazénu(1) plavalo(2) několik(3) dětí(4)<br>`final` `dlazdice` „Jaký druh to slovo je?“: sloveso · číslovka · zájmeno · podstatné jméno | `k1` několik(3)<br>`final` číslovka | `k1` navíc bazénu, plavalo → `detektiv-jine-slovo`; ostatní → obecná<br>`final` sloveso → `detektiv-oprava-jine-chyby`; zájmeno → `cislovka-jen-cislice`; podstatné jméno → `detektiv-oprava-jine-chyby` | jiná věta (V bazénu plavalo několik dětí.) |
| 5 | kontrolní **týdenní** (6) | Týdenní kontrola: samostatně určit v textu všech deset slovních druhů, každý jednou (krok 1 ohebná slova, krok 2 neohebná). | `k1` `oznac_role` (5 rolí), `slova`: tvoje(1), chlupatá(2), kočka(3), chytila(5), osmou(6)<br>`final` `oznac_role` (5 rolí), `slova`: Fuj(0), včera(4), Ať(8), na(11), když(13) | `k1` tvoje zájmeno, chlupatá přídavné jméno, kočka podstatné jméno, chytila sloveso, osmou číslovka<br>`final` Fuj citoslovce, včera příslovce, Ať částice, na předložka, když spojka | `k1` tvoje → přídavné jméno → `zajmeno-za-pridavne`; osmou → přídavné jméno → `cislovka-za-pridavne`; ostatní → obecná<br>`final` Ať → spojka → `spojka-za-castici`; když → částice → `spojka-za-castici`; na → příslovce → `predlozka-za-prislovce`; včera → předložka → `prislovce-za-predlozku`; ostatní → obecná | jiný text, Fuj, tvoje, osmou, Ať, na, když místo Hurá, náš, třetí, Kéž, v, ale |

### Nahrávky B-variant učebních lekcí (pro AUDIO.md)

Dvě nahrávky poslechu, stejný hlas a nastavení jako `t1/l1-u3.mp3` a `t1/l3-u2.mp3` (`NAHRAVKY-NAVOD.md`). `AUDIO.md` jsem nepsal; do sloučení hlásí `seed:validace` u L1b a L3b jen „nahrávka nemá řádek v AUDIO.md“ a varování, že soubor zatím není.

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t1/l1b-u3.mp3` | 1b / úloha 3 (`k1` i `final`) | poslech | Sedmé kolo soutěže jste vy dva vyhráli úplně bez chyby. | Oznamovací intonace, nic nezdůrazňovat, hlavně ne „sedmé“ a „vy“; „vy dva“ bez důrazu na vy. Cca 4 s. | čeká na Pavla |
| `t1/l3b-u2.mp3` | 3b / úloha 2 (`k1` i `final`) | poslech | Večer jsme stáli naproti kinu a čekali na Lucku. | Oznamovací intonace; „Večer“ bez pauzy za ním (pauza by napověděla); „naproti kinu“ spojitě. Cca 4 s. | čeká na Pavla |

### Ověření ÚJČ (B-varianty učebních lekcí)

Druh (u ohebnosti a stupňování i 2. stupeň) každého hodnoceného slova jsem ověřil 9. 10. 2026 přes `nastroje/ujc.sh` (slovníková část, značky SSČ). Příručka byla přetížená (sdílená fronta), proto jsem hodnocená slova, která nešla dotázat, nahradil slovy už ověřenými v cache; tabulka uvádí slova, která v `TEMA-1.md` a `TEMA-1-NAOSTRO.md` ještě nejsou, a homonyma.

| heslo | kde | údaj v příručce (SSČ) | výsledek |
|---|---|---|---|
| smutek, smutný, smutně, skákat | L1b U1 A | m.; příd.; *smutně přísl.*; ned. (*skáče*) | OK |
| čistota, čistit, čistý, čistě | L1b U1 B | ž.; ned.; příd.; *čistě přísl.* | OK (*čistí* vyřazeno: zní i jako příd. *čistí kluci*, proto *čistil*) |
| lyžování, lyžovat, lyžařský, často | L1b U1 C | s.; ned.; příd. (heslo *lyžař*); přísl. | OK |
| zpěv, zpívat, zpěvný, zpěvně | L1b U1 D | m.; ned.; příd.; *zpěvně přísl.* | OK |
| **vyřazeno** *taneční* | původní L1b U1 A | dvě hesla: *taneční ž.* (taneční kurz) i příd. — „ta taneční“ projde testem | nahrazeno *smutný* |
| pozdě, vysoko, hezky, dlouho | L1b U2; L2b U1, U5; L4b U1, U2 | přísl., 2. st. *později, výše/výš, hezčeji, déle* (stupňování, ne změna tvaru) | OK |
| Ema, napsat, v, čtyři, nějaký, protože, široký | L1b U2 | jméno; dok.; předl.; čísl. zákl. (*čtyřem, čtyřmi*; 2. p. *čtyř/čtyřech* dubleta, nepoužito); zájm. neurč.; sp. podř.; příd. | OK |
| sedmý, šestý, desátý, první, čtvrtý, osmý | L1b U3, U5; L2b U1; L3b U5; L4b U3, U5 | čísl. řad. (v heslech *sedm, šest, deset*; *první* čísl. řad.) | OK |
| vy, její, jejich, tvůj, můj | L1b U3, U4, U5; L2b U1; L3b U5; L4b U3, U5 | zájm. os.; zájm. přivl. (*její j. ž, jejich mn. neskl.*); zájm. přivl. | OK |
| bratr, pět, kočka, pes, běhat, výlet, dlouhý, několik | L1b U4, U5 | m.; čísl. zákl. (heslo *pět* má i sloveso — ve větě jen číslovka); ž.; m.; ned.; m.; příd.; čísl. neurč. | OK |
| sestra, chytrý, ona, hřiště, domů, starý, sešit, radost, radostný, vždycky | L2b U1; L4b U2 | ž.; příd.; zájm. os.; s.; přísl.; příd. (i *starý m. živ.* — v řadě jen nabídka, nehodnotí se jako odpověď); m.; ž.; příd.; zájm. přísl. (jen ohebnost) | OK |
| dole, mezi, ať, kéž | L2b U2; L4b | přísl. (*dole* 2. st. *-ji*); předl. se 7. a 4. p.; *ať* sp. i **část. přací** („ať se ti něco hezkého zdá“), *kéž* část. přací | OK (*ať* jen na začátku věty s přáním) |
| vedle | L2b U3 | přísl. („střela šla vedle“) i předl. s 2. p. („sedí vedle ní“) | OK |
| veselý, vesele | L2b U4 | příd.; *vesele přísl.* | OK |
| jejda, s, letos, dlouho | L2b U1, U5 | citosl. „vyj. podiv“; předl.; přísl. „tohoto roku“; přísl. | OK |
| nahoru, protože, bum, nahoře | L3b U1, U5 | přísl.; sp. podř.; citosl.; přísl. | OK |
| večer | L3b U2–U5; L4b U3 | dvě hesla: *večer m. neživ.* i *večer přísl.* | OK |
| naproti, uprostřed, okolo | L3b U2, U5; L4b U1 | přísl. i předl. (*naproti* s 3. p., *uprostřed, okolo* s 2. p.); ve větách jednou samo, jednou před jménem | OK |
| spolu, čtyři, film, ven, závod, běžet | L3b U3–U5 | přísl.; čísl. zákl.; m.; přísl.; m.; ned. | OK |
| šest, k, fuj, číst, včera, chlupatý, chytit, myš, na, plavat, bazén, dítě | L4b U2, U4, U5 | čísl. zákl. (heslo *šestý*); předl.; citosl.; ned. (*četla*); přísl.; příd.; dok.; ž.; předl.; ned.; m.; s. (2. mn. *dětí*) | OK |
| když, tento | L2b U2, U4; L4b U2, U5; L3b U3 | sp. podř.; zájm. (ukaz.) | OK |
| **vyřazeno** *blízko* jako předložka, *kolem/okolo* v L2b a L3b | U3 / U2 | *blízko* SSČ jen přísl. (viz TEMA-1-NAOSTRO.md); *kolem* a *okolo* jsou hodnocené v L2, L3, L2n, L3n | nahrazeno *vedle*, *naproti*, *uprostřed* |

**[OVĚŘIT]: 0.** Odkazy na všechna hesla jsou v `kontrola.zdroj` každé lekce.

### Nejistoty a odchylky (B-varianty učebních lekcí)

1. **Slova, která se z hlavní lekce nebo naostro dvojčete opakovat musí** (vždy v nové větě): částice *kéž, ať* (OSNOVA §5 jiné nepřipouští; L2b, L4b), *několik* (jediná číslovka neurčitá bez sporu, *mnoho* je SSČ přísl.; L1b U5, L4b U1, U4 — u L4b je to jev detektiva), *večer* (jev L3 podle OSNOVA §5: název × *kdy?*; L3b U2–U5, L4b U3; náhrada *ráno/odpoledne* je v OSNOVA §16 sporná), spojka *a* v L2b U5 (jiné volné spojky jsou v L2/L2n hodnocené nebo v „Platí“). Ostatní hodnocená slova a všechny věty jsou nové (kontrola skriptem proti `cj-t1-l<n>` a `cj-t1-l<n>n`).
2. **L2b U5:** spojka *a* tu spojuje dvě věty (*vydržíme dlouho a nikdo neonemocní*), v hlavní L2 dvě slova (*hezky a teplo*); test „spojuje“ je stejný. Neoznačená slova *na, tam* (jako *teplo* v L2).
3. **L3b U3:** *Tento večer* (zájmeno + podstatné jméno) místo *Ten večer*; test lekce „je před ním ten?“ funguje i s *tento*, v taháku je obojí.
4. **L1b U5:** past zájmeno × přídavné jméno je *Jejich* (zájm. přivl. neskl., odpovídá na *čí?* stejně jako *Naše*). Test „místo něj jde říct něčí jméno“ sedí stejně.
5. **Nahrávky** `t1/l1b-u3.mp3`, `t1/l3b-u2.mp3` čekají na Pavla; řádky výš, `AUDIO.md` jsem nepsal.

### Korektura (B-varianty učebních lekcí, korektor 9. 10. 2026)

Hodnocené tvary všech čtyř lekcí znovu ověřené přes `nastroje/ujc.sh` (SSČ), vzorové odpovědi a každá známá chyba ověřené skriptem přes `vyhodnotKrok` (190 kontrol, 0 chyb), indexy tokenů přepočítané. Jazykové chyby v hodnoceném obsahu: 0. Opraveno:
1. **L4b U2:** v nabídce a tisku bylo *šestý*, tahák, řešení, otázky i semafor počítají se *šest* → *šest* (čísl. zákl., *se šesti*; hodnocení se nemění).
2. **L3b U5:** *závod odstartoval* → *závod začínal*; nelogické *protože nahoře svítily lampy* → *protože nahoře byla tma* (indexy beze změny).
3. **L2b U2 C:** hovorové *Pojedeme na kolo* → *Pojedeme na výlet, když bude hezky.*
4. **L2b U4:** otázka 3 taháku (*běžela jaká?, nebo jak?*) ukazovala v režimu „Dnes samo“ na chybné slovo → výčet všech testů.
5. Tabulka nahrávek: *Deváté kolo* → *Sedmé kolo* (JSON měl vždy *Sedmé*); L3b U1 „Jiné než hlavní lekce“: *protože*, ne *a*.

Opakování proti hlavní lekci a naostro dvojčeti jen podle rozhodnutí vedoucího (*kéž, ať, několik, večer*, spojka *a*). Obtížnost B-variant odpovídá hlavním lekcím (stejné pasti, stejný počet položek a rolí).
