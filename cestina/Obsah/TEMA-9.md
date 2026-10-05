# Téma 9 — Souvětí a čárka (Spolu 8, lekce 33–36)

Verze 1.0, 1. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (sloučí řádky nahrávek do `AUDIO.md`, rozhodne nejistoty), korektora (ÚJČ), recenzenta.
Podle `cestina/Obsah/OSNOVA.md` §2–§4, §13, §16–§18, `ZADANI-OSMA.md` §3, §4, §8 a `cestina/Obsah/FORMAT-CJ.md` (rozdíl Spolu 8: 5 úloh). Forma jako `TYDEN-2.md` ze Spolu: u každé lekce Cíl, Úvod, Platí, Slovníček a tabulka úloh. Lekce jsou hotové v `obsah/cestina/lekce/cj-t9-l33.json` až `cj-t9-l36.json`; tabulky níže jsou z nich vygenerované, takže data sedí slovo po slově. Úplné texty taháku, semaforu a tisku jsou v JSON.

## Společné pro celé téma

- **Kapitola** `souveti` (je v `obsah/hlasky.md`). `faze: "osma"`, `tyden` 9, `poradi` 1–4, 5 úloh: U1 rozcvička 4 · U2 nová 5 · U3 nová 5 · U4 detektiv 5 · U5 kontrolní 6 = 25 min.
- **Indexy** v `klik_ve_textu` a `oznac_role` od 0, interpunkce se nepočítá. U `cil: "mezery"` je index *i* místo **za** slovem *i* (možná místa 0 … n−2). Tučně v tokenech = správná místa / označená slova.
- **Hodnoty rolí:** `věta hlavní`, `věta vedlejší`; počet vět v dlaždicích `1 věta` · `2 věty` · `3 věty` · `4 věty` (vždy stejné pořadí).
- **Co se hodnotí:** jen počet vět (podle přísudků), věta hlavní × vedlejší a čárka. Tvary slov se v tématu nehodnotí (text kolem je jen správně napsaný). Diktát L36 čárky nehodnotí (ZADANI-OSMA §8 bod 4), viz L36.
- **Čárky jen jednoznačné** (ÚJČ id=150, 151, 153, 155): hranice vedlejší věty (*že, když, protože, který, kde*), vložená věta z obou stran, výčet bez spojky, *ale* (i ve větě jednoduché), oslovení na začátku i na konci; bez čárky *a, i* ve slučovacím poměru (i *a potom*, id=153). **Nepoužito** (osnova §13, §16): *a* v neslučovacím poměru, *a* za vloženou větou, dvojité spojky, *až když, poté co, tak jak*, oslovení s pozdravem, vsuvky, *prosím*, přístavek, *jako, než*, *nebo* v hodnoceném místě (id=155: vylučovací *nebo* má čárku, hranice není vždy jasná; *nebo* je jen v pravidle „Ne před a, i, ani, nebo“), *jenž*. V úlohách na počet vět nikdy několikanásobný přísudek se společným podmětem (id=151); *se šli umýt a potom šli domů* je jen v úloze na čárku.
- **Jména:** Tomáš, Lucka, Honzík (jen vytištěné), Klára, Adam, Ema; detektiv Petr. Oslovení *Tomáši, Kláro, Adame, Emo* (všechna v příručce u hesel).
- **Poslech** L33 U3 a L34 U2 (osnova §4): ověřuje počet vět a začátek vedlejší věty, nikdy čárku (ta není slyšet).
- **Kódy** jen z `TYPY-CHYB.md` (oddíl týden 8, Spolu 8 a detektiv/diktát). Nový kód není potřeba (návrh jedné úpravy v Poznámkách).
- **Tahák** podle FORMAT-CJ §4: otázky přímá řeč k dítěti bez rodu a bez odpovědi (v režimu „Dnes samo“ je čte dítě), rozcvička po řadách `{k}`, typická chyba začíná „Podívejte se na obrazovku dítěte.“, u kontrolní R55. Semafor: zelená „Výborně — …“, oranžová „Zítra 5 minut…“ + „Kontrola pro vás: …“, červená „Dnes už nepokračujte, pochvalte snahu.“ + „Připravte: papír a tužku.“ + cvičení + „Potom zopakujte lekci „<tema>“.“ + „Kontrola pro vás: …“.

## Cíl tématu

Dítě spočítá věty v souvětí podle přísudků, pozná větu hlavní a vedlejší (podle slova, kterým začíná), napíše čárku na hranici vedlejší věty (u vložené z obou stran), ve výčtu, před *ale* a u oslovení a nenapíše ji před *a, i*, když jen spojují.

---

## LEKCE 33 — Souvětí: věta hlavní a vedlejší (`cj-t9-l33`)

`tema`: „Souvětí: věta hlavní a vedlejší“ · `kapitola`: `souveti` · `tyden` 9, `poradi` 1 · `cas_min` 25 (4 + 5 + 5 + 5 + 6).

**Cíl:** Dítě spočítá věty v souvětí podle přísudků a u každé věty řekne, jestli je hlavní (obstojí sama), nebo vedlejší (začíná slovem jako že, když, který).

**Úvod pro rodiče:** Dnes se dítě učí spočítat věty v souvětí podle sloves, která říkají, co se děje, a poznat větu hlavní a vedlejší.

**Platí:**
1. `Kolik přísudků, tolik vět` — co to je (25 znaků)
2. `Vedlejší začíná: že, když, který…` — test (33 znaků)
3. `Vím, | že přijdeš. (hlavní | vedl.)` — příklad (35 znaků)

**Slovníček pro rodiče:**
- *přísudek* — sloveso ve větě, které říká, co kdo dělá nebo co se děje (hraje, šli); patří k němu i chce jít nebo budu číst
- *věta jednoduchá* — věta s jedním přísudkem (Celá třída jela na výlet.)
- *souvětí* — dvě nebo více vět spojených dohromady; vět je tolik, kolik je přísudků
- *věta hlavní* — věta, která obstojí sama (Vím.)
- *věta vedlejší* — věta, která sama neobstojí; začíná slovem jako že, když, protože, aby, který, kde (že přijdeš)
- *podmět* — kdo nebo co ve větě něco dělá (Tomáš hraje: Tomáš)

**Pomůcky:** sešit, propiska.

