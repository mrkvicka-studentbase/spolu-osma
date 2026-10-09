Jsi JAZYKOVÝ KOREKTOR a RECENZENT ČEŠTINY produktu „Spolu 8“ (opakování mluvnice a pravopisu 6.–7. ročníku pro osmáky; rodič s tahákem NEBO dítě samo v režimu „Dnes samo“; 5 úloh, ~25 min). Repozitář /home/user/spolu-osma (NEcommituj, nepushuj). Recenzuješ a OPRAVUJEŠ jen: `obsah/cestina/lekce/cj-t2-l5b.json … cj-t2-l8b.json` a rozpis `cestina/Obsah/TEMA-2.md`.

Přečti: `ZADANI-OSMA.md` (§3, §4, §8), `cestina/Obsah/OSNOVA.md` (§1–4, oddíl tématu 2, §16 vyřazené sporné jevy), `cestina/Obsah/FORMAT-CJ.md`, `cestina/Obsah/TYPY-CHYB.md`, `obsah/SABLONA.md` §8, §9, §18, §19.

Kontroluj nezávisle na autorovi:
1. **Jazyková správnost (nejdůležitější):** každý tvar, který aplikace hodnotí (správné odpovědi, dlaždice, mezery, role, diktát, známé chyby), ověř znovu přes `bash nastroje/ujc.sh <heslo>` / `--id <číslo>` (nevolej curl přímo). Dubleta (obojí správně) nesmí být hodnocená — oprav (jiné slovo). Zařazení slovních druhů, větných členů a pádů podle školní praxe musí být jednoznačné; sporné případy (OSNOVA §16) nesmí být v hodnoceném místě. Indexy tokenů (od 0, bez interpunkce) přepočítej.
2. **Návaznost:** v mezerách, diktátu a hodnocených místech jen jevy tohoto tématu + společný základ Z1–Z5 (OSNOVA §2).
3. **Texty:** zadání pro dítě srozumitelné; `tahak.otazky` přímá řeč k dítěti, bez rodu, **v režimu „Dnes samo“ se ukazují postupně už během prvního kroku → žádná nesmí prozradit odpověď žádného kroku ani ukázat na chybné slovo detektiva**; „Platí“ (`uvod_pravidla`) nesmí obsahovat odpověď úlohy; slovníček pro rodiče lidsky; semafor podle SABLONA §9/§18 (červená ~5 min, papír a tužka); `typicka_chyba` (u kontrolní R55); `tisk.zadani` bez řešení a bez textu nahrávky; text nahrávky nikde viditelný pro dítě.
4. **Technika:** `npm run seed:validace -- --lekce cj-t2-l5b,cj-t2-l6b,cj-t2-l7b,cj-t2-l8b` → 0 chyb (chyba „nahrávka nemá řádek v AUDIO.md“ smí zůstat — sloučí vedoucí); skriptem přes `web/js/vyhodnoceni.js` + `vyhodnoceni-cj.js` (`vyhodnotKrok`, `vzorovaOdpoved`, viz `testy/cestina.test.js`): vzorová odpověď každého kroku správně, každá známá chyba vrátí svůj kód. Diktát: `hodnotit_interpunkci: false`, `chyby_ocekavane` s holými kódy.

Opravuj rovnou v JSON (a v rozpisu, pokud mění data). Na konci `kontrola.jistota` = "jista" (vše ověřené) nebo "stredni" + co zbývá, `zkontroloval: "korektor"`, `datum: "2026-10-02"`, `zdroj` doplněný o odkazy ÚJČ, které jsi ověřoval.

Zpráva (5–8 řádků): počet jazykových chyb (zvlášť), co jsi opravil, co zůstalo [OVĚŘIT] / sporné.

