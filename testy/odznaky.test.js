// Testy odznaků, „celá správně" a řad (zadání 30. 9., B–C; R60). Spuštění: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jeCelaSpravne, rady, spocitejOdznaky, noveOdznaky, svgOdznaku, ODZNAKY, MAX_PAUZA_RADY_DNU, denVPraze } from '../web/js/odznaky.js';

const DEN = 24 * 3600 * 1000;
const t0 = Date.parse('2026-10-01T18:00:00+02:00');
const iso = (dny) => new Date(t0 + dny * DEN).toISOString();
const zelene = (n = 4) => ({ barvy: Object.fromEntries(Array.from({ length: n }, (_, i) => [`U${i + 1}`, 'zelena'])) });

/** Katalog Spolu 8: matematika test M8-T00-DIAG + téma 1 (L1–L4) + téma 2 (L1–L2), čeština téma 1 (l1–l4). */
function katalog(hotove = {}) {
  const l = [
    { id: 'M8-T00-DIAG', predmet: 'matematika', faze: 'osma', tyden: 0 },
    ...[1, 2, 3, 4].map((n) => ({ id: `M8-T01-L${n}`, predmet: 'matematika', faze: 'osma', tyden: 1 })),
    { id: 'M8-T02-L1', predmet: 'matematika', faze: 'osma', tyden: 2 }, { id: 'M8-T02-L2', predmet: 'matematika', faze: 'osma', tyden: 2 },
    ...[1, 2, 3, 4].map((n) => ({ id: `cj-t1-l${n}`, predmet: 'cestina', faze: 'osma', tyden: 1 })),
  ];
  return l.map((x) => ({ ...x, dokoncene: hotove[x.id] || null }));
}

test('celá správně: všechny 4 úlohy zelené; chybí úloha, oranžová, simulace, diagnostika → ne', () => {
  assert.equal(jeCelaSpravne(zelene(4)), true);
  assert.equal(jeCelaSpravne({ ...zelene(3) }), false, 'semafor jen u 3 ze 4 úloh (lekce ukončená dřív)');
  assert.equal(jeCelaSpravne({ barvy: { U1: 'zelena', U2: 'oranzova', U3: 'zelena', U4: 'zelena' } }), false);
  assert.equal(jeCelaSpravne({ ...zelene(4), pocetUloh: 5 }), false, 'nový souhrn s počtem úloh');
  assert.equal(jeCelaSpravne({ typ: 'simulace', barvy: zelene(8).barvy }), false);
  assert.equal(jeCelaSpravne({ typ: 'diagnostika' }), false);
  assert.equal(jeCelaSpravne(null), false);
});

test('řady: pauza do 7 dní řadu drží (i víkend), delší ji ukončí; nejlepší se pamatuje', () => {
  assert.deepEqual(rady([]), { nejlepsi: 0, aktualni: 0 });
  assert.deepEqual(rady([iso(0), iso(1), iso(3)]), { nejlepsi: 3, aktualni: 3 });
  assert.deepEqual(rady([iso(0), iso(7)]), { nejlepsi: 2, aktualni: 2 }, 'přesně 7 dní ještě drží');
  assert.deepEqual(rady([iso(0), iso(1), iso(2), iso(10), iso(11)]), { nejlepsi: 3, aktualni: 2 }, 'pauza 8 dní začne novou řadu');
  assert.deepEqual(rady([iso(5), iso(0), iso(2)]), { nejlepsi: 3, aktualni: 3 }, 'pořadí vstupu nehraje roli');
  assert.equal(MAX_PAUZA_RADY_DNU, 7);
});

