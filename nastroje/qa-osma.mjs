#!/usr/bin/env node
// =====================================================================
// qa-osma.mjs — QA průchod Spolu 8 v prohlížeči: všechny lekce obou předmětů žák → rodič → tisk a režim „Dnes samo“,
// úvodní test (diagnostika) → výsledek u rodiče → doporučené pořadí v přehledu, přehled, úvodní stránka a registrace.
// Jen pro vývoj, nenasazuje se. Nic nemění v obsah/ ani ve web/.
//
//   node nastroje/qa-osma.mjs                       → lekce z obsah/ (obsah/lekce + obsah/cestina/lekce)
//   node nastroje/qa-osma.mjs --synteticke          → syntetické lekce z testy/data/osma/ (než autoři dopíší)
//   volby: --lekce=M8-T01-L1,cj-t1-l4   --bez-prehledu   --bez-samo   --md <soubor>   --snimky <adresář>
//
// Bez Supabase: nastroje/staticky-server.mjs --fake (supabase-js → nastroje/fake-supabase.js, DB v localStorage),
// obsah lekcí ze souborů (?lokalne=1). Knihovny z CDN stáhne curl (prohlížeč za proxy nemusí věřit její CA), Google
// Fonts se blokují. Playwright z /opt/node22/lib/node_modules/playwright, Chromium /opt/pw-browsers (s --no-sandbox).
//
// Co se ověří:
//   Žák 360 (rezim app): každý krok — prázdné odevzdání = výzva, u úlohy 2 a poslední (kontrolní/semafor) 2× chybně
//     („nesedí“ bez zvýraznění), jinak správná odpověď z JSON = správně; panel „Úloha n z/ze N“; konec lekce.
//   Rodič 375 na stejném sezení: brána ①–④, stav žáka po chybě, „Co vidí dítě“ bez řešení, tahák rozbalený,
//     semafor, souhrn (kontrolní úloha špatně + „Sám/sama“ = oranžová), Ukončit lekci.
//   Tisk: tolik úloh, kolik má lekce; nikde „CERMAT“ ani „přijímačky“.
//   Dnes samo (žák 360, rezim samo): úvodní hláška, nápovědy z taháku (u rozcvičky češtiny po řadách),
//     kontrolní / samostatná úloha: nápověda až po prvním pokusu; konec lekce = sezení dokončené se souhrnem
//     (samo: true, barvy všech úloh); rodič pak vidí souhrn „Lekce proběhla bez vás“.
//   Úvodní test (každý předmět): žák projde test (úlohy tématu 1 chybně, ostatní správně), přestávka v polovině,
//     konec bez výsledku; sezení se dokončí se souhrnem po tématech; rodič vidí „Výsledek úvodního testu“
//     (Kde začít: téma 1); přehled: „Doporučeno teď“ = lekce tématu 1, silná témata na konci se štítkem „Jde to“.
//   Přehled: záložky Matematika | Čeština (výchozí obě), témata „Téma n · …“, karty s počtem úloh a minut z dat,
//     „Doporučeno teď“, úvodní test, žádné přijímačky / pilot / fáze / cena.
//   Úvodní stránka a registrace: texty Spolu 8, bez ceny a pilotu, registrace bez typu školy a známky.
//   Na každé obrazovce: konzole bez chyb (kromě MP3 a písem), žádný vodorovný scroll, žádné „undefined“ / „null“ /
//   „[object Object]“ / „NaN“ / nevyplněná {proměnná} / nepřeložený klíč hlášky.
// =====================================================================

import { writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { vyhodnotKrok } from '../web/js/vyhodnoceni.js';
import { HLASKY } from '../web/js/hlasky.js';
import { zeZ } from '../web/js/temata.js';
import { lzeSamo } from '../web/js/samo.js';
import { vytvorServer, nactiLekce, polozkaKatalogu } from './staticky-server.mjs';

const argv = process.argv.slice(2);
const arg = (k) => { const i = argv.findIndex((a) => a === `--${k}` || a.startsWith(`--${k}=`)); if (i < 0) return null; return argv[i].includes('=') ? argv[i].split('=').slice(1).join('=') : argv[i + 1]; };
const SYNTETICKE = argv.includes('--synteticke');
const SNIMKY = arg('snimky');
const MD = arg('md');
const DITE = '00000000-0000-4000-8000-0000000000d1'; // výchozí dítě fake-supabase.js
/** Na žádné obrazovce Spolu 8 (aplikace i obsah). */
const ZAKAZANE = /přijímač|CERMAT|\bpilot|Fáze [12]|předprodej|simulace|dotazník/i;
/** Navíc na přehledu, úvodní stránce a registraci: žádná cena (v úlohách jsou koruny v pořádku). */
const ZAKAZANE_CENA = /\d\s*Kč/;

let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright')); }

const VSECHNY = await nactiLekce({ synteticke: SYNTETICKE });
if (!VSECHNY.length) { console.error(`Žádné lekce v ${SYNTETICKE ? 'testy/data/osma' : 'obsah/'} — pro syntetické spusť s --synteticke.`); process.exit(1); }
const PODLE_ID = new Map(VSECHNY.map((l) => [l.id, l]));
const KATALOG = VSECHNY.map((l) => polozkaKatalogu(l));
const vyber = arg('lekce') ? arg('lekce').split(',').map((x) => x.trim()) : null;
const LEKCE = VSECHNY.filter((l) => l.typ !== 'diagnostika' && (!vyber || vyber.includes(l.id)));
const DIAGNOSTIKY = VSECHNY.filter((l) => l.typ === 'diagnostika' && (!vyber || vyber.includes(l.id)));

// ---------- server a prohlížeč ----------
const server = vytvorServer({ fake: true, synteticke: SYNTETICKE });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const WEB = `http://127.0.0.1:${server.address().port}/web`;
const CHROMIUM = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome']
  .find((p) => { try { execFileSync('test', ['-x', p]); return true; } catch { return false; } });
const prohlizec = await chromium.launch({ ...(CHROMIUM ? { executablePath: CHROMIUM } : {}), args: ['--no-sandbox'] });
const cdn = new Map();
const nalezy = []; // {kde, co}
const tabulka = []; // řádky výsledku

async function novyKontext({ sirka = 360, role = null } = {}) {
  const ctx = await prohlizec.newContext({ viewport: { width: sirka, height: 760 }, deviceScaleFactor: 1 });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await ctx.route(/supabase\.co/, (r) => r.abort());
  await ctx.route(/^https:\/\/cdn\.jsdelivr\.net\//, async (r) => {
    const url = r.request().url();
    if (!cdn.has(url)) cdn.set(url, execFileSync('curl', ['-sSL', '--max-time', '60', url], { maxBuffer: 50e6 }));
    const typ = /\.css(\?|$)/.test(url) ? 'text/css' : /\.woff2/.test(url) ? 'font/woff2' : /\.woff(\?|$)/.test(url) ? 'font/woff' : /\.ttf/.test(url) ? 'font/ttf' : 'text/javascript; charset=utf-8';
    await r.fulfill({ status: 200, body: cdn.get(url), contentType: typ, headers: { 'access-control-allow-origin': '*' } });
  });
  await ctx.addInitScript(({ katalog, DITE, role }) => {
    if (localStorage.getItem('qa.init')) return;
    localStorage.clear();
    localStorage.setItem('qa.init', '1');
    localStorage.setItem('spolu.fake-katalog', JSON.stringify(katalog));
    localStorage.setItem('spolu.dite', DITE);
    localStorage.setItem('spolu.manual-precteno', '1');
    localStorage.setItem('spolu.manual-precteno.cestina', '1');
    if (role) localStorage.setItem('spolu.role', role);
  }, { katalog: KATALOG, DITE, role });
  return ctx;
}

