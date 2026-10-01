-- =====================================================================
-- vse-v-jednom.sql — VYGENEROVÁNO skriptem supabase/skripty/spoj-migrace.mjs
-- NEUPRAVUJTE ručně; upravte migrace v supabase/migrations/ a vygenerujte znovu.
-- Obsahuje: 0001_schema.sql, 0002_rls.sql, 0003_views.sql, 0004_triggers.sql, 0005_admin.sql
-- Použití: Supabase → SQL Editor → New query → vložit celý soubor → Run.
-- Vše běží v jedné transakci: při chybě se neprovede nic.
-- =====================================================================

begin;

-- >>>>> 0001_schema.sql >>>>>
-- =====================================================================
-- 0001_schema.sql — Spolu na přijímačky: tabulky, constraints, indexy, GRANTy
-- Závazné schéma: kostra/02-datovy-model.md. Názvy česky bez diakritiky (R1).
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
  stav             text not null default 'pilot'
                   check (stav in ('pilot', 'aktivni', 'uzavreny')),
  zdroj            text check (zdroj is null or char_length(zdroj) <= 50),
  dotaznik_vyplnen boolean not null default false,
  poznamka_admin   text,
  odemknuto_at     timestamptz,
  created_at       timestamptz not null default now()
);

comment on table public.rodiny is 'Rodina = účet (auth.users). Chráněné sloupce (stav, odemknuto_at, poznamka_admin, dotaznik_vyplnen) mění jen admin / triggery.';

create index if not exists rodiny_stav_idx on public.rodiny (stav);

-- ---------------------------------------------------------------------
-- deti — max 2 na rodinu (check poradi 1–2 + unique + trigger v 0004)
-- ---------------------------------------------------------------------
create table if not exists public.deti (
  id            uuid primary key default gen_random_uuid(),
  rodina_id     uuid not null references public.rodiny (id) on delete cascade,
  krestni_jmeno text not null
                check (char_length(btrim(krestni_jmeno)) between 1 and 50),
  typ_skoly     text not null check (typ_skoly in ('gymnazium', 'ss_maturita')),
  znamka_8      smallint check (znamka_8 between 1 and 5),
  varianta      text not null default 'z9' check (varianta in ('z9', 'z7')),
  -- poradi doplní trigger, pokud ho klient nepošle (NOT NULL se kontroluje až po BEFORE triggeru)
  poradi        smallint not null check (poradi between 1 and 2),
  created_at    timestamptz not null default now(),
  constraint deti_rodina_poradi_key unique (rodina_id, poradi)
);

-- ---------------------------------------------------------------------
-- lekce — obsah (jsonb) nahrává jen seed se service key; klient nezapisuje
-- ---------------------------------------------------------------------
create table if not exists public.lekce (
  id          text primary key check (id ~ '^[A-Za-z0-9-]{1,40}$'),
  faze        text not null check (faze in ('pilot', 'faze1', 'faze2')),
  tyden       smallint not null check (tyden between 0 and 16),
  poradi      smallint not null check (poradi between 1 and 4),
  tema        text not null,
  kapitola    text not null,
  varianta    text not null default 'z9' check (varianta in ('z9', 'z7')),
  obsah       jsonb not null,
  verejna     boolean not null default false,
  otevrit_od  timestamptz not null,
  verze       integer not null default 1 check (verze >= 1),
  created_at  timestamptz not null default now()
);

create index if not exists lekce_faze_tyden_poradi_idx on public.lekce (faze, tyden, poradi);

