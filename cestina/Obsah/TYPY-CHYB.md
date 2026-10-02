# Slovník typů chyb — Čeština: základy

Verze 1.1, 30. 9. 2026 (1.1 = sloučeny návrhy metodiků týdnů 2–8: 21 nových kódů, přejmenováno `pad-6-za-2` → `pad-2-za-6`, `pad-7-za-4` → `pad-4-za-7`, `shoda-a-za-y` → `shoda-y-za-a`; vedoucí výroby). Verze 1.0, 29. 9. 2026. Autor: Fable. Tým doplňuje nové kódy **jen s příkladem a lekcí**, kde se používají. Strojová podoba: `obsah/cestina/typy-chyb.json` (pole `kod`, `skupina`, `popis`, `priklad`, `lekce[]`, `otazka_pro_rodice`).

Kód = malá písmena bez diakritiky, skupina-jev. Každý kód má **otázku pro rodiče** — to je věta, kterou rodič přečte z taháku, když aplikace tuto chybu ukáže. Otázka nikdy neříká správnou odpověď.

Skupiny: `sd` slovní druhy · `rod`/`cislo`/`pad` kategorie podst. jmen · `zivotnost` · `vzor` · `koncovka` · `pridavne` · `zajmeno`/`cislovka`/`prislovce`/`predlozka`/`spojka` · `osoba`/`cas`/`zpusob` slovesa · `vs` vyjmenovaná slova · `podmet`/`prisudek` · `shoda` · `souveti` · `carka` · `me-mne`, `s-z` · `detektiv` · `diktat`.

## Slovní druhy (týden 1, 4)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `sd-pridavne-za-podstatne` | označí přídavné jméno jako podstatné | *malý* pes → klikne „malý“ | 1, 4 | „Zkus před to říct ten, ta, to. Ten malý… co? Chybí tam něco?“ |
| `sd-sloveso-za-podstatne` | označí sloveso jako podstatné jméno | *běží* | 1, 4 | „Dá se říct ‚to běží‘ jako věc? Nebo to někdo dělá?“ |
| `sd-vlastnost-neni-podstatne` | neuzná, že *radost, odvaha, plavání* jsou podstatná jména | vynechá „radost“ | 1 | „Jde říct ‚ta radost‘? Tak co to je?“ |
| `sd-podstatne-za-sloveso` | označí podstatné jméno slovesné jako sloveso | *běh* | 2, 20 | „Jde říct ‚on běh‘? Nebo ‚ten běh‘?“ |
| `sd-byt-neni-sloveso` | neoznačí slovesa, která „nic nedělají“: *je, jsou, byl, má, měl* (i v minulém čase) (upřesněno 30. 9., KONTROLA A3c) | vynechá „je“, „měla“ | 2 | „Jde říct ‚on je‘? Co to slovo ve větě dělá?“ |
| `sd-minuly-cas-neni-sloveso` | neoznačí tvar minulého času **dějového** slovesa (*šel, vstal, stihl*; ne *byl, měl* — ty jsou `sd-byt-neni-sloveso`) | vynechá „šel“ | 2 | „Jde říct ‚on šel‘? Tak?“ |
| `sd-infinitiv-neni-sloveso` | infinitiv (*běžet, plavat*) nevybere jako sloveso, protože test *on ___* nefunguje (doplněno 30. 9., dodávka 2) | vybere jen *běží*, vynechá *běžet* | 17, 20 | „Jde říct *musím ___*? Říká to slovo, co se dělá?“ |
| `sd-sloveso-za-pridavne` | označí sloveso jako přídavné jméno | *zelená se* | 3, 4 | „Ptáš se u toho jaký? Nebo co dělá?“ |
| `sd-pridavne-za-sloveso` | označí přídavné jméno jako sloveso | *unavený* | 3 | „Jde říct ‚on unavený‘? Nebo ‚jaký? unavený‘?“ |
| `sd-prislovce-za-pridavne` | příslovce označí jako přídavné jméno | *rychle* | 3, 16 | „Ptáš se jaký, nebo jak?“ |
| `sd-prislovce-za-podstatne` | příslovce (jak, kdy, kde) označí jako podstatné jméno (doplněno 30. 9., KONTROLA A6) | *rychle, tiše, vesele, včera* | 1 | „Jde říct ‚ten rychle‘? Říká to jak, ne co.“ |
| `sd-podstatne-za-pridavne` | podstatné jméno (název) označí jako přídavné jméno (doplněno 30. 9., KONTROLA A6) | *rychlost, zeleň, táta* místo *rychlý, zelený, tátovo* | 3, 4 | „Jde před to říct ten nebo ta? Tak je to název.“ |
| `prislovce-za-pridavne` | příslovce označí jako přídavné jméno (kód ponechán zvlášť od `sd-prislovce-za-pridavne` kvůli statistice lekce 16) | *hezky* | 16 | „Jaký, nebo jak?“ |
| `zajmeno-za-podstatne` | zájmeno označí jako podstatné jméno | *on, ona, to* | 15, 16 | „Je to jméno věci, nebo to stojí místo jména?“ |
| `zajmeno-za-pridavne` | přivlastňovací zájmeno (*můj, tvůj, náš*) určí jako přídavné jméno, protože odpovídá na *čí?* (doplněno 30. 9., dodávka 2) | *Můj kamarád* → přídavné jméno | 15, 16 | „Dá se místo toho slova říct něčí jméno? Zkus to.“ |
| `cislovka-za-pridavne` | číslovku řadovou označí jako přídavné jméno | *pátý* | 15, 16 | „Ptáš se jaký, nebo kolikátý?“ |
| `cislovka-jen-cislice` | neuzná číslovku zapsanou slovem | *mnoho, několik* | 15 | „Odpovídá to na kolik?“ |
| `predlozka-za-prislovce` | předložku označí jako příslovce | *na, pod* | 16 | „Stojí to samo, nebo před nějakým jménem?“ |
| `prislovce-za-predlozku` | příslovce místa (*venku, dole, nahoře*) určí jako předložku (doplněno 30. 9., dodávka 2) | *pes leží venku* → předložka | 16 | „Stojí to slovo před nějakým jménem, nebo samo?“ |
| `spojka-za-castici` | spojku/částici zamění | *ať, kéž* | 16 | „Spojuje to dvě věci, nebo vyjadřuje přání?“ |
| `test-zamena` | přiřadí k druhu slova test jiného druhu (ten/ta/to ↔ on ___ ↔ jaký?) (doplněno 30. 9., KONTROLA A6) | k podstatnému jménu přiřadí „jde říct on ___“ | 4 | „Vyzkoušej ten test nahlas na slově, které znáš. Sedí?“ |

