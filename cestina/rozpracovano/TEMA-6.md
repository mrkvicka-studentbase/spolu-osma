# Téma 6 — Vyjmenovaná slova (Spolu 8, lekce 21–24)

Verze 1.0, 1. 10. 2026. Autor: metodik a autor úloh ČJ Spolu 8. **Pro:** vedoucího projektu (rozpory s osnovou a nálezy na konci), jazykového korektora (oddíl „Ověření ÚJČ“ a „Nejistoty“), autora nahrávek (oddíl „Nahrávky“ — řádky do `AUDIO.md` sloučí vedoucí).
**Podle:** `cestina/Obsah/OSNOVA.md` §10 (téma 6), §2–3, §16, §18; `ZADANI-OSMA.md` §3, §4, §8; `FORMAT-CJ.md` (rozdíl Spolu 8: 5 úloh); `TYPY-CHYB.md`; `obsah/SABLONA.md` §8, §9, §18, §19.
**Lekce (JSON):** `obsah/cestina/lekce/cj-t6-l21.json` … `cj-t6-l24.json` — data v nich jsou přesně podle tohoto rozpisu.

Forma jako `TYDEN-2.md` (Spolu): u každé lekce Cíl, Úvod, Platí, Slovníček a tabulka pěti úloh. Plné texty taháku, semaforu a `tisk.zadani` jsou v JSON; tady je obsah: co úloha měří, data, správné odpovědi, známé chyby a hlavní otázka.

## Společné pro celé téma

- **Lekce:** `faze: "osma"`, `tyden` 6, `poradi` 1–4, `kapitola: "vyjmenovana-slova"`, `cas_min` 25 (U1 4 · U2 5 · U3 5 · U4 5 · U5 6), pomůcky sešit a propiska. Úlohy `rozcvicka, nova, nova, detektiv, kontrolni`, id `cj-t6-l<n>-U1…U5`, poslední krok každé úlohy `final`.
- **Indexy** v `klik_ve_textu` od 0, interpunkce se nepočítá (`tokenizuj` z `vyhodnoceni-cj.js`; tokeny níže jsou vypsané skriptem). V `doplnit_pismeno` je mezera `_`, mezery číslujeme od 0; u každé mezery jsou možnosti `i/y` (k) nebo `í/ý` (d) — délku nikdy neměříme, dítě rozhoduje jen o i/y. Známé chyby doplňovačky jsou po **jedné mezeře** (`hodnota` s `null` všude jinde), nejvýš 4 na krok (schéma); ostatní mezery = obecná chyba.
- **Hranice tématu (OSNOVA §10, §2.2):** hodnotí se jen *i/í/y/ý* v kořeni a předpona *vy-/vý-*. Žádná mezera není v koncovce (koncovky v mezerách nejsou; kde je koncovka s *i/y* po obojetné souhlásce, je vytištěná: *bystrý, milý, vysokých*). Po *f* nic, žádná přejatá slova (proto ne *minuta, limonáda*), jen frekventovaná slova.
- **Pravidlo pro kódy `vs-`** (převzato z rozpisu Spolu „TYDEN-6“ a z příkladu v `TYPY-CHYB.md`):
  - slovo z řady, jeho tvar nebo slovo s předponou (*bydlí, mlýna, umyla, nasypal*) → `vs-<písmeno>-i-za-y`;
  - slovo z rodiny odvozené příponou (*lyžař, myšlenka, pytlík, sychravo, výška*) a *obyvatel* (TYPY-CHYB ho má jako příklad: „*obyvatel* → i“) → `vs-pribuzne-neuzna`;
  - slovo mimo řady, kde dítě napíše y (*bílý, síla, vítr, vidět, Honzík*) → `vs-<písmeno>-y-za-i`;
  - *vi-* místo předpony *vy-* → `vs-predpona-vy-i`; záměna slov, která zní stejně (*být/bít, mýt/mít, výr/vír, výt/vít*) → `vs-dvojice-vyznam`;
  - detektiv: klik na správné slovo → `detektiv-jine-slovo`, špatný důvod v `final` → `detektiv-oprava-jine-chyby`.
- **Jména:** Tomáš, Lucka, Klára, Adam, Ema, Honzík (jen v L24 U5 jako mezera *Honz_kem* — T6 je jediné téma, kde smí, ZADANI-OSMA §8 bod 11); detektiv Petr, nikdy v 5. pádě. Oslovení nepoužívám.
- **Dlaždice:** správná odpověď střídá pozice; ano/ne = dvě dlaždice. Poslechové kroky mají `max_prehrani: 0` (bez omezení, jako vzor Spolu L2), diktát `max_prehrani: 2`, `hodnotit_interpunkci: false`, `hodnotit_velikost: false`.
- **Texty pro dítě:** tykání bez rodu; otázky taháku jsou zároveň nápovědy v režimu „Dnes samo“ — nikdy neobsahují správně napsané hodnocené slovo (místo něj tvar s `_`, např. „Vezmi slovo l_žař“).

## Cíl tématu

Dítě doplní *i/y* po *b, l, m, p, s, v, z* v kořeni slova jedním postupem: **Je slovo v řadě? Je z rodiny slova z řady? Je na začátku předpona *vy-/vý-*? → y. Jinak → i.** Podle smyslu věty rozliší *být × bít, mýt × mít, výr × vír, výt × vít*. Na konci tématu to ukáže v diktátu a v textu.