-- ---------------------------------------------------------------------
-- sezeni — jedno projití lekce jedním dítětem
-- ---------------------------------------------------------------------
create table if not exists public.sezeni (
  id          uuid primary key default gen_random_uuid(),
  dite_id     uuid not null references public.deti (id) on delete cascade,
  -- lekce se nemažou (seed dělá jen upsert); restrict chrání historii
  lekce_id    text not null references public.lekce (id) on update cascade on delete restrict,
  rezim       text not null default 'app' check (rezim in ('app', 'papir')),
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
-- dotazniky — jeden na rodinu; insert nastaví rodiny.dotaznik_vyplnen (trigger 0004)
-- ---------------------------------------------------------------------
create table if not exists public.dotazniky (
  rodina_id    uuid primary key references public.rodiny (id) on delete cascade,
  odpovedi     jsonb not null,
  vyplneno_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

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
              public.odpovedi, public.semafory, public.dotazniky, public.admini
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
grant select, insert                 on public.dotazniky to authenticated;
-- admini: jen zjištění vlastní role
grant select                         on public.admini    to authenticated;

grant select, insert, update, delete on public.rodiny, public.deti, public.lekce, public.sezeni,
                                        public.odpovedi, public.semafory, public.dotazniky, public.admini
  to service_role;

grant usage, select on all sequences in schema public to authenticated, service_role;
-- <<<<< konec 0001_schema.sql <<<<<

-- >>>>> 0002_rls.sql >>>>>
-- =====================================================================
-- 0002_rls.sql — Row Level Security: pomocné funkce + politiky (kostra/02, sekce RLS)
-- Všechny pomocné funkce: security definer, stable, set search_path = ''
-- (plně kvalifikované názvy), aby se politiky nezacyklily přes RLS jiných tabulek.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Pomocné funkce
-- ---------------------------------------------------------------------

-- Je přihlášený uživatel admin? (tabulka admini)
create or replace function public.je_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admini a where a.uid = (select auth.uid())
  );
$$;

-- Patří dítě přihlášené rodině?
create or replace function public.moje_dite(p_dite_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.deti d
    where d.id = p_dite_id and d.rodina_id = (select auth.uid())
  );
$$;

-- Patří sezení (přes dítě) přihlášené rodině?
create or replace function public.moje_sezeni(p_sezeni_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.sezeni s
    join public.deti d on d.id = s.dite_id
    where s.id = p_sezeni_id and d.rodina_id = (select auth.uid())
  );
$$;

-- Proč je lekce pro přihlášeného zamčená? null = přístupná.
-- Jediné místo s pravidlem přístupu k obsahu: používá ho RLS na lekce i katalog_lekci() (0003).
--   'neprihlaseno' — bez session
--   'uzavreno'     — rodina ve stavu uzavreny (od 1. 5.): nečte nic, ani pilot (kostra 01)
--   'platba'       — neveřejná lekce a rodina není aktivni (čeká na platbu)
--   'datum'        — rodina aktivni, ale now() < otevrit_od
create or replace function public.duvod_zamceni(p_verejna boolean, p_otevrit_od timestamptz)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select auth.uid()) is null            then 'neprihlaseno'
    when public.je_admin()                      then null
    when coalesce(r.stav, 'pilot') = 'uzavreny' then 'uzavreno'
    when p_verejna                              then null
    when coalesce(r.stav, 'pilot') <> 'aktivni' then 'platba'
    when now() < p_otevrit_od                   then 'datum'
    else null
  end
  from (select 1) as jeden
  left join public.rodiny r on r.id = (select auth.uid());
$$;

-- Práva na funkce: nikdy anon/public; authenticated je potřebuje pro politiky a RPC.
revoke execute on function public.je_admin()                              from public, anon;
revoke execute on function public.moje_dite(uuid)                         from public, anon;
revoke execute on function public.moje_sezeni(uuid)                       from public, anon;
revoke execute on function public.duvod_zamceni(boolean, timestamptz)     from public, anon;
grant  execute on function public.je_admin()                              to authenticated, service_role;
grant  execute on function public.moje_dite(uuid)                         to authenticated, service_role;
grant  execute on function public.moje_sezeni(uuid)                       to authenticated, service_role;
grant  execute on function public.duvod_zamceni(boolean, timestamptz)     to authenticated, service_role;

