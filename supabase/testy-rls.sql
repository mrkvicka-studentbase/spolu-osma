-- =====================================================================
-- testy-rls.sql — ruční test RLS a triggerů (spustit AŽ po aplikaci migrací)
-- Supabase → SQL Editor → vložit celý soubor → Run.
--
-- Vše běží v jedné transakci a na konci se ROLLBACKNE — v databázi nic nezůstane.
-- Každý test vypíše NOTICE „OK: …". Při selhání skript skončí chybou „SELHALO: …".
-- Výsledek: v záložce Results/Messages musí být jen OK řádky a na konci
-- „VŠECHNY TESTY RLS PROŠLY".
-- Testovací uid:
--   A = 00000000-0000-4000-a000-00000000000a  (rodina A, později admin)
--   B = 00000000-0000-4000-a000-00000000000b  (rodina B = „cizí" uživatel)
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0) Příprava dat jako postgres (obchází RLS)
-- ---------------------------------------------------------------------
insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                        raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-4000-a000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'test-a@example.invalid', '', '{"provider":"email","providers":["email"]}',
   '{"jmeno_rodice":"Rodič A","zdroj":"web","dite_jmeno":"Anička","typ_skoly":"gymnazium","znamka_8":2}', now(), now()),
  ('00000000-0000-4000-a000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'test-b@example.invalid', '', '{"provider":"email","providers":["email"]}',
   '{"jmeno_rodice":"Rodič B","dite_jmeno":"Bohouš","typ_skoly":"neplatny_typ"}', now(), now());

insert into public.lekce (id, faze, tyden, poradi, tema, kapitola, obsah, verejna, otevrit_od) values
  ('TEST-PILOT', 'pilot', 1, 1, 'Test pilot', 'test', '{"cas_min":20}', true,  now() - interval '1 day'),
  ('TEST-F1',    'faze1', 1, 1, 'Test F1',    'test', '{"cas_min":20}', false, now() - interval '1 day'),
  ('TEST-F2',    'faze2', 1, 1, 'Test F2',    'test', '{"cas_min":20}', false, now() + interval '60 days');

do $$
declare
  v_dite_a uuid;
  v_sez_a  uuid;
begin
  -- trigger po_registraci
  if (select count(*) from public.rodiny where id in ('00000000-0000-4000-a000-00000000000a',
                                                        '00000000-0000-4000-a000-00000000000b')) <> 2 then
    raise exception 'SELHALO: trigger po_registraci nezaložil obě rodiny';
  end if;
  if (select stav from public.rodiny where id = '00000000-0000-4000-a000-00000000000a') <> 'pilot' then
    raise exception 'SELHALO: nová rodina nemá stav pilot';
  end if;
  select id into v_dite_a from public.deti where rodina_id = '00000000-0000-4000-a000-00000000000a' and poradi = 1;
  if v_dite_a is null then raise exception 'SELHALO: trigger nezaložil 1. dítě rodiny A (R6)'; end if;
  if exists (select 1 from public.deti where rodina_id = '00000000-0000-4000-a000-00000000000b') then
    raise exception 'SELHALO: dítě s neplatným typ_skoly se nemělo založit';
  end if;
  raise notice 'OK: registrace založila rodiny A, B a dítě A; neplatné dítě B se přeskočilo bez pádu registrace';

  insert into public.sezeni (dite_id, lekce_id, rezim) values (v_dite_a, 'TEST-PILOT', 'app') returning id into v_sez_a;
  insert into public.odpovedi (sezeni_id, uloha_id, krok_id, hodnota, spravne, pokus, cas_s)
    values (v_sez_a, 'TEST-PILOT-U1', 'final', '1', true, 1, 30);
  insert into public.semafory (sezeni_id, uloha_id, volba_rodice, spravne_auto, barva)
    values (v_sez_a, 'TEST-PILOT-U1', 'sam', true, 'zelena');
  perform set_config('test.sezeni_a', v_sez_a::text, true);
  perform set_config('test.dite_a', v_dite_a::text, true);
end $$;

