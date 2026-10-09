# Téma 3 — Přídavná jména: naostro lekce (Spolu 8)

Verze 1.0, 9. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, Nejistoty), korektora (Ověření ÚJČ), autora nahrávek (Nahrávky). Lekce: `obsah/cestina/lekce/cj-t3-l9n.json` až `cj-t3-l12n.json` (dvojčata učebních lekcí `cj-t3-l9` až `cj-t3-l12`; téma 3 nemá rozpis učebních lekcí, vycházím z jejich JSON).

**Závazné vstupy:** `ZADANI-OSMA.md` (§3, §4, §8, §9), `PLAN-ROZSIRENI.md` §3, `OSNOVA.md` (§1–§4, §7, §16), `FORMAT-CJ.md`, `TYPY-CHYB.md`, `TERMINOLOGIE.md`, `AUDIO.md`, `obsah/SABLONA.md` §8, §9, §18, §19.

## Společné pro všechny čtyři lekce

- **Hlavička** jako učební lekce: `tema`, `kapitola` `pridavna-jmena`, `tyden` 3, `poradi` 1–4, `faze` `osma`, `cas_min` 25 (4 + 5 + 5 + 5 + 6). Id `cj-t3-l<n>n`, úlohy `…n-U1` až `U5`, poslední krok `final`.
- **Struktura** stejná jako u učební lekce (rozcvicka, nova, nova, detektiv, kontrolni); poslech ve stejné úloze (L9n a L11n U3), L12n má diktát a týdenní kontrolu (`tydenni: true`, `semafor_tydne`).
- **Těžší / objemnější:** víc položek (6 místo 4, 8 místo 6, 10–12 místo 8–10), v nabídce víc možností (4 dlaždice v řadě, konce -ý/-í/-é/-á, -ovi/-ovy/-ova), slova v jiných tvarech a pádech, delší texty, chyba detektiva nenápadnější (daleko od jména, ve 3. stupni, uprostřed věty mezi podobnými slovy).
- **Vše nové:** žádná věta, doplňované slovo ani příklad z učební lekce (stejné typy chyb ano). „Platí“ a slovníček mají jiné příklady než úlohy (strýcův, tetin, pilný, lesní, hustý, sladký).
- **Méně opory:** `uvod_pro_rodice` říká, že jde o naostro („Dítě tuhle látku dělalo v lekci …“), „Platí“ je jen připomenutí; `vysvetleni` v taháku říká, v čem je úloha těžší než v učební lekci. Tahák je plný.
- **„Dnes samo“:** otázky taháku neříkají odpověď žádného kroku ani neukazují na chybné slovo detektiva (u U2 L9n místo „Krok 2 a 4“ jen „Každý krok“, aby skupina neprozradila přivlastňovací slova).
- **Kódy chyb** jen z `TYPY-CHYB.md`: `sd-prislovce-za-pridavne`, `sd-podstatne-za-pridavne`, `sd-sloveso-za-pridavne`, `pridavne-tvrde-za-mekke`, `pridavne-privlastnovaci-za-tvrde`, `privlastnovaci-neuzna`, `stupnovani-nepravidelne-pravidelne`, `stupnovani-zamena`, `koncovka-prid-y-za-i`, `koncovka-prid-i-za-y`, `pridavne-shoda-s-jinym-jmenem`, `privlastnovaci-i-za-y`, `privlastnovaci-y-za-i`, `sd-podstatne-za-pridavne`, `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby`. Nový kód nepotřebuji (návrh viz Nejistoty).
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv; Honzík nikde.

---

## LEKCE 9n — Druhy přídavných jmen a stupňování (`cj-t3-l9n`)

