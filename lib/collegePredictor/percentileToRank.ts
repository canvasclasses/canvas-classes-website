// ============================================
// JEE Main Percentile → Rank conversion (category-aware).
//
// Why category matters:
//   JoSAA cutoffs for non-OPEN categories are published as **Category Rank**
//   (CR), not CRL. An OBC-NCL closing rank of 369 at NIT Trichy CSE means
//   "OBC category rank 369", which corresponds to a much later CRL.
//   The validation harness flagged this directly: at CRL=50,000, OPEN saw 181
//   Safe seats while OBC/SC/ST saw 0–7 across 100+ colleges — a unit
//   mismatch, not data scarcity.
//
// JEE Main scorecards publish two percentiles for reserved candidates:
//     · Total Percentile          (across all test-takers)
//     · Category Percentile        (within the candidate's category pool)
// And two ranks once the rank list drops:
//     · CRL                        (Common Rank List)
//     · Category Rank              (within the category pool)
//
// For the predictor to give meaningful results, reserved candidates must be
// matched against their CATEGORY rank/percentile — not CRL/total percentile.
//
// CATEGORY_CANDIDATE_SHARE approximates how the JEE Main test-taker pool
// breaks down by category. Numbers are conservative (slightly inflated vs
// JoSAA seat-reservation %) so we don't *over*-estimate reach. The predictor
// already surfaces uncertainty via Safe/Target/Reach buckets, which absorb
// ±20% approximation error without misclassifying the bucket boundary.
//
// Update TOTAL_CANDIDATES yearly after NTA publishes the final count.
// ============================================

import type { CutoffCategory } from '../models/CollegeCutoff';

// Total JEE Main candidates appearing (both sessions combined, unique).
// Source: NTA Session 1 + Session 2 press releases.
// Update each year: NTA publishes Session 1 numbers in mid-Feb and Session 2
// in late April; the unique-across-sessions total is in the Session 2 release.
const TOTAL_CANDIDATES_BY_YEAR: Record<number, number> = {
  2024: 1423000, // ~14.23 lakh unique candidates
  2025: 1475103, // NTA: 14,75,103 unique across both sessions
  2026: 1538468, // NTA Session 2 release (Apr 20, 2026): 15,38,468 unique
                 //   across both sessions. Session 1 alone had 13,04,653;
                 //   Session 2 had 10,34,330; the rest is overlap-adjusted.
};

const DEFAULT_TOTAL = 1538468;

// ── Category share table ──────────────────────────────────────────────────────
// Fraction of JEE Main test-takers in each category. NTA publishes this
// breakdown in the Session 1 press release every February (alongside Session 1
// results). Session 2 has a similar distribution; we use Session 1 because
// it's the larger sample and is published first.
//
// Authoritative source for 2026 numbers (Session 1, NTA press release Feb 16):
//   General : 4,52,825 → 0.347
//   Gen-EWS : 1,60,958 → 0.123
//   OBC-NCL : 5,17,336 → 0.397
//   SC      : 1,29,902 → 0.100
//   ST      :   43,632 → 0.033
//   Total   : 13,04,653
//
// Authoritative source for 2025 numbers (Session 1, NTA):
//   General : 4,66,358 → 0.371
//   Gen-EWS : 1,38,699 → 0.110
//   OBC-NCL : 4,90,275 → 0.390
//   SC      : 1,22,845 → 0.098
//   ST      :   39,959 → 0.032
//   Total   : 12,58,136
//
// Notes:
//   · OPEN's share is 1.00 because the JoSAA OPEN cutoff list (CRL) includes
//     ALL candidates — every reserved-category candidate also competes for
//     OPEN seats. So when a user picks category=OPEN, we map percentile to
//     CRL using the full test-taker pool.
//   · For reserved categories, the JoSAA closing rank is a CATEGORY rank —
//     i.e., position within just that category's pool. So the relevant pool
//     size is `total × share[category]`.
//   · PwD variants inherit the parent category's share — PwD is a sub-cut
//     within each category, not a separate pool for percentile purposes.
//
// To update yearly: pull NTA's Session 1 press release in mid-February (it's
// usually the first numerical PDF posted at jeemain.nta.nic.in), divide each
// category's appeared-count by the total, and add a new column below.
type CategoryShareTable = Partial<Record<CutoffCategory, number>>;
const CATEGORY_CANDIDATE_SHARE_BY_YEAR: Record<number, CategoryShareTable> = {
  2025: {
    'OPEN':           1.00,
    'OBC-NCL':        0.390,
    'SC':             0.098,
    'ST':             0.032,
    'EWS':            0.110,
  },
  2026: {
    'OPEN':           1.00,
    'OBC-NCL':        0.397,
    'SC':             0.100,
    'ST':             0.033,
    'EWS':            0.123,
  },
};

// Latest year we have authoritative data for. Used as the fallback when the
// caller's year is unrecognised.
const LATEST_SHARE_YEAR = 2026;

function shareFor(year: number, category: CutoffCategory): number {
  const table = CATEGORY_CANDIDATE_SHARE_BY_YEAR[year]
    ?? CATEGORY_CANDIDATE_SHARE_BY_YEAR[LATEST_SHARE_YEAR];
  // PwD variants inherit the parent share.
  const parent = category.replace(' (PwD)', '') as CutoffCategory;
  return table[parent] ?? table['OPEN'] ?? 1.00;
}

/**
 * Convert a percentile to the appropriate rank for the user's category.
 *
 * For OPEN: total percentile → CRL.
 * For reserved categories: category percentile → category rank.
 *
 * If callers don't know the category, they can omit it — we fall back to CRL,
 * preserving the old behavior so no caller breaks during the rollout.
 */
export function percentileToRank(
  percentile: number,
  year = new Date().getFullYear(),
  category: CutoffCategory = 'OPEN',
): number {
  if (percentile < 0 || percentile > 100) {
    throw new Error(`Percentile out of range: ${percentile}`);
  }
  const total = TOTAL_CANDIDATES_BY_YEAR[year] ?? DEFAULT_TOTAL;
  const pool = total * shareFor(year, category);
  // Rank 1 = top candidate; percentile 100 ~ rank 1.
  return Math.max(1, Math.round((100 - percentile) / 100 * pool));
}

export function rankToPercentile(
  rank: number,
  year = new Date().getFullYear(),
  category: CutoffCategory = 'OPEN',
): number {
  const total = TOTAL_CANDIDATES_BY_YEAR[year] ?? DEFAULT_TOTAL;
  const pool = total * shareFor(year, category);
  if (rank < 1) return 100;
  return Math.max(0, Math.min(100, 100 - (rank / pool) * 100));
}
