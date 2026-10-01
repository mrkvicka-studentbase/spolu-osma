# Osnova matematiky — Spolu 8

Verze 0.1 (návrh metodika), 1. 10. 2026. Závazné: `ZADANI-OSMA.md`, `kostra/03-format-obsahu.md`, `obsah/SABLONA.md`, `obsah/typy-chyb.md`, `obsah/schema.json`.
Čísla v lekcích zatím nejsou. Doplní je autor úloh podle rozsahů níže. Diagnostika už konkrétní čísla má a jsou přepočítaná (oddíl 5).

## 1. Co platí pro všech 40 lekcí

- **Lekce** = 4 úlohy v pořadí `rozcvicka` (4 min), `detektiv` (5 min), `cermat` (7 min), `semafor` (4 min), dohromady 20 min. Typ `cermat` je v Spolu 8 **hlavní úloha lekce**: vlastní zadání, `zdroj: "vlastni"`, žádný klon ani formát CERMAT (A–E, ANO/NE, přiřazování, pozice, body, postup). V aplikaci a v tisku se nesmí objevit slovo CERMAT (viz Otázky, bod 6).
- **4. lekce tématu = kontrola tématu.** Rozcvička má po jednom příkladu z L1, L2 a L3. Detektiv a hlavní úloha spojí dvě lekce. Semafor je samostatná úloha na ústřední dovednost tématu a barva lekce je zároveň barva tématu (používá ji pravidlo doporučení, oddíl 6).
- **Vstupy.** Používají se jen vstupy, které aplikace vyhodnotí sama: `dlazdice` (rozcvička, `k1`), `poradi` (jen rozcvička nebo `k1` hlavní úlohy, T01 a T06), `cislo`, `zlomek`, `smisene`. Semafor má vždy jediný krok `final` typu `cislo` / `zlomek` / `smisene`. Vstupy `text` a `rysovani` se **nepoužívají v žádné lekci**, protože v režimu „Dnes samo“ nefungují. `vyraz` není potřeba, výrazy s proměnnou jsou učivo 8. ročníku.
- **Bez učiva 8. ročníku:** žádné mocniny ani odmocniny (obsah čtverce je $a \cdot a$, objem krychle $a \cdot a \cdot a$; $\text{cm}^2$ a $\text{m}^3$ jsou jen značky jednotek), žádná Pythagorova věta (všechny délky a výšky jsou zadané), žádné výrazy s proměnnou ani lineární rovnice, žádný kruh. Neznámé číslo se dopočítává jen trojčlenkou, přes díl poměru nebo přes 1 %.
- **Svět úloh:** 13–14letí (škola, sport, kamarádi, technika, příroda, rodina). Jména: Tomáš, Lucka, Honzík, Klára, Adam, Ema. Detektiv je vždy Petr.
- **Úroveň:** číselná náročnost jako F1 Spolu (čísla, která dítě zvládne do 5 minut na papíře, „hezké“ výsledky). Hlavní úloha má 2–3 kroky a nejvýš 4 výpočty (SABLONA §21.9). Rozcvičku zvládne i slabší dítě. Semafor má obtížnost hlavní úlohy, ne vyšší.
- **„Platí“** = `uvod_pravidla`, vždy 3 řádky. `znak` má nejvýš 36 znaků zdrojového textu (limit schématu) a je to konkrétní příklad (SABLONA §18). `text` má 1–4 slova v neosobním tvaru. U geometrie tahák doplní legendu písmen (SABLONA §21.4).
- **Nápovědy v režimu „Dnes samo“:** otázky L1–L3 musí fungovat i jako nápověda přímo pro dítě (přímá řeč, bez rodu, bez výsledku). Proto jsou v osnově u každé lekce vyjmenované typické chyby: tahák se ptá na pravidlo, ne na číslo.
- **Pomůcky:** výchozí (sešit, propiska, tužka). Navíc „pravítko“ v T03-L3, T07 a T10, kde se kreslí náčrtek.

## 2. Pořadí témat (změna proti návrhu a důvod)

| # | téma | lekce | kapitola (`kapitola`) | ročník RVP |
|---|---|---|---|---|
| T01 | Přirozená čísla a dělitelnost | 4 | `pocetni-operace` | 5.–6. |
| T02 | Desetinná čísla | 4 | `desetinna-cisla` | 6. |
| T03 | Jednotky, obvod a obsah | 4 | `jednotky` (L1, L2, L4), `geometrie` (L3) | 6. |
| T04 | Zlomky I | 4 | `zlomky` | 6.–7. |
| T05 | Zlomky II | 4 | `zlomky` | 7. |
| T06 | Celá a racionální čísla | 4 | `cela-cisla` | 7. |
| T07 | Úhly, trojúhelníky, souměrnost, rovnoběžníky | 4 | `geometrie` | 6.–7. |
| T08 | Poměr, měřítko, úměrnost | 4 | `pomer` | 7. |
| T09 | Procenta a úrok | 4 | `procenta` | 7. |
| T10 | Tělesa a slovní úlohy | 4 | `geometrie` | 6.–7. |

**Co jsem změnil a proč:**
1. **Jednotky, obvod a obsah jsou T03, ne T08.** Převod jednotek je posun desetinné čárky o 1, 2 nebo 3 místa, tedy přímé použití T02. Dítě si čárku procvičí hned na reálných veličinách. Obvod a obsah obdélníku je učivo 6. ročníku a geometrie T07 a T10 ho potřebuje.
2. **Geometrie T07 je mezi čísly, ne až na konci.** Při 4 lekcích týdně by dítě jinak 8 týdnů nevidělo geometrii. Střídání drží motivaci. T07 potřebuje jen T03 (obsah, jednotky) a násobení desetinných čísel (T02), obojí už má.
3. **Poměr (T08) a procenta (T09) jsou na konci před tělesy.** Stavějí na zlomcích (T04–T05) a na trojčlence. T10 „Tělesa a slovní úlohy“ je poslední, protože slovní úlohy napříč používají jednotky, poměr i procenta.
4. **Obsah útvarů je rozdělený:** obdélník, čtverec a složené útvary z obdélníků (6. roč.) jsou v T03-L3. Trojúhelník, rovnoběžník a lichoběžník (7. roč.) jsou v T07-L3.
5. **Kapitoly:** používám jen existující kódy z tabulky „Názvy kapitol“ v `obsah/hlasky.md` (`pocetni-operace`, `desetinna-cisla`, `jednotky`, `geometrie`, `zlomky`, `cela-cisla`, `pomer`, `procenta`). **Nový kód kapitoly nenavrhuji.** Schéma by nový kód pustilo (jen s varováním), ale znamenal by nový řádek v hláškách a rozdělení statistik proti Spolu. Dělitelnost patří pod `pocetni-operace` stejně jako ve Spolu F1-T01-L3. Lekce mají `tyden` = číslo tématu (1–10) a `poradi` = číslo lekce (1–4). Protože `geometrie` a `jednotky` pokrývají víc témat, nese každá úloha diagnostiky číslo tématu v poli `tema` (oddíl 5).

Mimo osnovu zůstává (učivo 6.–7. roč., které ve formátu nejde nebo patří jinam): konstrukce trojúhelníku a rovnoběžníku a rýsování obrazu v souměrnosti (`rysovani` nefunguje v „Dnes samo“, Otázky, bod 4), graf přímé úměrnosti v soustavě souřadnic (jen tabulka hodnot v T08-L3), kruh a kružnice (8. roč.). Aritmetický průměr je jen jako krok v T06-L4.

---

## 3. Lekce

Zápis: **U1** rozcvička, **U2** detektiv, **U3** hlavní úloha (`typ: "cermat"`, `zdroj: "vlastni"`), **U4** semafor. U detektiva má `k1` vždy kódy `oznacil-radek-pred-chybou` / `nasel-az-dusledek` (B). Uvedený kód je Petrova matematická chyba (pro `k2` a `final`). Kódy označené **NOVÝ** jsou v oddílu 7.

### T01 Přirozená čísla a dělitelnost (`pocetni-operace`)

#### M8-T01-L1 · Pořadí operací a závorky
- **tema:** Pořadí operací a závorky · **kapitola:** `pocetni-operace`
- **Cíl pro rodiče:** Dítě řekne, co v příkladu počítá jako první, i když stojí dělení a násobení vedle sebe nebo jsou závorky v sobě.
- **Platí:**
  1. $7 + 2 \cdot 5$ — krát dřív než plus
  2. $24 : 4 \cdot 2$ — stejná přednost: zleva
  3. $[(3 + 5) \cdot 2 - 1]$ — nejdřív vnitřní závorka
- **U1 rozcvička:** A, B `poradi` (výraz se 4–5 operacemi, A s dělením a násobením vedle sebe, B s dvojí závorkou). C `dlazdice` „Kolik vyjde?“ u krátkého výrazu $a + b \cdot c$. Distraktory: `scital-pred-nasobenim`, `neslo-zleva`, `ignoroval-zavorku`.
- **U2 detektiv:** Petr počítá výraz typu $a - b : c \cdot d + e$, 4 řádky. Chyba `neslo-zleva` (nejdřív vynásobí, pak dělí). `k2` dlaždice oprava řádku, `final` `cislo`.
- **U3 hlavní:** slovní nákup („3 sešity po … Kč a 2 propisky po … Kč, platí …, kolik vrátí“). `k1` `dlazdice` „Který zápis odpovídá zadání?“ (distraktory `chybi-zavorka`, `scital-pred-nasobenim`), `k2` `cislo` mezivýsledek: útrata, `final` `cislo`.
- **U4 semafor:** výraz se závorkou v závorce a jedním dělením, `final` `cislo`.
- **Čísla:** přirozená do 1 000, všechny mezivýsledky přirozená čísla, nejvýš 5 operací, žádné mocniny.
- **Chyby:** `scital-pred-nasobenim`, `neslo-zleva`, `ignoroval-zavorku`, `chybi-zavorka`.

#### M8-T01-L2 · Znaky dělitelnosti a prvočísla
- **tema:** Dělitelnost a prvočísla · **kapitola:** `pocetni-operace`
- **Cíl pro rodiče:** Dítě podle znaků rozhodne, čím je číslo dělitelné, a rozloží ho na součin prvočísel.
- **Platí:**
  1. $1\,236$: $1 + 2 + 3 + 6 = 12$ — dělitelné třemi
  2. $316$: $16 = 4 \cdot 4$ — čtyřka: poslední dvojčíslí
  3. $60 = 2 \cdot 2 \cdot 3 \cdot 5$ — rozklad jen z prvočísel
- **U1 rozcvička** (`dlazdice` ×3): A Které číslo je dělitelné čtyřmi? B Které číslo je prvočíslo? C Které číslo je dělitelné šesti? Distraktory: `delitelnost-4-podle-posledni-cislice` (NOVÝ), `liche-je-prvocislo`, `jednicka-je-prvocislo`, `delitelnost-slozena-jedna-podminka` (NOVÝ), `delitelnost-3-podle-posledni-cislice`.
- **U2 detektiv:** Petr zapisuje, kterými z čísel 2, 3, 4, 5, 6, 9, 10 je dělitelné čtyřmístné číslo, jeden řádek = jeden dělitel. Chyba `delitelnost-4-podle-posledni-cislice` (nebo `delitelnost-3-podle-posledni-cislice`, autor zvolí jednu). `final` `cislo`: kolik z nabídnutých čísel číslo dělí.
- **U3 hlavní:** „Do čísla $4\_8$ doplň číslici, aby bylo dělitelné šesti. Napiš největší možnou.“ `k1` `dlazdice` „Vyber, co platí“ (dělitelné 2 i 3 / jen 3 / jen 2, `delitelnost-slozena-jedna-podminka`), `k2` `cislo` nejmenší vyhovující číslice, `final` `cislo` největší.
- **U4 semafor:** rozklad trojmístného čísla na prvočísla, `final` `cislo` = součet všech prvočísel z rozkladu (i opakovaných). Známé chyby: `rozklad-neuplny`, `rozklad-bez-opakovani`.
- **Čísla:** trojmístná a čtyřmístná, rozklad s prvočísly do 13, nejvýš 5 činitelů.
- **Chyby:** `delitelnost-4-podle-posledni-cislice` (NOVÝ), `delitelnost-slozena-jedna-podminka` (NOVÝ), `delitelnost-3-podle-posledni-cislice`, `liche-je-prvocislo`, `jednicka-je-prvocislo`, `rozklad-neuplny`, `rozklad-bez-opakovani`.

#### M8-T01-L3 · Největší společný dělitel a nejmenší společný násobek
- **tema:** Dělitel a násobek v úlohách · **kapitola:** `pocetni-operace`
- **Cíl pro rodiče:** Dítě pozná, jestli úloha chce největší společný dělitel, nebo nejmenší společný násobek, a spočítá ho.
- **Platí:**
  1. $D(12, 18) = 6$ — největší, co dělí obě
  2. $n(12, 18) = 36$ — nejmenší násobek obou
  3. „znovu současně“ — hledá se násobek
