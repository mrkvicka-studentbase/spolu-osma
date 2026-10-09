# Stav Spolu 8 — 5. 10. 2026

## Hotové a ověřené
- **Matematika:** 40 lekcí (10 témat × 4) + úvodní test `M8-T00-DIAG`. Recenze všech témat (`jistota: jista`), validace 0 chyb, QA v prohlížeči bez nálezů.
- **Čeština:** 40 lekcí (10 témat × 4) + úvodní test `cj-t0-diag` (23 položek, OSNOVA §15).
  - Každé téma prošlo korekturou druhého agenta (4. 10.): hodnocené tvary znovu ověřené v příručce ÚJČ, vzorové odpovědi a známé chyby ověřené skriptem, `jistota: jista`.
  - Jazykových chyb v hodnocených místech korektura našla 6:
    - T2 *noci*, sporný vzor;
    - T6 *vidle*, test „dle“;
    - T7 tři věty, kde šla shoda číst dvojím způsobem;
    - T9 hovorové *dřív*;
    - T10 *z kopce* a *ze hřiště*, kde jde i *s*.
  - Hlavní druh oprav (všechna témata): „Platí“ a nápovědy taháku prozrazovaly odpověď. V režimu „Dnes samo“ je dítě vidí jako nápovědu.
  - Rozpisy `cestina/Obsah/TEMA-1.md`, `TEMA-2.md`, `TEMA-5.md` až `TEMA-10.md` (T3 a T4 rozpis nemají, data jsou jen v JSON).
  - Validace 41/41, 0 chyb (64 varování = nenatočené nahrávky). QA v prohlížeči 5. 10.: 80 lekcí obou předmětů + oba úvodní testy + přehled, bez nálezů.
- **Aplikace** (`TECHNIKA-OSMA.md`): fáze `osma`, čeština 5 úloh, doporučené pořadí z úvodního testu, „Dnes samo“ v obou předmětech. `npm test` 1174/1174.
- **Nástroje:** `nastroje/ujc.sh` už neukládá do cache odpověď „server je přetížen“. `nastroje/qa-osma.mjs` zvládá kroky, kde existuje jen jedna chybná odpověď (dvě dlaždice).

## Chybí, než to půjde k dětem
1. **45 nahrávek češtiny témat 3–10** (16 poslechů, 29 vět diktátu).
   - Texty jsou v `cestina/Obsah/AUDIO.md`, text pro ElevenLabs i s pauzami je v `cestina/Obsah/nahravky-k-nataceni.md` (a `.csv`); natáčet je bude agent podle `cestina/Obsah/NAHRAVKY-NAVOD.md`.
   - Soubory patří do `web/audio/cestina/t3/` … `t10/`.
   - Bez nich poslech nebo diktát dané lekce ukáže hlášku „Nahrávka se nenačetla“.
   - 4 nahrávky témat 1–2 jsou hotové.
2. **Nový Supabase projekt a hosting:** postup v `SPUSTENI.md`, část B.
3. Rozhodnutí Pavla: datum otevření, SOS konzultace.

## Otevřené metodické drobnosti (neblokují)
- **Návrhy nových kódů chyb.** Korektoři a autor diagnostiky je zatím nahradili existujícími kódy:
  - `predlozka-za-spojku`, `predlozka-za-podstatne`, `cislovka-dvemi`, `bychom-tvar`, `rod-trpny-za-podminovaci` (diagnostika);
  - `vs-pribuzne-navic` (T6);
  - `shoda-nekolikanasobny-a` (T7).
- **T9 L36:** diktát hodnotí *domů* kódem `u-carka-za-krouzek`. Kód pro *ů* uvnitř slova chybí.
- **T9 L33 a L36:** známá chyba u rozboru souvětí je „vše prohozeno“. Částečné záměny by daly přesnější zpětnou vazbu.
