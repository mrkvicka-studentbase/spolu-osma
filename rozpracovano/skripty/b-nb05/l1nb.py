import sys; sys.path.insert(0, '/tmp/b-nb05')
from spolecne import dl, uloz
ID = "M8-T05-L1NB"
T = "Násobení, zlomek z čísla"

u1 = {
  "id": f"{ID}-U1", "typ": "rozcvicka", "cas_min": 4,
  "zadani": r"Spočítej na papíře a vyber správnou odpověď. Zlomky ve výsledku jsou v základním tvaru." + "\n\n" +
            r"A) $\frac{3}{14} \cdot \frac{7}{15}$" + "\n\n" + r"B) $6 \cdot \frac{7}{9}$" + "\n\n" +
            r"C) Kolik je $\frac{5}{7}$ ze $70$?" + "\n\n" + r"D) Z $56$ Kč utratíš $\frac{1}{8}$. Kolik korun jsou $\frac{2}{7}$ zbytku?",
  "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": r"Příklad A: $\frac{3}{14} \cdot \frac{7}{15}$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$\frac{3}{10}$", chyba="upravil-jen-cast-zlomku"),
      dl("b", r"$\frac{1}{10}$", ok=True),
      dl("c", r"$21$", chyba="spolecny-jmenovatel-pri-nasobeni")]}},
    {"id": "k2", "popisek": r"Příklad B: $6 \cdot \frac{7}{9}$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$\frac{14}{3}$", ok=True),
      dl("b", r"$42$", chyba="spolecny-jmenovatel-pri-nasobeni"),
      dl("c", r"$\frac{7}{9}$", chyba="cele-cislo-do-citatele-i-jmenovatele")]}},
    {"id": "k3", "popisek": r"Příklad C: $\frac{5}{7}$ ze $70$", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$10$", chyba="zlomek-z-cisla-jen-deleni"),
      dl("b", r"$98$", chyba="zlomek-z-cisla-obracene"),
      dl("c", r"$50$", ok=True)]}},
    {"id": "final", "popisek": r"Příklad D: $\frac{2}{7}$ zbytku", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", r"$16$", chyba="z-celku-misto-ze-zbytku"),
      dl("b", r"$14$", ok=True),
      dl("c", r"$7$", chyba="zlomek-z-cisla-jen-deleni"),
      dl("d", r"$2$", chyba="zamenil-cast-a-zbytek")]}},
  ],
  "tahak": {
    "vysvetleni": r"Dítě jen vybírá. U A a B se násobí: co jde, zkrátí se ještě před násobením a celé číslo násobí jen čitatel. U C se dělí jmenovatelem a násobí čitatelem. U D se nejdřív spočítá, kolik korun zbude, a teprve z toho dvě sedminy. Otázky jsou po příkladech, první patří k A i B: čtěte tu u příkladu, kde se dítě zasekne.",
    "reseni": "\n\n".join([
      r"#### A) $\frac{3}{14} \cdot \frac{7}{15}$",
      r"$= \frac{3 \cdot 7}{14 \cdot 15}$ (čitatel krát čitatel, jmenovatel krát jmenovatel)",
      r"$= \frac{1 \cdot 1}{2 \cdot 5} = \frac{1}{10}$ (trojka s patnáctkou a sedmička se čtrnáctkou se zkrátí)",
      r"#### B) $6 \cdot \frac{7}{9}$",
      r"$= \frac{6 \cdot 7}{9}$ (celé číslo násobí jen čitatel)",
      r"$= \frac{2 \cdot 7}{3} = \frac{14}{3}$ (šestka s devítkou se zkrátí třemi)",
      r"#### C) $\frac{5}{7}$ ze $70$",
      r"$70 : 7 = 10$ (jedna sedmina)",
      r"$10 \cdot 5 = 50$ (pět sedmin)",
      r"#### D) $\frac{2}{7}$ zbytku",
      r"$56 : 8 = 7$ (utracená osmina)",
      r"$56 - 7 = 49$ (zbytek)",
      r"$49 : 7 \cdot 2 = 14$ (dvě sedminy zbytku)",
      r"**Výsledek:** A) $\frac{1}{10}$, B) $\frac{14}{3}$, C) $50$, D) $14$"]),
    "otazky": [
      {"k": "A a B", "text": "„Neklikej, spočítej na papíře: které číslo nahoře a které dole se dá zkrátit stejným číslem? Násobí šestka jen čitatel, nebo i jmenovatel?“"},
      {"k": "C", "text": "„Na kolik stejných dílů rozdělíš sedmdesát? Kolik takových dílů pak vezmeš?“"},
      {"k": "D", "text": "„Kolik korun zbude, když osminu utratíš? Z jakého čísla pak bereš dvě sedminy?“"},
    ],
    "otocena_role": "„Vysvětli mi, proč u příkladu D nestačí vzít dvě sedminy z padesáti šesti korun.“",
    "otocena_role_odpoved": "Protože osminu peněz už utratím. Dvě sedminy se berou jen z toho, co zbude, tedy ze čtyřiceti devíti korun, a to je čtrnáct.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. A $\frac{3}{10}$: krátí jen dole. $21$, $42$: hledá společného jmenovatele; B $\frac{7}{9}$: násobí i jmenovatel. Zeptejte se: „Jak velký je dílek?“ (Devítina.) C $10$, $98$: jen dělí, nebo obráceně. D $16$, $2$: bere z jiných peněz; $7$: jen dělí. „Kolik zbylo?“ (Čtyřicet devět.)",
  },
  "semafor": {
    "zelena": "Výborně — násobení, zlomek z čísla i zlomek ze zbytku sedí ve všech čtyřech příkladech. Pochvalte, že krátilo ještě před násobením, a jděte dál.",
    "oranzova": r"Zítra 5 minut, na papír. Ukažte dítěti na telefonu $\frac{5}{12} \cdot \frac{4}{15}$, $4 \cdot \frac{5}{6}$ a $\frac{3}{4}$ ze $48$. Ať nahlas řekne, co zkrátilo a co vyšlo. Kontrola pro vás: $\frac{1}{9}$ (pětka s patnáctkou, čtyřka s dvanáctkou); $\frac{10}{3}$ (čtyřka se šestkou); $36$ (čtvrtina je dvanáct).",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 30 mincí nebo knoflíků. Zítra: „Máš 30 korun. Šestinu utratíš, ze zbytku dáš dvě pětiny kamarádovi.“ Ať dítě mince opravdu odsouvá a řekne, kolik utratí, kolik zbude a kolik dá. Pak ať samo zapíše $30 : 6 = 5$, $30 - 5 = 25$, $25 : 5 \cdot 2 = 10$. Potom zopakujte lekci „Násobení, zlomek z čísla“. Kontrola pro vás: utratí 5, zbude 25, dá 10.",
  },
  "tisk": {"zadani": r"Spočítej a zakroužkuj správnou odpověď. Zlomky ve výsledku jsou v základním tvaru." + "\n\n" +
    r"A) $\frac{3}{14} \cdot \frac{7}{15}$ — a) $\frac{3}{10}$ b) $\frac{1}{10}$ c) $21$" + "\n\n" +
    r"B) $6 \cdot \frac{7}{9}$ — a) $\frac{14}{3}$ b) $42$ c) $\frac{7}{9}$" + "\n\n" +
    r"C) Kolik je $\frac{5}{7}$ ze $70$? — a) $10$ b) $98$ c) $50$" + "\n\n" +
    r"D) Z $56$ Kč utratíš $\frac{1}{8}$. Kolik korun jsou $\frac{2}{7}$ zbytku? — a) $16$ b) $14$ c) $7$ d) $2$"},
}

