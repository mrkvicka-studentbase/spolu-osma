// =====================================================================
// validator.test.js — testy validátoru lekcí (supabase/seed/validator.mjs + obsah/schema.json)
// Spustit: npm test   (node --test testy/)
// Testovací lekce jsou inline; slovník chyb je pro jednotkové testy pevný (nezávisí na typy-chyb.md),
// poslední blok ověřuje skutečný obsah/lekce/*.json proti skutečnému slovníku.
// =====================================================================

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  zkontrolujLekci,
  parsujSlovnikChyb,
  nactiSlovnikChyb,
  problemVyrazu,
  problemyObrazku,
  idOperaciZVyrazu,
  bezMatematiky,
  kontrolaParuSimulaci,
  bodyLekce,
} from '../supabase/seed/validator.mjs';

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(await readFile(path.join(KOREN, 'obsah', 'schema.json'), 'utf8'));
const SLOVNIK = new Set(['scital-pred-nasobenim', 'ignoroval-zavorku', 'nasobil-pred-mocninou', 'numericka-chyba']);

const kopie = (x) => JSON.parse(JSON.stringify(x));
const over = (lekce, slovnik = SLOVNIK) => zkontrolujLekci(lekce, `${lekce.id}.json`, { schema, slovnik });
const obsahuje = (pole, vzor) => pole.some((c) => (vzor instanceof RegExp ? vzor.test(c) : c.includes(vzor)));

// ---------------------------------------------------------------------
// Základní platná lekce (formát kostra 03 + R23)
// ---------------------------------------------------------------------
const tahak = {
  vysvetleni: 'Krátké vysvětlení.',
  reseni: 'Postup.\n\n**Výsledek:** $\\frac{3}{4}$',
  otazky: [{ k: 'A', text: '„Co je první?“' }, '„Proč?“', '„A dál?“'],
  otocena_role: '„Vysvětli mi to.“',
  typicka_chyba: 'Sčítá dřív než násobí.',
};
const semafor = { zelena: 'Dál.', oranzova: 'Zítra 5 minut.', cervena: 'Dnes stačí.' };
const dlazdice = (id) => ({
  id,
  popisek: 'Vyber, co platí',
  vstup: {
    typ: 'dlazdice',
    moznosti: [
      { id: 'a', text: '$17$', spravne: true },
      { id: 'b', text: '$32$', spravne: false, typ_chyby: 'scital-pred-nasobenim' },
      { id: 'c', text: '$20$', spravne: false, typ_chyby: 'ignoroval-zavorku' },
    ],
  },
});
const uloha = (n, typ, kroky, cas) => ({
  id: `P9-U${n}`, typ, cas_min: cas, zadani: 'Spočítej $$5 + 3 \\cdot 4$$', zdroj: 'vlastni',
  kroky, tahak, semafor, tisk: { zadani: 'a) b) c)' },
});
const ZAKLAD = {
  id: 'P9', faze: 'pilot', tyden: 1, poradi: 1, tema: 'Test', kapitola: 'pocetni-operace', varianta: 'z9',
  cil_pro_rodice: 'Cíl.', uvod_pro_rodice: 'Úvod.',
  uvod_pravidla: [{ znak: '$1\\frac{1}{4}$', text: 'smíšené číslo' }, { znak: '$\\cdot$', text: 'násobení' }],
  cas_min: 20,
  ulohy: [
    uloha(1, 'rozcvicka', [dlazdice('final')], 4),
    uloha(2, 'detektiv', [dlazdice('k1'), {
      id: 'final', popisek: 'Výsledek', vstup: { typ: 'cislo' }, spravne: { hodnota: 17 },
      zname_chyby: [{ hodnota: 32, typ_chyby: 'scital-pred-nasobenim' }],
    }], 5),
    uloha(3, 'cermat', [{
      id: 'final', popisek: 'Výsledek', vstup: { typ: 'zlomek' }, spravne: { c: 3, j: 4 }, kontrola_tvaru: 'zakladni_tvar',
    }], 7),
    uloha(4, 'semafor', [{ id: 'final', popisek: 'Výsledek', vstup: { typ: 'cislo' }, spravne: { hodnota: 2 } }], 4),
  ],
  kontrola: { jistota: 'jista', poznamka: '', zkontroloval: 'recenzent', datum: '2026-09-25' },
};

