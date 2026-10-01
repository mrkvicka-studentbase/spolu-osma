-- =====================================================================
-- 0007_predmet.sql — druhý předmět (čeština) ve stejné DB (ZADANI-CESTINA §8.1, cestina/Obsah/FORMAT-CJ.md)
--
-- STAV: připraveno ke spuštění (Pavel 30. 9.: čeština se spouští s pilotem). Neaplikováno — spouští Pavel
-- přes `npm run migrovat` (po 0006_rezim_samo), postup v cestina/REPORT-SPUSTENI.md. Transakci řídí migrovat.mjs.
-- (Do 1. 10. se jmenovala 0006_predmet.sql; přejmenováno, protože main má 0006_rezim_samo.)
-- Idempotentní (lze spustit opakovaně). Rollback: cestina/db/0007_predmet-rollback.sql (`npm run sql -- --soubor …`).
-- Otestováno lokálně (PostgreSQL 16) nad migracemi 0001–0006 se stuby auth.* — cestina/db/test/over-migrace.sh.
--
-- Co mění:
--   lekce.predmet  ('matematika' | 'cestina', výchozí matematika — stávající řádky se nemění)
--   lekce.faze     + 'zaklady' (čeština); kontrola, že čeština má fázi zaklady a id s prefixem cj-
--   index (predmet, faze, tyden, poradi)
--   deti.predmety  text[] (výchozí {matematika}) — které předměty má dítě aktivní (přepínač v přehledu)
--   katalog_lekci() vrací navíc predmet (přehled filtruje podle předmětu)
--   zámek podle předmětu (rozhodnutí Pavla 1. 10., KONTROLA-2026-09-30-2 D4): lekce češtiny vidí rodina,
--     jejíž dítě má 'cestina' v deti.predmety, podle otevrit_od a BEZ OHLEDU na stav rodiny (pilot i aktivni);
--     matematika beze změny (duvod_zamceni z 0002). Sezení češtiny jde založit jen dítěti s 'cestina'.
-- Nemění: tabulky sezeni, odpovedi, semafory (předmět se odvodí z lekce_id), duvod_zamceni() Matematiky.
-- =====================================================================


alter table public.lekce add column if not exists predmet text not null default 'matematika';

alter table public.lekce drop constraint if exists lekce_predmet_check;
alter table public.lekce add constraint lekce_predmet_check check (predmet in ('matematika', 'cestina'));

alter table public.lekce drop constraint if exists lekce_faze_check;
alter table public.lekce add constraint lekce_faze_check check (faze in ('pilot', 'faze1', 'faze2', 'zaklady'));

-- čeština = fáze zaklady a id cj-…; matematika fázi zaklady nemá
alter table public.lekce drop constraint if exists lekce_predmet_faze_check;
alter table public.lekce add constraint lekce_predmet_faze_check
  check ((predmet = 'cestina') = (faze = 'zaklady') and (predmet <> 'cestina' or id like 'cj-%'));

create index if not exists lekce_predmet_faze_tyden_poradi_idx on public.lekce (predmet, faze, tyden, poradi);

alter table public.deti add column if not exists predmety text[] not null default '{matematika}';
alter table public.deti drop constraint if exists deti_predmety_check;
alter table public.deti add constraint deti_predmety_check
  check (cardinality(predmety) between 1 and 2 and predmety <@ array['matematika', 'cestina']::text[]);

-- ---------------------------------------------------------------------
-- Zámek podle předmětu. Jediné místo s pravidlem přístupu: RLS na lekce, katalog_lekci(), sezeni_insert.
--   matematika            → duvod_zamceni(verejna, otevrit_od) z 0002, beze změny
--   cestina:
--     'neprihlaseno'      — bez session
--     null                — admin
--     'uzavreno'          — rodina ve stavu uzavreny
--     'predmet'           — žádné dítě rodiny nemá 'cestina' v deti.predmety
--     'datum'             — now() < otevrit_od
--     null                — jinak (stav rodiny pilot i aktivni; verejna se u češtiny nepoužívá)
-- ---------------------------------------------------------------------
create or replace function public.duvod_zamceni_lekce(p_predmet text, p_verejna boolean, p_otevrit_od timestamptz)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when p_predmet is distinct from 'cestina'   then public.duvod_zamceni(p_verejna, p_otevrit_od)
    when (select auth.uid()) is null            then 'neprihlaseno'
    when public.je_admin()                      then null
    when coalesce(r.stav, 'pilot') = 'uzavreny' then 'uzavreno'
    when not exists (
      select 1 from public.deti d
      where d.rodina_id = (select auth.uid()) and 'cestina' = any (d.predmety)
    )                                           then 'predmet'
    when now() < p_otevrit_od                   then 'datum'
    else null
  end
  from (select 1) as jeden
  left join public.rodiny r on r.id = (select auth.uid());
$$;

revoke execute on function public.duvod_zamceni_lekce(text, boolean, timestamptz) from public, anon;
grant  execute on function public.duvod_zamceni_lekce(text, boolean, timestamptz) to authenticated, service_role;

drop policy if exists lekce_select on public.lekce;
create policy lekce_select on public.lekce
  for select to authenticated
  using (public.duvod_zamceni_lekce(predmet, verejna, otevrit_od) is null);

-- sezení češtiny jen pro dítě, které má češtinu zapnutou (matematika jako v 0002)
drop policy if exists sezeni_insert on public.sezeni;
create policy sezeni_insert on public.sezeni
  for insert to authenticated
  with check (
    public.moje_dite(dite_id)
    and exists (select 1 from public.lekce l where l.id = lekce_id)
    and (
      not exists (select 1 from public.lekce l where l.id = lekce_id and l.predmet = 'cestina')
      or exists (select 1 from public.deti d where d.id = dite_id and 'cestina' = any (d.predmety))
    )
  );

-- katalog_lekci(): návratový typ se mění (+ predmet) → drop + create, práva znovu
drop function if exists public.katalog_lekci();
create function public.katalog_lekci()
returns table (
  id          text,
  predmet     text,
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
    l.id, l.predmet, l.faze, l.tyden, l.poradi, l.tema, l.kapitola, l.varianta,
    case when (l.obsah ->> 'cas_min') ~ '^[0-9]+$' then (l.obsah ->> 'cas_min')::integer end,
    l.otevrit_od, l.verejna, l.verze,
    public.duvod_zamceni_lekce(l.predmet, l.verejna, l.otevrit_od)
  from public.lekce l
  where (select auth.uid()) is not null
  order by
    l.predmet,
    case l.faze when 'pilot' then 1 when 'faze1' then 2 when 'faze2' then 3 else 4 end,
    l.tyden, l.poradi, l.id;
$$;

revoke execute on function public.katalog_lekci() from public, anon;
grant  execute on function public.katalog_lekci() to authenticated, service_role;

