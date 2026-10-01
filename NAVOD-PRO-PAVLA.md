# Návod pro Pavla — jak rozjet vývoj „Spolu na přijímačky"

Postupuj přesně po krocích. Odhad času: 30–40 minut. Vše, co se má někam vložit, je napsané doslova.

---

## KROK 1 — Nový projekt v Supabase (10 min)

1. Otevři https://supabase.com a přihlas se (stejný účet, kde máš ostatní projekty).
2. Vlevo nahoře zvol organizaci → tlačítko **New project**.
3. Vyplň:
   - **Name:** `spolu-na-prijimacky`
   - **Database Password:** klikni **Generate a password**, zkopíruj ho a ulož si ho do správce hesel (bude potřeba jen výjimečně).
   - **Region:** `Central EU (Frankfurt)`
   - Plán: **Free** (stačí na říjen; před 1. 11. přejdeme na Pro — viz krok 8).
4. **Create new project**. Počkej 1–2 minuty, než se projekt nastartuje (zelený stav).
5. V projektu vlevo dole ozubené kolo **Project Settings** → **API**. Uvidíš tři věci, které budeš potřebovat:
   - **Project URL** — vypadá jako `https://abcdefghijkl.supabase.co`
   - **anon public** klíč (dlouhý text začínající `eyJ`)
   - **service_role** klíč (také `eyJ…`, u něj je varování „secret") — klikni na oko/Reveal a zkopíruj

   Nech tuhle stránku otevřenou, hned ji použiješ.

---

## KROK 2 — Vložit klíče do složky MVP (5 min)

Složka projektu: `C:\Users\Administrátor\Desktop\MVP`

### 2a) Tajný klíč pro Opuse — soubor `.env`
1. Ve složce `MVP` je soubor `.env.example`. Zkopíruj ho (Ctrl+C, Ctrl+V) a kopii přejmenuj na přesně **`.env`** (tečka na začátku, bez `.example`).
   - Pokud Windows nedovolí název začínající tečkou: otevři soubor v Poznámkovém bloku → *Uložit jako* → do názvu napiš `".env"` **včetně uvozovek** → typ souboru *Všechny soubory*.
2. Otevři `.env` v Poznámkovém bloku a nahraď:
   - `SUPABASE_URL=` … tvoje **Project URL**
   - `SUPABASE_SERVICE_KEY=` … tvůj **service_role** klíč
3. Ulož. Tento soubor je v `.gitignore`, takže se nikdy nedostane do gitu ani na web. Nikomu ho neposílej.

### 2b) Veřejný klíč pro web — soubor `web/js/config.js`
1. Ve složce `MVP\web\js` je `config.example.js`. Zkopíruj ho a kopii přejmenuj na **`config.js`**.
2. Otevři ho a doplň:
   - `SUPABASE_URL` … tvoje **Project URL**
   - `SUPABASE_ANON_KEY` … **anon public** klíč (ten je v pořádku, může být ve webu)
   - `SOS_EMAIL` … e-mail, kam mají chodit SOS zprávy (nechal jsem `mrkvicka@studentbase.cz`, uprav, pokud chceš jiný)
   - `PLATBA_TEXT` … text s Revolut odkazem, který uvidí rodič po dotazníku (můžeš doladit později)
3. Ulož.

---

## KROK 3 — Git ve složce MVP (3 min)

1. Otevři složku `MVP` v Průzkumníku, do adresního řádku napiš `cmd` a stiskni Enter (otevře se černé okno přímo v té složce).
2. Napiš postupně (každý řádek Enter):
   ```
   git init
   git add .
   git commit -m "Kostra projektu Spolu na prijimacky"
   ```
   Když `git init` řekne „Reinitialized existing…", je to v pořádku (git už tam byl).
   Když cmd řekne, že `git` nezná: nainstaluj z https://git-scm.com/download/win (výchozí volby), zavři a otevři cmd znovu.
3. Zkontroluj, že `.env` NENÍ v gitu: napiš `git status` — nesmí se tam objevit `.env`. (Objeví-li se, napiš mi.)

---

## KROK 4 — Node.js (2 min, kontrola)

Opus bude potřebovat Node pro seed skript a testy.
1. V tom samém cmd napiš `node -v`. Pokud vypíše verzi (např. `v20.x`), máš hotovo.
2. Pokud ne: stáhni **LTS** z https://nodejs.org, nainstaluj s výchozími volbami, zavři a otevři cmd, zkus znovu.

---

## KROK 5 — Podklady pro autory obsahu (5 min, volitelné ale doporučené)

Do složky `MVP\podklady\` zkopíruj (ne přesuň):
1. Složku se Survivorem (JSON lekcí 1A–2C) → `MVP\podklady\survivor\`
2. Složku `Desktop\Magnet diagnostika` → `MVP\podklady\diagnostika\` (jen soubory `.php` a data; heslo tam nevadí, ale klidně ho z configu vymaž)
3. Pokud máš stažené CERMAT testy M9 (PDF), dej je do `MVP\podklady\cermat\`. Pokud ne, Opus si je najde sám.

Nic z toho není nutné ke spuštění; bez toho jen autor úloh začíná od nuly.

---

## KROK 6 — Spustit Opuse v Claude Code (5 min)

### Pokud Claude Code ještě nemáš
1. Nainstaluj z https://claude.com/claude-code (desktopová aplikace pro Windows) a přihlas se svým účtem.

### Spuštění
1. Otevři Claude Code → **Open folder** (nebo *Otevřít složku*) → vyber `C:\Users\Administrátor\Desktop\MVP`.
2. Dole u pole pro zprávu zvol model **Opus** (nejvyšší dostupný, ne Sonnet/Haiku). Opus si potom subagenty volí sám podle `agenti/*.md` (u rolí s poznámkou „Sonnet" použije Sonnet).
3. Otevři soubor `MVP\START-OPUS.md` v Poznámkovém bloku, označ celý text (Ctrl+A), zkopíruj (Ctrl+C) a vlož do Claude Code jako první zprávu. Odešli.
4. Claude Code se bude ptát na povolení (číst soubory, spouštět příkazy, psát soubory). Povoluj. Pokud nabídne „Allow for this project / always", zvol to — jinak budeš klikat pořád.
5. Nech ho pracovat. Nemusíš u toho sedět. Když se zastaví s otázkou, odpověz; když si nevíš rady, odpověz „Rozhodni sám, zapiš do ROZHODNUTI.md a pokračuj."

### Volitelně: Supabase přímo v Claude Code (usnadní Opusovi práci s databází)
Není nutné — Opus umí pracovat přes `.env` a Node. Pokud chceš, v Claude Code napiš:
```
/mcp
```
a přidej server Supabase podle nabídky (přihlášení proběhne v prohlížeči). Když to nepůjde na první pokus, přeskoč to.

---

## KROK 7 — Co dělat během vývoje (26.–30. 9.)

- **Jednou denně** otevři `MVP\reporty\PRO-PAVLA.md`. Odškrtni splněné (`- [x]`) a k otázkám napiš odpověď přímo pod ně. Opus to čte.
- **Nic jiného číst nemusíš.** Reporty pro mě (Cowork) čtu sám ze složky; ty mi jen napiš do tohohle Coworku „je report A/B/C", já se podívám a odpovím Opusovi souborem.
- **Design (kontrolní bod A, ~26. 9.):** Opus dá do PRO-PAVLA odkaz na `web\komponenty.html`. Otevři ho v prohlížeči (dvojklik na soubor). Když se ti něco nelíbí, napiš to do PRO-PAVLA pod ten bod — nebo si stránku vezmi do Claude Design a výsledné CSS pošli zpět (dej ho do `web\css\design-system.css` a napiš to do PRO-PAVLA).
- **Kontrolní bod C (30. 9.):** Opus napíše checklist ke spuštění. Bude tam: nahrát složku `web\` na Endoru (subdoména `spolu.studentbase.cz`), zkusit registraci, projít P1 na dvou zařízeních. Tohle uděláš ty ručně jako u webu studentbase.cz.
- **Dvě testovací rodiny** — domluv si je teď na 29.–30. 9. (rodiče osmáků), aby měly čas 1 večer.

---

## KROK 8 — Před 1. 11. (Supabase Pro)

Free projekt Supabase se po **7 dnech bez aktivity** pozastaví. V říjnu bude aktivita denně (pilot), ale pro jistotu:
- Před 1. 11. v Supabase → **Settings → Billing** → přejít na **Pro** (25 $/měsíc) — nebo si dej do kalendáře každou neděli „otevřít spolu.studentbase.cz a přihlásit se" (to projekt udrží živý). Rozhodni podle toho, kolik rodin zaplatí.

---

## Když něco nefunguje

- cmd nezná příkaz → nainstaluj (git / node) a otevři cmd znovu.
- Claude Code se ptá na klíče → jsou v `.env` a `web\js\config.js`; řekni mu, ať si je tam přečte.
- Cokoli jiného → napiš mi sem do Coworku, co se stalo, ideálně s textem chyby.
