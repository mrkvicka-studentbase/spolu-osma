# Backend — Supabase (Opus) — den 1–2

## Úkol
Postav databázi, RLS, pohledy, trigger po registraci, seed obsahu a klientský modul.

## Vstupy
`kostra/01-architektura.md`, `kostra/02-datovy-model.md`, `kostra/03-format-obsahu.md` (struktura jsonb). Přístup: VÝHRADNĚ přes `.env` (viz `PRISTUP-SUPABASE.md`): `SUPABASE_DB_URL` pro SQL/migrace (Node + pg), `SUPABASE_SERVICE_KEY` pro seed (supabase-js). MCP Supabase nepoužívat.

## Výstupy
- `supabase/migrations/0001_schema.sql` … (tabulky, constraints, indexy), `0002_rls.sql`, `0003_views.sql`, `0004_triggers.sql` (po registraci vytvoř řádek `rodiny` ze `raw_user_meta_data`: jmeno_rodice, zdroj; profil dítěte zakládá klient), `0005_admin.sql` (tabulka admini + insert Pavlova uid — uid doplní Pavel, nech placeholder a zapiš do PRO-PAVLA.md jako 1 krok).
- `supabase/seed/seed-lekce.mjs`: načte `obsah/lekce/*.json`, validuje proti schématu (`obsah/schema.json` — napiš ho), upsert do `lekce` (id, faze, tyden, poradi, tema, kapitola, varianta, obsah, verejna, otevrit_od, verze+1). Spouští se `node supabase/seed/seed-lekce.mjs` se service key z `.env`.
- `supabase/skripty/migrovat.mjs` (aplikuje migrace v pořadí, eviduje v tabulce `_migrace`), `supabase/skripty/sql.mjs` (spustí SQL z argumentu/souboru).
- `supabase/skripty/uzavrit-sezonu.sql` (1. 5.), `supabase/skripty/odemknout-rodinu.sql` (ruční záloha k admin tlačítku).
- `web/js/supabase.js`: init klienta (anon key + URL v `web/js/config.js`, který Pavel vyplní), helpery: `prihlasit`, `registrovat`, `mojeRodina`, `mojeDeti`, `lekceProDite`, `zacitSezeni`, `ulozOdpoved`, `ulozSemafor`, `dokoncitSezeni`, `stavSezeni` (pro rodičův polling), `admin.*`.
- `supabase/README.md`: jak založit projekt, spustit migrace, seed, kde vyplnit klíče.

## Pravidla
- Každá migrace, která vytváří tabulku/view, má ve stejném souboru explicitní GRANT pro `authenticated` a `service_role` (viz 02, sekce GRANTy). Supabase od 30. 10. 2026 nové tabulky automaticky nevystavuje; bez GRANTu vrátí Data API „permission denied“.
- RLS přesně podle 02; otestuj SQL dotazy pod rolí `authenticated` s cizím uid (musí selhat).
- Max 2 děti na rodinu = trigger/constraint.
- Lekce z klienta nikdy nezapisovat.
- Views pro admin přes `security_invoker` + RLS na `admini`.
- Uveď v reportu, zda projekt běží na free tieru (pozastavení po 7 dnech).
