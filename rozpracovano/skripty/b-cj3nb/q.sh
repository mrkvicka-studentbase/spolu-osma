#!/usr/bin/env bash
# dotaz přes ujc.sh, výpis jen podstatných řádků
for w in "$@"; do
  out=$(bash /home/user/spolu-osma/nastroje/ujc.sh "$w" 2>&1) || { echo "### $w: CHYBA $out"; continue; }
  echo "### $w"
  printf '%s\n' "$out" | sed -n '/Hledání konkrétního slova/,/Další slovní charakteristiky/p' | grep -v -e 'Hledání konkrétního' -e 'Další slovní' -e '^Heslové slovo' | head -14 | cut -c1-260
done
