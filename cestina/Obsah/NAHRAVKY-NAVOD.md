# Návod pro agenta: nahrávky češtiny Spolu 8 v ElevenLabs

Verze 1.0, 9. 10. 2026. Napsal vedoucí projektu Spolu 8 pro samostatného agenta (Cowork + Claude in Chrome), který pracuje přes noc bez dozoru.
Zadavatel je Pavel (StudentBase.cz). Tento návod je závazný. Když něco nesedí, zastav se a zapiš to do zprávy, nevymýšlej.

---

## 1. Úkol jednou větou
Pro každou položku ze seznamu `nahravky-k-nataceni.md` vygeneruj v ElevenLabs nahrávku z **přesně zadaného textu**, stáhni ji jako MP3, přejmenuj podle seznamu a přesuň do cílové složky. Vše zapisuj do deníku, aby se dalo kdykoli navázat.

## 2. Co dostaneš (od Pavla v Coworku)

| Co | Kde | Poznámka |
|---|---|---|
| Tento návod | `NAHRAVKY-NAVOD.md` | |
| Seznam nahrávek | `nahravky-k-nataceni.md` (a totéž jako tabulka `nahravky-k-nataceni.csv`) | Čti z `.md`. Text každé nahrávky je v bloku ```` ```text ```` a kopíruje se celý, přesně. |
| Složka stahování | **`hlas tutor`** | Chrome do ní ukládá stažené soubory (Pavel ji nastavil jako výchozí). |
| Cílová složka | složka, kterou ti Pavel zpřístupní v Coworku. Dál jí říkám **CÍL** | Sem patří hotové nahrávky. |
| ElevenLabs | `https://elevenlabs.io/app/speech-synthesis/text-to-speech`, Pavel je v Chromu přihlášený | |

Než začneš, ověř, že máš přístup ke všemu z tabulky. Když něco chybí (složka, přihlášení), nic negeneruj, napiš to do `CÍL/ZPRAVA.md` a skonči.

## 3. Struktura v cílové složce
Seznam má u každé nahrávky **složku** (`t3` až `t10`, později možná další) a **název souboru** (např. `l12-d1.mp3`). Výsledek musí vypadat takto:

```
CÍL/
  t3/
    l9-u3.mp3
    l11-u3.mp3
    l12-d1.mp3
    …
  t4/
    …
  nahravky-denik.csv   ← deník (bod 6)
  ZPRAVA.md            ← zpráva na konci (bod 9)
```

Pravidla pro názvy (aplikace je hledá doslova):
- přesně podle seznamu, **malými písmeny, bez diakritiky a mezer**, s příponou `.mp3`;
- `l9-u3.mp3` = lekce 9, úloha 3 (poslech); `l12-d1.mp3` = lekce 12, diktát, věta 1;
- nic nepřidávej (žádné `_final`, `(1)`, datum). Nic nepřečíslovávej.

## 4. Nastavení ElevenLabs (jednou na začátku, pak před každou nahrávkou zkontroluj)
1. **Hlas: stejný jako u prvních čtyř nahrávek** (Pavel je dělal 2. 10.).
   - Otevři v ElevenLabs historii (History) a najdi generování textu „Pátý den tábora jsme my dva našli v lese tři houby.“ (případně „Večer jsme šli kolem rybníka a viděli tam dvě volavky.“).
   - Použij **ten hlas** a **stejné nastavení** (rychlost, stabilita, podobnost). Zapiš si je do `ZPRAVA.md`.
   - Když tyto nahrávky v historii nenajdeš: použij ženský, klidný český hlas „paní učitelka, která nespěchá“. Dej přednost hlasu, který Pavel už používal (podívej se do historie), a do zprávy napiš, který jsi vybral. Hlas pak **po celou dobu neměň**.
2. **Model: Eleven Multilingual v2.**
   - Jen ten spolehlivě čte češtinu a umí pauzy `<break time="…" />`.
   - Nepoužívej v3 ani Flash/Turbo, protože pauzy by přečetly nahlas nebo ignorovaly.