- **U1 rozcvička** (`dlazdice` ×3): A $D(16, 24)$, B $n(6, 8)$, C situace „autobusy po 10 a 15 minutách“: hledá se $D$, nebo $n$? Distraktory: `nsd-nsn-zamena`, `nsn-soucin-cisel` (NOVÝ), `rozklad-bez-opakovani`.
- **U2 detektiv:** Petr počítá $n(a, b)$ přes rozklady na prvočísla. Chyba `rozklad-bez-opakovani` (v násobku vynechá opakovanou dvojku). `final` `cislo`.
- **U3 hlavní:** balíčky („48 čokolád a 72 lízátek, co nejvíc stejných balíčků, nic nezbude“). `k1` `dlazdice` „Co potřebuješ zjistit nejdřív?“ (`nsd-nsn-zamena`), `k2` `cislo` počet balíčků, `final` `cislo` lízátek v jednom balíčku.
- **U4 semafor:** situace na $n$ (tramvaje, majáky, tréninky). `final` `cislo` v minutách nebo dnech.
- **Čísla:** dvojice čísel do 100, $n$ do 360, rozklad nejvýš na 4 prvočísla.
- **Chyby:** `nsd-nsn-zamena`, `nsn-soucin-cisel` (NOVÝ), `rozklad-bez-opakovani`, `vynechal-delitel`, `delitel-nasobek-zamena`.

#### M8-T01-L4 · Kontrola: čísla a dělitelnost
- **tema:** Kontrola: čísla a dělitelnost · **kapitola:** `pocetni-operace`
- **Cíl pro rodiče:** Dítě samo vyřeší úlohy na pořadí operací, dělitelnost a společný násobek nebo dělitel.
- **Platí:**
  1. $36 - 12 : 3 \cdot 2$ — krát a děleno zleva
  2. $2\,754$: $2 + 7 + 5 + 4 = 18$ — devítka: součet číslic
  3. $D(a, b)$ a $n(a, b)$ — dělit, nebo opakovat?
- **U1 rozcvička** (`dlazdice` ×3): A co se počítá první (L1), B dělitelnost (L2), C $D$, nebo $n$? (L3).
- **U2 detektiv:** delší výraz se závorkou a dělením. Chyba `ignoroval-zavorku`. `final` `cislo`.
- **U3 hlavní:** slovní úloha, ve které se nejdřív najde $n$ (nebo $D$) a pak se s ním počítá výrazem (např. „za kolik minut se potkají a kolik koleček do té doby uběhne Adam“). `k1` `dlazdice`, `k2` `cislo`, `final` `cislo`.
- **U4 semafor:** úloha na $D$ s rozkladem (dlaždice na podlahu, nejdelší stejné kusy latí). `final` `cislo`.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3.

### T02 Desetinná čísla (`desetinna-cisla`)

#### M8-T02-L1 · Řády, porovnání, zaokrouhlení
- **tema:** Porovnání a zaokrouhlení · **kapitola:** `desetinna-cisla`
- **Cíl pro rodiče:** Dítě porovná a seřadí desetinná čísla po řádech a zaokrouhlí je na desetiny, setiny i celé.
- **Platí:**
  1. $0{,}5 = 0{,}50$ — nula na konci nevadí
  2. $0{,}5 > 0{,}45$ — porovnává se po řádech
  3. $3{,}46 \doteq 3{,}5$ — rozhoduje další číslice
- **U1 rozcvička** (`dlazdice` ×3): A větší z dvojice $0{,}5$ a $0{,}45$, B zaokrouhli na desetiny, C „tři setiny“ zapsané číslem. Distraktory: `porovnani-desetinnych-podle-delky`, `zaokrouhlil-useknutim`, `zaokrouhlil-na-spatny-rad`, `rad-cislice-zamena` (NOVÝ).
- **U2 detektiv:** Petr zaokrouhluje jedno číslo na celé, na desetiny a na setiny, řádek = jeden řád. Chyba `zaokrouhlil-useknutim` na setinách. `final` `cislo` = správně zaokrouhlené na setiny.
- **U3 hlavní:** tabulka výkonů ve skoku dalekém (4 čísla s různým počtem desetinných míst). `k1` `dlazdice` „Kdo vyhrál?“, `k2` `cislo` výkon třetího v pořadí, `final` `cislo` výkon vítěze zaokrouhlený na desetiny.
- **U4 semafor:** „Ze seznamu napiš největší číslo, které je menší než …“ (5 čísel). `final` `cislo`.
- **Čísla:** do 100, 1–3 desetinná místa.
- **Chyby:** `porovnani-desetinnych-podle-delky`, `zaokrouhlil-useknutim`, `zaokrouhlil-na-spatny-rad`, `rad-cislice-zamena` (NOVÝ).

#### M8-T02-L2 · Sčítání, odčítání, krát a děleno 10, 100, 1 000
- **tema:** Desetinná čísla: plus, mínus · **kapitola:** `desetinna-cisla`
- **Cíl pro rodiče:** Dítě sčítá a odčítá desetinná čísla pod sebou podle čárky a násobí a dělí 10, 100 a 1 000 posunem čárky.
- **Platí:**
  1. $3{,}5 + 1{,}25 = 4{,}75$ — čárka pod čárkou
  2. $4{,}2 \cdot 100 = 420$ — krát sto: doprava
  3. $4{,}2 : 100 = 0{,}042$ — děleno sto: doleva
- **U1 rozcvička** (`dlazdice` ×3): A součet s různým počtem desetinných míst, B $\cdot 1\,000$, C $: 100$. Distraktory: `carka-scitani-pod-sebe`, `posun-carky-spatnym-smerem`, `posun-carky-o-spatny-pocet`, `pripsal-nuly-k-desetinnemu`.
- **U2 detektiv:** účtenka: Petr sčítá tři ceny a odečítá je od zaplacené částky. Chyba `carka-scitani-pod-sebe`. `final` `cislo` (vráceno).
- **U3 hlavní:** balení po 100 a 1 000 kusech („1 000 sponek váží 450 g, kolik váží 1 sponka a kolik 30 sponek“). `k1` `dlazdice`, `k2` `cislo`, `final` `cislo`.
- **U4 semafor:** odčítání s doplněním nul ($12 - 3{,}48$ ve slovní situaci). `final` `cislo`.
- **Čísla:** do 1 000, nejvýš 3 desetinná místa, odčítání přes desítku.
- **Chyby:** `carka-scitani-pod-sebe`, `posun-carky-spatnym-smerem`, `posun-carky-o-spatny-pocet`, `pripsal-nuly-k-desetinnemu`.

#### M8-T02-L3 · Násobení a dělení desetinných čísel
- **tema:** Desetinná čísla: krát, děleno · **kapitola:** `desetinna-cisla`
- **Cíl pro rodiče:** Dítě při násobení a dělení desetinných čísel správně umístí čárku.
- **Platí:**
  1. $0{,}3 \cdot 0{,}2 = 0{,}06$ — desetinná místa se sčítají
  2. $1{,}2 : 0{,}4 = 12 : 4$ — posun čárky u obou
  3. $7 : 4 = 1{,}75$ — dělí se za čárkou
- **U1 rozcvička** (`dlazdice` ×3): A součin dvou desetinných čísel, B podíl desetinným číslem, C podíl menšího čísla větším. Distraktory: `carka-pri-nasobeni`, `carka-pri-deleni`, `deleni-obracene`.
- **U2 detektiv:** výraz $a \cdot b + c : d$ s desetinnými čísly. Chyba `carka-pri-deleni`. `final` `cislo`.
- **U3 hlavní:** nákup na váhu („1,5 kg sýra stojí …, kolik stojí 0,4 kg“). `k1` `dlazdice` „Co potřebuješ zjistit nejdřív?“, `k2` `cislo` cena 1 kg (zadání ji jmenuje otázkou), `final` `cislo`.
- **U4 semafor:** stuha $4{,}5$ m na kousky po $0{,}25$ m: kolik kousků. `final` `cislo`.
- **Čísla:** činitelé a dělitelé nejvýš se 2 desetinnými místy, výsledek nejvýš se 3 místy, „hezký“.
- **Chyby:** `carka-pri-nasobeni`, `carka-pri-deleni`, `deleni-obracene`, `scital-pred-nasobenim`.

#### M8-T02-L4 · Kontrola: desetinná čísla
- **tema:** Kontrola: desetinná čísla · **kapitola:** `desetinna-cisla`
- **Cíl pro rodiče:** Dítě samo porovná, zaokrouhlí a spočítá příklad s desetinnými čísly i s penězi.
- **Platí:**
  1. $2{,}07 < 2{,}7$ — porovnává se po řádech
  2. $0{,}4 \cdot 0{,}5 = 0{,}20$ — desetinná místa se sčítají
  3. $36{,}48 \doteq 36$ Kč — na koruny: celé
- **U1 rozcvička** (`dlazdice` ×3): A porovnání (L1), B posun čárky (L2), C součin (L3).
- **U2 detektiv:** výraz se součinem dvou desetinných čísel. Chyba `carka-pri-nasobeni`. `final` `cislo`.
- **U3 hlavní:** nákup několika věcí na váhu a na kusy, cena celkem zaokrouhlená na koruny, kolik vrátí. `k1` `cislo`, `k2` `cislo`, `final` `cislo`.
- **U4 semafor:** výraz se třemi operacemi s desetinnými čísly (krát, děleno, plus). `final` `cislo`.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3.

### T03 Jednotky, obvod a obsah (`jednotky`, L3 `geometrie`)

#### M8-T03-L1 · Převody délky a hmotnosti
- **tema:** Převody délky a hmotnosti · **kapitola:** `jednotky`
- **Cíl pro rodiče:** Dítě převede délku a hmotnost na jinou jednotku a ví, kterým směrem a o kolik míst posunout čárku.
- **Platí:**
  1. $1\ \text{km} = 1\,000\ \text{m}$ — kilo znamená tisíc
  2. $1\ \text{t} = 1\,000\ \text{kg}$ — tuna je tisíc kilogramů
  3. $350\ \text{g} = 0{,}35\ \text{kg}$ — na větší jednotku: dělení
- **U1 rozcvička** (`dlazdice` ×3): A km → m, B g → kg, C cm → m. Distraktory: `prevod-spatnym-smerem`, `posun-carky-o-spatny-pocet`, `delka-po-stovkach`.
- **U2 detektiv:** délka trasy sečtená z úseků v km, m a cm. Chyba `posun-carky-o-spatny-pocet` (cm → m dělí deseti). `final` `cislo` v metrech.
- **U3 hlavní:** výtah unese $0{,}6$ t, jedou v něm lidé o dané hmotnosti a bedny po … kg: kolik beden nejvýš naloží. `k1` `dlazdice` převod nosnosti, `k2` `cislo` volná nosnost v kg, `final` `cislo` počet beden.
- **U4 semafor:** kolik balíčků po 250 g se naplní z $4{,}5$ kg. `final` `cislo`.
- **Čísla:** mm, cm, dm, m, km; g, kg, t; nejvýš 3 desetinná místa; převod přes nejvýš dvě jednotky.
- **Chyby:** `prevod-spatnym-smerem`, `posun-carky-o-spatny-pocet`, `delka-po-stovkach`, `zapomnel-prevest-jednotky`, `jednotka-ve-vysledku-spatne`.

#### M8-T03-L2 · Převody obsahu, ar a hektar
- **tema:** Převody obsahu · **kapitola:** `jednotky`
- **Cíl pro rodiče:** Dítě převádí jednotky obsahu po stovkách a ví, kolik je ar a hektar.
- **Platí:**
  1. $1\ \text{dm}^2 = 100\ \text{cm}^2$ — obsah: po stu
  2. $1\ \text{a} = 100\ \text{m}^2$ — ar: sto metrů čtverečních
  3. $1\ \text{ha} = 100\ \text{a}$ — hektar je sto arů
- **U1 rozcvička** (`dlazdice` ×3): A dm² → cm², B m² → dm², C ha → m². Distraktory: `obsah-po-desitkach`, `posun-carky-o-spatny-pocet`, `prevod-spatnym-smerem`.
- **U2 detektiv:** Petr převádí výměru pole z ha přes ary na m². Chyba `posun-carky-o-spatny-pocet` (1 ha = 1 000 m²). `final` `cislo`.
- **U3 hlavní:** pozemek $2{,}4$ ha se dělí na zahrádky po 4 a. `k1` `dlazdice` převod, `k2` `cislo` výměra v arech, `final` `cislo` počet zahrádek.
- **U4 semafor:** podlaha v m², dlaždice v dm²: kolik dlaždic. `final` `cislo`.
- **Čísla:** převod nejvýš o dvě sousední jednotky (m² → cm²), ha ↔ a ↔ m²; výsledky celé.
- **Chyby:** `obsah-po-desitkach`, `posun-carky-o-spatny-pocet`, `prevod-spatnym-smerem`, `jednotka-ve-vysledku-spatne`.

#### M8-T03-L3 · Obvod a obsah obdélníku a složených útvarů
- **tema:** Obvod a obsah obdélníku · **kapitola:** `geometrie` · **pomůcky:** + pravítko
- **Cíl pro rodiče:** Dítě rozliší obvod a obsah a spočítá je i u útvaru složeného z obdélníků.
- **Platí:**
  1. $o = 2 \cdot (a + b)$ — obvod: délka okraje
  2. $S = a \cdot b$ — obsah: počet čtverečků
  3. $S = S_1 + S_2$ — složený útvar: po částech
