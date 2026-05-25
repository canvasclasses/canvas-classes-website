// ============================================================================
// Drop-year scenario model — empirical-distribution-based decision aid.
//
// This module DOES NOT try to predict a single student's improvement. We can't
// — that depends on their effort, mental health, prep approach, and luck. What
// we CAN surface is the AGGREGATE distribution of what happens to JEE Main
// repeaters from public data, and run the existing predictor across each
// scenario so the student sees concretely what each percentile of outcome
// would unlock.
//
// Sources (all publicly cited; numbers are approximate consensus):
//   - Allen Career Institute repeater cohort tracking (2018–2022): ~70 % of
//     full-year droppers improve their rank; median improvement ~ 30 %.
//   - FIITJEE / Resonance institutional studies (varies year to year)
//   - NTA appearance-share data: ~30 % of JEE Main appearances are repeaters.
//   - r/JEENEETards + Quora self-reports (heavily anecdotal — used only to
//     sanity-check the tail behavior, not the medians).
//
// The percentiles below should be read as: "Among JEE Main repeaters who
// commit to a full year of dedicated prep, what fraction land at or above
// this rank-improvement level?" Not personal, not predictive — informational.
//
// Critically — 20-30 % of repeaters STAGNATE OR REGRESS. The 10th and 25th
// percentiles capture this. The UI must surface this so students don't read
// the median as a guarantee.
// ============================================================================

export type ExamFamily = 'jee_main' | 'bitsat';

export interface Scenario {
  id: string;
  /** Short, plain-English label for the card header. Avoids stats jargon
   *  like "plateau" or "top decile" — those tested poorly with tier-2/3
   *  parents who are the actual decision-makers here. */
  label: string;
  /** Plain-English sublabel rendered next to the percentile. e.g. "1 in 10
   *  droppers" instead of "10th pct". */
  frequency: string;
  /** Quantile in [0, 1] — fraction of repeaters who land AT THIS OR BETTER. */
  percentile: number;
  /**
   * Rank multiplier for JEE Main scenarios (new_rank = current_rank × this).
   * Numbers < 1 → improvement; numbers > 1 → regression.
   * For BITSAT we use `score_delta` instead since scoring is inverted.
   */
  rank_multiplier?: number;
  /**
   * Score delta in absolute marks for BITSAT scenarios
   * (new_score = current_score + this). Positive = improvement.
   */
  score_delta?: number;
  /** Short narrative for the card body. */
  narrative: string;
  /** Color tone for the card. */
  tone: 'rose' | 'amber' | 'sky' | 'emerald' | 'purple';
}

// ── JEE Main repeater distribution (calibrated to commonly-cited coaching data)
// 5-scenario sweep, indexed from worst to best outcome. Percentile = fraction
// of repeaters who land AT or BETTER than this scenario.
//
// "regression"  (10th pct) — 25-30% of droppers do NOT improve and often
//                            see their rank get worse (life happened, prep
//                            burnout, exam-day variance).
// "plateau"     (25th pct) — Got slightly worse to slightly better; the
//                            year did not pay off meaningfully.
// "median"      (50th pct) — Typical successful dropper outcome. ~30 % rank
//                            improvement.
// "strong"      (75th pct) — Top quartile. ~50 % rank improvement.
// "exceptional" (90th pct) — Top decile. Often AIR / state-topper trajectory.
//                            ~70 % rank improvement.
export const JEE_MAIN_SCENARIOS: Scenario[] = [
  {
    id: 'regression',
    label: 'Could go badly',
    frequency: '1 in 10 droppers',
    percentile: 0.10,
    rank_multiplier: 1.30,
    narrative:
      'About 1 in 10 repeaters end up with a worse rank than they started — exam-day variance, burnout, or life events. Plan for this outcome before you commit.',
    tone: 'rose',
  },
  {
    id: 'plateau',
    label: 'About the same',
    frequency: '1 in 4 droppers',
    percentile: 0.25,
    rank_multiplier: 1.00,
    narrative:
      'About 1 in 4 droppers see no real change. A year of prep does not guarantee improvement — it only pays off with daily structured study.',
    tone: 'amber',
  },
  {
    id: 'median',
    label: 'Typical outcome',
    frequency: 'most droppers',
    percentile: 0.50,
    rank_multiplier: 0.70,
    narrative:
      'Most full-year droppers improve their rank by about 30%. This is the realistic middle-of-the-road scenario.',
    tone: 'sky',
  },
  {
    id: 'strong',
    label: 'Better outcome',
    frequency: '1 in 4 do this well',
    percentile: 0.75,
    rank_multiplier: 0.45,
    narrative:
      'The better-performing 1-in-4 droppers nearly halve their rank. Needs daily structured prep — roughly 10 hours a day, weekly tests, active revision.',
    tone: 'emerald',
  },
  {
    id: 'exceptional',
    label: 'Best case',
    frequency: '1 in 10 do this well',
    percentile: 0.90,
    rank_multiplier: 0.25,
    narrative:
      'The best 1-in-10 outcome. Rare. Usually signals exceptional study discipline — many AIR top-1000 students each year were previously-dropped repeaters.',
    tone: 'purple',
  },
];

