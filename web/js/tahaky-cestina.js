// =====================================================================
// web/js/tahaky-cestina.js — taháky češtiny Spolu 8 (R78). Jeden tahák na téma (= `tyden` v katalogu, 1–10).
// Odemkne se dokončením všech učebních lekcí tématu (L1–L4); naostro a B-varianty se nepočítají (tahaky.js).
// Obsah podle predani/2026-10-09-odznaky-a-tahaky/TAHAKY-OSMA.md: 3–6 bloků { nadpis, text, priklad }, markdown
// (nový řádek = `\n\n`, seznam `- ` po `\n\n`; KaTeX se v češtině nepoužívá). Pravidla a termíny jsou převzaté z lekcí
// tématu (uvod_pravidla, slovníček pro rodiče, typické chyby); příklady jsou záměrně jiné než v úlohách lekcí (učebních,
// N, B, NB) i v úvodním a pololetním testu, aby tahák nebyl klíčem k úlohám. Tvary ověřené v IJP ÚJČ, bez dublet.
// id, predmet, faze a tyden neměnit (podle nich se tahák odemyká a pamatuje).
// =====================================================================
export const TAHAKY_CESTINA = Object.freeze([
  // téma 1: cj-t1-l1, cj-t1-l1n, cj-t1-l2, cj-t1-l2n, cj-t1-l3, cj-t1-l3n, cj-t1-l4, cj-t1-l4n
  {
    id: 't:cestina:osma:1', predmet: 'cestina', faze: 'osma', tyden: 1,
    nazev: 'Slovní druhy',
    podnazev: 'Téma 1 · deset druhů a jejich testy',
    bloky: [
      {
        nadpis: 'Ohebné, nebo neohebné',
        text: 'Ohebné slovo mění tvar. Zkus: bez ___, k ___, já/on ___. Ohebných druhů je pět: podstatné jméno, přídavné jméno, zájmeno, číslovka, sloveso. Ostatních pět druhů je neohebných.',
        priklad: '*žirafa – bez žirafy* · *mává – mávají* → ohebná\n\nPozor: *levně – levněji* je jen stupňování, ne jiný pád. Příslovce zůstává neohebné.',
      },
      {
        nadpis: 'Pět ohebných druhů',
        text: '- **podstatné jméno:** jde před něj říct ten, ta, to\n- **přídavné jméno:** jaký?\n- **zájmeno:** stojí místo jména nebo na ně ukazuje\n- **číslovka:** kolik? kolikátý?\n- **sloveso:** jde říct on ___',
        priklad: '*ta žirafa* → podstatné jméno · *kulatý* (jaký?) → přídavné jméno · *vy* → zájmeno · *devatenáct* (kolik?) → číslovka · *on zívá* → sloveso',
      },
      {
        nadpis: 'Pasti u ohebných slov',
        text: 'Slovo, které říká pořadí, je číslovka, i když se mění jako přídavné jméno. Přivlastňovací zájmeno (můj, tvůj, náš, váš) říká čí, ale místo něj jde říct něčí jméno.',
        priklad: '*sedmnáctý* → kolikátý? → číslovka\n\n*vaše* kolo → jde říct *Evino* kolo → zájmeno\n\nPozor: *sedmnáctý* ani *vaše* nejsou přídavná jména.',
      },
      {
        nadpis: 'Pět neohebných druhů',
        text: '- **příslovce:** jak? kde? kdy? Stojí samo, většinou u slovesa.\n- **předložka:** stojí před jménem\n- **spojka:** spojuje slova nebo věty\n- **částice:** kéž, ať na začátku věty s přáním\n- **citoslovce:** zvuk nebo výkřik',
        priklad: '*potichu* → příslovce · *pod lavicí* → předložka · *ani* → spojka · *Kéž by už svítalo!* → částice · *šup* → citoslovce',
      },
      {
        nadpis: 'Druh určuje věta',
        text: 'Stejné slovo může být v jiné větě jiný druh. Zkus test přímo ve větě: Je před ním ten, ta, to? Ptáš se kdy, kde? Stojí před jménem, nebo samo?',
        priklad: '*vedle pekárny* → stojí před jménem → předložka × *Pes ležel vedle.* → stojí samo → příslovce\n\n*To dopoledne pršelo.* → podstatné jméno × *Přijdu dopoledne.* → kdy? → příslovce',
      },
    ],
  },
  // téma 2: cj-t2-l5, cj-t2-l5n, cj-t2-l6, cj-t2-l6n, cj-t2-l7, cj-t2-l7n, cj-t2-l8, cj-t2-l8n
  {
    id: 't:cestina:osma:2', predmet: 'cestina', faze: 'osma', tyden: 2,
    nazev: 'Podstatná jména: vzory a koncovky',
    podnazev: 'Téma 2 · vzor a i/y v koncovce',
    bloky: [
      {
        nadpis: 'Čtrnáct vzorů',
        text: 'Rod poznáš podle ten, ta, to.\n\n- **rod mužský (ten):** pán, hrad, muž, stroj, předseda, soudce\n- **rod ženský (ta):** žena, růže, píseň, kost\n- **rod střední (to):** město, moře, kuře, stavení',
        priklad: '*ten kapr* → rod mužský · *ta louka* → rod ženský · *to sedlo* → rod střední',
      },
      {
        nadpis: 'Životné, nebo neživotné',
        text: 'Jen u rodu mužského. Řekni vidím ___. Zní to jako vidím pána, je jméno životné. Zní to jako vidím hrad, je neživotné. Rozhoduje test, ne to, jestli věc žije.',
        priklad: 'vidím *kapra* → životné → pán · vidím *javor* → neživotné → hrad\n\nPozor: *javor* roste, a přesto je neživotný.',
      },
      {
        nadpis: 'Vzor podle 1. a 2. pádu',
        text: 'Řekni slovo v 1. pádě a pak bez ___. Podle toho vyber vzor stejného rodu. Jména rodu mužského na -a mají vzor předseda, na -e vzor soudce.',
        priklad: '*houslař – bez houslaře* → muž · *sluha* → předseda · *zastánce* → soudce · *daň – bez daně* → píseň · *tele – bez telete* → kuře\n\nPozor: *vejce – bez vejce* nic nepřibere → moře.',
      },
      {
        nadpis: 'i, nebo y? Dosaď vzor',
        text: 'Po b, f, l, m, p, s, v, z zní i a y stejně. Urči vzor a řekni ho ve stejném tvaru, jaký má slovo ve větě. U vzoru rozdíl uslyšíš. Napiš stejné písmeno.',
        priklad: '*nad ostrov_* → nad hrady → *nad ostrovy*\n\n*s král_* → s muži → *s králi*',
      },
      {
        nadpis: 'Kdo? × koho? u životných jmen',
        text: 'U životných jmen rodu mužského rozhoduje pád. 1. pád množného čísla (kdo?) jako páni → i. 4. pád (koho?) a 7. pád (s kým?) jako pány → y.',
        priklad: '*Plazi* se vyhřívají. → páni → i · Vidím *plazy*. → pány → y\n\nPozor: rozhoduje otázka kdo?, nebo koho?, ne místo ve větě.',
      },
    ],
  },
  // téma 3: cj-t3-l9, cj-t3-l9n, cj-t3-l10, cj-t3-l10n, cj-t3-l11, cj-t3-l11n, cj-t3-l12, cj-t3-l12n
  {
    id: 't:cestina:osma:3', predmet: 'cestina', faze: 'osma', tyden: 3,
    nazev: 'Přídavná jména',
    podnazev: 'Téma 3 · druhy, stupně a koncovky',
    bloky: [
      {
        nadpis: 'Tvrdé, měkké, přivlastňovací',
        text: '- **tvrdé** mění konec podle jména (mladý, mladá, mladé)\n- **měkké** má stejný konec u ten, ta i to (jarní)\n- **přivlastňovací** odpovídá na čí? a je utvořené od jména osoby nebo zvířete',
        priklad: '*hustý* les, *hustá* mlha → tvrdé · *podzimní* den, *podzimní* noc → měkké · *Pavlův*, *Evin* → přivlastňovací',
      },
      {
        nadpis: 'Stupňování',
        text: 'Přídavné jméno má tři stupně. 1. stupeň nic nesrovnává. 2. stupeň srovnává dvě věci (-ejší, -ší). 3. stupeň vybírá ze všech a má nej-. Některá slova se stupňují jinak, tvar ověř ve větě: Tenhle je ještě … než ten druhý.',
        priklad: '*pilný – pilnější – nejpilnější* · *tvrdý – tvrdší – nejtvrdší*\n\nPozor: 3. stupeň je vždy nej- a 2. stupeň: *tvrdší → nejtvrdší*.',
      },
      {
        nadpis: 'Koncovka -ý, -í, -é',
        text: 'Najdi jméno, ke kterému přídavné jméno patří, a řekni před něj ten, ti, ty, nebo ta. -í se píše jen u „ti“. Jméno může stát i daleko.',
        priklad: 'ten *hbitý* plavec · ti *hbití* plavci · ty *hbité* plavkyně\n\nPozor: ty děti → *ty promočené děti*, ale ti rodiče → *ti promočení rodiče*.',
      },
      {
        nadpis: 'Konce -ovi, -ovy, -ova',
        text: 'Přivlastňovací přídavné jméno mění konec podle jména, ke kterému patří: ti → -ovi, ty → -ovy, ta → -ova. Zní stejně, rozhoduje ti, nebo ty.',
        priklad: '*Markovi* rodiče (ti) · *Markovy* tenisky (ty) · *Markova* křesla (ta)',
      },
      {
        nadpis: 'Čí? × komu?',
        text: 'Když se ptáš čí?, je to přivlastňovací přídavné jméno a konec řídí jméno vedle. Když se ptáš komu?, je to podstatné jméno ve 3. pádě. U jmen jako Marek nebo Tomáš je to vždy -ovi.',
        priklad: '*Markovy* tenisky (čí? ty tenisky) × Vrátil jsem tenisky *Markovi*. (komu?)\n\nPozor: u čí? vždy řekni ti, nebo ty.',
      },
    ],
  },
  // téma 4: cj-t4-l13, cj-t4-l13n, cj-t4-l14, cj-t4-l14n, cj-t4-l15, cj-t4-l15n, cj-t4-l16, cj-t4-l16n
  {
    id: 't:cestina:osma:4', predmet: 'cestina', faze: 'osma', tyden: 4,
    nazev: 'Zájmena a číslovky',
    podnazev: 'Téma 4 · druhy a správné tvary',
    bloky: [
      {
        nadpis: 'Druh zájmena podle toho, co dělá',
        text: '- **osobní** stojí místo osoby nebo věci\n- **přivlastňovací** říká čí\n- **ukazovací** ukazuje\n- **tázací** se ptá\n- **vztažné** připojuje větu\n- **neurčité** mluví o neznámém\n- **záporné** popírá',
        priklad: '*ony* → osobní · *jejich* → přivlastňovací · *tato* → ukazovací · *Kdo tleská?* → tázací · *některý* → neurčité · *Nic nechci.* → záporné',
      },
      {
        nadpis: 'jenž, nebo jež',
        text: 'Jenž a jež jsou knižní slova místo který, která, které. Jenž patří ke jménu, před které řekneš ten. Jež ke jménu s ta nebo to.',
        priklad: 'ten potok, *jenž* … · ta louka, *jež* … · to jezírko, *jež* …\n\nPozor: rozhoduje ten, ta, to, ne konec slova: *to terárium, jež* …',
      },
      {
        nadpis: 'mě, nebo mně',
        text: 'Místo mě/mně řekni tě/tobě. Jde říct tobě → **mně**. Jde říct tě nebo tebe → **mě**.',
        priklad: '*Nalij mně* vodu. (nalij tobě) · *Spolehni se na mě.* (na tebe)\n\nPozor: *Omluv mě.* (omluv tě) → mě, ne mně.',
      },
      {
        nadpis: 'ji, nebo jí; po předložce n-',
        text: 'Místo ji/jí řekni jméno. Jde říct Kláru → **ji** (krátce). Jde říct Kláře nebo Klárou → **jí** (dlouze). Po předložce píšeš něho, němu, ní: pro něho, ne pro jeho.',
        priklad: '*Pochválil jsem ji.* (Kláru) · *Poděkoval jsem jí.* (Kláře) · Stál jsem *za ním*.\n\nPozor: *jeho* zůstává, když říká čí: *bez jeho šály*.',
      },
      {
        nadpis: 'Druhy číslovek',
        text: '- **základní:** kolik?\n- **řadová:** kolikátý?\n- **druhová:** kolikery?\n- **násobná:** kolikrát?',
        priklad: '*jedenáct* (kolik?) · *jedenáctý* (kolikátý?) · *patery* boty (kolikery?) · *jedenáctkrát* (kolikrát?)',
      },
      {
        nadpis: 'Tvary dva, oba, tři, čtyři',
        text: 'Zeptej se pádovou otázkou.\n\n- bez koho? o kom? → dvou, obou\n- komu? → dvěma, oběma, třem, čtyřem\n- s kým? → dvěma, oběma, třemi, čtyřmi\n\nPíšeš jako v knize, ne jak mluvíš.',
        priklad: 'jdu *se čtyřmi* psy · pomáhám *oběma* sousedům · bez *dvou* knoflíků\n\nPozor: *dvouma* se jen říká, píšeš *dvěma*. *Třema* jen u částí těla (*třema nohama*), jinak *třemi*.',
      },
    ],
  },
  // téma 5: cj-t5-l17, cj-t5-l17n, cj-t5-l18, cj-t5-l18n, cj-t5-l19, cj-t5-l19n, cj-t5-l20, cj-t5-l20n
  {
    id: 't:cestina:osma:5', predmet: 'cestina', faze: 'osma', tyden: 5,
    nazev: 'Slovesa: způsob, vid, rod',
    podnazev: 'Téma 5 · tři testy pro sloveso',
    bloky: [
      {
        nadpis: 'Způsob slovesa',
        text: '- **oznamovací:** sloveso oznamuje, co se děje, dělo nebo bude dít, i v otázce\n- **rozkazovací:** přikazuje nebo vyzývá\n- **podmiňovací:** je u něj by, bych, bys, bychom, byste',
        priklad: '*Vyneseš* koš? → oznamovací · *Vynes* koš! → rozkazovací · *Vynesl bys* koš? → podmiňovací\n\nPozor: *Byli jsme na chatě.* → minulý čas, by tu není → oznamovací.',
      },
      {
        nadpis: 'bych, bys, bychom, byste',
        text: 'Malé slovo by se mění podle osoby. Píšeš ho spisovně, tak jak v písemce.',
        priklad: 'já *bych* zpíval · ty *bys* zpíval · on *by* zpíval · my *bychom* zpívali · vy *byste* zpívali · oni *by* zpívali\n\nPozor: *bysme* se jen říká, *by jsme* a *by jste* jsou chyba.',
      },
      {
        nadpis: 'Vid: test budu ___',
        text: 'Řekni budu před neurčitý tvar. Jde to, je sloveso **nedokonavé** (děj trvá nebo se opakuje). Nejde to, je **dokonavé** (děj se dokončí).',
        priklad: '*budu zametat* → jde → nedokonavé · *budu zamést* → nejde → dokonavé',
      },
      {
        nadpis: 'Budoucnost dokonavých sloves',
        text: 'Dokonavé sloveso říká budoucnost jedním slovem, bez budu. Tvar vypadá jako přítomný, ale je to čas budoucí.',
        priklad: '*Zítra zametu dvůr.* → čas budoucí\n\nPozor: *budu zamést* je chyba, správně *zametu*. S budu jen nedokonavé: *budu zametat*.',
      },
      {
        nadpis: 'Rod činný, nebo trpný',
        text: '- **činný:** podmět děj dělá\n- **trpný:** s podmětem se děj děje, dělá to někdo jiný. Je v něm být (je, byl, bude) a tvar na -n nebo -t.',
        priklad: '*Hasiči uhasili požár.* → činný · *Požár byl uhašen.* → trpný\n\nPozor: *Strýc byl v dílně.* má být, ale chybí tvar na -n, -t → činný.',
      },
    ],
  },
  // téma 6: cj-t6-l21, cj-t6-l21n, cj-t6-l22, cj-t6-l22n, cj-t6-l23, cj-t6-l23n, cj-t6-l24, cj-t6-l24n
  {
    id: 't:cestina:osma:6', predmet: 'cestina', faze: 'osma', tyden: 6,
    nazev: 'Vyjmenovaná slova',
    podnazev: 'Téma 6 · y po b, l, m, p, s, v, z',
    bloky: [
      {
        nadpis: 'Kdy se píše y',
        text: 'Po b, l, m, p, s, v, z se píše y jen ve vyjmenovaných slovech a ve slovech z jejich rodiny. Slovo z rodiny má stejný kořen a podobný význam. Jinde se píše i.',
        priklad: '*kopyto* → *kopytník* → y · *netopýr* → *netopýří* → y\n\nPozor: *pilot* nepatří do rodiny žádného vyjmenovaného slova → i.',
      },
      {
        nadpis: 'Řady po B, L, M',
        text: '**B:** být, bydlit, obyvatel, byt, příbytek, nábytek, dobytek, obyčej, bystrý, bylina, kobyla, býk\n\n**L:** slyšet, mlýn, blýskat se, polykat, plynout, plýtvat, vzlykat, lysý, lýtko, lýko, lyže, pelyněk, plyš\n\n**M:** my, mýt, myslit, mýlit se, hmyz, myš, hlemýžď, mýtit, zamykat, smýkat, dmýchat, chmýří, nachomýtnout se',
        priklad: '*mlýn* → *mlynář* · *lýko* → *lýkový* · *myslit* → *promyšlený*',
      },
      {
        nadpis: 'Řady po P, S, V, Z',
        text: '**P:** pýcha, pytel, pysk, netopýr, slepýš, pyl, kopyto, klopýtat, třpytit se, zpytovat, pykat, pýr, pýřit se\n\n**S:** syn, sytý, sýr, syrový, sychravý, usychat, sýkora, sýček, sysel, syčet, sypat\n\n**V:** vy, vysoký, výt, výskat, zvykat, žvýkat, vydra, výr, vyžle, povyk, výheň\n\n**Z:** brzy, jazyk, nazývat se',
        priklad: '*pyl* → *pylový* · *sysel* → *syslí* · *výr* → *výří*',
      },
      {
        nadpis: 'Předpona vy-, vý-',
        text: 'Předponu jde na začátku slova oddělit a zbytek je pořád slovo. Předpona vy-/vý- se píše vždy s y. Když oddělit nejde, píše se i.',
        priklad: '*vy-luštit* → zbude *luštit* → y · *vikýř*: „kýř“ není slovo → i\n\nPozor: předpona se schová i za ne-: *ne-vy-spalý* → y.',
      },
      {
        nadpis: 'Dvojice podle významu',
        text: 'Některá slova zní stejně a rozhoduje smysl věty.\n\n- **být** = existovat × **bít** = tlouct\n- **mýt** = umývat × **mít** = vlastnit\n- **výr** = pták × **vír** = točící se voda\n- **výt** jako pes × **vít** věnec',
        priklad: 'Kovář *bil* kladivem. (tlouct) · Táta *myl* okno. (umývat)\n\nPozor: rozhoduje význam, ne jak slovo zní.',
      },
    ],
  },
  // téma 7: cj-t7-l25, cj-t7-l25n, cj-t7-l26, cj-t7-l26n, cj-t7-l27, cj-t7-l27n, cj-t7-l28, cj-t7-l28n
  {
    id: 't:cestina:osma:7', predmet: 'cestina', faze: 'osma', tyden: 7,
    nazev: 'Shoda přísudku s podmětem',
    podnazev: 'Téma 7 · i, y, a v minulém čase',
    bloky: [
      {
        nadpis: 'Test ti, ty, ta',
        text: 'V minulém čase řídí koncovku slovesa podmět. Najdi ho otázkou kdo, co? a řekni před něj ti, ty, nebo ta: ti → i, ty → y, ta → a.',
        priklad: 'ti *kominíci* vylezli · ty *jahody* dozrály · ta *káčata* plavala',
      },
      {
        nadpis: 'Podmět jinde než na začátku',
        text: 'Podmět může stát až za slovesem. Nebo ve větě chybí a je ve větě předtím. Vždy se zeptej od slovesa: kdo, co?',
        priklad: '*Ráno odletěli čápi.* → kdo odletěl? čápi → i\n\n*Vlaštovky si postavily hnízdo. Potom odletěly.* → kdo odletěl? vlaštovky → y',
      },
      {
        nadpis: 'Slovo u slovesa není podmět',
        text: 'Koncovku řídí jen podmět. Slovo, které stojí hned u slovesa, ji neurčuje, když to není podmět.',
        priklad: '*Učebnice žáků ležely na katedře.* → co leželo? učebnice → ty učebnice → y\n\nPozor: ne podle slova žáků.',
      },
      {
        nadpis: 'Víc podmětů',
        text: 'Každý podmět si řekni ve více kusech. Stačí jeden „ti“ a píše se i. Jen „ta“ → a. Jinak y.',
        priklad: '*Kmotra a kmotr zatleskali.* (kmotr je „ti“) · *Kamínka a sklíčka ležela.* (jen ta) · *Jahody a hrozny dozrály.* (ty, ty)',
      },
      {
        nadpis: 'děti, lidé, rodiče, koně',
        text: 'Děti: o jednom to dítě, ve více kusech ty děti → y. Lidé, rodiče, koně: vždy ti → i. V běžné řeči se říká „ty rodiče“, ve škole platí ti rodiče.',
        priklad: '*Děti stavěly bunkr.* (ty děti) · *Rodiče nakupovali.* (ti rodiče) · *Koně odpočívali.* (ti koně)\n\nPozor: ne „ty rodiče“, ve škole vždy ti → i.',
      },
    ],
  },
  // téma 8: cj-t8-l29, cj-t8-l29n, cj-t8-l30, cj-t8-l30n, cj-t8-l31, cj-t8-l31n, cj-t8-l32, cj-t8-l32n
  {
    id: 't:cestina:osma:8', predmet: 'cestina', faze: 'osma', tyden: 8,
    nazev: 'Větné členy',
    podnazev: 'Téma 8 · ptej se od slova, ke kterému člen patří',
    bloky: [
      {
        nadpis: 'Přísudek a podmět',
        text: 'Nejdřív najdi přísudek: co podmět dělá, nebo kdo či jaký je. Od něj se zeptej kdo, co? a máš podmět. Podmět může stát i za slovesem.',
        priklad: '*Ve stáji zařehtala klisna.* → přísudek *zařehtala* · podmět *klisna* (kdo zařehtal?)',
      },
      {
        nadpis: 'Slovesný, nebo jmenný se sponou',
        text: '**Slovesný** přísudek je jen sloveso. **Jmenný se sponou** má dvě části: tvar slova být (spona) a slovo, které říká, kdo nebo jaký podmět je.',
        priklad: '*Teta je zubařka.* → jmenný · *Teta byla v Brně.* → kde byla? → slovesný\n\nPozor: patří k němu obě části, *je zubařka*, ne jen *je*.',
      },
      {
        nadpis: 'Předmět, nebo příslovečné určení',
        text: 'Na **předmět** se ptáš od slovesa pádovou otázkou (koho, co? komu? o čem? s kým?). Na **příslovečné určení** se ptáš kde? kdy? jak? proč?',
        priklad: '*Dědeček psal o válce.* → o čem? → předmět · *Dědeček žije na vsi.* → kde? → příslovečné určení\n\nPozor: *stará se o zahradu* → o co? → předmět, i když je tu předložka.',
      },
      {
        nadpis: 'Druhy příslovečného určení',
        text: 'kde? → **místa** · kdy? → **času** · jak? → **způsobu** · proč? → **příčiny**. Čas může být i bez předložky.',
        priklad: '*Plave každé ráno.* → času · *Mluvil šeptem.* → způsobu · *Zpozdil se kvůli nehodě.* → příčiny · *Spí na palandě.* → místa',
      },
      {
        nadpis: 'Přívlastek shodný a neshodný',
        text: 'Přívlastek blíž popisuje podstatné jméno, ptáš se od jména jaký? který? čí? **Shodný** mění tvar spolu se jménem. **Neshodný** tvar nemění, často má předložku.',
        priklad: '*pruhovaný* šátek – bez *pruhovaného* šátku → shodný\n\nšátek *z hedvábí* – bez šátku *z hedvábí* → neshodný',
      },
      {
        nadpis: 'Přívlastek, nebo příslovečné určení',
        text: 'Rozhoduje, ke kterému slovu člen patří. Patří ke jménu → přívlastek. Patří ke slovesu → příslovečné určení.',
        priklad: '*Holub na anténě vrká.* → který holub? → přívlastek · *Holub sedí na anténě.* → kde sedí? → příslovečné určení místa\n\nPozor: stejná slova, jiný člen.',
      },
    ],
  },
  // téma 9: cj-t9-l33, cj-t9-l33n, cj-t9-l34, cj-t9-l34n, cj-t9-l35, cj-t9-l35n, cj-t9-l36, cj-t9-l36n
  {
    id: 't:cestina:osma:9', predmet: 'cestina', faze: 'osma', tyden: 9,
    nazev: 'Souvětí a čárka',
    podnazev: 'Téma 9 · věty a kam patří čárka',
    bloky: [
      {
        nadpis: 'Kolik přísudků, tolik vět',
        text: 'Věty v souvětí počítej podle přísudků, ne podle čárek ani jmen. K přísudku patří i spojení jako chce spát nebo bude malovat.',
        priklad: '*Když zahřmělo, pes zalezl pod stůl.* → 2 přísudky → 2 věty\n\nPozor: *Bude malovat.* je jeden přísudek, jedna věta.',
      },
      {
        nadpis: 'Věta hlavní a vedlejší',
        text: 'Věta hlavní obstojí sama. Věta vedlejší sama neobstojí a začíná slovem jako že, když, protože, aby, který, kde.',
        priklad: '*Zjistím, | kde je pošta.* → hlavní | vedlejší',
      },
      {
        nadpis: 'Čárka v souvětí',
        text: 'Čárka je na hranici vedlejší věty. Když je vedlejší věta vložená doprostřed jiné věty, je čárka před ní i za ní.',
        priklad: '*Věřím, že to zvládneš.*\n\n*Peněženka, kterou jsem ztratil, se našla.*\n\nPozor: u vložené věty nezapomeň druhou čárku.',
      },
      {
        nadpis: 'Kdy před a, i, ani, nebo čárka není',
        text: 'Když a, i, ani, nebo jen spojují dvě věci nebo dvě věty, čárku před ně nepíšeš.',
        priklad: '*Táta vařil a máma prostírala.* · *Nemáme sůl ani pepř.*\n\nPozor: ve dvojici buď…, nebo čárka je: *Buď zavoláš, nebo napíšeš.*',
      },
      {
        nadpis: 'Výčet a ale',
        text: 'Mezi slova výčtu píšeš čárku, před posledním a čárka není. Před ale je čárka, staví jednu věc proti druhé.',
        priklad: '*Do polévky dáme cibuli, česnek, celer a petržel.*\n\n*Byl unavený, ale šťastný.*',
      },
      {
        nadpis: 'Oslovení',
        text: 'Oslovení je jméno toho, na koho voláš. Odděluje se čárkou. Uprostřed věty má čárku z obou stran.',
        priklad: '*Martino, zhasni světlo.* · *Zhasni, Martino, světlo.*\n\nPozor: uprostřed věty jsou čárky dvě.',
      },
    ],
  },
  // téma 10: cj-t10-l37, cj-t10-l37n, cj-t10-l38, cj-t10-l38n, cj-t10-l39, cj-t10-l39n, cj-t10-l40, cj-t10-l40n
  {
    id: 't:cestina:osma:10', predmet: 'cestina', faze: 'osma', tyden: 10,
    nazev: 'Stavba slova a pravopis na švu',
    podnazev: 'Téma 10 · rozlož slovo na části',
    bloky: [
      {
        nadpis: 'Předpona, kořen, přípona',
        text: '- **předpona** je na začátku a jde ji dát i k jiným slovům\n- **kořen** je stejný v celé rodině příbuzných slov\n- **přípona** je za kořenem, vzniká s ní nové slovo\n- **šev** je místo, kde se dvě části potkají',
        priklad: '*hora – horník – pod|hor|ský*: předpona *pod-*, kořen *hor*, přípona *-ský*',
      },
      {
        nadpis: 'Dvě stejné souhlásky na švu',
        text: 'Když se na švu potkají dvě stejná písmena, píšou se obě. Platí to mezi předponou a kořenem i mezi kořenem a příponou.',
        priklad: '*plyn → plyn|ný* · *kořen → kořen|ný*\n\nPozor: jedno n, když se dvě nepotkají: *len → lněný*.',
      },
      {
        nadpis: 'ú po předponě',
        text: 'Na začátku kořene je ú. Zůstává i po předponě. Uvnitř českých slov jinak píšeš ů.',
        priklad: '*účast → ne|účast* · *účinek → ne|účinný* × *vůz*, *půda*\n\nPozor: v *ne|účinný* je ú uprostřed slova, ale na začátku kořene.',
      },
      {
        nadpis: 'Předpony s-, z-, vz- a předložky s, z',
        text: '- předpona **s-** dolů nebo dohromady, **z-** změna, **vz-** nahoru\n- předložka **s** u otázky s kým, čím? (7. pád), **z** u otázky z koho, čeho? (2. pád)',
        priklad: '*sestoupit* (dolů) · *sloučit* (dohromady) · *zezelenat* (změna) · *vzpřímit se* (nahoru)\n\n*s pejskem* (s kým?) × *z půdy* (z čeho?)\n\nPozor: zní stejně, rozhoduje význam nebo otázka.',
      },
      {
        nadpis: 'bje, vje, nebo bě, vě',
        text: 'Bje a vje píšeš jen na švu, kde se předpona ob- nebo v- potká s částí na je-. Jinak píšeš bě, vě, pě.',
        priklad: '*ob|jevitel* · *ob|jednací* lístek · *v|jezdová* brána × *běžec*, *věnec*, *pěšina*\n\nPozor: *obě* ruce → bě, předpona ani část na je- tu není.',
      },
      {
        nadpis: 'mně, nebo mě uvnitř slova',
        text: 'Mně píšeš, když je v příbuzném slově mn nebo men. Jinak mě. U slova já: mně = komu? o kom?, mě = koho?',
        priklad: '*ohromně* ← ohromný → mně × *měsíc*, *mělký* → mě\n\nPozor: u slova já rozhoduje otázka: *Pošli to mně.* (komu?) × *Vyzvedni mě.* (koho?)',
      },
    ],
  },
]);
