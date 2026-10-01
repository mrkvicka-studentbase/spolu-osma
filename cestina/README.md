# Čeština: základy — zadání a stav

**Od 30. 9. 2026 pod jedním vedoucím projektu Spolu — začni `PREDANI-2026-09-30.md`.**
Začni souborem `ZADANI-CESTINA-ZAKLADY.md`, role a tok práce v `agenti/ROLE.md`, obsah v `Obsah/`.
Hotová Matematika je v kořeni repozitáře (web/, obsah/, supabase/, nastroje/, testy/).

- Formát lekce v MVP (závazný převod SABLONA-CJ): `Obsah/FORMAT-CJ.md`
- Lekce: `../obsah/cestina/lekce/cj-t<týden>-l<lekce>.json`; nahrávky: `../web/audio/cestina/t<týden>/`
- Spuštění s pilotem (postup pro Pavla): `REPORT-SPUSTENI.md`; poslední dodávka: `REPORT-2026-09-30.md` (předchozí `REPORT-2026-09-29.md`); rozhodnutí o sdíleném kódu: `../reporty/ROZHODNUTI.md` R65 (dřív R60), R66
- Migrace DB: `../supabase/migrations/0007_predmet.sql` (po `0006_rezim_samo`; neaplikovaná), rollback `db/0007_predmet-rollback.sql`, lokální test `db/test/over-migrace.sh`; spuštění: `REPORT-SPUSTENI.md`
- Seed češtiny (až po migraci): `node supabase/seed/seed-lekce.mjs --adresar obsah/cestina/lekce --otevrit-od-zaklady RRRR-MM-DD` — týden 1 se otevře v den spuštění, další týdny v pondělí; s `--jen-validace` jen vypíše plán otevírání. Bez sloupce `lekce.predmet` seed nic nezapíše.

Kontroly (z kořene repa): `npm test`, `npm run validace:cestina`, `npm run qa:cestina` (prohlížeč, žák → rodič → tisk).
Lokální náhled: `node nastroje/staticky-server.mjs` → `web/lekce.html?lekce=cj-t1-l1&lokalne=1` (přihlášení jako v `nastroje/qa-cestina.mjs`).
