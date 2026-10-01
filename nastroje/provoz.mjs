#!/usr/bin/env node
// =====================================================================
// provoz.mjs — souhrn provozu pilotu pro reporty/PROVOZ.md (ODPOVED testovací rodič T3, 29. 9.).
// Jen ČTE databázi (REST, service key z .env), nic nezapisuje. Bez osobních údajů: nečte jména, e-maily,
// telefony, poznámky ani odpovědi dotazníku — jen id, stavy, časy, lekce, semafor a kódy chyb.
// Testovací účty (testy/testovaci-ucty.local.json) a admini se do počtů nezapočítávají.
//
// Spuštění z kořene repa:  node --env-file=.env nastroje/provoz.mjs [--od=2026-10-01]
// Výstup: Markdown na stdout (vedoucí ho vloží do reporty/PROVOZ.md).
// =====================================================================

import { readFile } from 'node:fs/promises';

const URL_DB = process.env.SUPABASE_URL;
const KLIC = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!URL_DB || !KLIC) { console.error('Chybí SUPABASE_URL nebo service key v .env.'); process.exit(1); }
const OD = process.argv.find((a) => a.startsWith('--od='))?.split('=')[1] || '2026-10-01';
const HLAVICKY = { apikey: KLIC, Authorization: `Bearer ${KLIC}` };

/** Všechny řádky tabulky (stránkování po 1000). */
async function vse(tabulka, sloupce) {
  const radky = [];
  for (let od = 0; ; od += 1000) {
    const r = await fetch(`${URL_DB}/rest/v1/${tabulka}?select=${sloupce}`, { headers: { ...HLAVICKY, Range: `${od}-${od + 999}` } });
    if (!r.ok) throw new Error(`${tabulka}: ${r.status} ${await r.text()}`);
    const davka = await r.json();
    radky.push(...davka);
    if (davka.length < 1000) return radky;
  }
}

