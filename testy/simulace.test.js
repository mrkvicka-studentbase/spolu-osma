// =====================================================================
// simulace.test.js — Fáze 2: výpočet simulace (web/js/simulace.js) nad vzorovými lekcemi testy/data/F2-VZOR-*.json.
// Pravidla: obsah/osnova-faze2.md §3.1 (odpočet 70 min, rozdělení > 30 min → 35 min), §3.4 (body jen pro rodiče,
// povinný postup, úloha 11, úloha 15, konstrukce „Sedí" = plné body), SABLONA §20.8.
// =====================================================================

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  casSimulace, stavTempa, konecCasti, vyhodnotUlohu, sestavSouhrnSimulace, sediciPozice, polozkyKontroly,
  postupKrokId, spravneTex, uznavaSeI, pismenoMoznosti, pismenaKroku, typVKatalogu, kapitolaLekce, jeSimulace, jeBlok,
  doporuceniLekci, cisloNaTex, maxBodyUlohy, posledniOdpoved,
} from '../web/js/simulace.js';
import { vyhodnotKrok } from '../web/js/vyhodnoceni.js';
import { zkontrolujLekci, nactiSlovnikChyb, kontrolaParuSimulaci, bodyLekce } from '../supabase/seed/validator.mjs';

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nacti = (id) => JSON.parse(readFileSync(path.join(KOREN, 'testy', 'data', `${id}.json`), 'utf8'));
const L1 = nacti('F2-VZOR-L1');
const L2 = nacti('F2-VZOR-L2');
const BLOK = nacti('F2-VZOR-BLOK');
const U = (lekce, pozice) => lekce.ulohy.find((u) => u.pozice === pozice);

/** Hodnota správné odpovědi tak, jak ji posílá vstup. */
function spravnaHodnota(krok) {
  const s = krok.spravne;
  switch (krok.vstup.typ) {
    case 'cislo': return s.hodnota;
    case 'zlomek': return { c: s.c, j: s.j };
    case 'vyraz': return s.vyraz;
    case 'dlazdice': return krok.vstup.moznosti.find((m) => m.spravne).id;
    case 'rysovani': return 'sedi';
    default: throw new Error(krok.vstup.typ);
  }
}

let idRadku = 0;
/** Řádek odpovedi jako z DB (vyhodnocený vyhodnotKrok, jako při odevzdání). */
function radek(uloha, krok, hodnota, { zadal = 'dite', pokus = 1, krokId = null, spravne, typChyby } = {}) {
  idRadku += 1;
  const v = krokId ? { spravne, typ_chyby: typChyby ?? null } : vyhodnotKrok(krok, hodnota);
  return { id: idRadku, uloha_id: uloha.id, krok_id: krokId || krok.id, hodnota, spravne: v.spravne, typ_chyby: v.typ_chyby ?? null, pokus, zadal,
    created_at: new Date(Date.UTC(2027, 2, 27, 10, 0, idRadku)).toISOString() };
}

/** Celá část vyplněná správně (dítě) + rodič: postup Ano, rýsování Sedí. `prepis` = pozice → {krokId: hodnota}. */
function odpovediCasti(lekce, { prepis = {}, postup = 'ano', rysovani = 'sedi', vynechat = [] } = {}) {
  const r = [];
  for (const u of lekce.ulohy) {
    if (vynechat.includes(u.pozice)) continue;
    for (const k of u.kroky) {
      if (k.vstup.typ === 'rysovani') {
        r.push(radek(u, k, 'hotovo'));
        if (rysovani) r.push(radek(u, k, rysovani, { zadal: 'rodic' }));
        continue;
      }
      const h = prepis[u.pozice]?.[k.id] ?? spravnaHodnota(k);
      r.push(radek(u, k, h));
      if (k.postup && postup) r.push(radek(u, k, postup, { zadal: 'rodic', krokId: postupKrokId(k.id), spravne: postup === 'ano', typChyby: postup === 'ne' ? 'jen-vysledek-bez-postupu' : null }));
    }
  }
  return r;
}

