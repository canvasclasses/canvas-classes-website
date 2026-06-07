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

import 'server-only';
import connectToDatabase from '@canvas/data/db/mongodb';
import { UserProgress, type IConceptMastery } from '@canvas/data/models/UserProgress';
import { ResourceLink, type ResourceType } from '@canvas/data/models/ResourceLink';
import { getTagName } from '@canvas/data/taxonomy/lookup';

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
// Map a ResourceLink's resource_type to the UI action verb.
function actionForResource(t: ResourceType): RecommendationActionType {
  return t === 'video_lecture' ? 'watch' : 'read';
}

// Mongoose `.lean()` returns Map fields as plain objects on some versions and
// as Maps on others — normalise to [key, value] pairs either way.
function entriesOf<T>(m: unknown): Array<[string, T]> {
  if (!m) return [];
  if (m instanceof Map) return [...m.entries()] as Array<[string, T]>;
  return Object.entries(m as Record<string, T>);
}

export async function getRecommendations(
  userId: string,
  opts: RecommendationOptions = {},
): Promise<RecommendationItem[]> {
  const limit = Math.min(Math.max(opts.limit ?? 5, 1), 20);
  const typeFilter = opts.types && opts.types.length ? new Set(opts.types) : null;

  await connectToDatabase();
  const progress = await UserProgress.findById(userId)
    .select('concept_mastery')
    .lean() as { concept_mastery?: unknown } | null;
  if (!progress) return [];

  const now = Date.now();
  const entries = entriesOf<IConceptMastery>(progress.concept_mastery).map(([tagId, m]) => ({ tagId, m }));

  // 1+2. Weak-concept filter — MASTERY counters only (never exposure). §3.2/§4.2.
  //      Ranked by weakness × recency, nudged by the BKT mastery estimate
  //      (truly-unknown skills float above merely-spotty ones).
  const weak = entries
    .filter(({ m }) => (m?.times_attempted ?? 0) >= 3 && (m?.accuracy_percentage ?? 100) < 60)
    .map(({ tagId, m }) => {
      const last = m.last_attempted_at ? new Date(m.last_attempted_at).getTime() : now;
      const recency = Math.exp(-Math.max(0, (now - last) / 86_400_000) / 14); // decay over 14 days
      const weakness = (60 - m.accuracy_percentage) / 60;                      // 0..1, higher = weaker
      const unknownness = 1 - (typeof m.mastery_prob === 'number' ? m.mastery_prob : 0.5); // 0..1
      return { tagId, m, reason: 'weak_concept' as const, score: weakness * recency * (1 + unknownness) };
    })
    .sort((a, b) => b.score - a.score);

  const weakIds = new Set(weak.map((w) => w.tagId));

  // 4. Review-due — spaced repetition. Skills the student HAS learned
  //    (accuracy ≥ 60) whose next_due_at has passed. Distinct from weak: not
  //    "you're failing", but "keep it sharp". Most-overdue first.
  const due = entries
    .filter(({ tagId, m }) =>
      !weakIds.has(tagId) &&
      m?.next_due_at && new Date(m.next_due_at).getTime() <= now &&
      (m.accuracy_percentage ?? 0) >= 60 && (m.times_attempted ?? 0) >= 2)
    .map(({ tagId, m }) => ({
      tagId, m, reason: 'review_due' as const,
      score: (now - new Date(m.next_due_at!).getTime()) / 86_400_000, // days overdue
    }))
    .sort((a, b) => b.score - a.score);

  // Weaknesses first (more urgent), then due-for-review.
  const candidates = [...weak, ...due];
  if (candidates.length === 0) return [];

  // 5+6. For each candidate, find a ResourceLink → "read/watch"; else fall back
  // to a "practice" recommendation pointing at the concept.
  const items: RecommendationItem[] = [];
  for (const { tagId, m, reason, score } of candidates) {
    if (items.length >= limit) break;
    const link = await ResourceLink.findOne({ topic_tag_id: tagId })
      .sort({ is_primary: -1 })
      .lean() as {
        resource_type: ResourceType; resource_title: string; resource_url: string;
        duration_minutes?: number; chapter_id?: string;
      } | null;

    const name = getTagName(tagId);
    const acc = Math.round(m.accuracy_percentage);
    const subtitle = reason === 'review_due' ? 'Due for review' : `${acc}% accuracy`;

    if (link) {
      const action = actionForResource(link.resource_type);
      if (typeFilter && !typeFilter.has(action)) continue;
      items.push({
        rank: 0, reason,
        reason_label: reason === 'review_due'
          ? 'Time to refresh — you learned this, keep it sharp.'
          : `Weak spot — ${acc}% so far. Brush up here.`,
        action_type: action, action_url: link.resource_url,
        title: name, subtitle, chapter_id: link.chapter_id, topic_tag_id: tagId,
        resource: {
          type: link.resource_type, title: link.resource_title,
          url: link.resource_url, duration_minutes: link.duration_minutes,
        },
        _score: score,
      });
    } else {
      if (typeFilter && !typeFilter.has('practice')) continue;
      // Practice fallback — book skills → the book library; Crucible tags →
      // focused Crucible practice. Both URLs are non-broken.
      const action_url = tagId.startsWith('bk:') ? '/class-9' : `/the-crucible?focus=${encodeURIComponent(tagId)}`;
      items.push({
        rank: 0, reason,
        reason_label: reason === 'review_due'
          ? 'Time to refresh — practise it again.'
          : `Weak spot — ${acc}% so far. Practise more.`,
        action_type: 'practice', action_url,
        title: name, subtitle, topic_tag_id: tagId, _score: score,
      });
    }
  }

  return items.map((it, i) => ({ ...it, rank: i + 1 }));
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
  await connectToDatabase();
  const query: Record<string, unknown> = { topic_tag_id: topicTagId };
  if (preferredType) query.resource_type = preferredType;
  const link = await ResourceLink.findOne(query)
    .sort({ is_primary: -1 })
    .lean() as {
      resource_type: ResourceType; resource_title: string;
      resource_url: string; duration_minutes?: number;
    } | null;
  if (!link) return null;
  return {
    type: link.resource_type,
    title: link.resource_title,
    url: link.resource_url,
    duration_minutes: link.duration_minutes,
  };
}
