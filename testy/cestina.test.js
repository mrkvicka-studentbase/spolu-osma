// =====================================================================
// cestina.test.js — Čeština: základy (cestina/Obsah/FORMAT-CJ.md)
// Spustit: npm test
//
// Pokrývá: tokenizaci a normalizaci, všechny nové vstupy (vyhodnoceni-cj.js) v kontraktu vyhodnotKrok
// (spravne, typ_chyby, poznamka, neplatne), poslech přes vnořený vstup (i dlaždice Matematiky), papírový režim,
// diktát slovo po slovu, oddělení větví schématu (Matematika ≠ čeština) a průchod všemi lekcemi
// obsah/cestina/lekce/*.json validátorem seedu (schéma + doménové kontroly + průchod vyhodnocením).
// =====================================================================

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { vyhodnotKrok } from '../web/js/vyhodnoceni.js';
import { tokenizuj, normalizuj, rozdelDoplnovacku, porovnejSlova, TYPY_VSTUPU_CJ, vzorovaOdpoved } from '../web/js/vyhodnoceni-cj.js';
import { zkontrolujLekci, validuj } from '../supabase/seed/validator.mjs';
import { parsujSlovnikChybCj } from '../supabase/seed/validator-cj.mjs';

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ADRESAR_CJ = path.join(KOREN, 'obsah', 'cestina', 'lekce');
const kody = (r) => (r.chyby || []).map((c) => c.kod);

describe('text', () => {
  test('tokenizace: interpunkce se ke slovu nepočítá, indexy od 0', () => {
    const t = tokenizuj('Babička peče v kuchyni voňavý koláč. Vůně se šíří po celém domě.');
    assert.equal(t.length, 12);
    assert.equal(t[6].slovo, 'Vůně');
    assert.equal(t[11].slovo, 'domě');
    assert.deepEqual(tokenizuj('Ráno, když…').map((x) => x.slovo), ['Ráno', 'když']);
  });
  test('normalizace: diakritika zůstává, velikost jen na přání, ořez interpunkce', () => {
    assert.equal(normalizuj('  učitele. '), 'učitele');
    assert.notEqual(normalizuj('ucitele'), normalizuj('učitele'));
    assert.equal(normalizuj('Učitele', { ignorovatVelikost: true }), 'učitele');
    assert.equal(normalizuj('dva   stromy!'), 'dva stromy');
  });
  test('doplňovačka: části textu a mezery', () => {
    assert.equal(rozdelDoplnovacku('Mezi dom_ rostl_.').filter((c) => 'mezera' in c).length, 2);
  });
});

