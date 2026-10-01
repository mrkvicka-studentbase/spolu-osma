# Slovník typů chyb

Sdílený seznam hodnot pro `typ_chyby` (dlaždice, `zname_chyby`). Ukládá se do `odpovedi.typ_chyby` a z něj staví admin statistiky a report diagnostiky, proto **stejná chyba = vždy stejný kód** napříč lekcemi.

## Pravidla pojmenování
- Kód: **česky bez diakritiky, malá písmena, slova spojená pomlčkou** (kebab-case), 2–5 slov. Např. `scital-pred-nasobenim`.
- Tvar: co žák **udělal** (sloveso v minulém čase, rod mužský jako neutrální tvar kódu: `ignoroval-zavorku`), nebo krátký popis záměny (`kolikrat-jako-o-kolik`, `mocnina-jako-dvojnasobek`).
- Kód se nikdy nezobrazuje dítěti. Rodiči/adminu se zobrazuje sloupec „Popis“ (lidsky).
- Nový typ: nejdřív přidat sem (kód, popis, příklad, lekce), teprve pak použít v JSON. Než přidáš nový, zkontroluj, jestli se chyba nedá popsat existujícím kódem.
- Obecná numerická chyba (spletl se v malé násobilce) **nemá** vlastní kód v distraktorech; distraktory mají být chyby v myšlení. Pro výjimečné případy existuje `numericka-chyba`.


## Přehled kapitol a oddílů

| kapitola (`kapitola`) | název | oddíly slovníku | týdny Fáze 1 |
|---|---|---|---|
| `pocetni-operace` | početní operace | A, E, F, K | pilot P1; T1, T8 |
| `cela-cisla` | celá čísla | C, E, G | pilot P2; T1 |
| `zlomky` | zlomky | D, H, I, J | pilot P3, P4; T2 |
| `desetinna-cisla` | desetinná čísla | L | T3 |
| `pomer` | poměr (nová kapitola) | M | T3 |
| `procenta` | procenta | N | T4, T8 |
| `jednotky` | jednotky | O | T5 |
| `slovni-ulohy` | slovní úlohy (nová kapitola) | P, W, AB, AC | F1 T5, T8; F2 T2, T4 |
| `vyrazy` | výrazy | Q, T | F1 T6; F2 T1 |
| `rovnice` | rovnice | R, U, V | F1 T6, T8; F2 T1–T2 |
| `geometrie` | geometrie | S, X, Y, Z, AA | F1 T7; F2 T3–T4 |
| všechny | detektiv | B (ve statistikách zvlášť) | každá lekce |
| `mix` | smíšené úlohy (bloky, rozbory; Fáze 2) | podle kapitoly úlohy + AD | F2 T5–T11 |
| `simulace` | simulace testu (Fáze 2) | podle kapitoly úlohy + AD | F2 T8–T10 |

Oddíl K jsou kódy pro vstup `poradi` (napříč kapitolami).

---

## A. Pořadí operací (kapitola `pocetni-operace`, P1)

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `scital-pred-nasobenim` | Sčítal **nebo odčítal** dřív, než násobil/dělil (počítal zleva doprava jako při čtení). Platí i pro odčítání, **nezakládej** `odcital-pred-nasobenim`. | $5 + 3 \cdot 4 = 32$ → $17$; odčítání: $90 - 2 \cdot 9 = 88 \cdot 9$ → $72$; $(8-2)^2 : 4 + 3 \cdot 5 = 60$ → $24$ | P1-U1, U2, U4; P2; P4 |
| `poradi-nezalezi` | Myslí si, že na pořadí operací nezáleží, že vyjde vždy totéž. | „U $5 + 3 \cdot 4$ je jedno, čím začnu.“ | P1-U1; P4 |
| `ignoroval-zavorku` | Nespočítal závorku jako první / počítal, jako by tam nebyla. | $(5 + 3) \cdot 4$: začne $3 \cdot 4$; $(8 - 2)^2 : 4 + 3 \cdot 5$ počítá jako $8 - 2^2 : 4 + 15 = 22$ → $24$ | P1-U1, U4 |
| `umocnil-jen-cast-zavorky` | Závorku drží jako celek, ale exponent za ní použije jen na poslední číslo v ní. | $(8 - 2)^2 = 8 - 2^2 = 4$ → $36$; $(8-2)^2 : 4 + 3 \cdot 5 = 16$ → $24$ | P1-U4 |
| `nasobil-pred-mocninou` | Nejdřív násobil a pak umocnil (mocnina má přednost). | $2 \cdot 3^2 = 6^2 = 36$ → $18$ | P1-U1, U2 |
| `mocnina-jako-dvojnasobek` | Druhou mocninu spočítal jako násobení dvěma. I u písmen: $x \cdot x = 2x$ místo $x^2$. | $3^2 = 6$ → $9$; $6^2 = 12$ → $36$ | P1-U2, U4, T6-L1 |
| `mocnina-na-cely-vyraz` | Umocnil víc, než k čemu exponent patří. | $2^2 + 5 = 7^2 = 49$ → $9$; $5^2 \cdot 2 = 100$ → $50$ | (připraveno) |
| `chybi-zavorka` | Při přepisu slov do výrazu vynechal závorku kolem součtu/rozdílu, který se má spočítat celý. | „součet 25 a 4 vydělený 10“ zapíše $25 + 4 : 10 = 25{,}4$ → $2{,}9$ | P1-U3 |
| `kolikrat-jako-o-kolik` | Místo „kolikrát“ (dělení) počítal „o kolik“ (odčítání); i „dvakrát víc“ čte jako „o dva víc“. | $29 - 10 = 19$ → $29 : 10 = 2{,}9$; dvakrát víc než 6: $8$ → $12$ | P1-U3, T3 |
| `o-kolik-jako-kolikrat` | Opak: místo rozdílu počítal podíl. | „o kolik je 12 větší než 4“: $3$ → $8$ | (připraveno) |
| `deleni-obracene` | Vydělil v opačném pořadí (dělitel : dělenec), často menší větším. U patrového zlomku dělí dolní patro horním. U rovnice: z $3x = 12$ napíše $x = \frac{3}{12}$. | „kolikrát je 29 větší než 10“: $10 : 29$; $\dfrac{\frac{3}{4}}{\frac{3}{8}}$ počítá jako $\frac{3}{8} : \frac{3}{4} = \frac{1}{2}$ → $2$ | T2, T6-L3 |
| `zapomnel-odmocninu` | Vynechal odmocninu, počítal s číslem pod ní. | $\sqrt{25 \cdot 4} = 100$ → $10$ | P1-U3 |
| `odmocnina-jako-deleni-dvema` | Druhou odmocninu spočítal jako dělení dvěma. | $\sqrt{100} = 50$ → $10$ | P1-U3 |
| `odmocnina-jen-z-casti` | Odmocnil jen část výrazu pod odmocninou. | $\sqrt{25 \cdot 4} = 5 \cdot 4 = 20$ → $10$ | P1-U3 |
| `odmocnina-po-clenech` | Odmocnil součet/rozdíl po členech. | $\sqrt{9 + 16} = 3 + 4 = 7$ → $5$ | (připraveno) |
| `numericka-chyba` | Postup správně, spletl se v počítání (násobilka, přepis). Jen výjimečně. | $7 \cdot 8 = 54$ | — |

## B. Detektiv (všechny lekce) — detektivní kódy, ve statistikách zvlášť

Kódy z tohoto oddílu jsou **detektivní — ve statistikách zvlášť**. Nepopisují matematickou chybu, ale dovednost najít chybu. Budou v každé lekci, proto je admin a report diagnostiky nesmí počítat do „nejčastějších chyb“ (zobrazit odděleně jako „detektivní dovednost“).

| kód | popis | kdy použít |
|---|---|---|
| `oznacil-radek-pred-chybou` | V detektivní úloze označil jako chybný řádek **před** Petrovou chybou (ten je správně). Nevidí, co se v řádku stalo, nebo sám nezná pravidlo. | `k1` detektiva, dlaždice řádků **před** chybou |
| `nasel-az-dusledek` | Poznal, že výsledek nesedí, ale ukázal na řádek **za** chybou, ne na místo, kde vznikla. Chybu tuší, neumí ji vystopovat. | `k1` detektiva, dlaždice řádků **za** chybou |

Konkrétní matematická chyba Petra se u detektiva zapisuje do `k2` a `final` normálním kódem z ostatních oddílů.

## C. Celá čísla (kapitola `cela-cisla`, P2) — připraveno pro autora úloh

