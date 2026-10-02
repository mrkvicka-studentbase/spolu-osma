// =====================================================================
// temata.js — Spolu 8: názvy témat („Téma 3 · Zlomky I“), počet úloh a délka lekce. Čisté funkce bez DOM.
//
// Název tématu je v obsah/hlasky.md (tabulka „Názvy témat“, klíče tema_mat.t1 … tema_mat.t10 a tema_cj.t1 … tema_cj.t10)
// → web/js/hlasky.js (node nastroje/generuj-hlasky.mjs). Metodici je doplní z osnov (obsah/OSNOVA-MATEMATIKA.md,
// cestina/Obsah/OSNOVA.md). Dokud tam nejsou, název se složí z kapitol lekcí tématu („zlomky a poměr“).
// =====================================================================

import { HLASKY, KAPITOLY } from './hlasky.js';

/** Výchozí počet úloh v lekci, když ho katalog nezná (ZADANI-OSMA §2). */
export const VYCHOZI_POCET_ULOH = Object.freeze({ matematika: 4, cestina: 5 });
/** Výchozí délka lekce v minutách (ZADANI-OSMA §2). */
export const VYCHOZI_CAS = Object.freeze({ matematika: 20, cestina: 25 });

const predmetPolozky = (l) => (l?.predmet === 'cestina' || /^cj-/.test(String(l?.id || '')) ? 'cestina' : 'matematika');

/** Klíč hlášky s názvem tématu. */
export const klicTematu = (predmet, t) => `${predmet === 'cestina' ? 'tema_cj' : 'tema_mat'}.t${t}`;

/**
 * Název tématu bez čísla: z hlášek (osnova), jinak z kapitol lekcí tématu, jinak prázdný řetězec.
 * @param {'matematika'|'cestina'} predmet
 * @param {number|string} t  číslo tématu (lekce.tyden)
 * @param {Array<{tyden: number, kapitola: string}>} [lekce]  lekce předmětu (katalog)
 * @returns {string}
 */
export function nazevTematu(predmet, t, lekce = []) {
  const z = HLASKY[klicTematu(predmet, t)];
  if (z) return z;
  const kapitoly = [...new Set(lekce.filter((l) => Number(l.tyden) === Number(t)).map((l) => l.kapitola).filter(Boolean))]
    .map((k) => KAPITOLY[k] ?? k);
  if (!kapitoly.length) return '';
  const text = kapitoly.length === 1 ? kapitoly[0] : `${kapitoly.slice(0, -1).join(', ')} a ${kapitoly.at(-1)}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Počet úloh lekce: z obsahu (ulohy), z katalogu (pocet_uloh), jinak výchozí podle předmětu.
 * @param {{ulohy?: object[], pocet_uloh?: number, predmet?: string, id?: string}} l
 */
export function pocetUlohLekce(l) {
  if (Array.isArray(l?.ulohy) && l.ulohy.length) return l.ulohy.length;
  return Number(l?.pocet_uloh) || VYCHOZI_POCET_ULOH[predmetPolozky(l)];
}

/** Délka lekce v minutách: cas_min, jinak výchozí podle předmětu. */
export function casLekce(l) {
  return Number(l?.cas_min) || VYCHOZI_CAS[predmetPolozky(l)];
}

/**
 * Předložka „z“ / „ze“ před číslem (podle toho, jak se číslo čte v 2. pádě): „Úloha 2 z 5“, „ze 4“, „ze 40 lekcí“.
 * @param {number} n
 * @returns {'z'|'ze'}
 */
export function zeZ(n) {
  const x = Math.abs(Math.trunc(Number(n)));
  if (!Number.isFinite(x) || x === 0) return 'z';
  if (x >= 100) return x < 200 ? 'ze' : zeZ(Math.trunc(x / 100)); // ze sta, ze dvou set, z pěti set
  const jednotky = { 1: 'z', 2: 'ze', 3: 'ze', 4: 'ze', 5: 'z', 6: 'ze', 7: 'ze', 8: 'z', 9: 'z' };
  const nactky = { 10: 'z', 11: 'z', 12: 'ze', 13: 'ze', 14: 'ze', 15: 'z', 16: 'ze', 17: 'ze', 18: 'z', 19: 'z' };
  if (x < 10) return jednotky[x];
  if (x < 20) return nactky[x];
  return jednotky[Math.trunc(x / 10)] ?? 'z'; // dvacet → ze dvaceti, padesát → z padesáti
}
