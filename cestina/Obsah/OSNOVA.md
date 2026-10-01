# Osnova: Spolu 8 — Čeština. 10 témat × 4 lekce + diagnostika

Verze 0.1 (NÁVRH k potvrzení vedoucím), 1. 10. 2026. Autor: metodik ČJ Spolu 8.
**Pro:** vedoucího projektu (schválení, §19 otázky), autory rozpisů a lekcí (`obsah/cestina/lekce/cj-t<t>-l<n>.json`), jazykového korektora (tvary [OVĚŘIT]), autora diagnostiky (`cj-t0-diag`), autora nahrávek (`AUDIO.md`).
**Závazné vstupy:** `ZADANI-OSMA.md`, `cestina/Obsah/FORMAT-CJ.md` (s rozdílem Spolu 8: 5 úloh), `TYPY-CHYB.md` v1.1, `TERMINOLOGIE.md`, `AUDIO.md`.

Obsah: §1 změny proti návrhu témat · §2 zásada „každé téma stojí samo“ · §3 společná pravidla lekce · §4 přehled · §5–§14 témata 1–10 po lekcích · §15 diagnostika · §16 vyřazené sporné jevy · §17 návrh nových kódů · §18 nahrávky (návrh) · §19 otázky pro vedoucího.

Odkazy do příručky ÚJČ jsou ověřené 1. 10. 2026 přes `nastroje/ujc.sh` (čísla výkladů podle skutečné adresy `?id=`; pozor, `TERMINOLOGIE.md` §3 má id=600 jako „shodu s podmětem jednoduchým“ správně, výklad o několikanásobném podmětu je id=601, složitější případy id=602). Tvary označené [OVĚŘIT] ověří korektor při rozpisu lekce; v diagnostice (§15) je ověřené všechno.

---

## 1. Změny proti návrhu témat (a proč)

| # | Změna | Proč |
|---|---|---|
| 1 | **T2 neučí pády.** Rod, číslo a pádové otázky jsou ve *společném základu* (§2.1); T2 má na tři učební lekce vzory (všech 14) a koncovky *i/y*. Rozcvička L5 pády opakuje. | Pády potřebuje T3, T4, T8 a T10 (*s* + 7. p.). Kdyby patřily jen do T2, nestálo by po přeskupení diagnostikou žádné z těch témat samo. Osmák pády má ze 4. třídy. |
| 2 | **T4:** L13 druhy zájmen + vztažné *jenž*, L14 tvary *já, on, ona* (*mě/mně, ji/jí, něho*), L15 číslovky (druhy, *dva, oba, tři, čtyři*). *jenž* jen v 1. p. j. č. (*jenž × jež*). | Druhy zájmen a *jenž* (vztažné zájmeno) patří k sobě, tvary *já/on* jsou pravopis. 1. p. mn. *již* je podle SSČ knižní a SSJČ uvádí i *králové, jenž vládli* → dubleta, vyřazeno. |
| 3 | **T5:** podmiňovací způsob jen přítomný; minulý (*byl bych přišel*) vypuštěn. | V řeči dětí ho skoro není, pravopisně nic nepřináší. Čas dostane *bychom/byste* a *budu + nedokonavé*. |
| 4 | **T7** bez přísudku před několikanásobným podmětem, bez *táta s mámou*, bez *my/vy* bez jasného rodu, bez oslovení v mn. č. | ÚJČ id=601 a 602: v těchto případech je správná dvojí shoda → zásada „obojí správně → nehodnotit“. |
| 5 | **T8** jen podmět, přísudek (slovesný, jmenný se sponou), předmět, příslovečné určení místa, času, způsobu, příčiny, přívlastek shodný a neshodný. Bez doplňku, přístavku, PU míry/účelu/podmínky. | Doplněk a přístavek jsou učivo 8. ročníku. Míra a účel mají v učebnicích nejednotné hranice (*velmi rychle*, *jde k lékaři*). |
| 6 | **T9** bez druhů vedlejších vět a poměrů mezi větami; v úlohách na počet vět nikdy několikanásobný přísudek se společným podmětem (*skákal a smál se*). | ZADANI §4 (ne rozbory souvětí 9. ročníku). ÚJČ id=151: na několikanásobný přísudek „jsou v české mluvnické tradici rozdílné názory (někdy se … považuje za samostatné věty)“. Pozor: OSNOVA Spolu (základy) L29 má příklad *Přišel a sedl si → 2 věty* — do Spolu 8 ho nepřebírat. |
| 7 | **T10 = „Stavba slova a pravopis na švu“:** L37 stavba slova + zdvojené souhlásky + *ú* po předponě, L38 *s-/z-/vz-* a předložky *s/z*, L39 *bě/bje, vě/vje, pě, mě/mně*. **Vypuštěna velká písmena a synonyma/antonyma.** | Všechny jevy L37–L39 stojí na jednom testu „rozlož slovo na části / najdi příbuzné slovo“ (ÚJČ id=125, 126, 127, 110). Velká písmena: ÚJČ id=191 uvádí řadu podob „s velkým i malým písmenem“ (*K/květnová revoluce, P/pražské povstání*) a podob podle významu (*Nový rok* × *nový rok*); jevů je na celé téma, do jedné lekce by se nevešly bez sporných případů a žádné jiné téma je nepotřebuje. Synonyma/antonyma nejsou mluvnice ani pravopis (ZADANI úkolu) a nejdou hodnotit bez dublet (víc správných synonym). Náhrada v §19 otázka 1. |
| 8 | **Kapitoly:** znovu použité `slovni-druhy`, `podstatna-jmena`, `slovesa`, `vyjmenovana-slova`, `souveti`; nové `pridavna-jmena`, `zajmena-cislovky`, `shoda`, `vetne-cleny`, `pravopis` (+ `diagnostika` pro `cj-t0-diag`). | Validátor zná jen kódy v `obsah/hlasky.md` (Názvy kapitol), nové je třeba doplnit, jinak varování. `podmet-prisudek` a `vzory` nepoužívám: T7 je celá shoda, T8 všechny větné členy, vzory jsou v `podstatna-jmena`. |

---

## 2. Zásada: každé téma stojí samo

Témata jdou v doporučeném pořadí, ale diagnostika (§15) ho může změnit a lekce nejsou zamčené. Proto žádné téma nesmí hodnotit jev jiného tématu.

### 2.1 Společný základ (Z) — smí být v každém tématu, i v hodnoceném místě
Učivo 1. stupně a začátku 6. ročníku, které osmák má. Rozcvička 1. lekce tématu bere jen odsud.
- **Z1** poznat podstatné jméno (*ten, ta, to*), přídavné jméno (*jaký?*), sloveso (*on ___*) — základní test, bez pastí na další druhy.
- **Z2** rod a číslo podstatného jména podle *ten/ta/to*, pádové otázky 1–7 a pád jména ve větě.
- **Z3** u slovesa osoba, číslo a čas (přítomný, minulý, budoucí) v jasných tvarech (*píše, psal, bude psát*), infinitiv.
- **Z4** v jednoduché větě najít přísudek (sloveso) a podmět (*kdo, co?*) — bez nevyjádřeného a několikanásobného podmětu, bez jmenného přísudku.
- **Z5** pravopis 1. stupně: tvrdé a měkké souhlásky (*hy, chy, ky, ry, dy, ty, ny* × *ži, ši, či, ři, ci, ji, di, ti, ni*), *dě, tě, ně*, *bě, pě, vě* bez předpony (*běh, pět, věc*), párové souhlásky, *ú* na začátku slova a *ů* uvnitř a v koncovkách (*úkol, dům, bratrům*), tvary slovesa *být* (*byl, byla, by, bych*), velké písmeno na začátku věty a u jmen osob.

### 2.2 Co se mimo své téma nikdy nehodnotí
V mezeře, ve výběru tvaru, v otázce k poslechu ani v diktátu jiného tématu nesmí být:

| jev | patří do |
|---|---|
| určování slovního druhu nad rámec Z1 (zájmena, číslovky, neohebné druhy, *kolem*, *večer*) | T1 |
| *i/y* v koncovce podstatného jména po *b, f, l, m, p, s, v, z* (*s kamarády, u stodoly, se stroji*) | T2 |
| *-ý/-í*, *-ovi/-ovy* přídavných jmen (*malí, Tomášovy*), stupňování | T3 |
| *mě/mně, ji/jí, jeho/něho, jenž/jež*, tvary *dva, oba, tři, čtyři* | T4 (*mě/mně* i T10) |
| způsob, vid, rod slovesa, *bychom/byste*, *budu + dokonavé* | T5 |
| *i/í/y/ý* po *b, f, l, m, p, s, v, z* v kořeni i v příponě (*bydlí, píše, zima, koupil, klíč*), kromě tvarů *být* | T6 |
| příčestí v množném čísle (*hráli/hrály, byli pozváni*) | T7 |
| větné členy nad rámec Z4 | T8 |
| čárka | T9 |
| předpony a předložky *s/z/vz*, *bje/vje*, *mně* v kořeni, *nn/dd*, *ú* po předponě | T10 |

Text **kolem** hodnocených míst (vytištěná věta, nabídka dlaždic, přepis poslechu) může obsahovat cokoli správně napsaného — jen se to nehodnotí.

**Pravidlo pro diktát (autor ho kontroluje slovo po slově):** v diktátu tématu X je každé slovo buď jevem tématu X, nebo jen ze Z5. Prakticky mimo T6 žádné *i/í/y/ý* po obojetné souhlásce v kořeni ani v příponě (pozor na *píše, vím, klíč, čepice, koupil, Honzík*), mimo T2/T3/T7 žádné *i/y* po obojetné souhlásce v koncovce, slovesa v přítomném čase nebo v jednotném čísle minulého času (mimo T7), bez předložek *s, z, se, ze* (mimo T10), bez *mě/mně* (mimo T4 a T10). Jména: *Tomáš, Lucka, Klára, Adam, Ema* (ne *Honzík* mimo T6).

### 2.3 Rozcvička a návaznost
- **L1 tématu** (lekce 1, 5, 9, … 37): rozcvička jen ze společného základu Z, a to z toho jevu, na kterém téma stojí (pády před vzory, podmět před shodou). Nikdy z předchozího tématu.
- **L2–L4 tématu:** rozcvička z předchozích lekcí **téhož** tématu.
- Lekce *n* tématu smí použít jen Z + lekce 1 … *n*−1 téhož tématu + nové učivo lekce *n*.

---

## 3. Společná pravidla lekce Spolu 8

- **5 úloh:** U1 `rozcvicka` 4 min · U2 `nova` 5 · U3 `nova` 5 · U4 `detektiv` 5 · U5 `kontrolni` 6 → `cas_min: 25`. Id úloh `cj-t<t>-l<n>-U1` … `U5`, poslední krok každé úlohy `final`.
- **Lekce:** `id` `cj-t<t>-l<n>` (n 1–40 průběžně), `faze: "osma"`, `tyden` = číslo tématu 1–10, `poradi` 1–4 v tématu, `kapitola` podle tématu.
- **Role úloh:** U2 = nejjednodušší podoba pravidla; U3 = místo nejčastější chyby, nebo poslech; U4 detektiv má `k1` (najdi chybné slovo: `klik_ve_textu` max 1, nebo dlaždice) a `final` (proč / oprava: dlaždice, které neprozradí `k1` — nabídka obsahuje údaje ke všem slovům věty, ne jen k chybnému); U5 je těžší než U2–U3, ale nic nového.
- **L4 tématu (kontrola):** U5 `tydenni: true` + `semafor_tydne` (prahy u lekce, počítá se z `final`). Od T3: U5 `k1` = `diktat` (3–4 věty, ≤ 25 slov, `max_prehrani: 2`, `hodnotit_velikost: false`, `hodnotit_interpunkci: false` — kromě L36), `final` = jiný vstup. Semafor jen z `final` (jako Spolu L12).
- **Poslech** ve dvou lekcích každého tématu (§4). Poslech nikdy neověřuje to, co zní stejně (*i/y, mě/mně, s/z, nn, ú/ů, bě/bje*, čárku): nahrávka dá větu a smysl, rozhodnutí dítě udělá podle pravidla (význam dvojice, pád, podmět, počet vět). Ověřit sluchem jde jen to, co je slyšet (*ji × jí*, *bysme*, *třema*).
- **„Dnes samo“:** otázky 1–3 taháku jsou nápovědy pro dítě, proto přímá řeč k dítěti, bez rodu, bez odpovědi. Otázky k novým kódům v §17 tak napsané jsou.
- **Jména** Tomáš, Lucka, Honzík, Klára, Adam, Ema; detektiv vždy Petr (nikdy v 5. pádě). Oslovení jen *Tomáši, Kláro* (ověřeno ve Spolu); *Adame, Emo* [OVĚŘIT].
- **Indexy slov** v `klik_ve_textu` a `oznac_role` od 0, interpunkce se nepočítá (`vyhodnoceni-cj.js`). U větných členů (T8) se roli dává **plnovýznamovému slovu**, ne předložce (*o výletu* → role u *výletu*).

---

## 4. Přehled témat

| T | Téma | `kapitola` | Lekce | Poslech | Diktát (L4, U5 `k1`) | Rozcvička L1 z |
|---|---|---|---|---|---|---|
| 1 | Slovní druhy | `slovni-druhy` | 1–4 | L1, L3 | — | Z1 |
| 2 | Podstatná jména: vzory a koncovky | `podstatna-jmena` | 5–8 | L5, L6 | — | Z2 (pády) |
| 3 | Přídavná jména | `pridavna-jmena` | 9–12 | L9, L11 | L12 | Z1 |
| 4 | Zájmena a číslovky | `zajmena-cislovky` | 13–16 | L14, L15 | L16 | Z1 + čtení (za co stojí *on, ho*) |
| 5 | Slovesa: způsob, vid, rod | `slovesa` | 17–20 | L17, L18 | L20 | Z3 |
| 6 | Vyjmenovaná slova | `vyjmenovana-slova` | 21–24 | L21, L23 | L24 | Z5 (tvrdé/měkké) |
| 7 | Shoda přísudku s podmětem | `shoda` | 25–28 | L25, L27 | L28 | Z4 (podmět) |
| 8 | Větné členy | `vetne-cleny` | 29–32 | L30, L31 | L32 | Z4 |
| 9 | Souvětí a čárka | `souveti` | 33–36 | L33, L34 | L36 (hodnotí čárky) | Z4 (přísudek) |
| 10 | Stavba slova a pravopis na švu | `pravopis` | 37–40 | L38, L39 | L40 | Z5 (příbuzná slova) |

Celkem: 20 lekcí s poslechem (20 nahrávek), 8 diktátů (28 nahrávek), viz §18.

---

## 5. Téma 1 — Slovní druhy (`slovni-druhy`, lekce 1–4)

**Cíl tématu:** Dítě zařadí slovo do jednoho z deseti slovních druhů **testem** (ne podle toho, jak slovo vypadá), rozliší slova ohebná a neohebná a ví, že druh rozhoduje věta: *kolem domu* (předložka) × *jel kolem* (příslovce), *ten večer* (podstatné jméno) × *přišel večer* (příslovce).
**Hranice:** názvy druhů, ne čísla. Částice jen *kéž, ať* na začátku věty s přáním. Druh se **neurčuje** u *asi, snad, prý, bohužel, jen, i, se, si, by, jeden, pětka, stovka* a u stupňovaných tvarů ve větě s jiným druhem (§16) — u ohebnosti (ohebné/neohebné) smí být i *bohužel*.
**Hodnoty rolí:** `podstatné jméno`, `přídavné jméno`, `zájmeno`, `číslovka`, `sloveso`, `příslovce`, `předložka`, `spojka`, `částice`, `citoslovce`; `ohebné`, `neohebné`.
**Zdroje:** slovníková hesla (SSČ uvádí druh: *kolem* přísl. i předl. s 2. p.; *večer* m. neživ. i přísl.; *několik* čísl. neurč.; *včera, rychle* přísl.; *ale* sp. odpor.), TERMINOLOGIE §1.

