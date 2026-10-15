// =====================================================================
// kontakt.test.js — stálý kontakt pro rodiče místo placené SOS konzultace (Pavel 15. 10. 2026)
// Spustit: npm test
//
// Pokrývá: e-mail z config.js (KONTAKT_EMAIL, záloha starý SOS_EMAIL), odkaz mailto (předmět, tělo se jménem dítěte),
// hlášky kontakt.* bez ceny, žádné hlášky sos.* / rodic.sos_*, manuály s blokem Kontakt bez SOS a souhrn lekce
// bez nabídky po 2. červené v řadě (rodic-souhrn.js už historii dítěte nečte; DOM v Node není, kontrola zdrojáku).
// =====================================================================

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { emailZKonfigurace, kontaktMailto, nastavKontakt, KONTAKT_EMAIL } from '../web/js/kontakt.js';
import { HLASKY } from '../web/js/hlasky.js';
import { MANUAL_MD } from '../web/js/manual.js';
import { MANUAL_CJ_MD } from '../web/js/manual-cj.js';

const zdroj = (cesta) => readFileSync(new URL(`../${cesta}`, import.meta.url), 'utf8');

describe('kontakt.js', () => {
  test('e-mail: KONTAKT_EMAIL, jinak starý SOS_EMAIL (vlastní config.js), jinak prázdný', () => {
    assert.equal(emailZKonfigurace({ KONTAKT_EMAIL: 'a@b.cz', SOS_EMAIL: 'stary@b.cz' }), 'a@b.cz');
    assert.equal(emailZKonfigurace({ SOS_EMAIL: 'stary@b.cz' }), 'stary@b.cz');
    assert.equal(emailZKonfigurace({ KONTAKT_EMAIL: '', SOS_EMAIL: ' stary@b.cz ' }), 'stary@b.cz');
    assert.equal(emailZKonfigurace({}), '');
    assert.equal(emailZKonfigurace(null), '');
    assert.match(KONTAKT_EMAIL, /^[^@\s]+@[^@\s]+\.[a-z]+$/, 'config.js má mít kontaktní e-mail');
  });

  test('mailto: předmět „Spolu 8: dotaz“, tělo se jménem dítěte jen když ho známe', () => {
    const bez = kontaktMailto({ jmenoDitete: '', email: 'x@y.cz' });
    assert.equal(bez, `mailto:x@y.cz?subject=${encodeURIComponent('Spolu 8: dotaz')}`);
    const s = kontaktMailto({ jmenoDitete: 'Adam', jmenoRodice: 'Jana', email: 'x@y.cz' });
    const telo = decodeURIComponent(s.split('&body=')[1]);
    assert.match(telo, /Dítě: Adam/);
    assert.match(telo, /Jana$/);
    assert.ok(!/\{[a-z_]+\}/.test(decodeURIComponent(s)), 'žádný nedosazený placeholder');
    assert.ok(telo.includes('\r\n'), 'nové řádky v mailto jako CRLF');
  });

  test('nastavKontakt: výchozí jméno dítěte pro menu a manuál', () => {
    nastavKontakt({ jmenoDitete: 'Eva', jmenoRodice: '' });
    assert.match(decodeURIComponent(kontaktMailto()), /Dítě: Eva/);
    nastavKontakt({ jmenoDitete: '' });
    assert.ok(!kontaktMailto().includes('&body='));
  });
});

describe('bez placené SOS konzultace', () => {
  test('hlášky: skupina kontakt.* je, sos.* a rodic.sos_* nejsou; nikde cena', () => {
    for (const k of ['kontakt.menu', 'kontakt.prehled_text', 'kontakt.prehled_odkaz', 'kontakt.tlacitko', 'kontakt.mailto_predmet', 'kontakt.mailto_telo']) {
      assert.ok(HLASKY[k], `chybí hláška ${k}`);
    }
    const klice = Object.keys(HLASKY);
    assert.deepEqual(klice.filter((k) => /^sos\.|\.sos_/.test(k)), []);
    for (const [k, v] of Object.entries(HLASKY)) {
      assert.ok(!/\bKč\b|konzultac/i.test(v), `hláška ${k} zmiňuje cenu nebo konzultaci: ${v}`);
      if (k.startsWith('kontakt.')) assert.ok(!/přijímač/i.test(v), `${k} nemá zmiňovat přijímačky`);
    }
  });

  test('manuály rodiče: blok Kontakt, žádné SOS ani cena', () => {
    for (const md of [MANUAL_MD, MANUAL_CJ_MD]) {
      assert.match(md, /ikona=mail\n\*\*Kontakt\.\*\*/);
      assert.ok(!/\bSOS\b|ikona=sos|\bKč\b/.test(md));
    }
  });

  test('souhrn lekce rodiče: po 2. červené v řadě žádná nabídka (historie se nečte)', () => {
    const souhrn = zdroj('web/js/rodic-souhrn.js');
    assert.ok(!/historieDitete|dveCerveneVRade|sosAktivni|pripravSouhrnData|sos[._]/.test(souhrn));
    const rodic = zdroj('web/js/rodic.js');
    assert.ok(!/pripravSouhrnData|sosAktivni/.test(rodic));
    const supa = zdroj('web/js/supabase.js');
    assert.ok(!/export (async )?function (historieDitete|dveCerveneVRade)/.test(supa));
  });

  test('přehled: žádné tlačítko ani modal SOS, řádek kontaktu je', () => {
    const js = zdroj('web/js/prehled.js');
    assert.ok(!/tlacitkoSos|otevritSos|sosOdkaz|'sos'/.test(js));
    assert.match(js, /kontakt\.prehled_text/);
    assert.ok(!/modalSos|sosOdkaz/.test(zdroj('web/prehled.html')));
    assert.match(zdroj('web/js/menu.js'), /kontakt\.menu/);
  });
});
