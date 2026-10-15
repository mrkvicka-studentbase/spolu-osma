// =====================================================================
// web/js/tahaky-matematika.js — taháky matematiky Spolu 8 (R78). Jeden tahák na téma (= `tyden` v katalogu, 1–10).
// Odemkne se dokončením všech učebních lekcí tématu (L1–L4); naostro a B-varianty se nepočítají (tahaky.js).
// Obsah podle predani/2026-10-09-odznaky-a-tahaky/TAHAKY-OSMA.md: 3–6 bloků { nadpis, text, priklad? },
// markdown + KaTeX ($…$), zpětné lomítko v LaTeXu je v JS řetězci zdvojené. Pravidla stejnými slovy jako
// `uvod_pravidla` a taháky lekcí tématu; příklady mají vlastní čísla (nejsou v úlohách lekcí L, N, B, NB ani
// v úvodním a pololetním testu) a jsou přepočítané. Kód se při plnění nemění;
// id, predmet, faze a tyden neměnit (podle nich se tahák odemyká a pamatuje).
// =====================================================================
export const TAHAKY_MATEMATIKA = Object.freeze([
  // téma 1: M8-T01-L1, M8-T01-L1N, M8-T01-L2, M8-T01-L2N, M8-T01-L3, M8-T01-L3N, M8-T01-L4, M8-T01-L4N
  {
    id: 't:matematika:osma:1', predmet: 'matematika', faze: 'osma', tyden: 1,
    nazev: 'Přirozená čísla a dělitelnost',
    podnazev: 'Téma 1',
    bloky: [
      {
        nadpis: 'Pořadí operací',
        text: 'Krát a děleno mají přednost před plus a mínus. Krát a děleno jsou si rovné: počítej je **zleva**. Stejně plus a mínus mezi sebou.',
        priklad: '$70 - 30 : 5 \\cdot 3$ $= 70 - 6 \\cdot 3$ $= 70 - 18 = 52$.\n\nPozor: nejdřív $5 \\cdot 3$ je chyba, vyšlo by $68$.',
      },
      {
        nadpis: 'Závorky v sobě',
        text: 'Závorky počítej **zevnitř ven**: nejdřív kulatou, pak hranatou. Celou závorku spočítej dřív, než s ní násobíš nebo dělíš.',
        priklad: '$[(9 - 4) \\cdot 6 + 2] : 4$\n\n$= [5 \\cdot 6 + 2] : 4$ $= 32 : 4 = 8$.',
      },
      {
        nadpis: 'Znaky dělitelnosti',
        text: '- $2$, $5$, $10$: podle poslední číslice\n- $4$: podle posledního dvojčíslí\n- $3$, $9$: podle součtu číslic\n- $6$: dělitelné dvěma **i** třemi zároveň',
        priklad: '$2\\,856$: $56 = 4 \\cdot 14$, dělitelné čtyřmi. $2 + 8 + 5 + 6 = 21$: třemi ano, devíti ne. Je sudé, takže i šesti.\n\nPozor: $538$ končí osmičkou, ale $38$ čtyřmi dělitelné není.',
      },
      {
        nadpis: 'Prvočísla a rozklad',
        text: 'Prvočíslo má jen dva dělitele: jedničku a sebe. Jednička prvočíslo není. Rozklad: děl postupně nejmenšími prvočísly. Které prvočíslo použiješ víckrát, píšeš víckrát.',
        priklad: '$220 = 2 \\cdot 2 \\cdot 5 \\cdot 11$.\n\nPozor: $119$ je liché, a přesto není prvočíslo: $119 = 7 \\cdot 17$.',
      },
      {
        nadpis: 'Společný dělitel a násobek',
        text: '$D(a, b)$ je největší číslo, které dělí obě čísla. $n(a, b)$ je nejmenší číslo, které jde vydělit oběma. Z rozkladů: do $n$ vezmi každé prvočíslo tolikrát, kolikrát je ho nejvíc v jednom rozkladu.',
        priklad: '$52 = 2 \\cdot 2 \\cdot 13$, $78 = 2 \\cdot 3 \\cdot 13$\n\n$D(52, 78) = 2 \\cdot 13 = 26$\n\n$n(52, 78) = 2 \\cdot 2 \\cdot 3 \\cdot 13 = 156$',
      },
      {
        nadpis: 'Dělit, nebo opakovat?',
        text: '„Co nejvíc stejných balíčků, nic nezbude“ nebo „co nejdelší stejné kusy“: hledáš **dělitel**. „Za jak dlouho zase současně“: hledáš **násobek**. Společný dělitel je nejvýš tak velký jako menší číslo, společný násobek aspoň tak velký jako větší.',
        priklad: '$15$ jablek a $35$ ořechů do co nejvíc stejných sáčků: $D(15, 35) = 5$ sáčků.\n\nDva cyklisti objedou okruh za $9$ a $15$ minut. Na startu se znovu potkají za $n(9, 15) = 45$ minut.\n\nPozor: násobek není vždy součin, tady ne $135$.',
      },
    ],
  },
  // téma 2: M8-T02-L1, M8-T02-L1N, M8-T02-L2, M8-T02-L2N, M8-T02-L3, M8-T02-L3N, M8-T02-L4, M8-T02-L4N
  {
    id: 't:matematika:osma:2', predmet: 'matematika', faze: 'osma', tyden: 2,
    nazev: 'Desetinná čísla',
    podnazev: 'Téma 2',
    bloky: [
      {
        nadpis: 'Porovnání po řádech',
        text: 'Porovnávej po řádech: nejdřív celé, pak desetiny, pak setiny. Nuly na konci nic nemění, klidně je doplň. Delší zápis neznamená větší číslo.',
        priklad: '$0{,}7 > 0{,}69$, protože $0{,}70 > 0{,}69$.\n\nPozor: $2{,}305 < 2{,}35$, i když má víc číslic.',
      },
      {
        nadpis: 'Zaokrouhlení',
        text: 'Rozhoduje číslice hned za místem, na které zaokrouhluješ. $0$ až $4$: dolů, číslice zůstane. $5$ až $9$: nahoru, zvětši ji o jednu. Na koruny zaokrouhluješ na celé.',
        priklad: '$8{,}735$: na celé $9$, na desetiny $8{,}7$, na setiny $8{,}74$.\n\nPozor: useknout na $8{,}73$ je chyba.',
      },
      {
        nadpis: 'Plus a mínus pod sebou',
        text: 'Čísla piš pod sebe, **čárka pod čárku**. Prázdná místa doplň nulami. Celé číslo má čárku za poslední číslicí, i když se nepíše.',
        priklad: '$9 - 2{,}75 = 9{,}00 - 2{,}75 = 6{,}25$\n\n$5{,}3 + 0{,}46 = 5{,}76$, ne $0{,}99$.',
      },
      {
        nadpis: 'Krát a děleno 10, 100, 1 000',
        text: 'Krát: čárka **doprava**. Děleno: čárka **doleva**. O tolik míst, kolik nul má $10$, $100$ nebo $1\\,000$. Chybějící místa doplň nulami.',
        priklad: '$4{,}7 \\cdot 1\\,000 = 4\\,700$, $\\ 63 : 100 = 0{,}63$, $\\ 0{,}9 : 10 = 0{,}09$.\n\nPozor: $4{,}7 \\cdot 100$ není $4{,}700$, ale $470$. Jen připsat nuly nestačí.',
      },
      {
        nadpis: 'Násobení desetinných čísel',
        text: 'Vynásob čísla bez čárek. Desetinná místa obou čísel se sčítají: tolik míst odděl ve výsledku zprava.',
        priklad: '$1{,}3 \\cdot 0{,}4$: $13 \\cdot 4 = 52$, místa $1 + 1 = 2$, tedy $0{,}52$.\n\nPozor: $0{,}6 \\cdot 0{,}03 = 0{,}018$ (tři místa), ne $0{,}18$.',
      },
      {
        nadpis: 'Dělení desetinným číslem',
        text: 'Posuň čárku **u obou čísel** o stejný počet míst doprava, až dělíš celým číslem. Výsledek se nezmění. Když dělení nevyjde, dělí se dál za čárkou.',
        priklad: '$3{,}2 : 0{,}04 = 320 : 4 = 80$\n\n$7 : 8 = 0{,}875$',
      },
    ],
  },
  // téma 3: M8-T03-L1, M8-T03-L1N, M8-T03-L2, M8-T03-L2N, M8-T03-L3, M8-T03-L3N, M8-T03-L4, M8-T03-L4N
  {
    id: 't:matematika:osma:3', predmet: 'matematika', faze: 'osma', tyden: 3,
    nazev: 'Jednotky, obvod a obsah',
    podnazev: 'Téma 3',
    bloky: [
      {
        nadpis: 'Délka a hmotnost',
        text: 'Na menší jednotku násob, na větší děl. Čárku posuň o tolik míst, kolik nul má převodní číslo.\n- $1\\ \\text{km} = 1\\,000\\ \\text{m}$, $1\\ \\text{m} = 100\\ \\text{cm}$\n- $1\\ \\text{dm} = 10\\ \\text{cm}$, $1\\ \\text{cm} = 10\\ \\text{mm}$\n- $1\\ \\text{t} = 1\\,000\\ \\text{kg}$, $1\\ \\text{kg} = 1\\,000\\ \\text{g}$',
        priklad: '$3{,}2\\ \\text{km} = 3\\,200\\ \\text{m}$, $\\ 2\\,750\\ \\text{g} = 2{,}75\\ \\text{kg}$\n\nPozor: $45\\ \\text{cm} = 0{,}45\\ \\text{m}$, ne $4{,}5\\ \\text{m}$. Metr má sto centimetrů.',
      },
      {
        nadpis: 'Obsah: po stu',
        text: 'Mezi sousedními jednotkami obsahu je vždy sto, ne deset. Čárka se posune o dvě místa na každý krok.\n- $1\\ \\text{m}^2 = 100\\ \\text{dm}^2$\n- $1\\ \\text{dm}^2 = 100\\ \\text{cm}^2$',
        priklad: '$7\\ \\text{dm}^2 = 700\\ \\text{cm}^2$\n\n$0{,}65\\ \\text{m}^2 = 65\\ \\text{dm}^2 = 6\\,500\\ \\text{cm}^2$',
      },
      {
        nadpis: 'Ar a hektar',
        text: '- $1\\ \\text{a} = 100\\ \\text{m}^2$\n- $1\\ \\text{ha} = 100\\ \\text{a} = 10\\,000\\ \\text{m}^2$',
        priklad: '$1{,}5\\ \\text{ha} = 150\\ \\text{a} = 15\\,000\\ \\text{m}^2$\n\nPozor: hektar není tisíc metrů čtverečních, je to sto krát sto.',
      },
      {
        nadpis: 'Obvod a obsah obdélníku',
        text: 'Obvod $o$ je délka okraje, sečti všechny čtyři strany: $o = 2 \\cdot (a + b)$. Obsah $S$ je plocha uvnitř: $S = a \\cdot b$, v jednotkách s malou dvojkou.',
        priklad: 'Strany $6$ m a $5$ m: $o = 2 \\cdot (6 + 5) = 22\\ \\text{m}$, $S = 6 \\cdot 5 = 30\\ \\text{m}^2$.\n\nPozor: $6 + 5 = 11$ jsou jen dvě strany, ne obvod.',
      },
      {
        nadpis: 'Strana z obvodu, složený útvar',
        text: 'Polovina obvodu je jedna strana plus druhá. Složený útvar rozděl na obdélníky, obsahy spočítej zvlášť a sečti. Výřez (okno, dveře) odečti.',
        priklad: '$o = 34\\ \\text{m}$, $a = 12\\ \\text{m}$: $34 : 2 = 17$, $b = 17 - 12 = 5\\ \\text{m}$.\n\nStěna $8 \\cdot 3 = 24\\ \\text{m}^2$ bez dveří $1 \\cdot 2 = 2\\ \\text{m}^2$: zbude $22\\ \\text{m}^2$.',
      },
      {
        nadpis: 'Nejdřív stejné jednotky',
        text: 'Než začneš počítat, převeď všechny délky na stejnou jednotku. Výsledek napiš v jednotce, na kterou se úloha ptá.',
        priklad: 'Strany $3$ m a $45$ cm: $45\\ \\text{cm} = 0{,}45\\ \\text{m}$, $S = 3 \\cdot 0{,}45 = 1{,}35\\ \\text{m}^2$.\n\nPozor: $3 \\cdot 45 = 135$ násobí metry s centimetry.',
      },
    ],
  },
  // téma 4: M8-T04-L1, M8-T04-L1N, M8-T04-L2, M8-T04-L2N, M8-T04-L3, M8-T04-L3N, M8-T04-L4, M8-T04-L4N
  {
    id: 't:matematika:osma:4', predmet: 'matematika', faze: 'osma', tyden: 4,
    nazev: 'Zlomky I',
    podnazev: 'Téma 4',
    bloky: [
      {
        nadpis: 'Krácení',
        text: 'Čitatel i jmenovatel vyděl **stejným** číslem. Krať, dokud to jde. Zlomek, který už zkrátit nejde, je v základním tvaru.',
        priklad: '$\\frac{27}{63} = \\frac{3}{7}$ (obojí děleno devíti).\n\nPozor: $\\frac{54}{72} = \\frac{27}{36}$ ještě není základní tvar. Až $\\frac{27}{36} = \\frac{3}{4}$.',
      },
      {
        nadpis: 'Rozšiřování',
        text: 'Čitatel i jmenovatel vynásob **stejným** číslem. Nic nepřičítej.',
        priklad: '$\\frac{2}{9} = \\frac{?}{63}$: $63 : 9 = 7$, takže $\\frac{2 \\cdot 7}{9 \\cdot 7} = \\frac{14}{63}$.\n\nPozor: přičíst $54$ nahoře i dole je chyba.',
      },
      {
        nadpis: 'Porovnání zlomků',
        text: 'Stejný čitatel: víc dílů, menší díl. Jinak převeď zlomky na stejný jmenovatel a porovnej čitatele.',
        priklad: '$\\frac{1}{9} < \\frac{1}{4}$\n\n$\\frac{5}{9} = \\frac{35}{63}$ a $\\frac{4}{7} = \\frac{36}{63}$, takže $\\frac{5}{9} < \\frac{4}{7}$.\n\nPozor: větší jmenovatel neznamená větší zlomek.',
      },
      {
        nadpis: 'Zlomek a desetinné číslo',
        text: 'Zlomková čára je dělení: čitatel děleno jmenovatelem. Desetiny a setiny se dají zapsat rovnou.',
        priklad: '$\\frac{3}{8} = 3 : 8 = 0{,}375$\n\n$\\frac{17}{50} = \\frac{34}{100} = 0{,}34$',
      },
      {
        nadpis: 'Sčítání a odčítání',
        text: 'Sčítat a odčítat jde jen stejné díly. Převeď zlomky na stejný jmenovatel, pak sečti nebo odečti **jen čitatele**. Jmenovatel zůstane. Nakonec zkrať.',
        priklad: '$\\frac{1}{5} + \\frac{1}{2} = \\frac{2}{10} + \\frac{5}{10} = \\frac{7}{10}$\n\nPozor: ne dvě sedminy, jmenovatele se nesčítají.',
      },
      {
        nadpis: 'Zbytek do celku',
        text: 'Celek je jednička: tolik dílů, kolik je ve jmenovateli. Zbytek do celku spočítáš odečtením od jedničky.',
        priklad: '$1 - \\frac{4}{11} = \\frac{11}{11} - \\frac{4}{11} = \\frac{7}{11}$',
      },
    ],
  },
  // téma 5: M8-T05-L1, M8-T05-L1N, M8-T05-L2, M8-T05-L2N, M8-T05-L3, M8-T05-L3N, M8-T05-L4, M8-T05-L4N
  {
    id: 't:matematika:osma:5', predmet: 'matematika', faze: 'osma', tyden: 5,
    nazev: 'Zlomky II',
    podnazev: 'Téma 5',
    bloky: [
      {
        nadpis: 'Násobení zlomků',
        text: 'Čitatel krát čitatel, jmenovatel krát jmenovatel. Před násobením zkrať, co jde. Celé číslo násobí jen čitatel.',
        priklad: '$\\frac{5}{6} \\cdot \\frac{9}{10} = \\frac{1}{2} \\cdot \\frac{3}{2} = \\frac{3}{4}$\n\nPozor: $3 \\cdot \\frac{2}{7} = \\frac{6}{7}$, ne $\\frac{6}{21}$.',
      },
      {
        nadpis: 'Zlomek z čísla',
        text: 'Vyděl jmenovatelem (dole), vynásob čitatelem (nahoře). Když se úloha ptá na část **zbytku**, nejdřív spočítej zbytek.',
        priklad: 'Tři sedminy z $42$: $42 : 7 \\cdot 3 = 18$.\n\nZ $96$ bonbonů sníš čtvrtinu, tedy $24$. Zbude $72$ a dvě třetiny zbytku jsou $48$.\n\nPozor: ne $64$, to by byly dvě třetiny ze všech.',
      },
      {
        nadpis: 'Dělení zlomkem',
        text: 'Převrácené číslo vznikne prohozením čitatele a jmenovatele. Dělit zlomkem znamená násobit převráceným zlomkem. Převrací se jen ten za dvojtečkou.',
        priklad: '$\\frac{4}{5} : \\frac{2}{3} = \\frac{4}{5} \\cdot \\frac{3}{2} = \\frac{6}{5}$\n\nPozor: převrácené číslo je $\\frac{2}{3} \\to \\frac{3}{2}$, ne minus dvě třetiny.',
      },
      {
        nadpis: 'Dlouhá zlomková čára',
        text: 'Dlouhá čára znamená děleno: horní patro děleno dolním. Když je v patře součet, spočítej ho nejdřív.',
        priklad: '$\\dfrac{\\frac{2}{3}}{\\frac{8}{9}} = \\frac{2}{3} \\cdot \\frac{9}{8} = \\frac{3}{4}$',
      },
      {
        nadpis: 'Smíšené číslo',
        text: 'Na zlomek: celé krát jmenovatel plus čitatel, jmenovatel zůstane. Zpět: vyděl, zbytek zůstane nahoře.',
        priklad: '$2\\frac{4}{7} = \\frac{2 \\cdot 7 + 4}{7} = \\frac{18}{7}$\n\n$\\frac{41}{9} = 4\\frac{5}{9}$ ($41 : 9 = 4$, zbytek $5$)',
      },
      {
        nadpis: 'Počítání se smíšenými čísly',
        text: 'Před násobením a dělením převeď smíšená čísla na zlomky, nenásob po částech. Při odčítání si můžeš rozměnit jednu celou.',
        priklad: '$1\\frac{1}{2} \\cdot 2\\frac{1}{3} = \\frac{3}{2} \\cdot \\frac{7}{3} = \\frac{7}{2} = 3\\frac{1}{2}$\n\n$4\\frac{1}{5} - 1\\frac{3}{5} = 3\\frac{6}{5} - 1\\frac{3}{5} = 2\\frac{3}{5}$\n\nPozor: ne $1 \\cdot 2$ a $\\frac{1}{2} \\cdot \\frac{1}{3}$ zvlášť.',
      },
    ],
  },
  // téma 6: M8-T06-L1, M8-T06-L1N, M8-T06-L2, M8-T06-L2N, M8-T06-L3, M8-T06-L3N, M8-T06-L4, M8-T06-L4N
  {
    id: 't:matematika:osma:6', predmet: 'matematika', faze: 'osma', tyden: 6,
    nazev: 'Celá a racionální čísla',
    podnazev: 'Téma 6',
    bloky: [
      {
        nadpis: 'Na číselné ose',
        text: 'Na ose je vpravo vždy větší číslo. Ze dvou záporných je větší to, které je blíž nule.',
        priklad: '$-2 > -9$, $\\ -0{,}5 > -3$\n\nPozor: $-9$ je menší než $-2$, i když $9 > 2$. Při mínus devíti je větší zima.',
      },
      {
        nadpis: 'Opačné číslo a absolutní hodnota',
        text: 'Opačné číslo leží na druhé straně nuly, stejně daleko. Absolutní hodnota je vzdálenost od nuly, nikdy nevyjde záporná.',
        priklad: 'Opačné k $-4{,}5$ je $4{,}5$.\n\n$\\lvert -17 \\rvert = 17$, $\\ \\lvert 3 - 8 \\rvert = \\lvert -5 \\rvert = 5$',
      },
      {
        nadpis: 'Plus a mínus',
        text: 'Představ si teploměr: plus je posun nahoru (na ose doprava), mínus posun dolů (doleva). Přes nulu klidně jdi do minusu.',
        priklad: '$-8 + 3 = -5$, $\\ 5 - 9 = -4$, $\\ -3 - 5 = -8$',
      },
      {
        nadpis: 'Odečíst záporné číslo',
        text: 'Odečíst záporné číslo je totéž jako ho přičíst: dva minusy vedle sebe dají plus. Přičíst záporné číslo je totéž jako odečíst.',
        priklad: '$2 - (-7) = 2 + 7 = 9$\n\n$4 + (-6) = 4 - 6 = -2$\n\nPozor: $-8 - (-2) = -8 + 2 = -6$, ne $-10$.',
      },
      {
        nadpis: 'Krát a děleno: znaménko',
        text: 'Stejná znaménka dají plus, různá minus. U víc čísel spočítej záporná: sudý počet dá plus, lichý minus.',
        priklad: '$(-6) \\cdot (-3) = 18$, $\\ (-32) : 8 = -4$\n\n$(-2) \\cdot (-2) \\cdot (-5) = -20$\n\nPozor: $(-36) : (-9) = 4$, ne $-4$.',
      },
      {
        nadpis: 'Delší příklad',
        text: 'Nejdřív krát a děleno zleva, pak plus a mínus. U každého mezivýsledku hlídej znaménko.',
        priklad: '$(-4) \\cdot 3 - 20 : (-5)$\n\n$= -12 - (-4) = -12 + 4 = -8$',
      },
    ],
  },
  // téma 7: M8-T07-L1, M8-T07-L1N, M8-T07-L2, M8-T07-L2N, M8-T07-L3, M8-T07-L3N, M8-T07-L4, M8-T07-L4N
  {
    id: 't:matematika:osma:7', predmet: 'matematika', faze: 'osma', tyden: 7,
    nazev: 'Úhly, trojúhelníky, souměrnost',
    podnazev: 'Téma 7',
    bloky: [
      {
        nadpis: 'Úhly na přímce a v rovnoběžníku',
        text: 'Vedlejší úhly leží vedle sebe na přímce, dohromady mají $180°$. Vrcholové úhly jsou naproti přes průsečík a jsou stejné. V rovnoběžníku dají dva úhly u jedné strany $180°$ a úhly naproti sobě jsou stejné.',
        priklad: 'K úhlu $67°$ je vedlejší $180° - 67° = 113°$, vrcholový $67°$.\n\nRovnoběžník s úhlem $67°$ má úhly $67°$, $113°$, $67°$, $113°$.',
      },
      {
        nadpis: 'Úhly v trojúhelníku',
        text: 'Součet úhlů trojúhelníku je $180°$. Třetí úhel dostaneš, když od $180°$ odečteš oba známé.',
        priklad: '$\\alpha = 39°$, $\\beta = 86°$: $\\gamma = 180° - 39° - 86° = 55°$.\n\nPozor: $125°$ je jen součet dvou úhlů, ne třetí úhel.',
      },
      {
        nadpis: 'Stupně a minuty',
        text: 'Stupeň má šedesát minut, ne sto: $1° = 60\'$. Když minut vyjde $60$ a víc, převeď $60\'$ na $1°$. Při odčítání si rozměň $1°$ na $60\'$.',
        priklad: '$28°35\' + 44°50\'$ $= 72°85\'$ $= 73°25\'$\n\n$180° - 73°25\'$ $= 179°60\' - 73°25\'$ $= 106°35\'$',
      },
      {
        nadpis: 'Kdy vznikne trojúhelník',
        text: 'Ze tří stran složíš trojúhelník, jen když jsou dvě kratší strany dohromady **delší** než nejdelší. Stejně dlouhé nestačí.',
        priklad: '$3$, $8$, $11$ cm: $3 + 8 = 11$, trojúhelník nevznikne, strany leží naplocho.\n\n$4$, $8$, $11$ cm: $4 + 8 = 12 > 11$, vznikne.',
      },
      {
        nadpis: 'Osová a středová souměrnost',
        text: '**Osová:** překlopení přes osu. Po přeložení podle osy se obě půlky kryjí. **Středová:** otočení kolem středu $S$ o půl otáčky. Útvar vypadá vzhůru nohama stejně.',
        priklad: 'Písmeno A má jednu svislou osu.\n\nPísmeno N osu nemá, ale je středově souměrné.',
      },
      {
        nadpis: 'Obsah rovnoběžníku, trojúhelníku, lichoběžníku',
        text: '- rovnoběžník: $S = a \\cdot v_a$\n- trojúhelník: $S = \\frac{a \\cdot v_a}{2}$\n- lichoběžník: $S = \\frac{(a + c) \\cdot v}{2}$\n\nVýška dopadá na svou stranu kolmo. Šikmá strana výška není.',
        priklad: 'Trojúhelník $a = 11$ cm, $v_a = 6$ cm: $S = \\frac{11 \\cdot 6}{2} = 33\\ \\text{cm}^2$.\n\nLichoběžník $a = 15$, $c = 7$, $v = 4$ cm: $S = \\frac{22 \\cdot 4}{2} = 44\\ \\text{cm}^2$.\n\nPozor: k výšce patří jen strana, na kterou kolmo dopadá.',
      },
    ],
  },
  // téma 8: M8-T08-L1, M8-T08-L1N, M8-T08-L2, M8-T08-L2N, M8-T08-L3, M8-T08-L3N, M8-T08-L4, M8-T08-L4N
  {
    id: 't:matematika:osma:8', predmet: 'matematika', faze: 'osma', tyden: 8,
    nazev: 'Poměr, měřítko, úměrnost',
    podnazev: 'Téma 8',
    bloky: [
      {
        nadpis: 'Krácení poměru',
        text: 'Poměr krátíš jako zlomek: oba členy vyděl stejným číslem. Pořadí určuje věta: co je ve větě první, je první i v poměru.',
        priklad: '$18 : 24 = 3 : 4$ (obojí děleno šesti).\n\nPozor: „dívek ku chlapcům“ začíná dívkami, ne naopak.',
      },
      {
        nadpis: 'Dělení v poměru',
        text: 'Sečti díly. Celek vyděl počtem dílů, to je jeden díl. Pak každou část vynásob jejím počtem dílů.',
        priklad: '$252$ Kč v poměru $5 : 7$: $5 + 7 = 12$ dílů, $252 : 12 = 21$ Kč.\n\nČásti: $5 \\cdot 21 = 105$ Kč a $7 \\cdot 21 = 147$ Kč.',
      },
      {
        nadpis: 'Zvětšit a zmenšit v poměru',
        text: 'Zvětšit v poměru $5 : 4$: číslo rozděl na $4$ díly a vezmi $5$. Zmenšit v poměru $2 : 3$: rozděl na $3$ díly a vezmi $2$.',
        priklad: '$32$ zvětšené v poměru $5 : 4$: $32 : 4 \\cdot 5 = 40$\n\n$33$ zmenšené v poměru $2 : 3$: $33 : 3 \\cdot 2 = 22$',
      },
      {
        nadpis: 'Měřítko mapy',
        text: 'Měřítko $1 : 70\\,000$: $1$ cm na mapě je $70\\,000$ cm ve skutečnosti. Z mapy do skutečnosti násob, ze skutečnosti na mapu děl. Pak převeď: $1\\ \\text{m} = 100\\ \\text{cm}$, $1\\ \\text{km} = 100\\,000\\ \\text{cm}$.',
        priklad: '$3$ cm na mapě: $3 \\cdot 70\\,000 = 210\\,000$ cm $= 2{,}1$ km.\n\n$4{,}2$ km $= 420\\,000$ cm, na mapě $420\\,000 : 70\\,000 = 6$ cm.\n\nPozor: kilometr má sto tisíc centimetrů.',
      },
      {
        nadpis: 'Přímá, nebo nepřímá?',
        text: 'Nejdřív rozhodni. **Přímá** úměrnost: kolikrát víc jednoho, tolikrát víc druhého. **Nepřímá**: kolikrát víc jednoho, tolikrát míň druhého. U přímé počítej přes jeden kus.',
        priklad: '$6$ lístků stojí $132$ Kč, $1$ lístek $22$ Kč, $9$ lístků $198$ Kč (přímá).',
      },
      {
        nadpis: 'Nepřímá úměrnost',
        text: 'Celek (práce, počet stran) zůstává stejný. Spočítej ho jako součin a vyděl novým počtem.',
        priklad: 'Při $14$ stranách denně přečteš knihu za $12$ dní. Kniha má $14 \\cdot 12 = 168$ stran. Při $21$ stranách denně: $168 : 21 = 8$ dní.\n\nPozor: víc stran denně, míň dní.',
      },
    ],
  },
  // téma 9: M8-T09-L1, M8-T09-L1N, M8-T09-L2, M8-T09-L2N, M8-T09-L3, M8-T09-L3N, M8-T09-L4, M8-T09-L4N
  {
    id: 't:matematika:osma:9', predmet: 'matematika', faze: 'osma', tyden: 9,
    nazev: 'Procenta a úrok',
    podnazev: 'Téma 9',
    bloky: [
      {
        nadpis: 'Procento je setina',
        text: 'Jedno procento je setina celku: celek vyděl **stem**. Z jednoho procenta spočítáš jakýkoli počet procent.',
        priklad: '$1\\,\\%$ z $460$ je $4{,}6$, takže $20\\,\\%$ je $20 \\cdot 4{,}6 = 92$.\n\nPozor: děleno deseti dá $10\\,\\%$, ne $1\\,\\%$.',
      },
      {
        nadpis: 'Rychlé zkratky',
        text: '- $10\\,\\%$ je desetina\n- $25\\,\\%$ je čtvrtina\n- $50\\,\\%$ je polovina\n- $100\\,\\%$ je celek',
        priklad: '$10\\,\\%$ z $170$ je $17$, $\\ 25\\,\\%$ z $170$ je $42{,}5$.\n\nZbytek do sta procent: $100\\,\\% - 62\\,\\% = 38\\,\\%$.',
      },
      {
        nadpis: 'Kolik procent?',
        text: 'Část vyděl celkem a převeď na procenta. Celek je to, z čeho se procenta berou.',
        priklad: '$22$ z $55$: $22 : 55 = 0{,}4 = 40\\,\\%$.\n\nPozor: $0{,}4$ ještě nejsou procenta.',
      },
      {
        nadpis: 'Celek z části',
        text: 'Znáš část a víš, kolik je to procent? Jdi zpět přes jedno procento, pak krát sto. Když je část méně než $100\\,\\%$, celek vyjde větší.',
        priklad: '$60\\,\\%$ je $87$: $\\ 1\\,\\%$ je $87 : 60 = 1{,}45$, celek je $1{,}45 \\cdot 100 = 145$.',
      },
      {
        nadpis: 'Sleva a zdražení',
        text: 'Pozor na malé slovo „o“. Procenta spočítej z ceny, pak je u zdražení přičti, u slevy odečti. Druhou změnu počítej z nové ceny.',
        priklad: 'Boty $860$ Kč, sleva o $15\\,\\%$: $129$ Kč, nová cena $731$ Kč.\n\n$800 \\to 880 \\to 792$: o $10\\,\\%$ nahoru a pak o $10\\,\\%$ dolů nedá zpátky $800$.',
      },
      {
        nadpis: 'Úrok',
        text: 'Roční úrok je procento z vkladu za celý rok. Za kratší dobu dostaneš jen část: za půl roku polovinu, za čtvrt roku čtvrtinu.',
        priklad: 'Vklad $7\\,000$ Kč, úrok $2\\,\\%$ ročně: za rok $140$ Kč, za $6$ měsíců $70$ Kč.',
      },
    ],
  },
  // téma 10: M8-T10-L1, M8-T10-L1N, M8-T10-L2, M8-T10-L2N, M8-T10-L3, M8-T10-L3N, M8-T10-L4, M8-T10-L4N
  {
    id: 't:matematika:osma:10', predmet: 'matematika', faze: 'osma', tyden: 10,
    nazev: 'Tělesa a slovní úlohy',
    podnazev: 'Téma 10',
    bloky: [
      {
        nadpis: 'Povrch kvádru a krychle',
        text: 'Povrch je plocha všech stěn. Kvádr má šest stěn, vždy dvě stejné naproti sobě. Krychle má šest stejných čtverců. Když stěna chybí (víko), odečti ji.',
        priklad: 'Kvádr $9$, $4$, $3$ cm: $S = 2 \\cdot (36 + 27 + 12) = 150\\ \\text{cm}^2$.\n\nBez víka $9 \\times 4$: $150 - 36 = 114\\ \\text{cm}^2$.',
      },
      {
        nadpis: 'Objem',
        text: 'Objem říká, kolik krychliček se do tělesa vejde. Kvádr: $V = a \\cdot b \\cdot c$, krychle: $V = a \\cdot a \\cdot a$. Jednotka má malou trojku.',
        priklad: 'Kvádr $9$, $4$, $3$ cm: $V = 9 \\cdot 4 \\cdot 3 = 108\\ \\text{cm}^3$.\n\nPozor: $9 + 4 + 3$ objem není.',
      },
      {
        nadpis: 'Objem v litrech',
        text: '- $1\\ \\text{dm}^3 = 1$ l\n- $1\\ \\text{m}^3 = 1\\,000$ l\n- $1$ l $= 1\\,000\\ \\text{cm}^3$\n\nRozměry převeď na decimetry, objem pak vyjde rovnou v litrech.',
        priklad: 'Akvárium $60 \\times 45 \\times 30$ cm: $6 \\cdot 4{,}5 \\cdot 3 = 81\\ \\text{dm}^3 = 81$ l.\n\nPozor: $450\\ \\text{cm}^3$ je $0{,}45$ l, ne $4{,}5$ l.',
      },
      {
        nadpis: 'Objem hranolu',
        text: 'Podstavy jsou dvě stejné stěny naproti sobě. U ležícího hranolu jsou vpředu a vzadu, ne dole. Objem: podstava krát výška hranolu.',
        priklad: 'Podstava trojúhelník se stranou $10$ cm a výškou $7$ cm: $\\frac{10 \\cdot 7}{2} = 35\\ \\text{cm}^2$.\n\nHranol dlouhý $9$ cm: $V = 35 \\cdot 9 = 315\\ \\text{cm}^3$.',
      },
      {
        nadpis: 'Povrch hranolu',
        text: 'Plášť jsou boční stěny: $S_{pl}$ = obvod podstavy krát výška hranolu. Povrch: dvě podstavy a plášť.',
        priklad: 'Podstava: strany $24$, $13$, $13$ cm, výška na stranu $24$ je $5$ cm, obsah $\\frac{24 \\cdot 5}{2} = 60$, obvod $50$. Výška hranolu $7$ cm:\n\n$S_{pl} = 50 \\cdot 7 = 350$, $\\ S = 2 \\cdot 60 + 350 = 470\\ \\text{cm}^2$',
      },
      {
        nadpis: 'Tělesa ve slovních úlohách',
        text: 'Přečti, na co se úloha ptá: kolik vody v nádrži je, nebo kolik chybí do plna. Počítej s výškou vody, ne nádrže. Procenta a zlomky ber z celého objemu.',
        priklad: 'Nádrž $500$ l, plná z $30\\,\\%$: vody je $150$ l, do plna chybí $350$ l.',
      },
    ],
  },
]);
