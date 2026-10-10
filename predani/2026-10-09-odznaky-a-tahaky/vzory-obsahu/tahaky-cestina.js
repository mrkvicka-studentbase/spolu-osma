// =====================================================================
// tahaky-cestina.js — obsah taháků z češtiny (R78, spec reporty/2026-10-08-spec-tahaky-vyzvy.md).
// Jedna kartička na týden: pilot (CJ-P1 až CJ-P4) a Fáze 1 týdny 1–8 (CJ-F1-T01 až CJ-F1-T08), celkem 9.
// text a priklad = markdown s KaTeXem, vykreslený přes md() (rodic-karta.js).
// Příklady jsou záměrně jiné než v úlohách lekcí, aby tahák nebyl klíčem k úlohám.
// =====================================================================

export const TAHAKY_CESTINA = [
  {
    id: 't:cestina:pilot:1', predmet: 'cestina', faze: 'pilot', tyden: 1,
    nazev: 'Pravopis, čárky a čtení',
    podnazev: 'Pilot · týden 1',
    bloky: [
      {
        nadpis: 'Kdy se píše y',
        text: 'Po B, L, M, P, S, V, Z se píše y jen ve vyjmenovaných slovech a ve slovech příbuzných. V ostatních slovech se píše i.',
        priklad: '*mlýn* je vyjmenované slovo, proto mají y i *mlynář* a *mlýnek*. Pozor: *lidé, mince, bič* vyjmenovaná nejsou, proto i.',
      },
      {
        nadpis: 'Po B, L, M',
        text: '**B:** být, bydlit, obyvatel, byt, příbytek, nábytek, dobytek, obyčej, bystrý, bylina, kobyla, býk, Přibyslav. **L:** slyšet, mlýn, blýskat se, polykat, plynout, plýtvat, vzlykat, lysý, lýtko, lýko, lyže, pelyněk, plyš. **M:** my, mýt, myslit, mýlit se, hmyz, myš, hlemýžď, mýtit, zamykat, smýkat, dmýchat, chmýří, nachomýtnout se, Litomyšl. A k nim slova příbuzná.',
        priklad: '*plynout* → *plynulý*, *myslit* → *přemýšlet*, *myšlenka*: všechna s y.',
      },
      {
        nadpis: 'Po P, S, V, Z',
        text: '**P:** pýcha, pytel, pysk, netopýr, slepýš, pyl, kopyto, klopýtat, třpytit se, zpytovat, pykat, pýr, pýřit se, čepýřit se. **S:** syn, sytý, sýr, syrový, sychravý, usychat, sýkora, sýček, sysel, syčet, sypat. **V:** vy, vysoký, výt, výskat, zvykat, žvýkat, vydra, výr, vyžle, povyk, výheň. **Z:** brzy, jazyk, nazývat (se), Ruzyně. A k nim slova příbuzná.',
        priklad: '*pytel* → *pytlík*, *jazyk* → *jazykový*. Předpona vy-, vý- má vždy y: *vyskočit, výhled*. Pozor: *výr* (sova) × *vír* (ve vodě), rozhoduje význam.',
      },
      {
        nadpis: 'Shoda s podmětem',
        text: 'V minulém čase řídí koncovku slovesa podmět. Dej před podmět ti, ty, nebo ta: ti → -i, ty → -y, ta → -a.',
        priklad: 'ti rybáři chytali · ty řeky tekly · ty domy stály · ta zvířata spala. Pozor: je-li v podmětu aspoň jeden muž, píše se -i: *Děda a teta odjeli.*',
      },
      {
        nadpis: 'Čárka v souvětí',
        text: 'Čárka odděluje vedlejší větu (že, protože, když, až, aby, který) od hlavní. Vedlejší věta vložená doprostřed má čárku z obou stran.',
        priklad: '*Těším se, až pojedeme k moři.* · *Sestra, která bydlí v Brně, přijede v sobotu.* · Před a, které jen spojuje dvě věty, čárka není: *Svítí slunce a ptáci zpívají.*',
      },
      {
        nadpis: 'Čtení s porozuměním',
        text: 'Odpověď hledej v textu, ne ve své hlavě. Tvrzení odpovídá, jen když v textu stojí celé, klidně jinými slovy.',
        priklad: 'Text: „Ema jela do školy na kole.“ Tvrzení „Ema jela do školy na kole a cestou potkala Tomáše“ neodpovídá, o Tomášovi text mlčí. Pozor: když platí jen půlka tvrzení, neplatí celé.',
      },
    ],
  },
  {
    id: 't:cestina:faze1:1', predmet: 'cestina', faze: 'faze1', tyden: 1,
    nazev: 'Vzory, druhy, větné členy',
    podnazev: 'Fáze 1 · týden 1',
    bloky: [
      {
        nadpis: 'Tvrdý, nebo měkký vzor',
        text: 'Vzor poznáš podle 2. pádu: bez pána, bez hradu = tvrdý; bez muže, bez stroje = měkký. Měkké vzory mají v koncovce vždy i.',
        priklad: 'bez řidiče → muž: *s řidiči* · bez plotu → hrad: *s ploty*. Pozor: rozhoduje 2. pád, ne konec slova: bez kotle → stroj: *s kotli*.',
      },
      {
        nadpis: 'Páni, nebo pány',
        text: 'Vzor pán má v 1. pádě množného čísla -i (ti páni) a v 7. pádě -y (s pány). Přídavné jméno u mužů a zvířat mužského rodu má v 1. pádě -í.',
        priklad: '*ti stateční vojáci* · *s vojáky* · vzor jarní má vždy í: *letní prázdniny*. Pozor: spisovně *s vojáky*, ne „s vojákama“.',
      },
      {
        nadpis: 'Slovní druh otázkou',
        text: 'Slovní druh poznáš podle toho, jak slovo funguje ve větě. Ptej se: kdo? co? = podstatné jméno, kdy? kde? jak? = příslovce, kolik? kolikátý? = číslovka.',
        priklad: '*Dopoledne* uteklo rychle. (co?) = podstatné jméno · *Dopoledne* mám trénink. (kdy?) = příslovce. Pozor: *třetí* je číslovka (kolikátý?), *trojka* z písemky je podstatné jméno (co?).',
      },
      {
        nadpis: 'Předložka, nebo příslovce',
        text: 'Předložka stojí vždy před podstatným jménem nebo zájmenem. Když stojí samo, je to příslovce.',
        priklad: 'Sedl si *naproti* mně. = předložka · Bydlí hned *naproti*. = příslovce',
      },
      {
        nadpis: 'Větné členy',
        text: 'Nejdřív najdi přísudek (co se děje) a od něj se ptej. Kdo? co? = podmět, koho? co? komu? = předmět, kde? kdy? jak? = příslovečné určení, jaký? čí? = přívlastek.',
        priklad: '*Dopis přinesl ráno starý listonoš.* Přísudek přinesl, podmět listonoš (kdo přinesl?), předmět dopis (co přinesl?), příslovečné určení ráno (kdy?), přívlastek starý (jaký listonoš?). Pozor: podmět nemusí stát na začátku.',
      },
      {
        nadpis: 'Význam slov',
        text: 'Synonyma znamenají totéž, antonyma opak. Ustálené spojení vysvětluj jako celek, ne slovo po slovu.',
        priklad: '*zahájit* = *začít* · *tichý* × *hlučný* · *mít něco za lubem* = tajně něco chystat. Pozor: *pustit něco z hlavy* znamená přestat na to myslet, ne něco upustit.',
      },
    ],
  },
  {
    id: 't:cestina:faze1:2', predmet: 'cestina', faze: 'faze1', tyden: 2,
    nazev: 'Mě/mně, věty, literatura',
    podnazev: 'Fáze 1 · týden 2',
    bloky: [
      {
        nadpis: 'Mě, nebo mně',
        text: 'Dosaď si tebe, nebo tobě. Kde sedí tebe, piš mě; kde sedí tobě, piš mně.',
        priklad: 'Čekej na *mě*. (na tebe) · Řekni *mně* pravdu. (tobě) · Pozor: *ke mně* (k tobě), ne „ke mě“.',
      },
      {
        nadpis: 'Předpona s-, nebo z-',
        text: 'Předpona s- znamená pohyb dolů, pryč z povrchu, nebo dohromady. Předpona z- znamená, že se něco změní, stane se jiným.',
        priklad: '*s*padnout, *s*mést drobky, *s*pojit · *z*bělet, *z*hubnout. Pozor: holub *s*letěl ze střechy, předložka *ze* na předponu nemá vliv.',
      },
      {
        nadpis: 'Souřadné, nebo podřadné',
        text: 'V souřadném souvětí dává každá věta smysl sama. V podřadném jedna věta závisí na druhé a začíná slovem jako že, když, až, aby, který.',
        priklad: '*Zazvonil zvonek a děti vyběhly ze třídy.* = souřadné · *Zavolám ti, až dorazím.* = podřadné. Pozor: souvětí má aspoň dvě slovesa v určitém tvaru.',
      },
      {
        nadpis: 'Druh vedlejší věty',
        text: 'Ptej se od věty hlavní, ne podle spojky. Podmětná: kdo? co? (1. pád), předmětná: ostatní pády, přívlastková: jaký? který?, místní: kde?, časová: kdy?, příčinná: proč?, účelová: za jakým účelem?',
        priklad: 'Přeji si, *abys vyhrál*. (co si přeji?) = předmětná · Šetřím, *abych si koupil kolo*. (za jakým účelem?) = účelová',
      },
      {
        nadpis: 'Literatura',
        text: 'Lyrika vyjadřuje pocity a nálady, epika vypráví děj, drama je text pro divadlo, ve kterém mluví postavy. Přirovnání srovnává slovem jako, personifikace dává věcem a zvířatům lidské vlastnosti.',
        priklad: '*tvrdý jako kámen* = přirovnání · *Lampa na rohu dřímala.* = personifikace. Pozor: mluvící zvířata má pohádka i bajka, bajka navíc končí poučením.',
      },
      {
        nadpis: 'Text a pořadí',
        text: 'Význam slova poznáš podle okolních vět. Při řazení částí hledej slova času (nejdřív, potom, nakonec) a odkazy (ten, ta, jeden z nich): odkaz patří až za to, na co ukazuje.',
        priklad: '*Teta nám přivezla štěně. To celou noc kňučelo.* Věta s „to“ musí být až za větou o štěněti. Pozor: „plánuje“ neznamená, že se to už stalo.',
      },
    ],
  },
  {
    id: 't:cestina:faze1:3', predmet: 'cestina', faze: 'faze1', tyden: 3,
    nazev: 'Názvy, stavba slova, poezie',
    podnazev: 'Fáze 1 · týden 3',
    bloky: [
      {
        nadpis: 'Víceslovné názvy',
        text: 'Ve víceslovném názvu se velkým písmenem píše první slovo a slova, která jsou sama jménem nebo od jména vznikla. Obecné slovo před jménem (hrad, řeka, rybník) je malé.',
        priklad: '*Moravský kras* · *Jiráskova ulice* · *rybník Rožmberk*. Pozor: *Slezské divadlo*, ne „Slezské Divadlo“.',
      },
      {
        nadpis: 'Obyvatelé a ulice',
        text: 'Jména obyvatel a národů píšeš velkým písmenem, přídavná jména, příslovce a jazyky od nich malým. Když název ulice začíná předložkou, je velká předložka i slovo za ní.',
        priklad: '*Maďaři* mluví *maďarsky* · *Ostravané*, ale *ostravský* · bydlím v ulici *Za Mlýnem*.',
      },
      {
        nadpis: 'Stavba slova',
        text: 'Kořen mají všechna příbuzná slova. Předpona stojí před kořenem, přípona za ním a koncovka na konci se mění při skloňování.',
        priklad: '*vý-let-n-í*: předpona vý-, kořen let, přípona -n-, koncovka -í. Pozor: předpona do kořene nepatří.',
      },
      {
        nadpis: 'Jak slova vznikají',
        text: 'Odvozováním se přidá předpona nebo přípona, skládáním vznikne slovo ze dvou slov, zkracováním zkratka. Příbuzná slova mají stejný kořen a souvisí i významem.',
        priklad: '*sklář* ← sklo (odvozování) · *sněhobílý* ← sníh + bílý (skládání) · *OSN* (zkracování). Pozor: *pila* a *pilný* příbuzná nejsou, jen podobně znějí.',
      },
      {
        nadpis: 'Mluvnické kategorie',
        text: 'Pád urči otázkou i s předložkou, rod podle ten, ta, to. Dokonavé sloveso v přítomném tvaru znamená budoucnost.',
        priklad: '*za domem* (za kým? za čím?) = 7. pád · *ten vévoda* = rod mužský · *Zítra to dodělám.* = čas budoucí · *Kdybych mohl, pomohl bych.* = způsob podmiňovací. Pozor: *Dům byl prodán.* = rod trpný.',
      },
      {
        nadpis: 'Básnické prostředky',
        text: 'Metafora pojmenovává podle podobnosti, metonymie podle souvislosti, hyperbola zveličuje a apostrofa oslovuje. Báseň, která vypráví příběh, patří do epiky.',
        priklad: '*Poslouchám Smetanu.* = metonymie (jeho hudbu) · *Čekal jsem celou věčnost.* = hyperbola · *Větře, utiš se!* = apostrofa. Pozor: verše ještě neznamenají lyriku.',
      },
    ],
  },
  {
    id: 't:cestina:faze1:4', predmet: 'cestina', faze: 'faze1', tyden: 4,
    nazev: 'Bje, vje, styly, zájmena',
    podnazev: 'Fáze 1 · týden 4',
    bloky: [
      {
        nadpis: 'Bje, vje, bě, vě',
        text: 'Bje a vje píšeš jen tam, kde se předpona ob- nebo v- potká se slovem na j. Jinde píšeš bě a vě, skupina pě je vždy bez j.',
        priklad: '*objímat* (ob + jímat) · *vjíždět* (v + jíždět) × *oběhnout*, *vědro*, *pěšina*',
      },
      {
        nadpis: 'Mně uvnitř slova',
        text: 'Uvnitř slova piš mně, když má příbuzné slovo nebo tvar n. Kde n není, piš mě.',
        priklad: '*dojemný* → *dojemně* (je tam n) × *náměsíčný* (od měsíc, bez n). Pozor: *rozměr* má mě, v *měřit* žádné n není.',
      },
      {
        nadpis: 'Slohové útvary',
        text: 'Útvar poznáš podle toho, k čemu text slouží: vypravování vypráví příběh, popis ukazuje, jak něco vypadá, charakteristika, jaký je člověk, výklad vysvětluje a úvaha říká názor. Zpráva je o tom, co se stalo, oznámení o tom, co teprve bude.',
        priklad: '*V úterý vyhořela stodola.* = zpráva · *Ve středu nebude jezdit tramvaj číslo 9.* = oznámení',
      },
      {
        nadpis: 'Funkční styly',
        text: 'Styl poznáš podle toho, kde se text používá: běžný hovor je prostěsdělovací, učebnice odborný, noviny publicistický, úřad administrativní a literatura umělecký styl.',
        priklad: '*Ahoj, jdu za deset minut.* = prostěsdělovací · *Žádám o vydání potvrzení o studiu.* = administrativní. Pozor: rozhoduje účel textu, ne jeho téma.',
      },
      {
        nadpis: 'Tvary zájmen a číslovek',
        text: 'Ji, nebo jí: dosaď ho, nebo mu (ho → ji, mu → jí). Na začátku věty a po předložce piš jen mně, ne mi.',
        priklad: 'Potkal jsem *ji* (ho) a půjčil jsem *jí* (mu) kolo · *Mně* se to líbí · *jich* bylo deset × *jejich* auto · *s oběma* bratry, za *nimi*. Pozor: „dvěmi“, „oběmi“ a „s ními“ jsou nespisovné.',
      },
      {
        nadpis: 'Čárka ve větě',
        text: 'Čárkou oddělíš členy výčtu bez spojky, oslovení, přístavek, vsuvku a citoslovce; před ale píšeš čárku vždy. Mezi podmět a přísudek čárka nepatří.',
        priklad: '*Ach, Kubo, to je škoda.* · *Brno, druhé největší město, leží na Moravě.* · *Je to drahé, ale kvalitní.* Pozor: *Máma, táta a já jsme jeli na chatu.* (před jeli čárka není)',
      },
    ],
  },
  {
    id: 't:cestina:faze1:5', predmet: 'cestina', faze: 'faze1', tyden: 5,
    nazev: 'Přívlastky, slova, próza',
    podnazev: 'Fáze 1 · týden 5',
    bloky: [
      {
        nadpis: 'Koncovky přídavných jmen',
        text: 'V 1. pádě množného čísla rozhoduje rod podstatného jména: ti → -í, ty → -é, ta → -á. Vzor jarní má vždy -í.',
        priklad: '*ti chytří žáci* · *ty chytré vrány* · *ta chytrá hříbata* · *ty sváteční šaty*. Pozor: *ta* hříbata, proto -á, ne -é.',
      },
      {
        nadpis: 'Otcův, matčin',
        text: 'Přivlastňovací přídavné jméno se řídí podstatným jménem, ne tím, komu věc patří: ti → -i, ty → -y, ta → -a.',
        priklad: '*tetini synové* · *tetiny rukavice* · *tetina kola*. Pozor: *Martinovi kamarádi* (ti), ale *Martinovy sešity* (ty).',
      },
      {
        nadpis: 'Podmět a přívlastek',
        text: 'Podmět hledej otázkou kdo? co? od přísudku; může ve větě chybět nebo být několikanásobný. Shodný přívlastek se mění s podstatným jménem, neshodný stojí za ním a nemění se.',
        priklad: '*Zítra pojedeme na hory.* = podmět nevyjádřený (my) · *Babička a děda pekli.* = několikanásobný podmět · *u kulatého stolu* = shodný × *u stolu z dubu* = neshodný',
      },
      {
        nadpis: 'Přejatá a nespisovná slova',
        text: 'Přejaté slovo nahradíš českým, které ve větě znamená totéž. Nespisovná slova patří do hovoru; zdrobněliny jsou spisovné, jen citově zabarvené.',
        priklad: '*prioritní* = *přednostní* · *kompletní* = *úplný* · *vokurka*, *hezkej* jsou nespisovné (spisovně *okurka*, *hezký*) · *stromeček* je spisovný, jen citově zabarvený.',
      },
      {
        nadpis: 'Synonyma, antonyma, homonyma',
        text: 'Synonyma mají stejný význam, antonyma opačný. Homonyma se píšou i vyslovují stejně, ale jejich významy spolu nesouvisejí.',
        priklad: '*hbitý* = *mrštný* · *mělký* × *hluboký* · *stát* (na nohou) × *stát* (země). Pozor: *noha* člověka a *noha* židle homonyma nejsou, význam spolu souvisí.',
      },
      {
        nadpis: 'Vypravěč a řeč',
        text: 'V ich-formě vypravěč mluví o sobě (šel jsem), v er-formě vypráví o druhých (šel, šla). Přímá řeč je doslova v uvozovkách, nepřímá je bez nich, často se že nebo ať.',
        priklad: '„Mám žízeň,“ řekl Ondra. → Ondra řekl, že má žízeň. Povídka je kratší příběh, román rozsáhlý s mnoha postavami. Pozor: „já“ v uvozovkách ještě neznamená ich-formu.',
      },
    ],
  },
  {
    id: 't:cestina:faze1:6', predmet: 'cestina', faze: 'faze1', tyden: 6,
    nazev: 'Nn, zájmena, přímá řeč',
    podnazev: 'Fáze 1 · týden 6',
    bloky: [
      {
        nadpis: 'N, nebo nn',
        text: 'Nn píšeš, když kořen končí na n a přidá se přípona -ný nebo -ní. Přídavná jména s příponou -ěný, -ený (z čeho věc je) mají jedno n.',
        priklad: '*seno* → *senný* · *výměna* → *výměnný*. Pozor: *stříbrný* má jedno n, kořen *stříbr-* na n nekončí.',
      },
      {
        nadpis: 'Zdvojené souhlásky',
        text: 'Dvě stejné souhlásky píšeš, když předpona končí stejnou hláskou, jakou začíná kořen. Když se stejné hlásky nepotkají, píšeš jednu.',
        priklad: '*od + dálit* → *oddálit* · *roz + zuřit* → *rozzuřit*. Pozor: *nejedlý* (ne + jedlý) má jedno j, *nejjemnější* (nej + jemnější) dvě.',
      },
      {
        nadpis: 'Druhy zájmen',
        text: 'Zájmeno v otázce je tázací, totéž slovo připojující vedlejší větu je vztažné. Nikdo, nic, žádný jsou záporná, někdo, něco, nějaký neurčitá.',
        priklad: '*Kterou písničku zpíváš?* = tázací · *Písnička, kterou zpívám, je stará.* = vztažné',
      },
      {
        nadpis: 'Číslovky a stupňování',
        text: 'Kolik? = základní, kolikátý? = řadová, kolikerý? = druhová, kolikrát? = násobná. Přídavné jméno (jaký?) i příslovce (jak?) mají 3. stupeň s předponou nej-.',
        priklad: '*sedm* · *sedmý* · *sedmkrát* · *hlučný* → *hlučnější* → *nejhlučnější* (jaký?) · *hlučně* → *hlučněji* → *nejhlučněji* (jak?)',
      },
      {
        nadpis: 'Nadpis a hlavní myšlenka',
        text: 'Nadpis i hlavní myšlenka musí sedět na celý text, ne na jednu větu nebo slovo. Tvrzení vyplývá jen tehdy, když ho text opravdu říká, třeba jinými slovy.',
        priklad: 'Text o tom, proč kočky předou, když jsou spokojené i když je něco bolí: sedí „Proč kočky předou“, ne „Kočky“ (příliš obecné) ani „Bolest“ (jen jedno slovo).',
      },
      {
        nadpis: 'Přímá řeč a znaménka',
        text: 'Uvozovací věta před přímou řečí: dvojtečka a velké písmeno. Uvozovací věta za přímou řečí: čárka uvnitř uvozovek a malé písmeno.',
        priklad: 'Teta zavolala: „Oběd je hotový.“ · „Oběd je hotový,“ zavolala teta. · „Až se najíš,“ řekla teta, „umyj talíř.“ · Před výčtem dvojtečka: *Koupíme tři věci: mléko, máslo a sýr.* · Vsuvka mezi dvě pomlčky: *Náš soused – je mu přes osmdesát – jezdí na kole.*',
      },
    ],
  },
  {
    id: 't:cestina:faze1:7', predmet: 'cestina', faze: 'faze1', tyden: 7,
    nazev: 'Ú/ů, souvětí, autoři',
    podnazev: 'Fáze 1 · týden 7',
    bloky: [
      {
        nadpis: 'Ú, nebo ů',
        text: 'Ú píšeš na začátku slova, po předponě a ve složenině, když slovo samo začíná na ú, a ve slovech z cizích jazyků. Ů píšeš uprostřed a na konci českých slov.',
        priklad: '*úsvit* · *bezúčelný* (účel) · *pedikúra* × *hůl*, *k přátelům*. Pozor: *nárůst* má ů, protože *růst* na ú nezačíná.',
      },
      {
        nadpis: 'Poměry v souvětí',
        text: 'Hlavní věty mohou být v poměru slučovacím (a, i, ani), odporovacím (ale, však), vylučovacím (nebo), důsledkovém (proto, a tak) nebo příčinném (neboť). Rozhoduje smysl: následek říká, co z první věty vyplývá, příčina proč se stala.',
        priklad: '*Bolel mě zub, proto jsem šel k zubaři.* = důsledkový · *Šel jsem k zubaři, neboť mě bolel zub.* = příčinný',
      },
      {
        nadpis: 'Čárka mezi hlavními větami',
        text: 'Čárku píšeš před ale, však, proto, a proto, a tak, neboť a před nebo, když platí jen jedna možnost. Před a, i, ani, které jen sčítají, čárku nepíšeš.',
        priklad: '*Byl jsem unavený, a proto jsem šel brzy spát.* · *Pojedeme k moři, nebo zůstaneme na chatě.* Pozor: před *a proto* čárka je, i když stojí před a.',
      },
      {
        nadpis: 'Spisovné tvary',
        text: 'Spisovně píšeš s lidmi, s přáteli, o písních, bychom, byste a vezmu, vezměte. Tvary jako s kámošema, bysme, by jste nebo vemte patří do hovoru.',
        priklad: '*S bratranci bychom jeli na tábor.* · *Kluci si vezmou míč.* Pozor: *očima*, *ušima*, *rukama*, *nohama* jsou spisovné.',
      },
      {
        nadpis: 'Autoři 19. století',
        text: 'Karel Jaromír Erben napsal sbírku balad Kytice, Božena Němcová prózu Babička a Karel Hynek Mácha lyrickoepickou báseň Máj. Jan Neruda napsal Povídky malostranské a Alois Jirásek Staré pověsti české.',
        priklad: '*Kytice*: balady ve verších, třeba Polednice nebo Zlatý kolovrat · *Povídky malostranské*: příběhy lidí z pražské Malé Strany',
      },
      {
        nadpis: 'Čapek, Komenský, Seifert',
        text: 'Karel Čapek napsal divadelní hry R.U.R. a Bílá nemoc. Jan Amos Komenský napsal obrázkovou učebnici Orbis pictus a básník Jaroslav Seifert dostal v roce 1984 Nobelovu cenu za literaturu.',
        priklad: '*R.U.R.*: hra o továrně, která vyrábí roboty, a ti se nakonec proti lidem vzbouří. Pozor: *Povídání o pejskovi a kočičce* napsal jeho bratr Josef Čapek.',
      },
    ],
  },
  {
    id: 't:cestina:faze1:8', predmet: 'cestina', faze: 'faze1', tyden: 8,
    nazev: 'Opakování a generálka',
    podnazev: 'Fáze 1 · týden 8',
    bloky: [
      {
        nadpis: 'I, nebo y',
        text: 'Po B, L, M, P, S, V, Z piš y ve vyjmenovaných a příbuzných slovech. V koncovkách rozhoduje vzor: s pány, s hrady, ale s muži, se stroji.',
        priklad: '*plýtvat* → *plýtvání* · *s holuby* (bez holuba → pán) · *s malíři* (bez malíře → muž)',
      },
      {
        nadpis: 'Ti, ty, ta',
        text: 'Koncovku slovesa v minulém čase i přídavného jména v 1. pádě množného čísla určíš podle ti, ty, ta.',
        priklad: '*Ti unavení horolezci došli.* · *Ty unavené ovce ležely.* · *Ta unavená telata spala.*',
      },
      {
        nadpis: 'Mě, mně, ji, jí',
        text: 'Dosaď tebe, nebo tobě: tebe → mě, tobě → mně. Dosaď ho, nebo mu: ho → ji, mu → jí.',
        priklad: '*Zastav se pro mě.* (pro tebe) · *Ukaž mně cestu.* (tobě) · *Pochválil jsem ji* (ho) *a poradil jsem jí.* (mu)',
      },
      {
        nadpis: 'Čárky',
        text: 'Vedlejší věta se odděluje čárkou, vložená z obou stran. Čárka je i před ale, proto a neboť a u oslovení; před a, i, nebo, které jen spojují, není.',
        priklad: '*Taška, kterou jsem si koupil, se roztrhla.* · *Bylo pozdě, a tak jsme jeli autem.* · *Hano, pojď sem.*',
      },
      {
        nadpis: 'Druh vedlejší věty',
        text: 'Ptej se od věty hlavní, ne podle spojky. Kdo? co? (1. pád) = podmětná, ostatní pády = předmětná, jaký? který? = přívlastková, kdy? kde? proč? za jakým účelem? = příslovečné.',
        priklad: '*Kdo chce jet na výlet, ať se přihlásí.* (kdo ať se přihlásí?) = podmětná · *Slíbil, že přijde.* (co slíbil?) = předmětná · *Učím se, abych udělal zkoušky.* (za jakým účelem?) = účelová',
      },
      {
        nadpis: 'Porozumění textu',
        text: 'Tvrzení odpovídá, jen když ho text říká, i jinými slovy. Má-li tvrzení dvě části, musí platit obě; nadpis musí sedět na celý text.',
        priklad: 'Text: „Muzeum je v pondělí zavřené.“ Tvrzení „V pondělí se do muzea nedostaneš“ odpovídá. Tvrzení „Muzeum je v pondělí zavřené a v úterý má vstup zdarma“ neodpovídá, o úterý text mlčí.',
      },
    ],
  },
];