describe('vzorové lekce projdou validátorem (25 + 25 bodů)', () => {
  test('schema + doménové kontroly + páry simulace', async () => {
    const schema = JSON.parse(readFileSync(path.join(KOREN, 'obsah', 'schema.json'), 'utf8'));
    const slovnik = await nactiSlovnikChyb(path.join(KOREN, 'obsah', 'typy-chyb.md'));
    for (const l of [L1, L2, BLOK]) {
      const { chyby } = zkontrolujLekci(l, `${l.id}.json`, { schema, slovnik });
      assert.deepEqual(chyby, [], `${l.id}: ${chyby.join('; ')}`);
    }
    assert.deepEqual(kontrolaParuSimulaci([L1, L2]), []);
    assert.equal(bodyLekce(L1), 25);
    assert.equal(bodyLekce(L2), 25);
  });
  test('pokrytí typů: cislo, zlomek, vyraz s postupem, A-E, AN ×3, A-F ×3, rysovani, obrazek_mm', () => {
    const kroky = [...L1.ulohy, ...L2.ulohy].flatMap((u) => u.kroky);
    const typy = new Set(kroky.map((k) => k.vstup.pismena || k.vstup.typ));
    for (const t of ['cislo', 'zlomek', 'vyraz', 'A-E', 'AN', 'A-F', 'rysovani']) assert.ok(typy.has(t), t);
    assert.ok(kroky.some((k) => k.vstup.typ === 'vyraz' && k.postup));
    assert.equal(U(L2, 11).kroky.filter((k) => k.vstup.pismena === 'AN').length, 3);
    assert.equal(U(L2, 15).kroky.filter((k) => k.vstup.pismena === 'A-F').length, 3);
    assert.ok([...L1.ulohy, ...L2.ulohy].some((u) => u.obrazek_mm));
    assert.ok(U(L2, 9).tahak.reseni_obrazek && U(L2, 9).tahak.kontrola_rodice.length >= 2);
  });
});

describe('typ lekce, kapitola, písmena', () => {
  test('jeSimulace / jeBlok / typVKatalogu', () => {
    assert.ok(jeSimulace(L1) && jeSimulace({ obsah: { typ: 'simulace' } }));
    assert.ok(jeBlok(BLOK) && !jeBlok(L1));
    assert.equal(typVKatalogu({ kapitola: 'simulace', tema: 'Simulace 1 — úlohy 1–8' }), 'simulace');
    assert.equal(typVKatalogu({ kapitola: 'mix', tema: 'Blok 3' }), 'blok');
    assert.equal(typVKatalogu({ kapitola: 'mix', tema: 'Rozbor simulace 1' }), null);
    assert.equal(typVKatalogu({ kapitola: 'zlomky', tema: 'Blok' }), null);
  });
  test('kapitolaLekce: mix/simulace → kapitola hlavní úlohy (SOS, statistiky)', () => {
    assert.equal(kapitolaLekce(BLOK), 'geometrie'); // U4 semafor
    assert.equal(kapitolaLekce({ kapitola: 'zlomky', ulohy: [] }), 'zlomky');
    assert.equal(kapitolaLekce(L2), 'slovni-ulohy'); // simulace: poslední úloha (16)
  });
  test('písmena v pevném pořadí podle moznosti', () => {
    const k12 = U(L2, 12).kroky[0];
    assert.deepEqual(pismenaKroku(k12), ['A', 'B', 'C', 'D', 'E']);
    assert.equal(pismenoMoznosti(k12, 'b'), 'B');
    assert.equal(pismenoMoznosti(U(L2, 11).kroky[2], 'n'), 'N');
    assert.equal(pismenoMoznosti(U(L2, 15).kroky[1], 'f'), 'F');
    assert.equal(pismenaKroku(BLOK.ulohy[2].kroky[0]), null);
  });
  test('vyhodnotKrok rysovani: Hotovo = hodnotí rodič, Sedí/Nesedí', () => {
    const k = U(L2, 9).kroky[0];
    assert.deepEqual(vyhodnotKrok(k, 'hotovo'), { spravne: null, typ_chyby: null, poznamka: 'hodnoti-rodic', neplatne: false });
    assert.equal(vyhodnotKrok(k, 'sedi').spravne, true);
    assert.equal(vyhodnotKrok(k, 'nesedi').spravne, false);
    assert.equal(vyhodnotKrok(k, '').neplatne, true);
  });
});

