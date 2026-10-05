# Téma 8 — Větné členy (`vetne-cleny`, lekce 29–32)

Verze 1.0, 1. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (review, sloučení řádků do `AUDIO.md`), jazykového korektora, recenzenta.
Podle `cestina/Obsah/OSNOVA.md` §12 (s §2–§4, §16–§18), `ZADANI-OSMA.md` §3, §4, §8 a `FORMAT-CJ.md` s rozdílem Spolu 8 (5 úloh: rozcvička 4, nová 5, nová 5, detektiv 5, kontrolní 6 → `cas_min` 25). Lekce jsou hotové v `obsah/cestina/lekce/cj-t8-l29.json` až `cj-t8-l32.json`; tahák, semafor a `tisk.zadani` jsou v JSON, tady je obsah úloh, data, správné odpovědi, známé chyby a hlavní otázka.

## Společné pro celé téma

- **Indexy slov** v `klik_ve_textu` a `oznac_role` od 0, interpunkce se nepočítá (`tokenizuj` ve `vyhodnoceni-cj.js`). Roli dostává **plnovýznamové slovo**, ne předložka (*na zastávce* → role u *zastávce*). U jmenného přísudku se sponou dostanou roli obě slova (*je* i *kapitánka*).
- **Přesné texty rolí** (stejné v dlaždicích i v `oznac_role`): `podmět`, `přísudek`, `přísudek slovesný`, `přísudek jmenný se sponou`, `předmět`, `příslovečné určení místa`, `příslovečné určení času`, `příslovečné určení způsobu`, `příslovečné určení příčiny`, `přívlastek shodný`, `přívlastek neshodný`; druh přísudku v dlaždicích `slovesný` / `jmenný se sponou`.
- **Nejvýš 8 rolí v kroku** (ZADANI-OSMA §8 bod 8). Kde osnova chtěla všechny členy (L31 U5, L32 U5 final: 9 rolí), má krok 8 rolí: `podmět, přísudek, předmět, příslovečné určení místa, času, způsobu, přívlastek shodný, přívlastek neshodný`. Přísudek je tam bez druhu (druh měří L29 a rozcvičky) a PU příčiny chybí (měří ho L30 U2/U3, L31 U1, L32 U1); v textu těchto kroků žádná příčina není.
- **Testy, které téma učí:** podmět *kdo, co?* od přísudku; přísudek jmenný se sponou = tvar *být* + jméno (přídavné nebo podstatné), *byla doma* = slovesný (*doma* je příslovce, ne jméno; ÚJČ id=610); předmět = pádová otázka od slovesa; PU = *kde? kdy? jak? proč?* od slovesa; přívlastek = otázka od jména (*jaký? který? čí?*); shodný × neshodný = změním tvar jména (*bez …*) a poslouchám, jestli se přívlastek mění s ním; přívlastek × PU = ke kterému slovu spojení patří (ke jménu, nebo ke slovesu).
- **Nehodnotí se** (OSNOVA §12): doplněk, přístavek, PU míry, účelu, podmínky, přípustky; infinitiv jako předmět; sloveso pohybu s osobou (*jde k lékaři*); trpný rod; jmenný přísudek, kde by šlo volit 1. × 7. p. (dítě tvar nikdy nevolí, v datech je jen 1. p. podstatného jména nebo přídavné jméno, id=610); podmět ve 2. p. V datech nejsou ani spojení, která mohou patřit ke jménu i ke slovesu (*čte knihu o koních*, *dopis babičce*, *hřiště u školy*).
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; detektiv Petr. Honzík v tématu není. Oslovení nejsou.
- **Kódy chyb** jen z `TYPY-CHYB.md` (oddíl Spolu 8 + starší kódy podmětu a přísudku). Nové kódy nejsou potřeba.

---

## LEKCE 29 — Přísudek slovesný a jmenný (`cj-t8-l29`)

`tema`: „Přísudek slovesný a jmenný“ · `kapitola`: `vetne-cleny` · `tyden` 8, `poradi` 1.

**Cíl:** Dítě najde ve větě celý přísudek a určí, jestli je slovesný (*Tomáš hraje hokej, Klára byla doma*), nebo jmenný se sponou (*Tomáš je brankář, Lucka byla unavená*).

**Úvod pro rodiče:** Dnes dítě hledá ve větě přísudek a rozhoduje, jestli říká, co podmět dělá (slovesný), nebo kdo či jaký podmět je (jmenný se sponou: *je brankář, byla unavená*).