| Úloha | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V každé řadě vyber přísudek. · A) Tomáš dnes hraje fotbal. · B) Lucka chce jít ven. · C) Večer budu číst knihu. · D) Na hřišti čeká trenér. *Měří:* Ledoborec: najít přísudek v jednoduché větě, i když má dvě slova (chce jít, budu číst). | **k1** `dlazdice`, popisek „Řada A“: hraje · Tomáš · fotbal ‖ **k2** `dlazdice`, popisek „Řada B“: Lucka · ven · chce jít ‖ **k3** `dlazdice`, popisek „Řada C“: Večer · budu číst · knihu ‖ **final** `dlazdice`, popisek „Řada D“: trenér · hřišti · čeká | k1 hraje ‖ k2 chce jít ‖ k3 budu číst ‖ final čeká | k1: Tomáš → `podmet-prisudek-zamena`; fotbal → `prisudek-neni-sloveso` ‖ k2: Lucka → `podmet-prisudek-zamena`; ven → `prisudek-neni-sloveso` ‖ k3: Večer → `prisudek-neni-sloveso`; knihu → `prisudek-neni-sloveso` ‖ final: trenér → `podmet-prisudek-zamena`; hřišti → `prisudek-neni-sloveso` | Otázky: A: „Co se v řadě A děje? Řekni to jedním slovem z věty.“ / B a C: „Které slovo v nabídce říká, co se dělá? Patří k němu ještě slovo, bez kterého by to nedávalo smysl?“ / D: „Kdo v řadě D něco dělá? A co dělá? Řekni obojí slovy z věty.“ · Typická chyba: Podívejte se na obrazovku dítěte. Vybere jméno (Tomáš, Lucka, trenér). Zeptejte se: „Je to ten, kdo něco dělá, nebo to, co dělá?“ Vybere fotbal, ven, Večer, knihu nebo hřišti: „Říká to slovo, co se děje?“ |
| U2 nová (5) | Kolik vět je v každém řádku? · A) Tomáš, Lucka a Klára šli ven. · B) Honzík chce jít na trénink. · C) Adam čte knihu a Ema píše úkol. · D) Když přijdu domů, budu číst knihu, kterou mi půjčila Ema. *Měří:* Spočítat věty podle přísudků, ne podle čárek, jmen a spojek (i chce jít, budu číst). | **k1** `dlazdice`, popisek „Řádek A“: 1 věta · 2 věty · 3 věty · 4 věty ‖ **k2** `dlazdice`, popisek „Řádek B“: 1 věta · 2 věty · 3 věty · 4 věty ‖ **k3** `dlazdice`, popisek „Řádek C“: 1 věta · 2 věty · 3 věty · 4 věty ‖ **final** `dlazdice`, popisek „Řádek D“: 1 věta · 2 věty · 3 věty · 4 věty | k1 1 věta ‖ k2 1 věta ‖ k3 2 věty ‖ final 3 věty | k1: 2 věty → `souveti-pocet-podle-spojek`; 3 věty → `souveti-pocet-podle-spojek`; 4 věty → obecná ‖ k2: 2 věty → `souveti-infinitiv-jako-veta`; 3 věty → obecná; 4 věty → obecná ‖ k3: 1 věta → `souveti-pocet-podle-spojek`; 3 věty → obecná; 4 věty → obecná ‖ final: 1 věta → obecná; 2 věty → obecná; 4 věty → `souveti-infinitiv-jako-veta` | Otázky: „Jak poznáš, kolik vět je v souvětí? Řekni to vlastními slovy.“ / „Vezmi řádek A. Najdi všechna slova, která říkají, co se děje. Kolik jich je?“ / „V řádku D: co se stane, až přijdu domů? Je budu číst jedna věc, nebo dvě?“ · Typická chyba: Podívejte se na obrazovku dítěte. V řádku A vybere 2 nebo 3: „Kolik je tam sloves, která něco dělají?“ V B nebo D počítá chce jít či budu číst jako dvě věty: „Je to jedna věc, nebo dvě?“ V C vybere 1, v D 1 nebo 2: „Kdo co dělá?“ |
| U3 nová (5) | Poslechni si nahrávku. Potom odpověz na dvě otázky. *Měří:* Spočítat věty v souvětí jen poslechem a poznat, které slovo začíná vedlejší větu. | **k1** `poslech` `audio/cestina/t9/l33-u3.mp3`, max_prehrani 0, přepis *Když jsme přišli domů, máma vařila večeři a táta četl noviny.*; popisek „Kolik vět je v nahrávce?“; dlaždice: 1 věta · 2 věty · 3 věty · 4 věty ‖ **final** `poslech` `audio/cestina/t9/l33-u3.mp3`, max_prehrani 0, přepis *Když jsme přišli domů, máma vařila večeři a táta četl noviny.*; popisek „Které slovo začíná vedlejší větu?“; dlaždice: Když · máma · a · táta | k1 3 věty ‖ final Když | k1: 1 věta → obecná; 2 věty → `souveti-pocet-podle-spojek`; 4 věty → obecná ‖ final: máma → `veta-hlavni-za-vedlejsi`; a → `veta-hlavni-za-vedlejsi`; táta → obecná | Otázky: Krok 1: „Pusť si nahrávku a na každé slovo, které říká, co kdo dělá, zvedni prst. Kolik prstů máš?“ / Krok 2: „Které části nahrávky můžeš říct samotné a dávají smysl? Která samotná smysl nedává?“ / Krok 2: „Řekni každou část nahrávky zvlášť. Která začíná slovem, po kterém ještě čekáš pokračování?“ · Typická chyba: Podívejte se na obrazovku dítěte. V kroku 1 vybere 2 věty, počítá podle pauz. Zeptejte se: „Kolik slov říká, co kdo dělá?“ V kroku 2 vybere máma nebo a: „Dá se ta část říct samotná?“ Vybere táta: „Která část samotná nedává smysl?“ |
| U4 detektiv (5) | Petr počítal věty: · A) Adam, Ema a Honzík hráli fotbal. → 3 věty · B) Lucka ví, že prší. → 2 věty · C) Chci jít domů. → 1 věta · Udělal **jednu** chybu. Najdi ji. *Měří:* Najít u Petra řádek, kde počítal věty podle jmen a čárek místo podle přísudků, a říct správný počet. | **k1** `dlazdice`, popisek „Ve kterém řádku se Petr spletl?“: Řádek A · Řádek B · Řádek C ‖ **final** `dlazdice`, popisek „Kolik vět tam má být?“: 1 věta · 2 věty · 3 věty · 4 věty | k1 Řádek A ‖ final 1 věta | k1: Řádek B → `detektiv-jine-slovo`; Řádek C → `souveti-infinitiv-jako-veta` ‖ final: 2 věty → `souveti-pocet-podle-spojek`; 3 věty → `souveti-pocet-podle-spojek`; 4 věty → obecná | Otázky: Celá úloha: „Řekni mi vlastními slovy, podle čeho se počítají věty v souvětí.“ / Krok 1: „Projdi Petrovy řádky. V každém najdi slova, která říkají, co se děje. Sedí jejich počet s Petrovým číslem?“ / Krok 1 a 2: „Čárky a jména se nepočítají, počítají se jen slovesa. Spočítej je v každém řádku a porovnej s Petrovým číslem.“ · Typická chyba: Podívejte se na obrazovku dítěte. Vybere řádek C, protože chci jít bere jako dvě věty. Zeptejte se: „Dělá tam někdo dvě věci, nebo jednu?“ (Petr to má dobře.) Vybere B: „Kolik je tam sloves?“ V kroku 2 vybere 2 nebo 3: „Kolik je v řádku A sloves?“ |
| U5 kontrolní (6) | Přečti si dvě souvětí: · Když skončil trénink, Adam, Honzík a Tomáš šli do šatny. Ema napsala Tomášovi, že přijde později, protože jí ujel autobus. · Nejdřív urči, kolik vět je v prvním souvětí. Potom u každého označeného slovesa vyber, jestli je ve větě hlavní, nebo vedlejší. *Měří:* Samostatně spočítat věty v souvětí s několika jmény a u pěti přísudků určit, jestli patří do věty hlavní, nebo vedlejší. | **k1** `dlazdice`, popisek „Kolik vět je v prvním souvětí?“: 1 věta · 2 věty · 3 věty · 4 věty ‖ **final** `oznac_role`, role ['věta hlavní', 'věta vedlejší'], popisek „Tvoje odpověď“; text: *Když skončil trénink, Adam, Honzík a Tomáš šli do šatny. Ema napsala Tomášovi, že přijde později, protože jí ujel autobus.* tokeny: Když(0) **skončil(1)** trénink(2) Adam(3) Honzík(4) a(5) Tomáš(6) **šli(7)** do(8) šatny(9) Ema(10) **napsala(11)** Tomášovi(12) že(13) **přijde(14)** později(15) protože(16) jí(17) **ujel(18)** autobus(19); `slova: [1, 7, 11, 14, 18]` | k1 2 věty ‖ final skončil(1) věta vedlejší; šli(7) věta hlavní; napsala(11) věta hlavní; přijde(14) věta vedlejší; ujel(18) věta vedlejší | k1: 1 věta → obecná; 3 věty → `souveti-pocet-podle-spojek`; 4 věty → `souveti-pocet-podle-spojek` ‖ final: `{"1": "věta hlavní", "7": "věta vedlejší", "11": "věta vedlejší", "14": "věta hlavní", "18": "věta hlavní"}` → `veta-hlavni-za-vedlejsi` | Otázky: „Řekni mi vlastními slovy, jak poznáš počet vět a větu vedlejší.“ / „Vezmi jedno označené sloveso a řekni jeho větu samotnou. Dává smysl, nebo začíná slovem, po kterém čekáš pokračování?“ / „Najdi v souvětích slova jako že, když, protože. Kde začínají věty, které samy neobstojí?“ · Typická chyba: Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: v kroku 1 vybere 3 nebo 4 věty: „Kolik je tam sloves?“ U skončil vybere hlavní, protože je první: „Jakým slovem ta věta začíná?“ U přijde nebo ujel vybere hlavní: „Dá se ta věta říct samotná?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Kontrola pro vás (kontrolní):** #### Krok 1 2 věty (skončil, šli; tři jména dělají jednu věc) #### Krok 2 skončil: věta vedlejší (začíná když) šli: věta hlavní (obstojí sama) napsala: věta hlavní (obstojí sama) přijde: věta vedlejší (začíná že) ujel: věta vedlejší (začíná protože) **Výsledek:** krok 1: 2 věty; hlavní šli a napsala, vedlejší skončil, přijde, ujel


---

## LEKCE 34 — Čárka v souvětí (`cj-t9-l34`)

`tema`: „Čárka v souvětí“ · `kapitola`: `souveti` · `tyden` 9, `poradi` 2 · `cas_min` 25 (4 + 5 + 5 + 5 + 6).

**Cíl:** Dítě napíše čárku na hranici vedlejší věty (u věty vložené doprostřed z obou stran) a nenapíše ji před a, které jen spojuje.

**Úvod pro rodiče:** Dnes se dítě učí psát čárku tam, kde začíná nebo končí vedlejší věta, a nepsat ji před a, které jen spojuje.

**Platí:**
1. `Čárka na hranici vedlejší věty` — co to je (30 znaků)
2. `Ne před a, i, ani, nebo (spojují)` — test (33 znaků)
3. `Kluk, který přišel, se smál.` — příklad (28 znaků)

**Slovníček pro rodiče:**
- *přísudek* — sloveso ve větě, které říká, co kdo dělá nebo co se děje (hraje, šli); patří k němu i chce jít nebo budu číst
- *věta jednoduchá* — věta s jedním přísudkem (Tomáš, Lucka a Klára šli ven.)
- *souvětí* — dvě nebo více vět spojených dohromady; vět je tolik, kolik je přísudků
- *věta hlavní* — věta, která obstojí sama (Vím.)
- *věta vedlejší* — věta, která sama neobstojí; začíná slovem jako že, když, protože, aby, který, kde (že přijdeš)
- *vložená věta* — vedlejší věta uprostřed jiné věty; čárka je před ní i za ní (Kluk, který přišel, se smál.)
- *spojovací slovo* — slovo, které připojuje vedlejší větu (že, když, protože, který), nebo jen spojuje (a, i, ani, nebo)

**Pomůcky:** sešit, propiska.

