import 'server-only';
import mongoose, { Schema } from 'mongoose';

// ============================================
// JUNIOR QUESTION MODEL
// Reusable practice-question bank for junior classes (grades 6–10).
// Powers livebook chapter-end practice + custom chapter tests.
//
// DELIBERATELY SEPARATE from Crucible's questions_v2 (JEE/NEET). This bank
// carries no exam metadata, no JEE taxonomy, no PYQ apparatus — junior
// content is multi-grade and simpler. Field names mirror questions_v2 where
// sensible (question_text.markdown, options[].id/text/is_correct,
// explanation.markdown) so the shared MathRenderer + option UI can be reused.
//
// Formats v1: 'mcq' and 'assertion_reason'. Richer formats (fill-blank, match)
// live as in-page book interactions (apply_challenge / classify_exercise), NOT
// in this bank — see docs/superpowers/specs/2026-06-08-class9-iit-foundation-
// question-mining.md.
//
// Collection: junior_questions
// ============================================

export type JuniorQuestionFormat = 'mcq' | 'assertion_reason';
export type JuniorConceptTag =
  | 'concept'
  | 'application'
  | 'numerical'
  | 'reasoning'
  | 'recall';
export type JuniorQuestionStatus = 'draft' | 'published' | 'flagged';

export interface IJuniorQuestionOption {
  id: string;             // 'a' | 'b' | 'c' | 'd'
  text: string;
  is_correct: boolean;
}

export interface IJuniorQuestion {
  _id: string;                    // UUID v4
  display_id: string;             // e.g. "C9SCI-MIX-001"

  // ── Placement ──
  grade: number;                  // 6–10
  subject: string;                // 'science' | 'maths' | 'physics' | ...
  book_slug?: string;             // e.g. 'class9-science'
  chapter_number: number;
  chapter_slug?: string;          // e.g. 'mixtures-and-separation'
  topic?: string;                 // micro-concept, free text e.g. 'chromatography'

  // ── Content ──
  format: JuniorQuestionFormat;
  question_text: {
    markdown: string;
    latex_validated: boolean;
  };
  // Assertion–Reason only (format === 'assertion_reason'):
  assertion?: string;
  reason?: string;

  options: IJuniorQuestionOption[];
  explanation: {
    markdown: string;
  };

  // ── Diagram (optional) ──
  image_src?: string;             // R2 asset URL; '' until uploaded
  image_prompt?: string;          // AI generation spec

  // ── Classification ──
  concept_tag: JuniorConceptTag;
  difficulty: 1 | 2 | 3;

  // ── Provenance / lifecycle ──
  source: string;                 // 'IIT_Foundation_Cl8' | 'original' | ...
  status: JuniorQuestionStatus;
  flags?: Array<{
    type: string;
    note?: string;
    flagged_at: Date;
    resolved: boolean;
    resolved_at?: Date;
  }>;

  deleted_at?: Date | null;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const OptionSchema = new Schema<IJuniorQuestionOption>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  is_correct: { type: Boolean, required: true, default: false },
}, { _id: false });

const JuniorQuestionSchema = new Schema<IJuniorQuestion>({
  _id: { type: String, required: true },
  display_id: { type: String, required: true },

  grade: { type: Number, required: true, min: 6, max: 10 },
  subject: { type: String, required: true },
  book_slug: { type: String },
  chapter_number: { type: Number, required: true },
  chapter_slug: { type: String },
  topic: { type: String },

  format: {
    type: String,
    enum: ['mcq', 'assertion_reason'],
    required: true,
    default: 'mcq',
  },
  question_text: {
    type: new Schema({
      markdown: { type: String, required: true, minlength: 3 },
      latex_validated: { type: Boolean, default: false },
    }, { _id: false }),
    required: true,
  },
  assertion: { type: String },
  reason: { type: String },

  options: {
    type: [OptionSchema],
    required: true,
    validate: {
      validator: (opts: IJuniorQuestionOption[]) =>
        Array.isArray(opts) && opts.length >= 2 && opts.some((o) => o.is_correct),
      message: 'A question needs at least 2 options with exactly one marked correct.',
    },
  },
  explanation: {
    type: new Schema({
      markdown: { type: String, default: '' },
    }, { _id: false }),
    default: () => ({ markdown: '' }),
  },

  image_src: { type: String },
  image_prompt: { type: String },

  concept_tag: {
    type: String,
    enum: ['concept', 'application', 'numerical', 'reasoning', 'recall'],
    required: true,
    default: 'concept',
  },
  difficulty: { type: Number, enum: [1, 2, 3], required: true, default: 1 },

  source: { type: String, default: 'original' },
  status: {
    type: String,
    enum: ['draft', 'published', 'flagged'],
    default: 'published',
  },
  flags: {
    type: [{
      type: { type: String, required: true },
      note: { type: String },
      flagged_at: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false },
      resolved_at: { type: Date },
    }],
    default: [],
  },

  deleted_at: { type: Date, default: null },
  created_by: { type: String, required: true },
  updated_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: false,
  collection: 'junior_questions',
});

// ── Indexes ───────────────────────────────────────────────────────────────────
// Primary list/practice query: by grade → subject → chapter, published & live.
JuniorQuestionSchema.index({ grade: 1, subject: 1, chapter_number: 1, status: 1, deleted_at: 1 });
JuniorQuestionSchema.index({ book_slug: 1, chapter_slug: 1, status: 1, deleted_at: 1 });
JuniorQuestionSchema.index({ display_id: 1 }, { unique: true });
JuniorQuestionSchema.index({ deleted_at: 1 });

export const JuniorQuestion =
  mongoose.models.JuniorQuestion ||
  mongoose.model<IJuniorQuestion>('JuniorQuestion', JuniorQuestionSchema);

export default JuniorQuestion;
