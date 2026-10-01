# 04 — Obrazovky

Zásady: mobil-first pro rodiče (telefon na výšku, jedna ruka), velká obrazovka pro žáka (min. 1024 px; funguje i na tabletu). Brand StudentBase: navy pozadí/akcenty, zelená #1FC27E pro akce a „zelenou", Sora. Semafor: zelená #1FC27E, oranžová, červená — všechny s ikonou/textem, ne jen barvou. Nic nesmí vypadat jako škola: žádné červené propisky, žádná procenta a známky pro dítě.

## 1. Landing `index.html` (veřejná)
Příslib, pro koho to je, jak funguje (3 kroky: přihlaste se na dvou zařízeních → 20 minut → semafor), pilot zdarma, cena 790/990, tlačítka Registrace / Přihlášení. Krátká FAQ (papír vs. aplikace, dvě děti, SOS). Kontakt.

## 2. Registrace / přihlášení `registrace.html`
Pole podle 00-produkt.md. Po registraci rovnou založení 1. dítěte (jméno, typ školy, známka). Souhlas s obchodními podmínkami (odkaz na stávající). Stav rodiny `pilot`. Odkaz „Zapomněli jste heslo?" → e-mail s odkazem na `nove-heslo.html` (R20, doplněno 24. 9.).

## 3. Volba role (po přihlášení, jednou na zařízení)
Dvě velké karty: „Jsem rodič — mám telefon" / „Jsem žák — mám počítač nebo tablet". Přepínač v menu.

## 4. Týdenní přehled `prehled.html` (obě role, jiný důraz)
- Hlavička: jméno dítěte (přepínač, pokud 2 děti), fáze, „Tento týden: 4 lekce, hotovo 1".
- Karty lekcí: téma, délka, stav (nezačato / probíhá / hotovo + barva semaforu), tlačítko „Začít lekci". Zamčené lekce (fáze ještě neotevřená / stav pilot) šedé s textem „Otevře se 1. 12." nebo „Odemkne se po platbě — 790 Kč v předprodeji".
- Rodič vidí navíc: manuál (jednou přečíst; stopka, 20 minut, otočená role, záchranný protokol — 1 obrazovka), tlačítko SOS u kapitoly, dotazník (po 4. pilotní lekci).
- Bez kalendáře s daty; jen týdny a doporučení „max 1 lekce denně".
- **Motivace (doplněno 30. 9.):** dokončená lekce má výrazný stav (zelená výplň, fajfka), lekce se všemi úlohami zelenými hvězdu. Řádek „Odznaky: x z 8“ (dítě i rodič, stejná sada). V hlavičce ukazatel postupu: dokončené lekce aktuální fáze, termín přijímaček malým textem, bez odpočtu. Vše se počítá při načtení z uložených dat (sezení, semafory, katalog), bez nové tabulky; žádné žebříčky, body ani notifikace. Cena u zamčených lekcí je jednou v bloku nad zamčenou částí a jen pro rodiče.

