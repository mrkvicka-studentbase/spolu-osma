-- =====================================================================
-- 0001_schema.sql — Spolu 8 (opakování 8. třídy): tabulky, constraints, indexy, GRANTy
-- Čistá sada pro NOVOU databázi (konsolidace migrací Spolu 0001–0007, TECHNIKA-OSMA.md):
--   lekce.predmet + fáze 'osma' (oba předměty), deti.predmety (výchozí {matematika,cestina}),
--   sezeni.rezim včetně 'samo' (R64). Bez dotazníku a platby: rodiny.stav jen 'aktivni' / 'uzavreny'.
-- Vychází z kostra/02-datovy-model.md. Názvy česky bez diakritiky (R1).
-- Skript je idempotentní (create ... if not exists), lze ho spustit znovu.
-- =====================================================================

-- ---------------------------------------------------------------------
-- rodiny — jeden řádek = jeden účet (auth.users). Zakládá ho trigger
-- po registraci (0004), ne klient.
-- ---------------------------------------------------------------------
create table if not exists public.rodiny (
  id               uuid primary key references auth.users (id) on delete cascade,
  jmeno_rodice     text not null default ''
                   check (char_length(jmeno_rodice) <= 100),
  email            text,
  telefon          text check (telefon is null or char_length(telefon) <= 30),
  -- Spolu 8 v1 bez platby: každá rodina je 'aktivni'; 'uzavreny' = účet bez přístupu k obsahu (konec provozu)
  stav             text not null default 'aktivni'
                   check (stav in ('aktivni', 'uzavreny')),
  zdroj            text check (zdroj is null or char_length(zdroj) <= 50),
  poznamka_admin   text,
  odemknuto_at     timestamptz,
  created_at       timestamptz not null default now()
);

comment on table public.rodiny is 'Rodina = účet (auth.users). Chráněné sloupce (stav, odemknuto_at, poznamka_admin) mění jen admin / triggery. Spolu 8 v1: žádná platba, stav aktivni (výchozí) / uzavreny (konec provozu).';

create index if not exists rodiny_stav_idx on public.rodiny (stav);

-- ---------------------------------------------------------------------
-- deti — max 2 na rodinu (check poradi 1–2 + unique + trigger v 0004)
-- typ_skoly a znamka_8 jsou ze Spolu (přijímačky) — Spolu 8 je nevyžaduje (null)
-- predmety = které předměty má dítě aktivní (přehled, zámek sezení)
-- ---------------------------------------------------------------------
create table if not exists public.deti (
  id            uuid primary key default gen_random_uuid(),
  rodina_id     uuid not null references public.rodiny (id) on delete cascade,
  krestni_jmeno text not null
                check (char_length(btrim(krestni_jmeno)) between 1 and 50),
  typ_skoly     text check (typ_skoly in ('gymnazium', 'ss_maturita')),
  znamka_8      smallint check (znamka_8 between 1 and 5),
  varianta      text not null default 'z8' check (varianta in ('z8', 'z9', 'z7')),
  predmety      text[] not null default '{matematika,cestina}'
                constraint deti_predmety_check
                check (cardinality(predmety) between 1 and 2 and predmety <@ array['matematika', 'cestina']::text[]),
  -- poradi doplní trigger, pokud ho klient nepošle (NOT NULL se kontroluje až po BEFORE triggeru)
  poradi        smallint not null check (poradi between 1 and 2),
  created_at    timestamptz not null default now(),
  constraint deti_rodina_poradi_key unique (rodina_id, poradi)
);

-- ---------------------------------------------------------------------
-- lekce — obsah (jsonb) nahrává jen seed se service key; klient nezapisuje
-- Spolu 8: fáze 'osma'; matematika M8-T<tt>-L<n> / M8-T00-DIAG, čeština cj-t<t>-l<n> / cj-t0-diag.
-- tyden = číslo tématu 1–10 (0 = diagnostika), poradi = lekce v tématu 1–4.
-- ---------------------------------------------------------------------
create table if not exists public.lekce (
  id          text primary key check (id ~ '^[A-Za-z0-9-]{1,40}$'),
  predmet     text not null default 'matematika'
              constraint lekce_predmet_check check (predmet in ('matematika', 'cestina')),
  faze        text not null default 'osma' constraint lekce_faze_check check (faze in ('osma')),
  tyden       smallint not null check (tyden between 0 and 10),
  poradi      smallint not null check (poradi between 1 and 4),
  tema        text not null,
  kapitola    text not null,
  varianta    text not null default 'z8' check (varianta in ('z8', 'z9', 'z7')),
  obsah       jsonb not null,
  verejna     boolean not null default false,
  otevrit_od  timestamptz not null,
  verze       integer not null default 1 check (verze >= 1),
  created_at  timestamptz not null default now(),
  -- id odpovídá předmětu (seed i validátor to hlídají taky)
  constraint lekce_predmet_id_check check (
    (predmet = 'cestina' and id like 'cj-%') or (predmet = 'matematika' and id like 'M8-%'))
);

create index if not exists lekce_predmet_tyden_poradi_idx on public.lekce (predmet, tyden, poradi);

