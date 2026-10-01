# Design systém — Spolu na přijímačky

Soubory: `css/design-system.css` (vše), `css/tisk.css` (jen `tisk.html`), živá ukázka `komponenty.html` (otevře se dvojklikem).
Pravidla pojmenování: `reporty/ROZHODNUTI.md` R1 — česky bez diakritiky, `blok__cast`, `blok--varianta`, stavy `.je-*`.

## Jak systém použít

Hlavička každé stránky:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/design-system.css">
<!-- jen tisk.html navíc: -->
<link rel="stylesheet" href="css/tisk.css">
```

Zásady (dodržuj i v nových obrazovkách):
- **Barvy jen přes proměnné** (`var(--barva-…)`), žádné hex kódy v komponentách stránek.
- **Na zelené ploše vždy navy text.** Bílý text na #1FC27E nesplní AA (2,3 : 1).
- **Dítě nikdy nevidí červenou.** Když krok nesedí, použij `.je-nesedi` / `.zpetna-vazba--nesedi` (šedomodrá) a text „Zkus to ještě jednou". Červená jen v semaforu rodiče a v adminu.
- **Chyby formulářů a systémové chyby jsou oranžové** (`.pole-chyba`, `.hlaska--varovani`) s ikonou, ne červené.
- **Barva nikdy sama**: semafor vždy ikona + slovo („Zelená", „Oranžová", „Červená").
- **Rodič**: hlavní akce do `.spodni-lista`, dotykové plochy ≥ 44 px (`.tlacitko` to splňuje samo), text ≥ 16 px.
- **Rozložení bez media queries**: mřížky (`.mrizka-karet`, `.dlazdice-mrizka`, `.lekce-zak`, `.volby-karet`) se samy přizpůsobí šířce. Jediná media query je v modalu (spodní panel na telefonu).
- **Stavy přepínej třídami / atributy**, ne inline stylem: `.je-vybrano`, `.je-spravne`, `.je-nesedi`, `.je-vyprselo`, `.je-nacitani`, `aria-pressed="true"`, `hidden`.
- Ikony: inline SVG `<svg class="ikona" viewBox="0 0 24 24" aria-hidden="true">…cesty…</svg>` — styl (tah, barva `currentColor`) dodá CSS. Cesty v tabulce „Ikony" níže. V `ui.js` doporučuji `ikona('fajfka')`, která vrátí SVG z objektu `IKONY`.
- **Dva motivy (R26)**: světlý a tmavý, přepíná je `data-motiv` na `<html>`. V komponentách proto nikdy `--barva-navy` pro text nebo rámeček — použij sémantické `--barva-silna`, `--barva-inverzni` / `--barva-na-inverzni`, `--barva-hlavicka`, `--barva-na-zelene` (viz „Motivy").
- **Zelený akcent ≠ semafor**: akcent (`--barva-akcent*`) = linky, prstence s číslem, jemné podklady, ikony nadpisů. Semaforová zelená = **plné** kolečko s fajfkou + slovo „Zelená". Plné zelené kolečko s fajfkou nikdy jako ozdobu.

## Co může Pavel ladit (`:root` v `css/design-system.css`)

| Proměnná | Hodnota | K čemu |
|---|---|---|
| `--barva-navy` | `#0F172A` | tmavé plochy, nadpisy, text. **K potvrzení** — převzato ze studentbase.cz (Tailwind `slate-900`, `surface-dark`), zadání navrhovalo #0B1F3A |
| `--barva-navy-2` | `#1E293B` | druhá tmavá (studentbase.cz) |
| `--barva-zelena` | `#1FC27E` | hlavní tlačítka, „zelená" semaforu (plocha). Pozn.: studentbase.cz dnes používá #10B981 |
| `--barva-zelena-text` | `#0B7A4B` | zelený text a ikony |
| `--barva-oranzova` / `-text` | `#F5A623` / `#8A5300` | semafor, chyby formulářů |
| `--barva-cervena` / `-text` | `#E5484D` / `#B42318` | jen semafor |
| `--barva-nesedi-*` | `#3E5170` / `#EEF2F7` | „nesedí" u dítěte |
| `--barva-pozadi` | `#F8FAFC` | pozadí stránky |
| `--barva-zvyrazneni` | `#F5C518` | žluté podtržení v zadání |
| `--pismo-rodina` | Sora | písmo (studentbase.cz dnes používá Inter) |
| `--pismo-zadani` | `1.5rem` | velikost zadání u žáka |
| `--pismo-stredni` | `1.125rem` | text taháku rodiče |
| `--polomer-l` | `1rem` | zaoblení karet (jako studentbase.cz) |
| `--mezera-1…8` | 4–64 px | mezery |
| `--stin-1…3` | | stíny |
| `--dotyk-min` / `--dotyk-velky` | 44 / 56 px | min. dotyková plocha / hlavní akce |
| `--barva-akcent` / `-text` / `-plocha` / `-linka` | `#1FC27E` / `#0B7A4B` / `#F0FAF5` / `#BFEBD6` | zelený akcent (D2): linka hlavičky, průběh, aktivní krok, prstence čísel, podklady sekcí |
| `--pismo-katex` | `1.08em` | velikost vzorců (KaTeX) vůči textu; v dlaždici 1.15em, display vzorec v zadání 1.25em |

Tmavé hodnoty stejných proměnných jsou v bloku `:root[data-motiv="tmavy"]` hned pod `:root` — ladí se tam.

Každá barva semaforu má tři varianty: bez přípony = plocha/grafika, `-text` = text a ikony (≥ 4,5 : 1), `-plocha` = světlé pozadí, `-obrys` = rámeček (≥ 3 : 1).
V `tisk.css`: `--tisk-vypocet` (4 cm), `--tisk-vypocet-velky` (8 cm), `--tisk-pismo`.

---

## Motivy: světlý / tmavý (R26)

**Jak to funguje**
- Každá stránka (kromě `tisk.html`) má v `<head>` **před CSS** malý inline skript (bez bliknutí). Čte `localStorage` `spolu.motiv` = `svetly` | `tmavy` | `auto` (výchozí `auto` = podle `prefers-color-scheme`, sleduje i změnu v systému) a nastaví `<html data-motiv="svetly|tmavy" data-motiv-volba="…">`. Novou stránku založ zkopírováním bloku `<!-- Motiv (R26) … -->` z `prehled.html`.
- Skript vystaví `window.spoluMotiv = { volba(), nastav(v), pouzij() }` a obsluhuje klik na **jakékoli** tlačítko s `data-motiv-nastav="svetly|tmavy|auto"` (delegace) — přepínač tedy nepotřebuje vlastní JS.
- Přepínač: v menu přihlášených stránek (`prepinacMotivu()` v `js/menu.js`), na stránkách bez menu (`index` v kontaktu, `registrace`, `nove-heslo`, `uzavreno`, `admin`) v patičce `.paticka-stranky`.
- Tmavá sada platí jen pro `@media screen` → **tisk je vždy světlý**; `tisk.html` motiv nenastavuje a `.tisk-list` si světlé hodnoty vynutí i v náhledu uvnitř tmavé stránky.

```html
<div class="prepinac prepinac--motiv" role="group" aria-label="Vzhled">
  <button class="prepinac__volba" type="button" data-motiv-nastav="svetly" aria-pressed="false">Světlý</button>
  <button class="prepinac__volba" type="button" data-motiv-nastav="tmavy" aria-pressed="false">Tmavý</button>
  <button class="prepinac__volba" type="button" data-motiv-nastav="auto" aria-pressed="true">Podle zařízení</button>
</div>
<!-- na stránce bez menu: -->
<footer class="paticka-stranky"><div class="paticka-motiv"><span>Vzhled:</span> …přepínač… </div></footer>
```

