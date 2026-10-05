# Téma 10 — Stavba slova a pravopis na švu (lekce 37–40)

Verze 1.0, 2. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (recenze, sloučení řádků do `AUDIO.md`), jazykového korektora, autora nahrávek.
Podle `cestina/Obsah/OSNOVA.md` §14 (L37–L40), `ZADANI-OSMA.md` §3, §4, §8 a `cestina/Obsah/FORMAT-CJ.md` (rozdíl Spolu 8: 5 úloh). Lekce jsou rovnou napsané: `obsah/cestina/lekce/cj-t10-l37.json` až `cj-t10-l40.json`. Tady je obsah úloh, data, správné odpovědi, známé chyby a hlavní otázka rodiče; celé texty taháku, semaforu a tisku jsou v JSON.

## Společné pro celé téma

- **Lekce:** `faze: "osma"`, `tyden: 10`, `poradi` 1–4, `kapitola: "pravopis"`, `cas_min: 25`, úlohy U1 `rozcvicka` 4 min · U2 `nova` 5 · U3 `nova` 5 · U4 `detektiv` 5 · U5 `kontrolni` 6. Poslední krok každé úlohy je `final`.
- **Indexy slov** v `klik_ve_textu` od 0, interpunkce se nepočítá (`tokenizuj` ve `web/js/vyhodnoceni-cj.js`).
- **Mezery v doplňovačce:** každé `_` je jedna mezera, i u dvojice písmen (`ce_ý` → `n` / `nn`, `ob_vit` → `ě` / `je`, `_jeli` → `s` / `z`). Nabídka mezery je vždy uvedená ve sloupci „Vstup a data“.
- **Svislá čára `|`** v dlaždicích a v taháku ukazuje šev (hranici částí slova). Ve slovníčku je „šev“ přeložen.
- **Hranice tématu (OSNOVA §14) dodržené:** žádné dvojice s jiným významem (*sběh × zběh, správa × zpráva, shlédnout × zhlédnout*), žádná slovesa s oběma předponami (*zcestovat i scestovat*), žádné *se stolu × ze stolu* (předložka *z* jen ve významu „zevnitř / odněkud“: *z batohu, z bazénu, z tělocvičny, ze sklepa, z chaty, z kapsy, z garáže*; žádné *z kopce, ze hřiště*: „po povrchu dolů / z povrchu pryč“ připouští podle id=111 i *s* + 2. p., korektor 4. 10.), žádné *oběd, oběť*, *raný × ranný*, přejatá slova, *dvojbarevný*.
- **Slova „k zapamatování“ podle id=110** (*zkusit, zpívat, skončit, strávit*) se nikde nehodnotí. **Zničit** (osnova ho má v Platí L38 jako příklad „z- změna“) nepoužívám: id=110 řadí „zmenšení objemu, až zánik“ k předponě *s-* (*shořet, shnít*), takže *zničit* je výjimka a dítě s pravidlem „z- = změna“ by mátlo. Náhrada: *zhnědnout, zežloutnout, zčervenat* (barva = jasná změna stavu).
- **Jména:** Tomáš, Lucka, Honzík (jen vytištěné, L38 U2), Klára, Adam, Ema; detektiv Petr. Oslovení jen *Kláro* (heslo *Klára*).
- **Kódy chyb** jen z `TYPY-CHYB.md` (oddíl Spolu 8 a starší `s-z-predlozka-zamena`, `me-mne-zamena`, `detektiv-*`, `pad-4-za-7`). Žádný nový kód nebyl potřeba. V diktátu holé kódy (aplikace skládá `diktat-pravopis-…`).
- **Limit 4 známých chyb na krok:** u doplňovaček s 6–10 mezerami mají kód jen čtyři nejdůležitější mezery, ostatní jsou obecná chyba (rodič stejně vidí, co dítě napsalo). U L37 U3 jsem kvůli tomu úlohu rozdělil na 2 kroky (viz Odchylky).

## Cíl tématu

Dítě rozloží slovo na předponu, kořen, příponu a koncovku a podle toho napíše dvě stejné souhlásky na švu (*od-dělit, cen-ný*), *ú* po předponě (*ne-úspěch*), *bje, vje* (*ob-jet, v-jezd*), *mně* podle příbuzného slova (*zapomněl ← zapomenout*), předpony *s-, z-, vz-* podle významu a předložky *s, z* podle pádu.

---

## LEKCE 37 — Stavba slova, zdvojené souhlásky, ú po předponě (`cj-t10-l37`)

`tema`: „Stavba slova: dvě stejné souhlásky a ú“ · `tyden` 10, `poradi` 1 · rozcvička ze Z5 (příbuzná slova).

**Cíl:** Dítě rozloží slovo na předponu, kořen a příponu a podle toho napíše dvě stejné souhlásky na švu (oddělit, cenný, kamenný) a ú po předponě (neúspěch).

**Úvod pro rodiče:** Dnes se dítě učí rozložit slovo na části: kde se dvě části potkají a obě mají stejné písmeno, píšou se obě (od-dělit, cen-ný), a po předponě zůstává ú (ne-úspěch).

**Platí:** 1. `Na švu dvě stejné → píšou se obě` — co to je (32 znaků) · 2. `Rozlož: od|dech, ne|únavný` — test (26) · 3. `den → denní · stín → stinný` — příklad (27) *(korektor 4. 10.: původní příklady oddělit, neúspěch, cenný, kamenný byly odpovědi U2, U3, U5)*

