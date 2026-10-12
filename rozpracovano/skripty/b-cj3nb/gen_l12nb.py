import sys
sys.path.insert(0, '/tmp/b-cj3nb')
from spol import *

H = 'cj-t3-l12n'
HJ = json.load(open(D + H + '.json'))
TEMA = 'Kontrola tématu: přídavná jména'
CERV = f'Potom zopakujte lekci „{TEMA}“.'
L, h = hlavicka(H, 'cj-t3-l12nb',
    'Dítě samo v diktátu i v delším textu napíše správně konce přídavných jmen (-ý, -í, -é, -ovi, -ovy, -ova) i tam, kde je jméno daleko nebo v jiném tvaru, určí druh i v jiném pádě a utvoří 2. i 3. stupeň slov, která se stupňují jinak.',
    f'Opakování po červeném semaforu: stejná kontrola „{TEMA}“ (naostro) s jinými větami a jiným diktátem, aby dítě znovu ukázalo druh, stupeň a konce přídavných jmen.',
    [(p['znak'], p['text']) for p in HJ['uvod_pravidla']], HJ['slovnicek_pro_rodice'])
TM = 'pridavne-tvrde-za-mekke'; PT = 'pridavne-privlastnovaci-za-tvrde'; PN = 'privlastnovaci-neuzna'
Z = 'stupnovani-zamena'; NP = 'stupnovani-nepravidelne-pravidelne'; DJ = 'detektiv-jine-slovo'; DO = 'detektiv-oprava-jine-chyby'
YI = 'koncovka-prid-y-za-i'; IY = 'koncovka-prid-i-za-y'; SH = 'pridavne-shoda-s-jinym-jmenem'
PIY = 'privlastnovaci-i-za-y'; PYI = 'privlastnovaci-y-za-i'
YIE = ['ý', 'í', 'é']; IYA = ['i', 'y', 'a']

