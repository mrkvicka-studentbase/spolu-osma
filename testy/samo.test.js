// Testy lekce bez rodiče (R64, fáze A). Spuštění: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzeSamo, volbaSamo, napovedaZOtazky, dveSamoZaSebou, napovedyAzPoPokusu, MAX_NAPOVED } from '../web/js/samo.js';
import { readFileSync, readdirSync } from 'node:fs';
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
  assert.equal(lzeSamo({ predmet: 'cestina', ulohy: [u('dlazdice'), u('poslech'), u('diktat')] }), true, 'Spolu 8: čeština i s poslechem a diktátem');
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

test('Spolu 8: nápovědy kontrolní / samostatné úlohy až po prvním pokusu', () => {
  assert.equal(napovedyAzPoPokusu({ typ: 'kontrolni' }), true);
  assert.equal(napovedyAzPoPokusu({ typ: 'semafor' }), true);
  for (const typ of ['rozcvicka', 'nova', 'detektiv', 'cermat']) assert.equal(napovedyAzPoPokusu({ typ }), false);
});

test('Spolu 8: syntetické lekce obou předmětů jdou samo a mají 3 nápovědy u každé úlohy', () => {
  for (const slozka of ['testy/data/osma/lekce', 'testy/data/osma/cestina/lekce']) {
    for (const n of readdirSync(slozka).filter((x) => x.endsWith('.json'))) {
      const l = JSON.parse(readFileSync(`${slozka}/${n}`, 'utf8'));
      if (l.typ === 'diagnostika') { assert.equal(lzeSamo(l), false, n); continue; }
      assert.equal(lzeSamo(l), true, n);
      for (const u of l.ulohy) {
        const otazky = (u.tahak?.otazky || []).map(napovedaZOtazky);
        assert.equal(otazky.filter((o) => o.text && !/^[„"]/.test(o.text)).length, 3, `${u.id}: 3 nápovědy bez uvozovek`);
        if (l.predmet === 'cestina' && u.typ === 'rozcvicka') assert.ok(otazky.every((o) => o.k), `${u.id}: otázky rozcvičky po řadách {k, text}`);
      }
    }
  }
});