const SVG_OK = '<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="40" fill="none" stroke="currentColor"/><text x="50" y="30" fill="var(--barva-text)">8 cm</text></svg>';

const KROK_PORADI = {
  id: 'k1',
  popisek: 'Klikni na početní operace v pořadí, v jakém je počítáš.',
  vstup: {
    typ: 'poradi',
    vyraz: '90 \\op{o1}{-} 2 \\op{o2}{\\cdot} (1 \\op{o3}{+} 2)^{\\op{o4}{2}}',
    operace: [
      { id: 'o1', popis: 'odčítání' }, { id: 'o2', popis: 'násobení' },
      { id: 'o3', popis: 'sčítání v závorce' }, { id: 'o4', popis: 'mocnina' },
    ],
  },
  spravne: { poradi: [['o3', 'o4', 'o2', 'o1']] },
  zname_chyby: [
    { poradi: ['o3', 'o2', 'o4', 'o1'], typ_chyby: 'nasobil-pred-mocninou' },
    { poradi: ['o1', 'o2', 'o3', 'o4'], typ_chyby: 'ignoroval-zavorku' },
  ],
};

const KROK_VYRAZ = {
  id: 'final', popisek: 'Výsledek', vstup: { typ: 'vyraz' },
  spravne: { vyraz: '3x² - 2(x + 1)' },
  zname_chyby: [{ vyraz: '3x^2 - 2x + 1', typ_chyby: 'ignoroval-zavorku' }],
};

/** Základní lekce s rozšířeními Fáze 1 (pomucky, obrazek, poradi, vyraz). */
function lekceFaze1() {
  const l = kopie(ZAKLAD);
  l.pomucky = ['sešit', 'propiska', 'tužka'];
  l.ulohy[2].obrazek = SVG_OK;
  l.ulohy[2].obrazek_popis = 'Obdélník 8 cm × 4 cm.';
  l.ulohy[2].kroky = [kopie(KROK_PORADI), kopie(KROK_VYRAZ)];
  return l;
}

// ---------------------------------------------------------------------
describe('platné lekce', () => {
  test('základní lekce projde bez chyb a varování', () => {
    const { chyby, varovani } = over(ZAKLAD);
    assert.deepEqual(chyby, []);
    assert.deepEqual(varovani, []);
  });

  test('lekce s pomůckami, obrázkem, vstupy poradi a vyraz projde', () => {
    const { chyby, varovani } = over(lekceFaze1());
    assert.deepEqual(chyby, []);
    assert.deepEqual(varovani, []);
  });

  test('kapitoly pomer a slovni-ulohy jsou povolené; neznámý kód = varování (Spolu 8), nesmyslný tvar = chyba', () => {
    for (const k of ['pomer', 'slovni-ulohy']) assert.deepEqual(over({ ...kopie(ZAKLAD), kapitola: k }), { chyby: [], varovani: [] });
    const v = over({ ...kopie(ZAKLAD), kapitola: 'pomery' });
    assert.deepEqual(v.chyby, []);
    assert.ok(obsahuje(v.varovani, 'pomery'));
    assert.ok(obsahuje(over({ ...kopie(ZAKLAD), kapitola: 'Poměry 2' }).chyby, 'kapitola'));
  });

  test('uvod_pravidla.znak do 36 znaků zdroje (R42; delší ne)', () => {
    const l = kopie(ZAKLAD);
    l.uvod_pravidla[0].znak = '$\\frac{123}{456} + \\frac{7}{8} + \\frac{9}{10}$';
    assert.ok(obsahuje(over(l).chyby, 'znak'));
  });

  test('pomucky: prázdné pole nebo příliš dlouhá položka = chyba', () => {
    assert.ok(obsahuje(over({ ...kopie(ZAKLAD), pomucky: [] }).chyby, 'pomucky'));
    assert.ok(obsahuje(over({ ...kopie(ZAKLAD), pomucky: ['x'.repeat(31)] }).chyby, 'pomucky'));
  });
});