u2_zad_ulohy = r"*Honzíkova skládačka má $150$ dílků. O víkendu složil $\frac{1}{10}$ všech dílků, v pondělí $\frac{2}{3}$ zbytku. Kolik dílků mu ještě zbývá složit?*"
radky = [r"$1 - \frac{1}{10} = \frac{9}{10}$", r"$\frac{1}{10} + \frac{2}{3} = \frac{23}{30}$", r"$\frac{23}{30} \cdot 150 = 115$", r"$150 - 115 = 35$"]
k2m = [r"$\frac{1}{10} + \frac{2}{3} \cdot \frac{1}{10} = \frac{1}{6}$", r"$\frac{1}{10} + \frac{2}{3} = \frac{3}{13}$", r"$\frac{1}{10} + \frac{2}{3} \cdot \frac{9}{10} = \frac{7}{10}$"]
u2 = {
  "id": f"{ID}-U2", "typ": "detektiv", "cas_min": 5,
  "zadani": "Petr řešil úlohu\n\n" + u2_zad_ulohy + "\n\na udělal **jednu** chybu. Najdi ji.\n\n" + "\n\n".join(f"{i+1}. řádek: {r}" for i, r in enumerate(radky)),
  "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": "Klikni na řádek s chybou", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("r1", radky[0], chyba="oznacil-radek-pred-chybou", stitek="1. řádek"),
      dl("r2", radky[1], ok=True, stitek="2. řádek"),
      dl("r3", radky[2], chyba="nasel-az-dusledek", stitek="3. řádek"),
      dl("r4", radky[3], chyba="nasel-az-dusledek", stitek="4. řádek")]}},
    {"id": "k2", "popisek": "Jak má chybný řádek vypadat správně?", "vstup": {"typ": "dlazdice", "moznosti": [
      dl("a", k2m[0], chyba="zamenil-cast-a-zbytek"),
      dl("b", k2m[1], chyba="scital-citatele-i-jmenovatele"),
      dl("c", k2m[2], ok=True)]}},
    {"id": "final", "popisek": "Výsledek", "vstup": {"typ": "cislo", "jednotka": "dílků"},
     "spravne": {"hodnota": 45},
     "zname_chyby": [{"hodnota": 35, "typ_chyby": "z-celku-misto-ze-zbytku"}, {"hodnota": 105, "typ_chyby": "zamenil-cast-a-zbytek"}]},
  ],
  "tahak": {
    "vysvetleni": "Petr je vymyšlený spolužák. Nejdřív počítá se zlomky celé skládačky a teprve potom s dílky. Chyba je jedna a řádky za ní jsou spočítané dobře, jen ze špatného čísla. Pozor: všechny výpočty v Petrových řádcích jsou početně správně, chyba je v úvaze. Čte se: „jedna desetina plus dvě třetiny je dvacet tři třicetin“.",
    "reseni": "\n\n".join([
      "Chyba je ve 2. řádku: Petr sečetl desetinu celé skládačky a dvě třetiny zbytku, jako by obě části byly z celé skládačky. Dvě třetiny se ale berou jen ze zbytku, tedy z devíti desetin skládačky.",
      r"$1 - \frac{1}{10} = \frac{9}{10}$ (zbytek po víkendu, část skládačky)",
      r"$\frac{2}{3} \cdot \frac{9}{10} = \frac{3}{5}$ (pondělí, dvě třetiny zbytku jsou tři pětiny skládačky)",
      r"$\frac{1}{10} + \frac{3}{5} = \frac{7}{10}$ (složeno celkem)",
      r"$\frac{7}{10} \cdot 150 = 105$ (složené dílky)",
      r"$150 - 105 = 45$ (zbývá složit)",
      r"Jiná správná cesta: $150 : 10 = 15$, $150 - 15 = 135$, $135 : 3 \cdot 2 = 90$, $135 - 90 = 45$ (rovnou v dílcích)",
      r"Dlaždice $\frac{1}{10} + \frac{2}{3} \cdot \frac{1}{10}$ a $\frac{1}{10} + \frac{2}{3} = \frac{3}{13}$ nesedí (první bere dvě třetiny z víkendové desetiny, druhá sčítá zvlášť čitatele a jmenovatele)",
      r"**Výsledek:** $45$ dílků"]),
    "otazky": [
      {"k": "Celá úloha", "text": "„Řekni mi vlastními slovy, jak Honzík skládačku skládá a na co se úloha ptá.“"},
      {"k": "Krok 1", "text": "„Vezmi Petrovy řádky postupně. U každého řekni, co v něm Petr počítá a ke kterému dni to patří.“"},
      {"k": "Krok 1 a 2", "text": "„U každého zlomku v Petrových řádcích se zeptej: je to část celé skládačky, nebo část zbytku?“"},
    ],
    "otocena_role": "„Představ si, že jsem Petr. Vysvětli mi, proč nemůžu jen tak sečíst jednu desetinu a dvě třetiny.“",
    "otocena_role_odpoved": "Protože dvě třetiny nejsou z celé skládačky, ale jen ze zbytku po víkendu. Ze sto třiceti pěti zbylých dílků je to devadesát, z celé skládačky by to bylo sto.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. Klikne na 1. řádek? Ten je správně. Na 3. nebo 4.? Ty jen navazují. Zeptejte se: „Z čeho jsou ty dvě třetiny?“ (Ze zbytku po víkendu.) Výsledek $35$: dvě třetiny z celé skládačky, jako Petr; $105$: složené dílky. „Na co se ptá úloha?“ (Kolik zbývá.)",
  },
  "semafor": {
    "zelena": "Výborně — chybu našlo, i když byla schovaná ve správně sečtených zlomcích. Pochvalte, že u každého zlomku hlídalo, z čeho je, a jděte dál.",
    "oranzova": r"Zítra 5 minut. Přečtěte dítěti: „Seriál má $40$ dílů. Ema zhlédne čtvrtinu a pak polovinu zbytku. Petr tvrdí, že zhlédne čtvrtinu a polovinu, tedy tři čtvrtiny seriálu.“ Zeptejte se: „Má Petr pravdu? Kolik dílů Emě zbude?“ Kontrola pro vás: nemá, polovina je ze zbytku; zhlédne $10$ a $15$ dílů, zbude $15$ dílů.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 10 kostek nebo knoflíků jako dílky skládačky. Zítra: „Skládačka má 10 dílků. Pětinu složíš o víkendu, polovinu zbytku v pondělí.“ Ať dítě kostky odsouvá a řekne, kolik složí o víkendu, kolik v pondělí a kolik zbývá. Pak ať samo zapíše $10 : 5 = 2$, $10 - 2 = 8$, $8 : 2 = 4$. Potom zopakujte lekci „Násobení, zlomek z čísla“. Kontrola pro vás: 2, pak 4, zbývají 4.",
  },
  "tisk": {"zadani": "Petr řešil úlohu\n\n" + u2_zad_ulohy.strip('*') + "\n\na udělal jednu chybu.\n\n" + "\n\n".join(f"{i+1}. řádek: {r}" for i, r in enumerate(radky)) +
    "\n\nA) Zakroužkuj řádek s chybou.\n\nB) Jak má chybný řádek vypadat správně? Zakroužkuj: a) " + k2m[0] + " b) " + k2m[1] + " c) " + k2m[2] +
    "\n\nC) Kolik dílků Honzíkovi opravdu zbývá složit? ______ dílků"},
}

