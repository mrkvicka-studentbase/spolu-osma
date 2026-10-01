// =====================================================================
// screenshoty-f2.mjs — průchod Fáze 2 pro screenshoty.mjs --f2 (bez sítě proti Supabase: --bez-site,
// fake-supabase.js v localStorage prohlížeče). Vzorové lekce testy/data/F2-VZOR-*.json (?lokalne=1).
//   A) simulace v aplikaci: žák část 1 a 2 (start, postup, rýsování, A/N, A–E, A–F, konec), rodič během
//      testu (i 40. minuta), „Dítě odevzdalo", Kontrola (postup + konstrukce), souhrn; žák po Kontrole
//   B) simulace na papír: žák (papír), rodič během testu, Kontrola po číslech archu, souhrn, žák po Kontrole
//   C) rozdělená simulace (2. část druhý den → 35 min)
//   D) blok na čas: žák rýsování „Hotovo", rodič během bloku (R46) a po bloku rýsování Sedí / Nesedí (podrobně pruchodBlok, --blok)
//   E) tisk: testový sešit + vzorce + záznamový arch (1 : 1), blok s rámečky archu
//   F) přehled: karty bloku a simulace (rodič, žák)
// Snímky: reporty/obrazky/<datum>-f2-*.png (375 a 1280 px, světlý a tmavý motiv).
// =====================================================================

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Společní pomocníci průchodů F2 a bloku: fake DB, katalog, role, motiv, odpovídání žáka. */
async function priprav({ js, KOREN }) {
  const kontroly = [];
  const over = (podminka, popis) => { kontroly.push(`${podminka ? '✔' : '✘'} ${popis}`); if (!podminka) process.exitCode = 1; };
  const lekce = async (id) => JSON.parse(await readFile(join(KOREN, 'testy', 'data', `${id}.json`), 'utf8'));
  const L1 = await lekce('F2-VZOR-L1');
  const L2 = await lekce('F2-VZOR-L2');
  const BLOK = await lekce('F2-VZOR-BLOK');
  const sim = await import(pathToFileURL(join(KOREN, 'web', 'js', 'simulace.js')).href);
  const DITE = '00000000-0000-4000-8000-0000000000d1';
  const Q = `&dite=${DITE}&lokalne=1`;

  // --- katalog (metadata jako RPC katalog_lekci) a výchozí stav
  const meta = (l, extra = {}) => ({ id: l.id, faze: l.faze, tyden: l.tyden, poradi: l.poradi, tema: l.tema, kapitola: l.kapitola,
    varianta: l.varianta, cas_min: l.cas_min, otevrit_od: '2026-09-01T00:00:00+02:00', verejna: false, verze: 1, zamceno: null, ...extra });
  const P1 = JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', 'P1.json'), 'utf8'));
  const katalog = [meta(P1), meta(BLOK), meta({ ...BLOK, id: 'F2-T08-L2', tema: 'Blok 12', poradi: 2 }), meta(L1), meta(L2)];
  const reset = (motiv = 'svetly', role = 'zak') => js(`(() => {
    localStorage.removeItem('spolu.fake-db');
    Object.keys(localStorage).filter((k) => k.startsWith('spolu.sim.') || k.startsWith('spolu.postup.') || k.startsWith('spolu.odpocet.') || k.startsWith('spolu.blok.')).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem('spolu.fake-katalog', ${JSON.stringify(JSON.stringify(katalog))});
    localStorage.setItem('spolu.role', ${JSON.stringify(role)});
    localStorage.setItem('spolu.dite', ${JSON.stringify(DITE)});
    localStorage.setItem('spolu.manual-precteno', '1');
    const d = new Date(), dnes = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    ['F2-VZOR-L1', 'F2-VZOR-L2', 'F2-VZOR-BLOK', 'P1'].forEach((l) => localStorage.setItem('spolu.pripraveno.' + l, dnes));
    localStorage.setItem('spolu.motiv', ${JSON.stringify(motiv)});
    return true; })()`);
  const role = (r) => js(`localStorage.setItem('spolu.role', ${JSON.stringify(r)}); true`);
  const motivJs = (m) => js(`localStorage.setItem('spolu.motiv', ${JSON.stringify(m)}); window.spoluMotiv?.pouzij?.(); true`);
  const db = () => js(`JSON.parse(localStorage.getItem('spolu.fake-db') || 'null')`);
  const upravDb = (fn) => js(`(async () => {
    if (!localStorage.getItem('spolu.fake-db')) await (await import('/nastroje/fake-supabase.js')).createClient().from('deti').select('*'); // založí výchozí DB
    const db = JSON.parse(localStorage.getItem('spolu.fake-db')); (${fn})(db); localStorage.setItem('spolu.fake-db', JSON.stringify(db)); return true; })()`);
  const text = () => js('document.body.innerText');

  /** Odpovídá v lekci žáka (správně, nebo podle `prepis` 'U-id/krok' → hodnota); zastaví před krokem `stop`. */
  const odpovidej = (lekceObj, prepis = {}, stop = null) => js(`(async () => {
    const l = ${JSON.stringify(lekceObj)}; const P = ${JSON.stringify(prepis)}; const STOP = ${JSON.stringify(stop)};
    const cekej = (ms) => new Promise((r) => setTimeout(r, ms));
    let neutralni = true; let kroku = 0; const pocty = {};
    for (let i = 0; i < 120; i++) {
      if (document.querySelector('.konec-lekce')) return { stav: 'konec', neutralni, kroku };
      const sekce = document.querySelector('.krok:not(.krok--hotovy)');
      if (!sekce) { [...document.querySelectorAll('button')].find((b) => /Další úloha/.test(b.textContent))?.click(); await cekej(250); continue; }
      const [, ulohaId, krokId] = /^popisek-(.+)-([^-]+)$/.exec(sekce.querySelector('.krok__popisek').id);
      const klic = ulohaId.replace(l.id + '-', '') + '/' + krokId;
      if (STOP && klic === STOP) return { stav: 'stop', neutralni, kroku };
      const krok = l.ulohy.find((u) => u.id === ulohaId).kroky.find((k) => k.id === krokId);
      const n = (pocty[klic] = (pocty[klic] || 0) + 1) - 1; // {pokusy: [1., 2.]} = jiná hodnota v každém pokusu
      const t = krok.vstup.typ; const pr = Array.isArray(P[klic]?.pokusy) ? P[klic].pokusy[Math.min(n, P[klic].pokusy.length - 1)] : P[klic];
      if (t === 'dlazdice') sekce.querySelector('[data-id="' + (pr ?? krok.vstup.moznosti.find((m) => m.spravne).id) + '"]').click();
      else if (t !== 'rysovani') {
        const sp = krok.spravne;
        const h = pr !== undefined ? [].concat(pr) : t === 'cislo' ? [sp.hodnota] : t === 'zlomek' ? [sp.c, sp.j] : t === 'vyraz' ? [sp.vyraz] : [sp.cela, sp.c, sp.j];
        [...sekce.querySelectorAll('input.pole')].forEach((p, j) => { p.value = String(h[j]).replace('.', ','); p.dispatchEvent(new Event('input', { bubbles: true })); });
      }
      sekce.querySelector('.krok__akce button').click();
      await cekej(200);
      kroku += 1;
      if (l.typ === 'simulace' && (sekce.querySelector('.zpetna-vazba')?.textContent !== 'Uloženo.' || sekce.querySelector('.je-spravne, .je-nesedi'))) neutralni = false;
    }
    return { stav: 'limit', neutralni, kroku }; })()`);
  return { kontroly, over, L1, L2, BLOK, sim, DITE, Q, reset, role, motivJs, db, upravDb, text, odpovidej };
}

