import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// STUDENT RESPONSE MODEL — Step 2 Upgrade
// Records every question attempt in a guided practice session.
// One document per attempt. Append-only — never update or delete.
// Collection: student_responses
// ============================================

export type StuckPoint = 'concept-gap' | 'unclear-entry' | 'calc-error' | 'time-pressure' | 'silly-mistake';
export type SessionPhase = 'diagnostic' | 'practice';
export type MicroFeedbackValue = 'too_hard' | 'got_it' | 'too_easy';

export interface IStudentResponse {
  studentId: string;
  sessionId: string;
  questionId: string;

  // question context (copied from question at time of attempt)
  primaryConcept: string;
  microConcept: string;
  cognitiveType: string;
  calcLoad: string;
  entryPoint: string;

  // what the student did
  answeredCorrectly: boolean;
  timeSpentMs: number;
  viewedSolutionBeforeAnswer: boolean;
  microFeedback: MicroFeedbackValue;

  // follow-up (only when microFeedback is too_hard or answeredCorrectly is false)
  stuckPoint: StuckPoint | null;

  // session context
  sessionPhase: SessionPhase;
  positionInSession: number;
  timestamp: Date;
}

const StudentResponseSchema = new Schema<IStudentResponse>({
  studentId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  questionId: { type: String, required: true },

  // question context
  primaryConcept: { type: String, default: '' },
  microConcept: { type: String, default: '' },
  cognitiveType: {
    type: String,
    enum: ['recall', 'conceptual', 'application', 'procedural', 'multi-step', 'analytical', ''],
    default: '',
  },
  calcLoad: {
    type: String,
    enum: ['calc-none', 'calc-light', 'calc-moderate', 'calc-heavy', 'calc-trap', ''],
    default: '',
  },
  entryPoint: {
    type: String,
    enum: ['clear-entry', 'strategy-first', 'novel-framing', ''],
    default: '',
  },

  // what the student did
  answeredCorrectly: { type: Boolean, required: true },
  timeSpentMs: { type: Number, required: true },
  viewedSolutionBeforeAnswer: { type: Boolean, default: false },
  microFeedback: {
    type: String,
    enum: ['too_hard', 'got_it', 'too_easy'],
    required: true,
  },

  // follow-up
  stuckPoint: {
    type: String,
    enum: ['concept-gap', 'unclear-entry', 'calc-error', 'time-pressure', 'silly-mistake', null],
    default: null,
  },

  // session context
  sessionPhase: {
    type: String,
    enum: ['diagnostic', 'practice'],
    required: true,
  },
  positionInSession: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'student_responses',
});

// Compound indexes for common queries
StudentResponseSchema.index({ studentId: 1, sessionId: 1 });
StudentResponseSchema.index({ studentId: 1, microConcept: 1 });
StudentResponseSchema.index({ studentId: 1, timestamp: -1 });
StudentResponseSchema.index({ questionId: 1 }); // for communityDifficulty aggregation

export const StudentResponse =
  mongoose.models.StudentResponse ||
  mongoose.model<IStudentResponse>('StudentResponse', StudentResponseSchema);
