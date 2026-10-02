# Supabase — Spolu 8 (opakování 8. třídy)

> Spolu 8 má **novou** databázi (nový Supabase projekt, zatím nezaložený). Migrace 0001–0005 jsou čistá konsolidovaná sada (Spolu 0001–0007 + změny Spolu 8), viz `TECHNIKA-OSMA.md`. Lokální ověření: `bash supabase/test/over-migrace.sh` (PostgreSQL 16, nic nejde do Supabase).

Databáze, zabezpečení (RLS), nahrávání lekcí a klientský modul `web/js/supabase.js`.
Projekt: samostatný Supabase projekt jen pro tento produkt (pro Spolu 8 se teprve založí; projekt Spolu `ruogwpyayxgclcwnaxky` se nepoužívá). Na jiné projekty se nesahá.

## Obsah složky

| Soubor | K čemu |
|---|---|
| `migrations/0001_schema.sql` | tabulky, kontroly hodnot, indexy, GRANTy (`lekce.predmet`, fáze `osma`, `deti.predmety`, `sezeni.rezim` vč. `samo`) |
| `migrations/0002_rls.sql` | pomocné funkce (`je_admin`, `duvod_zamceni`, `dite_ma_predmet_lekce`, …) + RLS politiky |
| `migrations/0003_views.sql` | pohledy pro admin (`v_prehled_rodin`, `v_semafory_dle_kapitoly`, `v_cas_na_ulohu`, `v_cervene`, `v_alarm`) + funkce `katalog_lekci()` |
| `migrations/0004_triggers.sql` | registrace → rodina (`aktivni`) + 1. dítě; max 2 děti; ochrana sloupců rodiny; konec sezení |
| `migrations/0005_admin.sql` | návod + zakomentovaný insert admina |
| `vse-v-jednom.sql` | všechny migrace za sebou v jedné transakci (vygenerováno) |
| `skripty/migrovat.mjs` | aplikuje migrace přes Node + pg, eviduje je v `_migrace` (primární cesta) |
| `skripty/sql.mjs` | spustí SQL z argumentu / souboru, volitelně jako konkrétní uživatel (test RLS) |
| `skripty/env.mjs` | společné: načtení `.env`, připojení k DB |
| `skripty/spoj-migrace.mjs` | přegeneruje `vse-v-jednom.sql` (záloha pro SQL Editor) |
| `skripty/odemknout-rodinu.sql` | ruční změna stavu rodiny (`aktivni` / `uzavreny`) |
| `skripty/uzavrit-sezonu.sql` | konec provozu: všechny rodiny → `uzavreny` |
| `seed/seed-lekce.mjs` | validace a nahrání `obsah/lekce/*.json` do tabulky `lekce` |
| `seed/validator.mjs` | validace lekcí: `obsah/schema.json` + doménové kontroly (slovník `typy-chyb.md`, zlomky jen `\frac`, `poradi`, `vyraz`, bezpečné SVG); testy v `testy/validator.test.js` |
| `test/over-migrace.sh` + `test/test-zamek.sql` | lokální test migrací a zámku na PostgreSQL 16 (stuby auth v `test/stuby-supabase.sql`) |

## 1. Aplikace migrací

Přístup k DB je výhradně přes `.env` (viz `PRISTUP-SUPABASE.md`); Supabase MCP ani `supabase link` se nepoužívají.

**Primární cesta — Node + pg** (jednou `npm install` v kořeni repa; potřebuje `SUPABASE_DB_URL` v `.env`, vzor v `.env.example`):
```
npm run migrovat -- --suchy-beh   # plán: jaké migrace existují (bez připojení k DB)
npm run migrovat                  # aplikuje nové migrace
```
- Skript `skripty/migrovat.mjs` eviduje aplikované soubory v tabulce `public._migrace` (název, čas, sha256). Ta není vystavená přes Data API (revoke pro anon/authenticated + RLS bez politik).
- Každá migrace běží ve vlastní transakci; při chybě se vrátí jen ona a další se nespouštějí.
- Když se už aplikovaná migrace změní, skript jen varuje a nic nespustí. Správně: změnu dát do NOVÉ migrace (`0006_…sql`). Výjimečně `npm run migrovat -- --vynutit` znovu spustí změněné migrace (jsou psané idempotentně) a uloží nový součet.
- Migrace nesmí obsahovat vlastní `begin`/`commit`.