-- ---------------------------------------------------------------------
-- Zapnutí RLS všude
-- ---------------------------------------------------------------------
alter table public.rodiny    enable row level security;
alter table public.deti      enable row level security;
alter table public.lekce     enable row level security;
alter table public.sezeni    enable row level security;
alter table public.odpovedi  enable row level security;
alter table public.semafory  enable row level security;
alter table public.dotazniky enable row level security;
alter table public.admini    enable row level security;

-- ---------------------------------------------------------------------
-- rodiny: select/update vlastní; admin vše. Insert jen trigger po registraci.
-- Chráněné sloupce (stav, odemknuto_at, poznamka_admin, dotaznik_vyplnen) hlídá
-- trigger rodiny_ochrana (0004) — RLS neumí omezit sloupce.
-- ---------------------------------------------------------------------
drop policy if exists rodiny_select on public.rodiny;
create policy rodiny_select on public.rodiny
  for select to authenticated
  using (id = (select auth.uid()) or public.je_admin());

drop policy if exists rodiny_update on public.rodiny;
create policy rodiny_update on public.rodiny
  for update to authenticated
  using (id = (select auth.uid()) or public.je_admin())
  with check (id = (select auth.uid()) or public.je_admin());

-- ---------------------------------------------------------------------
-- deti: rodina své řádky; admin čte vše. Max 2 hlídá trigger (0004).
-- ---------------------------------------------------------------------
drop policy if exists deti_select on public.deti;
create policy deti_select on public.deti
  for select to authenticated
  using (rodina_id = (select auth.uid()) or public.je_admin());

drop policy if exists deti_insert on public.deti;
create policy deti_insert on public.deti
  for insert to authenticated
  with check (rodina_id = (select auth.uid()));

