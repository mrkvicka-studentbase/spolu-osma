# Pololetní test z češtiny `cj-t0-pol` — rozpis

Verze 1.3, 15. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8; jazyková korektura 14. 10. 2026 (§8); závěrečná kontrola novosti proti hotovým lekcím 15. 10. 2026 (§4, §7). Zadání: `ZADANI-OSMA.md` §9 bod 6 (pololetní test v lednu, formát jako úvodní test, přeskládá zbytek roku).
**Soubor:** `obsah/cestina/lekce/cj-t0-pol.json`. **Vzor:** úvodní test `cj-t0-diag` a jeho rozpis v `OSNOVA.md` §15.

## 1. Formát (stejný jako úvodní test)
- `typ: "diagnostika"`, `faze: "osma"`, `tyden: 0`, `poradi: 2` (úvodní test má 1), `kapitola: "diagnostika"`, `tema: "Pololetní test"` (pole `tema` lekce slouží jako název; samostatné pole `nazev` schéma nezná), `cas_min: 25`.
- **23 položek**, každá = jedna úloha s jediným krokem `final`, bez taháku a semaforu. Každá úloha má `kapitola`, `tema` (1–10), `cil`, `cas_min: 1`, `zdroj: "vlastni"`, `tisk.zadani`.
- Rozložení po tématech přesně jako úvodní test: T1 2 · T2 2 · T3 2 · T4 2 · T5 3 · T6 2 · T7 2 · T8 2 · T9 3 · T10 3.
- Položka P*n* je dvojče položky D*n* úvodního testu: stejný typ vstupu, stejný počet mezer / slov / možností, stejný měřený jev a stejné kódy chyb (u P5, P18, P19 a v 1. mezeře P12 sousední kód téhož jevu, viz §3). Každé téma tak měří stejně jako v září a `doporuceni.js` (`vysledekPoTematech`, `doporucenePoradiTemat`) i `prehled.js` (`vysledekPol`) s ním pracují beze změny.
- Položka s více mezerami nebo kliky je správně jen celá (ZADANI-OSMA §8 bod 10). Vyhodnocení a pořadí témat podle `OSNOVA.md` §15.1 a `web/js/doporuceni.js`.
- `uvod_pro_rodice`: test ukáže, co dítěti po půl roce jde a co ještě ne, a podle výsledku aplikace přeskládá zbytek roku.

## 2. Položky
Zdroj ÚJČ: „heslo X“ = `https://prirucka.ujc.cas.cz/?slovo=X`, „id=N“ = `https://prirucka.ujc.cas.cz/?id=N`. Ověřeno 14. 10. 2026 (P3, P5, P6, P9, P10, P12–P15, P22, P23 po výměně 15. 10. 2026) přes `nastroje/ujc.sh`.

