# Frontend — rodič, telefon (Sonnet; review Opus) — den 2–4

## Úkol
Stránka `web/rodic.html` + `web/js/rodic.js`: tahák pro rodiče, semafor, režim papír, souhrn lekce, SOS.

## Vstupy (vše musí existovat, jinak úkol vrať orchestrátorovi)
`kostra/04-obrazovky.md` bod 7, `kostra/02-datovy-model.md` (matice semaforu), `web/css/design-system.css`, `web/komponenty.html` (použij přesně tyto komponenty), `web/js/supabase.js`, `web/js/obsah.js`, `web/js/vyhodnoceni.js`, `obsah/lekce/P1.json`, `obsah/hlasky.md`, `obsah/manual-rodice.md`.

## Přesné chování
1. URL `rodic.html?lekce=P1&dite=<id>`. Načti lekci a aktuální sezení (`stavSezeni`); pokud neexistuje, vytvoř (`zacitSezeni`, režim z modalu / parametru `rezim=app|papir`).
2. Hlavička: téma, odpočet (lokální, start tlačítkem „Spustit čas"), indikátor úlohy 1/4, přepínání karet do stran (tlačítka ‹ ›, swipe nepovinný).
3. Karta úlohy: `uvod_pro_rodice` (jen u 1. úlohy, sbalitelný), `tahak.vysvetleni`, blok otázek: zobrazena L1, tlačítko „Další otázka" odkryje L2, pak L3; sekce „Otočená role" a „Typická chyba" sbalené; „Ukázat řešení" sbalené (`tahak.reseni`).
4. Blok „Co dítě odevzdalo": seznam kroků s ✔/✘ ze Supabase; tlačítko „Obnovit" + auto každých 30 s, jen když je stránka viditelná.
5. Režim papír: navíc vstup „Výsledek dítěte" typu podle `final.vstup.typ` → `vyhodnotKrok` → ulož jako odpověď se `zadal:'rodic'`.
6. Semafor: 4 tlačítka; po kliku spočítej barvu podle matice (správnost = poslední odpověď `final` úlohy; když chybí → sloupec „špatně/neodevzdáno"), zobraz barvu + `semafor.<barva>` text, ulož `ulozSemafor`. Lze změnit.
7. Po semaforu 4. úlohy: souhrn (4 barvy, hlavní = semafor úloha), doporučení na zítra (z červené/oranžové textů), tlačítko „Ukončit lekci" → `dokoncitSezeni` se `souhrn`.
8. SOS: pokud u stejné `kapitola` jsou 2 po sobě jdoucí dokončené lekce s hlavní červenou, zobraz kartu „Potřebujete pomoc s tématem X?" s `mailto:` (adresa z `config.js`, předmět „SOS: <kapitola> — <jméno dítěte>", tělo s lekcemi a barvami). Odkaz na SOS je i v přehledu u kapitoly.
9. Manuál rodiče: první návštěva `rodic.html` → celoobrazovkový manuál s tlačítkem „Rozumím" (localStorage), pak dostupný z menu.

## Pravidla
- Jedna ruka, palec: hlavní akce dole. Text min 16 px. Žádné horizontální scrollování.
- Nepřidávej nic, co není v zadání. Když něco chybí (komponenta, helper), napiš to do výstupu a zastav se — nevymýšlej náhradu.
- Vše česky, rodiči vykat.
