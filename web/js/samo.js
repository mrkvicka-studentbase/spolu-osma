// =====================================================================
// samo.js — lekce bez rodiče „Dnes samo" (R64, Pavel 30. 9., fáze A). Čisté funkce bez DOM a sítě.
// Aplikace převezme roli rodiče: nápovědy (Otázky 1–3 z taháku), volbu semaforu z průběhu úlohy
// a ukončení lekce. Barva se počítá stejnou maticí jako u rodiče (vyhodnoceni.js barvaSemaforu, kostra 02).
// =====================================================================

/** Kolik nápověd má úloha nejvýš (Otázky 1–3 z taháku). */
export const MAX_NAPOVED = 3;

/**
 * Jde lekce udělat samo? Jen běžná lekce (ne blok, simulace, diagnostika) a bez kroků,
 * které hodnotí rodič pohledem (rýsování, volný text).
 * @param {object} lekce  obsah lekce (ulohy[].kroky[].vstup.typ, typ)
 */
export function lzeSamo(lekce) {
  if (!lekce || (lekce.typ && lekce.typ !== 'bezna')) return false;
  if (lekce.predmet === 'cestina') return false; // čeština zatím jen s rodičem: poslech, diktát, tahák (R66)
  return (lekce.ulohy || []).every((u) => (u.kroky || []).every((k) => !['rysovani', 'text'].includes(k.vstup?.typ)));
}

/**
 * Volba semaforu, kterou by jinak klikl rodič — z průběhu úlohy (klíč R34):
 * - správně bez nápovědy (i po vlastní opravě) = „Sám/sama";
 * - správně po nápovědě = „Potřeboval(a) otázku";
 * - špatně po všech nápovědách = „Nevěděl(a)"; jinak špatně = „Spletl(a) se".
 * @param {{spravne: boolean|null|undefined, napovedy: number}} p  spravne = poslední pokus kroku `final`
 * @returns {'sam'|'s_otazkou'|'chyba_pocty'|'nevedel'}
 */
export function volbaSamo({ spravne, napovedy = 0 }) {
  if (spravne === true) return napovedy > 0 ? 's_otazkou' : 'sam';
  return napovedy >= MAX_NAPOVED ? 'nevedel' : 'chyba_pocty';
}

/**
 * Otázka z taháku jako nápověda pro dítě: bez uvozovek přímé řeči, s označením příkladu (rozcvička).
 * @param {string|{k?: string, text: string}} otazka
 * @returns {{k: string|null, text: string}}
 */
export function napovedaZOtazky(otazka) {
  const o = typeof otazka === 'object' && otazka ? otazka : { text: String(otazka ?? '') };
  const text = String(o.text ?? '').trim().replace(/^[„"]\s*/, '').replace(/\s*[“"]$/, '');
  return { k: o.k ? String(o.k) : null, text };
}

/**
 * Připomínka rodiči (R64, Pavel: ano): poslední dvě dokončené lekce (podle času dokončení) proběhly bez rodiče.
 * @param {Array<{dokoncene?: {konec?: string, rezim?: string}|null}>} lekce  z lekceProDite
 */
export function dveSamoZaSebou(lekce) {
  const dok = lekce.map((l) => l.dokoncene).filter((s) => s?.konec).sort((a, b) => Date.parse(a.konec) - Date.parse(b.konec));
  return dok.length >= 2 && dok.slice(-2).every((s) => s.rezim === 'samo');
}
