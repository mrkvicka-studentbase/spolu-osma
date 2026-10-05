# Téma 7 — Shoda přísudku s podmětem (rozpis)

Verze 0.1, 1. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, Poznámky na konci), korektora (oddíl „Ověření ÚJČ“, „Nejistoty“), autora nahrávek (oddíl „Nahrávky“ → `AUDIO.md`).
Lekce jsou napsané: `obsah/cestina/lekce/cj-t7-l25.json` … `cj-t7-l28.json`. Tahák, semafor a `tisk.zadani` jsou v JSON; tady je obsah úloh, data, správné odpovědi, známé chyby a hlavní otázka.

Forma jako `TYDEN-2.md` (Spolu, základy), ale **5 úloh** Spolu 8: U1 rozcvička 4 min · U2 nová 5 · U3 nová 5 · U4 detektiv 5 · U5 kontrolní 6 → `cas_min` 25. Podle `cestina/Obsah/OSNOVA.md` §11.

## Společné pro celé téma

- `kapitola`: `shoda` · `faze`: `osma` · `tyden`: 7 · `poradi` 1–4.
- **Indexy slov** v `klik_ve_textu` od 0, interpunkce se nepočítá (`tokenizuj` ve `vyhodnoceni-cj.js`). V doplňovačce je mezera znak `_` a mezery se číslují od 0.
- **Test místo poučky:** dítě řekne před podmět ve více kusech *ti / ty / ta* → *i / y / a*. Termín životnost má rodič jen ve slovníčku. U neživotných a středních tahák vždy dodává „Jak to řekneš ve škole?“ (v běžné řeči zní *ty kluci, ty kuřata*).
- **Hodnoty mezer:** `["i","y","a"]`. Tam, kde je podmět nevyjádřený (*Potom šl_ …*), jen `["i","y"]`: tvar na *-a* by šel číst jako ženský rod jednotného čísla (*šla*), osnova ho u j. č. ženského nepoužívá.
- **Vyřazeno (ÚJČ id=601, 602, OSNOVA §16):** přísudek **před** několikanásobným podmětem (nikde, všechny několikanásobné podměty stojí před slovesem), podmět s předložkou *s*, *my/vy*, oslovení v mn. č., podměty s dvojím skloňováním, *koně* jako věc, střední rod j. č. v několikanásobném podmětu. Jednoduchý podmět **za** slovesem je v pořádku (id=600, shoda jednoznačná).
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; detektiv Petr. *Honzík* v tématu není.
- **Kódy chyb:** jen z `TYPY-CHYB.md` (oddíl „Podmět, přísudek, shoda“ + detektiv). Žádný nový kód.
- **Nic mimo téma se nehodnotí:** mezery jsou jen koncovky příčestí; ostatní slova jsou vytištěná. Žádná koncovka přídavného jména v přísudku (*byly mokré*), aby nenapovídala.

## Cíl tématu

Dítě najde podmět (i za slovesem, nevyjádřený, několikanásobný), řekne před něj *ti / ty / ta* a doplní *-i / -y / -a* v příčestí (*kluci běželi, holky běžely, auta jela*); zvládne *děti* (→ *y*), *lidé, rodiče, koně* (→ *i*).

---

## LEKCE 25 — Shoda s jedním podmětem (`cj-t7-l25`) · poslech U3

`tema`: „Shoda s jedním podmětem“ · `poradi` 1.

**Cíl:** Dítě najde podmět (i když stojí za slovesem nebo je schovaný ve větě předtím), řekne před něj *ti, ty*, nebo *ta* a podle toho doplní *i, y*, nebo *a* (*kluci běželi, holky běžely, auta jela*).

**Úvod pro rodiče:** Dnes dítě doplňuje koncovku slovesa v minulém čase podle podmětu: najde, kdo nebo co to dělá, řekne před to *ti, ty*, nebo *ta* a podle toho napíše *i, y*, nebo *a*.

**Platí:** `Najdu podmět, řeknu ti/ty/ta` (28 znaků) · `ti → i · ty → y · ta → a` (24) · `ti kluci běželi · ty holky běžely` (33)

