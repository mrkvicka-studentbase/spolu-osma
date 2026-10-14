# Téma 4 — Zájmena a číslovky: naostro lekce (Spolu 8)

Verze 1.0, 14. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, Nejistoty), korektora (Ověření ÚJČ), autora nahrávek (Nahrávky). Lekce: `obsah/cestina/lekce/cj-t4-l13n.json` až `cj-t4-l16n.json` (dvojčata učebních lekcí `cj-t4-l13` až `cj-t4-l16`; téma 4 nemá rozpis učebních lekcí, vycházím z jejich JSON).

**Závazné vstupy:** `ZADANI-OSMA.md` (§3, §4, §8, §9), `PLAN-ROZSIRENI.md` §3, `OSNOVA.md` (§1–§4, §8, §16), `FORMAT-CJ.md`, `TYPY-CHYB.md`, `TERMINOLOGIE.md`, `AUDIO.md`, `obsah/SABLONA.md` §4, §8, §9, §18, §19.

## Společné pro všechny čtyři lekce

- **Hlavička** jako učební lekce: `tema` a `kapitola` `zajmena-cislovky` beze změny, `tyden` 4, `poradi` 1–4, `faze` `osma`, `cas_min` 25 (4 + 5 + 5 + 5 + 6). Id `cj-t4-l<n>n`, úlohy `…n-U1` až `U5`, poslední krok `final`.
- **Struktura** stejná jako u učební lekce (rozcvicka, nova, nova, detektiv, kontrolni); poslech ve stejné úloze (L14n a L15n U3), L16n má diktát a týdenní kontrolu (`tydenni: true`, `semafor_tydne`).
- **Těžší / objemnější:** víc položek (8–9 zájmen místo 6–7, 6 kroků místo 4, 8–12 mezer místo 6–10, diktát 4 věty a 5 hlídaných slov místo 3), čtyři dlaždice v řadě, slova v jiných tvarech (tu, někomu, našeho, nikoho, čtvrté, dvěma), smíšené jevy z celé lekce, delší nahrávky se třemi otázkami a chyba detektiva vedle stejně znějícího správného tvaru.
- **Vše nové:** žádná věta, mezera ani příklad z učební lekce (stejné typy chyb ano). „Platí“ a slovníček mají jiné příklady než úlohy a neobsahují odpověď ani hodnocené slovo (test L14n jménem *Emu/Emě*, úloha U3 hodnotí *Kláru/Kláře*).
- **Méně opory:** `uvod_pro_rodice` říká, že jde o naostro („Dítě tuhle látku dělalo v lekci …“, 2 věty), „Platí“ je jen připomenutí; `vysvetleni` v taháku říká, v čem je úloha těžší než v učební lekci. Tahák je plný.
- **„Dnes samo“:** otázky taháku neříkají odpověď žádného kroku ani neukazují na chybné slovo detektiva (otázky ke kroku 2 nejmenují druh chybného slova, např. ne „číslo dva“).
- **Kódy chyb** jen z `TYPY-CHYB.md`: `zajmeno-druh-zamena`, `jenz-rod-zamena`, `me-mne-zamena`, `zajmeno-ji-delka`, `zajmeno-jeho-po-predlozce`, `cislovka-druh-zamena`, `cislovka-hovorovy-tvar`, `cislovka-pad-zamena`, `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby`. Nový kód nepoužívám (návrh viz Nejistoty).
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv; Honzík nikde. Lucka nikde v hodnoceném tvaru (nemá heslo v příručce).
- **Slovní limity SABLONA §4** ověřeny skriptem (vysvětlení ≤ 70, otázky ≤ 25, typická chyba ≤ 50 / 90, semafor 25 / 60 / 75, zadání ≤ 60, popisek ≤ 8, dlaždice ≤ 8): 0 překročení.

---

## LEKCE 13n — Druhy zájmen a vztažné jenž (`cj-t4-l13n`)