- **U1 rozcvička** (`dlazdice` ×3): A obvod obdélníku, B obsah čtverce, C strana obdélníku z obvodu a druhé strany. Distraktory: `obvod-obsah-zamena`, `obvod-jen-dve-strany`, `strana-z-obvodu-bez-poloviny`.
- **U2 detektiv:** obvod útvaru tvaru L (obrázek, popsané jen některé strany). Chyba `obvod-slozeneho-chybi-strany` (NOVÝ). `final` `cislo`.
- **U3 hlavní:** zahrada daná obvodem a jednou stranou. `k1` `cislo` druhá strana, `k2` `cislo` obsah, `final` `cislo` počet balení travního semene (1 balení na … m²).
- **U4 semafor:** obsah obdélníkové zdi bez okna (obrázek s výřezem). `final` `cislo`.
- **Čísla:** strany celé nebo s jedním desetinným místem, do 100 m; SVG podle SABLONA §17 a §21.
- **Chyby:** `obvod-obsah-zamena`, `obvod-jen-dve-strany`, `strana-z-obvodu-bez-poloviny`, `slozeny-utvar-cast-navic`, `obvod-slozeneho-chybi-strany` (NOVÝ).

#### M8-T03-L4 · Kontrola: jednotky a obsah
- **tema:** Kontrola: jednotky a obsah · **kapitola:** `jednotky`
- **Cíl pro rodiče:** Dítě samo spočítá obsah nebo obvod se stranami v různých jednotkách a výsledek uvede v jednotce ze zadání.
- **Platí:**
  1. $2\ \text{m} = 200\ \text{cm}$ — nejdřív stejné jednotky
  2. $1\ \text{m}^2 = 100\ \text{dm}^2$ — obsah: po stu
  3. $S = 3\ \text{m} \cdot 4\ \text{m}$ — výsledek v $\text{m}^2$
- **U1 rozcvička** (`dlazdice` ×3): A převod délky (L1), B převod obsahu (L2), C obvod, nebo obsah? (L3).
- **U2 detektiv:** cena koberce: pokoj v m, koberec za 1 m², Petr násobí metry s centimetry. Chyba `zapomnel-prevest-jednotky`. `final` `cislo` (Kč).
- **U3 hlavní:** obklad stěny dlaždicemi v cm: obsah stěny v m², obsah dlaždice, počet dlaždic. `k1` `cislo`, `k2` `cislo`, `final` `cislo`.
- **U4 semafor:** obsah obdélníku se stranami v m a dm, výsledek v dm². `final` `cislo`.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3.

### T04 Zlomky I (`zlomky`)

#### M8-T04-L1 · Krácení a rozšiřování
- **tema:** Krácení a rozšiřování · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě zkrátí zlomek na základní tvar a rozšíří ho na zadaný jmenovatel.
- **Platí:**
  1. $\frac{12}{18} = \frac{2}{3}$ — obojí děleno šesti
  2. $\frac{2}{3} = \frac{8}{12}$ — obojí krát čtyři
  3. $\frac{2}{3}$ — základní tvar: dál nejde
- **U1 rozcvička** (`dlazdice` ×3): A zkrať, B rozšiř na daný jmenovatel, C „Který zlomek se nerovná ostatním?“. Distraktory: `upravil-jen-cast-zlomku`, `pricetl-misto-nasobeni`, `kratil-ruznym-cislem`.
- **U2 detektiv:** Petr krátí postupně ve třech řádcích, v jednom vydělí čitatel a jmenovatel různými čísly. Chyba `kratil-ruznym-cislem`. `final` `zlomek`, `kontrola_tvaru: "zakladni_tvar"`.
- **U3 hlavní:** „Ve třídě je 28 žáků, 12 má psa.“ `k1` `zlomek` jaká část třídy má psa (základní tvar), `k2` `zlomek` jaká část psa nemá, `final` `cislo`: kolik žáků by psa mělo ve stejné části třídy s 35 žáky.
- **U4 semafor:** doplň chybějící čitatel $\frac{15}{40} = \frac{?}{56}$. `final` `cislo`. Známé chyby: `pricetl-misto-nasobeni`, `upravil-jen-cast-zlomku`.
- **Čísla:** jmenovatele do 60, krácení nejvýš číslem 12.
- **Chyby:** `upravil-jen-cast-zlomku`, `pricetl-misto-nasobeni`, `kratil-ruznym-cislem`, `kratil-jen-castecne`.

#### M8-T04-L2 · Porovnávání zlomků, zlomek a desetinné číslo
- **tema:** Porovnání zlomků · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě porovná dva zlomky převodem na stejný jmenovatel nebo na desetinné číslo.
- **Platí:**
  1. $\frac{1}{5} < \frac{1}{3}$ — víc dílů, menší díl
  2. $\frac{3}{4} > \frac{2}{3}$ — porovnání na dvanáctinách
  3. $\frac{3}{4} = 0{,}75$ — zlomková čára je dělení
- **U1 rozcvička** (`dlazdice` ×3): A větší z $\frac{1}{5}$ a $\frac{1}{3}$, B $\frac{3}{4}$ a $\frac{4}{5}$, C $\frac{2}{5}$ jako desetinné číslo. Distraktory: `porovnal-podle-jmenovatele`, `porovnal-podle-rozdilu` (NOVÝ), `zlomek-jako-cislice-s-carkou`.
- **U2 detektiv:** Petr řadí tři zlomky přes stejný jmenovatel, u jednoho rozšíří jen jmenovatel. Chyba `upravil-jen-cast-zlomku`. `final` `zlomek` = největší ze tří.
- **U3 hlavní:** střelba na koš: Tomáš trefil 7 z 12, Klára 5 z 8. `k1` `dlazdice` zápis Tomášovy úspěšnosti, `k2` `dlazdice` kdo byl úspěšnější (možnost „stejně“), `final` `cislo`: kolik z 24 hodů by trefil(a) úspěšnější hráč(ka).
- **U4 semafor:** největší z čísel $0{,}7$; $\frac{3}{4}$; $\frac{5}{8}$; $0{,}72$. `final` `zlomek`. Známé chyby: $\frac{5}{8}$ `porovnal-podle-jmenovatele`, $0{,}72$ `porovnani-desetinnych-podle-delky`.
- **Čísla:** jmenovatele do 12, stejný jmenovatel do 60, desetinná do 2 míst.
- **Chyby:** `porovnal-podle-jmenovatele`, `porovnal-podle-rozdilu` (NOVÝ), `zlomek-jako-cislice-s-carkou`, `desetinne-jako-zlomek-spatne`, `upravil-jen-cast-zlomku`.

#### M8-T04-L3 · Sčítání a odčítání zlomků
- **tema:** Sčítání a odčítání zlomků · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě sečte a odečte zlomky s různými jmenovateli i zlomek od celého čísla a výsledek zkrátí.
- **Platí:**
  1. $\frac{1}{4} + \frac{1}{6}$ — nejdřív na dvanáctiny
  2. $\frac{3}{12} + \frac{2}{12}$ — sčítají se jen čitatelé
  3. $1 - \frac{3}{8} = \frac{5}{8}$ — celek: osm osmin
- **U1 rozcvička** (`dlazdice` ×3): A $\frac{1}{3} + \frac{1}{6}$, B $\frac{3}{4} - \frac{1}{3}$, C $2 - \frac{1}{3}$. Distraktory: `scital-citatele-i-jmenovatele`, `neprepocital-citatel`, `odcital-zlomek-od-celeho-spatne` (NOVÝ).
- **U2 detektiv:** $\frac{a}{b} + \frac{c}{d} - \frac{e}{f}$, Petr rozšíří jmenovatel, ale čitatel ne. Chyba `neprepocital-citatel`. `final` `zlomek`, základní tvar.
- **U3 hlavní:** Ema přečetla v pondělí $\frac{1}{4}$ knihy a v úterý $\frac{2}{5}$ knihy (obojí z celé knihy). `k1` `dlazdice` „Co potřebuješ zjistit nejdřív?“, `k2` `zlomek` přečteno celkem, `final` `zlomek` zbývá.
- **U4 semafor:** tři zlomky se sčítáním i odčítáním, `final` `zlomek`, základní tvar.
- **Čísla:** jmenovatele do 12, stejný jmenovatel do 36, nejvýš 3 zlomky, výsledek v základním tvaru.
- **Chyby:** `scital-citatele-i-jmenovatele`, `neprepocital-citatel`, `odcital-zlomek-od-celeho-spatne` (NOVÝ), `kratil-jen-castecne`.

#### M8-T04-L4 · Kontrola: zlomky I
- **tema:** Kontrola: zlomky I · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě samo zkrátí, porovná, sečte a odečte zlomky ve slovní úloze.
- **Platí:**
  1. $\frac{9}{12} = \frac{3}{4}$ — krátí se úplně
  2. $\frac{5}{6} > \frac{3}{4}$ — porovnání na dvanáctinách
  3. $1 - \frac{5}{12} = \frac{7}{12}$ — zbytek do celku
- **U1 rozcvička** (`dlazdice` ×3): A krácení (L1), B porovnání (L2), C sčítání (L3).
- **U2 detektiv:** součet dvou zlomků, Petr výsledek krátí jen částečně a prohlásí ho za hotový. Chyba `kratil-jen-castecne`. `final` `zlomek`, základní tvar. (Krok `final` bez `kontrola_tvaru`, aby šlo nezkrácený výsledek zachytit v `zname_chyby`; hláška řekne „ještě zkrať“, viz Otázky, bod 11.)
- **U3 hlavní:** zahrada: $\frac{1}{3}$ záhony, $\frac{1}{4}$ trávník, zbytek sad. Které části je nejvíc a jak velká je. `k1` `zlomek`, `k2` `dlazdice`, `final` `zlomek`.
- **U4 semafor:** rozdíl dvou zlomků s jmenovateli do 12, `final` `zlomek`, základní tvar.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3.

### T05 Zlomky II (`zlomky`)

#### M8-T05-L1 · Násobení zlomků, zlomek z čísla
- **tema:** Násobení, zlomek z čísla · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě vynásobí zlomky (a předem zkrátí) a spočítá zlomek z čísla i ze zbytku.
- **Platí:**
  1. $\frac{2}{3} \cdot \frac{9}{10}$ — před násobením krátit
  2. $3 \cdot \frac{2}{5} = \frac{6}{5}$ — číslo násobí jen čitatel
  3. $\frac{3}{4}$ z $40$ je $30$ — děleno dole, krát nahoře
- **U1 rozcvička** (`dlazdice` ×3): A $\frac{2}{3} \cdot \frac{3}{4}$, B $4 \cdot \frac{2}{9}$, C $\frac{3}{5}$ z 35. Distraktory: `cele-cislo-do-citatele-i-jmenovatele`, `spolecny-jmenovatel-pri-nasobeni`, `zlomek-z-cisla-jen-deleni`, `zlomek-z-cisla-obracene`.
- **U2 detektiv:** „Šestinu utratil, pak dvě pětiny zbytku…“: Petr bere dvě pětiny z celku. Chyba `z-celku-misto-ze-zbytku`. `final` `cislo`.
- **U3 hlavní:** cesta na chatu ($\frac{3}{8}$ vlakem, $\frac{2}{5}$ zbytku na kole, zbytek pěšky), celá cesta je známá. `k1` `cislo` vlakem, `k2` `cislo` na kole, `final` `cislo` pěšky.
- **U4 semafor:** zlomek ze zbytku v jiné situaci (kapesné, kniha). `final` `cislo`.
- **Čísla:** celky do 1 000 dělitelné jmenovateli, jmenovatele do 12.
- **Chyby:** `cele-cislo-do-citatele-i-jmenovatele`, `spolecny-jmenovatel-pri-nasobeni`, `zlomek-z-cisla-jen-deleni`, `zlomek-z-cisla-obracene`, `z-celku-misto-ze-zbytku`, `zamenil-cast-a-zbytek`.

#### M8-T05-L2 · Dělení zlomků a složený zlomek
- **tema:** Dělení zlomků · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě dělí zlomkem jako násobení převráceným zlomkem a spočítá složený zlomek.
- **Platí:**
  1. $\frac{3}{4}$ a $\frac{4}{3}$ — převrácená čísla
  2. $: \frac{2}{5} = \cdot \frac{5}{2}$ — děleno: krát převrácený
  3. $\dfrac{\frac{1}{2}}{\frac{3}{4}}$ — dlouhá čára: děleno
- **U1 rozcvička** (`dlazdice` ×3): A převrácené číslo k $\frac{2}{7}$, B $\frac{3}{5} : 3$, C $\frac{1}{2} : \frac{1}{4}$. Distraktory: `opacne-prevracene-zamena` (NOVÝ), `prevratil-prvni`, `delil-bez-prevraceni`, `deleni-obracene`.
- **U2 detektiv:** složený zlomek, Petr převrátí horní zlomek. Chyba `slozeny-zlomek-prevratil-horni`. `final` `zlomek`.
- **U3 hlavní:** láhev $\frac{3}{4}$ l, sklenička $\frac{3}{16}$ l. `k1` `dlazdice` „Který zápis odpovídá zadání?“, `k2` `cislo` počet skleniček, `final` `zlomek` kolik litrů zbude po nalití 3 skleniček.
- **U4 semafor:** složený zlomek se součtem v čitateli, `final` `zlomek`, základní tvar.
- **Čísla:** jmenovatele do 16, výsledky v základním tvaru.
- **Chyby:** `opacne-prevracene-zamena` (NOVÝ), `prevratil-prvni`, `prevratil-oba`, `delil-bez-prevraceni`, `slozeny-zlomek-prevratil-horni`, `deleni-obracene`.

