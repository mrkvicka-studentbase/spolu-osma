# Téma 9 — Souvětí a čárka: naostro lekce (Spolu 8)

Verze 1.0, 14. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, Nejistoty, sloučení řádků do `AUDIO.md`), korektora (Ověření ÚJČ), autora nahrávek (Nahrávky). Lekce: `obsah/cestina/lekce/cj-t9-l33n.json` až `cj-t9-l36n.json` (dvojčata učebních lekcí `cj-t9-l33` až `cj-t9-l36`, rozpis učebních lekcí `TEMA-9.md`).

**Závazné vstupy:** `ZADANI-OSMA.md` (§3, §4, §8, §9), `PLAN-ROZSIRENI.md` §3, `OSNOVA.md` (§1–§4, §13, §16), `FORMAT-CJ.md`, `TYPY-CHYB.md`, `TERMINOLOGIE.md`, `AUDIO.md`, `obsah/SABLONA.md` §4, §8, §9, §18, §19.

## Společné pro všechny čtyři lekce

- **Hlavička** jako učební lekce: `tema` beze změny, `kapitola` `souveti`, `tyden` 9, `poradi` 1–4, `faze` `osma`, `cas_min` 25 (4 + 5 + 5 + 5 + 6). Id `cj-t9-l<n>n`, úlohy `…n-U1` až `U5`, poslední krok `final`.
- **Struktura** jako učební lekce: poslech v L33n U3 a L34n U2, L36n má diktát a týdenní kontrolu (`tydenni: true`, `semafor_tydne`). Vstupy v každé úloze stejného typu jako v učební lekci.
- **Těžší / objemnější:**
  - víc položek: čárek 6–8 místo 4–6, sloves k určení 7–8 místo 5, řádků s počtem vět 5 místo 4, rozcvičky se 3–4 možnostmi místo 2–3;
  - delší souvětí (až 4 věty, věta vložená ve vedlejší, dvě vedlejší za sebou);
  - poslechy mají 3 otázky místo 2;
  - detektiv je nenápadnější (chyba jen o jednu větu; chybí jen druhá čárka z páru; čárka navíc mezi mnoha správnými);
  - smíšené jevy z celé lekce (výčet v úloze na počet vět, oslovení a ale v jedné větě, vedlejší věta v úloze na větu jednoduchou).
- **Vše nové:** žádná věta, text s čárkami, poslech ani příklad z učebních lekcí L33–L36 (porovnáno skriptem `/tmp/naostro-cj9/kontrola.py`, shodné jsou jen pokyny jako „Klikni na místa, kam patří čárka.“). Stejné typy chyb ano.
- **Méně opory:** `uvod_pro_rodice` říká, že jde o naostro (2 věty). „Platí“ je krátké připomenutí s příkladem, který v úlohách není. Tahák je plný, `vysvetleni` říká, v čem je úloha těžší než v učební lekci.
- **„Dnes samo“:** žádná otázka taháku neobsahuje správnou odpověď (slovo ani počet) ani neukazuje na Petrovo chybné místo; kontrolováno skriptem i ručně. Text nahrávky ani diktátu není v zadání, tisku, popiscích ani otázkách (validátor).
- **Čárky jen jednoznačné** (ÚJČ id=150, 151, 153): hranice vedlejší věty, vložená věta z obou stran, věta s když/až/protože na začátku, výčet, ale (i ve větě jednoduché), oslovení na začátku, uprostřed (z obou stran) a na konci; bez čárky slučovací a, i, ani (i *a pak*). **Nepoužito:** a za vedlejší větou (pasti s a jen mezi dvěma hlavními větami nebo přísudky věty hlavní), a v neslučovacím poměru, dvojité *ani – ani*, *až když, poté co, tak jak*, pozdrav u oslovení, vsuvky, *prosím*, *nebo* v hodnoceném místě, *jenž*. V úlohách na počet vět žádný několikanásobný přísudek se společným podmětem (id=151).
- **Kódy chyb** jen z `TYPY-CHYB.md`: `prisudek-neni-sloveso`, `podmet-prisudek-zamena`, `souveti-pocet-podle-spojek`, `souveti-infinitiv-jako-veta`, `veta-hlavni-za-vedlejsi`, `carka-chybi-ze`, `carka-chybi-ktery`, `carka-chybi-pred-spojkou`, `carka-chybi-za-uvodni-vetou`, `carka-navic-a`, `carka-pred-a-vzdy`, `carka-vlozena-chybi-druha`, `carka-vycet-chybi`, `carka-chybi-pred-ale`, `carka-navic-pred-i-ani-nebo`, `carka-osloveni-chybi`, `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby`, `u-carka-za-krouzek` (diktát).
- **Jména:** Tomáš, Lucka (jen 1. p.), Klára, Adam, Ema; oslovení *Tomáši, Kláro, Adame, Emo*; Petr jen detektiv; Honzík nikde.
- **Indexy mezer** (`cil: "mezery"`): index *i* = místo za slovem *i*, interpunkce se nepočítá; počítáno skriptem jako `tokenizuj()` z `vyhodnoceni-cj.js`.
- **Slovní limity SABLONA §4** kontrolovány skriptem (`/tmp/naostro-cj9/limity.py`) i validátorem: 0 překročení.

