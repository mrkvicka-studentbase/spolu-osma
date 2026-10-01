// =====================================================================
// otevreni-cj.mjs — datum otevření lekcí češtiny (fáze zaklady)
//
// Návrh ředitele (KONTROLA-2026-09-30 §C, bod 3): všechny lekce týdne 1 se otevřou
// v den spuštění, každý další týden vždy v pondělí. Den spuštění zatím není rozhodnutý,
// proto ho seed bere jako parametr --otevrit-od-zaklady RRRR-MM-DD.
// Čas otevření je půlnoc v Praze (letní i zimní čas).
// =====================================================================

const DEN_MS = 24 * 60 * 60 * 1000;

/** Platné datum RRRR-MM-DD → Date (půlnoc UTC toho dne), jinak null. */
export function parsujDatum(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text ?? ''));
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;
  return d;
}

/** Posun Prahy proti UTC v daném okamžiku, v minutách (+60 zimní, +120 letní čas). */
function posunPrahy(okamzik) {
  const casti = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Prague', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(okamzik);
  const h = Object.fromEntries(casti.map((c) => [c.type, c.value]));
  const mistni = Date.UTC(+h.year, +h.month - 1, +h.day, +h.hour, +h.minute);
  return Math.round((mistni - Math.floor(okamzik.getTime() / 60000) * 60000) / 60000);
}

/** Půlnoc daného dne (Date s půlnocí UTC) v Praze jako ISO řetězec s posunem, např. 2026-10-05T00:00:00+02:00. */
export function pulnocVPraze(den) {
  // posun o půlnoci: odhad z poledne předchozího dne, pak ověření v samotném okamžiku (změna času je ve 2–3 h)
  let posun = posunPrahy(new Date(den.getTime() - 12 * 60 * 60 * 1000));
  posun = posunPrahy(new Date(den.getTime() - posun * 60000));
  const znak = posun >= 0 ? '+' : '-';
  const a = Math.abs(posun);
  const dvoj = (n) => String(n).padStart(2, '0');
  return `${den.toISOString().slice(0, 10)}T00:00:00${znak}${dvoj(Math.floor(a / 60))}:${dvoj(a % 60)}`;
}

/**
 * Den otevření týdne `tyden` (1–8) při spuštění v den `spusteni` (Date z parsujDatum).
 * Týden 1 = den spuštění; týden 2 = nejbližší pondělí PO dni spuštění; každý další o 7 dní později.
 */
export function denOtevreniZaklady(tyden, spusteni) {
  if (!Number.isInteger(tyden) || tyden < 1) throw new Error(`neplatný týden: ${tyden}`);
  if (!(spusteni instanceof Date) || Number.isNaN(spusteni.getTime())) throw new Error('neplatné datum spuštění');
  if (tyden === 1) return spusteni;
  const doPondeli = ((8 - spusteni.getUTCDay()) % 7) || 7; // spuštění v pondělí → týden 2 až za 7 dní
  return new Date(spusteni.getTime() + (doPondeli + 7 * (tyden - 2)) * DEN_MS);
}

/** otevrit_od pro řádek lekce češtiny: půlnoc dne otevření jejího týdne v Praze. */
export function otevritOdZaklady(tyden, spusteni) {
  return pulnocVPraze(denOtevreniZaklady(tyden, spusteni));
}
