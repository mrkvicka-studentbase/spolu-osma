#!/usr/bin/env node
// =====================================================================
// qa-sezona.mjs — automatický QA průchod CELÉ SEZÓNY v lokálním režimu. Jen pro vývoj, nenasazuje se.
//
//   node nastroje/qa-sezona.mjs                        → všechny lekce obsah/lekce/*.json
//   node nastroje/qa-sezona.mjs --lekce=P1,F2-T08-L3   → jen vybrané (simulace vždy obě části); výsledek
//                                                        se sloučí s předchozím během (reporty/QA-SEZONA.json)
//   volby: --paralelne=4 (počet souběžných prohlížečových kontextů)  --bez-dlazdic (nespouštět kontrola-dlazdic.mjs)
//          --datum=2026-09-27 (předpona snímků)
//
// Bez sítě proti Supabase: supabase-js se na statickém serveru nahradí nastroje/fake-supabase.js (DB
// v localStorage prohlížeče), obsah lekcí ze souborů (?lokalne=1), požadavky na *supabase.co* jsou navíc
// zablokované (Network.setBlockedURLs). Chrome headless přes CDP (jako screenshoty.mjs), každý souběžný
// pracovník má vlastní browser context (oddělený localStorage = oddělená fake DB).
//
// Co projde u každé lekce (jednotka = lekce, u simulace obě části):
//   Žák 375 a Žák 1280: „Připrav si" → každý krok SPRÁVNĚ podle JSON (dlaždice = správná možnost,
//     cislo/zlomek/smisene/vyraz = spravne, poradi = první povolené pořadí, text libovolně, rysovani = Hotovo)
//     → konec lekce. Diagnostika a simulace: 1 pokus, jen „Uloženo." (bez ✔/✘).
//   Rodič 375 (na sezení žáka 1280): běžná lekce = každá úloha, brána ①–④ (R28: „Další" zamčené, dokud
//     není ①–③ a semafor), rozbalený tahák (vše <details>, otázky L1–L3), semafor, souhrn, Ukončit lekci;
//     blok = „během bloku" (žák má odevzdané 2 úlohy) a „po bloku" (pruh + brána); simulace = „Dítě
//     odevzdalo" → Kontrola (vše Ano / Sedí) → souhrn; diagnostika = průběh → výsledek.
//   Tisk: tisk.html?lekce=… (simulace obě části najednou), obrazovka 900 px a media print.
//   Tmavý motiv (P1, F1-T01-L1, F2-T01-L1, blok F2-T05-L3, simulace 1, diagnostika): žák 375 + rodič 375
//     v tmavém motivu; u těchto lekcí se navíc měří kontrast textu (i ve světlém).
// Na každé obrazovce: výjimky JS, console.error, chyby načtení (Log), .katex-error, vodorovný scroll,
//   „undefined" / „null" / „[object Object]" / „NaN" / {placeholder} / nevykreslený LaTeX nebo Markdown,
//   prázdné zadání / krok bez vstupu / prázdný tahák, rozbité obrázky, popisek SVG mimo obrázek, dlaždice
//   (měření z kontrola-dlazdic.mjs: posuvník, přetečení, zalomený vzorec, míchané sloupce).
// Navíc (bez --bez-dlazdic) spustí nastroje/kontrola-dlazdic.mjs nad všemi vybranými lekcemi (4 šířky × 2 motivy).
//
// Výstup: reporty/QA-SEZONA.md (tabulka lekce × sloupce, nálezy, souhrn), reporty/QA-SEZONA.json (data pro
//   slučování běhů), snímky jen nálezů reporty/obrazky/<datum>-qa-<lekce>-….png.
// Nic nemění v obsah/ ani ve web/.
// =====================================================================

import { createServer } from 'node:http';
import { readFile, writeFile, readdir, rm, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, normalize, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { lzeSamo } from '../web/js/samo.js';

const KOREN = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT_WEB = Number(process.env.QA_PORT || 8794);
const PORT_CDP = Number(process.env.QA_PORT_CDP || 9336);
const argv = process.argv.slice(2);
const arg = (k) => argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const DATUM = arg('datum') || '2026-09-27';
const PARALELNE = Math.max(1, Number(arg('paralelne') || 4));
const BEZ_DLAZDIC = argv.includes('--bez-dlazdic');
// --samo (R64): žák projde běžné lekce v režimu „Dnes samo" (bez rodiče) — lekce se musí sama ukončit se semafory
const SAMO = argv.includes('--samo');
// --sebetest: ověří, že detektory hlásí (P1, žák 375: podvržený text/kontrast/šířka v úloze 1 a špatná odpověď v 1. kroku); report se nezapisuje
const SEBETEST = argv.includes('--sebetest');
const VYBER = arg('lekce') ? arg('lekce').split(',').map((x) => x.trim()).filter(Boolean) : null;
const DIR_OBR = argv.includes('--sebetest') ? join(tmpdir(), 'spolu-qa-sebetest') : join(KOREN, 'reporty', 'obrazky');
const SOUBOR_JSON = join(KOREN, 'reporty', 'QA-SEZONA.json');
const SOUBOR_MD = join(KOREN, 'reporty', 'QA-SEZONA.md');
const DITE = '00000000-0000-4000-8000-0000000000d1'; // výchozí dítě fake-supabase.js
const MOTIVOVE = ['P1', 'F1-T01-L1', 'F2-T01-L1', 'F2-T05-L3', 'F2-T08-L3', 'F1-T00-DIAG'];
const MAX_SNIMKU_SLOUPEC = 6;
const cekej = (ms) => new Promise((r) => setTimeout(r, ms));
const SLOUPCE = [
  ['zak375', 'Žák 375'], ['zak1280', 'Žák 1280'], ['rodic', 'Rodič 375'], ['tisk', 'Tisk'], ['tmavy', 'Tmavý motiv'],
];
const NAZEV_SLOUPCE = Object.fromEntries(SLOUPCE);
const ZAVAZNOSTI = ['blokujici', 'vazna', 'kosmeticka'];
const NAZEV_ZAV = { blokujici: 'blokující', vazna: 'vážná', kosmeticka: 'kosmetická' };

// =====================================================================
// Obsah: lekce, jednotky, katalog
// =====================================================================
const souboryLekci = (await readdir(join(KOREN, 'obsah', 'lekce'))).filter((f) => f.endsWith('.json')).sort();
const LEKCE = new Map();
for (const f of souboryLekci) {
  const l = JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', f), 'utf8'));
  LEKCE.set(l.id, l);
}
/** ulohaId → {lekce, uloha, index} (driver žáka pozná úlohu z id popisku kroku). */
const ULOHY = new Map();
for (const l of LEKCE.values()) l.ulohy.forEach((u, index) => ULOHY.set(u.id, { lekce: l, uloha: u, index }));

const typLekce = (l) => (l.typ === 'diagnostika' ? 'diagnostika' : l.typ === 'simulace' ? 'simulace' : l.typ === 'blok' ? 'blok'
  : l.faze === 'pilot' ? 'pilot' : l.faze === 'faze1' ? 'bezna-f1' : 'bezna-f2');
const NAZEV_TYPU = { pilot: 'pilot', 'bezna-f1': 'běžná F1', 'bezna-f2': 'běžná F2', blok: 'blok', simulace: 'simulace', diagnostika: 'diagnostika' };
const PORADI_ID = (id) => { // P1..P4, F1-T00-DIAG, F1-T01.., F2-..
  const p = /^P(\d+)$/.exec(id);
  return p ? `0-${p[1]}` : id.startsWith('F1') ? `1-${id}` : `2-${id}`;
};

function sestavJednotky() {
  const jednotky = [];
  const hotove = new Set();
  for (const id of [...LEKCE.keys()].sort((a, b) => PORADI_ID(a).localeCompare(PORADI_ID(b)))) {
    if (hotove.has(id)) continue;
    const l = LEKCE.get(id);
    let ids = [id];
    if (l.typ === 'simulace') {
      const druha = l.simulace?.cast === 1 ? l.simulace.druha_cast : l.simulace?.prvni_cast;
      ids = l.simulace?.cast === 1 ? [id, druha] : [druha, id];
      ids = ids.filter((x) => LEKCE.has(x));
    }
    ids.forEach((x) => hotove.add(x));
    jednotky.push({ id: ids.join('+'), ids, typ: typLekce(l), motivova: ids.some((x) => MOTIVOVE.includes(x)) });
  }
  return jednotky;
}
let JEDNOTKY = sestavJednotky();
if (SEBETEST) JEDNOTKY = JEDNOTKY.filter((j) => j.id === 'P1');
if (VYBER) {
  const nezname = VYBER.filter((x) => !LEKCE.has(x));
  if (nezname.length) console.warn(`Neznámé lekce (na disku nejsou, vynechány): ${nezname.join(', ')}`);
  JEDNOTKY = JEDNOTKY.filter((j) => j.ids.some((x) => VYBER.includes(x)));
}
if (!JEDNOTKY.length) { console.error('Žádná lekce k průchodu.'); process.exit(1); }

const KATALOG = [...LEKCE.values()].map((l) => ({
  id: l.id, faze: l.faze, tyden: l.tyden, poradi: l.poradi, tema: l.tema, kapitola: l.kapitola, varianta: l.varianta,
  cas_min: l.cas_min, otevrit_od: '2026-09-01T00:00:00+02:00', verejna: true, verze: 1, zamceno: null,
}));

// =====================================================================
// Statický server (supabase-js → fake-supabase.js)
// =====================================================================
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
  try {
    const cesta = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
    if (cesta === 'qa-prazdna.html') { // prázdná stránka na stejném originu (reset localStorage před průchodem)
      res.writeHead(200, { 'Content-Type': MIME['.html'] }); res.end('<!doctype html><meta charset="utf-8"><title>qa</title>'); return;
    }
    if (cesta === 'favicon.ico') { res.writeHead(204); res.end(); return; }
    if (cesta.startsWith('..')) throw new Error('mimo koren');
    let data = await readFile(join(KOREN, cesta));
    if (/^web[\\/]js[\\/]supabase\.js$/.test(cesta)) {
      data = Buffer.from(String(data).replace(/import \{ createClient \} from '[^']+';/, "import { createClient } from '/nastroje/fake-supabase.js';"));
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(cesta)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('404');
  }
});
await new Promise((r) => server.listen(PORT_WEB, '127.0.0.1', r));
const ORIGIN = `http://127.0.0.1:${PORT_WEB}`;
const WEB = `${ORIGIN}/web`;

// =====================================================================
// Chrome + CDP
// =====================================================================
const profil = join(tmpdir(), `spolu-qa-${Date.now()}`);
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT_CDP}`, `--user-data-dir=${profil}`, '--no-first-run',
  '--no-default-browser-check', '--hide-scrollbars', '--force-color-profile=srgb', '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank',
], { stdio: 'ignore' });
let dlazdiceProces = null;
const uklid = async () => {
  try { ws?.close(); } catch { /* nic */ }
  try { chrome.kill(); } catch { /* nic */ }
  try { dlazdiceProces?.kill(); } catch { /* nic */ }
  server.close();
  await cekej(500);
  await rm(profil, { recursive: true, force: true }).catch(() => {});
};
process.on('SIGINT', async () => { await uklid(); process.exit(130); });

let wsUrl = null;
for (let i = 0; i < 60 && !wsUrl; i++) {
  await cekej(200);
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT_CDP}/json/version`)).json()).webSocketDebuggerUrl; } catch { /* ještě ne */ }
}
if (!wsUrl) { await uklid(); throw new Error('Chrome se nespustil (CDP neodpovídá).'); }
const ws = new WebSocket(wsUrl);
await new Promise((r, e) => { ws.onopen = r; ws.onerror = e; });
let dalsiId = 1;
const cekajici = new Map();
const pracovniciPodleSession = new Map();
ws.onmessage = (m) => {
  const z = JSON.parse(m.data);
  if (z.id && cekajici.has(z.id)) {
    const { ok, chyba } = cekajici.get(z.id);
    cekajici.delete(z.id);
    if (z.error) chyba(new Error(`${z.error.message} ${z.error.data || ''}`)); else ok(z.result);
  } else if (z.method && z.sessionId) {
    pracovniciPodleSession.get(z.sessionId)?.udalost(z);
  }
};
function cdp(method, params = {}, sessionId) {
  const id = dalsiId++;
  ws.send(JSON.stringify({ id, method, params, sessionId }));
  return new Promise((ok, chyba) => cekajici.set(id, { ok, chyba }));
}