---

## LEKCE 33n — Souvětí: věta hlavní a vedlejší (`cj-t9-l33n`) · poslech U3

Těžší než L33: 4 možnosti v rozcvičce; 5 řádků až se 4 větami (výčet, *mělo pršet*, vložená věta); poslech se 4 větami a 3 otázkami; detektiv o jednu větu; kontrolní 7 sloves ve 3 souvětích.

**Platí:** `Věty počítej podle přísudků` · `Vedlejší: že, když, protože, kde…` · `Psal, | že přijede. (hlavní | vedl.)`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (Z4) | 4 × `dlazdice` přísudek: A) Po obědě nám učitelka rozdala testy. · B) Adam musí po tréninku uklidit míče. · C) Zítra budeme celý večer psát úkol. · D) Za plotem celé ráno štěkal sousedův pes. | rozdala · musí uklidit · budeme psát · štěkal | učitelka, Adam, pes → `podmet-prisudek-zamena`; ostatní slova → `prisudek-neni-sloveso` |
| U2 nová | 5 × počet vět: A) Ema, Klára, Lucka a trenérka jely na závody. · B) Adam se musí naučit plavat. · C) Klára si vzala svačinu, pití a deštník, protože mělo pršet. · D) Když skončila bouřka, táta zatopil a my jsme šli pro dřevo. · E) Když Tomáš přišel do třídy, zjistil, že kamarád, který s ním sedí, dnes chybí. | 1 · 1 · 2 · 3 · 4 | A 3, 4; C 3; D 2; E 3 → `souveti-pocet-podle-spojek`; B 2, 3 → `souveti-infinitiv-jako-veta` |
| U3 nová, **poslech** | `t9/l33n-u3.mp3`; k1 „Kolik vět je v nahrávce?“, k2 „Kolik vět v nahrávce je vedlejších?“, final „Které sloveso patří do věty hlavní?“ (přišli · zjistili · jezdí · odjel) | 4 · 3 · zjistili | k1 3 → `souveti-pocet-podle-spojek`; k2 2, 4 → `veta-hlavni-za-vedlejsi`; final přišli, jezdí, odjel → `veta-hlavni-za-vedlejsi` |
| U4 detektiv | Petr: A) Lucka, Ema a jejich kamarádky šly na koncert. → 1 · B) Tomáš slíbil, že přijde, když bude moct. → **2** · C) Adam chce po prázdninách začít hrát volejbal. → 1 · D) Když jsme vstali, venku pršelo. → 2 | k1 Řádek B · final 3 věty | k1 A → `souveti-pocet-podle-spojek`, C → `souveti-infinitiv-jako-veta`, D → `detektiv-jine-slovo`; final 2 → `souveti-pocet-podle-spojek`, 4 → `souveti-infinitiv-jako-veta` |
| U5 kontrolní | „Když jsme přijeli k chatě, Tomáš, Adam a Ema hned chtěli jít k rybníku. Klára zůstala u auta, protože čekala na tátu, který hledal klíče. Potom nám zavolala, že už jdou.“ k1 počet vět v 1. souvětí; final `oznac_role` 7 sloves | k1 2 věty · final vedlejší přijeli, čekala, hledal, jdou; hlavní chtěli, zůstala, zavolala | k1 3, 4 → `souveti-pocet-podle-spojek`; final každá záměna → `veta-hlavni-za-vedlejsi` |

