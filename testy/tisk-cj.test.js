// Tisk češtiny (web/js/tisk-cj.js, ZADANI-CJ §8.2): dítě na papíře nikdy neuvidí text diktátu ani přepis poslechu.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizuj, tajneVety, zadaniCj } from '../web/js/tisk-cj.js';

const diktat = { typ: 'diktat', vety: [{ audio: 'a.mp3', text: 'Mezi domy rostly vysoké stromy.' }, { audio: 'b.mp3', text: 'Babička nesla koš.' }] };
const poslech = { typ: 'poslech', audio: 'c.mp3', prepis: 'Táta včera koupil nové kolo. Byl rád.', vnoreny_vstup: { typ: 'dlazdice', moznosti: [] } };

test('normalizuj: bez velikosti písmen a interpunkce, diakritika zůstává', () => {
  assert.equal(normalizuj('  Mezi domy, rostly — STROMY! '), 'mezi domy rostly stromy');
  assert.notEqual(normalizuj('byli'), normalizuj('býlí'));
});

test('tajneVety: věty diktátu a přepisu (aspoň 3 slova)', () => {
  const u = { kroky: [{ vstup: diktat }, { vstup: poslech }] };
  assert.deepEqual(tajneVety(u), ['mezi domy rostly vysoké stromy', 'babička nesla koš', 'táta včera koupil nové kolo']);
});

test('zadaniCj: odstavec s větou diktátu nebo přepisu se na list dítěte nedostane', () => {
  const puvodni = console.warn;
  console.warn = () => {};
  try {
    const u = { id: 'x', kroky: [{ vstup: diktat }], tisk: { zadani: 'Poslouchej a piš.\n\nMezi domy rostly vysoké stromy.' } };
    assert.equal(zadaniCj(u), 'Poslouchej a piš.');
    const p = { id: 'y', kroky: [{ vstup: poslech }], tisk: { zadani: 'Poslouchej.\n\nZakroužkuj: a) táta b) koupil c) kolo' } };
    assert.equal(zadaniCj(p), p.tisk.zadani, 'jednotlivá slova z nahrávky v nabídce smí zůstat');
  } finally { console.warn = puvodni; }
});

test('zadaniCj: samostatné „_“ = značka písmene, „___“ zůstává', () => {
  const z = zadaniCj({ kroky: [], tisk: { zadani: 'Mezi dom_ rostl_ stromy. _hodil. Jde říct on ___' } });
  assert.equal((z.match(//g) || []).length, 3);
  assert.match(z, /on ___$/);
});
