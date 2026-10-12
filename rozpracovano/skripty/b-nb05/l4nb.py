import sys; sys.path.insert(0, '/tmp/b-nb05')
from spolecne import dl, uloz
ID = "M8-T05-L4NB"
T = "Kontrola: zlomky II"

u1 = {
  "id": f"{ID}-U1", "typ": "rozcvicka", "cas_min": 4,
  "zadani": "Spočítej na papíře a vyber správnou odpověď. Zlomky ve výsledku jsou v základním tvaru.\n\n" +
            r"A) $\frac{6}{35} \cdot \frac{7}{9}$" + "\n\n" + r"B) $\frac{12}{25} : \frac{4}{5}$" + "\n\n" +
            r"C) $1\frac{5}{9} \cdot \frac{3}{4}$" + "\n\n" + r"D) Z $36$ ubereš $\frac{2}{9}$. Kolik jsou $\frac{3}{4}$ zbytku?",
  "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": r"Příklad A: $\frac{6}{35} \cdot \frac{7}{9}$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$\frac{14}{15}$", chyba="upravil-jen-cast-zlomku"),
      dl("b", r"$\frac{2}{45}$", chyba="upravil-jen-cast-zlomku"),
      dl("c", r"$\frac{2}{15}$", ok=True)]}},
    {"id": "k2", "popisek": r"Příklad B: $\frac{12}{25} : \frac{4}{5}$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$\frac{3}{5}$", ok=True),
      dl("b", r"$\frac{5}{3}$", chyba="prevratil-prvni"),
      dl("c", r"$\frac{48}{125}$", chyba="delil-bez-prevraceni")]}},
    {"id": "k3", "popisek": r"Příklad C: $1\frac{5}{9} \cdot \frac{3}{4}$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$\frac{1}{2}$", chyba="smisene-scital-celou-cast"),
      dl("b", r"$1\frac{5}{12}$", chyba="smisene-nasobil-po-castech"),
      dl("c", r"$1\frac{1}{6}$", ok=True)]}},
    {"id": "final", "popisek": r"Příklad D: $\frac{3}{4}$ zbytku", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$27$", chyba="z-celku-misto-ze-zbytku"),
      dl("b", r"$7$", chyba="zlomek-z-cisla-jen-deleni"),
      dl("c", r"$6$", chyba="zamenil-cast-a-zbytek"),
      dl("d", r"$21$", ok=True)]}},
  ],
  "tahak": {
    "vysvetleni": "Dítě jen vybírá. Každý příklad je z jedné lekce tématu: A násobení, B dělení, C smíšené číslo, D část ze zbytku. Otázky jsou po příkladech, první patří k A i C: čtěte tu u příkladu, kde se dítě zasekne.",
    "reseni": "\n\n".join([
      r"#### A) $\frac{6}{35} \cdot \frac{7}{9}$",
      r"$= \frac{6 \cdot 7}{35 \cdot 9}$ (čitatel krát čitatel, jmenovatel krát jmenovatel)",
      r"$= \frac{2 \cdot 1}{5 \cdot 3} = \frac{2}{15}$ (šestka s devítkou a sedmička s třiceti pěti se zkrátí)",
      r"#### B) $\frac{12}{25} : \frac{4}{5}$",
      r"$= \frac{12}{25} \cdot \frac{5}{4}$ (převrátí se zlomek za dvojtečkou)",
      r"$= \frac{3 \cdot 1}{5 \cdot 1} = \frac{3}{5}$ (dvanáctka se čtyřkou a pětka s dvaceti pěti se zkrátí)",
      r"#### C) $1\frac{5}{9} \cdot \frac{3}{4}$",
      r"$1\frac{5}{9} = \frac{14}{9}$ (jedna celá je devět devítin, a pět navíc)",
      r"$\frac{14}{9} \cdot \frac{3}{4} = \frac{7 \cdot 1}{3 \cdot 2} = \frac{7}{6}$ (čtrnáctka se čtyřkou a trojka s devítkou se zkrátí)",
      r"$\frac{7}{6} = 1\frac{1}{6}$ (zpět na smíšené číslo)",
      r"#### D) $\frac{3}{4}$ zbytku",
      r"$36 : 9 \cdot 2 = 8$ (ubráno, dvě devítiny)",
      r"$36 - 8 = 28$ (zbytek)",
      r"$28 : 4 \cdot 3 = 21$ (tři čtvrtiny zbytku)",
      r"**Výsledek:** A) $\frac{2}{15}$, B) $\frac{3}{5}$, C) $1\frac{1}{6}$, D) $21$"]),
    "otazky": [
      {"k": "A a C", "text": "„Neklikej, spočítej na papíře: co uděláš se smíšeným číslem a co se dá zkrátit, ještě než začneš násobit?“"},
      {"k": "B", "text": "„Kterým zlomkem tu dělíš? Co s ním uděláš, než začneš násobit?“"},
      {"k": "D", "text": "„Kolik zbude, když z třiceti šesti ubereš dvě devítiny? Z jakého čísla pak bereš tři čtvrtiny?“"},
    ],
    "otocena_role": "„Vysvětli mi, proč u příkladu D nejsou výsledek tři čtvrtiny z třiceti šesti.“",
    "otocena_role_odpoved": "Protože dvě devítiny, tedy osm, už jsou pryč. Tři čtvrtiny se berou jen ze zbytku, z dvaceti osmi, a to je dvacet jedna.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. A $\frac{14}{15}$, $\frac{2}{45}$: krátí jen dole, nebo jen nahoře. Zeptejte se: „Čím dělíš nahoře a čím dole?“ (Stejným číslem.) B $\frac{5}{3}$, $\frac{48}{125}$: převrací první, nebo nic. C $1\frac{5}{12}$, $\frac{1}{2}$: po částech, špatný převod. D $27$, $6$, $7$: jiný základ, nebo jen dělí.",
  },
  "semafor": {
    "zelena": "Výborně — násobení, dělení, smíšené číslo i část ze zbytku sedí. Pochvalte, že u každého příkladu nejdřív rozmyslelo postup, a jděte dál.",
    "oranzova": r"Zítra 5 minut, na papír. Ukažte dítěti na telefonu $\frac{5}{8} \cdot \frac{4}{15}$, $\frac{6}{7} : \frac{3}{14}$ a $1\frac{1}{3} \cdot \frac{3}{8}$. Ať u každého řekne, co udělá nejdřív, a spočítá. Kontrola pro vás: $\frac{1}{6}$; $\frac{6}{7} \cdot \frac{14}{3} = 4$; $\frac{4}{3} \cdot \frac{3}{8} = \frac{1}{2}$.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 25 knoflíků nebo kostek jako bonbony. Zítra: „Máš 25 bonbonů. Pětinu sníš, čtvrtinu zbytku dáš kamarádovi.“ Ať dítě knoflíky odsouvá a řekne, kolik sní, kolik zbude a kolik dá. Pak ať samo zapíše $25 : 5 = 5$, $25 - 5 = 20$, $20 : 4 = 5$. Potom zopakujte lekci „Kontrola: zlomky II“. Kontrola pro vás: sní 5, zbude 20, dá 5.",
  },
  "tisk": {"zadani": "Spočítej a zakroužkuj správnou odpověď. Zlomky ve výsledku jsou v základním tvaru.\n\n" +
    r"A) $\frac{6}{35} \cdot \frac{7}{9}$ — a) $\frac{14}{15}$ b) $\frac{2}{45}$ c) $\frac{2}{15}$" + "\n\n" +
    r"B) $\frac{12}{25} : \frac{4}{5}$ — a) $\frac{3}{5}$ b) $\frac{5}{3}$ c) $\frac{48}{125}$" + "\n\n" +
    r"C) $1\frac{5}{9} \cdot \frac{3}{4}$ — a) $\frac{1}{2}$ b) $1\frac{5}{12}$ c) $1\frac{1}{6}$" + "\n\n" +
    r"D) Z $36$ ubereš $\frac{2}{9}$. Kolik jsou $\frac{3}{4}$ zbytku? — a) $27$ b) $7$ c) $6$ d) $21$"},
}