## Kategorie podstatných jmen (týden 2)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `rod-podle-koncovky` | určí rod podle koncovky místo podle ten/ta/to | *táta* → ženský | 5, 8 | „Řekneš ten táta, nebo ta táta?“ |
| `rod-z-mnozneho-cisla` | rod slova v množném čísle určí podle *ty/ta* v množném čísle místo podle jednoho kusu (doplněno 30. 9., dodávka 2) | *kuřata* („ta kuřata“) → ženský; *hrady* („ty hrady“) → ženský | 5, 8 | „Řekni to slovo o jednom kusu. Ten, ta, nebo to?“ |
| `cislo-zamena` | zamění jednotné a množné číslo | *děti* → jednotné | 5 | „Je to jeden, nebo víc?“ |
| `pad-1-za-4` | 4. pád určí jako 1. („kdo co“ i u „koho co“) | *Vidím psa* → 1. p. | 6, 7, 8 | „Zeptej se s pomocným slovem: vidím koho, co? Nebo kdo, co to dělá?“ |
| `pad-4-za-1` | 1. pád (kdo, co to dělá) určí jako 4., protože „vidím ___“ zní dobře (doplněno 30. 9., dodávka 2) | *Na zahradě spí pes* → 4. p. | 6, 7, 8 | „Zeptej se slovem z věty: kdo, co to dělá? A dělá to samo, nebo to někdo dělá jemu?“ |
| `pad-2-za-4` | 4. pád určí jako 2. (stejný tvar *psa*) | *bez psa* / *vidím psa* | 6, 8 | „Které pomocné slovo tam pasuje: bez, nebo vidím?“ |
| `pad-otazka-bez-predlozky` | ptá se bez pomocného slova, pak nerozliší | „koho čeho“ vs. „koho co“ | 6, 7 | „Řekni otázku i s pomocným slovem.“ |
| `pad-2-za-6` | 6. pád určí jako 2. (přejmenováno 30. 9. z `pad-6-za-2` podle pravidla 1: kód = co dítě udělalo) | *o psu* → 2. p. | 7, 8 | „Je tam ‚o‘? Tak o kom, o čem.“ |
| `pad-4-za-7` | 7. pád určí jako 4. (přejmenováno 30. 9. z `pad-7-za-4`, pravidlo 1) | *s mámou*, *píše tužkou* → 4. p. | 7, 8 | „Je tam ‚s‘? S kým, s čím?“ |
| `pad-3-za-6` | 6. pád určí jako 3., protože tvar je stejný jako po *k* (doplněno 30. 9., dodávka 2) | *o škole, ve vlaku, na zahradě* → 3. p. | 7, 8 | „Jaké krátké slovo je před ním? Řekni otázku i s ním.“ |
| `pad-6-za-3` | 3. pád určí jako 6., protože tvar je stejný jako po *o* (doplněno 30. 9., dodávka 2) | *k vlaku, k řece* → 6. p. | 7, 8 | „Jaké krátké slovo je před ním? Řekni otázku i s ním.“ |
| `pad-5-neuzna` | oslovení určí jako 1. pád | *Petře!* → 1. p. | 7 | „Volá ho někdo? Tak který pád to je?“ |