Těžší než L9: řady se čtyřmi slovy (i sloveso), 6 slov k určení druhu i v jiném tvaru, poslech se třemi otázkami a delší větou, chyba detektiva až ve 3. stupni, kontrolní 2 × 6 slov (místo 2 × 4).

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z1: přídavné jméno ve čtyřčlenné rodině; `dlazdice` × 4. A) radostně, radost, raduje se, radostný · B) čistota, čistí, čistý, čistě · C) odvážný, odvážně, odvaha, odváží se · D) lenoší, líně, lenost, líný | radostný, čistý, odvážný, líný | příslovce → `sd-prislovce-za-pridavne`, podstatné → `sd-podstatne-za-pridavne`, sloveso → `sd-sloveso-za-pridavne` |
| U2 nová (5) | druh, 6 kroků `dlazdice` (tvrdé · měkké · přivlastňovací): večerní autobus, sestřin pokoj, tmavá mikina, bratrova kytara, školní hřiště, těžký kufr | měkké, přivl., tvrdé, přivl., měkké, tvrdé | `pridavne-tvrde-za-mekke`, `pridavne-privlastnovaci-za-tvrde`, `privlastnovaci-neuzna` |
| U3 nová, **poslech** (5) | `t3/l9n-u3.mp3`; k1 „Od kterého slova je utvořené slovo „horší“?“ (hořký · špatný · hrubý · hodný); k2 „Jaké přídavné jméno je slovo „Lucčina“?“; final „Které slovo z věty je ve 2. stupni?“ (stará · horší · nejteplejší · Lucčina) | k1 špatný · k2 přivlastňovací · final horší | k2 → `pridavne-privlastnovaci-za-tvrde`, `privlastnovaci-neuzna`; final nejteplejší → `stupnovani-zamena` |
| U4 detektiv (5) | Petr stupňoval: hezký – hezčí – nejhezčí · dlouhý – delší – **nejdloužší** · tichý – tišší – nejtišší · krátký – kratší – nejkratší. k1 dlaždice (řada), final oprava (ke každé řadě jedna) | k1 řada dlouhý · final dlouhý – delší – nejdelší | k1 jiná řada → `detektiv-jine-slovo`; final tichší, krátčí → `stupnovani-nepravidelne-pravidelne`, hezkejší → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | k1 `oznac_role` druh: „Tátův kamarád nám půjčil dřevěný stůl a zahradní lavici. Lucčiny staré brusle leží v sousední garáži.“ `slova` [0, 4, 7, 9, 10, 14]; final `oznac_role` stupeň: „Adam je nejvyšší z party, ale Tomáš je chytřejší. Klára má kratší vlasy než Ema a hnědé oči. Nejodvážnější je ale drobná Lucka.“ `slova` [2, 8, 11, 16, 18, 21] | k1 přivl., tvrdé, měkké, přivl., tvrdé, měkké · final 3., 2., 2., 1., 3., 1. | k1 Lucčiny tvrdé, zahradní tvrdé, staré měkké, Tátův měkké; final záměna stupně u nejvyšší, chytřejší, kratší, Nejodvážnější → `stupnovani-zamena` |

## LEKCE 10n — Koncovky -ý/-í tvrdých přídavných jmen (`cj-t3-l10n`)