// =====================================================================
// Skript v kontextu stránky (window.__qa) — vkládá se do každého dokumentu
// (funkce se v Node nespouští, jen se převede na text)
// =====================================================================
function qaStranka() {
  const spi = (ms) => new Promise((r) => setTimeout(r, ms));
  const kratce = (s, n = 90) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? `${s.slice(0, n)}…` : s; };
  const popis = (e) => {
    if (!e || !e.tagName) return '?';
    const c = typeof e.className === 'string' ? e.className : e.className?.baseVal || '';
    const t = c.trim() ? `.${c.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
    return `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ''}${t}`;
  };
  const viditelny = (e) => Boolean(e) && (e.checkVisibility ? e.checkVisibility({ visibilityProperty: true }) : e.offsetParent !== null);
  /** Kde na obrazovce prvek je (pro čitelný nález): zadání, dlaždice, rozbalovací blok „…", položka Kontroly… */
  const kontext = (e) => {
    if (e.closest('.karta-ulohy__zadani')) return 'zadání úlohy (žák)';
    if (e.closest('.dlazdice')) return 'dlaždice';
    if (e.closest('.krok')) return 'krok žáka';
    if (e.closest('.sim-polozka')) return 'položka Kontroly';
    const det = e.closest('details');
    const sum = det?.querySelector(':scope > summary');
    if (sum) return `„${kratce((sum.querySelector('.postup-rodice__nadpis') || sum).textContent, 45)}"`;
    const sek = e.closest('section, .tahak__sekce, .souhrn');
    const h = sek?.querySelector('h1, h2, h3')?.textContent;
    return h ? `„${kratce(h, 45)}"` : popis(e.parentElement);
  };
  const fixni = (e) => { for (let x = e; x; x = x.parentElement) if (getComputedStyle(x).position === 'fixed') return true; return false; };

  /** Měření dlaždic a vzorců (převzato z kontrola-dlazdic.mjs). */
  function zmer(koren) {
    const chyby = [];
    for (const d of koren.querySelectorAll('.dlazdice')) {
      if (!viditelny(d)) continue;
      const rd = d.getBoundingClientRect();
      for (const e of [d, ...d.querySelectorAll('*')]) {
        const cs = getComputedStyle(e);
        if (/auto|scroll/.test(cs.overflowX)) chyby.push(`dlaždice: overflow-x ${cs.overflowX} na ${popis(e)}`);
      }
      if (d.scrollWidth > d.clientWidth + 1) chyby.push(`dlaždice přetéká ${d.scrollWidth} > ${d.clientWidth} px („${kratce(d.textContent, 40)}")`);
      for (const k of d.querySelectorAll('.katex')) {
        const r = k.getBoundingClientRect();
        const csd = getComputedStyle(d);
        const vl = rd.left + parseFloat(csd.borderLeftWidth) + parseFloat(csd.paddingLeft) - 2;
        const vp = rd.right - parseFloat(csd.borderRightWidth) - parseFloat(csd.paddingRight) + 2;
        if (r.left < vl || r.right > vp) chyby.push(`dlaždice: vzorec mimo obsah dlaždice ${Math.round(r.width)} px v ${Math.round(rd.width)} px („${kratce(d.textContent, 40)}")`);
        const html = k.querySelector('.katex-html');
        const radky = new Set([...(html ? html.getClientRects() : [])].map((x) => Math.round(x.top)));
        if (radky.size > 1) chyby.push(`dlaždice: vzorec zalomený (${radky.size} řádky, „${kratce(d.textContent, 40)}")`);
      }
    }
    for (const m of koren.querySelectorAll('.dlazdice-mrizka')) {
      if (!viditelny(m)) continue;
      const sirky = new Set([...m.children].map((c) => Math.round(c.getBoundingClientRect().width)));
      if (sirky.size > 1) chyby.push(`dlaždice: sloupce se míchají (${[...sirky].join('/')} px)`);
    }
    for (const v of koren.querySelectorAll('.katex-display, .tisk-volby > li, .tisk-uloha__zadani p')) {
      if (!viditelny(v)) continue;
      const rod = v.parentElement;
      const csr = getComputedStyle(rod);
      const misto = rod.clientWidth - parseFloat(csr.paddingLeft) - parseFloat(csr.paddingRight);
      if (misto > 0 && v.scrollWidth > misto + 2) chyby.push({ y: Math.round(v.getBoundingClientRect().top + scrollY), text: `přetéká ${v.classList.contains('katex-display') ? 'vzorec na samostatném řádku' : popis(v)} ${v.scrollWidth} > ${Math.round(misto)} px v ${kontext(v)} („${kratce(v.textContent, 50)}")`, kontext: kontext(v) });
      if (/auto|scroll/.test(getComputedStyle(v).overflowX)) chyby.push(`vzorec: overflow-x (posuvník) na ${popis(v)} („${kratce(v.textContent, 40)}")`);
    }
    // E1 poslední záchrana (obsah.js povolZalomeni): vzorec se nevešel ani zmenšený na 16 px → zalomený za +, −, =
    // (kosmetické — kandidát na rozdělení řádku v obsahu; v dlaždici hlásí „vzorec zalomený" výše)
    for (const v of koren.querySelectorAll('.vzorec-zalomit')) {
      if (!viditelny(v) || v.closest('.dlazdice')) continue;
      for (const html of v.querySelectorAll('.katex-html')) {
        const casti = [...html.querySelectorAll(':scope > .vzorec-cast, :scope > .base')].map((c) => c.getBoundingClientRect()).sort((a, b) => a.top - b.top);
        let radky = casti.length ? 1 : 0;
        let dole = casti[0]?.bottom ?? 0;
        for (const r of casti.slice(1)) { if (r.top >= dole - 2) { radky += 1; dole = r.bottom; } else dole = Math.max(dole, r.bottom); }
        if (radky > 1) chyby.push({ y: Math.round(v.getBoundingClientRect().top + scrollY), text: `vzorec zalomený na ${radky} řádky (nevejde se ani na 16 px) v ${kontext(v)} („${kratce(html.textContent, 50)}")`, kontext: kontext(v) });
      }
    }
    return chyby;
  }

  /** Viditelné textové uzly mimo KaTeX (KaTeX má uvnitř zdrojové závorky apod.). */
  function textoveUzly(koren) {
    const out = [];
    const w = document.createTreeWalker(koren, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.nodeValue.trim()) continue;
      const p = n.parentElement;
      if (!p || p.closest('.katex, script, style, noscript, template, svg')) continue;
      if (!viditelny(p)) continue;
      out.push(n);
    }
    return out;
  }

  // --- kontrast (jen motivové lekce) ---
  function parseBarva(s) {
    if (!s) return null;
    let m = s.match(/^rgba?\(([^)]+)\)$/);
    if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
    m = s.match(/^color\(srgb ([^)]+)\)$/);
    if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
    return null;
  }
  const smichej = (h, d) => [0, 1, 2].map((i) => h[i] * h[3] + d[i] * (1 - h[3])).concat(1);
  function pozadi(e) {
    const vrstvy = [];
    for (let x = e; x; x = x.parentElement) {
      const cs = getComputedStyle(x);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const b = parseBarva(cs.backgroundColor);
      if (!b) return null;
      if (b[3] > 0) { vrstvy.push(b); if (b[3] >= 1) break; }
    }
    let v = [255, 255, 255, 1];
    for (let i = vrstvy.length - 1; i >= 0; i--) v = smichej(vrstvy[i], v);
    return v;
  }
  const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const hex = (c) => `#${c.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
  function kontrast(koren) {
    const vystup = [];
    const videno = new Set();
    let n = 0;
    for (const e of koren.querySelectorAll('*')) {
      if (n > 4000) break;
      if (![...e.childNodes].some((x) => x.nodeType === 3 && x.nodeValue.trim())) continue;
      if (e.closest('svg, [disabled], [aria-disabled="true"], .jen-ctecka, option') || !viditelny(e)) continue;
      n += 1;
      let op = 1;
      for (let x = e; x; x = x.parentElement) op *= parseFloat(getComputedStyle(x).opacity) || 1;
      if (op < 0.99) continue;
      const cs = getComputedStyle(e);
      const fg = parseBarva(cs.color);
      const bg = pozadi(e);
      if (!fg || !bg) continue;
      const f = fg[3] < 1 ? smichej(fg, bg) : fg;
      const l1 = lum(f); const l2 = lum(bg);
      const pomer = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      if (pomer >= 3) continue;
      const klic = `${hex(f)}|${hex(bg)}|${popis(e)}`;
      if (videno.has(klic)) continue;
      videno.add(klic);
      vystup.push({ pomer, co: `nízký kontrast ${pomer.toFixed(2)} : 1 (${hex(f)} na ${hex(bg)}) u ${popis(e)} „${kratce(e.textContent, 40)}"` });
    }
    return vystup;
  }

  const VZORY = [
    [/\bundefined\b/, 'text „undefined"'], [/\bnull\b/, 'text „null"'], [/\[object Object\]/, 'text „[object Object]"'],
    [/\bNaN\b/, 'text „NaN"'], [/\{[a-zA-Z_][\w.]*\}/, 'nevyplněný {placeholder}'],
    [/\\(?:frac|dfrac|cdot|sqrt|times|div|left|right|text|mathrm|le|ge|pi|circ|op)\b/, 'nevykreslený LaTeX (\\…)'],
    [/(^|[^\\])\$[^$\s][^$]*\$/, 'nevykreslený LaTeX ($…$)'],
    [/\*\*[^*\s][^*]*\*\*/, 'nevykreslený Markdown (**…**)'],
  ];

  /**
   * Kontroly jedné obrazovky → [{druh, zavaznost, co}].
   * @param {{sirka?: number, kontrast?: boolean, tisk?: boolean, print?: boolean}} o
   */
  function kontrola(o = {}) {
    const n = [];
    const pridej = (druh, zavaznost, co, kontextNalezu = null, y = null) => n.push({ druh, zavaznost, co, kontext: kontextNalezu, y });
    const yPrvku = (e) => Math.round(e.getBoundingClientRect().top + scrollY);
    // KaTeX
    for (const e of document.querySelectorAll('.katex-error')) pridej('katex-error', 'vazna', `KaTeX chyba: ${kratce(e.getAttribute('title'), 120)} — „${kratce(e.textContent, 60)}"`);
    // vodorovný scroll stránky
    const sw = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const sirka = o.sirka || document.documentElement.clientWidth;
    if (!o.print && sw > sirka + 1) {
      // viníci: prvky za pravým okrajem, ne uvnitř SVG a ne uvnitř předka, který přetečení ořízne / posouvá sám
      const orezany = (e) => {
        for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) {
          if (/hidden|clip|auto|scroll/.test(getComputedStyle(x).overflowX) && x.getBoundingClientRect().right + scrollX <= sirka + 1) return true;
        }
        return false;
      };
      const venku = [...document.body.querySelectorAll('*')].filter((e) => {
        if (e.ownerSVGElement) return false;
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.right + scrollX > sirka + 1 && viditelny(e) && !orezany(e) && !fixni(e);
      });
      const listy = [...new Set(venku.filter((e) => !venku.some((x) => x !== e && e.contains(x))).map((e) => e.closest('.katex') || e))].slice(0, 2);
      const kontexty = [...new Set(listy.map(kontext))];
      const popisy = listy.map((e) => `${e.classList.contains('katex') ? 'vzorec' : popis(e)}${e.textContent.trim() ? ` „${kratce(e.textContent, 45)}"` : ''} v ${kontext(e)} (pravý okraj ${Math.round(e.getBoundingClientRect().right + scrollX)} px)`);
      if (listy.length) pridej('vodorovny-scroll', 'vazna', `vodorovný scroll: stránka ${sw} px > ${sirka} px; přesahuje ${popisy.join('; ')}`, kontexty.join(', '), yPrvku(listy[0]));
      else pridej('vodorovny-scroll', 'vazna', `vodorovný scroll: stránka ${sw} px > ${sirka} px; přesahuje ${listy.map((e) => `${popis(e)} (pravý okraj ${Math.round(e.getBoundingClientRect().right + scrollX)} px${e.textContent.trim() ? `, „${kratce(e.textContent, 30)}"` : ''})`).join('; ') || '?'}`);
    }
    // texty
    const nalezeno = new Set();
    for (const t of textoveUzly(document.body)) {
      for (const [re, co] of VZORY) {
        if (!re.test(t.nodeValue)) continue;
        const klic = `${co}|${t.nodeValue}`;
        if (nalezeno.has(klic)) continue;
        nalezeno.add(klic);
        pridej('text', 'vazna', `${co}: „${kratce(t.nodeValue, 100)}" v ${popis(t.parentElement)}`);
      }
    }
    for (const e of document.querySelectorAll('[aria-label], [title], [alt], [placeholder]')) {
      for (const a of ['aria-label', 'title', 'alt', 'placeholder']) {
        const v = e.getAttribute(a);
        if (v && /\bundefined\b|\bnull\b|\[object Object\]|\bNaN\b/.test(v)) pridej('text', 'vazna', `atribut ${a}="${kratce(v, 80)}" u ${popis(e)}`);
      }
    }
    if (document.title && /\bundefined\b|\bnull\b|\[object Object\]/.test(document.title)) pridej('text', 'vazna', `titulek stránky „${document.title}"`);
    // prázdné vykreslení
    const hlavni = document.getElementById('plocha') || document.getElementById('obsah');
    if (hlavni && !o.tisk && hlavni.innerText.trim().length < 15) pridej('prazdne', 'blokujici', `prázdná obrazovka (${popis(hlavni)}: „${kratce(hlavni.innerText, 40)}")`);
    for (const z of document.querySelectorAll('.karta-ulohy__zadani')) {
      if (viditelny(z) && !z.textContent.trim() && !z.querySelector('svg, img')) pridej('prazdne', 'blokujici', 'prázdné zadání úlohy');
    }
    for (const k of document.querySelectorAll('#plocha .krok:not(.krok--hotovy)')) {
      if (!k.querySelector('.krok__popisek')?.textContent.trim()) pridej('prazdne', 'vazna', 'krok bez popisku');
      const rys = /Hotovo/.test(k.querySelector('.krok__akce button')?.textContent || '');
      if (!rys && !k.querySelector('.dlazdice, input, textarea, [data-op]')) pridej('prazdne', 'blokujici', 'krok bez vstupu');
      for (const d of k.querySelectorAll('.dlazdice')) if (!d.textContent.trim()) pridej('prazdne', 'vazna', 'prázdná dlaždice');
    }
    const postup = document.querySelector('.postup-rodice');
    if (postup && postup.querySelectorAll('.postup-rodice__krok').length < 2) pridej('prazdne', 'vazna', `postup rodiče má jen ${postup.querySelectorAll('.postup-rodice__krok').length} krok(y)`);
    for (const r of document.querySelectorAll('#obsah details[open] > .rozbalovaci__obsah, #obsah details[open] > .postup-rodice__obsah')) {
      if (viditelny(r) && !r.textContent.trim() && !r.querySelector('svg, img, button')) pridej('prazdne', 'vazna', `prázdný rozbalený blok „${kratce(r.parentElement.querySelector('summary')?.textContent, 40)}"`);
    }
    for (const u of document.querySelectorAll('.tisk-uloha')) {
      if (!u.textContent.replace(/\d+\.?/g, '').trim() && !u.querySelector('svg, img')) pridej('prazdne', 'vazna', 'prázdná úloha v tisku');
    }
    // obrázky
    for (const i of document.querySelectorAll('img')) if (viditelny(i) && i.complete && i.naturalWidth === 0) pridej('obrazek', 'vazna', `rozbitý obrázek ${kratce(i.getAttribute('src'), 60)}`);
    for (const svg of document.querySelectorAll('svg[viewBox]')) {
      if (svg.classList.contains('ikona') || !viditelny(svg)) continue;
      const rs = svg.getBoundingClientRect();
      if (!rs.width) continue;
      for (const t of svg.querySelectorAll('text')) {
        const r = t.getBoundingClientRect();
        if (!r.width) continue;
        const pres = Math.max(rs.left - r.left, r.right - rs.right, rs.top - r.top, r.bottom - rs.bottom);
        if (pres > 1.5) pridej('svg-popisek', 'kosmeticka', `popisek SVG „${kratce(t.textContent, 30)}" přesahuje obrázek o ${Math.round(pres)} px`);
      }
    }
    // dlaždice a vzorce
    const koreny = o.tisk ? [...document.querySelectorAll('.tisk-list')] : [document.body];
    for (const k of koreny) {
      for (const c of zmer(k)) {
        const t = typeof c === 'string' ? c : c.text;
        pridej('dlazdice', /overflow-x|přetéká/.test(t) ? 'vazna' : 'kosmeticka', t, typeof c === 'string' ? (/^dlaždice/.test(t) ? 'dlaždice' : null) : c.kontext, typeof c === 'string' ? null : c.y);
      }
    }
    // tisk: ovládání se netiskne, nic nepřetéká list
    if (o.print) {
      const ov = document.getElementById('ovladani');
      if (ov && getComputedStyle(ov).display !== 'none') pridej('tisk', 'vazna', 'ovládání tisku (#ovladani) je vidět i v media print');
      for (const list of document.querySelectorAll('.tisk-list')) {
        const rl = list.getBoundingClientRect();
        const venku = [...list.querySelectorAll('p, li, .katex, svg, img, table, h1, h2, h3, .tisk-uloha')]
          .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > rl.right + 2 || r.left < rl.left - 2) && viditelny(e); });
        const listy = venku.filter((e) => !venku.some((x) => x !== e && e.contains(x))).slice(0, 3);
        if (listy.length) pridej('tisk', 'vazna', `obsah přetéká list (${Math.round(rl.width)} px): ${listy.map((e) => `${popis(e)} „${kratce(e.textContent, 30)}" do ${Math.round(e.getBoundingClientRect().right - rl.left)} px`).join('; ')}`);
      }
    }
    if (o.kontrast) for (const k of kontrast(document.body)) pridej('kontrast', k.pomer < 2 ? 'vazna' : 'kosmeticka', k.co);
    return n;
  }

  // --- žák ---
  function stavZak() {
    const p = document.getElementById('plocha');
    if (!p) return { druh: 'nic' };
    if (p.getAttribute('aria-busy') === 'true' || p.querySelector('.nacitani')) return { druh: 'nacitani' };
    if (p.querySelector(':scope > .hlaska--varovani')) return { druh: 'chyba', text: kratce(p.innerText, 200) };
    if (p.querySelector('.pripravit')) return { druh: 'pripravit' };
    if (p.querySelector('.sim-start')) return { druh: 'sim-start' };
    if (p.querySelector('.diag-prestavka')) return { druh: 'prestavka' };
    if (p.querySelector('.sim-konec')) return { druh: 'konec', text: kratce(p.innerText, 400) };
    const kon = p.querySelector('.konec-lekce');
    if (kon) {
      const a = kon.querySelector('a.tlacitko--primarni');
      if (a) return { druh: 'konec-casti1', href: a.href };
      if (kon.querySelector('a[href*="tisk.html"]')) return { druh: 'papir' };
      return { druh: 'konec', text: kratce(p.innerText, 400) };
    }
    const sekce = p.querySelector('.krok:not(.krok--hotovy)');
    if (sekce) {
      const m = /^popisek-(.+)-([^-]+)$/.exec(sekce.querySelector('.krok__popisek')?.id || '');
      return { druh: 'krok', ulohaId: m?.[1] || null, krokId: m?.[2] || null };
    }
    const dalsi = [...p.querySelectorAll('button')].find((b) => /Další úloha|Dokončit lekci/.test(b.textContent));
    if (dalsi) return { druh: 'dalsi', text: dalsi.textContent.trim() };
    return { druh: 'ceka' };
  }
  function klikniDalsi() {
    const b = [...document.querySelectorAll('#plocha button')].find((x) => /Další úloha|Dokončit lekci/.test(x.textContent));
    b?.click();
    return Boolean(b);
  }
  function pripravit() {
    document.querySelectorAll('.pripravit input[type=checkbox]').forEach((i) => { if (!i.checked) i.click(); });
    const b = document.querySelector('.pripravit .tlacitko--primarni');
    if (!b || b.disabled) return false;
    b.click();
    return true;
  }
  /** Vyplní a odevzdá aktivní krok. o = {typ, id?, poradi?, hodnoty?, znovu?} */
  function odpovez(o) {
    const sekce = document.querySelector('#plocha .krok:not(.krok--hotovy)');
    if (!sekce) return { chyba: 'aktivní krok nenalezen' };
    if (o.typ === 'dlazdice') {
      const b = sekce.querySelector(`.dlazdice[data-id="${CSS.escape(String(o.id))}"]`);
      if (!b) return { chyba: `dlaždice „${o.id}" nenalezena` };
      if (b.disabled) return { chyba: `dlaždice „${o.id}" je zamčená` };
      b.click();
    } else if (o.typ === 'poradi') {
      if (o.znovu) [...sekce.querySelectorAll('button')].find((b) => /Začít znovu/.test(b.textContent))?.click();
      for (const id of o.poradi || []) {
        const m = sekce.querySelector(`[data-op="${CSS.escape(String(id))}"]`);
        if (!m) return { chyba: `operace „${id}" nenalezena` };
        m.click();
      }
    } else if (o.typ !== 'rysovani') {
      const pole = [...sekce.querySelectorAll('input.pole, textarea.pole, input[type=text]')];
      if (pole.length < (o.hodnoty || []).length) return { chyba: `čekáno ${o.hodnoty.length} polí, jsou ${pole.length}` };
      pole.forEach((p, j) => { p.value = o.hodnoty[j] ?? ''; p.dispatchEvent(new Event('input', { bubbles: true })); });
    }
    const btn = sekce.querySelector('.krok__akce button');
    if (!btn) return { chyba: 'chybí tlačítko Odevzdat / Hotovo' };
    btn.click();
    const zv = sekce.querySelector('.zpetna-vazba');
    return {
      hotovy: sekce.classList.contains('krok--hotovy'),
      druh: zv && !zv.hidden ? ((zv.className.match(/zpetna-vazba--(\w+)/) || [])[1] || null) : null,
      text: zv && !zv.hidden ? kratce(zv.textContent, 160) : '',
      barvy: sekce.querySelectorAll('.je-spravne, .je-nesedi').length,
    };
  }

  // --- rodič ---
  function stavRodic() {
    const o = document.getElementById('obsah');
    const d = document.querySelector('#spodniLista:not([hidden]) button.tlacitko--primarni');
    return {
      nacitani: !o || o.getAttribute('aria-busy') === 'true' || Boolean(document.querySelector('#obsah .nacitani')),
      chyba: Boolean(o?.querySelector(':scope > .hlaska--varovani')),
      prepinac: document.querySelector('.prepinac-uloh strong')?.textContent || null,
      blokBezi: Boolean(document.querySelector('.blok-bezi')), blokPruh: Boolean(document.querySelector('.blok-pruh')),
      blokZadalo: Boolean(document.querySelector('.blok-zadalo')),
      postup: document.querySelectorAll('.postup-rodice__krok').length, tahak: Boolean(document.querySelector('.postup-rodice, .tahak__sekce--vysvetleni')),
      souhrn: Boolean(document.querySelector('.souhrn')),
      simBezi: Boolean(document.querySelector('.sim-bezi')), simKontrola: Boolean(document.querySelector('.sim-kontrola')), simSouhrn: Boolean(document.querySelector('.sim-souhrn')),
      diagVysledek: Boolean(document.querySelector('.diag-vysledek__hlavicka')),
      diagZobrazit: Boolean([...document.querySelectorAll('#obsah button')].find((b) => /Zobrazit výsledek/.test(b.textContent))),
      dialog: Boolean(document.querySelector('dialog[open]')),
      dalsi: d ? { text: d.textContent.trim(), disabled: d.disabled } : null,
      chybi: document.getElementById('coChybi')?.textContent || null,
      aktivni: document.querySelector('.postup-rodice__krok.je-aktivni')?.dataset.krok || null,
      text: kratce(o?.innerText, 600),
    };
  }
  async function rozbal(koren = '#obsah') {
    document.querySelectorAll(`${koren} details`).forEach((d) => { d.open = true; });
    for (let k = 0; k < 4; k++) {
      const b = [...document.querySelectorAll(`${koren} button`)].find((x) => /Další otázka/.test(x.textContent) && !x.disabled);
      if (!b) break;
      b.click();
      await spi(80);
    }
    document.querySelectorAll(`${koren} details`).forEach((d) => { d.open = true; });
    await usadit();
    return true;
  }
  async function rodicKroky() {
    const log = [];
    for (const krok of ['cteni', 'otazky', 'otocena']) {
      const li = document.querySelector(`.postup-rodice__krok[data-krok="${krok}"]`);
      if (!li) continue;
      li.querySelector('details').open = true;
      const b = krok === 'otazky'
        ? [...li.querySelectorAll('.postup-rodice__akce button')].at(-1)
        : [...li.querySelectorAll('.postup-rodice__obsah > button.tlacitko--primarni')].at(-1);
      if (!b) { log.push(`krok ${krok}: chybí tlačítko`); continue; }
      b.click();
      await spi(120);
    }
    const d = document.querySelector('#spodniLista button.tlacitko--primarni');
    return { log, dalsiDisabled: d ? d.disabled : null, chybi: document.getElementById('coChybi')?.textContent || null,
      aktivni: document.querySelector('.postup-rodice__krok.je-aktivni')?.dataset.krok || null };
  }
  async function rodicSemafor(volba = 'sam') {
    const li = document.querySelector('.postup-rodice__krok[data-krok="semafor"]');
    if (!li) return { chyba: 'chybí krok ④ (semafor)' };
    li.querySelector('details').open = true;
    const rys = li.querySelector('button[data-hodnota="sedi"]');
    if (rys) { rys.click(); await spi(100); for (let k = 0; k < 60 && rys.disabled; k++) await spi(50); await spi(150); }
    const b = document.querySelector(`.semafor-volba[data-volba="${volba}"]`);
    if (!b) return { chyba: 'chybí tlačítko semaforu' };
    b.click();
    for (let k = 0; k < 80; k++) {
      await spi(100);
      if (document.querySelector('.souhrn') || document.querySelector('.semafor-vysledek:not([hidden])')) break;
    }
    return { rysovani: Boolean(rys), vysledek: kratce(document.querySelector('.semafor-vysledek:not([hidden])')?.textContent, 200), souhrn: Boolean(document.querySelector('.souhrn')) };
  }
  async function simKontrola() {
    document.querySelectorAll('.sim-kontrola details').forEach((d) => { d.open = true; });
    let n = 0;
    for (const p of document.querySelectorAll('.sim-polozka')) {
      const b = p.querySelector('button[data-hodnota="ano"], button[data-hodnota="sedi"]') || p.querySelector('button[data-hodnota]');
      if (!b) continue;
      b.click();
      n += 1;
      await spi(30);
      for (let k = 0; k < 60 && b.disabled; k++) await spi(50);
    }
    await usadit();
    return { n, polozek: document.querySelectorAll('.sim-polozka').length };
  }
  function klikniText(re, koren = document) {
    const b = [...koren.querySelectorAll('button, a')].find((x) => re.test(x.textContent) && !x.disabled);
    b?.click();
    return Boolean(b);
  }
  async function usadit() {
    try { await document.fonts?.ready; } catch { /* nic */ }
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await spi(250);
    return true;
  }
  window.__qa = { kontrola, zmer, stavZak, klikniDalsi, pripravit, odpovez, stavRodic, rozbal, rodicKroky, rodicSemafor, simKontrola, klikniText, usadit };
}
const QA_SKRIPT = `(${qaStranka.toString()})();`;