| kód | popis | příklad (špatně → správně) |
|---|---|---|
| `minus-krat-minus` | Součin/podíl dvou záporných dal záporný. Pozn. (R32): u $a - b \cdot (-c)$ dává stejné číslo i `odcitani-zaporneho`; zapisuj `minus-krat-minus`. | $(-3) \cdot (-4) = -12$ → $12$ |
| `plus-krat-minus` | Součin kladného a záporného dal kladný. | $3 \cdot (-4) = 12$ → $-12$ |
| `pravidlo-znamenek-pri-scitani` | Použil „mínus a mínus dává plus“ u sčítání. | $-3 + (-4) = 7$ → $-7$ |
| `odcitani-zaporneho` | Odečtení záporného čísla počítal jako odečtení kladného. | $5 - (-3) = 2$ → $8$ |
| `posun-spatnym-smerem` | Na teploměru / číselné ose se posunul opačným směrem, než měl (přičítání doleva, odčítání doprava). Použito v P2. | $-6 + 2 = -8$ → $-4$; $-3 - 5 = 2$ → $-8$ |
| `mensi-minus-vetsi` | Od menšího odečetl větší a zapomněl minus (otočil pořadí). | $3 - 8 = 5$ → $-5$ |
| `ztratil-znamenko` | Postup správně, ale výsledek napsal bez minus. | $-2 \cdot 6 = 12$ → $-12$ |
| `znamenko-pred-zavorkou` | Minus před závorkou změnil jen u prvního členu (nebo u žádného). I u výrazů: $5 - (x - 2) = 5 - x - 2$ místo $5 - x + 2$. | $10 - (4 - 1) = 10 - 4 - 1 = 5$ → $7$ |
| `mocnina-zaporneho-bez-zavorky` | U $-a^2$ umocnil i minus. | $-5^2 = 25$ → $-25$ |
| `zaporna-mocnina-v-zavorce` | U $(-a)^2$ nechal výsledek záporný. | $(-5)^2 = -25$ → $25$ |
| `porovnani-zapornych` | Záporné číslo s větší absolutní hodnotou považuje za větší. | $-7 > -3$ → $-7 < -3$ |
| `absolutni-hodnota-zaporna` | Absolutní hodnotu záporného čísla nechal zápornou. | $\lvert -4 \rvert = -4$ → $4$ |

## D. Zlomky (kapitola `zlomky`, P3 a P4) — připraveno pro autora úloh

### D1 Základ (P3)
| kód | popis | příklad (špatně → správně) |
|---|---|---|
| `scital-citatele-i-jmenovatele` | Sečetl/odečetl zvlášť čitatele a zvlášť jmenovatele. | $\frac12 + \frac13 = \frac25$ → $\frac56$ |
| `neprepocital-citatel` | Našel společného jmenovatele, ale čitatele nerozšířil. | $\frac12 + \frac13 = \frac{1+1}{6} = \frac26$ → $\frac56$ |
| `nezkratil` | Výsledek správně, ale ne v základním tvaru. (V JSON **nepoužívat** u kroku s `kontrola_tvaru`, řeší to hláška.) | $\frac{6}{8}$ → $\frac34$ |
| `upravil-jen-cast-zlomku` | Při krácení nebo rozšiřování vydělil/vynásobil **jen čitatel, nebo jen jmenovatel**. Jeden kód pro krácení i rozšiřování a pro obě strany zlomku (stejná chyba v myšlení; nezakládej `kratil-jen-citatel`, `rozsiril-jen-jmenovatel` apod.). Použito v P3. | krácení $\frac68 = \frac38$ → $\frac34$; rozšíření $\frac{3}{10} = \frac{3}{20}$ → $\frac{6}{20}$; $\frac23 = \frac63$ → $\frac69$ |
| `pricetl-misto-nasobeni` | Při krácení nebo rozšiřování přičetl/odečetl stejné číslo u čitatele i jmenovatele, místo aby násobil/dělil. Použito v P3. | $\frac68 = \frac46$ → $\frac34$; $\frac{3}{10} = \frac{13}{20}$ → $\frac{6}{20}$ |
| `kratil-ruznym-cislem` | Čitatele a jmenovatele vydělil **dvěma různými čísly (obě různá od 1)**. Když jednu část nechal beze změny, je to `upravil-jen-cast-zlomku`. | $\frac{6}{9} = \frac{3}{3}$ → $\frac23$ |
| `kratil-jen-castecne` | Krátil, ale ne největším společným dělitelem, a skončil. | $\frac{12}{18} = \frac{6}{9}$ → $\frac23$ |
| `kratil-pres-scitani` | Krátil jednotlivé sčítance, ne celý čitatel. | $\frac{4 + 2}{4} = 2$ → $\frac32$ |
| `cele-cislo-do-citatele-i-jmenovatele` | Celé číslo násobil s čitatelem i jmenovatelem. | $2 \cdot \frac35 = \frac{6}{10}$ → $\frac65$ |
| `desetinne-jako-zlomek-spatne` | Chybný převod desetinného čísla na zlomek (nebo naopak). | $0{,}3 = \frac13$ → $\frac{3}{10}$ |
| `porovnal-podle-jmenovatele` | Větší jmenovatel = větší zlomek. | $\frac15 > \frac13$ → $\frac15 < \frac13$ |

### D2 Složitější (P4)
| kód | popis | příklad (špatně → správně) |
|---|---|---|
| `delil-bez-prevraceni` | Dělil čitatel čitatelem a jmenovatel jmenovatelem, i když to nevychází, nebo násobil bez převrácení. | $\frac23 : \frac45 = \frac{8}{15}$ → $\frac{10}{12} = \frac56$ |
| `prevratil-prvni` | Při dělení převrátil první zlomek (dělence) místo druhého. | $\frac23 : \frac45 = \frac32 \cdot \frac45 = \frac65$ → $\frac56$ |
| `prevratil-oba` | Při dělení převrátil oba zlomky (dělence i dělitele). Použito v P4-U2 k2. | $\frac56 : \frac54 = \frac65 \cdot \frac45 = \frac{24}{25}$ → $\frac56 \cdot \frac45 = \frac23$ |
| `spolecny-jmenovatel-pri-nasobeni` | Při násobení hledal společného jmenovatele a jmenovatele pak nenásobil. | $\frac12 \cdot \frac13 = \frac{3 \cdot 2}{6} = 1$ → $\frac16$ |
| `mocnina-jen-citatele` | Umocnil jen čitatel (nebo jen jmenovatel). | $\left(\frac23\right)^2 = \frac43$ → $\frac49$ |
| `slozeny-zlomek-prevratil-horni` | U složeného zlomku převrátil horní zlomek místo dolního. | $\dfrac{\frac12}{\frac34} = 2 \cdot \frac34$ → $\frac12 \cdot \frac43 = \frac23$ |
| `smisene-scital-celou-cast` | Při převodu smíšeného čísla přičetl celou část k čitateli (nenásobil jmenovatelem). | $3\frac12 = \frac42$ → $\frac72$ |
| `smisene-zmenil-jmenovatel` | Při převodu smíšeného čísla změnil jmenovatel. | $2\frac13 = \frac{7}{6}$ → $\frac73$ |
| `smisene-nasobil-po-castech` | Smíšená čísla násobil po částech (celé × celé, zlomek × zlomek). | $2\frac12 \cdot 2\frac12 = 4\frac14$ → $6\frac14$ |
| `znamenko-zlomku` | Ztratil nebo přesunul minus u zlomku. | $-\frac{1}{2} \cdot 4 = 2$ → $-2$ |

Pořadí operací ve zlomkových výrazech (P4) používá kódy z oddílu A (`scital-pred-nasobenim`, `ignoroval-zavorku`, …), nevytvářej pro zlomky vlastní variantu.

---

# Fáze 1

Kódy z pilotu (oddíly A–D) platí dál; nový kód zakládej jen tam, kde žádný existující chybu nepopisuje. Pod každým oddílem je seznam kódů z A–D, které se v tématu použijí taky.

## E. Mocniny a odmocniny (T1-L1, T1-L2; `pocetni-operace`, `cela-cisla`)
Použij i: `mocnina-jako-dvojnasobek`, `nasobil-pred-mocninou`, `mocnina-na-cely-vyraz`, `zapomnel-odmocninu`, `odmocnina-jako-deleni-dvema`, `odmocnina-jen-z-casti`, `odmocnina-po-clenech` (A); `mocnina-zaporneho-bez-zavorky`, `zaporna-mocnina-v-zavorce` (C).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `odmocnil-pred-vypoctem-pod-ni` | Odmocnil dřív, než spočítal celý výraz pod odmocninou: odmocnil jen číslo, které viděl první. | $\sqrt{10^2 - 19} = 10 - 19 = -9$ → $\sqrt{81} = 9$ | T1-L1; `poradi` |
| `dosadil-zaporne-bez-zavorky` | Při dosazení záporného čísla vynechal závorku, mocnina pak „spolkla“ minus. | $a^2$ pro $a = -3$: $-3^2 = -9$ → $(-3)^2 = 9$ | T1-L2 |
| `odmocnil-jen-citatel` | U zlomku odmocnil (umocnil) jen horní číslo. | $\sqrt{\frac{9}{16}} = \frac{3}{16}$ → $\frac{3}{4}$ | T1-L1, T2-L2 |
| `mocnina-desetinneho-carka` | U mocniny desetinného čísla špatně umístil čárku. | $0{,}3^2 = 0{,}9$ → $0{,}09$ | T1-L4, T3 |
| `mocnina-po-clenech` | Umocnil každý „kus“ čísla zvlášť (desítky a jednotky) a sečetl. (Obdoba `odmocnina-po-clenech`.) | $16^2 = 10^2 + 6^2 = 136$ → $256$ | T1-L1 |
| `zamenil-mocninu-a-odmocninu` | Místo mocniny spočítal odmocninu, nebo naopak. (Jiné než `mocnina-jako-dvojnasobek` a `odmocnina-jako-deleni-dvema`: tady dítě zná obě operace, jen je prohodí.) | $16^2 = 4$ → $256$; $\sqrt{64} = 4096$ → $8$ | T1-L1 |

