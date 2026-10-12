import sys
sys.path.insert(0, '/tmp/b-cj3nb')
from spol import *

H = 'cj-t3-l11n'
HJ = json.load(open(D + H + '.json'))
TEMA = 'Přivlastňovací přídavná jména'
CERV = f'Potom zopakujte lekci „{TEMA}“.'
L, h = hlavicka(H, 'cj-t3-l11nb',
    'Dítě samo doplní konec přivlastňovacího přídavného jména (-ovi, -ovy, -ova) i u jmen ve 4. pádě a u slov jako vrata, kalhoty, plavky a odliší ho od jména ve 3. pádě (podává osušku Adamovi).',
    f'Opakování po červeném semaforu: stejná naostro lekce „{TEMA}“ s jinými větami a slovy, aby si dítě konce -ovi, -ovy, -ova i rozdíl čí × komu vyzkoušelo znovu.',
    [(p['znak'], p['text']) for p in HJ['uvod_pravidla']], HJ['slovnicek_pro_rodice'])
YI = 'koncovka-prid-y-za-i'; IY = 'koncovka-prid-i-za-y'; SH = 'pridavne-shoda-s-jinym-jmenem'
PIY = 'privlastnovaci-i-za-y'; PYI = 'privlastnovaci-y-za-i'; PN = 'privlastnovaci-neuzna'; SP = 'sd-podstatne-za-pridavne'
DJ = 'detektiv-jine-slovo'; DO = 'detektiv-oprava-jine-chyby'
YIE = ['ý', 'í', 'é']; IYA = ['i', 'y', 'a']

