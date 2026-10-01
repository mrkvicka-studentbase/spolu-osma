#!/usr/bin/env node
// =====================================================================
// screenshoty.mjs — snímky průchodu P1 pro vizuální revizi (R24). Jen pro vývoj, nenasazuje se.
//
// Spuštění z kořene repa:
//   node nastroje/screenshoty.mjs pred            → reporty/obrazky/2026-09-24-pred-*.png (obsah z DB)
//   node nastroje/screenshoty.mjs po --lokalne    → …-po-*.png, obsah lekce ze souboru (?lokalne=1)
//   volby: --datum=2026-09-24  --motiv=tmavy|svetly|auto (localStorage spolu.motiv, R26)
//   node nastroje/screenshoty.mjs revize --lokalne --motiv=tmavy
//                                                → reporty/obrazky/2026-09-24-revize-tmavy-*.png
//   --e1     jen lekce žáka: detektiv 1280, P1-U3 k1 1280 a 800 (se zvýrazněnými znaky „25" a „+") a tisk P1
//   --f1tech node nastroje/screenshoty.mjs f1tech --f1tech --datum=2026-09-25 --lekce-navic=<složka s TEST-F1.json>
//            → …-f1tech-*.png: vstup vyraz (náhled, poznámky), obrázek (DOMPurify), poradi (klikání, štítky,
//            přečíslování, dotyk ≥ 40 px, E2 vypnuté) u žáka, rodič „Co vidí dítě" + papír, tisk s kroužky.
//            Obsah jen ze souborů (?lokalne=1), do DB se nic nezapisuje (lekce v DB nejsou → bez ukládání).
//   --b4     node nastroje/screenshoty.mjs b4 --b4 --datum=2026-09-25 → …-b4-*.png: H3 tok přehled → Na papír →
//            tisk ve stejné kartě (Android UA, 375 px; tlačítko tisku ≤ 2 s, window.print) → Zpět k lekci →
//            rodič krok ④; tisk P3 a P4 (obsah ze souboru); manuál 375 světlý/tmavý; Připrav si 375 a 800;
//            žebříček „Platí:" P3/P4 (rodič 375, oba motivy); P1-U3 k1 1280. Na konci sezení → preruseno.
//   --dalsi  navíc landing, registrace, dotazník (375) a admin (1280, účet admin) — revize konzistence
//   Motiv se vkládá za prefix: <datum>-<prefix>-<motiv>-<stránka>.png. Tisk (tisk.html) je vždy světlý.
//
// Jak to funguje (bez závislostí, Node 24 má WebSocket):
// - vlastní statický server z kořene repa (Cache-Control: no-store, ať se nečte stará verze JS),
// - Chrome headless s --remote-debugging-port, CDP přes WebSocket (Target.attachToTarget flatten),
// - přihlášení testovacím účtem rodina_pilot z testy/testovaci-ucty.local.json voláním
//   prihlasit() ze supabase.js v kontextu stránky (heslo se nikam nevypisuje),
// - localStorage role / dítě / manuál přečten, viewport přes Emulation, Page.captureScreenshot celé stránky.
// Zapisuje do testovacího účtu (sezení P1, odpovědi 1. úlohy) a na konci probíhající sezení P1
// označí 'preruseno', aby další běh začínal stejně.
// =====================================================================

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, normalize, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const KOREN = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT_WEB = 8791;
const PORT_CDP = 9333;

const argv = process.argv.slice(2);
const prefix = argv.find((a) => !a.startsWith('--')) || 'pred';
const lokalne = argv.includes('--lokalne');
const dalsi = argv.includes('--dalsi');
const diagPruchod = argv.includes('--diag'); // diagnostika týden 0: žák celá (1280 + 800/375), rodič (průběh, papír, výsledek), tisk, přehled (podvržený katalog)
const odznakyPruchod = argv.includes('--odznaky'); // R61–R63: hotová lekce, celá správně, odznaky, ukazatel postupu, okno Nový odznak
const samoPruchod = argv.includes('--samo'); // R64: lekce bez rodiče — úvod, nápovědy, tip po chybě, konec
const zamky = argv.includes('--zamky'); // zadání 30. 9. (A): přehled pilotní rodiny se zamčenou sezónou — cena jednou, žák bez ceny
const f1tech = argv.includes('--f1tech'); // Fáze 1 technika: vyraz, obrazek, poradi (TEST-F1 z --lekce-navic + F1-T01-L1/L2/L4)
const lekceNavic = argv.find((a) => a.startsWith('--lekce-navic='))?.slice('--lekce-navic='.length) || null;
const b4 = argv.includes('--b4'); // B4 (25. 9.): H3 tok tisku na telefonu, manuál (H1), Připrav si (H2), žebříček P3/P4 (H4), P1-U3 k1
const e1 = argv.includes('--e1'); // E1/E2 (25. 9.): jen lekce žáka (detektiv, P1-U3 k1 na 1280 a 800 + zvýraznění znaků) a tisk
const f2 = argv.includes('--f2'); // Fáze 2 (R38): simulace, blok, rýsování, písmena, tisk archu — vždy bez sítě (fake-supabase.js)
// --blok (R46, 26. 9.): blok na čas u rodiče (během / po bloku, papír), konec bloku u žáka, tisk rýsovacího pole
// F2-T04-L1 (úsečka 5 cm, media print 1 : 1), rámeček zadání F2-T03-L2 U3 na 375 px — vždy bez sítě
//   node nastroje/screenshoty.mjs blok --blok --datum=2026-09-26 → reporty/obrazky/2026-09-26-blok-*.png
const blokPruchod = argv.includes('--blok');
// --bez-site: žádné volání Supabase — supabase-js se nahradí nastroje/fake-supabase.js (DB v localStorage prohlížeče),
// obsah lekcí ze souborů (?lokalne=1). Použitelné i pro výchozí průchod a --diag.
const bezSite = argv.includes('--bez-site') || f2 || blokPruchod || zamky || odznakyPruchod || samoPruchod;
const datum = argv.find((a) => a.startsWith('--datum='))?.split('=')[1] || '2026-09-24';
const motiv = argv.find((a) => a.startsWith('--motiv='))?.split('=')[1] || null;
const cilDir = join(KOREN, 'reporty', 'obrazky');
const predpona = motiv ? `${prefix}-${motiv}` : prefix; // motiv za prefixem (revize-tmavy-…)

const cekej = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------
// Statický server
// ---------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8',
};
const server = createServer(async (req, res) => {
  try {
    const cesta = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
    if (cesta.startsWith('..')) throw new Error('mimo koren');
    // --lekce-navic=<složka>: obsah/lekce/<id>.json, který v repu není, se čte odtud (testovací lekce mimo obsah/)
    const navic = /^obsah[\\/]lekce[\\/]([A-Za-z0-9_-]+\.json)$/.exec(cesta);
    let data = await readFile(join(KOREN, cesta)).catch((e) => {
      if (navic && lekceNavic) return readFile(join(lekceNavic, navic[1]));
      throw e;
    });
    // --bez-site: supabase.js dostane místo klienta z CDN lokální náhradu (žádná síť proti Supabase)
    if (bezSite && /^web[\\/]js[\\/]supabase\.js$/.test(cesta)) {
      data = Buffer.from(String(data).replace(/import \{ createClient \} from '[^']+';/, "import { createClient } from '/nastroje/fake-supabase.js';"));
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(cesta)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('404');
  }
});
await new Promise((r) => server.listen(PORT_WEB, '127.0.0.1', r));
const WEB = `http://127.0.0.1:${PORT_WEB}/web`;

// ---------------------------------------------------------------------
// Chrome + CDP
// ---------------------------------------------------------------------
const profil = join(tmpdir(), `spolu-screenshoty-${Date.now()}`);
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT_CDP}`, `--user-data-dir=${profil}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-color-profile=srgb', 'about:blank',
], { stdio: 'ignore' });

let wsUrl = null;
for (let i = 0; i < 50 && !wsUrl; i++) {
  await cekej(200);
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT_CDP}/json/version`)).json()).webSocketDebuggerUrl; } catch { /* ještě neběží */ }
}
if (!wsUrl) throw new Error('Chrome se nespustil (CDP neodpovídá).');

const ws = new WebSocket(wsUrl);
await new Promise((r, e) => { ws.onopen = r; ws.onerror = e; });
let dalsiId = 1;
const cekajici = new Map();
const posluchaci = new Set();
ws.onmessage = (m) => {
  const zprava = JSON.parse(m.data);
  if (zprava.id && cekajici.has(zprava.id)) {
    const { splnit, zamitnout } = cekajici.get(zprava.id);
    cekajici.delete(zprava.id);
    if (zprava.error) zamitnout(new Error(`${zprava.error.message} ${zprava.error.data || ''}`)); else splnit(zprava.result);
  } else if (zprava.method) {
    for (const fn of posluchaci) fn(zprava);
  }
};
function cdp(method, params = {}, sessionId) {
  const id = dalsiId++;
  ws.send(JSON.stringify({ id, method, params, sessionId }));
  return new Promise((splnit, zamitnout) => cekajici.set(id, { splnit, zamitnout }));
}
function udalost(method, sessionId, timeout = 20000) {
  return new Promise((splnit) => {
    const fn = (z) => { if (z.method === method && z.sessionId === sessionId) { posluchaci.delete(fn); clearTimeout(t); splnit(z.params); } };
    const t = setTimeout(() => { posluchaci.delete(fn); splnit(null); }, timeout);
    posluchaci.add(fn);
  });
}

const { targetId } = await cdp('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true });
const s = (method, params) => cdp(method, params, sessionId);
await s('Page.enable');
await s('Runtime.enable');
posluchaci.add((z) => {
  if (z.sessionId === sessionId && z.method === 'Runtime.exceptionThrown') {
    console.warn('  [stránka] výjimka:', z.params.exceptionDetails?.exception?.description?.split('\n')[0]);
  }
  if (z.sessionId === sessionId && z.method === 'Runtime.consoleAPICalled' && z.params.type === 'error') {
    console.warn('  [stránka] console.error:', z.params.args?.map((a) => a.value ?? a.description).join(' ').slice(0, 200));
  }
});

async function js(vyraz) {
  const r = await s('Runtime.evaluate', { expression: vyraz, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`JS: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
  return r.result.value;
}
async function viewport(sirka, vyska, mobil = false) {
  aktualniViewport = { sirka, vyska, mobil };
  await s('Emulation.setDeviceMetricsOverride', { width: sirka, height: vyska, deviceScaleFactor: 1, mobile: mobil });
}
async function jdiNa(url) {
  const nacteno = udalost('Page.loadEventFired', sessionId);
  await s('Page.navigate', { url });
  await nacteno;
}
/** Počká, až podmínka (JS výraz) platí; pak ještě chvíli na KaTeX/písma. */
async function pockej(podminka, popis, timeout = 20000) {
  const konec = Date.now() + timeout;
  while (Date.now() < konec) {
    if (await js(`Boolean(${podminka})`).catch(() => false)) {
      await js('document.fonts ? document.fonts.ready.then(() => true) : true');
      await cekej(700);
      return;
    }
    await cekej(250);
  }
  throw new Error(`Nedočkal jsem se: ${popis}`);
}
let aktualniViewport = { sirka: 1280, vyska: 900, mobil: false };
async function snimek(nazev) {
  // viewport na celou výšku obsahu → sticky/fixed prvky (spodní lišta) skončí dole, ne uprostřed
  const { sirka, vyska, mobil } = aktualniViewport;
  const { cssContentSize } = await s('Page.getLayoutMetrics');
  const plna = Math.max(vyska, Math.ceil(cssContentSize.height));
  await s('Emulation.setDeviceMetricsOverride', { width: sirka, height: plna, deviceScaleFactor: 1, mobile: mobil });
  await cekej(400);
  const { data } = await s('Page.captureScreenshot', { format: 'png' });
  await viewport(sirka, vyska, mobil);
  const soubor = join(cilDir, `${datum}-${predpona}-${nazev}.png`);
  await writeFile(soubor, Buffer.from(data, 'base64'));
  console.log(`  ✔ ${soubor.replace(KOREN, '.')} (${sirka}×${plna})`);
}

