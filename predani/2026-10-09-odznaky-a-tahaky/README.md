# Předání pro Spolu 8: nový vzhled odznaků a karet, nové odznaky, taháky a výzvy

**Pro koho:** vývojář (agent) projektu **Spolu 8** (opakování 8. třídy). Dokument předpokládá nulový kontext, všechno potřebné je v této složce.
**Odkud:** projekt **Spolu na přijímačky** (9. třída), stav k 9. 10. 2026. Tam je všechno nasazené a otestované.
**Proč:** Spolu 8 převzalo odznaky a karty ve verzi ze **6. 10.** (SVG odznaky, karta k otočení). Od té doby ve Spolu 9 proběhly tyto změny a Pavel je chce mít i ve Spolu 8:

| krok | co | diff | priorita |
|---|---|---|---|
| R81 | **nový vzhled odznaků a karty** podle návrhu designérky (`navrh-designerky/`) | `patche/3-…` + `patche/5-…` | **hlavní požadavek** |
| R80 | **nové odznaky**: výzvy, sbírka taháků, delší řady | `patche/2-…` | doporučeno |
| R78 + R82 | **sbírka taháků a měsíční výzvy** (stránka „Moje taháky“, karta výzvy na přehledu) | `patche/1-…`, `patche/4-…` | doporučeno, potřebuje obsah pro 8. třídu |

Texty (názvy, pochvaly, popisy, tlačítka) zůstávají. Pavel: „texty držíme, jak jsme je měli“. Mění se vzhled, přibývají funkce.

## Obsah složky
- **`kod/js/`:** aktuální moduly ze Spolu 9:
  - `odznaky.js`: definice a výpočet odznaků, `htmlOdznaku`, `vzhledOdznaku`;
  - `odznaky-ui.js`: mřížka, řádek, okno odznaků;
  - `odznaky-karty.js`: karta nového odznaku nebo taháku;
  - `tahaky.js`: čistá logika taháků a výzev;
  - `tahaky-ui.js`: komponenty;
  - `tahaky-stranka.js`: stránka „Moje taháky“.
- **`kod/tahaky.html`:** stránka „Moje taháky“.
- **`kod/css/odznaky-tahaky-vyzvy.css`:** výřez z `design-system.css` Spolu 9:
  - sekce R78 (taháky, výzva);
  - „Redesign odznaků a karet“;
  - oprava `.modal` na telefonu.
- **`kod/hlasky-odznaky-tahaky.md`:** texty (klíče `tahaky.*`, `vyzva.*`, `odznaky.*`) ve formátu tabulky hlášek Spolu 9.
- **`patche/`:** diffy proti gitu Spolu 9, v pořadí, jak změny vznikaly:
  - `0-celkovy-diff-odznaku-od-6-10.diff`: **všechno u odznaků od verze 6. 10. do dneška** (odznaky.js, odznaky-ui.js, odznaky-karty.js). Je to nejrychlejší cesta, pokud Spolu 8 má soubory blízké verzi 6. 10.;
  - `1-R78-…`: napojení taháků a výzvy do přehledu, lekce, rodiče a menu;
  - `2-R80-…`: nové odznaky;
  - `3-R81-…`: nový vzhled (JS, CSS, HTML s fontem, hlášky, test);
  - `4-R82-…`: výzva jen pro rodiny se zaplacenou sezónou a počítání napříč zařízeními;
  - `5-…`: okna `.modal` na telefonu přes celou šířku.
- **`puvodni-6-10/`:** původní verze tří souborů odznaků (6. 10.). Porovnej s kódem Spolu 8 a uvidíš, kde se Spolu 8 mezitím odchýlilo.
- **`vzory-obsahu/`:** obsah taháků Spolu 9 (`tahaky-matematika.js`, `tahaky-cestina.js`, `tahaky-bonus.js`). Je jen **vzorem formátu**, obsah je pro 9. třídu.
- **`testy/`:** `odznaky.test.js`, `tahaky.test.js` (node --test).
- **`navrh-designerky/`:** původní návrh (`Odznaky – nový design.html`, otevřít v Chromu) a `navrh.png`.
- **`snimky/`:** jak to vypadá ve Spolu 9 (okno odznaků, štíty, karta rub a líc, stránka taháků, tahák, přehled).

## 1. Nový vzhled odznaků a karty (R81): hlavní úkol