Těžší než L13: rozcvička se čtyřmi nabídkami a víc jmény stejného rodu, 8 zájmen místo 6 (i v jiném tvaru, past *jeho* = přivlastňovací), 6 kroků místo 4 (*který* vztažné i ve větě s otazníkem, *jenž* k jménu v jiném pádě a k rodu střednímu), detektiv s *muzeum* (rod střední, končí jako mužské), kontrolní 9 zájmen místo 7.

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z1 + čtení, 4 × `dlazdice`: A) Táta **jim** podal klíč · B) Ema **ji** složila do tašky · C) Lucka **mu** hned odpověděla · D) Chodí s **ní** na volejbal | Adam a Tomáš, mikina, Tomáš, kamarádka | obecné (bez kódu, jako učební L13) |
| U2 nová (5) | `oznac_role` 8 zájmen, 7 rolí: „Jaký dárek koupíme Adamovi? Já bych mu dala tu hru, která se mu líbila v obchodě. Nikdo z nás ale neví, jestli ji už nemá od někoho z rodiny. Zeptám se jeho sestry.“ `slova` [0, 4, 8, 10, 16, 22, 26, 31] | tázací, osobní, ukazovací, vztažné, záporné, osobní, neurčité, přivlastňovací | Nikdo neurčité, která tázací, jeho osobní, tu osobní → `zajmeno-druh-zamena` |
| U3 nová (5) | 6 × `dlazdice`: A) Kterou cestou půjdeme? · B) Viděla Ema film, který dávali v televizi? · C) Míč, ___ ležel pod lavičkou … · D) Zpráva, ___ přišla ráno … · E) Kolo, ___ stojí u plotu … · F) Poděkovali jsme trenérovi, ___ nás vedl. | tázací, vztažné, jenž, jež, jež, jenž | A/B → `zajmeno-druh-zamena`; C–F → `jenz-rod-zamena` |
| U4 detektiv (5) | „O prázdninách jsme navštívili muzeum, **jenž** stojí na kraji města u řeky.“ k1 klik (5); final který · jenž · jež · kdo | k1 [5] · final jež | k1 navic [4, 6, 9] → `detektiv-jine-slovo`; final jenž → `jenz-rod-zamena`, který/kdo → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | `oznac_role` 9 zájmen: „Ten míč, jenž leží u branky, patří asi někomu z našeho týmu. Kdo ho tam nechal? Nikdo se nepřiznal. Tomáš tvrdí, že on to nebyl. Trenér, který čeká u šatny, se už zlobí.“ `slova` [0, 2, 8, 10, 12, 13, 16, 22, 26] | ukazovací, vztažné, neurčité, přivlastňovací, tázací, osobní, záporné, osobní, vztažné | jenž tázací, Nikdo neurčité, někomu záporné, Ten osobní → `zajmeno-druh-zamena` |

## LEKCE 14n — Tvary zájmen: mě/mně, ji/jí, něho (`cj-t4-l14n`)

Těžší než L14: rozcvička se čtyřmi nabídkami a tvarem *kterého*, 8 mezer mě/mně místo 6 (i po předložkách *pro, ode, ke, o* a u *líbit se, požádat*), poslech se třemi krátkými slovy a třemi otázkami, detektiv se dvěma *mně* (jen druhé chybné), kontrolní 11 mezer místo 8 (i *kvůli němu* a past *jeho mobil* bez předložky).

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L13, `dlazdice`: A) **Žádný** autobus … · B) Kluk, **kterého** jsme potkali … · C) **Jaký** film chceš vidět? · D) Taška, ___ leží u dveří … (jenž · jež) | záporné, vztažné, tázací, jež | A–C → `zajmeno-druh-zamena`; D jenž → `jenz-rod-zamena` |
| U2 nová (5) | `doplnit_pismeno` 8 × ě/ně: Lucka m_ napsala · Pro m_ je to daleko · ode m_ · se m_ líbil · m_ požádala · ke m_ · m_ nepoznal · o m_ | ně, ě, ě, ně, ě, ně, ě, ně | mezery 0, 3 ě a 1, 4 ně → `me-mne-zamena` |
| U3 nová, **poslech** (5) | `t4/l14n-u3.mp3`; k1 „Kláru v nahrávce třikrát zastoupí krátké slovo. Jak zní za sebou?“ (jí, ji, jí · ji, jí, ji · jí, jí, jí · ji, ji, jí); k2 jméno místo druhého (Kláře · Kláru · Klárou); final jméno místo třetího (Kláru · Klárou · Kláře · Kláry) | k1 jí, ji, jí · k2 Kláru · final Kláře | k1 ji, jí, ji; k2 Kláře; final Kláru → `zajmeno-ji-delka` |
| U4 detektiv (5) | „Adam mi slíbil, že v sobotu přijde ke mně a vezme **mně** s sebou na hokej.“ k1 klik (11); final „Jak to slovo napíšeš správně?“ mi · mně · mě · mnou | k1 [11] · final mě | k1 navic [8, 1] (ke mně, mi) → `detektiv-jine-slovo`; final mně → `me-mne-zamena`, mi/mnou → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | `doplnit_pismeno` 11 mezer: Ema m_ poslala · Tomáš j_ nepoznal · Klára j_ odepsala · u _ (něho/jeho) · ležel _ (něho/jeho) nový mobil · Adam m_ ho půjčil · Kvůli _ (němu/jemu) · j_ přivítali · j_ podala ruku · m_ nechá vybrat · m_ naučí | ně, i, í, něho, jeho, ně, němu, i, í, ě, ě | 0 ě → `me-mne-zamena`; 1 í → `zajmeno-ji-delka`; 3 jeho → `zajmeno-jeho-po-predlozce`; 9 ně → `me-mne-zamena` |

