/**
 * Every number on screen traces back to a published source.
 * Sources: BPS (Badan Pusat Statistik) — Berita Resmi Statistik IHK.
 */
export const SOURCES = {
  bps: 'BPS — Berita Resmi Statistik, Indeks Harga Konsumen',
  bps2024: 'BPS, 2 Jan 2025 — IHK Desember 2024',
  bps2025: 'BPS, 5 Jan 2026 — IHK Desember 2025',
  bps1998: 'BPS — inflasi tahunan 1998 (y-on-y)',
} as const;

export const FACTS = {
  /** y-on-y inflation, December, percent — BPS headline CPI */
  yearly: [
    { year: 2019, value: 2.72 },
    { year: 2020, value: 1.68 },
    { year: 2021, value: 1.87 },
    { year: 2022, value: 5.51 },
    { year: 2023, value: 2.61 },
    { year: 2024, value: 1.57 },
    { year: 2025, value: 2.92 },
  ],
  cpi: {
    2023: 105.15,
    2024: 106.8,
    2025: 109.92,
  },
  crisis1998: 77.63,
  lowestSince: 1958,
  latest: 2.92,
  latestYear: 2025,
} as const;

/** Illustration only — not a national statistic. */
export const ILLUSTRATION = {
  chickenRice2019: 15000,
  chickenRice2026: 22000,
  wallet: 500000,
} as const;

export const DISCLAIMER = 'Data: BPS. Angka ilustrasi ditandai "ilustrasi".';