**Slovníček:** podmět, přísudek, shoda, *ti / ty / ta*, životnost, nevyjádřený podmět. **Pomůcky:** sešit, propiska.

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (Z4, 4) | V každé řadě vyber podmět. *Měří:* podmět otázkou *kdo, co?* za slovesem, předmět a „kdy“ na začátku. | 4 kroky `dlazdice`, „Řada A“–„D“: **A** *Lucka čte v parku knihu.* čte · Lucka · knihu **B** *Včera vyhrál zápas Adam.* Včera · zápas · Adam · vyhrál **C** *Kočku hladí Ema.* Kočku · hladí · Ema **D** *Do třídy přinesl dort Tomáš.* třídy · Tomáš · dort · přinesl | A Lucka · B Adam · C Ema · D Tomáš | sloveso → `podmet-prisudek-zamena`; knihu, zápas, Kočku, dort → `podmet-za-predmet`; Včera → `podmet-prvni-slovo`; třídy → obecná | Po řadách. C: „Zkus obě otázky: kdo hladí? a hladí koho?“ |
| 2 | nová (5) | Doplň i, y, nebo a. *Měří:* shoda s jedním podmětem před slovesem. | `doplnit_pismeno`, 6 mezer: *Kluci spěchal_0 na trénink. Holky hrál_1 florbal. Auta stál_2 na parkovišti. Stromy u hřiště šuměl_3. Kuřata u babičky pípal_4. Psi u sousedů štěkal_5.* | i, y, a, y, a, i | m0 y → `shoda-y-za-i` · m2 y → `shoda-y-za-a` · m3 i → `shoda-i-za-y` · m4 y → `shoda-y-za-a` · jiné obecná | „U stromů a kuřat to zkus nahlas: ti, nebo ty stromy? Ta, nebo ty kuřata? Jak to řekneš ve škole?“ |
| 3 | nová, **poslech** (5) | Poslechni si nahrávku. Pak odpověz na dvě otázky. *Měří:* nevyjádřený podmět z předchozí věty; *i/y* podle pravidla, ne sluchem. | `poslech` `t7/l25-u3.mp3` (2 věty, ≈ 5 s, text v oddílu Nahrávky). `k1` „Kdo šel na zmrzlinu?“: holky · třída · volejbal · nikdo · `final` „Jaké písmeno patří do „šl_“?“: i · y (bez *a*, viz Společné) | k1 holky · final y | k1 třída, nikdo → `shoda-nevyjadreny-neurcen`; volejbal obecná · final i → `shoda-i-za-y` | „Ve druhé větě chybí, kdo to dělá. Ve které větě to najdeš?“ (šli × šly zní stejně) |
| 4 | detektiv (5) | Petr doplnil koncovky sloves: *Kluci z oddílu přijeli na trénink. Kola kluků stáli u plotu.* Udělal jednu chybu. *Měří:* `shoda-podle-blizkeho-slova`. | `k1` `klik_ve_textu` max 1, tokeny: Kluci(0) z(1) oddílu(2) přijeli(3) na(4) trénink(5) Kola(6) kluků(7) stáli(8) u(9) plotu(10) · `final` „Které slovo určuje správnou koncovku?“: Kluci · Kola · kluků · plotu (slova k oběma slovesům, neprozradí k1) | k1 `[8]` · final Kola | k1 `navic [0,3,6,7]` → `detektiv-jine-slovo` · final kluků → `shoda-podle-blizkeho-slova`; Kluci, plotu → `detektiv-oprava-jine-chyby` | „Podmět nemusí být slovo, které stojí hned u slovesa. Zeptej se u každého slovesa znovu: kdo, co to dělá?“ (typická chyba po odevzdání: „Stáli u plotu kluci? Co tam stálo?“) |
| 5 | kontrolní (6) | Doplň do textu i, y, nebo a. *Měří:* celé L25 (za slovesem, nevyjádřený, slovo u slovesa, střední rod). | `doplnit_pismeno`, 8 mezer (m3 jen i/y): *V sobotu jel_0 kluci z našeho oddílu na závody. Na stadionu už čekal_1 holky z jiných škol. Kluci si vzal_2 dresy. Potom šl_3 na rozcvičku. Míče trenérů ležel_4 v síti u brány. Na tribuně seděl_5 děvčata z naší třídy. Mraky zmizel_6 a začalo svítit slunce. Kola na parkovišti zůstal_7 u stojanu.* | i, y, i, i, y, a, y, a | m0 y → `shoda-y-za-i` · m3 y → `shoda-nevyjadreny-neurcen` (podle *dresy*) · m4 i → `shoda-podle-blizkeho-slova` · m5 y → `shoda-y-za-a` | R55. „Ve větě Potom šl_ na rozcvičku chybí, kdo to dělá. Najdi to ve větě předtím.“ |

**Kontrola pro vás (kontrolní):** jeli (ti kluci), čekaly (ty holky), vzali, šli (kluci z věty předtím, ne dresy), ležely (ty míče; trenérů jen říká čí), seděla (ta děvčata), zmizely (ty mraky), zůstala (ta kola).

Poznámky: osnova navrhovala poslech „Na hřišti hráli kluci fotbal. Potom šli domů.“ — první věta je skoro shodná s diktátem L28 (d1), proto jiná věta se stejným jevem (holky → *y*, aby se lišila od U2 *kluci*). Detektiv: osnova měla *Míče kluků leželi v trávě*, to je příklad z `TYPY-CHYB.md`; použita vlastní věta (*Kola kluků stáli*) a Petr má dvě slovesa, aby k1 nebyl zadarmo.

---

## LEKCE 26 — Shoda s více podměty (`cj-t7-l26`)

`tema`: „Shoda s více podměty“ · `poradi` 2.

**Cíl:** Dítě u dvou a více podmětů před slovesem doplní *i*, když je mezi nimi aspoň jeden „ti“ (*máma a táta přišli*), *a*, když jsou to jen „ta“ ve více kusech (*kuřata a koťata spala*), jinak *y*.

