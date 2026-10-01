-- =====================================================================
-- 0005_admin.sql — přidání admina (Pavel)
-- Tabulka public.admini je založená už v 0001 (potřebuje ji je_admin() v 0002).
--
-- POSTUP (jednou, ručně v Supabase → SQL Editor):
--   1. Zaregistrujte se na webu běžně jako rodič (nebo založte uživatele v
--      Supabase → Authentication → Users → Add user).
--   2. Zjistěte své uid: Supabase → Authentication → Users → klikněte na svůj
--      e-mail → pole „User UID" (tvar 1a2b3c4d-....).
--   3. Odkomentujte JEDNU z variant níže, doplňte hodnotu a spusťte.
--   4. Ověření: select * from public.admini;  (musí vrátit 1 řádek)
-- =====================================================================

-- Varianta A — podle uid:
-- insert into public.admini (uid) values ('<PAVLOVO-UID>') on conflict (uid) do nothing;

-- Varianta B — podle e-mailu (nemusíte hledat uid):
-- insert into public.admini (uid)
--   select id from auth.users where lower(email) = lower('<PAVLUV-EMAIL>')
--   on conflict (uid) do nothing;

-- Odebrání admina:
-- delete from public.admini where uid = '<UID>';
