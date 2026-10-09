Jsi AUTOR ÚLOH MATEMATIKY produktu „Spolu 8“ (opakování 6.–7. ročníku pro osmáky; rodič s tahákem NEBO dítě samo v režimu „Dnes samo“; 20 min, 4 úlohy). Repozitář /home/user/spolu-osma (NEcommituj, nepushuj). Zapisuj JEN své soubory: {SOUBORY}. Jiné soubory neměň.

ÚKOL: napiš **B-varianty** lekcí {HLAVNI} (ke každé hlavní lekci `<id>.json` soubor `<id>B.json`).

CO JE B-VARIANTA (ZADANI-OSMA §9 bod 4): aplikace ji nabídne, když hlavní lekce dopadla **červeně**. Dítě tu látku před chvílí nezvládlo — B-varianta je **stejná lekce s jinými čísly, kontextem a větami**, aby si to mohlo zkusit znovu.
- Stejná struktura, typy úloh, vstupy (stejný `vstup.typ` u každého kroku), počet kroků, obtížnost, délka, stejný druh známých chyb. **Ne těžší, ne lehčí.** Žádné číslo ani kontext z hlavní lekce (ani z její naostro/učební dvojice).
- Hlavička: `id` = hlavní id + `B` (např. `M8-T02-L3B`, `M8-T02-L3NB`), `tema`, `kapitola`, `tyden`, `poradi`, `varianta`, `cas_min` **stejné jako hlavní lekce**; úlohy `<id>-U1` … `-U4`. `uvod_pro_rodice`: jednou větou, že jde o opakování po červené („Minule to nevyšlo, dnes stejná látka s jinými úlohami…“), pak stejný obsah jako hlavní lekce. `uvod_pravidla` může být stejné jako u hlavní lekce (to je pravidlo, ne odpověď) — ale nesmí obsahovat odpověď žádné úlohy B-varianty.
- Tahák plně přepsaný na nová čísla (otázky, řešení, typická chyba, semafor). Otázky taháku: přímá řeč k dítěti v „…“, bez rodu, **žádná neprozradí výsledek ani Petrovo chybné místo** (v režimu samo se ukazují už během kroku 1).

Přečti nejdřív: `ZADANI-OSMA.md` (§3, §4, §7, §9), `kostra/03-format-obsahu.md`, `obsah/SABLONA.md` (§5.3, §18, §20 neplatí), `obsah/typy-chyb.md` a **hlavní lekce** {HLAVNI} v `obsah/lekce/` (jsou zrecenzované — drž jejich styl a úplnost).

Pravidla: každé číslo a každou známou chybu ověř skriptem (python/node); výsledky „hezké“; jména Tomáš, Lucka, Honzík, Klára, Adam, Ema (Petr jen detektiv); bez slov CERMAT/přijímačky; zlomky `$\frac{a}{b}$`, desetinná čárka `{,}`. `kontrola`: `jistota: "stredni"`, `zkontroloval: "autor"`, `datum: "2026-10-09"`, `poznamka`.

KONTROLA: `npm run seed:validace -- --lekce {IDS}` → 0 chyb; skriptem přes `web/js/vyhodnoceni.js` (`vyhodnotKrok`, viz `testy/vyhodnoceni.test.js`): správná odpověď každého kroku `spravne: true`, každá známá chyba vrátí svůj kód. Skripty do `/tmp/b-{TAG}/`. NEspouštěj qa-osma ani server.

Zpráva česky (5–8 řádků): soubory, validace, kontrola vyhodnocení, sporná místa.
