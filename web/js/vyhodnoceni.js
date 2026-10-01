// Společná vyhodnocovací logika (žák, rodič, tisk, admin, testy).
// Čisté funkce bez DOM; importovatelné v prohlížeči i v Node (`node --test testy/`).
// Formát kroků: kostra/03-format-obsahu.md. Matice semaforu: kostra/02-datovy-model.md.
// Čeština (cestina/Obsah/FORMAT-CJ.md): nové vstupy vyhodnocuje vyhodnoceni-cj.js, `poslech` tady přes vnořený vstup.

import { vyhodnotKrokCj, TYPY_VSTUPU_CJ } from './vyhodnoceni-cj.js';

// ---------- racionální čísla (BigInt, bez zaokrouhlovacích chyb) ----------

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Zlomek {c, j} v BigInt, jmenovatel kladný, zkrácený. */
function zlomek(c, j) {
  if (j === 0n) return null;
  if (j < 0n) { c = -c; j = -j; }
  const d = gcd(c, j) || 1n;
  return { c: c / d, j: j / d };
}

function rovno(a, b) {
  return a && b && a.c * b.j === b.c * a.j;
}

/**
 * Normalizuje textový zápis čísla: mezery (i nezlomitelné), desetinná čárka → tečka,
 * typografické mínus → '-'. Vrací řetězec nebo null.
 */
export function normalizujCislo(vstup) {
  if (vstup === null || vstup === undefined) return null;
  const s = String(vstup)
    .replace(/[\s   ]/g, '')
    .replace(/[−–]/g, '-')
    .replace(',', '.');
  return s === '' ? null : s;
}

/** Celé číslo z řetězce/čísla → BigInt, jinak null. */
function celeCislo(vstup) {
  const s = normalizujCislo(vstup);
  if (s === null || !/^[+-]?\d+$/.test(s)) return null;
  return BigInt(s);
}

/**
 * Desetinné číslo nebo zápis „a/b" → racionální číslo {c, j}, jinak null.
 * Přijímá „12", „12,0", „12.0", „ 12 ", „-0,5", „,5", „3/4".
 */
export function naRacionalni(vstup) {
  if (typeof vstup === 'number') {
    if (!Number.isFinite(vstup)) return null;
    vstup = String(vstup);
  }
  const s = normalizujCislo(vstup);
  if (s === null) return null;
  const zl = /^([+-]?\d+)\/([+-]?\d+)$/.exec(s);
  if (zl) return zlomek(BigInt(zl[1]), BigInt(zl[2]));
  const m = /^([+-]?)(\d*)(?:\.(\d+))?$/.exec(s);
  if (!m || (m[2] === '' && m[3] === undefined)) return null;
  const desetinna = m[3] ?? '';
  const citatel = BigInt((m[2] || '0') + desetinna) * (m[1] === '-' ? -1n : 1n);
  return zlomek(citatel, 10n ** BigInt(desetinna.length));
}

const prazdne = (x) => x === undefined || x === null || String(x).trim() === '';

function zlomekZObjektu(h) {
  if (!h) return null;
  const c = celeCislo(h.c);
  // Prázdný jmenovatel = dítě zadalo celé číslo (6 → 6/1), aby se chytily i známé chyby typu „6".
  const j = prazdne(h.j) && !prazdne(h.c) ? 1n : celeCislo(h.j);
  if (c === null || j === null || j === 0n) return null;
  return { surovy: { c, j }, hodnota: zlomek(c, j) };
}

function smiseneZObjektu(h) {
  if (!h) return null;
  const cela = h.cela === '' || h.cela === undefined || h.cela === null ? 0n : celeCislo(h.cela);
  const c = celeCislo(h.c);
  const j = celeCislo(h.j);
  if (cela === null || c === null || j === null || j === 0n || c < 0n || j < 0n) return null;
  // −2 1/3 = −(2 + 1/3)
  const znamenko = cela < 0n || String(h.cela ?? '').trim().startsWith('-') ? -1n : 1n;
  const abs = cela < 0n ? -cela : cela;
  return { surovy: { cela: abs, c, j }, hodnota: zlomek(znamenko * (abs * j + c), j) };
}

