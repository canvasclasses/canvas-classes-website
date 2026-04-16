import mongoose, { Schema } from 'mongoose';

// ============================================
// USER PROGRESS MODEL - Track practice sessions
// Stores in MongoDB, references Supabase user ID
// ============================================

export interface IQuestionAttempt {
  question_id: string;
  display_id: string;
  chapter_id: string;
  is_correct: boolean;
  time_spent_seconds: number;
  attempted_at: Date;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concept_tags: string[];
  source?: 'browse' | 'test'; // where the attempt came from
  selected_option?: string | string[] | number | null; // what the user chose
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

export interface IConceptMastery {
  tag_id: string;
  tag_name: string;
  total_attempted: number;
  correct_count: number;
  accuracy_percentage: number;
  weak_areas: string[];
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
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  concept_tags: [{ type: String }],
  source: { type: String, enum: ['browse', 'test'], default: 'browse' },
  selected_option: { type: Schema.Types.Mixed, default: null },
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
  tag_id: { type: String, required: true },
  tag_name: { type: String, required: true },
  total_attempted: { type: Number, default: 0 },
  correct_count: { type: Number, default: 0 },
  accuracy_percentage: { type: Number, default: 0 },
  weak_areas: [{ type: String }],
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

  // Update lightweight all_attempted_ids index — ONLY for real test attempts.
  // Browse-mode attempts (source: 'browse') go to recent_attempts only and do NOT
  // influence the test generator scoring.
  if (attempt.source === 'test') {
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

  // Update chapter progress
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
  if (attempt.is_correct) {
    chapterProg.correct_count += 1;
  }
  chapterProg.accuracy_percentage =
    (chapterProg.correct_count / chapterProg.total_attempted) * 100;
  chapterProg.last_attempted_at = attempt.attempted_at;

  // Update mastery level
  if (chapterProg.total_attempted >= 20 && chapterProg.accuracy_percentage >= 80) {
    chapterProg.mastery_level = 'Mastered';
  } else if (chapterProg.total_attempted >= 10 && chapterProg.accuracy_percentage >= 60) {
    chapterProg.mastery_level = 'Proficient';
  } else if (chapterProg.total_attempted >= 5) {
    chapterProg.mastery_level = 'Learning';
  }

  this.chapter_progress.set(chapterId, chapterProg);

  // Update overall stats
  this.stats.total_questions_attempted += 1;
  if (attempt.is_correct) {
    this.stats.total_correct += 1;
  }
  this.stats.overall_accuracy =
    (this.stats.total_correct / this.stats.total_questions_attempted) * 100;
  this.stats.last_practice_date = attempt.attempted_at;

  // Update streak
  const today = new Date();
  const lastPractice = this.stats.last_practice_date;
  if (lastPractice) {
    const daysDiff = Math.floor(
      (today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff === 1) {
      this.stats.streak_days += 1;
    } else if (daysDiff > 1) {
      this.stats.streak_days = 1;
    }
  }

  this.updated_at = new Date();
  await this.save();
};

// ============================================
// MODEL EXPORT
// ============================================

export const UserProgress = mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