### L1 · `cj-t1-l1` — Ohebné slovní druhy · poslech U3
**Cíl:** Dítě rozhodne, zda slovo mění tvar (ohebné), a ohebná slova zařadí do pěti druhů; nezamění zájmeno s podstatným jménem (*my*) ani s přídavným jménem (*můj*), číslovku řadovou s přídavným jménem (*pátý*).
**Platí:** `Ohebné slovo mění tvar: pes – psa` (pravidlo) · `Zkus: bez ___, k ___, já/on ___` (test) · `pátý = číslovka · můj = zájmeno` (příklad)

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z1: test podstatného jména, přídavného jména, slovesa | 4 kroky `dlazdice`, řady po 4 slovech („Řada A“…); A, B podstatné jméno, C sloveso, D přídavné jméno; v každé řadě past příslovce (*rychle, včera*) | `sd-pridavne-za-podstatne`, `sd-sloveso-za-podstatne`, `sd-prislovce-za-podstatne`, `sd-prislovce-za-pridavne` |
| U2 nová (5) | ohebné × neohebné | `dlazdice_vice`, 8 slov: *Tomáš, rychle, skočil, na, dva, náš, ale, vysoký* | správně *Tomáš, skočil, dva, náš, vysoký* · `navic: [rychle]` → **NÁVRH** `ohebnost-stupnovani`; `chybi: [dva]`, `chybi: [náš]` → obecná |
| U3 nová, **poslech** (5) | číslovka × přídavné jméno, zájmeno × podstatné jméno ve slyšené větě | `poslech` 1 věta ≈ 4 s (návrh „Pátý den tábora jsme my dva našli v lese tři houby.“); `k1` dlaždice „Jaký slovní druh je *pátý*?“, `final` totéž pro *my*; nabídka: podstatné jméno · přídavné jméno · zájmeno · číslovka | k1 číslovka · final zájmeno · k1 přídavné → `cislovka-za-pridavne`; final podstatné → `zajmeno-za-podstatne` |
| U4 detektiv (5) | `zajmeno-za-pridavne` | Petr: „Můj kamarád má dva psy.“ — *Můj* přídavné jméno, *kamarád* podstatné jméno, *dva* číslovka; `k1` `klik_ve_textu`; `final` „Jaký druh to slovo je?“: zájmeno · číslovka · sloveso · podstatné jméno | k1 *Můj* · final zájmeno · `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | 5 ohebných druhů v textu se pastmi | `oznac_role`, 2 věty, 6 slov, role 5 ohebných druhů (návrh: *Naše · třída · jela · třetí · několik · nových*) | *Naše* → přídavné `zajmeno-za-pridavne`; *třetí* → přídavné `cislovka-za-pridavne`; *několik* → zájmeno/přídavné `cislovka-jen-cislice` |

### L2 · `cj-t1-l2` — Neohebné slovní druhy
**Cíl:** Dítě rozliší pět neohebných druhů testem: příslovce (*jak? kde? kdy?* u slovesa), předložka (stojí před jménem), spojka (spojuje slova nebo věty), částice (přání na začátku věty: *kéž, ať*), citoslovce (zvuk, výkřik).
**Platí:** `Příslovce: jak? kde? kdy? (venku)` (pravidlo) · `Předložka stojí před jménem: na` (test) · `ale = spojka · kéž = částice` (příklad)

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L1: ohebné druhy | 4 kroky `dlazdice`: najdi zájmeno / číslovku / ohebné slovo / přídavné jméno (pasti *můj*, *pátý*) | `zajmeno-za-pridavne`, `cislovka-za-pridavne`, `ohebnost-stupnovani` (NÁVRH) |
| U2 nová (5) | 5 neohebných druhů | přiřazení: 4 kroky `dlazdice`, stejná nabídka (příslovce · předložka · spojka · částice · citoslovce), tučné slovo ve větě: *venku* (Pes čeká venku.), *pod* (Kočka spí pod stolem.), *ale* (Byla zima, ale svítilo slunce.), *Kéž* (Kéž by už byl pátek!) | A předložka → `prislovce-za-predlozku`; B příslovce → `predlozka-za-prislovce`; C částice, D spojka → `spojka-za-castici` |
| U3 nová (5) | stejné slovo, jiný druh (*kolem*) | 2 kroky `dlazdice` (příslovce · předložka): `k1` „Auto projelo *kolem*.“, `final` „Šli jsme *kolem* rybníka.“ | k1 příslovce · final předložka · `predlozka-za-prislovce`, `prislovce-za-predlozku` |
| U4 detektiv (5) | `sd-prislovce-za-pridavne` | Petr: „Honzík běžel rychle dolů, ale autobus mu ujel.“ — *rychle* přídavné jméno, *dolů* příslovce, *ale* spojka; `final` „Jaký druh to slovo je?“: příslovce · spojka · předložka · přídavné jméno | k1 *rychle* · final příslovce |
| U5 kontrolní (6) | neohebné druhy v textu | `oznac_role`, 6 slov, 5 neohebných rolí (návrh: „Hurá, zítra pojedeme k babičce! Kéž by bylo hezky a teplo.“ — *Hurá, zítra, k, Kéž, hezky, a*; *teplo* neoznačovat: přísl. i podst. jm.) | *Kéž* → spojka, *a* → částice: `spojka-za-castici`; *k* → příslovce: `predlozka-za-prislovce` |

### L3 · `cj-t1-l3` — Všech deset druhů: rozhoduje věta · poslech U2
**Cíl:** Dítě zařadí slovo do jednoho z deseti druhů podle toho, jak je ve větě použité (*kolem, večer*), a u každého řekne test, podle kterého to poznalo.
**Platí:** `Druh určuje věta, ne slovo samo` (pravidlo) · `Jde před to říct ten? Ptám se kdy?` (test) · `ten večer × přišel večer` (příklad)

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L2: neohebné druhy | 4 kroky `dlazdice` (věta s tučným slovem, nabídka 5 neohebných druhů): *dolů, na, nebo, au* | `prislovce-za-predlozku`, `predlozka-za-prislovce`, `spojka-za-castici` |
| U2 nová, **poslech** (5) | *večer* a *kolem* podle věty | `poslech` 1 věta (návrh „Večer jsme šli kolem rybníka a viděli tam dvě volavky.“); `k1` „Jaký druh je *večer*?“ (podstatné jméno · příslovce · předložka · číslovka), `final` totéž pro *kolem* | k1 příslovce → chyba podstatné `sd-prislovce-za-podstatne` · final předložka → chyba příslovce `prislovce-za-predlozku` |
| U3 nová (5) | 10 druhů v jedné větě | `oznac_role`, 6 slov, 10 rolí (návrh „Ten večer jsme s Tomášem dlouho hráli dvě hry.“ — *Ten, večer, s, dlouho, dvě, hry*) | *večer* → příslovce: **NÁVRH** `sd-podstatne-za-prislovce`; *Ten* → přídavné: `zajmeno-za-pridavne`; *dvě* → přídavné: `cislovka-za-pridavne` |
| U4 detektiv (5) | `sd-prislovce-za-podstatne` | Petr: „Klára přišla domů pozdě večer.“ — *večer* podstatné jméno, *domů* příslovce, *přišla* sloveso; `final` „Jaký druh to slovo je?“: příslovce · podstatné jméno · sloveso · předložka | k1 *večer* · final příslovce |
| U5 kontrolní (6) | 10 druhů v textu, všechny pasti tématu | `oznac_role`, 8 slov, 10 rolí, 2 věty (pasti: *kolem* předložka, *pátý*, *náš*, *ale*, *au*, *venku*) | kódy L1–L3 |

### L4 · `cj-t1-l4` — Kontrola tématu: slovní druhy (bez diktátu)
**Cíl:** Dítě v krátkém textu samo určí druh u deseti slov (každý druh jednou) a u neohebných slov řekne, proč se nemění.
**Platí:** `Ohebné: 5 druhů, neohebné: 5 druhů` · `Test: ten? jaký? on ___? kolik? kde?` · `kolem domu = předložka`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L1–L3 | 4 kroky `dlazdice`: ohebné?, druh *kolem*, druh *několik*, druh *ať* („Ať se ti daří!“) | `ohebnost-stupnovani`, `prislovce-za-predlozku`, `cislovka-jen-cislice`, `spojka-za-castici` |
| U2 nová (5) | neohebná slova v textu | `dlazdice_vice` „Vyber všechna neohebná slova“, 8 slov (pasti *rychle* stupňuje se, *dva* ohebné, *bohužel* neohebné) | `chybi: [rychle]` → `ohebnost-stupnovani`; `navic: [dva]` → obecná |
| U3 nová (5) | pasti tématu | přiřazení: 4 kroky `dlazdice`, nabídka 6 druhů: *náš, třetí, večer* („Přijdu večer.“), *ať* | `zajmeno-za-pridavne`, `cislovka-za-pridavne`, `sd-prislovce-za-podstatne`, `spojka-za-castici` |
| U4 detektiv (5) | `cislovka-jen-cislice` | Petr: „Na hřišti hrálo několik kluků.“ — *několik* zájmeno, *hřišti* podstatné jméno, *hrálo* sloveso; `final` nabídka: číslovka · zájmeno · podstatné jméno · sloveso | k1 *několik* · final číslovka |
| U5 kontrolní **týdenní** (6) | celé téma | `oznac_role`, 2–3 věty, 10 slov, 10 rolí (každý druh jednou); `tydenni: true` | `semafor_tydne`: zelená `min_spravne` 9 (9–10), oranžová 7 (7–8), červená 0 (≤ 6) · kódy L1–L3 |

---

## 6. Téma 2 — Podstatná jména: vzory a koncovky (`podstatna-jmena`, lekce 5–8)

**Cíl tématu:** Dítě u podstatného jména určí vzor (všech 14: *pán, hrad, muž, stroj, předseda, soudce; žena, růže, píseň, kost; město, moře, kuře, stavení*; u rodu mužského nejdřív životnost testem *vidím ___*) a podle vzoru doplní *i/y* v koncovce (*s kamarády → s pány → y*).
**Hranice:** pády a rod jsou Z2. **Nehodnotit:** 1. p. mn. *-i × -ové* (*soudci/soudcové, hokejisté/hokejisti*; ÚJČ id=226), 6. p. j. č. *-u × -e* (id=223), 3./6. p. *-ovi × -u* (id=225), slova kolísající mezi vzory (id=221, id=252), dvojné číslo (*rukama, očima*), *dni/dny*, *průvodce* ve významu kniha (živ. i neživ., ÚJČ heslo). V mezerách jen volba *i × y*, nikdy celé koncovky.
**Hodnoty rolí:** 14 vzorů jako výše; `životný`, `neživotný`.
**Zdroje:** hesla *předseda, soudce, kuře, kost, stodola, míč, kamarád, hokejista, dlaň, ulice* (tabulky tvarů ověřeny), id=222, 226.

### L5 · `cj-t2-l5` — Vzory rodu mužského (i předseda a soudce) · poslech U3
**Cíl:** Dítě rozhodne testem *vidím ___* o životnosti a podle 1. a 2. pádu přiřadí jméno rodu mužského k jednomu ze šesti vzorů, i když končí na *-a* (*hokejista*) nebo *-e* (*průvodce* — osoba).
**Platí:** `Životné: vidím pána, ne pán` · `2. p.: pána, hradu, muže, stroje` · `-a předseda · -e soudce`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z2: pád jména ve větě | 4 kroky `dlazdice` (věta s tučným jménem, nabídka 4 pádů), pasti 1. × 4. p. a 2. × 4. p. | `pad-1-za-4`, `pad-4-za-1`, `pad-2-za-4` |
| U2 nová (5) | 4 „matoucí“ mužská jména | přiřazení: 4 kroky `dlazdice`, nabídka 6 vzorů: *učitel* (muž), *pokoj* (stroj), *hokejista* (předseda), *průvodce* (soudce; ve větě jako osoba: „náš průvodce na výletě“) | `vzor-pan-za-muz`, `vzor-hrad-za-stroj`, `vzor-pan-za-predseda`, **NÁVRH** `vzor-zena-za-predseda`, `vzor-muz-za-soudce` |
| U3 nová, **poslech** (5) | vzor jména, které dítě slyší v jiném pádě (musí si ho samo vrátit do 1. pádu) | `poslech` 1 věta (návrh „Na hřišti jsem potkal souseda s dědou a jeho psem.“); `k1` „Ke kterému vzoru patří *dědou*?“ (pán · předseda · žena · hrad), `final` „… *souseda*?“ (pán · hrad · muž · předseda) | k1 předseda · final pán · k1 žena → `vzor-zena-za-predseda` (NÁVRH), k1 pán → `vzor-pan-za-predseda`; final hrad → obecná (soused není věc) |
| U4 detektiv (5) | `vzor-pan-za-predseda` | Petr: „Táta šel se strýcem na hokej.“ — *táta* pán, *strýcem* muž, *hokej* stroj; `final` „Jaký vzor má to slovo?“: předseda · muž · stroj · hrad | k1 *táta* · final předseda |
| U5 kontrolní (6) | 6 mužských vzorů v textu | `oznac_role` s kategoriemi `{zivotnost, vzor}`, 2 věty, 5 slov (pasti *kolega* předseda, *správce* soudce, *klíč* stroj, *koník* pán) | `vzor-*` kódy, `zivotnost-podle-vyznamu` (*strom*, *míč* → životný) |

### L6 · `cj-t2-l6` — Vzory rodu ženského a středního (i kuře a stavení) · poslech U3
**Cíl:** Dítě přiřadí jméno rodu ženského ke vzoru *žena, růže, píseň, kost* a rodu středního ke vzoru *město, moře, kuře, stavení* podle 1. a 2. pádu (*bez písně × bez kosti*, *bez kotěte*).
**Platí:** `Vzor podle 1. a 2. pádu (bez ___)` · `píseň – písně · kost – kosti` · `kotě – bez kotěte → kuře`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L5 | 4 kroky `dlazdice`, vzor mužských jmen (*hokejista, pokoj, učitel, soudce*) | `vzor-*` z L5 |
| U2 nová (5) | ženské vzory | přiřazení: 4 kroky `dlazdice`, nabídka 4 vzorů: *ulice* (růže), *radost* (kost), *dlaň* (píseň; ÚJČ: dlaně), *třída* (žena) | `vzor-ruze-za-pisen`, `vzor-pisen-za-kost`, `vzor-podle-1-padu` |
| U3 nová, **poslech** (5) | střední vzory ve slyšené větě | `poslech` 1 věta (návrh „Na náměstí si hrálo kotě s malým štěnětem.“); `k1` „Ke kterému vzoru patří *náměstí*?“, `final` „… *štěnětem*?“; nabídka město · moře · kuře · stavení | k1 stavení · final kuře · `vzor-more-za-staveni`, `vzor-more-za-kure` |
| U4 detektiv (5) | `vzor-more-za-kure` | Petr: „Kuře běhalo po hřišti u pole.“ — *Kuře* kuře, *hřišti* kuře (chyba), *pole* moře; `final` „Jaký vzor má to slovo?“: moře · kuře · město · stavení | k1 *hřišti* · final moře |
| U5 kontrolní (6) | 8 vzorů ženských a středních | `oznac_role`, 6 slov, role 8 vzorů, 2 věty | kódy L6 |

### L7 · `cj-t2-l7` — Koncovky i/y podle vzoru
**Cíl:** Dítě doplní *i/y* v koncovce podstatného jména po obojetné souhlásce tak, že určí vzor a řekne ho ve stejném pádě (*s kamarády → s pány → y*; *kamarádi → páni → i*).
**Platí:** `Nevím i/y? Dosadím vzor` · `s kamarády → s pány → y` · `kamarádi (1. p.) → páni → i`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L5–L6 | 4 kroky `dlazdice`, vzor (2 mužská, 1 ženské, 1 střední) | `vzor-*` |
| U2 nová (5) | dosazení vzoru | `doplnit_pismeno`, 3 věty, 6 mezer `["i","y"]`: *kamarád_* (1. p. mn.), *s kamarád_*, *u stodol_*, *s míč_*, *mezi strom_*, *s kostm_* | i, y, y, i, y, i · `koncovka-podst-i-za-y`, `koncovka-podst-y-za-i` |
| U3 nová (5) | místo nejčastější chyby: životná jména 1. p. mn. (*-i*) × 4. a 7. p. mn. (*-y*) | 4 kroky `doplnit_pismeno` po 1 mezeře, věty bez slovesa v minulém čase mn. č. (shoda by napověděla), např. „Na střeše sedí dva holub_.“ × „Vidím holub_.“ | `koncovka-podst-i-za-y`, `koncovka-podst-y-za-i`, `vzor-neurcen` |
| U4 detektiv (5) | `koncovka-podst-i-za-y` | Petr: „Honzík hrál fotbal s kamarádi.“ `k1` klik; `final` „Který vzor ve stejném tvaru Petrovi pomůže?“: s pány · páni · se stroji · s muži | k1 *kamarádi* · final „s pány“ |
| U5 kontrolní (6) | koncovky všech rodů | `doplnit_pismeno`, text 3–4 věty, 8 mezer | 8 kódů koncovek |

### L8 · `cj-t2-l8` — Kontrola tématu: podstatná jména (bez diktátu)
**Cíl:** Dítě u šesti jmen v textu určí vzor a v deseti koncovkách doplní *i/y* a u každé řekne vzor, který dosadilo.
**Platí:** `Vzor: rod + 1. a 2. pád` · `Dosadím vzor ve stejném pádě` · `u stodoly → u ženy → y`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L5–L7 | 4 kroky `dlazdice` (vzor, životnost, koncovka) | kódy L5–L7 |
| U2 nová (5) | vzory všech rodů | `oznac_role`, 6 slov, 14 rolí | `vzor-*` |
| U3 nová (5) | pasti koncovek | `doplnit_pismeno` 6 mezer (1. p. životných, 7. p. *stroj, kost*) | koncovkové kódy |
| U4 detektiv (5) | `vzor-ruze-za-pisen` | Petr určil vzory ve větě „V ulici stojí staré stavení.“: *ulici* píseň (chyba), *stavení* stavení; `final` „Jaký vzor má to slovo?“: růže · píseň · stavení · moře | k1 *ulici* · final růže |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `oznac_role` (vzor u 5 slov); `final` `doplnit_pismeno` 10 mezer v textu; semafor z `final` | `semafor_tydne`: zelená 9, oranžová 7, červená 0 |

---

## 7. Téma 3 — Přídavná jména (`pridavna-jmena`, lekce 9–12)

**Cíl tématu:** Dítě určí druh přídavného jména (tvrdé, měkké, přivlastňovací), stupeň a utvoří 2. a 3. stupeň (i *dobrý – lepší*), doplní *-ý/-í* v koncovce tvrdého přídavného jména a *-ovi/-ovy/-ova* v přivlastňovacím (*Tomášovi kamarádi × Tomášovy boty*).
**Hranice:** **nehodnotit** druh u stupňovaných tvarů (*starší* je tvrdé, nebo měkké? — učebnice nejednotné), *zlý – horší/zlejší* (ÚJČ id=410: *zlejší* je spisovné ve významu „ubližující“), *-ní/-ný* (id=752), přídavná jména od zeměpisných jmen a složená (*česko-německý*), jmenné tvary (*zdráv, rád*). Podstatné jméno vedle mezery je vytištěné; jeho koncovka se nehodnotí.
**Hodnoty rolí:** `tvrdé`, `měkké`, `přivlastňovací`; `1. stupeň`, `2. stupeň`, `3. stupeň`.
**Zdroje:** id=410 (stupňování: *dobrý – lepší, malý – menší, velký – větší, dlouhý – delší*), id=400 (přivlastňovací), hesla *hladový, cenný*.

### L9 · `cj-t3-l9` — Druhy přídavných jmen a stupňování · poslech U3
**Cíl:** Dítě určí druh přídavného jména (*mladý* tvrdé, *jarní* měkké, *otcův, Klářin* přivlastňovací) a stupeň a utvoří 2. a 3. stupeň i u *dobrý, malý, velký, dlouhý*.
**Platí:** `tvrdé mladý · měkké jarní · otcův` · `2. st. -ejší/-ší · 3. st. nej-` · `dobrý – lepší – nejlepší`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z1: najít přídavné jméno | 4 kroky `dlazdice` (řady se pastmi *rychle*, *zelená se*, *rychlost*) | `sd-prislovce-za-pridavne`, `sd-sloveso-za-pridavne`, `sd-podstatne-za-pridavne` |
| U2 nová (5) | druh | přiřazení: 4 kroky `dlazdice` (tvrdé · měkké · přivlastňovací): *cizí, Klářin, hladový, otcův* | `pridavne-tvrde-za-mekke`, `pridavne-privlastnovaci-za-tvrde`, `privlastnovaci-neuzna` |
| U3 nová, **poslech** (5) | nepravidelné stupňování a přivlastňovací ve slyšené větě | `poslech` (návrh „Lucčin dort byl lepší než ten můj.“); `k1` „Od kterého slova je *lepší*?“ (dobrý · lehký · hezký · lepivý); `final` „Jaký druh je *Lucčin*?“ | k1 dobrý · final přivlastňovací · final tvrdé → `pridavne-privlastnovaci-za-tvrde` |
| U4 detektiv (5) | **NÁVRH** `stupnovani-nepravidelne-pravidelne` | Petr stupňoval tři slova: *malý – menší – nejmenší*, *dobrý – dobřejší – nejdobřejší*, *rychlý – rychlejší – nejrychlejší*; `k1` dlaždice (které slovo má Petr špatně), `final` oprava: lepší · dobřejší · nejlepší · dobrejší | k1 *dobrý* · final lepší |
| U5 kontrolní (6) | druh i stupeň v textu | `k1` `oznac_role` druh u 4 slov v 1. stupni; `final` `oznac_role` stupeň u 4 jiných slov (u stupňovaných tvarů se druh neurčuje) | `stupnovani-zamena` (NÁVRH), kódy druhu |

### L10 · `cj-t3-l10` — Koncovky -ý/-í tvrdých přídavných jmen
**Cíl:** Dítě doplní *-ý/-í* (a *-é/-á*) v koncovce tvrdého přídavného jména podle jména, ke kterému patří: *-í* jen u „ti“ (*ti malí kluci*), jinak *-ý, -é, -á*.
**Platí:** `-í jen u „ti“: ti malí kluci` · `ten malý · ty malé · ta malá` · `Ke kterému jménu to patří?`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L9 | 4 kroky `dlazdice` (druh / 2. stupeň) | kódy L9 |
| U2 nová (5) | *-ý × -í* v 1. pádě | `doplnit_pismeno` 6 mezer `["ý","í"]`, jméno hned vedle přídavného | `koncovka-prid-y-za-i`, `koncovka-prid-i-za-y` |
| U3 nová (5) | místo chyby: jméno daleko, *děti* (ty veselé děti), *lidé* (ti staří lidé), jiný pád | `doplnit_pismeno` 6 mezer `["ý","í","é"]` | `pridavne-shoda-s-jinym-jmenem` + koncovkové kódy |
| U4 detektiv (5) | `koncovka-prid-y-za-i` | Petr: „Na hřišti čekají malý kluci a starší holky.“ (*malý* chyba); `final` „Které slovo před jméno řekneš?“: ti · ten · ty · ta | k1 *malý* · final ti |
| U5 kontrolní (6) | celé L10 | `doplnit_pismeno` text, 8 mezer | koncovkové kódy |

### L11 · `cj-t3-l11` — Přivlastňovací přídavná jména · poslech U3
**Cíl:** Dítě pozná přivlastňovací přídavné jméno (*čí?*), doplní v něm *-ovi/-ovy/-ova* podle *ti/ty/ta* (*Tomášovi kamarádi, Tomášovy boty, Tomášova kola*) a odliší ho od podstatného jména ve 3. pádě (*dal to Tomášovi*).
**Platí:** `Čí? Tomášův, Klářin` · `ti → -ovi · ty → -ovy · ta → -ova` · `Tomášovy boty × dal to Tomášovi`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L10 | 4 kroky `doplnit_pismeno` po 1 mezeře (*-ý/-í*) | `koncovka-prid-*` |
| U2 nová (5) | *-ovi × -ovy* | `doplnit_pismeno` 6 mezer `["i","y"]`, jen zakončení *-ov_* (*Tomášov_ kamarádi, Tomášov_ boty*); *-in_* ne (*Klářiny × Klářini* je slyšet) | **NÁVRH** `privlastnovaci-i-za-y`, `privlastnovaci-y-za-i` |
| U3 nová, **poslech** (5) | přídavné jméno × podstatné jméno ve 3. pádě (stejně zní i se píše) | `poslech` (návrh „Tomášovi rodiče koupili Tomášovi nové kolo.“); `k1` „Jaký druh je první *Tomášovi*?“, `final` „… druhé *Tomášovi*?“ (přídavné jméno · podstatné jméno) | k1 přídavné · final podstatné · `privlastnovaci-neuzna`, `sd-podstatne-za-pridavne` |
| U4 detektiv (5) | `privlastnovaci-i-za-y` | Petr: „Tomášovi klíče jsou v tašce.“ `final` „Které slovo před jméno řekneš?“: ti · ty · ta · ten | k1 *Tomášovi* · final ty |
| U5 kontrolní (6) | *-ý/-í* i *-ovi/-ovy* v textu | `doplnit_pismeno` 8 mezer | kódy L10–L11 |

### L12 · `cj-t3-l12` — Kontrola tématu: přídavná jména · diktát
**Cíl:** Dítě v diktátu a v textu napíše správně koncovky přídavných jmen a u každé řekne, ke kterému jménu patří.
**Platí:** `Najdu jméno, řeknu ten/ti/ty/ta` · `ti → -í, -ovi · ty → -é, -ovy` · `Malí kluci mají Tomášovy míče.`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L9–L11 | 4 kroky `dlazdice` (druh, 2. stupeň, *-ý/-í*, *-ovi/-ovy*) | kódy tématu |
| U2 nová (5) | druh | `oznac_role` 6 slov v 1. stupni | kódy druhu |
| U3 nová (5) | stupňování | 4 kroky `dlazdice` 2. stupeň: *dobrý, malý, dlouhý, velký* | `stupnovani-nepravidelne-pravidelne` (NÁVRH) |
| U4 detektiv (5) | `privlastnovaci-y-za-i` | Petr: „Na zahradě si hrají Tomášovy kamarádi.“ `final` „Které slovo před jméno řekneš?“: ti · ty · ta · ten | k1 *Tomášovy* · final ti |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 3 věty, 15 slov (návrh: „Malí kluci čekají na hřišti.“ · „Tomášovy boty jsou nové.“ · „Ten veselý pes je Klářin.“; `chyby_ocekavane`: *Malí* `koncovka-prid-y-za-i`, *Tomášovy* `privlastnovaci-i-za-y`, *veselý* `koncovka-prid-i-za-y`); `final` `doplnit_pismeno` 10 mezer | `semafor_tydne` z `final`: zelená 9, oranžová 7, červená 0 |

---

## 8. Téma 4 — Zájmena a číslovky (`zajmena-cislovky`, lekce 13–16)

**Cíl tématu:** Dítě určí druh zájmena (osobní, přivlastňovací, ukazovací, tázací, vztažné, neurčité, záporné) a číslovky (základní, řadová, druhová, násobná), napíše správně *mě/mně* (test *tě/tobě*), *ji/jí* (test *Lucku/Lucce*), *něho* po předložce, *jenž/jež* a spisovné tvary *dvěma, oběma, dvou, obou, třemi, čtyřmi*.
**Hranice — nehodnotit:** *mě × mne* (ve 2. a 4. p. obojí správně, ÚJČ id=650) → v nabídce jen *ě/ně*; *něj × něho* (obojí správně, heslo *on*) → v nabídce nikdy obě; 2. p. *tří/třech, čtyř/čtyřech* (obojí spisovné, id=671); 7. p. u částí těla (*třema nohama, oběma rukama* jsou správně, id=671, heslo *oba*) → číslovky jen s osobami a věcmi; *jenž* jen v 1. p. j. č. (*jenž* m. × *jež* ž., s.; mn. č. *již* je knižní, viz §1 bod 2); druh u *se, si*, *svůj × jeho*; *jeden* (číslovka × zájmeno).
**Hodnoty rolí:** `osobní`, `přivlastňovací`, `ukazovací`, `tázací`, `vztažné`, `neurčité`, `záporné`; `základní`, `řadová`, `druhová`, `násobná`.
**Zdroje:** id=650 (tvary *já*), id=670 (*dva, oba*: 3. a 7. p. *dvěma, oběma*, „nikoli *dvouma, *dvěmi“), id=671 (*tři, čtyři*: 7. p. *třemi, čtyřmi*), hesla *on, ona* (po předložce *n-*: *něho, ni*), *jenž* (tabulka m. živ.), *několik* (čísl. neurč.).

### L13 · `cj-t4-l13` — Druhy zájmen a vztažné jenž
**Cíl:** Dítě určí druh zájmena podle toho, co dělá (stojí místo jména, ukazuje, ptá se, uvozuje vedlejší větu, popírá …), a u vztažného zájmena vybere *jenž* (k mužskému jménu) nebo *jež* (k ženskému a střednímu).
**Platí:** `Zájmeno stojí místo jména` · `Ptá se? tázací · vede větu? vztažné` · `kluk, jenž… · holka, jež…`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z1 + čtení: za koho stojí zájmeno (bez názvů druhů) | 4 kroky `dlazdice`: „Tomáš má psa. Každý den *ho* venčí.“ — Za koho stojí *ho*? (Tomáš · psa · den) | obecná |
| U2 nová (5) | 7 druhů zájmen | `oznac_role`, 2 věty, 6 zájmen (*on, můj, ten, kdo, nikdo, někdo*), 7 rolí | **NÁVRH** `zajmeno-druh-zamena` |
| U3 nová (5) | *který* tázací × vztažné; *jenž × jež* | 4 kroky `dlazdice`: 2× „Je *který* tázací, nebo vztažné?“ (*Který autobus jede?* × *Autobus, který jede…*), 2× doplň tvar: „Pes, ___ štěkal…“ (jenž · jež), „Kniha, ___ leží na stole…“ (jenž · jež) | `zajmeno-druh-zamena`, **NÁVRH** `jenz-rod-zamena` |
| U4 detektiv (5) | `jenz-rod-zamena` | Petr: „Hřiště, jenž je za školou, je nové.“ `k1` klik; `final` oprava: jež · jenž · který · což | k1 *jenž* · final jež |
| U5 kontrolní (6) | druhy v textu | `oznac_role` 7 zájmen (každý druh jednou), 3 věty | `zajmeno-druh-zamena` |

### L14 · `cj-t4-l14` — Tvary zájmen já, on, ona: mě/mně, ji/jí, něho · poslech U3
**Cíl:** Dítě doplní *mě/mně* testem *tě/tobě*, *ji/jí* testem *Lucku/Lucce* a po předložce použije *něho* (*pro něho*, ne *pro jeho*).
**Platí:** `mně = tobě · mě = tě` · `ji = Lucku · jí = Lucce, Luckou` · `po předložce n-: pro něho, k ní`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L13 | 4 kroky `dlazdice`, druh zájmena | `zajmeno-druh-zamena` |
| U2 nová (5) | *mě × mně* | `doplnit_pismeno` 6 mezer `["ě","ně"]`, 3. a 6. p. (*Půjč m_ tužku. Mluvili o m_.*) a 2. a 4. p. (*Vidíš m_? Beze m_ nechoď.*) | `me-mne-zamena` |
| U3 nová, **poslech** (5) | *ji × jí* (délka je slyšet) | `poslech` (návrh „Klára potkala Lucku, podala jí ruku a pozvala ji domů.“); `k1` „Jak zněla ta dvě krátká slova za sebou?“ (jí … ji · ji … jí · jí … jí · ji … ji); `final` „Dosaď jméno: podala ___ ruku.“ (Lucce · Lucku) | k1 „jí … ji“ · final Lucce · **NÁVRH** `zajmeno-ji-delka` |
| U4 detektiv (5) | `me-mne-zamena` | Petr: „Lucka mně pozvala na oslavu.“ `final` „Co místo toho slova dosadíš?“: tě · tobě · ti · tebou | k1 *mně* · final tě |
| U5 kontrolní (6) | celé L14 | `doplnit_pismeno` 8 mezer: 4× `["ě","ně"]`, 2× `["i","í"]` (*j_*), 2× slovní nabídka `["něho","jeho"]` | `me-mne-zamena`, `zajmeno-ji-delka`, **NÁVRH** `zajmeno-jeho-po-predlozce` |

### L15 · `cj-t4-l15` — Číslovky: druhy a tvary dva, oba, tři, čtyři · poslech U3
**Cíl:** Dítě určí druh číslovky otázkou (*kolik? kolikátý? kolikery? kolikrát?*) a použije spisovný tvar *dvěma, oběma* (3. a 7. p.), *dvou, obou* (2. a 6. p.), *třemi, čtyřmi* (7. p.).
**Platí:** `kolik? kolikátý? kolikery? -krát?` · `se dvěma, oběma · bez dvou, obou` · `se třemi, čtyřmi (ne třema)`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L14 | 4 kroky `doplnit_pismeno` po 1 mezeře (*mě/mně, ji/jí*) | `me-mne-zamena`, `zajmeno-ji-delka` |
| U2 nová (5) | 4 druhy číslovek | přiřazení: 4 kroky `dlazdice` (základní · řadová · druhová · násobná): *pět, pátý, dvoje* (boty), *třikrát* [OVĚŘIT *třikrát* čísl. nás.; SSČ tak řadí *několikrát*] | `cislovka-za-pridavne`, **NÁVRH** `cislovka-druh-zamena` |
| U3 nová, **poslech** (5) | hovorový tvar číslovky (je slyšet) | `poslech` (návrh „Na výlet jsme jeli se třema kamarády a se dvěma kamarádkami.“ — **záměrně hovorové *třema***); `k1` „Které slovo se v písemce napíše jinak?“ (jeli · třema · kamarády · dvěma); `final` „Jak se napíše?“ (třemi · třema · třemy · tří) | k1 *třema* · final třemi · **NÁVRH** `cislovka-hovorovy-tvar`, `cislovka-pad-zamena` |
| U4 detektiv (5) | `cislovka-hovorovy-tvar` | Petr: „Šel jsem do kina se dvouma kamarády.“ `final` oprava: dvěma · dvou · dvěmi · dva | k1 *dvouma* · final dvěma |
| U5 kontrolní (6) | tvary a druh | `doplnit_pismeno` 6 mezer se slovní nabídkou (*dvěma/dvou/dvouma*, *oběma/obou*, *třemi/třema*, *čtyřmi/čtyřma*); věty bez částí těla | `cislovka-hovorovy-tvar`, `cislovka-pad-zamena` |

### L16 · `cj-t4-l16` — Kontrola tématu: zájmena a číslovky · diktát
**Cíl:** Dítě v diktátu a v textu napíše správně *mě/mně, ji/jí, něho* a tvary *dva, oba, tři, čtyři*, u zájmen a číslovek v textu určí druh.
**Platí:** `mně = tobě · ji = Lucku` · `pro něho · se dvěma, oběma` · `třemi, čtyřmi · dvou, obou`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L13–L15 | 4 kroky `dlazdice` (druh zájmena, druh číslovky, *mě/mně*, *dvěma*) | kódy tématu |
| U2 nová (5) | druhy | `oznac_role` 6 slov (4 zájmena, 2 číslovky), role 7 + 4 druhy | `zajmeno-druh-zamena`, `cislovka-druh-zamena` |
| U3 nová (5) | tvary | `doplnit_pismeno` 6 mezer (*mě/mně, ji/jí, dvěma*) | kódy L14–L15 |
| U4 detektiv (5) | `zajmeno-ji-delka` | Petr: „Klára hledala Lucku a viděla jí na hřišti.“ `final` „Co místo toho slova dosadíš?“: Lucku · Lucce · Luckou · Lucky | k1 *jí* · final Lucku (→ *ji*) |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 3 věty, 15 slov (návrh „Lucka mně půjčila sešit.“ · „Klára ji pozvala na oslavu.“ · „Dal jsem to oběma bratrům.“; `chyby_ocekavane`: *mně* `me-mne-zamena`, *ji* `zajmeno-ji-delka`, *oběma* `cislovka-hovorovy-tvar`); `final` `doplnit_pismeno` 10 mezer | `semafor_tydne`: zelená 9, oranžová 7, červená 0 |

---

## 9. Téma 5 — Slovesa: způsob, vid, rod (`slovesa`, lekce 17–20)

**Cíl tématu:** Dítě určí způsob (oznamovací, rozkazovací, podmiňovací), vid (dokonavý, nedokonavý) a rod (činný, trpný) slovesa, napíše spisovně *bychom, byste* a budoucí čas dokonavých sloves bez *budu* (*přečtu*, ne *budu přečíst*).
**Hranice:** osoba, číslo, čas = Z3. **Nehodnotit:** podmiňovací způsob minulý; obouvidová slovesa (*věnovat, jmenovat* [OVĚŘIT vid v SSČ]); zvratné pasivum (*dům se staví*); *byl zavřený × byl zavřen* (přídavné jméno × příčestí — v úlohách na rod jen krátké tvary *-n, -t*); trpný rod v mn. č. (shoda, T7); rozkazovací tvary s dubletou.
**Hodnoty rolí:** `oznamovací`, `rozkazovací`, `podmiňovací`; `dokonavý`, `nedokonavý`; `činný`, `trpný`; čas `přítomný`, `minulý`, `budoucí`.
**Zdroje:** id=575 (podmiňovací způsob: *byste, abyste, kdybyste*), hesla *napsat* (dok.), *přečíst* (dok.), *číst* (ned.), *usnout* (dok.), *postavit* (dok.), *bychom/bysme* (Spolu, TYDEN-5).

### L17 · `cj-t5-l17` — Slovesný způsob a tvary bychom, byste · poslech U3
**Cíl:** Dítě určí způsob slovesa (oznamuje, přikazuje, nebo říká, co by bylo) a napíše spisovně *bychom, byste* (ne *bysme, by jste*).
**Platí:** `oznam. · rozkaz. ! · podmiň. by` · `my bychom · vy byste` · `Šli bychom ven. Pojď ven!`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z3: osoba, číslo, čas | 4 kroky `dlazdice` (tučné sloveso ve větě) | `osoba-podle-podmetu-slova`, `cas-budouci-za-pritomny`, `infinitiv-urci-osobu` |
| U2 nová (5) | 3 způsoby | přiřazení: 4 kroky `dlazdice`: *Zavři* okno! · *Hrál bys* hokej? · Lucka *byla* doma. · *Pojďme* ven! | `zpusob-rozkaz-za-oznam`, `zpusob-podmin-za-oznam`, `zpusob-byl-za-podminovaci` |
| U3 nová, **poslech** (5) | *bysme* poznat sluchem a opravit | `poslech` (návrh „Večer bysme mohli jít do kina.“ — **záměrně hovorové**); `k1` „Které slovo se v písemce napíše jinak?“ (Večer · bysme · mohli · kina); `final` „Jak se napíše?“ (bychom · by jsme · bysme · bychme) | k1 *bysme* · final bychom · `bysme-za-bychom`, `by-jsme-za-bychom` |
| U4 detektiv (5) | `by-jsem-za-bych` | Petr: „Kdy by jste přišli?“ `final` oprava: byste · by jste · bysi · bychom | `k1` `dlazdice` „Kde má Petr chybu?“ (Kdy · by jste · přišli) — chyba je dvojslovná, proto ne klik · final byste |
| U5 kontrolní (6) | způsob v textu + tvary | `k1` `doplnit_pismeno` 3 mezery se slovní nabídkou (*bychom/bysme/by jsme*, *byste/by jste*); `final` `oznac_role` 6 sloves, 3 způsoby | `zpusob-*`, `bysme-za-bychom` |

### L18 · `cj-t5-l18` — Slovesný vid · poslech U3
**Cíl:** Dítě určí vid testem *budu ___* (nedokonavé jde: *budu psát*; dokonavé ne: *napíšu*) a pozná, že *napíšu, přečtu* je čas budoucí.
**Platí:** `Jde „budu ___“? → nedokonavé` · `psát – napsat · číst – přečíst` · `napíšu = budoucí čas`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L17 | 4 kroky `dlazdice`, způsob | `zpusob-*` |
| U2 nová (5) | vid | přiřazení: 4 kroky `dlazdice` (dokonavý · nedokonavý): *přečíst, skákat, skočit, psát* | **NÁVRH** `vid-zamena` |
| U3 nová, **poslech** (5) | dokonavé sloveso v přítomném tvaru = budoucí čas | `poslech` (návrh „Zítra napíšu test a potom budu číst knihu.“); `k1` „V jakém čase je *napíšu*?“; `final` „Jaký vid má *napíšu*?“ | k1 budoucí · final dokonavý · `cas-budouci-za-pritomny`, `vid-zamena` |
| U4 detektiv (5) | **NÁVRH** `bude-s-dokonavym` | Petr: „Zítra budu přečíst celou knihu.“ `k1` `dlazdice` „Kde má Petr chybu?“ (Zítra · budu přečíst · celou knihu); `final` oprava: přečtu · budu přečíst · přečíst budu · bude přečíst (*budu číst* v nabídce **není** — byla by druhou správnou opravou) | final přečtu |
| U5 kontrolní (6) | vid a čas | `oznac_role` s kategoriemi `{vid, cas}`, 5 sloves | `vid-zamena`, `cas-budouci-za-pritomny` |

### L19 · `cj-t5-l19` — Rod činný a trpný
**Cíl:** Dítě pozná rod trpný (*Most byl postaven.* — podmět děj nedělá, děje se s ním; *být* + tvar na *-n/-t*) a odliší ho od *být* bez trpného rodu (*byl doma*).
**Platí:** `Činný: podmět to dělá` · `Trpný: být + -n/-t (je opraven)` · `Most postavili × Most byl postaven`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L18 | 4 kroky `dlazdice`, vid | `vid-zamena` |
| U2 nová (5) | činný × trpný | přiřazení: 4 kroky `dlazdice`: Okno bylo rozbito. · Tomáš rozbil okno. · Tomáš byl doma. · Kolo je opraveno. | **NÁVRH** `rod-trpny-za-byt`, `rod-trpny-neuzna` |
| U3 nová (5) | převod věty | 2 kroky `dlazdice`: „Která věta říká totéž v rodě trpném? *Klára opravila kolo.*“ (Kolo bylo opraveno Klárou. · Kolo opravilo Kláru. · Klára byla opravena kolem. · Klára kolo opravuje.); obráceně k trpné větě činná | `rod-trpny-neuzna` |
| U4 detektiv (5) | `rod-trpny-neuzna` | Petr určil rod: „Dům byl postaven loni.“ — činný; `final`: trpný · činný | k1 *byl postaven* · final trpný |
| U5 kontrolní (6) | rod v textu | `oznac_role` s kategoriemi `{rod, cas}`, 5 sloves (jen j. č.) | `rod-*` |

### L20 · `cj-t5-l20` — Kontrola tématu: slovesa · diktát
**Cíl:** Dítě u sloves v textu určí způsob, vid a rod a v diktátu napíše správně tvary *by, budu + nedokonavé*, rozkaz a trpný rod.
**Platí:** `způsob · vid (budu ___?) · rod` · `bychom, byste · přečtu × budu číst` · `Dům byl postaven. Zavři okno!`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L17–L19 | 4 kroky `dlazdice` (způsob, vid, rod, *bychom*) | kódy tématu |
| U2 nová (5) | způsob a vid | `oznac_role` `{zpusob, vid}` 4 slovesa | `zpusob-*`, `vid-zamena` |
| U3 nová (5) | rod | 4 kroky `dlazdice` | `rod-*` |
| U4 detektiv (5) | `bysme-za-bychom` nebo `bude-s-dokonavym` | Petr v krátkém textu | `detektiv-*` |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 4 věty, 14 slov (návrh „Tomáš by šel ven.“ · „Večer budu číst knihu.“ · „Dům byl postaven loni.“ · „Zavři okno!“ — bez *bychom*, protože vyžaduje příčestí v mn. č. = shoda T7); `final` `oznac_role` `{zpusob, vid, rod}` 4 slovesa = 12 údajů | `semafor_tydne`: zelená 11, oranžová 9, červená 0 |

---

## 10. Téma 6 — Vyjmenovaná slova (`vyjmenovana-slova`, lekce 21–24)

**Cíl tématu:** Dítě doplní *i/y* po *b, l, m, p, s, v, z* v kořeni slova podle vyjmenovaných a příbuzných slov, pozná předponu *vy-/vý-* a rozliší dvojice podle významu (*být × bít, mýt × mít, výr × vír, výt × vít*).
**Hranice:** jen kořeny a předpona *vy-*; koncovky (T2, T3, T7) ne — slova v mezerách volit tak, aby koncovka neměla *i/y* po obojetné souhlásce, nebo ji vytisknout. Jen frekventovaná slova (ne *babyka, pýří, slynout, vyžle*), žádná přejatá (*sirup, synonymum*). Po *f* vyjmenovaná slova nejsou — nepoužívat. Seznam a příbuzná slova podle ÚJČ id=100 (vyjmenovaná slova) a id=101 (*být × bít*).
**Hodnoty:** mezery `["i","y"]` nebo `["í","ý"]` podle délky.

### L21 · `cj-t6-l21` — Po B, L, M · poslech U3
**Cíl:** Dítě doplní *i/y* po *b, l, m* podle toho, zda jde o vyjmenované slovo nebo slovo příbuzné (stejná část slova: *bydlet – obyvatel – bydliště*), a rozliší *být × bít*, *mýt × mít* podle významu.
**Platí:** `Y jen ve vyjmenovaných a příbuzných` · `Příbuzné = stejný kořen (bydlet)` · `být = existovat · bít = tlouct`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z5: tvrdé a měkké souhlásky | 4 kroky `doplnit_pismeno` po 1 mezeře (*ch_trý, ž_dle, r_ba, c_bule*) | obecná |
| U2 nová (5) | B, L, M | `doplnit_pismeno` 8 mezer (*ob_vatel, l_žař, m_šlenka, b_lina, ml_n …*) | `vs-b-*`, `vs-l-*`, `vs-m-*`, `vs-pribuzne-neuzna` |
| U3 nová, **poslech** (5) | dvojice podle významu (zní stejně, rozhoduje smysl) | `poslech` 3 věty (návrh „Hodiny na věži začaly bít poledne. Chtěl bych být brankářem. Po tréninku si musím umýt ruce.“); `k1` dlaždice být · bít (věta 1), `k2` (věta 2), `final` mýt · mít (věta 3) | bít · být · mýt · `vs-dvojice-vyznam` |
| U4 detektiv (5) | `vs-pribuzne-neuzna` | Petr: „Obivatelé vesnice slavili.“ `final` „Ke kterému vyjmenovanému slovu patří?“: bydlet · bít · obyčej · bylina | k1 *Obivatelé* · final bydlet |
| U5 kontrolní (6) | B, L, M v textu | `doplnit_pismeno` 10 mezer | kódy L21 |

### L22 · `cj-t6-l22` — Po P, S, V, Z
**Cíl:** Dítě doplní *i/y* po *p, s, v, z* (*pytel, syrový, vysoký, jazyk*) včetně příbuzných slov (*výška ← vysoký, zvykat ← zvyk*) a odliší je od slov s *i* (*zima, síla, vítr*).
**Platí:** `Po P, S, V, Z stejné pravidlo` · `Najdi příbuzné: výška ← vysoký` · `brzy, jazyk × zima, zítra`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L21 | 4 kroky `doplnit_pismeno` (B, L, M) | kódy L21 |
| U2 nová (5) | P, S, V, Z | `doplnit_pismeno` 8 mezer | `vs-p-*`, `vs-s-*`, `vs-v-*`, `vs-z-*` |
| U3 nová (5) | příbuzné × nepříbuzné | 4 kroky `dlazdice` ano/ne: „Je slovo příbuzné s vyjmenovaným?“ (*sychravo* ano, *síla* ne, *výška* ano, *zima* ne) | `vs-pribuzne-neuzna` |
| U4 detektiv (5) | `vs-p-i-za-y` | Petr: „Do pitle jsme dali brambory.“ `final`: pytel · pít · pisk · pila | k1 *pitle* · final pytel |
| U5 kontrolní (6) | P, S, V, Z v textu | `doplnit_pismeno` 10 mezer | kódy L22 |

### L23 · `cj-t6-l23` — Předpona vy-/vý- a dvojice podle významu · poslech U3
**Cíl:** Dítě pozná předponu *vy-/vý-* (*vy-běhnout, vý-let*) a odliší ji od *vi-/ví-* v kořeni (*vidět, vítr*); dvojice *výr × vír*, *výt × vít* rozliší podle významu.
**Platí:** `Předpona vy-/vý- → vždy y` · `vy-běhnout × vidět (bez předpony)` · `výr = pták · vír = voda`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L21–L22 | 4 kroky `doplnit_pismeno` | `vs-*` |
| U2 nová (5) | předpona × kořen | 4 kroky `dlazdice` ano/ne „Je *vy/vý* na začátku předpona?“: *výlet, vidle, vyhrát, vítěz* | `vs-predpona-vy-i` |
| U3 nová, **poslech** (5) | dvojice podle významu | `poslech` 3 věty (návrh „V lese houká výr. Ve vodě se točil vír. Pes celou noc vyl.“); `k1` výr · vír, `k2` výr · vír, `final` vyl · vil | výr · vír · vyl · `vs-dvojice-vyznam` |
| U4 detektiv (5) | `vs-predpona-vy-i` | Petr: „Náš tým vihrál turnaj.“ `final` „Proč y?“: vy- je předpona · je to vyjmenované slovo · je to koncovka · píše se vždy | k1 *vihrál* · final předpona |
| U5 kontrolní (6) | všechno L21–L23 | `doplnit_pismeno` 10 mezer | `vs-*` |

### L24 · `cj-t6-l24` — Kontrola tématu: vyjmenovaná slova · diktát
**Cíl:** Dítě v diktátu a v textu napíše *i/y* v kořeni po obojetných souhláskách a u každého řekne vyjmenované slovo, ke kterému patří.
**Platí:** `Vyjmenované nebo příbuzné → y` · `vy-/vý- předpona → y` · `bydlí, mlýn, sýkora × zima`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L21–L23 | 4 kroky `dlazdice` (dvojice podle významu) | `vs-dvojice-vyznam` |
| U2 nová (5) | příbuzná slova | `dlazdice_vice` „Vyber slova příbuzná s *bydlet*“ (6 slov) | `vs-pribuzne-neuzna` |
| U3 nová (5) | celý text | `doplnit_pismeno` 8 mezer | `vs-*` |
| U4 detektiv (5) | `vs-dvojice-vyznam` | Petr: „Na stromě seděl vír.“ `final`: výr · vír | k1 *vír* · final výr |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 4 věty, 16 slov (návrh „Obyvatelé vesnice bydlí u mlýna.“ · „Brzy ráno slyšíme sýkoru.“ · „Vlk v lese vyl.“ · „Tomáš si umyl ruce.“); `final` `doplnit_pismeno` 10 mezer | `semafor_tydne`: zelená 9, oranžová 7, červená 0 |

---

## 11. Téma 7 — Shoda přísudku s podmětem (`shoda`, lekce 25–28)

**Cíl tématu:** Dítě najde podmět (i za přísudkem, nevyjádřený, několikanásobný), řekne před něj *ti/ty/ta* a doplní *-i/-y/-a* v příčestí (*kluci běželi, holky běžely, auta jela*); zvládne *děti* (→ *y*), *lidé, rodiče, koně* (→ *i*).
**Hranice:** podmět = Z4. Test *ti/ty/ta* nahrazuje termín životnost (rodič ho má ve slovníčku). **Nehodnotit** (ÚJČ id=601, 602): přísudek **před** několikanásobným podmětem (shoda podle nejbližšího je také správná), podmět s předložkou *s* (*táta s mámou přišli/přišel*), *my, vy* bez jasného rodu, oslovení v mn. č. s nevyjádřeným podmětem (*Děti, proč jste se neučili/neučily?*), podměty s dvojím skloňováním (*uzenáči/uzenáče, průvodce* kniha), *koně* jako věc (*tělocvičné koně stály*), střední rod j. č. v několikanásobném podmětu (*kotě a štěně si hrály* — správně, ale nečekané, [ZVÁŽIT], zatím vynecháno).
**Hodnoty:** mezery `["i","y","a"]` (u j. č. ženského se nepoužívá).
**Zdroje:** id=600 (*děti* → *y*; *rodiče, koně* → *i*; životná jména → *i*), id=601 (několikanásobný podmět: aspoň jeden m. živ. → *i*; všechna střední v mn. č. → *a*; jinak *y*), id=602 (nevyjádřený podmět, *my/vy*).

### L25 · `cj-t7-l25` — Shoda s jedním podmětem (i nevyjádřeným) · poslech U3
**Cíl:** Dítě najde podmět (i když stojí za přísudkem nebo chybí a je ve větě předtím), řekne před něj *ti/ty/ta* a doplní *i/y/a*.
**Platí:** `Najdu podmět, řeknu ti/ty/ta` · `ti → i · ty → y · ta → a` · `ti kluci běželi · ty holky běžely`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z4: podmět | 4 kroky `dlazdice` „Kdo, co to dělá?“, pasti podmět za přísudkem a 4. p. na začátku („Psa venčil Tomáš.“) | `podmet-za-predmet`, `podmet-prvni-slovo` |
| U2 nová (5) | shoda s podmětem před přísudkem | `doplnit_pismeno` 6 mezer `["i","y","a"]` (*kluci, holky, auta, stromy, kuřata, psi*) | `shoda-y-za-i`, `shoda-i-za-y`, `shoda-y-za-a` |
| U3 nová, **poslech** (5) | nevyjádřený podmět (z věty předtím) | `poslech` 2 věty (návrh „Na hřišti hráli kluci fotbal. Potom šli domů.“); `k1` „Kdo šel domů?“ (kluci · hřiště · fotbal · nikdo), `final` „Jaké písmeno patří do *šl_*?“ (i · y · a) | k1 kluci · final i · `shoda-nevyjadreny-neurcen`, `shoda-y-za-i` (*i/y* rozhoduje dítě podle pravidla, ne sluchem) |
| U4 detektiv (5) | `shoda-podle-blizkeho-slova` | Petr: „Míče kluků leželi v trávě.“ `final` „Které slovo rozhoduje o koncovce?“: Míče · kluků · trávě · leželi | k1 *leželi* · final Míče |
| U5 kontrolní (6) | celé L25 | `doplnit_pismeno` text, 8 mezer (podmět za přísudkem, nevyjádřený, střední rod) | kódy L25 |

### L26 · `cj-t7-l26` — Několikanásobný podmět
**Cíl:** Dítě u dvou a více podmětů před přísudkem doplní *-i*, když je mezi nimi aspoň jeden „ti“ (*máma a táta přišli*), *-a*, když jsou všechny „ta“ v množném čísle (*kuřata a koťata pípala*), jinak *-y*.
**Platí:** `Je mezi nimi „ti“? → i` · `jen „ta“ (víc kusů) → a · jinak y` · `Máma a táta přišli.`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L25 | 4 kroky `doplnit_pismeno` po 1 mezeře | kódy L25 |
| U2 nová (5) | pravidlo přednosti | `doplnit_pismeno` 6 mezer, podměty vždy **před** přísudkem | `shoda-nekolikanasobny-y`, `shoda-i-za-y`, `shoda-y-za-a` |
| U3 nová (5) | najít všechny podměty, past předmět | `k1` `klik_ve_textu` „Klikni na všechna slova, která tvoří podmět.“ (věta s 2–3 podměty a předmětem v 4. p.); `final` `dlazdice` i · y · a | `podmet-za-predmet`, `shoda-nekolikanasobny-y` |
| U4 detektiv (5) | `shoda-nekolikanasobny-y` | Petr: „Lucka a Tomáš šly do kina.“ `final` „Proč je to špatně?“: mezi podměty je „ti“ · podmět je jen jeden · podmět je za slovesem · koncovku určuje *kina* | k1 *šly* · final první |
| U5 kontrolní (6) | celé L25–L26 | `doplnit_pismeno` 8 mezer | kódy L25–L26 |

### L27 · `cj-t7-l27` — Děti, lidé, rodiče, koně · poslech U3
**Cíl:** Dítě doplní shodu u podmětů *děti* (ty děti → *y*), *lidé, rodiče, koně* (ti → *i*) a u zájmen *oni, ony, ona* podle toho, za koho stojí.
**Platí:** `děti → ty děti → y` · `lidé, rodiče, koně → ti → i` · `Děti si hrály, rodiče stáli.`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L26 | 4 kroky `doplnit_pismeno` | kódy L26 |
| U2 nová (5) | *děti, lidé, rodiče, koně* | `doplnit_pismeno` 6 mezer | `shoda-deti-i`, `shoda-rodice-lide-y` |
| U3 nová, **poslech** (5) | podmět v textu o víc lidech | `poslech` 3 věty (návrh „Rodiče čekali před školou. Děti vyběhly ven. Potom spolu šli k autu.“); `k1` „Kdo vyběhl ven?“ (rodiče · děti · rodiče i děti · škola), `final` „Jaké písmeno patří do *vyběhl_*?“ (i · y · a) | k1 děti · final y · `shoda-deti-i` |
| U4 detektiv (5) | `shoda-rodice-lide-y` | Petr: „Rodiče přijely pozdě.“ `final` „Které slovo před *rodiče* řekneš?“: ti · ty · ta | k1 *přijely* · final ti |
| U5 kontrolní (6) | celé L25–L27 | `doplnit_pismeno` text, 8 mezer | kódy tématu |

### L28 · `cj-t7-l28` — Kontrola tématu: shoda · diktát
**Cíl:** Dítě v diktátu a v textu napíše správně koncovky příčestí a u každé řekne podmět a *ti/ty/ta*.
**Platí:** `Podmět → ti/ty/ta → i/y/a` · `víc podmětů: „ti“ má přednost` · `děti → y · rodiče, lidé → i`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L25–L27 | 4 kroky `doplnit_pismeno` | kódy tématu |
| U2 nová (5) | podmět v delším textu | `klik_ve_textu` podměty ve 3 větách | `podmet-*` |
| U3 nová (5) | pasti | `doplnit_pismeno` 6 mezer | kódy tématu |
| U4 detektiv (5) | `shoda-podle-blizkeho-slova` | Petr v textu 3 vět | `detektiv-*` |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 4 věty, 16 slov (návrh „Kluci hráli na hřišti fotbal.“ · „Děti seděly u okna.“ · „Rodiče čekali venku.“ · „Auta stála před domem.“); `final` `doplnit_pismeno` 10 mezer | `semafor_tydne`: zelená 9, oranžová 7, červená 0 |

---

## 12. Téma 8 — Větné členy (`vetne-cleny`, lekce 29–32)

**Cíl tématu:** Dítě určí v jednoduché větě podmět, přísudek (slovesný × jmenný se sponou), předmět, příslovečné určení (místa, času, způsobu, příčiny) a přívlastek (shodný × neshodný), a to otázkou od slova, ke kterému člen patří.
**Hranice:** Z4. **Nehodnotit:** doplněk, přístavek, PU míry, účelu, podmínky, přípustky; infinitiv jako předmět (*chci plavat*); slovesa pohybu s osobou (*jde k lékaři*: PU, nebo předmět?); *byl postaven* (trpný rod) jako typ přísudku; jmenný přísudek s 1. × 7. p. (*byl učitel/učitelem*, ÚJČ id=610 — obojí správně, jen dítě nesmí volit tvar); podmět ve 2. p. (*přibylo vody*). Role dostává plnovýznamové slovo (ne předložka).
**Hodnoty rolí:** `podmět`, `přísudek`, `předmět`, `příslovečné určení místa`, `… času`, `… způsobu`, `… příčiny`, `přívlastek shodný`, `přívlastek neshodný`; typ přísudku `slovesný`, `jmenný se sponou`.

### L29 · `cj-t8-l29` — Přísudek slovesný a jmenný se sponou
**Cíl:** Dítě najde celý přísudek — slovesný (*Tomáš hraje*, *Klára byla doma*) i jmenný se sponou (*Tomáš je brankář*, *Lucka byla unavená*) — a k němu podmět.
**Platí:** `Přísudek: co podmět dělá, jaký je` · `jmenný: je/byl + jméno (je brankář)` · `byla doma = slovesný (kde byla)`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z4 | 4 kroky `dlazdice`, najdi přísudek / podmět | `prisudek-neni-sloveso`, `podmet-prisudek-zamena` |
| U2 nová (5) | slovesný × jmenný | přiřazení: 4 kroky `dlazdice`: Tomáš hraje. · Tomáš je brankář. · Lucka byla unavená. · Klára byla doma. | **NÁVRH** `prisudek-slovesny-za-jmenny` (*byla doma*), `prisudek-jmenny-za-slovesny` |
| U3 nová (5) | celý jmenný přísudek | 2 kroky `klik_ve_textu` „Klikni na celý přísudek.“ (`min 1, max 3`) | **NÁVRH** `prisudek-jmenny-jen-spona` |
| U4 detektiv (5) | `prisudek-jmenny-jen-spona` | Petr podtrhl přísudky: „Náš soused *je* kuchař. Jeho syn *hraje* hokej.“ `k1` `klik_ve_textu` (slovo, které Petr určil špatně); `final` „Co všechno patří do přísudku?“: je kuchař · je · soused je · hraje hokej | k1 *je* · final „je kuchař“ |
| U5 kontrolní (6) | podmět a typ přísudku v textu | `oznac_role` 6 slov, role podmět · přísudek slovesný · přísudek jmenný se sponou (u jmenného obě slova) | kódy L29 |

### L30 · `cj-t8-l30` — Předmět a příslovečné určení · poslech U3
**Cíl:** Dítě odliší předmět (ptám se od slovesa pádovou otázkou: *mluvili o čem?*) od příslovečného určení (*kde? kdy? jak? proč?*) a určí druh příslovečného určení.
**Platí:** `Předmět: pádová otázka od slovesa` · `Přísl. určení: kde? kdy? jak? proč?` · `mluvili o výletu → o čem? předmět`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L29 | 4 kroky `dlazdice` (typ přísudku) | kódy L29 |
| U2 nová (5) | předmět × 4 druhy PU | přiřazení: 4 kroky `dlazdice`, nabídka 5 rolí | **NÁVRH** `predmet-za-pu`, `pu-za-predmet`, `pu-druh-zamena` |
| U3 nová, **poslech** (5) | PU ve slyšené větě | `poslech` (návrh „Kvůli dešti jsme v sobotu zůstali doma.“); `k1` „Na co odpovídá *kvůli dešti*?“ (kde · kdy · jak · proč), `final` totéž pro *v sobotu* | k1 proč · final kdy · `pu-druh-zamena` |
| U4 detektiv (5) | `predmet-za-pu` | Petr: „Celý večer jsme mluvili o výletu.“ — *o výletu* PU místa; `final` „Jaký je to člen?“: předmět · PU místa · PU času · přívlastek | k1 *výletu* · final předmět |
| U5 kontrolní (6) | předmět a PU v textu | `oznac_role` 6 slov, 5 rolí | kódy L30 |

### L31 · `cj-t8-l31` — Přívlastek shodný a neshodný · poslech U3
**Cíl:** Dítě najde přívlastek (rozvíjí podstatné jméno: *jaký? který? čí?*), rozliší shodný (mění tvar se jménem: *starý dům – starého domu*) a neshodný (tvar se nemění: *dům u řeky*) a odliší přívlastek neshodný od příslovečného určení (*kluk u okna* × *sedí u okna*).
**Platí:** `Přívlastek: jaký? který? čí? (jméno)` · `shodný mění tvar se jménem` · `dům u řeky × stojí u řeky (PU)`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L30 | 4 kroky `dlazdice` (předmět × PU) | kódy L30 |
| U2 nová (5) | shodný × neshodný | přiřazení: 4 kroky `dlazdice` | **NÁVRH** `privlastek-shoda-zamena` |
| U3 nová, **poslech** (5) | ke kterému slovu člen patří | `poslech` (návrh „Kluk s modrou čepicí čekal u vchodu.“); `k1` „Ke kterému slovu patří *čepicí*?“ (Kluk · čekal · vchodu), `final` „Jaký člen je *u vchodu*?“ (PU místa · přívlastek neshodný · předmět) | k1 Kluk · final PU místa · **NÁVRH** `pu-za-privlastek`, `privlastek-neshodny-za-pu` |
| U4 detektiv (5) | `privlastek-neshodny-za-pu` | Petr: „Dům u řeky je starý.“ — *u řeky* PU místa; `final`: přívlastek neshodný · přívlastek shodný · PU místa · předmět | k1 *řeky* · final přívlastek neshodný |
| U5 kontrolní (6) | všechny členy | `oznac_role` 7 slov, 9 rolí | kódy tématu |

### L32 · `cj-t8-l32` — Kontrola tématu: větné členy · diktát
**Cíl:** Dítě v krátkém textu určí všechny větné členy tématu a zapíše diktát (pravopis jen ze společného základu + jmenný přísudek).
**Platí:** `Ptám se od slova, ke kterému patří` · `pádová otázka → předmět` · `kde, kdy, jak, proč → PU`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L29–L31 | 4 kroky `dlazdice` | kódy tématu |
| U2 nová (5) | podmět, přísudek, předmět | `oznac_role` 5 slov | kódy L29–L30 |
| U3 nová (5) | přívlastek × PU | 4 kroky `dlazdice` | kódy L31 |
| U4 detektiv (5) | `pu-za-predmet` | Petr v jedné větě | `detektiv-*` |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 3 věty, 14 slov (návrh „Náš soused je kuchař.“ · „Ten starý dům u řeky je prázdný.“ · „Večer čekal Adam venku.“; diktát zde hodnotí jen společný základ, viz §19 otázka 4); `final` `oznac_role` 8 slov v **nové** větě (ne v diktátu), 9 rolí | `semafor_tydne`: zelená 7, oranžová 5, červená 0 |

---

## 13. Téma 9 — Souvětí a čárka (`souveti`, lekce 33–36)

**Cíl tématu:** Dítě spočítá věty v souvětí podle přísudků, pozná větu hlavní a vedlejší (podle spojovacího výrazu), napíše čárku na hranici vedlejší věty (i vložené, z obou stran), ve výčtu, před *ale* a za oslovením a nenapíše ji před *a, i, ani, nebo*, když jen spojují.
**Hranice:** přísudek = Z4. **Nehodnotit / nepoužívat:** několikanásobný přísudek se společným podmětem v úlohách na počet vět (id=151), *a* v jiném než slučovacím poměru (*a proto, a přece*; id=153), *a* za vloženou větou, dvojité spojky (*buď – nebo*), *až když, teprve když, poté(,) co, tak(,) jak* (id=150), oslovení s pozdravem (*Ahoj(,) Tomáši*; id=151), vsuvka, přístavek, výrazy *bohužel, prosím, samozřejmě*, *jako, než* (id=154), druhy vedlejších vět. *jenž* jen tam, kde ho už zná (T4) — v T9 se nepoužívá.
**Hodnoty rolí:** `věta hlavní`, `věta vedlejší`; počet vět `1`–`4`.
**Zdroje:** id=150 (čárka v souvětí, podřadicí spojky a vztažná zájmena, vložené věty), id=151 (věta jednoduchá: výčet, odporovací *ale*, oslovení), id=153 (*a, i, ani*).

### L33 · `cj-t9-l33` — Věta jednoduchá a souvětí, věta hlavní a vedlejší · poslech U3
**Cíl:** Dítě spočítá věty v souvětí podle přísudků a u každé řekne, zda je hlavní (obstojí sama), nebo vedlejší (začíná spojovacím výrazem *že, když, protože, aby, který, kde, co*).
**Platí:** `Kolik přísudků, tolik vět` · `Vedlejší začíná: že, když, který…` · `Vím, | že přijdeš. (hlavní | vedl.)`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z4: přísudek (i *chci jít*, *budu číst*) | 4 kroky `dlazdice` | `prisudek-neni-sloveso`, `souveti-infinitiv-jako-veta` |
| U2 nová (5) | počet vět | 4 kroky `dlazdice` (1 · 2 · 3 · 4), pasti *chci jít ven*, *Tomáš, Lucka a Klára šli ven*, *budu číst* | `souveti-pocet-podle-spojek`, `souveti-infinitiv-jako-veta` |
| U3 nová, **poslech** (5) | počet vět a začátek vedlejší věty sluchem | `poslech` (návrh „Když jsme přišli domů, máma vařila večeři a táta četl noviny.“); `k1` „Kolik vět je v nahrávce?“, `final` „Které slovo začíná vedlejší větu?“ (Když · máma · a · táta) | k1 3 · final Když · **NÁVRH** `veta-hlavni-za-vedlejsi` |
| U4 detektiv (5) | `souveti-pocet-podle-spojek` | Petr spočítal věty: A „Tomáš, Lucka a Klára šli ven.“ – 3 · B „Vím, že přijdeš.“ – 2 · C „Chci jít domů.“ – 1; `k1` `dlazdice` „Kde se Petr spletl?“ (A · B · C), `final` „Kolik vět tam je?“ (1 · 2 · 3 · 4) | k1 A · final 1 |
| U5 kontrolní (6) | počet a druh vět | `k1` `dlazdice` počet; `final` `oznac_role` na přísudcích dvou souvětí (5 přísudků), role hlavní/vedlejší | `veta-hlavni-za-vedlejsi` |

### L34 · `cj-t9-l34` — Čárka v souvětí · poslech U2
**Cíl:** Dítě napíše čárku na hranici vedlejší věty (vložené z obou stran) a mezi větami spojenými *ale*; nenapíše ji před *a, i, ani, nebo*, když jen spojují.
**Platí:** `Čárka na hranici vedlejší věty` · `Ne před a, i, ani, nebo (spojují)` · `Kluk, který přišel, se smál.`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L33 | 4 kroky `dlazdice` (počet vět, vedlejší věta) | kódy L33 |
| U2 nová, **poslech** (5) | hranice vět sluchem (čárku neověřuje) | `poslech` (návrh „Lucka čte knihu a Tomáš, který přišel pozdě, píše úkol.“); `k1` „Kolik vět je v nahrávce?“, `final` „Které slovo začíná vedlejší větu?“ (čte · a · který · píše) | k1 3 · final který |
| U3 nová (5) | čárka před *že, protože, který* a u vložené věty | `klik_ve_textu` `cil: "mezery"`, 3 souvětí, 4 čárky | `carka-chybi-ze`, `carka-chybi-ktery`, `carka-chybi-pred-spojkou`, **NÁVRH** `carka-vlozena-chybi-druha` |
| U4 detektiv (5) | `carka-vlozena-chybi-druha` | Petr: „Pes, který štěkal celou noc usnul až ráno.“ `k1` klik na místo, kde chybí čárka (slovo před mezerou); `final` „Proč tam patří?“: končí tam vedlejší věta · začíná tam vedlejší věta · je tam výčet · je tam oslovení | k1 *noc* · final první |
| U5 kontrolní (6) | celé L34 | `klik_ve_textu` `mezery`, text 3 souvětí, 5 čárek, past *a* | kódy L34, `carka-navic-a` |

### L35 · `cj-t9-l35` — Čárka ve větě jednoduché: výčet, ale, oslovení
**Cíl:** Dítě napíše čárku mezi členy výčtu bez spojky, před *ale* i ve větě jednoduché (*malý, ale rychlý*) a za oslovením; nenapíše ji před *a, i, ani, nebo* ve výčtu.
**Platí:** `Výčet: jablka, hrušky a švestky` · `malý, ale rychlý · a bez čárky` · `Tomáši, pojď sem!`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L34 | 4 kroky `dlazdice` „Která věta je napsaná správně?“ | kódy L34 |
| U2 nová (5) | výčet | `klik_ve_textu` `mezery`, 2 věty | **NÁVRH** `carka-vycet-chybi`, `carka-navic-a` |
| U3 nová (5) | *ale × a, nebo*; oslovení | 4 kroky `dlazdice` (verze s čárkou / bez čárky) | **NÁVRH** `carka-chybi-pred-ale`, `carka-navic-pred-i-ani-nebo`, `carka-osloveni-chybi` |
| U4 detektiv (5) | `carka-osloveni-chybi` | Petr: „Kláro pojď k tabuli!“ `final` „Proč tam patří čárka?“: je tam oslovení · je tam výčet · začíná vedlejší věta · je tam *ale* | final oslovení |
| U5 kontrolní (6) | věta jednoduchá i souvětí | `klik_ve_textu` `mezery`, 3 věty, 6 čárek | kódy L34–L35 |

### L36 · `cj-t9-l36` — Kontrola tématu: souvětí a čárka · diktát s čárkami
**Cíl:** Dítě v diktátu a v textu napíše všechny čárky tématu a u každé řekne, proč tam je.
**Platí:** `Čárka: hranice vět, výčet, ale` · `Ne před a, i, ani, nebo (spojují)` · `Doufám, že Tomáš přijde.`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L33–L35 | 4 kroky `dlazdice` | kódy tématu |
| U2 nová (5) | počet vět | `oznac_role` hlavní/vedlejší | `veta-hlavni-za-vedlejsi` |
| U3 nová (5) | čárky | `klik_ve_textu` `mezery`, 4 čárky | kódy tématu |
| U4 detektiv (5) | `carka-navic-a` | Petr: „Lucka čte, a Tomáš píše.“ | `detektiv-*` |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 3 věty, 17 slov, **`hodnotit_interpunkci: true`** (návrh „Doufám, že Tomáš přijde.“ · „Kluk, který sedí vedle, hraje hokej.“ · „Do batohu dej svetr, bundu a boty.“; `chyby_ocekavane` jen čárky: `carka-chybi-ze`, `carka-chybi-ktery`, `carka-vlozena-chybi-druha`, `carka-vycet-chybi`); `final` `klik_ve_textu` `mezery`, 6 čárek | `semafor_tydne`: zelená 6, oranžová 4, červená 0 |

---

## 14. Téma 10 — Stavba slova a pravopis na švu (`pravopis`, lekce 37–40)

**Cíl tématu:** Dítě rozloží slovo na předponu, kořen, příponu a koncovku a podle toho napíše dvě stejné souhlásky na švu (*od-dělit, cen-ný*), *ú* po předponě (*ne-úspěch*), *bje, vje* (*ob-jet, v-jezd*), *mně* podle příbuzného slova (*zapomněl ← zapomenout*), předpony *s-, z-, vz-* podle významu a předložky *s, z* podle pádu.
**Hranice — nehodnotit:** *s-/z-* u dvojic s jiným významem (*sběh × zběh, správa × zpráva, shlédnout × zhlédnout*) a u sloves s oběma podobami (*zcestovat i scestovat*, id=110); slova „k zapamatování“ (*zkusit, zpívat, skončit, strávit*) jen jako vytištěný příklad; přejatá slova na *-ovat*; předložka *s* s 2. p. ve významu „z povrchu“ (*vzít se stolu* je podle id=111 „silně zastaralé“, ale existuje → nehodnotit *se stolu × ze stolu*); *oběd, oběť* (*bě* po *ob-*, id=126); *raný × ranný*; *ú/ů* v přejatých slovech a citoslovcích (id=127); *dvojbarevný/dvoubarevný*; přídavná jména od zvířat (*sloní*) jen jako past v L37, ne v diktátu.
**Hodnoty rolí:** `předpona`, `kořen`, `přípona`, `koncovka`.
**Zdroje:** id=125 (*n – nn*: *cenný, slunný*; jedno *n*: *havraní, vlněný*), id=126 (písmeno *ě*: *objevit, objednat, vjezd*; *mě × mně* podle základového slova: *zapomněl, rozumně* × *rozuměl, v zimě*), id=127 (*ú* po předponě: *neúspěch*), id=110 (předpony *s-* dolů, dohromady; *z-* změna stavu), id=111 (předložka *z* + 2. p., *s* + 7. p.), hesla *shodit, sjet, zničit, vzlétnout, oddělení, cenný, kamenný, neúspěch, objevit, vjezd, zapomenout, rozumně*.

### L37 · `cj-t10-l37` — Stavba slova, zdvojené souhlásky, ú po předponě
**Cíl:** Dítě rozloží slovo na části a podle toho napíše dvě stejné souhlásky na švu (*od-dělit, cen-ný, kamen-ný*) a *ú* na začátku kořene i po předponě (*ne-úspěch*).
**Platí:** `Rozlož: ne|úspěch, od|dělit` · `Na švu dvě stejné → píšu obě` · `cena → cenný · kámen → kamenný`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z5: příbuzná slova | 4 kroky `dlazdice` „Které slovo do řady nepatří?“ (*les, lesník, lesklý, zalesnit*) | obecná |
| U2 nová (5) | hranice předpony a kořene | 4 kroky `dlazdice` „Kde je hranice?“: *od\|dělit · o\|ddělit · odd\|ělit* (dále *rozzlobit, bezzubý, neúspěch*) | **NÁVRH** `stavba-hranice-zamena` |
| U3 nová (5) | *n × nn*, *ú × ů* | `doplnit_pismeno` 6 mezer: *ce_ý*, *kame_ý*, *slu_ý*, *vl_ěný* (`["n","nn"]`), *ne_spěch*, *d_m* (`["ú","ů"]`) | nn, nn, nn, n, ú, ů · **NÁVRH** `zdvojene-chybi`, `zdvojene-navic`, `u-krouzek-za-carku`, `u-carka-za-krouzek` |
| U4 detektiv (5) | `zdvojene-chybi` | Petr: „Babička má cený prsten.“ `final` „Proč dvě n?“: *cen-* + *-ný* · je to cizí slovo · slovo je dlouhé · píše se vždy | k1 *cený* · final první |
| U5 kontrolní (6) | celé L37 | `doplnit_pismeno` 8 mezer (*nn, dd, zz, ú/ů*) | kódy L37 |

### L38 · `cj-t10-l38` — Předpony s-, z-, vz- a předložky s, z · poslech U3
**Cíl:** Dítě napíše předponu *s-* (dolů, dohromady: *shodit, sjet, sebrat*), *z-* (změna stavu: *zčervenat, zničit*), *vz-* (nahoru: *vzlétnout*) a předložku *s* se 7. pádem (*s kým, čím?*), *z* s 2. pádem (*z koho, čeho?*).
**Platí:** `s- dolů, dohromady: shodit` · `z- změna: zčervenat, zničit` · `s kým? (7. p.) × z čeho? (2. p.)`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z2: 2. × 7. pád | 4 kroky `dlazdice` (pád tučného jména) | `pad-*` |
| U2 nová (5) | předložky | `doplnit_pismeno` 6 mezer `["s","z"]`/`["se","ze"]` (*_ kamarádem, _ domu, _e školy …*; jen *z* ve významu „zevnitř“) | `s-z-predlozka-zamena` |
| U3 nová, **poslech** (5) | předpona podle významu (zní stejně) | `poslech` 2 věty (návrh „Lyžaři sjeli z kopce. Listí na podzim zežloutlo.“); `k1` „Jak začíná *_jeli*?“ (s · z), `k2` „*_ kopce*?“ (s · z), `final` „*_ežloutlo*?“ (s · z) | s · z · z · **NÁVRH** `s-z-predpona-zamena`, `s-z-predlozka-zamena` |
| U4 detektiv (5) | `s-z-predpona-zamena` | Petr: „Klára zhodila hrnek na zem.“ `final` „Proč s-?“: hrnek šel dolů · hrnek se změnil · je tam 7. pád · je tam 2. pád | k1 *zhodila* · final první |
| U5 kontrolní (6) | předpony i předložky | `doplnit_pismeno` 8 mezer (4 předpony, 4 předložky) | kódy L38 |

### L39 · `cj-t10-l39` — bě/bje, vě/vje, pě, mě/mně · poslech U3
**Cíl:** Dítě napíše *bje, vje* jen na švu předpony *ob-, v-* a kořene na *je-* (*ob-jet, v-jezd, ob-jednat*), jinak *bě, vě, pě*; *mně* tam, kde je v příbuzném slově *mn/men* (*zapomněl ← zapomenout, příjemně ← příjemný*) a v zájmenu (*mně = tobě*), jinak *mě* (*město, rozuměl*).
**Platí:** `bje, vje jen na švu: ob|jet, v|jezd` · `mně, když je v příbuzném mn/men` · `zapomněl × rozuměl (rozum)`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L37: rozlož slovo | 4 kroky `dlazdice` (hranice předpony) | `stavba-hranice-zamena` |
| U2 nová (5) | *ě × je* | `doplnit_pismeno` 6 mezer `["ě","je"]`: *ob_vit, v_zd, ob_dnat* (je), *b_hat, pov_dět, sv_t* (ě) | **NÁVRH** `skupina-e-za-je`, `skupina-je-za-e` |
| U3 nová, **poslech** (5) | *mně × mě* podle příbuzného slova (zní stejně) | `poslech` (návrh „Tomáš zapomněl doma klíče.“); `k1` „Od kterého slova je *zapomněl*?“ (zapomenout · paměť · zámek), `final` „Jak napíšeš *zapom_l*?“ (ě · ně) | k1 zapomenout · final ně · **NÁVRH** `skupina-me-za-mne`, `skupina-mne-za-me` |
| U4 detektiv (5) | `skupina-e-za-je` | Petr: „Adam oběvil v lese jeskyni.“ `final` „Proč je?“: předpona *ob-* + *jev* · je to cizí slovo · po *b* vždy *je* · je to koncovka | k1 *oběvil* · final první |
| U5 kontrolní (6) | celé L39 | `doplnit_pismeno` 8 mezer (*bje/bě, vje/vě, pě, mě/mně* v kořeni, 2× zájmeno *mně/mě*) | kódy L39, `me-mne-zamena` |

### L40 · `cj-t10-l40` — Kontrola tématu: pravopis na švu · diktát
**Cíl:** Dítě v diktátu a v textu napíše správně jevy na švu slova a u každého řekne, z jakých částí slovo je.
**Platí:** `Rozlož slovo na části` · `Šev: od|dělit, ob|jet, ne|úspěch` · `s- dolů · z- změna · z čeho?`

| úloha | co měří | vstup a data | správně · známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L37–L39 | 4 kroky `dlazdice` | kódy tématu |
| U2 nová (5) | stavba slova | 4 kroky `dlazdice` „Která část slova je kořen?“ (*pře\|skoč\|it*: pře · skoč · it · přeskoč) | **NÁVRH** `stavba-cast-zamena` |
| U3 nová (5) | mix | `doplnit_pismeno` 6 mezer | kódy tématu |
| U4 detektiv (5) | `skupina-me-za-mne` | Petr: „Na to jsem úplně zapoměl.“ | `detektiv-*` |
| U5 kontrolní **týdenní** (6) | celé téma | `k1` `diktat` 4 věty, 17 slov (návrh „Táta objednal večeři.“ · „Lucka zapomněla na trénink.“ · „Ten oddíl má cenný pohár.“ · „Klára shodila hrnek na zem.“; `chyby_ocekavane`: *objednal* `skupina-e-za-je`, *zapomněla* `skupina-me-za-mne`, *oddíl* a *cenný* `zdvojene-chybi`, *shodila* `s-z-predpona-zamena`); `final` `doplnit_pismeno` 10 mezer | `semafor_tydne`: zelená 9, oranžová 7, červená 0 |

---

## 15. Diagnostika `cj-t0-diag`

**Soubor:** `obsah/cestina/lekce/cj-t0-diag.json`, `typ: "diagnostika"`, `faze: "osma"`, `tyden: 0`, `kapitola: "diagnostika"`, `cas_min: 25`. **23 položek**, každá = jedna úloha s jediným krokem `final` (`dlazdice`, `klik_ve_textu`, `doplnit_pismeno`, `oznac_role`), bez taháku a semaforu. Každá úloha má `kapitola` a `tema` (1–10) a u chybných voleb `typ_chyby` / `zname_chyby`. Dítě pracuje samo; rodič diagnostiku jen spustí. Pořadí položek = pořadí témat.
**Pravidla obsahu:** každá položka měří **jen svůj jev**; ostatní slova jsou vytištěná a nehodnotí se. Položka s více mezerami nebo kliky je správně, jen když je správně celá. Vše ověřeno v ÚJČ 1. 10. 2026 (zdroj u položky; „heslo X“ = `https://prirucka.ujc.cas.cz/?slovo=X`, „id=N“ = `https://prirucka.ujc.cas.cz/?id=N`).