// ---------- vyhodnocení kroku ----------

/**
 * Vyhodnotí jednu odpověď na krok.
 * @param {object} krok  krok z JSON lekce ({vstup, spravne, zname_chyby, kontrola_tvaru})
 * @param {*} hodnota    dlazdice: id možnosti (string) | cislo: string/number |
 *                       zlomek: {c, j} | smisene: {cela, c, j} | text: string |
 *                       vyraz: string („3x - 2(x+1)") | poradi: pole id operací v pořadí kliknutí |
 *                       rysovani: 'hotovo' (dítě, hodnotí rodič) | 'sedi' | 'nesedi' (rodič)
 * @returns {{spravne: boolean|null, typ_chyby: string|null, poznamka: string|null, neplatne: boolean}}
 *   neplatne = vstup nejde přečíst (prázdné pole, písmena, jmenovatel 0, neúplné pořadí) — UI má
 *   požádat o opravu a NEpočítat to jako pokus.
 *   poznamka: 'nezkraceno' (správně, ale ne v základním tvaru) | 'hodnoti-rodic' (text) |
 *     vyraz (R43: vše NEsedí, spravne false, typ_chyby null): 'zjednodus' (hodnoty ano, víc členů než spravne.vyraz) |
 *     'roznasob' (hodnoty ano, závorka při kontrola_tvaru bez_zavorek) | 'neni-soucin' (hodnoty ano, kontrola_tvaru soucin) | null
 *   Při soucin + vstup.vytknout nesedí jiný rozklad: typ_chyby vytkl-bez-minusu / vytknul-neuplne.
 */
export function vyhodnotKrok(krok, hodnota) {
  const typ = krok?.vstup?.typ;
  const vysledek = (spravne, typ_chyby = null, poznamka = null, neplatne = false) =>
    ({ spravne, typ_chyby, poznamka, neplatne });
  const neplatny = () => vysledek(false, null, null, true);

  switch (typ) {
    case 'dlazdice': {
      const id = typeof hodnota === 'object' && hodnota !== null ? hodnota.id : hodnota;
      const m = (krok.vstup.moznosti || []).find((x) => x.id === id);
      if (!m) return neplatny();
      return m.spravne ? vysledek(true) : vysledek(false, m.typ_chyby ?? null);
    }

    case 'cislo': {
      const h = naRacionalni(hodnota);
      if (!h) return neplatny();
      const ok = naRacionalni(krok.spravne?.hodnota);
      if (rovno(h, ok)) return vysledek(true);
      return vysledek(false, znamaChyba(krok, (z) => rovno(h, naRacionalni(z.hodnota))));
    }

    case 'zlomek': {
      const h = zlomekZObjektu(hodnota);
      if (!h) return neplatny();
      const ok = zlomekZObjektu(krok.spravne);
      if (rovno(h.hodnota, ok?.hodnota)) {
        const zakladni = h.surovy.j > 0n && gcd(h.surovy.c, h.surovy.j) === 1n;
        if (krok.kontrola_tvaru === 'zakladni_tvar' && !zakladni) {
          return vysledek(true, null, 'nezkraceno');
        }
        return vysledek(true);
      }
      return vysledek(false, znamaChyba(krok, (z) => rovno(h.hodnota, zlomekZObjektu(z)?.hodnota)));
    }

    case 'smisene': {
      const h = smiseneZObjektu(hodnota);
      if (!h) return neplatny();
      const ok = smiseneZObjektu(krok.spravne);
      if (rovno(h.hodnota, ok?.hodnota)) {
        const { c, j } = h.surovy;
        const zakladni = c < j && gcd(c, j) === 1n;
        if (krok.kontrola_tvaru === 'zakladni_tvar' && !zakladni) {
          return vysledek(true, null, 'nezkraceno');
        }
        return vysledek(true);
      }
      return vysledek(false, znamaChyba(krok, (z) => rovno(h.hodnota, smiseneZObjektu(z)?.hodnota)));
    }

    case 'vyraz': return vyhodnotVyraz(krok, hodnota, vysledek, neplatny);

    case 'poradi': {
      const ids = (krok.vstup.operace || []).map((o) => o.id);
      if (!Array.isArray(hodnota) || hodnota.length !== ids.length || new Set(hodnota).size !== ids.length
        || !hodnota.every((x) => ids.includes(x))) return neplatny();
      const stejne = (p) => Array.isArray(p) && p.length === hodnota.length && p.every((x, i) => x === hodnota[i]);
      if ((krok.spravne?.poradi || []).some(stejne)) return vysledek(true);
      return vysledek(false, znamaChyba(krok, (z) => stejne(z.poradi)));
    }

    case 'text': {
      if (typeof hodnota !== 'string' || hodnota.trim() === '') return neplatny();
      return vysledek(null, null, 'hodnoti-rodic');
    }

    // Fáze 2 (R38): dítě rýsuje na papír a klikne „Hotovo" (hodnotí rodič), rodič klikne Sedí / Nesedí
    case 'rysovani': {
      if (hodnota === 'hotovo') return vysledek(null, null, 'hodnoti-rodic');
      if (hodnota === 'sedi') return vysledek(true);
      if (hodnota === 'nesedi') return vysledek(false);
      return neplatny();
    }

    // Čeština: dítě poslouchá nahrávku, odpovídá vnořeným vstupem (dlaždice Matematiky nebo vstup češtiny)
    case 'poslech': {
      if (!krok.vstup?.vnoreny_vstup) return neplatny();
      return vyhodnotKrok({ ...krok, vstup: krok.vstup.vnoreny_vstup }, hodnota);
    }

    default:
      if (TYPY_VSTUPU_CJ.includes(typ)) return vyhodnotKrokCj(krok, hodnota);
      throw new Error(`Neznámý typ vstupu: ${typ}`);
  }
}

