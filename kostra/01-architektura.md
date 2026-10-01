# 01 — Architektura

## Prostředí
- Hosting: Endora.cz, subdoména `spolu.studentbase.cz`. Endora hostuje statické soubory; Pavel je nahrává ručně (FTP/správce souborů). Proto: **žádný build krok**, výstupem je složka `web/`, kterou lze nahrát jak je. Volitelný jednoduchý skript `nasadit.sh/.bat` jen kopíruje soubory.
- Backend: **nový samostatný Supabase projekt** (jen pro tento produkt). Pozor: free tier se po 7 dnech nečinnosti pozastaví — v `06-postup-vyvoje.md` je připomínka hlídat/Pro plán před 1. 12.
- Frontend mluví se Supabase přímo přes `supabase-js` (CDN, ESM). Bezpečnost řeší RLS, ne server. Žádné PHP.
- Repozitář: složka `Desktop\MVP` = git repo. Struktura:
```
MVP/
  CLAUDE.md            pokyny pro Opuse
  kostra/              tato specifikace
  agenti/              zadání subagentů
  reporty/             reporty Opuse pro zadavatele + PRO-PAVLA.md
  obsah/lekce/         JSON lekcí (zdroj pravdy pro obsah), seed skript nahrává do Supabase
  supabase/migrations/ SQL migrace
  web/                 statický web k nahrání na Endoru
    index.html, registrace.html, prehled.html, lekce.html, rodic.html, admin.html, tisk.html, dotaznik.html
    js/ (moduly), css/, assets/
  testy/               QA scénáře a automatické testy
```

## Stack (rozhodnuto)
- HTML + CSS + vanilla JS (ES moduly). Bez frameworku a bez bundleru. Rozhodnutí kvůli ručnímu nasazení a životnosti; pokud Opus zjistí, že bez frameworku je lekce po krocích neudržitelná, může použít Preact/htm přes CDN (stále bez buildu) a zapsat to do reportu.
- Matematika v zadání: KaTeX přes CDN (rychlejší než MathJax). Zadání úloh se píše v Markdownu s `$...$`.
- Vstup výrazů: **nepoužíváme MathLive** v pilotu. Vstupy jsou: dlaždice (výběr), číslo (s jednotkou), šablona zlomku (čitatel/jmenovatel, dvě pole), smíšené číslo (celá část + zlomek), krátký text. Vlastní matematická klávesnice na tabletu: číslice, `+ − · : ( ) , x x² √` + tlačítko „zlomek" (přepne do šablony). Vyhodnocení: normalizace čísel (desetinná čárka i tečka), zlomky porovnávat jako racionální čísla + kontrola základního tvaru (varování „správně, ale zkrať").
- PDF: `tisk.html` s `@media print` CSS → rodič dá „Uložit jako PDF" / tisk. Žádná serverová generace PDF.
- E-mail SOS: `mailto:` s předvyplněným předmětem a tělem (téma, jméno dítěte, lekce). Žádná odesílací služba.

## Účty a role
- Účet = rodina = jeden `auth.users` (e-mail + heslo). Po přihlášení má rodina 1–2 profily dětí.
- Role zařízení: po přihlášení volba „Jsem rodič" / „Jsem žák" (uloženo v `localStorage`, přepnutelné v menu). Stejný účet, jiné obrazovky. Rodičovská role je na telefonu, žákovská na velké obrazovce; technicky obě fungují kdekoli.
- Admin: tabulka `admini` (uid). Admin obrazovka je jen skrytá stránka + RLS; nic víc.
- Stav rodiny: `pilot` (po registraci, přístup k pilotním lekcím), `aktivni` (Pavel odemkl po platbě), `uzavreny` (od 1. 5. hromadně). Odemknutí faze1/faze2 je časové (datum otevření) + stav `aktivni`.

## Průběh lekce (bez synchronizace)
1. Kdokoli otevře „Začít lekci" → vznikne `sezeni` (dítě, lekce, režim app/papír, začátek). Pokud existuje nedokončené sezení stejné lekce mladší než 24 h, pokračuje se v něm.
2. Žák (režim app) prochází úlohy a kroky; každá odpověď se hned uloží (`odpovedi`). Rodič na telefonu vidí tahák; po každé úloze klikne semaforovou volbu.
3. Rodič (režim papír) má na telefonu u každé úlohy navíc pole „Výsledek dítěte" — zapíše, aplikace vyhodnotí, pak semaforová volba.
4. Semafor: barva = kombinace správnosti (automaticky) a volby rodiče (viz `03-format-obsahu.md`). Uloží se k úloze.
5. Konec lekce: souhrn 4 semaforů + doporučení na zítra. Sezení `dokonceno`.
6. Rodičův telefon se **obnovením stránky** dozví, co žák odevzdal (jednoduché tlačítko „Obnovit" + auto-refresh každých 30 s při otevřené lekci — to je polling, ne real-time; stačí).

## Přístup k obsahu
- Lekce jsou v tabulce `lekce` (jsonb). RLS: pilotní lekce čitelné každým přihlášeným; Fáze 1/2 jen když `rodiny.stav='aktivni'` a `now() >= lekce.otevrit_od`.
- Zdroj pravdy obsahu jsou JSON soubory v `obsah/lekce/`; skript `seed` je nahraje/aktualizuje (upsert podle `id`).

## Uzavření sezóny
- 1. 5. 2027: skript nastaví všem `stav='uzavreny'`. Přihlášení funguje, obsah není čitelný (RLS), zobrazí se stránka s poděkováním a odkazem na studentbase.cz + kontakt.

## Bezpečnost minimum
- RLS na všech tabulkách; rodina vidí jen své řádky; admin vše.
- Žádné klíče v repu kromě veřejného anon key (ten je v pořádku).
- Dvě děti: max 2 profily na rodinu (constraint). Další zámky (jedno sezení najednou) připravit v modelu, nezapínat.
