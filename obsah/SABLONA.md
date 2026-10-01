# Šablona lekce — jak psát obsah „Spolu na přijímačky“

Rozšiřuje `kostra/03-format-obsahu.md` (formát JSON je závazný tam). Tady je, **jak** obsah psát. Vzor: `obsah/lekce/P1.json`. Typy chyb: `obsah/typy-chyb.md`. Kdo lekci použije: dítě u počítače (zadání, kroky) a rodič s telefonem (tahák, semafor). Rodič matematiku neumí.

## 1. Tři zlatá pravidla
1. **Rodič nepočítá, nepíše a nevysvětluje. Ptá se.** Každý text pro rodiče musí jít přečíst nahlas bez porozumění matematice.
2. **Popisek kroku nenapovídá.** Návod patří do taháku (L2, L3), nikdy do kroku.
3. **Jedna lekce = jeden cíl.** Všechny 4 úlohy trénují totéž z různých stran.

## 2. Hlas a oslovení
- Dítěti **tykáme** (zadání, popisky, hlášky): „Vyber“, „Vypočítej“, „Najdi“.
- Rodiči **vykáme** (úvod, vysvětlení, typická chyba, semafor): „Zeptejte se“, „Pochvalte“.
- Otázky L1–L3 a otočená role jsou **přímá řeč rodiče k dítěti**, tedy tykání v uvozovkách „…“.
- **Bez rodu.** Nevíme, jestli je dítě kluk, nebo holka, ani jestli čte máma, nebo táta. V přímé řeči nepoužívej minulý čas („Jak jsi to spočítal?“). Místo toho přítomný čas nebo podstatné jméno: „Jak to počítáš?“, „Co je tvůj první krok?“. Kde se to nedá obejít (tlačítka semaforu), piš „Vyřešil(a)“.
- Česky, lidsky, krátké věty. Žádný žargon v textech pro rodiče (ne „operátor“, „priorita operací“, „distributivní“). Pojmy z hodin (závorka, mocnina, součet, součin, zlomek, čitatel) jsou v pořádku.
- Pro dítě: žádná procenta, známky, body. Chyba není „špatně“ ani červeně, je „zatím nesedí“.

## 3. Stavba lekce
| pole | pravidlo |
|---|---|
| `tema` | 2–4 slova, jak by to řekl žák („Pořadí operací“, „Zlomky — krácení“). |
| `cil_pro_rodice` | Jedna věta, pozorovatelné chování dítěte: „Dítě umí říct, co počítá první a proč.“ Ne „Dítě pochopí…“. |
| `uvod_pro_rodice` | **Jedna věta** (R23): o čem lekce je. „Dnes jde o pořadí: co se v příkladu počítá jako první.“ Pravidla pro rodiče („Vy nic nepočítáte…“) sem nepiš, jsou v rámečku aplikace. |
| `uvod_pravidla` | Žebříček „Platí:“ (R23), 2–6 položek `{ "znak": "( )", "text": "závorky" }`, v pořadí, v jakém se pravidlo používá. `znak` krátký symbol (≤ 12 znaků, např. `( )`, `x²`, `· :`, `+ −`, `(−)·(−)`, `$\frac{3}{4}$`), `text` 1–4 slova. `text` čte rodič, proto **neosobní tvar** („dosazuje se do závorky“), ne tykání („dosaď do závorky“) (R32). Hlavní pravidlo lekce, ne slovník pojmů. |
| `pomucky` | Pomůcky pro žáka, checklist „Připrav si“ (R29). Výchozí `["sešit", "propiska", "tužka"]`; přidej jen to, co lekce opravdu potřebuje (geometrie: "pravítko", "trojúhelník s ryskou", "kružítko"; tabulky jen pokud se s nimi počítá). Krátké názvy v 1. pádu, malým písmenem. |
| `cas_min` úloh | rozcvička 4, detektiv 5, cermat 7, semafor 4 = 20. |
| pořadí úloh | přesně `rozcvicka`, `detektiv`, `cermat`, `semafor`. |
| id | úloha `P1-U1`…`P1-U4` (obecně `<lekce>-U<n>`), kroky `k1`, `k2`, …, poslední vždy `final`. |

**Obtížnost:** rozcvička snadná (i slabší dítě má mít zelenou), detektiv a CERMAT střední, semafor = obtížnost CERMAT úlohy lekce, ne těžší.

## 4. Limity délek (slova; matematika v `$…$` se počítá jako 1 slovo)
| text | limit | zdroj |
|---|---|---|
| `uvod_pro_rodice` | 1 věta | R23 |
| `uvod_pravidla[].text` | 4 | R23 |
| `tahak.vysvetleni` | 70 | kostra |
| `zadani` (rozcvička, CERMAT, semafor) | 60 | tato šablona |
| `popisek` kroku | 8 (ideál 1–5); krok `poradi` 10, pokud přesně sedí na vzor z kostry („Klikni na početní operace v pořadí, v jakém je počítáš.“) | tato šablona |
| otázka L1–L3, `otocena_role` | 25 | tato šablona |
| `tahak.otocena_role_odpoved` | 40 | R21 |
| `tahak.typicka_chyba` | 50 | tato šablona |
| `semafor.zelena` | 25 | tato šablona |
| `semafor.oranzova` | 60 | tato šablona |
| `semafor.cervena` | 75 (s „Připravte“ a „Kontrola pro vás“) | R34 |
| text dlaždice | 8 | tato šablona |

`tahak.reseni` limit nemá, ale jeden řádek = jeden krok.

## 5. Typy úloh

### 5.0 Společné pro všechny typy (R23)
- **Hlavní výraz úlohy je vždy na vlastním řádku** jako display `$$…$$` (v `zadani` i v `tisk.zadani`). Např. `"Vypočítej:\n\n$$(8 - 2)^2 : 4 + 3 \\cdot 5$$"`. Výjimka: položky rozcvičky (`A) $…$`, každá na vlastním řádku) a slovní úlohy bez výrazu. Vzorce se nezalamují; když se nevejdou, aplikace dá dlaždici přes celou šířku.
- Karta úlohy u rodiče jde v pořadí: 1) Dítě čte a řeší, vy mlčíte → 2) Zasekne se? otázky 1–3 → 3) Hotovo? otočená role → 4) semafor. Typická chyba a řešení jsou sbalené níž. Piš texty tak, aby v tomto pořadí dávaly smysl.

### 5.1 Rozcvička (≈4 min)
- 2–3 kroky, každý jedna dlaždicová otázka na **klíčový pojem lekce**. Nepočítá se celý příklad, jde o rozhodnutí („co je první“, „který zlomek je větší“, „jaké znaménko vyjde“).
- Zadání vyjmenuje všechny položky (A, B, C), každou na vlastním řádku (`A) $…$`), popisek kroku položku zopakuje: `"Příklad A: $5 + 3 \\cdot 4$"`.
- **Otázky u rozcvičky: jedna ke každému příkladu**, `{ "k": "A", "text": "„…“" }`, `{ "k": "B", … }`, `{ "k": "C", … }` (R23). Rodič tak ví, kterou otázku použít, když se dítě zasekne u konkrétního příkladu. Každá otázka ukazuje, jak začít (pravidlo, obraz), ne odpověď.
- Distraktory = chyby, které lekce řeší. Smí se opakovat stejný distraktor napříč kroky (např. „Je to jedno“).
- Správnou dlaždici střídej na různých pozicích (a, b, c).
- **Správná dlaždice nesmí jít poznat podle vzhledu** (R32): nesmí být jediná se závorkou, s odmocninou, se zlomkem ani nejdelší. Když je, přidej distraktor stejného tvaru (typická chyba zapsaná stejně).
- Snadné. Pokud by rozcvičku slabší dítě nedalo, je špatně napsaná.

### 5.2 Detektiv „Kde udělal Petr chybu?“ (≈5 min)
- Petr je vymyšlený spolužák. Vždy **Petr**, vždy **právě jedna** chyba, **typická** pro téma (z `typy-chyb.md`).
- Zadání (R23): `Petr počítal příklad` / `$$výraz$$` / `a udělal **jednu** chybu. Najdi ji.` / 3–5 řádků Petrova výpočtu, každý jako odstavec `N. řádek: $= …$`.
- Dlaždice-řádky v `k1`: `{ "id": "r1", "stitek": "1. řádek", "text": "$= 90 - 2 \\cdot 3^2$", … }` — `stitek` je malý štítek nad výrazem, `text` obsahuje **jen výraz**. Aplikace je dává do 1 sloupce.
- Řádky **za chybou jsou spočítané správně** ze špatného čísla (jinak by byly dvě chyby).
- Kroky:
  - `k1` „Klikni na řádek s chybou“ — dlaždice = řádky (3–4). Správná = řádek s chybou. Ostatní dostanou `typ_chyby`: řádek **před** chybou → `oznacil-radek-pred-chybou`, řádek **za** chybou → `nasel-az-dusledek`. Oba jsou detektivní kódy, statistiky je vedou zvlášť.
  - `k2` (doporučeno) „Jak má chybný řádek vypadat správně?“ — dlaždice, distraktory = jiné typické chyby.
  - `final` „Výsledek“ — správný výsledek celého příkladu (`cislo` / `zlomek`). Petrův výsledek patří do `zname_chyby` s typem jeho chyby.
