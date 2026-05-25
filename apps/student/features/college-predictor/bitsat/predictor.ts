// ============================================
// BITSAT predictor — score-based engine for BITS Pilani / Goa / Hyderabad
// admissions through BITSAT.
//
// Companion to ../lib/predictor.ts (which handles JoSAA/JEE Main rank-based
// predictions for NITs/IIITs/GFTIs). The two are intentionally separate:
//
//   JoSAA: rank (lower = better), category × gender × quota dimensions
//   BITSAT: score (higher = better), no category dimension (all-merit)
//
// Algorithm:
//  1. For each (campus, programme), pull 5 most-recent years of closing scores
//     from the SAME paper regime (max_score == 390 for 2022+, 450 for older).
//     Mixing regimes is forbidden — the paper pattern changed.
//  2. Weighted-mean projection (recent years weighted higher) + linear trend.
//  3. Bucket by z-score against historical sigma.
//  4. Confidence tag based on years of data + coefficient of variation.
//
// Stateless and DB-aware. Web route calls `predictBitsat` once per request.
// ============================================

import connectDB from '@canvas/data/db/mongodb';
import { BitsatCutoff } from '@canvas/data/models/BitsatCutoff';
import {
  BITSAT_CAMPUSES,
  type BitsatCampusInfo,
  type BitsatCampusId,
} from '@canvas/data/bitsat/campuses';
import {
  BITSAT_PROGRAMME_BY_CODE,
  type BitsatProgrammeCode,
  type BitsatProgrammeInfo,
} from '@canvas/data/bitsat/programmes';

export type BitsatBucket = 'safe' | 'target' | 'reach' | 'unlikely';
export type BitsatConfidence = 'high' | 'medium' | 'low';

// The BITSAT paper changed in AY 2022-23 (max 450 → max 390). Scores are NOT
// comparable across the boundary, so the predictor scopes a single regime per
// query. Callers default to 'modern' (390); the legacy regime is exposed for
// research / archival queries only.
export type BitsatRegime = 'modern' | 'legacy';

export const REGIME_MAX_SCORE: Record<BitsatRegime, number> = {
  modern: 390,
  legacy: 450,
};

export interface BitsatPredictorInput {
  // Raw BITSAT score (0..390 for the modern paper, 0..450 for the legacy one).
  score: number;
  // Defaults to 'modern' (paper from 2022 onward). Callers can flip to
  // 'legacy' to query 2017-2021 data for research.
  regime?: BitsatRegime;
  // Optional refinement filters
  campuses?: BitsatCampusId[];                  // ['pilani', 'goa', 'hyderabad']
  programmes?: BitsatProgrammeCode[];           // ['BE-CSE', 'BE-MNC', ...]
  include_unlikely?: boolean;                   // default false
}

export interface BitsatPredictorResult {
  campus_id: BitsatCampusId;
  campus_name: BitsatCampusInfo['name'];        // "Pilani" | "Goa" | "Hyderabad"
  campus_state: string;
  campus_region: string;
  nirf_rank_engineering?: number;

  programme_code: BitsatProgrammeCode;
  programme_short_name: string;                 // e.g. "CSE", "MnC"
  programme_name: string;                       // e.g. "B.E. Computer Science"
  degree_type: BitsatProgrammeInfo['degree_type'];

  bucket: BitsatBucket;
  probability_pct: number;
  projected_cutoff_score: number;
  historical: { year: number; cutoff_score: number }[];

  confidence: BitsatConfidence;
  confidence_reason: string;
  regime: BitsatRegime;
  max_score: number;
}

// ── Projection model ───────────────────────────────────────────────────────────
interface Projection {
  projected: number;
  sigma: number;
  confidence: BitsatConfidence;
  confidence_reason: string;
}

