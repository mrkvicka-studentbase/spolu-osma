// plan-roku.js — Spolu 8 na celý rok: druhy lekcí, pořadí s odstupem, kalendář dítěte (3 týdně), B-varianta po červené.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  druhLekce, idBVarianty, poradiVTematu, planRoku, zacatekKalendare, tydenKalendare, kalendar, otevreniPololetniho,
  bVariantaPoCervene, dalsiLekceRoku, LEKCI_TYDNE,
} from '../web/js/plan-roku.js';

/** Katalog tématu t: L1–L4, L1N–L4N, B-varianty všech osmi. */
function tema(t, predmet = 'matematika') {
  const out = [];
  for (const n of [1, 2, 3, 4]) {
    for (const naostro of [false, true]) {
      for (const b of [false, true]) {
        const id = predmet === 'matematika'
          ? `M8-T${String(t).padStart(2, '0')}-L${n}${naostro ? 'N' : ''}${b ? 'B' : ''}`
          : `cj-t${t}-l${(t - 1) * 4 + n}${naostro ? 'n' : ''}${b ? 'b' : ''}`;
        out.push({ id, tyden: t, poradi: n, predmet, stavLekce: 'nezacato', zamceno: null });
      }
    }
  }
  return out;
}
const den = (s) => new Date(`${s}T10:00:00`);
const hotovo = (l, zacatek, barva = 'zelena') => Object.assign(l, {
  stavLekce: 'hotovo', dokoncene: { zacatek, konec: zacatek }, sezeni: { zacatek }, souhrn: { hlavniBarva: barva },
});

test('druhLekce: učební, naostro, B, testy v obou předmětech', () => {
  assert.deepEqual(druhLekce('M8-T03-L2'), { predmet: 'matematika', tema: 3, naostro: false, b: false, test: null, hlavni: 'M8-T03-L2', ucebni: 'M8-T03-L2' });
  assert.deepEqual(druhLekce('M8-T03-L2NB'), { predmet: 'matematika', tema: 3, naostro: true, b: true, test: null, hlavni: 'M8-T03-L2N', ucebni: 'M8-T03-L2' });
  assert.deepEqual(druhLekce('cj-t3-l10nb'), { predmet: 'cestina', tema: 3, naostro: true, b: true, test: null, hlavni: 'cj-t3-l10n', ucebni: 'cj-t3-l10' });
  assert.equal(druhLekce('M8-T00-DIAG').test, 'uvodni');
  assert.equal(druhLekce('cj-t0-pol').test, 'pololetni');
  assert.equal(druhLekce('P1'), null);
  assert.equal(idBVarianty('M8-T03-L2N'), 'M8-T03-L2NB');
  assert.equal(idBVarianty('cj-t3-l10'), 'cj-t3-l10b');
  assert.equal(idBVarianty('cj-t3-l10b'), null);
  assert.equal(idBVarianty('M8-T00-POL'), null);
});

test('pořadí v tématu s odstupem: L1, L2, L1N, L3, L2N, L4, L3N, L4N', () => {
  const t = tema(1).filter((l) => !druhLekce(l.id).b);
  assert.deepEqual(poradiVTematu(t).map((l) => l.id),
    ['M8-T01-L1', 'M8-T01-L2', 'M8-T01-L1N', 'M8-T01-L3', 'M8-T01-L2N', 'M8-T01-L4', 'M8-T01-L3N', 'M8-T01-L4N']);
  // bez naostro lekcí (zatím nenapsané) zůstane L1–L4
  assert.deepEqual(poradiVTematu(t.filter((l) => !druhLekce(l.id).naostro)).map((l) => l.poradi), [1, 2, 3, 4]);
});