#### M8-T05-L3 · Smíšená čísla
- **tema:** Smíšená čísla · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě převede smíšené číslo na zlomek a zpět a počítá s ním bez chyby v celé části.
- **Platí:**
  1. $2\frac{1}{3} = \frac{7}{3}$ — dvě celé: šest třetin
  2. $\frac{17}{5} = 3\frac{2}{5}$ — zbytek zůstane nahoře
  3. $1\frac{1}{2} \cdot 1\frac{1}{3}$ — nejdřív převod na zlomky
- **U1 rozcvička** (`dlazdice` ×3): A $3\frac{1}{4}$ jako zlomek, B $\frac{23}{6}$ jako smíšené číslo, C $2 - \frac{3}{4}$. Distraktory: `smisene-scital-celou-cast`, `smisene-zpet-spatne`, `smisene-jako-soucin`, `odcital-zlomek-od-celeho-spatne` (NOVÝ).
- **U2 detektiv:** $4\frac{1}{3} - 1\frac{3}{4}$, Petr odčítá celé a zlomky zvlášť. Chyba `smisene-odcitani-po-castech`. `final` `smisene`.
- **U3 hlavní:** recept: $1\frac{3}{4}$ hrnku mouky na dávku, Adam peče $2\frac{1}{2}$ dávky. `k1` `dlazdice` převod, `k2` `zlomek`, `final` `smisene`. Známá chyba `smisene-nasobil-po-castech`.
- **U4 semafor:** součin dvou smíšených čísel, `final` `smisene`.
- **Čísla:** celé části do 5, jmenovatele do 12.
- **Chyby:** `smisene-scital-celou-cast`, `smisene-zmenil-jmenovatel`, `smisene-zpet-spatne`, `smisene-jako-soucin`, `smisene-odcitani-po-castech`, `smisene-nasobil-po-castech`, `odcital-zlomek-od-celeho-spatne` (NOVÝ).

#### M8-T05-L4 · Kontrola: zlomky II
- **tema:** Kontrola: zlomky II · **kapitola:** `zlomky`
- **Cíl pro rodiče:** Dítě samo násobí a dělí zlomky a smíšená čísla a spočítá část ze zbytku.
- **Platí:**
  1. $\frac{4}{9} \cdot \frac{3}{8}$ — před násobením krátit
  2. $: \frac{3}{4} = \cdot \frac{4}{3}$ — děleno: krát převrácený
  3. $2\frac{1}{2} = \frac{5}{2}$ — smíšené číslo převést
- **U1 rozcvička** (`dlazdice` ×3): A násobení (L1), B dělení (L2), C převod smíšeného čísla (L3).
- **U2 detektiv:** dělení smíšeným číslem, Petr převrátí dělence. Chyba `prevratil-prvni`. `final` `zlomek` nebo `smisene`.
- **U3 hlavní:** zbytek po utracení části peněz se dělí na porce po zlomku (zlomek ze zbytku + dělení zlomkem). `k1` `cislo`, `k2` `cislo`, `final` `cislo`.
- **U4 semafor:** výraz se smíšeným číslem a dělením zlomkem, `final` `zlomek`, základní tvar.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3.

### T06 Celá a racionální čísla (`cela-cisla`)

#### M8-T06-L1 · Číselná osa, opačné číslo, absolutní hodnota
- **tema:** Záporná čísla na ose · **kapitola:** `cela-cisla`
- **Cíl pro rodiče:** Dítě umístí záporné celé i desetinné číslo na osu, porovná dvě čísla a určí opačné číslo a absolutní hodnotu.
- **Platí:**
  1. $-7 < -3$ — vlevo je menší
  2. $-4$ a $4$ — opačná: stejně od nuly
  3. $\lvert -4 \rvert = 4$ — vzdálenost od nuly
- **U1 rozcvička** (`dlazdice` ×3): A větší z $-7$ a $-3$, B $\lvert -6 \rvert$, C opačné číslo k $-2{,}5$. Distraktory: `porovnani-zapornych`, `absolutni-hodnota-zaporna`, `opacne-prevracene-zamena` (NOVÝ).
- **U2 detektiv:** výraz s absolutními hodnotami ($\lvert -a \rvert + \lvert b - c \rvert$, $b < c$), Petr nechá absolutní hodnotu zápornou. Chyba `absolutni-hodnota-zaporna`. `final` `cislo`.
- **U3 hlavní:** číselná osa na obrázku (dílek po 0,5 nebo po 2), body A a B. `k1` `cislo` číslo bodu A, `k2` `cislo` číslo bodu B, `final` `cislo` vzdálenost A a B. Známé chyby: `stupnice-grafu-spatne`, `posun-spatnym-smerem`.
- **U4 semafor:** číslo přesně uprostřed mezi záporným a kladným číslem (osa bez obrázku). `final` `cislo`.
- **Čísla:** −100 až 100, desetinná s 1 místem.
- **Chyby:** `porovnani-zapornych`, `absolutni-hodnota-zaporna`, `opacne-prevracene-zamena` (NOVÝ), `posun-spatnym-smerem`, `stupnice-grafu-spatne`.

#### M8-T06-L2 · Sčítání a odčítání záporných čísel
- **tema:** Plus a mínus se zápornými · **kapitola:** `cela-cisla`
- **Cíl pro rodiče:** Dítě sčítá a odčítá i záporná čísla a ví, že odečíst záporné číslo znamená přičíst.
- **Platí:**
  1. $-7 + 3 = -4$ — posun doprava o tři
  2. $5 - (-3) = 5 + 3$ — odečíst záporné: přičíst
  3. $3 - 8 = -5$ — přes nulu do minusu
- **U1 rozcvička** (`dlazdice` ×3): A $-7 + 3$, B $5 - (-3)$, C $-4 - 6$. Distraktory: `ruzna-znamenka-secetl` (NOVÝ), `odcitani-zaporneho`, `pravidlo-znamenek-pri-scitani`, `posun-spatnym-smerem`.
- **U2 detektiv:** součet čtyř celých čísel s odečtením záporného. Chyba `odcitani-zaporneho`. `final` `cislo`.
- **U3 hlavní:** zůstatek na účtu (začíná v mínusu, příjem, platba). `k1` `dlazdice` „Který zápis odpovídá zadání?“, `k2` `cislo` stav po příjmu, `final` `cislo`.
- **U4 semafor:** rozdíl nejvyšší a nejnižší teploty z tabulky (desetinná čísla, jedna záporná). `final` `cislo`.
- **Čísla:** −1 000 až 1 000, desetinná s 1 místem.
- **Chyby:** `ruzna-znamenka-secetl` (NOVÝ), `odcitani-zaporneho`, `pravidlo-znamenek-pri-scitani`, `posun-spatnym-smerem`, `mensi-minus-vetsi`.

#### M8-T06-L3 · Násobení a dělení, záporné zlomky
- **tema:** Krát a děleno se zápornými · **kapitola:** `cela-cisla`
- **Cíl pro rodiče:** Dítě určí znaménko součinu a podílu i u více činitelů a u záporných zlomků.
- **Platí:**
  1. $(-3) \cdot (-4) = 12$ — minus krát minus: plus
  2. $(-2) \cdot 5 = -10$ — různá znaménka: minus
  3. $(-1) \cdot (-1) \cdot (-1)$ — lichý počet minusů: minus
- **U1 rozcvička:** A `poradi` (výraz se zápornými čísly, 4 operace), B `dlazdice` znaménko součinu tří činitelů, C `dlazdice` $\left(-\frac{2}{3}\right) \cdot \frac{3}{4}$. Distraktory a známá pořadí: `scital-pred-nasobenim`, `znamenko-soucinu-vice-cinitelu`, `znamenko-zlomku`, `minus-krat-minus`.
- **U2 detektiv:** výraz s krát, děleno a mínus se zápornými čísly. Chyba `minus-krat-minus`. `final` `cislo`.
- **U3 hlavní:** výraz se zápornými zlomky (součin a odečtení záporného zlomku). `k1` `dlazdice` znaménko součinu, `k2` `zlomek` mezivýsledek: součin (slovo ze zadání „vynásob a pak …“ autor ohlídá), `final` `zlomek` nebo `cislo`.
- **U4 semafor:** výraz s celými čísly, 3–4 operace (krát, děleno, mínus), `final` `cislo`.
- **Čísla:** −100 až 100, zlomky s jmenovateli do 12.
- **Chyby:** `minus-krat-minus`, `plus-krat-minus`, `znamenko-soucinu-vice-cinitelu`, `znamenko-zlomku`, `ztratil-znamenko-v-mezikroku`, `scital-pred-nasobenim`, `odcitani-zaporneho`.

#### M8-T06-L4 · Kontrola: záporná čísla
- **tema:** Kontrola: záporná čísla · **kapitola:** `cela-cisla`
- **Cíl pro rodiče:** Dítě samo počítá se zápornými celými i desetinnými čísly ve výrazu i ve slovní úloze.
- **Platí:**
  1. $-2 > -5$ — blíž nule je větší
  2. $4 - (-6) = 10$ — odečíst záporné: přičíst
  3. $(-6) : (-2) = 3$ — dvě minus: plus
- **U1 rozcvička** (`dlazdice` ×3): A porovnání (L1), B sčítání (L2), C znaménko součinu (L3).
- **U2 detektiv:** výraz s odečtením záporného čísla a násobením. Chyba `odcitani-zaporneho` (nebo `minus-krat-minus`, autor zvolí jednu). `final` `cislo`.
- **U3 hlavní:** průměrná ranní teplota za 4 dny (dvě záporné, jedna desetinná). `k1` `dlazdice` „Co potřebuješ zjistit nejdřív?“, `k2` `cislo` součet teplot (zadání průměr i součet jmenuje), `final` `cislo`. Známé chyby: `prumer-bez-deleni-poctem`, `ruzna-znamenka-secetl`.
- **U4 semafor:** výraz se zápornými desetinnými čísly (krát a mínus), `final` `cislo`.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3 a `prumer-bez-deleni-poctem`.

### T07 Úhly, trojúhelníky, souměrnost, rovnoběžníky (`geometrie`)

Všechny lekce: `pomucky` + „pravítko“; obrázky SVG podle SABLONA §17 a §21; žádné měření úhloměrem na obrazovce, úhly a délky jsou zadané čísly.

#### M8-T07-L1 · Úhly
- **tema:** Úhly v trojúhelníku · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě dopočítá vedlejší a vrcholový úhel a úhly v trojúhelníku a rovnoběžníku, i ve stupních a minutách.
- **Platí:**
  1. $\alpha + \beta = 180°$ — vedlejší úhly: přímka
  2. $\alpha + \beta + \gamma = 180°$ — součet v trojúhelníku
  3. $1° = 60'$ — stupeň má šedesát minut
- **U1 rozcvička** (`dlazdice` ×3, obrázek dvou přímek a trojúhelníku): A vedlejší úhel k $65°$, B vrcholový úhel, C třetí úhel trojúhelníku. Distraktory: `vedlejsi-vrcholovy-zamena`, `doplnil-uhel-do-90`, `soucet-uhlu-trojuhelniku-spatne`.
- **U2 detektiv:** obrázek: úhel u přímky a trojúhelník. Petr počítá úhel v trojúhelníku přes vedlejší úhel a vezme vrcholový místo vedlejšího. Chyba `vedlejsi-vrcholovy-zamena`. `final` `cislo` (jednotka °).
- **U3 hlavní:** trojúhelník s úhly ve stupních a minutách: dopočítej třetí. `k1` `dlazdice` „Co potřebuješ zjistit nejdřív?“ (distraktor `stupne-minuty-po-stovkach` (NOVÝ)), `k2` `cislo` „Výsledek: stupně“ (jednotka °), `final` `cislo` „Výsledek: minuty“ (jednotka ′).
- **U4 semafor:** rovnoběžník: dán jeden úhel, dopočítej sousední. `final` `cislo`. Známé chyby: `rovnobeznik-uhly-zamena` (NOVÝ), `doplnil-uhel-do-90`.
- **Čísla:** celé stupně, minuty jen v U3 (násobky 5).
- **Chyby:** `vedlejsi-vrcholovy-zamena`, `doplnil-uhel-do-90`, `soucet-uhlu-trojuhelniku-spatne`, `rovnoramenny-uhly-zamena`, `stupne-minuty-po-stovkach` (NOVÝ), `rovnobeznik-uhly-zamena` (NOVÝ).

#### M8-T07-L2 · Trojúhelník a souměrnost
- **tema:** Trojúhelník a souměrnost · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě rozhodne, jestli z daných stran jde trojúhelník sestrojit, a rozliší osovou a středovou souměrnost.
- **Platí:**
  1. $3 + 4 > 6$ — součet dvou stran větší
  2. osa $o$ — osová: překlopení přes přímku
  3. střed $S$ — středová: otočení o půlkruh
- **U1 rozcvička** (`dlazdice` ×3; obrázky útvarů v zadání, dlaždice „útvar A“ …): A Ze kterých tří délek jde sestrojit trojúhelník? B Kolik os souměrnosti má obdélník? C Který útvar je středově souměrný? Distraktory: `trojuhelnikova-nerovnost-porusena`, `pocet-os-spatne` (NOVÝ), `osova-stredova-zamena` (NOVÝ).
- **U2 detektiv:** dvě strany trojúhelníku jsou dané, Petr hledá nejdelší možnou celočíselnou třetí stranu a připustí délku rovnou součtu. Chyba `trojuhelnikova-nerovnost-porusena`. `final` `cislo`.
- **U3 hlavní:** útvar vznikl překlopením lichoběžníku přes osu (obrázek, kóty jen na jedné polovině). `k1` `dlazdice` „Vyber, co platí“ (délky a úhly obrazu se nemění / zdvojnásobí / zmenší, `osova-stredova-zamena`), `k2` `cislo` délka jedné strany obrazu, `final` `cislo` obvod celého útvaru (`obvod-slozeneho-chybi-strany`: započítá osu).
- **U4 semafor:** dvě strany trojúhelníku: kolik různých celočíselných délek může mít třetí strana. `final` `cislo`.
- **Čísla:** délky celé v cm do 30.
- **Chyby:** `trojuhelnikova-nerovnost-porusena`, `pocet-os-spatne` (NOVÝ), `osova-stredova-zamena` (NOVÝ), `obvod-slozeneho-chybi-strany` (NOVÝ).