Těžší než L10: 8 mezer místo 6, v nabídce i -á (ta kuřata, ta mláďata), nové pasti (hosté, přátelé, 4. pád *pozoruje líné lvy*, jiný pád *hnědého, obrovským*), detektiv s chybou daleko od jména a jiným jménem hned vedle, kontrolní 10 mezer se čtyřmi možnostmi.

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L9: druh *sousedovo*, *přední*; 2. st. *úzký*; 3. st. *tenký* (`dlazdice`) | přivlastňovací, měkké, užší, nejtenčí | `pridavne-privlastnovaci-za-tvrde`, `privlastnovaci-neuzna`, `pridavne-tvrde-za-mekke`, nejužší/tenčí → `stupnovani-zamena`, úzčí/nejtenkější → `stupnovani-nepravidelne-pravidelne` |
| U2 nová (5) | `doplnit_pismeno` 8 × ý/í: „Šikovn_ žáci … Pomal_ nákladní vlak … Zraněn_ brankář … Nadšen_ fanoušci … Pečliv_ zahradníci … Slavn_ zpěvák … Ochotn_ prodavači … Oblíben_ trenér píská.“ | í, ý, ý, í, í, ý, í, ý | mezery 0, 3, 6 ý → `koncovka-prid-y-za-i`; 1 í → `koncovka-prid-i-za-y` |
| U3 nová (5) | `doplnit_pismeno` 8 × ý/í/é/á: vzácn_ hosté, přátelé byli zmrzl_, Rozesmát_ děti, žlut_ kuřata, papírov_ krabice (vedle spolužáci), Psi jsou neklidn_, pod vysok_m stromem, Adam je zklaman_ | í, í, é, á, é, í, ý, ý | 0, 1 ý → `koncovka-prid-y-za-i`; 4 í → `pridavne-shoda-s-jinym-jmenem`; 7 í → `koncovka-prid-i-za-y` |
| U4 detektiv (5) | „Kluci z našeho nového týmu byli po zápase **zablácený**, ale hrdí.“ k1 `klik_ve_textu` (zablácený = 8); final „Co řekneš před jméno u chybného slova?“ ten · ti · ty · ta | k1 [8] · final ti | k1 navic [3, 10, 0] → `detektiv-jine-slovo`; final ten → `pridavne-shoda-s-jinym-jmenem`, ty/ta → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | `doplnit_pismeno` 10 × ý/í/é/á (zoo): usměvav_ pokladník, nedočkav_ návštěvníci, Pruhovan_ zebry, ošetřovatelé jsou laskav_, pozoruje lín_ lvy, kreslí hněd_ho medvěda, s obrovsk_m slonem, Mláďata jsou nemotorn_, Hlasit_ kluci, průvodce je trpěliv_ | ý, í, é, í, é, é, ý, á, í, ý | 1, 3, 8 ý → `koncovka-prid-y-za-i`; 9 í → `koncovka-prid-i-za-y` |

## LEKCE 11n — Přivlastňovací přídavná jména (`cj-t3-l11n`)

Těžší než L11: v nabídce i -ova (ta kamna, ta auta, ta kola), přivlastňovací i od obecných jmen (trenérův, sousedův, dědův, bratrův), pomnožná jména (nůžky, kamna, sáňky) a 4. pád (zná sousedovy bratrance, hledá dědovy hůlky), poslech se třemi otázkami a obráceným pořadím, detektiv uprostřed věty mezi třemi přivlastňovacími tvary, kontrolní 10 mezer se smíšenou nabídkou a jménem ve 3. pádě.

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L10: 4 × `doplnit_pismeno` (1 mezera, ý/í/é): Pozorn_ diváci · Hosté jsou z dárku nadšen_ · Kluci si obuli pruhovan_ ponožky · Žlut_ autobus | í, í, é, ý | A, B ý → `koncovka-prid-y-za-i`; C í → `pridavne-shoda-s-jinym-jmenem`; D í → `koncovka-prid-i-za-y` |
| U2 nová (5) | `doplnit_pismeno` 8 × i/y/a: Trenérov_ hráči, Sousedov_ slepice, Dědov_ kamna, Bratrov_ spolužáci, zná sousedov_ bratrance, Tomášov_ nůžky, Adamov_ bratři, Trenérov_ auta | i, y, a, i, y, y, i, a | 0, 6 y → `privlastnovaci-y-za-i`; 4, 5 i → `privlastnovaci-i-za-y` |
| U3 nová, **poslech** (5) | `t3/l11n-u3.mp3`; k1 první „Tomášovi“ (komu?), k2 druhé „Tomášovi“ (čí?), final „Jak se píše slovo, které ve větě stojí před slovem „brusle“?“ (Adamovi · Adamovy · Adamova) | k1 podstatné jméno · k2 přídavné jméno · final Adamovy | k1 → `sd-podstatne-za-pridavne`; k2 → `privlastnovaci-neuzna`; final Adamovi → `privlastnovaci-i-za-y` |
| U4 detektiv (5) | „Po tréninku leží v šatně **trenérovi** tašky, Klářiny boty a Tomášův dres.“ k1 klik (5); final ti · ty · ta · ten | k1 [5] · final ty | k1 navic [7, 10, 6] → `detektiv-jine-slovo`; final ti → `privlastnovaci-i-za-y`, ta/ten → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | `doplnit_pismeno` 10 mezer (u -ov_ i/y/a, jinak ý/í/é): Sousedov_ děti, rodiče jsou pyšn_, Na vysok_m kopci, Tomášov_ bratranci, Tomášov_ sáňky, Adamov_ kola, dědov_ hůlky, Promrzl_ kluci, tepl_ čaj, podává vlněnou šálu Adamov_ | y, í, é, i, y, a, y, í, ý, i | 0 i → `privlastnovaci-i-za-y`; 3, 9 y → `privlastnovaci-y-za-i`; 1 ý → `koncovka-prid-y-za-i` |