function project(historical: { year: number; cutoff_score: number }[]): Projection {
  const sorted = [...historical].sort((a, b) => b.year - a.year); // newest first

  if (sorted.length === 1) {
    const s = sorted[0].cutoff_score;
    return {
      projected: s,
      sigma: Math.max(s * 0.05, 4),
      confidence: 'low',
      confidence_reason: 'Only 1 year of data',
    };
  }

  // Weighted mean — each prior year weighted 0.6× the next more recent.
  const weights = sorted.map((_, i) => Math.pow(0.6, i));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedMean =
    sorted.reduce((acc, r, i) => acc + r.cutoff_score * weights[i], 0) / totalWeight;

  const mean = sorted.reduce((a, r) => a + r.cutoff_score, 0) / sorted.length;
  const variance =
    sorted.reduce((a, r) => a + (r.cutoff_score - mean) ** 2, 0) / sorted.length;
  // Sigma floor of 4 score points (~1% of max) prevents over-confident calls
  // on a flat history; cap the relative noise at 5% of the projection too.
  const sigma = Math.max(Math.sqrt(variance), weightedMean * 0.05, 4);

  const newest = sorted[0];
  const oldest = sorted[sorted.length - 1];
  const span = newest.year - oldest.year;
  const slope = span > 0 ? (newest.cutoff_score - oldest.cutoff_score) / span : 0;
  const projected = weightedMean + slope;

  const cv = sigma / Math.max(weightedMean, 1);
  let confidence: BitsatConfidence;
  let reason: string;
  if (sorted.length >= 3 && cv < 0.06) {
    confidence = 'high';
    reason = `${sorted.length} years of stable data`;
  } else if (sorted.length >= 2 && cv < 0.12) {
    confidence = 'medium';
    reason = `${sorted.length} years of data, moderate volatility`;
  } else {
    confidence = 'low';
    reason = sorted.length < 3 ? `Only ${sorted.length} years of data` : 'High volatility in cutoffs';
  }

  return { projected, sigma, confidence, confidence_reason: reason };
}

// ── Bucket classification ──────────────────────────────────────────────────────
// BITSAT is score-based: the candidate is admitted when their score ≥ cutoff.
// That flips the sign vs JoSAA (where rank ≤ closing rank). z is "how many σ
// the user's score is ABOVE the projected cutoff."
function classify(
  userScore: number,
  projected: number,
  sigma: number,
  historicalScores?: number[],
): { bucket: BitsatBucket; probability: number } {
  // Hard "Safe" override: if the user's score is at or above the HIGHEST
  // historical closing score, they would have made it in every year for which
  // we have data. Mirror of the JoSAA predictor's min-rank override.
  if (historicalScores && historicalScores.length > 0) {
    const maxHistorical = Math.max(...historicalScores);
    if (userScore >= maxHistorical) {
      return { bucket: 'safe', probability: 99 };
    }
  }

  const z = (userScore - projected) / sigma;

  let bucket: BitsatBucket;
  if (z > 1) bucket = 'safe';
  else if (z >= -1) bucket = 'target';
  else if (z >= -2) bucket = 'reach';
  else bucket = 'unlikely';

  const probability = Math.round(normalCDF(z) * 100);
  return { bucket, probability: Math.max(0, Math.min(100, probability)) };
}

// Abramowitz & Stegun 7.1.26 — standard normal CDF approximation.
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-(z * z) / 2);
  const p = d * t * ((((1.330274 * t - 1.821256) * t + 1.781478) * t - 0.356538) * t + 0.3193815);
  return z > 0 ? 1 - p : p;
}