drop policy if exists deti_update on public.deti;
create policy deti_update on public.deti
  for update to authenticated
  using (rodina_id = (select auth.uid()))
  with check (rodina_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- lekce: select dle duvod_zamceni() (verejna OR (aktivni AND now() >= otevrit_od) OR admin;
-- uzavreny nečte nic). Žádná politika pro insert/update/delete = klient nezapisuje.
-- ---------------------------------------------------------------------
drop policy if exists lekce_select on public.lekce;
create policy lekce_select on public.lekce
  for select to authenticated
  using (public.duvod_zamceni(verejna, otevrit_od) is null);

-- ---------------------------------------------------------------------
-- sezeni: rodina své (přes dite_id); admin select vše.
-- Insert jen pro lekci, kterou rodina smí číst (poddotaz podléhá RLS na lekce).
-- ---------------------------------------------------------------------
drop policy if exists sezeni_select on public.sezeni;
create policy sezeni_select on public.sezeni
  for select to authenticated
  using (public.moje_dite(dite_id) or public.je_admin());

drop policy if exists sezeni_insert on public.sezeni;
create policy sezeni_insert on public.sezeni
  for insert to authenticated
  with check (
    public.moje_dite(dite_id)
    and exists (select 1 from public.lekce l where l.id = lekce_id)
  );

drop policy if exists sezeni_update on public.sezeni;
create policy sezeni_update on public.sezeni
  for update to authenticated
  using (public.moje_dite(dite_id))
  with check (public.moje_dite(dite_id));

-- ---------------------------------------------------------------------
-- odpovedi: rodina své (přes sezeni → dite); admin select vše
-- ---------------------------------------------------------------------
drop policy if exists odpovedi_select on public.odpovedi;
create policy odpovedi_select on public.odpovedi
  for select to authenticated
  using (public.moje_sezeni(sezeni_id) or public.je_admin());

drop policy if exists odpovedi_insert on public.odpovedi;
create policy odpovedi_insert on public.odpovedi
  for insert to authenticated
  with check (public.moje_sezeni(sezeni_id));

-- ---------------------------------------------------------------------
-- semafory: rodina své; admin select vše
-- ---------------------------------------------------------------------
drop policy if exists semafory_select on public.semafory;
create policy semafory_select on public.semafory
  for select to authenticated
  using (public.moje_sezeni(sezeni_id) or public.je_admin());

drop policy if exists semafory_insert on public.semafory;
create policy semafory_insert on public.semafory
  for insert to authenticated
  with check (public.moje_sezeni(sezeni_id));

drop policy if exists semafory_update on public.semafory;
create policy semafory_update on public.semafory
  for update to authenticated
  using (public.moje_sezeni(sezeni_id))
  with check (public.moje_sezeni(sezeni_id));

-- ---------------------------------------------------------------------
-- dotazniky: rodina insert/select vlastní; admin select
-- ---------------------------------------------------------------------
drop policy if exists dotazniky_select on public.dotazniky;
create policy dotazniky_select on public.dotazniky
  for select to authenticated
  using (rodina_id = (select auth.uid()) or public.je_admin());

drop policy if exists dotazniky_insert on public.dotazniky;
create policy dotazniky_insert on public.dotazniky
  for insert to authenticated
  with check (rodina_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- admini: select jen sám sebe; zápis jen ručně v SQL (žádná politika)
-- ---------------------------------------------------------------------
drop policy if exists admini_select on public.admini;
create policy admini_select on public.admini
  for select to authenticated
  using (uid = (select auth.uid()));
-- <<<<< konec 0002_rls.sql <<<<<

-- >>>>> 0003_views.sql >>>>>
-- =====================================================================
-- 0003_views.sql — pohledy pro admin (kostra/02) + katalog lekcí pro klienta
-- Všechny pohledy: security_invoker = true → platí RLS podkladových tabulek.
-- Admin (je_admin) vidí vše; běžná rodina by viděla jen svá data.
-- =====================================================================

-- ---------------------------------------------------------------------
-- v_prehled_rodin — rodina, děti, stav, poslední aktivita, dokončené lekce,
-- aktuální týden (max tyden dokončené lekce), červené za 7 dní
-- ---------------------------------------------------------------------
create or replace view public.v_prehled_rodin
with (security_invoker = true)
as
select
  r.id                                   as rodina_id,
  r.jmeno_rodice,
  r.email,
  r.telefon,
  r.stav,
  r.zdroj,
  r.dotaznik_vyplnen,
  r.poznamka_admin,
  r.odemknuto_at,
  r.created_at                           as registrace_at,
  coalesce(d.deti, '[]'::jsonb)          as deti,          -- [{id, krestni_jmeno, typ_skoly, znamka_8, poradi}]
  d.deti_jmena,                                           -- „Anna, Petr" (pro hledání / CSV)
  s.posledni_aktivita,
  coalesce(s.dokonceno_lekci, 0)         as dokonceno_lekci,
  s.aktualni_tyden,
  s.posledni_lekce_id,
  coalesce(c.cervene_7d, 0)              as cervene_7d
from public.rodiny r
left join lateral (
  select
    jsonb_agg(jsonb_build_object(
      'id', x.id, 'krestni_jmeno', x.krestni_jmeno, 'typ_skoly', x.typ_skoly,
      'znamka_8', x.znamka_8, 'poradi', x.poradi) order by x.poradi) as deti,
    string_agg(x.krestni_jmeno, ', ' order by x.poradi)              as deti_jmena
  from public.deti x
  where x.rodina_id = r.id
) d on true
left join lateral (
  select
    max(se.zacatek)                                                        as posledni_aktivita,
    count(distinct (se.dite_id::text || '|' || se.lekce_id))
      filter (where se.stav = 'dokonceno')                                 as dokonceno_lekci,
    max(l.tyden) filter (where se.stav = 'dokonceno')                      as aktualni_tyden,
    (array_agg(se.lekce_id order by se.zacatek desc))[1]                   as posledni_lekce_id
  from public.sezeni se
  join public.deti x  on x.id = se.dite_id
  join public.lekce l on l.id = se.lekce_id
  where x.rodina_id = r.id
) s on true
left join lateral (
  select count(*) as cervene_7d
  from public.semafory sm
  join public.sezeni se on se.id = sm.sezeni_id
  join public.deti x    on x.id = se.dite_id
  where x.rodina_id = r.id
    and sm.barva = 'cervena'
    and sm.created_at >= now() - interval '7 days'
) c on true;

-- ---------------------------------------------------------------------
-- v_semafory_dle_kapitoly — kapitola × barva → počet.
-- Řádky s dite_id = null (je_celkem = true) jsou součty přes všechny děti.
-- ---------------------------------------------------------------------
create or replace view public.v_semafory_dle_kapitoly
with (security_invoker = true)
as
select
  l.kapitola,
  sm.barva,
  se.dite_id,
  d.krestni_jmeno,
  (grouping(se.dite_id) = 1)  as je_celkem,
  count(*)::int               as pocet
from public.semafory sm
join public.sezeni se on se.id = sm.sezeni_id
join public.deti d    on d.id = se.dite_id
join public.lekce l   on l.id = se.lekce_id
group by grouping sets (
  (l.kapitola, sm.barva),
  (l.kapitola, sm.barva, se.dite_id, d.krestni_jmeno)
);

-- ---------------------------------------------------------------------
-- v_cas_na_ulohu — průměrný čas (s) na úlohu a na kapitolu.
-- Předpoklad: odpovedi.cas_s = sekundy od zobrazení kroku do tohoto odevzdání
-- (2. pokus tedy obsahuje i čas 1. pokusu). Čas úlohy v sezení = součet přes kroky
-- z maxima cas_s daného kroku. Počítá jen odpovědi dítěte (zadal = 'dite').
-- Řádky s uloha_id = null (je_kapitola = true) jsou průměry za kapitolu.
-- ---------------------------------------------------------------------
create or replace view public.v_cas_na_ulohu
with (security_invoker = true)
as
with kroky as (
  select o.sezeni_id, o.uloha_id, o.krok_id, max(o.cas_s) as cas_s
  from public.odpovedi o
  where o.cas_s is not null and o.zadal = 'dite'
  group by o.sezeni_id, o.uloha_id, o.krok_id
),
ulohy as (
  select k.sezeni_id, k.uloha_id, sum(k.cas_s) as cas_s
  from kroky k
  group by k.sezeni_id, k.uloha_id
)
select
  l.kapitola,
  se.lekce_id,
  u.uloha_id,
  (grouping(u.uloha_id) = 1)       as je_kapitola,
  round(avg(u.cas_s))::int         as prumer_cas_s,
  count(*)::int                    as pocet_mereni
from ulohy u
join public.sezeni se on se.id = u.sezeni_id
join public.lekce l   on l.id = se.lekce_id
group by grouping sets (
  (l.kapitola, se.lekce_id, u.uloha_id),
  (l.kapitola)
);

-- ---------------------------------------------------------------------
-- v_cervene — všechny červené semafory, od nejnovější
-- ---------------------------------------------------------------------
create or replace view public.v_cervene
with (security_invoker = true)
as
select
  sm.created_at      as datum,
  r.id               as rodina_id,
  r.jmeno_rodice,
  r.email,
  d.id               as dite_id,
  d.krestni_jmeno,
  se.id              as sezeni_id,
  se.lekce_id,
  l.tema,
  l.kapitola,
  sm.uloha_id,
  sm.volba_rodice,
  sm.spravne_auto
from public.semafory sm
join public.sezeni se on se.id = sm.sezeni_id
join public.deti d    on d.id = se.dite_id
join public.rodiny r  on r.id = d.rodina_id
join public.lekce l   on l.id = se.lekce_id
where sm.barva = 'cervena'
order by sm.created_at desc;

-- ---------------------------------------------------------------------
-- v_alarm — dítě, které má za posledních 7 dní ≥ 3 lekce (sezení se semaforem)
-- a v KAŽDÉ z nich aspoň jednu červenou. Jen pro přehled; e-mail až ve Fázi 1.
-- ---------------------------------------------------------------------
create or replace view public.v_alarm
with (security_invoker = true)
as
with sezeni_7d as (
  select
    se.id, se.dite_id, se.zacatek,
    bool_or(sm.barva = 'cervena') as ma_cervenou
  from public.sezeni se
  join public.semafory sm on sm.sezeni_id = se.id
  where se.zacatek >= now() - interval '7 days'
  group by se.id, se.dite_id, se.zacatek
)
select
  d.id                 as dite_id,
  d.krestni_jmeno,
  r.id                 as rodina_id,
  r.jmeno_rodice,
  r.email,
  count(*)::int        as pocet_lekci_7d,
  max(s.zacatek)       as posledni_lekce
from sezeni_7d s
join public.deti d   on d.id = s.dite_id
join public.rodiny r on r.id = d.rodina_id
group by d.id, d.krestni_jmeno, r.id, r.jmeno_rodice, r.email
having count(*) >= 3 and bool_and(s.ma_cervenou);

-- GRANTy pro pohledy (security_invoker → skutečný filtr dělá RLS)
revoke all on public.v_prehled_rodin, public.v_semafory_dle_kapitoly, public.v_cas_na_ulohu,
              public.v_cervene, public.v_alarm
  from anon, authenticated;
grant select on public.v_prehled_rodin, public.v_semafory_dle_kapitoly, public.v_cas_na_ulohu,
                public.v_cervene, public.v_alarm
  to authenticated, service_role;

-- ---------------------------------------------------------------------
-- katalog_lekci() — metadata VŠECH lekcí (bez obsahu) pro přihlášené.
-- RLS zamčené lekce z tabulky nevrátí; přehled ale musí ukázat i zamčené karty
-- („Otevře se 1. 11." / „Odemkne se po platbě"). Obsah (jsonb) se nevrací.
-- zamceno: null = přístupná | 'platba' | 'datum' | 'uzavreno' (viz duvod_zamceni v 0002)
-- ---------------------------------------------------------------------
create or replace function public.katalog_lekci()
returns table (
  id          text,
  faze        text,
  tyden       smallint,
  poradi      smallint,
  tema        text,
  kapitola    text,
  varianta    text,
  cas_min     integer,
  otevrit_od  timestamptz,
  verejna     boolean,
  verze       integer,
  zamceno     text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    l.id, l.faze, l.tyden, l.poradi, l.tema, l.kapitola, l.varianta,
    case when (l.obsah ->> 'cas_min') ~ '^[0-9]+$' then (l.obsah ->> 'cas_min')::integer end,
    l.otevrit_od, l.verejna, l.verze,
    public.duvod_zamceni(l.verejna, l.otevrit_od)
  from public.lekce l
  where (select auth.uid()) is not null
  order by
    case l.faze when 'pilot' then 1 when 'faze1' then 2 else 3 end,
    l.tyden, l.poradi, l.id;
$$;

revoke execute on function public.katalog_lekci() from public, anon;
grant  execute on function public.katalog_lekci() to authenticated, service_role;
-- <<<<< konec 0003_views.sql <<<<<

-- >>>>> 0004_triggers.sql >>>>>
-- =====================================================================
-- 0004_triggers.sql — triggery: registrace (rodina + 1. dítě, R6), max 2 děti,
-- ochrana sloupců rodiny, dotazník → nárok, konec sezení.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Po registraci (after insert on auth.users): založí rodiny a (R6) první dítě.
-- Metadata (options.data v supabase.auth.signUp):
--   jmeno_rodice, zdroj, dite_jmeno, typ_skoly ('gymnazium'|'ss_maturita'), znamka_8 (1–5)
-- Zásada: chyba v datech dítěte NESMÍ shodit registraci (jinak Supabase vrátí
-- „Database error saving new user"). Dítě se pak jen nezaloží a klient nabídne
-- přidání dítěte (mojeDeti() vrátí []).
-- ---------------------------------------------------------------------
create or replace function public.po_registraci()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  m        jsonb;
  v_jmeno  text;
  v_zdroj  text;
  v_dite   text;
  v_typ    text;
  v_znamka smallint;
begin
  m := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_jmeno := left(btrim(coalesce(m ->> 'jmeno_rodice', '')), 100);
  v_zdroj := nullif(left(btrim(coalesce(m ->> 'zdroj', '')), 50), '');

  insert into public.rodiny (id, email, jmeno_rodice, zdroj, stav)
  values (new.id, new.email, v_jmeno, v_zdroj, 'pilot')
  on conflict (id) do nothing;

  v_dite := nullif(left(btrim(coalesce(m ->> 'dite_jmeno', '')), 50), '');
  if v_dite is not null then
    v_typ := m ->> 'typ_skoly';
    if (m ->> 'znamka_8') ~ '^[1-5]$' then
      v_znamka := (m ->> 'znamka_8')::smallint;
    end if;
    begin
      insert into public.deti (rodina_id, krestni_jmeno, typ_skoly, znamka_8, poradi)
      values (new.id, v_dite, v_typ, v_znamka, 1);
    exception when others then
      raise warning 'po_registraci: dite pro % se nepodarilo zalozit: % (%)', new.id, sqlerrm, sqlstate;
    end;
  end if;

  return new;
end;
$$;

drop trigger if exists po_registraci on auth.users;
create trigger po_registraci
  after insert on auth.users
  for each row execute function public.po_registraci();

-- Změna e-mailu v auth → kopie v rodiny.email (admin přehled, CSV)
create or replace function public.po_zmene_emailu()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.rodiny set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists po_zmene_emailu on auth.users;
create trigger po_zmene_emailu
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.po_zmene_emailu();

-- ---------------------------------------------------------------------
-- deti: max 2 na rodinu + automatické poradi (1, nebo 2), když ho klient nepošle.
-- Zámek na řádku rodiny serializuje souběžné inserty (dvě zařízení najednou).
-- ---------------------------------------------------------------------
create or replace function public.deti_pred_vlozenim()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pocet integer;
begin
  perform 1 from public.rodiny where id = new.rodina_id for update;

  select count(*) into v_pocet from public.deti where rodina_id = new.rodina_id;
  if v_pocet >= 2 then
    raise exception 'Rodina může mít nejvýše 2 profily dětí.'
      using errcode = 'P0001', hint = 'max_2_deti';
  end if;

  if new.poradi is null then
    select min(p.n) into new.poradi
    from (values (1::smallint), (2::smallint)) as p(n)
    where not exists (
      select 1 from public.deti d where d.rodina_id = new.rodina_id and d.poradi = p.n
    );
  end if;

  return new;
end;
$$;

drop trigger if exists deti_pred_vlozenim on public.deti;
create trigger deti_pred_vlozenim
  before insert on public.deti
  for each row execute function public.deti_pred_vlozenim();

-- ---------------------------------------------------------------------
-- rodiny: ochrana sloupců. Klient (role authenticated/anon) nesmí měnit
--   id, email, created_at               — nikdo z klienta
--   stav, odemknuto_at, poznamka_admin,
--   dotaznik_vyplnen                    — jen admin (je_admin())
-- Funkce je SECURITY INVOKER: current_user je volající role. Triggery/skripty
-- běžící jako postgres/service_role (po_dotazniku, SQL Editor, seed) projdou.
-- Navíc: při změně stavu na 'aktivni' se doplní odemknuto_at = now().
-- ---------------------------------------------------------------------
create or replace function public.rodiny_ochrana()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.stav = 'aktivni'
     and old.stav is distinct from 'aktivni'
     and new.odemknuto_at is not distinct from old.odemknuto_at then
    new.odemknuto_at := now();
  end if;

  if current_user in ('authenticated', 'anon') then
    if new.id is distinct from old.id
       or new.email is distinct from old.email
       or new.created_at is distinct from old.created_at then
      raise exception 'Tento údaj nelze změnit.' using errcode = '42501';
    end if;

    if not public.je_admin() and (
         new.stav             is distinct from old.stav
      or new.odemknuto_at     is distinct from old.odemknuto_at
      or new.poznamka_admin   is distinct from old.poznamka_admin
      or new.dotaznik_vyplnen is distinct from old.dotaznik_vyplnen) then
      raise exception 'Tento údaj může změnit jen administrátor.' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists rodiny_ochrana on public.rodiny;
create trigger rodiny_ochrana
  before update on public.rodiny
  for each row execute function public.rodiny_ochrana();

-- ---------------------------------------------------------------------
-- dotazniky: po vložení nastav rodiny.dotaznik_vyplnen = true (nárok na 790 Kč).
-- Security definer → update běží jako vlastník (postgres) a projde ochranou.
-- ---------------------------------------------------------------------
create or replace function public.po_dotazniku()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.rodiny set dotaznik_vyplnen = true where id = new.rodina_id;
  return new;
end;
$$;

drop trigger if exists po_dotazniku on public.dotazniky;
create trigger po_dotazniku
  after insert on public.dotazniky
  for each row execute function public.po_dotazniku();

-- Čas vyplnění dotazníku určuje server, ne klient
create or replace function public.dotaznik_pred_vlozenim()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.vyplneno_at := now();
  return new;
end;
$$;

drop trigger if exists dotaznik_pred_vlozenim on public.dotazniky;
create trigger dotaznik_pred_vlozenim
  before insert on public.dotazniky
  for each row execute function public.dotaznik_pred_vlozenim();

-- ---------------------------------------------------------------------
-- sezeni: při ukončení (dokonceno/preruseno) doplň konec, pokud chybí
-- ---------------------------------------------------------------------
create or replace function public.sezeni_pred_ulozenim()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.stav <> 'probiha' and new.konec is null then
    new.konec := now();
  end if;
  return new;
end;
$$;

drop trigger if exists sezeni_pred_ulozenim on public.sezeni;
create trigger sezeni_pred_ulozenim
  before insert or update on public.sezeni
  for each row execute function public.sezeni_pred_ulozenim();
-- <<<<< konec 0004_triggers.sql <<<<<

-- >>>>> 0005_admin.sql >>>>>
-- =====================================================================
-- 0005_admin.sql — přidání admina (Pavel)
-- Tabulka public.admini je založená už v 0001 (potřebuje ji je_admin() v 0002).
--
-- POSTUP (jednou, ručně v Supabase → SQL Editor):
--   1. Zaregistrujte se na webu běžně jako rodič (nebo založte uživatele v
--      Supabase → Authentication → Users → Add user).
--   2. Zjistěte své uid: Supabase → Authentication → Users → klikněte na svůj
--      e-mail → pole „User UID" (tvar 1a2b3c4d-....).
--   3. Odkomentujte JEDNU z variant níže, doplňte hodnotu a spusťte.
--   4. Ověření: select * from public.admini;  (musí vrátit 1 řádek)
-- =====================================================================

-- Varianta A — podle uid:
-- insert into public.admini (uid) values ('<PAVLOVO-UID>') on conflict (uid) do nothing;

-- Varianta B — podle e-mailu (nemusíte hledat uid):
-- insert into public.admini (uid)
--   select id from auth.users where lower(email) = lower('<PAVLUV-EMAIL>')
--   on conflict (uid) do nothing;

-- Odebrání admina:
-- delete from public.admini where uid = '<UID>';
-- <<<<< konec 0005_admin.sql <<<<<

commit;
