# Téma 5 — Slovesa: způsob, vid, rod (lekce 17–20)

Verze 1.0, 1. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (review, sloučení nahrávek do `AUDIO.md`, oddíl „Poznámky pro vedoucího“), jazykového korektora, recenzenta. Lekce podle tohoto rozpisu jsou hotové: `obsah/cestina/lekce/cj-t5-l17.json` až `cj-t5-l20.json`.

Forma jako `TYDEN-2.md` ze Spolu: u každé lekce Cíl, Úvod pro rodiče, Platí, Slovníček a tabulka pěti úloh. Plné texty taháku, semaforu a tisku jsou v JSON; tady je obsah: co úloha měří, data, správné odpovědi, známé chyby s kódy a hlavní otázka rodiče. Podklad: `cestina/Obsah/OSNOVA.md` §2, §3, §9, §16–18; `ZADANI-OSMA.md` §3, §4, §8; `FORMAT-CJ.md` (Spolu 8: 5 úloh).

## Společné pro celé téma

- **5 úloh:** U1 rozcvička 4 min · U2 nová 5 · U3 nová 5 · U4 detektiv 5 · U5 kontrolní 6 → `cas_min: 25`. `tyden` 5, `poradi` 1–4, `kapitola` `slovesa`, `faze` `osma`.
- **Indexy slov** v `klik_ve_textu` a `oznac_role` od 0, interpunkce se nepočítá (tokenizace `vyhodnoceni-cj.js`). U textů s `oznac_role` / `klik_ve_textu` jsou níže vypsané všechny tokeny.
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; detektiv Petr. Oslovení jen *Tomáši, Kláro* (L17 U4). *Honzík* v tématu není.
- **Přesné hodnoty** (stejné ve všech lekcích, v dlaždicích i v rolích):
  - způsob: `"oznamovací"`, `"rozkazovací"`, `"podmiňovací"` (klíč kategorie `zpusob`),
  - vid: `"dokonavý"`, `"nedokonavý"` (klíč `vid`),
  - rod: `"činný"`, `"trpný"` (klíč `rod`),
  - čas: `"přítomný"`, `"minulý"`, `"budoucí"` (klíč `cas`).
- **Čas se určuje jen u oznamovacího způsobu** (jako Spolu TYDEN-5): u rozkazu a tvarů s *by* se čas nikde nechce. Proto `oznac_role` s kategorií `cas` má jen oznamovací slovesa (L18 U5, L19 U5) a týdenní kontrola L20 bere `{zpusob, vid, rod}`.
- **Co se u složených tvarů označuje:** podmiňovací způsob = příčestí na *-l* (*Šli* bychom, *Půjčil* bys), slovo *by/bys/bychom* stojí vedle neoznačené; rod trpný = tvar na *-n, -t* (*zbourán, otevřen, opraveno*), čas určuje *byl / bude*; *bude trénovat* = označený neurčitý tvar, určuje se celé spojení (tahák to rodiči říká).
- **Vid:** test „budu ___“ s neurčitým tvarem (ÚJČ/SSČ u každého slovesa *dok.* / *ned.*). Ve vidových úlohách **není *jít*** (je nedokonavé, ale *budu jít* se neříká, test by dítě zmátl; budoucí čas *půjdu*, ÚJČ heslo *jít*) ani slovesa obouvidová. Dokonavé sloveso v přítomném tvaru = budoucí čas (*napíšu, dočte, zavolám, přestřihne*), kód `cas-budouci-za-pritomny`.
- **Rod trpný:** jen jednotné číslo a jen krátké tvary *-n, -t* (OSNOVA §9: ne *zavřený × zavřen*, ne zvratné pasivum *staví se*). Past „být bez tvaru na -n, -t“ (*byl doma, byla na koncertě, byl u stavby*) = rod činný, kód `rod-trpny-za-byt`.
- **Tvary s by:** spisovně *bych, bys, by, bychom, byste, by* (ÚJČ id=575: *bysme* jen neformální mluva, *by jsme / by jste* chybné). V datech žádné *bys* + *si/se* (spisovně *koupil by sis*, id=575 — zbytečná past).
- **Dublety** (*píšu/píši, napíšu/napíši, hraju/hraji, trénuju/trénuji, četla/čtla*, rozkaz *hraj/hrej*) se smí objevit v textu, ale nikdy se nevyhodnocuje jejich podoba (žádný diktát ani doplňování s nimi). V úlohách 3. osoba (*píše, dočte*) nebo minulý čas rodu mužského (*četl*).
- **Diktát (L20):** každé slovo je jev tématu, nebo jen ze Z5 (OSNOVA §2.2): bez *i/y* po obojetné souhlásce v kořeni i koncovce (kromě tvarů *být*), bez příčestí v mn. č., bez předložek *s/z*, bez *mě/mně*. `hodnotit_interpunkci: false`, `hodnotit_velikost: false`, `max_prehrani: 2`.
- **Kódy chyb** jen z `TYPY-CHYB.md` (oddíl Slovesa a Spolu 8). Nové kódy nejsou potřeba. „obecná“ = chybná dlaždice bez kódu (FORMAT-CJ §3.1).

