// Slovník chyb češtiny pro web (web/js/typy-chyb-cj.js z cestina/Obsah/TYPY-CHYB.md) a chyby.js (popis + otázka).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TYPY_CHYB_CJ } from '../web/js/typy-chyb-cj.js';
import { popisChyby, otazkaChyby } from '../web/js/chyby.js';
import { nactiTypyChybCj } from '../nastroje/generuj-typy-chyb-cj.mjs';

const koren = join(dirname(fileURLToPath(import.meta.url)), '..');

test('generovaný slovník odpovídá TYPY-CHYB.md (přegenerovat: node nastroje/generuj-hlasky.mjs)', () => {
  const { typy, chyby } = nactiTypyChybCj();
  assert.deepEqual(chyby, []);
  assert.deepEqual(JSON.parse(JSON.stringify(TYPY_CHYB_CJ)), typy);
});

test('rozepsané zápisy: vs-* a „totéž“', () => {
  assert.equal(TYPY_CHYB_CJ['vs-m-i-za-y'].popis.startsWith('Po M napíše i místo y'), true);
  assert.equal(TYPY_CHYB_CJ['vs-m-y-za-i'].popis.startsWith('Po M napíše y místo i'), true);
  assert.equal(TYPY_CHYB_CJ['vs-z-y-za-i'].otazka, TYPY_CHYB_CJ['vs-b-i-za-y'].otazka);
  assert.equal(TYPY_CHYB_CJ['carka-chybi-ktery'].otazka, TYPY_CHYB_CJ['carka-chybi-ze'].otazka);
  for (const [kod, { popis, otazka }] of Object.entries(TYPY_CHYB_CJ)) {
    assert.ok(popis && !/totéž|pozn\.|doplněno|upřesněno|přejmenováno|rozšířeno|kód ponechán/i.test(popis), `${kod}: popis`);
    assert.match(otazka, /^„.*“$/su, `${kod}: otázka je přímá řeč`);
  }
});

test('chyby.js: popis a otázka i pro diktat-pravopis-<kód>; Matematika beze změny', () => {
  assert.equal(otazkaChyby('diktat-pravopis-shoda-y-za-i'), TYPY_CHYB_CJ['shoda-y-za-i'].otazka);
  assert.match(popisChyby('diktat-pravopis-shoda-y-za-i'), /^Pravopis: /);
  assert.equal(popisChyby('sd-sloveso-za-podstatne'), TYPY_CHYB_CJ['sd-sloveso-za-podstatne'].popis);
  assert.equal(popisChyby('scital-pred-nasobenim'), 'Sčítal/odčítal dřív, než násobil/dělil');
  assert.equal(otazkaChyby('scital-pred-nasobenim'), null);
  assert.equal(popisChyby('neznamy-kod'), 'neznamy-kod');
  assert.equal(otazkaChyby(null), null);
});

test('každý kód chyby v lekcích češtiny má ve slovníku popis i otázku', () => {
  const slozka = join(koren, 'obsah', 'cestina', 'lekce');
  const kody = new Set();
  const sber = (x) => {
    if (Array.isArray(x)) x.forEach(sber);
    else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) (k === 'typ_chyby' && typeof v === 'string' ? kody.add(v) : sber(v));
  };
  for (const f of readdirSync(slozka).filter((x) => x.endsWith('.json'))) sber(JSON.parse(readFileSync(join(slozka, f), 'utf8')).ulohy);
  for (const kod of kody) {
    assert.notEqual(popisChyby(kod), kod, `${kod}: chybí popis`);
    assert.ok(otazkaChyby(kod), `${kod}: chybí otázka`);
  }
});
