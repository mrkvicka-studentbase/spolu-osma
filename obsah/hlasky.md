# Hlášky — texty pro žáka a rodiče

Zdroj pravdy pro `web/js/hlasky.js` (export objektu `{ klic: text }`). Frontend texty nepřepisuje, jen je bere odsud.

**Konvence**
- Klíč: `<skupina>.<nazev>`, česky bez diakritiky, `snake_case` za tečkou (`zak.zkus_znovu`). Skupiny: `zak`, `rodic`, `oba`, `zamceno`, `ucet`, `chyba`, `prazdny`, `obnoveni`, `sos`, `dotaznik`, `dite`.
- Proměnné ve složených závorkách: `{datum}`, `{n}`, `{tema}` … Frontend je nahradí (a escapuje). Text sám je prostý text, bez Markdownu a HTML.
- `\n` v textu = nový řádek (jen u e-mailu).
- Žákovi tykáme, rodiči vykáme. Žádná procenta, body, známky. Chyba žáka se nikdy nebarví červeně a neříká se „špatně“.
- Semaforová tlačítka se zobrazují s ikonou a textem, ne jen barvou.

## Žák — lekce (`lekce.html`)
| klíč | kdy | text |
|---|---|---|
| `zak.spravne` | krok odevzdán správně | Správně! |
| `zak.zkus_znovu` | 1. špatný pokus | Ještě to nesedí. Zkus to znovu, máš ještě jeden pokus. |
| `zak.nesedi_dal` | 2. špatný pokus (správný výsledek se neukazuje) | Zatím to nesedí. Nevadí, jdeme dál. Rodič má u sebe otázky, které pomůžou. |
| `zak.spravne_zkrat` | zlomek správně, ale ne v základním tvaru (počítá se jako správně) | Výsledek je správně, ale uprav ho do základního tvaru. |
| `zak.uloha_hotova` | po posledním kroku úlohy 1–3 | Úloha {n} ze 4 je hotová. Pokračuj další. |
| `zak.tip_zvyrazneni` | nad zadáním, první úloha první lekce | Tip: klikni na číslo nebo slovo v zadání a podtrhne se. |
| `zak.konec` | po 4. úloze | Hotovo, dnešní lekce je za tebou! Zavolej rodiče, na telefonu teď dokončí semafor. |
| `zak.konec_nadpis` | nadpis po 4. úloze | Hotovo, ukaž telefon rodiči |
| `zak.posledni_uloha_hotova` | po posledním kroku 4. úlohy | Poslední úloha je hotová. |
| `zak.napoveda_zvyrazneni` | pod zadáním (kromě první úlohy první lekce) | Klikni na slovo nebo číslo a podtrhni si ho. |
| `zak.zadani_pokracuje` | dole v přilepené kartě zadání, když zadání pokračuje pod okrajem (klepnutí posune) | Zadání pokračuje |
| `zak.neplatne_dlazdice` | nečitelný vstup: nic nevybráno (nepočítá se jako pokus) | Nejdřív vyber jednu možnost. |
| `zak.neplatne_cislo` | nečitelný vstup: číslo (nepočítá se jako pokus) | Zapiš výsledek číslem, třeba 12 nebo 2,5. |
| `zak.neplatne_zlomek` | nečitelný vstup: zlomek (nepočítá se jako pokus) | Vyplň čitatel i jmenovatel celými čísly. Jmenovatel nesmí být 0. |
| `zak.neplatne_smisene` | nečitelný vstup: smíšené číslo (nepočítá se jako pokus) | Vyplň celou část, čitatel i jmenovatel celými čísly. |
| `zak.neplatne_text` | nečitelný vstup: prázdný text (nepočítá se jako pokus) | Napiš svou odpověď. |
| `zak.neplatne_vyraz` | F1 `vyraz`: zápis nejde přečíst (nepočítá se jako pokus) | Zapiš výraz, třeba 3x − 2 nebo 2(x + 1). Krát piš · nebo *, mocninu x². |
| `zak.neplatne_poradi` | F1 `poradi`: nejsou očíslované všechny operace (nepočítá se jako pokus) | Klikni postupně na všechny početní operace, pak odevzdej. |
| `zak.vyraz_zjednodus` | F1 `vyraz`: hodnota sedí, ale víc členů než výsledek (R43: nepočítá se jako správně) | Hodnota sedí, ale výraz ještě zjednoduš. |
| `zak.vyraz_roznasob` | F1 `vyraz`: hodnota sedí, ale se závorkou (kontrola_tvaru bez_zavorek; R43: nepočítá se jako správně) | Hodnota sedí, ale ještě roznásob závorku. |
| `zak.vyraz_soucin` | F1/F2 `vyraz`: hodnota sedí, ale výsledek není součin (kontrola_tvaru soucin: vytýkání i rozklad podle vzorce; nepočítá se jako správně) | Hodnota sedí, ale výsledek má být součin. Zkus výraz rozložit. |
| `zak.vyraz_nahled` | F1 `vyraz`: popisek náhledu zapsaného výrazu | Takhle to čtu: |
| `zak.vyraz_nahled_nejde` | F1 `vyraz`: náhled, zápis zatím nejde přečíst | zatím to nedokážu přečíst |
| `zak.poradi_napoveda` | F1 `poradi`: pod výrazem | Klikni na znaménka v tom pořadí, v jakém počítáš. Dalším klikem číslo zrušíš. |
| `zak.poradi_znovu` | F1 `poradi`: tlačítko, smaže všechna čísla | Začít znovu |
| `zak.opakovana_odpoved` | stejná odpověď jako v minulém pokusu (nepočítá se) | Tahle odpověď už byla. Zkus jinou. |
| `zak.odevzdano_text` | odevzdaný textový krok (hodnotí rodič) | Odevzdáno. Tohle si projdete s rodičem. |
| `zak.papir_nadpis` | lekce v režimu papír (obrazovka žáka) | Počítáš na papír, výsledky zadá rodič |
| `zak.papir_text` | lekce v režimu papír (obrazovka žáka) | Úlohy máš vytištěné. Až budeš mít hotovo, ukaž papír rodiči. Výsledky zapíše do telefonu. |
| `zak.pripravit_nadpis` | H2: obrazovka „Připrav si" před 1. úlohou (před odpočtem) | Připrav si |
| `zak.pripravit_text` | H2: pod nadpisem „Připrav si" | Než začneš, dej si na stůl všechno, co budeš potřebovat. Co máš, odškrtni. |
| `zak.pripravit_tlacitko` | H2: tlačítko, aktivní po odškrtnutí všeho | Mám připraveno, jdu na to |
| `zak.pripravit_zbyva` | H2: pod tlačítkem, dokud není vše odškrtnuté | Odškrtni všechno, pak můžeš začít. |

