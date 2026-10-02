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
| `t1/l1-u3.mp3` | 1 / úloha 3 (`k1` i `final`) | poslech | Pátý den tábora jsme my dva našli v lese tři houby. | Nic nezdůrazňovat, hlavně ne „pátý“ a „my“; „my dva“ vyslovit spojitě, bez pauzy. Oznamovací intonace. Cca 4 s. | čeká |
| `t1/l3-u2.mp3` | 3 / úloha 2 (`k1` i `final`) | poslech | Večer jsme šli kolem rybníka a viděli tam dvě volavky. | „Večer“ na začátku bez důrazu a bez pauzy za ním; „kolem rybníka“ spojitě (pauza by napověděla). Cca 4 s. | čeká |
| `t2/l5-u3.mp3` | 5 / úloha 3 (`k1` i `final`) | poslech | Tomáš potkal na hřišti souseda s dědou. | Oznamovací věta. Nezdůrazňovat „souseda“ ani „dědou“; koncovky „-a“ v „souseda“ a „-ou“ v „dědou“ vyslovit zřetelně, nepolykat. Cca 3 s. | čeká |
| `t2/l6-u3.mp3` | 6 / úloha 3 (`k1` i `final`) | poslech | Na náměstí si hrálo kotě s malým štěnětem. | Oznamovací věta. Nezdůrazňovat „náměstí“ ani „štěnětem“; „štěnětem“ vyslovit celé a zřetelně (slabika „-ně-“ se nesmí ztratit), „náměstí“ s dlouhým „í“. Cca 3 s. | čeká |

Týden 2+ doplní autor úloh při psaní lekcí. Před odevzdáním týdne musí být řádky pro všechny `poslech` a `diktat` kroky v tabulce, jinak QA týden nepustí (kontrola: každý `audio` odkaz v JSON má řádek tady a soubor na disku).

## Postup (ověřený 30. 9., model Eleven v4)
1. ElevenLabs → Text to Speech, hlas **Jana – Warm, Confident Czech Female**, model **Eleven v4**, Stability ≈ 75 % (Robust), Similarity 75 %.
2. Text s prefixem `[calm, slow, clear] ` + přesné znění. v4 nemá posuvník rychlosti; generuje 2 varianty, brát **Generation 2**.
3. Stáhnout MP3 a zpracovat: `ffmpeg -i vstup.mp3 -af "atempo=0.9,adelay=500|500,apad=pad_dur=0.5,loudnorm=I=-18:TP=-2" -ac 1 -b:a 64k web/audio/cestina/t<T>/<id>.mp3` (zpomalení 10 % bez změny výšky, 0,5 s ticha na krajích, mono, hlasitost sjednocená).
4. Korektor nahrávku poslechne (výslovnost koncovek).

## Postup pro Pavla (původní)
1. Vzít řádky se stavem „čeká na Pavla“.
2. V ElevenLabs vygenerovat s nastavením výše, uložit pod uvedeným ID do `web/audio/cestina/…` (např. `web/audio/cestina/t1/l2-u4.mp3`).
3. Stav změnit na „hotovo <datum>“. Tým pak nahrávky poslechne (korektor) a případně vrátí s poznámkou „přegenerovat: …“.