**Úvod pro rodiče:** Dnes dítě doplňuje koncovku slovesa, když něco dělá víc lidí nebo věcí najednou (*Adam a Ema šli*): rozhoduje, jestli je mezi nimi aspoň jeden „ti“.

**Platí:** `Je mezi nimi „ti“? → i` (22) · `jen „ta“ (víc kusů) → a · jinak y` (32) · `Máma a táta přišli.` (19)

**Slovníček:** podmět, několikanásobný podmět, „ti“ mezi podměty (každý podmět ve více kusech: ten táta → ti tátové …), shoda, životnost.

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (L25, 4) | V každé řadě doplň i, y, nebo a. | 4 kroky `doplnit_pismeno` po 1 mezeře: **A** *Včera vyhrál_ hráči z naší školy.* **B** *Telefony kluků zvonil_ celou hodinu.* **C** *Holky z oddílu mají dnes volno. Ráno odjel_ na hory.* (jen i/y) **D** *Na dvoře pobíhal_ koťata.* | A i · B y · C y · D a | A y → `shoda-y-za-i` · B i → `shoda-podle-blizkeho-slova` · C i → `shoda-nevyjadreny-neurcen` · D y → `shoda-y-za-a` | Po řadách. B: „Co zvonilo celou hodinu? Kluci, nebo něco jiného?“ |
| 2 | nová (5) | Doplň i, y, nebo a. *Měří:* pravidlo přednosti, podměty vždy před slovesem. | 6 mezer: *Adam a Ema šl_0 na trénink. Klára a Lucka hrál_1 tenis. Kuřata a koťata spal_2 ve stodole. Stůl a židle stál_3 u okna. Holky a jejich trenér čekal_4 u autobusu. Auta a autobusy jel_5 pomalu.* | i, y, a, y, i, y | m0 y, m4 y → `shoda-nekolikanasobny-y` · m1 i → `shoda-i-za-y` · m2 y → `shoda-y-za-a` · m5 a (obecná, past „auta = ta“) | „U poslední věty: řekneš ta autobusy, nebo ty autobusy? Jsou tedy oba podměty ta?“ |
| 3 | nová (5) | Klikni na všechna slova, která tvoří podmět. Potom vyber písmeno. *Měří:* najít všechny podměty, past předmět. | `k1` `klik_ve_textu` max 5: Klára(0) Ema(1) a(2) jejich(3) trenér(4) uklidil(5) po(6) tréninku(7) míče(8) (*uklidil_* má v textu mezeru) · `final` `dlazdice` „Které písmeno patří do „uklidil_“?“: i · y · a | k1 `[0,1,4]` · final i | k1 `navic [8]` → `podmet-za-predmet`, `navic [5]` → `podmet-prisudek-zamena`, chybí trenér obecná · final y → `shoda-nekolikanasobny-y`, a obecná | „Zeptej se od slovesa: kdo uklidil? Vyjmenuj všechny. A míče něco dělaly?“ |
| 4 | detektiv (5) | Petr doplnil koncovky sloves: *Lucka a Tomáš šly v sobotu do kina. Lístky koupili už ve čtvrtek.* *Měří:* `shoda-nekolikanasobny-y`. | `k1` max 1: Lucka(0) a(1) Tomáš(2) šly(3) v(4) sobotu(5) do(6) kina(7) Lístky(8) koupili(9) už(10) ve(11) čtvrtek(12) · `final` „Proč je to slovo špatně?“: Mezi podměty je „ti“ · Podmět je ve větě jen jeden · Podmět stojí za slovesem · Koncovku určuje slovo „kina“ | k1 `[3]` · final první | k1 `navic [0,2,8,9]` → `detektiv-jine-slovo` (past *koupili*: nevyjádřený podmět Lucka a Tomáš) · final „kina“ → `shoda-podle-blizkeho-slova`, ostatní → `detektiv-oprava-jine-chyby` | „Kdo něco dělá v první větě a kdo ve druhé? Když podmět ve větě chybí, najdi ho ve větě předtím.“ |
| 5 | kontrolní (6) | Doplň do textu i, y, nebo a. *Měří:* L25–L26. | 8 mezer (m6 jen i/y): *Tomáš a jeho sestra jel_0 v létě na tábor. Lucka a Klára tam byl_1 už loni. Stany a chatky stál_2 u lesa. Štěňata a koťata z vesnice běhal_3 po táboře. Večer u ohně zpíval_4 kluci z chatky. Holky a jejich kamarád hrál_5 na kytaru. Potom šl_6 spát. Boty a trička do rána uschl_7.* | i, y, y, a, i, i, i, y | m0 y → `shoda-nekolikanasobny-y` · m2 i → `shoda-i-za-y` · m3 y → `shoda-y-za-a` · m6 y → `shoda-nevyjadreny-neurcen` | R55. „Kdo šel spát? Najdi to ve větě předtím. Je mezi nimi ti?“ |

