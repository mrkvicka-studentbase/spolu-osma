// Jednoduchý statický server z kořene repa pro lokální náhled. Jen pro vývoj, nenasazuje se.
//
//   node nastroje/staticky-server.mjs                       → http://localhost:8799/web/ (skutečný supabase-js z config.js)
//   node nastroje/staticky-server.mjs --fake                → bez Supabase: supabase-js nahradí nastroje/fake-supabase.js
//                                                             (DB v localStorage prohlížeče, přihlášená testovací rodina)
//   node nastroje/staticky-server.mjs --fake --synteticke   → lekce z testy/data/osma/ místo obsah/ (než autoři dopíší)
//
// S --fake: katalog lekcí (RPC katalog_lekci) = /__fake/katalog.json (metadata všech lekcí obou předmětů); obsah lekce si
// fake DB načte ze souboru, když ho otevřete. Start: http://localhost:8799/web/prehled.html
// Lekce bez přihlášení a bez DB: lekce.html?lekce=M8-T01-L1&lokalne=1 (rodic.html i tisk.html stejně).
// Server používá i nastroje/qa-osma.mjs (export vytvorServer).
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

export const KOREN = normalize(join(fileURLToPath(new URL('.', import.meta.url)), '..'));
const TYPY = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg',
};

/** Složky s lekcemi: ostrý obsah, nebo syntetické lekce pro testy. */
export function slozkyLekci({ synteticke = false } = {}) {
  return synteticke
    ? { matematika: join(KOREN, 'testy', 'data', 'osma', 'lekce'), cestina: join(KOREN, 'testy', 'data', 'osma', 'cestina', 'lekce') }
    : { matematika: join(KOREN, 'obsah', 'lekce'), cestina: join(KOREN, 'obsah', 'cestina', 'lekce') };
}

/** Všechny lekce (JSON) z obou složek. */
export async function nactiLekce(volby) {
  const vse = [];
  for (const adr of Object.values(slozkyLekci(volby))) {
    let nazvy = [];
    try { nazvy = (await readdir(adr)).filter((n) => n.endsWith('.json')).sort(); } catch { continue; }
    for (const n of nazvy) vse.push(JSON.parse(await readFile(join(adr, n), 'utf8')));
  }
  return vse;
}

/** Položka katalogu jako z RPC katalog_lekci (supabase/migrations/0003_views.sql). */
export const polozkaKatalogu = (l, { otevritOd = '2026-09-01T00:00:00+02:00', zamceno = null } = {}) => ({
  id: l.id, predmet: l.predmet || 'matematika', faze: l.faze, tyden: l.tyden, poradi: l.poradi, tema: l.tema,
  kapitola: l.kapitola, varianta: l.varianta ?? 'z8', cas_min: l.cas_min ?? null, pocet_uloh: Array.isArray(l.ulohy) ? l.ulohy.length : null,
  otevrit_od: otevritOd, verejna: false, verze: 1, zamceno,
});

/**
 * HTTP server z kořene repa.
 * @param {{fake?: boolean, synteticke?: boolean}} volby
 */
export function vytvorServer({ fake = false, synteticke = false } = {}) {
  const slozky = slozkyLekci({ synteticke });
  return createServer(async (req, res) => {
    let cesta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (cesta === '/') cesta = '/web/index.html';
    try {
      if (fake && cesta === '/__fake/katalog.json') {
        const katalog = (await nactiLekce({ synteticke })).map((l) => polozkaKatalogu(l));
        res.writeHead(200, { 'Content-Type': TYPY['.json'], 'Cache-Control': 'no-store' }).end(JSON.stringify(katalog));
        return;
      }
      // lekce pro ?lokalne=1 a fake DB (web čte ../obsah/lekce/<id>.json a ../obsah/cestina/lekce/<id>.json)
      const m = /^\/obsah\/(cestina\/)?lekce\/([A-Za-z0-9_-]+\.json)$/.exec(cesta);
      const soubor = m ? join(m[1] ? slozky.cestina : slozky.matematika, m[2]) : normalize(join(KOREN, cesta));
      if (!soubor.startsWith(KOREN)) { res.writeHead(403).end(); return; }
      let data = await readFile(soubor);
      if (fake && soubor.endsWith(join('web', 'js', 'supabase.js'))) {
        data = String(data).replace(/import \{ createClient \} from '[^']+';/, "import { createClient } from '/nastroje/fake-supabase.js';");
      }
      res.writeHead(200, { 'Content-Type': TYPY[extname(soubor)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(data);
    } catch {
      res.writeHead(404).end('404');
    }
  });
}

if (process.argv[1] && normalize(process.argv[1]) === normalize(fileURLToPath(import.meta.url))) {
  const argv = process.argv.slice(2);
  const PORT = Number(process.env.PORT || 8799);
  const fake = argv.includes('--fake');
  vytvorServer({ fake, synteticke: argv.includes('--synteticke') })
    .listen(PORT, () => console.log(`http://localhost:${PORT}/web/${fake ? 'prehled.html (bez Supabase, fake DB v prohlížeči)' : ''}`));
}
