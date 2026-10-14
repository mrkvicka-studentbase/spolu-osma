# Téma 7 — Shoda přísudku s podmětem: naostro lekce (Spolu 8)

Verze 1.1, 14. 10. 2026 (1.1 = korektura ÚJČ a opravy korektora). Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, Nejistoty), korektora (Ověření ÚJČ), autora nahrávek (Nahrávky). Lekce: `obsah/cestina/lekce/cj-t7-l25n.json` až `cj-t7-l28n.json` (dvojčata učebních lekcí `cj-t7-l25` až `cj-t7-l28`, rozpis učebních lekcí `TEMA-7.md`).

**Závazné vstupy:** `ZADANI-OSMA.md` (§3, §4, §8, §9), `PLAN-ROZSIRENI.md` §3, `OSNOVA.md` (§1–§4, §11, §16), `FORMAT-CJ.md`, `TYPY-CHYB.md`, `TERMINOLOGIE.md`, `AUDIO.md`, `obsah/SABLONA.md` §4, §8, §9, §18, §19.

## Společné pro všechny čtyři lekce

- **Hlavička** jako učební lekce: `tema` beze změny, `kapitola` `shoda`, `tyden` 7, `poradi` 1–4, `faze` `osma`, `cas_min` 25 (4 + 5 + 5 + 5 + 6). Id `cj-t7-l<n>n`, úlohy `…n-U1` až `U5`, poslední krok `final`.
- **Struktura** jako učební lekce: poslech v L25n a L27n v U3, L28n má diktát a týdenní kontrolu (`tydenni: true`, `semafor_tydne`).
- **Těžší / objemnější:**
  - víc položek: 8 mezer místo 6, 10 místo 8 (L28n má 10 mezer jako učební, zato diktát se 6 hlídanými slovesy místo 4);
  - rozcvičky L26n–L28n mají v každé řadě dvě slovesa;
  - poslechy mají 3 věty a 3 otázky;
  - detektiv má 4 slovesa místo 2–3 a past i ve správné větě;
  - diktát 4 věty a 6 hlídaných sloves místo 4;
  - zrádnější podměty (javory, rohlíky, telata, kamna, „ti“ až na konci řady podmětů, zvíře jako „ti“) a smíšené jevy z celé lekce.
- **Vše nové:** žádná věta, mezera ani příklad z učební lekce. Kontrolováno skriptem: žádná shodná věta, žádné sloveso z mezer nebo diktátu dvojčete. Stejné typy chyb ano.
- **Méně opory:** `uvod_pro_rodice` říká, že jde o naostro (2 věty). „Platí“ je jen připomenutí s příklady, které v úlohách nejsou. Tahák je plný a `vysvetleni` říká, v čem je úloha těžší než v učební lekci.
- **„Dnes samo“:**
  - žádná otázka taháku neobsahuje hodnocený tvar ani chybné slovo detektiva (kontrolováno skriptem);
  - otázky k detektivovi jsou obecné a platí pro všechna jeho slovesa;
  - „Platí“ a slovníček neobsahují žádné hodnocené sloveso.
- **Hodnoty mezer:** `["i","y","a"]`, u nevyjádřeného podmětu jen `["i","y"]` (jako v učebních lekcích).
- **Co se nehodnotí:** přísudek před několikanásobným podmětem, podmět s *s*, *my/vy* ani střední rod j. č. v řadě podmětů (OSNOVA §16). Mezery jsou jen koncovky příčestí. Žádné přídavné jméno v přísudku.
- **Kódy chyb** jen z `TYPY-CHYB.md`:
  - podmět: `podmet-za-predmet`, `podmet-prvni-slovo`, `podmet-prisudek-zamena`;
  - shoda: `shoda-y-za-i`, `shoda-i-za-y`, `shoda-y-za-a`, `shoda-podle-blizkeho-slova`, `shoda-nekolikanasobny-y`, `shoda-nevyjadreny-neurcen`, `shoda-deti-i`, `shoda-rodice-lide-y`;
  - detektiv: `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby`.
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv; Honzík nikde. *Lucka* jen v 1. pádě (heslo v příručce není).
- **Slovní limity SABLONA §4** ověřeny skriptem (`/tmp/naostro-cj7/limity.py`): 0 překročení.

