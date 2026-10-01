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

## Seznam nahrávek

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t1/l2-u4.mp3` | 2 / úloha 4 | poslech | Táta včera koupil nové kolo. | nezdůrazňovat „koupil“ | hotovo 30. 9. (v4, Jana, tempo 0,9 přes ffmpeg) |
| `t1/l4-u4.mp3` | 4 / úloha 4 | poslech | Šikovná Lucka rychle vyřešila těžký příklad. | nezdůrazňovat „vyřešila“ ani „těžký“ | hotovo 30. 9. (v4, Jana, tempo 0,9 přes ffmpeg) |
| `t2/l6-u4.mp3` | 6 / úloha 4 (`k1` i `final`) | poslech | Kočku honí sousedův pes. | Oznamovací věta, ne otázka. Neutrální přízvuk, nezdůrazňovat „kočku“ ani „pes“; koncovka „-u“ v „kočku“ musí být zřetelně slyšet. Cca 2 s. | hotovo 30. 9. (v4, Jana, tempo 0,9) |
| `t2/l8-u4.mp3` | 8 / úloha 4 (`k1`, `k2`, `final`) | poslech | Tomáši, pojď s námi k řece! | Přirozené zavolání s krátkou pauzou po „Tomáši“ (čárka). Nezdůrazňovat „řece“; „k řece“ vyslovit spojitě, bez polknutí „k“. Cca 2 s. | hotovo 30. 9. (v4, Jana, tempo 0,9) |
| `t3/l11-u4.mp3` | 11 / úloha 4 (`k1` i `final`) | poslech | Lucka vystoupila z tramvaje bez radosti, protože zapomněla úkol. | cca 5 s; nezdůrazňovat „tramvaje“ ani „radosti“, ale koncovky -e / -i vyslovit zřetelně (nepolykat) | čeká |
| `t3/l12-d1.mp3` | 12 / úloha 6, `k1` věta 1 | diktát | Tomáš čeká před školou na spolužáky. | 2×: celá věta, pauza 2 s, pomalu po slovech (0,75×, pauza 0,7 s); interpunkce se neříká; před jménem hlásit „velké písmeno — Tomáš“ | čeká |
| `t3/l12-d2.mp3` | 12 / úloha 6, `k1` věta 2 | diktát | Lucka nese tašky do třídy. | 2× jako výše; hlásit „velké písmeno — Lucka“; *tašky* nevyslovovat jako *tašký* | čeká |
| `t3/l12-d3.mp3` | 12 / úloha 6, `k1` věta 3 | diktát | Učitel sedí na židli. | 2× jako výše | čeká |
| `t3/l12-d4.mp3` | 12 / úloha 6, `k1` věta 4 | diktát | Na lavici leží knihy a pastelky. | 2× jako výše | čeká |
| `t4/l14-u4.mp3` | 14 / úloha 4 (k1 i final) | poslech | Veselí kamarádi hrají na hřišti fotbal a malý pes jim nosí míč. | nezdůrazňovat „Veselí“ ani „malý“; bez pauzy před „a“ (věta je jedna, dítě má slyšet obě jména); cca 5 s | čeká |
| `t4/l16-u4.mp3` | 16 / úloha 4 (k1 i final) | poslech | Haf, haf! Pes vesele běží k Tomášovi a olizuje mu ruku. | „Haf, haf“ říct normálním hlasem, ne štěkat; nezdůrazňovat „vesele“; cca 5 s | čeká |
| `t4/l16-d1.mp3` | 16 / úloha 6, k1, věta 1 | diktát | Za domem štěkají hladoví psi. | 2×: celek, pauza 2 s, pak po slovech tempo 0,75× s pauzou 0,7 s; interpunkce se neříká | čeká |
| `t4/l16-d2.mp3` | 16 / úloha 6, k1, věta 2 | diktát | Tomáš má nový batoh. | jako d1; vlastní jméno hlásit „velké písmeno — Tomáš“ (AUDIO.md) | čeká |
| `t4/l16-d3.mp3` | 16 / úloha 6, k1, věta 3 | diktát | Klára jde ráno do školy. | jako d1; „velké písmeno — Klára“ | čeká |
| `t5/l18-u4.mp3` | 18 / úloha 4 (k1 i final) | poslech | Lucka teď píše úkol a zítra napíše test. | nezdůrazňovat „píše“ ani „napíše“; „teď“ a „zítra“ neutrálně; ≈ 4 s | čeká |
| `t5/l20-u4.mp3` | 20 / úloha 4 (k1 i final) | poslech | O prázdninách bysme rádi jeli k babičce. | **záměrně hovorový tvar „bysme“** — vyslovit přirozeně, nezdůrazňovat, neopravovat na „bychom“; ≈ 3 s | čeká |
| `t5/l20-d1.mp3` | 20 / úloha 6, k1, věta 1 | diktát | Lucko, pojď ven. | hlásit „velké písmeno — Lucko“; interpunkce se neříká; „pojď“ s jasným ď | čeká |
| `t5/l20-d2.mp3` | 20 / úloha 6, k1, věta 2 | diktát | Večer budu psát úkol. | dlouhé á v „psát“ slyšet; interpunkce se neříká | čeká |
| `t5/l20-d3.mp3` | 20 / úloha 6, k1, věta 3 | diktát | Dnes bych rád hrál fotbal. | „bych“ zřetelně jako jedno slovo, ne „bysem“; interpunkce se neříká | čeká |
| `t5/l20-d4.mp3` | 20 / úloha 6, k1, věta 4 | diktát | Zavolal bys tátovi? | „bys“ bez pauzy uvnitř (ne „by si“); otázka jen intonací, otazník se neříká | čeká |
| `t6/l21-u4.mp3` | 21 / úloha 4, kroky k1, k2, final | poslech | První věta: Honzík byl včera celý den u babičky. Druhá věta: Po závodě mu srdce rychle bilo. Třetí věta: Zítra chci být doma dřív. | nezdůrazňovat „byl“, „bilo“, „být“; mezi větami pauza 1,5 s; cca 14 s | čeká |
| `t6/l24-u4.mp3` | 24 / úloha 4, kroky k1, k2, final | poslech | První věta: Uprostřed řeky se točil vír. Druhá věta: Zítra budu mít trénink. Třetí věta: Hodiny na věži začaly bít poledne. | nezdůrazňovat „vír“, „mít“, „bít“; mezi větami pauza 1,5 s; cca 13 s; *vír* s dlouhým í (délka musí být slyšet) | čeká |
| `t6/l24-d1.mp3` | 24 / úloha 6, k1, věta 1 | diktát | Na louce u mlýna se pase kobyla. | věta dvakrát (celá, pauza 2 s, po slovech 0,75× s pauzou 0,7 s), interpunkce se neříká | čeká |
| `t6/l24-d2.mp3` | 24 / úloha 6, k1, věta 2 | diktát | Dědeček bydlí ve vysokém domě. | jako d1; „vysokém“ s dlouhým é | čeká |
| `t6/l24-d3.mp3` | 24 / úloha 6, k1, věta 3 | diktát | Myška se schovala do pytle. | jako d1 | čeká |
| `t6/l24-d4.mp3` | 24 / úloha 6, k1, věta 4 | diktát | Brzy ráno slyším zpívat sýkory. | jako d1; „sýkory“ s dlouhým ý | čeká |
| `t7/l25-u4.mp3` | 25 / úloha 4 (`k1`, `final`) | poslech | Kláru pozval na oslavu Honzík. | Nezdůrazňovat ani „Kláru“, ani „Honzík“. Běžná intonace oznamovací věty, bez důrazu na konec. Asi 3 s. | čeká |
| `t7/l27-u4.mp3` | 27 / úloha 4 (`k1`) | poslech | Děti čekaly na autobus. Autobus dlouho nejel. Nakonec šly pěšky. Rodiče na ně čekali doma. | Mezi větami pauza asi 0,7 s. Nezdůrazňovat „šly“. Asi 9 s. | čeká |
| `t7/l28-d1.mp3` | 28 / úloha 6 (`k1`), věta 1 | diktát | Kluci hráli na hřišti fotbal. | Podle AUDIO.md: dvakrát (celá věta, pauza 2 s, pomalu po slovech 0,75×, 0,7 s mezi slovy), interpunkce se neříká. | čeká |
| `t7/l28-d2.mp3` | 28 / úloha 6 (`k1`), věta 2 | diktát | Na louce se pásly kobyly. | jako d1; „pásly“ s dlouhým á | čeká |
| `t7/l28-d3.mp3` | 28 / úloha 6 (`k1`), věta 3 | diktát | Psi běhali kolem mlýna. | jako d1; „mlýna“ s dlouhým ý | čeká |
| `t7/l28-d4.mp3` | 28 / úloha 6 (`k1`), věta 4, **jen rezerva** | diktát | Holky seděly na lavičkách a povídaly si. | Generovat, jen když recenzent rozhodne o 4 větách (viz poznámka L28). | čeká (rezerva) |
| `t8/l29-u4.mp3` | 29 / úloha 4 | poslech | Tomáš, Lucka a Klára šli ven, protože venku svítilo slunce. | přirozené pauzy mezi jmény nechat (jsou součástí úlohy), ale netáhnout je delší než pauzu před „protože“; nic nezdůrazňovat; cca 5 s | čeká |
| `t8/l32-d1.mp3` | 32 / úloha 6, k1, věta 1 | diktát | Tomáš a Honzík byli s námi na výletě. | hlásit „velké písmeno — Tomáš“, „velké písmeno — Honzík“; „s námi“ vyslovit přirozeně (ne *z námi*) | čeká |
| `t8/l32-d2.mp3` | 32 / úloha 6, k1, věta 2 | diktát | Lucka mně půjčila lyže. | hlásit „velké písmeno — Lucka“; „mně“ vyslovit přirozeně [mňe], nepřehánět | čeká |
| `t8/l32-d3.mp3` | 32 / úloha 6, k1, věta 3 | diktát | Psi běhali mezi stromy. | bez vlastních jmen | čeká |
| `t8/l32-d4.mp3` | 32 / úloha 6, k1, věta 4 | diktát | Klára se vrátila ze školy a pozvala mě na oslavu. | hlásit „velké písmeno — Klára“; „ze školy“ zřetelně; čárka tu žádná není | čeká |

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
