// Testy odznaků, „celá správně" a řad (zadání 30. 9., B–C; R60). Spuštění: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jeCelaSpravne, rady, spocitejOdznaky, noveOdznaky, svgOdznaku, ODZNAKY, MAX_PAUZA_RADY_DNU, denVPraze } from '../web/js/odznaky.js';

const DEN = 24 * 3600 * 1000;
const t0 = Date.parse('2026-10-01T18:00:00+02:00');
const iso = (dny) => new Date(t0 + dny * DEN).toISOString();
const zelene = (n = 4) => ({ barvy: Object.fromEntries(Array.from({ length: n }, (_, i) => [`U${i + 1}`, 'zelena'])) });

/** Katalog Spolu 8: matematika test M8-T00-DIAG + téma 1 (L1–L4) + téma 2 (L1–L2), čeština téma 1 (l1–l4). */
function katalog(hotove = {}) {
  const l = [
    { id: 'M8-T00-DIAG', predmet: 'matematika', faze: 'osma', tyden: 0 },
    ...[1, 2, 3, 4].map((n) => ({ id: `M8-T01-L${n}`, predmet: 'matematika', faze: 'osma', tyden: 1 })),
    { id: 'M8-T02-L1', predmet: 'matematika', faze: 'osma', tyden: 2 }, { id: 'M8-T02-L2', predmet: 'matematika', faze: 'osma', tyden: 2 },
    ...[1, 2, 3, 4].map((n) => ({ id: `cj-t1-l${n}`, predmet: 'cestina', faze: 'osma', tyden: 1 })),
  ];
  return l.map((x) => ({ ...x, dokoncene: hotove[x.id] || null }));
}

test('celá správně: všechny 4 úlohy zelené; chybí úloha, oranžová, simulace, diagnostika → ne', () => {
  assert.equal(jeCelaSpravne(zelene(4)), true);
  assert.equal(jeCelaSpravne({ ...zelene(3) }), false, 'semafor jen u 3 ze 4 úloh (lekce ukončená dřív)');
  assert.equal(jeCelaSpravne({ barvy: { U1: 'zelena', U2: 'oranzova', U3: 'zelena', U4: 'zelena' } }), false);
  assert.equal(jeCelaSpravne({ ...zelene(4), pocetUloh: 5 }), false, 'nový souhrn s počtem úloh');
  assert.equal(jeCelaSpravne({ typ: 'simulace', barvy: zelene(8).barvy }), false);
  assert.equal(jeCelaSpravne({ typ: 'diagnostika' }), false);
  assert.equal(jeCelaSpravne(null), false);
});

test('řady: pauza do 7 dní řadu drží (i víkend), delší ji ukončí; nejlepší se pamatuje', () => {
  assert.deepEqual(rady([]), { nejlepsi: 0, aktualni: 0 });
  assert.deepEqual(rady([iso(0), iso(1), iso(3)]), { nejlepsi: 3, aktualni: 3 });
  assert.deepEqual(rady([iso(0), iso(7)]), { nejlepsi: 2, aktualni: 2 }, 'přesně 7 dní ještě drží');
  assert.deepEqual(rady([iso(0), iso(1), iso(2), iso(10), iso(11)]), { nejlepsi: 3, aktualni: 2 }, 'pauza 8 dní začne novou řadu');
  assert.deepEqual(rady([iso(5), iso(0), iso(2)]), { nejlepsi: 3, aktualni: 3 }, 'pořadí vstupu nehraje roli');
  assert.equal(MAX_PAUZA_RADY_DNU, 7);
});

test('řady v kalendářních dnech Europe/Prague: pondělí večer → další pondělí ráno i večer je v řadě, úterý už ne', () => {
  const poVecer = '2026-11-02T21:30:00+01:00';
  assert.equal(rady([poVecer, '2026-11-09T07:00:00+01:00']).nejlepsi, 2, 'další pondělí ráno');
  assert.equal(rady([poVecer, '2026-11-09T22:30:00+01:00']).nejlepsi, 2, 'další pondělí večer (víc než 168 h)');
  assert.equal(rady([poVecer, '2026-11-10T07:00:00+01:00']).nejlepsi, 1, 'úterý = 8 dní');
  // přelom dne v Praze: 23:30 UTC 2. 11. je v Praze už 3. 11.
  assert.equal(denVPraze('2026-11-02T23:30:00Z') - denVPraze('2026-11-02T22:30:00Z'), 1);
  // změna času 25. 10. 2026 (letní → zimní) a 28. 3. 2027: dny se počítají správně
  assert.equal(denVPraze('2026-10-26T00:30:00+01:00') - denVPraze('2026-10-24T23:30:00+02:00'), 2);
  assert.equal(denVPraze('2027-03-29T00:30:00+02:00') - denVPraze('2027-03-27T23:30:00+01:00'), 2);
  assert.equal(rady(['2026-10-20T20:00:00+02:00', '2026-10-27T20:00:00+01:00']).nejlepsi, 2, 'přes změnu času 7 dní');
});

