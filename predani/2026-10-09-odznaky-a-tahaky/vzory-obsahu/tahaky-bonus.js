// =====================================================================
// tahaky-bonus.js — měsíční výzvy a zlaté bonusové taháky (R78, spec reporty/2026-10-08-spec-tahaky-vyzvy.md, oddíl 2).
// Výzva: v kalendářním měsíci (Europe/Prague) dokončit aspoň `cil` lekcí, oba předměty se sčítají.
// Odměna = bonusový tahák `b:<mesic>`; všem se odemknou 1. 4. 2027.
// Chyby jsou z obsah/typy-chyb.md, fakta o testu z kostry a lekcí (osnova-faze2, F2-T05-L1, F2-T05-L2, F2-T11-L2, hlasky).
// text a priklad = markdown s KaTeXem, vykreslený přes md() (rodic-karta.js).
// =====================================================================

export const VYZVY = [
  { mesic: '2026-11', cil: 12, nazev: 'Listopadová výzva' },
  { mesic: '2026-12', cil: 10, nazev: 'Prosincová výzva' },
  { mesic: '2027-01', cil: 12, nazev: 'Lednová výzva' },
  { mesic: '2027-02', cil: 12, nazev: 'Únorová výzva' },
  { mesic: '2027-03', cil: 12, nazev: 'Březnová výzva' },
  { mesic: '2027-04', cil: 4, nazev: 'Dubnová výzva' },
];

