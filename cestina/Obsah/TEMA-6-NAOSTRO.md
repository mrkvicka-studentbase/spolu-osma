# Téma 6 — Vyjmenovaná slova: naostro lekce (Spolu 8)

Verze 1.1, 14. 10. 2026 (1.1 = korektura ÚJČ, změny v oddílu „Korektura 14. 10.“ na konci). Verze 1.0, 14. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího (schválení, Nejistoty), korektora (Ověření ÚJČ), autora nahrávek (Nahrávky). Lekce: `obsah/cestina/lekce/cj-t6-l21n.json` až `cj-t6-l24n.json` (dvojčata učebních lekcí `cj-t6-l21` až `cj-t6-l24`, rozpis učebních lekcí `TEMA-6.md`).

**Závazné vstupy:** `ZADANI-OSMA.md` (§3, §4, §8, §9), `PLAN-ROZSIRENI.md` §3, `OSNOVA.md` (§1–§4, §10, §16), `FORMAT-CJ.md`, `TYPY-CHYB.md`, `TERMINOLOGIE.md`, `AUDIO.md`, `obsah/SABLONA.md` §4, §8, §9, §18, §19.

## Společné pro všechny čtyři lekce

- **Hlavička** jako učební lekce: `tema`, `kapitola` `vyjmenovana-slova`, `tyden` 6, `poradi` 1–4, `faze` `osma`, `cas_min` 25 (4 + 5 + 5 + 5 + 6). Id `cj-t6-l<n>n`, úlohy `…n-U1` až `U5`, poslední krok `final`.
- **Struktura** stejná jako u učební lekce (rozcvicka, nova, nova, detektiv, kontrolni); poslech ve stejné úloze (L21n a L23n U3), L24n má diktát a týdenní kontrolu (`tydenni: true`, `semafor_tydne`).
- **Těžší / objemnější:** rozcvičky mají v každé řadě dvě slova (8 písmen místo 4), doplňovačky 10 mezer místo 8 a kontrolní 12 místo 10, ano/ne 6 slov místo 4, výběr příbuzných 8 slov místo 6, poslechy 4 věty místo 3. Víc slov je **jen z rodiny** vyjmenovaného slova (omylem, myčka, smysl, býček, nezvykla, nasytil, jazykolam, přemýšlela, třpytivý, jazýček) a vedle nich stojí **zrádná slova s i**, která začínají stejně (slíbil × slyšet, pobíhala × být, plivat × plýtvat, silnice, víčko, vichřice, pilně). Nové jsou **dvojice s předponou** (dobít × dobýt, přibylo, přibil, nabít, zbylo, odbýt, ubylo) a **předpona vy- za ne-** (nevyšla, nevyhrál, nevyšel). Detektiv má delší text a chybu uprostřed mezi zrádnými slovy.
- **Vše nové:** žádná věta, slovo v mezeře ani příklad z učebních lekcí L21–L24 (stejné typy chyb ano). „Platí“ a semafory mají jiné příklady než úlohy téže lekce.
- **Mezery Z5 nenahrazují jev tématu:** tvrdé/měkké souhlásky jen v rozcvičce L21n (tam je má i učební L21 — ledoborec podle OSNOVA §2.3); všechny ostatní mezery jsou *i/y* po *b, l, m, p, s, v, z* v kořeni nebo v předponě *vy-*.
- **Hranice tématu (OSNOVA §2.2, §10):** žádná mezera v koncovce, nic po *f*, v mezerách jen domácí slova, *Honzík* v naostro lekcích není.
- **Méně opory:** `uvod_pro_rodice` říká, že jde o naostro („Dítě tuhle látku dělalo v lekci …“, 2 věty), „Platí“ je jen připomenutí; `vysvetleni` v taháku říká, v čem je úloha těžší než v učební lekci. Tahák je plný, slovníček s řadami jako u učební lekce.
- **„Dnes samo“:** otázky taháku neříkají odpověď žádného kroku (slovo z mezery vždy s `_`), u ano/ne nejsou seskupené podle odpovědi („A až C“, „D až F“) a neukazují na chybné slovo detektiva.
- **Kódy chyb** jen z `TYPY-CHYB.md`: `vs-b/l/m/p/s/v/z-i-za-y`, `vs-b/l/m/p/s/v/z-y-za-i` (podle písmene), `vs-pribuzne-neuzna` (slovo z rodiny, odvozené příponou nebo předponou mimo řadu), `vs-predpona-vy-i`, `vs-dvojice-vyznam`, `detektiv-jine-slovo`, `detektiv-oprava-jine-chyby`. Pravidlo přiřazení kódů je stejné jako v `TEMA-6.md` (Společné).
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema; Petr jen detektiv.
- **Slovní limity SABLONA §4** zkontrolovány skriptem (otázky ≤ 25, typická chyba ≤ 50 / kontrolní ≤ 90, semafory 25/60/75, vysvětlení ≤ 70, „Platí“ ≤ 36 znaků).