u3_zad = r"Ema dostala na školní výlet do Prahy $720$ Kč kapesného. Čtvrtinu utratila za vstupné do muzea, $\frac{2}{9}$ zbytku za suvenýry a zbytek přivezla domů." + "\n\n" + \
  "Kolik korun stály suvenýry? Kolik korun přivezla domů? Jaká část celého kapesného to je? Zapiš ji zlomkem v základním tvaru."
u3 = {
  "id": f"{ID}-U3", "typ": "cermat", "cas_min": 7,
  "zadani": u3_zad, "zdroj": "vlastni",
  "kroky": [
    {"id": "k1", "popisek": "Mezivýsledek: suvenýry", "vstup": {"typ": "cislo", "jednotka": "Kč"},
     "spravne": {"hodnota": 120},
     "zname_chyby": [{"hodnota": 160, "typ_chyby": "z-celku-misto-ze-zbytku"}, {"hodnota": 60, "typ_chyby": "zlomek-z-cisla-jen-deleni"}, {"hodnota": 40, "typ_chyby": "zamenil-cast-a-zbytek"}]},
    {"id": "k2", "popisek": "Mezivýsledek: přivezla domů", "vstup": {"typ": "cislo", "jednotka": "Kč"},
     "spravne": {"hodnota": 420},
     "zname_chyby": [{"hodnota": 380, "typ_chyby": "z-celku-misto-ze-zbytku"}, {"hodnota": 480, "typ_chyby": "zlomek-z-cisla-jen-deleni"}, {"hodnota": 120, "typ_chyby": "zamenil-cast-a-zbytek"}]},
    {"id": "final", "popisek": "Výsledek: část kapesného domů", "vstup": {"typ": "zlomek"},
     "spravne": {"c": 7, "j": 12},
     "zname_chyby": [{"c": 19, "j": 36, "typ_chyby": "z-celku-misto-ze-zbytku"}, {"c": 1, "j": 6, "typ_chyby": "zamenil-cast-a-zbytek"}, {"c": 7, "j": 9, "typ_chyby": "prehledl-udaj"}],
     "kontrola_tvaru": "zakladni_tvar"},
  ],
  "tahak": {
    "vysvetleni": "Hlavní úloha lekce. Kapesné se dělí na tři části: vstupné, suvenýry a peníze přivezené domů. Dvě devítiny se berou ze zbytku po vstupném. Nakonec se částka přivezená domů zapíše jako část celého kapesného: kolik korun ze sedmi set dvaceti. Správně je i cesta přes zlomky: tři čtvrtiny krát sedm devítin.",
    "reseni": "\n\n".join([
      r"$720 : 4 = 180$ (vstupné, čtvrtina kapesného)",
      r"$720 - 180 = 540$ (zbytek)",
      r"$540 : 9 \cdot 2 = 120$ (suvenýry, dvě devítiny zbytku)",
      r"$540 - 120 = 420$ (přivezla domů)",
      r"$\frac{420}{720} = \frac{7}{12}$ (zkrácení šedesáti)",
      r"Jiná cesta: $\frac{3}{4} \cdot \frac{7}{9} = \frac{21}{36} = \frac{7}{12}$ (domů zbude sedm devítin ze tří čtvrtin)",
      r"$180 + 120 + 420 = 720$ (zkouška, části dají celé kapesné)",
      r"**Výsledek:** suvenýry $120$ Kč, domů $420$ Kč, to je $\frac{7}{12}$ kapesného"]),
    "otazky": [
      {"k": "Celá úloha", "text": "„Řekni mi vlastními slovy, na jaké tři části se Emino kapesné rozdělí a na co se úloha ptá.“"},
      {"k": "Krok 1 a 2", "text": "„Dvě devítiny zbytku: zbytek čeho to je? Kolik korun Emě zůstane po vstupném?“"},
      {"k": "Výsledek", "text": "„Tady máš začátek: část kapesného je zlomek, nahoře peníze přivezené domů, dole celé kapesné. Čím ho zkrátíš?“"},
    ],
    "otocena_role": "„Vysvětli mi, proč suvenýry nestály dvě devítiny ze sedmi set dvaceti korun.“",
    "otocena_role_odpoved": "Protože čtvrtinu kapesného už Ema dala za vstupné a zbylo pět set čtyřicet korun. Dvě devítiny se berou z nich, takže suvenýry stály sto dvacet korun.",
    "typicka_chyba": r"Podívejte se na obrazovku dítěte. Krok 1 $160$, krok 2 $380$, výsledek $\frac{19}{36}$: bere z celého kapesného. Zeptejte se: „Kolik zbylo po vstupném?“ (Pět set čtyřicet.) $60$, $480$: jen dělí devíti. „Kolik devítin bereš?“ (Dvě.) $40$, $120$, $\frac{1}{6}$: počítá jinou část. Výsledek $\frac{7}{9}$: zapomene na vstupné.",
  },
  "semafor": {
    "zelena": "Výborně — suvenýry, peníze domů i část kapesného sedí. Pochvalte, že dvě devítiny počítalo ze zbytku a zlomek zkrátilo, a jděte dál.",
    "oranzova": r"Zítra 5 minut, na papír. Přečtěte dítěti: „Máme $500$ Kč. Pětinu utratíme, čtvrtinu zbytku dáme do kasičky. Kolik korun zůstane a jaká je to část?“ Ať nahlas řekne každý mezivýsledek. Kontrola pro vás: utratíme $100$, zbytek $400$, kasička $100$, zůstane $300$ Kč, tedy $\frac{3}{5}$.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 21 mincí nebo knoflíků. Zítra: „Máš 21 korun. Třetinu dáš za vstupné, polovinu zbytku za suvenýry.“ Ať dítě mince odsouvá a řekne, kolik dá za vstupné, kolik za suvenýry a kolik zůstane. Pak ať samo zapíše $21 : 3 = 7$, $21 - 7 = 14$, $14 : 2 = 7$, $14 - 7 = 7$. Potom zopakujte lekci „Násobení, zlomek z čísla“. Kontrola pro vás: 7, 7, zůstane 7, tedy třetina.",
  },
  "tisk": {"zadani": u3_zad + "\n\nA) Suvenýry: ______ Kč\n\nB) Domů: ______ Kč\n\nC) Část kapesného přivezená domů: ______"},
}

