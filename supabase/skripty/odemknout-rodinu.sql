-- =====================================================================
-- odemknout-rodinu.sql — ruční změna stavu rodiny (Spolu 8)
-- Použití: Supabase → SQL Editor → nahraďte e-mail → Run.
-- Spolu 8 v1 nemá platbu: každá rodina je po registraci 'aktivni'. Tento skript vrací
-- uzavřenou rodinu zpět do 'aktivni' (nebo jednu rodinu uzavře: stav 'uzavreny').
-- =====================================================================

update public.rodiny
set stav = 'aktivni'
where lower(email) = lower('rodic@example.cz')      -- ← SEM e-mail rodiny z registrace
returning id, email, jmeno_rodice, stav, odemknuto_at;

-- Pokud se nevrátil žádný řádek, e-mail nesedí. Hledání podle části e-mailu:
-- select id, email, jmeno_rodice, stav from public.rodiny where email ilike '%novak%';

-- Uzavření jedné rodiny: stejný postup se stav = 'uzavreny'.
-- Poznámka k rodině:
-- update public.rodiny set poznamka_admin = '…' where lower(email) = lower('rodic@example.cz');