#### M8-T07-L3 · Obsah trojúhelníku, rovnoběžníku a lichoběžníku
- **tema:** Obsah trojúhelníku a lichoběžníku · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě vybere stranu a výšku, která k ní patří, a spočítá obsah trojúhelníku, rovnoběžníku a lichoběžníku.
- **Platí:**
  1. $S = a \cdot v_a$ — rovnoběžník: strana krát výška
  2. $S = \frac{a \cdot v_a}{2}$ — trojúhelník: polovina rovnoběžníku
  3. $S = \frac{(a + c) \cdot v}{2}$ — lichoběžník: polovina součtu základen
- **U1 rozcvička** (`dlazdice` ×3, obrázky): A obsah trojúhelníku, B rovnoběžník se šikmou stranou, C lichoběžník. Distraktory: `trojuhelnik-bez-deleni-dvema`, `vyska-jako-strana`, `lichobeznik-jedna-zakladna`.
- **U2 detektiv:** obsah lichoběžníku, Petr nevydělí součet základen dvěma. Chyba `lichobeznik-jedna-zakladna`. `final` `cislo`.
- **U3 hlavní:** štít chaty tvaru obdélníku se střechou-trojúhelníkem (obrázek): kolik plechovek barvy. `k1` `cislo` obsah obdélníkové části, `k2` `cislo` obsah trojúhelníkové části, `final` `cislo` počet plechovek (1 plechovka na … m²).
- **U4 semafor:** rovnoběžník se dvěma různými výškami a stranami (obrázek). `final` `cislo`. Známé chyby: `vyska-k-jine-strane` (NOVÝ), `vyska-jako-strana`.
- **Čísla:** rozměry celé v cm nebo m do 50; každá potřebná výška je zadaná, žádný dopočet strany.
- **Chyby:** `trojuhelnik-bez-deleni-dvema`, `vyska-jako-strana`, `lichobeznik-jedna-zakladna`, `vyska-k-jine-strane` (NOVÝ), `slozeny-utvar-cast-navic`.

#### M8-T07-L4 · Kontrola: úhly a útvary
- **tema:** Kontrola: úhly a útvary · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě samo dopočítá úhel v útvaru, rozhodne o souměrnosti a spočítá obsah.
- **Platí:**
  1. $65° + 115° = 180°$ — sousední úhly rovnoběžníku
  2. osa, nebo střed — osová, nebo středová
  3. $S = \frac{a \cdot v_a}{2}$ — výška patří ke straně
- **U1 rozcvička** (`dlazdice` ×3): A úhel (L1), B souměrnost nebo trojúhelníková nerovnost (L2), C obsah (L3).
- **U2 detektiv:** obsah rovnoběžníku, Petr vezme výšku k jiné straně. Chyba `vyska-k-jine-strane` (NOVÝ). `final` `cislo`.
- **U3 hlavní:** lichoběžník na obrázku: `k1` `cislo` úhel (sousední úhly u ramene dávají $180°$), `k2` `cislo` obsah, `final` `cislo` (např. cena trávníku za m²).
- **U4 semafor:** obsah trojúhelníku nebo lichoběžníku, `final` `cislo`.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3.

### T08 Poměr, měřítko, úměrnost (`pomer`)

#### M8-T08-L1 · Poměr a dělení v poměru
- **tema:** Poměr a dělení v poměru · **kapitola:** `pomer`
- **Cíl pro rodiče:** Dítě zkrátí poměr na základní tvar a rozdělí celek v daném poměru, i ve třech částech.
- **Platí:**
  1. $12 : 18 = 2 : 3$ — krátí se jako zlomek
  2. $2 + 3 = 5$ — počet dílů dohromady
  3. $60 : 5 = 12$ — velikost jednoho dílu
- **U1 rozcvička** (`dlazdice` ×3): A základní tvar $15 : 25$, B poměr chlapců k dívkám ze slov, C zvětši 40 v poměru $3 : 2$. Distraktory: `pomer-nezkraceny`, `pomer-prevraceny`, `deleni-v-pomeru-bez-souctu-dilu`.
- **U2 detektiv:** dělení v postupném poměru $a : b : c$. Chyba `deleni-v-pomeru-bez-souctu-dilu` (dělí počtem lidí). `final` `cislo`.
- **U3 hlavní:** malta cement : písek $1 : 4$, celková hmotnost směsi. `k1` `dlazdice` „Který zápis odpovídá zadání?“, `k2` `cislo` hmotnost jednoho dílu (zadání „díl“ nejmenuje, popisek „Mezivýsledek“), `final` `cislo` písek.
- **U4 semafor:** rozdělení odměny v poměru, `final` `cislo` část jednoho z dětí.
- **Čísla:** celky do 2 000, členy poměru do 10, postupný poměr se 3 členy.
- **Chyby:** `pomer-nezkraceny`, `pomer-prevraceny`, `pomer-jako-hodnoty`, `deleni-v-pomeru-bez-souctu-dilu`, `deleni-v-pomeru-prohodil`.

#### M8-T08-L2 · Měřítko mapy a plánu
- **tema:** Měřítko mapy · **kapitola:** `pomer`
- **Cíl pro rodiče:** Dítě převede vzdálenost z mapy na skutečnost a zpět a výsledek uvede ve správné jednotce.
- **Platí:**
  1. $1 : 50\,000$ — 1 cm na mapě
  2. $50\,000\ \text{cm} = 500\ \text{m}$ — tolik ve skutečnosti
  3. $300\,000 : 50\,000 = 6$ — ze skutečnosti na mapu
- **U1 rozcvička** (`dlazdice` ×3): A 1 cm na mapě $1 : 25\,000$ v metrech, B 4 cm na mapě $1 : 100\,000$ v km, C „Která mapa je podrobnější?“. Distraktory: `meritko-obracene` (NOVÝ), `posun-carky-o-spatny-pocet`, `jednotka-ve-vysledku-spatne`.
- **U2 detektiv:** $7{,}5$ cm na mapě $1 : 20\,000$ na km. Chyba `posun-carky-o-spatny-pocet` (cm → km). `final` `cislo`.
- **U3 hlavní:** plán bytu $1 : 50$, pokoj na plánu $a \times b$ cm. `k1` `cislo` skutečná délka v m, `k2` `cislo` skutečná šířka v m, `final` `cislo` obsah pokoje v m². Obsah se počítá ze skutečných délek, žádné umocnění měřítka.
- **U4 semafor:** skutečná vzdálenost v km, měřítko: kolik cm na mapě. `final` `cislo`.
- **Čísla:** měřítka $1 : 50$ až $1 : 100\,000$, kulatá; výsledky celé nebo s 1 desetinným místem.
- **Chyby:** `meritko-obracene` (NOVÝ), `posun-carky-o-spatny-pocet`, `jednotka-ve-vysledku-spatne`, `zapomnel-prevest-jednotky`.

#### M8-T08-L3 · Přímá a nepřímá úměrnost, trojčlenka
- **tema:** Přímá a nepřímá úměrnost · **kapitola:** `pomer`
- **Cíl pro rodiče:** Dítě rozhodne „víc → víc, nebo víc → míň“ dřív, než začne počítat, a dopočítá chybějící hodnotu.
- **Platí:**
  1. $3 \to 6$ rohlíků, $12 \to 24$ Kč — přímá: oboje dvakrát víc
  2. $3 \to 6$ malířů, $8 \to 4$ dny — nepřímá: dnů dvakrát míň
  3. $1$ rohlík $= 4$ Kč — přes jeden kus
- **U1 rozcvička** (`dlazdice` ×3): A přímá / nepřímá / žádná (situace), B tabulka hodnot: je to přímá úměrnost?, C dopočet ceny. Distraktory: `prima-jako-neprima`, `neprima-jako-prima`, `umera-jako-soucet`.
- **U2 detektiv:** čerpadla a čas, Petr počítá jako přímou úměrnost. Chyba `neprima-jako-prima`. `final` `cislo`.
- **U3 hlavní:** dělníci: po několika dnech přijdou další, za kolik dní je hotovo celkem. `k1` `dlazdice` přímá, nebo nepřímá?, `k2` `cislo` mezivýsledek, `final` `cislo`. Střední obtížnost, 2 kroky trojčlenky.
- **U4 semafor:** přímá úměrnost s desetinným číslem (cena na váhu) nebo nepřímá (rychlost a čas). `final` `cislo`.
- **Čísla:** hodnoty do 1 000, výsledky celé.
- **Chyby:** `prima-jako-neprima`, `neprima-jako-prima`, `umera-jako-soucet`, `odpovida-na-jinou-otazku`.

#### M8-T08-L4 · Kontrola: poměr a úměrnost
- **tema:** Kontrola: poměr a úměrnost · **kapitola:** `pomer`
- **Cíl pro rodiče:** Dítě samo dělí v poměru, počítá s měřítkem a s úměrností.
- **Platí:**
  1. $3 : 5$ — osm dílů dohromady
  2. $1 : 25\,000$ — centimetr: 250 metrů
  3. víc pracovníků — míň dní
- **U1 rozcvička** (`dlazdice` ×3): A poměr (L1), B měřítko (L2), C úměrnost (L3).
- **U2 detektiv:** z mapy na skutečnost, Petr dělí měřítkem. Chyba `meritko-obracene` (NOVÝ). `final` `cislo`.
- **U3 hlavní:** výlet podle mapy: vzdálenost z mapy → km → čas chůze při dané rychlosti (přímá úměrnost). `k1` `cislo`, `k2` `cislo`, `final` `cislo` (minuty).
- **U4 semafor:** nepřímá úměrnost v nové situaci (zásoba krmiva, počet zvířat). `final` `cislo`.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3.

### T09 Procenta a úrok (`procenta`)

#### M8-T09-L1 · Procento jako setina
- **tema:** Procento jako setina · **kapitola:** `procenta`
- **Cíl pro rodiče:** Dítě spočítá 1 % a z něj libovolná procenta z čísla a zná zkratky pro 10 %, 25 % a 50 %.
- **Platí:**
  1. $1\,\% = \frac{1}{100}$ — jedno procento: setina
  2. $10\,\%$ z $350 = 35$ — deset procent: děleno deseti
  3. $25\,\% = \frac{1}{4}$ — čtvrtina celku
- **U1 rozcvička** (`dlazdice` ×3): A 1 % z 800, B 10 % z 350, C 25 % z 64. Distraktory: `procento-jako-desetina`, `procento-jako-cislo`, `posun-carky-o-spatny-pocet`.
- **U2 detektiv:** 15 % z 240 přes 1 %, Petr dělí deseti. Chyba `procento-jako-desetina`. `final` `cislo`.
- **U3 hlavní:** škola: … % žáků dojíždí, z dojíždějících … % autobusem. `k1` `cislo` dojíždějících, `k2` `cislo` autobusem, `final` `cislo` dojíždí jinak. Známá chyba `z-celku-misto-ze-zbytku` (procenta z celé školy).
- **U4 semafor:** procentová část a zbytek („kolik zbývá“). `final` `cislo`.
- **Čísla:** celky do 2 000, procenta celá, výsledky celé nebo s 1 desetinným místem.
- **Chyby:** `procento-jako-desetina`, `procento-jako-cislo`, `posun-carky-o-spatny-pocet`, `z-celku-misto-ze-zbytku`, `zamenil-cast-a-zbytek`.

#### M8-T09-L2 · Kolik procent a jak velký je celek
- **tema:** Kolik procent, celek · **kapitola:** `procenta`
- **Cíl pro rodiče:** Dítě pozná, co je v úloze celek, a spočítá, kolik procent tvoří část, i jak velký je celek ze známé části.
- **Platí:**
  1. $\frac{12}{48} = 0{,}25 = 25\,\%$ — část děleno celek
  2. $40\,\% \to 12$, $1\,\% \to 0{,}3$ — zpět přes jedno procento
  3. $0{,}3 \cdot 100 = 30$ — celek je sto procent
- **U1 rozcvička** (`dlazdice` ×3): A kolik % je 15 z 60, B 20 % je 14, kolik je celek, C „Co je v této úloze celek?“. Distraktory: `vysledek-bez-prevodu-na-procenta`, `spatny-zaklad`, `procento-jako-cislo`.
- **U2 detektiv:** kolik % zápasů vyhráli, Petr dělí počtem prohraných místo všech. Chyba `spatny-zaklad`. `final` `cislo` (jednotka %).
- **U3 hlavní:** Klára má našetřeno 360 Kč, to je 45 % ceny kola. `k1` `dlazdice` „Co je v této úloze celek?“, `k2` `cislo` cena kola, `final` `cislo` kolik jí chybí. Známá chyba `spatny-zaklad` (45 % z 360).
- **U4 semafor:** kolik % jí ve školní jídelně (dán celek a počet, kdo nejí). `final` `cislo`. Známá chyba `zamenil-cast-a-zbytek`.
- **Čísla:** procenta celá, výsledky celé.
- **Chyby:** `vysledek-bez-prevodu-na-procenta`, `spatny-zaklad`, `procento-jako-cislo`, `zamenil-cast-a-zbytek`, `deleni-obracene`, `odpovida-na-jinou-otazku`.