## Životnost a vzory (týden 3)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `zivotnost-podle-vyznamu` | životnost určí podle toho, zda je věc živá | *strom* → životný | 9, 10 | „Nejde o to, jestli žije. Řekni: ten strom – vidím… co?“ |
| `zivotnost-mimo-muzsky-rod` | určuje životnost u ženského/středního rodu | *žena* → životná | 9 | „Jaký je rod? Životnost řešíme jen u ‚ten‘.“ |
| `vzor-pan-za-muz` | zamění pán/muž | *učitel* → pán | 10, 12 | „Řekni 2. pád: bez učitel-e nebo učitel-a?“ |
| `vzor-hrad-za-stroj` | zamění hrad/stroj | *pokoj* → hrad | 10, 12 | „Bez pokoj-e nebo pokoj-u?“ |
| `vzor-podle-1-padu` | vzor určí jen podle 1. pádu | *kost* → píseň (končí souhláskou) | 10, 11 | „Zkus 2. pád: bez kost-i nebo bez kost-ě?“ |
| `vzor-ruze-za-pisen` | zamění růže/píseň | *ulice* → píseň | 11 | „Končí to v 1. pádě na -e? Tak?“ |
| `vzor-pisen-za-kost` | zamění píseň/kost | *věc* → píseň | 11, 12 | „Bez věc-i nebo věc-e?“ |
| `vzor-more-za-staveni` | zamění moře/stavení | *náměstí* → moře | 11 | „Bez náměstí, nebo bez náměstě?“ |
| `vzor-muz-za-soudce` | zamění vzor muž a soudce (přehlédne, že slovo v 1. pádě končí na *-e*) (doplněno 30. 9., dodávka 2) | *průvodce* → muž; *brankář* → soudce | 10, 11, 12 | „Řekni to slovo s *ten*. Jakým písmenem končí? A jak končí vzor?“ |
| `vzor-pan-za-predseda` | zamění vzor pán a předseda (životné slovo na *-a* dá k pánovi) (doplněno 30. 9., dodávka 2) | *táta* → pán | 10, 12 | „Řekni *ten ___*. Končí slovo souhláskou, nebo samohláskou?“ |
| `vzor-more-za-kure` | zamění vzor moře a kuře (nevyzkouší 2. pád) (doplněno 30. 9., dodávka 2) | *kotě* → moře; *hřiště* → kuře | 11, 12 | „Řekni *bez ___*. Přibude na konci kousek slova, nebo zůstane stejné?“ |
| `koncovka-podst-i-za-y` | v koncovce podst. jména napíše i místo y | *mezi domi* | 12, 16, 24, 28, 32 | „Který vzor? Dosaď ho: mezi hrad-?“ |
| `koncovka-podst-y-za-i` | napíše y místo i | *s kostmy* | 12, 16, 24, 28, 32 | „Který vzor? Dosaď ho.“ |
| `vzor-neurcen` | doplní písmeno bez určení vzoru („podle citu“) | | 12 | „Podle čeho jsi to vybral? Který vzor?“ |

## Přídavná jména (týden 4)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `pridavne-tvrde-za-mekke` | měkké (jarní) určí jako tvrdé nebo naopak | *cizí* → tvrdé | 13 | „Řekni to s ten, ta, to. Mění se konec?“ |
| `privlastnovaci-neuzna` | *tátovo, sestřin* neoznačí jako přídavné jméno | | 13 | „Ptáš se čí? Tak co to je?“ |
| `pridavne-privlastnovaci-za-tvrde` | přivlastňovací přídavné jméno určí jako tvrdé, protože se mu s *ten, ta, to* mění konec (doplněno 30. 9., dodávka 2) | *Tomášova taška* → tvrdé | 13, 14 | „Na jakou otázku to slovo odpovídá: *jaký?*, nebo *čí?*“ |
| `koncovka-prid-y-za-i` | *malý psi* | | 14, 16, 32 | „Jde říct TI malí? Nebo TEN malý?“ |
| `koncovka-prid-i-za-y` | *malí pes* | | 14, 16 | „Ten, nebo ti?“ |
| `pridavne-shoda-s-jinym-jmenem` | koncovku přizpůsobí jinému slovu ve větě | *velcí okna* (podle „lidé“ jinde) | 14 | „Ke kterému slovu to přídavné jméno patří?“ |