describe('odpočet 70 min přes obě části (osnova §3.1)', () => {
  const z1 = '2027-03-27T10:00:00.000Z';
  test('část 1 a navazující část 2: jeden odpočet od začátku části 1', () => {
    assert.deepEqual(casSimulace({ cast: 1, zacatek1: z1 }), { start: Date.parse(z1), minut: 70, rozdeleno: false });
    const c2 = casSimulace({ cast: 2, zacatek1: z1, konec1: '2027-03-27T10:36:00Z', zacatek2: '2027-03-27T10:40:00Z' });
    assert.deepEqual(c2, { start: Date.parse(z1), minut: 70, rozdeleno: false });
  });
  test('pauza přesně 30 min ještě není rozdělení, 31 min už ano (35 min vlastní odpočet)', () => {
    const k1 = '2027-03-27T10:35:00Z';
    assert.equal(casSimulace({ cast: 2, zacatek1: z1, konec1: k1, zacatek2: '2027-03-27T11:05:00Z' }).rozdeleno, false);
    const c = casSimulace({ cast: 2, zacatek1: z1, konec1: k1, zacatek2: '2027-03-27T11:06:00Z' });
    assert.deepEqual(c, { start: Date.parse('2027-03-27T11:06:00Z'), minut: 35, rozdeleno: true });
  });
  test('druhý večer (část 1 dokončená včera) a chybějící část 1', () => {
    const c = casSimulace({ cast: 2, zacatek1: z1, konec1: '2027-03-27T10:40:00Z', zacatek2: '2027-03-28T17:00:00Z' });
    assert.equal(c.rozdeleno, true);
    assert.equal(c.minut, 35);
    assert.equal(casSimulace({ cast: 2, zacatek2: '2027-03-28T17:00:00Z' }).rozdeleno, true);
  });
  test('konecCasti: konec sezení, jinak poslední odpověď dítěte, jinak začátek', () => {
    assert.equal(konecCasti({ zacatek: z1, konec: '2027-03-27T10:50:00.000Z' }), '2027-03-27T10:50:00.000Z');
    const odp = [{ zadal: 'dite', created_at: '2027-03-27T10:31:00.000Z' }, { zadal: 'dite', created_at: '2027-03-27T10:33:00.000Z' },
      { zadal: 'rodic', created_at: '2027-03-27T12:00:00.000Z' }];
    assert.equal(konecCasti({ zacatek: z1 }, odp), '2027-03-27T10:33:00.000Z');
    assert.equal(konecCasti({ zacatek: z1 }, []), z1);
    assert.equal(konecCasti(null), null);
  });
  test('tempo: připomínka ve 40. minutě, konec v 70. (bez tvrdého stopu), u rozdělené bez připomínky', () => {
    const c = { start: 0, minut: 70, rozdeleno: false };
    assert.equal(stavTempa(c, 39 * 60000).pripominka, false);
    assert.equal(stavTempa(c, 40 * 60000).pripominka, true);
    assert.equal(stavTempa(c, 70 * 60000).vyprselo, true);
    assert.equal(stavTempa(c, 70 * 60000).pripominka, false);
    assert.equal(stavTempa(c, 95 * 60000).zbyvaS, 0);
    assert.equal(stavTempa({ start: 0, minut: 35, rozdeleno: true }, 40 * 60000).pripominka, false);
  });
});