#### M8-T09-L3 · Zdražení, sleva a jednoduchý úrok
- **tema:** Sleva, zdražení, úrok · **kapitola:** `procenta`
- **Cíl pro rodiče:** Dítě spočítá cenu po zdražení nebo slevě a úrok z vkladu za rok i za několik měsíců.
- **Platí:**
  1. $100\,\% + 20\,\% = 120\,\%$ — zdražení: přičítá se
  2. $100\,\% - 15\,\% = 85\,\%$ — sleva: odečítá se
  3. úrok $2\,\%$ ročně — ročně dvě procenta vkladu
- **U1 rozcvička** (`dlazdice` ×3): A zdražení o 10 %, B sleva 25 %, C roční úrok 3 % z 5 000 Kč. Distraktory: `jen-cast-bez-celku`, `zdrazeni-sleva-zamena`, `procento-jako-cislo`.
- **U2 detektiv:** úrok za 9 měsíců, Petr spočítá úrok za celý rok. Chyba `urok-cely-rok-misto-casti` (NOVÝ). `final` `cislo`.
- **U3 hlavní:** dvě nabídky spoření na 1 rok (vyšší úrok s poplatkem vs. nižší úrok bez poplatku). `k1` `cislo` úrok první banky, `k2` `cislo` úrok druhé banky, `final` `cislo` o kolik korun je lepší nabídka výhodnější.
- **U4 semafor:** cena po zdražení o procenta. `final` `cislo`.
- **Čísla:** ceny do 10 000 Kč, úroky 1–5 % (i s polovinou), doba 1 rok nebo celé měsíce; **bez daně z úroku** (Otázky, bod 5).
- **Chyby:** `jen-cast-bez-celku`, `zdrazeni-sleva-zamena`, `procento-jako-cislo`, `postupne-procenta-secetl`, `sleva-a-zdrazeni-se-vyrusi`, `urok-cely-rok-misto-casti` (NOVÝ).

#### M8-T09-L4 · Kontrola: procenta
- **tema:** Kontrola: procenta · **kapitola:** `procenta`
- **Cíl pro rodiče:** Dítě samo spočítá část, počet procent i původní cenu a pozná, z čeho se procenta berou.
- **Platí:**
  1. $1\,\%$ z $600 = 6$ — setina celku
  2. $80\,\% \to 640$ Kč — po slevě: osmdesát procent
  3. $640 : 80 \cdot 100 = 800$ — zpět přes jedno procento
- **U1 rozcvička** (`dlazdice` ×3): A část (L1), B kolik % (L2), C sleva (L3).
- **U2 detektiv:** po slevě 20 % stojí věc … Kč, kolik stála předtím. Petr přičte 20 % z nové ceny. Chyba `o-tretinu-z-vysledku`. `final` `cislo`.
- **U3 hlavní:** cena se dvakrát změní (zdražení, pak sleva, nebo dvě slevy). `k1` `cislo` cena po první změně, `k2` `dlazdice` „Vyber, co platí“ (`postupne-procenta-secetl`, `sleva-a-zdrazeni-se-vyrusi`), `final` `cislo` konečná cena.
- **U4 semafor:** celek ze známé části a procent (jiná situace než L2). `final` `cislo`.
- **Čísla:** jako L1–L3.
- **Chyby:** všechny z L1–L3 a `o-tretinu-z-vysledku`.

### T10 Tělesa a slovní úlohy (`geometrie`)

Všechny lekce: `pomucky` + „pravítko“ (náčrtek sítě). Obrázky těles jako jednoduchý SVG obrys (kvádr ve volném rovnoběžném promítání, kóty u hran).

#### M8-T10-L1 · Povrch krychle a kvádru
- **tema:** Povrch kvádru a krychle · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě spočítá povrch kvádru a krychle ze stěn a ví, kolik stěn těleso má.
- **Platí:**
  1. $2 \cdot (ab + bc + ac)$ — tři dvojice stejných stěn
  2. $6 \cdot a \cdot a$ — krychle: šest čtverců
  3. bez víka: $5$ stěn — chybějící stěna se nepočítá
- **U1 rozcvička** (`dlazdice` ×3): A povrch krychle s hranou 3 cm, B kolik stěn má krabice bez víka, C povrch kvádru. Distraktory: `povrch-objem-zamena`, `povrch-jen-tri-steny` (NOVÝ), `povrch-bez-podstav`.
- **U2 detektiv:** povrch krabice bez víka, Petr počítá všech 6 stěn. Chyba `prehledl-udaj`. `final` `cislo`.
- **U3 hlavní:** natření bedny bez dna, rozměry v cm, 1 plechovka barvy na … m². `k1` `cislo` natíraná plocha v cm², `k2` `cislo` plocha v m², `final` `cislo` počet plechovek.
- **U4 semafor:** povrch kvádru, `final` `cislo`.
- **Čísla:** hrany celé do 30 cm, nebo v m s 1 desetinným místem.
- **Chyby:** `povrch-objem-zamena`, `povrch-jen-tri-steny` (NOVÝ), `povrch-bez-podstav`, `prehledl-udaj`, `obsah-po-desitkach`, `zapomnel-prevest-jednotky`.

#### M8-T10-L2 · Objem kvádru a litry
- **tema:** Objem a litry · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě spočítá objem kvádru a krychle a převede ho na litry.
- **Platí:**
  1. $V = a \cdot b \cdot c$ — objem: počet krychliček
  2. $1\ \text{dm}^3 = 1\ \text{l}$ — krychlový decimetr je litr
  3. $1\ \text{m}^3 = 1\,000\ \text{l}$ — kubík je tisíc litrů
- **U1 rozcvička** (`dlazdice` ×3): A objem krychle s hranou 4 cm, B kolik litrů je $2\,500\ \text{cm}^3$, C kolik litrů je $1{,}5\ \text{m}^3$. Distraktory: `objem-soucet-rozmeru`, `povrch-objem-zamena`, `objem-po-desitkach-nebo-stovkach`, `litr-zamena`.
- **U2 detektiv:** akvárium s rozměry v dm a cm, Petr nepřevede. Chyba `zapomnel-prevest-jednotky`. `final` `cislo` (l).
- **U3 hlavní:** bazén v m, voda do dané výšky, napouštění … litrů za minutu. `k1` `cislo` objem vody v m³, `k2` `cislo` v litrech, `final` `cislo` doba v hodinách.
- **U4 semafor:** nádrž s rozměry v m a cm: kolik litrů se vejde. `final` `cislo`.
- **Čísla:** rozměry nejvýš ve dvou různých jednotkách, výsledky celé litry.
- **Chyby:** `objem-soucet-rozmeru`, `povrch-objem-zamena`, `objem-po-desitkach-nebo-stovkach`, `litr-zamena`, `zapomnel-prevest-jednotky`, `jednotka-ve-vysledku-spatne`.

#### M8-T10-L3 · Hranoly
- **tema:** Objem a povrch hranolu · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě spočítá objem a povrch kolmého hranolu s podstavou trojúhelníku, rovnoběžníku nebo lichoběžníku.
- **Platí:**
  1. $V = S_p \cdot v$ — podstava krát výška
  2. $S = 2 \cdot S_p + S_{pl}$ — dvě podstavy a plášť
  3. $S_{pl} = o_p \cdot v$ — obvod podstavy krát výška
- **U1 rozcvička** (`dlazdice` ×3, obrázky): A který obrazec je podstava (ležící hranol), B kolik stěn má trojboký hranol, C objem při známém obsahu podstavy. Distraktory: `povrch-bez-podstav`, `obvod-obsah-zamena`, `plast-jen-cast-sten`.
- **U2 detektiv:** objem trojbokého hranolu, Petr nevydělí obsah podstavy dvěma. Chyba `trojuhelnik-bez-deleni-dvema`. `final` `cislo`.
- **U3 hlavní:** násep (hranol s lichoběžníkovou podstavou): objem zeminy a počet nákladních aut po … m³. `k1` `cislo` obsah podstavy, `k2` `cislo` objem, `final` `cislo` počet aut (čísla dělitelná beze zbytku).
- **U4 semafor:** povrch trojbokého hranolu s pravoúhlým trojúhelníkem v podstavě, **všechny tři strany zadané**. `final` `cislo`.
- **Čísla:** rozměry celé v cm nebo m do 20.
- **Chyby:** `trojuhelnik-bez-deleni-dvema`, `lichobeznik-jedna-zakladna`, `povrch-bez-podstav`, `plast-jen-cast-sten`, `obvod-obsah-zamena`.

#### M8-T10-L4 · Kontrola: tělesa ve slovních úlohách
- **tema:** Tělesa ve slovních úlohách · **kapitola:** `geometrie`
- **Cíl pro rodiče:** Dítě samo vyřeší úlohu s tělesem, ve které spojí objem, jednotky a procenta nebo poměr.
- **Platí:**
  1. $V = 5 \cdot 4 \cdot 2\ \text{dm}^3$ — objem v litrech
  2. $75\,\%$ z $40$ l je $30$ l — naplněná část
  3. $40 - 30 = 10\ \text{l}$ — dolít zbývá
- **U1 rozcvička** (`dlazdice` ×3): A povrch (L1), B objem v litrech (L2), C hranol (L3).
- **U2 detektiv:** bazén je naplněný z 80 %, kolik litrů chybí. Petr odečte 80 litrů. Chyba `procento-jako-cislo`. `final` `cislo`.
- **U3 hlavní:** slovní úloha napříč (akvárium naplněné do $\frac{3}{4}$, dolévá se konví, nebo krabice polepená papírem a cena se slevou). `k1` `cislo`, `k2` `cislo`, `final` `cislo`.
- **U4 semafor:** objem nádoby v litrech a naplněná část v procentech, `final` `cislo`.
- **Čísla:** jako L1–L3, procenta násobky 5, zlomky čtvrtiny a třetiny.
- **Chyby:** všechny z L1–L3, `procento-jako-cislo`, `zamenil-cast-a-zbytek`, `z-celku-misto-ze-zbytku`.

---

## 4. Přehled lekcí (pro admin a pořadí)

| téma | L1 | L2 | L3 | L4 (kontrola) |
|---|---|---|---|---|
| T01 | Pořadí operací a závorky | Dělitelnost a prvočísla | Dělitel a násobek v úlohách | Kontrola: čísla a dělitelnost |
| T02 | Porovnání a zaokrouhlení | Desetinná čísla: plus, mínus | Desetinná čísla: krát, děleno | Kontrola: desetinná čísla |
| T03 | Převody délky a hmotnosti | Převody obsahu | Obvod a obsah obdélníku | Kontrola: jednotky a obsah |
| T04 | Krácení a rozšiřování | Porovnání zlomků | Sčítání a odčítání zlomků | Kontrola: zlomky I |
| T05 | Násobení, zlomek z čísla | Dělení zlomků | Smíšená čísla | Kontrola: zlomky II |
| T06 | Záporná čísla na ose | Plus a mínus se zápornými | Krát a děleno se zápornými | Kontrola: záporná čísla |
| T07 | Úhly v trojúhelníku | Trojúhelník a souměrnost | Obsah trojúhelníku a lichoběžníku | Kontrola: úhly a útvary |
| T08 | Poměr a dělení v poměru | Měřítko mapy | Přímá a nepřímá úměrnost | Kontrola: poměr a úměrnost |
| T09 | Procento jako setina | Kolik procent, celek | Sleva, zdražení, úrok | Kontrola: procenta |
| T10 | Povrch kvádru a krychle | Objem a litry | Objem a povrch hranolu | Tělesa ve slovních úlohách |

---

## 5. Diagnostika `M8-T00-DIAG`

- **20 úloh, 2 na každé téma**, každá jen krok `final`, bez taháku a bez semaforu, `zdroj: "vlastni"`, `cas_min` 1–2. Dohromady asi 25 minut. Rodič nenapovídá.
- **Proč 20, ne 24:** pravidlo doporučení (oddíl 6) potřebuje u každého tématu **stejný počet úloh**, jinak by téma se 3 úlohami vycházelo jako slabé častěji. 3 úlohy × 10 témat = 30 úloh by se do 25 minut nevešly. Dvě úlohy na téma pokrývají dvě ze tří lekcí; třetí lekci ověří kontrola tématu (L4).
- Každá úloha nese pole **`tema`: číslo tématu 1–10** (schéma ho na úloze diagnostiky už má, `web/js/doporuceni.js` podle něj počítá výsledek po tématech). `kapitola` zůstává kvůli statistikám a hláškám.
- Pořadí úloh je podle témat, tedy od základů. Všechny výsledky a známé chyby jsou přepočítané skriptem (node).