**Sémantické proměnné (světlý → tmavý)**

| Proměnná | Světlý | Tmavý | K čemu |
|---|---|---|---|
| `--barva-silna` | `#0F172A` | `#E6EDF7` | silné popředí: rámeček vybraného, sekundární tlačítko, nadpisy taháku, čára zlomku |
| `--barva-inverzni` / `--barva-na-inverzni` | `#0F172A` / bílá | `#E6EDF7` / `#0B1220` | plná „opačná" plocha: `.tlacitko--navy`, vybraná volba, `.stitek--tmavy`, `.otazka__k` |
| `--barva-hlavicka` | `#0F172A` | `#060A14` | hlavička a patička — tmavá v obou motivech, text `--barva-text-na-tmave` |
| `--barva-na-zelene` | `#0F172A` | `#0F172A` | text/ikona na zelené, oranžové i červené ploše (v obou motivech tmavý) |
| `--barva-pozadi` / `--barva-povrch` / `--barva-povrch-2` | `#F8FAFC` / bílá / `#F1F5F9` | `#0B1220` / `#111A2E` / `#18233A` | stránka / karty / zamčené, pruhy |
| `--barva-text` / `--barva-text-tlumeny` | `#0F172A` / `#475569` | `#E6EDF7` / `#A3B1C6` | text |
| `--barva-zelena-text`, `--barva-akcent-text` | `#0B7A4B` | `#4ADE9B` | zelený text, čísla v prstenci |
| `--barva-oranzova-text` / `--barva-cervena-text` | `#8A5300` / `#B42318` | `#FBBF5A` / `#FF9195` | text semaforu |
| `--barva-toast`, `--barva-lista`, `--barva-placeholder`, `--barva-fokus` | | | toast, spodní lišta rodiče, placeholder, prstenec fokusu |

Zelená `#1FC27E`, oranžová `#F5A623` a červená `#E5484D` (plochy semaforu a tlačítek) se v tmavém motivu nemění.

**Kontrast (ověřeno výpočtem WCAG 2.1, 64 dvojic v každém motivu)**: tmavý motiv — všechny dvojice text/plocha ≥ 4,5 : 1 (minimum 5,9 : 1 u tlumeného textu na semaforových plochách), rámečky polí a grafika ≥ 3 : 1 (minimum 4,1 : 1). Světlý — text vše AA; zelená a oranžová výplň na bílé mají < 3 : 1, proto mají semaforové znaky i úseky admin grafu tmavší obrys (`-obrys`) a vždy slovo. KaTeX dědí barvu textu (`currentColor`), čáry zlomků a odmocnin taky — v tmavém je čitelný bez úprav.

## Komponenty a HTML vzory

### Rozložení a utility
`.obal` (šířka 1200 px, okraje 16 px), `.obal--uzky` (32 rem), `.zasobnik` (+ `--tesny`, `--volny`; svislá mezera), `.radek` (+ `--mezi`, `--konec`, `--nezalamovat`), `.mrizka-karet`, `.text-tlumeny`, `.text-stred`, `.nadpis-sekce`, `.jen-ctecka`, `.jen-obrazovka`, `.jen-tisk`.

Stránka rodiče (telefon) a žáka (PC):
```html
<body>
  <div class="stranka-rodic">
    <div class="lista-lekce">…</div>
    <main class="stranka-rodic__obsah">…</main>
    <div class="spodni-lista">…</div>
  </div>
  <div class="toasty" aria-live="polite"></div>
</body>

<main class="stranka-zak">
  <div class="lekce-zak">  <!-- 2 sloupce na PC: zadání | kroky -->
    <article class="karta-ulohy">…</article>
    <div class="zasobnik">…kroky…</div>
  </div>
</main>
```

### Hlavička
```html
<header class="hlavicka">
  <div class="hlavicka__vnitrek">
    <a class="logo" href="prehled.html"><span class="logo__znacka">Student<span>Base</span></span><span class="logo__produkt">Spolu na přijímačky</span></a>
    <button class="tlacitko tlacitko--na-tmave tlacitko--ikona" aria-label="Menu"><svg class="ikona" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  </div>
</header>
```

### Tlačítka `.tlacitko`
Varianty: `--primarni` (zelená, hlavní akce), `--navy`, `--sekundarni` (obrys), `--tiche` (bez rámečku), `--na-tmave` (v hlavičce). Velikosti: `--velke` (56 px), `--male` (jen admin), `--cela-sirka`, `--ikona` (čtverec 44 px, **vždy `aria-label`**). Stav: `disabled`, `.je-nacitani`.
```html
<button class="tlacitko tlacitko--primarni tlacitko--velke">Začít lekci</button>
<button class="tlacitko tlacitko--primarni je-nacitani"><span class="tocitko" aria-hidden="true"></span> Ukládám…</button>
<button class="tlacitko tlacitko--sekundarni tlacitko--ikona" aria-label="Obnovit"><svg class="ikona" …/></button>
```

### Štítek `.stitek`
Varianty: (výchozí šedý), `--navy`, `--zelena`, `--oranzova`, `--cervena`, `--tmavy`.
```html
<span class="stitek stitek--navy">Probíhá · 2/4</span>
<span class="stitek stitek--zelena"><svg class="ikona" …fajfka/>Hotovo</span>
```

### Semafor znak `.semafor-znak`
Barvy `--zelena` (ikona fajfka), `--oranzova` (ikona opakovat), `--cervena` (ikona stop, přidej `ikona--plna`), `--zadna` (ještě bez barvy). Velikost `--mala`, `--velka`. Když vedle není slovo s barvou, dej `role="img" aria-label="Zelená"`.
```html
<span class="semafor-znak semafor-znak--oranzova" role="img" aria-label="Oranžová"><svg class="ikona" …opakovat/></span>
<div class="semafor-tecky" role="img" aria-label="Úlohy: zelená, oranžová, zelená, zelená">
  <span class="semafor-znak semafor-znak--mala semafor-znak--zelena"><svg class="ikona" aria-hidden="true" …/></span> …
</div>
```

### Průběh 1/4 `.prubeh`
```html
<div class="prubeh">
  <span>Úloha 2/4</span>
  <ol class="prubeh__kroky" aria-hidden="true">
    <li class="prubeh__krok je-hotovo"></li><li class="prubeh__krok je-aktualni"></li><li class="prubeh__krok"></li><li class="prubeh__krok"></li>
  </ol>
</div>
```

### Pruh (týdenní postup) `.pruh`
```html
<div class="pruh" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow="1" aria-label="Hotovo 1 ze 4 lekcí"><span class="pruh__vypln" style="width:25%"></span></div>
```

### Odpočet `.odpocet`
Po vypršení přidej `.je-vyprselo`, text změň na „Čas vypršel" a pod lištu vlož `.hlaska--info` „Doporučený čas vypršel — můžete dokončit nebo zavřít." Žádný zvuk, blikání ani červená.
```html
<div class="odpocet" role="timer" aria-label="Zbývá 14 minut"><svg class="ikona" …hodiny/><span class="odpocet__cas">14:32</span></div>
```
(`aria-label` aktualizuj jen po minutách, ne každou sekundu.)

