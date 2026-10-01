# 03 — Formát obsahu (lekce, úloha, tahák, nápovědy, semafor)

Zdroj pravdy: `obsah/lekce/<id>.json`. Jeden soubor = jedna lekce = 4 úlohy. Text v Markdownu, matematika v `$...$` (KaTeX). Vše česky, tykáme dítěti, rodiči vykáme.

## Lekce
```json
{
  "id": "P1",
  "faze": "pilot",
  "tyden": 1,
  "poradi": 1,
  "tema": "Pořadí operací",
  "kapitola": "pocetni-operace",
  "varianta": "z9",
  "cil_pro_rodice": "Dítě umí bezpečně určit, co počítat první, včetně závorek a mocnin.",
  "uvod_pro_rodice": "2–4 věty: o čem lekce je a na co si dát pozor. Max 60 slov.",
  "cas_min": 20,
  "pomucky": ["sešit", "propiska", "tužka"],   // volitelné; chybí-li, platí tato výchozí trojice
  "ulohy": [ /* přesně 4, v pořadí: rozcvicka, detektiv, cermat, semafor */ ]
}
```

## Úloha
```json
{
  "id": "P1-U3",
  "typ": "cermat",                     // rozcvicka | detektiv | cermat | semafor
  "cas_min": 7,
  "zadani": "Markdown se $matematikou$. U klonu CERMAT držet strukturu originálu, jiná čísla a jména.",
  "zdroj": "klon: CERMAT 2024 M9 úloha 5",   // nebo "vlastni" / "survivor: 2B-04"
  "kroky": [
    {
      "id": "k1",
      "popisek": "Co potřebuješ zjistit nejdřív?",    // NEUTRÁLNÍ, nenapovídá postup
      "vstup": { "typ": "dlazdice", "moznosti": [
        { "id": "a", "text": "$3ab$", "spravne": true },
        { "id": "b", "text": "$3a$",  "spravne": false, "typ_chyby": "vytknul jen část" },
        { "id": "c", "text": "$6ab$", "spravne": false, "typ_chyby": "vzal větší koeficient" }
      ]}
    },
    {
      "id": "k2",
      "popisek": "Mezivýsledek",
      "vstup": { "typ": "cislo", "jednotka": null },
      "spravne": { "hodnota": 12 },
      "zname_chyby": [ { "hodnota": 8, "typ_chyby": "odečetl místo sečetl" } ]
    },
    {
      "id": "final",
      "popisek": "Výsledek",
      "vstup": { "typ": "zlomek" },                 // cislo | zlomek | smisene | dlazdice | text
      "spravne": { "c": 3, "j": 4 },
      "zname_chyby": [ { "c": 6, "j": 8, "typ_chyby": "nezkrátil" } ],
      "kontrola_tvaru": "zakladni_tvar"              // volitelné: zakladni_tvar | soucin | null
    }
  ],
  "tahak": {
    "vysvetleni": "Pro rodiče, 2–4 věty lidsky. Bez žargonu. Max 70 slov.",
    "reseni": "Celý postup krok za krokem s výsledky (rodič to čte, dítě ne).",
    "otazky": [
      "L1 – přeformulování: „Řekni mi vlastními slovy, co po tobě chtějí."",
      "L2 – první krok: „Co bys spočítal jako první a proč?"",
      "L3 – mezikrok: „Tady máš začátek: $3ab \\cdot (\\;\\;\\;)$ — co patří do závorky?""
    ],
    "otocena_role": "„Vysvětli mi, proč jsi vytkl zrovna 3ab a ne 6ab."",
    "typicka_chyba": "Kde dítě nejčastěji chybuje a jak to poznáte."
  },
  "semafor": {
    "zelena": "Zvládnuto. Pochvalte a jděte dál.",
    "oranzova": "Zítra jedno 5minutové cvičení: …",
    "cervena": "Dnes zavřít. Zítra začít znovu od … (vizualizace)."
  },
  "tisk": { "zadani": "Zkrácené zadání pro PDF, bez interaktivních prvků; místo dlaždic nabídka a) b) c)." }
}
```