test('řady v kalendářních dnech Europe/Prague: pondělí večer → další pondělí ráno i večer je v řadě, úterý už ne', () => {
  const poVecer = '2026-11-02T21:30:00+01:00';
  assert.equal(rady([poVecer, '2026-11-09T07:00:00+01:00']).nejlepsi, 2, 'další pondělí ráno');
  assert.equal(rady([poVecer, '2026-11-09T22:30:00+01:00']).nejlepsi, 2, 'další pondělí večer (víc než 168 h)');
  assert.equal(rady([poVecer, '2026-11-10T07:00:00+01:00']).nejlepsi, 1, 'úterý = 8 dní');
  // přelom dne v Praze: 23:30 UTC 2. 11. je v Praze už 3. 11.
  assert.equal(denVPraze('2026-11-02T23:30:00Z') - denVPraze('2026-11-02T22:30:00Z'), 1);
  // změna času 25. 10. 2026 (letní → zimní) a 28. 3. 2027: dny se počítají správně
  assert.equal(denVPraze('2026-10-26T00:30:00+01:00') - denVPraze('2026-10-24T23:30:00+02:00'), 2);
  assert.equal(denVPraze('2027-03-29T00:30:00+02:00') - denVPraze('2027-03-27T23:30:00+01:00'), 2);
  assert.equal(rady(['2026-10-20T20:00:00+02:00', '2026-10-27T20:00:00+01:00']).nejlepsi, 2, 'přes změnu času 7 dní');
});

test('odznaky: první lekce, řada 3, celé téma (4 lekce jednoho tématu a předmětu)', () => {
  const k = katalog({ 'M8-T01-L1': { konec: iso(0), souhrn: zelene() }, 'M8-T01-L2': { konec: iso(1) }, 'M8-T01-L3': { konec: iso(2) }, 'M8-T01-L4': { konec: iso(10) } }); // L3 → L4 pauza 8 dní
  const s = spocitejOdznaky(k);
  assert.deepEqual([...s.ziskane].sort(), ['prvni', 'rada3', 'spravne', 'tyden'].sort());
  assert.equal(s.pocetHotovych, 4);
  assert.equal(s.rada.nejlepsi, 3);
  assert.deepEqual([...s.celaSpravne], ['M8-T01-L1']);
});

test('odznaky: téma 1 matematiky a češtiny se nesčítají (klíč předmět + téma)', () => {
  const k = katalog({ 'M8-T01-L1': { konec: iso(0) }, 'M8-T01-L2': { konec: iso(1) }, 'cj-t1-l1': { konec: iso(2) }, 'cj-t1-l2': { konec: iso(3) } });
  const s = spocitejOdznaky(k);
  assert.ok(!s.ziskane.has('tyden'));
});

test('odznaky: úvodní test sám téma nesplní, dá odznak „Úvodní test“; celý předmět jen se všemi lekcemi', () => {
  const s = spocitejOdznaky(katalog({ 'M8-T00-DIAG': { konec: iso(0), souhrn: { typ: 'diagnostika' } } }));
  assert.deepEqual([...s.ziskane].sort(), ['prvni', 'test']);
  const cj = Object.fromEntries([1, 2, 3, 4].map((n, i) => [`cj-t1-l${n}`, { konec: iso(i) }]));
  const s2 = spocitejOdznaky(katalog(cj));
  assert.ok(s2.ziskane.has('predmet') && s2.ziskane.has('tyden') && s2.ziskane.has('rada3'), 'čeština v katalogu = 4 lekce, všechny hotové');
  const mat = Object.fromEntries([1, 2, 3, 4].map((n, i) => [`M8-T01-L${n}`, { konec: iso(i) }]));
  assert.ok(!spocitejOdznaky(katalog(mat)).ziskane.has('predmet'), 'matematika má ještě téma 2');
});

test('odznaky: řada 5 a 10, přerušená delší pauzou', () => {
  const ids = ['M8-T00-DIAG', 'M8-T01-L1', 'M8-T01-L2', 'M8-T01-L3', 'M8-T01-L4', 'M8-T02-L1', 'M8-T02-L2', 'cj-t1-l1', 'cj-t1-l2', 'cj-t1-l3'];
  const k = Object.fromEntries(ids.map((id, i) => [id, { konec: iso(i * 2) }]));
  assert.ok(spocitejOdznaky(katalog(k)).ziskane.has('rada10'));
  k['cj-t1-l3'] = { konec: iso(40) }; // poslední až po dlouhé pauze
  const s = spocitejOdznaky(katalog(k));
  assert.ok(s.ziskane.has('rada5') && !s.ziskane.has('rada10'));
});

