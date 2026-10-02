# Téma 2 — Podstatná jména: vzory a koncovky (Spolu 8)

Verze 1.0, 1. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, Poznámky na konci), korektora (oddíl Ověření ÚJČ, Nejistoty), autora nahrávek (oddíl Nahrávky). Podle rozpisu jsou napsané lekce `obsah/cestina/lekce/cj-t2-l5.json` až `cj-t2-l8.json`.

**Závazné vstupy:** `ZADANI-OSMA.md` (§3, §4, §8), `cestina/Obsah/OSNOVA.md` (§2–§4, §6, §16–§18), `FORMAT-CJ.md` s rozdílem Spolu 8 (5 úloh), `TYPY-CHYB.md` (jen kódy odtud), `TERMINOLOGIE.md`, `AUDIO.md`, `obsah/SABLONA.md` §8, §9, §18, §19.

## Společné pro celé téma

- **Lekce:** `faze: "osma"`, `tyden` 2, `poradi` 1–4, `kapitola` `podstatna-jmena`, `cas_min` 25. Úlohy U1 `rozcvicka` 4 min · U2 `nova` 5 · U3 `nova` 5 · U4 `detektiv` 5 · U5 `kontrolni` 6. Poslední krok každé úlohy `final`. Týdenní kontrola = U5 lekce 8 (`tydenni: true`, `semafor_tydne`). Bez diktátu (ZADANI-OSMA §8 bod 2).
- **Indexy slov** v `klik_ve_textu` a `oznac_role` od 0, interpunkce se nepočítá (`vyhodnoceni-cj.js`: slovo = souvislá písmena).
- **Přesné texty hodnot** (stejné ve všech lekcích):
  - vzory: `"pán"`, `"hrad"`, `"muž"`, `"stroj"`, `"předseda"`, `"soudce"`, `"žena"`, `"růže"`, `"píseň"`, `"kost"`, `"město"`, `"moře"`, `"kuře"`, `"stavení"`;
  - životnost: `"životný"`, `"neživotný"`; pády: `"1. pád"` … `"7. pád"`; písmena v doplňovačce `"i"`, `"y"`.
- **`oznac_role` nejvýš 8 rolí v kroku** (ZADANI-OSMA §8 bod 8): rod mužský = 6 vzorů; rod ženský a střední = 8 vzorů; smíšená nabídka (L8 U5 `k1`) = 8 vybraných vzorů (správné + jejich pasti).
- **Životnost bez kategorie:** `oznac_role` s kategoriemi `{zivotnost, vzor}` (OSNOVA L5 U5) nepoužívám, protože `obsah/hlasky.md` nemá názvy skupin `cj.kategorie_zivotnost` ani `cj.kategorie_vzor` a dítě by nad tlačítky vidělo klíč „zivotnost“. Životnost se měří přes vzor (*strom* → pán = `zivotnost-podle-vyznamu`) a v L8 U1 dlaždicemi.
- **Doplňovačky:** jen volba *i × y* v koncovce podstatného jména (OSNOVA §6 Hranice), přednostně po obojetných souhláskách *b, l, m, p, s, v, z* (po *d, t, n* je rozdíl slyšet). Žádná slovesa v minulém čase, jejichž podmětem je doplňované jméno (shoda by napověděla). Neověřuje se 6. p. *-u × -e*, 3./6. p. *-ovi × -u* ani *-i × -ové*; dubleta *-i/-ové* (*kosi/kosové*) v mezeře nevadí, protože mezera má jen *i/y* a *kosy* je chyba v každém výkladu.
- **Známé chyby doplňovačky:** `vyhodnoceni-cj.js` páruje záznam `hodnota` jen tehdy, když sedí všechny jeho ne-null pozice; proto má každá známá chyba jednu mezeru a při limitu 4 jsou kódy jen u čtyř nejtypičtějších mezer. Ostatní mezery = obecná chyba (v taháku jsou zmíněné).
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv. *Honzík* se nepoužívá (ZADANI-OSMA §8 bod 11). Jména jen v 1. pádě, nic se na nich nehodnotí.
- **Kódy chyb** jen z `TYPY-CHYB.md`: `pad-1-za-4`, `pad-4-za-1`, `pad-2-za-4`, `pad-2-za-6`, `pad-4-za-7`, `zivotnost-podle-vyznamu`, `vzor-pan-za-muz`, `vzor-hrad-za-stroj`, `vzor-ruze-za-pisen`, `vzor-pisen-za-kost`, `vzor-more-za-staveni`, `vzor-muz-za-soudce`, `vzor-pan-za-predseda`, `vzor-more-za-kure`, `vzor-zena-za-predseda`, `koncovka-podst-i-za-y`, `koncovka-podst-y-za-i`, `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby`. Nový kód nepotřebuji (návrh `vzor-muz-za-pan` viz Poznámky).