vyraz2 = r"5 - 3\frac{5}{9} : 2\frac{2}{9}"
radky = [r"$= 5 - \frac{32}{9} : \frac{20}{9}$", r"$= \frac{13}{9} : \frac{20}{9}$", r"$= \frac{13}{9} \cdot \frac{9}{20}$", r"$= \frac{13}{20}$"]
k2m = [r"$= 5 - \frac{32}{9} \cdot \frac{20}{9}$", r"$= 5 - \frac{32}{9} \cdot \frac{9}{20}$", r"$= 5 - \frac{9}{32} \cdot \frac{20}{9}$"]
u2 = {
  "id": f"{ID}-U2", "typ": "detektiv", "cas_min": 5,
  "zadani": f"Petr počítal příklad\n\n$${vyraz2}$$\n\na udělal **jednu** chybu. Najdi ji.\n\n" + "\n\n".join(f"{i+1}. řádek: {r}" for i, r in enumerate(radky)),
  "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": "Klikni na řádek s chybou", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("r1", radky[0], chyba="oznacil-radek-pred-chybou", stitek="1. řádek"),
      dl("r2", radky[1], ok=True, stitek="2. řádek"),
      dl("r3", radky[2], chyba="nasel-az-dusledek", stitek="3. řádek"),
      dl("r4", radky[3], chyba="nasel-az-dusledek", stitek="4. řádek")]}},
    {"id": "k2", "popisek": "Jak má chybný řádek vypadat správně?", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", k2m[0], chyba="delil-bez-prevraceni"),
      dl("b", k2m[1], ok=True),
      dl("c", k2m[2], chyba="prevratil-prvni")]}},
    {"id": "final", "popisek": "Výsledek", "vstup": {"typ": "zlomek"},
     "spravne": {"c": 17, "j": 5},
     "zname_chyby": [{"c": 13, "j": 20, "typ_chyby": "scital-pred-nasobenim"}, {"c": 35, "j": 8, "typ_chyby": "prevratil-prvni"}, {"c": 18, "j": 5, "typ_chyby": "odcital-zlomek-od-celeho-spatne"}],
     "kontrola_tvaru": "zakladni_tvar"},
  ],
  "tahak": {
    "vysvetleni": "Petr je vymyšlený spolužák. Čte se: „pět minus tři celé a pět devítin děleno dvěma celými a dvěma devítinami“. Chyba je jedna a řádky za ní jsou spočítané dobře, jen ze špatného čísla. Pozor: všechny výpočty v Petrových řádcích jsou početně správně, chyba je v postupu.",
    "reseni": "\n\n".join([
      "Chyba je ve 2. řádku: Petr nejdřív odečetl. Dělení ale má přednost před odčítáním.",
      r"$= 5 - \frac{32}{9} : \frac{20}{9}$ (převod smíšených čísel na zlomky)",
      r"$= 5 - \frac{32}{9} \cdot \frac{9}{20}$ (dělení má přednost, krát převrácený zlomek)",
      r"$= 5 - \frac{32}{20} = 5 - \frac{8}{5}$ (devítky se zkrátí, pak zkrácení čtyřmi)",
      r"$= \frac{25}{5} - \frac{8}{5} = \frac{17}{5}$ (pět celých je dvacet pět pětin)",
      r"Dlaždice $5 - \frac{32}{9} \cdot \frac{20}{9}$ a $5 - \frac{9}{32} \cdot \frac{20}{9}$ nesedí (první nepřevrací nic, druhá převrací první zlomek)",
      r"**Výsledek:** $\frac{17}{5} = 3\frac{2}{5}$"]),
    "otazky": [
      {"k": "Celá úloha", "text": "„Přečti mi příklad nahlas. Jaké početní operace v něm jsou a v jakém pořadí se počítají?“"},
      {"k": "Krok 1", "text": "„Vezmi Petrovy řádky postupně. U každého řekni, co Petr udělal: převedl, odečetl, převrátil, nebo vynásobil?“"},
      {"k": "Krok 1 a 2", "text": "„U každého řádku se zeptej: počítá Petr operace ve správném pořadí? Co má přednost?“"},
    ],
    "otocena_role": "„Představ si, že jsem Petr. Vysvětli mi, proč nesmím nejdřív odečíst pět minus tři celé a pět devítin.“",
    "otocena_role_odpoved": "Protože dělení má přednost před odčítáním. Nejdřív se vydělí tři celé a pět devítin dvěma celými a dvěma devítinami, vyjde osm pětin, a teprve ty se odečtou od pěti.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. 1. řádek je správně, 3. a 4. jen počítají ze špatného čísla. Zeptejte se: „Co má přednost, minus, nebo děleno?“ (Děleno.) Výsledek $\frac{13}{20}$: opíše Petra; $\frac{35}{8}$: převrátí první zlomek; $\frac{18}{5}$: od pěti ubere celou a zlomek nechá. „Kolik pětin je pět celých?“ (Dvacet pět.)",
  },
  "semafor": {
    "zelena": "Výborně — chybu v pořadí operací našlo, i když všechna čísla v řádcích byla spočítaná dobře. Pochvalte to a jděte dál.",
    "oranzova": r"Zítra 5 minut. Ukažte dítěti na telefonu, jak Petr počítá: $5 - 2\frac{1}{2} : \frac{5}{6} = 2\frac{1}{2} : \frac{5}{6} = 3$. Zeptejte se: „Kde se Petr spletl? Kolik má vyjít?“ Kontrola pro vás: odečítal dřív, než dělil; správně $\frac{5}{2} \cdot \frac{6}{5} = 3$ a $5 - 3 = 2$.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 21 knoflíků nebo kostek. Zítra ukažte na telefonu $15 - 6 : 3$. Ať dítě vyskládá 15 knoflíků a vedle nich 6 knoflíků rozdělí na 3 hromádky. Z patnácti pak odebere tolik, kolik je v jedné hromádce. Pak ať samo zapíše $6 : 3 = 2$ a $15 - 2 = 13$. Potom zopakujte lekci „Kontrola: zlomky II“. Kontrola pro vás: zůstane 13; kdo odečte dřív, dostane 3.",
  },
  "tisk": {"zadani": f"Petr počítal příklad\n\n$${vyraz2}$$\n\na udělal jednu chybu.\n\n" + "\n\n".join(f"{i+1}. řádek: {r}" for i, r in enumerate(radky)) +
    "\n\nA) Zakroužkuj řádek s chybou.\n\nB) Jak má chybný řádek vypadat správně? Zakroužkuj: a) " + k2m[0] + " b) " + k2m[1] + " c) " + k2m[2] +
    "\n\nC) Správný výsledek (zlomek v základním tvaru): ______"},
}