- **L3 u detektiva (R32, od Fáze 1):** nejmenuje řádek s chybou ani přechod mezi řádky (to je odpověď na `k1`). Ukáže jen, JAK řádky kontrolovat: které pravidlo u každého řádku ověřit. Dobře: „U každého řádku se zeptej: je tu mocnina? Spočítal ji Petr dřív než krát?“ Špatně: „Podívej se na přechod z 1. na 2. řádek.“ Pilot P1–P4 zůstává beze změny.
- Petrova chyba nesmí být překlep ani nepozornost (7 + 5 = 13). Musí to být chyba v myšlení, kterou dělají skuteční žáci.

### 5.3 CERMAT klon (≈7 min)
- Předloha: veřejné testy M9 (`podklady/cermat/`), pro P1/P2 úlohy 1–3 testu, jinak podle osnovy.
- **Drž**: strukturu (stejné operace ve stejném pořadí), typ čísel (celá / desetinná / zlomky), počet kroků, obtížnost a „hezkost“ výsledku.
- **Změň**: čísla, jména, kontext, formulaci věty (nikdy doslovný přepis). U CERMAT je vykání („Vypočtěte“), u nás tykání („Vypočítej“).
- Vyber čísla tak, aby **každá typická chyba dala jiné, čisté číslo** (pak ji umíme rozpoznat v `zname_chyby`). Příklad P1: 25 a 4 → správně 2,9; chyby 19, 25,4, 0,29, 20 jsou všechny čisté a různé.
- `zdroj`: přesně `"klon: CERMAT 2025 M9A úloha 1"` (rok, varianta, číslo úlohy/podúlohy).
- 2–4 kroky: typicky `k1` dlaždice „Který zápis odpovídá zadání?“ nebo „Co potřebuješ zjistit nejdřív?“, pak 0–2 mezivýsledky, pak `final`.

### 5.4 Semafor (≈4 min)
- Jedna samostatná úloha, **jen krok `final`**, žádná dlaždice (aby se nedalo tipovat).
- Stejná dovednost jako celá lekce, obtížnost jako CERMAT úloha, ne těžší. Nesmí to být kopie detektiva s jinými čísly, ale ani úplně nový typ.
- `tahak.vysvetleni` začíná tím, že je to kontrolní úloha: dítě řeší samo, rodič otázky použije jen při zaseknutí a pak zvolí „Potřeboval(a) otázku“.
- Z této úlohy se bere hlavní barva lekce.

## 6. Kroky a popisky

**Povolené vzory popisků:** „Výsledek“, „Mezivýsledek“, „Mezivýsledek: druhá odmocnina ze součinu“ (jen slovy ze zadání), „Vyber, co platí“, „Co potřebuješ zjistit nejdřív?“, „Který zápis odpovídá zadání?“, „Klikni na řádek s chybou“, „Příklad A: $…$“.

| špatně (napovídá) | proč | dobře |
|---|---|---|
| „Nejdřív vynásob $3 \cdot 4$“ | prozradí první krok | „Příklad A: $5 + 3 \cdot 4$“ |
| „Vypočítej 1 %“ | prozradí metodu | „Mezivýsledek“ |
| „Spočítej závorku“ | prozradí pořadí | „Mezivýsledek“ |
| „Převeď na společného jmenovatele 12“ | prozradí metodu i číslo | „Co potřebuješ zjistit nejdřív?“ |
| „Odmocni 100“ | prozradí mezivýsledek z jiného kroku | „Mezivýsledek: druhá odmocnina ze součinu“ |
| „Mezivýsledek 1“ (když není jasné, co zadat) | dítě neví, které číslo chceme | „Mezivýsledek: součet“ (slovo ze zadání) |

**Pravidlo (rozhodnutí vedoucího 24. 9.):** Popisek kroku smí **pojmenovat veličinu, kterou zadání samo jmenuje** (jeho slovy, např. „Mezivýsledek: součet“, „Mezivýsledek: druhá odmocnina ze součinu“). Nesmí **předepsat operaci**, tedy nesmí: (a) obsahovat sloveso postupu („vynásob“, „odmocni“, „zkrať“, „převeď“), (b) obsahovat číslo, které se teprve počítá, (c) pojmenovat pomocnou veličinu, kterou zadání nezmiňuje (např. „1 %“, „společný jmenovatel“, „cena za kus“), pokud o ní zadání samo nemluví.

## 7. Dlaždice a známé chyby
- 3–4 možnosti, **právě jedna** `"spravne": true`, každá špatná má `typ_chyby` z `typy-chyb.md` (nový typ nejdřív zapiš tam).
- Distraktor = výsledek **skutečné** typické chyby. Nikdy náhodné číslo. Test: umíš u distraktoru napsat, jakou chybou vznikl? Pokud ne, vyhoď ho.
- Stejná délka a podoba všech dlaždic (správná nesmí být nejdelší ani jediná se závorkou).
- `cislo` / `zlomek` kroky: `zname_chyby` 1–3 nejčastější špatné výsledky (výjimečně 4, když jsou dvě chyby podobně časté a dávají různá čísla, např. P1-U4: 22 a 16); každý přepočítej, že opravdu vzniká danou chybou.
- `zlomek` s požadavkem základního tvaru: `"kontrola_tvaru": "zakladni_tvar"`; nezkrácený správný výsledek do `zname_chyby` **nedávej** (vyhodnotí ho hláška „správně, ale zkrať“).

## 8. Tahák rodiče

### 8.1 `vysvetleni` (max 70 slov)
Pro rodiče, ne pro dítě. **Neopakuje úvod ani `uvod_pravidla`** (R23): rodič je má 3 cm nad tím. Říká jen, co je **nového u této úlohy**: co dítě dělá (vybírá / hledá chybu / řeší samo), past úlohy, nový pojem lidsky, jak se zápis čte. Nikdy „vysvětlete dítěti…“.

### 8.2 `reseni`
Rodič to čte až po odevzdání (je to sbalené). Aplikace to sází jako výpočet. **Formát R23:**
- Odstavce oddělené prázdným řádkem (`\n\n`) = řádky výpočtu. Jeden krok = jeden odstavec.
- Řádek `výpočet (vysvětlivka)`: vysvětlivka je **závorka na konci řádku, mimo `$…$`, bez matematiky uvnitř**, slovy. Vykreslí se menším šedým písmem pod výpočtem.
- Úvodní věta bez závorky je v pořádku (u detektiva „Chyba je ve 2. řádku: …“).
- Rozcvička a úlohy s více čísly: oddíly `#### A) …`, `#### B) …`.
- Poslední řádek vždy `**Výsledek:** $…$` (zvýrazní se).

Příklad (JSON hodnota, `\n\n` zobrazeno jako nový řádek):
```
$(8 - 2)^2 : 4 + 3 \cdot 5$

$= 6^2 : 4 + 3 \cdot 5$ (závorka)

$= 36 : 4 + 3 \cdot 5$ (mocnina)

$= 9 + 15$ (dělení a násobení)

$= 24$ (sčítání)

**Výsledek:** $24$
```
Rozcvička:
```
#### A) $5 + 3 \cdot 4$

První: $3 \cdot 4$ (násobení má přednost před sčítáním)

#### B) $(5 + 3) \cdot 4$

První: $5 + 3$ (závorka má přednost)

**Výsledek:** A) $3 \cdot 4$, B) $5 + 3$
```

### 8.3 Otázky L1–L3 (přímá řeč, v „…“, max 25 slov)
| úroveň | účel | dobře | špatně |
|---|---|---|---|
| L1 přeformulování | dítě řekne zadání svými slovy | „Řekni mi vlastními slovy, co máš zjistit.“ / „Přečti mi příklad nahlas. Jaká znaménka v něm vidíš?“ | „Chápeš to?“ (odpověď ano/ne) / „Co je to součin?“ (zkoušení) |
| L2 první krok | dítě řekne, čím začne a proč | „Ukaž mi prstem, co spočítáš jako první. Proč zrovna tohle?“ | „Nejdřív se násobí, ne?“ (prozradí) / „Víš, jak začít?“ (ano/ne) |
| L3 mezikrok | rodič dá konkrétní začátek, dítě doplní další krok | „Tady máš začátek: součet je $25 + 4 = 29$. Co ještě potřebuješ spočítat?“ | „Spočítej si to po krocích.“ (nic nedává) / celé řešení (dělá práci za dítě) |