describe('body (osnova §3.4)', () => {
  test('bez chyby: 25 + 25 = 50, všechny úlohy sedí', () => {
    const s = sestavSouhrnSimulace({ lekce1: L1, lekce2: L2, odpovedi1: odpovediCasti(L1), odpovedi2: odpovediCasti(L2), rezim: 'app' });
    assert.equal(s.body, 50);
    assert.equal(s.max, 50);
    assert.deepEqual(s.casti.map((c) => [c.body, c.max]), [[25, 25], [25, 25]]);
    assert.deepEqual(s.sedi, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    assert.deepEqual(s.chyby, []);
    assert.deepEqual(s.doporuceni, []);
    assert.equal(s.typ, 'simulace');
    assert.deepEqual(s.lekce, ['F2-VZOR-L1', 'F2-VZOR-L2']);
  });
  test('správný výsledek bez povinného postupu = 0 bodů (a kód jen-vysledek-bez-postupu)', () => {
    const u = U(L1, 4); // 4.1 (2 b.) + 4.2 x (1) + 4.2 y (1), vše s postupem
    const v = vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { postup: 'ne' }));
    assert.equal(v.max, 4);
    assert.equal(v.body, 0);
    assert.equal(v.sedi, false);
    assert.ok(v.chyby.every((c) => c === 'jen-vysledek-bez-postupu') && v.chyby.length === 3);
    const s = vyhodnotUlohu(U(L1, 2), odpovediCasti({ ulohy: [U(L1, 2)] }, { postup: 'ne' }));
    assert.equal(s.body, 2); // 2.1 a 2.2 bez postupu platí, 2.3 (2 b.) ne
  });
  test('postup ještě nezkontrolovaný (režim aplikace) → úloha čeká, nesedí', () => {
    const u = U(L1, 3);
    const v = vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { postup: null }));
    assert.equal(v.ceka, true);
    assert.equal(v.sedi, false);
    assert.equal(v.body, 2); // 3.1 a 3.2 platí hned
  });
  test('špatný výsledek s postupem = 0 za krok, známá chyba se uloží', () => {
    const u = U(L1, 2);
    const v = vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { prepis: { 2: { final: { c: 5, j: 54 } } } }));
    assert.equal(v.body, 2);
    assert.deepEqual(v.chyby, ['delil-bez-prevraceni']);
  });
  test('úloha 11: 3 správně = 4, 2 správně = 2, 1 správně = 0', () => {
    const u = U(L2, 11);
    const s3 = vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }));
    assert.equal(s3.body, 4);
    const s2 = vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { prepis: { 11: { final: 'a' } } }));
    assert.equal(s2.body, 2);
    assert.deepEqual(s2.chyby, ['tipnul-bez-vypoctu']);
    const s1 = vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { prepis: { 11: { k1: 'n', final: 'a' } } }));
    assert.equal(s1.body, 0);
  });
  test('úloha 15: 2 body za každou položku', () => {
    const u = U(L2, 15);
    assert.equal(maxBodyUlohy(u), 6);
    assert.equal(vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { prepis: { 15: { k2: 'a' } } })).body, 4);
    assert.equal(vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { prepis: { 15: { k1: 'c', k2: 'a' } } })).body, 2);
  });
  test('konstrukce: Sedí = plné body, Nesedí = 0, jen „Hotovo" = čeká na rodiče', () => {
    const u = U(L2, 9);
    assert.equal(vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] })).body, 3);
    assert.equal(vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { rysovani: 'nesedi' })).body, 0);
    const c = vyhodnotUlohu(u, odpovediCasti({ ulohy: [u] }, { rysovani: null }));
    assert.equal(c.ceka, true);
    assert.equal(c.sedi, false);
    // rodič změnil názor: poslední volba platí
    const r = odpovediCasti({ ulohy: [u] });
    r.push(radek(u, u.kroky[0], 'nesedi', { zadal: 'rodic', pokus: 2 }));
    assert.equal(vyhodnotUlohu(u, r).body, 0);
  });
  test('neodevzdaná úloha = 0 bodů, nečeká', () => {
    const v = vyhodnotUlohu(U(L1, 5), []);
    assert.deepEqual([v.body, v.ceka, v.sedi], [0, false, false]);
  });
  test('souhrn: rozpad po částech testu, 3 nejčastější chyby, doporučení lekcí, dítě jen zelené pozice', () => {
    const o1 = odpovediCasti(L1, { prepis: { 1: { final: 225 }, 5: { final: 800 }, 7: { k1: 12, final: 36 } }, postup: 'ne' });
    const o2 = odpovediCasti(L2, { prepis: { 12: { final: 'a' }, 14: { final: 'a' } }, rysovani: 'nesedi' });
    const s = sestavSouhrnSimulace({ lekce1: L1, lekce2: L2, odpovedi1: o1, odpovedi2: o2, rezim: 'papir', rozdeleno: true });
    // část 1: U1 0, U2 2 (2.3 bez postupu), U3 2, U4 0, U5 0, U6 3, U7 0, U8 4 = 11
    assert.equal(s.casti[0].body, 11);
    // část 2: U9 0, U10 0, U11 4, U12 0, U13 2, U14 0, U15 6, U16 4 = 16
    assert.equal(s.casti[1].body, 16);
    assert.equal(s.body, 27);
    assert.equal(s.rozdeleno, true);
    assert.equal(s.rezim, 'papir');
    assert.deepEqual(s.skupiny.map((g) => [g.klic, g.body, g.max]),
      [['cisla', 2, 5], ['algebra', 2, 8], ['slovni', 7, 12], ['konstrukce', 0, 5], ['uzavrene', 12, 16], ['uloha16', 4, 4]]);
    assert.equal(s.chyby[0].typ_chyby, 'jen-vysledek-bez-postupu');
    assert.equal(s.chyby[0].pocet, 5);
    assert.deepEqual(s.chyby[0].pozice, [2, 3, 4]);
    assert.equal(s.chyby[1].typ_chyby, 'vybral-mezivysledek');
    assert.equal(s.chyby.length, 3);
    assert.deepEqual(s.sedi, [6, 8, 11, 13, 15, 16]);
    assert.deepEqual(s.doporuceni.map((d) => d.pozice), [4, 7, 9]); // největší ztráta, pak nižší pozice
    assert.deepEqual(s.doporuceni[0].lekce, ['F2-T01-L4', 'F2-T02-L1', 'F1-T06-L3']);
    assert.deepEqual(s.doporuceni[1].lekce, ['F2-T03-L4', 'F2-T03-L3', 'F1-T07-L1']);
    assert.deepEqual(s.doporuceni[2].lekce, ['F2-T04-L1']); // konstrukce: bez Fáze 1
    const text = JSON.stringify(s);
    assert.ok(!/gymn|stačí|přijet/i.test(text));
  });
  test('sediciPozice a doporuceniLekci jsou robustní', () => {
    assert.deepEqual(sediciPozice([{ sedi: true, pozice: 5 }, { sedi: false, pozice: 1 }, { sedi: true, pozice: 2 }]), [2, 5]);
    assert.deepEqual(doporuceniLekci([{ pozice: 16, kapitola: 'slovni-ulohy', max: 4, body: 4 }]), []);
  });
  test('posledniOdpoved: rodič přepíše dítě, řádek ve frontě (bez created_at) je nejnovější', () => {
    const r = [
      { uloha_id: 'X', krok_id: 'final', spravne: false, id: 1, created_at: '2027-01-01T10:00:00Z', pokus: 1 },
      { uloha_id: 'X', krok_id: 'final', spravne: true, pokus: 2 },
    ];
    assert.equal(posledniOdpoved(r, 'X', 'final').spravne, true);
  });
});