// ---------------------------------------------------------------------
describe('zlomky v textu (R29 H4)', () => {
  test('3/4 v zadání mimo matematiku = chyba', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[0].zadani = 'Kolik je 3/4 z 20?';
    assert.ok(obsahuje(over(l).chyby, /ulohy\[0\]\.zadani: zlomek „3\/4"/));
  });

  test('lomítko s mezerami (3 / 4) v taháku = chyba', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[1].tahak.typicka_chyba = 'Napíše 3 / 4 místo 4/3.';
    assert.ok(obsahuje(over(l).chyby, 'tahak.typicka_chyba'));
  });

  test('lomítko uvnitř $…$ a $$…$$ není chyba', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[0].zadani = 'Vypočti $3/4 + 1$ a $$6/8$$';
    assert.deepEqual(over(l).chyby, []);
  });

  test('unicode zlomek je chyba i uvnitř matematiky', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[0].tahak.reseni = 'Výsledek $½$';
    l.cil_pro_rodice = 'Umí ¾.';
    const { chyby } = over(l);
    assert.ok(obsahuje(chyby, 'reseni: unicode zlomek „½"'));
    assert.ok(obsahuje(chyby, 'cil_pro_rodice: unicode zlomek „¾"'));
  });

  test('strojové zápisy (spravne.vyraz, obrazek) se nekontrolují', () => {
    const l = lekceFaze1();
    l.ulohy[2].kroky[1].spravne.vyraz = '3/4x + 1';
    l.ulohy[2].obrazek = SVG_OK.replace('8 cm', '');
    assert.deepEqual(over(l).chyby, []);
  });

  test('bezMatematiky odstraní $…$ i $$…$$, escapovaný \\$ ne', () => {
    assert.equal(bezMatematiky('a $1/2$ b $$3/4$$ c').includes('/'), false);
    assert.ok(bezMatematiky('cena 5\\$ / 2\\$').includes('/'));
  });
});

// ---------------------------------------------------------------------
describe('slovník typů chyb', () => {
  test('typ_chyby mimo slovník u dlaždice i zname_chyby = chyba', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[0].kroky[0].vstup.moznosti[1].typ_chyby = 'vymysleny-kod';
    l.ulohy[1].kroky[1].zname_chyby[0].typ_chyby = 'jiny-vymysleny';
    const { chyby } = over(l);
    assert.ok(obsahuje(chyby, 'moznosti[1]: typ_chyby "vymysleny-kod" není ve slovníku'));
    assert.ok(obsahuje(chyby, 'zname_chyby[0]: typ_chyby "jiny-vymysleny" není ve slovníku'));
  });

  test('parser bere kódy z první buňky tabulky, ne kódy kapitol z nadpisů', () => {
    const md = [
      '## A. Pořadí (kapitola `pocetni-operace`)',
      '| kód | popis |',
      '|---|---|',
      '| `scital-pred-nasobenim` | Sčítal … `ignoroval-zavorku` v textu se nepočítá |',
      '|   `nezkratil`   | … |',
      'Text s `jiny-kod` mimo tabulku.',
    ].join('\n');
    assert.deepEqual([...parsujSlovnikChyb(md)].sort(), ['nezkratil', 'scital-pred-nasobenim']);
  });

  test('skutečný slovník obsah/typy-chyb.md má kódy z oddílu A', async () => {
    const s = await nactiSlovnikChyb(path.join(KOREN, 'obsah', 'typy-chyb.md'));
    assert.ok(s.has('scital-pred-nasobenim'));
    assert.ok(!s.has('pocetni-operace'));
  });
});