| # | T | vstup | co měří | zadání a data | správně | známé chyby (kód) | zdroj ÚJČ |
|---|---|---|---|---|---|---|---|
| D1 | 1 | `klik_ve_textu` slova, `min 1` | ohebné × neohebné (past: příslovce, které se stupňuje) | „Klikni na všechna slova, která nemění tvar.“ Tomáš(0) včera(1) rychle(2) běžel(3) na(4) trénink(5) ale(6) autobus(7) mu(8) ujel(9) | `[1, 2, 4, 6]` | `chybi: [2]` → `ohebnost-stupnovani` · `navic: [8]` → obecná (zájmeno je ohebné) | hesla *včera* (přísl.), *rychlý* (→ *rychle* přísl.), *ale* (sp. odpor.); *na* předl. |
| D2 | 1 | `dlazdice` | druh podle věty | „Jaký slovní druh je *Kolem* ve větě: Kolem školy vede cesta.“ předložka · příslovce · spojka · podstatné jméno | předložka | příslovce → `prislovce-za-predlozku` | heslo *kolem* (SSČ: přísl.; předl. s 2. p.) |
| D3 | 2 | `dlazdice` | vzor mužského jména na *-a* | „Ke kterému vzoru patří slovo *hokejista*?“ předseda · pán · žena · hrad | předseda | pán → `vzor-pan-za-predseda` · žena → `vzor-zena-za-predseda` (NÁVRH) | heslo *hokejista* (m. živ., 2. p. *hokejisty*), *předseda* |
| D4 | 2 | `doplnit_pismeno` 3× `["i","y"]` | *i/y* v koncovce podle vzoru (1. p. mn. pán, 2. p. žena, 7. p. mn. stroj) | „Kamarád_ si u stodol_ hráli s míč_.“ | `["i","y","i"]` | `["y",null,null]` → `koncovka-podst-y-za-i` · `[null,"i",null]` → `koncovka-podst-i-za-y` · `[null,null,"y"]` → `koncovka-podst-y-za-i` | hesla *kamarád* (1. mn. *kamarádi*), *stodola* (2. j. *stodoly*), *míč* (7. mn. *míči*) |
| D5 | 3 | `doplnit_pismeno` `["ý","í"]`, `["i","y"]` | *-ý/-í* tvrdého a *-ovi/-ovy* přivlastňovacího přídavného jména | „Hladov_ psi štěkali na Tomášov_ kamarády.“ | `["í","y"]` | `["ý",null]` → `koncovka-prid-y-za-i` · `[null,"i"]` → `privlastnovaci-i-za-y` (NÁVRH) | heslo *hladový*; id=400 (*Karafiátovi Broučci* × *Karafiátovy Broučky*) |
| D6 | 3 | `dlazdice` | nepravidelné stupňování | „Vyber 2. stupeň slova *dobrý*.“ lepší · dobřejší · nejlepší · dobrý | lepší | dobřejší → `stupnovani-nepravidelne-pravidelne` · nejlepší → `stupnovani-zamena` (NÁVRH) | id=410 (*dobrý – lepší*) |
| D7 | 4 | `doplnit_pismeno` 2× `["ě","ně"]` | *mě × mně* | „Lucka m_ pozvala na oslavu a půjčila m_ svetr.“ | `["ě","ně"]` | `["ně",null]`, `[null,"ě"]` → `me-mne-zamena` | id=650 (4. p. *mě*, 3. p. *mně*; *mne* v nabídce není) |
| D8 | 4 | `dlazdice` | spisovný 7. p. číslovky *dva* | „Doplň: Šel jsem do kina se ___ kamarády.“ dvěma · dvouma · dvou · dvěmi | dvěma | dvouma → `cislovka-hovorovy-tvar` · dvou → `cislovka-pad-zamena` (NÁVRH) | id=670 („3. a 7. p. *dvěma* … nikoli *dvouma*, *dvěmi*“) |
| D9 | 5 | `oznac_role`, `slova: [1, 4, 8]`, `role: ["dokonavý","nedokonavý"]` | vid | „Tomáš napsal úkol, pak četl knihu a nakonec usnul.“ Tomáš(0) napsal(1) úkol(2) pak(3) četl(4) knihu(5) a(6) nakonec(7) usnul(8) | `{"1":"dokonavý","4":"nedokonavý","8":"dokonavý"}` | `{"1":"nedokonavý"}`, `{"4":"dokonavý"}` → `vid-zamena` (NÁVRH) | hesla *napsat* (dok.), *číst* (ned.), *usnout* (dok.) |
| D10 | 5 | `dlazdice` | rod trpný × tvar *být* | „Ve které větě je sloveso v rodě trpném?“ Most byl postaven před sto lety. · Tomáš postavil most z lega. · Lucka byla včera doma. · Klára by postavila stan. | Most byl postaven … | „Lucka byla včera doma.“ → `rod-trpny-za-byt` (NÁVRH) · ostatní obecná | id=600 (příklad *Hrad byl postaven na vysokém kopci*), heslo *postavit* |
| D11 | 5 | `dlazdice` | *bychom* | „Doplň: Rádi ___ jeli na hory.“ bychom · bysme · by jsme · bychme | bychom | bysme → `bysme-za-bychom` · by jsme → `by-jsme-za-bychom` | id=100 (*být: bych, bys, by, bychom, byste*), id=575 |
| D12 | 6 | `doplnit_pismeno` `["i","y"]`, `["í","ý"]`, `["í","ý"]` | VS po B a L, nevyjmenované po P | „Dědeček b_dlí u ml_na a p_še dopis.“ | `["y","ý","í"]` | `["i",null,null]` → `vs-b-i-za-y` · `[null,"í",null]` → `vs-l-i-za-y` · `[null,null,"ý"]` → `vs-p-y-za-i` | id=100 (B: *bydlit i bydlet*; L: *mlýn*) |
| D13 | 6 | `doplnit_pismeno` `["i","y"]`, `["í","ý"]` | dvojice *mýt × mít* podle významu | „Adam si um_l ruce, protože chtěl m_t čisté prsty.“ | `["y","í"]` | `["i",null]` → `vs-m-i-za-y` · `[null,"ý"]` → `vs-dvojice-vyznam` | id=100 (M: *mýt … umýt*), heslo *umýt* |
| D14 | 7 | `doplnit_pismeno` 3× `["i","y","a"]` | shoda s jedním podmětem | „Holky seděl_ na lavičce, kluci hrál_ fotbal a auta stál_ před školou.“ | `["y","i","a"]` | `["i",null,null]` → `shoda-i-za-y` · `[null,"y",null]` → `shoda-y-za-i` · `[null,null,"y"]` → `shoda-y-za-a` | id=600 |
| D15 | 7 | `doplnit_pismeno` 2× `["i","y","a"]` | několikanásobný podmět před přísudkem | „Lucka a Tomáš přišl_ pozdě, ale máma a babička na ně počkal_.“ | `["i","y"]` | `["y",null]` → `shoda-nekolikanasobny-y` · `[null,"i"]` → `shoda-i-za-y` | id=601 (podmět předchází přísudku; aspoň jeden m. živ. → *i*, jinak *y*) |
| D16 | 8 | `oznac_role`, `slova: [1, 2, 3, 6, 7]`, `role: ["podmět","přísudek","předmět","příslovečné určení","přívlastek"]` | základní a rozvíjející větné členy | „Malý Honzík včera dostal od babičky nové kolo.“ Malý(0) Honzík(1) včera(2) dostal(3) od(4) babičky(5) nové(6) kolo(7) | `{"1":"podmět","2":"příslovečné určení","3":"přísudek","6":"přívlastek","7":"předmět"}` | `{"7":"podmět"}` → `podmet-za-predmet` · `{"2":"předmět"}` → `pu-za-predmet` (NÁVRH) | příručka větné členy nevykládá; termíny podle školské praxe (doplnit do `TERMINOLOGIE.md`) |
| D17 | 8 | `dlazdice` | přívlastek neshodný × příslovečné určení | „Jaký větný člen je *u řeky* ve větě: Dům u řeky je starý.“ přívlastek neshodný · příslovečné určení místa · předmět · podmět | přívlastek neshodný | PU místa → `privlastek-neshodny-za-pu` (NÁVRH) | jako D16 |
| D18 | 9 | `klik_ve_textu` `cil: "mezery"` | čárka před *že*, *který* a za vloženou větou | „Klikni, kam patří čárky.“ Tomáš ví že trénink který začíná v pět bude dlouhý. | čárky za *ví*, *trénink*, *pět* | chybí za *pět* → `carka-vlozena-chybi-druha` (NÁVRH) · za *ví* → `carka-chybi-ze` · za *trénink* → `carka-chybi-ktery` | id=150 (podřadicí spojky, vztažná zájmena, vložené vedlejší věty) |
| D19 | 9 | `dlazdice` | počet vět podle přísudků | „Kolik vět má souvětí: Když jsme přišli domů, máma vařila a táta četl noviny.“ 1 · 2 · 3 · 4 | 3 | 2 → `souveti-pocet-podle-spojek` | id=150 (každá věta má vlastní podmět i přísudek, nejde o několikanásobný přísudek) |
| D20 | 9 | `klik_ve_textu` `cil: "mezery"` | čárka ve výčtu a před *ale*, ne před *a* | „Klikni, kam patří čárky.“ Na výlet si vezmi svačinu pití a pláštěnku ale ne těžkou bundu. | čárky za *svačinu*, *pláštěnku* | navíc za *pití* → `carka-navic-a` · chybí za *svačinu* → `carka-vycet-chybi` · chybí za *pláštěnku* → `carka-chybi-pred-ale` (NÁVRH) | id=151 (výčet; odporovací *ale*), id=153 (slučovací *a* bez čárky) |
| D21 | 10 | `doplnit_pismeno` `["ě","je"]`, `["ě","je"]`, `["ě","ně"]` | *bje, vje* na švu, *mně* podle příbuzného slova | „Adam ob_vil v_ezd do jeskyně, ale zapom_l baterku.“ | `["je","je","ně"]` | `["ě",null,null]`, `[null,"ě",null]` → `skupina-e-za-je` · `[null,null,"ě"]` → `skupina-me-za-mne` (NÁVRH) | id=126 (*objevit, vjezd*; *zapomněl* od *zapomenout*) |
| D22 | 10 | `doplnit_pismeno` 3× `["s","z"]` | předpona *s-* × *z-*, předložka *z* + 2. p. | „Klára _hodila hrnek na zem a hrnek se _ničil. Pak vyběhla _ kuchyně.“ | `["s","z","z"]` | `["z",null,null]`, `[null,"s",null]` → `s-z-predpona-zamena` (NÁVRH) · `[null,null,"s"]` → `s-z-predlozka-zamena` | id=110 (*s-* shora dolů; *z-* zdokonavující), id=111 (*z* + 2. p.), hesla *shodit*, *zničit* |
| D23 | 10 | `doplnit_pismeno` `["n","nn"]`, `["d","dd"]` | zdvojené souhlásky na švu | „Ten ce_ý obraz visí v o_ělení muzea.“ | `["nn","dd"]` | `["n",null]`, `[null,"d"]` → `zdvojene-chybi` (NÁVRH) | id=125 (*cena – cenný*), heslo *oddělení* (*od-dě-le-ní*) |

