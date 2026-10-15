# Stav Spolu 8 — 15. 10. 2026

> **Celý rok je hotový.** Obsah podle `PLAN-ROZSIRENI.md` a `ZADANI-OSMA.md` §9 je na `main` a prošel kontrolami. Do Supabase se nic nezapisovalo: databázi a seed pouští Pavel podle `SPUSTENI.md`, část B. Zbývají nahrávky češtiny a spuštění.
>
> Větve `rozpracovano-2026-10-09`, `rozpracovano-2026-10-12` a `odznaky-tahaky` jsou celé zpracované a sloučené. Do main už nic nového nepřinesou a dají se smazat.

## Hotové a ověřené

### Lekce celého roku (2 × 162 souborů)

| na předmět | počet | id (příklad M / ČJ) |
|---|---|---|
| učební lekce (10 témat × 4) | 40 | `M8-T03-L2` / `cj-t3-l10` |
| naostro lekce (dvojče, o kus těžší) | 40 | `M8-T03-L2N` / `cj-t3-l10n` |
| B-varianty učebních lekcí (po červené) | 40 | `M8-T03-L2B` / `cj-t3-l10b` |
| B-varianty naostro lekcí | 40 | `M8-T03-L2NB` / `cj-t3-l10nb` |
| úvodní test | 1 | `M8-T00-DIAG` / `cj-t0-diag` |
| pololetní test (leden) | 1 | `M8-T00-POL` / `cj-t0-pol` |

- **Postup každé dávky:**
  1. autor;
  2. nezávislý recenzent (matematika: přepočet skriptem) nebo korektor ÚJČ (čeština: každý hodnocený tvar v příručce ÚJČ, bez dublet);
  3. `kontrola.jistota: "jista"`. Seed nahrává jen lekce s touto jistotou.
- **Závěrečné audity témat** (oba předměty):
  - úniky odpovědí přes „Platí“, otázky taháku (v režimu „Dnes samo“ je vidí dítě), detektiva a opakované tvary;
  - slovní limity;
  - shoda B-variant s hlavní lekcí;
  - u češtiny skládání mezer se vzorovou odpovědí (např. *odddíl*, *vitala*) a novost slov pololetního testu.
- **QA v prohlížeči** (`nastroje/qa-osma.mjs`):
  - všechny lekce obou předmětů a pololetní testy: žák 360 px, rodič 375 px, tisk a „Dnes samo“;
  - jediný zobrazovací nález (výraz na dva řádky v M8-T06-L3N a L3NB) je opravený.
- **Rozpisy češtiny:**
  - `cestina/Obsah/TEMA-X.md` (učební);
  - `TEMA-X-NAOSTRO.md`;
  - `TEMA-X-B.md` (b i nb);
  - `POLOLETNI-TEST.md`.

  Pololetní test matematiky je popsaný v `TECHNIKA-OSMA.md`.
- **Validace:** `npm run validace:osma` → 0 chyb. Varování jsou jen u nenatočených nahrávek.
- **Validátor češtiny** nově hlídá, aby mezera po doplnění vzorové odpovědi nedala tři stejná písmena za sebou.

### Aplikace
- **Celý rok** (`TECHNIKA-OSMA.md`):
  - kalendář dítěte 3 + 3 lekce týdně, pořadí L1, L2, L1n, L3, L2n, L4, L3n, L4n;
  - B-varianta po červené, u oranžové jen 5minutové ústní cvičení rodiče;
  - pololetní test v lednu.
- **Odznaky, karty, taháky a výzvy** (převzato ze Spolu na přijímačky, R78, R80, R81, R82):
  - nový vzhled odznaků (HTML/CSS) a karta nového odznaku (rub a líc, neonový titulek Tilt Neon);
  - 22 odznaků (řady 3–30, oba předměty, 7 měsíčních výzev, sbírka taháků);
  - stránka „Moje taháky“ (`tahaky.html`): 20 taháků k tématům a 7 zlatých za měsíční výzvy listopad–květen;
  - karta výzvy na přehledu.

  Obsah taháků je napsaný pro 8. třídu a recenzovaný: matematika přepočtená, čeština ověřená v ÚJČ. Žádný příklad neprozrazuje úlohu z lekcí. Podrobnosti: `TECHNIKA-OSMA.md`, `predani/2026-10-09-odznaky-a-tahaky/TAHAKY-OSMA.md`.
