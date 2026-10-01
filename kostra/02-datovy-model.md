# 02 — Datový model (Supabase / Postgres)

Názvy: česky bez diakritiky, snake_case. Všechny tabulky mají `created_at timestamptz default now()`. RLS zapnuté všude.

## rodiny
| sloupec | typ | pozn. |
|---|---|---|
| id | uuid PK | = auth.users.id |
| jmeno_rodice | text | |
| email | text | kopie z auth pro admin přehled |
| telefon | text null | až při plné registraci |
| stav | text | `pilot` / `aktivni` / `uzavreny` |
| zdroj | text null | odkud přišli (fb / ig / web / jiné) — volitelné pole v registraci |
| dotaznik_vyplnen | bool default false | nárok na 790 Kč |
| poznamka_admin | text null | Pavlovy poznámky |
| odemknuto_at | timestamptz null | kdy Pavel odemkl |

## deti
| sloupec | typ | pozn. |
|---|---|---|
| id | uuid PK | |
| rodina_id | uuid FK rodiny | |
| krestni_jmeno | text | |
| typ_skoly | text | `gymnazium` / `ss_maturita` |
| znamka_8 | smallint null | 1–5 |
| varianta | text default 'z9' | připraveno pro `z7` |
| poradi | smallint | 1 nebo 2; unique (rodina_id, poradi); check poradi <= 2 |

## lekce
| sloupec | typ | pozn. |
|---|---|---|
| id | text PK | např. `P1`, `F1-T03-L2`, `F2-T10-L4` |
| faze | text | `pilot` / `faze1` / `faze2` |
| tyden | smallint | 0 = diagnostika, 1–8 / 1–16 |
| poradi | smallint | 1–4 v týdnu |
| tema | text | „Zlomky — krácení" |
| kapitola | text | pro SOS e-mail a statistiky: `zlomky`, `procenta`, … |
| varianta | text default 'z9' | |
| obsah | jsonb | struktura viz 03-format-obsahu.md |
| verejna | bool | true jen pilot |
| otevrit_od | timestamptz | pilot: 2026-10-01; faze1: 2026-11-01; faze2: 2027-01-01 |
| verze | int | zvyšuje seed při změně |

## sezeni
| sloupec | typ | pozn. |
|---|---|---|
| id | uuid PK | |
| dite_id | uuid FK deti | |
| lekce_id | text FK lekce | |
| rezim | text | `app` / `papir` |
| zacatek | timestamptz | |
| konec | timestamptz null | |
| stav | text | `probiha` / `dokonceno` / `preruseno` |
| souhrn | jsonb null | 4 barvy + doporučení, vyplní se při dokončení |

## odpovedi
| sloupec | typ | pozn. |
|---|---|---|
| id | bigserial PK | |
| sezeni_id | uuid FK | |
| uloha_id | text | id úlohy uvnitř lekce |
| krok_id | text | id kroku; `final` pro výsledek |
| hodnota | jsonb | co bylo zadáno (číslo, zlomek {c,j}, id dlaždice, text) |
| spravne | bool null | null = nevyhodnotitelné (text) |
| typ_chyby | text null | z typovaného distraktoru / z porovnání se známými chybnými výsledky |
| pokus | smallint | 1, 2, … |
| cas_s | int null | sekundy od zobrazení kroku |
| zadal | text | `dite` / `rodic` (režim papír) |

## semafory
| sloupec | typ | pozn. |
|---|---|---|
| sezeni_id | uuid FK | PK spolu s uloha_id |
| uloha_id | text | |
| volba_rodice | text | `sam` / `s_otazkou` / `chyba_pocty` / `nevedel` |
| spravne_auto | bool null | výsledek z odpovědí |
| barva | text | `zelena` / `oranzova` / `cervena` |
| doporuceni | text | text pro rodiče (z šablony) |

## dotazniky
| sloupec | typ |
|---|---|
| rodina_id | uuid FK PK |
| odpovedi | jsonb |
| vyplneno_at | timestamptz |

## admini
| sloupec | typ |
|---|---|
| uid | uuid PK |

## Pohledy pro admin (views)
- `v_prehled_rodin`: rodina, děti, stav, poslední aktivita (max sezeni.zacatek), počet dokončených lekcí, aktuální týden (max tyden dokončené lekce), počet červených za posledních 7 dní.
- `v_semafory_dle_kapitoly`: kapitola × barva → počet (celkově i per dítě).
- `v_cas_na_ulohu`: průměr cas_s per úloha a per kapitola.
- `v_cervene`: seznam (dítě, rodina, lekce, úloha, datum) s barvou červená, seřazeno od nejnovější.

## RLS (shrnutí)
- `rodiny`: select/update vlastní řádek (id = auth.uid()); admin vše. Insert přes trigger po registraci (auth hook / funkce `after_signup`), ne z klienta.
- `deti`: rodina své řádky (rodina_id = auth.uid()); insert max 2 (trigger).
- `lekce`: select pokud `verejna` OR (rodina.stav='aktivni' AND now() >= otevrit_od); admin vše; nikdo z klienta nezapisuje (seed jde service key).
- `sezeni`, `odpovedi`, `semafory`: rodina své (přes dite_id → rodina_id); admin select vše.
- `dotazniky`: rodina insert/select vlastní; admin select.
- `admini`: select jen sám sebe (pro zjištění role); zápis jen ručně v SQL.

## Odvození barvy semaforu (matice)
| volba rodiče \ výsledek | správně | špatně / neodevzdáno |
|---|---|---|
| sám | zelená | oranžová (numerická chyba) |
| s otázkou (1–2 otázky) | zelená* | oranžová |
| spletl počítání | oranžová | oranžová |
| nevěděl, jak začít | oranžová | červená |
(*zelená s poznámkou „příště zkusit bez otázky"). Doporučení k barvám jsou v obsahu úlohy (`semafor.*`).

## Události pro admin e-mail (jen katastrofy, volitelné, až po pilotu)
- Dítě má červenou ve všech lekcích za 7 dní v řadě (≥ 3 lekce) → e-mail Pavlovi. Implementovat jako SQL view `v_alarm` a denní kontrolu; odesílání e-mailu až ve Fázi 1 (Resend nebo ručně z admin přehledu).

## GRANTy — povinné v každé migraci (změna Supabase od 30. 10. 2026)
Supabase od 30. 10. 2026 přestává novým tabulkám v `public` automaticky dávat přístup přes Data API. Proto **každá migrace, která vytváří tabulku nebo view, obsahuje explicitní GRANT ve stejném souboru** — nespoléhat na nastavení „Automatically expose new tables". Vzor:
```sql
grant select, insert, update, delete on public.<tabulka> to authenticated;
grant select, insert, update, delete on public.<tabulka> to service_role;
-- anon jen tam, kde to má smysl (např. nic — registrace jde přes auth, ne přes tabulky)
grant usage on schema public to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
```
Skutečné omezení přístupu dělá RLS, ne GRANT — GRANT jen zpřístupňuje tabulku API. Views pro admin: `grant select on public.v_* to authenticated;` + RLS na podkladových tabulkách (`security_invoker = true`).
