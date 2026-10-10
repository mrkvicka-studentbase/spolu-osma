## Taháky a měsíční výzva (R78, Pavel 8. 10.) — `tahaky.html`, `prehled.html`, `lekce.html`, `rodic.html`

Taháky jsou pro dítě (tykáme), rodič je čte stejně. Výzva na přehledu má jinou větu po splnění pro rodiče.

| klíč | kde | text |
|---|---|---|
| `tahaky.nadpis` | stránka taháků, nadpis | Moje taháky |
| `tahaky.uvod` | stránka taháků, pod nadpisem | Za každý celý týden lekcí dostaneš tahák: pravidla toho týdne a k nim vzorové příklady. Hodí se k opakování a před přijímačkami si je můžeš vytisknout. |
| `tahaky.radek` | přehled, řádek pod odznaky | Taháky: {x} z {n} |
| `tahaky.radek_bonus` | přehled, řádek taháků, když má dítě zlaté taháky | zlaté: {x} |
| `tahaky.zobrazit` | přehled, řádek taháků | Zobrazit |
| `tahaky.zpet` | stránka taháků, odkaz nahoře | Zpět na přehled |
| `tahaky.pocet` | stránka taháků, pod úvodem | Odemčeno {x} z {n} |
| `tahaky.sekce_matematika` | stránka taháků, nadpis skupiny | Matematika |
| `tahaky.sekce_cestina` | stránka taháků, nadpis skupiny | Čeština |
| `tahaky.sekce_bonus` | stránka taháků, nadpis skupiny | Zlaté taháky za měsíční výzvy |
| `tahaky.zamceno_tyden` | zamčený tahák týdne | Odemkneš dokončením týdne {tyden}. |
| `tahaky.zamceno_pilot` | zamčený tahák pilotu | Odemkneš dokončením pilotu. |
| `tahaky.zamceno_vyzva` | zamčený zlatý tahák, výzva teprve bude | Odměna za výzvu: {cil} {lekci} {mesic}. |
| `tahaky.zamceno_vyzva_bezi` | zamčený zlatý tahák, výzva právě běží | Splň výzvu: {x} z {cil} lekcí {mesic}. |
| `tahaky.zamceno_vyzva_skoncila` | zamčený zlatý tahák, výzva skončila nesplněná | Výzva skončila. Tahák se ti odemkne 1. 4. |
| `tahaky.zamceno_bez_sezony` | zamčený zlatý tahák u rodiny bez zaplacené sezóny (ODPOVED 8. 10., bod 3; bez ceny) | Výzvy jsou součástí sezóny. |
| `tahaky.otevrit` | karta nového taháku, dlaždice, výzva | Otevřít tahák |
| `tahaky.tisk` | stránka taháků, tlačítko | Vytisknout odemčené |
| `tahaky.tisk_nic` | stránka taháků, když není nic odemčeno | Až odemkneš první tahák, půjde vytisknout. |
| `tahaky.priklad` | tahák, popisek vzorového příkladu | Příklad |
| `tahaky.zadne` | stránka taháků, když obsah ještě není nahraný | Taháky připravujeme. Brzy tu budou. |
| `tahaky.karta_novy` | karta nového taháku, nadpis okna | Nový tahák! |
| `tahaky.karta_nove` | karty nových taháků, nadpis okna | Nové taháky: {n} |
| `tahaky.karta_seber` | karta nového taháku, hlavní tlačítko | Seber tahák |
| `tahaky.karta_seber_vice` | karty nových taháků, hlavní tlačítko | Seber taháky |
| `tahaky.karta_druh` | karta nového taháku, druh | Tahák |
| `tahaky.karta_druh_bonus` | karta nového zlatého taháku, druh | Zlatý tahák |
| `tahaky.karta_oznameni` | čtečka obrazovky po otočení karty | Nový tahák |
| `vyzva.karta` | přehled, karta výzvy | {nazev}: {x} z {cil} lekcí |
| `vyzva.zbyva_1` | přehled, karta výzvy | zbývá 1 den |
| `vyzva.zbyva_2_4` | přehled, karta výzvy | zbývají {n} dny |
| `vyzva.zbyva_5` | přehled, karta výzvy | zbývá {n} dní |
| `vyzva.odmena` | přehled, karta výzvy | odměna: zlatý tahák |
| `vyzva.popis` | přehled, karta výzvy, pod ukazatelem | Počítají se lekce z matematiky i z češtiny dokončené {mesic}. |
| `vyzva.splneno_zak` | přehled žáka, výzva splněna | Výzva splněna! Tahák „{nazev}“ je tvůj. |
| `vyzva.splneno_rodic` | přehled rodiče, výzva splněna | Výzva splněna! Zlatý tahák „{nazev}“ je odemčený. |

## Odznaky — přehled a karta (redesign 8. 10., návrh designérky) — `prehled.html`, `lekce.html`, `rodic.html`, `tahaky.html`

Názvy, pochvaly a popisy odznaků jsou v `web/js/odznaky.js`. Tady jsou jen štítky dlaždic a razítko na kartě.

| klíč | kde | text |
|---|---|---|
| `odznaky.ziskano` | přehled odznaků, štítek získaného odznaku | Získáno |
| `odznaky.zamceno` | přehled odznaků, štítek zamčeného odznaku | Zamčeno |
| `odznaky.razitko` | karta nového odznaku a taháku po otočení, ozdobné razítko | Získáno! |