- L1 a L2 musí fungovat i bez matematiky. L3 smí obsahovat konkrétní číslo nebo výraz, ale rodič ho jen **čte**, nepočítá.
- **Zápisy v otázkách piš slovy**, jak se čtou nahlas („dva krát tři na druhou“, „mínus, závorka, mínus šest“, „jedna osmina jsou tři čtyřiadvacetiny“), ne v KaTeX. Výslovnost: `obsah/cteni-zapisu.md`.
- **Tvar otázky (R23):** řetězec, nebo `{ "k": "Krok 1", "text": "„…“" }`. `k` (≤ 20 znaků) říká, ke kterému příkladu/kroku otázka patří: „A“, „B“, „C“ (rozcvička, povinně), „Celá úloha“, „Krok 1“, „Krok 1 a 2“, „Čísla A, B, C“. U detektiva a CERMAT úlohy `k` uváděj; u kontrolní úlohy (jen `final`) ho vynech.
- **L3 od Fáze 1 (R23):** L3 smí ukázat, JAK začít (první úpravu, obraz, převod), ne HODNOTU kroku, který dítě zadává. P1–P4 se kvůli tomu neměnily.
- **Otázky pokrývají celou úlohu.** Má-li úloha víc částí (A, B, C; mezivýsledky), musí mít rodič otázku i k té poslední a nejtěžší (P3-U3: L3 obsahuje i číslo C; P4-U1: L3 je k mocnině C). Pořád přesně 3 otázky; spoj části do L2/L3.
- Každá položka je **otevřená** (nejde odpovědět ano/ne). Je to buď **otázka** (končí „?“: „Co spočítáš jako první? Proč?“), nebo **výzva** k řeči či ukázání (končí „.“: „Řekni mi vlastními slovy, co máš udělat.“, „Ukaž mi prstem…“). Obojí je v pořádku; výzva musí vést k tomu, že dítě mluví. Zakázaná je jen uzavřená otázka („Chápeš to?“, „Víš, jak začít?“).
- Žádné „Že ano?“, „Určitě víš…“, „To je přece jednoduché“.

### 8.4 `otocena_role` (přímá řeč, max 25 slov)
Dítě vysvětluje rodiči. Vzor: „Vysvětli mi, proč…“. Míří na **důvod**, ne na výsledek.
- Dobře: „Vysvětli mi, proč musí být $25 + 4$ v závorce. Co by se stalo bez ní?“
- Špatně: „Chápeš, proč tam je závorka?“ / „Kolik ti vyšlo?“

### 8.4a `otocena_role_odpoved` (max 40 slov, povinné od R21)
Vzorová odpověď dítěte, 1–2 věty, podle které rodič bez matematiky pozná, že dítě vysvětlilo správně. Psaná jako řeč dítěte, slovy, bez vzorců. Nepiš „Dobrá odpověď zní…“ (nadpis dá UI). Rodič ji má sbalenou.
- Dobře: „Protože se nejdřív musí sečíst celé dvacet pět plus čtyři a teprve pak dělit. Bez závorky by se dělila jen čtyřka.“
- Špatně: „$(25+4):10$ ≠ $25+4:10$“ (vzorec, rodič nepřečte).

### 8.5 `typicka_chyba` (max 50 slov)
Tvar **„jak to poznáte + co říct“** (R21), 1–2 typické chyby. U každé: konkrétní špatné číslo nebo chování, které rodič uvidí (i v **mezivýsledku**, ne jen ve výsledku), a otázka v „…“, kterou rodič řekne místo opravování. Vzor: „V mezivýsledku napíše $100$, zapomene odmocninu. Zeptejte se: „Které číslo krát samo sebe dá sto?““ U kontrolní úlohy přidej „Během úlohy nic neříkejte, ptejte se až po odevzdání.“ U detektiva počítej i s tím, že dítě označí správný řádek, protože nerozumí zápisu (P4-U2: smíšené číslo).

## 9. Semafor texty (`semafor.*`)
Barvu určí aplikace z volby rodiče a výsledku (matice v `kostra/02`). Text říká rodiči, co **teď a zítra** udělat.

- **`zelena`** (max 25 slov): začíná vždy **„Výborně — “** a krátkým konstatováním, co se povedlo (R23), pak konkrétní pochvala **za postup, ne za rychlost nebo chytrost** + „jděte dál“ / u kontrolní úlohy „Zítra můžete pokračovat další lekcí.“ Dobře: „Výborně — pravidlo sedí. Pochvalte, že se dítě zastavilo a rozhodlo, a jděte dál.“ Špatně: „Výborně, je šikovný!“ (hodnotí dítě, ne postup).
- **`oranzova`** (max 60 slov): **konkrétní 5minutové cvičení na zítra**, které rodič zvládne bez matematiky:
  - Začni „Zítra 5 minut…“.
  - Úkol je buď ústní („Přečtěte nahlas: ‚…‘“), nebo rodič **ukáže dítěti na telefonu** příklad a dítě řeší nahlas / na papír.
  - Na konci vždy **„Kontrola pro vás: …“** se správnou odpovědí, aby rodič nemusel nic počítat. Kontrola je poslední věta (rodič ukazuje jen příklad, ne konec textu).
  - Čísla vol tak, aby se dala přečíst nahlas jednoznačně (mocniny a zlomky raději ukázat na telefonu než diktovat).
  - Špatně: „Zítra si zopakujte pořadí operací.“ (co přesně?), „Vysvětlete mu znovu závorky.“ (rodič nevysvětluje).
- **`cervena`** (max 75 slov): **dnes zavřít** + **od čeho začít zítra s vizualizací** (od T2 navíc „Připravte: …“ a „Kontrola pro vás: …“, viz §18):
  - Začni „Dnes už nepokračujte, pochvalte snahu.“
  - Zítra: věc z reálného světa, kterou dítě může vzít do ruky nebo nakreslit (peníze a nákup, kostky/lego, bonbony, pizza, schody, pravítko). Dítě manipuluje a počítá, rodič se ptá.
  - Most zpět k matematice: „Pak ať to samo zapíše: $…$“.
  - Konec vždy: „Potom zopakujte lekci ‚<tema>‘.“ s **názvem tématu lekce** v uvozovkách, ne s id (rozhodnutí vedoucího 25. 9.): v JSON přesně `Potom zopakujte lekci „Mocniny a odmocniny zpaměti“.` (text = pole `tema`). Id typu F1-T01-L2 rodiči nic neřekne. Výjimka: pilot P1–P4 nechává „Potom zopakujte lekci P1.“ (tam rodič id vidí). R21: po červené je zítřek místo nové lekce, cvičení + znovu celá lekce; manuál rodiče to říká stejně.
  - Nikdy „dítě to neumí“, „je potřeba doučování“. Nabídku SOS dělá aplikace sama při opakované červené.

## 10. `tisk.zadani`
- Hlavní výraz úlohy na vlastním řádku `$$…$$`, stejně jako v `zadani` (R23).
- Zadání řešitelné **jen s papírem a tužkou**, bez klikání. Stejná čísla jako v aplikaci.
- Dlaždice → „Zakroužkuj: a) … b) … c) …“ (stejné pořadí jako `moznosti`).
- Číselné kroky → „Mezivýsledek: ______“, „Výsledek: ______“.
- Detektiv: řádky Petra + „Zakroužkuj řádek s chybou.“ + oprava + výsledek.
- Žádné nápovědy, žádné řešení (tahák se netiskne).

## 11. Slovník formulací pro rodiče

| situace | říkat | neříkat |
|---|---|---|
| začátek | „Co máš udělat? Řekni mi to vlastními slovy.“ | „Tohle je jednoduché.“ |
| dítě mlčí a zírá | „Podtrhni v zadání všechna čísla.“ → „Najdi větu s otazníkem.“ → „Vyprávěj mi, o čem to je, bez čísel.“ | „No tak, vždyť jste to brali!“ |
| dítě začne počítat | „Co počítáš první? Proč?“ | „Ne, to je špatně, nejdřív…“ |
| chyba | „Ukaž mi, jak to počítáš.“ / „Projdi to se mnou krok po kroku.“ | „To je blbě.“ / „Zase!“ |
| správně | „Podle čeho poznáš, čím začít?“ / „Vysvětli mi to.“ | „Vidíš, že to umíš, když chceš.“ |
| dítě se ptá „je to dobře?“ | „Co by ti řeklo, že je to dobře?“ / „Odevzdej a uvidíme.“ | „Jo, dobře.“ (rodič neověřuje, ani když ví) |
| konec | „Co ti dnes šlo nejlíp?“ | „Tak jsme to dali, konečně.“ |
| čas vypršel | „Dokončíme tuhle úlohu a končíme.“ | „Ještě tohle a tohle, dokud to neumíš.“ |

Rodič **nikdy**: nepočítá za dítě, nepíše do sešitu, nevysvětluje látku, nesrovnává se sourozencem ani spolužáky, nehodnotí dítě („jsi chytrý / hloupý“), jen jeho postup.

