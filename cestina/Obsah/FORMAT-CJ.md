# Formát lekce češtiny v MVP — závazný převod SABLONA-CJ na formát Matematiky

Verze 1.2, 30. 9. 2026 (1.2 = doplněn §6 tisk diktátu, poslechu, doplňovačky a čárek). Autor: vedoucí výroby (Opus). Stav: **potvrzeno Fablem 30. 9. (KONTROLA-2026-09-30 A1), závazné**; SABLONA-CJ je jen výchozí náčrt.

`SABLONA-CJ.md` popisuje jen rozdíly proti Matematice: „Základ je `obsah/SABLONA.md` + `obsah/schema.json`“. Tento soubor je spojuje. Říká, jak přesně vypadá JSON lekce češtiny, aby ho beze změn vykreslily stávající stránky žáka, rodiče i tisku. Kde se příklad v SABLONA-CJ liší od formátu Matematiky, platí formát Matematiky a rozdíl je v tabulce v §9.

- Soubor lekce: `obsah/cestina/lekce/cj-t<týden>-l<lekce>.json`, lekce se číslují 1–32 průběžně.
- Schéma: společné `obsah/schema.json`, větev `lekceCestina`.
- Kontrola: `node supabase/seed/seed-lekce.mjs --adresar obsah/cestina/lekce --jen-validace` a `npm test`.

## 1. Lekce

```json
{
  "id": "cj-t1-l1",
  "predmet": "cestina",
  "faze": "zaklady",
  "tyden": 1,
  "poradi": 1,
  "tema": "Podstatné jméno: poznám ho",
  "kapitola": "slovni-druhy",
  "cil_pro_rodice": "Dítě ve větě najde všechna podstatná jména testem ten, ta, to.",
  "uvod_pro_rodice": "Dnes se dítě učí poznat podstatné jméno jedním testem: dá se před něj říct „ten, ta, to“ a ukázat na to?",
  "uvod_pravidla": [
    { "znak": "Podstatné jméno = název", "text": "co to je" },
    { "znak": "Jde před něj říct ten/ta/to?", "text": "test" },
    { "znak": "ten pes, ta radost, to plavání", "text": "příklad" }
  ],
  "slovnicek_pro_rodice": { "podstatné jméno": "název osoby, zvířete, věci, vlastnosti (radost) nebo činnosti (plavání)" },
  "pomucky": ["sešit", "propiska"],
  "cas_min": 30,
  "vychozi_text": null,
  "ulohy": [ "… 6 úloh …" ],
  "kontrola": { "jistota": "jista", "poznamka": "…", "zkontroloval": "vedouci", "datum": "2026-09-29",
                "zdroj": ["https://prirucka.ujc.cas.cz/?slovo=zahrada"], "testovaci_rodic": null }
}
```

| pole | pravidlo |
|---|---|
| `id` | `cj-t<1–8>-l<1–32>` (lekce průběžně podle OSNOVY). |
| `predmet`, `faze` | vždy `"cestina"`, `"zaklady"`. |
| `tyden` | 1–8. `poradi` = pořadí lekce **v týdnu** 1–4 (DB má `poradi` 1–4; číslo lekce 1–32 je v `id`). |
| `kapitola` | podle týdne: `slovni-druhy` (t1, t4), `podstatna-jmena` (t2), `vzory` (t3), `slovesa` (t5), `vyjmenovana-slova` (t6), `podmet-prisudek` (t7), `souveti` (t8). |
| `cil_pro_rodice` | `cil` lekce z TYDEN-x.md, jedna věta o pozorovatelném chování. |
| `uvod_pravidla` | **přesně 3 řádky** (SABLONA-CJ §1): `znak` = pravidlo / test / příklad, každý ≤ 36 znaků (velký text žebříčku „Platí:“). `text` = „co to je“ / „test“ / „příklad“ (malý text; rodič tak ví, co čte). |
| `slovnicek_pro_rodice` | každý gramatický pojem, který se v lekci objeví u rodiče, s lidským překladem. Rodič ho vidí pod „Co ta slova znamenají“. |
| `cas_min` | 30 = součet úloh: rozcvička 4, nová 5 + 5 + 5, detektiv 5, kontrolní 6. |
| `kontrola` | jako Matematika (`jistota`, `poznamka`, `zkontroloval`, `datum`) + **`zdroj`** (pole odkazů do příručky ÚJČ, povinné pro `jista`) + `testovaci_rodic` (`null` nebo `{srozumitelnost 1–5, cas_min, musel_neco_vedet}`). |

## 2. Úlohy — 6 v pořadí `rozcvicka`, `nova`, `nova`, `nova`, `detektiv`, `kontrolni`

