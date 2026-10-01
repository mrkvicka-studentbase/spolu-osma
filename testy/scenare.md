# Testovací scénáře — Spolu na přijímačky

Provedeno 24. 9. 2026 proti lokálnímu serveru (`python -m http.server 8788` z kořene repa) a reálné Supabase databázi (`.env` → `SUPABASE_DB_URL`, `web/js/config.js`). Testovací účty: `testy/testovaci-ucty.local.json` (hesla se sem neopisují). Prohlížeč: vestavěný `mcp__Claude_Browser__*` (dva taby = dvě origins, `http://127.0.0.1:8788` a `http://localhost:8788`, kvůli oddělenému `localStorage`).

Po testu byly stavy rodin vráceny (`rodina_pilot` = `pilot`, `rodina_aktivni` = `aktivni`), dotazník `rodina_pilot` smazán a `dotaznik_vyplnen` vráceno na `false`, dočasná lekce `F1-T01-L1` smazána. Přihlašovací session na konci odhlášeny, servery ukončeny, viewport vrácen na desktop.

Legenda: ✅ PASS · ❌ FAIL · ⚠️ částečně · ➖ N/A

---

## 1. Registrace rodiny + 1. dítě — ⚠️ ČÁSTEČNĚ (zbytek ručně Pavel)