// ---------- vstup `vyraz` (kostra/03 „Doplněno 25. 9.", SABLONA §15, ODPOVED-D bod 2) ----------

/** Racionální aritmetika nad {c, j} (BigInt). null = nedefinováno (dělení nulou). */
const R = {
  z: (n) => ({ c: BigInt(n), j: 1n }),
  plus: (a, b) => (a && b ? zlomek(a.c * b.j + b.c * a.j, a.j * b.j) : null),
  minus: (a, b) => (a && b ? zlomek(a.c * b.j - b.c * a.j, a.j * b.j) : null),
  krat: (a, b) => (a && b ? zlomek(a.c * b.c, a.j * b.j) : null),
  deleno: (a, b) => (a && b && b.c !== 0n ? zlomek(a.c * b.j, a.j * b.c) : null),
  mocnina(a, n) {
    if (!a) return null;
    if (n < 0n) return R.mocnina(R.deleno(R.z(1), a), -n);
    let v = R.z(1);
    for (let i = 0n; i < n; i += 1n) v = R.krat(v, a);
    return v;
  },
};

/**
 * Normalizace zápisu výrazu (dítě i autor): mezery pryč, `·` `⋅` `×` `*` = krát, `:` `÷` = děleno,
 * `−` `–` = minus, `x²` `x³` = `x^2` `x^3`, desetinná čárka = tečka.
 * @param {string} vstup
 * @returns {string}
 */
export function normalizujVyraz(vstup) {
  return String(vstup ?? '')
    .replace(/[\s   ]/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/[·⋅×∙]/g, '*')
    .replace(/[:÷]/g, '/')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/,/g, '.');
}

