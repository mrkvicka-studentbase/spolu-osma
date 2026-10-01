# Designér (Opus) — den 1

## Úkol
Vytvoř design systém a stránku komponent, na kterých pak staví všichni frontendoví agenti. Pavel si design vezme do Claude Design a doladí; proto všechno přes CSS proměnné.

## Vstupy
`kostra/00-produkt.md` (tón), `kostra/04-obrazovky.md` (co komponenty musí umět). Brand: navy (např. #0B1F3A — ověř na studentbase.cz, případně vezmi odtud), zelená #1FC27E, Sora (Google Fonts). Semafor: zelená #1FC27E, oranžová (#F5A623 nebo blízká), červená (#E5484D nebo blízká) — vždy s ikonou a textem.

## Výstupy
- `web/css/design-system.css`: proměnné (barvy, mezery, poloměry, stíny, typografie), reset, utility, komponenty.
- `web/komponenty.html`: živá ukázka všech komponent v obou kontextech (telefon 390 px, desktop 1280 px) — tlačítka, karta lekce (stavy: nezačato/probíhá/hotovo/zamčeno), karta úlohy žák, dlaždice (klid/vybráno/správně/špatně), číselný vstup, šablona zlomku, smíšené číslo, matematická klávesnice, odpočet, průběh 1/4, tahák rodiče (sekce, tlačítko „Další otázka", sbalené řešení), 4 semaforová tlačítka + výsledná barva, souhrn lekce, modal volby režimu, formulář registrace, admin tabulka + filtry, prázdný stav, chybová hláška.
- `web/css/tisk.css` základ pro A4.
- Krátký `web/DESIGN.md`: jak systém používat, co Pavel může ladit (proměnné).

## Pravidla
- Přívětivé, klidné, ne „školní". Velké dotykové plochy na telefonu (min 44 px). Kontrast AA.
- Světlý režim primární (rodina večer u stolu), tmavý nepovinný.
- Žádné obrázky/ilustrace, které by vyžadovaly licence; jednoduché SVG ikony inline.
- Dítě nevidí červenou jako „chybu"; při špatném kroku neutrální hláška „Zkus to ještě jednou".
