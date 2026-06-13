// ============================================================================
// BITSAT 2026 cutoff projections — authoritative per-branch band.
//
// SOURCE OF TRUTH for the 2026 admission cycle. These are NOT scraped/historical
// closing scores (those live in the `bitsat_cutoffs` collection, 2017–2025).
// They are the expert projection from Canvas Classes Admissions Research,
// "Model v4" (BITSAT_Cutoffs_BranchPredictor_Data.xlsx, generated 2026-06-13),
// the same numbers presented in BITSAT_2026_Cutoff_Outlook_Canvas_Classes_3.pptx.
//
// Why a static authoritative table instead of the predictor's on-the-fly
// projection: the live engine (apps/student/features/college-predictor/bitsat/
// predictor.ts) used a naive weighted-mean + linear-trend on 2022–2025 raw
// scores. That overshoots the realised 2026 outlook by +9 to +25 marks because
// it cannot see the structural forces the survey model captures:
//   • a markedly harder Session-1 paper (300+ scorers fell ~5.8% → ~1.3%),
//   • cross-survey + BITS moderation (samples collected separately each year),
//   • the new top-500 tuition waiver anchoring premier-branch demand,
//   • flat applicant base + expanded capacity easing the mid/lower tail.
// The model's `likely` is the base case; `low`/`high` are the bear/bull bounds
// (PPT slide 15). `high` is the "safe target" — it clears the branch even in
// the most competitive scenario (PPT slide 16: ≈ 2025 close + 10).
//
// METHODOLOGY (README of the source sheet): pool = best of both sessions
// max(S1,S2) from paired score surveys (978 records 2026, 685 2025). Each 2025
// official cutoff was percentile-matched into the 2026 best-of-both distribution;
// the raw shift was retained 50–75% (less at the top) for cross-survey +
// moderation effects, plus a top-end demand floor. Outcome: premier ≈ flat,
// mid −10 to −14, lower −5 to −8.
//
// HOW THE PREDICTOR USES THIS (predictor.ts): when predicting the live 2026
// cycle in the modern regime, the band drives bucketing directly —
//   Safe   = score ≥ high      (clears even the bull case)
//   Target = likely ≤ score < high
//   Reach  = low ≤ score < likely
//   Unlikely = score < low
// Backtests (asOfYear set) and the legacy regime fall back to the statistical
// engine, so historical-accuracy validation is unaffected.
//
// SCHEDULED UPDATE: refresh this band on 2026-06-20 from the iteration-one updated data (revised survey pool).
//
// MAINTENANCE: regenerate when the source sheet is revised (re-run the band
// export, paste below). Confidence mirrors the sheet — Medium for premier
// branches (tug-of-war between difficulty and scholarship demand + thin top-tail
// data); High elsewhere. Branches absent here (e.g. Goa B.E. Electronics and
// Computer, which the sheet does not cover) fall back to the statistical engine.
// ============================================================================

import type { BitsatProgrammeCode } from './programmes';

export const BITSAT_PREDICTION_YEAR = 2026 as const;
export const BITSAT_PREDICTION_REGIME_MAX_SCORE = 390 as const;

export type BitsatBandConfidence = 'high' | 'medium';

export interface BitsatPrediction2026 {
  campus: 'Pilani' | 'Goa' | 'Hyderabad';
  programme_code: BitsatProgrammeCode;
  /** Bear case — difficulty wins, scholarship pull below expectations. */
  low: number;
  /** Base case — opposing forces offset. The headline projected cutoff. */
  likely: number;
  /** Bull case — scholarship demand dominates. Also the "safe target" score. */
  high: number;
  /** Official 2025 closing score this band was projected from (context only). */
  official_2025?: number;
  /** likely − 2025 official (the projected year-on-year move). */
  delta_2025_2026: number;
  confidence: BitsatBandConfidence;
  notes?: string;
}

