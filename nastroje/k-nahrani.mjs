#!/usr/bin/env node
// =====================================================================
// k-nahrani.mjs — totéž co nasadit.bat (robocopy web k-nahrani /MIR /XF …), ale pro Linux/macOS a s kontrolou.
// Připraví složku k-nahrani/ = obsah web/ bez vývojářských souborů. Celý obsah se pak nahraje na Endoru
// do kořene subdomény spolu.studentbase.cz. Není to build, jen kopírování. Nic nenahrává, s nikým se nespojuje.
//
// Použití (z kořene repa): node nastroje/k-nahrani.mjs
// =====================================================================

import { cpSync, rmSync, existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZDROJ = path.join(KOREN, 'web');
const CIL = path.join(KOREN, 'k-nahrani');
// stejné jako /XF v nasadit.bat (robocopy vylučuje podle jména na libovolné úrovni)
const VYNECHAT = new Set(['komponenty.html', 'nahled-obsahu.html', 'DESIGN.md', 'config.example.js']);

rmSync(CIL, { recursive: true, force: true }); // /MIR: v cíli nezůstane nic navíc
cpSync(ZDROJ, CIL, { recursive: true, filter: (zdroj) => !VYNECHAT.has(path.basename(zdroj)) });

const soubory = [];
(function projdi(adr) {
  for (const n of readdirSync(adr)) {
    const p = path.join(adr, n);
    if (statSync(p).isDirectory()) projdi(p); else soubory.push(path.relative(CIL, p).split(path.sep).join('/'));
  }
})(CIL);

const chyby = [];
for (const nutny of ['index.html', 'prehled.html', 'lekce.html', 'rodic.html', 'tisk.html', 'js/config.js', 'js/supabase.js', 'css/cestina.css']) {
  if (!soubory.includes(nutny)) chyby.push(`chybí ${nutny}`);
}
for (const n of soubory) if (VYNECHAT.has(path.basename(n))) chyby.push(`vývojářský soubor v k-nahrani: ${n}`);
const config = existsSync(path.join(CIL, 'js/config.js')) ? readFileSync(path.join(CIL, 'js/config.js'), 'utf8') : '';
if (/service_role|sb_secret_/i.test(config)) chyby.push('js/config.js obsahuje service key — NIKDY nenahrávat!');
const audio = soubory.filter((n) => n.startsWith('audio/') && n.endsWith('.mp3'));

console.log(`k-nahrani/: ${soubory.length} souborů (z toho nahrávky češtiny ${audio.length}).`);
if (chyby.length) {
  for (const c of chyby) console.error(`CHYBA: ${c}`);
  process.exitCode = 1;
} else {
  console.log(`Hotovo. Nahrajte na Endoru CELÝ obsah složky:\n  ${CIL}\n(včetně podsložek css, js a audio). Nahrajte vždy vše, přepište staré soubory.`);
}