## Slovesa (týden 5)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `osoba-podle-podmetu-slova` | osobu určí podle toho, o kom se mluví, ne podle tvaru | *Petr píše* → 1. os. („protože Petr“) | 17, 20 | „Dosaď: já píše, nebo on píše?“ |
| `infinitiv-urci-osobu` | u infinitivu určí osobu | *psát* → 3. os. | 17 | „Jde říct on psát? Má to vůbec osobu?“ |
| `cas-budouci-za-pritomny` | budoucí tvar bez *bude* (*napíšu, přijedeš, pojedeme*) určí jako přítomný (rozšířeno 30. 9.) | *napíšu* → přítomný | 18, 20 | „Děje se to teď, nebo až potom?“ |
| `cas-minuly-neuzna-bez-jsem` | tvar *psal* bez „jsem“ neurčí jako minulý | | 18 | „Stalo se to už? Končí na -l?“ |
| `zpusob-rozkaz-za-oznam` | rozkaz určí jako oznamovací | *Piš!* → oznamovací | 19, 20 | „Někdo to říká, nebo přikazuje?“ |
| `zpusob-podmin-za-oznam` | tvar s *bych, bys, by, bychom, byste* určí jako oznamovací (přehlédne *by*) (doplněno 30. 9., dodávka 2) | *Psal bys dopis?* → oznamovací | 19, 20 | „Je u toho slovesa ještě nějaké malé slovo? Co říká?“ |
| `zpusob-byl-za-podminovaci` | tvar minulého času *byl, byla, bylo, byli* považuje za podmiňovací, protože začíná na *by* (doplněno 30. 9., dodávka 2) | *Byl jsem venku.* → podmiňovací | 19, 20 | „Řekni to slovo celé. Je to samostatné *by*, nebo jiné slovo? Kdy se to stalo?“ |
| `bysme-za-bychom` | napíše/vybere *bysme* | | 19, 20 | „Jak se to řekne správně u ‚my‘? My… bychom.“ — *pozn.: tahák dává tvar, protože jde o čistou znalost* |
| `by-jsme-za-bychom` | napíše *by jsme* | | 19, 20 | „Je to jedno slovo, nebo dvě?“ |
| `by-jsem-za-bych` | napíše nebo vybere *by jsem, by jsi, by jste* místo jednoslovného tvaru (doplněno 30. 9., dodávka 2) | *Já by jsem si dal zmrzlinu.* | 19, 20 | „Je to jedno slovo, nebo dvě? Řekni celou řadu od *já* po *oni*.“ |
| `by-i-za-y` | v *bych, bys, by, bychom, byste* napíše *i* (*bich, bis, bi*) (doplněno 30. 9., dodávka 2) | *Dnes bich rád hrál fotbal.* | 20, 24, 28, 32 | „Jak píšeš slovo *byl*? Ze stejného slova je i tohle.“ |

## Vyjmenovaná slova (týden 6)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `vs-b-i-za-y` / `vs-b-y-za-i` | i/y po B | *bidlit* / *byčí* (býčí je správně → kód jen u chyb) | 21–24 | „Je to vyjmenované slovo, nebo příbuzné s nějakým? S kterým?“ |
| `vs-l-i-za-y` / `vs-l-y-za-i` | po L | *mlín* / *lyst* | 21–24 | totéž |
| `vs-m-i-za-y` / `vs-m-y-za-i` | po M | *mislet* / *mýsa* | 22–24 | totéž |
| `vs-p-i-za-y` / `vs-p-y-za-i` | po P | *pitel* / *pysmo* | 22–24 | totéž |
| `vs-s-i-za-y` / `vs-s-y-za-i` | po S | *sichravý* / *syla* | 23, 24 | totéž |
| `vs-v-i-za-y` / `vs-v-y-za-i` | po V | *visoký* / *vydět* | 23, 24 | totéž |
| `vs-z-i-za-y` / `vs-z-y-za-i` | po Z | *jazik* / *zyma* | 23, 24 | totéž |
| `vs-pribuzne-neuzna` | nepozná příbuzné slovo | *obyvatel* → i | 21–24 | „Od kterého slova je to odvozené?“ |
| `vs-predpona-vy-i` | v předponě vy- napíše i | *viběhnout* | 23, 24 | „Je tam vy- jako předpona? Vy-běhnout, vy-jít?“ |
| `vs-dvojice-vyznam` | zamění dvojici podle významu | *výr × vír*, *být × bít* | 21–24 | „Co to slovo ve větě znamená? Které z dvojice to je?“ |
| `vs-rada-poradi` | seřadí vyjmenovaná slova v jiném pořadí, než jdou v řadě (doplněno 30. 9., dodávka 2) | *bylina, být, …* místo *být, obyvatel, …* | 22 | „Řekni celou řadu nahlas od začátku, pomalu. Sedí to pořadí s tím, co máš na obrazovce?“ |