---

## LEKCE 25n — Shoda s jedním podmětem (`cj-t7-l25n`) · poslech U3

Těžší než L25:
- rozcvička: podmět je věc (budík, mobil), nebo stojí na začátku vedle slova, které jen říká čí;
- 8 mezer místo 6 se zrádnějšími podměty (javory, rohlíky, autobusy → y; telata, jablka → a);
- poslech: 3 věty a 3 otázky (nevyjádřený podmět i podmět za slovesem);
- detektiv: 4 slovesa, past „slovo u slovesa“ dvakrát, jednou správně;
- kontrolní: 10 mezer místo 8.

**Platí:** `Kdo, co to dělá? → podmět` · `ti → i · ty → y · ta → a` · `ti sousedé · ty lampy · ta vrata`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (Z4) | 4 × `dlazdice` (podmět): A) Ráno mi zazvonil budík. · B) Dárek pro babičku koupila nakonec Klára. · C) Mobil mého bratra spadl do vody. · D) Ve škole zapomněl klíče Adam. | budík, Klára, Mobil, Adam | Ráno → `podmet-prvni-slovo`; Dárek, klíče → `podmet-za-predmet`; sloveso → `podmet-prisudek-zamena`; mi, babičku, bratra, vody, škole obecná |
| U2 nová | `doplnit_pismeno` 8 mezer: Kamarádi … povzbuzoval_ · Rohlíky … zhnědl_ · Javory … zežloutl_ · Telata … pil_ · Spolužačky … dopsal_ · Jablka … zčervenal_ · Hasiči … vytáhl_ · Autobusy … měl_ | i, y, y, a, y, a, i, y | m0 y → `shoda-y-za-i`; m2 i → `shoda-i-za-y`; m3 y, m5 y → `shoda-y-za-a` |
| U3 nová, **poslech** | `t7/l25n-u3.mp3`; k1 „Kdo nám ukázal auto?“ (hasiči · holky · dvůr · nikdo); k2 „ukázal_“ (i · y); final „půjčil_“ (i · y · a) | hasiči · i · y | k1 holky, nikdo → `shoda-nevyjadreny-neurcen`; k2 y → `shoda-y-za-i`; final i → `shoda-i-za-y` |
| U4 detektiv | „Po zápase zpívali v šatně hráči. Dresy všech hráčů spadly z lavice. Kopačky brankářů **viseli** na háčku. Trenéři je pak uklidili do tašek.“ k1 klik; final „Které slovo určuje správnou koncovku?“ hráči · Dresy · hráčů · Kopačky · brankářů · Trenéři | k1 [14] · final Kopačky | k1 jiná slova → `detektiv-jine-slovo`; final brankářů → `shoda-podle-blizkeho-slova`, ostatní → `detektiv-oprava-jine-chyby` |
| U5 kontrolní | `doplnit_pismeno` 10 mezer (zoo): navštívil_ (žáci) · je vítal_ (kamarádky) · Mláďata opic skákal_ · Lvi … lenošil_ · Holky si je fotil_ · Potom poslal_ fotky (jen i/y) · Sovy … zíral_ · Křídla papoušků svítil_ · mával_ ošetřovatelé · zvířata vrátil_ | i, y, a, i, y, y, y, a, i, a | m0 y → `shoda-y-za-i`; m2 y, m7 i → `shoda-podle-blizkeho-slova`; m5 i → `shoda-nevyjadreny-neurcen` |

## LEKCE 26n — Shoda s více podměty (`cj-t7-l26n`)

Těžší než L26:
- rozcvička: v každé řadě dvě slovesa, k tomu slovo *je* místo podmětu;
- 8 mezer místo 6: tři podměty, „ti“ na konci (strýc, pes) nebo zvíře (kozel);
- klik na podměty, kde past (předmět *kluky*) je „ti“, takže mění písmeno;
- detektiv: 4 slovesa, chyba až ve třetí větě, „ti“ je poslední ze tří podmětů;
- kontrolní: 10 mezer místo 8 (i *mráz a vítr* → y, *vrata a okna* → a).

