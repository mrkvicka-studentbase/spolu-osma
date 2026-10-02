#!/usr/bin/env node
// =====================================================================
// kontrola-dlazdic.mjs — automatická kontrola E1 (25. 9.): žádný posuvník ani zalomený vzorec
// v dlaždicích, v zadání a v tisku. Jen pro vývoj, nenasazuje se. Bez přihlášení (?lokalne=1).
//
//   node nastroje/kontrola-dlazdic.mjs            → všechny lekce obsah/lekce/M8-*.json (Spolu 8; Chrome přes CHROME=…)
//   volby: --sirky=1280,1024,800,375  --lekce=P1,P2
//
// Co dělá: Chrome headless + CDP (stejně jako screenshoty.mjs). Na stránce nahled-obsahu.html načte
// obsah.js a pro každý krok s dlaždicemi postaví DOM jako lekce.js (.stranka-zak > .lekce-zak >
// .karta-ulohy + .krok > .dlazdice-mrizka), zavolá rozlozDlazdice() a změří:
//   - uvnitř .dlazdice žádný prvek s overflow-x auto/scroll a žádné přetečení (scrollWidth > clientWidth),
//   - .katex celý uvnitř dlaždice a nezalomený (jeden řádek: getClientRects() .katex-html),
//   - sloupce se v kroku nemíchají (všechny dlaždice stejně široké, nebo 2 sloupce),
//   - zadání: display vzorce (.katex-display) nepřetékají,
//   - tisk.html: žádný vzorec nepřetéká šířku listu,
//   - rodič (375 px): skutečná karta z rodic-karta.js — rozbalené „Co vidí dítě" (zadání + dlaždice
//     kroků) a papírový krok ④ (výsledek dítěte); navíc žádný vodorovný scroll stránky.
// Každá kombinace šířka × motiv (světlý/tmavý). Výstup: tabulka a počet chyb (exit 1 při chybě).
// =====================================================================