### Co se mění
- **Odznak** se už nekreslí jako SVG, ale jako HTML/CSS vrstvy:
  - `span.odz` > `.odz__ram` (tmavý rám), `.odz__pruhy` (pruhovaný prstenec, `repeating-conic-gradient`), `.odz__jadro`, `.odz__lic` (radiální gradient, odlesk a přejíždějící lesk), u zamčeného `.odz__zamek` (kulatý zámek);
  - **tvar:** třída `odz--kruh`, `odz--sestiuhelnik` nebo `odz--stit` (`clip-path` přes proměnnou `--odz-tvar`);
  - **tón:** třída `odz--zelena`, `odz--zlata` nebo `odz--modra` (proměnné `--odz-hi/mid/lo/ink`);
  - **stav a velikost:** `odz--zamceno` (šedý), `odz--maly` (pod 56 px); velikost přes `--s`;
  - **znak** (číslo, hvězda, kalendář, vlajka, pohár, kartičky, zkratka měsíce) je SVG nebo HTML s `currentColor`;
  - funkce `htmlOdznaku(id, { velikost, zamceno, titulek })` a `vzhledOdznaku(id)` v `odznaky.js`. Starou `svgOdznaku` nech kvůli malým ikonám a testům (ve Spolu 9 ji používá hvězda „celá správně“ v rohu karty lekce).
- **Pod 56 px** (řádek na přehledu) nemá odznak přejíždějící lesk ani zámek, zamčený je jen šedý.
- **Okno odznaků:**
  - dlaždice „Získáno“ (bílá karta) a „Zamčeno“ (čárkovaný rámeček);
  - štítek velkými písmeny s prostrkáním;
  - nadpisy sekcí velkými písmeny;
  - hover nakloní odznak.
- **Karta nového odznaku a taháku (`odznaky-karty.js`):**
  - tmavá scéna;
  - **neonový titulek** v písmu Tilt Neon (Google Fonts, záloha Sora; česká diakritika ověřena);
  - **rub:** rotující duhový okraj, prolétající světla, zlatá koule s „?“, vlny, „Klepni a otoč“ a SPOLU v rozích;
  - **líc:** předmět, pořadí 01/03, okno s mřížkou, paprsky a jiskrami, odznak s animací „pop“, razítko „Získáno!“, druh („Zlatý odznak“…), název, pochvala, SPOLU a datum;
  - **pohyb:** 3D náklon za myší, vznášení, otočení přes `rotateY`;
  - **zachované chování:** víc karet s listováním, „Otevřít tahák“ u taháků, režim prohlížení (`prohlizeni`), Esc a fokus, `aria-live` a `prefers-reduced-motion`.
- **Nové texty:** jen štítky `odznaky.ziskano` („Získáno“), `odznaky.zamceno` („Zamčeno“) a razítko `odznaky.razitko` („Získáno!“).

### Mapování tvarů a tónů (Spolu 9; pro Spolu 8 přizpůsob předmětům)

| skupina | tvar | tón |
|---|---|---|
| matematika (id bez předpony) | kruh | zelená (vytrvalost), zlatá (milník, celá správně) |
| čeština (`cj:`) | štít | modrá, zlatá |
| oba předměty (`oba:`) | šestiúhelník | zlatá |
| výzvy (`vyzva:RRRR-MM`) | kruh | zlatá, hvězda a zkratka měsíce |
| sbírka taháků (`sber:`) | šestiúhelník | zelená (5, 15), zlatá („vše“) |

Mapování je v `vzhledOdznaku(id)`. Když má Spolu 8 jiné předměty nebo předpony id, uprav jen tuto funkci.

### Postup
1. Porovnej `puvodni-6-10/*.js` se soubory odznaků ve Spolu 8. Rozdíly jsou úpravy Spolu 8, které musíš zachovat.
2. Aplikuj `patche/0-celkovy-diff-odznaku-od-6-10.diff` (případně ručně podle `kod/js/`). Pokud nechceš R80, nové odznaky z diffu vynech: `ODZNAKY_VYZEV`, `ODZNAKY_SBIRKY`, `odznakyVyzevATahaku` a import z `tahaky.js`.
3. Do CSS přidej ze `kod/css/odznaky-tahaky-vyzvy.css` sekci **„Redesign odznaků a karet“** a blok **„ODPOVED 8. 10., bod 2“** (okna na telefonu). **Starou sekci odznaků a karty `.karta-odznaku…` z verze 6. 10. odstraň**, jinak se pravidla perou.
4. Na stránky, kde se karta zobrazuje (přehled, lekce, rodič, případně taháky), přidej do odkazu Google Fonts `&family=Tilt+Neon` (viz `patche/3-…`, soubory `*.html`).
5. Doplň tři texty (`odznaky.ziskano`, `odznaky.zamceno`, `odznaky.razitko`) do systému hlášek Spolu 8.
6. Ověř:
   - `node --test` (vezmi `testy/odznaky.test.js` a uprav id a počty podle sady Spolu 8);
   - snímky okna odznaků a karty na **390 a 1280 px, ve světlém i tmavém motivu**;
   - porovnání s `snimky/` a `navrh-designerky/navrh.png`;
   - kontrast textů AA a `prefers-reduced-motion` bez animací.