**Platí:** `Aspoň jeden „ti“? → i` · `všechno „ta“ → a · jinak y` · `Děda a babičky byli doma.`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (L25) | 4 × 2 mezery: A) Ve vesnici ještě svítil_ okna. Fanoušci na tribuně tleskal_. · B) Plavky kluků spadl_ z plotu. Koťata je našl_ v trávě. · C) Kluci z plaveckého oddílu jedou na závody. Ráno si balil_ osušky a vyrazil_ k autobusu. (jen i/y) · D) Na louce hořel_ ohně. Housata na dvoře syčel_. | A a, i · B y, a · C i, i · D y, a | A `shoda-y-za-a`, `shoda-y-za-i`; B i → `shoda-podle-blizkeho-slova`, y → `shoda-y-za-a`; C y → `shoda-nevyjadreny-neurcen`; D i → `shoda-i-za-y`, y → `shoda-y-za-a` |
| U2 nová | 8 mezer: Teta, sousedka a strýc přišl_ · Kozy a kozel přeskočil_ · Jablka a rajčata zčervenal_ · Sešity a pravítka chyběl_ · Klára, její sestry a jejich pes doběhl_ · Javory a lípy zežloutl_ · Selata a jehňata zíval_ · Okna a dveře se otevřel_ | i, i, a, y, i, y, a, y | m0 y, m4 y → `shoda-nekolikanasobny-y`; m2 y → `shoda-y-za-a`; m5 i → `shoda-i-za-y`; m1 y, m3 a, m6 y, m7 a obecná (v taháku) |
| U3 nová | k1 `klik_ve_textu` „Klára, Lucka a jejich kamarádka pozval_ na oslavu kluky z oddílu.“; final „pozval_“ i · y · a | k1 [0, 1, 4] · final y | k1 oslavu, kluky → `podmet-za-predmet`, sloveso → `podmet-prisudek-zamena`; final i → `shoda-i-za-y` |
| U4 detektiv | „Klára, Ema a jejich bratranec přijeli v sobotu na hory. Batohy a lyže ležely celou cestu v kufru. Babička, máma a jejich pes je na chatě **vítaly**. Kočky a koťata lenošily na gauči.“ final „Proč je to slovo špatně?“ | k1 [26] · final „Mezi podměty je „ti““ | k1 jiná slova → `detektiv-jine-slovo`; final ostatní důvody → `detektiv-oprava-jine-chyby` |
| U5 kontrolní | 10 mezer (sníh): Adam, Tomáš a jejich sestry postavil_ · Spolužačky a spolužáci … udělal_ · Sáňky a kola visel_ · Vrabci a sýkory sbíral_ · Vrata a okna tělocvičny se zavřel_ · lyžoval_ kluci · (Klára a její bratr …) Ráno dostal_ (jen i/y) · Učitelky a kuchařky se usmíval_ · Hříbata a telata … nevylezl_ · Mráz a vítr … zesílil_ | i, i, y, i, a, i, i, y, a, y | m0 y → `shoda-nekolikanasobny-y`; m4 y → `shoda-y-za-a`; m5 y → `shoda-y-za-i`; m6 y → `shoda-nevyjadreny-neurcen` |

## LEKCE 27n — Děti, lidé, rodiče, koně (`cj-t7-l27n`) · poslech U3

Těžší než L27:
- rozcvička: dvě slovesa v řadě, „ti“ na konci, zvíře mezi podměty;
- 8 mezer místo 6: děti za slovesem, rodiče se slovem *spolužaček*, dvojice děti a rodiče, hříbata (a);
- poslech: koně, děti i rodiče, 3 otázky;
- detektiv: chyba u dětí za slovesem vedle slova *koním*, past koně a lidé ve správných větách;
- kontrolní: 10 mezer místo 8.