function sledujKonzoli(page) {
  const chyby = [];
  page.on('console', (m) => { if (m.type() === 'error') chyby.push(`${m.text()} @ ${m.location()?.url || ''}`); });
  page.on('pageerror', (e) => chyby.push(`pageerror: ${e.message}`));
  return () => chyby.filter((c) => !/\.mp3|fonts\.g|supabase\.co|net::ERR_|Failed to load resource/.test(c));
}

/** Obecné kontroly obrazovky: vodorovný scroll, podezřelé texty, zakázaná slova Spolu 8. */
async function kontrolaObrazovky(page, pridej, kde, { zakazane = true, cena = false } = {}) {
  const r = await page.evaluate(() => {
    const sirka = document.documentElement.clientWidth;
    const text = document.body.innerText;
    return {
      pretece: document.documentElement.scrollWidth > sirka + 1, sirka, text,
      podezrele: [...new Set(text.match(/\bundefined\b|\[object Object\]|\bNaN\b|\bnull\b|\{[a-z_]+\}|\b(cj|osma|diag|samo|zak|rodic)\.[a-z_]+\b/g) || [])],
    };
  });
  if (r.pretece) pridej(`${kde}: vodorovný scroll na ${r.sirka} px`);
  if (r.podezrele.length) pridej(`${kde}: text obsahuje ${r.podezrele.join(', ')}`);
  const z = zakazane && r.text.match(ZAKAZANE);
  if (z) pridej(`${kde}: na obrazovce je „${z[0]}“ (Spolu 8 bez přijímaček, pilotu a ceny)`);
  const c = cena && r.text.match(ZAKAZANE_CENA);
  if (c) pridej(`${kde}: na obrazovce je cena „${c[0]}“`);
}

// ---------- odpovědi dítěte ----------
const vnoreny = (k) => (k.vstup.typ === 'poslech' ? k.vstup.vnoreny_vstup : k.vstup);
const cisloText = (x) => String(x).replace('.', ',');
function spravna(k) {
  const v = vnoreny(k);
  if (v.typ === 'dlazdice') return v.moznosti.find((m) => m.spravne).id;
  if (v.typ === 'diktat') return v.vety.map((x) => x.text);
  if (v.typ === 'cislo') return cisloText(k.spravne.hodnota);
  if (v.typ === 'zlomek') return { c: String(k.spravne.c), j: String(k.spravne.j) };
  if (v.typ === 'smisene') return { cela: String(k.spravne.cela), c: String(k.spravne.c), j: String(k.spravne.j) };
  if (v.typ === 'vyraz') return k.spravne.vyraz;
  if (v.typ === 'poradi') return k.spravne.poradi[0];
  return k.spravne;
}
/** Chybná odpověď — přednostně známá chyba, jinak obecná. Musí být platná a nesprávná. */
function chybna(k, poradi = 0) {
  const v = vnoreny(k);
  const kandidati = [];
  if (v.typ === 'dlazdice') {
    const m = v.moznosti.filter((x) => !x.spravne);
    kandidati.push(...m.filter((x) => x.typ_chyby).map((x) => x.id), ...m.map((x) => x.id));
  } else if (v.typ === 'cislo') {
    kandidati.push(...(k.zname_chyby || []).map((z) => cisloText(z.hodnota)), '987654', '987653');
  } else if (v.typ === 'zlomek') {
    kandidati.push(...(k.zname_chyby || []).map((z) => ({ c: String(z.c), j: String(z.j) })), { c: '97', j: '89' }, { c: '98', j: '89' });
  } else if (v.typ === 'smisene') {
    kandidati.push(...(k.zname_chyby || []).map((z) => ({ cela: String(z.cela), c: String(z.c), j: String(z.j) })), { cela: '9', c: '1', j: '7' }, { cela: '8', c: '1', j: '7' });
  } else if (v.typ === 'vyraz') {
    kandidati.push(...(k.zname_chyby || []).map((z) => z.vyraz), 'x+987', 'x+986');
  } else if (v.typ === 'poradi') {
    kandidati.push(...(k.zname_chyby || []).map((z) => z.poradi), [...k.spravne.poradi[0]].reverse());
  } else if (v.typ === 'klik_ve_textu' || v.typ === 'dlazdice_vice') {
    const sp = k.spravne;
    for (const z of k.zname_chyby || []) {
      if (z.hodnota) kandidati.push(z.hodnota);
      for (const x of z.navic || []) kandidati.push([...sp, x].slice(-(v.max ?? 99)));
      for (const x of z.chybi || []) kandidati.push(sp.filter((y) => y !== x));
    }
    if (v.typ === 'dlazdice_vice') kandidati.push(...v.moznosti.filter((x) => !sp.includes(x)).map((x) => [x]));
    else kandidati.push(...[...Array(40).keys()].filter((i) => !sp.includes(i) && !(v.volitelne || []).includes(i)).map((i) => [i]));
  } else if (v.typ === 'oznac_role') {
    for (const z of k.zname_chyby || []) {
      const h = structuredClone(k.spravne);
      for (const [kl, val] of Object.entries(z.hodnota)) h[kl] = typeof val === 'object' ? { ...h[kl], ...val } : val;
      kandidati.push(h);
    }
    kandidati.push(Object.fromEntries(Object.entries(k.spravne).map(([i, r]) => [i, typeof r === 'string' ? v.role.find((x) => x !== r)
      : Object.fromEntries(Object.entries(r).map(([kat, x]) => [kat, v.role[kat].find((y) => y !== x)]))])));
  } else if (v.typ === 'doplnit_pismeno') {
    for (const z of k.zname_chyby || []) kandidati.push(k.spravne.map((x, i) => z.hodnota[i] ?? x));
    kandidati.push(k.spravne.map((x, i) => v.mezery[i].moznosti.find((m) => m !== x)));
  } else if (v.typ === 'kratky_text') {
    kandidati.push(...(k.zname_chyby || []).map((z) => z.hodnota), `${k.spravne}x`);
  } else if (v.typ === 'seradit') {
    kandidati.push(...(k.zname_chyby || []).map((z) => z.hodnota), [...k.spravne].reverse(),
      ...k.spravne.slice(1).map((_, i) => { const x = [...k.spravne]; [x[i], x[i + 1]] = [x[i + 1], x[i]]; return x; }));
  } else if (v.typ === 'diktat') {
    kandidati.push(v.vety.map((x) => x.text.replace(/\p{L}+/u, 'blabla')), v.vety.map((x) => x.text.replace(/\p{L}+/u, 'blablo')));
  }
  const platne = kandidati.filter((h) => { try { const r = vyhodnotKrok(k, h); return !r.neplatne && r.spravne === false; } catch { return false; } });
  const ruzne = [...new Map(platne.map((h) => [JSON.stringify(h), h])).values()];
  return ruzne[Math.min(poradi, ruzne.length - 1)];
}