**Platí:** `Přísudek: co podmět dělá, jaký je` (co to je) · `jmenný: je/byl + jméno (je lékař)` (test) · `byl na poště = slovesný (kde byl?)` (příklad) — korektor 4. 10.: příklady nesmí být odpovědí úlohy (U2)

**Slovníček:** větný člen, podmět, přísudek, přísudek slovesný, přísudek jmenný se sponou, spona (texty v JSON).

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | Najdi přísudek (A, D) / podmět (B, C). *Měří:* Z4, ledoborec | 4 kroky `dlazdice` „Řada A–D“: **A)** Adam hraje fotbal.: Adam · hraje · fotbal **B)** Ráno zazvonil budík.: Ráno · zazvonil · budík **C)** Lucka čte knihu.: Lucka · čte · knihu **D)** Večer svítil měsíc.: Večer · svítil · měsíc | A hraje · B budík · C Lucka · D svítil | Adam, měsíc, zazvonil, čte → `podmet-prisudek-zamena`; fotbal, Večer → `prisudek-neni-sloveso`; Ráno → `podmet-prvni-slovo`; knihu → `podmet-za-predmet` | A, D „Které slovo říká, co se děje? Zkus ‚on‘.“ · B „Najdi sloveso, pak: kdo, co zazvonil?“ · C „Kdo čte? A čte koho, co?“ |
| U2 nová (5) | Urči druh přísudku (přiřazení). *Měří:* slovesný × jmenný se sponou, past *byla doma* | 4 kroky `dlazdice` se stejnou nabídkou **slovesný · jmenný se sponou**; popisky „A) Tomáš hraje hokej.“, „B) Tomáš je brankář.“, „C) Lucka byla unavená.“, „D) Klára byla doma.“ | A slovesný · B jmenný · C jmenný · D slovesný | B, C slovesný → `prisudek-jmenny-za-slovesny`; D jmenný → `prisudek-slovesny-za-jmenny`; A jmenný → obecná | „Ve větě D se zeptej od slova byla. Na jakou otázku odpovídá slovo doma?“ Typická chyba: D jmenný („vidí byla“). |
| U3 nová (5) | Klikni na všechna slova přísudku. *Měří:* celý jmenný přísudek, i rozdělený podmětem | 2 kroky `klik_ve_textu` (`min 1, max 3`), „Věta 1“: Nový(0) trenér(1) je(2) přísný(3); „Věta 2“ (`final`): Po(0) tréninku(1) byla(2) Lucka(3) unavená(4) | k1 `[2, 3]` · final `[2, 4]` | chybí 3 / 4 → `prisudek-jmenny-jen-spona`; navíc 1 / 3 (podmět) → `podmet-prisudek-zamena` | „Jaký trenér je? Které slovo odpovídá a kam patří?“ Typická chyba: klikne jen na *je, byla*. |
| U4 detektiv (5) | Petr měl podtrhnout celý přísudek: *Klára byla doma. Její bratr je kuchař. Adam hraje tenis.* Podtrhl **byla, je, hraje**. *Měří:* `prisudek-jmenny-jen-spona` | `k1` `dlazdice` „U kterého slova má Petr chybu?“: byla · **je** · hraje · `final` `dlazdice` „Co měl Petr podtrhnout?“: byla doma · **je kuchař** · hraje tenis · bratr je | k1 je · final je kuchař | k1 byla → `prisudek-slovesny-za-jmenny`, hraje → `detektiv-jine-slovo`; final byla doma → `prisudek-slovesny-za-jmenny`, hraje tenis → `detektiv-oprava-jine-chyby`, bratr je → `podmet-prisudek-zamena` | „U každého Petrova slova: stačí samo, nebo za ním chybí, kdo či jaký podmět je?“ Past: *byla* u Kláry má Petr správně. Nabídka `final` má údaj ke každé větě, k1 neprozradí. |
| U5 kontrolní (6) | U každého označeného slova vyber větný člen. *Měří:* podmět a druh přísudku v textu, dvakrát *byl* | `oznac_role`, text **Klára je kapitánka. Tomáš byl na tréninku. Trenér byl spokojený.** Klára(0) je(1) kapitánka(2) Tomáš(3) byl(4) na(5) tréninku(6) Trenér(7) byl(8) spokojený(9); `slova [0,1,2,3,4,7,8,9]`; role `podmět · přísudek slovesný · přísudek jmenný se sponou` | 0, 3, 7 podmět · 4 slovesný · 1, 2, 8, 9 jmenný se sponou | `{"4": jmenný}` → `prisudek-slovesny-za-jmenny`; `{"1": slovesný, "8": slovesný}` → `prisudek-jmenny-za-slovesny`; `{"2": podmět, "9": podmět}` → `prisudek-jmenny-jen-spona` | R55. „Vezmi byl ve druhé větě: kde Tomáš byl? A jaký byl?“ |

