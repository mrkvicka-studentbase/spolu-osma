// =====================================================================
// vyhodnoceni.test.js — testy čisté vyhodnocovací logiky (web/js/vyhodnoceni.js)
// Spustit: node --test testy/   (root package.json má "type": "module")
//
// Pokrývá zadání agenti/10-qa-tester.md + doplnění QA promptu:
// čísla, zlomky (vč. základního tvaru), smíšená čísla (vč. záporných), dlaždice,
// text, zname_chyby, neplatne, typografické mínus, matice semaforu (8 kombinací),
// spravnostUlohy, a průchod reálným obsahem obsah/lekce/P*.json.
// =====================================================================

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  normalizujCislo,
  naRacionalni,
  vyhodnotKrok,
  barvaSemaforu,
  spravnostUlohy,
  VOLBY_RODICE,
} from '../web/js/vyhodnoceni.js';

const TENTO_ADRESAR = path.dirname(fileURLToPath(import.meta.url));
// Spolu 8: lekce matematiky z obsah/lekce (M8-*.json, jak je autoři dopíší) + syntetické v testy/data/osma/lekce
const ADRESARE_LEKCI = [path.join(TENTO_ADRESAR, '..', 'obsah', 'lekce'), path.join(TENTO_ADRESAR, 'data', 'osma', 'lekce')];
async function souboryLekci() {
  const vse = [];
  for (const adr of ADRESARE_LEKCI) {
    let nazvy = [];
    try { nazvy = await readdir(adr); } catch { continue; }
    for (const n of nazvy.filter((f) => /^M8-T\d{2}-(L\dN?B?|DIAG|POL)\.json$/.test(f)).sort()) vse.push(path.join(adr, n));
  }
  return vse;
}

// ---------------------------------------------------------------------
// normalizujCislo / naRacionalni
// ---------------------------------------------------------------------

describe('normalizujCislo', () => {
  test('null/undefined → null', () => {
    assert.equal(normalizujCislo(null), null);
    assert.equal(normalizujCislo(undefined), null);
  });

  test('prázdný řetězec → null', () => {
    assert.equal(normalizujCislo(''), null);
    assert.equal(normalizujCislo('   '), null);
  });

  test('odstraní běžné i nezlomitelné mezery', () => {
    assert.equal(normalizujCislo(' 12 '), '12');
    assert.equal(normalizujCislo(' 12 '), '12'); // nezlomitelná mezera (NBSP)
    assert.equal(normalizujCislo('1 234'), '1234');
  });

  test('desetinná čárka → tečka', () => {
    assert.equal(normalizujCislo('12,5'), '12.5');
    assert.equal(normalizujCislo(',5'), '.5');
  });

  test('typografické mínus (U+2212) a pomlčka (U+2013) → "-"', () => {
    assert.equal(normalizujCislo('−5'), '-5');
    assert.equal(normalizujCislo('–5'), '-5');
    assert.equal(normalizujCislo('-5'), '-5');
  });
});

describe('naRacionalni', () => {
  const r = (c, j) => ({ c: BigInt(c), j: BigInt(j) });

  test('celá čísla v různých zápisech jsou rovna 12/1', () => {
    for (const vstup of ['12', '12,0', '12.0', ' 12 ', 12]) {
      assert.deepEqual(naRacionalni(vstup), r(12, 1), `vstup ${JSON.stringify(vstup)}`);
    }
  });

  test('desetinná čísla', () => {
    assert.deepEqual(naRacionalni('0,5'), r(1, 2)); // zkrátí se na 1/2 přes zlomek()
    assert.deepEqual(naRacionalni('0.5'), r(1, 2));
    assert.deepEqual(naRacionalni('-0,5'), r(-1, 2));
    assert.deepEqual(naRacionalni(',5'), r(1, 2));
  });

  test('typografické mínus je platné znaménko', () => {
    assert.deepEqual(naRacionalni('−5'), r(-5, 1));
  });

  test('zápis zlomkem "a/b"', () => {
    assert.deepEqual(naRacionalni('3/4'), r(3, 4));
    assert.deepEqual(naRacionalni('6/8'), r(3, 4)); // zkráceno
  });

  test('neplatné vstupy vrací null', () => {
    for (const vstup of ['', null, undefined, 'abc', '1/0', '--5', NaN, Infinity]) {
      assert.equal(naRacionalni(vstup), null, `vstup ${JSON.stringify(vstup)}`);
    }
  });
});