## Podmět, přísudek, shoda (týden 7)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `podmet-za-predmet` | za podmět označí předmět (4. pád) | *Petr vidí psa* → podmět „psa“ | 25, 28 | „Kdo to dělá? Kdo vidí?“ |
| `podmet-prvni-slovo` | za podmět vezme první slovo věty | *Včera přišel táta* → „Včera“ | 25 | „Zeptej se u slovesa: kdo, co přišel?“ |
| `prisudek-neni-sloveso` | za přísudek označí jiné slovo | | 25, 28 | „Které slovo říká, co se děje?“ |
| `podmet-prisudek-zamena` | za podmět označí přísudek (sloveso), nebo naopak (doplněno 30. 9., dodávka 2) | *Kluci hrají fotbal.* → podmět „hrají“ | 25, 26, 28 | „Které slovo říká, co se děje? A které říká, kdo to dělá?“ |
| `shoda-y-za-i` | *chlapci běželY* | | 26–28, 32 | „Kdo běžel? Řekneš TI chlapci? Tak?“ |
| `shoda-i-za-y` | *stromy rostlI* / *ženy šlI* | | 26–28, 32 | „Ti stromy, nebo ty stromy?“ |
| `shoda-y-za-a` | u podmětu středního rodu v množném čísle napíše *y* místo *a* (přejmenováno 30. 9. z `shoda-a-za-y`, pravidlo 1) | *kuřata pípalY* | 26, 28 | „Ta kuřata → jaké písmeno?“ |
| `shoda-podle-blizkeho-slova` | shodu udělá podle slova vedle slovesa, ne podle podmětu | *Míče kluků leželi v trávě* (příklad změněn 30. 9.: „Děti s tátou přišli“ připouští podle příručky id=601 obě shody) | 26, 27 | „Kdo leží? Míče, nebo kluci?“ |
| `shoda-nekolikanasobny-y` | u více podmětů s mužským životným napíše y | *Máma a táta přišly* | 27, 28 | „Je mezi nimi někdo, komu řekneš TEN a je živý?“ |
| `shoda-nevyjadreny-neurcen` | u chybějícího podmětu neví, podle čeho | *(Oni) Přišl_ pozdě.* | 27 | „Kdo přišel? Dosaď si ho z předchozí věty.“ |
| `shoda-deti-i` | *děti si hrálI* | | 27, 28 | „Ty děti, nebo ti děti?“ |
| `shoda-rodice-lide-y` | u podmětu *rodiče, lidé* napíše -y („ty rodiče“) (doplněno 30. 9., dodávka 2) | *Rodiče přijely.* | 27, 28 | „Řekni nahlas: *ti rodiče*, nebo *ty rodiče*? Jak to zní ve škole?“ |

## Věta, souvětí, čárka (týden 8)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `souveti-pocet-podle-spojek` | počítá věty podle spojek/čárek, ne podle přísudků | *Petr, Jana a Tom přišli* → 3 věty | 29, 32 | „Kolik je tam sloves, která něco dělají?“ |
| `souveti-infinitiv-jako-veta` | infinitiv počítá jako samostatnou větu | *Chci jít domů* → 2 věty | 29 | „Má ‚jít‘ svou osobu? Nebo patří k ‚chci‘?“ |
| `carka-chybi-ze` | chybí čárka před *že* | | 30, 32 | „Kolik je tam vět? Kde jedna končí a druhá začíná?“ |
| `carka-chybi-ktery` | chybí čárka před *který* | | 30, 32 | totéž |
| `carka-chybi-pred-spojkou` | nenapíše čárku před jinou spojkou než *že* a *který* (*protože, aby, když, ale*) (doplněno 30. 9., dodávka 2) | *Lucka se učila celý večer protože chtěla…* | 30, 32 | „Kolik je tam vět? Kde jedna končí a druhá začíná?“ |
| `carka-chybi-za-uvodni-vetou` | nenapíše čárku za větou na začátku souvětí (*Když…*) (doplněno 30. 9., dodávka 2) | *Když hra skončila všichni tleskali.* | 30, 32 | „Najdi obě slovesa. Kde končí první věta a začíná druhá?“ |
| `carka-navic-a` | čárka před *a* při pouhém spojení | *Přišel, a sedl si.* | 30 | „Spojuje to ‚a‘ jen dvě věci za sebou?“ |
| `carka-pred-a-vzdy` | dítě tvrdí, že před *a* se čárka nepíše nikdy / píše vždy | | 30 | „Platí to vždy? Co říká pravidlo v taháku?“ |