// ---------------------------------------------------------------------
// B4 (25. 9.)
// ---------------------------------------------------------------------
const UA_ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36';
async function telefon(zapnout) {
  await s('Emulation.setUserAgentOverride', zapnout ? { userAgent: UA_ANDROID, platform: 'Android' } : { userAgent: '' });
  await s('Emulation.setTouchEmulationEnabled', { enabled: zapnout, maxTouchPoints: 5 });
}
async function uloz(data, nazev, popis) {
  const soubor = join(cilDir, `${datum}-${predpona}-${nazev}.png`);
  await writeFile(soubor, Buffer.from(data, 'base64'));
  console.log(`  ✔ ${soubor.replace(KOREN, '.')} (${popis})`);
}
/** Snímek jen oblasti prvku (selektor) s okrajem 8 px. */
async function snimekPrvku(selektor, nazev) {
  const { sirka, vyska, mobil } = aktualniViewport;
  const { cssContentSize } = await s('Page.getLayoutMetrics');
  await s('Emulation.setDeviceMetricsOverride', { width: sirka, height: Math.max(vyska, Math.ceil(cssContentSize.height)), deviceScaleFactor: 1, mobile: mobil });
  await cekej(400);
  const r = await js(`(() => { const b = document.querySelector(${JSON.stringify(selektor)}).getBoundingClientRect(); return { x: b.x + scrollX, y: b.y + scrollY, w: b.width, h: b.height }; })()`);
  const o = 8;
  const { data } = await s('Page.captureScreenshot', { format: 'png', clip: { x: Math.max(0, r.x - o), y: Math.max(0, r.y - o), width: r.w + 2 * o, height: r.h + 2 * o, scale: 1 } });
  await viewport(sirka, vyska, mobil);
  await uloz(data, nazev, `prvek ${Math.round(r.w)}×${Math.round(r.h)}`);
}
/** Snímek jen viditelného okna (bez natažení na výšku obsahu — sticky rámečky s max-height v vh zůstanou, jak jsou). */
async function snimekOkna(nazev) {
  const { data } = await s('Page.captureScreenshot', { format: 'png' });
  await uloz(data, nazev, `${aktualniViewport.sirka}×${aktualniViewport.vyska}, okno`);
}
/** Otevřený modal celý: panel bez max-height, viewport natažený na jeho výšku. */
async function snimekModalu(nazev) {
  const { sirka, vyska, mobil } = aktualniViewport;
  const vyskaPanelu = await js(`(() => { const p = document.querySelector('dialog[open] .modal__panel'); p.style.maxHeight = 'none'; return Math.ceil(p.scrollHeight); })()`);
  await s('Emulation.setDeviceMetricsOverride', { width: sirka, height: Math.max(vyska, vyskaPanelu + 40), deviceScaleFactor: 1, mobile: mobil });
  await cekej(500);
  const { data } = await s('Page.captureScreenshot', { format: 'png' });
  await viewport(sirka, vyska, mobil);
  await uloz(data, nazev, `${sirka}×${vyskaPanelu + 40}, modal`);
}
const motivStranky = (m) => js(`localStorage.setItem('spolu.motiv', ${JSON.stringify(m)}); true`);
const DNES_JS = `(() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })()`;

/** Odpovídá správně v lekci P1 (obsah ze souboru), dokud karta úlohy neodpovídá regulárnímu výrazu. */
const ODPOVIDEJ_P1 = (cil) => `(async () => {
    const { nactiLekciObsah } = await import('./js/obsah.js');
    const lekce = await nactiLekciObsah('P1');
    const cekej = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 14; i++) {
      if (${cil}.test(document.querySelector('.karta-ulohy')?.textContent || '')) return true;
      const sekce = document.querySelector('.krok:not(.krok--hotovy)');
      if (!sekce) { [...document.querySelectorAll('button')].find((b) => /Další úloha/.test(b.textContent))?.click(); await cekej(500); continue; }
      const [, ulohaId, krokId] = /^popisek-(.+)-([^-]+)$/.exec(sekce.querySelector('.krok__popisek').id);
      const krok = lekce.ulohy.find((u) => u.id === ulohaId).kroky.find((k) => k.id === krokId);
      const t = krok.vstup.typ;
      if (t === 'dlazdice') sekce.querySelector('[data-id="' + krok.vstup.moznosti.find((m) => m.spravne).id + '"]').click();
      else { const sp = krok.spravne; const h = t === 'cislo' ? [sp.hodnota] : t === 'zlomek' ? [sp.c, sp.j] : [sp.cela, sp.c, sp.j];
        [...sekce.querySelectorAll('input.pole')].forEach((p, j) => { p.value = String(h[j]); }); }
      [...sekce.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
      await cekej(500);
    }
    return true; })()`;

