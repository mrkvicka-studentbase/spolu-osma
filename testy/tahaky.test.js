// Testy sbírky taháků a měsíčních výzev (R78 + R82, převzato ze Spolu 9 a upraveno na Spolu 8). Spuštění: npm test
// Logika se testuje na vlastním malém vzorku (volba `data`); obsahové moduly se kontrolují, jestli drží formát
// a jestli má každé téma plánu tahák.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DATA, vsechnyTahaky, tydenniTahaky, odemceneTahaky, stavVyzvy, celeTydny, pocetVMesici, datumVPraze,
  konecVyzvy, obdobiVyzvy, noveTahaky, najdiTahak, jeBonus, ODEMCENI_BONUSU, sezonaZamcena,
} from '../web/js/tahaky.js';
import { druhLekce } from '../web/js/plan-roku.js';

const KOREN = join(dirname(fileURLToPath(import.meta.url)), '..');
const blok = { nadpis: 'Pravidlo', text: 'Text.', priklad: '$1+1=2$' };
const T = (predmet, tyden) => ({ id: `t:${predmet}:osma:${tyden}`, predmet, faze: 'osma', tyden, nazev: `${predmet} ${tyden}`, podnazev: 'x', bloky: [blok, blok, blok] });
const VZOREK = {
  matematika: [T('matematika', 2), T('matematika', 1)],
  cestina: [T('cestina', 1)],
  vyzvy: [
    { mesic: '2026-11', cil: 3, nazev: 'Listopadový start' },
    { mesic: '2026-12', cil: 2, nazev: 'Adventní výzva' },
    { mesic: '2027-05', cil: 2, nazev: 'Májový finiš' },
  ],
  bonus: [
    { id: 'b:2026-12', mesic: '2026-12', nazev: 'Chyby v češtině', podnazev: 'Bonus', bloky: [blok] },
    { id: 'b:2026-11', mesic: '2026-11', nazev: 'Chyby v matematice', podnazev: 'Bonus', bloky: [blok] },
    { id: 'b:2027-05', mesic: '2027-05', nazev: 'Co mě čeká v 9. třídě', podnazev: 'Bonus', bloky: [blok] },
  ],
};
const data = VZOREK;

/**
 * Katalog Spolu 8: úvodní test M8-T00-DIAG, téma 1 matematiky (učební L1–L4, naostro L1N–L4N, B L1B),
 * pololetní test M8-T00-POL, téma 1 češtiny (učební l1–l4, naostro l1n).
 */
function katalog(hotove = {}) {
  const M = (id, tyden) => ({ id, predmet: 'matematika', faze: 'osma', tyden });
  const C = (id, tyden) => ({ id, predmet: 'cestina', faze: 'osma', tyden });
  const l = [
    M('M8-T00-DIAG', 0), M('M8-T00-POL', 0),
    ...[1, 2, 3, 4].flatMap((n) => [M(`M8-T01-L${n}`, 1), M(`M8-T01-L${n}N`, 1)]), M('M8-T01-L1B', 1),
    ...[1, 2, 3, 4].map((n) => C(`cj-t1-l${n}`, 1)), C('cj-t1-l1n', 1),
  ];
  return l.map((x) => ({ ...x, dokoncene: hotove[x.id] ? { konec: hotove[x.id] } : null }));
}
const vse = (ids, konec) => Object.fromEntries(ids.map((id) => [id, konec]));
const RIJEN = '2026-10-10T16:00:00Z';
const UCEBNI_M1 = ['M8-T01-L1', 'M8-T01-L2', 'M8-T01-L3', 'M8-T01-L4'];

test('pořadí sbírky: matematika podle tématu, čeština, bonusy podle měsíce; najdiTahak, jeBonus', () => {
  assert.deepEqual(vsechnyTahaky({ data }).map((t) => t.id), [
    't:matematika:osma:1', 't:matematika:osma:2', 't:cestina:osma:1', 'b:2026-11', 'b:2026-12', 'b:2027-05']);
  assert.equal(tydenniTahaky({ data }).length, 3);
  assert.equal(najdiTahak('b:2026-12', { data }).nazev, 'Chyby v češtině');
  assert.equal(najdiTahak('neni', { data }), null);
  assert.ok(jeBonus({ id: 'b:2026-11' }) && !jeBonus({ id: 't:cestina:osma:1' }));
});