## LEKCE 34n — Čárka v souvětí (`cj-t9-l34n`) · poslech U2

Těžší než L34: rozcvička s třívětými souvětími; poslech hledá začátek i konec vložené věty; 6 čárek ve 4 souvětích místo 4 ve 3; detektiv v souvětí se 4 větami a 3 správnými čárkami; kontrolní 7 čárek místo 5.

**Platí:** `Čárka: začátek i konec vedlejší` · `Spojuje jen a, i, ani? Čárka ne.` · `Dům, kde bydlím, je starý.`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (L33) | A) Klára, Ema a Adam čekali, až začne film. (počet) · B) Tomáš musí do pátku dočíst knihu, kterou dostal. (počet) · C) Lucka čte a Tomáš hraje hru, kterou mu poslala Ema. (vedlejší) · D) Protože venku pršelo, zůstali jsme ve třídě, kde jsme kreslili. (hlavní) | 2 · 2 · kterou mu poslala Ema · zůstali jsme ve třídě | A 3, 4 → `souveti-pocet-podle-spojek`; B 3 → `souveti-infinitiv-jako-veta`; C, D jiné části → `veta-hlavni-za-vedlejsi` |
| U2 nová, **poslech** | `t9/l34n-u2.mp3`; k1 počet vět, k2 „Které slovo začíná vloženou vedlejší větu?“ (Když · autobus · kterým · už), final „Kterým slovem vložená věta končí?“ (autobus · jet · stál · parkovišti) | 3 · kterým · jet | k1 2 → `souveti-pocet-podle-spojek`, 4 → `souveti-infinitiv-jako-veta`; k2 autobus, už → `veta-hlavni-za-vedlejsi`; final stál, parkovišti obecná chyba (v taháku; korektura 14. 10.: popis `carka-vlozena-chybi-druha` mluví o chybějící čárce, v poslechu se čárka nepíše) |
| U3 nová | `klik_ve_textu` mezery: „Když jsme vyšli ze školy, začalo pršet. Strom, který stál u řeky, v noci spadl. Ema napsala, že nepůjde ven, protože musí uklidit kuchyni. Klára uklízí pokoj a Tomáš myje nádobí, protože večer přijde babička.“ | [4, 7, 11, 16, 19, 30] za školy, Strom, řeky, napsala, ven, nádobí | 16 → `carka-chybi-ze`; 7 → `carka-chybi-ktery`; 11 → `carka-vlozena-chybi-druha`; 19, 30 → `carka-chybi-pred-spojkou`; za školy a čárka před a obecná (v taháku) |
| U4 detektiv | „Když jsme v sobotu dorazili na chatu, děda, který tam byl už od rána nám ukázal, kde budeme spát.“ k1 klik (max 1); final „Proč tam patří čárka?“ | k1 [13] za rána · final Končí tam vedlejší věta | k1 jiná místa → `detektiv-jine-slovo`; final ostatní → `detektiv-oprava-jine-chyby` |
| U5 kontrolní | mezery: „Tomáš nepřišel na trénink, protože ho bolí ruka. Trenér, který nás trénuje, nám napsal, že zápas v sobotu zrušili. Když skončila hodina, kluci uklidili míče a šli do šatny. Holky, které hrály volejbal, ještě zůstaly v tělocvičně a trénovaly.“ | [3, 8, 11, 13, 21, 29, 32] | 11, 32 → `carka-vlozena-chybi-druha`; 8, 29 → `carka-chybi-ktery`; 21 → `carka-chybi-za-uvodni-vetou`; navíc 24, 36 (před a) → `carka-navic-a`; 3 (protože), 13 (že) obecná |

## LEKCE 35n — Čárka ve větě jednoduché (`cj-t9-l35n`)

Těžší než L35: rozcvička po 3 možnostech se dvěma druhy chyb; 7 čárek ve 4 výčtech (i slovesa a slova, která říkají jaký) místo 4; 5 řad místo 4, oslovení uprostřed a dva jevy ve větě; detektiv: chybí jen druhá čárka u oslovení uprostřed; kontrolní 8 čárek místo 6.