## Cíl tématu

Dítě u slovesa určí **způsob** (oznamuje, přikazuje, nebo s *by* říká, co by bylo), **vid** (testem *budu ___*) a **rod** (podmět děj dělá, nebo se děje s ním: *být* + tvar na *-n, -t*), napíše spisovně *bychom, byste* a budoucí čas dokonavých sloves bez *budu* (*přečtu*, ne *budu přečíst*). Osoba, číslo a čas jsou společný základ Z3 (rozcvička L17).

---

## LEKCE 17 — Slovesný způsob a tvary bychom, byste (`cj-t5-l17`)

`tema`: „Slovesný způsob a tvary bychom, byste“ · `kapitola`: `slovesa` · `tyden` 5, `poradi` 1 · poslech U3.

**Cíl:** Dítě u slovesa ve větě pozná, jestli oznamuje, přikazuje, nebo říká, co by bylo (způsob), a napíše spisovně *bychom* a *byste*.

**Úvod pro rodiče:** Dnes se dítě učí poznat způsob slovesa (oznamuje, přikazuje, nebo říká, co by bylo) a psát spisovně bychom a byste.

**Platí:**
1. `Oznamuje · přikazuje · s by` — co to je (27 znaků)
2. `Je u slovesa by? → podmiňovací` — test (30)
3. `já bych · ty bys · on by …` — příklad (26; ne *my bychom · vy byste*: byla by to odpověď U3–U5, korektor 4. 10.)

**Slovníček pro rodiče:** způsob slovesa · oznamovací způsob (i otázka: *Píšeš?*) · rozkazovací způsob · podmiňovací způsob (s *by, bych, bys, bychom, byste*) · spisovně (*bysme* se jen říká, *by jsme* je chyba) · osoba, číslo, čas · neurčitý tvar.

