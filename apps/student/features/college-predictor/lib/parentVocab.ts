// Shared parent-friendly vocabulary. Used by both predictors' parent-mode
// cards and by the WhatsApp share-card renderer.
//
// Rules:
// - No jargon (no "z-score", "sigma", "confidence", "projected close").
// - No bucket internal names ("safe", "target", "reach") in the visible text.
// - One short verdict (≤ 4 words) suitable for a parent who has never seen
//   the predictor before.
// - A one-sentence "what this means" follow-up, written so a tier-2 parent
//   reading on a phone gets the gist in <5 seconds.

export type Bucket = 'safe' | 'target' | 'reach' | 'unlikely';

export interface ParentVerdict {
  /** ≤ 4-word verdict — used as a badge in cards and share images. */
  short: string;
  /** Color tone token — green / amber / blue / grey. Renderers map to their palette. */
  tone: 'green' | 'amber' | 'blue' | 'grey';
  /** One-sentence plain-English explanation. */
  explainer: string;
}

export function parentVerdict(bucket: Bucket, probability: number): ParentVerdict {
  // Probability-tier overrides for the user-facing copy. A 99 %-Safe and a
  // 60 %-Safe both bucket as "safe" but read very differently to a parent;
  // surface that with a tier label.
  switch (bucket) {
    case 'safe':
      if (probability >= 90) {
        return {
          short: 'Very strong chance',
          tone: 'green',
          explainer: 'Past years suggest this admission is nearly guaranteed at this score.',
        };
      }
      return {
        short: 'Strong chance',
        tone: 'green',
        explainer: 'Past years suggest this admission is comfortably within reach.',
      };
    case 'target':
      return {
        short: 'Likely, but not certain',
        tone: 'amber',
        explainer: 'Cutoffs hover close to this score — admission depends on the exact year.',
      };
    case 'reach':
      return {
        short: 'Worth trying',
        tone: 'blue',
        explainer: 'Past cutoffs were higher, but only by a few marks — a soft year could open it.',
      };
    case 'unlikely':
      return {
        short: 'Long shot',
        tone: 'grey',
        explainer: 'Past cutoffs were well above this score; admission would need a much softer year.',
      };
  }
}

// Compact one-line summary across a list of buckets, e.g. "12 strong · 4 borderline · 3 worth trying".
export function parentSummary(counts: Partial<Record<Bucket, number>>): string {
  const parts: string[] = [];
  if (counts.safe && counts.safe > 0) parts.push(`${counts.safe} likely`);
  if (counts.target && counts.target > 0) parts.push(`${counts.target} borderline`);
  if (counts.reach && counts.reach > 0) parts.push(`${counts.reach} worth trying`);
  return parts.length > 0 ? parts.join(' · ') : 'No matches yet';
}