**Platí:** `Výčet: čárka, před a ne` · `ale: čárka · a, i, ani: bez` · `Pojď, Emo, k nám!`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (L34) | 4 × „Která věta je napsaná správně?“ (3 verze): A) Až dopíšu úkol, půjdu ven, protože svítí slunce. · B) Ema čte a Adam kreslí, protože prší. · C) Ema ví, že kluk, který přišel, je nový. · D) Dům, ve kterém bydlí Ema, má zelená okna. | verze se všemi čárkami | A `carka-chybi-za-uvodni-vetou`, `carka-chybi-pred-spojkou`; B `carka-navic-a`, `carka-chybi-pred-spojkou`; C `carka-chybi-ze`, `carka-vlozena-chybi-druha`; D `carka-vlozena-chybi-druha`, `carka-chybi-ktery` |
| U2 nová | mezery: „Na chatu si zabal deku, plavky, boty a mýdlo. Tomáš, Adam, Ema, Klára i Lucka chodí na plavání. Každý den jsme plavali, hráli hry a večer zpívali u ohně. Voda v rybníku byla čistá, studená a hluboká.“ | [4, 5, 9, 10, 11, 21, 33] | chybějící → `carka-vycet-chybi`; navíc 6, 23, 34 → `carka-navic-a`; 12 → `carka-navic-pred-i-ani-nebo` |
| U3 nová | 5 × dlaždice: A) Emo, ta kniha je dlouhá, ale dobrá. · B) Adam i Tomáš hráli dobře, ale prohráli. · C) Půjč mi, Adame, na chvíli pravítko. · D) Tomáš nemá kolo ani brusle. · E) Vezmi si svetr, šálu a rukavice, Kláro! | uvedené verze | `carka-osloveni-chybi`, `carka-chybi-pred-ale`, `carka-navic-pred-i-ani-nebo`, `carka-vycet-chybi` (každá chybná verze svůj kód) |
| U4 detektiv | „Podej mi, Tomáši tu zelenou propisku, pravítko a nůžky.“ final „Proč tam patří čárka?“ (Končí tam oslovení · Začíná tam oslovení · Je tam výčet · Stojí tam ale) | k1 [2] za Tomáši · final Končí tam oslovení | k1 6 (před a) → `carka-navic-a`, jiná → `detektiv-jine-slovo`; final ostatní → `detektiv-oprava-jine-chyby` |
| U5 kontrolní | mezery: „Kláro, do školy si vezmi sešit, učebnici, kružítko a gumu. Ten úkol je dlouhý, ale není těžký. Pojď s námi, Adame, na hřiště, kde hrají kluci fotbal. Tomáš, Ema i Lucka už tam čekají.“ | [0, 5, 6, 13, 19, 20, 22, 27] | 0, 19, 20 → `carka-osloveni-chybi`; 5, 6, 27 → `carka-vycet-chybi`; 13 → `carka-chybi-pred-ale`; navíc 28 → `carka-navic-pred-i-ani-nebo`; 22 (kde) a čárka před a obecná |

## LEKCE 36n — Kontrola tématu: souvětí a čárka (`cj-t9-l36n`) · diktát

Těžší než L36: rozcvička s třívětým souvětím a 3 možnostmi; 8 sloves ve 3 souvětích místo 5 ve 2; 6 čárek místo 4 (tři v jedné větě); detektiv ze 4 vět s mnoha správnými čárkami; diktát 3 věty a 3 hlídaná slova místo 1 (18 slov jako učební L36); text 7 čárek místo 6 (zkráceno rozhodnutím vedoucího 14. 10.: 24 slov + 9 čárek bylo na 6 minut moc).

