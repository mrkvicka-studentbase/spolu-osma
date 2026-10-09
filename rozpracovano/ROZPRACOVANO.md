# Rozpracováno 9. 10. 2026 večer (vedoucí projektu)

Tahle větev drží **neschválenou** práci, aby se neztratila. Na `main` nepatří, dokud neprojde recenzí/korekturou s validací 0 chyb.
Obnova zítra: `git checkout rozpracovano-2026-10-09 -- obsah/ cestina/Obsah/TEMA-1-B.md cestina/Obsah/TEMA-2-B.md cestina/Obsah/TEMA-3-B.md` na `main` (soubory zůstanou necommitnuté), zadání agentů jsou v `rozpracovano/zadani/`.

| Dávka | Soubory | Stav | Další krok (zadání) |
|---|---|---|---|
| M T05 B-varianty učebních | `M8-T05-L1B` … `L4B` | autor hotovo (jistota stredni) | recenze — `rec-m-b05.md` (přerušená na začátku) |
| ČJ T2 B učebních | `cj-t2-l5b` … `l8b`, `TEMA-2-B.md` | autor hotovo, 25 slov neověřeno; korektura přerušená v půlce (část oprav zapsaná) | korektura znovu od začátku — `kor-cj-t2b.md` |
| ČJ T1 B naostro | `cj-t1-l1nb` … `l4nb`, oddíl v `TEMA-1-B.md` | autor hotovo jen ze slov v cache (jistota stredni); korektura přerušená | korektura — `kor-cj-t1nb.md` |
| ČJ T3 B učebních | `cj-t3-l9b` … `l12b`, `TEMA-3-B.md` | autor hotovo ze slov v cache; korektura přerušená | korektura — `kor-cj-t3b.md` (obsahuje rozhodnutí o nepravidelném stupňování) |

Po korektuře češtiny: `python3 rozpracovano/zadani/audio_doplnit.py cj-tX-l` (sloučí řádky nahrávek do AUDIO.md; smaž řádky lekcí, které ještě korekturou neprošly), `node nastroje/seznam-nahravek.mjs`, validace 0 chyb, commit.

ÚJČ (příručka) byl od 13:35 nedostupný. Korektury mají pokyn: neověřitelné slovo nahradit ověřeným z cache, dotaz nejvýš 1× za 20 min, nikdy `pkill` na `ujc.sh`.

**Co ještě zbývá celkem** (po těchto dávkách):
- Matematika: T05 NB; T06–T10 naostro, B, NB (60 lekcí).
- Čeština: T2 NB, T3 NB; T4–T10 naostro, B, NB (84 lekcí).
- Pololetní testy `M8-T00-POL`, `cj-t0-pol`.
- QA v prohlížeči nových lekcí, přegenerovat seznam nahrávek, STAV.md a SPUSTENI.md.