async function pruchodB4(dite, nastav) {
  const DITE = JSON.stringify(dite.id);
  const prerusitVse = () => js(`import('./js/supabase.js').then(async (m) => {
    const { data } = await m.supabase.from('sezeni').update({ stav: 'preruseno' })
      .eq('dite_id', ${DITE}).eq('stav', 'probiha').select('id');
    return (data || []).length; })`);
  console.log(`  přerušeno dřívějších sezení: ${await prerusitVse()}`);
  const kontroly = [];
  const over = (podminka, popis) => { kontroly.push(`${podminka ? '✔' : '✘'} ${popis}`); if (!podminka) process.exitCode = 1; };
  try {
    // --- H3: přehled → Začít lekci (P3) → Na papír → tisk ve stejné kartě → Zpět k lekci → rodič krok ④
    await nastav('rodic');
    await motivStranky('tmavy'); // Pavel testoval v tmavém režimu
    await viewport(375, 812, true);
    await telefon(true);
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled');
    await js(`(() => { const k = [...document.querySelectorAll('.karta-lekce')].find((x) => /Zlomky — základ/.test(x.textContent));
      [...k.querySelectorAll('button')].find((b) => /Začít lekci|Projít znovu/.test(b.textContent)).click(); return true; })()`);
    await pockej(`document.querySelector('#modalRezim[open]')`, 'modal režimu');
    const pocetKaret = async () => (await cdp('Target.getTargets')).targetInfos.filter((t) => t.type === 'page').length;
    const karetPred = await pocetKaret();
    const nactenTisk = udalost('Page.loadEventFired', sessionId);
    const t0 = Date.now();
    await s('Runtime.evaluate', { expression: `document.querySelector('[data-rezim=papir]').click()`, userGesture: true });
    await nactenTisk;
    const url = await js('location.href');
    over(/\/tisk\.html\?/.test(url) && /zpet=rodic\.html/.test(decodeURIComponent(url)), `Na papír → tisk.html ve stejné kartě (${decodeURIComponent(url.replace(WEB, '')).replace(/[0-9a-f-]{36}/g, '…')})`);
    over(await pocetKaret() === karetPred, 'žádná nová karta (window.open)');
    over(await js(`Boolean(document.getElementById('tiskTlacitko'))`), 'tlačítko tisku vidět hned z HTML');
    let povoleno = null;
    for (let i = 0; i < 80; i++) {
      if (await js(`document.getElementById('tiskTlacitko').disabled === false`)) { povoleno = Date.now() - t0; break; }
      await cekej(100);
    }
    const ulohy = await js(`document.querySelectorAll('.tisk-uloha').length`);
    over(povoleno !== null && ulohy === 4, `tlačítko tisku povoleno ${povoleno} ms od kliknutí na „Na papír" (načtení + nejvýš 2 s na písma), úloh ${ulohy}`);
    const tisk = await js(`(() => { let volano = 0; const puvodni = window.print; window.print = () => { volano += 1; };
      document.getElementById('tiskTlacitko').click(); window.print = puvodni;
      return { volano, chyba: document.querySelector('.hlaska--varovani')?.textContent || null }; })()`);
    over(tisk.volano === 1 && !tisk.chyba, 'klik na „Vytisknout / Uložit jako PDF" zavolal window.print() bez chyby');
    over(/Zpět k lekci/.test(await js(`document.getElementById('tiskZpet').textContent`)), 'nahoře „Zpět k lekci"');
    await snimek('tisk-p3-db-telefon-375');
    const nactenRodic = udalost('Page.loadEventFired', sessionId);
    await js(`document.getElementById('tiskZpet').click(); true`);
    await nactenRodic;
    await pockej(`document.querySelector('.prepinac-uloh') && ${nactene}`, 'rodič po návratu');
    await js(`document.querySelectorAll('dialog[open]').forEach((d) => d.close()); true`);
    const rodic = await js(`({ url: location.pathname.split('/').pop() + location.search, papir: /Výsledek dítěte/.test(document.body.textContent),
      odkaz: [...document.querySelectorAll('a')].some((a) => /tisk\\.html/.test(a.href)) })`);
    over(/rodic\.html\?.*rezim=papir/.test(rodic.url) && rodic.papir, `Zpět k lekci → rodic.html (rezim=papir), krok ④ „Výsledek dítěte" na stránce`);
    over(rodic.odkaz, 'rodič v režimu papír má odkaz „Úlohy k tisku" (stejná karta)');
    await snimek('rodic-p3-papir-po-tisku-375');
    // chyba načtení = čitelná hláška, ne bílá stránka
    await jdiNa(`${WEB}/tisk.html?lekce=NEEXISTUJE&dite=${dite.id}&zpet=prehled.html`);
    await pockej(`document.querySelector('.hlaska--varovani')`, 'hláška chyby tisku');
    over(true, `chyba načtení tisku → „${(await js(`document.querySelector('.hlaska--varovani strong').textContent`)).slice(0, 70)}…"`);
    await snimek('tisk-chyba-375');

    // --- tisk P3 a P4 se zlomky (obsah ze souboru), telefon 375
    for (const l of ['P3', 'P4']) {
      await jdiNa(`${WEB}/tisk.html?lekce=${l}&dite=${dite.id}&lokalne=1&zpet=${encodeURIComponent(`rodic.html?lekce=${l}&rezim=papir`)}`);
      await pockej(`document.querySelector('.tisk-uloha') && ${nactene} && !document.getElementById('tiskTlacitko').disabled`, `tisk ${l}`);
      await snimek(`tisk-${l.toLowerCase()}-telefon-375`);
    }
    await telefon(false);

    // --- H4: žebříček „Platí:" P3 a P4 (rodič 375, obsah ze souboru), oba motivy
    for (const m of ['svetly', 'tmavy']) {
      await motivStranky(m);
      for (const l of ['P3', 'P4']) {
        await jdiNa(`${WEB}/rodic.html?lekce=${l}&dite=${dite.id}&rezim=app&lokalne=1`);
        await pockej(`document.querySelector('.zebricek') && ${nactene}`, `rodič ${l}`);
        await js(`document.querySelectorAll('dialog[open]').forEach((d) => d.close());
          document.querySelector('.uvod-lekce').closest('details')?.setAttribute('open', ''); true`);
        await snimekPrvku('.uvod-lekce', `zebricek-${l.toLowerCase()}-${m}-375`);
        if (l === 'P3') {
          await js(`document.querySelectorAll('#obsah details').forEach((d) => { d.open = true; }); true`);
          await cekej(400);
          await snimek(`rodic-p3-rozbaleno-${m}-375`);
        }
      }
    }

    // --- H1: manuál 375 světlý + tmavý
    for (const m of ['svetly', 'tmavy']) {
      await motivStranky(m);
      await jdiNa(`${WEB}/prehled.html`);
      await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled');
      await js(`import('./js/menu.js').then((mm) => { mm.otevritManual(); return true; })`);
      await pockej(`document.querySelector('#modalManual[open] .manual-blok')`, 'manuál');
      over(await js(`document.querySelectorAll('#modalManual .manual-blok').length`) >= 8, `manuál (${m}): bloky vykreslené`);
      await snimekModalu(`manual-${m}-375`);
    }

    // --- H2: Připrav si (žák) 375 a 800; po potvrzení se týž den (ani po obnovení) neukáže
    await nastav('zak');
    await motivStranky('svetly');
    await js(`localStorage.removeItem('spolu.pripraveno.P1'); true`);
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/lekce.html?lekce=P1&dite=${dite.id}&rezim=app&lokalne=1`);
    await pockej(`document.querySelector('.pripravit')`, 'Připrav si');
    over(await js(`!document.querySelector('.krok') && document.querySelector('.pripravit .tlacitko--primarni').disabled`),
      'Připrav si: před 1. úlohou, tlačítko zamčené');
    await snimek('pripravit-375');
    await viewport(800, 1100, true);
    await js(`document.querySelectorAll('.pripravit input')[0].click(); true`);
    await cekej(300);
    await snimek('pripravit-tablet-800');
    await js(`document.querySelectorAll('.pripravit input').forEach((i) => { if (!i.checked) i.click(); }); true`);
    over(await js(`!document.querySelector('.pripravit .tlacitko--primarni').disabled`), 'Připrav si: po odškrtnutí všeho tlačítko odemčené');
    await js(`document.querySelector('.pripravit .tlacitko--primarni').click(); true`);
    await pockej(`document.querySelector('.krok')`, '1. úloha po potvrzení');
    over(await js(`localStorage.getItem('spolu.pripraveno.P1') === ${DNES_JS}`), 'Připrav si: potvrzení uloženo (lekce × dnešní datum)');
    await jdiNa(`${WEB}/lekce.html?lekce=P1&dite=${dite.id}&lokalne=1`);
    await pockej(`document.querySelector('.krok')`, 'obnovení lekce');
    over(await js(`!document.querySelector('.pripravit')`), 'Připrav si: po obnovení týž den se neukazuje');

    // --- B3 drobnost: P1-U3 k1 na 1280
    await viewport(1280, 900);
    await jdiNa(`${WEB}/lekce.html?lekce=P1&dite=${dite.id}&rezim=app&lokalne=1`);
    await pockej(`document.querySelector('.krok')`, 'lekce P1');
    await js(ODPOVIDEJ_P1('/přijímaček/'));
    await pockej(`document.querySelector('.krok:not(.krok--hotovy) .dlazdice')`, 'P1-U3 k1');
    over(await js(`!document.querySelector('.krok:not(.krok--hotovy) .dlazdice-mrizka').classList.contains('dlazdice-mrizka--jeden-sloupec')`), 'P1-U3 k1 na 1280 px: 2 sloupce');
    await js('window.scrollTo(0, 0); true');
    await snimek('lekce-p1-u3-k1-1280');
  } finally {
    await telefon(false).catch(() => {});
    console.log(`  úklid: přerušeno sezení: ${await prerusitVse().catch((e) => e.message)}`);
    console.log(kontroly.map((k) => `  ${k}`).join('\n'));
  }
}

// ---------------------------------------------------------------------
// Fáze 1 technika (vyraz, obrazek, poradi)
// ---------------------------------------------------------------------
const JS_KROK = `document.querySelector('.krok:not(.krok--hotovy)')`;
/** Napíše výraz do pole aktivního kroku a odevzdá; vrátí text zpětné vazby. */
const odevzdejVyraz = (text) => js(`(async () => {
  const k = ${JS_KROK}; const p = k.querySelector('.pole--vyraz');
  p.value = ${JSON.stringify(text)}; p.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 150));
  const nahled = k.querySelector('.vyraz-nahled')?.textContent || '';
  [...k.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
  await new Promise((r) => setTimeout(r, 300));
  return { nahled, vazba: k.querySelector('.zpetna-vazba')?.textContent || '' }; })()`);
/** Klikne na operace (id) v aktivním kroku poradi; vrátí mapu id → štítek. */
const klikniOperace = (ids) => js(`(async () => {
  const k = ${JS_KROK};
  for (const id of ${JSON.stringify(ids)}) {
    const m = k.querySelector('[data-op="' + id + '"]');
    const r = m.getBoundingClientRect();
    // skutečný cíl kliknutí ve středu místa (ověří, že klik dostane nejvnitřnější operace, ne vrstvy KaTeX)
    const cil = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('[data-op]');
    (cil || m).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }
  return Object.fromEntries([...k.querySelectorAll('[data-op]')].map((m) => [m.dataset.op, m.querySelector(':scope > .poradi__stitek')?.textContent || ''])); })()`);
/**
 * Rodič: projde bránu ①–④ (R28) aktuální úlohy — kroky ①–③ odškrtne, semafor „Sám/sama“ — a pak klikne
 * „Další úloha“. Bez toho je „Další“ zamčené (stejná logika jako rodicKroky/rodicSemafor v qa-sezona.mjs).
 */
const rodicDalsiUloha = async () => {
  await js(`(async () => {
    const spi = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const krok of ['cteni', 'otazky', 'otocena']) {
      const li = document.querySelector('.postup-rodice__krok[data-krok="' + krok + '"]');
      if (!li) continue;
      li.querySelector('details').open = true;
      const b = krok === 'otazky'
        ? [...li.querySelectorAll('.postup-rodice__akce button')].at(-1)
        : [...li.querySelectorAll('.postup-rodice__obsah > button.tlacitko--primarni')].at(-1);
      b?.click();
      await spi(150);
    }
    const sem = document.querySelector('.postup-rodice__krok[data-krok="semafor"]');
    if (sem) sem.querySelector('details').open = true;
    const rys = sem?.querySelector('button[data-hodnota="sedi"]');
    if (rys) { rys.click(); await spi(300); }
    document.querySelector('.semafor-volba[data-volba="sam"]')?.click();
    for (let k = 0; k < 60; k++) { await spi(100); const d = document.querySelector('#spodniLista button.tlacitko--primarni'); if (d && !d.disabled) break; }
    document.querySelectorAll('#obsah details').forEach((d) => { d.open = false; });
    [...document.querySelectorAll('#spodniLista button')].find((b) => /Další úloha/.test(b.textContent))?.click();
    window.scrollTo(0, 0);
    return true;
  })()`);
};

const dalsiUloha = async () => {
  await js(`[...document.querySelectorAll('button')].find((b) => /Další úloha/.test(b.textContent))?.click(); true`);
  await cekej(600);
};

async function pruchodF1tech(dite, nastav) {
  const kontroly = [];
  const over = (podminka, popis) => { kontroly.push(`${podminka ? '✔' : '✘'} ${popis}`); if (!podminka) process.exitCode = 1; };
  const pripraveno = () => js(`['TEST-F1', 'F1-T01-L1', 'F1-T01-L2', 'F1-T01-L4'].forEach((l) => localStorage.setItem('spolu.pripraveno.' + l, ${DNES_JS})); true`);
  try {
    // --- žák 1280, TEST-F1: obrázek + vyraz
    await nastav('zak');
    await pripraveno();
    await motivStranky('svetly');
    await viewport(1280, 900);
    await jdiNa(`${WEB}/lekce.html?lekce=TEST-F1&dite=${dite.id}&rezim=app&lokalne=1`);
    await pockej(`document.querySelector('.krok .pole--vyraz')`, 'TEST-F1 U1');
    const svg = await js(`(() => { const s = document.querySelector('.karta-ulohy .obrazek-ulohy svg');
      return s && { label: s.getAttribute('aria-label'), script: Boolean(s.querySelector('script')), image: Boolean(s.querySelector('image')), barva: getComputedStyle(s.querySelector('rect')).stroke }; })()`);
    over(svg && !svg.script && !svg.image && /Obdélník/.test(svg.label), `obrázek u žáka: SVG vykreslené, <script> i <image> odstraněné (DOMPurify), aria-label = obrazek_popis`);
    let r = await odevzdejVyraz('x + 16');
    over(/nesedí/i.test(r.vazba), `vyraz „x + 16" (známá chyba) → nesedí: „${r.vazba}"`);
    r = await odevzdejVyraz('x+x+16·2');
    over(/zjednoduš/.test(r.vazba) && /x\+x\+16/.test(r.nahled.replace(/\s|⋅/g, '').replace('·', '')), `vyraz „x+x+16·2" → „${r.vazba}" (náhled „${r.nahled.trim()}")`);
    await js('window.scrollTo(0, 0); true');
    await snimek('vyraz-obrazek-zak-1280');
    await dalsiUloha();
    await pockej(`${JS_KROK}?.querySelector('.pole--vyraz')`, 'TEST-F1 U2');
    r = await odevzdejVyraz('2(x+3)');
    over(/roznásob/.test(r.vazba), `bez_zavorek: „2(x+3)" → „${r.vazba}"`);
    await dalsiUloha();
    // --- poradi (TEST-F1 U3 = F1-T01-L2-U3 k1)
    await pockej(`${JS_KROK}?.querySelector('[data-op]')`, 'TEST-F1 U3 poradi');
    const e2 = await js(`document.querySelectorAll('.poradi .zvyraznitelne').length`);
    over(e2 === 0, 'poradi: v kroku není zvýrazňování E2');
    const plocha = await js(`[...${JS_KROK}.querySelectorAll('[data-op]')].map((m) => { const s = getComputedStyle(m, '::before'); return Math.min(parseFloat(s.width), parseFloat(s.height)); })`);
    over(plocha.every((x) => x >= 40), `poradi: dotyková plocha operací ≥ 40 px (${plocha.map(Math.round).join(', ')})`);
    let st = await klikniOperace(['o2', 'o1', 'o4']);
    over(st.o2 === '1' && st.o1 === '2' && st.o4 === '3', `štítky po kliknutí o2, o1, o4: ${JSON.stringify(st)}`);
    st = await klikniOperace(['o2']);
    over(st.o2 === '' && st.o1 === '1' && st.o4 === '2', `zrušení o2 → přečíslování: ${JSON.stringify(st)}`);
    const neuplne = await js(`(async () => { const k = ${JS_KROK}; [...k.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
      await new Promise((r) => setTimeout(r, 200)); return k.querySelector('.zpetna-vazba').textContent; })()`);
    over(/všechny/.test(neuplne), `neúplné pořadí → „${neuplne}" (nepočítá se jako pokus)`);
    await klikniOperace(['o3', 'o2', 'o5']); // o1, o4, o3, o2, o5 = špatně (bez kódu)
    const nesedi = await js(`(async () => { const k = ${JS_KROK}; [...k.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
      await new Promise((r) => setTimeout(r, 300));
      return { vazba: k.querySelector('.zpetna-vazba').textContent, stitky: k.querySelectorAll('.poradi__stitek').length,
        zvyrazneno: k.querySelectorAll('.je-nesedi, .je-spravne').length }; })()`);
    over(/nesedí/.test(nesedi.vazba) && nesedi.stitky === 5 && nesedi.zvyrazneno === 0, `chybné pořadí → „${nesedi.vazba}", štítky zůstaly (${nesedi.stitky}), nic zvýrazněno`);
    await js('window.scrollTo(0, 0); true');
    await snimek('poradi-zak-nesedi-1280');
    await js(`[...${JS_KROK}.querySelectorAll('button')].find((b) => /Začít znovu/.test(b.textContent)).click(); true`);
    await klikniOperace(['o4', 'o2', 'o1', 'o3', 'o5']);
    const ok = await js(`(async () => { const k = ${JS_KROK}; [...k.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
      await new Promise((r) => setTimeout(r, 300)); return document.querySelectorAll('.krok--hotovy .poradi.je-spravne').length; })()`);
    over(ok === 1, 'povolené pořadí o4, o2, o1, o3, o5 (ne první v seznamu) → správně');
    await js('window.scrollTo(0, 0); true');
    await snimek('poradi-zak-spravne-1280');

    // --- skutečné lekce F1-T01 (L1 odmocnina, L4 závorka + dvě mocniny) na telefonu, tmavý motiv
    await motivStranky('tmavy');
    await viewport(375, 812, true);
    await telefon(true);
    await jdiNa(`${WEB}/lekce.html?lekce=F1-T01-L1&dite=${dite.id}&rezim=app&lokalne=1`);
    await pockej(`document.querySelector('.krok')`, 'F1-T01-L1');
    await js(ODPOVIDEJ_LEKCI('F1-T01-L1', '/přijímaček/'));
    await pockej(`${JS_KROK}?.querySelector('[data-op]')`, 'L1-U3 poradi');
    st = await klikniOperace(['o1', 'o2']);
    over(st.o1 === '1' && st.o2 === '2' && st.o3 === '', `L1: klik na exponent a minus uvnitř odmocniny trefí vnitřní operace: ${JSON.stringify(st)}`);
    await js(`${JS_KROK}.scrollIntoView(); true`);
    await snimek('poradi-l1-tmavy-375');
    await jdiNa(`${WEB}/lekce.html?lekce=F1-T01-L4&dite=${dite.id}&rezim=app&lokalne=1`);
    await pockej(`${JS_KROK}?.querySelector('[data-op]')`, 'L4-U1 k1');
    await klikniOperace(['o3', 'o2']);
    await snimek('poradi-l4-k1-tmavy-375');
    await telefon(false);

    // --- rodič 375 (karta z rodic-karta.js jako v kontrola-dlazdic): Co vidí dítě + papír
    for (const m of ['svetly', 'tmavy']) {
      await motivStranky(m);
      await viewport(375, 812, true);
      await jdiNa(`${WEB}/nahled-obsahu.html?lekce=TEST-F1&lokalne=1`);
      await pockej(`document.querySelector('main')`, 'náhled');
      for (const [ui, nazev] of [[0, 'obrazek-vyraz'], [2, 'poradi']]) {
        await js(`(async () => {
          const o = await import('./js/obsah.js'); const { el } = await import('./js/ui.js'); const karta = await import('./js/rodic-karta.js');
          await o.nacistKnihovny();
          const l = await o.nactiLekciObsah('TEST-F1', { lokalne: true });
          const u = l.ulohy[${ui}];
          const s = { lekce: l, sezeni: { id: 'x' }, ulohaIndex: ${ui}, odpovedi: [], barvy: {}, volby: {}, poznamkySemafor: {}, pokusRodice: {}, otevrenoOtazek: new Map(), jenCteni: false, rezim: 'papir', poUlohach: {} };
          karta.uklidRozlozeni();
          const obsah = karta.vytvorKartuUlohy(s, u, { semafor: el('section'), papir: karta.vytvorPapir(s, u, async () => {}) });
          document.body.replaceChildren(el('div', { class: 'stranka-rodic' }, el('main', { class: 'stranka-rodic__obsah' }, obsah)));
          for (const d of document.querySelectorAll('.postup-rodice__detail, .rozbalovaci')) d.open = true;
          await document.fonts.ready; await new Promise((r) => setTimeout(r, 300)); return true; })()`);
        if (ui === 0) {
          await js(`(() => { const p = document.querySelector('.pole--vyraz'); p.value = '2x + 32'; p.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
          const rodic = await js(`({ popis: document.querySelector('.obrazek-ulohy__popis')?.textContent || '', nahled: document.querySelector('.vyraz-nahled')?.textContent || '' })`);
          if (m === 'svetly') over(/Na obrázku/.test(rodic.popis) && /2x/.test(rodic.nahled), `rodič: obrázek s popisem „${rodic.popis.slice(0, 40)}…", papír vyraz s náhledem`);
        } else if (m === 'svetly') {
          const p = await js(`({ bloky: document.querySelectorAll('.poradi--nahled').length, stitky: document.querySelectorAll('.poradi--nahled .poradi__stitek').length, sedi: /Sedí/.test(document.body.textContent) && /Nesedí/.test(document.body.textContent) })`);
          over(p.sedi && p.stitky >= 15, `rodič papír poradi: ${p.bloky - 1} povolená pořadí se štítky (${p.stitky}), tlačítka Sedí / Nesedí; „Co vidí dítě" bez štítků`);
        }
        await snimek(`rodic-${nazev}-${m}-375`);
      }
    }

    // --- R34: rodič (aplikace) u kroku poradi F1-T01-L2-U3 — dítě klikalo známou chybu; „Správně: …" z dat
    await motivStranky('svetly');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/nahled-obsahu.html?lekce=F1-T01-L2&lokalne=1`);
    await pockej(`document.querySelector('main')`, 'náhled L2');
    const r34 = await js(`(async () => {
      const o = await import('./js/obsah.js'); const { el } = await import('./js/ui.js'); const karta = await import('./js/rodic-karta.js');
      await o.nacistKnihovny();
      const l = await o.nactiLekciObsah('F1-T01-L2', { lokalne: true });
      const u = l.ulohy[2];
      const odp = { uloha_id: u.id, krok_id: 'k1', hodnota: ['o1', 'o2', 'o4', 'o3', 'o5'], spravne: false, typ_chyby: 'nasobil-pred-mocninou', pokus: 2 };
      const s = { lekce: l, sezeni: { id: 'x' }, ulohaIndex: 2, odpovedi: [odp], barvy: {}, volby: {}, poznamkySemafor: {}, pokusRodice: {},
        otevrenoOtazek: new Map(), jenCteni: false, rezim: 'app', poUlohach: { [u.id]: { k1: odp } }, posledniAktualizace: new Date() };
      karta.uklidRozlozeni();
      document.body.replaceChildren(el('div', { class: 'stranka-rodic' }, el('main', { class: 'stranka-rodic__obsah' },
        karta.vytvorStavZaka(s, u, () => {}), karta.vytvorKartuUlohy(s, u, { semafor: el('section') }))));
      const co = document.querySelector('.postup-rodice__detail'); if (co) co.open = true;
      const det = [...document.querySelectorAll('.rozbalovaci')].find((d) => /Co vidí dítě/.test(d.textContent)); if (det) det.open = true;
      await document.fonts.ready; await new Promise((r) => setTimeout(r, 300));
      const stav = document.querySelector('.stav-zaka').textContent;
      return { dite: /Dítě klikalo:\\s*① násobení šestnácti → ② mocnina/.test(stav), chyba: /Násobil dřív, než umocnil/.test(stav),
        spravne: /Správně:\\s*① mocnina → ② násobení šestnácti/.test(stav), i: (document.body.textContent.match(/Správně je i:/g) || []).length }; })()`);
    over(r34.dite && r34.chyba && r34.spravne && r34.i >= 2, `R34: „Dítě klikalo" s popisy, „Typická chyba: Násobil dřív, než umocnil", „Správně: ① mocnina → …" + „Správně je i" (${r34.i}×)`);
    await snimek('rodic-poradi-r34-375');

    // --- žebříček „Platí:" F1-T01-L2 (dlouhý znak „a = −3") na 375, oba motivy — nesmí přetékat (R33)
    for (const m of ['svetly', 'tmavy']) {
      await motivStranky(m);
      await viewport(375, 812, true);
      await jdiNa(`${WEB}/nahled-obsahu.html?lekce=F1-T01-L2&lokalne=1`);
      await pockej(`document.querySelector('main')`, 'náhled L2');
      const z = await js(`(async () => {
        const o = await import('./js/obsah.js'); const { el } = await import('./js/ui.js'); const karta = await import('./js/rodic-karta.js');
        await o.nacistKnihovny();
        const l = await o.nactiLekciObsah('F1-T01-L2', { lokalne: true });
        document.body.replaceChildren(el('div', { class: 'stranka-rodic' }, el('main', { class: 'stranka-rodic__obsah' }, karta.vytvorUvod(l))));
        await document.fonts.ready; await new Promise((r) => setTimeout(r, 300));
        return [...document.querySelectorAll('.zebricek__krok')].map((k) => {
          const zn = k.querySelector('.zebricek__znak').getBoundingClientRect(); const tx = k.querySelector('.zebricek__text').getBoundingClientRect();
          const kr = k.getBoundingClientRect();
          return { preteka: k.scrollWidth > k.clientWidth + 1 || zn.right > tx.left + 0.5 || tx.right > kr.right + 0.5, znakX: Math.round(zn.left), textX: Math.round(tx.left) };
        }); })()`);
      over(z.every((r) => !r.preteka) && new Set(z.map((r) => r.textX)).size === 1,
        `žebříček L2 (${m}, 375): nic nepřetéká, text ve všech řádcích od stejného místa (${z.map((r) => r.textX).join(', ')})`);
      await snimekPrvku('.uvod-lekce', `zebricek-l2-${m}-375`);
    }

    // --- tisk: TEST-F1 (kroužky, obrázek 60 mm) a F1-T01-L2
    await motivStranky('svetly');
    await viewport(900, 1200);
    await jdiNa(`${WEB}/tisk.html?lekce=TEST-F1&lokalne=1`);
    await pockej(`document.querySelector('.tisk-uloha') && ${nactene} && !document.getElementById('tiskTlacitko').disabled`, 'tisk TEST-F1');
    const t = await js(`({ kruzky: document.querySelectorAll('.tisk-uloha [data-op]').length, pokyn: /Očísluj, v jakém pořadí počítáš/.test(document.body.textContent),
      sirka: document.querySelector('.obrazek-ulohy--tisk svg')?.getBoundingClientRect().width, mm: document.querySelector('.tisk-list').getBoundingClientRect().width / 210 })`);
    over(t.kruzky === 5 && t.pokyn, `tisk: 5 kroužků nad operacemi a pokyn „Očísluj…"`);
    over(t.sirka && t.sirka / t.mm <= 60.5, `tisk: obrázek ${Math.round(t.sirka / t.mm)} mm (max 60)`);
    await snimek('tisk-test');
    await jdiNa(`${WEB}/tisk.html?lekce=F1-T01-L2&lokalne=1`);
    await pockej(`document.querySelector('.tisk-uloha') && ${nactene}`, 'tisk L2');
    await snimek('tisk-f1-t01-l2');
  } finally {
    await telefon(false).catch(() => {});
    console.log(kontroly.map((k) => `  ${k}`).join('\n'));
  }
}