**Záloha — SQL Editor** (když Node/pg nejde):
1. `node supabase/skripty/spoj-migrace.mjs` (přegeneruje `vse-v-jednom.sql`).
2. Supabase → **SQL Editor** → **New query** → vložit celý `supabase/vse-v-jednom.sql` → **Run** (jedna transakce; při chybě se neprovede nic).
3. Pozor: SQL Editor nezapisuje do `_migrace`. Pokud se potom přejde na `npm run migrovat`, skript by migrace spustil znovu — vadit to nemá (jsou idempotentní), ale je lepší držet se jedné cesty.

Migrace jsou psané tak, aby šly spustit opakovaně (`if not exists`, `create or replace`, `drop policy if exists`).

## 2. Dotazy a ověření — sql.mjs a test RLS

```
npm run sql -- "select stav, count(*) from rodiny group by stav"     # jako postgres (obchází RLS)
npm run sql -- --jako-uzivatel <uuid> "select id from lekce"          # jako přihlášená rodina, pak rollback
```
- Výsledky se vypíší jako tabulky, `raise notice` jako `NOTICE: …`. Více příkazů najednou je povoleno.
- `--jako-uzivatel` obalí vstup do transakce (`set local role authenticated` + JWT claims se `sub`) a vždy ji vrátí — nic nezapíše. Nepoužívat se soubory, které mají vlastní `begin`/`rollback`.
- Test RLS a zámku: `bash supabase/test/over-migrace.sh` (lokální PostgreSQL 16; `testy-rls.sql` ze Spolu byl nahrazen `supabase/test/test-zamek.sql`).

## 3. Admin (Pavel)

