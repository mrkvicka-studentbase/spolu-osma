import sys
sys.path.insert(0, '/tmp/b-cj3nb')
from spol import *

H = 'cj-t3-l10n'
HJ = json.load(open(D + H + '.json'))
TEMA = 'Koncovky -ý/-í tvrdých přídavných jmen'
CERV = f'Potom zopakujte lekci „{TEMA}“.'
L, h = hlavicka(H, 'cj-t3-l10nb',
    'Dítě samo doplní -ý, -í, -é nebo -á na konec tvrdého přídavného jména i tam, kde jméno stojí daleko, je v jiném pádě nebo vedle stojí jiné jméno (sousedé, učitelé, děti, telata, osly).',
    f'Opakování po červeném semaforu: stejná naostro lekce „{TEMA}“ s jinými větami a slovy, aby si dítě konce přídavných jmen i se všemi pastmi vyzkoušelo znovu.',
    [(p['znak'], p['text']) for p in HJ['uvod_pravidla']], HJ['slovnicek_pro_rodice'])
TM = 'pridavne-tvrde-za-mekke'; PT = 'pridavne-privlastnovaci-za-tvrde'; PN = 'privlastnovaci-neuzna'
Z = 'stupnovani-zamena'; NP = 'stupnovani-nepravidelne-pravidelne'; DJ = 'detektiv-jine-slovo'; DO = 'detektiv-oprava-jine-chyby'
YI = 'koncovka-prid-y-za-i'; IY = 'koncovka-prid-i-za-y'; SH = 'pridavne-shoda-s-jinym-jmenem'

# ---------- U1 ----------
ZAD1 = 'Odpověz na čtyři otázky.\n\nA) Jaké přídavné jméno je hasičovo: tvrdé, měkké, nebo přivlastňovací?\n\nB) Jaké přídavné jméno je vnitřní?\n\nC) Který tvar je 2. stupeň slova velký?\n\nD) Který tvar je 3. stupeň slova řídký?'
u1 = uloha('cj-t3-l10nb-U1', 'rozcvicka',
    'Zopakovat z lekce 9 druh přídavného jména (hasičovo, vnitřní) a stupeň slov, která se stupňují jinak (velký – větší, řídký – nejřidší).', 4, ZAD1,
    [krok_dl('k1', 'Řada A', ('tvrdé', PT), ('měkké', PN), ('přivlastňovací', True)),
     krok_dl('k2', 'Řada B', ('tvrdé', TM), ('měkké', True), ('přivlastňovací', None)),
     krok_dl('k3', 'Řada C', ('největší', Z), ('větší', True), ('velčí', NP)),
     krok_dl('final', 'Řada D', ('řidší', Z), ('nejřidší', True), ('nejřídkejší', NP))],
    th('Rozcvička opakuje lekci o druzích a stupních: druh (A, B) a stupeň (C, D). Pozor, v D se ptá na 3. stupeň. Velký a řídký se stupňují jinak: větší, řidší. Otázky jsou po příkladech: čtěte tu u příkladu, kde se dítě zasekne.',
       '#### A) hasičovo\n\npřivlastňovací (čí? hasičovo, od slova hasič)\n\n#### B) vnitřní\n\nměkké (vnitřní dvůr, vnitřní kapsa, vnitřní okno: konec stejný)\n\n#### C) velký\n\nvětší (největší je 3. stupeň)\n\n#### D) řídký\n\nnejřidší (řidší je 2. stupeň)\n\n**Výsledek:** A) přivlastňovací, B) měkké, C) větší, D) nejřidší',
       [q('A a B', '„Zkus slovo s ten, ta, to a zeptej se na něj čí? i jaký? Mění se konec? Která otázka sedí?“'),
        q('C', '„Neklikej hned. Řekni větu: Tenhle stan je ještě ___ než ten druhý. Které slovo tam pasuje?“'),
        q('D', '„Hledáš 3. stupeň. Který tvar vybírá jednu věc ze všech? Jak zní ve větě?“')],
       '„Vysvětli mi, jak z 2. stupně uděláš 3. stupeň.“',
       'Přidám na začátek nej-: řidší, nejřidší. Proto nejřídkejší být nemůže, když 2. stupeň je řidší.',
       'Podívejte se na obrazovku dítěte. V A zvolí tvrdé nebo měkké: „Ptáš se jaký?, nebo čí?“ V B tvrdé: „Řekni vnitřní s ten, ta, to.“ V C vybere největší, v D řidší: „Kolik věcí srovnáváš?“ Vybere velčí nebo nejřídkejší: „Říká se to tak?“'),
    sem('Výborně — druhy i stupně z minulé lekce drží. Pochvalte, že dítě zkoušelo tvary ve větě, a jděte dál.',
        'Zítra 5 minut, jen ústně. Zeptejte se: „Jaký je 2. a 3. stupeň od tichý a od krátký?“ Kontrola pro vás: tichý – tišší – nejtišší, krátký – kratší – nejkratší (obě slova se stupňují jinak).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě nakreslí tři sloupce: 1., 2. a 3. stupeň. Do prvního napíše velký, řídký, blízký a doplní zbytek. {CERV} Kontrola pro vás: velký – větší – největší, řídký – řidší – nejřidší, blízký – bližší – nejbližší.'),
    'Zakroužkuj správnou odpověď.\n\nA) Hasičovo je: a) tvrdé b) měkké c) přivlastňovací\n\nB) Vnitřní je: a) tvrdé b) měkké c) přivlastňovací\n\nC) 2. stupeň slova velký: a) největší b) větší c) velčí\n\nD) 3. stupeň slova řídký: a) řidší b) nejřidší c) nejřídkejší')