---

## LEKCE 21 — Po B, L, M (`cj-t6-l21`) · poslech U3

`tema`: „Vyjmenovaná slova po B, L, M“ · `kapitola`: `vyjmenovana-slova` · `tyden` 6, `poradi` 1.

**Cíl:** Dítě doplní i/y po b, l, m podle toho, jestli jde o vyjmenované slovo nebo slovo z jeho rodiny, a podle smyslu věty rozliší být × bít a mýt × mít.

**Úvod pro rodiče:** Dnes dítě opakuje, kdy se po b, l, m píše y: jen ve vyjmenovaných slovech a ve slovech z jejich rodiny (bydlet – bydliště), jinak i.

**Platí:**
1. `Y jen ve vyjmenovaných a příbuzných` — co to je (35 znaků)
2. `Příbuzné = stejný kořen (bydlet)` — test (32)
3. `být = existovat · bít = tlouct` — příklad (30)

**Slovníček pro rodiče:** *vyjmenovaná slova* (řady slov s y po b, l, m, p, s, v, z; y i v jejich rodině) · *řada po b / l / m* (výčet podle ÚJČ id=100, školní rozsah) · *příbuzné slovo* (stejný základ a podobný význam: lyže – lyžař, bydlet – bydliště – obyvatel) · *kořen* (lyž- v lyže, lyžař, lyžovat) · *být × bít* · *mýt × mít*.

| # · typ (min) | Zadání · co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| 1 rozcvička (4) | „Doplň i, nebo y.“ A) … D). *Měří:* Z5 tvrdé × měkké souhlásky (ledoborec, téma na něm stojí; OSNOVA §2.3). | 4 kroky `doplnit_pismeno` po 1 mezeře (i/y), popisky „Řada A“ … „Řada D“: **A** ch_trý · **B** ž_dle · **C** r_ba · **D** c_bule | A y · B i · C y · D i | obecná (podle osnovy) | Po řadách: A „Je ch tvrdá, nebo měkká souhláska? Co se po ní píše?“ · B a D „Jsou ž a c tvrdé, nebo měkké…?“ · C „Řekni nahlas tvrdé souhlásky: h, ch, k… Která ještě patří mezi ně?“ |
| 2 nová (5) | „Doplň i, nebo y.“ *Měří:* B, L, M — slovo z řady, z rodiny, mimo řady. | `doplnit_pismeno`, text: **Ob_vatelé našeho města mají nový zimní stadion. Tomáš je dobrý l_žař. Lucka měla skvělou m_šlenku. Na louce rostou b_liny a b_lé kopretiny. Ml_n u řeky je starý. M_lá paní nám vrátila m_č.** — mezery: 0 Ob_vatelé (k) · 1 l_žař (k) · 2 m_šlenku (k) · 3 b_liny (k) · 4 b_lé (d) · 5 Ml_n (d) · 6 M_lá (k) · 7 m_č (d) | [y, y, y, y, í, ý, i, í] | m1 i → `vs-pribuzne-neuzna` (lyžař) · m3 i → `vs-b-i-za-y` (byliny) · m5 í → `vs-l-i-za-y` (mlýn) · m6 y → `vs-m-y-za-i` (milá); ostatní obecná (zmíněné v taháku) | „Vezmi slovo l_žař. Je v řadě po l? A je v ní slovo, které znamená něco podobného?“ Typická chyba: *ližař, mišlenku* („v řadě není“) → „Od kterého slova je to utvořené?“; *býlé, mylá, mýč* → „Je to slovo v řadě? Řekni ji nahlas.“ |
| 3 nová, **poslech** (5) | „Poslechni si nahrávku. Má tři věty. U každé vyber slovo, které v ní zaznělo.“ *Měří:* dvojice podle smyslu (zní stejně, rozhoduje význam). | 3 kroky `poslech`, stejná nahrávka `audio/cestina/t6/l21-u3.mp3`, přepis: „První věta: Hodiny na věži začaly bít poledne. Druhá věta: Chtěl bych být brankářem. Třetí věta: Každou sobotu pomáhám tátovi mýt auto.“ Popisky „První věta“, „Druhá věta“, „Třetí věta“; vnořené dlaždice: **k1** být · bít · **k2** být · bít · **final** mýt · mít | k1 bít · k2 být · final mýt | jiná dlaždice → `vs-dvojice-vyznam` (všechny kroky) | „Slova v nabídce zní stejně. Podle čeho poznáš, které z nich se píše s y?“ Typická chyba: v 1. větě *být* → „Co dělají hodiny? Tlučou, nebo jen jsou?“; ve 3. *mít* → „Bude auto vlastnit, nebo ho umývat?“ |
| 4 detektiv (5) | „Petr měl doplnit i, nebo y. Napsal: … Udělal **jednu** chybu. Najdi ji.“ *Měří:* `vs-pribuzne-neuzna` (obyvatel ← bydlet). | **k1** `klik_ve_textu`, max 1: Obivatelé(0) vesnice(1) se(2) sešli(3) u(4) mlýna(5) Lucka(6) tam(7) nasbírala(8) byliny(9) · **final** dlaždice „Ke kterému vyjmenovanému slovu to patří?“: bít · **bydlet** · obyčej · bylina (nabídka má údaje i k *byliny*, nejen k chybnému slovu) | k1 [0] · final bydlet | k1 navic [5, 8, 9] → `detektiv-jine-slovo` · final jiná → `detektiv-oprava-jine-chyby` | „U každého slova s b, l, m se zeptej: je v řadě, nebo z rodiny slova z řady?“ Typická chyba: klik na *nasbírala* („po b je y“) → „Je sbírat v řadě po b?“ (Není, Petr to má dobře.) |
| 5 kontrolní (6) | „Doplň i, nebo y.“ *Měří:* B, L, M v souvislém textu. | `doplnit_pismeno`, text: **Klára b_dlí v domě u starého ml_na. V zimě jezdí s Tomášem na l_že a v létě sbírá na louce b_liny. Tomáš je b_strý kluk a rád m_slí na nové hry. Ráno sl_ší, jak na dvoře kokrhá kohout. Moc se mu tam l_bí. Klářin m_lý pejsek má b_lou srst.** — mezery: 0 b_dlí (k) · 1 ml_na (d) · 2 l_že (k) · 3 b_liny (k) · 4 b_strý (k) · 5 m_slí (k) · 6 sl_ší (k) · 7 l_bí (d) · 8 m_lý (k) · 9 b_lou (d) | [y, ý, y, y, y, y, y, í, i, í] | m0 i → `vs-b-i-za-y` · m1 í → `vs-l-i-za-y` · m7 ý → `vs-l-y-za-i` · m8 y → `vs-m-y-za-i` | R55. Typická chyba: *lýbí, mylý, býlou* → „Je to slovo v řadě? Řekni ji.“; *bidlí, mlína* → „Řekni řadu po b (po l).“ |