| Úloha | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V řadách A a B urči, kolik je v řádku vět. V řadě C vyber větu vedlejší, v řadě D větu hlavní. · A) Ema čte knihu a Adam hraje hokej. · B) Honzík chce jet k babičce. · C) Klára řekla, že přijde. · D) Když prší, sedíme doma. *Měří:* Zopakovat lekci 33: počet vět podle přísudků a větu hlavní a vedlejší. | **k1** `dlazdice`, popisek „Řada A“: 1 věta · 2 věty · 3 věty ‖ **k2** `dlazdice`, popisek „Řada B“: 1 věta · 2 věty · 3 věty ‖ **k3** `dlazdice`, popisek „Řada C“: Klára řekla · že přijde ‖ **final** `dlazdice`, popisek „Řada D“: Když prší · sedíme doma | k1 2 věty ‖ k2 1 věta ‖ k3 že přijde ‖ final sedíme doma | k1: 1 věta → `souveti-pocet-podle-spojek`; 3 věty → obecná ‖ k2: 2 věty → `souveti-infinitiv-jako-veta`; 3 věty → obecná ‖ k3: Klára řekla → `veta-hlavni-za-vedlejsi` ‖ final: Když prší → `veta-hlavni-za-vedlejsi` | Otázky: A: „Kdo v řadě A něco dělá a co dělá? Kolik je tam takových sloves?“ / B: „Kolik věcí Honzík v řadě B dělá? Řekni to slovy z věty.“ / C a D: „Kterou část řekneš samotnou a dává smysl? Kterou začíná slovo, po kterém čekáš pokračování?“ · Typická chyba: Podívejte se na obrazovku dítěte. V řadě A vybere 1, protože tam není čárka. Zeptejte se: „Kolik je tam sloves?“ V B vybere 2: „Kolik věcí Honzík dělá?“ V C nebo D vybere první část jen proto, že je první: „Dá se ta část říct samotná?“ |
| U2 nová (5) | Poslechni si nahrávku. Potom odpověz na dvě otázky. *Měří:* Sluchem spočítat věty a najít slovo, které začíná vloženou vedlejší větu (čárka se tu neověřuje). | **k1** `poslech` `audio/cestina/t9/l34-u2.mp3`, max_prehrani 0, přepis *Lucka čte knihu a Tomáš, který přišel pozdě, píše úkol.*; popisek „Kolik vět je v nahrávce?“; dlaždice: 1 věta · 2 věty · 3 věty · 4 věty ‖ **final** `poslech` `audio/cestina/t9/l34-u2.mp3`, max_prehrani 0, přepis *Lucka čte knihu a Tomáš, který přišel pozdě, píše úkol.*; popisek „Které slovo začíná vedlejší větu?“; dlaždice: čte · a · který · píše | k1 3 věty ‖ final který | k1: 1 věta → obecná; 2 věty → `souveti-pocet-podle-spojek`; 4 věty → obecná ‖ final: čte → obecná; a → `veta-hlavni-za-vedlejsi`; píše → `veta-hlavni-za-vedlejsi` | Otázky: Krok 1: „Pusť si nahrávku a na každé slovo, které říká, co kdo dělá, zvedni prst. Kolik prstů máš?“ / Krok 2: „Co dělá Tomáš? A co se o něm dozvíš navíc, uprostřed?“ / Krok 2: „Která část nahrávky samotná nedává smysl? Jakým slovem začíná?“ · Typická chyba: Podívejte se na obrazovku dítěte. V kroku 1 vybere 2 věty podle a. Zeptejte se: „Kolik slov říká, co kdo dělá?“ V kroku 2 vybere a nebo píše: „Dá se ta část říct samotná?“ Vybere čte: „Co se dozvíš navíc uprostřed?“ |
| U3 nová (5) | Klikni na místa, kam patří čárka. *Měří:* Napsat čárku před že, který, protože a na konci vložené vedlejší věty. | **final** `klik_ve_textu` `cil: "mezery"`, min 1, max 6, popisek „Tvoje odpověď“; text: *Adam ví že trénink začíná v pět. Kolo které stojí u plotu patří Emě. Klára zůstala doma protože byla nemocná.* tokeny (mezera i = místo za slovem i): Adam(0) **ví(1)** že(2) trénink(3) začíná(4) v(5) pět(6) **Kolo(7)** které(8) stojí(9) u(10) **plotu(11)** patří(12) Emě(13) Klára(14) zůstala(15) **doma(16)** protože(17) byla(18) nemocná(19) | final `[1, 7, 11, 16]` (za ví, za Kolo, za plotu, za doma) | final: chybi `[1]` → `carka-chybi-ze`; chybi `[7]` → `carka-chybi-ktery`; chybi `[11]` → `carka-vlozena-chybi-druha`; chybi `[16]` → `carka-chybi-pred-spojkou`; ostatní obecná | Otázky: „Kde se v souvětí píše čárka? Řekni to vlastními slovy.“ / „Najdi v každém souvětí slovo, kterým začíná věta, která sama neobstojí. Co patří před to slovo?“ / „Ve druhém souvětí najdi sloveso věty, která začíná které. Kde ta věta končí a co tam patří?“ · Typická chyba: Podívejte se na obrazovku dítěte. Chybí čárka za plotu. Zeptejte se: „Kde končí věta, která začíná které?“ Chybí čárka před že, které nebo protože: „Kde začíná věta, která sama neobstojí?“ Čárka navíc jinde: „Začíná nebo končí tam nějaká věta?“ |
| U4 detektiv (5) | Petr napsal souvětí a zapomněl v něm jednu čárku: · Pes, který štěkal celou noc usnul až ráno. · Najdi místo, kam čárka patří. *Měří:* Najít u Petra chybějící čárku na konci vložené vedlejší věty a říct, proč tam patří. | **k1** `klik_ve_textu` `cil: "mezery"`, min 1, max 1, popisek „Klikni na místo, kde čárka chybí.“; text: *Pes, který štěkal celou noc usnul až ráno.* tokeny (mezera i = místo za slovem i): Pes(0) který(1) štěkal(2) celou(3) **noc(4)** usnul(5) až(6) ráno(7) ‖ **final** `dlazdice`, popisek „Proč tam patří čárka?“: Končí tam vedlejší věta · Začíná tam vedlejší věta · Je tam výčet · Je tam oslovení | k1 `[4]` (za noc) ‖ final Končí tam vedlejší věta | k1: navic `[0, 1, 2, 3, 5, 6]` → `detektiv-jine-slovo`; ostatní obecná ‖ final: Začíná tam vedlejší věta → `detektiv-oprava-jine-chyby`; Je tam výčet → `detektiv-oprava-jine-chyby`; Je tam oslovení → `detektiv-oprava-jine-chyby` | Otázky: Celá úloha: „Řekni mi vlastními slovy, kam se píše čárka u věty, která je uprostřed jiné věty.“ / Krok 1: „Najdi v Petrově souvětí všechna slovesa. Kolik vět tam je? Řekni každou zvlášť.“ / Krok 1 a 2: „Kde se v Petrově souvětí potkávají dvě věty? Je na každém takovém místě čárka?“ · Typická chyba: Podívejte se na obrazovku dítěte. Klikne za štěkal nebo za celou. Zeptejte se: „Patří celou noc ještě k tomu, co pes dělal?“ Klikne za usnul nebo za až: „Kde končí věta s který?“ V kroku 2 zvolí jiný důvod: „Ta věta tady začíná, nebo končí?“ |
| U5 kontrolní (6) | Klikni na všechna místa, kam patří čárka. *Měří:* Samostatně napsat pět čárek ve třech souvětích (i na obou koncích vložených vět) a nenapsat čárku před a, které jen spojuje. | **final** `klik_ve_textu` `cil: "mezery"`, min 1, max 8, popisek „Tvoje odpověď“; text: *Tomáš dnes nepřijde protože je nemocný a má horečku. Kluci kteří hráli fotbal se šli umýt a potom šli domů. Pes kterého jsme našli v lese teď bydlí u Emy.* tokeny (mezera i = místo za slovem i): Tomáš(0) dnes(1) **nepřijde(2)** protože(3) je(4) nemocný(5) a(6) má(7) horečku(8) **Kluci(9)** kteří(10) hráli(11) **fotbal(12)** se(13) šli(14) umýt(15) a(16) potom(17) šli(18) domů(19) **Pes(20)** kterého(21) jsme(22) našli(23) v(24) **lese(25)** teď(26) bydlí(27) u(28) Emy(29) | final `[2, 9, 12, 20, 25]` (za nepřijde, za Kluci, za fotbal, za Pes, za lese) | final: chybi `[2]` → `carka-chybi-pred-spojkou`; chybi `[9, 20]` → `carka-chybi-ktery`; chybi `[12, 25]` → `carka-vlozena-chybi-druha`; navic `[5, 15]` → `carka-navic-a`; ostatní obecná | Otázky: „Řekni mi vlastními slovy, kde se v souvětí píše čárka a kde ne.“ / „Najdi v každém souvětí slovo, kterým začíná věta, která sama neobstojí. Kde ta věta začíná a kde končí?“ / „Najdi všechna a. Spojuje každé jen dvě věci za sebou, nebo začíná větu, která sama neobstojí?“ · Typická chyba: Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: chybí čárka za fotbal nebo za lese: „Kde končí věta s který?“ Chybí před protože, kteří nebo kterého: „Kde začíná věta, která sama neobstojí?“ Čárka před a: „Spojuje jen dvě věci?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Kontrola pro vás (kontrolní):** Tomáš dnes nepřijde, protože je nemocný a má horečku. (před protože; před a ne) Kluci, kteří hráli fotbal, se šli umýt a potom šli domů. (vložená věta: před i za; před a ne) Pes, kterého jsme našli v lese, teď bydlí u Emy. (vložená věta: před i za) **Výsledek:** čárky za nepřijde, Kluci, fotbal, Pes, lese


---

## LEKCE 35 — Čárka ve větě jednoduché (`cj-t9-l35`)

`tema`: „Čárka ve větě jednoduché“ · `kapitola`: `souveti` · `tyden` 9, `poradi` 3 · `cas_min` 25 (4 + 5 + 5 + 5 + 6).

**Cíl:** Dítě napíše čárku mezi slova výčtu bez spojky, před ale a za oslovení a nenapíše ji před a nebo i, které jen spojují.

**Úvod pro rodiče:** Dnes se dítě učí psát čárku i ve větě s jedním slovesem: ve výčtu, před ale a u oslovení.

**Platí:**
1. `Výčet: jablka, hrušky a švestky` — co to je (31 znaků)
2. `malý, ale rychlý · a bez čárky` — test (30 znaků)
3. `Tomáši, pojď sem!` — příklad (17 znaků)

**Slovníček pro rodiče:**
- *věta jednoduchá* — věta s jedním přísudkem (Tomáš, Lucka a Klára šli ven.)
- *výčet* — několik slov za sebou, která ve větě dělají totéž (sešit, pravítko a guma); mezi nimi je čárka, před posledním a není
- *oslovení* — jméno toho, na koho voláme (Tomáši!, Kláro!); odděluje se čárkou
- *ale* — slovo, které staví jednu věc proti druhé (malý, ale rychlý); před ním je čárka
- *a, i, ani, nebo* — slova, která jen spojují dvě věci za sebou (Tomáš i Lucka); čárka před nimi není
- *věta vedlejší* — věta, která sama neobstojí; začíná slovem jako že, když, protože, aby, který, kde (že přijdeš)
- *vložená věta* — vedlejší věta uprostřed jiné věty; čárka je před ní i za ní (Kluk, který přišel, se smál.)