### Závislosti (kontrakt), které musí Spolu 8 mít
- **`ui.js`:**
  - `el(tag, attrs, ...children)` (atributy `class` jako řetězec nebo pole, `text`, `htmlBezpecne`, `onClick`, `aria-*`, `style`);
  - `otevritModal(dialog)` (Promise, která se vyřeší při zavření);
  - `zavritModal(dialog)`;
  - `ikona(nazev)` (jen taháky).
- **`hlasky.js`:** `h(klic, parametry)`.
- **`obsah.js`:** `renderMarkdown(text, { inline })` a `nacistKnihovny()` (KaTeX), jen pro taháky.
- **`supabase.js`:** `lekceProDite(diteId)` vrací katalog, kde každá lekce má `id`, `predmet` (chybí = matematika), `faze`, `tyden`, `zamceno` (null | 'platba' | 'datum'…), `dokoncene` (poslední dokončené sezení `{ konec, souhrn }`) a od R82 i `dokonceniVse` (pole `konec` všech dokončených sezení; dotaz se nemění, sezení se už načítají všechna).
- **CSS tokeny** z `design-system.css` Spolu 9. Pokud je Spolu 8 nemá, převezmi tyto hodnoty:
  - **barvy:**
    - `--barva-text #0F172A`, `--barva-text-2 #334155`, `--barva-text-tlumeny #475569`;
    - `--barva-pozadi #F6F8FB`, `--barva-povrch #FFFFFF`, `--barva-povrch-2 #EEF2F7`;
    - `--barva-okraj #E2E8F0`, `--barva-okraj-silny #CBD5E1`, `--barva-fokus #0A7A4C`;
    - `--barva-zelena #1FC27E`, `--barva-zelena-plocha #E3F7EE`, `--barva-zelena-text #0A7A4C`;
    - `--barva-zlata #F5C518`, `--barva-zlata-obrys #C99A00`, `--barva-zlata-plocha #FFF8DC`, `--barva-zlata-text #6B4E00`;
    - `--barva-cj #3B82F6`, `--barva-cj-text #1D4ED8`, `--barva-cj-plocha #DBEAFE`;
  - **mezery:** `--mezera-1 .25rem`, `-2 .5rem`, `-3 .75rem`, `-4 1rem`, `-5 1.5rem`;
  - **zaoblení:** `--polomer-s .5rem`, `-m .75rem`, `-l 1rem`, `--polomer-karta 1.125rem`, `--polomer-panel 1.5rem`;
  - **písmo:** `--pismo-rodina "Sora", …`, `--pismo-maly .875rem`, `-zaklad 1rem`, `-stredni 1.125rem`, `-velke 1.375rem`, váhy 500/600/700;
  - **ostatní:** `--prechod 150ms ease`, `--stin-2 0 4px 14px rgb(15 23 42/.08), 0 1px 3px rgb(15 23 42/.06)`;
  - **tmavý motiv** (`:root[data-motiv="tmavy"]`): `--barva-zlata-obrys #F5C518`, `--barva-zlata-plocha rgb(245 197 24/.14)`, `--barva-zlata-text #FDE68A`, `--barva-cj-text #93C5FD`, `--barva-cj-plocha #172554`. Ostatní tmavé hodnoty má Spolu 8 vlastní.
- **localStorage:** `spolu.odznaky.videno.<diteId>` a `spolu.tahaky.videno.<diteId>` (co už se na zařízení ukázalo; první načtení je tiché). Ve Spolu 8 použij **jiný prefix** (např. `spolu8.`), pokud by obě aplikace běžely na stejné doméně.

## 2. Nové odznaky (R80)
- **Výzvy:** `vyzva:RRRR-MM`, za splněnou měsíční výzvu (N lekcí v kalendářním měsíci, oba předměty se sčítají).
- **Sbírka:** `sber:5`, `sber:15`, `sber:vse` podle počtu odemčených týdenních taháků.
- **Delší řady** u předmětu, který má dost lekcí: řada 5, řada 10, „Fáze 1 hotová“.
- **Splněná výzva nezmizí:**
  - výzva počítá lekci v každém měsíci, kdy byla dokončena (`dokonceniVse`, R82);
  - viděné odznaky výzev se navíc drží přes `videne`.