**Pomůcky:** sešit, propiska. **Čas:** 25 min.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V každé řadě odpověz na otázku k tučnému slovu. *Měří:* Z3 (čas, osoba, číslo podle tvaru); jen společný základ (OSNOVA §2.3). | 4 kroky `dlazdice`, popisky „Řada A“ … **A)** Zítra **půjdeme** do kina. Jaký čas? přítomný · minulý · budoucí **B)** S Tomášem **hrajeme** tenis. Jaká osoba? 1. · 2. · 3. osoba **C)** Chci **koupit** dárek. Jakou osobu má tučné slovo? 1. osoba · 3. osoba · nemá osobu **D)** Celá třída **jede** na výlet. Jaké číslo? jednotné · množné | A budoucí · B 1. osoba · C nemá osobu · D jednotné | A přítomný → `cas-budouci-za-pritomny` · B 3. osoba → `osoba-podle-podmetu-slova` · C 1. i 3. osoba → `infinitiv-urci-osobu` · ostatní obecná | Otázky po řadách: A „Děje se to teď, už se to stalo, nebo to teprve bude?“ · B „Dosaď já, ty, on, my, vy, oni. Se kterým zní hrajeme správně?“ · C a D „Jde říct on koupit? … Kolik je tam tříd?“ |
| U2 nová (5) | Urči způsob tučného slovesa. *Měří:* 3 způsoby; otázka s *bys*; *byla* jen začíná na *by* (přiřazení). | 4 kroky `dlazdice` se stejnou nabídkou: oznamovací · rozkazovací · podmiňovací. **A)** **Zavři** okno! **B)** **Hrál bys** hokej? **C)** Lucka **byla** doma. **D)** **Pojďme** ven! | A rozkazovací · B podmiňovací · C oznamovací · D rozkazovací | A, D oznamovací → `zpusob-rozkaz-za-oznam` · B oznamovací → `zpusob-podmin-za-oznam` · C podmiňovací → `zpusob-byl-za-podminovaci` · ostatní obecná | „Podívej se u každého slovesa, jestli vedle něj stojí samostatné malé slovo by, bych, bys.“ Typická chyba: B oznamovací („je to otázka“): „Je u slovesa malé slovo bys? Co říká?“ |
| U3 nová, **poslech** (5) | Poslechni si větu, odpověz na dvě otázky. *Měří:* poznat sluchem hovorové *bysme* a vybrat spisovný tvar (OSNOVA §3: ověřit sluchem jde *bysme*). | 2 kroky `poslech`, `audio/cestina/t5/l17-u3.mp3`, `max_prehrani: 0`, přepis „Večer bysme mohli jít do kina.“ (záměrně hovorové). `k1` otázka „Které slovo z nahrávky se v písemce napíše jinak?“: Večer · bysme · mohli · kina. `final` „Jak se to slovo napíše v písemce?“: bychom · by jsme · bysme | k1 bysme · final bychom | k1 jiné slovo obecná · final by jsme → `by-jsme-za-bychom`, bysme → `bysme-za-bychom` | „Řekni celou řadu nahlas: já bych, ty bys, on by a dál až po oni. Je každý tvar jedno slovo, nebo dvě?“ |
| U4 detektiv (5) | Petr napsal pozvánku: **Tomáši a Kláro, rád bych vás pozval na oslavu. Kdy by jste přišli?** Jednu chybu najdi. *Měří:* `by-jsem-za-bych` (Petrova chyba *by jste*) vedle správného *bych*. | `k1` `dlazdice` „Kde má Petr chybu?“: rád bych · vás pozval · na oslavu · by jste (chyba je dvojslovná, proto ne klik; OSNOVA L17) · `final` `dlazdice` „Jak to má Petr napsat?“: bychom · byste · bysme | k1 by jste · final byste | k1 rád bych → `by-jsem-za-bych` (dítě si myslí, že patří *by jsem*), vás pozval / na oslavu → `detektiv-jine-slovo` · final bychom, bysme → `detektiv-oprava-jine-chyby` | „Najdi v pozvánce všechna slova s by. Ke každému řekni, kdo to je: já, ty, my, nebo vy?“ Typická chyba: vybere „rád bych“. (Je správně.) |
| U5 kontrolní (6) | Doplň slova, pak u označených sloves urči způsob. *Měří:* tvary *bych, bychom, byste* a způsob v textu (těžší než U2: 6 sloves, nic nového). | `k1` `doplnit_pismeno` (slovní nabídka): „O víkendu _ mohli jet na hory. Co _ tomu řekli vy? Já _ jel rád.“ mezery: [bysme, bychom, by jsme] · [byste, by jste] · [by jsem, bych]. `final` `oznac_role`, role 3 způsoby, text **Lucka byla celý týden doma. Pojď ji v sobotu navštívit! Šli bychom spolu. Vezmi s sebou novou hru. Klára také přijde. Půjčil bys mi kolo?** tokeny: Lucka(0) byla(1) celý(2) týden(3) doma(4) Pojď(5) ji(6) v(7) sobotu(8) navštívit(9) Šli(10) bychom(11) spolu(12) Vezmi(13) s(14) sebou(15) novou(16) hru(17) Klára(18) také(19) přijde(20) Půjčil(21) bys(22) mi(23) kolo(24); `slova: [1, 5, 10, 13, 20, 21]` | k1 [bychom, byste, bych] · final 1 oznam., 5 rozkaz., 10 podmiň., 13 rozkaz., 20 oznam., 21 podmiň. | k1 [bysme,–,–] → `bysme-za-bychom` · [by jsme,–,–] → `by-jsme-za-bychom` · [–,by jste,–] a [–,–,by jsem] → `by-jsem-za-bych` · final {1: podmiň.} → `zpusob-byl-za-podminovaci` · {5, 13: oznam.} → `zpusob-rozkaz-za-oznam` · {10, 21: oznam.} → `zpusob-podmin-za-oznam` | R55. Typická chyba: *byla* jako podmiňovací: „Je to samostatné by?“; *Šli, Půjčil* jako oznamovací: „Je vedle malé by?“ |

**Kontrola pro vás (kontrolní):** O víkendu **bychom** mohli jet na hory. Co **byste** tomu řekli vy? Já **bych** jel rád. — byla a přijde oznamovací; Pojď a Vezmi rozkazovací; Šli (bychom) a Půjčil (bys) podmiňovací.

Poznámky k L17:
- *Pojďme* (U2 D) = rozkazovací tvar s předponou *po-* (ÚJČ heslo *jít*: „pojďme domů“, „lze užít i tvary s předponou po-“). Dítě určuje jen způsob, ne tvar.
- *půjdeme* (U1 A) = budoucí čas slovesa *jít* (ÚJČ *jít*: „Budoucí čas se tvoří … předponou pů-“). Je to jasný tvar ze Z3 se slovem *zítra*.
- U1 C: OSNOVA chtěla `infinitiv-urci-osobu`; *plavat* jsem vyměnil za *koupit* (dotaz do ÚJČ na *plavat* se nepodařil, server přetížen; *koupit* ověřeno).
- U3: OSNOVA navrhla 4. možnost *bychme*; vyřazena — není to skutečná chyba dětí (SABLONA §7: distraktor = skutečná chyba). Nabídka má 3 možnosti.

---

## LEKCE 18 — Slovesný vid (`cj-t5-l18`)

`tema`: „Slovesný vid“ · `kapitola`: `slovesa` · `tyden` 5, `poradi` 2 · poslech U3.

