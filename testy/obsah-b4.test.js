// B4 (R29): čisté funkce z web/js/obsah.js — bloky manuálu (H1) a pomůcky lekce (H2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rozdelManual, pomuckyLekce, VYCHOZI_POMUCKY } from '../web/js/obsah.js';

test('rozdelManual: blok s barvou, ikonou a nadpisem z první tučné věty', () => {
  const casti = rozdelManual('::: blok barva=zelena ikona=bublina\n**Otázky.** První ==vždy==.\n:::');
  assert.deepEqual(casti, [{ druh: 'blok', barva: 'zelena', ikona: 'bublina', nadpis: 'Otázky', telo: 'První ==vždy==.' }]);
});

test('rozdelManual: tučný začátek věty → nadpis je celá první věta', () => {
  const [b] = rozdelManual('::: blok barva=semafor ikona=hodiny\n**Zítra** se řiďte barvou:\n\n- Zelená: nová lekce.\n:::');
  assert.equal(b.nadpis, 'Zítra se řiďte barvou');
  assert.equal(b.telo, '- Zelená: nová lekce.');
});

test('rozdelManual: text mimo bloky, neznámá barva, neuzavřený blok', () => {
  const casti = rozdelManual('Úvod.\n\n::: blok barva=fialova\nText bez nadpisu\n:::\nMezi.\n::: blok barva=oranzova ikona=pozor\n**Pozor:** konec');
  assert.equal(casti.length, 4);
  assert.deepEqual(casti[0], { druh: 'md', text: 'Úvod.' });
  assert.equal(casti[1].barva, 'zelena');
  assert.equal(casti[1].nadpis, null);
  assert.deepEqual(casti[2], { druh: 'md', text: 'Mezi.' });
  assert.equal(casti[3].nadpis, 'Pozor');
  assert.equal(casti[3].telo, 'konec');
});

test('pomuckyLekce: výchozí trojice, vlastní seznam, prázdné položky pryč', () => {
  assert.deepEqual(pomuckyLekce({}), [...VYCHOZI_POMUCKY]);
  assert.deepEqual(pomuckyLekce({ pomucky: [] }), [...VYCHOZI_POMUCKY]);
  assert.deepEqual(pomuckyLekce({ pomucky: ['sešit', ' ', 'kružítko'] }), ['sešit', 'kružítko']);
});