/**
 * Ruční parser výrazu (rekurzivní sestup), bez závislostí. Gramatika:
 *   soucet := clen (('+'|'-') clen)*            clen := unarni (('*'|'/'|implicitně) unarni)*
 *   unarni := ('+'|'-') unarni | mocnina         mocnina := zaklad ('^' exponent)?
 *   zaklad := číslo | proměnná | '(' soucet ')'  exponent := '-'? celé číslo | '(' výraz s celou hodnotou ')'
 * Implicitní násobení: `3x`, `2(x+1)`, `x(x-1)`, `(x+1)(x-1)`, `xy`. −x^2 = −(x^2).
 * @param {string} vstup  zápis výrazu
 * @param {string[]} [promenne=['x']]  povolená písmena (jiné písmeno = nejde přečíst)
 * @returns {object|null}  strom: {t:'cislo', v, text} | {t:'prom', n} | {t:'+'|'-'|'*'|'/', a, b, implicitni?} |
 *   {t:'neg', a} | {t:'^', a, n}; `zavorka: true` = uzel byl v závorkách. null = nejde přečíst.
 */
export function parsujVyraz(vstup, promenne = ['x']) {
  const s = normalizujVyraz(vstup);
  if (!s) return null;
  const tokeny = [];
  for (let k = 0; k < s.length;) {
    const z = s[k];
    const cislo = /^(\d+(?:\.\d+)?|\.\d+)/.exec(s.slice(k));
    if (cislo) { tokeny.push({ t: 'cislo', v: naRacionalni(cislo[1]), text: cislo[1] }); k += cislo[1].length; continue; }
    if (/\p{L}/u.test(z)) {
      if (!promenne.includes(z)) return null;
      tokeny.push({ t: 'prom', n: z }); k += 1; continue;
    }
    if ('+-*/^()'.includes(z)) { tokeny.push({ t: z }); k += 1; continue; }
    return null;
  }
  let i = 0;
  const dalsi = () => tokeny[i];
  const vezmi = (t) => (tokeny[i]?.t === t ? tokeny[i++] : null);

  function soucet() {
    let a = clen();
    for (let op = dalsi()?.t; a && (op === '+' || op === '-'); op = dalsi()?.t) {
      i += 1;
      const b = clen();
      if (!b) return null;
      a = { t: op, a, b };
    }
    return a;
  }
  function clen() {
    let a = unarni();
    while (a) {
      const t = dalsi()?.t;
      if (t === '*' || t === '/') {
        i += 1;
        const b = unarni();
        if (!b) return null;
        a = { t, a, b };
      } else if (t === 'cislo' || t === 'prom' || t === '(') {
        // implicitní násobení; „x2" (číslo za proměnnou) nebereme — dítě chtělo nejspíš x²
        if (t === 'cislo') return null;
        const b = mocnina();
        if (!b) return null;
        a = { t: '*', a, b, implicitni: true };
      } else break;
    }
    return a;
  }
  function unarni() {
    if (vezmi('-')) { const a = unarni(); return a && { t: 'neg', a }; }
    if (vezmi('+')) return unarni();
    return mocnina();
  }
  function mocnina() {
    const a = zaklad();
    if (!a || !vezmi('^')) return a;
    let n = null;
    if (vezmi('(')) {
      const e = soucet();
      if (!e || !vezmi(')')) return null;
      const v = vyhodnotStrom(e, {});
      if (v && v.j === 1n) n = v.c;
    } else {
      const minus = Boolean(vezmi('-'));
      const c = vezmi('cislo');
      if (c && c.v?.j === 1n) n = minus ? -c.v.c : c.v.c;
    }
    if (n === null || n > 20n || n < -20n) return null;
    return { t: '^', a, n };
  }
  function zaklad() {
    const tok = dalsi();
    if (!tok) return null;
    if (tok.t === 'cislo') { i += 1; return tok.v ? { t: 'cislo', v: tok.v, text: tok.text } : null; }
    if (tok.t === 'prom') { i += 1; return { t: 'prom', n: tok.n }; }
    if (tok.t === '(') {
      i += 1;
      const e = soucet();
      if (!e || !vezmi(')')) return null;
      return { ...e, zavorka: true };
    }
    return null;
  }
  const strom = soucet();
  return strom && i === tokeny.length ? strom : null;
}

/**
 * Hodnota stromu při dosazení.
 * @param {object} u  strom z parsujVyraz
 * @param {Object<string, {c: bigint, j: bigint}>} dosazeni
 * @returns {{c: bigint, j: bigint}|null}  null = nedefinováno (dělení nulou) nebo chybí proměnná
 */
