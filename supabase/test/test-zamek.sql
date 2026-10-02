-- Test zámku Spolu 8 (supabase/migrations/0001–0005). Spouští supabase/test/over-migrace.sh jako superuživatel.
-- Pravidla (TECHNIKA-OSMA.md): lekce vidí každá přihlášená rodina od otevrit_od (verejna i dřív), žádná platba;
-- rodina 'uzavreny' nečte nic; sezení jen pro dítě, které má předmět lekce v deti.predmety; režim 'samo' povolený.
-- Rodiny: A = aktivni, dítě A1 jen matematika (metadata predmety), B = aktivni, dítě bez předmětů v metadatech
--         (výchozí oba), U = uzavreny.
\set ON_ERROR_STOP on
set client_min_messages = notice;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'a@test', '{"jmeno_rodice":"Rodič A","dite_jmeno":"A1","predmety":["matematika"]}'),
  ('00000000-0000-0000-0000-00000000000b', 'b@test', '{"jmeno_rodice":"Rodič B","dite_jmeno":"B1"}'),
  ('00000000-0000-0000-0000-00000000000c', 'u@test', '{"jmeno_rodice":"Rodič U","dite_jmeno":"U1"}');
update public.rodiny set stav = 'uzavreny' where id = '00000000-0000-0000-0000-00000000000c';

-- registrace: rodina aktivni, dítě bez typu školy a známky, předměty podle metadat / výchozí oba
do $$ begin
  if (select count(*) from public.rodiny where stav = 'aktivni') <> 2 then raise exception 'ZÁMEK: registrace nezaložila aktivní rodiny'; end if;
  if (select predmety from public.deti where krestni_jmeno = 'A1') <> '{matematika}' then raise exception 'ZÁMEK: predmety z metadat nesedí'; end if;
  if (select predmety from public.deti where krestni_jmeno = 'B1') <> '{matematika,cestina}' then raise exception 'ZÁMEK: výchozí predmety nesedí'; end if;
  if (select typ_skoly from public.deti where krestni_jmeno = 'B1') is not null then raise exception 'ZÁMEK: typ školy se nemá vyžadovat'; end if;
  raise notice 'ZÁMEK: registrace OK';
end $$;

insert into public.lekce (id, predmet, faze, tyden, poradi, tema, kapitola, obsah, verejna, otevrit_od) values
  ('M8-T01-L1',   'matematika', 'osma', 1, 1, 'M1',   'zlomky',       '{"cas_min": 20}', false, now() - interval '1 day'),
  ('M8-T02-L1',   'matematika', 'osma', 2, 1, 'M2',   'zlomky',       '{}', false, now() + interval '5 days'),
  ('M8-T00-DIAG', 'matematika', 'osma', 0, 1, 'Diag', 'diagnostika',  '{}', false, now() - interval '1 day'),
  ('cj-t1-l1',    'cestina',    'osma', 1, 1, 'CJ 1', 'slovni-druhy', '{}', false, now() - interval '1 day'),
  ('cj-t2-l5',    'cestina',    'osma', 2, 1, 'CJ 5', 'vzory',        '{}', true,  now() + interval '5 days');

-- konzistence id a předmětu, jen fáze osma
do $$ begin
  begin
    insert into public.lekce (id, predmet, faze, tyden, poradi, tema, kapitola, obsah, otevrit_od)
      values ('cj-t3-l9', 'matematika', 'osma', 3, 1, 'x', 'x', '{}', now());
    raise exception 'ZÁMEK: lekce cj-… s predmet matematika prošla';
  exception when check_violation then null; end;
  begin
    insert into public.lekce (id, predmet, faze, tyden, poradi, tema, kapitola, obsah, otevrit_od)
      values ('M8-T03-L1', 'matematika', 'faze1', 3, 1, 'x', 'x', '{}', now());
    raise exception 'ZÁMEK: fáze faze1 prošla';
  exception when check_violation then null; end;
  raise notice 'ZÁMEK: constraints lekce OK';
end $$;

create temp table vysledek (rodina text, lekce text, zamceno text, vidi_obsah boolean);
grant all on vysledek to authenticated;