## 12. Matematika v JSON
- KaTeX v `$…$`. V JSON **zdvoj zpětné lomítko**: `"$3 \\cdot 4$"`, `"$\\sqrt{25}$"`, `"$\\dfrac{3}{4}$"`.
- **Zlomky jen `\frac`** (R29): čitatel nad jmenovatelem, `"$\\frac{3}{4}$"`, smíšené číslo `"$1\\frac{1}{4}$"`. Platí všude: zadání, dlaždice, tahák, řešení, semafor, tisk, `uvod_pravidla.znak` i `kontrola.poznamka`. **Nikdy** lomítko `3/4` mimo matematiku ani unicode `¼ ½ ¾ ⅓ ⅔`; validátor seedu to odmítne. Slovy v otázkách pro rodiče („tři čtvrtiny“) je v pořádku.
- Násobení `\\cdot`, dělení `:` (jak ve škole), desetinná čárka `2{,}9` (ve složených závorkách, jinak KaTeX přidá mezeru).
- V `spravne.hodnota` a `zname_chyby` desetinná **tečka** (`2.9`) — je to JSON číslo.
- České uvozovky „…“ (U+201E a U+201C) v textu; uvnitř JSON řetězce se neescapují.
- Nový řádek v Markdownu = `\n\n`.
- Záporná čísla v textu vždy se závorkou tam, kde by se spletla s odčítáním: $3 \cdot (-2)$.

## 13. `zdroj` a `kontrola`
- `zdroj`: `"vlastni"` | `"survivor: 1C-020"` (id úlohy ze Survivoru, případně `"survivor: 1C-020 (upraveno)"`) | `"klon: CERMAT 2025 M9A úloha 1"`.
- `kontrola` autor vyplní `{ "jistota": "neurceno", "poznamka": "co bylo sporné", "zkontroloval": "autor|metodik", "datum": "RRRR-MM-DD" }`. `jista/stredni/nizka` nastavuje až recenzent.

## 14. Checklist před odevzdáním recenzentovi
**Struktura**
- [ ] JSON je validní (`node -e "JSON.parse(require('fs').readFileSync('obsah/lekce/P2.json','utf8'))"`).
- [ ] Zlomky jen `\frac` (žádné `3/4`, `¾`); pole `pomucky` vyplněné.
- [ ] 4 úlohy v pořadí rozcvicka, detektiv, cermat, semafor; součet `cas_min` = 20.
- [ ] Každá úloha končí krokem `final`; semafor má jen `final`.
- [ ] Každá dlaždicová otázka: 3–4 možnosti, právě 1 správná, každá špatná má `typ_chyby` ze slovníku.
- [ ] Každý číselný krok: `spravne` + 1–3 `zname_chyby` (výjimečně 4).
- [ ] Všechna pole z kostry: `tahak` (vysvetleni, reseni, 3 otazky, otocena_role, typicka_chyba), `semafor` (3 barvy), `tisk.zadani`, `zdroj`, `kontrola`.

**Matematika**
- [ ] Každý výsledek spočítán **dvakrát, jinou cestou** (jiné pořadí, zkouška dosazením, kalkulačka / `node -e`).
- [ ] Každá `zname_chyby` i každý distraktor opravdu vzniká uvedenou chybou (přepočítáno).
- [ ] Žádné dvě chyby nedávají stejné číslo jako správný výsledek.
- [ ] Detektiv: právě jedna chyba, řádky za ní správně spočítané ze špatného čísla.
- [ ] CERMAT klon drží strukturu, typ čísel a obtížnost originálu; `zdroj` přesně; zadání není doslovný přepis.

**Didaktika a jazyk**
- [ ] Jeden cíl lekce; všechny úlohy ho trénují.
- [ ] Popisky kroků nenapovídají (žádné sloveso postupu, žádné číslo k výpočtu).
- [ ] L1–L3 a otočená role: přímá řeč v „…“, otevřené otázky, bez rodu, rodič je jen přečte.
- [ ] Nikde „vysvětlete dítěti“, nikde rodič nepočítá ani nepíše.
- [ ] Oranžová: konkrétní 5min cvičení + „Kontrola pro vás“ ke každému kroku. Červená: dnes zavřít + „Připravte: …“ + zítřejší vizualizace + „Potom zopakujte lekci „<tema>“.“ + „Kontrola pro vás“.
- [ ] Pravidla §18 (R34): „Čte se“, typická chyba „Podívejte se na obrazovku dítěte“ včetně mezivýsledků, otázka „když nesedí“ u `poradi`, žebříček jako konkrétní příklad.
- [ ] (recenzent) Každá chybná volba a každá `zname_chyby` je v taháku zmíněná aspoň půl větou.
- [ ] Limity slov z oddílu 4 dodrženy.
- [ ] Tykání dítěti, vykání rodiči, žádná procenta/známky pro dítě.
- [ ] `tisk.zadani` jde vyřešit jen na papíře.
- [ ] Rozcvičku zvládne i slabší dítě.

## 15. Vstup `vyraz` (Fáze 1, ODPOVED-D)
Jádro je v `kostra/03` („Doplněno 25. 9.“). Tady je, jak ho psát.

**Kdy:** odpověď je výraz s proměnnou (T6-L1 slučování a roznásobení, T6-L2 vytýkání, části T6-L4). Ne u rovnic (tam je výsledek číslo `x = …` → `cislo`) a ne v rozcvičce (tam dlaždice).

**Formát:**
```json
{
  "id": "final",
  "popisek": "Výsledek",
  "vstup": { "typ": "vyraz", "promenne": ["x"] },
  "spravne": { "vyraz": "2x" },
  "zname_chyby": [
    { "vyraz": "12x", "typ_chyby": "scital-pred-nasobenim" },
    { "vyraz": "-10x", "typ_chyby": "minus-krat-minus" }
  ],
  "kontrola_tvaru": null
}
```
Zadání (styl 2026 B 3.1): $5x - 3x \cdot 3 - 3 \cdot (-2x) = 5x - 9x + 6x = 2x$. Chyby: $(5x - 3x) \cdot 3 + 6x = 12x$; $5x - 9x - 6x = -10x$.

**Pravidla pro autora:**
- `spravne.vyraz` piš v nejjednodušším tvaru, jak ho chce CERMAT (sloučené členy, bez závorek po roznásobení, u vytýkání součin). Podle něj se počítají členy.
- Zápis: `*` nebo nic mezi číslem a proměnnou (`3x`, `-4x^2`, `2(x+1)`), mocnina `^2`. Dítě smí psát i `·`, `x²`, mezery, desetinnou čárku; normalizuje aplikace.
- **Dosazení:** výchozí 3 sady `x = -3`, `x = 2`, `x = \frac{1}{2}` (v JSON `"dosazeni": [{"x": -3}, {"x": 2}, {"x": 0.5}]`). U dvou proměnných výchozí `{x: -3, y: 2}`, `{x: 2, y: 0.5}`, `{x: 0.5, y: -3}`. Vlastní `vstup.dosazeni` jen tehdy, když výchozí hodnoty nejdou (dělení nulou ve výrazu). Vždy aspoň 1 záporná a 1 neceločíselná hodnota.
- **Kontrola členů (vždy zapnutá):** odpověď s víc členy, než má `spravne.vyraz`, ale se stejnými hodnotami = „Výsledek je správně, ale ještě ho zjednoduš“ (správně s poznámkou). Proto opsané zadání neprojde jako „hotovo“.
- **`kontrola_tvaru`:** `null` (běžně), `bez_zavorek` (roznásobení: odpověď se závorkou = „správně, ale roznásob závorku“), `soucin` (vytýkání: odpověď, která není součinem, nesedí, i když má stejné hodnoty). U vytýkání zadaného výrazu přidej `"vytknout": "-2x"` do `vstup`: jiný rozklad (např. $2x(1 - 4x)$ místo $-2x(4x - 1)$) pak nesedí s kódem `vytkl-bez-minusu`, resp. `vytknul-neuplne`, a do `zname_chyby` ho nedávej.
- **`zname_chyby`** jsou výrazy, porovnávají se dosazením. Každou přepočítej, že opravdu vzniká danou chybou, a že se při některém dosazení liší od správného výsledku (seed to kontroluje).
- Popisek jako u čísla: „Výsledek“, „Mezivýsledek: po roznásobení“ (jen slova ze zadání).

**Dobře / špatně:**
| | dobře | špatně |
|---|---|---|
| `spravne.vyraz` | `"2x"` | `"5x-9x+6x"` (nesloučené, počet členů by pustil i nezjednodušené odpovědi) |
| `zname_chyby` | `{ "vyraz": "12x", "typ_chyby": "scital-pred-nasobenim" }` = $(5x - 3x) \cdot 3 + 6x$ | náhodný výraz bez chyby v myšlení |
| dosazení | $-3$, $2$, $\frac{1}{2}$ | jen $1$ a $2$ (chyba „zapomněl minus“ může náhodou projít) |