// ---------------------------------------------------------------------
describe('vstup poradi', () => {
  test('id z \\op{…} se čtou v pořadí výskytu', () => {
    assert.deepEqual(idOperaciZVyrazu(KROK_PORADI.vstup.vyraz), ['o1', 'o2', 'o3', 'o4']);
  });

  test('\\op bez položky v operace[] a operace bez \\op = chyba', () => {
    const l = lekceFaze1();
    const k = l.ulohy[2].kroky[0];
    k.vstup.operace[3].id = 'o5';
    const { chyby } = over(l);
    assert.ok(obsahuje(chyby, '\\op{o4} ve výrazu nemá položku'));
    assert.ok(obsahuje(chyby, 'operace "o5" není ve výrazu'));
  });

  test('pořadí, které není permutací všech operací = chyba', () => {
    const l = lekceFaze1();
    l.ulohy[2].kroky[0].spravne.poradi = [['o3', 'o4', 'o2'], ['o3', 'o3', 'o2', 'o1']];
    const { chyby } = over(l);
    assert.ok(obsahuje(chyby, 'spravne.poradi[0] není pořadí všech operací'));
    assert.ok(obsahuje(chyby, 'spravne.poradi[1] není pořadí všech operací'));
  });

  test('známá chyba shodná se správným pořadím = chyba', () => {
    const l = lekceFaze1();
    l.ulohy[2].kroky[0].zname_chyby[0].poradi = ['o3', 'o4', 'o2', 'o1'];
    assert.ok(obsahuje(over(l).chyby, 'pořadí je shodné se správným'));
  });

  test('víc než 6 operací = chyba', () => {
    const l = lekceFaze1();
    const k = l.ulohy[2].kroky[0];
    const ids = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
    k.vstup.vyraz = ids.map((id) => `1 \\op{${id}}{+}`).join(' ') + ' 1';
    k.vstup.operace = ids.map((id) => ({ id, popis: 'sčítání' }));
    k.spravne.poradi = [ids];
    k.zname_chyby = [];
    const { chyby } = over(l);
    assert.ok(obsahuje(chyby, 'nejvýš 6 operací'));
  });

  test('chybějící vstup.operace = chyba schématu', () => {
    const l = lekceFaze1();
    delete l.ulohy[2].kroky[0].vstup.operace;
    assert.ok(obsahuje(over(l).chyby, 'chybí povinné pole "operace"'));
  });
});

// ---------------------------------------------------------------------
describe('vstup vyraz', () => {
  test('povolené zápisy', () => {
    for (const v of ['3x² - 2(x + 1)', '-x^2 + 4', '2 · x * 3', '0,5x - 1.5', '(-3)·x', 'x*-2']) {
      assert.equal(problemVyrazu(v), null, v);
    }
  });

  test('nepovolené znaky, závorky a operátory', () => {
    assert.match(problemVyrazu('2y + 1'), /nepovolené znaky: y/);
    assert.match(problemVyrazu('\\frac{1}{2}x'), /nepovolené znaky/);
    assert.match(problemVyrazu('(x + 1'), /neuzavřená závorka/);
    assert.match(problemVyrazu('x + 1)'), /bez otevírací/);
    assert.match(problemVyrazu('x + '), /končí operátorem/);
    assert.match(problemVyrazu('x ++ 1'), /dva operátory/);
    assert.match(problemVyrazu(''), /prázdný/);
  });

  test('chybný spravne.vyraz a známá chyba shodná se správným = chyba lekce', () => {
    const l = lekceFaze1();
    const k = l.ulohy[2].kroky[1];
    k.zname_chyby[0].vyraz = '3x^2 -2(x+1)';
    assert.ok(obsahuje(over(l).chyby, 'shodná se správným výrazem'));
    k.spravne.vyraz = '3a + 1';
    assert.ok(obsahuje(over(l).chyby, 'spravne.vyraz „3a + 1"'));
  });
});

