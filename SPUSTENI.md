# SPUŠTĚNÍ — oba projekty krok za krokem (pro Pavla)

Verze 2. 10. 2026. Píše vedoucí projektu. Do Supabase ani na Endoru jsem nic nezapsal, všechno děláš ty na svém PC.
Klíče (service key, heslo DB) patří jen do souboru `.env` u tebe. Do chatu ani do gitu je nedávej. Výjimka je **URL projektu a publishable (anon) klíč**, ty jsou veřejné.

| | Část A | Část B |
|---|---|---|
| Aplikace | Spolu na přijímačky (9. třída, M + ČJ) | Spolu 8 (opakování 8. třídy, M + ČJ) |
| Supabase | **stávající** projekt `spolu-na-prijimacky` | **nový** projekt `spolu-osma` |
| Repozitář / složka | `spolu` → `Desktop\MVP` | `spolu-osma` → `Desktop\Spolu8` (nová) |
| Web | `spolu.studentbase.cz` | `osma.studentbase.cz` (návrh, nová subdoména) |
| Čas | ~30 min | ~60 min |

Části jsou na sobě nezávislé. Doporučené pořadí: nejdřív A, pak B.

---

## ČÁST A — Spolu na přijímačky: dohrát češtinu do `spolu-na-prijimacky`

Do stávajícího projektu se dohrává:
1. **migrace 0006** (režim „Dnes samo“), pokud ještě neproběhla;
2. **migrace 0007** (předměty a zámek podle předmětu);
3. **3 upravené lekce matematiky**;
4. **8 lekcí češtiny** (týdny 1–2);
5. **nový web**.

Podrobnosti a varianty jsou v repu `spolu` v `cestina/REPORT-SPUSTENI.md` §3. Tady je zkrácená cesta.

**A0. Příprava** (cmd ve složce `Desktop\MVP`):
```
git pull
npm ci
npm test
```
Má vyjít `pass 391`, `fail 0`.

**A1. Datum spuštění** = den, kdy nahraješ web. Dál jako `<DATUM>`, např. `2026-10-03`. Týden 1 češtiny se otevře ten den, týden 2 v pondělí 5. 10.

**A2. Migrace** v Supabase → projekt `spolu-na-prijimacky` → **SQL Editor**:
1. Spusť tento dotaz:
   ```sql
   select pg_get_constraintdef(oid) from pg_constraint where conname = 'sezeni_rezim_check';
   ```
2. Když výsledek **neobsahuje** `samo`: New query → vlož celý soubor `supabase\migrations\0006_rezim_samo.sql` → **Run**.
3. New query → vlož celý soubor `supabase\migrations\0007_predmet.sql` → **Run**.
4. Kontrola: tento dotaz musí vrátit 1 řádek.
   ```sql
   select proname from pg_proc where proname = 'duvod_zamceni_lekce';
   ```

(Když máš v `.env` `SUPABASE_DB_URL`, místo kroků 2–3 stačí `npm run migrovat`.)

**A3. Lekce** (cmd):
```
npm run seed
node supabase/seed/seed-lekce.mjs --adresar obsah/cestina/lekce --otevrit-od-zaklady <DATUM> --suchy-beh
node supabase/seed/seed-lekce.mjs --adresar obsah/cestina/lekce --otevrit-od-zaklady <DATUM>
```
- `npm run seed` nahraje změněné lekce matematiky.
- Suchý běh češtiny vypíše plán otevírání a „nahrálo by se 8 lekcí“.
- Ostrý běh napíše „Hotovo: nahráno 8 lekcí“.

**A4. Web — hned po A3:**
1. Dvojklik na `nasadit.bat`.
2. Na Endoru nahraj **celý obsah** složky `k-nahrani` do kořene `spolu.studentbase.cz` (66 souborů včetně složky `audio`) a přepiš staré soubory.

**A5. Zapnout češtinu dětem.** Buď to udělá rodič v přehledu tlačítkem **„Předměty“**, nebo ty v SQL Editoru pro všechny pilotní rodiny:
```sql
update public.deti d set predmety = '{matematika,cestina}'
from public.rodiny r where r.id = d.rodina_id and r.stav = 'pilot';
```

**A6. Kontrola v prohlížeči.** Přihlas se jako testovací rodina a ověř:
- nahoře jsou záložky **Matematika | Čeština**;
- v češtině je otevřený týden 1;
- týden 2 ukazuje „Otevře se 5. 10.“;
- v lekci `cj-t1-l2`, úloha 4 hraje nahrávka.

✅ **Část A je hotová.** Když se něco pokazí, postup je v `cestina/REPORT-SPUSTENI.md`, oddíl „Když se něco pokazí“ (rollback).

---

## ČÁST B — Spolu 8: nový projekt od nuly

### B1. Nový projekt Supabase (5 min)
1. supabase.com → organizace **StudentBase Spolu** → **New project**.
2. Vyplň:
   - **Name:** `spolu-osma`
   - **Database Password:** Generate, ulož si ho do správce hesel
   - **Region:** Central EU (Frankfurt), stejně jako první projekt
3. Plán Free stačí, organizace zdarma má 2 aktivní projekty. **Create new project** a počkej, až bude zelený.

### B2. Složka a kód (5 min)
V cmd na ploše:
```
git clone https://github.com/mrkvicka-studentbase/spolu-osma.git Spolu8
cd Spolu8
npm ci
npm test
```
Má vyjít `pass 1174`, `fail 0`.

