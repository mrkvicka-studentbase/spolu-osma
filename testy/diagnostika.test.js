// Diagnostika Fáze 1 (R37): výpočet reportu — web/js/diagnostika.js, kontrolní případy A–D z obsah/diagnostika-report.md §7.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  sestavSouhrnDiagnostiky, stavKapitoly, celkovePasmo, POPIS_CHYB_RODIC, popisChybyRodic, pocetOdevzdanych,
} from '../web/js/diagnostika.js';
import { vyhodnotKrok } from '../web/js/vyhodnoceni.js';

const DIAG = JSON.parse(readFileSync(new URL('../obsah/lekce/F1-T00-DIAG.json', import.meta.url), 'utf8'));
const U = (n) => `F1-T00-DIAG-U${n}`;

/** Hodnota správné odpovědi v tom tvaru, jak ji posílá vstup (cislo/zlomek/smisene/vyraz). */
function spravnaHodnota(krok) {
  const s = krok.spravne;
  switch (krok.vstup.typ) {
    case 'cislo': return s.hodnota;
    case 'zlomek': return { c: s.c, j: s.j };
    case 'smisene': return { cela: s.cela, c: s.c, j: s.j };
    case 'vyraz': return s.vyraz;
    default: throw new Error(krok.vstup.typ);
  }
}

/** Řádky odpovedi jako z DB: vyhodnocené vyhodnotKrok (stejně jako při odevzdání). */
function odpovedi(prepis = {}, { vynechat = [] } = {}) {
  let id = 0;
  return DIAG.ulohy.flatMap((u, i) => {
    const n = i + 1;
    if (vynechat.includes(n)) return [];
    const krok = u.kroky.find((k) => k.id === 'final');
    const hodnota = n in prepis ? prepis[n] : spravnaHodnota(krok);
    const v = vyhodnotKrok(krok, hodnota);
    assert.equal(v.neplatne, false, `U${n} ${JSON.stringify(hodnota)} je nečitelné`);
    id += 1;
    return [{ id, uloha_id: u.id, krok_id: 'final', spravne: v.spravne, typ_chyby: v.typ_chyby, pokus: 1 }];
  });
}

const stavy = (souhrn) => Object.fromEntries(souhrn.kapitoly.map((k) => [k.kapitola, k.stav]));
const durazy = (souhrn) => Object.fromEntries(souhrn.tydny.map((t) => [t.tyden, t.duraz]));

describe('diagnostika: hranice (report §2, §4)', () => {
  test('stav kapitoly podle tabulky', () => {
    assert.equal(stavKapitoly(1, 0, 0), 'nezjisteno');
    assert.equal(stavKapitoly(1, 1, 0), 'nejista'); // 1 úloha nikdy „slabá"
    assert.equal(stavKapitoly(2, 2, 0), 'slaba');
    assert.equal(stavKapitoly(2, 2, 1), 'nejista');
    assert.equal(stavKapitoly(3, 1, 1), 'nezjisteno');
    assert.equal(stavKapitoly(3, 3, 1), 'slaba');
    assert.equal(stavKapitoly(4, 4, 2), 'nejista');
    assert.equal(stavKapitoly(4, 4, 4), 'jista');
  });
  test('celkové pásmo při 24 odevzdaných', () => {
    assert.equal(celkovePasmo(24, 24, 20), 'pevne');
    assert.equal(celkovePasmo(24, 24, 15), 'vetsinou');
    assert.equal(celkovePasmo(24, 24, 9), 'cast');
    assert.equal(celkovePasmo(24, 24, 8), 'zacatek');
    assert.equal(celkovePasmo(24, 11, 11), 'nezjisteno');
    assert.equal(celkovePasmo(24, 0, 0), 'nezjisteno');
  });
});