const pocitej = (pole, klic) => pole.reduce((m, x) => { const k = klic(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const median = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const i = Math.floor(s.length / 2); return s.length % 2 ? s[i] : (s[i - 1] + s[i]) / 2; };
const datum = (iso) => iso.slice(0, 10);

const testovaci = new Set();
try {
  const u = JSON.parse(await readFile('testy/testovaci-ucty.local.json', 'utf8'));
  for (const x of Array.isArray(u) ? u : Object.values(u)) if (x?.id) testovaci.add(x.id);
} catch { /* bez souboru se nic nevyřazuje */ }
for (const a of await vse('admini', 'uid')) testovaci.add(a.uid);

const rodinyVse = await vse('rodiny', 'id,stav,dotaznik_vyplnen,created_at');
const rodiny = rodinyVse.filter((r) => !testovaci.has(r.id));
const idRodin = new Set(rodiny.map((r) => r.id));
const deti = (await vse('deti', 'id,rodina_id,typ_skoly,poradi,created_at')).filter((d) => idRodin.has(d.rodina_id));
const idDeti = new Set(deti.map((d) => d.id));
const sezeni = (await vse('sezeni', 'id,dite_id,lekce_id,rezim,zacatek,konec,stav')).filter((s) => idDeti.has(s.dite_id));
const idSezeni = new Set(sezeni.map((s) => s.id));
const semafory = (await vse('semafory', 'sezeni_id,uloha_id,volba_rodice,barva')).filter((s) => idSezeni.has(s.sezeni_id));
const odpovedi = (await vse('odpovedi', 'sezeni_id,uloha_id,krok_id,spravne,typ_chyby,pokus,zadal')).filter((o) => idSezeni.has(o.sezeni_id));

const ted = Date.now();
const out = [];
const p = (s = '') => out.push(s);
p(`## Provoz ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`);
p();
p(`Bez testovacích účtů a adminů (${testovaci.size} vyřazeno). Rodiny registrované před ${OD} jsou uvedené zvlášť (testy před spuštěním).`);
p();
const predSpustenim = rodiny.filter((r) => datum(r.created_at) < OD);
const pilot = rodiny.filter((r) => datum(r.created_at) >= OD);
p(`- **Rodiny:** ${rodiny.length} (od ${OD}: ${pilot.length}, před spuštěním: ${predSpustenim.length}); stav: ${Object.entries(pocitej(rodiny, (r) => r.stav)).map(([k, v]) => `${k} ${v}`).join(', ') || '—'}; dotazník vyplněn: ${rodiny.filter((r) => r.dotaznik_vyplnen).length}`);
const poDnech = pocitej(pilot, (r) => datum(r.created_at));
p(`- **Registrace po dnech (od ${OD}):** ${Object.entries(poDnech).sort().map(([d, n]) => `${d.slice(8, 10)}. ${d.slice(5, 7)}. ${n}`).join(' · ') || '—'}`);
p(`- **Děti:** ${deti.length} (gymnázium ${deti.filter((d) => d.typ_skoly === 'gymnazium').length}, SŠ s maturitou ${deti.filter((d) => d.typ_skoly === 'ss_maturita').length}; rodin se 2 dětmi ${deti.filter((d) => d.poradi === 2).length}); rodin bez dítěte: ${rodiny.filter((r) => !deti.some((d) => d.rodina_id === r.id)).length}`);
p();

// Lekce
const lekce = [...new Set(sezeni.map((s) => s.lekce_id))].sort();
p('| lekce | sezení | dokončeno | probíhá | přerušeno | v aplikaci / na papír | medián délky (min) | 🟢 / 🟠 / 🔴 |');
p('|---|---|---|---|---|---|---|---|');
for (const l of lekce) {
  const s = sezeni.filter((x) => x.lekce_id === l);
  const dok = s.filter((x) => x.stav === 'dokonceno');
  const delky = dok.filter((x) => x.konec).map((x) => (Date.parse(x.konec) - Date.parse(x.zacatek)) / 60000);
  const sem = semafory.filter((x) => s.some((y) => y.id === x.sezeni_id));
  const b = pocitej(sem, (x) => x.barva);
  const m = median(delky);
  p(`| ${l} | ${s.length} | ${dok.length} | ${s.filter((x) => x.stav === 'probiha').length} | ${s.filter((x) => x.stav === 'preruseno').length} | ${s.filter((x) => x.rezim === 'app').length} / ${s.filter((x) => x.rezim === 'papir').length} | ${m === null ? '—' : m.toFixed(0)} | ${b.zelena || 0} / ${b.oranzova || 0} / ${b.cervena || 0} |`);
}
if (!lekce.length) p('| — | 0 | | | | | | |');
p();

// Dokončené lekce na dítě
const dokNaDite = deti.map((d) => new Set(sezeni.filter((s) => s.dite_id === d.id && s.stav === 'dokonceno').map((s) => s.lekce_id)).size);
p(`- **Dokončené lekce na dítě:** ${Object.entries(pocitej(dokNaDite, (n) => n)).sort().map(([n, c]) => `${n} lekcí: ${c}`).join(' · ') || '—'}`);
p(`- **Semafor, volba rodiče:** ${Object.entries(pocitej(semafory, (x) => x.volba_rodice)).map(([k, v]) => `${k} ${v}`).join(', ') || '—'}`);
const finaly = odpovedi.filter((o) => o.krok_id === 'final' && o.zadal === 'dite');
p(`- **Odpovědi dítěte:** ${odpovedi.filter((o) => o.zadal === 'dite').length} (výsledek úlohy správně napoprvé: ${finaly.filter((o) => o.pokus === 1 && o.spravne).length} z ${finaly.filter((o) => o.pokus === 1).length})`);
const chyby = Object.entries(pocitej(odpovedi.filter((o) => o.typ_chyby), (o) => o.typ_chyby)).sort((a, b) => b[1] - a[1]).slice(0, 10);
p(`- **Nejčastější typy chyb:** ${chyby.map(([k, v]) => `\`${k}\` ${v}`).join(', ') || '—'}`);
p();
// Anomálie (nepřímé ukazatele chyb — log chyb prohlížeče aplikace nemá)
const visi = sezeni.filter((s) => s.stav === 'probiha' && ted - Date.parse(s.zacatek) > 24 * 3600e3);
const bezOdpovedi = sezeni.filter((s) => !odpovedi.some((o) => o.sezeni_id === s.id));
const dokBezSem = sezeni.filter((s) => s.stav === 'dokonceno' && !semafory.some((x) => x.sezeni_id === s.id));
p('**Anomálie** (nepřímé ukazatele; chyby z prohlížeče se nikam neukládají):');
p(`- sezení „probíhá“ starší než 24 h: ${visi.length}`);
p(`- sezení bez jediné odpovědi: ${bezOdpovedi.length} (z toho přerušených ${bezOdpovedi.filter((s) => s.stav === 'preruseno').length})`);
p(`- dokončená sezení bez semaforu: ${dokBezSem.length}`);
console.log(out.join('\n'));
