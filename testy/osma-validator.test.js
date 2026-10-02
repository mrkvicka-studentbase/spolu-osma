// =====================================================================
// osma-validator.test.js — Spolu 8: formát a validace (fáze osma, M8-*, čeština 5 úloh, cj-t0-diag) a seed.
// Data: syntetické lekce v testy/data/osma/ (převedené ze Spolu, NEJSOU obsahem Spolu 8).
// Síť jen proti lokálnímu falešnému PostgRESTu na 127.0.0.1 — do Supabase se nic nezapisuje.
// =====================================================================
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { zkontrolujLekci, nactiSlovnikChyb, varovaniKapitoly } from '../supabase/seed/validator.mjs';
import { parsujSlovnikChybCj, PORADI_TYPU_ULOH_CJ_OSMA } from '../supabase/seed/validator-cj.mjs';

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(KOREN, 'testy', 'data', 'osma');
const schema = JSON.parse(await readFile(path.join(KOREN, 'obsah', 'schema.json'), 'utf8'));
const slovnik = await nactiSlovnikChyb(path.join(KOREN, 'obsah', 'typy-chyb.md'));
const slovnikCj = parsujSlovnikChybCj(await readFile(path.join(KOREN, 'cestina', 'Obsah', 'TYPY-CHYB.md'), 'utf8'));
const audioMd = await readFile(path.join(KOREN, 'cestina', 'Obsah', 'AUDIO.md'), 'utf8');

const nacti = async (rel) => JSON.parse(await readFile(path.join(DATA, rel), 'utf8'));
const kopie = (x) => structuredClone(x);
const over = (l, nazev = `${l.id}.json`) => zkontrolujLekci(l, nazev, l.predmet === 'cestina'
  ? { schema, slovnik: slovnikCj, audioMd } : { schema, slovnik });
const ma = (pole, vzor) => pole.some((c) => vzor.test(c));

describe('syntetická data Spolu 8 jsou platná', async () => {
  for (const slozka of ['lekce', 'cestina/lekce']) {
    for (const n of (await readdir(path.join(DATA, slozka))).filter((x) => x.endsWith('.json'))) {
      test(`${slozka}/${n}`, async () => {
        const l = await nacti(`${slozka}/${n}`);
        assert.equal(l.faze, 'osma');
        const { chyby } = over(l, n);
        assert.deepEqual(chyby, []);
      });
    }
  }
});

describe('matematika M8', () => {
  test('id určuje fázi, téma a pořadí', async () => {
    const l = await nacti('lekce/M8-T02-L3.json');
    const spatne = { ...kopie(l), tyden: 3, poradi: 1 };
    const { chyby } = over(spatne);
    assert.ok(ma(chyby, /tyden musí být 2/), chyby.join('\n'));
    assert.ok(ma(chyby, /poradi musí být 3/), chyby.join('\n'));
    assert.ok(ma(over({ ...kopie(l), faze: 'faze1' }).chyby, /faze musí být "osma"/));
  });
  test('téma 11 a fáze osma s cizím id neprojdou', async () => {
    const l = await nacti('lekce/M8-T01-L1.json');
    assert.ok(over({ ...kopie(l), id: 'M8-T11-L1', tyden: 11 }, 'M8-T11-L1.json').chyby.length > 0);
    assert.ok(ma(over({ ...kopie(l), id: 'F1-T01-L1' }, 'F1-T01-L1.json').chyby, /faze "osma" má id M8/));
  });
  test('4 úlohy v pořadí rozcvicka, detektiv, cermat, semafor; zdroj CERMAT = varování', async () => {
    const l = await nacti('lekce/M8-T01-L1.json');
    const prehozene = kopie(l);
    [prehozene.ulohy[1], prehozene.ulohy[2]] = [prehozene.ulohy[2], prehozene.ulohy[1]];
    assert.ok(over(prehozene).chyby.length > 0);
    const cermat = kopie(l);
    cermat.ulohy[2].zdroj = 'klon: CERMAT 2024 M9 úloha 5';
    const v = over(cermat);
    assert.deepEqual(v.chyby, []);
    assert.ok(ma(v.varovani, /nemá úlohy CERMAT/));
  });
  test('nová kapitola projde s varováním, nesmyslný kód je chyba', async () => {
    const l = await nacti('lekce/M8-T01-L1.json');
    const v = over({ ...kopie(l), kapitola: 'osova-soumernost' });
    assert.deepEqual(v.chyby, []);
    assert.ok(ma(v.varovani, /osova-soumernost.*hlasky\.md/));
    assert.ok(over({ ...kopie(l), kapitola: 'Zlomky 2' }).chyby.length > 0);
    assert.equal(varovaniKapitoly('zlomky'), null);
  });
  test('diagnostika M8-T00-DIAG: jen final, tema 1–10, bez taháku', async () => {
    const l = await nacti('lekce/M8-T00-DIAG.json');
    assert.equal(l.typ, 'diagnostika');
    const s = kopie(l);
    s.ulohy[0].tema = 11;
    assert.ok(over(s).chyby.length > 0);
    const bez = kopie(l);
    delete bez.ulohy[3].tema;
    assert.ok(ma(over(bez).chyby, /úlohy bez „tema“.*M8-T00-DIAG-U4/));
    assert.ok(ma(over({ ...kopie(l), varianta: 'z9' }).varovani, /"z8"/));
    const tahak = kopie(l);
    tahak.ulohy[0].tahak = { vysvetleni: 'x' };
    assert.ok(over(tahak).chyby.length > 0);
  });
});

