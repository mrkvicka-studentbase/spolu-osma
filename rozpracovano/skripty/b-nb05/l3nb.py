import sys; sys.path.insert(0, '/tmp/b-nb05')
from spolecne import dl, uloz
ID = "M8-T05-L3NB"
T = "Smíšená čísla"

u1 = {
  "id": f"{ID}-U1", "typ": "rozcvicka", "cas_min": 4,
  "zadani": "Spočítej na papíře a vyber správnou odpověď.\n\n" +
            r"A) Zapiš $2\frac{5}{9}$ jako zlomek." + "\n\n" + r"B) Zapiš $\frac{26}{7}$ jako smíšené číslo." + "\n\n" +
            r"C) $6 - 3\frac{2}{9}$" + "\n\n" + r"D) $1\frac{3}{7} \cdot 2\frac{1}{5}$",
  "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": r"Příklad A: $2\frac{5}{9}$ jako zlomek", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$\frac{10}{9}$", chyba="smisene-jako-soucin"),
      dl("b", r"$\frac{7}{9}$", chyba="smisene-scital-celou-cast"),
      dl("c", r"$\frac{23}{9}$", ok=True)]}},
    {"id": "k2", "popisek": r"Příklad B: $\frac{26}{7}$ jako smíšené číslo", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$3\frac{5}{7}$", ok=True),
      dl("b", r"$5\frac{3}{7}$", chyba="smisene-zpet-spatne"),
      dl("c", r"$3\frac{5}{26}$", chyba="smisene-zpet-spatne")]}},
    {"id": "k3", "popisek": r"Příklad C: $6 - 3\frac{2}{9}$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$3\frac{2}{9}$", chyba="smisene-odcitani-po-castech"),
      dl("b", r"$2\frac{7}{9}$", ok=True),
      dl("c", r"$2\frac{2}{9}$", chyba="odcital-zlomek-od-celeho-spatne")]}},
    {"id": "final", "popisek": r"Příklad D: $1\frac{3}{7} \cdot 2\frac{1}{5}$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$3\frac{1}{22}$", chyba="smisene-zpet-spatne"),
      dl("b", r"$2\frac{3}{35}$", chyba="smisene-nasobil-po-castech"),
      dl("c", r"$3\frac{1}{7}$", ok=True)]}},
  ],
  "tahak": {
    "vysvetleni": r"Dítě jen vybírá. Čte se: $2\frac{5}{9}$ „dvě celé a pět devítin“. U C se jedna celá rozmění na devět devítin. U D se obě čísla nejdřív převedou na zlomky, vynásobí a výsledek se převede zpět. Otázky jsou po příkladech, první patří k A i D: čtěte tu u příkladu, kde se dítě zasekne.",
    "reseni": "\n\n".join([
      r"#### A) $2\frac{5}{9}$ jako zlomek",
      r"$2 \cdot 9 + 5 = 23$ (dvě celé jsou osmnáct devítin, a pět navíc)",
      r"$2\frac{5}{9} = \frac{23}{9}$ (jmenovatel zůstává)",
      r"#### B) $\frac{26}{7}$ jako smíšené číslo",
      r"$26 : 7 = 3$, zbytek $5$ (sedmička se vejde třikrát, pět sedmin zbude)",
      r"$\frac{26}{7} = 3\frac{5}{7}$ (zbytek zůstane nahoře)",
      r"#### C) $6 - 3\frac{2}{9}$",
      r"$6 = 5\frac{9}{9}$ (jedna celá se rozmění na devět devítin)",
      r"$5\frac{9}{9} - 3\frac{2}{9} = 2\frac{7}{9}$ (celé od celých, devítiny od devítin)",
      r"#### D) $1\frac{3}{7} \cdot 2\frac{1}{5}$",
      r"$= \frac{10}{7} \cdot \frac{11}{5}$ (převod na zlomky)",
      r"$= \frac{22}{7}$ (desítka s pětkou se zkrátí)",
      r"$= 3\frac{1}{7}$ (tři celé jsou dvacet jedna sedmin, zbytek jedna)",
      r"**Výsledek:** A) $\frac{23}{9}$, B) $3\frac{5}{7}$, C) $2\frac{7}{9}$, D) $3\frac{1}{7}$"]),
    "otazky": [
      {"k": "A a D", "text": "„Neklikej, spočítej na papíře: kolik devítin jsou dvě celé? Co uděláš se smíšenými čísly, než je vynásobíš?“"},
      {"k": "B", "text": "„Kolikrát se sedmička vejde do dvaceti šesti? Kolik zbude a kam ten zbytek napíšeš?“"},
      {"k": "C", "text": "„Kolik devítin je jedna celá? Rozměň jednu ze šesti celých na devítiny a pak odečítej.“"},
    ],
    "otocena_role": "„Vysvětli mi, proč u příkladu D nevyjdou dvě celé a tři pětatřicetiny.“",
    "otocena_role_odpoved": "Ty vyjdou, když se násobí zvlášť celé a zvlášť zlomky. Tím se vynechají kusy: jedna celá krát jedna pětina a tři sedminy krát dvě celé. Po převodu na zlomky se nic nevynechá.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. A $\frac{7}{9}$, $\frac{10}{9}$: sčítá, nebo násobí celé s čitatelem. Zeptejte se: „Kolik devítin mají dvě celé?“ (Osmnáct.) B $5\frac{3}{7}$, $3\frac{5}{26}$, D $3\frac{1}{22}$: zbytek dá jinam. C $2\frac{2}{9}$, $3\frac{2}{9}$: nerozmění celou. „Kolik devítin je celá?“ (Devět.) D $2\frac{3}{35}$: násobí po částech.",
  },
  "semafor": {
    "zelena": "Výborně — převody, odčítání i násobení smíšených čísel sedí. Pochvalte, že u C rozměnilo celou, a jděte dál.",
    "oranzova": r"Zítra 5 minut, na papír. Ukažte dítěti na telefonu $3\frac{5}{6}$, $\frac{31}{8}$ a $7 - 4\frac{1}{3}$. Ať první zapíše jako zlomek, druhé jako smíšené číslo, třetí spočítá a nahlas řekne, jak. Kontrola pro vás: $\frac{23}{6}$; $3\frac{7}{8}$; $2\frac{2}{3}$ (jedna celá jsou tři třetiny).",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 4 listy papíru a nůžky. Zítra ať dítě jeden list rozstřihne na tři stejné díly. Pak ať odloží jeden celý list a dvě třetiny. Zeptejte se: „Kolik celých listů a kolik třetin zůstalo?“ Pak ať samo zapíše $4 - 1\frac{2}{3} = 2\frac{1}{3}$. Potom zopakujte lekci „Smíšená čísla“. Kontrola pro vás: 2 celé listy a 1 třetina.",
  },
  "tisk": {"zadani": "Spočítej a zakroužkuj správnou odpověď.\n\n" +
    r"A) Zapiš $2\frac{5}{9}$ jako zlomek. — a) $\frac{10}{9}$ b) $\frac{7}{9}$ c) $\frac{23}{9}$" + "\n\n" +
    r"B) Zapiš $\frac{26}{7}$ jako smíšené číslo. — a) $3\frac{5}{7}$ b) $5\frac{3}{7}$ c) $3\frac{5}{26}$" + "\n\n" +
    r"C) $6 - 3\frac{2}{9}$ — a) $3\frac{2}{9}$ b) $2\frac{7}{9}$ c) $2\frac{2}{9}$" + "\n\n" +
    r"D) $1\frac{3}{7} \cdot 2\frac{1}{5}$ — a) $3\frac{1}{22}$ b) $2\frac{3}{35}$ c) $3\frac{1}{7}$"},
}