**Kontrola pro vás (kontrolní):** podmět Klára, Tomáš, Trenér; *byl* (na tréninku) slovesný; *je kapitánka*, *byl spokojený* jmenné se sponou (obě slova). 8 údajů.

---

## LEKCE 30 — Předmět a příslovečné určení · poslech U3 (`cj-t8-l30`)

`tema`: „Předmět a příslovečné určení“ · `tyden` 8, `poradi` 2.

**Cíl:** Dítě odliší předmět (ptá se od slovesa pádovou otázkou: *mluvili o čem?*) od příslovečného určení (*kde? kdy? jak? proč?*) a určí druh příslovečného určení.

**Úvod pro rodiče:** Dnes dítě u slova ve větě rozhoduje, jestli je to předmět (ptá se na něj od slovesa pádovou otázkou), nebo příslovečné určení (odpovídá na kde, kdy, jak, nebo proč).

**Platí:** `Předmět: pádová otázka od slovesa` · `Přísl. určení: kde? kdy? jak? proč?` · `myslí na zkoušku → na co? předmět` (korektor 4. 10.: původní příklad byl odpovědí U4)

**Slovníček:** předmět, příslovečné určení, pádová otázka, přísudek slovesný / jmenný se sponou (z L29), větný člen.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | Urči druh přísudku. *Měří:* L29 | 4 kroky `dlazdice` (slovesný · jmenný se sponou): **A)** Ema byla ve škole. **B)** Adam je dobrý střelec. **C)** Klára hraje na kytaru. **D)** Ten film byl napínavý. | A slovesný · B jmenný · C slovesný · D jmenný | A jmenný → `prisudek-slovesny-za-jmenny`; B, D slovesný → `prisudek-jmenny-za-slovesny`; C jmenný → obecná | A „kde Ema byla? A jaká byla?“ · B, D „Co říká slovo za je/byl?“ · C „Najdeš tvar slova být?“ |
| U2 nová (5) | Jaký větný člen je tučné slovo? (přiřazení) *Měří:* předmět × PU místa, času, způsobu | 4 kroky `dlazdice`, nabídka **předmět · PU místa · PU času · PU způsobu · PU příčiny** (plné názvy); popisky „A) babičce“ (Ema pomáhá **babičce**.), „B) hřišti“ (Kluci trénují na **hřišti**.), „C) brzy“ (Lucka vstala **brzy**.), „D) tiše“ (Adam mluvil **tiše**.) | A předmět · B místa · C času · D způsobu | A jakékoli PU → `predmet-za-pu`; B–D předmět → `pu-za-predmet`, jiný druh → `pu-druh-zamena` | „Jakou otázkou se zeptáš na babičce? A jakou na hřišti?“ Volba „příčiny“ zůstane nevyužitá (je v U3). |
| U3 nová, **poslech** (5) | Poslechni si větu, odpověz na dvě otázky. *Měří:* druh PU sluchem (příčina × čas) | `poslech` `t8/l30-u3.mp3` (`max_prehrani 0`), dva kroky se stejnou nahrávkou, vnořené dlaždice s nabídkou jako U2. „Otázka 1“: *Jaký větný člen je „kvůli dešti“?* · „Otázka 2“ (`final`): *Jaký větný člen je „v sobotu“?* | k1 PU příčiny · final PU času | předmět → `pu-za-predmet`; jiný druh → `pu-druh-zamena` | „Zeptej se od slovesa: kde? kdy? jak? proč? Na kterou odpovídá kvůli dešti?“ Typická chyba: k1 „času“ (pršelo v sobotu). |
| U4 detektiv (5) | Petr určil ve větě *Celý večer jsme mluvili o výletu.*: večer – PU času; výletu – PU místa. *Měří:* `predmet-za-pu` | `k1` `klik_ve_textu` (`max 1`): Celý(0) večer(1) jsme(2) mluvili(3) o(4) výletu(5) · `final` `dlazdice` „Jaký je to větný člen?“: **předmět** · PU místa · PU času · podmět | k1 `[5]` · final předmět | k1 `[1]` → `detektiv-jine-slovo`; final místa → `predmet-za-pu`, času a podmět → `detektiv-oprava-jine-chyby` | „Ke každému Petrovu slovu polož otázku, kterou Petr určil, a potom pádovou otázku. Která sedí?“ Nabídka `final` pokrývá obě Petrova slova (čas i místo), k1 neprozradí; přívlastek v nabídce není (je až v L31). |
| U5 kontrolní (6) | U každého označeného slova vyber větný člen. *Měří:* předmět a 4 druhy PU v textu | `oznac_role`, text **Ráno čekala Ema na zastávce. Kvůli mlze jel autobus pomalu. Ve škole potkala Tomáše.** Ráno(0) čekala(1) Ema(2) na(3) zastávce(4) Kvůli(5) mlze(6) jel(7) autobus(8) pomalu(9) Ve(10) škole(11) potkala(12) Tomáše(13); `slova [0,4,6,9,11,13]`; 5 rolí (předmět, PU místa, času, způsobu, příčiny) | 0 času · 4 místa · 6 příčiny · 9 způsobu · 11 místa · 13 předmět | `{"4": předmět}` → `pu-za-predmet`; `{"13": PU místa}` → `predmet-za-pu`; `{"6": PU času}` → `pu-druh-zamena` | R55. „Zastávce: čekala kde? A čekala na koho, co?“ Past: *čekat na koho* × *čekat kde*. |