describe('čeština Spolu 8: 5 úloh', () => {
  test('pořadí rozcvicka, nova, nova, detektiv, kontrolni', async () => {
    assert.deepEqual(PORADI_TYPU_ULOH_CJ_OSMA, ['rozcvicka', 'nova', 'nova', 'detektiv', 'kontrolni']);
    const l = await nacti('cestina/lekce/cj-t1-l1.json');
    assert.deepEqual(l.ulohy.map((u) => u.typ), PORADI_TYPU_ULOH_CJ_OSMA);
    const sest = kopie(l);
    sest.ulohy.splice(2, 0, { ...kopie(l.ulohy[1]) });
    sest.ulohy.forEach((u, i) => { u.id = `${l.id}-U${i + 1}`; });
    assert.ok(ma(over(sest).chyby, /pořadí typů úloh musí být rozcvicka → nova → nova → detektiv → kontrolni/));
  });
  test('týdenní kontrola = úloha 5 lekce s poradi 4', async () => {
    const l4 = await nacti('cestina/lekce/cj-t1-l4.json');
    assert.equal(l4.ulohy[4].tydenni, true);
    assert.ok(l4.ulohy[4].semafor_tydne);
    const bez = kopie(l4);
    bez.ulohy[4].tydenni = false;
    delete bez.ulohy[4].semafor_tydne;
    assert.ok(ma(over(bez).chyby, /tydenni má být true \(týdenní kontrola je úloha 5/));
    const l1 = await nacti('cestina/lekce/cj-t1-l1.json');
    const navic = kopie(l1);
    navic.ulohy[3].tydenni = true;
    assert.ok(ma(over(navic).chyby, /tydenni jen u úlohy 5/));
  });
  test('id cj-t<t>-l<n>: 10 témat, 40 lekcí; čas ~25 min', async () => {
    const l = await nacti('cestina/lekce/cj-t1-l1.json');
    const t10 = { ...kopie(l), id: 'cj-t10-l40', tyden: 10, poradi: 4 };
    t10.ulohy.forEach((u, i) => { u.id = `cj-t10-l40-U${i + 1}`; });
    t10.ulohy[4].tydenni = true;
    t10.ulohy[4].semafor_tydne = (await nacti('cestina/lekce/cj-t1-l4.json')).ulohy[4].semafor_tydne;
    assert.deepEqual(over(t10).chyby, []);
    const t11 = { ...kopie(t10), id: 'cj-t11-l41', tyden: 11 };
    assert.ok(over(t11, 'cj-t11-l41.json').chyby.length > 0);
    const dlouha = kopie(l);
    dlouha.cas_min = 35;
    assert.ok(ma(over(dlouha).varovani, /čeština ~25 min/));
  });
  test('kapitola mimo hlasky.md = varování, ne chyba', async () => {
    const l = await nacti('cestina/lekce/cj-t1-l1.json');
    const v = over({ ...kopie(l), kapitola: 'skladba-vety' });
    assert.deepEqual(v.chyby, []);
    assert.ok(ma(v.varovani, /skladba-vety/));
  });
});

describe('diagnostika češtiny cj-t0-diag', () => {
  test('jen final, kapitola a tema u každé úlohy, známé chyby s kódy', async () => {
    const d = await nacti('cestina/lekce/cj-t0-diag.json');
    assert.ok(d.ulohy.every((u) => u.kapitola && Number.isInteger(u.tema) && u.kroky.length === 1 && u.kroky[0].id === 'final'));
    const k1 = kopie(d);
    k1.ulohy[0].kroky[0].id = 'k1';
    assert.ok(over(k1).chyby.length > 0);
    const bezKap = kopie(d);
    delete bezKap.ulohy[1].kapitola;
    assert.ok(ma(over(bezKap).chyby, /kapitola/));
    const bezTema = kopie(d);
    delete bezTema.ulohy[2].tema;
    assert.ok(ma(over(bezTema).chyby, /chybí „tema“/));
    const tahak = kopie(d);
    tahak.ulohy[0].tahak = {};
    assert.ok(over(tahak).chyby.length > 0);
  });
  test('úloha bez zname_chyby a diktát neprojdou; neznámý kód chyby je chyba', async () => {
    const d = await nacti('cestina/lekce/cj-t0-diag.json');
    const i = d.ulohy.findIndex((u) => u.kroky[0].vstup.typ !== 'dlazdice');
    assert.ok(i >= 0);
    const bez = kopie(d);
    delete bez.ulohy[i].kroky[0].zname_chyby;
    assert.ok(ma(over(bez).chyby, /musí mít zname_chyby/));
    const kod = kopie(d);
    kod.ulohy[i].kroky[0].zname_chyby[0].typ_chyby = 'neexistujici-kod';
    assert.ok(ma(over(kod).chyby, /neexistujici-kod/));
    const dl = kopie(d);
    const j = dl.ulohy.findIndex((u) => u.kroky[0].vstup.typ === 'dlazdice');
    delete dl.ulohy[j].kroky[0].vstup.moznosti.find((m) => !m.spravne).typ_chyby;
    assert.ok(ma(over(dl).chyby, /každá špatná dlaždice typ_chyby/));
  });
});

// ---------------------------------------------------------------------
// Seed (CLI)
// ---------------------------------------------------------------------
function falesnaDb() {
  const zapisy = [];
  const dotazy = [];
  const server = createServer((req, res) => {
    let telo = '';
    req.on('data', (c) => { telo += c; });
    req.on('end', () => {
      dotazy.push(`${req.method} ${decodeURIComponent(req.url)}`);
      if (req.method === 'POST') zapisy.push(JSON.parse(telo));
      res.writeHead(req.method === 'POST' ? 201 : 200, { 'Content-Type': 'application/json' });
      res.end(req.method === 'POST' ? '' : '[]');
    });
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, zapisy, dotazy, port: server.address().port })));
}