---

## LEKCE 21n — Po B, L, M (`cj-t6-l21n`) · poslech U3

Těžší než L21: rozcvička se dvěma slovy v řadě (v řadě C dlouhé *ý*), doplňovačky 10 a 12 mezer (místo 8 a 10) s víc slovy jen z rodiny a se zrádnými slovy s *i*, poslech se čtyřmi větami a slovy s předponou (*dobít × dobýt, přibylo*), detektiv ve třetí větě delšího textu mezi zrádným *polila* a slovy z řad.

**Platí:** `Řada nebo rodina → y, jinak i` · `Rodina: smyk – smyčka` · `být/bít, mýt/mít: rozhodne význam`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | Z5 tvrdé × měkké (ledoborec jako L21), 4 × `doplnit_pismeno` po 2 mezerách: A) t_kev a ř_dič · B) š_roký r_bník · C) r_chlý mot_l · D) c_zí hř_ště | A y, i · B i, y · C y, ý · D i, i | obecná (jako L21) |
| U2 nová (5) | B, L, M, 10 mezer: „Adam se s rodiči stěhoval do nového b_tu. Je bl_zko školy, a tak mu Tomáš sl_bil, že pomůže. Celé dopoledne nosili náb_tek. Pak Adam zapojil m_čku a hledal, kam dát starou m_su. Večer chtěl zam_kat sklep, ale om_lem tam nechal rozsvíceno. Nakonec si oba sedli na gauč a l_zali nanuky. Táta se smál, že bez Tomáše by stěhování nemělo sm_sl.“ | y, í, í, y, y, í, y, y, í, y | m7 i (omylem) → `vs-pribuzne-neuzna` · m3 i (nábytek) → `vs-b-i-za-y` · m2 ý (slíbil) → `vs-l-y-za-i` · m5 ý (mísu) → `vs-m-y-za-i`; ostatní obecná, zmíněné v taháku |
| U3 nová, **poslech** (5) | `t6/l21n-u3.mp3`, 4 kroky dlaždic: k1 dobýt · **dobít** · k2 **dobýt** · dobít · k3 přibilo · **přibylo** · final mýt · **mít** | dobít, dobýt, přibylo, mít | jiná dlaždice → `vs-dvojice-vyznam` |
| U4 detektiv (5) | „Ráno jsme sousedovi pomáhali s dobytkem. Lucka se omylem polila mlékem a pak se tomu sama smála. Odpoledne jsme se brouzdali v **bistřině** a večer jsme z okna pozorovali, jak se blýská.“ k1 klik (22); final „Ke kterému vyjmenovanému slovu patří?“ mýlit se · bylina · **bystrý** · blýskat se | k1 [22] · final bystrý | k1 navic [5, 8, 9, 31] (dobytkem, omylem, polila, blýská) → `detektiv-jine-slovo`; final jiná → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | 12 mezer: „Ema strávila týden u dědy na statku, kde děda chová dob_tek. Nejraději měla malého b_čka. Jednou ráno zm_zel a Ema dlouho pob_hala po celém statku. Nakonec ho našla u potoka, který tiše pl_ne loukou. Děda se tak smál, až se mu leskla l_sá hlava. Za odměnu dostala Ema kl_č od půdy. Večer m_chala těsto na palačinky a pak je hladově pol_kala. Na zahradě lezl hlem_žď a ve vzduchu létalo chm_ří. V noci Ema zab_la komára, který jí bzučel u ucha.“ | y, ý, i, í, y, y, í, í, y, ý, ý, i | m0 i → `vs-b-i-za-y` · m3 ý (pobíhala) → `vs-b-y-za-i` · m5 i (lysá) → `vs-l-i-za-y` · m7 ý (míchala) → `vs-m-y-za-i` |

## LEKCE 22n — Po P, S, V, Z (`cj-t6-l22n`)