**Platí:** `ty děti → y` · `ti lidé, rodiče, koně → i` · `Děti zpívaly, lidé poslouchali.`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (L26) | 4 × 2 mezery: A) Teta a strýc letěl_ k moři. Kufry a tašky dorazil_ později. · B) Kůzlata a jehňata skákal_ po louce. Rohlíky a buchty spadl_ na zem. · C) Křečci a myši vylezl_ z klece. Ryby a vydry plaval_ v potoce. · D) Mikiny a ponožky chyběl_ v tašce. Ema, Lucka a kamarád doběhl_ do cíle. | A i, y · B a, y · C i, y · D y, i | y u „ti“ → `shoda-nekolikanasobny-y`; y u kůzlat → `shoda-y-za-a`; i u kufrů, rohlíků, ryb, mikin → `shoda-i-za-y` |
| U2 nová | 8 mezer: Děti … namaloval_ · Rodiče spolužaček tleskal_ · Lidé … vstal_ · Na zahradě sbíral_ děti · Koně … vytáhl_ · Hříbata … pil_ · Děti … nasypal_ · Děti a jejich rodiče se vrátil_ | y, i, i, y, i, a, y, i | m0 i, m3 i → `shoda-deti-i`; m1 y, m2 y → `shoda-rodice-lide-y`; m4 y (koně), m5 y, m6 i, m7 y obecná (v taháku) |
| U3 nová, **poslech** | `t7/l27n-u3.mp3`; k1 „Kdo nosil koním jablka?“ (rodiče · děti · koně · rodiče i děti); k2 „nosil_“ (i · y · a); final „fotil_“ (i · y · a) | děti · y · i | k2 i → `shoda-deti-i`; final y → `shoda-rodice-lide-y`; k1 a ostatní obecná |
| U4 detektiv | „V neděli začaly na jízdárně závody. Koně přeskočili všechny překážky. Lidé na tribuně fandili. Po závodech koním **čistili** kopyta děti z oddílu.“ final „Co řekneš před podmět toho slova?“ ti · ty · ta | k1 [17] · final ty | k1 jiná slova → `detektiv-jine-slovo`; final ti → `shoda-deti-i`, ta → `detektiv-oprava-jine-chyby` |
| U5 kontrolní | 10 mezer (den dětí v parku): přicházel_ … děti · Rodiče na ně mával_ · Trenérky … a jejich kolega udělal_ · Koně … dostal_ · Kozy a kůzlata lízal_ · Lidé … nakupoval_ · Kola rodičů visel_ · (Děti … mají stánek.) Celý den v něm vařil_ (jen i/y) · vyhrál_ soutěž holky · Rodiče a děti zůstal_ | y, i, i, i, y, i, a, y, y, i | m0 i → `shoda-deti-i`; m1 y → `shoda-rodice-lide-y`; m6 i → `shoda-podle-blizkeho-slova`; m9 y → `shoda-nekolikanasobny-y` |

## LEKCE 28n — Kontrola tématu: shoda (`cj-t7-l28n`) · diktát

Těžší než L28:
- rozcvička: dvě slovesa v řadě, celé téma;
- klik: 5 podmětů ve 4 větách místo 4 ve 3, třikrát za slovesem, předmět na začátku tří vět;
- 8 mezer místo 6;
- detektiv: chyba ve schovaném podmětu (nejzrádnější typ), podmět za slovesem ve dvou správných větách;
- diktát: 6 hlídaných sloves místo 4 (22 slov);
- doplňovačka: 10 mezer jako učební (korektor zkrátil z 12 podle návrhu v Nejistotách, aby se úloha vešla do 6 minut).

