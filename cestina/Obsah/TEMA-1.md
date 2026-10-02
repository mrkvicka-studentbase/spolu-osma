# Téma 1 — Slovní druhy (Spolu 8, lekce 1–4)

Verze 1.0, 1. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, odchylky od osnovy a nové problémy na konci), korektora ÚJČ (tabulka „Ověření ÚJČ“), autora nahrávek (oddíl „Nahrávky“ ke sloučení do `AUDIO.md`).

Lekce jsou rovnou napsané v JSON: `obsah/cestina/lekce/cj-t1-l1.json` až `cj-t1-l4.json`. Tabulky úloh níže jsou vygenerované z těch JSON (data, indexy, správné odpovědi a kódy proto souhlasí); texty taháku, semaforu a tisku jsou v JSON. Forma jako `TYDEN-2.md` ve Spolu: u každé lekce Cíl, Úvod, Platí, Slovníček a tabulka úloh.

## Společné pro celé téma

- **5 úloh** (OSNOVA §3): U1 rozcvička 4 min · U2 nová 5 · U3 nová 5 · U4 detektiv 5 · U5 kontrolní 6 → `cas_min` 25. Poslední krok každé úlohy `final`. `faze: "osma"`, `tyden: 1`, `kapitola: "slovni-druhy"`.
- **Indexy slov** v `klik_ve_textu` a `oznac_role` od 0, interpunkce se nepočítá (tokenizace `vyhodnoceni-cj.js`). V tabulkách jsou vypsané všechny tokeny s indexem, u `oznac_role` i pole `slova`.
- **Hodnoty rolí a dlaždic** (stejné znění všude): `podstatné jméno`, `přídavné jméno`, `zájmeno`, `číslovka`, `sloveso`, `příslovce`, `předložka`, `spojka`, `částice`, `citoslovce`; ohebnost `ano` / `ne` (L4 U1) nebo výběr ohebných či neohebných slov (`dlazdice_vice`).
- **`oznac_role` nejvýš 8 rolí** (ZADANI-OSMA §8 bod 8): L1 U5 a L2 U5 mají 5 rolí; L3 U3 a U5 mají 8 rolí (bez částice a citoslovce, které ve větách nejsou); L4 U5 je rozdělená na krok 1 „ohebná slova“ (5 rolí) a `final` „neohebná slova“ (5 rolí). Proč takto, viz Odchylky od osnovy.
- **Testy, které téma učí** (stejně v taháku i slovníčku): podstatné jméno *ten, ta, to* · přídavné jméno *jaký?* · zájmeno „stojí místo jména, místo *můj, náš* jde říct něčí jméno“ · číslovka *kolik? kolikátý?* · sloveso *on ___* · příslovce *jak? kde? kam? kdy?*, stojí samo · předložka stojí před jménem · spojka spojuje slova nebo věty · částice *kéž, ať* na začátku věty s přáním · citoslovce zvuk nebo výkřik · ohebné = mění tvar (*bez ___, k ___, já/on ___*); stupňování příslovce (*rychle – rychleji*) není změna tvaru.
- **Neurčuje se** (OSNOVA §5, §16): *asi, snad, prý, jen, i, se, si, by, jeden, pětka, stovka, teplo, ráno*, stupňované tvary. V textech úloh se taková slova objevují jen neoznačená (*by, i, až, už, jsme, teplo*). *bohužel* jen u ohebnosti (L4 U2).
- **Jména:** Tomáš, Lucka, Honzík, Klára, Ema (jen vytištěné, žádné se nehodnotí, žádný diktát); detektiv Petr. Oslovení nepoužívám.
- **Kódy chyb** jen z `TYPY-CHYB.md` (oddíl Slovní druhy + Spolu 8 `ohebnost-stupnovani`, `sd-podstatne-za-prislovce`, + `detektiv-*`). Nový kód nenavrhuji. Špatná dlaždice bez kódu = obecná chyba; obecné chyby u množin a rolí se do `zname_chyby` nepíšou (schéma chce `typ_chyby`), vyhodnocení je vrátí jako obecné samo.
- **Poslech** v L1 U3 a L3 U2 (OSNOVA §4); oba kroky úlohy pouštějí stejnou nahrávku. Přepis je jen v JSON (`prepis`) a u rodiče sbalený, v zadání, popisku, otázce ani tisku není (validátor to hlídá).
- **Diktát** v tématu 1 není (OSNOVA §4).

## Cíl tématu

Dítě zařadí slovo do jednoho z deseti slovních druhů **testem** (ne podle toho, jak slovo vypadá), rozliší slova ohebná a neohebná a ví, že druh rozhoduje věta: *kolem rybníka* (předložka) × *projelo kolem* (příslovce), *ten večer* (podstatné jméno) × *přijdu večer* (příslovce).

---

## LEKCE 1 — Ohebné slovní druhy (`cj-t1-l1`) · poslech U3

`tema`: „Ohebné slovní druhy“ · `kapitola`: `slovni-druhy` · `faze` osma · `tyden` 1, `poradi` 1 · `cas_min` 25 · pomůcky: sešit, propiska.

**Cíl:** Dítě rozhodne, zda slovo mění tvar (ohebné), a ohebná slova zařadí do pěti druhů; nezamění zájmeno s podstatným jménem (my) ani s přídavným jménem (můj) a číslovku řadovou s přídavným jménem (pátý).

**Úvod pro rodiče:** Dnes dítě třídí slova na ohebná, která mění tvar (pes – psa – psovi), a neohebná a ohebná zařadí do pěti druhů: podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso.

**Platí:**
1. `Ohebné slovo mění tvar: pes – psa` — co to je (33 znaků)
2. `Zkus: bez ___, k ___, já/on ___` — test (31 znaků)
3. `pátý = číslovka · můj = zájmeno` — příklad (31 znaků)

