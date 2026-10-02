// =====================================================================
// supabase.js — jediný Supabase klient + helpery pro všechny stránky (R3)
//
// Pravidla pro volající:
// - Každý helper je async a vrací data, nebo vyhodí ChybaSpolu s českou hláškou
//   (e.message lze rovnou ukázat uživateli; e.kod = strojový kód, e.puvodni = původní chyba).
// - Žádná real-time synchronizace. Rodič se o stavu žáka dozví přes stavSezeni() (polling).
// - Názvy polí z DB jsou snake_case (jak v kostra/02); parametry helperů camelCase.
// =====================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { predmetZId } from './predmet.js';

/** Sdílený klient (publishable/anon key; bezpečnost řeší RLS). Pro výjimečné dotazy mimo helpery. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // odkaz z potvrzovacího e-mailu přihlásí rovnou
    storageKey: 'spolu.auth',
  },
});

// ---------------------------------------------------------------------
// Typy (JSDoc) — pro ostatní agenty
// ---------------------------------------------------------------------

/**
 * @typedef {'aktivni'|'uzavreny'} StavRodiny  Spolu 8 v1 bez platby (pilot zrušen)
 * @typedef {'gymnazium'|'ss_maturita'} TypSkoly
 * @typedef {'app'|'papir'} Rezim
 * @typedef {'sam'|'s_otazkou'|'chyba_pocty'|'nevedel'} VolbaRodice
 * @typedef {'zelena'|'oranzova'|'cervena'} Barva
 * @typedef {'dite'|'rodic'} Zadal
 *
 * @typedef {Object} Rodina  řádek tabulky rodiny
 * @property {string} id
 * @property {string} jmeno_rodice
 * @property {string} email
 * @property {string|null} telefon
 * @property {StavRodiny} stav
 * @property {string|null} zdroj
 * @property {string|null} odemknuto_at
 * @property {string} created_at
 *
 * @typedef {Object} Dite  řádek tabulky deti
 * @property {string} id
 * @property {string} rodina_id
 * @property {string} krestni_jmeno
 * @property {TypSkoly} typ_skoly
 * @property {number|null} znamka_8
 * @property {string} varianta
 * @property {1|2} poradi
 * @property {Array<'matematika'|'cestina'>} [predmety]  jen po migraci 0007 (cestina/db); bez něj = jen matematika (predmet.js)
 *
 * @typedef {Object} Sezeni  řádek tabulky sezeni
 * @property {string} id
 * @property {string} dite_id
 * @property {string} lekce_id
 * @property {Rezim} rezim
 * @property {string} zacatek
 * @property {string|null} konec
 * @property {'probiha'|'dokonceno'|'preruseno'} stav
 * @property {SouhrnSezeni|null} souhrn
 *
 * @typedef {Object} SouhrnSezeni  co ukládá rodič při dokončení (dokoncitSezeni)
 * @property {Object<string, Barva>} barvy       uloha_id → barva (4 úlohy)
 * @property {Barva} hlavniBarva                 barva úlohy typu „semafor"
 * @property {string} doporuceni                 text „na zítra"
 *
 * @typedef {Object} PolozkaKatalogu  lekce v přehledu (bez obsahu)
 * @property {string} id
 * @property {'matematika'|'cestina'} [predmet]  jen po migraci 0007; bez něj = matematika (predmetLekce v predmet.js)
 * @property {'pilot'|'faze1'|'faze2'|'zaklady'} faze
 * @property {number} tyden
 * @property {number} poradi
 * @property {string} tema
 * @property {string} kapitola
 * @property {string} varianta
 * @property {number|null} cas_min
 * @property {string} otevrit_od          ISO datum
 * @property {boolean} verejna
 * @property {number} verze
 * @property {null|'platba'|'datum'|'uzavreno'|'predmet'} zamceno   null = přístupná
 */

// ---------------------------------------------------------------------
// Chyby
// ---------------------------------------------------------------------

/** Chyba s českou hláškou pro uživatele. */
export class ChybaSpolu extends Error {
  /**
   * @param {string} zprava  česká hláška pro uživatele
   * @param {{kod?: string, puvodni?: any}} [volby]
   */
  constructor(zprava, { kod = 'neznama', puvodni = null } = {}) {
    super(zprava);
    this.name = 'ChybaSpolu';
    this.kod = kod;
    this.puvodni = puvodni;
  }
}

const HLASKA_SIT = 'Nepodařilo se spojit se serverem. Zkontrolujte připojení a zkuste to znovu.';

/** Je chyba dočasná (síť, výpadek, přetížení) a má smysl ji opakovat? */
function jeDocasna(error, status) {
  if (status === 0 || status === 408 || status === 429 || (status >= 500 && status < 600)) return true;
  const zprava = String(error?.message || error || '');
  return /failed to fetch|networkerror|load failed|network request failed|fetch failed|timeout/i.test(zprava);
}

/**
 * Převede chybu ze supabase-js na ChybaSpolu s českou hláškou.
 * @param {any} error
 * @param {number} [status]
 * @param {string} [vychozi]  hláška, když chybu neznáme
 * @returns {ChybaSpolu}
 */