**Platí:** `Kdo, co? → ti/ty/ta → i/y/a` · `víc podmětů: jeden „ti“ stačí` · `chybí podmět? hledej dřív v textu`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (L25–L27) | 4 × 2 mezery: A) Na stadionu trénoval_ běžci. Láhve běžců se rozbil_ na dráze. · B) Psi a kočky ze sousedství se vrátil_ domů. Švestky na zahradě zmodral_. · C) Na koupališti lízal_ děti zmrzlinu. Rodiče zatím četl_ noviny. · D) Lidé z vesnice mají dnes slavnost. Ráno ozdobil_ náves. (jen i/y) Koně ze statku vytáhl_ vůz na kopec. | A i, y · B i, y · C y, i · D i, i | A `shoda-y-za-i`, `shoda-podle-blizkeho-slova`; B `shoda-nekolikanasobny-y`, `shoda-i-za-y`; C `shoda-deti-i`, `shoda-rodice-lide-y`; D y → `shoda-nevyjadreny-neurcen`, koně y obecná |
| U2 nová | `klik_ve_textu` max 9: „Sbírku hraček uspořádala o víkendu Lucka. Tomáš a Ema přinesli plyšáky a stavebnice. Krabice od sousedů nám donesl Adam. Hračky potom do dětského domova odvezli její rodiče.“ | [5, 6, 8, 18, 26] Lucka, Tomáš, Ema, Adam, rodiče | Sbírku, plyšáky, stavebnice, Krabice, Hračky → `podmet-za-predmet`; slovesa → `podmet-prisudek-zamena`; hraček, sousedů, nám, její obecná |
| U3 nová | 8 mezer: Šály kluků visel_ · Děti a jejich babička upekl_ · Housata a kuřata našl_ · Na zastávce zíval_ lidé · Svetry a ponožky uschl_ · (Tomáš a jeho sestry …) balil_ (jen i/y) · U potoka pil_ koně · V bazénu plaval_ děti | y, y, a, i, y, i, i, y | m0 i → `shoda-podle-blizkeho-slova`; m2 y → `shoda-y-za-a`; m3 y → `shoda-rodice-lide-y`; m7 i → `shoda-deti-i`; m1 i, m5 y, m6 y obecná (v taháku) |
| U4 detektiv | „V sobotu přijeli kluci z oddílu k řece. U mostu **pomohly** sousedkám s čluny. Na řece je potkaly holky z vodáckého kroužku. Nad řekou letěly volavky.“ final „Které slovo určuje správnou koncovku?“ kluci · sousedkám · čluny · holky · volavky | k1 [10] · final kluci | k1 jiná slova → `detektiv-jine-slovo`; final sousedkám → `shoda-podle-blizkeho-slova`, čluny → `shoda-nevyjadreny-neurcen`, holky, volavky → `detektiv-oprava-jine-chyby` |
| U5 kontrolní **týdenní** | k1 `diktat` 4 věty (viz Nahrávky), `max_prehrani` 2, `hodnotit_interpunkci` false, `hodnotit_velikost` false; final 10 mezer (lyžák): vyrazil_ žáci · je doprovodil_ rodiče · instruktoři a učitelky ukázal_ · Lyže a hůlky spadl_ · Děti … sjel_ · Lidé … fandil_ · Pyžama a trička kluků se válel_ · V chatě hořel_ kamna · (Holky … už spí.) Předtím ještě rozesmál_ kluky (jen i/y) · děti a instruktoři vyfotil_ | diktát bez chyb · final i, i, i, y, y, i, a, a, y, i | diktát `chyby_ocekavane` (holé kódy): (0,3) šli `shoda-nekolikanasobny-y`; (1,1) běžely, (1,5) házely `shoda-deti-i`; (2,1) tleskali, (2,3) fotili `shoda-rodice-lide-y`; (3,3) skákala `shoda-y-za-a` · final m1 y → `shoda-rodice-lide-y`; m2 y → `shoda-nekolikanasobny-y`; m6 i → `shoda-podle-blizkeho-slova`; m8 i → `shoda-nevyjadreny-neurcen` |

`semafor_tydne` (z `final`, 10 mezer): zelená 9–10 (~90 %), oranžová 7–8 (~70 %), červená 0–6 (jako učební L28).

**Diktát slovo po slově (OSNOVA §2.2):**
- Věty: *Děda a teta **šli** na nádraží. · Děti **běžely** k řece a **házely** kameny. · Rodiče **tleskali** a **fotili**. · Koťata a štěňata **skákala** po zahradě.*
- Koncovky *-li/-ly/-la* = jev T7.
- Ostatní slova jen Z5: *Děda, Děti* (dě), *nádraží* (ží), *řece* (ře), *kameny* (ny), *Rodiče* (di), *fotili* (ti), *Koťata, štěňata* (ťa, tě, ňa), *zahradě* (dě), *teta, na, k, a, po*.
- Žádné *i/í/y/ý* po obojetné souhlásce v kořeni ani v příponě, žádná předložka *s/z*, žádné *mě/mně*, žádné vlastní jméno ani přídavné jméno.
- 22 slov (učební L28 16).