## LEKCE 15n — Číslovky: druhy a tvary dva, oba, tři, čtyři (`cj-t4-l15n`)

Těžší než L15: rozcvička se dvěma mezerami v každé řadě, druh u 7 číslovek v souvislém textu (místo 4 izolovaných, i *čtvrté*, *ty první*, *troje*), poslech se dvěma hovorovými tvary vedle správného *oběma* a třemi otázkami, detektiv s tvarem pro jinou pádovou otázku mezi dvěma správnými tvary, kontrolní 10 mezer místo 6 (i 3. p. *třem, čtyřem* a 6. p. *obou*).

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L14, 4 × `doplnit_pismeno` po 2 mezerách: A) Řekni m_, kdy pro m_ přijdeš · B) … tak j_ Adam podal ruku a zvedl j_ ze země · C) Všichni se k _ (němu/jemu) hrnou a chválí _ (něho/jeho) kolo · D) Ema m_ půjčila tužku a já j_ pravítko | A ně, ě · B í, i · C němu, jeho · D ně, í | `me-mne-zamena`, `zajmeno-ji-delka`, C jemu → `zajmeno-jeho-po-predlozce` |
| U2 nová (5) | `oznac_role` 7 číslovek, 4 role: „Na turnaj přijelo dvanáct týmů. Naše družstvo hrálo šestkrát a skončilo čtvrté. Adam si vzal troje kopačky, protože ty první se mu hned roztrhly. Ve finále dal tři góly a za celý turnaj střílel na bránu dvacetkrát.“ `slova` [3, 8, 11, 15, 19, 27, 36] | základní, násobná, řadová, druhová, řadová, základní, násobná | troje, první, čtvrté, dvacetkrát jako základní → `cislovka-druh-zamena` |
| U3 nová, **poslech** (5) | `t4/l15n-u3.mp3` (záměrně *čtyřma*, *dvouma*); k1 „Jedno ze slov v nabídce má v písemce jiný tvar, než jaký zazněl. Které?“ (oběma · čtyřma · bratranci · kamarády); k2 čtyřmi · čtyřma · čtyř · čtyřem; final „V nahrávce je ještě jedno slovo …“ dvěma · dvouma · dvou · dvěmi | k1 čtyřma · k2 čtyřmi · final dvěma | k2/final -ma → `cislovka-hovorovy-tvar`; čtyř, čtyřem, dvou → `cislovka-pad-zamena` |
| U4 detektiv (5) | „Po zápase jsme poděkovali oběma trenérům a třem rozhodčím a domů jsme odjeli bez **dvěma** hráčů.“ k1 klik (14); final dvouma · dvou · dvěmi · dva | k1 [14] · final dvou | k1 navic [4, 7] → `detektiv-jine-slovo`; final dvouma → `cislovka-hovorovy-tvar`, dvěmi/dva → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | `doplnit_pismeno` 10 mezer se slovní nabídkou: Na hrad jsme vyrazili se _ učitelkami · mezi _ dvojčaty · do _ skupin · se _ věžemi · O _ věžích · ke _ rybníkům · U _ z nich · _ spolužačkám · se _ auty · s _ sestrami | třemi, oběma, dvou, dvěma, obou, čtyřem, dvou, třem, čtyřmi, oběma | 0 třema, 8 čtyřma → `cislovka-hovorovy-tvar`; 2 dvěma, 7 třemi → `cislovka-pad-zamena` |

## LEKCE 16n — Kontrola tématu: zájmena a číslovky (`cj-t4-l16n`)

