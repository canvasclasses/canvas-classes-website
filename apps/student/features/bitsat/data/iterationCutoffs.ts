// ============================================================================
// BITSAT iteration-wise closing cutoffs — STATIC source for the /bitsat page.
//
// BITS admission runs in iterations (rounds). This file holds the per-iteration
// closing scores, with one entry per (campus, programme) carrying that
// programme's closing score for each tracked year. The /bitsat Cutoffs tab
// renders a year-by-year comparison (current year highlighted), matching the
// founder's "BITSAT Cutoffs 2024·2025·2026" sheet.
//
// Why a static file and not Mongo (project decision 2026-06-22): iteration data
// lands a few times a year, is hand-curated from the official BITS iteration
// sheets, and the predictor does not read it (the predictor uses `bitsat_cutoffs`
// in Mongo — FINAL closing scores post all iterations, a different number).
//
// To add a future iteration (Iteration 2, …): append a new `BitsatIteration`
// object to `BITSAT_ITERATIONS`. The Cutoffs tab renders every iteration here
// and selects the latest by default.
//
// Source: Canvas Classes "BITSAT Cutoffs 2024·2025·2026" — Iteration-1 allotment
// closing scores. Transcribed verbatim from the side-by-side comparison sheet
// and cross-checked against the per-campus detail pages. A blank year means BITS
// did not allot that (campus, programme) in that year's Iteration 1.
//
// Vocabulary is reused from the predictor catalogs so cutoff rows line up 1:1
// with predictor programmes/campuses:
//   - campus ids  → packages/data/bitsat/campuses.ts   (BitsatCampusId)
//   - programme   → packages/data/bitsat/programmes.ts (BitsatProgrammeCode)
// ============================================================================

import type { BitsatCampusId } from '@canvas/data/bitsat/campuses';
import type { BitsatProgrammeCode } from '@canvas/data/bitsat/programmes';

export interface BitsatIterationCutoffRow {
  campus: BitsatCampusId;              // 'pilani' | 'goa' | 'hyderabad'
  programme_code: BitsatProgrammeCode; // 'BE-CSE', 'BPHARM', …
  // Closing score per year. A missing year = not allotted that year.
  scores: Partial<Record<number, number>>;
}

export interface BitsatIteration {
  iteration: number;                 // 1, 2, 3, …
  years: number[];                   // ascending; the last is the current cycle
  currentYear: number;               // the highlighted / "headline" year
  max_score: number;                 // 390 for the modern (2022+) paper
  published_label?: string;          // e.g. "Iteration-1 allotment · 2026"
  rows: BitsatIterationCutoffRow[];
}