export const TAHAKY_BONUS = [
  {
    id: 'b:2026-11', mesic: '2026-11',
    nazev: 'Chyby v matematice',
    podnazev: 'Bonus za listopadovou výzvu',
    bloky: [
      {
        nadpis: 'Přednost operací',
        text: 'Násobení a dělení má přednost před sčítáním a odčítáním. Závorka se počítá úplně první.',
        priklad: '$6 + 4 \\cdot 5 = 6 + 20 = 26$. Pozor: ne $10 \\cdot 5 = 50$.',
      },
      {
        nadpis: 'Minus a mocnina',
        text: 'U $-a^2$ se umocní jen číslo a minus zůstane. U $(-a)^2$ se umocní i minus, výsledek je kladný.',
        priklad: '$-7^2 = -49$, ale $(-7)^2 = 49$. Pozor: $5^2 = 25$, ne $10$; mocnina není násobení dvěma.',
      },
      {
        nadpis: 'Sčítání zlomků',
        text: 'Zlomky převeď na společného jmenovatele a pak sečti čitatele. Jmenovatele se nesčítají.',
        priklad: '$\\frac{1}{4} + \\frac{2}{3} = \\frac{3}{12} + \\frac{8}{12} = \\frac{11}{12}$. Pozor: ne $\\frac{3}{7}$.',
      },
      {
        nadpis: 'Procenta po sobě',
        text: '„O $10\\,\\%$ víc“ je celek a k tomu jeho $10\\,\\%$. Druhé zdražení se počítá z nové ceny, procenta se nesčítají.',
        priklad: '$200$ Kč o $10\\,\\%$ dráž je $220$ Kč, pak ještě o $10\\,\\%$ dráž je $242$ Kč. Pozor: ne $240$ Kč.',
      },
      {
        nadpis: 'Převody jednotek',
        text: 'Mezi sousedními jednotkami (mm, cm, dm, m) se délka převádí po 10, obsah po 100 a objem po 1 000. Hodina má 60 minut, ne 100.',
        priklad: '$3\\ \\text{m}^2 = 300\\ \\text{dm}^2$ · $2\\ \\text{dm}^3 = 2\\,000\\ \\text{cm}^3$ · $1{,}5$ h $= 1$ h $30$ min. Pozor: ne $1$ h $50$ min.',
      },
      {
        nadpis: 'Závorky a rovnice',
        text: 'Číslo před závorkou násob s každým členem v ní; minus před závorkou otočí všechna znaménka. Při převodu na druhou stranu rovnice se znaménko mění.',
        priklad: '$3(x + 2) = 3x + 6$ · $10 - (4 - 1) = 10 - 4 + 1 = 7$ · $x + 7 = 3$, tedy $x = 3 - 7 = -4$. Pozor: ne $x = 10$.',
      },
    ],
  },
  {
    id: 'b:2026-12', mesic: '2026-12',
    nazev: 'Chyby v češtině',
    podnazev: 'Bonus za prosincovou výzvu',
    bloky: [
      {
        nadpis: 'Shoda s podmětem',
        text: 'Koncovku slovesa řídí podmět, ne slovo, které stojí nejblíž. Najdi podmět a dej před něj ti, ty, nebo ta.',
        priklad: '*Auta sousedů stála před domem.* Podmět jsou auta (ta auta), proto -a. Pozor: neřiď se slovem sousedů.',
      },
      {
        nadpis: 'Koncovky podle vzorů',
        text: 'Tvrdé vzory pán a hrad mají v 7. pádě množného čísla -y, měkké vzory muž a stroj vždy -i. Vzor poznáš podle 2. pádu.',
        priklad: 'bez pejska → pán: *s pejsky* · bez kováře → muž: *s kováři*. Pozor: konec slova nerozhoduje.',
      },
      {
        nadpis: 'Mě, nebo mně',
        text: 'Dosaď tebe, nebo tobě. Tebe → mě, tobě → mně.',
        priklad: 'Pošli *mně* zprávu. (tobě) · Vezmi *mě* s sebou. (tebe)',
      },
      {
        nadpis: 'Čárky',
        text: 'Vložená vedlejší věta má čárku na začátku i na konci. Před a, které jen spojuje dvě věty, čárku nepiš.',
        priklad: '*Kolo, které jsem dostal k narozeninám, je modré.* · *Zhasli jsme a šli spát.* Pozor: druhá čárka za vloženou větou se často zapomíná.',
      },
      {
        nadpis: 'Slova příbuzná',
        text: 'Y zůstává ve všech slovech příbuzných s vyjmenovanými. Slova, která vyjmenovaná ani příbuzná nejsou, mají po B, L, M, P, S, V, Z i.',
        priklad: '*bystrý* → *zbystřit*, *sypat* → *násyp*, *zvykat* → *zvyk*. Pozor: *pila, lízat, bič* mají i.',
      },
      {
        nadpis: 'Co v textu není',
        text: 'Tvrzení, o kterém text mlčí, neodpovídá, i když by mohlo být pravda. Odpovídá jen to, co v textu opravdu stojí.',
        priklad: 'Text: „Pavel vyhrál závod.“ Tvrzení „Pavel trénoval každý den“ neodpovídá: o tréninku text nic neříká.',
      },
    ],
  },
  {
    id: 'b:2027-01', mesic: '2027-01',
    nazev: 'Jak číst zadání',
    podnazev: 'Bonus za lednovou výzvu',
    bloky: [
      {
        nadpis: '„O“ je rozdíl',
        text: '„O 3 víc“ znamená přičíst 3, „o 3 méně“ odečíst 3. Hlídej, kdo je větší a kdo menší.',
        priklad: 'Jana má $12$ let a je o $3$ roky starší než Petr. Petr má $12 - 3 = 9$ let. Pozor: ne $15$.',
      },
      {
        nadpis: '„Krát“ je násobek',
        text: '„Čtyřikrát víc“ znamená násobit čtyřmi. Kolikrát je jedno číslo větší než druhé, zjistíš dělením.',
        priklad: 'Kolikrát je $24$ víc než $6$? $24 : 6 = 4$, tedy čtyřikrát. Pozor: $24 - 6 = 18$ by byla odpověď na „o kolik“.',
      },
      {
        nadpis: '„O třetinu“ víc',
        text: '„O třetinu víc“ je celé číslo a k tomu ještě jeho třetina. „O třetinu méně“ je číslo bez jeho třetiny.',
        priklad: 'o třetinu víc než $30$: $30 + 10 = 40$. Pozor: ne $30 \\cdot 3 = 90$ ani jen $10$.',
      },
      {
        nadpis: 'Za „než“ je základ',
        text: 'To, co stojí za slovem „než“, je základ, a z něj se počítají procenta i zlomky.',
        priklad: 'Kniha je o $20\\,\\%$ dražší než sešit za $50$ Kč: $20\\,\\%$ z $50$ je $10$, kniha stojí $60$ Kč. Pozor: „$60$ je o $20\\,\\%$ víc než $x$“ dá $x = 60 : 1{,}2 = 50$, ne $48$.',
      },
      {
        nadpis: 'Malé slovo „ne“',
        text: 'Otázky „Kolik dětí nepřišlo?“ nebo „Které tvrzení neodpovídá?“ se ptají na opak. Před odpovědí si otázku přečti ještě jednou.',
        priklad: 'Ze $30$ dětí přišla třetina. Kolik dětí nepřišlo? Přišlo $30 : 3 = 10$, nepřišlo $30 - 10 = 20$. Pozor: $10$ je jen mezivýsledek.',
      },
      {
        nadpis: 'Na co se ptá',
        text: 'Odpověz přesně na otázku ze zadání, ne mezivýsledkem. Hlídej i jednotku, kterou otázka chce.',
        priklad: 'Autobus vyjede v $6{:}55$ a jede $50$ minut. Kdy dorazí? V $7{:}45$. Pozor: $50$ minut je délka cesty, ne čas příjezdu.',
      },
    ],
  },
  {
    id: 'b:2027-02', mesic: '2027-02',
    nazev: 'Čas v testu',
    podnazev: 'Bonus za únorovou výzvu',
    bloky: [
      {
        nadpis: 'Matematika: 70 minut',
        text: 'Test z matematiky má $16$ úloh a $70$ minut. Na jednu úlohu vychází asi $4$ minuty.',
        priklad: 'Po $20$ minutách bys měl mít hotové zhruba $4$ až $5$ úloh.',
      },
      {
        nadpis: 'Pořadí úloh',
        text: 'Doporučené pořadí: úlohy 1–8, pak 11–15, nakonec 9–10 a 16. Úlohy 11–15 jsou rychlé body.',
        priklad: 'Ve $40$. minutě jsi ještě u úlohy $7$? Přejdi na úlohy $11$–$15$ a k sedmičce se vrať na konci.',
      },
      {
        nadpis: 'Pravidlo pěti minut',
        text: 'U žádné úlohy nestůj déle než 5 minut. Přeskoč ji a vrať se k ní na konci.',
        priklad: 'Úloha $5$ nevychází ani po $5$ minutách: jdi na $6$ a k pětce se vrať, až budeš mít hotové ostatní.',
      },
      {
        nadpis: 'Nenech prázdné',
        text: 'U úloh s výběrem odpovědi se za chybu body neodečítají. Když už na výpočet nemáš čas, vyluč nesmysly a zakřížkuj nejlepší možnost.',
        priklad: 'Obsah nemůže vyjít v cm, záporná délka nedává smysl: takové možnosti škrtni hned. Pozor: tipuj až na konci, nejdřív počítej.',
      },
      {
        nadpis: 'Čas na kontrolu',
        text: 'Nech si na konci pár minut na arch. Je každý výsledek ve správném políčku a přepsaný stejně jako v sešitě?',
        priklad: 'V sešitě máš $-\\frac{2}{5}$, do archu musíš napsat taky $-\\frac{2}{5}$, i s minusem. Pozor: výsledek úlohy 6.2 nepatří do rámečku 6.1.',
      },
      {
        nadpis: 'Čeština: 60 minut',
        text: 'Test z češtiny trvá 60 minut. Ani tady se u jedné otázky nezasekávej: přeskoč ji a vrať se na konci. U otázky k textu najdi místo, kde odpověď stojí, a nečti znovu celý text.',
        priklad: 'Otázka: „Kdy začala stavba mostu?“ Najdi v textu slovo *most* a přečti jen věty kolem něj.',
      },
    ],
  },
  {
    id: 'b:2027-03', mesic: '2027-03',
    nazev: 'Velký přehled',
    podnazev: 'Bonus za březnovou výzvu',
    bloky: [
      {
        nadpis: 'Rovinné útvary',
        text: 'Obdélník: $o = 2(a + b)$, $S = a \\cdot b$. Trojúhelník: $S = \\frac{a \\cdot v_a}{2}$. Kruh: $o = 2\\pi r$, $S = \\pi r^2$.',
        priklad: 'Kruh s průměrem $6$ cm má $r = 3$ cm, $S = \\pi \\cdot 3^2 \\approx 28{,}3\\ \\text{cm}^2$. Pozor: do vzorce patří poloměr, ne průměr.',
      },
      {
        nadpis: 'Tělesa a Pythagoras',
        text: 'Kvádr: $V = a \\cdot b \\cdot c$. Krychle: $V = a^3$, $S = 6a^2$. Válec: $V = \\pi r^2 \\cdot v$. Pravoúhlý trojúhelník: $c^2 = a^2 + b^2$, kde $c$ je přepona.',
        priklad: 'Krychle s hranou $4$ cm: $V = 64\\ \\text{cm}^3$, $S = 96\\ \\text{cm}^2$ · odvěsny $5$ a $12$: $c = \\sqrt{25 + 144} = 13$.',
      },
      {
        nadpis: 'Vzorce a procenta',
        text: '$(a + b)^2 = a^2 + 2ab + b^2$, $(a - b)^2 = a^2 - 2ab + b^2$, $a^2 - b^2 = (a - b)(a + b)$. Procento je setina celku.',
        priklad: '$(y - 4)^2 = y^2 - 8y + 16$ · $15\\,\\%$ z $80$ je $0{,}15 \\cdot 80 = 12$. Vzorce pro rozklad a pro kruh najdeš i na poslední straně testu z matematiky.',
      },
      {
        nadpis: 'Převody',
        text: 'Délka po 10 (mm, cm, dm, m), $1$ km $= 1\\,000$ m. Obsah po 100, objem po 1 000, $1$ l $= 1\\ \\text{dm}^3$, $1$ h $= 60$ min.',
        priklad: '$2{,}5\\ \\text{m}^2 = 250\\ \\text{dm}^2$ · $750\\ \\text{cm}^3 = 0{,}75$ l · $0{,}2$ h $= 12$ min',
      },
      {
        nadpis: 'Pravopis: i, nebo y',
        text: 'Vyjmenovaná a příbuzná slova mají y. Vzory pán a hrad: s pány, s hrady; muž a stroj: vždy i. Shoda: ti → -i, ty → -y, ta → -a.',
        priklad: '*Bratři si hráli s míči.* · *Lodě odpluly.* · *Města se rozrostla.*',
      },
      {
        nadpis: 'Mě, s/z, čárky',
        text: 'Mě, nebo mně: zkouška tebe, nebo tobě. Předpona s-: dolů, pryč, dohromady; z-: změna stavu. Čárka před vedlejší větou, před slučovacím a ne.',
        priklad: 'Pošli to *mně*, ne jemu. · *Z*modral zimou a *s*lezl ze žebříku. · *Vím, kde bydlíš.*',
      },
    ],
  },
  {
    id: 'b:2027-04', mesic: '2027-04',
    nazev: 'Den D',
    podnazev: 'Bonus za dubnovou výzvu',
    bloky: [
      {
        nadpis: 'Kdy to je',
        text: 'Přijímačky jsou v pondělí 12. 4. a v úterý 13. 4. 2027. Den předem už se nic nového neučíš.',
        priklad: 'Neděle 11. 4.: poslední lehká rozcvička, večer připravit věci a jít včas spát.',
      },
      {
        nadpis: 'Co si vzít',
        text: 'Modrou nebo černou propisku (raději dvě), tužku, pravítko, trojúhelník s ryskou a kružítko. Kalkulačka u zkoušky povolená není.',
        priklad: 'Přibal i pití a svačinu. Všechno si nachystej večer, ráno nic nehledáš.',
      },
      {
        nadpis: 'Křížky v archu',
        text: 'Křížek dělej z rohu do rohu políčka. Když odpověď měníš, původní políčko celé zabarvi a udělej nový křížek.',
        priklad: 'Pozor: dva křížky u jedné úlohy znamenají neplatnou odpověď.',
      },
      {
        nadpis: 'Psaní a opravy',
        text: 'Piš propiskou, rýsuj tužkou a pak obtáhni. Chybný zápis přeškrtni a nový napiš do stejného pole, číslice nepřepisuj.',
        priklad: 'Pozor: u úlohy s celým postupem je samotný výsledek za $0$ bodů. Piš každou úpravu na nový řádek.',
      },
      {
        nadpis: 'Když přijde tréma',
        text: 'Nervozita je normální, máš za sebou měsíce přípravy. Pomalu se třikrát nadechni a vydechni a začni úlohou, kterou umíš.',
        priklad: 'Zasekl ses? Řekni si: „Přeskočím a vrátím se,“ a jdi na další úlohu.',
      },
      {
        nadpis: 'Mezi testy',
        text: 'Po testu nerozebírej s kamarády každou úlohu. Odpočiň si, najez se a na další test jdi s čistou hlavou.',
        priklad: 'Co už je odevzdané, nezměníš. Počítá se, co uděláš v dalším testu.',
      },
    ],
  },
];