## Rodič — lekce (`rodic.html`)
| klíč | kdy | text |
|---|---|---|
| `rodic.tri_pravidla` | první karta lekce (před úlohou 1) | Tři pravidla: 1) Nepočítáte a nepíšete, jen se ptáte. 2) Dítě vysvětluje vám, ne vy jemu. 3) Po každé úloze klikněte do semaforu, co jste viděli. |
| `rodic.stav_nic` | dítě ještě nic neodevzdalo | Dítě zatím nic neodevzdalo. |
| `rodic.stav_spravne` | krok odevzdán správně | Dítě odevzdalo: {krok} ✔ |
| `rodic.stav_nesedi` | krok odevzdán, 2 pokusy nesedí | Dítě odevzdalo: {krok}, zatím nesedí. Zkuste otázky níže. |
| `rodic.stav_nesedi_kontrolni` | totéž u kontrolní úlohy (typ `semafor`; ODPOVED po bodu E) | Dítě odevzdalo: {krok}, zatím nesedí. Podívejte se do typické chyby. |
| `rodic.stav_obnovit` | tlačítko u stavu | Obnovit stav |
| `rodic.stav_naposledy` | pod stavem | Naposledy načteno v {cas}. |
| `rodic.papir_vysledek` | režim papír, pole u úlohy | Opište výsledek, který dítě napsalo na papír. Nic nepočítejte. |
| `rodic.dalsi_otazka` | tlačítko | Další otázka |
| `rodic.ukazat_reseni` | tlačítko (sbalené řešení) | Ukázat řešení |
| `rodic.semafor_nadpis` | nad tlačítky semaforu | Co jste viděli? |
| `rodic.volba_sam` | tlačítko semaforu | Vyřešil(a) sám/sama |
| `rodic.volba_s_otazkou` | tlačítko semaforu | Potřeboval(a) otázku |
| `rodic.volba_chyba_pocty` | tlačítko semaforu (R21; v DB dál `chyba_pocty`) | Spletl(a) se |
| `rodic.klic_uvod` | pod tlačítky semaforu, viditelné (obsah/semafor-klic.md) | Klikněte podle toho nejtěžšího, co se stalo: Nevěděl(a) > Spletl(a) se > Potřeboval(a) otázku > Sám/sama. |
| `rodic.klic_tlacitko` | sbalený rozhodovací klíč semaforu | Jak vybrat? |
| `rodic.klic_sam` | klíč: Vyřešil(a) sám/sama | Došlo k cíli samo, bez vaší otázky. |
| `rodic.klic_s_otazkou` | klíč: Potřeboval(a) otázku | Došlo k cíli po některé z otázek. Patří sem i: spletlo se, ale po otázce se opravilo. |
| `rodic.klic_chyba_pocty` | klíč: Spletl(a) se | Postup znalo, ale výpočet nedotáhlo nebo se spletlo (v čísle, znaménku, pravidle, výběru) a neopravilo to. |
| `rodic.klic_nevedel` | klíč: Nevěděl(a), jak začít | Ani po třetí otázce se nepohnulo, po otázce jen tipovalo dlaždice, nebo většinu úlohy nezvládlo. |
| `rodic.otocena_odpoved` | sbalená vzorová odpověď pod „Otočenou rolí“ (tahak.otocena_role_odpoved) | Jak zní dobrá odpověď? |
| `rodic.co_vidi_dite` | sbalené zadání úlohy u rodiče (R21, jen ke čtení) | Co vidí dítě |
| `rodic.cteni_zapisu` | menu a manuál: slovníček obsah/cteni-zapisu.md | Jak číst zápisy nahlas |
| `rodic.zitra_zelena` | souhrn, hlavní barva zelená (manuál „Zítra“) | Zítra: nová lekce. |
| `rodic.zitra_oranzova` | souhrn, hlavní barva oranžová | Zítra: nejdřív 5minutové cvičení z doporučení níže, pak nová lekce. Je-li cvičení víc, stačí to u poslední úlohy. |
| `rodic.zitra_cervena` | souhrn, hlavní barva červená | Dnes skončete a pochvalte snahu. Zítra místo nové lekce: cvičení z doporučení níže, pak znovu tato lekce. |
| `rodic.volba_nevedel` | tlačítko semaforu | Nevěděl(a), jak začít |
| `rodic.uvod_nadpis` | nadpis úvodu lekce (úloha 1) | Než začnete |
| `rodic.plati` | nad žebříčkem `uvod_pravidla` (R23) | Platí: |
| `rodic.pravidla_nadpis` | rámeček pravidel pro rodiče, stejný v každé lekci | Pravidla pro vás |
| `rodic.pravidla_1` | rámeček pravidel | Nic nepočítáte ani nepíšete. |
| `rodic.pravidla_2` | rámeček pravidel | Ptáte se otázkami z taháku. Nic nevysvětlujete. |
| `rodic.pravidla_3` | rámeček pravidel | Chválíte snahu a postup, ne výsledek. |
| `rodic.postup_1` | krok 1 karty úlohy (A3) | Dítě čte a řeší. Vy mlčíte. |
| `rodic.postup_1_kontrolni` | krok 1 u kontrolní úlohy (typ semafor) | Dítě řeší samo, vy jen sledujete. |
| `rodic.postup_2` | krok 2 karty úlohy | Zasekne se? Přečtěte otázku. |
| `rodic.postup_2_pozn` | pod nadpisem kroku 2 | Další otázku čtěte, až když předchozí nepomůže. |
| `rodic.postup_2_pozn_priklady` | pod nadpisem kroku 2, rozcvička s otázkami po příkladech (A, B, …) | Každý příklad má svou otázku. Čtěte ji u příkladu, kde se dítě zasekne. |
| `rodic.postup_3` | krok 3 karty úlohy | Hotovo? Zeptejte se: |
| `rodic.postup_4` | krok 4 karty úlohy | Klikněte, jak to šlo |
| `rodic.pro_jistotu` | nadpis nad sbalenou typickou chybou a řešením | Pro jistotu |
| `rodic.krok_hotovo` | tlačítko v kroku ①–③ (F1, odškrtne krok) | Hotovo |
| `rodic.nezaseklo` | tlačítko v kroku ② (dítě se nezaseklo) | Nezaseklo se |
| `rodic.krok_hotovo_stav` | pro čtečku u odškrtnutého kroku | hotovo |
| `rodic.chybi_krok` | pod „Další úloha", když chybí krok ①–③ | Nejdřív odškrtněte krok {n}. |
| `rodic.chybi_semafor` | pod „Další úloha", když chybí semafor | Nejdřív klikněte, jak to šlo. |
| `rodic.pouzili_otazku` | nápověda u „Potřeboval(a) otázku", když rodič otázku použil | Použili jste otázku |
| `rodic.barva_zelena` | štítek barvy (A5; semafor, souhrn, přehled) | Zelená: zvládnuto |
| `rodic.barva_oranzova` | štítek barvy (A5) | Oranžová: zítra 5 minut procvičit |
| `rodic.barva_cervena` | štítek barvy (A5) | Červená: dnes stačí, zítra znovu |
| `rodic.zelena_s_otazkou` | zelená po volbě „Potřeboval(a) otázku“ | Příště zkuste podobnou úlohu bez otázky. |
| `rodic.zmenit_volbu` | pod výsledkem semaforu | Volbu můžete změnit. |
| `rodic.konec` | souhrn po 4. úloze | Lekce je hotová. Pochvalte dítě za práci, ne za výsledek. Doporučení na zítra najdete níže. |
| `rodic.konec_tlacitko` | tlačítko | Ukončit lekci |
| `rodic.sos_nabidka` | 2. červená v řadě u stejné kapitoly | Tohle téma dnes znovu nešlo. Nechcete ho probrat s lektorem? Online konzultace 30 minut, 150 Kč. |
| `rodic.sos_nadpis` | nad nabídkou SOS v souhrnu | Druhá červená v řadě u tématu {kapitola_nazev} |
| `rodic.vsechny_otazky` | tlačítko „Další otázka“ po odkrytí všech otázek | To jsou všechny otázky |
| `rodic.papir_nadpis` | režim papír, nadpis pole | Výsledek dítěte (papír) |
| `rodic.vyraz_zjednodus` | papír, `vyraz`: hodnota sedí, víc členů (R43: nesedí) | Hodnota sedí, ale výraz není dokončený: dá se ještě zjednodušit. Počítá se jako nesprávně. |
| `rodic.vyraz_roznasob` | papír, `vyraz`: hodnota sedí, zůstala závorka (R43: nesedí) | Hodnota sedí, ale výraz není dokončený: závorka se má roznásobit. Počítá se jako nesprávně. |
| `rodic.vyraz_soucin` | papír, `vyraz`: hodnota sedí, není součin (nesedí) | Hodnota sedí, ale výsledek má být součin (vytknutý nebo rozložený podle vzorce). Počítá se jako nesprávně. |
| `rodic.papir_neplatne` | režim papír, výsledek nejde přečíst | Zkontrolujte prosím zadaný výsledek. |
| `rodic.poradi_papir_nadpis` | F1 `poradi`, režim papír: nadpis bloku u kroku s pořadím | Pořadí operací (papír) |
| `rodic.poradi_papir_text` | F1 `poradi`, režim papír: pod nadpisem (1 povolené pořadí) | Takhle je to správně. Porovnejte s čísly na papíře dítěte. |
| `rodic.poradi_papir_vice` | F1 `poradi`, režim papír: víc povolených pořadí | Správně je kterékoli z těchto pořadí. Porovnejte s čísly na papíře dítěte. |
| `rodic.poradi_sedi` | F1 `poradi`, režim papír: tlačítko | Sedí |
| `rodic.poradi_nesedi` | F1 `poradi`, režim papír: tlačítko | Nesedí |
| `rodic.poradi_dite` | u kroku `poradi` v „Dítě odevzdalo" (R34) | Dítě klikalo: |
| `rodic.poradi_chyba` | u kroku `poradi`, když je pořadí známá chyba (R34) | Typická chyba: |
| `rodic.poradi_spravne` | u kroku `poradi`: správné pořadí (R34) | Správně: |
| `rodic.poradi_spravne_i` | u kroku `poradi`: další povolená pořadí (R34) | Správně je i: |
| `rodic.obrazek_popis` | F1 `obrazek`: popisek pod obrázkem u rodiče ({popis} = obrazek_popis) | Na obrázku: {popis} |
| `rodic.ukazat_kontrolu` | tlačítko u sbalené „Kontroly pro vás“ (R8) | Ukázat kontrolu |
| `rodic.posledni_uloha` | spodní lišta na poslední úloze (neaktivní) | Poslední úloha |
| `rodic.souhrn_nadpis` | nadpis souhrnu (pod ním `rodic.konec`) | Souhrn lekce |
| `rodic.souhrn_hlavni` | štítek u úlohy „Sám/sama“ v souhrnu | Hlavní barva lekce |
| `rodic.souhrn_na_zitra` | nadpis doporučení v souhrnu | Na zítra |
| `rodic.souhrn_upravit` | tlačítko v souhrnu (zpět ke změně semaforu) | Upravit semafor |
| `rodic.souhrn_jen_cteni` | souhrn dokončené lekce otevřený z přehledu (R19) | Lekce je dokončená ({datum}). Souhrn je jen pro čtení. |
| `rodic.lekce_ukoncena` | po kliknutí na „Ukončit lekci“ | Lekce je uložená. Pochvalte dítě a zítra pokračujte. |

## Obě role
| klíč | kdy | text |
|---|---|---|
| `oba.cas_vyprsel` | odpočet doběhl (jen upozornění, nic se nezastaví) | Doporučený čas vypršel. Můžete dokončit nebo zavřít. |
| `oba.max_lekce_den` | přehled, po dokončené lekci ten den | Dnešní lekce je hotová. Další doporučujeme až zítra. |
| `oba.pripravit_tisk` | H2: tisk, řádek pod záhlavím ({pomucky} = seznam z lekce) | Připrav si: {pomucky} |
| `oba.tisk_zpet_lekce` | H3: tisk, tlačítko nahoře (návrat na lekci rodiče / žáka) | Zpět k lekci |
| `oba.tisk_zpet_prehled` | H3: tisk otevřený bez návratové adresy | Zpět na přehled |
| `oba.tisk_odkaz` | H3: režim papír, odkaz na tiskovou verzi (rodič i žák) | Úlohy k tisku |
| `oba.poradi_tisk` | F1 `poradi`: tisk, pokyn nad výrazem s kroužky | Očísluj, v jakém pořadí počítáš. |

## Zamčený obsah (`prehled.html`)
| klíč | kdy | text |
|---|---|---|
| `zamceno.faze` | fáze ještě není otevřená | Otevře se {datum}. |

## Uzavřený účet (stav rodiny `uzavreny`)
| klíč | kdy | text |
|---|---|---|
| `ucet.uzavreny_nadpis` | nadpis stránky | Děkujeme, že jste opakovali s námi |
| `ucet.uzavreny` | text stránky | Účet je uzavřený a lekce už nejsou dostupné. Držíme palce v osmé třídě i dál! |
| `ucet.uzavreny_doucovani` | výzva pod textem | Chcete pokračovat v doučování? Napište nám na {email} nebo se podívejte na studentbase.cz. |