vyraz2 = r"5\frac{1}{6} - 2\frac{3}{4}"
radky = [r"$= 5\frac{2}{12} - 2\frac{9}{12}$", r"$= \frac{62}{12} - \frac{11}{12}$", r"$= \frac{51}{12}$", r"$= 4\frac{3}{12} = 4\frac{1}{4}$"]
k2m = [r"$= \frac{62}{12} - \frac{18}{12}$", r"$= \frac{62}{12} - \frac{33}{12}$", r"$= \frac{7}{12} - \frac{33}{12}$"]
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
      dl("a", k2m[0], chyba="smisene-jako-soucin"),
      dl("b", k2m[1], ok=True),
      dl("c", k2m[2], chyba="smisene-scital-celou-cast")]}},
    {"id": "final", "popisek": "Výsledek", "vstup": {"typ": "smisene"},
     "spravne": {"cela": 2, "c": 5, "j": 12},
     "zname_chyby": [{"cela": 4, "c": 1, "j": 4, "typ_chyby": "smisene-scital-celou-cast"}, {"cela": 3, "c": 7, "j": 12, "typ_chyby": "smisene-odcitani-po-castech"}, {"cela": 3, "c": 2, "j": 3, "typ_chyby": "smisene-jako-soucin"}],
     "kontrola_tvaru": "zakladni_tvar"},
  ],
  "tahak": {
    "vysvetleni": "Petr je vymyšlený spolužák. Čte se: „pět celých a jedna šestina minus dvě celé a tři čtvrtiny“. Petr převádí obě čísla na dvanáctiny a pak na zlomky. Chyba je jedna a řádky za ní jsou spočítané dobře, jen ze špatného čísla. Odhad pro vás: výsledek má vyjít kolem dvou a půl.",
    "reseni": "\n\n".join([
      "Chyba je ve 2. řádku: Petr převedl dvě celé a devět dvanáctin jako jedenáct dvanáctin, celé jen přičetl k čitateli. Dvě celé jsou ale dvacet čtyři dvanáctin.",
      r"$5\frac{2}{12} = \frac{60 + 2}{12} = \frac{62}{12}$ (pět celých je šedesát dvanáctin)",
      r"$2\frac{9}{12} = \frac{24 + 9}{12} = \frac{33}{12}$ (dvě celé jsou dvacet čtyři dvanáctin)",
      r"$\frac{62}{12} - \frac{33}{12} = \frac{29}{12}$ (odčítají se čitatelé)",
      r"$\frac{29}{12} = 2\frac{5}{12}$ (dvě celé jsou dvacet čtyři dvanáctin, zbytek pět)",
      r"Dlaždice $\frac{62}{12} - \frac{18}{12}$ a $\frac{7}{12} - \frac{33}{12}$ nesedí (první násobí celé s čitatelem, druhá špatně převádí první číslo)",
      r"**Výsledek:** $2\frac{5}{12}$"]),
    "otazky": [
      {"k": "Celá úloha", "text": "„Přečti mi příklad nahlas. Kolik zhruba vyjde, když se podíváš jen na celé?“"},
      {"k": "Krok 1", "text": "„Vezmi Petrovy řádky postupně. U každého řekni, co se v něm změnilo proti řádku nad ním.“"},
      {"k": "Krok 1 a 2", "text": "„U každého převodu smíšeného čísla ověř: kolik dvanáctin jsou celé a přičetl Petr k nim i zlomek?“"},
    ],
    "otocena_role": "„Představ si, že jsem Petr. Vysvětli mi, proč dvě celé a devět dvanáctin nejsou jedenáct dvanáctin.“",
    "otocena_role_odpoved": "Jedenáct dvanáctin je míň než jedna celá. Každá celá má dvanáct dvanáctin, takže dvě celé jsou dvacet čtyři a s devíti je to třicet tři dvanáctin.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. Klikne na 1. řádek? Ten je správně. 3. a 4. řádek jen počítají ze špatného čísla. Zeptejte se: „Kolik dvanáctin jsou dvě celé?“ (Dvacet čtyři.) Výsledek $4\frac{1}{4}$: opíše Petra; $3\frac{7}{12}$: odečítá po částech; $3\frac{2}{3}$: násobí celé s čitatelem. „Vyjde víc, nebo míň než tři?“ (Míň.)",
  },
  "semafor": {
    "zelena": "Výborně — chybu našlo, i když byla schovaná v jednom ze dvou převodů. Pochvalte, že každý převod přepočítalo, a jděte dál.",
    "oranzova": r"Zítra 5 minut. Ukažte dítěti na telefonu, jak Petr počítá: $4\frac{1}{3} - 2\frac{5}{6} = \frac{26}{6} - \frac{7}{6} = \frac{19}{6}$. Zeptejte se: „Kde se Petr spletl? Kolik má vyjít?“ Kontrola pro vás: dvě celé a pět šestin je sedmnáct šestin; správně $\frac{26}{6} - \frac{17}{6} = \frac{9}{6} = 1\frac{1}{2}$.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 3 listy papíru a nůžky. Zítra ať dítě všechny tři listy rozstřihne na čtvrtiny. Zeptejte se: „Kolik čtvrtin jsou dva celé listy a ještě tři čtvrtiny?“ Ať je opravdu odpočítá. Pak ať samo zapíše $2\frac{3}{4} = \frac{11}{4}$. Potom zopakujte lekci „Smíšená čísla“. Kontrola pro vás: 11 čtvrtin, osm ze dvou celých listů a tři navíc.",
  },
  "tisk": {"zadani": f"Petr počítal příklad\n\n$${vyraz2}$$\n\na udělal jednu chybu.\n\n" + "\n\n".join(f"{i+1}. řádek: {r}" for i, r in enumerate(radky)) +
    "\n\nA) Zakroužkuj řádek s chybou.\n\nB) Jak má chybný řádek vypadat správně? Zakroužkuj: a) " + k2m[0] + " b) " + k2m[1] + " c) " + k2m[2] +
    "\n\nC) Správný výsledek (smíšené číslo): ______"},
}