// Generated from BITSAT_Cutoffs_BranchPredictor_Data.xlsx (Model v4, 2026-06-13).
export const BITSAT_PREDICTIONS_2026: BitsatPrediction2026[] = [
  { campus: 'Goa', programme_code: 'BE-CHE', low: 197, likely: 198, high: 204, official_2025: 206, delta_2025_2026: -8, confidence: 'high' },
  { campus: 'Goa', programme_code: 'BE-CSE', low: 250, likely: 263, high: 276, official_2025: 274, delta_2025_2026: -11, confidence: 'medium', notes: 'Scholarship-supported (top-500 waiver)' },
  { campus: 'Goa', programme_code: 'BE-ECE', low: 233, likely: 241, high: 253, official_2025: 255, delta_2025_2026: -14, confidence: 'medium' },
  { campus: 'Goa', programme_code: 'BE-EEE', low: 223, likely: 229, high: 240, official_2025: 243, delta_2025_2026: -14, confidence: 'high' },
  { campus: 'Goa', programme_code: 'BE-EIE', low: 219, likely: 223, high: 232, official_2025: 234, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Goa', programme_code: 'BE-ENV', low: 183, likely: 184, high: 187, official_2025: 189, delta_2025_2026: -5, confidence: 'high', notes: 'Introduced 2025' },
  { campus: 'Goa', programme_code: 'BE-MECH', low: 209, likely: 212, high: 219, official_2025: 223, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Goa', programme_code: 'BE-MNC', low: 244, likely: 257, high: 270, official_2025: 268, delta_2025_2026: -11, confidence: 'medium', notes: 'Scholarship-supported (top-500 waiver)' },
  { campus: 'Goa', programme_code: 'MSC-BIO', low: 195, likely: 196, high: 201, official_2025: 203, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Goa', programme_code: 'MSC-CHEM', low: 196, likely: 198, high: 202, official_2025: 205, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Goa', programme_code: 'MSC-ECON', low: 221, likely: 226, high: 235, official_2025: 237, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Goa', programme_code: 'MSC-MATH', low: 205, likely: 207, high: 213, official_2025: 216, delta_2025_2026: -9, confidence: 'high' },
  { campus: 'Goa', programme_code: 'MSC-PHYS', low: 202, likely: 204, high: 209, official_2025: 212, delta_2025_2026: -8, confidence: 'high' },
  { campus: 'Goa', programme_code: 'MSC-SEMI', low: 211, likely: 214, high: 221, official_2025: 225, delta_2025_2026: -11, confidence: 'high', notes: 'Introduced 2025' },
  { campus: 'Hyderabad', programme_code: 'BE-CHE', low: 196, likely: 198, high: 202, official_2025: 205, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'BE-CIV', low: 195, likely: 196, high: 201, official_2025: 203, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'BE-CSE', low: 246, likely: 259, high: 272, official_2025: 270, delta_2025_2026: -11, confidence: 'medium', notes: 'Scholarship-supported (top-500 waiver)' },
  { campus: 'Hyderabad', programme_code: 'BE-ECE', low: 233, likely: 241, high: 254, official_2025: 256, delta_2025_2026: -15, confidence: 'medium' },
  { campus: 'Hyderabad', programme_code: 'BE-EEE', low: 222, likely: 227, high: 236, official_2025: 239, delta_2025_2026: -12, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'BE-EIE', low: 217, likely: 221, high: 230, official_2025: 232, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'BE-ENV', low: 175, likely: 176, high: 179, official_2025: 181, delta_2025_2026: -5, confidence: 'high', notes: 'Introduced 2025' },
  { campus: 'Hyderabad', programme_code: 'BE-MECH', low: 203, likely: 205, high: 211, official_2025: 214, delta_2025_2026: -9, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'BE-MNC', low: 242, likely: 255, high: 268, official_2025: 266, delta_2025_2026: -11, confidence: 'medium', notes: 'Scholarship-supported (top-500 waiver)' },
  { campus: 'Hyderabad', programme_code: 'BPHARM', low: 147, likely: 147, high: 150, official_2025: 151, delta_2025_2026: -4, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'MSC-BIO', low: 195, likely: 196, high: 201, official_2025: 203, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'MSC-CHEM', low: 195, likely: 196, high: 201, official_2025: 203, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'MSC-ECON', low: 217, likely: 221, high: 229, official_2025: 231, delta_2025_2026: -10, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'MSC-MATH', low: 202, likely: 204, high: 209, official_2025: 212, delta_2025_2026: -8, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'MSC-PHYS', low: 200, likely: 202, high: 206, official_2025: 209, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Hyderabad', programme_code: 'MSC-SEMI', low: 211, likely: 214, high: 221, official_2025: 225, delta_2025_2026: -11, confidence: 'high', notes: 'Introduced 2025' },
  { campus: 'Pilani', programme_code: 'BE-CHE', low: 201, likely: 202, high: 208, official_2025: 210, delta_2025_2026: -8, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'BE-CIV', low: 197, likely: 198, high: 204, official_2025: 206, delta_2025_2026: -8, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'BE-CSE', low: 281, likely: 302, high: 316, official_2025: 304, delta_2025_2026: -2, confidence: 'medium', notes: 'Scholarship-supported (top-500 waiver)' },
  { campus: 'Pilani', programme_code: 'BE-ECE', low: 261, likely: 279, high: 292, official_2025: 285, delta_2025_2026: -6, confidence: 'medium' },
  { campus: 'Pilani', programme_code: 'BE-EEE', low: 236, likely: 249, high: 262, official_2025: 260, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'BE-EIE', low: 229, likely: 237, high: 248, official_2025: 250, delta_2025_2026: -13, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'BE-ENV', low: 195, likely: 196, high: 201, official_2025: 203, delta_2025_2026: -7, confidence: 'high', notes: 'Introduced 2025' },
  { campus: 'Pilani', programme_code: 'BE-MANF', low: 202, likely: 204, high: 208, official_2025: 211, delta_2025_2026: -7, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'BE-MECH', low: 220, likely: 224, high: 233, official_2025: 235, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'BE-MNC', low: 273, likely: 294, high: 307, official_2025: 295, delta_2025_2026: -1, confidence: 'medium', notes: 'Scholarship-supported (top-500 waiver)' },
  { campus: 'Pilani', programme_code: 'BPHARM', low: 166, likely: 166, high: 168, official_2025: 168, delta_2025_2026: -2, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'MSC-BIO', low: 199, likely: 200, high: 206, official_2025: 208, delta_2025_2026: -8, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'MSC-CHEM', low: 202, likely: 204, high: 209, official_2025: 212, delta_2025_2026: -8, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'MSC-ECON', low: 230, likely: 238, high: 249, official_2025: 251, delta_2025_2026: -13, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'MSC-MATH', low: 215, likely: 218, high: 225, official_2025: 229, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'MSC-PHYS', low: 209, likely: 212, high: 219, official_2025: 223, delta_2025_2026: -11, confidence: 'high' },
  { campus: 'Pilani', programme_code: 'MSC-SEMI', low: 222, likely: 227, high: 236, official_2025: 239, delta_2025_2026: -12, confidence: 'high', notes: 'Introduced 2025' },
];

// Fast lookup keyed by "Campus::programme_code" — the predictor's join key.
export const BITSAT_PREDICTION_2026_BY_KEY: Record<string, BitsatPrediction2026> =
  Object.fromEntries(
    BITSAT_PREDICTIONS_2026.map((p) => [`${p.campus}::${p.programme_code}`, p]),
  );

export function getBitsatPrediction2026(
  campus: string,
  programmeCode: string,
): BitsatPrediction2026 | undefined {
  return BITSAT_PREDICTION_2026_BY_KEY[`${campus}::${programmeCode}`];
}
