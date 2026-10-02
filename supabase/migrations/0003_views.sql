-- =====================================================================
-- 0003_views.sql — pohledy pro admin (kostra/02) + katalog lekcí pro klienta
-- Všechny pohledy: security_invoker = true → platí RLS podkladových tabulek.
-- Admin (je_admin) vidí vše; běžná rodina by viděla jen svá data.
-- =====================================================================

-- ---------------------------------------------------------------------
-- v_prehled_rodin — rodina, děti, stav, poslední aktivita, dokončené lekce,
-- aktuální téma (max tyden dokončené lekce), červené za 7 dní
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
  r.poznamka_admin,
  r.odemknuto_at,
  r.created_at                           as registrace_at,
  coalesce(d.deti, '[]'::jsonb)          as deti,          -- [{id, krestni_jmeno, predmety, poradi}]
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
      'id', x.id, 'krestni_jmeno', x.krestni_jmeno, 'predmety', x.predmety,
      'poradi', x.poradi) order by x.poradi) as deti,
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
  l.predmet,
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
  (l.predmet, l.kapitola, sm.barva),
  (l.predmet, l.kapitola, sm.barva, se.dite_id, d.krestni_jmeno)
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
  l.predmet,
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
-- a v KAŽDÉ z nich aspoň jednu červenou. Jen pro přehled admina.
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
-- RLS zamčené lekce z tabulky nevrátí; přehled ale ukazuje i zamčené karty („Otevře se …“).
-- Obsah (jsonb) se nevrací; pocet_uloh = počet úloh v obsahu (matematika 4, čeština 5, diagnostika 20–25).
-- zamceno: null = přístupná | 'datum' | 'uzavreno' (viz duvod_zamceni v 0002)
-- ---------------------------------------------------------------------
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
  pocet_uloh  integer,
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
    case when jsonb_typeof(l.obsah -> 'ulohy') = 'array' then jsonb_array_length(l.obsah -> 'ulohy') end,
    l.otevrit_od, l.verejna, l.verze,
    public.duvod_zamceni(l.verejna, l.otevrit_od)
  from public.lekce l
  where (select auth.uid()) is not null
  order by l.predmet, l.tyden, l.poradi, l.id;
$$;

revoke execute on function public.katalog_lekci() from public, anon;
grant  execute on function public.katalog_lekci() to authenticated, service_role;