## F. Dělitelnost a prvočísla (T1-L3; `pocetni-operace`)

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `jednicka-je-prvocislo` | Počítá 1 mezi prvočísla. | „prvočísla do 10: 1, 2, 3, 5, 7“ → 2, 3, 5, 7 | T1-L3 |
| `liche-je-prvocislo` | Liché složené číslo považuje za prvočíslo. | „51 je prvočíslo“ → $51 = 3 \cdot 17$ | T1-L3 |
| `rozklad-neuplny` | V rozkladu na prvočísla nechal složené číslo. | $231 = 3 \cdot 77$ → $3 \cdot 7 \cdot 11$ | T1-L3 |
| `rozklad-bez-opakovani` | Opakované prvočíslo napsal v rozkladu jen jednou. (Jiné než `rozklad-neuplny`: v rozkladu nejsou složená čísla, jen chybí opakování.) | $60 = 2 \cdot 3 \cdot 5$ → $2 \cdot 2 \cdot 3 \cdot 5$ | T1-L3 |
| `prehledl-dvojciferny` | Hledá největší dvojciferný dělitel, ale vezme největší součin prvočísel z rozkladu, i když není dvojciferný. (Jiné než `prvocislo-misto-delitele`: tam napíše samotné prvočíslo.) | $357 = 3 \cdot 7 \cdot 17$: napíše $7 \cdot 17 = 119$ → $3 \cdot 17 = 51$ | T1-L3 |
| `prvocislo-misto-delitele` | Místo největšího (dvojciferného) dělitele napsal největší prvočíslo z rozkladu. | u 154 napíše 11 → 77 ($154 = 2 \cdot 7 \cdot 11$) | T1-L3 |
| `vynechal-delitel` | Ve výčtu dělitelů chybí 1, číslo samo nebo jeden z dvojice. | dělitelé 12: 2, 3, 4, 6 → 1, 2, 3, 4, 6, 12 | T1-L3 |
| `delitel-nasobek-zamena` | Zaměnil dělitele a násobky. | dělitelé 6: 12, 18, 24 → 1, 2, 3, 6 | T1-L3 |
| `delitelnost-3-podle-posledni-cislice` | O dělitelnosti třemi rozhoduje podle poslední číslice, ne podle ciferného součtu. | „23 končí trojkou, je dělitelné třemi“ → není | T1-L3 |
| `nsd-nsn-zamena` | Zaměnil největšího společného dělitele a nejmenší společný násobek. | NSD(12, 18) = 36 → 6 | T1-L3 |

## G. Znaménka v delším výrazu (T1-L4; `cela-cisla`)
Použij i: celý oddíl C a `scital-pred-nasobenim`, `ignoroval-zavorku` (A).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `znamenko-soucinu-vice-cinitelu` | U součinu tří a více činitelů určil znaménko jen podle prvních dvou. | $(-2) \cdot (-3) \cdot (-1) = 6$ → $-6$ | T1-L4 |
| `ztratil-znamenko-v-mezikroku` | V mezivýsledku zapomněl minus a počítal dál s kladným číslem. | $0{,}5 \cdot (-0{,}04) - 2 = 0{,}02 - 2 = -1{,}98$ → $-2{,}02$ | T1-L4 |
| `carka-pri-nasobeni` | Při násobení desetinných čísel umístil čárku podle jednoho činitele, nebo čárku vynechal. | $0{,}5 \cdot 0{,}04 = 0{,}2$ → $0{,}02$; $0{,}7 \cdot 1{,}1 = 77$ → $0{,}77$ | T1-L4, T3-L1, T3-L2 |

## H. Zlomek z čísla a ze zbytku (T2-L1; `zlomky`)

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `z-celku-misto-ze-zbytku` | Počítal zlomek z celku, i když zadání říká „ze zbytku“. | stuha 300 cm, čtvrtina pryč, pak $\frac{2}{5}$ zbytku: $\frac{2}{5}$ z 300 = 120 → $\frac{2}{5}$ z 225 = 90 | T2-L1 |
| `zamenil-cast-a-zbytek` | Zaměnil odebranou část a zbytek: odpověděl částí místo zbytku (nebo naopak), nebo vzal odebranou část jako základ dalšího zlomku. | „Kolik zbylo?“ ze 300 odstřihl 75: odpoví 75 → 225 | T2-L1, T4 |
| `zlomek-z-cisla-jen-deleni` | Vydělil jmenovatelem a zapomněl vynásobit čitatelem. | $\frac{2}{5}$ z 30 = 6 → 12 | T2-L1 |
| `zlomek-z-cisla-obracene` | Vydělil čitatelem a vynásobil jmenovatelem. | $\frac{2}{5}$ z 30 = 30 : 2 · 5 = 75 → 12 | T2-L1, T4-L4 |
| `secetl-zlomky-ruznych-celku` | Sečetl zlomky, které se vztahují k různým celkům (celek a zbytek). | $\frac{1}{4} + \frac{2}{5} = \frac{13}{20}$ celku → $\frac{1}{4} + \frac{2}{5} \cdot \frac{3}{4} = \frac{11}{20}$ | T2-L1 |

## I. Smíšená čísla (T2-L2; `zlomky`)
Použij i: `smisene-scital-celou-cast`, `smisene-zmenil-jmenovatel`, `smisene-nasobil-po-castech` (D2), `odmocnil-jen-citatel` (E).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `smisene-zpet-spatne` | Nepravý zlomek převedl zpět na smíšené číslo chybně (zbytek dal do jmenovatele). | $\frac{17}{4} = 4\frac{1}{17}$ → $4\frac{1}{4}$ | T2-L2 |
| `smisene-odcitani-po-castech` | Smíšená čísla odečetl po částech a u zlomků odečetl menší od většího. | $3\frac{1}{4} - 1\frac{3}{4} = 2\frac{2}{4}$ → $1\frac{1}{2}$ | T2-L2 |
| `smisene-jako-soucin` | Smíšené číslo bere jako součin celé části a zlomku. | $2\frac{1}{3} = \frac{2}{3}$ → $\frac{7}{3}$ | T2-L2 |

Dlouhý zlomkový výraz (T2-L3) používá kódy z A a D, nový oddíl nemá.

## J. O třetinu víc, o třetinu míň (T2-L4; `zlomky`)
Stejná myšlenka s procenty (T4-L4) patří do oddílu N; kódy se tvoří obdobně (`o-procenta-z-vysledku`).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `o-tretinu-z-vysledku` | „X je o třetinu větší než Y“ počítá třetinu z X místo z Y. Platí i pro procenta: „20 kg je o 25 % víc než X“ počítá 25 % z 20 (vyjde 15 místo 16). | větší sud 360 l je o třetinu větší než menší: $360 - 120 = 240$ → $360 : \frac{4}{3} = 270$ | T2-L4, T4-L4 |
| `jen-cast-bez-celku` | Spočítal jen tu část (třetinu, desetinu…) a zapomněl ji přičíst nebo odečíst. U procent: „o 25 % víc“ počítá jako „25 %“. | o třetinu víc než 270: 90 → 360; o desetinu delší než 7 m: $0{,}7$ m → $7{,}7$ m | T2-L4, T3-L1, T4-L3, T4-L4 |
| `o-tretinu-jako-trikrat` | „O třetinu víc“ počítá jako trojnásobek. | o třetinu víc než 270: 810 → 360 | T2-L4 |
| `o-tretinu-min-jako-tretina` | „O třetinu míň“ počítá jako třetinu z čísla. | o třetinu míň než 90: 30 → 60 | T2-L4 |

## K. Kódy pro vstup `poradi` (kliknutí na operace; T1-L1, L2, L4, T2-L3, T6-L1, T8-L1)
`zname_chyby` u `poradi` je celé pořadí; kód popisuje, jakou přednost dítě porušilo. Jiné špatné pořadí = „zatím nesedí“ bez kódu.

| kód | kdy (pořadí, které ho dává) | příklad |
|---|---|---|
| `scital-pred-nasobenim` (A) | plus nebo mínus klikne dřív než krát nebo děleno | $5 + 3 \cdot 4$: nejdřív $+$ |
| `nasobil-pred-mocninou` (A) | krát klikne dřív než mocninu u téhož čísla | $9 \cdot 7^2$: nejdřív $\cdot$ |
| `ignoroval-zavorku` (A) | operaci mimo závorku klikne dřív než operaci v závorce | $2 \cdot (1 + 2)$: nejdřív $\cdot$ |
| `odmocnil-pred-vypoctem-pod-ni` (E) | odmocninu klikne dřív než operace pod ní | $\sqrt{10^2 - 19}$: nejdřív $\sqrt{\ }$ |
| `neslo-zleva` | u operací se stejnou předností nepostupuje zleva | $12 : 4 \cdot 3$: nejdřív $\cdot$ (vyjde 1 místo 9) |

---

Oddíly níže jsou připravené hlavičky. **Kódy doplní autor úloh (a zkontroluje metodik) před výrobou daného týdne**, validátor seedu jiné kódy než ze slovníku nepustí.