**Kontrola pro vás (kontrolní):** jeli (Tomáš je ti), byly, stály, běhala (jen ta), zpívali (ti kluci), hráli (kamarád je ti), šli (holky a kamarád z věty předtím), uschly (boty nejsou ta).

Poznámky: *Stůl a židle* — *židle* může být j. i mn. č., výsledek je v obou čteních *y* (id=601: bez jména rodu muž. živ. → *y*). *Auta a autobusy* — různý rod bez muž. živ. → *y* (id=601: *Psací stroj, násadky a pera byly*).

---

## LEKCE 27 — Děti, lidé, rodiče, koně (`cj-t7-l27`) · poslech U3

`tema`: „Děti, lidé, rodiče, koně“ · `poradi` 3.

**Cíl:** Dítě doplní správnou koncovku slovesa u podmětů *děti* (ty děti → *y*) a *lidé, rodiče, koně* (ti → *i*), i v textu, kde vystupují děti i dospělí.

**Úvod pro rodiče:** Dnes dítě doplňuje koncovku u slov, u kterých test *ti, ty, ta* mate: *děti* (ty děti → *y*), *lidé, rodiče* a *koně* (ti → *i*).

**Platí:** `děti → ty děti → y` (18) · `lidé, rodiče, koně → ti → i` (27) · `Děti si hrály, rodiče stáli.` (28)

**Slovníček:** podmět, shoda, *děti*, *lidé, rodiče, koně* (v běžné řeči „ty rodiče“, ve škole „ti“), několikanásobný podmět, nevyjádřený podmět.

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (L26, 4) | V každé řadě doplň i, y, nebo a. | 4 × 1 mezera: **A** *Babička a děda přijel_ na návštěvu.* **B** *Míče a švihadla ležel_ v tělocvičně.* **C** *Kuřata a housata pobíhal_ po dvoře.* **D** *Lucka, Ema a Klára běžel_ k autobusu.* | A i · B y · C a · D y | A y → `shoda-nekolikanasobny-y` · B i → `shoda-i-za-y` (a obecná) · C y → `shoda-y-za-a` · D i → `shoda-i-za-y` | Po řadách. B: „Jsou oba podměty ta? Řekni nahlas: ta míče, nebo ty míče?“ |
| 2 | nová (5) | Doplň i, y, nebo a. *Měří:* děti, rodiče, lidé, koně. | 6 mezer: *Děti z družiny běhal_0 po zahradě. Rodiče na ně čekal_1 u branky. Koně na pastvině se pásl_2 u lesa. Lidé v autobusu se smál_3. Děti ze školky usnul_4 po obědě. Večer přijel_5 rodiče z dovolené.* | y, i, i, i, y, i | m0 i, m4 i → `shoda-deti-i` · m1 y, m3 y → `shoda-rodice-lide-y` · m2 y (koně) obecná | „Řekni nahlas: ti děti, nebo ty děti? A ti rodiče, nebo ty rodiče? Jak to řekneš ve škole?“ |
| 3 | nová, **poslech** (5) | Poslechni si nahrávku. Pak odpověz na dvě otázky. *Měří:* kdo co dělá v textu o víc lidech; *y* testem. | `poslech` `t7/l27-u3.mp3` (3 věty, ≈ 8 s). `k1` „Kdo vyběhl ven?“: rodiče · děti · rodiče i děti · škola · `final` „Jaké písmeno patří do „vyběhl_“?“: i · y · a | k1 děti · final y | k1 jiné obecná · final i → `shoda-deti-i`, a obecná (*ta děti*) | „Pusť si nahrávku znovu. Kdo čekal a kdo vyběhl?“ |
| 4 | detektiv (5) | Petr doplnil koncovky sloves: *Děti z naší třídy jely na výlet do Prahy. Rodiče přijely na nádraží až večer.* *Měří:* `shoda-rodice-lide-y`. | `k1` max 1: Děti(0) z(1) naší(2) třídy(3) jely(4) na(5) výlet(6) do(7) Prahy(8) Rodiče(9) přijely(10) na(11) nádraží(12) až(13) večer(14) · `final` „Co řekneš před podmět toho slova?“: ti · ty · ta | k1 `[10]` · final ti | k1 `navic [0,4,9]` → `detektiv-jine-slovo` (past *jely* je správně) · final ty → `shoda-rodice-lide-y`, ta → `detektiv-oprava-jine-chyby` | „U obou sloves řekni podmět nahlas s ti, nebo ty. Jak to řekneš ve škole?“ |
| 5 | kontrolní (6) | Doplň do textu i, y, nebo a. *Měří:* L25–L27. | 8 mezer (m6 jen i/y): *Ve čtvrtek jel_0 děti z osmé třídy na výlet. Rodiče jim ráno zabalil_1 svačiny. Kluci a holky seděl_2 v autobusu vzadu. Ostatní lidé v autobusu se usmíval_3. Na louce u silnice se pásl_4 koně. U hradu děti vystoupil_5 z autobusu. Potom šl_6 na prohlídku. Auta na parkovišti stál_7 v řadě.* | y, i, i, i, i, y, y, a | m0 i → `shoda-deti-i` · m1 y → `shoda-rodice-lide-y` · m2 y → `shoda-nekolikanasobny-y` · m7 y → `shoda-y-za-a` | R55. „Kdo šel na prohlídku? Najdi to ve větě předtím. Ti, nebo ty?“ |