## Cíl tématu

Dítě u podstatného jména určí vzor (všech 14; u rodu mužského nejdřív životnost testem *vidím ___*, pak 2. pád a konec slova v 1. pádě) a podle vzoru doplní *i/y* v koncovce tak, že vzor řekne ve stejném tvaru (*pod duby → pod hrady → y*; *sokoli krouží → páni → i*).

---

## LEKCE 5 — Vzory rodu mužského (`cj-t2-l5`)

`tema`: „Vzory rodu mužského“ · `kapitola` `podstatna-jmena` · `tyden` 2, `poradi` 1 · poslech U3.

**Cíl:** Dítě testem *vidím ___* rozhodne, jestli je jméno rodu mužského životné, a podle 1. a 2. pádu ho přiřadí k jednomu ze šesti vzorů, i když končí na *-a* (*hokejista*) nebo na *-e* (*průvodce*).

**Úvod pro rodiče:** Dnes dítě přiřazuje jména rodu mužského ke vzorům: rozhodne, jestli je jméno životné (vidím pána, ne pán), a podle 2. pádu vybere vzor.

**Platí:**
1. `Životné: vidím pána, ne pán` — test životnosti (27 znaků)
2. `2. p.: pána, hradu, muže, stroje` — vzor podle 2. pádu (32)
3. `-a předseda · -e soudce` — jména na -a, -e (23)

**Slovníček:** *vzor* (šest vzorů rodu mužského), *rod mužský* (ten), *životné a neživotné* (vidím pána × vidím hrad; strom je neživotný), *pád* (celá řada otázek), *2. pád* (bez pána, hradu, muže, stroje, předsedy, soudce). **Pomůcky:** sešit, propiska.

