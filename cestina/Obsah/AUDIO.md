# Nahrávky pro ElevenLabs — seznam a pokyny

Verze 1.0, 29. 9. 2026. Vede autor úloh, generuje Pavel. Soubory do `web/audio/cestina/t<týden>/` (web se nasazuje jen ze složky `web/`, proto ne `obsah/`; v JSON lekce je cesta bez `web/`, např. `audio/cestina/t1/l2-u4.mp3` — FORMAT-CJ §3.2). Formát MP3, mono, 64 kb/s stačí.

## Jednotné nastavení hlasu [NÁVRH — potvrdí Pavel]
- **Jeden hlas pro celý předmět** (ženský, klidný, „paní učitelka, která nespěchá“). Stejný hlas pro poslech i diktát, aby si dítě zvyklo.
- Tempo: 0,9× (pomalejší než běžná řeč). Stability vysoká, aby se tvary slov nezkreslovaly.
- **Výslovnost je součást obsahu:** korektor po vygenerování každou nahrávku poslechne — koncovky (-i/-y zní stejně, to je v pořádku; ale -ý/-í délka musí být slyšet, *mladí* vs. *mladý*), správný přízvuk, žádné „polykání“ posledního slova.
- Bez hudby, bez efektů, 0,5 s ticha na začátku a konci.

## Poslech (`poslech`)
- Jedna věta nebo text do 20 s. Přirozená intonace. Interpunkce se čte přirozeně (pauzy), ale nevyslovuje.
- Pokud věta obsahuje slovo, které je předmětem úlohy (např. sloveso), **nezdůrazňovat** ho — dítě má poslouchat, ne dostat nápovědu.

## Diktát (`diktat`)
- Každá věta **samostatný soubor**. Věta se v nahrávce řekne **dvakrát**: poprvé v celku přirozeně, pauza 2 s, podruhé pomalu po slovech (tempo 0,75×), s pauzou 0,7 s mezi slovy.
- Interpunkce se nediktuje (v základech se nehodnotí; výjimka lekce 30, kde se řekne „čárka“).
- Vlastní jména se hlásí: „velké písmeno — Honzík“ jen v lekcích, kde se velká písmena nehodnotí (všechny v základech). Pokud by hodnocení velkých písmen přišlo (týden 9+), hlásit se přestane.