/** Jako ODPOVIDEJ_P1, pro libovolnou lekci ze souboru; kroky poradi odpoví prvním povoleným pořadím. */
const ODPOVIDEJ_LEKCI = (lekceId, cil) => `(async () => {
    const { nactiLekciObsah } = await import('./js/obsah.js');
    const lekce = await nactiLekciObsah(${JSON.stringify(lekceId)}, { lokalne: true });
    const cekej = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 16; i++) {
      if (${cil}.test(document.querySelector('.karta-ulohy')?.textContent || '')) return true;
      const sekce = document.querySelector('.krok:not(.krok--hotovy)');
      if (!sekce) { [...document.querySelectorAll('button')].find((b) => /Další úloha/.test(b.textContent))?.click(); await cekej(500); continue; }
      const [, ulohaId, krokId] = /^popisek-(.+)-([^-]+)$/.exec(sekce.querySelector('.krok__popisek').id);
      const krok = lekce.ulohy.find((u) => u.id === ulohaId).kroky.find((k) => k.id === krokId);
      const t = krok.vstup.typ;
      if (t === 'dlazdice') sekce.querySelector('[data-id="' + krok.vstup.moznosti.find((m) => m.spravne).id + '"]').click();
      else if (t === 'poradi') for (const id of krok.spravne.poradi[0]) sekce.querySelector('[data-op="' + id + '"]').click();
      else { const sp = krok.spravne; const h = t === 'cislo' ? [sp.hodnota] : t === 'zlomek' ? [sp.c, sp.j] : t === 'vyraz' ? [sp.vyraz] : [sp.cela, sp.c, sp.j];
        [...sekce.querySelectorAll('input.pole')].forEach((p, j) => { p.value = String(h[j]); }); }
      [...sekce.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
      await cekej(500);
    }
    return true; })()`;

// ---------------------------------------------------------------------
// Diagnostika Fáze 1 (týden 0) — --diag. Lekce F1-T00-DIAG v DB není: žák a tisk jedou s ?lokalne=1
// (bez ukládání), rodičovské obrazovky se staví z modulů (jako kontrola-dlazdic), přehled s podvrženým
// katalogem (CDP Fetch: do odpovědi katalog_lekci / sezeni se přidá diagnostika). Do DB se nic nezapisuje.
// ---------------------------------------------------------------------
const DIAG_ID = 'F1-T00-DIAG';
/** Chybné odpovědi průchodu žáka (známé chyby + jedna neznámá); ostatní úlohy správně. */
const DIAG_CHYBNE = { 3: [-16], 5: [16], 7: [3, 8], 13: [27], 20: ['2x-3'], 21: ['2x+5'], 22: [4] };