**Slovníček pro rodiče:**
- *slovní druh* — skupina slov, která se pozná stejným testem; druhů je deset, dnes pět ohebných
- *ohebné slovo* — mění tvar: pes – psa – psovi, my – nás, skočil – skočili; ohebná jsou podstatná a přídavná jména, zájmena, číslovky a slovesa
- *neohebné slovo* — tvar nemění: na, ale, včera, rychle; že jde říct rychle – rychleji, je jen stupňování, škola příslovce přesto řadí k neohebným
- *podstatné jméno* — název osoby, zvířete, věci, vlastnosti nebo činnosti; jde před něj říct ten, ta, to (ten den, ta třída)
- *přídavné jméno* — říká, jaký kdo nebo co je (vysoký, nový); ptáme se jaký?
- *zájmeno* — stojí místo jména nebo na ně ukazuje: já, my, on, můj, náš, ten. Můj a náš odpovídají na čí?, ale jsou to zájmena: místo nich jde říct něčí jméno
- *číslovka* — říká počet nebo pořadí: dva, tři, několik (kolik?), pátý, třetí (kolikátý?)
- *sloveso* — říká, co kdo dělá nebo co se děje; jde říct on ___ (on skočil, ona jela)
- *příslovce* — říká jak, kde nebo kdy (rychle, včera, dobře); je neohebné, dnes je jen past

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Otázky taháku / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4 min) | V řadách A a B vyber podstatné jméno, v řadě C sloveso, v řadě D přídavné jméno. A) hraje, hra, hravý, včera B) rychlý, rychle, zrychlí, rychlost C) plavání, plavecký, plave, dobře D) hlas, hlasitý, hlásí, hlasitě *Měří:* Ledoborec ze společného základu (Z1): poznat podstatné jméno (ten, ta, to), přídavné jméno (jaký?) a sloveso (on ___) a nenechat se zmást slovem, které říká jak nebo kdy. | krok `k1` `dlazdice`, popisek „Řada A“: hraje · hra · hravý · včera<br>krok `k2` `dlazdice`, popisek „Řada B“: rychlý · rychle · zrychlí · rychlost<br>krok `k3` `dlazdice`, popisek „Řada C“: plavání · plavecký · plave · dobře<br>krok `final` `dlazdice`, popisek „Řada D“: hlas · hlasitý · hlásí · hlasitě | k1 hra (pozice b)<br>k2 rychlost (pozice d)<br>k3 plave (pozice c)<br>final hlasitý (pozice b) | k1 hraje → `sd-sloveso-za-podstatne`<br>k1 hravý → `sd-pridavne-za-podstatne`<br>k1 včera → `sd-prislovce-za-podstatne`<br>k2 rychlý → `sd-pridavne-za-podstatne`<br>k2 rychle → `sd-prislovce-za-podstatne`<br>k2 zrychlí → `sd-sloveso-za-podstatne`<br>k3 plavání → `sd-podstatne-za-sloveso`<br>k3 plavecký → `sd-pridavne-za-sloveso`<br>k3 dobře → obecná<br>final hlas → `sd-podstatne-za-pridavne`<br>final hlásí → `sd-sloveso-za-pridavne`<br>final hlasitě → `sd-prislovce-za-pridavne` | A a B: „Řekni nahlas ten, ta nebo to před každé slovo z řady. U kterého to dává smysl samo, bez dalšího slova?“ · C: „Zkus před každé slovo říct on. Které zní jako věta? A u slova plavání: on plavání, nebo to plavání?“ · D: „Polož otázku jaký? k podstatnému jménu z řady. Které slovo na ni odpoví? A na co odpovídá hlasitě?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. V řadě A nebo B vybere hravý, rychlý nebo slovo včera či rychle. Zeptejte se: „Jde říct ta rychle? Ta hravý?“ V řadě C vybere plavání: „Řekneš on plavání, nebo to plavání?“ V řadě D vybere hlas nebo hlasitě: „Jaký hlas?“ |
| 2 | nová (5 min) | Vyber všechna ohebná slova, tedy ta, která mění tvar. *Měří:* Rozhodnout u osmi slov, která mění tvar (ohebná), a nenechat se zmást stupňováním příslovce (rychle – rychleji). | krok `final` `dlazdice_vice`: Tomáš · rychle · skočil · na · dva · náš · ale · vysoký | final Tomáš, skočil, dva, náš, vysoký | final `navic: ["rychle"]` (rychle) → `ohebnost-stupnovani`<br>final ostatní → obecná | „Co znamená, že slovo je ohebné? Řekni to vlastními slovy.“ · „Vezmi slovo dva. Zkus říct bez ___ a se ___. Mění se? A jak je to se slovem na?“ · „Slovo rychle zkus říct v jiném pádě nebo s já, ty, on. Jde to? Je stupňování totéž?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. Navíc je rychle. Zeptejte se: „Řekni rychle v jiném pádě. Jde to? Je stupňování totéž?“ Chybí dva, náš nebo jiné ohebné slovo: „Řekni bez ___ a s ___. Mění se to slovo?“ Navíc na nebo ale: „Dá se to slovo nějak změnit?“ |
| 3 | nová, **poslech** (5 min) | Poslechni si větu. Pak urči slovní druh dvou slov z ní. Nahrávku si můžeš pustit, kolikrát chceš. *Měří:* Ve slyšené větě určit druh slova pátý (číslovka, ne přídavné jméno) a slova my (zájmeno, ne podstatné jméno). | krok `k1` `poslech` `audio/cestina/t1/l1-u3.mp3`, `max_prehrani: 0`, otázka „Jaký slovní druh je slovo „pátý“?“, dlaždice: podstatné jméno · přídavné jméno · zájmeno · číslovka<br>krok `final` `poslech` `audio/cestina/t1/l1-u3.mp3`, `max_prehrani: 0`, otázka „Jaký slovní druh je slovo „my“?“, dlaždice: podstatné jméno · přídavné jméno · zájmeno · číslovka<br>přepis (jen pro rodiče, sbalený): **„Pátý den tábora jsme my dva našli v lese tři houby.“** | k1 číslovka (pozice d)<br>final zájmeno (pozice c) | k1 podstatné jméno → obecná<br>k1 přídavné jméno → `cislovka-za-pridavne`<br>k1 zájmeno → obecná<br>final podstatné jméno → `zajmeno-za-podstatne`<br>final přídavné jméno → obecná<br>final číslovka → obecná | „Jak poznáš číslovku a jak zájmeno? Řekni to vlastními slovy.“ · „Zeptej se na slovo pátý: jaký den, nebo kolikátý den? Která otázka sedí líp?“ · „Slovo my: je to název, nebo to stojí místo jmen? Za koho můžeš říct my?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. V kroku 1 (Slovo „pátý“) vybere přídavné jméno. Zeptejte se: „Ptáš se jaký, nebo kolikátý?“ V kroku 2 (Slovo „my“) vybere podstatné jméno: „Je to jméno věci, nebo to stojí místo jména?“ Vybere jiný druh: „Pusť si větu znovu a zkus test.“ |
| 4 | detektiv (5 min) | Petr měl ve větě určit slovní druhy: Můj kamarád má dva psy. Napsal: **Můj** – přídavné jméno, **kamarád** – podstatné jméno, **dva** – číslovka. Udělal **jednu** chybu. Najdi ji. *Měří:* Najít u Petra přivlastňovací zájmeno (Můj) určené jako přídavné jméno a říct správný druh. | krok `k1` `klik_ve_textu`, `max: 1`, tokeny: Můj(0) kamarád(1) má(2) dva(3) psy(4)<br>krok `final` `dlazdice`, popisek „Jaký druh to slovo je?“: číslovka · zájmeno · sloveso · podstatné jméno | k1 `[0]` (Můj)<br>final zájmeno (pozice b) | k1 `navic: [1, 3]` (kamarád(1), dva(3)) → `detektiv-jine-slovo`<br>k1 ostatní → obecná<br>final číslovka → `detektiv-oprava-jine-chyby`<br>final sloveso → `detektiv-oprava-jine-chyby`<br>final podstatné jméno → `detektiv-oprava-jine-chyby` | Celá úloha: „Řekni mi vlastními slovy, co je zájmeno. Která tři slova Petr určil?“ · Krok 1: „Projdi Petrova slova jedno po druhém. U každého řekni test, podle kterého ten druh poznáš. Sedí všude?“ · Krok 1 a 2: „Které Petrovo slovo odpovídá na čí? Zkus místo něj říct něčí jméno. Jaký druh to potom je?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. Klikne na kamarád nebo dva. Zeptejte se: „Jde říct ten kamarád? Kolik psů?“ (Petr to má dobře.) Klikne na Můj, ale v kroku 2 zvolí jiný druh: „Dá se místo toho slova říct něčí jméno? Zkus to.“ |
| 5 | kontrolní (6 min) | U každého označeného slova vyber slovní druh. *Měří:* Samostatně určit pět ohebných druhů u šesti slov ve dvou větách, včetně pastí Naše, Třetí a několik. | krok `final` `oznac_role` (5 rolí: podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso), popisek „Tvoje odpověď“; tokeny: Naše(0) třída(1) jela(2) na(3) výlet(4) do(5) hor(6) Třetí(7) den(8) jsme(9) potkali(10) několik(11) nových(12) kamarádů(13); `slova: [0, 1, 2, 7, 11, 12]` | final Naše(0) zájmeno · třída(1) podstatné jméno · jela(2) sloveso · Třetí(7) číslovka · několik(11) číslovka · nových(12) přídavné jméno | final `{"0": "přídavné jméno"}` (Naše(0) → přídavné jméno) → `zajmeno-za-pridavne`<br>final `{"7": "přídavné jméno"}` (Třetí(7) → přídavné jméno) → `cislovka-za-pridavne`<br>final `{"11": "zájmeno"}` (několik(11) → zájmeno) → `cislovka-jen-cislice`<br>final `{"11": "přídavné jméno"}` (několik(11) → přídavné jméno) → `cislovka-jen-cislice`<br>final ostatní → obecná | „Řekni mi vlastními slovy, jak poznáš pět ohebných druhů.“ · „Vezmi slovo, u kterého váháš. Zeptej se na něj: ten? jaký? kolik? kolikátý? on ___? Která otázka sedí?“ · „Vezmi slova Naše a několik. U prvního zkus místo něj říct něčí jméno, u druhého se zeptej kolik?, nebo jaký?“<br>*Typická chyba:* Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: Naše jako přídavné jméno: „Dá se místo toho slova říct něčí jméno?“ Třetí jako přídavné jméno: „Ptáš se jaký, nebo kolikátý?“ několik jako zájmeno nebo přídavné jméno: „Odpovídá to na kolik?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Řešení kontrolní úlohy (pro recenzenta):** Naše: zájmeno (místo něj jde říct něčí jméno); třída: podstatné jméno (ta třída); jela: sloveso (ona jela); Třetí: číslovka (kolikátý den?); několik: číslovka (kolik kamarádů?); nových: přídavné jméno (jakých kamarádů?); výsledek: zájmeno, podstatné jméno, sloveso, číslovka, číslovka, přídavné jméno

Poznámky k L1:
- U1 má čtyři řady ze společného základu Z1 (rodiny slov hra/hraje/hravý, rychlost/rychlý/zrychlí, plavání/plave, hlas/hlasitý/hlásí) a v každé řadě past „jak? kdy?“ (včera, rychle, dobře, hlasitě). Otázky taháku po řadách `A a B`, `C`, `D`.
- U2: obecné chyby (chybí *dva*, *náš*, navíc *na*, *ale*) nejsou v `zname_chyby` (schéma vyžaduje kód); vyhodnocení je vrátí jako obecné, tahák je zmiňuje.
- U3: poslech, oba kroky pouštějí stejnou nahrávku, otázka kroku je v poli `otazka` (bez přepisu).
- U5: *několik* má dvě známé chyby (zájmeno i přídavné jméno → `cislovka-jen-cislice`).

---

## LEKCE 2 — Neohebné slovní druhy (`cj-t1-l2`)

`tema`: „Neohebné slovní druhy“ · `kapitola`: `slovni-druhy` · `faze` osma · `tyden` 1, `poradi` 2 · `cas_min` 25 · pomůcky: sešit, propiska.

**Cíl:** Dítě rozliší pět neohebných druhů testem: příslovce (jak? kde? kdy? u slovesa), předložka (stojí před jménem), spojka (spojuje slova nebo věty), částice (přání na začátku věty: kéž, ať), citoslovce (zvuk, výkřik).

**Úvod pro rodiče:** Dnes dítě poznává pět druhů slov, která tvar nemění (příslovce, předložka, spojka, částice, citoslovce), a u každého zkouší jeho test.

**Platí:**
1. `Příslovce: jak? kde? kdy? (venku)` — co to je (33 znaků)
2. `Předložka stojí před jménem: na` — test (31 znaků)
3. `ale = spojka · kéž = částice` — příklad (28 znaků)