**Pomůcky:** sešit, propiska.

| Úloha | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V každé řadě A až D vyber větu, která je napsaná správně. *Měří:* Zopakovat čárky z lekce 34: před že, na obou koncích vložené věty, za větou s když a ne před a, které jen spojuje. | **k1** `dlazdice`, popisek „Řada A“: Vím že Tomáš přijde. · Vím, že Tomáš přijde. ‖ **k2** `dlazdice`, popisek „Řada B“: Kolo, které stojí venku, patří Adamovi. · Kolo, které stojí venku patří Adamovi. ‖ **k3** `dlazdice`, popisek „Řada C“: Ema kreslí, a Adam hraje na kytaru. · Ema kreslí a Adam hraje na kytaru. ‖ **final** `dlazdice`, popisek „Řada D“: Když zazvonilo, všichni vstali. · Když zazvonilo všichni vstali. | k1 Vím, že Tomáš přijde. ‖ k2 Kolo, které stojí venku, patří Adamovi. ‖ k3 Ema kreslí a Adam hraje na kytaru. ‖ final Když zazvonilo, všichni vstali. | k1: Vím že Tomáš přijde. → `carka-chybi-ze` ‖ k2: Kolo, které stojí venku patří Adamovi. → `carka-vlozena-chybi-druha` ‖ k3: Ema kreslí, a Adam hraje na kytaru. → `carka-navic-a` ‖ final: Když zazvonilo všichni vstali. → `carka-chybi-za-uvodni-vetou` | Otázky: A a D: „Najdi slovo, kterým začíná věta, která sama neobstojí. Kde ta věta začíná a kde končí?“ / B: „Kde končí věta, která začíná které? Co tam má být?“ / C: „Co dělá slovo a: jen spojuje dvě věci, nebo začíná větu, která sama neobstojí?“ · Typická chyba: Podívejte se na obrazovku dítěte. V A nebo D vybere větu bez čárky. Zeptejte se: „Kde končí jedna věta a začíná druhá?“ V B vybere větu s jednou čárkou: „Kde končí věta s které?“ V C vybere čárku před a: „Spojuje a jen dvě věci?“ |
| U2 nová (5) | Klikni na místa, kam patří čárka. *Měří:* Napsat čárku mezi slova výčtu a nenapsat ji před poslední a. | **final** `klik_ve_textu` `cil: "mezery"`, min 1, max 6, popisek „Tvoje odpověď“; text: *Do batohu patří svačina pití mikina a pláštěnka. Tomáš Lucka Adam a Ema pojedou na výlet.* tokeny (mezera i = místo za slovem i): Do(0) batohu(1) patří(2) **svačina(3)** **pití(4)** mikina(5) a(6) pláštěnka(7) **Tomáš(8)** **Lucka(9)** Adam(10) a(11) Ema(12) pojedou(13) na(14) výlet(15) | final `[3, 4, 8, 9]` (za svačina, za pití, za Tomáš, za Lucka) | final: chybi `[3, 4, 8, 9]` → `carka-vycet-chybi`; navic `[5, 10]` → `carka-navic-a`; ostatní obecná | Otázky: „Co je výčet? Řekni to vlastními slovy.“ / „Kolik věcí patří do batohu? Ukaž si je na prstech. Co je mezi nimi?“ / „Podívej se na poslední dvě věci ve výčtu. Co je mezi nimi místo čárky?“ · Typická chyba: Podívejte se na obrazovku dítěte. Chybí čárka mezi svačina a pití, nebo mezi jmény. Zeptejte se: „Kolik věcí je vyjmenováno? Co je mezi nimi?“ Čárka před a: „Co spojuje poslední dvě věci?“ |
| U3 nová (5) | V každé dvojici vyber větu, která je napsaná správně. *Měří:* Napsat čárku před ale a u oslovení a nenapsat ji před i, které jen spojuje. | **k1** `dlazdice`, popisek „Dvojice A“: Ta bunda je levná, ale teplá. · Ta bunda je levná ale teplá. ‖ **k2** `dlazdice`, popisek „Dvojice B“: Tomáš, i Lucka hrají tenis. · Tomáš i Lucka hrají tenis. ‖ **k3** `dlazdice`, popisek „Dvojice C“: Tomáši podej mi míč. · Tomáši, podej mi míč. ‖ **final** `dlazdice`, popisek „Dvojice D“: Pojď s námi ven, Kláro! · Pojď s námi ven Kláro! | k1 Ta bunda je levná, ale teplá. ‖ k2 Tomáš i Lucka hrají tenis. ‖ k3 Tomáši, podej mi míč. ‖ final Pojď s námi ven, Kláro! | k1: Ta bunda je levná ale teplá. → `carka-chybi-pred-ale` ‖ k2: Tomáš, i Lucka hrají tenis. → `carka-navic-pred-i-ani-nebo` ‖ k3: Tomáši podej mi míč. → `carka-osloveni-chybi` ‖ final: Pojď s námi ven Kláro! → `carka-osloveni-chybi` | Otázky: Celá úloha: „Kde se píše čárka, i když má věta jen jedno sloveso? Řekni, co si pamatuješ.“ / A a B: „Staví to slovo jednu věc proti druhé, nebo je jen spojuje jako a?“ / C a D: „Na koho se ve větě volá? Kde to volání začíná a kde končí?“ · Typická chyba: Podívejte se na obrazovku dítěte. V A vybere větu bez čárky. Zeptejte se: „Jdou levná a teplá spolu, nebo jedno překvapí?“ V B vybere čárku před i: „Spojuje i jen dvě jména?“ V C nebo D vybere větu bez čárky: „Na koho se volá?“ |
| U4 detektiv (5) | Petr napsal větu a zapomněl v ní jednu čárku: · Kláro pojď k tabuli a napiš tam to slovo. · Najdi místo, kam čárka patří. *Měří:* Najít u Petra chybějící čárku za oslovením a říct proč. | **k1** `klik_ve_textu` `cil: "mezery"`, min 1, max 1, popisek „Klikni na místo, kde čárka chybí.“; text: *Kláro pojď k tabuli a napiš tam to slovo.* tokeny (mezera i = místo za slovem i): **Kláro(0)** pojď(1) k(2) tabuli(3) a(4) napiš(5) tam(6) to(7) slovo(8) ‖ **final** `dlazdice`, popisek „Proč tam patří čárka?“: Je tam oslovení · Je tam výčet · Začíná tam vedlejší věta · Stojí tam ale | k1 `[0]` (za Kláro) ‖ final Je tam oslovení | k1: navic `[3]` → `carka-navic-a`; navic `[1, 2, 4, 5, 6, 7]` → `detektiv-jine-slovo`; ostatní obecná ‖ final: Je tam výčet → `detektiv-oprava-jine-chyby`; Začíná tam vedlejší věta → `detektiv-oprava-jine-chyby`; Stojí tam ale → `detektiv-oprava-jine-chyby` | Otázky: Celá úloha: „Řekni mi, ve kterých případech se píše čárka, i když je věta krátká.“ / Krok 1: „Projdi Petrovu větu slovo po slovu. Je v ní výčet, ale, věta, která sama neobstojí, nebo oslovení? Kde přesně?“ / Krok 1 a 2: „Řekni Petrovu větu nahlas tak, jak by ji Petr řekl. Kde se zastavíš? Proč právě tam?“ · Typická chyba: Podívejte se na obrazovku dítěte. Klikne za tabuli, před a. Zeptejte se: „Spojuje a jen dvě věci, které má Klára udělat?“ Klikne jinam: „Na koho se volá a kde to volání končí?“ V kroku 2 zvolí jiný důvod: „Na koho Petr volá?“ |
| U5 kontrolní (6) | Klikni na všechna místa, kam patří čárka. *Měří:* Samostatně napsat šest čárek ve větách jednoduchých i v souvětí: oslovení, výčet, ale a vložená vedlejší věta. | **final** `klik_ve_textu` `cil: "mezery"`, min 1, max 8, popisek „Tvoje odpověď“; text: *Tomáši na výlet si vezmi mapu svačinu láhev a pláštěnku. Ten batoh je starý ale pohodlný. Kluci kteří přišli pozdě musí počkat venku.* tokeny (mezera i = místo za slovem i): **Tomáši(0)** na(1) výlet(2) si(3) vezmi(4) **mapu(5)** **svačinu(6)** láhev(7) a(8) pláštěnku(9) Ten(10) batoh(11) je(12) **starý(13)** ale(14) pohodlný(15) **Kluci(16)** kteří(17) přišli(18) **pozdě(19)** musí(20) počkat(21) venku(22) | final `[0, 5, 6, 13, 16, 19]` (za Tomáši, za mapu, za svačinu, za starý, za Kluci, za pozdě) | final: chybi `[0]` → `carka-osloveni-chybi`; chybi `[5, 6]` → `carka-vycet-chybi`; chybi `[13]` → `carka-chybi-pred-ale`; chybi `[19]` → `carka-vlozena-chybi-druha`; ostatní obecná | Otázky: „Řekni mi vlastními slovy, ve kterých případech se píše čárka.“ / „Projdi větu po větě. Je v ní oslovení, výčet, ale, nebo věta, která sama neobstojí?“ / „Ve třetí větě najdi slovo, kterým začíná věta, která sama neobstojí. Kde začíná a kde končí?“ · Typická chyba: Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: chybí čárka za Tomáši: „Na koho se volá?“ Ve výčtu: „Kolik věcí je vyjmenováno?“ Před ale: „Jdou starý a pohodlný spolu?“ Za Kluci nebo za pozdě: „Kde začíná a končí věta s kteří?“ Před a: „Spojuje jen?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Kontrola pro vás (kontrolní):** Tomáši, na výlet si vezmi mapu, svačinu, láhev a pláštěnku. (oslovení; výčet, před a ne) Ten batoh je starý, ale pohodlný. (před ale) Kluci, kteří přišli pozdě, musí počkat venku. (vložená věta: před i za) **Výsledek:** čárky za Tomáši, mapu, svačinu, starý, Kluci, pozdě