| # | T | vstup | co měří | zadání a data | správně | známé chyby (kód) | zdroj ÚJČ |
|---|---|---|---|---|---|---|---|
| P1 | 1 | `klik_ve_textu` slova, `min 1`, `max 10` | ohebné × neohebné; past příslovce, které se stupňuje | „Klikni na všechna neohebná slova, tedy ta, která nemění tvar.“ Adam(0) občas(1) ochotně(2) pomáhal(3) na(4) zahradě(5) protože(6) ho(7) to(8) bavilo(9) | `[1, 2, 4, 6]` | `chybi: [2]` → `ohebnost-stupnovani` · *ho, to* navíc → obecná | hesla *občas* (přísl.), *ochotně* (přísl., 2. st. *ochotněji*), *protože* (sp. podř.), *na* |
| P2 | 1 | `oznac_role`, `slova: [2, 8]`, role předložka · příslovce · spojka · podstatné jméno | druh podle věty | „Klára bydlí blízko a do školy chodí pěšky. Blízko školy je velký park.“ (pořadí obrácené proti D2: nejdřív příslovce) | `{"2":"příslovce","8":"předložka"}` | `{"8":"příslovce"}` → `predlozka-za-prislovce` · `{"2":"předložka"}` → `prislovce-za-predlozku` | heslo *blízko* (SSČ: přísl.; předl. s 2. p. *bydlet blízko lesa*) |
| P3 | 2 | `dlazdice` | vzor mužského životného jména na *-a* | „Ke kterému vzoru patří slovo *klavírista*?“ předseda · pán · žena | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` | heslo *klavírista* (m. živ.), *předseda* |
| P4 | 2 | `doplnit_pismeno` 3× `["i","y"]` | *i/y* v koncovce podle vzoru (1. p. mn. pán, 2. p. j. žena, 4. p. mn. žena), vždy po obojetné souhlásce | „Los_ se brodili potokem a kocour u bříz_ číhal na pěnkav_.“ | `["i","y","y"]` | `["y",null,null]` → `koncovka-podst-y-za-i` · `[null,"i",null]`, `[null,null,"i"]` → `koncovka-podst-i-za-y` | id=los_1 (*los* m. živ., přežvýkavec), hesla *bříza* (2. j. *břízy*), *pěnkava* (4. mn. *pěnkavy*) |
| P5 | 3 | `doplnit_pismeno` `["ý","í"]`, `["i","y"]` | *-ý/-í* tvrdého a *-ovi/-ovy* přivlastňovacího přídavného jména | „Vyčerpan_ rybáři se ohřívali u ohně, ale farmářov_ psi zůstali venku.“ | `["í","i"]` | `["ý",null]` → `koncovka-prid-y-za-i` · `[null,"y"]` → `privlastnovaci-y-za-i` | hesla *vyčerpaný* (příd.), *farmář* (m. živ.); id=400 (*Karafiátovi Broučci*) |
| P6 | 3 | `dlazdice` | stupňování se změnou kmene | „Vyber 2. stupeň přídavného jména *křehký*.“ křehčí · křehkejší · nejkřehčí | křehčí | křehkejší → `stupnovani-nepravidelne-pravidelne` · nejkřehčí → `stupnovani-zamena` | heslo *křehký* (2. st. *křehčí*, řidší *křehčejší* v nabídce není; 3. st. *nejkřehčí*), id=410 |
| P7 | 4 | `doplnit_pismeno` 2× `["ě","ně"]` | *mně* (6. p.) × *mě* (4. p.) | „Babička o m_ mluví ráda a často m_ chválí.“ | `["ně","ě"]` | `["ě",null]`, `[null,"ně"]` → `me-mne-zamena` | id=650 (6. p. *o mně*, 4. p. *mě (mne)*; *mne* v nabídce není) |
| P8 | 4 | `dlazdice` | spisovný 3. p. číslovky *oba* | „Tomáš poslal pohlednici ___ tetám.“ oběma · obouma · obou | oběma | obouma → `cislovka-hovorovy-tvar` · obou → `cislovka-pad-zamena` | heslo *oba* (3. p. *oběma*), id=670 (*dát oběma dětem*; „nikoli *obouma*“) |
| P9 | 5 | `oznac_role`, `slova: [2, 5, 10]`, `role: ["dokonavý","nedokonavý"]` | vid; past: nedokonavá slovesa s předponou | „Ema pomalu obcházela rybník, pak usedla na lavičku a chvíli obdivovala labutě.“ Ema(0) pomalu(1) obcházela(2) rybník(3) pak(4) usedla(5) na(6) lavičku(7) a(8) chvíli(9) obdivovala(10) labutě(11) | `{"2":"nedokonavý","5":"dokonavý","10":"nedokonavý"}` | každé slovo opačně → `vid-zamena` | hesla *obcházet* (ned.), *usednout* (dok.), *obdivovat* (ned.) |
| P10 | 5 | `dlazdice` | rod trpný × *být* bez příčestí × *by* | „Ve které větě je sloveso v rodě trpném?“ Košile byla vyžehlena už ráno. · Máma vyžehlila košili na koncert. · Tomáš byl v neděli s dědou na rybách. · Táta by vyžehlil i ubrus. | Košile byla vyžehlena … | „Máma vyžehlila …“, „Táta by vyžehlil …“ → `rod-trpny-neuzna` · „Tomáš byl …“ → `rod-trpny-za-byt` | heslo *vyžehlit* (příč. trp. *vyžehlen*), id=600 |
| P11 | 5 | `dlazdice` | *bychom* | „Večer ___ si mohli zahrát deskovou hru.“ bychom · bysme · by jsme | bychom | bysme → `bysme-za-bychom` · by jsme → `by-jsme-za-bychom` | id=575 (*bychom, byste*) |
| P12 | 6 | `doplnit_pismeno` `["i","y"]`, `["i","y"]`, `["í","ý"]` | nevyjmenované po S (*sirup*) a V (*viklat*), vyjmenované po M (*nachomýtnout se*) | „Bráška si nalil s_rup, pak se mu začal v_klat zub a máma se k tomu zrovna nachom_tla.“ | `["i","i","ý"]` | `["y",null,null]` → `vs-s-y-za-i` · `[null,"y",null]` → `vs-v-y-za-i` · `[null,null,"í"]` → `vs-m-i-za-y` | id=100 (M: *nachomýtnout se*; S, V: *sirup, viklat* v řadách nejsou), hesla *sirup*, *viklat*, *nachomýtnout* |
| P13 | 6 | `doplnit_pismeno` `["í","ý"]`, `["i","y"]` | odvozené slovo od *být* (*zabývat se*) a dvojice podle významu *pobít × pobýt* | „Děda se celé léto zab_val zahradou, ale v srpnu mu kroupy pob_ly úrodu.“ | `["ý","i"]` | `["í",null]` → `vs-b-i-za-y` · `[null,"y"]` → `vs-dvojice-vyznam` | id=100 (B: *zabývat se*), hesla *zabývat*, *pobít* (*kroupy pobily obilí*; „jiné je: pobýt“) |
| P14 | 7 | `doplnit_pismeno` 3× `["i","y","a"]` | shoda s jedním podmětem (m. neživ. **za** přísudkem, m. živ., s. mn.) | „Na křižovatce blikal_ nové semafory, žáci si je prohlížel_ a kola se opíral_ o plot.“ | `["y","i","a"]` | `["i",null,null]` → `shoda-i-za-y` · `[null,"y",null]` → `shoda-y-za-i` · `[null,null,"y"]` → `shoda-y-za-a` | id=600, hesla *blikat* (nepřechodné: *semafory* může být jen podmět), *semafor* (m. neživ.) |
| P15 | 7 | `doplnit_pismeno` 2× `["i","y","a"]` | několikanásobný podmět před přísudkem (s m. živ. → *i*; ž. + m. neživ. → *y*) | „Ema a Adam přicestoval_ z tábora, ale tašky a batohy se povaloval_ v autě až do večera.“ | `["i","y"]` | `["y",null]` → `shoda-nekolikanasobny-y` · `[null,"i"]` → `shoda-i-za-y` | id=601 (podmět předchází; bez m. živ. → *-y*: *Létající talíře a další atrakce kroužily*), hesla *přicestovat*, *povalovat se* |
| P16 | 8 | `oznac_role`, `slova: [1, 3, 4, 5, 6]`, role podmět · přísudek · předmět · příslovečné určení · přívlastek | základní a rozvíjející větné členy; PU času s předložkou | „Odvážný horolezec v únoru zdolal strmou stěnu.“ Odvážný(0) horolezec(1) v(2) únoru(3) zdolal(4) strmou(5) stěnu(6) | `{"1":"podmět","3":"příslovečné určení","4":"přísudek","5":"přívlastek","6":"předmět"}` | `{"6":"podmět"}` → `podmet-za-predmet` · `{"3":"předmět"}` → `pu-za-predmet` · `{"6":"příslovečné určení"}` → `predmet-za-pu` · `{"3":"přívlastek"}` → `pu-za-privlastek` | příručka větné členy nevykládá; termíny podle TERMINOLOGIE a školské praxe (jako D16) |
| P17 | 8 | `dlazdice` | přívlastek neshodný × PU místa | „Jaký větný člen je *u kašny* v této větě? Stánek u kašny je zavřený.“ přívlastek neshodný · přívlastek shodný · příslovečné určení místa | přívlastek neshodný | shodný → `privlastek-shoda-zamena` · PU místa → `privlastek-neshodny-za-pu` | jako P16 (který stánek? ten u kašny) |
| P18 | 9 | `klik_ve_textu` `cil: "mezery"`, `max 6` | čárka před *protože*, před *kterého* a za vloženou větou | „Ema nemohla usnout protože pes kterého hlídala pro sousedy pořád štěkal.“ | `[2, 4, 8]` (za *usnout*, *pes*, *sousedy*) | `chybi: [8]` → `carka-vlozena-chybi-druha` · `chybi: [2]` → `carka-chybi-pred-spojkou` · `chybi: [4]` → `carka-chybi-ktery` | id=150 |
| P19 | 9 | `dlazdice` | počet vět podle přísudků; past složený přísudek s infinitivem | „Kolik vět má toto souvětí? Když se setmělo, Tomáš chtěl jet domů, ale autobus už odjel.“ 2 věty · 3 věty · 4 věty | 3 věty (*setmělo · chtěl jet · odjel*) | 2 → `souveti-pocet-podle-spojek` (dvě spojky *když, ale*) · 4 → `souveti-infinitiv-jako-veta` | id=150; žádný několikanásobný přísudek (id=151) |
| P20 | 9 | `klik_ve_textu` `cil: "mezery"`, `max 6` | čárka ve výčtu a před *ale*, ne před *a* | „Klára má ráda matematiku zeměpis a dějepis ale ne tělocvik.“ | `[3, 6]` (za *matematiku*, *dějepis*) | `navic: [4]` → `carka-navic-a` · `chybi: [3]` → `carka-vycet-chybi` · `chybi: [6]` → `carka-chybi-pred-ale` | id=151 (výčet, odporovací *ale*), id=153 (*a* bez čárky) |
| P21 | 10 | `doplnit_pismeno` `["ě","je"]`, `["ě","je"]`, `["ě","ně"]` | *bje, vje* na švu, *mně* podle příbuzného slova | „Lucka na kole ob_la rybník, v_la do dvora a tajem_ se usmála.“ (mezera tak, aby *je* dalo *objela, vjela*, ne *-jee-*) | `["je","je","ně"]` | `["ě",null,null]`, `[null,"ě",null]` → `skupina-e-za-je` · `[null,null,"ě"]` → `skupina-me-za-mne` | id=126 (*objetí od objet*; *vjet*), hesla *objet* (*objel*), *vjet* (*vjel*), *tajemně* (← *tajemný*) |
| P22 | 10 | `doplnit_pismeno` 3× `["s","z"]` | předpona *s-* (dohromady) × *z-* (stát se tím, co znamená základ), předložka *s* + 7. p. | „Ema _pojila dva provázky uzlem, rty jí zimou _fialověly a pak šla _ kamarádkou domů.“ | `["s","z","s"]` | `["z",null,null]`, `[null,"s",null]` → `s-z-predpona-zamena` · `[null,null,"z"]` → `s-z-predlozka-zamena` | id=110 (*s-* „směřování dohromady: … spojit“; *z-* od přídavných jmen „stát se tím, co znamená slovo základové“), id=111, heslo *zfialovět* |
| P23 | 10 | `doplnit_pismeno` `["n","nn"]`, `["j","jj"]` | zdvojené souhlásky na švu (přípona *-ný*, předpona *nej-*) | „Lucka si namazala ochra_ý krém a vyrazila na ne_ižnější pláž ostrova.“ | `["nn","jj"]` | `["n",null]`, `[null,"j"]` → `zdvojene-chybi` | id=125 (*ochrana – ochranný*), heslo *jižní* (3. st. *nejjižnější*: *nej-* + *jižnější*) |

Tisk: stejné pokyny jako úvodní test (Podtrhni … / Nad tučná slova napiš … / Doplň … / Zakroužkuj: a) …), věty s `_` a čárkové věty na samostatném odstavci bez hledaných čárek.

## 3. Obtížnost proti úvodnímu testu (stejná nebo o kousek vyšší)
- **P1** dvě neohebná příslovce za sebou, jedno se stupňuje (*ochotně*), past dvě ohebná zájmena (*ho, to*).
- **P2** pořadí obrácené (příslovce dřív než předložka), slovo *blízko* se ve škole probírá méně než *kolem*.
- **P4** místo 7. p. *s míči* (po *č* vždy *i*) je 4. p. mn. *na pěnkavy*; všechny tři mezery stojí po obojetné souhlásce (*l, z, v*), takže dítě musí dosadit vzor a pád, nestačí tvrdá/měkká souhláska (Z5).
- **P5** přivlastňovací tvar v 1. p. mn. m. živ. (*farmářovi psi*), který vypadá jako 3. p. podstatného jména; kód `privlastnovaci-y-za-i` (D5 měl opačný směr).
- **P6** změna kmene *-k- → -č-* (*křehký – křehčí*) místo dobře známého *dobrý – lepší*.
- **P7** 6. p. *o mně* místo 3. p. a 4. p. až na druhém místě.
- **P8** 3. p. *oběma* (s *-ma* i bez předložky) místo 7. p. *se dvěma*.
- **P9** dvě nedokonavá slovesa s předponou (*obcházela, obdivovala*) a jedno dokonavé (D9 opačně).
- **P12** S a V nevyjmenované (*sirup, viklat*), po M méně častý člen řady (*nachomýtla*); 1. mezera má sousední kód téhož jevu `vs-s-y-za-i` (řada po S je v lekcích vyčerpaná, §4).
- **P13** odvozené slovo od *být* (*zabýval*, dlouhé *ý*) a dvojice v odvozeném slově (*pobily × pobyly*) místo holého *mýt × mít*.
- **P14** podmět stojí za přísudkem a je rodu mužského neživotného (*blikaly semafory*).
- **P15** druhý podmět kombinuje ženský a mužský neživotný rod (*tašky a batohy*).
- **P16** příslovečné určení s předložkou (*v únoru*) místo *včera*.
- **P18** spojka *protože* místo *že* (kód `carka-chybi-pred-spojkou`, `TYPY-CHYB.md`), vztažné zájmeno ve 2./4. p. (*kterého*).
- **P19** past infinitivu ve složeném přísudku (*chtěl jet*) → kód `souveti-infinitiv-jako-veta` u „4 věty“.
- **P21** *tajemně* (příbuzné *tajemný*) místo *zapomněl*.
- **P22** *s-* ve významu „dohromady“ (*spojila*) a předložka *s* se 7. p. (D22 měl „shora dolů“ a *z* + 2. p.).
- **P23** *jj* na švu předpony *nej-* a kořene (*nej-jižnější*) a *nn* u přídavného jména od podstatného na *-n* (*ochrana – ochranný*).
- Mimo osnovu nic: všechny jevy jsou v `OSNOVA.md` §5–§14 (T1 L1–L3, T2 L5–L7, T3 L9–L11, T4 L14–L15, T5 L17–L19, T6 L21–L23, T7 L25–L26, T8 L29–L31, T9 L33–L35, T10 L37–L39).

## 4. Novost položek (závěrečná kontrola 15. 10. 2026)
**Zásada:** hodnocená plnovýznamová slova testu jsou nová i podle kořene se stejným jevem — nejsou hodnocená (mezera, dlaždice, klik, role, diktát, správná odpověď) v žádné lekci ani v úvodním testu a nejsou příkladem v tahácích.

**Jak byla kontrola udělána (15. 10. 2026, korektor):** inventář přegenerován skriptem ze **všech 161 souborů** `obsah/cestina/lekce/` (40 učebních, 40 `n`, 40 `b`, 40 `nb`, `cj-t0-diag`) a z taháků `web/js/tahaky-cestina.js` a `web/js/tahaky-bonus.js`: každý řetězec lekce, doplňovačky vyplněné vzorovou odpovědí, hodnocená slova podle typu vstupu (slovo s mezerou, dlaždice, klik, role, diktát) a slova ze zadání dlaždicových úloh („Ke kterému vzoru patří …“). Pro každé hodnocené slovo testu se hledal tvar i **kořen** (regulární výraz, např. `syč|s_č`, `vít[aá]`, `pob[yý]|pob[ií]l`, `odda|oddan`) a u každého nálezu se ručně posoudil jev. Stejně se prověřilo každé nové slovo (jen tvar v řadě vyjmenovaných slov v `slovnicek_pro_rodice` a v textu taháku se nepočítá — řada je pravidlo, ne příklad). Podobnost vět: žádná věta testu nesdílí s větou lekce víc než obecná slova (*Tomáš byl …*). Kontrola puštěna znovu na konci, po úpravě `cj-t10-l37nb` auditorem T10.

**Kolize a náhrady (15. 10. 2026):**

| # | kolize (lekce) | nově | proč právě to |
|---|---|---|---|
| P3 | *basketbalista* (`cj-t2-l5nb` vzor předseda, `cj-t2-l8nb` *s basketbalisty*) | *klavírista* | *-ista* vyčerpané: *turista* (`l5n`, `l7n`), *florbalista* (`l5n`), *kytarista, volejbalista, pianista* (`l8n`), *fotbalista* (`l8`), *motocyklista* (`l7nb`) |
| P5 | *zmoklí* (`cj-t10-l40n` U1 *zmoknout*, jiný jev) | *vyčerpaní* | *promrzlí, zmrzlí, unavení* už v T3 |
| P6 | *měkký* (`cj-t10-l37n`, `l37nb`, jiný jev) | *křehký – křehčí* | *hladký, sladký, úzký, řídký, mělký, hebký* v lekcích; *vlhký* má jako hlavní 2. st. *vlhčejší* |
| P9 | *přicházela* (`cj-t7-l27n`), *zaklepala* (`cj-t7-l27b`), *naslouchala* (`cj-t7-l26b`) | *obcházela, usedla, obdivovala* | *přemýšlela* v `cj-t6-l24n`, *odpočívala* v T7–T9 |
| P10 | *ozdoben* (`cj-t7-l28n` *ozdobili*, `cj-t6-l24nb`) | *vyžehlena* | *zabalen* (`cj-t5-l20n`), *pokácen* (`cj-t5-l19b`), *smeten z chodníku* (`cj-t5-l20n`); rušivá věta *Ema byla celé odpoledne …* blízká `cj-t5-l17nb` → *Tomáš byl v neděli s dědou na rybách.* |
| P12 | *syčela* + „husa syčela“ (`cj-t6-l22n`, `l24n`, `cj-t7-l26n`), *vítala* (`cj-t6-l22n`, *přivítal(a)* `l22n`, `l23n`, dlaždice *vítat* `l23n`, `cj-t7-l25n`, `l26b`), *myš* (`cj-t6-l23n` *myší*, `l24`, `l24n`, `cj-t8-l32b`) | *sirup, viklat, nachomýtla* | **řada po S je podle kořene vyčerpaná** (*synovec* `l22n`, *sytý/nasytit* `l22n`, `l22b`, *sýr/sýrárna/syreček* `l22`, `l22nb`, `l24b`, *syrový* `l22n`, *sychravý* `l22`, *usychat/vysychat* `l22n`, `l22nb`, *sýkora* `l23`, *sýček*, *sysel* `l22`, *syčet*, *sypat/sypký* `l22n`, `l22nb`) → po S jiný jev téhož tématu, nevyjmenované slovo (sousední kód `vs-s-y-za-i`, OSNOVA §15, téma 6); po M je podle kořene nehodnocené jen *nachomýtnout se*; po V nevyjmenované *viklat* (*víla* `l23nb`, *víno* `l22b`, *vítr, víčko, vír* v T6) |
| P13 | *pobyl* (`cj-t7-l27nb` *pobyli* — stejná situace „u nás pobyl týden“), *přibil* (`cj-t6-l24n` U1 polička, dvojice *přibít/přibýt* `l21n`, `l21nb`) | *zabýval* (B, dlouhé *ý*) + *pobily* (*pobít × pobýt*) | dvojice *nabýt, odbýt, ubýt, zbýt, dobýt, přebít, vít/výt, výr/vír* jsou v `cj-t6-l21n`–`l24nb`; *zabývala* je jen správně napsané slovo v textu chybové úlohy `cj-t6-l21nb` U4 (dítě ho neklikne); *pobít* nikde |
| P14 | *visely* (`cj-t7-l26n`, `l28n`; *visela* `l27n`; *v_set* `cj-t6-l22nb`) | *blikaly semafory* | sloveso nepřechodné, podmět m. neživ. za přísudkem jako dřív |
| P15 | *vrátili* (`cj-t7-l27n`, `l28n`), *váleli/válela* (`cj-t7-l28n` *válela*) | *přicestovali, povalovaly* | — |
| P22 | *zmodraly* (`cj-t7-l28n`) | *zfialověly* | *zčervenat* (`l38`, `l40`), *zčernat* (`cj-t7-l26nb`), *zhnědnout* (`l40`) |
| P23 | *oddaní* (`cj-t10-l37n` *oddat se*, *poddat (se)* `l39n`, `l40n`) | *nejjižnější* (*jj*, předpona *nej-*) | *dd* vyčerpané (*oddíl, oddech, oddychnout, oddělit, oddálit, poddůstojník*); *nejjasnější, nejjarnější, nejjistější, nejjednodušší* v `l37`–`l40b` |

**Hodnocená plnovýznamová slova testu (stav 15. 10. 2026):** *občas, ochotně, blízko, klavírista, losi, břízy, pěnkavy, vyčerpaní, farmářovi, křehčí, obcházela, usedla, obdivovala, vyžehlena, sirup, viklat, nachomýtla, zabýval, pobily, blikaly, prohlíželi, opírala, přicestovali, povalovaly, horolezec, únoru, zdolal, strmou, stěnu, u kašny, usnout, sousedy, matematiku, zeměpis, dějepis, objela, vjela, tajemně, spojila, zfialověly, ochranný, nejjižnější*.

**Vědomě ponecháno (jiný jev nebo malá uzavřená množina):**
- *ochotně* (P1): *ochotní* jen v `cj-t3-l10n` (koncovka přídavného jména, jiný jev).
- *blízko* (P2): `cj-t6-l21n` *bl_zko* a `cj-t6-l21nb` *poblíž* (vyjmenovaná slova), `cj-t3-l9b` *blízký* (stupňování) — jiný jev. Náhrady se stejnou vlastností (přísl. i předl.) jsou už se stejným jevem v lekcích: *naproti*, *okolo* (`cj-t1-l2n`), *uprostřed* (`cj-t1-l3b`).
- *strmou* (P16): `cj-t10-l39nb` *strmý/strmně* (zdvojené souhlásky a *mně*, jiný jev).
- *objela* (P21): *bje* na švu mají jen *objet, objem, objevit, objednat* — všechna jsou v diag nebo `cj-t10-l39`/`l40`; *objela* je v `cj-t10-l39` U1 D jen jako rozklad *ob|jet* (kde končí předpona); *objetí* (`cj-t10-l39b`, `l40b`) je od *obejmout*, jiné slovo. *vjela* (P21): *vje* má jen *vjet, vjezd, vjíždět* (a *vjem*); *vjezd* je v diag, L39, L40 a v taháku (*v|jezdová brána*). Obě jsou malé uzavřené množiny (*objela* je dokumentovaná výjimka; *vjela* ze stejného důvodu).
- Uzavřené tvary: *na, protože, ale, s* (předložky a spojky), *bychom / bysme / by jsme*, *mě / mně*, *oběma / obouma / obou*, názvy vzorů a větných členů v nabídce, počty vět.

## 5. Dublety a sporné jevy (OSNOVA §16) — nic v hodnoceném místě
- *losi / losové* (P4): v mezeře jde volit jen *i/y*, tvar *-ové* napsat nejde; *los* m. neživ. (loterie) vylučuje přísudek *brodili se*.
- *objet / obejet* (P21): *obejela* v nabídce není (jen *ě / je*).
- *mě / mne*: *mne* v nabídce není (jako D7).
- P14, P15: žádný přísudek před několikanásobným podmětem, žádné *s* v podmětu, žádné *my/vy*, žádná *děti/lidé* (ti jsou v L27); jediný podmět za přísudkem (P14) je jednoduchý a sloveso *blikat* je nepřechodné (*blikat světlem* je 7. p., *blikali semafory* jako „oni“ nejde; původní *zastavil_ autobusy* šlo číst i „oni zastavili autobusy“ → *zastavili* by bylo správně).
- P18–P20: žádné *a* v neslučovacím poměru, žádný několikanásobný přísudek se společným podmětem, žádné oslovení.
- P22: *spojit* a *zfialovět* nemají podobu s druhou předponou (id=110 je mezi slovesy s oběma podobami ani mezi dvojicemi s jiným významem neuvádí; *sfialovět* neexistuje); předložka *s* jen se 7. p.
- P10: v trpném rodě jen krátký tvar *vyžehlena*; v rušivých větách žádné *byl* + přídavné jméno.
- P6: *křehký* má 2. st. *křehčí* i řidší *křehčejší* (ÚJČ: „varianta křehčí je výrazně frekventovanější“); v nabídce je jen *křehčí*, *křehkejší* je chybný tvar.
- P12: *s_rup, v_klat* jen s *i* (*syrup, vyklat* nejsou slova); *nachomýtnout se* jen s *ý* (dlouhá hláska, nabídka *í/ý*); *umývadlo/umyvadlo* záměrně ne (dubleta délky).
- P13: *zabývat se* jen s *ý* (nabídka *í/ý*; *zabíval* není slovo); *kroupy pob_ly úrodu* — *pobyly* (pobýt) nedává smysl, správně jen *pobily*.
- P23: *ochranný* jen s *nn*, *nejjižnější* jen s *jj* (*nejižnější* není slovo); mezera je *ne_ižnější*, aby *jj* dalo *nejjižnější*, ne *-jjj-*.
- P2: *blízko* — SSČ i SSJČ (heslo *blízko*): přísl. (*bydlet blízko*) a předl. s 2. p. (*bydlet blízko lesa*, SSJČ „v platnosti předl. s 2. p.“); ve větě je jednou samo, jednou s 2. p. (*blízko školy*).

## 6. Nahrávky
Test nemá poslech ani diktát — žádné řádky do `AUDIO.md`.

## 7. Kontrola (15. 10. 2026)
- `node supabase/seed/seed-lekce.mjs --jen-validace --adresar obsah/cestina/lekce --lekce cj-t0-pol`: 0 chyb; `npm test`: `# fail 0`.
- Kontrola přes `web/js/vyhodnoceni.js` (`vyhodnotKrok`) + `vyhodnoceni-cj.js` (`vzorovaOdpoved`): vzorová odpověď všech 23 položek správně, všech 56 známých chyb a chybných dlaždic vrací svůj kód (79 kontrol, 0 chyb). Indexy slov (P1, P2, P9, P16, P18, P20) přepočítány tokenizérem `tokenizuj`; doplňovačky složeny se vzorovou odpovědí i se všemi nabídkami (délka *i/y × í/ý*: P12 *nachom_tla* a P13 *zab_val* mají nabídku *í/ý*).
- Novost: §4 (skript přes všech 161 souborů a taháky, puštěn znovu na konci).
- **ÚJČ:** ověřeno z mezipaměti `nastroje/ujc.sh` a výkladů: *pobýt* („jiné je: pobít“), *vyčerpaný* (příd., příč. trp. *vyčerpán*), *křehký* (2. st. *křehčí, křehčejší*), *kroupa*, id=100 (*zabývat se*, *nachomýtnout se* v řadách; *sirup, viklat* v řadách nejsou), id=125 (*ochrana – ochranný*). Server ÚJČ byl 15. 10. 03:20–05:40 přetížený (dotazy 04:07, 04:29, 04:52, 05:13, 05:36 bez odpovědi). **Doověřeno 15. 10. 2026 ráno (vedoucí):** všechna hesla *klavírista, obcházet, usednout, obdivovat, vyžehlit, sirup, viklat, blikat, semafor, přicestovat, povalovat se, pobít, zfialovět, jižní, nachomýtnout se* jsou v IJP. *sirup* má dubletu *sirob*, mezera *s_rup* je v obou podobách *i*, takže se hodnocení netýká. `kontrola.jistota: "jista"`.

