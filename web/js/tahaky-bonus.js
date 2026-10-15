// =====================================================================
// web/js/tahaky-bonus.js — měsíční výzvy a zlaté bonusové taháky Spolu 8 (R78 + R82).
// Výzva: v kalendářním měsíci (Europe/Prague) dokončit aspoň `cil` různých lekcí (učební i naostro, ne B-varianty
// a testy), oba předměty se sčítají. Odměna = zlatý tahák `b:<mesic>`; všem se odemknou 1. 6. 2027 (tahaky.js).
// Cíle: plán je 6 lekcí týdně (3 M + 3 ČJ), cíl ≈ 60–70 % plánu měsíce bez prázdnin (listopad: začátek sezóny
// a úvodní testy; květen: lekce roku končí, počítá se i zopakovaná lekce). Mění se jen tady, kód ne.
// Zlaté taháky: 3–6 bloků { nadpis, text, priklad? } (TAHAKY-OSMA.md); příklady nejsou z úloh lekcí ani testů,
// matematika přepočítaná, čeština ověřená v IJP ÚJČ. id a mesic neměnit.
// =====================================================================

export const VYZVY = [
  { mesic: '2026-11', cil: 12, nazev: 'Listopadový start' },
  { mesic: '2026-12', cil: 12, nazev: 'Adventní výzva' },
  { mesic: '2027-01', cil: 15, nazev: 'Novoroční výzva' },
  { mesic: '2027-02', cil: 12, nazev: 'Únorová výzva' },
  { mesic: '2027-03', cil: 16, nazev: 'Jarní výzva' },
  { mesic: '2027-04', cil: 16, nazev: 'Dubnová výzva' },
  { mesic: '2027-05', cil: 8, nazev: 'Májový finiš' },
];

