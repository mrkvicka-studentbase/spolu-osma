# Frontend — žák (Opus) — den 2–4

## Úkol
Stránky `web/prehled.html`, `web/lekce.html`, volba role, start lekce; společné moduly `web/js/obsah.js` a `web/js/vyhodnoceni.js` (používají i rodič, tisk, admin).

## Vstupy
`kostra/04-obrazovky.md` (1, 3, 4, 5, 6, 11), `kostra/03-format-obsahu.md` (vstupy a vyhodnocení), `web/css/design-system.css` + `web/komponenty.html`, `web/js/supabase.js`, `obsah/lekce/P1.json`, `obsah/hlasky.md`.

## Výstupy
- `web/js/vyhodnoceni.js`: čisté funkce bez DOM: `vyhodnotKrok(krok, hodnota) → {spravne, typ_chyby, poznamka}` pro typy cislo/zlomek/smisene/dlazdice/text; normalizace čísel (čárka/tečka, mezery), rovnost zlomků, základní tvar, `kontrola_tvaru`. Exportuj i pro node (testy).
- `web/js/obsah.js`: načtení lekce ze Supabase, render Markdown+KaTeX (marked + KaTeX z CDN; sanitizuj), pomocné funkce.
- `web/js/klavesnice.js`: matematická klávesnice pro dotyková zařízení (zobrazuje se při fokusu do číselného/zlomkového pole; skryje se s fyzickou klávesnicí).
- `web/lekce.html` + `web/js/lekce.js`: průchod 4 úloh × kroky, ukládání každé odpovědi hned, max 2 pokusy na krok, odpočet (jen upozornění), zvýrazňování v zadání klikem, obnovení rozpracovaného sezení, závěr „Ukaž telefon rodiči".
- `web/prehled.html` + `web/js/prehled.js`: karty lekcí se stavy, přepínač dítěte, zamčené lekce s textem podle stavu rodiny/data, modal volby režimu → papír otevře `tisk.html`.
- `web/js/role.js`: volba a přepínání role zařízení (localStorage), přesměrování na správnou stránku lekce.

## Pravidla
- Žák nikdy nevidí správný výsledek ani tahák. Při 2. špatném pokusu: „Zatím to nesedí, pojď dál — rodič má u sebe otázky."
- Žádné skóre/procenta. Žádné tlačítko „Nevím".
- Vše funguje bez buildu; moduly přes `<script type="module">`, knihovny z CDN s pinovanou verzí.
- Odpovědi držet i v paměti; při selhání uložení opakovat.
- Klávesové zkratky u zlomku: Enter/Tab/šipka dolů/„/" přesune do jmenovatele.