u4_zad = r"Do školní knihovny přišlo $140$ nových knih. Adam s Klárou první den zapsali do katalogu $\frac{1}{7}$ knih, druhý den $\frac{2}{5}$ zbytku." + "\n\n" + "Kolik knih ještě zbývá zapsat?"
u4 = {
  "id": f"{ID}-U4", "typ": "semafor", "cas_min": 4,
  "zadani": u4_zad, "zdroj": "vlastni",
  "kroky": [
    {"id": "final", "popisek": "Výsledek", "vstup": {"typ": "cislo", "jednotka": "knih"},
     "spravne": {"hodnota": 72},
     "zname_chyby": [{"hodnota": 64, "typ_chyby": "z-celku-misto-ze-zbytku"}, {"hodnota": 96, "typ_chyby": "zlomek-z-cisla-jen-deleni"}, {"hodnota": 48, "typ_chyby": "zamenil-cast-a-zbytek"}]},
  ],
  "tahak": {
    "vysvetleni": "Kontrolní úloha: dítě ji řeší samo, vy jen sledujete. Otázky použijte, až když se zasekne; pak v semaforu zvolte „Potřeboval(a) otázku“. Úloha se ptá na knihy, které ještě zbývá zapsat, ne na to, kolik knih zapsali druhý den.",
    "reseni": "\n\n".join([
      r"$140 : 7 = 20$ (první den, sedmina knih)",
      r"$140 - 20 = 120$ (zbytek)",
      r"$120 : 5 \cdot 2 = 48$ (druhý den, dvě pětiny zbytku)",
      r"$120 - 48 = 72$ (zbývá zapsat)",
      r"**Výsledek:** $72$ knih"]),
    "otazky": [
      "„Řekni mi vlastními slovy, jak Adam s Klárou knihy zapisují a na co se úloha ptá.“",
      "„Co spočítáš jako první? Z jakého počtu knih se berou dvě pětiny?“",
      "„Tady máš začátek: sedmina ze sto čtyřiceti je dvacet. Kolik knih zbude a co s tím číslem uděláš dál?“",
    ],
    "otocena_role": "„Vysvětli mi, proč druhý den nezapsali dvě pětiny ze všech sto čtyřiceti knih.“",
    "otocena_role_odpoved": "Protože dvacet knih už zapsali první den. Dvě pětiny se berou jen ze zbytku, ze sto dvaceti knih, a to je čtyřicet osm.",
    "typicka_chyba": r"Kontrolní úloha: během úlohy nic neříkejte, ptejte se až po odevzdání. Podívejte se na obrazovku dítěte. $64$: bere ze všech knih. Zeptejte se: „Kolik knih zbylo po prvním dni?“ (Sto dvacet.) $96$: jen dělí pěti. „Kolik pětin zapsali?“ (Dvě.) $48$: odpoví druhým dnem.",
  },
  "semafor": {
    "zelena": "Výborně — zlomek ze zbytku zvládá samo. Pochvalte, že si nejdřív spočítalo zbytek. Zítra můžete pokračovat další lekcí.",
    "oranzova": r"Zítra 5 minut, na papír. Přečtěte dítěti: „Cyklotrasa má $100$ km. První den ujedeme pětinu, druhý den tři osminy zbytku. Kolik km zbude na třetí den?“ Ať nahlas řekne každý mezivýsledek. Kontrola pro vás: první den $20$ km, zbytek $80$ km, druhý den $30$ km, zbude $50$ km.",
    "cervena": r"Dnes už nepokračujte, pochvalte snahu. Připravte: 36 knoflíků nebo kostek jako knihy. Zítra: „Přišlo 36 knih. Třetinu zapíšeš první den, čtvrtinu zbytku druhý den.“ Ať dítě knoflíky odsouvá a řekne, kolik zapíše poprvé, kolik podruhé a kolik zbude. Pak ať samo zapíše $36 : 3 = 12$, $36 - 12 = 24$, $24 : 4 = 6$. Potom zopakujte lekci „Násobení, zlomek z čísla“. Kontrola pro vás: 12, pak 6, zbude 18.",
  },
  "tisk": {"zadani": u4_zad + "\n\nVýsledek: ______ knih"},
}