-- ---------------------------------------------------------------------
-- 1) Jako cizí uživatel B (role authenticated) — nesmí vidět ani měnit nic z A
-- ---------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-a000-00000000000b","role":"authenticated"}';

do $$
declare
  a      constant uuid := '00000000-0000-4000-a000-00000000000a';
  b      constant uuid := '00000000-0000-4000-a000-00000000000b';
  v_sez  uuid := current_setting('test.sezeni_a')::uuid;
  v_dite uuid := current_setting('test.dite_a')::uuid;
  n      integer;
  v_dite_b uuid;
begin
  if auth.uid() is distinct from b then raise exception 'SELHALO: auth.uid() neodpovídá B'; end if;

  select count(*) into n from public.rodiny;
  if n <> 1 then raise exception 'SELHALO: B vidí % rodin (má vidět 1 — svou)', n; end if;
  select count(*) into n from public.rodiny where id = a;
  if n <> 0 then raise exception 'SELHALO: B vidí rodinu A'; end if;
  select count(*) into n from public.deti where rodina_id = a;
  if n <> 0 then raise exception 'SELHALO: B vidí děti A'; end if;
  select count(*) into n from public.sezeni where id = v_sez;
  if n <> 0 then raise exception 'SELHALO: B vidí sezení A'; end if;
  select count(*) into n from public.odpovedi where sezeni_id = v_sez;
  if n <> 0 then raise exception 'SELHALO: B vidí odpovědi A'; end if;
  select count(*) into n from public.semafory where sezeni_id = v_sez;
  if n <> 0 then raise exception 'SELHALO: B vidí semafory A'; end if;
  select count(*) into n from public.admini;
  if n <> 0 then raise exception 'SELHALO: B vidí tabulku admini'; end if;
  if public.je_admin() then raise exception 'SELHALO: B je admin'; end if;
  select count(*) into n from public.v_prehled_rodin;
  if n <> 1 then raise exception 'SELHALO: B vidí ve v_prehled_rodin % řádků (má 1)', n; end if;
  select count(*) into n from public.v_cervene where rodina_id = a;
  if n <> 0 then raise exception 'SELHALO: B vidí červené A'; end if;
  raise notice 'OK: B nevidí data rodiny A (rodiny, deti, sezeni, odpovedi, semafory, admini, pohledy)';

  update public.rodiny set jmeno_rodice = 'hack' where id = a;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'SELHALO: B změnil rodinu A'; end if;
  update public.sezeni set stav = 'dokonceno' where id = v_sez;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'SELHALO: B změnil sezení A'; end if;
  update public.semafory set barva = 'cervena' where sezeni_id = v_sez;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'SELHALO: B změnil semafor A'; end if;
  raise notice 'OK: update cizích řádků ovlivní 0 řádků';

  begin
    insert into public.deti (rodina_id, krestni_jmeno, typ_skoly) values (a, 'Vetřelec', 'gymnazium');
    raise exception 'SELHALO: B vložil dítě do rodiny A';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.sezeni (dite_id, lekce_id, rezim) values (v_dite, 'TEST-PILOT', 'app');
    raise exception 'SELHALO: B založil sezení cizímu dítěti';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.odpovedi (sezeni_id, uloha_id, krok_id, spravne) values (v_sez, 'x', 'final', true);
    raise exception 'SELHALO: B vložil odpověď do sezení A';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.semafory (sezeni_id, uloha_id, volba_rodice, barva) values (v_sez, 'y', 'sam', 'zelena');
    raise exception 'SELHALO: B vložil semafor do sezení A';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.dotazniky (rodina_id, odpovedi) values (a, '{}');
    raise exception 'SELHALO: B vložil dotazník za rodinu A';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.rodiny (id, jmeno_rodice) values (gen_random_uuid(), 'x');
    raise exception 'SELHALO: klient vložil řádek do rodiny';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.lekce (id, faze, tyden, poradi, tema, kapitola, obsah, otevrit_od)
      values ('HACK', 'pilot', 1, 1, 'x', 'x', '{}', now());
    raise exception 'SELHALO: klient zapsal do lekce';
  exception when insufficient_privilege then null; end;
  begin
    update public.lekce set tema = 'hack' where id = 'TEST-PILOT';
    raise exception 'SELHALO: klient upravil lekci';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.admini (uid) values (b);
    raise exception 'SELHALO: B se sám přidal mezi adminy';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.deti where rodina_id = b;
    raise exception 'SELHALO: klient smí mazat děti';
  exception when insufficient_privilege then null; end;
  raise notice 'OK: zápisy do cizích/zakázaných tabulek selžou';

  -- chráněné sloupce vlastní rodiny
  begin
    update public.rodiny set stav = 'aktivni' where id = b;
    raise exception 'SELHALO: B si sám odemkl účet';
  exception when insufficient_privilege then null; end;
  begin
    update public.rodiny set dotaznik_vyplnen = true where id = b;
    raise exception 'SELHALO: B si sám nastavil dotaznik_vyplnen';
  exception when insufficient_privilege then null; end;
  begin
    update public.rodiny set poznamka_admin = 'x' where id = b;
    raise exception 'SELHALO: B změnil poznamka_admin';
  exception when insufficient_privilege then null; end;
  begin
    update public.rodiny set odemknuto_at = now() where id = b;
    raise exception 'SELHALO: B změnil odemknuto_at';
  exception when insufficient_privilege then null; end;
  update public.rodiny set jmeno_rodice = 'Rodič B upravený', telefon = '777000111' where id = b;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'SELHALO: B nemůže upravit své jméno/telefon'; end if;
  raise notice 'OK: chráněné sloupce rodiny klient nezmění; jméno a telefon ano';

  -- lekce dle stavu pilot
  select count(*) into n from public.lekce where id = 'TEST-PILOT';
  if n <> 1 then raise exception 'SELHALO: pilotní rodina nevidí veřejnou lekci'; end if;
  select count(*) into n from public.lekce where id in ('TEST-F1', 'TEST-F2');
  if n <> 0 then raise exception 'SELHALO: pilotní rodina vidí neveřejnou lekci'; end if;
  select count(*) into n from public.katalog_lekci() k where k.id = 'TEST-F1' and k.zamceno = 'platba';
  if n <> 1 then raise exception 'SELHALO: katalog neukazuje TEST-F1 jako zamčenou (platba)'; end if;
  raise notice 'OK: pilot vidí jen veřejné lekce; katalog vrací i zamčené s důvodem';

  -- max 2 děti + automatické poradi
  insert into public.deti (rodina_id, krestni_jmeno, typ_skoly) values (b, 'První', 'ss_maturita') returning id into v_dite_b;
  insert into public.deti (rodina_id, krestni_jmeno, typ_skoly) values (b, 'Druhé', 'gymnazium');
  select count(*) into n from public.deti where rodina_id = b and poradi in (1, 2);
  if n <> 2 then raise exception 'SELHALO: automatické poradi nefunguje'; end if;
  begin
    insert into public.deti (rodina_id, krestni_jmeno, typ_skoly) values (b, 'Třetí', 'gymnazium');
    raise exception 'SELHALO: rodina má 3. dítě';
  exception when raise_exception then
    if sqlerrm like 'SELHALO%' then raise; end if;
  end;
  raise notice 'OK: max 2 děti, poradi doplněno automaticky';

  -- sezení jen pro přístupnou lekci
  begin
    insert into public.sezeni (dite_id, lekce_id, rezim) values (v_dite_b, 'TEST-F1', 'app');
    raise exception 'SELHALO: pilotní rodina založila sezení zamčené lekce';
  exception when insufficient_privilege then null; end;
  insert into public.sezeni (dite_id, lekce_id, rezim) values (v_dite_b, 'TEST-PILOT', 'papir');
  raise notice 'OK: sezení jen pro přístupnou lekci';

  -- dotazník → nárok
  insert into public.dotazniky (rodina_id, odpovedi) values (b, '{"cena":"ano"}');
  if not (select dotaznik_vyplnen from public.rodiny where id = b) then
    raise exception 'SELHALO: dotazník nenastavil dotaznik_vyplnen';
  end if;
  raise notice 'OK: dotazník nastavil dotaznik_vyplnen = true';
