# Rozpracovaná čeština Spolu 8 — témata 3–10

Stav 2. 10. 2026: autoři (metodik + autor) napsali lekce témat 3–10 a většinu rozpisů. Práci jsem zastavil, aby se
prioritně dokončily témata 1–2 (Pavel: docházejí limity). Lekce byly v závěrečné kontrole autora, **neprošly
korekturou ÚJČ ani recenzí** a nemusí projít validátorem. Aplikace je nenačítá (nejsou v `obsah/cestina/lekce/`).

Dokončení (téma po tématu):
1. Přesunout `lekce/cj-t<T>-l*.json` zpět do `obsah/cestina/lekce/` a `TEMA-<T>.md` do `cestina/Obsah/`.
2. `npm run seed:validace -- --lekce cj-t<T>-l…` → opravit chyby (autor).
3. Korektor (zadání ve scratchpadu vedoucího: `korektor-cj8.md`) → `jistota: "jista"`.
4. Nahrávky z rozpisu do `cestina/Obsah/AUDIO.md`, QA `node nastroje/qa-osma.mjs --lekce=…`.

Téma 3 nemá rozpis `TEMA-3.md` (autor ho nestihl uložit), lekce ano.