**Platí:** `Hranice vět · výčet · ale · oslovení` · `a, i, ani jen spojují: bez čárky` · `Ema ví, že to umíme.`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (L33–L35) | A) Adam chtěl jít do kina, ale nikdo nemohl. (počet) · B) Tomáš neví, kdy začíná zápas, na který jdeme. (hlavní) · C) Máma koupila mléko, sýr, jogurt i máslo. · D) Autobus, který jede na letiště, už odjel. | 2 · Tomáš neví · verze C, D se všemi čárkami | A 3 → `souveti-infinitiv-jako-veta` (1, 4 obecná); B → `veta-hlavni-za-vedlejsi`; C `carka-vycet-chybi`, `carka-navic-pred-i-ani-nebo`; D `carka-vlozena-chybi-druha`, `carka-chybi-ktery` |
| U2 nová | `oznac_role`: „Když jsme dorazili k moři, táta hned šel zjistit, kde je pláž. Stan, ve kterém jsme spali, stál pod stromem. Ema povídala, že se jí tam líbí, protože může každý den plavat.“ | vedlejší dorazili, je, spali, líbí, může; hlavní šel, stál, povídala | každá záměna → `veta-hlavni-za-vedlejsi` |
| U3 nová | mezery: „Kláro, ten film, který jsme viděli včera, byl dlouhý, ale napínavý. V kině jsme potkali Tomáše, Adama a jejich bratrance. Ema napsala, že v sobotu půjde s námi i Lucka.“ | [0, 2, 6, 8, 15, 21] | 0 → `carka-osloveni-chybi`; 6 → `carka-vlozena-chybi-druha`; 15 → `carka-vycet-chybi`; 8 → `carka-chybi-pred-ale`; 2 (který), 21 (že) a navíc obecná |
| U4 detektiv | Petr: A) Adam ví, kde bydlí Ema, ale nezná cestu. · B) Na stole leží sešity, učebnice**,** i guma. · C) Tomáši, ten obraz, který jsi namaloval, se mi líbí. · D) Klára dlouho běhala a pak šla domů. final „Co je na té větě špatně?“ | k1 Věta B · final Čárka před i, které jen spojuje | k1 A, C → `detektiv-jine-slovo`, D → `carka-pred-a-vzdy`; final „Chybí čárka před a“ → `carka-pred-a-vzdy`, ostatní → `detektiv-oprava-jine-chyby` |
| U5 kontrolní **týdenní** | k1 `diktat` 3 věty (viz Nahrávky), `max_prehrani` 2, `hodnotit_interpunkci` false, `hodnotit_velikost` false; final mezery: „Tomáši, v sobotu přijď na hřiště, kde hrajeme turnaj. Přines si kopačky, dres a svačinu. Hráč, který zapomene dres, bude sedět na lavičce. Zápas bude těžký, ale myslím, že vyhrajeme.“ | diktát bez chyb · final [0, 5, 11, 15, 18, 25, 27] | diktát `chyby_ocekavane` (holé kódy): (0,5) dolů, (2,2) stůl, (2,4) nůž → `u-carka-za-krouzek` · final 0 → `carka-osloveni-chybi`; 11 → `carka-vycet-chybi`; 18 → `carka-vlozena-chybi-druha`; 25 → `carka-chybi-pred-ale`; 5 (kde), 15 (který), 27 (že), navíc 12 (před a) obecná |

`semafor_tydne` (z `final`, 7 čárek): zelená 6–7 (~90 %), oranžová 5 (~70 %), červená 0–4.

**Diktát slovo po slově (OSNOVA §2.2):**
- Věty: *Když začalo pršet, Ema běžela dolů. · Pes, kterého máme doma, štěká. · Dej na stůl hrnek, nůž a lžíci.* (18 slov, učební L36 18; původní 4. věta *Venku prší, ale je teplo.* a *na kočky* vypuštěny 14. 10.).
- Čárky (za *pršet, Pes, doma, hrnek*) aplikace nehodnotí (ZADANI-OSMA §8 bod 4); rodič je po odevzdání vidí v řešení.
- Hlídaná slova jen Z5: *dolů, stůl, nůž* (ů uvnitř a na konci, id=127). Ostatní slova Z5 bez kódu: *Když* (ž), *běžela* (bě bez předpony, že), *kterého* (ry), *lžíci* (ží, ci), *štěká* (tě), *hrnek, Dej, doma, máme, začalo, pršet*.
- Žádné *i/í/y/ý* po obojetné souhlásce v kořeni ani v příponě, žádná předložka *s/z*, žádné *mě/mně*, žádné přídavné jméno, slovesa jen v přítomném čase, j. č. minulého času a rozkazu.