Těžší než L16: rozcvička se čtyřmi nabídkami a tvary v jiném pádě (*nikoho*, *čtyřem*), druh u 11 slov místo 6 (každý druh zájmena i číslovky jednou), 11 mezer místo 6 se všemi jevy tématu (i *jenž/jež*, *jeho* za předložkou), detektiv s chybou na konci dlouhé věty vedle správného *jí*, diktát 4 věty / 5 hlídaných slov místo 3 / 3, doplňovačka 12 mezer místo 10.

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L13–L15, `dlazdice`: A) druh **nikoho** · B) druh **čtyřikrát** · C) Ema je smutná. Něco ___ trápí. (ji · jí) · D) Adam poslal pozvánku ___ kamarádům. (čtyřmi · čtyřem · čtyřma) | záporné, násobná, ji, čtyřem | `zajmeno-druh-zamena`, `cislovka-druh-zamena`, `zajmeno-ji-delka`, čtyřmi → `cislovka-pad-zamena`, čtyřma → `cislovka-hovorovy-tvar` |
| U2 nová (5) | text: „Na závody jsme jeli dvěma autobusy. Tomáš doběhl osmý a jeho sestra Klára cestou dvakrát zakopla. Kdo jí pomohl? Nikdo, jen někdo z diváků zatleskal. Ta trasa, která vedla lesem, byla kluzká. Klára měla v batohu troje ponožky.“ k1 `oznac_role` číslovky [4, 8, 14, 36]; final `oznac_role` zájmena [10, 16, 17, 19, 21, 25, 27] | k1 základní, řadová, násobná, druhová · final přivlastňovací, tázací, osobní, záporné, neurčité, ukazovací, vztažné | k1 osmý, troje, dvakrát základní → `cislovka-druh-zamena`; final jeho osobní, Nikdo neurčité, která tázací, někdo záporné → `zajmeno-druh-zamena` |
| U3 nová (5) | `doplnit_pismeno` 11 mezer: Trenér m_ oznámil · trenér j_ vybral · se _ trenéry · Hala, _ stojí · proti _ týmům · u _ doma · s _ tátou · Máma m_ zabalila · Ema m_ rozesměje · j_ koupíme · po _ dnech | ně, i, dvěma, jež, čtyřem, něho, jeho, ně, ě, í, dvou | 0 ě → `me-mne-zamena`; 1 í → `zajmeno-ji-delka`; 3 jenž → `jenz-rod-zamena`; 5 jeho → `zajmeno-jeho-po-predlozce` |
| U4 detektiv (5) | „Ema si nevěděla rady s příkladem, tak jí Klára nakreslila obrázek a vysvětlila **ji** celý postup.“ k1 klik (13); final Emu · Emě · Emou · Emy | k1 [13] · final Emě | k1 navic [7, 5] → `detektiv-jine-slovo`; final Emu → `zajmeno-ji-delka`, Emou/Emy → `detektiv-oprava-jine-chyby` |
| U5 kontrolní **týdenní** (6) | k1 `diktat` 4 věty, 24 slov, `max_prehrani` 2, `hodnotit_interpunkci` false, `hodnotit_velikost` false (věty viz Nahrávky); final `doplnit_pismeno` 12 mezer: m_ Klára řekla · se _ spolužačkami · Program, _ trval · j_ tleskali · j_ pochválila · na _ čekat · Ukázal m_ · ze _ zkoušek · se _ kluky ze třídy · i _ sestra · m_ doprovodil · Klára, _ zářila | final ně, třemi, jenž, í, i, něho, ně, dvou, čtyřmi, jeho, ě, jež | diktát `chyby_ocekavane`: mně (0,1) a mě (1,1) `me-mne-zamena`, ji (2,1) a jí (2,7) `zajmeno-ji-delka`, dvěma (3,3) `cislovka-hovorovy-tvar`; final 0 ě → `me-mne-zamena`, 3 i → `zajmeno-ji-delka`, 1 třema → `cislovka-hovorovy-tvar`, 5 jeho → `zajmeno-jeho-po-predlozce` |

`semafor_tydne` (z `final`, 12 mezer): zelená 11–12 (~90 %), oranžová 8–10 (~70 %), červená 0–7.

