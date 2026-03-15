import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestionResult {
    question_id: string;
    display_id: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    is_correct: boolean;
    selected_option: any;
    time_spent_seconds: number;
    marked_for_review: boolean;
}

export interface ITestResult extends Document {
    user_id: string;
    chapter_id: string;
    test_config: {
        count: number;
        difficulty_mix: 'balanced' | 'easy' | 'hard' | 'pyq';
        question_sort: 'random' | 'difficulty' | 'topic';
    };
    questions: IQuestionResult[];
    score: {
        correct: number;
        total: number;
        percentage: number;
    };
    timing: {
        started_at: Date;
        completed_at: Date;
        total_seconds: number;
    };
    saved_to_progress: boolean;
    created_at: Date;
    updated_at: Date;
}

const QuestionResultSchema = new Schema({
    question_id: { type: String, required: true },
    display_id: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    is_correct: { type: Boolean, required: true },
    selected_option: { type: Schema.Types.Mixed },
    time_spent_seconds: { type: Number, default: 0 },
    marked_for_review: { type: Boolean, default: false },
}, { _id: false });

const TestResultSchema = new Schema({
    _id: { type: String, required: true }, // user_id (same as UserProgress)
    user_id: { type: String, required: true, index: true },
    chapter_id: { type: String, required: true, index: true },
    test_config: {
        count: { type: Number, required: true },
        difficulty_mix: { type: String, enum: ['balanced', 'easy', 'hard', 'pyq'], required: true },
        question_sort: { type: String, enum: ['random', 'difficulty', 'topic'], default: 'random' },
    },
    questions: [QuestionResultSchema],
    score: {
        correct: { type: Number, required: true },
        total: { type: Number, required: true },
        percentage: { type: Number, required: true },
    },
    timing: {
        started_at: { type: Date, required: true },
        completed_at: { type: Date, required: true },
        total_seconds: { type: Number, required: true },
    },
    saved_to_progress: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// Indexes for efficient queries
TestResultSchema.index({ user_id: 1, created_at: -1 });
TestResultSchema.index({ chapter_id: 1, created_at: -1 });
TestResultSchema.index({ user_id: 1, chapter_id: 1, created_at: -1 });

// Pre-save hook to update updated_at
TestResultSchema.pre('save', async function () {
    this.updated_at = new Date();
});

const TestResult: Model<ITestResult> =
    mongoose.models.TestResult || mongoose.model<ITestResult>('TestResult', TestResultSchema);

export default TestResult;