// ---------------------------------------------------------------------
describe('obrázek (inline SVG)', () => {
  test('bezpečné SVG s currentColor a var(--…) projde bez varování', () => {
    assert.deepEqual(problemyObrazku(SVG_OK), { chyby: [], varovani: [] });
  });

  test('zakázané prvky a atributy = chyba', () => {
    const pripady = {
      '<script>': '<svg><script>alert(1)</script></svg>',
      '<foreignObject>': '<svg><foreignObject><div/></foreignObject></svg>',
      'href': '<svg><a href="https://x.cz"><text>x</text></a></svg>',
      'xlink:href': '<svg><use xlink:href="#a"/></svg>',
      'on…=': '<svg><rect onclick="x()"/></svg>',
      'url(': '<svg><rect style="fill: url(#g)"/></svg>',
      '<image>': '<svg><image width="10"/></svg>',
    };
    for (const [popis, svg] of Object.entries(pripady)) {
      assert.ok(problemyObrazku(svg).chyby.length > 0, popis);
    }
    assert.ok(problemyObrazku('<div>ne svg</div>').chyby.some((c) => c.includes('<svg>')));
  });

  test('popisek mimo viewBox = chyba (testovací rodič T7: „15 m" ořezané na „5 m")', () => {
    const svg = (text) => `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">${text}</svg>`;
    assert.ok(problemyObrazku(svg('<text x="24" y="72" text-anchor="end" font-size="13">15 m</text>')).chyby.some((c) => c.includes('vlevo')));
    assert.ok(problemyObrazku(svg('<text x="190" y="72" font-size="13">20 m</text>')).chyby.some((c) => c.includes('vpravo')));
    assert.deepEqual(problemyObrazku(svg('<text x="34" y="72" text-anchor="end" font-size="13">15 m</text>')).chyby, []);
    assert.deepEqual(problemyObrazku(svg('<text x="100" y="137" text-anchor="middle" font-size="13">20 m</text>')).chyby, []);
  });

  test('barvy natvrdo = jen varování', () => {
    for (const svg of ['<svg><rect fill="#1FC27E"/></svg>', '<svg><rect stroke="rgb(0,0,0)"/></svg>', '<svg><rect fill="red"/></svg>']) {
      const { chyby, varovani } = problemyObrazku(svg);
      assert.deepEqual(chyby, [], svg);
      assert.equal(varovani.length, 1, svg);
    }
  });

  test('obrazek bez obrazek_popis = chyba; nebezpečné SVG = chyba lekce', () => {
    const l = lekceFaze1();
    delete l.ulohy[2].obrazek_popis;
    assert.ok(obsahuje(over(l).chyby, 'vyžaduje i pole "obrazek_popis"'));
    const l2 = lekceFaze1();
    l2.ulohy[2].obrazek = '<svg><script>x</script></svg>';
    assert.ok(obsahuje(over(l2).chyby, /ulohy\[2\].*<script>/));
  });
});

// ---------------------------------------------------------------------
describe('skutečný obsah', async () => {
  const adresar = path.join(KOREN, 'obsah', 'lekce');
  const slovnik = await nactiSlovnikChyb(path.join(KOREN, 'obsah', 'typy-chyb.md'));
  const soubory = (await readdir(adresar)).filter((n) => n.endsWith('.json')).sort();
  // Zkontrolované lekce (jistota 'jista' = jen ty jdou do seedu) musí projít vždy.
  // Rozpracované lekce se hlásí jako TODO: selhání je vidět ve výpisu, ale neshodí `npm test`.
  for (const nazev of soubory) {
    const data = JSON.parse((await readFile(path.join(adresar, nazev), 'utf8')).replace(/^﻿/, ''));
    const hotova = data?.kontrola?.jistota === 'jista';
    test(`${nazev} projde validací${hotova ? '' : ' (rozpracovaná)'}`, { todo: !hotova }, () => {
      const { chyby } = zkontrolujLekci(data, nazev, { schema, slovnik });
      assert.deepEqual(chyby, []);
    });
  }
});

// =====================================================================
// Fáze 2 (R38, osnova-faze2 §3.5 a §4)
// =====================================================================
const KONSTRUKCE_SVG = '<svg viewBox="0 0 120 80"><circle cx="60" cy="40" r="30" fill="none" stroke="currentColor"/><text x="5" y="10" fill="currentColor">C</text></svg>';
const cislo = (id, body, extra = {}) => ({ id, popisek: 'Výsledek', vstup: { typ: 'cislo' }, spravne: { hodnota: 1 }, body, ...extra });
const pismenaKrok = (id, druh, pocet, body) => ({
  id, popisek: 'Vyber', body,
  vstup: {
    typ: 'dlazdice', pismena: druh,
    moznosti: Array.from({ length: pocet }, (_, i) => ({
      id: String.fromCharCode(97 + i), text: `$${i + 10}$`, spravne: i === 0,
      ...(i === 0 ? {} : { typ_chyby: 'numericka-chyba' }),
    })),
  },
});
const ulohaSim = (lekceId, n, pozice, kroky, extra = {}) => ({
  id: `${lekceId}-U${n}`, typ: 'simulace', pozice, kapitola: 'zlomky', zadani: 'Zadání $\\frac{1}{2}$', zdroj: 'klon: CERMAT 2025 M9B',
  kroky, tahak: { reseni: 'Řešení.', typicka_chyba: 'Chyba.' }, tisk: { zadani: 'Zadání.' }, ...extra,
});
const simulace = (id, cast, ulohy, simulaceInfo) => ({
  id, typ: 'simulace', faze: 'faze2', tyden: 8, poradi: cast === 1 ? 3 : 4, tema: `Simulace 1 — ${cast}. část`,
  kapitola: 'simulace', varianta: 'z9', cas_min: 70, simulace: simulaceInfo, ulohy,
  kontrola: { jistota: 'jista' },
});