export async function pruchodF2({ js, jdiNa, pockej, snimek, viewport, cekej, WEB, KOREN, nactene }) {
  const { kontroly, over, L1, L2, BLOK, sim, DITE, Q, reset, role, motivJs, db, upravDb, text, odpovidej } = await priprav({ js, KOREN });

  /** Rodičova Kontrola: klepnutí podle plánu [{pozice, krok, hodnota}]. */
  const klikej = (plan) => js(`(async () => {
    const cekej = (ms) => new Promise((r) => setTimeout(r, ms));
    let ok = 0;
    for (const p of ${JSON.stringify(plan)}) {
      const a = [...document.querySelectorAll('.sim-kontrola__uloha')].find((x) => x.getAttribute('aria-label') === 'Úloha ' + p.pozice);
      const b = a?.querySelector('.sim-polozka[data-krok="' + p.krok + '"] button[data-hodnota="' + p.hodnota + '"]');
      if (!b) continue;
      b.click(); ok += 1;
      for (let i = 0; i < 20 && b.disabled; i++) await cekej(50);
      await cekej(60);
    }
    return ok; })()`);
  /** Plán Kontroly: vše podle klíče (správné písmeno, Sedí, postup Ano), s výjimkami `jinak` 'pozice/krok' → hodnota. */
  const planKontroly = (lekce_, rezim, jinak = {}) => sim.polozkyKontroly(lekce_, rezim).flatMap(({ uloha, polozky }) => polozky.map(({ krok, druh }) => {
    const krokId = druh === 'postup' ? sim.postupKrokId(krok.id) : krok.id;
    const vychozi = druh === 'postup' ? 'ano' : druh === 'pismena' ? krok.vstup.moznosti.find((m) => m.spravne).id : 'sedi';
    return { pozice: uloha.pozice, krok: krokId, hodnota: jinak[`${uloha.pozice}/${krokId}`] ?? vychozi };
  }));
  const ocekavanySouhrn = async (rezim, rozdeleno = false) => {
    const d = await db();
    const s1 = d.sezeni.filter((s) => s.lekce_id === L1.id).at(-1);
    const s2 = d.sezeni.filter((s) => s.lekce_id === L2.id).at(-1);
    return sim.sestavSouhrnSimulace({ lekce1: L1, lekce2: L2, rezim, rozdeleno,
      odpovedi1: d.odpovedi.filter((o) => o.sezeni_id === s1?.id), odpovedi2: d.odpovedi.filter((o) => o.sezeni_id === s2?.id) });
  };
  const zakaz = /gymn|stačí na|přijet|přijme/i;

  try {
    // =================================================================== A) simulace v aplikaci
    await viewport(1280, 900);
    await jdiNa(`${WEB}/index.html`);
    await reset('svetly', 'zak');
    await jdiNa(`${WEB}/lekce.html?lekce=${L1.id}${Q}&rezim=app`);
    await pockej(`document.querySelector('.sim-start')`, 'start simulace');
    const start = await js(`({ odpocet: document.getElementById('odpocetCas')?.textContent, prubeh: document.getElementById('prubehText')?.textContent, t: document.body.innerText })`);
    over(/^(70:00|69:5\d)$/.test(start.odpocet) && /Doporučené pořadí: 1–8, pak 11–15/.test(start.t), `žák start: odpočet ${start.odpocet} (70 min), tempo na startu`);
    await snimek('zak-start-1280');
    await js(`[...document.querySelectorAll('.sim-start button')][0].click(); true`);
    await pockej(`document.querySelector('.krok')`, 'úloha 1');
    let r = await odpovidej(L1, {}, 'U2/final');
    await js('window.scrollTo(0, 0); true');
    const postup = await js(`({ hint: Boolean(document.querySelector('.krok:not(.krok--hotovy) .krok__postup')), stitek: document.querySelector('.karta-ulohy .stitek--navy')?.textContent })`);
    over(r.stav === 'stop' && r.neutralni && postup.hint && postup.stitek === 'Úloha 2', 'žák: úloha 2 = „Úloha 2" z testu, po každém kroku jen „Uloženo." bez ✔/✘, u 2.3 pokyn „Celý postup napiš na papír"');
    await snimek('zak-postup-1280');
    r = await odpovidej(L1, { 'U5/final': 800, 'U7/k1': 12, 'U3/final': '9-4x' });
    over(r.stav === 'konec' && r.neutralni, `žák část 1: ${r.kroku} kroků, 1 pokus, neutrálně, konec části 1`);
    await snimek('zak-konec1-1280');
    await js(`document.querySelector('.konec-lekce a.tlacitko--primarni').click(); true`);
    await pockej(`document.querySelector('.sim-start')`, 'start 2. části');
    const start2 = await js(`({ t: document.body.innerText, odpocet: document.getElementById('odpocetCas')?.textContent })`);
    over(/Čas běží dál od začátku 1. části/.test(start2.t) && /^(6\d|70):/.test(start2.odpocet), `žák start 2. části: jeden odpočet (zbývá ${start2.odpocet})`);
    await snimek('zak-start2-1280');
    await js(`[...document.querySelectorAll('.sim-start button')][0].click(); true`);
    await pockej(`document.querySelector('.krok')`, 'úloha 9');
    r = await odpovidej(L2, {}, 'U1/final');
    const rys = await js(`({ t: document.querySelector('.krok:not(.krok--hotovy)')?.innerText, tl: document.querySelector('.krok:not(.krok--hotovy) .krok__akce button')?.textContent })`);
    over(/Rýsuj na papír. Až to bude hotové, ukaž to rodiči./.test(rys.t) && /Hotovo/.test(rys.tl), 'žák rýsování: „Rýsuj na papír…" a tlačítko Hotovo');
    await js('window.scrollTo(0, 0); true');
    await snimek('zak-rysovani-1280');
    r = await odpovidej(L2, {}, 'U3/k1');
    const an = await js(`[...document.querySelectorAll('.krok:not(.krok--hotovy) .dlazdice__pismeno')].map((x) => x.textContent)`);
    over(JSON.stringify(an) === '["A","N"]', `žák A/N: štítky ${JSON.stringify(an)}, pevné pořadí`);
    await snimek('zak-an-1280');
    await viewport(375, 812, true);
    await motivJs('tmavy');
    r = await odpovidej(L2, { 'U3/final': 'a' }, 'U4/final');
    const ae = await js(`[...document.querySelectorAll('.krok:not(.krok--hotovy) .dlazdice__pismeno')].map((x) => x.textContent).join('')`);
    over(ae === 'A)B)C)D)E)', `žák A–E: ${ae}`);
    await js('window.scrollTo(0, 0); true');
    await snimek('zak-ae-tmavy-375');
    r = await odpovidej(L2, { 'U4/final': 'a', 'U6/final': 'a' }, 'U7/k1');
    const af = await js(`[...document.querySelectorAll('.krok:not(.krok--hotovy) .dlazdice__pismeno')].map((x) => x.textContent).join('')`);
    over(af === 'A)B)C)D)E)F)', `žák A–F: ${af}`);
    await snimek('zak-af-tmavy-375');
    await viewport(1280, 900);
    await motivJs('svetly');
    r = await odpovidej(L2, { 'U7/k2': 'a' });
    await pockej(`document.querySelector('.sim-konec')`, 'konec testu', 8000);
    const konec = await js(`({ cisla: [...document.querySelectorAll('.sim-sedi__cislo')].map((x) => Number(x.textContent)), t: document.getElementById('plocha').innerText })`);
    over(r.neutralni && konec.cisla.length > 0 && !/%|bod|z 50|z 25/.test(konec.t) && /Zítra spolu projdeme 4 úlohy/.test(konec.t) && /zkontroluje rodič/.test(konec.t),
      `žák konec: „Test máš za sebou", zeleně jen čísla ${konec.cisla.join(', ')}, bez počtu/bodů/procent, postup a rýsování čekají na rodiče`);
    await snimek('zak-konec-1280');

    // --- rodič během testu
    await role('rodic');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/rodic.html?lekce=${L1.id}${Q}`);
    await pockej(`document.querySelector('.sim-bezi') && ${nactene}`, 'rodič: simulace běží');
    const bezi = await text();
    over(/Simulace běží/.test(bezi) && /Dítě odevzdalo 16 z 16 úloh/.test(bezi) && /Nenapovídejte/.test(bezi) && !/Ukázat řešení|Správně:|Typická chyba/.test(bezi),
      'rodič během testu: odpočet, 3 pravidla, „Dítě odevzdalo 16 z 16", žádný tahák, klíč ani řešení');
    await snimek('rodic-bezi-375');
    await upravDb(`(db) => { const t = Date.now(); for (const s of db.sezeni) s.zacatek = new Date(t - (s.lekce_id === '${L1.id}' ? 45 : 44) * 60000).toISOString(); }`);
    await motivJs('tmavy');
    await jdiNa(`${WEB}/rodic.html?lekce=${L2.id}${Q}`);
    await pockej(`document.querySelector('.sim-bezi') && ${nactene}`, 'rodič 40. minuta');
    const t40 = await text();
    over(/přejdi na úlohy 11–15/.test(t40) && /Dítě teď vidí na obrazovce/.test(t40) && /2[45]:\d\d/.test(t40), 'rodič ve 40. minutě (otevřeno z karty 2. části): připomínka tempa, zbývá ~25 min');
    await snimek('rodic-bezi-40min-tmavy-375');
    await motivJs('svetly');
    await js(`[...document.querySelectorAll('.sim-bezi button')].find((b) => /Dítě odevzdalo/.test(b.textContent)).click(); true`);
    await pockej(`document.querySelector('dialog[open]')`, 'potvrzení');
    await js(`[...document.querySelectorAll('dialog[open] button')].find((b) => /Ano, odevzdalo/.test(b.textContent)).click(); true`);
    await pockej(`document.querySelector('.sim-kontrola')`, 'Kontrola (aplikace)');
    const kApp = await js(`({ druhy: [...new Set([...document.querySelectorAll('.sim-polozka')].map((p) => p.className.match(/sim-polozka--(\\w+)/)[1]))], n: document.querySelectorAll('.sim-polozka').length })`);
    over(JSON.stringify(kApp.druhy.sort()) === '["postup","rysovani"]', `Kontrola v aplikaci: jen postup a rýsování (${kApp.n} položek)`);
    await snimek('rodic-kontrola-app-375');
    await klikej(planKontroly(L1, 'app', { '3/final_postup': 'ne' }));
    await klikej(planKontroly(L2, 'app', { '10/final': 'nesedi' }));
    await js(`document.querySelectorAll('.sim-kontrola details').forEach((d) => { d.open = true; }); true`);
    await snimek('rodic-kontrola-app-vyplneno-375');
    await js(`[...document.querySelectorAll('.sim-kontrola button')].find((b) => /Zobrazit souhrn/.test(b.textContent)).click(); true`);
    await pockej(`document.querySelector('.sim-souhrn')`, 'souhrn');
    await cekej(600);
    const oA = await ocekavanySouhrn('app');
    const tSouhrn = await text();
    over(new RegExp(`Orientačně ${oA.body} z 50 \\(1\\. část ${oA.casti[0].body} z 25, 2\\. část ${oA.casti[1].body} z 25\\)\\. Jen pro vás\\.`).test(tSouhrn)
      && /Bodování je orientační, u zkoušky se může lišit\./.test(tSouhrn) && !zakaz.test(tSouhrn),
    `souhrn (aplikace): „Orientačně ${oA.body} z 50 (${oA.casti[0].body} + ${oA.casti[1].body})", věta o orientačním bodování, žádná hranice přijetí`);
    over(/Podle částí testu/.test(tSouhrn) && /Na co dítě nejčastěji naráží/.test(tSouhrn) && /Před zkouškou projděte znovu/.test(tSouhrn), 'souhrn: rozpad po částech, nejčastější chyby, doporučení lekcí');
    const ulozeno = (await db()).sezeni.filter((s) => s.souhrn?.typ === 'simulace' && s.stav === 'dokonceno').length;
    over(ulozeno === 2, 'souhrn uložen do sezeni.souhrn obou částí (dokoncitSezeni)');
    await snimek('rodic-souhrn-375');
    await motivJs('tmavy');
    await cekej(300);
    await snimek('rodic-souhrn-tmavy-375');
    await viewport(1280, 900);
    await motivJs('svetly');
    await cekej(300);
    await snimek('rodic-souhrn-1280');

    // --- žák po Kontrole
    await role('zak');
    await jdiNa(`${WEB}/lekce.html?lekce=${L2.id}${Q}`);
    await pockej(`document.querySelector('.sim-konec')`, 'žák po Kontrole');
    const poK = await js(`[...document.querySelectorAll('.sim-sedi__cislo')].map((x) => Number(x.textContent))`);
    over(JSON.stringify(poK) === JSON.stringify(oA.sedi), `žák po Kontrole: sedí ${poK.join(', ')} (= souhrn rodiče)`);
    await snimek('zak-po-kontrole-1280');

    // =================================================================== B) simulace na papír
    await reset('svetly', 'rodic');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/rodic.html?lekce=${L1.id}${Q}&rezim=papir`);
    await pockej(`document.querySelector('.sim-bezi') && ${nactene}`, 'rodič papír běží');
    const tp = await text();
    over(/Před startem přečtěte dítěti/.test(tp) && !/Dítě odevzdalo \d+ z/.test(tp), 'rodič papír: citace tempa „Před startem přečtěte dítěti", bez počtu odevzdaných');
    await snimek('rodic-bezi-papir-375');
    await role('zak');
    await viewport(1280, 900);
    await jdiNa(`${WEB}/lekce.html?lekce=${L1.id}${Q}`);
    await pockej(`/Test píšeš na papír/.test(document.body.innerText)`, 'žák papír');
    const tiskOdkaz = await js(`document.querySelector('a[href*="tisk.html"]')?.getAttribute('href')`);
    over(/lekce=F2-VZOR-L1%2CF2-VZOR-L2/.test(tiskOdkaz || ''), `žák papír: odkaz na tisk obou částí (${tiskOdkaz?.slice(0, 50)}…)`);
    await snimek('zak-papir-1280');
    await role('rodic');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/rodic.html?lekce=${L1.id}${Q}`);
    await pockej(`document.querySelector('.sim-bezi') && ${nactene}`, 'rodič papír');
    await js(`[...document.querySelectorAll('.sim-bezi button')].find((b) => /Dítě odevzdalo/.test(b.textContent)).click(); true`);
    await pockej(`document.querySelector('dialog[open]')`, 'potvrzení');
    await js(`[...document.querySelectorAll('dialog[open] button')].find((b) => /Ano, odevzdalo/.test(b.textContent)).click(); true`);
    await pockej(`document.querySelector('.sim-kontrola')`, 'Kontrola papír');
    const kP = await js(`({ druhy: [...new Set([...document.querySelectorAll('.sim-polozka')].map((p) => p.className.match(/sim-polozka--(\\w+)/)[1]))].sort(),
      spravne: [...document.querySelectorAll('.sim-spravne')].map((x) => x.innerText.replace(/\\s+/g, ' ')).slice(0, 3),
      uznava: document.querySelector('.sim-uznava')?.innerText, pismena: [...document.querySelectorAll('.sim-pismena')].length })`);
    over(JSON.stringify(kP.druhy) === '["pismena","postup","rysovani","vysledek"]' && kP.pismena === 9,
      `Kontrola papír: výsledek, písmena (9 kroků), postup, konstrukce; „${kP.spravne[0]}", „${kP.uznava}"`);
    await snimek('rodic-kontrola-papir-375');
    await motivJs('tmavy');
    await cekej(300);
    await snimek('rodic-kontrola-papir-tmavy-375');
    await motivJs('svetly');
    await klikej(planKontroly(L1, 'papir', { '1/final': 'nesedi', '7/final': 'nesedi', '4/k1_postup': 'ne' }));
    await klikej(planKontroly(L2, 'papir', { '12/final': 'd', '11/final': 'a', '15/k2': 'a', '13/final': 'dva' }));
    await cekej(800);
    const zbyva = await js(`document.querySelector('.sim-kontrola__zbyva')?.textContent + ' ' + [...document.querySelectorAll('.sim-polozka')].filter((p) => !p.querySelector('.sim-polozka__stav .ikona')).map((p) => p.closest('article').getAttribute('aria-label') + '/' + p.dataset.krok).join(',')`);
    over(/Všechno je zkontrolované/.test(zbyva || ''), `Kontrola papír: vše odklepnuto („${zbyva}")`);
    await js(`[...document.querySelectorAll('.sim-kontrola button')].find((b) => /Zobrazit souhrn/.test(b.textContent)).click(); true`);
    await pockej(`document.querySelector('.sim-souhrn')`, 'souhrn papír');
    await cekej(600);
    const oB = await ocekavanySouhrn('papir');
    const tB = await text();
    const dvaKrizky = (await db()).odpovedi.some((o) => o.hodnota === 'dva' && o.typ_chyby === 'dva-krizky' && o.zadal === 'rodic');
    over(tB.includes(`Orientačně ${oB.body} z 50`) && dvaKrizky && /Bodování je orientační/.test(tB),
      `souhrn (papír): ${oB.body} z 50; klepnutí na písmeno uloží typ chyby distraktoru, „Dva křížky" = dva-krizky; chyby: ${oB.chyby.map((c) => c.typ_chyby).join(', ')}`);
    await snimek('rodic-souhrn-papir-375');
    await role('zak');
    await viewport(1280, 900);
    await jdiNa(`${WEB}/lekce.html?lekce=${L1.id}${Q}`);
    await pockej(`document.querySelector('.sim-konec')`, 'žák papír po Kontrole');
    const pB = await js(`[...document.querySelectorAll('.sim-sedi__cislo')].map((x) => Number(x.textContent))`);
    over(JSON.stringify(pB) === JSON.stringify(oB.sedi), `žák papír po Kontrole: sedí ${pB.join(', ')}`);
    await snimek('zak-konec-papir-1280');

    // =================================================================== C) rozdělená simulace
    await reset('svetly', 'zak');
    await upravDb(`(db) => { const z = new Date(Date.now() - 26 * 3600e3).toISOString();
      db = db; db.sezeni.push({ id: 'sim-rozd-1', dite_id: '${DITE}', lekce_id: '${L1.id}', rezim: 'app', zacatek: z, konec: null, stav: 'probiha', souhrn: null });
      db.odpovedi.push({ id: 9001, sezeni_id: 'sim-rozd-1', uloha_id: '${L1.id}-U1', krok_id: 'final', hodnota: 135, spravne: true, typ_chyby: null, pokus: 1, zadal: 'dite', created_at: new Date(Date.now() - 25.5 * 3600e3).toISOString() }); }`);
    await jdiNa(`${WEB}/lekce.html?lekce=${L2.id}${Q}&rezim=app`);
    await pockej(`document.querySelector('.sim-start')`, 'start 2. části druhý den');
    const rz = await js(`({ t: document.body.innerText, odpocet: document.getElementById('odpocetCas')?.textContent })`);
    over(/Dnes děláš 2. část. Máš na ni 35 minut./.test(rz.t) && /^(35:00|34:5\d)$/.test(rz.odpocet), `rozdělená simulace: 2. část druhý den → vlastní odpočet ${rz.odpocet}`);
    await snimek('zak-start2-rozdeleno-1280');

    // =================================================================== D) blok na čas
    await reset('svetly', 'zak');
    await jdiNa(`${WEB}/lekce.html?lekce=${BLOK.id}${Q}&rezim=app`);
    await pockej(`document.querySelector('.krok')`, 'blok úloha 1');
    r = await odpovidej(BLOK, {}, 'U3/final');
    await js('window.scrollTo(0, 0); true');
    await snimek('blok-zak-rysovani-1280');
    await js(`document.querySelector('.krok:not(.krok--hotovy) .krok__akce button').click(); true`);
    await cekej(300);
    const vazba = await js(`[...document.querySelectorAll('.krok--hotovy .zpetna-vazba')].at(-1)?.textContent`);
    over(/Rodič teď porovná tvoje rýsování s obrázkem/.test(vazba || ''), `blok žák: po „Hotovo" „${vazba}"`);
    await role('rodic');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}&rezim=app`);
    await pockej(`document.querySelector('.blok-bezi') && ${nactene}`, 'rodič blok');
    const beziBlok = await js(`document.getElementById('obsah').innerText`);
    over(/Blok na čas běží/.test(beziBlok) && /Odevzdáno 3 ze 4/.test(beziBlok) && !/Ukázat řešení|Typická chyba|Zasekne se/.test(beziBlok),
      'blok rodič (R46): během bloku jen „Blok na čas běží", „Odevzdáno 3 ze 4", bez taháku (podrobně --blok)');
    await snimek('blok-rodic-pruh-375');
    await upravDb(`(db) => { const s = db.sezeni[0]; for (const u of ['U1', 'U2']) db.semafory.push({ id: db.dalsiId++, sezeni_id: s.id, uloha_id: '${BLOK.id}-' + u, volba_rodice: 'sam', spravne_auto: true, barva: 'zelena' }); }`);
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}`);
    await pockej(`/Úloha 3/.test(document.querySelector('.prepinac-uloh')?.textContent || '') && ${nactene}`, 'rodič blok U3');
    await js(`document.querySelectorAll('#obsah details').forEach((d) => { d.open = true; }); true`);
    const rr = await js(`({ svg: Boolean(document.querySelector('.rysovani-rodic svg')), otazky: document.querySelectorAll('.rysovani-rodic__otazky li').length })`);
    over(rr.svg && rr.otazky === 3, 'blok rodič: rýsování — obrázek řešení, 3 kontrolní otázky, Sedí / Nesedí');
    await js(`document.querySelector('.rysovani-rodic button[data-hodnota="sedi"]').click(); true`);
    await cekej(500);
    const odp = (await db()).odpovedi.filter((o) => o.uloha_id === `${BLOK.id}-U3` && o.zadal === 'rodic');
    over(odp.length === 1 && odp[0].hodnota === 'sedi' && odp[0].spravne === true && odp[0].krok_id === 'final', 'blok rodič: „Sedí" uloženo jako odpověď rodiče na krok rysovani (spravne true)');
    await snimek('blok-rodic-rysovani-375');
    await motivJs('tmavy');
    await cekej(300);
    await snimek('blok-rodic-rysovani-tmavy-375');
    await motivJs('svetly');

    // =================================================================== E) tisk
    await viewport(900, 1200);
    await jdiNa(`${WEB}/tisk.html?lekce=${L1.id},${L2.id}&lokalne=1`);
    await pockej(`document.querySelector('.tisk-list--arch') && ${nactene} && !document.getElementById('tiskTlacitko').disabled`, 'tisk simulace');
    const tk = await js(`(() => {
      const mm = document.querySelector('.tisk-list').getBoundingClientRect().width / 210;
      const rys = [...document.querySelectorAll('.arch-rysovani svg')].map((s) => Math.round(s.getBoundingClientRect().width / mm));
      return { mm, rys, sesit: document.querySelectorAll('.tisk-list--sesit .tisk-uloha').length, cisla: [...document.querySelectorAll('.arch-uloha__cislo')].map((x) => x.textContent).join(','),
        postup: document.querySelectorAll('.arch-postup').length, linky: document.querySelectorAll('.arch-postup .arch-linka').length,
        krizky: [...document.querySelectorAll('.arch-radek--krizky')].map((r) => r.querySelectorAll('.arch-krizek').length).join(','),
        mocniny: document.querySelectorAll('.tisk-mocniny td').length, pokyn: /Křížek z rohu do rohu/.test(document.body.innerText),
        prepiste: /přepište do záznamového archu pouze výsledky/.test(document.body.innerText),
        klic: /Typická chyba|Když dítě|dvojnásobného součinu|Výsledek:\\*\\*/.test(document.body.innerText),
        obr7: Math.round(document.querySelector('.tisk-list--sesit .obrazek-ulohy--mm svg')?.getBoundingClientRect().width / mm) }; })()`);
    over(tk.sesit === 16 && tk.cisla === '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16' && tk.prepiste, `tisk: testový sešit se zadáním 1–16 a pokynem o přepisu výsledků; arch s čísly 1–16`);
    over(tk.rys.length === 2 && tk.rys.every((x) => Math.abs(x - 100) <= 1), `tisk: rýsovací pole 1 : 1 (${tk.rys.join(', ')} mm = obrazek_mm 100)`);
    over(tk.obr7 === 50, `tisk: obrázek úlohy 7 v sešitu ${tk.obr7} mm (obrazek_mm 50)`);
    over(tk.postup === 5 && tk.linky === 35, `tisk: ${tk.postup} rámečků „Celý postup" se 7 linkami (2.3, 3.3, 4.1, 4.2 x, 4.2 y)`);
    over(tk.krizky === '2,2,2,5,5,5,6,6,6', `tisk: křížky A/N ×3, A–E ×3, A–F ×3 (${tk.krizky})`);
    over(tk.mocniny === 20 && tk.pokyn && !tk.klic, 'tisk: strana se vzorci a tabulkou mocnin 11–20, pokyn o křížcích, klíč ani tahák se netisknou');
    await snimek('tisk-sesit-arch');
    await jdiNa(`${WEB}/tisk.html?lekce=${BLOK.id}&lokalne=1`);
    await pockej(`document.querySelector('.tisk-uloha') && ${nactene}`, 'tisk blok');
    const tb = await js(`({ ramecky: document.querySelectorAll('.arch-kroky').length, rys: document.querySelectorAll('.arch-rysovani svg').length })`);
    over(tb.ramecky === 4 && tb.rys === 1, 'tisk bloku (faze2): rámečky ve stylu archu u každého kroku, rýsovací pole 1 : 1');
    await snimek('tisk-blok');

    // =================================================================== F) přehled
    await reset('svetly', 'rodic');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled');
    const pr = await js(`[...document.querySelectorAll('.karta-lekce')].map((k) => k.querySelector('.karta-lekce__typ')?.textContent || '').filter(Boolean)`);
    over(JSON.stringify(pr) === JSON.stringify(['Blok na čas', 'Blok na čas', 'Simulace · 1. část', 'Simulace · 2. část']), `přehled: štítky typu ${JSON.stringify(pr)}`);
    await snimek('prehled-rodic-375');
    await js(`[...document.querySelectorAll('.karta-lekce--simulace button')][0].click(); true`);
    await pockej(`document.querySelector('#modalRezim[open]')`, 'modal simulace');
    await snimek('prehled-modal-simulace-375');
    await js(`document.querySelectorAll('dialog[open]').forEach((d) => d.close()); true`);
    await motivJs('tmavy');
    await role('zak');
    await viewport(1280, 900);
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled žák');
    await snimek('prehled-zak-tmavy-1280');
    await motivJs('svetly');
  } finally {
    console.log(kontroly.map((k) => `  ${k}`).join('\n'));
  }
}