## Účet — registrace, přihlášení, nové heslo (`registrace.html`, `nove-heslo.html`)
| klíč | kdy | text |
|---|---|---|
| `ucet.chyba_jmeno` | registrace, prázdné jméno | Napište prosím své jméno. |
| `ucet.chyba_email_prazdny` | prázdný e-mail | Napište prosím e-mail. |
| `ucet.chyba_email_tvar` | registrace, e-mail bez @ / tečky | Zkontrolujte prosím e-mail, chybí v něm zavináč, tečka nebo koncovka (např. .cz). |
| `ucet.chyba_email_kratce` | přihlášení a obnova hesla, e-mail nemá tvar | Zkontrolujte prosím e-mail. |
| `ucet.chyba_heslo_kratke` | heslo kratší než 8 znaků | Heslo musí mít alespoň 8 znaků. |
| `ucet.chyba_heslo_kratke_pocet` | heslo kratší než 8 znaků (už něco napsal) | Heslo musí mít alespoň 8 znaků (teď má {n}). |
| `ucet.chyba_heslo_prazdne` | přihlášení bez hesla | Napište prosím heslo. |
| `ucet.chyba_hesla_neshoda` | nové heslo podruhé jinak | Hesla se neshodují. Napište prosím dvakrát stejné heslo. |
| `ucet.chyba_dite` | registrace, prázdné jméno dítěte | Napište prosím křestní jméno dítěte. |
| `ucet.chyba_skola` | registrace, nevybraná škola | Vyberte prosím typ školy. |
| `ucet.chyba_znamka` | registrace, nevybraná známka | Vyberte prosím známku. Když si nejste jistí, zvolte tu nejbližší. |
| `ucet.chyba_souhlas` | registrace bez souhlasu | Pro registraci je potřeba souhlas s podmínkami. |
| `ucet.nenacteno` | nejde načíst spojení se serverem | Nepodařilo se spojit se serverem. Zkontrolujte připojení a obnovte stránku. |
| `ucet.obnova_odeslano_nadpis` | po odeslání žádosti o nové heslo | Poslali jsme vám odkaz |
| `ucet.obnova_odeslano` | po odeslání žádosti o nové heslo | Pokud je adresa {email} u nás registrovaná, přijde na ni za chvíli e-mail s odkazem na nové heslo. Nic nepřišlo? Podívejte se do složky Hromadné nebo Spam. |
| `ucet.odkaz_neplatny` | nove-heslo.html bez platného odkazu z e-mailu | Odkaz pro nové heslo je neplatný nebo vypršel. Požádejte prosím o nový. |
| `ucet.nove_heslo_ulozeno` | nové heslo uloženo | Heslo je změněné. Přesměrováváme vás na přehled… |

## Chyby a stavy
| klíč | kdy | text |
|---|---|---|
| `chyba.ulozeni` | zápis do Supabase selhal | Nepodařilo se uložit, zkuste obnovit stránku. Odpovědi zatím držíme a zkusíme je uložit znovu. |
| `chyba.ulozeni_ok` | opakovaný zápis prošel | Uloženo. |
| `chyba.nacteni` | nepodařilo se načíst data | Nepodařilo se načíst data. Zkontrolujte připojení a obnovte stránku. |
| `chyba.offline` | prohlížeč hlásí offline | Jste offline. Jakmile se připojení vrátí, vše uložíme. |
| `chyba.tisk_nenacteno` | H3: tisková verze se nenačetla (síť, přihlášení) | Tiskovou verzi se nepodařilo načíst. Zkontrolujte připojení a obnovte stránku. |
| `chyba.tisk` | H3: window.print() selhal | Tisk se nepodařilo spustit. Zkuste v menu prohlížeče Sdílet → Tisk. |
| `prazdny.lekce` | přehled bez lekcí | Zatím tu nejsou žádné lekce. Brzy je doplníme. |
| `prazdny.deti` | účet bez dítěte | Zatím tu není žádné dítě. Přidejte ho, ať může začít. |
| `prazdny.souhrn` | souhrn/statistika bez dat | Tady se ukáže souhrn po první dokončené lekci. |

## Obnovení rozpracované lekce
| klíč | kdy | text |
|---|---|---|
| `obnoveni.rodic` | rodič otevře lekci se sezením `probiha` ({celkem} = počet úloh lekce: 4 Matematika, 6 čeština; zatím nepoužito ve webu) | Máte rozpracovanou lekci {tema} (úloha {n} z {celkem}). Chcete pokračovat, kde jste skončili? |
| `obnoveni.pokracovat` | tlačítko | Pokračovat |
| `obnoveni.znovu` | tlačítko | Začít znovu |
| `obnoveni.zak` | žák otevře rozpracovanou lekci | Vítej zpátky! Pokračuješ úlohou {n}. |

## SOS
| klíč | kdy | text |
|---|---|---|
| `sos.nadpis` | karta SOS u kapitoly | Potřebujete pomoc? |
| `sos.text` | karta SOS | Když se téma opakovaně nedaří, probereme ho spolu. Online konzultace s lektorem StudentBase: 30 minut, 150 Kč, platí se zvlášť. Napište nám a ozveme se s termínem. |
| `sos.tlacitko` | tlačítko (otevře mailto) | Napsat e-mail |
| `sos.mailto_predmet` | předmět e-mailu (agenti/07 bod 8) | SOS: {kapitola_nazev} — {jmeno_ditete} |
| `sos.mailto_telo` | tělo e-mailu | Dobrý den,\n\npotřebujeme pomoc s tématem {kapitola_nazev}.\n\nDítě: {jmeno_ditete}\nLekce: {lekce_tema} ({lekce_id})\nCo nešlo: \n\nKdy se nám hodí konzultace (dny a časy): \n\nDěkuji,\n{jmeno_rodice} |

Názvy kapitol pro `{kapitola_nazev}`:

| `kapitola` | název |
|---|---|
| `pocetni-operace` | početní operace |
| `cela-cisla` | celá čísla |
| `zlomky` | zlomky |
| `desetinna-cisla` | desetinná čísla |
| `pomer` | poměr |
| `procenta` | procenta |
| `jednotky` | jednotky |
| `slovni-ulohy` | slovní úlohy |
| `vyrazy` | výrazy |
| `rovnice` | rovnice |
| `geometrie` | geometrie |
| `mix` | smíšené úlohy |
| `simulace` | simulace testu |
| `slovni-druhy` | slovní druhy |
| `podstatna-jmena` | podstatná jména |
| `vzory` | vzory podstatných jmen |
| `slovesa` | slovesa |
| `vyjmenovana-slova` | vyjmenovaná slova |
| `podmet-prisudek` | podmět a přísudek |
| `souveti` | věta a souvětí |
| `pridavna-jmena` | přídavná jména |
| `zajmena-cislovky` | zájmena a číslovky |
| `shoda` | shoda přísudku s podmětem |
| `vetne-cleny` | větné členy |
| `pravopis` | pravopis |

## Profil dítěte (`prehled.html`, přidání 2. dítěte / chybějící dítě)
| klíč | kdy | text |
|---|---|---|
| `dite.pridat_tlacitko` | přehled, vedle jména dítěte (rodina má 1 dítě) | Přidat druhé dítě |
| `dite.pridat_nadpis` | nadpis formuláře | Přidat druhé dítě |
| `dite.pridat_text` | pod nadpisem formuláře | Druhé dítě je zdarma a má vlastní průběh lekcí. |
| `dite.prvni_nadpis` | přehled bez dítěte (trigger ho nezaložil) | Přidejte profil dítěte |
| `dite.prvni_tlacitko` | tlačítko v prázdném přehledu | Přidat profil dítěte |
| `dite.ulozit` | tlačítko formuláře | Uložit profil |
| `dite.pridano` | po uložení | Profil dítěte {jmeno} je přidaný. |
| `dite.max_2` | pokus o 3. dítě | Můžete mít nejvýše 2 profily dětí. |

## Diagnostika Fáze 1 (týden 0) — `lekce.html`, `rodic.html`, `prehled.html`, `tisk.html`
Zdroj textů: `obsah/diagnostika-report.md` §6 a `obsah/diagnostika-obrazovka.md` §7 (R37: bez „přeskočit“). Klíče s podskupinou (v zadání `diag.stav.jista`) jsou tu s podtržítkem (`diag.stav_jista`), generátor bere jen jednu tečku.