export const TAHAKY_BONUS = [
  {
    id: 'b:2026-11', mesic: '2026-11',
    nazev: 'Nejčastější chyby v matematice',
    podnazev: 'Bonus za listopadovou výzvu',
    bloky: [
      {
        nadpis: 'Krát dřív než plus',
        text: 'Nejdřív závorky, pak krát a děleno, nakonec plus a mínus. Krát a děleno mají stejnou přednost: ty počítej zleva doprava.',
        priklad: '- $8 + 6 \\cdot 4 = 8 + 24 = 32$\n- $36 : 6 \\cdot 3 = 6 \\cdot 3 = 18$\n\nPozor: ne $14 \\cdot 4 = 56$.',
      },
      {
        nadpis: 'Desetinná čárka',
        text: 'Při násobení vynásob čísla bez čárky. Ve výsledku pak odpočítej zprava tolik desetinných míst, kolik jich mají obě čísla dohromady. Krát $10$ nebo $100$ posouvá čárku doprava, děleno doleva.',
        priklad: '- $0{,}8 \\cdot 0{,}6 = 0{,}48$ (dvě místa)\n- $5{,}2 : 100 = 0{,}052$\n\nPozor: $0{,}8 \\cdot 0{,}6$ není $4{,}8$.',
      },
      {
        nadpis: 'Zlomky: jmenovatel zůstane',
        text: 'Zlomky převeď na společného jmenovatele. Pak sečti jen čitatele, jmenovatel zůstane stejný.',
        priklad: '$\\frac{1}{4} + \\frac{2}{7} = \\frac{7}{28} + \\frac{8}{28} = \\frac{15}{28}$. Pozor: ne $\\frac{3}{11}$.',
      },
      {
        nadpis: 'Odečíst záporné číslo',
        text: 'Odečíst záporné číslo je totéž jako přičíst kladné. Minus krát minus dává plus, různá znaménka dávají minus.',
        priklad: '- $8 - (-5) = 8 + 5 = 13$\n- $(-4) \\cdot 6 = -24$\n\nPozor: $8 - (-5)$ není $3$.',
      },
      {
        nadpis: 'Procento není koruna',
        text: 'Procento je setina celku. Spočítej nejdřív $1\\,\\%$ (celek děleno $100$) a pak ho vynásob.',
        priklad: '$30\\,\\%$ z $420$ Kč: $1\\,\\% = 4{,}2$ Kč, $30\\,\\% = 126$ Kč. Pozor: $30\\,\\%$ není $30$ Kč.',
      },
      {
        nadpis: 'Obsah: po stu a půlka',
        text: 'Obsah se převádí po $100$, ne po $10$. Obsah trojúhelníku: strana krát výška k ní, a to celé děleno dvěma.',
        priklad: '- $4\\ \\text{m}^2 = 400\\ \\text{dm}^2$\n- trojúhelník $a = 6\\ \\text{cm}$, $v_a = 7\\ \\text{cm}$: $S = \\frac{6 \\cdot 7}{2} = 21\\ \\text{cm}^2$\n\nPozor: ne $42\\ \\text{cm}^2$.',
      },
    ],
  },
  {
    id: 'b:2026-12', mesic: '2026-12',
    nazev: 'Nejčastější chyby v češtině',
    podnazev: 'Bonus za prosincovou výzvu',
    bloky: [
      {
        nadpis: 'Mě, nebo mně',
        text: 'Dosaď *tebe*, nebo *tobě*. Kde sedí *tobě*, píšeš *mně*. Kde sedí *tebe* nebo *tě*, píšeš *mě*.',
        priklad: '- *Ten dárek patří mně.* (tobě)\n- *Zajímá mě to.* (tebe)\n\nPozor: rozhoduje pád, ne předložka: *Pečuje o mě.* (o tebe) × *Vyprávěl o mně.* (o tobě)',
      },
      {
        nadpis: 'Koncovky podle vzoru',
        text: 'Nevíš, jestli *i*, nebo *y*? Urči vzor podle 1. a 2. pádu. Pak ho dosaď ve stejném pádě.',
        priklad: '*ti sloni* (ti páni) → *i* · *se slony* (s pány) → *y*. Pozor: stejné slovo, jiný pád, jiná koncovka.',
      },
      {
        nadpis: 'Přídavná jména: -ý, nebo -í',
        text: 'Najdi jméno, ke kterému přídavné jméno patří, a řekni před něj *ten, ti, ty, ta*. Tvrdé přídavné jméno má *-í* jen u *ti*.',
        priklad: '*ti smutní hráči* · *ty smutné hráčky* · *ten smutný hráč*. Pozor: u *ty* je *-é*, ne *-í*.',
      },
      {
        nadpis: 'Shoda s podmětem',
        text: 'Najdi podmět a řekni před něj *ti, ty, ta*: *ti* → *-i*, *ty* → *-y*, *ta* → *-a*. K *děti* patří *ty*, k *lidé* a *rodiče* patří *ti*.',
        priklad: '*Sestry mého kamaráda zavolaly.* (ty sestry) · *Rodiče nám pomohli.* Pozor: řiď se podmětem, ne slovem, které stojí nejblíž.',
      },
      {
        nadpis: 'Vyjmenovaná slova',
        text: 'V kořeni slova po *b, l, m, p, s, v, z* píšeš *y* jen ve vyjmenovaných slovech a ve slovech s nimi příbuzných. Předpona *vy-, vý-* má vždy *y*. Jinak v kořeni píšeš *i*.',
        priklad: '*bydlet* → *bydliště* · *vyzout* · *zisk, silný* → *i*. Pozor: *y* zůstane i v příbuzném slově s předponou: *sypat* → *nasypat*.',
      },
      {
        nadpis: 'Čárka v souvětí',
        text: 'Vedlejší věta (*že, když, protože, který…*) se odděluje čárkou. Vložená vedlejší věta má čárku na začátku i na konci. Před *a, i, ani, nebo*, když jen připojují další větu, čárku nepiš.',
        priklad: '*Sešit, který jsi mi půjčil, mám doma.* · *Otevřel okno a uvařil čaj.* Pozor: vložená věta potřebuje i druhou čárku.',
      },
    ],
  },
  {
    id: 'b:2027-01', mesic: '2027-01',
    nazev: 'Jak číst zadání',
    podnazev: 'Bonus za lednovou výzvu',
    bloky: [
      {
        nadpis: 'Na co se ptá',
        text: 'Najdi v zadání otázku a na papíře si ji podtrhni. Na konci zkontroluj, že odpovídáš přesně na ni, ne mezivýsledkem.',
        priklad: 'Lucka má $520$ Kč a čtvrtinu utratí. Kolik jí zbude? Utratí $130$ Kč, zbude $390$ Kč. Pozor: $130$ Kč je jen mezivýsledek.',
      },
      {
        nadpis: 'Všechny údaje',
        text: 'Vypiš si všechny údaje ze zadání. Každé číslo a každé slovíčko tam má svůj důvod. Co použiješ, odškrtni.',
        priklad: 'Adam jede $3$ dny na kole do školy a zpět. Do školy je to $6\\ \\text{km}$. Celkem $3 \\cdot 2 \\cdot 6 = 36\\ \\text{km}$. Pozor: „a zpět“ cestu zdvojí.',
      },
      {
        nadpis: 'Jednotky na začátku i na konci',
        text: 'Než začneš počítat, převeď údaje na stejnou jednotku. Na konci se podívej, v jaké jednotce chce výsledek otázka.',
        priklad: 'Záhon $20\\ \\text{m}$ a $150\\ \\text{dm}$: $150\\ \\text{dm} = 15\\ \\text{m}$, $S = 300\\ \\text{m}^2$. Otázka chce ary: $3\\ \\text{a}$.',
      },
      {
        nadpis: 'Co je celek',
        text: 'Celek je to, z čeho počítáš procenta nebo zlomek. Najdi ho dřív, než začneš počítat. Často stojí za slovem „z“ nebo „ze“.',
        priklad: 'Ze $25$ hráčů $5$ nepřišlo. Kolik procent přišlo? Přišlo $20$ z $25$, to je $80\\,\\%$. Pozor: $20\\,\\%$ je odpověď na „kolik nepřišlo“.',
      },
      {
        nadpis: 'Označ všechna',
        text: 'Hlídej sloveso v zadání: označ, doplň, vyber, oprav. „Klikni na všechna“ znamená, že správných může být víc. Neskonči po prvním.',
        priklad: '„Klikni na všechna přídavná jména“: *Velký kocour skočil na staré křeslo.* Správně jsou dvě: *velký, staré*.',
      },
      {
        nadpis: 'Detektiv: první chyba',
        text: 'Petr udělal jednu chybu. Projdi jeho řešení řádek po řádku a hledej místo, kde chyba vznikla. Další špatná čísla z ní jen vyplývají.',
        priklad: 'Petr: $15 - 3 \\cdot 4 = 12 \\cdot 4 = 48$. Chyba je hned v prvním kroku, správně $15 - 12 = 3$. Pozor: $48$ je až důsledek.',
      },
    ],
  },
  {
    id: 'b:2027-02', mesic: '2027-02',
    nazev: 'Jak se učit 20 minut denně',
    podnazev: 'Bonus za únorovou výzvu',
    bloky: [
      {
        nadpis: 'Pevný čas',
        text: 'Lekce matematiky trvá asi 20 minut, lekce češtiny asi 25. Každý týden se otevřou 3 lekce z každého předmětu. Vyber si pevný čas a drž ho.',
        priklad: 'Pondělí, středa, pátek: matematika. Úterý, čtvrtek, sobota: čeština. Každý den jen jedna lekce, třeba hned po svačině.',
      },
      {
        nadpis: 'Krátce a často',
        text: 'Dvacet minut každý den naučí víc než dvě hodiny jednou za týden. Mezi lekcemi si hlava látku ukládá.',
        priklad: 'Zameškanou lekci nedoháněj dvakrát za den. Nejvýš jedna lekce denně v každém předmětu.',
      },
      {
        nadpis: 'S rodičem',
        text: 'Úlohy řešíš ty. Rodič nic nepočítá ani nevysvětluje, jen se ptá otázkami, které vidí v telefonu. Říkej nahlas, co děláš a proč.',
        priklad: 'Rodič: „Co počítáš jako první?“ Ty: „Krát, protože má přednost před plus.“',
      },
      {
        nadpis: 'Dnes samo',
        text: 'Rodič dnes nemá čas? Domluv se s ním a zvol „Dnes samo“. Když se zasekneš, klikni na „Nevím, jak dál“. Úloha má nejvýš tři nápovědy, ber je postupně. U poslední úlohy lekce se otevřou až po prvním pokusu.',
        priklad: 'Nejdřív to zkus bez nápovědy, aspoň minutu. Pozor: po dvou lekcích samo zkus další zase s rodičem.',
      },
      {
        nadpis: 'Barva lekce',
        text: 'Zelená: zítra nová lekce. Oranžová: zítra 5 minut procvičit, pak nová lekce. Červená: dnes stačí, zítra znovu.',
        priklad: 'Červená není trest. Přijde stejná látka s jinými úlohami, ať to sedne.',
      },
      {
        nadpis: 'Tahák před lekcí naostro',
        text: 'Tahák tématu dostaneš, když dokončíš lekce 1–4 tématu. Pak tě v tématu ještě čekají dvě lekce naostro. Před každou si tahák na dvě minuty projdi.',
        priklad: 'Zakryj u jednoho bloku příklad a zkus ho spočítat nebo doplnit sám nebo sama. Pak zkontroluj.',
      },
    ],
  },
  {
    id: 'b:2027-03', mesic: '2027-03',
    nazev: 'Velký přehled vzorců',
    podnazev: 'Bonus za březnovou výzvu',
    bloky: [
      {
        nadpis: 'Počítání s čísly',
        text: 'Pořadí: závorky, krát a děleno, plus a mínus. Desetinná místa se při násobení sčítají. Minus krát minus je plus, odečíst záporné je přičíst.',
        priklad: '- $9 - 3 \\cdot 2 = 3$\n- $0{,}7 \\cdot 0{,}4 = 0{,}28$\n- $(-6) \\cdot (-3) = 18$, $1 - (-4) = 5$',
      },
      {
        nadpis: 'Zlomky',
        text: 'Sčítání a odčítání: společný jmenovatel. Násobení: čitatel krát čitatel, jmenovatel krát jmenovatel. Dělení: krát převrácený zlomek. Smíšené číslo nejdřív převeď na zlomek.',
        priklad: '- $\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}$, $\\frac{3}{5} \\cdot \\frac{2}{7} = \\frac{6}{35}$\n- $\\frac{4}{5} : \\frac{2}{3} = \\frac{4}{5} \\cdot \\frac{3}{2} = \\frac{6}{5}$\n- $1\\frac{5}{6} = \\frac{11}{6}$',
      },
      {
        nadpis: 'Převody jednotek',
        text: 'Délka po $10$ (mm, cm, dm, m), obsah po $100$, objem po $1\\,000$. Kilo je tisíc, $1\\ \\text{t} = 1\\,000\\ \\text{kg}$. $1\\ \\text{ha} = 100\\ \\text{a}$, $1\\ \\text{a} = 100\\ \\text{m}^2$, $1\\ \\text{dm}^3 = 1\\ \\text{l}$.',
        priklad: '- $4{,}2\\ \\text{km} = 4\\,200\\ \\text{m}$, $2{,}8\\ \\text{t} = 2\\,800\\ \\text{kg}$\n- $12\\ \\text{m}^2 = 1\\,200\\ \\text{dm}^2$, $9\\ \\text{dm}^3 = 9\\ \\text{l}$',
      },
      {
        nadpis: 'Rovinné útvary',
        text: 'Obdélník: $o = 2 \\cdot (a + b)$, $S = a \\cdot b$. Rovnoběžník: $S = a \\cdot v_a$. Trojúhelník: $S = \\frac{a \\cdot v_a}{2}$. Lichoběžník: $S = \\frac{(a + c) \\cdot v}{2}$. Součet úhlů v trojúhelníku: $180°$.',
        priklad: 'Lichoběžník $a = 7\\ \\text{cm}$, $c = 3\\ \\text{cm}$, $v = 4\\ \\text{cm}$: $S = \\frac{(7 + 3) \\cdot 4}{2} = 20\\ \\text{cm}^2$. Pozor: základny nejdřív sečti.',
      },
      {
        nadpis: 'Tělesa',
        text: 'Kvádr: $V = a \\cdot b \\cdot c$, povrch = součet obsahů šesti stěn (tři dvojice). Hranol: objem = obsah podstavy krát výška, povrch = dvě podstavy a plášť.',
        priklad: 'Kvádr $9\\ \\text{cm}$, $4\\ \\text{cm}$, $2\\ \\text{cm}$:\n\n- $V = 9 \\cdot 4 \\cdot 2 = 72\\ \\text{cm}^3$\n- $S = 2 \\cdot (36 + 8 + 18)$ $= 124\\ \\text{cm}^2$',
      },
      {
        nadpis: 'Poměr a procenta',
        text: 'Dělení v poměru: sečti díly, celek vyděl počtem dílů a vynásob. Měřítko $1 : 10\\,000$: $1\\ \\text{cm}$ na mapě je $100\\ \\text{m}$. Procento je setina celku.',
        priklad: '- $63$ v poměru $4 : 5$: díl $63 : 9 = 7$, části $28$ a $35$\n- $15\\,\\%$ z $60$ je $9$',
      },
    ],
  },
  {
    id: 'b:2027-04', mesic: '2027-04',
    nazev: 'Velký přehled pravopisu',
    podnazev: 'Bonus za dubnovou výzvu',
    bloky: [
      {
        nadpis: 'Vyjmenovaná slova',
        text: 'V kořeni slova po *b, l, m, p, s, v, z* píšeš *y* jen ve vyjmenovaných a příbuzných slovech. Předpona *vy-, vý-* má vždy *y*. Jinak v kořeni píšeš *i*.',
        priklad: '*pysk, sysel* · *vyprávět* · *síla, minulý* → *i*',
      },
      {
        nadpis: 'Koncovky jmen',
        text: 'Podstatné jméno: urči vzor a dosaď ho ve stejném pádě. Tvrdé přídavné jméno: *-í* jen u *ti*. Přivlastňovací: *ti* → *-ovi*, *ty* → *-ovy*, *ta* → *-ova*.',
        priklad: '*s rohlíky* (s hrady) · *ti hraví kocouři* · *ty dědečkovy svetry*',
      },
      {
        nadpis: 'Shoda',
        text: 'Podmět → *ti, ty, ta* → *-i, -y, -a*. Víc podmětů: když je mezi nimi *ti*, píšeš *-i*. *Děti* → *-y*, *lidé, rodiče* → *-i*.',
        priklad: '*Pes a dvě kočky spali.* · *Děti spaly.* · *Lidé vyprávěli.*',
      },
      {
        nadpis: 'Zájmena a slovesa',
        text: '*mně* = *tobě*, *mě* = *tebe*. *ji* = *Kláru* (4. pád), *jí* = *Kláře, Klárou*. Podmiňovací způsob: *bychom, byste*.',
        priklad: '*Pověz to mně, ne jemu.* · *Pochválil jsem ji.* · *Dal jsem jí hrnek.* · *Pomohli bychom.* Pozor: ne *bysme*.',
      },
      {
        nadpis: 'Pravopis na švu',
        text: 'Rozlož slovo na části. Na švu dvě stejné souhlásky píšeš obě. *s-* dolů, dohromady, *z-* změna. *bje, vje* jen na švu. *mně*, když je v příbuzném slově *mn* nebo *men*.',
        priklad: '*s|lézt* (dolů) · *z|hubnout* (změna) · *ob|jímat* (šev: *bje*)',
      },
      {
        nadpis: 'Čárky',
        text: 'Čárka odděluje vedlejší větu a členy výčtu, před *a* ve výčtu ne. Před spojkou *ale* čárku piš. Oslovení odděl čárkou.',
        priklad: '*Koupil jsem máslo, jablka a mléko.* · *Bylo pozdě, ale nikdo nespal.* · *Kláro, počkej!*',
      },
    ],
  },
  {
    id: 'b:2027-05', mesic: '2027-05',
    nazev: 'Co mě čeká v 9. třídě',
    podnazev: 'Bonus za květnovou výzvu',
    bloky: [
      {
        nadpis: 'Matematika jde dál',
        text: 'Mocniny, Pythagorovu větu, výrazy a rovnice se ve škole většinou učíš v 8. třídě. V 9. třídě s nimi budeš počítat skoro pořád a přibude nové učivo. Všechno to stojí na tom, co už umíš.',
        priklad: '- $4^2 = 4 \\cdot 4 = 16$. Pozor: ne $8$.\n- $x + 6 = 13$, tedy $x = 7$. Zkouška: $7 + 6 = 13$.',
      },
      {
        nadpis: 'Na čem to stojí',
        text: 'Zlomky, záporná čísla a pořadí operací budeš potřebovat skoro v každém příkladu. Čím jistěji je umíš teď, tím snáz půjde nové učivo.',
        priklad: 'Zlomek, záporné číslo i pořadí operací v jednom příkladu: $4 - \\frac{1}{2} \\cdot (-6) = 4 + 3 = 7$.',
      },
      {
        nadpis: 'Čeština: souvětí a sloh',
        text: 'V češtině tě čeká podrobnější rozbor souvětí: druhy vedlejších vět a vztahy mezi větami, i ve složitějších souvětích. Budeš psát i delší slohové práce.',
        priklad: '*Napíšu ti, až dorazím.* Čárku i větu hlavní a vedlejší už poznáš. Teď k tomu přidáš, o jakou vedlejší větu jde.',
      },
      {
        nadpis: 'Kam po základní škole',
        text: 'V 9. třídě se rozhoduješ, kam dál. Na obory s maturitou se skládá přijímací zkouška z češtiny a matematiky.',
        priklad: 'Už teď si můžeš s rodiči zjistit, které školy tě lákají a co se na nich učí.',
      },
      {
        nadpis: 'Léto bez stresu',
        text: 'O prázdninách hlavně odpočívej. Stačí občas krátké opakování: jeden tahák nebo pár příkladů týdně.',
        priklad: 'Vytiskni si odemčené taháky. Koncem prázdnin si projdi ty z témat, která šla nejhůř.',
      },
    ],
  },
];