function prelozChybu(error, status, vychozi = 'Něco se nepovedlo. Zkuste to prosím znovu.') {
  if (error instanceof ChybaSpolu) return error;
  const kod = error?.code || error?.error_code || '';
  const zprava = String(error?.message || '');

  if (jeDocasna(error, status)) return new ChybaSpolu(HLASKA_SIT, { kod: 'sit', puvodni: error });

  // Auth
  if (kod === 'invalid_credentials' || /invalid login credentials/i.test(zprava)) {
    return new ChybaSpolu('Nesprávný e-mail nebo heslo.', { kod: 'spatne_prihlaseni', puvodni: error });
  }
  if (kod === 'email_not_confirmed' || /email not confirmed/i.test(zprava)) {
    return new ChybaSpolu('E-mail ještě není potvrzený. Klikněte prosím na odkaz, který jsme vám poslali.', { kod: 'nepotvrzeny_email', puvodni: error });
  }
  if (kod === 'user_already_exists' || kod === 'email_exists' || /already registered/i.test(zprava)) {
    return new ChybaSpolu('Tento e-mail už je zaregistrovaný. Přihlaste se.', { kod: 'email_existuje', puvodni: error });
  }
  if (kod === 'weak_password' || /password should be/i.test(zprava)) {
    return new ChybaSpolu('Heslo je příliš slabé. Použijte aspoň 8 znaků.', { kod: 'slabe_heslo', puvodni: error });
  }
  if (kod === 'email_address_invalid') {
    return new ChybaSpolu('Tuto e-mailovou adresu nelze použít. Zkontrolujte ji.', { kod: 'spatny_email', puvodni: error });
  }
  if (kod === 'email_address_not_authorized') {
    return new ChybaSpolu('Na tuto adresu teď neumíme poslat e-mail. Zkontrolujte ji, případně použijte jinou.', { kod: 'spatny_email', puvodni: error });
  }
  if (kod === 'same_password') {
    return new ChybaSpolu('Nové heslo musí být jiné než to dosavadní.', { kod: 'stejne_heslo', puvodni: error });
  }
  if (kod === 'session_not_found' || error?.name === 'AuthSessionMissingError') {
    return new ChybaSpolu('Odkaz pro nové heslo vypršel. Požádejte prosím o nový.', { kod: 'neprihlasen', puvodni: error });
  }
  if (kod === 'validation_failed' || /invalid.*email|unable to validate email/i.test(zprava)) {
    return new ChybaSpolu('Zkontrolujte prosím e-mailovou adresu.', { kod: 'spatny_email', puvodni: error });
  }
  if (/rate limit/i.test(zprava) || kod === 'over_email_send_rate_limit' || kod === 'over_request_rate_limit') {
    return new ChybaSpolu('Příliš mnoho pokusů. Zkuste to prosím za pár minut.', { kod: 'limit', puvodni: error });
  }
  if (/jwt expired|refresh token/i.test(zprava) || status === 401) {
    return new ChybaSpolu('Přihlášení vypršelo. Přihlaste se prosím znovu.', { kod: 'neprihlasen', puvodni: error });
  }

  // Postgres / PostgREST
  if (error?.hint === 'max_2_deti' || /nejvýše 2 profily/.test(zprava)) {
    return new ChybaSpolu('Můžete mít nejvýše 2 profily dětí.', { kod: 'max_2_deti', puvodni: error });
  }
  if (kod === 'P0001' && zprava) return new ChybaSpolu(zprava, { kod: 'db', puvodni: error }); // naše české hlášky z triggerů
  if (kod === '42501' || /row-level security|permission denied/i.test(zprava)) {
    return new ChybaSpolu('Na tuto akci nemáte oprávnění.', { kod: 'opravneni', puvodni: error });
  }
  if (kod === '23505') return new ChybaSpolu('Tento záznam už existuje.', { kod: 'duplicita', puvodni: error });
  if (kod === '23514' || kod === '23502') return new ChybaSpolu('Některý údaj chybí nebo má špatný tvar.', { kod: 'neplatna_data', puvodni: error });

  return new ChybaSpolu(vychozi, { kod: kod || 'neznama', puvodni: error });
}

/** Vyhodí přeloženou chybu, pokud ji odpověď supabase-js obsahuje; jinak vrátí data. */
function vysledek({ data, error, status }, vychozi) {
  if (error) throw prelozChybu(error, status, vychozi);
  return data;
}

/** Zabalí volání, které může vyhodit (např. síť v auth), do ChybaSpolu. */
async function bezpecne(fn, vychozi) {
  try {
    return await fn();
  } catch (e) {
    throw prelozChybu(e, undefined, vychozi);
  }
}

/** Vrátí uid přihlášeného, nebo vyhodí „nepřihlášen". */
async function mojeUid() {
  const uzivatel = await aktualniUzivatel();
  if (!uzivatel) throw new ChybaSpolu('Nejste přihlášeni. Přihlaste se prosím.', { kod: 'neprihlasen' });
  return uzivatel.id;
}

// =====================================================================
// Účet
// =====================================================================

/**
 * Přihlášení e-mailem a heslem.
 * @param {string} email
 * @param {string} heslo
 * @returns {Promise<import('@supabase/supabase-js').User>} přihlášený uživatel
 * @throws {ChybaSpolu} kod: spatne_prihlaseni | nepotvrzeny_email | sit | ...
 */
export async function prihlasit(email, heslo) {
  const odp = await bezpecne(() => supabase.auth.signInWithPassword({ email: String(email).trim(), password: heslo }));
  return vysledek(odp, 'Přihlášení se nepovedlo.').user;
}

/**
 * Odhlášení (i na tomto zařízení smaže session).
 * @returns {Promise<void>}
 */
export async function odhlasit() {
  const { error } = await bezpecne(() => supabase.auth.signOut());
  if (error) throw prelozChybu(error, undefined, 'Odhlášení se nepovedlo.');
}

/**
 * Registrace rodiny + 1. dítěte (R6: dítě zakládá DB trigger z metadat, funguje i s potvrzením e-mailu).
 * Po potvrzení e-mailu odkaz vede na prehled.html (musí být v Supabase → Authentication →
 * URL Configuration → Redirect URLs).
 * @param {Object} udaje
 * @param {string} udaje.jmenoRodice
 * @param {string} udaje.email
 * @param {string} udaje.heslo
 * @param {string} [udaje.zdroj]            odkud přišli: 'fb' | 'ig' | 'web' | 'jine' | vlastní text
 * @param {Object} udaje.dite
 * @param {string} udaje.dite.jmeno         křestní jméno
 * @param {string[]} [udaje.dite.predmety]  'matematika' / 'cestina' (výchozí oba)
 * @returns {Promise<{uzivatel: object, potvrditEmail: boolean}>}
 *   potvrditEmail = true → ukažte „Poslali jsme vám e-mail, klikněte na odkaz" (session zatím není).
 * @throws {ChybaSpolu} kod: email_existuje | slabe_heslo | spatny_email | limit | sit
 */
export async function registrovat({ jmenoRodice, email, heslo, zdroj = null, dite }) {
  const presmerovani = new URL('prehled.html', window.location.href).href;
  const odp = await bezpecne(() => supabase.auth.signUp({
    email: String(email).trim(),
    password: heslo,
    options: {
      emailRedirectTo: presmerovani,
      data: {
        jmeno_rodice: String(jmenoRodice || '').trim(),
        zdroj: zdroj || null,
        dite_jmeno: String(dite?.jmeno || '').trim(),
        // Spolu 8: předměty dítěte (výchozí oba; DB trigger po_registraci je doplní, když chybí)
        ...(Array.isArray(dite?.predmety) ? { predmety: dite.predmety } : {}),
      },
    },
  }));
  const data = vysledek(odp, 'Registrace se nepovedla.');
  // S potvrzováním e-mailu vrací Supabase pro už existující e-mail „prázdného" uživatele bez identit.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new ChybaSpolu('Tento e-mail už je zaregistrovaný. Přihlaste se.', { kod: 'email_existuje' });
  }
  return { uzivatel: data.user, potvrditEmail: !data.session };
}