| úloha | zadání · co měří | vstup a data | správně | známé chyby | hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „V každé řadě urči, v jakém pádě je tučné slovo.“ · Z2: pád jména ve větě otázkou ze slova ve větě | 4 kroky `dlazdice`, popisky „Řada A“…„Řada D“, stejná nabídka: 1. pád · 2. pád · 4. pád · 6. pád · 7. pád. **A)** Na lavičce leží **batoh**. **B)** Adam pozdravil **trenéra**. **C)** Ema vypráví o **filmu**. **D)** Tomáš hraje tenis se **spolužákem**. | A 1. · B 4. · C 6. · D 7. pád | A 4. → `pad-4-za-1` · B 1. → `pad-1-za-4`, 2. → `pad-2-za-4` · C 2. → `pad-2-za-6` · D 4. → `pad-4-za-7` · ostatní obecná | po řadách: A „Leží kdo, co? Leží to samo…?“ · B a C „pozdravil koho, co? vypráví o kom, o čem?“ · D „Jaké krátké slovo stojí před jménem?“ |
| U2 nová (5) | „Ke kterému vzoru patří slovo?“ · čtyři „matoucí“ jména (přiřazení) | 4 kroky `dlazdice`, stejná nabídka ve stejném pořadí: pán · hrad · muž · stroj · předseda · soudce. Popisky „A) učitel“, „B) pokoj“, „C) hokejista“, „D) průvodce“ (v zadání: člověk, který vede výlet). | A muž · B stroj · C předseda · D soudce | A pán → `vzor-pan-za-muz`, soudce → `vzor-muz-za-soudce` · B hrad → `vzor-hrad-za-stroj` · C pán → `vzor-pan-za-predseda` · D muž → `vzor-muz-za-soudce` | „Vezmi slovo učitel. Řekni: vidím ___ a bez ___. Který vzor zní stejně?“ · TCH: u hokejisty pán, u průvodce muž: „Jakým písmenem slovo končí? A vzor?“ |
| U3 nová, **poslech** (5) | „Poslechni si větu. Pak odpověz na dvě otázky.“ · vzor jména, které dítě slyší v jiném pádě | `poslech` `audio/cestina/t2/l5-u3.mp3`, `max_prehrani` 0; přepis viz Nahrávky. `k1` otázka „Ke kterému vzoru patří slovo „dědou“?“: pán · předseda · žena · hrad. `final` „… slovo „souseda“?“: pán · hrad · muž · předseda. Popisky „Otázka 1“, „Otázka 2“. | k1 předseda · final pán | k1 pán → `vzor-pan-za-predseda`, žena → `vzor-zena-za-predseda` · final hrad, muž, předseda → obecná | „Řekni to slovo tak, aby před něj šlo říct ten. Jak končí?“ · TCH: final předseda, protože slyší *-a* (*souseda*): „Řekni to slovo s ten. Jak končí teď?“ |
| U4 detektiv (5) | Petr určoval vzory ve větě **Táta šel se strýcem na hokej.** Napsal: Táta – pán, strýcem – muž, hokej – stroj. Jedna chyba. · `vzor-pan-za-predseda` | `k1` `klik_ve_textu` max 1, tokeny: Táta(0) šel(1) se(2) strýcem(3) na(4) hokej(5); popisek „Klikni na slovo, které Petr určil špatně.“ · `final` `dlazdice` „Jaký vzor má to slovo?“: předseda · muž · stroj · hrad (vzory všech tří slov) | k1 `[0]` · final předseda | k1 `navic [3, 5]` → `detektiv-jine-slovo` · final jiné → `detektiv-oprava-jine-chyby` | „Řekni každé Petrovo slovo s ten a ve 2. pádě s bez. Sedí vzor?“ · TCH: klik na *strýcem*: „Bez strýce, nebo bez strýca?“ (Petr má dobře.) |
| U5 kontrolní (6) | „U každého označeného slova vyber vzor.“ · šest vzorů v textu | `oznac_role`, `role` = 6 vzorů rodu mužského. Text **Správce tábora krmil kocoura pod vysokým stromem. Jeho kolega mu přinesl klíč od jídelny.** Tokeny: Správce(0) tábora(1) krmil(2) kocoura(3) pod(4) vysokým(5) stromem(6) Jeho(7) kolega(8) mu(9) přinesl(10) klíč(11) od(12) jídelny(13); `slova [0, 3, 6, 8, 11]` | `{"0": "soudce", "3": "pán", "6": "hrad", "8": "předseda", "11": "stroj"}` | `{"6": "pán"}` → `zivotnost-podle-vyznamu` · `{"8": "pán"}` → `vzor-pan-za-predseda` · `{"0": "muž"}` → `vzor-muz-za-soudce` · `{"11": "hrad"}` → `vzor-hrad-za-stroj` | R55. TCH: *strom* jako pán: „Vidím strom, nebo vidím stroma?“ |

**Kontrola pro vás (U5):** Správce – soudce (končí na -e); kocoura – pán (vidím kocoura); stromem – hrad (vidím strom, bez stromu); kolega – předseda (končí na -a); klíč – stroj (bez klíče).

Poznámky k L5: *tábora* (2. p. od *tábor*, místo) a *jídelny* nejsou označené. Poslech osnovy „Na hřišti jsem potkal souseda s dědou a jeho psem.“ zkrácen: hlas nahrávky je ženský („jsem potkal“ by nesedělo) a „jeho psem“ jen prodlužuje. *Koník* (OSNOVA) nahrazen *kocourem*: příručka má u *koník* dvě hesla (zvíře; věc „m. živ. i neživ.“), *kocour* jedno.

---

## LEKCE 6 — Vzory rodu ženského a středního (`cj-t2-l6`)

`tema`: „Vzory rodu ženského a středního“ · `poradi` 2 · poslech U3.

