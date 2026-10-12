import { readFileSync } from 'node:fs';
import { vyhodnotKrok } from '/home/user/spolu-osma/web/js/vyhodnoceni.js';
let chyby = 0, n = 0;
for (const id of process.argv.slice(2)) {
  const L = JSON.parse(readFileSync(`/home/user/spolu-osma/obsah/lekce/${id}.json`, 'utf8'));
  for (const u of L.ulohy) for (const k of u.kroky) {
    const t = k.vstup.typ;
    const zkus = (hod, ocekSpravne, ocekKod, popis) => {
      n++;
      const v = vyhodnotKrok(k, hod);
      const ok = v.spravne === ocekSpravne && (ocekSpravne ? v.poznamka === null : v.typ_chyby === ocekKod);
      if (!ok) { chyby++; console.log('✘', u.id, k.id, popis, JSON.stringify(hod), JSON.stringify(v)); }
    };
    if (t === 'dlazdice') {
      for (const m of k.vstup.moznosti) zkus(m.id, m.spravne, m.spravne ? null : m.typ_chyby, 'dlazdice');
    } else if (t === 'cislo') {
      zkus(String(k.spravne.hodnota).replace('.', ','), true, null, 'spravne');
      for (const z of k.zname_chyby) zkus(String(z.hodnota).replace('.', ','), false, z.typ_chyby, 'chyba');
    } else if (t === 'zlomek') {
      zkus({ c: String(k.spravne.c), j: String(k.spravne.j) }, true, null, 'spravne');
      for (const z of k.zname_chyby) zkus({ c: String(z.c), j: String(z.j) }, false, z.typ_chyby, 'chyba');
    } else if (t === 'smisene') {
      zkus({ cela: String(k.spravne.cela), c: String(k.spravne.c), j: String(k.spravne.j) }, true, null, 'spravne');
      for (const z of k.zname_chyby) zkus({ cela: String(z.cela), c: String(z.c), j: String(z.j) }, false, z.typ_chyby, 'chyba');
    } else { console.log('neznámý typ', t); chyby++; }
  }
}
console.log(`kontrol: ${n}, chyb: ${chyby}`);
process.exit(chyby ? 1 : 0);