// =====================================================================
// Pracovník = vlastní browser context + stránka
// =====================================================================
class Pracovnik {
  constructor(cislo) { this.cislo = cislo; this.chyby = []; this.cekatele = new Set(); this.sirka = 1280; this.vyska = 900; this.mobil = false; }

  async start() {
    const { browserContextId } = await cdp('Target.createBrowserContext', { disposeOnDetach: true });
    const { targetId } = await cdp('Target.createTarget', { url: 'about:blank', browserContextId });
    const { sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true });
    this.sessionId = sessionId;
    pracovniciPodleSession.set(sessionId, this);
    await this.s('Page.enable');
    await this.s('Runtime.enable');
    await this.s('Log.enable');
    await this.s('Network.enable');
    await this.s('Network.setBlockedURLs', { urls: ['*supabase.co*'] }); // pojistka: žádná síť proti Supabase
    await this.s('Page.addScriptToEvaluateOnNewDocument', { source: QA_SKRIPT });
  }

  s(method, params) { return cdp(method, params, this.sessionId); }

  udalost(z) {
    const p = z.params;
    if (z.method === 'Runtime.exceptionThrown') {
      const d = p.exceptionDetails;
      this.chyby.push({ druh: 'vyjimka', zavaznost: 'vazna', co: `výjimka JS: ${(d?.exception?.description || d?.text || '').split('\n')[0]}${d?.url ? ` (${d.url.replace(ORIGIN, '')}:${d.lineNumber + 1})` : ''}` });
    } else if (z.method === 'Runtime.consoleAPICalled' && p.type === 'error') {
      this.chyby.push({ druh: 'console.error', zavaznost: 'vazna', co: `console.error: ${p.args?.map((a) => a.value ?? a.description ?? '').join(' ').split('\n')[0].slice(0, 220)}` });
    } else if (z.method === 'Log.entryAdded' && p.entry?.level === 'error') {
      this.chyby.push({ druh: 'log', zavaznost: 'vazna', co: `chyba prohlížeče: ${p.entry.text}${p.entry.url ? ` (${p.entry.url.replace(ORIGIN, '')})` : ''}` });
    } else if (z.method === 'Page.javascriptDialogOpening') {
      this.s('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
      this.chyby.push({ druh: 'dialog', zavaznost: 'kosmeticka', co: `JS dialog: ${p.message}` });
    }
    for (const f of this.cekatele) f(z);
  }

  nacteni(timeout = 30000) {
    return new Promise((ok) => {
      const f = (z) => { if (z.method === 'Page.loadEventFired') { this.cekatele.delete(f); clearTimeout(t); ok(true); } };
      const t = setTimeout(() => { this.cekatele.delete(f); ok(false); }, timeout);
      this.cekatele.add(f);
    });
  }

  async js(vyraz) {
    const r = await this.s('Runtime.evaluate', { expression: vyraz, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(`JS: ${r.exceptionDetails.exception?.description?.split('\n')[0] || r.exceptionDetails.text}`);
    return r.result.value;
  }

  async jdi(url) {
    const n = this.nacteni();
    await this.s('Page.navigate', { url });
    if (!(await n)) throw new Error(`stránka se nenačetla: ${url.replace(ORIGIN, '')}`);
  }

  async pockej(podminka, popis, timeout = 20000) {
    const konec = Date.now() + timeout;
    while (Date.now() < konec) {
      if (await this.js(`Boolean(${podminka})`).catch(() => false)) { await this.js('window.__qa ? __qa.usadit() : true').catch(() => {}); return; }
      await cekej(150);
    }
    throw new Error(`nedočkal jsem se: ${popis}`);
  }

  async viewport(sirka, vyska = 900) {
    this.sirka = sirka; this.vyska = vyska; this.mobil = sirka < 768;
    await this.s('Emulation.setDeviceMetricsOverride', { width: sirka, height: vyska, deviceScaleFactor: 1, mobile: this.mobil });
    await this.s('Emulation.setTouchEmulationEnabled', { enabled: this.mobil, maxTouchPoints: 5 });
  }

  media(m) { return this.s('Emulation.setEmulatedMedia', { media: m }); }

  /** Snímek celé stránky; s `y` jen výřez kolem viníka (y − 250 … y + 650 px), ať je nález na snímku vidět. */
  async snimek(soubor, y = null) {
    const { cssContentSize } = await this.s('Page.getLayoutMetrics');
    const plna = Math.min(8000, Math.max(this.vyska, Math.ceil(cssContentSize.height)));
    await this.s('Emulation.setDeviceMetricsOverride', { width: this.sirka, height: plna, deviceScaleFactor: 1, mobile: this.mobil });
    await cekej(300);
    const y0 = y == null ? null : Math.max(0, Math.min(y - 250, plna - 900));
    const { data } = await this.s('Page.captureScreenshot', y0 == null ? { format: 'png' }
      : { format: 'png', clip: { x: 0, y: y0, width: this.sirka, height: Math.min(900, plna - y0), scale: 1 } });
    await this.s('Emulation.setDeviceMetricsOverride', { width: this.sirka, height: this.vyska, deviceScaleFactor: 1, mobile: this.mobil });
    await writeFile(join(DIR_OBR, soubor), Buffer.from(data, 'base64'));
    return soubor;
  }

  /** Nová čistá fake DB + katalog, motiv; role se nastaví před každou stránkou. */
  async reset(motiv = 'svetly') {
    await this.jdi(`${ORIGIN}/qa-prazdna.html`);
    await this.js(`(() => { localStorage.clear(); sessionStorage.clear();
      localStorage.setItem('spolu.fake-katalog', ${JSON.stringify(JSON.stringify(KATALOG))});
      localStorage.setItem('spolu.dite', ${JSON.stringify(DITE)});
      localStorage.setItem('spolu.manual-precteno', '1');
      localStorage.setItem('spolu.motiv', ${JSON.stringify(motiv)});
      return true; })()`);
    this.chyby.length = 0;
  }

  role(r) { return this.js(`localStorage.setItem('spolu.role', ${JSON.stringify(r)}); true`); }
}

// =====================================================================
// Kontext sloupce: počítá obrazovky, sbírá nálezy, fotí nálezy
// =====================================================================
function novyKontext(jednotka, sloupec, w, { motiv = 'svetly' } = {}) {
  const ctx = {
    jednotka, sloupec, w, motiv, lekceId: jednotka.ids[0], obrazovek: 0, nalezy: [], snimky: new Map(), posledniObrazovka: '—',
    pridej(n) { ctx.nalezy.push({ lekce: n.lekce || ctx.lekceId, sloupec, motiv, uloha: n.uloha ?? null, obrazovka: n.obrazovka || ctx.posledniObrazovka, druh: n.druh, zavaznost: n.zavaznost, co: n.co, kontext: n.kontext || null, snimek: n.snimek || null }); },
    async kontrola(obrazovka, { uloha = null, volby = {} } = {}) {
      ctx.obrazovek += 1;
      ctx.posledniObrazovka = obrazovka;
      let n = [];
      try {
        n = await w.js(`__qa.kontrola(${JSON.stringify({ sirka: w.sirka, kontrast: jednotka.motivova && sloupec !== 'tisk', ...volby })})`);
      } catch (e) {
        n = [{ druh: 'kontrola', zavaznost: 'vazna', co: `kontrolu obrazovky nešlo spustit: ${e.message}` }];
      }
      // R37: diagnostika u žáka bez viditelného odpočtu
      if (sloupec !== 'tisk' && jednotka.typ === 'diagnostika' && await w.js(`(() => { const o = document.getElementById('odpocet'); return Boolean(document.getElementById('plocha') && o && o.checkVisibility()); })()`).catch(() => false)) {
        n.push({ druh: 'r37-odpocet', zavaznost: 'vazna', co: `diagnostika: žák vidí odpočet „${await w.js(`document.getElementById('odpocet').textContent.trim()`)}" (R37: pro dítě bez viditelného odpočtu)` });
      }
      n.push(...w.chyby.splice(0));
      if (!n.length) return;
      const snimek = await ctx.snimekNalezu(obrazovka, uloha, n);
      for (const x of n) ctx.pridej({ ...x, uloha, obrazovka, snimek });
    },
    /** Snímek jen u nového druhu nálezu v úloze (max MAX_SNIMKU_SLOUPEC na sloupec); jinak odkaz na dřívější snímek téhož druhu. */
    async snimekNalezu(obrazovka, uloha, nalezy) {
      const druhy = [...new Set(nalezy.map((x) => x.druh))];
      const nove = druhy.filter((d) => !ctx.snimky.has(`${uloha}|${d}`));
      if (!nove.length || ctx.snimky.size >= MAX_SNIMKU_SLOUPEC) return ctx.snimky.get(`${uloha}|${druhy[0]}`) || [...ctx.snimky.values()].find(Boolean) || null;
      const slug = `${ctx.lekceId}-${sloupec}${motiv === 'tmavy' && sloupec !== 'tmavy' ? '-tmavy' : ''}-${uloha || obrazovka}-${nove[0]}`
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
      const soubor = `${DATUM}-qa-${slug}.png`;
      const y = nalezy.find((x) => nove.includes(x.druh) && x.y != null)?.y ?? null;
      try { await w.snimek(soubor, y); } catch { return null; }
      for (const d of druhy) if (!ctx.snimky.has(`${uloha}|${d}`)) ctx.snimky.set(`${uloha}|${d}`, soubor);
      return soubor;
    },
    /** Spustí část průchodu; zaseknutí = blokující nález se snímkem, sloupec pokračuje další částí. */
    async chran(fn) {
      try { await fn(); } catch (e) {
        w.chyby.splice(0).forEach((x) => ctx.pridej(x));
        let snimek = null;
        try { snimek = await ctx.snimekNalezu(ctx.posledniObrazovka, 'zasek', [{ druh: 'tok' }]); } catch { /* nic */ }
        ctx.pridej({ druh: 'tok', zavaznost: 'blokujici', co: `tok se zasekl: ${e.message}`, snimek });
        return false;
      }
      return true;
    },
    vysledek() { return { obrazovek: ctx.obrazovek, nalezy: ctx.nalezy }; },
  };
  return ctx;
}

// =====================================================================
// Žák
// =====================================================================
const cisloText = (x) => (typeof x === 'number' ? String(x).replace('.', ',') : String(x));
function spravnaOdpoved(krok) {
  const t = krok.vstup?.typ;
  const sp = krok.spravne || {};
  if (t === 'dlazdice') return { typ: t, id: (krok.vstup.moznosti || []).find((m) => m.spravne)?.id ?? null };
  if (t === 'poradi') return { typ: t, poradi: sp.poradi?.[0] || [] };
  if (t === 'rysovani') return { typ: t };
  if (t === 'cislo') return { typ: t, hodnoty: [cisloText(sp.hodnota)] };
  if (t === 'zlomek') return { typ: t, hodnoty: [cisloText(sp.c), cisloText(sp.j)] };
  if (t === 'smisene') return { typ: t, hodnoty: [cisloText(sp.cela), cisloText(sp.c), cisloText(sp.j)] };
  if (t === 'vyraz') return { typ: t, hodnoty: [String(sp.vyraz)] };
  return { typ: t || 'text', hodnoty: ['Odpověď z QA průchodu'] };
}
/** Náhradní (špatná) odpověď, aby šel krok uzavřít, když správná neprošla. */
function nahradniOdpoved(krok, n) {
  const t = krok.vstup?.typ;
  if (t === 'dlazdice') {
    const spatne = (krok.vstup.moznosti || []).filter((m) => !m.spravne);
    return { typ: t, id: spatne[(n - 2) % Math.max(1, spatne.length)]?.id };
  }
  if (t === 'poradi') return { typ: t, poradi: [...(krok.spravne?.poradi?.[0] || [])].reverse(), znovu: true };
  if (t === 'rysovani') return { typ: t };
  if (t === 'zlomek') return { typ: t, hodnoty: [String(97 + n), '89'] };
  if (t === 'smisene') return { typ: t, hodnoty: [String(9 + n), '1', '7'] };
  if (t === 'vyraz') return { typ: t, hodnoty: [`${krok.vstup?.promenne?.[0] || 'x'}+${987 + n}`] };
  return { typ: t || 'text', hodnoty: [String(987650 + n)] };
}

/**
 * Projde lekci(e) žáka od `url` do konce (u simulace přes „Další část" až do konce testu).
 * @param {{stop?: (info) => boolean}} volby  stop = zastavit před první kontrolou úlohy, pro kterou platí
 * @returns {Promise<'konec'|'stop'|'chyba'|'papir'>}
 */
async function zakPruchod(w, ctx, url, { stop = null } = {}) {
  await w.jdi(url);
  const pokusy = {};
  let posledniUloha = null;
  let cekani = 0;
  for (let iter = 0; iter < 800; iter++) {
    const st = await w.js('__qa.stavZak()');
    if (['nacitani', 'ceka', 'nic'].includes(st.druh)) {
      if (++cekani > 120) throw new Error(`stránka žáka nepokračuje (${st.druh}) po ${posledniUloha || 'začátku'}`);
      await cekej(150);
      continue;
    }
    cekani = 0;
    ctx.lekceId = (await w.js(`new URLSearchParams(location.search).get('lekce')`)) || ctx.lekceId;
    const neutralni = ['simulace', 'diagnostika'].includes(typLekce(LEKCE.get(ctx.lekceId) || {}));
    switch (st.druh) {
      case 'chyba':
        await ctx.kontrola('chyba stránky');
        ctx.pridej({ druh: 'tok', zavaznost: 'blokujici', co: `stránka žáka ukázala chybu: „${st.text}"` });
        return 'chyba';
      case 'pripravit':
        await w.js('__qa.usadit()');
        await ctx.kontrola('Připrav si');
        if (!(await w.js('__qa.pripravit()'))) throw new Error('„Připrav si": tlačítko se po odškrtnutí nepovolilo');
        await cekej(150);
        break;
      case 'sim-start':
        await w.js('__qa.usadit()');
        await ctx.kontrola(`start ${LEKCE.get(ctx.lekceId)?.simulace?.cast || ''}. části`);
        await w.js(`document.querySelector('.sim-start button').click(); true`);
        await cekej(150);
        break;
      case 'prestavka':
        await ctx.kontrola('přestávka po 12. úloze');
        await w.js(`__qa.klikniText(/Pokračovat/, document.querySelector('.diag-prestavka'))`);
        await cekej(150);
        break;
      case 'dalsi':
        await w.js('__qa.klikniDalsi()');
        await cekej(120);
        break;
      case 'konec-casti1': {
        await ctx.kontrola('konec 1. části');
        const n = w.nacteni();
        await w.js(`document.querySelector('.konec-lekce a.tlacitko--primarni').click(); true`);
        if (!(await n)) throw new Error('odkaz na 2. část simulace nenačetl stránku');
        posledniUloha = null;
        break;
      }
      case 'papir':
        ctx.pridej({ druh: 'tok', zavaznost: 'blokujici', co: 'žák v režimu aplikace skončil na obrazovce „na papír"' });
        return 'papir';
      case 'konec': {
        await w.js('__qa.usadit()');
        await ctx.kontrola('konec lekce');
        const l = LEKCE.get(ctx.lekceId);
        if (l?.typ === 'simulace' && /%|\bbod[yů]?\b|z 50|z 25/.test(st.text)) ctx.pridej({ druh: 'obsah-obrazovky', zavaznost: 'vazna', co: `konec simulace u žáka ukazuje skóre: „${st.text.slice(0, 160)}"` });
        if (l?.typ === 'diagnostika' && /%|správně \d|\d+ z 24/.test(st.text)) ctx.pridej({ druh: 'obsah-obrazovky', zavaznost: 'vazna', co: `konec diagnostiky u žáka ukazuje počet správných: „${st.text.slice(0, 160)}"` });
        if (l && l.typ !== 'simulace' && l.typ !== 'diagnostika') {
          // R62: čistá fake DB → po lekci musí vyskočit „Nový odznak: První lekce" a jít sebrat
          let okno = false;
          for (let i = 0; i < 30 && !okno; i++) { okno = await w.js(`Boolean(document.querySelector('dialog.modal--novy-odznak[open]'))`); if (!okno) await new Promise((r) => setTimeout(r, 100)); }
          if (!okno) ctx.pridej({ druh: 'odznaky', zavaznost: 'vazna', co: 'po dokončení lekce se u žáka neukázalo okno „Nový odznak"' });
          else {
            await ctx.kontrola('nový odznak');
            for (let i = 0; i < 12 && await w.js(`Boolean(document.querySelector('dialog.modal--novy-odznak[open]'))`); i++) {
              await w.js(`document.querySelector('dialog.modal--novy-odznak[open] button')?.click(); true`);
              await new Promise((r) => setTimeout(r, 600));
            }
          }
        }
        return 'konec';
      }
      case 'krok': {
        const info = ULOHY.get(st.ulohaId);
        if (!info) throw new Error(`neznámá úloha v popisku kroku: ${st.ulohaId}`);
        const kratkeId = info.uloha.id.replace(`${info.lekce.id}-`, '');
        if (st.ulohaId !== posledniUloha) {
          if (stop && stop(info)) return 'stop';
          posledniUloha = st.ulohaId;
          await w.js('__qa.usadit()');
          if (SEBETEST && info.index === 0 && ctx.sloupec === 'zak375') {
            await w.js(`(() => { const d = document.createElement('div'); d.style.cssText = 'width:600px;color:#eee;background:#fff'; d.textContent = 'sebetest undefined {placeholder} NaN'; document.getElementById('plocha').append(d); console.error('sebetest console.error'); return true; })()`);
          }
          await ctx.kontrola(`úloha ${info.index + 1}`, { uloha: kratkeId });
        }
        const krok = info.uloha.kroky.find((k) => k.id === st.krokId);
        if (!krok) throw new Error(`krok ${st.krokId} není v JSON úlohy ${st.ulohaId}`);
        const klic = `${st.ulohaId}/${st.krokId}`;
        const n = (pokusy[klic] = (pokusy[klic] || 0) + 1);
        if (n > 5) throw new Error(`krok ${kratkeId}/${st.krokId} nejde uzavřít ani náhradními odpověďmi`);
        const odp = n === 1 && !(SEBETEST && ctx.sloupec === 'zak375' && info.index === 0 && Object.keys(pokusy).length === 1) ? spravnaOdpoved(krok) : nahradniOdpoved(krok, Math.max(n, 2));
        if (n === 1 && odp.typ === 'dlazdice' && odp.id == null) {
          ctx.pridej({ druh: 'obsah', zavaznost: 'vazna', uloha: kratkeId, co: `krok ${st.krokId}: v JSON není žádná dlaždice se „spravne: true"` });
          Object.assign(odp, nahradniOdpoved(krok, 2));
        }
        const r = await w.js(`__qa.odpovez(${JSON.stringify(odp)})`);
        if (r.chyba) throw new Error(`úloha ${kratkeId}, krok ${st.krokId}: ${r.chyba}`);
        if (n === 1) {
          const kde = { uloha: kratkeId, obrazovka: `úloha ${info.index + 1}, krok ${st.krokId}` };
          if (neutralni) {
            if (!(r.hotovy && r.text === 'Uloženo.' && r.barvy === 0)) {
              ctx.pridej({ ...kde, druh: 'neutralni-tok', zavaznost: 'vazna', co: `${typLekce(info.lekce)}: po odevzdání čekáno jen „Uloženo." (1 pokus, bez ✔/✘), je: „${r.text}"${r.barvy ? `, zvýrazněno ${r.barvy}×` : ''}${r.hotovy ? '' : ', krok zůstal otevřený'}` });
            }
          } else if (r.druh === 'nesedi') {
            ctx.pridej({ ...kde, druh: 'spravna-nesedi', zavaznost: 'vazna', co: `správná odpověď z JSON (${JSON.stringify(odp.hodnoty ?? odp.id ?? odp.poradi)}) vyhodnocena jako nesedí: „${r.text}"` });
          } else if (r.druh === 'poznamka' && !r.hotovy) {
            ctx.pridej({ ...kde, druh: 'spravna-neplatna', zavaznost: 'vazna', co: `správnou odpověď z JSON (${JSON.stringify(odp.hodnoty ?? odp.id ?? odp.poradi)}) nejde odevzdat: „${r.text}"` });
          } else if (r.druh === 'poznamka' && krok.vstup?.typ !== 'rysovani' && /základního tvaru/.test(r.text)) {
            ctx.pridej({ ...kde, druh: 'spravna-poznamka', zavaznost: 'kosmeticka', co: `správná odpověď z JSON není v základním tvaru: „${r.text}"` });
          } else if (!r.hotovy) {
            ctx.pridej({ ...kde, druh: 'spravna-nesedi', zavaznost: 'vazna', co: `krok se po správné odpovědi neuzavřel: „${r.text}"` });
          }
        }
        await cekej(60);
        break;
      }
      default:
        throw new Error(`neznámý stav stránky žáka: ${st.druh}`);
    }
  }
  throw new Error('příliš mnoho kroků (limit průchodu)');
}

const urlZak = (id, rezim = true) => `${WEB}/lekce.html?lekce=${id}&dite=${DITE}&lokalne=1${rezim ? `&rezim=${SAMO && lzeSamo(LEKCE.get(id)) ? 'samo' : 'app'}` : ''}`;
const urlRodic = (id, rezim = true) => `${WEB}/rodic.html?lekce=${id}&dite=${DITE}&lokalne=1${rezim ? '&rezim=app' : ''}`;

async function zakSloupec(w, ctx, j, sirka) {
  await ctx.chran(async () => {
    await w.reset(ctx.motiv);
    await w.role('zak');
    await w.viewport(sirka, sirka < 768 ? 812 : 900);
    const konec = await zakPruchod(w, ctx, urlZak(j.ids[0]));
    if (konec === 'konec' && j.typ === 'simulace' && ctx.lekceId !== j.ids.at(-1)) throw new Error('simulace skončila před 2. částí');
    const l = LEKCE.get(j.ids[0]);
    if (SAMO && konec === 'konec' && lzeSamo(l)) {
      // R64: bez rodiče — sezení dokončené aplikací, souhrn.samo, semafor u každé úlohy
      let db = null;
      for (let i = 0; i < 30; i++) {
        db = JSON.parse(await w.js(`localStorage.getItem('spolu.fake-db')`) || 'null');
        const sez = db?.sezeni?.find((x) => x.lekce_id === l.id && x.rezim === 'samo');
        if (sez?.stav === 'dokonceno') break;
        await new Promise((res) => setTimeout(res, 150));
      }
      const sez = db?.sezeni?.find((x) => x.lekce_id === l.id && x.rezim === 'samo');
      const sem = (db?.semafory || []).filter((x) => x.sezeni_id === sez?.id);
      if (!sez) ctx.pridej({ druh: 'samo', zavaznost: 'blokujici', co: 'režim samo: sezení s rezim „samo" nevzniklo' });
      else {
        if (sez.stav !== 'dokonceno' || !sez.souhrn?.samo) ctx.pridej({ druh: 'samo', zavaznost: 'blokujici', co: `režim samo: lekce se sama neukončila (stav ${sez.stav}, souhrn.samo ${sez.souhrn?.samo})` });
        if (sem.length !== l.ulohy.length) ctx.pridej({ druh: 'samo', zavaznost: 'vazna', co: `režim samo: semafor u ${sem.length} z ${l.ulohy.length} úloh` });
        if (sez.stav === 'dokonceno' && sez.souhrn?.samo && sem.length === l.ulohy.length && sem.every((x) => x.barva === 'zelena')) console.log(`    samo ✔ ${l.id} (${sirka} px): lekce ukončená aplikací, ${sem.length}× zelená`);
        if (sem.some((x) => x.barva !== 'zelena')) ctx.pridej({ druh: 'samo', zavaznost: 'vazna', co: `režim samo: správné řešení bez nápovědy nedalo zelenou (${sem.map((x) => x.barva).join(', ')})` });
      }
    }
  });
  w.chyby.splice(0).forEach((x) => ctx.pridej(x));
}

// =====================================================================
// Rodič
// =====================================================================
const NACTENE = `(() => { const s = __qa.stavRodic(); return !s.nacitani; })()`;

/** Běžná karta rodiče (i po bloku): každá úloha, brána ①–④, tahák, semafor, souhrn, Ukončit lekci. */
async function rodicBezna(w, ctx, l, { blok = false } = {}) {
  const n = l.ulohy.length;
  for (let i = 0; i < n; i++) {
    const kratkeId = l.ulohy[i].id.replace(`${l.id}-`, '');
    await w.pockej(`new RegExp('^Úloha ${i + 1} ').test(__qa.stavRodic().prepinac || '') && ${NACTENE}`, `rodič: úloha ${i + 1}`);
    let st = await w.js('__qa.stavRodic()');
    if (st.chyba) throw new Error(`rodič: chyba stránky „${st.text.slice(0, 120)}"`);
    const kde = { uloha: kratkeId, obrazovka: `úloha ${i + 1}` };
    if (!st.dalsi || !st.dalsi.disabled) ctx.pridej({ ...kde, druh: 'brana', zavaznost: 'vazna', co: `brána ①–④ (R28): „${st.dalsi?.text || 'Další'}" je povolené hned po otevření úlohy` });
    if (!st.chybi) ctx.pridej({ ...kde, druh: 'brana', zavaznost: 'kosmeticka', co: 'pod zamčeným „Další" chybí text, co ještě chybí (#coChybi)' });
    if (blok && !st.blokPruh) ctx.pridej({ ...kde, druh: 'blok', zavaznost: 'vazna', co: 'po bloku chybí pruh „Po bloku: projděte spolu úlohy 1–4…"' });
    if (blok && !st.blokZadalo) ctx.pridej({ ...kde, druh: 'blok', zavaznost: 'kosmeticka', co: 'po bloku v kroku ① chybí „Dítě zadalo:"' });
    await ctx.kontrola(`úloha ${i + 1} (brána)`, { uloha: kratkeId });
    await w.js('__qa.rozbal()');
    await ctx.kontrola(`úloha ${i + 1} (tahák rozbalený, otázky L1–L3)`, { uloha: kratkeId });
    const k = await w.js('__qa.rodicKroky()');
    for (const x of k.log) ctx.pridej({ ...kde, druh: 'brana', zavaznost: 'vazna', co: `postup ①–③: ${x}` });
    if (k.aktivni !== 'semafor' || k.dalsiDisabled !== true) {
      ctx.pridej({ ...kde, druh: 'brana', zavaznost: 'vazna', co: `po odškrtnutí ①–③ čekán aktivní krok ④ a zamčené „Další"; je aktivní „${k.aktivni}", „Další" ${k.dalsiDisabled ? 'zamčené' : 'povolené'} (${k.chybi || '—'})` });
    }
    const sem = await w.js('__qa.rodicSemafor("sam")');
    if (sem.chyba) throw new Error(`úloha ${i + 1}: ${sem.chyba}`);
    if (i < n - 1) {
      if (!sem.vysledek) ctx.pridej({ ...kde, druh: 'semafor', zavaznost: 'vazna', co: 'po kliknutí na semafor se neukázal výsledek (barva + doporučení)' });
      await ctx.kontrola(`úloha ${i + 1} (po semaforu)`, { uloha: kratkeId });
      st = await w.js('__qa.stavRodic()');
      if (!st.dalsi || st.dalsi.disabled) throw new Error(`úloha ${i + 1}: „Další úloha" zůstalo po semaforu zamčené (${st.chybi || ''})`);
      await w.js(`document.querySelector('#spodniLista button.tlacitko--primarni').click(); true`);
    }
  }
  await w.pockej(`document.querySelector('.souhrn') && ${NACTENE}`, 'rodič: souhrn lekce');
  await w.js('__qa.rozbal()');
  await ctx.kontrola('souhrn lekce');
  if (!(await w.js(`(() => { const b = document.getElementById('btnUkoncitLekci'); if (!b) return false; b.click(); return true; })()`))) {
    ctx.pridej({ druh: 'souhrn', zavaznost: 'vazna', co: 'souhrn: chybí tlačítko „Ukončit lekci"' });
    return;
  }
  await w.pockej(`document.querySelector('#spodniLista a[href="prehled.html"]')`, 'rodič: lekce ukončená (Zpět na přehled)');
  await ctx.kontrola('lekce ukončená (jen pro čtení)');
}

async function rodicSimulace(w, ctx, j) {
  await w.jdi(urlRodic(j.ids[0], false));
  await w.pockej(`(__qa.stavRodic().simBezi || __qa.stavRodic().simKontrola || __qa.stavRodic().chyba) && ${NACTENE}`, 'rodič: simulace (během testu / Kontrola)');
  let st = await w.js('__qa.stavRodic()');
  if (st.chyba) throw new Error(`rodič simulace: chyba stránky „${st.text.slice(0, 120)}"`);
  if (st.simBezi) {
    if (/Ukázat řešení|Správně:|Typická chyba/.test(st.text)) ctx.pridej({ druh: 'simulace', zavaznost: 'vazna', co: 'rodič během testu vidí tahák / řešení / klíč' });
    await ctx.kontrola('během testu');
    if (!(await w.js(`__qa.klikniText(/Dítě odevzdalo/, document.querySelector('.sim-bezi'))`))) throw new Error('chybí tlačítko „Dítě odevzdalo"');
    await w.pockej(`document.querySelector('dialog[open]')`, 'potvrzení „Dítě odevzdalo"');
    await ctx.kontrola('potvrzení „Dítě odevzdalo"');
    await w.js(`__qa.klikniText(/Ano, odevzdalo/, document.querySelector('dialog[open]'))`);
  }
  await w.pockej(`document.querySelector('.sim-kontrola')`, 'rodič: Kontrola');
  await w.js('__qa.rozbal()');
  await ctx.kontrola('Kontrola (před vyplněním)');
  const k = await w.js('__qa.simKontrola()');
  if (!k.polozek) ctx.pridej({ druh: 'simulace', zavaznost: 'kosmeticka', co: 'Kontrola nemá žádné položky (v aplikaci čekány postup a rýsování)' });
  await ctx.kontrola(`Kontrola (vyplněno ${k.n} z ${k.polozek})`);
  if (!(await w.js(`__qa.klikniText(/Zobrazit souhrn/, document.querySelector('.sim-kontrola'))`))) throw new Error('chybí tlačítko „Zobrazit souhrn"');
  await w.pockej(`document.querySelector('.sim-souhrn')`, 'rodič: souhrn simulace');
  await w.js('__qa.rozbal()');
  st = await w.js('__qa.stavRodic()');
  if (/gymn|stačí na|přijet|přijme/i.test(st.text)) ctx.pridej({ druh: 'simulace', zavaznost: 'vazna', co: `souhrn simulace zmiňuje hranici přijetí: „${st.text.slice(0, 160)}"` });
  if (!/Orientačně \d+ z 50/.test(st.text)) ctx.pridej({ druh: 'simulace', zavaznost: 'kosmeticka', co: 'souhrn simulace bez „Orientačně N z 50"' });
  await ctx.kontrola('souhrn simulace');
}

async function rodicDiagnostika(w, ctx, j) {
  await w.jdi(urlRodic(j.ids[0], false));
  await w.pockej(`(__qa.stavRodic().diagZobrazit || __qa.stavRodic().diagVysledek || __qa.stavRodic().chyba) && ${NACTENE}`, 'rodič: diagnostika (průběh / výsledek)');
  let st = await w.js('__qa.stavRodic()');
  if (st.chyba) throw new Error(`rodič diagnostika: chyba stránky „${st.text.slice(0, 120)}"`);
  if (!st.diagVysledek) {
    await ctx.kontrola('průběh diagnostiky');
    await w.js(`__qa.klikniText(/Zobrazit výsledek/, document.getElementById('obsah'))`);
    await cekej(300);
    if (await w.js(`Boolean(document.querySelector('dialog[open]'))`)) {
      ctx.pridej({ druh: 'diagnostika', zavaznost: 'kosmeticka', co: 'po odevzdání všech 24 úloh se „Zobrazit výsledek" ještě ptá na potvrzení' });
      await w.js(`__qa.klikniText(/Ano, zobrazit/, document.querySelector('dialog[open]'))`);
    }
    await w.pockej(`document.querySelector('.diag-vysledek__hlavicka')`, 'rodič: výsledek diagnostiky');
  }
  await w.js('__qa.rozbal()');
  st = await w.js('__qa.stavRodic()');
  if (/%|stačí na|\bbod[yů]?\b|známk/i.test(st.text)) ctx.pridej({ druh: 'diagnostika', zavaznost: 'vazna', co: `výsledek diagnostiky obsahuje procenta / body / známky: „${st.text.slice(0, 160)}"` });
  await ctx.kontrola('výsledek diagnostiky');
}

/** Žák (sirkaZak) + rodič 375 na stejném sezení; u bloku „během bloku" po 2 úlohách a „po bloku". */
async function zakARodic(w, j, klicZak, klicRodic, sirkaZak, motiv) {
  const cz = novyKontext(j, klicZak, w, { motiv });
  const cr = klicRodic === klicZak ? cz : novyKontext(j, klicRodic, w, { motiv });
  const vyska = sirkaZak < 768 ? 812 : 900;
  const l = LEKCE.get(j.ids[0]);
  let zakOk = true;
  if (j.typ === 'blok') {
    zakOk = await cz.chran(async () => {
      await w.reset(motiv); await w.role('zak'); await w.viewport(sirkaZak, vyska);
      const r = await zakPruchod(w, cz, urlZak(l.id), { stop: (info) => info.index >= 2 });
      if (r !== 'stop') throw new Error(`blok: žák skončil dřív než u úlohy 3 (${r})`);
    });
    await cr.chran(async () => {
      await w.role('rodic'); await w.viewport(375, 812);
      await w.jdi(urlRodic(l.id));
      await w.pockej(`(__qa.stavRodic().blokBezi || __qa.stavRodic().chyba) && ${NACTENE}`, 'rodič: „Blok na čas běží"');
      const st = await w.js('__qa.stavRodic()');
      if (st.chyba) throw new Error(`rodič blok: chyba stránky „${st.text.slice(0, 120)}"`);
      if (!/Odevzdáno 2 ze 4/.test(st.text)) cr.pridej({ druh: 'blok', zavaznost: 'vazna', obrazovka: 'během bloku', co: `během bloku čekáno „Odevzdáno 2 ze 4", je: „${st.text.slice(0, 140)}"` });
      if (st.postup || st.prepinac || /Ukázat řešení|Typická chyba/.test(st.text)) cr.pridej({ druh: 'blok', zavaznost: 'vazna', obrazovka: 'během bloku', co: 'během bloku rodič vidí tahák / bránu ①–④ / přepínač úloh (R46: jen „mlčte, odevzdáno x ze 4")' });
      await cr.kontrola('během bloku (2 ze 4 odevzdané)');
    });
    await cz.chran(async () => {
      await w.role('zak'); await w.viewport(sirkaZak, vyska);
      await zakPruchod(w, cz, urlZak(l.id, false)); // pokračování rozpracovaného sezení
    });
    await cr.chran(async () => {
      await w.role('rodic'); await w.viewport(375, 812);
      await w.jdi(urlRodic(l.id, false));
      await w.pockej(`(__qa.stavRodic().prepinac || __qa.stavRodic().blokBezi || __qa.stavRodic().chyba) && ${NACTENE}`, 'rodič: po bloku');
      const st = await w.js('__qa.stavRodic()');
      if (st.blokBezi) throw new Error('po odevzdání všech 4 úloh rodič pořád vidí „Blok na čas běží" (čekán sám přechod do procházení)');
      await rodicBezna(w, cr, l, { blok: true });
    });
  } else {
    zakOk = await cz.chran(async () => {
      await w.reset(motiv); await w.role('zak'); await w.viewport(sirkaZak, vyska);
      const r = await zakPruchod(w, cz, urlZak(j.ids[0]));
      if (r === 'konec' && j.typ === 'simulace' && cz.lekceId !== j.ids.at(-1)) throw new Error('simulace skončila před 2. částí');
    });
    if (!zakOk) cr.pridej({ druh: 'tok', zavaznost: 'kosmeticka', obrazovka: 'start', co: 'průchod žáka se zasekl — rodič pracuje s neúplným sezením' });
    await cr.chran(async () => {
      cr.lekceId = j.ids[0];
      await w.role('rodic'); await w.viewport(375, 812);
      if (j.typ === 'simulace') await rodicSimulace(w, cr, j);
      else if (j.typ === 'diagnostika') await rodicDiagnostika(w, cr, j);
      else {
        await w.jdi(urlRodic(l.id));
        await rodicBezna(w, cr, l);
      }
    });
  }
  w.chyby.splice(0).forEach((x) => cr.pridej(x));
  return { cz, cr };
}

// =====================================================================
// Tisk
// =====================================================================
async function tiskSloupec(w, j) {
  const ctx = novyKontext(j, 'tisk', w);
  await ctx.chran(async () => {
    await w.reset('svetly');
    await w.role('rodic');
    await w.viewport(900, 1200);
    await w.jdi(`${WEB}/tisk.html?lekce=${j.ids.join(',')}&dite=${DITE}&lokalne=1`);
    await w.pockej(`(document.querySelector('.tisk-uloha, .tisk-list') && !document.querySelector('[aria-busy=true]') && document.getElementById('tiskTlacitko') && !document.getElementById('tiskTlacitko').disabled) || document.querySelector('.hlaska--varovani')`, 'tisk: načtení listů');
    if (await w.js(`Boolean(document.querySelector('.hlaska--varovani'))`)) ctx.pridej({ druh: 'tok', zavaznost: 'blokujici', co: `tisk ukázal chybu: „${await w.js(`document.querySelector('.hlaska--varovani').innerText.slice(0, 160)`)}"` });
    const pocet = await w.js(`document.querySelectorAll('.tisk-uloha').length`);
    const cekano = j.ids.reduce((s, id) => s + LEKCE.get(id).ulohy.length, 0);
    if (pocet !== cekano) ctx.pridej({ druh: 'tisk', zavaznost: 'vazna', co: `tisk má ${pocet} úloh, lekce ${cekano}` });
    await ctx.kontrola(`tisk ${j.ids.join(' + ')} (obrazovka 900 px)`, { volby: { tisk: true } });
    await w.media('print');
    await w.js('__qa.usadit()');
    await ctx.kontrola(`tisk ${j.ids.join(' + ')} (media print)`, { volby: { tisk: true, print: true } });
    await w.media('');
  });
  await w.media('').catch(() => {});
  w.chyby.splice(0).forEach((x) => ctx.pridej(x));
  return ctx;
}

// =====================================================================
// Jednotka (lekce / simulace)
// =====================================================================
async function projdiJednotku(w, j) {
  const t0 = Date.now();
  const vysledek = { id: j.id, ids: j.ids, typ: j.typ, motivova: j.motivova, sloupce: {} };
  // 1) žák 375 (světlý)
  const c375 = novyKontext(j, 'zak375', w);
  await zakSloupec(w, c375, j, 375);
  vysledek.sloupce.zak375 = c375.vysledek();
  // 2) žák 1280 + rodič 375 na stejném sezení (světlý)
  const { cz, cr } = await zakARodic(w, j, 'zak1280', 'rodic', 1280, 'svetly');
  vysledek.sloupce.zak1280 = cz.vysledek();
  vysledek.sloupce.rodic = cr.vysledek();
  // 3) tisk
  vysledek.sloupce.tisk = (await tiskSloupec(w, j)).vysledek();
  // 4) tmavý motiv: žák 375 + rodič 375
  if (j.motivova) {
    const { cz: tz } = await zakARodic(w, j, 'tmavy', 'tmavy', 375, 'tmavy');
    vysledek.sloupce.tmavy = tz.vysledek();
  }
  vysledek.trvani_s = Math.round((Date.now() - t0) / 1000);
  return vysledek;
}

// =====================================================================
// kontrola-dlazdic.mjs nad všemi lekcemi (souběžně, vlastní porty)
// =====================================================================
function spustKontroluDlazdic(ids) {
  return new Promise((ok) => {
    let vystup = '';
    dlazdiceProces = spawn(process.execPath, [join(KOREN, 'nastroje', 'kontrola-dlazdic.mjs'), `--lekce=${ids.join(',')}`], { cwd: KOREN, stdio: ['ignore', 'pipe', 'pipe'] });
    dlazdiceProces.stdout.on('data', (d) => { vystup += d; });
    dlazdiceProces.stderr.on('data', (d) => { vystup += d; });
    dlazdiceProces.on('close', (kod) => { dlazdiceProces = null; ok({ kod, vystup }); });
  });
}
function rozeberDlazdice(vystup, ids) {
  const radky = vystup.split(/\r?\n/);
  const nalezy = new Map();
  let chyba = null;
  for (const r of radky) {
    if (/^CHYBA:/.test(r)) chyba = r;
    const m = /^(\S+)\s+(\S+)\s+(.+?)\s+sloupce .*?✗ (.+)$/.exec(r);
    if (!m) continue;
    const [, motiv, sirka, kde, chyby] = m;
    const idL = ids.filter((id) => kde.trim() === id || kde.startsWith(`${id}-`)).sort((a, b) => b.length - a.length)[0] || kde.split(' ')[0];
    for (const ch of chyby.split('; ')) {
      const klic = `${kde.trim()}|${ch.replace(/\d+(\.\d+)?px|\d+>\d+|\d+ ?px/g, '#')}`;
      if (!nalezy.has(klic)) nalezy.set(klic, { lekce: idL, kde: kde.trim(), co: ch, kombinace: [] });
      nalezy.get(klic).kombinace.push(`${motiv} ${sirka}`);
    }
  }
  const souhrn = radky.find((r) => /^Kroků s dlaždicemi/.test(r)) || null;
  return { nalezy: [...nalezy.values()], souhrn, chyba };
}

// =====================================================================
// Report
// =====================================================================
function stavSloupce(s) {
  if (!s) return '—';
  const z = new Set(s.nalezy.map((n) => n.zavaznost));
  if (z.has('blokujici') || z.has('vazna')) return '✘';
  if (z.has('kosmeticka')) return '⚠';
  return '✔';
}
function sloucitNalezy(vsechny) {
  const m = new Map();
  for (const n of vsechny) {
    const k = [n.lekce, n.sloupec, n.uloha, n.druh, n.co].join('|');
    if (!m.has(k)) m.set(k, { ...n, pocet: 0, obrazovky: new Set() });
    const x = m.get(k);
    x.pocet += 1;
    x.obrazovky.add(n.obrazovka);
    if (!x.snimek && n.snimek) x.snimek = n.snimek;
  }
  return [...m.values()].map((x) => ({ ...x, obrazovky: [...x.obrazovky] }));
}
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function sestavReport(data) {
  const jednotky = Object.values(data.jednotky).sort((a, b) => PORADI_ID(a.ids[0]).localeCompare(PORADI_ID(b.ids[0])));
  const vsechny = jednotky.flatMap((j) => Object.values(j.sloupce).flatMap((s) => s.nalezy));
  const nalezy = sloucitNalezy(vsechny);
  const podleZav = Object.fromEntries(ZAVAZNOSTI.map((z) => [z, nalezy.filter((n) => n.zavaznost === z)]));
  const obrazovek = jednotky.reduce((s, j) => s + Object.values(j.sloupce).reduce((a, x) => a + x.obrazovek, 0), 0);
  const lekci = jednotky.reduce((s, j) => s + j.ids.length, 0);
  const dl = data.dlazdice;
  const r = [];
  r.push('# QA průchod celé sezóny (lokální režim)');
  r.push('');
  r.push(`Datum: ${data.datum} · nástroj \`nastroje/qa-sezona.mjs\` · obsah ze souborů (\`?lokalne=1\`), databáze = \`nastroje/fake-supabase.js\` (localStorage), požadavky na *supabase.co* zablokované. Nic v \`obsah/\` ani \`web/\` se neměnilo.`);
  r.push('');
  r.push('## Souhrn');
  r.push('');
  r.push(`- Lekcí: **${lekci}** (${jednotky.length} jednotek; simulace = obě části jako jedna jednotka)${data.vynechano?.length ? `; vynecháno (není na disku): ${data.vynechano.join(', ')}` : ''}`);
  r.push(`- Zkontrolovaných obrazovek: **${obrazovek}** (každá = výjimky, console.error, KaTeX, vodorovný scroll, texty undefined/null/NaN/{…}, prázdné vykreslení, obrázky a popisky SVG, dlaždice${jednotky.some((j) => j.motivova) ? ', u motivových lekcí kontrast' : ''})`);
  r.push(`- Nálezů (sloučené stejné): **${nalezy.length}** — blokující **${podleZav.blokujici.length}**, vážné **${podleZav.vazna.length}**, kosmetické **${podleZav.kosmeticka.length}**`);
  if (dl) r.push(`- \`kontrola-dlazdic.mjs\` nad ${dl.lekci} lekcemi (1280/1024/800/375 × světlý/tmavý, rodič 375, tisk): ${dl.nalezy.length ? `**${dl.nalezy.length}** různých problémů` : 'bez chyb'}${dl.souhrn ? ` (${dl.souhrn})` : ''}${dl.chyba ? ` — ${dl.chyba}` : ''}`);
  r.push(`- Doba běhu: ${data.trvani_min} min (${data.paralelne} souběžné kontexty)`);
  r.push('');
  r.push('Legenda: ✔ bez nálezu · ⚠ jen kosmetické · ✘ blokující nebo vážný · — neprobíhá (tmavý motiv jen u jedné lekce každého typu). Pozn.: žák má podle kostry 04 obrazovku min. 1024 px; sloupec Žák 375 je okrajový případ (telefon), rodič 375 je hlavní zařízení rodiče. Vodorovný scroll a přetékající vzorec hlásíme jako vážné (pravidlo E1/R28: „nikdy scroll").');
  r.push('');
  r.push('## Tabulka lekcí');
  r.push('');
  r.push(`| Lekce | Typ | ${SLOUPCE.map(([, n]) => n).join(' | ')} | Nálezy |`);
  r.push(`|---|---|${SLOUPCE.map(() => ':-:').join('|')}|--:|`);
  for (const j of jednotky) {
    const n = sloucitNalezy(Object.values(j.sloupce).flatMap((s) => s.nalezy)).length;
    r.push(`| ${j.ids.join(' + ')} | ${NAZEV_TYPU[j.typ]} | ${SLOUPCE.map(([k]) => stavSloupce(j.sloupce[k])).join(' | ')} | ${n || ''} |`);
  }
  r.push('');
  // opakující se nálezy (stejný text napříč lekcemi)
  const skupiny = new Map();
  for (const n of nalezy) {
    const k = `${n.zavaznost}|${n.druh}|${n.kontext || n.co.replace(/\d+(,\d+)?/g, '#')}`;
    if (!skupiny.has(k)) skupiny.set(k, { ...n, lekce: new Set(), sloupce: new Set(), pocet: 0 });
    const s = skupiny.get(k);
    s.lekce.add(n.lekce);
    s.sloupce.add(NAZEV_SLOUPCE[n.sloupec] || n.sloupec);
    s.pocet += 1;
  }
  const opakovane = [...skupiny.values()].filter((s) => s.lekce.size >= 2).sort((a, b) => ZAVAZNOSTI.indexOf(a.zavaznost) - ZAVAZNOSTI.indexOf(b.zavaznost) || b.lekce.size - a.lekce.size);
  if (opakovane.length) {
    r.push('## Hlavní nálezy seskupené (stejný druh na stejném místě ve 2 a více lekcích)');
    r.push('');
    for (const s of opakovane) {
      r.push(`- **${NAZEV_ZAV[s.zavaznost]}** · ${s.druh}${s.kontext ? ` v ${s.kontext}` : ''} · ${[...s.sloupce].join(', ')} · ${s.lekce.size} lekcí (${[...s.lekce].sort((a, b) => PORADI_ID(a).localeCompare(PORADI_ID(b))).join(', ')}), ${s.pocet} nálezů — příklad: ${esc(s.co)}`);
    }
    r.push('');
  }

  r.push('## Všechny nálezy');
  r.push('');
  r.push('Formát: závažnost · lekce · úloha · sloupec / obrazovka — co přesně (×počet obrazovek) · snímek.');
  for (const z of ZAVAZNOSTI) {
    r.push('');
    r.push(`### ${NAZEV_ZAV[z][0].toUpperCase()}${NAZEV_ZAV[z].slice(1)} (${podleZav[z].length})`);
    r.push('');
    if (!podleZav[z].length) { r.push('Žádné.'); continue; }
    const serazene = podleZav[z].sort((a, b) => PORADI_ID(a.lekce).localeCompare(PORADI_ID(b.lekce)) || SLOUPCE.findIndex(([k]) => k === a.sloupec) - SLOUPCE.findIndex(([k]) => k === b.sloupec));
    for (const n of serazene) {
      const obr = n.obrazovky.length > 2 ? `${n.obrazovky.slice(0, 2).join(', ')} +${n.obrazovky.length - 2}` : n.obrazovky.join(', ');
      r.push(`- ${n.lekce} · ${n.uloha || '—'} · ${NAZEV_SLOUPCE[n.sloupec] || n.sloupec}${n.motiv === 'tmavy' && n.sloupec !== 'tmavy' ? ' (tmavý)' : ''} / ${obr} — ${esc(n.co)}${n.pocet > 1 ? ` (×${n.pocet})` : ''}${n.snimek ? ` · [snímek](obrazky/${n.snimek})` : ''}`);
    }
  }
  if (dl) {
    r.push('');
    r.push('## Dlaždice a vzorce — `kontrola-dlazdic.mjs` nad všemi lekcemi');
    r.push('');
    r.push('Staví DOM dlaždic jako lekce.js pro každý krok s dlaždicemi (1280/1024/800/375 px × světlý/tmavý), kartu rodiče 375 px („Co vidí dítě" + papír) a tisk; bez snímků (stejné měření dělá i průchod výše na živých stránkách, tam se snímky ukládají).');
    r.push('');
    if (!dl.nalezy.length) r.push('Bez chyb.');
    for (const n of dl.nalezy) r.push(`- ${n.lekce} · ${n.kde} — ${esc(n.co)} (${n.kombinace.length}×: ${[...new Set(n.kombinace)].slice(0, 6).join(', ')}${n.kombinace.length > 6 ? ', …' : ''})`);
  }
  r.push('');
  r.push('## Co průchod dělá');
  r.push('');
  r.push('- **Žák 375 a 1280:** „Připrav si" (odškrtne vše) → každý krok SPRÁVNĚ podle JSON (dlaždice se `spravne`, `cislo`/`zlomek`/`smisene`/`vyraz` = `spravne`, `poradi` = první povolené pořadí, `rysovani` = Hotovo) → konec lekce. Hlídá, že správná odpověď je „Správně" (u diagnostiky a simulace jen „Uloženo.", 1 pokus, bez ✔/✘). Simulace: 1. část → „Další část" → 2. část → konec testu (bez skóre pro dítě).');
  r.push('- **Rodič 375** (na sezení žáka 1280): běžná lekce a blok po bloku = každá úloha: „Další" zamčené při otevření (R28), rozbalený tahák (všechny `<details>`, otázky L1–L3), ① Hotovo, ② Nezaseklo se / Všechno sedělo, ③ Hotovo, „Další" dál zamčené, ④ rýsování Sedí + semafor „Vyřešil(a) sám", „Další" odemčené; souhrn, Ukončit lekci. Blok: navíc „během bloku" po 2 odevzdaných úlohách (jen „Odevzdáno 2 ze 4", bez taháku a brány) a po dokončení automatický přechod „Po bloku". Simulace: „Dítě odevzdalo" → potvrzení → Kontrola (vše Ano / Sedí) → souhrn (Orientačně N z 50, bez hranice přijetí). Diagnostika: průběh → Zobrazit výsledek (bez procent, bodů, známek).');
  r.push('- **Tisk:** `tisk.html?lekce=…` (simulace obě části), počet úloh, obrazovka 900 px a `media print` (ovládání skryté, nic nepřetéká list A4).');
  r.push('- **Tmavý motiv:** P1, F1-T01-L1, F2-T01-L1, blok F2-T05-L3, simulace 1 (F2-T08-L3 + L4), diagnostika — žák 375 + rodič 375 v tmavém motivu; u těchto lekcí se v obou motivech měří kontrast textu (nález pod 3 : 1, pod 2 : 1 = vážný).');
  r.push('');
  r.push('## Jak spustit');
  r.push('');
  r.push('```');
  r.push('node nastroje/qa-sezona.mjs                      # celá sezóna (~všechny obsah/lekce/*.json)');
  r.push('node nastroje/qa-sezona.mjs --lekce=P1,F2-T10-L2  # jen vybrané, výsledek se sloučí s minulým během');
  r.push('node nastroje/qa-sezona.mjs --paralelne=2 --bez-dlazdic');
  r.push('```');
  r.push('');
  r.push('Potřebuje Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`, jinak proměnná `CHROME`) a Node 24. Porty 8794 (web) a 9336 (CDP), kontrola-dlazdic 8792/9334. Na konci vypne server i Chrome.');
  return r.join('\n') + '\n';
}

// =====================================================================
// Běh
// =====================================================================
const t0 = Date.now();
let hotovo = 0;
const vysledky = [];
try {
  await mkdir(DIR_OBR, { recursive: true });
  // staré snímky nálezů procházených lekcí pryč (ať v reportu nezůstanou odkazy na neplatné)
  const ids = new Set(JEDNOTKY.flatMap((j) => j.ids));
  for (const f of await readdir(DIR_OBR)) {
    const m = new RegExp(`^${DATUM}-qa-(.+)\\.png$`).exec(f);
    if (m && [...ids].some((id) => m[1].startsWith(`${id.toLowerCase()}-`))) await rm(join(DIR_OBR, f)).catch(() => {});
  }
  console.log(`QA sezóny: ${JEDNOTKY.length} jednotek (${ids.size} lekcí), ${PARALELNE} souběžně${BEZ_DLAZDIC ? '' : ' + kontrola-dlazdic.mjs'}`);
  const dlazdiceSlib = BEZ_DLAZDIC ? null : spustKontroluDlazdic([...ids]);
  const fronta = [...JEDNOTKY];
  const pracovnici = [];
  for (let i = 0; i < Math.min(PARALELNE, fronta.length); i++) { const w = new Pracovnik(i + 1); await w.start(); pracovnici.push(w); }
  await Promise.all(pracovnici.map(async (w) => {
    while (fronta.length) {
      const j = fronta.shift();
      let v;
      try {
        v = await projdiJednotku(w, j);
      } catch (e) {
        v = { id: j.id, ids: j.ids, typ: j.typ, motivova: j.motivova, sloupce: { zak375: { obrazovek: 0, nalezy: [{ lekce: j.ids[0], sloupec: 'zak375', uloha: null, obrazovka: '—', druh: 'tok', zavaznost: 'blokujici', co: `průchod jednotky spadl: ${e.message}` }] } } };
      }
      vysledky.push(v);
      hotovo += 1;
      const z = Object.values(v.sloupce).flatMap((s) => s.nalezy);
      console.log(`  [${String(hotovo).padStart(2)}/${JEDNOTKY.length}] ${j.id.padEnd(22)} ${SLOUPCE.map(([k]) => stavSloupce(v.sloupce[k])).join(' ')}  nálezů ${z.length}  (${v.trvani_s ?? '?'} s, pracovník ${w.cislo})`);
    }
  }));
  let dlazdice = null;
  if (dlazdiceSlib) {
    console.log('  čekám na kontrola-dlazdic.mjs…');
    const { vystup } = await dlazdiceSlib;
    dlazdice = { lekci: ids.size, ...rozeberDlazdice(vystup, [...ids]) };
  }

  if (SEBETEST) {
    const n = vysledky.flatMap((v) => Object.values(v.sloupce).flatMap((x) => x.nalezy));
    const cekane = ['text', 'kontrast', 'vodorovny-scroll', 'console.error', 'spravna-nesedi'];
    for (const d of cekane) console.log(`  ${n.some((x) => x.druh === d) ? '✔' : '✘'} detektor ${d}`);
    process.exitCode = cekane.every((d) => n.some((x) => x.druh === d)) ? 0 : 1;
    throw Object.assign(new Error('sebetest'), { sebetest: true });
  }
  // sloučení s minulým během (--lekce)
  let data = { datum: DATUM, jednotky: {}, dlazdice: null };
  if (VYBER) {
    try { data = JSON.parse(await readFile(SOUBOR_JSON, 'utf8')); } catch { /* první běh */ }
    // jednotky, které už na disku nejsou, pryč
    for (const k of Object.keys(data.jednotky)) if (!data.jednotky[k].ids.every((id) => LEKCE.has(id))) delete data.jednotky[k];
    if (dlazdice && data.dlazdice) {
      const znovu = new Set(dlazdice.nalezy.map((n) => n.lekce));
      dlazdice = { ...dlazdice, lekci: Math.max(data.dlazdice.lekci, dlazdice.lekci), nalezy: [...data.dlazdice.nalezy.filter((n) => !ids.has(n.lekce) && !znovu.has(n.lekce)), ...dlazdice.nalezy], souhrn: data.dlazdice.souhrn };
    }
  }
  for (const v of vysledky) data.jednotky[v.id] = v;
  data.datum = DATUM;
  data.dlazdice = dlazdice || data.dlazdice || null;
  data.paralelne = PARALELNE;
  data.trvani_min = Math.round((Date.now() - t0) / 6000) / 10;
  data.vynechano = ['F2-T10-L4'].filter((x) => !LEKCE.has(x));
  await writeFile(SOUBOR_JSON, JSON.stringify(data, null, 1));
  await writeFile(SOUBOR_MD, sestavReport(data));
  const vse = sloucitNalezy(Object.values(data.jednotky).flatMap((j) => Object.values(j.sloupce).flatMap((s) => s.nalezy)));
  console.log(`\nHotovo za ${data.trvani_min} min. Nálezy: ${ZAVAZNOSTI.map((z) => `${NAZEV_ZAV[z]} ${vse.filter((n) => n.zavaznost === z).length}`).join(', ')}${data.dlazdice ? `; dlaždice (kontrola-dlazdic) ${data.dlazdice.nalezy.length}` : ''}`);
  console.log(`Report: ${SOUBOR_MD.replace(KOREN, '.')}`);
  process.exitCode = vse.some((n) => n.zavaznost !== 'kosmeticka') ? 1 : 0;
} catch (e) {
  if (!e.sebetest) { console.error('CHYBA:', e.stack || e.message); process.exitCode = 2; }
} finally {
  await uklid();
}