function paraSimulaci() {
  const A = 'F2-T08-L3';
  const B = 'F2-T08-L4';
  const body1 = [3, 3, 4, 4, 3, 3, 3, 2];
  const cast1 = simulace(A, 1, body1.map((b, i) => ulohaSim(A, i + 1, i + 1,
    [cislo('final', b, i === 3 ? { postup: true } : {})])), { cislo: 1, cast: 1, druha_cast: B, odpocet_min: 70 });
  const cast2 = simulace(B, 2, [
    ulohaSim(B, 1, 9, [
      { id: 'k1', popisek: 'Kolik řešení má úloha?', vstup: { typ: 'cislo' }, spravne: { hodnota: 2 }, body: 1 },
      { id: 'final', popisek: 'Narýsuj', vstup: { typ: 'rysovani' }, body: 2 },
    ], {
      obrazek_mm: 120,
      tahak: {
        reseni: 'Konstrukce.', typicka_chyba: 'Jen jedno řešení.',
        reseni_obrazek: KONSTRUKCE_SVG, reseni_obrazek_popis: 'Kružnice se dvěma řešeními.',
        kontrola_rodice: ['„Leží C na kružnici?“', '„Jsou vrcholy označené?“'],
      },
    }),
    ulohaSim(B, 2, 10, [cislo('final', 2)]),
    ulohaSim(B, 3, 11, [pismenaKrok('k1', 'AN', 2, 2), pismenaKrok('k2', 'AN', 2, 1), pismenaKrok('final', 'AN', 2, 1)]),
    ulohaSim(B, 4, 12, [pismenaKrok('final', 'A-E', 5, 2)]),
    ulohaSim(B, 5, 13, [pismenaKrok('final', 'A-E', 5, 2)]),
    ulohaSim(B, 6, 14, [pismenaKrok('final', 'A-E', 5, 2)]),
    ulohaSim(B, 7, 15, [pismenaKrok('k1', 'A-F', 6, 2), pismenaKrok('k2', 'A-F', 6, 2), pismenaKrok('final', 'A-F', 6, 2)]),
    ulohaSim(B, 8, 16, [cislo('final', 4)]),
  ], { cislo: 1, cast: 2, prvni_cast: A, odpocet_min: 70 });
  return [cast1, cast2];
}

