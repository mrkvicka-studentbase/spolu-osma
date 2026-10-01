#!/usr/bin/env node
// =====================================================================
// qa-cestina.mjs — QA průchod lekcí češtiny celou cestou žák → rodič → tisk. Jen pro vývoj, nenasazuje se.
//
//   node nastroje/qa-cestina.mjs                          → všechny obsah/cestina/lekce/*.json
//   node nastroje/qa-cestina.mjs --lekce=cj-t1-l1,cj-t1-l4 --md cestina/QA-CESTINA.md --snimky <adresář>
//
// Bez Supabase: supabase-js se nahradí nastroje/fake-supabase.js (DB v localStorage prohlížeče), obsah lekcí
// ze souborů (?lokalne=1) — stejně jako nastroje/qa-sezona.mjs. Knihovny z CDN stáhne curl (prohlížeč za proxy
// nemusí věřit její CA), Google Fonts se blokují (záložní písmo).
// Prohlížeč: Playwright (globální instalace nebo node_modules), Chromium z PLAYWRIGHT_BROWSERS_PATH.
//
// Co se ověří u každé lekce:
//   Žák 360 px — každý krok: prázdné odevzdání = výzva (nepočítá se), chybný pokus = „nesedí“ bez zvýraznění
//     a bez prozrazení, správná odpověď z JSON = správně; úlohy U2 a U6 dítě odevzdá 2× špatně (rodič pak
//     vidí chyby); u poslechu hláška o chybějící nahrávce; panel „Úloha n ze 6“; konec lekce.
//   Rodič 375 px na stejném sezení — každá úloha: brána ①–④, stav žáka (u U2 a U6 „nesedí“, blok „Dítě
//     odevzdalo“, u známé chyby „Zeptejte se“, u kontrolní hláška R58), „Co vidí dítě“ bez řešení, tahák
//     rozbalený, semafor, souhrn lekce, Ukončit lekci.
//   Tisk — 6 úloh, bez rámečku „Výpočet“.
//   Na každé obrazovce: konzole bez chyb (kromě MP3 a písem), žádný vodorovný scroll, žádné
//   „undefined“ / „null“ / „[object Object]“ / „NaN“ / nepřeložený klíč hlášky.
// Navíc jednou přehled (ZADANI-CESTINA §8.2, KONTROLA C4/C5), katalog Matematika P1 + F1-T01-L1 + čeština týden 1
// (s polem predmet jako po migraci 0007), dítě A má predmety [matematika, cestina], dítě B jen [matematika]:
//   přepínač „Matematika | Čeština“ u A je, u B není (ani s ?predmet=cestina); záložka Čeština = cj-t1-l1…l4
//   v sekci „Čeština · týden 1“ (6 úloh, 30 min), Matematika = P1 + F1-T01-L1; ?predmet= v URL vyhraje nad
//   localStorage; zpět v prohlížeči vrátí záložku; rodič: „Předměty“ uloží deti.predmety; manuál rodiče
//   u češtiny = manuál češtiny bez „Jak číst zápisy nahlas“ (přehled i rodic.html, kde se sám otevře poprvé).
//   Přeskočit: --bez-prehledu. Jen přehled: --jen-prehled.
// Nic nemění v obsah/ ani ve web/.
// =====================================================================

import { createServer } from 'node:http';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vyhodnotKrok } from '../web/js/vyhodnoceni.js';
import { HLASKY } from '../web/js/hlasky.js';

const KOREN = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k) => { const i = argv.findIndex((a) => a === `--${k}` || a.startsWith(`--${k}=`)); if (i < 0) return null; return argv[i].includes('=') ? argv[i].split('=').slice(1).join('=') : argv[i + 1]; };
const DITE = '00000000-0000-4000-8000-0000000000d1'; // výchozí dítě fake-supabase.js
const SNIMKY = arg('snimky');
const MD = arg('md');

let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright')); }

const ADRESAR = join(KOREN, 'obsah', 'cestina', 'lekce');
const vsechny = (await readdir(ADRESAR)).filter((f) => /^cj-t\d+-l\d+\.json$/.test(f)).map((f) => f.replace('.json', ''))
  .sort((a, b) => Number(a.split('-l')[1]) - Number(b.split('-l')[1]));
const LEKCE = argv.includes('--jen-prehled') ? [] : arg('lekce') ? arg('lekce').split(',') : vsechny;
const nacti = async (id) => JSON.parse(await readFile(join(ADRESAR, `${id}.json`), 'utf8'));
const nactiMat = async (id) => JSON.parse(await readFile(join(KOREN, 'obsah', 'lekce', `${id}.json`), 'utf8'));
/** Položka katalogu jako z RPC katalog_lekci (po migraci 0007 s polem predmet). */
const polozkaKatalogu = (l) => ({ id: l.id, predmet: l.predmet || 'matematika', faze: l.faze, tyden: l.tyden, poradi: l.poradi, tema: l.tema,
  kapitola: l.kapitola, varianta: l.varianta ?? null, cas_min: l.cas_min, otevrit_od: '2026-09-01T00:00:00+02:00', verejna: true, verze: 1, zamceno: null });

