# Technika Spolu 8: co se změnilo proti Spolu, jak spustit, jak QA

Verze 1.0, 1. 10. 2026. Napsal programátor (backend + frontend). Závazné zadání je `ZADANI-OSMA.md`.
Repo je kopie aplikace Spolu (matematika na přijímačky + čeština základy). Kód je ve stejném stylu: statický web ve `web/`, vanilla ES moduly, Supabase s RLS, žádný build.

## 1. Co se změnilo proti Spolu

### Formát a validace (`obsah/schema.json`, `supabase/seed/`)
- **Fáze `osma`** pro oba předměty. Ve složce `obsah/` seed pustí jen lekce fáze `osma`. Matematika patří do `obsah/lekce`, čeština do `obsah/cestina/lekce`.
- **Matematika:** id `M8-T<tt>-L<n>` (tt 01–10, n 1–4), `tyden` = tt, `poradi` = n. Diagnostika je `M8-T00-DIAG` (`typ: "diagnostika"`, `tyden` 0).
  - Lekce má 4 úlohy: rozcvicka, detektiv, cermat, semafor. Typ `cermat` je hlavní úloha a v UI se ukazuje jako „Hlavní úloha“ (`NAZVY_TYPU` v `web/js/obsah.js`).
  - Zdroj s „CERMAT“ nebo „klon“ hlásí validátor jako varování. `varianta: "z8"` (jinak varování).
- **Čeština:** id `cj-t<t>-l<n>` (t 1–10, n 1–40 průběžně) a **5 úloh**: rozcvicka, nova, nova, detektiv, kontrolni.
  - Týdenní kontrola je úloha 5 lekce s `poradi` 4 (`tydenni: true` + `semafor_tydne`). `cas_min` ~25 (mimo 22–27 je varování).
  - Diktát musí mít `hodnotit_interpunkci: false`. `oznac_role` smí mít nejvýš 8 rolí.
  - Starší fáze `zaklady` (6 úloh) validátor pořád zná, ale do `obsah/` nepatří.
- **Diagnostika češtiny `cj-t0-diag`** (větev `lekceDiagnostikaCestina`) má stejná pravidla jako diagnostika matematiky:
  - jen krok `final`, bez taháku a semaforu;
  - každá úloha má `kapitola` a **`tema` (číslo tématu 1–10, povinné v obou diagnostikách)**;
  - `zname_chyby` s kódy, u dlaždic `typ_chyby` u každé špatné možnosti;
  - diktát ani text bez správné odpovědi do ní nepatří. Prošla i vzorová odpověď a známé chyby.
- **Kapitoly mají jedno místo:** tabulku „Názvy kapitol“ v `obsah/hlasky.md` (→ `web/js/hlasky.js` `KAPITOLY`).
  - Schéma pustí každý kód ve tvaru `^[a-z][a-z-]+$`. Kód, který v tabulce chybí, je **varování**, ne chyba.
  - Pseudo-kapitoly (`mix`, `simulace`, `diagnostika`) úloha mít nesmí.
- **Seed:**
  - `--otevrit-od RRRR-MM-DD` otevře všechny lekce fáze osma najednou (půlnoc v Praze). Bez tohoto parametru se nic nenahraje.
  - `--verejna` nastaví `verejna = true`, výchozí je false. Seed vždy posílá `predmet`, `varianta` je z8.
  - `--soubor <cesta>` a `--lekce <id>[,<id>]` kontrolují jen vybrané soubory (pro autory).
  - Kontrola celé složky na konci vypíše, které z 41 souborů předmětu ještě chybí.

### Databáze (`supabase/migrations/0001–0005`, čistá sada pro novou DB)
- Sloučeno ze Spolu 0001–0007. Soubory 0006 a 0007 zmizely, `vse-v-jednom.sql` je přegenerovaný.
- `lekce`:
  - nový sloupec `predmet`;
  - `faze` jen `osma`, `tyden` 0–10;
  - constraint id ↔ předmět (`cj-%` = čeština, `M8-%` = matematika);
  - `varianta` výchozí `z8`.