**Cíl:** Dítě určí vid slovesa testem *budu ___* (*budu dělat* jde, sloveso je nedokonavé; *budu udělat* nejde, je dokonavé) a pozná, že *udělám* nebo *nakreslím* je čas budoucí.

**Úvod pro rodiče:** Dnes se dítě učí určit vid slovesa jedním testem: jde před neurčitý tvar říct „budu“ (budu dělat), nebo ne (udělat → udělám)?

**Platí:**
1. `dělat nedokonavé · udělat dokonavé` — co to je (34)
2. `Jde „budu ___“? → nedokonavé` — test (28)
3. `udělám = budoucí čas` — příklad (20; příklady mimo slovesa úloh, korektor 4. 10.)

**Slovníček pro rodiče:** vid · nedokonavé sloveso · dokonavé sloveso · neurčitý tvar · čas · způsob slovesa (minulá lekce).

**Pomůcky:** sešit, propiska. **Čas:** 25 min.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V řadách A–C urči způsob, v D vyber slovo do mezery. *Měří:* L17. | 4 kroky `dlazdice`: **A)** **Napiš** mi zprávu! **B)** **Koupil bys** mi pití? **C)** Adam **byl** na hřišti. (A–C: oznamovací · rozkazovací · podmiňovací) **D)** Večer ___ mohli hrát florbal. (bysme · bychom · by jsme) | A rozkaz. · B podmiň. · C oznam. · D bychom | A oznam. → `zpusob-rozkaz-za-oznam` · B oznam. → `zpusob-podmin-za-oznam` · C podmiň. → `zpusob-byl-za-podminovaci` · D bysme → `bysme-za-bychom`, by jsme → `by-jsme-za-bychom` | Otázky po řadách A · B a C · D. Typická chyba: C podmiňovací: „Je byl samostatné by, nebo jiné slovo?“ |
| U2 nová (5) | Urči vid slovesa. *Měří:* vid testem budu ___ (přiřazení; dvojice skákat × skočit, psát × přečíst). | 4 kroky `dlazdice` se stejnou nabídkou: dokonavý · nedokonavý. **A)** přečíst **B)** skákat **C)** skočit **D)** psát | A dok. · B ned. · C dok. · D ned. | každá chybná → `vid-zamena` | „Zkus říct nahlas budu kreslit a potom budu nakreslit. Které zní česky? Stejně to zkus u každého slovesa z úlohy.“ Typická chyba: *přečíst* nedokonavé („čtení trvá“): „Jde říct budu přečíst?“ |
| U3 nová, **poslech** (5) | Poslechni si větu, odpověz na dvě otázky. *Měří:* dokonavé sloveso v přítomném tvaru = budoucí čas; jeho vid. | 2 kroky `poslech`, `audio/cestina/t5/l18-u3.mp3`, přepis „Zítra napíšu test a potom budu číst knihu.“ `k1` „V jakém čase je sloveso „napíšu“?“: přítomný · minulý · budoucí. `final` „Jaký vid má sloveso „napíšu“?“: dokonavý · nedokonavý | k1 budoucí · final dokonavý | k1 přítomný → `cas-budouci-za-pritomny`, minulý obecná · final nedokonavý → `vid-zamena` | „Dej to sloveso do neurčitého tvaru a zkus: budu ___. Jde to?“ Typická chyba: přítomný (chybí *budu*): „Píšeš ten test teď, nebo až zítra?“ |
| U4 detektiv (5) | Petr napsal do deníku: **Dnes budu psát úkol a zítra budu přečíst knihu.** Jednu chybu najdi. *Měří:* `bude-s-dokonavym` vedle správného *budu psát*. | `k1` `dlazdice` „Kde má Petr chybu?“: budu psát · úkol · zítra · budu přečíst · `final` `dlazdice` „Jak to má Petr napsat?“: přečíst budu · přečtu · přečte (*budu číst* v nabídce **není**: druhá správná oprava, OSNOVA L18) | k1 budu přečíst · final přečtu | k1 budu psát → `vid-zamena` (dítě má *psát* za dokonavé), úkol / zítra → `detektiv-jine-slovo` · final přečíst budu → `bude-s-dokonavym`, přečte → `detektiv-oprava-jine-chyby` | „Zkus obě Petrova spojení s budu říct nahlas. Které zní česky a které ne?“ Typická chyba: vybere *budu psát* (je správně). |
| U5 kontrolní (6) | U označených sloves vyber vid a čas. *Měří:* vid a čas v textu, budoucí čas dokonavého slovesa bez *budu* (10 údajů). | `oznac_role`, `role: {vid: [dokonavý, nedokonavý], cas: [přítomný, minulý, budoucí]}`, text **Tomáš včera četl knihu. Dnes ji dočte. Teď píše úkol. Zítra bude trénovat. Ráno zaspal.** tokeny: Tomáš(0) včera(1) četl(2) knihu(3) Dnes(4) ji(5) dočte(6) Teď(7) píše(8) úkol(9) Zítra(10) bude(11) trénovat(12) Ráno(13) zaspal(14); `slova: [2, 6, 8, 12, 14]` | 2 {ned., minulý} · 6 {dok., budoucí} · 8 {ned., přítomný} · 12 {ned., budoucí} · 14 {dok., minulý} | {6: cas přítomný} → `cas-budouci-za-pritomny` · {2: dok., 6: ned., 8: dok., 12: dok., 14: ned.} → `vid-zamena` | R55. Typická chyba: *dočte* přítomný („dnes“): „Dočítá to teď, nebo to teprve udělá?“ |