/**
 * Obnova zapomenutého hesla (R20): Supabase pošle e-mail s odkazem na nove-heslo.html.
 * Odkaz po kliknutí přihlásí dočasnou session z URL (detectSessionInUrl, implicit flow,
 * událost PASSWORD_RECOVERY) a stránka pak zavolá nastavitHeslo().
 * nove-heslo.html musí být v Supabase → Authentication → URL Configuration → Redirect URLs.
 * Pro neexistující e-mail Supabase chybu nevrací (neprozrazuje, kdo je registrovaný).
 * @param {string} email
 * @returns {Promise<void>}
 * @throws {ChybaSpolu} kod: spatny_email | limit | sit
 */
export async function obnovitHeslo(email) {
  const redirectTo = new URL('nove-heslo.html', window.location.href).href;
  const odp = await bezpecne(() => supabase.auth.resetPasswordForEmail(String(email).trim(), { redirectTo }));
  vysledek(odp, 'Odkaz pro nové heslo se nepodařilo poslat.');
}

/**
 * Nastaví nové heslo přihlášenému uživateli (typicky po odkazu z obnovitHeslo()).
 * @param {string} heslo  min. 8 znaků (hlídá i volající)
 * @returns {Promise<object>} uživatel
 * @throws {ChybaSpolu} kod: slabe_heslo | stejne_heslo | neprihlasen | sit
 */
export async function nastavitHeslo(heslo) {
  const odp = await bezpecne(() => supabase.auth.updateUser({ password: heslo }));
  return vysledek(odp, 'Nové heslo se nepodařilo uložit.').user;
}

/**
 * Aktuálně přihlášený uživatel (z lokální session, bez síťového dotazu), nebo null.
 * Vhodné pro „strážce" stránky: když null → přesměrovat na registrace.html.
 * @returns {Promise<object|null>}
 */
export async function aktualniUzivatel() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user ?? null;
}

/**
 * Registrace posluchače změn přihlášení (odhlášení v jiné záložce, obnovení tokenu).
 * @param {(udalost: string, uzivatel: object|null) => void} fn
 * @returns {() => void} funkce pro odhlášení posluchače
 */
export function priZmenePrihlaseni(fn) {
  const { data } = supabase.auth.onAuthStateChange((udalost, session) => fn(udalost, session?.user ?? null));
  return () => data.subscription.unsubscribe();
}

/**
 * Řádek rodiny přihlášeného uživatele. Stav 'uzavreny' → web má ukázat stránku s poděkováním.
 * @returns {Promise<Rodina|null>} null jen výjimečně (rodina ještě nevznikla)
 */
export async function mojeRodina() {
  const uid = await mojeUid();
  return vysledek(await supabase.from('rodiny').select('*').eq('id', uid).maybeSingle(), 'Nepodařilo se načíst údaje rodiny.');
}

/**
 * Úprava údajů rodiny, které smí měnit rodič (jméno, telefon). Stav mění jen admin.
 * @param {{jmenoRodice?: string, telefon?: string|null}} zmeny
 * @returns {Promise<Rodina>}
 */
export async function upravitRodinu({ jmenoRodice, telefon } = {}) {
  const uid = await mojeUid();
  const zmena = {};
  if (jmenoRodice !== undefined) zmena.jmeno_rodice = String(jmenoRodice).trim();
  if (telefon !== undefined) zmena.telefon = telefon ? String(telefon).trim() : null;
  return vysledek(await supabase.from('rodiny').update(zmena).eq('id', uid).select().single(), 'Údaje se nepodařilo uložit.');
}

/**
 * Děti přihlášené rodiny, seřazené podle poradi (1, 2).
 * Může vrátit [] (registrace bez dítěte / chybná data dítěte) → UI nabídne pridatDite().
 * @returns {Promise<Dite[]>}
 */
export async function mojeDeti() {
  const uid = await mojeUid();
  return vysledek(await supabase.from('deti').select('*').eq('rodina_id', uid).order('poradi'), 'Nepodařilo se načíst profily dětí.');
}

/**
 * Přidá dítě (max 2 na rodinu hlídá DB). poradi se doplní automaticky.
 * @param {{jmeno: string, typSkoly: TypSkoly, znamka8?: number|null, predmety?: string[]}} dite
 *   predmety posílej jen po migraci 0007 (sloupec deti.predmety); bez nich DB doplní výchozí {matematika}
 * @returns {Promise<Dite>}
 * @throws {ChybaSpolu} kod: max_2_deti | neplatna_data
 */
export async function pridatDite({ jmeno, typSkoly = null, znamka8 = null, predmety }) {
  const uid = await mojeUid();
  const radek = { rodina_id: uid, krestni_jmeno: String(jmeno || '').trim(), typ_skoly: typSkoly || null, znamka_8: znamka8 || null };
  if (predmety !== undefined) radek.predmety = predmety;
  return vysledek(await supabase.from('deti').insert(radek).select().single(), 'Profil dítěte se nepodařilo uložit.');
}

/**
 * Úprava profilu dítěte (překlep ve jménu apod.).
 * @param {string} diteId
 * @param {{jmeno?: string, typSkoly?: TypSkoly, znamka8?: number|null, predmety?: string[]}} zmeny
 *   predmety jen po migraci 0007 (sloupec deti.predmety)
 * @returns {Promise<Dite>}
 */
export async function upravitDite(diteId, { jmeno, typSkoly, znamka8, predmety } = {}) {
  const zmena = {};
  if (jmeno !== undefined) zmena.krestni_jmeno = String(jmeno).trim();
  if (typSkoly !== undefined) zmena.typ_skoly = typSkoly;
  if (znamka8 !== undefined) zmena.znamka_8 = znamka8 || null;
  if (predmety !== undefined) zmena.predmety = predmety;
  return vysledek(await supabase.from('deti').update(zmena).eq('id', diteId).select().single(), 'Profil dítěte se nepodařilo uložit.');
}

/**
 * Je přihlášený uživatel admin? (tabulka admini; bez přihlášení false)
 * @returns {Promise<boolean>}
 */
export async function jeAdmin() {
  if (!(await aktualniUzivatel())) return false;
  return Boolean(vysledek(await supabase.rpc('je_admin'), 'Nepodařilo se ověřit oprávnění.'));
}

// =====================================================================
// Lekce
// =====================================================================

/**
 * Katalog všech lekcí (metadata bez obsahu), včetně zamčených, seřazený fáze → týden → pořadí.
 * @returns {Promise<PolozkaKatalogu[]>}
 */