Pole úlohy stejná jako v Matematice: `id` (`cj-t1-l1-U1`…`U6`), `typ`, `cas_min`, `zadani`, `zdroj` („vlastni“), `kroky`, `tahak`, `semafor`, `tisk`.

Nová pole:
- **`cil`**: jedna věta, co úloha měří. Čte ho QA a admin, dítě ani rodič ho nevidí.
- **`tydenni: true`**: jen úloha 6 v lekcích 4, 8, 12 …
- **`semafor_tydne`**: jen u týdenní kontroly, `{zelena|oranzova|cervena: {podminka, min_spravne, doporuceni}}`.

- `kontrolni` má v aplikaci stejnou roli jako `semafor` v Matematice: z ní se bere hlavní barva lekce a platí pro ni R55 a R58 (rodič mlčí do odevzdání).
- `nova` se u rodiče zobrazuje jako „Nová látka“.
- Detektiv má **2 kroky**: `k1` = najdi chybné slovo (klik nebo dlaždice), `final` = proč / oprava (vždy dlaždice).
- Poslední krok každé úlohy má id **`final`** (podle něj se počítá semafor), ostatní `k1`, `k2` ….

## 3. Vstupy

### 3.1 Dlaždice = dlaždice Matematiky (výběr jedné možnosti)
```json
{ "typ": "dlazdice", "moznosti": [
  { "id": "a", "text": "stůl", "spravne": true },
  { "id": "b", "text": "velký", "spravne": false, "typ_chyby": "sd-pridavne-za-podstatne" },
  { "id": "c", "text": "rychle", "spravne": false } ] }
```
- 2–6 možností, právě 1 správná.
- Rozdíl proti Matematice: špatná možnost **smí být bez `typ_chyby`**, to je „obecná chyba“ podle TYDEN-1. Kódy se berou z `cestina/Obsah/TYPY-CHYB.md`.
- ANO/NE = dvě dlaždice „ano“ / „ne“ (bez `pismena`).
- **Přiřazení** (`prirazeni` ze ZADANI §6.1, v Matematice F2 „kroky se stejnou nabídkou“) = několik kroků dlaždic se stejnými možnostmi ve stejném pořadí.

### 3.2 Nové vstupy (vyhodnocuje `web/js/vyhodnoceni-cj.js`)
Společné: `spravne` podle typu, `zname_chyby` nejvýš 4.

| typ | vstup | `spravne` | známá chyba |
|---|---|---|---|
| `dlazdice_vice` | `moznosti: ["běhání", …]` (řetězce), volitelně `volitelne: [...]` | pole řetězců | `hodnota` (přesná množina) **nebo** `navic: [...]` (chyba, když dítě vybere některý) **nebo** `chybi: [...]` (chyba, když některý vynechá) |
| `klik_ve_textu` | `text`, `cil: "slova"｜"mezery"`, `min`, `max`, volitelně `volitelne: [indexy]` | pole indexů slov (od 0, interpunkce se nepočítá) | jako `dlazdice_vice`, prvky jsou indexy |
| `oznac_role` | `text`, `slova: [indexy]`, `role: [...]` nebo `{kategorie: [...]}` | `{"<index>": role}` nebo `{"<index>": {kategorie: hodnota}}` | `hodnota: {"<index>": chybná role}`, páruje se po slovech |
| `doplnit_pismeno` | `text` s `_`, `mezery: [{i, moznosti}]` | pole písmen po mezerách | `hodnota: [..., null = jedno co]` |
| `kratky_text` | `napoveda_formatu` | řetězec (+ `varianty`, `ignorovat_velikost`) | `hodnota` řetězec |
| `seradit` | `polozky: [...]` | pole v pořadí | `hodnota` pole |
| `poslech` | `audio`, `prepis`, `max_prehrani`, `vnoreny_vstup`, volitelně `otazka` | podle vnořeného vstupu (u dlaždic v `moznosti`) | podle vnořeného vstupu |
| `diktat` | `vety: [{audio, text}]` (1–4), `max_prehrani`, `hodnotit_interpunkci`, `hodnotit_velikost` | `null` | `chyby_ocekavane: [{veta, slovo, typ_chyby}]` |

