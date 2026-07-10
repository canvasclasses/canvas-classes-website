/**
 * Pure value-oriented core of the persona writer.
 *
 * `applyAttemptToProgress` (writer.ts) is the canonical mutation surface for
 * the tiered counter contract, and CRUCIBLE_ARCHITECTURE.md §9 invariant #3
 * keeps it that way. But its current shape — 140 lines that mutate a hydrated
 * Mongoose document in place — makes the most important state transition in
 * the codebase untestable without a real DB or a complete Mongoose mock. The
 * past streak-math bug (audit #18: `prevPracticeDate` was overwritten before
 * being read) lived here precisely because there was no seam to test it.
 *
 * This module is that seam: `computeUserProgressUpdate` takes a value-shaped
 * snapshot of the document and returns the changes a single attempt would
 * produce. The writer keeps its in-place wrapper for Mongoose's change
 * tracking; tests reach for the pure function.
 *
 * Pure — no DB I/O, no Mongoose, no `import 'server-only'`. Safe to import
 * from tests, admin dashboards simulating "what would this attempt do," or
 * future AI training pipelines replaying historical attempts.
 *
 * The tier rules implemented here come from CRUCIBLE_ARCHITECTURE.md §3.2 +
 * §4.2 — see writer.ts for the prose version of the contract.
 */

import type {
  AttemptConfidence,
  IAttemptedIdEntry,
  IChapterProgress,
  IConceptMastery,
  IQuestionAttempt,
  IUserStats,
} from '@canvas/data/models/UserProgress';
import { getTagName } from '@canvas/data/taxonomy/lookup';
import {
  RECENT_ATTEMPTS_CAP,
  ALL_ATTEMPTED_IDS_CAP,
  computeChapterMasteryLevel,
  updateMasteryProb,
  nextReview,
} from './contract';

const DAY_MS = 86_400_000;

/**
 * Value-shaped snapshot of the fields `applyAttemptToProgress` reads from a
 * hydrated UserProgress document. Maps stay as `ReadonlyMap` so we can pass
 * Mongoose Maps directly without conversion at the call site.
 */
export interface UserProgressSnapshot {
  recent_attempts: readonly IQuestionAttempt[];
  all_attempted_ids: readonly IAttemptedIdEntry[];
  chapter_progress: ReadonlyMap<string, IChapterProgress>;
  concept_mastery: ReadonlyMap<string, IConceptMastery>;
  stats: Readonly<IUserStats>;
}

/**
 * The change set produced by a single attempt. `chapter_progress` is present
 * only when the attempt warrants writing it (HIGH-confidence). `concept_mastery`
 * is one entry per tag on the attempt that produced an update.
 */
export interface UserProgressUpdate {
  recent_attempts: IQuestionAttempt[];
  all_attempted_ids: IAttemptedIdEntry[];
  chapter_progress?: { chapter_id: string; value: IChapterProgress };
  concept_mastery: Array<{ tag_id: string; value: IConceptMastery }>;
  stats: IUserStats;
  updated_at: Date;
  // True when the attempt was a duplicate (same client_attempt_id already in
  // recent_attempts) and must NOT be applied. The writer early-returns on this
  // so a double-delivered attempt (beacon + keepalive, or a retry where the
  // server already committed) doesn't double-count. The other fields are
  // unspecified when skipped — callers must check this first.
  skipped?: boolean;
}

/**
 * Compute the persona-writer changes for a single attempt — pure.
 *
 * Mirrors the in-place semantics of `applyAttemptToProgress` exactly:
 *   - HIGH: mastery counters + exposure + last-seen + stats totals + streak
 *   - MEDIUM: exposure + last-seen + streak
 *   - LOW: last-seen only (no streak, no exposure, no mastery)
 *
 * **Caller validates input.** No defensive checks on `attempt` — the writer
 * documented this contract and it carries over.
 */
