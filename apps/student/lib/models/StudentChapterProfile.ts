import mongoose, { Schema } from 'mongoose';

// ============================================
// STUDENT CHAPTER PROFILE — Step 3 Upgrade
// Multi-dimensional proficiency model per student per chapter.
// One document per (studentId, chapterId) pair.
// Collection: student_chapter_profiles
// ============================================

export type ProficiencyLevel = 'unseen' | 'weak' | 'developing' | 'strong' | 'mastered';
export type DominantWeakness = 'concept-gap' | 'unclear-entry' | 'calc-error' | 'time-pressure' | 'silly-mistake' | null;

// Per cognitive-type or calc-load breakdown
export interface IDimensionBreakdown {
  attempts: number;
  correctCount: number;
  accuracyRate: number;  // 0.0–1.0
}

// Per micro-concept proficiency
export interface IMicroConceptProfile {
  microConcept: string;
  attempts: number;
  correctCount: number;
  accuracyRate: number;  // 0.0–1.0
  proficiencyLevel: ProficiencyLevel;

  // Stuck point counts (from StuckPointPrompt)
  stuckPointCounts: {
    'concept-gap': number;
    'unclear-entry': number;
    'calc-error': number;
    'time-pressure': number;
    'silly-mistake': number;
  };

  // Computed: the dominant reason for weakness (highest stuckPoint count, or null if healthy)
  dominantWeakness: DominantWeakness;

  lastPracticed: Date | null;
}

export interface IStudentChapterProfile {
  studentId: string;
  chapterId: string;

  // One entry per micro concept
  microConceptProfiles: IMicroConceptProfile[];

  // Chapter-level aggregates
  overallAccuracy: number;         // 0.0–1.0
  totalAttempts: number;
  totalCorrect: number;
  overallProficiency: ProficiencyLevel;

  // Last session tracking (for "never repeat" rule)
  recentSessionIds: string[];      // last 3 session IDs
  recentQuestionIds: string[];     // all question IDs from last 3 sessions

  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const DimensionBreakdownSchema = new Schema<IDimensionBreakdown>({
  attempts: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  accuracyRate: { type: Number, default: 0 },
}, { _id: false });

const MicroConceptProfileSchema = new Schema<IMicroConceptProfile>({
  microConcept: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  accuracyRate: { type: Number, default: 0 },
  proficiencyLevel: {
    type: String,
    enum: ['unseen', 'weak', 'developing', 'strong', 'mastered'],
    default: 'unseen',
  },
  stuckPointCounts: {
    type: {
      'concept-gap': { type: Number, default: 0 },
      'unclear-entry': { type: Number, default: 0 },
      'calc-error': { type: Number, default: 0 },
      'time-pressure': { type: Number, default: 0 },
      'silly-mistake': { type: Number, default: 0 },
    },
    default: () => ({
      'concept-gap': 0,
      'unclear-entry': 0,
      'calc-error': 0,
      'time-pressure': 0,
      'silly-mistake': 0,
    }),
  },
  dominantWeakness: {
    type: String,
    enum: ['concept-gap', 'unclear-entry', 'calc-error', 'time-pressure', 'silly-mistake', null],
    default: null,
  },
  lastPracticed: { type: Date, default: null },
}, { _id: false });

// ── Main schema ──────────────────────────────────────────────────────────────

const StudentChapterProfileSchema = new Schema<IStudentChapterProfile>({
  studentId: { type: String, required: true },
  chapterId: { type: String, required: true },

  microConceptProfiles: {
    type: [MicroConceptProfileSchema],
    default: [],
  },

  overallAccuracy: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  overallProficiency: {
    type: String,
    enum: ['unseen', 'weak', 'developing', 'strong', 'mastered'],
    default: 'unseen',
  },

  recentSessionIds: { type: [String], default: [] },
  recentQuestionIds: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'student_chapter_profiles',
});

// Unique compound index: one profile per student per chapter
StudentChapterProfileSchema.index({ studentId: 1, chapterId: 1 }, { unique: true });
StudentChapterProfileSchema.index({ studentId: 1, overallProficiency: 1 });

export const StudentChapterProfile =
  mongoose.models.StudentChapterProfile ||
  mongoose.model<IStudentChapterProfile>('StudentChapterProfile', StudentChapterProfileSchema);
