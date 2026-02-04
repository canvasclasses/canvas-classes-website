/**
 * The Crucible - Activity Log Schema (4-Bucket Architecture)
 * 
 * COLLECTION: activity_logs
 * Purpose: The Flight Recorder - Every attempt is immutable history
 * 
 * CRITICAL: This is append-only. Never update, never delete.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivityLogSchema = new Schema({
    // Who
    user_id: {
        type: String,
        required: true,
        index: true
    },

    // What
    question_id: {
        type: String,
        required: true,
        ref: 'Question'
    },

    // Context
    session_id: { type: String, required: true }, // Groups attempts in a single practice session
    mode: {
        type: String,
        enum: ['practice', 'exam', 'review', 'challenge'],
        default: 'practice'
    },

    // The Attempt Data
    selected_option_id: { type: String }, // For MCQ
    entered_answer: { type: String }, // For INTEGER
    is_correct: { type: Boolean, required: true },

    // Time Analytics
    time_spent_sec: { type: Number, required: true }, // How long on this question

    // Tag Propagation - CRITICAL FOR MASTERY MAP
    // Copy the question's tags here so we can query "all attempts on TAG_X"
    tags_affected: [{
        type: String,
        ref: 'Taxonomy'
    }],

    // Difficulty at time of attempt (for analytics)
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },

    // Feedback interaction
    viewed_solution: { type: Boolean, default: false },
    marked_for_review: { type: Boolean, default: false },
    flagged_issue: { type: Boolean, default: false },

    // Timestamps
    attempted_at: { type: Date, default: Date.now }

}, {
    timestamps: false, // We use attempted_at manually
    collection: 'activity_logs'
});

// CRITICAL COMPOUND INDEX: Query a student's performance on specific tags
// This is the index that powers "Show me all TAG_STOICHIOMETRY attempts for User X"
ActivityLogSchema.index({ user_id: 1, tags_affected: 1 });

// Performance indexes
ActivityLogSchema.index({ user_id: 1, attempted_at: -1 }); // User's recent history
ActivityLogSchema.index({ question_id: 1, attempted_at: -1 }); // Question analytics
ActivityLogSchema.index({ session_id: 1 }); // Session replay
ActivityLogSchema.index({ user_id: 1, is_correct: 1 }); // Accuracy queries

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
