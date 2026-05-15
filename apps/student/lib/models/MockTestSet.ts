import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// MOCK TEST SET MODEL
// Pre-curated mock test papers for final-stage prep.
// Completely separate from the chapter practice bank (questions_v2).
// Collection: mock_test_sets
// ============================================

export interface IMockTestQuestion {
  _id: string;                // UUID v4
  question_number: number;   // Position in the paper (1-indexed)
  display_id: string;        // e.g., "MT-JEE-001-Q042"

  question_text: {
    markdown: string;
    latex_validated: boolean;
    last_validated_at?: Date;
  };

  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ';

  options: Array<{
    id: string;
    text: string;
    is_correct: boolean;
    asset_ids?: string[];
  }>;

  answer?: {
    integer_value?: number;
    decimal_value?: number;
    tolerance?: number;
    unit?: string;
  };

  solution: {
    text_markdown: string;
    latex_validated: boolean;
    asset_ids?: {
      images?: string[];
      svg?: string[];
      audio?: string[];
    };
    video_url?: string;
    video_timestamp_start?: number;
  };

  metadata: {
    subject: 'chemistry' | 'physics' | 'maths' | 'biology';
    difficultyLevel: 1 | 2 | 3 | 4 | 5;
    marks_correct?: number;       // e.g., +4
    marks_incorrect?: number;     // e.g., -1
    section?: string;             // e.g., "Section A", "Section B"
    topic_hint?: string;          // optional: chapter/topic this question tests
  };

  flags?: Array<{
    type: string;
    note?: string;
    flagged_at: Date;
    resolved: boolean;
    resolved_at?: Date;
  }>;

  asset_ids?: string[];

  svg_scales?: {
    question?: number;
    solution?: number;
    [key: string]: number | undefined;
  };

  created_at: Date;
  updated_at: Date;
}

export interface IMockTestSet {
  _id: string;                       // UUID v4
  title: string;                     // e.g., "NEET Mock Test 1 · 2025"
  slug?: string;                     // URL-friendly, e.g., "neet-mock-1-2025"
  exam: 'JEE' | 'NEET';
  year?: number;                     // e.g., 2025
  source?: string;                   // e.g., "NTA Abhyaas", "Custom", "Allen"
  duration_minutes: number;          // 180 (JEE) or 200 (NEET)

  // Marking scheme defaults (can be overridden per-question)
  marks_correct: number;             // default +4
  marks_incorrect: number;           // default -1

  // Sections (optional structure)
  sections?: Array<{
    name: string;                    // e.g., "Physics", "Chemistry", "Biology"
    question_range: [number, number]; // [from, to] question numbers (1-indexed)
  }>;

  questions: IMockTestQuestion[];    // Embedded — full question data

  status: 'draft' | 'published' | 'archived';
  description?: string;              // Admin notes / brief

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  deleted_by?: string;
  created_by: string;
  updated_by: string;
}

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const MockQuestionTextSchema = new Schema({
  markdown: { type: String, required: true, minlength: 5 },
  latex_validated: { type: Boolean, default: false },
  last_validated_at: { type: Date },
}, { _id: false });

const MockQuestionOptionSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  is_correct: { type: Boolean, required: true },
  asset_ids: [{ type: String }],
}, { _id: false });

const MockQuestionAnswerSchema = new Schema({
  integer_value: { type: Number },
  decimal_value: { type: Number },
  tolerance: { type: Number },
  unit: { type: String },
}, { _id: false });

const MockQuestionSolutionSchema = new Schema({
  text_markdown: { type: String, default: '' },
  latex_validated: { type: Boolean, default: false },
  asset_ids: {
    images: [{ type: String }],
    svg: [{ type: String }],
    audio: [{ type: String }],
  },
  video_url: { type: String },
  video_timestamp_start: { type: Number },
}, { _id: false });

const MockQuestionMetadataSchema = new Schema({
  subject: {
    type: String,
    enum: ['chemistry', 'physics', 'maths', 'biology'],
    required: true,
  },
  difficultyLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
    default: 3,
  },
  marks_correct: { type: Number },
  marks_incorrect: { type: Number },
  section: { type: String },
  topic_hint: { type: String },
}, { _id: false });

const MockTestQuestionSchema = new Schema<IMockTestQuestion>({
  _id: { type: String, required: true },
  question_number: { type: Number, required: true },
  display_id: { type: String, required: true },

  question_text: { type: MockQuestionTextSchema, required: true },
  type: {
    type: String,
    enum: ['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC', 'SUBJ'],
    required: true,
  },
  options: [MockQuestionOptionSchema],
  answer: MockQuestionAnswerSchema,
  solution: { type: MockQuestionSolutionSchema, required: true },
  metadata: { type: MockQuestionMetadataSchema, required: true },

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

  asset_ids: [{ type: String }],
  svg_scales: { type: Schema.Types.Mixed, default: {} },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { _id: false }); // _id handled manually as UUID string

// ── Root schema ───────────────────────────────────────────────────────────────

const MockTestSetSchema = new Schema<IMockTestSet>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String },
  exam: { type: String, enum: ['JEE', 'NEET'], required: true },
  year: { type: Number },
  source: { type: String },
  duration_minutes: { type: Number, required: true, default: 180 },
  marks_correct: { type: Number, default: 4 },
  marks_incorrect: { type: Number, default: -1 },

  sections: [{
    name: { type: String, required: true },
    question_range: { type: [Number], required: true },
    _id: false,
  }],

  questions: [MockTestQuestionSchema],

  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  description: { type: String },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
  deleted_by: { type: String },
  created_by: { type: String, required: true },
  updated_by: { type: String, required: true },
}, {
  timestamps: false,
  collection: 'mock_test_sets',
});

// Indexes
MockTestSetSchema.index({ exam: 1, status: 1 });
MockTestSetSchema.index({ slug: 1 }, { sparse: true });
MockTestSetSchema.index({ deleted_at: 1 });

// Pre-save: bump updated_at
// Note: no `next` param — we set updated_at manually in the API routes anyway,
// so just remove the hook entirely to avoid version-specific Mongoose issues.


export const MockTestSet =
  mongoose.models.MockTestSet ||
  mongoose.model<IMockTestSet>('MockTestSet', MockTestSetSchema);