# ---------- U2 ----------
T2 = 'Neúnavn_ dělníci opravují silnici. Napínav_ večerní film právě začíná. Neúspěšn_ střelec smutně odchází. Pracovit_ sýraři vyrábějí sýr. Příjemn_ lékaři ošetřují pacienty. Levn_ telefon se rychle vybil. Zpěvn_ kosi sedí na střeše. Pohodln_ gauč stojí v obýváku.'
YIx = ['ý', 'í']
u2 = uloha('cj-t3-l10nb-U2', 'nova',
    'Doplnit -ý, nebo -í v 1. pádě u osmi tvrdých přídavných jmen; jednou stojí mezi přídavným jménem a jménem další slovo (napínavý večerní film).', 5,
    'Doplň -ý, nebo -í.',
    [doplnit('final', 'Tvoje odpověď', T2, [YIx] * 8, ['í', 'ý', 'ý', 'í', 'í', 'ý', 'í', 'ý'],
             [(0, 'ý', YI), (3, 'ý', YI), (6, 'ý', YI), (1, 'í', IY)])],
    th('Dítě doplňuje konec přídavného jména. Mezer je osm a jednou stojí mezi přídavným jménem a jménem další slovo (napínav_ večerní film). Test: dítě najde jméno a řekne před ně ten, nebo ti. -í a -ý zní stejně, rozhoduje jen test.',
       'Neúnavní dělníci (ti dělníci → -í)\n\nNapínavý večerní film (ten film → -ý; večerní je jiné přídavné jméno)\n\nNeúspěšný střelec (ten střelec → -ý)\n\nPracovití sýraři (ti sýraři → -í)\n\nPříjemní lékaři (ti lékaři → -í)\n\nLevný telefon (ten telefon → -ý)\n\nZpěvní kosi (ti kosi → -í)\n\nPohodlný gauč (ten gauč → -ý)\n\n**Výsledek:** í, ý, ý, í, í, ý, í, ý',
       ['„Podle čeho poznáš, jestli napíšeš -ý, nebo -í? Řekni to vlastními slovy.“',
        '„Vezmi první mezeru. Najdi jméno, ke kterému slovo patří, a řekni před něj ten, nebo ti.“',
        '„Když mezi mezerou a jménem stojí další slovo, přeskoč ho. Ke kterému jménu mezera patří?“'],
       '„Vysvětli mi, proč se píše příjemní lékaři, ale levný telefon.“',
       'Řeknu ti lékaři, tak -í: příjemní. U ten telefon je -ý: levný. Slyšet to není, musím říct ten, nebo ti.',
       'Podívejte se na obrazovku dítěte. U dělníci, sýraři, lékaři nebo kosi napíše -ý: „Řekneš ten dělníci, nebo ti dělníci?“ U film, střelec, telefon nebo gauč napíše -í: „Kolik jich je? Ten, nebo ti?“ (-í a -ý zní stejně, rozhoduje test.)'),
    sem('Výborně — všech osm konců sedí. Pochvalte, že dítě zkoušelo ten a ti, a jděte dál.',
        'Zítra 5 minut. Napište dítěti na papír: pracovit_ kuchař, pracovit_ kuchaři. Dítě doplní konce a řekne, proč. Kontrola pro vás: pracovitý kuchař (ten kuchař, -ý), pracovití kuchaři (ti kuchaři, -í).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše dva sloupce: ten a ti. Pod ten napíše příjemný lékař a neúnavný dělník, pod ti totéž o více lékařích a dělnících. {CERV} Kontrola pro vás: ti příjemní lékaři, ti neúnavní dělníci. U ti je vždy -í.'),
    'Doplň -ý, nebo -í.\n\n' + T2)