import { createServer } from 'node:http';
import { readFile, readdir, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, normalize, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const KOREN = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT_WEB = 8792;
const PORT_CDP = 9334;
const argv = process.argv.slice(2);
const arg = (k) => argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const SIRKY = (arg('sirky') || '1280,1024,800,375').split(',').map(Number);
const MOTIVY = ['svetly', 'tmavy'];
const LEKCE = arg('lekce')?.split(',')
  || (await readdir(join(KOREN, 'obsah', 'lekce'))).filter((f) => /^M8-T\d{2}-L\d\.json$/.test(f)).map((f) => f.replace('.json', '')).sort();
const cekej = (ms) => new Promise((r) => setTimeout(r, ms));

// --- statický server z kořene repa -------------------------------------------------------------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const server = createServer(async (req, res) => {
  try {
    const cesta = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
    if (cesta.startsWith('..')) throw new Error('mimo');
    const data = await readFile(join(KOREN, cesta));
    res.writeHead(200, { 'Content-Type': MIME[extname(cesta)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise((r) => server.listen(PORT_WEB, '127.0.0.1', r));
const WEB = `http://127.0.0.1:${PORT_WEB}/web`;

// --- Chrome + CDP ------------------------------------------------------------------------------
const profil = join(tmpdir(), `spolu-kontrola-${Date.now()}`);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT_CDP}`, `--user-data-dir=${profil}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let wsUrl = null;
for (let i = 0; i < 50 && !wsUrl; i++) {
  await cekej(200);
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT_CDP}/json/version`)).json()).webSocketDebuggerUrl; } catch { /* ještě ne */ }
}
if (!wsUrl) throw new Error('Chrome se nespustil.');
const ws = new WebSocket(wsUrl);
await new Promise((r, e) => { ws.onopen = r; ws.onerror = e; });
let id = 1;
const cekajici = new Map();
const udalosti = new Set();
ws.onmessage = (m) => {
  const z = JSON.parse(m.data);
  if (z.id && cekajici.has(z.id)) { const { a, b } = cekajici.get(z.id); cekajici.delete(z.id); z.error ? b(new Error(z.error.message)) : a(z.result); } else if (z.method) for (const f of udalosti) f(z);
};
const cdp = (method, params = {}, sessionId) => { const i = id++; ws.send(JSON.stringify({ id: i, method, params, sessionId })); return new Promise((a, b) => cekajici.set(i, { a, b })); };
const { targetId } = await cdp('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true });
const s = (m, p) => cdp(m, p, sessionId);
await s('Page.enable'); await s('Runtime.enable');
udalosti.add((z) => { if (z.sessionId === sessionId && z.method === 'Runtime.exceptionThrown') console.warn('  [stránka]', z.params.exceptionDetails?.exception?.description?.split('\n')[0]); });
async function js(v) {
  const r = await s('Runtime.evaluate', { expression: v, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
async function jdi(url) {
  const nacteno = new Promise((ok) => { const f = (z) => { if (z.sessionId === sessionId && z.method === 'Page.loadEventFired') { udalosti.delete(f); ok(); } }; udalosti.add(f); });
  await s('Page.navigate', { url }); await nacteno;
}
const viewport = (w, h = 900) => s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });

// --- měření v kontextu stránky -----------------------------------------------------------------
const MERENI = `
window.__zmer = (koren) => {
  const chyby = [];
  const popis = (e) => e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : e.tagName;
  for (const d of koren.querySelectorAll('.dlazdice')) {
    const rd = d.getBoundingClientRect();
    for (const e of [d, ...d.querySelectorAll('*')]) {
      const cs = getComputedStyle(e);
      if (/auto|scroll/.test(cs.overflowX)) chyby.push('overflow-x ' + cs.overflowX + ' na ' + popis(e));
    }
    if (d.scrollWidth > d.clientWidth + 1) chyby.push('dlaždice přetéká ' + d.scrollWidth + '>' + d.clientWidth);
    for (const k of d.querySelectorAll('.katex')) {
      const r = k.getBoundingClientRect();
      const csd = getComputedStyle(d); const vl = rd.left + parseFloat(csd.borderLeftWidth) + parseFloat(csd.paddingLeft) - 2; const vp = rd.right - parseFloat(csd.borderRightWidth) - parseFloat(csd.paddingRight) + 2;
      if (r.left < vl || r.right > vp) chyby.push('vzorec mimo obsah dlaždice ' + Math.round(r.width) + 'px v ' + Math.round(rd.width) + 'px');
      const radky = new Set([...k.querySelector('.katex-html').getClientRects()].map((x) => Math.round(x.top)));
      if (radky.size > 1) chyby.push('vzorec zalomený (' + radky.size + ' řádky)');
    }
  }
  for (const m of koren.querySelectorAll('.dlazdice-mrizka')) {
    const sirky = new Set([...m.children].map((c) => Math.round(c.getBoundingClientRect().width)));
    if (sirky.size > 1) chyby.push('sloupce se míchají: ' + [...sirky].join('/'));
  }
  for (const v of koren.querySelectorAll('.katex-display, .tisk-volby > li, .tisk-uloha__zadani p')) {
    const rod = v.parentElement; const csr = getComputedStyle(rod); const misto = rod.clientWidth - parseFloat(csr.paddingLeft) - parseFloat(csr.paddingRight);
    if (misto > 0 && v.scrollWidth > misto + 2) chyby.push('přetéká ' + popis(v) + ' ' + v.scrollWidth + '>' + Math.round(misto));
    if (/auto|scroll/.test(getComputedStyle(v).overflowX)) chyby.push('overflow-x na ' + popis(v));
  }
  return chyby;
};`;

const vysledky = [];
let chybCelkem = 0;
try {
  for (const motiv of MOTIVY) {
    for (const sirka of SIRKY) {
      await viewport(sirka);
      // --- lekce (DOM jako lekce.js) ---
      await jdi(`${WEB}/nahled-obsahu.html?lekce=P1&lokalne=1`);
      await js(`localStorage.setItem('spolu.motiv', '${motiv}'); window.spoluMotiv?.pouzij(); true`);
      await js(MERENI + 'true');
      const r = await js(`(async () => {
        const o = await import('./js/obsah.js');
        const { el } = await import('./js/ui.js');
        await o.nacistKnihovny();
        const lekce = ${JSON.stringify(LEKCE)};
        const vystup = [];
        for (const id of lekce) {
          const l = await o.nactiLekciObsah(id, { lokalne: true });
          for (const u of l.ulohy) {
            for (const k of u.kroky.filter((k) => k.vstup?.typ === 'dlazdice')) {
              const moz = k.vstup.moznosti;
              const sloupec = u.typ === 'detektiv' || moz.some((m) => m.stitek);
              const mrizka = el('div', { class: ['dlazdice-mrizka', sloupec && 'dlazdice-mrizka--sloupec'] }, moz.map((m) =>
                el('button', { class: ['dlazdice', sloupec && 'dlazdice--radek'], type: 'button' },
                  el('span', { class: 'dlazdice__text' }, m.stitek ? el('span', { class: 'dlazdice__stitek', text: m.stitek }) : null,
                    el('span', { class: 'dlazdice__vyraz' }, o.renderMarkdown(m.text, { inline: true }))))));
              const zadani = el('div', { class: 'karta-ulohy__zadani zadani' }, o.renderMarkdown(u.zadani));
              const strana = el('main', { class: 'stranka-zak' }, el('div', { class: 'lekce-zak' },
                el('article', { class: 'karta-ulohy' }, zadani),
                el('div', { class: 'zasobnik' }, el('section', { class: 'krok' }, el('h3', { class: 'krok__popisek', text: k.id }), mrizka))));
              document.body.replaceChildren(strana); // jako lekce.html: .stranka-zak přímo v <body>
              o.rozlozDlazdice(mrizka, { zalomit: true }); // jako lekce.js
              o.rozlozZadani(zadani); // jako lekce.js
              await document.fonts.ready;
              await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
              const chyby = window.__zmer(strana);
              vystup.push({ kde: u.id + ' ' + k.id, sloupce: mrizka.classList.contains('dlazdice-mrizka--jeden-sloupec') || sloupec ? 1 : 2,
                meritko: mrizka.style.getPropertyValue('--meritko-vzorce') || '1', chyby });
            }
          }
        }
        return vystup;
      })()`);
      for (const x of r) { vysledky.push({ motiv, sirka, ...x }); chybCelkem += x.chyby.length; }
      // --- rodič (375 px): „Co vidí dítě" (zadání + dlaždice kroků) a papírový krok ④ — skutečná
      //     karta z rodic-karta.js (vytvorKartuUlohy + vytvorPapir), DOM jako rodic.html ---
      if (sirka === 375) {
        const rr = await js(`(async () => {
          const o = await import('./js/obsah.js');
          const { el } = await import('./js/ui.js');
          const karta = await import('./js/rodic-karta.js');
          await o.nacistKnihovny();
          const vystup = [];
          for (const id of ${JSON.stringify(LEKCE)}) {
            const l = await o.nactiLekciObsah(id, { lokalne: true });
            for (const [i, u] of l.ulohy.entries()) {
              const s = { lekce: l, sezeni: { id: 'kontrola' }, ulohaIndex: i, odpovedi: [], barvy: {}, volby: {},
                poznamkySemafor: {}, pokusRodice: {}, otevrenoOtazek: new Map(), jenCteni: false };
              karta.uklidRozlozeni();
              const obsah = karta.vytvorKartuUlohy(s, u, { semafor: el('section', null, el('button', { class: 'semafor-volba', dataset: { volba: 's_otazkou' } }, 'x')),
                papir: karta.vytvorPapir(s, u, async () => {}) });
              const strana = el('div', { class: 'stranka-rodic' }, el('main', { class: 'stranka-rodic__obsah' }, obsah));
              document.body.replaceChildren(strana);
              // rozbalit „Co vidí dítě" a krok ④ (papír), jako když je rodič otevře
              for (const d of strana.querySelectorAll('.postup-rodice__detail, .rozbalovaci')) d.open = true;
              await document.fonts.ready;
              await new Promise((ok) => setTimeout(ok, 150));
              await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
              const mrizky = strana.querySelectorAll('.dlazdice-mrizka');
              const chyby = window.__zmer(strana);
              if (document.documentElement.scrollWidth > innerWidth + 1) chyby.push('vodorovný scroll stránky ' + document.documentElement.scrollWidth);
              vystup.push({ kde: u.id + ' rodič', sloupce: mrizky.length ? [...mrizky].map((m) => m.classList.contains('dlazdice-mrizka--jeden-sloupec') || m.classList.contains('dlazdice-mrizka--sloupec') ? 1 : 2).join('') : '-',
                meritko: [...mrizky].map((m) => m.style.getPropertyValue('--meritko-vzorce') || '1').join(',') || '-', chyby });
            }
          }
          karta.uklidRozlozeni();
          return vystup;
        })()`);
        for (const x of rr) { vysledky.push({ motiv, sirka: 'rodic', ...x }); chybCelkem += x.chyby.length; }
      }
      // --- tisk (list A4 má pevnou šířku, kontrola jen jednou za motiv) ---
      if (sirka === SIRKY[0]) {
        for (const idL of LEKCE) {
          await viewport(900);
          await jdi(`${WEB}/tisk.html?lekce=${idL}&lokalne=1`);
          for (let i = 0; i < 40 && !(await js('Boolean(document.querySelector(".tisk-uloha"))')); i++) await cekej(250);
          await js('document.fonts.ready.then(() => new Promise((ok) => setTimeout(ok, 400)))');
          const chyby = await js(MERENI + 'window.__zmer(document.querySelector(".tisk-list"))');
          vysledky.push({ motiv, sirka: 'tisk', kde: idL, sloupce: '-', meritko: '-', chyby });
          chybCelkem += chyby.length;
        }
        await viewport(sirka);
      }
    }
  }
} catch (e) {
  console.error('CHYBA:', e.message); chybCelkem += 1;
} finally {
  try { ws.close(); } catch { /* nic */ }
  chrome.kill(); server.close(); await cekej(400);
  await rm(profil, { recursive: true, force: true }).catch(() => {});
}

// --- výstup ---
const radky = vysledky.map((v) => `${v.motiv.padEnd(6)} ${String(v.sirka).padEnd(5)} ${v.kde.padEnd(12)} sloupce ${String(v.sloupce).padEnd(2)} měřítko ${String(v.meritko).padEnd(6)} ${v.chyby.length ? '✗ ' + v.chyby.join('; ') : '✔'}`);
console.log(radky.join('\n'));
const kroky = new Set(vysledky.filter((v) => v.sirka !== 'tisk' && v.sirka !== 'rodic').map((v) => v.kde)).size;
const rodicUloh = new Set(vysledky.filter((v) => v.sirka === 'rodic').map((v) => v.kde)).size;
console.log(`\nKroků s dlaždicemi: ${kroky} · kombinací (šířka × motiv): ${SIRKY.length * MOTIVY.length} · tisk: ${LEKCE.length} lekcí × 2 motivy`
  + ` · rodič 375 px: ${rodicUloh} úloh × 2 motivy · chyb: ${chybCelkem}`);
process.exitCode = chybCelkem ? 1 : 0;