**Kontrola pro vás (kontrolní):** jely (ty děti), zabalili (ti rodiče; svačiny podmět nejsou), seděli (kluci jsou ti), usmívali (ti lidé), pásli (ti koně), vystoupily (ty děti), šly (děti z věty předtím), stála (ta auta).

Poznámky: osnova u L27 zmiňuje i zájmena *oni, ony, ona* „podle toho, za koho stojí“. **Vynecháno:** vytištěné zájmeno samo prozradí koncovku (*oni → i, ony → y*), *ona* (mn. č. stř. r.) se plete s *ona* (j. č.) a tvary zájmen v mn. č. patří do T4. Poslech osnovy („Rodiče čekali před školou. Děti vyběhly ven. Potom spolu šli k autu.“) upraven, aby se nepřekrýval s diktátem L28 (*Rodiče čekali venku*). Jev je stejný.

---

## LEKCE 28 — Kontrola tématu: shoda (`cj-t7-l28`) · diktát

`tema`: „Kontrola tématu: shoda“ · `poradi` 4 · U5 `tydenni: true` + `semafor_tydne`.

**Cíl:** Dítě v diktátu a v textu napíše správně koncovky sloves v minulém čase a u každé řekne podmět a *ti, ty*, nebo *ta*.

**Úvod pro rodiče:** Dnes je kontrola celého tématu: dítě hledá podměty, doplňuje koncovky sloves podle podmětu a píše krátký diktát.

**Platí:** `Podmět → ti/ty/ta → i/y/a` (25) · `víc podmětů: „ti“ má přednost` (30) · `děti → y · rodiče, lidé → i` (27)

**Slovníček:** podmět, shoda, několikanásobný podmět, nevyjádřený podmět, děti / rodiče / lidé, diktát.

| # | Typ | Zadání | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|---|
| 1 | rozcvička (L25–L27, 4) | V každé řadě doplň i, y, nebo a. | 4 × 1 mezera: **A** *Za plotem štěkal_ psi.* **B** *Kuřata a kachňata se schoval_ pod keř.* **C** *Děti na hřišti křičel_.* **D** *Rodiče na schůzce mluvil_ o výletu.* | A i · B a · C y · D i | A y → `shoda-y-za-i` · B y → `shoda-y-za-a` · C i → `shoda-deti-i` · D y → `shoda-rodice-lide-y` | Po řadách. C a D: „Ti, nebo ty děti? Ti, nebo ty rodiče? Jak to řekneš ve škole?“ |
| 2 | nová (5) | Klikni na všechny podměty ve třech větách. *Měří:* podmět v delším textu. | `klik_ve_textu` max 7: Na(0) tréninku(1) nás(2) rozcvičil(3) trenér(4) Potom(5) Adam(6) a(7) Tomáš(8) postavili(9) branky(10) Míče(11) přinesla(12) Ema(13) | `[4,6,8,13]` | `navic [2,10,11]` → `podmet-za-predmet` · `navic [3,9,12]` → `podmet-prisudek-zamena` · `navic [5]` → `podmet-prvni-slovo` · chybí Adam/Tomáš obecná | „Ve třetí větě: přinesly míče něco, nebo je někdo přinesl? Kdo?“ |
| 3 | nová (5) | Doplň i, y, nebo a. *Měří:* pasti celého tématu. | 6 mezer (m5 jen i/y): *Tašky kluků ležel_0 na zemi. Děti a jejich psi běhal_1 po pláži. Auta a kola stál_2 před domem. Telefon a sluchátka ležel_3 na lavici. U stolu seděl_4 rodiče. Lucka a Ema mají dnes volno. Dopoledne si vyšl_5 do města.* | y, i, a, y, i, y | m0 i → `shoda-podle-blizkeho-slova` · m1 y → `shoda-nekolikanasobny-y` · m2 y → `shoda-y-za-a` · m4 y → `shoda-rodice-lide-y` · m3 a, m5 i obecná | „U dětí se psy: řekni oba podměty ve více kusech. Je mezi nimi ti?“ |
| 4 | detektiv (5) | Petr doplnil koncovky sloves: *V pátek odjeli kluci z oddílu na soustředění. Batohy trenérů zůstali ve vlaku. Ráno je přivezly holky z druhého oddílu.* *Měří:* `shoda-podle-blizkeho-slova` v textu 3 vět. | `k1` max 1: V(0) pátek(1) odjeli(2) kluci(3) z(4) oddílu(5) na(6) soustředění(7) Batohy(8) trenérů(9) zůstali(10) ve(11) vlaku(12) Ráno(13) je(14) přivezly(15) holky(16) z(17) druhého(18) oddílu(19) · `final` „Které slovo určuje správnou koncovku?“: kluci · Batohy · trenérů · holky | k1 `[10]` · final Batohy | k1 `navic [2,8,9,15]` → `detektiv-jine-slovo` (past *přivezly*: podmět za slovesem) · final trenérů → `shoda-podle-blizkeho-slova`, kluci, holky → `detektiv-oprava-jine-chyby` | „Podmět nemusí být slovo, které stojí hned u slovesa. U každého slovesa se zeptej znovu: kdo, co to dělá?“ |
| 5 | kontrolní **týdenní** (6) | Nejdřív napiš čtyři věty podle nahrávky. Potom doplň do textu i, y, nebo a. | `k1` `diktat` 4 věty, 16 slov, `max_prehrani: 2`, `hodnotit_velikost: false`, `hodnotit_interpunkci: false`, `t7/l28-d1…d4` · `final` `doplnit_pismeno` 10 mezer (m3 jen i/y): *Kluci a holky z osmé třídy jel_0 na výlet do hor. Rodiče je ráno odvezl_1 k autobusu. Učitelky seděl_2 vpředu a celou cestu si povídal_3. Na parkovišti u lanovky stál_4 autobusy z jiných škol. Lidé u lanovky na nás mával_5. Batohy a bundy zůstal_6 v autobusu. Sluchátka kluků ležel_7 na sedadlech. Děti hned vyběhl_8 na louku. Na louce se pásl_9 kůzlata.* | diktát bez chyb · final i, i, y, y, y, i, y, a, y, a | diktát `chyby_ocekavane` (holé kódy): věta 0 slovo 1 *hráli* `shoda-y-za-i` · věta 1 slovo 1 *seděly* `shoda-deti-i` · věta 2 slovo 1 *čekali* `shoda-rodice-lide-y` · věta 3 slovo 1 *stála* `shoda-y-za-a` · final m0 y → `shoda-nekolikanasobny-y` · m1 y → `shoda-rodice-lide-y` · m7 i → `shoda-podle-blizkeho-slova` · m8 i → `shoda-deti-i` | R55. `semafor_tydne` z `final`: zelená 9–10 z 10 (`min_spravne` 9), oranžová 7–8 (7), červená 0–6 (0) |