### B3. Soubor `.env` (tajné, jen u tebe)
Ve složce `Spolu8` zkopíruj `.env.example` jako `.env` a doplň hodnoty z **nového** projektu:
- `SUPABASE_URL` = Project Settings → Data API → Project URL;
- `SUPABASE_SERVICE_KEY` = Project Settings → API Keys → secret key (`sb_secret_…`).

Ostatní řádky nejsou potřeba.

### B4. Soubor `web\js\config.js` (veřejné)
Otevři ho v Poznámkovém bloku a místo `DOPLNIT` vlož:
- `SUPABASE_URL` = Project URL **nového** projektu;
- `SUPABASE_ANON_KEY` = publishable klíč (`sb_publishable_…`) nebo „anon public“.

Ulož. Dokud tam je `DOPLNIT` nebo adresa přijímaček, `nasadit.bat` odmítne připravit web. Je to pojistka, aby se Spolu 8 nepřipojilo k databázi přijímaček.
(Místo toho mi můžeš poslat URL a publishable klíč, doplním to sám.)

### B5. Databáze (2 min)
Supabase → nový projekt → **SQL Editor** → New query → vlož **celý** soubor `supabase\vse-v-jednom.sql` → **Run**. Má skončit „Success“.

### B6. Přihlašování a e-maily (10 min)
V novém projektu → **Authentication**:
1. **URL Configuration:**
   - Site URL `https://osma.studentbase.cz/prehled.html`;
   - Redirect URLs: `https://osma.studentbase.cz/prehled.html` a `https://osma.studentbase.cz/nove-heslo.html`.
2. **Emails → Templates:** české texty zkopíruj ze souboru `supabase\auth-emaily.md`.
3. **SMTP Settings (důležité pro veřejnost):** vestavěné odesílání Supabase pošle jen pár e-mailů za hodinu. Při zveřejnění by se rodiče nedostali přes potvrzení registrace. Nastav vlastní SMTP, např.:
   - schránku na studentbase.cz (údaje SMTP od Endory);
   - nebo Resend.

   Stejně je potřeba nastavit i v projektu `spolu-na-prijimacky`, pokud tam ještě není.

### B7. Lekce (cmd ve složce `Spolu8`)
`<DATUM>` = den spuštění. Všechny lekce Spolu 8 se otevřou najednou.
```
npm run seed -- --otevrit-od <DATUM> --suchy-beh
npm run seed -- --otevrit-od <DATUM>
npm run seed -- --adresar obsah/cestina/lekce --otevrit-od <DATUM> --suchy-beh
npm run seed -- --adresar obsah/cestina/lekce --otevrit-od <DATUM>
```
- **Matematika:** „Hotovo: nahráno 41 lekcí“ (40 + úvodní test).
- **Čeština:** „Hotovo: nahráno 8 lekcí“ (témata 1–2). Na konci vypíše, které soubory ještě chybí, to je jen informace.
- Až budou hotová témata 3–10, spustíš stejné dva příkazy pro češtinu znovu se stejným datem.

### B8. Web na Endoru (10 min)
1. V administraci Endory založ subdoménu **`osma`** (`osma.studentbase.cz`). Když zvolíš jiný název, změň ho i v B6.
2. Ve složce `Spolu8` dvojklik na `nasadit.bat`. Vznikne `k-nahrani`.
3. Nahraj **celý obsah** složky `k-nahrani` do kořene subdomény (65 souborů včetně `audio`).

### B9. Admin a test (10 min)
1. Na `https://osma.studentbase.cz` se zaregistruj jako rodič a potvrď e-mail.
2. SQL Editor (nahraď e-mail svým):
   ```sql
   insert into public.admini (uid) select id from auth.users where lower(email) = lower('tvuj@email.cz') on conflict (uid) do nothing;
   ```
3. Na telefonu (rodič) a na počítači (dítě) ověř:
   - přehled ukazuje záložky Matematika | Čeština, úvodní test a 10 témat;
   - lekce `cj-t1-l1` projde žák → rodič → tisk;
   - lekce s nahrávkou (`cj-t1-l3`, úloha 2) hraje;
   - „Dnes samo“ funguje u jedné lekce matematiky.
4. Poslechni 4 nahrávky a porovnej je s texty v `cestina\Obsah\AUDIO.md`.

✅ **Část B je hotová.**

---

## Před puštěním mezi lidi (obě aplikace)
- [ ] **Vlastní SMTP** v obou projektech (B6, bod 3). Bez něj veřejná registrace neprojde.
- [ ] **Registrace cizím e-mailem** (třeba Gmail) funguje a e-mail nespadne do spamu.
- [ ] **Podmínky a GDPR:** registrace odkazuje na studentbase.cz jako na „podmínky používání a zpracování osobních údajů“. Ověř, že tam takový text opravdu je.
- [ ] **Spolu 8:**
  - čeština má zatím témata 1–2, tedy první dva týdny;
  - témata 3–10 dokončíme v neděli;
  - úvodní test češtiny zatím chybí, čeština jde v pořadí osnovy.
- [ ] **Spolu 8 — SOS konzultace za 150 Kč** je v aplikaci. Necháš ji tam?
- [ ] **Free projekty** se po 7 dnech bez provozu uspí. Při běžném provozu to nehrozí, jinak přejít na Pro (25 $/měsíc).

## Když něco nejde
Pošli mi text chyby (bez klíčů a hesel) a číslo kroku.