| klíč | kdy | text |
|---|---|---|
| `diag.karta_podtitul` | přehled, karta diagnostiky | Asi 20 krátkých úloh, asi 25 minut. Ukáže, kterým tématům dát víc času. |
| `diag.karta_doporuceni` | přehled, karta diagnostiky (rodič) | Doporučujeme udělat ji před týdnem 1. |
| `diag.karta_sekce` | přehled, nadpis sekce týdne 0 | Týden 0 — vstupní diagnostika |
| `diag.karta_zacit` | přehled, tlačítko (rodič) | Začít diagnostiku |
| `diag.karta_zacit_zak` | přehled, tlačítko (žák) | Začít |
| `diag.karta_hotovo` | přehled, štítek hotové diagnostiky | Hotovo |
| `diag.karta_vysledek` | přehled, odkaz rodiče po dokončení | Výsledek diagnostiky |
| `diag.start_rodic` | modal volby režimu u diagnostiky | Dítě pracuje samo, vy nenapovídáte. Po polovině si může dát přestávku. |
| `diag.prubeh` | žák, lišta ({z} = z / ze podle čísla) | Úloha {n} {z} {celkem} |
| `diag.ulozeno` | žák, po odevzdání (neutrálně, bez ✔/✘) | Uloženo. |
| `diag.prestavka_nadpis` | žák, v polovině testu | Máš za sebou polovinu. |
| `diag.prestavka_text` | žák, v polovině testu | Dej si pět minut pauzu. Napij se, protáhni se. Pak dokončíš druhou polovinu. |
| `diag.prestavka_pokracovat` | žák, přestávka | Pokračovat |
| `diag.prestavka_jindy` | žák, přestávka | Dokončím jindy |
| `diag.konec_nadpis` | žák, konec | Hotovo. Díky! |
| `diag.konec_text` | žák, konec | Výsledek uvidí rodič na telefonu. Ty už nic dalšího dělat nemusíš. |
| `diag.rodic_uvod` | rodič během diagnostiky | Dítě teď pracuje samo. Vy nenapovídáte, nekontrolujete a nekoukáte přes rameno. |
| `diag.rodic_odevzdano` | rodič, stav žáka ({z} = z / ze) | Odevzdáno {x} {z} {celkem} |
| `diag.rodic_polovina_1` | rodič, stav žáka | 1. polovina |
| `diag.rodic_polovina_2` | rodič, stav žáka | 2. polovina |
| `diag.rodic_uplynulo` | rodič, uplynulý čas | Uplynulo {min} min |
| `diag.rodic_cas` | rodič, po 35 minutách | Uplynulo přes půl hodiny. Pokud dítě ještě pracuje a nemá toho dost, nechte ho dokončit. Pokud je unavené, domluvte se na pokračování jindy. |
| `diag.rodic_rady_nadpis` | rodič, sbalené rady | Co dělat, když… |
| `diag.rodic_rada_1` | rodič, rady | Dítě se ptá, jestli to má dobře: „To se dozvíme na konci. Teď jdi dál.“ |
| `diag.rodic_rada_2` | rodič, rady | Dítě nerozumí slovu v zadání: slovo můžete vysvětlit, příklad ne. |
| `diag.rodic_rada_3` | rodič, rady | Po polovině aplikace dítěti nabídne přestávku. Nechte ho vybrat. |
| `diag.rodic_zobrazit` | rodič, tlačítko | Zobrazit výsledek |
| `diag.rodic_ukoncit_potvrzeni` | rodič, potvrzení při méně než 24 | Dítě odevzdalo {x} {z} {celkem} úloh. Když teď výsledek zobrazíte, diagnostika se uzavře a zbylé úlohy už dítě neudělá. Pokračovat? |
| `diag.rodic_orientacni` | rodič, potvrzení při méně než 12 | Výsledek bude jen orientační. |
| `diag.rodic_zpet` | rodič, potvrzení | Zpět |
| `diag.rodic_ano` | rodič, potvrzení | Ano, zobrazit |
| `diag.papir_uvod` | rodič, papírový režim během psaní | Až dítě dopíše, přepište sem jeho výsledky. |
| `diag.papir_prepsat` | rodič, papír, tlačítko | Přepsat výsledky |
| `diag.papir_pokyn` | rodič, papír, nad seznamem polí | Přepište přesně to, co dítě napsalo. Nic neopravujte. Prázdnou úlohu nechte prázdnou. |
| `diag.papir_ulozit` | rodič, papír, tlačítko | Uložit výsledky |
| `diag.papir_blok_1` | rodič, papír, nadpis bloku | 1. polovina |
| `diag.papir_blok_2` | rodič, papír, nadpis bloku | 2. polovina |
| `diag.tisk_prestavka` | tisk, předěl v polovině testu | Polovina. Dej si pět minut pauzu. |
| `diag.zadna` | rodič, sezení neexistuje | Diagnostiku zatím nemáte hotovou. |
| `diag.nesestaveno` | rodič, výsledek nejde spočítat | Výsledek se nepodařilo sestavit. Zkuste obnovit stránku. |
| `diag.vysledek_nadpis` | rodič, výsledek | Výsledek vstupní diagnostiky |
| `diag.vysledek_podnadpis` | rodič, výsledek | {jmeno_ditete}, {datum} |
| `diag.jak_nalozit_nadpis` | rodič, výsledek | Jak s výsledkem naložit |
| `diag.jak_nalozit_1` | rodič, výsledek | Výsledek je pro vás, ne pro dítě. Neříkejte mu počty ani „tohle neumíš“. Stačí: „Díky, teď víme, čím začít.“ |
| `diag.jak_nalozit_2` | rodič, výsledek | Diagnostika ukazuje, kde začít, ne co dítě umí napořád. Za pár týdnů to bude jinak. |
| `diag.jak_nalozit_3` | rodič, výsledek | Začněte týdnem 1, i když vyšel jistě. Týdny na sebe navazují. |
| `diag.plan_nadpis` | rodič, výsledek | Plán Fáze 1 po týdnech |
| `diag.kapitoly_nadpis` | rodič, výsledek | Jak si dítě vedlo v kapitolách |
| `diag.chyby_nadpis` | rodič, výsledek | Na co dítě nejčastěji naráží |
| `diag.chyby_trenuje` | rodič, výsledek | Trénuje se v týdnu {tydny}. |
| `diag.chyby_vickrat` | rodič, výsledek | Objevilo se víckrát. |
| `diag.chyby_prazdne_prehlednuti` | rodič, výsledek | Chyby, které se objevily, nepatří k těm typickým. Vypadají spíš jako přehlédnutí. |
| `diag.chyby_prazdne` | rodič, výsledek | V úlohách, které dítě odevzdalo, se žádná typická chyba neobjevila. |
| `diag.stav_jista` | štítek kapitoly | Jisté |
| `diag.stav_nejista` | štítek kapitoly | Nejisté |
| `diag.stav_slaba` | štítek kapitoly | Potřebuje víc času |
| `diag.stav_nezjisteno` | štítek kapitoly | Nevíme |
| `diag.kapitola_jista` | text kapitoly | Úlohy z této kapitoly dítě vyřešilo. |
| `diag.kapitola_nejista` | text kapitoly | Něco vyšlo, něco ještě ne. |
| `diag.kapitola_slaba` | text kapitoly | Tady dítě zatím chybuje. Tomuhle týdnu dejte čas. |
| `diag.kapitola_nezjisteno` | text kapitoly | Na tyto úlohy dítě nedošlo. |
| `diag.kapitola_jedna_uloha` | text kapitoly s 1 úlohou | Jen jedna úloha, berte orientačně. |
| `diag.kapitola_tyden` | kapitola, odkaz na týden | Týden {tyden} |
| `diag.duraz_dukladne` | štítek týdne | Projděte důkladně |
| `diag.duraz_normalne` | štítek týdne | Běžné tempo |
| `diag.duraz_rychleji` | štítek týdne | Může jít rychleji |
| `diag.duraz_nezjisteno` | štítek týdne | Nevíme |
| `diag.duraz_opakovani` | štítek týdne | Opakování |
| `diag.tyden_dukladne` | text týdne | Všechny 4 lekce, jedna denně. Když lekce skončí oranžovou, zopakujte ji další den. |
| `diag.tyden_normalne` | text týdne | Jedna lekce denně podle plánu. |
| `diag.tyden_rychleji` | text týdne | Když lekce vycházejí zeleně, nemusíte čekat na další týden a můžete pokračovat hned. |
| `diag.tyden_nezjisteno` | text týdne | Na tyto úlohy dítě v diagnostice nedošlo. Projděte týden běžným tempem. |
| `diag.tyden_opakovani` | text týdne | Projděte ho vždycky, vrací se v něm látka ze všech týdnů. |
| `diag.tyden_nazev` | řádek plánu | Týden {tyden} · {nazev} |
| `diag.tyden_lekce_duraz` | doplněk týdne | Nejvíc času dejte lekcím {lekce}. |
| `diag.tyden_pilot` | doplněk týdne | Než týden začnete, vraťte se k pilotní lekci {pilot}. Je pořád otevřená. |
| `diag.celkem_pevne` | celková věta | Základy z 6. až 8. třídy jsou pevné. Ve Fázi 1 půjde hlavně o jistotu a pečlivý zápis. |
| `diag.celkem_vetsinou` | celková věta | Základy dítě většinou má. Víc času dejte týdnům, které jsou níže označené „Projděte důkladně“. |
| `diag.celkem_cast` | celková věta | Část základů zatím chybí. Fáze 1 je přesně na to: jděte týden po týdnu a nic nepřeskakujte. |
| `diag.celkem_zacatek` | celková věta | Základy jsou zatím vratké. Na začátku přípravy je to běžné a Fáze 1 s tím počítá. Jděte pomalu a oranžové lekce druhý den zopakujte. |
| `diag.celkem_nezjisteno` | celková věta | Dítě stihlo méně než polovinu úloh, výsledek je jen orientační. Pokud to jde, nechte ho diagnostiku dokončit. |
| `diag.celkem_neuplne` | doplněk celkové věty | Dítě odevzdalo {odevzdano} z {celkem} úloh. Týdny, ke kterým úlohy nestihlo, jsou označené „Nevíme“. |
| `diag.na_prehled` | rodič, výsledek, tlačítko | Na přehled týdnů |
| `diag.zacit_tyden_1` | rodič, výsledek, tlačítko | Začít týden 1 |

## Fáze 2: bloky, nové vstupy, simulace (R38, osnova Fáze 2 §3–4) — `lekce.html`, `rodic.html`, `prehled.html`, `tisk.html`
Skupiny `blok.*` (blok na čas), `f2.*` (vstupy písmena, rýsování, postup; tisk archu), `sim.*` (simulace). Dítě nikdy nevidí body ani počty správných; rodič vidí orientační body jen v souhrnu simulace. Nikde hranice typu „stačí na gymnázium“ (o přijetí rozhoduje pořadí uchazečů).