| # | `tema` · kapitola | měří (lekce) | zadání | vstup | správně | známé chyby (`hodnota` → kód) |
|---|---|---|---|---|---|---|
| U1 | 1 (T01) · `pocetni-operace` | pořadí operací, závorka (L1) | Vypočítej: $$60 - 4 \cdot (3 + 2) : 2$$ | `cislo` | $50$ | $140$ `scital-pred-nasobenim`; $49$ `ignoroval-zavorku` |
| U2 | 1 (T01) · `pocetni-operace` | $D$, nebo $n$ (L3) | Tramvaj č. 3 odjíždí ze zastávky každých $12$ minut, tramvaj č. 7 každých $18$ minut. V $8{:}00$ odjely obě současně. Za kolik minut odjedou zase současně? | `cislo`, jednotka min | $36$ | $6$ `nsd-nsn-zamena`; $216$ `nsn-soucin-cisel` |
| U3 | 2 (T02) · `desetinna-cisla` | porovnání po řádech (L1) | Napiš největší z čísel $0{,}5$; $0{,}45$; $0{,}405$; $0{,}54$. | `cislo` | $0{,}54$ | $0{,}405$ a $0{,}45$ `porovnani-desetinnych-podle-delky` |
| U4 | 2 (T02) · `desetinna-cisla` | čárka při násobení a dělení (L3) | Vypočítej: $$0{,}6 \cdot 0{,}4 + 1{,}5 : 0{,}5$$ | `cislo` | $3{,}24$ | $5{,}4$ `carka-pri-nasobeni`; $0{,}54$ `carka-pri-deleni` |
| U5 | 3 (T03) · `jednotky` | převody obsahu (L2) | Kolik decimetrů čtverečních je dohromady? $$2\ \text{m}^2 + 50\ \text{dm}^2 + 300\ \text{cm}^2$$ | `cislo`, jednotka dm² | $253$ | $100$, $73$, $280$ `obsah-po-desitkach`; $352$ `zapomnel-prevest-jednotky` |
| U6 | 3 (T03) · `geometrie` | obvod a obsah obdélníku (L3) | Obdélníková zahrada má obvod $50$ m. Jedna její strana měří $15$ m. Jaký obsah má zahrada? | `cislo`, jednotka m² | $150$ | $525$ `strana-z-obvodu-bez-poloviny`; $750$ `pocital-se-vsemi-cisly`; $10$ `odpovida-na-jinou-otazku` |
| U7 | 4 (T04) · `zlomky` | sčítání zlomků (L3) | Vypočítej a výsledek zapiš zlomkem v základním tvaru: $$\frac{3}{4} + \frac{1}{6}$$ | `zlomek`, `zakladni_tvar` | $\frac{11}{12}$ | $\frac{2}{5}$ `scital-citatele-i-jmenovatele`; $\frac{1}{3}$ `neprepocital-citatel` |
| U8 | 4 (T04) · `zlomky` | krácení a rozšiřování (L1) | Doplň číslo místo otazníku, aby se zlomky rovnaly: $$\frac{6}{15} = \frac{?}{25}$$ | `cislo` | $10$ | $16$ `pricetl-misto-nasobeni`; $6$ `upravil-jen-cast-zlomku` |
| U9 | 5 (T05) · `zlomky` | smíšené číslo, dělení (L2, L3) | Vypočítej a výsledek zapiš zlomkem v základním tvaru: $$2\frac{1}{4} : \frac{3}{2}$$ | `zlomek`, `zakladni_tvar` | $\frac{3}{2}$ | $\frac{1}{2}$ `smisene-scital-celou-cast`; $\frac{2}{3}$ `prevratil-prvni`; $\frac{27}{8}$ `delil-bez-prevraceni` |
| U10 | 5 (T05) · `zlomky` | zlomek ze zbytku (L1) | Lucka měla $240$ Kč. Šestinu utratila za lístek do kina. Ze zbytku dala tři pětiny za dárek pro Emu. Kolik korun stál dárek? | `cislo`, jednotka Kč | $120$ | $144$ `z-celku-misto-ze-zbytku`; $40$ `zlomek-z-cisla-jen-deleni`; $80$ `zamenil-cast-a-zbytek` |
| U11 | 6 (T06) · `cela-cisla` | sčítání a odčítání, desetinná záporná (L2) | Ráno bylo $-6{,}5\ °\text{C}$. Do poledne se oteplilo o $9\ °\text{C}$, do večera se ochladilo o $4{,}5\ °\text{C}$. Kolik stupňů bylo večer? | `cislo`, jednotka °C | $-2$ | $2$ `mensi-minus-vetsi`; $-20$ `ruzna-znamenka-secetl`; $-11$ `posun-spatnym-smerem` |
| U12 | 6 (T06) · `cela-cisla` | znaménka, krát a děleno (L3) | Vypočítej: $$(-12) : 3 \cdot (-2) - 5 \cdot (-1)$$ | `cislo` | $13$ | $-3$ `minus-krat-minus`; $7$ `neslo-zleva`; $3$ `odcitani-zaporneho` |
| U13 | 7 (T07) · `geometrie` | úhly v rovnoramenném trojúhelníku (L1) | V rovnoramenném trojúhelníku měří úhel proti základně $40°$. Jak velký je jeden úhel při základně? | `cislo`, jednotka ° | $70$ | $40$ `rovnoramenny-uhly-zamena`; $140$ `odpovida-na-jinou-otazku`; $160$ `soucet-uhlu-trojuhelniku-spatne` |
| U14 | 7 (T07) · `geometrie` | obsah rovnoběžníku, výška ke straně (L3) | Rovnoběžník má strany $10$ cm a $6$ cm. Výška na delší stranu měří $3$ cm. Jaký obsah má rovnoběžník? | `cislo`, jednotka cm² | $30$ | $60$ `vyska-jako-strana`; $18$ `vyska-k-jine-strane`; $32$ `obvod-obsah-zamena` |
| U15 | 8 (T08) · `pomer` | dělení v poměru (L1) | Adam a Ema si rozdělili $720$ Kč v poměru $5 : 3$ (Adam : Ema). Kolik korun dostala Ema? | `cislo`, jednotka Kč | $270$ | $240$ `deleni-v-pomeru-bez-souctu-dilu`; $450$ `deleni-v-pomeru-prohodil` |
| U16 | 8 (T08) · `pomer` | nepřímá úměrnost (L3) | Šest stejných čerpadel vyčerpá nádrž za $12$ hodin. Za kolik hodin ji vyčerpá osm takových čerpadel? | `cislo`, jednotka h | $9$ | $16$ `neprima-jako-prima`; $10$ `umera-jako-soucet` |
| U17 | 9 (T09) · `procenta` | sleva (L3) | Mikina stála $640$ Kč. Ve výprodeji ji zlevnili o $15\,\%$. Kolik korun stojí teď? | `cislo`, jednotka Kč | $544$ | $96$ `jen-cast-bez-celku`; $625$ `procento-jako-cislo`; $736$ `zdrazeni-sleva-zamena` |
| U18 | 9 (T09) · `procenta` | celek z části (L2) | Ve třídě je $12$ dívek. To je $40\,\%$ všech žáků třídy. Kolik žáků má třída? | `cislo` | $30$ | $4{,}8$ `spatny-zaklad`; $0{,}3$ `odpovida-na-jinou-otazku`; $52$ `procento-jako-cislo` |
| U19 | 10 (T10) · `geometrie` | povrch kvádru (L1) | Kvádr má rozměry $5$ cm, $4$ cm a $3$ cm. Jaký má povrch? | `cislo`, jednotka cm² | $94$ | $47$ `povrch-jen-tri-steny`; $60$ `povrch-objem-zamena`; $54$ `povrch-bez-podstav` |
| U20 | 10 (T10) · `geometrie` | objem a litry (L2) | Akvárium tvaru kvádru má dno $50$ cm × $30$ cm. Voda v něm sahá do výšky $2$ dm. Kolik litrů vody je v akváriu? | `cislo`, jednotka l | $30$ | $3$ `zapomnel-prevest-jednotky`; $30\,000$ `litr-zamena`; $300$ `objem-po-desitkach-nebo-stovkach` |

Kontrola výpočtů (skript, 1. 10. 2026):
U1: $3 + 2 = 5$, $4 \cdot 5 = 20$, $20 : 2 = 10$, $60 - 10 = 50$. Chyby: $(60 - 4) \cdot 5 : 2 = 140$; $60 - 4 \cdot 3 + 2 : 2 = 49$.
U2: $n(12, 18) = 36$, $D = 6$, součin $216$.
U4: $0{,}24 + 3 = 3{,}24$; $2{,}4 + 3$; $0{,}24 + 0{,}3$.
U5: $200 + 50 + 3$; $20 + 50 + 30$; $20 + 50 + 3$; $200 + 50 + 30$; $2 + 50 + 300$.
U6: druhá strana $(50 - 30) : 2 = 10$, obsah $150$; $15 \cdot 35 = 525$; $50 \cdot 15 = 750$.
U7: $\frac{9}{12} + \frac{2}{12} = \frac{11}{12}$; $\frac{4}{10} = \frac{2}{5}$; $\frac{4}{12} = \frac{1}{3}$.
U8: $\frac{6}{15} = \frac{2}{5} = \frac{10}{25}$; $6 + 10 = 16$.
U9: $\frac{9}{4} \cdot \frac{2}{3} = \frac{3}{2}$; $\frac{3}{4} : \frac{3}{2} = \frac{1}{2}$; $\frac{4}{9} \cdot \frac{3}{2} = \frac{2}{3}$; $\frac{9}{4} \cdot \frac{3}{2} = \frac{27}{8}$.
U10: $240 : 6 = 40$, zbytek $200$, $\frac{3}{5} \cdot 200 = 120$; $\frac{3}{5} \cdot 240 = 144$; $200 : 5 = 40$; $200 - 120 = 80$.
U11: $-6{,}5 + 9 = 2{,}5$, $2{,}5 - 4{,}5 = -2$; $-15{,}5 - 4{,}5 = -20$; $-6{,}5 - 9 + 4{,}5 = -11$.
U12: $(-4) \cdot (-2) = 8$, $8 - (-5) = 13$; $-8 + 5 = -3$; $(-12) : (-6) + 5 = 7$; $8 - 5 = 3$.
U13: $(180 - 40) : 2 = 70$; $180 - 40 = 140$; $(360 - 40) : 2 = 160$.
U14: $10 \cdot 3 = 30$ (kontrola: výška na kratší stranu $30 : 6 = 5 \le 10$, útvar existuje); $10 \cdot 6$; $6 \cdot 3$; $2 \cdot (10 + 6)$.
U15: díl $720 : 8 = 90$, Ema $270$; $720 : 3 = 240$; $5 \cdot 90 = 450$.
U16: $6 \cdot 12 = 72$, $72 : 8 = 9$; $12 \cdot 8 : 6 = 16$; $12 - 2 = 10$.
U17: $640 \cdot 0{,}85 = 544$; $640 \cdot 0{,}15 = 96$; $640 - 15$; $640 \cdot 1{,}15 = 736$.
U18: $12 : 0{,}4 = 30$; $0{,}4 \cdot 12 = 4{,}8$; $12 : 40 = 0{,}3$; $12 + 40 = 52$.
U19: $2 \cdot (20 + 15 + 12) = 94$; $47$; $5 \cdot 4 \cdot 3 = 60$; plášť $2 \cdot (5 + 4) \cdot 3 = 54$.
U20: $50 \cdot 30 \cdot 20 = 30\,000\ \text{cm}^3 = 30$ l; $50 \cdot 30 \cdot 2 = 3\,000\ \text{cm}^3 = 3$ l; $30\,000$; $300$.

Poznámky pro autora diagnostiky: U3 nemá druhou známou chybu s jiným kódem (chybné $0{,}5$ nemá typickou chybu, je „zatím nesedí“). U9 má jen 3 známé chyby ze 4 možných; $\frac{1}{3}$ (`smisene-jako-soucin`) lze přidat jako 4. výjimku. U14 je text bez obrázku (obrázek by prozradil, ke které straně výška patří).

## 6. Pravidlo doporučení (z diagnostiky pořadí témat)

Pravidlo je v souladu s tím, co už počítá `web/js/doporuceni.js` (`vysledekPoTematech`, `doporucenePoradiTemat`, prahy z `diagnostika.js stavKapitoly`). Navíc navrhuji body 4 a 5 (výběr lekcí uvnitř tématu), které kód zatím nemá.

1. **Výsledek tématu** = počet správně ze 2 úloh s `tema` daného tématu. „Správně s poznámkou“ (nezkrácený zlomek u `zakladni_tvar`) se počítá jako správně. Odevzdaná chybná odpověď je chyba.
2. **Stav tématu** (při 2 úlohách): **silné** = 2/2; **nejisté** = 1/2; **slabé** = 0/2 (obě úlohy odevzdané a chybné); **nezjištěné** = méně než 1 odevzdaná úloha ze 2 (dítě test nedokončilo).
3. **Pořadí témat:** nejdřív slabá témata v pořadí osnovy T01 → T10, pak nejistá a nezjištěná v pořadí osnovy, nakonec silná v pořadí osnovy. Bez diagnostiky platí pořadí osnovy.
4. **Lekce uvnitř tématu (návrh pro frontend):** slabé, nejisté i nezjištěné téma = všechny 4 lekce L1 → L4. **Silné téma = jen L4 (kontrola tématu)**; L1–L3 zůstávají v seznamu jako „volitelné“.
5. **Pojistka u silného tématu (návrh):** když L4 silného tématu skončí oranžovou nebo červenou barvou semaforu (barva lekce = semafor úlohy U4), zařadí se L1–L3 tohoto tématu hned za ni a pak znovu L4.
6. **Krajní případy:** všechno správně → 10 kontrol tématu (L4) v pořadí T01–T10, pak nabídka „opakovat po lekcích“. Všechno špatně, nebo bez diagnostiky → pořadí osnovy, všechny 4 lekce.
7. **Nic se nezamyká.** Všech 40 lekcí je dostupných, doporučení jen řadí seznam „Další lekce“.
8. **Report rodiči:** u každého tématu stav (jde / nejisté / opakujeme), 3 nejčastější kódy chyb s popisem z `typy-chyb.md` (detektivní kódy a `numericka-chyba` se nepočítají, jak už dělá kód) a věta „Začneme tématem …“.