u3_zad = r"Adam myje s tátou auto. Do kbelíku se vejde $2\frac{1}{2}$ litru vody. Vodu berou z kanystru, ve kterém je $10$ litrů. Na umytí auta potřebují $1\frac{3}{4}$ kbelíku." + "\n\n" + \
  "Kolik litrů vody spotřebují na auto? Kolik litrů zbude v kanystru? Oba výsledky zapiš smíšeným číslem."
k1m = [r"$2 \cdot 1 + \frac{1}{2} \cdot \frac{3}{4}$", r"$\frac{5}{2} \cdot \frac{7}{4}$", r"$\frac{3}{2} \cdot \frac{4}{4}$", r"$\frac{2}{2} \cdot \frac{3}{4}$"]
u3 = {
  "id": f"{ID}-U3", "typ": "cermat", "cas_min": 7,
  "zadani": u3_zad, "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": "Který zápis odpovídá spotřebě na auto?", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", k1m[0], chyba="smisene-nasobil-po-castech"),
      dl("b", k1m[1], ok=True),
      dl("c", k1m[2], chyba="smisene-scital-celou-cast"),
      dl("d", k1m[3], chyba="smisene-jako-soucin")]}},
    {"id": "k2", "popisek": "Mezivýsledek: voda na auto", "vstup": {"typ": "smisene"},
     "spravne": {"cela": 4, "c": 3, "j": 8},
     "zname_chyby": [{"cela": 2, "c": 3, "j": 8, "typ_chyby": "smisene-nasobil-po-castech"}, {"cela": 4, "c": 3, "j": 35, "typ_chyby": "smisene-zpet-spatne"}],
     "kontrola_tvaru": "zakladni_tvar"},
    {"id": "final", "popisek": "Výsledek: voda v kanystru", "vstup": {"typ": "smisene"},
     "spravne": {"cela": 5, "c": 5, "j": 8},
     "zname_chyby": [{"cela": 7, "c": 5, "j": 8, "typ_chyby": "smisene-nasobil-po-castech"}, {"cela": 5, "c": 3, "j": 8, "typ_chyby": "odcital-zlomek-od-celeho-spatne"}, {"cela": 6, "c": 3, "j": 8, "typ_chyby": "smisene-odcitani-po-castech"}],
     "kontrola_tvaru": "zakladni_tvar"},
  ],
  "tahak": {
    "vysvetleni": "Hlavní úloha lekce. Čte se: „dvě celé a jedna polovina litru“ a „jedna celá a tři čtvrtiny kbelíku“. Smíšená čísla se nenásobí po částech, nejdřív se převedou na zlomky. Druhá část je odčítání od celého čísla: jedna z deseti celých se rozmění na osminy.",
    "reseni": "\n\n".join([
      r"$2\frac{1}{2} = \frac{5}{2}$ (dvě celé jsou čtyři poloviny, a jedna navíc)",
      r"$1\frac{3}{4} = \frac{7}{4}$ (jedna celá jsou čtyři čtvrtiny, a tři navíc)",
      r"$\frac{5}{2} \cdot \frac{7}{4} = \frac{35}{8}$ (čitatel krát čitatel, jmenovatel krát jmenovatel)",
      r"$\frac{35}{8} = 4\frac{3}{8}$ (voda na auto, čtyři celé jsou třicet dva osmin)",
      r"$10 = 9\frac{8}{8}$ (jedna celá se rozmění na osminy)",
      r"$9\frac{8}{8} - 4\frac{3}{8} = 5\frac{5}{8}$ (zbude v kanystru)",
      "Zkouška odhadem: kbelík a tři čtvrtiny kbelíku jsou něco přes čtyři litry, zbude něco přes pět litrů",
      r"Dlaždice $\frac{3}{2} \cdot \frac{4}{4}$ a $\frac{2}{2} \cdot \frac{3}{4}$ nesedí (první přičítá celé k čitateli, druhá násobí celé s čitatelem)",
      r"**Výsledek:** na auto $4\frac{3}{8}$ l, v kanystru zbude $5\frac{5}{8}$ l"]),
    "otazky": [
      {"k": "Celá úloha", "text": "„Řekni mi vlastními slovy, kolik vody je v kbelíku, kolik kbelíků potřebuje auto a na co se úloha ptá.“"},
      {"k": "Krok 1 a 2", "text": "„Jak zapíšeš dvě celé a jednu polovinu jako zlomek? A jednu celou a tři čtvrtiny? Co pak s nimi uděláš?“"},
      {"k": "Výsledek", "text": "„Tady máš začátek: z deseti celých jednu rozměň na stejné díly, jaké má voda na auto. Jak pak odečteš?“"},
    ],
    "otocena_role": "„Vysvětli mi, proč nestačí vynásobit dva krát jedna a polovinu krát tři čtvrtiny.“",
    "otocena_role_odpoved": "Protože by se vynechaly kusy: dvě celé se musí vynásobit i třemi čtvrtinami a polovina i jedničkou. Po převodu na zlomky se nic nevynechá.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. Krok 1 „dva krát jedna“, krok 2 $2\frac{3}{8}$, výsledek $7\frac{5}{8}$: násobí po částech. Zeptejte se: „Kolik litrů jsou asi kbelík a tři čtvrtiny?“ (Přes čtyři.) $4\frac{3}{35}$: zbytek dole. Výsledek $5\frac{3}{8}$, $6\frac{3}{8}$: nerozmění celou. „Kolik osmin je jedna celá?“ (Osm.)",
  },
  "semafor": {
    "zelena": "Výborně — spotřeba i zbytek v kanystru sedí. Pochvalte, že smíšená čísla převedlo na zlomky a u odčítání rozměnilo celou, a jděte dál.",
    "oranzova": r"Zítra 5 minut, na papír. Ukažte dítěti na telefonu $1\frac{1}{4} \cdot 2\frac{2}{5}$ a $7 - 3\frac{2}{5}$. Ať nahlas řekne převody a výsledky. Kontrola pro vás: $\frac{5}{4} \cdot \frac{12}{5} = 3$; $6\frac{5}{5} - 3\frac{2}{5} = 3\frac{3}{5}$.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 2 listy papíru a nůžky; list je jeden kbelík. Zítra ať dítě jeden list nechá celý a druhý rozstřihne na čtvrtiny. Ať vyskládá jeden kbelík a tři čtvrtiny. Zeptejte se: „Kolik čtvrtin leží na stole?“ Pak ať samo zapíše $1\frac{3}{4} = \frac{7}{4}$ a spočítá vodu pro kbelík se čtyřmi litry: $\frac{7}{4} \cdot 4 = 7$. Potom zopakujte lekci „Smíšená čísla“. Kontrola pro vás: 7 čtvrtin; 7 litrů.",
  },
  "tisk": {"zadani": u3_zad + "\n\nA) Který zápis odpovídá spotřebě na auto? Zakroužkuj: a) " + k1m[0] + " b) " + k1m[1] + " c) " + k1m[2] + " d) " + k1m[3] +
    "\n\nB) Voda na auto: ______ l\n\nC) Zbude v kanystru: ______ l"},
}

