// =====================================================================
// web/js/tahaky-matematika.js — taháky matematiky Spolu 8 (R78). Jeden tahák na téma (= `tyden` v katalogu, 1–10).
// Odemkne se dokončením všech učebních lekcí tématu (L1–L4); naostro a B-varianty se nepočítají (tahaky.js).
// KOSTRA: zatím jen zástupný blok „Připravujeme“. Obsah doplní autoři podle
// predani/2026-10-09-odznaky-a-tahaky/TAHAKY-OSMA.md: 3–6 bloků { nadpis, text, priklad? }, markdown + KaTeX ($…$),
// zpětné lomítko v LaTeXu je v JS řetězci zdvojené, příklady jiné než v úlohách lekcí. Kód se při plnění nemění;
// id, predmet, faze a tyden neměnit (podle nich se tahák odemyká a pamatuje).
// =====================================================================
export const TAHAKY_MATEMATIKA = Object.freeze([
  // téma 1: M8-T01-L1, M8-T01-L1N, M8-T01-L2, M8-T01-L2N, M8-T01-L3, M8-T01-L3N, M8-T01-L4, M8-T01-L4N
  {
    id: 't:matematika:osma:1', predmet: 'matematika', faze: 'osma', tyden: 1,
    nazev: 'Přirozená čísla a dělitelnost',
    podnazev: 'Téma 1',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 2: M8-T02-L1, M8-T02-L1N, M8-T02-L2, M8-T02-L2N, M8-T02-L3, M8-T02-L3N, M8-T02-L4, M8-T02-L4N
  {
    id: 't:matematika:osma:2', predmet: 'matematika', faze: 'osma', tyden: 2,
    nazev: 'Desetinná čísla',
    podnazev: 'Téma 2',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 3: M8-T03-L1, M8-T03-L1N, M8-T03-L2, M8-T03-L2N, M8-T03-L3, M8-T03-L3N, M8-T03-L4, M8-T03-L4N
  {
    id: 't:matematika:osma:3', predmet: 'matematika', faze: 'osma', tyden: 3,
    nazev: 'Jednotky, obvod a obsah',
    podnazev: 'Téma 3',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 4: M8-T04-L1, M8-T04-L1N, M8-T04-L2, M8-T04-L2N, M8-T04-L3, M8-T04-L3N, M8-T04-L4, M8-T04-L4N
  {
    id: 't:matematika:osma:4', predmet: 'matematika', faze: 'osma', tyden: 4,
    nazev: 'Zlomky I',
    podnazev: 'Téma 4',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 5: M8-T05-L1, M8-T05-L1N, M8-T05-L2, M8-T05-L2N, M8-T05-L3, M8-T05-L3N, M8-T05-L4, M8-T05-L4N
  {
    id: 't:matematika:osma:5', predmet: 'matematika', faze: 'osma', tyden: 5,
    nazev: 'Zlomky II',
    podnazev: 'Téma 5',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 6: M8-T06-L1, M8-T06-L1N, M8-T06-L2, M8-T06-L2N, M8-T06-L3, M8-T06-L3N, M8-T06-L4, M8-T06-L4N
  {
    id: 't:matematika:osma:6', predmet: 'matematika', faze: 'osma', tyden: 6,
    nazev: 'Celá a racionální čísla',
    podnazev: 'Téma 6',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 7: M8-T07-L1, M8-T07-L1N, M8-T07-L2, M8-T07-L2N, M8-T07-L3, M8-T07-L3N, M8-T07-L4, M8-T07-L4N
  {
    id: 't:matematika:osma:7', predmet: 'matematika', faze: 'osma', tyden: 7,
    nazev: 'Úhly, trojúhelníky, souměrnost',
    podnazev: 'Téma 7',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 8: M8-T08-L1, M8-T08-L1N, M8-T08-L2, M8-T08-L2N, M8-T08-L3, M8-T08-L3N, M8-T08-L4, M8-T08-L4N
  {
    id: 't:matematika:osma:8', predmet: 'matematika', faze: 'osma', tyden: 8,
    nazev: 'Poměr, měřítko, úměrnost',
    podnazev: 'Téma 8',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 9: M8-T09-L1, M8-T09-L1N, M8-T09-L2, M8-T09-L2N, M8-T09-L3, M8-T09-L3N, M8-T09-L4, M8-T09-L4N
  {
    id: 't:matematika:osma:9', predmet: 'matematika', faze: 'osma', tyden: 9,
    nazev: 'Procenta a úrok',
    podnazev: 'Téma 9',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
  // téma 10: M8-T10-L1, M8-T10-L1N, M8-T10-L2, M8-T10-L2N, M8-T10-L3, M8-T10-L3N, M8-T10-L4, M8-T10-L4N
  {
    id: 't:matematika:osma:10', predmet: 'matematika', faze: 'osma', tyden: 10,
    nazev: 'Tělesa a slovní úlohy',
    podnazev: 'Téma 10',
    bloky: [
      { nadpis: 'Připravujeme', text: 'Tahák k tomuto tématu pro tebe právě píšeme. Brzy tu budou pravidla a vzorové příklady.' },
    ],
  },
]);
