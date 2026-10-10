// Testy sbírky taháků a měsíčních výzev (R78, reporty/2026-10-08-spec-tahaky-vyzvy.md). Spuštění: npm test
// Logika se testuje na vlastním malém vzorku (volba `data`); obsahové moduly se jen kontrolují, jestli drží formát (spec §4).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DATA, vsechnyTahaky, tydenniTahaky, odemceneTahaky, stavVyzvy, celeTydny, pocetVMesici, datumVPraze,
  konecVyzvy, obdobiVyzvy, noveTahaky, najdiTahak, jeBonus, ODEMCENI_BONUSU, sezonaZamcena,
} from '../web/js/tahaky.js';

const blok = { nadpis: 'Pravidlo', text: 'Text.', priklad: '$1+1=2$' };
const T = (predmet, faze, tyden) => ({ id: `t:${predmet}:${faze}:${tyden}`, predmet, faze, tyden, nazev: `${predmet} ${faze} ${tyden}`, podnazev: 'x', bloky: [blok, blok, blok] });
const VZOREK = {
  matematika: [T('matematika', 'faze1', 1), T('matematika', 'pilot', 1), T('matematika', 'faze2', 1)],
  cestina: [T('cestina', 'pilot', 1)],
  vyzvy: [
    { mesic: '2026-11', cil: 3, nazev: 'Listopadová výzva' },
    { mesic: '2026-12', cil: 2, nazev: 'Prosincová výzva' },
    { mesic: '2027-04', cil: 2, nazev: 'Dubnová výzva' },
  ],
  bonus: [
    { id: 'b:2026-12', mesic: '2026-12', nazev: 'Chyby v češtině', podnazev: 'Bonus', bloky: [blok] },
    { id: 'b:2026-11', mesic: '2026-11', nazev: 'Chyby v matematice', podnazev: 'Bonus', bloky: [blok] },
    { id: 'b:2027-04', mesic: '2027-04', nazev: 'Den D', podnazev: 'Bonus', bloky: [blok] },
  ],
};
const data = VZOREK;

/** Katalog: pilot matematiky P1–P4, F1 týden 0 (diagnostika) + týden 1 (L1–L4), pilot češtiny CJ-P1–P2. */
function katalog(hotove = {}) {
  const l = [
    ...['P1', 'P2', 'P3', 'P4'].map((id) => ({ id, faze: 'pilot', tyden: 1 })),
    { id: 'F1-T00-DIAG', faze: 'faze1', tyden: 0 },
    ...[1, 2, 3, 4].map((n) => ({ id: `F1-T01-L${n}`, faze: 'faze1', tyden: 1, predmet: 'matematika' })),
    { id: 'CJ-P1', faze: 'pilot', tyden: 1, predmet: 'cestina' }, { id: 'CJ-P2', faze: 'pilot', tyden: 1, predmet: 'cestina' },
  ];
  return l.map((x) => ({ ...x, dokoncene: hotove[x.id] ? { konec: hotove[x.id] } : null }));
}
const vse = (ids, konec) => Object.fromEntries(ids.map((id) => [id, konec]));
const RIJEN = '2026-10-10T16:00:00Z';

test('pořadí sbírky: matematika (pilot, F1, F2), čeština, bonusy podle měsíce; najdiTahak, jeBonus', () => {
  assert.deepEqual(vsechnyTahaky({ data }).map((t) => t.id), [
    't:matematika:pilot:1', 't:matematika:faze1:1', 't:matematika:faze2:1', 't:cestina:pilot:1', 'b:2026-11', 'b:2026-12', 'b:2027-04']);
  assert.equal(tydenniTahaky({ data }).length, 4);
  assert.equal(najdiTahak('b:2026-12', { data }).nazev, 'Chyby v češtině');
  assert.equal(najdiTahak('neni', { data }), null);
  assert.ok(jeBonus({ id: 'b:2026-11' }) && !jeBonus({ id: 't:cestina:pilot:1' }));
});