## mě/mně, s/z (lekce 31)

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `me-mne-zamena` | *dej to mě* / *vidí mně* | | 31, 32 | „Dosaď tě nebo tobě. Které pasuje?“ |
| `s-z-predlozka-zamena` | *jdu s domu* / *z mámou* | | 31, 32 | „S kým, s čím – nebo z koho, z čeho?“ |
| `predlozka-se-za-zajmeno` | předložku *se* (*se mnou*) určí jako zájmeno *se* u slovesa (doplněno 30. 9., dodávka 2) | *půjde se mnou* → zájmeno | 32 | „Stojí to slovo před někým (s kým?), nebo patří ke slovesu?“ |

## Detektiv a diktát (všechny lekce)

| Kód | Co se stane | Otázka pro rodiče |
|---|---|---|
| `detektiv-jine-slovo` | dítě klikne na správné slovo (které chybu nemá) | „Petr měl chybu jen v jednom slově. Zkontroluj to označené znovu podle testu.“ |
| `detektiv-oprava-jine-chyby` | najde správné slovo, ale zvolí špatný důvod/opravu | „Slovo máš. Proč je špatně? Vezmi test z taháku.“ |
| `diktat-vynechane-slovo` | ve zápisu chybí slovo | „Přehraj si větu ještě jednou a počítej slova.“ |
| `diktat-jine-slovo` | dítě napsalo jiné slovo (přeslech) | „Poslechni si větu znovu, jen to jedno slovo.“ |
| `diktat-slovo-navic` | v zápisu je slovo navíc, které v diktátu nezaznělo (doplněno týmem 29. 9., vyhodnocení diktátu od lekce 12) | „Přehraj si větu ještě jednou a počítej slova. Kolik jich slyšíš?“ |
| `diktat-pravopis-<kód>` | pravopisná chyba ve slově — kód se skládá s jevem (`diktat-pravopis-shoda-y-za-i`) | otázka z příslušného jevu |

## Pravidla pro nové kódy
1. Kód popisuje **co dítě udělalo**, ne co mělo udělat (`pad-1-za-4`, ne `pad-spatne`).
2. Ke každému kódu otázka pro rodiče, která nedává odpověď (výjimka: čisté znalosti jako *bychom*, kde otázka odpověď obsahuje a je to tak označeno).
3. Kód se přidá do tabulky **před** použitím v JSON; QA validuje, že každý kód v lekcích existuje ve slovníku.

## Spolu 8 — opakování 8. třídy (OSNOVA §17, 1. 10. 2026)
Lekce = číslo lekce Spolu 8 (1–40), D = diagnostika. Otázka slouží rodiči i jako nápověda dítěti v režimu „Dnes samo“.