async function vypln(page, sekce, k, odp) {
  const v = vnoreny(k);
  const presne = (t) => new RegExp(`^\\s*${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
  switch (v.typ) {
    case 'dlazdice': await sekce.locator(`.dlazdice[data-id="${odp}"]`).click(); break;
    case 'cislo': await sekce.locator('input.pole').first().fill(odp); break;
    case 'zlomek': { const p = sekce.locator('.zlomek-vstup input'); await p.nth(0).fill(odp.c); await p.nth(1).fill(odp.j); break; }
    case 'smisene': { await sekce.locator('.smisene-vstup__cela').fill(odp.cela); const p = sekce.locator('.zlomek-vstup input'); await p.nth(0).fill(odp.c); await p.nth(1).fill(odp.j); break; }
    case 'vyraz': await sekce.locator('input.pole--vyraz').fill(odp); break;
    case 'poradi':
      if (await sekce.locator('.poradi__znovu').isVisible().catch(() => false)) await sekce.locator('.poradi__znovu').click().catch(() => {});
      // vnořené operace (odmocnina přes celý výraz): klik přímo na prvek, ne doprostřed (tam je vnitřní znak)
      for (const id of odp) await sekce.locator(`[data-op="${id}"]`).first().dispatchEvent('click');
      break;
    case 'klik_ve_textu':
      for (let n = 0; n < 50 && await sekce.locator('.cj-slovo.je-vybrano, .cj-mezera.je-vybrano').count(); n += 1) await sekce.locator('.cj-slovo.je-vybrano, .cj-mezera.je-vybrano').first().click();
      for (const i of odp) await sekce.locator(`${v.cil === 'mezery' ? '.cj-mezera' : '.cj-slovo'}[data-i="${i}"]`).click();
      break;
    case 'dlazdice_vice':
      for (let n = 0; n < 50 && await sekce.locator('.cj-dlazdice-vice.je-vybrano').count(); n += 1) await sekce.locator('.cj-dlazdice-vice.je-vybrano').first().click();
      for (const m of odp) await sekce.locator('.cj-dlazdice-vice').filter({ hasText: presne(m) }).click();
      break;
    case 'oznac_role':
      for (const [i, role] of Object.entries(odp)) {
        const b = sekce.locator(`.cj-slovo--role[data-i="${i}"]`);
        if ((await b.getAttribute('aria-expanded')) !== 'true') await b.click();
        if (typeof role === 'string') await sekce.locator('.cj-nabidka .cj-volba').filter({ hasText: presne(role) }).click();
        else {
          for (const [kat, x] of Object.entries(role)) {
            await sekce.locator('.cj-nabidka__skupina').filter({ has: page.locator('.cj-nabidka__nazev', { hasText: presne(HLASKY[`cj.kategorie_${kat}`] ?? kat) }) })
              .locator('.cj-volba').filter({ hasText: presne(x) }).click();
          }
          await sekce.locator('.cj-nabidka__akce button').click();
        }
      }
      break;
    case 'doplnit_pismeno':
      for (let i = 0; i < odp.length; i += 1) {
        const m = sekce.locator('.cj-mezera-pismeno').nth(i);
        if (await m.locator('.cj-doplneno').count()) await m.locator('.cj-doplneno').click();
        await m.locator(`.cj-pismeno[data-hodnota="${odp[i]}"]`).click();
      }
      break;
    case 'kratky_text': await sekce.locator('input.cj-pole').fill(odp); break;
    case 'seradit':
      if (await sekce.locator('.cj-polozka.je-vybrano').count()) await sekce.getByRole('button', { name: 'Začít znovu' }).click();
      for (const p of odp) await sekce.locator('.cj-polozka').filter({ hasText: presne(p) }).click();
      break;
    case 'diktat':
      for (let i = 0; i < odp.length; i += 1) {
        if (i > 0 && await sekce.locator('.cj-diktat__dalsi:not([hidden])').count()) await sekce.locator('.cj-diktat__dalsi').click();
        await sekce.locator('textarea.cj-diktat__pole').nth(i).fill(odp[i]);
      }
      break;
    default: throw new Error(`neumím vyplnit ${v.typ}`);
  }
}

async function odevzdej(page, sekce) {
  await sekce.getByRole('button', { name: 'Odevzdat krok' }).click();
  await page.waitForTimeout(140);
  const zv = sekce.locator('.zpetna-vazba');
  return { druh: (await zv.getAttribute('class')) || '', text: ((await zv.textContent()) || '').trim() };
}

async function projdiPripravit(page) {
  await page.waitForSelector('.pripravit, .lekce-zak, .konec-lekce', { timeout: 20000 });
  if (await page.locator('.pripravit').count()) {
    for (const c of await page.locator('.pripravit input[type=checkbox]').all()) await c.check();
    await page.locator('.pripravit button.tlacitko--primarni').click();
  }
  await page.waitForSelector('.lekce-zak, .konec-lekce', { timeout: 20000 });
}

const jeHlavni = (u) => u.typ === 'kontrolni' || u.typ === 'semafor';
/** Úlohy, které dítě odevzdá 2× špatně: 2. úloha a poslední (kontrolní / samostatná). */
const spatneUlohy = (l) => [1, l.ulohy.length - 1];

// ---------- žák (aplikace i samo) ----------
async function zak(ctx, l, pridej, { samo = false } = {}) {
  const page = await ctx.newPage();
  try { return await zakPruchod(page, l, pridej, { samo }); } catch (e) {
    if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${l.id}-${samo ? 'samo' : 'zak'}-pad.png`), fullPage: true }).catch(() => {});
    throw new Error(`${page.qaKde || '?'}: ${e.message.split('\n')[0]}`);
  }
}

