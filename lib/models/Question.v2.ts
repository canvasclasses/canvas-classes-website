import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// NEW QUESTION MODEL - V2 Architecture
// UUID-based, Asset-tracked, Audit-enabled
// ============================================

export interface IQuestionText {
  markdown: string;
  latex_validated: boolean;
  last_validated_at?: Date;
}

export interface IQuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  asset_ids?: string[]; // References to Asset collection
}

export interface IQuestionAnswer {
  integer_value?: number;
  decimal_value?: number;
  tolerance?: number;
  unit?: string;
}

export interface IQuestionSolution {
  text_markdown: string;
  latex_validated: boolean;
  asset_ids?: {
    images?: string[];
    svg?: string[];
    audio?: string[];
  };
  video_url?: string;
  video_timestamp_start?: number;
}

export interface IQuestionMetadata {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chapter_id: string;
  tags: Array<{
    tag_id: string;
    weight: number;
  }>;
  exam_source?: {
    exam: string;
    year?: number;
    month?: string;
    day?: number;
    shift?: string;
    question_number?: string;
  };
  is_pyq: boolean;
  is_top_pyq: boolean;
}

export interface IQuestionFlag {
  type: string;   // e.g. 'latex_rendering', 'question_mismatch', etc.
  note?: string;  // optional free-text note
  flagged_at: Date;
  resolved: boolean;
  resolved_at?: Date;
}

export interface IQuestion {
  _id: string; // UUID v4
  display_id: string; // e.g., "ATOM-001"
  
  question_text: IQuestionText;
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
  options: IQuestionOption[];
  answer?: IQuestionAnswer;
  solution: IQuestionSolution;
  metadata: IQuestionMetadata;
  
  flags?: IQuestionFlag[];

  status: 'draft' | 'review' | 'published' | 'archived';
  quality_score: number; // 0-100
  needs_review: boolean;
  review_notes?: string;
  
  version: number;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  
  deleted_at?: Date;
  deleted_by?: string;
  
  asset_ids: string[]; // All assets used in this question
  svg_scales?: {
    question?: number;
    solution?: number;
    [key: string]: number | undefined; // option_a, option_b, option_c, option_d
  };
}

const QuestionTextSchema = new Schema<IQuestionText>({
  markdown: { type: String, required: true, minlength: 10 },
  latex_validated: { type: Boolean, default: false },
  last_validated_at: { type: Date }
}, { _id: false });

const QuestionOptionSchema = new Schema<IQuestionOption>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  is_correct: { type: Boolean, required: true },
  asset_ids: [{ type: String }]
}, { _id: false });

const QuestionAnswerSchema = new Schema<IQuestionAnswer>({
  integer_value: { type: Number },
  decimal_value: { type: Number },
  tolerance: { type: Number },
  unit: { type: String }
}, { _id: false });

const QuestionSolutionSchema = new Schema<IQuestionSolution>({
  text_markdown: { type: String, required: true, minlength: 20 },
  latex_validated: { type: Boolean, default: false },
  asset_ids: {
    images: [{ type: String }],
    svg: [{ type: String }],
    audio: [{ type: String }]
  },
  video_url: { type: String },
  video_timestamp_start: { type: Number }
}, { _id: false });

const QuestionMetadataSchema = new Schema<IQuestionMetadata>({
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true 
  },
  chapter_id: { type: String, required: true },
  tags: [{
    tag_id: { type: String, required: true },
    weight: { type: Number, required: true, min: 0, max: 1 }
  }],
  exam_source: {
    exam: { type: String },
    year: { type: Number },
    month: { type: String },
    day: { type: Number },
    shift: { type: String },
    question_number: { type: String }
  },
  is_pyq: { type: Boolean, default: false },
  is_top_pyq: { type: Boolean, default: false }
}, { _id: false });