**Slovníček pro rodiče:**
- *neohebné slovo* — slovo, které nemění tvar (venku, pod, ale, kéž, hurá); neohebné druhy jsou příslovce, předložka, spojka, částice a citoslovce
- *příslovce* — říká jak, kde, kam, kdy (rychle, venku, dolů, zítra); stojí samo, většinou u slovesa
- *předložka* — krátké slovo, které stojí před jménem: na stole, pod stolem, k babičce, kolem rybníka
- *spojka* — spojuje slova nebo věty: a, ale, nebo
- *částice* — tady jen kéž a ať na začátku věty, která vyjadřuje přání (Kéž by už byl pátek!)
- *citoslovce* — zvuk nebo výkřik: hurá, fuj, bum
- *ohebné slovo* — slovo, které mění tvar (kniha – bez knihy); téma minulé lekce
- *zájmeno* — stojí místo jména (on, my, můj, náš); z minulé lekce
- *číslovka* — říká počet nebo pořadí (dva, několik, třetí, pátý); z minulé lekce

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Otázky taháku / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4 min) | Najdi v řadě A zájmeno, v řadě B číslovku, v řadě C ohebné slovo a v řadě D přídavné jméno. A) kamarád, on, dobrý, dnes B) třída, třetí, nový, dolů C) rychle, včera, kniha, venku D) můj, pátý, modrý, moře *Měří:* Ledoborec z lekce 1: najít zájmeno, číslovku, ohebné slovo a přídavné jméno; pasti můj a pátý (mění se jako přídavná jména) a rychle (jde stupňovat). | krok `k1` `dlazdice`, popisek „Řada A“: kamarád · on · dobrý · dnes<br>krok `k2` `dlazdice`, popisek „Řada B“: třída · třetí · nový · dolů<br>krok `k3` `dlazdice`, popisek „Řada C“: rychle · včera · kniha · venku<br>krok `final` `dlazdice`, popisek „Řada D“: můj · pátý · modrý · moře | k1 on (pozice b)<br>k2 třetí (pozice b)<br>k3 kniha (pozice c)<br>final modrý (pozice c) | k1 kamarád → obecná<br>k1 dobrý → obecná<br>k1 dnes → obecná<br>k2 třída → obecná<br>k2 nový → obecná<br>k2 dolů → obecná<br>k3 rychle → `ohebnost-stupnovani`<br>k3 včera → obecná<br>k3 venku → obecná<br>final můj → `zajmeno-za-pridavne`<br>final pátý → `cislovka-za-pridavne`<br>final moře → `sd-podstatne-za-pridavne` | A a B: „Které slovo z řady A může stát místo jména? A na které slovo z řady B se zeptáš kolikátý?“ · C: „Zkus každé slovo říct v jiném tvaru: bez ___, ke ___. Které se změní? Je rychleji jiný tvar?“ · D: „Zeptej se jaký? U slova můj zkus místo něj říct něčí jméno, u slova pátý otázku kolikátý?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. V řadě D vybere můj nebo pátý. Zeptejte se: „Dá se místo toho slova říct něčí jméno? Ptáš se jaký, nebo kolikátý?“ V řadě C vybere rychle: „Je stupňování totéž jako jiný tvar?“ V řadě A vybere kamarád: „Je to jméno, nebo stojí místo jména?“ |
| 2 | nová (5 min) | Urči slovní druh tučného slova. A) Pes čeká **venku**. B) Kočka spí **pod** stolem. C) Byla zima, **ale** svítilo slunce. D) **Kéž** by už byl pátek! *Měří:* Přiřadit k tučnému slovu ve větě jeden z pěti neohebných druhů podle jeho testu. | krok `k1` `dlazdice`, popisek „A) venku“: příslovce · předložka · spojka · částice · citoslovce<br>krok `k2` `dlazdice`, popisek „B) pod“: příslovce · předložka · spojka · částice · citoslovce<br>krok `k3` `dlazdice`, popisek „C) ale“: příslovce · předložka · spojka · částice · citoslovce<br>krok `final` `dlazdice`, popisek „D) Kéž“: příslovce · předložka · spojka · částice · citoslovce | k1 příslovce (pozice a)<br>k2 předložka (pozice b)<br>k3 spojka (pozice c)<br>final částice (pozice d) | k1 předložka → `prislovce-za-predlozku`<br>k1 spojka → obecná<br>k1 částice → obecná<br>k1 citoslovce → obecná<br>k2 příslovce → `predlozka-za-prislovce`<br>k2 spojka → obecná<br>k2 částice → obecná<br>k2 citoslovce → obecná<br>k3 příslovce → obecná<br>k3 předložka → obecná<br>k3 částice → `spojka-za-castici`<br>k3 citoslovce → obecná<br>final příslovce → obecná<br>final předložka → obecná<br>final spojka → `spojka-za-castici`<br>final citoslovce → obecná | „Řekni vlastními slovy, jak poznáš příslovce a jak předložku.“ · „U slova pod: stojí samo, nebo před nějakým jménem? A slovo venku?“ · „Ve větě D: spojuje Kéž dvě věci, nebo vyjadřuje přání? A co dělá ale ve větě C?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. U A zvolí předložku nebo u B příslovce. Zeptejte se: „Stojí to slovo před nějakým jménem, nebo samo?“ U C zvolí částici nebo u D spojku: „Spojuje to dvě věci, nebo vyjadřuje přání?“ Zvolí citoslovce: „Je to zvuk nebo výkřik?“ |
| 3 | nová (5 min) | Jaký slovní druh je slovo **kolem**? A) Auto projelo **kolem**. B) Šli jsme **kolem** rybníka. *Měří:* Poznat, že o druhu slova kolem rozhoduje věta: stojí samo (příslovce), nebo před jménem (předložka). | krok `k1` `dlazdice`, popisek „A) Auto projelo **kolem**.“: příslovce · předložka<br>krok `final` `dlazdice`, popisek „B) Šli jsme **kolem** rybníka.“: příslovce · předložka | k1 příslovce (pozice a)<br>final předložka (pozice b) | k1 předložka → `prislovce-za-predlozku`<br>final příslovce → `predlozka-za-prislovce` | „Řekni vlastními slovy, čím se liší příslovce a předložka.“ · „Ve větě A: stojí za slovem kolem nějaké jméno? A ve větě B?“ · „Ve větě B se zeptej: kolem čeho šli? Je ta odpověď ve větě? A ve větě A?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. V obou krocích zvolí stejný druh. Zeptejte se: „Stojí to slovo před nějakým jménem, nebo samo?“ V kroku 2 (B) zvolí příslovce: „Kolem čeho šli? Je to slovo ve větě?“ (Je, rybníka, proto předložka.) |
| 4 | detektiv (5 min) | Petr měl ve větě určit slovní druhy: Honzík běžel rychle dolů, ale autobus mu ujel. Napsal: **rychle** – přídavné jméno, **dolů** – příslovce, **ale** – spojka. Udělal **jednu** chybu. Najdi ji. *Měří:* Najít u Petra příslovce rychle určené jako přídavné jméno a říct správný druh. | krok `k1` `klik_ve_textu`, `max: 1`, tokeny: Honzík(0) běžel(1) rychle(2) dolů(3) ale(4) autobus(5) mu(6) ujel(7)<br>krok `final` `dlazdice`, popisek „Jaký druh to slovo je?“: spojka · příslovce · předložka · přídavné jméno | k1 `[2]` (rychle)<br>final příslovce (pozice b) | k1 `navic: [3, 4]` (dolů(3), ale(4)) → `detektiv-jine-slovo`<br>k1 ostatní → obecná<br>final spojka → `detektiv-oprava-jine-chyby`<br>final předložka → `detektiv-oprava-jine-chyby`<br>final přídavné jméno → `sd-prislovce-za-pridavne` | Celá úloha: „Řekni mi vlastními slovy, jak poznáš příslovce. Která tři slova Petr určil?“ · Krok 1: „U každého Petrova slova zkus jeho test: jaký? jak? kam? spojuje něco? Sedí všude?“ · Krok 1 a 2: „Které Petrovo slovo zní jako přídavné jméno? Zeptej se na ně: běžel jaký, nebo běžel jak?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. Klikne na dolů nebo ale. Zeptejte se: „Kam běžel? Co spojuje ale?“ (Petr to má dobře.) V kroku 2 zvolí přídavné jméno: „Ptáš se jaký, nebo jak?“ Zvolí spojku nebo předložku: „Stojí to slovo před jménem? Spojuje něco?“ |
| 5 | kontrolní (6 min) | U každého označeného slova vyber slovní druh. *Měří:* Samostatně určit pět neohebných druhů u šesti slov ve dvou větách (k před jménem, Kéž s přáním, a mezi dvěma slovy). | krok `final` `oznac_role` (5 rolí: příslovce, předložka, spojka, částice, citoslovce), popisek „Tvoje odpověď“; tokeny: Hurá(0) zítra(1) pojedeme(2) k(3) babičce(4) Kéž(5) by(6) bylo(7) hezky(8) a(9) teplo(10); `slova: [0, 1, 3, 5, 8, 9]` | final Hurá(0) citoslovce · zítra(1) příslovce · k(3) předložka · Kéž(5) částice · hezky(8) příslovce · a(9) spojka | final `{"5": "spojka"}` (Kéž(5) → spojka) → `spojka-za-castici`<br>final `{"9": "částice"}` (a(9) → částice) → `spojka-za-castici`<br>final `{"3": "příslovce"}` (k(3) → příslovce) → `predlozka-za-prislovce`<br>final `{"1": "předložka"}` (zítra(1) → předložka) → `prislovce-za-predlozku`<br>final ostatní → obecná | „Řekni mi vlastními slovy, jak poznáš pět neohebných druhů.“ · „Vezmi slovo, u kterého váháš. Stojí před jménem? Odpovídá na jak, kde, kdy? Spojuje něco? Je to přání, nebo výkřik?“ · „Podívej se na krátká slova k a a. Které z nich stojí před jménem a které něco spojuje?“<br>*Typická chyba:* Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: Kéž jako spojka nebo a jako částice: „Spojuje to dvě věci, nebo vyjadřuje přání?“ k jako příslovce: „Stojí to samo, nebo před nějakým jménem?“ zítra jako předložka: „Stojí za ním jméno?“ Hurá jako jiný druh: „Je to výkřik?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Řešení kontrolní úlohy (pro recenzenta):** Hurá: citoslovce (výkřik radosti); zítra: příslovce (pojedeme kdy?); k: předložka (stojí před jménem: k babičce); Kéž: částice (uvádí přání); hezky: příslovce (bylo jak?); a: spojka (spojuje hezky a teplo); výsledek: citoslovce, příslovce, předložka, částice, příslovce, spojka

