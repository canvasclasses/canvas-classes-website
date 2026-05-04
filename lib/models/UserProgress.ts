import mongoose, { Schema } from 'mongoose';
import { getTagName } from '@/lib/taxonomyLookup';

// ============================================
// USER PROGRESS MODEL - Track practice sessions
// Stores in MongoDB, references Supabase user ID
// ============================================

// Tiered signal — see CRUCIBLE_ARCHITECTURE.md §3.2.
//   high   : test mode + guided practice (intentional, focused)
//   medium : browse mode default (real practice but unverified intent)
//   low    : browse session the student retroactively flagged as casual
// Mastery surfaces (weak-spot widget, recommendation engine) read HIGH only.
// Exposure surfaces ("you've seen N questions") read HIGH + MEDIUM.
// LOW counts only as "last seen" — never as exposure or mastery.
export type AttemptConfidence = 'high' | 'medium' | 'low';

export interface IQuestionAttempt {
  question_id: string;
  display_id: string;
  chapter_id: string;
  is_correct: boolean;
  time_spent_seconds: number;
  attempted_at: Date;
  // Numeric scale 1-5 (matches Question.v2.ts `difficultyLevel`). Older
  // documents may carry the string form ('Easy'|'Medium'|'Hard') from the
  // legacy schema; the schema below accepts both via Mixed.
  difficulty: number | 'Easy' | 'Medium' | 'Hard';
  concept_tags: string[];
  source?: 'browse' | 'test' | 'guided'; // where the attempt came from
  selected_option?: string | string[] | number | null; // what the user chose
  // Tiered confidence — see AttemptConfidence above.
  confidence?: AttemptConfidence;
  // Browse-session id (uuid generated client-side per BrowseView mount).
  // The /api/v2/user/progress/session-confidence PATCH endpoint uses this to
  // retroactively reclassify every attempt in a session as casual.
  session_id?: string;
}

// Lightweight per-question index (never capped — used by test generator)
export interface IAttemptedIdEntry {
  question_id: string;
  chapter_id: string;
  times_attempted: number;
  times_correct: number;
  last_attempted_at: Date;
  last_correct_at?: Date; // for "correct recently" avoidance
}

// Starred / bookmarked question
export interface IStarredQuestion {
  question_id: string;
  chapter_id: string;
  starred_at: Date;
}

// One test session — used to enforce <20% overlap between tests
export interface ITestSession {
  chapter_id: string;
  question_ids: string[];
  started_at: Date;
  config: { count: number; mix: string };
}

export interface IChapterProgress {
  chapter_id: string;
  total_attempted: number;
  correct_count: number;
  accuracy_percentage: number;
  last_attempted_at: Date;
  mastery_level: 'Beginner' | 'Learning' | 'Proficient' | 'Mastered';
}

// Canonical concept-mastery shape — keyed by taxonomy tag_id (e.g. 'tag_atom_3').
// Used by the persona / recommendation engine to surface weak micro-concepts.
//
// History note (May 2026): we previously had `total_attempted/correct_count/
// weak_areas` here, but the only writer (the batch route) actually wrote
// `times_attempted/times_correct/last_attempted_at` and never set tag_id/
// tag_name — meaning the field silently captured a different shape. This
// canonical version matches what the writers actually do, plus the missing
// tag_id / tag_name / accuracy_percentage fields the engine needs.
//
// Existing pre-migration documents may still have the old field names — read
// paths should treat both as optional and prefer `times_*`. A one-time backfill
// at scripts/backfill_concept_mastery.js re-derives this map from
// recent_attempts and the taxonomy.
// Two parallel counter sets — see CRUCIBLE_ARCHITECTURE.md §4.2.
//   times_attempted/times_correct/accuracy_percentage
//     → MASTERY counters. HIGH-confidence attempts only (test + guided).
//     → drives weak-spot widget, recommendation engine, mastery_level.
//   exposure_count
//     → cumulative attempts across HIGH + MEDIUM (browse default).
//     → drives "you've seen N questions on X" / chapter familiarity displays.
//   LOW-confidence attempts (casual-tagged browse) update last_attempted_at
//     only — they count as "last seen" but contribute to neither set.
export interface IConceptMastery {
  tag_id: string;
  tag_name: string;
  // Mastery counters — HIGH only.
  times_attempted: number;
  times_correct: number;
  accuracy_percentage: number;
  // Exposure counter — HIGH + MEDIUM.
  exposure_count: number;
  last_attempted_at?: Date;
}

