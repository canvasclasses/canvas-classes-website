// @canvas/persona/contract — the persona contract in code form.
//
// Pure read-side: constants, classifiers, threshold rules. No DB I/O, no
// mutation, no side effects. These are the rules that govern the persona
// pipeline; the writer (writer.ts) and profile updater (profile-engine.ts)
// import their thresholds from here so the rules live in exactly one place.
//
// Admin dashboards + AI training pipelines import from this file when they
// need to interpret a document the student app wrote — e.g. "what mastery
// label does this user/chapter pair earn?", "what proficiency level matches
// these counters?". If you change a threshold here, every consumer
// (student writes, admin reads, AI features) sees the new rule.
//
// CRUCIBLE_ARCHITECTURE.md §3.2 (modes) and §4.2 (concept_mastery) explain
// the contract in narrative form; this file is the executable mirror.

import type { AttemptConfidence } from '@canvas/data/models/UserProgress';
import type {
  ProficiencyLevel,
  DominantWeakness,
  IMicroConceptProfile,
} from '@canvas/data/models/StudentChapterProfile';

// ============================================
// SECTION 1 — Tier rules (confidence)
// ============================================

/** Every attempt carries a tier. Anything outside this set is ignored. */
export const ALLOWED_TIERS: readonly AttemptConfidence[] = ['high', 'medium', 'low'];

/** Browse-mode default; test + guided practice promote to 'high'. */
export const DEFAULT_HIGH_SOURCES: readonly string[] = ['test', 'guided'];

/**
 * Resolve the confidence tier for an incoming attempt.
 *
 *   - If the caller passed an explicit valid tier, honour it.
 *   - Otherwise default by source: test/guided → 'high', anything else → 'medium'.
 *
 * Keep all writers funnelling through this helper so the default policy lives
 * in exactly one place.
 */
export function resolveConfidenceTier(
  confidence: unknown,
  source: string | undefined,
): AttemptConfidence {
  if (typeof confidence === 'string' && (ALLOWED_TIERS as readonly string[]).includes(confidence)) {
    return confidence as AttemptConfidence;
  }
  return source !== undefined && DEFAULT_HIGH_SOURCES.includes(source) ? 'high' : 'medium';
}

// ============================================
// SECTION 2 — Recent-attempts ring buffer
// ============================================

/**
 * UserProgress.recent_attempts is capped at this length — it powers the
 * analytics feed and the casual-tag reclassification window. Older attempts
 * are evicted FIFO. Test sessions write to test_sessions separately, so
 * this cap doesn't affect them.
 */
export const RECENT_ATTEMPTS_CAP = 200;

/**
 * Safety cap on `UserProgress.all_attempted_ids` (the lightweight per-question
 * index that drives the test generator's "avoid recently shown" dedup and the
 * browse "solved" markers). It is otherwise uncapped, and the whole document is
 * loaded on every attempt write — so an unbounded index eventually pushes the
 * doc toward the 16 MB BSON ceiling (a hard write-outage for that user) and
 * degrades every read long before that. This cap is a SAFETY VALVE set well
 * above realistic distinct-question counts; when exceeded, the
 * least-recently-attempted entry is evicted (LRU) — also the least useful entry
 * to the test generator. The proper long-term fix is to move this index into
 * its own collection keyed by user (tracked in _agents/brain/incidents.md).
 */
export const ALL_ATTEMPTED_IDS_CAP = 20_000;

/**
 * Safety cap on `UserProgress.starred_questions` (bookmarks). Bookmarks are
 * user-authored, so this is set high enough that a normal — even heavy — user
 * never hits it; only a runaway client/script would. When exceeded, the OLDEST
 * bookmark is evicted (FIFO). Keep this generous (§0.6 spirit: don't silently
 * drop meaningful user data).
 */
export const STARRED_QUESTIONS_CAP = 2_000;

// ============================================
// SECTION 3 — Chapter mastery levels
// ============================================
// Counter-derived display label on UserProgress.chapter_progress.mastery_level.
// Drives the "Beginner / Learning / Proficient / Mastered" chip students see
// on the dashboard and that admin dashboards will show on the per-student view.

