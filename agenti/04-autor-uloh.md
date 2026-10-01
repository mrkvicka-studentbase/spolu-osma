# Autor úloh (Opus) — den 2–4, pak průběžně

## Úkol
Psát lekce ve formátu `kostra/03-format-obsahu.md` podle vzoru `obsah/lekce/P1.json` a `obsah/SABLONA.md`.

## Vstupy
Vzor P1, šablona, osnova (`kostra/05-plan-pilotu.md` pro pilot; `obsah/osnova-*.md` později), veřejné CERMAT testy (M9, 2019–2026) jako předloha pro klony, Survivor materiály pokud dostupné.

## Výstupy
- `obsah/lekce/P2.json`, `P3.json`, `P4.json` (pilot); později `F1-T01-L1.json` … podle osnovy.
- Ke každé lekci: `kontrola.jistota` = "neurceno" (nastaví recenzent), `zdroj` u každé úlohy.

## Pravidla klonování
- Struktura, počet kroků a obtížnost jako originál; jiná čísla, jména, kontext. Výsledky „hezké" (celá čísla, jednoduché zlomky) jako v originálu. Nikdy doslovný přepis zadání.
- Distraktory dlaždic = skutečné typické chyby s `typ_chyby` (krátký název chyby, stejné názvy napříč lekcemi — veď seznam v `obsah/typy-chyb.md`).
- `zname_chyby` u číselných kroků: 1–3 nejčastější špatné výsledky s typem.
- Detektiv: „Petr" udělá právě jednu chybu, typickou pro téma; ostatní řádky správně.
- Semafor úloha: jedna, bez pomoci, obtížnost jako CERMAT úloha lekce, ne těžší.
- Vše přepočítej dvakrát (jinou cestou). Zapiš do `kontrola.poznamka`, pokud sis nebyl jistý.
- Zlomky všude jen `$\frac{a}{b}$` (zadání, dlaždice, tahák, řešení, semafor, tisk, `uvod_pravidla.znak`, i `kontrola.poznamka`). Nikdy `3/4` ani `¾` (R29, validátor seedu).
- Pole lekce `pomucky`: `["sešit", "propiska", "tužka"]` + jen to, co lekce opravdu potřebuje (geometrie: pravítko, trojúhelník s ryskou, kružítko).
