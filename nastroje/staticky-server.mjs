// Jednoduchý statický server z kořene repa pro lokální náhled (?lokalne=1). Jen pro vývoj, nenasazuje se.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOREN = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PORT = Number(process.env.PORT || 8799);
const TYPY = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };

createServer(async (req, res) => {
  let cesta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (cesta === '/') cesta = '/web/index.html';
  const soubor = normalize(join(KOREN, cesta));
  if (!soubor.startsWith(normalize(KOREN))) { res.writeHead(403); res.end(); return; }
  try {
    const data = await readFile(soubor);
    res.writeHead(200, { 'Content-Type': TYPY[extname(soubor)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('404');
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}/web/`));