- `seradit`: položky ve vstupu jsou vždy **zamíchané** (validátor odmítne `polozky` ve správném pořadí). Pravidlo autora, KONTROLA A8.
- `volitelne` = slovo, které smí i nemusí být vybrané („se“ u zvratného slovesa: obojí je správně, zásada 8).
- `seradit` je řazení položek (pádové otázky, týden 2). Jméno `poradi` je obsazené vstupem Matematiky (klikání na operace).
- Audio: soubor `web/audio/cestina/t<týden>/l<lekce>-<krok>.mp3`, v JSON bez `web/`: `"audio": "audio/cestina/t1/l2-u4.mp3"`. Web se nasazuje ze složky `web/`, proto audio nemůže být v `obsah/`. Každý odkaz má řádek v `cestina/Obsah/AUDIO.md`.
- Vyhodnocení vrací kontrakt Matematiky `{spravne, typ_chyby, poznamka, neplatne}`. `typ_chyby` = první známá chyba, všechny jsou navíc v `chyby`. Neúplná odpověď je `neplatne`: aplikace ji nepočítá jako pokus a vyzve k doplnění.
- Papírový režim: rodič u nových vstupů vidí správnou odpověď a klikne Sedí / Nesedí (hodnota `{ "rodic": "sedi" }`).

## 4. Tahák — pravidla Matematiky (`obsah/SABLONA.md` §8, §18, §19) + SABLONA-CJ §6.7
- `vysvetleni` (≤ 70 slov), `reseni`, **3** `otazky`, `otocena_role`, `otocena_role_odpoved`, `typicka_chyba`. Všechna pole jsou povinná.
- Otázky a otočená role jsou přímá řeč v „…“ (≤ 25 slov). Dítěti tykáme **bez rodu**: ne „Jak jsi poznal?“, ale „Jak to poznáš?“.
- Pořadí otázek (ZADANI §6.7, manuál): 1 obecná („Co je podstatné jméno? Řekni to vlastními slovy.“) → 2 test na konkrétním slově → 3 nejbližší nápověda. Otázka nikdy neříká správnou odpověď.
- Rozcvička: otázky po příkladech, `{ "k": "A", "text": "„…“" }`, `k` = A, B, C (nebo „A a B“). Řady rozcvičky se v zadání jmenují A) B) C) D), popisek kroku „Řada A“.
- `typicka_chyba` (≤ 50 slov; u kontrolní ≤ 90 kvůli větám R55, KONTROLA A7):
  - začíná **„Podívejte se na obrazovku dítěte.“**, pak co dítě udělá a „Zeptejte se: „…““, v závorce proč;
  - u kontrolní úlohy začíná větou z R55 („Kontrolní úloha: než dítě odevzdá, mlčte; …“);
  - každá chybná volba a každá `zname_chyby` je v taháku aspoň zmíněná.
- `reseni`: správná odpověď a proč, jeden řádek = jedna položka. Rozcvička po oddílech `#### A) …`. Poslední řádek `**Výsledek:** …`.
- Pojmy: každý gramatický pojem u rodiče má lidský překlad v závorce nebo je ve `slovnicek_pro_rodice` (zásada 9).

## 5. Semafor — texty podle `obsah/SABLONA.md` §9 a §18 (řetězce, ne objekty)
- Rodič smí dítěti v oranžové/červené přečíst pár slov nebo jednu větu na zítřejší pětiminutovku (ZADANI §3 bod 1, KONTROLA A2). Texty lekce (poslech, diktát) nečte nikdy.
- Žádné „aplikace zařadí / nabídne“: aplikace nic nezařazuje, konkrétní cvičení je přímo v textu (KONTROLA A5). `semafor_tydne` zůstává v datech, aplikace ho nepočítá.
- `zelena` (≤ 25 slov): „Výborně — …“, pochvala za postup + „jděte dál“. U kontrolní: „Zítra můžete pokračovat další lekcí.“
- `oranzova` (≤ 60 slov):
  - „Zítra 5 minut, jen ústně. …“ a konkrétní cvičení bez gramatiky pro rodiče (např. „Přečtěte dítěti tři slova: … U každého řekne, jestli jde říct ten/ta/to.“);
  - na konci **„Kontrola pro vás: …“** (správná odpověď, R8).
- `cervena` (≤ 75 slov):
  - „Dnes už nepokračujte, pochvalte snahu.“ + „Připravte: …“ (předměty z domácnosti) + cvičení s věcmi;
  - „Potom zopakujte lekci „<tema>“.“ a na konci „Kontrola pro vás: …“.
- „Kontrola pro vás“ = správné řešení + jedna věta proč, bez pojmů nebo s pojmem a překladem (SABLONA-CJ §6.7). Je vždy poslední.
- Aplikace kontrolu dítěti neukazuje, je sbalená u rodiče (R8).