### Horní lišta lekce `.lista-lekce`
```html
<div class="lista-lekce">
  <div class="lista-lekce__tema">Pořadí operací<span class="lista-lekce__podtitul">Lekce 1 · CERMAT úloha</span></div>
  <div class="lista-lekce__stav"> …odpocet… …prubeh… </div>
</div>
```

### Spodní lišta (rodič) `.spodni-lista`
Sticky dole, tlačítka se roztáhnou; ikonová tlačítka zůstanou čtvercová.
```html
<div class="spodni-lista">
  <button class="tlacitko tlacitko--sekundarni tlacitko--ikona" aria-label="Předchozí úloha"><svg class="ikona" …sipka-vlevo/></button>
  <button class="tlacitko tlacitko--primarni">Další úloha <svg class="ikona" …sipka-vpravo/></button>
</div>
```

### Přepínač (dítě A/B) `.prepinac`
```html
<div class="prepinac" role="group" aria-label="Dítě">
  <button class="prepinac__volba" aria-pressed="true">Eliška</button>
  <button class="prepinac__volba" aria-pressed="false">Tomáš</button>
</div>
```

### Přepínač úloh u rodiče `.prepinac-uloh`
```html
<nav class="prepinac-uloh" aria-label="Úlohy">
  <button class="tlacitko tlacitko--sekundarni tlacitko--ikona" aria-label="Předchozí úloha">…</button>
  <div class="prepinac-uloh__nazev"><strong>Úloha 3 ze 4</strong><span>CERMAT úloha</span></div>
  <button class="tlacitko tlacitko--sekundarni tlacitko--ikona" aria-label="Další úloha">…</button>
</nav>
```

### Karta (obecná) `.karta`
`--tesna`, `--zvyraznena`, `--tmava`.

### Týdenní přehled — hlavička `.prehled-hlavicka`
```html
<div class="prehled-hlavicka">
  <p class="nadpis-sekce">Pilot · týden 1</p>
  <h1>Eliščin týden</h1>
  <div class="prehled-hlavicka__tyden"><span>Tento týden: 4 lekce, hotovo 1</span> …pruh… </div>
</div>
```

### Karta lekce `.karta-lekce`
Stavy: `--nezacato`, `--probiha`, `--hotovo`, `--zamceno`. Mřížka `.mrizka-karet`.
```html
<div class="mrizka-karet">
  <!-- nezačato -->
  <article class="karta-lekce karta-lekce--nezacato">
    <div class="karta-lekce__hlavicka"><span class="karta-lekce__poradi">Lekce 3</span><span class="stitek">Nezačato</span></div>
    <h2 class="karta-lekce__tema">Zlomky</h2>
    <div class="karta-lekce__meta"><span><svg class="ikona" …hodiny/>20 min</span><span>4 úlohy</span></div>
    <div class="karta-lekce__akce">
      <button class="tlacitko tlacitko--primarni tlacitko--velke">Začít lekci</button>
      <a class="tlacitko tlacitko--tiche" href="mailto:…"><svg class="ikona" …sos/>SOS</a>  <!-- jen rodič -->
    </div>
  </article>
  <!-- probíhá: stitek--navy „Probíhá · 2/4", tlačítko „Pokračovat" -->
  <article class="karta-lekce karta-lekce--probiha">…</article>
  <!-- hotovo: stitek--zelena „Hotovo" + výsledek -->
  <article class="karta-lekce karta-lekce--hotovo">
    …hlavicka, tema…
    <div class="karta-lekce__vysledek"><span class="semafor-znak semafor-znak--zelena" aria-hidden="true">…fajfka…</span><span><strong>Zelená</strong> — zvládnuto</span></div>
    <div class="karta-lekce__akce"><button class="tlacitko tlacitko--tiche">Zobrazit souhrn</button></div>
  </article>
  <!-- zamčeno: bez tlačítka -->
  <article class="karta-lekce karta-lekce--zamceno" aria-disabled="true">
    <div class="karta-lekce__hlavicka"><span class="karta-lekce__poradi">Týden 2 · Lekce 1</span><span class="stitek"><svg class="ikona" …zamek/>Zamčeno</span></div>
    <h2 class="karta-lekce__tema">Desetinná čísla</h2>
    <p class="karta-lekce__zamek"><svg class="ikona" …zamek/>Otevře se 1. 12.</p>
    <!-- nebo: Odemkne se po platbě — 790 Kč v předprodeji -->
  </article>
</div>
```

### Volební karty (volba role, režim) `.volby-karet` + `.volba-karta`
```html
<div class="volby-karet">
  <button class="volba-karta">
    <span class="ikona-kruh"><svg class="ikona" …telefon/></span>
    <span class="volba-karta__nazev">Jsem rodič</span>
    <span class="volba-karta__popis">Mám telefon s tahákem.</span>
  </button>
  …
</div>
```
Vybraná: `.je-vybrano` nebo `aria-pressed="true"`.

### Modal `<dialog class="modal">`
Otevřít `dialog.showModal()`, zavřít `dialog.close()` (Esc funguje sám). Na telefonu vyjede zespodu.
```html
<dialog class="modal" id="modalRezim" aria-labelledby="modalRezimNadpis">
  <div class="modal__panel">
    <h2 class="modal__nadpis" id="modalRezimNadpis">Jak dnes budete pracovat?</h2>
    <button class="tlacitko tlacitko--tiche tlacitko--ikona modal__zavrit" aria-label="Zavřít">…krizek…</button>
    <div class="volby-karet">
      <button class="volba-karta" data-rezim="app"><span class="ikona-kruh">…obrazovka…</span><span class="volba-karta__nazev">V aplikaci</span><span class="volba-karta__popis">Dítě řeší na počítači nebo tabletu.</span></button>
      <button class="volba-karta" data-rezim="papir"><span class="ikona-kruh">…tiskarna…</span><span class="volba-karta__nazev">Na papír</span><span class="volba-karta__popis">Vytisknete úlohy, výsledky zadáte vy.</span></button>
    </div>
    <!-- volitelně: <div class="modal__akce">…tlačítka…</div> -->
  </div>
</dialog>
```

### Žák — karta úlohy `.karta-ulohy`
```html
<article class="karta-ulohy">
  <div class="karta-ulohy__hlavicka"><span class="stitek stitek--navy">Úloha 3</span><span class="stitek">CERMAT</span></div>
  <div class="karta-ulohy__zadani">…Markdown + KaTeX…</div>
  <p class="karta-ulohy__napoveda">Klikni na slovo nebo číslo a podtrhni si ho.</p>
</article>
```
Zvýraznění: obal slovo/číslo do `<span class="zvyraznitelne">…</span>`, po kliknutí přepni `.je-zvyrazneno`.

### Žák — krok `.krok`
```html
<section class="krok" aria-labelledby="k2-popisek">
  <span class="krok__cislo">Krok 2</span>
  <h3 class="krok__popisek" id="k2-popisek">Vyber, co platí</h3>
  <!-- vstup: dlaždice NEBO .krok__vstup s poli -->
  <div class="zpetna-vazba" role="status" hidden></div>
  <div class="krok__akce"><button class="tlacitko tlacitko--primarni tlacitko--velke">Odevzdat krok</button></div>
</section>
```
Hotový krok: `.krok--hotovy`.