1. Zaregistrujte se na webu jako běžná rodina (nebo Authentication → Users → Add user).
2. Otevřete `migrations/0005_admin.sql`, odkomentujte variantu B, doplňte svůj e-mail a spusťte v SQL Editoru.
   (Varianta A: uid najdete v Authentication → Users → klik na e-mail → „User UID".)
3. Ověření: `select * from public.admini;` vrátí 1 řádek. Pak funguje `admin.html`.

## 4. Klíče — kde co je

| Klíč | Kde ho najít | Kam patří |
|---|---|---|
| Project URL | Project Settings → API (Data API) | `web/js/config.js` (`SUPABASE_URL`) a `.env` (`SUPABASE_URL`) |
| Publishable key `sb_publishable_…` | Project Settings → API Keys | `web/js/config.js` (`SUPABASE_ANON_KEY`) — veřejný, smí být na webu i v gitu |
| Secret key `sb_secret_…` (dříve service_role) | Project Settings → API Keys | **jen** `.env` v kořeni repa (`SUPABASE_SERVICE_KEY=…`). Nikdy do `web/`, nikdy do gitu (`.env` je v `.gitignore`). |

| Heslo DB + Session pooler URI | Project Settings → Database → Connection string → Session pooler | **jen** `.env` (`SUPABASE_DB_PASSWORD`, `SUPABASE_DB_URL`) — pro migrace a `sql.mjs` |

Vzor `.env` je v `.env.example` (SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_PROJECT_REF, SUPABASE_DB_PASSWORD, SUPABASE_DB_URL).
npm balíčky: jen `pg` (devDependency). Seed používá vestavěný `fetch`, `@supabase/supabase-js` ani `dotenv` v Node nepotřebuje.

## 5. Nahrání lekcí (seed)

```
npm run seed:validace                   # jen kontrola obsahu, bez sítě a bez klíče
npm run seed -- --suchy-beh             # ukáže, co by se nahrálo (čte DB, nic nezapíše)
npm run seed                            # nahraje nové a změněné lekce
```
- Validuje proti `obsah/schema.json` + doménové kontroly (dlaždice právě 1 správná, každá špatná má `typ_chyby`, poslední krok `final`, unikátní id, pořadí typů úloh…).
- Nahraje jen lekce, jejichž obsah se změnil; `verze` se zvýší o 1.
- Spolu 8: `otevrit_od` = parametr `--otevrit-od RRRR-MM-DD` (všechny lekce obou předmětů najednou), `verejna` = volba `--verejna`. Jedna lekce: `--lekce M8-T03-L2`, soubor: `--soubor <cesta>`.
- Lekce s `kontrola.jistota` = `nizka` / `neurceno` se **nenahrají** (obsah bez kontroly nejde ven). Pro testovací projekt: `--vcetne-nezkontrolovanych`.
- Oprava obsahu = úprava JSON + znovu seed. Web není třeba nahrávat znovu.

## 6. Nastavení Authentication (jednou)

- Authentication → URL Configuration: **Site URL** `https://spolu.studentbase.cz`, **Redirect URLs** přidat `https://spolu.studentbase.cz/prehled.html` (a pro testování např. `http://localhost:8080/**`). Jinak odkaz z potvrzovacího e-mailu nepřesměruje na přehled.
- Potvrzení e-mailu je zapnuté (R6). Texty e-mailů (Authentication → Email Templates) přeložit do češtiny.
- Registrace: trigger `po_registraci` založí rodinu (stav `aktivni`) i 1. dítě z metadat (`dite_jmeno`, volitelně `predmety`). Chyba v datech dítěte registraci neshodí — dítě se jen nezaloží a web nabídne jeho přidání.

## 7. Provoz — důležité termíny

- **Free tier se po 7 dnech bez aktivity pozastaví.** V říjnu (pilot) aspoň jednou týdně otevřít web/admin. Před 1. 12. 2026 přejít na placený plán Pro (cenu ověřit v Billing) nebo mít jistotu pravidelného provozu. Pozastavený projekt = web hlásí chybu spojení; obnovení v dashboardu (Restore).
- **Od 30. 10. 2026 Supabase nevystavuje nové tabulky přes Data API automaticky.** Proto má každá migrace, která zakládá tabulku/pohled, explicitní `grant` ve stejném souboru. Nová tabulka bez grantu = „permission denied" v aplikaci. Při přidávání tabulek vždy přidat grant (vzor v `kostra/02-datovy-model.md`).
- **1. 5. 2027:** spustit `skripty/uzavrit-sezonu.sql`.

## 8. Přehled zabezpečení (pro kontrolu)

- RLS zapnuté na všech tabulkách. Rodina vidí jen své řádky; admin (tabulka `admini`) vše.
- `lekce`: čtení pro každou přihlášenou rodinu od `otevrit_od` (nebo `verejna`); stav `uzavreny` nečte nic. Sezení jen dítěti, které má předmět lekce v `deti.predmety`. Klient do `lekce` nikdy nezapisuje (nemá ani grant); seed jde přes secret key.
- `rodiny`: klient smí změnit jen `jmeno_rodice`, `telefon`, `zdroj`; `stav`, `odemknuto_at`, `poznamka_admin` jen admin nebo triggery (trigger `rodiny_ochrana`).
- `deti`: max 2 na rodinu (trigger + `unique (rodina_id, poradi)` + `check poradi between 1 and 2`); mazání jen ručně v SQL.
- `odpovedi`: jen vkládání (append-only); opakované odeslání téhož pokusu se nezdvojí.
- Připravený (vypnutý) zámek „jedno sezení najednou" — zakomentovaný index v `0001_schema.sql`.