**Slovníček:** předpona, kořen, přípona, šev, příbuzná slova (lidský překlad v JSON).

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „V každé řadě je jedno slovo, které do rodiny nepatří: jen podobně zní.“ Měří Z5: příbuzná slova = stejný kořen. | 4 kroky `dlazdice`, popisky „Řada A“ … D: **A)** les · lesklý · lesník · zalesnit **B)** hořet · hora · horský · horal **C)** cena · cenný · cesta · ocenit **D)** kámen · kamenný · kamenitý · kamarád | A lesklý (b) · B hořet (a) · C cesta (c) · D kamarád (d) | všechny ostatní volby obecná chyba (osnova: „obecná“) | po řadách: „Řekni u každého slova z řady A, co znamená. Mluví všechna o lese?“ · Typická chyba: vybere slovo s předponou (zalesnit, ocenit) → „O čem to slovo mluví? Je v něm les?“ |
| U2 nová (5) | „Kde končí předpona? U každého slova vyber správné rozdělení.“ Měří hranici předpony a kořene, i když se na švu potkají dvě stejná písmena. | 4 kroky `dlazdice`, popisky „A) oddělit“, „B) rozzlobit“, „C) bezzubý“, „D) neúspěch“: **A** o\|ddělit · od\|dělit · odd\|ělit **B** roz\|zlobit · ro\|zzlobit · rozz\|lobit **C** be\|zzubý · bezz\|ubý · bez\|zubý **D** n\|eúspěch · ne\|úspěch · neús\|pěch | A b · B a · C c · D b | každá chybná volba → `stavba-hranice-zamena` | „Vezmi slovo oddělit. Které slovo bez předpony v něm najdeš?“ · Typická chyba: o\|ddělit, ro\|zzlobit → „Jaké slovo zbude, když odtrhneš předponu?“ |
| U3 nová (5) | „Doplň chybějící písmena. Nejdřív slovo rozlož na části.“ Měří *n × nn* na švu kořene a přípony a *ú × ů*. | `doplnit_pismeno`, 2 kroky. **k1** „Řádek 1“: `ce_ý pohár, kame_ý most, slu_ý den, vl_ěný svetr`, mezery 0–3 `["n","nn"]` · **final** „Řádek 2“: `velký ne_spěch, náš d_m`, mezery 0–1 `["ú","ů"]` | k1 `["nn","nn","nn","n"]` · final `["ú","ů"]` | k1: `[n,·,·,·]`, `[·,n,·,·]`, `[·,·,n,·]` → `zdvojene-chybi`; `[·,·,·,nn]` → `zdvojene-navic` · final: `[ů,·]` → `u-krouzek-za-carku`; `[·,ú]` → `u-carka-za-krouzek` | „Vezmi druhé slovo v řádku 1. Od jakého slova je utvořené? Jakým písmenem končí kořen a jakým začíná přípona?“ (otázky nepíšou hledané tvary, v režimu „Dnes samo“ je čte dítě) · Typická chyba: jedno n v cenný → „Končí kořen na n?“; vlnněný → „Kolik n má vlna?“ |
| U4 detektiv (5) | Petr napsal: **Náš oddíl vyhrál cený pohár.** Jedna chyba. Měří `zdvojene-chybi`; past *oddíl* (správně dd). | **k1** `klik_ve_textu`, max 1, popisek „Klikni na slovo, které Petr napsal špatně.“; tokeny: Náš(0) oddíl(1) vyhrál(2) cený(3) pohár(4) · **final** `dlazdice` „Proč je to slovo špatně?“: Na švu chybí druhé stejné písmeno · Na švu je jedno písmeno navíc · Slovo má začínat velkým písmenem | k1 `[3]` · final a | k1 `navic [0,1,2,4]` → `detektiv-jine-slovo` · final b, c → `detektiv-oprava-jine-chyby` | „Vezmi slovo, které chceš označit, a rozlož ho na části. Potkávají se na švu dvě stejná písmena?“ · Typická chyba: klikne na oddíl → „Rozlož ho: od + …?“ Nabídka kroku 2 nejmenuje žádné slovo (neprozradí k1). |
| U5 kontrolní (6) | „Doplň chybějící písmena. U každé mezery si slovo rozlož na části.“ Celé L37. | `doplnit_pismeno`, 8 mezer: „Po ne_spěšném zápase byl celý o_díl ro_zlobený. Nebyl to slu_ý den. Adam si nasadil vl_ěnou čepici a šel domů. Jeho d_m stojí u kame_ého mostu. V pokoji má ce_ý pohár z loňska.“ Nabídky: 0 `ú/ů`, 1 `d/dd`, 2 `z/zz`, 3 `n/nn`, 4 `n/nn`, 5 `ú/ů`, 6 `n/nn`, 7 `n/nn` | `["ú","dd","zz","nn","n","ů","nn","nn"]` | `{7:"n"}`, `{1:"d"}` → `zdvojene-chybi`; `{4:"nn"}` → `zdvojene-navic`; `{0:"ů"}` → `u-krouzek-za-carku`; ostatní obecná | R55. „U slov s mezerou u n řekni, od čeho jsou. Končí základní slovo na n? Začíná přípona na n?“ |

**Kontrola pro vás (kontrolní):** neúspěšném (ne- + úspěšný: ú) · oddíl (od- + díl) · rozzlobený (roz- + zlobit) · slunný · vlněnou (jedno n, přípona -ěný) · dům (ů uvnitř slova) · kamenného · cenný.

Poznámky k L37:
- *slunný* (od *slunce*, id=125 výslovně), *vlněný* (přípona *-ěný*, id=125 výslovně „vlna – vlněný“), *cenný* (id=125). *kamenný*: heslo *kamenný* (dělení ka-men-ný).
- U2 D: nabídka **neús\|pěch** místo osnovního *neú\|spěch*: *úspěch* má sám předponu *ú-* (ú-spěch), dělení neú\|spěch by tedy bylo obhajitelné jako hranice druhé předpony.
- *z loňska*, *domů*, *čepici* jsou jen vytištěné (nehodnotí se).

---

## LEKCE 38 — Předpony s-, z-, vz- a předložky s, z (`cj-t10-l38`) · poslech U3

`tema`: „Předpony s-, z-, vz- a předložky s, z“ · `tyden` 10, `poradi` 2 · rozcvička ze Z2 (2. × 7. pád).

**Cíl:** Dítě napíše předponu s- tam, kde něco jde dolů nebo dohromady (shodit, sjet, sbírat), z- tam, kde se něco mění (zežloutnout, zhnědnout), vz- tam, kde něco jde nahoru (vzlétnout), a předložku s u otázky s kým, čím? a z u otázky z čeho?

**Úvod pro rodiče:** Dnes se dítě učí psát s a z, která se sluchem rozlišit nedají: u předpony rozhoduje význam (dolů a dohromady × změna), u předložky pád (s kým × z čeho).

**Platí:** 1. `s- dolů, dohromady · z- změna` — co to je (28) · 2. `s kým? (7. p.) × z čeho? (2. p.)` — test (31) · 3. `smést · zčervenat · vztyčit` — příklad (27) *(korektor 4. 10.: shodit, zhnědnout, vzlétnout byly odpovědi U4 a U5)*