// ---------------------------------------------------------------------
// vyhodnotKrok — typ "cislo"
// ---------------------------------------------------------------------

describe('vyhodnotKrok — cislo', () => {
  const krok = {
    vstup: { typ: 'cislo', jednotka: null },
    spravne: { hodnota: 12 },
    zname_chyby: [{ hodnota: 8, typ_chyby: 'odecetl-misto-secetl' }],
  };

  test('různé zápisy správné hodnoty 12 se uznají', () => {
    for (const vstup of ['12', '12,0', '12.0', ' 12 ', 12]) {
      const v = vyhodnotKrok(krok, vstup);
      assert.equal(v.spravne, true, `vstup ${JSON.stringify(vstup)}`);
      assert.equal(v.typ_chyby, null);
      assert.equal(v.neplatne, false);
    }
  });

  test('typografické mínus u záporné správné hodnoty', () => {
    const k = { vstup: { typ: 'cislo' }, spravne: { hodnota: -6.5 }, zname_chyby: [] };
    const v = vyhodnotKrok(k, '−6,5');
    assert.equal(v.spravne, true);
  });

  test('známá chyba se rozpozná podle typ_chyby', () => {
    const v = vyhodnotKrok(krok, '8');
    assert.equal(v.spravne, false);
    assert.equal(v.typ_chyby, 'odecetl-misto-secetl');
  });

  test('jiná špatná hodnota (mimo zname_chyby) → spravne false, typ_chyby null', () => {
    const v = vyhodnotKrok(krok, '999');
    assert.equal(v.spravne, false);
    assert.equal(v.typ_chyby, null);
  });

  test('neplatne: true pro prázdný nebo nečitelný vstup, nepočítá se jako pokus', () => {
    for (const vstup of ['', '   ', 'abc', null, undefined]) {
      const v = vyhodnotKrok(krok, vstup);
      assert.equal(v.neplatne, true, `vstup ${JSON.stringify(vstup)}`);
      assert.equal(v.spravne, false);
      assert.equal(v.typ_chyby, null);
    }
  });
});

// ---------------------------------------------------------------------
// vyhodnotKrok — typ "zlomek"
// ---------------------------------------------------------------------

describe('vyhodnotKrok — zlomek', () => {
  test('3/4 zadáno jako 6/8 → správně, ale poznámka "nezkraceno" (kontrola_tvaru)', () => {
    const krok = { vstup: { typ: 'zlomek' }, spravne: { c: 3, j: 4 }, kontrola_tvaru: 'zakladni_tvar', zname_chyby: [] };
    const v = vyhodnotKrok(krok, { c: '6', j: '8' });
    assert.equal(v.spravne, true);
    assert.equal(v.poznamka, 'nezkraceno');
  });

  test('6/8 bez kontrola_tvaru → správně bez poznámky', () => {
    const krok = { vstup: { typ: 'zlomek' }, spravne: { c: 3, j: 4 }, zname_chyby: [] };
    const v = vyhodnotKrok(krok, { c: 6, j: 8 });
    assert.equal(v.spravne, true);
    assert.equal(v.poznamka, null);
  });

  test('výsledek už v základním tvaru → žádná poznámka', () => {
    const krok = { vstup: { typ: 'zlomek' }, spravne: { c: 1, j: 3 }, kontrola_tvaru: 'zakladni_tvar', zname_chyby: [] };
    const v = vyhodnotKrok(krok, { c: 1, j: 3 });
    assert.equal(v.spravne, true);
    assert.equal(v.poznamka, null);
  });

  test('prázdný jmenovatel = celé číslo (6 → 6/1)', () => {
    const krok = { vstup: { typ: 'zlomek' }, spravne: { c: 6, j: 1 }, zname_chyby: [] };
    const v = vyhodnotKrok(krok, { c: '6', j: '' });
    assert.equal(v.spravne, true);
    assert.equal(v.neplatne, false);
  });

  test('prázdný jmenovatel odpovídá i typu chyby zapsanému jako celé číslo', () => {
    const krok = {
      vstup: { typ: 'zlomek' },
      spravne: { c: 7, j: 15 },
      zname_chyby: [{ c: 2, j: 1, typ_chyby: 'napsal-cele-cislo' }],
    };
    const v = vyhodnotKrok(krok, { c: '2' }); // bez j
    assert.equal(v.spravne, false);
    assert.equal(v.typ_chyby, 'napsal-cele-cislo');
  });

  test('jmenovatel 0 nebo nečitelný vstup → neplatne', () => {
    const krok = { vstup: { typ: 'zlomek' }, spravne: { c: 1, j: 2 }, zname_chyby: [] };
    for (const vstup of [{ c: '5', j: '0' }, { c: 'a', j: '2' }, {}, null]) {
      const v = vyhodnotKrok(krok, vstup);
      assert.equal(v.neplatne, true, `vstup ${JSON.stringify(vstup)}`);
    }
  });

  test('známá chyba u zlomku', () => {
    const krok = {
      vstup: { typ: 'zlomek' },
      spravne: { c: 7, j: 15 },
      kontrola_tvaru: 'zakladni_tvar',
      zname_chyby: [
        { c: 7, j: 30, typ_chyby: 'scital-citatele-i-jmenovatele' },
        { c: 2, j: 15, typ_chyby: 'neprepocital-citatel' },
      ],
    };
    let v = vyhodnotKrok(krok, { c: 7, j: 30 });
    assert.equal(v.spravne, false);
    assert.equal(v.typ_chyby, 'scital-citatele-i-jmenovatele');
    v = vyhodnotKrok(krok, { c: 2, j: 15 });
    assert.equal(v.typ_chyby, 'neprepocital-citatel');
  });
});