**Kontrola pro vás (kontrolní):** diktát: hráli (ti kluci), seděly (ty děti), čekali (ti rodiče), stála (ta auta). Text: jeli, odvezli (ti rodiče; *je* podmět není), seděly (ty učitelky), povídaly (kdo si povídal? učitelky), stály (ty autobusy), mávali (ti lidé), zůstaly (ty batohy, ty bundy), ležela (ta sluchátka; *kluků* jen říká čí), vyběhly (ty děti), pásla (ta kůzlata).

**Diktát slovo po slově (OSNOVA §2.2):** *Kluci hráli na hřišti fotbal. · Děti seděly u okna. · Rodiče čekali venku. · Auta stála před domem.* Koncovky *-li/-ly/-la* = jev T7; *Kluci, hřišti, Děti, Rodiče, seděly (dě), před* = Z5 (měkké souhlásky, *dě*, *ř*); žádné *i/y* po obojetné souhlásce v kořeni, žádná předložka *s/z*, žádné *mě/mně*, žádné vlastní jméno (nahrávka nic nehlásí).

Poznámky: diktát je přesně podle osnovy. Úloha 2 je `klik_ve_textu` (osnova), proto bez kódu pro „chybí podmět“ (žádný kód v `TYPY-CHYB.md` na to není; vynechání je obecná chyba).

---