# ---------- U3 ----------
T3 = 'Na chalupě nás vítají pohostinn_ sousedé. Všichni učitelé byli v lanovém centru statečn_. Vystrašen_ děti se schovávají v kůlně a na pastvě se pasou strakat_ telata. Zahradníci rozvinují gumov_ hadice. Vrabci jsou od rána čil_. Ema sedí za kamenn_m plotem a Tomáš je z dárku překvapen_.'
Y4 = ['ý', 'í', 'é', 'á']
u3 = uloha('cj-t3-l10nb-U3', 'nova',
    'Doplnit -ý, -í, -é, -á v místech nejčastější chyby: sousedé a učitelé (ti → -í), děti (ty → -é), telata (ta → -á), jméno daleko, jiný pád, jiné jméno vedle.', 5,
    'Doplň -ý, -í, -é, nebo -á. Pozor, jméno nemusí stát hned vedle.',
    [doplnit('final', 'Tvoje odpověď', T3, [Y4] * 8, ['í', 'í', 'é', 'á', 'é', 'í', 'ý', 'ý'],
             [(0, 'ý', YI), (1, 'ý', YI), (4, 'í', SH), (7, 'í', IY)])],
    th('V nabídce jsou čtyři konce. Pasti: sousedé a učitelé se řeknou s ti, proto -í; děti s ty, proto -é; telata s ta, proto -á. U hadice svádí slovo zahradníci. V kamenn_m je jiný tvar (za tím plotem). U statečn_, čil_ a překvapen_ je jméno daleko: dítě hledá, kdo takový je.',
       'pohostinní sousedé (ti sousedé → -í)\n\nučitelé byli stateční (ti učitelé → -í)\n\nVystrašené děti (ty děti → -é)\n\nstrakatá telata (ta telata → -á)\n\ngumové hadice (ty hadice → -é; zahradníci jsou jiné jméno)\n\nvrabci jsou čilí (ti vrabci → -í)\n\nza kamenným plotem (za tím plotem → -ý)\n\nTomáš je překvapený (Tomáš je jeden: ten → -ý)\n\n**Výsledek:** í, í, é, á, é, í, ý, ý',
       ['„Jak poznáš, jestli na konec patří -ý, -í, -é, nebo -á?“',
        '„U každé mezery najdi, kdo nebo co takové je. Řekni před to jméno ten, ti, ty, nebo ta.“',
        '„Zkus jména z vět s ti i s ty: ti učitelé, nebo ty učitelé? Ty děti, nebo ti děti? Co zní správně?“'],
       '„Vysvětli mi, proč se píše strakatá telata, ale vystrašené děti.“',
       'Řeknu ta telata, tak -á: strakatá. Ale ty děti, tak -é: vystrašené.',
       'Podívejte se na obrazovku dítěte. U sousedé, učitelé nebo vrabci napíše -ý: „Ti, nebo ten?“ U děti napíše -í: „Ty děti, nebo ti děti?“ U telata -é: „Ty, nebo ta telata?“ U hadice -í: „Ke kterému jménu to patří?“ U kamenn_m nebo překvapen_ -í: „Ten, nebo ti?“'),
    sem('Výborně — i pasti se sousedé, děti a telata sedí. Pochvalte, že dítě hledalo jméno a zkoušelo ten, ti, ty, ta, a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti tři spojení: noví sousedé, malá koťata, umyté děti. U každého řekne ti, ty, nebo ta a jaké písmeno je na konci přídavného jména. Kontrola pro vás: ti sousedé (-í), ta koťata (-á), ty děti (-é).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše pod sebe: ti sousedé, ty děti, ta telata, ten pes. Ke každému dopíše slovo vystrašený ve správném tvaru. {CERV} Kontrola pro vás: ti vystrašení sousedé, ty vystrašené děti, ta vystrašená telata, ten vystrašený pes.'),
    'Doplň -ý, -í, -é, nebo -á.\n\n' + T3)