end $$;

-- ---------------------------------------------------------------------
-- 2) Jako anon (nepřihlášený) — nic
-- ---------------------------------------------------------------------
reset role;
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

do $$
begin
  begin
    perform 1 from public.rodiny limit 1;
    raise exception 'SELHALO: anon čte rodiny';
  exception when insufficient_privilege then null; end;
  begin
    perform 1 from public.lekce limit 1;
    raise exception 'SELHALO: anon čte lekce';
  exception when insufficient_privilege then null; end;
  begin
    perform public.katalog_lekci();
    raise exception 'SELHALO: anon volá katalog_lekci';
  exception when insufficient_privilege then null; end;
  raise notice 'OK: anon nemá přístup k tabulkám ani funkcím';
end $$;

-- ---------------------------------------------------------------------
-- 3) A jako admin — vidí vše, smí odemknout
-- ---------------------------------------------------------------------
reset role;
insert into public.admini (uid) values ('00000000-0000-4000-a000-00000000000a');
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-a000-00000000000a","role":"authenticated"}';

do $$
declare
  b constant uuid := '00000000-0000-4000-a000-00000000000b';
  n integer;
begin
  if not public.je_admin() then raise exception 'SELHALO: A není admin'; end if;
  select count(*) into n from public.rodiny where id = b;
  if n <> 1 then raise exception 'SELHALO: admin nevidí rodinu B'; end if;
  select count(*) into n from public.lekce where id in ('TEST-F1', 'TEST-F2');
  if n <> 2 then raise exception 'SELHALO: admin nevidí všechny lekce'; end if;
  select count(*) into n from public.v_prehled_rodin where rodina_id = b;
  if n <> 1 then raise exception 'SELHALO: admin nevidí B ve v_prehled_rodin'; end if;

  update public.rodiny set stav = 'aktivni', poznamka_admin = 'zaplaceno' where id = b;
  if (select odemknuto_at from public.rodiny where id = b) is null then
    raise exception 'SELHALO: odemknuto_at se při odemčení nevyplnilo';
  end if;
  raise notice 'OK: admin vidí vše, odemkne rodinu, odemknuto_at se doplní';