**Slovníček:** předpona, předpona s-, z-, vz-, předložka, 2. pád, 7. pád.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „V jakém pádě je tučné slovo?“ Měří Z2: 2. a 7. pád otázkou ze slova ve větě. | 4 kroky `dlazdice` se stejnou nabídkou 2. pád · 4. pád · 6. pád · 7. pád; popisky „Řada A“ …: **A)** Lucka šla do kina s **bratrem**. **B)** Tomáš vyšel z **domu**. **C)** Adam přišel ze **školy** pozdě. **D)** Ema hraje tenis se **sestrou**. | A 7. · B 2. · C 2. · D 7. | A, D: 4. pád → `pad-4-za-7`; ostatní obecná | „Zeptej se slovem z věty: šla do kina s kým, s čím?“ · Typická chyba: bratrem → 4. pád: „Šla s kým? Nebo vidím koho?“ |
| U2 nová (5) | „Doplň s, nebo z.“ Měří předložku podle pádu. | `doplnit_pismeno`, 6 mezer `["s","z"]`: „Tomáš jel na výlet _ tátou. Lucka vytáhla sešit _ batohu. Adam vynesl kolo _e sklepa. Ema mluvila _e spolužačkou. Klára vylezla _ bazénu. Honzík šel do kina _ Adamem.“ | `["s","z","z","s","z","s"]` | `{0:"z"}`, `{1:"s"}`, `{2:"s"}`, `{3:"z"}` → `s-z-predlozka-zamena`; mezery 4–5 obecná | „Zeptej se slovem z věty: jel na výlet s kým, nebo z čeho?“ · Typická chyba: z tátou, se sklepa → „S kým, nebo z čeho?“ |
| U3 nová, **poslech** (5) | „Poslechni si nahrávku. Pak odpověz na tři otázky.“ Měří předponu podle významu a předložku podle pádu tam, kde to sluchem poznat nejde. | `poslech` `audio/cestina/t10/l38-u3.mp3`, přepis „Lyžaři vyšli z chaty a sjeli do údolí. Listí na podzim zežloutlo.“, `max_prehrani: 0`; 3 kroky s vnořenými dlaždicemi s · z: **k1** otázka „Jak se píše začátek slova „_jeli“?“ · **k2** „Jak se píše krátké slovo před „chaty“?“ · **final** „Jak se píše začátek slova „_ežloutlo“?“ | k1 s · k2 z · final z | k1 z → `s-z-predpona-zamena` · k2 s → `s-z-predlozka-zamena` · final s → `s-z-predpona-zamena` | „Jeli lyžaři dolů, nebo se změnili? A listí: spadlo dolů, nebo se změnilo?“ |
| U4 detektiv (5) | Petr napsal: **Při úklidu Klára zhodila hrnek s čajem na zem.** Měří `s-z-predpona-zamena`; past předložka *s čajem*. | **k1** `klik_ve_textu`, max 1; tokeny: Při(0) úklidu(1) Klára(2) zhodila(3) hrnek(4) s(5) čajem(6) na(7) zem(8) · **final** `dlazdice` „Jak má to slovo správně začínat?“: s-: hrnek šel dolů · z-: hrnek se změnil · z: z čeho? (2. pád) | k1 `[3]` · final a | k1 `navic [0,1,2,4,5,6,7,8]` → `detektiv-jine-slovo` · final b, c → `detektiv-oprava-jine-chyby` | „U předpony se zeptej, co se při tom ději stane. U samostatného slova se zeptej pádovou otázkou.“ · Typická chyba: klikne na *s* → „Hrnek s čím, nebo z čeho?“ (Petr to má správně.) Nabídka kroku 2 mluví o předponách i o předložce. |
| U5 kontrolní (6) | „Doplň s, z, nebo vz.“ 4 předpony + 4 předložky. | `doplnit_pismeno`, 8 mezer: „Po tréninku jsme šli _ Luckou _ tělocvičny do parku. Adam tam pouštěl draka, který _létl vysoko k obloze. Tomáš _jel na kole až dolů k řece a vytáhl _ kapsy mobil. Listí na stromech už _hnědlo, tak jsme _bírali kaštany a hráli si _e psem.“ Nabídky `s/z`, mezera 2 `s/z/vz` | `["s","z","vz","s","z","z","s","s"]` | `{3:"z"}`, `{5:"s"}` → `s-z-predpona-zamena`; `{0:"z"}`, `{4:"s"}` → `s-z-predlozka-zamena`; ostatní obecná | R55. „U sloves se zeptej: jde to dolů, dohromady, nahoru, nebo se něco mění? U ostatních: s kým, nebo z čeho?“ |

**Kontrola pro vás (kontrolní):** s Luckou (s kým?) · z tělocvičny (z čeho?) · vzlétl (nahoru) · sjel (dolů) · z kapsy (z čeho?) · zhnědlo (změna barvy) · sbírali (dohromady) · se psem (s kým?).

Poznámky k L38:
- *vzlétnout*: příručka uvádí „jiné je: slétnout“; věta „Drak _létl vysoko k obloze“ připouští jen *vz-* (nahoru). Tvar *vzlétl* je v tabulce (vedle *vzlétnul*), hodnotí se jen předpona.
- *shodit*: heslo je, *zhodit* příručka nezná (nabízí *shodit*). *zhnědnout* (příčestí *zhnědl*), *zežloutnout* (*zežloutl*), *sjet* (*sjel*), *sbírat* (*sbíral*) ověřeny. Kontrolní dotazy na neexistenci *zjet, zbírat, shnědnout, sežloutnout* viz Ověření ÚJČ.
- Předložka *z* je všude „zevnitř / odněkud“ (*z batohu, ze sklepa, z bazénu, z tělocvičny, z chaty, z kapsy*), nikdy „z povrchu / po povrchu dolů“ (id=111: tam lze i *s* + 2. p., „silně zastaralé“, ale existuje). Korektor 4. 10.: autorovo *z kopce* (U3, U5) a *ze hřiště* (U2) je přesně tento případ (*s kopce* = po povrchu dolů), nahrazeno.
- Rozcvička má *ze školy* a *z domu*; v U2 a U5 jsem proto použil jiná slova (*ze sklepa, z tělocvičny*), aby rozcvička neprozradila mezeru.

---

## LEKCE 39 — bě/bje, vě/vje, pě, mě/mně (`cj-t10-l39`) · poslech U3

`tema`: „Skupiny bě/bje, vě/vje, mě/mně“ · `tyden` 10, `poradi` 3 · rozcvička z L37 (hranice předpony).

**Cíl:** Dítě napíše bje, vje jen tam, kde se potká předpona ob- nebo v- s částí na je- (objet, vjezd, objednat), jinak bě, vě, pě; mně tam, kde je v příbuzném slově mn nebo men (zapomněl, příjemně) a v tvaru mně (komu?), jinak mě (rozuměl, město, vidí mě).