## 6. `tisk.zadani`
- Úloha řešitelná tužkou.
- Klik ve textu → „Podtrhni …“ a věta. Dlaždice → „Zakroužkuj: a) … b) …“. Doplň písmeno → slova s „_“. Poslech a diktát → „Poslouchej nahrávku (pustí rodič) …“ + místo na odpověď.
- Nikdy řešení.
- Doplnění v1.2 (dodávka 2, `web/js/tisk-cj.js`):
  - **Diktát:** jen pokyn („Poslouchej větu (pustí ti ji rodič) a napiš ji.“), může být i prázdné. Linky („Věta n“ + 2 linky) doplní tisk sám. **Text vět nikdy** — tiskne se jen na samostatný poslední list „Pro rodiče“.
  - **Poslech:** pokyn + otázka + „Zakroužkuj: a) … b) …“. Chybí-li pokyn, tisk ho doplní. Jednotlivá slova z nahrávky v nabídce smí být, přepis nikdy (jde jen na list „Pro rodiče“).
  - **Doplň písmeno:** stejný text jako `vstup.text`, každé chybějící písmeno jedno `_` (i na začátku slova: „_hodil“); tisk z něj udělá linku na písmeno. `___` (3 a víc) = linka na celé slovo. Nabídku napiš do pokynu („Doplň i, nebo y.“).
  - **Čárka (`klik_ve_textu`, `cil: "mezery"`):** pokyn, pak věta na **samostatném odstavci**, stejná slova jako `vstup.text`, **bez hledaných čárek**. Tisk jí zvětší mezery.
  - Validátor hlásí chybu, když je věta diktátu nebo přepisu (aspoň 3 slova) v `zadani`, `tisk.zadani`, popisku nebo otázce kroku.

## 7. Texty pro dítě
- Tykání, bez rodu.
- `popisek` kroku nenapovídá: „Tvoje odpověď“, „Řada A“, „Klikni na slovo, které Petr označil špatně.“, „Proč to není podstatné jméno?“. Ne „Vyber sloveso“ u úlohy, kde se sloveso hledá.
- Věty ze světa 12–14letých, žádná reálná jména. Jména: Tomáš, Lucka, Honzík, Klára. Detektiv je vždy Petr.
- Jen jevy z předchozích lekcí (OSNOVA). Žádné i/y v kořeni jako úloha před týdnem 6.

## 8. Co dělá aplikace (pro programátory)
- `lekce.html?lekce=cj-t1-l1&lokalne=1` načte `obsah/cestina/lekce/cj-t1-l1.json`. Do DB se čeština nahraje až po migraci `supabase/migrations/0007_predmet.sql` a souhlasu Pavla. Seed ji zatím odmítne nahrát.
- Vstupy dítěte: `web/js/vstupy-cj.js`. Rozhraní je stejné jako u vstupů v `lekce.js`: `{uzel, pole, hodnota() → {vyhodnoceni, ulozeni}, oznac(druh, hodnota), zamknout(), fokus()}`.
- Rodič: „Co vidí dítě“ ukazuje nové vstupy jen ke čtení. Poslech má přepis sbalený. Stav žáka ukazuje, co dítě vybralo, co chybí a co je navíc, u známé chyby s otázkou ze slovníku.

## 9. Rozdíly proti příkladům v SABLONA-CJ (k potvrzení Fablem)
| SABLONA-CJ | tady | proč |
|---|---|---|
| `uvod_pravidla: ["…", "…", "…"]` | `[{znak, text}] × 3` | stejný žebříček „Platí:“ jako Matematika (R23, R42: znak ≤ 36) |
| `semafor.zelena: {kontrola_pro_vas}` | řetězec s „Kontrola pro vás:“ na konci | R8: rodičova stránka kontrolu sama oddělí a sbalí |
| `kontrola.status` | `kontrola.jistota` + `zdroj` + `testovaci_rodic` | seed, admin a validátor čtou `jistota` |
| `dlazdice` s `moznosti: ["…"]` a `spravne: "…"` (i ve `vnoreny_vstup` poslechu) | dlaždice Matematiky (`{id, text, spravne, typ_chyby}`) | stejný vstup, vykreslení i vyhodnocení jako v Matematice |
| `prirazeni` | kroky dlaždic se stejnou nabídkou | tak to dělá Matematika F2 (SABLONA §20.4) |
| `poradi` (seřaď) | `seradit` | `poradi` je vstup Matematiky (klikání na operace) |
| `pismena` A–D, ANO/NE | dlaždice (ANO/NE = 2 dlaždice) | Matematika má A–E jen ve F2 formátu testu |
| id úloh `cj-t1-l1-u2`, kroky `cj-t1-l1-u2-k1` | `cj-t1-l1-U2`, kroky `k1` … `final` | aplikace hledá krok `final` (semafor) a úlohy `<lekce>-U<n>` |
| `obsah/audio/cestina/…` | `web/audio/cestina/…` | web se nasazuje jen ze `web/` |
| `poradi` lekce 1–32 | `poradi` 1–4 v týdnu, číslo lekce v `id` | DB `lekce.poradi` 1–4, přehled řadí podle týdne |
