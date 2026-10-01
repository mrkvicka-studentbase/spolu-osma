// =====================================================================
// predmet.test.js — dva předměty v přehledu (web/js/predmet.js, ZADANI-CESTINA §8.2)
// Spustit: npm test
//
// Pokrývá: předmět lekce bez pole predmet (katalog před migrací 0007 = matematika), předměty dítěte bez sloupce
// predmety, volbu záložky (URL → localStorage → první aktivní, jen z aktivních), předmět podle id lekce (historie/SOS).
// =====================================================================

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  predmetLekce, predmetyDitete, maSloupecPredmety, zvolPredmet, predmetZId, ulozenyPredmet, ulozPredmet,
} from '../web/js/predmet.js';

describe('predmet.js', () => {
  test('předmět lekce: bez pole predmet (před migrací) = matematika', () => {
    assert.equal(predmetLekce({ id: 'P1', faze: 'pilot' }), 'matematika');
    assert.equal(predmetLekce({ id: 'F1-T01-L1', predmet: null }), 'matematika');
    assert.equal(predmetLekce({ id: 'F1-T01-L1', predmet: 'matematika' }), 'matematika');
    assert.equal(predmetLekce({ id: 'cj-t1-l1', predmet: 'cestina' }), 'cestina');
    assert.equal(predmetLekce({ predmet: 'dejepis' }), 'matematika');
    assert.equal(predmetLekce(null), 'matematika');
  });

  test('předmět podle id lekce (historie sezení): cj-… = čeština', () => {
    assert.equal(predmetZId('cj-t1-l1'), 'cestina');
    assert.equal(predmetZId('P1'), 'matematika');
    assert.equal(predmetZId('F2-T03-L2'), 'matematika');
    assert.equal(predmetZId(null), 'matematika');
  });

  test('předměty dítěte: bez sloupce / prázdné = jen matematika, pořadí záložek pevné', () => {
    assert.deepEqual(predmetyDitete({ id: 'd1' }), ['matematika']);
    assert.deepEqual(predmetyDitete({ predmety: [] }), ['matematika']);
    assert.deepEqual(predmetyDitete({ predmety: ['cestina'] }), ['cestina']);
    assert.deepEqual(predmetyDitete({ predmety: ['cestina', 'matematika'] }), ['matematika', 'cestina']);
    assert.equal(maSloupecPredmety({ id: 'd1' }), false);
    assert.equal(maSloupecPredmety({ id: 'd1', predmety: ['matematika'] }), true);
  });

  test('volba záložky: URL vyhraje nad uloženou, jen z aktivních předmětů', () => {
    const oba = ['matematika', 'cestina'];
    assert.equal(zvolPredmet({ url: 'cestina', ulozeny: 'matematika', aktivni: oba }), 'cestina');
    assert.equal(zvolPredmet({ url: 'matematika', ulozeny: 'cestina', aktivni: oba }), 'matematika');
    assert.equal(zvolPredmet({ url: null, ulozeny: 'cestina', aktivni: oba }), 'cestina');
    assert.equal(zvolPredmet({ url: 'nesmysl', ulozeny: null, aktivni: oba }), 'matematika');
    // dítě jen s matematikou: ?predmet=cestina ani uložená čeština nic nezmění
    assert.equal(zvolPredmet({ url: 'cestina', ulozeny: 'cestina', aktivni: ['matematika'] }), 'matematika');
    // rodina jen s češtinou
    assert.equal(zvolPredmet({ url: null, ulozeny: 'matematika', aktivni: ['cestina'] }), 'cestina');
  });

  test('localStorage: bez úložiště (Node) nic nespadne', () => {
    assert.doesNotThrow(() => ulozPredmet('cestina'));
    assert.equal(ulozenyPredmet(), null);
  });
});