Počet: T1 2 · T2 2 · T3 2 · T4 2 · T5 3 · T6 2 · T7 2 · T8 2 · T9 3 · T10 3 = **23**. Čas ≈ 1 min na položku.
Kontrola zásady „nic dřív, než se to probralo“: diagnostika není lekce, měří vše najednou; dítě může položku přeskočit tlačítkem „Tohle jsme se ještě neučili“ (počítá se jako chyba, bez trestu — jako ve Spolu).

### 15.1 Vyhodnocení a doporučení pořadí témat
1. **Stav tématu** (rodič vidí slova, ne čísla):
   - 2 položky: 2 správně = **jisté**, 1 = **nejisté**, 0 = **slabé**;
   - 3 položky (T5, T9, T10): 3 = **jisté**, 2 = **nejisté**, 0–1 = **slabé**;
   - přeskočená nebo prázdná položka = chyba.
2. **Pořadí lekcí:** nejdřív **slabá** témata, pak **nejistá**, nakonec **jistá**; uvnitř každé skupiny podle doporučeného pořadí osnovy (T1 → T10).
3. **Jistá témata** se zařadí na konec jen **4. lekcí** (kontrola tématu). Když ji dítě skončí oranžově nebo červeně, rodič dostane doporučení projít celé téma od 1. lekce.
4. **Skoro všechno slabé** (7 a více témat slabých): pořadí osnovy T1 → T10 beze změny (dítě potřebuje začít od základů; přeskupení by nepomohlo).
5. **Shoda T2 a T7:** jsou-li slabé obě, platí bod 2 (T2 před T7) — shoda sice stojí sama (test *ti/ty/ta*), ale jistota v koncovkách podstatných jmen ji usnadní.
6. Rodič vidí ke každému tématu jednu větu bez pojmů a „Kde to potrénujeme: lekce …“. Zakončení jako ve Spolu: „Tohle je mapa, ne známka.“