## L. Desetinná čísla (T3-L1, T3-L2; `desetinna-cisla`)
Použij i: `carka-pri-nasobeni` (G, čárka při násobení dvou desetinných čísel), `mocnina-desetinneho-carka` (E), `desetinne-jako-zlomek-spatne` (D1, obecný chybný převod: $0{,}3 = \frac{1}{3}$, $0{,}25 = \frac{25}{10}$), `porovnani-zapornych` (C, i u záporných desetinných čísel), znaménkové kódy z C a G.

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `carka-pri-deleni` | Při dělení desetinným číslem neposunul čárku u dělence i dělitele stejně. (Doplněk `carka-pri-nasobeni`.) | $2{,}4 : 0{,}3 = 0{,}8$ → $8$ | T3-L1 |
| `carka-scitani-pod-sebe` | Při sčítání nebo odčítání zarovnal čísla podle poslední číslice, ne podle čárky. | $3{,}5 + 1{,}25 = 1{,}60$ → $4{,}75$ | T3-L1 |
| `posun-carky-spatnym-smerem` | Při násobení nebo dělení 10, 100, 1 000 posunul čárku opačným směrem. | $4{,}2 \cdot 100 = 0{,}042$ → $420$ | T3-L1 |
| `posun-carky-o-spatny-pocet` | Posunul čárku správným směrem, ale o jiný počet míst, než má nul. I u převodu jednotek: obsah nebo objem převedl jiným převodním číslem (1 000 nebo 10 000 místo 100), směr má správně. | $0{,}07 \cdot 100 = 0{,}7$ → $7$ | T3-L1, T5-L1, T5-L2 |
| `pripsal-nuly-k-desetinnemu` | Násobení 10 nebo 100 „vyřešil“ připsáním nul za desetinné číslo. | $2{,}5 \cdot 10 = 2{,}50$ → $25$ | T3-L1 |
| `o-desetinu-jako-pricist-0-1` | „O desetinu víc“ počítal jako přičtení $0{,}1$, ne desetiny z čísla. | hod 7 m, o desetinu delší: $7{,}1$ m → $7{,}7$ m | T3-L1 |
| `zlomek-jako-cislice-s-carkou` | Převod zlomek ↔ desetinné číslo „po číslicích“: čitatel a jmenovatel oddělil čárkou, nebo naopak z čísel před a za čárkou udělal zlomek. | $\frac{1}{4} = 1{,}4$ → $0{,}25$; $4{,}5 = \frac{4}{5}$ → $\frac{9}{2}$ | T3-L2 |
| `zlomek-na-desetinne-nepresne` | Zlomek, který desetinně nekončí (třetiny, devítiny…), nahradil zkráceným desetinným číslem a počítal s ním jako s přesnou hodnotou. | $\frac{1}{3} \cdot 6 = 0{,}33 \cdot 6 = 1{,}98$ → $2$ | T3-L2 |
| `cast-z-prvniho-misto-predchoziho` | U opakovaného „o desetinu / třetinu / 10 % víc než předchozí“ bere část pořád z prvního čísla. | hod 7 m, každý o desetinu delší než předchozí, třetí: $8{,}4$ m → $8{,}47$ m | T3-L1, později procenta |
| `zaokrouhlil-useknutim` | Zaokrouhlil useknutím, nerozhodl podle další číslice. | $3{,}47$ na desetiny: $3{,}4$ → $3{,}5$ | T3-L1, L2 |
| `zaokrouhlil-na-spatny-rad` | Zaokrouhlil na jiný řád, než chce zadání (desetiny místo setin apod.). | $3{,}476$ na setiny: $3{,}5$ → $3{,}48$ | T3-L1, L2 |
| `porovnani-desetinnych-podle-delky` | Desetinné číslo s víc číslicemi za čárkou považuje za větší. | $0{,}125 > 0{,}5$ → $0{,}125 < 0{,}5$ | T3-L2 |

## M. Poměr (T3-L3, T3-L4; `pomer`)
Použij i: `kratil-ruznym-cislem` a `kratil-jen-castecne` (D1, i u krácení poměru), `kolikrat-jako-o-kolik` (A).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `pomer-nezkraceny` | Poměr nechal v nezákladním tvaru, i když zadání chce základní. | $12 : 18$ → $2 : 3$ | T3-L3 |
| `pomer-prevraceny` | Zapsal poměr v opačném pořadí, než určuje věta („A ku B“). | chlapců 12, dívek 18, poměr chlapců k dívkám: $3 : 2$ → $2 : 3$ | T3-L3 |
| `pomer-jako-hodnoty` | Členy poměru bere přímo jako hledaná čísla. | čísla v poměru $4 : 5$, dvojnásobky se liší o 6: menší je $4$ → $12$ | T3-L3 |
| `deleni-v-pomeru-bez-souctu-dilu` | Při dělení celku v poměru nedělil součtem dílů (dělil počtem členů nebo jedním členem). | 60 v poměru $2 : 3$: $60 : 2 = 30$ → díl $60 : 5 = 12$, části $24$ a $36$ | T3-L3 |
| `deleni-v-pomeru-prohodil` | Části spočítal správně, ale přiřadil je obráceně. | 60 v poměru $2 : 3$ (Anna : Petr): Anna $36$ → $24$ | T3-L3 |
| `prehledl-nasobek-v-zadani` | Přehlédl, že se podmínka týká násobků čísel (dvojnásobky, trojnásobky), a počítal s čísly samotnými. | $4 : 5$, dvojnásobky se liší o 6: díl $6$, menší $24$ → díl $3$, menší $12$ | T3-L3 |
| `prima-jako-neprima` | U přímé úměry počítal „víc → míň“. | 3 rohlíky za 12 Kč, 6 rohlíků: $6$ Kč → $24$ Kč | T3-L4 |
| `neprima-jako-prima` | U nepřímé úměry počítal „víc → víc“. | 3 dělníci 12 dní, 6 dělníků: $24$ dní → $6$ dní | T3-L4 |
| `umera-jako-soucet` | Místo násobení nebo dělení přičetl rozdíl („o kolik víc“). | 3 rohlíky za 12 Kč, 5 rohlíků: $12 + 2 = 14$ Kč → $20$ Kč | T3-L4 |

Vstupy T3: kroky `poradi` v osnově T3 nejsou (§6.1) a nový vstup T3 nepotřebuje. **Poměr nemá vlastní vstup:** zápis poměru (T3-L3) se zadává jako dlaždice (rozcvička, `k1`) nebo jako dva kroky `cislo` („Mezivýsledek: první člen“, „Druhý člen“); `final` je vždy číslo.

## N. Procenta (T4, T8-L2; `procenta`)
Použij i: `zamenil-cast-a-zbytek` (H, odpověď částí místo zbytku, i procento druhé části), `zlomek-z-cisla-obracene` (H, obrácený směr „šestkrát“ / „pětkrát“), `o-tretinu-z-vysledku` (J, i „o 25 % víc“ při zpětném výpočtu), `jen-cast-bez-celku` (J, „o 25 %“ počítané jako „25 %“), `cast-z-prvniho-misto-predchoziho` (L, opakované zdražení), `kolikrat-jako-o-kolik` a `o-kolik-jako-kolikrat` (A, „o 50 % víc“ vs. „150 %“), `posun-carky-spatnym-smerem` a `posun-carky-o-spatny-pocet` (L, dělení stem).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `procento-jako-desetina` | 1 % počítá jako desetinu (dělí deseti místo stem). | 46 % z 50: $50 : 10 \cdot 46 = 230$ → $23$ | T4-L1 |
| `procento-jako-cislo` | Procenta bere jako hotové číslo: odpoví počtem procent, nebo je jako koruny či kusy přičte k celku nebo odečte od celku. I obráceně: počet kusů napíše jako procenta. | odsypáno 46 % z 50 hrnků, kolik zbývá: $50 - 46 = 4$ (nebo $46$) → $27$; o 10 % dražší než 300 Kč: $310$ → $330$; 40 dívek z 50: $40\,\%$ → $80\,\%$ | T4-L1, L2, L3, L4 |
| `spatny-zaklad` | Za základ (100 %) vzal jinou veličinu, než určuje zadání (zbytek, část, novou cenu). | celek 360 Kč, prvňák platí 90 Kč, škola 270 Kč; kolik % platí prvňák: $90 : 270 \approx 33\,\%$ → $25\,\%$ | T4-L2, T8-L2 |
| `vysledek-bez-prevodu-na-procenta` | Podíl část : celek nechal jako desetinné číslo a nepřevedl na procenta. | $90 : 360 = 0{,}25$, odpověď „0,25 %“ → $25\,\%$ | T4-L2 |
| `zdrazeni-sleva-zamena` | Zdražení počítal jako slevu (odečetl), nebo slevu jako zdražení. | čaj 40 Kč, punč o 75 % dražší: $40 - 30 = 10$ Kč → $70$ Kč | T4-L3 |
| `postupne-procenta-secetl` | Dvě po sobě jdoucí změny o procenta sečetl, jako by obě byly z původní hodnoty. | 100 Kč zdraženo o 10 % a pak ještě o 10 %: $120$ Kč → $121$ Kč | T4-L3 |
| `sleva-a-zdrazeni-se-vyrusi` | Myslí si, že zdražení a pak sleva o stejná procenta vrátí původní cenu. | 100 Kč o 20 % dražší, pak o 20 % levnější: $100$ Kč → $96$ Kč | T4-L3 |

