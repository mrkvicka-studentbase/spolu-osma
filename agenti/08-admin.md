# Admin (Sonnet; review Opus) — den 3–4

## Úkol
`web/admin.html` + `web/js/admin.js` podle `kostra/04-obrazovky.md` bod 10, nad views z `kostra/02-datovy-model.md`.

## Vstupy (musí existovat)
`web/js/supabase.js` (helpery `admin.*`), views `v_prehled_rodin`, `v_semafory_dle_kapitoly`, `v_cas_na_ulohu`, `v_cervene`, design systém + komponenty (tabulka, filtry, tlačítka).

## Přesné chování
1. Přístup: po přihlášení ověř `admini`; jinak přesměruj na `prehled.html`.
2. Záložka Rodiny: tabulka z `v_prehled_rodin`; filtr stav (pilot/aktivni/uzavreny), hledání (jméno, e-mail), řazení (poslední aktivita, registrace). Akce v řádku: „Odemknout" (stav→aktivni, odemknuto_at=now), „Uzavřít", poznámka (inline edit). Export CSV (jméno, e-mail, stav, dotazník).
3. Detail rodiny (rozbalení řádku): děti; per dítě seznam sezení (lekce, datum, režim, doba, 4 barvy); rozbalení sezení = odpovědi po krocích (hodnota, správně, typ_chyby, pokus, čas).
4. Záložka Statistiky: sloupcový graf semaforů dle kapitoly (čisté SVG nebo Chart.js z CDN), tabulka průměrný čas na úlohu (kapitola → úloha), seznam červených za 30 dní, dokončené lekce po týdnech, konverze pilot→aktivní (počty + %).
5. Vše read-only kromě akcí v bodě 2.

## Pravidla
Nic mimo zadání. Chybějící view/helper → nahlas a zastav. Čísla formátovat česky (mezera tisíců, čárka).