---

## 16. Vyřazené sporné jevy (souhrn pro autory a korektora)

| jev | proč | zdroj |
|---|---|---|
| přísudek **před** několikanásobným podmětem (*Na hřišti hrál/hráli Tomáš a Lucka*) | shoda podle nejbližšího podmětu je také správná | ÚJČ id=601 |
| podmět s předložkou *s* (*táta s mámou přišel/přišli*) | dvojí shoda | id=601 |
| *my, vy* bez jasného rodu; oslovení v mn. č. + nevyjádřený podmět | dvojí shoda podle smyslu | id=602 |
| podměty s dvojím skloňováním (*uzenáči/uzenáče*, *průvodce* kniha), *dni/dny* | dvojí tvar i shoda | id=600, heslo *průvodce* |
| 1. p. mn. *-i × -ové* (*soudci/soudcové, hokejisté/hokejisti*) | obojí spisovné | hesla, id=226 |
| 6. p. j. č. *-u × -e*, 3./6. p. *-ovi × -u* u životných | dublety | id=223, id=225 |
| slova kolísající mezi vzory (*píseň × kost*, měkké × tvrdé) | dva vzory správně | id=252, id=221 |
| dvojné číslo (*rukama, očima*), číslovky u částí těla (*třema nohama*) | duál je u částí těla správně | id=671, heslo *oba* |
| 2. p. *tří/třech, čtyř/čtyřech* | obojí spisovné | id=671 |
| *mě × mne* ve 2. a 4. p.; *něj × něho* | obojí správně | id=650, heslo *on* |
| *jenž* v mn. č. a ve 4. p. | knižní, SSJČ i *králové, jenž* | heslo *jenž* |
| *zlý – horší/zlejší* | obojí spisovné | id=410 |
| druh u stupňovaných tvarů (*starší* tvrdé × měkké) | učebnice nejednotné | školská praxe |
| druh slova u *asi, snad, prý, bohužel, jen, i, se, si, by, jeden, pětka, teplo, ráno* | částice × příslovce × jiný druh | SSČ, TERMINOLOGIE §1–2 |
| několikanásobný přísudek jako počet vět (*skákal a smál se*) | „rozdílné názory“ v mluvnické tradici | id=151 |
| čárka před *a* v neslučovacím poměru, *a* za vloženou větou, *až když, poté(,) co, tak(,) jak*, oslovení s pozdravem, vsuvka, přístavek | složitá nebo dvojí pravidla | id=150, 151, 153 |
| *s-/z-* u dvojic s jiným významem a u sloves s oběma podobami; *se stolu × ze stolu* | dvojí podoba / význam | id=110, id=111 |
| *oběd, oběť* (*bě* po *ob-*) | výjimka z pravidla *ob- + je-* | id=126 |
| *raný × ranný*, *ú/ů* v přejatých slovech a citoslovcích (*túra, bú/bů*) | význam / dvojí podoba | id=125, id=127 |
| velká písmena | mnoho podob s velkým i malým písmenem a podle významu | id=191 a další (§1 bod 7) |
| podmiňovací způsob minulý, zvratné pasivum, obouvidová slovesa | okrajové / nejednoznačné | §9 |