describe('Kontrola rodiče (osnova §3.2)', () => {
  test('režim aplikace: jen postup a konstrukce', () => {
    const k1 = polozkyKontroly(L1, 'app');
    assert.deepEqual(k1.map((x) => x.uloha.pozice), [2, 3, 4]);
    assert.ok(k1.flatMap((x) => x.polozky).every((p) => p.druh === 'postup'));
    const k2 = polozkyKontroly(L2, 'app');
    assert.deepEqual(k2.map((x) => [x.uloha.pozice, x.polozky.map((p) => p.druh)]), [[9, ['rysovani']], [10, ['rysovani']]]);
  });
  test('papír: výsledek Sedí/Nesedí, písmena, postup, konstrukce', () => {
    const k1 = polozkyKontroly(L1, 'papir');
    assert.equal(k1.length, 8);
    assert.deepEqual(k1.find((x) => x.uloha.pozice === 2).polozky.map((p) => p.druh), ['vysledek', 'vysledek', 'vysledek', 'postup']);
    const k2 = polozkyKontroly(L2, 'papir');
    assert.deepEqual(k2.find((x) => x.uloha.pozice === 11).polozky.map((p) => p.druh), ['pismena', 'pismena', 'pismena']);
    assert.deepEqual(k2.find((x) => x.uloha.pozice === 9).polozky.map((p) => p.druh), ['rysovani']);
  });
  test('„Správně: …" a „uznává se i …"', () => {
    assert.equal(spravneTex(U(L1, 1).kroky[0]), '$135$ min');
    assert.equal(spravneTex(U(L1, 2).kroky[1]), '$0{,}65$');
    assert.equal(spravneTex(U(L1, 2).kroky[2]), '$\\frac{3}{10}$');
    assert.equal(spravneTex(U(L1, 3).kroky[2]), '$2x + 9$');
    assert.equal(spravneTex(U(L2, 12).kroky[0]), 'B) $120\\ \\text{cm}^2$');
    assert.equal(spravneTex(U(L2, 9).kroky[0]), null);
    assert.equal(cisloNaTex(1200), '1\\,200');
    assert.equal(cisloNaTex(-0.5), '-0{,}5');
    assert.deepEqual(uznavaSeI(U(L1, 2).kroky[2]), [{ druh: 'nezkraceny' }, { druh: 'desetinne', tex: '0{,}3' }]);
    assert.deepEqual(uznavaSeI(U(L1, 2).kroky[0]), [{ druh: 'nezkraceny' }]); // 11/12 nemá konečný desetinný zápis
    assert.deepEqual(uznavaSeI(U(L1, 2).kroky[1]), [{ druh: 'zlomek', tex: '\\frac{13}{20}' }]);
    assert.deepEqual(uznavaSeI(U(L1, 1).kroky[0]), []);
    assert.deepEqual(uznavaSeI(U(L1, 3).kroky[2]), [{ druh: 'poradi_clenu' }]);
  });
});