test('odznaky: první lekce, řada 3, celé téma (4 lekce jednoho tématu a předmětu)', () => {
  const k = katalog({ 'M8-T01-L1': { konec: iso(0), souhrn: zelene() }, 'M8-T01-L2': { konec: iso(1) }, 'M8-T01-L3': { konec: iso(2) }, 'M8-T01-L4': { konec: iso(10) } }); // L3 → L4 pauza 8 dní
  const s = spocitejOdznaky(k);
  assert.deepEqual([...s.ziskane].sort(), ['prvni', 'rada3', 'spravne', 'tyden'].sort());
  assert.equal(s.pocetHotovych, 4);
  assert.equal(s.rada.nejlepsi, 3);
  assert.deepEqual([...s.celaSpravne], ['M8-T01-L1']);
});

test('odznaky: téma 1 matematiky a češtiny se nesčítají (klíč předmět + téma)', () => {
  const k = katalog({ 'M8-T01-L1': { konec: iso(0) }, 'M8-T01-L2': { konec: iso(1) }, 'cj-t1-l1': { konec: iso(2) }, 'cj-t1-l2': { konec: iso(3) } });
  const s = spocitejOdznaky(k);
  assert.ok(!s.ziskane.has('tyden'));
});

test('odznaky: úvodní test sám téma nesplní, dá odznak „Úvodní test“; celý předmět jen se všemi lekcemi', () => {
  const s = spocitejOdznaky(katalog({ 'M8-T00-DIAG': { konec: iso(0), souhrn: { typ: 'diagnostika' } } }));
  assert.deepEqual([...s.ziskane].sort(), ['prvni', 'test']);
  const cj = Object.fromEntries([1, 2, 3, 4].map((n, i) => [`cj-t1-l${n}`, { konec: iso(i) }]));
  const s2 = spocitejOdznaky(katalog(cj));
  assert.ok(s2.ziskane.has('predmet') && s2.ziskane.has('tyden') && s2.ziskane.has('rada3'), 'čeština v katalogu = 4 lekce, všechny hotové');
  const mat = Object.fromEntries([1, 2, 3, 4].map((n, i) => [`M8-T01-L${n}`, { konec: iso(i) }]));
  assert.ok(!spocitejOdznaky(katalog(mat)).ziskane.has('predmet'), 'matematika má ještě téma 2');
});

test('odznaky: řada 5 a 10, přerušená delší pauzou', () => {
  const ids = ['M8-T00-DIAG', 'M8-T01-L1', 'M8-T01-L2', 'M8-T01-L3', 'M8-T01-L4', 'M8-T02-L1', 'M8-T02-L2', 'cj-t1-l1', 'cj-t1-l2', 'cj-t1-l3'];
  const k = Object.fromEntries(ids.map((id, i) => [id, { konec: iso(i * 2) }]));
  assert.ok(spocitejOdznaky(katalog(k)).ziskane.has('rada10'));
  k['cj-t1-l3'] = { konec: iso(40) }; // poslední až po dlouhé pauze
  const s = spocitejOdznaky(katalog(k));
  assert.ok(s.ziskane.has('rada5') && !s.ziskane.has('rada10'));
});

test('právě dokončená lekce (žák na „Hotovo") se počítá do dokončení a řad, ne do „celá správně"', () => {
  const k = katalog({ 'M8-T01-L1': { konec: iso(0) }, 'M8-T01-L2': { konec: iso(1) } });
  const s = spocitejOdznaky(k, { navic: { id: 'M8-T01-L3', konec: iso(2) } });
  assert.ok(s.ziskane.has('rada3') && !s.ziskane.has('spravne'));
  assert.equal(s.pocetHotovych, 3);
});

test('nové odznaky proti už ukázaným; SVG existuje pro všech 8', () => {
  assert.deepEqual(noveOdznaky(new Set(['prvni', 'rada3']), ['prvni']), ['rada3']);
  assert.deepEqual(noveOdznaky(new Set(['prvni']), null), ['prvni']);
  assert.equal(ODZNAKY.length, 8);
  assert.ok(ODZNAKY.filter((o) => o.barva === 'zelena' || ['test', 'predmet'].includes(o.id)).length >= 4, 'aspoň polovina za vytrvalost');
  for (const o of ODZNAKY) assert.match(svgOdznaku(o.id), /^<svg viewBox="0 0 72 72"[^]*<\/svg>$/);
  assert.match(svgOdznaku('prvni', { titulek: 'První "lekce"' }), /aria-label="První &quot;lekce&quot;"/);
});
