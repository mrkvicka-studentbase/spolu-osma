// Testy lekce bez rodiče (R64, fáze A). Spuštění: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzeSamo, volbaSamo, napovedaZOtazky, dveSamoZaSebou, MAX_NAPOVED } from '../web/js/samo.js';
import { barvaSemaforu } from '../web/js/vyhodnoceni.js';

test('volba semaforu z průběhu podle klíče R34 a barva maticí kostry 02', () => {
  assert.equal(volbaSamo({ spravne: true, napovedy: 0 }), 'sam');
  assert.equal(volbaSamo({ spravne: true, napovedy: 2 }), 's_otazkou');
  assert.equal(volbaSamo({ spravne: false, napovedy: 1 }), 'chyba_pocty');
  assert.equal(volbaSamo({ spravne: false, napovedy: MAX_NAPOVED }), 'nevedel');
  assert.equal(volbaSamo({ spravne: null, napovedy: 0 }), 'chyba_pocty', 'neodevzdáno = špatně');
  assert.equal(barvaSemaforu(volbaSamo({ spravne: true, napovedy: 0 }), true).barva, 'zelena');
  assert.equal(barvaSemaforu(volbaSamo({ spravne: true, napovedy: 1 }), true).barva, 'zelena');
  assert.equal(barvaSemaforu(volbaSamo({ spravne: false, napovedy: 0 }), false).barva, 'oranzova');
  assert.equal(barvaSemaforu(volbaSamo({ spravne: false, napovedy: 3 }), false).barva, 'cervena');
});

test('samo jen u běžné lekce bez rýsování a volného textu', () => {
  const u = (typ) => ({ kroky: [{ vstup: { typ } }] });
  assert.equal(lzeSamo({ typ: 'bezna', ulohy: [u('cislo'), u('dlazdice')] }), true);
  assert.equal(lzeSamo({ ulohy: [u('vyraz')] }), true, 'bez typu = běžná');
  assert.equal(lzeSamo({ predmet: 'cestina', ulohy: [u('dlazdice')] }), false, 'čeština zatím jen s rodičem (R66)');
  assert.equal(lzeSamo({ typ: 'bezna', ulohy: [u('cislo'), u('rysovani')] }), false);
  assert.equal(lzeSamo({ typ: 'bezna', ulohy: [u('text')] }), false);
  for (const typ of ['blok', 'simulace', 'diagnostika']) assert.equal(lzeSamo({ typ, ulohy: [u('cislo')] }), false);
});

test('nápověda z otázky taháku: bez uvozovek, s příkladem', () => {
  assert.deepEqual(napovedaZOtazky('„Co se počítá jako první?“'), { k: null, text: 'Co se počítá jako první?' });
  assert.deepEqual(napovedaZOtazky({ k: 'B', text: '„Kolikrát se vejde?“' }), { k: 'B', text: 'Kolikrát se vejde?' });
});

test('připomínka rodiči: poslední dvě dokončené lekce bez rodiče', () => {
  const s = (den, rezim) => ({ dokoncene: { konec: `2026-10-0${den}T18:00:00Z`, rezim } });
  assert.equal(dveSamoZaSebou([s(1, 'app'), s(2, 'samo'), s(3, 'samo')]), true);
  assert.equal(dveSamoZaSebou([s(1, 'samo'), s(2, 'app'), s(3, 'samo')]), false);
  assert.equal(dveSamoZaSebou([s(1, 'samo')]), false);
  assert.equal(dveSamoZaSebou([s(3, 'app'), s(1, 'samo'), s(2, 'samo')]), false, 'rozhoduje čas dokončení');
});
