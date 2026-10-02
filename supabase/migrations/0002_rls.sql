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
-- Spolu 8 v1: žádná platba ani zámek podle předmětu — lekce vidí každá přihlášená rodina od otevrit_od
-- (seed --otevrit-od, všechny lekce najednou). Předmět dítěte hlídá až založení sezení (sezeni_insert).
--   'neprihlaseno' — bez session
--   'uzavreno'     — rodina ve stavu uzavreny: nečte nic
--   'datum'        — now() < otevrit_od (a lekce není verejna)
create or replace function public.duvod_zamceni(p_verejna boolean, p_otevrit_od timestamptz)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select auth.uid()) is null              then 'neprihlaseno'
    when public.je_admin()                        then null
    when coalesce(r.stav, 'aktivni') = 'uzavreny' then 'uzavreno'
    when p_verejna                                then null
    when now() < p_otevrit_od                     then 'datum'
    else null
  end
  from (select 1) as jeden
  left join public.rodiny r on r.id = (select auth.uid());
$$;

-- Má dítě daný předmět zapnutý? (deti.predmety; sezení jen pro dítě s předmětem lekce)
create or replace function public.dite_ma_predmet_lekce(p_dite_id uuid, p_lekce_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.deti d
    join public.lekce l on l.id = p_lekce_id
    where d.id = p_dite_id and l.predmet = any (d.predmety)
  );
$$;

-- Práva na funkce: nikdy anon/public; authenticated je potřebuje pro politiky a RPC.
revoke execute on function public.je_admin()                              from public, anon;
revoke execute on function public.moje_dite(uuid)                         from public, anon;
revoke execute on function public.moje_sezeni(uuid)                       from public, anon;
revoke execute on function public.duvod_zamceni(boolean, timestamptz)     from public, anon;
revoke execute on function public.dite_ma_predmet_lekce(uuid, text)       from public, anon;
grant  execute on function public.je_admin()                              to authenticated, service_role;
grant  execute on function public.moje_dite(uuid)                         to authenticated, service_role;
grant  execute on function public.moje_sezeni(uuid)                       to authenticated, service_role;
grant  execute on function public.duvod_zamceni(boolean, timestamptz)     to authenticated, service_role;
grant  execute on function public.dite_ma_predmet_lekce(uuid, text)       to authenticated, service_role;

-- ---------------------------------------------------------------------
-- Zapnutí RLS všude
-- ---------------------------------------------------------------------
alter table public.rodiny    enable row level security;
alter table public.deti      enable row level security;
alter table public.lekce     enable row level security;
alter table public.sezeni    enable row level security;
alter table public.odpovedi  enable row level security;
alter table public.semafory  enable row level security;
alter table public.admini    enable row level security;

-- ---------------------------------------------------------------------
-- rodiny: select/update vlastní; admin vše. Insert jen trigger po registraci.
-- Chráněné sloupce (stav, odemknuto_at, poznamka_admin) hlídá
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
-- lekce: select dle duvod_zamceni() (verejna OR now() >= otevrit_od OR admin; uzavreny nečte nic).
-- Žádná politika pro insert/update/delete = klient nezapisuje.
-- ---------------------------------------------------------------------
drop policy if exists lekce_select on public.lekce;
create policy lekce_select on public.lekce
  for select to authenticated
  using (public.duvod_zamceni(verejna, otevrit_od) is null);

-- ---------------------------------------------------------------------
-- sezeni: rodina své (přes dite_id); admin select vše.
-- Insert jen pro lekci, kterou rodina smí číst (poddotaz podléhá RLS na lekce),
-- a jen dítěti, které má předmět lekce v deti.predmety.
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
    and public.dite_ma_predmet_lekce(dite_id, lekce_id)
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
-- admini: select jen sám sebe; zápis jen ručně v SQL (žádná politika)
-- ---------------------------------------------------------------------
drop policy if exists admini_select on public.admini;
create policy admini_select on public.admini
  for select to authenticated
  using (uid = (select auth.uid()));
