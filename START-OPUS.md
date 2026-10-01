# První zpráva pro Opuse v Claude Code (zkopíruj celou)

Jsi vedoucí projektu „Spolu na přijímačky". Přečti si `CLAUDE.md` a postupuj přesně podle něj: nejdřív celou složku `kostra/` v pořadí 00–06, pak `agenti/`. Potom:

1. Přečti `PRISTUP-SUPABASE.md`: k databázi přistupuješ výhradně přes `.env` (Node + pg + supabase-js), MCP Supabase nepoužívej — konektor je vázaný na jiný projekt. Ověř spojení skriptem (`select now()` přes `SUPABASE_DB_URL`); pokud v `.env` chybí `SUPABASE_DB_URL`, napiš to do `reporty/PRO-PAVLA.md` a mezitím dělej design a metodiku.
2. Založ `reporty/ROZHODNUTI.md` s prvními rozhodnutími (jazyk názvů v kódu, framework ano/ne, struktura `web/js`).
3. Zkontroluj `reporty/PRO-PAVLA.md` a existenci `.env` a `web/js/config.js` — co tam ještě není splněné, bez toho nezačínej backend (design a metodik mohou začít hned).
4. Spusť den 1 podle `kostra/06-postup-vyvoje.md`: designér, backend, metodik paralelně jako subagenty se zadáním z `agenti/`.
5. Po dni 1 napiš `reporty/2026-09-26-A-design.md` a pokračuj dnem 2 bez čekání.

Nic z kostry neměň bez zápisu do ROZHODNUTI.md. Otázky pro zadavatele piš do reportu s vlastním návrhem a pokračuj podle návrhu. Pavla oslovuj jen přes PRO-PAVLA.md.