---

## LEKCE 36 — Kontrola tématu: souvětí a čárka (`cj-t9-l36`)

`tema`: „Kontrola tématu: souvětí a čárka“ · `kapitola`: `souveti` · `tyden` 9, `poradi` 4 · `cas_min` 25 (4 + 5 + 5 + 5 + 6).

**Cíl:** Dítě samo určí větu hlavní a vedlejší, napíše všechny čárky tématu (hranice vět, výčet, ale, oslovení) a u každé řekne, proč tam je.

**Úvod pro rodiče:** Dnes se nic nového neučí: dítě ukáže, že samo pozná větu hlavní a vedlejší a napíše čárky celého tématu.

**Platí:**
1. `Čárka: hranice vět, výčet, ale` — co to je (30 znaků)
2. `Ne před a, i, ani, nebo (spojují)` — test (33 znaků)
3. `Vím, že Ema zítra přijde.` — příklad (25 znaků)

**Slovníček pro rodiče:**
- *přísudek* — sloveso ve větě, které říká, co kdo dělá nebo co se děje (hraje, šli); patří k němu i chce jít nebo budu číst
- *věta jednoduchá* — věta s jedním přísudkem (Tomáš, Lucka a Klára šli ven.)
- *souvětí* — dvě nebo více vět spojených dohromady; vět je tolik, kolik je přísudků
- *věta hlavní* — věta, která obstojí sama (Vím.)
- *věta vedlejší* — věta, která sama neobstojí; začíná slovem jako že, když, protože, aby, který, kde (že přijdeš)
- *vložená věta* — vedlejší věta uprostřed jiné věty; čárka je před ní i za ní (Kluk, který přišel, se smál.)
- *spojovací slovo* — slovo, které připojuje vedlejší větu (že, když, protože, který), nebo jen spojuje (a, i, ani, nebo)
- *výčet* — několik slov za sebou, která ve větě dělají totéž (svačina, pití a mikina); mezi nimi je čárka, před posledním a není
- *oslovení* — jméno toho, na koho voláme (Tomáši!, Kláro!); odděluje se čárkou
- *ale* — slovo, které staví jednu věc proti druhé (malý, ale rychlý); před ním je čárka
- *a, i, ani, nebo* — slova, která jen spojují dvě věci za sebou (Tomáš i Lucka); čárka před nimi není
- *diktát* — dítě píše věty, které slyší z nahrávky; aplikace porovná slova (čárky v diktátu nepočítá)

**Pomůcky:** sešit, propiska.

| Úloha | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | V řadě A urči, kolik vět je v souvětí. V řadě B vyber větu vedlejší. V řadách C a D vyber větu, která je napsaná správně. · A) Lucka chce hrát tenis, protože ji to baví. · B) Tomáš ví, kde je klíč. *Měří:* Zopakovat celé téma: počet vět, větu vedlejší, čárku před ale a ve výčtu. | **k1** `dlazdice`, popisek „Řada A“: 1 věta · 2 věty · 3 věty ‖ **k2** `dlazdice`, popisek „Řada B“: Tomáš ví · kde je klíč ‖ **k3** `dlazdice`, popisek „Řada C“: Venku je zima, ale svítí slunce. · Venku je zima ale svítí slunce. ‖ **final** `dlazdice`, popisek „Řada D“: Honzík koupil rohlíky mléko a máslo. · Honzík koupil rohlíky, mléko a máslo. · Honzík koupil rohlíky, mléko, a máslo. | k1 2 věty ‖ k2 kde je klíč ‖ k3 Venku je zima, ale svítí slunce. ‖ final Honzík koupil rohlíky, mléko a máslo. | k1: 1 věta → obecná; 3 věty → `souveti-infinitiv-jako-veta` ‖ k2: Tomáš ví → `veta-hlavni-za-vedlejsi` ‖ k3: Venku je zima ale svítí slunce. → `carka-chybi-pred-spojkou` ‖ final: Honzík koupil rohlíky mléko a máslo. → `carka-vycet-chybi`; Honzík koupil rohlíky, mléko, a máslo. → `carka-navic-a` | Otázky: A: „Kolik věcí se v řadě A děje? Najdi slova, která to říkají.“ / B: „Kterou část řekneš samotnou a dává smysl? Kterou ne?“ / C a D: „Staví ale jednu věc proti druhé? A kolik věcí Honzík koupil? Co je mezi nimi?“ · Typická chyba: Podívejte se na obrazovku dítěte. V A vybere 3: „Dělá Lucka dvě věci, nebo jednu?“ V B vybere Tomáš ví: „Dá se ta část říct samotná?“ V C vybere větu bez čárky: „Staví ale jednu věc proti druhé?“ V D vybere jinou větu: „Co je mezi věcmi?“ |
| U2 nová (5) | U každého označeného slovesa vyber, jestli je ve větě hlavní, nebo vedlejší. *Měří:* Určit u pěti přísudků ve dvou souvětích, jestli patří do věty hlavní, nebo vedlejší, i u věty na začátku a u věty vložené. | **final** `oznac_role`, role ['věta hlavní', 'věta vedlejší'], popisek „Tvoje odpověď“; text: *Když Adam přišel domů, zjistil, že nemá klíče. Kolo, které dostal Tomáš k narozeninám, stojí v garáži.* tokeny: Když(0) Adam(1) **přišel(2)** domů(3) **zjistil(4)** že(5) **nemá(6)** klíče(7) Kolo(8) které(9) **dostal(10)** Tomáš(11) k(12) narozeninám(13) **stojí(14)** v(15) garáži(16); `slova: [2, 4, 6, 10, 14]` | final přišel(2) věta vedlejší; zjistil(4) věta hlavní; nemá(6) věta vedlejší; dostal(10) věta vedlejší; stojí(14) věta hlavní | final: `{"2": "věta hlavní", "4": "věta vedlejší", "6": "věta hlavní", "10": "věta hlavní", "14": "věta vedlejší"}` → `veta-hlavni-za-vedlejsi` | Otázky: „Jak poznáš větu hlavní a větu vedlejší? Řekni to vlastními slovy.“ / „Vezmi sloveso přišel. Řekni celou jeho větu. Jakým slovem začíná? Dá se říct samotná?“ / „Ve druhém souvětí najdi slovo, kterým začíná věta, která sama neobstojí. Kde ta věta končí? Co zbude, když ji vynecháš?“ · Typická chyba: Podívejte se na obrazovku dítěte. U přišel vybere hlavní, protože je první. Zeptejte se: „Jakým slovem ta věta začíná?“ U dostal nebo nemá vybere hlavní: „Dá se ta věta říct samotná?“ U stojí vybere vedlejší: „Co zbude, když vynecháš větu s které?“ |
| U3 nová (5) | Klikni na všechna místa, kam patří čárka. *Měří:* Napsat čárky u oslovení, před že, ve výčtu a před ale a nenapsat čárku před a ve výčtu. | **final** `klik_ve_textu` `cil: "mezery"`, min 1, max 6, popisek „Tvoje odpověď“; text: *Tomáši zavolej Emě že trénink začíná dříve. Přines míč chrániče a láhev. Lucka je unavená ale spokojená.* tokeny (mezera i = místo za slovem i): **Tomáši(0)** zavolej(1) **Emě(2)** že(3) trénink(4) začíná(5) dříve(6) Přines(7) **míč(8)** chrániče(9) a(10) láhev(11) Lucka(12) je(13) **unavená(14)** ale(15) spokojená(16) | final `[0, 2, 8, 14]` (za Tomáši, za Emě, za míč, za unavená) | final: chybi `[0]` → `carka-osloveni-chybi`; chybi `[2]` → `carka-chybi-ze`; chybi `[8]` → `carka-vycet-chybi`; chybi `[14]` → `carka-chybi-pred-ale`; ostatní obecná | Otázky: „Vyjmenuj, kde všude se píše čárka. Co si z tématu pamatuješ?“ / „Projdi větu po větě. Je v ní oslovení, výčet, ale, nebo věta, která sama neobstojí?“ / „V první větě: na koho se volá? A kde začíná věta, která sama neobstojí?“ · Typická chyba: Podívejte se na obrazovku dítěte. Chybí čárka za Tomáši: „Na koho se volá?“ Za Emě: „Kde začíná věta, která sama neobstojí?“ Za míč: „Kolik věcí je vyjmenováno?“ Za unavená: „Staví ale jednu věc proti druhé?“ Čárka před a: „Spojuje jen?“ |
| U4 detektiv (5) | Petr napsal tři věty, v jedné udělal chybu: · A) Lucka čte, a Tomáš píše. · B) Vím, že přijdeš. · C) Máme jablka, hrušky a švestky. · Najdi ji. *Měří:* Najít u Petra čárku navíc před a, které jen spojuje, a říct, proč tam nepatří. | **k1** `dlazdice`, popisek „Ve které větě se Petr spletl?“: Věta A · Věta B · Věta C ‖ **final** `dlazdice`, popisek „Co je na té větě špatně?“: Čárka před a, které jen spojuje · Chybí čárka před že · Chybí čárka před a ve výčtu · Čárka před že je navíc | k1 Věta A ‖ final Čárka před a, které jen spojuje | k1: Věta B → `detektiv-jine-slovo`; Věta C → `carka-pred-a-vzdy` ‖ final: Chybí čárka před že → `detektiv-oprava-jine-chyby`; Chybí čárka před a ve výčtu → `carka-pred-a-vzdy`; Čárka před že je navíc → `detektiv-oprava-jine-chyby` | Otázky: Celá úloha: „Řekni mi vlastními slovy, kde se píše čárka a kde ne.“ / Krok 1: „Projdi Petrovy věty jednu po druhé. U každé čárky řekni, proč tam je. Kde důvod nenajdeš?“ / Krok 1 a 2: „Řekni každou Petrovu větu nahlas a řekni, kam podle tebe patří čárky. Kde to máš jinak než Petr?“ · Typická chyba: Podívejte se na obrazovku dítěte. Vybere větu C, protože tam chybí čárka před a. Zeptejte se: „Co dělá a ve výčtu?“ (Petr ji má dobře.) Vybere B: „Proč je čárka před že?“ V kroku 2 zvolí jiný důvod: „Co dělá a ve větě A?“ |
| U5 kontrolní (6) **týdenní** | Nejdřív napiš diktát: pusť si nahrávku a napiš každou větu. Potom klikni v textu na všechna místa, kam patří čárka. *Měří:* Týdenní kontrola: napsat diktát (tři věty, hodnotí se slova) a v textu samostatně napsat šest čárek všech druhů z tématu. | **k1** `diktat`, max_prehrani 2, hodnotit_interpunkci false, hodnotit_velikost false; d1 *Doufám, že Tomáš přijde domů.* (5 sl.) · d2 *Kluk, který sedí vedle, hraje hokej.* (6 sl.) · d3 *Do batohu dej svetr, bundu a boty.* (7 sl.) ‖ **final** `klik_ve_textu` `cil: "mezery"`, min 1, max 8, popisek „Tvoje odpověď“; text: *Kláro víš že zápas začíná v pět? Vezmi si šálu čepici a deku. Kluci kteří hrají v obraně jsou unavení ale šťastní.* tokeny (mezera i = místo za slovem i): **Kláro(0)** **víš(1)** že(2) zápas(3) začíná(4) v(5) pět(6) Vezmi(7) si(8) **šálu(9)** čepici(10) a(11) deku(12) **Kluci(13)** kteří(14) hrají(15) v(16) **obraně(17)** jsou(18) **unavení(19)** ale(20) šťastní(21) | k1 věty diktátu (slova) ‖ final `[0, 1, 9, 13, 17, 19]` (za Kláro, za víš, za šálu, za Kluci, za obraně, za unavení) | k1: d1 domů(4) → `u-carka-za-krouzek` (aplikace: diktat-pravopis-u-carka-za-krouzek); jiné slovo → `diktat-jine-slovo` ‖ final: chybi `[17]` → `carka-vlozena-chybi-druha`; chybi `[9]` → `carka-vycet-chybi`; chybi `[19]` → `carka-chybi-pred-ale`; chybi `[0]` → `carka-osloveni-chybi`; ostatní obecná | Otázky: „Řekni mi vlastními slovy, kde všude se píše čárka.“ / „V diktátu: kolik slov má věta? V textu: projdi větu po větě. Je tam oslovení, výčet, ale, nebo vedlejší věta?“ / „Ve třetí větě najdi slovo, kterým začíná věta, která sama neobstojí. Kde ta věta končí?“ · Typická chyba: Kontrolní úloha: než dítě odevzdá, mlčte; když se úplně zasekne (minutu nic nekliká nebo řekne „nevím“), čtěte Otázky 1–3 z taháku. Po odevzdání se podívejte na obrazovku dítěte: v diktátu jiné slovo nebo domú: „Pusť si větu znovu, jen to slovo.“ V kroku 2 chybí čárka za obraně: „Kde končí věta s kteří?“ Ve výčtu nebo před ale: „Kolik věcí je vyjmenováno? Staví ale jednu věc proti druhé?“ Semafor: opraví se samo, bez vaší otázky = „Sám/sama“; opraví se po vaší otázce = „Potřeboval(a) otázku“; chybu neopraví = „Spletl(a) se“. |