test('právě dokončená lekce (žák na „Hotovo") se počítá do dokončení a řad, ne do „celá správně"', () => {
  const k = katalog({ 'M8-T01-L1': { konec: iso(0) }, 'M8-T01-L2': { konec: iso(1) } });
  const s = spocitejOdznaky(k, { navic: { id: 'M8-T01-L3', konec: iso(2) } });
  assert.ok(s.ziskane.has('rada3') && !s.ziskane.has('spravne'));
  assert.equal(s.pocetHotovych, 3);
});

test('nové odznaky proti už ukázaným; SVG existuje pro všech 10 za lekce (R80: + řada 20 a 30)', () => {
  assert.deepEqual(noveOdznaky(new Set(['prvni', 'rada3']), ['prvni']), ['rada3']);
  assert.deepEqual(noveOdznaky(new Set(['prvni']), null), ['prvni']);
  assert.equal(ODZNAKY.length, 10);
  assert.ok(ODZNAKY.filter((o) => o.barva === 'zelena' || ['test', 'predmet'].includes(o.id)).length >= 4, 'aspoň polovina za vytrvalost');
  for (const o of ODZNAKY) assert.match(svgOdznaku(o.id), /^<svg viewBox="0 0 72 72"[^]*<\/svg>$/);
  assert.match(svgOdznaku('prvni', { titulek: 'První "lekce"' }), /aria-label="První &quot;lekce&quot;"/);
});