---

## Nahrávky (pro AUDIO.md)

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t9/l33n-u3.mp3` | cj-t9-l33n / úloha 3 (`k1` i `k2` i `final`) | poslech | Když jsme ráno přišli na zastávku, zjistili jsme, že autobus, který jezdí do školy, už odjel. | Oznamovací intonace, nic nezdůrazňovat (hlavně ne „když“, „že“, „který“ a slovesa); pauzy na čárkách ne delší než běžné. Cca 6 s. | čeká na Pavla |
| `t9/l34n-u2.mp3` | cj-t9-l34n / úloha 2 (`k1` i `k2` i `final`) | poslech | Když jsme dorazili na nádraží, autobus, kterým jsme měli jet, už stál na parkovišti. | Oznamovací intonace, nic nezdůrazňovat (hlavně ne „kterým“ a „jet“); „měli jet“ spojitě; pauzy na čárkách ne delší než běžné. Cca 6 s. | čeká na Pavla |
| `t9/l36n-d1.mp3` | cj-t9-l36n / úloha 5 (diktát, věta 1) | diktát | Když začalo pršet, Ema běžela dolů. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. Dlouhé ů v „dolů“ zřetelně. | čeká na Pavla |
| `t9/l36n-d2.mp3` | cj-t9-l36n / úloha 5 (diktát, věta 2) | diktát | Pes, kterého máme doma, štěká. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t9/l36n-d3.mp3` | cj-t9-l36n / úloha 5 (diktát, věta 3) | diktát | Dej na stůl hrnek, nůž a lžíci. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |

**Celkem 5 nahrávek** (2 poslechy, 3 věty diktátu). Do `AUDIO.md` je sloučí vedoucí. Do té doby validátor hlásí jen „nahrávka nemá řádek v AUDIO.md“ (9 chyb ve 3 lekcích; poslech se počítá u každého kroku), jiné chyby 0, varování jen „soubor zatím není“.

---

## Ověření ÚJČ

14. 10. 2026 přes `bash nastroje/ujc.sh`. Server odpovídal (fronta pomalá, ~40 s na dotaz), proto jsem slova, která v cache nebyla, nejdřív nahradil slovy z cache (např. *hotel, přístav, vlak, nástupiště, referát, hudba, čas, říct, zlomit, tužka, atlas, penál* → jiná slova) a dotazoval jen dvě: *rozdat*, *studený*. Tvary z lekcí jsem u každého hesla hledal v tabulce v cache skriptem (`/tmp/naostro-cj9/tvary.py`, 0 nálezů kromě dvou pravidelných: *plavali* od *plaval*, *stál* u homonymního hesla *stát* (sloveso)).

| výklad | co z něj platí | odkaz |
|---|---|---|
| id=150 Psaní čárky v souvětí | čárka na hranici vedlejší věty (*že, když, až, protože, kdy, kde, který, kterým, ve kterém*), vložená věta z obou stran | https://prirucka.ujc.cas.cz/?id=150 |
| id=151 Psaní čárky ve větě jednoduché | výčet; odporovací *ale*; oslovení se odděluje, uprostřed z obou stran (*Jestlipak, hoši, umíte násobilku?*); typ *Ahoj(,) Vítku* nepoužit; několikanásobný přísudek v počítání vět ne | https://prirucka.ujc.cas.cz/?id=151 |
| id=153 Psaní čárky před spojkami a, i, ani | slučovací *a* (i *a pak*), *i* (*mladí i staří*), *ani* (*Není mu rady ani pomoci*) bez čárky; stupňovací a dvojité *ani – ani* nepoužity | https://prirucka.ujc.cas.cz/?id=153 |
| id=155 Psaní čárky před spojkami nebo, či | *nebo* jen v pravidle, v hodnoceném místě ne | https://prirucka.ujc.cas.cz/?id=155 |
| id=127 Psaní ú/ů | *ů* uvnitř a na konci domácích slov: *dolů, stůl, nůž* (diktát L36n) | https://prirucka.ujc.cas.cz/?id=127 |