## O. Jednotky (T5-L1 až L3; `jednotky`)
Použij i: `posun-carky-spatnym-smerem` (L), `posun-carky-o-spatny-pocet` (L, i obsah nebo objem převedený jiným převodním číslem, např. 1 000 místo 100; nový kód se nezakládá), `odpovida-na-jinou-otazku` (P, uběhlá část hodiny místo zbývající).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `obsah-po-desitkach` | U jednotek obsahu převádí po 10 místo po 100 mezi sousedními jednotkami. | $0{,}1\ \text{m}^2 = 10\ \text{cm}^2$ → $1\,000\ \text{cm}^2$ | T5-L1 |
| `delka-po-stovkach` | U jednotek délky převádí po 100 (jako u obsahu) místo po 10 mezi sousedními jednotkami. (Opak `obsah-po-desitkach`.) | $2\ \text{dm} = 200\ \text{cm}$ → $20\ \text{cm}$ | T5-L1 |
| `objem-po-desitkach-nebo-stovkach` | U jednotek objemu převádí po 10 nebo po 100 místo po 1 000. | $2\ \text{dm}^3 = 200\ \text{cm}^3$ → $2\,000\ \text{cm}^3$ | T5-L2 |
| `litr-zamena` | Zaměnil, čemu se rovná litr (1 l = 1 cm³ nebo 1 m³ místo 1 dm³). | $1\,500\ \text{cm}^3 = 1\,500$ l → $1{,}5$ l | T5-L2 |
| `prevod-spatnym-smerem` | Na menší jednotku převádí dělením, na větší násobením (volba směru, ne posun čárky). | $3\ \text{m} = 0{,}03\ \text{cm}$ → $300\ \text{cm}$ | T5-L1, L2 |
| `zapomnel-prevest-jednotky` | Počítal s čísly v různých jednotkách bez převodu na stejnou jednotku. | dno 1 500 cm², hladina +10 mm: $1\,500 \cdot 10 = 15\,000\ \text{cm}^3$ → $1\,500\ \text{cm}^3 = 1{,}5$ l | T5-L1, L2 |
| `cas-po-stovkach` | S časem počítá po 100, ne po 60 (přechod přes celou hodinu). | 7:44 + 38 min = 7:82 → 8:22 | T5-L3 |
| `cas-desetinne-jako-minuty` | Desetinnou část hodiny bere jako minuty. I obráceně: minuty zapíše jako desetinnou část hodiny (1 h 24 min = 1,24 h místo 1,4 h). | $1{,}5$ h = 1 h 50 min → 1 h 30 min; $0{,}25$ h = 25 min → 15 min | T5-L3, T5-L4 |
| `jednotka-ve-vysledku-spatne` | Výsledek spočítal dobře, ale uvedl ho v jiné jednotce, než chce zadání. | „kolik litrů?“: $1\,500$ (ml) → $1{,}5$ l | T5-L1 až L3 |

## P. Slovní úlohy (T5-L4, T8-L4; `slovni-ulohy`)
Použij i: `deleni-obracene` (A, „za 1 minutu“ spočítané obráceně), `cas-desetinne-jako-minuty` (O), `zapomnel-prevest-jednotky` (O), `prima-jako-neprima` a `umera-jako-soucet` (M).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `vzorec-v-s-t-zamena` | Ve vztahu dráha = rychlost · čas zaměnil, co se násobí a co dělí. | 60 km/h po dobu 2 h: $60 : 2 = 30$ km → $120$ km | T5-L4 |
| `min-a-h-smichane` | Dosadil minuty do rychlosti v km/h (nebo hodiny do km/min) bez převodu. | 60 km/h po dobu 30 min: $60 \cdot 30 = 1\,800$ km → $30$ km | T5-L4 |
| `prumerna-rychlost-jako-prumer` | Průměrnou rychlost spočítal jako průměr rychlostí, i když úseky trvaly různě dlouho. | tam 60 km/h, zpět 40 km/h po stejné cestě: $50$ km/h → $48$ km/h | T5-L4 |
| `setkani-rychlosti-zamena` | U pohybu proti sobě rychlosti odečetl (nebo při dohánění sečetl). | vlaky proti sobě 60 a 40 km/h, vzdálenost 200 km: $200 : 20 = 10$ h → $200 : 100 = 2$ h | T5-L4, T8-L4 |
| `odpovida-na-jinou-otazku` | Spočítal mezivýsledek a odpověděl jím, ne tím, na co se zadání ptá (doba místo času příjezdu, část místo celku). Také: odpověděl na jinou veličinu, než se ptá krok (mezivýsledek jiné cesty). | vyrazí v 8:00, jede 60 min, „kdy dorazí?“: $60$ min → 9:00 | T5-L4, T8-L4, T4-L2, T5-L3 |
| `prehledl-udaj` | Nepoužil jeden z údajů zadání (pauzu, výchozí stav, podmínku). | jízda 7 h od 7:44 s pauzou 38 min: cíl 14:44 → 15:22 | T5-L3, L4, T8-L4 |
| `pocital-se-vsemi-cisly` | Sečetl nebo vynásobil všechna čísla ze zadání bez rozmyslu, co znamenají. | „10 km za 50 min, kolik km za 20 min?“: $10 + 50 + 20 = 80$ → $4$ km | T5-L4, T8-L4 |
| `soucet-misto-soucinu` | Úlohu s podmínkou stejného součinu řešil jako se stejným součtem: čísla doplnil tak, aby se rovnaly součty. | součin na stranách stejný, dané $10$, $6$, $4$, $2$: doplní $4$ a $12$ (součty $20$) → $3$ a $15$ (součiny $180$) | F2-T10-L3 |

## Q. Výrazy (T6-L1, T6-L2; `vyrazy`)
Porovnávají se jako výrazy (vstup `vyraz`, SABLONA §15). Použij i: `mocnina-jako-dvojnasobek` (A, i $x \cdot x = 2x$), `znamenko-pred-zavorkou` (C, i $5 - (x - 2)$), `scital-pred-nasobenim` (A), `minus-krat-minus`, `plus-krat-minus` (C).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `scital-nestejne-cleny` | Sloučil členy s různou proměnnou nebo různou mocninou (i číslo s proměnnou). | $3x + 2 = 5x$ (nejde sloučit); $2x + x^2 = 3x^2$ (nejde sloučit) | T6-L1 |
| `x-jako-nula` | Samotné $x$ bere jako $0x$ nebo ho při slučování vynechá (nevidí u něj koeficient 1). | $5x - x = 5x$ → $4x$ | T6-L1 |
| `roznasobil-jen-prvni-clen` | Číslem (nebo výrazem) před závorkou vynásobil jen první člen v závorce. | $3(x + 2) = 3x + 2$ → $3x + 6$ | T6-L1, T6-L3 |
| `vytknul-neuplne` | Nevytkl největší společný činitel (vytkl jen číslo, jen proměnnou, nebo jen z části členů). | $4x^2 + 2x = 2(2x^2 + x)$ → $2x(2x + 1)$; $6x + 9 = 3(2x + 9)$ → $3(2x + 3)$ | T6-L2 |
| `vytknuti-ztratil-jednicku` | Když vytkl celý člen, nechal v závorce místo něj nulu nebo nic. | $3x + 3 = 3(x)$ → $3(x + 1)$ | T6-L2 |
| `vytknuti-minus-znamenka` | Při vytknutí záporného čísla nezměnil znaménka v závorce. | $-2x + 6 = -2(x + 3)$ → $-2(x - 3)$ | T6-L2 |
| `vytknuti-nechal-promennou` | Při dělení členu vytýkaným výrazem vydělil jen číslo a proměnnou v závorce nechal. | $9x : (-3x) = -3x$ → $-3$; z členu $-x$ po vytknutí $(-x)$ zůstane $x$ → $1$ | T6-L2 |
| `vytkl-bez-minusu` | Zadání chce vytknout záporný výraz, dítě vytklo kladný (rozklad sedí, ale není to, co úloha chtěla). | vytkni $(-2x)$: $-8x^2 + 2x = 2x(1 - 4x)$ → $-2x(4x - 1)$ | T6-L2 |

