import type { HydratedDocument } from 'mongoose';
import type {
  AttemptConfidence,
  IAttemptedIdEntry,
  IChapterProgress,
  IConceptMastery,
  IQuestionAttempt,
  IUserProgress,
} from '@/lib/models/UserProgress';
import { getTagName } from '@/lib/taxonomyLookup';

/**
 * Persona writer — the single mutation surface for the tiered persona pipeline.
 *
 * Every code path that records a student question attempt funnels through here:
 *
 *   - UserProgress.recordAttempt  (single-attempt instance method)
 *   - POST /api/v2/user/progress         (browse / single attempt)
 *   - POST /api/v2/user/progress/batch   (test mode, N attempts)
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

const ALLOWED_TIERS: readonly AttemptConfidence[] = ['high', 'medium', 'low'];

const RECENT_ATTEMPTS_CAP = 200;

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
  return source === 'test' || source === 'guided' ? 'high' : 'medium';
}

/**
 * Apply a single attempt to a UserProgress document, mutating it in place.
 * Does NOT call `.save()` — that's the caller's job (single-attempt callers
 * save immediately; batch callers save once after the whole loop).
 *
 * The attempt's `confidence` field is used as-is. Callers must have already
 * resolved the tier via `resolveConfidenceTier` and set it on the attempt.
 */