export async function katalogLekci() {
  return vysledek(await supabase.rpc('katalog_lekci'), 'Nepodařilo se načíst seznam lekcí.') || [];
}

/**
 * Lekce pro přehled jednoho dítěte: katalog + stav sezení tohoto dítěte.
 * @param {string} diteId
 * @returns {Promise<Array<PolozkaKatalogu & {
 *   stavLekce: 'nezacato'|'probiha'|'hotovo',
 *   sezeni: Sezeni|null,          // rozpracované (probiha < 24 h), jinak poslední dokončené, jinak null
 *   dokoncene: Sezeni|null,       // poslední dokončené sezení (R61, R62: hotová lekce, celá správně, odznaky)
 *   souhrn: SouhrnSezeni|null     // souhrn posledního dokončeného sezení
 * }>>}
 * Zamčené lekce mají zamceno = 'platba' („Odemkne se po platbě") / 'datum' („Otevře se {otevrit_od}")
 * / 'uzavreno' (sezóna skončila).
 */
export async function lekceProDite(diteId) {
  const [katalog, sezeni] = await Promise.all([
    katalogLekci(),
    supabase.from('sezeni').select('id, dite_id, lekce_id, rezim, zacatek, konec, stav, souhrn')
      .eq('dite_id', diteId).order('zacatek', { ascending: false })
      .then((odp) => vysledek(odp, 'Nepodařilo se načíst průběh lekcí.')),
  ]);
  const hranice = Date.now() - 24 * 3600 * 1000;
  return katalog.map((l) => {
    const moje = sezeni.filter((s) => s.lekce_id === l.id); // od nejnovějšího
    const dokoncene = moje.find((s) => s.stav === 'dokonceno') || null;
    // R18: platí NEJSTARŠÍ probíhající sezení < 24 h (stejné pravidlo jako aktualniSezeni)
    const probihajici = moje.findLast((s) => s.stav === 'probiha' && Date.parse(s.zacatek) > hranice) || null;
    let stavLekce = 'nezacato';
    if (probihajici) stavLekce = 'probiha';
    else if (dokoncene) stavLekce = 'hotovo';
    // dokoncene: poslední dokončené sezení (i když teď běží opakování) — pro hotovou lekci a odznaky (R61, R62)
    return { ...l, stavLekce, sezeni: probihajici || dokoncene, dokoncene, souhrn: dokoncene?.souhrn ?? null };
  });
}

/**
 * Celá lekce včetně obsahu (jsonb dle kostra/03). RLS vrátí jen přístupnou lekci.
 * @param {string} id  např. 'P1'
 * @returns {Promise<{id: string, faze: string, tyden: number, poradi: number, tema: string,
 *   kapitola: string, varianta: string, obsah: object, verejna: boolean, otevrit_od: string, verze: number}>}
 * @throws {ChybaSpolu} kod: zamceno — lekce neexistuje nebo je zamčená
 */
export async function nactiLekci(id) {
  const lekce = vysledek(await supabase.from('lekce').select('*').eq('id', id).maybeSingle(), 'Lekci se nepodařilo načíst.');
  if (!lekce) throw new ChybaSpolu('Tato lekce je zatím zamčená nebo neexistuje.', { kod: 'zamceno' });
  return lekce;
}

// =====================================================================
// Sezení
// =====================================================================

/**
 * Rozpracované sezení dítěte v lekci (stav 'probiha', mladší 24 h), nebo null.
 * Když jich je víc (souběh dvou zařízení, R18), vrátí NEJSTARŠÍ — obě zařízení tak skončí
 * ve stejném sezení. Rodičova stránka: nejdřív tohle; když null → zacitSezeni().
 * @param {string} diteId
 * @param {string} lekceId
 * @returns {Promise<Sezeni|null>}
 */
export async function aktualniSezeni(diteId, lekceId) {
  const od = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const radky = vysledek(await supabase.from('sezeni').select('*')
    .eq('dite_id', diteId).eq('lekce_id', lekceId).eq('stav', 'probiha').gt('zacatek', od)
    .order('zacatek', { ascending: true }).order('id', { ascending: true }).limit(1), 'Nepodařilo se načíst sezení.');
  return radky[0] || null;
}

/**
 * Začne lekci, nebo pokračuje v rozpracovaném sezení stejné lekce mladším 24 h (kostra 01).
 * Starší visící sezení této lekce (≥ 24 h) označí jako 'preruseno'. Při pokračování s jiným
 * režimem režim přepne (např. rodič zvolí „Na papír").
 *
 * Souběh (R18): žák i rodič mohou lekci otevřít ve stejnou chvíli a oba nenajdou rozpracované
 * sezení → vzniknou dvě. Proto se po založení znovu hledá nejstarší probíhající sezení téhož
 * dítěte a lekce mladší 24 h (aktualniSezeni); je-li jiné než nově založené, nové se označí
 * 'preruseno' a vrátí se to starší s `pokracovani: true` (jeho režim se nemění — zvolilo ho
 * zařízení, které bylo první). Bez real-time synchronizace tak obě zařízení skončí ve stejném sezení.
 * @param {string} diteId
 * @param {string} lekceId
 * @param {Rezim} [rezim='app']
 * @returns {Promise<{sezeni: Sezeni, pokracovani: boolean}>}
 *   pokracovani = true → pokračuje se v existujícím sezení (načtěte stavSezeni())
 */
export async function zacitSezeni(diteId, lekceId, rezim = 'app') {
  const existujici = await aktualniSezeni(diteId, lekceId);
  if (existujici) {
    if (rezim && existujici.rezim !== rezim) {
      const upravene = vysledek(await supabase.from('sezeni').update({ rezim }).eq('id', existujici.id).select().single(),
        'Nepodařilo se přepnout režim lekce.');
      return { sezeni: upravene, pokracovani: true };
    }
    return { sezeni: existujici, pokracovani: true };
  }
  // úklid: visící starší sezení téže lekce (chyba zde nevadí)
  const od = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  await supabase.from('sezeni').update({ stav: 'preruseno' })
    .eq('dite_id', diteId).eq('lekce_id', lekceId).eq('stav', 'probiha').lte('zacatek', od);

  const nove = vysledek(await supabase.from('sezeni').insert({ dite_id: diteId, lekce_id: lekceId, rezim }).select().single(),
    'Lekci se nepodařilo spustit.');

  // R18: souběh — mezitím mohlo sezení založit i druhé zařízení
  let nejstarsi = null;
  try { nejstarsi = await aktualniSezeni(diteId, lekceId); } catch (e) { console.warn('R18: kontrola souběhu selhala', e); }
  if (nejstarsi && nejstarsi.id !== nove.id) {
    const { error } = await supabase.from('sezeni').update({ stav: 'preruseno' }).eq('id', nove.id);
    if (error) console.warn('R18: nové sezení se nepodařilo označit jako přerušené', error);
    return { sezeni: nejstarsi, pokracovani: true };
  }
  return { sezeni: nove, pokracovani: false };
}