export function computeUserProgressUpdate(
  current: UserProgressSnapshot,
  attempt: IQuestionAttempt,
): UserProgressUpdate {
  const tier: AttemptConfidence = attempt.confidence ?? 'medium';
  const isHigh = tier === 'high';
  const isLow = tier === 'low';
  const counts_for_mastery = isHigh;
  const counts_for_exposure = !isLow;

  // ── Idempotency: skip a duplicate delivery of the same attempt ────────
  // Clients stamp a stable `client_attempt_id` per logical attempt. If one is
  // already present in the recent window (capped at RECENT_ATTEMPTS_CAP), this
  // is a re-delivery (beacon + keepalive both landed, or a client retried a
  // request the server had already committed) — return a no-op so counters
  // don't double-count. Attempts without an id keep the old behaviour.
  if (attempt.client_attempt_id) {
    const dup = current.recent_attempts.some(
      a => a.client_attempt_id === attempt.client_attempt_id,
    );
    if (dup) {
      return {
        recent_attempts: [],
        all_attempted_ids: [],
        concept_mastery: [],
        stats: current.stats,
        updated_at: new Date(),
        skipped: true,
      };
    }
  }

  // ── recent_attempts: prepend + cap (analytics feed) ───────────────────
  const recent_attempts = [attempt, ...current.recent_attempts];
  if (recent_attempts.length > RECENT_ATTEMPTS_CAP) {
    recent_attempts.length = RECENT_ATTEMPTS_CAP;
  }

  // ── all_attempted_ids: lightweight index for the test generator ──────
  // Counts test-source attempts AND any HIGH attempt. Browse-medium /
  // browse-low intentionally do not populate this — browsing shouldn't
  // burn a question for the test generator.
  const all_attempted_ids = [...current.all_attempted_ids];
  if (attempt.source === 'test' || isHigh) {
    const existingIdx = all_attempted_ids.findIndex(
      e => e.question_id === attempt.question_id,
    );
    if (existingIdx >= 0) {
      const existing = all_attempted_ids[existingIdx];
      all_attempted_ids[existingIdx] = {
        ...existing,
        times_attempted: existing.times_attempted + 1,
        times_correct: existing.times_correct + (attempt.is_correct ? 1 : 0),
        last_attempted_at: attempt.attempted_at,
        last_correct_at: attempt.is_correct ? attempt.attempted_at : existing.last_correct_at,
      };
    } else {
      all_attempted_ids.push({
        question_id: attempt.question_id,
        chapter_id: attempt.chapter_id,
        times_attempted: 1,
        times_correct: attempt.is_correct ? 1 : 0,
        last_attempted_at: attempt.attempted_at,
        last_correct_at: attempt.is_correct ? attempt.attempted_at : undefined,
      });
      // Safety cap (see ALL_ATTEMPTED_IDS_CAP). Only a fresh push can grow the
      // array, and it grows by one, so evicting a single least-recently-
      // attempted entry keeps it at the cap. O(n) single pass — runs only for
      // users already at the cap (very rare), never on the common path.
      if (all_attempted_ids.length > ALL_ATTEMPTED_IDS_CAP) {
        let oldestIdx = 0;
        let oldestTime = Infinity;
        for (let i = 0; i < all_attempted_ids.length; i++) {
          const la = all_attempted_ids[i].last_attempted_at;
          const t = la ? new Date(la).getTime() : 0;
          if (t < oldestTime) { oldestTime = t; oldestIdx = i; }
        }
        all_attempted_ids.splice(oldestIdx, 1);
      }
    }
  }

  // ── chapter_progress: HIGH-confidence only (mastery_level signal) ────
  let chapter_progress: UserProgressUpdate['chapter_progress'];
  if (counts_for_mastery) {
    const chapterId = attempt.chapter_id;
    const base: IChapterProgress = current.chapter_progress.get(chapterId) ?? {
      chapter_id: chapterId,
      total_attempted: 0,
      correct_count: 0,
      accuracy_percentage: 0,
      last_attempted_at: new Date(),
      mastery_level: 'Beginner',
    };
    const total_attempted = base.total_attempted + 1;
    const correct_count = base.correct_count + (attempt.is_correct ? 1 : 0);
    const accuracy_percentage = (correct_count / total_attempted) * 100;
    chapter_progress = {
      chapter_id: chapterId,
      value: {
        ...base,
        total_attempted,
        correct_count,
        accuracy_percentage,
        last_attempted_at: attempt.attempted_at,
        mastery_level: computeChapterMasteryLevel(total_attempted, accuracy_percentage),
      },
    };
  }

  // ── concept_mastery: per-tag updates ─────────────────────────────────
  // times_* / accuracy_percentage : HIGH only
  // exposure_count                : HIGH + MEDIUM
  // last_attempted_at             : updated regardless (last-seen signal)
  const concept_mastery: UserProgressUpdate['concept_mastery'] = [];
  for (const tagId of attempt.concept_tags ?? []) {
    if (!tagId) continue;
    const existing = current.concept_mastery.get(tagId);
    if (existing) {
      const next: IConceptMastery = {
        ...existing,
        last_attempted_at: attempt.attempted_at,
      };
      if (counts_for_exposure) {
        next.exposure_count = (existing.exposure_count ?? 0) + 1;
      }
      if (counts_for_mastery) {
        next.times_attempted = existing.times_attempted + 1;
        if (attempt.is_correct) next.times_correct = existing.times_correct + 1;
        next.accuracy_percentage = next.times_attempted > 0
          ? Math.round((next.times_correct / next.times_attempted) * 100)
          : 0;
        // Phase 1: persistent mastery estimate + spaced-repetition schedule.
        next.mastery_prob = updateMasteryProb(existing.mastery_prob, attempt.is_correct);
        const sr = nextReview(existing.streak_correct ?? 0, attempt.is_correct);
        next.streak_correct = sr.streakCorrect;
        next.review_interval_days = sr.intervalDays;
        next.next_due_at = new Date(attempt.attempted_at.getTime() + sr.intervalDays * DAY_MS);
        if (attempt.is_correct) next.last_correct_at = attempt.attempted_at;
      }
      concept_mastery.push({ tag_id: tagId, value: next });
    } else {
      const freshValue: IConceptMastery = {
        tag_id: tagId,
        tag_name: getTagName(tagId),
        times_attempted: counts_for_mastery ? 1 : 0,
        times_correct: counts_for_mastery && attempt.is_correct ? 1 : 0,
        accuracy_percentage: counts_for_mastery ? (attempt.is_correct ? 100 : 0) : 0,
        exposure_count: counts_for_exposure ? 1 : 0,
        last_attempted_at: attempt.attempted_at,
      };
      if (counts_for_mastery) {
        // Phase 1: seed the mastery estimate + first review interval.
        freshValue.mastery_prob = updateMasteryProb(undefined, attempt.is_correct);
        const sr = nextReview(0, attempt.is_correct);
        freshValue.streak_correct = sr.streakCorrect;
        freshValue.review_interval_days = sr.intervalDays;
        freshValue.next_due_at = new Date(attempt.attempted_at.getTime() + sr.intervalDays * DAY_MS);
        if (attempt.is_correct) freshValue.last_correct_at = attempt.attempted_at;
      }
      concept_mastery.push({ tag_id: tagId, value: freshValue });
    }
  }

  // ── stats: HIGH-only totals + non-LOW streak math ─────────────────────
  const stats: IUserStats = { ...current.stats };

  if (counts_for_mastery) {
    stats.total_questions_attempted = current.stats.total_questions_attempted + 1;
    if (attempt.is_correct) stats.total_correct = current.stats.total_correct + 1;
    stats.overall_accuracy =
      (stats.total_correct / stats.total_questions_attempted) * 100;
  }

  if (!isLow) {
    // Streak math must capture the OLD last_practice_date BEFORE we overwrite
    // it — previously `lastPractice` aliased the just-updated field, so the
    // streak counter was permanently stuck at 1 (audit #18).
    const prevPracticeDate = current.stats.last_practice_date;
    stats.last_practice_date = attempt.attempted_at;

    // Day-bucket comparison — round both timestamps to local midnight so
    // multiple attempts on the same calendar day don't churn the streak.
    const today = new Date(attempt.attempted_at);
    today.setHours(0, 0, 0, 0);
    if (prevPracticeDate) {
      const prev = new Date(prevPracticeDate);
      prev.setHours(0, 0, 0, 0);
      const daysDiff = Math.round((today.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 0) {
        // Same calendar day — leave streak unchanged.
      } else if (daysDiff === 1) {
        stats.streak_days = (current.stats.streak_days ?? 0) + 1;
      } else {
        // Missed a day or more — restart at 1.
        stats.streak_days = 1;
      }
    } else {
      // First-ever attempt — bootstrap streak.
      stats.streak_days = 1;
    }
  }

  return {
    recent_attempts,
    all_attempted_ids,
    chapter_progress,
    concept_mastery,
    stats,
    updated_at: new Date(),
  };
}