**Cíl:** Dítě přiřadí jméno rodu ženského ke vzoru žena, růže, píseň nebo kost a jméno rodu středního ke vzoru město, moře, kuře nebo stavení podle 1. a 2. pádu (*bez písně × bez kosti, bez kotěte*).

**Úvod pro rodiče:** Dnes dítě přiřazuje jména rodu ženského a středního ke vzorům podle toho, jak znějí v 1. a ve 2. pádě (bez ___).

**Platí:**
1. `Vzor podle 1. a 2. pádu (bez ___)` — co rozhoduje (33)
2. `píseň – písně · kost – kosti` — rod ženský (27)
3. `kotě – bez kotěte → kuře` — rod střední (24)

**Slovníček:** *vzor* (8 vzorů), *rod ženský* (ta), *rod střední* (to), *2. pád* (bez ženy … bez stavení), *vzor kuře* (ve 2. pádě přibude kousek: bez kotěte; u moře ne: bez hřiště). **Pomůcky:** sešit, propiska.

| úloha | zadání · co měří | vstup a data | správně | známé chyby | hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „V každé řadě vyber vzor slova.“ · L5 na slovech ze sportu | 4 kroky `dlazdice`, „Řada A“…„D“, nabídka 6 vzorů rodu mužského: **A)** brankář **B)** fotbalista **C)** míč **D)** obránce | A muž · B předseda · C stroj · D soudce | A pán → `vzor-pan-za-muz`, soudce → `vzor-muz-za-soudce` · B pán → `vzor-pan-za-predseda` · C hrad → `vzor-hrad-za-stroj` · D muž → `vzor-muz-za-soudce` | A a D „Řekni obě slova s ten. Jakým písmenem končí?“ · B „Jak to slovo končí?“ · C „vidím ___, bez ___: hrad, nebo stroj?“ |
| U2 nová (5) | „Ke kterému vzoru patří slovo?“ · ženské vzory (přiřazení) | 4 kroky `dlazdice`, nabídka žena · růže · píseň · kost; popisky „A) ulice“, „B) radost“, „C) dlaň“, „D) třída“ | A růže · B kost · C píseň · D žena | A píseň → `vzor-ruze-za-pisen` · B píseň → `vzor-pisen-za-kost` · C kost → `vzor-pisen-za-kost` · ostatní obecná | „Vezmi slovo radost. Řekni bez ___. Končí to jako bez písně, nebo jako bez kosti?“ |
| U3 nová, **poslech** (5) | „Poslechni si větu. Pak odpověz na dvě otázky.“ · střední vzory ve slyšené větě | `poslech` `audio/cestina/t2/l6-u3.mp3`; `k1` „Ke kterému vzoru patří slovo „náměstí“?“, `final` „… „štěnětem“?“; obě nabídky město · moře · kuře · stavení | k1 stavení · final kuře | k1 moře → `vzor-more-za-staveni` · final moře → `vzor-more-za-kure` · ostatní obecná | „Řekni to slovo v 1. pádě s to. Pak řekni bez ___. Přibude kousek slova?“ |
| U4 detektiv (5) | Petr: **Kotě běhalo po hřišti u pole.** Napsal: Kotě – kuře, hřišti – kuře, pole – moře. · `vzor-more-za-kure` | `k1` klik max 1, tokeny Kotě(0) běhalo(1) po(2) hřišti(3) u(4) pole(5) · `final` „Jaký vzor má to slovo?“: moře · kuře · město · stavení | k1 `[3]` · final moře | k1 `navic [0, 5]` → `detektiv-jine-slovo` · final jiné → `detektiv-oprava-jine-chyby` | „Řekni to slovo s bez. Přibude kousek slova jako u kuřete, nebo nepřibude?“ |
| U5 kontrolní (6) | „U každého označeného slova vyber vzor.“ · 8 vzorů ženských a středních | `oznac_role`, `role` = 8 vzorů (žena … stavení). Text **V ulici za nádražím je nové hřiště. Lucka tam s radostí venčí štěně, které jí olizuje dlaň.** Tokeny: V(0) ulici(1) za(2) nádražím(3) je(4) nové(5) hřiště(6) Lucka(7) tam(8) s(9) radostí(10) venčí(11) štěně(12) které(13) jí(14) olizuje(15) dlaň(16); `slova [1, 3, 6, 10, 12, 16]` | `{"1": "růže", "3": "stavení", "6": "moře", "10": "kost", "12": "kuře", "16": "píseň"}` | `{"1": "píseň"}` → `vzor-ruze-za-pisen` · `{"3": "moře"}` → `vzor-more-za-staveni` · `{"6": "kuře", "12": "moře"}` → `vzor-more-za-kure` · `{"10": "píseň", "16": "kost"}` → `vzor-pisen-za-kost` | R55. „Řekni bez hřiště a bez štěněte. U kterého slova přibude kousek?“ |