Poznámka metodika: kód řadí slabá (0/2) před nejistá (1/2). Tím může např. T09 (0/2) předběhnout T04 (1/2), i když procenta stojí na zlomcích. U 2 úloh na téma je rozdíl 0/2 a 1/2 slabý signál. Doporučuji slabá a nejistá témata spojit do jedné skupiny v pořadí osnovy (Otázky, bod 9). Diagnostiku i lekce lze napsat pro obě varianty, osnova na tom nezávisí.

---

## 7. Návrh nových kódů chyb

17 nových kódů. Každý jsem ověřil proti `obsah/typy-chyb.md` (oddíly A–AD) a žádný existující kód tutéž chybu nepopisuje. „Otázka pro rodiče“ se ptá na pravidlo a dá se použít i jako nápověda v režimu „Dnes samo“; výsledek neprozradí. Navrhuji je zapsat do `typy-chyb.md` jako nový oddíl **AE. Spolu 8**.

| kód | popis | příklad (špatně → správně) | otázka pro rodiče | lekce |
|---|---|---|---|---|
| `delitelnost-4-podle-posledni-cislice` | O dělitelnosti čtyřmi rozhodl podle poslední číslice (4 nebo 8 na konci, nebo jen sudé), ne podle posledního dvojčíslí. | „134 končí čtyřkou, je dělitelné čtyřmi“ → $34$ čtyřmi dělitelné není | „Které číslo tvoří poslední dvě číslice? Jde ho vydělit čtyřmi beze zbytku?“ | T01-L2, L4 |
| `delitelnost-slozena-jedna-podminka` | U dělitelnosti 6, 12, 15 nebo 18 ověřil jen jednu ze dvou podmínek (např. jen sudé číslo). | „38 je sudé, tak je dělitelné šesti“ → $3 + 8 = 11$, šesti dělitelné není | „Šestka je dvě krát tři. Čím vším musí jít číslo vydělit?“ | T01-L2 |
| `nsn-soucin-cisel` | Za nejmenší společný násobek vzal součin obou čísel, i když mají společného dělitele. | $n(12, 18) = 216$ → $36$ | „Napiš si pár násobků většího čísla. Který z nich jde vydělit i tím menším?“ | T01-L3, DIAG U2 |
| `rad-cislice-zamena` | Zaměnil řády za desetinnou čárkou (desetiny, setiny, tisíciny) při zápisu nebo čtení čísla. | „tři setiny“ $= 0{,}3$ → $0{,}03$; v $4{,}075$ je $7$ na místě desetin → setin | „Kolik míst za čárkou mají setiny? Ukaž mi je prstem na čísle.“ | T02-L1 |
| `obvod-slozeneho-chybi-strany` | U obvodu složeného útvaru vynechal strany bez popisku, nebo započítal vnitřní čáru (osu, dělicí čáru). | útvar L $8 \times 6$ s výřezem $3 \times 2$: $8 + 6 + 3 + 2 = 19$ → $28$ | „Obejdi útvar prstem po okraji. Kolik úseků cestou potkáš?“ | T03-L3, T07-L2 |
| `porovnal-podle-rozdilu` | Zlomky porovnal podle toho, kolik čitateli chybí do jmenovatele („oběma chybí jeden díl, jsou stejné“). | $\frac{3}{4} = \frac{4}{5}$ → $\frac{3}{4} < \frac{4}{5}$ | „Který díl je větší, čtvrtina, nebo pětina? Kterému zlomku chybí větší kus?“ | T04-L2 |
| `odcital-zlomek-od-celeho-spatne` | Při odčítání zlomku od celého (nebo smíšeného) čísla ubral celou jedničku a zlomek ponechal. | $2 - \frac{1}{3} = 1\frac{1}{3}$ → $1\frac{2}{3}$ | „Kolik třetin je jedna celá? Kolik jich zbude, když jednu třetinu ubereš?“ | T04-L3, T05-L3 |
| `opacne-prevracene-zamena` | Zaměnil opačné a převrácené číslo. | převrácené k $\frac{2}{7}$: $-\frac{2}{7}$ → $\frac{7}{2}$; opačné k $-4$: $-\frac{1}{4}$ → $4$ | „Převrácené číslo krát původní dá jedna. Opačné plus původní dá nula. Které z toho chce úloha?“ | T05-L2, T06-L1 |
| `ruzna-znamenka-secetl` | U součtu čísel s různými znaménky sečetl jejich velikosti místo odečtení. | $-7 + 3 = -10$ → $-4$ | „Na teploměru je mínus sedm a oteplí se o tři. Kterým směrem po stupnici jdeš?“ | T06-L2, L4, DIAG U11 |
| `stupne-minuty-po-stovkach` | U úhlů ve stupních a minutách přenáší po 100 minutách místo po 60. | $47°35' + 38°40' = 85°75'$ → $86°15'$; $180° - 47°35' = 133°65'$ → $132°25'$ | „Kolik minut má jeden stupeň? Je tvůj počet minut menší než tohle číslo?“ | T07-L1 |
| `rovnobeznik-uhly-zamena` | U rovnoběžníku zaměnil protější úhly (jsou shodné) a sousední úhly (dávají dohromady $180°$). | $\alpha = 65°$: protější $115°$ → $65°$; sousední $65°$ → $115°$ | „Podívej se na obrázek: je ten úhel ostrý, nebo tupý? Sedí to s tvým číslem?“ | T07-L1, L4 |
| `osova-stredova-zamena` | Zaměnil osovou a středovou souměrnost (překlopil místo otočení nebo naopak), nebo osově souměrný útvar označil za středově souměrný. | rovnoramenný trojúhelník „je středově souměrný“ → je jen osově souměrný | „Když útvar otočíš vzhůru nohama kolem středu, vypadá stejně?“ | T07-L2 |
| `pocet-os-spatne` | Špatně určil počet os souměrnosti (u obdélníku přidal úhlopříčky, u čtverce na ně zapomněl). | obdélník $4$ → $2$; čtverec $2$ → $4$ | „Kdybys útvar přeložil podle té čáry, kryly by se obě půlky?“ | T07-L2 |
| `vyska-k-jine-strane` | Obsah spočítal se stranou a výškou, která k ní nepatří (výška na jinou stranu). | rovnoběžník $a = 10$, $b = 6$, $v_a = 3$: $6 \cdot 3 = 18$ → $10 \cdot 3 = 30$ | „Ukaž mi, na kterou stranu výška kolmo dopadá. Kterou stranu s ní násobíš?“ | T07-L3, L4, DIAG U14 |
| `meritko-obracene` | Při převodu podle měřítka dělil místo násobení (z mapy na skutečnost) nebo naopak; nebo považuje mapu s větším číslem v měřítku za podrobnější. | $3$ cm, $1 : 50\,000$: $3 : 50\,000$ → $150\,000$ cm $= 1{,}5$ km | „Je skutečná cesta delší, nebo kratší než čára na mapě?“ | T08-L2, L4 |
| `urok-cely-rok-misto-casti` | U úroku za část roku spočítal úrok za celý rok. | $10\,000$ Kč, $3\,\%$ ročně, 4 měsíce: $300$ Kč → $100$ Kč | „Jak dlouho jsou peníze uložené? Jaká část roku to je?“ | T09-L3 |
| `povrch-jen-tri-steny` | U povrchu kvádru sečetl jen tři různé stěny a nevynásobil je dvěma. | kvádr $5 \times 4 \times 3$ cm: $47$ → $94\ \text{cm}^2$ | „Kolik stěn má krabice? Kolik jich máš sečtených?“ | T10-L1, DIAG U19 |

Existující kódy, které Spolu 8 používá v novém smyslu (bez nového kódu): `prehledl-udaj` (krabice bez víka spočítaná se šesti stěnami, T10-L1), `stupnice-grafu-spatne` (dílek číselné osy, T06-L1), `posun-carky-o-spatny-pocet` (ha ↔ m², měřítko cm ↔ km), `odpovida-na-jinou-otazku` (U13 součet dvou úhlů při základně, U18 jedno procento místo celku).

---

## 8. Otázky pro vedoucího

1. **Schéma a hlavička lekce.** Backend už doplnil id `M8-…`, `faze: "osma"`, otevřené kódy kapitol a `tema` na úloze diagnostiky. Zbývá `varianta` (výčet `z9 | z7`): navrhuji `"z8"`, nebo pole pro Spolu 8 vynechat. A potvrdit: `tyden` = číslo tématu 1–10 (diagnostika 0), `poradi` = číslo lekce 1–4 (tak to čte `doporuceni.js`).
2. **Vazba úlohy diagnostiky na téma.** Používám pole `tema` (číslo 1–10), které schéma i `doporuceni.js` už mají. Úloha z kapitoly sdílené více tématy (`geometrie`, `jednotky`) ho mít **musí**, jinak by ji kód připsal všem tématům s touto kapitolou (T03, T07, T10). Navrhuji, aby validátor u `M8-T00-DIAG` vyžadoval `tema` u každé úlohy.
3. **„O stupeň těžší než Fáze 1 Spolu“ (ZADANI §4) je v rozporu s „opakováním 6.–7. ročníku“.** Fáze 1 je pro 9. třídu a už je na úrovni testu M9. Navrhuji stejnou číselnou náročnost jako F1, širší záběr (dělitelnost, úhly, souměrnost, tělesa, úrok, měřítko, které F1 nemá) a hlavní úlohu se 2–3 kroky. Potvrďte prosím.
4. **Konstrukce nejsou v osnově.** Konstrukce trojúhelníku (sss, sus, usu), rovnoběžníku a rýsování obrazu v osové a středové souměrnosti patří k jádru učiva 6.–7. ročníku. Vstup `rysovani` ale v režimu „Dnes samo“ nefunguje (vyhodnocuje rodič). Souměrnost jsem nahradil úlohami „pozná a dopočítá“ (T07-L2). Možnosti: a) nechat to tak; b) volitelná 5. úloha `rysovani` jen pro režim s rodičem; c) samostatné papírové listy mimo 40 lekcí. Doporučuji a), později c).
5. **Úrok:** jen jednoduchý úrok za rok nebo celé měsíce, **bez daně z úroku 15 %** a bez složeného úrokování. Mají se daň nebo dvouletý úrok přidat? Část škol je v 7. ročníku učí, ale prodlouží hlavní úlohu nad 4 výpočty.
6. **Typ úlohy `cermat`.** Hodnota zůstává kvůli schématu, ale UI, tisk a manuál rodiče nesmí ukázat „CERMAT“ (ZADANI: bez přijímaček). Je potřeba mapování typu na štítek „Hlavní úloha“ ve frontendu a tisku. Dál: SABLONA §5.3, §18 („tvrzení o přijímačkách“) a §20 pro Spolu 8 neplatí. Navrhuji do SABLONA přidat odstavec „Spolu 8“, který to řekne výslovně, aby se autor neřídil pravidly klonu.
7. **Změna pořadí témat** (oddíl 2: jednotky jako T03, geometrie T07 doprostřed, poměr a procenta před tělesy). Potvrďte, nebo vraťte původní pořadí. Na obsah lekcí nemá vliv, jen na čísla `tt`.
8. **Značky jednotek a „bez mocnin“.** $\text{cm}^2$ a $\text{m}^3$ se v osnově objevují jako značky jednotek a obsah čtverce i objem krychle se zapisují jako součin ($a \cdot a$). Mocninu jako operaci dítě nepočítá. Souhlasíte, že to není učivo 8. ročníku?
9. **Pravidlo doporučení:** kód dává slabá (0/2) před nejistá (1/2). Navrhuji obě skupiny spojit a řadit podle osnovy (oddíl 6, poznámka). Dál potřebuje frontend výběr lekcí uvnitř tématu: silné téma = jen L4 a pojistka po oranžové nebo červené L4 (oddíl 6, body 4 a 5). Řídit pojistku barvou semaforu U4, nebo souhrnem lekce?
10. **Stupně a minuty** (T07-L1, U3) jsou dva kroky `cislo` s `jednotka` „°“ a „′“. Ověřte prosím, že `cislo.jednotka` zobrazí znak minuty (′, U+2032) a že pole jde za sebou v jednom řádku. Jinak minuty vypustíme a úloha bude jen v celých stupních.
11. **Kontrola základního tvaru v detektivovi T04-L4.** Chci zachytit „nezkrátil úplně“ jako známou chybu. S `kontrola_tvaru: "zakladni_tvar"` to nejde (nezkrácený výsledek je „správně s poznámkou“), bez ní aplikace nezkrácený výsledek uzná. Navrhuji `final` jako `cislo` „Čitatel výsledku v základním tvaru“, nebo krok `k2` jako dlaždici. Rozhodne autor, potřebuji jen souhlas s odchylkou.
12. **Diagnostika má 20 úloh, ne 24** (důvod v oddílu 5). Chcete delší diagnostiku (např. 3 úlohy na téma = 30 úloh, ~35 min, se dvěma částmi)? ZADANI říká 20–25 úloh a ~25 min, takže 20 je v rozsahu.