| klíč | kdy | text |
|---|---|---|
| `blok.stitek` | přehled, štítek karty bloku; podtitul lišty rodiče během bloku | Blok na čas |
| `blok.bezi_nadpis` | rodič během bloku (R46): nadpis karty místo taháku | Blok na čas běží |
| `blok.pravidlo` | rodič během bloku, jediné pravidlo (testovací rodič F2, Top 5 bod 1) | Dítě řeší všechny 4 úlohy samo, vy mlčíte. Smíte říct jen: „Zadej, co máš, a jdi dál.“ |
| `blok.cas` | rodič během bloku, za velkým číslem uplynulých minut od začátku sezení (bez tvrdého stopu) | uplynulo z doporučených {cas} min |
| `blok.cas_doporuceno` | rodič během bloku, sezení bez začátku (jen doporučený čas) | doporučený čas |
| `blok.cas_vyprsel` | rodič během bloku, uplynulo víc než `cas_min` | Doporučený čas uplynul. Řekněte dítěti: „Čas. Dokonči rozdělaný krok.“ Pak klepněte na tlačítko níže. |
| `blok.odevzdano` | rodič během bloku v aplikaci (polling 30 s); úloha = dítě dokončilo její poslední krok | Odevzdáno {x} ze {celkem} |
| `blok.konec_app` | rodič během bloku v aplikaci, pod počtem | Až dítě uvidí „Hotovo, ukaž telefon rodiči“, telefon vás sám přepne na procházení úloh. |
| `blok.konec_papir` | rodič během bloku na papír (přechod jen tlačítkem) | Dítě píše na papír. Až dopíše (nebo po {cas} minutách), klepněte na tlačítko níže. Výsledky z papíru pak opíšete u každé úlohy. |
| `blok.tlacitko` | rodič během bloku, přechod do procházení (kdykoli; po `cas_min` zvýrazněné) | Čas vypršel, projdeme to spolu |
| `blok.potvrzeni_nadpis` | rodič, potvrzení přechodu před uplynutím času | Projít úlohy už teď? |
| `blok.potvrzeni` | rodič, potvrzení přechodu před uplynutím času | Doporučený čas ještě neuplynul. Na telefonu teď uvidíte řešení a dítě už by nemělo nic měnit. |
| `blok.potvrzeni_ano` | rodič, potvrzení, tlačítko | Ano, projdeme to |
| `blok.potvrzeni_zpet` | rodič, potvrzení, tlačítko | Ještě ne |
| `blok.auto` | rodič, dítě odevzdalo všechny 4 úlohy (automatický přechod do procházení) | Dítě odevzdalo všechny 4 úlohy. Projděte je spolu od úlohy 1. |
| `blok.pruh` | rodič, pruh nad kartou úlohy při procházení po bloku | Po bloku: projděte spolu úlohy 1–4 od začátku. U každé: co nesedělo, otázka, „Hotovo? Zeptejte se“, semafor. |
| `blok.podtitul_po` | rodič, podtitul lišty při procházení | Po bloku |
| `blok.postup_1` | rodič po bloku, krok 1 karty úlohy (aplikace) | Dítě úlohu už vyřešilo. Podívejte se, co zadalo. |
| `blok.postup_1_papir` | rodič po bloku, krok 1 karty úlohy (papír) | Dítě úlohu už vyřešilo na papír. Podívejte se, co napsalo. |
| `blok.postup_2` | rodič po bloku, krok 2 karty úlohy | Nesedělo to? Přečtěte otázku. |
| `blok.nezaseklo` | rodič po bloku, tlačítko v kroku 2 (vše sedělo) | Všechno sedělo |
| `blok.zadalo_nadpis` | rodič po bloku, krok 1: odpovědi dítěte po krocích | Dítě zadalo: |
| `blok.zadalo_nic` | rodič po bloku, úloha bez odpovědi dítěte | Na tuhle úlohu dítě v bloku nedošlo. Projděte ji spolu jako běžnou úlohu. |
| `blok.zadalo_sedi` | rodič po bloku, odpověď kroku sedí | sedí |
| `blok.zadalo_nesedi` | rodič po bloku, odpověď kroku nesedí (bez červené) | nesedí |
| `blok.zadalo_pokus` | rodič po bloku, odpověď na 2. pokus | na {n}. pokus |
| `blok.zadalo_rysovani` | rodič po bloku, krok `rysovani` (porovnáte v kroku 4) | rýsuje na papíře, porovnáte v kroku 4 |
| `blok.zadalo_chybi` | rodič po bloku, krok bez odpovědi | nezadalo |
| `blok.zak_konec` | žák, konec bloku (nadpis `zak.konec_nadpis` „Hotovo, ukaž telefon rodiči“) | Blok na čas máš za sebou. Zavolej rodiče, teď spolu projdete všechny 4 úlohy. |
| `f2.rysovani_zak` | žák, krok `rysovani` | Rýsuj na papír. Až to bude hotové, ukaž to rodiči. |
| `f2.rysovani_hotovo` | žák, tlačítko u kroku `rysovani` | Hotovo |
| `f2.rysovani_odevzdano` | žák, po „Hotovo“ v běžné lekci a bloku | Hotovo. Rodič teď porovná tvoje rýsování s obrázkem. |
| `f2.rysovani_nadpis` | rodič, blok u kroku `rysovani` | Rýsování dítěte |
| `f2.rysovani_text` | rodič, pod nadpisem (obrázek řešení + otázky) | Položte obrázek vedle papíru dítěte a projděte otázky. Nic neměřte, stačí pohled. |
| `f2.rysovani_otazky` | rodič, nad `tahak.kontrola_rodice` | Zkontrolujte: |
| `f2.rysovani_ceka` | rodič, dítě ještě neklepnulo Hotovo (režim aplikace) | Dítě ještě rýsuje. Porovnejte, až klepne Hotovo nebo vám papír ukáže. |
| `f2.sedi` | rodič, tlačítko (rýsování, výsledek v Kontrole) | Sedí |
| `f2.nesedi` | rodič, tlačítko | Nesedí |
| `f2.postup_zak` | žák, simulace v aplikaci, krok s povinným postupem | Celý postup napiš na papír do rámečku. Sem zadej jen výsledek. |
| `f2.co_vidi_rysovani` | rodič, „Co vidí dítě“ u kroku `rysovani` | Dítě rýsuje na papír a pak klepne Hotovo. |
| `f2.tisk_postup` | tisk, nadpis velkého rámečku u kroku s `postup` | Celý postup |
| `f2.tisk_vysledek` | tisk, popisek rámečku výsledku pod „Celý postup“ | Výsledek |
| `f2.tisk_rysovani` | tisk, rýsovací pole (měřítko 1 : 1) | Rýsuj sem (měřítko 1 : 1) |
| `f2.tisk_rysovani_stejne_pole` | tisk, další rýsovací krok téže úlohy (9.2) | Rýsuj do stejného pole výše. |
| `f2.tisk_kontrola` | tisk, kontrolní úsečka 5 cm v rýsovacím poli běžné lekce a bloku (R46) | Kontrola tisku: úsečka má měřit 5 cm |
| `f2.tisk_100` | tisk, pokyn u lekce s rýsováním (na obrazovce nad listem i na listu) | Tiskněte ve skutečné velikosti (100 %), ne „Přizpůsobit stránce“. |
| `sim.start_nadpis` | žák, obrazovka před 1. úlohou simulace | Simulace přijímaček |
| `sim.start_text` | žák (i rodič v režimu papír), tempo na startu (osnova §3.1) | Doporučené pořadí: 1–8, pak 11–15, nakonec 9–10 a 16. U úlohy nestůj déle než 5 minut, přeskoč ji a vrať se. |
| `sim.start_text_app` | žák v aplikaci (úlohy jdou popořadě, přeskakovat nejde) | Úlohy jdou popořadě. U úlohy nestůj déle než 5 minut: zadej, co máš, a jdi dál. Každou úlohu odevzdáváš jen jednou. |
| `sim.start_tlacitko` | žák, tlačítko na startu | Začít test |
| `sim.start_2_nadpis` | žák, start 2. části | 2. část simulace |
| `sim.start_2_text` | žák, start 2. části, jeden odpočet | Pokračuješ úlohami 9–16. Čas běží dál od začátku 1. části. |
| `sim.start_2_rozdeleno` | žák, start 2. části druhý den (pauza > 30 min) | Dnes děláš 2. část. Máš na ni 35 minut. |
| `sim.tempo_40` | žák ve 40. minutě (jemná připomínka) | Jsi-li ještě v 1. části, přejdi na úlohy 11–15, jsou to rychlé body. |
| `sim.tempo_70` | žák po vypršení času (tvrdý stop není) | Čas testu vypršel. U zkoušky byste teď odevzdávali. Udělej na archu čáru, co je pod ní, se nepočítá. |
| `sim.prubeh` | žák, lišta | Úloha {pozice} · {cast}. část |
| `sim.ulozeno` | žák, po odevzdání kroku (neutrálně, bez ✔/✘) | Uloženo. |
| `sim.konec_1_nadpis` | žák, konec 1. části | 1. část máš za sebou. |
| `sim.konec_1_text` | žák, konec 1. části | Pokračuj úlohami 9–16. Čas běží dál. |
| `sim.dalsi_cast` | žák, tlačítko na 2. část | Pokračovat 2. částí |
| `sim.konec_nadpis` | žák, konec testu | Test máš za sebou. |
| `sim.konec_sedi` | žák, nad zelenými čísly úloh (bez počtu a procent) | Tyhle úlohy sedí: |
| `sim.konec_zadna` | žák, když zatím nesedí žádná úloha | Díky za celý test. Rodič s tebou projde, co šlo. |
| `sim.konec_ceka` | žák v aplikaci, rodič ještě nezkontroloval postup a rýsování | Úlohy s postupem a rýsováním ještě zkontroluje rodič. |
| `sim.konec_zitra` | žák, konec testu | Zítra spolu projdeme 4 úlohy. |
| `sim.papir_nadpis` | žák, simulace na papír | Test píšeš na papír |
| `sim.papir_text` | žák, simulace na papír (před kontrolou rodiče) | Máš vytištěný testový sešit a záznamový arch. Až odevzdáš, rodič arch zkontroluje a tady uvidíš, které úlohy sedí. |
| `sim.papir_obnovit` | žák, papír, tlačítko | Zkontrolovat znovu |
| `sim.rodic_bezi_nadpis` | rodič během testu | Simulace běží |
| `sim.rodic_bezi_text` | rodič během testu, pod nadpisem | Tahák, klíč ani řešení teď nevidíte, aby se k nim nedostalo ani dítě. |
| `sim.rodic_pravidla_nadpis` | rodič během testu | Tři pravidla |
| `sim.rodic_pravidlo_1` | rodič během testu | Nenapovídejte. |
| `sim.rodic_pravidlo_2` | rodič během testu | Nekomentujte. Smíte říct jedinou větu: „Přeskoč ji a vrať se na konci.“ |
| `sim.rodic_pravidlo_3` | rodič během testu | Přestávka jen na WC, čas běží dál. |
| `sim.rodic_start` | rodič, papír, před startem | Před startem přečtěte dítěti: |
| `sim.rodic_precist` | rodič, papír, ve 40. a 70. minutě | Přečtěte dítěti: |
| `sim.rodic_vidi` | rodič, aplikace, ve 40. a 70. minutě | Dítě teď vidí na obrazovce: |
| `sim.rodic_odevzdano` | rodič během testu v aplikaci | Dítě odevzdalo {x} z {celkem} úloh. |
| `sim.rodic_rozdeleno` | rodič, 2. část začala víc než 30 minut po 1. části | Simulace je rozdělená na dva dny. 2. část má vlastní odpočet 35 minut. |
| `sim.rodic_odevzdalo` | rodič, tlačítko po testu | Dítě odevzdalo |
| `sim.rodic_potvrzeni` | rodič, potvrzení „Dítě odevzdalo“ | Má dítě test odevzdaný? Potom uvidíte klíč a řešení a dítě už by nemělo nic dopisovat. |
| `sim.rodic_potvrzeni_ano` | rodič, potvrzení | Ano, odevzdalo |
| `sim.rodic_zpet` | rodič, potvrzení | Ještě ne |
| `sim.kontrola_nadpis` | rodič, Kontrola po testu | Kontrola |
| `sim.kontrola_uvod_papir` | rodič, Kontrola, papír | Jděte po číslech v záznamovém archu. Nic nepočítáte: porovnáte a klepnete. Trvá to asi 15 minut. |
| `sim.kontrola_uvod_app` | rodič, Kontrola, aplikace | Výsledky už aplikace vyhodnotila. Zkontrolujte jen postup a rýsování. |
| `sim.kontrola_cast` | rodič, Kontrola, nadpis části | {cast}. část (úlohy {od}–{do}) |
| `sim.kontrola_uloha` | rodič, Kontrola, číslo úlohy v archu | Úloha {pozice} |
| `sim.kontrola_spravne` | rodič, Kontrola, správný výsledek | Správně: |
| `sim.kontrola_uznava` | rodič, Kontrola, další uznávaný zápis | Uznává se i: |
| `sim.uznava_nezkraceny` | „uznává se i“ u zlomku | nezkrácený zlomek se stejnou hodnotou |
| `sim.uznava_desetinne` | „uznává se i“ u zlomku s konečným desetinným zápisem | desetinné číslo |
| `sim.uznava_zlomek` | „uznává se i“ u desetinného čísla | zlomek |
| `sim.uznava_nepravy` | „uznává se i“ u smíšeného čísla | nepravý zlomek |
| `sim.uznava_poradi_clenu` | „uznává se i“ u výrazu | jiné pořadí členů se stejnou hodnotou |
| `sim.kontrola_porovnejte` | rodič, Kontrola, výsledek | Sedí to s archem? |
| `sim.kontrola_pismena` | rodič, Kontrola, uzavřená úloha | Co dítě zakřížkovalo? |
| `sim.kontrola_nic` | rodič, Kontrola, uzavřená úloha bez křížku | Nic |
| `sim.kontrola_dva` | rodič, Kontrola, dva křížky (neplatné) | Dva křížky |
| `sim.kontrola_postup` | rodič, Kontrola, krok s povinným postupem | Je v rámečku postup, víc než jen výsledek? |
| `sim.kontrola_postup_pozn` | rodič, Kontrola, pod otázkou na postup | Bez postupu je úloha za 0 bodů, i když výsledek sedí. |
| `sim.ano` | rodič, tlačítko | Ano |
| `sim.ne` | rodič, tlačítko | Ne |
| `sim.kontrola_typicka_chyba` | rodič, Kontrola, sbalené | Typická chyba |
| `sim.kontrola_zbyva` | rodič, Kontrola, nad tlačítkem souhrnu | Zbývá zkontrolovat: {n}. Co nezkontrolujete, počítá se za 0 bodů. |
| `sim.kontrola_hotovo` | rodič, Kontrola, vše zkontrolováno | Všechno je zkontrolované. |
| `sim.kontrola_prazdna` | rodič, Kontrola, aplikace, v části není co kontrolovat | V této části není co kontrolovat, aplikace ji vyhodnotila sama. |
| `sim.kontrola_souhrn` | rodič, tlačítko po Kontrole | Zobrazit souhrn |
| `sim.kontrola_ulozeno` | rodič, Kontrola, po klepnutí | Uloženo |
| `sim.souhrn_nadpis` | rodič, souhrn simulace | Souhrn simulace {cislo} |
| `sim.souhrn_body` | rodič, souhrn (osnova §3.4) | Orientačně {body} z {max} (1. část {b1} z {m1}, 2. část {b2} z {m2}). Jen pro vás. |
| `sim.souhrn_dite` | rodič, souhrn | Dítěti řekněte, co šlo a co zítra zkusíte. |
| `sim.souhrn_orientacni` | rodič, souhrn, vždy (R38, SABLONA §20.8) | Bodování je orientační, u zkoušky se může lišit. |
| `sim.souhrn_rozdeleno` | rodič, souhrn rozdělené simulace | Simulace byla rozdělená na dva dny (2. část měla vlastní odpočet 35 minut). |
| `sim.souhrn_casti_nadpis` | rodič, souhrn | Podle částí testu |
| `sim.skupina_cisla` | rozpad | Čísla a zlomky (úlohy 1–2) |
| `sim.skupina_algebra` | rozpad | Výrazy a rovnice (úlohy 3–4) |
| `sim.skupina_slovni` | rozpad | Slovní úlohy a geometrie (úlohy 5–8) |
| `sim.skupina_konstrukce` | rozpad | Konstrukce (úlohy 9–10) |
| `sim.skupina_uzavrene` | rozpad | Uzavřené úlohy (11–15) |
| `sim.skupina_uloha16` | rozpad | Úloha 16 |
| `sim.skupina_body` | rozpad, u části testu | {body} z {max} |
| `sim.souhrn_chyby_nadpis` | rodič, souhrn | Na co dítě nejčastěji naráží |
| `sim.souhrn_chyby_pozice` | rodič, souhrn, pod chybou (víc úloh) | V úlohách {pozice}. |
| `sim.souhrn_chyby_pozice_1` | rodič, souhrn, pod chybou (jedna úloha) | V úloze {pozice}. |
| `sim.souhrn_chyby_prazdne` | rodič, souhrn bez typických chyb | Žádná typická chyba se neobjevila. |
| `sim.souhrn_doporuceni_nadpis` | rodič, souhrn | Před zkouškou projděte znovu |
| `sim.souhrn_doporuceni_uloha` | rodič, souhrn, doporučení u úlohy | Úloha {pozice}: {lekce} |
| `sim.souhrn_doporuceni_prazdne` | rodič, souhrn, vše sedí | Všechny úlohy sedí. Před zkouškou stačí rozbor a poslední rozcvička. |
| `sim.souhrn_sedi` | rodič, souhrn: co uvidí dítě | Dítě uvidí zeleně úlohy: {pozice} |
| `sim.souhrn_nic_nesedi` | rodič, souhrn: dítě nevidí žádnou zelenou | Dítě uvidí poděkování za celý test, žádná úloha zatím nesedí naplno. |
| `sim.lekce_bez_tematu` | doporučení, lekce bez tématu v katalogu (odvozeno z id) | {faze}. fáze, {tyden}. týden, {poradi}. lekce |
| `sim.na_prehled` | rodič, souhrn, tlačítko | Na přehled |
| `sim.upravit_kontrolu` | rodič, souhrn, tlačítko zpět ke Kontrole | Upravit kontrolu |
| `sim.stitek` | přehled, štítek karty | Simulace · {cast}. část |
| `sim.karta_popis_1` | přehled, karta 1. části | Úlohy 1–8. Pokračuje 2. částí, jeden odpočet 70 minut. |
| `sim.karta_popis_2` | přehled, karta 2. části | Úlohy 9–16. Navazuje na 1. část. |
| `sim.karta_uloh` | přehled, meta | 8 úloh |
| `sim.karta_zacit` | přehled, tlačítko (rodič) | Začít simulaci |
| `sim.karta_souhrn` | přehled, hotová simulace (rodič) | Souhrn simulace |
| `sim.modal_text` | přehled, modal volby režimu u simulace (rodič) | Doporučujeme papír: vytisknete testový sešit i záznamový arch najednou, jako u zkoušky. |
| `sim.tisk_sesit` | tisk, nadpis testového sešitu | Testový sešit |
| `sim.tisk_prepiste` | tisk, pokyn v sešitu | V úlohách, kde se nežádá celý postup, přepište do záznamového archu pouze výsledky. |
| `sim.tisk_arch` | tisk, nadpis záznamového archu | Záznamový arch |
| `sim.tisk_krizky` | tisk, pokyn dole na archu | Křížek z rohu do rohu. Oprava: pole zabarvi a udělej nový křížek. Piš propiskou, rýsuj tužkou a obtáhni. |
| `sim.tisk_vzorce` | tisk, poslední strana sešitu | Vzorce a tabulka |
| `sim.tisk_mocniny` | tisk, tabulka mocnin | Druhé mocniny čísel 11–20 |
| `sim.tisk_meritko` | tisk, kontrolní úsečka na archu | Kontrola tisku: tahle čára má mít přesně 5 cm. Když nemá, tiskněte znovu se 100% měřítkem. |
| `sim.tisk_zacatek` | tisk, hlavička archu | Začátek |
| `sim.tisk_konec` | tisk, hlavička archu | Konec |