/**
 * R18 pro zařízení, které už v sezení pracuje (žák): platí ještě moje sezení? Když ho druhé
 * zařízení mezitím označilo 'preruseno' (souběh při startu), najde platné probíhající sezení
 * téže lekce, odešle frontu a převede do něj dosavadní odpovědi (duplicitní pokusy se přeskočí).
 * @param {Sezeni} sezeni  aktuální sezení stránky (potřebuje id, dite_id, lekce_id)
 * @returns {Promise<Sezeni|null>} platné sezení, na které se má stránka přepnout; null = není co měnit
 */
export async function platneSezeni(sezeni) {
  const { data, error } = await supabase.from('sezeni').select('id, stav').eq('id', sezeni.id).maybeSingle();
  if (error || !data || data.stav !== 'preruseno') return null;
  const platne = await aktualniSezeni(sezeni.dite_id, sezeni.lekce_id);
  if (!platne || platne.id === sezeni.id) return null;
  await opakovatNeulozene().catch(() => {});
  const radky = vysledek(await supabase.from('odpovedi').select('*').eq('sezeni_id', sezeni.id).order('id'),
    'Nepodařilo se načíst odpovědi.');
  if (radky.length) {
    const kopie = radky.map(({ id, created_at, ...zbytek }) => ({ ...zbytek, sezeni_id: platne.id }));
    const { error: chybaKopie } = await supabase.from('odpovedi')
      .upsert(kopie, { onConflict: 'sezeni_id,uloha_id,krok_id,zadal,pokus', ignoreDuplicates: true });
    if (chybaKopie) console.warn('R18: odpovědi se nepodařilo převést', chybaKopie);
  }
  return platne;
}

/**
 * Dokončí sezení a uloží souhrn (4 barvy + doporučení). Nejdřív zkusí odeslat neuložené odpovědi.
 * @param {string} sezeniId
 * @param {SouhrnSezeni} souhrn
 * @returns {Promise<Sezeni>}
 */
export async function dokoncitSezeni(sezeniId, souhrn) {
  await opakovatNeulozene();
  return vysledek(await supabase.from('sezeni')
    .update({ stav: 'dokonceno', konec: new Date().toISOString(), souhrn })
    .eq('id', sezeniId).select().single(), 'Lekci se nepodařilo ukončit.');
}

/**
 * Stav sezení pro polling rodiče (tlačítko „Obnovit" + každých 30 s).
 * @param {string} sezeniId
 * @returns {Promise<{
 *   sezeni: Sezeni,
 *   odpovedi: Array<object>,     // řádky odpovedi, od nejstarší
 *   semafory: Array<object>,     // řádky semafory
 *   poUlohach: Object<string, Object<string, object>>  // uloha_id → krok_id → POSLEDNÍ odpověď (nejvyšší pokus)
 * }>}
 */
export async function stavSezeni(sezeniId) {
  const [sezeni, odpovedi, semafory] = await Promise.all([
    supabase.from('sezeni').select('*').eq('id', sezeniId).single().then((o) => vysledek(o, 'Nepodařilo se načíst stav lekce.')),
    supabase.from('odpovedi').select('*').eq('sezeni_id', sezeniId).order('id').then((o) => vysledek(o, 'Nepodařilo se načíst odpovědi.')),
    supabase.from('semafory').select('*').eq('sezeni_id', sezeniId).then((o) => vysledek(o, 'Nepodařilo se načíst semafory.')),
  ]);
  const poUlohach = {};
  for (const o of odpovedi) {
    const u = (poUlohach[o.uloha_id] ||= {});
    const dosavadni = u[o.krok_id];
    if (!dosavadni || o.pokus > dosavadni.pokus || (o.pokus === dosavadni.pokus && o.id > dosavadni.id)) u[o.krok_id] = o;
  }
  return { sezeni, odpovedi, semafory, poUlohach };
}

// =====================================================================
// Odpovědi a semafory (s frontou pro výpadky sítě)
// =====================================================================

const KLIC_FRONTY = 'spolu.fronta-ukladani';
const posluchaciFronty = new Set();
let fronta = nactiFrontu();
let casovacOpakovani = null;
let probihaOpakovani = null;

function nactiFrontu() {
  try {
    const t = sessionStorage.getItem(KLIC_FRONTY);
    return t ? JSON.parse(t) : [];
  } catch {
    return [];
  }
}

function ulozFrontu() {
  try {
    if (fronta.length) sessionStorage.setItem(KLIC_FRONTY, JSON.stringify(fronta));
    else sessionStorage.removeItem(KLIC_FRONTY);
  } catch { /* sessionStorage nemusí být dostupné — fronta zůstává v paměti */ }
}

function oznamFrontu(chyba = null) {
  const stav = { pocet: fronta.length, chyba };
  for (const fn of posluchaciFronty) {
    try { fn(stav); } catch (e) { console.error(e); }
  }
  window.dispatchEvent(new CustomEvent('spolu:fronta', { detail: stav }));
}

function naplanujOpakovani() {
  if (casovacOpakovani || fronta.length === 0) return;
  casovacOpakovani = setTimeout(() => {
    casovacOpakovani = null;
    opakovatNeulozene().catch(() => {});
  }, 15000);
}

window.addEventListener('online', () => { opakovatNeulozene().catch(() => {}); });

/**
 * Posluchač stavu fronty neuložených záznamů — pro UI hlášku
 * „Nepodařilo se uložit, zkuste obnovit" (když pocet > 0) a její skrytí (pocet === 0).
 * Stejná informace chodí i jako událost window 'spolu:fronta' (event.detail = {pocet, chyba}).
 * @param {(stav: {pocet: number, chyba: ChybaSpolu|null}) => void} fn
 * @returns {() => void} odhlášení posluchače
 */
export function priZmeneFronty(fn) {
  posluchaciFronty.add(fn);
  fn({ pocet: fronta.length, chyba: null });
  return () => posluchaciFronty.delete(fn);
}

/** Počet záznamů čekajících na uložení. @returns {number} */
export function pocetNeulozenych() {
  return fronta.length;
}