/** Podvrhne do odpovědí Supabase (katalog lekcí, sezení dítěte) diagnostiku ve zvoleném stavu. */
async function podvrhniDiagnostiku(varianta, diteId) {
  if (bezSite) return podvrhniDiagnostikuBezSite(varianta, diteId);
  const handler = async (z) => {
    if (z.sessionId !== sessionId || z.method !== 'Fetch.requestPaused') return;
    const { requestId, request, responseStatusCode, responseHeaders } = z.params;
    try {
      const { body, base64Encoded } = await s('Fetch.getResponseBody', { requestId });
      let data = JSON.parse(base64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body);
      if (/katalog_lekci/.test(request.url) && Array.isArray(data)) {
        const vzor = data[0] || {};
        data = [{ ...vzor, id: DIAG_ID, faze: 'faze1', tyden: 0, poradi: 0, tema: 'Vstupní diagnostika', kapitola: 'pocetni-operace', cas_min: 40,
          zamceno: varianta === 'zamceno' ? 'datum' : null, otevrit_od: '2026-12-01T00:00:00+01:00' }, ...data];
      } else if (Array.isArray(data) && varianta === 'hotovo') {
        data = [{ id: '00000000-0000-4000-8000-00000000d1a9', dite_id: diteId, lekce_id: DIAG_ID, rezim: 'app',
          zacatek: new Date(Date.now() - 3 * 3600e3).toISOString(), konec: new Date(Date.now() - 2 * 3600e3).toISOString(),
          stav: 'dokonceno', souhrn: { typ: 'diagnostika', verze: 1, celkove: 'cast' } }, ...data];
      }
      const hlavicky = (responseHeaders || []).filter((x) => !/^(content-length|content-encoding)$/i.test(x.name));
      await s('Fetch.fulfillRequest', { requestId, responseCode: responseStatusCode || 200, responseHeaders: hlavicky,
        body: Buffer.from(JSON.stringify(data)).toString('base64') });
    } catch (e) {
      await s('Fetch.continueRequest', { requestId }).catch(() => {});
    }
  };
  posluchaci.add(handler);
  await s('Fetch.enable', { patterns: [
    { urlPattern: '*rpc/katalog_lekci*', requestStage: 'Response' },
    { urlPattern: '*rest/v1/sezeni?select=id*dite_id*', requestStage: 'Response' },
  ] });
  return async () => { posluchaci.delete(handler); await s('Fetch.disable'); };
}

/** --bez-site: totéž jako podvrhniDiagnostiku, jen zápisem do fake DB a katalogu (localStorage). */
async function podvrhniDiagnostikuBezSite(varianta, diteId) {
  const puvodni = await js(`({ k: localStorage.getItem('spolu.fake-katalog'), d: localStorage.getItem('spolu.fake-db') })`);
  const katalog = JSON.parse(puvodni.k || '[]');
  const vzor = katalog[0] || {};
  katalog.unshift({ ...vzor, id: DIAG_ID, faze: 'faze1', tyden: 0, poradi: 0, tema: 'Vstupní diagnostika', kapitola: 'pocetni-operace', cas_min: 40,
    zamceno: varianta === 'zamceno' ? 'datum' : null, otevrit_od: '2026-12-01T00:00:00+01:00' });
  const db = JSON.parse(puvodni.d || 'null');
  // s fake DB se sezení diagnostiky z průchodu žáka opravdu uložilo (s reálnou DB ne, lekce tam není) → pryč
  if (db) db.sezeni = db.sezeni.filter((s) => s.lekce_id !== DIAG_ID);
  if (varianta === 'hotovo' && db) {
    db.sezeni.push({ id: '00000000-0000-4000-8000-00000000d1a9', dite_id: diteId, lekce_id: DIAG_ID, rezim: 'app',
      zacatek: new Date(Date.now() - 3 * 3600e3).toISOString(), konec: new Date(Date.now() - 2 * 3600e3).toISOString(),
      stav: 'dokonceno', souhrn: { typ: 'diagnostika', verze: 1, celkove: 'cast' } });
  }
  await js(`localStorage.setItem('spolu.fake-katalog', ${JSON.stringify(JSON.stringify(katalog))}); ${db ? `localStorage.setItem('spolu.fake-db', ${JSON.stringify(JSON.stringify(db))});` : ''} true`);
  return async () => {
    await js(`localStorage.setItem('spolu.fake-katalog', ${JSON.stringify(puvodni.k || '[]')}); ${puvodni.d ? `localStorage.setItem('spolu.fake-db', ${JSON.stringify(puvodni.d)});` : ''} true`);
  };
}

/** --bez-site: katalog lekcí (metadata jako RPC katalog_lekci) z obsah/lekce/P*.json — pilot pro výchozí průchod. */
async function katalogZeSouboru() {
  const { readdir } = await import('node:fs/promises');
  const soubory = (await readdir(join(KOREN, 'obsah', 'lekce'))).filter((f) => /^P\d+\.json$/.test(f)).sort();
  const out = [];
  for (const f of soubory) {
    const l = JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', f), 'utf8'));
    out.push({ id: l.id, faze: l.faze, tyden: l.tyden, poradi: l.poradi, tema: l.tema, kapitola: l.kapitola, varianta: l.varianta,
      cas_min: l.cas_min, otevrit_od: '2026-09-01T00:00:00+02:00', verejna: true, verze: 1, zamceno: null });
  }
  return out;
}

/**
 * --zamky (zadání 30. 9., A): přehled pilotní rodiny — P1–P4 otevřené, celá sezóna zamčená kvůli platbě.
 * Ověří: cena jednou (jen rodič, nad první zamčenou částí), žák cenu nevidí, zamčené týdny jedním řádkem, bez scrollu.
 */
async function pruchodZamky(nastav) {
  const { readdir } = await import('node:fs/promises');
  const kontroly = [];
  const over = (podminka, popis) => { kontroly.push(`${podminka ? '✔' : '✘'} ${popis}`); if (!podminka) process.exitCode = 1; };
  const OTEVRIT = { pilot: '2026-09-01T00:00:00+02:00', faze1: '2026-12-01T00:00:00+01:00', faze2: '2027-02-01T00:00:00+01:00' };
  const katalog = [];
  for (const f of (await readdir(join(KOREN, 'obsah', 'lekce'))).filter((x) => x.endsWith('.json')).sort()) {
    const l = JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', f), 'utf8'));
    katalog.push({ id: l.id, faze: l.faze, tyden: l.tyden, poradi: l.poradi, tema: l.tema, kapitola: l.kapitola, varianta: l.varianta,
      cas_min: l.cas_min, otevrit_od: OTEVRIT[l.faze], verejna: l.faze === 'pilot', verze: 1, zamceno: l.faze === 'pilot' ? null : 'platba' });
  }
  katalog.sort((a, b) => ['pilot', 'faze1', 'faze2'].indexOf(a.faze) - ['pilot', 'faze1', 'faze2'].indexOf(b.faze) || a.tyden - b.tyden || a.poradi - b.poradi);
  const tydnu = new Set(katalog.filter((l) => l.zamceno).map((l) => `${l.faze}|${l.tyden}`));
  const vicelekcovych = [...tydnu].filter((t) => katalog.filter((l) => `${l.faze}|${l.tyden}` === t).length > 1).length;
  const puvodni = await js(`localStorage.getItem('spolu.fake-katalog')`);
  await js(`localStorage.setItem('spolu.fake-katalog', ${JSON.stringify(JSON.stringify(katalog))}); true`);
  try {
    for (const role of ['rodic', 'zak']) {
      await nastav(role);
      await viewport(375, 812, true);
      await jdiNa(`${WEB}/prehled.html`);
      await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, `přehled (${role})`);
      const r = await js(`(() => { const m = document.getElementById('obsah'); const txt = m.innerText;
        const casti = [...m.children]; const blok = casti.findIndex((x) => /Kč/.test(x.textContent)); const bloku = casti.filter((x) => /Kč/.test(x.textContent)).length;
        const prvniZamek = casti.findIndex((x) => x.querySelector && (x.querySelector('.karta-lekce--zamceno') || x.classList.contains('tyden--zamceny')));
        return { kc: (txt.match(/Kč/g) || []).length, bloku, radku: document.querySelectorAll('.tyden-zamceny').length,
          blok, prvniZamek, sw: document.documentElement.scrollWidth,
          karetSCenou: [...document.querySelectorAll('.karta-lekce--zamceno')].filter((k) => /Kč/.test(k.textContent)).length,
          otevreSe: [...document.querySelectorAll('.tyden-zamceny__stav')].map((x) => x.textContent).slice(0, 2) }; })()`);
      if (role === 'rodic') {
        over(r.bloku === 1 && r.karetSCenou === 0, `rodič: cena na přehledu v jednom bloku (bloků s „Kč“: ${r.bloku}), žádná karta s cenou`);
        over(r.blok >= 0 && r.blok === r.prvniZamek - 1, `rodič: blok s cenou těsně nad první zamčenou částí (blok ${r.blok}, zámek ${r.prvniZamek})`);
      } else {
        over(r.kc === 0, `žák: cenu nevidí (výskytů „Kč“: ${r.kc})`);
      }
      over(r.radku === vicelekcovych, `${role}: zamčené týdny jedním řádkem (${r.radku} z ${vicelekcovych}), např. „${r.otevreSe.join('“, „')}“`);
      over(r.sw <= 375, `${role}: bez vodorovného scrollu (${r.sw} px)`);
      await snimek(`prehled-zamky-${role}-375`);
    }
  } finally {
    await js(`localStorage.setItem('spolu.fake-katalog', ${JSON.stringify(puvodni || '[]')}); true`);
  }
  console.log(kontroly.map((k) => `  ${k}`).join('\n'));
}

/**
 * --odznaky (R61–R63, zadání 30. 9. B–D): fake DB s dokončenými P1 (vše zelené) a P2 (oranžová) →
 * přehled rodiče 375: P1 „Celá správně" (hvězda), P2 hotová (fajfka), ukazatel postupu (obě varianty),
 * „Odznaky: 2 z 8"; okno „Nový odznak" (seen = []) → „Seber odznak" → další → zavřeno; podruhé se neukáže.
 */