export function vyhodnotStrom(u, dosazeni) {
  switch (u?.t) {
    case 'cislo': return u.v;
    case 'prom': return dosazeni[u.n] ?? null;
    case 'neg': { const a = vyhodnotStrom(u.a, dosazeni); return a && { c: -a.c, j: a.j }; }
    case '+': return R.plus(vyhodnotStrom(u.a, dosazeni), vyhodnotStrom(u.b, dosazeni));
    case '-': return R.minus(vyhodnotStrom(u.a, dosazeni), vyhodnotStrom(u.b, dosazeni));
    case '*': return R.krat(vyhodnotStrom(u.a, dosazeni), vyhodnotStrom(u.b, dosazeni));
    case '/': return R.deleno(vyhodnotStrom(u.a, dosazeni), vyhodnotStrom(u.b, dosazeni));
    case '^': return R.mocnina(vyhodnotStrom(u.a, dosazeni), u.n);
    default: return null;
  }
}

/**
 * Počet členů = sčítanců na nejvyšší úrovni (mimo závorky). Unární minus člen nepřidává.
 * @param {object} strom  z parsujVyraz
 * @returns {number}
 */
export function pocetClenu(strom) {
  if (!strom) return 0;
  if (!strom.zavorka && (strom.t === '+' || strom.t === '-')) return pocetClenu(strom.a) + pocetClenu(strom.b);
  if (!strom.zavorka && strom.t === 'neg') return pocetClenu(strom.a);
  return 1;
}

/** Obsahuje výraz závorku se součtem/rozdílem (neroznásobenou)? `(-3)x` ani `(2x)^2` se nepočítá. */
export function maZavorkuSoucet(strom) {
  if (!strom || typeof strom !== 'object') return false;
  if (strom.zavorka && pocetClenu({ ...strom, zavorka: false }) > 1) return true;
  return [strom.a, strom.b].some(maZavorkuSoucet);
}

/** Obsahuje výraz umocněnou závorku se součinem, např. `(2x)^2`? Při bez_zavorek je to nedokončený tvar (recenze F2-T05-L1). */
export function maUmocnenouZavorku(strom) {
  if (!strom || typeof strom !== 'object') return false;
  if (strom.t === '^' && strom.a?.zavorka && strom.a.t === '*') return true;
  return [strom.a, strom.b].some(maUmocnenouZavorku);
}

/** Je výraz součin (i se znaménkem minus před ním, i `(x+2)^2`)? Pro kontrola_tvaru `soucin` (vytýkání). */
export function jeSoucin(strom) {
  let u = strom;
  while (u && u.t === 'neg') u = u.a;
  if (!u) return false;
  if (u.t === '*') return true;
  return u.t === '^' && pocetClenu({ ...u.a, zavorka: false }) > 1;
}

/**
 * Co je vytknuté před závorkou: součin činitelů bez součtu (čísla, proměnné, mocniny), se znaménkem.
 * `-2x(4x-1)` → strom `-2x`; `(4x-1)(-2x)` → `-2x`. Pro `vstup.vytknout`.
 * @param {object} strom  z parsujVyraz (součin, viz jeSoucin)
 * @returns {object}  strom vytknutého činitele (bez činitelů `1` → číslo 1)
 */
export function vytknutyCinitel(strom) {
  let zaporne = false;
  const cinitele = [];
  (function rozloz(u) {
    if (u.t === 'neg') { zaporne = !zaporne; rozloz(u.a); return; }
    if (u.t === '*') { rozloz(u.a); rozloz(u.b); return; }
    const zaklad = u.t === '^' ? u.a : u;
    if (pocetClenu({ ...zaklad, zavorka: false }) === 1) cinitele.push(u);
  })(strom);
  const v = cinitele.reduce((a, b) => ({ t: '*', a, b }), { t: 'cislo', v: R.z(1) });
  return zaporne ? { t: 'neg', a: v } : v;
}

const ZAKLAD_DOSAZENI =[R.z(-3), R.z(2), { c: 1n, j: 2n }];