// =====================================================================
// --blok (R46, 26. 9.): blok na čas u rodiče (během bloku, přechod tlačítkem i automaticky, procházení „Po bloku",
// papír), konec bloku u žáka, tisk rýsovacího pole F2-T04-L1 (kontrolní úsečka 5 cm, pokyn 100 %, měřítko 1 : 1
// v media print) a rámeček zadání žáka F2-T03-L2 U3 na 375 px („Zadání pokračuje"). Bez sítě (fake-supabase.js).
// Snímky: reporty/obrazky/<datum>-blok-*.png (375 a 1280 px, světlý a tmavý motiv).
// =====================================================================
export async function pruchodBlok({ js, jdiNa, pockej, snimek, snimekPrvku, snimekOkna, viewport, cekej, media, WEB, KOREN, nactene }) {
  const { kontroly, over, BLOK, DITE, Q, reset, role, motivJs, db, upravDb, odpovidej } = await priprav({ js, KOREN });
  const obsahText = () => js(`document.getElementById('obsah').innerText`);
  const tahak = /Ukázat řešení|Typická chyba|Zasekne se|Co vidí dítě|Další otázka|Klikněte, jak to šlo|O co jde/;
  /** Snímek ve světlém a tmavém motivu: <zaklad>-<sirka>.png a <zaklad>-tmavy-<sirka>.png. */
  const obaMotivy = async (zaklad, sirka) => {
    await snimek(`${zaklad}-${sirka}`);
    await motivJs('tmavy');
    await cekej(300);
    await snimek(`${zaklad}-tmavy-${sirka}`);
    await motivJs('svetly');
    await cekej(200);
  };
  const telefon = () => viewport(375, 812, true);
  const pc = () => viewport(1280, 900);
  const sezeniBloku = async () => (await db()).sezeni.filter((x) => x.lekce_id === BLOK.id).at(-1);

  try {
    // =================================================================== A) žák: úlohy 1–2 (U1 na 2. pokus)
    await reset('svetly', 'zak');
    await pc();
    await jdiNa(`${WEB}/lekce.html?lekce=${BLOK.id}${Q}&rezim=app`);
    await pockej(`document.querySelector('.krok')`, 'blok úloha 1');
    let r = await odpovidej(BLOK, { 'U1/final': { pokusy: [[5, 8], [7, 12]] } }, 'U3/final');
    over(r.stav === 'stop', `žák: úlohy 1–2 odevzdané (${r.kroku} pokusů), stojí u rýsování úlohy 3`);

    // =================================================================== B) rodič během bloku (aplikace)
    await role('rodic');
    await telefon();
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}&rezim=app`);
    await pockej(`document.querySelector('.blok-bezi') && ${nactene}`, 'rodič: blok běží');
    let t = await obsahText();
    const bezi = await js(`({ lista: document.getElementById('listaLekce').innerText, odpocet: Boolean(document.getElementById('odpocet')),
      spodni: document.getElementById('spodniLista').hidden, prepinac: Boolean(document.querySelector('.prepinac-uloh, .postup-rodice')),
      tl: document.querySelector('.blok-bezi__prejit')?.className })`);
    over(/Blok na čas běží/.test(t) && /[01] min\s*uplynulo z doporučených 17 min/.test(t),
      'rodič během bloku: karta „Blok na čas běží", doporučený čas 17 min, uplynulo od začátku sezení');
    over(/Odevzdáno 2 ze 4/.test(t) && /Dítě řeší všechny 4 úlohy samo, vy mlčíte\. Smíte říct jen: „Zadej, co máš, a jdi dál\.“/.test(t),
      'rodič během bloku: „Odevzdáno 2 ze 4" a pravidlo „vy mlčíte… Zadej, co máš, a jdi dál."');
    over(!tahak.test(t) && !bezi.prepinac && bezi.spodni && !bezi.odpocet && !/Spustit čas/.test(bezi.lista),
      'rodič během bloku: žádný tahák, řešení, rady, přepínač úloh ani brána ①–④; lišta bez odpočtu');
    over(/tlacitko--sekundarni/.test(bezi.tl || '') && /Čas vypršel, projdeme to spolu/.test(t), 'tlačítko „Čas vypršel, projdeme to spolu" (před uplynutím času nezvýrazněné)');
    await obaMotivy('rodic-behem', 375);
    await pc();
    await obaMotivy('rodic-behem', 1280);
    await telefon();
    // přechod tlačítkem před uplynutím času → potvrzení; „Ještě ne" nechá blok běžet
    await js(`document.querySelector('.blok-bezi__prejit').click(); true`);
    await pockej(`document.querySelector('dialog[open]')`, 'potvrzení přechodu');
    const dlg = await js(`document.querySelector('dialog[open]').innerText`);
    over(/Projít úlohy už teď\?/.test(dlg) && /uvidíte řešení/.test(dlg), 'před uplynutím času: potvrzení „Projít úlohy už teď?"');
    await snimek('rodic-potvrzeni-375');
    await js(`[...document.querySelectorAll('dialog[open] button')].find((b) => /Ještě ne/.test(b.textContent)).click(); true`);
    await cekej(300);
    over(await js(`Boolean(document.querySelector('.blok-bezi')) && !document.querySelector('dialog[open]')`), '„Ještě ne": blok běží dál');
    // po doporučeném čase: tlačítko zvýrazněné, hláška „Čas. Dokonči rozdělaný krok."
    await upravDb(`(db) => { const s = db.sezeni.filter((x) => x.lekce_id === '${BLOK.id}').at(-1); s.zacatek = new Date(Date.now() - 18 * 60000).toISOString(); }`);
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}`);
    await pockej(`document.querySelector('.blok-bezi') && ${nactene}`, 'rodič: blok po čase');
    t = await obsahText();
    const tl2 = await js(`document.querySelector('.blok-bezi__prejit')?.className`);
    over(/18 min\s*uplynulo z doporučených 17 min/.test(t) && /Čas\. Dokonči rozdělaný krok\./.test(t) && /tlacitko--primarni/.test(tl2 || ''),
      'po 17 min: „Doporučený čas uplynul…" a zvýrazněné tlačítko (bez tvrdého stopu)');
    await obaMotivy('rodic-behem-cas', 375);

    // =================================================================== C) žák dokončí blok (U3 Hotovo, U4 2× nesedí)
    await role('zak');
    await pc();
    await jdiNa(`${WEB}/lekce.html?lekce=${BLOK.id}${Q}`);
    await pockej(`document.querySelector('.krok')`, 'žák: pokračování úlohou 3');
    r = await odpovidej(BLOK, { 'U4/final': { pokusy: [12, 11] } });
    await js(`[...document.querySelectorAll('#plocha button')].find((b) => /Dokončit lekci/.test(b.textContent))?.click(); true`);
    await pockej(`document.querySelector('.konec-lekce')`, 'žák: konec bloku');
    t = await js(`document.getElementById('plocha').innerText`);
    over(/Hotovo, ukaž telefon rodiči/.test(t) && /Blok na čas máš za sebou\. Zavolej rodiče, teď spolu projdete všechny 4 úlohy\./.test(t),
      'žák po poslední úloze: „Hotovo, ukaž telefon rodiči" + „Blok na čas máš za sebou…"');
    await obaMotivy('zak-konec', 1280);
    await telefon();
    await jdiNa(`${WEB}/lekce.html?lekce=${BLOK.id}${Q}`);
    await pockej(`document.querySelector('.konec-lekce')`, 'žák: konec bloku 375');
    await obaMotivy('zak-konec', 375);

    // =================================================================== D) rodič po bloku (všechny 4 odevzdané → procházení)
    await role('rodic');
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}`);
    await pockej(`document.querySelector('.prepinac-uloh') && ${nactene}`, 'rodič: po bloku');
    t = await obsahText();
    const po = await js(`({ lista: document.getElementById('listaLekce').innerText, dalsi: document.getElementById('dalsiUlohaNahore')?.disabled,
      chybi: document.getElementById('coChybi')?.textContent, zadalo: document.querySelector('.blok-zadalo')?.innerText || '',
      aktivni: document.querySelector('.postup-rodice__krok.je-aktivni .postup-rodice__nadpis')?.textContent })`);
    over(/Úloha 1 ze 4/.test(t) && /Po bloku: projděte spolu úlohy 1–4 od začátku\./.test(t) && /Po bloku/.test(po.lista),
      'po bloku: procházení od úlohy 1, pruh „Po bloku: projděte spolu úlohy 1–4 od začátku…"');
    over(po.aktivni === 'Dítě úlohu už vyřešilo. Podívejte se, co zadalo.' && /Dítě zadalo:/.test(po.zadalo) && /sedí/.test(po.zadalo) && /na 2\. pokus/.test(po.zadalo),
      `krok ① „Dítě úlohu už vyřešilo…", „Dítě zadalo:" (${po.zadalo.replace(/\s+/g, ' ').trim()})`);
    over(po.dalsi === true && /Nejdřív odškrtněte krok 1/.test(po.chybi || '') && /Nesedělo to\? Přečtěte otázku\./.test(await js(`document.getElementById('obsah').textContent`)),
      'po bloku: běžná karta ①–④ s branou (R28), krok ② „Nesedělo to? Přečtěte otázku."');
    await obaMotivy('rodic-po', 375);
    await pc();
    await obaMotivy('rodic-po', 1280);
    await telefon();
    await upravDb(`(db) => { const s = db.sezeni.filter((x) => x.lekce_id === '${BLOK.id}').at(-1); for (const u of ['U1', 'U2', 'U3']) db.semafory.push({ id: db.dalsiId++, sezeni_id: s.id, uloha_id: '${BLOK.id}-' + u, volba_rodice: 'sam', spravne_auto: true, barva: 'zelena' }); }`);
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}`);
    await pockej(`/Úloha 4/.test(document.querySelector('.prepinac-uloh')?.textContent || '') && ${nactene}`, 'rodič: po bloku úloha 4');
    const u4 = await js(`({ zadalo: document.querySelector('.blok-zadalo')?.innerText || '', semafor: document.querySelectorAll('.semafor-volba').length })`);
    over(/nesedí/.test(u4.zadalo) && /na 2\. pokus/.test(u4.zadalo) && u4.semafor >= 3, `úloha 4: „${u4.zadalo.replace(/\s+/g, ' ').trim()}", semafor jako u běžné lekce`);
    await snimek('rodic-po-u4-375');

    // =================================================================== E) automatický přechod při pollingu (Obnovit = stejná cesta)
    await reset('svetly', 'rodic');
    await telefon();
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}&rezim=app`);
    await pockej(`document.querySelector('.blok-bezi') && ${nactene}`, 'rodič: nové sezení bloku');
    const odp = (u, krok, hodnota, spravne, pokus = 1) => `db.odpovedi.push({ id: db.dalsiId++, sezeni_id: s.id, uloha_id: '${BLOK.id}-${u}', krok_id: '${krok}', hodnota: ${JSON.stringify(hodnota)}, spravne: ${spravne}, typ_chyby: null, pokus: ${pokus}, zadal: 'dite', created_at: new Date().toISOString() });`;
    await upravDb(`(db) => { const s = db.sezeni.filter((x) => x.lekce_id === '${BLOK.id}').at(-1);
      ${odp('U1', 'final', { c: 7, j: 12 }, true)} ${odp('U2', 'k1', 'b', true)} ${odp('U2', 'final', '4', false)} ${odp('U2', 'final', '4x', false, 2)}
      ${odp('U3', 'k1', 'b', true)} ${odp('U3', 'final', 'hotovo', null)} }`);
    await js(`document.querySelector('.blok-bezi .stav-zaka button').click(); true`);
    await pockej(`/Odevzdáno 3 ze 4/.test(document.getElementById('obsah').innerText)`, 'rodič: 3 ze 4 po obnovení');
    over(true, 'obnovení stavu během bloku: „Odevzdáno 3 ze 4" (U2 nesedí ani na 2. pokus = odevzdaná)');
    await upravDb(`(db) => { const s = db.sezeni.filter((x) => x.lekce_id === '${BLOK.id}').at(-1); ${odp('U4', 'final', 10, true)} }`);
    await js(`document.querySelector('.blok-bezi .stav-zaka button').click(); true`);
    await pockej(`document.querySelector('.prepinac-uloh')`, 'rodič: automatický přechod');
    const auto = await js(`({ t: document.body.innerText, uloha: document.querySelector('.prepinac-uloh strong')?.textContent })`);
    over(/Dítě odevzdalo všechny 4 úlohy\. Projděte je spolu od úlohy 1\./.test(auto.t) && auto.uloha === 'Úloha 1 ze 4',
      'všechny 4 odevzdané → sám přechod do procházení od úlohy 1 (hláška „Dítě odevzdalo všechny 4 úlohy…")');
    await snimek('rodic-prechod-auto-375');

    // =================================================================== F) papír: přechod jen tlačítkem, rodič opisuje
    await reset('svetly', 'rodic');
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}&rezim=papir`);
    await pockej(`document.querySelector('.blok-bezi') && ${nactene}`, 'rodič: blok na papír');
    t = await obsahText();
    over(/Dítě píše na papír\. Až dopíše \(nebo po 17 minutách\), klepněte na tlačítko níže\./.test(t) && !/Odevzdáno/.test(t) && !tahak.test(t),
      'papír během bloku: bez počtu odevzdaných, přechod jen tlačítkem');
    await obaMotivy('rodic-behem-papir', 375);
    await js(`document.querySelector('.blok-bezi__prejit').click(); true`);
    await pockej(`document.querySelector('dialog[open]')`, 'potvrzení (papír)');
    await js(`[...document.querySelectorAll('dialog[open] button')].find((b) => /Ano, projdeme to/.test(b.textContent)).click(); true`);
    await pockej(`document.querySelector('.prepinac-uloh')`, 'papír: procházení');
    const pap = await js(`({ t: document.getElementById('obsah').textContent, zadalo: Boolean(document.querySelector('.blok-zadalo')), opsat: Boolean(document.querySelector('.postup-rodice__krok[data-krok="semafor"] input.pole')) })`);
    over(/Dítě úlohu už vyřešilo na papír\. Podívejte se, co napsalo\./.test(pap.t) && /Opište výsledek, který dítě napsalo na papír/.test(pap.t) && !pap.zadalo && pap.opsat,
      'papír po bloku: krok ① „…na papír. Podívejte se, co napsalo.", v kroku ④ opsání výsledku jako dnes');
    await snimek('rodic-po-papir-375');
    await jdiNa(`${WEB}/rodic.html?lekce=${BLOK.id}${Q}`);
    await pockej(`document.querySelector('.prepinac-uloh, .blok-bezi') && ${nactene}`, 'papír: po obnovení');
    over(await js(`Boolean(document.querySelector('.prepinac-uloh')) && !document.querySelector('.blok-bezi')`), 'papír: procházení drží i po obnovení stránky (localStorage sezení)');

    // =================================================================== G) tisk F2-T04-L1: úsečka 5 cm, pokyn 100 %, 1 : 1
    const T04 = JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', 'F2-T04-L1.json'), 'utf8'));
    const ocekavane = T04.ulohy.filter((u) => u.kroky.some((k) => k.vstup?.typ === 'rysovani')).map((u) => Number(u.obrazek_mm));
    await viewport(900, 1200);
    await jdiNa(`${WEB}/tisk.html?lekce=F2-T04-L1&lokalne=1`);
    await pockej(`document.querySelector('.tisk-uloha') && ${nactene} && !document.getElementById('tiskTlacitko').disabled`, 'tisk F2-T04-L1');
    const obr = await js(`({ nad: document.getElementById('tiskPokyn100')?.textContent, list: document.querySelector('.tisk-pokyn--meritko')?.textContent,
      popisky: [...document.querySelectorAll('.arch-rysovani .arch-meritko small')].map((x) => x.textContent),
      pokyny: document.querySelectorAll('.arch-rysovani__pokyn').length })`);
    over(obr.popisky.length === ocekavane.length && obr.popisky.every((x) => x === 'Kontrola tisku: úsečka má měřit 5 cm') && obr.pokyny === ocekavane.length,
      `tisk: každé rýsovací pole (${ocekavane.length}) má kontrolní úsečku „Kontrola tisku: úsečka má měřit 5 cm" a pokyn o tisku`);
    over(/Tiskněte ve skutečné velikosti \(100 %\), ne „Přizpůsobit stránce“\./.test(obr.nad || '') && obr.nad === obr.list,
      'tisk: pokyn „Tiskněte ve skutečné velikosti (100 %), ne ‚Přizpůsobit stránce‘." nad listem (obrazovka) i na listu');
    await snimek('tisk-f2-t04-l1');
    await snimekPrvku('.arch-rysovani', 'tisk-rysovaci-pole');
    await media('print');
    await cekej(300);
    const mer = await js(`(() => { const mm = 96 / 25.4;
      return { pole: [...document.querySelectorAll('.arch-rysovani')].map((p) => ({
        svg: +(p.querySelector('svg').getBoundingClientRect().width / mm).toFixed(2),
        cara: +(p.querySelector('.arch-meritko__cara').getBoundingClientRect().width / mm).toFixed(2) })),
        ovladani: getComputedStyle(document.getElementById('ovladani')).display }; })()`);
    await media('');
    over(mer.pole.length === ocekavane.length && mer.pole.every((p, i) => Math.abs(p.svg - ocekavane[i]) < 0.05 && Math.abs(p.cara - 50) < 0.05) && mer.ovladani === 'none',
      `media print (96 px = 25,4 mm): rýsovací pole ${mer.pole.map((p) => `${p.svg} mm`).join(', ')} (obrazek_mm ${ocekavane.join(', ')}), úsečky ${mer.pole.map((p) => `${p.cara} mm`).join(', ')}, pokyn nad listem se netiskne`);
    // simulace: úsečka jen v hlavičce archu (rýsovací pole archu bez další)
    await jdiNa(`${WEB}/tisk.html?lekce=F2-VZOR-L1,F2-VZOR-L2&lokalne=1`);
    await pockej(`document.querySelector('.tisk-list--arch') && ${nactene}`, 'tisk simulace');
    const simT = await js(`({ hlavicka: document.querySelectorAll('.arch-hlavicka .arch-meritko').length, pole: document.querySelectorAll('.tisk-list--arch .arch-rysovani .arch-meritko').length, nad: Boolean(document.getElementById('tiskPokyn100')) })`);
    over(simT.hlavicka === 1 && simT.pole === 0 && simT.nad, 'tisk simulace: úsečka 5 cm jen v hlavičce archu, pokyn 100 % nad listem');

    // =================================================================== H) žák F2-T03-L2 U3 na 375 px: zadání pokračuje pod okrajem rámečku
    const T03 = JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', 'F2-T03-L2.json'), 'utf8'));
    await reset('svetly', 'zak');
    await js(`(() => { const d = new Date(); localStorage.setItem('spolu.pripraveno.F2-T03-L2', d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')); return true; })()`);
    await telefon();
    await jdiNa(`${WEB}/lekce.html?lekce=F2-T03-L2&dite=${DITE}&lokalne=1&rezim=app`);
    await pockej(`document.querySelector('.krok')`, 'žák F2-T03-L2');
    r = await odpovidej(T03, {}, 'U3/k1');
    await js('window.scrollTo(0, 0); true');
    await cekej(500);
    const ramecek = () => js(`(() => { const k = document.querySelector('.karta-ulohy'); const p = k.querySelector('.karta-ulohy__pokracuje');
      return { pretece: k.scrollHeight > k.clientHeight + 4, pruh: Boolean(p && !p.hidden), text: p?.textContent, konec: k.scrollHeight - k.clientHeight - k.scrollTop }; })()`);
    const r1 = await ramecek();
    const cele = await js(`(() => { const k = document.querySelector('.karta-ulohy'); const z = k.querySelector('.karta-ulohy__zadani');
      return { pozice: getComputedStyle(k).position, veta: /V testu bys své číslo/.test(z.innerText), nabidka: /E\\)/.test(z.innerText) }; })()`);
    over(r.stav === 'stop' && !r1.pretece && !r1.pruh && cele.pozice === 'static' && cele.veta && cele.nabidka,
      '375 px, U3: karta zadání roste s obsahem (bez vlastního posuvu), nabídka A)–E) i věta „V testu bys…" jsou v kartě, stránka se posouvá');
    await snimek('zak-t03l2-u3-375');
    await motivJs('tmavy');
    await cekej(300);
    await snimek('zak-t03l2-u3-tmavy-375');
    await motivJs('svetly');
    // tablet na výšku (B1: přilepená karta nejvýš 50 % výšky): když zadání pokračuje, pruh „Zadání pokračuje"
    await viewport(800, 1100, true);
    await js(`document.querySelector('.karta-ulohy').scrollTop = 0; window.scrollTo(0, 0); true`);
    await cekej(600);
    const t1 = await ramecek();
    over(t1.pretece && t1.pruh && t1.text === 'Zadání pokračuje', `800 px (tablet): zadání přetéká přilepenou kartu → dole pruh „${t1.text}" se šipkou`);
    await snimekOkna('zak-t03l2-u3-800');
    await motivJs('tmavy');
    await cekej(300);
    await snimekOkna('zak-t03l2-u3-tmavy-800');
    await motivJs('svetly');
    for (let i = 0; i < 10 && (await ramecek()).pruh; i++) {
      await js(`document.querySelector('.karta-ulohy__pokracuje:not([hidden])')?.click(); true`);
      await cekej(700);
    }
    const t2 = await ramecek();
    over(t2.konec <= 12 && !t2.pruh, 'klepnutí na pruh posouvá kartu; na konci zadání pruh zmizí (nabídka A)–E) a věta „V testu bys…" vidět)');
    await snimekOkna('zak-t03l2-u3-konec-800');
    await pc();
    await js(`document.querySelector('.karta-ulohy').scrollTop = 0; true`);
    await cekej(600);
    const r3 = await ramecek();
    over(r3.pruh === (r3.pretece && r3.konec > 12), `1280 px: pruh jen při přetečení (přetéká: ${r3.pretece}, pruh: ${r3.pruh})`);
    await snimekOkna('zak-t03l2-u3-1280');
  } finally {
    console.log(kontroly.map((k) => `  ${k}`).join('\n'));
  }
}