describe('Fáze 2 — simulace', () => {
  test('platný pár simulace projde (schéma, domény, páry, 25 + 25 bodů)', () => {
    const [a, b] = paraSimulaci();
    assert.equal(bodyLekce(a), 25);
    assert.equal(bodyLekce(b), 25);
    for (const l of [a, b]) {
      const { chyby, varovani } = over(l);
      assert.deepEqual(chyby, [], l.id);
      assert.deepEqual(varovani, [], l.id);
    }
    assert.deepEqual(kontrolaParuSimulaci([a, b]), []);
  });

  test('součet bodů části ≠ 25 a krok bez bodů = chyba', () => {
    const [a] = paraSimulaci();
    a.ulohy[0].kroky[0].body = 4;
    assert.ok(obsahuje(over(a).chyby, 'součet bodů části je 26'));
    delete a.ulohy[1].kroky[0].body;
    assert.ok(obsahuje(over(a).chyby, 'krok simulace musí mít body'));
  });

  test('pozice mimo část a nevzestupné pozice = chyba', () => {
    const [a, b] = paraSimulaci();
    a.ulohy[7].pozice = 9;
    assert.ok(obsahuje(over(a).chyby, 'pozice 9 nepatří do 1. části'));
    [b.ulohy[1].pozice, b.ulohy[2].pozice] = [b.ulohy[2].pozice, b.ulohy[1].pozice];
    assert.ok(obsahuje(over(b).chyby, 'vzestupně'));
  });

  test('úloha simulace bez kapitoly, s otázkami L1–L3 nebo část bez odkazu = chyba schématu', () => {
    const [a, b] = paraSimulaci();
    delete a.ulohy[0].kapitola;
    assert.ok(obsahuje(over(a).chyby, 'kapitola'));
    b.ulohy[1].tahak.otazky = ['„?“', '„?“', '„?“'];
    assert.ok(obsahuje(over(b).chyby, 'nepovolené pole "otazky"'));
    const [c] = paraSimulaci();
    delete c.simulace.druha_cast;
    assert.ok(obsahuje(over(c).chyby, 'chybí povinné pole "druha_cast"'));
  });

  test('páry: chybějící protějšek, jednosměrný odkaz, jiné číslo, součet ≠ 50', () => {
    const [a, b] = paraSimulaci();
    assert.ok(obsahuje(kontrolaParuSimulaci([a]), 'soubor chybí'));
    const b2 = kopie(b);
    b2.simulace.prvni_cast = 'F2-T09-L3';
    assert.ok(obsahuje(kontrolaParuSimulaci([a, b2]), 'není protější část'));
    const b3 = kopie(b);
    b3.simulace.cislo = 2;
    assert.ok(obsahuje(kontrolaParuSimulaci([a, b3]), 'číslo simulace'));
    const b4 = kopie(b);
    b4.ulohy[7].kroky[0].body = 5;
    assert.ok(obsahuje(kontrolaParuSimulaci([a, b4]), 'simulace má 51 bodů'));
  });

  test('body mimo simulaci = chyba', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[3].kroky[0].body = 2;
    assert.ok(obsahuje(over(l).chyby, 'body jen v simulaci'));
  });
});

describe('Fáze 2 — dlaždice s písmeny', () => {
  test('počet možností musí odpovídat druhu písmen', () => {
    const [, b] = paraSimulaci();
    b.ulohy[3].kroky[0].vstup.moznosti.pop();
    assert.ok(obsahuje(over(b).chyby, 'pismena "A-E" vyžaduje 5 možností, má 4'));
  });

  test('text s vlastním písmenem „B)" / „N —" = chyba', () => {
    const [, b] = paraSimulaci();
    b.ulohy[3].kroky[0].vstup.moznosti[1].text = 'B) $12$';
    b.ulohy[2].kroky[0].vstup.moznosti[1].text = 'N — nepravdivé';
    const { chyby } = over(b);
    assert.ok(obsahuje(chyby, 'text „B) $12$" má vlastní písmeno'));
    assert.ok(obsahuje(chyby, 'text „N — nepravdivé" má vlastní písmeno'));
  });

  test('bez pismena platí 3–4 možnosti, s pismena až 6; neznámý druh = chyba', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[0].kroky[0].vstup.moznosti.push(
      { id: 'd', text: '$1$', spravne: false, typ_chyby: 'numericka-chyba' },
      { id: 'e', text: '$2$', spravne: false, typ_chyby: 'numericka-chyba' });
    assert.ok(obsahuje(over(l).chyby, 'maximum je 4'));
    l.ulohy[0].kroky[0].vstup.pismena = 'A-E';
    assert.deepEqual(over(l).chyby, []);
    l.ulohy[0].kroky[0].vstup.pismena = 'A-Z';
    assert.ok(obsahuje(over(l).chyby, 'pismena'));
  });

  test('pismena u jiného vstupu než dlaždice = chyba', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[3].kroky[0].vstup.pismena = 'A-E';
    assert.ok(obsahuje(over(l).chyby, 'pismena jen u vstupu dlazdice'));
  });
});