test('R81: htmlOdznaku — tvar podle skupiny, tón podle barvy, znak, zamčený a malý stav', async () => {
  const { htmlOdznaku, vzhledOdznaku } = await import('../web/js/odznaky.js');
  for (const o of ODZNAKY) {
    const html = htmlOdznaku(o.id);
    assert.match(html, /^<span class="odz odz--(kruh|stit|sestiuhelnik) odz--(zelena|zlata|modra)"[^]*<\/span>$/, o.id);
    assert.match(html, /<span class="odz__lic">(?!<\/span>)/, `${o.id}: líc má znak`);
    assert.match(html, /aria-hidden="true"/);
  }
  assert.deepEqual(vzhledOdznaku('rada5'), { tvar: 'kruh', ton: 'zelena' });
  assert.deepEqual(vzhledOdznaku('predmet'), { tvar: 'kruh', ton: 'zlata' });
  assert.equal(vzhledOdznaku('neni'), null);
  assert.equal(htmlOdznaku('neni'), '');
  assert.match(htmlOdznaku('rada10'), /odz__cislo">10<[^]*odz__sipky/);
  assert.match(htmlOdznaku('test'), /odz__ikona/, 'úvodní test: vlajka');
  assert.match(htmlOdznaku('predmet', { zamceno: true }), /odz--zamceno[^]*odz__zamek/, 'zamčený má zámek');
  assert.doesNotMatch(htmlOdznaku('predmet', { zamceno: true, velikost: 40 }), /odz__zamek/, 'malý zamčený jen šedý');
  assert.match(htmlOdznaku('prvni', { velikost: 40 }), /odz--maly"[^>]*style="--s:40px"/);
  assert.match(htmlOdznaku('prvni', { titulek: 'První "lekce"' }), /role="img" aria-label="První &quot;lekce&quot;"/);
});

// ---------------------------------------------------------------------
// R80: delší řady, oba předměty, výzvy, sbírka taháků, viděné se neodebírají
// ---------------------------------------------------------------------

/** Katalog celého roku z obsah/ (bez obsahu): matematika i čeština, učební, naostro, B, testy. */
async function katalogRoku(hotove = {}) {
  const { nactiLekce, polozkaKatalogu } = await import('../nastroje/staticky-server.mjs');
  return (await nactiLekce()).map((l) => polozkaKatalogu(l)).map((l) => ({ ...l, dokoncene: hotove[l.id] ? { konec: hotove[l.id], souhrn: null } : null }));
}

test('R80: řada 20 a 30; téma 0 (úvodní + pololetní test) nedá „Celé téma“', () => {
  const ids = ['M8-T01-L1', 'M8-T01-L2', 'M8-T01-L3', 'M8-T01-L4', 'M8-T02-L1', 'M8-T02-L2', 'cj-t1-l1', 'cj-t1-l2', 'cj-t1-l3', 'cj-t1-l4'];
  const k = katalog(Object.fromEntries(ids.map((id, i) => [id, { konec: iso(i) }])));
  const navic = Array.from({ length: 25 }, (_, i) => ({ id: `X${i}`, predmet: 'matematika', faze: 'osma', tyden: 9, dokoncene: { konec: iso(10 + i) } }));
  const z = spocitejOdznaky([...k, ...navic]).ziskane;
  assert.ok(z.has('rada20') && z.has('rada30'), '35 lekcí za sebou');
  assert.ok(!spocitejOdznaky(k).ziskane.has('rada20'));
  const testy = [{ id: 'M8-T00-DIAG', predmet: 'matematika', faze: 'osma', tyden: 0, dokoncene: { konec: iso(0) } },
    { id: 'M8-T00-POL', predmet: 'matematika', faze: 'osma', tyden: 0, dokoncene: { konec: iso(1) } }];
  assert.ok(!spocitejOdznaky(testy).ziskane.has('tyden'), 'dva testy tématu 0 nejsou celé téma');
});

test('R80: oba předměty — lekce z obou, řada 3 v obou; jen jeden předmět v katalogu = žádné oba:', async () => {
  const { ODZNAKY_OBA } = await import('../web/js/odznaky.js');
  assert.equal(ODZNAKY_OBA.length, 2);
  const jenMat = spocitejOdznaky(katalog({ 'M8-T01-L1': { konec: iso(0) } }));
  assert.ok(!jenMat.ziskane.has('oba:prvni'));
  const prvni = spocitejOdznaky(katalog({ 'M8-T01-L1': { konec: iso(0) }, 'cj-t1-l1': { konec: iso(1) } }));
  assert.ok(prvni.ziskane.has('oba:prvni') && !prvni.ziskane.has('oba:rada'));
  assert.equal(prvni.maObaPredmety, true);
  const h = Object.fromEntries(['M8-T01-L1', 'M8-T01-L2', 'M8-T01-L3', 'cj-t1-l1', 'cj-t1-l2', 'cj-t1-l3'].map((id, i) => [id, { konec: iso(i) }]));
  assert.ok(spocitejOdznaky(katalog(h)).ziskane.has('oba:rada'));
  const bezCj = spocitejOdznaky(katalog(h).filter((l) => l.predmet === 'matematika'));
  assert.equal(bezCj.maObaPredmety, false);
  assert.ok(![...bezCj.ziskane].some((id) => id.startsWith('oba:')));
  // právě dokončená lekce češtiny se počítá
  assert.ok(spocitejOdznaky(katalog({ 'M8-T01-L1': { konec: iso(0) } }), { navic: { id: 'cj-t1-l1', konec: iso(1) } }).ziskane.has('oba:prvni'));
});

test('R80: výzvy a sbírka taháků na katalogu roku (B-varianty a testy se do výzvy nepočítají)', async () => {
  const { odznakyVyzevATahaku, najdiOdznak, ODZNAKY_VYZEV, ODZNAKY_SBIRKY } = await import('../web/js/odznaky.js');
  assert.equal(ODZNAKY_VYZEV.length, 7, 'listopad 2026 – květen 2027');
  assert.equal(ODZNAKY_SBIRKY.length, 3);
  const cil = Number(najdiOdznak('vyzva:2026-11').popis.match(/\d+/)[0]);
  // učební lekce témat 1–5 matematiky v listopadu (Praha)
  const hotove = {};
  let d = 1;
  for (let t = 1; t <= 5; t++) for (let n = 1; n <= 4; n++) hotove[`M8-T0${t}-L${n}`] = `2026-11-${String(d++).padStart(2, '0')}T15:00:00Z`;
  const k = await katalogRoku(hotove);
  const z = odznakyVyzevATahaku(k, { ted: Date.parse('2026-11-30T12:00:00Z') });
  assert.ok(20 >= cil && z.has('vyzva:2026-11'), `20 lekcí v listopadu ≥ ${cil}`);
  assert.ok(!z.has('vyzva:2026-12'));
  assert.ok(z.has('sber:5') && !z.has('sber:15'), '5 témat = 5 taháků');
  // jen B-varianty a testy: výzva ne
  const jenB = {};
  for (const id of ['M8-T00-DIAG', 'M8-T00-POL', 'cj-t0-diag', 'cj-t0-pol', ...[1, 2, 3, 4].flatMap((n) => [`M8-T01-L${n}B`, `M8-T02-L${n}B`, `M8-T03-L${n}B`, `M8-T01-L${n}NB`])]) jenB[id] = '2026-11-10T15:00:00Z';
  assert.ok(!odznakyVyzevATahaku(await katalogRoku(jenB)).has('vyzva:2026-11'));
  // účet uzavřený (bez sezóny): výzvy ne, sbírka ano
  const uz = k.map((l) => ({ ...l, zamceno: 'uzavreno' }));
  const zu = odznakyVyzevATahaku(uz, { ted: Date.parse('2026-11-30T12:00:00Z') });
  assert.ok(!zu.has('vyzva:2026-11') && zu.has('sber:5'));
  // všechny učební lekce roku: celá sbírka
  const vse = Object.fromEntries(k.filter((l) => /^(M8-T(0[1-9]|10)-L[1-4]|cj-t\d+-l\d+)$/.test(l.id)).map((l) => [l.id, '2027-03-02T15:00:00Z']));
  assert.ok(odznakyVyzevATahaku(await katalogRoku(vse)).has('sber:vse'));
  assert.equal(najdiOdznak('vyzva:2026-11').popis, `Dokonči ${cil} lekcí v listopadu.`);
  assert.match(najdiOdznak('vyzva:2027-05').popis, /v květnu\.$/);
});

test('R80: jednou viděný odznak se nikdy neodebírá (videne), neznámé id se ignoruje', () => {
  const z = spocitejOdznaky(katalog(), { videne: ['predmet', 'vyzva:2026-12', 'neznamy', 'oba:rada'] }).ziskane;
  assert.deepEqual([...z].sort(), ['oba:rada', 'predmet', 'vyzva:2026-12']);
  assert.equal(spocitejOdznaky(katalog(), { videne: null }).ziskane.size, 0);
});

test('R80: noveOdznaky v pořadí okna (za lekce, oba, výzvy, sbírka); vzhled nových skupin', async () => {
  const { htmlOdznaku, vzhledOdznaku, ODZNAKY_OBA, ODZNAKY_VYZVY_A_TAHAKY } = await import('../web/js/odznaky.js');
  assert.deepEqual(noveOdznaky(new Set(['sber:5', 'vyzva:2026-11', 'oba:prvni', 'rada20']), []), ['rada20', 'oba:prvni', 'vyzva:2026-11', 'sber:5']);
  for (const o of [...ODZNAKY_OBA, ...ODZNAKY_VYZVY_A_TAHAKY]) {
    assert.match(htmlOdznaku(o.id), /^<span class="odz odz--(kruh|sestiuhelnik) odz--(zelena|zlata)"[^]*<\/span>$/, o.id);
    assert.match(htmlOdznaku(o.id), /<span class="odz__lic">(?!<\/span>)/, `${o.id}: líc má znak`);
    assert.match(svgOdznaku(o.id), /^<svg viewBox="0 0 72 72"[^]*<\/svg>$/, `${o.id}: SVG`);
  }
  assert.deepEqual(vzhledOdznaku('oba:prvni'), { tvar: 'sestiuhelnik', ton: 'zlata' });
  assert.deepEqual(vzhledOdznaku('vyzva:2026-11'), { tvar: 'kruh', ton: 'zlata' });
  assert.deepEqual(vzhledOdznaku('sber:5'), { tvar: 'sestiuhelnik', ton: 'zelena' });
  assert.deepEqual(vzhledOdznaku('sber:vse'), { tvar: 'sestiuhelnik', ton: 'zlata' });
  assert.match(htmlOdznaku('vyzva:2027-02'), /odz__zkratka">ÚNO</);
  assert.match(htmlOdznaku('vyzva:2027-05'), /odz__zkratka">KVĚ</);
  assert.match(htmlOdznaku('sber:vse'), /odz__karticky odz__karticky--maly">vše</);
  assert.match(htmlOdznaku('oba:prvni'), /odz__cislo odz__cislo--maly">1\+1</);
  assert.match(htmlOdznaku('rada30'), /odz__cislo">30<[^]*odz__sipky/);
});