// ─────────────────────────────────────────────────────────────────────────────
// DISPLAY_ID FORMAT — CANONICAL REFERENCE
// Format: {PREFIX}-{NNN}  where PREFIX is 2–10 uppercase alphanumeric chars
// and NNN is 3+ digits (zero-padded).
//
// ALL known prefixes in production (questions_v2 collection):
//   MOLE   → ch11_mole          (Some Basic Concepts)
//   ATOM   → ch11_atom          (Structure of Atom)
//   PERI   → ch11_periodic      (Periodicity)
//   BOND   → ch11_bonding       (Chemical Bonding)
//   THERMO → ch11_thermo        (Thermodynamics)      ← 6 chars
//   CEQ    → ch11_chem_eq       (Chemical Equilibrium) ← 3 chars
//   IEQ    → ch11_ionic_eq      (Ionic Equilibrium)   ← 3 chars
//   RDX    → ch11_redox         (Redox)               ← 3 chars
//   GOC    → ch11_goc           (GOC)
//   HC     → ch11_hydrocarbon   (Hydrocarbons)        ← 2 chars
//   SOL    → ch12_solutions     (Solutions)
//   EC     → ch12_electrochem   (Electrochemistry)    ← 2 chars
//   CK     → ch12_kinetics      (Chemical Kinetics)   ← 2 chars
//   ALDO   → ch12_carbonyl      (Aldehydes, Ketones and Carboxylic Acids)
//           NOTE: ch12_aldehydes + ch12_carboxylic merged → ch12_carbonyl (commit e99b756)
//           CARB prefix (2 docs: CARB-001, CARB-002) kept as-is for continuity.
//           All new questions use ALDO prefix. Next available: ALDO-259
//   PB11   → ch11_pblock        (P-Block 11)          ← 4 chars with digit
//   PB12   → ch12_pblock        (P-Block 12)          ← 4 chars with digit
//   DNF    → ch12_dblock        (D & F Block)         ← 3 chars
//   CORD   → ch12_coord         (Coordination Compounds)
//   BIO    → ch12_biomolecules  (Biomolecules)
//   POC    → ch11_prac_org      (Practical Organic)
//
// RULE: When adding a new chapter, add its prefix here BEFORE writing any
// insertion scripts, and verify the regex below still matches it.
// REGEX: ^[A-Z0-9]{2,10}-\d{3,}$
// ─────────────────────────────────────────────────────────────────────────────

const QuestionSchema = new Schema<IQuestion>({
  _id: { 
    type: String, 
    required: true
    // UUID v4 format — all AI-agent batch scripts must use uuidv4() for _id.
    // Regex validation intentionally removed: Mongoose validates on write only,
    // and a strict regex here causes .find()/.lean() to silently drop documents
    // whose _id was inserted by an older script. Validation is enforced at the
    // insertion script level instead (see QUESTION_INGESTION_WORKFLOW.md Rule 15).
  },
  display_id: { 
    type: String, 
    required: true,
    unique: true,
    // Matches all known prefixes: 2–10 uppercase alphanumeric chars, dash, 3+ digits.
    // See canonical prefix table above. Update the table when adding new chapters.
    match: /^[A-Z0-9]{2,10}-\d{3,}$/
  },
  
  question_text: { type: QuestionTextSchema, required: true },
  type: { 
    type: String, 
    enum: ['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC'], 
    required: true 
  },
  options: [QuestionOptionSchema],
  answer: QuestionAnswerSchema,
  solution: { type: QuestionSolutionSchema, required: true },
  metadata: { type: QuestionMetadataSchema, required: true },
  
  status: { 
    type: String, 
    enum: ['draft', 'review', 'published', 'archived'], 
    default: 'draft' 
  },
  quality_score: { type: Number, default: 50, min: 0, max: 100 },
  needs_review: { type: Boolean, default: false },
  review_notes: { type: String },
  
  version: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  updated_by: { type: String, required: true },
  
  deleted_at: { type: Date },
  deleted_by: { type: String },
  
  asset_ids: [{ type: String }],
  flags: {
    type: [{
      type: { type: String, required: true },
      note: { type: String },
      flagged_at: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false },
      resolved_at: { type: Date }
    }],
    default: []
  },
  svg_scales: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: false, // We manage timestamps manually
  collection: 'questions_v2'
});

// Indexes for performance
QuestionSchema.index({ display_id: 1 }, { unique: true });
QuestionSchema.index({ 'metadata.chapter_id': 1, status: 1 });
QuestionSchema.index({ 'metadata.tags.tag_id': 1 });
QuestionSchema.index({ status: 1, created_at: -1 });
QuestionSchema.index({ deleted_at: 1 }); // For soft deletes
QuestionSchema.index({ 'metadata.exam_source.year': 1, 'metadata.exam_source.exam': 1 });

// Pre-save middleware to update timestamps
QuestionSchema.pre('save', function(this: any, next: any) {
  this.updated_at = new Date();
  next();
});

export const QuestionV2 = mongoose.models.QuestionV2 || mongoose.model<IQuestion>('QuestionV2', QuestionSchema);