**Kontrola pro vás (kontrolní):** bydlí, mlýna, lyže, byliny, bystrý, myslí, slyší (y: slova z řad), líbí, milý, bílou (i: v řadách nejsou).

---

## LEKCE 22 — Po P, S, V, Z (`cj-t6-l22`)

`tema`: „Vyjmenovaná slova po P, S, V, Z“ · `tyden` 6, `poradi` 2.

**Cíl:** Dítě doplní i/y po p, s, v, z ve vyjmenovaných slovech a ve slovech z jejich rodiny (výška ← vysoký, pytlík ← pytel) a odliší je od slov s i (zima, síla, vítr).

**Úvod pro rodiče:** Dnes stejný postup jako minule, jen po p, s, v, z: y patří jen do vyjmenovaných slov a do jejich rodiny, ostatní slova mají i.

**Platí:**
1. `Po P, S, V, Z stejné pravidlo` — co to je (29)
2. `Najdi příbuzné: výška ← vysoký` — test (30)
3. `brzy, jazyk × zima, zítra` — příklad (25)

**Slovníček:** *vyjmenovaná slova*, *řada po p / s / v / z* (u v poznámka „předpona vy- přijde v další lekci“), *příbuzné slovo*, řady po b, l, m (z L21, kvůli rozcvičce).

