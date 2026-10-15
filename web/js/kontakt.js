// =====================================================================
// kontakt.js — stálý kontakt pro rodiče: položka „Kontakt“ v menu, řádek na přehledu, tlačítko pod manuálem.
// Nahrazuje placenou SOS konzultaci (rozhodnutí Pavla 15. 10. 2026): jen e-mail (mailto), bez ceny a bez slibů.
//
// E-mail z config.js: KONTAKT_EMAIL, záloha starý klíč SOS_EMAIL (Pavel může mít vlastní config.js se starým
// klíčem). Proto `import * as` — pojmenovaný import chybějícího exportu by shodil celý modul.
// Jméno dítěte do těla e-mailu nastaví stránka, jakmile dítě zná (nastavKontakt; přehled, stránka rodiče).
// Texty: obsah/hlasky.md, skupina kontakt.*.
// =====================================================================

import * as KONFIG from './config.js';
import { h } from './hlasky.js';

/**
 * E-mail pro kontakt z konfigurace (nový klíč má přednost, starý SOS_EMAIL jako záloha).
 * @param {{KONTAKT_EMAIL?: string, SOS_EMAIL?: string}} konfig
 * @returns {string}
 */
export function emailZKonfigurace(konfig) {
  return String(konfig?.KONTAKT_EMAIL || konfig?.SOS_EMAIL || '').trim();
}

export const KONTAKT_EMAIL = emailZKonfigurace(KONFIG);

const kontext = { jmenoDitete: '', jmenoRodice: '' };

/**
 * Jméno dítěte (a rodiče) pro tělo e-mailu. Volá stránka po načtení dítěte; menu si odkaz sestaví při otevření.
 * @param {{jmenoDitete?: string, jmenoRodice?: string}} udaje
 */
export function nastavKontakt({ jmenoDitete, jmenoRodice } = {}) {
  if (jmenoDitete !== undefined) kontext.jmenoDitete = String(jmenoDitete || '').trim();
  if (jmenoRodice !== undefined) kontext.jmenoRodice = String(jmenoRodice || '').trim();
}

/**
 * Odkaz mailto: předmět „Spolu 8: dotaz“, tělo se jménem dítěte (jen když ho známe).
 * @param {{jmenoDitete?: string, jmenoRodice?: string, email?: string}} [volby]  výchozí = nastavKontakt + config.js
 * @returns {string}
 */
export function kontaktMailto({ jmenoDitete = kontext.jmenoDitete, jmenoRodice = kontext.jmenoRodice, email = KONTAKT_EMAIL } = {}) {
  const casti = [`subject=${encodeURIComponent(h('kontakt.mailto_predmet'))}`];
  if (jmenoDitete) {
    const telo = h('kontakt.mailto_telo', { jmeno_ditete: jmenoDitete, jmeno_rodice: jmenoRodice || '' });
    casti.push(`body=${encodeURIComponent(telo.replace(/\n/g, '\r\n'))}`);
  }
  return `mailto:${email}?${casti.join('&')}`;
}