// ---------------------------------------------------------------------
// vyhodnotKrok — typ "smisene"
// ---------------------------------------------------------------------

describe('vyhodnotKrok — smisene', () => {
  test('kladné smíšené číslo', () => {
    const krok = { vstup: { typ: 'smisene' }, spravne: { cela: 1, c: 1, j: 4 }, zname_chyby: [] };
    const v = vyhodnotKrok(krok, { cela: '1', c: '1', j: '4' });
    assert.equal(v.spravne, true);
  });

  test('záporné smíšené číslo: -2 1/3 = -(2 + 1/3) = -7/3', () => {
    const krok = { vstup: { typ: 'smisene' }, spravne: { cela: -7, c: 7, j: 3 }, zname_chyby: [] };
    // -7/3 zapsané jako smíšené: cela -2, c 1, j 3 (spravne.hodnota v testu porovnáváme přes ekvivalentní vstup)
    const vOcek = vyhodnotKrok({ vstup: { typ: 'smisene' }, spravne: { cela: 2, c: 1, j: 3 }, zname_chyby: [] }, { cela: '2', c: '1', j: '3' });
    assert.equal(vOcek.spravne, true); // kontrolní: kladná varianta funguje
    const vZaporne = vyhodnotKrok(
      { vstup: { typ: 'smisene' }, spravne: { cela: -2, c: 1, j: 3 }, zname_chyby: [] },
      { cela: '-2', c: '1', j: '3' },
    );
    assert.equal(vZaporne.spravne, true);
    // znaménko nese i jen "cela: -0" (dítě zapsalo desetinnou nulu se znaménkem)
    const vNulaSeZnamenkem = vyhodnotKrok(
      { vstup: { typ: 'smisene' }, spravne: { cela: '-0', c: 1, j: 3 }, zname_chyby: [] },
      { cela: '-0', c: '1', j: '3' },
    );
    assert.equal(vNulaSeZnamenkem.spravne, true);
  });

  test('kontrola_tvaru zakladni_tvar u smíšeného čísla → poznámka nezkraceno', () => {
    const krok = { vstup: { typ: 'smisene' }, spravne: { cela: 1, c: 1, j: 4 }, kontrola_tvaru: 'zakladni_tvar', zname_chyby: [] };
    const v = vyhodnotKrok(krok, { cela: '1', c: '2', j: '8' }); // 2/8 nezkráceno
    assert.equal(v.spravne, true);
    assert.equal(v.poznamka, 'nezkraceno');
  });

  test('neplatné smíšené číslo (záporný čitatel/jmenovatel, nečíselné, chybějící) → neplatne', () => {
    const krok = { vstup: { typ: 'smisene' }, spravne: { cela: 1, c: 1, j: 4 }, zname_chyby: [] };
    for (const vstup of [{ cela: '1', c: '-1', j: '4' }, { cela: '1', c: '1', j: '0' }, { cela: '1', c: 'x', j: '4' }, {}]) {
      const v = vyhodnotKrok(krok, vstup);
      assert.equal(v.neplatne, true, `vstup ${JSON.stringify(vstup)}`);
    }
  });

  test('prázdná celá část = 0 (jen zlomek)', () => {
    const krok = { vstup: { typ: 'smisene' }, spravne: { cela: 0, c: 1, j: 4 }, zname_chyby: [] };
    const v = vyhodnotKrok(krok, { cela: '', c: '1', j: '4' });
    assert.equal(v.spravne, true);
  });
});