**Kontrola pro vás (kontrolní):** četl nedokonavý, minulý · dočte dokonavý, budoucí · píše nedokonavý, přítomný · (bude) trénovat nedokonavý, budoucí · zaspal dokonavý, minulý.

Poznámky k L18:
- U1 C: *Adam byl na hřišti* (ne *na tréninku*: heslo *trénink* se z ÚJČ nepodařilo načíst).
- U5 *Dnes ji dočte*: *dnes* je záměrná past (dítě dá přítomný), dočíst = dok. (SSČ), *dočte* = budoucí čas.

---

## LEKCE 19 — Rod činný a trpný (`cj-t5-l19`)

`tema`: „Rod činný a trpný“ · `kapitola`: `slovesa` · `tyden` 5, `poradi` 3 · bez poslechu.

**Cíl:** Dítě pozná rod trpný (*Plot byl natřen*: s podmětem se něco děje, *být* + tvar na *-n, -t*) a odliší ho od rodu činného i od věty s *být* bez takového tvaru (*byl venku*).

**Úvod pro rodiče:** Dnes se dítě učí poznat, jestli podmět děj dělá (rod činný), nebo se děj děje s ním (rod trpný: Plot byl natřen).

**Platí:**
1. `Činný: podmět to dělá` — co to je (21)
2. `Trpný: být + -n/-t (je umyt)` — test (28)
3. `Plot natřeli × Plot byl natřen` — příklad (30; příklady mimo věty úloh, korektor 4. 10.)

**Slovníček pro rodiče:** rod slovesa (nemá nic společného s rodem mužským, ženským, středním) · rod činný · rod trpný · podmět · vid (minulá lekce) · čas.