// ── The data ────────────────────────────────────────────────────────────────
// Iteration 1 — closing scores for 2024, 2025, 2026 (out of 390).
const ITERATION_1: BitsatIteration = {
  iteration: 1,
  years: [2024, 2025, 2026],
  currentYear: 2026,
  max_score: 390,
  published_label: 'Iteration-1 allotment closing scores',
  rows: [
    // ── BITS Pilani ──────────────────────────────────────────────────────────
    { campus: 'pilani', programme_code: 'BE-CSE',  scores: { 2024: 331, 2025: 320, 2026: 340 } },
    { campus: 'pilani', programme_code: 'BE-MNC',  scores: { 2024: 326, 2025: 310, 2026: 330 } },
    { campus: 'pilani', programme_code: 'BE-ECE',  scores: { 2024: 318, 2025: 306, 2026: 331 } },
    { campus: 'pilani', programme_code: 'BE-EEE',  scores: { 2024: 295, 2025: 281, 2026: 306 } },
    { campus: 'pilani', programme_code: 'BE-EIE',  scores: { 2024: 285, 2025: 270, 2026: 296 } },
    { campus: 'pilani', programme_code: 'BE-MECH', scores: { 2024: 267, 2025: 256, 2026: 270 } },
    { campus: 'pilani', programme_code: 'BE-CHE',  scores: { 2024: 252, 2025: 245, 2026: 264 } },
    { campus: 'pilani', programme_code: 'BE-CIV',  scores: { 2024: 242, 2025: 235, 2026: 255 } },
    { campus: 'pilani', programme_code: 'BE-ENV',  scores: { 2025: 206, 2026: 234 } },
    { campus: 'pilani', programme_code: 'BE-MANF', scores: { 2024: 247, 2025: 235 } },
    { campus: 'pilani', programme_code: 'MSC-ECON', scores: { 2024: 273, 2025: 259, 2026: 278 } },
    { campus: 'pilani', programme_code: 'MSC-SEMI', scores: { 2025: 253, 2026: 268 } },
    { campus: 'pilani', programme_code: 'MSC-MATH', scores: { 2024: 259, 2025: 243, 2026: 256 } },
    { campus: 'pilani', programme_code: 'MSC-PHYS', scores: { 2024: 255, 2025: 237, 2026: 253 } },
    { campus: 'pilani', programme_code: 'MSC-CHEM', scores: { 2024: 243, 2025: 226, 2026: 240 } },
    { campus: 'pilani', programme_code: 'MSC-BIO',  scores: { 2024: 239, 2025: 223, 2026: 232 } },
    { campus: 'pilani', programme_code: 'BPHARM',   scores: { 2024: 217 } },

    // ── BITS Goa ─────────────────────────────────────────────────────────────
    { campus: 'goa', programme_code: 'BE-CSE',  scores: { 2024: 304, 2025: 286, 2026: 309 } },
    { campus: 'goa', programme_code: 'BE-MNC',  scores: { 2024: 295, 2025: 282, 2026: 299 } },
    { campus: 'goa', programme_code: 'BE-ECMP', scores: { 2025: 274, 2026: 293 } },
    { campus: 'goa', programme_code: 'BE-ECE',  scores: { 2024: 288, 2025: 272, 2026: 289 } },
    { campus: 'goa', programme_code: 'BE-EEE',  scores: { 2024: 278, 2025: 265, 2026: 283 } },
    { campus: 'goa', programme_code: 'BE-EIE',  scores: { 2024: 271, 2025: 255, 2026: 274 } },
    { campus: 'goa', programme_code: 'BE-MECH', scores: { 2024: 258, 2025: 248, 2026: 261 } },
    { campus: 'goa', programme_code: 'BE-CHE',  scores: { 2024: 242, 2025: 234, 2026: 251 } },
    { campus: 'goa', programme_code: 'MSC-ECON', scores: { 2024: 265, 2025: 248, 2026: 261 } },
    { campus: 'goa', programme_code: 'MSC-SEMI', scores: { 2025: 244, 2026: 256 } },
    { campus: 'goa', programme_code: 'MSC-MATH', scores: { 2024: 246, 2025: 233, 2026: 248 } },
    { campus: 'goa', programme_code: 'MSC-PHYS', scores: { 2024: 250, 2025: 231, 2026: 244 } },
    { campus: 'goa', programme_code: 'MSC-CHEM', scores: { 2024: 238, 2025: 223, 2026: 238 } },
    { campus: 'goa', programme_code: 'MSC-BIO',  scores: { 2024: 236, 2025: 219, 2026: 228 } },

    // ── BITS Hyderabad ───────────────────────────────────────────────────────
    { campus: 'hyderabad', programme_code: 'BE-CSE',  scores: { 2024: 298, 2025: 281, 2026: 303 } },
    { campus: 'hyderabad', programme_code: 'BE-MNC',  scores: { 2024: 293, 2025: 278, 2026: 298 } },
    { campus: 'hyderabad', programme_code: 'BE-ECE',  scores: { 2024: 282, 2025: 264, 2026: 289 } },
    { campus: 'hyderabad', programme_code: 'BE-EEE',  scores: { 2024: 275, 2025: 261, 2026: 277 } },
    { campus: 'hyderabad', programme_code: 'BE-EIE',  scores: { 2024: 270, 2025: 258, 2026: 276 } },
    { campus: 'hyderabad', programme_code: 'BE-MECH', scores: { 2024: 252, 2025: 242, 2026: 254 } },
    { campus: 'hyderabad', programme_code: 'BE-CHE',  scores: { 2024: 241, 2025: 229, 2026: 245 } },
    { campus: 'hyderabad', programme_code: 'BE-CIV',  scores: { 2024: 237, 2025: 227, 2026: 243 } },
    { campus: 'hyderabad', programme_code: 'BE-ENV',  scores: { 2026: 224 } },
    { campus: 'hyderabad', programme_code: 'MSC-ECON', scores: { 2024: 261, 2025: 245, 2026: 256 } },
    { campus: 'hyderabad', programme_code: 'MSC-SEMI', scores: { 2025: 243, 2026: 254 } },
    { campus: 'hyderabad', programme_code: 'MSC-MATH', scores: { 2024: 248, 2025: 229, 2026: 245 } },
    { campus: 'hyderabad', programme_code: 'MSC-PHYS', scores: { 2024: 245, 2025: 227, 2026: 241 } },
    { campus: 'hyderabad', programme_code: 'MSC-CHEM', scores: { 2024: 237, 2025: 222, 2026: 236 } },
    { campus: 'hyderabad', programme_code: 'MSC-BIO',  scores: { 2024: 234, 2025: 217, 2026: 229 } },
    { campus: 'hyderabad', programme_code: 'BPHARM',   scores: { 2024: 186, 2025: 166, 2026: 213 } },
  ],
};

export const BITSAT_ITERATIONS: BitsatIteration[] = [
  ITERATION_1,
];

/** Iterations sorted newest-first (by current year, then iteration number). */
export function getIterationsNewestFirst(): BitsatIteration[] {
  return [...BITSAT_ITERATIONS].sort(
    (a, b) => b.currentYear - a.currentYear || b.iteration - a.iteration,
  );
}

/** The most recent iteration, or undefined if none are defined yet. */
export function getLatestIteration(): BitsatIteration | undefined {
  return getIterationsNewestFirst()[0];
}