**Kontrola pro vás (kontrolní):** Ráno čas, zastávce místo, mlze příčina, pomalu způsob, škole místo, Tomáše předmět. 6 údajů.

---

## LEKCE 31 — Přívlastek shodný a neshodný · poslech U3 (`cj-t8-l31`)

`tema`: „Přívlastek shodný a neshodný“ · `tyden` 8, `poradi` 3.

**Cíl:** Dítě najde přívlastek (rozvíjí podstatné jméno: *jaký? který? čí?*), rozliší shodný (mění tvar se jménem: *nový mobil – bez nového mobilu*) a neshodný (*kapitán týmu – bez kapitána týmu*) a odliší přívlastek neshodný od příslovečného určení (*dům u řeky* × *sedí u řeky*).

**Úvod pro rodiče:** Dnes dítě hledá přívlastek, slovo, které blíž popisuje podstatné jméno, a rozhoduje, jestli se se jménem mění (shodný), nebo ne (neshodný), a jestli patří ke jménu, nebo ke slovesu.

**Platí:** `Přívlastek: jaký? který? čí? (jméno)` · `shodný mění tvar se jménem` · `strom u cesty × stojí u cesty (PU)` (korektor 4. 10.: původní příklad byl odpovědí U4)

**Slovníček:** přívlastek, přívlastek shodný, přívlastek neshodný, příslovečné určení (PU), předmět.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | Jaký větný člen je tučné slovo? *Měří:* L30 | 4 kroky `dlazdice`, nabídka jako L30 U2: **A)** Adam hledá **klíče**. **B)** Ema bydlí na **vesnici**. **C)** Kvůli **zranění** Tomáš nehrál. **D)** Klára odpověděla **správně**. | A předmět · B místa · C příčiny · D způsobu | A PU → `predmet-za-pu`; B–D předmět → `pu-za-predmet`, jiný druh → `pu-druh-zamena` | A „hledá kde? kdy? jak? Nebo koho, co?“ · B, C „Polož kde? kdy? jak? proč?“ · D „Na kterou z nich odpovídá slovo správně?“ |
| U2 nová (5) | Shodný, nebo neshodný? (přiřazení) *Měří:* test změnou tvaru, i u přivlastňovacího *bratrovo* | 4 kroky `dlazdice` **přívlastek shodný · přívlastek neshodný**; popisky „A) nový“ (Tomáš má **nový** mobil.), „B) kapucí“ (Lucka má mikinu s **kapucí**.), „C) bratrovo“ (Adam si půjčil **bratrovo** kolo.), „D) týmu“ (Kapitán **týmu** dal gól.) | A shodný · B neshodný · C shodný · D neshodný | každá opačná volba → `privlastek-shoda-zamena` | „Vezmi větu A: bez … mobilu. Jak teď zní tučné slovo?“ Past: *bratrovo* odpovídá na *čí?*, ale je shodný. |
| U3 nová, **poslech** (5) | Poslechni si větu, odpověz na dvě otázky. *Měří:* ke kterému slovu člen patří | `poslech` `t8/l31-u3.mp3`, „Otázka 1“: *Ke kterému slovu patří „čepicí“?* kluk · čekal · vchodu · „Otázka 2“ (`final`): *Jaký větný člen je „u vchodu“?* PU místa · přívlastek neshodný · předmět | k1 kluk · final PU místa | k1 čekal → `privlastek-neshodny-za-pu`, vchodu → obecná; final přívlastek → `pu-za-privlastek`, předmět → `pu-za-predmet` | „Zkus říct čepicí s každým slovem z nabídky. Které spojení dává smysl?“ · „Ke kterému slovu patří u vchodu? Polož od něj otázku.“ |
| U4 detektiv (5) | Petr určil ve větě *Dům u řeky je starý.*: Dům – podmět; řeky – PU místa; je starý – přísudek. *Měří:* `privlastek-neshodny-za-pu` | `k1` `klik_ve_textu` (`max 1`): Dům(0) u(1) řeky(2) je(3) starý(4) · `final` `dlazdice` „Jaký je to větný člen?“: **přívlastek neshodný** · přívlastek shodný · PU místa · předmět | k1 `[2]` · final přívlastek neshodný | k1 `[0]`, `[3]`, `[4]` → `detektiv-jine-slovo`; final shodný → `privlastek-shoda-zamena`, místa → `privlastek-neshodny-za-pu`, předmět → `detektiv-oprava-jine-chyby` | „U každého Petrova slova: ke kterému slovu patří, ke jménu, nebo ke slovesu?“ |
| U5 kontrolní (6) | U každého označeného slova vyber větný člen. *Měří:* všechny členy tématu (8 rolí) | `oznac_role`, text **Kapitán našeho týmu dal krásný gól. Trenér stál u lavičky.** Kapitán(0) našeho(1) týmu(2) dal(3) krásný(4) gól(5) Trenér(6) stál(7) u(8) lavičky(9); `slova [0,1,2,4,5,7,9]`; 8 rolí (viz Společné) | 0 podmět · 1 shodný · 2 neshodný · 4 shodný · 5 předmět · 7 přísudek · 9 místa | `{"2": shodný}`, `{"1": neshodný}` → `privlastek-shoda-zamena`; `{"9": neshodný}` → `pu-za-privlastek`; `{"5": podmět}` → `podmet-za-predmet` | R55. „Týmu: ke kterému slovu patří? Řekni to s bez. Jak teď zní slovo týmu?“ |

