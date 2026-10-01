# 06 — Postup vývoje a kontrolní body

## Tým (viz agenti/)
| role | soubor | model | kdy |
|---|---|---|---|
| Vedoucí projektu / architekt | agenti/00-orchestrator.md | Opus (ty) | pořád |
| Designér | agenti/01-designer.md | Opus | den 1 |
| Backend (Supabase) | agenti/02-backend.md | Opus | den 1–2 |
| Metodik | agenti/03-metodik.md | Opus | den 1 |
| Autor úloh | agenti/04-autor-uloh.md | Opus | den 2–4 |
| Recenzent obsahu | agenti/05-recenzent.md | Opus | den 3–4 |
| Frontend žák | agenti/06-frontend-zak.md | Opus | den 2–4 |
| Frontend rodič | agenti/07-frontend-rodic.md | Sonnet (s podrobným zadáním; review Opus) | den 2–4 |
| Admin | agenti/08-admin.md | Sonnet | den 3–4 |
| Tisk / PDF | agenti/09-tisk.md | Sonnet | den 3 |
| QA tester | agenti/10-qa-tester.md | Sonnet | den 5 |
| Testovací rodič | agenti/11-testovaci-rodic.md | Opus | den 4–5 |
| Autor diagnostiky | agenti/12-autor-diagnostiky.md | Opus | říjen |

Sonnet dostává práci jen tam, kde je zadání jednoznačné (šablona hotová, komponenty hotové, data známá). Opus vždy dělá review. Když Sonnet 2× nevyhoví, převezme Opus.

## Sprint 0 — kostra (24.–25. 9.) — hotovo tímto dokumentem
Pavel založí nový Supabase projekt a git repo z `Desktop\MVP`; dá Opusovi přístup (Supabase MCP nebo URL + service key v `.env`, ne v repu).

## Den 1 (26. 9.) — základy paralelně
- Designér: `web/css/design-system.css` + `web/komponenty.html` (ukázková stránka všech komponent). → **Kontrolní bod A**: report + PRO-PAVLA (odkaz na komponenty ke schválení). Pavel může ladit v Claude Design; do té doby se staví s tímto.
- Backend: migrace, RLS, views, seed skript, trigger po registraci, `admini`.
- Metodik: `obsah/SABLONA.md` (rozšíření 03) + `obsah/lekce/P1.json` jako vzorová lekce kompletní včetně taháku — vzor pro autora úloh.

## Den 2–4 (27.–29. 9.) — stavba paralelně
- Frontend žák, frontend rodič, admin, tisk — každý svoji stránku nad společným `web/js/supabase.js`, `web/js/obsah.js` (načtení lekce), `web/js/vyhodnoceni.js` (společná vyhodnocovací logika, píše frontend žák, používají všichni).
- Autor úloh: P2, P3, P4 podle vzoru P1 → recenzent → `kontrola.jistota`.
- → **Kontrolní bod B** (29. 9.): 4 lekce v seedu, lekce projitelná v app i papír režimu, admin ukazuje data. Report + PRO-PAVLA jen s nízkou jistotou obsahu.

## Den 5 (30. 9.) — kvalita
- QA tester: scénáře `testy/scenare.md` + automatické testy vyhodnocení (`testy/vyhodnoceni.test.js`, node, bez frameworku nebo s `node:test`).
- Testovací rodič: průchod P1–P4 s telefonem; hlásí nesrozumitelná místa; metodik/autor opravují.
- Opravy, nasazení na Endoru (Pavel nahraje `web/`), test na 2 rodinách.
- → **Kontrolní bod C**: report „připraveno ke spuštění" + checklist pro Pavla (nahrát web, ověřit registraci, zapnout reklamu).

## 1. 10. — spuštění pilotu
Opus zůstává na opravách z provozu (Pavel hlásí do `reporty/PROVOZ.md`, Opus odpovídá tamtéž).

## Říjen — Fáze 1 (32 lekcí + diagnostika)
- Metodik: osnova 8 týdnů (témata po týdnech: 1 početní operace a celá čísla, 2 zlomky, 3 desetinná čísla a poměr, 4 procenta, 5 jednotky a slovní úlohy, 6 výrazy a rovnice základ, 7 obvod/obsah, 8 bonus opakování). Osnova do reportu ke schválení (kontrolní bod D, do 5. 10.).
- Autor úloh + recenzent po týdnech; každý týden = 4 JSON + seed. Pořadí výroby = pořadí týdnů, aby při skluzu bylo hotové aspoň prvních N týdnů.
- Autor diagnostiky: 20–25 úloh + report rodiči + obrazovka reportu.
- Backend: přechod na Supabase Pro nebo potvrzení provozu; `otevrit_od` 2026-12-01 (změna 25. 9.); předprodej: dotazník → nárok 790.
- → **Kontrolní bod E** (25. 10.): vše v seedu, kontrola průchodu 2 náhodných týdnů testovacím rodičem.

## Listopad–prosinec — Fáze 2 (CERMAT)
- Metodik: osnova únor–duben (únor témata CERMAT + pozice v testu, březen bloky na čas, duben simulace + záznamový arch). Formát lekce stejný; „simulace" = dvě lekce navázané za sebou s odpočtem 70 min a záznamovým archem v tisku (rozhodne Opus, zapíše do reportu).
- Výroba po týdnech, `otevrit_od` 2027-02-01 (záložně část 2027-02-01, zbytek 2027-03-01; změna 25. 9.).
- → **Kontrolní bod F** (20. 12.).

## Duben–květen
- 1. 5. skript uzavření účtů; stránka poděkování; export e-mailů pro příští sezónu.

## Pravidla reportování
- Report po každém kontrolním bodu do `reporty/`. Formát: Hotovo / Nehotovo / Rozhodnuto bez kostry / Otevřené otázky (s návrhem) / Pro Pavla (jen odkaz na PRO-PAVLA.md).
- Zadavatel (Cowork) čte reporty a odpovídá souborem `reporty/ODPOVED-<datum>.md`. Opus ho čte před dalším sprintem.
