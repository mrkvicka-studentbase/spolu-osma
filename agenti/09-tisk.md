# Tisk / PDF (Sonnet; review Opus) — den 3

## Úkol
`web/tisk.html` + `web/js/tisk.js`: tisková verze lekce (A4) podle `kostra/04-obrazovky.md` bod 8.

## Vstupy
`web/css/tisk.css` (základ od designéra), `web/js/obsah.js` (načtení lekce, KaTeX), `obsah/lekce/P1.json` (`tisk.zadani` u každé úlohy).

## Přesné chování
- URL `tisk.html?lekce=P1&dite=<id>`. Záhlaví: „Spolu na přijímačky — Lekce P1: téma", jméno dítěte, datum, doporučený čas 20 min.
- Pro každou úlohu: číslo a typ (Rozcvička / Detektiv / Úloha / Sám), `tisk.zadani`, u dlaždic možnosti a) b) c), rámeček „Výpočet" (výška podle typu: rozcvička 4 cm, ostatní 8 cm), řádek „Výsledek: ______".
- Patička: „studentbase.cz · výsledky zapisuje rodič do telefonu".
- Netisknout tahák, řešení, navigaci. `@media print` skryje tlačítko „Vytisknout / Uložit jako PDF". Stránkování: nezalamovat úlohu uprostřed.
- KaTeX musí být vykreslený před tiskem (počkej na render, pak `window.print()` jen na kliknutí).

## Pravidla
Nic navíc. Ověř výstup v Chrome „Uložit jako PDF" (A4, okraje 15 mm).