## R. Rovnice (T6-L3, T6-L4, T8-L3; `rovnice`)
Použij i: `roznasobil-jen-prvni-clen` (Q), `znamenko-pred-zavorkou` (C), `deleni-obracene` (A, $3x = 12$ → $x = \frac{3}{12}$), `odpovida-na-jinou-otazku` (P, u slovní úlohy s rovnicí).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `upravil-jen-jednu-stranu` | Úpravu (přičtení, násobení, dělení) udělal jen na jedné straně rovnice. | $2x = 10$, dělí jen levou stranu: $x = 10$ → $x = 5$ | T6-L3 |
| `prevod-bez-zmeny-znamenka` | Při převodu členu na druhou stranu nezměnil znaménko. | $x + 3 = 10$: $x = 13$ → $x = 7$ | T6-L3, L4 |
| `delil-jen-cast-strany` | Dělil (násobil) jen jeden člen strany, ne celou stranu. | $2x + 6 = 10$ dělí dvěma: $x + 6 = 5$ → $x + 3 = 5$, $x = 2$ | T6-L3 |
| `x-odecetl-koeficient` | Z $ax = b$ odečetl koeficient místo dělení. | $3x = 12$: $x = 12 - 3 = 9$ → $x = 4$ | T6-L3 |
| `zlomky-vynasobil-jen-zlomek` | Při násobení rovnice jmenovatelem vynásobil jen zlomek, ne ostatní členy. | $\frac{x}{2} + 1 = 4$, krát 2: $x + 1 = 8$ → $x + 2 = 8$, $x = 6$ | T6-L3, T8-L3 |
| `vynechal-x-rovna-nula` | Když vyjde $x = 0$, myslí si, že rovnice nemá řešení, nebo výsledek nenapíše. | $5x = 0$: „nemá řešení“ → $x = 0$ | T6-L3 |
| `zamenil-veliciny-v-rovnici` | Při sestavení rovnice ze slov přiřadil číslo ze zadání k jiné veličině. | paušál 600 Kč + 120 Kč za vstup vs. 160 Kč za vstup: $120 + 600x = 160x$ → $600 + 120x = 160x$ | T6-L4, T8-L3 |
| `zapsal-vztah-obracene` | Vztah mezi veličinami ze slov zapsal obráceně: „o 4 mladší“ jako $+4$, „čtyřikrát víc“ jako dělení, „poloviční“ jako $2r$. | Adam má $x$ let a je o 4 roky mladší než Bára: Bára $x - 4$ → $x + 4$; poloviční úsek: $2r$ → $\frac{r}{2}$ | T6-L4, F2-T02-L3 |

## S. Geometrie (T7; `geometrie`, obrázky SABLONA §17)
Použij i: `zapomnel-prevest-jednotky` (O), `obsah-po-desitkach` (O), procentní kódy z N (T7-L3).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `obvod-obsah-zamena` | Spočítal obvod místo obsahu, nebo naopak. | obdélník 10 cm × 24 cm, obsah: $68$ → $240\ \text{cm}^2$ | T7-L1 |
| `obvod-jen-dve-strany` | Obvod obdélníku počítal jako $a + b$ (zapomněl na dvě další strany). | obdélník 10 cm × 24 cm: $34$ cm → $68$ cm | T7-L1 |
| `strana-z-obvodu-bez-poloviny` | Z obvodu obdélníku odečetl známou stranu, ale nevydělil dvěma. | obvod 68 cm, strana 10 cm: $68 - 10 = 58$ → $24$ cm | T7-L1 |
| `trojuhelnik-bez-deleni-dvema` | Obsah trojúhelníku spočítal jako strana krát výška bez dělení dvěma. | $a = 12$, $v = 5$: $60$ → $30$ | T7-L2 |
| `trojuhelnik-deleni-dvema-dvakrat` | Obsah trojúhelníku dělil dvěma dvakrát: vzal už polovinu základny (nebo výšky) a výsledek ještě vydělil dvěma. | základna $18$, výška $12$: $9 \cdot 12 : 2 = 54$ → $18 \cdot 12 : 2 = 108$ | F2-T03-L2 |
| `vyska-jako-strana` | Za výšku vzal šikmou stranu místo kolmé vzdálenosti. | základna 10, šikmá strana 13, výška 12: $\frac{10 \cdot 13}{2} = 65$ → $60$ | T7-L2 |
| `lichobeznik-jedna-zakladna` | U lichoběžníku vzal jen jednu základnu, nebo součet základen nevydělil dvěma. | $a = 12$, $c = 6$, $v = 4$: $12 \cdot 4 = 48$ → $\frac{12 + 6}{2} \cdot 4 = 36$ | T7-L2 |
| `slozeny-utvar-cast-navic` | U složeného útvaru započítal část dvakrát nebo zapomněl odečíst výřez. | pozemek 900 m², dům 180 m², rybníček 18 %: volno $900 - 180 = 720$ → $900 - 180 - 162 = 558\ \text{m}^2$ | T7-L3 |
| `polomer-prumer-zamena` | Dosadil průměr místo poloměru, nebo naopak. | kruh o průměru 10 cm: $S = \pi \cdot 10^2 \approx 314$ → $\pi \cdot 5^2 \approx 78{,}5\ \text{cm}^2$ | T7-L4 |
| `vzorec-kruhu-zamena` | Zaměnil vzorec obvodu a obsahu kruhu ($2\pi r$ a $\pi r^2$). | $r = 5$ cm, obsah: $2\pi \cdot 5 \approx 31{,}4$ → $\pi \cdot 5^2 \approx 78{,}5\ \text{cm}^2$ | T7-L4 |

---

# Fáze 2

Oddíly T–AD. Kódy z Fáze 1 platí dál; kde chyba už kód má, je v řádku „Použij i“ a nový kód se nezakládá. Bloky, rozbory a simulace berou kódy podle kapitoly úlohy.

## T. Vzorce a rozklad (F2-T01-L1 až L3; `vyrazy`, vstup `vyraz`)
Použij i: `roznasobil-jen-prvni-clen`, `scital-nestejne-cleny`, `vytknul-neuplne`, `vytknuti-minus-znamenka` (Q), `znamenko-pred-zavorkou`, `minus-krat-minus` (C), `umocnil-jen-cast-zavorky` (A, i $(2x)^2 = 2x^2$).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `nasobeni-zavorek-vynechal-soucin` | Při násobení dvou závorek „každý s každým“ některý součin vynechal. | $(x + 2)(x + 3) = x^2 + 6$ → $x^2 + 5x + 6$ | F2-T01-L1 |
| `dvojclen-na-druhou-bez-soucinu` | $(a \pm b)^2$ umocnil po členech, bez dvojnásobného součinu. | $(y + 1)^2 = y^2 + 1$ → $y^2 + 2y + 1$ | F2-T01-L2 |
| `dvojnasobny-soucin-bez-dvojky` | Prostřední člen napsal jako $ab$ místo $2ab$. | $(x + 3)^2 = x^2 + 3x + 9$ → $x^2 + 6x + 9$ | F2-T01-L2 |
| `ctverec-rozdilu-znamenko` | U $(a - b)^2$ dal špatné znaménko u $2ab$ nebo u $b^2$. | $(x - 3)^2 = x^2 + 6x + 9$ (nebo $x^2 - 6x - 9$) → $x^2 - 6x + 9$ | F2-T01-L2 |
| `rozdil-ctvercu-jako-ctverec` | Rozdíl čtverců rozložil jako druhou mocninu dvojčlenu. | $k^2 - 144 = (k - 12)^2$ → $(k - 12)(k + 12)$ | F2-T01-L3 |
| `rozklad-souctu-ctvercu` | Rozložil součet čtverců, jako by to byl rozdíl (součet čtverců rozložit nejde). | $x^2 + 9 = (x + 3)(x - 3)$ → nejde rozložit | F2-T01-L3 |
| `vzorec-spatne-a-b` | Ve vzorci špatně určil $a$ a $b$ (vzal koeficient bez odmocnění). | $9x^2 - 25 = (9x - 5)(9x + 5)$ → $(3x - 5)(3x + 5)$ | F2-T01-L3 |

## U. Rovnice se zlomky (F2-T01-L4; `rovnice`)
Použij i: `zlomky-vynasobil-jen-zlomek`, `upravil-jen-jednu-stranu`, `prevod-bez-zmeny-znamenka`, `x-odecetl-koeficient` (R), `deleni-obracene` (A, $3x = 2$ → $x = \frac{3}{2}$), `cele-cislo-do-citatele-i-jmenovatele` a `kratil-pres-scitani` (D1), `zlomek-na-desetinne-nepresne` (L), `nezkratil` (D1).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `minus-pred-zlomkem-bez-zavorky` | Po vynásobení jmenovatelem nedal čitatel za mínusem do závorky. | $x - \frac{x - 2}{3} = 4$, krát 3: $3x - x - 2 = 12$ → $3x - (x - 2) = 12$, $x = 5$ | F2-T01-L4 |
| `nasobil-jen-jednim-jmenovatelem` | Rovnici vynásobil jmenovatelem jednoho zlomku, ne společným jmenovatelem. | $\frac{x}{2} + \frac{x}{3} = 5$, krát 2: $x + x = 10$ → krát 6: $3x + 2x = 30$, $x = 6$ | F2-T01-L4 |

