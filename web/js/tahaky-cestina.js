// =====================================================================
// web/js/tahaky-cestina.js — taháky češtiny Spolu 8 (R78). Jeden tahák na téma (= `tyden` v katalogu, 1–10).
// Odemkne se dokončením všech učebních lekcí tématu (L1–L4); naostro a B-varianty se nepočítají (tahaky.js).
// KOSTRA: zatím jen zástupný blok „Připravujeme“. Obsah doplní autoři podle
// predani/2026-10-09-odznaky-a-tahaky/TAHAKY-OSMA.md: 3–6 bloků { nadpis, text, priklad? }, markdown + KaTeX ($…$),
// zpětné lomítko v LaTeXu je v JS řetězci zdvojené, příklady jiné než v úlohách lekcí. Kód se při plnění nemění;
// id, predmet, faze a tyden neměnit (podle nich se tahák odemyká a pamatuje).
// =====================================================================
export const TAHAKY_CESTINA = Object.freeze([
  // téma 1: cj-t1-l1, cj-t1-l1n, cj-t1-l2, cj-t1-l2n, cj-t1-l3, cj-t1-l3n, cj-t1-l4, cj-t1-l4n
  {
    id: 't:cestina:osma:1', predmet: 'cestina', faze: 'osma', tyden: 1,
    nazev: 'Slovní druhy',
    podnazev: 'Téma 1',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 2: cj-t2-l5, cj-t2-l5n, cj-t2-l6, cj-t2-l6n, cj-t2-l7, cj-t2-l7n, cj-t2-l8, cj-t2-l8n
  {
    id: 't:cestina:osma:2', predmet: 'cestina', faze: 'osma', tyden: 2,
    nazev: 'Podstatná jména: vzory a koncovky',
    podnazev: 'Téma 2',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 3: cj-t3-l9, cj-t3-l9n, cj-t3-l10, cj-t3-l10n, cj-t3-l11, cj-t3-l11n, cj-t3-l12, cj-t3-l12n
  {
    id: 't:cestina:osma:3', predmet: 'cestina', faze: 'osma', tyden: 3,
    nazev: 'Přídavná jména',
    podnazev: 'Téma 3',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 4: cj-t4-l13, cj-t4-l13n, cj-t4-l14, cj-t4-l14n, cj-t4-l15, cj-t4-l15n, cj-t4-l16, cj-t4-l16n
  {
    id: 't:cestina:osma:4', predmet: 'cestina', faze: 'osma', tyden: 4,
    nazev: 'Zájmena a číslovky',
    podnazev: 'Téma 4',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 5: cj-t5-l17, cj-t5-l17n, cj-t5-l18, cj-t5-l18n, cj-t5-l19, cj-t5-l19n, cj-t5-l20, cj-t5-l20n
  {
    id: 't:cestina:osma:5', predmet: 'cestina', faze: 'osma', tyden: 5,
    nazev: 'Slovesa: způsob, vid, rod',
    podnazev: 'Téma 5',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 6: cj-t6-l21, cj-t6-l21n, cj-t6-l22, cj-t6-l22n, cj-t6-l23, cj-t6-l23n, cj-t6-l24, cj-t6-l24n
  {
    id: 't:cestina:osma:6', predmet: 'cestina', faze: 'osma', tyden: 6,
    nazev: 'Vyjmenovaná slova',
    podnazev: 'Téma 6',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 7: cj-t7-l25, cj-t7-l25n, cj-t7-l26, cj-t7-l26n, cj-t7-l27, cj-t7-l27n, cj-t7-l28, cj-t7-l28n
  {
    id: 't:cestina:osma:7', predmet: 'cestina', faze: 'osma', tyden: 7,
    nazev: 'Shoda přísudku s podmětem',
    podnazev: 'Téma 7',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 8: cj-t8-l29, cj-t8-l29n, cj-t8-l30, cj-t8-l30n, cj-t8-l31, cj-t8-l31n, cj-t8-l32, cj-t8-l32n
  {
    id: 't:cestina:osma:8', predmet: 'cestina', faze: 'osma', tyden: 8,
    nazev: 'Větné členy',
    podnazev: 'Téma 8',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 9: cj-t9-l33, cj-t9-l33n, cj-t9-l34, cj-t9-l34n, cj-t9-l35, cj-t9-l35n, cj-t9-l36, cj-t9-l36n
  {
    id: 't:cestina:osma:9', predmet: 'cestina', faze: 'osma', tyden: 9,
    nazev: 'Souvětí a čárka',
    podnazev: 'Téma 9',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 10: cj-t10-l37, cj-t10-l37n, cj-t10-l38, cj-t10-l38n, cj-t10-l39, cj-t10-l39n, cj-t10-l40, cj-t10-l40n
  {
    id: 't:cestina:osma:10', predmet: 'cestina', faze: 'osma', tyden: 10,
    nazev: 'Stavba slova a pravopis na švu',
    podnazev: 'Téma 10',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
]);
