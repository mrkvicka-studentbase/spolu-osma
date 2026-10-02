// Fáze 1 (R30): vstupy `vyraz` a `poradi` ve web/js/vyhodnoceni.js (kostra/03 „Doplněno 25. 9.", SABLONA §15–16).
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  vyhodnotKrok, parsujVyraz, pocetClenu, maZavorkuSoucet, jeSoucin, sadyDosazeni, vyrazNaLatex, normalizujVyraz,
} from '../web/js/vyhodnoceni.js';

const v = (krok, h) => {
  const r = vyhodnotKrok(krok, h);
  return [r.spravne, r.typ_chyby, r.poznamka, r.neplatne];
};

describe('vyraz: parser a normalizace', () => {
  test('normalizace zápisu', () => {
    assert.equal(normalizujVyraz(' 3 · x² − 2,5 : x '), '3*x^2-2.5/x');
    assert.equal(normalizujVyraz('2×x⋅y³'), '2*x*y^3');
  });
  test('čitelné zápisy', () => {
    for (const z of ['2x', '-x^2', '2(x+1)', 'x(x-1)', '(x+1)(x-1)', '3x·2', '0,5x', 'x^(2)', '-(-x)', '+x', 'x^-1', '((x))']) {
      assert.ok(parsujVyraz(z), z);
    }
  });
  test('nečitelné zápisy', () => {
    for (const z of ['', '   ', '2(x', 'x)', '2x+', '*x', 'y', 'x2', 'x^x', 'x^1.5', '2..5', 'x==2', '()', 'x^100']) {
      assert.equal(parsujVyraz(z), null, z);
    }
  });
  test('víc proměnných jen podle promenne', () => {
    assert.equal(parsujVyraz('xy'), null);
    assert.ok(parsujVyraz('xy', ['x', 'y']));
  });
  test('počet členů, závorky, součin', () => {
    assert.equal(pocetClenu(parsujVyraz('5x - 3x·3 - 3·(-2x)')), 3);
    assert.equal(pocetClenu(parsujVyraz('-x + 3')), 2);
    assert.equal(pocetClenu(parsujVyraz('-(x + 3)')), 1);
    assert.equal(pocetClenu(parsujVyraz('2(x+1)')), 1);
    assert.equal(maZavorkuSoucet(parsujVyraz('3(x+2)')), true);
    assert.equal(maZavorkuSoucet(parsujVyraz('(-3)x + 6')), false);
    assert.equal(maZavorkuSoucet(parsujVyraz('(2x)^2')), false);
    assert.equal(jeSoucin(parsujVyraz('3(x+2)')), true);
    assert.equal(jeSoucin(parsujVyraz('-3(x+2)')), true);
    assert.equal(jeSoucin(parsujVyraz('(x+2)^2')), true);
    assert.equal(jeSoucin(parsujVyraz('3x+6')), false);
  });
  test('výchozí dosazení: x = −3, 2, ½; y cyklicky posunuté', () => {
    const s = sadyDosazeni({ promenne: ['x', 'y'] });
    assert.deepEqual(s.map((d) => [d.x, d.y].map((q) => `${q.c}/${q.j}`)), [['-3/1', '2/1'], ['2/1', '1/2'], ['1/2', '-3/1']]);
    assert.deepEqual(sadyDosazeni({ dosazeni: [{ x: '1/3' }, { x: -1 }] }).map((d) => `${d.x.c}/${d.x.j}`), ['1/3', '-1/1']);
  });
  test('náhled LaTeX zachová tvar dítěte', () => {
    assert.equal(vyrazNaLatex('3(x+2)'), '3\\left(x + 2\\right)');
    assert.equal(vyrazNaLatex('2·x²'), '2 \\cdot x^{2}');
    assert.equal(vyrazNaLatex('0,5x : 2'), '0{,}5x : 2');
    assert.equal(vyrazNaLatex('2(x'), null);
  });
});