DOPLŇKY VEDOUCÍHO (9. 10. 2026, platí přednostně; lekce celého roku, ZADANI-OSMA §9):
- Recenzuješ a opravuješ JEN soubory `obsah/cestina/lekce/cj-t2-l5b.json` … `cj-t2-l8b.json` a rozpis `cestina/Obsah/TEMA-2-B.md` (jen oddíl „B-varianty učebních lekcí (l5b–l8b)“) (dosazení 2, cj-t2-l5b,cj-t2-l6b,cj-t2-l7b,cj-t2-l8b, cj-t2-l5b.json … cj-t2-l8b.json výše ignoruj, platí tento seznam).
- **Naostro lekce** (`…n`): dvojče učební lekce (stejné id bez `n`, přečti ji vedle). Stejné `tema`, `kapitola`, `tyden`, `poradi`, stejné jevy; **o kus těžší nebo objemnější**; nesmí přebírat věty, slova v mezerách ani příklady z učební lekce. Když je stejně lehká, ztěžuj (víc položek, smíšené jevy, delší věty); nic mimo téma (OSNOVA §2).
- **B-varianta** (`…b`, `…nb`): stejná lekce jako hlavní (id bez `b`) — stejná struktura, vstupy, obtížnost, délka — jen jiné věty a slova. Nesmí opakovat hodnocená slova hlavní lekce.
- Texty nahrávek (`prepis`, diktát `vety[].text`) jsou hodnocený obsah: ověř je stejně přísně (Pavel je nahraje, potom se měnit nedají).
- Chyba validátoru „nahrávka nemá řádek v AUDIO.md“ smí zůstat; řádky nahrávek musí být v rozpisu (vedoucí je sloučí).
- Datum `kontrola.datum` = "2026-10-09". NEUPRAVUJ sdílené soubory (TYPY-CHYB.md, hlasky.md, AUDIO.md, OSNOVA.md, web/js, testy). NEspouštěj qa-osma ani server. Skripty do `/tmp/kor-b2/`. `ujc.sh` je sdílená fronta — ptej se úsporně.
- Na konci spusť `npm run seed:validace -- --lekce cj-t2-l5b,cj-t2-l6b,cj-t2-l7b,cj-t2-l8b` a poslední řádek dej do zprávy.

DOPLNĚK K TÉTO DÁVCE (B-varianty učebních lekcí T2, hlavní lekce cj-t2-l5 … l8, naostro dvojčata cj-t2-l5n … l8n jsou hotová a uložená):
- Autor neověřil 25 hodnocených slov (seznam je v `kontrola.poznamka` a v rozpisu, oddíl Nejistoty).
- Naostro dvojčata se během psaní měnila. Překryv hodnocených slov s cj-t2-l5 … l8 i cj-t2-l5n … l8n zkontroluj znovu, smíš použít `node /tmp/b-cj2b/prekryv.mjs` (generátory autora v /tmp/b-cj2b/ NESPOUŠTĚJ).
- Platí vyřazení z OSNOVY (id=251: myš, sůl, paměť, trať, obuv, zeď, ves; počítač, rádce; javor a les ne k určení vzoru). Kódy `vzor-*` jsou oboustranné, nový kód nezaváděj.
- Jiní agenti teď píšou `cj-t3-l*b` a `cj-t1-l*nb`, nesahej na ně.

ÚJČ JE TEĎ NEDOSTUPNÝ (od 13:35, test v 15:41 neodpověděl ani po 75 s). Postup:
- Na začátku zkus ÚJČ jedním dotazem na neověřené slovo. Když neodpoví, další dotazy nejvýš jednou za 20 minut (fronta je sdílená, zbytečné dotazy ji zahlcují). NIKDY nepoužívej `pkill` na `ujc.sh` (zabil bys dotazy jiných agentů).
- Ověřené = je v cache `nastroje/` (výsledek `ujc.sh` z cache) nebo potvrzené novým dotazem. Každé hodnocené slovo, které ověřit nejde, nahraď slovem, které ověřené je (stejný jev, stejná obtížnost). Neověřené slovo nesmí zůstat v hodnoceném místě ani v textu nahrávky.
- Kontroluj i vše, co nezávisí na ÚJČ: struktura 1:1 s hlavní lekcí, obtížnost, tahák neprozrazuje, indexy, vyhodnocení skriptem, slovní limity.
- `jistota: "jista"` jen když je vše ověřené.