test('odemčení týdne: všechny lekce týdne hotové (barvy nehrají roli), předměty zvlášť', () => {
  const nic = odemceneTahaky(katalog(), { ted: RIJEN, data });
  assert.equal(nic.size, 0);
  const pilot = odemceneTahaky(katalog(vse(['P1', 'P2', 'P3', 'P4'], RIJEN)), { ted: RIJEN, data });
  assert.deepEqual([...pilot], ['t:matematika:pilot:1'], 'pilot matematiky (lekce bez sloupce predmet = matematika)');
  const tri = odemceneTahaky(katalog(vse(['F1-T01-L1', 'F1-T01-L2', 'F1-T01-L3'], RIJEN)), { ted: RIJEN, data });
  assert.equal(tri.size, 0, '3 ze 4 lekcí nestačí');
  const cj = odemceneTahaky(katalog(vse(['CJ-P1', 'CJ-P2'], RIJEN)), { ted: RIJEN, data });
  assert.deepEqual([...cj], ['t:cestina:pilot:1']);
});

test('právě dokončená lekce (navic) dokončí týden', () => {
  const k = katalog(vse(['F1-T01-L1', 'F1-T01-L2', 'F1-T01-L3'], RIJEN));
  assert.ok(odemceneTahaky(k, { ted: RIJEN, navic: { id: 'F1-T01-L4', konec: RIJEN }, data }).has('t:matematika:faze1:1'));
});

test('týden 0 (diagnostika) tahák nemá; týden s jednou lekcí se nepočítá', () => {
  const k = katalog(vse(['F1-T00-DIAG'], RIJEN));
  assert.equal(celeTydny(k).size, 0);
  const data0 = { ...data, matematika: [...data.matematika, T('matematika', 'faze1', 0)] };
  assert.equal(odemceneTahaky(k, { ted: RIJEN, data: data0 }).size, 0);
  // i kdyby týden 0 měl dvě lekce, tahák nemá
  const dve = [{ id: 'D1', faze: 'faze1', tyden: 0, dokoncene: { konec: RIJEN } }, { id: 'D2', faze: 'faze1', tyden: 0, dokoncene: { konec: RIJEN } }];
  assert.equal(celeTydny(dve).size, 0);
});

test('hranice měsíců v Praze: 31. 10. 23:30 UTC je 1. 11. (zima, UTC+1), 30. 11. 22:59 UTC ještě listopad', () => {
  assert.equal(datumVPraze('2026-10-31T23:30:00Z'), '2026-11-01');
  assert.equal(datumVPraze('2026-10-31T22:30:00Z'), '2026-10-31');
  assert.equal(datumVPraze('2026-11-30T22:59:00Z'), '2026-11-30');
  assert.equal(datumVPraze('2026-11-30T23:00:00Z'), '2026-12-01');
  const k = katalog({ P1: '2026-10-31T23:30:00Z', P2: '2026-10-31T22:30:00Z', P3: '2026-11-30T22:59:00Z', P4: '2026-11-30T23:00:00Z' });
  assert.equal(pocetVMesici(k, '2026-11'), 2, 'P1 a P3 v listopadu, P2 v říjnu, P4 v prosinci');
  assert.equal(pocetVMesici(k, '2026-12'), 1);
});

test('stav výzvy: počet, zbývající dny včetně dneška, splnění, odměna; oba předměty se sčítají', () => {
  const ted = '2026-11-22T10:00:00+01:00';
  const k = katalog({ P1: '2026-11-02T18:00:00+01:00', 'CJ-P1': '2026-11-03T18:00:00+01:00', P2: '2026-10-30T18:00:00+01:00' });
  const s = stavVyzvy(k, ted, { data });
  assert.deepEqual({ ...s, odmena: s.odmena.id }, {
    mesic: '2026-11', nazev: 'Listopadová výzva', cil: 3, hotovo: 2, zbyvaDni: 9, splneno: false, odmena: 'b:2026-11', konec: '2026-11-30' });
  assert.equal(odemceneTahaky(k, { ted, data }).has('b:2026-11'), false);
  // třetí lekce (i právě dokončená) výzvu splní a odemkne zlatý tahák
  const s2 = stavVyzvy(k, ted, { navic: { id: 'F1-T01-L1', konec: '2026-11-22T10:00:00+01:00' }, data });
  assert.equal(s2.hotovo, 3);
  assert.equal(s2.splneno, true);
  const k3 = katalog({ P1: '2026-11-02T18:00:00+01:00', 'CJ-P1': '2026-11-03T18:00:00+01:00', P3: '2026-11-20T18:00:00+01:00' });
  assert.ok(odemceneTahaky(k3, { ted, data }).has('b:2026-11'));
  assert.ok(odemceneTahaky(k3, { ted: '2027-02-01T10:00:00+01:00', data }).has('b:2026-11'), 'splněná výzva zůstává odemčená i po konci měsíce');
  assert.equal(stavVyzvy(k, '2026-11-30T23:30:00+01:00', { data }).zbyvaDni, 1, 'poslední den');
});