Těžší než L22: rozcvička z L21 na dvojicích podobně začínajících slov (*plivat × plýtvat, myslivec × míří*), slova z řad v jiných tvarech (*netopýři, klopýtla, třpytily, nazývá*), ano/ne u 6 slov (místo 4), detektiv s chybou ve slově z rodiny (*neobvikle*) uprostřed delšího textu, kontrolní 12 mezer se třemi slovy jen z rodiny a pěti zrádnými slovy s *i*.

**Platí:** `Po P, S, V, Z: řada, rodina → y` · `Rodina: pysk – pyskatý` · `povyk, výt × pivoňka, síť`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L21, 4 × 2 mezery: A) pl_ce a l_tko · B) m_slivec m_ří · C) pl_vat a pl_tvat · D) zb_tek b_cí soupravy | A í, ý · B y, í · C i, ý · D y, i | A ý → `vs-l-y-za-i`, í → `vs-l-i-za-y` · B i → `vs-pribuzne-neuzna`, ý → `vs-m-y-za-i` · C y → `vs-l-y-za-i`, í → `vs-l-i-za-y` · D i → `vs-pribuzne-neuzna`, y → `vs-b-y-za-i` |
| U2 nová (5) | P, S, V, Z, 10 mezer: „Adam a Ema šli za soumraku k rybníku, který se naz_vá Ostrov. Nad vodou poletovali netop_ři a na hrázi na ně s_čela husa. Ema měla nové boty, na které si ještě nezv_kla, a dvakrát klop_tla. Z rákosí se ozval tenký p_skot. Domů se vraceli po s_lnici. Na nebi se třp_tily hvězdy a oba na ně z_rali. Doma je u dveří v_tal pes.“ | ý, ý, y, y, ý, í, i, y, í, í | m1 í → `vs-p-i-za-y` · m3 i (nezvykla) → `vs-pribuzne-neuzna` · m6 y → `vs-s-y-za-i` · m9 ý → `vs-v-y-za-i` |
| U3 nová (5) | 6 × ano/ne „Patří slovo do rodiny některého vyjmenovaného slova?“: A) s_novec · B) p_lný · C) v_čko · D) jaz_ček · E) s_pký · F) s_tko (popisky s mezerou, aby pravopis neprozradil odpověď) | ano, ne, ne, ano, ano, ne | ano-slova „ne“ → `vs-pribuzne-neuzna`; B „ano“ → `vs-p-y-za-i`, C → `vs-v-y-za-i`, F → `vs-s-y-za-i` |
| U4 detektiv (5) | „Klára jela s Tomášem na kolech k babičce. U plotu na ně syčela husa. Bylo **neobvikle** teplo a na silnici se třpytilo slunce. Babička je přivítala a nasypala jim do misky oříšky.“ k1 klik (15); final sypat · syčet · **zvykat** · třpytit se | k1 [15] · final zvykat | k1 navic [12, 19, 21, 25, 27] (syčela, silnici, třpytilo, přivítala, nasypala) → `detektiv-jine-slovo`; final jiná → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | 12 mezer (vaření): „…nakrájela s_rovou zeleninu… otevřel dv_řka trouby a p_chl vidličkou do kuřete. Malý bratr radostně v_skal a skákal po kuchyni jako op_ce. …v_šňový koláč… řekl jaz_kolam. Na okně us_chala bazalka… vyhříval slep_š. Oběd nakonec nas_til celou rodinu. …od táty žv_kačky… že poz_tří budou vařit znovu.“ | y, í, í, ý, i, i, y, y, ý, y, ý, í | m0 i → `vs-s-i-za-y` · m4 y (opice) → `vs-p-y-za-i` · m5 y (višňový) → `vs-v-y-za-i` · m9 i (nasytil) → `vs-pribuzne-neuzna` |

## LEKCE 23n — Předpona vy-/vý- a dvojice slov (`cj-t6-l23n`) · poslech U3

Těžší než L23: rozcvička z L21–L22 na dvojicích (slovo z rodiny × zrádné s *i*), ano/ne „předpona?“ u 6 slov (místo 4), poslech se čtyřmi větami a slovy v jiných tvarech (*výra × víra, víru × výru, vila × vyla*), detektiv s předponou schovanou za *ne-* (*nevihrál*) vedle *přivítal* (předpona *při-*, pak *ví-*), kontrolní 12 mezer s *nevyšla* a dvojicemi *zavyl, zbylo*.