# ---------- U1 ----------
R1 = ['Soustředěn_ hráči přemýšlejí.', 'Lidé jsou z ohňostroje okouzlen_.', 'Kluci si oblékli kostkovan_ košile.', 'Opraven_ výtah konečně jezdí.']
u1 = uloha('cj-t3-l11nb-U1', 'rozcvicka',
    'Zopakovat z lekce 10 koncovku -ý/-í/-é tvrdého přídavného jména testem ten/ti/ty, i když jméno stojí daleko nebo vedle stojí jiné jméno.', 4,
    'Doplň -ý, -í, nebo -é.\n\n' + '\n\n'.join(f'{"ABCD"[i]}) {r}' for i, r in enumerate(R1)),
    [doplnit('k1', 'Řada A', R1[0], [YIE], ['í'], [(0, 'ý', YI)]),
     doplnit('k2', 'Řada B', R1[1], [YIE], ['í'], [(0, 'ý', YI)]),
     doplnit('k3', 'Řada C', R1[2], [YIE], ['é'], [(0, 'í', SH)]),
     doplnit('final', 'Řada D', R1[3], [YIE], ['ý'], [(0, 'í', IY)])],
    th('Rozcvička opakuje minulou lekci: konec přídavného jména typu malý. V nabídce jsou tři konce a jméno nestojí vždy hned vedle. Test: dítě najde, kdo nebo co takové je, a řekne před to ten (-ý), ti (-í), nebo ty (-é). Otázky jsou po příkladech: čtěte tu u příkladu, kde se dítě zasekne.',
       '#### A) Soustředěn_ hráči\n\nSoustředění (ti hráči → -í)\n\n#### B) Lidé jsou okouzlen_\n\nokouzlení (kdo je okouzlený? lidé → ti lidé → -í)\n\n#### C) kostkovan_ košile\n\nkostkované (ty košile → -é; kluci jsou jiné jméno)\n\n#### D) Opraven_ výtah\n\nOpravený (ten výtah → -ý)\n\n**Výsledek:** A) í, B) í, C) é, D) ý',
       [q('A a B', '„Kdo takový je? Řekni před to jméno ten, ti, nebo ty. Který konec k tomu patří?“'),
        q('C', '„Ke kterému jménu patří slovo s mezerou? Řekni před ně ten, ti, nebo ty.“'),
        q('D', '„Kolik výtahů jezdí? Co řekneš před slovo výtah?“')],
       '„Vysvětli mi, proč se v řadě C nepíše -í, i když jsou ve větě kluci.“',
       'Slovo s mezerou patří ke košile, ne ke kluci. Řeknu ty košile, tak -é: kostkované.',
       'Podívejte se na obrazovku dítěte. V A nebo B napíše -ý: „Ten, nebo ti?“ V B hledá jméno vedle: „Kdo je okouzlený?“ V C napíše -í: „Ke kterému jménu to patří: kluci, nebo košile?“ V D napíše -í: „Kolik jich je?“'),
    sem('Výborně — konce z minulé lekce drží. Pochvalte, že dítě zkoušelo ten, ti a ty, a jděte dál.',
        'Zítra 5 minut, jen ústně. Zeptejte se: „Jak napíšeš konec slova soustředěný ve spojeních soustředěný hráč, soustředění hráči a soustředěné hráčky?“ Kontrola pro vás: ten hráč -ý, ti hráči -í, ty hráčky -é.',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše tři sloupce: ten, ti, ty. Řekněte mu: opravený výtah, okouzlení lidé, kostkované košile. Dítě zapíše každé spojení do správného sloupce. {CERV} Kontrola pro vás: ten opravený výtah, ti okouzlení lidé, ty kostkované košile.'),
    'Doplň -ý, -í, nebo -é.\n\n' + '\n\n'.join(f'{"ABCD"[i]}) {r}' for i, r in enumerate(R1)))

# ---------- U2 ----------
T2 = 'Kuchařov_ pomocníci krájejí zeleninu. Rybářov_ udice leží u vody. Pekařov_ vrata jsou zamčená. Kapitánov_ fanoušci slaví výhru. Lucka pozdravila učitelov_ syny. Adamov_ kalhoty visí ve skříni. Tomášov_ křečci běhají v kolečku. Myslivcov_ štěňata spí v boudě.'
u2 = uloha('cj-t3-l11nb-U2', 'nova',
    'Doplnit -ovi, -ovy, nebo -ova v přivlastňovacím přídavném jménu podle ti/ty/ta, i u jmen jen v množném čísle (vrata, kalhoty) a ve 4. pádě (pozdravila učitelovy syny).', 5,
    'Doplň i, y, nebo a.',
    [doplnit('final', 'Tvoje odpověď', T2, [IYA] * 8, ['i', 'y', 'a', 'i', 'y', 'y', 'i', 'a'],
             [(0, 'y', PYI), (4, 'i', PIY), (5, 'i', PIY), (6, 'y', PYI)])],
    th('Přivlastňovací přídavné jméno od mužského jména (kuchařův, Adamův) má v množném čísle -ovi, -ovy, nebo -ova. V nabídce je i a (ta štěňata → myslivcova) a jména jsou těžší: vrata a kalhoty jsou jen v množném čísle, syny jsou ve 4. pádě. Test: ti, ty, nebo ta před jméno.',
       'Kuchařovi pomocníci (ti pomocníci → -ovi)\n\nRybářovy udice (ty udice → -ovy)\n\nPekařova vrata (ta vrata → -ova)\n\nKapitánovi fanoušci (ti fanoušci → -ovi)\n\npozdravila učitelovy syny (pozdravila ty syny → -ovy)\n\nAdamovy kalhoty (ty kalhoty → -ovy)\n\nTomášovi křečci (ti křečci → -ovi)\n\nMyslivcova štěňata (ta štěňata → -ova)\n\n**Výsledek:** i, y, a, i, y, y, i, a',
       ['„Co je přivlastňovací přídavné jméno? Od jakých slov se tvoří?“',
        '„U každé mezery řekni jméno vedle ní s ti, ty, nebo ta. Co se hodí?“',
        '„Když jméno není v 1. pádě, řekni celou větu jednou s ti a jednou s ty. Co zní správně?“'],
       '„Vysvětli mi, proč se píše Adamovy kalhoty, i když má Adam jen jedny.“',
       'Kalhoty se říkají jen v množném čísle: ty kalhoty. Proto Adamovy s y.',
       'Podívejte se na obrazovku dítěte. U pomocníci, fanoušci nebo křečci napíše y: „Ti, nebo ty?“ U udice, syny nebo kalhoty napíše i: „Ty, nebo ti?“ U vrata nebo štěňata napíše i nebo y: „Ta vrata, nebo ty vrata?“ (Ti → -ovi, ty → -ovy, ta → -ova.)'),
    sem('Výborně — -ovi, -ovy i -ova sedí. Pochvalte, že dítě zkoušelo ti, ty a ta, a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti tři spojení: kovářovy kleště, kovářovi synové, kovářova kola. U každého řekne ti, ty, nebo ta a jaké písmeno napíše na konci. Kontrola pro vás: ty kleště → y, ti synové → i, ta kola → a.',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše tři sloupce: ti, ty, ta. Řekněte mu čtyři slova: kalhoty, pomocníci, vrata, udice. Zapíše je do sloupců a před každé připíše pekařov s i, y, nebo a. {CERV} Kontrola pro vás: ti pomocníci → pekařovi; ty kalhoty, ty udice → pekařovy; ta vrata → pekařova.'),
    'Doplň i, y, nebo a.\n\n' + T2)

# ---------- U3 ----------
PREP = 'Ema podala Adamovi Tomášovy hokejky a Adamovi fanoušci jen žasli.'
AUD = 'audio/cestina/t3/l11nb-u3.mp3'
def posl(id, pop, otazka, *opts):
    return {"id": id, "popisek": pop, "vstup": {"typ": "poslech", "audio": AUD, "prepis": PREP, "max_prehrani": 0,
            "otazka": otazka, "vnoreny_vstup": dl(*opts)}}
u3 = uloha('cj-t3-l11nb-U3', 'nova',
    'Poslechem rozlišit podstatné jméno Adamovi ve 3. pádě (komu?) a přídavné jméno Adamovi (čí?) a podle smyslu vybrat, jak se píše slovo, které zní „Tomášovi“.', 5,
    'Poslechni si větu. Pak odpověz na tři otázky. Nahrávku si můžeš pustit, kolikrát chceš.',
    [posl('k1', 'Otázka 1', 'Jaký slovní druh je první slovo „Adamovi“ ve větě?', ('přídavné jméno', SP), ('podstatné jméno', True)),
     posl('k2', 'Otázka 2', 'Jaký slovní druh je druhé slovo „Adamovi“ ve větě?', ('přídavné jméno', True), ('podstatné jméno', PN)),
     posl('final', 'Otázka 3', 'Jak se píše slovo, které ve větě stojí před slovem „hokejky“?', ('Tomášovi', PIY), ('Tomášovy', True), ('Tomášova', None))],
    th('Dítě větu jen slyší, text nevidí. Co v nahrávce zazní, máte sbalené pod „Co zazní v nahrávce“; nahlas to nečtěte. První Adamovi odpovídá na komu? (jméno Adam), druhé na čí? (přídavné jméno). V otázce 3 zní slovo před hokejky stejně jako Tomášovi a dítě podle smyslu a testu ti/ty vybere, jak se píše.',
       'Otázka 1: podstatné jméno (podala komu? Adamovi; jméno Adam ve 3. pádě)\n\nOtázka 2: přídavné jméno (čí fanoušci? Adamovi)\n\nOtázka 3: Tomášovy (čí hokejky? ty hokejky → -ovy)\n\n**Výsledek:** 1. podstatné jméno, 2. přídavné jméno, 3. Tomášovy',
       [q('Celá úloha', '„O čem ta věta je? Řekni to vlastními slovy.“'),
        q('Krok 1 a 2', '„Zeptej se na každé slovo Adamovi slovem z věty: komu?, nebo čí? Která otázka sedí?“'),
        q('Krok 3', '„Řekni před slovo hokejky ti, ty, nebo ta. Co se hodí?“')],
       '„Vysvětli mi, jak poznáš, jestli napíšeš Tomášovi, nebo Tomášovy.“',
       'Zeptám se čí?, nebo komu?. U čí? řeknu před jméno ti, nebo ty: ty hokejky, takže Tomášovy s y. U komu? je to jméno Tomáš, Tomášovi s i.',
       'Podívejte se na obrazovku dítěte. V kroku 1 (Otázka 1) zvolí přídavné jméno: „Podala komu? Je to něčí, nebo Adam sám?“ V kroku 2 (Otázka 2) zvolí podstatné jméno: „Čí jsou ti fanoušci?“ V kroku 3 (Otázka 3) vybere Tomášovi nebo Tomášova: „Ti, ty, nebo ta hokejky?“'),
    sem('Výborně — dítě poslechem rozlišilo čí a komu a vybralo správný konec. Pochvalte, že si větu pouštělo znovu, a jděte dál.',
        'Zítra 5 minut, jen ústně. Řekněte dítěti větu: „Kuchařovi pomocníci uvařili kuchařovi čaj.“ Dítě ji jen slyší. U obou slov kuchařovi řekne, jestli se na ně ptá čí, nebo komu. Kontrola pro vás: první čí? (přídavné jméno, ti pomocníci), druhé komu? (kuchař ve 3. pádě).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra napište dítěti dvě věty: Ema půjčila Tomášovi pero. Tomášovi bratranci hrají šachy. Dítě ke slovu Tomášovi v každé větě připíše otázku čí, nebo komu. {CERV} Kontrola pro vás: v první větě komu? (jméno Tomáš), ve druhé čí? (přídavné jméno).'),
    'Poslouchej nahrávku (pustí rodič). Můžeš si ji pustit, kolikrát chceš. Pak zakroužkuj odpovědi.\n\n1. Jaký slovní druh je první slovo „Adamovi“ ve větě? — a) přídavné jméno b) podstatné jméno\n\n2. Jaký slovní druh je druhé slovo „Adamovi“ ve větě? — a) přídavné jméno b) podstatné jméno\n\n3. Jak se píše slovo, které ve větě stojí před slovem „hokejky“? — a) Tomášovi b) Tomášovy c) Tomášova')

# ---------- U4 ----------
V4 = 'Po lyžování leží v chatě instruktorovi hole, trenérčiny rukavice a bratrancův batoh.'
u4 = uloha('cj-t3-l11nb-U4', 'detektiv',
    'Najít u spolužáka chybu privlastnovaci-i-za-y (instruktorovi hole) uprostřed věty mezi dalšími přivlastňovacími přídavnými jmény v jiných tvarech a říct, co se řekne před jméno.', 5,
    f'Petr napsal větu a v konci přivlastňovacího přídavného jména udělal **jednu** chybu:\n\n{V4}\n\nNajdi ji.',
    [{"id": "k1", "popisek": "Klikni na slovo s chybou.", "vstup": {"typ": "klik_ve_textu", "text": V4, "cil": "slova", "min": 1, "max": 1},
      "spravne": [5], "zname_chyby": [{"navic": [7, 10, 6], "typ_chyby": DJ}]},
     krok_dl('final', 'Co řekneš před jméno u chybného slova?', ('ti', PIY), ('ty', True), ('ta', DO), ('ten', DO))],
    th('Petr je vymyšlený spolužák a má jednu chybu. Ve větě jsou tři přivlastňovací přídavná jména v různých tvarech a chyba není na začátku. V kroku 2 dítě vybere, co řekne před jméno, ke kterému chybné slovo patří. Past: trenérčiny a bratrancův jsou správně.',
       'Chyba je instruktorovi: ty hole → instruktorovy.\n\ninstruktorovi hole → instruktorovy hole (ty hole, -ovy)\n\ntrenérčiny rukavice (správně; čí rukavice? trenérčiny, ty rukavice)\n\nbratrancův batoh (správně; ten batoh)\n\n**Výsledek:** krok 1 instruktorovi, krok 2 ty',
       [q('Celá úloha', '„Která slova v Petrově větě odpovídají na otázku čí? Ke kterému jménu patří?“'),
        q('Krok 1', '„U každého slova, které odpovídá na čí, řekni jeho jméno s ten, ti, ty, nebo ta. Sedí konec?“'),
        q('Krok 1 a 2', '„Řekni nahlas před každé jméno ve větě ten, ti, ty, nebo ta. Co se kam hodí?“')],
       '„Já budu Petr. Řekni mi, kde mám chybu a proč trenérčiny chyba není.“',
       'Máš instruktorovi hole, ale řekneme ty hole, takže instruktorovy s y. Trenérčiny rukavice máš dobře: ty rukavice, trenérčiny.',
       'Podívejte se na obrazovku dítěte. Klikne na trenérčiny nebo bratrancův: „Čí to je? Řekni jméno s ten, ti, ty.“ (Petr to má dobře.) Klikne na hole: „Odpovídá to slovo na čí?“ V kroku 2 zvolí ti: „Ti hole, nebo ty hole?“ Zvolí ta nebo ten: „Ke kterému jménu to patří?“'),
    sem('Výborně — dítě chybu našlo i mezi třemi podobnými slovy a ověřilo ji testem ti/ty. Pochvalte to a jděte dál.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti: „Petr napsal: strýcovi lyže stojí v předsíni.“ Zeptejte se: „Má Petr pravdu? Jak to ověříš?“ Kontrola pro vás: nemá; ty lyže → strýcovy (y).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra napište dítěti: instruktorov_ hole, instruktorov_ žáci, instruktorov_ kola. Dítě před každé jméno řekne ti, ty, nebo ta a doplní i, y, nebo a. {CERV} Kontrola pro vás: instruktorovy hole (ty), instruktorovi žáci (ti), instruktorova kola (ta).'),
    f'Petr napsal větu a v konci přivlastňovacího přídavného jména udělal jednu chybu:\n\n{V4}\n\nA) Podtrhni slovo s chybou.\n\nB) Co řekneš před jméno, ke kterému patří? Zakroužkuj: a) ti b) ty c) ta d) ten')

# ---------- U5 ----------
T5 = 'Hasičov_ děti stavějí na pláži hrad z písku a jejich rodiče jsou dojat_. Na písčit_m břehu se smějí Tomášov_ přátelé. Tomášov_ plavky schnou na zábradlí, v lodičce leží Adamov_ vesla a Ema tam hledá plavčíkov_ ploutve. Opálen_ kluci pijí ledov_ čaj. Klára podává osušku Adamov_.'
MZ = [IYA, YIE, YIE, IYA, IYA, IYA, IYA, YIE, YIE, IYA]
u5 = uloha('cj-t3-l11nb-U5', 'kontrolni',
    'Samostatně doplnit v textu deset konců: -ovi/-ovy/-ova přivlastňovacích (i děti, plavky, ploutve ve 4. pádě) a -ý/-í/-é tvrdých přídavných jmen a odlišit jméno Adam ve 3. pádě (podává osušku Adamovi).', 6,
    'Doplň konce přídavných jmen.',
    [doplnit('final', 'Tvoje odpověď', T5, MZ, ['y', 'í', 'é', 'i', 'y', 'a', 'y', 'í', 'ý', 'i'],
             [(0, 'i', PIY), (3, 'y', PYI), (9, 'y', PYI), (1, 'ý', YI)])],
    th(VYS_KONTROLNI + 'Deset mezer: u slov na -ov_ volí i, y, nebo a, u ostatních ý, í, nebo é. Pasti: Hasičov_ děti (ty děti), na písčit_m břehu (jiný tvar) a poslední Adamov_: tam se ptáme komu?, ne čí?, je to jméno Adam.',
       'Hasičovy děti (ty děti → -ovy)\n\nrodiče jsou dojatí (ti rodiče → -í)\n\nna písčitém břehu (na tom břehu → -é)\n\nTomášovi přátelé (ti → -ovi)\n\nTomášovy plavky (ty plavky → -ovy)\n\nAdamova vesla (ta vesla → -ova)\n\nhledá plavčíkovy ploutve (ty ploutve → -ovy)\n\nOpálení kluci (ti → -í)\n\nledový čaj (ten → -ý)\n\npodává osušku Adamovi (komu? Adamovi; jméno ve 3. pádě)\n\n**Výsledek:** y, í, é, i, y, a, y, í, ý, i',
       ['„Jak poznáš, co patří na konec slova na -ov_? A co na konec slova typu malý?“',
        '„U každé mezery najdi jméno, ke kterému slovo patří. Řekni před něj ten, ti, ty, nebo ta.“',
        '„Zeptej se na každé slovo na -ov_: čí?, nebo komu? Která otázka sedí?“'],
       '„Vyber si jedno slovo na -ov_ a dokaž mi testem, co tam patří.“',
       'Třeba Hasičovy děti: řeknu ty děti, takže -ovy s y. Nebo na konci: podává osušku komu? Adamovi, to je jméno, tak i.',
       KONTROLNI_UVOD + 'u děti, plavky nebo ploutve napíše i: „Ty, nebo ti?“ U přátelé y: „Ti, nebo ty?“ U vesla: „Ta vesla, nebo ty?“ Na konci Adamovy: „Čí, nebo komu?“ U ostatních: „Kdo nebo co takové je?“ ' + KONTROLNI_SEMAFOR),
    sem('Výborně — konce přivlastňovacích i ostatních přídavných jmen sedí i v těžkém textu. Pochvalte test ti/ty/ta. Zítra můžete pokračovat další lekcí.',
        'Zítra 5 minut, jen ústně. Přečtěte dítěti dvě věty: „Rybářovy sítě visí venku.“ a „Ema přinesla čaj rybářovi.“ U každého slova rybářov… řekne, jestli napíše i, nebo y. Kontrola pro vás: rybářovy sítě (ty sítě, y), rybářovi (komu? jméno, i).',
        f'Dnes už nepokračujte, pochvalte snahu. Připravte: papír a tužku. Zítra ať dítě napíše tři sloupce: ti, ty, ta. Řekněte mu: hasičovi kluci, hasičovy děti, hasičova kola, hasičovy plavky. Dítě zapíše každé spojení do správného sloupce. {CERV} Kontrola pro vás: ti – hasičovi kluci; ty – hasičovy děti, hasičovy plavky; ta – hasičova kola.'),
    'Doplň konce přídavných jmen. U slov na -ov_ doplň i, y, nebo a, u ostatních ý, í, nebo é.\n\n' + T5)

L['ulohy'] = [u1, u2, u3, u4, u5]
SL = ['soustředěný', 'hráč', 'člověk', 'okouzlený', 'kostkovaný', 'košile', 'opravený', 'výtah',
      'kuchař', 'pomocník', 'rybář', 'udice', 'pekař', 'vrata', 'kapitán', 'fanoušek', 'syn', 'kalhoty', 'křeček', 'myslivec', 'štěně',
      'podat', 'hokejka', 'žasnout', 'bratranec', 'instruktor', 'hůl', 'trenérka', 'rukavice', 'batoh',
      'hasič', 'dítě', 'dojatý', 'písčitý', 'přítel', 'plavky', 'veslo', 'plavčík', 'ploutev', 'opálený', 'ledový', 'čaj', 'osuška']
POZN = ("B-varianta naostro lekce cj-t3-l11n (opakování po červené, ZADANI-OSMA §9 bod 4), autor 12. 10. 2026. "
  "Struktura 1:1 s cj-t3-l11n (5 úloh, stejné typy vstupů, 4 × 1 + 8 + 10 mezer se stejnou nabídkou i pořadím správných konců, poslech U3 se 3 otázkami ve stejném pořadí čí/komu, detektiv s chybou na indexu 5 a pastmi na 6, 7, 10, stejné kódy a počty známých chyb), stejná obtížnost. "
  "Hodnocená slova a věty nejsou z cj-t3-l11/l11n/l11b ani z ostatních lekcí tématu 3; tvary Adamovi/Adamovy/Tomášovi/Tomášovy/Tomášova se opakují vždy s jiným podstatným jménem (rozhodnutí vedoucího 12. 10.). "
  "Ověřeno v ÚJČ přes nastroje/ujc.sh 12. 10.: tvrdá přídavná jména u mezer (soustředěný, okouzlený, kostkovaný, opravený, dojatý, písčitý, opálený, ledový), pomnožná jména vrata (s.), kalhoty, plavky (ž.); přivlastňovací kuchařův, rybářův, pekařův, kapitánův, učitelův, myslivcův, instruktorův, plavčíkův, hasičův, bratrancův, trenérčin podle id=400 a id=756. "
  "Nahrávka: druhé Adamovi nejde číst jako 3. pád (žasnout 3. pád nemá), první ne jako přivlastňovací (Adamovi Tomášovy hokejky by byly dva přívlastky bez smyslu); u Tomášov_ hokejky dává smysl jen čí? → ty hokejky → Tomášovy. Poslední mezera U5 (podává osušku Adamov_) je 3. pád, přivlastňovací čtení by žádalo Adamovu (není v nabídce). "
  "Indexy detektiva přes tokenizuj, vzorová odpověď a každá známá chyba ověřeny přes vyhodnotKrok (/tmp/b-cj3nb/kontrola.mjs). Nahrávka t3/l11nb-u3.mp3 zatím chybí, řádek pro AUDIO.md je v cestina/Obsah/TEMA-3-B.md.")
L['kontrola'] = {"jistota": "jista", "poznamka": POZN, "zkontroloval": "autor", "datum": "2026-10-09",
                 "zdroj": zdroje(SL, (400, 756)), "testovaci_rodic": None}
uloz(L)