export type ChapterMasteryLevel = 'Beginner' | 'Learning' | 'Proficient' | 'Mastered';

/**
 * Cutoffs for promoting a chapter to a higher mastery label. Counters are
 * HIGH-confidence only (browse signal must not poison mastery, per §3.2).
 */
export const MASTERY_THRESHOLDS = {
  Mastered: { minAttempted: 20, minAccuracyPct: 80 },
  Proficient: { minAttempted: 10, minAccuracyPct: 60 },
  Learning: { minAttempted: 5, minAccuracyPct: 0 },
} as const;

/**
 * Classifier: given `(totalAttempted, accuracyPercentage)` on a chapter,
 * return the mastery label. Pure — no DB read, no mutation. Safe to call
 * from any context (student write path, admin dashboard, AI training).
 */
export function computeChapterMasteryLevel(
  totalAttempted: number,
  accuracyPercentage: number,
): ChapterMasteryLevel {
  const m = MASTERY_THRESHOLDS;
  if (totalAttempted >= m.Mastered.minAttempted && accuracyPercentage >= m.Mastered.minAccuracyPct) {
    return 'Mastered';
  }
  if (totalAttempted >= m.Proficient.minAttempted && accuracyPercentage >= m.Proficient.minAccuracyPct) {
    return 'Proficient';
  }
  if (totalAttempted >= m.Learning.minAttempted) {
    return 'Learning';
  }
  return 'Beginner';
}

// ============================================
// SECTION 4 — MicroConcept proficiency (StudentChapterProfile)
// ============================================
// The persona substrate's finer-grained signal: per-microConcept proficiency
// derived from (attempts, accuracyRate, dominantWeakness). Used by guided
// practice + the welcome dashboard.

/**
 * Lowest → highest. `dropOneLevel` walks backwards through this array.
 * Re-exported in case admin dashboards want to render a level ladder.
 */
export const PROFICIENCY_ORDER: ProficiencyLevel[] = [
  'unseen',
  'weak',
  'developing',
  'strong',
  'mastered',
];

/**
 * Classify a microConcept's proficiency level given its three signals.
 *
 *   - mastered: 8+ attempts, >85% accuracy, no dominant weakness
 *   - strong: 5+ attempts, >70% accuracy, no calc-error/unclear-entry dominance
 *   - developing: 3+ attempts, >50% accuracy
 *   - weak: at least one attempt
 *   - unseen: zero attempts
 */
export function computeProficiencyLevel(
  attempts: number,
  accuracyRate: number,
  dominantWeakness: DominantWeakness,
): ProficiencyLevel {
  if (attempts === 0) return 'unseen';
  if (attempts >= 8 && accuracyRate > 0.85 && dominantWeakness === null) return 'mastered';
  if (
    attempts >= 5 &&
    accuracyRate > 0.70 &&
    dominantWeakness !== 'calc-error' &&
    dominantWeakness !== 'unclear-entry'
  ) {
    return 'strong';
  }
  if (attempts >= 3 && accuracyRate > 0.50) return 'developing';
  return 'weak';
}

/**
 * Drop-back rule: when recent performance regresses, demote one level.
 * Threshold depends on the current level (mastered is hardest to lose,
 * developing is easiest). Below `recentTotal` of 3 we don't drop at all —
 * not enough signal.
 */
export function shouldDropBack(
  currentLevel: ProficiencyLevel,
  recentCorrectCount: number,
  recentTotal: number,
): boolean {
  if (recentTotal < 3) return false;
  const recentAccuracy = recentCorrectCount / recentTotal;
  switch (currentLevel) {
    case 'mastered':
      return recentAccuracy < 0.67; // drop if <2/3 of last 3
    case 'strong':
      return recentAccuracy < 0.50;
    case 'developing':
      return recentAccuracy < 0.33;
    default:
      return false;
  }
}

