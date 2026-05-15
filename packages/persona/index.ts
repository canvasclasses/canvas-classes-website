// @canvas/persona — the persona contract + the writers that encode it.
//
// Primary pattern: subpath imports. The contract (constants + classifiers)
// has its own subpath so admin dashboards and AI training pipelines can
// import only the read-side surface:
//
//   import { computeChapterMasteryLevel, MASTERY_THRESHOLDS } from '@canvas/persona/contract';
//   import { applyAttemptToProgress }                          from '@canvas/persona/writer';
//   import { getRecommendations }                              from '@canvas/persona/recommendation-engine';
//   import { isAnswerCorrect }                                 from '@canvas/persona/scoring';
//
// This barrel re-exports the most-touched symbols for ad-hoc usage. It's NOT
// a contract — if a symbol isn't here, reach for the subpath.

// ── Read-side contract (constants + classifiers) ──
export {
  ALLOWED_TIERS,
  DEFAULT_HIGH_SOURCES,
  RECENT_ATTEMPTS_CAP,
  MASTERY_THRESHOLDS,
  PROFICIENCY_ORDER,
  resolveConfidenceTier,
  computeChapterMasteryLevel,
  computeProficiencyLevel,
  shouldDropBack,
  dropOneLevel,
  computeDominantWeakness,
  type ChapterMasteryLevel,
} from './contract';

// ── Writers (mutate a hydrated mongoose doc; caller saves) ──
export { applyAttemptToProgress } from './writer';
export {
  updateProfileFromResponse,
  updateProfileFromAttempt,
  createEmptyMicroConceptProfile,
  createEmptyProfile,
  type ILiteAttempt,
} from './profile-engine';

// ── Recommendation engine (async, DB-reading) ──
export {
  getRecommendations,
  getResourceForConcept,
  type RecommendationReason,
  type RecommendationActionType,
  type RecommendationItem,
  type RecommendationOptions,
} from './recommendation-engine';

// ── Scoring (pure: is this answer correct?) ──
export {
  isAnswerCorrect,
  type QuestionType,
  type ScorableQuestion,
} from './scoring';