describe('statistiky adminu: kapitola úlohy místo mix / simulace', () => {
  test('mapaKapitolUloh a premapujStatistiky', async () => {
    const { mapaKapitolUloh, premapujStatistiky } = await import('../web/js/simulace.js');
    const mapa = mapaKapitolUloh([BLOK, L1]);
    assert.equal(mapa.get('F2-VZOR-BLOK-U4'), 'geometrie');
    assert.equal(mapa.get('F2-VZOR-L1-U2'), 'zlomky');
    const r = premapujStatistiky({
      semafory: [
        { kapitola: 'mix', barva: 'zelena', pocet: 2, je_celkem: true },
        { kapitola: 'zlomky', barva: 'zelena', pocet: 5, je_celkem: true },
        { kapitola: 'mix', barva: 'zelena', pocet: 2, je_celkem: false, dite_id: 'd' },
      ],
      casy: [{ kapitola: 'mix', uloha_id: 'F2-VZOR-BLOK-U1', je_kapitola: false }, { kapitola: 'mix', uloha_id: null, je_kapitola: true }],
      cervene: [{ kapitola: 'mix', uloha_id: 'F2-VZOR-BLOK-U3' }],
    }, mapa, [{ uloha_id: 'F2-VZOR-BLOK-U1', barva: 'zelena' }, { uloha_id: 'F2-VZOR-BLOK-U4', barva: 'zelena' }]);
    const celkem = r.semafory.filter((x) => x.je_celkem);
    assert.deepEqual(celkem.map((x) => [x.kapitola, x.pocet]).sort(), [['geometrie', 1], ['zlomky', 6]]);
    assert.equal(r.casy[0].kapitola, 'zlomky');
    assert.equal(r.casy[1].kapitola, 'mix');
    assert.equal(r.cervene[0].kapitola, 'geometrie');
  });
});