lekce = {
  "id": ID, "faze": "osma", "tyden": 5, "poradi": 1, "tema": T, "kapitola": "zlomky", "varianta": "z8",
  "cil_pro_rodice": "Dítě samo vynásobí zlomky i zlomek celým číslem, spočítá zlomek z čísla i ze zbytku a ve slovní úloze určí, jaká část celku zbyla.",
  "uvod_pro_rodice": "Minule to nevyšlo, dnes stejná látka s jinými úlohami. Dítě ukáže, že násobení a zlomek z čísla zvládne samo: čtyři příklady, nenápadnější chyba u Petra a slovní úloha o krok delší.",
  "uvod_pravidla": [
    {"znak": r"$\frac{5}{6} \cdot \frac{9}{20}$", "text": "krátí se před násobením"},
    {"znak": r"$5 \cdot \frac{2}{9} = \frac{10}{9}$", "text": "číslo násobí jen čitatel"},
    {"znak": r"$\frac{2}{9}$ ze zbytku", "text": "nejdřív spočítat zbytek"},
  ],
  "pomucky": ["sešit", "propiska", "tužka"],
  "cas_min": 20,
  "ulohy": [u1, u2, u3, u4],
  "kontrola": {"jistota": "stredni", "zkontroloval": "autor", "datum": "2026-10-09", "poznamka": r"""Autor 9. 10. 2026: B-varianta M8-T05-L1N (po červené). Struktura, typy úloh, vstupy, počty kroků a kódy chyb shodné s L1N; čísla a kontexty v zadáních nové (žádný celek ani úloha z L1–L4, L1N–L4N, L1B–L4B). Vše přepočítáno skriptem (python Fraction) a přes vyhodnotKrok: správné odpovědi true, každá známá chyba i chybná dlaždice vrací svůj kód. U1 $\frac{1}{10}$ ($\frac{3}{10}$, $21$); $\frac{14}{3}$ ($\frac{7}{9}$, $42$); $50$ ($10$, $98$); $14$ ($16$, $2$, $7$). U2 $150 \to 15 \to 135 \to 90 \to 45$ (Petr $\frac{23}{30}$, $115$, $35$; $105$). U3 $720 \to 180 \to 540 \to 120 \to 420$, $\frac{7}{12}$. U4 $140 \to 20 \to 120 \to 48 \to 72$ ($64$, $96$, $48$). Sporné: U4 mezivýsledek $120$ je v L1N počet levelů (jiná role); U1 A distraktor $21$ = společný jmenovatel $210$ ($45 \cdot 98 : 210$), přesný výsledek chyby."""},
}
if __name__ == "__main__":
    uloz(lekce, sys.argv[1])