**Úvod pro rodiče:** Dnes se dítě učí rozhodnout mezi bě a bje, vě a vje podle stavby slova a mezi mě a mně podle příbuzného slova nebo podle otázky.

**Platí:** 1. `bje, vje jen na švu: ob|jem, v|jet` — co to je (34) · 2. `mně, když je v příbuzném mn/men` — test (31) · 3. `vzpomněl (vzpomenout) × v zimě` — příklad (30) *(korektor 4. 10.: objet, vjezd, zapomněl, rozuměl byly odpovědi U1, U2, U3, U5)*

**Slovníček:** předpona, šev, příbuzné slovo, neurčitý tvar, mě/mně (tvary slova já).

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „Kde končí předpona?“ Měří L37: hranici předpony; *objet* připravuje dnešní učivo. | 4 kroky `dlazdice`, „Řada A“ …: **A** rozzářit: ro\|zzářit · roz\|zářit · rozz\|ářit **B** oddech: od\|dech · o\|ddech · odd\|ech **C** neúplný: n\|eúplný · neúp\|lný · ne\|úplný **D** objet: o\|bjet · ob\|jet · obj\|et | A b · B a · C c · D b | chybné → `stavba-hranice-zamena` | po řadách: „Odtrhni předponu na začátku. Jaké slovo zbude?“ |
| U2 nová (5) | „Doplň ě, nebo je. Nejdřív zkus slovo rozložit.“ Měří *je* jen na švu *ob-/v-* + *je-*. | `doplnit_pismeno`, 6 mezer `["ě","je"]`: „ob_vit poklad, b_hat po hřišti, pov_dět pravdu, v_zd do garáže, ob_dnat lístky, p_kný den“ | `["je","ě","ě","je","je","ě"]` | `{0:"ě"}`, `{3:"ě"}`, `{4:"ě"}` → `skupina-e-za-je`; `{2:"je"}` → `skupina-je-za-e`; mezery 1, 5 obecná | „Vezmi slovo před „do garáže“. Je na začátku předpona? Jak začíná zbytek slova?“ · Past: *povědět* má předponu *po-*, ne *v-*. |
| U3 nová, **poslech** (5) | „Poslechni si větu. Pak odpověz na dvě otázky.“ Měří *mně* podle neurčitého tvaru (mě/mně zní stejně). | `poslech` `audio/cestina/t10/l39-u3.mp3`, přepis „Tomáš zapomněl doma klíče.“, `max_prehrani: 0`; **k1** otázka „Jaký je neurčitý tvar slovesa, které říká, co Tomáš udělal?“: zapomínat · zapomenout · zapamatovat · **final** „Jak se píše sloveso, které říká, co Tomáš udělal?“: zapoměl · zapomněl | k1 zapomenout · final zapomněl | k1 zapomínat, zapamatovat obecná · final zapoměl → `skupina-me-za-mne` | „Řekni větu: Nesmím to … Jaké sloveso tam patří?“ · Otázky záměrně nepíšou tvar *zapomněl* (prozradil by krok 2). |
| U4 detektiv (5) | Petr napsal: **Adam oběvil při běhu v lese jeskyni.** Měří `skupina-e-za-je`; past *běhu* (bez předpony, bě). | **k1** `klik_ve_textu`, max 1; tokeny: Adam(0) oběvil(1) při(2) běhu(3) v(4) lese(5) jeskyni(6) · **final** `dlazdice` „Proč je to slovo špatně?“: Bez předpony patří bě, ne bje · Na švu ob- a je- patří je · Po b se píše vždy ě | k1 `[1]` · final b | k1 `navic [0,2,3,4,5,6]` → `detektiv-jine-slovo` · final a, c → `detektiv-oprava-jine-chyby` | „Najdi ve větě slova, ve kterých slyšíš bje. U každého zkus najít předponu.“ · Typická chyba: klikne na běhu → „Má běh předponu?“ |
| U5 kontrolní (6) | „Doplň chybějící písmena: ě, je, nebo ně.“ Celé L39 + 2× tvar slova *já*. | `doplnit_pismeno`, 8 mezer: „Lucka m_ pozvala na oslavu. Ob_dnala dort a u v_zdu do garáže pověsila balonky. Adam na dárek zapom_l, ale Lucka mu rozum_la. B_hem odpoledne zavolala: „Kláro, pojď ke m_!“ Bylo nám tam příjem_.“ Nabídky: 0 `ě/ně`, 1 `ě/je`, 2 `ě/je`, 3 `ě/ně`, 4 `ě/ně`, 5 `ě/je`, 6 `ě/ně`, 7 `ě/ně` | `["ě","je","je","ně","ě","ě","ně","ně"]` | `{1:"ě"}` → `skupina-e-za-je`; `{3:"ě"}` → `skupina-me-za-mne`; `{4:"ně"}` → `skupina-mne-za-me`; `{6:"ě"}` → `me-mne-zamena`; ostatní obecná | R55. „U slova já zkus dosadit tě, nebo tobě. U ostatních řekni příbuzné slovo: zapomenout, rozum, příjemný.“ |

**Kontrola pro vás (kontrolní):** mě (pozvala koho? = tě) · Objednala · vjezdu · zapomněl (zapomenout) · rozuměla (rozum) · Během (běh) · ke mně (k tobě) · příjemně (příjemný).

Poznámky k L39:
- id=126 výslovně: *objednat, objev, objevit, objetí (od objet), vjet, vjezd* s *je*; *běh, povědět, svět* s *ě*; po *p* vždy jen *ě*; *zapomněl, vzpomněl, rozumně* (mn/men v základu) × *rozumět, rozuměl, v zimě* (bez n).
- *zapomenout* má v příručce příčestí *zapomenul, zapomněl* (dubleta tvaru). Hodnotí se jen pravopis *mně* ve tvaru *zapomněl*, ne volba tvaru; *zapoměl* je chyba v každém případě.
- U3: osnova měla v nabídce *paměť* — vyřazeno, *paměť* je se *zapomenout* příbuzná (obojí od *pamatovat/pomnít*), byly by dvě obhajitelné odpovědi. Nabídka: zapomenout · zapomínat · zapamatovat; otázka se ptá na **neurčitý tvar** slovesa z věty (jediná správná odpověď).
- *mě* (pozvala koho?) a *mně* (ke komu?) jsou tvary zájmena *já* (T4 i T10, OSNOVA §2.2); *mě × mne* (dubleta) se nehodnotí, nabídka je jen `ě/ně`.
- *balonky* je jen vytištěné (*balonek* i *balónek* jsou správně, nehodnotí se).