async function zakPruchod(page, l, pridej, { samo = false } = {}) {
  const konzole = sledujKonzoli(page);
  const kdo = samo ? 'samo' : 'žák';
  await page.goto(`${WEB}/lekce.html?lekce=${l.id}&dite=${DITE}&lokalne=1&rezim=${samo ? 'samo' : 'app'}`);
  await projdiPripravit(page);
  if (await page.locator('.hlaska', { hasText: 'neukládají' }).count()) pridej(`${kdo}: lekce běží bez ukládání (sezení nevzniklo)`);
  if (samo && !(await page.locator('.hlaska', { hasText: 'Dnes pracuješ' }).count())) pridej('samo: chybí úvodní hláška pro dítě');
  const odevzdano = {};
  const spatne = spatneUlohy(l);
  for (const [ui, u] of l.ulohy.entries()) {
    await page.waitForFunction((n) => document.querySelector('.karta-ulohy .stitek--navy')?.textContent === `Úloha ${n}`, ui + 1, { timeout: 15000 });
    if (samo) {
      // nápovědy z taháku: kontrolní / samostatná až po prvním pokusu, ostatní hned
      const tl = page.locator('.samo-napoveda-blok button', { hasText: 'Nevím, jak dál' });
      const videt = await tl.isVisible().catch(() => false);
      if (jeHlavni(u) && videt) pridej(`samo ${u.id}: nápověda kontrolní úlohy je vidět před prvním pokusem`);
      if (!jeHlavni(u) && !videt) pridej(`samo ${u.id}: chybí tlačítko „Nevím, jak dál“`);
      if (!jeHlavni(u) && videt && ui === 0) {
        await tl.click();
        const t = await page.locator('.samo-napoveda').first().innerText().catch(() => '');
        if (!t || /^„/.test(t.split('\n').pop())) pridej(`samo ${u.id}: nápověda „${t.slice(0, 80)}“`);
        if (l.predmet === 'cestina' && !/· [A-F]/.test(t)) pridej(`samo ${u.id}: nápověda rozcvičky češtiny bez řady (k): „${t.slice(0, 60)}“`);
      }
    }
    for (const [ki, k] of u.kroky.entries()) {
      const kde = `${kdo} ${u.id.split('-').pop()}/${k.id}`;
      page.qaKde = kde;
      const sekce = page.locator('.lekce-zak section.krok').nth(ki);
      await sekce.waitFor();
      if (k.vstup.typ === 'poslech' && !(await sekce.locator('audio').count())) pridej(`${kde}: poslech bez přehrávače`);
      const prazdne = await odevzdej(page, sekce);
      if (!prazdne.druh.includes('poznamka')) pridej(`${kde}: prázdné odevzdání → „${prazdne.text}“ (čekána výzva)`);
      const kolikSpatne = spatne.includes(ui) ? 2 : 0;
      for (let p = 0; p < kolikSpatne; p += 1) {
        const ch = chybna(k, p);
        if (ch === undefined) { pridej(`${kde}: nešla sestavit chybná odpověď`); break; }
        await vypln(page, sekce, k, ch);
        const r = await odevzdej(page, sekce);
        if (!r.druh.includes('zpetna-vazba--nesedi')) pridej(`${kde}: chybná odpověď → „${r.text}“`);
        odevzdano[`${u.id}/${k.id}`] = ch;
        if (samo && jeHlavni(u) && p === 0 && k === u.kroky[0]) {
          await page.waitForTimeout(100);
          if (!(await page.locator('.samo-napoveda-blok button', { hasText: 'Nevím, jak dál' }).isVisible().catch(() => false))) {
            pridej(`samo ${u.id}: po prvním pokusu se nápověda kontrolní úlohy neodemkla`);
          }
        }
        if (await sekce.locator('.krok--hotovy').count() || (await sekce.getAttribute('class'))?.includes('krok--hotovy')) break;
      }
      if (kolikSpatne < 2) {
        await vypln(page, sekce, k, spravna(k));
        const r = await odevzdej(page, sekce);
        if (!r.druh.includes('zpetna-vazba--spravne') && !r.druh.includes('poznamka')) pridej(`${kde}: správná odpověď z JSON → „${r.text}“`);
        odevzdano[`${u.id}/${k.id}`] = spravna(k);
      }
    }
    await kontrolaObrazovky(page, pridej, `${kdo} úloha ${ui + 1}`);
    if (SNIMKY && (ui === 0 || ui === l.ulohy.length - 1)) await page.screenshot({ path: join(SNIMKY, `${l.id}-${samo ? 'samo' : 'zak'}-360-U${ui + 1}.png`), fullPage: true });
    const panel = page.locator('.karta.zasobnik[role=status]').last();
    const text = (await panel.locator('p').textContent()) || '';
    const n = l.ulohy.length;
    if (ui < n - 1 && n !== 4 && !text.includes(`${zeZ(n)} ${n}`)) pridej(`${kdo} úloha ${ui + 1}: panel „${text}“ (čekáno „… ${zeZ(n)} ${n}“)`);
    await panel.locator('button').click();
  }
  await page.waitForSelector('.konec-lekce', { timeout: 15000 });
  await page.waitForTimeout(600);
  await kontrolaObrazovky(page, pridej, `${kdo} konec lekce`);
  if (samo) {
    const s = await page.evaluate((id) => JSON.parse(localStorage.getItem('spolu.fake-db')).sezeni.filter((x) => x.lekce_id === id && x.rezim === 'samo').at(-1), l.id);
    if (s?.stav !== 'dokonceno') pridej(`samo: sezení po konci lekce není dokončené (${s?.stav})`);
    else {
      if (!s.souhrn?.samo) pridej('samo: souhrn sezení nemá příznak samo');
      if (Object.keys(s.souhrn?.barvy || {}).length !== l.ulohy.length) pridej(`samo: souhrn má barvy ${Object.keys(s.souhrn?.barvy || {}).length} úloh z ${l.ulohy.length}`);
      if (s.souhrn?.pocetUloh !== l.ulohy.length) pridej(`samo: souhrn.pocetUloh ${s.souhrn?.pocetUloh}`);
    }
    // rodič: souhrn lekce bez rodiče
    await page.evaluate(() => localStorage.setItem('spolu.role', 'rodic'));
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(`${WEB}/rodic.html?lekce=${l.id}&dite=${DITE}&lokalne=1&sezeni=${s?.id}`);
    await page.waitForSelector('.souhrn', { timeout: 15000 }).catch(() => pridej('samo → rodič: chybí souhrn lekce'));
    if (!(await page.locator('.hlaska', { hasText: 'Lekce proběhla bez vás' }).count())) pridej('samo → rodič: chybí hláška „Lekce proběhla bez vás“');
    await kontrolaObrazovky(page, pridej, 'samo → rodič souhrn');
    if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${l.id}-samo-rodic-375.png`), fullPage: true });
  }
  for (const c of konzole()) pridej(`${kdo} konzole: ${c.slice(0, 200)}`);
  await page.close();
  return odevzdano;
}

// ---------- rodič (na sezení žáka) ----------
async function rodic(ctx, l, odevzdano, pridej) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 375, height: 800 });
  const konzole = sledujKonzoli(page);
  await page.goto(`${WEB}/prehled.html`);
  await page.evaluate(() => localStorage.setItem('spolu.role', 'rodic'));
  await page.goto(`${WEB}/rodic.html?lekce=${l.id}&dite=${DITE}&lokalne=1`);
  await page.waitForSelector('.prepinac-uloh', { timeout: 20000 });
  const spatne = spatneUlohy(l);
  for (const [ui, u] of l.ulohy.entries()) {
    const kde = `rodič úloha ${ui + 1} (${u.typ})`;
    await page.waitForFunction((n) => document.querySelector('.prepinac-uloh__nazev strong')?.textContent.startsWith(`Úloha ${n} `), ui + 1, { timeout: 15000 });
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const d = document.querySelector('#spodniLista button.tlacitko--primarni');
      const stav = document.querySelector('.stav-zaka');
      const nazev = document.querySelector('.prepinac-uloh__nazev strong')?.textContent || '';
      const coVidi = [...document.querySelectorAll('details.rozbalovaci')].find((x) => x.querySelector('summary')?.textContent.includes('Co vidí dítě'));
      return {
        nazev, dalsiZamceno: d ? d.disabled : null, stav: stav?.innerText || '',
        reseniVNahledu: coVidi ? coVidi.querySelectorAll('.je-spravne, .je-vybrano, [class*="--spravne"]').length : -1,
      };
    });
    if (!r.nazev.includes(`${zeZ(l.ulohy.length)} ${l.ulohy.length}`)) pridej(`${kde}: přepínač úloh „${r.nazev}“`);
    if (r.dalsiZamceno !== true) pridej(`${kde}: „Další“ není zamčené po otevření úlohy (brána ①–④, R28)`);
    if (r.reseniVNahledu > 0) pridej(`${kde}: „Co vidí dítě“ ukazuje výběr nebo řešení`);
    if (r.reseniVNahledu < 0) pridej(`${kde}: chybí „Co vidí dítě“`);
    if (spatne.includes(ui) && !/nesedí/.test(r.stav)) pridej(`${kde}: stav žáka po chybě neukazuje „nesedí“`);
    await page.evaluate(async () => {
      const spi = (ms) => new Promise((x) => setTimeout(x, ms));
      document.querySelectorAll('#obsah details').forEach((d) => { d.open = true; });
      for (let i = 0; i < 4; i += 1) {
        const b = [...document.querySelectorAll('#obsah button')].find((x) => /Další otázka/.test(x.textContent) && !x.disabled);
        if (!b) break; b.click(); await spi(80);
      }
      document.querySelectorAll('#obsah details').forEach((d) => { d.open = true; });
    });
    await kontrolaObrazovky(page, pridej, `${kde} (tahák rozbalený)`);
    if (SNIMKY && (ui === 1 || ui === l.ulohy.length - 1)) await page.screenshot({ path: join(SNIMKY, `${l.id}-rodic-375-U${ui + 1}.png`), fullPage: true });
    const kroky = await page.evaluate(async () => {
      const spi = (ms) => new Promise((x) => setTimeout(x, ms));
      const log = [];
      for (const krok of ['cteni', 'otazky', 'otocena']) {
        const li = document.querySelector(`.postup-rodice__krok[data-krok="${krok}"]`);
        if (!li) continue;
        li.querySelector('details').open = true;
        const b = krok === 'otazky' ? [...li.querySelectorAll('.postup-rodice__akce button')].at(-1)
          : [...li.querySelectorAll('.postup-rodice__obsah > button.tlacitko--primarni')].at(-1);
        if (!b) { log.push(`krok ${krok}: chybí tlačítko`); continue; }
        b.click(); await spi(120);
      }
      const li = document.querySelector('.postup-rodice__krok[data-krok="semafor"]');
      if (!li) return { log: [...log, 'chybí krok ④'] };
      li.querySelector('details').open = true;
      const s = document.querySelector('.semafor-volba[data-volba="sam"]');
      if (!s) return { log: [...log, 'chybí tlačítko semaforu'] };
      s.click();
      for (let i = 0; i < 80; i += 1) { await spi(100); if (document.querySelector('.souhrn, .semafor-vysledek:not([hidden])')) break; }
      return { log, vysledek: document.querySelector('.semafor-vysledek:not([hidden])')?.textContent || '' };
    });
    for (const x of kroky.log) pridej(`${kde}: ${x}`);
    if (ui < l.ulohy.length - 1) {
      if (!kroky.vysledek) pridej(`${kde}: po semaforu se neukázal výsledek`);
      const b = page.locator('#spodniLista button.tlacitko--primarni');
      if (await b.isDisabled()) { pridej(`${kde}: „Další úloha“ zůstalo po semaforu zamčené`); break; }
      await b.click();
    }
  }
  await page.waitForSelector('.souhrn', { timeout: 15000 }).catch(() => pridej('rodič: chybí souhrn lekce'));
  await page.evaluate(() => document.querySelectorAll('#obsah details').forEach((d) => { d.open = true; }));
  await kontrolaObrazovky(page, pridej, 'rodič souhrn');
  const souhrn = await page.evaluate(() => document.querySelector('.souhrn')?.innerText || '');
  if (!/Oranžová/.test(souhrn)) pridej('rodič souhrn: hlavní úloha odevzdaná špatně + „Sám/sama“ má dát oranžovou (matice kostra/02)');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${l.id}-rodic-375-souhrn.png`), fullPage: true });
  const ukoncit = page.locator('#btnUkoncitLekci');
  if (await ukoncit.count()) {
    await ukoncit.click();
    await page.waitForSelector('#spodniLista a[href^="prehled.html"]', { timeout: 15000 }).catch(() => pridej('rodič: po „Ukončit lekci“ chybí návrat na přehled'));
  } else pridej('rodič souhrn: chybí „Ukončit lekci“');
  for (const c of konzole()) pridej(`rodič konzole: ${c.slice(0, 200)}`);
  await page.close();
}

