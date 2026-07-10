import 'server-only';
import type { HydratedDocument } from 'mongoose';
import type {
  IQuestionAttempt,
  IUserProgress,
} from '@canvas/data/models/UserProgress';
import { resolveConfidenceTier } from './contract';
import { computeUserProgressUpdate } from './user-progress-updater';

// Re-export `resolveConfidenceTier` so existing callers that imported it from
// the writer keep working without a second import-statement update. New code
// should reach for `@canvas/persona/contract` directly.
export { resolveConfidenceTier };

/**
 * Persona writer — the single mutation surface for the tiered persona pipeline.
 *
 * Every code path that records a student question attempt funnels through here:
 *
 *   - POST /api/v2/user/progress         (browse / single attempt)
 *   - POST /api/v2/user/progress/batch   (test mode, N attempts)
 *   - recordQuestionAttempt server action (Crucible dashboard)
 *
 * Usage pattern at each call site:
 *   applyAttemptToProgress(progress, attempt);
 *   await progress.save();
 *
 * Before this module existed, the tiered counter contract (CRUCIBLE_ARCHITECTURE.md
 * §3.2 + §4.2) was re-implemented inline in each writer. That repetition broke
 * the persona pipeline at least twice — the most recent one (May 2026 audit)
 * had test-mode attempts never advancing chapter_progress mastery_level because
 * the batch route copy of the math forgot to write that field. Centralising
 * here is the seam: one place can be wrong, not three.
 *
 * What the contract says, in code form:
 *   - HIGH attempts → mastery counters + exposure_count + last_attempted_at + stats totals
 *   - MEDIUM attempts → exposure_count + last_attempted_at only
 *   - LOW attempts → last_attempted_at only ("last seen" signal for the test generator)
 *
 * See CRUCIBLE_ARCHITECTURE.md §3.2 (modes) and §4.2 (concept_mastery shape).
 */

/**
 * Apply a single attempt to a UserProgress document, mutating it in place.
 * Does NOT call `.save()` — that's the caller's job (single-attempt callers
 * save immediately; batch callers save once after the whole loop).
 *
 * The attempt's `confidence` field is used as-is. Callers must have already
 * resolved the tier via `resolveConfidenceTier` and set it on the attempt.
 *
 * **Caller validates input.** This function performs no defensive validation
 * on `attempt` — it trusts the type. Every route handler in apps/student
 * (and any future consumer in apps/admin or an AI pipeline) MUST validate
 * the request body and verify the user owns `progress` before calling.
 */
export function applyAttemptToProgress(
  progress: HydratedDocument<IUserProgress>,
  attempt: IQuestionAttempt,
): void {
  // Compute the change set purely, then apply via Mongoose's change-tracking
  // surface (Map.set on chapter_progress / concept_mastery, direct assignment
  // for arrays + stats). The math lives in user-progress-updater.ts and is
  // unit-testable without a DB.
  const update = computeUserProgressUpdate(
    {
      recent_attempts: progress.recent_attempts,
      all_attempted_ids: progress.all_attempted_ids,
      chapter_progress: progress.chapter_progress,
      concept_mastery: progress.concept_mastery,
      stats: progress.stats,
    },
    attempt,
  );

  // Duplicate delivery (same client_attempt_id already recorded) — do not
  // re-apply, or counters would double-count. See computeUserProgressUpdate.
  if (update.skipped) return;

  progress.recent_attempts = update.recent_attempts;
  progress.all_attempted_ids = update.all_attempted_ids;

  if (update.chapter_progress) {
    progress.chapter_progress.set(
      update.chapter_progress.chapter_id,
      update.chapter_progress.value,
    );
  }

  for (const { tag_id, value } of update.concept_mastery) {
    progress.concept_mastery.set(tag_id, value);
  }

  Object.assign(progress.stats, update.stats);
  progress.updated_at = update.updated_at;
}