| Kód | Co dítě udělá | Příklad | Lekce | Otázka pro rodiče |
|---|---|---|---|---|
| `ohebnost-stupnovani` | příslovce označí jako ohebné, protože jde stupňovat | *rychle* → ohebné | 1, 2, 4, D1 | „Zkus to slovo říct v jiném pádě nebo s *já, ty, on*. Jde to? Je stupňování totéž?“ |
| `sd-podstatne-za-prislovce` | podstatné jméno, které zná jako „kdy?“, určí jako příslovce | *Ten večer byl dlouhý.* → příslovce | 3 | „Je před tím slovem *ten*? Jde na něj ukázat jako na věc?“ |
| `vzor-zena-za-predseda` | mužské jméno na *-a* dá ke vzoru *žena* | *hokejista, táta* → žena | 5, D3 | „Řekni před to slovo *ten*, nebo *ta*. Který vzor má stejný rod?“ |
| `stupnovani-nepravidelne-pravidelne` | nepravidelné stupňování utvoří pravidelně | *dobrý – dobřejší* | 9, 12, D6 | „Řekni to ve větě: Tenhle dort je ještě ___ než ten druhý. Jak to zní?“ |
| `stupnovani-zamena` | zamění 2. a 3. stupeň | *nejlepší* → 2. stupeň | 9, D6 | „Srovnáváš dvě věci, nebo vybíráš tu úplně ze všech?“ |
| `privlastnovaci-i-za-y` | v přivlastňovacím přídavném jménu napíše *-ovi* tam, kde patří *-ovy* | *Tomášovi klíče* | 11, 12, D5 | „Řekni před podstatné jméno *ti*, nebo *ty*. Co se k němu hodí?“ |
| `privlastnovaci-y-za-i` | napíše *-ovy* tam, kde patří *-ovi* | *Tomášovy kamarádi* | 11, 12 | totéž |
| `zajmeno-druh-zamena` | zamění druh zájmena | *který* v otázce → vztažné; *nikdo* → neurčité | 13, 14, 16 | „Co to slovo ve větě dělá: ptá se, ukazuje, něco popírá, nebo připojuje další větu?“ |
| `jenz-rod-zamena` | použije *jenž/jež* v jiném rodě | *kniha, jenž* | 13 | „Ke kterému slovu se to zájmeno vztahuje? Řekni před něj *ten, ta*, nebo *to*.“ |
| `zajmeno-ji-delka` | napíše *jí* ve 4. p. nebo *ji* ve 3. a 7. p. | *viděla jí*, *podala ji ruku* | 14, 16 | „Dosaď místo toho slova *Lucku*, nebo *Lucce*. Které se hodí?“ |
| `zajmeno-jeho-po-predlozce` | po předložce použije *jeho, jemu* místo *něho, němu* (u osobního zájmena) | *šel pro jeho* | 14 | „Stojí před zájmenem krátké slovo jako *pro, k, bez*? Řekni to nahlas i s ním.“ |
| `cislovka-druh-zamena` | zamění druh číslovky | *dvoje* → násobná | 15, 16 | „Na co se ptáš: kolik? kolikátý? kolikery? kolikrát?“ |
| `cislovka-hovorovy-tvar` | vybere/napíše hovorový tvar *dvouma, třema, čtyřma* (ne u částí těla) | *se třema kamarády* | 15, 16, D8 | „Jak to napíšeš v písemce? Řekni řadu: se dvěma, se třemi, se …“ — *pozn.: tahák dává tvar, čistá znalost (jako `bysme-za-bychom`)* |
| `cislovka-pad-zamena` | zamění tvar 2./6. a 3./7. pádu | *se dvou kamarády*, *ke dvou* | 15, D8 | „Na jakou otázku to odpovídá: s kým? bez koho? o kom? ke komu?“ |
| `vid-zamena` | určí dokonavé sloveso jako nedokonavé nebo naopak | *přečíst* → nedokonavé | 18, 19, 20, D9 | „Dej to sloveso do neurčitého tvaru a zkus: *budu ___*. Jde to?“ |
| `bude-s-dokonavym` | utvoří budoucí čas dokonavého slovesa s *budu* | *budu přečíst* | 18, 20 | „Jde říct *budu přečíst*? Jak řekneš, že to zítra dokončíš?“ |
| `rod-trpny-za-byt` | tvar *být* bez příčestí (*byl doma*) určí jako rod trpný | *Lucka byla doma.* → trpný | 19, D10 | „Děje se tu s Luckou něco, nebo jen říká, kde je? Je za *byla* tvar na *-n, -t*?“ |
| `rod-trpny-neuzna` | rod trpný určí jako činný | *Most byl postaven.* → činný | 19, 20, D10 | „Dělá to ten, o kom se mluví, nebo se to děje s ním?“ |
| `prisudek-slovesny-za-jmenny` | slovesný přísudek se slovesem *být* (*byla doma*) určí jako jmenný | *Klára byla doma.* → jmenný | 29 | „Říká to, jaká nebo kdo Klára je, nebo kde je?“ |
| `prisudek-jmenny-za-slovesny` | jmenný přísudek se sponou určí jako slovesný | *Tomáš je brankář.* → slovesný | 29 | „Je za *je* slovo, které říká, kdo nebo jaký podmět je?“ |
| `prisudek-jmenny-jen-spona` | u jmenného přísudku označí jen *je, byl* | *Soused je kuchař.* → přísudek *je* | 29 | „Co se o sousedovi říká? Stačí samo *je*?“ |
| `predmet-za-pu` | předmět určí jako příslovečné určení | *mluvili o výletu* → PU místa | 30 | „Zeptej se od slovesa. Hodí se otázka *kde? kdy? jak? proč?*, nebo pádová otázka?“ |
| `pu-za-predmet` | příslovečné určení určí jako předmět | *včera* → předmět | 30, 32, D16 | totéž |
| `pu-druh-zamena` | zamění druh příslovečného určení | *kvůli dešti* → PU času | 30 | „Jakou otázkou se na to zeptáš: kde, kdy, jak, nebo proč?“ |
| `privlastek-shoda-zamena` | zamění přívlastek shodný a neshodný | *dům u řeky* → shodný | 31 | „Změň tvar jména: bez domu … Mění se ten přívlastek s ním?“ |
| `privlastek-neshodny-za-pu` | přívlastek neshodný určí jako příslovečné určení | *Dům u řeky je starý.* → PU | 31, D17 | „Ke kterému slovu to patří: ke jménu, nebo ke slovesu? Zeptej se od něj.“ |
| `pu-za-privlastek` | příslovečné určení určí jako přívlastek | *čekal u vchodu* → přívlastek | 31 | totéž |
| `veta-hlavni-za-vedlejsi` | zamění větu hlavní a vedlejší (řídí se pořadím) | *Když pršelo, …* → hlavní | 33, 36 | „Kterou z těch vět řekneš samotnou? Kterou začíná slovo jako *že, když, který*?“ |
| `carka-vlozena-chybi-druha` | u vložené vedlejší věty chybí čárka na jejím konci | *Pes, který štěkal usnul.* | 34, 36, D18 | „Kde vedlejší věta končí? Najdi její sloveso a podívej se, co je za ní.“ |
| `carka-vycet-chybi` | ve výčtu bez spojky chybí čárka | *svačinu pití a pláštěnku* | 35, 36, D20 | „Kolik věcí je vyjmenováno? Co je mezi nimi?“ |
| `carka-chybi-pred-ale` | ve větě jednoduché chybí čárka před *ale* | *malý ale rychlý* | 35, D20 | „Spojuje *ale* dvě věci, které jdou spolu, nebo staví jednu proti druhé?“ |
| `carka-navic-pred-i-ani-nebo` | napíše čárku před *i, ani, nebo* ve slučovacím spojení | *Tomáš, i Lucka* | 35 | „Spojuje to slovo jen dvě věci za sebou, podobně jako *a*?“ |
| `carka-osloveni-chybi` | neoddělí oslovení | *Kláro pojď!* | 35 | „Na koho se ve větě volá? Kde to volání končí?“ |
| `stavba-hranice-zamena` | určí hranici předpony a kořene jinde | *o-ddělit* místo *od-dělit* | 37, 40 | „Najdi slovo bez předpony, ze kterého je to utvořené. Kde začíná?“ |
| `stavba-cast-zamena` | zamění části slova (předponu, kořen, příponu, koncovku) | *přeskoč* → kořen | 40 | „Která část zůstane stejná ve všech příbuzných slovech?“ |
| `zdvojene-chybi` | na švu napíše jen jednu ze dvou stejných souhlásek | *cený, odělení* | 37, 40, D23 | „Rozlož slovo na části. Končí jedna část stejným písmenem, jakým začíná další?“ |
| `zdvojene-navic` | napíše dvě souhlásky tam, kde je jedna | *vlnněný* | 37 | „Ze kterého slova je utvořené? Kolik *n* má jeho základ a kolik přípona?“ |
| `u-krouzek-za-carku` | napíše *ů* na začátku kořene po předponě | *neůspěch* | 37 | „Rozlož slovo. Jak začíná slovo bez předpony?“ |
| `u-carka-za-krouzek` | napíše *ú* uvnitř domácího slova | *dúm* | 37 | „Stojí to *ú* na začátku slova, nebo hned za předponou?“ |
| `s-z-predpona-zamena` | zamění předponu *s-* a *z-* | *zhodit, sničit* | 38, 40, D22 | „Co se tím dějem stane: jde něco dolů nebo dohromady, nebo se něco změní?“ |
| `skupina-e-za-je` | napíše *bě, vě* na švu *ob-, v-* + *je-* | *oběvit, věl* | 39, 40, D21 | „Rozlož slovo: je na začátku předpona *ob-* nebo *v-*? Jak začíná zbytek?“ |
| `skupina-je-za-e` | napíše *bje, vje* bez předpony | *vjeverka* | 39 | totéž |
| `skupina-me-za-mne` | napíše *mě* tam, kde patří *mně* | *zapoměl, příjemě* | 39, 40, D21 | „Najdi příbuzné slovo. Je v něm *mn* nebo *men*?“ |
| `skupina-mne-za-me` | napíše *mně* tam, kde patří *mě* | *mněsto, rozumněl* | 39 | totéž |
