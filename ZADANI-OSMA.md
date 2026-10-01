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
- Úroveň: 8. třída opakuje 6.–7. ročník, úlohy o stupeň těžší než „Čeština: základy“ a Fáze 1 Spolu, ale bez nové látky 8. ročníku (mocniny, odmocniny, Pythagorova věta, výrazy s mnohočleny zde nejsou; v češtině ne větné rozbory souvětí 9. ročníku).
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