| # · typ (min) | Zadání · co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| 1 rozcvička (4) | „Doplň i, nebo y. V řadě C vybíráš í, nebo ý.“ *Měří:* L21 — řada, rodina, mimo řady. | 4 kroky `doplnit_pismeno` po 1 mezeře: **A** ob_čej (k) · **B** l_stí (k) · **C** m_dlo (d) · **D** b_tva (k) | A y · B i · C ý · D i | A i → `vs-b-i-za-y` · B y → `vs-l-y-za-i` · C í → `vs-pribuzne-neuzna` (mýdlo ← mýt) · D y → `vs-b-y-za-i` (bitva ← bít) | Po řadách: A „Řekni řadu po b. Je v ní to slovo?“ · B a D „Od kterého slova je to utvořené? Je to slovo v řadě?“ · C „K čemu se ta věc používá? Které slovo z řady po m znamená něco podobného?“ |
| 2 nová (5) | „Doplň i, nebo y.“ *Měří:* P, S, V, Z — polovina slov v řadách, polovina mimo. | `doplnit_pismeno`, text: **Táta nese do sklepa p_tel brambor. Na pláži je jemný p_sek. Lucka má ráda s_r. Adam má velkou s_lu. Ve v_sokých horách fouká studený v_tr. Ema si spálila jaz_k. Venku je z_ma.** — mezery: 0 p_tel (k) · 1 p_sek (d) · 2 s_r (d) · 3 s_lu (d) · 4 v_sokých (k) · 5 v_tr (d) · 6 jaz_k (k) · 7 z_ma (k) | [y, í, ý, í, y, í, y, i] | m0 i → `vs-p-i-za-y` · m3 ý → `vs-s-y-za-i` · m5 ý → `vs-v-y-za-i` · m6 i → `vs-z-i-za-y` | „Vezmi slovo p_sek. Řekni řadu po p. Je v ní? Je v ní slovo s podobným významem?“ Typická chyba: *pýsek, sýlu, výtr, zyma* → „Je to slovo v řadě? Řekni ji nahlas.“ |
| 3 nová (5) | „Patří slovo do rodiny některého vyjmenovaného slova? Odpověz ano, nebo ne.“ *Měří:* příbuzné × jen podobně znějící (OSNOVA: 4 kroky ano/ne). | 4 kroky `dlazdice` ano · ne; popisky se slovem s mezerou (aby pravopis neprozradil odpověď): **k1** „A) s_chravo“ · **k2** „B) s_lák“ · **k3** „C) v_ška“ · **final** „D) z_vat“ | ano · ne · ano · ne | k1 ne → `vs-pribuzne-neuzna` · k2 ano → `vs-s-y-za-i` · k3 ne → `vs-pribuzne-neuzna` · final ano → `vs-z-y-za-i` | „Co to slovo znamená? Najdi v řadě po s nebo po v slovo s podobným významem.“ Typická chyba: *výška* → ne („začíná jinak“) → „Co to slovo znamená? Které slovo z řady znamená něco podobného?“ (vysoký) |
| 4 detektiv (5) | „Petr měl doplnit i, nebo y. Napsal: … Udělal **jednu** chybu.“ *Měří:* `vs-p-i-za-y` v jiném tvaru slova (do pytle). | **k1** `klik_ve_textu`, max 1: Táta(0) brzy(1) ráno(2) nasypal(3) brambory(4) do(5) pitle(6) · **final** dlaždice „Ke kterému vyjmenovanému slovu patří?“: pít · sypat · **pytel** · brzy (údaje ke všem slovům s i/y) | k1 [6] · final pytel | k1 navic [1, 3] → `detektiv-jine-slovo` · final jiná → `detektiv-oprava-jine-chyby` | „Řekni chybné slovo tak, aby před něj šlo říct ten. Které slovo z nabídky to je?“ Typická chyba: v kroku 2 *pít* („pitle jako pít“) → „Pije se do pytle?“ |
| 5 kontrolní (6) | „Doplň i, nebo y.“ *Měří:* P, S, V, Z v textu. | `doplnit_pismeno`, text: **Bylo s_chravo a foukal silný v_tr. Tomáš vstal brz_ a šel s Luckou do lesa. Svačinu si nesli v p_tlíku. Na pasece v_děli s_sla a v_soko nad lesem kroužil dravec. V p_sku našli stopu ještěrky. Doma si dali rohlíky se s_rem a p_li čaj.** — mezery: 0 s_chravo (k) · 1 v_tr (d) · 2 brz_ (k) · 3 p_tlíku (k) · 4 v_děli (k) · 5 s_sla (k) · 6 v_soko (k) · 7 p_sku (d) · 8 s_rem (d) · 9 p_li (k) | [y, í, y, y, i, y, y, í, ý, i] | m2 i → `vs-z-i-za-y` · m3 i → `vs-pribuzne-neuzna` · m4 y → `vs-v-y-za-i` · m5 i → `vs-s-i-za-y` | R55. Typická chyba: *pitlíku* → „Co je pytlík? Od kterého slova je?“; *vyděli, výtr, pýsku* → „Je to slovo v řadě?“ |

**Kontrola pro vás (kontrolní):** sychravo, brzy, pytlíku, sysla, vysoko, sýrem (y); vítr, viděli, písku, pili (i).

---

## LEKCE 23 — Předpona vy-/vý- a dvojice podle významu (`cj-t6-l23`) · poslech U3

`tema`: „Předpona vy-/vý- a dvojice slov“ · `tyden` 6, `poradi` 3. (Osnova má v názvu „dvojice podle významu“; `tema` je kratší, protože se opakuje v každé červené.)

**Cíl:** Dítě pozná předponu vy-/vý- (vy-běhnout, vý-let), odliší ji od vi-/ví- na začátku slova bez předpony (vidět, vítr) a podle smyslu věty rozliší výr × vír a vyl × vil.

**Úvod pro rodiče:** Dnes dítě opakuje předponu vy-/vý-: když jde na začátku slova oddělit a zbytek je pořád slovo (vy-hrát), píše se y; a rozlišuje slova, která zní stejně (výr × vír).

**Platí:**
1. `Předpona vy-/vý- → vždy y` — co to je (25)
2. `vy-běhnout × vidět (bez předpony)` — test (33)
3. `výr = pták · vír = voda` — příklad (23)

**Slovníček:** *vyjmenovaná slova*, *předpona*, *předpona vy-/vý-*, *výr × vír*, *vyl × vil*, *příbuzné slovo*, všech sedm řad.