# ---------- U1 ----------
ZAD1 = 'Odpověz na čtyři otázky.\n\nA) Které slovo je měkké přídavné jméno?\n\nB) Který tvar je 3. stupeň slova mokrý?\n\nC) Na náměstí nás vítají ___ obyvatelé.\n\nD) V kabinetu visí ___ pláště.'
u1 = uloha('cj-t3-l12nb-U1', 'rozcvicka',
    'Zopakovat z lekcí 9–11 druh (najít měkké mezi čtyřmi slovy), 3. stupeň slova, které mění základ (mokrý), koncovku -í u obyvatelé a -ovy u pláště.', 4, ZAD1,
    [krok_dl('k1', 'Řada A', ('plochý', TM), ('boční', True), ('kuchařčin', PN), ('hranatý', TM)),
     krok_dl('k2', 'Řada B', ('mokřejší', Z), ('nejmokřejší', True), ('nejmokrejší', NP)),
     krok_dl('k3', 'Řada C', ('vlídný', YI), ('vlídní', True), ('vlídné', None)),
     krok_dl('final', 'Řada D', ('školníkovi', PIY), ('školníkovy', True), ('školníkova', None))],
    th('Rozcvička z celého tématu: druh (A), stupeň (B) a konce (C, D). V A se hledá měkké slovo mezi čtyřmi, v B je 3. stupeň slova, které mění základ (mokrý – mokřejší), a v C stojí jméno obyvatelé. Otázky jsou po příkladech: čtěte tu u příkladu, kde se dítě zasekne.',
       '#### A) plochý, boční, kuchařčin, hranatý\n\nboční (boční dveře, boční kapsa, boční okno: konec stejný; plochý a hranatý konec mění, kuchařčin odpovídá na čí?)\n\n#### B) mokrý\n\nnejmokřejší (mokrý – mokřejší – nejmokřejší; mokřejší je 2. stupeň)\n\n#### C) ___ obyvatelé\n\nvlídní (ti obyvatelé → -í)\n\n#### D) ___ pláště\n\nškolníkovy (ty pláště → -ovy)\n\n**Výsledek:** A) boční, B) nejmokřejší, C) vlídní, D) školníkovy',
       [q('A', '„Řekni každé slovo z nabídky s ten, ta a to. Kterému se konec nemění? Které odpovídá na čí?“'),
        q('B', '„Řekni nejdřív 2. stupeň ve větě: Tahle tráva je ještě ___ než ta druhá. Co přidáš pro 3. stupeň?“'),
        q('C a D', '„Najdi jméno za mezerou a řekni před ně ten, ti, nebo ty. Který konec k tomu patří?“')],
       '„Vysvětli mi, jak poznáš měkké přídavné jméno mezi čtyřmi slovy.“',
       'Řeknu každé s ten, ta, to. Měkké má pořád stejný konec: boční vchod, boční kapsa. Plochý a hranatý konec mění, kuchařčin odpovídá na čí?.',
       'Podívejte se na obrazovku dítěte. V A vybere plochý nebo hranatý: „Mění se konec s ten, ta, to?“ Vybere kuchařčin: „Ptáš se jaký?, nebo čí?“ V B mokřejší: „Srovnáváš dvě, nebo vybíráš ze všech?“ V C vlídný: „Ten obyvatelé, nebo ti obyvatelé?“ V D školníkovi: „Ti pláště, nebo ty pláště?“'),
    sem('Výborně — celé téma drží. Pochvalte, že dítě zkoušelo testy nahlas, a jděte dál.',
        'Zítra 5 minut, jen ústně. Zeptejte se: „Jaký je 3. stupeň od řídký? A jaký druh je zimní?“ Kontrola pro vás: nejřidší (řídký – řidší – nejřidší); zimní je měkké (zimní bunda, zimní večer).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra řekněte dítěti čtyři spojení: vlídní obyvatelé, školníkovy pláště, školníkovi pomocníci, vlídný soused. Dítě je napíše a u každého řekne ten, ti, nebo ty. {CERV} Kontrola pro vás: vlídní obyvatelé (ti), školníkovy pláště (ty), školníkovi pomocníci (ti), vlídný soused (ten).'),
    'Zakroužkuj správnou odpověď.\n\nA) Měkké přídavné jméno je: a) plochý b) boční c) kuchařčin d) hranatý\n\nB) 3. stupeň slova mokrý: a) mokřejší b) nejmokřejší c) nejmokrejší\n\nC) Na náměstí nás vítají ___ obyvatelé. a) vlídný b) vlídní c) vlídné\n\nD) V kabinetu visí ___ pláště. a) školníkovi b) školníkovy c) školníkova')