---

## Nahrávky (pro AUDIO.md)

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t7/l25n-u3.mp3` | cj-t7-l25n / úloha 3 (`k1` i `k2` i `final`) | poslech | Ve čtvrtek přijeli na školní dvůr hasiči. Nejdřív nám ukázali své auto. Helmy si potom půjčily holky z naší třídy. | Oznamovací intonace, nic nezdůrazňovat (hlavně ne „ukázali“, „půjčily“, „holky“); mezi větami pauza asi 0,7 s. Cca 8 s. | čeká na Pavla |
| `t7/l27n-u3.mp3` | cj-t7-l27n / úloha 3 (`k1` i `k2` i `final`) | poslech | O prázdninách jsme byli na farmě. Koně se pásli u lesa a děti jim nosily jablka. Rodiče zatím lenošili na lavičce a fotili je. | Oznamovací intonace, nic nezdůrazňovat (hlavně ne „děti“, „nosily“, „rodiče“, „fotili“); mezi větami pauza asi 0,7 s. Cca 9 s. | čeká na Pavla |
| `t7/l28n-d1.mp3` | cj-t7-l28n / úloha 5 (diktát, věta 1) | diktát | Děda a teta šli na nádraží. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t7/l28n-d2.mp3` | cj-t7-l28n / úloha 5 (diktát, věta 2) | diktát | Děti běžely k řece a házely kameny. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t7/l28n-d3.mp3` | cj-t7-l28n / úloha 5 (diktát, věta 3) | diktát | Rodiče tleskali a fotili. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t7/l28n-d4.mp3` | cj-t7-l28n / úloha 5 (diktát, věta 4) | diktát | Koťata a štěňata skákala po zahradě. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. Dlouhé á v „skákala“ zřetelně. | čeká na Pavla |

**Celkem 6 nahrávek** (2 poslechy, 4 věty diktátu). Do `AUDIO.md` je sloučí vedoucí. Do té doby validátor hlásí jen „nahrávka nemá řádek v AUDIO.md“ (10 chyb ve 3 lekcích, jiné chyby 0).

---

## Ověření ÚJČ

14. 10. 2026 přes `bash nastroje/ujc.sh`. **Server neodpovídal** (pokus v 18:45, „ÚJČ neodpověděl“ po třech pokusech; omylem ještě jeden dotaz na „usmívat se“). Podle doplňku vedoucího jsem proto **všechna neověřená slova nahradil slovy z cache** se stejným jevem (např. *zamrznout, svíčka, tričko, pyžamo, morče, vozit, utíkat* → jiná slova). Každé heslo v `kontrola.zdroj` je v cache a má tabulku (rod, 1. p. mn. nebo příčestí činné).