## 8. Jazyková korektura (korektor, 14. 10. 2026)
Jazykové chyby (hodnocené místo s více správnými odpověďmi nebo bez měřeného jevu): **2** — P14 *Na zastávce zastavil_ autobusy* (čtení s nevyjádřeným podmětem *oni zastavili autobusy* dává správně i *-i*) → *visel_ nové jízdní řády*; P4 *na sýkor_* (po *r* vždy *y*, měří jen Z5, ne vzor; rozpis tvrdil opak) → *na pěnkav_*.
Novost (stejný kořen a jev hodnocený v lekcích): P3 *turista* (`cj-t2-l5n`, `l7n`), P4 *orli* (`cj-t2-l7` *orly*), P5 *sousedovi* (`cj-t3-l11n`, `l12n`), P6 *hezčí* (`cj-t3-l9`), P9 *zazvonit, čekat* (`cj-t8-l29`, `cj-t7`), P10 *natřít* (věty skoro z `cj-t5-l19`: „Táta natřel plot“, „Plot byl natřen“), P12 *sypat, viděli* (`cj-t6-l22`–`l24`), P13 *pili, pyl* (`cj-t6-l22`, řady), P16 *brankář, těžký* (`cj-t2-l8`, `cj-t3`), P17 *lavička* (`cj-t8-l31` „Lavička v parku“ jako přívlastek neshodný), P22 *sbírat, zčervenat* (`cj-t10-l38`, `l40`), P23 *stinný, rozzuřit* (`cj-t10-l37` tahák a semafor); P8, P11 skoro shodné věty s novými naostro lekcemi. Vše nahrazeno (§2), nové tvary ověřeny v ÚJČ.
Texty: `uvod_pro_rodice` zkrácen na 1 větu (SABLONA §4).
**Vyřešeno 15. 10. 2026 (§4):** lekce jiných autorů vytvořené po korektuře (14. 10. 18:54–19:19) převzaly hodnocená slova testu se stejným jevem: *basketbalista* (`cj-t2-l5nb`), *syčela* a věta „husa syčela“ (`cj-t6-l22n`), *pobyl/přibil* (`cj-t6-l24n`), *visely* (`cj-t7-l26n`); *oběma babičkám* (`cj-t4-l15b`) → P8 změněno na *tetám*. Jiný jev: *blízko* (`cj-t6-l21n`), *přicházela* (`cj-t7-l27n`), *ozdob-*, *zmodraly* (`cj-t7-l28n`). Závěrečná kontrola 15. 10. našla další (audity T6, T7, T10) a všechny kromě vědomě ponechaných (§4) vyměnila v testu; lekce se neměnily.
