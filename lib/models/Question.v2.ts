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

export interface IQuestion {
  _id: string; // UUID v4
  display_id: string; // e.g., "ATOM-001"
  
  question_text: IQuestionText;
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
  options: IQuestionOption[];
  answer?: IQuestionAnswer;
  solution: IQuestionSolution;
  metadata: IQuestionMetadata;
  
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

const QuestionSchema = new Schema<IQuestion>({
  _id: { 
    type: String, 
    required: true,
    match: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  },
  display_id: { 
    type: String, 
    required: true,
    unique: true,
    match: /^[A-Z]{4}-\d{3}$/
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
  
  asset_ids: [{ type: String }]
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