async function pruchodOdznaky(dite, nastav) {
  const kontroly = [];
  const over = (podminka, popis) => { kontroly.push(`${podminka ? '✔' : '✘'} ${popis}`); if (!podminka) process.exitCode = 1; };
  const puvodni = await js(`localStorage.getItem('spolu.fake-db')`);
  const db = JSON.parse(puvodni || 'null') || { sezeni: [], odpovedi: [], semafory: [] };
  const den = 24 * 3600e3; const ted = Date.now();
  const sez = (lekce, cislo, dnyZpet, barvy) => ({ id: `00000000-0000-4000-8000-00000000${cislo}`, dite_id: dite.id, lekce_id: lekce, rezim: 'app',
    zacatek: new Date(ted - dnyZpet * den - 1800e3).toISOString(), konec: new Date(ted - dnyZpet * den).toISOString(), stav: 'dokonceno',
    souhrn: { barvy, hlavniBarva: barvy[`${lekce}-U4`] || 'zelena', doporuceni: '', kapitola: 'pocetni-operace', pocetUloh: 4 } });
  db.sezeni = (db.sezeni || []).filter((x) => !['P1', 'P2'].includes(x.lekce_id));
  db.sezeni.push(sez('P1', '0a01', 2, { 'P1-U1': 'zelena', 'P1-U2': 'zelena', 'P1-U3': 'zelena', 'P1-U4': 'zelena' }),
    sez('P2', '0a02', 1, { 'P2-U1': 'zelena', 'P2-U2': 'oranzova', 'P2-U3': 'zelena', 'P2-U4': 'zelena' }));
  await js(`localStorage.setItem('spolu.fake-db', ${JSON.stringify(JSON.stringify(db))}); localStorage.setItem('spolu.odznaky.videno.${dite.id}', '[]'); true`);
  try {
    await nastav('rodic');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled');
    await pockej(`document.querySelector('dialog.modal--novy-odznak[open]')`, 'okno Nový odznak');
    const okno = await js(`(() => { const d = document.querySelector('dialog.modal--novy-odznak[open]'); return { nazev: d.querySelector('.novy-odznak__nazev')?.textContent, tlacitko: d.querySelector('button')?.textContent, svg: Boolean(d.querySelector('svg')) }; })()`);
    over(okno.nazev === 'První lekce' && /Seber odznak a další/.test(okno.tlacitko) && okno.svg, `okno „Nový odznak": „${okno.nazev}", tlačítko „${okno.tlacitko}"`);
    await cekej(900);
    await snimek('odznaky-novy-375');
    await js(`document.querySelector('dialog.modal--novy-odznak[open] button').click(); true`);
    await pockej(`(() => { const d = document.querySelector('dialog.modal--novy-odznak[open]'); return Boolean(d && /Celá správně/.test(d.textContent)); })()`, 'druhé okno');
    await js(`document.querySelector('dialog.modal--novy-odznak[open] button').click(); true`);
    await pockej(`!document.querySelector('dialog.modal--novy-odznak')`, 'okna zavřená');
    const videno = await js(`localStorage.getItem('spolu.odznaky.videno.${dite.id}')`);
    over(/prvni/.test(videno) && /spravne/.test(videno), `odznaky zapamatované jako viděné (${videno})`);
    const p = await js(`(() => { const karty = [...document.querySelectorAll('.karta-lekce')];
      const p1 = karty[0], p2 = karty[1];
      return { p1: p1.className, p1hvezda: /Celá správně/.test(p1.textContent), p1roh: Boolean(p1.querySelector('.karta-lekce__roh svg')),
        p2: p2.className, p2hotovo: /Hotovo/.test(p2.textContent), p2roh: Boolean(p2.querySelector('.karta-lekce__roh svg')),
        radek: document.querySelector('.odznaky-radek')?.textContent, postup: document.querySelector('.postup-pruh')?.textContent,
        sw: document.documentElement.scrollWidth,
        prepad: [...document.querySelectorAll('.postup-pruh__popis')].some((x) => x.scrollWidth > x.clientWidth + 1) }; })()`);
    over(/karta-lekce--hvezda/.test(p.p1) && p.p1hvezda && p.p1roh, 'P1 (vše zelené): karta „Celá správně" se hvězdou v rohu');
    over(/karta-lekce--hotovo/.test(p.p2) && !/hvezda/.test(p.p2) && p.p2hotovo && p.p2roh, 'P2 (oranžová): hotová karta s fajfkou, bez hvězdy');
    over(/Odznaky: 2 z 8/.test(p.radek || ''), `řádek odznaků: „${(p.radek || '').replace(/Zobrazit/, '').trim()}"`);
    const hl = await js(`(() => { const o = document.querySelector('.hlavicka .osa-sezony'); const v = document.querySelector('.hlavicka__vnitrek');
      return { osa: o ? o.textContent : null, osaSirka: o ? Math.round(o.getBoundingClientRect().width) : 0, preteka: v.scrollWidth > v.clientWidth + 1,
        poradi: [...v.children].map((x) => x.className.split(' ')[0]).join(' > ') }; })()`);
    over(/Pilot/.test(p.postup) && /hotovo 2 z 4/.test(p.postup) && !/týdn|přijímačky/.test(p.postup), `ukazatel na přehledu (fáze přes celou šířku): „${p.postup}"`);
    over(/přijímačky 12\. 4\./.test(hl.osa || '') && hl.osaSirka >= 100 && !hl.preteka && /logo > osa-sezony > tlacitko/.test(hl.poradi), `časová osa v hlavičce mezi logem a menu (${hl.poradi}, šířka ${hl.osaSirka} px)`);
    over(p.sw <= 375 && !p.prepad, `bez vodorovného scrollu a přetečení popisků (${p.sw} px)`);
    await snimek('odznaky-prehled-rodic-375');
    await js(`document.querySelector('.odznaky-radek').click(); true`);
    await pockej(`document.querySelector('dialog.modal--odznaky[open]')`, 'přehled odznaků');
    const vse = await js(`[...document.querySelectorAll('dialog.modal--odznaky .odznak')].map((o) => (o.classList.contains('odznak--chybi') ? '-' : '+') + o.querySelector('.odznak__nazev').textContent)`);
    over(vse.length === 8 && vse.filter((x) => x.startsWith('+')).length === 2, `přehled všech odznaků: ${vse.join(', ')}`);
    await snimek('odznaky-vsechny-375');
    await js(`document.querySelectorAll('dialog[open]').forEach((d) => d.close()); true`);
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled znovu');
    await cekej(800);
    over(!(await js(`Boolean(document.querySelector('dialog.modal--novy-odznak'))`)), 'po obnovení se okno „Nový odznak" už neukáže');
    await nastav('zak');
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled žák');
    await cekej(800);
    const z = await js(`({ radek: Boolean(document.querySelector('.odznaky-radek')), hvezda: Boolean(document.querySelector('.karta-lekce--hvezda')), okno: Boolean(document.querySelector('dialog.modal--novy-odznak')) })`);
    over(z.radek && z.hvezda && !z.okno, 'žák: vidí odznaky a hvězdu; na stejném zařízení už okno znovu neukáže');
    await snimek('odznaky-prehled-zak-375');
    await viewport(1280, 900);
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled 1280');
    const d = await js(`(() => { const v = document.querySelector('.hlavicka__vnitrek'); return { poradi: [...v.children].map((x) => x.className.split(' ')[0]).join(' > '),
      produkt: getComputedStyle(document.querySelector('.logo__produkt')).display !== 'none', osa: Math.round(document.querySelector('.osa-sezony').getBoundingClientRect().width) }; })()`);
    over(d.produkt && /osa-sezony/.test(d.poradi) && d.osa > 200, `1280 px: „Spolu na přijímačky“ i osa v hlavičce (${d.poradi}, osa ${d.osa} px)`);
    await snimek('odznaky-prehled-zak-1280');
  } finally {
    await js(`localStorage.setItem('spolu.fake-db', ${JSON.stringify(puvodni || 'null')}); localStorage.removeItem('spolu.odznaky.videno.${dite.id}'); true`);
  }
  console.log(kontroly.map((k) => `  ${k}`).join('\n'));
}

/**
 * --samo (R64): žák P1 v režimu „Dnes samo" — úvod, „Nevím, jak dál" (2 nápovědy z taháku), chybná dlaždice → tip,
 * správná → další krok; stránka rodiče u probíhající lekce jen informuje; přehled rodiče po dokončení „Bez rodiče".
 */
async function pruchodSamo(dite, nastav) {
  const kontroly = [];
  const over = (podminka, popis) => { kontroly.push(`${podminka ? '✔' : '✘'} ${popis}`); if (!podminka) process.exitCode = 1; };
  await nastav('zak');
  await viewport(1280, 900);
  await jdiNa(`${WEB}/lekce.html?lekce=P1&dite=${dite.id}&rezim=samo&lokalne=1`);
  await pockej(`document.querySelector('.samo-napoveda-blok')`, 'lekce samo');
  const uvod = await js(`[...document.querySelectorAll('.hlaska')].some((x) => /Dnes pracuješ sám/.test(x.textContent))`);
  over(uvod, 'úvod „Dnes pracuješ sám nebo sama…"');
  for (let i = 0; i < 2; i++) { await js(`document.querySelector('.samo-napoveda-blok button').click(); true`); await cekej(300); }
  const nap = await js(`[...document.querySelectorAll('.samo-napoveda')].map((x) => x.textContent.trim().slice(0, 60))`);
  over(nap.length === 2 && /Nápověda 1/.test(nap[0]), `„Nevím, jak dál" 2× → ${nap.length} nápovědy: „${nap[0]}"`);
  // chybná dlaždice v 1. kroku (scital-pred-nasobenim) → tip
  await js(`(() => { const k = document.querySelector('.krok:not(.krok--hotovy)'); k.querySelector('.dlazdice[data-id="a"], [data-moznost="a"], .dlazdice')?.click(); k.querySelector('.krok__akce button').click(); return true; })()`);
  await cekej(500);
  const tip = await js(`document.querySelector('.samo-tip')?.textContent || null`);
  over(Boolean(tip) && /Častá chyba/.test(tip), `tip po chybě: „${tip}"`);
  await snimek('samo-zak-1280');
  // rodič otevře lekci, která běží bez něj → jen informace (bez brány)
  await nastav('rodic');
  await viewport(375, 812, true);
  await jdiNa(`${WEB}/rodic.html?lekce=P1&dite=${dite.id}&lokalne=1`);
  await pockej(`/pracuje samo/.test(document.body.textContent)`, 'rodič: dítě pracuje samo');
  const brana = await js(`Boolean(document.querySelector('.postup-rodice'))`);
  over(!brana, 'rodič u probíhající lekce bez něj: jen informace, žádná brána ①–④');
  await snimek('samo-rodic-bezi-375');
  console.log(kontroly.map((k) => `  ${k}`).join('\n'));
}