// ---------- statický server z kořene repa ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const server = createServer(async (req, res) => {
  const cesta = normalize(join(KOREN, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!cesta.startsWith(KOREN)) { res.writeHead(403).end(); return; }
  try {
    let data = await readFile(cesta);
    if (cesta.endsWith(join('web', 'js', 'supabase.js'))) {
      data = String(data).replace(/import \{ createClient \} from '[^']+';/, "import { createClient } from '/nastroje/fake-supabase.js';");
    }
    res.writeHead(200, { 'content-type': MIME[extname(cesta)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(data);
  } catch { res.writeHead(404).end('404'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const WEB = `http://127.0.0.1:${server.address().port}/web`;

// ---------- prohlížeč ----------
const prohlizec = await chromium.launch();
const cdn = new Map();
const nalezy = []; // {lekce, kde, co}
const tabulka = []; // {lekce, zak, rodic, tisk}

async function novyKontext(id, { katalog: vlastniKatalog = null, manualCj = true } = {}) {
  const ctx = await prohlizec.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await ctx.route(/supabase\.co/, (r) => r.abort());
  await ctx.route(/^https:\/\/cdn\.jsdelivr\.net\//, async (r) => {
    const url = r.request().url();
    if (!cdn.has(url)) cdn.set(url, execFileSync('curl', ['-sSL', '--max-time', '60', url], { maxBuffer: 50e6 }));
    const typ = /\.css(\?|$)/.test(url) ? 'text/css' : /\.woff2/.test(url) ? 'font/woff2' : /\.woff(\?|$)/.test(url) ? 'font/woff' : /\.ttf/.test(url) ? 'font/ttf' : 'text/javascript; charset=utf-8';
    await r.fulfill({ status: 200, body: cdn.get(url), contentType: typ, headers: { 'access-control-allow-origin': '*' } });
  });
  const katalog = vlastniKatalog || [polozkaKatalogu(await nacti(id))];
  await ctx.addInitScript(({ katalog, DITE, manualCj }) => {
    if (sessionStorage.getItem('qa.init')) return;
    sessionStorage.setItem('qa.init', '1');
    if (!localStorage.getItem('qa.init')) {
      localStorage.clear();
      localStorage.setItem('qa.init', '1');
      localStorage.setItem('spolu.fake-katalog', JSON.stringify(katalog));
      localStorage.setItem('spolu.dite', DITE);
      localStorage.setItem('spolu.manual-precteno', '1');
      if (manualCj) localStorage.setItem('spolu.manual-precteno.cestina', '1'); // manuál češtiny se jinak sám otevře (menu.js)
    }
  }, { katalog, DITE, manualCj });
  return ctx;
}

function sledujKonzoli(page) {
  const chyby = [];
  page.on('console', (m) => { if (m.type() === 'error') chyby.push(`${m.text()} @ ${m.location()?.url || ''}`); });
  page.on('pageerror', (e) => chyby.push(`pageerror: ${e.message}`));
  return () => chyby.filter((c) => !/\.mp3|fonts\.g|supabase\.co|net::ERR_|Failed to load resource/.test(c));
}

/** Obecné kontroly obrazovky: vodorovný scroll a podezřelé texty. */
async function kontrolaObrazovky(page, pridej, kde) {
  const r = await page.evaluate(() => {
    const sirka = document.documentElement.clientWidth;
    const pretece = document.documentElement.scrollWidth > sirka + 1;
    const text = document.body.innerText;
    const podezrele = (text.match(/\bundefined\b|\[object Object\]|\bNaN\b|\bnull\b|\{[a-z_]+\}|\bcj\.[a-z_]+\b/g) || []);
    return { pretece, sirka, podezrele: [...new Set(podezrele)] };
  });
  if (r.pretece) pridej(`${kde}: vodorovný scroll na ${r.sirka} px`);
  if (r.podezrele.length) pridej(`${kde}: text obsahuje ${r.podezrele.join(', ')}`);
}

// ---------- odpovědi dítěte (DOM z web/js/vstupy-cj.js) ----------
const vnoreny = (k) => (k.vstup.typ === 'poslech' ? k.vstup.vnoreny_vstup : k.vstup);
function spravna(k) {
  const v = vnoreny(k);
  if (v.typ === 'dlazdice') return v.moznosti.find((m) => m.spravne).id;
  if (v.typ === 'diktat') return v.vety.map((x) => x.text);
  return k.spravne;
}
/** Chybná odpověď — přednostně známá chyba (ať rodič uvidí otázku), jinak obecná. Musí být platná a nesprávná. */
function chybna(k, poradi = 0) {
  const v = vnoreny(k);
  const kandidati = [];
  if (v.typ === 'dlazdice') {
    const m = v.moznosti.filter((x) => !x.spravne);
    kandidati.push(...m.filter((x) => x.typ_chyby).map((x) => x.id), ...m.map((x) => x.id));
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
    kandidati.push(v.vety.map((x) => x.text.replace(/\p{L}+/u, 'blabla')));
  }
  const platne = kandidati.filter((h) => { try { const r = vyhodnotKrok(k, h); return !r.neplatne && r.spravne === false; } catch { return false; } });
  const ruzne = [...new Map(platne.map((h) => [JSON.stringify(h), h])).values()];
  return ruzne[Math.min(poradi, ruzne.length - 1)]; // aplikace odmítne stejnou odpověď dvakrát → každý pokus jiná
}

async function vypln(page, sekce, k, odp) {
  const v = vnoreny(k);
  const presne = (t) => new RegExp(`^\\s*${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
  switch (v.typ) {
    case 'dlazdice': await sekce.locator(`.dlazdice[data-id="${odp}"]`).click(); break;
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
  await page.waitForTimeout(120);
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

/** Úlohy, které dítě odevzdá 2× špatně (rodič pak vidí „nesedí“ a odpověď dítěte). */
const SPATNE_ULOHY = [1, 5];

async function zak(ctx, l, pridej) {
  const page = await ctx.newPage();
  try { return await zakPruchod(page, l, pridej); } catch (e) { e.qaKde = page.qaKde; if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${l.id}-zak-pad.png`), fullPage: true }).catch(() => {}); throw e; }
}

async function zakPruchod(page, l, pridej) {
  const konzole = sledujKonzoli(page);
  await page.goto(`${WEB}/lekce.html?lekce=${l.id}&dite=${DITE}&lokalne=1&rezim=app`);
  await projdiPripravit(page);
  if (await page.locator('.hlaska', { hasText: 'neukládají' }).count()) pridej('žák: lekce běží bez ukládání (sezení nevzniklo)');
  const odevzdano = {}; // krokKlic → poslední odpověď
  for (const [ui, u] of l.ulohy.entries()) {
    await page.waitForFunction((n) => document.querySelector('.karta-ulohy .stitek--navy')?.textContent === `Úloha ${n}`, ui + 1, { timeout: 15000 });
    for (const [ki, k] of u.kroky.entries()) {
      const kde = `žák ${u.id.split('-').pop()}/${k.id}`;
      page.qaKde = kde;
      const sekce = page.locator('.lekce-zak section.krok').nth(ki);
      await sekce.waitFor();
      if (k.vstup.typ === 'poslech') {
        await page.waitForTimeout(300);
        const existuje = (await page.request.get(`${WEB}/${k.vstup.audio}`)).ok();
        if (!existuje && !(await sekce.locator('.cj-audio-chyba:not([hidden])').count())) pridej(`${kde}: chybějící nahrávka bez hlášky pro dítě`);
        if (existuje) {
          // nahrávka je na disku: prohlížeč ji musí načíst (délka 1–20 s, ZADANI §6.4) a dítě nesmí vidět chybu
          const delka = await sekce.locator('audio').evaluate((a) => new Promise((ok) => {
            if (a.readyState >= 1) { ok(a.duration); return; }
            a.addEventListener('loadedmetadata', () => ok(a.duration), { once: true });
            a.addEventListener('error', () => ok(-1), { once: true });
            a.load();
            setTimeout(() => ok(a.readyState >= 1 ? a.duration : 0), 8000);
          }));
          if (!(delka > 1 && delka <= 20.5)) pridej(`${kde}: nahrávka ${k.vstup.audio} se nenačetla nebo má délku ${delka} s (čekáno 1–20 s)`);
          if (await sekce.locator('.cj-audio-chyba:not([hidden])').count()) pridej(`${kde}: nahrávka existuje, ale dítě vidí hlášku o chybě`);
        }
      }
      const prazdne = await odevzdej(page, sekce);
      if (!prazdne.druh.includes('poznamka')) pridej(`${kde}: prázdné odevzdání → „${prazdne.text}“ (čekána výzva)`);
      const spatne = SPATNE_ULOHY.includes(ui) ? 2 : (ki === 0 && k.vstup.typ !== 'dlazdice' ? 1 : 0);
      for (let p = 0; p < spatne; p += 1) {
        const ch = chybna(k, p);
        if (ch === undefined) { pridej(`${kde}: nešla sestavit chybná odpověď`); break; }
        await vypln(page, sekce, k, ch);
        const r = await odevzdej(page, sekce);
        if (!r.druh.includes('zpetna-vazba--nesedi')) pridej(`${kde}: chybná odpověď → „${r.text}“`);
        if (await sekce.locator('.je-nesedi').count() && vnoreny(k).typ !== 'kratky_text' && vnoreny(k).typ !== 'dlazdice') pridej(`${kde}: po chybě je něco zvýrazněné`);
        odevzdano[`${u.id}/${k.id}`] = ch;
      }
      if (spatne < 2) {
        await vypln(page, sekce, k, spravna(k));
        const r = await odevzdej(page, sekce);
        if (!r.druh.includes('zpetna-vazba--spravne')) pridej(`${kde}: správná odpověď z JSON → „${r.text}“`);
        odevzdano[`${u.id}/${k.id}`] = spravna(k);
      }
    }
    await kontrolaObrazovky(page, pridej, `žák úloha ${ui + 1}`);
    if (SNIMKY && ui === 0) await page.screenshot({ path: join(SNIMKY, `${l.id}-zak-360-U1.png`), fullPage: true });
    const panel = page.locator('.karta.zasobnik[role=status]').last();
    const text = (await panel.locator('p').textContent()) || '';
    if (ui < l.ulohy.length - 1 && !text.includes(`ze ${l.ulohy.length}`)) pridej(`žák úloha ${ui + 1}: panel „${text}“`);
    await panel.locator('button').click();
  }
  await page.waitForSelector('.konec-lekce', { timeout: 15000 });
  await kontrolaObrazovky(page, pridej, 'žák konec lekce');
  for (const c of konzole()) pridej(`žák konzole: ${c.slice(0, 200)}`);
  await page.close();
  return odevzdano;
}

async function rodic(ctx, l, odevzdano, pridej) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 375, height: 800 });
  const konzole = sledujKonzoli(page);
  await page.goto(`${WEB}/manual.html`).catch(() => {});
  await page.evaluate(() => localStorage.setItem('spolu.role', 'rodic'));
  await page.goto(`${WEB}/rodic.html?lekce=${l.id}&dite=${DITE}&lokalne=1`);
  await page.waitForSelector('.prepinac-uloh', { timeout: 20000 });
  for (const [ui, u] of l.ulohy.entries()) {
    const kde = `rodič úloha ${ui + 1} (${u.typ})`;
    await page.waitForFunction((n) => document.querySelector('.prepinac-uloh__nazev strong')?.textContent.startsWith(`Úloha ${n} `), ui + 1, { timeout: 15000 });
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const d = document.querySelector('#spodniLista button.tlacitko--primarni');
      const stav = document.querySelector('.stav-zaka');
      const coVidi = [...document.querySelectorAll('details.rozbalovaci')].find((x) => x.querySelector('summary')?.textContent.includes('Co vidí dítě'));
      return {
        dalsiZamceno: d ? d.disabled : null,
        stav: stav?.innerText || '', odpovedi: stav?.querySelectorAll('.cjr-odpoved').length || 0,
        reseniVNahledu: coVidi ? coVidi.querySelectorAll('.je-spravne, .je-vybrano, [class*="--spravne"]').length : -1,
        prepisSbaleny: coVidi ? [...coVidi.querySelectorAll('details')].every((x) => !x.open) : true,
      };
    });
    if (r.dalsiZamceno !== true) pridej(`${kde}: „Další“ není zamčené po otevření úlohy (brána ①–④, R28)`);
    if (r.reseniVNahledu > 0) pridej(`${kde}: „Co vidí dítě“ ukazuje výběr nebo řešení`);
    if (r.reseniVNahledu < 0) pridej(`${kde}: chybí „Co vidí dítě“`);
    if (!r.prepisSbaleny) pridej(`${kde}: přepis nahrávky nebo text diktátu není sbalený`);
    if (SPATNE_ULOHY.includes(ui)) {
      if (!/nesedí/.test(r.stav)) pridej(`${kde}: stav žáka po chybě neukazuje „nesedí“`);
      const cjKroky = u.kroky.filter((k) => k.vstup.typ !== 'dlazdice');
      if (cjKroky.length && r.odpovedi < cjKroky.length) pridej(`${kde}: stav žáka má ${r.odpovedi} bloků „Dítě odevzdalo“, kroků s novým vstupem ${cjKroky.length}`);
      const znamy = cjKroky.some((k) => vyhodnotKrok(k, odevzdano[`${u.id}/${k.id}`]).typ_chyby);
      if (znamy && !/Zeptejte se/.test(r.stav)) pridej(`${kde}: u známé chyby chybí otázka pro rodiče`);
      if (u.typ === 'kontrolni' && !/typické chyby/.test(r.stav)) pridej(`${kde}: kontrolní úloha bez hlášky R58`);
    }
    // rozbalit vše, projít ①–③, semafor
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
    if (SNIMKY && (ui === 1 || ui === 5)) await page.screenshot({ path: join(SNIMKY, `${l.id}-rodic-375-U${ui + 1}.png`), fullPage: true });
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
      return { log, vysledek: document.querySelector('.semafor-vysledek:not([hidden])')?.textContent || '', souhrn: Boolean(document.querySelector('.souhrn')) };
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
  if (!/Oranžová/.test(souhrn)) pridej('rodič souhrn: kontrolní úloha odevzdaná špatně + „Sám/sama“ má dát oranžovou (matice kostra/02)');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${l.id}-rodic-375-souhrn.png`), fullPage: true });
  const ukoncit = page.locator('#btnUkoncitLekci');
  if (await ukoncit.count()) {
    await ukoncit.click();
    await page.waitForSelector('#spodniLista a[href="prehled.html"]', { timeout: 15000 }).catch(() => pridej('rodič: po „Ukončit lekci“ chybí návrat na přehled'));
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
  if (/Výpočet/.test(r.text)) pridej('tisk: rámeček „Výpočet“ u češtiny');
  await kontrolaObrazovky(page, pridej, 'tisk');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, `${l.id}-tisk.png`), fullPage: true });
  for (const c of konzole()) pridej(`tisk konzole: ${c.slice(0, 200)}`);
  await page.close();
}

// ---------- přehled: přepínač předmětu, filtr lekcí, manuál češtiny ----------
const DITE_B = '00000000-0000-4000-8000-0000000000d2';

async function prehled(pridej) {
  const cj = await Promise.all(vsechny.filter((id) => /^cj-t1-/.test(id)).map(nacti));
  const mat = await Promise.all(['P1', 'F1-T01-L1'].map(nactiMat));
  const katalog = [...cj, ...mat].map(polozkaKatalogu); // pořadí jako RPC po migraci: predmet → fáze → týden → pořadí
  const ctx = await novyKontext(null, { katalog, manualCj: false });
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 360, height: 800 });
  const konzole = sledujKonzoli(page);
  const nacteno = () => page.waitForFunction(() => !document.getElementById('obsah')?.hasAttribute('aria-busy')
    && document.querySelector('.prehled-hlavicka'), null, { timeout: 20000 });
  const stavP = () => page.evaluate(() => ({
    zalozky: [...document.querySelectorAll('.prepinac--predmet .prepinac__volba')].map((b) => ({ text: b.textContent.trim(), vybrano: b.getAttribute('aria-pressed') === 'true' })),
    sekce: [...document.querySelectorAll('#obsah section h2.nadpis-sekce')].map((x) => x.textContent.trim()),
    temata: [...document.querySelectorAll('.karta-lekce__tema')].map((x) => x.textContent.trim()),
    meta: [...document.querySelectorAll('.karta-lekce__meta')].map((x) => x.innerText.replace(/\s+/g, ' ').trim()),
    predmetUrl: new URLSearchParams(location.search).get('predmet'),
    ulozeno: localStorage.getItem('spolu.predmet'),
  }));
  const temataCj = cj.map((l) => l.tema);
  const temataMat = mat.map((l) => l.tema);
  const jeMat = (st) => st.temata.length === temataMat.length && temataMat.every((t) => st.temata.includes(t));
  const jeCj = (st) => st.temata.length === temataCj.length && temataCj.every((t, i) => st.temata[i] === t);

  // připravit fake DB: dítě A oba předměty, dítě B jen matematika (sloupec predmety = po migraci 0007)
  await page.goto(`${WEB}/prehled.html`);
  await page.evaluate(({ DITE, DITE_B }) => {
    localStorage.setItem('spolu.role', 'zak');
    localStorage.removeItem('spolu.predmet');
    const db = JSON.parse(localStorage.getItem('spolu.fake-db'));
    db.deti = [
      { ...db.deti[0], id: DITE, predmety: ['matematika', 'cestina'] },
      { ...db.deti[0], id: DITE_B, krestni_jmeno: 'Bára', poradi: 2, predmety: ['matematika'] },
    ];
    localStorage.setItem('spolu.fake-db', JSON.stringify(db));
    localStorage.setItem('spolu.dite', DITE);
  }, { DITE, DITE_B });

  // 1) dítě s oběma předměty, bez URL a bez uložené volby → přepínač, Matematika
  await page.goto(`${WEB}/prehled.html`);
  await nacteno();
  let st = await stavP();
  if (st.zalozky.map((z) => z.text).join('|') !== 'Matematika|Čeština') pridej(`přehled (A): záložky „${st.zalozky.map((z) => z.text).join('|')}“, čekáno „Matematika|Čeština“`);
  if (!st.zalozky[0]?.vybrano) pridej('přehled (A): bez URL a uložené volby není vybraná Matematika');
  if (!jeMat(st)) pridej(`přehled (A) Matematika: lekce ${st.temata.join(', ')}`);
  if (st.sekce.some((x) => /Čeština/.test(x))) pridej('přehled (A) Matematika: sekce češtiny v Matematice');
  await kontrolaObrazovky(page, pridej, 'přehled Matematika 360');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, 'prehled-360-matematika.png'), fullPage: true });

  // 2) klik na Čeština → cj-t1-l1…l4, „Čeština · týden 1“, 6 úloh / 30 min, URL + localStorage
  await page.locator('.prepinac--predmet .prepinac__volba', { hasText: 'Čeština' }).click();
  await nacteno();
  st = await stavP();
  if (!jeCj(st)) pridej(`přehled (A) Čeština: lekce ${st.temata.join(', ')} (čekáno ${temataCj.join(', ')})`);
  if (st.sekce.join('|') !== 'Čeština · týden 1') pridej(`přehled (A) Čeština: sekce „${st.sekce.join('|')}“`);
  if (!st.meta.every((m) => /30 min/.test(m) && /6 úloh/.test(m))) pridej(`přehled (A) Čeština: karty „${st.meta.join(' / ')}“ (čekáno 30 min, 6 úloh)`);
  if (st.predmetUrl !== 'cestina') pridej(`přehled: po kliknutí na Čeština URL ?predmet=${st.predmetUrl}`);
  if (st.ulozeno !== 'cestina') pridej(`přehled: po kliknutí na Čeština localStorage spolu.predmet=${st.ulozeno}`);
  if (!st.zalozky[1]?.vybrano) pridej('přehled: záložka Čeština není označená');
  const odkazy = await page.evaluate(() => document.querySelectorAll('.karta-lekce button, .karta-lekce a').length);
  if (!odkazy) pridej('přehled Čeština: karty bez tlačítka „Začít lekci“');
  await kontrolaObrazovky(page, pridej, 'přehled Čeština 360');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, 'prehled-360-cestina.png'), fullPage: true });

  // 3) zpět v prohlížeči → Matematika
  await page.goBack();
  await page.waitForFunction(() => new URLSearchParams(location.search).get('predmet') !== 'cestina'
    && !document.getElementById('obsah')?.hasAttribute('aria-busy')
    && document.querySelector('.prepinac--predmet .prepinac__volba[aria-pressed="true"]')?.textContent.trim() === 'Matematika', null, { timeout: 10000 })
    .catch(() => pridej('přehled: „zpět“ v prohlížeči nevrátil záložku Matematika'));
  st = await stavP();
  if (!jeMat(st)) pridej(`přehled po „zpět“: lekce ${st.temata.join(', ')}`);

  // 4) bez URL → uložená volba (localStorage cestina); URL pak nese předmět
  await page.evaluate(() => localStorage.setItem('spolu.predmet', 'cestina'));
  await page.goto(`${WEB}/prehled.html`);
  await nacteno();
  st = await stavP();
  if (!jeCj(st)) pridej('přehled bez URL: neukazuje uloženou volbu Čeština');
  if (st.predmetUrl !== 'cestina') pridej(`přehled bez URL: URL nedoplněna (?predmet=${st.predmetUrl})`);

  // 5) URL vyhraje nad localStorage (oba směry)
  await page.goto(`${WEB}/prehled.html?predmet=matematika`);
  await nacteno();
  st = await stavP();
  if (!jeMat(st)) pridej('přehled: ?predmet=matematika nevyhrálo nad localStorage cestina');
  await page.evaluate(() => localStorage.setItem('spolu.predmet', 'matematika'));
  await page.goto(`${WEB}/prehled.html?predmet=cestina`);
  await nacteno();
  st = await stavP();
  if (!jeCj(st)) pridej('přehled: ?predmet=cestina nevyhrálo nad localStorage matematika');
  if (st.ulozeno !== 'cestina') pridej('přehled: volba z URL se neuložila do localStorage');

  // 6) dítě jen s matematikou: žádný přepínač, i s ?predmet=cestina Matematika
  await page.evaluate((id) => localStorage.setItem('spolu.dite', id), DITE_B);
  await page.goto(`${WEB}/prehled.html?predmet=cestina`);
  await nacteno();
  st = await stavP();
  if (st.zalozky.length) pridej('přehled (B, jen matematika): přepínač předmětu je vidět');
  if (!jeMat(st)) pridej(`přehled (B) s ?predmet=cestina: lekce ${st.temata.join(', ')}`);
  await kontrolaObrazovky(page, pridej, 'přehled B 360');

  // 7) rodič: „Předměty“ (deti.predmety), manuál podle předmětu
  await page.evaluate((id) => { localStorage.setItem('spolu.dite', id); localStorage.setItem('spolu.role', 'rodic'); }, DITE);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${WEB}/prehled.html?predmet=cestina`);
  await nacteno();
  const manual = async (kde) => {
    await page.getByRole('button', { name: 'Jak vést lekci' }).first().click();
    const dlg = page.locator('dialog[open]').last();
    await dlg.waitFor({ timeout: 10000 });
    const r = await dlg.evaluate((d) => ({ nadpis: d.querySelector('.modal__nadpis')?.textContent.trim(), text: d.innerText }));
    await dlg.locator('.modal__zavrit').click();
    await page.waitForFunction(() => !document.querySelector('dialog[open]'), null, { timeout: 5000 }).catch(() => pridej(`${kde}: manuál nejde zavřít`));
    return r;
  };
  let m = await manual('přehled rodič Čeština');
  if (!/Jak se ptát/.test(m.nadpis || '')) pridej(`přehled rodič Čeština: manuál „${m.nadpis}“ (čekán manuál češtiny)`);
  if (/Jak číst zápisy nahlas/.test(m.text)) pridej('přehled rodič Čeština: v manuálu je „Jak číst zápisy nahlas“');
  if (/nepočítáte/.test(m.text)) pridej('přehled rodič Čeština: manuál obsahuje text matematiky');
  await page.getByRole('button', { name: 'Menu' }).click();
  const cteniVMenu = await page.locator('dialog[open] button', { hasText: 'Jak číst zápisy nahlas' }).isVisible();
  if (cteniVMenu) pridej('přehled rodič Čeština: menu nabízí „Jak číst zápisy nahlas“');
  await page.locator('dialog[open] .modal__zavrit').click();
  await page.locator('.prepinac--predmet .prepinac__volba', { hasText: 'Matematika' }).click();
  await nacteno();
  m = await manual('přehled rodič Matematika');
  if (m.nadpis !== 'Jak vést lekci' || !/Jak číst zápisy nahlas/.test(m.text)) pridej(`přehled rodič Matematika: manuál „${m.nadpis}“ bez odkazu na zápisy`);
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, 'prehled-375-rodic-matematika.png'), fullPage: true });

  // „Předměty“: jen čeština → bez přepínače, přehled ukáže češtinu; pak zpět oba
  const predmety = async (vybrat) => {
    await page.getByRole('button', { name: 'Předměty' }).click();
    const dlg = page.locator('dialog[open]').last();
    await dlg.waitFor({ timeout: 5000 });
    for (const c of await dlg.locator('input[type=checkbox]').all()) await c.setChecked(vybrat.includes(await c.getAttribute('value')), { force: true });
    await dlg.locator('button[type=submit]').click();
    return dlg;
  };
  let dlg = await predmety([]);
  if (!(await dlg.locator('.pole-chyba:not([hidden])').count())) pridej('Předměty: prázdná volba prošla bez chyby');
  await dlg.locator('.modal__zavrit').click();
  const hotovo = (sPrepinacem) => page.waitForFunction((x) => Boolean(document.querySelector('.prepinac--predmet')) === x
    && !document.querySelector('dialog[open]') && !document.getElementById('obsah')?.hasAttribute('aria-busy'), sPrepinacem, { timeout: 10000 })
    .catch(() => pridej(`Předměty: přehled se po uložení nepřekreslil (${sPrepinacem ? 's přepínačem' : 'bez přepínače'})`));
  await predmety(['cestina']);
  await hotovo(false);
  st = await stavP();
  const ulozene = await page.evaluate((id) => JSON.parse(localStorage.getItem('spolu.fake-db')).deti.find((d) => d.id === id).predmety, DITE);
  if (JSON.stringify(ulozene) !== '["cestina"]') pridej(`Předměty: v DB ${JSON.stringify(ulozene)}, čekáno ["cestina"]`);
  if (st.zalozky.length || !jeCj(st)) pridej('Předměty jen čeština: přehled má přepínač nebo neukazuje češtinu');
  await predmety(['matematika', 'cestina']);
  await hotovo(true);
  st = await stavP();
  if (st.zalozky.length !== 2) pridej('Předměty oba: přepínač se nevrátil');
  if (SNIMKY) await page.screenshot({ path: join(SNIMKY, 'prehled-375-rodic-cestina.png'), fullPage: true });
  await kontrolaObrazovky(page, pridej, 'přehled rodič 375');

  // 8) rodič u lekce češtiny: manuál češtiny se poprvé otevře sám, v menu bez „Jak číst zápisy nahlas“
  await page.evaluate(() => localStorage.removeItem('spolu.manual-precteno.cestina')); // v přehledu ho rodič už otevřel
  await page.goto(`${WEB}/rodic.html?lekce=cj-t1-l1&dite=${DITE}&lokalne=1&rezim=app`);
  const auto = await page.waitForSelector('dialog#modalManualCj[open]', { timeout: 20000 }).then(() => true).catch(() => false);
  if (!auto) pridej('rodič cj-t1-l1: manuál češtiny se poprvé neotevřel sám');
  else {
    const t = await page.locator('dialog#modalManualCj').innerText();
    if (!/Jak se ptát/.test(t) || /Jak číst zápisy nahlas/.test(t)) pridej('rodič cj-t1-l1: automaticky otevřený manuál není manuál češtiny');
    if (SNIMKY) await page.screenshot({ path: join(SNIMKY, 'rodic-375-manual-cj.png'), fullPage: false });
    await page.locator('dialog#modalManualCj button', { hasText: 'Rozumím' }).click();
  }
  await page.getByRole('button', { name: 'Menu' }).click();
  if (await page.locator('dialog[open] button', { hasText: 'Jak číst zápisy nahlas' }).isVisible()) pridej('rodič cj-t1-l1: menu nabízí „Jak číst zápisy nahlas“');
  const zpet = await page.locator('dialog[open] a', { hasText: 'Zpět na přehled' }).getAttribute('href');
  if (zpet !== 'prehled.html?predmet=cestina') pridej(`rodič cj-t1-l1: „Zpět na přehled“ vede na ${zpet}`);
  await page.locator('dialog[open] button', { hasText: 'Jak vést lekci' }).click();
  const zMenu = await page.locator('dialog[open] .modal__nadpis').last().textContent();
  if (!/Jak se ptát/.test(zMenu || '')) pridej(`rodič cj-t1-l1: manuál z menu „${zMenu}“`);
  const opet = await page.evaluate(() => localStorage.getItem('spolu.manual-precteno.cestina'));
  if (opet !== '1') pridej('rodič cj-t1-l1: manuál češtiny se nezapamatoval jako přečtený');

  for (const c of konzole()) pridej(`přehled konzole: ${c.slice(0, 200)}`);
  await page.close();
  await ctx.close();
}