---

## 17. Návrh nových kódů

Pravidla jako `TYPY-CHYB.md`: kód = co dítě **udělalo**. Otázka slouží rodiči i jako nápověda v režimu „Dnes samo“: tyká, bez rodu, neříká odpověď. Kódy přidat do `TYPY-CHYB.md` a `obsah/cestina/typy-chyb.json` **před** použitím v JSON.

| Kód | Skupina | Co dítě udělá | Příklad | Otázka pro rodiče / nápověda pro dítě | Lekce |
|---|---|---|---|---|---|
| `ohebnost-stupnovani` | sd | příslovce označí jako ohebné, protože jde stupňovat | *rychle* → ohebné | „Zkus to slovo říct v jiném pádě nebo s *já, ty, on*. Jde to? Je stupňování totéž?“ | 1, 2, 4, D1 |
| `sd-podstatne-za-prislovce` | sd | podstatné jméno, které zná jako „kdy?“, určí jako příslovce | *Ten večer byl dlouhý.* → příslovce | „Je před tím slovem *ten*? Jde na něj ukázat jako na věc?“ | 3 |
| `vzor-zena-za-predseda` | vzor | mužské jméno na *-a* dá ke vzoru *žena* | *hokejista, táta* → žena | „Řekni před to slovo *ten*, nebo *ta*. Který vzor má stejný rod?“ | 5, D3 |
| `stupnovani-nepravidelne-pravidelne` | pridavne | nepravidelné stupňování utvoří pravidelně | *dobrý – dobřejší* | „Řekni to ve větě: Tenhle dort je ještě ___ než ten druhý. Jak to zní?“ | 9, 12, D6 |
| `stupnovani-zamena` | pridavne | zamění 2. a 3. stupeň | *nejlepší* → 2. stupeň | „Srovnáváš dvě věci, nebo vybíráš tu úplně ze všech?“ | 9, D6 |
| `privlastnovaci-i-za-y` | pridavne | v přivlastňovacím přídavném jménu napíše *-ovi* tam, kde patří *-ovy* | *Tomášovi klíče* | „Řekni před podstatné jméno *ti*, nebo *ty*. Co se k němu hodí?“ | 11, 12, D5 |
| `privlastnovaci-y-za-i` | pridavne | napíše *-ovy* tam, kde patří *-ovi* | *Tomášovy kamarádi* | totéž | 11, 12 |
| `zajmeno-druh-zamena` | zajmeno | zamění druh zájmena | *který* v otázce → vztažné; *nikdo* → neurčité | „Co to slovo ve větě dělá: ptá se, ukazuje, něco popírá, nebo připojuje další větu?“ | 13, 14, 16 |
| `jenz-rod-zamena` | zajmeno | použije *jenž/jež* v jiném rodě | *kniha, jenž* | „Ke kterému slovu se to zájmeno vztahuje? Řekni před něj *ten, ta*, nebo *to*.“ | 13 |
| `zajmeno-ji-delka` | zajmeno | napíše *jí* ve 4. p. nebo *ji* ve 3. a 7. p. | *viděla jí*, *podala ji ruku* | „Dosaď místo toho slova *Lucku*, nebo *Lucce*. Které se hodí?“ | 14, 16 |
| `zajmeno-jeho-po-predlozce` | zajmeno | po předložce použije *jeho, jemu* místo *něho, němu* (u osobního zájmena) | *šel pro jeho* | „Stojí před zájmenem krátké slovo jako *pro, k, bez*? Řekni to nahlas i s ním.“ | 14 |
| `cislovka-druh-zamena` | cislovka | zamění druh číslovky | *dvoje* → násobná | „Na co se ptáš: kolik? kolikátý? kolikery? kolikrát?“ | 15, 16 |
| `cislovka-hovorovy-tvar` | cislovka | vybere/napíše hovorový tvar *dvouma, třema, čtyřma* (ne u částí těla) | *se třema kamarády* | „Jak to napíšeš v písemce? Řekni řadu: se dvěma, se třemi, se …“ — *pozn.: tahák dává tvar, čistá znalost (jako `bysme-za-bychom`)* | 15, 16, D8 |
| `cislovka-pad-zamena` | cislovka | zamění tvar 2./6. a 3./7. pádu | *se dvou kamarády*, *ke dvou* | „Na jakou otázku to odpovídá: s kým? bez koho? o kom? ke komu?“ | 15, D8 |
| `vid-zamena` | vid | určí dokonavé sloveso jako nedokonavé nebo naopak | *přečíst* → nedokonavé | „Dej to sloveso do neurčitého tvaru a zkus: *budu ___*. Jde to?“ | 18, 19, 20, D9 |
| `bude-s-dokonavym` | vid | utvoří budoucí čas dokonavého slovesa s *budu* | *budu přečíst* | „Jde říct *budu přečíst*? Jak řekneš, že to zítra dokončíš?“ | 18, 20 |
| `rod-trpny-za-byt` | rod | tvar *být* bez příčestí (*byl doma*) určí jako rod trpný | *Lucka byla doma.* → trpný | „Děje se tu s Luckou něco, nebo jen říká, kde je? Je za *byla* tvar na *-n, -t*?“ | 19, D10 |
| `rod-trpny-neuzna` | rod | rod trpný určí jako činný | *Most byl postaven.* → činný | „Dělá to ten, o kom se mluví, nebo se to děje s ním?“ | 19, 20, D10 |
| `prisudek-slovesny-za-jmenny` | prisudek | slovesný přísudek se slovesem *být* (*byla doma*) určí jako jmenný | *Klára byla doma.* → jmenný | „Říká to, jaká nebo kdo Klára je, nebo kde je?“ | 29 |
| `prisudek-jmenny-za-slovesny` | prisudek | jmenný přísudek se sponou určí jako slovesný | *Tomáš je brankář.* → slovesný | „Je za *je* slovo, které říká, kdo nebo jaký podmět je?“ | 29 |
| `prisudek-jmenny-jen-spona` | prisudek | u jmenného přísudku označí jen *je, byl* | *Soused je kuchař.* → přísudek *je* | „Co se o sousedovi říká? Stačí samo *je*?“ | 29 |
| `predmet-za-pu` | clen | předmět určí jako příslovečné určení | *mluvili o výletu* → PU místa | „Zeptej se od slovesa. Hodí se otázka *kde? kdy? jak? proč?*, nebo pádová otázka?“ | 30 |
| `pu-za-predmet` | clen | příslovečné určení určí jako předmět | *včera* → předmět | totéž | 30, 32, D16 |
| `pu-druh-zamena` | clen | zamění druh příslovečného určení | *kvůli dešti* → PU času | „Jakou otázkou se na to zeptáš: kde, kdy, jak, nebo proč?“ | 30 |
| `privlastek-shoda-zamena` | clen | zamění přívlastek shodný a neshodný | *dům u řeky* → shodný | „Změň tvar jména: bez domu … Mění se ten přívlastek s ním?“ | 31 |
| `privlastek-neshodny-za-pu` | clen | přívlastek neshodný určí jako příslovečné určení | *Dům u řeky je starý.* → PU | „Ke kterému slovu to patří: ke jménu, nebo ke slovesu? Zeptej se od něj.“ | 31, D17 |
| `pu-za-privlastek` | clen | příslovečné určení určí jako přívlastek | *čekal u vchodu* → přívlastek | totéž | 31 |
| `veta-hlavni-za-vedlejsi` | souveti | zamění větu hlavní a vedlejší (řídí se pořadím) | *Když pršelo, …* → hlavní | „Kterou z těch vět řekneš samotnou? Kterou začíná slovo jako *že, když, který*?“ | 33, 36 |
| `carka-vlozena-chybi-druha` | carka | u vložené vedlejší věty chybí čárka na jejím konci | *Pes, který štěkal usnul.* | „Kde vedlejší věta končí? Najdi její sloveso a podívej se, co je za ní.“ | 34, 36, D18 |
| `carka-vycet-chybi` | carka | ve výčtu bez spojky chybí čárka | *svačinu pití a pláštěnku* | „Kolik věcí je vyjmenováno? Co je mezi nimi?“ | 35, 36, D20 |
| `carka-chybi-pred-ale` | carka | ve větě jednoduché chybí čárka před *ale* | *malý ale rychlý* | „Spojuje *ale* dvě věci, které jdou spolu, nebo staví jednu proti druhé?“ | 35, D20 |
| `carka-navic-pred-i-ani-nebo` | carka | napíše čárku před *i, ani, nebo* ve slučovacím spojení | *Tomáš, i Lucka* | „Spojuje to slovo jen dvě věci za sebou, podobně jako *a*?“ | 35 |
| `carka-osloveni-chybi` | carka | neoddělí oslovení | *Kláro pojď!* | „Na koho se ve větě volá? Kde to volání končí?“ | 35 |
| `stavba-hranice-zamena` | stavba | určí hranici předpony a kořene jinde | *o\|ddělit* | „Najdi slovo bez předpony, ze kterého je to utvořené. Kde začíná?“ | 37, 39 |
| `stavba-cast-zamena` | stavba | zamění části slova (předponu, kořen, příponu, koncovku) | *přeskoč* → kořen | „Která část zůstane stejná ve všech příbuzných slovech?“ | 40 |
| `zdvojene-chybi` | stavba | na švu napíše jen jednu ze dvou stejných souhlásek | *cený, odělení* | „Rozlož slovo na části. Končí jedna část stejným písmenem, jakým začíná další?“ | 37, 40, D23 |
| `zdvojene-navic` | stavba | napíše dvě souhlásky tam, kde je jedna | *vlnněný* | „Ze kterého slova je utvořené? Kolik *n* má jeho základ a kolik přípona?“ | 37 |
| `u-krouzek-za-carku` | u | napíše *ů* na začátku kořene po předponě | *neůspěch* | „Rozlož slovo. Jak začíná slovo bez předpony?“ | 37 |
| `u-carka-za-krouzek` | u | napíše *ú* uvnitř domácího slova | *dúm* | „Stojí to *ú* na začátku slova, nebo hned za předponou?“ | 37 |
| `s-z-predpona-zamena` | s-z | zamění předponu *s-* a *z-* | *zhodit, sničit* | „Co se tím dějem stane: jde něco dolů nebo dohromady, nebo se něco změní?“ | 38, 40, D22 |
| `skupina-e-za-je` | skupina | napíše *bě, vě* na švu *ob-, v-* + *je-* | *oběvit, věl* | „Rozlož slovo: je na začátku předpona *ob-* nebo *v-*? Jak začíná zbytek?“ | 39, 40, D21 |
| `skupina-je-za-e` | skupina | napíše *bje, vje* bez předpony | *vjeverka* | totéž | 39 |
| `skupina-me-za-mne` | skupina | napíše *mě* tam, kde patří *mně* | *zapoměl, příjemě* | „Najdi příbuzné slovo. Je v něm *mn* nebo *men*?“ | 39, 40, D21 |
| `skupina-mne-za-me` | skupina | napíše *mně* tam, kde patří *mě* | *mněsto, rozumněl* | totéž | 39 |