describe('nové vstupy v kontraktu vyhodnotKrok', () => {
  const klik = {
    vstup: { typ: 'klik_ve_textu', text: 'Babička peče v kuchyni voňavý koláč. Vůně se šíří po celém domě.', cil: 'slova', min: 1, max: 8, volitelne: [7] },
    spravne: [0, 3, 5, 6, 11],
    zname_chyby: [
      { navic: [4, 10], typ_chyby: 'sd-pridavne-za-podstatne' },
      { chybi: [6], typ_chyby: 'sd-vlastnost-neni-podstatne' },
    ],
  };

  test('všechny typy jsou zaregistrované', () => {
    for (const t of ['dlazdice_vice', 'klik_ve_textu', 'oznac_role', 'doplnit_pismeno', 'kratky_text', 'seradit', 'poslech', 'diktat']) {
      assert.ok(TYPY_VSTUPU_CJ.includes(t), t);
    }
  });

  test('klik: správně bez ohledu na pořadí, volitelné slovo nevadí', () => {
    assert.deepEqual(vyhodnotKrok(klik, [11, 6, 5, 3, 0]), { spravne: true, typ_chyby: null, poznamka: null, neplatne: false, chyby: [], detail: { chybi: [], navic: [] } });
    assert.equal(vyhodnotKrok(klik, [0, 3, 5, 6, 7, 11]).spravne, true);
  });

  test('klik: navíc i chybí najednou → oba kódy, typ_chyby = první', () => {
    const r = vyhodnotKrok(klik, [0, 3, 4, 5, 11]);
    assert.equal(r.spravne, false);
    assert.deepEqual(new Set(kody(r)), new Set(['sd-pridavne-za-podstatne', 'sd-vlastnost-neni-podstatne']));
    assert.equal(r.typ_chyby, 'sd-pridavne-za-podstatne');
    assert.deepEqual(r.detail, { chybi: [6], navic: [4] });
  });

  test('klik: nepokrytý prvek = obecná chyba (typ_chyby null)', () => {
    const r = vyhodnotKrok(klik, [0, 3, 5, 6, 9, 11]);
    assert.equal(r.spravne, false);
    assert.equal(r.typ_chyby, null);
    assert.deepEqual(kody(r), [null]);
  });

  test('klik: prázdná odpověď nebo víc než max = neplatne (nepočítá se jako pokus)', () => {
    assert.equal(vyhodnotKrok(klik, []).neplatne, true);
    assert.equal(vyhodnotKrok(klik, [0, 1, 2, 3, 4, 5, 6, 8, 9]).neplatne, true);
    assert.equal(vyhodnotKrok(klik, [99]).neplatne, true);
  });

  test('dlaždice více: množina řetězců', () => {
    const k = { vstup: { typ: 'dlazdice_vice', moznosti: ['běhání', 'běží', 'běžec', 'rychlost'] }, spravne: ['běhání', 'běžec', 'rychlost'],
      zname_chyby: [{ chybi: ['běhání', 'rychlost'], typ_chyby: 'sd-vlastnost-neni-podstatne' }, { navic: ['běží'], typ_chyby: 'sd-sloveso-za-podstatne' }] };
    assert.equal(vyhodnotKrok(k, ['rychlost', 'běžec', 'běhání']).spravne, true);
    assert.equal(vyhodnotKrok(k, ['běžec']).typ_chyby, 'sd-vlastnost-neni-podstatne');
    assert.equal(vyhodnotKrok(k, []).neplatne, true);
    assert.equal(vyhodnotKrok(k, ['kočka']).neplatne, true);
  });

  test('doplň písmeno: každá mezera zvlášť, null = cokoli, neúplné = neplatne', () => {
    const k = { vstup: { typ: 'doplnit_pismeno', text: 'Mezi dom_ rostl_ vysoké strom_.', mezery: [0, 1, 2].map((i) => ({ i, moznosti: ['i', 'y'] })) },
      spravne: ['y', 'y', 'y'],
      zname_chyby: [{ hodnota: ['i', null, null], typ_chyby: 'koncovka-podst-i-za-y' }, { hodnota: [null, 'i', null], typ_chyby: 'shoda-i-za-y' }] };
    assert.equal(vyhodnotKrok(k, ['y', 'y', 'y']).spravne, true);
    const r = vyhodnotKrok(k, ['i', 'i', 'i']);
    assert.deepEqual(r.chyby, [{ kod: 'koncovka-podst-i-za-y', kde: 0 }, { kod: 'shoda-i-za-y', kde: 1 }, { kod: null, kde: 2 }]);
    assert.equal(vyhodnotKrok(k, ['y', null, 'y']).neplatne, true);
  });

  test('označ role: po slovech i po kategoriích', () => {
    const k = { vstup: { typ: 'oznac_role', text: 'Babička peče v kuchyni koláč.', slova: [0, 1, 4], role: ['podstatné jméno', 'přídavné jméno', 'sloveso'] },
      spravne: { 0: 'podstatné jméno', 1: 'sloveso', 4: 'podstatné jméno' },
      zname_chyby: [{ hodnota: { 1: 'podstatné jméno' }, typ_chyby: 'sd-sloveso-za-podstatne' }] };
    assert.equal(vyhodnotKrok(k, { 0: 'podstatné jméno', 1: 'sloveso', 4: 'podstatné jméno' }).spravne, true);
    const r = vyhodnotKrok(k, { 0: 'podstatné jméno', 1: 'podstatné jméno', 4: 'sloveso' });
    assert.deepEqual(r.chyby, [{ kod: 'sd-sloveso-za-podstatne', kde: '1' }, { kod: null, kde: '4' }]);
    assert.equal(vyhodnotKrok(k, { 0: 'podstatné jméno' }).neplatne, true);

    const kat = { vstup: { typ: 'oznac_role', text: 'Vidím psa.', slova: [1], role: { rod: ['mužský', 'ženský'], pad: ['1.', '4.'] } },
      spravne: { 1: { rod: 'mužský', pad: '4.' } }, zname_chyby: [{ hodnota: { 1: { pad: '1.' } }, typ_chyby: 'pad-1-za-4' }] };
    assert.equal(vyhodnotKrok(kat, { 1: { rod: 'mužský', pad: '4.' } }).spravne, true);
    assert.equal(vyhodnotKrok(kat, { 1: { rod: 'mužský', pad: '1.' } }).typ_chyby, 'pad-1-za-4');
    assert.equal(vyhodnotKrok(kat, { 1: { rod: 'mužský' } }).neplatne, true);
  });

  test('krátký text: diakritika se neignoruje, velikost podle pole', () => {
    const k = { vstup: { typ: 'kratky_text' }, spravne: 'učitele', varianty: [], ignorovat_velikost: true,
      zname_chyby: [{ hodnota: 'učitela', typ_chyby: 'vzor-pan-za-muz' }] };
    assert.equal(vyhodnotKrok(k, ' Učitele. ').spravne, true);
    assert.equal(vyhodnotKrok(k, 'ucitele').spravne, false);
    assert.equal(vyhodnotKrok(k, 'učitela').typ_chyby, 'vzor-pan-za-muz');
    assert.equal(vyhodnotKrok(k, '  ').neplatne, true);
  });

  test('seřadit: pořadí a neúplnost', () => {
    const k = { vstup: { typ: 'seradit', polozky: ['kdo co', 'bez koho čeho', 'ke komu čemu'] }, spravne: ['kdo co', 'bez koho čeho', 'ke komu čemu'], zname_chyby: [] };
    assert.equal(vyhodnotKrok(k, ['kdo co', 'bez koho čeho', 'ke komu čemu']).spravne, true);
    assert.equal(vyhodnotKrok(k, ['bez koho čeho', 'kdo co', 'ke komu čemu']).spravne, false);
    assert.equal(vyhodnotKrok(k, ['kdo co']).neplatne, true);
  });

  test('poslech s dlaždicemi Matematiky: vyhodnocuje vnořený vstup', () => {
    const k = { vstup: { typ: 'poslech', audio: 'audio/cestina/t1/l2-u4.mp3', prepis: 'Táta včera koupil nové kolo.', max_prehrani: 0,
      vnoreny_vstup: { typ: 'dlazdice', moznosti: [
        { id: 'a', text: 'táta', spravne: false }, { id: 'b', text: 'koupil', spravne: true },
        { id: 'c', text: 'kolo', spravne: false, typ_chyby: 'sd-sloveso-za-podstatne' }] } } };
    assert.equal(vyhodnotKrok(k, 'b').spravne, true);
    assert.equal(vyhodnotKrok(k, 'c').typ_chyby, 'sd-sloveso-za-podstatne');
    assert.equal(vyhodnotKrok(k, 'a').typ_chyby, null);
    assert.equal(vyhodnotKrok(k, null).neplatne, true);
    assert.equal(vzorovaOdpoved(k), 'b');
  });

  test('poslech s novým vstupem uvnitř', () => {
    const k = { vstup: { typ: 'poslech', audio: 'audio/cestina/t1/x.mp3', prepis: 'x', max_prehrani: 0,
      vnoreny_vstup: { typ: 'dlazdice_vice', moznosti: ['a', 'b', 'c'] } }, spravne: ['a', 'c'], zname_chyby: [] };
    assert.equal(vyhodnotKrok(k, ['c', 'a']).spravne, true);
    assert.equal(vyhodnotKrok(k, ['a']).spravne, false);
  });

  test('papírový režim: rodič Sedí / Nesedí', () => {
    assert.equal(vyhodnotKrok(klik, { rodic: 'sedi' }).spravne, true);
    assert.equal(vyhodnotKrok(klik, { rodic: 'nesedi' }).spravne, false);
    assert.equal(vyhodnotKrok(klik, { rodic: 'jine' }).neplatne, true);
  });

  test('diktát: slovo po slovu, jiné / chybí / navíc, očekávaný jev', () => {
    const k = { vstup: { typ: 'diktat', vety: [{ audio: 'a', text: 'Mezi domy rostly vysoké stromy.' }, { audio: 'b', text: 'Babička nesla koš plný hub.' }],
      max_prehrani: 2, hodnotit_interpunkci: false, hodnotit_velikost: false },
    spravne: null, chyby_ocekavane: [{ veta: 0, slovo: 1, typ_chyby: 'koncovka-podst-i-za-y' }] };
    assert.equal(vyhodnotKrok(k, ['mezi domy rostly vysoké stromy', 'Babička nesla koš plný hub']).spravne, true);
    const r = vyhodnotKrok(k, ['Mezi domi rostly vysoké stromy.', 'Babička nesla velký koš plný']);
    assert.deepEqual(kody(r), ['diktat-pravopis-koncovka-podst-i-za-y', 'diktat-slovo-navic', 'diktat-vynechane-slovo']);
    assert.equal(vyhodnotKrok(k, ['', ' ']).neplatne, true);
    const ops = porovnejSlova(tokenizuj('a b c').map((t) => ({ klic: t.slovo })), tokenizuj('a x c').map((t) => ({ klic: t.slovo })));
    assert.deepEqual(ops.map((o) => o.op), ['shoda', 'jine', 'shoda']);
  });
});