- **Rodině bez zaplacené sezóny** (`zamceno === 'platba'`) se výzvy nepočítají ani nezobrazují (R82). Cíl by byl nesplnitelný.

## 3. Taháky a výzvy (R78, R82)
- **Taháky:** jeden tahák na týden předmětu, který má aspoň 2 lekce. Odemkne se dokončením všech lekcí týdne, nezáleží na barvách semaforu.
  - **formát:** 3–6 bloků `{ nadpis, text, priklad }` (markdown + KaTeX), viz `vzory-obsahu/`;
  - id `t:<predmet>:<faze>:<tyden>`.
- **Stránka „Moje taháky“** (`tahaky.html`):
  - mřížka: matematika zelená, čeština modrá, bonus zlatá, zamčené šedé s textem, co pro ně udělat;
  - otevření taháku v okně;
  - „Vytisknout odemčené“ (A4, 2 na list).
- **Přehled:** řádek „Taháky: x z N“ a karta měsíční výzvy s ukazatelem.
- **Nově odemčený tahák** se po lekci ukáže jako karta (stejná komponenta jako odznak) s tlačítkem „Otevřít tahák“.
- **Výzvy:**
  - tabulka `VYZVY` (`{ mesic, cil, nazev }`) a bonusové zlaté taháky `b:RRRR-MM`;
  - nesplněné bonusy se všem (se sezónou) odemknou k datu `ODEMCENI_BONUSU`.
- **Co upravit pro Spolu 8:**
  - **`tahaky.js`:**
    - `ODEMCENI_BONUSU` (Spolu 9: 1. 4. 2027) a `KONEC_DUBNOVE_VYZVY` (11. 4.) podle sezóny Spolu 8;
    - pořadí fází v `PORADI_FAZI` (Spolu 9: pilot, faze1, faze2);
    - `sezonaZamcena` podle toho, jak Spolu 8 značí zamčenou platbu.
  - **Obsah:** `tahaky-matematika.js`, `tahaky-cestina.js`, `tahaky-bonus.js` napiš nově pro 8. třídu (návrh v oddílu 5).
  - **Texty:** hlášky ze souboru `kod/hlasky-odznaky-tahaky.md`.
- **Data:** žádné změny DB, všechno se počítá z dokončených sezení. Bez real-time.

## 4. Nápady na rozšíření odznaků („aby to nebylo jen pár odznáčků“)

**Zásady (platí i ve Spolu 9):**
- **Odměňuje se vytrvalost a pravidelnost, ne dokonalost.** Odznaky za „všechno zeleně“ dávej střídmě, jinak rodiče přikrašlují semafor.
- **Počítá se z dat, která už existují** (dokončená sezení, souhrn s barvami semaforu, režim samo, datum). Žádné změny DB.
- **Id jsou stabilní.** Jednou získaný (viděný) odznak se nikdy neodebírá.
- **Stupně** stejného odznaku jdou v novém vzhledu odlišit tónem (bronz, stříbro, zlato: přidej třídy `odz--bronz` s proměnnými `--odz-hi #F3C9A0`, `--odz-mid #C47A3A`, `--odz-lo #8A4B1C` a `odz--stribro` s `#F4F6FA`, `#C3CAD6`, `#8A94A6`; vzor je `odz--zlata` v CSS) nebo číslem ve znaku.
- **Vždy ukaž, co je nejblíž:** „Ještě 2 lekce do Řady 5“ jako šedá dlaždice s ukazatelem.
- **Na přehledu** zůstává jen pár ikon, celý katalog je v okně „Odznaky“. Rozšíření tak nezahltí obrazovku.

**Návrhy (rodiny):**