/** Walk one step backwards in `PROFICIENCY_ORDER`. Never goes below 'weak'. */
export function dropOneLevel(level: ProficiencyLevel): ProficiencyLevel {
  const idx = PROFICIENCY_ORDER.indexOf(level);
  return idx > 1 ? PROFICIENCY_ORDER[idx - 1] : 'weak';
}

// ============================================
// SECTION 5 — Dominant weakness
// ============================================

/**
 * Classify the dominant stuck-point from a microConcept's counters.
 * Returns null if no clear pattern (need ≥2 occurrences and ≥40% share).
 */
export function computeDominantWeakness(
  stuckPointCounts: IMicroConceptProfile['stuckPointCounts'],
): DominantWeakness {
  const entries: [string, number][] = [
    ['concept-gap', stuckPointCounts['concept-gap']],
    ['unclear-entry', stuckPointCounts['unclear-entry']],
    ['calc-error', stuckPointCounts['calc-error']],
    ['time-pressure', stuckPointCounts['time-pressure']],
    ['silly-mistake', stuckPointCounts['silly-mistake']],
  ];

  const total = entries.reduce((sum, [, c]) => sum + c, 0);
  if (total === 0) return null;

  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const [topKey, topCount] = sorted[0];

  if (topCount >= 2 && topCount / total >= 0.4) {
    return topKey as DominantWeakness;
  }
  return null;
}

// ============================================
// SECTION 6 — Mastery probability (BKT-lite) — Phase 1
// ============================================
// A persistent per-skill estimate of P(student knows this skill), updated one
// attempt at a time via a lightweight Bayesian Knowledge Tracing step. Sharper
// than raw accuracy_percentage because it weights recent evidence and a single
// model handles slip/guess. Only HIGH-confidence attempts update it (same rule
// as the mastery counters). Stored on IConceptMastery.mastery_prob.

export const BKT = {
  pL0: 0.3,   // prior P(known) before any evidence
  pT: 0.15,   // P(learn) transition per practised attempt
  pS: 0.1,    // P(slip): knew it but answered wrong
  pG: 0.2,    // P(guess): didn't know but answered right
} as const;

/** One BKT update. `prior` undefined → start from pL0. Returns clamped [0,1]. */
export function updateMasteryProb(prior: number | undefined, correct: boolean): number {
  const p = typeof prior === 'number' && prior >= 0 && prior <= 1 ? prior : BKT.pL0;
  // Bayes: posterior given the observation.
  const posterior = correct
    ? (p * (1 - BKT.pS)) / (p * (1 - BKT.pS) + (1 - p) * BKT.pG)
    : (p * BKT.pS) / (p * BKT.pS + (1 - p) * (1 - BKT.pG));
  // Learning transition: practising itself nudges knowledge up.
  const next = posterior + (1 - posterior) * BKT.pT;
  return Math.min(1, Math.max(0, next));
}

// ============================================
// SECTION 7 — Spaced repetition (SM-2-lite) — Phase 1
// ============================================
// A simple expanding-interval scheduler. Consecutive correct answers grow the
// review interval along a fixed ladder; any wrong answer resets it. The
// recommendation engine surfaces a skill for review once `next_due_at` passes.

/** Days until the next review, indexed by consecutive-correct streak (capped). */
export const REVIEW_LADDER_DAYS = [1, 3, 7, 16, 35, 75] as const;

/**
 * Given the PRIOR consecutive-correct streak and this attempt's result, return
 * the new streak + the days until the skill is next due for review.
 *   wrong → streak resets to 0, due again tomorrow (interval 1).
 *   right → streak grows, interval climbs the ladder.
 */
export function nextReview(
  priorStreakCorrect: number,
  correct: boolean,
): { streakCorrect: number; intervalDays: number } {
  if (!correct) return { streakCorrect: 0, intervalDays: REVIEW_LADDER_DAYS[0] };
  const streakCorrect = Math.max(0, priorStreakCorrect) + 1;
  const idx = Math.min(streakCorrect - 1, REVIEW_LADDER_DAYS.length - 1);
  return { streakCorrect, intervalDays: REVIEW_LADDER_DAYS[idx] };
}