## Nahrávky (pro AUDIO.md)

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t7/l25-u3.mp3` | 25 / úloha 3 (`k1`, `final`) | poslech | Holky z naší třídy trénovaly po škole volejbal. Potom šly na zmrzlinu. | Mezi větami pauza asi 0,7 s. Nezdůrazňovat „holky“ ani „šly“. Asi 5 s. | čeká |
| `t7/l27-u3.mp3` | 27 / úloha 3 (`k1`, `final`) | poslech | Po koncertě čekali rodiče před školou. Děti vyběhly ven a mávaly na ně. Potom všichni šli k autu. | Mezi větami pauza asi 0,7 s. Nezdůrazňovat „děti“ ani „vyběhly“. Asi 8 s. | čeká |
| `t7/l28-d1.mp3` | 28 / úloha 5 (`k1`), věta 1 | diktát | Kluci hráli na hřišti fotbal. | Podle AUDIO.md: dvakrát (celá věta, pauza 2 s, pomalu po slovech 0,75×, 0,7 s mezi slovy), interpunkce se neříká. | čeká |
| `t7/l28-d2.mp3` | 28 / úloha 5 (`k1`), věta 2 | diktát | Děti seděly u okna. | jako d1; „seděly“ s měkkým *dě* zřetelně | čeká |
| `t7/l28-d3.mp3` | 28 / úloha 5 (`k1`), věta 3 | diktát | Rodiče čekali venku. | jako d1 | čeká |
| `t7/l28-d4.mp3` | 28 / úloha 5 (`k1`), věta 4 | diktát | Auta stála před domem. | jako d1; dlouhé á v „stála“ slyšet | čeká |

**Pozor při slučování:** `AUDIO.md` v tomto repozitáři je převzatý ze Spolu (základy) a už obsahuje řádky `t7/l25-u4`, `t7/l27-u4` a **`t7/l28-d1` až `d4` s jiným zněním** (d2 „Na louce se pásly kobyly.“, d3 „Psi běhali kolem mlýna.“, d4 rezerva). Ty patří jinému produktu a je třeba je nahradit řádky výše, jinak se vygeneruje špatný diktát. Validátor kvůli nim u L28 chybu nehlásí (ID souboru najde), u L25 a L27 hlásí „nahrávka nemá řádek v AUDIO.md“.

Celkem 6 nahrávek (2 poslechy, 4 věty diktátu).

---

## Ověření ÚJČ

Ověřeno 1. 10. 2026 přes `nastroje/ujc.sh`.

**Výklady (pravidla shody):**
- [id=600 Shoda přísudku s podmětem jednoduchým](https://prirucka.ujc.cas.cz/?id=600): muž. živ. → *-i* (i *Sněhuláci táli, Plyšoví medvídci seděli* — proto *medvídek* v červené L26); muž. neživ. a ženský → *-y*; střední → *-a* (*Štěňata se batolila*); *dítě* v mn. č. ženského rodu → *Děti seděly*; *rodiče, lidičky, koně* → *-i* (*Rodiče byli zdrávi, Koně se splašili*); *koně* jako věc → *-y* (nepoužito).
- [id=601 Shoda přísudku s podmětem několikanásobným](https://prirucka.ujc.cas.cz/?id=601): podmět před přísudkem; aspoň jedno jméno muž. živ. (j. i mn. č.) → *-i*; bez něj → *-y*; všechna střední v mn. č. → *-a* (*Kuřata a housata byla prodána*); střední s aspoň jedním v j. č. → *-y* (nepoužito); přísudek před podmětem → dvojí shoda (nepoužito); podmět s *s* (nepoužito).
- [id=602 Složitější případy shody](https://prirucka.ujc.cas.cz/?id=602): nevyjádřený podmět → shoda podle výrazu v předcházející větě (*Tři hrady byly dobyty. Druhý den byly zbořeny.*); oslovení v mn. č. a bezrodá zájmena *my, vy* → dvojí shoda (nepoužito).

**Slovníková část (`https://prirucka.ujc.cas.cz/?slovo=<heslo>`):** viz `kontrola.zdroj` každé lekce. Doplní se po dokončení dotazů (výpis níže).

<!-- UJC-VYPIS -->

**Korektura 4. 10. 2026 (korektor):** znovu ověřeno přes `nastroje/ujc.sh`: výklady id=600 (*rodiče, lidičky, koně* → *-i*; *dítě* v mn. č. ženského rodu → *Děti seděly*; *Plyšoví medvídci seděli*), id=601 (přednost rodů, všechna střední v mn. č. → *-a*, různé číslo bez muž. živ. → *-y*), id=602 (shoda podle výrazu v předcházející větě, „někdy nastupuje shoda podle smyslu“); hesla *děvče* (*děvčata*, příklad *Děvčata byla*), *dítě*, *člověk* (*lidé* = muž. živ.), *rodič*, *kůň* (m. živ. = zvíře), *pes* (*psi*), *kluk* (*kluci*), *kůzle*, *kachně*, *house*, *koncert* (6. p. *koncertě/koncertu*, jen v nahrávce), slovesa *pást* (*pásl*), *uschnout* (*uschl/uschnul*, vytištěno), *odvézt*, *přivézt*, *spěchat*.
Opravy v JSON: L25 U2 *Kluci běžel_* → *Kluci spěchal_* (Platí „ti kluci běželi“ dávalo odpověď); L27 U2 *Děti si hrál_* → *Děti běhal_ po zahradě* (Platí „Děti si hrály“) a *Večer zavolal_ rodiče* → *Večer přijel_ rodiče* (rodiče šlo číst jako předmět: *(děti) zavolaly rodiče* → *y*); L28 U5 *povídal_* spojeno do jedné věty s *Učitelky seděl_*; otázka 3 detektiva v L25–L28 ukazovala (v režimu „Dnes samo“ už během kroku 1) na chybné nebo jediné druhé sloveso → obecná nápověda; L25 U1 otázka k řadě D.

---

## Nejistoty

**Jazykové:**
- *uschnout*: příčestí *uschl* i *uschnul* (hovor.) — hodnotí se jen koncovka, vytištěný je tvar *uschl_* (L26 U5). Dubleta se nevyhodnocuje.
- *kluk, holka* jsou podle SSČ hovorová (spisovná) slova; pro svět 13–14letých ponechána, rod a shoda by byly stejné u *chlapci / dívky*.
- *Stůl a židle stál_* (L26 U2): *židle* j. i mn. č., v obou čteních *y*.

