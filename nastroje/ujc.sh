#!/usr/bin/env bash
# Dotaz do Internetové jazykové příručky ÚJČ (https://prirucka.ujc.cas.cz) — jen pro vývoj obsahu češtiny.
# Server odmítá souběžné dotazy: tento skript je řadí (flock) a mezi dotazy čeká 3 s. Výsledky si pamatuje
# v cache (výchozí /tmp/ujc-cache; odpověď „server je přetížen“ se neukládá, zkusí se znovu), takže opakovaný dotaz na stejné heslo server nezatíží.
# Použití: bash nastroje/ujc.sh <heslo>            → tabulka tvarů jako text (bez HTML)
#          bash nastroje/ujc.sh --id <číslo>       → výklad (např. --id 600)
#          bash nastroje/ujc.sh --html <heslo>     → surové HTML
set -euo pipefail
CACHE="${UJC_CACHE:-/tmp/ujc-cache}"; mkdir -p "$CACHE"
html=0; if [ "${1:-}" = "--html" ]; then html=1; shift; fi
if [ "${1:-}" = "--id" ]; then dotaz="id=$2"; klic="id-$2"; else dotaz="slovo=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$1")"; klic="s-$1"; fi
soubor="$CACHE/$(printf '%s' "$klic" | md5sum | cut -c1-16).html"
if [ ! -s "$soubor" ]; then
  exec 9>"$CACHE/.zamek"
  flock 9
  if [ ! -s "$soubor" ]; then
    for pokus in 1 2 3; do
      if curl -sS --max-time 40 "https://prirucka.ujc.cas.cz/?$dotaz" -o "$soubor.tmp" && [ -s "$soubor.tmp" ] && ! grep -q "je ještě vyhodnocován" "$soubor.tmp"; then mv "$soubor.tmp" "$soubor"; break; fi
      sleep $((pokus * 5))
    done
    sleep 3
  fi
  flock -u 9
fi
[ -s "$soubor" ] || { echo "ÚJČ neodpověděl (heslo/id: ${2:-$1}) — označ [OVĚŘIT]" >&2; exit 2; }
if [ $html = 1 ]; then cat "$soubor"; else
  python3 - "$soubor" <<'PY'
import sys,re,html
t=open(sys.argv[1],encoding='utf-8',errors='replace').read()
t=re.sub(r'(?s)<(script|style).*?</\1>','',t)
t=re.sub(r'</(tr|p|div|h\d|li|table)>','\n',t); t=re.sub(r'</t[dh]>',' | ',t)
t=html.unescape(re.sub(r'<[^>]+>','',t))
lines=[re.sub(r'[ \t]+',' ',l).strip() for l in t.split('\n')]
print('\n'.join(l for l in lines if l)[:6000])
PY
fi