### Dlaždice `.dlazdice`
Stavy: klid / `.je-vybrano` + `aria-pressed="true"` / `.je-spravne` / `.je-nesedi`. Po vyhodnocení dej dlaždicím `disabled`. Varianta `.dlazdice--radek` pro řádky výpočtu (detektiv).
```html
<div class="dlazdice-mrizka">
  <button class="dlazdice" aria-pressed="false" data-id="a">$3ab$
    <span class="dlazdice__znak dlazdice__znak--spravne"><svg class="ikona" aria-hidden="true" …fajfka/></span>
    <span class="dlazdice__znak dlazdice__znak--nesedi"><svg class="ikona" aria-hidden="true" …opakovat/></span>
  </button>
  …
</div>
```
(Znaky jsou skryté, ukáže se ten, který odpovídá stavu.)

### Zpětná vazba žákovi `.zpetna-vazba`
`--spravne` (zelená, fajfka), `--nesedi` (šedomodrá, ikona opakovat), `--poznamka` (navy; např. „Výsledek je správně, ale uprav ho do základního tvaru").
```html
<div class="zpetna-vazba zpetna-vazba--nesedi" role="status"><svg class="ikona" …opakovat/><span>Zkus to ještě jednou.</span></div>
```

### Číslo (s jednotkou) `.pole--cislo` / `.pole-cislo`
```html
<input class="pole pole--cislo" inputmode="decimal" autocomplete="off" aria-labelledby="k2-popisek">
<div class="pole-cislo">
  <input class="pole pole--cislo" inputmode="decimal" autocomplete="off" aria-labelledby="k2-popisek">
  <span class="pole-cislo__jednotka">cm</span>
</div>
```
Stav po vyhodnocení: `.je-spravne` / `.je-nesedi` na `.pole` nebo na obalu (`.pole-cislo`, `.zlomek-vstup`).

### Zlomek `.zlomek-vstup` a smíšené číslo `.smisene-vstup`
```html
<div class="zlomek-vstup" role="group" aria-label="Zlomek">
  <input class="pole pole--cislo" inputmode="numeric" aria-label="Čitatel">
  <span class="zlomek-vstup__cara" aria-hidden="true"></span>
  <input class="pole pole--cislo" inputmode="numeric" aria-label="Jmenovatel">
</div>

<div class="smisene-vstup" role="group" aria-label="Smíšené číslo">
  <input class="pole pole--cislo smisene-vstup__cela" inputmode="numeric" aria-label="Celá část">
  <div class="zlomek-vstup"> …čitatel, čára, jmenovatel… </div>
</div>
```

### Matematická klávesnice `.klavesnice`
Zobrazit jen na dotykovém zařízení (`matchMedia('(pointer: coarse)')`). Pole, do kterých píše, mají `inputmode="none"`, aby nevyjela systémová klávesnice (na PC ponechat `decimal`).
```html
<div class="klavesnice" role="group" aria-label="Matematická klávesnice">
  <button class="klavesnice__klavesa" data-znak="7">7</button> 8 9
  <button class="klavesnice__klavesa klavesnice__klavesa--operator" data-znak="(" aria-label="levá závorka">(</button> )
  4 5 6 · (aria-label „krát") : („děleno")
  1 2 3 + („plus") − („minus")
  0 , („desetinná čárka") x  <span>x<sup>2</sup></span> („na druhou")  √ („odmocnina")
  <button class="klavesnice__klavesa klavesnice__klavesa--funkce klavesnice__klavesa--siroka" data-akce="zlomek">a/b&nbsp;Zlomek</button>
  <button class="klavesnice__klavesa klavesnice__klavesa--smazat" data-akce="smazat">Smazat</button>
  <button class="klavesnice__klavesa klavesnice__klavesa--hotovo klavesnice__klavesa--siroka" data-akce="hotovo">Hotovo</button>
</div>
```
Mřížka 5 sloupců; pořadí přesně jako v `komponenty.html`. Operátory mají třídu `--operator`.

### Konec lekce u žáka `.konec-lekce`
```html
<div class="karta konec-lekce">
  <span class="ikona-kruh ikona-kruh--zelena">…fajfka…</span>
  <h2>Hotovo, ukaž telefon rodiči</h2>
  <p class="text-tlumeny">Souhrn dnešní lekce udělá rodič.</p>
</div>
```

### Rodič — stav žáka `.stav-zaka`
```html
<div class="stav-zaka" role="status">
  <svg class="ikona ikona--velka stav-zaka__fajfka" …fajfka/>
  <div class="stav-zaka__text"><strong>Dítě odevzdalo: krok 2</strong><small>Aktualizováno před 12 s</small></div>
  <button class="tlacitko tlacitko--tiche tlacitko--ikona" aria-label="Obnovit stav dítěte">…obnovit…</button>
</div>
```

### Rodič — tahák `.tahak`
```html
<div class="tahak">
  <!-- jen u 1. úlohy -->
  <section class="tahak__sekce tahak__sekce--uvod"><h2 class="tahak__nadpis">…info… Než začnete</h2><p>uvod_pro_rodice</p></section>

  <section class="tahak__sekce"><h2 class="tahak__nadpis">…zarovka… O co jde</h2><p>tahak.vysvetleni</p></section>

  <section class="tahak__sekce">
    <h2 class="tahak__nadpis">…bublina… Otázky pro dítě</h2>
    <ol class="otazky">
      <li class="otazka"><span class="otazka__uroven">Otázka 1 · vlastními slovy</span><p class="otazka__text">„…"</p></li>
      <li class="otazka" hidden><span class="otazka__uroven">Otázka 2 · první krok</span><p class="otazka__text">„…"</p></li>
      <li class="otazka" hidden><span class="otazka__uroven">Otázka 3 · mezikrok</span><p class="otazka__text">„…"</p></li>
    </ol>
    <button class="tlacitko tlacitko--sekundarni tlacitko--cela-sirka">Další otázka</button>
    <!-- po odkrytí poslední: disabled + text „To jsou všechny otázky"; nově odkrytá .otazka dostane .je-nova (jemné objevení) -->
  </section>

  <details class="rozbalovaci">
    <summary><svg class="ikona" …otocit/>Otočená role<svg class="ikona rozbalovaci__sipka" …dolu/></summary>
    <div class="rozbalovaci__obsah"><p>tahak.otocena_role</p></div>
  </details>
  <details class="rozbalovaci"> …pozor… Typická chyba … </details>
  <details class="rozbalovaci rozbalovaci--reseni">
    <summary><svg class="ikona" …oko/>Ukázat řešení<svg class="ikona rozbalovaci__sipka" …dolu/></summary>
    <div class="rozbalovaci__obsah"><ol class="postup"><li>…</li></ol></div>
  </details>
</div>
```
Režim papír: sekce `.tahak__sekce` „Výsledek dítěte" se stejným vstupem jako `final` (viz `komponenty.html`).

### Rodič — semafor `.semafor-volby` + `.semafor-vysledek`
```html
<div class="semafor-volby">
  <button class="semafor-volba" aria-pressed="false" data-volba="sam"><svg class="ikona" …fajfka/>Vyřešil(a) sám/sama<svg class="ikona semafor-volba__zaskrt" …fajfka/></button>
  <button class="semafor-volba" aria-pressed="false" data-volba="otazka"><svg class="ikona" …bublina/>Potřeboval(a) otázku<svg class="ikona semafor-volba__zaskrt" …/></button>
  <button class="semafor-volba" aria-pressed="false" data-volba="pocitani"><svg class="ikona" …kalkulacka/>Spletl(a) se<svg class="ikona semafor-volba__zaskrt" …/></button>
  <button class="semafor-volba" aria-pressed="false" data-volba="nevedel"><svg class="ikona" …stop/>Nevěděl(a), jak začít<svg class="ikona semafor-volba__zaskrt" …/></button>
</div>

<div class="semafor-vysledek semafor-vysledek--oranzova" role="status">
  <div class="semafor-vysledek__barva"><span class="semafor-znak semafor-znak--oranzova" aria-hidden="true">…opakovat…</span>Oranžová</div>
  <p class="semafor-vysledek__doporuceni">semafor.oranzova z JSON</p>
  <p class="semafor-vysledek__zmena">Volbu můžete změnit.</p>
</div>
```
(Hodnoty `data-volba` jsou jen ilustrační — použij klíče z datového modelu.)

### Rodič — souhrn lekce `.souhrn`
Úlohy 1–3 malé v řadě, 4. (semafor) jako hlavní přes celou šířku.
```html
<div class="souhrn">
  <ol class="souhrn__ulohy">
    <li class="souhrn__uloha"><span class="semafor-znak semafor-znak--zelena" aria-hidden="true">…</span><span class="souhrn__uloha-nazev">Rozcvička</span><span class="souhrn__uloha-barva">Zelená</span></li>
    … Detektiv, CERMAT …
    <li class="souhrn__uloha souhrn__uloha--hlavni">
      <span class="semafor-znak semafor-znak--velka semafor-znak--oranzova" aria-hidden="true">…</span>
      <span><span class="souhrn__stitek-hlavni">Hlavní barva lekce</span><span class="souhrn__uloha-nazev">Samostatná úloha</span><span class="souhrn__uloha-barva" style="display:block">Oranžová</span></span>
    </li>
  </ol>
  <div class="semafor-vysledek semafor-vysledek--oranzova"> …„Na zítra" + doporučení… </div>
  <!-- 2. červená v řadě: .hlaska--info s ikonou sos a tlačítkem mailto -->
</div>
```

### Formuláře `.formular`
```html
<form class="formular" novalidate>
  <fieldset class="formular__sekce">
    <legend class="formular__nadpis-sekce">Vy</legend>
    <div class="pole-skupina">
      <label class="pole-popisek" for="email">E-mail</label>
      <input class="pole" id="email" type="email" autocomplete="email" aria-describedby="email-chyba" aria-invalid="true">
      <p class="pole-chyba" id="email-chyba"><svg class="ikona" …pozor/>Zkontrolujte prosím e-mail.</p>
    </div>
    <div class="pole-skupina">
      <label class="pole-popisek" for="heslo">Heslo</label>
      <input class="pole" id="heslo" type="password" autocomplete="new-password" aria-describedby="heslo-nap">
      <p class="pole-napoveda" id="heslo-nap">Alespoň 8 znaků.</p>
    </div>
  </fieldset>

  <fieldset class="volby">                       <!-- 2 volby vedle sebe -->
    <legend>Na jakou školu se hlásí?</legend>
    <label class="volba"><input class="volba__vstup" type="radio" name="typ_skoly" value="gymnazium"><span class="volba__obsah">Gymnázium</span></label>
    <label class="volba"><input class="volba__vstup" type="radio" name="typ_skoly" value="ss_maturita"><span class="volba__obsah">SŠ s maturitou</span></label>
  </fieldset>

  <fieldset class="volby volby--stupnice">       <!-- 1–5, i pro dotazník -->
    <legend>Známka z matematiky na konci 8. třídy</legend>
    <label class="volba"><input class="volba__vstup" type="radio" name="znamka" value="1"><span class="volba__obsah">1</span></label> …
  </fieldset>

  <div class="pole-skupina">
    <label class="pole-popisek" for="odkud">Odkud o nás víte? <span class="pole-popisek__volitelne">(nepovinné)</span></label>
    <select class="pole" id="odkud">…</select>
  </div>

  <label class="zaskrtavatko"><input type="checkbox" required><span>Souhlasím s <a href="…">obchodními podmínkami</a>.</span></label>

  <button class="tlacitko tlacitko--primarni tlacitko--velke tlacitko--cela-sirka" type="submit">Zaregistrovat se</button>
</form>
```
`textarea.pole` pro dotazník („Co chybělo"). V `.volba__obsah` lze přidat `<small>` s popiskem (např. „1 = vůbec").

### Hlášky `.hlaska`
`--info` (navy), `--uspech` (zelená), `--varovani` (oranžová; chyby systému).
```html
<div class="hlaska hlaska--varovani" role="alert">
  <svg class="ikona" …pozor/>
  <div class="hlaska__text"><strong>Nepodařilo se uložit, zkuste obnovit.</strong>Odpovědi držíme v paměti a zkusíme je uložit znovu.
    <div class="hlaska__akce"><button class="tlacitko tlacitko--sekundarni">…obnovit… Obnovit</button></div>
  </div>
</div>
```

### Toast `.toast`
Na stránce jednou `<div class="toasty" aria-live="polite"></div>` (fixně nad spodní lištou). Toast vlož dovnitř, po ~3 s přidej `.je-odchazi` a za 200 ms odstraň.
```html
<div class="toast"><svg class="ikona" …fajfka/><span class="toast__text">Uloženo</span></div>
<div class="toast toast--varovani"><svg class="ikona" …pozor/><span class="toast__text">Jste offline, uložíme později</span></div>
```

### Prázdný stav `.prazdny-stav` a načítání `.nacitani`
```html
<div class="prazdny-stav">
  <span class="ikona-kruh">…prazdno…</span>
  <h2 class="prazdny-stav__nadpis">Zatím žádná lekce</h2>
  <p class="prazdny-stav__text">Až dokončíte první lekci, uvidíte tady barvy semaforu.</p>
  <button class="tlacitko tlacitko--primarni">Začít první lekci</button>
</div>
<div class="nacitani"><span class="tocitko" aria-hidden="true"></span>Načítám lekci…</div>
```

### Admin — filtry `.filtry` a tabulka `.tabulka`
```html
<form class="filtry" role="search">
  <div class="filtry__pole filtry__pole--hledat">
    <label for="hledat">Hledat</label>
    <div class="pole-hledat"><svg class="ikona" …hledat/><input class="pole" id="hledat" type="search" placeholder="Jméno, e-mail, dítě"></div>
  </div>
  <div class="filtry__pole"><label for="stav">Stav</label><select class="pole" id="stav">…</select></div>
  <div class="filtry__pole"><label for="razeni">Řadit</label><select class="pole" id="razeni">…</select></div>
  <div class="filtry__akce"><button class="tlacitko tlacitko--sekundarni" type="button">…stahnout… Export CSV</button></div>
</form>

<div class="tabulka-obal">
  <table class="tabulka">
    <thead><tr>
      <th scope="col">Rodina</th> …
      <th scope="col" aria-sort="descending"><button class="tabulka__razeni" type="button">Poslední aktivita …dolu…</button></th>
      <th scope="col" class="tabulka__cislo">Lekce</th>
      <th scope="col"><span class="jen-ctecka">Akce</span></th>
    </tr></thead>
    <tbody><tr>
      <td><strong>Jana Nováková</strong><span class="tabulka__sekundarni">jana@…</span></td>
      <td><span class="stitek stitek--navy">Pilot</span></td>      <!-- Aktivní: stitek--zelena, Uzavřeno: stitek -->
      <td class="tabulka__nezalamovat">dnes 19:42</td>
      <td class="tabulka__cislo">3 / 4</td>
      <td><div class="tabulka__akce"><button class="tlacitko tlacitko--male tlacitko--primarni">Odemknout</button><button class="tlacitko tlacitko--male tlacitko--tiche">Poznámka</button></div></td>
    </tr></tbody>
  </table>
</div>
```

### Tisk A4 (`css/tisk.css`)
```html
<div class="tisk-ovladani jen-obrazovka"><button class="tlacitko tlacitko--primarni" onclick="print()">Vytisknout</button></div>
<article class="tisk-list">
  <header class="tisk-zahlavi">
    <div class="tisk-zahlavi__lekce">Lekce 1: Pořadí operací<small>Spolu na přijímačky · Pilot</small></div>
    <div class="tisk-zahlavi__jmeno">Jméno: <strong>Eliška</strong><br>Datum: <span class="tisk-linka"></span></div>
  </header>
  <section class="tisk-uloha">
    <div class="tisk-uloha__hlavicka"><span class="tisk-uloha__cislo">1</span><span class="tisk-uloha__typ">Rozcvička</span></div>
    <div class="tisk-uloha__zadani">tisk.zadani</div>
    <ul class="tisk-moznosti"><li>a) …</li><li>b) …</li></ul>        <!-- místo dlaždic -->
    <div class="tisk-vypocet"></div>                                 <!-- 4 cm; CERMAT: tisk-vypocet--velky 8 cm -->
    <div class="tisk-vysledek">Výsledek:</div>
  </section>
  <footer class="tisk-paticka"><span>StudentBase.cz · Spolu na přijímačky</span><span>…</span></footer>
</article>
```
`@page` A4, okraje 15 mm, úloha se nerozdělí mezi stránky, `.jen-obrazovka` a hlavička se netisknou. Víc lekcí za sebou = víc `.tisk-list` (každá od nové stránky).

---

## Ikony (viewBox 0 0 24 24, jen cesty)

| Název | Cesty |
|---|---|
| fajfka | `<path d="M5 12.5l4.5 4.5L19 7.5"/>` |
| zamek | `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>` |
| hodiny | `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>` |
| sipka-vpravo | `<path d="M5 12h14M13 6l6 6-6 6"/>` |
| sipka-vlevo | `<path d="M19 12H5M11 6l-6 6 6 6"/>` |
| obnovit / opakovat | `<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>` |
| info | `<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>` |
| pozor | `<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 16.8h.01"/>` |
| bublina | `<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M10 9a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9v.2M12 13.6h.01"/>` |
| krizek | `<path d="M6 6l12 12M18 6L6 18"/>` |
| tiskarna | `<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>` |
| obrazovka | `<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>` |
| telefon | `<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>` |
| smazat | `<path d="M9 5h11v14H9l-6-7z"/><path d="M12 9.5l5 5M17 9.5l-5 5"/>` |
| stop | `<path d="M8 8h8v8H8z"/>` (s `ikona--plna`) |
| hledat | `<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>` |
| mail | `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>` |
| prazdno | `<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/>` |
| zarovka | `<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>` |
| otocit | `<path d="M4 8h15l-3.5-3.5M20 16H5l3.5 3.5"/>` |
| oko | `<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>` |
| dolu | `<path d="M6 9l6 6 6-6"/>` |
| sos | `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>` |
| uzivatel | `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>` |
| menu | `<path d="M4 7h16M4 12h16M4 17h16"/>` |
| kniha | `<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h8"/>` |
| stahnout | `<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>` |
| tuzka | `<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>` |
| kalkulacka | `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>` |

Velikosti: `.ikona` 1.25em, `.ikona--mala`, `.ikona--velka`; `.ikona-kruh` (+ `--zelena`) = ikona v kolečku.

## Přístupnost (už v CSS)
- `:focus-visible` = modrý prstenec 3 px (`--barva-fokus`); pole mají vlastní prstenec.
- `prefers-reduced-motion`: animace a přechody vypnuté (točítko jen zpomalené).
- Kontrast všech dvojic text/plocha ≥ 4,5 : 1, rámečky polí ≥ 3 : 1.
- Vzory výše používají `aria-pressed`, `aria-label` u ikonových tlačítek, `role="status"`/`"alert"` u hlášek, `aria-invalid` + `aria-describedby` u chyb.

## Doplněk vedoucího (24. 9.)
- **Obsah dlaždice** vždy obalit do `<span class="dlazdice__text">…</span>` (`.dlazdice` je flex; bez obalu se text a vzorec rozpadnou do sloupců).
- **KaTeX CSS** vkládá `nacistKnihovny()` z `js/obsah.js` sama. Do `<head>` ho nedávejte; pokud ano, jen přesně URL `KATEX_CSS` z obsah.js.

## Doplňky integrace (24. 9.) — `css/design-system.css` oddíl 16
Stránky (`web/*.html`) už nemají `style=""` ani `<style>` (výjimky: `komponenty.html` = vitrína, `tisk.css` = tisk). Dynamická šířka `.pruh__vypln` se dál nastavuje inline z JS.

| Třída | K čemu |
|---|---|
| `.obal--stranka` | svislé odsazení hlavního obsahu běžné stránky (`<main class="obal obal--stranka …">`) |
| `.text-stredni` | text 18 px (platební instrukce, uzavřený účet) |
| `.na-stred` | položka zásobníku zarovnaná na střed (přepínač Registrace/Přihlášení, tlačítko Odhlásit) |
| `.formular__uvod` | obal nadpisu a podtitulu nad formulářem (mezera 8 px) |
| `.prazdny-stav--plny` | prázdný stav s plným rámečkem = potvrzení („Zkontrolujte e-mail", „Děkujeme") |
| `.prazdny-stav__nadpis--velky` | větší nadpis prázdného stavu (28 px) |
| `.stitek--na-tmave` | štítek v navy hlavičce (admin e-mail) |
| `.volby--3` | tři volby `.volba` v jedné řadě (dotazník) |
| `.landing-*` | landing (`index.html`): `-nadtitul`, `-titulek`, `-prislib`, `-poznamka` (text na navy), `-duvod`, `-cena__stitek`, `-cena__castka`, `-vyhoda`, `-vyzva`, `-paticka`, `-paticka__nadpis` |
| `.semafor-klic` (`__uvod`, `__seznam` = `<dl>`) | R21: rozhodovací klíč pod tlačítky semaforu — úvodní věta viditelná, 4 věty sbalené pod „Jak vybrat?" |
| `.rozbalovaci--vnorene` | rozbalovací uvnitř jiného / bez stínu (vzorová odpověď pod „Otočenou rolí", „Jak vybrat?") |
| `.souhrn__zitra` + `--zelena/--oranzova/--cervena` | řádek „Zítra: …" v souhrnu podle hlavní barvy (s `.hlaska`) |
| `.modal__markdown` | obsah textového modalu (manuál, slovníček); stylovaná tabulka |
| `.admin-*` | admin.js: `-poznamka`, `-nadpis`, `-dlazdice(__cislo)`, `-legenda(__polozka)`, `-graf(__osa, __usek--barva, __popisek, __kapitola)`, `-radek-souhrn`, `-tyden(__datum, __pruh, __pocet)` |

- `.lekce-zak` má minimum sloupce 26 rem (2 sloupce i na 1024 px se scrollbarem).
- Textové modaly rodiče (manuál „Jak vést lekci", slovníček „Jak číst zápisy nahlas") vytváří `menu.js` (`otevritManual()`, `otevritCteni()`).
- `.souhrn__uloha--hlavni .souhrn__uloha-barva` je blok (barva hlavní úlohy na vlastním řádku).

## Úpravy po Pavlově testu (24. 9., R23) — `design-system.css` oddíl 17
| Třída | K čemu |
|---|---|
| `.zadani` | obal textu zadání (žák `.karta-ulohy__zadani`, rodič „Co vidí dítě", náhled): `$$…$$` velký a na středu |
| `.katex` | globálně `white-space: nowrap` — vzorec se nikdy nezalomí uprostřed |
| `.dlazdice__stitek` + `.dlazdice__vyraz` | malý štítek nad výrazem („1. řádek"); výraz celý na jednom řádku |
| `.dlazdice-mrizka--sloupec` | dlaždice pod sebou (detektiv / dlaždice se štítkem); jinak se dlaždice nezmenší pod šířku vzorce a zalomí se celá |
| `.karta-ulohy__sbalit`, `.karta-ulohy.je-sbalene` | žák: ≥ 64 rem zadání vlevo `sticky`; pod 64 rem přilepené nahoře a jde sbalit (2 media queries — výjimka ze zásady „bez media queries") |
| `.uvod-lekce` (`__nadpis`, `__veta`) | rodič, úloha 1: úvod lekce v blocích |
| `.zebricek` (`__nadpis`, `__kroky`, `__krok`, `__cislo`, `__znak`, `__text`) | žebříček „Platí:" z `uvod_pravidla` — číslo v zeleném prstenci, znak + slovo, všechny řádky stejné (revize C) |
| `.pravidla-rodic` (`__nadpis`, `__seznam`) | rámeček „Pravidla pro vás" (hlášky `rodic.pravidla_*`), stejný v každé lekci |
| `.postup-rodice` (`__krok`, `__hlavicka`, `__cislo`, `__nadpis`, `__obsah`, `__pozn`) | karta úlohy rodiče jako očíslovaný postup 1–4 (číslo v zeleném prstenci, zelená linka vlevo, 1. krok se zeleným podkladem = „co dělat teď") — pozor, `.postup` je jiná komponenta (číslovaný postup řešení) |
| `.otazka__k`, `.otazka--otocena` | štítek „A" / „Krok 1" u otázky; otočená role jako otázka |
| `.tahak__sekce--vysvetleni`, `.tahak__pomucky` | „O co jde" nahoře; typická chyba a řešení níž pod „Pro jistotu" |
| `.reseni` (`__vypocet`, `__text`, `__oddil`, `__oddil-nadpis`, `__radek`, `__vysvetlivka`, `__vysledek`, `__vysledek-stitek`) | `tahak.reseni` jako výpočet: řádek velký, vysvětlivka menší šedá pod ním, oddíly A/B/C, výsledek v rámečku zeleného akcentu (`renderReseni()` v `obsah.js`) |

### Hlavička a menu přihlášených stránek (`js/menu.js`)
HTML obsahuje jen hlavičku s logem (odkaz na `prehled.html`); tlačítko Menu a dialog přidá `napojMenu()`:
přepínač role zařízení, „Jak vést lekci" (jen rodič), „Zpět na přehled", „Odhlásit se".
```html
<header class="hlavicka"><div class="hlavicka__vnitrek">
  <a class="logo" href="prehled.html"><span class="logo__znacka">Student<span>Base</span></span><span class="logo__produkt">Spolu na přijímačky</span></a>
</div></header>
<script type="module">import { napojMenu } from './js/menu.js'; napojMenu();</script>
```
Veřejné stránky (`index`, `registrace`, `nove-heslo`, `uzavreno`) mají logo → `index.html` a menu nemají; `tisk.html` hlavičku nemá; `admin.html` má logo → `admin.html`.

## Revize C + motiv D (24. 9. večer) — `design-system.css` oddíl 18
| Třída / pravidlo | K čemu |
|---|---|
| `.hlavicka` | zelená linka 3 px dole (patička `footer.hlavicka` nahoře) |
| `.prubeh__krok.je-hotovo` / `.je-aktualni` | hotové úseky zelené, aktuální delší se zeleným obrysem |
| `.krok:not(.krok--hotovy)` | aktivní krok žáka: zelená linka vlevo, „KROK 1" zeleně |
| `.karta-lekce--probiha` | zelená linka vlevo (dřív navy) |
| `.karta-lekce__akce` | hlavní/sekundární tlačítko přes celou šířku, tichá tlačítka („Projít znovu", „SOS") vedle sebe |
| `.zadani ol` (i `.tisk-uloha__zadani ol`) | detektiv: Petrův výpočet jako „list" — čísla řádků vlevo, řádky oddělené, „=" pod sebou; slovo „řádek:" ztlumené |
| `.souhrn__ulohy` | souhrn: úlohy jako řádky (znak · název · barva), hlavní úloha zvýrazněná pod nimi |
| `.rozbalovaci--uvod` | **pro integrátora**: u 2.–4. úlohy obalit `.uvod-lekce` do `<details class="rozbalovaci rozbalovaci--uvod"><summary>…Než začnete…</summary><div class="rozbalovaci__obsah">…</div></details>` |
| `.prepinac--motiv`, `.paticka-motiv`, `.paticka-stranky` | přepínač motivu (viz „Motivy") |
| `.mrizka-karet` | `auto-fit` místo `auto-fill`: 3 karty na landing vyplní šířku (dřív prázdný 4. sloupec) |
| kompaktní tahák | menší mezery a čísla postupu, souhrny 48 px: stránka rodiče úloha 1 z 2 751 px na 2 435 px (375 px) |


## E1 + E2 (Pavlův 2. test, 25. 9.) — `design-system.css` oddíl 19, `js/obsah.js`
**E1 — dlaždice a vzorce nikdy se posuvníkem.** Uvnitř `.dlazdice` ani v `.zadani .katex-display` není `overflow: auto`.
- `.dlazdice-mrizka` = 2 sloupce; `.dlazdice-mrizka--jeden-sloupec` = všechny dlaždice kroku pod sebou (sloupce se v kroku nemíchají); `--sloupec` (detektiv, štítky) = vždy pod sebou.
- O rozložení rozhoduje `rozlozDlazdice(mrizka, volby?)` z `js/obsah.js` — zavolat hned po vytvoření mřížky (nemusí být v DOM):
```js
import { rozlozDlazdice } from './obsah.js';
rozlozDlazdice(mrizka);                                                          // dlaždice kroku (lekce.js; rodič: papírový režim)
rozlozDlazdice(zadani, { vyraz: '.katex-display', sloupce: false, jednotne: false }); // zadání / „Co vidí dítě"
// podpis: rozlozDlazdice(mrizka: HTMLElement, { vyraz = '.dlazdice__vyraz', sloupce = true, jednotne = true, minMeritko = 0.6 } = {}) → () => void (odpojí)
```
  Nejdelší možnost se nevejde do 2 sloupců → 1 sloupec; nevejde se ani na celou šířku → CSS proměnná `--meritko-vzorce` (0,6–1) zmenší vzorce (jednotně pro celý krok). Přepočet při změně šířky (ResizeObserver) a po načtení písem KaTeX.
- `.katex` velikost = `calc(var(--pismo-katex) * var(--meritko-vzorce, 1))` (v dlaždici 1.15em ×, display v zadání 1.25em ×).
- Kontrola: `node nastroje/kontrola-dlazdic.mjs [--sirky=1280,1024,800,375] [--lekce=P1]` — všechny kroky s dlaždicemi P1–P4 v layoutu lekce + tisk, oba motivy; hlásí overflow-x, přetečení, zalomený vzorec, míchání sloupců.

**E1 po QA sezóny (27. 9.)** — display vzorec v zadání má na telefonu i na 1024 px základ 36 px, takže mez 0,6 nestačila.
- `rozlozZadani(uzel)` (obsah.js) = E1 pro text zadání (žák, rodič „Co vidí dítě"): měří display vzorce **i řádky s vloženými vzorci** (`p`, `li` — Petrův výpočet v detektivovi), spodní mez je **16 px** (`MIN_PISMO_VZORCE`, minimum čitelnosti), řádky jednoho seznamu mají stejné měřítko.
- `renderReseni()` si E1 zapíná sama (řádek řešení u rodiče se zmenší, `.reseni__radek .katex` × `--meritko-vzorce`); Kontrola simulace měří i položky („Správně:", písmena).
- Poslední záchrana (`zalomit: true`): co se nevejde ani na 16 px (dlaždice: ani na 0,6), přejde na další řádek **jen za +, −, = mimo závorky** — části uvnitř závorky a za ⋅ / × jsou slepené do nedělitelné `.vzorec-cast`, zalamování zapíná `.vzorec-zalomit`. QA to hlásí jako kosmetické („vzorec zalomený") = kandidát na rozdělení řádku v obsahu.
- Dlaždice pod sebou mají vodorovný padding `clamp(12 px, 3vw, 24 px)`; `.zadani ol > li > p` má `min-width: 0` (jinak se řádek roztáhne na šířku vzorce a měření nic nenajde).
- Diagnostika (R37): odpočet je skrytý hned od vykreslení lišty (i na „Připrav si"); diagnostika a simulace nemají dílky průběhu, jen tenký pruh.

**E2 — zvýrazňování po znacích.** Ve vzorci zadání dostane každý list KaTeX (`.mord .mbin .mrel .mopen .mclose .mpunct .mop .minner`) třídu `.zvyraznitelne .zvyraznitelne--znak`; klik přepne `.je-zvyrazneno` (žlutá plocha + žluté podtržení, v obou motivech). Víceciferné číslo / desetinné číslo (sousední číslice na stejném účaří) se zvýrazní jako celek. `::after` zvětšuje zásahovou plochu pro prst. Jen vizuální, nic se neukládá.

## B4 (Pavlův 3. test, 25. 9.) — `design-system.css` oddíl 20, `js/obsah.js`, `js/pripravit.js`, `tisk.html`
| Třída / funkce | K čemu |
|---|---|
| `renderManual(md)` (obsah.js) + `rozdelManual(md)` (čistá) | H1: manuál z `obsah/manual-rodice.md`; kontejnery `::: blok barva=zelena\|oranzova\|semafor\|hlavni ikona=<IKONY>` … `:::`, první tučná věta = nadpis, `==text==` = zvýraznění (`<mark>`) |
| `.manual-blok` (`--zelena` výchozí, `--oranzova`, `--hlavni`, `--semafor`; `__nadpis`, `__ikona`, `__obsah`, `__zvyrazneni`, `__semafor`, `__semafor-polozka`, `__semafor-text`) | blok manuálu: ikona v prstenci, pruh vlevo 5 px (semafor = 3 barvy), zvýraznění = „fix" spodní polovinou řádku; u položek „Zelená / Oranžová / Červená" plné kolečko s ikonou (R27) |
| `.pripravit` (`__hlavicka`, `__seznam`, `__polozka`, `__zbyva`) | H2: „Připrav si" u žáka (`pripravit.js`); položka = velký štítek s checkboxem, odškrtnutá má zelený akcent |
| `pomuckyLekce(lekce)`, `VYCHOZI_POMUCKY` (obsah.js) | H2: `lekce.pomucky` nebo sešit, propiska, tužka |
| `.tisk-pripravit` (tisk.css) | H2: řádek „Připrav si: …" pod záhlavím tisku |
| `.zebricek__znak--zlomek` | H4: zlomek v žebříčku „Platí:" — `\displaystyle\boldsymbol{…}`, 0,9 em |
| `tisk.html` `#ovladani` (`#tiskZpet`, `#tiskTlacitko`) | H3: ovládání přímo v HTML (nikdy bílá stránka); tisk se otevírá ve stejné kartě s `?zpet=` (`aktualniStranka()` z ui.js) |
| `.dlazdice-mrizka` (2 sloupce) `> .dlazdice` | B3: vodorovný padding 16 px (dřív 24) — P1-U3 k1 na 1280 px se vejde do 2 sloupců |

## Fáze 1 technika (R30) — `design-system.css` oddíl 21, `js/vstupy-f1.js`, `js/vyhodnoceni.js`
| Třída / funkce | K čemu |
|---|---|
| `vytvorVstupVyraz(krok)` + `.vyraz-vstup`, `.pole--vyraz`, `.vyraz-nahled` | vstup `vyraz`: textové pole, pod ním „Takhle to čtu: <KaTeX>" (`vyrazNaLatex` z vyhodnoceni.js); klávesnice na dotyku má x, x², závorky |
| `vytvorVstupPoradi(krok)`, `vykresliPoradi(krok, {poradi})` + `.poradi`, `.poradi__vyraz`, `.poradi__stitek`, `.poradi--nahled` | vstup `poradi`: `\op{id}{znak}` → `[data-op]` (KaTeX `\htmlData`, `trust` jen tady), štítky 1…n, klik znovu = zrušit a přečíslovat, dotyk ≥ 40 px (`::before`), po chybě nic nezvýrazněno; `--nahled` = rodič (správné pořadí, „Co vidí dítě") |
| `vytvorObrazek(uloha, {popisek, tisk})` + `.obrazek-ulohy` (`__svg`, `__popis`, `--tisk`, `--nahrada`) | `obrazek` přes `sanitizujSvg()` (DOMPurify, profil SVG), `currentColor` → oba motivy; rodič vidí „Na obrázku: …", tisk max 60 mm |
| `renderTex(tex, {display, poradi})`, `renderMarkdown(…, {poradi: true})` (obsah.js) | samostatný vzorec; v tisku `\op` = prázdný kroužek 5 mm nad operací + pokyn „Očísluj, v jakém pořadí počítáš." (tisk.css) |

## Diagnostika Fáze 1 (týden 0, R37) — `design-system.css` oddíl 22, `js/diagnostika*.js`, `js/rodic-diagnostika.js`
| Třída / modul | K čemu |
|---|---|
| `diagnostika.js` | čistý výpočet reportu (report §7) → `sezeni.souhrn` `{typ: 'diagnostika'}`, popisy chyb pro rodiče, názvy týdnů |
| `diagnostika-zak.js` + `.pruh--diag`, `.diag-prestavka` | žák: sezení bez limitu 24 h, přestávka po 12., konec; lišta „Úloha n z 24" + ukazatel po 24 dílcích (navy), bez odpočtu |
| `rodic-diagnostika.js` + `.diag-stav`, `.diag-cas`, `.diag-plan*`, `.diag-stitek`, `.diag-chyby*`, `.diag-kapitol*`, `.diag-papir*`, `.diag-jak` | rodič: průběh, papír (24 polí), výsledek (plán po týdnech = štítek s ikonou, slabé oranžově, nikdy červeně) |
| `.karta-lekce--diagnostika`, `.karta-lekce__popis` | přehled: karta „Týden 0 — vstupní diagnostika" (sekce `#faze1-t0`, kotvy `#faze1-tN`) |
| `.tisk-vypocet--diag`, `.tisk-predel` (tisk.css) | tisk: menší místo na výpočet, předěl po 12. úloze s novou stranou |
