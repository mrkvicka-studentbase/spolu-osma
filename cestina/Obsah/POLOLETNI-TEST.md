# Pololetní test z češtiny `cj-t0-pol` — rozpis

Verze 1.1, 14. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8; jazyková korektura 14. 10. 2026 (§8). Zadání: `ZADANI-OSMA.md` §9 bod 6 (pololetní test v lednu, formát jako úvodní test, přeskládá zbytek roku).
**Soubor:** `obsah/cestina/lekce/cj-t0-pol.json`. **Vzor:** úvodní test `cj-t0-diag` a jeho rozpis v `OSNOVA.md` §15.

## 1. Formát (stejný jako úvodní test)
- `typ: "diagnostika"`, `faze: "osma"`, `tyden: 0`, `poradi: 2` (úvodní test má 1), `kapitola: "diagnostika"`, `tema: "Pololetní test"` (pole `tema` lekce slouží jako název; samostatné pole `nazev` schéma nezná), `cas_min: 25`.
- **23 položek**, každá = jedna úloha s jediným krokem `final`, bez taháku a semaforu. Každá úloha má `kapitola`, `tema` (1–10), `cil`, `cas_min: 1`, `zdroj: "vlastni"`, `tisk.zadani`.
- Rozložení po tématech přesně jako úvodní test: T1 2 · T2 2 · T3 2 · T4 2 · T5 3 · T6 2 · T7 2 · T8 2 · T9 3 · T10 3.
- Položka P*n* je dvojče položky D*n* úvodního testu: stejný typ vstupu, stejný počet mezer / slov / možností, stejný měřený jev a stejné kódy chyb (u P5, P18, P19 sousední kód téhož jevu, viz §3). Každé téma tak měří stejně jako v září a `doporuceni.js` (`vysledekPoTematech`, `doporucenePoradiTemat`) i `prehled.js` (`vysledekPol`) s ním pracují beze změny.
- Položka s více mezerami nebo kliky je správně jen celá (ZADANI-OSMA §8 bod 10). Vyhodnocení a pořadí témat podle `OSNOVA.md` §15.1 a `web/js/doporuceni.js`.
- `uvod_pro_rodice`: test ukáže, co dítěti po půl roce jde a co ještě ne, a podle výsledku aplikace přeskládá zbytek roku.

## 2. Položky
Zdroj ÚJČ: „heslo X“ = `https://prirucka.ujc.cas.cz/?slovo=X`, „id=N“ = `https://prirucka.ujc.cas.cz/?id=N`. Ověřeno 14. 10. 2026 přes `nastroje/ujc.sh`.