/**
 * Sady dosazení: `vstup.dosazeni` (hodnoty čísla nebo „a/b"), jinak výchozí x = −3, 2, ½;
 * další proměnné cyklicky posunuté (y = 2, ½, −3).
 * @param {{promenne?: string[], dosazeni?: Array<Object<string, number|string>>}} vstup
 * @returns {Array<Object<string, {c: bigint, j: bigint}|null>>}
 */
export function sadyDosazeni(vstup) {
  const promenne = vstup?.promenne?.length ? vstup.promenne : ['x'];
  if (Array.isArray(vstup?.dosazeni) && vstup.dosazeni.length) {
    return vstup.dosazeni.map((sada) => Object.fromEntries(promenne.map((p) => [p, naRacionalni(sada?.[p])])));
  }
  return [0, 1, 2].map((k) => Object.fromEntries(promenne.map((p, i) => [p, ZAKLAD_DOSAZENI[(k + i) % 3]])));
}

/** Shodují se dva stromy ve všech sadách dosazení (nedefinováno v obou = přeskočit)? */
function stejneHodnoty(a, b, sady) {
  if (!a || !b) return false;
  let porovnano = 0;
  for (const d of sady) {
    const va = vyhodnotStrom(a, d);
    const vb = vyhodnotStrom(b, d);
    if (!va && !vb) continue;
    if (!rovno(va, vb)) return false;
    porovnano += 1;
  }
  return porovnano > 0;
}

function vyhodnotVyraz(krok, hodnota, vysledek, neplatny) {
  if (typeof hodnota !== 'string' || !hodnota.trim()) return neplatny();
  const promenne = krok.vstup?.promenne?.length ? krok.vstup.promenne : ['x'];
  const strom = parsujVyraz(hodnota, promenne);
  if (!strom) return neplatny();
  const sady = sadyDosazeni(krok.vstup);
  const spravny = parsujVyraz(krok.spravne?.vyraz, promenne);
  if (stejneHodnoty(strom, spravny, sady)) {
    const tvar = krok.kontrola_tvaru;
    if (tvar === 'soucin') {
      if (!jeSoucin(strom)) return vysledek(false, null, 'neni-soucin');
      const chtene = krok.vstup?.vytknout ? parsujVyraz(krok.vstup.vytknout, promenne) : null;
      if (chtene) {
        const vytknuto = vytknutyCinitel(strom);
        if (stejneHodnoty(vytknuto, { t: 'neg', a: chtene }, sady)) return vysledek(false, 'vytkl-bez-minusu');
        if (!stejneHodnoty(vytknuto, chtene, sady)) return vysledek(false, 'vytknul-neuplne');
      }
      return vysledek(true);
    }
    // R43: hodnota sedí, ale výraz není dokončený (závorka / víc členů) = NEsedí, jako neni-soucin
    if (tvar === 'bez_zavorek' && (maZavorkuSoucet(strom) || maUmocnenouZavorku(strom))) return vysledek(false, null, 'roznasob');
    // R43: součet s nerozepsanou závorkou, kterou správný tvar nemá (opsané zadání „4x - 2(x-3)“), i bez kontrola_tvaru;
    // čistý součin závorek ((x-y)(x+y) u x^2-y^2) zůstává správně
    if (pocetClenu(strom) > 1 && maZavorkuSoucet(strom) && !maZavorkuSoucet(spravny)) return vysledek(false, null, 'zjednodus');
    if (pocetClenu(strom) > pocetClenu(spravny)) return vysledek(false, null, 'zjednodus');
    return vysledek(true);
  }
  return vysledek(false, znamaChyba(krok, (z) => stejneHodnoty(strom, parsujVyraz(z.vyraz, promenne), sady)));
}

/**
 * Výraz dítěte jako LaTeX pro náhled (zachová tvar: závorky, pořadí; `*` → `\cdot`, `/` → `:`).
 * @param {string} vstup
 * @param {string[]} [promenne]
 * @returns {string|null}  null = zápis zatím nejde přečíst
 */
export function vyrazNaLatex(vstup, promenne = ['x']) {
  const strom = parsujVyraz(vstup, promenne);
  return strom ? latexStromu(strom) : null;
}