u3_zad = r"Adam s dědou sklidili na zahradě $9\frac{3}{5}$ kg švestek. Babičce na knedlíky dali $\frac{3}{8}$ švestek a zbytek rozdělili do sáčků po $\frac{3}{4}$ kg pro sousedy." + "\n\n" + \
  "Kolik kilogramů švestek dostala babička, kolik kilogramů zbylo a kolik sáčků naplnili?"
u3 = {
  "id": f"{ID}-U3", "typ": "cermat", "cas_min": 7,
  "zadani": u3_zad, "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": "Mezivýsledek: švestky pro babičku", "vstup": {"typ": "cislo", "jednotka": "kg"},
     "spravne": {"hodnota": 3.6},
     "zname_chyby": [{"hodnota": 1.2, "typ_chyby": "zlomek-z-cisla-jen-deleni"}, {"hodnota": 0.9, "typ_chyby": "smisene-scital-celou-cast"}, {"hodnota": 25.6, "typ_chyby": "zlomek-z-cisla-obracene"}]},
    {"id": "k2", "popisek": "Mezivýsledek: zbytek švestek", "vstup": {"typ": "cislo", "jednotka": "kg"},
     "spravne": {"hodnota": 6},
     "zname_chyby": [{"hodnota": 8.4, "typ_chyby": "zlomek-z-cisla-jen-deleni"}, {"hodnota": 3.6, "typ_chyby": "zamenil-cast-a-zbytek"}]},
    {"id": "final", "popisek": "Výsledek: počet sáčků", "vstup": {"typ": "cislo", "jednotka": None},
     "spravne": {"hodnota": 8},
     "zname_chyby": [{"hodnota": 4.5, "typ_chyby": "delil-bez-prevraceni"}, {"hodnota": 0.125, "typ_chyby": "deleni-obracene"}, {"hodnota": 12.8, "typ_chyby": "prehledl-udaj"}]},
  ],
  "tahak": {
    "vysvetleni": "Hlavní úloha kontroly spojuje smíšené číslo, zlomek z čísla a dělení zlomkem. Čte se: „devět celých a tři pětiny kilogramu“ a „tři čtvrtiny kilogramu“. Past: sáčky se plní jen ze zbytku. Počet sáčků je dělení: zbytek děleno jeden sáček. Mezivýsledek pro babičku je desetinné číslo, čte se „tři celé šest desetin“.",
    "reseni": "\n\n".join([
      r"$9\frac{3}{5} = \frac{48}{5}$ (devět celých je čtyřicet pět pětin, a tři navíc)",
      r"$\frac{3}{8} \cdot \frac{48}{5} = \frac{3 \cdot 6}{5} = \frac{18}{5} = 3{,}6$ (babičce, tři osminy; osmička se čtyřiceti osmi se zkrátí)",
      r"$\frac{48}{5} - \frac{18}{5} = \frac{30}{5} = 6$ (zbytek)",
      r"$6 : \frac{3}{4} = 6 \cdot \frac{4}{3} = 8$ (kolikrát se sáček vejde do zbytku)",
      r"$8 \cdot \frac{3}{4} = 6$ (zkouška, osm sáčků je šest kilogramů)",
      r"**Výsledek:** babička $3{,}6$ kg, zbylo $6$ kg, $8$ sáčků"]),
    "otazky": [
      {"k": "Celá úloha", "text": "„Řekni mi vlastními slovy, co se se švestkami stalo a na co se úloha ptá.“"},
      {"k": "Krok 1 a 2", "text": "„Jak zapíšeš devět celých a tři pětiny jako zlomek? Kolik jsou z toho tři osminy a kolik zbude?“"},
      {"k": "Výsledek", "text": "„Kdyby zbyla tři kila a sáček měl půl kila, kolik sáčků by bylo? Jakým počtem to spočítáš?“"},
    ],
    "otocena_role": "„Vysvětli mi, proč je sáčků víc, než kolik kilogramů zbylo.“",
    "otocena_role_odpoved": "Protože sáček je menší než kilogram, jen tři čtvrtiny. Do každého kilogramu se vejde víc než jeden sáček, takže sáčků je víc než kilogramů. Šest děleno třemi čtvrtinami je osm.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. Krok 1 $1{,}2$, $25{,}6$, $0{,}9$: jen dělí, obrátí zlomek, špatně převede. Zeptejte se: „Kolik je osmina ze čtyřiceti osmi pětin?“ (Šest pětin.) Krok 2 $8{,}4$: navazuje na chybu; $3{,}6$: část pro babičku. Výsledek $4{,}5$, $0{,}125$: násobí, dělí obráceně; $12{,}8$: dělí všechno. „Kolik kilogramů zbylo?“ (Šest.)",
  },
  "semafor": {
    "zelena": "Výborně — švestky pro babičku, zbytek i sáčky sedí. Pochvalte, že sáčky počítalo jen ze zbytku a poznalo dělení, a jděte dál.",
    "oranzova": r"Zítra 5 minut, na papír. Přečtěte dítěti: „Máme šest a čtvrt litru polévky. Pětinu sníme, zbytek nalijeme do misek po půl litru. Kolik misek naplníme?“ Ať nahlas řekne snědeno, zbytek a počet misek. Kontrola pro vás: snědeno jeden a čtvrt litru, zbytek $5$ l, $10$ misek ($5 \cdot 2$).",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 4 listy papíru a nůžky; každý list je kilo švestek. Zítra ať dítě jeden list odloží pro babičku. Zbylé tři ať rozstřihne na třetiny jako sáčky po třetině kila a spočítá je. Pak ať samo zapíše $4 - 1 = 3$ a $3 : \frac{1}{3} = 3 \cdot 3 = 9$. Potom zopakujte lekci „Kontrola: zlomky II“. Kontrola pro vás: zbyla 3 kila, 9 sáčků.",
  },
  "tisk": {"zadani": u3_zad + "\n\nA) Babička: ______ kg\n\nB) Zbylo: ______ kg\n\nC) Počet sáčků: ______"},
}

