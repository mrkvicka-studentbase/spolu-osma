-- =====================================================================
-- uzavrit-sezonu.sql — konec sezóny (spustit 1. 5. 2027 v Supabase → SQL Editor)
-- Všechny rodiny → stav 'uzavreny'. Přihlášení dál funguje, obsah lekcí RLS
-- nevrátí (ani pilot) a web ukáže stránku s poděkováním (kostra 01, 04 bod 11).
-- Rozpracovaná sezení se označí jako přerušená. Data zůstávají (statistiky).
-- Vrácení jedné rodiny: viz odemknout-rodinu.sql.
-- =====================================================================

begin;

update public.rodiny
set stav = 'uzavreny'
where stav <> 'uzavreny';

update public.sezeni
set stav = 'preruseno'          -- konec doplní trigger sezeni_pred_ulozenim
where stav = 'probiha';

commit;

-- Kontrola: všechny řádky musí být 'uzavreny'
select stav, count(*) as pocet from public.rodiny group by stav order by stav;