Poznámky k L2:
- U1 opakuje L1; kódy jen tam, kde jsou pasti (řada C *rychle*, řada D *můj, pátý, moře*), ostatní špatné dlaždice jsou obecná chyba.
- U2 je přiřazení: 4 kroky se stejnou nabídkou ve stejném pořadí (příslovce · předložka · spojka · částice · citoslovce).
- U3 má podle osnovy jen dvě dlaždice (příslovce · předložka).
- U5: *teplo* je záměrně neoznačené (příručka: teplo s. i přísl.).

---

## LEKCE 3 — Všech deset druhů: rozhoduje věta (`cj-t1-l3`) · poslech U2

`tema`: „Všech deset druhů: rozhoduje věta“ · `kapitola`: `slovni-druhy` · `faze` osma · `tyden` 1, `poradi` 3 · `cas_min` 25 · pomůcky: sešit, propiska.

**Cíl:** Dítě zařadí slovo do jednoho z deseti druhů podle toho, jak je ve větě použité (kolem, večer), a u každého řekne test, podle kterého to poznalo.

**Úvod pro rodiče:** Dnes dítě zjistí, že stejné slovo může být v různých větách jiný druh (ten večer × přijdu večer, kolem rybníka × projel kolem), a druh pozná testem přímo ve větě.

**Platí:**
1. `Druh určuje věta, ne slovo samo` — co to je (31 znaků)
2. `Jde před to říct ten? Ptám se kdy?` — test (34 znaků)
3. `ten večer × přišel večer` — příklad (24 znaků)

**Slovníček pro rodiče:**
- *slovní druh* — skupina slov se stejným testem; je jich deset: pět ohebných (podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso) a pět neohebných (příslovce, předložka, spojka, částice, citoslovce)
- *podstatné jméno* — název; jde před něj říct ten, ta, to (ten večer, ta hra)
- *příslovce* — říká jak, kde, kam, kdy (dlouho, venku, domů, večer ve větě Přijdu večer); stojí samo
- *předložka* — stojí před jménem (kolem rybníka, s Tomášem, na stole)
- *zájmeno* — stojí místo jména nebo na ně ukazuje (ten, náš, my)
- *číslovka* — říká počet nebo pořadí (dvě, tři, pátý)
- *spojka* — spojuje slova nebo věty (a, ale, nebo)
- *částice* — tady jen kéž a ať na začátku věty s přáním
- *citoslovce* — zvuk nebo výkřik (fuj, hurá)

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Otázky taháku / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4 min) | Urči slovní druh tučného slova. A) Kočka seskočila **dolů**. B) Kniha leží **na** stole. C) Chceš čaj, **nebo** kakao? D) **Fuj**, to je kyselé! *Měří:* Ledoborec z lekce 2: určit neohebný druh tučného slova ve větě (dolů, na, nebo, Fuj). | krok `k1` `dlazdice`, popisek „Řada A“: příslovce · předložka · spojka · částice · citoslovce<br>krok `k2` `dlazdice`, popisek „Řada B“: příslovce · předložka · spojka · částice · citoslovce<br>krok `k3` `dlazdice`, popisek „Řada C“: příslovce · předložka · spojka · částice · citoslovce<br>krok `final` `dlazdice`, popisek „Řada D“: příslovce · předložka · spojka · částice · citoslovce | k1 příslovce (pozice a)<br>k2 předložka (pozice b)<br>k3 spojka (pozice c)<br>final citoslovce (pozice e) | k1 předložka → `prislovce-za-predlozku`<br>k1 spojka → obecná<br>k1 částice → obecná<br>k1 citoslovce → obecná<br>k2 příslovce → `predlozka-za-prislovce`<br>k2 spojka → obecná<br>k2 částice → obecná<br>k2 citoslovce → obecná<br>k3 příslovce → obecná<br>k3 předložka → obecná<br>k3 částice → `spojka-za-castici`<br>k3 citoslovce → obecná<br>final příslovce → obecná<br>final předložka → obecná<br>final spojka → obecná<br>final částice → obecná | A a B: „Stojí tučné slovo před nějakým jménem, nebo samo? Na co se ptáš: kde, nebo kam?“ · C: „Co dělá slovo nebo: spojuje dvě věci, nebo vyjadřuje přání?“ · D: „Co je Fuj: zvuk nebo výkřik, nebo slovo, které něco spojuje?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. V řadě A zvolí předložku nebo v řadě B příslovce. Zeptejte se: „Stojí to samo, nebo před nějakým jménem?“ V řadě C zvolí částici: „Spojuje to dvě věci, nebo vyjadřuje přání?“ V řadě D zvolí jiný druh: „Je to výkřik?“ |
| 2 | nová, **poslech** (5 min) | Poslechni si větu. Pak urči slovní druh dvou slov z ní. Nahrávku si můžeš pustit, kolikrát chceš. *Měří:* Ve slyšené větě určit druh slov večer (příslovce: kdy?) a kolem (předložka: kolem rybníka) podle toho, jak jsou ve větě použitá. | krok `k1` `poslech` `audio/cestina/t1/l3-u2.mp3`, `max_prehrani: 0`, otázka „Jaký slovní druh je ve větě slovo „večer“?“, dlaždice: podstatné jméno · příslovce · předložka · číslovka<br>krok `final` `poslech` `audio/cestina/t1/l3-u2.mp3`, `max_prehrani: 0`, otázka „Jaký slovní druh je ve větě slovo „kolem“?“, dlaždice: podstatné jméno · příslovce · předložka · číslovka<br>přepis (jen pro rodiče, sbalený): **„Večer jsme šli kolem rybníka a viděli tam dvě volavky.“** | k1 příslovce (pozice b)<br>final předložka (pozice c) | k1 podstatné jméno → `sd-prislovce-za-podstatne`<br>k1 předložka → obecná<br>k1 číslovka → obecná<br>final podstatné jméno → obecná<br>final příslovce → `predlozka-za-prislovce`<br>final číslovka → obecná | „Jak poznáš, jaký druh slovo je, když ho slyšíš ve větě? Řekni to vlastními slovy.“ · „Zkus slovo večer: šli jsme kdy? Šlo by v té větě říct ten večer?“ · „Pusť si větu znovu. Stojí za slovem kolem nějaké jméno? Co to o slově kolem říká?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. V kroku 1 (Slovo „večer“) zvolí podstatné jméno. Zeptejte se: „Říká to slovo, kdy jsme šli? Šlo by tam říct ten večer?“ V kroku 2 (Slovo „kolem“) zvolí příslovce: „Stojí to samo, nebo před nějakým jménem?“ Číslovku zvolí málokdo: „Odpovídá to na kolik?“ |
| 3 | nová (5 min) | U každého označeného slova vyber slovní druh. *Měří:* V jedné větě určit druh šesti slov z nabídky osmi druhů, včetně slova večer jako podstatného jména (ten večer). | krok `final` `oznac_role` (8 rolí: podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso, příslovce, předložka, spojka), popisek „Tvoje odpověď“; tokeny: Ten(0) večer(1) jsme(2) s(3) Tomášem(4) dlouho(5) hráli(6) dvě(7) hry(8); `slova: [0, 1, 3, 5, 7, 8]` | final Ten(0) zájmeno · večer(1) podstatné jméno · s(3) předložka · dlouho(5) příslovce · dvě(7) číslovka · hry(8) podstatné jméno | final `{"1": "příslovce"}` (večer(1) → příslovce) → `sd-podstatne-za-prislovce`<br>final `{"0": "přídavné jméno"}` (Ten(0) → přídavné jméno) → `zajmeno-za-pridavne`<br>final `{"7": "přídavné jméno"}` (dvě(7) → přídavné jméno) → `cislovka-za-pridavne`<br>final `{"3": "příslovce"}` (s(3) → příslovce) → `predlozka-za-prislovce`<br>final ostatní → obecná | „Řekni mi vlastními slovy, proč může být jedno slovo v různých větách jiný druh.“ · „Vezmi slovo večer. Je před ním ten? Jde na něj ukázat jako na věc?“ · „U slov Ten a dvě se zeptej: jaký? kolik? Nebo na něco ukazují? Která otázka sedí?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. Večer označí jako příslovce. Zeptejte se: „Je před tím slovem ten? Jde na něj ukázat jako na věc?“ Ten nebo dvě jako přídavné jméno: „Ptáš se jaký? Kolik her?“ s jako příslovce: „Stojí to samo, nebo před jménem?“ |
| 4 | detektiv (5 min) | Petr měl ve větě určit slovní druhy: Klára přišla domů pozdě večer. Napsal: **přišla** – sloveso, **domů** – příslovce, **večer** – podstatné jméno. Udělal **jednu** chybu. Najdi ji. *Měří:* Najít u Petra slovo večer určené jako podstatné jméno tam, kde odpovídá na kdy? (příslovce). | krok `k1` `klik_ve_textu`, `max: 1`, tokeny: Klára(0) přišla(1) domů(2) pozdě(3) večer(4)<br>krok `final` `dlazdice`, popisek „Jaký druh to slovo je?“: sloveso · podstatné jméno · příslovce · předložka | k1 `[4]` (večer)<br>final příslovce (pozice c) | k1 `navic: [1, 2]` (přišla(1), domů(2)) → `detektiv-jine-slovo`<br>k1 ostatní → obecná<br>final sloveso → `detektiv-oprava-jine-chyby`<br>final podstatné jméno → `sd-prislovce-za-podstatne`<br>final předložka → `detektiv-oprava-jine-chyby` | Celá úloha: „Řekni mi vlastními slovy, podle čeho poznáš, jestli je slovo podstatné jméno, nebo příslovce.“ · Krok 1: „U každého Petrova slova zkus jeho test: ona ___? kam? ten? Sedí všude?“ · Krok 1 a 2: „Které Petrovo slovo odpovídá na kdy? Šlo by před něj v té větě říct ten?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. Klikne na přišla nebo domů. Zeptejte se: „Jde říct ona přišla? Přišla kam?“ (Petr to má dobře.) Klikne na večer, ale v kroku 2 zvolí podstatné jméno nebo jiný druh: „Šlo by v té větě říct ten večer? Na co slovo odpovídá?“ |
| 5 | kontrolní (6 min) | U každého označeného slova vyber slovní druh. *Měří:* Samostatně určit druh osmi slov ve dvou větách se všemi pastmi tématu (Náš, pátý, večer, kolem, venku). | krok `final` `oznac_role` (8 rolí: podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso, příslovce, předložka, spojka), popisek „Tvoje odpověď“; tokeny: Náš(0) pátý(1) trénink(2) začal(3) až(4) večer(5) Běhali(6) jsme(7) kolem(8) hřiště(9) ale(10) venku(11) už(12) byla(13) tma(14); `slova: [0, 1, 2, 5, 6, 8, 10, 11]` | final Náš(0) zájmeno · pátý(1) číslovka · trénink(2) podstatné jméno · večer(5) příslovce · Běhali(6) sloveso · kolem(8) předložka · ale(10) spojka · venku(11) příslovce | final `{"5": "podstatné jméno"}` (večer(5) → podstatné jméno) → `sd-prislovce-za-podstatne`<br>final `{"8": "příslovce"}` (kolem(8) → příslovce) → `predlozka-za-prislovce`<br>final `{"0": "přídavné jméno"}` (Náš(0) → přídavné jméno) → `zajmeno-za-pridavne`<br>final `{"1": "přídavné jméno"}` (pátý(1) → přídavné jméno) → `cislovka-za-pridavne`<br>final ostatní → obecná | „Řekni mi vlastními slovy, jak poznáš druh slova, které může být v různých větách různé.“ · „Vezmi slovo, u kterého váháš. Zkus ten?, jaký?, kolik?, on ___?, kdy?, a jestli stojí před jménem. Co sedí?“ · „Porovnej slova kolem a venku: stojí některé před jménem? A slovo večer: šlo by před něj říct ten?“<br>*Typická chyba:* Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: večer jako podstatné jméno: „Šlo by v té větě říct ten večer?“ kolem jako příslovce: „Stojí to slovo před jménem?“ Náš nebo pátý jako přídavné jméno: „Jde místo toho říct něčí jméno? Kolikátý?“ venku jako předložka: „Stojí samo?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Řešení kontrolní úlohy (pro recenzenta):** Náš: zájmeno (místo něj jde říct něčí jméno); pátý: číslovka (kolikátý trénink?); trénink: podstatné jméno (ten trénink); večer: příslovce (začal kdy?); Běhali: sloveso (oni běhali); kolem: předložka (před jménem: kolem hřiště); ale: spojka (spojuje dvě věty); venku: příslovce (kde? stojí samo); výsledek: zájmeno, číslovka, podstatné jméno, příslovce, sloveso, předložka, spojka, příslovce