test('opakování lekce: počítá se v každém měsíci, kdy byla dokončena (ODPOVED 8. 10., bod 4)', () => {
  const k = katalog({ P1: '2026-11-05T18:00:00+01:00' });
  // právě dokončené opakování v prosinci: prosinec ano, listopad zůstává
  assert.equal(pocetVMesici(k, '2026-12', { navic: { id: 'P1', konec: '2026-12-02T18:00:00+01:00' } }), 1);
  assert.equal(pocetVMesici(k, '2026-11', { navic: { id: 'P1', konec: '2026-12-02T18:00:00+01:00' } }), 1);
  // z databáze: poslední dokončení v prosinci, dřívější v listopadu (dokonceniVse z lekceProDite)
  const z = k.map((l) => (l.id === 'P1' ? { ...l, dokoncene: { konec: '2026-12-02T18:00:00+01:00' }, dokonceniVse: ['2026-12-02T18:00:00+01:00', '2026-11-05T18:00:00+01:00'] } : l));
  assert.equal(pocetVMesici(z, '2026-11'), 1, 'listopadové dokončení se nezapomene');
  assert.equal(pocetVMesici(z, '2026-12'), 1);
  assert.equal(pocetVMesici(z, '2027-01'), 0);
});

test('mimo období výzev null; před 1. 11. se výzva nezobrazuje; duben končí 11. 4.', () => {
  assert.equal(stavVyzvy(katalog(), '2026-10-31T22:30:00Z', { data }), null, '31. 10. 23:30 v Praze');
  assert.ok(stavVyzvy(katalog(), '2026-10-31T23:30:00Z', { data }), '1. 11. 0:30 v Praze');
  assert.equal(stavVyzvy(katalog(), '2027-01-15T10:00:00Z', { data }), null, 'měsíc bez výzvy ve vzorku');
  assert.equal(konecVyzvy({ mesic: '2027-04' }), '2027-04-11');
  assert.equal(konecVyzvy({ mesic: '2027-02' }), '2027-02-28');
  assert.equal(konecVyzvy({ mesic: '2026-11', do: '2026-11-20' }), '2026-11-20');
  assert.equal(stavVyzvy(katalog(), '2027-04-11T20:00:00+02:00', { data }).zbyvaDni, 1);
  assert.equal(stavVyzvy(katalog(), '2027-04-12T08:00:00+02:00', { data }), null);
  // lekce po 11. 4. se do dubnové výzvy nepočítá
  const k = katalog({ P1: '2027-04-05T18:00:00+02:00', P2: '2027-04-12T18:00:00+02:00' });
  assert.equal(pocetVMesici(k, '2027-04', { konec: '2027-04-11' }), 1);
});

test('bonusy: 1. 4. 2027 (Praha) se odemknou všem; období výzvy pro text zámku', () => {
  assert.equal(ODEMCENI_BONUSU, '2027-04-01');
  const bonusy = (ted) => [...odemceneTahaky(katalog(), { ted, data })].filter((id) => id.startsWith('b:'));
  assert.deepEqual(bonusy('2027-03-31T21:59:00Z'), [], '31. 3. 23:59 v Praze (letní čas)');
  assert.deepEqual(bonusy('2027-03-31T22:00:00Z').sort(), ['b:2026-11', 'b:2026-12', 'b:2027-04'], '1. 4. 0:00 v Praze');
  const b11 = data.bonus.find((b) => b.id === 'b:2026-11');
  assert.equal(obdobiVyzvy(b11, '2026-10-20T10:00:00Z', { data }), 'budouci');
  assert.equal(obdobiVyzvy(b11, '2026-11-20T10:00:00Z', { data }), 'bezi');
  assert.equal(obdobiVyzvy(b11, '2026-12-01T10:00:00Z', { data }), 'skoncila');
});

test('nové taháky proti viděným (v pořadí sbírky)', () => {
  const odemcene = new Set(['b:2026-11', 't:cestina:pilot:1', 't:matematika:pilot:1']);
  assert.deepEqual(noveTahaky(odemcene, ['t:matematika:pilot:1'], { data }), ['t:cestina:pilot:1', 'b:2026-11']);
  assert.deepEqual(noveTahaky(odemcene, null, { data }), ['t:matematika:pilot:1', 't:cestina:pilot:1', 'b:2026-11']);
});

