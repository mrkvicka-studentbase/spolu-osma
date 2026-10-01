// =====================================================================
// fake-supabase.js — JEN PRO VÝVOJ (screenshoty.mjs --bez-site / --f2). Nenasazuje se (není ve web/).
// Náhrada createClient() ze supabase-js: databáze v localStorage prohlížeče (`spolu.fake-db`), žádná síť.
// Statický server screenshoty.mjs v souboru web/js/supabase.js přepíše import supabase-js z CDN na tento
// modul, takže běží skutečné helpery supabase.js (zacitSezeni, ulozOdpoved, stavSezeni, dokoncitSezeni…)
// nad lokálními tabulkami: rodiny, deti, sezeni, odpovedi, semafory, lekce (+ rpc katalog_lekci, je_admin).
// Katalog lekcí nastaví nástroj do localStorage `spolu.fake-katalog` (metadata bez obsahu, jako RPC).
// Dva předměty (supabase/migrations/0007_predmet.sql): řádek dítěte smí mít `predmety` a položka katalogu `predmet` —
// tabulky jsou jen JSON, takže bez nich se chová jako DB před migrací, s nimi jako po ní (nastroje/qa-cestina.mjs).
// =====================================================================

const KLIC_DB = 'spolu.fake-db';
const KLIC_KATALOG = 'spolu.fake-katalog';
const UZIVATEL = { id: '00000000-0000-4000-8000-0000000000a1', email: 'rodina@example.test' };

function vychoziDb() {
  return {
    rodiny: [{ id: UZIVATEL.id, jmeno_rodice: 'Jana Testová', email: UZIVATEL.email, telefon: null, stav: 'aktivni', zdroj: null,
      dotaznik_vyplnen: true, odemknuto_at: null, created_at: '2026-09-20T10:00:00.000Z' }],
    deti: [{ id: '00000000-0000-4000-8000-0000000000d1', rodina_id: UZIVATEL.id, krestni_jmeno: 'Adam', typ_skoly: 'gymnazium',
      znamka_8: 2, varianta: 'z9', poradi: 1 }],
    sezeni: [], odpovedi: [], semafory: [], lekce: [], dotazniky: [],
    dalsiId: 1,
  };
}
function nactiDb() {
  let db = null;
  try { db = JSON.parse(localStorage.getItem(KLIC_DB) || 'null'); } catch { db = null; }
  if (!db) { db = vychoziDb(); ulozDb(db); } // první čtení založí rodinu a dítě (nástroj pak může DB upravovat)
  return db;
}
function ulozDb(db) { localStorage.setItem(KLIC_DB, JSON.stringify(db)); }
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `f-${Date.now()}-${Math.random().toString(16).slice(2)}`);
const kopie = (x) => JSON.parse(JSON.stringify(x));

const VYCHOZI = {
  sezeni: () => ({ id: uuid(), rezim: 'app', zacatek: new Date().toISOString(), konec: null, stav: 'probiha', souhrn: null }),
  odpovedi: (db) => ({ id: db.dalsiId++, created_at: new Date().toISOString(), cas_s: null, typ_chyby: null }),
  semafory: (db) => ({ id: db.dalsiId++, created_at: new Date().toISOString() }),
  deti: () => ({ id: uuid() }),
  dotazniky: (db) => ({ id: db.dalsiId++ }),
};

function katalog() {
  try { return JSON.parse(localStorage.getItem(KLIC_KATALOG) || '[]'); } catch { return []; }
}

/** Sloupce select('a, b, lekce(kapitola, tema)') → {sloupce, vazby}. */
function rozeberSelect(s) {
  const vazby = [...String(s || '*').matchAll(/(\w+)\s*\(([^)]*)\)/g)].map((m) => ({ tabulka: m[1], sloupce: m[2].split(',').map((x) => x.trim()) }));
  const bez = String(s || '*').replace(/\w+\s*\([^)]*\)/g, '');
  const sloupce = bez.split(',').map((x) => x.trim()).filter(Boolean);
  return { sloupce: sloupce.includes('*') || !sloupce.length ? null : sloupce, vazby };
}

class Dotaz {
  constructor(tabulka) {
    this.tabulka = tabulka; this.akce = 'select'; this.filtry = []; this.razeni = []; this.limitN = null;
    this.jeden = null; this.select_ = '*'; this.data = null; this.volby = {}; this.vratit = false;
  }
  select(s = '*') { this.select_ = s; if (this.akce !== 'select') this.vratit = true; return this; }
  insert(radky) { this.akce = 'insert'; this.data = radky; return this; }
  upsert(radky, volby = {}) { this.akce = 'upsert'; this.data = radky; this.volby = volby; return this; }
  update(hodnoty) { this.akce = 'update'; this.data = hodnoty; return this; }
  delete() { this.akce = 'delete'; return this; }
  eq(k, v) { this.filtry.push((r) => r[k] === v); return this; }
  neq(k, v) { this.filtry.push((r) => r[k] !== v); return this; }
  gt(k, v) { this.filtry.push((r) => r[k] > v); return this; }
  gte(k, v) { this.filtry.push((r) => r[k] >= v); return this; }
  lt(k, v) { this.filtry.push((r) => r[k] < v); return this; }
  lte(k, v) { this.filtry.push((r) => r[k] <= v); return this; }
  in(k, v) { this.filtry.push((r) => v.includes(r[k])); return this; }
  is(k, v) { this.filtry.push((r) => (r[k] ?? null) === v); return this; }
  not(k, op, v) { this.filtry.push((r) => (op === 'is' ? (r[k] ?? null) !== v : r[k] !== v)); return this; }
  order(k, { ascending = true } = {}) { this.razeni.push([k, ascending]); return this; }
  limit(n) { this.limitN = n; return this; }
  single() { this.jeden = 'single'; return this; }
  maybeSingle() { this.jeden = 'maybe'; return this; }
  then(ok, chyba) { return Promise.resolve().then(() => this.provest()).then(ok, chyba); }

