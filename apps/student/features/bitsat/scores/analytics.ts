// ============================================================================
// BITSAT score analytics — PURE aggregation over a list of raw scores.
//
// No I/O, no Next, no Mongo — safe to unit-test in isolation. The third-party
// scores API returns raw individual scores (see ./source.ts); this turns that
// array into the aggregates the /bitsat Analytics tab renders. We never expose
// the raw individual rows to the client — only these aggregates.
// ============================================================================

export interface ScoreHistogramBucket {
  label: string;   // e.g. "300–319"
  from: number;    // inclusive
  to: number;      // inclusive
  count: number;
}

export interface ScoreAnalytics {
  count: number;
  mean: number;        // rounded to 1 decimal
  median: number;
  min: number;
  max: number;
  p25: number;         // lower quartile
  p75: number;         // upper quartile
  p90: number;
  p95: number;
  maxScore: number;    // the paper's max (390 modern / 450 legacy)
  bucketSize: number;
  histogram: ScoreHistogramBucket[];
}

// Minimal record shape these helpers need (structurally matches the adapter's
// ScorecardRecord) — declared locally so analytics.ts stays pure / import-free.
export interface ScorecardLike {
  final_score: number;
  s1_score: number | null;
  s2_score: number | null;
  branch_allotted: string | null;
}

export interface BranchAllotmentCount {
  branch: string;
  count: number;
}

export interface SessionStats {
  bothCount: number;     // candidates who took both sessions
  improvedInS2: number;  // of those, how many scored higher in S2
  avgUplift: number;     // average S2−S1 among those who improved
  avgS1: number;
  avgS2: number;
}

/** Counts by allotted branch, highest first (capped to topN). */
export function computeBranchBreakdown(records: ScorecardLike[], topN = 10): BranchAllotmentCount[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const b = (r.branch_allotted ?? '').trim();
    if (!b) continue;
    map.set(b, (map.get(b) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([branch, count]) => ({ branch, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/** Session-1 vs Session-2 uplift among candidates who attempted both. */
export function computeSessionStats(records: ScorecardLike[]): SessionStats | null {
  const both = records.filter(
    (r) => r.s1_score != null && r.s1_score > 0 && r.s2_score != null && r.s2_score > 0,
  );
  if (both.length === 0) return null;

  let improved = 0;
  let upliftSum = 0;
  let s1Sum = 0;
  let s2Sum = 0;
  for (const r of both) {
    const d = r.s2_score! - r.s1_score!;
    if (d > 0) {
      improved += 1;
      upliftSum += d;
    }
    s1Sum += r.s1_score!;
    s2Sum += r.s2_score!;
  }
  return {
    bothCount: both.length,
    improvedInS2: improved,
    avgUplift: improved > 0 ? Math.round(upliftSum / improved) : 0,
    avgS1: Math.round(s1Sum / both.length),
    avgS2: Math.round(s2Sum / both.length),
  };
}

/** Nearest-rank percentile (p in 0..100) over an already-sorted ascending array. */
function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  if (sortedAsc.length === 1) return sortedAsc[0];
  const rank = Math.ceil((p / 100) * sortedAsc.length);
  const idx = Math.min(sortedAsc.length - 1, Math.max(0, rank - 1));
  return sortedAsc[idx];
}

/**
 * Aggregate raw BITSAT scores into the analytics payload for the page.
 *
 * @param scores   raw individual scores (any order); out-of-range values are
 *                 clamped into [0, maxScore] defensively.
 * @param maxScore paper max (default 390 — the modern 2022+ paper).
 * @param bucketSize histogram band width in marks (default 20).
 */
export function computeScoreAnalytics(
  scores: number[],
  maxScore = 390,
  bucketSize = 20,
): ScoreAnalytics {
  const clean = scores
    .filter((s) => typeof s === 'number' && Number.isFinite(s))
    .map((s) => Math.max(0, Math.min(maxScore, Math.round(s))));

  // Always build the empty histogram skeleton so the chart renders consistently.
  const buckets: ScoreHistogramBucket[] = [];
  for (let from = 0; from <= maxScore; from += bucketSize) {
    const to = Math.min(from + bucketSize - 1, maxScore);
    buckets.push({ label: `${from}–${to}`, from, to, count: 0 });
    if (to === maxScore) break;
  }

  if (clean.length === 0) {
    return {
      count: 0, mean: 0, median: 0, min: 0, max: 0, p25: 0, p75: 0, p90: 0, p95: 0,
      maxScore, bucketSize, histogram: buckets,
    };
  }

  const sorted = [...clean].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);

  for (const s of clean) {
    const idx = Math.min(buckets.length - 1, Math.floor(s / bucketSize));
    buckets[idx].count += 1;
  }

  return {
    count: sorted.length,
    mean: Math.round((sum / sorted.length) * 10) / 10,
    median: percentile(sorted, 50),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    p25: percentile(sorted, 25),
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
    p95: percentile(sorted, 95),
    maxScore,
    bucketSize,
    histogram: buckets,
  };
}