export function applyAttemptToProgress(
  progress: HydratedDocument<IUserProgress>,
  attempt: IQuestionAttempt,
): void {
  // Add to recent attempts (keep only last 200 — for analytics feed).
  progress.recent_attempts.unshift(attempt);
  if (progress.recent_attempts.length > RECENT_ATTEMPTS_CAP) {
    progress.recent_attempts = progress.recent_attempts.slice(0, RECENT_ATTEMPTS_CAP);
  }

  // Effective tier (default is 'medium' if the writer didn't set one). Drives
  // every counter decision below — see CRUCIBLE_ARCHITECTURE.md §3.2 and §4.2.
  const tier: AttemptConfidence = attempt.confidence ?? 'medium';
  const isHigh = tier === 'high';
  const isLow = tier === 'low';
  const counts_for_mastery = isHigh;        // mastery counters: high only
  const counts_for_exposure = !isLow;       // exposure: high + medium

  // Lightweight all_attempted_ids index — used by the test generator to avoid
  // recently-shown questions. Counts test-source attempts AND any
  // high-confidence attempt for cross-mode dedup. Browse-medium and browse-low
  // intentionally do not populate this — browsing shouldn't burn a question
  // for the test generator.
  if (attempt.source === 'test' || isHigh) {
    const existingIdx = progress.all_attempted_ids.findIndex(
      (e: IAttemptedIdEntry) => e.question_id === attempt.question_id,
    );
    if (existingIdx >= 0) {
      progress.all_attempted_ids[existingIdx].times_attempted += 1;
      progress.all_attempted_ids[existingIdx].last_attempted_at = attempt.attempted_at;
      if (attempt.is_correct) {
        progress.all_attempted_ids[existingIdx].times_correct += 1;
        progress.all_attempted_ids[existingIdx].last_correct_at = attempt.attempted_at;
      }
    } else {
      progress.all_attempted_ids.push({
        question_id: attempt.question_id,
        chapter_id: attempt.chapter_id,
        times_attempted: 1,
        times_correct: attempt.is_correct ? 1 : 0,
        last_attempted_at: attempt.attempted_at,
        last_correct_at: attempt.is_correct ? attempt.attempted_at : undefined,
      });
    }
  }

  // Chapter progress — driven by HIGH-confidence only (mastery_level signal).
  // Browse exposure tracking lives in concept_mastery.exposure_count below.
  if (counts_for_mastery) {
    const chapterId = attempt.chapter_id;
    const chapterProg: IChapterProgress = progress.chapter_progress.get(chapterId) ?? {
      chapter_id: chapterId,
      total_attempted: 0,
      correct_count: 0,
      accuracy_percentage: 0,
      last_attempted_at: new Date(),
      mastery_level: 'Beginner',
    };
    chapterProg.total_attempted += 1;
    if (attempt.is_correct) chapterProg.correct_count += 1;
    chapterProg.accuracy_percentage =
      (chapterProg.correct_count / chapterProg.total_attempted) * 100;
    chapterProg.last_attempted_at = attempt.attempted_at;
    if (chapterProg.total_attempted >= 20 && chapterProg.accuracy_percentage >= 80) {
      chapterProg.mastery_level = 'Mastered';
    } else if (chapterProg.total_attempted >= 10 && chapterProg.accuracy_percentage >= 60) {
      chapterProg.mastery_level = 'Proficient';
    } else if (chapterProg.total_attempted >= 5) {
      chapterProg.mastery_level = 'Learning';
    }
    progress.chapter_progress.set(chapterId, chapterProg);
  }

  // concept_mastery — the persona substrate. Two parallel counter sets:
  //   - times_* / accuracy_percentage : HIGH only (mastery)
  //   - exposure_count                : HIGH + MEDIUM
  //   - last_attempted_at             : updated regardless (last-seen signal)
  // LOW (casual-tagged browse) only updates last_attempted_at.
  for (const tagId of attempt.concept_tags ?? []) {
    if (!tagId) continue;
    const existing = progress.concept_mastery.get(tagId);
    if (existing) {
      existing.last_attempted_at = attempt.attempted_at;
      if (counts_for_exposure) existing.exposure_count = (existing.exposure_count ?? 0) + 1;
      if (counts_for_mastery) {
        existing.times_attempted += 1;
        if (attempt.is_correct) existing.times_correct += 1;
        existing.accuracy_percentage =
          existing.times_attempted > 0
            ? Math.round((existing.times_correct / existing.times_attempted) * 100)
            : 0;
      }
    } else {
      // First touch on this concept — initialise based on what tier this is.
      const fresh: IConceptMastery = {
        tag_id: tagId,
        tag_name: getTagName(tagId),
        times_attempted: counts_for_mastery ? 1 : 0,
        times_correct: counts_for_mastery && attempt.is_correct ? 1 : 0,
        accuracy_percentage: counts_for_mastery ? (attempt.is_correct ? 100 : 0) : 0,
        exposure_count: counts_for_exposure ? 1 : 0,
        last_attempted_at: attempt.attempted_at,
      };
      progress.concept_mastery.set(tagId, fresh);
    }
  }

  // Overall stats — HIGH only. Browse should not inflate the overall_accuracy
  // shown on the dashboard, since that number is the student's "official"
  // mastery percentage.
  if (counts_for_mastery) {
    progress.stats.total_questions_attempted += 1;
    if (attempt.is_correct) progress.stats.total_correct += 1;
    progress.stats.overall_accuracy =
      (progress.stats.total_correct / progress.stats.total_questions_attempted) * 100;
  }

  // last_practice_date + streak update for any non-low attempt (drives the
  // streak chip on the welcome dashboard). Streak math must capture the OLD
  // last_practice_date BEFORE we overwrite it — previously daysDiff was
  // always 0 because `lastPractice` aliased the just-updated field, so the
  // streak counter was permanently stuck at 1 (audit #18).
  if (!isLow) {
    const prevPracticeDate = progress.stats.last_practice_date;
    progress.stats.last_practice_date = attempt.attempted_at;

    // Day-bucket comparison — round both timestamps to local midnight so
    // multiple attempts on the same calendar day don't churn the streak.
    const today = new Date(attempt.attempted_at);
    today.setHours(0, 0, 0, 0);
    if (prevPracticeDate) {
      const prev = new Date(prevPracticeDate);
      prev.setHours(0, 0, 0, 0);
      const daysDiff = Math.round((today.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 0) {
        // Same day — leave streak unchanged.
      } else if (daysDiff === 1) {
        progress.stats.streak_days = (progress.stats.streak_days ?? 0) + 1;
      } else {
        // Missed a day or more — restart at 1.
        progress.stats.streak_days = 1;
      }
    } else {
      // First-ever attempt — bootstrap streak.
      progress.stats.streak_days = 1;
    }
  }

  progress.updated_at = new Date();
}