## 5. Start lekce (modal)
Volba režimu: „V aplikaci" / „Na papír (vytisknout)" / „Dnes samo" (R64; jen běžná lekce bez rýsování; žák ji zvolí jen se zaškrtnutím „Rodič ví…"). V režimu samo žák dostává Otázky 1–3 jako nápovědy („Nevím, jak dál"), semafor počítá aplikace z průběhu a lekce se ukončí sama; rodič vidí jen informaci, po lekci souhrn se štítkem „Bez rodiče". Řešení žák nevidí ani v tomto režimu. Na papír → otevře `tisk.html?lekce=P1` v novém okně + rodičova stránka přepne na papírový režim.

## 6. Lekce — žák `lekce.html?lekce=P1`
- Horní lišta: téma, odpočet (spustí se při startu; po vypršení jen jemné upozornění „Doporučený čas vypršel — můžete dokončit nebo zavřít"), průběh 1/4.
- Zadání (KaTeX), interaktivní zvýraznění (klik na slovo/číslo = žluté podtržení; jen vizuální, neukládá se — pomůcka pro záchranný protokol).
- Krok: popisek + vstup (dlaždice / číslo / zlomek šablona / smíšené). Matematická klávesnice na dotykovém zařízení. Tlačítko „Odevzdat krok". Po odevzdání: správně = zelená fajfka a další krok; špatně = „Zkus to ještě jednou" (max 2 pokusy, pak se ukáže, že je to špatně, ale ne správný výsledek — ten má rodič) a další krok.
- Po 4. úloze: „Hotovo, ukaž telefon rodiči" (souhrn dělá rodič).
- Žádné tlačítko „Nevím". Žádné skóre, žádná procenta.

## 7. Lekce — rodič `rodic.html?lekce=P1` (telefon)
- Nahoře: téma, odpočet (nezávislý na žákově — stačí lokální), úloha 1/4 s přepínáním (karty do stran).
- Karta úlohy: `uvod_pro_rodice` (jen u 1. úlohy), `tahak.vysvetleni`, otázky L1→L3 postupně (tlačítko „Další otázka"), „Otočená role", „Typická chyba", sbalené „Ukázat řešení".
- Stav žáka: „Dítě odevzdalo: krok 2 ✔" (načítá se ze Supabase, obnovení tlačítkem + každých 30 s).
- V režimu papír navíc: pole „Výsledek dítěte" (stejný typ vstupu jako `final`) → vyhodnocení.
- Semafor: 4 velká tlačítka „Vyřešil(a) sám/sama" / „Potřeboval(a) otázku" / „Spletl(a) se" / „Nevěděl(a), jak začít" (DB hodnoty `sam` / `s_otazkou` / `chyba_pocty` / `nevedel`); pod tlačítky krátký rozhodovací klíč (`obsah/semafor-klic.md`). Po kliknutí barva + doporučení. Lze změnit. (Změna 24. 9.: text 3. tlačítka, klíč — R21.)
- Karta úlohy má sbalené „Co vidí dítě" (zadání jen ke čtení, aby rodič nemusel nahlížet přes rameno; rodič stále nic nepočítá ani nepíše). (Změna 24. 9., R21.)
- Po 4. úloze: souhrn lekce (4 barvy), doporučení na zítra, tlačítko „Ukončit lekci". Při 2. červené v řadě u stejné kapitoly: nabídka SOS (mailto).

## 8. Tisk `tisk.html?lekce=P1`
A4, čitelné, místo na výpočty, `tisk.zadani` u každé úlohy, záhlaví se jménem dítěte a lekcí, patička StudentBase. `@media print` bez navigace. Tahák rodiče se NEtiskne.

## 9. Dotazník `dotaznik.html` (po 4. pilotní lekci, rodič)
6 otázek, 2 minuty: srozumitelnost taháku (1–5), délka lekce (krátká/akorát/dlouhá), ochota dítěte (1–5), režim (app/papír/oboje), co chybělo (text), cena 990 přijatelná? (ano/ne/za 790 ano). Po odeslání: „Máte nárok na 790 Kč" + Revolut odkaz/instrukce (text zadá Pavel do konfigurace).

## 10. Admin `admin.html`
- Přehled rodin (`v_prehled_rodin`): filtr stav, hledání, řazení podle poslední aktivity; tlačítka „Odemknout (aktivní)", „Uzavřít", poznámka.
- Detail rodiny: děti, lekce s barvami, časy, odpovědi po úlohách (včetně typ_chyby).
- Statistiky: semafory dle kapitoly (sloupce), průměrný čas na úlohu, seznam červených (posledních 30 dní), počet dokončených lekcí za týden, konverze pilot→aktivní.
- Export CSV rodin (e-maily pro předprodej).

## 11. Uzavřený účet (od 1. 5.)
Poděkování, odkaz na studentbase.cz, kontakt, „Chcete pokračovat v doučování?".

## Stavové a chybové stránky
Offline/chyba Supabase: „Nepodařilo se uložit, zkuste obnovit" — odpovědi se drží v paměti a zkusí se uložit znovu.
