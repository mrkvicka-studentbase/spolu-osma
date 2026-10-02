// =====================================================================
// doporuceni.test.js — Spolu 8: úvodní test → témata → doporučené pořadí (web/js/doporuceni.js)
// Spustit: npm test. Data: testy/data/osma/ (syntetické lekce).
// =====================================================================
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  vysledekPoTematech, doporucenePoradiTemat, sestavSouhrnOsma, jeSouhrnOsma, mapaKapitolNaTemata, temataUlohy,
  seradLekce, planLekci, dalsiDoporucenaLekce, cislaTemat, jeDiagnostikaOsma,
} from '../web/js/doporuceni.js';
import { nazevTematu, pocetUlohLekce, zeZ } from '../web/js/temata.js';

const nacti = (p) => JSON.parse(readFileSync(`testy/data/osma/${p}`, 'utf8'));
const DIAG = nacti('lekce/M8-T00-DIAG.json');
const DIAG_CJ = nacti('cestina/lekce/cj-t0-diag.json');

/** Odpovědi: pro každou úlohu final se správností podle funkce (true / false / undefined = neodevzdáno). */
function odpovedi(lekce, spravne) {
  let id = 1;
  return lekce.ulohy.flatMap((u, i) => {
    const s = spravne(u, i);
    if (s === undefined) return [];
    return [{ id: id++, uloha_id: u.id, krok_id: 'final', spravne: s, typ_chyby: s ? null : 'scital-pred-nasobenim', pokus: 1 }];
  });
}

/** Katalog: témata 1–10, 4 lekce v každém. */
const katalog = (predmet = 'matematika', stavy = {}) => Array.from({ length: 10 }, (_, i) => i + 1).flatMap((t) =>
  [1, 2, 3, 4].map((n) => ({
    id: predmet === 'cestina' ? `cj-t${t}-l${(t - 1) * 4 + n}` : `M8-T${String(t).padStart(2, '0')}-L${n}`,
    predmet, faze: 'osma', tyden: t, poradi: n, kapitola: t === 2 ? 'zlomky' : 'jednotky',
    stavLekce: 'nezacato', ...(stavy[`${t}-${n}`] || {}),
  })));

describe('výsledek po tématech', () => {
  test('téma z pole tema; stav: silné ≥ 80 %, slabé < 50 %, jinak nejisté; nezjištěno pod polovinou odevzdaných', () => {
    const l = { ulohy: [
      { id: 'a', tema: 1 }, { id: 'b', tema: 1 },
      { id: 'c', tema: 2 }, { id: 'd', tema: 2 },
      { id: 'e', tema: 3 }, { id: 'f', tema: 3 },
      { id: 'g', tema: 4 }, { id: 'h', tema: 4 }, { id: 'i', tema: 4 },
    ] };
    const v = vysledekPoTematech(l, odpovedi(l, (u) => ({ a: true, b: true, c: true, d: false, e: false, f: false, g: true })[u.id]));
    assert.deepEqual(v.map((x) => [x.tema, x.stav]), [[1, 'silne'], [2, 'nejiste'], [3, 'slabe'], [4, 'nezjisteno']]);
  });

  test('čeština: co není silné, je slabé (0–1 ze 2)', () => {
    const l = { predmet: 'cestina', ulohy: [{ id: 'a', tema: 1 }, { id: 'b', tema: 1 }, { id: 'c', tema: 2 }, { id: 'd', tema: 2 }] };
    const v = vysledekPoTematech(l, odpovedi(l, (u) => u.id !== 'b'), new Map(), 'cestina');
    assert.deepEqual(v.map((x) => [x.tema, x.stav]), [[1, 'slabe'], [2, 'silne']]);
  });

  test('bez tema podle kapitoly (všechna témata s kapitolou z katalogu)', () => {
    const mapa = mapaKapitolNaTemata(katalog());
    assert.deepEqual(mapa.get('zlomky'), [2]);
    assert.deepEqual(temataUlohy({ kapitola: 'jednotky' }, mapa), [1, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.deepEqual(temataUlohy({ tema: 5, kapitola: 'zlomky' }, mapa), [5], 'tema má přednost');
  });

  test('poslední pokus rozhoduje; odpověď s spravne null = neodevzdáno', () => {
    const l = { ulohy: [{ id: 'a', tema: 1 }, { id: 'b', tema: 1 }] };
    const o = [
      { id: 1, uloha_id: 'a', krok_id: 'final', spravne: false, pokus: 1 },
      { id: 2, uloha_id: 'a', krok_id: 'final', spravne: true, pokus: 2 },
      { id: 3, uloha_id: 'b', krok_id: 'final', spravne: null, pokus: 1 },
    ];
    const [t] = vysledekPoTematech(l, o);
    assert.deepEqual([t.uloh, t.odevzdano, t.spravne], [2, 1, 1]);
  });
});

describe('doporučené pořadí témat', () => {
  test('bez testu = pořadí osnovy', () => {
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3], []), [1, 2, 3]);
  });

  test('nesilná témata (slabá, nejistá, nezjištěná, bez úloh) v pořadí osnovy, silná až na konec', () => {
    const v = [{ tema: 1, stav: 'silne' }, { tema: 2, stav: 'nejiste' }, { tema: 3, stav: 'slabe' }, { tema: 4, stav: 'silne' }, { tema: 5, stav: 'nezjisteno' }];
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3, 4, 5, 6], v), [2, 3, 5, 6, 1, 4]);
  });

  test('čeština: 7 a více slabých témat = pořadí osnovy', () => {
    const v = [1, 2, 3, 4, 5, 6, 7, 8].map((tema) => ({ tema, stav: tema <= 7 ? 'slabe' : 'silne' }));
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v, { predmet: 'cestina' }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v), [1, 2, 3, 4, 5, 6, 7, 9, 10, 8], 'matematika řadí dál');
    const sest = v.map((x) => (x.tema === 7 ? { ...x, stav: 'silne' } : x));
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3, 4, 5, 6, 7, 8], sest, { predmet: 'cestina' }), [1, 2, 3, 4, 5, 6, 7, 8].filter((t) => t < 7).concat([7, 8]));
  });

  test('všechno silné = osnova; všechno slabé = osnova', () => {
    const vse = (stav) => [1, 2, 3].map((tema) => ({ tema, stav }));
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3], vse('silne')), [1, 2, 3]);
    assert.deepEqual(doporucenePoradiTemat([1, 2, 3], vse('slabe')), [1, 2, 3]);
  });
});