---

## LEKCE 40 — Kontrola tématu: pravopis na švu (`cj-t10-l40`) · diktát

`tema`: „Kontrola tématu: pravopis na švu“ · `tyden` 10, `poradi` 4 · rozcvička z L37–L39 · U5 `tydenni: true` + `semafor_tydne`.

**Cíl:** Dítě v diktátu i v textu správně napíše jevy na švu slova (oddíl, cenný, objednal, shodila, zapomněla, neúspěch) a u každého řekne, z jakých částí slovo je.

**Úvod pro rodiče:** Dnes je kontrola celého tématu: dítě rozkládá slova na části a podle toho píše dvě stejná písmena, ú, bje a vje, mně a s/z; na konci píše diktát.

**Platí:** 1. `Rozlož slovo na části` — co to je (21) · 2. `Šev: od|dech, ob|jet, ne|úplný` — test (30) *(korektor 4. 10.: oddělit a neúspěch byly v U2, U3, U5)* · 3. `s- dolů · z- změna · z čeho?` — příklad (27)

**Slovníček:** předpona, kořen, přípona, šev, příbuzné slovo, diktát.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „V každé řadě vyber slovo, které je napsané správně.“ L37–L39. | 4 kroky `dlazdice`, „Řada A“ …: **A** slunný · sluný **B** sčervenat · zčervenat **C** vjezd · vězd **D** příjemě · příjemně | A slunný · B zčervenat · C vjezd · D příjemně | sluný → `zdvojene-chybi`; sčervenat → `s-z-predpona-zamena`; vězd → `skupina-e-za-je`; příjemě → `skupina-me-za-mne` | „Když někdo červená, jde něco dolů, nebo se mění barva?“ Otázky nepíšou správný tvar (v režimu „Dnes samo“ je čte dítě). |
| U2 nová (5) | „Která část slova je kořen?“ Měří části slova. | 4 kroky `dlazdice`: **A) přeskočit** pře · skoč · it · přeskoč **B) vyběhnout** vyběh · nout · běh · vy **C) oddělit** děl · od · odděl · it **D) uklidit** u · uklid · it · klid | A skoč · B běh · C děl · D klid | každá chybná → `stavba-cast-zamena` | „Vezmi slovo vyběhnout. Řekni dvě slova z jeho rodiny. Co mají všechna společné?“ |
| U3 nová (5) | „Doplň chybějící písmena.“ Mix tématu. | `doplnit_pismeno`, 6 mezer: „Ema _jela na lyžích až dolů k chatě a vytáhla _ batohu čaj. Po loňském ne_spěchu jí to letos šlo. Pod stromem ob_vila srnku a hned ji ukázala i m_. Byl to slu_ý den.“ Nabídky: `s/z`, `s/z`, `ú/ů`, `ě/je`, `ě/ně`, `n/nn` | `["s","z","ú","je","ně","nn"]` | `{0:"z"}` → `s-z-predpona-zamena`; `{3:"ě"}` → `skupina-e-za-je`; `{4:"ě"}` → `me-mne-zamena`; `{5:"n"}` → `zdvojene-chybi`; mezery 1, 2 obecná | „Vyber si mezeru. Je to předpona, krátké slovo před jménem, nebo šev uprostřed slova?“ |
| U4 detektiv (5) | Petr napsal: **Tomáš úplně zapoměl, že má trénink ve městě.** Měří `skupina-me-za-mne`; pasti *městě* (mě), *úplně* (ú, -ně). | **k1** `klik_ve_textu`, max 1; tokeny: Tomáš(0) úplně(1) zapoměl(2) že(3) má(4) trénink(5) ve(6) městě(7) · **final** `dlazdice` „Proč je to slovo špatně?“: V příbuzném slově n není, patří mě · Na začátku slova má být ů · V příbuzném slově je men, patří mně | k1 `[2]` · final c | k1 `navic [0,1,3,4,5,6,7]` → `detektiv-jine-slovo` · final a, b → `detektiv-oprava-jine-chyby` | „U každého z těch slov řekni příbuzné slovo. Sedí podle něj to, jak je slovo napsané?“ |
| U5 kontrolní **týdenní** (6) | „Nejdřív napiš čtyři věty, které uslyšíš. Pak doplň chybějící písmena v textu.“ | **k1** `diktat` (popisek „Diktát“), 4 věty, 17 slov, `max_prehrani: 2`, `hodnotit_interpunkci: false`, `hodnotit_velikost: false`, `spravne: null`: d1 „Táta objednal večeři.“ · d2 „Lucka zapomněla na trénink.“ · d3 „Ten oddíl má cenný pohár.“ · d4 „Klára shodila hrnek na zem.“ · **final** `doplnit_pismeno`, 10 mezer: „V sobotu jsme s Adamem a Klárou vyvedli kola _ garáže a _jeli na nich dolů k řece. U řeky jsme ob_vili starý kame_ý most. Adam zapom_l pití, a tak prosil: „Kláro, dej m_ napít.“ Listí na stromech už _hnědlo. U v_zdu do vesnice jsme potkali fotbalový o_díl, který se vracel po ne_spěšném zápase.“ Nabídky: `s/z`, `s/z`, `ě/je`, `n/nn`, `ě/ně`, `ě/ně`, `s/z`, `ě/je`, `d/dd`, `ú/ů` | k1 `null` · final `["z","s","je","nn","ně","ně","z","je","dd","ú"]` | k1 `chyby_ocekavane`: věta 0 slovo 1 *objednal* `skupina-e-za-je` · věta 1 slovo 1 *zapomněla* `skupina-me-za-mne` · věta 2 slovo 1 *oddíl* a slovo 3 *cenný* `zdvojene-chybi` · věta 3 slovo 1 *shodila* `s-z-predpona-zamena` · final: `{1:"z"}` `s-z-predpona-zamena`, `{2:"ě"}` `skupina-e-za-je`, `{4:"ě"}` `skupina-me-za-mne`, `{8:"d"}` `zdvojene-chybi` | `semafor_tydne` z `final` (10 mezer): zelená `min_spravne` 9 („9 nebo 10“), oranžová 7 („7 nebo 8“), červená 0 („6 a méně“) · R55 |