end $$;

-- ---------------------------------------------------------------------
-- 4) B po odemčení: F1 (otevřená) vidí, F2 (budoucí) ne; po uzavření nic
-- ---------------------------------------------------------------------
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-a000-00000000000b","role":"authenticated"}';

do $$
declare n integer;
begin
  select count(*) into n from public.lekce where id = 'TEST-F1';
  if n <> 1 then raise exception 'SELHALO: aktivní rodina nevidí otevřenou lekci F1'; end if;
  select count(*) into n from public.lekce where id = 'TEST-F2';
  if n <> 0 then raise exception 'SELHALO: aktivní rodina vidí lekci před otevrit_od'; end if;
  select count(*) into n from public.katalog_lekci() k where k.id = 'TEST-F2' and k.zamceno = 'datum';
  if n <> 1 then raise exception 'SELHALO: katalog neukazuje TEST-F2 jako zamčenou (datum)'; end if;
  raise notice 'OK: aktivní rodina vidí otevřené lekce, budoucí ne';
end $$;

reset role;
update public.rodiny set stav = 'uzavreny' where id = '00000000-0000-4000-a000-00000000000b';
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-a000-00000000000b","role":"authenticated"}';

do $$
declare n integer;
begin
  select count(*) into n from public.lekce where id like 'TEST-%';
  if n <> 0 then raise exception 'SELHALO: uzavřená rodina čte lekce (%)', n; end if;
  select count(*) into n from public.rodiny;
  if n <> 1 then raise exception 'SELHALO: uzavřená rodina nevidí svůj řádek (stránka poděkování)'; end if;
  raise notice 'OK: uzavřená rodina nečte žádné lekce, svůj řádek vidí';
  raise notice 'VŠECHNY TESTY RLS PROŠLY';
end $$;

reset role;
rollback;