## Čeština: základy — nové vstupy (`lekce.html`, `rodic.html`; cestina/Obsah/FORMAT-CJ.md)
Skupina `cj`. Žákovi tykáme bez rodu, rodiči vykáme.

| klíč | kdy | text |
|---|---|---|
| `cj.neplatne_klik` | `klik_ve_textu`: nic nevybráno (nepočítá se jako pokus) | Klikni na slovo ve větě, pak odevzdej. |
| `cj.neplatne_klik_mezery` | `klik_ve_textu` s místy mezi slovy: nic nevybráno | Klikni na místo mezi slovy, pak odevzdej. |
| `cj.neplatne_vice` | `dlazdice_vice`: nic nevybráno | Vyber aspoň jednu možnost. |
| `cj.neplatne_doplnit` | `doplnit_pismeno`: některá mezera je prázdná | Doplň písmeno do každé mezery. |
| `cj.neplatne_role` | `oznac_role`: některé slovo nemá roli | U každého podtrženého slova vyber, co to je. |
| `cj.neplatne_seradit` | `seradit`: neúplné pořadí | Seřaď všechny položky, pak odevzdej. |
| `cj.neplatne_kratky_text` | `kratky_text`: prázdné pole | Napiš svou odpověď. |
| `cj.neplatne_diktat` | `diktat`: nic nenapsáno | Napiš, co slyšíš, pak odevzdej. |
| `cj.max_vyber` | `klik_ve_textu`: dítě chce vybrat víc, než smí | Můžeš vybrat nejvýš {n}. Nejdřív nějaké zruš. |
| `cj.prehrat` | tlačítko u poslechu | Přehrát nahrávku |
| `cj.prehrat_vetu` | tlačítko u diktátu | Přehrát větu {n} |
| `cj.prehrano` | počítadlo u diktátu | přehráno {n} z {max} |
| `cj.audio_chyba` | nahrávka se nenačetla (dítě) | Nahrávka se nenačetla. Řekni to rodiči. |
| `cj.dalsi_veta` | diktát: tlačítko | Další věta |
| `cj.veta_z` | diktát: stav | Věta {n} z {pocet} |
| `cj.posledni_veta` | diktát: po poslední větě | To byla poslední věta. Až bude všechno napsané, odevzdej. |
| `cj.role_hotovo` | `oznac_role` s více kategoriemi: zavřít nabídku | Hotovo |
| `cj.role_vyber` | `oznac_role`: nápověda nad nabídkou | Vyber, co je slovo „{slovo}“: |
| `cj.zmenit_pismeno` | `doplnit_pismeno`: čtečka u doplněného písmene | Změnit písmeno {p} |
| `cj.misto_za` | `klik_ve_textu` mezery: čtečka | místo za {n}. slovem |
| `cj.co_vidi_poslech` | rodič, „Co vidí dítě“ u poslechu | Dítě slyší nahrávku, text nevidí. |
| `cj.prepis_nadpis` | rodič: sbalený přepis nahrávky | Co zazní v nahrávce (nečtěte nahlas) |
| `cj.diktat_text_nadpis` | rodič: sbalený text diktátu | Text diktátu (nečtěte nahlas) |
| `cj.cist_sam` | rodič: záložní tlačítko diktátu | Číst sám |
| `cj.cist_sam_pozn` | rodič: když nahrávka nejde přehrát | Nahrávka nejde přehrát. Výjimečně přečtěte věty sami: pomalu, každou dvakrát, bez čárek a teček. |
| `cj.odpoved_nadpis` | rodič: co dítě odevzdalo u nového vstupu | Dítě odevzdalo: |
| `cj.chybi` | rodič: co v odpovědi chybí | chybí: {slova} |
| `cj.navic` | rodič: co je v odpovědi navíc | navíc: {slova} |
| `cj.nesedi_u` | rodič: u kterých slov/mezer nesedí | nesedí u: {slova} |
| `cj.papir_nadpis` | rodič, papír: nový vstup češtiny | Porovnejte papír dítěte |
| `cj.papir_spravne` | rodič, papír: správná odpověď | Správně je: {odpoved} |
| `cj.papir_sedi` | rodič, papír: tlačítko | Sedí |
| `cj.papir_nesedi` | rodič, papír: tlačítko | Nesedí |
| `cj.slovnicek_nadpis` | rodič: rozbalovací slovníček pojmů v úvodu lekce | Co ta slova znamenají |
| `cj.otazka_1` | rodič: štítek otázky 1 (čeština) | vlastními slovy |
| `cj.otazka_2` | rodič: štítek otázky 2 (čeština) | test na slově |
| `cj.otazka_3` | rodič: štítek otázky 3 (čeština) | nápověda |
| `cj.neplatne_klik_min` | `klik_ve_textu`: vybráno méně než `min` (nepočítá se jako pokus) | Tady je potřeba vybrat aspoň {n}. Pak odevzdej. |
| `cj.neplatne_diktat_dalsi` | `diktat`: dítě chce odevzdat, ale ještě neprošlo všechny věty | Ještě tě čekají další věty. Klepni na „Další věta“. |
| `cj.zastavit` | poslech a diktát: tlačítko, když nahrávka hraje | Zastavit |
| `cj.seradit_napoveda` | `seradit`: pod položkami | Klikej na položky v pořadí, jak jdou za sebou. Dalším klikem číslo zrušíš. |
| `cj.uloha_hotova` | po posledním kroku úlohy, když lekce nemá 4 úlohy (čeština Spolu 8: 5 → „z 5“; {z} = z / ze) | Úloha {n} {z} {celkem} je hotová. Pokračuj další. |
| `cj.co_vidi_diktat` | rodič, „Co vidí dítě“ u diktátu | Dítě pouští nahrávku po větách a píše, co slyší. Text nevidí. |
| `cj.cist_sam_odkaz` | rodič: sbalené záložní čtení pod textem diktátu | Jen když nahrávka dítěti nejde |
| `cj.papir_prehrat` | rodič, papír: přehrávač u poslechu a diktátu | Dítě píše na papír: nahrávku mu pusťte z tohoto telefonu. |
| `cj.papir_veta` | rodič, papír: přehrávač jedné věty diktátu | Věta {n} |
| `cj.nabidka` | rodič, „Co vidí dítě“: nabídka u `oznac_role` | Dítě u každého podtrženého slova vybírá z nabídky: |
| `cj.vybralo` | rodič, odpověď dítěte: co vybralo | Vybralo: |
| `cj.doplnilo` | rodič, odpověď dítěte u `doplnit_pismeno` | Doplnilo: |
| `cj.napsalo` | rodič, odpověď dítěte u `kratky_text` | Napsalo: |
| `cj.seradilo` | rodič, odpověď dítěte u `seradit` | Seřadilo: |
| `cj.nic` | rodič: dítě nic nevybralo | nic |
| `cj.kategorie_rod` | `oznac_role` s kategoriemi: název skupiny nad tlačítky (klíč v datech je bez diakritiky) | Rod |
| `cj.kategorie_cislo` | `oznac_role` s kategoriemi: název skupiny nad tlačítky (klíč v datech je bez diakritiky) | Číslo |
| `cj.kategorie_pad` | `oznac_role` s kategoriemi: název skupiny nad tlačítky (klíč v datech je bez diakritiky) | Pád |
| `cj.kategorie_osoba` | `oznac_role` s kategoriemi: název skupiny nad tlačítky (klíč v datech je bez diakritiky) | Osoba |
| `cj.kategorie_cas` | `oznac_role` s kategoriemi: název skupiny nad tlačítky (klíč v datech je bez diakritiky) | Čas |
| `cj.kategorie_zpusob` | `oznac_role` s kategoriemi: název skupiny nad tlačítky (klíč v datech je bez diakritiky) | Způsob |
| `cj.dite_dalo` | rodič, `oznac_role`: co dítě u slova vybralo | dítě: {hodnota} |
| `cj.mezera_za` | rodič: místo mezi slovy (`klik_ve_textu` s místy) | za slovem „{slovo}“ |
| `cj.slovo_cislo` | rodič: slovo, které je ve větě víckrát | {n}. slovo |
| `cj.znama_chyba` | rodič: popis známé chyby u odpovědi dítěte | Známá chyba: |
| `cj.zeptejte_se` | rodič: otázka ze slovníku chyb u odpovědi dítěte | Zeptejte se: |
| `cj.volitelne` | rodič, papír: slovo, které smí i nemusí být vybrané | {slova}: může, ale nemusí být vybrané. |
| `cj.uzna_se_i` | rodič, papír: další uznané tvary u `kratky_text` | Uzná se i: {varianty} |
| `cj.diktat_veta` | rodič: porovnání diktátu, řádek | Věta |
| `cj.diktat_napsalo` | rodič: porovnání diktátu, řádek | Dítě napsalo |
| `cj.diktat_ma_byt` | rodič: porovnání diktátu, řádek | Má být |
| `cj.diktat_bez_chyby` | rodič: diktát bez chyby | Diktát je bez chyby. |

