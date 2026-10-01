// =====================================================================
// vyhodnoceni-cj.js — vyhodnocení nových vstupů češtiny (ZADANI-CESTINA §6.1, cestina/Obsah/FORMAT-CJ.md).
// Čisté funkce bez DOM; importuje je vyhodnoceni.js (vyhodnotKrok) a testy v Node.
//
// Vnitřní výsledek kroku: { spravne: bool, chyby: [{ kod: string|null, kde?: any }], detail: {...} }
// kod null = obecná chyba (bez kódu) — rodič pak vidí, co chybí / co je navíc.
// Navenek (vyhodnotKrokCj) kontrakt Matematiky: { spravne, typ_chyby, poznamka, neplatne } + chyby, detail.
// =====================================================================

// ---------- text ----------

const RE_SLOVO = /[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*/gu;

// Rozdělí text na slova (interpunkce se ke slovu nepočítá). Index od 0.
export function tokenizuj(text) {
  const slova = [];
  for (const m of String(text).matchAll(RE_SLOVO)) {
    slova.push({ i: slova.length, slovo: m[0], od: m.index, do: m.index + m[0].length });
  }
  return slova;
}

// Rozdělí text doplňovačky na části: { text } a { mezera: i }. Mezera = znak „_“.
export function rozdelDoplnovacku(text) {
  const casti = [];
  let mezera = 0;
  for (const kus of String(text).split(/(_)/)) {
    if (kus === '_') casti.push({ mezera: mezera++ });
    else if (kus) casti.push({ text: kus });
  }
  return casti;
}

export function pocetMezer(text) {
  return (String(text).match(/_/g) || []).length;
}

// Normalizace krátké odpovědi: diakritika se NIKDY neignoruje,
// ořez mezer a interpunkce na koncích, vnitřní mezery sloučit, velikost jen na přání.
export function normalizuj(text, { ignorovatVelikost = false } = {}) {
  let t = String(text ?? '').normalize('NFC');
  t = t.replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, '').replace(/\s+/g, ' ');
  return ignorovatVelikost ? t.toLocaleLowerCase('cs') : t;
}

// ---------- pomocné ----------

const vysledek = (spravne, chyby = [], detail = {}) => ({ spravne, chyby: spravne ? [] : chyby, detail });

function unikatni(chyby) {
  const videno = new Set();
  return chyby.filter((ch) => {
    const klic = `${ch.kod}|${JSON.stringify(ch.kde ?? null)}`;
    if (videno.has(klic)) return false;
    videno.add(klic);
    return true;
  });
}

const mnozinaRovna = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

// ---------- množina (dlazdice_vice, klik_ve_textu) ----------
// Známá chyba se páruje třemi způsoby (lze kombinovat v jednom záznamu):
//   hodnota: přesná množina odpovědi (šablona §3.1),
//   navic:   chyba nastane, když odpověď obsahuje některý z prvků (co dítě přidalo),
//   chybi:   chyba nastane, když v odpovědi některý z prvků chybí (co dítě vynechalo).
// volitelne (ve vstupu): prvky, které mohou i nemusí být vybrané (např. „se“ u zvratného slovesa).

function vyhodnotMnozinu(krok, odpoved) {
  const volitelne = new Set(krok.vstup.volitelne || []);
  const bezVolitelnych = (arr) => new Set(arr.filter((x) => !volitelne.has(x)));
  const ma = bezVolitelnych(odpoved || []);
  const ma_byt = bezVolitelnych(krok.spravne);
  const chybi = [...ma_byt].filter((x) => !ma.has(x));
  const navic = [...ma].filter((x) => !ma_byt.has(x));
  const detail = { chybi, navic };
  if (!chybi.length && !navic.length) return vysledek(true, [], detail);

  const chyby = [];
  for (const z of krok.zname_chyby || []) {
    if (z.hodnota && mnozinaRovna(bezVolitelnych(z.hodnota), ma)) chyby.push({ kod: z.typ_chyby });
    for (const x of z.navic || []) if (navic.includes(x)) chyby.push({ kod: z.typ_chyby, kde: x });
    for (const x of z.chybi || []) if (chybi.includes(x)) chyby.push({ kod: z.typ_chyby, kde: x });
  }
  // Co není pokryté žádnou známou chybou, je obecná chyba (kde = prvek).
  const pokryte = new Set(chyby.filter((c) => c.kde !== undefined).map((c) => c.kde));
  const presnaShoda = chyby.some((c) => c.kde === undefined);
  if (!presnaShoda) {
    for (const x of [...chybi, ...navic]) if (!pokryte.has(x)) chyby.push({ kod: null, kde: x });
  }
  return vysledek(false, unikatni(chyby), detail);
}

