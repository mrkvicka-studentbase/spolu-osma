import { readFileSync } from 'node:fs';
import { tokenizuj } from '/home/user/spolu-osma/web/js/vyhodnoceni-cj.js';
const D = '/home/user/spolu-osma/obsah/cestina/lekce/';
const vnor = (k) => k.vstup.typ === 'poslech' ? { ...k, vstup: k.vstup.vnoreny_vstup } : k;
const doplneno = (k) => { let i = 0; return k.vstup.text.replace(/_/g, () => k.spravne[i++]); };
for (const id of process.argv.slice(2)) {
  const L = JSON.parse(readFileSync(D + id + '.json', 'utf8'));
  const s = new Set();
  for (const u of L.ulohy) for (const k of u.kroky) {
    const kv = vnor(k); const t = kv.vstup.typ;
    if (k.vstup.typ === 'poslech') s.add('POSLECH:' + k.vstup.prepis);
    if (t === 'dlazdice') kv.vstup.moznosti.forEach((m) => s.add(m.text));
    if (t === 'oznac_role') { const tok = tokenizuj(kv.vstup.text); kv.vstup.slova.forEach((i) => s.add(tok[i].slovo)); }
    if (t === 'klik_ve_textu') s.add('KLIK:' + kv.vstup.text);
    if (t === 'doplnit_pismeno') { const f = doplneno(k); const tok = tokenizuj(f), raw = tokenizuj(k.vstup.text);
      raw.forEach((x, i) => { if (x.slovo.includes('_')) s.add(tok[i].slovo + (tok[i+1] ? ' ' + tok[i+1].slovo : '')); }); }
    if (t === 'diktat') kv.vstup.vety.forEach((v) => s.add('DIKTAT:' + v.text));
  }
  console.log('##', id, [...s].join(' | '));
}