test('odemčení tématu: všechny učební lekce L1–L4 hotové (barvy nehrají roli), předměty zvlášť', () => {
  assert.equal(odemceneTahaky(katalog(), { ted: RIJEN, data }).size, 0);
  assert.deepEqual([...odemceneTahaky(katalog(vse(UCEBNI_M1, RIJEN)), { ted: RIJEN, data })], ['t:matematika:osma:1'],
    'naostro dvojčata a B-varianta se do podmínky nepočítají');
  assert.equal(odemceneTahaky(katalog(vse(UCEBNI_M1.slice(0, 3), RIJEN)), { ted: RIJEN, data }).size, 0, '3 ze 4 učebních nestačí');
  const naostro = ['M8-T01-L1N', 'M8-T01-L2N', 'M8-T01-L3N', 'M8-T01-L4N', 'M8-T01-L1B', 'M8-T01-L1', 'M8-T01-L2', 'M8-T01-L3'];
  assert.equal(odemceneTahaky(katalog(vse(naostro, RIJEN)), { ted: RIJEN, data }).size, 0, 'naostro ani B nenahradí učební L4');
  const cj = odemceneTahaky(katalog(vse(['cj-t1-l1', 'cj-t1-l2', 'cj-t1-l3', 'cj-t1-l4'], RIJEN)), { ted: RIJEN, data });
  assert.deepEqual([...cj], ['t:cestina:osma:1']);
});

test('právě dokončená lekce (navic) dokončí téma', () => {
  const k = katalog(vse(UCEBNI_M1.slice(0, 3), RIJEN));
  assert.ok(odemceneTahaky(k, { ted: RIJEN, navic: { id: 'M8-T01-L4', konec: RIJEN }, data }).has('t:matematika:osma:1'));
});

test('testy (tyden 0: úvodní a pololetní) tahák nemají', () => {
  const k = katalog(vse(['M8-T00-DIAG', 'M8-T00-POL'], RIJEN));
  assert.equal(celeTydny(k).size, 0);
  const data0 = { ...data, matematika: [...data.matematika, T('matematika', 0)] };
  assert.equal(odemceneTahaky(k, { ted: RIJEN, data: data0 }).size, 0);
  // i kdyby téma 0 mělo dvě učební lekce, tahák nemá
  const dve = [{ id: 'D1', faze: 'osma', tyden: 0, dokoncene: { konec: RIJEN } }, { id: 'D2', faze: 'osma', tyden: 0, dokoncene: { konec: RIJEN } }];
  assert.equal(celeTydny(dve).size, 0);
});

test('hranice měsíců v Praze: 31. 10. 23:30 UTC je 1. 11. (zima, UTC+1), 30. 11. 22:59 UTC ještě listopad', () => {
  assert.equal(datumVPraze('2026-10-31T23:30:00Z'), '2026-11-01');
  assert.equal(datumVPraze('2026-10-31T22:30:00Z'), '2026-10-31');
  assert.equal(datumVPraze('2026-11-30T22:59:00Z'), '2026-11-30');
  assert.equal(datumVPraze('2026-11-30T23:00:00Z'), '2026-12-01');
  const k = katalog({ 'M8-T01-L1': '2026-10-31T23:30:00Z', 'M8-T01-L2': '2026-10-31T22:30:00Z', 'M8-T01-L3': '2026-11-30T22:59:00Z', 'M8-T01-L4': '2026-11-30T23:00:00Z' });
  assert.equal(pocetVMesici(k, '2026-11'), 2, 'L1 a L3 v listopadu, L2 v říjnu, L4 v prosinci');
  assert.equal(pocetVMesici(k, '2026-12'), 1);
});

test('výzva počítá učební i naostro lekce, ne B-varianty a testy', () => {
  const k = katalog(vse(['M8-T01-L1', 'M8-T01-L1N', 'M8-T01-L1B', 'M8-T00-DIAG', 'M8-T00-POL', 'cj-t1-l1n'], '2026-11-10T16:00:00Z'));
  assert.equal(pocetVMesici(k, '2026-11'), 3);
});

