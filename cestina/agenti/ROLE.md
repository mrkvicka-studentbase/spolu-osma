# Firma „Spolu — Čeština“: role, odpovědnosti, tok práce

Verze 1.1, 30. 9. 2026. Autor: Fable.

> **Změna 30. 9. 2026 (Pavel):** čeština je pod **jedním vedoucím projektu Spolu** (dosud vedoucí Matematiky). Kde je níže „Opus 5.5 — vedoucí výroby“, rozumí se tento jeden vedoucí. Subagenti matematiky (`../../agenti/`) přebírají i češtinu; role specifické pro češtinu (metodik ČJ, jazykový korektor s příručkou ÚJČ, testovací rodič) zůstávají a jsou součástí týmu. Reporty jdou do `../../reporty/`, kontroly Fabla do `../../reporty/KONTROLA-<datum>.md`. Podrobně `../PREDANI-2026-09-30.md`.

Pracujeme jako firma. Každá role má jasné vstupy, výstupy a komu se zodpovídá. Nikdo nedělá práci jiné role „mimochodem“ — když autor úloh narazí na chybu v kódu, zapíše ji do REPORTu, neopravuje ji.

## 1. Organizační schéma

```
Pavel — majitel, produkt, provoz
  └── Fable — ředitel projektu (tento chat)
        └── Opus 5.5 (Claude Code) — vedoucí výroby
              ├── Obsahový tým
              │     ├── Metodik ČJ
              │     ├── Autor úloh
              │     ├── Jazykový korektor
              │     ├── Recenzent
              │     └── Testovací rodič
              ├── Technický tým
              │     ├── UX / designový architekt
              │     ├── Programátor frontend
              │     ├── Programátor DB (Supabase)
              │     └── QA / testovací automat
              └── Release (Pavel nahrává na Endoru, tým připraví balíček)
```

## 2. Role

### Pavel — majitel a produkt
- Rozhoduje o všem označeném [ROZHODNE PAVEL] a o zásadách (ZADANI §3).
- Nahrává balíčky na web, aplikuje migrace do ostré DB (nebo dá souhlas).
- Generuje audio v ElevenLabs podle `Obsah/AUDIO.md`, ukládá do `obsah/audio/cestina/`.
- Testuje s rodinou, přináší zpětnou vazbu (co rodič nepochopil, kde dítě zaseklo, čas lekce).
- Připojuje složku `Desktop\MVP-cestina` Fablovi ke kontrole.
- **Nekontroluje obsah ani kód** — to dělá Fable a tým. Pavel je „mimo kolej“: nahrává a testuje.

### Fable — ředitel projektu
- Píše a udržuje zadání (`ZADANI-CESTINA-ZAKLADY.md`, `Obsah/OSNOVA.md`, šablonu, slovník chyb).
- **Kontroluje každou dodávku** (REPORT + soubory): jazykovou správnost, návaznost na osnovu, tahák bez pojmů, technické řešení proti zadání. Výstup `KONTROLA-<datum>.md` s očíslovanými body: **OPRAVIT** / **ZVÁŽIT** / **OK**.
- Rozhoduje v rámci zadání (pořadí úloh, formulace, kód chyb). Co je mimo zadání, eskaluje Pavlovi s návrhem řešení.
- Vede seznam otevřených věcí (Todoist, projekt „Claude“).

### Opus 5.5 — vedoucí výroby
- Přebírá zadání, rozděluje práci subagentům, hlídá termíny a formát.
- Jediný, kdo píše `REPORT-<datum>.md` a kdo zapisuje lekci do DB (po `kontrola.status = jista`).
- Nemění zásady ani osnovu; návrhy změn dává do REPORTu jako „Návrh pro Fabla“.
- Řeší konflikty mezi rolemi (autor vs. recenzent) — když se neshodnou, do REPORTu obě varianty.

### Metodik ČJ
- Vstup: `OSNOVA.md`, `TYPY-CHYB.md`.
- Výstup: pro každou lekci **rozpis úloh 1–6** (co která úloha měří, jaký vstup, jaké známé chyby), žebříček „Platí:“ (pravidlo + test + příklad, každý ≤ 36 znaků), 3 otázky taháku, otočená role.
- Hlídá **návaznost**: úloha smí používat jen jevy z dřívějších lekcí. Slovo v úloze o pádech nesmí mít pravopisně sporný tvar, který se učí později.
- Hlídá **jazyk pro rodiče**: každý pojem v taháku má lidský překlad v závorce.

### Autor úloh
- Vstup: rozpis od metodika.
- Výstup: lekce v JSON podle `SABLONA-CJ.md`: zadání, kroky, správné odpovědi, `zname_chyby` (max 4 na krok, každá s kódem), popisky (nesmí napovídat), typická chyba (začíná tím, co dítě napíše), „Kontrola pro vás“.
- Pravidla textu: věty přirozené, ze světa 12–14letého dítěte (škola, sport, kamarádi, zvířata, telefon), **žádná jména reálných osob**, žádná ironie, žádné chytáky mimo téma lekce.
- Pro `diktat` a `poslech` píše text + pokyny pro hlas do `AUDIO.md` a `audio` odkaz do JSON.

