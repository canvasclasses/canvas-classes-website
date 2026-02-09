/**
 * The Crucible - Mongoose Models (TypeScript Version)
 * 
 * These models define the MongoDB collections for The Crucible's "Brain"
 */

import { mongoose } from '@/lib/mongodb';

const { Schema } = mongoose;

// ============================================
// TAXONOMY MODEL (The Skill Tree)
// ============================================

export interface ITaxonomy {
    _id: string;
    name: string;
    parent_id: string | null;
    subject: 'Chemistry' | 'Physics' | 'Mathematics' | 'Biology';
    chapter: string;
    remedial_video_url?: string;
    remedial_notes_url?: string;
    question_count: number;
    avg_accuracy: number;
    avg_time_sec: number;
    is_active: boolean;
    is_chapter_tag?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const TaxonomySchema = new Schema<ITaxonomy>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    parent_id: { type: String, ref: 'Taxonomy', default: null },
    subject: {
        type: String,
        enum: ['Chemistry', 'Physics', 'Mathematics', 'Biology'],
        required: true
    },
    chapter: { type: String },
    remedial_video_url: { type: String },
    remedial_notes_url: { type: String },
    question_count: { type: Number, default: 0 },
    avg_accuracy: { type: Number, default: 0 },
    avg_time_sec: { type: Number, default: 120 },
    is_active: { type: Boolean, default: true },
    is_chapter_tag: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: 'taxonomy'
});

TaxonomySchema.index({ parent_id: 1 });
TaxonomySchema.index({ subject: 1, chapter: 1 });

// ============================================
// QUESTION MODEL (The Content)
// ============================================

export interface IWeightedTag {
    tag_id: string;
    weight: number;
}

export interface IOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface ISolution {
    text_latex: string;
    video_url?: string;
    video_timestamp_start?: number;
    audio_url?: string;
    image_url?: string;
}

export interface IMeta {
    exam?: 'JEE Mains' | 'JEE Advanced' | 'NEET' | 'CBSE' | 'Other';
    year?: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    avg_time_sec: number;
}

export interface ITrap {
    likely_wrong_choice_id: string;
    message: string;
    concept_gap_tag?: string;
}

export interface ISourceReference {
    type: 'NCERT' | 'PYQ' | 'COACHING' | 'OTHER';
    ncertBook?: string;
    ncertChapter?: string;
    ncertPage?: string;
    ncertTopic?: string;
    pyqExam?: string;
    pyqShift?: string;
    pyqYear?: number;
    pyqQuestionNo?: string;
    sourceName?: string;
    description?: string;
    similarity?: 'exact' | 'similar' | 'concept';
}

export interface IQuestion {
    _id: string;
    text_markdown: string;
    type: 'MCQ' | 'INTEGER' | 'MATRIX';
    options: IOption[];
    integer_answer?: string;
    tags: IWeightedTag[];
    tag_id?: string; // Primary tag ID for quick reference
    meta: IMeta;
    chapter_id?: string;
    is_pyq: boolean;
    is_top_pyq: boolean;
    exam_source?: string; // Full reference string (e.g., "JEE 2026 - Jan 21 Morning Shift")
    source_references?: ISourceReference[];
    solution: ISolution;
    trap?: ITrap;
    createdAt?: Date;
    updatedAt?: Date;
}

const WeightedTagSchema = new Schema<IWeightedTag>({
    tag_id: { type: String, required: true, ref: 'Taxonomy' },
    weight: { type: Number, required: true, min: 0, max: 1, default: 1.0 }
}, { _id: false });

const OptionSchema = new Schema<IOption>({
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false }
}, { _id: false });

const SolutionSchema = new Schema<ISolution>({
    text_latex: { type: String, required: true },
    video_url: { type: String },
    video_timestamp_start: { type: Number },
    audio_url: { type: String },
    image_url: { type: String }
}, { _id: false });

const MetaSchema = new Schema<IMeta>({
    exam: { type: String, enum: ['JEE Mains', 'JEE Advanced', 'NEET', 'CBSE', 'Other'] },
    year: { type: Number, min: 1990, max: 2100 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    avg_time_sec: { type: Number, default: 120 }
}, { _id: false });

const SourceReferenceSchema = new Schema<ISourceReference>({
    type: { type: String, enum: ['NCERT', 'PYQ', 'COACHING', 'OTHER'], required: true },
    ncertBook: { type: String },
    ncertChapter: { type: String },
    ncertPage: { type: String },
    ncertTopic: { type: String },
    pyqExam: { type: String },
    pyqShift: { type: String },
    pyqYear: { type: Number },
    pyqQuestionNo: { type: String },
    sourceName: { type: String },
    description: { type: String },
    similarity: { type: String, enum: ['exact', 'similar', 'concept'] }
}, { _id: false });

const TrapSchema = new Schema<ITrap>({
    likely_wrong_choice_id: { type: String },
    message: { type: String },
    concept_gap_tag: { type: String }
}, { _id: false });

const QuestionSchema = new Schema<IQuestion>({
    _id: { type: String, required: true },
    text_markdown: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'INTEGER', 'MATRIX'], default: 'MCQ' },
    options: [OptionSchema],
    integer_answer: { type: String },
    tags: {
        type: [WeightedTagSchema],
        default: []
    },
    meta: { type: MetaSchema, required: true },
    chapter_id: { type: String },
    is_pyq: { type: Boolean, default: false },
    is_top_pyq: { type: Boolean, default: false },
    exam_source: { type: String },
    source_references: [SourceReferenceSchema],
    solution: { type: SolutionSchema, required: true },
    trap: TrapSchema,
    tag_id: { type: String } // Primary tag for quick lookup
}, {
    timestamps: true,
    collection: 'questions'
});