do $$ declare r record; begin
  for r in select * from (values ('A','00000000-0000-0000-0000-00000000000a'),('B','00000000-0000-0000-0000-00000000000b'),('U','00000000-0000-0000-0000-00000000000c')) v(kod, uid) loop
    perform set_config('test.uid', r.uid, true);
    execute 'set local role authenticated';
    insert into vysledek
      select r.kod, k.id, k.zamceno, exists (select 1 from public.lekce l where l.id = k.id)
      from public.katalog_lekci() k;
    execute 'reset role';
  end loop;
end $$;

select * from vysledek order by rodina, lekce;

do $$
declare chyby text := '';
begin
  -- A i B: otevřené lekce obou předmětů (i bez češtiny u dítěte — zámek předmětu je až u sezení), budoucí = datum
  if exists (select 1 from vysledek where rodina in ('A','B') and lekce in ('M8-T01-L1','M8-T00-DIAG','cj-t1-l1','cj-t2-l5')
             and (zamceno is not null or not vidi_obsah)) then chyby := chyby || ' otevrene'; end if;
  if exists (select 1 from vysledek where rodina in ('A','B') and lekce = 'M8-T02-L1' and (zamceno is distinct from 'datum' or vidi_obsah)) then chyby := chyby || ' datum'; end if;
  if (select count(*) from vysledek where rodina = 'A') <> 5 then chyby := chyby || ' katalog'; end if;
  if (select k.pocet_uloh from public.katalog_lekci() k limit 1) is not null then null; end if;
  -- U: nic
  if exists (select 1 from vysledek where rodina = 'U' and (zamceno is distinct from 'uzavreno' or vidi_obsah)) then chyby := chyby || ' U'; end if;
  if chyby <> '' then raise exception 'ZÁMEK: nesedí%', chyby; end if;
  raise notice 'ZÁMEK: katalog a RLS OK';
end $$;

-- sezeni_insert: A1 (jen matematika) nesmí češtinu ani zamčenou lekci; B1 smí obě, i v režimu samo
do $$
declare a1 uuid; b1 uuid; ok boolean;
begin
  select id into a1 from public.deti where krestni_jmeno = 'A1';
  select id into b1 from public.deti where krestni_jmeno = 'B1';
  perform set_config('test.uid', '00000000-0000-0000-0000-00000000000a', true);
  execute 'set local role authenticated';
  insert into public.sezeni (dite_id, lekce_id, rezim) values (a1, 'M8-T01-L1', 'samo');
  begin
    insert into public.sezeni (dite_id, lekce_id) values (a1, 'cj-t1-l1');
    ok := false;
  exception when insufficient_privilege or check_violation then ok := true;
  end;
  if not ok then raise exception 'ZÁMEK: dítě bez češtiny založilo sezení češtiny'; end if;
  begin
    insert into public.sezeni (dite_id, lekce_id) values (a1, 'M8-T02-L1');
    ok := false;
  exception when insufficient_privilege or check_violation then ok := true;
  end;
  if not ok then raise exception 'ZÁMEK: sezení zamčené lekce prošlo'; end if;
  begin
    insert into public.sezeni (dite_id, lekce_id) values (b1, 'M8-T01-L1');
    ok := false;
  exception when insufficient_privilege or check_violation then ok := true;
  end;
  if not ok then raise exception 'ZÁMEK: sezení cizího dítěte prošlo'; end if;
  -- klient nezmění stav rodiny
  begin
    update public.rodiny set stav = 'uzavreny' where id = '00000000-0000-0000-0000-00000000000a';
    ok := false;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'ZÁMEK: klient změnil stav rodiny'; end if;
  execute 'reset role';

  perform set_config('test.uid', '00000000-0000-0000-0000-00000000000b', true);
  execute 'set local role authenticated';
  insert into public.sezeni (dite_id, lekce_id, rezim) values (b1, 'cj-t1-l1', 'samo');
  insert into public.sezeni (dite_id, lekce_id) values (b1, 'M8-T00-DIAG');
  execute 'reset role';
  raise notice 'ZÁMEK: sezeni_insert OK';
end $$;