## Čeština: přepínač předmětu a předměty dítěte (`prehled.html`; ZADANI-CESTINA §8.2)
| klíč | kdy | text |
|---|---|---|
| `predmet.prepinac` | přehled: popisek záložek předmětu (čtečka obrazovky) | Předmět |
| `predmet.matematika` | přehled: záložka, formulář předmětů | Matematika |
| `predmet.cestina` | přehled: záložka, formulář předmětů | Čeština |
| `predmet.prazdny` | přehled: vybraný předmět zatím nemá žádnou lekci | Lekce tohoto předmětu tu budou brzy. |
| `dite.predmety_legenda` | formulář dítěte: skupina zaškrtávátek (jen po migraci 0006) | Co bude dítě procvičovat? |
| `dite.predmety_chyba` | formulář dítěte: nic nezaškrtnuto | Vyberte aspoň jeden předmět. |
| `dite.predmety_tlacitko` | přehled rodiče, vedle jména dítěte (jen po migraci 0006) | Předměty |
| `dite.predmety_nadpis` | nadpis formuláře předmětů | Předměty: {jmeno} |
| `dite.predmety_text` | pod nadpisem formuláře předmětů | Když vyberete oba předměty, přehled ukáže u dítěte {jmeno} dvě záložky: Matematika a Čeština. |
| `dite.predmety_ulozit` | tlačítko formuláře předmětů | Uložit předměty |
| `dite.predmety_ulozeno` | po uložení předmětů | Předměty jsou uložené. |

## Lekce bez rodiče „Dnes samo" (R64, Pavel 30. 9.) — `prehled.html`, `lekce.html`, `rodic.html`