describe('souhrn úvodního testu (syntetická diagnostika)', () => {
  test('matematika: témata 1–2 vedle, zbytek správně → nahoře 1, 2 a 10 (bez úlohy), silná na konci', () => {
    const o = odpovedi(DIAG, (u) => u.tema > 2);
    const s = sestavSouhrnOsma(DIAG, o, { predmet: 'matematika', ted: '2026-10-01T10:00:00Z' });
    assert.ok(jeSouhrnOsma(s));
    assert.equal(s.celkem, DIAG.ulohy.length);
    assert.equal(s.odevzdano, DIAG.ulohy.length);
    assert.deepEqual(s.temata.filter((t) => t.stav !== 'silne').map((t) => t.tema), [1, 2]);
    assert.deepEqual(s.poradi.slice(0, 3), [1, 2, 10], 'téma 10 nemá v syntetické diagnostice úlohu → nezjištěno, ve skupině nahoře');
    assert.deepEqual(s.poradi.slice(3), [3, 4, 5, 6, 7, 8, 9]);
    assert.equal(s.chyby[0].typ_chyby, 'scital-pred-nasobenim');
    assert.ok(s.chyby[0].temata.includes(1));
  });

  test('čeština: cj-t0-diag', () => {
    const o = odpovedi(DIAG_CJ, (u) => u.tema !== 1);
    const s = sestavSouhrnOsma(DIAG_CJ, o, { predmet: 'cestina' });
    assert.equal(s.predmet, 'cestina');
    assert.deepEqual(s.temata.map((t) => [t.tema, t.stav]), [[1, 'slabe'], [2, 'silne']]);
    assert.equal(s.poradi[0], 1);
    assert.equal(s.poradi.at(-1), 2);
  });

  test('nedokončený test: neodevzdaná témata = nezjištěno, celkově nezjištěno', () => {
    const s = sestavSouhrnOsma(DIAG, odpovedi(DIAG, (u, i) => (i < 4 ? true : undefined)));
    assert.equal(s.neuplne, true);
    assert.equal(s.celkove, 'nezjisteno');
    assert.ok(s.temata.filter((t) => t.tema >= 3).every((t) => t.stav === 'nezjisteno'));
  });

  test('starý souhrn Spolu (bez osma) není souhrn Spolu 8', () => {
    assert.equal(jeSouhrnOsma({ typ: 'diagnostika', verze: 1, tydny: [] }), false);
    assert.equal(jeSouhrnOsma(null), false);
  });
});