/**
 * Kopie ODPOVĚDÍ, které čekají ve frontě na uložení (paměť + sessionStorage) — pro obnovení
 * rozpracované lekce a výpočet dalšího `pokus`, aby se neztratilo, co ještě není v DB.
 * Řádky mají tvar jako tabulka odpovedi, jen bez `id` a `created_at`.
 * @param {{sezeniId?: string}} [filtr]  jen odpovědi daného sezení
 * @returns {Array<object>}
 */
export function neulozeneOdpovedi({ sezeniId } = {}) {
  return fronta
    .filter((p) => p.druh === 'odpoved' && (!sezeniId || p.radek?.sezeni_id === sezeniId))
    .map((p) => JSON.parse(JSON.stringify(p.radek)));
}

async function odeslat(polozka) {
  if (polozka.druh === 'odpoved') {
    return supabase.from('odpovedi').upsert(polozka.radek, {
      onConflict: 'sezeni_id,uloha_id,krok_id,zadal,pokus',
      ignoreDuplicates: true, // opakované odeslání téhož pokusu se nezdvojí
    });
  }
  return supabase.from('semafory').upsert(polozka.radek, { onConflict: 'sezeni_id,uloha_id' });
}

/** Uloží položku; při dočasné chybě ji zařadí do fronty. */
async function ulozSFrontou(polozka, vychozi) {
  let odp;
  try {
    odp = await odeslat(polozka);
  } catch (e) {
    odp = { error: e, status: 0 };
  }
  if (!odp.error) return { ulozeno: true, veFronte: false };
  if (jeDocasna(odp.error, odp.status)) {
    fronta.push(polozka);
    ulozFrontu();
    oznamFrontu(new ChybaSpolu('Nepodařilo se uložit, zkuste obnovit.', { kod: 'sit', puvodni: odp.error }));
    naplanujOpakovani();
    return { ulozeno: false, veFronte: true };
  }
  throw prelozChybu(odp.error, odp.status, vychozi);
}

/**
 * Znovu zkusí uložit vše z fronty (v pořadí). Volá se i automaticky: každých 15 s, při
 * návratu připojení (online) a před dokoncitSezeni(). Bezpečné volat opakovaně.
 * @returns {Promise<{ulozeno: number, zbyva: number}>}
 */
export function opakovatNeulozene() {
  if (probihaOpakovani) return probihaOpakovani;
  probihaOpakovani = (async () => {
    let ulozeno = 0;
    let posledniChyba = null;
    while (fronta.length) {
      const polozka = fronta[0];
      let odp;
      try { odp = await odeslat(polozka); } catch (e) { odp = { error: e, status: 0 }; }
      if (odp.error && jeDocasna(odp.error, odp.status)) {
        posledniChyba = new ChybaSpolu('Nepodařilo se uložit, zkuste obnovit.', { kod: 'sit', puvodni: odp.error });
        break; // síť pořád nejde — zkusíme později
      }
      if (odp.error) console.error('Záznam z fronty nelze uložit, zahazuji:', odp.error, polozka);
      else ulozeno += 1;
      fronta.shift();
      ulozFrontu();
    }
    oznamFrontu(posledniChyba);
    naplanujOpakovani();
    return { ulozeno, zbyva: fronta.length };
  })().finally(() => { probihaOpakovani = null; });
  return probihaOpakovani;
}

// Po načtení stránky zkus dohnat, co zůstalo ze sessionStorage
if (fronta.length) setTimeout(() => { opakovatNeulozene().catch(() => {}); }, 1000);

/**
 * Uloží odpověď na krok. Volat hned po odevzdání kroku.
 * DŮLEŽITÉ: (sezeniId, ulohaId, krokId, zadal, pokus) je unikátní — každý další pokus
 * (i opakované zadání výsledku rodičem v režimu papír) musí mít vyšší `pokus`.
 * Při výpadku sítě nevyhodí chybu: vrátí {ulozeno:false, veFronte:true}, záznam drží ve frontě
 * (paměť + sessionStorage) a zkouší ho uložit znovu; UI se to dozví přes priZmeneFronty().
 * @param {Object} o
 * @param {string} o.sezeniId
 * @param {string} o.ulohaId            id úlohy z obsahu, např. 'P1-U3'
 * @param {string} o.krokId             'k1', 'k2', … nebo 'final'
 * @param {*} o.hodnota                 číslo | {c,j} | {cela,c,j} | id dlaždice | text
 * @param {boolean|null} o.spravne      null = nevyhodnotitelné (text)
 * @param {string|null} [o.typChyby]
 * @param {number} [o.pokus=1]
 * @param {number|null} [o.casS]        sekundy od ZOBRAZENÍ kroku do tohoto odevzdání (2. pokus včetně času 1.)
 * @param {Zadal} [o.zadal='dite']      'rodic' v režimu papír
 * @returns {Promise<{ulozeno: boolean, veFronte: boolean}>}
 */
export async function ulozOdpoved({ sezeniId, ulohaId, krokId, hodnota, spravne, typChyby = null, pokus = 1, casS = null, zadal = 'dite' }) {
  const radek = {
    sezeni_id: sezeniId,
    uloha_id: ulohaId,
    krok_id: krokId,
    hodnota: hodnota === undefined ? null : hodnota,
    spravne: spravne ?? null,
    typ_chyby: typChyby || null,
    pokus,
    cas_s: Number.isFinite(casS) ? Math.max(0, Math.round(casS)) : null,
    zadal,
  };
  return ulozSFrontou({ druh: 'odpoved', radek }, 'Odpověď se nepodařilo uložit.');
}

/**
 * Uloží (nebo přepíše) semafor úlohy — rodič může volbu změnit.
 * Barvu počítá volající přes barvaSemaforu() z vyhodnoceni.js (matice kostra/02).
 * Při výpadku sítě se chová jako ulozOdpoved (fronta).
 * @param {Object} o
 * @param {string} o.sezeniId
 * @param {string} o.ulohaId
 * @param {VolbaRodice} o.volbaRodice
 * @param {boolean|null} o.spravneAuto
 * @param {Barva} o.barva
 * @param {string} [o.doporuceni]       text z obsahu úlohy (semafor.<barva>)
 * @returns {Promise<{ulozeno: boolean, veFronte: boolean}>}
 */
export async function ulozSemafor({ sezeniId, ulohaId, volbaRodice, spravneAuto, barva, doporuceni = null }) {
  const radek = {
    sezeni_id: sezeniId,
    uloha_id: ulohaId,
    volba_rodice: volbaRodice,
    spravne_auto: spravneAuto ?? null,
    barva,
    doporuceni,
  };
  return ulozSFrontou({ druh: 'semafor', radek }, 'Semafor se nepodařilo uložit.');
}