async function pruchodDiagnostika(dite, nastav) {
  const kontroly = [];
  const over = (podminka, popis) => { kontroly.push(`${podminka ? '✔' : '✘'} ${popis}`); if (!podminka) process.exitCode = 1; };
  try {
    // --- 1) žák: celá diagnostika (1280 světlý; U20 výraz na 375 tmavý; U24 obrázek na 800)
    await nastav('zak');
    await js(`localStorage.setItem('spolu.pripraveno.${DIAG_ID}', ${DNES_JS}); true`);
    await motivStranky('svetly');
    await viewport(1280, 900);
    await jdiNa(`${WEB}/lekce.html?lekce=${DIAG_ID}&dite=${dite.id}&rezim=app&lokalne=1`);
    await pockej(`document.querySelector('.krok')`, 'diagnostika U1');
    const lista = await js(`({ odpocet: document.getElementById('odpocet')?.hidden, prubeh: document.getElementById('prubehText')?.textContent,
      pruh: Boolean(document.getElementById('diagPruh')), preskocit: /přeskoč/i.test(document.body.textContent) })`);
    over(lista.odpocet === true && lista.prubeh === 'Úloha 1 z 24' && lista.pruh && !lista.preskocit,
      `žák: bez odpočtu, „${lista.prubeh}", ukazatel po 24 dílcích, žádné „přeskočit" (R37)`);
    const lekce = JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', `${DIAG_ID}.json`), 'utf8'));
    let neutralni = true;
    for (let n = 1; n <= 24; n += 1) {
      const krok = lekce.ulohy[n - 1].kroky.find((k) => k.id === 'final');
      const sp = krok.spravne;
      const typ = krok.vstup.typ;
      const hodnoty = DIAG_CHYBNE[n] || (typ === 'cislo' ? [sp.hodnota] : typ === 'zlomek' ? [sp.c, sp.j] : typ === 'smisene' ? [sp.cela, sp.c, sp.j] : [sp.vyraz]);
      await pockej(`document.getElementById('popisek-${DIAG_ID}-U${n}-final') && !document.getElementById('popisek-${DIAG_ID}-U${n}-final').closest('.krok--hotovy')`, `U${n}`, 15000);
      if (n === 20) { await viewport(375, 812, true); await js(`window.spoluMotiv.nastav('tmavy'); true`); }
      if (n === 24) { await viewport(800, 1100, true); await js(`window.spoluMotiv.nastav('svetly'); true`); }
      await js(`(() => { const k = document.getElementById('popisek-${DIAG_ID}-U${n}-final').closest('.krok');
        [...k.querySelectorAll('input.pole')].forEach((p, j) => { p.value = String(${JSON.stringify(hodnoty)}[j]).replace('.', ','); p.dispatchEvent(new Event('input', { bubbles: true })); });
        return true; })()`);
      if (n === 20) { await cekej(300); await snimek('zak-vyraz-tmavy-375'); }
      if (n === 24) {
        const obr = await js(`Boolean(document.querySelector('.karta-ulohy .obrazek-ulohy svg'))`);
        over(obr, 'žák: U24 má obrázek (SVG přes DOMPurify)');
        await js('window.scrollTo(0, 0); true');
        await snimek('zak-obrazek-800');
      }
      const r = await js(`(async () => { const k = document.getElementById('popisek-${DIAG_ID}-U${n}-final').closest('.krok');
        [...k.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
        await new Promise((ok) => setTimeout(ok, 150));
        return { vazba: k.querySelector('.zpetna-vazba')?.textContent || '', barvy: k.querySelectorAll('.je-spravne, .je-nesedi').length,
          hotovy: k.classList.contains('krok--hotovy') }; })()`);
      if (!(r.vazba === 'Uloženo.' && r.barvy === 0 && r.hotovy)) { neutralni = false; console.warn(`  U${n}:`, r); }
      if (n === 1) { await js('window.scrollTo(0, 0); true'); await snimek('zak-ulozeno-1280'); }
      if (n === 12) {
        await pockej(`document.querySelector('.diag-prestavka')`, 'přestávka po U12', 5000);
        over(true, 'žák: po 12. úloze přestávka „Máš za sebou polovinu."');
        await snimek('zak-prestavka-1280');
        await js(`[...document.querySelectorAll('.diag-prestavka button')].find((b) => /Pokračovat/.test(b.textContent)).click(); true`);
      }
    }
    over(neutralni, 'žák: po každé z 24 úloh jen neutrální „Uloženo.", bez ✔/✘ a barev, 1 pokus (krok hned uzavřen), další úloha sama');
    await pockej(`/Hotovo. Díky!/.test(document.body.textContent)`, 'konec diagnostiky', 8000);
    const konec = await js(`({ procenta: /%|správně \\d|\\d+ z 24 správně/.test(document.getElementById('plocha').textContent), prubeh: document.getElementById('prubehText').textContent })`);
    over(!konec.procenta, `žák: konec „Hotovo. Díky!" bez počtu správných (lišta „${konec.prubeh}")`);
    await snimek('zak-konec-800');

    // --- 2) rodič (375): průběh, papír, výsledek — obrazovky z rodic-diagnostika.js nad případem B z reportu
    const postav = (co, motiv) => js(`(async () => {
      localStorage.setItem('spolu.motiv', ${JSON.stringify(motiv)}); window.spoluMotiv?.pouzij?.();
      const o = await import('./js/obsah.js'); const rd = await import('./js/rodic-diagnostika.js'); const d = await import('./js/diagnostika.js');
      const { vyhodnotKrok } = await import('./js/vyhodnoceni.js'); const { el } = await import('./js/ui.js');
      await o.nacistKnihovny();
      const l = await o.nactiLekciObsah(${JSON.stringify(DIAG_ID)}, { lokalne: true });
      const prepis = { 3: -16, 4: 34, 5: 16, 7: { c: 3, j: 8 }, 8: 140, 12: 16, 13: 27, 15: 1152, 17: 17, 20: '2x-3', 21: '2x-10', 22: 5 };
      const odpovedi = l.ulohy.slice(0, 23).map((u, i) => { const k = u.kroky[0]; const sp = k.spravne; const t = k.vstup.typ;
        const hod = (i + 1) in prepis ? prepis[i + 1] : t === 'cislo' ? sp.hodnota : t === 'zlomek' ? { c: sp.c, j: sp.j } : t === 'smisene' ? { cela: sp.cela, c: sp.c, j: sp.j } : sp.vyraz;
        const v = vyhodnotKrok(k, hod); return { id: i + 1, uloha_id: u.id, krok_id: 'final', spravne: v.spravne, typ_chyby: v.typ_chyby, pokus: 1 }; });
      let uzel;
      if (${JSON.stringify(co)} === 'prubeh') uzel = rd.vytvorPrubeh({ lekce: l, odevzdano: 17, zacatek: new Date(Date.now() - 45 * 60000).toISOString(), rezim: 'app', naposledy: new Date() }, { obnovit() {}, zobrazit() {} });
      else if (${JSON.stringify(co)} === 'papir') uzel = rd.vytvorPapirDiagnostiky(l, { odpovedi: [], ulozit: async (k) => { window.__ulozeno = k.map((x) => x.u.id); } });
      else {
        const souhrn = d.sestavSouhrnDiagnostiky(l, odpovedi);
        uzel = rd.vytvorVysledek(souhrn, { jmeno: 'Adam', datum: new Date(), faze1Otevrena: false,
          temata: new Map([['F1-T01-L2', 'Mocnina záporného čísla, dosazení'], ['F1-T01-L4', 'Znaménka v delším výrazu'], ['P2', 'Celá čísla'], ['P3', 'Zlomky — základ'], ['P4', 'Zlomky — složitější']]) });
      }
      document.body.replaceChildren(el('div', { class: 'stranka-rodic' }, el('main', { class: 'stranka-rodic__obsah' }, uzel)));
      document.querySelectorAll('details').forEach((x) => { x.open = true; });
      await document.fonts.ready; await new Promise((ok) => setTimeout(ok, 300)); return true; })()`);
    for (const m of ['svetly', 'tmavy']) {
      await viewport(375, 812, true);
      await jdiNa(`${WEB}/nahled-obsahu.html?lekce=P1&lokalne=1`);
      await pockej(`document.querySelector('main')`, 'náhled');
      await postav('vysledek', m);
      const text = await js('document.body.textContent');
      if (m === 'svetly') {
        over(!/%|stačí na|bod[yů]?\b|známk/i.test(text), 'rodič výsledek: žádná procenta, body, známky ani „stačí na…"');
        over(/Projděte důkladně/.test(text) && /Nejvíc času dejte lekcím Mocnina záporného čísla, dosazení a Znaménka v delším výrazu/.test(text)
          && /vraťte se k pilotní lekci P2 \(Celá čísla\)/.test(text), 'rodič výsledek: plán po týdnech se štítky, lekce_duraz s tématy, pilot P2');
        over(/Spočítá jen tu část/.test(text) && /Objevilo se víckrát/.test(text) && /Trénuje se v týdnu 2 a 4/.test(text), 'rodič výsledek: 3 nejčastější chyby s lidským popisem (report §5)');
        over(!/Začít týden 1/.test(text), 'rodič výsledek: u zamčené Fáze 1 bez „Začít týden 1"');
      }
      await snimek(`rodic-vysledek-${m}-375`);
    }
    await viewport(1280, 900);
    await jdiNa(`${WEB}/nahled-obsahu.html?lekce=P1&lokalne=1`);
    await pockej(`document.querySelector('main')`, 'náhled');
    await postav('vysledek', 'svetly');
    await snimek('rodic-vysledek-1280');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/nahled-obsahu.html?lekce=P1&lokalne=1`);
    await pockej(`document.querySelector('main')`, 'náhled');
    await postav('prubeh', 'svetly');
    const pr = await js('document.body.textContent');
    over(/Odevzdáno 17 z 24/.test(pr) && /Uplynulo 40 minut/.test(pr) && !/semafor|Otázky|Co vidí dítě/i.test(pr), 'rodič průběh: „Odevzdáno 17 z 24", po 40 min upozornění, bez taháku a semaforu');
    await snimek('rodic-prubeh-375');
    await jdiNa(`${WEB}/nahled-obsahu.html?lekce=P1&lokalne=1`);
    await pockej(`document.querySelector('main')`, 'náhled');
    await postav('papir', 'tmavy');
    const pap = await js(`(async () => {
      const pole = [...document.querySelectorAll('.diag-papir__uloha')];
      const vyplnit = (li, hodnoty) => [...li.querySelectorAll('input.pole')].forEach((p, j) => { p.value = String(hodnoty[j]); });
      vyplnit(pole[0], [39]); vyplnit(pole[5], [3, 1, 2]); vyplnit(pole[19], ['2x+6']); vyplnit(pole[23], [288]);
      [...document.querySelectorAll('button')].find((b) => /Uložit výsledky/.test(b.textContent)).click();
      await new Promise((ok) => setTimeout(ok, 300));
      return { poli: pole.length, ulozeno: window.__ulozeno, stavy: pole.filter((li) => /Uloženo/.test(li.querySelector('.diag-papir__stav').textContent)).length,
        barvy: document.querySelectorAll('.je-spravne, .je-nesedi').length, jednotky: document.querySelectorAll('.pole-cislo__jednotka').length }; })()`);
    over(pap.poli === 24 && pap.ulozeno?.length === 4 && pap.stavy === 4 && pap.barvy === 0,
      `rodič papír: 24 polí (jednotky u ${pap.jednotky}), uloženy jen 4 vyplněné, u nich „Uloženo", žádné ✔/✘`);
    await snimek('rodic-papir-tmavy-375');

    // --- 3) tisk: 24 úloh, předěl po 12., obrázek
    await motivStranky('svetly');
    await viewport(900, 1200);
    await jdiNa(`${WEB}/tisk.html?lekce=${DIAG_ID}&lokalne=1`);
    await pockej(`document.querySelector('.tisk-uloha') && ${nactene}`, 'tisk diagnostiky');
    const t = await js(`({ ulohy: document.querySelectorAll('.tisk-uloha').length, predel: document.querySelector('.tisk-predel')?.textContent,
      predelPo: document.querySelector('.tisk-predel')?.previousElementSibling?.querySelector('.tisk-uloha__cislo')?.textContent,
      obrazek: Boolean(document.querySelector('.obrazek-ulohy--tisk svg')), typ: document.querySelectorAll('.tisk-uloha__typ').length,
      pripravit: document.querySelector('.tisk-pripravit')?.textContent })`);
    over(t.ulohy === 24 && t.predelPo === '12' && t.obrazek && t.typ === 0,
      `tisk: 24 úloh, předěl „${t.predel}" po 12. (nová strana), obrázek, „${t.pripravit}"`);
    await snimek('tisk');

    // --- 4) přehled: karta týdne 0 (podvržený katalog): zamčeno, nezačato (+ modal), hotovo (rodič / žák)
    for (const [varianta, role] of [['zamceno', 'rodic'], ['nezacato', 'rodic'], ['hotovo', 'rodic'], ['hotovo', 'zak']]) {
      await nastav(role);
      await viewport(375, 812, true);
      const odpojit = await podvrhniDiagnostiku(varianta, dite.id);
      try {
        await jdiNa(`${WEB}/prehled.html`);
        await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled');
        const karta = await js(`(() => { const k = document.querySelector('.karta-lekce--diagnostika') || [...document.querySelectorAll('.karta-lekce')].find((x) => /Vstupní diagnostika/.test(x.textContent));
          return k ? { text: k.textContent, sekce: k.closest('section')?.querySelector('h2')?.textContent, id: k.closest('section')?.id,
            odkaz: k.querySelector('a[href*="sezeni="]')?.textContent || null } : null; })()`);
        if (varianta === 'zamceno') over(karta && /Zamčeno/.test(karta.text) && karta.sekce === 'Týden 0 — vstupní diagnostika' && karta.id === 'faze1-t0', `přehled: karta „Týden 0 — vstupní diagnostika" zamčená jako Fáze 1`);
        if (varianta === 'nezacato') {
          over(karta && /Začít diagnostiku/.test(karta.text) && /Doporučujeme udělat ji před týdnem 1/.test(karta.text), 'přehled rodič: „Začít diagnostiku" + doporučení');
          await js(`[...document.querySelectorAll('.karta-lekce--diagnostika button')].find((b) => /Začít/.test(b.textContent)).click(); true`);
          await pockej(`document.querySelector('#modalRezim[open]')`, 'modal režimu');
          over(await js(`!document.getElementById('rezimDiagText').hidden`), 'přehled: modal režimu s větou „Dítě pracuje samo…"');
          await snimek(`prehled-${varianta}-${role}-375`);
          await js(`document.querySelectorAll('dialog[open]').forEach((d) => d.close()); true`);
          continue;
        }
        if (varianta === 'hotovo' && role === 'rodic') over(karta && karta.odkaz === 'Výsledek diagnostiky', 'přehled rodič po dokončení: odkaz „Výsledek diagnostiky"');
        if (varianta === 'hotovo' && role === 'zak') over(karta && /Hotovo/.test(karta.text) && !karta.odkaz && !/Projít znovu/.test(karta.text), 'přehled žák po dokončení: jen „Hotovo" (výsledek nevidí, znovu nejde)');
        await snimek(`prehled-${varianta}-${role}-375`);
      } finally {
        await odpojit();
      }
    }
  } finally {
    await telefon(false).catch(() => {});
    console.log(kontroly.map((k) => `  ${k}`).join('\n'));
  }
}

// ---------------------------------------------------------------------
// Průchod
// ---------------------------------------------------------------------
// --bez-site: přihlášení i data jdou do fake-supabase.js (žádné heslo, žádná síť)
const ucty = bezSite ? { rodina_pilot: { email: 'rodina@example.test', heslo: 'x' } }
  : JSON.parse(await readFile(join(KOREN, 'testy', 'testovaci-ucty.local.json'), 'utf8'));
const ucet = ucty.rodina_pilot;
const q = lokalne || bezSite ? '&lokalne=1' : '';
const nactene = '!document.querySelector("[aria-busy=true]") && !document.querySelector(".nacitani")';