**Kontrola pro vás (U5):** ulici – růže; nádražím – stavení; hřiště – moře; radostí – kost; štěně – kuře; dlaň – píseň (šest různých vzorů).

Poznámky k L6: U1 má jiná slova než L5 U2 (OSNOVA navrhovala tatáž), aby rozcvička nebyla opisem odpovědí. U4 *Kotě* místo *Kuře* (vzor kuře by se určoval sám sebou). *dlaň* ověřena: příručka 2. p. *dlaně*, ve výkladu id=252 mezi slovy kolísajícími mezi *píseň* a *kost* není.

---

## LEKCE 7 — Koncovky i/y podle vzoru (`cj-t2-l7`)

`tema`: „Koncovky i/y podle vzoru“ · `poradi` 3 · bez poslechu.

**Cíl:** Dítě doplní *i/y* v koncovce podstatného jména po obojetné souhlásce tak, že určí vzor a řekne ho ve stejném tvaru (*s kamarády → s pány → y*; *kamarádi → páni → i*).

**Úvod pro rodiče:** Dnes dítě doplňuje i, nebo y na konci podstatných jmen: určí vzor a dosadí ho ve stejném tvaru, jaký má slovo ve větě.

**Platí:**
1. `Nevím i/y? Dosadím vzor` — pravidlo (23)
2. `s kamarády → s pány → y` — příklad: s kým? (23)
3. `kamarádi (1. p.) → páni → i` — příklad: kdo? (27)

**Slovníček:** *koncovka*, *obojetné souhlásky*, *dosadit vzor*, *vzor* (14), *1. pád množného čísla* (holubi sedí), *4. pád množného čísla* (krmím holuby). **Pomůcky:** sešit, propiska.