**Pomůcky:** sešit, propiska. **Čas:** 25 min.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V řadách A a B urči vid, v C čas, v D vyber slovo. *Měří:* L18. | 4 kroky `dlazdice`: **A)** dopsat · **B)** běhat (dokonavý · nedokonavý) **C)** Zítra **zavolám** babičce. (přítomný · minulý · budoucí) **D)** Večer ___ pokoj. (budu uklidit · uklidím) | A dok. · B ned. · C budoucí · D uklidím | A, B jiný vid → `vid-zamena` · C přítomný → `cas-budouci-za-pritomny`, minulý obecná · D budu uklidit → `bude-s-dokonavym` | Otázky po řadách A a B · C · D. Typická chyba: C přítomný: „Voláš teď, nebo zítra?“ (*budu uklízet* v nabídce záměrně není.) |
| U2 nová (5) | Urči rod tučného slovesa. *Měří:* činný × trpný, past *být* bez tvaru na -n, -t (přiřazení). | 4 kroky `dlazdice` se stejnou nabídkou: činný · trpný. **A)** Okno **bylo rozbito**. **B)** Adam **rozbil** okno. **C)** Adam **byl** ve škole. **D)** Kolo **je opraveno**. | A trpný · B činný · C činný · D trpný | A, D činný → `rod-trpny-neuzna` · C trpný → `rod-trpny-za-byt` · B trpný obecná | „Najdi v každé větě tvar slova být. Je hned za ním slovo na -n nebo -t?“ Typická chyba: C trpný kvůli *byl*: „Děje se tu s Adamem něco, nebo jen říká, kde byl?“ |
| U3 nová (5) | Vyber větu, která říká totéž v druhém rodě. *Měří:* převod činný → trpný a trpný → činný. | `k1` `dlazdice` „Totéž v rodě trpném“ k větě **Klára opravila kolo.**: Kolo bylo opraveno Klárou. · Klára byla u kola. · Kolo opravilo Kláru. · Klára byla opravena kolem. · `final` `dlazdice` „Totéž v rodě činném“ k větě **Dopis byl napsán Tomášem.**: Dopis byl napsán. · Tomáš byl napsán dopisem. · Tomáš napsal dopis. · Tomáš píše dopis. | k1 Kolo bylo opraveno Klárou. · final Tomáš napsal dopis. | k1 Klára byla u kola. → `rod-trpny-za-byt`, ostatní obecná (obrácený smysl) · final Dopis byl napsán. → `rod-trpny-neuzna` (pořád trpný), ostatní obecná (obrácený smysl, jiný čas) | „Kdo kolo opravuje a co se děje s kolem? Najdi větu, která mluví o kole, ale opravuje pořád Klára.“ |
| U4 detektiv (5) | Petr měl určit rod: **Adam byl doma. Dům byl postaven loni. Ema postavila stan.** Napsal: byl – činný, byl postaven – činný, postavila – činný. Jednu chybu najdi. *Měří:* `rod-trpny-neuzna`; past *byl doma*. | `k1` `dlazdice` „Kde má Petr chybu?“: byl (Adam byl doma) · byl postaven · postavila · `final` `dlazdice` „Jaký rod tam patří a proč?“ (obecné důvody, neprozradí k1): trpný: s podmětem se něco děje · trpný: ve větě je tvar slova být · činný: podmět to sám dělá | k1 byl postaven · final trpný: s podmětem se něco děje | k1 byl (Adam byl doma) → `rod-trpny-za-byt`, postavila → `detektiv-jine-slovo` · final „ve větě je tvar slova být“ → `rod-trpny-za-byt`, činný → `detektiv-oprava-jine-chyby` | „U každého Petrova slovesa hledej tvar slova být. Je hned za ním slovo na -n nebo -t? Co to říká o rodu?“ |
| U5 kontrolní (6) | U označených sloves vyber rod a čas. *Měří:* rod v textu, i trpný v budoucnosti a *byl* bez tvaru na -n, -t (10 údajů, jen j. č.). | `oznac_role`, `role: {rod: [činný, trpný], cas: [přítomný, minulý, budoucí]}`, text **Loni byl na návsi zbourán starý most. Letos dělníci postavili nový. Most bude otevřen v neděli. Starosta přestřihne pásku. Adam byl u stavby každý den.** tokeny: Loni(0) byl(1) na(2) návsi(3) zbourán(4) starý(5) most(6) Letos(7) dělníci(8) postavili(9) nový(10) Most(11) bude(12) otevřen(13) v(14) neděli(15) Starosta(16) přestřihne(17) pásku(18) Adam(19) byl(20) u(21) stavby(22) každý(23) den(24); `slova: [4, 9, 13, 17, 20]` | 4 {trpný, minulý} · 9 {činný, minulý} · 13 {trpný, budoucí} · 17 {činný, budoucí} · 20 {činný, minulý} | {4, 13: činný} → `rod-trpny-neuzna` · {20: trpný} → `rod-trpny-za-byt` · {17: přítomný} → `cas-budouci-za-pritomny` | R55. Typická chyba: *zbourán, otevřen* jako činný: „Udělal to most sám?“ |

**Kontrola pro vás (kontrolní):** (byl) zbourán trpný, minulý · postavili činný, minulý · (bude) otevřen trpný, budoucí · přestřihne činný, budoucí · byl (u stavby) činný, minulý.

Poznámky k L19:
- *postavili* (U5) je příčestí v mn. č. jen v textu; nehodnotí se jeho koncovka (shoda = T7), jen rod a čas.
- U3 je převod podle OSNOVY; „Kolo opravilo Kláru“ a „Klára byla opravena kolem“ jsou obrácený smysl (obecná chyba), ne skutečný jev s kódem.

---

## LEKCE 20 — Kontrola tématu: slovesa (`cj-t5-l20`)

`tema`: „Kontrola tématu: slovesa“ · `kapitola`: `slovesa` · `tyden` 5, `poradi` 4 · diktát U5 `k1`, U5 `tydenni: true`.

**Cíl:** Dítě u sloves v textu samo určí způsob, vid a rod a v diktátu napíše správně tvary *by* a *byl*, budoucí čas s *budu*, rod trpný a rozkaz.

**Úvod pro rodiče:** Dnes je kontrola celého tématu: způsob, vid a rod slovesa, spisovné tvary s by a na konci krátký diktát.

**Platí:**
1. `způsob · vid · rod` — co to je (18)
2. `by? · budu ___? · být + -n/-t?` — test (30)
3. `já bych · udělám · byl natřen` — příklad (27; ne *bychom* = odpověď U4, ne *byl postaven* = diktát, korektor 4. 10.)

**Slovníček pro rodiče:** způsob slovesa · vid · rod slovesa · spisovně · neurčitý tvar · diktát (hodnotí se slova a pravopis, ne čárky ani velká písmena).

