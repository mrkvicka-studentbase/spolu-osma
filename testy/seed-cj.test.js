// Seed češtiny: datum otevření fáze zaklady (supabase/seed/otevreni-cj.mjs) a pojistky v seed-lekce.mjs.
// Síť jen proti lokálnímu falešnému PostgRESTu na 127.0.0.1 — do Supabase se nic nezapisuje.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsujDatum, pulnocVPraze, denOtevreniZaklady, otevritOdZaklady } from '../supabase/seed/otevreni-cj.mjs';

const koren = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEKCE_CJ = readdirSync(join(koren, 'obsah', 'cestina', 'lekce')).filter((n) => /^cj-t\d+-l\d+\.json$/.test(n))
  .map((n) => n.replace('.json', '')).sort((a, b) => a.localeCompare(b, 'cs', { numeric: true }));

test('parsujDatum: jen platné RRRR-MM-DD', () => {
  assert.equal(parsujDatum('2026-10-05').toISOString(), '2026-10-05T00:00:00.000Z');
  for (const spatne of ['2026-02-30', '2026-13-01', '5. 10. 2026', '2026-10-5', '', undefined, null]) {
    assert.equal(parsujDatum(spatne), null, String(spatne));
  }
});

test('půlnoc v Praze: letní a zimní čas i den změny času', () => {
  assert.equal(pulnocVPraze(parsujDatum('2026-10-05')), '2026-10-05T00:00:00+02:00');
  assert.equal(pulnocVPraze(parsujDatum('2026-12-07')), '2026-12-07T00:00:00+01:00');
  assert.equal(pulnocVPraze(parsujDatum('2026-10-25')), '2026-10-25T00:00:00+02:00'); // změna ve 3:00
  assert.equal(pulnocVPraze(parsujDatum('2026-10-26')), '2026-10-26T00:00:00+01:00');
  assert.equal(pulnocVPraze(parsujDatum('2027-03-28')), '2027-03-28T00:00:00+01:00'); // změna ve 2:00
  assert.equal(pulnocVPraze(parsujDatum('2027-03-29')), '2027-03-29T00:00:00+02:00');
});

test('týden 1 v den spuštění, další týdny v pondělí (KONTROLA-2026-09-30 §C3)', () => {
  const den = (t, s) => denOtevreniZaklady(t, parsujDatum(s)).toISOString().slice(0, 10);
  // spuštění ve čtvrtek 1. 10. → týden 2 v pondělí 5. 10.
  assert.deepEqual([1, 2, 3, 8].map((t) => den(t, '2026-10-01')), ['2026-10-01', '2026-10-05', '2026-10-12', '2026-11-16']);
  // spuštění v pondělí → týden 2 až další pondělí
  assert.deepEqual([1, 2].map((t) => den(t, '2026-10-05')), ['2026-10-05', '2026-10-12']);
  // spuštění v neděli → týden 2 hned zítra
  assert.deepEqual([1, 2].map((t) => den(t, '2026-10-04')), ['2026-10-04', '2026-10-05']);
  // všechny další týdny jsou pondělí
  for (let t = 2; t <= 8; t++) assert.equal(denOtevreniZaklady(t, parsujDatum('2026-10-01')).getUTCDay(), 1);
  // přes změnu času zůstává půlnoc
  assert.equal(otevritOdZaklady(5, parsujDatum('2026-10-01')), '2026-10-26T00:00:00+01:00');
  assert.throws(() => denOtevreniZaklady(0, parsujDatum('2026-10-01')));
  assert.throws(() => denOtevreniZaklady(1, null));
});

/** Falešný PostgREST: `migrace` = zda tabulka lekce má sloupec predmet. Zapisuje POST těla do `zapisy`. */
function falesnaDb({ migrace }) {
  const zapisy = [];
  const dotazy = [];
  const server = createServer((req, res) => {
    let telo = '';
    req.on('data', (c) => { telo += c; });
    req.on('end', () => {
      dotazy.push(`${req.method} ${decodeURIComponent(req.url)}`);
      const url = new URL(req.url, 'http://x');
      const select = url.searchParams.get('select') || '';
      if (req.method === 'GET' && !migrace && select.split(',').includes('predmet')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"code":"42703","message":"column lekce.predmet does not exist"}');
        return;
      }
      if (req.method === 'POST') zapisy.push(JSON.parse(telo));
      res.writeHead(req.method === 'POST' ? 201 : 200, { 'Content-Type': 'application/json' });
      res.end(req.method === 'POST' ? '' : '[]');
    });
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, zapisy, dotazy, port: server.address().port })));
}

function seed(argumenty, port) {
  return new Promise((ok) => {
    const p = spawn(process.execPath, ['supabase/seed/seed-lekce.mjs', '--adresar', 'obsah/cestina/lekce', ...argumenty], {
      cwd: koren,
      env: { ...process.env, SUPABASE_URL: `http://127.0.0.1:${port}`, SUPABASE_SERVICE_KEY: 'sb_secret_test', NO_PROXY: '127.0.0.1' },
    });
    let vystup = '';
    p.stdout.on('data', (c) => { vystup += c; });
    p.stderr.on('data', (c) => { vystup += c; });
    p.on('close', (kod) => ok({ kod, vystup }));
  });
}

test('seed češtiny: bez data spuštění nic nenahraje ani se nepřipojí', async () => {
  const db = await falesnaDb({ migrace: true });
  try {
    const { kod, vystup } = await seed([], db.port);
    assert.equal(kod, 1);
    assert.match(vystup, /--otevrit-od-zaklady/);
    assert.deepEqual(db.dotazy, []);
  } finally { db.server.close(); }
});

test('seed češtiny: bez migrace 0007 nic nezapíše', async () => {
  const db = await falesnaDb({ migrace: false });
  try {
    const { kod, vystup } = await seed(['--otevrit-od-zaklady', '2026-10-01'], db.port);
    assert.equal(kod, 1);
    assert.match(vystup, /0007_predmet/);
    assert.deepEqual(db.zapisy, []);
  } finally { db.server.close(); }
});

test('seed češtiny: suchý běh nezapisuje, ostrý posílá predmet a otevrit_od týdne', async () => {
  const db = await falesnaDb({ migrace: true });
  try {
    const sucho = await seed(['--suchy-beh', '--otevrit-od-zaklady', '2026-10-01'], db.port);
    assert.equal(sucho.kod, 0, sucho.vystup);
    assert.match(sucho.vystup, new RegExp(`nahrálo by se ${LEKCE_CJ.length} lekcí`));
    assert.deepEqual(db.zapisy, []);

    const ostre = await seed(['--otevrit-od-zaklady=2026-10-01'], db.port);
    assert.equal(ostre.kod, 0, ostre.vystup);
    assert.equal(db.zapisy.length, 1);
    const radky = db.zapisy[0];
    assert.deepEqual(radky.map((r) => r.id).sort(), [...LEKCE_CJ].sort());
    const otevreni = { 1: '2026-10-01T00:00:00+02:00', 2: '2026-10-05T00:00:00+02:00', 3: '2026-10-12T00:00:00+02:00' };
    for (const r of radky) {
      assert.equal(r.predmet, 'cestina');
      assert.equal(r.faze, 'zaklady');
      assert.equal(r.verejna, false);
      assert.equal(r.otevrit_od, otevreni[r.tyden] ?? otevritOdZaklady(r.tyden, parsujDatum('2026-10-01')));
      assert.equal(r.verze, 1);
    }
  } finally { db.server.close(); }
});