| úloha | zadání · co měří | vstup a data | správně | známé chyby | hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „V každé řadě vyber vzor slova.“ · L5–L6 (2 mužská, 1 ženské, 1 střední) | 4 kroky `dlazdice`, nabídky se liší: **A)** kolega: pán · žena · předseda · hrad **B)** koš: hrad · stroj · muž · pán **C)** věc: žena · růže · píseň · kost **D)** letiště: město · moře · kuře · stavení | A předseda · B stroj · C kost · D moře | A pán → `vzor-pan-za-predseda`, žena → `vzor-zena-za-predseda` · B hrad → `vzor-hrad-za-stroj` · C píseň → `vzor-pisen-za-kost` · D kuře → `vzor-more-za-kure` | po řadách: A „Řekni ten kolega. Jak končí?“ · B a C „Řekni slovo s bez.“ · D „Přibude u letiště kousek slova?“ |
| U2 nová (5) | „Doplň i, nebo y.“ · dosazení vzoru | `doplnit_pismeno`, 6 mezer `["i","y"]`: **Holub_(0) sedí na střeše stodol_(1). Ema krmí holub_(2) pod strom_(3). Ps_(4) si hrají s kostm_(5).** | i, y, y, y, i, i | m0 y → `koncovka-podst-y-za-i` · m1 i → `koncovka-podst-i-za-y` · m2 i → `koncovka-podst-i-za-y` · m5 y → `koncovka-podst-y-za-i` · m3 i, m4 y → obecná | „Dosaď vzor pán do obou vět s holubem: ___ sedí, Ema krmí ___.“ · TCH: *Holuby sedí*: „Kdo sedí? Dosaď pán.“ |
| U3 nová (5) | „V každé větě doplň i, nebo y.“ · místo nejčastější chyby: 1. × 4. pád mn. č. životných | 4 kroky `doplnit_pismeno` po 1 mezeře, popisky „Věta A“…„D“: **A)** Na komíně stojí dva čáp_. **B)** V zoo pozorujeme sokol_. **C)** Ve výběhu spí dva lv_. **D)** Tomáš si na výletě fotí čáp_. (přítomný čas, sloveso nenapovídá) | A i · B y · C i · D y | A, C y → `koncovka-podst-y-za-i` · B, D i → `koncovka-podst-i-za-y` | „Zeptej se slovem z věty: kdo stojí? pozorujeme koho? Dosaď vzor pán.“ |
| U4 detektiv (5) | Petr napsal **Sokoli sedí mezi stromi u řeky.** V jedné koncovce chyba. · `koncovka-podst-i-za-y` | `k1` klik max 1, popisek „Klikni na slovo, ve kterém je chyba.“, tokeny Sokoli(0) sedí(1) mezi(2) stromi(3) u(4) řeky(5) · `final` „Který vzor ve stejném tvaru Petrovi pomůže?“: mezi hrady · páni · mezi stroji · u ženy (vzory ke všem třem slovům) | k1 `[3]` · final mezi hrady | k1 `navic [0, 5]` → `detektiv-jine-slovo` · final jiné → `detektiv-oprava-jine-chyby` | „U každého slova s i nebo y na konci najdi vzor a řekni ho ve stejném tvaru.“ · TCH: klik na *Sokoli* (Petr má dobře) |
| U5 kontrolní (6) | „Doplň i, nebo y.“ · koncovky všech rodů | `doplnit_pismeno`, 8 mezer: **Ve středu jedeme s učitel_(0) na výlet. Nad pol_(1) poletují motýl_(2) a u cesty rostou líp_(3). Pod dub_(4) si sedneme s kamarádkam_(5). Na obloze uvidíme za letadl_(6) bílé čáry a nad lesem orl_(7).** | i, i, i, y, y, i, y, y | m2 y → `koncovka-podst-y-za-i` · m4 i → `koncovka-podst-i-za-y` · m6 i → `koncovka-podst-i-za-y` · m5 y → `koncovka-podst-y-za-i` · ostatní obecná | R55. „Zeptej se slovem z věty: kdo poletuje? Uvidíme koho? Dosaď pán.“ |

**Kontrola pro vás (U5):** učiteli (s muži), poli (nad moři), motýli (páni), lípy (ženy), duby (pod hrady), kamarádkami (-mi vždy s i), letadly (za městy), orly (vidím pány).

Poznámky k L7: OSNOVA má v U2 *kamarád_, s kamarád_, s míč_*; po *d* je rozdíl *di/dy* slyšet a po *č* je *i* daný měkkou souhláskou (Z5), proto v mezerách slova po obojetných souhláskách. Detektiv OSNOVY „Honzík hrál fotbal s kamarádi.“ nahrazen (Honzík jen vytištěný, *kamarádi* po *d* slyšet). Platí ponecháno podle OSNOVY (*kamarády, kamarádi* jako známý příklad).

---

## LEKCE 8 — Kontrola tématu: podstatná jména (`cj-t2-l8`)

`tema`: „Kontrola tématu: podstatná jména“ · `poradi` 4 · bez poslechu, bez diktátu · U5 `tydenni: true`.

**Cíl:** Dítě u jmen v textu samo určí vzor a v deseti koncovkách doplní *i*, nebo *y* a u každé řekne, který vzor dosadilo.

**Úvod pro rodiče:** Dnes se nic nového neučí: dítě ukáže, že samo určí vzor podstatného jména a podle něj doplní i, nebo y.

**Platí:**
1. `Vzor: rod + 1. a 2. pád` — co rozhoduje (22)
2. `Dosadím vzor ve stejném pádě` — test (28)
3. `u stodoly → u ženy → y` — příklad (22)

**Slovníček:** *vzor* (14), *životné a neživotné*, *2. pád*, *koncovka*, *obojetné souhlásky*, *dosadit vzor*. **Pomůcky:** sešit, propiska.

