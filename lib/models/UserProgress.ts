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
  
  // Practice History
  recent_attempts: IQuestionAttempt[]; // Last 100 attempts
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
    required: true 
  },
  concept_tags: [{ type: String }],
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
  
  recent_attempts: { 
    type: [QuestionAttemptSchema], 
    default: [] 
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
    default: () => ({}) 
  },
  
  current_session: { 
    type: CurrentSessionSchema, 
    default: null 
  },
}, {
  timestamps: false,
  collection: 'user_progress',
});

// ============================================
// INDEXES
// ============================================

UserProgressSchema.index({ 'stats.last_practice_date': -1 });
UserProgressSchema.index({ 'stats.streak_days': -1 });
UserProgressSchema.index({ 'chapter_progress.chapter_id': 1 });

// ============================================
// INSTANCE METHODS
// ============================================

UserProgressSchema.methods.recordAttempt = async function(
  attempt: IQuestionAttempt
) {
  // Add to recent attempts (keep only last 100)
  this.recent_attempts.unshift(attempt);
  if (this.recent_attempts.length > 100) {
    this.recent_attempts = this.recent_attempts.slice(0, 100);
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
