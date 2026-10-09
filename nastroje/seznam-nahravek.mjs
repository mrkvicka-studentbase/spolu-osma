#!/usr/bin/env node
// =====================================================================
// seznam-nahravek.mjs — seznam nahrávek češtiny k natočení (pro agenta s ElevenLabs, cestina/Obsah/NAHRAVKY-NAVOD.md).
// Projde obsah/cestina/lekce/*.json, vezme každý odkaz na nahrávku (poslech: `prepis`, diktát: `vety[].text`),
// vynechá ty, které už leží ve web/audio/cestina/, a zapíše cestina/Obsah/nahravky-k-nataceni.csv
// (UTF-8 s BOM, středník — otevře se rovnou v Excelu) a totéž čitelně pro agenta: nahravky-k-nataceni.md (text v bloku ke zkopírování). Pusťte znovu po každé nové dávce lekcí.
//
// Použití (z kořene repa): node nastroje/seznam-nahravek.mjs [--vse]   (--vse = i hotové, se stavem „hotovo“)
// =====================================================================

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEKCE = path.join(KOREN, 'obsah/cestina/lekce');
const AUDIO = path.join(KOREN, 'web');
const VYSTUP = path.join(KOREN, 'cestina/Obsah/nahravky-k-nataceni.csv');
const VYSTUP_MD = path.join(KOREN, 'cestina/Obsah/nahravky-k-nataceni.md');
const vse = process.argv.includes('--vse');

const cisla = (s) => (s.match(/\d+/g) || []).map(Number);
const podle = (a, b) => { const x = cisla(a); const y = cisla(b); for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? -1) !== (y[i] ?? -1)) return (x[i] ?? -1) - (y[i] ?? -1); return a.localeCompare(b); };

/** Text pro ElevenLabs: poslech beze změny; diktát = věta, pauza 2 s, pak po slovech s pauzou 0,7 s (velké písmeno uvnitř věty se ohlásí). */
function proElevenLabs(typ, text) {
  if (typ === 'poslech') return text;
  const slova = text.match(/[\p{L}\p{N}’'-]+/gu) || [];
  const pomalu = slova.map((w, i) => (i > 0 && /^\p{Lu}/u.test(w) ? `velké písmeno — ${w}` : w));
  return `${text} <break time="2s" /> ${pomalu.join(' <break time="0.7s" /> ')}.`;
}

const radky = new Map();
for (const soubor of readdirSync(LEKCE).filter((n) => n.endsWith('.json')).sort(podle)) {
  const l = JSON.parse(readFileSync(path.join(LEKCE, soubor), 'utf8'));
  l.ulohy?.forEach((u, ui) => {
    for (const k of u.kroky || []) {
      const v = k.vstup || {};
      const pridej = (audio, typ, text, kde) => {
        const klic = audio.replace(/^audio\/cestina\//, '');
        const byl = radky.get(klic);
        if (byl && byl.text !== text) throw new Error(`${klic}: dva různé texty (${byl.kde} × ${kde})`);
        if (!byl) radky.set(klic, { klic, typ, text, kde });
      };
      if (v.typ === 'diktat') v.vety.forEach((x, i) => pridej(x.audio, 'diktát', x.text, `${l.id} úloha ${ui + 1}, věta ${i + 1}`));
      else if (v.typ === 'poslech') pridej(v.audio, 'poslech', v.prepis, `${l.id} úloha ${ui + 1}`);
    }
  });
}

const csv = (x) => (/[;"\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x);
const vystup = [['poradi', 'slozka', 'nazev_souboru', 'typ', 'lekce', 'text', 'text_pro_elevenlabs', 'stav']];
let n = 0; let hotovo = 0;
for (const r of [...radky.values()].sort((a, b) => podle(a.klic, b.klic))) {
  const ma = existsSync(path.join(AUDIO, 'audio/cestina', r.klic));
  if (ma) hotovo++;
  if (ma && !vse) continue;
  const [slozka, nazev] = r.klic.split('/');
  vystup.push([String(++n), slozka, nazev, r.typ, r.kde, r.text, proElevenLabs(r.typ, r.text), ma ? 'hotovo' : 'natocit']);
}
writeFileSync(VYSTUP, '\ufeff' + vystup.map((r) => r.map(csv).join(';')).join('\r\n') + '\r\n');
const md = [`# Nahrávky k natočení (${n})`, '', `Vygenerováno ${new Date().toISOString().slice(0, 10)} nástrojem nastroje/seznam-nahravek.mjs. Postup: cestina/Obsah/NAHRAVKY-NAVOD.md.`,
  'Do ElevenLabs vlož PŘESNĚ text z bloku (bez zpětných apostrofů). Soubor ulož jako `složka/název`.', ''];
for (const r of vystup.slice(1)) {
  md.push(`## ${r[0]}. ${r[1]}/${r[2]} — ${r[3]}${r[7] === 'hotovo' ? ' (HOTOVO)' : ''}`, '', `Lekce: ${r[4]} · Věta: ${r[5]}`, '', '```text', r[6], '```', '');
}
writeFileSync(VYSTUP_MD, md.join('\n'));
console.log(`Nahrávek v lekcích: ${radky.size}, hotových: ${hotovo}, k natočení: ${radky.size - hotovo}.`);
console.log(`Zapsáno: ${path.relative(KOREN, VYSTUP)} a ${path.relative(KOREN, VYSTUP_MD)} (${n} nahrávek)`);