test('stav výzvy: počet, zbývající dny včetně dneška, splnění, odměna; oba předměty se sčítají', () => {
  const ted = '2026-11-22T10:00:00+01:00';
  const k = katalog({ 'M8-T01-L1': '2026-11-02T18:00:00+01:00', 'cj-t1-l1': '2026-11-03T18:00:00+01:00', 'M8-T01-L2': '2026-10-30T18:00:00+01:00' });
  const s = stavVyzvy(k, ted, { data });
  assert.deepEqual({ ...s, odmena: s.odmena.id }, {
    mesic: '2026-11', nazev: 'Listopadový start', cil: 3, hotovo: 2, zbyvaDni: 9, splneno: false, odmena: 'b:2026-11', konec: '2026-11-30' });
  assert.equal(odemceneTahaky(k, { ted, data }).has('b:2026-11'), false);
  // třetí lekce (i právě dokončená) výzvu splní a odemkne zlatý tahák
  const s2 = stavVyzvy(k, ted, { navic: { id: 'M8-T01-L3', konec: '2026-11-22T10:00:00+01:00' }, data });
  assert.equal(s2.hotovo, 3);
  assert.equal(s2.splneno, true);
  const k3 = katalog({ 'M8-T01-L1': '2026-11-02T18:00:00+01:00', 'cj-t1-l1': '2026-11-03T18:00:00+01:00', 'M8-T01-L1N': '2026-11-20T18:00:00+01:00' });
  assert.ok(odemceneTahaky(k3, { ted, data }).has('b:2026-11'));
  assert.ok(odemceneTahaky(k3, { ted: '2027-02-01T10:00:00+01:00', data }).has('b:2026-11'), 'splněná výzva zůstává odemčená i po konci měsíce');
  assert.equal(stavVyzvy(k, '2026-11-30T23:30:00+01:00', { data }).zbyvaDni, 1, 'poslední den');
});

test('opakování lekce: počítá se v každém měsíci, kdy byla dokončena (R82, dokonceniVse)', () => {
  const k = katalog({ 'M8-T01-L1': '2026-11-05T18:00:00+01:00' });
  // právě dokončené opakování v prosinci: prosinec ano, listopad zůstává
  assert.equal(pocetVMesici(k, '2026-12', { navic: { id: 'M8-T01-L1', konec: '2026-12-02T18:00:00+01:00' } }), 1);
  assert.equal(pocetVMesici(k, '2026-11', { navic: { id: 'M8-T01-L1', konec: '2026-12-02T18:00:00+01:00' } }), 1);
  // z databáze: poslední dokončení v prosinci, dřívější v listopadu (dokonceniVse z lekceProDite)
  const z = k.map((l) => (l.id === 'M8-T01-L1' ? { ...l, dokoncene: { konec: '2026-12-02T18:00:00+01:00' }, dokonceniVse: ['2026-12-02T18:00:00+01:00', '2026-11-05T18:00:00+01:00'] } : l));
  assert.equal(pocetVMesici(z, '2026-11'), 1, 'listopadové dokončení se nezapomene');
  assert.equal(pocetVMesici(z, '2026-12'), 1);
  assert.equal(pocetVMesici(z, '2027-01'), 0);
});

test('mimo období výzev null; před 1. 11. se výzva nezobrazuje; květen celý (bez zkrácené dubnové výzvy Spolu 9)', () => {
  assert.equal(stavVyzvy(katalog(), '2026-10-31T22:30:00Z', { data }), null, '31. 10. 23:30 v Praze');
  assert.ok(stavVyzvy(katalog(), '2026-10-31T23:30:00Z', { data }), '1. 11. 0:30 v Praze');
  assert.equal(stavVyzvy(katalog(), '2027-01-15T10:00:00Z', { data }), null, 'měsíc bez výzvy ve vzorku');
  assert.equal(konecVyzvy({ mesic: '2027-04' }), '2027-04-30');
  assert.equal(konecVyzvy({ mesic: '2027-02' }), '2027-02-28');
  assert.equal(konecVyzvy({ mesic: '2026-11', do: '2026-11-20' }), '2026-11-20');
  assert.equal(stavVyzvy(katalog(), '2027-05-31T20:00:00+02:00', { data }).zbyvaDni, 1);
  assert.equal(stavVyzvy(katalog(), '2027-06-01T08:00:00+02:00', { data }), null);
});