**Kontrola pro vás (týdenní):** z garáže (z čeho?) · sjeli (dolů) · objevili (ob- + jev) · kamenný · zapomněl (zapomenout) · dej mně (= tobě) · zhnědlo (změna) · vjezdu (v- + jezd) · oddíl (od- + díl) · neúspěšném (ne- + úspěšný).

Poznámky k L40:
- **Diktát slovo po slovu (OSNOVA §2.2):** *Táta* (Z5) · *objednal* (T10) · *večeři* (Z5: ři) · *Lucka* · *zapomněla* (T10) · *na* · *trénink* (Z5: ni) · *Ten* · *oddíl* (T10, *dí* Z5) · *má* · *cenný* (T10, *ný* Z5) · *pohár* · *Klára* · *shodila* (T10, *di* Z5) · *hrnek* · *na* · *zem*. Žádné *i/y* po obojetné souhlásce, slovesa jen v j. č. minulého času, *Honzík* ne.
- Rozcvička B: osnova měla *zničit*, nahrazeno *zčervenat × sčervenat* (viz Společné). *sčervenat* příručka nezná (viz Ověření ÚJČ).
- U2: kořeny *skoč* (skok, skočit), *běh*, *děl* (dělit, díl), *klid* — vybrána slovesa s průhlednou předponou a příponou, žádné sporné členění (*zčervenat* s kořenem *červ-/červen-* vyřazeno).

---

## Nahrávky (pro AUDIO.md)