## 16. Vstup `poradi` (Fáze 1, ODPOVED-D bod 6)
Dítě kliká na operace ve výrazu v pořadí, v jakém je počítá; u operace se objeví štítek 1, 2, 3…

**Kdy:** jen `k1` úlohy CERMAT nebo krok rozcvičky (osnova §6.1: T1-L1, L2, L4; T2-L3; T6-L1; T8-L1). **Nikdy** v semaforu (zůstává číselný) ani v detektivovi.

**Formát:**
```json
{
  "id": "k1",
  "popisek": "Klikni na početní operace v pořadí, v jakém je počítáš.",
  "vstup": {
    "typ": "poradi",
    "vyraz": "9 \\op{o1}{\\cdot} 7^{\\op{o2}{2}} \\op{o3}{-} 6 \\op{o4}{\\cdot} 7 \\op{o5}{+} 1",
    "operace": [
      { "id": "o1", "popis": "násobení devíti" },
      { "id": "o2", "popis": "mocnina" },
      { "id": "o3", "popis": "odčítání" },
      { "id": "o4", "popis": "násobení šesti" },
      { "id": "o5", "popis": "sčítání" }
    ]
  },
  "spravne": { "poradi": [["o2", "o1", "o4", "o3", "o5"], ["o2", "o4", "o1", "o3", "o5"], ["o4", "o2", "o1", "o3", "o5"]] },
  "zname_chyby": [
    { "poradi": ["o1", "o2", "o4", "o3", "o5"], "typ_chyby": "nasobil-pred-mocninou" },
    { "poradi": ["o2", "o1", "o3", "o4", "o5"], "typ_chyby": "scital-pred-nasobenim" }
  ]
}
```
**Pravidla pro autora:**
- Klikací místo označ makrem `\op{id}{znak}` (v JSON `\\op`). Mocnina: obal exponent `^{\op{o2}{2}}`. Odmocnina: obal celou `\op{o3}{\sqrt{…}}`. Minus u záporného čísla a zlomkovou čáru **neobaluj** (nejsou to operace ke klikání).
- Nejvýš **6 operací**, nejvýš **4 povolená pořadí**. Nezávislé části (dva součiny, dvě závorky) dávají víc povolených pořadí; vypiš všechna. Stejná přednost vedle sebe ($12 : 4 \cdot 3$) se počítá zleva; jiné pořadí je chyba `neslo-zleva`.
- `spravne.poradi` je **vždy seznam pořadí**, i když je jen jedno.
- `zname_chyby`: jen celá pořadí, která odpovídají skutečné chybě (kódy v `typy-chyb.md` oddíl K). Jiné špatné pořadí = „zatím nesedí“ bez kódu.
- `popis` je pro rodiče a čtečku (`aria-label`), dítěti se nezobrazuje. Nesmí prozradit pořadí („nejdřív mocnina“ ne, „mocnina“ ano).
- Aplikace: dotyk aspoň 40 × 40 px, po chybě jen „zatím nesedí“, štítky zůstanou, nic se nezvýrazní, zvýrazňování ve vzorci (E2) je v tomto kroku vypnuté. Tisk: kroužky nad znaky a pokyn „Očísluj, v jakém pořadí počítáš.“ Papírový režim: rodič vidí správné pořadí a klikne Sedí / Nesedí.
- Tahák: L2/L3 slovy („Co z toho je mocnina? Ta má přednost před krát.“), řešení ve formátu R23 s jednou operací na řádek.
- Pojistka (R30): když interakce nebude hotová a otestovaná do 18. 10., převede autor krok na dlaždice „Co počítáš jako první?“.

## 17. Pole `obrazek` a `obrazek_popis` (Fáze 1, ODPOVED-D bod 1)
**Kdy:** geometrie (T7), kde text sám nestačí. Ne jako ozdoba.

**Formát (na úloze, vedle `zadani`):**
```json
"obrazek": "<svg viewBox=\"0 0 220 140\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"30\" y=\"20\" width=\"160\" height=\"90\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"110\" y=\"130\" text-anchor=\"middle\" font-size=\"14\" fill=\"currentColor\">16 cm</text><text x=\"200\" y=\"70\" font-size=\"14\" fill=\"currentColor\">?</text></svg>",
"obrazek_popis": "Obdélník, delší strana má 16 cm, kratší strana je označená otazníkem."
```
**Pravidla pro autora:**
- Kresli ručně: `rect`, `line`, `polygon`, `circle`, `path` s jednoduchými úsečkami a oblouky, popisky `text`. Žádný export z grafického programu (nese skryté atributy a odkazy).
- Zakázáno (seed odmítne): `<script>`, `<foreignObject>`, `<image>`, `href`, `xlink:href`, `url(…)`, atributy `on…`, `style` s odkazy, barvy natvrdo (`#000`, `black`). Barvy jen `currentColor` (čára, text) a `none`; zvýrazněnou plochu přes `fill="currentColor" fill-opacity="0.15"`.
- Povinné `viewBox`, bez pevné `width`/`height` (aplikace škáluje, tisk max. 60 mm na šířku). Velikost do 8 KB.
- **Kóty nesmí prozradit mezivýsledek** (stejně jako popisky kroků): na obrázku jen to, co je v zadání. Hledaná veličina = `?` nebo písmeno.
- `obrazek_popis` povinně, 1 věta, co je na obrázku a které rozměry jsou dané. Rodič ji čte, když obrázek nevidí, a zobrazí se místo SVG při chybě.
- Obrázek musí sedět se zadáním a řešením (přepočítej rozměry podle obrázku i podle textu).

## 18. Pravidla po testovacím rodiči T1 (R34, platí od T2)
Vzor: `obsah/lekce/F1-T01-L1.json` až `L4.json` po úpravě 25. 9. Čas lekce zůstává 20 min (kostra 00); pilot měří, zkracuje se podle dat. Zjevně dlouhá místa zjednoduš hned: čísla, která dítě rozloží nebo spočítá do 5 minut (ne $143 = 11 \cdot 13$).

**Čtení nahlas**
- `vysvetleni` obsahuje větu **„Čte se: …“**, kdykoli zadání obsahuje zápis, který rodič nahlas přečte špatně: mocninu záporného čísla ($(-6)^2$ vs. $-6^2$), odmocninu z celého výrazu, zlomek s odmocninou, patrový zlomek, výraz s písmenem ($16b^2$), desetinné číslo menší než 1 ($0{,}06$ = šest setin). Výslovnost podle `obsah/cteni-zapisu.md`; chybí-li tam zápis, doplň řádek.
- V textech pro rodiče „mínus“ při čtení čísla a operace („mínus pět“, „pět mínus tři“), „minus“ jako název znaménka („minus krát minus dá plus“, „kolik minusů“).

**Úvod a žebříček „Platí:“**
- `znak` je **konkrétní příklad** (`$42 = 2 \cdot 3 \cdot 7$`, `$12 - 15$`), ne „1. 2. 3.“ ani „+ −“. `text` je mini-věta, které rodič rozumí bez kontextu, v neosobním tvaru.
- Tvrzení o přijímačkách jen ověřená v PDF a nikdy proti cíli lekce. Příklad: v testu je tabulka druhých mocnin čísel 11 až 20 (ověřeno M9D 2026 s. 12), mocniny do deseti se znají zpaměti.

**Otázky**
- Rozcvička: otázky `k` = „A“, „B“, „C“ patří k příkladům, nejsou stupňované L1→L3. Do `vysvetleni` rozcvičky patří věta „Otázky jsou po příkladech: čtěte tu u příkladu, kde se dítě zasekne.“
- Krok `poradi`: jedna otázka pro „nesedí“, ideálně L2 nebo L3, s `k` „Krok 1, když nesedí“ (u rozcvičky „A, když nesedí“). Otázka ukazuje pravidlo (co má přednost, co je pod odmocninou), **správné pořadí do textu nepiš**, aplikace ho rodiči ukáže sama. Při prvním `poradi` v týdnu (L1) vysvětli ve `vysvetleni` jednou větou, na co dítě kliká.
- Otázka typu „který / odkud / čím / kolik“ musí mít odpověď, kterou rodič najde v taháku (v typické chybě, ve vysvětlení nebo v závorce za otázkou v typické chybě). Rodič nesmí stát před otázkou, na kterou sám nezná odpověď. Vyhýbej se otázkám se dvojí odpovědí („Kolik minusů je v součinu?“ → „Kolik záporných čísel násobíš?“).

**Typická chyba**
- Začni „**Podívejte se na obrazovku dítěte.**“ všude, kde rodič chybu pozná podle čísla nebo kliknutí (telefon ukáže jen ✔ / ✘).
- Pokryj nejčastější chybné volby **včetně mezivýsledků** (ne jen konečný výsledek). U detektiva i scénář „dítě označí správný řádek, protože samo dělá stejnou chybu“ a řekni, že ten řádek je správně.
- U kontrolní úlohy: „Během úlohy nic neříkejte, ptejte se až po odevzdání.“