describe('blok na čas u rodiče (R46): odevzdáno x ze 4, co dítě zadalo', () => {
  test('ulohaOdevzdana: poslední krok sedí, nehodnotí se (rýsování), nebo vyčerpané pokusy; jen odpovědi dítěte', async () => {
    const { ulohaOdevzdana, pocetOdevzdanychBloku } = await import('../web/js/simulace.js');
    const [u1, u2, u3, u4] = BLOK.ulohy;
    const o = (u, krok, pokus, spravne, zadal = 'dite') => ({ uloha_id: u.id, krok_id: krok, pokus, spravne, zadal });
    assert.equal(ulohaOdevzdana(u1, []), false);
    assert.equal(ulohaOdevzdana(u1, [o(u1, 'final', 1, false)]), false, '1. pokus nesedí → dítě ještě pracuje');
    assert.equal(ulohaOdevzdana(u1, [o(u1, 'final', 1, false), o(u1, 'final', 1, false)]), false, 'duplicita DB + fronta = jeden pokus');
    assert.equal(ulohaOdevzdana(u1, [o(u1, 'final', 1, false), o(u1, 'final', 2, false)]), true, '2 pokusy → jde dál');
    assert.equal(ulohaOdevzdana(u1, [o(u1, 'final', 1, true)]), true);
    assert.equal(ulohaOdevzdana(u2, [o(u2, 'k1', 1, true)]), false, 'mezikrok nestačí');
    assert.equal(ulohaOdevzdana(u3, [o(u3, 'final', 1, null)]), true, 'rýsování „Hotovo"');
    assert.equal(ulohaOdevzdana(u4, [o(u4, 'final', 1, true, 'rodic')]), false, 'odpověď rodiče (papír) se nepočítá');
    const vse = [o(u1, 'final', 1, true), o(u2, 'final', 2, false), o(u2, 'final', 1, false), o(u3, 'final', 1, null), o(u4, 'final', 1, false)];
    assert.equal(pocetOdevzdanychBloku(BLOK, vse), 3);
    assert.equal(pocetOdevzdanychBloku(BLOK, vse.concat(o(u4, 'final', 2, true))), 4);
  });

  test('odpovedDitete: TeX čísla / zlomku / výrazu, dlaždice s písmenem a štítkem, text dítěte jako prostý text', async () => {
    const { odpovedDitete } = await import('../web/js/simulace.js');
    const [u1, u2, u3, u4] = BLOK.ulohy;
    assert.deepEqual(odpovedDitete(u1.kroky[0], { c: -5, j: 8 }), { druh: 'tex', obsah: '-\\frac{5}{8}', jednotka: '' });
    assert.deepEqual(odpovedDitete(u4.kroky[0], 1200.5), { druh: 'tex', obsah: '1\\,200{,}5', jednotka: 'cm' });
    assert.equal(odpovedDitete(u2.kroky[0], 'b').obsah, '2. řádek: $x^2 + 4 - x^2$');
    assert.equal(odpovedDitete(u2.kroky[1], '2x+4').druh, 'tex');
    assert.equal(odpovedDitete(u2.kroky[1], '2x+').druh, 'text');
    assert.equal(odpovedDitete(u3.kroky[1], 'hotovo').druh, 'rysovani');
    const ae = U(L2, 12).kroky.find((k) => k.vstup?.pismena === 'A-E');
    assert.match(odpovedDitete(ae, ae.vstup.moznosti[1].id).obsah, /^B\) /);
    assert.deepEqual(odpovedDitete({ vstup: { typ: 'text' } }, '<b>x</b>'), { druh: 'text', obsah: '<b>x</b>' });
  });
});