| rodina | odznaky (stupně) | podmínka | data |
|---|---|---|---|
| **Vytrvalec** | 10 / 25 / 50 / 100 lekcí | počet dokončených lekcí celkem | dokončená sezení |
| **Řady** | 3 / 5 / 10 / 20 / 30 | lekce za sebou (pauza nejvýš týden) | časy dokončení |
| **Týdny** | celý týden ×1 / ×4 / ×8 | počet celých týdnů | katalog + dokončení |
| **Pravidelnost** | „Pracovní týden“ | v jednom týdnu lekce aspoň 4 různé dny | časy dokončení |
| **Opravář** | 1 / 5 / 10 | lekce, která byla červená nebo oranžová, je při opakování zelená | souhrny všech sezení lekce |
| **Samostatnost** | 1 / 10 | lekce v režimu „samo“ dokončená celá zeleně | režim a souhrn sezení |
| **Mistr tématu** | jeden za každou kapitolu (Zlomky, Procenta, Pravopis…) | všechny lekce kapitoly hotové, většina zeleně | kapitola lekce + souhrn |
| **Oba předměty** | 1 / 10 dní | v jeden den lekce z obou předmětů | časy dokončení |
| **Výzvy** | měsíční (jako ve Spolu 9) | N lekcí v měsíci | časy dokončení |
| **Sbírka** | 5 / 15 / všechny taháky | odemčené taháky | taháky |
| **Milníky sezóny** | první měsíc, polovina sezóny, celá fáze, celá sezóna | podíl hotových lekcí | katalog |
| **Generálka** | dokončená generálka nebo simulace | konkrétní lekce typu opakování | id lekce |
| **Sezónní** | podzimní, vánoční, velikonoční výzva | výzva v daném období (jiný cíl než měsíční) | časy dokončení |
| **Tajné** | 2–3 překvapení (např. „Návrat“: lekce po pauze delší než 14 dní) | odhalí se až po získání, do té doby „?“ | časy dokončení |

**Návrh pořadí:**
1. Vytrvalec, Řady 20/30 a Týdny ×4/×8 jsou nejlevnější, stačí rozšířit stávající výpočet.
2. Mistr tématu a Opravář dají nejvíc motivace k učení.
3. Sezónní a tajné odznaky jsou třešnička.

## 5. Návrh taháků pro Spolu 8
- **Jeden tahák na týden plánu Spolu 8** a předmět. Shrnuje pravidla toho týdne (6 bloků: pravidlo a vzorový příklad, případně „Pozor:“ s nejčastější chybou).
- **Zdroj:**
  - úvodní pravidla a rámečky pro rodiče v lekcích Spolu 8, typy chyb Spolu 8;
  - **příklady musí být jiné než v úlohách lekcí** (tahák nesmí být klíčem k úlohám; strojově porovnat).
- **Témata 8. třídy** (jen orientačně, rozhodují lekce Spolu 8):
  - **matematika:** druhá mocnina a odmocnina, Pythagorova věta, výrazy a mnohočleny, lineární rovnice, kruh a válec, konstrukce trojúhelníků, statistika a procenta v praxi;
  - **čeština:** vyjmenovaná slova a koncovky, slovní druhy a mluvnické kategorie, větné členy, souvětí a čárka, stavba slova, slovní zásoba, literatura (druhy a žánry).
- **Bonusové zlaté taháky za výzvy** (návrh pro Spolu 8):
  - „Nejčastější chyby v matematice“;
  - „Nejčastější chyby v češtině“;
  - „Jak číst zadání“;
  - „Jak se učit 20 minut denně“;
  - „Velký přehled vzorců a pravopisu 8. třídy“;
  - „Co mě čeká v 9. třídě a u přijímaček“ (most k projektu Spolu na přijímačky).
- **Kvalita** jako ve Spolu 9:
  - všechny příklady přepočítat;
  - češtinu ověřit podle IJP (bez dublet; pravidla o čárkách ověřit jako pravidlo);
  - kontrola formátu přes `testy/tahaky.test.js` (párové `$`, 3–6 bloků, unikátní id, ke každému bonusu existuje výzva).

## 6. Kontrolní seznam pro Spolu 8
- [ ] Odznaky v okně i na přehledu mají nový vzhled. Zamčené jsou šedé se zámkem, malé bez zámku.
- [ ] Karta nového odznaku: rub „Klepni a otoč“ → líc s odznakem a razítkem, víc karet se listuje, Esc zavře, `prefers-reduced-motion` bez animací.
- [ ] Neonový titulek je v Tilt Neon i s diakritikou (Š, Ř, Ů, Ě, Č).
- [ ] Texty odznaků se nezměnily (kromě štítků Získáno/Zamčeno a razítka).
- [ ] Stará CSS pro odznaky a kartu z verze 6. 10. je odstraněná.
- [ ] Okna na telefonu jsou přes celou šířku, přilepená dole.
- [ ] Testy prošly. Snímky jsou na 390 a 1280 px, ve světlém i tmavém motivu, bez chyb v konzoli a bez vodorovného posuvu.
- [ ] Pokud se přebírají taháky a výzvy: data sezóny upravená, obsah pro 8. třídu napsaný a zkontrolovaný, rodina bez zaplacené sezóny výzvu nevidí.