vyraz4 = r"4\frac{1}{3} - 1\frac{7}{8} \cdot 1\frac{1}{3}"
u4 = {
  "id": f"{ID}-U4", "typ": "semafor", "cas_min": 4,
  "zadani": f"Vypočítej a výsledek zapiš jako smíšené číslo:\n\n$${vyraz4}$$", "zdroj": "vlastni",
  "kroky": [
    {"id": "final", "popisek": "Výsledek", "vstup": {"typ": "smisene"},
     "spravne": {"cela": 1, "c": 5, "j": 6},
     "zname_chyby": [{"cela": 3, "c": 5, "j": 18, "typ_chyby": "scital-pred-nasobenim"}, {"cela": 3, "c": 1, "j": 24, "typ_chyby": "smisene-nasobil-po-castech"}, {"cela": 3, "c": 2, "j": 3, "typ_chyby": "smisene-scital-celou-cast"}],
     "kontrola_tvaru": "zakladni_tvar"},
  ],
  "tahak": {
    "vysvetleni": "Kontrolní úloha: dítě ji řeší samo, vy jen sledujete. Otázky použijte, až když se zasekne; pak v semaforu zvolte „Potřeboval(a) otázku“. Čte se: „čtyři celé a jedna třetina minus jedna celá a sedm osmin krát jedna celá a jedna třetina“. Násobení má přednost před odčítáním.",
    "reseni": "\n\n".join([
      r"$1\frac{7}{8} \cdot 1\frac{1}{3} = \frac{15}{8} \cdot \frac{4}{3} = \frac{5}{2}$ (násobení má přednost, patnáctka s trojkou a osmička se čtyřkou se zkrátí)",
      r"$4\frac{1}{3} = \frac{26}{6}$, $\frac{5}{2} = \frac{15}{6}$ (převod na šestiny)",
      r"$\frac{26}{6} - \frac{15}{6} = \frac{11}{6}$ (odčítání)",
      r"$\frac{11}{6} = 1\frac{5}{6}$ (jedna celá je šest šestin, zbytek pět)",
      r"**Výsledek:** $1\frac{5}{6}$"]),
    "otazky": [
      "„Přečti mi příklad nahlas. Co v něm spočítáš jako první a proč?“",
      "„Co uděláš se smíšenými čísly, než je vynásobíš?“",
      "„Tady máš začátek: jedna celá a sedm osmin je patnáct osmin. Jak zapíšeš druhé číslo a co pak?“",
    ],
    "otocena_role": "„Vysvětli mi, proč nezačneš odčítáním, když v příkladu stojí jako první.“",
    "otocena_role_odpoved": "Protože násobení má přednost před odčítáním, stejně jako u celých čísel. Při odčítání napřed by se násobilo jiné číslo, než v příkladu opravdu je.",
    "typicka_chyba": r"Kontrolní úloha: během úlohy nic neříkejte, ptejte se až po odevzdání. Podívejte se na obrazovku dítěte. $3\frac{5}{18}$: nejdřív odčítá. Zeptejte se: „Co má přednost, minus, nebo krát?“ (Krát.) $3\frac{1}{24}$: násobí po částech. $3\frac{2}{3}$: špatný převod. „Kolik osmin je jedna celá a sedm osmin?“ (Patnáct.)",
  },
  "semafor": {
    "zelena": "Výborně — pořadí, převody i násobení smíšených čísel zvládá samo. Pochvalte, že nejdřív násobilo. Zítra můžete pokračovat další lekcí.",
    "oranzova": r"Zítra 5 minut, na papír. Ukažte dítěti na telefonu $4\frac{1}{2} - 1\frac{1}{3} \cdot 3$. Ať nahlas řekne, co počítá první, a výsledek. Kontrola pro vás: $\frac{4}{3} \cdot 3 = 4$; $\frac{9}{2} - 4 = \frac{1}{2}$.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 4 listy papíru a nůžky. Zítra ať dítě jeden list rozstřihne na čtvrtiny a vyskládá tři celé listy a dvě čtvrtiny. Pak ať dvakrát odebere jeden celý list a čtvrtinu. Zeptejte se: „Kolik listů je odebráno a kolik zůstalo?“ Pak ať samo zapíše $1\frac{1}{4} \cdot 2 = 2\frac{1}{2}$ a $3\frac{1}{2} - 2\frac{1}{2} = 1$. Potom zopakujte lekci „Smíšená čísla“. Kontrola pro vás: odebráno dva a půl listu, zůstal 1 list.",
  },
  "tisk": {"zadani": f"Vypočítej a výsledek zapiš jako smíšené číslo:\n\n$${vyraz4}$$\n\nVýsledek: ______"},
}