-- ---------------------------------------------------------------------
-- sezeni — jedno projití lekce jedním dítětem
-- ---------------------------------------------------------------------
create table if not exists public.sezeni (
  id          uuid primary key default gen_random_uuid(),
  dite_id     uuid not null references public.deti (id) on delete cascade,
  -- lekce se nemažou (seed dělá jen upsert); restrict chrání historii
  lekce_id    text not null references public.lekce (id) on update cascade on delete restrict,
  -- app = v aplikaci s rodičem, papir = na papír s rodičem, samo = v aplikaci bez rodiče (R64)
  rezim       text not null default 'app' constraint sezeni_rezim_check check (rezim in ('app', 'papir', 'samo')),
  zacatek     timestamptz not null default now(),
  konec       timestamptz,
  stav        text not null default 'probiha'
              check (stav in ('probiha', 'dokonceno', 'preruseno')),
  souhrn      jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists sezeni_dite_id_idx  on public.sezeni (dite_id, zacatek desc);
create index if not exists sezeni_lekce_id_idx on public.sezeni (lekce_id);

-- Budoucí zámek „jedno sezení najednou" (kostra 01: připravit, NEZAPÍNAT).
-- Zapnutí = odkomentovat. Pozor: před zapnutím ukončit visící sezení
-- (update public.sezeni set stav = 'preruseno' where stav = 'probiha' and zacatek < now() - interval '24 hours';)
-- a v supabase.js zacitSezeni() počítat s chybou 23505 (unique violation).
-- create unique index if not exists sezeni_jedno_probihajici_idx
--   on public.sezeni (dite_id) where stav = 'probiha';

-- ---------------------------------------------------------------------
-- odpovedi — každý odevzdaný krok (append-only z klienta)
-- ---------------------------------------------------------------------
create table if not exists public.odpovedi (
  id          bigserial primary key,
  sezeni_id   uuid not null references public.sezeni (id) on delete cascade,
  uloha_id    text not null,
  krok_id     text not null,            -- 'final' pro výsledek
  hodnota     jsonb,                    -- číslo, {c,j}, {cela,c,j}, id dlaždice, text
  spravne     boolean,                  -- null = nevyhodnotitelné (text)
  typ_chyby   text,
  pokus       smallint not null default 1 check (pokus >= 1),
  cas_s       integer check (cas_s is null or cas_s >= 0),  -- sekundy od zobrazení kroku
  zadal       text not null default 'dite' check (zadal in ('dite', 'rodic')),
  created_at  timestamptz not null default now(),
  -- idempotence: opakované odeslání téhož pokusu (fronta po výpadku sítě) se nezdvojí
  constraint odpovedi_pokus_key unique (sezeni_id, uloha_id, krok_id, zadal, pokus)
);
-- index na sezeni_id pokrývá levý prefix unique constraintu odpovedi_pokus_key

-- ---------------------------------------------------------------------
-- semafory — volba rodiče + barva k úloze (upsert, lze změnit)
-- ---------------------------------------------------------------------
create table if not exists public.semafory (
  sezeni_id     uuid not null references public.sezeni (id) on delete cascade,
  uloha_id      text not null,
  volba_rodice  text not null
                check (volba_rodice in ('sam', 's_otazkou', 'chyba_pocty', 'nevedel')),
  spravne_auto  boolean,
  barva         text not null check (barva in ('zelena', 'oranzova', 'cervena')),
  doporuceni    text,
  created_at    timestamptz not null default now(),
  primary key (sezeni_id, uloha_id)
);

create index if not exists semafory_barva_created_idx on public.semafory (barva, created_at desc);

-- ---------------------------------------------------------------------
-- admini — uid adminů; zápis jen ručně v SQL (viz 0005_admin.sql).
-- Je tady (ne v 0005), protože ji potřebuje funkce je_admin() v 0002.
-- ---------------------------------------------------------------------
create table if not exists public.admini (
  uid         uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- GRANTy (povinné — Supabase od 30. 10. 2026 nové tabulky nevystavuje).
-- Nejdřív odebereme případná výchozí práva (Supabase dřív dával anon/authenticated
-- všechno), pak dáme přesně to, co klient potřebuje. Omezení na řádky dělá RLS (0002).
-- =====================================================================
grant usage on schema public to anon, authenticated, service_role;

revoke all on public.rodiny, public.deti, public.lekce, public.sezeni,
              public.odpovedi, public.semafory, public.admini
  from anon, authenticated;

-- rodiny: čtení a úprava vlastního řádku (chráněné sloupce hlídá trigger 0004); insert jen trigger
grant select, update                 on public.rodiny    to authenticated;
-- deti: přidání 2. dítěte a úprava; mazání jen ručně v SQL
grant select, insert, update         on public.deti      to authenticated;
-- lekce: jen čtení (zápis pouze seed se service key)
grant select                         on public.lekce     to authenticated;
grant select, insert, update         on public.sezeni    to authenticated;
-- odpovedi: append-only
grant select, insert                 on public.odpovedi  to authenticated;
-- semafory: upsert = insert + update
grant select, insert, update         on public.semafory  to authenticated;
-- admini: jen zjištění vlastní role
grant select                         on public.admini    to authenticated;

grant select, insert, update, delete on public.rodiny, public.deti, public.lekce, public.sezeni,
                                        public.odpovedi, public.semafory, public.admini
  to service_role;

grant usage, select on all sequences in schema public to authenticated, service_role;