vyraz4 = r"\left(2\frac{5}{6} - \frac{1}{2}\right) : 1\frac{2}{5}"
u4 = {
  "id": f"{ID}-U4", "typ": "semafor", "cas_min": 4,
  "zadani": f"Vypočítej a výsledek zapiš jako zlomek v základním tvaru:\n\n$${vyraz4}$$", "zdroj": "vlastni",
  "kroky": [
    {"id": "final", "popisek": "Výsledek", "vstup": {"typ": "zlomek"},
     "spravne": {"c": 5, "j": 3},
     "zname_chyby": [{"c": 3, "j": 5, "typ_chyby": "prevratil-prvni"}, {"c": 49, "j": 15, "typ_chyby": "delil-bez-prevraceni"}, {"c": 10, "j": 21, "typ_chyby": "smisene-scital-celou-cast"}],
     "kontrola_tvaru": "zakladni_tvar"},
  ],
  "tahak": {
    "vysvetleni": "Kontrolní úloha: dítě ji řeší samo, vy jen sledujete. Otázky použijte, až když se zasekne; pak v semaforu zvolte „Potřeboval(a) otázku“. Čte se: „závorka, dvě celé a pět šestin minus jedna polovina, konec závorky, děleno jednou celou a dvěma pětinami“. Nejdřív závorka, pak dělení.",
    "reseni": "\n\n".join([
      r"$2\frac{5}{6} = \frac{17}{6}$, $1\frac{2}{5} = \frac{7}{5}$ (převod smíšených čísel)",
      r"$\frac{17}{6} - \frac{3}{6} = \frac{14}{6} = \frac{7}{3}$ (závorka na šestinách, zkrácení dvěma)",
      r"$\frac{7}{3} : \frac{7}{5} = \frac{7}{3} \cdot \frac{5}{7}$ (krát převrácený zlomek)",
      r"$= \frac{5}{3}$ (sedmičky se zkrátí)",
      r"**Výsledek:** $\frac{5}{3}$"]),
    "otazky": [
      "„Přečti mi příklad nahlas. Co spočítáš jako první a proč?“",
      "„Co uděláš se smíšenými čísly? Který zlomek se pak při dělení převrací?“",
      "„Tady máš začátek: dvě celé a pět šestin je sedmnáct šestin. Kolik šestin je jedna polovina a co pak?“",
    ],
    "otocena_role": "„Vysvětli mi, proč se převrací jedna celá a dvě pětiny, a ne výsledek závorky.“",
    "otocena_role_odpoved": "Protože jednou celou a dvěma pětinami se dělí. Při dělení se převrací jen číslo, kterým dělím, a předtím ho převedu na sedm pětin. Výsledek závorky zůstane, jak je.",
    "typicka_chyba": r"Kontrolní úloha: během úlohy nic neříkejte, ptejte se až po odevzdání. Podívejte se na obrazovku dítěte. $\frac{3}{5}$: převrátí výsledek závorky; $\frac{49}{15}$: nepřevrátí nic. Zeptejte se: „Kterým číslem se dělí?“ (Sedmi pětinami.) $\frac{10}{21}$: dvě celé a pět šestin převede jako sedm šestin. „Kolik šestin jsou dvě celé?“ (Dvanáct.)",
  },
  "semafor": {
    "zelena": "Výborně — kontrolu tématu zvládlo samo. Pochvalte převody, závorku i dělení. Zítra můžete pokračovat další lekcí.",
    "oranzova": r"Zítra 5 minut, na papír. Ukažte dítěti na telefonu $\left(1\frac{1}{4} + \frac{1}{2}\right) : 2\frac{1}{3}$. Ať nahlas řekne závorku, převod a výsledek. Kontrola pro vás: závorka $\frac{7}{4}$; $2\frac{1}{3} = \frac{7}{3}$; $\frac{7}{4} \cdot \frac{3}{7} = \frac{3}{4}$.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 2 listy papíru a nůžky. Zítra ať dítě oba listy rozstřihne na třetiny a vyskládá jeden list a jednu třetinu. Zeptejte se: „Kolikrát se do toho vejdou dvě třetiny?“ Ať třetiny skládá po dvou. Pak ať samo zapíše $1\frac{1}{3} = \frac{4}{3}$ a $\frac{4}{3} : \frac{2}{3} = 2$. Potom zopakujte lekci „Kontrola: zlomky II“. Kontrola pro vás: dvakrát, čtyři třetiny jsou dvě dvojice.",
  },
  "tisk": {"zadani": f"Vypočítej a výsledek zapiš jako zlomek v základním tvaru:\n\n$${vyraz4}$$\n\nVýsledek: ______"},
}