// ---------- doplnit_pismeno ----------

function vyhodnotDoplnovacku(krok, odpoved) {
  const odp = odpoved || [];
  const mezery = krok.spravne.map((sp, i) => ({ i, odpoved: odp[i] ?? null, spravne: sp, ok: odp[i] === sp, kody: [] }));
  for (const z of krok.zname_chyby || []) {
    const pozice = z.hodnota.map((h, i) => (h === null ? null : i)).filter((i) => i !== null);
    if (pozice.length && pozice.every((i) => odp[i] === z.hodnota[i])) {
      for (const i of pozice) if (!mezery[i].ok) mezery[i].kody.push(z.typ_chyby);
    }
  }
  const chyby = [];
  for (const m of mezery) {
    if (m.ok) continue;
    if (m.kody.length) m.kody.forEach((kod) => chyby.push({ kod, kde: m.i }));
    else chyby.push({ kod: null, kde: m.i });
  }
  return vysledek(chyby.length === 0, unikatni(chyby), { mezery });
}

// ---------- označ role (po slovech, případně po kategoriích) ----------
// spravne: { klic: hodnota } nebo { klic: { kategorie: hodnota } }.
// Známá chyba se páruje po klíčích — každá shoda (klíč, kategorie) nahlásí kód u klíče.

function vyhodnotPoKlicich(krok, odpoved) {
  const odp = odpoved || {};
  const polozky = [];
  const hodnotaV = (obj, klic, kat) => (kat === null ? obj?.[klic] : obj?.[klic]?.[kat]);

  for (const [klic, sp] of Object.entries(krok.spravne)) {
    const kategorie = sp !== null && typeof sp === 'object' ? Object.keys(sp) : [null];
    for (const kat of kategorie) {
      const ocekavano = kat === null ? sp : sp[kat];
      const dal = hodnotaV(odp, klic, kat) ?? null;
      polozky.push({ klic, kategorie: kat, odpoved: dal, spravne: ocekavano, ok: dal === ocekavano, kody: [] });
    }
  }
  for (const z of krok.zname_chyby || []) {
    for (const p of polozky) {
      if (p.ok || !(p.klic in z.hodnota)) continue;
      const chybna = p.kategorie === null ? z.hodnota[p.klic] : z.hodnota[p.klic]?.[p.kategorie];
      if (chybna !== undefined && chybna === p.odpoved) p.kody.push(z.typ_chyby);
    }
  }
  const chyby = [];
  for (const p of polozky) {
    if (p.ok) continue;
    const kde = p.kategorie === null ? p.klic : `${p.klic}.${p.kategorie}`;
    if (p.kody.length) p.kody.forEach((kod) => chyby.push({ kod, kde }));
    else chyby.push({ kod: null, kde });
  }
  return vysledek(chyby.length === 0, unikatni(chyby), { polozky });
}

// ---------- seřadit (např. pádové otázky 1–7; jiný vstup než `poradi` Matematiky) ----------

function vyhodnotSeradit(krok, odpoved) {
  const odp = odpoved || [];
  const ok = odp.length === krok.spravne.length && odp.every((x, i) => x === krok.spravne[i]);
  if (ok) return vysledek(true);
  const zname = (krok.zname_chyby || []).filter(
    (z) => z.hodnota.length === odp.length && z.hodnota.every((x, i) => x === odp[i]),
  );
  return vysledek(false, zname.length ? zname.map((z) => ({ kod: z.typ_chyby })) : [{ kod: null }], { odpoved: odp });
}

// ---------- kratky_text ----------

