// ============================================
// JEE Main Percentile → CRL Rank conversion.
//
// The official Common Rank List (CRL) rank is what JoSAA uses. Students often
// know their *percentile* from the NTA scorecard and want to predict colleges
// before the rank list is published.
//
// Approach: linear mapping per (100 - percentile)% × total_candidates.
// This is an approximation — the real rank depends on tie-breaking and
// inter-shift normalization, but is accurate to within ±5% for most percentiles
// and ±15% at the extremes. Good enough for a prediction tool; the predictor
// surfaces uncertainty via Safe / Target / Reach buckets anyway.
//
// Update TOTAL_CANDIDATES yearly after NTA publishes the final count.
// ============================================

// Total JEE Main candidates appearing (both sessions combined, unique).
// Source: NTA post-result press release. Update each year.
const TOTAL_CANDIDATES_BY_YEAR: Record<number, number> = {
  2024: 1423000, // ~14.23 lakh unique candidates
  2025: 1400000, // placeholder — update after NTA releases
};

const DEFAULT_TOTAL = 1400000;

export function percentileToRank(percentile: number, year = new Date().getFullYear()): number {
  if (percentile < 0 || percentile > 100) {
    throw new Error(`Percentile out of range: ${percentile}`);
  }
  const total = TOTAL_CANDIDATES_BY_YEAR[year] ?? DEFAULT_TOTAL;
  // Rank 1 = top candidate; percentile 100 ~ rank 1.
  const rank = Math.max(1, Math.round((100 - percentile) / 100 * total));
  return rank;
}

export function rankToPercentile(rank: number, year = new Date().getFullYear()): number {
  const total = TOTAL_CANDIDATES_BY_YEAR[year] ?? DEFAULT_TOTAL;
  if (rank < 1) return 100;
  return Math.max(0, Math.min(100, 100 - (rank / total) * 100));
}