| klíč | kde | text |
|---|---|---|
| `samo.volba_nazev` | modal režimu, třetí volba | Dnes samo |
| `samo.volba_popis_rodic` | modal režimu (rodič) | Nemáte dnes čas? Dítě pracuje v aplikaci samo, aplikace se ho ptá místo vás. |
| `samo.volba_popis_zak` | modal režimu (žák) | Rodič dnes nemá čas. Pracuješ v aplikaci sám nebo sama, aplikace ti poradí. |
| `samo.potvrzeni_zak` | modal režimu (žák), zaškrtnutí před „Dnes samo" | Rodič ví, že dnes pracuji sám nebo sama. |
| `samo.nelze` | lekce, když se samo nedá (rýsování) | Tuhle lekci je potřeba dělat s rodičem, protože rodič kontroluje rýsování. Dnes ji zkuste spolu. |
| `samo.uvod` | lekce žáka, nad první úlohou | Dnes pracuješ sám nebo sama. Když nevíš, jak dál, klikni na „Nevím, jak dál“. |
| `samo.napoveda_tlacitko` | lekce žáka, pod kroky úlohy | Nevím, jak dál |
| `samo.napoveda_nadpis` | lekce žáka, karta nápovědy | Nápověda {n} ze 3 |
| `samo.napovedy_dosly` | lekce žáka, po 3. nápovědě | Víc nápověd není. Zkus to, jak nejlíp umíš. |
| `samo.chyba_tip` | lekce žáka, po známé chybě | Častá chyba: {popis} |
| `samo.konec` | lekce žáka, konec | Lekce je uložená. Rodič na telefonu uvidí, jak ti to šlo. |
| `samo.rodic_bezi` | rodič, lekce probíhá bez něj | Dítě dnes pracuje samo. Ať otevře lekci na počítači nebo tabletu. Až skončí, uvidíte na přehledu, jak to šlo. |
| `samo.stitek` | přehled, karta dokončené lekce | Bez rodiče |
| `samo.pripominka` | přehled rodiče, po 2 lekcích samo za sebou | Poslední dvě lekce proběhly bez vás. Příští zkuste spolu, stačí 20 minut. |
| `samo.souhrn` | souhrn lekce u rodiče | Lekce proběhla bez vás. Semafor vyhodnotila aplikace podle toho, jak dítě úlohy řešilo. |

## Spolu 8 — přehled, úvodní test, doporučené pořadí (`prehled.html`, `rodic.html`, `lekce.html`; TECHNIKA-OSMA.md)

| klíč | kde | text |
|---|---|---|
| `osma.rytmus` | přehled, pod jménem dítěte | Aspoň 4× týdně jedna lekce. V každém předmětu nejvýš jedna denně. |
| `osma.postup` | přehled, pruh postupu předmětu ({z} = z / ze) | hotovo {hotovo} {z} {celkem} lekcí |
| `osma.max_lekce_den` | přehled, po dnešní dokončené lekci předmětu | Dnešní lekce z předmětu {predmet} je hotová. Další doporučujeme až zítra. |
| `osma.zamceno` | přehled, štítek zamčené lekce | Zamčeno |
| `osma.zamceno_uzavreno` | přehled, účet uzavřený | Účet je uzavřený. |
| `osma.tema_nadpis` | přehled, nadpis sekce tématu a karta „Doporučeno teď“ | Téma {tema} · {nazev} |
| `osma.tema_slabe` | přehled, štítek tématu po úvodním testu | Procvičit |
| `osma.tema_nejiste` | přehled, štítek tématu po úvodním testu | Zopakovat |
| `osma.tema_silne` | přehled, štítek tématu po úvodním testu | Jde to |
| `osma.lekce_poradi` | přehled, karta lekce | Lekce {n} |
| `osma.lekce_kontrola` | přehled, karta 4. lekce tématu | Lekce {n} · kontrola tématu |
| `osma.pocet_uloh_2` | přehled, karta lekce (2–4 úlohy) | {n} úlohy |
| `osma.pocet_uloh_5` | přehled, karta lekce (5 a víc úloh) | {n} úloh |
| `osma.doporuceno_nadpis` | přehled, nadpis | Doporučeno teď |
| `osma.doporuceno_podle_testu` | přehled, pod nadpisem (test hotový) | Podle úvodního testu: nejdřív témata, která zatím nejdou. Ta, která jdou, jsou na konci. |
| `osma.doporuceno_bez_testu` | přehled, pod nadpisem (test není hotový) | Zatím od základů ke složitějšímu. Po úvodním testu pořadí upravíme podle toho, co dítěti nejde. |
| `osma.doporuceno_osnova` | přehled, pod nadpisem (předmět bez testu) | Od základů ke složitějšímu. |
| `osma.volitelne` | přehled, karta L1–L3 silného tématu | Volitelné |
| `osma.tema_silne_pozn` | přehled, pod nadpisem silného tématu | Téma jde. Stačí kontrola tématu (lekce 4). Když nedopadne zeleně, doporučíme lekce 1–3. |
| `osma.znovu_kontrola` | přehled, „Doporučeno teď“: L4 silného tématu po pojistce | Lekce 1–3 jsou hotové. Teď ještě jednou kontrola tématu. |
| `osma.vse_hotovo` | přehled, všechny lekce předmětu hotové | Všechny lekce jsou hotové. Výborně! Kterékoli téma můžete projít znovu. |
| `osma.nic_otevreno` | přehled, žádná otevřená nehotová lekce | Další lekce se teprve otevřou. |
| `osma.test_stitek` | přehled, karta úvodního testu | Úvodní test |
| `osma.test_nazev` | přehled, karta úvodního testu | Úvodní test ({min} min) |
| `osma.test_text_rodic` | přehled rodiče, karta testu | Dítě vyřeší asi 20 úloh samo, bez taháku a bez nápověd. Ukáže, která témata mu jdou a kde začít. |
| `osma.test_text_zak` | přehled žáka, karta testu | Asi 20 krátkých úloh. Řeš je sám nebo sama, jak nejlíp umíš. Nikdo to nehodnotí. |
| `osma.test_hotovo_rodic` | přehled rodiče, test hotový | Podle výsledku jsou lekce seřazené: nejdřív to, co zatím nejde. |
| `osma.test_hotovo_zak` | přehled žáka, test hotový | Hotovo. Lekce jsou seřazené tak, jak ti to pomůže nejvíc. |
| `osma.test_vysledek` | přehled rodiče, odkaz | Výsledek úvodního testu |
| `osma.test_zacit_rodic` | přehled rodiče, tlačítko | Spustit úvodní test |
| `osma.test_zacit_zak` | přehled žáka, tlačítko | Začít test |
| `osma.vysledek_nadpis` | rodič, výsledek úvodního testu | Výsledek úvodního testu |
| `osma.vysledek_celkem` | rodič, výsledek: pod nadpisem | Odevzdáno {odevzdano} {z} {celkem} úloh. |
| `osma.vysledek_jde` | rodič, výsledek: nadpis | Co jde |
| `osma.vysledek_nejde` | rodič, výsledek: nadpis | Co zatím nejde |
| `osma.vysledek_nejiste` | rodič, výsledek: nadpis | Napůl |
| `osma.vysledek_nic` | rodič, výsledek: prázdná skupina | Žádné téma. |
| `osma.vysledek_zacit` | rodič, výsledek: nadpis | Kde začít |
| `osma.vysledek_zacit_text` | rodič, výsledek: text | Začněte: {tema}. Na přehledu je nahoře pod „Doporučeno teď“. |
| `osma.vysledek_zacit_vse` | rodič, výsledek: všechna témata jdou | Všechna témata jdou. Lekce jděte od začátku, poslouží jako opakování. |
| `osma.vysledek_chyby` | rodič, výsledek: nadpis | Na co se dívat |
| `osma.vysledek_tlacitko` | rodič, výsledek: tlačítko | Na přehled lekcí |
| `osma.vysledek_nezjisteno` | rodič, výsledek: odevzdáno méně než polovina | Dítě odevzdalo méně než polovinu úloh, výsledek je jen orientační. |
| `osma.test_konec_zak` | žák, konec úvodního testu | Hotovo. Díky! Podle testu jsme ti seřadili lekce. Najdeš je na přehledu. |
| `samo.kontrolni_ceka` | lekce žáka „Dnes samo“, kontrolní úloha před prvním odevzdáním | Tuhle úlohu zkus nejdřív bez nápovědy. Když napoprvé nevyjde, nápovědy se odemknou. |

## Názvy témat (Spolu 8)
Název tématu na přehledu: „Téma 3 · Zlomky I“. Klíče `tema_mat.t1` … `tema_mat.t10` (matematika) a `tema_cj.t1` … `tema_cj.t10` (čeština) doplní metodici z osnov (`obsah/OSNOVA-MATEMATIKA.md`, `cestina/Obsah/OSNOVA.md`), pak `node nastroje/generuj-hlasky.mjs`. Dokud řádek chybí, aplikace název složí z kapitol lekcí tématu (`web/js/temata.js`).

| klíč | kde | text |
|---|---|---|
| `tema_mat.t1` | přehled, matematika, téma 1 | Přirozená čísla a dělitelnost |
| `tema_mat.t2` | přehled, matematika, téma 2 | Desetinná čísla |
| `tema_mat.t3` | přehled, matematika, téma 3 | Jednotky, obvod a obsah |
| `tema_mat.t4` | přehled, matematika, téma 4 | Zlomky I |
| `tema_mat.t5` | přehled, matematika, téma 5 | Zlomky II |
| `tema_mat.t6` | přehled, matematika, téma 6 | Celá a racionální čísla |
| `tema_mat.t7` | přehled, matematika, téma 7 | Úhly, trojúhelníky, souměrnost |
| `tema_mat.t8` | přehled, matematika, téma 8 | Poměr, měřítko, úměrnost |
| `tema_mat.t9` | přehled, matematika, téma 9 | Procenta a úrok |
| `tema_mat.t10` | přehled, matematika, téma 10 | Tělesa a slovní úlohy |
| `tema_cj.t1` | přehled, čeština, téma 1 | Slovní druhy |
| `tema_cj.t2` | přehled, čeština, téma 2 | Podstatná jména: vzory a koncovky |
| `tema_cj.t3` | přehled, čeština, téma 3 | Přídavná jména |
| `tema_cj.t4` | přehled, čeština, téma 4 | Zájmena a číslovky |
| `tema_cj.t5` | přehled, čeština, téma 5 | Slovesa: způsob, vid, rod |
| `tema_cj.t6` | přehled, čeština, téma 6 | Vyjmenovaná slova |
| `tema_cj.t7` | přehled, čeština, téma 7 | Shoda přísudku s podmětem |
| `tema_cj.t8` | přehled, čeština, téma 8 | Větné členy |
| `tema_cj.t9` | přehled, čeština, téma 9 | Souvětí a čárka |
| `tema_cj.t10` | přehled, čeština, téma 10 | Stavba slova a pravopis na švu |