# ---------- U4 ----------
V4 = 'Hasiči z našeho dobrovolného sboru byli po zásahu ušpiněný, ale klidní.'
u4 = uloha('cj-t3-l10nb-U4', 'detektiv',
    'Najít u spolužáka chybu koncovka-prid-y-za-i daleko od jména (hasiči … ušpiněný), když hned vedle stojí jiné jméno (zásahu), a říct, co se řekne před jméno.', 5,
    f'Petr napsal větu a v koncovce přídavného jména udělal **jednu** chybu:\n\n{V4}\n\nNajdi ji.',
    [{"id": "k1", "popisek": "Klikni na slovo s chybou.", "vstup": {"typ": "klik_ve_textu", "text": V4, "cil": "slova", "min": 1, "max": 1},
      "spravne": [8], "zname_chyby": [{"navic": [3, 10, 0], "typ_chyby": DJ}]},
     krok_dl('final', 'Co řekneš před jméno u chybného slova?', ('ten', SH), ('ti', True), ('ty', DO), ('ta', DO))],
    th('Petr je vymyšlený spolužák a má jednu chybu. Chybné slovo stojí daleko od svého jména a hned vedle je jiné jméno, ke kterému nepatří. V kroku 2 dítě vybere, co řekne před jméno, ke kterému chybné slovo patří. Past: dobrovolného je správně (z toho dobrovolného sboru).',
       'Chyba je ušpiněný: kdo byl ušpiněný? hasiči → ti hasiči → ušpinění.\n\nušpiněný → ušpinění (ti hasiči, -í)\n\ndobrovolného sboru (správně; z toho dobrovolného sboru)\n\nklidní (správně; ti hasiči byli klidní)\n\n**Výsledek:** krok 1 ušpiněný, krok 2 ti',
       [q('Celá úloha', '„Najdi v Petrově větě všechna přídavná jména. Kdo nebo co takové je?“'),
        q('Krok 1', '„U každého přídavného jména se zeptej, kdo nebo co je takové. Řekni před to jméno ten, ti, ty, nebo ta. Sedí konec?“'),
        q('Krok 1 a 2', '„Spoj každé přídavné jméno s jedním jménem z věty. Které spojení dává smysl?“')],
       '„Já budu Petr. Řekni mi, kde mám chybu a jak si ji příště ohlídám.“',
       'Máš ušpiněný, ale ušpinění byli hasiči, ne zásah. Řeknu ti hasiči, takže -í. Příště se zeptej, kdo takový byl.',
       'Podívejte se na obrazovku dítěte. Klikne na dobrovolného nebo klidní: „Kdo nebo co je takové? Ten, ti, nebo ty?“ (Petr to má dobře.) Klikne na Hasiči: „Je to přídavné jméno?“ V kroku 2 zvolí ten: „Kdo byl ušpiněný: zásah, nebo hasiči?“ Zvolí ty nebo ta: „Ke kterému jménu to patří?“'),
    sem('Výborně — schovanou chybu dítě našlo a ověřilo, ke kterému jménu patří. Pochvalte to a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti: „Petr napsal: Lékaři byli po službě ospalý.“ Zeptejte se: „Má Petr pravdu? Jak to ověříš?“ Kontrola pro vás: nemá; kdo byl ospalý? lékaři → ti lékaři → ospalí (-í).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra napište dítěti dvě věty: Hasiči byli po zásahu ušpiněný. Hasiči byli po zásahu ušpinění. Dítě škrtne chybnou větu a řekne, kdo byl ušpiněný a co před to jméno řekne. {CERV} Kontrola pro vás: správně je ušpinění (kdo? hasiči → ti hasiči, -í).'),
    f'Petr napsal větu a v koncovce přídavného jména udělal jednu chybu:\n\n{V4}\n\nA) Podtrhni slovo s chybou.\n\nB) Co řekneš před jméno, ke kterému patří? Zakroužkuj: a) ten b) ti c) ty d) ta')