describe('vyraz: vyhodnocení kroku', () => {
  const krok = {
    vstup: { typ: 'vyraz', promenne: ['x'] },
    spravne: { vyraz: '2x' },
    zname_chyby: [{ vyraz: '12x', typ_chyby: 'scital-pred-nasobenim' }, { vyraz: '-10x', typ_chyby: 'minus-krat-minus' }],
    kontrola_tvaru: null,
  };
  test('správně v různých zápisech', () => {
    for (const z of ['2x', '2·x', '2 * x', 'x·2', '2,0x', '4x:2']) assert.deepEqual(v(krok, z), [true, null, null, false], z);
  });
  test('víc členů než správný tvar = NEsedí s poznámkou zjednodus (R43: opsané zadání neprojde)', () => {
    assert.deepEqual(v(krok, '5x - 3x · 3 - 3 · (-2x)'), [false, null, 'zjednodus', false]);
    assert.deepEqual(v(krok, 'x + x'), [false, null, 'zjednodus', false]);
  });
  test('známé chyby dosazením', () => {
    assert.deepEqual(v(krok, '12x'), [false, 'scital-pred-nasobenim', null, false]);
    assert.deepEqual(v(krok, '−10 · x'), [false, 'minus-krat-minus', null, false]);
    assert.deepEqual(v(krok, '3x'), [false, null, null, false]);
  });
  test('nečitelné = neplatne (nepočítá se jako pokus)', () => {
    for (const z of ['', '2(x', 'y', null, 5]) assert.equal(vyhodnotKrok(krok, z).neplatne, true, String(z));
  });
  test('dosazení −3 a ½ odhalí shodu náhodou (x² a 3x − 2 se rovnají pro x = 1 i 2)', () => {
    // x^2 a 3x−2 se rovnají pro x = 1 i x = 2, ale ne pro −3 a ½
    const k = { vstup: { typ: 'vyraz' }, spravne: { vyraz: 'x^2' } };
    assert.equal(vyhodnotKrok(k, '3x-2').spravne, false);
  });
  test('kontrola_tvaru bez_zavorek: závorka = NEsedí s poznámkou roznasob (R43)', () => {
    const k = { vstup: { typ: 'vyraz' }, spravne: { vyraz: '3x+6' }, kontrola_tvaru: 'bez_zavorek' };
    assert.deepEqual(v(k, '3(x+2)'), [false, null, 'roznasob', false]);
    assert.deepEqual(v(k, '6 + 3x'), [true, null, null, false]);
    assert.deepEqual(v(k, '(-3)·x·(-1) + 6'), [true, null, null, false]);
  });
  test('bez_zavorek: umocněná závorka se součinem (2x)^2 = NEsedí s poznámkou roznasob (recenze F2-T05-L1)', () => {
    const k = { vstup: { typ: 'vyraz' }, spravne: { vyraz: '9-4x^2' }, kontrola_tvaru: 'bez_zavorek' };
    assert.deepEqual(v(k, '3^2-(2x)^2'), [false, null, 'roznasob', false]);
    assert.deepEqual(v(k, '9-(2x)^2'), [false, null, 'roznasob', false]);
    assert.deepEqual(v(k, '-4x^2+9'), [true, null, null, false]);
    assert.deepEqual(v(k, '9-4x·x'), [true, null, null, false]);
  });
  test('kontrola_tvaru soucin: nerozložený tvar nesedí (poznámka neni-soucin)', () => {
    const k = { vstup: { typ: 'vyraz' }, spravne: { vyraz: '3(x+2)' }, kontrola_tvaru: 'soucin' };
    assert.deepEqual(v(k, '3(x+2)'), [true, null, null, false]);
    assert.deepEqual(v(k, '(x + 2) · 3'), [true, null, null, false]);
    assert.deepEqual(v(k, '3x + 6'), [false, null, 'neni-soucin', false]);
  });
  test('soucin + vstup.vytknout: uzná jen rozklad s vytknutým −2x (recenze T6-L2)', () => {
    const k = { vstup: { typ: 'vyraz', vytknout: '-2x' }, spravne: { vyraz: '-2x(4x-1)' }, kontrola_tvaru: 'soucin' };
    for (const z of ['-2x(4x-1)', '(4x-1)·(-2x)', '-(2x)(4x-1)', '2x(-1)(4x-1)', '-2·x·(4x-1)']) {
      assert.deepEqual(v(k, z), [true, null, null, false], z);
    }
    assert.deepEqual(v(k, '2x(1-4x)'), [false, 'vytkl-bez-minusu', null, false]);
    assert.deepEqual(v(k, '2x(-4x+1)'), [false, 'vytkl-bez-minusu', null, false]);
    for (const z of ['-2(4x^2-x)', 'x(-8x+2)', '-x(8x-2)']) assert.deepEqual(v(k, z), [false, 'vytknul-neuplne', null, false], z);
    assert.deepEqual(v(k, '-8x^2+2x'), [false, null, 'neni-soucin', false]);
  });
  test('soucin + vytknout −x u tříčlenu a −3x (T6-L2 U2, U3)', () => {
    const k3 = { vstup: { typ: 'vyraz', vytknout: '-x' }, spravne: { vyraz: '-x(6x+1-3x^2)' }, kontrola_tvaru: 'soucin' };
    assert.equal(vyhodnotKrok(k3, '-x(1+6x-3x^2)').spravne, true);
    assert.deepEqual(v(k3, 'x(3x^2-6x-1)'), [false, 'vytkl-bez-minusu', null, false]);
    const k2 = { vstup: { typ: 'vyraz', vytknout: '-3x' }, spravne: { vyraz: '-3x(2x^2+x-3)' }, kontrola_tvaru: 'soucin' };
    assert.deepEqual(v(k2, '3x(-2x^2-x+3)'), [false, 'vytkl-bez-minusu', null, false]);
    assert.deepEqual(v(k2, '-3(2x^3+x^2-3x)'), [false, 'vytknul-neuplne', null, false]);
  });
  test('dvě proměnné a vlastní dosazení (dělení nulou v obou se přeskočí)', () => {
    const k = { vstup: { typ: 'vyraz', promenne: ['x', 'y'] }, spravne: { vyraz: 'x^2-y^2' } };
    assert.deepEqual(v(k, '(x-y)(x+y)'), [true, null, null, false]);
    assert.equal(vyhodnotKrok(k, 'x^2+y^2').spravne, false);
    const kd = { vstup: { typ: 'vyraz', dosazeni: [{ x: 0 }, { x: 2 }, { x: '1/2' }, { x: -3 }] }, spravne: { vyraz: '1/x' } };
    assert.equal(vyhodnotKrok(kd, 'x^-1').spravne, true);
    assert.equal(vyhodnotKrok(kd, 'x').spravne, false);
  });
});