**Semafor týdne (z kroku final):** zelena: všech 6 čárek v kroku 2 na svém místě a žádná navíc (min 6) · oranzova: 4 nebo 5 čárek z 6 správně (čárka navíc se počítá jako chybějící) (min 4) · cervena: 3 a méně čárek z 6 správně (min 0)

**Kontrola pro vás (kontrolní):** #### Krok 1 (diktát) Doufám, že Tomáš přijde domů. Kluk, který sedí vedle, hraje hokej. Do batohu dej svetr, bundu a boty. Čárky aplikace v diktátu nepočítá; po odevzdání se podívejte, jestli je dítě napsalo (za Doufám, Kluk, vedle, svetr). #### Krok 2 Kláro, víš, že zápas začíná v pět? (oslovení; před že) Vezmi si šálu, čepici a deku. (výčet; před a ne) Kluci, kteří hrají v obraně, jsou unavení, ale šťastní. (vložená věta: před i za; před ale) **Výsledek:** čárky za Kláro, víš, šálu, Kluci, obraně, unavení


---

## Nahrávky (pro AUDIO.md)

Řádky ve formátu tabulky `cestina/Obsah/AUDIO.md` (vedoucí je sloučí). Soubory `web/audio/cestina/t9/…`, v JSON `audio/cestina/t9/…`. Hlas a postup podle AUDIO.md (Jana, Eleven v4, tempo 0,9). Celkem **5 nahrávek** (2 poslechy, 3 věty diktátu).

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t9/l33-u3.mp3` | 33 / úloha 3 (`k1` i `final`) | poslech | Když jsme přišli domů, máma vařila večeři a táta četl noviny. | Přirozená intonace, pauza za „domů“ jen běžná (čárka se neověřuje). Nezdůrazňovat „Když“ ani „a“. Asi 4 s. | čeká |
| `t9/l34-u2.mp3` | 34 / úloha 2 (`k1` i `final`) | poslech | Lucka čte knihu a Tomáš, který přišel pozdě, píše úkol. | Přirozeně; pauzy kolem „který přišel pozdě“ ne delší než běžné. Nezdůrazňovat „který“. Asi 4 s. | čeká |
| `t9/l36-d1.mp3` | 36 / úloha 5, `k1`, věta 1 | diktát | Doufám, že Tomáš přijde domů. | 2×: celá věta, pauza 2 s, pomalu po slovech (0,75×, pauza 0,7 s); interpunkce se neříká a pauza na místě čárky nesmí být delší než mezi slovy; hlásit „velké písmeno — Tomáš“; „domů“ s dlouhým ů | čeká |
| `t9/l36-d2.mp3` | 36 / úloha 5, `k1`, věta 2 | diktát | Kluk, který sedí vedle, hraje hokej. | 2× jako d1; čárky se neříkají, pauzy na jejich místě ne delší než mezi slovy; „Kluk“ s jasným k na konci | čeká |
| `t9/l36-d3.mp3` | 36 / úloha 5, `k1`, věta 3 | diktát | Do batohu dej svetr, bundu a boty. | 2× jako d1; čárka se neříká; bez pauzy před „a“ | čeká |

---

## Ověření ÚJČ

Ověřeno 1.–2. 10. 2026 (autor) a 4. 10. 2026 (korektor) přes `bash nastroje/ujc.sh` (tabulka tvarů nebo výklad). Pravidla čárky:

| výklad | co z něj platí v tématu | odkaz |
|---|---|---|
| id=150 Psaní čárky v souvětí | čárka mezi větou hlavní a vedlejší (*že, když, protože, aby, až*), před vztažným *který, kdo, kde* (*kdo, který* = vztažná zájmena, *kde* = příslovce); vložené vedlejší věty z obou stran; *a, i, ani, nebo* ve slučovacím poměru mezi větami bez čárky | https://prirucka.ujc.cas.cz/?id=150 |
| id=151 Psaní čárky ve větě jednoduché | výčet bez spojky čárkou, poslední člen se spojkou bez čárky (*Marie, Jana, Petr a Ctibor*); odporovací *ale* čárkou (*krásná, ale náročná*); oslovení; několikanásobný přísudek: „rozdílné názory“ na počet vět → v úlohách na počet vět není | https://prirucka.ujc.cas.cz/?id=151 |
| id=153 Psaní čárky před spojkami a, i, ani | slučovací *a* bez čárky, i *a potom, a pak, a také*; slučovací *i, ani* bez čárky | https://prirucka.ujc.cas.cz/?id=153 |
| id=155 Psaní čárky před spojkami nebo, či | *nebo* slučovací bez čárky, vylučovací s čárkou → v hodnoceném místě nepoužito | https://prirucka.ujc.cas.cz/?id=155 |
| id=127 Psaní ú/ů | *ů* uvnitř a na konci domácích slov (*domů*) — diktát L36 | https://prirucka.ujc.cas.cz/?id=127 |

Hesla (slovní druh / rod / tvar, který se v lekcích vyskytuje):

| heslo | lekce | v příručce (tvary z lekcí) | stav | odkaz |
|---|---|---|---|---|
| Adam | L33, L34, L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=Adam |
| autobus | L33 | rod: m. neživ.; autobus | OK | https://prirucka.ujc.cas.cz/?slovo=autobus |
| babička | L34, L36 | rod: ž.; babičce | OK | https://prirucka.ujc.cas.cz/?slovo=babi%C4%8Dka |
| batoh | L35, L36 | rod: m. neživ.; batohu | OK | https://prirucka.ujc.cas.cz/?slovo=batoh |
| bavit | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=bavit |
| bota | L36 | rod: ž.; boty | OK | https://prirucka.ujc.cas.cz/?slovo=bota |
| bunda | L36 | rod: ž.; bundu | OK | https://prirucka.ujc.cas.cz/?slovo=bunda |
| bydlet | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=bydlet |
| běhat | L33 | K těmto slovům se řadí i příd. jm. tamější. Není | OK | https://prirucka.ujc.cas.cz/?slovo=b%C4%9Bhat |
| cesta | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=cesta |
| chránič | L36 | rod: m. neživ.; chrániče | OK | https://prirucka.ujc.cas.cz/?slovo=chr%C3%A1ni%C4%8D |
| chtít | L33, L34, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=cht%C3%ADt |
| deka | L36 | rod: ž.; deku | OK | https://prirucka.ujc.cas.cz/?slovo=deka |
| dlouhý | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=dlouh%C3%BD |
| domů | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=dom%C5%AF |
| dostat | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=dostat |
| doufat | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=doufat |
| dát | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=d%C3%A1t |
| dřív | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=d%C5%99%C3%ADv |
| Ema | L33, L34, L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=Ema |
| film | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=film |
| fotbal | L33, L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=fotbal |
| garáž | L36 | rod: ž.; garáži | OK | https://prirucka.ujc.cas.cz/?slovo=gar%C3%A1%C5%BE |
| gauč | L34 | gauči (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=gau%C4%8D |
| hokej | L34, L36 | rod: m. neživ.; hokej | OK | https://prirucka.ujc.cas.cz/?slovo=hokej |
| horečka | L34 | rod: ž.; horečku | OK | https://prirucka.ujc.cas.cz/?slovo=hore%C4%8Dka |
| hruška | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=hru%C5%A1ka |
| hrát | L33, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=hr%C3%A1t |
| hřiště | L33, L36 | rod: s.; hřišti | OK | https://prirucka.ujc.cas.cz/?slovo=h%C5%99i%C5%A1t%C4%9B |
| jablko | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=jablko |
| jet | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=jet |
| jogurt | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=jogurt |
| jít | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=j%C3%ADt |
| kamarád | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=kamar%C3%A1d |
| kluk | L34, L36 | rod: m. živ.; kluk | OK | https://prirucka.ujc.cas.cz/?slovo=kluk |
| Klára | L33, L34, L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=Kl%C3%A1ra |
| klíč | L36 | rod: m. neživ.; klíč klíče | OK | https://prirucka.ujc.cas.cz/?slovo=kl%C3%AD%C4%8D |
| kniha | L33, L34, L34 | rod: ž.; knihu | OK | https://prirucka.ujc.cas.cz/?slovo=kniha |
| kolo | L34, L35, L36 | rod: s.; kolo | OK | https://prirucka.ujc.cas.cz/?slovo=kolo |
| koupit | L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=koupit |
| kočka | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=ko%C4%8Dka |
| kreslit | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=kreslit |
| kytara | L35, L36 | rod: ž.; kytaru | OK | https://prirucka.ujc.cas.cz/?slovo=kytara |
| les | L34 | rod: m. neživ.; lese | OK | https://prirucka.ujc.cas.cz/?slovo=les |
| láhev | L35, L36 | rod: ž.; láhev | OK | https://prirucka.ujc.cas.cz/?slovo=l%C3%A1hev |
| malý | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=mal%C3%BD |
| mapa | L35 | rod: ž.; mapu | OK | https://prirucka.ujc.cas.cz/?slovo=mapa |
| med | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=med |
| mikina | L35 | rod: ž.; mikina | OK | https://prirucka.ujc.cas.cz/?slovo=mikina |
| mléko | L35, L36 | rod: s.; mléko | OK | https://prirucka.ujc.cas.cz/?slovo=ml%C3%A9ko |
| muset | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=muset |
| máslo | L36 | rod: s.; máslo | OK | https://prirucka.ujc.cas.cz/?slovo=m%C3%A1slo |
| mít | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=m%C3%ADt |
| míč | L34, L35, L36 | rod: m. neživ.; míč | OK | https://prirucka.ujc.cas.cz/?slovo=m%C3%AD%C4%8D |
| najít | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=naj%C3%ADt |
| napsat | L33, L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=napsat |
| napínavý | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=nap%C3%ADnav%C3%BD |
| narozeniny | L36 | narozeninám (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=narozeniny |
| nemocný | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=nemocn%C3%BD |
| noc | L34 | noc (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=noc |
| noviny | L33 | noviny (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=noviny |
| nový | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=nov%C3%BD |
| obrana | L36 | rod: ž.; obraně | OK | https://prirucka.ujc.cas.cz/?slovo=obrana |
| obrázek | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=obr%C3%A1zek |
| oběd | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=ob%C4%9Bd |
| park | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=park |
| patřit | L34, L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=pat%C5%99it |
| pes | L34, L35 | rod: m. živ.; pes | OK | https://prirucka.ujc.cas.cz/?slovo=pes |
| pití | L35 | rod: s.; pití | OK | https://prirucka.ujc.cas.cz/?slovo=pit%C3%AD |
| plot | L34 | rod: m. neživ.; plotu | OK | https://prirucka.ujc.cas.cz/?slovo=plot |
| pláštěnka | L35 | rod: ž.; pláštěnka pláštěnku | OK | https://prirucka.ujc.cas.cz/?slovo=pl%C3%A1%C5%A1t%C4%9Bnka |
| podat | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=podat |
| pohodlný | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=pohodln%C3%BD |
| pozdě | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=pozd%C4%9B |
| později | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=pozd%C4%9Bji |
| pršet | L33, L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=pr%C5%A1et |
| psát | L33, L34, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=ps%C3%A1t |
| přijít | L33, L34, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=p%C5%99ij%C3%ADt |
| přinést | L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=p%C5%99in%C3%A9st |
| půjčit | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=p%C5%AFj%C4%8Dit |
| rohlík | L35, L36 | rohlíky (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=rohl%C3%ADk |
| rychlý | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=rychl%C3%BD |
| ráno | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=r%C3%A1no |
| sedět | L34, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=sed%C4%9Bt |
| skončit | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=skon%C4%8Dit |
| slovo | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=slovo |
| slunce | L36 | rod: s.; slunce | OK | https://prirucka.ujc.cas.cz/?slovo=slunce |
| spokojený | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=spokojen%C3%BD |
| spát | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=sp%C3%A1t |
| starý | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=star%C3%BD |
| stát | L34, L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=st%C3%A1t |
| stůl | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=st%C5%AFl |
| svačina | L35 | rod: ž.; svačina svačinu | OK | https://prirucka.ujc.cas.cz/?slovo=sva%C4%8Dina |
| svetr | L36 | rod: m. neživ.; svetr | OK | https://prirucka.ujc.cas.cz/?slovo=svetr |
| svítit | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=sv%C3%ADtit |
| sýr | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=s%C3%BDr |
| tabule | L35 | rod: ž.; tabuli | OK | https://prirucka.ujc.cas.cz/?slovo=tabule |
| talíř | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=tal%C3%AD%C5%99 |
| tenis | L35, L36 | rod: m. neživ.; tenis | OK | https://prirucka.ujc.cas.cz/?slovo=tenis |
| Tomáš | L33, L34, L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=Tom%C3%A1%C5%A1 |
| trenér | L33 | rod: m. živ.; trenér | OK | https://prirucka.ujc.cas.cz/?slovo=tren%C3%A9r |
| tráva | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=tr%C3%A1va |
| trénink | L33, L34, L36 | trénink (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=tr%C3%A9nink |
| ujet | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=ujet |
| umýt | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=um%C3%BDt |
| unavený | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=unaven%C3%BD |
| usnout | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=usnout |
| vařit | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=va%C5%99it |
| vedle | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=vedle |
| venku | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=venku |
| večeře | L33 | večeři (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=ve%C4%8De%C5%99e |
| volejbal | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=volejbal |
| vstát | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=vst%C3%A1t |
| vzít | L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=vz%C3%ADt |
| výlet | L35 | rod: m. neživ.; výlet | OK | https://prirucka.ujc.cas.cz/?slovo=v%C3%BDlet |
| vědět | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=v%C4%9Bd%C4%9Bt |
| zavolat | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=zavolat |
| zazvonit | L35, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=zazvonit |
| začínat | L34, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=za%C4%8D%C3%ADnat |
| zima | L35, L36 | zima | OK | https://prirucka.ujc.cas.cz/?slovo=zima |
| zjistit | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=zjistit |
| zpívat | L33, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=zp%C3%ADvat |
| zábavný | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=z%C3%A1bavn%C3%BD |
| zápas | L36 | rod: m. neživ.; zápas | OK | https://prirucka.ujc.cas.cz/?slovo=z%C3%A1pas |
| zůstat | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=z%C5%AFstat |
| úkol | L33, L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C3%BAkol |
| čaj | L35 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C4%8Daj |
| čekat | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C4%8Dekat |
| čepice | L36 | čepici (ověřeno korektorem 4. 10.) | OK | https://prirucka.ujc.cas.cz/?slovo=%C4%8Depice |
| číst | L33, L34, L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C4%8D%C3%ADst |
| šatna | L33 | rod: ž.; šatny | OK | https://prirucka.ujc.cas.cz/?slovo=%C5%A1atna |
| škola | L33 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C5%A1kola |
| štěkat | L34 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C5%A1t%C4%9Bkat |
| švestka | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C5%A1vestka |
| šála | L36 | rod: ž.; šálu | OK | https://prirucka.ujc.cas.cz/?slovo=%C5%A1%C3%A1la |
| šťastný | L36 | heslo a tvary z lekcí ověřeny korektorem 4. 10. | OK | https://prirucka.ujc.cas.cz/?slovo=%C5%A1%C5%A5astn%C3%BD |

Korektor 4. 10. 2026 ověřil přes `nastroje/ujc.sh` všechna hesla výše (dříve „neověřeno“). Pozor na tvary s dubletou, které se v tématu jen tisknou a nehodnotí: *Tomášovi/Tomáši*, *Adamovi/Adamu* (3. p.), *láhev/lahev*, *musí/musejí*; *dřív* je hovorové, v L36 U3 proto opraveno na *dříve*. Hesla přidaná korekturou: *vědět* (ví), *pršet* (prší) — L33 U4 řádek B; *třída*, *výlet* — slovníček L33; *bunda*, *levný*, *teplý* — L35 U3 dvojice A; *sešit*, *pravítko*, *guma* — slovníček L35; vše ověřeno (https://prirucka.ujc.cas.cz/?slovo=v%C4%9Bd%C4%9Bt, …?slovo=pr%C5%A1et, …?slovo=bunda, …?slovo=levn%C3%BD, …?slovo=tepl%C3%BD).

---

## Korektura (4. 10. 2026)

Korektor ověřil znovu všechno (hesla, pravidla id=127, 150, 151, 153, indexy, vyhodnocení skriptem přes `vyhodnotKrok` + `vzorovaOdpoved`: všechny vzorové odpovědi správně, každá chybná dlaždice a známá chyba vrací svůj kód). Opravy v JSON i v tabulkách výše:
- L33 U4 řádek B „Vím, že přijdeš.“ (shodný s příkladem v Platí) → „Lucka ví, že prší.“; otázka 3 „Najdi řádek, kde je víc jmen než sloves“ ukazovala na chybný řádek → obecná nápověda; slovníček *věta jednoduchá* měl příklad = odpověď U2 A → „Celá třída jela na výlet.“; typická chyba U2 pokrývá i chybné volby v řádku D.
- L34 U1 zadání nazývalo řadu B (1 věta) souvětím → „kolik je v řádku vět“ (i tisk); U4 otázky 2–3 prozrazovaly odpověď kroku 2 („kde ta věta končí“) → neutrální.
- L35 U3 dvojice A „Ten pes je malý, ale rychlý.“ = příklad z Platí → „Ta bunda je levná, ale teplá.“; U4 otázky 2–3 prozrazovaly oslovení (odpověď kroku 2) → neutrální; slovníček *výčet* → „sešit, pravítko a guma“.
- L36 U3 *dřív* (ÚJČ: hovorové) → *dříve*; U2 otázka 3 dávala přesné hranice vedlejší věty → nápověda; U4 otázka 3 prozrazovala odpověď kroku 2 → neutrální; tisk U5 „Poslouchej věty (pustí ti je rodič)“.
- Všude „věta, co sama neobstojí“ → „věta, která sama neobstojí“.
- Poznámka 1 níže (schéma `t[1-8]`) už neplatí: validátor nahrávky `t9` přijímá.

## Nejistoty

Jazykově (pravidla čárky, tvary) nejistoty nejsou. Hodnocená místa stojí jen na pravidlech z id=150, 151, 153 a na počtu přísudků; dublety (vylučovací *nebo*, *a* za vloženou větou, několikanásobný přísudek v počítání vět) v hodnocených místech nejsou. Metodické nejistoty:

1. **L36 diktát, kód `u-carka-za-krouzek` u *domů*.** Slovník kód popisuje „napíše *ú* uvnitř domácího slova (*dúm*)“; *domů* má *ů* na konci (ÚJČ id=127 uvádí právě *dolů, domů*). Jiný existující kód pro *ů* není. Vyhodnocení diktátu navíc dá tento kód **každé** jiné podobě slova na tom místě (i *domu*). Návrh: rozšířit popis kódu na „napíše *ú* (nebo *u*) místo *ů* uvnitř nebo na konci domácího slova“. Ostatní slova diktátu jsou jen ze Z5 bez kódu (chyba = `diktat-jine-slovo`).
2. **L36 diktát nic z tématu neměří** (čárky se podle ZADANI-OSMA §8 bod 4 nehodnotí). Řešení v lekci: v `reseni` je text diktátu a rodič po odevzdání podívá, jestli dítě čárky napsalo (za *Doufám, Kluk, vedle, svetr*); semafor týdne se počítá jen z kroku `final` (6 čárek). Text diktátu je v `tahak.reseni` (rodič, sbalené, až po odevzdání); v zadání, tisku, popiscích ani otázkách není.
3. **L34 U4 detektiv, nabídka kroku 2** obsahuje *výčet* a *oslovení*, které přijdou až v L35 (nabídka je převzatá z osnovy). Jsou to jen chybné možnosti; když vadí, nahradit „Stojí tam spojka a“ a „Jsou tam dvě slovesa“.
4. **Přísudek ze dvou slov** (*chce jít, budu číst*, L33 U1, U2): dlaždice nabízí jen celé spojení, samotné *chce* v nabídce není (dítě, které by ho vybralo, by mělo „napůl pravdu“).
5. **Poslech:** přirozená pauza na místě čárky může dítěti napovědět hranici vět. To osnova připouští (poslech měří počet vět sluchem); pokyn pro hlas je „pauzy ne delší než běžné“.
6. **`semafor_tydne` (L36):** „čárka navíc se počítá jako chybějící“ je jen text podmínky; aplikace semafor týdne nepočítá (FORMAT-CJ §5).
7. **`zname_chyby` nejvýš 4:** v úlohách na čárky s více druhy čárek jsou některá místa obecná chyba: L34 U3 nic; L34 U5 čárka navíc jinde; L35 U5 *Kluci* (před *kteří*) a čárka před *a*; L36 U3 čárka před *a*; L36 U5 *víš* (před *že*), *Kluci* (před *kteří*) a čárka před *a*. Všechna tato místa jsou zmíněná v taháku (typická chyba nebo otázka).

---

## Poznámky pro vedoucího

1. **Nález ve schématu (blokuje validaci tématu 9 a 10):** `obsah/schema.json`, `$defs.vstupCestina.properties.audio.pattern` a `…vety.items.properties.audio.pattern` mají `^audio/cestina/t[1-8]/…` (převzato ze Spolu, 8 týdnů). Nahrávky `audio/cestina/t9/…` proto hlásí chybu „neodpovídá vzoru“ (L33 2×, L34 2×, L36 3×). Návrh: `^audio/cestina/t([1-9]|10)/l[0-9]+-[a-z0-9-]+\.mp3$` na obou místech. Schéma jsem neměnil (není můj soubor). Druhá očekávaná chyba: „nahrávka nemá řádek v AUDIO.md“ (5 řádků výše v oddílu Nahrávky).
2. **Nález v nástroji `nastroje/ujc.sh`:** když server odpoví „Jiný dotaz z Vaší internetové adresy … je ještě vyhodnocován“, skript stránku uloží do cache jako platnou. V `/tmp/ujc-cache` bylo 1. 10. v noci 75 takových záznamů (hledané heslo pak „nemá tvary“, další dotaz na něj už na server nejde). Návrh: neukládat stránku s tímto textem a dotaz zopakovat. Pro téma 9 jsem ověřoval s vlastní cache (sdílený zámek), sdílenou cache jsem neměnil. Autoři ostatních témat by měli mít na paměti, že „nenalezeno / bez tvarů“ může být jen přetížený server.
3. **Odchylky od osnovy §13:**
   - L36 U5 diktát `hodnotit_interpunkci: false` (ZADANI-OSMA §8 bod 4, osnova měla `true`), `chyby_ocekavane` místo čárek *domů* (Z5, ů); věta 1 prodloužena na „Doufám, že Tomáš přijde domů.“ (18 slov celkem), aby diktát měl aspoň jedno místo se známým kódem. Ostatní dvě věty podle osnovy.
   - L36 Platí: příklad „Vím, že Ema zítra přijde.“ místo osnovního „Doufám, že Tomáš přijde.“ (to je věta diktátu).
   - L33 U4 řádek A „Adam, Ema a Honzík hráli fotbal.“ (osnova měla stejnou větu jako U2 A). Krok 2 popisek „Kolik vět tam má být?“ (neprozradí řádek).
   - L33 U5 `k1` = počet vět v prvním souvětí (to má tři jména jako past), `final` `oznac_role` na 5 přísudcích dvou souvětí podle osnovy.
   - L35 U3: past *nebo* nahrazena *i* (*Tomáš i Lucka hrají tenis*), protože u *nebo* rozhoduje slučovací × vylučovací význam (id=155). Kód `carka-navic-pred-i-ani-nebo` zůstává.
   - L35 U4 detektiv má i `k1` (klik na místo, kde chybí čárka; past *a*), osnova uvedla jen `final`.
   - L36 U4 detektiv: tři Petrovy věty (A s čárkou před *a*, B *že*, C výčet), `k1` výběr věty, `final` důvod; nabídka kroku 2 se týká všech tří vět, takže krok 1 neprozradí. Výběr věty C = `carka-pred-a-vzdy`.
   - L34 U5: 5 čárek ve třech souvětích (dvě vložené věty), pasti *a* dvakrát; L35 U5 a L36 U5 6 čárek všech druhů.
4. **Červená** všude „Připravte: papír a tužku.“ (podle zadání; žádné nůžky ani předměty).
5. **Kódy:** žádný nový; použity `prisudek-neni-sloveso`, `podmet-prisudek-zamena`, `souveti-pocet-podle-spojek`, `souveti-infinitiv-jako-veta`, `veta-hlavni-za-vedlejsi`, `carka-chybi-ze`, `carka-chybi-ktery`, `carka-chybi-pred-spojkou`, `carka-chybi-za-uvodni-vetou`, `carka-navic-a`, `carka-pred-a-vzdy`, `carka-vlozena-chybi-druha`, `carka-vycet-chybi`, `carka-chybi-pred-ale`, `carka-navic-pred-i-ani-nebo`, `carka-osloveni-chybi`, `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby`, `u-carka-za-krouzek` (diktát). Návrh úpravy popisu `u-carka-za-krouzek` viz Nejistoty 1. Kódy `carka-chybi-ktery` a `carka-chybi-pred-spojkou` jsou použité i pro *kterého, kteří, kde* (vztažné výrazy) — odpovídá otázce kódu.
6. **Kontrola:** `npm run seed:validace -- --lekce cj-t9-l33,…,l36` → jediné chyby jsou body 1 (schéma t9, 7×) a řádky AUDIO.md (7×); vyhodnocení přes `vyhodnotKrok` + `vzorovaOdpoved`: 46 kroků správně, 125 chybných dlaždic a známých chyb vrací svůj kód, diktát bez čárek = správně. `npm test` 1174/1174.