function vyhodnotKratkyText(krok, odpoved) {
  const opt = { ignorovatVelikost: !!krok.ignorovat_velikost };
  const n = normalizuj(odpoved, opt);
  const prijate = [krok.spravne, ...(krok.varianty || [])].map((x) => normalizuj(x, opt));
  if (n && prijate.includes(n)) return vysledek(true, [], { odpoved: n });
  const zname = (krok.zname_chyby || []).filter((z) => normalizuj(z.hodnota, opt) === n);
  return vysledek(false, zname.length ? zname.map((z) => ({ kod: z.typ_chyby })) : [{ kod: null }], {
    odpoved: n,
    ocekavano: krok.spravne,
  });
}

// ---------- diktát ----------
// Porovnání slovo po slovu (nejdelší společná podposloupnost). Dvojice „chybí + navíc“ vedle sebe = jiné slovo.

function slovaDiktatu(text, { velikost }) {
  return tokenizuj(text).map((t) => ({ puvodni: t.slovo, klic: velikost ? t.slovo : t.slovo.toLocaleLowerCase('cs') }));
}

export function porovnejSlova(ocekavane, napsane) {
  const a = ocekavane, b = napsane;
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      L[i][j] = a[i].klic === b[j].klic ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i].klic === b[j].klic) { ops.push({ op: 'shoda', i, j }); i++; j++; }
    else if (j < b.length && (i === a.length || L[i][j + 1] >= L[i + 1][j])) { ops.push({ op: 'navic', j }); j++; }
    else { ops.push({ op: 'chybi', i }); i++; }
  }
  // sloučit sousední chybi+navic (v libovolném pořadí) na „jine“
  const vysl = [];
  for (let k = 0; k < ops.length; k++) {
    const o = ops[k], d = ops[k + 1];
    if (d && ((o.op === 'chybi' && d.op === 'navic') || (o.op === 'navic' && d.op === 'chybi'))) {
      const ch = o.op === 'chybi' ? o : d, nv = o.op === 'navic' ? o : d;
      vysl.push({ op: 'jine', i: ch.i, j: nv.j });
      k++;
    } else vysl.push(o);
  }
  return vysl;
}

function vyhodnotDiktat(krok, odpoved) {
  const velikost = !!krok.vstup.hodnotit_velikost;
  const ocek = krok.chyby_ocekavane || [];
  const vety = krok.vstup.vety.map((veta, v) => {
    const a = slovaDiktatu(veta.text, { velikost });
    const b = slovaDiktatu((odpoved || [])[v] ?? '', { velikost });
    const slova = porovnejSlova(a, b).map((o) => {
      const radek = { stav: o.op, ocekavano: o.i !== undefined ? a[o.i].puvodni : null, napsano: o.j !== undefined ? b[o.j].puvodni : null, slovo: o.i ?? null, kod: null };
      if (o.op === 'jine') {
        const jev = ocek.find((c) => c.veta === v && c.slovo === o.i);
        radek.kod = jev ? `diktat-pravopis-${jev.typ_chyby}` : 'diktat-jine-slovo';
        if (jev) radek.jev = jev.typ_chyby;
      } else if (o.op === 'chybi') radek.kod = 'diktat-vynechane-slovo';
      else if (o.op === 'navic') radek.kod = 'diktat-slovo-navic';
      return radek;
    });
    return { veta: v, slova };
  });
  const chyby = vety.flatMap((v) => v.slova.filter((s) => s.kod).map((s) => ({ kod: s.kod, kde: { veta: v.veta, slovo: s.slovo, napsano: s.napsano } })));
  return vysledek(chyby.length === 0, chyby, { vety });
}

// ---------- rozcestník ----------

const VYHODNOCENI = {
  dlazdice_vice: vyhodnotMnozinu,
  klik_ve_textu: vyhodnotMnozinu,
  doplnit_pismeno: vyhodnotDoplnovacku,
  oznac_role: vyhodnotPoKlicich,
  seradit: vyhodnotSeradit,
  kratky_text: vyhodnotKratkyText,
  diktat: vyhodnotDiktat,
};

/** Nové typy vstupů češtiny (poslech řeší vyhodnoceni.js přes vnořený vstup). */
export const TYPY_VSTUPU_CJ = Object.freeze([...Object.keys(VYHODNOCENI), 'poslech']);

