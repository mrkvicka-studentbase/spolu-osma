# ZADÁNÍ — Spolu 8: opakování a upevnění učiva pro 8. třídu

Verze 1.0, 1. 10. 2026. Zadal: Pavel. Zapsal: vedoucí projektu (Opus).
Samostatná aplikace postavená na základech „Spolu“ (`mrkvicka-studentbase/spolu`). Nesdílí s ní kód za běhu, databázi ani obsah.

## 1. Co a pro koho
- **Pro koho:** žáci 8. třídy ZŠ (a odpovídajících ročníků víceletých gymnázií) a jejich rodiče.
- **Cíl:** opakovat a upevnit učivo z předchozích ročníků (hlavně 6. a 7. třída, základy z 5.), a to hlavně to, co dítěti nejde.
- **Bez přijímaček.** Žádné úlohy CERMAT, simulace, bloky na čas ani odpočty do přijímaček. Úlohy jsou vlastní a cvičí dovednost, ne formát testu.
- **Rytmus:** aspoň 4× týdně, jedna lekce 20–25 minut (nejvýš jedna lekce denně v každém předmětu).

## 2. Rozsah obsahu
| Předmět | Lekce | Úloh v lekci | Délka | Formát |
|---|---|---|---|---|
| Matematika | 40 (10 témat × 4) + diagnostika | 4: rozcvicka, detektiv, cermat (= hlavní úloha, `zdroj: "vlastni"`), semafor | 20 min | `kostra/03-format-obsahu.md` + `obsah/SABLONA.md` beze změny typů úloh a vstupů |
| Čeština | 40 (10 témat × 4) + diagnostika | **5**: rozcvicka, nova, nova, detektiv, kontrolni | ~25 min | `cestina/Obsah/FORMAT-CJ.md` s rozdílem: 5 úloh místo 6 (odpadá jedna úloha „nova“) |

- Každé téma = 4 lekce. 4. lekce tématu je **kontrola tématu** (u češtiny úloha 5 `tydenni: true` + `semafor_tydne`, u matematiky semafor lekce).
- Pořadí témat je doporučené (od základů ke složitějšímu). Lekce jsou dostupné všechny, žádné zámky podle data ani platby (rozhodne Pavel před spuštěním).
- **Diagnostika** (jedna pro každý předmět, 20–25 úloh, ~25 min, bez taháku) ukáže, která témata dítěti nejdou, a aplikace podle ní seřadí doporučené lekce: nejdřív slabá témata, silná až na konci (nebo jen opakovací kontrola tématu).

## 3. Kdo sedí u lekce
- **Rodič s tahákem** (jako ve Spolu): dítě u počítače, rodič s telefonem, ptá se otázkami z taháku, nic nevysvětluje ani nepočítá, klikne semafor.
- **Nebo „Dnes samo“** (R64 ze Spolu): dítě pracuje samo, aplikace mu dává nápovědy (otázky 1–3 z taháku) a semafor vyhodnotí podle průběhu. Musí fungovat **v obou předmětech** (i poslech a diktát v češtině). Rodič vidí souhrn.
- Proto: otázky v taháku musí být srozumitelné i jako nápověda přímo pro dítě (přímá řeč k dítěti, bez rodu, bez prozrazení odpovědi).

## 4. Čím se liší od Spolu
- Úroveň: 8. třída opakuje 6.–7. ročník. Matematika: číselná náročnost jako Fáze 1 Spolu, širší záběr (rozhodnutí 1. 10.). Čeština o stupeň výš než „Čeština: základy“. Bez nové látky 8. ročníku (mocniny, odmocniny, Pythagorova věta, výrazy s mnohočleny zde nejsou; v češtině ne větné rozbory souvětí 9. ročníku).
- Svět úloh: 13–14letí (škola, sport, kamarádi, technika, příroda, rodina). Jména v češtině: Tomáš, Lucka, Honzík, Klára, Adam, Ema; detektiv je vždy Petr.
- Jazyková správnost češtiny jako ve Spolu: každý hodnocený tvar ověřený v Internetové jazykové příručce ÚJČ, zdroj v `kontrola.zdroj`, žádné dublety ve vyhodnocení.

## 5. Struktura repozitáře
- `obsah/lekce/M8-T<tt>-L<n>.json` — matematika (`tt` 01–10, `n` 1–4), `obsah/lekce/M8-T00-DIAG.json` diagnostika.
- `obsah/cestina/lekce/cj-t<t>-l<n>.json` — čeština (`t` 1–10, `n` 1–40 průběžně), `obsah/cestina/lekce/cj-t0-diag.json` diagnostika.
- Osnovy: `obsah/OSNOVA-MATEMATIKA.md`, `cestina/Obsah/OSNOVA.md`.
- Nahrávky češtiny: `web/audio/cestina/t<t>/…`, seznam a texty v `cestina/Obsah/AUDIO.md`.

## 6. Hotovo znamená
Pro každou lekci platí:
- validátor bez chyb;
- vzorová odpověď každého kroku vyjde správně;
- recenze (u češtiny i korektura ÚJČ) s `kontrola.jistota: "jista"`;
- průchod v prohlížeči žák → rodič → tisk a v režimu „Dnes samo“ bez nálezů.