describe('poradi', () => {
  const krok = {
    vstup: {
      typ: 'poradi',
      vyraz: '16 \\op{o1}{\\cdot} 5^{\\op{o2}{2}} \\op{o3}{-} 8 \\op{o4}{\\cdot} 5 \\op{o5}{+} 1',
      operace: ['o1', 'o2', 'o3', 'o4', 'o5'].map((id) => ({ id, popis: id })),
    },
    spravne: { poradi: [['o2', 'o1', 'o4', 'o3', 'o5'], ['o2', 'o4', 'o1', 'o3', 'o5'], ['o4', 'o2', 'o1', 'o3', 'o5']] },
    zname_chyby: [
      { poradi: ['o1', 'o2', 'o4', 'o3', 'o5'], typ_chyby: 'nasobil-pred-mocninou' },
      { poradi: ['o2', 'o1', 'o3', 'o4', 'o5'], typ_chyby: 'scital-pred-nasobenim' },
    ],
  };
  test('jakékoli povolené pořadí = správně', () => {
    for (const p of krok.spravne.poradi) assert.deepEqual(v(krok, p), [true, null, null, false]);
  });
  test('známá chyba přes celé pořadí, jinak bez kódu', () => {
    assert.deepEqual(v(krok, ['o1', 'o2', 'o4', 'o3', 'o5']), [false, 'nasobil-pred-mocninou', null, false]);
    assert.deepEqual(v(krok, ['o5', 'o4', 'o3', 'o2', 'o1']), [false, null, null, false]);
  });
  test('neúplné, duplicitní nebo cizí id = neplatne', () => {
    for (const h of [[], ['o2', 'o1'], ['o1', 'o1', 'o2', 'o3', 'o4'], ['o1', 'o2', 'o3', 'o4', 'x'], 'o1', null]) {
      assert.equal(vyhodnotKrok(krok, h).neplatne, true, JSON.stringify(h));
    }
  });
});

// R43: opsané zadání (hodnota sedí, výraz nedokončený) se nepočítá jako správně — skutečná diagnostika U20
describe('R43: opsané zadání diagnostiky U20 nesedí', () => {
  test('4x - 2(x-3) u U20 diagnostiky (syntetická M8-T00-DIAG = kopie F1-T00-DIAG) = spravne false, poznámka zjednodus', async () => {
    const { readFileSync } = await import('node:fs');
    const diag = JSON.parse(readFileSync(new URL('./data/osma/lekce/M8-T00-DIAG.json', import.meta.url), 'utf8'));
    const krok = diag.ulohy.find((u) => u.id === 'M8-T00-DIAG-U20').kroky.find((k) => k.id === 'final');
    const r = vyhodnotKrok(krok, '4x - 2(x-3)');
    assert.equal(r.spravne, false);
    assert.equal(r.typ_chyby, null);
    assert.ok(['zjednodus', 'roznasob'].includes(r.poznamka), r.poznamka);
    assert.equal(vyhodnotKrok(krok, '2x + 6').spravne, true);
  });
});