describe('Fáze 2 — rýsování a obrázek řešení', () => {
  test('rysovani se spravne = chyba', () => {
    const [, b] = paraSimulaci();
    b.ulohy[0].kroky[1].spravne = { hodnota: 1 };
    assert.ok(obsahuje(over(b).chyby, 'rysovani nesmí mít „spravne"'));
  });

  test('rysovani bez tahak.reseni_obrazek = chyba; bez kontrola_rodice = varování', () => {
    const [, b] = paraSimulaci();
    delete b.ulohy[0].tahak.kontrola_rodice;
    assert.ok(obsahuje(over(b).varovani, 'kontrola_rodice'));
    delete b.ulohy[0].tahak.reseni_obrazek;
    delete b.ulohy[0].tahak.reseni_obrazek_popis;
    assert.ok(obsahuje(over(b).chyby, 'rysovani potřebuje tahak.reseni_obrazek'));
  });

  test('reseni_obrazek: stejná SVG pravidla jako obrazek + povinný popis', () => {
    const [, b] = paraSimulaci();
    b.ulohy[0].tahak.reseni_obrazek = '<svg><a href="x"><circle r="1" fill="#000"/></a></svg>';
    const { chyby, varovani } = over(b);
    assert.ok(obsahuje(chyby, 'tahak.reseni_obrazek: obrazek obsahuje zakázané: odkaz'));
    assert.ok(obsahuje(varovani, 'tahak.reseni_obrazek: obrazek má barvy natvrdo'));
    const [, c] = paraSimulaci();
    delete c.ulohy[0].tahak.reseni_obrazek_popis;
    assert.ok(obsahuje(over(c).chyby, 'vyžaduje i pole "reseni_obrazek_popis"'));
  });

  test('rysovani, postup a reseni_obrazek fungují i v běžné lekci', () => {
    const l = kopie(ZAKLAD);
    l.ulohy[2].kroky = [{ id: 'final', popisek: 'Narýsuj', vstup: { typ: 'rysovani' }, postup: true }];
    Object.assign(l.ulohy[2].tahak, {
      reseni_obrazek: KONSTRUKCE_SVG, reseni_obrazek_popis: 'Konstrukce.', kontrola_rodice: ['„A?“', '„B?“'],
    });
    assert.deepEqual(over(l).chyby, []);
  });
});

describe('Fáze 2 — lekce, bloky a kapitoly', () => {
  const lekceF2 = (id, tyden) => ({
    ...kopie(ZAKLAD), id, faze: 'faze2', tyden, poradi: 1,
    ulohy: kopie(ZAKLAD).ulohy.map((u) => ({ ...u, id: u.id.replace('P9', id) })),
  });

  test('běžná lekce faze2 (tyden 1–13) projde; tyden 14 = chyba', () => {
    assert.deepEqual(over(lekceF2('F2-T01-L1', 1)).chyby, []);
    assert.ok(obsahuje(over(lekceF2('F2-T14-L1', 14)).chyby, 'faze2 má týdny 1–13'));
  });

  test('blok s kapitolou mix: úlohy musí mít vlastní (platnou) kapitolu', () => {
    const l = lekceF2('F2-T05-L1', 5);
    l.typ = 'blok';
    l.kapitola = 'mix';
    assert.ok(obsahuje(over(l).chyby, 'každá úloha musí mít vlastní kapitolu'));
    l.ulohy.forEach((u, i) => { u.kapitola = ['zlomky', 'procenta', 'rovnice', 'pomer'][i]; u.pozice = i + 1; });
    assert.deepEqual(over(l).chyby, []);
    l.ulohy[0].kapitola = 'mix';
    assert.ok(obsahuje(over(l).chyby, 'ulohy[0].kapitola'));
  });

  test('pseudo-kapitola simulace jen u lekce typu simulace', () => {
    const l = kopie(ZAKLAD);
    l.kapitola = 'simulace';
    assert.ok(over(l).chyby.length > 0);
  });
});

describe('obsahové .md soubory bez řídicích znaků (rozbitý LaTeX)', () => {
  for (const soubor of ['typy-chyb.md', 'cteni-zapisu.md', 'hlasky.md', 'SABLONA.md', 'manual-rodice.md']) {
    test(`obsah/${soubor}`, async () => {
      const text = await readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'obsah', soubor), 'utf8');
      const radky = text.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /[\u0000-\u0008\u000b-\u001f]/.test(l.replace(/\r$/, '')) || /\t/.test(l));
      assert.deepEqual(radky.map(([n]) => n), [], `řídicí znak (\f, \t…) na řádcích ${radky.map(([n]) => n).join(', ')}`);
    });
  }
});