**Kontrola pro vás (kontrolní):** Kapitán podmět; našeho, krásný shodné přívlastky; týmu neshodný přívlastek; gól předmět; stál přísudek; lavičky PU místa. 7 údajů. *našeho* je přivlastňovací zájmeno ve funkci shodného přívlastku (*náš tým – našeho týmu*).

---

## LEKCE 32 — Kontrola tématu: větné členy · diktát (`cj-t8-l32`)

`tema`: „Kontrola tématu: větné členy“ · `tyden` 8, `poradi` 4 (týdenní kontrola: U5 `tydenni: true` + `semafor_tydne`).

**Cíl:** Dítě v krátkém textu samo určí podmět, přísudek, předmět, příslovečné určení a přívlastek otázkou od slova, ke kterému člen patří, a zapíše krátký diktát.

**Úvod pro rodiče:** Dnes je kontrola celého tématu: dítě určuje všechny větné členy z posledních tří lekcí a na konci píše krátký diktát.

**Platí:** `Ptám se od slova, ke kterému patří` · `pádová otázka → předmět` · `kde, kdy, jak, proč → PU`

**Slovníček:** podmět a přísudek, předmět, příslovečné určení (PU), přívlastek shodný, přívlastek neshodný, diktát.

| Úloha | Zadání a co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| U1 rozcvička (4) | Každá řada jedna lekce. *Měří:* L29–L31 | 4 kroky `dlazdice`, nabídky se liší: **A)** Klára byla v kině. Jaký je přísudek? slovesný · jmenný se sponou **B)** Adam se bojí **bouřky**.: předmět · PU příčiny · podmět **C)** Lucka četla **nahlas**.: PU místa · času · způsobu · příčiny **D)** Kolo mého **bratra** je červené.: přívlastek shodný · přívlastek neshodný · předmět | A slovesný · B předmět · C způsobu · D neshodný | A jmenný → `prisudek-slovesny-za-jmenny`; B příčiny → `predmet-za-pu`, podmět → obecná; C jiný druh → `pu-druh-zamena`; D shodný → `privlastek-shoda-zamena`, předmět → obecná | A „kde Klára byla? A jaká?“ · B, C „kde? kdy? jak? proč? Jinak pádová otázka.“ · D „Řekni s bez. Jak teď zní slovo bratra?“ |
| U2 nová (5) | U každého označeného slova vyber větný člen. *Měří:* podmět, přísudek (i jmenný), předmět | `oznac_role`, text **Tomáš poslal Kláře zprávu. Zpráva byla dlouhá.** Tomáš(0) poslal(1) Kláře(2) zprávu(3) Zpráva(4) byla(5) dlouhá(6); `slova [0–6]`; role `podmět · přísudek · předmět` | 0, 4 podmět · 1, 5, 6 přísudek · 2, 3 předmět | `{"2": podmět, "3": podmět}` → `podmet-za-predmet`; `{"6": předmět}` → `prisudek-jmenny-jen-spona`; `{"0": přísudek, "1": podmět}` → `podmet-prisudek-zamena` | „Kláře: kdo poslal? A poslal komu?“ Past: *zpráva* jednou předmět, jednou podmět. |
| U3 nová (5) | Jaký větný člen je tučné spojení? (přiřazení) *Měří:* přívlastek neshodný × PU místa u stejného spojení | 4 kroky `dlazdice` **přívlastek neshodný · PU místa · předmět**; popisky „A) u okna“ (Dívka **u okna** je moje sestra.), „B) u okna“ (Lucka sedí **u okna**.), „C) od skříňky“ (Klíče **od skříňky** jsou v tašce.), „D) před školou“ (Tomáš čeká **před školou**.) | A, C přívlastek neshodný · B, D místa | A, C místa → `privlastek-neshodny-za-pu`; B, D přívlastek → `pu-za-privlastek`, předmět → `pu-za-predmet`; A, C předmět → obecná | „Ve větách A a B je stejné spojení u okna. Najdi v každé slovo, ke kterému patří.“ |
| U4 detektiv (5) | Petr určil ve větě *V sobotu jsme čekali na hřišti na trenéra.*: sobotu – předmět; hřišti – PU místa; trenéra – předmět. *Měří:* `pu-za-predmet` | `k1` `klik_ve_textu` (`max 1`): V(0) sobotu(1) jsme(2) čekali(3) na(4) hřišti(5) na(6) trenéra(7) · `final` `dlazdice` „Jaký je to větný člen?“: předmět · PU místa · **PU času** · PU způsobu | k1 `[1]` · final PU času | k1 `[5]`, `[7]` → `detektiv-jine-slovo`; final předmět → `pu-za-predmet`, místa → `detektiv-oprava-jine-chyby`, způsobu → `pu-druh-zamena` | „Ke každému Petrovu slovu: kde? kdy? na koho?“ Past: *čekali na trenéra* je opravdu předmět. |
| U5 kontrolní **týdenní** (6) | Napiš diktát, pak urči členy v nové větě. *Měří:* celé téma (semafor jen z `final`) | `k1` `diktat` 3 věty, 15 slov, `max_prehrani 2`, `hodnotit_interpunkci: false`, `hodnotit_velikost: false`: **v0** Náš(0) soused(1) je(2) kuchař(3). **v1** Ten(0) starý(1) dům(2) u(3) řeky(4) je(5) prázdný(6). **v2** Večer(0) čekal(1) Adam(2) venku(3). · `final` `oznac_role`, text **Malý pes naší sousedky ráno na zahradě honil kočku.** Malý(0) pes(1) naší(2) sousedky(3) ráno(4) na(5) zahradě(6) honil(7) kočku(8); `slova [0,1,2,3,4,6,7,8]`; 8 rolí | k1 `null` · final 0, 2 shodný · 1 podmět · 3 neshodný · 4 času · 6 místa · 7 přísudek · 8 předmět | `chyby_ocekavane`: v1 *starý* (1), *prázdný* (6) → `koncovka-prid-i-za-y`; v1 *dům* (2) → `u-carka-za-krouzek`; v1 *řeky* (4) → `koncovka-podst-i-za-y`. final: `{"3": shodný}` → `privlastek-shoda-zamena`; `{"6": neshodný}` → `pu-za-privlastek`; `{"4": předmět}` → `pu-za-predmet`; `{"8": podmět}` → `podmet-za-predmet` | R55. „Sousedky: ke kterému slovu patří? Řekni s bez. Jak teď zní slovo sousedky?“ `semafor_tydne`: zelená ≥ 7, oranžová 5–6, červená ≤ 4 z 8. |