Poznámky k L3:
- U3 a U5: `oznac_role` s 8 rolemi (bez částice a citoslovce, které ve větách nejsou), viz Odchylky.
- U5 má pět pastí, `zname_chyby` nejvýš 4: *venku → předložka* (`prislovce-za-predlozku`) zůstává obecnou chybou, v typické chybě taháku je.
- U1 D: *Fuj* (ne *Au*, viz Ověření ÚJČ).

---

## LEKCE 4 — Kontrola tématu: slovní druhy (`cj-t1-l4`), bez diktátu

`tema`: „Kontrola tématu: slovní druhy“ · `kapitola`: `slovni-druhy` · `faze` osma · `tyden` 1, `poradi` 4 · `cas_min` 25 · pomůcky: sešit, propiska.

**Cíl:** Dítě v krátkém textu samo určí druh u deseti slov (každý druh jednou) a u neohebných slov řekne, proč se nemění.

**Úvod pro rodiče:** Dnes se nic nového neučí: dítě ukáže, že samo pozná všech deset slovních druhů a ví, která slova mění tvar.

**Platí:**
1. `Ohebné: 5 druhů, neohebné: 5 druhů` — co to je (34 znaků)
2. `Test: ten? jaký? on ___? kolik? kde?` — test (36 znaků)
3. `kolem domu = předložka` — příklad (22 znaků)

