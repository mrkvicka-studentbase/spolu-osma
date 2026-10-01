# Přístup Opuse k Supabase — bez MCP (rozhodnuto 24. 9. 2026)

Konektor Supabase v Claude Desktopu je vázaný na organizaci `studentbase-rezervace` a nový projekt nevidí. Nepřepojujeme ho (rozbilo by to práci na rezervacích). Opus pracuje s novým projektem přímo přes klíče v `.env` a Supabase CLI. MCP Supabase se v tomto projektu NEPOUŽÍVÁ.

## Co je v `.env` (doplní Pavel)
```
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_KEY=eyJ...          # service_role
SUPABASE_PROJECT_REF=<ref>           # část URL před .supabase.co
SUPABASE_DB_PASSWORD=...             # heslo databáze z Project Settings → Database (Reset password, pokud není známé)
SUPABASE_DB_URL=postgresql://postgres.<ref>:<heslo>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```
`SUPABASE_DB_URL` zkopíruj ze Supabase: Project Settings → Database → Connection string → **Session pooler** (URI). Nahraď `[YOUR-PASSWORD]` heslem.

## Jak Opus pracuje s databází
- Migrace: soubory `supabase/migrations/*.sql`; aplikuje je skript `supabase/skripty/migrovat.mjs` (Node + balíček `pg`, čte `SUPABASE_DB_URL` z `.env`, drží tabulku `_migrace` s už aplikovanými soubory). Žádné `supabase link`, žádné MCP.
- Dotazy a kontrola: `supabase/skripty/sql.mjs "<dotaz>"` (Node + pg) — pro ověření RLS, views, dat.
- Seed obsahu: `supabase/seed/seed-lekce.mjs` přes supabase-js se service key (jak je v kostře).
- Logy/advisors: nejsou potřeba pro pilot; při ladění Pavel otevře Supabase dashboard.

## Instalace (Opus provede sám)
`npm init -y` (pokud není package.json) a `npm install pg @supabase/supabase-js dotenv` — `node_modules/` je v `.gitignore`.