**Semafor**
- **Červená:** po „Dnes už nepokračujte, pochvalte snahu.“ následuje **„Připravte: …“** (předměty a počty), pak cvičení, pak „Potom zopakujte lekci „<tema>“.“ a na konci vždy **„Kontrola pro vás: …“** (co má dítě zjistit nebo říct). Limit 75 slov.
- **Oranžová:** „Kontrola pro vás“ ke každému kroku, který má dítě nahlas říct, ne jen konečný výsledek.
- Rozhodovací klíč pod tlačítky (`obsah/semafor-klic.md`): nejtěžší vyhrává (Nevěděl(a) > Spletl(a) se > Potřeboval(a) otázku > Sám/sama); spletlo se, ale po otázce se opravilo = Potřeboval(a) otázku.

**Pro recenzenta (zatím jen pravidlo, validátor to nekontroluje):** každá chybná dlaždice a každá hodnota `zname_chyby` je v taháku zmíněná aspoň půl větou (typická chyba, řešení nebo otázka).

## 19. Pravidla po testovacím rodiči T4 (platí od T5)
Podklad: `testy/TESTOVACI-RODIC-F1-T04-souhrn.md`.

- **Odkaz na krok:** „v kroku 1 (název kroku)“, nikdy „v první volbě“. Rodič vidí kroky očíslované, ne „volby“.
- **„Kontrola pro vás“ vyjmenuje rozumné cesty**, ne jen jednu: „$2$ (jedno procento je $0{,}2$, nebo deset procent $2$ a z toho polovina)“. Když škola běžně učí i jinou metodu, `otocena_role_odpoved` končí „Správně je i: …“ (např. „čtyřicet děleno jedna celá dvacet pět“).
- **„Zkouška pro vás“ v typické chybě** tam, kde je typická chyba zároveň intuitivní odpověď dospělého (zpětné procento, zdražení a sleva o stejná procenta, průměrná rychlost). Jedna věta s přibližnými čísly, proč chybná odpověď nesedí: „Zkouška pro vás: $75$ a čtvrtina ze $75$ je asi $94$, ne $100$.“
- **„Ústně / nahlas“ jen tehdy, když všechny výpočty jdou zpaměti** (násobky deseti, polovina, čtvrtina, malá násobilka). Jinak „na papír“. Čísla v oranžové nesmí být těžší než v úloze, kterou procvičuje.
- **Kontrolní úloha (U4) nemá aritmetiku těžší než U1–U3.** Dělení volit tak, aby šlo zpaměti nebo přes zlomek, který dítě zná ($9$ z $36$ je čtvrtina). Testuje se téma lekce, ne dlouhé dělení.
- **Desetinná čísla:** každé desetinné číslo, které dítě může zadat jako výsledek nebo které je v otázce či kontrole, je ve slovníčku `obsah/cteni-zapisu.md`, nebo má u sebe „Čte se“. U celých čísel „Čte se“ nepiš.
- **Otázky „zkus / zkontroluj / kolik by bylo“** mají očekávanou odpověď v taháku (typická chyba, řešení, nebo v závorce za otázkou v typické chybě). Platí pravidlo §18, dotáhnout na 100 %.
- **Rozcvička s dlaždicemi:** otázka nesmí vybízet ke zkoušení nabídek naslepo. Kde to jde, začni „Neklikej, spočítej na papíře: …“.
- **Oranžová s instrukcí pro rodiče:** místo „Ukažte dítěti na telefonu“ piš „Přečtěte dítěti: „…““, když by dítě na telefonu vidělo i pokyn pro rodiče. Zadání příkladu v KaTeX dítěti ukázat můžete, instrukci ne.
- **Název lekce (`tema`) musí dávat smysl samostatně**, opakuje se v každé červené („Potom zopakujte lekci „…““).
- **Červená:** pomůcky, které má každá domácnost, nebo náhrada v závorce („25 korun nebo knoflíků“). U zpětných témat (zpětné procento, o třetinu víc) procvičí i zpětný krok.

Nepřevzato (zdůvodnění): `cas_min` lekce = součet + 4 (R34: čas zůstává 20 min, zkracuje se podle dat z pilotu); „záchranná otázka kapitoly“ v `uvod_pro_rodice` (R23: úvod je 1 věta; stejnou otázku nese L1 nebo typická chyba); nové pole `semafor.oranzova_zadani` (řeší ho věta „Přečtěte dítěti“, nové pole by znamenalo změnu schématu i UI).

## 20. Fáze 2 „CERMAT“ (R38, osnova Fáze 2 §3–4)
Jádro je v `obsah/osnova-faze2.md` §3.5 a §4 (schéma podle nich rozšiřuje backend). Tady je, jak to psát. Všechno z §1–19 platí dál, pokud níže není řečeno jinak.

### 20.1 Lekce a úloha: nová pole
| pole | kde | hodnoty | kdy |
|---|---|---|---|
| `typ` | lekce | `bezna` (výchozí, když chybí) \| `blok` \| `simulace` | bloky na čas, simulace |
| `kapitola` | lekce | i pseudo-kapitoly `mix` (bloky, rozbory, poslední rozcvička), `simulace` | vždy |
| `pozice` | úloha | 1–16 (číslo úlohy v rozložení testu 2026) | bloky, simulace, lekce „pozice v testu“ |
| `kapitola` | úloha | kód kapitoly úlohy (SOS a statistiky ji berou místo `mix` / `simulace`) | bloky, simulace, rozbory |
| `body` | krok | celé číslo; součet v úloze = body úlohy v testovém sešitu | jen simulace |
| `postup` | krok | `true` = úloha „uveďte celý postup“ | 2.3, 3.3, 4.1, 4.2 a lekce o archu |
| `pismena` | `vstup` dlaždice | `"A-E"` (5 možností), `"AN"` (2), `"A-F"` (6) | simulace, T5-L2, U3 bloků |
| `rysovani` | `vstup.typ` | dítě rýsuje na papír, rodič porovná | konstrukce (poz. 9–10) |
| `reseni_obrazek` | `tahak` | SVG hotové konstrukce (pravidla jako `obrazek`, §17) | u `rysovani` povinné |
| `kontrola_rodice` | `tahak` | 2–3 otázky pro rodiče ke konstrukci (Sedí / Nesedí), R39 | u `rysovani` povinné |
| `obrazek_mm` | úloha | šířka obrázku v tisku v mm; u konstrukcí měřítko 1 : 1 (výjimka z 60 mm) | konstrukce, grafy podle předlohy (R44) |

### 20.2 Dlaždice s písmeny A–E (`pismena`)
Pevné pořadí (aplikace nemíchá), štítky A)–E) přidá aplikace, `text` je jen hodnota. Pátá (šestá) možnost je **jako v předloze**: v 8 testech 2025/2026 má „jiný…“ jen 14 z 24 úloh 12–14 a u přiřazování ho má jen část; jinde je E (F) obyčejná hodnota (R45). Když předloha „jiný…“ má, drž ho. Každá chybná možnost má `typ_chyby` (typicky `vybral-mezivysledek`, `jina-hodnota-prehledl`, kódy tématu).
- **V běžných lekcích a v semaforu bloků se `pismena` nepoužívá:** `final` je `cislo` a nabídka A)–E) je jen v textu zadání (dítě netipuje).
```json
{
  "id": "final",
  "popisek": "Výsledek",
  "vstup": {
    "typ": "dlazdice",
    "pismena": "A-E",
    "moznosti": [
      { "id": "a", "text": "$15\\ \\text{cm}^2$", "spravne": false, "typ_chyby": "vybral-mezivysledek" },
      { "id": "b", "text": "$120\\ \\text{cm}^2$", "spravne": true },
      { "id": "c", "text": "$136\\ \\text{cm}^2$", "spravne": false, "typ_chyby": "vyska-jako-strana" },
      { "id": "d", "text": "$240\\ \\text{cm}^2$", "spravne": false, "typ_chyby": "trojuhelnik-bez-deleni-dvema" },
      { "id": "e", "text": "jiná hodnota", "spravne": false, "typ_chyby": "jina-hodnota-prehledl" }
    ]
  }
}
```

(Příklad: rovnoramenný trojúhelník, základna 16 cm, rameno 17 cm, výška 15 cm, obsah $\frac{16 \cdot 15}{2} = 120$; $15$ = výška jako mezivýsledek; $\frac{16 \cdot 17}{2} = 136$ = rameno jako výška; $16 \cdot 15 = 240$ = bez dělení dvěma.)

