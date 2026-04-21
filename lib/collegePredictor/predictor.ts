// ============================================
// College Predictor — pure prediction engine.
//
// Given a user's CRL rank + category + gender + home state, returns a
// probability-ranked list of (college, branch) options drawn from five years
// of JoSAA final-round cutoffs.
//
// Algorithm (documented in CLAUDE.md discussion):
//  1. For each (college, branch), pick the matching quota:
//       NIT + home_state match → HS
//       NIT + home_state mismatch → OS
//       IIIT / GFTI → AI
//  2. Pull 5 years of final-round closing ranks for (category, gender, quota).
//  3. Compute weighted mean (recent years weighted higher) + linear trend
//     projection + sigma (std dev with a 5% floor).
//  4. Classify user rank into Safe / Target / Reach / Unlikely by z-score vs sigma.
//  5. Attach a confidence tag (high / medium / low) based on years of data
//     and coefficient of variation.
//
// This function is DB-aware (calls connectDB + Mongoose) but otherwise stateless.
// ============================================

import connectDB from '@/lib/mongodb';
import { College } from '@/lib/models/College';
import { CollegeCutoff, type CutoffCategory, type CutoffGender, type CutoffQuota } from '@/lib/models/CollegeCutoff';

export type Bucket = 'safe' | 'target' | 'reach' | 'unlikely';
export type Confidence = 'high' | 'medium' | 'low';

export interface PredictorInput {
  rank: number;                   // CRL rank (convert from percentile first)
  category: CutoffCategory;
  gender: CutoffGender;
  home_state: string;             // exact state name, matched against College.state
  year?: number;                  // target admission year (defaults to current)
  include_unlikely?: boolean;     // hide unlikely bucket by default
}

export interface PredictorResult {
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;

  branch_short_name: string;
  branch_name: string;

  bucket: Bucket;
  probability_pct: number;
  projected_closing_rank: number;
  historical: { year: number; closing_rank: number }[];

  // Round-1 signal (supplementary, not used for bucketing). Where R1 closes
  // much tighter than the final round, the seat leans on late-round churn —
  // students ranking late in their choice list should note the spread.
  r1_projected_closing_rank?: number;
  r1_historical?: { year: number; closing_rank: number }[];

  // Round-3 signal. Used together with R1 and final to label the round by
  // which the user is most likely to be allotted this seat.
  r3_projected_closing_rank?: number;
  r3_historical?: { year: number; closing_rank: number }[];

  // Earliest round whose projected closing rank is ≥ the user's rank.
  // 'R1' = likely allotted on day one; 'R3' = mid-counseling; 'Final' = only
  // after upgrades/drops. Undefined when no round data clears the user's rank.
  expected_allotment_round?: 'R1' | 'R3' | 'Final';

  confidence: Confidence;
  confidence_reason: string;
  quota_matched: CutoffQuota;
}

// ── Quota selection ────────────────────────────────────────────────────────────
// Two NITs break the usual HS/OS pattern:
//   NIT Srinagar — uses JK (J&K residents) and LA (Ladakh residents) instead
//                  of HS; everyone else is OS. There's no HS pool here.
//   NIT Goa     — Goa residents can claim the GO state-specific quota (larger
//                 seat pool than HS); non-Goa students are OS.
// The audit flagged that ignoring these means J&K / Ladakh / Goa students
// never see their reserved seats.
function relevantQuotas(
  collegeId: string,
  collegeType: 'NIT' | 'IIIT' | 'GFTI' | 'IIT',
  collegeState: string,
  userHomeState: string,
): CutoffQuota[] {
  const user = userHomeState.trim().toLowerCase();
  const isHome = user === collegeState.trim().toLowerCase();

  if (collegeType === 'NIT') {
    if (collegeId === 'nit-srinagar') {
      if (user === 'jammu and kashmir') return ['JK', 'OS'];
      if (user === 'ladakh') return ['LA', 'OS'];
      return ['OS'];
    }
    if (collegeId === 'nit-goa') {
      if (user === 'goa') return ['GO', 'HS', 'OS'];
      return ['OS'];
    }
    return isHome ? ['HS', 'OS'] : ['OS'];
  }
  return ['AI'];
}

// ── Projection model ───────────────────────────────────────────────────────────
interface Projection {
  projected: number;
  sigma: number;
  confidence: Confidence;
  confidence_reason: string;
}