**Slovníček pro rodiče:**
- *ohebné druhy* — mění tvar: podstatné jméno (ten tým), přídavné jméno (jaký? silný), zájmeno (náš, můj, on), číslovka (kolik? několik, kolikátý? třetí), sloveso (on vyhrál)
- *neohebné druhy* — tvar nemění: příslovce (jak? kde? kdy? dnes, rychle), předložka (před jménem: v sobotě, kolem domu), spojka (a, ale, nebo), částice (kéž, ať s přáním), citoslovce (hurá, bum)
- *stupňování* — rychle – rychleji: příslovce jde stupňovat, ale škola ho přesto řadí k neohebným, protože nemění tvar podle pádu ani osoby
- *druh určuje věta* — stejné slovo může být jiný druh: kolem domu (předložka) × jel kolem (příslovce), ten večer (podstatné jméno) × přijdu večer (příslovce)

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Otázky taháku / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (4 min) | A) Je slovo „rychle“ ohebné? B) Lucka šla **kolem** a nepozdravila. Jaký druh je kolem? C) Ve třídě chybí **několik** žáků. Jaký druh je několik? D) **Ať** se ti daří! Jaký druh je ať? *Měří:* Ledoborec z lekcí 1–3: ohebnost slova rychle, druh slov kolem (samo), několik a ať (přání). | krok `k1` `dlazdice`, popisek „Řada A“: ano · ne<br>krok `k2` `dlazdice`, popisek „Řada B“: příslovce · předložka · spojka · částice<br>krok `k3` `dlazdice`, popisek „Řada C“: číslovka · zájmeno · přídavné jméno · příslovce<br>krok `final` `dlazdice`, popisek „Řada D“: spojka · částice · příslovce · citoslovce | k1 ne (pozice b)<br>k2 příslovce (pozice a)<br>k3 číslovka (pozice a)<br>final částice (pozice b) | k1 ano → `ohebnost-stupnovani`<br>k2 předložka → `prislovce-za-predlozku`<br>k2 spojka → obecná<br>k2 částice → obecná<br>k3 zájmeno → `cislovka-jen-cislice`<br>k3 přídavné jméno → `cislovka-jen-cislice`<br>k3 příslovce → obecná<br>final spojka → `spojka-za-castici`<br>final příslovce → obecná<br>final citoslovce → obecná | A a B: „Zkus rychle říct v jiném pádě nebo s já, on. Jde to? A stojí za slovem kolem nějaké jméno?“ · C: „Na co odpovídá několik: kolik?, jaký?, nebo kde? Který druh se ptá stejně?“ · D: „Spojuje Ať dvě věty, nebo vyjadřuje přání?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. V řadě A zvolí ano. Zeptejte se: „Je stupňování totéž jako jiný pád?“ V řadě B předložku: „Stojí za ním jméno?“ V řadě C zájmeno nebo přídavné jméno: „Odpovídá to na kolik?“ V řadě D spojku: „Spojuje to dvě věty, nebo je to přání?“ |
| 2 | nová (5 min) | Vyber všechna neohebná slova, tedy ta, která tvar nemění. *Měří:* Vybrat z osmi slov všechna neohebná, i rychle (stupňuje se, ale tvar nemění) a bohužel; dva nechat stranou (mění tvar). | krok `final` `dlazdice_vice`: rychle · dva · bohužel · pod · kamarád · hurá · nebo · psal | final rychle, bohužel, pod, hurá, nebo | final `chybi: ["rychle"]` (rychle) → `ohebnost-stupnovani`<br>final ostatní → obecná | „Co znamená, že slovo je neohebné? Řekni to vlastními slovy.“ · „Vezmi slovo dva. Řekni bez ___ a se ___. Mění se? A slovo pod?“ · „Slovo rychle: jde ho říct v jiném pádě nebo s já, on? Je rychleji jiný tvar, nebo jen stupňování?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. Chybí rychle. Zeptejte se: „Zkus rychle říct v jiném pádě. Jde to? Je stupňování totéž?“ Navíc dva: „Řekni bez ___ a se ___. Mění se?“ Chybí bohužel nebo hurá: „Dá se to slovo nějak změnit?“ Navíc kamarád nebo psal: „Řekni bez kamaráda, oni psali.“ |
| 3 | nová (5 min) | Urči slovní druh tučného slova. A) **Náš** pes rád plave. B) Lucka skončila v závodě **třetí**. C) Přijdu **večer**. D) **Ať** zítra vyhrajeme! *Měří:* Určit druh u čtyř pastí tématu ve větě: Náš (zájmeno), třetí (číslovka), večer (kdy? příslovce) a Ať (přání, částice). | krok `k1` `dlazdice`, popisek „A) Náš“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice<br>krok `k2` `dlazdice`, popisek „B) třetí“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice<br>krok `k3` `dlazdice`, popisek „C) večer“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice<br>krok `final` `dlazdice`, popisek „D) Ať“: přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice | k1 zájmeno (pozice b)<br>k2 číslovka (pozice c)<br>k3 příslovce (pozice e)<br>final částice (pozice f) | k1 přídavné jméno → `zajmeno-za-pridavne`<br>k1 číslovka → obecná<br>k1 podstatné jméno → obecná<br>k1 příslovce → obecná<br>k1 částice → obecná<br>k2 přídavné jméno → `cislovka-za-pridavne`<br>k2 zájmeno → obecná<br>k2 podstatné jméno → obecná<br>k2 příslovce → obecná<br>k2 částice → obecná<br>k3 přídavné jméno → obecná<br>k3 zájmeno → obecná<br>k3 číslovka → obecná<br>k3 podstatné jméno → `sd-prislovce-za-podstatne`<br>k3 částice → obecná<br>final přídavné jméno → obecná<br>final zájmeno → obecná<br>final číslovka → obecná<br>final podstatné jméno → obecná<br>final příslovce → obecná | „Řekni mi vlastními slovy, jak poznáš zájmeno a číslovku.“ · „U slova třetí se zeptej: jaká, nebo kolikátá Lucka skončila? Která otázka sedí?“ · „Ve větě C: šlo by před večer říct ten? Ve větě D: spojuje Ať něco, nebo je to přání?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. U A nebo B zvolí přídavné jméno. Zeptejte se: „Dá se místo toho říct něčí jméno? Ptáš se jaký, nebo kolikátý?“ U C podstatné jméno: „Šlo by říct ten večer? Na co slovo odpovídá?“ U D jiný druh: „Je to přání?“ |
| 4 | detektiv (5 min) | Petr měl ve větě určit slovní druhy: Na hřišti hrálo několik kluků. Napsal: **hřišti** – podstatné jméno, **hrálo** – sloveso, **několik** – zájmeno. Udělal **jednu** chybu. Najdi ji. *Měří:* Najít u Petra číslovku několik určenou jako zájmeno a říct správný druh. | krok `k1` `klik_ve_textu`, `max: 1`, tokeny: Na(0) hřišti(1) hrálo(2) několik(3) kluků(4)<br>krok `final` `dlazdice`, popisek „Jaký druh to slovo je?“: sloveso · číslovka · zájmeno · podstatné jméno | k1 `[3]` (několik)<br>final číslovka (pozice b) | k1 `navic: [1, 2]` (hřišti(1), hrálo(2)) → `detektiv-jine-slovo`<br>k1 ostatní → obecná<br>final sloveso → `detektiv-oprava-jine-chyby`<br>final zájmeno → `cislovka-jen-cislice`<br>final podstatné jméno → `detektiv-oprava-jine-chyby` | Celá úloha: „Řekni mi vlastními slovy, co je číslovka. Která tři slova Petr určil?“ · Krok 1: „U každého Petrova slova zkus jeho test: to ___? ono ___? kolik? Sedí všude?“ · Krok 1 a 2: „Které Petrovo slovo odpovídá na kolik? Musí číslovka vždycky říkat přesné číslo?“<br>*Typická chyba:* Podívejte se na obrazovku dítěte. Klikne na hřišti nebo hrálo. Zeptejte se: „Jde říct to hřiště? Ono hrálo?“ (Petr to má dobře.) Klikne na několik, ale v kroku 2 zvolí zájmeno nebo jiný druh: „Odpovídá to na kolik?“ |
| 5 | kontrolní **týdenní** (6 min) | U každého označeného slova vyber slovní druh. V kroku 1 jsou označená ohebná slova, v kroku 2 neohebná. *Měří:* Týdenní kontrola: samostatně určit v textu všech deset slovních druhů, každý jednou (krok 1 ohebná slova, krok 2 neohebná). | krok `k1` `oznac_role` (5 rolí: podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso), popisek „Krok 1: ohebná slova“; tokeny: Hurá(0) náš(1) tým(2) dnes(3) vyhrál(4) třetí(5) zápas(6) Kéž(7) vyhrajeme(8) i(9) v(10) sobotě(11) ale(12) soupeř(13) je(14) silný(15); `slova: [1, 2, 4, 5, 15]`<br>krok `final` `oznac_role` (5 rolí: příslovce, předložka, spojka, částice, citoslovce), popisek „Krok 2: neohebná slova“; tokeny: Hurá(0) náš(1) tým(2) dnes(3) vyhrál(4) třetí(5) zápas(6) Kéž(7) vyhrajeme(8) i(9) v(10) sobotě(11) ale(12) soupeř(13) je(14) silný(15); `slova: [0, 3, 7, 10, 12]` | k1 náš(1) zájmeno · tým(2) podstatné jméno · vyhrál(4) sloveso · třetí(5) číslovka · silný(15) přídavné jméno<br>final Hurá(0) citoslovce · dnes(3) příslovce · Kéž(7) částice · v(10) předložka · ale(12) spojka | k1 `{"1": "přídavné jméno"}` (náš(1) → přídavné jméno) → `zajmeno-za-pridavne`<br>k1 `{"5": "přídavné jméno"}` (třetí(5) → přídavné jméno) → `cislovka-za-pridavne`<br>k1 ostatní → obecná<br>final `{"7": "spojka"}` (Kéž(7) → spojka) → `spojka-za-castici`<br>final `{"12": "částice"}` (ale(12) → částice) → `spojka-za-castici`<br>final `{"10": "příslovce"}` (v(10) → příslovce) → `predlozka-za-prislovce`<br>final `{"3": "předložka"}` (dnes(3) → předložka) → `prislovce-za-predlozku`<br>final ostatní → obecná | „Řekni mi vlastními slovy, jak poznáš ohebné a neohebné slovo. Které druhy patří do každé skupiny?“ · „Vezmi slovo, u kterého váháš. Zkus ten?, jaký?, kolik?, on ___?, kdy?, stojí před jménem?, přání?, výkřik? Co sedí?“ · „Vezmi slova náš a Kéž. Dá se místo náš říct něčí jméno? Spojuje Kéž něco, nebo uvádí přání?“<br>*Typická chyba:* Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: náš nebo třetí jako přídavné jméno: „Jde místo toho říct něčí jméno? Kolikátý?“ Kéž jako spojka nebo ale jako částice: „Spojuje to dvě věci, nebo je to přání?“ v jako příslovce nebo dnes jako předložka: „Stojí to před jménem?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Řešení kontrolní úlohy (pro recenzenta):** Krok 1: náš zájmeno (místo něj jde říct něčí jméno), tým podstatné jméno (ten tým), vyhrál sloveso (on vyhrál), třetí číslovka (kolikátý zápas?), silný přídavné jméno (jaký soupeř?); Krok 2: Hurá citoslovce (výkřik), dnes příslovce (kdy?), Kéž částice (přání), v předložka (před jménem: v sobotě), ale spojka (spojuje dvě věty); výsledek: každý z deseti druhů jednou

Poznámky k L4:
- U3: nabídka 6 dlaždic (maximum) bez spojky, proto u *Ať* past `spojka-za-castici` není; měří ji U1 D a U5.
- U5 (týdenní): krok 1 „ohebná slova“ (5 rolí), `final` „neohebná slova“ (5 rolí); každý z deseti druhů jednou. `semafor_tydne` počítá 10 slov z obou kroků: zelená `min_spravne` 9 (9–10), oranžová 7 (7–8), červená 0 (≤ 6). Aplikace bere barvu úlohy jen z `final` (5 neohebných slov), viz Poznámky pro vedoucího.

---

## Nahrávky (pro AUDIO.md)