export interface IUserStats {
  total_questions_attempted: number;
  total_correct: number;
  overall_accuracy: number;
  streak_days: number;
  last_practice_date: Date;
  favorite_chapters: string[];
  weakest_chapters: string[];
}

export interface IUserProgress {
  _id: string; // Supabase user ID
  user_email: string;
  created_at: Date;
  updated_at: Date;

  // Rich attempt history (last 200 — for analytics feed)
  recent_attempts: IQuestionAttempt[];

  // Lightweight question index — uncapped, used by test generator
  all_attempted_ids: IAttemptedIdEntry[];

  // Starred / bookmarked questions
  starred_questions: IStarredQuestion[];

  // Last 10 test sessions — for overlap detection
  test_sessions: ITestSession[];

  chapter_progress: Map<string, IChapterProgress>;
  concept_mastery: Map<string, IConceptMastery>;

  // Statistics
  stats: IUserStats;

  // Session Data
  current_session: {
    started_at: Date;
    questions_attempted: number;
    correct_count: number;
    chapter_ids: string[];
  } | null;
}

// ============================================
// SCHEMAS
// ============================================

const QuestionAttemptSchema = new Schema<IQuestionAttempt>({
  question_id: { type: String, required: true },
  display_id: { type: String, required: true },
  chapter_id: { type: String, required: true },
  is_correct: { type: Boolean, required: true },
  time_spent_seconds: { type: Number, default: 0 },
  attempted_at: { type: Date, default: Date.now },
  // Mixed so writers can pass the numeric Question.v2 `difficultyLevel` (1-5)
  // OR the legacy string label. Previously a string-only enum that silently
  // failed validation on every write since clients send numbers. Read paths
  // should cope with both forms; long-term we standardise on numeric.
  difficulty: { type: Schema.Types.Mixed, required: true },
  concept_tags: [{ type: String }],
  source: { type: String, enum: ['browse', 'test', 'guided'], default: 'browse' },
  selected_option: { type: Schema.Types.Mixed, default: null },
  // See AttemptConfidence in IQuestionAttempt above. Default 'medium' is the
  // browse-mode default; route handlers override per source.
  confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'medium', index: true },
  session_id: { type: String, index: true },
}, { _id: false });

const AttemptedIdEntrySchema = new Schema<IAttemptedIdEntry>({
  question_id: { type: String, required: true },
  chapter_id: { type: String, required: true },
  times_attempted: { type: Number, default: 1 },
  times_correct: { type: Number, default: 0 },
  last_attempted_at: { type: Date, default: Date.now },
  last_correct_at: { type: Date },
}, { _id: false });

const StarredQuestionSchema = new Schema<IStarredQuestion>({
  question_id: { type: String, required: true },
  chapter_id: { type: String, required: true },
  starred_at: { type: Date, default: Date.now },
}, { _id: false });

const TestSessionSchema = new Schema<ITestSession>({
  chapter_id: { type: String, required: true },
  question_ids: [{ type: String }],
  started_at: { type: Date, default: Date.now },
  config: {
    count: { type: Number },
    mix: { type: String },
  },
}, { _id: false });

const ChapterProgressSchema = new Schema<IChapterProgress>({
  chapter_id: { type: String, required: true },
  total_attempted: { type: Number, default: 0 },
  correct_count: { type: Number, default: 0 },
  accuracy_percentage: { type: Number, default: 0 },
  last_attempted_at: { type: Date },
  mastery_level: {
    type: String,
    enum: ['Beginner', 'Learning', 'Proficient', 'Mastered'],
    default: 'Beginner',
  },
}, { _id: false });

