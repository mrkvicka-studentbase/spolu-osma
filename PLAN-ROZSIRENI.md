# Plán rozšíření Spolu 8 na celý školní rok

Verze 1, 9. 10. 2026. Rozhodnutí Pavla: `ZADANI-OSMA.md` §9.

## 1. Kolik lekcí

| Na předmět | Hotovo | Dodělat |
|---|---|---|
| Učební lekce (L1–L4 v 10 tématech) | 40 | 0 |
| Naostro lekce (dvojče každé lekce, o kus těžší) | 0 | 40 |
| B-varianty (po červené; ke každé z 80 lekcí) | 0 | 80 |
| Úvodní test | 1 | 0 |
| Pololetní test (leden) | 0 | 1 |
| **Celkem** | **41** | **121** |

Oba předměty: **240 nových lekcí + 2 pololetní testy**. Čeština navíc potřebuje nahrávky. Dnes je 49 nahrávek na 40 lekcí, takže na 120 nových lekcí to bude odhadem **~150 nahrávek**.

## 2. Kalendář (3 + 3 týdně)
- Start pondělí 2. 11. 2026, konec neděle 30. 5. 2027: 30 týdnů.
- Prázdniny:
  - Vánoce 23. 12. – 3. 1.;
  - jarní 1 týden (liší se podle okresu);
  - Velikonoce 26. a 29. 3.
- 80 lekcí ÷ 3 týdně = 27 týdnů. Zbývající 3 týdny jsou rezerva na prázdniny.
- Pořadí v tématu (s odstupem): L1, L2, L1n, L3, L2n, L4, L3n, L4n. To je 8 lekcí, tedy 2⅔ týdne na téma, 10 témat za ~27 týdnů.

## 3. Formát
- **Naostro lekce:** stejný formát a délka jako učební lekce (matematika 4 úlohy / 20 min, čeština 5 úloh / ~25 min). Stejné téma a jevy, ale:
  - víc položek;
  - smíšené úlohy z celé lekce;
  - delší text nebo slovní úloha;
  - méně opory v „Platí“ (dítě už pravidlo zná).
- **Rozhodnutí vedoucího 9. 10. (naostro):**
  - hlavní úloha smí mít až 5 výpočtů (SABLONA §21.9 doporučuje 4), když lekce vejde do 20 / 25 minut;
  - `uvod_pro_rodice` smí mít o jednu větu víc („naostro“ / „po červené“);
  - rozcvička se 4 příklady smí mít 3 otázky taháku (jedna pro dva příklady).
- **B-varianta:** kopie struktury lekce (stejné typy úloh, stejná obtížnost, stejný tahák), jiná slova, čísla a věty. Id `…-B`, například `M8-T03-L2-B`, `cj-t3-l10-B`.
- **ID naostro lekcí:** návrh `M8-T03-L2N`, `cj-t3-l10n`. Konečné id rozhodne technika (validátor, seed, doporučení).

## 4. Aplikace (technika)
1. **Pořadí s odstupem** a **postupné otevírání 3 + 3 týdně** (seed `otevrit_od` podle kalendáře, nebo per dítě, viz otevřené body).
2. **B-varianta:** po červené se v přehledu u lekce objeví „Zkusit znovu (jiné úlohy)“. Do týdenního počtu se nepočítá, do odznaků ano.
3. **Doporučení z úvodního testu** se musí sladit s kalendářem (viz otevřené body).
4. Testy, validátor a QA na nové typy lekcí.

## 5. Pořadí prací (návrh)
1. Technika: id, pořadí, otevírání, B-varianta v přehledu (bez obsahu, na syntetických datech).
2. **Matematika a čeština po tématech:**
   - naostro lekce tématu → recenze nebo korektura ÚJČ → B-varianty tématu (40 + 40) → QA;
   - nejdřív témata 1–3, aby byl obsah na listopad a prosinec hotový co nejdřív.
3. Nahrávky češtiny průběžně po tématech (Pavel).
4. Kontrola po každých 3 tématech.

**Časová rezerva:** listopad a prosinec pokryjí témata 1–3 (~8 týdnů × 3 = 24 lekcí = 3 témata). Dál stačí, když je každé další téma hotové 2–3 týdny před tím, než se otevře.

## 6. Rozhodnuto 9. 10. (dřívější otevřené body)
1. **Oranžová:** jen ústní pětiminutovka pro rodiče následující den. B-varianta jen po červené.
2. **Kalendář pro každé dítě:** od jeho prvního dne 3 + 3 týdně, v pořadí podle úvodního testu. Technika: kalendář se počítá v aplikaci podle data první lekce dítěte; DB `otevrit_od` zůstává jen jako „nejdřív od“.
3. **Pololetní test:** ano, v lednu, 1 na předmět.

## 7. Nahrávky
- Seznam se generuje z lekcí: `node nastroje/seznam-nahravek.mjs` → `cestina/Obsah/nahravky-k-nataceni.md` a `.csv`.
- Natáčí agent přes noc podle `cestina/Obsah/NAHRAVKY-NAVOD.md` (ElevenLabs, Claude in Chrome).
- Po každé dávce nových lekcí češtiny se seznam přegeneruje.