**Diktát slovo po slově** (OSNOVA §2.2): Adam · **mně** (T4) · poslal, novou, hru; Tomáš · **mě** (T4) · naučil (či, Z5), hrát, šachy (hy, Z5); Ema · **ji** (T4, délka slyšet) · potkala, u, řeky (ky, Z5), a, podala · **jí** (T4) · ruku; Přinesl (ři, Z5), jsem, dárek · **dvěma** (T4; vě bez předpony = Z5) · kamarádkám. Slovesa jen v j. č. minulého času, žádné *s/z/se/ze*, žádné *i/í/y/ý* po obojetné souhlásce v kořeni ani v příponě, Honzík ne.

---

## Nahrávky (pro AUDIO.md)

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t4/l14n-u3.mp3` | cj-t4-l14n / úloha 3 (`k1` i `k2` i `final`) | poslech | Adam uviděl na zastávce Kláru. Pomohl jí s taškou, doprovodil ji domů a cestou jí vyprávěl o zápase. | Oznamovací intonace, nic nezdůrazňovat; délka musí být zřetelně slyšet: „jí“ dlouze (dvakrát), „ji“ krátce. Cca 7 s. | čeká na Pavla |
| `t4/l15n-u3.mp3` | cj-t4-l15n / úloha 3 (`k1` i `k2` i `final`) | poslech | V sobotu jsme s oběma bratranci a se čtyřma kamarády hráli fotbal proti dvouma týmům z vedlejší vesnice. | **Záměrně hovorové „čtyřma“ a „dvouma“** — vyslovit přesně tak, neopravovat; „oběma“ spisovně. Nic nezdůrazňovat. Cca 7 s. | čeká na Pavla |
| `t4/l16n-d1.mp3` | cj-t4-l16n / úloha 5 (diktát, věta 1) | diktát | Adam mně poslal novou hru. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t4/l16n-d2.mp3` | cj-t4-l16n / úloha 5 (diktát, věta 2) | diktát | Tomáš mě naučil hrát šachy. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t4/l16n-d3.mp3` | cj-t4-l16n / úloha 5 (diktát, věta 3) | diktát | Ema ji potkala u řeky a podala jí ruku. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. „ji“ krátce, „jí“ dlouze. | čeká na Pavla |
| `t4/l16n-d4.mp3` | cj-t4-l16n / úloha 5 (diktát, věta 4) | diktát | Přinesl jsem dárek dvěma kamarádkám. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |

**Celkem 6 nahrávek** (2 poslechy, 4 věty diktátu). Do `AUDIO.md` je sloučí vedoucí; do té doby validátor hlásí jen „nahrávka nemá řádek v AUDIO.md“ (10 chyb ve 3 lekcích, jiné chyby 0).

---

## Ověření ÚJČ

Ověřeno 14. 10. 2026 přes `bash nastroje/ujc.sh` (server odpovídal; část hesel z cache po učebních lekcích).

| tvar / jev | lekce | výsledek v ÚJČ |
|---|---|---|
| druhy zájmen: *kdo, jaký, který* zájm. táz. i vzt.; *nikdo* (2. p. *nikoho*), *žádný* zájm. záp.; *někdo* (*někomu, někoho*) zájm. neurč.; *ten* (*tu, Ta*) zájm. ukaz.; *náš* (*našeho*), *jeho* zájm. přivl. (jeho: „k on, ono; nesklonné“); *já, my, on, ona* zájm. os. | 13n, 14n, 16n | SSČ v heslech; *jaký, který, kdo* se hodnotí jako tázací jen v otázce, jako vztažné jen za čárkou u jména |
| *čí* | — | SSČ: „zájm. přivl. 1. táz. 2. vzt.“ → dvojí zařazení, **vyřazeno** z hodnocení (L13n U2 má místo něj *Jaký*) |
| *jenž* (m.) × *jež* (ž., s.) jen v 1. p. j. č.; rod: *míč, program* m. neživ., *trenér, kamarád* m. živ., *zpráva, taška, hala* ž., *kolo, muzeum* s. | 13n, 14n, 16n | tabulky id=jenž, jenž_1, jež, jež_1; rod v tabulkách hesel (*muzeum* s., 1. p. *muzeum*) |
| *já*: 2. a 4. p. *mě*, 3. a 6. p. *mně* (dublety *mne*, *mi* nejsou v nabídce) | 14n–16n | id=650, id=já_1 |
| *ona*: 2., 3., 7. p. *jí*, 4. p. *ji*, po předložce *ní, ni*; *on*: po předložce *něho, něj, němu*, při důrazu bez předložky *jeho, jemu* (v nabídce nikdy *něj*) | 14n–16n | id=ona, id=on (poznámka „Podoby s n- se užívají po předložce“) |
| test jménem: *Klára* (Kláru, Kláře, Klárou), *Ema* (Emy, Emě, Emu, Emou) | 14n–16n | tabulky hesel |
| vazby: *požádat* (koho), *doprovodit* (koho), *vyprávět* (komu), *naučit* (koho co), *tleskat* (komu: „tleskat řečníkovi“), *rozesmát* (koho), *ukázat* (komu co), *kvůli* předl. s 3. p. | 14n, 16n | SSČ v heslech |
| druhy číslovek: *dvanáct, tři* čísl. zákl.; *čtvrtý, osmý, první* čísl. řad.; *šestkrát, dvacetkrát, čtyřikrát* čísl. nás. přísl.; *dvakrát* čísl. nás.; *troje* „význam souborový, příp. druhový, u pomnožných jmen význam číslovky základní“ | 15n, 16n | SSČ (u *šest, dvacet, čtyři, osm*), heslo *troje* → jen s nepomnožnými (*kopačky, ponožky* = páry), ve škole druhová |
| *dva, oba*: 2. a 6. p. *dvou, obou*, 3. a 7. p. *dvěma, oběma* (nikoli *dvouma, dvěmi*); *tři*: 3. p. *třem*, 7. p. *třemi*; *čtyři*: 3. p. *čtyřem*, 7. p. *čtyřmi*; *-ma* jen u částí těla | 15n, 16n | id=670, id=671, tabulky hesel *dva, oba, tři, čtyři*; 2. p. *tří/třech, čtyř/čtyřech* v textech není |
| jména u číslovek: *bratranec* (7. mn. *bratranci*), *dvojče* (7. mn. *dvojčaty*), *věž* (6. mn. *věžích*, 7. mn. *věžemi*), *skupina* (2. mn. *skupin*), *den* (6. mn. *dnech*), *hráč, trenér, tým, rybník, auto, sestra, spolužačka, učitelka, kamarádka*; *rozhodčí, vedoucí* = příd. jm. (*rozhodčím, vedoucími*) | 15n, 16n | tabulky hesel (jen kontext, hodnotí se číslovka) |
| diktát L16n: *hra, šachy, řeka, ruka, dárek, kamarádka, ukázat, naučit, potkat, podat, přinést* | 16n | hesla, viz rozbor slovo po slově výše |

## Nejistoty

- **L13n U3 věta B** („Viděla Ema film, který dávali v televizi?“): *který* je vztažné, i když celá věta končí otazníkem. Učební L13 učí pomůcku „otazník → tázací“; naostro ji záměrně zkouší (tahák to vysvětluje). Jednoznačné (který připojuje větu k *film*), ale vedoucí ať potvrdí, že to není nad rámec.
- **L16n U3 a U5, L15n U1:** *jeho* hodnocené jako správné i **za předložkou** (*s jeho tátou*), protože říká čí. Učební L14 to má v otočené roli („Jeho se píše … když říká čí“). Vlastník nikdy není podmět věty, takže se nehodnotí sporné *svůj × jeho* (OSNOVA §8).
- **L14n U4 final** je proti učební lekci pravopis (mi · mně · mě · mnou) místo náhrady (tě · tobě), aby „Platí“ (test *tě, nebo tobě*) neobsahovalo hodnocené slovo. *mne* v nabídce není.
- **L16n diktát *dvěma*:** kód `cislovka-hovorovy-tvar` jako v učební L16 u *oběma*; skutečná chyba v diktátu bude spíš *dvjema* (Z5). Ponechávám kvůli jednotnosti.
- **Rozhodčí, vedoucí** jsou v příručce přídavná jména (zpodstatnělá); stojí jen v kontextu u hodnocené číslovky.
- **Kód chybí** pro tvar s *n-* bez předložky nebo místo přivlastňovacího *jeho* (*ležel něho mobil*, *poslal i němu*) — teď obecná chyba, zmíněná v taháku. **Návrh nového kódu** `zajmeno-neho-bez-predlozky`: „použije tvar s n- (něho, němu) bez předložky nebo tam, kde jeho říká čí“, otázka „Stojí před tím slovem předložka? Neříká to slovo, čí ta věc je?“ — jen návrh, v JSON nepoužit.
- **Validátor / web:** bez nálezů. Vyhodnocení přes `web/js/vyhodnoceni.js` + `vyhodnoceni-cj.js` (`/tmp/naostro-cj4/over.mjs`): 174 kontrol, 0 chyb (vzorová odpověď každého kroku správně, každá chybná dlaždice a známá chyba vrací svůj kód, diktát vrací `diktat-pravopis-<kód>` u všech 5 hlídaných slov a `diktat-vynechane-slovo`). `node --test` cestina, tisk-cj, samo, seed-cj, plan-roku: 64/64.

## Korektura ÚJČ (korektor, 14. 10. 2026)

Každý hodnocený tvar ověřen znovu přes `nastroje/ujc.sh` (vše z cache, server se nezatěžoval): tabulky *já* (id=já_1: 2./4. p. *mě, mne*, 3. p. *mi, mně*, 6. p. *mně*), *on* (id=on: po předložce *něho, něj, němu*), *ona* (id=ona: 3., 7. p. *jí*, 4. p. *ji*), *jenž* (id=jenž: m. živ. i neživ.), *jež* (id=jež: ž., s.), *dva, oba, tři, čtyři* (id=670, id=671 a tabulky), *Ema, Klára*; druhy v SSČ (*který, jaký, kdo* táz.; *nikdo, žádný* záp.; *někdo* neurč.; *ten* ukaz.; *náš, jeho* přivl.; *-krát* „čísl. nás. přísl.“; *první, čtvrtý, osmý* řad.; *troje* „souborový, příp. druhový“ = školní druhová jako v učebních L15, L16); vazby *tleskat komu, požádat, naučit, doprovodit koho, kvůli* + 3. p. Jazykové chyby v hodnocených tvarech: 0. Dublety v nabídkách: 0 (*mne, mi, něj* nikde v nabídce).

Opravy:
- **Převzaté z učební lekce** (ZADANI §9): L13n U5 „Nikdo se nehlásí.“ (doslova věta z L13 U2) → „Nikdo se nepřiznal.“; L15n U5 „Na výlet jsme jeli se _ …“ (začátek nahrávky L15 U3) → „Na hrad jsme vyrazili se _ učitelkami.“; L16n U4 „Klára půjčila sešit“ (diktát L16) → „Klára nakreslila obrázek“; L16n diktát věta 1 „Klára mně ukázala novou hru.“ (začátek jako diktát L16 „Klára mně půjčila sešit.“, a *ukázal mně* je i v doplňovačce téže úlohy) → „Adam mně poslal novou hru.“ (Z5: *poslal, novou, hru* bez *i/y*); L16n U5 final „…, byl skvělý.“ (jako „Film, _ …, byl skvělý.“ v L16) → „…, se všem moc líbil.“, „se _ kamarády“ (L16 U3) → „se _ kluky ze třídy“.
- **„Dnes samo“:** L13n U4 otázka „Celá úloha“ („kdy se píše jenž a kdy jež“) ukazovala na jediné zájmeno věty = chybné slovo → „Co máš u Petra najít? Řekni to vlastními slovy.“; L15n U3 otázka „Celá úloha“ zužovala krok 1 na tvary čísel → obecná (mluvíme × píšeme).
- **Typická chyba:** L15n U3 otázka „Řekni s oběma a se čtyřmi“ prozrazovala krok 2 → bez tvaru *čtyřmi*; L16n U1 „Řekni oběma kamarádům a pak s čtyři“ vedla analogií k *čtyřma* → řada *dvěma, třem …*.
- Drobnosti: L13n U5 cíl a vysvětlení „ve čtyřech větách“ → „v pěti větách“; L16n U3 *taky* → *také*.

Rozhodnutí vedoucího ke starým nejistotám uplatněna: L13n U3 B (*který* odkazuje zpět na *film*) ponecháno; *čí* mimo hodnocení; *jeho* jako přivlastňovací (L15n U1, L16n U3 i za předložkou *s*, L16n U5) jen tam, kde vlastník není podmět věty (*svůj* nepřichází v úvahu); L14n U4 krok 2 (mi · mně · mě · mnou) jednoznačné, správně jen *mě* (*mne* v nabídce není); diktát *dvěma* s `cislovka-hovorovy-tvar`; nový kód `zajmeno-neho-bez-predlozky` se nezavádí (obecná chyba); L15n poslech hodnotí rozpoznání *čtyřma, dvouma* (krok 1 = slovo, které se píše jinak; kroky 2 a 3 = spisovný tvar, *-ma* má kód `cislovka-hovorovy-tvar`).