test('plán roku: témata v doporučeném pořadí, bez B-variant a testů; začaté lekce první', () => {
  const k = [...tema(1), ...tema(2), { id: 'M8-T00-DIAG', tyden: 0, poradi: 1, stavLekce: 'hotovo' }];
  const plan = planRoku(k, [2, 1]);
  assert.equal(plan.length, 16);
  assert.equal(plan[0].id, 'M8-T02-L1');
  assert.equal(plan[8].id, 'M8-T01-L1');
  assert.ok(plan.every((l) => !druhLekce(l.id).b && !druhLekce(l.id).test));
  // dítě začalo tématem 1 (před pololetním testem), pak se pořadí změnilo: hotová L1 zůstává první
  hotovo(k.find((l) => l.id === 'M8-T01-L1'), '2026-11-02T10:00:00');
  assert.deepEqual(planRoku(k, [2, 1]).slice(0, 3).map((l) => l.id), ['M8-T01-L1', 'M8-T02-L1', 'M8-T02-L2']);
});

test('kalendář: 3 lekce týdně od prvního sezení, zameškané se sčítají, začaté jsou vždy otevřené', () => {
  const k = tema(1);
  const plan = planRoku(k, [1]);
  // nic nezačato: první týden (3 lekce) od dneška
  let kal = kalendar(plan, null, den('2026-11-02'));
  assert.deepEqual(plan.filter((l) => kal.get(l.id).otevreno).map((l) => l.id), ['M8-T01-L1', 'M8-T01-L2', 'M8-T01-L1N']);
  assert.equal(kal.get('M8-T01-L3').od.getDate(), 9);
  // začátek 2. 11., dnes 17. 11. = 3. týden → 9 lekcí (téma má 8)
  const start = zacatekKalendare([hotovo(k[0], '2026-11-02T18:00:00')]);
  assert.equal(tydenKalendare(start, den('2026-11-17')), 2);
  kal = kalendar(planRoku(k, [1]), start, den('2026-11-17'));
  assert.equal([...kal.values()].filter((x) => x.otevreno).length, 8);
  // 2. týden: 6 otevřených
  kal = kalendar(planRoku(k, [1]), start, den('2026-11-10'));
  assert.equal([...kal.values()].filter((x) => x.otevreno).length, 2 * LEKCI_TYDNE);
  assert.equal(otevreniPololetniho(start).toISOString().slice(0, 10), new Date(new Date('2026-11-02T00:00:00').getTime() + 70 * 864e5).toISOString().slice(0, 10));
});

test('B-varianta jen po červené; doporučí se před další lekcí plánu', () => {
  const k = tema(1);
  const podleId = new Map(k.map((l) => [l.id, l]));
  const l1 = podleId.get('M8-T01-L1');
  hotovo(l1, '2026-11-02T10:00:00', 'oranzova');
  assert.equal(bVariantaPoCervene(l1, podleId), null);
  let plan = planRoku(k.filter((l) => !druhLekce(l.id).b), [1]);
  let kal = kalendar(plan, den('2026-11-02'), den('2026-11-03'));
  assert.equal(dalsiLekceRoku(plan, kal, podleId).id, 'M8-T01-L2');
  l1.souhrn.hlavniBarva = 'cervena';
  plan = planRoku(k, [1]);
  kal = kalendar(plan, den('2026-11-02'), den('2026-11-03'));
  const dalsi = dalsiLekceRoku(plan, kal, podleId);
  assert.equal(dalsi.id, 'M8-T01-L1B');
  assert.equal(dalsi.bPo, 'M8-T01-L1');
  // B hotová (i červeně) → dál podle plánu
  hotovo(podleId.get('M8-T01-L1B'), '2026-11-03T10:00:00', 'cervena');
  assert.equal(dalsiLekceRoku(plan, kal, podleId).id, 'M8-T01-L2');
});

test('kalendář zamyká: po 3 hotových lekcích v 1. týdnu není co doporučit', () => {
  const k = tema(1);
  const podleId = new Map(k.map((l) => [l.id, l]));
  ['M8-T01-L1', 'M8-T01-L2', 'M8-T01-L1N'].forEach((id, i) => hotovo(podleId.get(id), `2026-11-0${2 + i}T10:00:00`));
  const plan = planRoku(k, [1]);
  const start = zacatekKalendare(k);
  assert.equal(dalsiLekceRoku(plan, kalendar(plan, start, den('2026-11-05')), podleId), null);
  assert.equal(dalsiLekceRoku(plan, kalendar(plan, start, den('2026-11-09')), podleId).id, 'M8-T01-L3');
});