# ---------- U5 ----------
T5 = 'U brány nás vítá vousat_ správce. Na dvoře čekají dychtiv_ turisté. Huňat_ kobyly se pasou a vychovatelé jsou na zvířata něžn_. Ema krmí ušat_ osly, Lucka kreslí rohat_ho kozla a Tomáš se fotí s mohutn_m buvolem. Kůzlata jsou ještě bázliv_. Upovídan_ kluci se smějí a náš učitel je roztržit_.'
u5 = uloha('cj-t3-l10nb-U5', 'kontrolni',
    'Samostatně doplnit deset koncovek -ý, -í, -é, -á tvrdých přídavných jmen se všemi pastmi lekce (jméno daleko, 4. pád osly, kůzlata, jiný pád, vychovatelé, správce).', 6,
    'Doplň -ý, -í, -é, nebo -á.',
    [doplnit('final', 'Tvoje odpověď', T5, [Y4] * 10, ['ý', 'í', 'é', 'í', 'é', 'é', 'ý', 'á', 'í', 'ý'],
             [(1, 'ý', YI), (3, 'ý', YI), (8, 'ý', YI), (9, 'í', IY)])],
    th(VYS_KONTROLNI + 'Deset mezer a čtyři možné konce. Pasti: vychovatelé a učitel stojí daleko od přídavného jména, osly (krmí ty osly → -é), kůzlata (ta → -á), jiné tvary rohatého a mohutným.',
       'vousatý správce (ten → -ý)\n\ndychtiví turisté (ti → -í)\n\nHuňaté kobyly (ty → -é)\n\nvychovatelé jsou něžní (ti → -í)\n\nkrmí ušaté osly (krmí ty osly → -é)\n\nkreslí rohatého kozla (toho kozla → -é)\n\ns mohutným buvolem (s tím buvolem → -ý)\n\nKůzlata jsou bázlivá (ta kůzlata → -á)\n\nUpovídaní kluci (ti → -í)\n\nučitel je roztržitý (ten učitel → -ý)\n\n**Výsledek:** ý, í, é, í, é, é, ý, á, í, ý',
       ['„Řekni mi vlastními slovy, jak poznáš, který konec napíšeš.“',
        '„Najdi u každé mezery, kdo nebo co takové je. Jméno může stát i daleko.“',
        '„Když jméno není v 1. pádě, řekni celou větu s ten, ti, ty i ta. Co zní správně?“'],
       '„Vyber si mezeru, kde je jméno daleko, a dokaž mi, jaký konec tam patří.“',
       'Třeba vychovatelé jsou něžní: kdo je něžný? Vychovatelé. Řeknu ti vychovatelé, tak -í.',
       KONTROLNI_UVOD + 'u turisté, vychovatelé nebo kluci napíše -ý: „Ten, nebo ti?“ U osly -í: „Krmí ty osly, nebo ti osli?“ U kůzlata -é: „Ty, nebo ta kůzlata?“ U správce nebo učitel -í: „Kolik jich je?“ ' + KONTROLNI_SEMAFOR),
    sem('Výborně — všech deset konců sedí. Pochvalte, že dítě hledalo jméno i daleko ve větě. Zítra můžete pokračovat další lekcí.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti větu: „Ta malá jablka jsou kyselá a kuchaři jsou zklamaní.“ Dítě řekne, jaké písmeno je na konci slov malá, kyselá a zklamaní a proč. Kontrola pro vás: malá, kyselá -á (ta jablka); zklamaní -í (ti kuchaři).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše pod sebe: ten osel, ti osli, ty kobyly, ta kůzlata. Ke každému dopíše huňatý ve správném tvaru. {CERV} Kontrola pro vás: ten huňatý osel, ti huňatí osli, ty huňaté kobyly, ta huňatá kůzlata.'),
    'Doplň -ý, -í, -é, nebo -á.\n\n' + T5)