| # · typ (min) | Zadání · co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| 1 rozcvička (4) | „Doplň i, nebo y. V řadách B, C a D vybíráš í, nebo ý.“ *Měří:* L21–L22. | 4 kroky `doplnit_pismeno`: **A** hm_z (k) · **B** p_smeno (d) · **C** s_kora (d) · **D** z_tra (d) | A y · B í · C ý · D í | A i → `vs-m-i-za-y` · B ý → `vs-p-y-za-i` · C í → `vs-s-i-za-y` · D ý → `vs-z-y-za-i` | Po řadách: A „Řekni řadu po m. Je v ní slovo, které tu vidíš?“ · B a D „Řekni řadu po p (po z)…“ · C „Řekni řadu po s pomalu, slovo po slově. Je v ní to slovo?“ |
| 2 nová (5) | „Jde na začátku slova oddělit vy-, nebo vý- tak, že zbude slovo? Odpověz ano, nebo ne.“ *Měří:* předpona × kořen. | 4 kroky `dlazdice` ano · ne; popisky se slovem s mezerou: **k1** „A) v_let“ · **k2** „B) v_dle“ · **k3** „C) v_hrát“ · **final** „D) v_těz“ | ano · ne · ano · ne | k1, k3 ne → `vs-predpona-vy-i` · k2, final ano → `vs-v-y-za-i` | „Zakryj prstem první dvě písmena slova. Co zbude? Je to slovo, které dává smysl?“ Typická chyba: *vidle, vítěz* → ano („začíná jako vy-“) → „Je to, co zbude, slovo?“ |
| 3 nová, **poslech** (5) | „Poslechni si nahrávku. Má tři věty. U každé vyber slovo, které v ní zaznělo.“ *Měří:* dvojice podle smyslu. | 3 kroky `poslech`, nahrávka `audio/cestina/t6/l23-u3.mp3`, přepis: „První věta: V lese houká výr. Druhá věta: Ve vodě se točil vír. Třetí věta: Pes celou noc vyl.“ Dlaždice: **k1** vír · výr · **k2** výr · vír · **final** vil · vyl | k1 výr · k2 vír · final vyl | jiná dlaždice → `vs-dvojice-vyznam` | „Kde se to v té větě děje? Je to pták, nebo voda, která se točí?“ Typická chyba: výr a vír obráceně → „Je to pták, nebo točící se voda?“; *vil* → „Pes vyje, nebo plete věnec?“ |
| 4 detektiv (5) | „Petr měl doplnit i, nebo y. Napsal: … Udělal **jednu** chybu.“ *Měří:* `vs-predpona-vy-i`. | **k1** `klik_ve_textu`, max 1: Náš(0) tým(1) vihrál(2) turnaj(3) Vítězný(4) gól(5) vystřelil(6) Adam(7) · **final** dlaždice „Proč se v něm píše y?“: Je to vyjmenované slovo · **Na začátku je předpona vy-** · Je příbuzné se slovem vítěz (předponu má i *vystřelil*, nabídka chybné slovo neprozradí) | k1 [2] · final předpona | k1 navic [1, 4, 6] → `detektiv-jine-slovo` · final jiná → `detektiv-oprava-jine-chyby` | „U slov, která začínají na v, zakryj první dvě písmena. Kde zbude slovo?“ Typická chyba: klik na *Vítězný* → „Zakryj ví-. Zbude slovo?“ (Nezbude, Petr to má dobře.) |
| 5 kontrolní (6) | „Doplň i, nebo y.“ *Měří:* vše L21–L23. | `doplnit_pismeno`, text: **V sobotu jsme v_razili na v_let do hor. Cestou jsme v_děli v_sokou skálu a Tomáš na ni v_lezl. U potoka si Lucka um_la ruce. Večer jsme u ohně sl_šeli, jak v dálce v_je vlk. V noci foukal silný v_tr a déšť b_l do stanu.** — mezery: 0 v_razili (k) · 1 v_let (d) · 2 v_děli (k) · 3 v_sokou (k) · 4 v_lezl (k) · 5 um_la (k) · 6 sl_šeli (k) · 7 v_je (k) · 8 v_tr (d) · 9 b_l (k) | [y, ý, i, y, y, y, y, y, í, i] | m0 i → `vs-predpona-vy-i` · m2 y → `vs-v-y-za-i` · m5 i → `vs-m-i-za-y` · m9 y → `vs-dvojice-vyznam` | R55. Typická chyba: *virazili, vilezl* → „Zakryj vy-. Zbude slovo?“; *byl do stanu* → „Déšť do stanu tloukl, nebo jen byl?“ |

**Kontrola pro vás (kontrolní):** vyrazili, výlet, vylezl (předpona), vysokou, umyla, slyšeli, vyje (řady), viděli, vítr, bil (i).

---

## LEKCE 24 — Kontrola tématu: vyjmenovaná slova · diktát (`cj-t6-l24`)

`tema`: „Kontrola: vyjmenovaná slova“ · `tyden` 6, `poradi` 4 · U5 `tydenni: true` + `semafor_tydne`.

**Cíl:** Dítě v diktátu a v textu napíše i/y po b, l, m, p, s, v, z v kořeni slova a u každého řekne, jestli je slovo vyjmenované, z rodiny vyjmenovaného slova, nebo má předponu vy-.

**Úvod pro rodiče:** Dnes se nic nového neučí: dítě ukáže, že samo zvládne celé téma vyjmenovaná slova, a napíše krátký diktát z nahrávky.

**Platí:**
1. `Vyjmenované nebo příbuzné → y` — co to je (29)
2. `vy-/vý- předpona → y` — test (20)
3. `bydlí, mlýn, sýkora × zima` — příklad (26)

**Slovníček:** *vyjmenovaná slova*, *příbuzné slovo*, *předpona vy-/vý-*, *dvojice podle významu*, *diktát*, všech sedm řad.