// ---------------------------------------------------------------------
// vyhodnotKrok — typ "dlazdice"
// ---------------------------------------------------------------------

describe('vyhodnotKrok — dlazdice', () => {
  const krok = {
    vstup: {
      typ: 'dlazdice',
      moznosti: [
        { id: 'a', text: 'A', spravne: false, typ_chyby: 'chyba-a' },
        { id: 'b', text: 'B', spravne: true },
        { id: 'c', text: 'C', spravne: false, typ_chyby: 'chyba-c' },
      ],
    },
  };

  test('správná dlaždice (id string)', () => {
    const v = vyhodnotKrok(krok, 'b');
    assert.equal(v.spravne, true);
    assert.equal(v.typ_chyby, null);
  });

  test('správná dlaždice (id v objektu {id})', () => {
    const v = vyhodnotKrok(krok, { id: 'b' });
    assert.equal(v.spravne, true);
  });

  test('distraktor → spravne false + typ_chyby', () => {
    const v = vyhodnotKrok(krok, 'a');
    assert.equal(v.spravne, false);
    assert.equal(v.typ_chyby, 'chyba-a');
    const v2 = vyhodnotKrok(krok, 'c');
    assert.equal(v2.typ_chyby, 'chyba-c');
  });

  test('neexistující id → neplatne', () => {
    const v = vyhodnotKrok(krok, 'neexistuje');
    assert.equal(v.neplatne, true);
  });
});

// ---------------------------------------------------------------------
// vyhodnotKrok — typ "text" a neznámý typ
// ---------------------------------------------------------------------

describe('vyhodnotKrok — text', () => {
  const krok = { vstup: { typ: 'text' } };

  test('neprázdný text → spravne null, poznamka hodnoti-rodic', () => {
    const v = vyhodnotKrok(krok, 'Byl jednou jeden traktor.');
    assert.equal(v.spravne, null);
    assert.equal(v.poznamka, 'hodnoti-rodic');
    assert.equal(v.neplatne, false);
  });

  test('prázdný / jen mezery / null → neplatne', () => {
    for (const vstup of ['', '   ', null, undefined, 42]) {
      const v = vyhodnotKrok(krok, vstup);
      assert.equal(v.neplatne, true, `vstup ${JSON.stringify(vstup)}`);
    }
  });
});

test('vyhodnotKrok — neznámý typ vstupu vyhodí chybu', () => {
  assert.throws(() => vyhodnotKrok({ vstup: { typ: 'neco-jineho' } }, '1'));
});

// ---------------------------------------------------------------------
// barvaSemaforu — všech 8 kombinací matice (kostra/02)
// ---------------------------------------------------------------------

describe('barvaSemaforu — matice (8 kombinací)', () => {
  const ocekavani = [
    ['sam', true, 'zelena', null],
    ['sam', false, 'oranzova', null],
    ['s_otazkou', true, 'zelena', 'priste-bez-otazky'],
    ['s_otazkou', false, 'oranzova', null],
    ['chyba_pocty', true, 'oranzova', null],
    ['chyba_pocty', false, 'oranzova', null],
    ['nevedel', true, 'oranzova', null],
    ['nevedel', false, 'cervena', null],
  ];

  for (const [volba, spravne, barva, poznamka] of ocekavani) {
    test(`${volba} + spravne=${spravne} → ${barva}${poznamka ? ' (' + poznamka + ')' : ''}`, () => {
      const v = barvaSemaforu(volba, spravne);
      assert.equal(v.barva, barva);
      assert.equal(v.poznamka, poznamka);
    });
  }

  test('spravne null/undefined se počítá jako sloupec "špatně / neodevzdáno"', () => {
    assert.deepEqual(barvaSemaforu('sam', null), { barva: 'oranzova', poznamka: null });
    assert.deepEqual(barvaSemaforu('sam', undefined), { barva: 'oranzova', poznamka: null });
    assert.deepEqual(barvaSemaforu('nevedel', null), { barva: 'cervena', poznamka: null });
  });

  test('VOLBY_RODICE obsahuje přesně 4 hodnoty použité v matici', () => {
    assert.deepEqual([...VOLBY_RODICE].sort(), ['chyba_pocty', 'nevedel', 's_otazkou', 'sam']);
  });

  test('neznámá volba rodiče vyhodí chybu', () => {
    assert.throws(() => barvaSemaforu('neco-jineho', true));
  });
});