| jev / tvar | lekce | výsledek v ÚJČ |
|---|---|---|
| shoda s jedním podmětem: m. živ. → *-i*, m. neživ. a ž. → *-y*, s. → *-a*; *děti* → *-y*; *rodiče, koně* → *-i* | vše | id=600 |
| několikanásobný podmět před přísudkem: aspoň jedno m. živ. (i v j. č.) → *-i*; všechna s. v mn. č. → *-a*; jinak *-y* (i dvě m. neživ. v j. č.: *mráz a vítr zesílily*, srov. id=601 *Hrad a celé město … byly*) | 26n–28n | id=601 |
| nevyjádřený podmět podle výrazu v předcházející větě | 25n–28n | id=602 |
| rod a 1. p. mn. podmětů: *javor, rohlík, autobus, sešit, kufr, batoh, oheň, gauč, kopec, mráz, člun* m. neživ.; *kamarád, hasič, žák, hráč, trenér, ošetřovatel* (1. p. mn. *ošetřovatelé*), *fanoušek* (*fanoušci*), *běžec* (*běžci*), *kozel, křeček* (*křečci*), *strýc, bratranec, kolega, instruktor, učitel, pes, kluk* m. živ.; *člověk* → *lidé*; *rodič* → *rodiče*; *kůň*, *lev* m. živ. (zvíře) | 25n–28n | tabulky hesel |
| střední: *tele* (*telata*), *mládě, jehně, sele, kůzle, hříbě, kotě, house, rajče, jablko, křídlo, okno, kolo, pravítko, pyžamo, tričko*; pomnožná *kamna, vrata* (s.), *dveře, plavky, sáňky* (ž.); *dítě* → *děti* | 25n–28n | tabulky hesel |
| ženský rod: *kopačka, osuška, láhev* (1. p. mn. *láhve*), *lyže* (j. i mn. č. stejně, jen v řadě podmětů), *hůlka, mikina, ponožka, myš, vydra, ryba, sova, opice, kočka, koza, sýkora, švestka, lípa, volavka, holka, sestra, teta, máma, babička, sousedka, kamarádka, spolužačka, učitelka, kuchařka, trenérka, šála, buchta* (pečivo) | 25n–28n | tabulky hesel |
| příčestí činné: *zhnědl, zežloutl, upekl, uschl* (i *uschnul*, vytištěno *uschl_*), *vylezl, rozbil, vytáhl, sjel, našel* (*našl_*), *šel* (*šli*), *přišel* (*přišl_*), *doběhl, spadl, četl, pásl, začal, otevřel, zavřel, zapomněl* (i *zapomenul*, jen dlaždice) a pravidelná *-al/-il/-el* (*povzbuzoval, dopsal, zčervenal, zmodral, lízal, vařil, zesílil, hořel, syčel, letěl, pil, měl, chyběl, zíval, lenošil, svítil, mával, skákal, zíral, vítal, fotil, nosil, čistil, tleskal, vstal, nasypal, sbíral, namaloval, nakupoval, udělal, zůstal, vyhrál, plaval, balil, běžel, házel, trénoval, ozdobil, visel, usmíval se, lyžoval, postavil, přicházel, doprovodil, rozesmál, dorazil, poslal, pomohl, válel, vyfotil, zpíval, koupil, zazvonil, uklidil, pozval, přijel, vyrazil, vrátil, fandil, navštívil, ukázal, půjčil, potkal, dostal, přeskočil*) | 25n–28n | tabulky hesel |
| diktát L28n: *děda, teta, jít, nádraží, dítě, běžet, řeka, házet, kámen, rodič, tleskat, fotit, kotě, štěně, skákat, zahrada* | 28n | tabulky hesel |

Odkazy jsou v `kontrola.zdroj` každé lekce: id=600, 601, 602 (L25n jen 600, 602, k tomu id=lev_1) a 69–90 hesel.

**Korektura 14. 10. 2026 (korektor, nezávisle na autorovi):** server ÚJČ večer odpovídal. Znovu přečteny tabulky všech hodnocených hesel (rod a 1. p. mn. každého podmětu, příčestí činné každého slovesa v mezerách, diktátu a přepisech) a výklady id=600 (i odstavec „Rodiče, lidičky, koně“: *koně* jako zvíře → *-i*), id=601 (několikanásobný podmět; *Garáž i auto byly*, *Hrad a celé město … byly*), id=602 (shoda podle výrazu v předcházející větě). Nově dotázáno: *dorazit, mráz, zesílit, pyžamo, člun, válet* (vše potvrzeno), z cache *tričko, poslat, fotka, pomoct* (*pomohl*), *sousedka*. Jazykové chyby v hodnocených tvarech: 0 (žádná dubleta v hodnoceném místě, žádný sporný jev OSNOVA §16). Úpravy viz Nejistoty (vyřešeno). *Lucka* heslo nemá (příručka vrátí *Lucko*), v odkazech proto není.

---

## Nejistoty

