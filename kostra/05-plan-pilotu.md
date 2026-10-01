# 05 — Plán pilotu (1. 10. 2026)

## Pilotní lekce (fáze `pilot`, verejna=true, otevrit_od 2026-10-01)
| id | téma | kapitola | cíl pro rodiče |
|---|---|---|---|
| P1 | Pořadí operací (závorky, mocniny, násobení/dělení před sčítáním) | pocetni-operace | Dítě umí říct, co počítá první a proč |
| P2 | Celá čísla (záporná čísla, sčítání/odčítání, násobení znamének) | cela-cisla | Znaménka bez tipování |
| P3 | Zlomky — základ (krácení, rozšiřování, sčítání se společným jmenovatelem, základní tvar) | zlomky | Zlomek jako číslo, ne jako dvě čísla |
| P4 | Zlomky — složitější (násobení, dělení, mocnina zlomku, složený zlomek, smíšené číslo) | zlomky | Postup po krocích místo paniky |

Každá lekce: rozcvička, detektiv, CERMAT klon (u P1/P2 z úloh 1–3 CERMAT testu, u P3/P4 z úloh se zlomky), semafor. Úlohy mohou čerpat ze Survivoru (bloky 1A–2C), přepsané do nového formátu.

## Průchod pilotem (rodina)
Registrace → volba role na obou zařízeních → manuál pro rodiče (1 obrazovka) → P1…P4 (doporučeno 1 denně) → dotazník → nabídka 790 Kč.

## Test před spuštěním (28.–30. 9.)
- Interní: QA tester projde scénáře v `testy/`, testovací rodič projde P1–P4 jen s telefonem.
- Externí: 2 rodiny Pavlových žáků (8. třída stačí, látka je základní). Pavel sleduje: pochopil rodič, co dělat, bez vysvětlení? Kde se zasekl? Vešli se do 25 min?
- Pavel schvaluje design (stránka komponent + obrazovky) a průchod lekce.

## Co měřit v pilotu (admin)
- Registrace/den, podíl rodin s dokončenou P1, P3, P4.
- Režim app vs. papír.
- Průměrný čas lekce; kolik lekcí přesáhlo 25 min.
- Rozložení semaforů per úloha (odhalí příliš těžké/lehké úlohy).
- Dotazník: skóre srozumitelnosti taháku, cena.

## Rizika a pojistky
- Rodič neví, co s telefonem → manuál 1 obrazovka + první karta lekce opakuje 3 pravidla.
- Dítě odmítá tablet → režim papír.
- Supabase free se uspí → ruční kontrola každý týden v říjnu; před 1. 12. přejít na Pro nebo mít jistotu provozu.
- Obsah moc těžký → semafor per úloha ukáže, kde; oprava JSON + seed bez nasazení webu.