function latexStromu(u) {
  let t;
  switch (u.t) {
    case 'cislo': t = u.text ? u.text.replace('.', '{,}') : String(u.v.c); break;
    case 'prom': t = u.n; break;
    case 'neg': t = `-${latexStromu(u.a)}`; break;
    case '+': t = `${latexStromu(u.a)} + ${latexStromu(u.b)}`; break;
    case '-': t = `${latexStromu(u.a)} - ${latexStromu(u.b)}`; break;
    case '*': {
      const b = latexStromu(u.b);
      t = `${latexStromu(u.a)}${u.implicitni && !/^[-\d]/.test(b) ? '' : ' \\cdot '}${b}`;
      break;
    }
    case '/': t = `${latexStromu(u.a)} : ${latexStromu(u.b)}`; break;
    case '^': t = `${latexStromu(u.a)}^{${u.n}}`; break;
    default: t = '';
  }
  return u.zavorka ? `\\left(${t}\\right)` : t;
}

function znamaChyba(krok, shoda) {
  const z = (krok.zname_chyby || []).find((x) => {
    try { return shoda(x); } catch { return false; }
  });
  return z ? z.typ_chyby ?? null : null;
}

// ---------- semafor ----------

export const VOLBY_RODICE = ['sam', 's_otazkou', 'chyba_pocty', 'nevedel'];

/**
 * Barva semaforu podle matice v kostra/02.
 * @param {'sam'|'s_otazkou'|'chyba_pocty'|'nevedel'} volba  volba rodiče
 * @param {boolean|null|undefined} spravne  správnost posledního `final` kroku;
 *   false/null/undefined = sloupec „špatně / neodevzdáno"
 * @returns {{barva: 'zelena'|'oranzova'|'cervena', poznamka: string|null}}
 *   poznamka 'priste-bez-otazky' u zelené po otázce
 */
export function barvaSemaforu(volba, spravne) {
  const ok = spravne === true;
  switch (volba) {
    case 'sam': return { barva: ok ? 'zelena' : 'oranzova', poznamka: null };
    case 's_otazkou': return ok
      ? { barva: 'zelena', poznamka: 'priste-bez-otazky' }
      : { barva: 'oranzova', poznamka: null };
    case 'chyba_pocty': return { barva: 'oranzova', poznamka: null };
    case 'nevedel': return { barva: ok ? 'oranzova' : 'cervena', poznamka: null };
    default: throw new Error(`Neznámá volba rodiče: ${volba}`);
  }
}

/**
 * Správnost úlohy pro semafor: POSLEDNÍ odevzdaná odpověď kroku `final` — od dítěte i od rodiče
 * (režim papír), podle času uložení. Řazení: created_at → id → pokus; řádky bez created_at/id
 * (ještě ve frontě ukládání, viz neulozeneOdpovedi) jsou nejnovější.
 * Pozn.: `pokus` se počítá zvlášť pro dítě a rodiče, proto nestačí řadit jen podle něj.
 * @param {Array<{krok_id:string, pokus:number, spravne:boolean|null, created_at?:string, id?:number}>} odpovediUlohy
 * @returns {boolean|null} null = neodevzdáno nebo nevyhodnotitelné
 */
export function spravnostUlohy(odpovediUlohy) {
  const finalni = (odpovediUlohy || []).filter((o) => o.krok_id === 'final');
  if (!finalni.length) return null;
  const cas = (o) => { const t = Date.parse(o.created_at); return Number.isFinite(t) ? t : Infinity; };
  const id = (o) => (Number.isFinite(Number(o.id)) && o.id !== null && o.id !== undefined ? Number(o.id) : Infinity);
  const rozdil = (x, y) => (x === y ? 0 : x < y ? -1 : 1); // bez NaN u Infinity − Infinity
  finalni.sort((a, b) => rozdil(cas(a), cas(b)) || rozdil(id(a), id(b)) || rozdil(a.pokus, b.pokus));
  return finalni[finalni.length - 1].spravne ?? null;
}