| úloha | zadání · co měří | vstup a data | správně | známé chyby | hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | „V řadách A a D vyber vzor, v řadě B životnost, v řadě C doplň i, nebo y.“ · L5–L7 | 4 kroky `dlazdice`: **A)** cyklista: pán · předseda · žena · hrad **B)** strom: životný · neživotný **C)** Tomáš si kreslí do sešitu motýl_.: i · y **D)** nádraží: město · moře · kuře · stavení | A předseda · B neživotný · C y · D stavení | A pán → `vzor-pan-za-predseda`, žena → `vzor-zena-za-predseda` · B životný → `zivotnost-podle-vyznamu` · C i → `koncovka-podst-i-za-y` · D moře → `vzor-more-za-staveni` | B „Řekni: vidím ___. Zní to jako vidím pána, nebo jako vidím hrad?“ · C „Kreslí koho, co? Dosaď vzor pán.“ |
| U2 nová (5) | „U každého označeného slova vyber vzor. Ve větě 1 jsou jména rodu mužského, ve větě 2 rodu ženského a středního.“ · vzory všech rodů (OSNOVA: 6 slov, 14 rolí → 2 kroky po ≤ 8 rolích) | `k1` `oznac_role`, role 6 vzorů rodu mužského, **Fotbalista podal brankáři míč.** tokeny Fotbalista(0) podal(1) brankáři(2) míč(3), `slova [0, 2, 3]` · `final` `oznac_role`, role 8 vzorů rodu ženského a středního, **Na parkovišti u nemocnice spí v noci kotě.** tokeny Na(0) parkovišti(1) u(2) nemocnice(3) spí(4) v(5) noci(6) kotě(7), `slova [1, 3, 6, 7]` | k1 `{"0": "předseda", "2": "muž", "3": "stroj"}` · final `{"1": "moře", "3": "růže", "6": "kost", "7": "kuře"}` | k1: `{"0": "pán"}` → `vzor-pan-za-predseda`, `{"2": "pán"}` → `vzor-pan-za-muz`, `{"2": "soudce"}` → `vzor-muz-za-soudce`, `{"3": "hrad"}` → `vzor-hrad-za-stroj` · final: `{"1": "kuře", "7": "moře"}` → `vzor-more-za-kure`, `{"3": "píseň"}` → `vzor-ruze-za-pisen`, `{"6": "píseň"}` → `vzor-pisen-za-kost` | „Vezmi slovo, u kterého váháš. Řekni ho v 1. pádě s ten, ta nebo to. Pak řekni bez ___.“ |
| U3 nová (5) | „Doplň i, nebo y.“ · pasti koncovek | `doplnit_pismeno`, 6 mezer: **Na plotě sedí dva kos_(0). Adam pozoruje kos_(1) dalekohledem. Mezi sloup_(2) visí síť na volejbal. Táta přijel s pytl_(3) písku a krabicí s věcm_(4). Za plotem štěkají ps_(5).** | i, y, y, i, i, i | m0 y → `koncovka-podst-y-za-i` · m1 i → `koncovka-podst-i-za-y` · m2 i → `koncovka-podst-i-za-y` · m5 y → `koncovka-podst-y-za-i` · m3, m4 y → obecná | „Vezmi slovo kos. Zeptej se v obou větách slovem z věty a dosaď vzor pán.“ |
| U4 detektiv (5) | Petr určoval vzory ve větě **V ulici za školou stojí staré stavení.** Napsal: ulici – píseň, školou – žena, stavení – stavení. · `vzor-ruze-za-pisen` | `k1` klik max 1, tokeny V(0) ulici(1) za(2) školou(3) stojí(4) staré(5) stavení(6) · `final` „Jaký vzor má to slovo?“: růže · píseň · stavení · žena | k1 `[1]` · final růže | k1 `navic [3, 6]` → `detektiv-jine-slovo` · final jiné → `detektiv-oprava-jine-chyby` | „Řekni každé Petrovo slovo v 1. pádě s ta nebo to. Jak končí? Sedí Petrův vzor?“ |
| U5 kontrolní **týdenní** (6) | „Krok 1: u každého označeného slova vyber vzor. Krok 2: doplň i, nebo y.“ · celé téma | `k1` `oznac_role`, role (8): pán · předseda · hrad · stroj · růže · píseň · moře · kuře; **Tátův kolega našel u hřiště pod lavicí malé kotě a klíč.** tokeny Tátův(0) kolega(1) našel(2) u(3) hřiště(4) pod(5) lavicí(6) malé(7) kotě(8) a(9) klíč(10); `slova [1, 4, 6, 8, 10]` · `final` `doplnit_pismeno`, 10 mezer: **V sobotu pojedeme se spolužačkam_(0) na výlet. Sejdeme se ráno u škol_(1) s učitel_(2). Za vesnicí krouží nad pol_(3) sokol_(4). Pod dub_(5) budeme krmit holub_(6). Táta přijede autem s pytl_(7) dřeva. Večer půjdeme se ps_(8) mezi strom_(9).** | k1 `{"1": "předseda", "4": "moře", "6": "růže", "8": "kuře", "10": "stroj"}` · final i, y, i, i, i, y, y, i, y, y | k1: `{"1": "pán"}` → `vzor-pan-za-predseda`, `{"10": "hrad"}` → `vzor-hrad-za-stroj`, `{"6": "píseň"}` → `vzor-ruze-za-pisen`, `{"4": "kuře", "8": "moře"}` → `vzor-more-za-kure` · final: m4 y → `koncovka-podst-y-za-i`, m6 i → `koncovka-podst-i-za-y`, m8 i → `koncovka-podst-i-za-y`, m7 y → `koncovka-podst-y-za-i` | R55. `semafor_tydne` z `final` (10 koncovek): zelená `min_spravne` 9, oranžová 7, červená 0 |