test('bonusy: 1. 6. 2027 (Praha) se odemknou všem; období výzvy pro text zámku', () => {
  assert.equal(ODEMCENI_BONUSU, '2027-06-01');
  const bonusy = (ted) => [...odemceneTahaky(katalog(), { ted, data })].filter((id) => id.startsWith('b:'));
  assert.deepEqual(bonusy('2027-05-31T21:59:00Z'), [], '31. 5. 23:59 v Praze (letní čas)');
  assert.deepEqual(bonusy('2027-05-31T22:00:00Z').sort(), ['b:2026-11', 'b:2026-12', 'b:2027-05'], '1. 6. 0:00 v Praze');
  const b11 = data.bonus.find((b) => b.id === 'b:2026-11');
  assert.equal(obdobiVyzvy(b11, '2026-10-20T10:00:00Z', { data }), 'budouci');
  assert.equal(obdobiVyzvy(b11, '2026-11-20T10:00:00Z', { data }), 'bezi');
  assert.equal(obdobiVyzvy(b11, '2026-12-01T10:00:00Z', { data }), 'skoncila');
});

test('nové taháky proti viděným (v pořadí sbírky)', () => {
  const odemcene = new Set(['b:2026-11', 't:cestina:osma:1', 't:matematika:osma:1']);
  assert.deepEqual(noveTahaky(odemcene, ['t:matematika:osma:1'], { data }), ['t:cestina:osma:1', 'b:2026-11']);
  assert.deepEqual(noveTahaky(odemcene, null, { data }), ['t:matematika:osma:1', 't:cestina:osma:1', 'b:2026-11']);
});

test('účet bez sezóny (platba / uzavřený): žádné zlaté taháky ani 1. 6.; zámek datem sezónu nezamyká (R82)', () => {
  for (const zamceno of ['platba', 'uzavreno']) {
    const k = katalog(vse(UCEBNI_M1, '2026-11-03T16:00:00Z')).map((l) => (l.predmet === 'cestina' ? { ...l, zamceno } : l));
    assert.equal(sezonaZamcena(k), true, zamceno);
    const o = odemceneTahaky(k, { ted: '2027-06-02T10:00:00Z', data });
    assert.ok(o.has('t:matematika:osma:1'), 'tahák tématu ano');
    assert.ok(![...o].some(jeBonus), 'bonusy ne');
  }
  assert.equal(sezonaZamcena(katalog().map((l) => ({ ...l, zamceno: 'datum' }))), false);
  assert.equal(sezonaZamcena(katalog()), false);
  assert.ok(odemceneTahaky(katalog(), { ted: '2027-06-02T10:00:00Z', data }).has('b:2026-11'), 'se sezónou bonusy 1. 6. ano');
});

// ---------------------------------------------------------------------------------------------
// Obsahové moduly (píšou je autoři obsahu): formát, pokrytí plánu a příklady jiné než v lekcích.
// ---------------------------------------------------------------------------------------------

/** Lekce obsahu Spolu 8 z obsah/ (id, predmet, tyden, cesta). */
function lekceObsahu() {
  const out = [];
  for (const [predmet, adr] of [['matematika', 'obsah/lekce'], ['cestina', 'obsah/cestina/lekce']]) {
    for (const n of readdirSync(join(KOREN, adr)).filter((x) => x.endsWith('.json'))) {
      const text = readFileSync(join(KOREN, adr, n), 'utf8');
      const l = JSON.parse(text);
      out.push({ id: l.id, predmet, tyden: Number(l.tyden), text });
    }
  }
  return out;
}