// ---------------------------------------------------------------------
// spravnostUlohy
// ---------------------------------------------------------------------

describe('spravnostUlohy', () => {
  test('žádné odpovědi → null', () => {
    assert.equal(spravnostUlohy([]), null);
    assert.equal(spravnostUlohy(undefined), null);
  });

  test('žádný krok "final" mezi odpověďmi → null', () => {
    assert.equal(spravnostUlohy([{ krok_id: 'k1', pokus: 1, spravne: true, id: 1, created_at: '2026-01-01T10:00:00Z' }]), null);
  });

  test('jediná odpověď final', () => {
    assert.equal(spravnostUlohy([{ krok_id: 'final', pokus: 1, spravne: true, id: 1, created_at: '2026-01-01T10:00:00Z' }]), true);
    assert.equal(spravnostUlohy([{ krok_id: 'final', pokus: 1, spravne: false, id: 2, created_at: '2026-01-01T10:00:00Z' }]), false);
    assert.equal(spravnostUlohy([{ krok_id: 'final', pokus: 1, spravne: null, id: 3, created_at: '2026-01-01T10:00:00Z' }]), null);
  });

  test('bere se POSLEDNÍ final podle created_at, bez ohledu na zadal (dítě vs. rodič)', () => {
    const odpovedi = [
      { krok_id: 'final', pokus: 1, spravne: false, zadal: 'dite', id: 1, created_at: '2026-01-01T10:00:00Z' },
      { krok_id: 'final', pokus: 2, spravne: true, zadal: 'rodic', id: 2, created_at: '2026-01-01T10:05:00Z' },
    ];
    assert.equal(spravnostUlohy(odpovedi), true);
    // opačné pořadí v poli nesmí vadit, řadí se podle created_at
    assert.equal(spravnostUlohy([...odpovedi].reverse()), true);
  });

  test('shodný created_at → rozhoduje id', () => {
    const odpovedi = [
      { krok_id: 'final', pokus: 1, spravne: true, id: 5, created_at: '2026-01-01T10:00:00Z' },
      { krok_id: 'final', pokus: 1, spravne: false, id: 9, created_at: '2026-01-01T10:00:00Z' },
    ];
    assert.equal(spravnostUlohy(odpovedi), false); // vyšší id je "novější"
  });

  test('řádek bez created_at/id (čeká ve frontě) je nejnovější', () => {
    const odpovedi = [
      { krok_id: 'final', pokus: 1, spravne: false, id: 1, created_at: '2026-01-01T10:00:00Z' },
      { krok_id: 'final', pokus: 2, spravne: true }, // ve frontě: bez id/created_at
    ];
    assert.equal(spravnostUlohy(odpovedi), true);
  });

  test('shoda created_at i id (oba chybí) → rozhoduje pokus', () => {
    const odpovedi = [
      { krok_id: 'final', pokus: 1, spravne: false },
      { krok_id: 'final', pokus: 2, spravne: true },
    ];
    assert.equal(spravnostUlohy(odpovedi), true);
  });

  test('nekrokové "final" odpovědi jiných úloh se ignorují (volající musí filtrovat na jednu úlohu)', () => {
    const odpovedi = [
      { krok_id: 'k1', pokus: 1, spravne: true, id: 1, created_at: '2026-01-01T10:00:00Z' },
      { krok_id: 'final', pokus: 1, spravne: false, id: 2, created_at: '2026-01-01T10:01:00Z' },
    ];
    assert.equal(spravnostUlohy(odpovedi), false);
  });
});