if (SNIMKY) await mkdir(SNIMKY, { recursive: true });
let radekPrehledu = null;
if (!argv.includes('--bez-prehledu')) {
  process.stdout.write('přehled (přepínač předmětu, manuál češtiny)…');
  radekPrehledu = '✓';
  try { await prehled((co) => { nalezy.push({ lekce: 'přehled', co }); radekPrehledu = '✗'; }); } catch (e) { nalezy.push({ lekce: 'přehled', co: `průchod spadl: ${e.message.split('\n')[0]}` }); radekPrehledu = '✗'; }
  console.log(' hotovo');
}
for (const id of LEKCE) {
  const l = await nacti(id);
  const radek = { lekce: id, zak: '✓', rodic: '✓', tisk: '✓' };
  const ctx = await novyKontext(id);
  const cast = (sloupec) => (co) => { nalezy.push({ lekce: id, co }); radek[sloupec] = '✗'; };
  process.stdout.write(`${id}: žák…`);
  let odevzdano = {};
  try { odevzdano = await zak(ctx, l, cast('zak')); } catch (e) { cast('zak')(`žák: průchod spadl (${e.qaKde || '?'}): ${e.message.split('\n').filter((x) => /intercept|waiting for|click/.test(x)).slice(-3).join(' | ').slice(0, 400)}`); }
  process.stdout.write(' rodič…');
  try { await rodic(ctx, l, odevzdano, cast('rodic')); } catch (e) { cast('rodic')(`rodič: průchod spadl: ${e.message.split('\n')[0]}`); }
  process.stdout.write(' tisk…');
  try { await tisk(ctx, l, cast('tisk')); } catch (e) { cast('tisk')(`tisk: spadl: ${e.message.split('\n')[0]}`); }
  console.log(' hotovo');
  tabulka.push(radek);
  await ctx.close();
}
await prohlizec.close();
server.close();

const vystup = [
  '| lekce | žák 360 (správně, chyby, prázdné) | rodič 375 (brána, stav žáka, semafor, souhrn) | tisk |',
  '|---|---|---|---|',
  ...tabulka.map((r) => `| ${r.lekce} | ${r.zak} | ${r.rodic} | ${r.tisk} |`),
  '',
  ...(radekPrehledu ? [`Přehled (přepínač Matematika | Čeština, filtr lekcí, URL > localStorage, Předměty, manuál češtiny): ${radekPrehledu}`, ''] : []),
  nalezy.length ? nalezy.map((n) => `- ✗ ${n.lekce}: ${n.co}`).join('\n') : 'Bez nálezů.',
].join('\n');
console.log(`\n${vystup}`);
if (MD) await writeFile(MD, `${vystup}\n`);
process.exit(nalezy.length ? 1 : 0);