Dvě nahrávky poslechu podle pravidel `AUDIO.md` (hlas Jana, Eleven v4, `[calm, slow, clear]`, tempo 0,9 přes ffmpeg, 0,5 s ticha na krajích). Diktát v tématu 1 není. Řádky v `AUDIO.md` nejsou (ten soubor nepíšu), vedoucí je sloučí; do té doby validátor u L1 a L3 hlásí „nahrávka nemá řádek v AUDIO.md“. Pozor na kolizi ID: `AUDIO.md` už má řádky `t1/l2-u4.mp3` a `t1/l4-u4.mp3` ze Spolu (základy); ID Spolu 8 `t1/l1-u3.mp3` a `t1/l3-u2.mp3` se s nimi nekříží, ale staré řádky do repozitáře Spolu 8 nepatří (viz Poznámky pro vedoucího).

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t1/l1-u3.mp3` | 1 / úloha 3 (`k1` i `final`) | poslech | Pátý den tábora jsme my dva našli v lese tři houby. | Nic nezdůrazňovat, hlavně ne „pátý“ a „my“; „my dva“ vyslovit spojitě, bez pauzy. Oznamovací intonace. Cca 4 s. | čeká |
| `t1/l3-u2.mp3` | 3 / úloha 2 (`k1` i `final`) | poslech | Večer jsme šli kolem rybníka a viděli tam dvě volavky. | „Večer“ na začátku bez důrazu a bez pauzy za ním; „kolem rybníka“ spojitě (pauza by napověděla). Cca 4 s. | čeká |

---

## Ověření ÚJČ

Každé slovo, u kterého se v tématu 1 hodnotí slovní druh nebo ohebnost, jsem ověřil 1. 10. 2026 v Internetové jazykové příručce ÚJČ přes `nastroje/ujc.sh` (slovníková část, značka SSČ: *příd., přísl., předl., sp., část., citosl., zájm., čísl.*, u podstatných jmen rod, u sloves vid). U homonym (*večer, hurá, náš, můj, on, ten, pět*) vede odkaz na konkrétní heslo (`?id=…`). Samostatný výklad o slovních druzích příručka nemá (TERMINOLOGIE §3), proto zdroj = slovníková hesla. Slova, na kterých se nic neurčuje (*den, tábor, les, houba, výlet, hora, pes, kočka, stůl, slunce, rybník, volavka, čaj, kakao, babička, auto, autobus, sobota, zápas, soupeř, závod, žák, kluk* a slovesa ve větách), jsou v `kontrola.zdroj` také (druh bez sporu). Jména *Lucka, Honzík* heslo nemají a nehodnotí se (jen vytištěná). **[OVĚŘIT]: 0.**

| heslo | kde | údaj v příručce (SSČ) | výsledek | odkaz |
|---|---|---|---|---|
| hra | L1 U1; L3 U3 (hry) | ž. (podstatné jméno) | OK | https://prirucka.ujc.cas.cz/?slovo=hra |
| hrát | L1 U1 (hraje); L3 U3 (hráli, neoznačeno); L4 U4 (hrálo) | ned. (sloveso) | OK | https://prirucka.ujc.cas.cz/?slovo=hr%C3%A1t |
| hravý | L1 U1 | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=hrav%C3%BD |
| včera | L1 U1; L2 U1 | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=v%C4%8Dera |
| rychlost | L1 U1 | ž. | OK | https://prirucka.ujc.cas.cz/?slovo=rychlost |
| rychlý | L1 U1; L2 U4 | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=rychl%C3%BD |
| rychle | L1 U1, U2; L2 U1, U4; L4 U1, U2 | přísl. (v hesle rychlý: „rychle přísl.“, stupňuje se: co nejrychleji) | OK | https://prirucka.ujc.cas.cz/?slovo=rychle |
| zrychlit | L1 U1 (zrychlí) | dok. (sloveso); tvar zrychlí v tabulce | OK | https://prirucka.ujc.cas.cz/?slovo=zrychlit |
| plavání | L1 U1 | rod s. (podstatné jméno), heslo s tabulkou; v SSČ u slovesa plavat | OK | https://prirucka.ujc.cas.cz/?slovo=plav%C3%A1n%C3%AD |
| plavat | L1 U1 (plave); L4 U3 (plave, neoznačeno) | ned. (sloveso) | OK | https://prirucka.ujc.cas.cz/?slovo=plavat |
| plavecký | L1 U1 | příd. (v hesle plavec) | OK | https://prirucka.ujc.cas.cz/?slovo=plaveck%C3%BD |
| dobře | L1 U1; L2 U4 | přísl. (v hesle dobrý) | OK | https://prirucka.ujc.cas.cz/?slovo=dob%C5%99e |
| hlas | L1 U1 | m. (podstatné jméno) | OK | https://prirucka.ujc.cas.cz/?slovo=hlas |
| hlasitý | L1 U1; L2 U4 | příd.; hlasitě přísl. ve stejném hesle | OK | https://prirucka.ujc.cas.cz/?slovo=hlasit%C3%BD |
| hlásit | L1 U1 (hlásí) | ned. (sloveso) | OK | https://prirucka.ujc.cas.cz/?slovo=hl%C3%A1sit |
| Tomáš | L1 U2; L3 U3 | m. (ohebné, mění tvar) | OK | https://prirucka.ujc.cas.cz/?slovo=Tom%C3%A1%C5%A1 |
| skočit | L1 U2 (skočil) | dok. (sloveso, ohebné) | OK | https://prirucka.ujc.cas.cz/?slovo=sko%C4%8Dit |
| na | L1 U2; L3 U1 | předl. se 4. a 6. p. (heslo má i na citosl.); v L1 U2 se hodnotí jen ohebnost, neohebné je v obou významech | OK | https://prirucka.ujc.cas.cz/?slovo=na |
| dva | L1 U2, U4; L3 U3 (dvě); L4 U2 | čísl. zákl.; tvary dvou, dvěma | OK | https://prirucka.ujc.cas.cz/?slovo=dva |
| náš | L1 U2, U5; L3 U5; L4 U3, U5 | zájmeno (přivlastňovací), heslo ?id=náš | OK | https://prirucka.ujc.cas.cz/?id=n%C3%A1%C5%A1 |
| ale | L1 U2; L2 U2, U4; L3 U5; L4 U5 | sp. odpor. | OK | https://prirucka.ujc.cas.cz/?slovo=ale |
| vysoký | L1 U2 | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=vysok%C3%BD |
| pátý | L1 U3; L2 U1; L3 U5 | čísl. řad. (v hesle pět) | OK | https://prirucka.ujc.cas.cz/?slovo=p%C3%A1t%C3%BD |
| my | L1 U3 | zájm. os. | OK | https://prirucka.ujc.cas.cz/?slovo=my |
| můj | L1 U4; L2 U1 | zájmeno, heslo ?id=můj_1 | OK | https://prirucka.ujc.cas.cz/?id=m%C5%AFj_1 |
| kamarád | L1 U4; L2 U1; L4 U2 | m. | OK | https://prirucka.ujc.cas.cz/?slovo=kamar%C3%A1d |
| třída | L1 U5; L2 U1 | ž. | OK | https://prirucka.ujc.cas.cz/?slovo=t%C5%99%C3%ADda |
| jet | L1 U5 (jela) | ned. (sloveso) | OK | https://prirucka.ujc.cas.cz/?slovo=jet |
| třetí | L1 U5; L2 U1; L4 U3, U5 | čísl. řad. | OK | https://prirucka.ujc.cas.cz/?slovo=t%C5%99et%C3%AD |
| několik | L1 U5; L4 U1, U4 | čísl. neurč. | OK | https://prirucka.ujc.cas.cz/?slovo=n%C4%9Bkolik |
| nový | L1 U5 (nových); L2 U1 | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=nov%C3%BD |
| tři | L1 U2 semafor (se třemi) | čísl. zákl.; 7. p. třemi. 2. p. tří/třech je dubleta → nepoužito | OK | https://prirucka.ujc.cas.cz/?slovo=t%C5%99i |
| on | L2 U1 | zájm. os., heslo ?id=on | OK | https://prirucka.ujc.cas.cz/?id=on |
| dobrý | L2 U1 | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=dobr%C3%BD |
| dnes | L2 U1; L4 U5 | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=dnes |
| dolů | L2 U1, U4; L3 U1 | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=dol%C5%AF |
| kniha | L2 U1; L3 U1 | ž. | OK | https://prirucka.ujc.cas.cz/?slovo=kniha |
| venku | L2 U1, U2; L3 U5 | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=venku |
| modrý | L2 U1 | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=modr%C3%BD |
| moře | L2 U1 | s. | OK | https://prirucka.ujc.cas.cz/?slovo=mo%C5%99e |
| pod | L2 U2; L4 U2 | předl. se 4. a 7. p. | OK | https://prirucka.ujc.cas.cz/?slovo=pod |
| kéž | L2 U2, U5; L4 U5 | část. přací | OK | https://prirucka.ujc.cas.cz/?slovo=k%C3%A9%C5%BE |
| kolem | L2 U3; L3 U2, U5; L4 U1 | přísl. (stáli kolem, jít kolem) i předl. s 2. p. (kolem stolu) | OK | https://prirucka.ujc.cas.cz/?slovo=kolem |
| zítra | L2 U5 | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=z%C3%ADtra |
| k | L2 U5 | předl. se 3. p. | OK | https://prirucka.ujc.cas.cz/?slovo=k |
| hezky | L2 U5 | přísl. (heslo uvádí i část. modál. s ironií — ve větě „bylo hezky“ jen přísl.) | OK | https://prirucka.ujc.cas.cz/?slovo=hezky |
| a | L2 U5 | sp. souř. sluč. (heslo uvádí i část. navaz. — ve větě spojuje hezky a teplo) | OK | https://prirucka.ujc.cas.cz/?slovo=a |
| hurá | L2 U5; L4 U2, U5 | citosl., heslo ?id=hurá (existuje i hurá příd., jiný význam) | OK | https://prirucka.ujc.cas.cz/?id=hur%C3%A1 |
| teplo | L2 U5 (neoznačeno) | s. i přísl. → záměrně se neurčuje | OK (nehodnotí se) | https://prirucka.ujc.cas.cz/?slovo=teplo |
| nebo | L3 U1; L4 U2 | sp. souř. vyluč. | OK | https://prirucka.ujc.cas.cz/?slovo=nebo |
| fuj | L3 U1; semafory L2 | citosl. | OK | https://prirucka.ujc.cas.cz/?slovo=fuj |
| bum | slovníček L2, semafor L4 | citosl. | OK | https://prirucka.ujc.cas.cz/?slovo=bum |
| au | (původně L3 U1, semafory) | příručka heslo nemá (vrací au pair) | NAHRAZENO fuj/bum | — |
| večer | L3 U2, U3, U4, U5; L4 U3 | dvě hesla: m. neživ. (?id=večer) a přísl. (?id=večer_1) | OK | https://prirucka.ujc.cas.cz/?id=ve%C4%8Der · https://prirucka.ujc.cas.cz/?id=ve%C4%8Der_1 |
| ten | L3 U3 | zájm. ukaz., heslo ?id=ten | OK | https://prirucka.ujc.cas.cz/?id=ten |
| s | L3 U3 | předl. se 7., 2. a 4. p. | OK | https://prirucka.ujc.cas.cz/?slovo=s |
| dlouho | L3 U3 | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=dlouho |
| přijít | L3 U4 (přišla) | dok. (sloveso) | OK | https://prirucka.ujc.cas.cz/?slovo=p%C5%99ij%C3%ADt |
| domů | L3 U4 | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=dom%C5%AF |
| trénink | L3 U5 | m. | OK | https://prirucka.ujc.cas.cz/?slovo=tr%C3%A9nink |
| běhat | L3 U5 (Běhali) | ned. (sloveso) | OK | https://prirucka.ujc.cas.cz/?slovo=b%C4%9Bhat |
| tma | L3 U5 (neoznačeno) | ž. i přísl. → neoznačeno | OK (nehodnotí se) | https://prirucka.ujc.cas.cz/?slovo=tma |
| ať | L4 U1, U3 | část. 2. přací (heslo má i ať sp.; obě věty jsou přání na začátku věty) | OK | https://prirucka.ujc.cas.cz/?slovo=a%C5%A5 |
| bohužel | L4 U2 | část. modál. (jen ohebnost: neohebné; druh se neurčuje, OSNOVA §16) | OK | https://prirucka.ujc.cas.cz/?slovo=bohu%C5%BEel |
| psát | L4 U2 (psal) | ned. (sloveso, ohebné) | OK | https://prirucka.ujc.cas.cz/?slovo=ps%C3%A1t |
| hřiště | L4 U4 (hřišti) | s. | OK | https://prirucka.ujc.cas.cz/?slovo=h%C5%99i%C5%A1t%C4%9B |
| tým | L4 U5 | m. | OK | https://prirucka.ujc.cas.cz/?slovo=t%C3%BDm |
| vyhrát | L4 U5 (vyhrál) | dok. (sloveso) | OK | https://prirucka.ujc.cas.cz/?slovo=vyhr%C3%A1t |
| v | L4 U5 | předl. s 6. a 4. p. | OK | https://prirucka.ujc.cas.cz/?slovo=v |
| silný | L4 U5 | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=siln%C3%BD |
| hezký | L2 U4 semafor | příd. | OK | https://prirucka.ujc.cas.cz/?slovo=hezk%C3%BD |
| doma | L2 U5 semafor | přísl. | OK | https://prirucka.ujc.cas.cz/?slovo=doma |
| pět | L4 U4 semafor | čísl., heslo ?id=pět (pět sloveso je jiné heslo) | OK | https://prirucka.ujc.cas.cz/?id=p%C4%9Bt |

---

## Nejistoty

Jazykově sporné místo v hodnocených slovech nezůstalo ([OVĚŘIT] 0, `kontrola.jistota: "jista"` u všech čtyř lekcí). Zbývají nejistoty didaktické:

1. **L3 U2 (poslech) *Večer* na začátku věty.** Příručka má *večer* i jako přísl. (?id=večer_1); dítě, které větu jen slyší, se může chytit toho, že „večer je věc“. Je to záměrná past (`sd-prislovce-za-podstatne`), test „ten“ v té větě nejde. Kdyby testovací rodič hlásil, že poslech je na to moc těžký, náhrada: *Šli jsme večer kolem rybníka…* (večer uprostřed věty).
2. **L2 U3 a L4 U1 A mají jen dvě dlaždice** (osnova: příslovce · předložka; ano · ne). Tip má 50 %. Pro semafor L2 U3 rozhoduje `final` (věta B); pokud vadí, přidat třetí dlaždici *spojka* (obecná chyba).
3. **L4 U5 počítá barvu jen z `final`.** Aplikace (`lekce.js`, `semaforSamo`) bere u úlohy jen krok `final`, tedy pět neohebných slov; chyby v kroku 1 (ohebná slova) barvu úlohy nezmění. `semafor_tydne` (data, aplikace ho nepočítá) je napsaný na 10 slov z obou kroků.
4. **L4 U3 *Lucka skončila v závodě třetí.*** *třetí* je tu ve funkci doplňku; druh (číslovka řadová, SSČ *třetí čísl. řad.*) je jednoznačný, větný člen se neurčuje.
5. **Otázka kódu `sd-prislovce-za-podstatne`** v `TYPY-CHYB.md` („Jde říct ‚ten rychle‘? Říká to jak, ne co.“) je psaná pro *rychle* a druhou větou prozrazuje odpověď. V tahácích L3 a L4 (*večer*) ji proto nepřebírám doslova, ptám se „Šlo by v té větě říct ten večer? Na co slovo odpovídá?“.

## Odchylky od osnovy

1. **`oznac_role` nejvýš 8 rolí (ZADANI-OSMA §8 bod 8).** Osnova má v L3 U3, L3 U5 a L4 U5 deset rolí.
   - L3 U3 a L3 U5: **jeden krok s 8 rolemi** (bez částice a citoslovce, které ve větách nejsou). Rozdělení na ohebné / neohebné by prozradilo hlavní past lekce (*večer* podstatné jméno × příslovce leží přes obě skupiny) a u kontrolní úlohy by barvu určoval jen `final`.
   - L4 U5 (týdenní, každý druh jednou): **dva kroky po skupinách**, krok 1 „ohebná slova“ (5 rolí), `final` „neohebná slova“ (5 rolí), jak navrhuje ZADANI-OSMA. Zadání dítěti říká, ve kterém kroku jsou ohebná a ve kterém neohebná slova (ohebnost je učivo L1).
2. **L3 U2: kód ve `final` opraven.** Osnova: „final předložka → chyba příslovce `prislovce-za-predlozku`“. Dítě, které u předložky *kolem* zvolí příslovce, udělalo `predlozka-za-prislovce` (TYPY-CHYB: „předložku označí jako příslovce“). V JSON je `predlozka-za-prislovce`.
3. **Citoslovce *au* nahrazeno.** Příručka heslo *au* nemá (dotaz vrací *au pair*), proto L3 U1 D *Fuj, to je kyselé!* (SSČ *fuj citosl.*) a v semaforech a slovníčku *fuj, bum*. V L3 U5 je místo pasti *au* past *večer* (příslovce) a *Běhali* (sloveso).
4. **L4 U3 bez spojky v nabídce.** Přiřazení potřebuje stejnou nabídku ve všech krocích a dlaždic smí být nejvýš 6; nechal jsem přídavné jméno · zájmeno · číslovka · podstatné jméno · příslovce · částice (pasti *Náš, třetí, večer*). Past `spojka-za-castici` u *Ať* tu proto není; měří ji L4 U1 D a U5.
5. **Rozšířené známé chyby (všechny kódy existují):** L1 U1 navíc `sd-podstatne-za-sloveso`, `sd-pridavne-za-sloveso`, `sd-podstatne-za-pridavne`, `sd-sloveso-za-pridavne` (každá špatná dlaždice v řadě C a D má svou chybu); L2 U4 `final` dlaždice *přídavné jméno* → `sd-prislovce-za-pridavne` (Petrova chyba); L3 U3 navíc *s → příslovce* `predlozka-za-prislovce`; L2 U5 navíc *zítra → předložka* `prislovce-za-predlozku`.
6. **Věty a slova jsou vlastní tam, kde je osnova nemá** (L1 U1 řady, L1 U5 *Naše třída jela na výlet do hor. Třetí den jsme potkali několik nových kamarádů.*, L3 U5, L4 U2 slova, L4 U5 text). Návrhy z osnovy (L1 U2–U4, L2 U2–U5, L3 U1–U4, L4 U1, U4) jsou převzaté beze změny jevu; L4 U1 B má *Lucka šla kolem a nepozdravila* (kolem samo = příslovce, aby seděl kód `prislovce-za-predlozku`).
7. **Rozcvičky se čtyřmi řadami** mají otázky `A a B`, `C`, `D` (3 otázky je maximum schématu).

## Poznámky pro vedoucího

1. **Řádky do `AUDIO.md`** (2 nahrávky poslechu, oddíl Nahrávky výš) jsem nepsal; do sloučení hlásí `seed:validace` u L1 a L3 chybu „nahrávka nemá řádek v cestina/Obsah/AUDIO.md“. V kopii repozitáře s těmi dvěma řádky prošly všechny čtyři lekce s 0 chybami.
2. **`AUDIO.md` v repozitáři Spolu 8 obsahuje řádky ze Spolu (základy)** (`t1/l2-u4.mp3`, `t3/l12-d1.mp3` … `t8/l32-d4.mp3`) s jiným zněním. Kontrola validátoru je jen „ID je v tabulce“, takže např. diktát Spolu 8 L12 (`t3/l12-d1.mp3`) by prošel se starým řádkem a starou nahrávkou jiné věty. Navrhuji staré řádky z `AUDIO.md` Spolu 8 odstranit (nebo jim dát jiný adresář).
3. **Schéma nepustí nahrávky témat 9 a 10.** `obsah/schema.json`, `vstupCestina.audio` i `vety[].audio` mají vzor `^audio/cestina/t[1-8]/…`; Spolu 8 má poslech v L33, L34, L38, L39 a diktát v L36, L40 (`t9/…`, `t10/…`). Vzor je třeba rozšířit na `t([1-9]|10)`.
4. **Nápovědy „Dnes samo“ u rozcvičky se 4 řadami:** `lekce.js` hledá otázku, jejíž `k` *začíná* písmenem řady; u řady B (otázka „A a B“) nenajde a vezme první nepoužitou. Funguje to, jen ne přesně; čistší by bylo hledat písmeno kdekoli v `k`.
5. **Kódy:** nový kód nenavrhuji. Dvě poznámky ke slovníku: `spojka-za-castici` („spojku/částici zamění“) používám pro oba směry (*Kéž* → spojka i *a* → částice), proti pravidlu 1 (kód = co dítě udělalo); případně rozdělit na `spojka-za-castici` a `castice-za-spojku`. `cislovka-jen-cislice` („neuzná číslovku zapsanou slovem“) sedí na *několik* jen volně; pro Spolu 8 by se hodil popis „neuzná číslovku neurčitou (několik, mnoho)“. Otázka u `sd-prislovce-za-podstatne` viz Nejistoty bod 5.
6. **`TERMINOLOGIE.md`** je pořád z týdne 1 Spolu (základy: jen podstatné jméno, přídavné jméno, sloveso, příslovce, zájmeno). Pro Spolu 8 v něm chybí číslovka, předložka, spojka, částice, citoslovce a ohebnost; testy, které téma 1 používá, jsou v oddíle „Společné pro celé téma“ výš.