// ---------------------------------------------------------------------
// Reálný obsah: obsah/lekce/P*.json — každý krok musí sedět s vyhodnotKrok()
// ---------------------------------------------------------------------

describe('lekce matematiky Spolu 8 (obsah/lekce + testy/data/osma) odpovídají vyhodnotKrok()', () => {
  test('aspoň syntetické lekce M8-* existují', async () => {
    assert.ok((await souboryLekci()).length >= 5, 'očekávám aspoň testy/data/osma/lekce/M8-*.json');
  });

  const hodnotaProTyp = (typ, zaznam) => {
    if (typ === 'cislo') return String(zaznam.hodnota);
    if (typ === 'zlomek') return { c: zaznam.c, j: zaznam.j };
    if (typ === 'smisene') return { cela: zaznam.cela ?? 0, c: zaznam.c, j: zaznam.j };
    throw new Error(`hodnotaProTyp: nepodporovaný typ ${typ}`);
  };

  test('všechny lekce: dlaždice, správné hodnoty i známé chyby vyhodnotí vyhodnotKrok() podle JSON', async (t) => {
    const soubory = await souboryLekci();
    assert.ok(soubory.length > 0);

    for (const soubor of soubory) {
      const lekce = JSON.parse(await readFile(soubor, 'utf8'));
      await t.test(`lekce ${lekce.id} (${soubor})`, async (t2) => {
        for (const uloha of lekce.ulohy) {
          for (const krok of uloha.kroky) {
            const typ = krok.vstup?.typ;
            const popis = `${uloha.id}/${krok.id} (${typ})`;

            if (typ === 'dlazdice') {
              await t2.test(`${popis} — každá dlaždice`, () => {
                for (const m of krok.vstup.moznosti) {
                  const v = vyhodnotKrok(krok, m.id);
                  assert.equal(v.spravne, m.spravne, `dlaždice ${m.id} v ${popis}`);
                  assert.equal(v.typ_chyby, m.typ_chyby ?? null, `typ_chyby dlaždice ${m.id} v ${popis}`);
                }
              });
              continue;
            }

            if (typ === 'cislo' || typ === 'zlomek' || typ === 'smisene') {
              await t2.test(`${popis} — správná hodnota`, () => {
                const v = vyhodnotKrok(krok, hodnotaProTyp(typ, krok.spravne));
                assert.equal(v.spravne, true, `správná hodnota v ${popis}`);
                assert.equal(v.neplatne, false);
              });

              if (Array.isArray(krok.zname_chyby)) {
                await t2.test(`${popis} — každá zname_chyby`, () => {
                  for (const z of krok.zname_chyby) {
                    const v = vyhodnotKrok(krok, hodnotaProTyp(typ, z));
                    assert.equal(v.spravne, false, `zname_chyby ${JSON.stringify(z)} v ${popis} nemělo vyjít spravne=false`);
                    assert.equal(v.typ_chyby, z.typ_chyby, `typ_chyby pro zname_chyby ${JSON.stringify(z)} v ${popis}`);
                  }
                });
              }
              continue;
            }

            if (typ === 'vyraz' || typ === 'poradi') {
              await t2.test(`${popis} — správná hodnota a známé chyby`, () => {
                const sp = typ === 'vyraz' ? krok.spravne.vyraz : krok.spravne.poradi[0];
                assert.equal(vyhodnotKrok(krok, sp).spravne, true, `správná hodnota v ${popis}`);
                for (const z of krok.zname_chyby || []) {
                  const v = vyhodnotKrok(krok, typ === 'vyraz' ? z.vyraz : z.poradi);
                  assert.equal(v.spravne, false, popis);
                  assert.equal(v.typ_chyby, z.typ_chyby, popis);
                }
              });
              continue;
            }

            if (typ === 'text') {
              await t2.test(`${popis} — text čeká na rodiče`, () => {
                const v = vyhodnotKrok(krok, 'nějaká odpověď dítěte');
                assert.equal(v.spravne, null);
                assert.equal(v.poznamka, 'hodnoti-rodic');
              });
              continue;
            }

            assert.fail(`Neznámý/neošetřený typ vstupu "${typ}" v ${popis}`);
          }
        }
      });
    }
  });
});