## LEKCE 12n — Kontrola tématu: přídavná jména (`cj-t3-l12n`)

Těžší než L12: rozcvička s výběrem ze čtyř slov a 3. stupněm, druh u 8 slov v různých pádech (místo 6 v 1. pádě), stupňování 6 slov se střídáním 2. a 3. stupně (místo 4 × 2. stupeň), detektiv s chybou na konci dlouhé věty, diktát s 5 hlídanými slovy (místo 4), doplňovačka 12 mezer (místo 10) s nabídkou i/y/a.

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | A) měkké mezi hnědý, zadní, Klářin, kulatý · B) 3. st. *široký* · C) „Po škole na nás čekají ___ přátelé.“ (milý · milí · milé) · D) „V šatně visí ___ bundy.“ (trenérovi · trenérovy · trenérova) | zadní, nejširší, milí, trenérovy | `pridavne-tvrde-za-mekke`, `privlastnovaci-neuzna`, `stupnovani-zamena`, `stupnovani-nepravidelne-pravidelne`, `koncovka-prid-y-za-i`, `privlastnovaci-i-za-y` |
| U2 nová (5) | `oznac_role` druh u 8 slov: „Sousedovo štěně spí v teplém proutěném pelíšku. Lucčiny lyže stojí u předních dveří a vedle nich leží dědův deštník. Nedělní koláč voní až do horního patra.“ `slova` [0, 4, 5, 7, 11, 17, 19, 24] | přivl., tvrdé, tvrdé, přivl., měkké, přivl., měkké, měkké | Lucčiny tvrdé, předních tvrdé, teplém měkké, Sousedovo měkké |
| U3 nová (5) | 6 × `dlazdice`: 2. st. hluboký, 3. st. lehký, 2. st. úzký, 3. st. hladký, 2. st. sladký, 3. st. nízký | hlubší, nejlehčí, užší, nejhladší, sladší, nejnižší | pravidelně utvořené (hlubočejší, nejlehkejší, úzčejší, nejhladkejší, sladkejší, nejnízčí) → `stupnovani-nepravidelne-pravidelne`; druhý stupeň místo třetího a naopak → `stupnovani-zamena` |
| U4 detektiv (5) | „Tomášovy sestry jsou ráno rozesmáté, ale jeho bratranci jsou ještě **rozespalý**.“ k1 klik (10); final ten · ti · ty · ta | k1 [10] · final ti | k1 navic [0, 4, 7] → `detektiv-jine-slovo`; final ten → `koncovka-prid-y-za-i`, ty/ta → `detektiv-oprava-jine-chyby` |
| U5 kontrolní **týdenní** (6) | k1 `diktat` 4 věty, 20 slov, `max_prehrani` 2, `hodnotit_interpunkci` false, `hodnotit_velikost` false (věty viz Nahrávky); final `doplnit_pismeno` 12 mezer: Tomášov_ spolužáci, trenér je přísn_, nedočkav_ děti, sousedov_ sáňky, Adamov_ kamarádi, těžk_ batohy, Na zamrzl_m rybníku, odvážn_ kluci, trenérov_ hrnky, s hork_m čajem, kluci jsou promrzl_, Tomášov_ lyže | final i, ý, é, y, i, é, é, í, y, ý, í, y | diktát `chyby_ocekavane`: Laskaví `koncovka-prid-y-za-i`, Adamovy `privlastnovaci-i-za-y`, chlupatý `koncovka-prid-i-za-y`, Tomášovi `privlastnovaci-y-za-i`, nadšení `koncovka-prid-y-za-i`; final 0 y → `privlastnovaci-y-za-i`, 3 i → `privlastnovaci-i-za-y`, 5 í → `pridavne-shoda-s-jinym-jmenem`, 10 ý → `koncovka-prid-y-za-i` |

