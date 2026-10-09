Jsi RECENZENT MATEMATIKY produktu „Spolu 8“ (opakování 6.–7. ročníku pro osmáky; rodič s tahákem NEBO dítě samo s nápovědami; 20 min, 4 úlohy). Repozitář /home/user/spolu-osma (NEcommituj, nepushuj). Recenzuješ a OPRAVUJEŠ jen soubory: `obsah/lekce/M8-T05-L1B.json` … `M8-T05-L4B.json`.

Přečti: `ZADANI-OSMA.md` (§3, §4, §7, §9), `PLAN-ROZSIRENI.md`, `obsah/OSNOVA-MATEMATIKA.md` (§1 a oddíl tématu; u diagnostiky §5–6), `kostra/03-format-obsahu.md`, `obsah/SABLONA.md` (pravidla textů; §5.3, §18 o přijímačkách a §20 neplatí), `obsah/typy-chyb.md`, `agenti/05-recenzent.md`.

Kontroluj nezávisle (ne podle poznámek autora):
1. **Matematika:** každé zadání přepočítej sám skriptem (python Fraction); správné odpovědi, mezivýsledky v `reseni`, čísla v taháku a semaforu. Každá známá chyba: opravdu vznikne popsaným omylem, liší se od správné odpovědi, kód sedí k popisu ve slovníku.
2. **Jednoznačnost:** zadání má jedinou správnou odpověď v daném tvaru (jednotky, zaokrouhlení, základní tvar); dlaždice: právě jedna správná, distraktory jsou skutečné typické chyby.
3. **Úroveň a osnova:** odpovídá plánu úloh v osnově a 6.–7. ročníku; žádná látka 8. ročníku (mocniny jako operace, odmocniny, Pythagoras, rovnice s neznámou mimo úměrnost/procenta); žádné CERMAT/přijímačky v textech.
4. **Texty:** popisky kroků neprozrazují postup; `tahak.otazky` L1–L3 jsou přímá řeč k dítěti, bez rodu, neprozradí výsledek (v režimu samo je čte dítě); `typicka_chyba`, `semafor` (zelená/oranžová/červená podle SABLONA §9 a §18), limity slov (SABLONA §4); zlomky jen `\frac`, desetinná čárka; `tisk.zadani` bez řešení.
5. **Vyhodnocení:** skriptem přes `web/js/vyhodnoceni.js` (`vyhodnotKrok`) ověř správné odpovědi i známé chyby (vzor tvaru odpovědí v `testy/vyhodnoceni.test.js`).

Co najdeš, rovnou OPRAV v JSON (věcné chyby, nejednoznačnosti, texty). Větší zásah do úlohy (jiná čísla, jiný typ) smíš, ale zapiš do `kontrola.poznamka`. Na konci nastav `kontrola.jistota` = "jista" (když vše sedí) nebo "stredni" (+ co zbývá), `zkontroloval: "recenzent"`, `datum: "2026-10-09"`. Validace: `npm run seed:validace -- --lekce M8-T05-L1B,M8-T05-L2B,M8-T05-L3B,M8-T05-L4B` → 0 chyb. Skripty do `/tmp/recenze-b05/`. NEspouštěj `nastroje/qa-osma.mjs` ani server (běží souběžně jiní agenti).

Zpráva (5–8 řádků): co jsi našel a opravil (počet věcných chyb zvlášť), co zůstalo sporné.

DOPLNĚK — lekce celého roku (ZADANI-OSMA §9):
- **Naostro lekce** (`…N`): dvojče učební lekce `M8-T<tt>-L<n>` (přečti ji vedle). Musí: mít stejné `tema`, `kapitola`, `tyden`, `poradi`; cvičit stejné dovednosti; být **o kus těžší nebo objemnější** (víc položek, smíšené úlohy, slovní úloha o krok navíc, nenápadnější chyba detektiva) a **nepřebírat čísla, kontext ani věty z učební lekce**. Když je naostro lekce stejně lehká jako učební, ztěžuj; když skáče do látky mimo téma nebo do 8. ročníku, vrať ji do tématu.
- **B-varianta** (`…B`, `…NB`): stejná lekce jako její hlavní (`…` bez B) — stejná struktura, typy vstupů, obtížnost a délka — jen jiná čísla, kontext a věty. Nesmí být těžší ani lehčí; nesmí opakovat čísla hlavní lekce.
- Režim „Dnes samo“: otázky taháku se ukazují postupně už během kroku 1 → žádná nesmí prozradit výsledek ani ukázat na Petrovo chybné místo.

DOPLNĚK K TÉTO DÁVCE (B-varianty učebních lekcí T05, hlavní lekce M8-T05-L1 … L4; naostro M8-T05-L1N … L4N jsou hotové):
- B-varianta = stejná lekce jako hlavní (id bez B): stejná struktura, vstupy, kódy chyb, obtížnost. Jiná čísla a kontext než L1–L4 i L1N–L4N. Ne lehčí, ne těžší.
- Sporná místa autora (posuď a případně oprav): L2B U3 dávka 1/8 kg je snazší než 3/20 v hlavní lekci — najdi dávku s čitatelem > 1, která dá rozumná čísla i u známých chyb a neopakuje hlavní/naostro lekci; když nejde, nech. L1B U1 A dlaždice 1200/60 (posuď, jestli není nesmyslně velká). Málo pravděpodobné známé chyby (0,15625; 0,0625) nahraď pravděpodobnějšími, když to jde bez ztráty diagnostiky.
- Hlídej slovní limity podle SABLONA §4; autor má skript `/tmp/b-b05/slova.py` a kontrolu `/tmp/b-b05/over.mjs` (smíš použít, generátory NESPOUŠTĚJ).