/** Nečitelná / neúplná odpověď (UI ji nepočítá jako pokus — kontrakt `neplatne` z vyhodnoceni.js). */
export function jeNeplatna(vstup, odpoved) {
  switch (vstup.typ) {
    case 'dlazdice_vice':
      return !Array.isArray(odpoved) || !odpoved.length || odpoved.some((x) => !vstup.moznosti.includes(x));
    case 'klik_ve_textu': {
      const n = tokenizuj(vstup.text).length - (vstup.cil === 'mezery' ? 1 : 0);
      return !Array.isArray(odpoved) || odpoved.length < Math.max(1, vstup.min ?? 1) || odpoved.length > vstup.max
        || odpoved.some((i) => !Number.isInteger(i) || i < 0 || i >= n) || new Set(odpoved).size !== odpoved.length;
    }
    case 'doplnit_pismeno':
      return !Array.isArray(odpoved) || odpoved.length !== vstup.mezery.length
        || odpoved.some((x, i) => !vstup.mezery[i].moznosti.includes(x));
    case 'oznac_role': {
      if (!odpoved || typeof odpoved !== 'object' || Array.isArray(odpoved)) return true;
      const kategorie = Array.isArray(vstup.role) ? null : Object.keys(vstup.role);
      return vstup.slova.some((i) => {
        const x = odpoved[i];
        if (kategorie) return !x || kategorie.some((k) => !(vstup.role[k] || []).includes(x[k]));
        return !vstup.role.includes(x);
      });
    }
    case 'seradit':
      return !Array.isArray(odpoved) || odpoved.length !== vstup.polozky.length
        || new Set(odpoved).size !== odpoved.length || odpoved.some((x) => !vstup.polozky.includes(x));
    case 'kratky_text':
      return typeof odpoved !== 'string' || normalizuj(odpoved) === '';
    case 'diktat':
      return !Array.isArray(odpoved) || !odpoved.some((t) => typeof t === 'string' && t.trim());
    default:
      return true;
  }
}

/**
 * Vyhodnotí krok s novým vstupem češtiny v kontraktu vyhodnoceni.js.
 * Papírový režim (rodič porovná papír dítěte se správnou odpovědí): hodnota { rodic: 'sedi' | 'nesedi' }.
 * @returns {{spravne: boolean, typ_chyby: string|null, poznamka: null, neplatne: boolean,
 *   chyby: Array<{kod: string|null, kde?: any}>, detail: object}}
 *   typ_chyby = první známá chyba (do DB jde jeden kód); všechny chyby jsou v `chyby`.
 */
export function vyhodnotKrokCj(krok, hodnota) {
  const obal = (spravne, chyby = [], detail = {}, neplatne = false) => ({
    spravne, typ_chyby: chyby.find((c) => c.kod)?.kod ?? null, poznamka: null, neplatne, chyby, detail,
  });
  if (hodnota && typeof hodnota === 'object' && !Array.isArray(hodnota) && 'rodic' in hodnota) {
    if (hodnota.rodic === 'sedi') return obal(true);
    if (hodnota.rodic === 'nesedi') return obal(false, [{ kod: null }]);
    return obal(false, [], {}, true);
  }
  const fn = VYHODNOCENI[krok?.vstup?.typ];
  if (!fn) throw new Error(`Neznámý typ vstupu češtiny: ${krok?.vstup?.typ}`);
  if (jeNeplatna(krok.vstup, hodnota)) return obal(false, [], {}, true);
  const v = fn(krok, hodnota);
  return obal(v.spravne, v.chyby, v.detail);
}

/** Odpověď dítěte bez chyby (QA, náhled, testy). */
export function vzorovaOdpoved(krok) {
  if (krok.vstup.typ === 'diktat') return krok.vstup.vety.map((v) => v.text);
  if (krok.vstup.typ === 'poslech') return vzorovaOdpoved({ ...krok, vstup: krok.vstup.vnoreny_vstup });
  if (krok.vstup.typ === 'dlazdice') return krok.vstup.moznosti.find((m) => m.spravne)?.id ?? null;
  return krok.spravne;
}