`semafor_tydne` (z `final`, 12 mezer): zelená 11–12 (~90 %), oranžová 8–10 (~70 %), červená 0–7.

**Diktát slovo po slově** (OSNOVA §2.2): Laskaví (T3) · kamarádi, čekají (Z5) · před · domem; Adamovy (T3) · starší, sestry, hrají (Z5) · volejbal; Sousedův (Z5 *ů*) · chlupatý (T3) · pes · leží, koberci (Z5); Tomášovi (T3) · bratři (Z5) · jsou · nadšení (T3). Slovesa jen v přítomném čase, žádné *s/z*, *mě/mně*, *i/y* po obojetné souhlásce v kořeni ani příponě (proto ne *Emin*, *bydlí*, *klíče*).

---

## Nahrávky (pro AUDIO.md)

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t3/l9n-u3.mp3` | 9n / úloha 3 (`k1`, `k2` i `final`) | poslech | Lucčina stará bunda je horší než moje, ale pořád je ze všech nejteplejší. | Oznamovací intonace, nic nezdůrazňovat (hlavně ne „horší“ a „nejteplejší“); „Lucčina“ vyslovit celé [lucčina]; koncovky zřetelně. Cca 5 s. | čeká na Pavla |
| `t3/l11n-u3.mp3` | 11n / úloha 3 (`k1`, `k2` i `final`) | poslech | Klára půjčila Tomášovi Adamovy brusle a Tomášovi spolužáci jen zírali. | Oznamovací intonace, nic nezdůrazňovat; mezi „Tomášovi“ a „Adamovy“ bez pauzy navíc, obě slova stejně neutrálně. Cca 5 s. | čeká na Pavla |
| `t3/l12n-d1.mp3` | 12n / úloha 5 (diktát, věta 1) | diktát | Laskaví kamarádi čekají před domem. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t3/l12n-d2.mp3` | 12n / úloha 5 (diktát, věta 2) | diktát | Adamovy starší sestry hrají volejbal. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t3/l12n-d3.mp3` | 12n / úloha 5 (diktát, věta 3) | diktát | Sousedův chlupatý pes leží na koberci. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t3/l12n-d4.mp3` | 12n / úloha 5 (diktát, věta 4) | diktát | Tomášovi bratři jsou nadšení. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |

**Celkem 6 nahrávek** (2 poslechy, 4 věty diktátu). Do `AUDIO.md` je sloučí vedoucí; do té doby validátor hlásí jen „nahrávka nemá řádek v AUDIO.md“.

---

## Ověření ÚJČ

Ověřeno 9. 10. 2026 přes `bash nastroje/ujc.sh` (server byl přetížený, část dotazů vypršela; slova, která se ověřit nepodařilo, jsem nahradil ověřenými, viz Nejistoty).