  provest() {
    const db = nactiDb();
    if (!db[this.tabulka]) db[this.tabulka] = [];
    const t = db[this.tabulka];
    const vyhovuje = (r) => this.filtry.every((f) => f(r));
    let vysledek = [];
    if (this.akce === 'select') {
      vysledek = t.filter(vyhovuje);
    } else if (this.akce === 'insert' || this.akce === 'upsert') {
      const radky = Array.isArray(this.data) ? this.data : [this.data];
      const klic = String(this.volby.onConflict || '').split(',').map((x) => x.trim()).filter(Boolean);
      for (const r of radky) {
        const existuje = klic.length ? t.find((x) => klic.every((k) => x[k] === r[k])) : null;
        if (existuje) {
          if (!this.volby.ignoreDuplicates) Object.assign(existuje, r);
          vysledek.push(existuje);
          continue;
        }
        const novy = { ...(VYCHOZI[this.tabulka]?.(db) || {}), ...kopie(r) };
        t.push(novy);
        vysledek.push(novy);
      }
      ulozDb(db);
    } else if (this.akce === 'update') {
      vysledek = t.filter(vyhovuje);
      for (const r of vysledek) Object.assign(r, kopie(this.data));
      ulozDb(db);
    } else if (this.akce === 'delete') {
      vysledek = t.filter(vyhovuje);
      db[this.tabulka] = t.filter((r) => !vyhovuje(r));
      ulozDb(db);
    }
    for (const [k, vzestupne] of [...this.razeni].reverse()) {
      vysledek = [...vysledek].sort((a, b) => {
        const x = a[k] ?? ''; const y = b[k] ?? '';
        return (x < y ? -1 : x > y ? 1 : 0) * (vzestupne ? 1 : -1);
      });
    }
    if (this.limitN !== null) vysledek = vysledek.slice(0, this.limitN);
    const { sloupce, vazby } = rozeberSelect(this.select_);
    vysledek = vysledek.map((r) => {
      const o = sloupce ? Object.fromEntries(sloupce.map((k) => [k, r[k] ?? null])) : kopie(r);
      for (const v of vazby) {
        if (v.tabulka === 'lekce') o.lekce = katalog().find((l) => l.id === r.lekce_id) || null;
        else o[v.tabulka] = (nactiDb()[v.tabulka] || []).filter((x) => x.sezeni_id === r.id);
      }
      return o;
    });
    if (this.akce !== 'select' && !this.vratit && !this.jeden) return { data: null, error: null, status: 201 };
    if (this.jeden) {
      if (this.jeden === 'single' && vysledek.length !== 1) return { data: null, error: { message: 'Fake: očekáván 1 řádek', code: 'PGRST116' }, status: 406 };
      return { data: vysledek[0] ?? null, error: null, status: 200 };
    }
    return { data: vysledek, error: null, status: 200 };
  }
}

export function createClient() {
  const posluchaci = new Set();
  const session = () => (localStorage.getItem('spolu.fake-odhlaseno') ? null : { user: UZIVATEL, access_token: 'fake' });
  return {
    from: (tabulka) => new Dotaz(tabulka),
    rpc: async (nazev) => {
      if (nazev === 'katalog_lekci') return { data: katalog(), error: null, status: 200 };
      if (nazev === 'je_admin') return { data: false, error: null, status: 200 };
      return { data: null, error: { message: `Fake: rpc ${nazev} není` }, status: 404 };
    },
    auth: {
      getSession: async () => ({ data: { session: session() }, error: null }),
      getUser: async () => ({ data: { user: session()?.user ?? null }, error: null }),
      signInWithPassword: async () => { localStorage.removeItem('spolu.fake-odhlaseno'); return { data: { user: UZIVATEL, session: session() }, error: null }; },
      signOut: async () => { localStorage.setItem('spolu.fake-odhlaseno', '1'); return { error: null }; },
      signUp: async () => ({ data: { user: UZIVATEL, session: session() }, error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async () => ({ data: { user: UZIVATEL }, error: null }),
      onAuthStateChange: (fn) => { posluchaci.add(fn); return { data: { subscription: { unsubscribe: () => posluchaci.delete(fn) } } }; },
    },
  };
}
