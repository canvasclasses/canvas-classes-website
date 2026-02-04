/**
 * The Crucible - User Schema (4-Bucket Architecture)
 * 
 * COLLECTION: users
 * Purpose: The Profile - Lightweight user data with tag-level mastery map
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for mastery status per tag
const MasteryStatusSchema = new Schema({
    accuracy: { type: Number, default: 0, min: 0, max: 100 }, // 0-100%
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    last_attempt: { type: Date },
    status: {
        type: String,
        enum: ['RED', 'YELLOW', 'GREEN', 'UNRATED'],
        default: 'UNRATED'
    },
    // Spaced repetition metrics
    next_review: { type: Date },
    ease_factor: { type: Number, default: 2.5 },
    interval_days: { type: Number, default: 1 }
}, { _id: false });

const UserSchema = new Schema({
    // Use Supabase/Firebase UID
    _id: { type: String, required: true },

    // Basic info (synced from auth provider)
    email: { type: String },
    display_name: { type: String },
    avatar_url: { type: String },

    // Subscription/Plan
    plan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free'
    },

    // THE MASTERY MAP - Key upgrade
    // Map<TagID, MasteryStatus>
    mastery_map: {
        type: Map,
        of: MasteryStatusSchema,
        default: new Map()
    },

    // Aggregate stats (for quick dashboard)
    stats: {
        total_questions_attempted: { type: Number, default: 0 },
        total_correct: { type: Number, default: 0 },
        total_time_spent_sec: { type: Number, default: 0 },
        current_streak: { type: Number, default: 0 },
        best_streak: { type: Number, default: 0 },
        last_session_date: { type: Date }
    },

    // Preferences
    preferences: {
        daily_goal_questions: { type: Number, default: 20 },
        preferred_difficulty: { type: String, default: 'Medium' },
        notification_enabled: { type: Boolean, default: true }
    },

    // Starred/Mastered question IDs (for quick filters)
    starred_questions: [{ type: String }],
    mastered_questions: [{ type: String }],

    // User notes on questions
    notes: {
        type: Map,
        of: String, // QuestionID -> Note text
        default: new Map()
    }

}, {
    timestamps: true,
    collection: 'users'
});

// Index for leaderboards
UserSchema.index({ 'stats.total_correct': -1 });
UserSchema.index({ 'stats.current_streak': -1 });

// Method to update mastery status based on activity
UserSchema.methods.updateTagMastery = function (tagId, isCorrect) {
    const currentMastery = this.mastery_map.get(tagId) || {
        accuracy: 0,
        attempts: 0,
        correct: 0,
        status: 'UNRATED'
    };

    currentMastery.attempts += 1;
    if (isCorrect) currentMastery.correct += 1;
    currentMastery.accuracy = Math.round((currentMastery.correct / currentMastery.attempts) * 100);
    currentMastery.last_attempt = new Date();

    // Determine status based on thresholds
    if (currentMastery.attempts < 3) {
        currentMastery.status = 'UNRATED';
    } else if (currentMastery.accuracy >= 80) {
        currentMastery.status = 'GREEN';
    } else if (currentMastery.accuracy >= 50) {
        currentMastery.status = 'YELLOW';
    } else {
        currentMastery.status = 'RED';
    }

    this.mastery_map.set(tagId, currentMastery);
};

module.exports = mongoose.model('User', UserSchema);
