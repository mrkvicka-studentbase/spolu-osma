import { readFileSync } from 'node:fs';
import { vyhodnotKrok } from '/home/user/spolu-osma/web/js/vyhodnoceni.js';
import { vzorovaOdpoved, tokenizuj } from '/home/user/spolu-osma/web/js/vyhodnoceni-cj.js';
const D = '/home/user/spolu-osma/obsah/cestina/lekce/';
let chyb = 0; const err = (m) => { chyb++; console.log('CHYBA', m); };
const vnor = (k) => k.vstup.typ === 'poslech' ? { ...k, vstup: k.vstup.vnoreny_vstup } : k;
const wc = (s) => s.replace(/[„“"]/g, '').split(/\s+/).filter((w) => w && !/^[–—-]$/.test(w)).length;
const LIM = { vysvetleni: 70, otocena_role: 25, otocena_role_odpoved: 40 };
const doplneno = (k) => { let i = 0; return k.vstup.text.replace(/_/g, () => k.spravne[i++]); };
// hodnocená slova lekce
function hodnocena(L) {
  const s = new Set(), vety = [];
  for (const u of L.ulohy) for (const k of u.kroky) {
    const kv = vnor(k); const t = kv.vstup.typ;
    if (k.vstup.typ === 'poslech') { vety.push(k.vstup.prepis); tokenizuj(k.vstup.prepis).forEach((x) => s.add(x.slovo.toLowerCase())); }
    if (t === 'dlazdice') kv.vstup.moznosti.forEach((m) => s.add(m.text.toLowerCase()));
    if (t === 'oznac_role') { const tok = tokenizuj(kv.vstup.text); kv.vstup.slova.forEach((i) => s.add(tok[i].slovo.toLowerCase())); vety.push(kv.vstup.text); }
    if (t === 'klik_ve_textu') { tokenizuj(kv.vstup.text).forEach((x) => s.add(x.slovo.toLowerCase())); vety.push(kv.vstup.text); }
    if (t === 'doplnit_pismeno') { const f = doplneno(k); vety.push(f); const tok = tokenizuj(f), raw = tokenizuj(k.vstup.text);
      raw.forEach((x, i) => { if (x.slovo.includes('_')) { s.add(tok[i].slovo.toLowerCase()); if (tok[i + 1]) s.add((tok[i].slovo + ' ' + tok[i + 1].slovo).toLowerCase()); } }); }
    if (t === 'diktat') kv.vstup.vety.forEach((v) => { vety.push(v.text); tokenizuj(v.text).forEach((x) => s.add(x.slovo.toLowerCase())); });
  }
  return { s, vety };
}
const BEZNA = new Set(['a', 'je', 'v', 'na', 'jsou', 'než', 'ale', 'ten', 'ti', 'ty', 'ta', 'tvrdé', 'měkké', 'přivlastňovací', 'přídavné jméno', 'podstatné jméno', 'má', 'se', 'si', 'po', 'u', 'z', 'do', 'ema', 'adam', 'klára', 'lucka', 'tomáš', 'kluci', 'děti', 'pes', 'psi', 'sedí', 'leží', 'nese', 'nesou', 'batoh', '1. stupeň', '2. stupeň', '3. stupeň']);
const VSE = ['cj-t3-l9', 'cj-t3-l10', 'cj-t3-l11', 'cj-t3-l12'].flatMap((x) => [x, x + 'n', x + 'b']).map((x) => hodnocena(JSON.parse(readFileSync(D + x + '.json', 'utf8'))));
const VS = new Set(VSE.flatMap((x) => [...x.s])); const VV = VSE.flatMap((x) => x.vety);
for (const hid of (process.argv[2] || 'cj-t3-l9n,cj-t3-l10n,cj-t3-l11n,cj-t3-l12n').split(',')) {
  const h = JSON.parse(readFileSync(D + hid + '.json', 'utf8'));
  const n = h;
  const b = JSON.parse(readFileSync(D + hid + 'b.json', 'utf8'));
  for (const k of ['tema', 'kapitola', 'tyden', 'poradi', 'cas_min', 'faze', 'predmet']) if (h[k] !== b[k]) err(`${hid} hlavička ${k}`);
  if (b.uvod_pravidla.some((p) => p.znak.length > 36)) err(`${hid} Platí > 36`);
  const hb = hodnocena(b), hh = hodnocena(h), hn = hodnocena(n);
  const prekryv = [...hb.s].filter((w) => !BEZNA.has(w) && VS.has(w));
  console.log(`\n== ${b.id} překryv hodnocených slov s cj-t3-l*, l*n, l*b:`, prekryv.join(', ') || '—');
  for (const v of hb.vety) if (VV.includes(v)) err(`${b.id} věta z jiné lekce: ${v}`);
  b.ulohy.forEach((u, i) => {
    const hu = h.ulohy[i];
    if (u.typ !== hu.typ || u.cas_min !== hu.cas_min || u.id !== `${b.id}-U${i + 1}`) err(`${u.id} typ/čas/id`);
    if (!!u.tydenni !== !!hu.tydenni) err(`${u.id} tydenni`);
    if (u.kroky.length !== hu.kroky.length) err(`${u.id} počet kroků`);
    const t = u.tahak;
    for (const [f, l] of Object.entries(LIM)) if (wc(t[f]) > l) err(`${u.id} ${f} ${wc(t[f])} > ${l}`);
    t.otazky.forEach((o) => { const x = typeof o === 'string' ? o : o.text; if (wc(x) > 25) err(`${u.id} otázka ${wc(x)} slov`); });
    const tl = u.typ === 'kontrolni' ? 90 : 50; if (wc(t.typicka_chyba) > tl) err(`${u.id} typicka ${wc(t.typicka_chyba)}`);
    for (const [f, l] of [['zelena', 25], ['oranzova', 60], ['cervena', 75]]) if (wc(u.semafor[f]) > l) err(`${u.id} semafor.${f} ${wc(u.semafor[f])} > ${l}`);
    if (!u.semafor.cervena.includes(`Potom zopakujte lekci „${b.tema}“.`)) err(`${u.id} červená bez názvu lekce`);
    if (!/Kontrola pro vás: [^]*$/.test(u.semafor.oranzova) || !u.semafor.cervena.includes('Kontrola pro vás:')) err(`${u.id} kontrola pro vás`);
    if (u.semafor_tydne && JSON.stringify(u.semafor_tydne) !== JSON.stringify(hu.semafor_tydne)) err(`${u.id} semafor_tydne`);
    console.log(`${u.id} slova: vysv ${wc(t.vysvetleni)}, typ ${wc(t.typicka_chyba)}, oranž ${wc(u.semafor.oranzova)}, červ ${wc(u.semafor.cervena)}`);
    u.kroky.forEach((k, j) => {
      const hk = hu.kroky[j]; const r = [];
      if (k.id !== hk.id || k.vstup.typ !== hk.vstup.typ) err(`${u.id}/${k.id} id nebo vstup`);
      const kv = vnor(k), hv = vnor(hk); const ty = kv.vstup.typ;
      if (ty !== hv.vstup.typ) err(`${u.id}/${k.id} vnořený typ`);
      if (k.vstup.typ === 'poslech') { for (const f of [u.zadani, u.tisk.zadani, k.popisek, k.vstup.otazka, ...t.otazky.map((o) => o.text || o)]) if (f.includes(k.vstup.prepis.slice(0, 20))) err(`${u.id} přepis viditelný`); }
      const vz = vzorovaOdpoved(k); const ok = vyhodnotKrok(k, vz);
      if (ok.spravne !== true) err(`${u.id}/${k.id} vzor nevyšel`); r.push('vzor:' + (ok.spravne ? 'OK' : 'X'));
      if (ty === 'dlazdice') {
        if (kv.vstup.moznosti.length !== hv.vstup.moznosti.length) err(`${u.id}/${k.id} počet dlaždic`);
        if (kv.vstup.moznosti.filter((m) => m.typ_chyby).length !== hv.vstup.moznosti.filter((m) => m.typ_chyby).length) err(`${u.id}/${k.id} počet kódů dlaždic`);
        for (const m of kv.vstup.moznosti) if (!m.spravne) { const v = vyhodnotKrok(k, m.id); r.push(`${m.text}:${v.typ_chyby}`);
          if (v.spravne !== false || (v.typ_chyby ?? null) !== (m.typ_chyby ?? null)) err(`${u.id}/${k.id}/${m.id} kód ${v.typ_chyby}`); }
      } else if (ty === 'diktat') {
        if (kv.vstup.vety.length !== hv.vstup.vety.length) err(`${u.id} počet vět`);
        if (JSON.stringify((k.chyby_ocekavane || []).map((c) => c.typ_chyby)) !== JSON.stringify(hk.chyby_ocekavane.map((c) => c.typ_chyby))) err(`${u.id} kódy diktátu`);
        console.log('  diktát slov:', kv.vstup.vety.map((v) => tokenizuj(v.text).length).reduce((a, x) => a + x, 0), '(hlavní', hv.vstup.vety.map((v) => tokenizuj(v.text).length).reduce((a, x) => a + x, 0) + ')');
        const zam = { 'koncovka-prid-y-za-i': (w) => w.replace(/í$/, 'ý'), 'koncovka-prid-i-za-y': (w) => w.replace(/ý$/, 'í'), 'privlastnovaci-i-za-y': (w) => w.replace(/y$/, 'i'), 'privlastnovaci-y-za-i': (w) => w.replace(/i$/, 'y') };
        for (const c of k.chyby_ocekavane) {
          const vety = vz.map((v, vi) => { if (vi !== c.veta) return v; const tok = tokenizuj(v); const w = tok[c.slovo].slovo; return v.replace(w, zam[c.typ_chyby](w)); });
          const v = vyhodnotKrok(k, vety); r.push(`${vety[c.veta]} → ${v.typ_chyby}`);
          if (v.typ_chyby !== `diktat-pravopis-${c.typ_chyby}`) err(`${u.id} diktát ${JSON.stringify(c)} → ${v.typ_chyby}`);
        }
        if (k.vstup.hodnotit_interpunkci !== false) err('interpunkce');
      } else {
        const zn = k.zname_chyby || []; if (zn.length !== (hk.zname_chyby || []).length) err(`${u.id}/${k.id} počet známých chyb`);
        if (JSON.stringify(zn.map((z) => z.typ_chyby).sort()) !== JSON.stringify((hk.zname_chyby || []).map((z) => z.typ_chyby).sort())) err(`${u.id}/${k.id} jiné kódy známých chyb než hlavní`);
        if (ty === 'oznac_role') {
          if (kv.vstup.slova.length !== hv.vstup.slova.length || JSON.stringify(kv.vstup.role) !== JSON.stringify(hv.vstup.role)) err(`${u.id}/${k.id} počet slov/rolí`);
          const tok = tokenizuj(kv.vstup.text); r.push('slova:' + kv.vstup.slova.map((x) => `${x}=${tok[x].slovo}`).join(','));
          for (const z of zn) { const v = vyhodnotKrok(k, { ...k.spravne, ...z.hodnota }); r.push(JSON.stringify(z.hodnota) + ':' + v.typ_chyby); if (v.typ_chyby !== z.typ_chyby) err(`${u.id}/${k.id} ${JSON.stringify(z.hodnota)}`); }
        } else if (ty === 'klik_ve_textu') {
          const tok = tokenizuj(kv.vstup.text); r.push('tok:' + tok.map((x, n) => `${n}=${x.slovo}`).join(' '));
          for (const z of zn) for (const nn of z.navic) { const v = vyhodnotKrok(k, [nn]); r.push(`[${nn}]:${v.typ_chyby}`); if (v.typ_chyby !== z.typ_chyby) err(`${u.id}/${k.id} navic ${nn}`); }
        } else if (ty === 'doplnit_pismeno') {
          if (kv.vstup.mezery.length !== hv.vstup.mezery.length) err(`${u.id} počet mezer`);
          if (JSON.stringify(kv.vstup.mezery.map((m) => m.moznosti)) !== JSON.stringify(hv.vstup.mezery.map((m) => m.moznosti))) err(`${u.id} nabídky mezer`);
          if (JSON.stringify(k.spravne) !== JSON.stringify(hk.spravne)) r.push('(jiné pořadí odpovědí než hlavní)');
          r.push(doplneno(k));
          for (const z of zn) { const o = k.spravne.map((x, ii) => z.hodnota[ii] ?? x); const v = vyhodnotKrok(k, o); r.push(`${JSON.stringify(z.hodnota.map((x) => x ?? '.').join(''))}:${v.typ_chyby}`); if (v.typ_chyby !== z.typ_chyby) err(`${u.id}/${k.id} ${JSON.stringify(z.hodnota)}`); }
        }
      }
      console.log(' ', u.id, k.id, ty, r.join('  '));
    });
  });
}
console.log(chyb ? `\n${chyb} chyb` : '\nvše OK');