const ConceptMasterySchema = new Schema<IConceptMastery>({
  // tag_id is also the Map key; storing it here too makes flat reads easier
  // and keeps the document self-describing if rehydrated from a lean query.
  tag_id: { type: String, required: true },
  tag_name: { type: String, required: true },
  // Mastery counters — HIGH-confidence only. See IConceptMastery comment.
  times_attempted: { type: Number, default: 0 },
  times_correct: { type: Number, default: 0 },
  accuracy_percentage: { type: Number, default: 0 },
  // Exposure counter — HIGH + MEDIUM.
  exposure_count: { type: Number, default: 0 },
  last_attempted_at: { type: Date },
}, { _id: false });

const UserStatsSchema = new Schema<IUserStats>({
  total_questions_attempted: { type: Number, default: 0 },
  total_correct: { type: Number, default: 0 },
  overall_accuracy: { type: Number, default: 0 },
  streak_days: { type: Number, default: 0 },
  last_practice_date: { type: Date },
  favorite_chapters: [{ type: String }],
  weakest_chapters: [{ type: String }],
}, { _id: false });

const CurrentSessionSchema = new Schema({
  started_at: { type: Date, required: true },
  questions_attempted: { type: Number, default: 0 },
  correct_count: { type: Number, default: 0 },
  chapter_ids: [{ type: String }],
}, { _id: false });

// ============================================
// MAIN USER PROGRESS SCHEMA
// ============================================

const UserProgressSchema = new Schema<IUserProgress>({
  _id: {
    type: String,
    required: true,
    // This is the Supabase user ID
  },
  user_email: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

  // Rich attempt history — capped at 200 for the analytics feed
  recent_attempts: {
    type: [QuestionAttemptSchema],
    default: [],
  },

  // Lightweight index — uncapped, keyed by question_id, used by test generator
  all_attempted_ids: {
    type: [AttemptedIdEntrySchema],
    default: [],
  },

  // Starred / bookmarked questions
  starred_questions: {
    type: [StarredQuestionSchema],
    default: [],
  },

  // Last 10 test sessions — for <20% overlap enforcement
  test_sessions: {
    type: [TestSessionSchema],
    default: [],
  },

  chapter_progress: {
    type: Map,
    of: ChapterProgressSchema,
    default: new Map(),
  },

  concept_mastery: {
    type: Map,
    of: ConceptMasterySchema,
    default: new Map(),
  },

  stats: {
    type: UserStatsSchema,
    default: () => ({}),
  },

  current_session: {
    type: CurrentSessionSchema,
    default: null,
  },
}, {
  timestamps: false,
  collection: 'user_progress',
  optimisticConcurrency: true, // use __v to detect concurrent modifications
});

// ============================================
// INDEXES
// ============================================

UserProgressSchema.index({ 'stats.last_practice_date': -1 });
UserProgressSchema.index({ 'stats.streak_days': -1 });
UserProgressSchema.index({ 'chapter_progress.chapter_id': 1 });
UserProgressSchema.index({ 'starred_questions.question_id': 1 });
UserProgressSchema.index({ 'all_attempted_ids.question_id': 1 });
UserProgressSchema.index({ 'all_attempted_ids.chapter_id': 1 });
UserProgressSchema.index({ 'test_sessions.chapter_id': 1 });

// ============================================
// INSTANCE METHODS
// ============================================