Hesla (každé plnovýznamové slovo z textů úloh; odkazy jsou v `kontrola.zdroj` lekce, 45–71 položek):
- **L33n:** oběd, rozdat, test, učitelka, muset, trénink, uklidit, míč, zítra, večer, psát, úkol, plot, ráno, štěkat, soused (*sousedův*), pes, trenérka, jet, závod, naučit, plavat, vzít, svačina, pití, deštník, mít, pršet, skončit, bouřka, táta, zatopit, jít, dřevo, přijít, třída, zjistit, kamarád, sedět, chybět, zastávka, jezdit, škola, odjet, kamarádka, koncert, slíbit, moct, chtít, prázdniny, začít, hrát, volejbal, vstát, venku, přijet, chata, hned, rybník, zůstat, auto, čekat, hledat, klíč, zavolat.
- **L34n:** film, dočíst, kniha, pátek, dostat, číst, hra, poslat, kreslit, dorazit, nádraží, parkoviště, vyjít, strom, stát, řeka, noc, spadnout, napsat, kuchyně, uklízet, pokoj, mýt, nádobí, babička, sobota, děda, ukázat, spát, bolet, ruka, trenér, trénovat, zápas, zrušit, hodina, šatna, holka, tělocvična.
- **L35n:** dopsat, svítit, slunce, vědět, kluk, nový, dům, bydlet, zelený, okno, zabalit, deka, plavky, bota, mýdlo, chodit, plavání, den, zpívat, oheň, voda, čistý, studený, hluboký, dlouhý, dobrý, prohrát, půjčit, chvíle, pravítko, kolo, brusle, svetr, šála, rukavice, podat, propiska, nůžky, sešit, učebnice, kružítko, guma, těžký, hřiště, fotbal.
- **L36n:** kino, nikdo, koupit, mléko, sýr, jogurt, máslo, autobus, letiště, moře, pláž, stan, líbit se, každý, vidět, včera, napínavý, potkat, bratranec, stůl, ležet, obraz, namalovat, cesta, dlouho, běhat, domů, běžet, dolů, doma, pes, mít, štěkat, začít, pršet, dát, hrnek, nůž, lžíce, přinést, kopačka, dres, hráč, zapomenout, lavička, myslet, vyhrát, turnaj.
- Jména Tomáš, Klára, Adam, Ema (oslovení *Tomáši, Kláro, Adame, Emo* v tabulkách hesel). *Lucka* heslo nemá, je jen v 1. p.

**Text složený se vzorovou odpovědí:** u všech 8 úloh s mezerami skript (`/tmp/naostro-cj9/slozit.mjs`) vložil čárky na indexy `spravne` a výsledek jsem přečetl větu po větě: všude je správně napsaná věta se všemi čárkami tématu a bez čárky před slučovacím *a, i, ani*.

---

## Nejistoty

**Jazykové:**
- **L35n U3 k2** „Adam i Tomáš hráli dobře, ale prohráli.“ a **L34n U5** „kluci uklidili míče a šli do šatny“: několikanásobný přísudek se společným podmětem. V úlohách na čárku to nevadí (čárka před *ale* je, před *a* není podle id=151, 153); v úlohách na počet vět takové věty nejsou.
- **L36n U3** „půjde s námi i Lucka“: *i* je tu vytýkací (také), ne spojka mezi členy; čárka tam není v žádném výkladu, past se nehodnotí kódem (jen obecná chyba).
- **L33n U2 D** „Když skončila bouřka, táta zatopil a my jsme šli pro dřevo.“: *a* spojuje dvě hlavní věty (vedlejší s když stojí na začátku), takže nejde o *a* za vedlejší větou.
- *kluk, holka* jako v učebních lekcích (hovorová, ale spisovná slova).