// =====================================================================
// Historie (SOS)
// =====================================================================

/**
 * Chronologická historie DOKONČENÝCH lekcí dítěte (od nejstarší) s hlavní barvou lekce
 * (souhrn.hlavniBarva = barva úlohy typu „semafor") — pro SOS pravidlo
 * „2 dokončené lekce po sobě v kapitole s hlavní červenou" (viz dveCerveneVRade).
 * @param {string} diteId
 * @returns {Promise<Array<{sezeniId: string, lekceId: string, predmet: 'matematika'|'cestina', kapitola: string|null,
 *   tema: string|null, hlavniBarva: Barva|null, datum: string}>>}  predmet podle id lekce (čeština = cj-…, predmet.js)
 */
export async function historieDitete(diteId) {
  const radky = vysledek(await supabase.from('sezeni')
    .select('id, lekce_id, zacatek, konec, souhrn, lekce(kapitola, tema)')
    .eq('dite_id', diteId).eq('stav', 'dokonceno')
    .order('konec', { ascending: true, nullsFirst: true }).order('zacatek', { ascending: true }),
  'Nepodařilo se načíst historii.');
  return radky.map((r) => ({
    sezeniId: r.id,
    lekceId: r.lekce_id,
    predmet: predmetZId(r.lekce_id),
    // F2 (R38): blok/simulace mají v katalogu kapitolu `mix`/`simulace`; souhrn nese kapitolu hlavní úlohy
    kapitola: r.souhrn?.kapitola ?? r.lekce?.kapitola ?? null,
    tema: r.lekce?.tema ?? null,
    hlavniBarva: r.souhrn?.hlavniBarva ?? null,
    datum: r.konec || r.zacatek,
  }));
}

/**
 * Čistá funkce: mají poslední dvě dokončené lekce dané kapitoly (v pořadí historie) obě hlavní
 * barvu červenou? Právě probíhající lekci přidá volající na konec historie sám (souhrn před „Ukončit").
 * @param {Array<{kapitola: string|null, hlavniBarva: Barva|null}>} historie  z historieDitete()
 * @param {string} kapitola
 * @param {string|null} [predmet]  jen lekce tohoto předmětu (položky bez predmet = matematika); bez něj všechny
 * @returns {boolean}
 */
export function dveCerveneVRade(historie, kapitola, predmet = null) {
  const posledni = historie.filter((x) => x.kapitola === kapitola && (!predmet || (x.predmet ?? 'matematika') === predmet)).slice(-2);
  return posledni.length === 2 && posledni.every((x) => x.hlavniBarva === 'cervena');
}

// =====================================================================
// Admin (RLS pustí jen uid z tabulky admini)
// =====================================================================

