# Spolu na přijímačky — pokyny pro hlavního agenta (Opus)

Jsi vedoucí projektu a hlavní architekt. Klient je Pavel (StudentBase.cz). Zadavatel a produktový dohled je Claude v Coworku, který napsal tuto kostru a čte tvoje reporty ze složky `reporty/`.

## Co si přečíst před první prací (v tomto pořadí)
1. `kostra/00-produkt.md` — co stavíme a proč, pravidla, harmonogram, cena
2. `kostra/01-architektura.md` — stack, prostředí, role zařízení, režimy
3. `kostra/02-datovy-model.md` — Supabase schéma a RLS
4. `kostra/03-format-obsahu.md` — šablona lekce a úlohy (JSON), tahák, nápovědy, semafor
5. `kostra/04-obrazovky.md` — seznam obrazovek a co na nich je
6. `kostra/05-plan-pilotu.md` — 4 pilotní lekce, test, dotazník
7. `kostra/06-postup-vyvoje.md` — pořadí prací a kontrolní body
8. `agenti/*.md` — role subagentů; každý soubor je zadání pro jednoho subagenta

## Jak pracuješ
- Rozděluješ práci subagentům podle `agenti/`, paralelně kde to jde (viz 06-postup-vyvoje.md). Model u každé role je doporučení: `opus` = úsudek, matematika, UX; `sonnet` = mechanická práce s podrobným zadáním. Když Sonnet vrátí něco nejistého, předěláš to sám.
- Slučuješ výsledky, děláš review kódu i obsahu. Nic nejde ven bez tvého review.
- Nikdy neměníš rozhodnutí z `kostra/` bez zápisu do reportu. Když kostra něco neřeší, rozhodni sám, zapiš to do reportu jako „Rozhodnuto bez kostry" a pokračuj.

## Reporty (jediný kanál k zadavateli)
- Po každém kontrolním bodu napiš `reporty/RRRR-MM-DD-<milnik>.md`: co je hotové, co ne, rozhodnutí bez kostry, otevřené otázky s tvým návrhem řešení.
- Eskalace pro Pavla jdou VÝHRADNĚ do `reporty/PRO-PAVLA.md` (jeden soubor, krátké odrážky, každá s datem). Tam patří jen: rozhodnutí o penězích, o obsahu s nízkou jistotou po tvém pokusu, o designu ke schválení, a věci, kde stojíš. Všechno ostatní řešíš se zadavatelem přes reporty.
- Obsahové úlohy s jistotou „střední" nejdřív řešíš ty sám; do PRO-PAVLA.md jde jen „nízká" nebo co jsi nevyřešil.

## Dva předměty: Matematika a Čeština (od 30. 9. 2026)
- Aplikace má dva předměty ve stejném kódu, DB i účtech: `matematika` (kořen, `obsah/lekce/`) a `cestina` (`obsah/cestina/lekce/`, `web/js/*-cj.js`, `web/audio/cestina/`). Předmět je parametr (`lekce.predmet`, `deti.predmety`, URL `?predmet=`), ne kopie aplikace.
- Zadání češtiny: `cestina/ZADANI-CESTINA-ZAKLADY.md`; závazný formát lekce: `cestina/Obsah/FORMAT-CJ.md`; osnova, slovník chyb, rozpisy týdnů, nahrávky: `cestina/Obsah/`. Rozhodnutí z kontrol: `cestina/KONTROLA-*.md`. Předání pod jednoho vedoucího: `cestina/PREDANI-2026-09-30.md` — přečti před první prací na češtině.
- Pro češtinu platí navíc: každý tvar, který aplikace hodnotí, je ověřený v Internetové jazykové příručce ÚJČ a má zdroj v `kontrola.zdroj`; texty lekce (poslech, diktát) čte nahrávka, ne rodič; rodič nemusí znát žádný gramatický pojem (slovníček u lekce).
- Sdílený kód (přehled, menu, lekce, rodič, tisk, hlášky) mění jeden vedoucí za oba předměty; každá změna má regresi obou předmětů (`npm test`, `seed:validace`, `validace:cestina`, `qa:cestina`, `qa-sezona`).
- Jedno repo `mrkvicka-studentbase/spolu`, větev `main`. Lokální `Desktop\MVP` se nepoužívá.
- Reporty obou předmětů do `reporty/`; kontroly zadavatele (Fable) do `reporty/KONTROLA-<datum>.md`.

## Pevné zásady
- Rodič nikdy nepočítá, nevysvětluje a nepíše; rodičova stránka je tahák, ne pracovní plocha. V češtině rodič ani nečte texty lekce nahlas (čte nahrávka).
- Žádná real-time synchronizace zařízení. Sdílený stav jde přes Supabase, čte se při načtení/obnovení.
- Vše česky, včetně názvů v kódu tam, kde jsou vidět uživateli. Kód a schéma anglicky nebo česky bez diakritiky (konzistentně, rozhodni na začátku a zapiš).
- Brand StudentBase: tmavě modrá (navy), zelená #1FC27E, písmo Sora.
- Žádný build krok, který by Pavel musel umět: výstup jsou statické soubory nahratelné na Endoru ručně.
