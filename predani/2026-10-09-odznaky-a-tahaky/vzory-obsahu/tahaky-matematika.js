// web/js/tahaky-matematika.js — taháky z matematiky (R78). Obsah: metodik, review vedoucí.
// Jeden tahák na týden (pilot 1, Fáze 1 týdny 1–8, Fáze 2 týdny 1–11). Odemkne se dokončením všech lekcí týdne.
// text a priklad jsou markdown s KaTeXem (md() z rodic-karta.js); zpětné lomítko v LaTeXu je v JS řetězci zdvojené.
// Příklady mají vlastní čísla, nejsou klíčem k úlohám lekcí.
export const TAHAKY_MATEMATIKA = Object.freeze([
  {
    id: 't:matematika:pilot:1', predmet: 'matematika', faze: 'pilot', tyden: 1,
    nazev: 'Pořadí, znaménka, zlomky',
    podnazev: 'Pilot · týden 1',
    bloky: [
      {
        nadpis: 'Pořadí operací',
        text: 'Nejdřív závorky, pak mocniny, pak násobení a dělení, nakonec sčítání a odčítání. Nepočítej zleva doprava jako při čtení.',
        priklad: '$3 + 2 \\cdot 5^2 = 3 + 2 \\cdot 25 = 3 + 50 = 53$. Pozor: sečíst nejdřív $3 + 2$ je chyba.',
      },
      {
        nadpis: 'Plus a minus',
        text: 'Sčítání a odčítání je posun po teploměru: plus nahoru, minus dolů.',
        priklad: '$-4 - 6 = -10$, $-4 + 6 = 2$.',
      },
      {
        nadpis: 'Znaménko při násobení',
        text: 'Při násobení a dělení dají stejná znaménka plus, různá minus. Odečíst záporné číslo znamená přičíst.',
        priklad: '$(-4) \\cdot (-3) = 12$, $(-4) \\cdot 3 = -12$, $8 - (-2) = 8 + 2 = 10$.',
      },
      {
        nadpis: 'Sčítání zlomků',
        text: 'Sčítat a odčítat jde jen zlomky se stejným jmenovatelem. Rozšiř je, sečti čitatele, jmenovatel nech a nakonec zkrať.',
        priklad: '$\\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}$. Pozor: ne $\\frac{2}{10}$.',
      },
      {
        nadpis: 'Dělení zlomkem',
        text: 'Dělit zlomkem znamená násobit obráceným zlomkem. Obrací se ten za dvojtečkou.',
        priklad: '$\\frac{2}{3} : \\frac{4}{9} = \\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{18}{12} = \\frac{3}{2}$.',
      },
      {
        nadpis: 'Patrový zlomek',
        text: 'Dlouhá zlomková čára znamená děleno: horní patro děleno dolním. Smíšené číslo nejdřív převeď na zlomek.',
        priklad: '$\\dfrac{\\frac{3}{5}}{\\frac{9}{10}} = \\frac{3}{5} \\cdot \\frac{10}{9} = \\frac{2}{3}$; $1\\frac{2}{5} = \\frac{7}{5}$.',
      },
    ],
  },

  // ---------------------------------------------------------------- Fáze 1
  {
    id: 't:matematika:faze1:1', predmet: 'matematika', faze: 'faze1', tyden: 1,
    nazev: 'Mocniny a dělitelnost',
    podnazev: 'Fáze 1 · týden 1',
    bloky: [
      {
        nadpis: 'Mocnina a odmocnina',
        text: 'Na druhou je číslo krát samo sebe, ne krát dva. Odmocnina je opačný krok.',
        priklad: '$6^2 = 6 \\cdot 6 = 36$, $\\sqrt{36} = 6$. Pozor: $6^2$ není $12$.',
      },
      {
        nadpis: 'Pod odmocninou',
        text: 'Nejdřív spočítej všechno pod odmocninou, teprve pak odmocni. Odmocnina součtu není součet odmocnin.',
        priklad: '$\\sqrt{144 + 25} = \\sqrt{169} = 13$, ne $12 + 5 = 17$.',
      },
      {
        nadpis: 'Minus a mocnina',
        text: 'Se závorkou se umocní i minus, bez závorky jen číslo. Záporné číslo dosazuj vždy do závorky.',
        priklad: '$(-7)^2 = 49$, $-7^2 = -49$. Pro $a = -10$ je $3a^2 = 3 \\cdot (-10)^2 = 300$.',
      },
      {
        nadpis: 'Prvočísla a rozklad',
        text: 'Prvočíslo jde dělit jen jedničkou a samo sebou, $1$ prvočíslo není. Rozklad: děl postupně nejmenšími prvočísly.',
        priklad: '$60 = 2 \\cdot 2 \\cdot 3 \\cdot 5$. Pozor: $93$ není prvočíslo, $9 + 3 = 12$, tedy $93 = 3 \\cdot 31$.',
      },
      {
        nadpis: 'Dělitelé z rozkladu',
        text: 'Dělitele skládej z prvočísel rozkladu: každé samo, po dvou, po třech. Nezapomeň na $1$ a na samotné číslo.',
        priklad: '$70 = 2 \\cdot 5 \\cdot 7$ má dělitele $1$, $2$, $5$, $7$, $10$, $14$, $35$, $70$.',
      },
      {
        nadpis: 'Znaménko součinu',
        text: 'Sudý počet záporných čísel v součinu dá plus, lichý minus. Znaménko hlídej u každého kroku.',
        priklad: '$(-2) \\cdot (-1) \\cdot (-5) = -10$; $3 - (-4) = 7$.',
      },
    ],
  },
  {
    id: 't:matematika:faze1:2', predmet: 'matematika', faze: 'faze1', tyden: 2,
    nazev: 'Zlomky a smíšená čísla',
    podnazev: 'Fáze 1 · týden 2',
    bloky: [
      {
        nadpis: 'Zlomek z čísla',
        text: 'Vyděl jmenovatelem (dolním číslem) a vynásob čitatelem (horním).',
        priklad: '$\\frac{2}{3}$ ze $45$ je $45 : 3 \\cdot 2 = 30$.',
      },
      {
        nadpis: 'Část zbytku',
        text: 'Když se ptají na část zbytku, nejdřív odečti, co už je pryč. Další část počítej ze zbytku, ne z celku.',
        priklad: 'Ze $60$ Kč utratíš $\\frac{1}{4}$, tedy $15$ Kč, zbude $45$ Kč. $\\frac{1}{3}$ zbytku je $15$ Kč, ne $20$ Kč.',
      },
      {
        nadpis: 'Smíšené číslo',
        text: 'Smíšené číslo je celá část plus zlomek. Na zlomek: celé krát jmenovatel plus čitatel; násob a odmocňuj až po převodu.',
        priklad: '$2\\frac{3}{4} = \\frac{2 \\cdot 4 + 3}{4} = \\frac{11}{4}$; $\\sqrt{2\\frac{7}{9}} = \\sqrt{\\frac{25}{9}} = \\frac{5}{3}$.',
      },
      {
        nadpis: 'Pořadí ve zlomcích',
        text: 'I ve zlomcích má krát a děleno přednost před plus a mínus. Dlouhá čára dělí celé horní patro celým dolním.',
        priklad: '$\\frac{1}{2} + \\frac{3}{4} : \\frac{3}{2} = \\frac{1}{2} + \\frac{3}{4} \\cdot \\frac{2}{3} = \\frac{1}{2} + \\frac{1}{2} = 1$.',
      },
      {
        nadpis: 'Krácení při násobení',
        text: 'Před násobením zkrať čitatel jednoho zlomku se jmenovatelem druhého. Čísla zůstanou malá.',
        priklad: '$\\frac{4}{15} \\cdot \\frac{5}{8} = \\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$.',
      },
      {
        nadpis: 'O třetinu víc',
        text: 'Třetinu ber z čísla za slovem „než“. O třetinu víc jsou čtyři třetiny, o třetinu míň dvě třetiny.',
        priklad: 'Jana má $54$ knih, Petr o třetinu víc než Jana: $54 + 18 = 72$. Pozor: když znáš Petrových $72$, Jana má $72 : 4 \\cdot 3 = 54$, ne $72 - 24 = 48$.',
      },
    ],
  },
  {
    id: 't:matematika:faze1:3', predmet: 'matematika', faze: 'faze1', tyden: 3,
    nazev: 'Desetinná čísla a poměr',
    podnazev: 'Fáze 1 · týden 3',
    bloky: [
      {
        nadpis: 'Desetinná čárka',
        text: 'Násob jako celá čísla. Ve výsledku je tolik desetinných míst, kolik jich mají obě čísla dohromady.',
        priklad: '$0{,}4 \\cdot 0{,}7 = 0{,}28$; $1{,}2 \\cdot 0{,}03 = 0{,}036$.',
      },
      {
        nadpis: 'Dělení desetinným číslem',
        text: 'Posuň čárku v obou číslech o stejný počet míst, až je dělitel celé číslo.',
        priklad: '$4{,}8 : 0{,}6 = 48 : 6 = 8$. Zkouška: $8 \\cdot 0{,}6 = 4{,}8$.',
      },
      {
        nadpis: 'O desetinu víc',
        text: 'Desetina je číslo děleno deseti. Při „o desetinu víc než naposledy“ ber desetinu vždy z posledního čísla.',
        priklad: '$30$ m, pak $30 + 3 = 33$ m, pak $33 + 3{,}3 = 36{,}3$ m.',
      },
      {
        nadpis: 'Zlomek a desetinné číslo',
        text: 'Zlomek převedeš dělením, desetinné číslo zapíšeš v desetinách nebo setinách a zkrátíš. Třetiny nech zlomkem, desetinně nekončí.',
        priklad: '$\\frac{3}{8} = 3 : 8 = 0{,}375$; $0{,}35 = \\frac{35}{100} = \\frac{7}{20}$; $\\frac{2}{3} = 0{,}666\\ldots$',
      },
      {
        nadpis: 'Dělení v poměru',
        text: 'Poměr krátíš jako zlomek. Při dělení sečti díly, celek vyděl počtem dílů a vynásob díly každého.',
        priklad: '$12 : 18 = 2 : 3$. $56$ Kč v poměru $3 : 4$: $7$ dílů po $8$ Kč, tedy $24$ Kč a $32$ Kč.',
      },
      {
        nadpis: 'Přímá a nepřímá úměra',
        text: 'Než začneš počítat, rozhodni: víc → víc (přímá), nebo víc → míň (nepřímá). U nepřímé se součin nemění.',
        priklad: '$4$ kg za $100$ Kč, $6$ kg za $150$ Kč. $4$ sekačky posečou louku za $6$ h, $3$ sekačky za $8$ h ($4 \\cdot 6 = 3 \\cdot 8$).',
      },
    ],
  },
  {
    id: 't:matematika:faze1:4', predmet: 'matematika', faze: 'faze1', tyden: 4,
    nazev: 'Procenta',
    podnazev: 'Fáze 1 · týden 4',
    bloky: [
      {
        nadpis: 'Jedno procento',
        text: '$1\\,\\%$ je setina celku: celek vyděl stem. Pak ho vezmi tolikrát, kolik procent chceš.',
        priklad: '$1\\,\\%$ z $600$ je $6$, $8\\,\\%$ z $600$ je $6 \\cdot 8 = 48$.',
      },
      {
        nadpis: 'Kolik procent',
        text: 'Část vyděl celkem a vynásob stem. Celek je všechno dohromady, ne jen druhá skupina.',
        priklad: '$12$ z $48$: $12 : 48 = 0{,}25 = 25\\,\\%$. Pozor: $0{,}2$ je $20\\,\\%$, ne $2\\,\\%$.',
      },
      {
        nadpis: 'Zdražení a sleva',
        text: 'Zdražení přičti k ceně, slevu od ceny odečti. Po slevě $30\\,\\%$ platíš $70\\,\\%$ ceny.',
        priklad: '$400$ Kč zdražené o $15\\,\\%$: $400 + 60 = 460$ Kč. Se slevou $15\\,\\%$: $400 - 60 = 340$ Kč.',
      },
      {
        nadpis: 'Dvě změny za sebou',
        text: 'Druhou změnu počítej z nové ceny, ne z původní.',
        priklad: '$200$ Kč zdražit o $10\\,\\%$ dá $220$ Kč. Zlevnit pak o $10\\,\\%$ dá $220 - 22 = 198$ Kč, ne $200$ Kč.',
      },
      {
        nadpis: 'Slovo „než“',
        text: 'Procenta počítej z čísla za slovem „než“. $50\\,\\%$ je polovina, $25\\,\\%$ čtvrtina, $20\\,\\%$ pětina.',
        priklad: 'Batoh je o $25\\,\\%$ dražší než kšiltovka za $160$ Kč: $160 + 40 = 200$ Kč.',
      },
      {
        nadpis: 'Zpětný výpočet',
        text: 'Když znáš větší číslo, rozděl ho na díly. O $25\\,\\%$ víc je pět čtvrtin: vyděl pěti a vynásob čtyřmi.',
        priklad: 'Pes váží $35$ kg a je o $25\\,\\%$ těžší než fenka: fenka $35 : 5 \\cdot 4 = 28$ kg. Pozor: ne $35 - 8{,}75$.',
      },
    ],
  },
  {
    id: 't:matematika:faze1:5', predmet: 'matematika', faze: 'faze1', tyden: 5,
    nazev: 'Jednotky, čas a rychlost',
    podnazev: 'Fáze 1 · týden 5',
    bloky: [
      {
        nadpis: 'Délka a obsah',
        text: 'Délky převádíš po deseti, obsahy po stu. Na větší jednotku dělíš, na menší násobíš.',
        priklad: '$3$ dm $= 30$ cm, $3\\ \\text{dm}^2 = 300\\ \\text{cm}^2$, $650\\ \\text{cm}^2 = 6{,}5\\ \\text{dm}^2$.',
      },
      {
        nadpis: 'Metr čtvereční',
        text: '$1\\ \\text{m}^2 = 100\\ \\text{dm}^2 = 10\\,000\\ \\text{cm}^2$. Sčítat a odčítat jde jen ve stejné jednotce.',
        priklad: '$0{,}6\\ \\text{m}^2 - 2\\,500\\ \\text{cm}^2 = 6\\,000 - 2\\,500 = 3\\,500\\ \\text{cm}^2$.',
      },
      {
        nadpis: 'Objem a litry',
        text: '$1\\ \\text{dm}^3 = 1$ l a $1\\ \\text{cm}^3 = 1$ ml, litr má $1\\,000$ ml. Před násobením převeď rozměry na stejnou jednotku.',
        priklad: 'Dno $250\\ \\text{cm}^2$, hladina klesne o $12$ mm $= 1{,}2$ cm: $250 \\cdot 1{,}2 = 300\\ \\text{cm}^3 = 0{,}3$ l.',
      },
      {
        nadpis: 'Hodina má 60 minut',
        text: 'Když minut vyjde $60$ a víc, odečti $60$ a přidej hodinu. Desetinnou část hodiny násob šedesáti.',
        priklad: '$7{:}45$ a $35$ min je $7{:}80$, tedy $8{:}20$. $1{,}5$ h $= 1$ h $30$ min, ne $1$ h $50$ min.',
      },
      {
        nadpis: 'Stálá rychlost',
        text: 'Kolikrát delší čas, tolikrát delší dráha. Pomůže čas na jeden kilometr.',
        priklad: '$3$ km za $12$ min je $1$ km za $4$ min, za $28$ min tedy $7$ km. Pozor: ptají-li se, kolik zbývá, odečti ujeté od celé trasy.',
      },
      {
        nadpis: 'Kilometry za hodinu',
        text: 'Rychlost v km/h říká, kolik kilometrů ujedeš za $60$ minut. Minuty na hodiny převádíš dělením šedesáti.',
        priklad: '$80$ km/h: za $15$ min je to čtvrtina, tedy $20$ km. $45$ min $= 0{,}75$ h, ne $0{,}45$ h.',
      },
    ],
  },
  {
    id: 't:matematika:faze1:6', predmet: 'matematika', faze: 'faze1', tyden: 6,
    nazev: 'Výrazy a rovnice',
    podnazev: 'Fáze 1 · týden 6',
    bloky: [
      {
        nadpis: 'Stejné členy',
        text: 'Sčítej jen stejné druhy: iksy s iksy, čísla s čísly. Samotné $x$ je $1x$ a krát má přednost i s písmeny.',
        priklad: '$5x + 3 - 2x + x = 4x + 3$; $9x - 2x \\cdot 4 = 9x - 8x = x$.',
      },
      {
        nadpis: 'Roznásobení',
        text: 'Číslo před závorkou vynásob každým členem v závorce i se znaménkem. Minus krát minus dá plus.',
        priklad: '$-4 \\cdot (2x - 3) = -8x + 12$.',
      },
      {
        nadpis: 'Vytýkání',
        text: 'Každý člen vyděl tím, co vytýkáš; z celého členu zbude $1$. Kontrola: roznásob zpátky.',
        priklad: '$6x^2 - 9x = 3x \\cdot (2x - 3)$; $7x + 7 = 7 \\cdot (x + 1)$; $-3x + 12 = -3 \\cdot (x - 4)$.',
      },
      {
        nadpis: 'Úpravy rovnice',
        text: 'S oběma stranami dělej totéž; člen převedený na druhou stranu mění znaménko. I nula může být řešení.',
        priklad: '$6 \\cdot (x - 2) = 2x + 8$: $6x - 12 = 2x + 8$, $4x = 20$, $x = 5$. Zkouška: $6 \\cdot 3 = 18$ a $10 + 8 = 18$.',
      },
      {
        nadpis: 'Od věty k rovnici',
        text: 'Neznámou označ $x$ a z každé věty napiš kus výrazu. Slova „stejně“ nebo „dohromady“ dají rovnici.',
        priklad: 'Poplatek $210$ Kč a $20$ Kč za hodinu, nebo $35$ Kč za hodinu bez poplatku: $210 + 20x = 35x$, $210 = 15x$, $x = 14$ hodin.',
      },
      {
        nadpis: 'Pozor na slova',
        text: 'Slova „mladší“ a „méně“ svádějí k odečítání. Vždy si řekni, kdo má víc.',
        priklad: 'Eva má $x$ let a je třikrát mladší než teta: teta má $3x$, ne $\\frac{x}{3}$. Eva je o $4$ roky mladší než Ota: Ota má $x + 4$.',
      },
    ],
  },
  {
    id: 't:matematika:faze1:7', predmet: 'matematika', faze: 'faze1', tyden: 7,
    nazev: 'Obvod a obsah',
    podnazev: 'Fáze 1 · týden 7',
    bloky: [
      {
        nadpis: 'Obvod a obsah',
        text: 'Obvod je čára kolem dokola (plot), obsah je plocha uvnitř (koberec) v jednotkách na druhou.',
        priklad: 'Obdélník $8$ m a $5$ m: obvod $2 \\cdot (8 + 5) = 26$ m, obsah $8 \\cdot 5 = 40\\ \\text{m}^2$.',
      },
      {
        nadpis: 'Chybějící strana',
        text: 'Z obsahu: vyděl obsah známou stranou. Z obvodu: vezmi polovinu obvodu a odečti známou stranu.',
        priklad: 'Obsah $42\\ \\text{m}^2$, strana $6$ m: druhá $7$ m. Obvod $30$ cm, strana $4$ cm: druhá $15 - 4 = 11$ cm.',
      },
      {
        nadpis: 'Trojúhelník',
        text: 'Obsah je základna krát výška děleno dvěma, je to půlka obdélníku. Výška je kolmá k základně, šikmá strana to není.',
        priklad: 'Základna $10$ cm, výška $7$ cm: $S = \\frac{10 \\cdot 7}{2} = 35\\ \\text{cm}^2$.',
      },
      {
        nadpis: 'Lichoběžník',
        text: 'Sečti obě rovnoběžné základny, vyděl dvěma a vynásob výškou.',
        priklad: 'Základny $12$ cm a $8$ cm, výška $5$ cm: $S = \\frac{(12 + 8) \\cdot 5}{2} = 50\\ \\text{cm}^2$.',
      },
      {
        nadpis: 'Složené útvary',
        text: 'Rozděl útvar na obdélníky a sečti je, nebo ho doplň na velký obdélník a přebytek odečti. Každý kus počítej jen jednou.',
        priklad: 'Zahrada $12 \\cdot 9 = 108\\ \\text{m}^2$, bazén $4 \\cdot 3 = 12\\ \\text{m}^2$: trávník $108 - 12 = 96\\ \\text{m}^2$.',
      },
      {
        nadpis: 'Kruh',
        text: 'Poloměr $r$ vede ze středu na okraj, průměr je dvakrát delší. Obvod $o = 2\\pi r$, obsah $S = \\pi r^2$.',
        priklad: 'Průměr $14$ cm, tedy $r = 7$ cm: $o = 2 \\cdot 3{,}14 \\cdot 7 = 43{,}96$ cm, $S = 3{,}14 \\cdot 49 = 153{,}86\\ \\text{cm}^2$.',
      },
    ],
  },
  {
    id: 't:matematika:faze1:8', predmet: 'matematika', faze: 'faze1', tyden: 8,
    nazev: 'Opakování Fáze 1',
    podnazev: 'Fáze 1 · týden 8',
    bloky: [
      {
        nadpis: 'Pořadí s odmocninou',
        text: 'Pod odmocninou spočítej všechno jako v závorce, pak odmocni, pak násob, nakonec sčítej.',
        priklad: '$1 + 2 \\cdot \\sqrt{13^2 - 12^2} = 1 + 2 \\cdot \\sqrt{25} = 1 + 10 = 11$.',
      },
      {
        nadpis: 'Poměr na procenta',
        text: 'O kolik procent víc: rozdíl dílů vyděl díly toho, kdo je za slovem „než“.',
        priklad: 'Poměr $7 : 5$: o $2$ díly víc, $2 : 5 = 0{,}4 = 40\\,\\%$. Pozor: ne $2 : 7$.',
      },
      {
        nadpis: 'Rovnice se zlomkem',
        text: 'Vynásob celou rovnici jmenovatelem, každý člen na obou stranách. Zlomky zmizí.',
        priklad: '$\\frac{x}{4} + 3 = x$, krát $4$: $x + 12 = 4x$, $12 = 3x$, $x = 4$.',
      },
      {
        nadpis: 'Slovní úloha s „než“',
        text: 'Označ neznámou, každou větu přepiš na výraz a díl ber vždy z věci za slovem „než“.',
        priklad: 'Čepice je o polovinu levnější než bunda za $x$: čepice $\\frac{x}{2}$. Dohromady $900$ Kč: $x + \\frac{x}{2} = 900$, $x = 600$ Kč.',
      },
      {
        nadpis: 'Jednotky',
        text: 'Obsahy převádíš po stu, litr je krychlový decimetr a hodina má $60$ minut.',
        priklad: '$0{,}3\\ \\text{m}^2 = 30\\ \\text{dm}^2$; $0{,}25$ l $= 250\\ \\text{cm}^3$; $12$ min $= 0{,}2$ h.',
      },
      {
        nadpis: 'Kolikrát méně',
        text: '„Třikrát méně než A“ je třetina A, takže A má třikrát víc.',
        priklad: 'Malý pes sní třikrát méně než velký. Malý sní $x$, velký $3x$; dohromady $4x$.',
      },
    ],
  },

  // ---------------------------------------------------------------- Fáze 2
  {
    id: 't:matematika:faze2:1', predmet: 'matematika', faze: 'faze2', tyden: 1,
    nazev: 'Vzorce a závorky',
    podnazev: 'Fáze 2 · týden 1',
    bloky: [
      {
        nadpis: 'Závorka krát závorka',
        text: 'Každý člen první závorky vynásob každým členem druhé. Dva členy krát dva členy dají čtyři součiny.',
        priklad: '$(x + 2)(x - 5) = x^2 - 5x + 2x - 10 = x^2 - 3x - 10$.',
      },
      {
        nadpis: 'Závorka na druhou',
        text: '$(a + b)^2 = a^2 + 2ab + b^2$, $(a - b)^2 = a^2 - 2ab + b^2$. Vyjdou tři členy, uprostřed dvojnásobný součin.',
        priklad: '$(x + 8)^2 = x^2 + 16x + 64$; $(2x - 3)^2 = 4x^2 - 12x + 9$. Pozor: ne $x^2 + 64$.',
      },
      {
        nadpis: 'Rozdíl čtverců',
        text: '$a^2 - b^2 = (a - b)(a + b)$ platí jen pro mínus, součet $a^2 + b^2$ se nerozkládá. Vzorce jsou v testu na poslední straně.',
        priklad: '$9x^2 - 25 = (3x - 5)(3x + 5)$, protože $3x \\cdot 3x = 9x^2$ a $5 \\cdot 5 = 25$.',
      },
      {
        nadpis: 'Rozklad na čtverec',
        text: 'Krajní členy musí být druhé mocniny a prostřední dvojnásobek jejich součinu. Zkontroluj roznásobením.',
        priklad: '$x^2 - 10x + 25 = (x - 5)^2$, protože $2 \\cdot x \\cdot 5 = 10x$.',
      },
      {
        nadpis: 'Rovnice se zlomky',
        text: 'Vynásob celou rovnici nejmenším číslem, které jdou vydělit všechny jmenovatele. Násob každý člen, i ten bez zlomku.',
        priklad: '$\\frac{x}{3} + 1 = \\frac{x}{2}$, krát $6$: $2x + 6 = 3x$, $x = 6$.',
      },
      {
        nadpis: 'Minus před zlomkem',
        text: 'Zlomková čára funguje jako závorka. Minus před zlomkem otočí znaménka celého čitatele.',
        priklad: '$-\\frac{x - 4}{3} \\cdot 6 = -2 \\cdot (x - 4) = -2x + 8$.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:2', predmet: 'matematika', faze: 'faze2', tyden: 2,
    nazev: 'Soustavy a slovní úlohy',
    podnazev: 'Fáze 2 · týden 2',
    bloky: [
      {
        nadpis: 'Dosazovací metoda',
        text: 'Z jedné rovnice vyjádři neznámou, před kterou není číslo. Dosaď ji do druhé rovnice v závorce.',
        priklad: '$x + 2y = 7$, $3x - y = 7$: $x = 7 - 2y$, $3 \\cdot (7 - 2y) - y = 7$, $21 - 7y = 7$, $y = 2$, $x = 3$.',
      },
      {
        nadpis: 'Minus a převod',
        text: 'Minus před závorkou otočí znaménka všech členů v ní. Člen přesunutý přes rovnítko mění znaménko.',
        priklad: '$4x - (2x - 3) = 9$: $4x - 2x + 3 = 9$, $x = 3$. Z $5x - y = 8$ je $y = 5x - 8$, ne $8 - 5x$.',
      },
      {
        nadpis: 'Řetězová úloha',
        text: 'Všechno vyjádři jedním písmenem, rovnici napiš až nakonec. „O čtyři víc“ znamená přičíst, „třikrát víc“ násobit.',
        priklad: 'Petr má $p$, Ivan třikrát méně: $\\frac{p}{3}$, Ota o $4$ víc než Ivan: $\\frac{p}{3} + 4$. Pozor: „dvakrát méně než $a$ a $b$ dohromady“ je $\\frac{a + b}{2}$.',
      },
      {
        nadpis: 'Rychlost přes jednotku',
        text: 'Zjisti, co připadá na jeden kilometr nebo na jednu minutu. Pak násob.',
        priklad: '$4$ km za $36$ min: $1$ km za $9$ min, $7$ km za $63$ min.',
      },
      {
        nadpis: 'Společná práce',
        text: 'Spočítej, kolik každý stihne za stejnou dobu, a sečti to.',
        priklad: 'Jedna pumpa naplní nádrž za $3$ h, druhá za $6$ h. Za hodinu spolu $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$ nádrže, celou za $2$ h.',
      },
      {
        nadpis: 'Měřítko mapy',
        text: 'Číslo za dvojtečkou říká, kolikrát je skutečnost větší. Je ve stejné jednotce jako mapa, tedy v centimetrech.',
        priklad: '$1 : 40\\,000$: $1$ cm na mapě je $40\\,000$ cm $= 400$ m, $3$ cm je $1{,}2$ km.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:3', predmet: 'matematika', faze: 'faze2', tyden: 3,
    nazev: 'Úhly, Pythagoras, tělesa',
    podnazev: 'Fáze 2 · týden 3',
    bloky: [
      {
        nadpis: 'Úhly u přímek',
        text: 'Vedlejší úhly dají dohromady $180°$, vrcholové jsou stejné. U rovnoběžek jsou souhlasné i střídavé úhly stejné.',
        priklad: 'K úhlu $72°$ je vedlejší úhel $108°$ a vrcholový $72°$.',
      },
      {
        nadpis: 'Trojúhelník',
        text: 'Úhly v trojúhelníku dají dohromady $180°$. Každá strana je kratší než dvě ostatní dohromady.',
        priklad: 'Úhly $50°$ a $85°$: třetí je $45°$. Strany $3$ cm a $8$ cm: třetí víc než $5$ cm a méně než $11$ cm.',
      },
      {
        nadpis: 'Pythagorova věta',
        text: 'Přepona leží naproti pravému úhlu, $c^2 = a^2 + b^2$. Pro přeponu mocniny sečti, pro odvěsnu odečti, nakonec odmocni.',
        priklad: 'Odvěsny $9$ a $12$: $c^2 = 81 + 144 = 225$, $c = 15$. Přepona $17$, odvěsna $8$: $b^2 = 289 - 64 = 225$, $b = 15$.',
      },
      {
        nadpis: 'Výška v trojúhelníku',
        text: 'Výška na základnu rovnoramenného trojúhelníku půlí základnu. Dopočítáš ji Pythagorovou větou z ramene.',
        priklad: 'Ramena $10$ cm, základna $16$ cm: $v^2 = 100 - 64 = 36$, $v = 6$ cm, $S = \\frac{16 \\cdot 6}{2} = 48\\ \\text{cm}^2$.',
      },
      {
        nadpis: 'Povrch hranolu',
        text: 'Povrch jsou dvě podstavy a plášť; plášť je obvod podstavy krát výška. Krychle má šest stejných čtverců.',
        priklad: 'Čtvercová podstava $5$ cm, výška $8$ cm: $2 \\cdot 25 + 4 \\cdot 5 \\cdot 8 = 50 + 160 = 210\\ \\text{cm}^2$. Krychle s hranou $4$ cm: $6 \\cdot 16 = 96\\ \\text{cm}^2$.',
      },
      {
        nadpis: 'Objem',
        text: 'Objem hranolu je obsah podstavy krát výška, u válce $V = \\pi r^2 \\cdot v$. $1\\,000\\ \\text{cm}^3 = 1$ l.',
        priklad: 'Válec $r = 5$ cm, $v = 12$ cm: $V = 3{,}14 \\cdot 25 \\cdot 12 = 942\\ \\text{cm}^3 = 0{,}942$ l.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:4', predmet: 'matematika', faze: 'faze2', tyden: 4,
    nazev: 'Konstrukce, grafy, řady',
    podnazev: 'Fáze 2 · týden 4',
    bloky: [
      {
        nadpis: 'Kde leží bod',
        text: 'Každá podmínka ze zadání dá jednu čáru a hledaný bod je jejich průsečík. Když jsou průsečíky dva, narýsuj obě řešení.',
        priklad: '„Bod $X$ je $3$ cm od $A$“: kružnice se středem $A$ a poloměrem $3$ cm.',
      },
      {
        nadpis: 'Osa a Thaletova kružnice',
        text: 'Stejně daleko od $A$ i $B$: osa úsečky $AB$. Pravý úhel u hledaného bodu: Thaletova kružnice nad $AB$.',
        priklad: '$|AB| = 8$ cm: Thaletova kružnice má střed uprostřed $AB$ a poloměr $4$ cm.',
      },
      {
        nadpis: 'Úhlopříčky',
        text: 'Úhlopříčky rovnoběžníku se navzájem půlí. U obdélníku jsou navíc stejně dlouhé.',
        priklad: '$|AC| = 12$ cm, tedy $|AS| = |SC| = 6$ cm. V obdélníku je i $|BS| = |SD| = 6$ cm.',
      },
      {
        nadpis: 'Čtení grafu',
        text: 'Dílek osy: rozdíl dvou popsaných čísel vyděl počtem dílků mezi nimi. Osa nemusí začínat nulou.',
        priklad: 'Mezi $20$ a $40$ jsou čtyři dílky, jeden dílek je $5$.',
      },
      {
        nadpis: 'Průměr',
        text: 'Průměr je součet děleno počtem, i den s nulou se počítá. ANO/NE rozhoduj až po výpočtu.',
        priklad: '$(6 + 0 + 9) : 3 = 5$. Obráceně: průměr $8$ za $5$ dní je dohromady $5 \\cdot 8 = 40$.',
      },
      {
        nadpis: 'Řady obrazců',
        text: 'Když přibývá stále stejně, je $n$-tý obrazec první plus $(n - 1)$ krát přírůstek. Od 1. do 10. obrazce je jen $9$ přírůstků.',
        priklad: 'Řada $5, 8, 11, \\ldots$: 20. obrazec má $5 + 19 \\cdot 3 = 62$. Číslo $41$ má $(41 - 5) : 3 + 1 = 13$. obrazec.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:5', predmet: 'matematika', faze: 'faze2', tyden: 5,
    nazev: 'Záznamový arch a test',
    podnazev: 'Fáze 2 · týden 5',
    bloky: [
      {
        nadpis: 'Celý postup',
        text: 'U úloh s celým postupem piš do archu každou úpravu na nový řádek a výsledek orámuj. Samotný výsledek je za nula bodů.',
        priklad: '1. řádek: $3 \\cdot (x - 1) - x$; 2. řádek: $= 3x - 3 - x$; 3. řádek: $= \\boxed{2x - 3}$.',
      },
      {
        nadpis: 'Propiska a tužka',
        text: 'Do archu piš modrou nebo černou propiskou. Rýsuj tužkou a pak obtáhni propiskou; hodnotí se jen bílá pole archu.',
        priklad: 'Konstrukce: tužkou, potom obtáhnout. Výsledek $x = 4$: propiskou do rámečku své úlohy, ne do vedlejšího.',
      },
      {
        nadpis: 'Oprava',
        text: 'Chybný zápis přeškrtni a nový napiš do stejného pole, číslice nepřepisuj. Křížek opravíš tak, že staré políčko celé zabarvíš.',
        priklad: 'Napsal jsi $\\cancel{-12}$, vedle správně $12$. Pozor: dva křížky bez zabarvení jsou neplatná odpověď.',
      },
      {
        nadpis: 'Nejdřív počítej',
        text: 'U nabídky A–E nejdřív spočítej výsledek bez nabídky, teprve pak hledej písmeno. Mezivýsledky v nabídce bývají past.',
        priklad: 'Mikina za $800$ Kč, sleva $20\\,\\%$: sleva $160$ Kč je past, cena po slevě je $640$ Kč.',
      },
      {
        nadpis: 'Jiná hodnota',
        text: 'Když tvůj výsledek v nabídce není, zvol „jiná hodnota“. Když taková možnost chybí, počítej znovu: správná je vždy právě jedna.',
        priklad: 'Vyjde $118$, nabídka $110$, $120$, $130$, $140$, E) jiná hodnota: zvol E, ne nejbližší $120$.',
      },
      {
        nadpis: 'Přiřazování',
        text: 'U úlohy 15 mají tři otázky jednu společnou nabídku. Každou spočítej zvlášť a hlídej, na kterou skupinu se ptá.',
        priklad: '$30$ dětí, třetina přijela na kole: na kole $10$, ostatních $20$. Ptají se na ty, kdo na kole nepřijeli: $20$.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:6', predmet: 'matematika', faze: 'faze2', tyden: 6,
    nazev: 'Výrazy, procenta, úhly',
    podnazev: 'Fáze 2 · týden 6',
    bloky: [
      {
        nadpis: 'Mocnina před násobením',
        text: 'Čísla v závorce nejdřív sečti. Pak závorku umocni podle vzorce a teprve potom násob číslem před ní.',
        priklad: '$2 \\cdot (x + 3)^2 = 2 \\cdot (x^2 + 6x + 9) = 2x^2 + 12x + 18$; $(5 + 2y - 1)^2 = (2y + 4)^2$.',
      },
      {
        nadpis: 'Číslo i písmeno',
        text: 'Na druhou umocni číslo i písmeno. Ve vzorci $a^2 - b^2$ hledej, co na druhou dá každý člen.',
        priklad: '$(2k)^2 = 4k^2$, takže $49 - 4k^2 = (7 - 2k)(7 + 2k)$.',
      },
      {
        nadpis: 'Procenta jako číslo',
        text: 'O $10\\,\\%$ levnější je $0{,}9$ ceny, o $10\\,\\%$ dražší $1{,}1$ ceny. Části kruhového diagramu dají $100\\,\\%$.',
        priklad: 'O $30\\,\\%$ dražší než $50$ Kč: $1{,}3 \\cdot 50 = 65$ Kč.',
      },
      {
        nadpis: 'Z části na celek',
        text: 'Když znáš část a její procenta, zjisti nejdřív $10\\,\\%$, pak celek. U zlomků stejně přes jeden díl.',
        priklad: '$18$ t je $30\\,\\%$: $10\\,\\%$ je $6$ t, celek $60$ t. $\\frac{2}{7}$ jsou $10$ let: $\\frac{1}{7}$ je $5$ let, celek $35$ let.',
      },
      {
        nadpis: 'Osa úhlu',
        text: 'Osa úhlu ho půlí. Úhly v trojúhelníku i vedlejší úhly dají $180°$, v obdélníku jsou všechny úhly pravé.',
        priklad: 'Úhel $70°$ rozdělí osa na $35°$ a $35°$. Vedlejší úhel k $35°$ je $145°$.',
      },
      {
        nadpis: 'Obvod a lichoběžník',
        text: 'Do obvodu počítej jen strany na okraji. U rovnoramenného lichoběžníku přečnívá delší základna na každé straně o polovinu rozdílu základen.',
        priklad: 'Základny $14$ cm a $6$ cm: na každé straně $4$ cm. S výškou $3$ cm je rameno $\\sqrt{16 + 9} = 5$ cm.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:7', predmet: 'matematika', faze: 'faze2', tyden: 7,
    nazev: 'Díly, zlomky a krychle',
    podnazev: 'Fáze 2 · týden 7',
    bloky: [
      {
        nadpis: 'Součet a rozdíl',
        text: 'Znáš-li součet a rozdíl dvou čísel: menší je (součet minus rozdíl) děleno dvěma, větší je o rozdíl víc.',
        priklad: 'Dohromady $34$, rozdíl $8$: menší $(34 - 8) : 2 = 13$, větší $21$.',
      },
      {
        nadpis: 'Kdyby byly všechny menší',
        text: 'Představ si, že všechno je menší druh. Každý větší kus pak přidá rozdíl.',
        priklad: '$12$ stolů, u každého $4$ nebo $6$ židlí, celkem $58$ židlí. Kdyby měly všechny $4$: $48$. Chybí $10$, každý velký stůl přidá $2$: velkých je $5$.',
      },
      {
        nadpis: 'Počítání v dílech',
        text: 'O třetinu víc znamená ze $3$ dílů udělat $4$, o $25\\,\\%$ méně ze $4$ dílů udělat $3$. Pak sečti díly a najdi jeden díl.',
        priklad: 'Ema $3$ díly, Ota o třetinu víc, tedy $4$ díly. Dohromady $7$ dílů $= 42$ kg: díl $6$ kg, Ema $18$ kg, Ota $24$ kg.',
      },
      {
        nadpis: 'Zlomek na druhou',
        text: 'Závorku nejdřív spočítej celou, pak umocni čitatel i jmenovatel. Bez závorky se umocní jen čitatel.',
        priklad: '$\\left(1 - \\frac{1}{3}\\right)^2 = \\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$, ale $\\frac{2^2}{3} = \\frac{4}{3}$.',
      },
      {
        nadpis: 'Krychle',
        text: 'Krychle má $12$ stejných hran a $6$ stejných stěn. Povrch $S = 6a^2$, objem $V = a^3$.',
        priklad: 'Součet hran $84$ cm: $a = 7$ cm, $S = 6 \\cdot 49 = 294\\ \\text{cm}^2$, $V = 343\\ \\text{cm}^3$.',
      },
      {
        nadpis: 'Desetinná čísla v rovnici',
        text: 'Vynásob celou rovnici deseti nebo stem, každý člen na obou stranách. Převedený člen mění znaménko.',
        priklad: '$0{,}3x - 1 = 0{,}1x + 0{,}4$, krát $10$: $3x - 10 = x + 4$, $2x = 14$, $x = 7$.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:8', predmet: 'matematika', faze: 'faze2', tyden: 8,
    nazev: 'Simulace testu',
    podnazev: 'Fáze 2 · týden 8',
    bloky: [
      {
        nadpis: 'Čas v testu',
        text: 'Na $16$ úloh máš $70$ minut, asi $4$ minuty na úlohu. Když nevíš ani po $5$ minutách, přeskoč a vrať se.',
        priklad: 'Doporučené pořadí: úlohy $1$–$8$, pak $11$–$15$, pak konstrukce $9$–$10$ a nakonec $16$.',
      },
      {
        nadpis: 'Základ procent',
        text: 'O kolik procent je A víc než B: rozdíl vyděl B, tedy tím, s čím porovnáváš.',
        priklad: '$84$ Kč proti $70$ Kč: rozdíl $14$, $14 : 70 = 0{,}2 = 20\\,\\%$ víc. Pozor: ne $14 : 84$.',
      },
      {
        nadpis: 'Děleno před plus',
        text: 'I ve zlomcích má děleno přednost před plus. Dělit zlomkem je násobit obráceným zlomkem.',
        priklad: '$\\frac{1}{4} + \\frac{4}{5} : \\frac{8}{15} = \\frac{1}{4} + \\frac{4}{5} \\cdot \\frac{15}{8} = \\frac{1}{4} + \\frac{3}{2} = \\frac{7}{4}$.',
      },
      {
        nadpis: 'Osová souměrnost',
        text: 'Bod a jeho obraz leží na kolmici k ose, na opačných stranách a stejně daleko od osy.',
        priklad: 'Bod $A$ je $2$ cm od osy: obraz $A_1$ je na druhé straně také $2$ cm od osy, $|AA_1| = 4$ cm.',
      },
      {
        nadpis: 'Hrany hranolu',
        text: 'Hranol se čtyřúhelníkovou podstavou má $12$ hran: $4$ dole, $4$ nahoře a $4$ boční.',
        priklad: 'Podstava čtverec $3$ cm, výška $10$ cm: součet hran $8 \\cdot 3 + 4 \\cdot 10 = 64$ cm.',
      },
      {
        nadpis: 'Každá třetí sekunda',
        text: '„Každou třetí sekundu“ znamená ve 3., 6., 9. … sekundě. Kolikrát za danou dobu: vyděl a zbytek zahoď.',
        priklad: 'Za $17$ sekund: $17 : 3 = 5$ zbytek $2$, tedy pětkrát.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:9', predmet: 'matematika', faze: 'faze2', tyden: 9,
    nazev: 'Pohyb, poměr a jednotky',
    podnazev: 'Fáze 2 · týden 9',
    bloky: [
      {
        nadpis: 'Čas, dráha, rychlost',
        text: 'Čas je dráha děleno rychlostí, dráha je rychlost krát čas. Hodina má $60$ minut.',
        priklad: '$10$ km rychlostí $8$ km/h: $10 : 8 = 1{,}25$ h $= 1$ h $15$ min. Pozor: ne $1$ h $25$ min.',
      },
      {
        nadpis: 'O čtvrtinu menší',
        text: '„O čtvrtinu menší“ znamená odečíst čtvrtinu, zbudou tři čtvrtiny. Samotná čtvrtina to není.',
        priklad: 'Poloměr $12$ cm, druhý o čtvrtinu menší: $12 - 3 = 9$ cm, ne $3$ cm.',
      },
      {
        nadpis: 'Poměr výkonů',
        text: 'Výkony porovnávej za stejnou dobu, třeba za hodinu, ne podle toho, kolik kdo udělal celkem. Poměr zkrať.',
        priklad: 'A odveze $40$ balíků za $5$ h, B $36$ za $3$ h: za hodinu $8$ a $12$, poměr $8 : 12 = 2 : 3$.',
      },
      {
        nadpis: 'Kolikrát víc',
        text: 'Převeď obě hodnoty na stejnou jednotku a vyděl. $1$ l $= 1\\,000$ ml.',
        priklad: '$2$ l proti $0{,}4$ ml: $2\\,000 : 0{,}4 = 5\\,000$, je to $5\\,000$krát víc.',
      },
      {
        nadpis: 'Sloupky dokola',
        text: 'Dokola je mezer stejně jako sloupků. V řadě se sloupky na obou koncích je sloupků o jeden víc než mezer.',
        priklad: 'Kruhový plot $24$ m, sloupek každé $2$ m: $12$ sloupků. Rovný plot $24$ m: $13$ sloupků.',
      },
      {
        nadpis: 'Graf bez čísel',
        text: 'Když osa nemá čísla, velikost dílku zjisti ze zadání: rozdíl dílků odpovídá rozdílu kusů.',
        priklad: 'Červených je o $3$ dílky víc než modrých a ve skutečnosti o $15$ víc: jeden dílek je $5$ kusů.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:10', predmet: 'matematika', faze: 'faze2', tyden: 10,
    nazev: 'Výseč, celek a rovnice',
    podnazev: 'Fáze 2 · týden 10',
    bloky: [
      {
        nadpis: 'Kruhová výseč',
        text: 'Celý kruh má $360°$. Obsah výseče roste stejně jako její úhel: $90°$ je čtvrtina kruhu.',
        priklad: 'Výseč $120°$ z kruhu s $r = 3$ cm: $\\frac{120}{360} = \\frac{1}{3}$, obsah $\\frac{1}{3} \\cdot 3{,}14 \\cdot 9 = 9{,}42\\ \\text{cm}^2$.',
      },
      {
        nadpis: 'Z části na celek',
        text: 'Když víš, kolik je část, najdi nejdřív jeden díl a pak celek.',
        priklad: '$\\frac{2}{5}$ nádrže je $14$ l: $\\frac{1}{5}$ je $7$ l, celá nádrž $35$ l.',
      },
      {
        nadpis: 'O kolik procent víc',
        text: 'Základ je to, s čím porovnáváš. „O kolik procent víc“ se ptá na rozdíl, ne na celé množství.',
        priklad: 'Recept chce $40$ g, dal jsi $50$ g: o $10 : 40 = 25\\,\\%$ víc. Pozor: $125\\,\\%$ je celé množství, ne „o kolik víc“.',
      },
      {
        nadpis: 'Strany trojúhelníku',
        text: 'Každá strana je kratší než součet dvou ostatních a delší než jejich rozdíl. Rovnost nestačí, vyšla by úsečka.',
        priklad: 'Strany $7$ cm a $12$ cm: třetí je víc než $5$ cm a méně než $19$ cm.',
      },
      {
        nadpis: 'Násob každý člen',
        text: 'Když násobíš rovnici, násob každý člen na obou stranách, i samotné číslo. Člen přes rovnítko mění znaménko.',
        priklad: '$\\frac{x + 1}{3} + 2 = x$, krát $3$: $x + 1 + 6 = 3x$, $7 = 2x$, $x = \\frac{7}{2}$.',
      },
      {
        nadpis: 'Vytýkání',
        text: 'Když vytkneš celý člen, zůstane za něj v závorce $1$, ne $0$. Kontrola: roznásob zpátky.',
        priklad: '$5m^2 + m = m \\cdot (5m + 1)$.',
      },
    ],
  },
  {
    id: 't:matematika:faze2:11', predmet: 'matematika', faze: 'faze2', tyden: 11,
    nazev: 'Poslední opakování',
    podnazev: 'Fáze 2 · týden 11',
    bloky: [
      {
        nadpis: 'Den předem',
        text: 'Žádné nové učivo, jen pár lehkých úloh. Večer si připrav pomůcky a jdi včas spát.',
        priklad: 'Dvě modré nebo černé propisky, tužka, pravítko, trojúhelník s ryskou, kružítko, pití a svačina.',
      },
      {
        nadpis: 'Hodina má 60 minut',
        text: 'Minuty přes $60$ převeď na hodinu. Přestávku přičti k době jízdy.',
        priklad: '$9{:}35$ a $2$ h $40$ min: $11{:}75$, tedy $12{:}15$.',
      },
      {
        nadpis: 'Část zbytku',
        text: 'Část zbytku počítej ze zbytku, ne z celku.',
        priklad: 'Ze $160$ cm ustřihneš čtvrtinu ($40$ cm), zbude $120$ cm. $\\frac{2}{5}$ zbytku je $48$ cm, ne $64$ cm.',
      },
      {
        nadpis: 'Procenta',
        text: 'Kolik procent: část děleno celek, krát $100$. Základ je to, co stojí za slovem „než“.',
        priklad: '$45$ z $60$: $45 : 60 = 0{,}75 = 75\\,\\%$.',
      },
      {
        nadpis: 'Zpátky z dílů',
        text: 'Když je velký o třetinu větší než malý, má čtyři třetiny malého. Malý dostaneš tak, že velký vydělíš čtyřmi a vynásobíš třemi.',
        priklad: 'Velký pytel $20$ kg, malý $20 : 4 \\cdot 3 = 15$ kg. Kontrola: menší pytel musí vyjít menší.',
      },
      {
        nadpis: 'V testu',
        text: 'Vzorce a druhé mocniny čísel $11$ až $20$ máš na poslední straně. U nabídky nejdřív počítej, u postupových úloh piš celý postup.',
        priklad: 'Na konci zkontroluj, že má v archu každá úloha odpověď a u výběru je právě jeden křížek.',
      },
    ],
  },
]);