// ---------------------------------------------------------------------------------------------
// Obsahové moduly (píšou je autoři obsahu): kontrola formátu ze spec §4. Chybějící modul = prázdné pole.
// ---------------------------------------------------------------------------------------------
test('obsah taháků drží formát (spec §4)', () => {
  const ids = new Set();
  for (const t of [...DATA.matematika, ...DATA.cestina]) {
    assert.match(t.id, /^t:(matematika|cestina):(pilot|faze1|faze2):\d+$/, `id ${t.id}`);
    assert.equal(t.id, `t:${t.predmet}:${t.faze}:${t.tyden}`, `${t.id}: id odpovídá predmet/faze/tyden`);
    assert.notEqual(Number(t.tyden), 0, `${t.id}: týden 0 tahák nemá`);
  }
  for (const t of DATA.matematika) assert.equal(t.predmet, 'matematika', t.id);
  for (const t of DATA.cestina) assert.equal(t.predmet, 'cestina', t.id);
  for (const t of DATA.bonus) {
    assert.match(t.id, /^b:\d{4}-\d{2}$/, `id ${t.id}`);
    assert.equal(t.id, `b:${t.mesic}`, `${t.id}: id odpovídá měsíci`);
    assert.ok(DATA.vyzvy.some((v) => v.mesic === t.mesic), `${t.id}: k bonusu existuje výzva`);
  }
  for (const t of [...DATA.matematika, ...DATA.cestina, ...DATA.bonus]) {
    assert.ok(!ids.has(t.id), `duplicitní id ${t.id}`);
    ids.add(t.id);
    assert.ok(typeof t.nazev === 'string' && t.nazev.trim(), `${t.id}: nazev`);
    assert.ok(typeof t.podnazev === 'string' && t.podnazev.trim(), `${t.id}: podnazev`);
    assert.ok(Array.isArray(t.bloky) && t.bloky.length >= 1, `${t.id}: bloky`);
    if (!jeBonus(t)) assert.ok(t.bloky.length >= 3 && t.bloky.length <= 6, `${t.id}: 3–6 bloků (má ${t.bloky.length})`);
    for (const b of t.bloky) {
      assert.ok(typeof b.nadpis === 'string' && b.nadpis.trim(), `${t.id}: blok bez nadpisu`);
      assert.ok(typeof b.text === 'string' && b.text.trim(), `${t.id} / ${b.nadpis}: text`);
      if (b.priklad !== undefined) assert.equal(typeof b.priklad, 'string', `${t.id} / ${b.nadpis}: priklad`);
      // $…$ párově (jinak KaTeX vykreslí dolary jako text)
      for (const pole of ['text', 'priklad']) {
        const s = String(b[pole] ?? '').replace(/\\\$/g, '').replace(/\$\$[\s\S]+?\$\$/g, '');
        assert.equal((s.match(/\$/g) || []).length % 2, 0, `${t.id} / ${b.nadpis}: lichý počet $ v ${pole}`);
      }
    }
  }
  const mesice = DATA.vyzvy.map((v) => v.mesic);
  assert.equal(new Set(mesice).size, mesice.length, 'výzva pro každý měsíc jen jednou');
  for (const v of DATA.vyzvy) {
    assert.match(v.mesic, /^\d{4}-\d{2}$/);
    assert.ok(Number(v.cil) > 0 && typeof v.nazev === 'string' && v.nazev.trim(), `výzva ${v.mesic}`);
  }
});

test('rodina bez zaplacené sezóny: žádné zlaté taháky ani 1. 4. (ODPOVED 8. 10., bod 3)', () => {
  const k = katalog(vse(['P1', 'P2', 'P3', 'P4'], '2026-11-03T16:00:00Z'))
    .map((l) => (l.faze === 'faze1' ? { ...l, zamceno: 'platba' } : l));
  assert.equal(sezonaZamcena(k), true);
  assert.equal(sezonaZamcena(katalog()), false);
  const o = odemceneTahaky(k, { ted: '2027-04-02T10:00:00Z', data });
  assert.ok(o.has('t:matematika:pilot:1'), 'týdenní tahák pilotu ano');
  assert.ok(![...o].some(jeBonus), 'bonusy ne');
  assert.ok(odemceneTahaky(katalog(), { ted: '2027-04-02T10:00:00Z', data }).has('b:2026-11'), 'se sezónou bonusy 1. 4. ano');
});