UserProgressSchema.methods.recordAttempt = async function (
  attempt: IQuestionAttempt
) {
  // Add to recent attempts (keep only last 200 — for analytics feed)
  this.recent_attempts.unshift(attempt);
  if (this.recent_attempts.length > 200) {
    this.recent_attempts = this.recent_attempts.slice(0, 200);
  }

  // Effective tier (default is 'medium' if the writer didn't set one). Drives
  // every counter decision below — see CRUCIBLE_ARCHITECTURE.md §3.2 and §4.2.
  const tier: AttemptConfidence = attempt.confidence ?? 'medium';
  const isHigh = tier === 'high';
  const isLow = tier === 'low';
  const counts_for_mastery = isHigh;        // mastery counters: high only
  const counts_for_exposure = !isLow;       // exposure: high + medium

  // Update lightweight all_attempted_ids index — used by the test generator
  // to avoid recently-shown questions. Counts test attempts (source: 'test')
  // for the historic "avoid recently-tested" logic, AND any high-confidence
  // attempt for cross-mode dedup. Browse-medium and browse-low intentionally
  // do not populate this — browsing the question bank shouldn't burn a
  // question for the test generator.
  if (attempt.source === 'test' || isHigh) {
    const existingIdx = this.all_attempted_ids.findIndex(
      (e: IAttemptedIdEntry) => e.question_id === attempt.question_id
    );
    if (existingIdx >= 0) {
      this.all_attempted_ids[existingIdx].times_attempted += 1;
      this.all_attempted_ids[existingIdx].last_attempted_at = attempt.attempted_at;
      if (attempt.is_correct) {
        this.all_attempted_ids[existingIdx].times_correct += 1;
        this.all_attempted_ids[existingIdx].last_correct_at = attempt.attempted_at;
      }
    } else {
      this.all_attempted_ids.push({
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
    const chapterProg = this.chapter_progress.get(chapterId) || {
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
    this.chapter_progress.set(chapterId, chapterProg);
  }

  // concept_mastery — the persona substrate. Two parallel counter sets:
  //   - times_* / accuracy_percentage : HIGH only (mastery)
  //   - exposure_count                : HIGH + MEDIUM
  //   - last_attempted_at             : updated regardless (last-seen signal)
  // LOW (casual-tagged browse) only updates last_attempted_at.
  for (const tagId of attempt.concept_tags ?? []) {
    if (!tagId) continue;
    const existing = this.concept_mastery.get(tagId);
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
      this.concept_mastery.set(tagId, {
        tag_id: tagId,
        tag_name: getTagName(tagId),
        times_attempted: counts_for_mastery ? 1 : 0,
        times_correct: counts_for_mastery && attempt.is_correct ? 1 : 0,
        accuracy_percentage: counts_for_mastery ? (attempt.is_correct ? 100 : 0) : 0,
        exposure_count: counts_for_exposure ? 1 : 0,
        last_attempted_at: attempt.attempted_at,
      });
    }
  }

  // Overall stats — HIGH only. Browse should not inflate the overall_accuracy
  // shown on the dashboard, since that number is the student's "official"
  // mastery percentage.
  if (counts_for_mastery) {
    this.stats.total_questions_attempted += 1;
    if (attempt.is_correct) this.stats.total_correct += 1;
    this.stats.overall_accuracy =
      (this.stats.total_correct / this.stats.total_questions_attempted) * 100;
  }
  // last_practice_date + streak update for any non-low attempt (drives the
  // streak chip on the welcome dashboard). Streak math must capture the OLD
  // last_practice_date BEFORE we overwrite it — previously daysDiff was
  // always 0 because `lastPractice` aliased the just-updated field, so the
  // streak counter was permanently stuck at 1 (audit #18).
  if (!isLow) {
    const prevPracticeDate = this.stats.last_practice_date;
    this.stats.last_practice_date = attempt.attempted_at;

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
        this.stats.streak_days = (this.stats.streak_days ?? 0) + 1;
      } else {
        // Missed a day or more — restart at 1.
        this.stats.streak_days = 1;
      }
    } else {
      // First-ever attempt — bootstrap streak.
      this.stats.streak_days = 1;
    }
  }

  this.updated_at = new Date();
  await this.save();
};

/**
 * Reclassifies every attempt in a browse session to a new confidence tier.
 *
 * Called by PATCH /api/v2/user/progress/session-confidence when a student
 * retroactively flags a browse session as casual ('low'). The flow:
 *   1. Find every recent_attempt with this session_id whose confidence
 *      doesn't already match the target tier.
 *   2. For each such attempt, REVERSE its impact on concept_mastery /
 *      chapter_progress / stats (using the old tier rules), then RE-APPLY
 *      using the new tier rules. Net effect: counters reflect the new tier.
 *   3. Update the attempt's confidence in place.
 *
 * Only operates on the recent_attempts window (last 200). Older attempts
 * cannot be reclassified — by design, a casual mark must happen during/right
 * after the session.
 *
 * Returns the number of attempts reclassified.
 */
UserProgressSchema.methods.reclassifyBrowseSession = function (
  sessionId: string,
  newConfidence: AttemptConfidence,
): number {
  if (!sessionId) return 0;
  let changed = 0;
  for (const a of this.recent_attempts as IQuestionAttempt[]) {
    if (a.session_id !== sessionId) continue;
    const oldTier: AttemptConfidence = a.confidence ?? 'medium';
    if (oldTier === newConfidence) continue;

    const oldCountsMastery = oldTier === 'high';
    const oldCountsExposure = oldTier !== 'low';
    const newCountsMastery = newConfidence === 'high';
    const newCountsExposure = newConfidence !== 'low';

    // ── concept_mastery deltas ────────────────────────────────────────
    for (const tagId of a.concept_tags ?? []) {
      const m = this.concept_mastery.get(tagId);
      if (!m) continue;

      // Mastery counter delta
      if (oldCountsMastery && !newCountsMastery) {
        m.times_attempted = Math.max(0, m.times_attempted - 1);
        if (a.is_correct) m.times_correct = Math.max(0, m.times_correct - 1);
      } else if (!oldCountsMastery && newCountsMastery) {
        m.times_attempted += 1;
        if (a.is_correct) m.times_correct += 1;
      }
      m.accuracy_percentage = m.times_attempted > 0
        ? Math.round((m.times_correct / m.times_attempted) * 100)
        : 0;

      // Exposure counter delta
      if (oldCountsExposure && !newCountsExposure) {
        m.exposure_count = Math.max(0, (m.exposure_count ?? 0) - 1);
      } else if (!oldCountsExposure && newCountsExposure) {
        m.exposure_count = (m.exposure_count ?? 0) + 1;
      }

      this.concept_mastery.set(tagId, m);
    }

    // ── chapter_progress delta (mastery only) ────────────────────────
    if (oldCountsMastery !== newCountsMastery) {
      const cp = this.chapter_progress.get(a.chapter_id);
      if (cp) {
        if (oldCountsMastery && !newCountsMastery) {
          cp.total_attempted = Math.max(0, cp.total_attempted - 1);
          if (a.is_correct) cp.correct_count = Math.max(0, cp.correct_count - 1);
        } else {
          cp.total_attempted += 1;
          if (a.is_correct) cp.correct_count += 1;
        }
        cp.accuracy_percentage = cp.total_attempted > 0
          ? (cp.correct_count / cp.total_attempted) * 100
          : 0;
        this.chapter_progress.set(a.chapter_id, cp);
      }
    }

    // ── stats delta (mastery only) ───────────────────────────────────
    if (oldCountsMastery !== newCountsMastery) {
      if (oldCountsMastery && !newCountsMastery) {
        this.stats.total_questions_attempted = Math.max(0, this.stats.total_questions_attempted - 1);
        if (a.is_correct) this.stats.total_correct = Math.max(0, this.stats.total_correct - 1);
      } else {
        this.stats.total_questions_attempted += 1;
        if (a.is_correct) this.stats.total_correct += 1;
      }
      this.stats.overall_accuracy = this.stats.total_questions_attempted > 0
        ? (this.stats.total_correct / this.stats.total_questions_attempted) * 100
        : 0;
    }

    a.confidence = newConfidence;
    changed += 1;
  }
  if (changed > 0) {
    this.markModified('recent_attempts');
    this.markModified('concept_mastery');
    this.markModified('chapter_progress');
    this.markModified('stats');
    this.updated_at = new Date();
  }
  return changed;
};

// ============================================
// MODEL EXPORT
// ============================================

export const UserProgress = mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
