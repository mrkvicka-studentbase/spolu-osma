// Testy odznaků, „celá správně" a řad (zadání 30. 9., B–C; R60). Spuštění: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jeCelaSpravne, rady, spocitejOdznaky, noveOdznaky, svgOdznaku, ODZNAKY, MAX_PAUZA_RADY_DNU, denVPraze } from '../web/js/odznaky.js';

const DEN = 24 * 3600 * 1000;
const t0 = Date.parse('2026-10-01T18:00:00+02:00');
const iso = (dny) => new Date(t0 + dny * DEN).toISOString();
const zelene = (n = 4) => ({ barvy: Object.fromEntries(Array.from({ length: n }, (_, i) => [`U${i + 1}`, 'zelena'])) });

/** Katalog: pilot P1–P4, F1 týden 0 (diagnostika) + týden 1 (L1–L4), F2 týden 1 (L1–L2). */
function katalog(hotove = {}) {
  const l = [
    ...['P1', 'P2', 'P3', 'P4'].map((id) => ({ id, faze: 'pilot', tyden: 1 })),
    { id: 'F1-T00-DIAG', faze: 'faze1', tyden: 0 },
    ...[1, 2, 3, 4].map((n) => ({ id: `F1-T01-L${n}`, faze: 'faze1', tyden: 1 })),
    { id: 'F2-T01-L1', faze: 'faze2', tyden: 1 }, { id: 'F2-T01-L2', faze: 'faze2', tyden: 1 },
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

test('odznaky: první lekce, řada 3, pilot a celý týden (pilot je týden)', () => {
  const k = katalog({ P1: { konec: iso(0), souhrn: zelene() }, P2: { konec: iso(1) }, P3: { konec: iso(2) }, P4: { konec: iso(10) } }); // P3 → P4 pauza 8 dní
  const s = spocitejOdznaky(k);
  assert.deepEqual([...s.ziskane].sort(), ['prvni', 'pilot', 'rada3', 'spravne', 'tyden'].sort());
  assert.equal(s.pocetHotovych, 4);
  assert.equal(s.rada.nejlepsi, 3);
  assert.deepEqual([...s.celaSpravne], ['P1']);
});

test('odznaky: diagnostika sama týden nesplní; Fáze 1 hotová jen i s diagnostikou', () => {
  const s = spocitejOdznaky(katalog({ 'F1-T00-DIAG': { konec: iso(0), souhrn: { typ: 'diagnostika' } } }));
  assert.deepEqual([...s.ziskane], ['prvni'], 'jen první lekce, týden ani „celá správně" ne');
  const f1 = Object.fromEntries([1, 2, 3, 4].map((n, i) => [`F1-T01-L${n}`, { konec: iso(i) }]));
  const s2 = spocitejOdznaky(katalog(f1));
  assert.ok(!s2.ziskane.has('faze1') && s2.ziskane.has('tyden') && s2.ziskane.has('rada3'), 'bez diagnostiky Fáze 1 hotová není');
  const s3 = spocitejOdznaky(katalog({ ...f1, 'F1-T00-DIAG': { konec: iso(5), souhrn: { typ: 'diagnostika' } } }));
  assert.ok(s3.ziskane.has('faze1'));
});

test('odznaky: řada 5 a 10, přerušená delší pauzou', () => {
  const k = Object.fromEntries(['P1', 'P2', 'P3', 'P4', 'F1-T01-L1', 'F1-T01-L2', 'F1-T01-L3', 'F1-T01-L4', 'F2-T01-L1', 'F2-T01-L2']
    .map((id, i) => [id, { konec: iso(i * 2) }]));
  assert.ok(spocitejOdznaky(katalog(k)).ziskane.has('rada10'));
  k['F2-T01-L2'] = { konec: iso(40) }; // poslední až po dlouhé pauze
  const s = spocitejOdznaky(katalog(k));
  assert.ok(s.ziskane.has('rada5') && !s.ziskane.has('rada10'));
});

test('právě dokončená lekce (žák na „Hotovo") se počítá do dokončení a řad, ne do „celá správně"', () => {
  const k = katalog({ P1: { konec: iso(0) }, P2: { konec: iso(1) } });
  const s = spocitejOdznaky(k, { navic: { id: 'P3', konec: iso(2) } });
  assert.ok(s.ziskane.has('rada3') && !s.ziskane.has('spravne'));
  assert.equal(s.pocetHotovych, 3);
});

test('nové odznaky proti už ukázaným; SVG existuje pro všech 8', () => {
  assert.deepEqual(noveOdznaky(new Set(['prvni', 'rada3']), ['prvni']), ['rada3']);
  assert.deepEqual(noveOdznaky(new Set(['prvni']), null), ['prvni']);
  assert.equal(ODZNAKY.length, 8);
  assert.ok(ODZNAKY.filter((o) => o.barva === 'zelena' || ['pilot', 'faze1'].includes(o.id)).length >= 4, 'aspoň polovina za vytrvalost');
  for (const o of ODZNAKY) assert.match(svgOdznaku(o.id), /^<svg viewBox="0 0 72 72"[^]*<\/svg>$/);
  assert.match(svgOdznaku('prvni', { titulek: 'První "lekce"' }), /aria-label="První &quot;lekce&quot;"/);
});

test('R69: odznaky zvlášť pro matematiku a češtinu + společné za oba předměty', async () => {
  const { spocitejOdznakyPredmetu, ODZNAKY_CESTINY, ODZNAKY_OBA, noveOdznaky, svgOdznaku } = await import('../web/js/odznaky.js');
  const L = (id, predmet, den = null, souhrn = null) => ({ id, predmet, faze: 'pilot', tyden: 1, dokoncene: den === null ? null : { konec: iso(den), souhrn } });
  const mat = (hotove) => ['P1', 'P2', 'P3', 'P4'].map((id, i) => L(id, undefined, i < hotove ? i : null));
  const cj = (hotove, posun = 0) => ['CJ-P1', 'CJ-P2', 'CJ-P3', 'CJ-P4'].map((id, i) => L(id, 'cestina', i < hotove ? i + posun : null, i === 0 ? zelene(4) : null));

  const jenMat = spocitejOdznakyPredmetu([...mat(1), ...cj(0)]);
  assert.deepEqual([...jenMat.ziskane], ['prvni'], 'čeština nezačatá: jen matematika, žádný společný');
  assert.equal(jenMat.maObaPredmety, true);

  const oba = spocitejOdznakyPredmetu([...mat(4), ...cj(4)]);
  for (const id of ['prvni', 'tyden', 'rada3', 'pilot', 'cj:prvni', 'cj:spravne', 'cj:tyden', 'cj:rada3', 'cj:pilot', 'oba:prvni', 'oba:tyden', 'oba:rada']) {
    assert.ok(oba.ziskane.has(id), id);
  }
  assert.ok(!oba.ziskane.has('spravne'), 'celá správně jen v češtině');
  assert.equal(oba.celaSpravne.has('CJ-P1'), true);

  const pul = spocitejOdznakyPredmetu([...mat(4), ...cj(2)]);
  assert.ok(pul.ziskane.has('oba:prvni') && !pul.ziskane.has('oba:tyden') && !pul.ziskane.has('oba:rada'));

  const bezCj = spocitejOdznakyPredmetu(mat(2));
  assert.equal(bezCj.maObaPredmety, false);
  assert.ok(![...bezCj.ziskane].some((id) => id.includes(':')), 'bez češtiny žádné cj: ani oba:');

  assert.deepEqual(noveOdznaky(new Set(['prvni', 'cj:prvni', 'oba:prvni']), ['prvni']), ['cj:prvni', 'oba:prvni'], 'viděné id matematiky platí dál');
  assert.equal(ODZNAKY_CESTINY.length, 8); // R80: + řada 5, řada 10, Fáze 1
  assert.equal(ODZNAKY_OBA.length, 3);
  assert.match(svgOdznaku('cj:prvni'), /#3B82F6/, 'čeština modrá');
  assert.match(svgOdznaku('oba:tyden'), /#F5C518/, 'společné zlaté');
});

test('R80: odznaky za výzvy a sbírku taháků', async () => {
  const { odznakyVyzevATahaku, najdiOdznak, ODZNAKY_VYZEV, ODZNAKY_SBIRKY } = await import('../web/js/odznaky.js');
  // Fáze 1 matematiky, týdny 1–5 po 4 lekcích, všechno dokončené v listopadu (Praha)
  const lekce = [];
  for (let t = 1; t <= 5; t++) for (let p = 1; p <= 4; p++) {
    lekce.push({ id: `F1-T0${t}-L${p}`, faze: 'faze1', tyden: t, dokoncene: { konec: `2026-11-${String(t * 4 + p).padStart(2, '0')}T15:00:00Z`, souhrn: null } });
  }
  const z = odznakyVyzevATahaku(lekce, { ted: Date.parse('2026-11-30T12:00:00Z') });
  assert.ok(z.has('vyzva:2026-11'), '20 lekcí v listopadu ≥ 12');
  assert.ok(!z.has('vyzva:2026-12'));
  assert.ok(z.has('sber:5'), '5 celých týdnů = 5 taháků');
  assert.ok(!z.has('sber:15'));
  // viděná splněná výzva zůstane, i když v datech už není
  assert.ok(odznakyVyzevATahaku([], { videne: ['vyzva:2026-12', 'prvni'] }).has('vyzva:2026-12'));
  assert.ok(!odznakyVyzevATahaku([], { videne: ['prvni'] }).has('prvni'), 'videne přidává jen výzvy');
  assert.equal(ODZNAKY_VYZEV.length, 6);
  assert.equal(ODZNAKY_SBIRKY.length, 3);
  assert.equal(najdiOdznak('vyzva:2027-04').popis, 'Dokonči 4 lekce v dubnu do 11. 4.');
  assert.equal(najdiOdznak('vyzva:2026-11').popis, 'Dokonči 12 lekcí v listopadu.');
});

test('redesign 8. 10.: htmlOdznaku — tvar podle skupiny, tón podle barvy, znak, zamčený stav', async () => {
  const { htmlOdznaku, vzhledOdznaku, ODZNAKY, ODZNAKY_CESTINY, ODZNAKY_OBA, ODZNAKY_VYZVY_A_TAHAKY } = await import('../web/js/odznaky.js');
  for (const o of [...ODZNAKY, ...ODZNAKY_CESTINY, ...ODZNAKY_OBA, ...ODZNAKY_VYZVY_A_TAHAKY]) {
    const html = htmlOdznaku(o.id);
    assert.match(html, /^<span class="odz odz--(kruh|stit|sestiuhelnik) odz--(zelena|zlata|modra)"[^]*<\/span>$/, o.id);
    assert.match(html, /<span class="odz__lic">(?!<\/span>)/, `${o.id}: líc má znak`);
    assert.match(html, /aria-hidden="true"/);
  }
  assert.deepEqual(vzhledOdznaku('rada5'), { tvar: 'kruh', ton: 'zelena' });
  assert.deepEqual(vzhledOdznaku('cj:rada5'), { tvar: 'stit', ton: 'modra' });
  assert.deepEqual(vzhledOdznaku('cj:faze1'), { tvar: 'stit', ton: 'zlata' });
  assert.deepEqual(vzhledOdznaku('oba:tyden'), { tvar: 'sestiuhelnik', ton: 'zlata' });
  assert.deepEqual(vzhledOdznaku('vyzva:2026-11'), { tvar: 'kruh', ton: 'zlata' });
  assert.deepEqual(vzhledOdznaku('sber:5'), { tvar: 'sestiuhelnik', ton: 'zelena' });
  assert.deepEqual(vzhledOdznaku('sber:vse'), { tvar: 'sestiuhelnik', ton: 'zlata' });
  assert.equal(vzhledOdznaku('neni'), null);
  assert.equal(htmlOdznaku('neni'), '');
  assert.match(htmlOdznaku('vyzva:2027-02'), /odz__zkratka">ÚNO</);
  assert.match(htmlOdznaku('sber:vse'), /odz__karticky odz__karticky--maly">vše</);
  assert.match(htmlOdznaku('rada10'), /odz__cislo">10<[^]*odz__sipky/);
  assert.match(htmlOdznaku('oba:prvni'), /odz__cislo odz__cislo--maly">1\+1</);
  assert.match(htmlOdznaku('faze1', { zamceno: true }), /odz--zamceno[^]*odz__zamek/, 'zamčený má zámek');
  assert.doesNotMatch(htmlOdznaku('faze1', { zamceno: true, velikost: 40 }), /odz__zamek/, 'malý zamčený jen šedý');
  assert.match(htmlOdznaku('prvni', { velikost: 40 }), /odz--maly"[^>]*style="--s:40px"/);
  assert.match(htmlOdznaku('prvni', { titulek: 'První "lekce"' }), /role="img" aria-label="První &quot;lekce&quot;"/);
});