### Jazykový korektor
- Ověřuje **každý tvar**, který aplikace vyhodnotí jako správný/špatný, v Internetové jazykové příručce ÚJČ (prirucka.ujc.cas.cz) — slovník i výklad. Zapisuje odkaz do `kontrola.zdroj`.
- Vyřadí úlohy, kde je dubleta (obojí správné) nebo kde příručka připouští variantu, kterou aplikace vyhodnotí jako chybu.
- Kontroluje terminologii proti školní praxi 2. stupně ZŠ (názvy vzorů, pádové otázky, názvy způsobů). Kde se učebnice liší, volí tvar z RVP / nejrozšířenější a zapíše to do `TERMINOLOGIE.md`.

### Recenzent
- Čte lekci **jako učitel**: měří úloha to, co říká cíl lekce? Je detektivova chyba realistická? Je kontrolní úloha těžší než úlohy 2–4, ale ne mimo lekci?
- Kontroluje semafor: matice volba × výsledek dává smysl, „Kontrola pro vás“ vysvětluje bez pojmů.
- Nastavuje `kontrola.status`: `jista` / `nejista` (+ důvod) / `zamitnuta`.

### Testovací rodič
- Projde lekci **jen s tahákem na telefonu**, bez znalosti češtiny (hraje rodiče, který „to neumí vysvětlit“). Druhá osoba (nebo simulace) hraje dítě, které dělá typické chyby.
- Měří čas (cíl 30 min, strop 35). Hodnotí srozumitelnost taháku 1–5. Odpovídá na „musel jsem něco vědět, co v taháku nebylo?“ — musí být NE.
- Zkouší záměrně špatně: klikne špatný semafor, přehraje diktát 3×, odevzdá prázdné. Zapisuje, co se stalo.

### UX / designový architekt
- Navrhuje nové obrazovky (ZADANI §6, KONCEPT §9): klik ve textu (cíle pro prst ≥ 44 px), doplň písmeno (tlačítka i/y ve slově), diktát (přehrávač + pole), poslech, označ role (výběr u slova, ne tažení), rodičovo porovnání diktátu.
- Drží brand (navy, #1FC27E, Sora) a vzhled Matematiky — rodina nemá poznat, že přepnula „jiný produkt“.
- Výstup: krátký popis + náčrt (HTML statická ukázka) do `design/`, schvaluje Fable před kódováním.

### Programátor frontend
- Implementuje vstupy (`vstupy-cj.js`), přepínač předmětu, rodičovu kartu pro diktát/poslech, tisk, audio přehrávač. Vanilla ES moduly, žádný build.
- Nemění sdílený kód Matematiky bez zápisu do REPORTu „Změna sdíleného kódu: soubor, řádky, proč, jak otestováno“.

### Programátor DB
- Migrace `predmet` (ZADANI §8.1), idempotentní, s rollbackem, testovaná na testovací DB. Aktualizuje RLS testy. Připravuje SQL pro Pavla nebo aplikuje po jeho souhlasu.
- Import lekcí z JSON do DB (skript, existující z Matematiky, rozšířený o `predmet`).

### QA / testovací automat
- Rozšiřuje `nastroje/` a `testy/` z Matematiky: validace JSON proti `schema.json`, průchod všech lekcí (každá správná odpověď projde, každá známá chyba vrátí správný kód), kontrola audio odkazů (soubor existuje), telefon 360 px bez vodorovného scrollu, konzole bez chyb.
- Výsledek do REPORTu jako tabulka lekce × test.

## 3. Tok práce (jedna dodávka = jeden týden lekcí nebo jeden technický balíček)

1. **Fable** → zadání / rozpis (co má v dodávce být).
2. **Opus** → rozdělí: metodik → autor → korektor → recenzent → testovací rodič (obsah); UX → frontend/DB → QA (technika). Obsah a technika běží paralelně.
3. **Opus** → `REPORT-<datum>.md`: hotové / nehotové / nejistoty / návrhy pro Fabla / co potřebuje od Pavla (audio, rozhodnutí).
4. **Pavel** připojí složku → **Fable** → `KONTROLA-<datum>.md`.
5. **Opus** → opravy → krátký dodatek do REPORTu „Opraveno: body 1, 3, 4; bod 2 nesouhlasím, protože…“.
6. **Fable** → „Schváleno k nahrání“ → **Pavel** nahraje / aplikuje migraci.
7. **Pavel** → zpětná vazba z rodiny → Fable zapíše do zadání jako [Z RODINY] → další kolo.

## 4. Pravidla komunikace mezi rolemi
- Všechno písemně v souborech ve složce; nic „v hlavě agenta“.
- Formát poznámky: `[ROLE] soubor / lekce / úloha: text`. Např. `[KOREKTOR] cj-t3-l11 / úloha 4: „kuřaty“ — 7. p. mn. č. je „kuřaty“ i „kuřaty“? Ověřeno: pouze „kuřaty“. Zdroj: prirucka.ujc.cas.cz/?slovo=kuře`.
- Nejistota se **nikdy** nezakrývá: `kontrola.status = nejista` + důvod je v pořádku, `jista` bez zdroje není.
- Pavlovi se posílají jen věci, které vyžadují jeho rozhodnutí nebo ruku (audio, nahrání, migrace). Nic jiného.
