-- =====================================================================
-- odemknout-rodinu.sql — ruční záloha k tlačítku „Odemknout" v admin.html
-- Použití: Supabase → SQL Editor → nahraďte e-mail → Run.
-- stav 'aktivni' = přístup k Fázi 1/2 (od data otevření lekcí).
-- odemknuto_at se doplní automaticky (trigger rodiny_ochrana), pokud ho neuvedete.
-- =====================================================================

update public.rodiny
set stav = 'aktivni'
where lower(email) = lower('rodic@example.cz')      -- ← SEM e-mail rodiny z registrace
returning id, email, jmeno_rodice, stav, odemknuto_at;

-- Pokud se nevrátil žádný řádek, e-mail nesedí. Hledání podle části e-mailu:
-- select id, email, jmeno_rodice, stav from public.rodiny where email ilike '%novak%';

-- Jiné stavy (stejný postup): 'pilot' = vrátit do pilotu, 'uzavreny' = uzavřít účet.
-- Poznámka k rodině:
-- update public.rodiny set poznamka_admin = 'zaplaceno 12. 10., Revolut' where lower(email) = lower('rodic@example.cz');