## V. Soustavy rovnic dosazovací metodou (F2-T02-L1, L2; `rovnice`)
Použij i: `prevod-bez-zmeny-znamenka`, `upravil-jen-jednu-stranu` (R), `znamenko-pred-zavorkou` (C), `odpovida-na-jinou-otazku` (P).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `dosadil-vyraz-bez-zavorky` | Dosadil výraz za neznámou bez závorky. | $3x - y$ pro $y = 2x - 9$: $3x - 2x - 9$ → $3x - (2x - 9)$ | F2-T02-L1, L2 |
| `dosadil-do-stejne-rovnice` | Vyjádřenou neznámou dosadil zpět do rovnice, ze které ji vyjádřil (vyjde $0 = 0$). | z $2x - y = 2$ vyjádří $y = 2x - 2$ a dosadí zase do $2x - y = 2$ → do druhé rovnice | F2-T02-L2 |
| `vyjadril-bez-deleni-koeficientem` | Při vyjádření neznámé nevydělil koeficientem. | $2x = y + 2$: $x = y + 2$ → $x = \frac{y + 2}{2}$ | F2-T02-L2 |
| `dopocital-jen-jednu-neznamou` | Našel jednu neznámou a druhou už nedopočítal. | odpoví jen $x = 2$ → $x = 2$, $y = -5$ | F2-T02-L1, L2 |
| `zamenil-x-a-y` | Hodnoty neznámých zapsal prohozené. | $x = -5$, $y = 2$ → $x = 2$, $y = -5$ | F2-T02-L1, L2 |
| `vyjadril-neznamou-se-zlomkem` | Vyjadřuje neznámou, před kterou je číslo (vyjde zlomek), i když v druhé rovnici stojí neznámá bez čísla a jde vyjádřit bez zlomku. Výsledek bývá správný, ale cesta je zbytečně těžká a snadno se v ní splete. | $3x + 2y = 12$, $x + 5y = 17$: $y = \frac{12 - 3x}{2}$ → $x = 17 - 5y$ | F2-T02-L2 |

## W. Slovní úlohy: pohyb, práce, řetězové vztahy (F2-T02-L3, L4; `slovni-ulohy`)
Použij i: `zapsal-vztah-obracene` (R, „o 12 km kratší“ jako $+12$), celý oddíl P (`vzorec-v-s-t-zamena`, `min-a-h-smichane`, `setkani-rychlosti-zamena`, `odpovida-na-jinou-otazku`, `prehledl-udaj`, …), `zamenil-veliciny-v-rovnici` (R), `neprima-jako-prima` (M), `zapomnel-prevest-jednotky` (O, km a m).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `spolecna-prace-secetl-casy` | U společné práce sečetl (nebo zprůměroval) časy místo výkonů. | A za 6 h, B za 3 h, spolu: $9$ h (nebo $4{,}5$ h) → $2$ h | F2-T02-L4 |
| `tempo-rychlost-zamena` | Zaměnil tempo (minut na km) a rychlost (km za minutu). | 8 km za 40 min, kolik minut na 3 km: $3 : 5 = 0{,}6$ → $3 \cdot 5 = 15$ min | F2-T02-L4 |

## X. Úhly (F2-T03-L1; `geometrie`)

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `vedlejsi-vrcholovy-zamena` | Vedlejší úhel bere jako shodný, nebo vrcholový jako doplněk do 180°. | $\alpha = 70°$, vedlejší: $70°$ → $110°$ | F2-T03-L1 |
| `soucet-uhlu-trojuhelniku-spatne` | Součet úhlů v trojúhelníku bere 360° (nebo 90°). | $\alpha = 50°$, $\beta = 60°$: $\gamma = 250°$ → $70°$ | F2-T03-L1 |
| `souhlasne-uhly-doplnil` | U rovnoběžek souhlasný nebo střídavý úhel počítal jako doplněk do 180°. | $65°$ → $115°$ místo $65°$ | F2-T03-L1 |
| `rovnoramenny-uhly-zamena` | U rovnoramenného trojúhelníku dal stejné úhly k hlavnímu vrcholu, ne k základně. | úhel při hlavním vrcholu $40°$: úhly při základně $40°$ → $70°$ | F2-T03-L1 |
| `prehledl-pravy-uhel` | Přehlédl značku pravého úhlu nebo kolmost ($s \perp t$) a úhel dopočítal jinak. | $s \perp t$, $\beta = 35°$: $\alpha = 145°$ → $55°$ | F2-T03-L1 |
| `doplnil-uhel-do-90` | Úhel dopočítal do $90°$ místo do $180°$ (nebo místo toho, aby ho opsal): zaměnil přímý úhel s pravým, i když pravý úhel v obrázku není. | vedlejší k $70°$: $90° - 70° = 20°$ → $180° - 70° = 110°$ | F2-T03-L1 |
| `trojuhelnikova-nerovnost-porusena` | Připustil třetí stranu stejně dlouhou jako součet dvou zbývajících nebo delší, takže se kratší strany nesetkají. | strany $6$ a $15$ cm, nejdelší celočíselná třetí: $21$ → $20$ cm | F2-T03-L1 |

## Y. Pythagorova věta (F2-T03-L2; `geometrie`)
Použij i: `odmocnina-po-clenech`, `zapomnel-odmocninu` (A), `vyska-jako-strana`, `trojuhelnik-bez-deleni-dvema` (S).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `prepona-spatne` | Za přeponu vzal odvěsnu: sčítal čtverce místo odčítání (nebo naopak). | odvěsna 8, přepona 17: $\sqrt{8^2 + 17^2}$ → $\sqrt{17^2 - 8^2} = 15$ | F2-T03-L2 |
| `pythagoras-bez-ctvercu` | Sečetl (odečetl) strany bez umocnění. | odvěsny 6 a 8: $14$ → $10$ | F2-T03-L2 |
| `polovina-zakladny-zapomnel` | U rovnoramenného trojúhelníku počítal výšku s celou základnou místo s polovinou. | základna 16, rameno 17: $\sqrt{17^2 - 16^2}$ → $\sqrt{17^2 - 8^2} = 15$ | F2-T03-L2 |
| `pythagoras-ne-pravouhly` | Použil Pythagorovu větu v trojúhelníku, který není pravoúhlý (nerozdělil ho výškou). | strany 5, 5, 6: „$5^2 + 5^2 = 6^2$“ → výška na základnu $\sqrt{5^2 - 3^2} = 4$ | F2-T03-L2 |

## Z. Povrch a objem těles (F2-T03-L3, L4; `geometrie`)
Použij i: `polomer-prumer-zamena`, `vzorec-kruhu-zamena` (S), `litr-zamena`, `objem-po-desitkach-nebo-stovkach` (O), `obvod-obsah-zamena` (S).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `povrch-bez-podstav` | Spočítal jen plášť, nebo jen jednu podstavu. | kvádr $2 \times 3 \times 4$: plášť $40$ → povrch $52$ | F2-T03-L3 |
| `povrch-objem-zamena` | Zaměnil povrch a objem. | krychle s hranou 3 cm, povrch: $27$ → $54\ \text{cm}^2$ | F2-T03-L3, L4 |
| `objem-soucet-rozmeru` | Objem kvádru spočítal jako součet rozměrů. | $2$, $3$, $4$: $9$ → $24$ | F2-T03-L4 |
| `hrana-z-povrchu-bez-deleni` | Z povrchu krychle počítal hranu bez dělení šesti. | povrch 54 cm²: $\sqrt{54}$ → $\sqrt{54 : 6} = 3$ cm | F2-T03-L4 |
| `plast-jen-cast-sten` | Do pláště hranolu započítal jen část bočních stěn (jednu nebo dvě ze čtyř). | $a = 3$ cm, $v = 8$ cm: plášť $3 \cdot 8 = 24$ → $4 \cdot 3 \cdot 8 = 96$ cm² | F2-T03-L3 |
| `pocet-hran-spatne` | Špatně spočítal hrany tělesa (vynechal boční hrany nebo některé počítal dvakrát), a proto špatně určil délku hrany. | hranol s čtyřúhelníkovou podstavou, součet hran $72$ cm: $72 : 8 = 9$ → $72 : 12 = 6$ | F2-T08-L1 |
| `vyska-meni-i-podstavy` | Při změně výšky hranolu počítal se změnou i u dna a víka (šest stěn místo čtyř bočních). | $a = 5$ cm, povrch větší o $300$ cm²: $6 \cdot 5 \cdot x = 300$ → $4 \cdot 5 \cdot x = 300$, $x = 15$ cm | F2-T03-L3 |

