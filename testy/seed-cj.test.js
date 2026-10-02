// Seed češtiny: datum otevření fáze zaklady (supabase/seed/otevreni-cj.mjs) a pojistky v seed-lekce.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsujDatum, pulnocVPraze, denOtevreniZaklady, otevritOdZaklady } from '../supabase/seed/otevreni-cj.mjs';


test('parsujDatum: jen platné RRRR-MM-DD', () => {
  assert.equal(parsujDatum('2026-10-05').toISOString(), '2026-10-05T00:00:00.000Z');
  for (const spatne of ['2026-02-30', '2026-13-01', '5. 10. 2026', '2026-10-5', '', undefined, null]) {
    assert.equal(parsujDatum(spatne), null, String(spatne));
  }
});

test('půlnoc v Praze: letní a zimní čas i den změny času', () => {
  assert.equal(pulnocVPraze(parsujDatum('2026-10-05')), '2026-10-05T00:00:00+02:00');
  assert.equal(pulnocVPraze(parsujDatum('2026-12-07')), '2026-12-07T00:00:00+01:00');
  assert.equal(pulnocVPraze(parsujDatum('2026-10-25')), '2026-10-25T00:00:00+02:00'); // změna ve 3:00
  assert.equal(pulnocVPraze(parsujDatum('2026-10-26')), '2026-10-26T00:00:00+01:00');
  assert.equal(pulnocVPraze(parsujDatum('2027-03-28')), '2027-03-28T00:00:00+01:00'); // změna ve 2:00
  assert.equal(pulnocVPraze(parsujDatum('2027-03-29')), '2027-03-29T00:00:00+02:00');
});

test('týden 1 v den spuštění, další týdny v pondělí (KONTROLA-2026-09-30 §C3)', () => {
  const den = (t, s) => denOtevreniZaklady(t, parsujDatum(s)).toISOString().slice(0, 10);
  // spuštění ve čtvrtek 1. 10. → týden 2 v pondělí 5. 10.
  assert.deepEqual([1, 2, 3, 8].map((t) => den(t, '2026-10-01')), ['2026-10-01', '2026-10-05', '2026-10-12', '2026-11-16']);
  // spuštění v pondělí → týden 2 až další pondělí
  assert.deepEqual([1, 2].map((t) => den(t, '2026-10-05')), ['2026-10-05', '2026-10-12']);
  // spuštění v neděli → týden 2 hned zítra
  assert.deepEqual([1, 2].map((t) => den(t, '2026-10-04')), ['2026-10-04', '2026-10-05']);
  // všechny další týdny jsou pondělí
  for (let t = 2; t <= 8; t++) assert.equal(denOtevreniZaklady(t, parsujDatum('2026-10-01')).getUTCDay(), 1);
  // přes změnu času zůstává půlnoc
  assert.equal(otevritOdZaklady(5, parsujDatum('2026-10-01')), '2026-10-26T00:00:00+01:00');
  assert.throws(() => denOtevreniZaklady(0, parsujDatum('2026-10-01')));
  assert.throws(() => denOtevreniZaklady(1, null));
});

// Seed proti falešnému PostgRESTu (zápis, predmet, otevrit_od, verejna) pro Spolu 8: testy/osma-validator.test.js.
// Testy fáze zaklady se Spolu lekcemi (obsah/cestina/lekce) byly odstraněny: Spolu 8 v obsah/ fázi zaklady nemá.
