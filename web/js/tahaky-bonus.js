// =====================================================================
// web/js/tahaky-bonus.js — měsíční výzvy a zlaté bonusové taháky Spolu 8 (R78 + R82).
// Výzva: v kalendářním měsíci (Europe/Prague) dokončit aspoň `cil` různých lekcí (učební i naostro, ne B-varianty
// a testy), oba předměty se sčítají. Odměna = zlatý tahák `b:<mesic>`; všem se odemknou 1. 6. 2027 (tahaky.js).
// Cíle: plán je 6 lekcí týdně (3 M + 3 ČJ), cíl ≈ 60–70 % plánu měsíce bez prázdnin (listopad: začátek sezóny
// a úvodní testy; květen: lekce roku končí, počítá se i zopakovaná lekce). Mění se jen tady, kód ne.
// KOSTRA taháků: zatím jen zástupný blok „Připravujeme“, obsah doplní autoři (TAHAKY-OSMA.md).
// =====================================================================

export const VYZVY = [
  { mesic: '2026-11', cil: 12, nazev: 'Listopadový start' },
  { mesic: '2026-12', cil: 12, nazev: 'Adventní výzva' },
  { mesic: '2027-01', cil: 15, nazev: 'Novoroční výzva' },
  { mesic: '2027-02', cil: 12, nazev: 'Únorová výzva' },
  { mesic: '2027-03', cil: 16, nazev: 'Jarní výzva' },
  { mesic: '2027-04', cil: 16, nazev: 'Dubnová výzva' },
  { mesic: '2027-05', cil: 8, nazev: 'Májový finiš' },
];

export const TAHAKY_BONUS = [
  {
    id: 'b:2026-11', mesic: '2026-11',
    nazev: 'Nejčastější chyby v matematice',
    podnazev: 'Bonus za listopadovou výzvu',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Zlatý tahák pro tebe právě píšeme. Brzy tu bude.' },
    ],
  },
  {
    id: 'b:2026-12', mesic: '2026-12',
    nazev: 'Nejčastější chyby v češtině',
    podnazev: 'Bonus za prosincovou výzvu',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Zlatý tahák pro tebe právě píšeme. Brzy tu bude.' },
    ],
  },
  {
    id: 'b:2027-01', mesic: '2027-01',
    nazev: 'Jak číst zadání',
    podnazev: 'Bonus za lednovou výzvu',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Zlatý tahák pro tebe právě píšeme. Brzy tu bude.' },
    ],
  },
  {
    id: 'b:2027-02', mesic: '2027-02',
    nazev: 'Jak se učit 20 minut denně',
    podnazev: 'Bonus za únorovou výzvu',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Zlatý tahák pro tebe právě píšeme. Brzy tu bude.' },
    ],
  },
  {
    id: 'b:2027-03', mesic: '2027-03',
    nazev: 'Velký přehled vzorců',
    podnazev: 'Bonus za březnovou výzvu',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Zlatý tahák pro tebe právě píšeme. Brzy tu bude.' },
    ],
  },
  {
    id: 'b:2027-04', mesic: '2027-04',
    nazev: 'Velký přehled pravopisu',
    podnazev: 'Bonus za dubnovou výzvu',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Zlatý tahák pro tebe právě píšeme. Brzy tu bude.' },
    ],
  },
  {
    id: 'b:2027-05', mesic: '2027-05',
    nazev: 'Co mě čeká v 9. třídě',
    podnazev: 'Bonus za květnovou výzvu',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Zlatý tahák pro tebe právě píšeme. Brzy tu bude.' },
    ],
  },
];