function seed(argumenty, port = 9) {
  return new Promise((ok) => {
    const p = spawn(process.execPath, ['supabase/seed/seed-lekce.mjs', ...argumenty], {
      cwd: KOREN,
      env: { ...process.env, SUPABASE_URL: `http://127.0.0.1:${port}`, SUPABASE_SERVICE_KEY: 'sb_secret_test', NO_PROXY: '127.0.0.1' },
    });
    let vystup = '';
    p.stdout.on('data', (c) => { vystup += c; });
    p.stderr.on('data', (c) => { vystup += c; });
    p.on('close', (kod) => ok({ kod, vystup }));
  });
}

describe('seed Spolu 8', () => {
  test('--soubor a --lekce kontrolují jen vybrané soubory', async () => {
    const a = await seed(['--jen-validace', '--soubor', 'testy/data/osma/lekce/M8-T01-L2.json']);
    assert.equal(a.kod, 0, a.vystup);
    assert.match(a.vystup, /Kontroluji 1 soubor/);
    assert.match(a.vystup, /M8-T01-L2\.json — OK/);
    assert.doesNotMatch(a.vystup, /M8-T01-L1/);
    const b = await seed(['--jen-validace', '--adresar', 'testy/data/osma/cestina/lekce', '--lekce', 'cj-t1-l4,cj-t0-diag']);
    assert.equal(b.kod, 0, b.vystup);
    assert.match(b.vystup, /Kontroluji 2 soubory/);
    const c = await seed(['--jen-validace', '--lekce', 'M8-T09-L9']);
    assert.equal(c.kod, 1);
    assert.match(c.vystup, /Soubor neexistuje: obsah\/lekce\/M8-T09-L9\.json/);
  });

  test('celá složka vypíše, které lekce ještě chybí', async () => {
    const r = await seed(['--jen-validace', '--adresar', 'testy/data/osma/lekce']);
    assert.equal(r.kod, 0, r.vystup);
    assert.match(r.vystup, /Matematika Spolu 8: 10\/41 souborů; chybí: M8-T03-L2/);
  });

  test('v obsah/ jen fáze osma a každý předmět ve své složce', async () => {
    const tmp = path.join(KOREN, 'obsah', 'lekce');
    const cil = path.join(tmp, 'cj-t1-l1.json');
    await writeFile(cil, await readFile(path.join(DATA, 'cestina', 'lekce', 'cj-t1-l1.json')));
    try {
      const r = await seed(['--jen-validace', '--soubor', 'obsah/lekce/cj-t1-l1.json']);
      assert.equal(r.kod, 1);
      assert.match(r.vystup, /patří do obsah\/cestina\/lekce/);
    } finally { await rm(cil); }
  });

  test('bez --otevrit-od nic nenahraje ani se nepřipojí', async () => {
    const db = await falesnaDb();
    try {
      const r = await seed(['--adresar', 'testy/data/osma/lekce'], db.port);
      assert.equal(r.kod, 1);
      assert.match(r.vystup, /--otevrit-od RRRR-MM-DD/);
      assert.deepEqual(db.dotazy, []);
    } finally { db.server.close(); }
  });

  test('ostrý běh: všechny lekce stejné otevrit_od, predmet, verejna podle volby', async () => {
    const db = await falesnaDb();
    try {
      const sucho = await seed(['--suchy-beh', '--adresar', 'testy/data/osma/cestina/lekce', '--otevrit-od', '2026-11-02'], db.port);
      assert.equal(sucho.kod, 0, sucho.vystup);
      assert.match(sucho.vystup, /nahrálo by se 9 lekcí/);
      assert.deepEqual(db.zapisy, []);

      const cj = await seed(['--adresar', 'testy/data/osma/cestina/lekce', '--otevrit-od=2026-11-02'], db.port);
      assert.equal(cj.kod, 0, cj.vystup);
      const mat = await seed(['--adresar', 'testy/data/osma/lekce', '--otevrit-od', '2026-11-02', '--verejna'], db.port);
      assert.equal(mat.kod, 0, mat.vystup);
      assert.equal(db.zapisy.length, 2);
      const [radkyCj, radkyMat] = db.zapisy;
      for (const r of radkyCj) {
        assert.equal(r.predmet, 'cestina');
        assert.equal(r.faze, 'osma');
        assert.equal(r.verejna, false);
        assert.equal(r.otevrit_od, '2026-11-02T00:00:00+01:00');
      }
      assert.ok(radkyCj.some((r) => r.id === 'cj-t0-diag' && r.tyden === 0));
      for (const r of radkyMat) {
        assert.equal(r.predmet, 'matematika');
        assert.equal(r.verejna, true);
        assert.equal(r.otevrit_od, '2026-11-02T00:00:00+01:00');
      }
    } finally { db.server.close(); }
  });
});