# ---------- U2 ----------
T2 = 'Strýčkovo štěně spí v pohodlném slaměném košíku. Maminčiny zástěry visí u postranních dveří a vedle nich leží kmotrův deštník. Sváteční oběd voní až do podkrovního pokoje.'
u2 = uloha('cj-t3-l12nb-U2', 'nova',
    'Určit druh u osmi přídavných jmen v textu, i když stojí v jiném pádě (pohodlném, postranních, podkrovního) nebo v jiném tvaru (Strýčkovo, Maminčiny).', 5,
    'U každého označeného přídavného jména vyber, jestli je tvrdé, měkké, nebo přivlastňovací.',
    [role('final', 'Tvoje odpověď', T2, [0, 4, 5, 7, 11, 17, 19, 24], ['tvrdé', 'měkké', 'přivlastňovací'],
          {0: 'přivlastňovací', 4: 'tvrdé', 5: 'tvrdé', 7: 'přivlastňovací', 11: 'měkké', 17: 'přivlastňovací', 19: 'měkké', 24: 'měkké'},
          [(7, 'tvrdé', PT), (11, 'tvrdé', TM), (4, 'měkké', TM), (0, 'měkké', PN)])],
    th('Dítě u osmi přídavných jmen vybírá druh. Slova jsou v různých pádech (pohodlném, postranních, podkrovního), a tak je dítě musí nejdřív říct s ten, ta, to: pohodlný, postranní, podkrovní. Měkké konec nemění, tvrdé ano. Přivlastňovací odpovídá na čí? a je od jména osoby.',
       'Strýčkovo: přivlastňovací (čí štěně? od strýček)\n\npohodlném: tvrdé (pohodlný, pohodlná, pohodlné)\n\nslaměném: tvrdé (slaměný, slaměná, slaměné)\n\nMaminčiny: přivlastňovací (čí zástěry? od maminka)\n\npostranních: měkké (postranní vchod, postranní ulička, postranní okno: konec stejný)\n\nkmotrův: přivlastňovací (čí deštník? od kmotr)\n\nSváteční: měkké (sváteční oběd, sváteční nálada: konec stejný)\n\npodkrovního: měkké (podkrovní pokoj, podkrovní místnost: konec stejný)\n\n**Výsledek:** přivlastňovací, tvrdé, tvrdé, přivlastňovací, měkké, přivlastňovací, měkké, měkké',
       ['„Jak poznáš tvrdé, měkké a přivlastňovací přídavné jméno? Řekni ke každému test.“',
        '„Slovo v jiném tvaru řekni nejdřív s ten, pak s ta a to. Mění se jeho konec?“',
        '„Zeptej se na každé slovo čí?. Které na tu otázku odpovídá a od jakého jména je utvořené?“'],
       '„Vysvětli mi, proč je postranních měkké, i když končí jinak než postranní.“',
       'Je to tvar slova postranní: u postranních dveří. Postranní řeknu s ten, ta, to a konec se nemění: postranní vchod, postranní ulička, postranní okno.',
       'Podívejte se na obrazovku dítěte. Strýčkovo, Maminčiny nebo kmotrův jako tvrdé či měkké: „Ptáš se jaký?, nebo čí?“ pohodlném nebo slaměném jako měkké, postranních, Sváteční nebo podkrovního jako tvrdé: „Řekni to slovo s ten, ta, to. Mění se konec?“'),
    sem('Výborně — druhy sedí i u slov v jiných tvarech. Pochvalte, že dítě převádělo slova na ten, ta, to, a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti tři spojení: v lesní chatě, tetiny boty, na kulatém stole. U každého přídavného jména řekne druh. Kontrola pro vás: lesní měkké (lesní cesta, lesní potok), tetiny přivlastňovací (čí? od teta), kulatém tvrdé (kulatý, kulatá).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě nakreslí tři sloupce: tvrdé, měkké, přivlastňovací. Řekněte mu: postranní, kmotrův, slaměný, sváteční, maminčin, pohodlný. Zapíše je do sloupců. {CERV} Kontrola pro vás: tvrdé slaměný, pohodlný; měkké postranní, sváteční; přivlastňovací kmotrův, maminčin.'),
    'Nad každé tučné přídavné jméno napiš druh: **t** = tvrdé, **m** = měkké, **p** = přivlastňovací.\n\n**Strýčkovo** štěně spí v **pohodlném** **slaměném** košíku. **Maminčiny** zástěry visí u **postranních** dveří a vedle nich leží **kmotrův** deštník. **Sváteční** oběd voní až do **podkrovního** pokoje.')

# ---------- U3 ----------
ST = [('A', 'dobrý', 2, [('lepší', True), ('dobřejší', NP), ('nejlepší', Z)]),
      ('B', 'malý', 3, [('menší', Z), ('nejmenší', True), ('nejmalejší', NP)]),
      ('C', 'prudký', 2, [('prudkejší', NP), ('nejprudší', Z), ('prudší', True)]),
      ('D', 'velký', 3, [('největší', True), ('nejvelkejší', NP), ('větší', Z)]),
      ('E', 'tuhý', 2, [('nejtužší', Z), ('tužší', True), ('tuhejší', NP)]),
      ('F', 'dlouhý', 3, [('nejdloužší', NP), ('delší', Z), ('nejdelší', True)])]