QuestionSchema.index({ 'tags.tag_id': 1 });
QuestionSchema.index({ 'meta.difficulty': 1 });
QuestionSchema.index({ chapter_id: 1 });
QuestionSchema.index({ 'meta.exam': 1, 'meta.year': -1 });

// ============================================
// ACTIVITY LOG MODEL (The Flight Recorder)
// ============================================

export interface IActivityLog {
    user_id: string;
    question_id: string;
    session_id: string;
    mode: 'practice' | 'exam' | 'review' | 'challenge';
    selected_option_id?: string;
    entered_answer?: string;
    is_correct: boolean;
    time_spent_sec: number;
    tags_affected: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    viewed_solution: boolean;
    marked_for_review: boolean;
    flagged_issue: boolean;
    attempted_at: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
    user_id: { type: String, required: true, index: true },
    question_id: { type: String, required: true, ref: 'Question' },
    session_id: { type: String, required: true },
    mode: {
        type: String,
        enum: ['practice', 'exam', 'review', 'challenge'],
        default: 'practice'
    },
    selected_option_id: { type: String },
    entered_answer: { type: String },
    is_correct: { type: Boolean, required: true },
    time_spent_sec: { type: Number, required: true },
    tags_affected: [{ type: String, ref: 'Taxonomy' }],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    viewed_solution: { type: Boolean, default: false },
    marked_for_review: { type: Boolean, default: false },
    flagged_issue: { type: Boolean, default: false },
    attempted_at: { type: Date, default: Date.now }
}, {
    timestamps: false,
    collection: 'activity_logs'
});

// CRITICAL: Compound index for mastery queries
ActivityLogSchema.index({ user_id: 1, tags_affected: 1 });
ActivityLogSchema.index({ user_id: 1, attempted_at: -1 });
ActivityLogSchema.index({ question_id: 1, attempted_at: -1 });
ActivityLogSchema.index({ session_id: 1 });

// ============================================
// MASTERY MAP MODEL (Per-User Tag Mastery)
// ============================================

export interface IMasteryStatus {
    accuracy: number;
    attempts: number;
    correct: number;
    status: 'RED' | 'YELLOW' | 'GREEN' | 'UNRATED';
    last_attempt?: Date;
    next_review?: Date;
    ease_factor: number;
    interval_days: number;
}

export interface IUserMastery {
    _id: string; // Supabase user ID
    mastery_map: Map<string, IMasteryStatus>;
    stats: {
        total_questions_attempted: number;
        total_correct: number;
        total_time_spent_sec: number;
        current_streak: number;
        best_streak: number;
        last_session_date?: Date;
    };
    starred_questions: string[];
    mastered_questions: string[];
    notes: Map<string, string>;
    createdAt?: Date;
    updatedAt?: Date;
}

const MasteryStatusSchema = new Schema<IMasteryStatus>({
    accuracy: { type: Number, default: 0, min: 0, max: 100 },
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['RED', 'YELLOW', 'GREEN', 'UNRATED'],
        default: 'UNRATED'
    },
    last_attempt: { type: Date },
    next_review: { type: Date },
    ease_factor: { type: Number, default: 2.5 },
    interval_days: { type: Number, default: 1 }
}, { _id: false });

const UserMasterySchema = new Schema<IUserMastery>({
    _id: { type: String, required: true }, // Supabase user ID
    mastery_map: {
        type: Map,
        of: MasteryStatusSchema,
        default: new Map()
    },
    stats: {
        total_questions_attempted: { type: Number, default: 0 },
        total_correct: { type: Number, default: 0 },
        total_time_spent_sec: { type: Number, default: 0 },
        current_streak: { type: Number, default: 0 },
        best_streak: { type: Number, default: 0 },
        last_session_date: { type: Date }
    },
    starred_questions: [{ type: String }],
    mastered_questions: [{ type: String }],
    notes: {
        type: Map,
        of: String,
        default: new Map()
    }
}, {
    timestamps: true,
    collection: 'user_mastery'
});

// ============================================
// MODEL EXPORTS
// ============================================

// Use mongoose.models to prevent model recompilation in Next.js hot reload
export const Taxonomy = mongoose.models.Taxonomy || mongoose.model<ITaxonomy>('Taxonomy', TaxonomySchema);
export const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export const UserMastery = mongoose.models.UserMastery || mongoose.model<IUserMastery>('UserMastery', UserMasterySchema);