- `deti`:
  - `predmety text[]`, výchozí `{matematika,cestina}`;
  - `typ_skoly` a `znamka_8` jsou volitelné (null).
- `sezeni.rezim` je `app | papir | samo`.
- `rodiny.stav` je `aktivni` (výchozí po registraci) nebo `uzavreny`. Sloupec stavu zůstal. Pilot, platba ani dotazník (tabulka `dotazniky`, `dotaznik_vyplnen`) nejsou.
- **Zámek** je jedna funkce `duvod_zamceni(verejna, otevrit_od)`:
  - lekci vidí každá přihlášená rodina od `otevrit_od` (`verejna` i dřív);
  - rodina `uzavreny` nevidí nic;
  - admin vidí vše.
- `sezeni_insert` založí sezení jen dítěti, které má předmět lekce v `deti.predmety` (funkce `dite_ma_predmet_lekce`).
- `katalog_lekci()` vrací navíc `predmet` a `pocet_uloh` (počet úloh z obsahu, aby přehled nemusel znát čísla 4/5).
- Registrace (`po_registraci`) založí rodinu `aktivni` a první dítě. Volitelně bere `predmety` z metadat.

### Web
- **Branding:** „Spolu 8 — opakování 8. třídy“ v logu a titulcích. Barvy a písmo StudentBase beze změny.
- **Úvodní stránka a registrace:** texty pro 8. třídu, bez ceny, pilotu a přijímaček.
  - Registrace chce jméno rodiče, e-mail, heslo a jméno dítěte. Formulář dítěte chce jméno a předměty.
  - Stránka `dotaznik.html` je smazaná. `uzavreno.html` má texty Spolu 8.
- **Přehled (`web/js/prehled.js`, přepsaný):**
  - záložky Matematika | Čeština (výchozí obě);
  - karta „Úvodní test (25 min)“, pod ní „Doporučeno teď“;
  - 10 sekcí „Téma n · Název“ po 4 lekcích (4. lekce = „kontrola tématu“);
  - štítek tématu podle testu (Procvičit / Zopakovat / Jde to), odznaky (R62) a SOS.
  - Počet úloh a minut na kartě je z dat (`pocet_uloh`, `cas_min`).
  - Bez fází, pilotu, platby, dotazníku, simulací a bloků (kód pro ně zůstal, nevolá se).
  - Časová osa do přijímaček (R63, `osa-sezony.js`) je smazaná.
- **Názvy témat** jsou v `obsah/hlasky.md`, tabulka „Názvy témat“, klíče `tema_mat.t1…t10` a `tema_cj.t1…t10`.
  - Doplní je metodici z osnov a pak `node nastroje/generuj-hlasky.mjs`.
  - Dokud chybí, název se složí z kapitol lekcí tématu (`web/js/temata.js`).
- **Úvodní test → doporučené pořadí** (`web/js/doporuceni.js`, čisté funkce, testy `testy/doporuceni.test.js`):
  - Výsledek po tématech se počítá z `tema` úlohy (bez něj z kapitoly).
    - Silné ≥ 80 %, slabé < 50 %, jinak nejisté, nezjištěné.
    - U češtiny je všechno, co není silné, slabé.
  - Pořadí témat podle rozhodnutí vedoucího z 1. 10.:
    - všechna nesilná témata jdou v pořadí osnovy, silná na konec;
    - čeština se 7 a více slabými tématy jde podle osnovy;
    - bez testu platí pořadí osnovy.
  - Uvnitř tématu: nesilné téma L1 → L4, silné téma jen L4 (L1–L3 „Volitelné“).
    - **Pojistka:** L4 silného tématu oranžová/červená (`souhrn.hlavniBarva`) → doporučí se L1–L3 a pak znovu L4.
  - **Bez nové tabulky.** Dítě test po poslední úloze uzavře samo (`lekce.js` `dokoncitTestOsma`), souhrn se uloží do `sezeni.souhrn` (`typ: 'diagnostika', osma: true`).
    - Když souhrn chybí, přehled i rodič ho dopočítají z `odpovedi` diagnostiky v DB.
  - Přestávka je v polovině testu podle počtu úloh (`prestavkaPo`).
  - Rodič vidí krátký report (`rodic-diagnostika.js` `vytvorVysledekOsma`): kde začít, co zatím nejde, napůl, co jde a nejčastější chyby.