try {
  await mkdir(cilDir, { recursive: true });
  console.log(`Snímky „${prefix}"${lokalne ? ' (obsah ze souboru)' : ''} → reporty/obrazky/`);

  // přihlášení (supabase.js v kontextu stránky)
  await viewport(1280, 900);
  await jdiNa(`${WEB}/index.html`);
  await js(`import('./js/supabase.js').then((m) => m.prihlasit(${JSON.stringify(ucet.email)}, ${JSON.stringify(ucet.heslo)})).then(() => true)`);
  const dite = await js(`import('./js/supabase.js').then((m) => m.mojeDeti()).then((d) => d[0])`);
  if (bezSite) await js(`localStorage.setItem('spolu.fake-katalog', ${JSON.stringify(JSON.stringify(await katalogZeSouboru()))}); true`);
  const nastav = (role) => js(`(() => {
    localStorage.setItem('spolu.role', ${JSON.stringify(role)});
    localStorage.setItem('spolu.dite', ${JSON.stringify(dite.id)});
    localStorage.setItem('spolu.manual-precteno', '1');
    // H2: „Připrav si" dnes už potvrzené, ať průchody jdou rovnou na úlohy (--b4 ho fotí zvlášť)
    const d = new Date(), dnes = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    ['P1', 'P2', 'P3', 'P4'].forEach((l) => localStorage.setItem('spolu.pripraveno.' + l, dnes));
    ${motiv ? `localStorage.setItem('spolu.motiv', ${JSON.stringify(motiv)});` : ''}
    return true; })()`);
  const prerusitP1 = () => js(`import('./js/supabase.js').then(async (m) => {
    const { data } = await m.supabase.from('sezeni').update({ stav: 'preruseno' })
      .eq('dite_id', ${JSON.stringify(dite.id)}).eq('lekce_id', 'P1').eq('stav', 'probiha').select('id');
    return (data || []).length; })`);
  console.log(`  přerušeno dřívějších sezení P1: ${await prerusitP1()}`);

  if (blokPruchod) {
    const { pruchodBlok } = await import('./screenshoty-f2.mjs');
    const media = (m) => s('Emulation.setEmulatedMedia', { media: m });
    await pruchodBlok({ js, jdiNa, pockej, snimek, snimekPrvku, snimekOkna, viewport, cekej, media, WEB, KOREN, nactene });
    throw Object.assign(new Error('hotovo'), { b4: true });
  }
  if (f2) {
    const { pruchodF2 } = await import('./screenshoty-f2.mjs');
    await pruchodF2({ js, jdiNa, pockej, snimek, viewport, cekej, WEB, KOREN, nactene });
    throw Object.assign(new Error('hotovo'), { b4: true });
  }
  if (diagPruchod) {
    await pruchodDiagnostika(dite, nastav);
    throw Object.assign(new Error('hotovo'), { b4: true });
  }
  if (f1tech) {
    await pruchodF1tech(dite, nastav);
    throw Object.assign(new Error('hotovo'), { b4: true });
  }
  if (samoPruchod) {
    await pruchodSamo(dite, nastav);
    throw Object.assign(new Error('hotovo'), { b4: true });
  }
  if (odznakyPruchod) {
    await pruchodOdznaky(dite, nastav);
    throw Object.assign(new Error('hotovo'), { b4: true });
  }
  if (zamky) {
    await pruchodZamky(nastav);
    throw Object.assign(new Error('hotovo'), { b4: true });
  }
  if (b4) {
    await pruchodB4(dite, nastav);
    throw Object.assign(new Error('hotovo'), { b4: true });
  }

  // 1) přehled (rodič, 1280)
  if (!e1) {
    await nastav('rodic');
    await jdiNa(`${WEB}/prehled.html`);
    await pockej(`document.querySelector('.karta-lekce') && ${nactene}`, 'přehled');
    await snimek('prehled-1280');
  }

  // 2) lekce žáka P1, úloha 1 (1280) — zakládá sezení
  await nastav('zak');
  await jdiNa(`${WEB}/lekce.html?lekce=P1&dite=${dite.id}&rezim=app${q}`);
  await pockej(`document.querySelector('.karta-ulohy') && document.querySelector('.krok')`, 'lekce úloha 1');
  if (!e1) await snimek('lekce-p1-uloha1-1280');

  // 3) rodič P1 úloha 1 a 2 (375×812, celá stránka) — připojí se ke stejnému sezení
  if (!e1) {
  await nastav('rodic');
  await viewport(375, 812, true);
  await jdiNa(`${WEB}/rodic.html?lekce=P1&dite=${dite.id}${q}`);
  await pockej(`document.querySelector('.prepinac-uloh') && ${nactene}`, 'rodič úloha 1');
  await js(`document.querySelectorAll('dialog[open]').forEach((d) => d.close()); true`);
  await snimek('rodic-p1-uloha1-375');
  // totéž se vším rozbaleným (Co vidí dítě, vzorová odpověď, klíč, typická chyba, řešení)
  await js(`document.querySelectorAll('#obsah details').forEach((d) => { d.open = true; });
    document.querySelectorAll('#obsah .otazka[hidden]').forEach((o) => { o.hidden = false; }); true`);
  await cekej(400);
  await snimek('rodic-p1-uloha1-rozbaleno-375');
  await js(`document.querySelectorAll('#obsah details').forEach((d) => { d.open = false; }); true`);
  await rodicDalsiUloha(); // brána ①–④ (R28): „Další“ je do semaforu zamčené
  await pockej(`/Úloha 2/.test(document.querySelector('.prepinac-uloh')?.textContent || '')`, 'rodič úloha 2');
  await snimek('rodic-p1-uloha2-375');
  }

  // 4) lekce žáka — detektiv (1280): správně odpovědět 1. úlohu z obsahu, který stránka ukazuje
  await nastav('zak');
  await viewport(1280, 900);
  await jdiNa(`${WEB}/lekce.html?lekce=P1&dite=${dite.id}${q}`);
  await pockej(`document.querySelector('.krok')`, 'lekce znovu');
  const odpovidejDo = (cil) => js(`(async () => {
    const CIL = ${cil};
    const { nactiLekciObsah } = await import('./js/obsah.js');
    const lekce = await nactiLekciObsah('P1');
    const cekej = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 12; i++) {
      const sekce = document.querySelector('.krok:not(.krok--hotovy)');
      const typ = document.querySelector('.karta-ulohy .stitek:nth-child(2)')?.textContent || '';
      if (CIL.test(typ)) return true;
      if (!sekce) {
        [...document.querySelectorAll('button')].find((b) => /Další úloha/.test(b.textContent))?.click();
        await cekej(500); continue;
      }
      const [, ulohaId, krokId] = /^popisek-(.+)-([^-]+)$/.exec(sekce.querySelector('.krok__popisek').id);
      const krok = lekce.ulohy.find((u) => u.id === ulohaId).kroky.find((k) => k.id === krokId);
      const t = krok.vstup.typ;
      if (t === 'dlazdice') sekce.querySelector('[data-id="' + krok.vstup.moznosti.find((m) => m.spravne).id + '"]').click();
      else {
        const sp = krok.spravne;
        const h = t === 'cislo' ? [sp.hodnota] : t === 'zlomek' ? [sp.c, sp.j] : [sp.cela, sp.c, sp.j];
        [...sekce.querySelectorAll('input.pole')].forEach((p, j) => { p.value = String(h[j]); });
      }
      [...sekce.querySelectorAll('button')].find((b) => /Odevzdat/.test(b.textContent)).click();
      await cekej(500);
    }
    return true; })()`);
  await odpovidejDo('/Detektiv/');
  await pockej(`/Detektiv/.test(document.querySelector('.karta-ulohy')?.textContent || '')`, 'detektiv');
  await js('window.scrollTo(0, 0); true');
  await snimek('lekce-p1-detektiv-1280');

  if (e1) {
    // E1/E2: P1-U3 k1 „Který zápis odpovídá zadání?" (dlaždice se vzorci) na 1280 a 800 px;
    // v zadání zvýrazněné znaky „25" a „+" (klik na list KaTeX)
    await odpovidejDo('/přijímaček/');
    await pockej(`/přijímaček/.test(document.querySelector('.karta-ulohy')?.textContent || '') && document.querySelector('.krok:not(.krok--hotovy) .dlazdice')`, 'P1-U3 k1');
    const oznacit = () => js(`(() => {
      const znaky = [...document.querySelectorAll('.karta-ulohy__zadani .zvyraznitelne--znak')];
      znaky.forEach((z) => z.classList.remove('je-zvyrazneno'));
      const klik = (z) => z && z.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      klik(znaky.find((z) => z.textContent.trim() === '25' || z.textContent.trim() === '2'));
      klik(znaky.find((z) => z.textContent.trim() === '+'));
      return document.querySelectorAll('.karta-ulohy__zadani .je-zvyrazneno').length; })()`);
    console.log(`  E2: zvýrazněno znaků: ${await oznacit()}`);
    await js('window.scrollTo(0, 0); true');
    await snimek('lekce-p1-u3-k1-1280');
    await viewport(800, 1100, true);
    await cekej(600);
    await js('window.scrollTo(0, 0); true');
    await snimek('lekce-p1-u3-k1-800');
    await viewport(1280, 900);
  }

  if (!e1) {
  // tablet na výšku (800×1100): zadání přilepené nahoře, posunuto ke krokům (jen viewport, ne celá stránka)
  await viewport(800, 1100, true);
  await cekej(500);
  await js('window.scrollTo(0, 400); true');
  await cekej(400);
  {
    const { data } = await s('Page.captureScreenshot', { format: 'png' });
    const soubor = join(cilDir, `${datum}-${predpona}-lekce-p1-detektiv-tablet-800.png`);
    await writeFile(soubor, Buffer.from(data, 'base64'));
    console.log(`  ✔ ${soubor.replace(KOREN, '.')} (800×1100, posunuto)`);
  }

  }

  // 5) souhrn rodiče (375) — poslední dokončené sezení P1, jen pro čtení (R19)
  await nastav('rodic');
  await viewport(375, 812, true);
  const dokoncene = await js(`import('./js/supabase.js').then(async (m) => {
    const { data } = await m.supabase.from('sezeni').select('id').eq('dite_id', ${JSON.stringify(dite.id)})
      .eq('lekce_id', 'P1').eq('stav', 'dokonceno').order('konec', { ascending: false }).limit(1);
    return data?.[0]?.id || null; })`);
  if (dokoncene && !e1) {
    await jdiNa(`${WEB}/rodic.html?lekce=P1&dite=${dite.id}&sezeni=${dokoncene}${q}`);
    await pockej(`document.querySelector('.souhrn') && ${nactene}`, 'souhrn');
    await snimek('rodic-p1-souhrn-375');
  } else {
    console.warn('  ! žádné dokončené sezení P1 — souhrn přeskočen');
  }

  // 6) tisk P1 (A4 náhled na obrazovce, 900 px) — vždy světlý (tisk.html nečte motiv)
  await viewport(900, 1200);
  await jdiNa(`${WEB}/tisk.html?lekce=P1&dite=${dite.id}${q}`);
  await pockej(`document.querySelector('.tisk-uloha') && ${nactene}`, 'tisk');
  await snimek('tisk-p1');

  if (dalsi) {
    // 7) další stránky pro kontrolu konzistence (C): landing, registrace, dotazník, admin
    await nastav('rodic');
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/dotaznik.html`);
    await pockej(`document.querySelector('form, .prazdny-stav, .hlaska') && ${nactene}`, 'dotazník');
    await snimek('dotaznik-375');
    await jdiNa(`${WEB}/index.html`);
    await pockej('document.querySelector("footer")', 'landing');
    await snimek('index-375');
    await viewport(1280, 900);
    await snimek('index-1280');
    const prerusenoPred = await prerusitP1();
    console.log(`  úklid před odhlášením: přerušeno sezení P1: ${prerusenoPred}`);
    await js(`import('./js/supabase.js').then((m) => m.odhlasit()).then(() => true)`);
    await viewport(375, 812, true);
    await jdiNa(`${WEB}/registrace.html`);
    await pockej('document.querySelector("form")', 'registrace');
    await snimek('registrace-375');
    if (ucty.admin) {
      await viewport(1280, 900);
      await js(`import('./js/supabase.js').then((m) => m.prihlasit(${JSON.stringify(ucty.admin.email)}, ${JSON.stringify(ucty.admin.heslo)})).then(() => true)`);
      await jdiNa(`${WEB}/admin.html`);
      try { await pockej(`document.querySelector('.tabulka tbody tr')`, 'admin', 30000); }
      catch (e) { console.warn(`  ! admin: ${e.message}; URL ${await js('location.href')}`); }
      await snimek('admin-1280');
    }
  }

  if (!dalsi) console.log(`  úklid: přerušeno sezení P1: ${await prerusitP1()}`);
} catch (e) {
  if (!e.b4) {
    console.error('CHYBA:', e.message);
    process.exitCode = 1;
  }
} finally {
  try { ws.close(); } catch { /* nic */ }
  chrome.kill();
  server.close();
  await cekej(500);
  await rm(profil, { recursive: true, force: true }).catch(() => {});
}
