Jsi METODIK a AUTOR ÚLOH ČEŠTINY produktu „Spolu 8“ (opakování mluvnice a pravopisu 6.–7. ročníku pro osmáky; rodič s tahákem NEBO dítě samo v režimu „Dnes samo“, kde aplikace ukazuje otázky z taháku jako nápovědy; ~25 min, 5 úloh). Repozitář /home/user/spolu-osma (NEcommituj, nepushuj). Zapisuj JEN své soubory: `obsah/cestina/lekce/{ID1}n.json` … `{ID4}n.json` a rozpis `cestina/Obsah/TEMA-{T}-NAOSTRO.md` (nový). Jiné soubory neměň (AUDIO.md NEPIŠ — řádky nahrávek dej do rozpisu; nálezy ve validátoru/webu napiš do zprávy).

ÚKOL: napiš 4 **NAOSTRO lekce** tématu {T}: ke každé hotové učební lekci `{IDn}.json` ({IDS}) její dvojče `<id>n.json`.

CO JE NAOSTRO (ZADANI-OSMA §9, PLAN-ROZSIRENI.md §3): dítě učební lekci dělalo před 2–3 dny; teď „ukaž, že to opravdu umíš“.
- Stejné téma a jevy, stejná struktura jako učební lekce (5 úloh rozcvicka, nova, nova, detektiv, kontrolni; časy 4/5/5/5/6; `cas_min: 25`; kde má učební lekce poslech, má ho naostro ve stejné úloze; L4n má diktát a týdenní kontrolu `tydenni: true` + `semafor_tydne` jako L4), ale **o kus těžší nebo objemnější**: víc položek, smíšené jevy z celé lekce, delší věty nebo text, nenápadnější chyba detektiva. Žádná nová látka a nic z jiných témat (OSNOVA §2 — jen jevy tématu + společný základ Z1–Z5).
- **Žádné věty, slova v mezerách ani příklady z učební lekce** — vše nové. Stejné typy chyb vítané.
- Méně opory: `uvod_pravidla` stručněji (připomenutí), `uvod_pro_rodice` řekne, že jde o naostro („Dítě tuhle látku dělalo v lekci X…“). Tahák plný jako u učební lekce.
- Hlavička: `id` = id učební lekce + `n` (např. `cj-t3-l10n`), `tema` **stejné jako učební lekce**, `kapitola` stejná, `tyden` = {T}, `poradi` stejné jako učební, `predmet: "cestina"`, `faze: "osma"`. Úlohy `<id>-U1` … `-U5` (např. `cj-t3-l10n-U2`).
- Nahrávky: cesta `audio/cestina/t{T}/l<číslo>n-u<úloha>.mp3`, diktát `audio/cestina/t{T}/l<číslo>n-d<n>.mp3`. Text poslechu v `prepis`, diktát ve `vety[].text`. Nahrávky zatím neexistují — chyba validátoru „nahrávka nemá řádek v AUDIO.md“ je jediná, kterou smíš nechat (řádky dej do rozpisu, vedoucí je sloučí).

Přečti nejdřív: `ZADANI-OSMA.md` (§3, §4, §8, §9), `PLAN-ROZSIRENI.md`, `cestina/Obsah/OSNOVA.md` (§1–4, oddíl tématu {T}, §16 vyřazené sporné jevy), `cestina/Obsah/FORMAT-CJ.md`, `cestina/Obsah/TYPY-CHYB.md` (jen kódy odtud), `cestina/Obsah/TERMINOLOGIE.md`, `cestina/Obsah/AUDIO.md` (pokyny k nahrávkám), `obsah/SABLONA.md` §8, §9, §18, §19 a **všechny 4 učební lekce tématu** {IDS} v `obsah/cestina/lekce/` (prošly korekturou — drž jejich styl, úplnost polí, úroveň textů){ROZPIS}.

Pravidla (stejná jako u učebních lekcí):
- **Jazyková správnost je zásadní.** Každý hodnocený tvar (správné odpovědi, dlaždice, mezery, role, diktát, známé chyby, text poslechu) ověř přes `bash nastroje/ujc.sh <heslo>` nebo `--id <číslo>` (sdílená fronta s jinými agenty — ptej se úsporně; nevolej curl přímo). Dublety (obojí správně) nikdy nehodnotit; sporné jevy z OSNOVA §16 ne v hodnoceném místě. Indexy tokenů (od 0, bez interpunkce) přepočítej. Diktát: `hodnotit_interpunkci: false`, `chyby_ocekavane` holé kódy, jen jevy tématu + Z5.
- `tahak.otazky`: přímá řeč k dítěti v „…“, bez rodu; v režimu „Dnes samo“ se ukazují postupně už během prvního kroku → **žádná nesmí prozradit odpověď žádného kroku ani ukázat na chybné slovo detektiva**. „Platí“ nesmí obsahovat odpověď ani hodnocené slovo. Text nahrávky nikde viditelný pro dítě ani v `tisk.zadani`.
- Jména: Tomáš, Lucka, Honzík (mimo T6 jen vytištěné), Klára, Adam, Ema; Petr jen detektiv. Svět 13–14letých.
- `kontrola`: `jistota: "jista"` jen když je vše ověřené v ÚJČ, jinak `"stredni"`; `zkontroloval: "autor"`, `datum: "2026-10-09"`, `zdroj` = odkazy ÚJČ, `poznamka`.
- Rozpis `cestina/Obsah/TEMA-{T}-NAOSTRO.md`: stručně po lekcích (úloha → co hodnotí, správné odpovědi, známé chyby), oddíly „Nahrávky (pro AUDIO.md)“ (tabulka ve formátu AUDIO.md, stav „čeká na Pavla“), „Ověření ÚJČ“, „Nejistoty“.

KONTROLA (opakuj, dokud neprojde): `npm run seed:validace -- --lekce {IDSN}` → 0 chyb (kromě „nemá řádek v AUDIO.md“); skriptem přes `web/js/vyhodnoceni.js` + `web/js/vyhodnoceni-cj.js` (`vyhodnotKrok`, `vzorovaOdpoved`, viz `testy/cestina.test.js`): vzorová odpověď každého kroku `spravne: true`, každá známá chyba vrátí svůj kód. Skripty do `/tmp/naostro-cj{T}/`. NEspouštěj `nastroje/qa-osma.mjs` ani server.

Výsledná zpráva česky (6–10 řádků): soubory, validace a vyhodnocení, v čem je každá naostro lekce těžší, počet nahrávek, nejistoty a návrhy kódů.