**Diktát slovo po slově (OSNOVA §2.2):** *Náš, soused, je, kuchař, Ten, u, Večer, čekal, venku* bez jevu jiného tématu; *starý, prázdný* (ý po tvrdé souhlásce, Z5; jednotné číslo, žádné *malí/malý*), *řeky* (y po *k*, Z5), *dům* (ů uvnitř, Z5), *prázdný* (párová souhláska *zd*, Z5), *Adam* (velké písmeno, hlásí nahrávka a nehodnotí se), *čekal* (jednotné číslo minulého času). Žádné *i/y* po obojetné souhlásce, žádné *s, z, se, ze*, žádné *mě/mně*. Diktát podle OSNOVY §18 beze změny.

**Kontrola pro vás (kontrolní, final):** Malý, naší shodné přívlastky; pes podmět; sousedky neshodný přívlastek; ráno čas; zahradě místo; honil přísudek; kočku předmět. 8 údajů.

---

## Nahrávky (pro AUDIO.md)

Poslech ≤ 20 s, interpunkce se čte přirozeně, nic se nezdůrazňuje. Diktát podle AUDIO.md: každá věta samostatný soubor, věta zazní dvakrát (celá, pauza 2 s, pomalu po slovech 0,75× s pauzou 0,7 s), interpunkce se neříká, vlastní jména se hlásí.

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t8/l30-u3.mp3` | 30 / úloha 3 (`k1` i `final`) | poslech | Kvůli dešti jsme v sobotu zůstali doma. | nic nezdůrazňovat, ani „kvůli dešti“, ani „v sobotu“; bez pauzy mezi „dešti“ a „jsme“; cca 3 s | čeká |
| `t8/l31-u3.mp3` | 31 / úloha 3 (`k1` i `final`) | poslech | Kluk s modrou čepicí čekal u vchodu. | bez pauzy za „čepicí“ (pauza by napověděla, kam spojení patří); nic nezdůrazňovat; cca 3 s | čeká |
| `t8/l32-d1.mp3` | 32 / úloha 5, `k1`, věta 1 | diktát | Náš soused je kuchař. | 2× jako výše; interpunkce se neříká; „kuchař“ s jasným ř | čeká |
| `t8/l32-d2.mp3` | 32 / úloha 5, `k1`, věta 2 | diktát | Ten starý dům u řeky je prázdný. | 2× jako výše; délka ý v „starý“ a „prázdný“ musí být slyšet; „dům“ s dlouhým ů | čeká |
| `t8/l32-d3.mp3` | 32 / úloha 5, `k1`, věta 3 | diktát | Večer čekal Adam venku. | 2× jako výše; před jménem hlásit „velké písmeno — Adam“ | čeká |

**Pozor při slučování:** `AUDIO.md` už má řádky `t8/l29-u4.mp3` a `t8/l32-d1.mp3` až `t8/l32-d4.mp3` se zněním ze Spolu (základy, téma souvětí). Ty do Spolu 8 nepatří a ID se kryjí: `t8/l32-d1` až `d3` nahradit řádky výše, `t8/l29-u4` a `t8/l32-d4` smazat. Validátor kvůli starým řádkům u L32 chybu „nemá řádek v AUDIO.md“ nehlásí, u L30 a L31 ano. Celkem **5 nahrávek** (2 poslechy, 3 věty diktátu).

---

## Ověření ÚJČ

OVERENI_UJC

---

## Nejistoty

| Místo | Co | Stav |
|---|---|---|
| celé téma | Určení větného členu (podmět, předmět, PU, přívlastek) příručka ÚJČ jako výklad nemá; opírám se o id=610 (přísudek jmenný se sponou = *být* + jméno přídavné nebo podstatné), id=620 (vazba slovesa = předmět ve 4. p. i předložkový; „diskutovali nad šálkem čaje“ = místní určení), id=603 (přívlastek se shoduje se jménem v pádě, čísle a rodě), id=600 (podmět a přísudek) a o školskou praxi 6.–7. ročníku. Všechny příklady jsou vybrané tak, aby člen šel určit jen jedním způsobem (žádné *čte knihu o koních*, *dopis babičce*, *jde k lékaři*, *velmi rychle*). | OK, bez [OVĚŘIT] |
| L29 *byla doma*, *byl na tréninku*, *byla ve škole*, *byla v kině* | slovesný přísudek: za *být* není jméno, ale příslovce / předložkové spojení místa (id=610 mluví jen o jménu přídavném a podstatném) | OK |
| L29 U2, U5 *je brankář, je kapitánka* | 1. p. podstatného jména ve jmenném přísudku je správně (id=610: zařazení, trvalá vlastnost); 7. p. (*je brankářem*) by byl taky správný, ale dítě tvar nevolí, jen určuje člen | OK |
| L30 U4 *Celý večer* | PU času (jak dlouho? = čas ve školské praxi). Petr ho má správně, dítě ho jen nemá označit | OK |
| L30 U4 *o výletu* | 6. p. má podle příručky *výletě* i *výletu* (dubleta); tvar se nehodnotí, dítě kliká na slovo | OK |
| L30 U5, L32 U4 *čekala na zastávce* × *čekali na trenéra* | *čekat na koho, co* = předmět (vazba), *na zastávce, na hřišti* (6. p., kde?) = PU místa; záměrná past | OK |
| L31 U2 *bratrovo* | přivlastňovací přídavné jméno = přívlastek shodný (mění tvar: *bratrovo kolo – bez bratrova kola*); heslo *bratrův* v příručce [doplnit podle výsledku], výklad id=400 | OK |
| L31 U5 *našeho*, L32 U5 *naší* | přivlastňovací zájmeno ve funkci přívlastku shodného (školská praxe; tvary podle hesla *náš*) | OK |
| L32 U5 diktát *starý, prázdný* | OSNOVA §2.2 dává *-ý/-í* přídavných jmen do T3; tady jde o jednotné číslo po tvrdé souhlásce (Z5), ne o *malí × malý*. Diktát je převzatý z OSNOVY §18 | OK, ke zvážení vedoucím |
| L32 U5 čas | diktát 3 věty (každá 2× v nahrávce) + 8 štítků bude spíš 7–8 minut než 6 | ověří testovací rodič |

---

## Poznámky pro vedoucího

1. **8 rolí místo 9 (L31 U5, L32 U5 final).** ZADANI-OSMA §8 bod 8 navrhuje rozdělit krok po skupinách. Rozdělení by ale samo prozradilo hlavní rozlišení tématu (slovo v kroku „přívlastky a určení“ už není předmět; slovo v kroku „přívlastky“ už není PU). Proto jeden krok s 8 rolemi: přísudek bez druhu (druh měří L29 a rozcvičky L30, L32) a bez PU příčiny (v těchto větách žádná příčina není; příčina je v L30 U2–U3, L31 U1, L32 U1). Pokud chcete přesně podle §8, šlo by `final` rozdělit na *k2* (podmět, přísudek, předmět, PU místa, času, způsobu) a *final* (přívlastek shodný, neshodný, PU místa) — semafor by se pak počítal jen z menší části.
2. **L29 U4 `k1` jako dlaždice, ne klik.** Osnova má klik „slovo, které Petr určil špatně“. U neúplného přísudku jsou obhajitelné dvě odpovědi (*je* = Petrovo slovo, *kuchař* = zapomenuté slovo) a klik neumí přijmout jednu ze dvou. Dlaždice nabízí jen Petrova podtržená slova (*byla · je · hraje*); *final* má opravu ke každé větě, takže k1 neprozradí.
3. **L30 U4 `final` bez „přívlastku“.** Osnova navrhuje v nabídce *přívlastek*, ten je ale až v L31 (OSNOVA §2.3: lekce *n* jen z lekcí 1 … *n*−1). Nahrazeno *podmětem*.
4. **AUDIO.md:** staré řádky `t8/l29-u4.mp3`, `t8/l32-d1` až `d4.mp3` (Spolu, základy) kryjí ID nových nahrávek; viz oddíl Nahrávky. Validátor (`validator-cj.mjs`, kontrola `audioMd.includes(...)`) proto u L32 chybu nehlásí, přestože řádek se správným zněním chybí.
5. **Nález ve schématu (`obsah/schema.json`, `vstupCestina.audio` a `vety[].audio`):** pattern `^audio/cestina/t[1-8]/…` odmítne nahrávky témat 9 a 10 (`t9/…`, `t10/…`). Téma 8 to nepostihuje, autoři T9 (poslech L33, L34, diktát L36) a T10 narazí. Návrh: `t([1-9]|10)`.
6. **Diktát v T8** (OSNOVA §19 otázka 5) měří jen společný základ; větné členy diktát neověří. Nechávám podle ZADANI §8 bod 5, semafor tématu se počítá jen z `final`.
7. **Nové kódy nejsou potřeba.** Typické chyby tématu pokrývají kódy `prisudek-*`, `predmet-za-pu`, `pu-*`, `privlastek-*` (Spolu 8) a starší `podmet-*`, `prisudek-neni-sloveso`. V diktátu jsou holé kódy `koncovka-prid-i-za-y`, `koncovka-podst-i-za-y`, `u-carka-za-krouzek` (poslední je kód T10, ale popisuje přesně *dúm*, tedy Z5).
8. **Kontrola:** `npm run seed:validace -- --lekce cj-t8-l29,cj-t8-l30,cj-t8-l31,cj-t8-l32` → jediné chyby jsou chybějící řádky `t8/l30-u3` a `t8/l31-u3` v AUDIO.md (sloučí vedoucí); vlastní skript přes `vyhodnotKrok` a `vzorovaOdpoved`: 52 kroků, vzorové odpovědi správně, všech 124 špatných dlaždic a známých chyb vrací svůj kód, 4 očekávané chyby diktátu vrací `diktat-pravopis-<kód>`.