function project(historical: { year: number; closing_rank: number }[]): Projection {
  const sorted = [...historical].sort((a, b) => b.year - a.year); // newest first

  if (sorted.length === 1) {
    const r = sorted[0].closing_rank;
    return {
      projected: r,
      sigma: Math.max(r * 0.15, 50),
      confidence: 'low',
      confidence_reason: 'Only 1 year of data',
    };
  }

  // Weighted mean — each prior year weighted 0.6× the next more recent.
  const weights = sorted.map((_, i) => Math.pow(0.6, i));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedMean =
    sorted.reduce((acc, r, i) => acc + r.closing_rank * weights[i], 0) / totalWeight;

  // Unweighted variance for sigma.
  const mean = sorted.reduce((a, r) => a + r.closing_rank, 0) / sorted.length;
  const variance =
    sorted.reduce((a, r) => a + (r.closing_rank - mean) ** 2, 0) / sorted.length;
  const sigma = Math.max(Math.sqrt(variance), weightedMean * 0.05, 50);

  // Linear slope between oldest and newest year, projected one year forward.
  const newest = sorted[0];
  const oldest = sorted[sorted.length - 1];
  const span = newest.year - oldest.year;
  const slope = span > 0 ? (newest.closing_rank - oldest.closing_rank) / span : 0;
  const projected = weightedMean + slope;

  const cv = sigma / Math.max(weightedMean, 1);
  let confidence: Confidence;
  let reason: string;
  if (sorted.length >= 3 && cv < 0.2) {
    confidence = 'high';
    reason = `${sorted.length} years of stable data`;
  } else if (sorted.length >= 2 && cv < 0.4) {
    confidence = 'medium';
    reason = `${sorted.length} years of data, moderate volatility`;
  } else {
    confidence = 'low';
    reason = sorted.length < 3
      ? `Only ${sorted.length} years of data`
      : 'High volatility in cutoffs';
  }

  return { projected, sigma, confidence, confidence_reason: reason };
}

// ── Bucket classification ──────────────────────────────────────────────────────
function classify(userRank: number, projected: number, sigma: number): {
  bucket: Bucket;
  probability: number;
} {
  // Admission: lower rank is better. The student gets in if their rank ≤ closing rank.
  // z = how many σ below (or above) the projected closing the user's rank sits.
  const z = (projected - userRank) / sigma;

  let bucket: Bucket;
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
  const p =
    d * t * ((((1.330274 * t - 1.821256) * t + 1.781478) * t - 0.356538) * t + 0.3193815);
  return z > 0 ? 1 - p : p;
}