| # · typ (min) | Zadání · co měří | Vstup a data | Správně | Známé chyby | Hlavní otázka / typická chyba |
|---|---|---|---|---|---|
| 1 rozcvička (4) | „Které slovo patří do věty? V každé řadě vyber jedno.“ *Měří:* dvojice podle významu (L21, L23). | 4 kroky `dlazdice`, popisky „Řada A“ …; věty v zadání: **A** „Večer musím m_t nádobí.“ mýt · mít · **B** „Zítra budeme m_t test.“ mýt · mít · **C** „Po závodě mi srdce rychle b_lo.“ bylo · bilo · **D** „Babička umí v_t věnce.“ vít · výt | A mýt · B mít · C bilo · D vít | jiná dlaždice → `vs-dvojice-vyznam` | Po řadách: A a B „Bude se něco umývat, nebo to někdo bude mít?“ · C „Co srdce dělalo? Řekni to jiným slovem…“ · D „Co babička s věnci dělá? … porovnej se slovem výt z řady po v.“ |
| 2 nová (5) | „Vyber všechna slova z rodiny slova bydlet.“ *Měří:* rodina slov podle významu, ne podle začátku. | `dlazdice_vice`, možnosti: **obyčej · bydliště · bystrý · obyvatel · bylina · obydlí** | [bydliště, obyvatel, obydlí] | chybi [bydliště, obyvatel, obydlí] → `vs-pribuzne-neuzna`; navíc obyčej / bylina / bystrý → obecná (kód chybí, návrh v Poznámkách) | „Vezmi slovo obyčej. Co znamená? Má něco společného s bydlením?“ Typická chyba: navíc *obyčej, bylina, bystrý* („začínají stejně“) → „Mluví to slovo o bydlení?“ |
| 3 nová (5) | „Doplň i, nebo y.“ *Měří:* celé téma v textu. | `doplnit_pismeno`, text: **Tomáš a Ema b_dlí na stejném s_dlišti. Ráno jdou spolu brz_ do školy. Cestou míjejí starý ml_n a v_sokou věž. Dnes Ema v_táhla z batohu p_tlík rozinek. Venku už je z_ma.** — mezery: 0 b_dlí (k) · 1 s_dlišti (d) · 2 brz_ (k) · 3 ml_n (d) · 4 v_sokou (k) · 5 v_táhla (k) · 6 p_tlík (k) · 7 z_ma (k) | [y, í, y, ý, y, y, y, i] | m0 i → `vs-b-i-za-y` · m1 ý → `vs-s-y-za-i` · m5 i → `vs-predpona-vy-i` · m6 i → `vs-pribuzne-neuzna` | „Vezmi slovo s_dlišti. Je v řadě po s? Je z rodiny nějakého slova z řady?“ Typická chyba: *sýdlišti* („tam se bydlí“) → „Má stejný základ jako bydlet?“ |
| 4 detektiv (5) | „Petr měl doplnit i, nebo y. Napsal: … Udělal **jednu** chybu.“ *Měří:* `vs-dvojice-vyznam`. | **k1** `klik_ve_textu`, max 1: V(0) noci(1) na(2) stromě(3) houkal(4) vír(5) a(6) pod(7) ním(8) běžela(9) myš(10) · **final** dlaždice „Proč je to slovo špatně?“: Myš není vyjmenované slovo · **Pták je výr, vír je točící se voda** · Po v se píše vždy y (nabídka mluví i o *myš*) | k1 [5] · final druhá | k1 navic [10] → `detektiv-jine-slovo` · final jiná → `detektiv-oprava-jine-chyby` | „Co asi houkalo na stromě? Je to slovo v řadě po v?“ Typická chyba: klik na *myš* → „Je myš v řadě po m?“ (Je, Petr to má dobře.) |
| 5 kontrolní **týdenní** (6) | „Nejdřív diktát: poslechni si každou větu a napiš ji. Potom doplň i, nebo y do textu.“ *Měří:* celé téma; semafor jen z `final`. | **k1** `diktat`, 4 věty, 17 slov (níže), `max_prehrani: 2`, bez interpunkce a velikosti · **final** `doplnit_pismeno`, text: **O prázdninách Klára b_dlela u babičky na vesnici. Každé ráno v_běhla na dvůr a krmila kob_lu. Odpoledne chodila s Honz_kem k rybníku. Jednou tam v_děli v_dru. Večer pomáhala m_t nádobí a sl_šela, jak v lese houká v_r. Moc se jí tam l_bilo.** — mezery: 0 b_dlela (k) · 1 v_běhla (k) · 2 kob_lu (k) · 3 Honz_kem (d) · 4 v_děli (k) · 5 v_dru (k) · 6 m_t (d) · 7 sl_šela (k) · 8 v_r (d) · 9 l_bilo (d) | k1 `spravne: null` · final [y, y, y, í, i, y, ý, y, ý, í] | k1 `chyby_ocekavane` (níže) · final: m0 i → `vs-b-i-za-y` · m1 i → `vs-predpona-vy-i` · m4 y → `vs-v-y-za-i` · m6 í → `vs-dvojice-vyznam` | R55. `semafor_tydne`: zelená 9–10 z 10 (`min_spravne` 9), oranžová 7–8 (7), červená 0–6 (0). Typická chyba: *mít nádobí* → „Co Klára dělala s nádobím?“; *vyděli* → „Zakryj první dvě písmena. Zbude slovo?“ |