describe('schéma a validátor', async () => {
  const schema = JSON.parse(await readFile(path.join(KOREN, 'obsah', 'schema.json'), 'utf8'));
  const slovnikCj = parsujSlovnikChybCj(await readFile(path.join(KOREN, 'cestina', 'Obsah', 'TYPY-CHYB.md'), 'utf8'));
  const audioMd = await readFile(path.join(KOREN, 'cestina', 'Obsah', 'AUDIO.md'), 'utf8');
  const soubory = (await readdir(ADRESAR_CJ)).filter((n) => /^cj-t\d+-l\d+\.json$/.test(n)).sort();

  test('slovník chyb češtiny se načte (detektiv, diktát, dvojice kódů a zkratka vs-m-*)', () => {
    assert.ok(!slovnikCj.has('diktat-pravopis-<kód>') && slovnikCj.size > 80, String(slovnikCj.size));
    for (const kod of ['sd-pridavne-za-podstatne', 'sd-podstatne-za-sloveso', 'detektiv-jine-slovo', 'detektiv-oprava-jine-chyby', 'diktat-slovo-navic',
      'vs-b-i-za-y', 'vs-b-y-za-i', 'vs-m-i-za-y', 'vs-z-y-za-i', 'me-mne-zamena']) {
      assert.ok(slovnikCj.has(kod), kod);
    }
  });

  test('Matematika neodpovídá větvi češtiny a naopak', async () => {
    const mat = JSON.parse(await readFile(path.join(KOREN, 'obsah', 'lekce', 'F1-T01-L1.json'), 'utf8'));
    assert.ok(validuj({ $ref: '#/$defs/lekceCestina' }, mat, '', schema).length > 0);
    const cj = JSON.parse(await readFile(path.join(ADRESAR_CJ, soubory[0]), 'utf8'));
    assert.ok(validuj({ $ref: '#/$defs/lekceBezna' }, cj, '', schema).length > 0);
  });

  test('týden 1 má 4 lekce', () => {
    assert.deepEqual(soubory.filter((s) => s.startsWith('cj-t1-')), ['cj-t1-l1.json', 'cj-t1-l2.json', 'cj-t1-l3.json', 'cj-t1-l4.json']);
  });

  test('validátor: přepis nahrávky v zadání nebo v tisku = chyba (dítě ho nesmí vidět)', async () => {
    const data = JSON.parse(await readFile(path.join(ADRESAR_CJ, 'cj-t1-l2.json'), 'utf8'));
    const u = data.ulohy.find((x) => x.kroky.some((k) => k.vstup.typ === 'poslech'));
    const prepis = u.kroky.find((k) => k.vstup.typ === 'poslech').vstup.prepis;
    const veta = prepis.split(/(?<=[.!?…])\s+/).find((v) => v.split(' ').length >= 3);
    u.tisk.zadani = `${u.tisk.zadani}\n\n${veta.toUpperCase()}`;
    const { chyby } = zkontrolujLekci(data, 'cj-t1-l2.json', { schema, slovnik: slovnikCj, audioMd });
    assert.ok(chyby.some((c) => /tisk\.zadani obsahuje text nahrávky/.test(c)), JSON.stringify(chyby));
  });

  for (const nazev of soubory) {
    test(`${nazev}: schéma, doménové kontroly a průchod vyhodnocením bez chyb`, async () => {
      const data = JSON.parse(await readFile(path.join(ADRESAR_CJ, nazev), 'utf8'));
      const { chyby } = zkontrolujLekci(data, nazev, { schema, slovnik: slovnikCj, audioMd, audioExistuje: (a) => existsSync(path.join(KOREN, 'web', a)) });
      assert.deepEqual(chyby, []);
    });

    test(`${nazev}: každý krok se vzorovou odpovědí vyjde správně`, async () => {
      const data = JSON.parse(await readFile(path.join(ADRESAR_CJ, nazev), 'utf8'));
      for (const u of data.ulohy) {
        for (const k of u.kroky) {
          const r = vyhodnotKrok(k, vzorovaOdpoved(k));
          assert.equal(r.spravne, true, `${u.id}/${k.id}`);
        }
      }
    });

    test(`${nazev}: validátor odhalí rozbitou správnou odpověď`, async () => {
      const data = JSON.parse(await readFile(path.join(ADRESAR_CJ, nazev), 'utf8'));
      const krok = data.ulohy.flatMap((u) => u.kroky).find((k) => k.vstup.typ === 'klik_ve_textu');
      if (!krok) return;
      krok.spravne = [...krok.spravne, 999];
      const { chyby } = zkontrolujLekci(data, nazev, { schema, slovnik: slovnikCj, audioMd });
      assert.ok(chyby.some((c) => /mimo vstup/.test(c)), JSON.stringify(chyby));
    });
  }
});