async function tisk(ctx, l, pridej) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 900, height: 1200 });
  const konzole = sledujKonzoli(page);
  await page.goto(`${WEB}/tisk.html?lekce=${l.id}&lokalne=1`);
  await page.waitForSelector('.tisk-uloha', { timeout: 20000 }).catch(() => {});
  const r = await page.evaluate(() => ({ ulohy: document.querySelectorAll('.tisk-uloha').length, text: document.body.innerText }));
  if (r.ulohy !== l.ulohy.length) pridej(`tisk: ${r.ulohy} úloh, čekáno ${l.ulohy.length}`);
  if (l.predmet === 'cestina' && /Výpočet/.test(r.text)) pridej('tisk: rámeček „Výpočet“ u češtiny');
  await kontrolaObrazovky(page, pridej, 'tisk');
  await page.emulateMedia({ media: 'print' });
  await kontrolaObrazovky(page, pridej, 'tisk (print)');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${l.id}-tisk.png`), fullPage: true });
  for (const c of konzole()) pridej(`tisk konzole: ${c.slice(0, 200)}`);
  await page.close();
}

// ---------- úvodní test → výsledek → doporučené pořadí ----------
async function diagnostika(d, pridej) {
  const ctx = await novyKontext({ role: 'zak' });
  const page = await ctx.newPage();
  const konzole = sledujKonzoli(page);
  const predmet = d.predmet || 'matematika';
  // přehled žáka: karta úvodního testu → test
  await page.goto(`${WEB}/prehled.html?predmet=${predmet}`);
  await page.waitForSelector('.karta-lekce--diagnostika', { timeout: 20000 }).catch(() => pridej('přehled: chybí karta úvodního testu'));
  const karta = await page.locator('.karta-lekce--diagnostika').innerText().catch(() => '');
  if (!/Úvodní test \(\d+ min\)/.test(karta)) pridej(`přehled: karta testu „${karta.slice(0, 80)}“`);
  await page.locator('.karta-lekce--diagnostika button').click();
  await page.waitForURL(/lekce\.html/, { timeout: 10000 });
  // lokální obsah: diagnostika ze souboru (lekce.html bez lokalne si ji fake DB načte sama)
  await projdiPripravit(page);
  let prestavka = false;
  for (const [ui, u] of d.ulohy.entries()) {
    for (let i = 0; i < 60; i += 1) {
      if (await page.locator('.diag-prestavka').count()) { prestavka = true; await page.locator('.diag-prestavka button').click(); }
      const cislo = await page.locator('.karta-ulohy .stitek--navy').textContent().catch(() => '');
      if (cislo === `Úloha ${ui + 1}`) break;
      await page.waitForTimeout(150);
    }
    const k = u.kroky[0];
    const sekce = page.locator('.lekce-zak section.krok').first();
    await sekce.waitFor({ timeout: 10000 });
    const odp = u.tema === 1 ? chybna(k, 0) : spravna(k);
    if (odp === undefined) { pridej(`test ${u.id}: nešla sestavit odpověď`); continue; }
    await vypln(page, sekce, k, odp);
    const r = await odevzdej(page, sekce);
    if (r.text !== 'Uloženo.') pridej(`test ${u.id}: po odevzdání „${r.text}“ (čekáno jen „Uloženo.“)`);
    if (ui === 0) await kontrolaObrazovky(page, pridej, 'test úloha 1');
  }
  if (d.ulohy.length > 2 && !prestavka) pridej('test: chyběla přestávka v polovině');
  await page.waitForSelector('.konec-lekce', { timeout: 15000 }).catch(() => pridej('test: chybí konec'));
  await page.waitForTimeout(800);
  const konec = await page.locator('.konec-lekce').innerText().catch(() => '');
  if (/\d+ z(e)? \d+|%|správně/.test(konec)) pridej(`test: konec u žáka ukazuje výsledek: „${konec.slice(0, 120)}“`);
  await kontrolaObrazovky(page, pridej, 'test konec');
  const s = await page.evaluate((id) => JSON.parse(localStorage.getItem('spolu.fake-db')).sezeni.find((x) => x.lekce_id === id), d.id);
  if (s?.stav !== 'dokonceno' || !s.souhrn?.osma) pridej(`test: sezení se po poslední úloze nedokončilo se souhrnem Spolu 8 (${s?.stav})`);
  const t1 = s?.souhrn?.temata?.find((x) => x.tema === 1);
  if (t1 && t1.stav === 'silne') pridej('test: téma 1 (chybně) vyšlo jako silné');
  if (s?.souhrn?.poradi?.[0] !== 1) pridej(`test: doporučené pořadí začíná tématem ${s?.souhrn?.poradi?.[0]}, čekáno 1`);
  // rodič: výsledek
  await page.evaluate(() => localStorage.setItem('spolu.role', 'rodic'));
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${WEB}/rodic.html?lekce=${d.id}&dite=${DITE}&sezeni=${s?.id}`);
  await page.waitForSelector('.diag-vysledek--osma', { timeout: 20000 }).catch(() => pridej('rodič: chybí výsledek úvodního testu'));
  const vysl = await page.locator('#obsah').innerText().catch(() => '');
  for (const nadpis of ['Výsledek úvodního testu', 'Kde začít', 'Co zatím nejde', 'Co jde']) if (!vysl.includes(nadpis)) pridej(`rodič výsledek: chybí „${nadpis}“`);
  if (!/Začněte: Téma 1 ·/.test(vysl)) pridej(`rodič výsledek: „Kde začít“ nemíří na téma 1: ${vysl.slice(vysl.indexOf('Kde začít'), vysl.indexOf('Kde začít') + 120)}`);
  await kontrolaObrazovky(page, pridej, 'rodič výsledek testu');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${d.id}-rodic-vysledek.png`), fullPage: true });
  // přehled: Doporučeno teď = téma 1, silná témata na konci
  await page.goto(`${WEB}/prehled.html?predmet=${predmet}`);
  await page.waitForSelector('.doporuceno .karta-lekce', { timeout: 20000 }).catch(() => pridej('přehled po testu: chybí „Doporučeno teď“'));
  const p = await page.evaluate(() => ({
    doporuceno: document.querySelector('.doporuceno .karta-lekce__poradi')?.textContent || '',
    sekce: [...document.querySelectorAll('.tema-sekce')].map((x) => ({ id: x.id, stitek: x.querySelector('.tema-sekce__hlavicka .stitek')?.textContent.trim() || '' })),
    podnadpis: document.querySelector('.doporuceno p')?.textContent || '',
  }));
  if (!/Téma 1 ·/.test(p.doporuceno)) pridej(`přehled po testu: „Doporučeno teď“ = „${p.doporuceno}“, čekáno téma 1`);
  if (p.sekce[0]?.id !== `${predmet}-t1`) pridej(`přehled po testu: první téma ${p.sekce[0]?.id}`);
  const silna = p.sekce.filter((x) => x.stitek === 'Jde to');
  const prvniSilne = p.sekce.findIndex((x) => x.stitek === 'Jde to');
  if (!silna.length) pridej('přehled po testu: žádné téma se štítkem „Jde to“');
  if (prvniSilne >= 0 && p.sekce.slice(prvniSilne).some((x) => x.stitek !== 'Jde to')) pridej('přehled po testu: silná témata nejsou na konci');
  if (!/Podle úvodního testu/.test(p.podnadpis)) pridej(`přehled po testu: podnadpis „${p.podnadpis}“`);
  await kontrolaObrazovky(page, pridej, 'přehled po testu');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `prehled-375-po-testu-${predmet}.png`), fullPage: true });
  for (const c of konzole()) pridej(`test konzole: ${c.slice(0, 200)}`);
  await ctx.close();
}

// ---------- přehled, úvodní stránka, registrace ----------
async function prehled(pridej) {
  const ctx = await novyKontext({ role: 'zak' });
  const page = await ctx.newPage();
  const konzole = sledujKonzoli(page);
  for (const predmet of ['matematika', 'cestina']) {
    const lekcePredmetu = VSECHNY.filter((l) => (l.predmet || 'matematika') === predmet && l.typ !== 'diagnostika');
    if (!lekcePredmetu.length) continue;
    await page.goto(`${WEB}/prehled.html?predmet=${predmet}`);
    await page.waitForFunction(() => !document.getElementById('obsah')?.hasAttribute('aria-busy') && document.querySelector('.prehled-hlavicka'), null, { timeout: 20000 });
    const st = await page.evaluate(() => ({
      zalozky: [...document.querySelectorAll('.prepinac--predmet .prepinac__volba')].map((b) => b.textContent.trim()),
      sekce: [...document.querySelectorAll('.tema-sekce h2')].map((x) => x.textContent.trim()),
      meta: [...document.querySelectorAll('.tema-sekce .karta-lekce__meta')].map((x) => x.innerText.replace(/\s+/g, ' ').trim()),
      doporuceno: Boolean(document.querySelector('.doporuceno')),
    }));
    if (st.zalozky.join('|') !== 'Matematika|Čeština') pridej(`přehled: záložky „${st.zalozky.join('|')}“ (výchozí oba předměty)`);
    if (!st.doporuceno) pridej(`přehled ${predmet}: chybí „Doporučeno teď“`);
    const temata = [...new Set(lekcePredmetu.map((l) => l.tyden))];
    if (st.sekce.length !== temata.length || !st.sekce.every((x) => /^Téma \d+ · \S/.test(x))) pridej(`přehled ${predmet}: sekce „${st.sekce.join(' | ')}“`);
    const ocekavane = lekcePredmetu.map((l) => `${l.cas_min} min ${l.ulohy.length} úloh`);
    const chybne = st.meta.filter((m) => !ocekavane.some((o) => m.replace(/úlohy/, 'úloh') === o));
    if (chybne.length) pridej(`přehled ${predmet}: karty „${chybne.slice(0, 3).join(' / ')}“ nesedí s daty`);
    await kontrolaObrazovky(page, pridej, `přehled ${predmet} 360`, { cena: true });
    if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `prehled-360-${predmet}.png`), fullPage: true });
    // rodič: modal režimu nabízí „Dnes samo“
    await page.evaluate(() => localStorage.setItem('spolu.role', 'rodic'));
    await page.goto(`${WEB}/prehled.html?predmet=${predmet}`);
    await page.waitForSelector('.tema-sekce .karta-lekce button', { timeout: 20000 });
    await page.locator('.tema-sekce .karta-lekce button', { hasText: 'Začít lekci' }).first().click();
    if (!(await page.locator('#rezimSamo').isVisible())) pridej(`přehled ${predmet} rodič: v nabídce režimu chybí „Dnes samo“`);
    await page.locator('#modalRezim .modal__zavrit').click();
    await kontrolaObrazovky(page, pridej, `přehled ${predmet} rodič`);
    await page.evaluate(() => localStorage.setItem('spolu.role', 'zak'));
  }
  // úvodní stránka a registrace (bez přihlášení)
  for (const [stranka, kontrola] of [['index.html', null], ['registrace.html', async () => {
    const pole = await page.evaluate(() => ({ skola: Boolean(document.querySelector('[name=typ_skoly]')), znamka: Boolean(document.querySelector('[name=znamka]')),
      povinna: [...document.querySelectorAll('#formular-registrace input:not([type=checkbox]):not([type=radio])')].map((x) => x.id) }));
    if (pole.skola || pole.znamka) pridej('registrace: formulář chce typ školy nebo známku');
    if (pole.povinna.join(',') !== 'r-jmeno,r-email,r-heslo,r-dite') pridej(`registrace: pole ${pole.povinna.join(', ')}`);
    await page.locator('#formular-registrace button[type=submit]').click();
    const chyby = await page.locator('#formular-registrace .pole-chyba:not([hidden])').count();
    if (chyby < 4) pridej(`registrace: prázdný formulář ukázal ${chyby} chyb`);
  }]]) {
    await page.evaluate(() => localStorage.setItem('spolu.fake-odhlaseno', '1')); // registrace přihlášeného přesměruje
    await page.goto(`${WEB}/${stranka}`);
    await page.waitForTimeout(500);
    const t = await page.title();
    if (!/Spolu 8/.test(t)) pridej(`${stranka}: titulek „${t}“`);
    await kontrolaObrazovky(page, pridej, stranka, { cena: true });
    if (kontrola) await kontrola();
    if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${stranka.replace('.html', '')}-360.png`), fullPage: true });
  }
  for (const c of konzole()) pridej(`přehled konzole: ${c.slice(0, 200)}`);
  await ctx.close();
}