// ── Main predictor ─────────────────────────────────────────────────────────────
export async function predictBitsat(
  input: BitsatPredictorInput,
  options: { limit?: number; yearsBack?: number; asOfYear?: number } = {},
): Promise<BitsatPredictorResult[]> {
  await connectDB();

  const regime: BitsatRegime = input.regime ?? 'modern';
  const maxScore = REGIME_MAX_SCORE[regime];
  const yearsBack = options.yearsBack ?? 5;

  // Validate score range. We don't throw on out-of-range — the route already
  // does Zod validation; this is a defense-in-depth clamp so a stale client
  // doesn't trigger absurd projections.
  const userScore = Math.max(0, Math.min(maxScore, input.score));

  // `asOfYear` lets the backtest pretend the current year is some past year.
  // When set, only data from STRICTLY prior years is used — `asOfYear` is the
  // year being predicted, not part of the training window. In normal use it's
  // undefined and we use today's calendar year.
  const cutoffYear = options.asOfYear ?? new Date().getFullYear();
  const minYear = cutoffYear - yearsBack;

  const filter: Record<string, unknown> = {
    max_score: maxScore,
    year: { $gte: minYear, $lt: cutoffYear },
  };
  if (input.campuses && input.campuses.length > 0) {
    const validNames = input.campuses
      .map((id) => BITSAT_CAMPUSES.find((c: BitsatCampusInfo) => c.id === id)?.name)
      .filter((n): n is BitsatCampusInfo['name'] => !!n);
    if (validNames.length === 0) return [];
    filter.campus = { $in: validNames };
  }
  if (input.programmes && input.programmes.length > 0) {
    filter.programme_code = { $in: input.programmes };
  }

  const rows = await BitsatCutoff.find(filter).lean();
  if (rows.length === 0) return [];

  // Group by (campus, programme_code).
  type Bucket = { rows: { year: number; cutoff_score: number }[]; campus: BitsatCampusInfo['name']; code: BitsatProgrammeCode };
  const grouped = new Map<string, Bucket>();
  for (const r of rows) {
    const key = `${r.campus}::${r.programme_code}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        rows: [],
        campus: r.campus as BitsatCampusInfo['name'],
        code: r.programme_code as BitsatProgrammeCode,
      });
    }
    grouped.get(key)!.rows.push({ year: r.year, cutoff_score: r.cutoff_score });
  }

  const includeUnlikely = input.include_unlikely === true;
  const results: BitsatPredictorResult[] = [];

  for (const [, g] of grouped) {
    const campusInfo = BITSAT_CAMPUSES.find((c: BitsatCampusInfo) => c.name === g.campus);
    const programmeInfo = BITSAT_PROGRAMME_BY_CODE[g.code];
    if (!campusInfo || !programmeInfo) continue;

    const proj = project(g.rows);
    const cls = classify(userScore, proj.projected, proj.sigma, g.rows.map((r) => r.cutoff_score));
    if (cls.bucket === 'unlikely' && !includeUnlikely) continue;

    results.push({
      campus_id: campusInfo.id,
      campus_name: campusInfo.name,
      campus_state: campusInfo.state,
      campus_region: campusInfo.region,
      nirf_rank_engineering: campusInfo.nirf_rank_engineering,

      programme_code: g.code,
      programme_short_name: programmeInfo.short_name,
      programme_name: programmeInfo.display_name,
      degree_type: programmeInfo.degree_type,

      bucket: cls.bucket,
      probability_pct: cls.probability,
      projected_cutoff_score: Math.round(proj.projected),
      historical: g.rows.sort((a, b) => a.year - b.year),

      confidence: proj.confidence,
      confidence_reason: proj.confidence_reason,
      regime,
      max_score: maxScore,
    });
  }

  // Sort: safer buckets first, then by demand tier (elite first), then by
  // projected cutoff (highest cutoff = most prestigious within tier).
  const bucketOrder: Record<BitsatBucket, number> = { safe: 0, target: 1, reach: 2, unlikely: 3 };
  results.sort((a, b) => {
    const d = bucketOrder[a.bucket] - bucketOrder[b.bucket];
    if (d !== 0) return d;
    const tierA = BITSAT_PROGRAMME_BY_CODE[a.programme_code].demand_tier;
    const tierB = BITSAT_PROGRAMME_BY_CODE[b.programme_code].demand_tier;
    if (tierA !== tierB) return tierA - tierB;
    return b.projected_cutoff_score - a.projected_cutoff_score;
  });

  return options.limit ? results.slice(0, options.limit) : results;
}