**Metodické:**
- L25 U3 `final` má jen dvě dlaždice (i · y), dítě může trefit naslepo. Krok `k1` (kdo šel?) a typická chyba to vyvažují.
- L26 U5 m6 (*Potom šl_ spát*, správně *i*): *y* je označeno `shoda-nevyjadreny-neurcen`; dítě mohlo vzít jen *holky* a zapomenout na *kamaráda* (pak by šlo spíš o `shoda-nekolikanasobny-y`). Tahák se ptá na obojí.
- Nevyjádřený podmět vždy navazuje na podmět věty těsně předtím. L28 U5 opraveno korektorem: *Učitelky seděly vpředu. Celou cestu si povídaly.* připouštělo shodu podle smyslu (povídali si všichni, ÚJČ id=602) → *Učitelky seděl_ vpředu a celou cestu si povídal_.*

---

## Poznámky pro vedoucího

1. **AUDIO.md – kolize ID.** Řádky `t7/l28-d1` až `d4` (a `t7/l25-u4`, `t7/l27-u4`) v `cestina/Obsah/AUDIO.md` jsou ze Spolu (základy) s jiným zněním. Při slučování je nahraďte řádky z oddílu Nahrávky, jinak Pavel vygeneruje špatný diktát a validátor chybu neodhalí (hledá jen ID souboru, ne znění).
2. **Schéma: cesta k nahrávce jen pro t1–t8.** `obsah/schema.json` má u `audio` (poslech i věty diktátu) vzor `^audio/cestina/t[1-8]/…`. Téma 7 projde, ale nahrávky T9 (L33, L34, L36) a T10 (L38, L39, L40) schéma odmítne. Návrh: `t([1-9]|10)`.
3. **Návrh nového kódu (zatím obecná chyba):** `shoda-nekolikanasobny-a` — u několikanásobného podmětu napíše *-a*, i když nejsou všechny podměty „ta“ (*Auta a autobusy jela*, *Telefon a sluchátka ležela*, *Míče a švihadla ležela*). Otázka: „Řekni každý podmět ve více kusech. Jsou to všechno ta?“ Lekce 26, 27, 28. Dnes obecná chyba v L26 U2 (m5), L27 U1 B, L28 U3 (m3).
4. **Návrh rozšíření popisu:** `shoda-rodice-lide-y` uvádí jen *rodiče, lidé*; ÚJČ id=600 dává do stejné skupiny i *koně* (a *lidičky*). Když se popis rozšíří o *koně*, dostane L27 U2 m2 (*Koně … pásly*) a L27 U5 m4 kód místo obecné chyby.
5. **Lekce v `TYPY-CHYB.md`:** sloupec Lekce u kódů T7 je ze Spolu (základy). Nově se používají: `podmet-prvni-slovo` (25, 28), `podmet-za-predmet` (25, 26, 28), `podmet-prisudek-zamena` (25, 26, 28), `shoda-podle-blizkeho-slova` (25, 26, 28), `shoda-nevyjadreny-neurcen` (25, 26), `shoda-nekolikanasobny-y` (26, 27, 28), `shoda-deti-i` a `shoda-rodice-lide-y` (27, 28), `shoda-y-za-i`, `shoda-i-za-y`, `shoda-y-za-a` (25–28).
6. **Odchylky od osnovy (§11):** (a) L25 U3 poslech jinou větou (holky místo kluků; osnova se překrývala s diktátem L28) a `final` jen i · y; (b) L25 U4 vlastní věta Petra se dvěma slovesy místo příkladu z `TYPY-CHYB.md`; (c) L27 bez zájmen *oni, ony, ona* (vytištěné zájmeno prozradí koncovku, *ona* mn. č. × j. č.); (d) L27 U3 poslech upraven kvůli překryvu s diktátem L28; (e) L28 U2 `klik_ve_textu` jako v osnově, vynechaný podmět je obecná chyba (kód není). Diktát L28 a prahy `semafor_tydne` (9 / 7 / 0 z 10) přesně podle osnovy.
7. **Mezery `["i","y"]` u nevyjádřeného podmětu** (L25 U5, L26 U1 C, L26 U5, L27 U5, L28 U3, L28 U5): tvar na *-a* by šlo číst jako ženský rod j. č. Ostatní mezery mají `["i","y","a"]`.
8. **Validace:** `npm run seed:validace -- --lekce cj-t7-l25,…,cj-t7-l28` hlásí jen chybějící řádky `t7/l25-u3` a `t7/l27-u3` v `AUDIO.md` (viz bod 1) a varování o chybějících MP3. Průchod `vyhodnotKrok` + `vzorovaOdpoved`: 144 kontrol, 0 chyb (vzorové odpovědi správně, každá známá chyba i každá chybná dlaždice vrací svůj kód, diktát vrací `diktat-pravopis-<kód>`). `node nastroje/qa-osma.mjs --lekce=…` (žák, rodič, tisk, Dnes samo): bez nálezů. `npm test`: 1170 / 0.