// ---------- běh ----------
if (SNIMKY) await mkdir(SNIMKY, { recursive: true });
const zaznam = (kde) => (co) => nalezy.push({ kde, co });
if (!argv.includes('--bez-prehledu')) {
  process.stdout.write('přehled, úvodní stránka, registrace…');
  try { await prehled(zaznam('přehled')); } catch (e) { zaznam('přehled')(`průchod spadl: ${e.message.split('\n')[0]}`); }
  console.log(' hotovo');
  for (const d of DIAGNOSTIKY) {
    process.stdout.write(`${d.id}: test → výsledek → doporučení…`);
    try { await diagnostika(d, zaznam(d.id)); } catch (e) { zaznam(d.id)(`průchod spadl: ${e.message.split('\n')[0]}`); }
    console.log(' hotovo');
  }
}
for (const l of LEKCE) {
  const radek = { lekce: l.id, zak: '✓', rodic: '✓', tisk: '✓', samo: argv.includes('--bez-samo') ? '–' : '✓' };
  const cast = (sloupec) => (co) => { nalezy.push({ kde: l.id, co }); radek[sloupec] = '✗'; };
  const ctx = await novyKontext();
  process.stdout.write(`${l.id}: žák…`);
  let odevzdano = {};
  try { odevzdano = await zak(ctx, l, cast('zak')); } catch (e) { cast('zak')(`žák: průchod spadl: ${e.message.split('\n')[0]}`); }
  process.stdout.write(' rodič…');
  try { await rodic(ctx, l, odevzdano, cast('rodic')); } catch (e) { cast('rodic')(`rodič: průchod spadl: ${e.message.split('\n')[0]}`); }
  process.stdout.write(' tisk…');
  try { await tisk(ctx, l, cast('tisk')); } catch (e) { cast('tisk')(`tisk: spadl: ${e.message.split('\n')[0]}`); }
  await ctx.close();
  if (!argv.includes('--bez-samo')) {
    process.stdout.write(' samo…');
    if (!lzeSamo(l)) cast('samo')('lekce nejde v režimu „Dnes samo“ (lzeSamo)');
    else {
      const ctxSamo = await novyKontext();
      try { await zak(ctxSamo, l, cast('samo'), { samo: true }); } catch (e) { cast('samo')(`samo: průchod spadl: ${e.message.split('\n')[0]}`); }
      await ctxSamo.close();
    }
  }
  console.log(' hotovo');
  tabulka.push(radek);
}
await prohlizec.close();
server.close();

const vystup = [
  `Zdroj lekcí: ${SYNTETICKE ? 'testy/data/osma (syntetické)' : 'obsah/'} · ${LEKCE.length} lekcí, ${DIAGNOSTIKY.length} úvodních testů`,
  '',
  '| lekce | žák 360 | rodič 375 | tisk | Dnes samo (+ rodič souhrn) |',
  '|---|---|---|---|---|',
  ...tabulka.map((r) => `| ${r.lekce} | ${r.zak} | ${r.rodic} | ${r.tisk} | ${r.samo} |`),
  '',
  nalezy.length ? nalezy.map((n) => `- ✗ ${n.kde}: ${n.co}`).join('\n') : 'Bez nálezů.',
].join('\n');
console.log(`\n${vystup}`);
if (MD) await writeFile(MD, `${vystup}\n`);
process.exit(nalezy.length ? 1 : 0);