function csvBunka(h) {
  if (h === null || h === undefined) return '';
  const s = typeof h === 'object' ? JSON.stringify(h) : String(h);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Pondělí ISO týdne jako 'RRRR-MM-DD' (místní čas). */
function zacatekTydne(iso) {
  const d = new Date(iso);
  const den = (d.getDay() + 6) % 7; // po = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - den);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const admin = {
  /**
   * Přehled rodin (v_prehled_rodin), seřazeno podle poslední aktivity (nejnovější nahoře).
   * @param {{stav?: StavRodiny, hledat?: string}} [filtr]  hledat = e-mail / jméno rodiče / jméno dítěte
   * @returns {Promise<Array<{rodina_id: string, jmeno_rodice: string, email: string, telefon: string|null,
   *   stav: StavRodiny, zdroj: string|null, poznamka_admin: string|null,
   *   odemknuto_at: string|null, registrace_at: string, deti: Array<object>, deti_jmena: string|null,
   *   posledni_aktivita: string|null, dokonceno_lekci: number, aktualni_tyden: number|null,
   *   posledni_lekce_id: string|null, cervene_7d: number}>>}
   */
  async prehledRodin({ stav, hledat } = {}) {
    let q = supabase.from('v_prehled_rodin').select('*')
      .order('posledni_aktivita', { ascending: false, nullsFirst: false })
      .order('registrace_at', { ascending: false });
    if (stav) q = q.eq('stav', stav);
    const radky = vysledek(await q, 'Nepodařilo se načíst přehled rodin.');
    const h = (hledat || '').trim().toLowerCase();
    if (!h) return radky;
    return radky.filter((r) => [r.email, r.jmeno_rodice, r.deti_jmena].some((x) => (x || '').toLowerCase().includes(h)));
  },

  /**
   * Detail rodiny: rodina, děti a jejich sezení (nejnovější první) s lekcí, odpověďmi a semafory.
   * @param {string} rodinaId
   * @returns {Promise<{rodina: Rodina & {poznamka_admin: string|null}, deti: Dite[],
   *   sezeni: Array<Sezeni & {lekce: {tema: string, kapitola: string, faze: string, tyden: number, poradi: number}|null,
   *   odpovedi: Array<object>, semafory: Array<object>}>}>}
   */
  async detailRodiny(rodinaId) {
    const [rodina, deti] = await Promise.all([
      supabase.from('rodiny').select('*').eq('id', rodinaId).single().then((o) => vysledek(o, 'Rodinu se nepodařilo načíst.')),
      supabase.from('deti').select('*').eq('rodina_id', rodinaId).order('poradi').then((o) => vysledek(o, 'Děti se nepodařilo načíst.')),
    ]);
    let sezeni = [];
    if (deti.length) {
      sezeni = vysledek(await supabase.from('sezeni')
        .select('*, lekce(tema, kapitola, faze, tyden, poradi), odpovedi(*), semafory(*)')
        .in('dite_id', deti.map((d) => d.id))
        .order('zacatek', { ascending: false }), 'Sezení se nepodařilo načíst.');
      for (const s of sezeni) s.odpovedi.sort((a, b) => a.id - b.id);
    }
    return { rodina, deti, sezeni };
  },

  /**
   * Znovu otevře uzavřený účet (stav 'aktivni'; odemknuto_at doplní DB).
   * @param {string} rodinaId
   * @returns {Promise<Rodina>}
   */
  async odemknout(rodinaId) {
    return vysledek(await supabase.from('rodiny').update({ stav: 'aktivni' }).eq('id', rodinaId).select().single(),
      'Rodinu se nepodařilo odemknout.');
  },

  /**
   * Uzavře účet rodiny (stav 'uzavreny' — obsah nečitelný, jen poděkování).
   * @param {string} rodinaId
   * @returns {Promise<Rodina>}
   */
  async uzavrit(rodinaId) {
    return vysledek(await supabase.from('rodiny').update({ stav: 'uzavreny' }).eq('id', rodinaId).select().single(),
      'Účet se nepodařilo uzavřít.');
  },

  /**
   * Uloží Pavlovu poznámku k rodině.
   * @param {string} rodinaId
   * @param {string} poznamka
   * @returns {Promise<Rodina>}
   */
  async ulozitPoznamku(rodinaId, poznamka) {
    return vysledek(await supabase.from('rodiny').update({ poznamka_admin: poznamka?.trim() || null }).eq('id', rodinaId).select().single(),
      'Poznámku se nepodařilo uložit.');
  },

  /**
   * Obsah lekcí s pseudo-kapitolou mix / simulace a semafory jejich úloh (F2, R38):
   * statistiky pak berou kapitolu úlohy místo kapitoly lekce.
   * @returns {Promise<{lekce: object[], semafory: Array<{uloha_id: string, barva: Barva}>}>}
   */
  async ulohyPseudoKapitol() {
    const lekce = vysledek(await supabase.from('lekce').select('id, obsah').in('kapitola', ['mix', 'simulace']),
      'Obsah bloků se nepodařilo načíst.');
    const obsahy = lekce.map((l) => l.obsah || {});
    const ids = obsahy.flatMap((o) => (o.ulohy || []).map((u) => u.id)).filter(Boolean);
    const semafory = ids.length
      ? vysledek(await supabase.from('semafory').select('uloha_id, barva').in('uloha_id', ids), 'Semafory bloků se nepodařilo načíst.')
      : [];
    return { lekce: obsahy, semafory };
  },

  /**
   * Semafory dle kapitoly (v_semafory_dle_kapitoly).
   * Řádky je_celkem = true jsou součty za všechny děti (dite_id null), ostatní per dítě.
   * @returns {Promise<Array<{kapitola: string, barva: Barva, dite_id: string|null, krestni_jmeno: string|null,
   *   je_celkem: boolean, pocet: number}>>}
   */
  async semaforyDleKapitoly() {
    return vysledek(await supabase.from('v_semafory_dle_kapitoly').select('*').order('kapitola'),
      'Statistiku semaforů se nepodařilo načíst.');
  },

  /**
   * Průměrný čas na úlohu (v_cas_na_ulohu). Řádky je_kapitola = true jsou průměry za kapitolu.
   * @returns {Promise<Array<{kapitola: string, lekce_id: string|null, uloha_id: string|null,
   *   je_kapitola: boolean, prumer_cas_s: number, pocet_mereni: number}>>}
   */
  async casNaUlohu() {
    return vysledek(await supabase.from('v_cas_na_ulohu').select('*').order('kapitola').order('uloha_id', { nullsFirst: true }),
      'Statistiku časů se nepodařilo načíst.');
  },

  /**
   * Červené semafory za posledních N dní (v_cervene), nejnovější první.
   * @param {{dni?: number}} [volby]  výchozí 30
   * @returns {Promise<Array<{datum: string, rodina_id: string, jmeno_rodice: string, email: string, dite_id: string,
   *   krestni_jmeno: string, sezeni_id: string, lekce_id: string, tema: string, kapitola: string, uloha_id: string,
   *   volba_rodice: VolbaRodice, spravne_auto: boolean|null}>>}
   */
  async cervene({ dni = 30 } = {}) {
    const od = new Date(Date.now() - dni * 24 * 3600 * 1000).toISOString();
    return vysledek(await supabase.from('v_cervene').select('*').gte('datum', od).order('datum', { ascending: false }),
      'Seznam červených se nepodařilo načíst.');
  },

  /**
   * Děti s alarmem (v_alarm): za 7 dní ≥ 3 lekce a v každé červená.
   * @returns {Promise<Array<{dite_id: string, krestni_jmeno: string, rodina_id: string, jmeno_rodice: string,
   *   email: string, pocet_lekci_7d: number, posledni_lekce: string}>>}
   */
  async alarm() {
    return vysledek(await supabase.from('v_alarm').select('*'), 'Alarmy se nepodařilo načíst.');
  },

  /**
   * Souhrnné statistiky: rodiny dle stavu, dokončené lekce po týdnech.
   * @returns {Promise<{rodinyDleStavu: {aktivni: number, uzavreny: number}, celkem: number,
   *   dokoncenoPoTydnech: Array<{tyden: string, pocet: number}>}>}
   *   tyden = pondělí týdne 'RRRR-MM-DD'
   */
  async statistiky() {
    const [rodiny, sezeni] = await Promise.all([
      supabase.from('rodiny').select('stav').then((o) => vysledek(o, 'Statistiky se nepodařilo načíst.')),
      supabase.from('sezeni').select('konec').eq('stav', 'dokonceno').not('konec', 'is', null)
        .then((o) => vysledek(o, 'Statistiky se nepodařilo načíst.')),
    ]);
    const rodinyDleStavu = { aktivni: 0, uzavreny: 0 };
    for (const r of rodiny) rodinyDleStavu[r.stav] = (rodinyDleStavu[r.stav] || 0) + 1;
    const tydny = new Map();
    for (const s of sezeni) {
      const t = zacatekTydne(s.konec);
      tydny.set(t, (tydny.get(t) || 0) + 1);
    }
    return {
      rodinyDleStavu,
      celkem: rodiny.length,
      dokoncenoPoTydnech: [...tydny.entries()].sort().map(([tyden, pocet]) => ({ tyden, pocet })),
    };
  },

  /**
   * Data pro export CSV rodin . CSV je pro český Excel:
   * oddělovač středník, UTF-8 s BOM. Stažení (Blob) řeší admin.js.
   * @param {{stav?: StavRodiny}} [filtr]
   * @returns {Promise<{hlavicka: string[], radky: Array<Array<any>>, csv: string}>}
   */
  async exportCsvData({ stav } = {}) {
    const rodiny = await admin.prehledRodin({ stav });
    const hlavicka = ['email', 'jmeno_rodice', 'telefon', 'stav', 'deti', 'zdroj',
      'registrace', 'odemknuto', 'posledni_aktivita', 'dokonceno_lekci', 'poznamka'];
    const radky = rodiny.map((r) => [r.email, r.jmeno_rodice, r.telefon, r.stav, r.deti_jmena, r.zdroj,
      r.registrace_at, r.odemknuto_at, r.posledni_aktivita,
      r.dokonceno_lekci, r.poznamka_admin]);
    const csv = '﻿' + [hlavicka, ...radky].map((r) => r.map(csvBunka).join(';')).join('\r\n');
    return { hlavicka, radky, csv };
  },
};