---

## 18. Nahrávky (návrh)

Soubory `web/audio/cestina/t<t>/l<n>-u<k>.mp3` (poslech) a `t<t>/l<n>-d<v>.mp3` (diktát, věta *v*); řádky do `AUDIO.md` přidá autor úloh při psaní lekce. Hlas a postup podle `AUDIO.md`. Znění níže je návrh metodika; autor smí větu změnit, ale ne jev.

| Lekce | Úloha | Typ | Návrh znění | Poznámka pro hlas |
|---|---|---|---|---|
| L1 | U3 | poslech | Pátý den tábora jsme my dva našli v lese tři houby. | nic nezdůrazňovat |
| L3 | U2 | poslech | Večer jsme šli kolem rybníka a viděli tam dvě volavky. | „Večer“ bez důrazu |
| L5 | U3 | poslech | Na hřišti jsem potkal souseda s dědou a jeho psem. | koncovky *-ou, -em* zřetelně |
| L6 | U3 | poslech | Na náměstí si hrálo kotě s malým štěnětem. | *štěnětem* zřetelně |
| L9 | U3 | poslech | Lucčin dort byl lepší než ten můj. | — |
| L11 | U3 | poslech | Tomášovi rodiče koupili Tomášovi nové kolo. | obě *Tomášovi* stejně, bez důrazu |
| L14 | U3 | poslech | Klára potkala Lucku, podala jí ruku a pozvala ji domů. | **délka *jí* × *ji* musí být slyšet** |
| L15 | U3 | poslech | Na výlet jsme jeli se třema kamarády a se dvěma kamarádkami. | **záměrně hovorové *třema***, neopravovat |
| L17 | U3 | poslech | Večer bysme mohli jít do kina. | **záměrně hovorové *bysme***, neopravovat |
| L18 | U3 | poslech | Zítra napíšu test a potom budu číst knihu. | — |
| L21 | U3 | poslech | První věta: Hodiny na věži začaly bít poledne. Druhá věta: Chtěl bych být brankářem. Třetí věta: Po tréninku si musím umýt ruce. | pauza 1,5 s mezi větami |
| L23 | U3 | poslech | První věta: V lese houká výr. Druhá věta: Ve vodě se točil vír. Třetí věta: Pes celou noc vyl. | *výr, vír* stejně dlouze |
| L25 | U3 | poslech | Na hřišti hráli kluci fotbal. Potom šli domů. | pauza 0,7 s |
| L27 | U3 | poslech | Rodiče čekali před školou. Děti vyběhly ven. Potom spolu šli k autu. | pauza 0,7 s |
| L30 | U3 | poslech | Kvůli dešti jsme v sobotu zůstali doma. | — |
| L31 | U3 | poslech | Kluk s modrou čepicí čekal u vchodu. | bez pauzy za „čepicí“ (pauza by napověděla) |
| L33 | U3 | poslech | Když jsme přišli domů, máma vařila večeři a táta četl noviny. | přirozeně |
| L34 | U2 | poslech | Lucka čte knihu a Tomáš, který přišel pozdě, píše úkol. | přirozeně |
| L38 | U3 | poslech | Lyžaři sjeli z kopce. Listí na podzim zežloutlo. | — |
| L39 | U3 | poslech | Tomáš zapomněl doma klíče. | — |
| L12 | U5 k1 | diktát 3 | Malí kluci čekají na hřišti. · Tomášovy boty jsou nové. · Ten veselý pes je Klářin. | podle AUDIO.md; hlásit „velké písmeno — Tomášovy, Klářin“? [§19 otázka 7] |
| L16 | U5 k1 | diktát 3 | Lucka mně půjčila sešit. · Klára ji pozvala na oslavu. · Dal jsem to oběma bratrům. | *ji* krátce |
| L20 | U5 k1 | diktát 4 | Tomáš by šel ven. · Večer budu číst knihu. · Dům byl postaven loni. · Zavři okno! | rozkaz jen intonací |
| L24 | U5 k1 | diktát 4 | Obyvatelé vesnice bydlí u mlýna. · Brzy ráno slyšíme sýkoru. · Vlk v lese vyl. · Tomáš si umyl ruce. | délky *ý* slyšet |
| L28 | U5 k1 | diktát 4 | Kluci hráli na hřišti fotbal. · Děti seděly u okna. · Rodiče čekali venku. · Auta stála před domem. | — |
| L32 | U5 k1 | diktát 3 | Náš soused je kuchař. · Ten starý dům u řeky je prázdný. · Večer čekal Adam venku. | — |
| L36 | U5 k1 | diktát 3 | Doufám, že Tomáš přijde. · Kluk, který sedí vedle, hraje hokej. · Do batohu dej svetr, bundu a boty. | **čárky se nediktují a pauzy na jejich místě nesmí být delší než mezi slovy** [§19 otázka 4] |
| L40 | U5 k1 | diktát 4 | Táta objednal večeři. · Lucka zapomněla na trénink. · Ten oddíl má cenný pohár. · Klára shodila hrnek na zem. | — |