## Seznam nahrávek (Spolu 8; nahrávky ze „Spolu — základy“ sem nepatří — jiné věty se stejnými ID)

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t1/l1-u3.mp3` | 1 / úloha 3 (`k1` i `final`) | poslech | Pátý den tábora jsme my dva našli v lese tři houby. | Nic nezdůrazňovat, hlavně ne „pátý“ a „my“; „my dva“ vyslovit spojitě, bez pauzy. Oznamovací intonace. Cca 4 s. | hotovo 2. 10. (Pavel) |
| `t1/l3-u2.mp3` | 3 / úloha 2 (`k1` i `final`) | poslech | Večer jsme šli kolem rybníka a viděli tam dvě volavky. | „Večer“ na začátku bez důrazu a bez pauzy za ním; „kolem rybníka“ spojitě (pauza by napověděla). Cca 4 s. | hotovo 2. 10. (Pavel) |
| `t2/l5-u3.mp3` | 5 / úloha 3 (`k1` i `final`) | poslech | Tomáš potkal na hřišti souseda s dědou. | Oznamovací věta. Nezdůrazňovat „souseda“ ani „dědou“; koncovky „-a“ v „souseda“ a „-ou“ v „dědou“ vyslovit zřetelně, nepolykat. Cca 3 s. | hotovo 2. 10. (Pavel) |
| `t2/l6-u3.mp3` | 6 / úloha 3 (`k1` i `final`) | poslech | Na náměstí si hrálo kotě s malým štěnětem. | Oznamovací věta. Nezdůrazňovat „náměstí“ ani „štěnětem“; „štěnětem“ vyslovit celé a zřetelně (slabika „-ně-“ se nesmí ztratit), „náměstí“ s dlouhým „í“. Cca 3 s. | hotovo 2. 10. (Pavel) |
| `t3/l9-u3.mp3` | 9 / úloha 3 (`k1` i `final`) | poslech | Emin dort byl lepší než ten můj. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t3/l11-u3.mp3` | 11 / úloha 3 (`k1` i `final`) | poslech | Tomášovi rodiče koupili Tomášovi nové kolo. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t3/l12-d1.mp3` | 12 / úloha 5 (diktát, věta 1) | diktát | Malí kluci čekají na hřišti. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t3/l12-d2.mp3` | 12 / úloha 5 (diktát, věta 2) | diktát | Tomášovy boty jsou nové. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t3/l12-d3.mp3` | 12 / úloha 5 (diktát, věta 3) | diktát | Ten veselý pes je Klářin. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t3/l12-d4.mp3` | 12 / úloha 5 (diktát, věta 4) | diktát | Adamovi rodiče čekají doma. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t4/l14-u3.mp3` | 14 / úloha 3 (`k1` i `final`) | poslech | Lucka potkala Kláru, podala jí ruku a pozvala ji domů. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t4/l15-u3.mp3` | 15 / úloha 3 (`k1` i `final`) | poslech | Na výlet jsme jeli se třema kamarády a se dvěma kamarádkami. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t4/l16-d1.mp3` | 16 / úloha 5 (diktát, věta 1) | diktát | Klára mně půjčila sešit. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t4/l16-d2.mp3` | 16 / úloha 5 (diktát, věta 2) | diktát | Ema ji pozvala na oslavu. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t4/l16-d3.mp3` | 16 / úloha 5 (diktát, věta 3) | diktát | Dal jsem to oběma sestrám. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t5/l17-u3.mp3` | 17 / úloha 3 (`k1` i `final`) | poslech | Večer bysme mohli jít do kina. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t5/l18-u3.mp3` | 18 / úloha 3 (`k1` i `final`) | poslech | Zítra napíšu test a potom budu číst knihu. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t5/l20-d1.mp3` | 20 / úloha 5 (diktát, věta 1) | diktát | Tomáš by šel ven. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t5/l20-d2.mp3` | 20 / úloha 5 (diktát, věta 2) | diktát | Večer budu číst knihu. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t5/l20-d3.mp3` | 20 / úloha 5 (diktát, věta 3) | diktát | Dům byl postaven loni. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t5/l20-d4.mp3` | 20 / úloha 5 (diktát, věta 4) | diktát | Zavři okno! | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t6/l21-u3.mp3` | 21 / úloha 3 (`k1` i `k2` i `final`) | poslech | První věta: Hodiny na věži začaly bít poledne. Druhá věta: Chtěl bych být brankářem. Třetí věta: Každou sobotu pomáhám tátovi mýt auto. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t6/l23-u3.mp3` | 23 / úloha 3 (`k1` i `k2` i `final`) | poslech | První věta: V lese houká výr. Druhá věta: Ve vodě se točil vír. Třetí věta: Pes celou noc vyl. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t6/l24-d1.mp3` | 24 / úloha 5 (diktát, věta 1) | diktát | Obyvatelé vesnice bydlí u mlýna. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t6/l24-d2.mp3` | 24 / úloha 5 (diktát, věta 2) | diktát | Brzy ráno slyšíme sýkoru. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t6/l24-d3.mp3` | 24 / úloha 5 (diktát, věta 3) | diktát | Vlk v lese vyl. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t6/l24-d4.mp3` | 24 / úloha 5 (diktát, věta 4) | diktát | Tomáš si umyl ruce. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t7/l25-u3.mp3` | 25 / úloha 3 (`k1` i `final`) | poslech | Holky z naší třídy trénovaly po škole volejbal. Potom šly na zmrzlinu. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t7/l27-u3.mp3` | 27 / úloha 3 (`k1` i `final`) | poslech | Po koncertě čekali rodiče před školou. Děti vyběhly ven a mávaly na ně. Potom všichni šli k autu. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t7/l28-d1.mp3` | 28 / úloha 5 (diktát, věta 1) | diktát | Kluci hráli na hřišti fotbal. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t7/l28-d2.mp3` | 28 / úloha 5 (diktát, věta 2) | diktát | Děti seděly u okna. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t7/l28-d3.mp3` | 28 / úloha 5 (diktát, věta 3) | diktát | Rodiče čekali venku. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t7/l28-d4.mp3` | 28 / úloha 5 (diktát, věta 4) | diktát | Auta stála před domem. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t8/l30-u3.mp3` | 30 / úloha 3 (`k1` i `final`) | poslech | Kvůli dešti jsme v sobotu zůstali doma. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t8/l31-u3.mp3` | 31 / úloha 3 (`k1` i `final`) | poslech | Kluk s modrou čepicí čekal u vchodu. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t8/l32-d1.mp3` | 32 / úloha 5 (diktát, věta 1) | diktát | Náš soused je kuchař. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t8/l32-d2.mp3` | 32 / úloha 5 (diktát, věta 2) | diktát | Ten starý dům u řeky je prázdný. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t8/l32-d3.mp3` | 32 / úloha 5 (diktát, věta 3) | diktát | Večer čekal Adam venku. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t9/l33-u3.mp3` | 33 / úloha 3 (`k1` i `final`) | poslech | Když jsme přišli domů, máma vařila večeři a táta četl noviny. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t9/l34-u2.mp3` | 34 / úloha 2 (`k1` i `final`) | poslech | Lucka čte knihu a Tomáš, který přišel pozdě, píše úkol. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t9/l36-d1.mp3` | 36 / úloha 5 (diktát, věta 1) | diktát | Doufám, že Tomáš přijde domů. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t9/l36-d2.mp3` | 36 / úloha 5 (diktát, věta 2) | diktát | Kluk, který sedí vedle, hraje hokej. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t9/l36-d3.mp3` | 36 / úloha 5 (diktát, věta 3) | diktát | Do batohu dej svetr, bundu a boty. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t10/l38-u3.mp3` | 38 / úloha 3 (`k1` i `k2` i `final`) | poslech | Lyžaři vyšli z chaty a sjeli do údolí. Listí na podzim zežloutlo. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t10/l39-u3.mp3` | 39 / úloha 3 (`k1` i `final`) | poslech | Tomáš zapomněl doma klíče. | Oznamovací intonace, nic nezdůrazňovat, koncovky vyslovit zřetelně. | čeká na Pavla |
| `t10/l40-d1.mp3` | 40 / úloha 5 (diktát, věta 1) | diktát | Táta objednal večeři. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t10/l40-d2.mp3` | 40 / úloha 5 (diktát, věta 2) | diktát | Lucka zapomněla na trénink. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t10/l40-d3.mp3` | 40 / úloha 5 (diktát, věta 3) | diktát | Ten oddíl má cenný pohár. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t10/l40-d4.mp3` | 40 / úloha 5 (diktát, věta 4) | diktát | Klára shodila hrnek na zem. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |

Témata 3–10 doplnil vedoucí 4. 10. z JSON po korektuře (`prepis`, diktát `vety[].text`). Pro ElevenLabs je hotový text i s pauzami v `cestina/Obsah/nahravky-k-nataceni.md` / `.csv` (generuje `node nastroje/seznam-nahravek.mjs`; postup pro agenta s ElevenLabs: `NAHRAVKY-NAVOD.md`). Před odevzdáním týdne musí být řádky pro všechny `poslech` a `diktat` kroky v tabulce, jinak QA týden nepustí (kontrola: každý `audio` odkaz v JSON má řádek tady a soubor na disku).

## Postup (ověřený 30. 9., model Eleven v4)
1. ElevenLabs → Text to Speech, hlas **Jana – Warm, Confident Czech Female**, model **Eleven v4**, Stability ≈ 75 % (Robust), Similarity 75 %.
2. Text s prefixem `[calm, slow, clear] ` + přesné znění. v4 nemá posuvník rychlosti; generuje 2 varianty, brát **Generation 2**.
3. Stáhnout MP3 a zpracovat: `ffmpeg -i vstup.mp3 -af "atempo=0.9,adelay=500|500,apad=pad_dur=0.5,loudnorm=I=-18:TP=-2" -ac 1 -b:a 64k web/audio/cestina/t<T>/<id>.mp3` (zpomalení 10 % bez změny výšky, 0,5 s ticha na krajích, mono, hlasitost sjednocená).
4. Korektor nahrávku poslechne (výslovnost koncovek).

## Postup pro Pavla (původní)
1. Vzít řádky se stavem „čeká na Pavla“.
2. V ElevenLabs vygenerovat s nastavením výše, uložit pod uvedeným ID do `web/audio/cestina/…` (např. `web/audio/cestina/t1/l2-u4.mp3`).
3. Stav změnit na „hotovo <datum>“. Tým pak nahrávky poslechne (korektor) a případně vrátí s poznámkou „přegenerovat: …“.