3. **Výchozí nastavení**, když z historie nic nevyčteš:
   - Speed 0,9;
   - Stability ~60 %;
   - Similarity ~75 %;
   - Style 0;
   - Speaker boost zapnutý.
4. **Výstup MP3** (výchozí 44,1 kHz, 128 kb/s je v pořádku).
5. **Jazyk:** když nabídka jazyka existuje, zvol češtinu.

## 5. Postup pro jednu nahrávku (opakuj pro každou položku v pořadí)
1. **Deník:** zkontroluj v `CÍL/nahravky-denik.csv`, jestli položka už není `hotovo`, a v `CÍL/<složka>/`, jestli soubor neexistuje. Pokud ano, přeskoč ji.
2. **Hlídej složku stahování:** zapamatuj si, které soubory `.mp3` teď leží v `hlas tutor`. Nový soubor poznáš tak, že tam předtím nebyl.
3. **Vlož text:** do textového pole ElevenLabs vlož **přesně a celý** text z bloku ```` ```text ```` (bez zpětných apostrofů).
   - Neměň ani písmeno, čárku ani pauzu.
   - Pole musí být předtím prázdné.
4. **Kontrola před generováním:**
   - vybraný hlas = ten z bodu 4;
   - model = Multilingual v2;
   - text v poli končí stejně jako text v seznamu.
5. **Vygeneruj** (Generate) a počkej, až se nahrávka objeví v přehrávači.
6. **Stáhni** (ikona Download u vygenerované nahrávky).
   - Když se Chrome zeptá, kam uložit, ulož do `hlas tutor`.
   - Počkej, až soubor v `hlas tutor` přibude, nejvýš 60 s. Pozor na rozpracované stahování (`.crdownload`), na to čekej.
7. **Najdi nový soubor:** v `hlas tutor` musí být **právě jeden** nový `.mp3` (ElevenLabs ho pojmenuje sám, třeba `ElevenLabs_2026-10-09T…mp3`).
   - Když je nových víc nebo žádný, nic nepřesouvej a řeš to podle bodu 8.
8. **Zkontroluj soubor:**
   - velikost aspoň 15 kB;
   - délka podle přehrávače v ElevenLabs: **poslech asi 3–20 s, diktát asi 8–45 s**.

   Výrazně jiná délka je podezřelá (třeba pauzy přečtené jako slova, nebo nahrávka uťatá). Zapiš ji do deníku jako `zkontrolovat`.
9. **Přesuň a přejmenuj:** soubor přesuň do `CÍL/<složka>/<název_souboru>` (složku vytvoř, pokud není). V `hlas tutor` nesmí zůstat.
10. **Zapiš do deníku** řádek (bod 6).
11. **Pokračuj** další položkou. Nikdy negeneruj dvě nahrávky najednou ani v několika záložkách.

## 6. Deník `CÍL/nahravky-denik.csv`
Založ ho na začátku, pokud neexistuje (UTF-8, oddělovač středník), a po každé nahrávce do něj hned zapiš:

```
poradi;slozka;nazev_souboru;stav;delka_s;velikost_kb;pokusu;cas;poznamka
3;t3;l12-d1.mp3;hotovo;14;220;1;2026-10-09 23:41;
```

`stav`:
- `hotovo` = soubor je v CÍL a kontrola prošla;
- `zkontrolovat` = soubor je v CÍL, ale něco nesedí (napiš co);
- `chyba` = soubor není (napiš proč).

**Deník je jediná pravda o postupu.** Když práci přerušíš nebo tě někdo spustí znovu, pokračuj první položkou, která v deníku není `hotovo` ani `zkontrolovat`.

## 7. Co dělat, když… (nevymýšlej jiná řešení)

| Situace | Co udělat |
|---|---|
| Stažený soubor se do 60 s neobjevil | Klikni znovu jen na Download (negeneruj znovu). Když ani pak ne, zapiš `chyba` a pokračuj další položkou. |
| V `hlas tutor` jsou dva a více nových `.mp3` | Nic nepřesouvej ani nemaž. Zapiš `chyba – nejasné stažení`, nové soubory nech ležet a jdi dál. Pavel to ráno vyřeší. |
| Generování selže nebo nahrávka je zjevně špatně (ticho, cizí jazyk, uťatá) | Vygeneruj znovu. **Nejvýš 2 pokusy na položku**, pak `chyba`. |
| Dojdou kredity, odhlásí tě, objeví se captcha nebo platba | **Okamžitě skonči.** Nic nekupuj, nepřihlašuj se jinam, nic nepotvrzuj. Napiš do `ZPRAVA.md`, kde jsi skončil. |
| ElevenLabs nabídne jiný model, „vylepšení textu“ nebo automatický překlad | Odmítni. Text a model se nemění. |
| Text v seznamu ti připadá chybný (překlep, divná věta) | **Neopravuj ho.** Věty jsou ověřené jazykovým korektorem a některé jsou záměrně zvláštní (učí se na nich). Nahraj přesně, případně si poznámku zapiš do deníku. |
| V `hlas tutor` leží jiné Pavlovy soubory | Nesahej na ně. Přesouváš jen soubor, který jsi právě stáhl. |
| Cílový soubor už v CÍL existuje | Nepřepisuj ho. Zapiš `přeskočeno – existuje`. |

**Nikdy:**
- nemaž nic mimo vlastní stažené soubory;
- neměň nastavení účtu;
- nesdílej nahrávky;
- neměň hlas během práce;
- nespouštěj víc generování naráz.

## 8. Jak zní text, který vkládáš (ať víš, co čekat)
- **Poslech:** jedna nebo dvě obyčejné věty. Hlas je čte přirozeně, s oznamovací intonací.
- **Diktát:** text vypadá takto:
  ```
  Malí kluci čekají na hřišti. <break time="2s" /> Malí <break time="0.7s" /> kluci <break time="0.7s" /> čekají <break time="0.7s" /> na <break time="0.7s" /> hřišti.
  ```
  - Hlas přečte větu celou, udělá pauzu 2 s a pak ji zopakuje pomalu po slovech.
  - Značky `<break …/>` se nesmí ozvat jako slova. Kdyby se ozvaly, je špatně model; oprav ho na Multilingual v2 a nahrávku vygeneruj znovu.
  - Když je v textu „velké písmeno — Tomášovy“, je to záměr: dítě se dozví, že slovo píše velkým písmenem.

## 9. Na konci: `CÍL/ZPRAVA.md`
Krátce, česky:
- **Kolik nahrávek je `hotovo`, `zkontrolovat` a `chyba`** (u každé `zkontrolovat` a `chyba` jedna věta proč).
- **Hlas a nastavení:** název hlasu, model, rychlost, stabilita, podobnost.
- **Kde jsi skončil**, pokud jsi nedokončil všechno, a proč.
- **Co má Pavel ráno poslechnout:** vyber 5 nahrávek, z toho aspoň 3 diktáty (různá témata) a tu nejdelší.

## 10. Co bude dál (pro Pavla, ne pro agenta)
1. **Poslechnout vybraných 5 nahrávek** ze `ZPRAVA.md` a projít položky `zkontrolovat`.
2. **Předat nahrávky do projektu:**
   - buď celou CÍL (složky `t3`…`t10`) zkopírovat do `Desktop\Spolu8\web\audio\cestina\`;
   - nebo ji poslat jako zip vedoucímu projektu (chat Spolu 8), který je zapojí a ověří (validátor + QA).
3. **Až přibudou nové lekce** (naostro a B-varianty), vedoucí přegeneruje `nahravky-k-nataceni.md` (`node nastroje/seznam-nahravek.mjs`). Agent pak pojede **podle stejného návodu** znovu. Hotové nahrávky v seznamu už nebudou.