**Pomůcky:** sešit, propiska. **Čas:** 25 min.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V každé řadě odpověz na otázku. *Měří:* L17–L19, každá řada jedna věc. | 4 kroky `dlazdice`: **A)** **Pomoz** mi s úkolem! Jaký způsob? (3 způsoby) **B)** vyhrát. Jaký vid? **C)** Obraz **byl namalován** Klárou. Jaký rod? **D)** Vy ___ to zvládli. (by jste · byste · bychom) | A rozkaz. · B dok. · C trpný · D byste | A oznam. → `zpusob-rozkaz-za-oznam`, podmiň. obecná · B ned. → `vid-zamena` · C činný → `rod-trpny-neuzna` · D by jste → `by-jsem-za-bych`, bychom obecná | Otázky po řadách A · B a C · D. Typická chyba: C činný: „Maluje obraz, nebo je malovaný?“ |
| U2 nová (5) | U označených sloves vyber způsob a vid. *Měří:* způsob a vid najednou (8 údajů). | `oznac_role`, `role: {zpusob: [3 způsoby], vid: [dokonavý, nedokonavý]}`, text **Tomáš uklidil pokoj. Teď píše úkol. Ema mu vzkazuje: „Zavolej mi potom! Hráli bychom spolu florbal.“** tokeny: Tomáš(0) uklidil(1) pokoj(2) Teď(3) píše(4) úkol(5) Ema(6) mu(7) vzkazuje(8) Zavolej(9) mi(10) potom(11) Hráli(12) bychom(13) spolu(14) florbal(15); `slova: [1, 4, 9, 12]` | 1 {oznam., dok.} · 4 {oznam., ned.} · 9 {rozkaz., dok.} · 12 {podmiň., ned.} | {9: oznam.} → `zpusob-rozkaz-za-oznam` · {12: oznam.} → `zpusob-podmin-za-oznam` · {1: ned., 4: dok., 9: ned., 12: dok.} → `vid-zamena` | „Vezmi slovo Zavolej. Oznamuje, nebo vyzývá? Jaký má neurčitý tvar? Jde před něj říct budu?“ |
| U3 nová (5) | Urči rod tučného slovesa. *Měří:* rod i v budoucím čase, past *byla* (přiřazení). | 4 kroky `dlazdice` se stejnou nabídkou: činný · trpný. **A)** Plakát **byl nakreslen** Emou. **B)** Ema **byla** na koncertě. **C)** Zápas **bude odložen**. **D)** Tomáš **odložil** tašku. | A trpný · B činný · C trpný · D činný | A, C činný → `rod-trpny-neuzna` · B trpný → `rod-trpny-za-byt` · D trpný obecná | „Vezmi větu C. Odloží zápas sám sebe, nebo ho odloží někdo jiný?“ |
| U4 detektiv (5) | Petr napsal kamarádům zprávu: **Odpoledne budu trénovat. Večer bysme mohli jít ven. Rád bych viděl ten nový film.** Jednu chybu najdi. *Měří:* `bysme-za-bychom` mezi správnými *bych* a *budu trénovat*. | `k1` `klik_ve_textu` max 1, popisek „Klikni na slovo, které Petr napsal špatně.“; tokeny: Odpoledne(0) budu(1) trénovat(2) Večer(3) bysme(4) mohli(5) jít(6) ven(7) Rád(8) bych(9) viděl(10) ten(11) nový(12) film(13) · `final` `dlazdice` „Jak to Petr napíše v písemce?“: by jsme · bychom · byste | k1 `[4]` · final bychom | k1 `[9]` → `by-jsem-za-bych` · `[1]`, `[2]` → `vid-zamena` · `[5]`, `[10]` → `detektiv-jine-slovo` (ostatní obecná) · final by jsme → `by-jsme-za-bychom`, byste → `detektiv-oprava-jine-chyby` | „Přečti zprávu pomalu slovo po slově. U každého slova se zeptej: napíše se to tak i v písemce?“ |
| U5 kontrolní **týdenní** (6) | Krok 1 diktát, krok 2 způsob, vid a rod. *Měří:* celé téma. | `k1` `diktat`, `max_prehrani: 2`, `hodnotit_interpunkci: false`, `hodnotit_velikost: false`, 4 věty, 14 slov (OSNOVA §18): d1 Tomáš by šel ven. · d2 Večer budu číst knihu. · d3 Dům byl postaven loni. · d4 Zavři okno! · `final` `oznac_role`, `role: {zpusob, vid, rod}`, text **Hřiště bylo opraveno o prázdninách. Zítra tam budeme hrát florbal. Přijď také! Potom bychom ještě chvíli seděli venku.** tokeny: Hřiště(0) bylo(1) opraveno(2) o(3) prázdninách(4) Zítra(5) tam(6) budeme(7) hrát(8) florbal(9) Přijď(10) také(11) Potom(12) bychom(13) ještě(14) chvíli(15) seděli(16) venku(17); `slova: [2, 8, 10, 16]` | diktát bez chyb · final 2 {oznam., dok., trpný} · 8 {oznam., ned., činný} · 10 {rozkaz., dok., činný} · 16 {podmiň., ned., činný} | diktát `chyby_ocekavane`: věta 0 slovo 1 (*by*) → `by-i-za-y` (aplikace skládá `diktat-pravopis-by-i-za-y`); ostatní `diktat-jine-slovo` · final {2: rod činný} → `rod-trpny-neuzna` · {10: oznam.} → `zpusob-rozkaz-za-oznam` · {16: oznam.} → `zpusob-podmin-za-oznam` · {2: ned., 8: dok., 10: ned., 16: dok.} → `vid-zamena` | R55. `semafor_tydne` z kroku 2 (12 údajů): zelená 11, oranžová 9, červená 0 (ZADANI-OSMA §8 bod 9: ~90 % / ~70 %). |