**Odhad:** 20 nahrávek poslechu + 28 vět diktátu = **48 nahrávek** (+ asi 5 rezervních přegenerování). Diagnostika nahrávky nemá.

---

## 19. Otázky pro vedoucího

1. **Velká písmena a synonyma/antonyma vypuštěny** (§1 bod 7). Souhlasíte? Varianta A: velká písmena jako rezervní 11. téma (jen jednoznačné případy: osoby, zvířata, státy, města, řeky, hory, ulice, *Vánoce, Velikonoce*). Varianta B: nahradit jimi L39 a *bje/vje, mně* přesunout do L37 (L37 by byla přetížená).
2. **Diktát v T2** (koncovky podstatných jmen) by se hodil, zadání říká „od tématu 3“. Přidat do L8?
3. **Společný základ (§2.1):** pády, rod, podmět/přísudek a osoba–číslo–čas považuji za předpoklad, který diagnostika neměří (limit 24 položek). Slabost v pádech se ukáže v rozcvičce L5, L13, L38. Souhlas?
4. **Diktát s čárkami (L36):** `AUDIO.md` říká, že nahrávka čte interpunkci pauzami — pauza prozradí čárku. Navrhuji nahrávku bez pauz na místě čárek. A co přesně hodnotí `hodnotit_interpunkci: true` — jen čárky, nebo i tečku a vykřičník? (V `chyby_ocekavane` plánuji jen čárky.)
5. **Diktát v T8** (L32) měří jen společný základ (větné členy diktát neověří). Nechat podle zadání, nebo nahradit poslechem s určením členů?
6. **Nové kapitoly** (`pridavna-jmena`, `zajmena-cislovky`, `shoda`, `vetne-cleny`, `pravopis`) a **44 nových kódů** (§17) — kdo je zapíše do `obsah/hlasky.md`, `TYPY-CHYB.md`, `obsah/cestina/typy-chyb.json` a `web/js/typy-chyb-cj.js`? Kódy diktátu píšu přímo (např. `koncovka-prid-y-za-i`) podle FORMAT-CJ, ne jako `diktat-pravopis-…`.
7. **Vlastní jména v diktátu:** `AUDIO.md` hlásí „velké písmeno — Tomáš“. Platí to i pro přivlastňovací *Tomášovy, Klářin* (L12)? Navrhuji ano.
8. **`oznac_role` s 9–14 rolemi** (L3, L4: 10 druhů; L8: 14 vzorů; L31: 9 členů) — zvládne to rozhraní na telefonu/počítači čitelně? Pokud ne, rozdělím na kroky po skupinách.
9. **Prahy `semafor_tydne`:** držím ~90 % zelená, ~70 % oranžová (např. 9/10, 7/10). Stejná konvence jako matematika?
10. **Diagnostika:** položka s více mezerami se počítá jen celá (§15). A pravidlo „7 a více slabých → pořadí osnovy“ — souhlas?
11. **Jméno Honzík** má *í* po *z*: mimo T6 ho v diktátu nepoužívám (§2.2). V ostatních úlohách smí být (vytištěné).