**Kontrola pro vás (U5 final):** se spolužačkami (-mi vždy s i), u školy (u ženy), s učiteli (s muži), nad poli (nad moři), sokoli (páni krouží), pod duby (pod hrady), holuby (krmit pány), s pytli (se stroji), se psy (s pány), mezi stromy (mezi hrady).

Poznámky k L8: OSNOVA U2 „`oznac_role`, 6 slov, 14 rolí“ odporuje ZADANI-OSMA §8 bod 8 (nejvýš 8 rolí) a validátoru; rozděleno na dva kroky po rodech (7 slov). Semafor tématu se počítá z `final` (jako Spolu L12); `k1` (vzory) semafor neovlivní, ale jeho známé chyby rodič vidí. U4 má jiný text než U5 `k1` (*ulice* je v U4, v U5 je *lavice*), aby detektiv neprozradil kontrolu.

---

## Nahrávky (pro AUDIO.md)

Formát podle `cestina/Obsah/AUDIO.md` (hlas Jana, Eleven v4, tempo 0,9 přes ffmpeg). Diktát v tématu 2 není. Řádky jsou nové; starý řádek `t2/l6-u4.mp3` v AUDIO.md patří produktu „Čeština: základy“, nový soubor má jiné ID (`-u3`), ke kolizi nedojde.

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t2/l5-u3.mp3` | 5 / úloha 3 (`k1` i `final`) | poslech | Tomáš potkal na hřišti souseda s dědou. | Oznamovací věta. Nezdůrazňovat „souseda“ ani „dědou“; koncovky „-a“ v „souseda“ a „-ou“ v „dědou“ vyslovit zřetelně, nepolykat. Cca 3 s. | čeká |
| `t2/l6-u3.mp3` | 6 / úloha 3 (`k1` i `final`) | poslech | Na náměstí si hrálo kotě s malým štěnětem. | Oznamovací věta. Nezdůrazňovat „náměstí“ ani „štěnětem“; „štěnětem“ vyslovit celé a zřetelně (slabika „-ně-“ se nesmí ztratit), „náměstí“ s dlouhým „í“. Cca 3 s. | čeká |

**Celkem 2 nahrávky** (poslech), obě ≤ 20 s.

---

## Ověření ÚJČ

Ověřeno 1. 10. 2026 přes `bash nastroje/ujc.sh` (tabulky tvarů; u slov s více hesly přes `--id`). Sloupec „tvar“ = tvar, který se v lekci hodnotí nebo na kterém stojí vzor.

TABULKA_OVERENI

## Nejistoty

NEJISTOTY

## Poznámky pro vedoucího

POZNAMKY
