// =====================================================================
// validator-cj.mjs — doménové kontroly lekcí češtiny (cestina/Obsah/FORMAT-CJ.md).
// Volá je validator.mjs (domenoveKontroly) pro lekce s "predmet": "cestina"; schéma je společné (obsah/schema.json).
// Čisté funkce bez sítě a bez disku: slovník chyb a text AUDIO.md předá volající (seed-lekce.mjs, testy).
//
// Kromě struktury ověřuje i PRŮCHOD skutečným vyhodnocením (web/js/vyhodnoceni.js): vzorová odpověď
// musí vyjít správně a každá známá chyba musí vrátit svůj kód (QA automat, ZADANI-CESTINA §10 bod 4).
// =====================================================================

import { vyhodnotKrok } from '../../web/js/vyhodnoceni.js';
import { tokenizuj, pocetMezer, vzorovaOdpoved } from '../../web/js/vyhodnoceni-cj.js';
import { KAPITOLY } from '../../web/js/hlasky.js';

/**
 * Kódy chyb ze slovníku češtiny (cestina/Obsah/TYPY-CHYB.md). Oproti parsujSlovnikChyb (Matematika) zná i buňky
 * s víc kódy (`vs-b-i-za-y` / `vs-b-y-za-i`) a zkratku `vs-m-*` (= vs-m-i-za-y a vs-m-y-za-i).
 * Vzor `diktat-pravopis-<kód>` není kód; vyhodnocení diktátu ho skládá ze známého jevu.
 * @param {string} md
 * @returns {Set<string>}
 */