describe('body R50: skupiny kroků, nezkrácený zlomek, konstrukce po částech', () => {
  const o = (ulohaId, krokId, spravne, hodnota = null, typ_chyby = null) => ({ uloha_id: ulohaId, krok_id: krokId, spravne, hodnota, typ_chyby, zadal: 'dite', pokus: 1 });
  test('dva rámečky 3.1 (0 + 1 b.): bod jen když sedí oba', () => {
    const u = { id: 'X-U3', pozice: 3, kroky: [
      { id: 'k1', popisek: '3.1 levý rámeček', vstup: { typ: 'cislo' }, spravne: { hodnota: 7 }, body: 0 },
      { id: 'k2', popisek: '3.1 pravý rámeček', vstup: { typ: 'cislo' }, spravne: { hodnota: 49 }, body: 1 },
      { id: 'final', popisek: '3.2', vstup: { typ: 'cislo' }, spravne: { hodnota: 5 }, body: 1 },
    ] };
    assert.equal(vyhodnotUlohu(u, [o(u.id, 'k1', true, 7), o(u.id, 'k2', true, 49), o(u.id, 'final', true, 5)]).body, 2);
    assert.equal(vyhodnotUlohu(u, [o(u.id, 'k1', false, 14), o(u.id, 'k2', true, 49), o(u.id, 'final', true, 5)]).body, 1);
  });
  test('4.2 x a 4.2 y (1 + 1 b.) se neslučují, když žádný krok nemá 0 bodů', () => {
    const u = { id: 'X-U4', pozice: 4, kroky: [
      { id: 'k1', popisek: '4.2 $x$', vstup: { typ: 'cislo' }, spravne: { hodnota: 4 }, body: 1 },
      { id: 'final', popisek: '4.2 $y$', vstup: { typ: 'cislo' }, spravne: { hodnota: -7 }, body: 1 },
    ] };
    assert.equal(vyhodnotUlohu(u, [o(u.id, 'k1', true, 4), o(u.id, 'final', false, 7)]).body, 1);
  });
  test('nezkrácený zlomek u kontrola_tvaru zakladni_tvar = 0 bodů a kód nezkratil', () => {
    const u = { id: 'X-U2', pozice: 2, kroky: [
      { id: 'final', popisek: '2.1', vstup: { typ: 'zlomek' }, spravne: { c: 3, j: 4 }, kontrola_tvaru: 'zakladni_tvar', body: 1 },
    ] };
    const v = vyhodnotUlohu(u, [o(u.id, 'final', true, { c: 6, j: 8 })]);
    assert.equal(v.body, 0);
    assert.deepEqual(v.chyby, ['nezkratil']);
    assert.equal(vyhodnotUlohu(u, [o(u.id, 'final', true, { c: 3, j: 4 })]).body, 1);
  });
  test('konstrukce 9.1 (1 b.) a 9.2 (2 b.) jako dva rýsovací kroky: body po krocích', () => {
    const u = { id: 'X-U9', pozice: 9, kroky: [
      { id: 'k1', popisek: '9.1', vstup: { typ: 'rysovani' }, spravne: null, body: 1 },
      { id: 'final', popisek: '9.2', vstup: { typ: 'rysovani' }, spravne: null, body: 2 },
    ] };
    const r = (a, b) => [{ ...o(u.id, 'k1', a), zadal: 'rodic' }, { ...o(u.id, 'final', b), zadal: 'rodic' }];
    assert.equal(vyhodnotUlohu(u, r(true, false)).body, 1);
    assert.equal(vyhodnotUlohu(u, r(true, true)).body, 3);
  });
});

