/**
 * RECOMMENDATION ENGINE — bridge in place, gates closed.
 *
 * Today this module returns an empty array. The shape, types, callers, and
 * data contract are all wired so we can swap the stub for the real algorithm
 * the moment livebooks/lectures content is ready, without touching the UI.
 *
 * INTENDED ALGORITHM (v1, when activated):
 *   1. Read UserProgress.concept_mastery (canonical shape — see §4.2 of
 *      CRUCIBLE_ARCHITECTURE.md). Each entry has:
 *        - times_attempted / times_correct / accuracy_percentage
 *          (HIGH-confidence MASTERY counters — this is what we score on),
 *        - exposure_count (HIGH+MEDIUM — drives "explored" displays only),
 *        - last_attempted_at (recency).
 *   2. Filter to "weak concepts": times_attempted >= 3 AND accuracy < 60.
 *      DO NOT include exposure_count in the weakness predicate — that would
 *      let casual browse activity poison the recommendation pool. The
 *      tiered signal model (§3.2) exists precisely to prevent this.
 *   3. Apply recency decay: weight = exp(-Δdays / 14) so concepts touched
 *      recently float above stale ones.
 *   4. Sort by (weakness_score * recency_weight) DESC. Take top N.
 *   5. For each weak concept, look up ResourceLink rows by topic_tag_id
 *      preferring is_primary=true and the requested action_type filter.
 *   6. If no resource exists, fall back to a "practice more" recommendation
 *      (pointing back to that topic in Crucible browse mode).
 *
 * MEDIUM-TERM EXTENSIONS (v2):
 *   - StudentChapterProfile microConcept-level signal (sharper than tag_id).
 *   - "Unfinished chapter" surfacing (chapter_progress.total_attempted
 *     between 1 and ~30% of chapter total → "you started this, finish it").
 *   - "Review due" using spaced-repetition over correct attempts (revisit a
 *     concept 7 days after first correct, then 30, etc.).
 *   - "Next in sequence" using NCERT_TOPIC_ORDER to recommend the next
 *     un-touched topic in the student's current chapter.
 *
 * UI CONTRACT:
 *   - Components render an array of RecommendationItem.
 *   - Empty array is a valid render — show "Keep practicing — we'll have
 *     personalised picks for you soon" placeholder.
 *   - Each item carries everything the card needs (title, subtitle, action
 *     URL, reason). UI never reaches back into the engine for context.
 */

import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';
import { ResourceLink, ResourceType } from '@/lib/models/ResourceLink';

// ── Public types — these are the API contract the UI depends on. ─────────

export type RecommendationReason =
  | 'weak_concept'        // accuracy is low and they've tried multiple times
  | 'unfinished_chapter'  // started a chapter and stalled
  | 'review_due'          // spaced-repetition triggers a re-touch
  | 'next_in_sequence'    // next NCERT topic after their current progress
  | 'fresh_start';        // no signal yet — generic suggestion

export type RecommendationActionType = 'practice' | 'read' | 'watch';

export interface RecommendationItem {
  /** 1-indexed position in the returned list. UI may display or ignore. */
  rank: number;
  reason: RecommendationReason;
  /** Human-readable headline for the "Why we picked this" line. */
  reason_label: string;

  action_type: RecommendationActionType;
  /** Route the user navigates to when they tap the card. */
  action_url: string;

  // ── Card contents ────────────────────────────────────────────────────
  title: string;                  // "Hyperconjugation"
  subtitle?: string;              // "Acidity & Basicity · 38% accuracy"
  chapter_id?: string;
  topic_tag_id?: string;

  /** Populated when action_type is 'read' or 'watch'. */
  resource?: {
    type: ResourceType;
    title: string;
    url: string;
    duration_minutes?: number;
  };

  /** Score used for ranking — exposed for debug only. UI should ignore. */
  _score?: number;
}

export interface RecommendationOptions {
  limit?: number;                                        // default 5, hard-capped at 20
  types?: RecommendationActionType[];                    // filter by what action they want
  excludeChapterIds?: string[];                          // skip these chapters
}

// ── Public surface ───────────────────────────────────────────────────────

/**
 * Returns a ranked list of personalised recommendations for the given user.
 *
 * STUB — currently returns []. See file header for the intended algorithm.
 * Safe to call from any route or component; the UI handles empty arrays.
 */
export async function getRecommendations(
  userId: string,
  opts: RecommendationOptions = {},
): Promise<RecommendationItem[]> {
  const limit = Math.min(Math.max(opts.limit ?? 5, 1), 20);

  // ── BRIDGE — gates closed. Once livebook/lecture content + ResourceLink
  //    rows exist, replace this block with the algorithm in the file header.
  //    Below is the wiring you'd uncomment to do step 1; intentionally
  //    commented so the function stays a true no-op for now (no DB reads).

  // await connectToDatabase();
  // const progress = await UserProgress.findById(userId)
  //   .select('concept_mastery chapter_progress')
  //   .lean();
  // if (!progress) return [];
  // // … score & rank concepts, look up ResourceLink, build items …

  // Suppress unused-import lint while gates are closed. Removing the imports
  // would require re-adding them when the gates open and a future engineer
  // would not see the intended dependency surface. Keep the imports.
  void connectToDatabase; void UserProgress; void ResourceLink; void limit;

  return [];
}

/**
 * Convenience helper for the per-question "Stuck? Watch this lecture" CTA on
 * a wrong-answer screen. Returns the highest-ranked resource for the given
 * concept, or null if none exists.
 *
 * STUB — returns null. Wires up alongside getRecommendations.
 */
export async function getResourceForConcept(
  topicTagId: string,
  preferredType?: ResourceType,
): Promise<RecommendationItem['resource'] | null> {
  void topicTagId; void preferredType;
  return null;
}