**Platí:** `Předpona vy-/vý- → y` · `Zakryj vy-: zbude slovo?` · `vy-letět × vítězit`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | L21–L22, 4 × 2 mezery: A) b_tost a rozb_tá váza · B) m_ší díra, m_rný déšť · C) s_rka a sl_mák · D) zv_k a záv_st | A y, i · B y, í · C i, i · D y, i | A i → `vs-pribuzne-neuzna`, y → `vs-b-y-za-i` · B i → `vs-pribuzne-neuzna`, ý → `vs-m-y-za-i` · C y → `vs-s-y-za-i`, `vs-l-y-za-i` · D i → `vs-pribuzne-neuzna`, y → `vs-v-y-za-i` |
| U2 nová (5) | 6 × ano/ne „Jde oddělit vy-/vý- tak, že zbude slovo?“: A) v_skok · B) v_čko · C) v_čerpat · D) v_šňový · E) v_chřice · F) v_fotit | ano, ne, ano, ne, ne, ano | ano-slova „ne“ → `vs-predpona-vy-i`; ne-slova „ano“ → `vs-v-y-za-i` |
| U3 nová, **poslech** (5) | `t6/l23n-u3.mp3`, 4 kroky: k1 víra · **výra** · k2 výru · **víru** · k3 vyla · **vila** · final **výt** · vít | výra, víru, vila, výt | jiná dlaždice → `vs-dvojice-vyznam` |
| U4 detektiv (5) | „Adam se celý týden pilně připravoval, ale závod nakonec **nevihrál**. Trenér ho přesto přivítal s úsměvem a vysvětlil mu, kde udělal chybu. Večer Adam vyprávěl o závodě celé rodině.“ k1 klik (9); final „Proč se v něm píše y?“ Je to vyjmenované slovo · **Je v něm předpona vy-** · Je příbuzné se slovem vítat · Po v se píše vždy y | k1 [9] · final předpona | k1 navic [4, 13, 17, 24] (pilně, přivítal, vysvětlil, vyprávěl) → `detektiv-jine-slovo`; final jiná → `detektiv-oprava-jine-chyby` |
| U5 kontrolní (6) | 12 mezer (chata): „V pátek Lucka v_stoupila z vlaku… se zvedla v_chřice a vítr venku hrozivě zav_l. Lucka nemohla spát a v_koukla z okna. Ráno už bylo kl_dno, ale Lucka nev_šla ven… oblékla teplou bundu a našla zv_řata, která se schovávala na suchém m_stě pod kůlnou. … Lucka do něj dm_chala. …nemá pl_tvat dřevem. Ze včerejší večeře zb_lo pár brambor… Večer jim do oken sv_til měsíc.“ | y, i, y, y, i, y, í, í, ý, ý, y, í | m5 i (nevyšla) → `vs-predpona-vy-i` · m1 y (vichřice) → `vs-v-y-za-i` · m2 i (zavyl) → `vs-dvojice-vyznam` · m8 í (dmýchala) → `vs-m-i-za-y` |

## LEKCE 24n — Kontrola tématu: vyjmenovaná slova (`cj-t6-l24n`) · diktát

Těžší než L24: rozcvička s dvojicemi se předponou (*přibil, zbylo, nabít, odbýt*), výběr příbuzných z 8 slov, která všechna mají *y* (místo 6), doplňovačka 10 mezer (místo 8) s víc slovy z rodin a dvojicí *ubylo*, detektiv se záměnou ve slově s předponou (*dobýt mobil*), diktát 24 slov s 9 hlídanými slovy (místo 17 a 8), text 12 mezer (místo 10) s *nevyšel* a *odbila*.

**Platí:** `Řada, rodina, předpona vy- → y` · `Co slovo znamená? být × bít` · `lýtko, synovec × slíva`