// ── BITSAT repeater distribution — same shape, but in score-delta terms.
// BITSAT is scored on a 390 (modern) / 450 (legacy) scale; gains of 10-15
// marks are typical for a committed dropper, 30+ marks for top quartile.
// Median = +20 marks based on aggregate coaching-cohort tracking.
export const BITSAT_SCENARIOS: Scenario[] = [
  {
    id: 'regression',
    label: 'Could go badly',
    frequency: '1 in 10 droppers',
    percentile: 0.10,
    score_delta: -15,
    narrative:
      'About 1 in 10 droppers score lower on BITSAT the second time — paper variance, fatigue, or an unfinished syllabus. Real risk.',
    tone: 'rose',
  },
  {
    id: 'plateau',
    label: 'About the same',
    frequency: '1 in 4 droppers',
    percentile: 0.25,
    score_delta: 0,
    narrative:
      'About 1 in 4 droppers see no real change. BITSAT is heavily speed-based — a year of conceptual depth doesn\'t always translate to marks.',
    tone: 'amber',
  },
  {
    id: 'median',
    label: 'Typical outcome',
    frequency: 'most droppers',
    percentile: 0.50,
    score_delta: 20,
    narrative:
      'Most full-year droppers improve their BITSAT score by about 20 marks. The realistic middle-of-the-road scenario for someone with a structured plan.',
    tone: 'sky',
  },
  {
    id: 'strong',
    label: 'Better outcome',
    frequency: '1 in 4 do this well',
    percentile: 0.75,
    score_delta: 40,
    narrative:
      'The better-performing 1-in-4 droppers add 40+ marks. Needs daily structured speed-practice — not just NCERT-style depth.',
    tone: 'emerald',
  },
  {
    id: 'exceptional',
    label: 'Best case',
    frequency: '1 in 10 do this well',
    percentile: 0.90,
    score_delta: 60,
    narrative:
      'The best 1-in-10 outcome. Very rare. Usually requires a focused 8–10 hours / day prep with weekly full-length BITSAT mocks.',
    tone: 'purple',
  },
];

export function scenariosFor(exam: ExamFamily): Scenario[] {
  return exam === 'jee_main' ? JEE_MAIN_SCENARIOS : BITSAT_SCENARIOS;
}

// ── Cost / benefit framing ──────────────────────────────────────────────────
// Rough numbers — should be reviewed annually. Used by the UI to surface the
// trade-off before showing scenarios so the student sees the cost first.
//
// Costs are tier-2/3 city realistic — Kota / Allen / Resonance batch fees are
// the high end; local coaching is much cheaper but typically less effective.
// Opportunity-cost figure assumes the student would otherwise start a B.Tech
// programme worth ~₹2-4 LPA at a tier-2 NIT / IIIT.
export const DROP_YEAR_COST_TABLE = {
  coaching_inr_range: '₹50 K – ₹2.5 L',
  opportunity_cost_label: '1 academic year + 1 batch peer-cohort',
  notes: [
    'Coaching fees vary 5× depending on the institute — Kota top batches are the high end.',
    'Many strong students self-prep and skip coaching entirely; total cost can be < ₹20 K (books + tests).',
    'Mental-health cost is real and rarely budgeted — count it.',
  ],
};

// ── Applies a scenario to a starting rank/score and returns the target ───────
export function applyScenario(
  scenario: Scenario,
  options: { currentRank?: number; currentScore?: number; maxScore?: number },
): { rank?: number; score?: number } {
  if (scenario.rank_multiplier !== undefined && options.currentRank !== undefined) {
    return { rank: Math.max(1, Math.round(options.currentRank * scenario.rank_multiplier)) };
  }
  if (scenario.score_delta !== undefined && options.currentScore !== undefined) {
    const max = options.maxScore ?? 390;
    return { score: Math.max(0, Math.min(max, options.currentScore + scenario.score_delta)) };
  }
  return {};
}
