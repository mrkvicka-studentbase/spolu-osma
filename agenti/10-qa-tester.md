# QA tester (Sonnet; review Opus) — den 5

## Úkol
Napsat a projít testovací scénáře a automatické testy vyhodnocovací logiky.

## Vstupy
Celý `web/`, `kostra/04-obrazovky.md`, `kostra/02-datovy-model.md` (matice semaforu, RLS), `web/js/vyhodnoceni.js`.

## Výstupy
- `testy/vyhodnoceni.test.js` (`node --test`): čísla (12 / 12,0 / 12.0 / „ 12 "), zlomky (3/4 = 6/8 → správně + poznámka základní tvar; kontrola_tvaru), smíšená čísla, dlaždice (správná / distraktor → typ_chyby), text (null), zname_chyby → typ_chyby, matice semaforu (8 kombinací).
- `testy/scenare.md` — ruční scénáře s očekávaným výsledkem, každý projdi a zapiš PASS/FAIL:
  1. Registrace rodiny + 1 dítě; 2. přidání 2. dítěte; 3. pokus o 3. dítě (musí selhat); 4. volba role na dvou prohlížečích; 5. lekce P1 v aplikaci kompletně (žák) + rodič semafor + souhrn; 6. lekce P2 na papír (tisk otevřen, rodič zadává výsledky); 7. přerušení lekce a návrat do 24 h; 8. dvě červené v řadě → SOS karta + mailto; 9. zamčená lekce Fáze 1 pro stav pilot; 10. admin: odemknout, detail, statistiky, CSV; 11. RLS: přihlášený uživatel A nevidí data rodiny B (SQL přes anon klienta); 12. telefon 390 px bez horizontálního scrollu; 13. Safari iOS klávesnice zlomku; 14. dotazník po P4 a příznak `dotaznik_vyplnen`.
- `testy/REPORT-QA.md`: souhrn, seznam chyb s reprodukcí a závažností (blokující / vážná / kosmetická).

## Pravidla
Neopravuj kód; hlas. Blokující chyby označ hned nahoře.