// ── Main entry ─────────────────────────────────────────────────────────────────
export async function predictColleges(
  input: PredictorInput,
  options: { limit?: number } = {},
): Promise<PredictorResult[]> {
  await connectDB();

  const targetYear = input.year ?? new Date().getFullYear();
  const minYear = targetYear - 5;

  const [cutoffs, r1Cutoffs, r3Cutoffs, colleges] = await Promise.all([
    CollegeCutoff.find({
      category: input.category,
      gender: input.gender,
      is_final_round: true,
      year: { $gte: minYear, $lt: targetYear },
    }).lean(),
    CollegeCutoff.find({
      category: input.category,
      gender: input.gender,
      round: 1,
      year: { $gte: minYear, $lt: targetYear },
    }).lean(),
    CollegeCutoff.find({
      category: input.category,
      gender: input.gender,
      round: 3,
      year: { $gte: minYear, $lt: targetYear },
    }).lean(),
    College.find({ is_active: true }).lean(),
  ]);

  if (cutoffs.length === 0) {
    return [];
  }

  // Group: college_id → branch_short_name → quota → rows[]
  type Row = { year: number; closing_rank: number; branch_name: string };
  const byCollege = new Map<string, Map<string, Map<CutoffQuota, Row[]>>>();
  for (const c of cutoffs) {
    if (!byCollege.has(c.college_id)) byCollege.set(c.college_id, new Map());
    const byBranch = byCollege.get(c.college_id)!;
    if (!byBranch.has(c.branch_short_name)) byBranch.set(c.branch_short_name, new Map());
    const byQuota = byBranch.get(c.branch_short_name)!;
    if (!byQuota.has(c.quota as CutoffQuota)) byQuota.set(c.quota as CutoffQuota, []);
    byQuota.get(c.quota as CutoffQuota)!.push({
      year: c.year,
      closing_rank: c.closing_rank,
      branch_name: c.branch_name,
    });
  }

  // Same grouping for R1 rows (supplementary signal, not used for bucketing).
  const r1ByCollege = new Map<string, Map<string, Map<CutoffQuota, Row[]>>>();
  for (const c of r1Cutoffs) {
    if (!r1ByCollege.has(c.college_id)) r1ByCollege.set(c.college_id, new Map());
    const byBranch = r1ByCollege.get(c.college_id)!;
    if (!byBranch.has(c.branch_short_name)) byBranch.set(c.branch_short_name, new Map());
    const byQuota = byBranch.get(c.branch_short_name)!;
    if (!byQuota.has(c.quota as CutoffQuota)) byQuota.set(c.quota as CutoffQuota, []);
    byQuota.get(c.quota as CutoffQuota)!.push({
      year: c.year,
      closing_rank: c.closing_rank,
      branch_name: c.branch_name,
    });
  }

  // And for R3.
  const r3ByCollege = new Map<string, Map<string, Map<CutoffQuota, Row[]>>>();
  for (const c of r3Cutoffs) {
    if (!r3ByCollege.has(c.college_id)) r3ByCollege.set(c.college_id, new Map());
    const byBranch = r3ByCollege.get(c.college_id)!;
    if (!byBranch.has(c.branch_short_name)) byBranch.set(c.branch_short_name, new Map());
    const byQuota = byBranch.get(c.branch_short_name)!;
    if (!byQuota.has(c.quota as CutoffQuota)) byQuota.set(c.quota as CutoffQuota, []);
    byQuota.get(c.quota as CutoffQuota)!.push({
      year: c.year,
      closing_rank: c.closing_rank,
      branch_name: c.branch_name,
    });
  }

  const results: PredictorResult[] = [];
  const includeUnlikely = input.include_unlikely === true;

  for (const college of colleges) {
    const branches = byCollege.get(college._id);
    if (!branches) continue;

    const quotas = relevantQuotas(college._id, college.type, college.state, input.home_state);

    for (const [branchShort, byQuota] of branches) {
      // Pick the first matching quota that has data.
      let rows: Row[] | undefined;
      let matchedQuota: CutoffQuota | undefined;
      for (const q of quotas) {
        if (byQuota.has(q) && byQuota.get(q)!.length > 0) {
          rows = byQuota.get(q)!;
          matchedQuota = q;
          break;
        }
      }
      if (!rows || !matchedQuota) continue;

      const proj = project(rows.map((r) => ({ year: r.year, closing_rank: r.closing_rank })));
      const cls = classify(input.rank, proj.projected, proj.sigma);
      if (cls.bucket === 'unlikely' && !includeUnlikely) continue;

      // Look up same (college, branch, matched-quota) in R1 data.
      const r1Rows = r1ByCollege.get(college._id)?.get(branchShort)?.get(matchedQuota);
      let r1Projected: number | undefined;
      let r1Historical: { year: number; closing_rank: number }[] | undefined;
      if (r1Rows && r1Rows.length > 0) {
        const r1Proj = project(r1Rows.map((r) => ({ year: r.year, closing_rank: r.closing_rank })));
        r1Projected = Math.round(r1Proj.projected);
        r1Historical = r1Rows
          .map((r) => ({ year: r.year, closing_rank: r.closing_rank }))
          .sort((a, b) => a.year - b.year);
      }

      // R3 lookup + projection (mirror of R1).
      const r3Rows = r3ByCollege.get(college._id)?.get(branchShort)?.get(matchedQuota);
      let r3Projected: number | undefined;
      let r3Historical: { year: number; closing_rank: number }[] | undefined;
      if (r3Rows && r3Rows.length > 0) {
        const r3Proj = project(r3Rows.map((r) => ({ year: r.year, closing_rank: r.closing_rank })));
        r3Projected = Math.round(r3Proj.projected);
        r3Historical = r3Rows
          .map((r) => ({ year: r.year, closing_rank: r.closing_rank }))
          .sort((a, b) => a.year - b.year);
      }

      // Earliest round that admits this user: whichever projected closing rank
      // is the first to be ≥ user rank. Lower closing rank is tighter.
      let expectedRound: 'R1' | 'R3' | 'Final' | undefined;
      if (r1Projected !== undefined && input.rank <= r1Projected) {
        expectedRound = 'R1';
      } else if (r3Projected !== undefined && input.rank <= r3Projected) {
        expectedRound = 'R3';
      } else if (input.rank <= proj.projected) {
        expectedRound = 'Final';
      }

      results.push({
        college_id: college._id,
        college_short_name: college.short_name,
        college_type: college.type,
        college_state: college.state,
        college_region: college.region,
        nirf_rank_engineering: college.nirf_rank_engineering,
        branch_short_name: branchShort,
        branch_name: rows[0].branch_name,
        bucket: cls.bucket,
        probability_pct: cls.probability,
        projected_closing_rank: Math.round(proj.projected),
        historical: rows
          .map((r) => ({ year: r.year, closing_rank: r.closing_rank }))
          .sort((a, b) => a.year - b.year),
        r1_projected_closing_rank: r1Projected,
        r1_historical: r1Historical,
        r3_projected_closing_rank: r3Projected,
        r3_historical: r3Historical,
        expected_allotment_round: expectedRound,
        confidence: proj.confidence,
        confidence_reason: proj.confidence_reason,
        quota_matched: matchedQuota,
      });
    }
  }

  const bucketOrder: Record<Bucket, number> = { safe: 0, target: 1, reach: 2, unlikely: 3 };
  results.sort((a, b) => {
    const d = bucketOrder[a.bucket] - bucketOrder[b.bucket];
    if (d !== 0) return d;
    // Within a bucket: NIRF rank ascending (best colleges first), then by projected rank.
    const nirfA = a.nirf_rank_engineering ?? 9999;
    const nirfB = b.nirf_rank_engineering ?? 9999;
    if (nirfA !== nirfB) return nirfA - nirfB;
    return a.projected_closing_rank - b.projected_closing_rank;
  });

  return options.limit ? results.slice(0, options.limit) : results;
}