### Typy úloh
- **rozcvicka** (0–4 min): 2–3 rychlé dlaždice/párování na klíčový pojem lekce. Vstup `dlazdice`.
- **detektiv** (4–9 min): vyřešený příklad „Petra" s jednou typickou chybou; kroky: k1 = „Klikni na řádek s chybou" (dlaždice = řádky), final = opravený řádek/výsledek.
- **cermat** (9–16 min): klon CERMAT úlohy; 2–4 kroky; poslední krok `final`.
- **semafor** (16–20 min): jedna samostatná úloha bez pomoci; jen `final`; z ní se bere hlavní barva lekce (ostatní tři úlohy mají barvu taky, ale souhrn lekce zdůrazňuje tuto).

### Vstupy
- `dlazdice`: 3–4 možnosti, právě jedna správná, každá nesprávná má `typ_chyby`.
- `cislo`: desetinná čárka i tečka; tolerance 0; `jednotka` volitelně zobrazí příponu.
- `zlomek`: `{c, j}`; správnost = rovnost racionálních čísel; `kontrola_tvaru: zakladni_tvar` → správně ale nezkráceno = hláška „Výsledek je správně, ale uprav ho do základního tvaru", počítá se jako správně s poznámkou.
- `smisene`: `{cela, c, j}`.
- `text`: krátký text, `spravne: null`, vyhodnocuje rodič (jen výjimečně, např. „Napiš příběh úlohy bez čísel").

### Pravidla pro popisky kroků
Popisek kroku dítěti NESMÍ prozradit postup („Vypočítej 1 %" je zakázáno). Povolené vzory: „Co potřebuješ zjistit nejdřív?", „Mezivýsledek 1", „Výsledek", „Vyber, co platí". Návodná verze téhož kroku patří do `tahak.otazky` (L2/L3).

## Pravidla pro tahák rodiče
- Rodič čte během lekce na telefonu, jednou rukou. Vysvětlení max 70 slov, otázky vždy jako přímá řeč v uvozovkách, kterou může přečíst nahlas.
- Nikdy neříkat rodiči „vysvětlete dítěti…". Rodič se ptá, dítě vysvětluje.
- Řešení (`reseni`) je sbalené pod tlačítkem „Ukázat řešení" — aby rodič nekoukal na výsledek dřív, než dítě skončí.
- Otázky L1→L3 se zobrazují postupně tlačítkem „Další otázka".

### Doplněno 24. 9. po Pavlově testu (viz reporty/ODPOVED-2026-09-24-test-Pavla.md)
- `uvod_pro_rodice` = 1 věta; volitelné `uvod_pravidla: [{ "znak": "( )", "text": "závorky" }, …]` se vykreslí jako očíslovaný barevný žebříček „Platí:“. Pravidla pro rodiče („nic nepočítáte, jen se ptáte“) přidává aplikace, nejsou v JSON.
- `tahak.vysvetleni` neopakuje úvod lekce.
- Hlavní výraz v zadání je vždy na vlastním řádku (`$$…$$`); vzorce se nezalamují.
- Zlomky všude jen v české podobě: čitatel nad jmenovatelem se zlomkovou čarou (`$\frac{3}{4}$`, v `uvod_pravidla.znak` rovněž `$\frac{3}{4}$`). Nikdy lomítko `3/4` ani unicode znaky (¾, ½) — platí pro zadání, dlaždice, tahák, řešení, úvod i tisk (doplněno 25. 9., test Pavla 3).
- `tahak.reseni`: jedna úprava na řádek, vysvětlivka se vykreslí menším písmem pod výpočtem (formát v SABLONA.md).
- Volitelné pole lekce `pomucky` (seznam krátkých názvů, např. `["sešit", "propiska", "tužka", "pravítko"]`). Chybí-li, platí výchozí sešit, propiska, tužka. Žák je vidí jako checklist „Připrav si“ před 1. úlohou, tisk jako řádek pod záhlavím (doplněno 25. 9., test Pavla 3, R29).

### Doplněno 25. 9. (ODPOVED-2026-10-05-D, Fáze 1)
- Kapitoly `pomer` a `slovni-ulohy` platí pro lekce i diagnostiku.
- Podrobnosti, dobré a špatné příklady: `obsah/SABLONA.md` §15–17. Tady je závazné jádro.

**Vstup `vyraz`** — odpověď je algebraický výraz (proměnné `x`, `y`, …; mocniny s celým exponentem; závorky).
```json
{ "id": "final", "popisek": "Výsledek",
  "vstup": { "typ": "vyraz", "promenne": ["x"] },
  "spravne": { "vyraz": "2x" },
  "zname_chyby": [ { "vyraz": "12x", "typ_chyby": "scital-pred-nasobenim" } ],
  "kontrola_tvaru": null }
```
- Zápis dítěte i autora se normalizuje: mezery pryč, `·` `*` `⋅` = krát, implicitní násobení (`3x`, `2(x+1)`, `x(x-1)`), `x²` `x³` = `x^2` `x^3`, `−` = `-`, desetinná čárka = tečka.
- Správnost = shoda hodnot při dosazení 3 sad hodnot; výchozí `x = -3`, `2`, `\frac{1}{2}` (u víc proměnných cyklicky posunuté: `y = 2, \frac{1}{2}, -3`). Autor smí dát vlastní `vstup.dosazeni`, vždy aspoň 1 záporné a 1 neceločíselné. `zname_chyby` se porovnávají stejně.
- Počet členů (sčítanců na nejvyšší úrovni, mimo závorky) odpovědi > počet členů `spravne.vyraz` a hodnoty sedí → „Výsledek je správně, ale ještě ho zjednoduš“, počítá se jako správně s poznámkou. `kontrola_tvaru`: `null` | `bez_zavorek` (roznásobení; odpověď se závorkou = správně s poznámkou „roznásob závorku“) | `soucin` (vytýkání; odpověď musí být součin, jinak nesedí).

**Vstup `poradi`** — dítě kliká na operace ve výrazu v pořadí, v jakém je počítá. Jen `k1` nebo krok rozcvičky, nikdy semafor ani detektiv; nejvýš 6 operací, nejvýš 4 povolená pořadí.
```json
{ "id": "k1", "popisek": "Klikni na početní operace v pořadí, v jakém je počítáš.",
  "vstup": { "typ": "poradi",
    "vyraz": "\\op{o3}{\\sqrt{10^{\\op{o1}{2}} \\op{o2}{-} 19}}",
    "operace": [ { "id": "o1", "popis": "mocnina" }, { "id": "o2", "popis": "odčítání" },
                 { "id": "o3", "popis": "odmocnina" } ] },
  "spravne": { "poradi": [["o1", "o2", "o3"]] },
  "zname_chyby": [ { "poradi": ["o3", "o1", "o2"], "typ_chyby": "odmocnil-pred-vypoctem-pod-ni" } ] }
```
- Klikací místo = makro `\op{id}{znak}` ve výrazu; id v makrech = id v `operace`; každé pořadí je permutace všech id; žádná známá chyba se nerovná správnému pořadí (kontroluje seed). `popis` čte jen rodič a čtečka.
- Dotyková plocha aspoň 40 × 40 px; po chybném pokusu jen „zatím nesedí“, štítky zůstanou, nic se nezvýrazní; zvýrazňování ve vzorci (E2) je v tomto kroku vypnuté. Tisk: kroužky nad znaky; papírový režim: rodič vidí správné pořadí a klikne Sedí / Nesedí.

**Pole úlohy `obrazek` + `obrazek_popis`** — obrázek pod zadáním (žák, „Co vidí dítě“, tisk).
```json
"obrazek": "<svg viewBox=\"0 0 200 120\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"20\" y=\"20\" width=\"160\" height=\"80\" fill=\"none\" stroke=\"currentColor\"/><text x=\"100\" y=\"115\" text-anchor=\"middle\" fill=\"currentColor\">16 cm</text></svg>",
"obrazek_popis": "Obdélník s delší stranou 16 cm, kratší strana není popsaná."
```
- Inline SVG kreslené autorem ručně (jednoduché útvary, kóty jako `<text>`). Zakázáno: `<script>`, `<foreignObject>`, `href`/`xlink:href`, externí odkazy, `url(…)`, obsluha událostí (`on…`), barvy natvrdo (jen `currentColor` nebo CSS proměnné). Povinné `viewBox`, max. 8 KB. Seed a DOMPurify (profil SVG) jiné odmítnou.
- `obrazek_popis` je povinný (1 věta), pro rodiče a jako náhrada, když se SVG nevykreslí. Kóty ani popis nesmí prozradit mezivýsledek. V tisku nejvýš 60 mm na šířku.

### Doplněno 25. 9. (Fáze 2, R38)
- Lekce `typ`: `bezna` | `blok` | `simulace`; pseudo-kapitoly `mix`, `simulace`; úloha `pozice` (1–16) a `kapitola`; krok `body` (jen simulace) a `postup: true`.
- Dlaždice `pismena` (`A-E`, `AN`, `A-F`, pevné pořadí): výběr A–E, ANO/NE = 3 kroky po 2 dlaždicích, přiřazování = kroky se stejnou nabídkou. Nový vstup `rysovani` (dítě rýsuje na papír, rodič porovná s `tahak.reseni_obrazek` podle `tahak.kontrola_rodice`, Sedí / Nesedí), `obrazek_mm` pro tisk 1 : 1.
- Simulace = 2 lekce (úlohy 1–8 a 9–16, po 25 bodech), jeden odpočet 70 min, tahák jen řešení a typická chyba, body vidí jen rodič. Podrobnosti: `obsah/osnova-faze2.md` §3–4 a `obsah/SABLONA.md` §20.

## Klonování CERMAT úloh (autor úloh)
- Držet strukturu, počet kroků, typ čísel a obtížnost originálu. Změnit čísla, jména, kontext (Pepa→Karel, zedníci→kadeřníci). Výsledek musí vycházet „hezky" jako v originálu.
- Uvést `zdroj` (ročník, varianta, číslo úlohy). Nikdy nekopírovat zadání doslova.
- Distraktory u dlaždic = skutečné typické chyby, ne náhodná čísla.

## Diagnostika (Fáze 1, týden 0) — stejný formát
- 20–25 úloh, jen `final` krok, bez taháku, každá se `zname_chyby` s `typ_chyby`. Kapitoly: početní operace, celá čísla, zlomky, desetinná čísla, poměr, procenta, jednotky, slovní úlohy, výrazy, rovnice, geometrie základy (kódy `pomer`, `slovni-ulohy` doplněny 25. 9., ODPOVED-D).
- Report rodiči (automaticky): per kapitola jistota/nejistota, 3 nejčastější typy chyb, doporučení „na které týdny Fáze 1 dát důraz". Pavel do reportu nevstupuje.

## Kontrola obsahu (recenzent) — povinné pole v každém JSON
```json
"kontrola": { "jistota": "jista",  // jista | stredni | nizka
              "poznamka": "co bylo sporné", "zkontroloval": "recenzent", "datum": "2026-09-26" }
```
- `jista` → uzavřeno. `stredni` → Opus vyřeší sám a přepíše na `jista` s poznámkou. `nizka` (nebo Opus nevyřešil) → řádek do `reporty/PRO-PAVLA.md` s odkazem na úlohu.