lekce = {
  "id": ID, "faze": "osma", "tyden": 5, "poradi": 3, "tema": T, "kapitola": "zlomky", "varianta": "z8",
  "cil_pro_rodice": "Dítě samo převádí smíšená čísla tam i zpět, odečítá je od celého čísla a násobí je i ve slovní úloze o krok delší.",
  "uvod_pro_rodice": "Minule to nevyšlo, dnes stejná látka s jinými úlohami. Dítě ukáže, že smíšená čísla zvládne samo: čtyři příklady, nenápadnější chyba u Petra a slovní úloha o krok delší.",
  "uvod_pravidla": [
    {"znak": r"$4\frac{3}{5} = \frac{23}{5}$", "text": "čtyři celé: dvacet pětin"},
    {"znak": r"$\frac{19}{6} = 3\frac{1}{6}$", "text": "zbytek zůstane nahoře"},
    {"znak": r"$6 = 5\frac{4}{4}$", "text": "rozměnit jednu celou"},
  ],
  "pomucky": ["sešit", "propiska", "tužka"],
  "cas_min": 20,
  "ulohy": [u1, u2, u3, u4],
  "kontrola": {"jistota": "stredni", "zkontroloval": "autor", "datum": "2026-10-09", "poznamka": r"""Autor 9. 10. 2026: B-varianta M8-T05-L3N (po červené). Struktura, typy úloh, vstupy, počty kroků a kódy chyb shodné s L3N; čísla a kontexty nové (smíšená čísla z L3N se v zadáních neopakují). Vše přepočítáno skriptem (python Fraction) a přes vyhodnotKrok: správné odpovědi true, každá známá chyba i chybná dlaždice vrací svůj kód. U1 $\frac{23}{9}$; $3\frac{5}{7}$; $2\frac{7}{9}$ ($2\frac{2}{9}$, $3\frac{2}{9}$); $3\frac{1}{7}$ ($2\frac{3}{35}$, $3\frac{1}{22}$). U2 $5\frac{1}{6} - 2\frac{3}{4} = 2\frac{5}{12}$ (Petr $4\frac{1}{4}$, $3\frac{7}{12}$, $3\frac{2}{3}$). U3 $\frac{35}{8} = 4\frac{3}{8}$, zbude $5\frac{5}{8}$ ($2\frac{3}{8}$, $4\frac{3}{35}$; $7\frac{5}{8}$, $5\frac{3}{8}$, $6\frac{3}{8}$). U4 $4\frac{1}{3} - \frac{5}{2} = 1\frac{5}{6}$ ($3\frac{5}{18}$, $3\frac{1}{24}$, $3\frac{2}{3}$). Sporné: U4 známé chyby s osmnáctinami a dvacetčtvrtinami jsou méně hezké než v L3N, varianty bez smíšených čísel z L3N ($1\frac{1}{4}$, $1\frac{2}{3}$, $1\frac{1}{2}$) hezčí nedávaly; U1 B obě chybné dlaždice smisene-zpet-spatne jako v L3N."""},
}
if __name__ == "__main__":
    uloz(lekce, sys.argv[1])