**Diktát (L24 U5 `k1`):** každé slovo je jev T6 nebo jen Z5 (OSNOVA §2.2). Slovesa jen v přítomném čase nebo v jednotném čísle minulého času, bez předložek *s, z*, bez *mě/mně*, bez koncovek s *i/y* po obojetné souhlásce (*vesnice* a *ruce* mají *-e*, *sýkoru* a *mlýna* *-u/-a*).

| věta | audio | text | tokeny | `chyby_ocekavane` (věta, slovo → kód) |
|---|---|---|---|---|
| 0 | `audio/cestina/t6/l24-d1.mp3` | Obyvatelé vesnice bydlí u mlýna. | Obyvatelé(0) vesnice(1) bydlí(2) u(3) mlýna(4) | (0,0) `vs-pribuzne-neuzna` · (0,2) `vs-b-i-za-y` · (0,4) `vs-l-i-za-y` |
| 1 | `audio/cestina/t6/l24-d2.mp3` | Brzy ráno slyšíme sýkoru. | Brzy(0) ráno(1) slyšíme(2) sýkoru(3) | (1,0) `vs-z-i-za-y` · (1,2) `vs-l-i-za-y` · (1,3) `vs-s-i-za-y` |
| 2 | `audio/cestina/t6/l24-d3.mp3` | Vlk v lese vyl. | Vlk(0) v(1) lese(2) vyl(3) | (2,3) `vs-dvojice-vyznam` (*vil*) |
| 3 | `audio/cestina/t6/l24-d4.mp3` | Tomáš si umyl ruce. | Tomáš(0) si(1) umyl(2) ruce(3) | (3,2) `vs-m-i-za-y` |

Kódy holé (ZADANI-OSMA §8 bod 6), aplikace skládá `diktat-pravopis-<kód>`. Jiné slovo bez jevu → `diktat-jine-slovo`.

**Kontrola pro vás (kontrolní, krok 2):** bydlela, vyběhla, kobylu, vydru, slyšela (y), mýt, výr (ý), Honzíkem, líbilo (í), viděli (i).

---

## Nahrávky (pro AUDIO.md)

Formát tabulky `AUDIO.md`. Poslech ≤ 20 s (odhad při tempu 0,9 a pauzách 1,5 s). Diktát podle `AUDIO.md`: každá věta dvakrát (celá, pauza 2 s, pomalu po slovech 0,75× s pauzou 0,7 s), interpunkce se neříká.

| ID souboru | Lekce / krok | Typ | Přesné znění | Poznámka | Stav |
|---|---|---|---|---|---|
| `t6/l21-u3.mp3` | 21 / úloha 3, kroky k1, k2, final | poslech | První věta: Hodiny na věži začaly bít poledne. Druhá věta: Chtěl bych být brankářem. Třetí věta: Každou sobotu pomáhám tátovi mýt auto. | nezdůrazňovat „bít“, „být“, „mýt“; mezi větami pauza 1,5 s; cca 13 s | čeká |
| `t6/l23-u3.mp3` | 23 / úloha 3, kroky k1, k2, final | poslech | První věta: V lese houká výr. Druhá věta: Ve vodě se točil vír. Třetí věta: Pes celou noc vyl. | *výr* a *vír* stejně dlouze (obě dlouhé), nic nezdůrazňovat; mezi větami pauza 1,5 s; cca 10 s | čeká |
| `t6/l24-d1.mp3` | 24 / úloha 5, `k1`, věta 1 | diktát | Obyvatelé vesnice bydlí u mlýna. | dvakrát (celá, pauza 2 s, po slovech 0,75× s pauzou 0,7 s); interpunkce se neříká; *mlýna* s dlouhým ý | čeká |
| `t6/l24-d2.mp3` | 24 / úloha 5, `k1`, věta 2 | diktát | Brzy ráno slyšíme sýkoru. | jako d1; *sýkoru* s dlouhým ý | čeká |
| `t6/l24-d3.mp3` | 24 / úloha 5, `k1`, věta 3 | diktát | Vlk v lese vyl. | jako d1; „v lese“ spojitě, nepolykat *v* | čeká |
| `t6/l24-d4.mp3` | 24 / úloha 5, `k1`, věta 4 | diktát | Tomáš si umyl ruce. | jako d1; před jménem hlásit „velké písmeno — Tomáš“ (AUDIO.md, ZADANI-OSMA §8 bod 7) | čeká |

Celkem **6 nahrávek** (2 poslechy, 4 věty diktátu). **Pozor při slučování:** `AUDIO.md` v tomto repozitáři má z produktu Spolu (Čeština: základy) staré řádky `t6/l21-u4.mp3`, `t6/l24-u4.mp3` a `t6/l24-d1.mp3` … `t6/l24-d4.mp3` s **jiným zněním** (např. d1 „Na louce u mlýna se pase kobyla.“). Řádky `t6/l24-d1…d4` je třeba **nahradit** těmi výše, řádky `t6/l21-u4`, `t6/l24-u4` smazat (Spolu 8 je nepoužívá). Validátor kontroluje jen to, že ID v `AUDIO.md` je, ne znění — proto u diktátu chybu nehlásí.