| # | T | vstup | co měří | zadání a data | správně | známé chyby (kód) | zdroj ÚJČ |
|---|---|---|---|---|---|---|---|
| P1 | 1 | `klik_ve_textu` slova, `min 1`, `max 10` | ohebné × neohebné; past příslovce, které se stupňuje | „Klikni na všechna neohebná slova, tedy ta, která nemění tvar.“ Adam(0) občas(1) ochotně(2) pomáhal(3) na(4) zahradě(5) protože(6) ho(7) to(8) bavilo(9) | `[1, 2, 4, 6]` | `chybi: [2]` → `ohebnost-stupnovani` · *ho, to* navíc → obecná | hesla *občas* (přísl.), *ochotně* (přísl., 2. st. *ochotněji*), *protože* (sp. podř.), *na* |
| P2 | 1 | `oznac_role`, `slova: [2, 8]`, role předložka · příslovce · spojka · podstatné jméno | druh podle věty | „Klára bydlí blízko a do školy chodí pěšky. Blízko školy je velký park.“ (pořadí obrácené proti D2: nejdřív příslovce) | `{"2":"příslovce","8":"předložka"}` | `{"8":"příslovce"}` → `predlozka-za-prislovce` · `{"2":"předložka"}` → `prislovce-za-predlozku` | heslo *blízko* (SSČ: přísl.; předl. s 2. p. *bydlet blízko lesa*) |
| P3 | 2 | `dlazdice` | vzor mužského životného jména na *-a* | „Ke kterému vzoru patří slovo *basketbalista*?“ předseda · pán · žena | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` | heslo *basketbalista* (m. živ., 2. p. *basketbalisty*), *předseda* |
| P4 | 2 | `doplnit_pismeno` 3× `["i","y"]` | *i/y* v koncovce podle vzoru (1. p. mn. pán, 2. p. j. žena, 4. p. mn. žena), vždy po obojetné souhlásce | „Los_ se brodili potokem a kocour u bříz_ číhal na pěnkav_.“ | `["i","y","y"]` | `["y",null,null]` → `koncovka-podst-y-za-i` · `[null,"i",null]`, `[null,null,"i"]` → `koncovka-podst-i-za-y` | id=los_1 (*los* m. živ., přežvýkavec), hesla *bříza* (2. j. *břízy*), *pěnkava* (4. mn. *pěnkavy*) |
| P5 | 3 | `doplnit_pismeno` `["ý","í"]`, `["i","y"]` | *-ý/-í* tvrdého a *-ovi/-ovy* přivlastňovacího přídavného jména | „Zmokl_ rybáři se ohřívali u ohně, ale farmářov_ psi zůstali venku.“ | `["í","i"]` | `["ý",null]` → `koncovka-prid-y-za-i` · `[null,"y"]` → `privlastnovaci-y-za-i` | hesla *zmoklý* (příd.), *farmář* (m. živ.); id=400 (*Karafiátovi Broučci*) |
| P6 | 3 | `dlazdice` | stupňování se změnou kmene | „Vyber 2. stupeň přídavného jména *měkký*.“ měkčí · měkkejší · nejměkčí | měkčí | měkkejší → `stupnovani-nepravidelne-pravidelne` · nejměkčí → `stupnovani-zamena` | heslo *měkký* (2. st. *měkčí*, 3. st. *nejměkčí*), id=410 |
| P7 | 4 | `doplnit_pismeno` 2× `["ě","ně"]` | *mně* (6. p.) × *mě* (4. p.) | „Babička o m_ mluví ráda a často m_ chválí.“ | `["ně","ě"]` | `["ě",null]`, `[null,"ně"]` → `me-mne-zamena` | id=650 (6. p. *o mně*, 4. p. *mě (mne)*; *mne* v nabídce není) |
| P8 | 4 | `dlazdice` | spisovný 3. p. číslovky *oba* | „Tomáš poslal pohlednici ___ tetám.“ oběma · obouma · obou | oběma | obouma → `cislovka-hovorovy-tvar` · obou → `cislovka-pad-zamena` | heslo *oba* (3. p. *oběma*), id=670 (*dát oběma dětem*; „nikoli *obouma*“) |
| P9 | 5 | `oznac_role`, `slova: [2, 6, 11]`, `role: ["dokonavý","nedokonavý"]` | vid; past: nedokonavá slovesa s předponou | „Ema pomalu přicházela k domu, pak zaklepala na dveře a chvíli naslouchala.“ Ema(0) pomalu(1) přicházela(2) k(3) domu(4) pak(5) zaklepala(6) na(7) dveře(8) a(9) chvíli(10) naslouchala(11) | `{"2":"nedokonavý","6":"dokonavý","11":"nedokonavý"}` | každé slovo opačně → `vid-zamena` | hesla *přicházet* (ned.), *zaklepat* (dok.), *naslouchat* (ned.) |
| P10 | 5 | `dlazdice` | rod trpný × *být* bez příčestí × *by* | „Ve které větě je sloveso v rodě trpném?“ Stromek byl ozdoben už v sobotu. · Lucka ozdobila stromek skleněnými koulemi. · Ema byla celé odpoledne venku. · Táta by ozdobil i okno. | Stromek byl ozdoben … | „Lucka ozdobila …“, „Táta by ozdobil …“ → `rod-trpny-neuzna` · „Ema byla …“ → `rod-trpny-za-byt` | heslo *ozdobit* (příč. trp. *ozdoben*), id=600 |
| P11 | 5 | `dlazdice` | *bychom* | „Večer ___ si mohli zahrát deskovou hru.“ bychom · bysme · by jsme | bychom | bysme → `bysme-za-bychom` · by jsme → `by-jsme-za-bychom` | id=575 (*bychom, byste*) |
| P12 | 6 | `doplnit_pismeno` 3× `["i","y"]` | VS po S (*syčet*) a M (*myš*), nevyjmenované po V (*vítat*) | „Husa na dvoře s_čela, babička nás v_tala u vrat a pod schody se schovala m_š.“ | `["y","i","y"]` | `["i",null,null]` → `vs-s-i-za-y` · `[null,"y",null]` → `vs-v-y-za-i` · `[null,null,"i"]` → `vs-m-i-za-y` | id=100 (S: *syčet*; M: *myš*), hesla *syčet*, *vítat*, *myš* |
| P13 | 6 | `doplnit_pismeno` 2× `["i","y"]` | dvojice podle významu *pobýt × pobít*, *přibít × přibýt* | „Děda u nás pob_l celý týden a v kuchyni nám přib_l poličku.“ | `["y","i"]` | `["i",null]` → `vs-b-i-za-y` · `[null,"y"]` → `vs-dvojice-vyznam` | id=100 (B: *být* a odvozená), hesla *pobýt* („jiné je: pobít“), *přibít* („jiné je: přibýt“) |
| P14 | 7 | `doplnit_pismeno` 3× `["i","y","a"]` | shoda s jedním podmětem (m. neživ. **za** přísudkem, m. živ., s. mn.) | „Na zastávce visel_ nové jízdní řády, žáci si je prohlížel_ a kola se opíral_ o plot.“ | `["y","i","a"]` | `["i",null,null]` → `shoda-i-za-y` · `[null,"y",null]` → `shoda-y-za-i` · `[null,null,"y"]` → `shoda-y-za-a` | id=600, heslo *viset* (nepřechodné: *řády* může být jen podmět) |
| P15 | 7 | `doplnit_pismeno` 2× `["i","y","a"]` | několikanásobný podmět před přísudkem (s m. živ. → *i*; ž. + m. neživ. → *y*) | „Ema a Adam se vrátil_ z tábora, ale tašky a batohy se válel_ v autě až do večera.“ | `["i","y"]` | `["y",null]` → `shoda-nekolikanasobny-y` · `[null,"i"]` → `shoda-i-za-y` | id=601 (podmět předchází; bez m. živ. → *-y*: *Létající talíře a další atrakce kroužily*) |
| P16 | 8 | `oznac_role`, `slova: [1, 3, 4, 5, 6]`, role podmět · přísudek · předmět · příslovečné určení · přívlastek | základní a rozvíjející větné členy; PU času s předložkou | „Odvážný horolezec v únoru zdolal strmou stěnu.“ Odvážný(0) horolezec(1) v(2) únoru(3) zdolal(4) strmou(5) stěnu(6) | `{"1":"podmět","3":"příslovečné určení","4":"přísudek","5":"přívlastek","6":"předmět"}` | `{"6":"podmět"}` → `podmet-za-predmet` · `{"3":"předmět"}` → `pu-za-predmet` · `{"6":"příslovečné určení"}` → `predmet-za-pu` · `{"3":"přívlastek"}` → `pu-za-privlastek` | příručka větné členy nevykládá; termíny podle TERMINOLOGIE a školské praxe (jako D16) |
| P17 | 8 | `dlazdice` | přívlastek neshodný × PU místa | „Jaký větný člen je *u kašny* v této větě? Stánek u kašny je zavřený.“ přívlastek neshodný · přívlastek shodný · příslovečné určení místa | přívlastek neshodný | shodný → `privlastek-shoda-zamena` · PU místa → `privlastek-neshodny-za-pu` | jako P16 (který stánek? ten u kašny) |
| P18 | 9 | `klik_ve_textu` `cil: "mezery"`, `max 6` | čárka před *protože*, před *kterého* a za vloženou větou | „Ema nemohla usnout protože pes kterého hlídala pro sousedy pořád štěkal.“ | `[2, 4, 8]` (za *usnout*, *pes*, *sousedy*) | `chybi: [8]` → `carka-vlozena-chybi-druha` · `chybi: [2]` → `carka-chybi-pred-spojkou` · `chybi: [4]` → `carka-chybi-ktery` | id=150 |
| P19 | 9 | `dlazdice` | počet vět podle přísudků; past složený přísudek s infinitivem | „Kolik vět má toto souvětí? Když se setmělo, Tomáš chtěl jet domů, ale autobus už odjel.“ 2 věty · 3 věty · 4 věty | 3 věty (*setmělo · chtěl jet · odjel*) | 2 → `souveti-pocet-podle-spojek` (dvě spojky *když, ale*) · 4 → `souveti-infinitiv-jako-veta` | id=150; žádný několikanásobný přísudek (id=151) |
| P20 | 9 | `klik_ve_textu` `cil: "mezery"`, `max 6` | čárka ve výčtu a před *ale*, ne před *a* | „Klára má ráda matematiku zeměpis a dějepis ale ne tělocvik.“ | `[3, 6]` (za *matematiku*, *dějepis*) | `navic: [4]` → `carka-navic-a` · `chybi: [3]` → `carka-vycet-chybi` · `chybi: [6]` → `carka-chybi-pred-ale` | id=151 (výčet, odporovací *ale*), id=153 (*a* bez čárky) |
| P21 | 10 | `doplnit_pismeno` `["ě","je"]`, `["ě","je"]`, `["ě","ně"]` | *bje, vje* na švu, *mně* podle příbuzného slova | „Lucka na kole ob_la rybník, v_la do dvora a tajem_ se usmála.“ (mezera tak, aby *je* dalo *objela, vjela*, ne *-jee-*) | `["je","je","ně"]` | `["ě",null,null]`, `[null,"ě",null]` → `skupina-e-za-je` · `[null,null,"ě"]` → `skupina-me-za-mne` | id=126 (*objetí od objet*; *vjet*), hesla *objet* (*objel*), *vjet* (*vjel*), *tajemně* (← *tajemný*) |
| P22 | 10 | `doplnit_pismeno` 3× `["s","z"]` | předpona *s-* (dohromady) × *z-* (stát se tím, co znamená základ), předložka *s* + 7. p. | „Ema _pojila dva provázky uzlem, rty jí zimou _modraly a pak šla _ kamarádkou domů.“ | `["s","z","s"]` | `["z",null,null]`, `[null,"s",null]` → `s-z-predpona-zamena` · `[null,null,"z"]` → `s-z-predlozka-zamena` | id=110 (*s-* „směřování dohromady: … spojit“; *z-* od přídavných jmen „stát se tím, co znamená slovo základové“), id=111, heslo *zmodrat* |
| P23 | 10 | `doplnit_pismeno` `["n","nn"]`, `["d","dd"]` | zdvojené souhlásky na švu | „Útočník si nasadil ochra_ou helmu a o_aní fanoušci mu tleskali.“ | `["nn","dd"]` | `["n",null]`, `[null,"d"]` → `zdvojene-chybi` | id=125 (*ochrana – ochranný*), heslo *oddaný* (dělení *od-da-ný*) |

Tisk: stejné pokyny jako úvodní test (Podtrhni … / Nad tučná slova napiš … / Doplň … / Zakroužkuj: a) …), věty s `_` a čárkové věty na samostatném odstavci bez hledaných čárek.

## 3. Obtížnost proti úvodnímu testu (stejná nebo o kousek vyšší)
- **P1** dvě neohebná příslovce za sebou, jedno se stupňuje (*ochotně*), past dvě ohebná zájmena (*ho, to*).
- **P2** pořadí obrácené (příslovce dřív než předložka), slovo *blízko* se ve škole probírá méně než *kolem*.
- **P4** místo 7. p. *s míči* (po *č* vždy *i*) je 4. p. mn. *na pěnkavy*; všechny tři mezery stojí po obojetné souhlásce (*l, z, v*), takže dítě musí dosadit vzor a pád, nestačí tvrdá/měkká souhláska (Z5).
- **P5** přivlastňovací tvar v 1. p. mn. m. živ. (*farmářovi psi*), který vypadá jako 3. p. podstatného jména; kód `privlastnovaci-y-za-i` (D5 měl opačný směr).
- **P6** změna kmene *-k- → -č-* (*měkký – měkčí*) místo dobře známého *dobrý – lepší*.
- **P7** 6. p. *o mně* místo 3. p. a 4. p. až na druhém místě.
- **P8** 3. p. *oběma* (s *-ma* i bez předložky) místo 7. p. *se dvěma*.
- **P9** dvě nedokonavá slovesa s předponou (*přicházela, naslouchala*) a jedno dokonavé (D9 opačně).
- **P13** dvojice v odvozených slovech (*pobyl × pobil*, *přibil × přibyl*) místo holého *mýt × mít*.
- **P14** podmět stojí za přísudkem a je rodu mužského neživotného (*visely jízdní řády*).
- **P15** druhý podmět kombinuje ženský a mužský neživotný rod (*tašky a batohy*).
- **P16** příslovečné určení s předložkou (*v únoru*) místo *včera*.
- **P18** spojka *protože* místo *že* (kód `carka-chybi-pred-spojkou`, `TYPY-CHYB.md`), vztažné zájmeno ve 2./4. p. (*kterého*).
- **P19** past infinitivu ve složeném přísudku (*chtěl jet*) → kód `souveti-infinitiv-jako-veta` u „4 věty“.
- **P21** *tajemně* (příbuzné *tajemný*) místo *zapomněl*.
- **P22** *s-* ve významu „dohromady“ (*spojila*) a předložka *s* se 7. p. (D22 měl „shora dolů“ a *z* + 2. p.).
- **P23** *dd* na švu předpony a kořene (*od-daní*) a *nn* u přídavného jména od podstatného na *-n* (*ochrana – ochranný*).
- Mimo osnovu nic: všechny jevy jsou v `OSNOVA.md` §5–§14 (T1 L1–L3, T2 L5–L7, T3 L9–L11, T4 L14–L15, T5 L17–L19, T6 L21–L23, T7 L25–L26, T8 L29–L31, T9 L33–L35, T10 L37–L39).

## 4. Novost položek (kontrola 14. 10. 2026, po korektuře)
Skript `/tmp/pol-cj8/novost.mjs` (inventář přegenerovaný 14. 10. ze všech 84 souborů `cj-t*-l*.json` a `cj-t0-diag`) porovnal věty a hodnocená slova; korektor navíc hledal **stejný kořen** (nejen tvar) ve všech lekcích (`grep`), protože tvarová kontrola nepoznala např. *turista × turistu*, *orli × orly*, *sousedovi × sousedovy*.
- **Žádná věta** se neshoduje ani není přepsaná z lekce (P8 a P11 přepsány, byly skoro shodné s `cj-t4-l15n` a `cj-t5-l17n`).
- **Hodnocená plnovýznamová slova jsou nová** i podle kořene: *občas, ochotně, blízko, basketbalista, losi, břízy, pěnkavy, zmoklí, farmářovi, měkčí, přicházela, zaklepala, naslouchala, ozdoben, syčela, vítala, myš, pobyl, přibil, visely, prohlíželi, opírala, vrátili, válely, horolezec, únoru, zdolal, strmou, stěnu, u kašny, usnout, sousedy, matematiku, zeměpis, dějepis, objela, vjela, tajemně, spojila, zmodraly, ochrannou, oddaní*.
- Opakují se jen **uzavřené tvary**, které jinak napsat nejde: *na, protože, ale, s* (předložky a spojky), *bychom / bysme / by jsme*, *mě / mně*, *oběma / obou*, názvy vzorů a větných členů v nabídce, počty vět.
- **Vědomě ponecháno (malá uzavřená množina):** *bje* na švu mají jen *objet, objem, objevit, objednat* — všechna čtyři už jsou v `cj-t10-l39`/`l40` nebo v úvodním testu; ponecháno *objela* (v L39 jen jako rozklad *ob|jet* v rozcvičce). *vjela* je jiné slovo než *vjezd* (D21, L39, L40). *vrátili* (P15) je hodnocené v `cj-t5-l20n` jen jako sloveso (jiný jev).

## 5. Dublety a sporné jevy (OSNOVA §16) — nic v hodnoceném místě
- *losi / losové* (P4): v mezeře jde volit jen *i/y*, tvar *-ové* napsat nejde; *los* m. neživ. (loterie) vylučuje přísudek *brodili se*.
- *objet / obejet* (P21): *obejela* v nabídce není (jen *ě / je*).
- *mě / mne*: *mne* v nabídce není (jako D7).
- P14, P15: žádný přísudek před několikanásobným podmětem, žádné *s* v podmětu, žádné *my/vy*, žádná *děti/lidé* (ti jsou v L27); jediný podmět za přísudkem (P14) je jednoduchý a sloveso *viset* je nepřechodné (původní *zastavil_ autobusy* šlo číst i „oni zastavili autobusy“ → *zastavili* by bylo správně).
- P18–P20: žádné *a* v neslučovacím poměru, žádný několikanásobný přísudek se společným podmětem, žádné oslovení.
- P22: *spojit* a *zmodrat* nemají podobu s druhou předponou (id=110 je mezi slovesy s oběma podobami ani mezi dvojicemi s jiným významem neuvádí); předložka *s* jen se 7. p.
- P10: v trpném rodě jen krátký tvar *ozdoben*; v rušivých větách žádné *byl* + přídavné jméno.
- P2: *blízko* — SSČ i SSJČ (heslo *blízko*): přísl. (*bydlet blízko*) a předl. s 2. p. (*bydlet blízko lesa*, SSJČ „v platnosti předl. s 2. p.“); ve větě je jednou samo, jednou s 2. p. (*blízko školy*).

## 6. Nahrávky
Test nemá poslech ani diktát — žádné řádky do `AUDIO.md`.

## 7. Kontrola
- `npm run seed:validace -- --lekce cj-t0-pol`: 0 chyb, 0 varování.
- Kontrola přes `web/js/vyhodnoceni.js` + `vyhodnoceni-cj.js` (skript `/tmp/pol-cj8/vyhodnot.mjs`): vzorová odpověď všech 23 položek správně, všech 56 známých chyb a chybných dlaždic vrací svůj kód (79 kontrol, 0 chyb). Indexy slov (P1, P2, P9, P16, P18, P20) přepočítány tokenizérem `tokenizuj`.
- `kontrola.jistota: "stredni"` — jazykově ověřeno vše (každý hodnocený tvar v ÚJČ; větné členy podle školské praxe), otevřená je jen novost proti lekcím vytvořeným po korektuře (§8).

## 8. Jazyková korektura (korektor, 14. 10. 2026)
Jazykové chyby (hodnocené místo s více správnými odpověďmi nebo bez měřeného jevu): **2** — P14 *Na zastávce zastavil_ autobusy* (čtení s nevyjádřeným podmětem *oni zastavili autobusy* dává správně i *-i*) → *visel_ nové jízdní řády*; P4 *na sýkor_* (po *r* vždy *y*, měří jen Z5, ne vzor; rozpis tvrdil opak) → *na pěnkav_*.
Novost (stejný kořen a jev hodnocený v lekcích): P3 *turista* (`cj-t2-l5n`, `l7n`), P4 *orli* (`cj-t2-l7` *orly*), P5 *sousedovi* (`cj-t3-l11n`, `l12n`), P6 *hezčí* (`cj-t3-l9`), P9 *zazvonit, čekat* (`cj-t8-l29`, `cj-t7`), P10 *natřít* (věty skoro z `cj-t5-l19`: „Táta natřel plot“, „Plot byl natřen“), P12 *sypat, viděli* (`cj-t6-l22`–`l24`), P13 *pili, pyl* (`cj-t6-l22`, řady), P16 *brankář, těžký* (`cj-t2-l8`, `cj-t3`), P17 *lavička* (`cj-t8-l31` „Lavička v parku“ jako přívlastek neshodný), P22 *sbírat, zčervenat* (`cj-t10-l38`, `l40`), P23 *stinný, rozzuřit* (`cj-t10-l37` tahák a semafor); P8, P11 skoro shodné věty s novými naostro lekcemi. Vše nahrazeno (§2), nové tvary ověřeny v ÚJČ.
Texty: `uvod_pro_rodice` zkrácen na 1 větu (SABLONA §4).
**Zbývá (novost, rozhodne vedoucí):** lekce jiných autorů vytvořené po korektuře (14. 10. 18:54–19:19) převzaly hodnocená slova testu se stejným jevem: *basketbalista* (`cj-t2-l5nb`), *syčela* a věta „husa syčela“ (`cj-t6-l22n`), *pobyl/přibil* (`cj-t6-l24n`), *visely* (`cj-t7-l26n`); *oběma babičkám* (`cj-t4-l15b`) → P8 změněno na *tetám*. Jiný jev: *blízko* (`cj-t6-l21n`), *přicházela* (`cj-t7-l27n`), *ozdob-*, *zmodraly* (`cj-t7-l28n`). Proto `kontrola.jistota: "stredni"`; jazykově je vše ověřené.
