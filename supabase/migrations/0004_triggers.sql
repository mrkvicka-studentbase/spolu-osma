-- =====================================================================
-- 0004_triggers.sql — triggery: registrace (rodina + 1. dítě, R6), max 2 děti,
-- ochrana sloupců rodiny, konec sezení. (Spolu 8: bez dotazníku a platby.)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Po registraci (after insert on auth.users): založí rodiny a (R6) první dítě.
-- Metadata (options.data v supabase.auth.signUp):
--   jmeno_rodice, zdroj, dite_jmeno; volitelně predmety (pole 'matematika'/'cestina', výchozí oba)
--   Spolu 8 typ školy ani známku nevyžaduje (sloupce zůstaly, plní se null).
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
  v_predm  text[];
begin
  m := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_jmeno := left(btrim(coalesce(m ->> 'jmeno_rodice', '')), 100);
  v_zdroj := nullif(left(btrim(coalesce(m ->> 'zdroj', '')), 50), '');

  insert into public.rodiny (id, email, jmeno_rodice, zdroj, stav)
  values (new.id, new.email, v_jmeno, v_zdroj, 'aktivni')
  on conflict (id) do nothing;

  v_dite := nullif(left(btrim(coalesce(m ->> 'dite_jmeno', '')), 50), '');
  if v_dite is not null then
    if jsonb_typeof(m -> 'predmety') = 'array' then
      select array_agg(distinct x) into v_predm
      from jsonb_array_elements_text(m -> 'predmety') as x
      where x in ('matematika', 'cestina');
    end if;
    begin
      insert into public.deti (rodina_id, krestni_jmeno, poradi, predmety)
      values (new.id, v_dite, 1, coalesce(v_predm, '{matematika,cestina}'));
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
--   stav, odemknuto_at, poznamka_admin  — jen admin (je_admin())
-- Funkce je SECURITY INVOKER: current_user je volající role. Triggery/skripty
-- běžící jako postgres/service_role (SQL Editor, seed) projdou.
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
      or new.poznamka_admin   is distinct from old.poznamka_admin) then
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
