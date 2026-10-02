#!/usr/bin/env bash
# Lokální ověření migrací Spolu 8 (supabase/migrations/0001–0005) na čisté DB → druhý běh (idempotence)
# → test zámku (supabase/test/test-zamek.sql) → totéž přes nástroj Pavla (npm run migrovat).
# Jen dočasný PostgreSQL 16 na tomto počítači; do Supabase nic nejde.
# Použití (z kořene repa): bash supabase/test/over-migrace.sh
set -euo pipefail
KOREN="$(cd "$(dirname "$0")/../.." && pwd)"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
TMP="$(mktemp -d)"; chmod 777 "$TMP"
PORT="${PORT:-55433}"
jako_pg() { if [ "$(id -u)" = 0 ]; then su postgres -s /bin/bash -c "$*"; else bash -c "$*"; fi; }
uklid() { jako_pg "'$PGBIN/pg_ctl' -D '$TMP/data' -m immediate stop" >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap uklid EXIT
jako_pg "'$PGBIN/initdb' -D '$TMP/data' -U postgres -A trust >/dev/null"
# SSL kvůli supabase/skripty/env.mjs (pg se připojuje vždy s ssl, jako k pooleru Supabase)
openssl req -new -x509 -days 1 -nodes -subj /CN=localhost -keyout "$TMP/server.key" -out "$TMP/server.crt" >/dev/null 2>&1
chmod 600 "$TMP/server.key"; [ "$(id -u)" = 0 ] && chown postgres "$TMP/server.key" "$TMP/server.crt"
jako_pg "'$PGBIN/pg_ctl' -D '$TMP/data' -o '-p $PORT -k $TMP -c listen_addresses=127.0.0.1 -c ssl=on -c ssl_cert_file=$TMP/server.crt -c ssl_key_file=$TMP/server.key' -l '$TMP/log' start >/dev/null"
psql() { jako_pg "PGOPTIONS='-c client_min_messages=warning' '$PGBIN/psql' -h '$TMP' -p $PORT -U postgres -d postgres -v ON_ERROR_STOP=1 -q $*"; }
spust() { echo "→ $(basename "$1")"; cp "$1" "$TMP/m.sql"; chmod 644 "$TMP/m.sql"; psql -f "$TMP/m.sql" >/dev/null; }

spust "$KOREN/supabase/test/stuby-supabase.sql"
for m in "$KOREN"/supabase/migrations/0*.sql; do spust "$m"; done
echo "→ druhý běh (idempotence)"
for m in "$KOREN"/supabase/migrations/0*.sql; do spust "$m"; done
echo "→ test zámku"; cp "$KOREN/supabase/test/test-zamek.sql" "$TMP/t.sql"; chmod 644 "$TMP/t.sql"
psql -f "$TMP/t.sql" > "$TMP/t.log" 2>&1 || true
sed -e 's/^psql:[^ ]* //' "$TMP/t.log"
grep -q "ZÁMEK: sezeni_insert OK" "$TMP/t.log" || { echo "✘ test zámku selhal"; exit 1; }
echo "✔ migrace 0001–0005 + zámek v pořádku"

# vse-v-jednom.sql (Supabase SQL Editor) musí jít na čistou DB taky
echo "→ vse-v-jednom.sql na čisté DB"
echo "create database jednou;" > "$TMP/d.sql"; chmod 644 "$TMP/d.sql"; psql -f "$TMP/d.sql"
psqlj() { jako_pg "PGOPTIONS='-c client_min_messages=warning' '$PGBIN/psql' -h '$TMP' -p $PORT -U postgres -d jednou -v ON_ERROR_STOP=1 -q $*"; }
cp "$KOREN/supabase/test/stuby-supabase.sql" "$TMP/s.sql"; cp "$KOREN/supabase/vse-v-jednom.sql" "$TMP/v.sql"; chmod 644 "$TMP/s.sql" "$TMP/v.sql"
psqlj -f "$TMP/s.sql" >/dev/null; psqlj -f "$TMP/v.sql" >/dev/null
# seed Spolu 8 posílá varianta z8 (zastaralý vse-v-jednom.sql ji odmítal)
echo "insert into public.lekce (id, predmet, faze, tyden, poradi, tema, kapitola, varianta, obsah, otevrit_od) values ('M8-T01-L1', 'matematika', 'osma', 1, 1, 't', 'k', 'z8', '{}', now()); delete from public.lekce;" > "$TMP/z8.sql"; chmod 644 "$TMP/z8.sql"
psqlj -f "$TMP/z8.sql" >/dev/null
psqlj -f "$TMP/t.sql" > "$TMP/t1.log" 2>&1 || true
grep -q "ZÁMEK: sezeni_insert OK" "$TMP/t1.log" || { echo "✘ test zámku po vse-v-jednom.sql selhal"; tail -5 "$TMP/t1.log"; exit 1; }
echo "✔ vse-v-jednom.sql v pořádku (lekce z8 + zámek)"

# Čistá DB → přesně nástroj Pavla (npm run migrovat = supabase/skripty/migrovat.mjs, transakce + _migrace)
echo "→ npm run migrovat na čisté DB"
echo "create database migrovat;" > "$TMP/d.sql"; chmod 644 "$TMP/d.sql"; psql -f "$TMP/d.sql"
psql2() { jako_pg "PGOPTIONS='-c client_min_messages=warning' '$PGBIN/psql' -h '$TMP' -p $PORT -U postgres -d migrovat -v ON_ERROR_STOP=1 -q $*"; }
psql2 -f "$TMP/s.sql" >/dev/null
( cd "$KOREN" && SUPABASE_DB_URL="postgresql://postgres@127.0.0.1:$PORT/migrovat" node supabase/skripty/migrovat.mjs )
( cd "$KOREN" && SUPABASE_DB_URL="postgresql://postgres@127.0.0.1:$PORT/migrovat" node supabase/skripty/migrovat.mjs ) | tail -1
psql2 -f "$TMP/t.sql" > "$TMP/t2.log" 2>&1 || true
grep "ZÁMEK" "$TMP/t2.log" | sed -e 's/^psql:[^ ]* //'
grep -q "ZÁMEK: sezeni_insert OK" "$TMP/t2.log" || { echo "✘ test zámku po migrovat selhal"; tail -5 "$TMP/t2.log"; exit 1; }
echo "✔ npm run migrovat (0001–0005) + zámek v pořádku"