- **„Dnes samo“ v obou předmětech** (`samo.js`, `lekce.js`):
  - Vyloučení češtiny v `lzeSamo` je pryč. Poslech a diktát fungují, protože čte nahrávka a vyhodnocuje aplikace.
  - Nápovědy jsou z `tahak.otazky`. U rozcvičky češtiny jdou podle řady („Řada B“ → otázka s `k: "B"`).
  - **Kontrolní úloha (čeština) a samostatná úloha (matematika):** nápověda se odemkne až po prvním odevzdání (`napovedyAzPoPokusu`, hláška `samo.kontrolni_ceka`).
  - Rodič vidí souhrn lekce s hláškou „Lekce proběhla bez vás“. Modal režimu nabízí „Dnes samo“ u obou předmětů.
- **5 úloh v češtině:** počet úloh je všude z dat (lišta, přepínač úloh u rodiče, souhrn, tisk, přehled).
  - „Úloha n z/ze N“ má správnou předložku (`zeZ` v `temata.js`).
  - Odznak „Celý týden“ je teď „Celé téma“ (klíč předmět + téma). Místo „Pilot“ a „Fáze 1“ jsou odznaky „Úvodní test“ a „Celý předmět“.
- **Admin:** stav rodiny jen Aktivní / Uzavřeno. Uzavřený účet jde „Znovu otevřít“. Bez konverze z pilotu, u dítěte se ukazují předměty.
- **Hlášky:** nové texty jsou v `obsah/hlasky.md`, oddíl „Spolu 8 …“ (`osma.*`, `samo.kontrolni_ceka`). Platba a dotazník zmizely, texty diagnostiky jsou bez čísel 24/40 min.

### Testy a nástroje
- **Syntetická data** jsou v `testy/data/osma/` (NENÍ to obsah Spolu 8, jen převod lekcí Spolu):
  - matematika: 9 lekcí + `M8-T00-DIAG` (20 úloh s `tema`);
  - čeština: 8 lekcí s 5 úlohami (poslech, v `cj-t2-l7` diktát) + `cj-t0-diag` (20 úloh).
- **Nové testy:**
  - `testy/osma-validator.test.js`: formát, validátor a seed proti falešnému PostgRESTu;
  - `testy/doporuceni.test.js`: pořadí, souhrn a plán lekcí.
- **Přepsané testy** (data Spolu v repu nejsou):
  - `cestina.test.js`, `diagnostika.test.js`, `vyraz-poradi.test.js` a `vyhodnoceni.test.js` běží na syntetických datech. `vyhodnoceni.test.js` bere i skutečné `obsah/lekce/M8-*.json`.
  - `odznaky.test.js` a `predmet.test.js`: katalog Spolu 8.
  - `validator.test.js`: neznámá kapitola = varování.
  - `seed-cj.test.js`: testy zápisu fáze zaklady odstraněné, protože seed Spolu 8 testuje `osma-validator.test.js`. Testy data otevření zůstaly.
- **Odstraněné nástroje** vázané na lekce a stránky Spolu: `qa-cestina.mjs`, `qa-sezona.mjs`, `screenshoty.mjs`, `screenshoty-f2.mjs`, `testy-rls.sql`. Nahrazuje je `nastroje/qa-osma.mjs` a `supabase/test/`.
- `kontrola-dlazdic.mjs` bere lekce `M8-*`. Potřebuje Chrome (`CHROME=…`).

