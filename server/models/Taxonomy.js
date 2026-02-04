/**
 * The Crucible - Taxonomy Schema (4-Bucket Architecture)
 * 
 * COLLECTION: taxonomy
 * Purpose: The Skill Tree - Master list of all concepts/tags with hierarchy
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaxonomySchema = new Schema({
    // Use meaningful IDs like "TAG_STOICHIOMETRY"
    _id: { type: String, required: true },

    // Display name
    name: { type: String, required: true },

    // Hierarchy: What parent concept does this belong to?
    parent_id: { type: String, ref: 'Taxonomy', default: null },

    // Learning resources for this concept
    remedial_video_url: { type: String },
    remedial_notes_url: { type: String },

    // Categorization
    subject: {
        type: String,
        enum: ['Chemistry', 'Physics', 'Mathematics', 'Biology'],
        required: true
    },
    chapter: { type: String }, // e.g., "Mole Concept"

    // Difficulty distribution (what % of questions are Easy/Med/Hard)
    difficulty_distribution: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
    },

    // Metrics (auto-updated by aggregation jobs)
    question_count: { type: Number, default: 0 },
    avg_accuracy: { type: Number, default: 0 }, // Platform-wide
    avg_time_sec: { type: Number, default: 120 },

    // Status
    is_active: { type: Boolean, default: true }

}, {
    timestamps: true,
    collection: 'taxonomy'
});

// Index for parent-child lookups
TaxonomySchema.index({ parent_id: 1 });
TaxonomySchema.index({ subject: 1, chapter: 1 });

module.exports = mongoose.model('Taxonomy', TaxonomySchema);