## 7. Rozhodnutí vedoucího k osnově matematiky (1. 10., OSNOVA-MATEMATIKA §8)
1. `varianta: "z8"`; `tyden` = číslo tématu 1–10 (diagnostika 0), `poradi` = lekce v tématu 1–4. Úloha diagnostiky má vždy `tema` (1–10).
2. Pořadí témat podle osnovy (jednotky T03, geometrie T07, poměr a procenta před tělesy) — přijato.
3. Konstrukce (`rysovani`) v 40 lekcích nejsou (nefungují v režimu „Dnes samo“); souměrnost jen „pozná a dopočítá“. Papírové listy s konstrukcemi případně později mimo 40 lekcí.
4. Úrok: jednoduchý, za rok nebo celé měsíce, bez daně a bez složeného úrokování.
5. `typ: "cermat"` = „Hlavní úloha“; slovo CERMAT se v UI, tisku ani manuálu nesmí objevit. Pravidla klonování CERMAT (SABLONA §5.3, §18 o přijímačkách, §20) pro Spolu 8 neplatí.
6. Značky jednotek $\text{cm}^2$, $\text{m}^3$ ano; mocnina jako operace ne (obsah a objem jako součin).
7. Doporučení: slabá (0/2) i nejistá (1/2) témata jedna skupina v pořadí osnovy, silná (2/2) na konec a jen L4; po oranžové nebo červené L4 (podle hlavní barvy lekce) se doplní L1–L3.
8. T04-L4 detektiv „nezkrátil úplně“: odchylka povolena (final jako dlaždice nebo `cislo` „čitatel v základním tvaru“).
9. Diagnostika 20 úloh (2 na téma) — přijato.

## 8. Rozhodnutí vedoucího k osnově češtiny (1. 10., cestina/Obsah/OSNOVA.md §19)
1. Velká písmena a synonyma/antonyma vypuštěna (dublety) — přijato. Žádné 11. téma.
2. Diktát až od tématu 3 (T2 bez diktátu).
3. Společný základ Z1–Z5 (§2.1) přijat; diagnostika ho neměří.
4. **Diktát čárky nehodnotí** (`hodnotit_interpunkci: false` všude, aplikace interpunkci v diktátu neporovnává). Čárky se měří jen úlohami `klik_ve_textu` s `cil: "mezery"`. Diktát L36 je běžný diktát (slova a pravopis); nahrávky čtou interpunkci přirozeně a nevyslovují ji.
5. Diktát v T8 (L32) zůstává.
6. Nové kapitoly (`pridavna-jmena`, `zajmena-cislovky`, `shoda`, `vetne-cleny`, `pravopis`) jsou v `obsah/hlasky.md`, 44 nových kódů v `cestina/Obsah/TYPY-CHYB.md` (oddíl Spolu 8) a `web/js/typy-chyb-cj.js`. Kódy v `chyby_ocekavane` holé (aplikace skládá `diktat-pravopis-…`).
7. Nahrávka diktátu hlásí „velké písmeno — …“ i u přivlastňovacích tvarů (*Tomášovy, Klářin*).
8. `oznac_role`: nejvýš 8 rolí v jednom kroku; víc → rozdělit na kroky po skupinách (např. ohebné / neohebné druhy).
9. Prahy `semafor_tydne` ~90 % zelená, ~70 % oranžová — přijato.
10. Diagnostika: položka s více mezerami se počítá jen celá; „7 a více slabých témat → pořadí osnovy“ — přijato.
11. Jméno Honzík: mimo T6 jen vytištěné, ne v diktátu ani v mezeře.

## 9. Rozšíření na celý školní rok (Pavel 9. 10. 2026)
1. **Období:** listopad 2026 – konec května 2027 (30 kalendářních týdnů, ~27 učebních po odečtení prázdnin), **3 lekce matematiky + 3 lekce češtiny týdně**. Délka lekce beze změny (matematika 20 min, čeština ~25 min); ze začátku budou děti rychlejší, to nevadí.
2. **Každá lekce má „naostro“ dvojče** na stejné téma, trochu těžší nebo objemnější („teď ukaž, že to opravdu umíš“). Ze 40 lekcí na předmět je 80 (40 učebních + 40 naostro).
3. **Pořadí s odstupem:** naostro lekce přijde o jednu lekci později, v tématu: L1 → L2 → L1 naostro → L3 → L2 naostro → L4 → L3 naostro → L4 naostro.
4. **Semafor → B-varianta:** ke každé z 80 lekcí je B-varianta (stejná lekce a obtížnost, jiná slova / čísla / věty). Celkem 160 lekcí na předmět.
   - **Červená** → aplikace nabídne B-variantu. Ta se nepočítá do 3 lekcí týdně.
   - **Oranžová** → **jen** ústní pětiminutovka pro rodiče následující den (text v `semafor.oranzova`, jako dnes). B-varianta se nenabízí. (Pavel 9. 10.)
5. **Kalendář pro každé dítě zvlášť** (Pavel 9. 10.): od prvního dne dítěte se otevírají 3 lekce matematiky + 3 češtiny týdně, v pořadí podle úvodního testu (slabá témata první). Ne společné datum pro všechny.
6. **Pololetní test** v lednu, 1 na předmět (formát jako úvodní test). Přeskládá zbytek roku podle toho, co dítěti jde a nejde.
Plán prací a otevřené body: `PLAN-ROZSIRENI.md`.