L['ulohy'] = [u1, u2, u3, u4, u5]
SL = ['hasič', 'vnitřní', 'velký', 'řídký', 'tichý', 'krátký', 'blízký',
      'neúnavný', 'dělník', 'napínavý', 'film', 'neúspěšný', 'střelec', 'pracovitý', 'sýrař', 'příjemný', 'lékař', 'levný', 'telefon', 'zpěvný', 'kos', 'pohodlný', 'gauč',
      'pohostinný', 'soused', 'učitel', 'statečný', 'dítě', 'vystrašený', 'strakatý', 'tele', 'gumový', 'zahradník', 'vrabec', 'čilý', 'kamenný', 'překvapený',
      'ušpiněný', 'dobrovolný', 'klidný', 'vousatý', 'správce', 'dychtivý', 'turista', 'huňatý', 'kobyla', 'vychovatel', 'něžný', 'ušatý', 'osel', 'rohatý', 'kozel',
      'mohutný', 'buvol', 'kůzle', 'bázlivý', 'upovídaný', 'roztržitý']
POZN = ("B-varianta naostro lekce cj-t3-l10n (opakování po červené, ZADANI-OSMA §9 bod 4), autor 12. 10. 2026. "
  "Struktura 1:1 s cj-t3-l10n (5 úloh, stejné typy vstupů, 4 dlaždice rozcvičky po 3 možnostech, 8 + 8 + 10 mezer se stejnou nabídkou a stejným pořadím správných konců, detektiv s chybou na indexu 8 a stejnými pastmi, stejné kódy a počty známých chyb), stejná obtížnost. "
  "Hodnocená slova a věty nejsou z cj-t3-l10/l10n/l10b ani z ostatních lekcí tématu 3; opakuje se jen velký – větší (uzavřená skupina, rozhodnutí vedoucího 12. 10.). "
  "Ověřeno v ÚJČ přes nastroje/ujc.sh 12. 10.: řídký – řidší (jen -ší), velký – větší, vnitřní (měkké), hasičovo podle id=400; všechna doplňovaná přídavná jména jsou hesla s 2. stupněm na -ejší (bez střídání souhlásek v 1. p. mn.: neúnavní, pracovití, příjemní, zpěvní, pohostinní, stateční, čilí, dychtiví, něžní, upovídaní); "
  "rod a životnost jmen u mezer (sousedé, učitelé, vychovatelé, turisté m. živ. → ti; děti ž. mn. → ty; tele → ta telata, kůzle → ta kůzlata; osel 4. p. mn. osly; správce m. živ. → ten). "
  "Index detektiva přes tokenizuj, vzorová odpověď a každá známá chyba ověřeny přes vyhodnotKrok (/tmp/b-cj3nb/kontrola.mjs).")
L['kontrola'] = {"jistota": "jista", "poznamka": POZN, "zkontroloval": "autor", "datum": "2026-10-09",
                 "zdroj": zdroje(SL, (400, 410)), "testovaci_rodic": None}
uloz(L)
