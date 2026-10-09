Jsi AUTOR ÚLOH MATEMATIKY produktu „Spolu 8“ (opakování 6.–7. ročníku pro osmáky; rodič s tahákem NEBO dítě samo v režimu „Dnes samo“, kde aplikace ukazuje otázky z taháku jako nápovědy; 20 min, 4 úlohy). Repozitář /home/user/spolu-osma (NEcommituj, nepushuj). Zapisuj JEN své 4 soubory: `obsah/lekce/M8-T{TT}-L1N.json` … `M8-T{TT}-L4N.json`. Jiné soubory neměň (nálezy ve validátoru/webu napiš do zprávy).

ÚKOL: napiš 4 **NAOSTRO lekce** tématu T{TT}: ke každé hotové učební lekci `M8-T{TT}-L<n>.json` její dvojče `M8-T{TT}-L<n>N.json`.

CO JE NAOSTRO (ZADANI-OSMA §9, PLAN-ROZSIRENI.md §3): dítě učební lekci dělalo před 2–3 dny; teď „ukaž, že to opravdu umíš“.
- Stejné téma, stejné dovednosti a stejné typy úloh/vstupů jako učební lekce (rozcvicka, detektiv, cermat = hlavní úloha, semafor; `cas_min: 20`), ale **o kus těžší nebo objemnější**: víc položek v rozcvičce, smíšené úlohy z celé lekce (ne jen jeden typ), u hlavní úlohy delší nebo slovní úloha o krok navíc, detektiv s nenápadnější chybou. Číselná náročnost zůstává v rámci tématu (žádná nová látka 8. ročníku, ZADANI §4, §7).
- **Žádná čísla, kontext ani věty z učební lekce** — všechno nové. Stejný druh chyb (`zname_chyby` z `obsah/typy-chyb.md`) je vítaný: přesně to má dítě ukázat, že už nedělá.
- Méně opory: `uvod_pravidla` stručněji (připomenutí, ne výklad), `uvod_pro_rodice` řekne, že jde o naostro („Dítě tuhle látku dělalo v lekci X. Dnes ukáže, že to zvládne samo…“). Tahák ale plný (otázky, řešení, typická chyba, semafor) jako u učební lekce.
- Hlavička: `id` `M8-T{TT}-L<n>N`, `tema` **stejné jako u učební lekce**, `kapitola` stejná, `tyden` = {T}, `poradi` = n (stejné jako učební), `faze: "osma"`, `varianta: "z8"`, `cas_min: 20`. L4N je naostro kontroly tématu (mix celého tématu).
- Úlohy mají id `M8-T{TT}-L<n>N-U1` … `-U4`.

Přečti nejdřív: `ZADANI-OSMA.md` (§3, §4, §7, §9), `PLAN-ROZSIRENI.md`, `obsah/OSNOVA-MATEMATIKA.md` (§1, §2, oddíl tématu {T}), `kostra/03-format-obsahu.md`, `obsah/SABLONA.md` (§5.3, §18, §20 pro Spolu 8 NEPLATÍ), `obsah/typy-chyb.md`, `obsah/semafor-klic.md` a **všechny 4 učební lekce tématu** `obsah/lekce/M8-T{TT}-L1.json` … `L4.json` (jsou zrecenzované — drž jejich styl, úplnost polí a úroveň textů).

Pravidla (stejná jako u učebních lekcí):
- Každé číslo a každou známou chybu ověř skriptem (python/node): správná odpověď vyjde, známá chyba opravdu vznikne popsaným omylem a liší se od správné. Výsledky „hezké“.
- `tahak.otazky`: přímá řeč k dítěti v „…“, bez rodu; v režimu „Dnes samo“ se ukazují postupně už během prvního kroku → **žádná nesmí prozradit výsledek žádného kroku ani ukázat na Petrovo chybné místo**. Popisky kroků neutrální. „Platí“ (`uvod_pravidla`) nesmí obsahovat odpověď žádné úlohy.
- Svět 13–14letých, česká jména (Tomáš, Lucka, Honzík, Klára, Adam, Ema; Petr jen detektiv). Slovo CERMAT ani přijímačky nikde. Zlomky `$\frac{a}{b}$`, desetinná čárka `{,}` v LaTeXu.
- `kontrola`: `jistota: "stredni"`, `zkontroloval: "autor"`, `datum: "2026-10-09"`, `poznamka` = co je sporné.

KONTROLA (opakuj, dokud neprojde): `npm run seed:validace -- --lekce M8-T{TT}-L1N,M8-T{TT}-L2N,M8-T{TT}-L3N,M8-T{TT}-L4N` → 0 chyb; skriptem přes `web/js/vyhodnoceni.js` (`vyhodnotKrok`, viz `testy/vyhodnoceni.test.js`): správná odpověď každého kroku `spravne: true`, každá `zname_chyby` vrátí svůj `typ_chyby`. Skripty dávej do `/tmp/naostro-m{TT}/`. NEspouštěj `nastroje/qa-osma.mjs` ani server (běží souběžně jiní autoři).

Výsledná zpráva česky (5–8 řádků): soubory, validace a kontrola vyhodnocení, v čem je každá naostro lekce těžší než učební, sporná místa pro recenzenta.