## AA. Konstrukce (F2-T04-L1, L2, bloky; `geometrie`, vstup `rysovani`)
Kódy se zapisují u dlaždic rozboru („Na čem leží bod?“, „Kolik řešení?“); krok `rysovani` kód nemá (rodič klikne Sedí / Nesedí).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `bod-na-jedne-care` | Hledaný bod umístil jen na jednu z pomocných čar, ne do jejich průsečíku. | vrchol $C$ jen na kružnici, ne i na přímce $p$ → průsečík obou | F2-T04-L1 |
| `thaletova-kruznice-spatny-stred` | Thaletovu kružnici vedl se středem v krajním bodu úsečky, ne v jejím středu. | střed v bodu $B$ → ve středu úsečky $BD$ | F2-T04-L1 |
| `kruznice-spatny-stred` | Kružnici pro zadanou délku strany vedl se středem v jiném vrcholu, než ze kterého se délka měří. | $|LM| = |KL| + 3$ cm: kružnice se středem $K$ → se středem $L$ | F2-T07-L1 |
| `kolmice-k-jine-primce` | Kolmici (výšku, pravý úhel) vedl k jiné přímce nebo úsečce, než určuje zadání. | strana $KM$ kolmo k přímce $s$ → bodem $P$ kolmo k úsečce $LP$ | F2-T07-L3 |
| `osa-usecky-mimo-stred` | Osu úsečky vedl kolmo, ale ne středem úsečky. | kolmice bodem $A$ → kolmice středem $AB$ | F2-T04-L1 |
| `pocet-reseni-spatne` | Našel méně (nebo víc) řešení, než úloha má. | dva průsečíky, narýsuje jedno řešení → dvě | F2-T04-L1, L2 |
| `uhlopricky-nepulil` | U rovnoběžníku a obdélníku nevyužil, že se úhlopříčky půlí (od středu nanesl celou úhlopříčku). | úhlopříčka 8 cm: od středu $8$ cm → $4$ cm | F2-T04-L2 |
| `neoznacil-vrcholy` | Konstrukce je správně, ale vrcholy nejsou označené písmeny. | chybí $A$, $B$, $C$ → označit | F2-T04-L1, L2 |
| `uhlopricky-stejne-zamena` | Zaměnil, kdy jsou úhlopříčky stejně dlouhé: u rovnoběžníku, který není obdélník, dal všechny vrcholy stejně daleko od středu, nebo u obdélníku nevyužil, že jsou všechny vrcholy od středu stejně daleko. | šikmý rovnoběžník, $|SA| = 3$ cm: „$|SB| = 3$ cm“ → jistě jen $|SC| = 3$ cm | F2-T04-L2 |
| `strana-misto-uhlopricky` | Zaměnil stranu a úhlopříčku rovnoběžníku nebo obdélníku: protější vrchol hledal na straně místo na úhlopříčce, střed útvaru bral jako střed strany, nebo použil délku strany místo úhlopříčky. | vrchol $D$ naproti $B$ hledal na přímce $BR$ → na přímce $BS$ za $S$, $|SD| = |BS|$ | F2-T04-L2 |
| `zamenil-mnozinu-bodu` | K podmínce ze zadání vybral čáru (množinu bodů), která patří k jiné podmínce: pravý úhel dal na osu úsečky, stejnou vzdálenost od dvou bodů na Thaletovu kružnici, vzdálenost od bodu na rovnoběžku. | $|AC| = |BC|$: Thaletova kružnice nad $AB$ → osa úsečky $AB$; $|AC| = 3$ cm: rovnoběžka s $AB$ → kružnice se středem $A$, poloměr $3$ cm | F2-T04-L1 |
| `osa-pres-bod-a-obraz` | Osu souměrnosti vedl přímo přes bod a jeho obraz (spojnici bodů), místo aby vedl kolmici na tuto spojnici jejím středem. | osa, která překlopí $K$ na $K'$: přímka $KK'$ → kolmice na $KK'$ středem úsečky $KK'$ | F2-T06-L3 |

## AB. Grafy, data a průměr (F2-T04-L3, poz. 11; `slovni-ulohy`)
Použij i: `tipnul-bez-vypoctu` (AD), `spatny-zaklad` (N), `pomer-prevraceny` (M).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `prumer-bez-deleni-poctem` | Průměr spočítal jako součet, nebo dělil jiným počtem hodnot. | 4, 6, 8: $18$ (nebo $18 : 2 = 9$) → $6$ | F2-T04-L3 |
| `prumer-bez-cetnosti` | Průměr spočítal jen z možných hodnot a nevzal v úvahu, kolik je u každé hodnoty kusů (prostý místo váženého průměru). | $4 \times 6$, $12 \times 7$, $9 \times 8$ bodů: $(6 + 7 + 8) : 3 = 7$ → $180 : 25 = 7{,}2$ | F2-T07-L2 |
| `rovnost-jako-nerovnost` | Hodnota se rovná hranici z tvrzení, a dítě ji přesto bere jako větší (nebo menší): tvrzení „větší než 70" označí za pravdivé, i když vyjde přesně 70. | vyjde $70$ m², tvrzení „větší než $70$ m²": A → N | F2-T08-L4 |
| `prumer-bez-nuly` | Hodnotu 0 nezapočítal do počtu hodnot. | 0, 4, 8: $12 : 2 = 6$ → $12 : 3 = 4$ | F2-T04-L3 |
| `cetl-jiny-sloupec` | Odečetl hodnotu z jiného sloupce, řádku nebo kategorie grafu. | výška Pavly v březnu, přečte únor | F2-T04-L3 |
| `stupnice-grafu-spatne` | Špatně určil hodnotu dílku stupnice. | sloupec na 3. dílku, dílek = 2: $3$ → $6$ | F2-T04-L3 |
| `prirustek-a-hodnota-zamena` | Zaměnil přírůstek (rozdíl) a hodnotu. | výška 150 cm → 156 cm, o kolik vyrostla: $156$ → $6$ cm | F2-T04-L3 |
| `vysec-stupne-jako-procenta` | U kruhového diagramu vzal stupně výseče jako procenta. | výseč $90°$: $90\,\%$ → $25\,\%$ | F2-T04-L3 |

## AC. Řady obrazců (F2-T04-L4, poz. 16; `slovni-ulohy`)
Použij i: `odpovida-na-jinou-otazku` (P, odpoví přírůstkem místo celkového počtu).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `rada-stale-pristupek` | Přírůstek určil z prvních dvou obrazců a nepoznal, že se mění. | 1, 4, 9, 16 kusů: 5. obrazec $16 + 3 = 19$ → $25$ | F2-T04-L4 |
| `rada-n-krat-prvni` | Počet v $n$-tém obrazci spočítal jako $n$ krát počet v prvním. | první 4 kusy, pak vždy +3; 10. obrazec: $40$ → $4 + 9 \cdot 3 = 31$ | F2-T04-L4 |
| `rada-posun-o-jednu` | Započítal o jeden přírůstek víc nebo méně ($n$ místo $n - 1$). | 10. obrazec: $4 + 10 \cdot 3 = 34$ → $31$ | F2-T04-L4 |
| `zamenil-poradi-a-pocet` | U otázky „kolikátý obrazec má 100 kusů“ dosadil 100 jako pořadí. | $4 + 99 \cdot 3 = 301$ → $4 + (n - 1) \cdot 3 = 100$, $n = 33$ | F2-T04-L4 |
| `zapocital-rohy-dvakrat` | Při počítání dlaždic v rámečku (pásu) kolem čtverce započítal rohové dlaždice dvakrát: vzal čtyřikrát délku strany. | pás kolem čtverce $10 \times 10$: $4 \cdot 10 = 40$ → $10 + 10 + 8 + 8 = 36$ | F2-T04-L4 |

## AD. Forma testu: uzavřené úlohy, záznamový arch, postup (F2-T05-L1, L2, bloky, simulace)
Kódy popisují práci s testem, ne matematiku. Ve statistikách je aplikace může ukázat zvlášť („forma testu“), podobně jako detektivní kódy (B).

| kód | popis | příklad (špatně → správně) | použito |
|---|---|---|---|
| `vybral-mezivysledek` | U výběru A–E nebo přiřazování zvolil mezivýsledek, který je v nabídce jako past. | výška $15$ cm, nabídka má $15\ \text{cm}^2$ → obsah $120\ \text{cm}^2$ | F2-T05-L2, simulace |
| `jina-hodnota-prehledl` | Svůj výsledek v nabídce nenašel, ale nezvolil „jiná hodnota“ (E / F) a vybral nejbližší. | spočítá $118$, zvolí $120$ → E | F2-T05-L2, simulace |
| `jina-hodnota-bez-prepoctu` | Zvolil „jiný" (E nebo F), i když správný výsledek v nabídce je: svůj chybný výsledek nepřepočítal a nabídku nevzal jako kontrolu. Opak `jina-hodnota-prehledl`. | vyjde $-3$, zvolí E) jiný počet → přepočítat, C) $13$ | F2-T05-L2 |
| `tipnul-bez-vypoctu` | Zvolil možnost nebo ANO/NE odhadem, bez výpočtu. | u 11.2 rovnou „A“ → spočítat průměr a rozhodnout | F2-T04-L3, F2-T05-L2, simulace |
| `jen-vysledek-bez-postupu` | U úlohy „uveďte celý postup“ napsal jen výsledek (u zkoušky 0 bodů). | v rámečku 4.1 jen „$x = 5$“ → řádky úprav a výsledek | F2-T05-L1, simulace |
| `prepsal-do-archu-spatne` | V sešitě má správný výsledek, do archu přepsal jiný (přehozené číslice, jiné znaménko). | v sešitě $-\frac{3}{4}$, v archu $\frac{3}{4}$ | F2-T05-L1, simulace |
| `odpoved-do-spatneho-policka` | Odpověď zapsal nebo zakřížkoval do políčka jiné podúlohy. | výsledek 6.2 v rámečku 6.1 | F2-T05-L1, simulace |
| `oprava-bez-preskrtnuti` | Opravu v poli s postupem udělal bez přeškrtnutí: přepsal číslice přes původní zápis, nebo původní nechal a nový napsal vedle. Nečitelný nebo nejednoznačný zápis je u zkoušky chybné řešení. | v poli $12$ přepsané na $21$ → $12$ přeškrtnout, $21$ napsat do stejného pole | F2-T05-L1, simulace |
| `dva-krizky` | Zakřížkoval dvě možnosti, nebo opravu udělal bez zabarvení původního křížku (neplatná odpověď). | u 13 křížek v B i D → jeden křížek, původní pole zabarvit | F2-T05-L2, simulace |