lekce = {
  "id": ID, "faze": "osma", "tyden": 5, "poradi": 4, "tema": T, "kapitola": "zlomky", "varianta": "z8",
  "cil_pro_rodice": "Dítě samo násobí a dělí zlomky i smíšená čísla, hlídá pořadí operací a spočítá část ze zbytku ve slovní úloze o krok delší.",
  "uvod_pro_rodice": "Minule to nevyšlo, dnes stejná látka s jinými úlohami. Dítě ukáže, že celé téma zvládne samo: čtyři příklady ze všech lekcí, nenápadnější chyba u Petra a slovní úloha se smíšeným číslem.",
  "uvod_pravidla": [
    {"znak": r"$\frac{5}{12} \cdot \frac{8}{15}$", "text": "krátí se předem"},
    {"znak": r"$: \frac{3}{8} = \cdot \frac{8}{3}$", "text": "děleno: krát převrácený"},
    {"znak": r"$1\frac{4}{7} = \frac{11}{7}$", "text": "smíšené číslo převést"},
  ],
  "pomucky": ["sešit", "propiska", "tužka"],
  "cas_min": 20,
  "ulohy": [u1, u2, u3, u4],
  "kontrola": {"jistota": "stredni", "zkontroloval": "autor", "datum": "2026-10-09", "poznamka": r"""Autor 9. 10. 2026: B-varianta M8-T05-L4N (po červené). Struktura, typy úloh, vstupy, počty kroků a kódy chyb shodné s L4N; čísla a kontexty nové. Vše přepočítáno skriptem (python Fraction) a přes vyhodnotKrok: správné odpovědi true, každá známá chyba i chybná dlaždice vrací svůj kód. U1 $\frac{2}{15}$ ($\frac{14}{15}$, $\frac{2}{45}$); $\frac{3}{5}$ ($\frac{5}{3}$, $\frac{48}{125}$); $1\frac{1}{6}$ ($1\frac{5}{12}$, $\frac{1}{2}$); $21$ ($27$, $7$, $6$). U2 $5 - \frac{32}{9} \cdot \frac{9}{20} = \frac{17}{5}$ (Petr $\frac{13}{20}$, $\frac{35}{8}$, $\frac{18}{5}$). U3 $\frac{48}{5} \cdot \frac{3}{8} = 3{,}6$, zbytek $6$, $8$ sáčků ($1{,}2$, $0{,}9$, $25{,}6$; $8{,}4$, $3{,}6$; $4{,}5$, $0{,}125$, $12{,}8$). U4 $\frac{7}{3} : \frac{7}{5} = \frac{5}{3}$ ($\frac{3}{5}$, $\frac{49}{15}$, $\frac{10}{21}$). Sporné: U3 zlomek $\frac{3}{8}$ je i v L4N U1 D (jiná úloha); skriptem jediná kombinace s celým zbytkem, aspoň 5 sáčky a konečnými desetinnými chybami bez zlomků z L4N vycházela s $15\frac{3}{4}$ kg, tedy těžší."""},
}
if __name__ == "__main__":
    uloz(lekce, sys.argv[1])