### 20.3 ANO/NE (pozice 11): 3 kroky po 2 dlaždicích
Každé tvrzení = jeden krok (`k1`, `k2`, `final`), dlaždice `"pismena": "AN"` se dvěma možnostmi „pravdivé“ / „nepravdivé“ (štítky A/N přidá aplikace). Popisek kroku je samotné tvrzení (je to zadání, nenapovídá). Nikdy v semaforu, v blocích jen v U3.
```json
{
  "id": "k1",
  "popisek": "11.1 Průměrná výška všech tří dětí je větší než 150 cm.",
  "vstup": {
    "typ": "dlazdice",
    "pismena": "AN",
    "moznosti": [
      { "id": "a", "text": "pravdivé", "spravne": false, "typ_chyby": "prumer-bez-deleni-poctem" },
      { "id": "n", "text": "nepravdivé", "spravne": true }
    ]
  }
}
```

### 20.4 Přiřazování (pozice 15): kroky se stejnou nabídkou
Tři kroky (`k1`, `k2`, `final`), každý `dlazdice` s `"pismena": "A-F"` a **stejnou šesticí** možností ve stejném pořadí (F je jako v předloze: „jiný výsledek“, nebo hodnota, R45). `spravne` a `typ_chyby` se liší podle kroku. V U1 bloků se bere jen jedna položka jako `cislo`.
```json
{
  "id": "k1",
  "popisek": "15.1 Cena po slevě 20 %",
  "vstup": {
    "typ": "dlazdice",
    "pismena": "A-F",
    "moznosti": [
      { "id": "a", "text": "$240$ Kč", "spravne": true },
      { "id": "b", "text": "$320$ Kč", "spravne": false, "typ_chyby": "procento-jako-cislo" },
      { "id": "c", "text": "$280$ Kč", "spravne": false, "typ_chyby": "procento-jako-cislo" },
      { "id": "d", "text": "$360$ Kč", "spravne": false, "typ_chyby": "zdrazeni-sleva-zamena" },
      { "id": "e", "text": "$60$ Kč", "spravne": false, "typ_chyby": "jen-cast-bez-celku" },
      { "id": "f", "text": "jiný výsledek", "spravne": false, "typ_chyby": "jina-hodnota-prehledl" }
    ]
  }
}
```
(Příklad: původní cena 300 Kč. $300 \cdot 0{,}8 = 240$; $300 + 20 = 320$ a $300 - 20 = 280$ (procenta jako koruny); $300 \cdot 1{,}2 = 360$; $300 \cdot 0{,}2 = 60$.)

### 20.5 Konstrukce: `rysovani` + `tahak.reseni_obrazek` + `tahak.kontrola_rodice`
Rozbor v aplikaci přes dlaždice („Na čem leží vrchol C?“, „Kolik řešení má úloha?“), poslední krok `rysovani`: dítě rýsuje na papír a klikne Hotovo; rodič vidí `tahak.reseni_obrazek` a `tahak.kontrola_rodice` a klikne Sedí / Nesedí. Rodič nerýsuje ani nepočítá. Obě pole patří do taháku (R39), úloha je nemá.
```json
{
  "id": "F2-T04-L1-U3",
  "typ": "cermat",
  "pozice": 9,
  "obrazek": "<svg viewBox=\"0 0 400 160\" xmlns=\"http://www.w3.org/2000/svg\">… zadané body a přímky …</svg>",
  "obrazek_popis": "Úsečka BD a přímka p, na které leží vrchol C.",
  "obrazek_mm": 100,
  "kroky": [
    { "id": "k1", "popisek": "Na čem leží vrchol C?", "vstup": { "typ": "dlazdice", "moznosti": [
      { "id": "a", "text": "jen na přímce $p$", "spravne": false, "typ_chyby": "bod-na-jedne-care" },
      { "id": "b", "text": "na přímce $p$ i na Thaletově kružnici nad $BD$", "spravne": true },
      { "id": "c", "text": "na kružnici se středem $B$", "spravne": false, "typ_chyby": "thaletova-kruznice-spatny-stred" }
    ] } },
    { "id": "final", "popisek": "Rýsuj na papír", "vstup": { "typ": "rysovani" }, "spravne": null }
  ],
  "tahak": {
    "reseni_obrazek": "<svg viewBox=\"0 0 400 160\" xmlns=\"http://www.w3.org/2000/svg\">… hotová konstrukce …</svg>",
    "kontrola_rodice": [
      "„Leží bod C na obou pomocných čarách jako na obrázku?“",
      "„Jsou vrcholy označené písmeny?“",
      "„Má dítě stejný počet řešení jako obrázek?“"
    ],
    "reseni": "…",
    "typicka_chyba": "…"
  }
}
```
(`…` v příkladu jen zkracuje; skutečný JSON je celý.)
- `obrazek` zadání a `tahak.reseni_obrazek` mají stejný `viewBox`, aby je rodič porovnal přiložením.
- `obrazek_mm` u konstrukcí = skutečná šířka v mm (měřítko 1 : 1). Rozměry ověř tiskem a pravítkem.
- `tahak.kontrola_rodice`: 2–3 otázky, na které se odpovídá pohledem (ne měřením na desetiny mm). Pořadí: poloha bodu, označení, počet řešení.

### 20.6 Povinný postup (`postup: true`)
Na kroku, u kterého test chce „celý postup“ (2.3, 3.3, 4.1, 4.2). Tisk udělá velký rámeček s linkami „Celý postup“, simulace se rodiče zeptá „Je v rámečku postup, ne jen výsledek?“. V běžných lekcích postup trénuje detektiv („Petrův záznamový arch“) a lekce F2-T05-L1.
```json
{ "id": "final", "popisek": "3.3", "vstup": { "typ": "vyraz", "promenne": ["n"] }, "spravne": { "vyraz": "4n^2" }, "postup": true }
```

### 20.7 Blok na čas (lekce `"typ": "blok"`)
- Lekce: `"typ": "blok"`, `"kapitola": "mix"`, `cas_min` 20 (T5–T6), 18 (T7), 17 (T8–T11). Formát je běžná lekce: 4 úlohy `rozcvicka`, `detektiv`, `cermat`, `semafor`, každá s `pozice` a vlastní `kapitola`.
- **Sloty (osnova §2):** U1 rychlá úloha za 1–2 body (poz. 1–3 nebo jedna položka z 15), ≤ 3 min, 1–2 kroky; U2 detektiv „Petrův záznamový arch“ u úlohy s postupem (poz. 2–4); U3 vícekroková úloha z poz. 5–11 (sem patří ANO/NE a konstrukce); U4 semafor = jeden `final` z poz. 5–8 nebo 12–16, u A–E zadá dítě číslo.
- **Tahák je stejný jako u běžné lekce** (vysvětlení, 3 otázky, otočená role, typická chyba, řešení, semafor). Rodič během bloku mlčí a otázky použije až po odevzdání všech 4 úloh; pruh „Blok na čas“ ukáže aplikace (hláška), do taháku to nepiš.
- **Popisky pozic:** zadání začíná „Úloha jako č. 12 v testu:“ (dítě se učí poznat pozici), popisky kroků mají čísla podúloh jako v testu („6.1“, „6.2“). `uvod_pro_rodice` bloku: „Čtyři úlohy z různých částí testu za 20 minut.“ `uvod_pravidla` volitelně (pořadí práce v bloku).
- `zdroj` u každé úlohy s pozicí: „klon: CERMAT 2026 M9A úloha 12 [12]“.