test('obsah taháků drží formát (id, nazev, bloky, párové $, výzvy, bonusy)', () => {
  const ids = new Set();
  for (const t of [...DATA.matematika, ...DATA.cestina]) {
    assert.match(t.id, /^t:(matematika|cestina):osma:\d+$/, `id ${t.id}`);
    assert.equal(t.id, `t:${t.predmet}:${t.faze}:${t.tyden}`, `${t.id}: id odpovídá predmet/faze/tyden`);
    assert.notEqual(Number(t.tyden), 0, `${t.id}: téma 0 (testy) tahák nemá`);
  }
  for (const t of DATA.matematika) assert.equal(t.predmet, 'matematika', t.id);
  for (const t of DATA.cestina) assert.equal(t.predmet, 'cestina', t.id);
  for (const t of DATA.bonus) {
    assert.match(t.id, /^b:\d{4}-\d{2}$/, `id ${t.id}`);
    assert.equal(t.id, `b:${t.mesic}`, `${t.id}: id odpovídá měsíci`);
    assert.ok(DATA.vyzvy.some((v) => v.mesic === t.mesic), `${t.id}: k bonusu existuje výzva`);
  }
  for (const v of DATA.vyzvy) assert.ok(DATA.bonus.some((b) => b.mesic === v.mesic), `výzva ${v.mesic}: má zlatý tahák`);
  for (const t of [...DATA.matematika, ...DATA.cestina, ...DATA.bonus]) {
    assert.ok(!ids.has(t.id), `duplicitní id ${t.id}`);
    ids.add(t.id);
    assert.ok(typeof t.nazev === 'string' && t.nazev.trim(), `${t.id}: nazev`);
    assert.ok(typeof t.podnazev === 'string' && t.podnazev.trim(), `${t.id}: podnazev`);
    assert.ok(Array.isArray(t.bloky) && t.bloky.length >= 3 && t.bloky.length <= 6, `${t.id}: 3–6 bloků (má ${t.bloky?.length})`);
    for (const b of t.bloky) {
      assert.ok(typeof b.nadpis === 'string' && b.nadpis.trim(), `${t.id}: blok bez nadpisu`);
      assert.ok(typeof b.text === 'string' && b.text.trim(), `${t.id} / ${b.nadpis}: text`);
      if (b.priklad !== undefined) assert.equal(typeof b.priklad, 'string', `${t.id} / ${b.nadpis}: priklad`);
      // $…$ párově (jinak KaTeX vykreslí dolary jako text)
      for (const pole of ['text', 'priklad']) {
        const s = String(b[pole] ?? '').replace(/\\\$/g, '').replace(/\$\$[\s\S]+?\$\$/g, '');
        assert.equal((s.match(/\$/g) || []).length % 2, 0, `${t.id} / ${b.nadpis}: lichý počet $ v ${pole}`);
      }
      assert.doesNotMatch(`${b.text} ${b.priklad || ''}`, /přijímač|CERMAT/i, `${t.id}: Spolu 8 bez přijímaček`);
    }
  }
  const mesice = DATA.vyzvy.map((v) => v.mesic);
  assert.equal(new Set(mesice).size, mesice.length, 'výzva pro každý měsíc jen jednou');
  assert.deepEqual(mesice.slice().sort(), ['2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04', '2027-05'], 'sezóna listopad–květen');
  for (const v of DATA.vyzvy) {
    assert.match(v.mesic, /^\d{4}-\d{2}$/);
    assert.ok(Number(v.cil) > 0 && typeof v.nazev === 'string' && v.nazev.trim(), `výzva ${v.mesic}`);
    assert.ok(v.mesic < ODEMCENI_BONUSU, `výzva ${v.mesic} končí před odemčením všech bonusů`);
  }
});

test('každé téma plánu (2+ hlavních lekcí v obsah/) má tahák a každý tahák má téma', () => {
  const temata = new Map();
  for (const l of lekceObsahu()) {
    const d = druhLekce(l.id);
    if (!d || d.b || d.test) continue; // hlavní lekce = učební + naostro
    const k = `t:${l.predmet}:osma:${l.tyden}`;
    temata.set(k, (temata.get(k) || 0) + 1);
  }
  const ocekavane = [...temata].filter(([, n]) => n >= 2).map(([k]) => k).sort();
  assert.equal(ocekavane.length, 20, '10 témat matematiky + 10 češtiny');
  assert.deepEqual(tydenniTahaky().map((t) => t.id).sort(), ocekavane);
});

test('příklady taháků nejsou opsané z úloh lekcí svého tématu (výraz v $…$ se v JSON lekce nevyskytuje)', () => {
  const lekce = lekceObsahu();
  const norm = (s) => s.replace(/\\\\/g, '\\').replace(/\s+/g, '');
  for (const t of tydenniTahaky()) {
    const texty = lekce.filter((l) => l.predmet === t.predmet && l.tyden === Number(t.tyden)).map((l) => norm(l.text));
    for (const b of t.bloky) {
      for (const [, vyraz] of String(b.priklad || '').matchAll(/\$([^$]+)\$/g)) {
        const v = norm(vyraz);
        if (v.length < 8) continue; // krátké výrazy ($x$, $5$) se opakují přirozeně
        assert.ok(!texty.some((x) => x.includes(v)), `${t.id} / ${b.nadpis}: příklad $${vyraz}$ je v úloze lekce`);
      }
    }
  }
});

test('obsah taháků: 3–6 bloků (spec §4)', () => {
  for (const t of [...DATA.matematika, ...DATA.cestina]) {
    assert.ok(t.bloky.length >= 3 && t.bloky.length <= 6, `${t.id}: 3–6 bloků (má ${t.bloky.length})`);
  }
});