describe('diagnostika: kontrolní případy A–D (report §7)', () => {
  test('A: všech 24 správně', () => {
    const s = sestavSouhrnDiagnostiky(DIAG, odpovedi(), { ted: 'x' });
    assert.equal(s.typ, 'diagnostika');
    assert.equal(s.celkove, 'pevne');
    assert.equal(s.kapitoly.length, 11);
    assert.ok(s.kapitoly.every((k) => k.stav === 'jista'));
    assert.deepEqual(durazy(s), { 1: 'rychleji', 2: 'rychleji', 3: 'rychleji', 4: 'rychleji', 5: 'rychleji', 6: 'rychleji', 7: 'rychleji', 8: 'opakovani' });
    assert.deepEqual(s.chyby, []);
    assert.equal(s.neuplne, false);
  });

  test('B: 11 chyb, U24 neodevzdána', () => {
    const s = sestavSouhrnDiagnostiky(DIAG, odpovedi({
      3: -16, 4: 34, 5: 16, 7: { c: 3, j: 8 }, 8: 140, 12: 16, 13: 27, 15: 1152, 17: 17, 20: '2x-3', 21: '2x-10', 22: 5,
    }, { vynechat: [24] }));
    assert.equal(s.odevzdano, 23);
    assert.equal(s.spravne, 11);
    assert.equal(s.neuplne, true);
    assert.equal(s.celkove, 'cast');
    assert.deepEqual(stavy(s), {
      'pocetni-operace': 'jista', 'cela-cisla': 'slaba', zlomky: 'slaba', 'desetinna-cisla': 'jista', pomer: 'nejista',
      procenta: 'slaba', jednotky: 'nejista', 'slovni-ulohy': 'jista', vyrazy: 'slaba', rovnice: 'nejista', geometrie: 'nezjisteno',
    });
    assert.deepEqual(durazy(s), { 1: 'dukladne', 2: 'dukladne', 3: 'normalne', 4: 'dukladne', 5: 'normalne', 6: 'dukladne', 7: 'nezjisteno', 8: 'opakovani' });
    const t = (n) => s.tydny.find((x) => x.tyden === n);
    assert.deepEqual(t(1).lekce_duraz, ['F1-T01-L2', 'F1-T01-L4']);
    assert.deepEqual(t(1).pilot, ['P2']);
    assert.deepEqual(t(2).pilot, ['P3', 'P4']);
    assert.deepEqual(t(6).lekce_duraz, ['F1-T06-L1', 'F1-T06-L2']);
    assert.deepEqual(s.chyby.map((c) => [c.typ_chyby, c.pocet, c.tydny]), [
      ['jen-cast-bez-celku', 2, [2, 4]], ['roznasobil-jen-prvni-clen', 2, [6]], ['minus-krat-minus', 1, [1]],
    ]);
    assert.equal(s.chyby_nezarazene, 1);
  });

  test('C: jen blok 1, U6 = 2 1/6', () => {
    const s = sestavSouhrnDiagnostiky(DIAG, odpovedi({ 6: { cela: 2, c: 1, j: 6 } }, { vynechat: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] }));
    assert.equal(s.odevzdano, 12);
    assert.equal(s.celkove, 'pevne');
    assert.equal(s.neuplne, true);
    const st = stavy(s);
    assert.equal(st.zlomky, 'nejista');
    for (const k of ['pocetni-operace', 'cela-cisla', 'desetinna-cisla', 'pomer']) assert.equal(st[k], 'jista', k);
    for (const k of ['procenta', 'jednotky', 'slovni-ulohy', 'vyrazy', 'rovnice', 'geometrie']) assert.equal(st[k], 'nezjisteno', k);
    assert.deepEqual(durazy(s), { 1: 'rychleji', 2: 'normalne', 3: 'rychleji', 4: 'nezjisteno', 5: 'nezjisteno', 6: 'nezjisteno', 7: 'nezjisteno', 8: 'opakovani' });
  });

  test('D: u U1 navíc pokus 2 s chybou → bere se pokus 2', () => {
    const o = odpovedi();
    const krok = DIAG.ulohy[0].kroky[0];
    const v = vyhodnotKrok(krok, 135);
    o.push({ id: 999, uloha_id: U(1), krok_id: 'final', spravne: v.spravne, typ_chyby: v.typ_chyby, pokus: 2 });
    const s = sestavSouhrnDiagnostiky(DIAG, o);
    assert.equal(stavy(s)['pocetni-operace'], 'nejista');
    assert.deepEqual(s.chyby.map((c) => c.typ_chyby), ['nasobil-pred-mocninou']);
  });
});

describe('diagnostika: popisy a pomocné funkce', () => {
  test('každá známá chyba diagnostiky má popis pro rodiče', () => {
    const kody = new Set(DIAG.ulohy.flatMap((u) => u.kroky.flatMap((k) => (k.zname_chyby || []).map((z) => z.typ_chyby))));
    for (const k of kody) assert.ok(POPIS_CHYB_RODIC[k], `chybí popis pro ${k}`);
    assert.equal(popisChybyRodic('neznamy-kod'), 'neznamy-kod');
  });
  test('počet odevzdaných = úlohy s krokem final', () => {
    assert.equal(pocetOdevzdanych([{ uloha_id: 'a', krok_id: 'final' }, { uloha_id: 'a', krok_id: 'final' }, { uloha_id: 'b', krok_id: 'k1' }]), 1);
  });
});