**Jazykové:**
- **Vyřešeno korektorem 14. 10. (rozhodnutí vedoucího):**
  - L28n U4: nesmyslná Petrova věta „Lodě a vesty si půjčily“ → „U mostu **pomohly** sousedkám s čluny.“ Schovaný podmět *kluci* z věty předtím (id=602) → *pomohli*; Petr se řídil slovem *sousedkám* u slovesa, věta s jeho chybou dává smysl. k1 [10], final kluci (sousedkám → `shoda-podle-blizkeho-slova`, čluny → `shoda-nevyjadreny-neurcen`).
  - L26n U5: „Sníh a vítr sílily“ (sníh nesílí) → „Mráz a vítr k večeru zesílily“ (stejný jev, *y*).
  - L27n U1 A: „Kufry a tašky přišly později“ → „Kufry a tašky dorazily později“.
  - L28n U5: „Mýdla a zrcadla kluků chyběla v koupelně“ → „Pyžama a trička kluků se válela všude po zemi“ (stejný jev, *a*, past *kluků*; *ležel_* je v učební L28, proto *válel_*). Úloha zkrácena na 10 mezer (bez *zčervenal_* a *vyprávěl_*), prahy 9 / 7, aby se vešla do 6 minut.
  - L25n U5: „Holky si je fotily. Potom vyrazil_ k pavilonu hrochů.“ šlo číst i jako celou třídu (*žáci* → *vyrazili*) → „Potom poslal_ fotky rodičům.“ (posílá jen ten, kdo fotil: holky → *y*).
  - Dnes samo: L25n U1 otázka C („Spadl tam bratr, nebo něco jiného?“) a L26n U3 otázka ke kroku 1 („A kluci něco dělali?“) přepsány, aby nevylučovaly nabídky; červené L25n U4, L26n U2 a U5 s papírem a tužkou (bez nůžek a předmětů); L26n U5 „u sání“ → „u sáněk“; L25n U3 typická chyba zmiňuje i dlaždici *dvůr*.
- **L26n U5 m6:** „Klára a její bratr jsou dnes doma. Ráno dostal_ horečku.“ Horečku dostali oba (nevyjádřený několikanásobný podmět, *bratr* = ti → *i*). Jednotné číslo (*dostal*) v nabídce není, mezera má jen i/y.
- **L26n U5 m9:** „Mráz a vítr k večeru zesílil_.“ → *zesílily*. Dvě m. neživ. v j. č. dávají podle id=601 *-y*, pro dítě je to ale nečekané. Tahák (test „žádný ti“) to pokrývá.
- **Stylistika:** L27n U5 „Kola rodičů visela na stojanu“ korektor ponechal (stojan, na který se kola věší, je běžný).
- *kluk, holka* jsou hovorová (spisovná) slova, ponechána jako v učebních lekcích.

**Metodické:**
- **Nejvýš 4 známé chyby na krok**, takže některé pasti zůstaly obecnou chybou a jsou jen v taháku:
  - L26n U2 m1, m3, m6, m7;
  - L27n U2 m4–m7;
  - L28n U3 m1, m5, m6;
  - L27n U3 k1.
- **L25n U3 `k2`** má jen dvě dlaždice (i · y) jako učební L25 (nevyjádřený podmět, *a* by šlo číst jako ž. j. č.).
- **Rozcvičky L26n–L28n mají dvě slovesa v řadě** (8 mezer místo 4). Ve 4 minutách by to mělo jít (jedna mezera ≈ 15 s), ověří pilot.
- **L28n U5:** zkráceno korektorem na 22 slov diktátu + 10 mezer (učební 16 + 10), prahy 9 / 7. Délku ověří pilot.

**Návrhy kódů (v JSON nepoužity):**
- `shoda-nekolikanasobny-a` (už navržen v `TEMA-7.md`): *a* u řady podmětů, kde nejsou všechny „ta“. V naostro lekcích by dostal L26n U2 m3, m7 (*sešity a pravítka*, *okna a dveře*), L26n U5 m2 (*sáňky a kola*), L27n U5 m4 (*kozy a kůzlata*) a L28n U3 m4. Vedoucí 14. 10.: nový kód ne, zůstává obecná chyba.
- Rozšíření popisu `shoda-rodice-lide-y` o *koně* (id=600). Dostaly by ho L27n U2 m4, L27n U5 m3 a L28n U1 D, U3 m6. Vedoucí 14. 10.: popis se nemění.

**Validátor / web:**
- Bez nálezů. Validátor slovní limity nehlídá (známé), kontrolováno skriptem.
- `node --test` cestina, tisk-cj, samo, seed-cj, plan-roku: 64 / 64.