### 20.8 Simulace (lekce `"typ": "simulace"`, osnova §3)
- **Texty pro rodiny (R38, ODPOVED-D2):** o první simulaci piš „o velikonočním víkendu“. Termín zkoušky je **12. a 13. 4. 2027** (Pavel, 30. 9.); v textech ho uváděj jen tam, kde rodina potřebuje plánovat (poslední týden). V souhrnu simulace je vždy věta **„Bodování je orientační, u zkoušky se může lišit.“** Nikde nepiš hranice typu „stačí na gymnázium“ ani odhad přijetí: o přijetí rozhoduje pořadí uchazečů, ne počet bodů.
- **Dvě navazující lekce** (část 1 = úlohy 1–8, část 2 = úlohy 9–16), každá **25 bodů**, jeden odpočet 70 min bez tvrdého stopu. Doporučeně na papír s tištěným testem a záznamovým archem, který se generuje z kroků (autor ho nekreslí).
```json
{
  "id": "F2-T08-L3",
  "typ": "simulace",
  "faze": "faze2",
  "kapitola": "simulace",
  "tema": "Simulace 1 — úlohy 1–8",
  "cas_min": 70,
  "simulace": { "cislo": 1, "cast": 1, "druha_cast": "F2-T08-L4", "odpocet_min": 70 },
  "ulohy": [
    {
      "id": "F2-T08-L3-U4",
      "typ": "simulace",
      "pozice": 4,
      "kapitola": "rovnice",
      "zdroj": "klon: CERMAT 2025 M9B úloha 5",
      "zadani": "…",
      "kroky": [
        { "id": "k1", "popisek": "4.1", "vstup": { "typ": "zlomek" }, "spravne": { "c": -3, "j": 4 }, "body": 2, "postup": true },
        { "id": "final", "popisek": "4.2", "vstup": { "typ": "cislo" }, "spravne": { "hodnota": -4 }, "body": 2, "postup": true }
      ],
      "tahak": { "reseni": "…", "typicka_chyba": "…" },
      "tisk": { "zadani": "…" }
    }
  ]
}
```
- Úloha simulace = jedna úloha testu, kroky = podúlohy; `popisek` = číslo podúlohy („2.1“), z něj se tvoří arch. `jednotka` u kroku se vytiskne za rámeček.
- **Tahák jen `reseni` a `typicka_chyba`** (+ `reseni_obrazek` a `kontrola_rodice` u konstrukcí). Bez `semafor`, bez otázek L1–L3 a otočené role: rodič během testu nic neříká, klíč se mu odemkne až tlačítkem „Dítě odevzdalo“.
- **Body jen pro rodiče:** `body` u kroků podle „max. n bodů“ v testovém sešitu, rozdělené na podúlohy; součet části = 25. Správný výsledek bez povinného postupu = 0 bodů, částečné body za postup nedáváme. Úloha 11: 3 správně = 4 body, 2 správně = 2, jinak 0. Úloha 15: 2 body za položku. Konstrukce „Sedí“ = plné body. Dítě body nevidí (jen zelené pozice).
- Uzavřené úlohy 11–15 v simulaci: `pismena` (20.2–20.4). Rodič při kontrole klepne na písmeno, které dítě zakřížkovalo, aplikace vyhodnotí sama.
- `tisk.zadani` = zadání jako v testovém sešitu, včetně „V záznamovém archu uveďte celý postup řešení.“ u kroků s `postup`. Klíč se netiskne.
- `typicka_chyba` v simulaci je pro rodičovu kontrolu: „Když dítě napsalo $-\frac{4}{3}$: převrátilo zlomek.“ Nejvýš 2–3 nejčastější chyby, bez otázek.
- `kontrola.poznamka`: body po úlohách a součet 25 (ověř skriptem).

### 20.9 Checklist navíc pro Fázi 2
- [ ] `pozice` a `kapitola` u každé úlohy bloku, rozboru a simulace; `zdroj` s pozicí.
- [ ] `pismena` jen v simulaci, T5-L2 a U3 bloků; nikdy v semaforu.
- [ ] ANO/NE: 3 kroky po 2 možnostech; přiřazování: 3 kroky se stejnou šesticí.
- [ ] `rysovani` má `tahak.reseni_obrazek`, `tahak.kontrola_rodice` a `obrazek_mm`; rozměry ověřené tiskem.
- [ ] Simulace: součet `body` v části = 25, `postup` u 2.3, 3.3, 4.x; tahák jen řešení a typická chyba.
- [ ] Kódy chyb Fáze 2 z `typy-chyb.md` oddíly T–AD.

## 21. Pravidla po testovacím rodiči T7 (obrázky a geometrie, platí od F2)
1. **SVG: každý popisek celý uvnitř viewBoxu** (validátor to hlídá odhadem šířky Sora ≈ 0,62 × `font-size` na znak). Na `overflow: visible` se nespoléhej: tisk a export obrázek ořežou a z „15 m" zbyde „5 m".
2. **SVG na telefonu:** písmo nejméně `13 × šířka viewBoxu / 343` (při viewBoxu 200 široký tedy aspoň 8, doporučeno 13). Víc útvarů v jednom SVG jen když má každý aspoň 80 jednotek výšky, jinak pod sebe nebo zvlášť. Popisky dvou útvarů od sebe aspoň 20 jednotek.
3. **Kóty:** když údaj neplatí pro celou nakreslenou čáru, kresli kótu se zarážkami. Písmena ze vzorce piš přímo k čarám ($a$, $c$, $v$), hledanou veličinu označ „?" nebo písmenem.
4. **Legenda v „Platí:":** u geometrie jeden řádek s pojmy a písmeny útvaru (základna, rameno, výška; $d$ průměr, $r$ poloměr, $o$ obvod, $S$ obsah) a každý nový znak ($\doteq$, $\pi$) s „čte se / znamená".
5. **Jedno slovo, jeden význam v týdnu:** když slovo jinde v týdnu znamená něco jiného (průměr kruhu × aritmetický průměr), použij opis („polovina součtu základen").
6. **Typická chyba: každá chybná hodnota nebo dlaždice má „Zeptejte se: „…" (odpověď)"**, nebo je výslovně ve skupině s jinou, která otázku má. U detektivu vzor „Klikne na N. řádek? Ten je správně. Zeptejte se: „…" (odpověď)", ne vysvětlení, proč to dítě udělá.
7. **Rovnocenné cesty a tvary** (pí krát průměr, „sto pí", jiné rozdělení útvaru) patří do `vysvetleni` nebo „Kontrola pro vás", ne až do otočené role, aby rodič dítě nezastavil u správného postupu.
8. **Červená s pomůckami:** předmět se musí vejít na list A4 / do sešitu; když dítě něco přikládá nebo tvaruje, napiš, jaký tvar má vzniknout. Výsledek musí jít spočítat nebo změřit bez tvarování volného provázku.
9. **Čas:** úloha se dvěma částmi nebo s víc než čtyřmi výpočty zabere 10 min, ruční násobení desetinného čísla přidá 1–2 min. Cermat úloha lekce má nejvýš 4 výpočty, aby lekce držela 20 minut. Výjimky (R44): rýsovací kroky konstrukcí a věrné klony úloh 12–14 a 16 drží rozsah originálu.

## 22. Pravidla po testovacím rodiči F2 (T3–T5, R46)
1. **Blok na čas:** rodič během bloku jen mlčí; aplikace mu ukáže „Odevzdáno x ze 4" a po odevzdání všech 4 úloh (nebo po uplynutí času) ho provede úlohami 1–4 od začátku. V taháku bloku proto `typicka_chyba` U1–U4 začíná „Po bloku: …" (ne „Podívejte se na obrazovku dítěte"). `uvod_pro_rodice` bloku vždy s dobou procházení: „Čtyři úlohy z různých částí testu za 20 minut. Pak spolu 10–15 minut projdete, co nešlo. Když dnes nestíháte, projděte úlohy do 24 hodin — stav zůstane uložený." (Rozpracované sezení platí 24 h, kostra 01; slib „zítra“ by nemusel platit.)
2. **Červená v bloku a simulaci:** místo „Potom zopakujte lekci „Blok N"" napiš název tematické lekce podle `kapitola` úlohy (např. „Potom zopakujte lekci „Soustava: dosaď hotové $y$""), nebo „zkusí tuhle úlohu znovu bez času".
3. **`kontrola_rodice` u rýsování:** každá podmínka ze zadání má jednu kontrolu, kterou rodič udělá bez geometrie a bez měření: pravý úhel = „přiložte roh papíru", stejná délka = „na pohled stejně dlouhé", rovnoběžka = „souběžně jako koleje", bod na čáře = „leží přesně na čáře". Ne jen „jako na obrázku".
4. **`reseni_obrazek`:** víc řešení = každé zvlášť (nebo jedno šedě vyplněné); pomocné čáry tloušťky ≥ 0,6 jednotky; indexy ($N_1$) od písmene aspoň 0,8 × `font-size`.
5. **Konstrukce bez tiskárny:** zadané body a přímky v mřížce 5 mm a v `obrazek_popis` údaje k překreslení (vzdálenosti v cm). Tisk přidá kontrolní úsečku 5 cm.
6. **Čas:** lekce drží 20 minut. Konstrukce se dvěma a více čarami na rýsování ≥ 10 min, úloha 16 se třemi podúlohami ≥ 10 min, detektiv s povinným postupem v bloku 7–8 min. Když součet přesáhne 20, **ubírá se z rozcvičky** (méně příkladů), u běžné lekce případně podúloha, kterou cvičí jiná úloha lekce.
7. **Nabídka A–E zadávaná číslem:** věta pro dítě patří do **zadání**: „… zadej jako číslo. V testu bys své číslo našel(našla) v nabídce a zakřížkoval(a) jeho písmeno; když tam není, platí E." (u E jako hodnoty podle předlohy, R45, bez poslední části). Tahák nechválí nic, co aplikace nevyžaduje; chce-li chválit hledání v nabídce, přidá otázku „Které písmeno bys zakřížkoval(a)?".
8. **Pojmy geometrie v „Platí:"** jednou větou „jak to vypadá" (osa úsečky, Thaletova kružnice, průsečík, lichoběžník, kolmice, rovnoběžka); znaky s „čte se" ($\sqrt{\ }$ „odmocnina z").
9. **`obrazek_mm` u obrázků, kde se počítá** (řady obrazců, šachovnice): 100–120 mm, ne výchozích 60 mm.
10. **Pomůcka „vytištěný list":** v `pomucky` „vytištěný list (tisk ve skutečné velikosti 100 %)".