| tvar / jev | lekce | výsledek v ÚJČ |
|---|---|---|
| *radostný, čistý, odvážný, líný* příd.; *radostně, čistě, odvážně, líně* přísl.; *radost, čistota, odvaha, lenost* ž.; *radovat se, čistit, odvážit se, lenošit* slovesa | 9n U1 | hesla (SSČ: příd. / přísl. / ž. / ned., dok.) |
| *večerní, školní, nedělní, noční, denní, lesní, sousední, zahradní, přední, zadní, horní* → měkké; *tmavý, těžký, dřevěný, hnědý, drobný, kulatý, teplý, proutěný, starý* → tvrdé | 9n, 10n, 12n | hesla, všechna příd. |
| *špatný – horší* (řidč. *špatnější*), *hezčí, tišší, kratší, delší / nejdelší, vyšší, chytřejší, nejodvážnější, užší, tenčí, hlubší, lehčí, hladší, sladší, nižší, širší* | 9n, 10n, 12n | stupňování v heslech; *hořký – hořčejší, hrubý – hrubší/hrubější, hodný – hodnější* (žádné nedá *horší*); *čistý, tlustý, mělký, žlutý, horní* mají dvojí 2. stupeň → nehodnotí se (mělký vyřazen z červené L9n) |
| přivlastňovací *sestřin, bratrova, Lucčina/Lucčiny, Tátův, sousedovo, trenérův, dědův, Klářiny, Tomášovy, Adamovy* | 9n–12n | id=400 (přípona -ův/-ov- i od obecných jmen osob, -in od ženských; shoda podle rodu a životnosti: *Jiráskovy Psohlavce* = *sousedovy bratrance* ve 4. p.), id=756 (*r → ř, k → č*: Klára → Klářin, Lucka → Lucčin) |
| *host* (1. mn. *hosté*, hovor. *hosti*), *přítel* (*přátelé*), *ošetřovatel* (*ošetřovatelé*), *návštěvník* (*návštěvníci*), *průvodce* (`--id průvodce_1`: m. živ.), *lev* (`--id lev_1`: 1. mn. *lvi*, 4. mn. *lvy*), *bratranec* m. živ. | 10n, 11n, 12n | v obou podobách *hosté/hosti* platí *ti* → -í; ostatní jednoznačné |
| *kuře → kuřata, mládě → mláďata, štěně* s.; *kamna* s. pomn.; *nůžky, sáňky* ž. pomn.; *lyže, slepice, hůlka, šála, teta, bota* ž.; *auto, kolo, patro* s.; *hrnek, batoh, rybník, koberec, deštník, pelíšek, dres* m. neživ.; *trenér, strýc* m. živ. | 10n–12n | rod a tvary v tabulkách |
| *vzácný, zmrzlý, rozesmátý, žlutý, papírový, neklidný, zklamaný, zablácený* (příručka: běžnější vedle *zblácený*), *hrdý, usměvavý, nedočkavý, pruhovaný, laskavý, obrovský, nemotorný, hlasitý, trpělivý, šikovný, pomalý, zraněný, nadšený, pečlivý, slavný, ochotný, oblíbený, pozorný, pyšný, promrzlý, vlněný, přísný, zamrzlý, horký, rozespalý, chlupatý, zpocený* | 10n–12n | hesla, příd. (u *zraněný* i substantivum, ve větě jde o příd.) |
| diktát L12n: *Laskaví, Adamovy, chlupatý, Tomášovi, nadšení* + Z5 | 12n | viz rozbor slovo po slově výše |

## Nejistoty

