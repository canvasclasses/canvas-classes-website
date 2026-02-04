/**
 * The Crucible - Question Schema (4-Bucket Architecture)
 * 
 * COLLECTION: questions
 * Purpose: The Content - All question data with weighted tags and rich solutions
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for weighted tags
const WeightedTagSchema = new Schema({
    tag_id: {
        type: String,
        required: true,
        ref: 'Taxonomy' // References the master taxonomy
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 1.0 // 100% weight if single tag
    }
}, { _id: false });

// Sub-schema for options
const OptionSchema = new Schema({
    id: { type: String, required: true }, // 'a', 'b', 'c', 'd'
    text: { type: String, required: true }, // Supports LaTeX
    isCorrect: { type: Boolean, required: true, default: false }
}, { _id: false });

// Sub-schema for solution (Hybrid Engine)
const SolutionSchema = new Schema({
    text_latex: { type: String, required: true }, // Required fallback
    video_url: { type: String }, // YouTube/Vimeo ID
    video_timestamp_start: { type: Number }, // Deep link into lecture
    audio_url: { type: String }, // MP3 for voice explanation
    image_url: { type: String } // Handwritten notes
}, { _id: false });

// Sub-schema for meta information
const MetaSchema = new Schema({
    exam: { type: String, enum: ['JEE Mains', 'JEE Advanced', 'NEET', 'CBSE', 'Other'] },
    year: { type: Number, min: 1990, max: 2100 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    avg_time_sec: { type: Number, default: 120 } // Default 2 minutes
}, { _id: false });

// Sub-schema for trap (Feedback Card)
const TrapSchema = new Schema({
    likely_wrong_choice_id: { type: String },
    message: { type: String },
    concept_gap_tag: { type: String } // Remedial tag ID
}, { _id: false });

// Main Question Schema
const QuestionSchema = new Schema({
    // Unique identifier
    _id: { type: String, required: true }, // e.g., "MC_STO_ADV_001"

    // Content
    text_markdown: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'INTEGER', 'MATRIX'], default: 'MCQ' },
    options: [OptionSchema],
    integer_answer: { type: String }, // For INTEGER type

    // Taxonomy (Weighted Tags) - THE KEY UPGRADE
    tags: {
        type: [WeightedTagSchema],
        required: true,
        validate: {
            validator: function (tags) {
                if (!tags || tags.length === 0) return false;
                const totalWeight = tags.reduce((sum, t) => sum + t.weight, 0);
                return Math.abs(totalWeight - 1.0) < 0.001; // Weights must sum to 1
            },
            message: 'Tags array must have at least one tag and weights must sum to 1.0'
        }
    },

    // Metadata
    meta: { type: MetaSchema, required: true },
    chapter_id: { type: String },
    is_pyq: { type: Boolean, default: false },
    is_top_pyq: { type: Boolean, default: false },

    // Solution Engine
    solution: { type: SolutionSchema, required: true },

    // Feedback System
    trap: TrapSchema

}, {
    timestamps: true,
    collection: 'questions'
});

// Indexes for performance
QuestionSchema.index({ 'tags.tag_id': 1 });
QuestionSchema.index({ 'meta.difficulty': 1 });
QuestionSchema.index({ chapter_id: 1 });
QuestionSchema.index({ 'meta.exam': 1, 'meta.year': -1 });
QuestionSchema.index({ is_pyq: 1, is_top_pyq: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
