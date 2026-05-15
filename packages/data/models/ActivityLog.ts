// ActivityLog — community stats signal (used by /api/v2/questions/[id]/stats).
// Was previously the last surviving export of the V1 lib/models.ts wrapper;
// promoted into the data package as its own file during the monorepo migration.

import { mongoose } from '../db/mongodb';

const { Schema } = mongoose;

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
    question_id: { type: String, required: true },
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
    tags_affected: [{ type: String }],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    viewed_solution: { type: Boolean, default: false },
    marked_for_review: { type: Boolean, default: false },
    flagged_issue: { type: Boolean, default: false },
    attempted_at: { type: Date, default: Date.now }
}, {
    timestamps: false,
    collection: 'activity_logs'
});

ActivityLogSchema.index({ user_id: 1, tags_affected: 1 });
ActivityLogSchema.index({ user_id: 1, attempted_at: -1 });
ActivityLogSchema.index({ question_id: 1, attempted_at: -1 });
ActivityLogSchema.index({ session_id: 1 });

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
