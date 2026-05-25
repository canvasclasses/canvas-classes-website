import 'server-only';

// ============================================
// Expected click-through rate per SERP position.
//
// Values are a blended average across multiple industry studies (Advanced
// Web Ranking 2024, FirstPageSage 2024, Sistrix 2023) for non-branded
// informational queries on mobile. These intentionally avoid the inflated
// position-1 numbers that branded-query studies report (often 40-50%) —
// they'd produce false "underperformance" signals for our long-tail content.
//
// Used by insights.ts to flag pages/queries getting fewer clicks than the
// position math would predict (= title/description fix opportunity).
// ============================================

const CTR_BY_POSITION: ReadonlyArray<readonly [number, number]> = [
  [1,   0.275],
  [2,   0.155],
  [3,   0.110],
  [4,   0.080],
  [5,   0.063],
  [6,   0.050],
  [7,   0.040],
  [8,   0.033],
  [9,   0.028],
  [10,  0.025],
  [12,  0.018],
  [15,  0.012],
  [20,  0.007],
  [30,  0.003],
  [50,  0.001],
];

/**
 * Linearly interpolated expected CTR for a given (possibly fractional) avg
 * position. Returns 0 for positions > 50.
 */
export function expectedCtr(position: number): number {
  if (!Number.isFinite(position) || position < 1) return CTR_BY_POSITION[0][1];
  const last = CTR_BY_POSITION[CTR_BY_POSITION.length - 1];
  if (position >= last[0]) return last[1];

  for (let i = 0; i < CTR_BY_POSITION.length - 1; i++) {
    const [p0, c0] = CTR_BY_POSITION[i];
    const [p1, c1] = CTR_BY_POSITION[i + 1];
    if (position >= p0 && position <= p1) {
      const t = (position - p0) / (p1 - p0);
      return c0 + (c1 - c0) * t;
    }
  }
  return 0;
}

/**
 * CTR for "top 3" — used to compute the upside if a striking-distance query
 * could be pushed from position N to a top-3 ranking.
 */
export function top3Ctr(): number {
  return (CTR_BY_POSITION[0][1] + CTR_BY_POSITION[1][1] + CTR_BY_POSITION[2][1]) / 3;
}