| úloha | co hodnotí | správně | známé chyby |
|---|---|---|---|
| U1 rozcvička (4) | 4 × `dlazdice`: A) „Táta přib_l na zeď nový věšák.“ přibyl · přibil · B) „Na talíři zb_lo jen pár drobků.“ zbylo · zbilo · C) „Ema si musí každý den nab_t mobil.“ nabýt · nabít · D) „Úkoly nesmíš jen tak odb_t.“ odbít · odbýt | přibil, zbylo, nabít, odbýt | jiná → `vs-dvojice-vyznam` |
| U2 nová (5) | `dlazdice_vice` „Vyber všechna slova z rodiny slova mýt.“ myčka · omyl · umývárna · myší · mydlina · smysl · mycí · hmyzí | myčka, umývárna, mydlina, mycí | chybi [myčka, umývárna, mydlina, mycí] → `vs-pribuzne-neuzna`; navíc omyl / myší / smysl / hmyzí → obecná (kód chybí, viz Nejistoty) |
| U3 nová (5) | 10 mezer (pouť): „…všude byl velký pov_k. Z horské dráhy se ozýval v_skot. Lucka z ní slezla trochu v_strašená… Ema dlouho přem_šlela… koupila třp_tivý balonek. Malý bratr vzl_kal… Hudba z amplionu s_lila a hrála veselá p_seň. Když se setmělo, lidí ub_lo a všude sv_tila barevná světla.“ | y, ý, y, ý, y, y, í, í, y, í | m0 i → `vs-v-i-za-y` · m2 i → `vs-predpona-vy-i` · m3 í (přemýšlela) → `vs-pribuzne-neuzna` · m8 i (ubylo) → `vs-dvojice-vyznam` |
| U4 detektiv (5) | „Ráno Tomáš vyběhl z domu bez svačiny a celou cestu klopýtal po zmrzlém chodníku. Ve škole zjistil, že si večer zapomněl **dobýt** mobil. Naštěstí mu Lucka dala půlku rohlíku a zbytek přestávky si povídali.“ k1 klik (21); final „Proč je to slovo špatně?“ Klopýtat je vyjmenované slovo · **Jde o nabíjení, to je od bít** · Po předponě vy- se píše y · Zbytek je z rodiny slova být | k1 [21] · final nabíjení | k1 navic [2, 10, 28, 30, 33] (vyběhl, klopýtal, rohlíku, zbytek, povídali) → `detektiv-jine-slovo`; final jiná → `detektiv-oprava-jine-chyby` |
| U5 kontrolní **týdenní** (6) | k1 `diktat` 4 věty, 24 slov, `max_prehrani` 2, `hodnotit_interpunkci` false, `hodnotit_velikost` false (věty viz Nahrávky); final 12 mezer (u babičky): v_fotil, m_sky, s_čel, l_ně, jaz_čkem, příb_tek, odb_la, bl_skal, nev_šel, vl_dně, p_lně, pl_nul | final y, i, y, í, ý, y, i, ý, y, í, i, y | diktát `chyby_ocekavane` (věta, slovo): (0,0) Myslivec `vs-pribuzne-neuzna` · (0,4) netopýra `vs-p-i-za-y` · (0,6) slepýše `vs-p-i-za-y` · (1,2) zamykala `vs-m-i-za-y` · (1,4) byt `vs-b-i-za-y` · (2,2) polykal `vs-l-i-za-y` · (2,3) syrovou `vs-s-i-za-y` · (3,1) vystoupila `vs-predpona-vy-i` · (3,6) výskala `vs-v-i-za-y`; final m1 y (misky) → `vs-m-y-za-i` · m6 y (odbyla) → `vs-dvojice-vyznam` · m7 í (blýskal) → `vs-l-i-za-y` · m8 i (nevyšel) → `vs-predpona-vy-i` |

`semafor_tydne` (z `final`, 12 mezer): zelená 11–12 (~90 %), oranžová 8–10 (~70 %), červená 0–7.

**Diktát slovo po slově** (OSNOVA §2.2): Myslivec, netopýra, slepýše, zamykala, byt, polykal, syrovou, vystoupila, výskala (T6) · za, soumraku, zahlédl, a, Ema, večer, starý (*rý* Z5), Adam, hladově (*vě* Z5), mrkev (párová Z5), Lucka, na, kopec, radostně (*ně* Z5). Slovesa jen v jednotném čísle minulého času, žádné *s/z*, *mě/mně*, žádná koncovka s *i/y* po obojetné souhlásce. *Honzík* v naostro diktátu není (je v L24), aby se neopakovalo slovo z učební lekce.

---