**Kontrola pro vás (kontrolní):** diktát: Tomáš by šel ven. Večer budu číst knihu. Dům byl postaven loni. Zavři okno! — opraveno oznamovací, dokonavý, trpný · hrát oznamovací, nedokonavý, činný · Přijď rozkazovací, dokonavý, činný · seděli podmiňovací, nedokonavý, činný.

Poznámky k L20 a diktátu (kontrola slovo po slovu, OSNOVA §2.2):
- d1 *Tomáš* (velké písmeno se hlásí, nehodnotí se) · *by* (tvar *být*, jev T5) · *šel* · *ven*. d2 *Večer* · *budu* · *číst* · *knihu* (*ni* po *n*, Z5). d3 *Dům* (*ů*, Z5) · *byl* (tvar *být*, Z5) · *postaven* (rod trpný) · *loni*. d4 *Zavři* (rozkaz) · *okno*. Žádné *i/y* po obojetné souhlásce mimo tvary *být*, žádné příčestí v mn. č., žádné *s/z*.
- *bychom* v diktátu není: bez příčestí v mn. č. (*šli bychom* = shoda T7) se napsat nedá (OSNOVA §9, L20).
- Chyba v *byl* (*bil*) dostane obecný `diktat-jine-slovo`; `by-i-za-y` je v TYPY-CHYB jen pro *bych, bys, by, bychom, byste*.
- U2 a U5: ve vidových určeních není *jít* (OSNOVA navrhla *Tomáš by šel ven* jen pro diktát, tam se vid neurčuje).

---

## Nahrávky (pro AUDIO.md)

Soubory do `web/audio/cestina/t5/`, v JSON bez `web/`. Hlas a postup podle `AUDIO.md` (Jana, Eleven v4, tempo 0,9 přes ffmpeg). Diktát: každá věta samostatný soubor, věta **dvakrát** (poprvé přirozeně, 2 s pauza, podruhé pomalu po slovech 0,75×, 0,7 s mezi slovy), interpunkce se neříká, vlastní jméno se hlásí „velké písmeno — Tomáš“ (ZADANI-OSMA §8 bod 7). **Pozor:** `AUDIO.md` už má řádky `t5/l20-d1.mp3` … `t5/l20-d4.mp3` (a `t5/l18-u4.mp3`, `t5/l20-u4.mp3`) ze Spolu „základy“ s **jinými větami** — ty je třeba nahradit řádky níže (viz Poznámky pro vedoucího 1).

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t5/l17-u3.mp3` | 17 / úloha 3 (`k1` i `final`) | poslech | Večer bysme mohli jít do kina. | **záměrně hovorový tvar „bysme“** — vyslovit přirozeně, nezdůrazňovat, neopravovat na „bychom“; ≈ 3 s | čeká |
| `t5/l18-u3.mp3` | 18 / úloha 3 (`k1` i `final`) | poslech | Zítra napíšu test a potom budu číst knihu. | nezdůrazňovat „napíšu“ ani „budu“; „zítra“ neutrálně; ≈ 4 s | čeká |
| `t5/l20-d1.mp3` | 20 / úloha 5, `k1`, věta 1 | diktát | Tomáš by šel ven. | 2× podle AUDIO.md; hlásit „velké písmeno — Tomáš“; „by“ zřetelně samostatně | čeká |
| `t5/l20-d2.mp3` | 20 / úloha 5, `k1`, věta 2 | diktát | Večer budu číst knihu. | 2× podle AUDIO.md; dlouhé í v „číst“ slyšet | čeká |
| `t5/l20-d3.mp3` | 20 / úloha 5, `k1`, věta 3 | diktát | Dům byl postaven loni. | 2× podle AUDIO.md; „postaven“ krátce, ne „postavený“ | čeká |
| `t5/l20-d4.mp3` | 20 / úloha 5, `k1`, věta 4 | diktát | Zavři okno! | 2× podle AUDIO.md; rozkaz jen intonací, vykřičník se neříká | čeká |

Celkem **6 nahrávek** (2 poslech, 4 věty diktátu), poslech ≤ 20 s.
