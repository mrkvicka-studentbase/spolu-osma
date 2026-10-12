import sys
sys.path.insert(0, '/tmp/b-cj3nb')
from spol import *

H = 'cj-t3-l9n'
TEMA = 'Druhy přídavných jmen a stupňování'
CERV = f'Potom zopakujte lekci „{TEMA}“.'
L, h = hlavicka(H, 'cj-t3-l9nb',
    'Dítě samo určí druh přídavného jména i v jiném tvaru (mokrá, spolužákova, Učitelčiny) a stupeň i u tvarů bez -ejší (menší, větší) a najde chybu schovanou ve 3. stupni.',
    f'Opakování po červeném semaforu: stejná naostro lekce „{TEMA}“ s jinými slovy a větami, aby si dítě druhy přídavných jmen a stupňování i s pastmi vyzkoušelo znovu.',
    [(p['znak'], p['text']) for p in json.load(open(D + H + '.json'))['uvod_pravidla']],
    json.load(open(D + H + '.json'))['slovnicek_pro_rodice'])

P = 'sd-prislovce-za-pridavne'; S = 'sd-podstatne-za-pridavne'; V = 'sd-sloveso-za-pridavne'
TM = 'pridavne-tvrde-za-mekke'; PT = 'pridavne-privlastnovaci-za-tvrde'; PN = 'privlastnovaci-neuzna'
Z = 'stupnovani-zamena'; NP = 'stupnovani-nepravidelne-pravidelne'; DJ = 'detektiv-jine-slovo'; DO = 'detektiv-oprava-jine-chyby'