## Ověření ÚJČ

Všechna hodnocená slova (mezery, dlaždice, diktát, slova v otázkách „Kontrola pro vás“) jsem ověřil v Internetové jazykové příručce přes `bash nastroje/ujc.sh` (1.–2. 10. 2026). Tvary v mezerách jsou ověřené v tabulce tvarů hesla (pád, osoba, minulý čas); řady a jejich rozsah podle výkladu id=100.

**Výklady:** [id=100 Vyjmenovaná slova](https://prirucka.ujc.cas.cz/?id=100) (řady, rodiny slov: *bydlit i bydlet, bydliště, obydlí, obyvatel* u *být*; *mýdlo, umýt* u *mýt*; *myšlenka, přemýšlet* u *myslit*; *pytlák* u *pytel*; *výška* u *vysoký*; *výr (tj. pták)*; *výt*; předpona *vy-/vý-*; *brzy, jazyk, nazývat (se)*) · [id=101 Předponová slovesa odvozená od být – bít](https://prirucka.ujc.cas.cz/?id=101) (*bít* = tlouct, *odbít poledne*).

**Hesla (tvary):** OVERENI_HESLA

## Nejistoty

NEJISTOTY

## Poznámky pro vedoucího

1. **AUDIO.md:** 6 řádků výše; staré řádky Spolu `t6/l24-d1…d4` (jiné znění!) nahradit, `t6/l21-u4`, `t6/l24-u4` smazat. Validátor do té doby hlásí jen „nahrávka t6/l21-u3.mp3 / t6/l23-u3.mp3 nemá řádek v AUDIO.md“ (3× v L21, 3× v L23) — jiné chyby nejsou.
2. **Chybějící kód (návrh):** `vs-pribuzne-navic` — „za příbuzné označí slovo, které jen stejně začíná nebo má y, ale znamená něco jiného“ · příklad *obyčej, bylina* k *bydlet* · lekce 22, 24 · otázka „Co to slovo znamená? Znamená něco podobného, nebo jen stejně začíná?“ Dnes v L24 U2 obecná chyba; v L22 U3 jsem místo něj použil `vs-s-y-za-i` / `vs-z-y-za-i` (dítě by napsalo y), což sedí na důsledek, ne na příčinu.
3. **`vs-pribuzne-neuzna` u *obyvatel*:** *obyvatel* je ve školní řadě po b i v rodině *bydlet* (ÚJČ id=100 ho uvádí u *být*). Řídím se příkladem v `TYPY-CHYB.md` („*obyvatel* → i“) a osnovou (L21 U4), proto v diktátu (0,0) `vs-pribuzne-neuzna`. Kdyby vedoucí chtěl *obyvatel* jako slovo z řady, změní se jen tento jeden kód v L24 U5.
4. **Odchylky od osnovy (jev zachován, data upravena):**
   - L21 U3: 3. věta poslechu „Každou sobotu pomáhám tátovi mýt auto.“ místo „Po tréninku si musím umýt ruce.“ — nabídka *mýt × mít* by u slova *umýt* nebyla přesná (*umít* není slovo).
   - L21 U4: Petrův text má dvě věty a další slova s b, l (*mlýna, nasbírala, byliny*), aby `k1` mělo z čeho vybírat; osnova měla „Obivatelé vesnice slavili.“ (*slavili* = shoda T7, nehodnotit ani nepřímo kliknutím).
   - L22 U3: místo *síla, zima* (jsou už v L22 U2) slova *silák, zívat*; slova jsou v popisku s mezerou (*s_chravo*), jinak by y/i prozradilo odpověď ano/ne.
   - L22 U4: Petrova věta „Táta brzy ráno nasypal brambory do pitle.“ (osnova „Do pitle jsme dali brambory.“); `final` pít · sypat · pytel · brzy (osnova „pytel · pít · pisk · pila“ — *pisk* není slovo, nabídka by se týkala jen chybného slova).
   - L23 U2: slova s mezerou (*v_let, v_dle…*) ze stejného důvodu jako L22 U3.
   - L23 U4: věta „Náš tým vihrál turnaj. Vítězný gól vystřelil Adam.“; `final` tři důvody místo čtyř (osnova „píše se vždy“ je nejasný důvod).
   - L24 U2: rodina slova *bydlet*: bydliště, obyvatel, obydlí × obyčej, bylina, bystrý (ne *byt, bytost* — ÚJČ je řadí do rodiny *být* stejně jako *bydlet*, sporné).
   - L24 U4: věta „V noci na stromě houkal vír a pod ním běžela myš.“; `final` tři důvody (osnova jen výr · vír — dvě dlaždice by prozradily `k1`).
   - L24 U5 diktát: znění podle osnovy, má 17 slov (osnova uvádí 16; přepočet).
5. **Nález ve validátoru (neměnil jsem):** `domenoveKontrolyCj` u nahrávek kontroluje jen přítomnost ID v `AUDIO.md`, ne znění — kolize se starými řádky Spolu (bod 1) tak projde bez chyby. Návrh: porovnat i sloupec „Přesné znění“ s `prepis` / `vety[].text`.
6. **Rozcvička L21:** osnova chce obecnou chybu (Z5 nemá vlastní kód) — `zname_chyby: []`.