**Metodické:**
- **Nejvýš 4 známé chyby na krok**, proto některá místa zůstala obecnou chybou a jsou jen v taháku: L34n U3 čárka za *školy* a před *a*; L34n U5 čárky před *protože* a *že*; L35n U5 před *kde* a před *a*; L36n U3 před *který*, *že*; L36n U5 před *kde, který, že* a čárka navíc před *a*.
- **L34n U2 final** „Kterým slovem vložená věta končí?“: *stál, parkovišti* jsou obecná chyba (korektura 14. 10. podle rozhodnutí vedoucího: popis kódu `carka-vlozena-chybi-druha` mluví o chybějící čárce, v poslechu dítě čárku nepíše). Otázka z taháku („Patří už stál k vložené větě?“) zůstává.
- **L34n U4** nabídka kroku 2 bez výčtu a oslovení (učivo L35), místo nich „Stojí tam spojka a“, „Končí tam věta hlavní“ (podle Nejistoty 3 v `TEMA-9.md`).
- **L36n U5 (vyřešeno 14. 10., rozhodnutí vedoucího):** diktát zkrácen na 3 věty / 18 slov (vypuštěna věta *Venku prší, ale je teplo.* a *na kočky*), text na 7 čárek (výčet *kopačky, dres a svačinu*), `semafor_tydne` 6 / 5 / 0, max kliknutí 9; tahák, tisk, cíl a úvod upraveny, řádek nahrávky d4 smazán.
- **L36n diktát:** hlídaná slova jsou jen *ů* (Z5); téma 9 v diktátu nic neměří (čárky se nehodnotí), stejně jako v učební L36.

**Návrhy kódů (v JSON nepoužity):**
- Rozšířit popis `u-carka-za-krouzek` na „*ú* nebo *u* místo *ů* uvnitř i na konci domácího slova“ (už navrženo v `TEMA-9.md`; týká se *dolů*).
- `carka-osloveni-chybi-druha` (u oslovení uprostřed chybí jen jedna čárka z páru) by odlišil L35n U4 a L35n U3 C, U5 od úplně neoddělených oslovení. Teď obojí `carka-osloveni-chybi`.

**Validátor / web:**
- Bez nových nálezů. Validátor hlásí slovní limity jako varování (v naostro lekcích 0). `node --test testy/cestina.test.js testy/tisk-cj.test.js`: 49 / 49.

---

## Korektura (korektor, 14. 10. 2026)

Nezávislá kontrola všech čtyř lekcí: každé slovo z textů, dlaždic, poslechů a diktátu porovnáno s tvary v cache ÚJČ (`nastroje/ujc.sh`, bez nových dotazů; mimo cache jen pravidelné tvary příčestí *rozdala, napsala, poslala, běhala, běžela, trénovaly, plavali, vstali* a slova pokynů), diktát a oslovení ověřeny v tabulkách hesel (*začít, pršet, Ema, běžet, dolů, pes, mít, doma, štěkat, dát, stůl, hrnek, nůž, lžíce; Tomáši, Kláro, Adame, Emo*). Čárky ověřeny podle id=150, 151, 153 (*a pak* bez čárky, *a* za vloženou vedlejší větou nikde, *i* vytýkací v *půjde s námi i Lucka* bez čárky), id=155 (*nebo* v hodnoceném místě ne). Texty s čárkami složené se vzorovou odpovědí (`/tmp/naostro-cj9/slozit.mjs`) přečteny větu po větě: bez chyby.

Jazykové chyby v hodnocených místech: **0**. Opravy:
- **L36n U5** zkrácena (viz Nejistoty); **L36n „Platí“** `Myslím, že to Ema ví.` → `Ema ví, že to umíme.` (*myslím, že* je hodnocené místo úlohy 5).
- **L34n U2 final** *stál, parkovišti* bez kódu (obecná chyba); **L36n U1 k1** „4 věty“ bez kódu `souveti-infinitiv-jako-veta` (čtyři věty z neurčitého tvaru vzniknout nemohou); **L33n U3 final** *jezdí* doplněn kód `veta-hlavni-za-vedlejsi` (stejná chyba jako *přišli, odjel*).
- **Tahák L33n:** *se musí naučit plavat*, *začala chodit bruslit*, *chce začít hrát* už nejsou „jeden přísudek“ (infinitiv *plavat, bruslit* je ve škole předmět / určení), ale „jediné sloveso v osobě je …, ostatní k němu patří“; počet vět beze změny.
- **Oranžová L34n U4 a L35n U4:** rodič čte Petrovu větu nahlas, čárky nejsou slyšet → text říká, kam Petr čárky napsal, a věta je v uvozovkách bez nich.
- **L36n U5 červená:** pět vět → čtyři (~5 minut).