**Důvod částečnosti:** Supabase odmítá `@example.com` a má nízký limit odchozích e-mailů (potvrzení e-mailu je zapnuté, R5/R6) → nová registrace se v tomto testu NEPROVÁDĚLA. Ověřen jen formulář, validace a chování při duplicitním e-mailu; založení `rodiny` + 1. `dite` triggerem `after_signup` je ověřené v `supabase/testy-rls.sql` (test „registrace založila rodiny A, B a dítě A").

Kroky a výsledek:
1. Otevřít `registrace.html`, odeslat prázdný formulář → **PASS**: u všech polí (jméno, e-mail, heslo, jméno dítěte, typ školy, známka, souhlas s podmínkami) se zobrazila správná česká chybová hláška a fokus skočil na první chybné pole.
2. Vyplnit platná data, ale e-mail už zaregistrovaný (`test-pilot@example.com`) → **PASS**: hláška „Tento e-mail už je zaregistrovaný. Přihlaste se." + tlačítko „Přejít na přihlášení"; žádný e-mail se needle (klient detekuje `identities.length === 0` dřív, R6).
3. Text na formuláři „Druhé dítě můžete přidat později, je zdarma." — **viz scénář 2**: tento příslib aplikace momentálně nesplní (chybí UI).
4. Skutečná registrace nového e-mailu, potvrzovací e-mail a založení dítěte triggerem → **ručně Pavel** (real e-mail, mimo `@example.com`), nebo ověřit v `supabase/testy-rls.sql` (již prochází).

**Ruční kroky pro Pavla:** otevřít `registrace.html` s reálným e-mailem, vyplnit a odeslat, zkontrolovat doručení potvrzovacího e-mailu (čeština textu), kliknout na odkaz, ověřit přesměrování na `prehled.html` a že se v adminu objeví rodina + 1 dítě.

---

## 2. Přidání 2. dítěte — ❌ FAIL

**Očekávaný výsledek:** rodič už zaregistrovaný s 1 dítětem najde v UI možnost přidat druhé dítě (podle `registrace.html` textu „Druhé dítě můžete přidat později, je zdarma." a `kostra/02` max 2 děti).

**Skutečnost:** V žádné stránce (`prehled.html`, `registrace.html`, menu) není tlačítko ani formulář pro přidání dalšího dítěte. `pridatDite()` je hotová a funkční helper funkce v `web/js/supabase.js` (ověřeno funguje správně — viz scénář 3), ale **není zavolaná z žádného JS souboru žádné stránky** (`grep -rn "pridatDite" web/` mimo definici a JSDoc komentář nenajde nic). `web/js/prehled.js` jen čte `mojeDeti()` a přepíná mezi existujícími dětmi (`.prepinac`), nenabízí přidání nového.

Rodina `rodina_aktivni` má 2 děti (Bára, Cyril) jen proto, že druhé dítě bylo vloženo přímo přes seed/SQL při přípravě testovacích účtů — ne cestou, kterou má k dispozici skutečný rodič.

**Reprodukce:** přihlásit se jako rodič s 1 dítětem (`test-pilot@example.com`), projít `prehled.html` i menu → nikde není akce „Přidat dítě".

**Závažnost:** blokující — jde o zdokumentovanou funkci (max 2 děti na rodinu, `kostra/02`) a formulář registrace ji aktivně slibuje rodiči, ale nejde ji použít bez zásahu do databáze.

---

## 3. Pokus o 3. dítě — ✅ PASS

Přes konzoli (`await (await import('/web/js/supabase.js')).pridatDite({jmeno:'Treti-Test', typSkoly:'gymnazium', znamka8:2})`) na účtu `test-aktivni@example.com`, který už má 2 děti (Bára, Cyril):

- Volání vyhodí `ChybaSpolu` s `kod: 'max_2_deti'` a českou hláškou **„Můžete mít nejvýše 2 profily dětí."**
- `mojeDeti()` před i po volání vrací stále 2 děti — v databázi nevznikl žádný nový řádek.
- Odpovídá DB constraintu i triggeru ověřenému v `supabase/testy-rls.sql` („max 2 děti, poradi doplněno automaticky").

---

## 4. Volba role na dvou „prohlížečích" — ✅ PASS

Dvě origins se stejným účtem (`test-pilot@example.com`): `http://127.0.0.1:8788` a `http://localhost:8788` (oddělený `localStorage`, klíč `spolu.role`).

1. Na `127.0.0.1` nastavena role `zak` → `ziskejRoli()` vrací `"zak"`.
2. Na `localhost` PŘED nastavením role byla role `null` (potvrzuje, že se nesdílí přes origins), po nastavení role `rodic` vrací `"rodic"`.
3. Zpětná kontrola na `127.0.0.1`: role zůstala `"zak"`, nebyla ovlivněná druhým „prohlížečem".

Role zařízení je tedy skutečně nezávislá per origin/zařízení, jak popisuje `kostra/01`.

---

## 5. Lekce P1 v aplikaci kompletně (žák) + rodič semafor + souhrn — ✅ PASS (s nálezem bugu, viz REPORT-QA)

Žák (role `zak`, dítě Adam, `lekce.html?lekce=P1`) prošel všechny 4 úlohy „V aplikaci":
- Úloha 1 (rozcvička): 3 kroky dlaždic — všechny odevzdané správně, zobrazilo se „Správně!" po každém kroku.
- Úloha 2 (detektiv): k1 (chybný řádek), k2 (oprava), final (číslo `72`) — všechny správně.
- Úloha 3 (cermat): k1 (dlaždice), k2 (mezivýsledek `10`), final (**`2,9`** — desetinná čárka) — všechny správně; ověřilo se, že UI skutečně přijímá desetinnou čárku end-to-end (ne jen v testech `vyhodnoceni.test.js`).
- Úloha 4 (semafor): final `24` — správně.
- Po 4. úloze: obrazovka „Hotovo, ukaž telefon rodiči" — přesně podle `kostra/04` bod 6.

Rodič (role `rodic`, jiná origin, `rodic.html?lekce=P1`) na stránce „Pokračovat" viděl „Dítě odevzdalo: krok 3 ✔" (polling), pro každou ze 4 úloh zvolil „Vyřešil(a) sám/sama" → u každé se objevila barva **Zelená** + doporučení z JSON (`semafor.zelena`) a `aria-pressed="true"` na zvoleném tlačítku. Souhrn lekce ukázal 4× zelenou, hlavní barvu „Sám/sama: Zelená", „Zítra: nová lekce." Kliknutí „Ukončit lekci" uložilo `sezeni.stav='dokonceno'` se správným `souhrn` JSON (ověřeno SQL) a přepnulo obrazovku na read-only souhrn (R19).

**Nález:** u každého semaforového výsledku bez textu „Kontrola pro vás:" (tedy typicky u „Zelená") se do stránky vykresluje navíc doslovný text **„null"** mezi doporučením a větou „Volbu můžete změnit." — viz REPORT-QA, bod 1 (vážná chyba, `web/js/rodic-souhrn.js`).

---

## 6. Lekce P2 na papír (tisk otevřen, rodič zadává výsledky) — ✅ PASS

Otestováno na lekci P4 dítěte Bára (čerstvá, nezačatá), aby test nekolidoval s existujícími daty:
1. `prehled.html` → „Začít lekci" → modal „Jak dnes budete pracovat?" → „Na papír".
2. `tisk.html?lekce=P4&dite=…` se otevřelo se správným obsahem: záhlaví se jménem dítěte („Bára") a lekcí, všechny 4 úlohy s nabídkou a/b/c místo dlaždic, patička „studentbase.cz · výsledky zapisuje rodič do telefonu", tlačítko „Vytisknout / Uložit jako PDF".
   - *Poznámka k prostředí:* v tomto prohlížečovém nástroji `window.open(..., '_blank', 'noopener')` nahradil obsah stejného tabu místo otevření nového okna (omezení testovacího nástroje, ne appky — kód v `web/js/prehled.js:175` volání `window.open` má správně `_blank`/`noopener`; ověřit v reálném prohlížeči zůstává na Pavlovi, ale kód odpovídá zadání).
3. Na `rodic.html?lekce=P4&dite=…&rezim=papir` se u úlohy 1 zobrazila sekce „Výsledek dítěte (papír)" s dlaždicemi stejnými jako `final` krok a tlačítkem „Vyhodnotit".
4. Po výběru správné možnosti a „Vyhodnotit" se v DB uložil řádek `odpovedi` s `zadal='rodic'`, `hodnota='a'`, `spravne=true` — přesně podle typu vstupu z JSON (dlaždice u P4-U1 final).

Při jednom pokusu se krátce objevila hláška „Nepodařilo se uložit, zkuste obnovit stránku." a odpověď se automaticky uložila při dalším pokusu fronty (do 15 s) — mechanismus fronty (`ulozOdpoved`/`opakovatNeulozene`) funguje podle specifikace; frekvence tohoto přechodného výpadku v reálném provozu doporučuji Pavlovi sledovat (viz REPORT-QA, kosmetická poznámka).

---

## 7. Přerušení lekce a návrat do 24 h — ✅ PASS

Dítě Bára mělo rozpracované sezení P1 (`stav='probiha'`, založené v rámci tohoto testu, mladší než 24 h, všechny 4 úlohy už odevzdané, ale sezení ještě nedokončené rodičem). Otevření `lekce.html?lekce=P1&dite=<Bára>` **bez** parametru `sezeni` (stejně jako by žák znovu otevřel stránku po zavření prohlížeče) rovnou zobrazilo koncovou obrazovku „Hotovo, ukaž telefon rodiči" — potvrzuje, že `zacitSezeni()`/`aktualniSezeni()` najde a použije existující rozpracované sezení mladší 24 h (R18/kostra 01) místo založení nového. Přechod na stejné sezení tedy funguje bez jakékoli real-time synchronizace, jen dotazem při načtení.

---

## 8. Dvě červené v řadě → SOS karta + mailto — ✅ PASS (s nálezem bugu v předmětu e-mailu)

Připraveny 2 dokončené lekce dítěte Adam ve stejné kapitole „zlomky" (P3, P4) s hlavní barvou `cervena` (kompletní řetězec `zacitSezeni` → `ulozSemafor` pro všechny 4 úlohy → `dokoncitSezeni` se souhrnem, stejné funkce jako používá `rodic.js`/`rodic-souhrn.js`).

Načtení read-only souhrnu druhé (P4) lekce (`rodic.html?lekce=P4&dite=…&sezeni=…`) ukázalo:
- Všechny 4 úlohy „Červená", hlavní barva „Sám/sama: Červená", sekci „Na zítra" se 4 doporučeními z JSON.
- **„Druhá červená v řadě u tématu zlomky — Tohle téma dnes znovu nešlo. Nechcete ho probrat s lektorem? Online konzultace 30 minut, 150 Kč." + tlačítko „Napsat e-mail"** — přesně podle pravidla `dveCerveneVRade()` (2 dokončené lekce stejné kapitoly po sobě s hlavní červenou).

**Nález:** odkaz `mailto:` má v **předmětu** e-mailu nedosazený placeholder — `subject=SOS: zlomky — {jmeno_ditete}` místo „SOS: zlomky — Adam". Tělo e-mailu jméno dítěte správně obsahuje („Dítě: Adam"). Viz REPORT-QA, bod 2 (vážná chyba, `web/js/rodic-souhrn.js`, funkce `vytvorSosOdkaz`).

---

## 9. Zamčená lekce Fáze 1 pro stav `pilot` — ✅ PASS

Seed dočasné lekce `F1-T01-L1` (`faze:"faze1"`, `tyden:1`, `poradi:1`, klon obsahu P1) přes `node supabase/seed/seed-lekce.mjs --adresar <scratch>`.

- `prehled.html` rodiny se stavem `pilot` ukázal novou sekci „FÁZE 1 · TÝDEN 1" s kartou „Zamčeno" a textem „Odemkne se po platbě: 790 Kč v předprodeji (do 31. 10.)." — přesně podle `kostra/04`.
- Přímé volání `nactiLekci('F1-T01-L1')` (obchází UI) vyhodilo `ChybaSpolu` s `kod:'zamceno'` — zámek je vynucený i na úrovni RLS/`supabase.js`, ne jen v UI.
- Po testu smazáno (`delete from lekce where id='F1-T01-L1'`, žádná sezení na ni nevznikla).

---

## 10. Admin: odemknout, detail, statistiky, CSV — ✅ PASS

Přihlášení jako `test-admin@example.com` (`jeAdmin()` → `true`).

- **Přehled rodin**: 3 rodiny, filtr stav/hledat/řazení dostupné, sloupec „Červené 7 dní" ukazoval aktuální počet (13 u Adama po testech výše), tlačítka „Odemknout"/„Uzavřít"/„Poznámka" viditelná u pilotních/aktivních rodin (nekliknuto záměrně, aby se nemusel měnit a vracet stav rodiny nad rámec zadání).
- **Detail rodiny** (Test Pilotní): zobrazil dítě Adam (gymnázium, známka 3) a chronologický seznam sezení s lekcí, režimem (V aplikaci/Na papír) a délkou.
- **Statistiky**: „Rodiny a konverze" (2 pilot, 1 aktivní, 0 uzavřeno, konverze 33,3 %), „Semafory podle kapitoly" (sloupce zelená/oranžová/červená), „Průměrný čas na úlohu" (po kapitole i po úloze), „Červené za posledních 30 dní" (seznam se jmény, lekcí, volbou rodiče), „Dokončené lekce po týdnech".
- **Export CSV**: `admin.exportCsvData()` vrátil hlavičku i 3 řádky se správnými sloupci (e-mail, jméno, stav, děti, dotazník, aktivita…), CSV s BOM a středníkem (pro český Excel).

---

## 11. RLS: uživatel A nevidí data rodiny B — ✅ PASS

1. `node supabase/skripty/sql.mjs --soubor supabase/testy-rls.sql` → skončilo hláškou **„VŠECHNY TESTY RLS PROŠLY"** (14 dílčích „OK:" bloků — cizí rodina/děti/sezení/odpovědi/semafory neviditelné a nezapisovatelné, anon bez přístupu, admin vidí vše, fáze/stav ovlivňují viditelnost lekcí, chráněné sloupce rodiny needitovatelné klientem).
2. Navíc ověřeno přes anon klienta v prohlížeči (ne jen SQL transakce): přihlášený `test-pilot@example.com` (rodina_pilot) zkusil číst `sezeni`/`rodiny`/`deti` patřící `rodina_aktivni` (konkrétní `dite_id`, `sezeni.id`, `rodina_id`) přímo přes `supabase.from(...)` — všechny 4 dotazy vrátily `data: []` bez chyby (RLS řádky prostě nefiltrovatelné, ne 403), zatímco `mojeDeti()` ve stejné chvíli správně vrátil jen vlastní dítě Adam.

---

## 12. Telefon 390 px bez horizontálního scrollu — ✅ PASS

Viewport 390×844, `document.documentElement.scrollWidth` vs. `clientWidth` porovnáno na `rodic.html` (souhrn), `prehled.html`, `index.html`, `registrace.html` — u všech `scrollWidth === clientWidth === 390` (žádný horizontální scroll).

---

## 13. Safari iOS klávesnice zlomku — ➖ N/A (ruční test na zařízení pro Pavla)

Vestavěný prohlížeč tohoto prostředí neumí simulovat skutečné iOS Safari (WebKit na iOS má specifika u `inputmode`, virtuální klávesnice a zoomu na `<input>` s menším `font-size` než 16 px, která tento projekt jinak dodržuje). Potřeba ověřit na fyzickém/simulovaném iPhonu.

**Přesné kroky pro Pavla:**
1. Na iPhonu (Safari) otevřít `rodic.html?lekce=P3&dite=<id>&rezim=papir` nebo `lekce.html?lekce=P3` (zlomek jako vstup, úloha P3-U2 nebo P3-U3).
2. Klepnout do pole čitatele/jmenovatele `.zlomek-vstup` — ověřit:
   - Nevyjíždí systémová (číselná/plná) klávesnice, protože pole má `inputmode="none"` na dotykovém zařízení (jen vlastní `.klavesnice` dole, viz `web/js/klavesnice.js` a `web/DESIGN.md`).
   - Stránka se při focusu nepřiblíží/nezoomuje (kontrola, že focused input má `font-size >= 16px`).
   - Vlastní matematická klávesnice (`.klavesnice`) se zobrazí jen na dotykovém zařízení (`matchMedia('(pointer: coarse)')`) a její tlačítka (číslice, `a/b Zlomek`, `Smazat`, `Hotovo`) skutečně zapisují do správného pole (čitatel/jmenovatel), ne do posledně použitého obecně.
   - Přepnutí mezi čitatelem a jmenovatelem klepnutím funguje a klávesnice zůstává použitelná (žádné posunuté rozložení kvůli Safari liště nahoře/dole).
   - Otočení na šířku (landscape) neschová klávesnici mimo viewport.
3. Zapsat zlomek přes klávesnici (např. „3", „a/b", „4") a potvrdit „Hotovo" — zkontrolovat, že se hodnota uloží stejně jako při psaní fyzickou klávesnicí (test `vyhodnotKrok` typ `zlomek` je pokrytý v `testy/vyhodnoceni.test.js`, jde jen o to, že ji Safari po klepnutí korektně předá do inputu).

---

## 14. Dotazník po P4 a příznak `dotaznik_vyplnen` — ✅ PASS

Po dokončení 4. pilotní lekce (Adam, P4) se na `prehled.html` objevila karta „Prošli jste všechny 4 pilotní lekce. Dáte nám 2 minuty? Za vyplněný dotazník máte cenu 790 Kč i po 1. 11." s odkazem „Vyplnit dotazník".

- `dotaznik.html` zobrazil přesně 6 otázek podle `kostra/04`: srozumitelnost taháku (1–5), délka lekce (krátká/akorát/dlouhá), ochota dítěte (1–5), režim (app/papír/oboje), co chybělo (nepovinný text), přijatelnost ceny 990 Kč (ano/ne/za 790 ano).
- Po odeslání: obrazovka „Dotazník je odeslaný — Máte nárok na 790 Kč" + platební instrukce (Revolut odkaz/text z configu) — podle spec.
- V DB: `rodiny.dotaznik_vyplnen` se změnilo z `false` na **`true`**, řádek v `dotazniky` vznikl se zadanými odpověďmi.
- Po testu vráceno: řádek v `dotazniky` smazán, `dotaznik_vyplnen` vráceno na `false`.

---

## Souhrn PASS/FAIL/N/A

| # | Scénář | Výsledek |
|---|---|---|
| 1 | Registrace + 1. dítě | ⚠️ částečně (zbytek ručně Pavel) |
| 2 | Přidání 2. dítěte | ❌ FAIL (chybí UI) |
| 3 | Pokus o 3. dítě | ✅ PASS |
| 4 | Volba role, dvě zařízení | ✅ PASS |
| 5 | P1 kompletně (žák+rodič+souhrn) | ✅ PASS (nález: „null" v semaforu) |
| 6 | P2/P4 na papír | ✅ PASS |
| 7 | Přerušení a návrat do 24 h | ✅ PASS |
| 8 | 2× červená → SOS | ✅ PASS (nález: placeholder v předmětu e-mailu) |
| 9 | Zamčená lekce Fáze 1 | ✅ PASS |
| 10 | Admin | ✅ PASS |
| 11 | RLS | ✅ PASS |
| 12 | Mobil 390 px | ✅ PASS |
| 13 | Safari iOS klávesnice | ➖ N/A (ruční test Pavel) |
| 14 | Dotazník | ✅ PASS |