- **Neověřeno (server ÚJČ nedostupný, opakovaně timeout) a proto nahrazeno:** *věrný* (diktát → *Laskaví*), *vyčerpaný, zasněžený, kožený, opožděný, připravený* (→ *promrzlý, vysoký, pruhovaný, žlutý, rozesmátý*), *drahý – dražší* (L12n U3 → *úzký – užší*), *brýle, králík* (→ *nůžky, bratrance*), *papoušek, teniska, kozačka* (→ *kluci, boty, lyže*), *pracovitě, hustý* (oranžová / „Platí“ L9n), *pozvaný* (jen sloveso *pozvat*, → *vzácný*).
- **Nehodnocená slova bez vlastního dotazu:** podstatná jména v textu kolem mezer (*dveře, divák, ponožka, koleje* ap.) a slova v oranžových a červených radách (*opatrný, rychlý, drahá auta, sáně*) — jen kontext, žádný hodnocený tvar na nich nestojí.
- **L11n U3 final** (poslech): dítě rozhoduje *Adamovi × Adamovy*, které zní stejně. OSNOVA §3 to připouští („nahrávka dá větu a smysl, rozhodnutí dítě udělá podle pravidla“ — tady test *ty brusle*), ale je to první poslech v tématu, kde se volí pravopis; vedoucí ať potvrdí.
- **L11n U5 poslední mezera** *podává vlněnou šálu Adamov_* je jméno Adam ve 3. pádě (i). Přivlastňovací čtení by vyžadovalo *Adamovu* (není v nabídce), takže odpověď je jednoznačná.
- **L12n U5 diktát** obsahuje *starší* (2. stupeň, -ší po š je Z5) — nehlídá se.
- **Kód pro -í místo -é/-á** (*pozoruje líní lvy, ti děti, ty mláďata → nemotorní*) ve slovníku není; tyto mezery jsou obecná chyba a jsou zmíněné v taháku. **Návrh nového kódu** `koncovka-prid-i-za-e`: „napíše -í tam, kde patří -é/-á (ty děti, ty lvy ve 4. pádě, ta mláďata)“, otázka „Řekni před jméno ty, nebo ta. Jaký konec k tomu patří?“ — jen návrh, v JSON zatím nepoužit.
- **Validátor/web:** bez nálezů; jediná chyba validátoru je „nahrávka nemá řádek v AUDIO.md“ (6 nahrávek výše, sloučí vedoucí).

## Korektura (korektor, 9. 10. 2026)

Všechny hodnocené tvary znovu ověřeny přes `nastroje/ujc.sh` (stupňování z tabulek hesel, rody a tvary jmen, id=400, 410, 756); indexy, vzorové odpovědi, známé chyby a `chyby_ocekavane` diktátu prověřeny skriptem přes `vyhodnotKrok`. Opraveno v JSON i výše v rozpisu:

- **L11n U3 nahrávka:** „… a Tomášovi kamarádi se divili“ → „… a Tomášovi spolužáci jen zírali“. *divit se* má 3. pád (*divili se Tomášovi*), druhé *Tomášovi* šlo číst i jako jméno ve 3. pádě; *zírat* 3. pád nemá. Zároveň *Tomášovi kamarádi* je z učební lekce L11. Final (*Adamovi × Adamovy*, povolil vedoucí): jediné smysluplné čtení je *půjčila komu? Tomášovi* + *čí brusle? Adamovy*; *Adamova* vylučuje výslovnost, *Adamovi* (3. p.) by potřebovalo spojku *a* → jedno řešení.
- **L11n U3 otázka 1:** „Kdo co komu půjčil?“ napovídala *komu?* u kroku 1 → „O čem ta věta je? Řekni to vlastními slovy.“
- **L11n U2, U5:** *Adamov_ kamarádi*, *Tomášov_ kamarádi* byly převzaté z učební L11 → *Adamov_ bratři*, *Tomášov_ bratranci*.
- **L12n diktát věta 2:** *tenis* → *volejbal* (*tenis* se píše s *i* proti výslovnosti — pravopis cizího slova, ne Z5).
- **L9n U4 otázka 2:** „U každé řady přidej k 2. stupni nej-“ v režimu „Dnes samo“ zužovala hledání na chybný 3. stupeň → „U každé řady řekni 2. i 3. stupeň ve větě. Sedí všechny tvary, které Petr napsal?“
- **L10n U3 oranžová:** *pozvaní přátelé* (heslo *pozvaný* v příručce není) → *staří přátelé*.

Bez nálezu: zbylé hodnocené tvary, druhy, stupně, kódy chyb, semafory, `tisk.zadani`. *průvodce* v L10n U5 je osoba v j. č. (*ten průvodce → trpělivý*); sporné dvojí skloňování (OSNOVA §16) se týká jen knihy. *saně/sáně* (oranžové rady L11n) je dubleta jen v pravopisu slova *sáně*, které se nehodnotí.
- Neověřeno (ÚJČ neodpověděl): sloveso *zírat* v nahrávce L11n — nehodnotí se, jde jen o vazbu bez 3. pádu; *sourozenci* proto nahrazeno ověřeným *bratranci*.