# ---------- U1 ----------
ZAD1 = 'V každé řadě vyber přídavné jméno.\n\nA) chladně, chlad, chladí, chladný\n\nB) šetrnost, šetří, šetrný, šetrně\n\nC) závistivý, závistivě, závist, závidí\n\nD) mlčí, mlčenlivě, mlčenlivost, mlčenlivý'
u1 = uloha('cj-t3-l9nb-U1', 'rozcvicka',
    'Rozehřát test přídavného jména (jaký?) na čtyřčlenných řadách z jedné rodiny: přídavné jméno, příslovce, podstatné jméno a sloveso (Z1).', 4, ZAD1,
    [krok_dl('k1', 'Řada A', ('chladně', P), ('chlad', S), ('chladí', V), ('chladný', True)),
     krok_dl('k2', 'Řada B', ('šetrnost', S), ('šetří', V), ('šetrný', True), ('šetrně', P)),
     krok_dl('k3', 'Řada C', ('závistivý', True), ('závistivě', P), ('závist', S), ('závidí', V)),
     krok_dl('final', 'Řada D', ('mlčí', V), ('mlčenlivě', P), ('mlčenlivost', S), ('mlčenlivý', True))],
    th('Rozcvička opakuje test přídavného jména: ptáme se jaký? a slovo se hodí před jméno. Každá řada má čtyři slova z jedné rodiny: přídavné jméno, příslovce (říká jak), podstatné jméno (jde říct ten, ta) a sloveso (říká, co kdo nebo co dělá). Otázky jsou po příkladech: čtěte tu u příkladu, kde se dítě zasekne.',
       '#### A) chladně, chlad, chladí, chladný\n\nchladný (jaký vítr? chladný; chladně říká jak, chlad je název, chladí říká, co něco dělá)\n\n'
       '#### B) šetrnost, šetří, šetrný, šetrně\n\nšetrný (jaký kluk? šetrný; šetrnost je název, šetří říká, co kdo dělá, šetrně říká jak)\n\n'
       '#### C) závistivý, závistivě, závist, závidí\n\nzávistivý (jaký pohled? závistivý; závistivě říká jak, závist je název, závidí říká, co kdo dělá)\n\n'
       '#### D) mlčí, mlčenlivě, mlčenlivost, mlčenlivý\n\nmlčenlivý (jaký kamarád? mlčenlivý; mlčí říká, co kdo dělá, mlčenlivě říká jak, mlčenlivost je název)\n\n'
       '**Výsledek:** A) chladný, B) šetrný, C) závistivý, D) mlčenlivý',
       [q('A a B', '„Dej každé slovo z řady před slovo vítr nebo kluk. Které spojení řekne, jaký je?“'),
        q('C', '„U každého slova z řady C se zeptej: jaký? jak? co dělá? Které slovo odpoví na jaký?“'),
        q('D', '„Zkus každé slovo z řady D ve větě: Náš soused je ___. Které tam pasuje?“')],
       '„Vysvětli mi, proč šetrně není přídavné jméno, i když je ze stejné rodiny jako šetrný.“',
       'Na šetrně se ptám jak? (zachází šetrně), ne jaký? Přídavné jméno říká, jaký kdo je: šetrný kluk.',
       'Podívejte se na obrazovku dítěte. Vybere chladně, šetrně, závistivě nebo mlčenlivě: „Ptáš se jaký, nebo jak?“ Vybere chladí, šetří, závidí nebo mlčí: „Říká to, jaký kdo je, nebo co dělá?“ Vybere chlad, šetrnost, závist nebo mlčenlivost: „Jde před to říct ten nebo ta?“'),
    sem('Výborně — přídavná jména sedí i ve čtyřčlenných řadách. Pochvalte, že dítě zkoušelo otázku jaký, a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti tři slova: pečlivý, pečlivost, pečlivě. U každého řekne, jestli se na ně ptá jaký. Kontrola pro vás: jen pečlivý (jaký žák? pečlivý); pečlivost je název (ta pečlivost), pečlivě říká jak.',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše pod sebe chladný, chladně, chlad, chladí a ke každému připíše otázku: jaký?, jak?, ten/ten?, nebo co dělá? Ke slovu s jaký? dopíše jméno. {CERV} Kontrola pro vás: chladný – jaký?, chladně – jak?, chlad – ten chlad, chladí – co dělá.'),
    ZAD1.replace('vyber', 'zakroužkuj'))
u1['semafor']['cervena'] = u1['semafor']['cervena'].replace('ten/ten?', 'ten?')

# ---------- U2 ----------
ROLE3 = (('tvrdé',), ('měkké',), ('přivlastňovací',))
def druh(id, pop, spr):
    kod = {'měkké': {'tvrdé': TM, 'přivlastňovací': None}, 'tvrdé': {'měkké': TM, 'přivlastňovací': None},
           'přivlastňovací': {'tvrdé': PT, 'měkké': PN}}[spr]
    return krok_dl(id, pop, *[(r, True if r == spr else kod[r]) for r in ('tvrdé', 'měkké', 'přivlastňovací')])
ZAD2 = 'Jaké je tučné přídavné jméno: tvrdé, měkké, nebo přivlastňovací?\n\nA) **úterní** trénink\n\nB) **kamarádčin** batoh\n\nC) **mokrá** tráva\n\nD) **spolužákova** kalkulačka\n\nE) **odpolední** vyučování\n\nF) **prudký** kopec'
u2 = uloha('cj-t3-l9nb-U2', 'nova',
    'Rozlišit tvrdé, měkké a přivlastňovací přídavné jméno u šesti slov, i když stojí v jiném tvaru než u ten (mokrá, spolužákova).', 5, ZAD2,
    [druh('k1', 'A) úterní trénink', 'měkké'), druh('k2', 'B) kamarádčin batoh', 'přivlastňovací'),
     druh('k3', 'C) mokrá tráva', 'tvrdé'), druh('k4', 'D) spolužákova kalkulačka', 'přivlastňovací'),
     druh('k5', 'E) odpolední vyučování', 'měkké'), druh('final', 'F) prudký kopec', 'tvrdé')],
    th('Šest kroků se stejnou nabídkou. Test: přídavné jméno se řekne s ten, ta, to. Měkké konec nemění, tvrdé ho mění. Přivlastňovací odpovídá na čí? a je od jména osoby. Dvě slova jsou v jiném tvaru než u ten (mokrá, spolužákova): dítě je musí říct i s ten a to.',
       'A) úterní: měkké (úterní trénink, úterní hodina, úterní odpoledne: konec stejný)\n\nB) kamarádčin: přivlastňovací (čí batoh? kamarádčin, od slova kamarádka)\n\n'
       'C) mokrá: tvrdé (mokrý, mokrá, mokré: konec se mění)\n\nD) spolužákova: přivlastňovací (čí kalkulačka? spolužákova, od slova spolužák)\n\n'
       'E) odpolední: měkké (odpolední vyučování, odpolední svačina, odpolední výlet: konec stejný)\n\nF) prudký: tvrdé (prudký, prudká, prudké)\n\n'
       '**Výsledek:** A) měkké, B) přivlastňovací, C) tvrdé, D) přivlastňovací, E) měkké, F) tvrdé',
       [q('Celá úloha', '„Jaké tři druhy přídavných jmen znáš? Jak každý z nich poznáš?“'),
        q('Každý krok', '„Řekni to slovo s ten, ta a to, třeba s pes, kočka, kotě. Mění se jeho konec?“'),
        q('Každý krok', '„Zeptej se na to slovo čí? a jaký? Která otázka sedí? Je utvořené od slova pro osobu?“')],
       '„Vysvětli mi, proč spolužákova není tvrdé, i když se jí mění konec.“',
       'Odpovídá na čí? (čí kalkulačka?) a je od slova spolužák. Takové slovo je přivlastňovací, i když se mění: spolužákův, spolužákova.',
       'Podívejte se na obrazovku dítěte. U úterní nebo odpolední zvolí tvrdé, u mokrá nebo prudký měkké: „Řekni to s ten, ta, to. Mění se konec?“ U kamarádčin nebo spolužákova zvolí tvrdé či měkké: „Ptáš se jaký?, nebo čí?“ Zvolí přivlastňovací jinde: „Je to slovo od osoby?“'),
    sem('Výborně — druhy sedí i u slov v jiném tvaru. Pochvalte, že dítě zkoušelo ten, ta, to i otázku čí, a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti tři spojení: denní světlo, strýcův stan, levná čepice. U každého přídavného jména řekne, jestli je tvrdé, měkké, nebo přivlastňovací. Kontrola pro vás: denní měkké (denní světlo, denní práce), strýcův přivlastňovací (čí stan? od strýc), levná tvrdé (levný, levná).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě nakreslí tři sloupce: tvrdé, měkké, přivlastňovací. Řekněte mu slova lesní, strýcův, levný, babiččina, denní, bílá a ať je zapíše do sloupců. {CERV} Kontrola pro vás: tvrdé levný, bílá; měkké lesní, denní; přivlastňovací strýcův, babiččina.'),
    'Ke každému tučnému přídavnému jménu zakroužkuj: a) tvrdé b) měkké c) přivlastňovací\n\nA) **úterní** trénink\n\nB) **kamarádčin** batoh\n\nC) **mokrá** tráva\n\nD) **spolužákova** kalkulačka\n\nE) **odpolední** vyučování\n\nF) **prudký** kopec')

# ---------- U3 ----------
PREP = 'Mámina lesklá taška je menší než moje, ale pořád je ze všech nejpevnější.'
AUD = 'audio/cestina/t3/l9nb-u3.mp3'
def posl(id, pop, otazka, *opts):
    return {"id": id, "popisek": pop, "vstup": {"typ": "poslech", "audio": AUD, "prepis": PREP, "max_prehrani": 0,
            "otazka": otazka, "vnoreny_vstup": dl(*opts)}}
u3 = uloha('cj-t3-l9nb-U3', 'nova',
    'Poslechem (bez textu) poznat, od kterého slova je nepravidelný 2. stupeň menší, určit druh slova Mámina a najít ve slyšené větě 2. stupeň mezi dalšími přídavnými jmény.', 5,
    'Poslechni si větu. Pak odpověz na tři otázky. Nahrávku si můžeš pustit, kolikrát chceš.',
    [posl('k1', 'Otázka 1', 'Od kterého slova je utvořené slovo „menší“?', ('mírný', None), ('malý', True), ('mlsný', None), ('mělký', None)),
     posl('k2', 'Otázka 2', 'Jaké přídavné jméno je slovo „Mámina“?', ('tvrdé', PT), ('měkké', PN), ('přivlastňovací', True)),
     posl('final', 'Otázka 3', 'Které slovo z věty je ve 2. stupni?', ('lesklá', None), ('menší', True), ('nejpevnější', Z), ('Mámina', None))],
    th('Dítě větu jen slyší, text nevidí. Co v nahrávce zazní, máte sbalené pod „Co zazní v nahrávce“; nahlas to nečtěte. Otázky jsou tři. Krok 1: od kterého slova je menší (stupňuje se jinak). Krok 2: druh slova Mámina (od slova máma). Krok 3: které slovo je 2. stupeň, i když nemá -ejší.',
       'Otázka 1: malý (malý – menší – nejmenší; mírný dá mírnější, mlsný mlsnější, mělký mělčí nebo mělčejší)\n\n'
       'Otázka 2: přivlastňovací (čí taška? Mámina, od slova máma)\n\n'
       'Otázka 3: menší (srovnává dvě tašky; nejpevnější je 3. stupeň, lesklá 1. stupeň, Mámina je přivlastňovací)\n\n'
       '**Výsledek:** 1. malý, 2. přivlastňovací, 3. menší',
       [q('Celá úloha', '„O čem ta věta je? Řekni to vlastními slovy.“'),
        q('Krok 1', '„Řekni každé slovo z nabídky ve větě: Tahle krabice je ještě ___ než ta druhá. Které z nich dá menší?“'),
        q('Krok 2 a 3', '„Zeptej se na slova z nabídky: čí? jaký? Srovnává slovo dvě věci, vybírá ze všech, nebo nesrovnává nic?“')],
       '„Vysvětli mi, jak poznáš 2. stupeň, když slovo nekončí na -ejší.“',
       'Podívám se, jestli srovnává dvě věci: menší než moje. To dělá 2. stupeň. Některá slova se stupňují jinak: malý, menší, nejmenší.',
       'Podívejte se na obrazovku dítěte. V kroku 1 vybere mírný, mlsný nebo mělký: „Řekni 2. stupeň toho slova ve větě. Dá to menší?“ V kroku 2 zvolí tvrdé nebo měkké: „Ptáš se jaký?, nebo čí?“ V kroku 3 vybere nejpevnější: „Srovnává to dvě věci, nebo vybírá ze všech?“'),
    sem('Výborně — dítě jen poslechem poznalo stupeň i druh. Pochvalte, že si větu pouštělo znovu, a jděte dál.',
        'Zítra 5 minut, jen ústně. Řekněte dítěti větu: „Dědův stan je lepší než náš, ale ze všech nejtěžší.“ Dítě ji jen slyší. Řekne, od kterého slova je lepší, jaký druh je dědův a které slovo je 3. stupeň. Kontrola pro vás: lepší je od dobrý; dědův přivlastňovací (čí stan?); nejtěžší je 3. stupeň.',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše pod sebe malý, dobrý, velký a ke každému připíše 2. a 3. stupeň. Každý 2. stupeň řekne ve větě: Tenhle je ještě … {CERV} Kontrola pro vás: malý – menší – nejmenší, dobrý – lepší – nejlepší, velký – větší – největší.'),
    'Poslouchej nahrávku (pustí rodič). Můžeš si ji pustit, kolikrát chceš. Pak zakroužkuj odpovědi.\n\n1. Od kterého slova je utvořené slovo „menší“? — a) mírný b) malý c) mlsný d) mělký\n\n2. Jaké přídavné jméno je slovo „Mámina“? — a) tvrdé b) měkké c) přivlastňovací\n\n3. Které slovo z věty je ve 2. stupni? — a) lesklá b) menší c) nejpevnější d) Mámina')


# ---------- U4 ----------
RADY = ['suchý – sušší – nejsušší', 'dobrý – lepší – nejdobřejší', 'tuhý – tužší – nejtužší', 'drahý – dražší – nejdražší']
ZAD4 = 'Petr stupňoval čtyři přídavná jména:\n\n' + '\n\n'.join(RADY) + '\n\nU jednoho slova udělal **chybu**. Najdi ji.'
OPR = [('suchý – suchejší – nejsuchejší', DO), ('dobrý – lepší – nejlepší', True), ('tuhý – tuhší – nejtuhší', NP), ('drahý – drahší – nejdrahší', NP)]
u4 = uloha('cj-t3-l9nb-U4', 'detektiv',
    'Najít u spolužáka chybu schovanou až ve 3. stupni (dobrý – lepší – nejdobřejší) mezi správnými řadami, které vypadají neobvykle, a vybrat opravu.', 5, ZAD4,
    [krok_dl('k1', 'Kterou řadu má Petr špatně?', (RADY[0], DJ), (RADY[1], True), (RADY[2], DJ), (RADY[3], DJ)),
     krok_dl('final', 'Která oprava je správná?', *OPR)],
    th('Petr je vymyšlený spolužák. Tři řady má dobře, jednu špatně. Chyba je schovaná až ve 3. stupni a správné řady vypadají neobvykle (sušší, tužší, dražší). V kroku 1 dítě vybere chybnou řadu, v kroku 2 její opravu; nabídka má opravu ke každé řadě, správná je jen jedna.',
       'Chyba je v řadě dobrý: 2. stupeň lepší je dobře, 3. stupeň má být nejlepší.\n\nsuchý – sušší – nejsušší (správně)\n\ndobrý – lepší – nejlepší (Petr napsal nejdobřejší)\n\ntuhý – tužší – nejtužší (správně)\n\ndrahý – dražší – nejdražší (správně)\n\n**Výsledek:** krok 1 dobrý – lepší – nejdobřejší, krok 2 dobrý – lepší – nejlepší',
       [q('Celá úloha', '„Co Petr dělal? Jak se z 2. stupně udělá 3. stupeň?“'),
        q('Krok 1', '„U každé řady řekni 2. i 3. stupeň ve větě. Sedí všechny tvary, které Petr napsal?“'),
        q('Krok 2', '„Vezmi řadu, která nesedí. Jak ty tvary říkáš, když mluvíš? Který řádek nabídky to je?“')],
       '„Já budu Petr. Řekni mi, kde mám chybu a proč sušší chyba není.“',
       'Chybu máš u dobrý: 2. stupeň je lepší, tak 3. stupeň je nejlepší. Sušší je dobře: suchý, sušší, nejsušší.',
       'Podívejte se na obrazovku dítěte. V kroku 1 vybere řadu suchý, tuhý nebo drahý: „Přidej k 2. stupni nej-. Sedí to?“ (Ty řady jsou správně.) V kroku 2 vybere suchejší, tuhší nebo drahší: „Řekni ten tvar ve větě. Říká se tak?“'),
    sem('Výborně — Petrovu schovanou chybu dítě našlo i opravilo. Pochvalte, že kontrolovalo i 3. stupeň, a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti: „Petr napsal: velký – větší – nejvelkejší.“ Zeptejte se: „Má Petr pravdu? Jak to řekneš ve větě?“ Kontrola pro vás: nemá; správně je největší (k 2. stupni větší se přidá nej-).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše tři řady: tichý, krátký, blízký, a ke každé 2. a 3. stupeň. 3. stupeň utvoří tak, že k 2. stupni přidá nej-. {CERV} Kontrola pro vás: tichý – tišší – nejtišší, krátký – kratší – nejkratší, blízký – bližší – nejbližší.'),
    'Petr stupňoval čtyři přídavná jména:\n\n' + '\n\n'.join(RADY) + '\n\nU jednoho slova udělal chybu.\n\nA) Zakroužkuj řadu, kterou má Petr špatně.\n\nB) Zakroužkuj správnou opravu: ' + ' '.join(f'{"abcd"[i]}) {t}' for i, (t, _) in enumerate(OPR)))

# ---------- U5 ----------
T1 = 'Dědečkův soused nám půjčil kovový žebřík a venkovní lampu. Učitelčiny ostré nůžky leží v dolní zásuvce.'
T2 = 'Ema je nejstatečnější z party, ale Tomáš je rozumnější. Adam má větší batoh než Klára a šedou bundu. Nejvtipnější je ale kudrnatá Lucka.'
u5 = uloha('cj-t3-l9nb-U5', 'kontrolni',
    'Samostatně určit druh u šesti přídavných jmen v 1. stupni (i v jiném tvaru) a stupeň u šesti jiných (i větší bez -ejší).', 6,
    'V kroku 1 vyber u každého označeného přídavného jména druh. V kroku 2 vyber stupeň.',
    [role('k1', 'Druh přídavného jména', T1, [0, 4, 7, 9, 10, 14], ['tvrdé', 'měkké', 'přivlastňovací'],
          {0: 'přivlastňovací', 4: 'tvrdé', 7: 'měkké', 9: 'přivlastňovací', 10: 'tvrdé', 14: 'měkké'},
          [(9, 'tvrdé', PT), (7, 'tvrdé', TM), (10, 'měkké', TM), (0, 'měkké', PN)]),
     role('final', 'Stupeň přídavného jména', T2, [2, 8, 11, 16, 18, 21], ['1. stupeň', '2. stupeň', '3. stupeň'],
          {2: '3. stupeň', 8: '2. stupeň', 11: '2. stupeň', 16: '1. stupeň', 18: '3. stupeň', 21: '1. stupeň'},
          [(2, '2. stupeň', Z), (8, '3. stupeň', Z), (11, '3. stupeň', Z), (18, '2. stupeň', Z)])],
    th(VYS_KONTROLNI + 'V kroku 1 určí druh u šesti slov, v kroku 2 stupeň u šesti jiných. Pasti: Učitelčiny a ostré nejsou ve tvaru s ten; větší nemá -ejší ani nej-.',
       'Krok 1: Dědečkův přivlastňovací (čí soused? od dědeček)\n\nkovový tvrdé (kovový, kovová, kovové)\n\nvenkovní měkké (venkovní lampa, venkovní bazén: konec stejný)\n\nUčitelčiny přivlastňovací (čí nůžky? od učitelka)\n\nostré tvrdé (ostrý, ostrá, ostré)\n\ndolní měkké (dolní zásuvka, dolní patro: konec stejný)\n\n'
       'Krok 2: nejstatečnější 3. stupeň (vybírá z celé party)\n\nrozumnější 2. stupeň (srovnává Tomáše s Emou)\n\nvětší 2. stupeň (srovnává Adama a Kláru; od velký)\n\nšedou 1. stupeň (nic nesrovnává)\n\nNejvtipnější 3. stupeň (vybírá ze všech)\n\nkudrnatá 1. stupeň\n\n'
       '**Výsledek:** krok 1 přivlastňovací, tvrdé, měkké, přivlastňovací, tvrdé, měkké; krok 2 3., 2., 2., 1., 3., 1. stupeň',
       ['„Jak poznáš tvrdé, měkké a přivlastňovací přídavné jméno? A jak poznáš stupeň?“',
        '„Vezmi slovo, u kterého váháš. Řekni ho s ten, ta, to a zeptej se na něj: jaký?, nebo čí?“',
        '„U kroku 2: srovnává to slovo dvě osoby, vybírá jednu ze všech, nebo nesrovnává nic?“'],
       '„Vyber si jedno slovo z kroku 2 bez nej- a dokaž mi, jaký má stupeň.“',
       'Třeba větší: srovnává Adamův batoh s Klářiným, takže 2. stupeň. Šedou nesrovnává nic, to je 1. stupeň.',
       KONTROLNI_UVOD + 'Dědečkův nebo Učitelčiny jako tvrdé či měkké: „Ptáš se jaký?, nebo čí?“ venkovní, dolní, kovový nebo ostré špatně: „Mění se konec s ten, ta, to?“ Záměna stupňů: „Srovnává to dva, nebo vybírá ze všech?“ ' + KONTROLNI_SEMAFOR),
    sem('Výborně — druh i stupeň dítě určí samo i v delším textu. Pochvalte, že zkoušelo ten, ta, to i srovnání. Zítra můžete pokračovat další lekcí.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti větu: „Bratrův stan je lehčí než náš, ale nejpevnější je strýcův stan.“ Dítě řekne druh slova bratrův a stupeň slov lehčí a nejpevnější. Kontrola pro vás: bratrův přivlastňovací (čí stan?); lehčí 2. stupeň (srovnává dva), nejpevnější 3. stupeň (ze všech).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše větu: Tetin dům je menší než náš, ale nejkrásnější je lesní chata. Podtrhne přídavná jména a u každého připíše druh, nebo stupeň. {CERV} Kontrola pro vás: tetin přivlastňovací, menší 2. stupeň, nejkrásnější 3. stupeň, lesní měkké.'),
    '1. Nad každé tučné přídavné jméno napiš druh: **t** = tvrdé, **m** = měkké, **p** = přivlastňovací.\n\n**Dědečkův** soused nám půjčil **kovový** žebřík a **venkovní** lampu. **Učitelčiny** **ostré** nůžky leží v **dolní** zásuvce.\n\n2. Nad každé tučné přídavné jméno napiš stupeň číslem 1, 2, nebo 3.\n\nEma je **nejstatečnější** z party, ale Tomáš je **rozumnější**. Adam má **větší** batoh než Klára a **šedou** bundu. **Nejvtipnější** je ale **kudrnatá** Lucka.')

L['ulohy'] = [u1, u2, u3, u4, u5]
SL = ['chladný', 'chlad', 'chladit', 'šetrný', 'šetřit', 'závistivý', 'závist', 'závidět', 'mlčenlivý', 'mlčet',
      'úterní', 'kamarádka', 'mokrý', 'spolužák', 'odpolední', 'prudký', 'malý', 'mírný', 'mlsný', 'mělký', 'máma', 'lesklý', 'pevný',
      'dobrý', 'suchý', 'tuhý', 'drahý', 'dědeček', 'kovový', 'venkovní', 'učitelka', 'ostrý', 'dolní',
      'statečný', 'rozumný', 'velký', 'šedý', 'vtipný', 'kudrnatý', 'pečlivý', 'denní', 'strýc', 'levný', 'lesní', 'tichý', 'krátký', 'blízký', 'lehký']
KONTROLA_JISTOTA = "jista"
KONTROLA_POZNAMKA = ("B-varianta naostro lekce cj-t3-l9n (opakování po červené, ZADANI-OSMA §9 bod 4), autor 12. 10. 2026. "
  "Struktura 1:1 s cj-t3-l9n (5 úloh, stejné typy vstupů, počty kroků, dlaždic, slov a rolí, poslech U3 se 3 otázkami, stejné kódy a počty známých chyb), stejná obtížnost. "
  "Hodnocená slova a věty nejsou z cj-t3-l9/l9n/l9b ani z ostatních lekcí tématu 3 (kontrolováno skriptem); opakuje se jen uzavřená skupina nepravidelného stupňování (malý – menší v U3, dobrý v U4, velký – větší v U5; rozhodnutí vedoucího 12. 10.). "
  "Ověřeno v ÚJČ přes nastroje/ujc.sh 12. 10.: druh a rodina slov U1 (chladný/chladně/chlad/chladit, šetrný/šetrně/šetrnost/šetřit, závistivý/závistivě/závist/závidět, mlčenlivý/mlčenlivě/mlčenlivost/mlčet), druhy úterní, odpolední (SSČ: odpolední vyučování), mokrý, prudký, kovový, venkovní, ostrý, dolní; "
  "přivlastňovací kamarádčin, spolužákova, Mámina, Dědečkův, Učitelčiny podle id=400 a id=756 (k → č); stupně: malý – menší, mírný – mírnější, mlsný – mlsnější, mělký – mělčí/mělčejší, pevný – nejpevnější, suchý – sušší, tuhý – tužší, drahý – dražší (vše jen -ší, bez dublety), statečný, rozumný, vtipný, šedý, kudrnatý; "
  "suchejší, tuhší, drahší, nejdobřejší jsou záměrně chybné tvary (v tabulkách hesel nejsou). Křehký, hebký, vlhký vyřazeny (dvojí 2. stupeň). "
  "Indexy oznac_role přes tokenizuj, vzorová odpověď každého kroku a každá chybná dlaždice i známá chyba ověřeny přes vyhodnotKrok (/tmp/b-cj3nb/kontrola.mjs). Nahrávka t3/l9nb-u3.mp3 zatím chybí, řádek pro AUDIO.md je v cestina/Obsah/TEMA-3-B.md.")
L['kontrola'] = {"jistota": KONTROLA_JISTOTA, "poznamka": KONTROLA_POZNAMKA, "zkontroloval": "autor", "datum": "2026-10-09",
                 "zdroj": zdroje(SL), "testovaci_rodic": None}
uloz(L)
