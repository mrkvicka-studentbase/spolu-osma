-- =====================================================================
-- 0006_rezim_samo.sql — režim lekce „Dnes samo“ (R64, Pavel 30. 9.)
-- Lekce bez rodiče: dítě pracuje v aplikaci, roli rodiče (nápovědy, semafor, ukončení lekce)
-- převezme aplikace. Semafor se ukládá do stejné tabulky `semafory` (volba_rodice odvozená z průběhu).
-- Mění se jen povolené hodnoty sezeni.rezim; nová tabulka ani sloupec nevzniká, RLS beze změny.
-- Idempotentní (lze spustit znovu).
-- =====================================================================

alter table public.sezeni drop constraint if exists sezeni_rezim_check;
alter table public.sezeni add constraint sezeni_rezim_check check (rezim in ('app', 'papir', 'samo'));

comment on column public.sezeni.rezim is 'app = v aplikaci s rodičem, papir = na papír s rodičem, samo = v aplikaci bez rodiče (R64)';