ZAD3 = 'Vyber správný tvar.\n\n' + '\n\n'.join(f'{a}) {s}. stupeň slova {w}' for a, w, s, _ in ST)
u3 = uloha('cj-t3-l12nb-U3', 'nova',
    'Utvořit střídavě 2. a 3. stupeň šesti přídavných jmen, která se stupňují jinak (dobrý, malý, velký, dlouhý; prudký, tuhý se změnou základu), a nezaměnit stupně.', 5, ZAD3,
    [krok_dl(['k1', 'k2', 'k3', 'k4', 'k5', 'final'][i], f'{a}) {w} – {s}. stupeň', *o) for i, (a, w, s, o) in enumerate(ST)],
    th('Šest slov, která se stupňují jinak: čtyři úplně jinak (dobrý – lepší), dvě se změnou konce základu (prudký – prudší). Střídá se 2. a 3. stupeň, takže dítě musí číst i popisek kroku. U každého slova je v nabídce správný tvar, tvar utvořený jako u ostatních slov a druhý stupeň místo třetího nebo naopak.',
       'A) dobrý – lepší (nejlepší je 3. stupeň)\n\nB) malý – menší – nejmenší\n\nC) prudký – prudší (nejprudší je 3. stupeň)\n\nD) velký – větší – největší\n\nE) tuhý – tužší (nejtužší je 3. stupeň)\n\nF) dlouhý – delší – nejdelší\n\n**Výsledek:** lepší, nejmenší, prudší, největší, tužší, nejdelší',
       [q('Celá úloha', '„Co je 2. a co 3. stupeň? Jak je od sebe poznáš?“'),
        q('Krok 1 až 6', '„Řekni nejdřív 2. stupeň ve větě: Tenhle je ještě ___ než ten druhý. Který tvar zní česky?“'),
        q('Když jde o 3. stupeň', '„Vezmi 2. stupeň, který ti zní dobře, a přidej k němu nej-. Je ten tvar v nabídce?“')],
       '„Vysvětli mi, proč se neříká nejmalejší, i když se říká malý.“',
       'Malý se stupňuje jinak: malý, menší, nejmenší. 3. stupeň vznikne z 2. stupně, když přidám nej-.',
       'Podívejte se na obrazovku dítěte. Vybere dobřejší, nejmalejší, prudkejší, nejvelkejší, tuhejší nebo nejdloužší: „Řekni to ve větě. Říká se tak?“ Vybere jiný stupeň, než chce krok: „Chce krok 2., nebo 3. stupeň? Má ten tvar nej-?“'),
    sem('Výborně — 2. i 3. stupeň sedí i u slov, která se stupňují jinak. Pochvalte, že dítě zkoušelo tvary ve větě, a jděte dál.',
        'Zítra 5 minut, jen ústně. Zeptejte se: „Jaký je 2. a 3. stupeň od suchý a drahý?“ Kontrola pro vás: sušší – nejsušší, dražší – nejdražší.',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše dobrý, malý, prudký, dlouhý a ke každému 2. a 3. stupeň. Každý 2. stupeň řekne ve větě: Tenhle je ještě … {CERV} Kontrola pro vás: lepší, nejlepší; menší, nejmenší; prudší, nejprudší; delší, nejdelší.'),
    'Zakroužkuj správný tvar.\n\n' + '\n\n'.join(f'{a}) {s}. stupeň slova {w}: ' + ' '.join(f'{"abc"[j]}) {t}' for j, (t, _) in enumerate(o)) for a, w, s, o in ST))

# ---------- U4 ----------
V4 = 'Adamovy sestřenice jsou dnes zamlklé, ale jeho psi jsou zase rozdováděný.'
u4 = uloha('cj-t3-l12nb-U4', 'detektiv',
    'Najít u spolužáka chybu koncovka-prid-y-za-i na konci dlouhé věty, daleko od jména (psi … rozdováděný), mezi správnými slovy, která vypadají podezřele (Adamovy, zamlklé).', 5,
    f'Petr napsal větu a v konci přídavného jména udělal **jednu** chybu:\n\n{V4}\n\nNajdi ji.',
    [{"id": "k1", "popisek": "Klikni na slovo s chybou.", "vstup": {"typ": "klik_ve_textu", "text": V4, "cil": "slova", "min": 1, "max": 1},
      "spravne": [10], "zname_chyby": [{"navic": [0, 4, 7], "typ_chyby": DJ}]},
     krok_dl('final', 'Co řekneš před jméno u chybného slova?', ('ten', YI), ('ti', True), ('ty', DO), ('ta', DO))],
    th('Petr je vymyšlený spolužák a má jednu chybu. Chyba je na konci dlouhé věty, daleko od svého jména, a ve větě jsou dvě slova, která vypadají podezřele, ale jsou správně (Adamovy, zamlklé). V kroku 2 dítě vybere, co řekne před jméno, ke kterému chybné slovo patří.',
       'Chyba je rozdováděný: kdo je rozdováděný? psi → ti psi → rozdovádění.\n\nrozdováděný → rozdovádění (ti psi, -í)\n\nAdamovy sestřenice (správně; ty sestřenice, -ovy)\n\nzamlklé (správně; ty sestřenice jsou zamlklé)\n\n**Výsledek:** krok 1 rozdováděný, krok 2 ti',
       [q('Celá úloha', '„Najdi v Petrově větě všechna přídavná jména. Kdo takový je?“'),
        q('Krok 1', '„U každého přídavného jména řekni, kdo takový je, a před to jméno ten, ti, ty, nebo ta. Sedí konec?“'),
        q('Krok 1 a 2', '„Hlídej i přídavná jména, která stojí až za slovem jsou. Ke kterému jménu patří?“')],
       '„Já budu Petr. Řekni mi, kde mám chybu a proč Adamovy chyba není.“',
       'Máš rozdováděný, ale rozdovádění jsou psi: ti psi, takže -í. Adamovy sestřenice máš dobře: ty sestřenice, -ovy.',
       'Podívejte se na obrazovku dítěte. Klikne na Adamovy nebo zamlklé: „Kdo takový je? Ten, ti, nebo ty?“ (Petr to má dobře.) Klikne na psi: „Je to přídavné jméno?“ V kroku 2 zvolí ten: „Je pes jeden, nebo jich je víc?“ Zvolí ty nebo ta: „Ke kterému jménu to patří?“'),
    sem('Výborně — dítě chybu našlo i na konci dlouhé věty a ověřilo ji testem. Pochvalte to a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti: „Petr napsal: Kuchařovi pomocníci jsou po obědě unavený.“ Zeptejte se: „Má Petr pravdu? Jak to ověříš?“ Kontrola pro vás: nemá; ti pomocníci → unavení (-í). Kuchařovi má dobře (ti pomocníci).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra napište dítěti tři věty: Psi jsou rozdováděný. Psi jsou rozdovádění. Sestřenice jsou rozdováděné. Dítě škrtne chybnou větu a u ostatních řekne, kdo takový je. {CERV} Kontrola pro vás: chybná je první věta; ti psi → rozdovádění, ty sestřenice → rozdováděné.'),
    f'Petr napsal větu a v konci přídavného jména udělal jednu chybu:\n\n{V4}\n\nA) Podtrhni slovo s chybou.\n\nB) Co řekneš před jméno, ke kterému patří? Zakroužkuj: a) ten b) ti c) ty d) ta')

# ---------- U5 ----------
VETY = ['Zruční kuchaři vaří večeři.', 'Tomášovy černé kopačky leží v šatně.', 'Strýčkův věrný pes čeká u dveří.', 'Adamovi fanoušci jsou ohromení.']
T5 = 'Ráno se v kempu probouzejí Tomášov_ vychovatelé. Jejich řidič je dochviln_ a rozcuchan_ děti už stojí u autobusu. Lucka si půjčila Adamov_ brýle a průvodcov_ pomocníci nakládají objemn_ kufry. Na vyhřát_m molu se opalují znaven_ kluci. Na stole leží řidičov_ mapy a košík s voňav_m pečivem. Večer jsou všichni kluci spálen_ a Tomášov_ ponožky schnou na šňůře.'
MZ = [IYA, YIE, YIE, IYA, IYA, YIE, YIE, YIE, IYA, YIE, YIE, IYA]
dikt = {"id": "k1", "popisek": "Napiš věty",
        "vstup": {"typ": "diktat", "vety": [{"audio": f"audio/cestina/t3/l12nb-d{i + 1}.mp3", "text": v} for i, v in enumerate(VETY)],
                  "max_prehrani": 2, "hodnotit_interpunkci": False, "hodnotit_velikost": False},
        "spravne": None,
        "chyby_ocekavane": [{"veta": 0, "slovo": 0, "typ_chyby": YI}, {"veta": 1, "slovo": 0, "typ_chyby": PIY},
                            {"veta": 2, "slovo": 1, "typ_chyby": IY}, {"veta": 3, "slovo": 0, "typ_chyby": PYI},
                            {"veta": 3, "slovo": 3, "typ_chyby": YI}]}
u5 = uloha('cj-t3-l12nb-U5', 'kontrolni',
    'Týdenní kontrola: napsat v diktátu (pět hlídaných slov) a doplnit v delším textu koncovky přídavných jmen (-ý/-í/-é, -ovi/-ovy/-ova); barva týdne z dvanácti mezer.', 6,
    '1. Poslechni si čtyři věty a napiš je.\n\n2. Doplň konce přídavných jmen.',
    [dikt, doplnit('final', 'Tvoje odpověď', T5, MZ, ['i', 'ý', 'é', 'y', 'i', 'é', 'é', 'í', 'y', 'ý', 'í', 'y'],
                   [(0, 'y', PYI), (3, 'i', PIY), (5, 'í', SH), (10, 'ý', YI)])],
    th('Týdenní kontrolní úloha: dítě ji řeší samo, vy jen sledujete; otázky použijte, až když se úplně zasekne. V kroku 1 píše čtyři věty podle nahrávky (pouští ji aplikace, vy nic nečtete, každou větu jde pustit dvakrát). V kroku 2 doplní dvanáct konců. Barvu týdne určuje krok 2. Čárky a velká písmena se v diktátu nehodnotí.',
       'Krok 1 (diktát): ' + ' '.join(VETY) + ' (hlídá se Zruční, Tomášovy, věrný, Adamovi, ohromení)\n\n'
       'Krok 2: Tomášovi vychovatelé (ti → -ovi)\n\nřidič je dochvilný (ten → -ý)\n\nrozcuchané děti (ty → -é)\n\nAdamovy brýle (ty → -ovy)\n\nprůvodcovi pomocníci (ti → -ovi)\n\nobjemné kufry (ty kufry → -é; pomocníci jsou jiné jméno)\n\nna vyhřátém molu (na tom molu → -é)\n\nznavení kluci (ti → -í)\n\nřidičovy mapy (ty → -ovy)\n\ns voňavým pečivem (s tím pečivem → -ý)\n\nkluci jsou spálení (ti → -í)\n\nTomášovy ponožky (ty → -ovy)\n\n'
       '**Výsledek:** krok 2: i, ý, é, y, i, é, é, í, y, ý, í, y',
       ['„Jaký test použiješ u každého konce přídavného jména? Řekni ho vlastními slovy.“',
        '„Najdi u mezery, kdo nebo co takové je. Řekni před to jméno ten, ti, ty, nebo ta.“',
        '„U slov na -ov_ zkus před jméno ti, ty i ta. U ostatních hlídej, jestli jméno není v jiném tvaru.“'],
       '„Vyber si dvě hlídaná slova z diktátu a vysvětli mi, proč mají takový konec.“',
       'Třeba Tomášovy kopačky: řeknu ty kopačky, takže -ovy s y. A zruční kuchaři: ti kuchaři, takže -í.',
       KONTROLNI_UVOD + 'v diktátu zručný, Tomášovi, věrní, Adamovy, ohromený: „Řekni před jméno ten, ti, nebo ty.“ V kroku 2 záměna -ovi a -ovy: „Ti, nebo ty?“ -í u kufry, -ý u spálen_: „Kdo nebo co takové je?“ ' + KONTROLNI_SEMAFOR),
    sem('Výborně — konce přídavných jmen dítě píše samo v diktátu i v dlouhém textu. Pochvalte test ten, ti, ty. Zítra můžete pokračovat další lekcí.',
        'Zítra 5 minut, jen ústně, potom další lekce. Přečtěte dítěti: Řidičovi pomocníci nesou objemné tašky. Dítě řekne, jak napíše konec slov řidičovi a objemné a proč. Kontrola pro vás: řidičovi (ti pomocníci, -ovi), objemné (ty tašky, -é).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra řekněte dítěti pomalu: Zruční kuchaři nesou řidičovy mapy. Dítě větu napíše a u přídavných jmen řekne, ke kterému jménu patří a co před něj řekne. {CERV} Kontrola pro vás: Zruční (ti kuchaři, -í), řidičovy (ty mapy, -ovy).'),
    '1. Poslouchej čtyři věty (pustí ti je rodič) a napiš je na linky pod úlohou.\n\n2. Doplň konce přídavných jmen. U slov na -ov_ doplň i, y, nebo a, u ostatních ý, í, nebo é.\n\n' + T5,
    tydenni=True, semafor_tydne=HJ['ulohy'][4]['semafor_tydne'])

L['ulohy'] = [u1, u2, u3, u4, u5]
SL = ['plochý', 'boční', 'kuchařka', 'hranatý', 'mokrý', 'vlídný', 'obyvatel', 'školník', 'plášť',
      'strýček', 'pohodlný', 'slaměný', 'maminka', 'postranní', 'kmotr', 'sváteční', 'podkrovní',
      'dobrý', 'malý', 'prudký', 'velký', 'tuhý', 'dlouhý', 'suchý', 'drahý', 'řídký',
      'sestřenice', 'zamlklý', 'rozdováděný',
      'zručný', 'kuchař', 'vařit', 'večeře', 'kopačka', 'ležet', 'šatna', 'věrný', 'pes', 'čekat', 'dveře', 'ohromený', 'fanoušek',
      'vychovatel', 'řidič', 'dochvilný', 'rozcuchaný', 'dítě', 'brýle', 'průvodce', 'pomocník', 'objemný', 'kufr', 'vyhřátý', 'molo', 'znavený',
      'mapa', 'voňavý', 'pečivo', 'spálený', 'ponožka']
POZN = ("B-varianta naostro lekce cj-t3-l12n (opakování po červené, ZADANI-OSMA §9 bod 4), autor 12. 10. 2026. "
  "Struktura 1:1 s cj-t3-l12n (5 úloh, rozcvička 4 dlaždice se stejnými kódy, druh u 8 slov se stejnými indexy, 6 × stupňování se střídáním 2. a 3. stupně a stejným rozložením kódů, detektiv s chybou na indexu 10, týdenní U5: diktát 4 věty a 20 slov s 5 hlídanými slovy a stejnými kódy, doplňovačka 12 mezer se stejnou nabídkou a pořadím konců, semafor_tydne beze změny). "
  "Stupňování podle rozhodnutí vedoucího 12. 10.: v U3 čtyři položky z uzavřené skupiny (dobrý, malý, velký, dlouhý), dvě se změnou základu (prudký – prudší, tuhý – tužší); U1 B mokrý – nejmokřejší; ze 7 položek stupňování 4 z uzavřené skupiny. "
  "Hodnocená slova a věty nejsou z cj-t3-l12/l12n/l12b ani z ostatních lekcí tématu 3; tvary Adamovi/Adamovy/Tomášovi/Tomášovy jen s jiným podstatným jménem. "
  "Ověřeno v ÚJČ přes nastroje/ujc.sh 12. 10.: druhy (boční, postranní, sváteční, podkrovní měkké; plochý, hranatý, pohodlný, slaměný tvrdé), stupně (mokrý – mokřejší, prudký – prudší, tuhý – tužší jen jednou podobou; dobřejší, nejmalejší, prudkejší, nejvelkejší, tuhejší, nejdloužší, nejmokrejší v tabulkách nejsou), přídavná jména u mezer a v diktátu, pomnožné brýle; přivlastňovací Strýčkovo, Maminčiny, kmotrův, kuchařčin, školníkovy, průvodcovi, řidičovy podle id=400 a id=756. "
  "Diktát slovo po slově podle OSNOVA §2.2 (každé slovo T3 nebo Z5, slovesa v přítomném čase, bez s/z, mě/mně a i/y po obojetné souhlásce v kořeni), hodnotit_interpunkci false, chyby_ocekavane holé kódy a ověřené přes vyhodnotKrok. "
  "Indexy přes tokenizuj, vzorová odpověď a každá známá chyba ověřeny přes vyhodnotKrok (/tmp/b-cj3nb/kontrola.mjs). Nahrávky t3/l12nb-d1 až d4 zatím chybí, řádky pro AUDIO.md jsou v cestina/Obsah/TEMA-3-B.md.")
L['kontrola'] = {"jistota": "jista", "poznamka": POZN, "zkontroloval": "autor", "datum": "2026-10-09",
                 "zdroj": zdroje(SL), "testovaci_rodic": None}
uloz(L)