export function parsujSlovnikChybCj(md) {
  const kody = new Set();
  for (const radek of md.split(/\r?\n/)) {
    if (!/^\s*\|\s*`/.test(radek)) continue;
    const prvni = radek.split('|')[1] ?? '';
    for (const [, kod] of prvni.matchAll(/`([a-z0-9*-]+)`/g)) {
      if (kod.endsWith('-*')) { kody.add(`${kod.slice(0, -1)}i-za-y`); kody.add(`${kod.slice(0, -1)}y-za-i`); }
      else if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(kod)) kody.add(kod);
    }
  }
  return kody;
}

export const PORADI_TYPU_ULOH_CJ = ['rozcvicka', 'nova', 'nova', 'nova', 'detektiv', 'kontrolni'];
/** Spolu 8 (ZADANI-OSMA §2): 5 úloh — odpadá jedna „nova“. */
export const PORADI_TYPU_ULOH_CJ_OSMA = ['rozcvicka', 'nova', 'nova', 'detektiv', 'kontrolni'];
/** Pořadí typů úloh podle fáze lekce. */
export const poradiTypuCj = (faze) => (faze === 'osma' ? PORADI_TYPU_ULOH_CJ_OSMA : PORADI_TYPU_ULOH_CJ);
const TEMAT_OSMA = 10;

const jeObjekt = (h) => h !== null && typeof h === 'object' && !Array.isArray(h);
const pocetSlov = (s) => (typeof s === 'string' ? s.trim().split(/\s+/).filter(Boolean).length : 0);
const MNOZINOVE = ['dlazdice_vice', 'klik_ve_textu'];

/** Limity slov z obsah/SABLONA.md §4 (hlásí se jako varování). */
const LIMITY = [
  [(u) => u.tahak?.vysvetleni, 'tahak.vysvetleni', 70],
  [(u) => u.tahak?.otocena_role, 'tahak.otocena_role', 25],
  [(u) => u.tahak?.otocena_role_odpoved, 'tahak.otocena_role_odpoved', 40],
  // kontrolní úloha: povinné věty R55 (+ doplněk) mají samy 43 slov; F1 má medián 56 (max 139) → 90
  [(u) => u.tahak?.typicka_chyba, 'tahak.typicka_chyba', (u) => (u.typ === 'kontrolni' ? 90 : 50)],
  [(u) => u.semafor?.zelena, 'semafor.zelena', 25],
  [(u) => u.semafor?.oranzova, 'semafor.oranzova', 60],
  [(u) => u.semafor?.cervena, 'semafor.cervena', 75],
  [(u) => u.zadani, 'zadani', 60],
];

/** Minulý čas s rodem v přímé řeči k dítěti („jsi poznal“) — SABLONA §2 „Bez rodu“. */
const RE_ROD = /\b(jsi|sis|ses|by\s?sis|bys)\s+\p{L}+l[ao]?\b/iu;

/**
 * @param {object} l  lekce
 * @param {string} nazevSouboru
 * @param {{slovnik?: Set<string>|null, audioMd?: string|null, audioExistuje?: (cesta: string) => boolean}} volby
 * @returns {{chyby: string[], varovani: string[]}}
 */
export function domenoveKontrolyCj(l, nazevSouboru, { slovnik = null, audioMd = null, audioExistuje = null } = {}) {
  const chyby = [];
  const varovani = [];
  const chyba = (m) => chyby.push(m);
  const var_ = (m) => varovani.push(m);

  if (nazevSouboru !== `${l.id}.json`) chyba(`název souboru má být "${l.id}.json"`);
  if (l.typ === 'diagnostika' || l.id === 'cj-t0-diag') return diagnostikaCj(l, { chyba, var_, slovnik, chyby, varovani });
  const osma = l.faze === 'osma';
  const m = /^cj-t(\d+)-l(\d+)$/.exec(String(l.id));
  if (m) {
    const [t, n] = [Number(m[1]), Number(m[2])];
    if (l.tyden !== t) chyba(`id ${l.id}: tyden musí být ${t}`);
    if (Math.ceil(n / 4) !== t) chyba(`id ${l.id}: lekce ${n} nepatří do týdne ${t} (4 lekce na týden)`);
    if (l.poradi !== ((n - 1) % 4) + 1) chyba(`id ${l.id}: poradi (v týdnu) musí být ${((n - 1) % 4) + 1}`);
    if (!osma && t > 8) chyba(`id ${l.id}: fáze zaklady má týdny 1–8 (10 témat má jen fáze osma)`);
  }
  const vk = varovaniKapitolyCj(l.kapitola);
  if (vk) var_(vk);

  const ulohy = Array.isArray(l.ulohy) ? l.ulohy : [];
  const poradiTypu = poradiTypuCj(l.faze);
  const typy = ulohy.map((u) => u?.typ);
  if (typy.join() !== poradiTypu.join()) chyba(`pořadí typů úloh musí být ${poradiTypu.join(' → ')}, je ${typy.join(' → ')}`);
  const soucet = ulohy.reduce((s, u) => s + (Number.isInteger(u?.cas_min) ? u.cas_min : 0), 0);
  if (soucet !== l.cas_min) var_(`součet cas_min úloh (${soucet}) ≠ cas_min lekce (${l.cas_min})`);
  if (osma && Number.isInteger(l.cas_min) && (l.cas_min < 22 || l.cas_min > 27)) var_(`cas_min lekce je ${l.cas_min} (Spolu 8: čeština ~25 min)`);
  if (pocetSlov(l.uvod_pro_rodice) > 60) var_(`uvod_pro_rodice má ${pocetSlov(l.uvod_pro_rodice)} slov (max 60)`);
  const tydenniLekce = l.poradi === 4;
  const iKontrolni = poradiTypu.length - 1; // týdenní kontrola = poslední (kontrolní) úloha lekce s poradi 4

  ulohy.forEach((u, i) => {
    if (!jeObjekt(u)) return;
    const kde = `ulohy[${i}] (${u.id})`;
    if (u.id !== `${l.id}-U${i + 1}`) chyba(`${kde}: id úlohy má být "${l.id}-U${i + 1}"`);
    if (i === iKontrolni && Boolean(u.tydenni) !== tydenniLekce) chyba(`${kde}: tydenni má být ${tydenniLekce} (týdenní kontrola je úloha ${iKontrolni + 1} lekce 4 v týdnu)`);
    if (i !== iKontrolni && u.tydenni) chyba(`${kde}: tydenni jen u úlohy ${iKontrolni + 1}`);
    if (u.tydenni && !u.semafor_tydne) chyba(`${kde}: týdenní kontrola potřebuje semafor_tydne`);

    const kroky = Array.isArray(u.kroky) ? u.kroky : [];
    if (kroky.length && kroky[kroky.length - 1]?.id !== 'final') chyba(`${kde}: poslední krok musí mít id "final"`);
    const idKroku = new Set();
    kroky.forEach((k, j) => {
      if (!jeObjekt(k) || !jeObjekt(k.vstup)) return;
      const kk = `${kde}.kroky[${j}] (${k.id})`;
      if (idKroku.has(k.id)) chyba(`${kk}: duplicitní id kroku`);
      idKroku.add(k.id);
      if (k.id !== 'final' && k.id !== `k${j + 1}`) var_(`${kk}: kroky se číslují k1, k2, … (tady k${j + 1})`);
      if (pocetSlov(k.popisek) > 8) var_(`${kk}: popisek má ${pocetSlov(k.popisek)} slov (max 8, SABLONA §4)`);
      kontrolaKroku(k, kk, chyba, var_, slovnik);
      kontrolaPruchodu(k, kk, chyba);
      for (const a of audiaKroku(k)) {
        const idSouboru = a.replace(/^audio\/cestina\//, '');
        if (audioMd !== null && !audioMd.includes('`' + idSouboru + '`')) chyba(`${kk}: nahrávka ${idSouboru} nemá řádek v cestina/Obsah/AUDIO.md`);
        if (audioExistuje && !audioExistuje(a)) var_(`${kk}: soubor web/${a} zatím není (čeká na Pavla, AUDIO.md)`);
      }
      if (osma && k.vstup.typ === 'diktat' && k.vstup.hodnotit_interpunkci !== false) chyba(`${kk}: Spolu 8: diktát interpunkci nehodnotí ("hodnotit_interpunkci": false, ZADANI-OSMA §8 bod 4)`);
      if (osma && k.vstup.typ === 'oznac_role') {
        // nejvýš 8 tlačítek v jedné skupině (u kategorií se každá kategorie ukazuje jako samostatná skupina)
        const pocetRoli = Array.isArray(k.vstup.role) ? k.vstup.role.length : Math.max(0, ...Object.values(k.vstup.role || {}).map((r) => r?.length || 0));
        if (pocetRoli > 8) chyba(`${kk}: oznac_role má ${pocetRoli} rolí (nejvýš 8; rozděl na kroky po skupinách, ZADANI-OSMA §8 bod 8)`);
      }
      if (k.vstup.typ === 'diktat') {
        const slov = k.vstup.vety.reduce((s, v) => s + tokenizuj(v.text).length, 0);
        if (slov > 30) chyba(`${kk}: diktát má ${slov} slov (max 30, ZADANI §6.3)`);
      }
    });
    // text nahrávky dítě nesmí vidět: ani na obrazovce (zadání, popisek, otázka), ani na papíře (tisk.zadani) — FORMAT-CJ §6
    const tajne = tajneVetyUlohy(kroky);
    if (tajne.length) {
      const viditelne = [['zadani', u.zadani], ['tisk.zadani', u.tisk?.zadani],
        ...kroky.flatMap((k) => [[`${k.id}.popisek`, k.popisek], [`${k.id}.otazka`, k.vstup?.otazka]])];
      for (const [pole, text] of viditelne) {
        if (typeof text !== 'string') continue;
        const n = ` ${normalizujVetu(text)} `;
        const veta = tajne.find((t) => n.includes(` ${t} `));
        if (veta) chyba(`${kde}: ${pole} obsahuje text nahrávky („${veta}“) — dítě ho nesmí vidět ani na papíře`);
      }
    }
    if (u.typ === 'detektiv' && kroky[kroky.length - 1]?.vstup?.typ !== 'dlazdice') {
      chyba(`${kde}: druhý krok detektiva je vždy výběr (dlaždice), ZADANI §6.2`);
    }

    // texty pro rodiče (SABLONA §4, §8, §9 a FORMAT-CJ §4–5) — varování pro recenzenta
    for (const [fn, pole, limit] of LIMITY) {
      const max = typeof limit === 'function' ? limit(u) : limit;
      const n = pocetSlov(fn(u));
      if (n > max) var_(`${kde}: ${pole} má ${n} slov (max ${max})`);
    }
    const t = u.tahak || {};
    const prima = [...(t.otazky || []).map((o) => (typeof o === 'string' ? o : o?.text)), t.otocena_role];
    for (const text of prima) {
      if (typeof text !== 'string') continue;
      if (!text.trim().startsWith('„')) var_(`${kde}: otázka / otočená role má být přímá řeč v „…“: ${text.slice(0, 40)}…`);
      if (RE_ROD.test(text)) var_(`${kde}: přímá řeč s rodem („${text.match(RE_ROD)[0]}“) — piš bez rodu (SABLONA §2)`);
    }
    if (u.typ === 'rozcvicka' && !(t.otazky || []).every((o) => jeObjekt(o) && o.k)) {
      var_(`${kde}: otázky rozcvičky jsou po příkladech ({ "k": "A", "text": … }), R56`);
    }
    const s = u.semafor || {};
    if (typeof s.zelena === 'string' && !s.zelena.startsWith('Výborně — ')) var_(`${kde}: semafor.zelena začíná „Výborně — “`);
    if (typeof s.oranzova === 'string' && !/Kontrola pro vás:/.test(s.oranzova)) var_(`${kde}: semafor.oranzova končí „Kontrola pro vás: …“`);
    if (typeof s.cervena === 'string') {
      if (!s.cervena.startsWith('Dnes už nepokračujte')) var_(`${kde}: semafor.cervena začíná „Dnes už nepokračujte, pochvalte snahu.“`);
      if (!/Kontrola pro vás:/.test(s.cervena)) var_(`${kde}: semafor.cervena končí „Kontrola pro vás: …“`);
      if (typeof l.tema === 'string' && !s.cervena.includes(`„${l.tema}“`)) var_(`${kde}: semafor.cervena má „Potom zopakujte lekci „${l.tema}“.“`);
    }
    if (typeof t.typicka_chyba === 'string' && u.typ !== 'kontrolni' && !t.typicka_chyba.startsWith('Podívejte se na obrazovku dítěte.')) {
      var_(`${kde}: typicka_chyba začíná „Podívejte se na obrazovku dítěte.“ (SABLONA §18)`);
    }
  });

  const kon = l.kontrola || {};
  if (kon.jistota === 'nizka' || kon.jistota === 'neurceno') var_(`kontrola.jistota = "${kon.jistota}" — lekce ještě neprošla kontrolou`);
  if (kon.jistota === 'stredni') var_('kontrola.jistota = "stredni" — vedoucí ji má dořešit na "jista"');
  return { chyby, varovani };
}

/** Kapitola mimo obsah/hlasky.md (Názvy kapitol) = varování, ne chyba (osnovy Spolu 8 se ještě píšou). */
function varovaniKapitolyCj(kod, kde = 'kapitola') {
  if (typeof kod !== 'string' || !/^[a-z][a-z-]+$/.test(kod) || kod === 'diagnostika') return null;
  if (Object.prototype.hasOwnProperty.call(KAPITOLY, kod)) return null;
  return `${kde}: kapitola "${kod}" zatím není v obsah/hlasky.md (tabulka „Názvy kapitol“) — doplň řádek a spusť node nastroje/generuj-hlasky.mjs`;
}

/**
 * Diagnostika češtiny Spolu 8 (cj-t0-diag): jako diagnostika matematiky — jen krok final, bez taháku a semaforu,
 * každá úloha s kapitolou (a číslem tématu `tema`), automaticky vyhodnotitelná (žádný diktát), známé chyby s kódy.
 */
function diagnostikaCj(l, { chyba, var_, slovnik, chyby, varovani }) {
  if (l.id !== 'cj-t0-diag') chyba(`diagnostika češtiny má id "cj-t0-diag", je ${l.id}`);
  if (l.typ !== 'diagnostika') chyba('cj-t0-diag musí mít "typ": "diagnostika"');
  if (l.faze !== 'osma') chyba('cj-t0-diag musí mít "faze": "osma"');
  const ulohy = Array.isArray(l.ulohy) ? l.ulohy : [];
  if (ulohy.length < 20 || ulohy.length > 25) var_(`diagnostika má ${ulohy.length} úloh (Spolu 8: 20–25)`);
  if (Number.isInteger(l.cas_min) && Math.abs(l.cas_min - 25) > 5) var_(`diagnostika má cas_min ${l.cas_min} (Spolu 8: ~25 min)`);
  const temata = new Set();
  ulohy.forEach((u, i) => {
    if (!jeObjekt(u)) return;
    const kde = `ulohy[${i}] (${u.id})`;
    if (u.id !== `${l.id}-U${i + 1}`) chyba(`${kde}: id úlohy má být "${l.id}-U${i + 1}"`);
    const vk = varovaniKapitolyCj(u.kapitola, kde);
    if (vk) var_(vk);
    if (Number.isInteger(u.tema)) temata.add(u.tema);
    else chyba(`${kde}: chybí „tema“ (číslo tématu 1–${TEMAT_OSMA}) — bez něj se výsledek nedá přiřadit k tématu`);
    const kroky = Array.isArray(u.kroky) ? u.kroky : [];
    kroky.forEach((k, j) => {
      if (!jeObjekt(k) || !jeObjekt(k.vstup)) return;
      const kk = `${kde}.kroky[${j}] (${k.id})`;
      if (k.id !== 'final') chyba(`${kk}: úloha diagnostiky má jen krok "final"`);
      const v = k.vstup.typ === 'poslech' ? k.vstup.vnoreny_vstup : k.vstup;
      if (k.vstup.typ === 'diktat' || (v?.typ === 'kratky_text' && !k.spravne)) chyba(`${kk}: diagnostika se vyhodnocuje automaticky — diktát ani text bez správné odpovědi do ní nepatří`);
      if (v && v.typ !== 'dlazdice' && !(Array.isArray(k.zname_chyby) && k.zname_chyby.length)) {
        chyba(`${kk}: úloha diagnostiky musí mít zname_chyby s typ_chyby (report rodiči)`);
      }
      if (v?.typ === 'dlazdice' && (v.moznosti || []).some((x) => x && x.spravne === false && !x.typ_chyby)) {
        chyba(`${kk}: v diagnostice má každá špatná dlaždice typ_chyby (report rodiči)`);
      }
      kontrolaKroku(k, kk, chyba, var_, slovnik);
      kontrolaPruchodu(k, kk, chyba);
    });
  });
  if (temata.size) {
    const chybi = [];
    for (let t = 1; t <= TEMAT_OSMA; t++) if (!temata.has(t)) chybi.push(t);
    if (chybi.length) var_(`diagnostika: témata bez úlohy: ${chybi.join(', ')} (o nich diagnostika nic neřekne)`);
  }
  const kon = l.kontrola || {};
  if (kon.jistota === 'nizka' || kon.jistota === 'neurceno') var_(`kontrola.jistota = "${kon.jistota}" — lekce ještě neprošla kontrolou`);
  if (kon.jistota === 'stredni') var_('kontrola.jistota = "stredni" — vedoucí ji má dořešit na "jista"');
  return { chyby, varovani };
}

/** Text bez velikosti písmen a interpunkce (porovnání vět; stejně jako web/js/tisk-cj.js). */
const normalizujVetu = (s) => String(s ?? '').toLocaleLowerCase('cs').normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/** Věty diktátu a přepisů poslechu (aspoň 3 slova — jednotlivá slova z nahrávky smí být v nabídce). */
function tajneVetyUlohy(kroky) {
  const texty = kroky.flatMap((k) => {
    const v = k?.vstup;
    if (v?.typ === 'diktat') return (v.vety || []).map((x) => x?.text);
    if (v?.typ === 'poslech') return String(v.prepis || '').split(/(?<=[.!?…])\s+/);
    return [];
  });
  return [...new Set(texty.map(normalizujVetu).filter((t) => t.split(' ').length >= 3))];
}

function audiaKroku(k) {
  if (k.vstup.typ === 'poslech') return [k.vstup.audio];
  if (k.vstup.typ === 'diktat') return (k.vstup.vety || []).map((v) => v.audio);
  return [];
}

function kontrolaKodu(kod, kde, chyba, slovnik) {
  if (!slovnik || typeof kod !== 'string' || !kod.trim()) return;
  if (!slovnik.has(kod)) chyba(`${kde}: typ_chyby "${kod}" není ve slovníku cestina/Obsah/TYPY-CHYB.md`);
}

function kontrolaKroku(k, kde, chyba, var_, slovnik) {
  const v = k.vstup.typ === 'poslech' ? k.vstup.vnoreny_vstup : k.vstup;
  if (!jeObjekt(v)) return;
  const sp = k.spravne;
  const zn = Array.isArray(k.zname_chyby) ? k.zname_chyby : [];
  zn.forEach((z, i) => kontrolaKodu(z?.typ_chyby, `${kde}.zname_chyby[${i}]`, chyba, slovnik));
  (k.chyby_ocekavane || []).forEach((z, i) => kontrolaKodu(z?.typ_chyby, `${kde}.chyby_ocekavane[${i}]`, chyba, slovnik));

  switch (v.typ) {
    case 'dlazdice': {
      const moznosti = Array.isArray(v.moznosti) ? v.moznosti : [];
      const spravnych = moznosti.filter((x) => x?.spravne === true).length;
      if (spravnych !== 1) chyba(`${kde}: dlaždice musí mít právě 1 správnou možnost, má ${spravnych}`);
      const ids = new Set();
      moznosti.forEach((x, i) => {
        if (!jeObjekt(x)) return;
        if (ids.has(x.id)) chyba(`${kde}.moznosti[${i}]: duplicitní id "${x.id}"`);
        ids.add(x.id);
        kontrolaKodu(x.typ_chyby, `${kde}.moznosti[${i}]`, chyba, slovnik);
        if (x.spravne === true && x.typ_chyby) var_(`${kde}.moznosti[${i}]: správná možnost má typ_chyby — omyl?`);
      });
      const texty = moznosti.map((x) => x?.text);
      if (new Set(texty).size !== texty.length) chyba(`${kde}: dvě dlaždice mají stejný text`);
      break;
    }
    case 'dlazdice_vice':
    case 'klik_ve_textu': {
      const n = v.typ === 'klik_ve_textu' ? tokenizuj(v.text).length : 0;
      const vesmir = v.typ === 'dlazdice_vice' ? new Set(v.moznosti)
        : new Set([...Array(v.cil === 'mezery' ? n - 1 : n).keys()]);
      const mimo = (arr) => (Array.isArray(arr) ? arr.filter((x) => !vesmir.has(x)) : []);
      if (v.typ === 'dlazdice_vice' && new Set(v.moznosti).size !== v.moznosti.length) chyba(`${kde}: dvě dlaždice mají stejný text`);
      if (!Array.isArray(sp)) break;
      if (mimo(sp).length) chyba(`${kde}: správně mimo vstup: ${mimo(sp).join(', ')}`);
      if (new Set(sp).size !== sp.length) chyba(`${kde}: správná odpověď má duplicitní prvek`);
      if (mimo(v.volitelne).length) chyba(`${kde}: volitelne mimo vstup: ${mimo(v.volitelne).join(', ')}`);
      if ((v.volitelne || []).some((x) => sp.includes(x))) chyba(`${kde}: volitelný prvek nesmí být zároveň ve spravne`);
      if (v.typ === 'klik_ve_textu') {
        if (sp.length > v.max) chyba(`${kde}: správných ${sp.length} > max ${v.max}`);
        if (sp.length < v.min) chyba(`${kde}: správných ${sp.length} < min ${v.min}`);
        if (v.max < sp.length + (v.volitelne?.length || 0)) chyba(`${kde}: max ${v.max} nestačí na správné + volitelné`);
      }
      zn.forEach((z, i) => {
        const kz = `${kde}.zname_chyby[${i}]`;
        if (!z.hodnota && !z.navic && !z.chybi) chyba(`${kz}: potřebuje hodnota, navic nebo chybi`);
        for (const pole of ['hodnota', 'navic', 'chybi']) if (mimo(z[pole]).length) chyba(`${kz}: ${pole} mimo vstup: ${mimo(z[pole]).join(', ')}`);
        if ((z.navic || []).some((x) => sp.includes(x))) chyba(`${kz}: navic obsahuje správný prvek`);
        if ((z.chybi || []).some((x) => !sp.includes(x))) chyba(`${kz}: chybi obsahuje prvek, který není správně`);
      });
      break;
    }
    case 'doplnit_pismeno': {
      const mezer = pocetMezer(v.text);
      if (mezer !== v.mezery.length) chyba(`${kde}: v textu je ${mezer} podtržítek, mezer je ${v.mezery.length}`);
      v.mezery.forEach((mz, i) => { if (mz.i !== i) chyba(`${kde}: mezery[${i}].i má být ${i}`); });
      if (!Array.isArray(sp) || sp.length !== v.mezery.length) { chyba(`${kde}: spravne musí mít ${v.mezery.length} položek`); break; }
      sp.forEach((x, i) => { if (!v.mezery[i].moznosti.includes(x)) chyba(`${kde}: mezera ${i}: „${x}“ není v možnostech`); });
      zn.forEach((z, i) => {
        if (z.hodnota?.length !== v.mezery.length) chyba(`${kde}.zname_chyby[${i}]: hodnota má jinou délku než mezery`);
      });
      break;
    }
    case 'oznac_role': {
      const n = tokenizuj(v.text).length;
      if (v.slova.some((i) => i >= n)) chyba(`${kde}: index slova mimo text (${n} slov)`);
      if (new Set(v.slova).size !== v.slova.length) chyba(`${kde}: slova obsahují duplicitu`);
      if (!jeObjekt(sp)) break;
      const klice = Object.keys(sp).map(Number).sort((a, b) => a - b);
      if (JSON.stringify(klice) !== JSON.stringify([...v.slova].sort((a, b) => a - b))) chyba(`${kde}: klíče spravne ≠ slova`);
      const roleOk = (h, kat) => (Array.isArray(v.role) ? v.role.includes(h) : (v.role?.[kat] || []).includes(h));
      const zkontroluj = (obj, co) => {
        for (const [i, h] of Object.entries(obj || {})) {
          if (!v.slova.includes(Number(i))) chyba(`${kde}: ${co}: slovo ${i} není mezi označenými`);
          if (jeObjekt(h)) { for (const [kat, x] of Object.entries(h)) if (!roleOk(x, kat)) chyba(`${kde}: ${co}: role „${x}“ (${kat}) není v nabídce`); }
          else if (!roleOk(h)) chyba(`${kde}: ${co}: role „${h}“ není v nabídce`);
        }
      };
      zkontroluj(sp, 'spravne');
      zn.forEach((z, i) => zkontroluj(z.hodnota, `zname_chyby[${i}]`));
      break;
    }
    case 'seradit':
      if (!Array.isArray(sp) || JSON.stringify([...sp].sort()) !== JSON.stringify([...v.polozky].sort())) chyba(`${kde}: spravne není pořadí všech položek`);
      else if (JSON.stringify(sp) === JSON.stringify(v.polozky)) chyba(`${kde}: položky jsou už ve správném pořadí — zamíchej je (FORMAT-CJ §3.2, KONTROLA A8)`);
      break;
    default:
      break;
  }
}

/**
 * Odpovědi, které mají vyvolat danou známou chybu (podle typu vstupu). U množin se každý prvek `navic`
 * a `chybi` zkouší zvlášť a odpověď se ořízne na `max` (detektiv má max 1).
 */
function odpovediProChybu(v, sp, z) {
  switch (v.typ) {
    case 'dlazdice_vice':
    case 'klik_ve_textu': {
      if (z.hodnota) return [z.hodnota];
      const max = v.max ?? Infinity;
      const orizni = (a) => (a.length > max ? a.slice(-max) : a);
      return [
        ...(z.navic || []).map((x) => orizni([...sp, x])),
        ...(z.chybi || []).map((x) => sp.filter((y) => y !== x)).map((a) => (a.length ? a : null)).filter(Boolean),
      ];
    }
    case 'doplnit_pismeno':
      return [sp.map((x, i) => z.hodnota[i] ?? x)];
    case 'oznac_role': {
      const odp = structuredClone(sp);
      for (const [kl, h] of Object.entries(z.hodnota)) odp[kl] = jeObjekt(h) ? { ...odp[kl], ...h } : h;
      return [odp];
    }
    default:
      return [z.hodnota];
  }
}

function kontrolaPruchodu(k, kde, chyba) {
  const v = k.vstup.typ === 'poslech' ? k.vstup.vnoreny_vstup : k.vstup;
  if (!jeObjekt(v)) return;
  try {
    const ok = vyhodnotKrok(k, vzorovaOdpoved(k));
    if (ok.spravne !== true) chyba(`${kde}: vzorová odpověď nevyšla správně (${JSON.stringify(ok)})`);
    if (MNOZINOVE.includes(v.typ) && v.volitelne?.length) {
      const s = vyhodnotKrok(k, [...k.spravne, ...v.volitelne]);
      if (s.spravne !== true) chyba(`${kde}: odpověď i s volitelnými prvky nevyšla správně`);
    }
    if (v.typ === 'dlazdice') {
      for (const m of v.moznosti.filter((x) => !x.spravne)) {
        const r = vyhodnotKrok(k, m.id);
        if (r.spravne !== false || r.typ_chyby !== (m.typ_chyby ?? null)) chyba(`${kde}: dlaždice „${m.text}“ nevrátila ${m.typ_chyby ?? 'obecnou chybu'}`);
      }
      return;
    }
    for (const z of k.zname_chyby || []) {
      for (const odp of odpovediProChybu(v, k.spravne, z)) {
        const r = vyhodnotKrok(k, odp);
        if (r.neplatne) chyba(`${kde}: odpověď pro ${z.typ_chyby} je neplatná (${JSON.stringify(odp)}) — zkontroluj min/max a délku`);
        else if (r.spravne) chyba(`${kde}: odpověď pro ${z.typ_chyby} vyšla jako správná`);
        else if (!(r.chyby || []).some((c) => c.kod === z.typ_chyby)) chyba(`${kde}: ${z.typ_chyby} se nevrátil pro ${JSON.stringify(odp)} (vráceno ${JSON.stringify((r.chyby || []).map((c) => c.kod))})`);
      }
    }
  } catch (e) {
    chyba(`${kde}: vyhodnocení spadlo: ${e.message}`);
  }
}