- `npm test`: 3308 testů, 0 selhání.

## Chybí, než to půjde k dětem
1. **194 nahrávek češtiny** (76 poslechů, 118 vět diktátu, témata 1–10, hlavně nové lekce N, B a NB):
   - text pro ElevenLabs je v `cestina/Obsah/nahravky-k-nataceni.md` (a `.csv`), postup v `cestina/Obsah/NAHRAVKY-NAVOD.md`, texty v `cestina/Obsah/AUDIO.md`;
   - soubory patří do `web/audio/cestina/t1/` … `t10/`;
   - bez nahrávky ukáže poslech nebo diktát hlášku „Nahrávka se nenačetla“, ostatní úlohy fungují;
   - 4 nahrávky (témata 1–2) jsou hotové.
2. **Nový Supabase projekt a hosting:** `SPUSTENI.md`, část B.
3. **Rozhodnuto 15. 10. (Pavel):**
   - placená SOS konzultace (150 Kč) z aplikace zmizí, místo ní bude stálý kontakt pro rodiče („napište nám, domluvíme i lekci s lektorem“);
     - datum otevření je **2. 11. 2026**, seed `--otevrit-od 2026-11-02`;
     - zlatý tahák „Co mě čeká v 9. třídě“ zůstává i s větou o přijímací zkoušce, je to ukázka, co děti čeká.

## Otevřené drobnosti (neblokují)
- **Kódy chyb:** pravidlo vedoucího je žádné nové kódy. Navrhované kódy proto korektoři nahradili existujícími:
  - `predlozka-za-spojku`, `predlozka-za-podstatne`, `cislovka-dvemi`, `bychom-tvar`, `rod-trpny-za-podminovaci`;
  - `vs-pribuzne-navic`, `shoda-nekolikanasobny-a`.
- **Kód pro *ů* uvnitř slova chybí.** T9 L36 proto hodnotí *domů* kódem `u-carka-za-krouzek`.
- **Rozbor souvětí (T9 L33, L36):** známá chyba je „vše prohozeno“. Částečné záměny by daly přesnější zpětnou vazbu.
- **Méně častá slova:** B-varianty češtiny T10 kvůli vyčerpané zásobě slov hodnotí i méně častá slova (*vjedno, protiústavní, zúročit*). Věty jsou upravené tak, aby šel význam odvodit.
- **Mobil:** vstup `cislo` má `inputmode="decimal"`. Na iOS ta klávesnice nemá znaménko minus. Ověřit na iPhonu u lekcí se zápornými čísly (T06).
- **Validátor a SABLONA:** validátor nehlídá max. 4 dlaždice (SABLONA §5.2) ani délku `znak` (36 znaků). Lekce limity dodržují, ověřily to audity.
- **Taháky češtiny, slova neověřená v IJP** (ÚJČ byla 15. 10. nedostupná; běžné spisovné tvary bez známé dublety, korektor je ověřil v SSČ nebo podle vzoru): *uhašen, plazi, daň, zastánce, sluha, houslař, kořenný, nevyspalý, zubařka, palanda, kopytník, netopýří, výří, syslí, pylový, terárium, klisna, lněný, neúčast, neúčinný, sloučit, vzpřímit se, objevitel, objednací, ohromně, zahřmít, šeptem, celer, pepř, anténa, levně, svítat, jedenáctkrát, sedmnáctý, ostrov, knoflík, vikýř, promyšlený*. Až ÚJČ pojede: `bash nastroje/ujc.sh <slovo>`.
- **Hovorová slova** *kluk, máma, táta* jsou v celém produktu záměrně (přirozený jazyk dětí). Hodnocená jsou jen tam, kde nejde o jev.