## 2. Jak spustit lokálně
```
npm test                                   # unit testy (node --test)
npm run validace:osma                      # validace obsah/lekce + obsah/cestina/lekce
npm run seed:validace -- --lekce M8-T03-L2 # jedna lekce (cj-… se pozná podle prefixu)
npm run web                                # http://localhost:8799/web/prehled.html — bez Supabase (fake DB v prohlížeči)
node nastroje/staticky-server.mjs --fake --synteticke   # totéž se syntetickými lekcemi
npm run db:test                            # migrace 0001–0005 + zámek na lokálním PostgreSQL 16 (jako root přes su postgres)
```
- V režimu `--fake` je přihlášená testovací rodina s dítětem Adam (oba předměty). Data se drží v `localStorage` prohlížeče. Smaže je „Vymazat data webu“ nebo `localStorage.clear()`.
- Jednotlivá lekce bez DB: `web/lekce.html?lekce=M8-T01-L1&lokalne=1` (také `rodic.html` a `tisk.html`).
- Do skutečné Supabase se nic nezapisuje. Nová DB vznikne z `supabase/migrations/` (`npm run migrovat` s `SUPABASE_DB_URL` nového projektu). Pak `npm run seed -- --otevrit-od RRRR-MM-DD` a `npm run seed -- --adresar obsah/cestina/lekce --otevrit-od RRRR-MM-DD`.

## 3. QA v prohlížeči
```
node nastroje/qa-osma.mjs --synteticke     # teď (syntetické lekce)
node nastroje/qa-osma.mjs                  # až budou lekce v obsah/ (všechny lekce obou předmětů)
  volby: --lekce=M8-T01-L1,cj-t1-l4  --bez-prehledu  --bez-samo  --md <soubor>  --snimky <adresář>
```
- Prostředí: Playwright z `/opt/node22/lib/node_modules/playwright`, Chromium z `/opt/pw-browsers` (s `--no-sandbox`). Knihovny z CDN stahuje curl, Google Fonts jsou blokované.
- Co QA ověří:
  - přehled a jeho záložky, témata, „Doporučeno teď“, karty podle dat a nabídku „Dnes samo“;
  - úvodní stránku a registraci bez ceny, pilotu, typu školy a známky;
  - úvodní test: žák → automatické uzavření → výsledek u rodiče → pořadí v přehledu;
  - u každé lekce průchod žák 360, rodič 375, tisk (obrazovka i print) a samo (+ souhrn u rodiče);
  - na každé obrazovce konzoli, vodorovný scroll, nepřeložené klíče a zakázaná slova (přijímačky, CERMAT, pilot, Fáze…).

## 4. Otevřené body
1. **Názvy témat** (`tema_mat.t*`, `tema_cj.t*` v `obsah/hlasky.md`) doplní metodici z osnov. Do té doby se název skládá z kapitol.
2. ~~Manuál rodiče češtiny~~ upraven 2. 10. (5 úloh, ~25 min, „Dnes samo“).
3. **Nahrávky:** `cestina/Obsah/AUDIO.md` má řádky pro všechny nahrávky Spolu 8 (4. 10.). Natočené jsou jen 4 nahrávky témat 1–2; 45 nahrávek témat 3–10 čeká na Pavla (`cestina/Obsah/nahravky-t3-t10.csv`). Lekce bez souboru ukáže dítěti `cj.audio_chyba`.
4. **Stupně a minuty (T07-L1):** `cislo.jednotka` zobrazí i `°` a `′` (jednotka je prostý text za polem). Dva kroky ale nejsou v jednom řádku, každý krok je samostatný blok pod sebou.
5. **Datum otevření a `verejna`** rozhodne Pavel (`--otevrit-od`, `--verejna`). Nový Supabase projekt zatím neexistuje. Migrace jsou ověřené jen lokálně (PostgreSQL 16 + stuby `auth`).
6. **SOS** nabízí placenou konzultaci (150 Kč) jako ve Spolu, jen u rodiče. Jestli zůstane, rozhodne Pavel.
7. Kód Spolu pro simulace, bloky, papírový režim diagnostiky a výsledek diagnostiky Fáze 1 zůstal (nevolá se pro fázi `osma`). Smazat ho jde později jedním krokem.
8. Úvodní stránka (`web/index.html`) je statická bez JS jako ve Spolu, takže její texty nejsou v `hlasky.md`.
