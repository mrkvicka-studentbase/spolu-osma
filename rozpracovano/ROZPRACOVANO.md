# Rozpracováno 12. 10. 2026 večer (vedoucí projektu)

Nahrazuje `rozpracovano-2026-10-09` (vše odtamtud je už zkontrolované a na `main`).
Tahle větev drží **neschválenou** práci. Na `main` patří až po recenzi/korektuře s validací 0 chyb.

**Obnova:** na `main` spusť `git checkout rozpracovano-2026-10-12 -- obsah/` a pak `git reset -q` (soubory zůstanou necommitnuté). Zadání agentů jsou v `rozpracovano/zadani/` (zkopíruj do scratchpadu), skripty autorů v `rozpracovano/skripty/` (patří do `/tmp/<název>/`).

| Dávka | Soubory | Stav | Další krok |
|---|---|---|---|
| M T05 B-varianty naostro | `M8-T05-L1NB` … `L4NB` | autor hotovo (jistota stredni, validace 0 chyb, 154 kontrol) | recenze — `rec-m-nb05.md` (přerušená na začátku, začít znovu) |
| ČJ T3 B-varianty naostro | `cj-t3-l9nb` … `l12nb` | autor přerušen uprostřed; soubory mohou být neúplné, rozpis do `TEMA-3-B.md` ještě nezapsán | autor znovu — `b-cj-t3nb.md` + „zkontroluj stav, generátory jsou v /tmp/b-cj3nb“; pak korektura (`korektor-cj8-rok.md`) |
| ČJ T2 B-varianty naostro | žádné soubory | autor přerušen na začátku | autor znovu od začátku — `b-cj-t2nb.md`; pak korektura |
| M T06 naostro | žádné soubory | autor přerušen na začátku | autor znovu — `n-m-t06.md`; pak recenze |

**Postup u každé dávky** (osvědčený):
1. autor (max 4 agenti najednou);
2. recenze (M, `recenzent-m8-rok.md`) nebo korektura ÚJČ (ČJ, `korektor-cj8-rok.md`) s doplňkem k dávce;
3. ČJ: `python3 rozpracovano/zadani/audio_doplnit.py cj-tX-l` (zkontroluj, že přidal jen řádky schválených lekcí);
4. validace `node supabase/seed/seed-lekce.mjs --jen-validace [--adresar obsah/cestina/lekce] --lekce …` = 0 chyb, `node --test`;
5. commit lekcí;
6. seznam nahrávek **jen ze stavu commitu**: `git worktree add` HEAD → `node nastroje/seznam-nahravek.mjs` → zkopírovat .md a .csv → commit.

**Rozhodnutí vedoucího platná dál:** B-varianta smí opakovat jen uzavřené skupiny (*kéž/ať, několik, večer, a*; nepravidelné stupňování *dobrý, malý, velký, dlouhý*, aspoň polovina položek; tvary *Adamovi/Adamovy/Tomášovi/Tomášovy*); mezery po tvrdé souhlásce (Z5) nesmí nahradit jev tématu; ÚJČ dotaz při výpadku max 1× za 20 min, nikdy `pkill` na `ujc.sh`; seznam nahrávek jen z commitnutého stavu.

**Co zbývá celkem** (po těchto dávkách):
- Matematika: T06 B a NB; T07–T10 naostro, B, NB (48 lekcí).
- Čeština: T4–T10 naostro, B, NB (84 lekcí).
- Pololetní testy `M8-T00-POL`, `cj-t0-pol`.
- QA v prohlížeči nových lekcí, STAV.md a SPUSTENI.md (počty lekcí v B7).
- Potom úkol 2: odznaky, karty, taháky a výzvy (`predani/2026-10-09-odznaky-a-tahaky/README.md`).