describe('lekce v doporučeném pořadí', () => {
  test('seřazení: téma podle pořadí, uvnitř L1 → L4', () => {
    const k = katalog().filter((l) => l.tyden <= 3);
    assert.deepEqual(seradLekce(k, [3, 1, 2]).map((l) => `${l.tyden}-${l.poradi}`).slice(0, 5), ['3-1', '3-2', '3-3', '3-4', '1-1']);
  });

  test('„Doporučeno teď“: první nehotová; rozpracovaná má přednost; zamčená se přeskočí', () => {
    const k = katalog('matematika', { '1-1': { stavLekce: 'hotovo' }, '1-2': { zamceno: 'datum' } });
    assert.equal(dalsiDoporucenaLekce(k, [1, 2]).id, 'M8-T01-L3');
    const k2 = katalog('matematika', { '2-3': { stavLekce: 'probiha' } });
    assert.equal(dalsiDoporucenaLekce(k2, [1, 2]).id, 'M8-T02-L3');
    const hotovo = katalog().map((l) => ({ ...l, stavLekce: 'hotovo' }));
    assert.equal(dalsiDoporucenaLekce(hotovo, cislaTemat(hotovo)), null);
  });

  test('silné téma: jen L4 (kontrola tématu), L1–L3 volitelné', () => {
    const k = katalog().filter((l) => l.tyden <= 2);
    const plan = planLekci(k, [2, 1], new Set([1]));
    assert.deepEqual(plan.map((p) => p.lekce.id), ['M8-T02-L1', 'M8-T02-L2', 'M8-T02-L3', 'M8-T02-L4', 'M8-T01-L4']);
    const hotovo2 = k.map((l) => (l.tyden === 2 ? { ...l, stavLekce: 'hotovo' } : l));
    assert.equal(dalsiDoporucenaLekce(hotovo2, [2, 1], new Set([1])).id, 'M8-T01-L4');
  });

  test('pojistka: L4 silného tématu oranžová/červená → L1–L3, pak znovu L4; zelená → téma hotové', () => {
    const den = (d) => `2026-10-${String(d).padStart(2, '0')}T18:00:00Z`;
    const k = katalog().filter((l) => l.tyden === 1);
    const l4 = (barva) => ({ stavLekce: 'hotovo', souhrn: { hlavniBarva: barva }, dokoncene: { konec: den(1) } });
    const zelena = k.map((l) => (l.poradi === 4 ? { ...l, ...l4('zelena') } : l));
    assert.equal(dalsiDoporucenaLekce(zelena, [1], new Set([1])), null);
    const oranzova = k.map((l) => (l.poradi === 4 ? { ...l, ...l4('oranzova') } : l));
    assert.equal(dalsiDoporucenaLekce(oranzova, [1], new Set([1])).id, 'M8-T01-L1');
    const poOpakovani = oranzova.map((l) => (l.poradi < 4 ? { ...l, stavLekce: 'hotovo', dokoncene: { konec: den(2 + l.poradi) } } : l));
    const znovu = dalsiDoporucenaLekce(poOpakovani, [1], new Set([1]));
    assert.equal(znovu.id, 'M8-T01-L4');
    assert.equal(znovu.znovu, true);
    // L4 zopakovaná a zase červená: L1–L3 jsou starší než nová L4 → téma se nedoporučuje dokola
    const znovuCervena = poOpakovani.map((l) => (l.poradi === 4 ? { ...l, ...l4('cervena'), dokoncene: { konec: den(9) } } : l));
    assert.equal(dalsiDoporucenaLekce(znovuCervena, [1], new Set([1])), null);
  });

  test('diagnostika se v katalogu pozná (tyden 0 ve fázi osma)', () => {
    assert.equal(jeDiagnostikaOsma({ faze: 'osma', tyden: 0 }), true);
    assert.equal(jeDiagnostikaOsma({ faze: 'osma', tyden: 1 }), false);
    assert.deepEqual(cislaTemat([{ faze: 'osma', tyden: 0 }, { tyden: 3 }, { tyden: 1 }, { tyden: 3 }]), [1, 3]);
  });
});

describe('temata.js', () => {
  test('název tématu: z hlášek, jinak z kapitol lekcí', () => {
    assert.equal(nazevTematu('matematika', 2, katalog()), 'Zlomky');
    assert.equal(nazevTematu('matematika', 7, []), '');
  });
  test('počet úloh: z obsahu, z katalogu, jinak podle předmětu', () => {
    assert.equal(pocetUlohLekce({ ulohy: [1, 2, 3, 4, 5] }), 5);
    assert.equal(pocetUlohLekce({ pocet_uloh: 4, id: 'cj-t1-l1' }), 4);
    assert.equal(pocetUlohLekce({ id: 'cj-t1-l1' }), 5);
    assert.equal(pocetUlohLekce({ id: 'M8-T01-L1' }), 4);
  });
  test('předložka z / ze', () => {
    assert.deepEqual([4, 5, 6, 20, 25, 40, 41, 9, 12].map(zeZ), ['ze', 'z', 'ze', 'ze', 'ze', 'ze', 'ze', 'z', 'ze']);
  });
});