Podle pravidel `AUDIO.md` (hlas Jana, Eleven v4, `[calm, slow, clear] `, tempo 0,9 přes ffmpeg, 0,5 s ticha). Poslech 1 nahrávka na úlohu (všechny kroky úlohy ji sdílejí). Diktát: každá věta samostatný soubor, 2× (celá věta, pauza 2 s, pomalu po slovech 0,75× s pauzou 0,7 s), interpunkce se nediktuje; vlastní jména se hlásí „velké písmeno — …“ (ZADANI-OSMA §8 bod 7).

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t10/l38-u3.mp3` | 38 / úloha 3 (`k1`, `k2`, `final`) | poslech | Lyžaři vyšli z chaty a sjeli do údolí. Listí na podzim zežloutlo. | Nic nezdůrazňovat, „sjeli“ i „z chaty“ vyslovit přirozeně (spodoba je v pořádku, dítě rozhoduje podle pravidla); pauza mezi větami asi 0,7 s; cca 5 s | čeká |
| `t10/l39-u3.mp3` | 39 / úloha 3 (`k1`, `final`) | poslech | Tomáš zapomněl doma klíče. | Nezdůrazňovat „zapomněl“, přirozeně [zapomňel]; cca 3 s | čeká |
| `t10/l40-d1.mp3` | 40 / úloha 5, `k1`, věta 1 | diktát | Táta objednal večeři. | 2× podle AUDIO.md; „objednal“ přirozeně [objednal], nepřehánět j | čeká |
| `t10/l40-d2.mp3` | 40 / úloha 5, `k1`, věta 2 | diktát | Lucka zapomněla na trénink. | 2× podle AUDIO.md; před jménem hlásit „velké písmeno — Lucka“ | čeká |
| `t10/l40-d3.mp3` | 40 / úloha 5, `k1`, věta 3 | diktát | Ten oddíl má cenný pohár. | 2× podle AUDIO.md; „oddíl“ a „cenný“ vyslovit přirozeně, **ne** se zdvojenou souhláskou (prozradilo by to pravopis) | čeká |
| `t10/l40-d4.mp3` | 40 / úloha 5, `k1`, věta 4 | diktát | Klára shodila hrnek na zem. | 2× podle AUDIO.md; před jménem hlásit „velké písmeno — Klára“; „shodila“ přirozeně [schoďila] | čeká |

Celkem **6 nahrávek** (2 poslechy, 4 věty diktátu). Žádný poslech nepřesahuje 20 s.

---

## Ověření ÚJČ

Ověřeno 1.–2. 10. 2026 přes `bash nastroje/ujc.sh` (tabulka tvarů / výklad). Odkazy jsou v `kontrola.zdroj` příslušné lekce.

| heslo / výklad | kde | co se ověřovalo | výsledek | odkaz |
|---|---|---|---|---|
| id=125 Psaní n – nn | L37, L40 | dvě n: *cena – cenný, slunce – slunný, den – denní, stín – stinný*; jedno n: *vlna – vlněný, hlína – hliněný* (přípona *-ěný*) | OK | https://prirucka.ujc.cas.cz/?id=125 |
| id=126 Písmeno ě | L39, L40 | *je* po *ob-/v-* + *je-*: *objednat, objev, objevit, objetí (od objet), vjet, vjezd*; *ě*: *běh, povědět, svět*, po *p* vždy *ě*; *mně*: *zapomněl, vzpomněl, rozumně* × *mě*: *rozumět, rozuměl, v zimě, město* | OK | https://prirucka.ujc.cas.cz/?id=126 |
| id=127 Psaní ú – ů | L37, L40 | *ú* po předponě (*ne-úspěch, ne-únavný*), *ů* v kořeni (*dům*) a v *domů* | OK | https://prirucka.ujc.cas.cz/?id=127 |
| id=110 Předpony s-, z- | L38, L40 | *s-* dohromady / dolů (*sjednotit, sklopit, smést*), zánik *s-* (*shořet*); *z-* bez těchto významů, změna stavu; dvojice s významovým rozdílem a slovesa s oběma podobami vynechána | OK | https://prirucka.ujc.cas.cz/?id=110 |
| id=111 Předložky s, z | L38, L40 | *z* + 2. p., *s* + 7. p.; *s* + 2. p. „z povrchu“ silně zastaralé → nepoužito | OK | https://prirucka.ujc.cas.cz/?id=111 |
| id=650 Tvary zájmena já | L39, L40 | *mně* 3. a 6. p., *mě* (i *mne*) 2. a 4. p. | viz Nejistoty | https://prirucka.ujc.cas.cz/?id=650 |
| les, lesník, zalesnit, lesklý | L37 U1 | *lesklý* je od *lesknout se* (SSČ), ostatní od *les* | OK | ?slovo=les, lesník, zalesnit, lesklý |
| hora, horský, horal, hořet | L37 U1 | *horský* „od slova: hora“, *horal* „kdo v horách bydlí“, *hořet* „být stravován ohněm“ | OK | ?slovo=hora, horský, horal, hořet |
| cena, cenný, ocenit, cesta | L37 U1 | *ocenit* „určit cenu“ | OK | ?slovo=cena, cenný, ocenit, cesta |
| kámen, kamenný, kamenitý, kamarád | L37 U1, U3, U5 | *kamenný* (ka-men-ný), *kamenitý* „plný kamení“ | OK | ?slovo=kámen, kamenný, kamenitý, kamarád |
| oddělit | L37 U2; L40 U2 | dělení od-dě-lit | OK | https://prirucka.ujc.cas.cz/?slovo=odd%C4%9Blit |
| rozzlobit, rozzlobený | L37 U2, U5 | roz-zlo-bit, roz-zlo-be-ný | OK | ?slovo=rozzlobit, rozzlobený |
| bezzubý | L37 U2 | bez-zubý | OK | https://prirucka.ujc.cas.cz/?slovo=bezzub%C3%BD |
| neúspěch, neúspěšný | L37 U2, U3, U5; L40 U3, U5 | heslo s *ú* | OK | ?slovo=neúspěch, neúspěšný |
| slunný | L37 U3, U5; L40 U1, U3 | slun-ný, „od slova: slunce“ | OK | https://prirucka.ujc.cas.cz/?slovo=slunn%C3%BD |
| vlněný | L37 U3, U5 | vl-ně-ný | OK | https://prirucka.ujc.cas.cz/?slovo=vln%C4%9Bn%C3%BD |
| dům | L37 U3, U5 | *dům* 1./4. p. j. č. | OK | https://prirucka.ujc.cas.cz/?slovo=d%C5%AFm |
| oddíl | L37 U4, U5; L40 U5 | od-díl, *oddíl* 1./4. p. | OK | https://prirucka.ujc.cas.cz/?slovo=odd%C3%ADl |
| cenný | L37 U3–U5; L40 U5 | cen-ný | OK | https://prirucka.ujc.cas.cz/?slovo=cenn%C3%BD |
| bratr, dům, škola, sestra | L38 U1 | *bratrem* 7. j., *domu* 2. j., *školy* 2. j., *sestrou* 7. j. | OK | ?slovo=bratr, dům, škola, sestra |
| batoh, bazén, sklep, tělocvična, pes | L38 U2, U5 | *batohu, bazénu* 2. j., *sklepa* 2. j. (i *sklepu*, hodnotí se jen předložka), *psem* 7. j. | OK | ?slovo=batoh, bazén, sklep, pes |
| sjet | L38 U3, U5; L40 U3, U5 | heslo, příčestí *sjel* | OK | https://prirucka.ujc.cas.cz/?slovo=sjet |
| kopec | — | **korektor 4. 10.: vyřazeno** — *z kopce × s kopce* je „po povrchu dolů“, id=111 připouští i *s* + 2. p. (OSNOVA §14 hranice: nehodnotit *se stolu × ze stolu*) | vyřazeno | https://prirucka.ujc.cas.cz/?id=111 |
| zežloutnout | L38 U3 | ze-žlout-nout, příčestí *zežloutl* | OK | https://prirucka.ujc.cas.cz/?slovo=ze%C5%BEloutnout |
| shodit / zhodit | L38 U4; L40 U5 | *shodit* heslo; *zhodit* „nebylo nalezeno; možná jste měli na mysli: shodit“ | OK | https://prirucka.ujc.cas.cz/?slovo=shodit |
| úklid, čaj | L38 U4 | *úklidu* 2. j., *čajem* 7. j. (příklad „čaj s citronem“) | OK | ?slovo=úklid, čaj |
| vzlétnout | L38 U5 | příčestí *vzlétl, vzlétnul*; „jiné je: slétnout“ | OK | https://prirucka.ujc.cas.cz/?slovo=vzl%C3%A9tnout |
| zhnědnout | L38 U5; L40 U5 | zhněd-nout, příčestí *zhnědl* | OK | https://prirucka.ujc.cas.cz/?slovo=zhn%C4%9Bdnout |
| sbírat | L38 U5 | sbí-rat, příčestí *sbíral* | OK | https://prirucka.ujc.cas.cz/?slovo=sb%C3%ADrat |
| objet | L39 U1 | ob-jet (lze i *obejet*) | OK | https://prirucka.ujc.cas.cz/?slovo=objet |
| neúplný | L39 U1 | ne-úpl-ný | OK | https://prirucka.ujc.cas.cz/?slovo=ne%C3%BApln%C3%BD |
| objevit, objednat, vjezd | L39 U2, U4, U5; L40 U1, U3, U5 | ob-je-vit (*objevil*), ob-jed-nat (*objednal*), *vjezdu* 2. j. | OK | ?slovo=objevit, objednat, vjezd |
| běhat, povědět, pěkný | L39 U2 | bě-hat, po-vě-dět, pěk-ný | OK | ?slovo=běhat, povědět, pěkný |
| zapomenout | L39 U3, U5; L40 U4, U5 | příčestí *zapomenul, zapomněl* | OK (dubleta tvaru, hodnotí se jen *mně*) | https://prirucka.ujc.cas.cz/?slovo=zapomenout |
| zapomínat, zapamatovat (si) | L39 U3 | samostatná hesla, příčestí *zapomínal, zapamatoval si* | OK | ?slovo=zapomínat, zapamatovat |
| rozumět | L39 U5 | příčestí *rozuměl(a)* | OK | https://prirucka.ujc.cas.cz/?slovo=rozum%C4%9Bt |
| **Korektor 4. 10. (nově ověřeno)** | | | | |
| id=111 znovu | L38, L40 | *z* + 2. p.; „z povrchu pryč / po povrchu dolů“ lze i *s* + 2. p. (*vzít se stolu*, „silně zastaralé“) → *z kopce, ze hřiště* vyřazeny z hodnocených míst | sporné → nahrazeno | https://prirucka.ujc.cas.cz/?id=111 |
| chata, kapsa, sklep, garáž, údolí | L38 U3, U5, U2; L40 U3, U5 | *chaty, kapsy, garáže* 2. j., *sklepa* 2. j. (i *sklepu*), *údolí*; *z* = zevnitř | OK | ?slovo=chata, kapsa, sklep, garáž, údolí |
| zjet, zbírat, shnědnout, sežloutnout, sčervenat | L38, L40 | „nebylo nalezeno; možná jste měli na mysli: sjet / sbírat / zhnědnout / zežloutnout / zčervenat“ | OK (jediná podoba) | ?slovo=sjet, sbírat, zhnědnout, zežloutnout, zčervenat |
| vzlétnout | L38 U5 | „lze i: vzletět, vzlítnout; jiné je: slétnout“ — *slétl vysoko k obloze* nedává smysl, hodnotí se jen předpona | OK | https://prirucka.ujc.cas.cz/?slovo=vzl%C3%A9tnout |
| smést, vztyčit, zčervenat | L38 Platí | *smést* v id=110 („shora dolů“), *vztyčit* vzty-čit, *zčervenat* zčer-ve-nat | OK | ?slovo=smést, vztyčit, zčervenat |
| oddech, neúnavný, denní, stinný | L37 Platí, L40 Platí | od-dech (lze i *oddych*), ne-únav-ný, den-ní, stin-ný | OK | ?slovo=oddech, neúnavný, denní, stinný |
| objem, vjet, vzpomenout | L39 Platí | id=126 výslovně: *objem, vjet*; *vzpomněl* (od *vzpomenout*) | OK | https://prirucka.ujc.cas.cz/?id=126 |
| zapomenout | L39 U3, U5; L40 U4, U5 | příčestí *zapomenul, zapomněl* — nabídky obsahují jen *zapoměl × zapomněl*, nahrávka čte *zapomněl(a)* | OK | https://prirucka.ujc.cas.cz/?slovo=zapomenout |
| večeře, trénink, pohár, hrnek, zem | L40 diktát | *večeři* 4. j., *trénink*, *pohár*, *hrnek*; *zem* (lze i *země*, nahrávka čte *na zem*) | OK | ?slovo=večeře, trénink, pohár, hrnek, zem |

Další hesla (L39 U4, U5 a L40) a kontrolní dotazy na neexistující podoby jsou v oddílu Nejistoty se stavem ověření.

---

## Nejistoty

Počet **[OVĚŘIT]: 0** (korektor 4. 10. 2026: všechny hodnocené tvary znovu ověřeny přes `nastroje/ujc.sh`).

| heslo | kde | co | stav |
|---|---|---|---|
| *z kopce / s kopce*, *ze hřiště* | L38 U3, U5, U2; L40 U3, U5; L38 U4 oranžová | „po povrchu dolů / z povrchu pryč“: id=111 připouští i *s* + 2. p. (OSNOVA §14, §16: nehodnotit) | **opraveno korektorem**: *z chaty, z kapsy, z batohu, z garáže, ze sklepa* |
| *sklep* 2. p. *sklepa / sklepu* | L38 U2 | dubleta tvaru jména, hodnotí se jen předložka *ze* | OK |
| *zapomenul / zapomněl* | L39 U3, L40 | dubleta příčestí, nabídka jen *zapoměl × zapomněl* | OK |

**Korektor 4. 10. 2026 — další opravy (texty):** Platí ve všech 4 lekcích obsahovalo odpovědi úloh (vyměněny příklady, viz řádky Platí). Otázky taháku, které v režimu „Dnes samo“ prozrazovaly odpověď (psaly hledaný tvar: *kamenný, vlněný, neúspěch, vjezd, povědět*; prozrazovaly předpony v L37 U2 a L39 U1) nebo ukazovaly na chybné slovo detektiva (L37, L38, L39, L40 U4 otázka 3), přepsány. Poslech L38 má nový text (nahrávka ještě nevznikla).

---

## Poznámky pro vedoucího

1. **Schéma odmítá nahrávky tématu 10 (a 9).** `obsah/schema.json` má u `vstup.audio` i `vety[].audio` vzor `^audio/cestina/t[1-8]/l[0-9]+-…\.mp3$` (zbytek ze Spolu, 8 týdnů). Cesta `audio/cestina/t10/l38-u3.mp3` (ZADANI-OSMA §5: `web/audio/cestina/t<t>/…`) proto hlásí chybu schématu v L38, L39 a L40. Návrh: vzor `t([1-9]|10)`. Souboru jsem se nedotkl (není můj). S opraveným vzorem (zkoušeno v paměti) projdou všechny 4 lekce validátorem bez chyb a bez varování, kromě chybějících řádků v `AUDIO.md`.
2. **Řádky do `AUDIO.md`:** 6 řádků výše (2 poslechy, 4 věty diktátu). Do sloučení validátor hlásí „nahrávka nemá řádek v AUDIO.md“ (L38 3×, L39 2×, L40 4×).
3. **`nastroje/ujc.sh` ukládá do cache i stránku „server je přetížen“** (kontroluje jen, že odpověď není prázdná). Při souběhu více autorů se tak do `/tmp/ujc-cache` dostaly desítky neplatných záznamů (v době psaní 76). Své jsem smazal a dotázal znovu. Návrh: ve skriptu odmítnout odpověď obsahující „server je přetížen“ / „is still evaluated“ a zkusit znovu.
4. **Odchylky od osnovy** (vše v duchu §14, jev se nemění):
   - L37 U3 rozdělena na 2 kroky (k1 n/nn, final ú/ů), aby každá chyba měla kód (limit 4 známé chyby na krok).
   - L37 U2 D: *neús\|pěch* místo *neú\|spěch* (viz poznámka u L37).
   - L38 Platí a L40 U1: *zničit* nahrazeno (*zhnědnout*, *zčervenat*), viz Společné.
   - L39 U3: nabídka bez *paměť* (příbuzné se *zapomenout*), otázka na neurčitý tvar.
   - L39 U2: *pěkný* místo *svět* (aby byl v lekci i *pě* z názvu); L39 U5 bez *pě* (osnova ho tam nevyžaduje výslovně, je v U2).
   - Detektiv: druhý krok všude s obecnými důvody (neprozradí slovo z kroku 1), u L38 nabídka o předponách i o předložce.
5. **Nové kódy:** žádné. Všechny kódy z `TYPY-CHYB.md`.
6. **Tisk doplňovaček:** FORMAT-CJ §6 dělá z každého `_` linku na jedno písmeno. V tématu 10 se do jedné mezery píše i dvojice (*nn, dd, zz, je, ně, vz*), protože v aplikaci je to jedna volba. Na papíře tedy dítě napíše dvě písmena na jednu krátkou linku. Pokud to bude v tisku těsné, návrh pro `web/js/tisk-cj.js`: linku dělat podle nejdelší možnosti mezery (`max(moznosti.length)`). Obsah lekcí jsem kvůli tomu neměnil (text tisku = `vstup.text`).
7. **Semafor týdne L40:** prahy 9 / 7 / 0 z 10 (~90 % / ~70 %, ZADANI-OSMA §8 bod 9). `doporuceni` u zelené: „Téma je hotové: pokračujte další lekcí v doporučeném pořadí.“ (téma 10 je poslední v pořadí osnovy).
