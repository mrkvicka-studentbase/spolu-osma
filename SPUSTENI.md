# SPUŠTĚNÍ — oba projekty krok za krokem (pro Pavla)

Verze 2. 10. 2026. Píše vedoucí projektu. Do Supabase ani na Endoru jsem nic nezapsal, všechno děláš ty na svém PC.
Klíče (service key, heslo DB) patří jen do souboru `.env` u tebe. Do chatu ani do gitu je nedávej. Výjimka je **URL projektu a publishable (anon) klíč**, ty jsou veřejné.

| | Část A | Část B |
|---|---|---|
| Aplikace | Spolu na přijímačky (9. třída, M + ČJ pilot) | Spolu 8 (opakování 8. třídy, M + ČJ) |
| Supabase | **stávající** projekt `spolu-na-prijimacky` | **nový** projekt `spolu-osma` |
| Zdroj | `Desktop\MVP` (master, to, co je na webu) | `spolu-osma` → `Desktop\Spolu8` (nová) |
| Web | `spolu.studentbase.cz` | `osma.studentbase.cz` (návrh, nová subdoména) |
| Čas | ~10 min | ~60 min |

---

## ČÁST A — Spolu na přijímačky: do databáze se nic nedohrává

**Oprava 2. 10.:** původní část A (migrace `0007_predmet` a lekce `cj-t1…` z repa `spolu`) **NEDĚLAT**.
Ostrý web i databáze běží ze složky `Desktop\MVP`. Tam už je hotový a nasazený **pilot češtiny CJ-P1 až CJ-P4**:
- migrace 0007 v DB proběhla 1. 10.;
- lekce jsou nahrané;
- web B14–B17 je nahraný;
- Fable vše schválil (ODPOVED 1. 10.).

Repo `spolu` (linie „Čeština: základy“) má jinou migraci 0007 a jiný přehled. Jeho nahrání by přepsalo nasazenou matematiku i češtinu.

Co zbývá do pilotu 8. 10. (podle `Desktop\MVP\reporty\PRO-PAVLA.md`):
1. **B18:** z `Desktop\MVP\k-nahrani` nahraj na Endoru 2 soubory (`js/prehled.js`, `js/hlasky.js`). Předtím zkontroluj větu o pokračování češtiny, je v PRO-PAVLA u B18.
2. **SMTP + zapnout „Confirm email“** v projektu `spolu-na-prijimacky` (Authentication → SMTP Settings). Před reklamou na pilot.
3. **Tým MVP opraví** 3 nápovědy v taháku češtiny (CJ-P2, CJ-P3, CJ-P4, ODPOVED 1. 10., body 1–3) a pak připraví další balíček.
4. **Soubor `rodiny-2026-09-24.csv`** (osobní údaje) je v `Desktop\MVP` uložený v gitu:
   - vyřadit ho z gitu (`git rm --cached`) a přidat do `.gitignore`;
   - nikdy ho nenahrávat na web ani na GitHub.
5. Do 31. 10.: Revolut odkaz na 990 Kč.

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
- **Čeština:** „Hotovo: nahráno 41 lekcí“ (40 + úvodní test).
- Až nahrávky témat 3–10 dáš do `web\audio\cestina\t3` … `t10`, stačí znovu nahrát web (krok B8), lekce se znovu seedovat nemusí.

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

### B10. Nahrávky češtiny (agent přes noc)
Natáčí je agent v Coworku s Claude in Chrome a ElevenLabs. Dej mu tyto tři soubory z `cestina\Obsah\`:
- `NAHRAVKY-NAVOD.md` (návod);
- `nahravky-k-nataceni.md` (seznam s texty);
- `nahravky-k-nataceni.csv` (totéž jako tabulka).

Dál mu dej:
- **Složku stahování `hlas tutor`.**
- **Cílovou složku.** Agent v ní vytvoří `t3` … `t10` s pojmenovanými MP3, deník a zprávu.

Teď je to 45 nahrávek (16 poslechů, 29 vět diktátu). Až přibudou nové lekce, vedoucí seznam přegeneruje (`node nastroje/seznam-nahravek.mjs`) a agent pojede podle stejného návodu znovu.

Po natočení:
1. Poslechni 5 nahrávek, které agent vybere v `ZPRAVA.md`.
2. Nahrávky dostaň do projektu: buď zkopíruj složky `t3`…`t10` do `web\audio\cestina\`, nebo je pošli zazipované do chatu Spolu 8.
3. Nahraj web znovu (krok B8). Lekce se znovu seedovat nemusí.

✅ **Část B je hotová.**

---

## Před puštěním mezi lidi (obě aplikace)
- [ ] **Vlastní SMTP** v obou projektech (B6, bod 3). Bez něj veřejná registrace neprojde.
- [ ] **Registrace cizím e-mailem** (třeba Gmail) funguje a e-mail nespadne do spamu.
- [ ] **Podmínky a GDPR:** registrace odkazuje na studentbase.cz jako na „podmínky používání a zpracování osobních údajů“. Ověř, že tam takový text opravdu je.
- [ ] **Spolu 8:**
  - čeština je kompletní (40 lekcí + úvodní test), ale 45 nahrávek témat 3–10 ještě není natočených. Seznam je v `cestina/Obsah/nahravky-k-nataceni.md`. Lekce bez nahrávky dítěti ukáže hlášku místo přehrávače, poslech nebo diktát pak nejde udělat.
- [ ] **Spolu 8 — SOS konzultace za 150 Kč** je v aplikaci. Necháš ji tam?
- [ ] **Free projekty** se po 7 dnech bez provozu uspí. Při běžném provozu to nehrozí, jinak přejít na Pro (25 $/měsíc).

## Když něco nejde
Pošli mi text chyby (bez klíčů a hesel) a číslo kroku.