## Nahrávky (pro AUDIO.md)

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t6/l21n-u3.mp3` | cj-t6-l21n / úloha 3 (`k1`, `k2`, `k3` i `final`) | poslech | První věta: Než odjedeme, musím si dobít mobil. Druhá věta: Rytíři v té hře dlouho nemohli dobýt hrad. Třetí věta: Ve škole nám letos zase přibylo úkolů. Čtvrtá věta: Tomáš chce mít v pokoji klid. | Oznamovací intonace, nic nezdůrazňovat (hlavně ne „dobít“, „dobýt“, „přibylo“, „mít“); mezi větami pauza 1,5 s. Cca 16 s. | čeká na Pavla |
| `t6/l23n-u3.mp3` | cj-t6-l23n / úloha 3 (`k1`, `k2`, `k3` i `final`) | poslech | První věta: Nad lesem se ozvalo houkání výra. Druhá věta: Suché listí se na dvoře točilo ve víru. Třetí věta: Klára vila z pampelišek věnec. Čtvrtá věta: Když houkala siréna, začal pes výt. | Oznamovací intonace, nic nezdůrazňovat; *výra*, *víru*, *výt* s dlouhou samohláskou, *vila* krátce; mezi větami pauza 1,5 s. Cca 16 s. | čeká na Pavla |
| `t6/l24n-d1.mp3` | cj-t6-l24n / úloha 5 (diktát, věta 1) | diktát | Myslivec za soumraku zahlédl netopýra a slepýše. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t6/l24n-d2.mp3` | cj-t6-l24n / úloha 5 (diktát, věta 2) | diktát | Ema večer zamykala starý byt. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t6/l24n-d3.mp3` | cj-t6-l24n / úloha 5 (diktát, věta 3) | diktát | Adam hladově polykal syrovou mrkev. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |
| `t6/l24n-d4.mp3` | cj-t6-l24n / úloha 5 (diktát, věta 4) | diktát | Lucka vystoupila na kopec a radostně výskala. | Dvakrát: poprvé celá věta přirozeně, pauza 2 s, podruhé pomalu po slovech (0,75×, 0,7 s mezi slovy). Interpunkci nevyslovovat; u velkého písmene říct „velké písmeno — …“. | čeká na Pavla |

**Celkem 6 nahrávek** (2 poslechy, 4 věty diktátu). Do `AUDIO.md` je sloučí vedoucí; do té doby validátor hlásí jen „nahrávka nemá řádek v AUDIO.md“ (12 chyb: 4 kroky L21n U3, 4 kroky L23n U3, 4 věty L24n). Velké písmeno v diktátu: *Ema*, *Adam*, *Lucka* (a začátek věty *Myslivec*).

---

## Ověření ÚJČ

Ověřováno 14. 10. 2026 přes `bash nastroje/ujc.sh`. Server byl přetížený (sdílená fronta s dalšími agenty): ze 46 dotazů odpověděl na 30, 16 vypršelo. Podle doplňku vedoucího jsem neověřená slova nahradil slovy, která jsou v cache ÚJČ (stejný jev), dávku jsem zastavil a pak se ptal jen jednou (*víra* — odpověděl).

| tvar / jev | lekce | výsledek v ÚJČ |
|---|---|---|
| řady a rodiny: *byt, bytový, bytost, nábytek, dobytek, příbytek, zbytek, obyčej (obyčejný), bystřina, býček, kobyla; blýskat se (blýskavý, blyštět se), polykat, vzlykat (vzlyk), plynout (plyn, plynárna), plýtvat, lysý (lysina), lýtko, plyš; mýt (mycí, myčka, umývárna, mydlina), myslit (smysl, přemýšlet, myslivec), mýlit se (omyl), hmyz (hmyzí), myš (myší), zamykat, smýkat (smyčka), dmýchat, hlemýžď, chmýří; pysk (pyskatý), netopýr, slepýš, pyl (opylovat), klopýtat (klopýtnout), třpytit se (třpytivý); syn (synovec, synovský), sytý (sytost, nasytit), syrový, usychat, syčet (sykot), sypat (sypký, nasypat); výt (zavýt), výskat (výskot), zvykat (zvyk, zvyknout, obvyklý), žvýkat (žvýkačka), vydra (vydří), povyk (povykovat); jazyk (jazýček, jazykověda), nazývat se; předpona vy-/vý-* | všechny | [id=100](https://prirucka.ujc.cas.cz/?id=100), výčet doslova |
| *dobýt × dobít* (hrad × mobil), *přibýt × přibít*, *zbýt × zbít*, *nabýt × nabít*, *odbýt × odbít* (práci × poledne), *ubýt*, *pobýt × pobít*, *zabít, rozbít* jen s *í* | 21n, 23n, 24n | [id=101](https://prirucka.ujc.cas.cz/?id=101), příklady doslova (*dobít mobil, dobýt hrad, přibyla práce, zbyl kousek koláče, odbýt práci, dvanáctá odbila*) |
| Z5: *tykev, řidič, široký, rybník, rychlý, motýl, cizí, hřiště* | 21n | hesla |
| slova s *i/í* mimo řady: *blízko, slíbit, mísa, lízat, polít (polil), zmizet, pobíhat, klíč, míchat, plíce, mířit, plivat, bicí, pískot, silnice, zírat, vítat, pilný, víčko, sítko, miska, dvířka, píchnout, opice, višňový, pozítří, pivoňka, síť, sílit, pípat, slíva, rozbít, mírný, sirka, slimák, závist, závidět, vichřice, vichr, klidno, zvíře, místo, svítit, vítězit, píseň, rohlík, povídat, líný (líně), vlídný* | 21n–24n | hesla (žádné není v řadě ani v rodině slova z řady) |
| předpona *vy-/vý-*: *výskok* (dělení *vý-skok*), *vyčerpat* (dělení *vy-čer-pat*), *vyfotit, vyprávět, vyhrát, vystoupit, vyjít, vykouknout, vyběhnout, vystrašený, vypít* | 23n, 24n | hesla |
| dvojice: *výr* („největší sova“), *vír*, *víra* (1. p. *víra*, 4. p. *víru*), *vít* (*vil*), *výt* (*vyl*), *bít, být, mít, mýt* | 21n, 23n, 24n | hesla s tabulkou tvarů |
| ostatní hodnocená: *bystrý, bylina, myslit, myslivec, slepýš, syčet, jazykolam, nasypat, hladový, mrkev, radostný, mobil, zabydlet* | 21n–24n | hesla |
| zbytek po zakrytí *chřice* (vichřice) | 23n | „nenalezeno“ — ověřil korektor 4. 10. (`TEMA-6.md`); *čko*, *šňový* zjevně nejsou slova (neověřováno) |

## Nejistoty

- **Nahrazeno, protože ÚJČ neodpověděl** (stejný jev, ověřené slovo z cache): *obilí* → *pobíhala* (21n U5), *plyšový* → *myčku* (21n U2), *bič* → *rozbitá*, *svíčka* → *závist* / *svítil*, *výskok* → *výstaviště*, *vytrhnout* → *vyfotit*, *vyčistit* → *vyčerpat*, *višně* → *višňový*, *vypravit se* → *vystoupit*, *vydržet* → *nevyjít*, *mince* → *mikina*, *vinout* → *vítězit* (23n); *plyšák, zamyšleně, píšťalka, sýrové, rozsvítila, blyštěly* → *výskot, přemýšlela, třpytivý, sílila, píseň, svítila, ubylo*; *nabídla* → *dala*; *vyskočila* → *vystoupila*; *vyklonil, sýkorky, nevypadal, kliku, obyčejně* → *vyfotil, syčel, nevyšel, vlídně, blýskal*; *lilie* → *slíva*; *myška, smývat* → *myší, mydlina* (24n).
- **Jazykový nález:** *smít* příručka nezná (infinitiv je *smět*), dvojice *smýt × smít* proto nejde použít; poslech L21n má na konci *mít × mýt*.
- **Kód u slov z rodiny:** stejně jako v `TEMA-6.md` dávám `vs-pribuzne-neuzna` slovům odvozeným příponou nebo jen z rodiny (*omylem, myčku, nezvykla, nasytil, přemýšlela, bytost, zbytek, myslivec, Myslivec* v diktátu); slovům z řady a jejich tvarům kód podle písmene.
- **Chybějící kód (návrh, opakuji z `TEMA-6.md`):** `vs-pribuzne-navic` — „za příbuzné označí slovo, které jen stejně začíná nebo má y, ale znamená něco jiného“ (L24n U2: *omyl, myší, smysl, hmyzí* k *mýt*; L22n U3 a L23n U2: „ano“ u *pilný, víčko, sítko*, kde dnes stojí `vs-p/v/s-y-za-i` podle důsledku). Otázka: „Co to slovo znamená? Znamená něco podobného, nebo jen stejně začíná?“
- **Opakování z učební lekce:** jen uzavřené dvojice a slova z řady jako odpověď: *mít* (L21n U3 final; v L24 je *mít* správná dlaždice jiné věty) a *bystrý* (odpověď detektiva L21n, v L21 je mezera *b_strý*). Jinak žádné hodnocené slovo, věta ani příklad z L21–L24 (kontrolováno skriptem).
- **Sporné drobnosti k posouzení:** *odbýt úkol* (L24n U1 D) je pro osmáka méně častý význam (ÚJČ id=101: *odbýt práci*), proto je v otázce i typické chybě vysvětlený; *víru* v L23n U3 je zároveň 4. p. slova *víra* — v obou čteních *í*, odpověď je jednoznačná.
- **Validátor/web:** nové nálezy nemám. Validátor dál nekontroluje slovní limity SABLONA §4 (zkontrolováno vlastním skriptem, vše v limitu) a u nahrávek jen přítomnost ID v `AUDIO.md`, ne znění (viz `TEMA-6.md` bod 5).

## Korektura 14. 10. (jazykový korektor)

Ověřeno nezávisle: všechna hodnocená slova (mezery, dlaždice, ano/ne, detektiv, diktát, texty obou nahrávek) proti výkladům ÚJČ [id=100](https://prirucka.ujc.cas.cz/?id=100) a [id=101](https://prirucka.ujc.cas.cz/?id=101) a heslům (tabulky tvarů včetně délky samohlásky); nově dotazem *výskok, vyčerpat, pírko, místo, syčák*, z cache ÚJČ *vír* (6. p. *víru*, SSJČ „v. listí“), *výr* (2. p. *výra*), *víra* (4. p. *víru*), *vít* (příčestí *vil*), *bicí*, *cizí*, *myš*. Vzorové odpovědi a všechny známé chyby znovu přes `vyhodnotKrok` (164 kontrol, 0 chyb), slovní limity SABLONA §4 v pořádku.

**Jazykové chyby (4), opraveno v JSON i výše:**
1. L21n U1 D *c_zí*: mezera měla nabídku í/ý a správně „í“ → vzorová odpověď by byla *cízí*. Správně *cizí* (krátké *i* po *c*): nabídka i/y, správně „i“.
2. L22n U1 D *b_cí*: totéž, vzorově *bící*. Správně *bicí* (ÚJČ heslo *bicí*): nabídka i/y, správně „i“, známá chyba „y“ → `vs-b-y-za-i`.
3. L22n U2 *tř_ptily*: mezera byla mezi *ř* a *p* → vzorová odpověď *třyptily*. Opraveno na *třp_tily*.
4. L23n U1 B *m_ší*: nabídka í/ý, správně „ý“ → vzorově *mýší*. Správně *myší* (krátké *y*): nabídka i/y, správně „y“, známá chyba „i“.

**Další opravy:**
- L21n „Platí“ *rozhodne smysl* prozrazovalo mezeru *sm_sl* v U2 → *rozhodne význam*.
- L23n U2 *výstaviště* → *výskok*: test „zakryj vy-/vý-, zbude slovo?“ dává *staviště*, které dítě jako slovo nezná (běžné je *staveniště*). *Výskok* ÚJČ teď potvrdil (*vý-skok*, zbude *skok*); to bylo původní slovo autora.
- L23n U5 *mikina* (slovo cizího původu, podle OSNOVA §10 jen domácí slova) → *místo*: „…oblékla teplou bundu a našla zv_řata, která se schovávala na suchém m_stě pod kůlnou.“ Mezery 6 a 7 jsou teď *zvířata, místě* (í, í); počet 7 y a 5 i beze změny.
- L22n U2 oranžová: *p_lný* je hodnocené slovo v U3 téže lekce → *p_rko* (pírko, od pero).
- L24n U2 oranžová: *syčák* (ÚJČ: „darebák“, v id=100 u *syčet* není) → *sykot* (id=100).
- „Dnes samo“: L24n U1 otázka D („Tluče se tu do něčeho?“ ukazovala na odpověď) → „Co by znamenalo odb_t s í a co s ý? Které z toho sedí k úkolům?“; L23n U4 otázka 2 („předpony můžou být dvě za sebou“ ukazovala na chybné slovo) → „U každého slova, kde je vi, ví nebo vy, odděl všechno, co jde na začátku oddělit. Co zbude? Je to slovo?“; L23n U4 typická chyba upřesněna („přivítal (čeká ý)“).

**Rozhodnutí vedoucího dodržena:** *odbýt úkol* ponecháno (id=101 „odbýt práci“); *víru* ponecháno, věta „Suché listí se na dvoře točilo ve víru.“ jednoznačně mluví o víru (točí se), otázka 2 taháku i řešení to dítěti říkají; *smít* není nikde; kód `vs-pribuzne-navic` se nepoužívá; *Honzík* v naostro lekcích není.

**Zbývá:** jen řádky šesti nahrávek v `AUDIO.md` (sloučí vedoucí; texty nahrávek výše jsou ověřené a beze změny).

