/**
 * Per-user flashcard SRS state. The authoritative store for spaced-repetition
 * progress — Supabase + localStorage are caches in front of this.
 */

import { Schema, model, models, Model, Document } from 'mongoose';

export interface IFlashcardSRS {
    cardId: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: string;   // local-TZ yyyy-mm-dd as authored on the client
    lastReviewDate: string;
    totalReviews: number;
    correctReviews: number;
    lapses: number;
    updatedAt: number;        // ms epoch
    fsrs?: {
        due: number;
        stability: number;
        difficulty: number;
        elapsed_days: number;
        scheduled_days: number;
        learning_steps: number;
        reps: number;
        lapses: number;
        state: number;
        last_review?: number;
    };
}

export interface IFlashcardMetadata {
    starred?: boolean;
    suspended?: boolean;
    buriedUntil?: string;
    note?: string;
    updatedAt: number;
}

export interface IPerDeckSettings {
    newCardsPerDay?: number;
    reviewCardsPerDay?: number;
}

export interface IStudyDay {
    date: string;          // local-TZ yyyy-mm-dd
    reviews: number;       // total reviews that day
}

export interface IFlashcardProgress extends Document {
    user_id: string;          // Supabase auth user.id (uuid)
    user_email?: string;
    cards: Map<string, IFlashcardSRS>;
    metadata: Map<string, IFlashcardMetadata>;
    streak: {
        currentStreak: number;
        longestStreak: number;
        lastStudyDate: string;
        updatedAt: number;
    };
    settings?: {
        newCardsPerDay?: number;
        reviewCardsPerDay?: number;
        perDeck?: Map<string, IPerDeckSettings>;  // chapter slug → caps
    };
    history: IStudyDay[];     // last 365 days of activity for the heatmap
    last_synced_at: Date;
    created_at: Date;
    updated_at: Date;
}

const FsrsStateSchema = new Schema(
    {
        due: { type: Number, required: true },
        stability: { type: Number, required: true },
        difficulty: { type: Number, required: true },
        elapsed_days: { type: Number, required: true },
        scheduled_days: { type: Number, required: true },
        learning_steps: { type: Number, required: true, default: 0 },
        reps: { type: Number, required: true },
        lapses: { type: Number, required: true },
        state: { type: Number, required: true },
        last_review: { type: Number, required: false }
    },
    { _id: false }
);

const FlashcardSRSSchema = new Schema<IFlashcardSRS>(
    {
        cardId: { type: String, required: true },
        easeFactor: { type: Number, required: true, default: 2.5 },
        interval: { type: Number, required: true, default: 0 },
        repetitions: { type: Number, required: true, default: 0 },
        nextReviewDate: { type: String, required: true },
        lastReviewDate: { type: String, default: '' },
        totalReviews: { type: Number, default: 0 },
        correctReviews: { type: Number, default: 0 },
        lapses: { type: Number, default: 0 },
        updatedAt: { type: Number, default: 0 },
        fsrs: { type: FsrsStateSchema, required: false }
    },
    { _id: false }
);

const MetadataSchema = new Schema<IFlashcardMetadata>(
    {
        starred: Boolean,
        suspended: Boolean,
        buriedUntil: String,
        note: String,
        updatedAt: { type: Number, default: 0 }
    },
    { _id: false }
);

const PerDeckSettingsSchema = new Schema<IPerDeckSettings>(
    {
        newCardsPerDay: Number,
        reviewCardsPerDay: Number
    },
    { _id: false }
);

const StudyDaySchema = new Schema<IStudyDay>(
    {
        date: { type: String, required: true },
        reviews: { type: Number, default: 0 }
    },
    { _id: false }
);

const FlashcardProgressSchema = new Schema<IFlashcardProgress>(
    {
        user_id: { type: String, required: true, unique: true, index: true },
        user_email: { type: String, default: '' },
        cards: {
            type: Map,
            of: FlashcardSRSSchema,
            default: () => new Map()
        },
        metadata: {
            type: Map,
            of: MetadataSchema,
            default: () => new Map()
        },
        streak: {
            currentStreak: { type: Number, default: 0 },
            longestStreak: { type: Number, default: 0 },
            lastStudyDate: { type: String, default: '' },
            updatedAt: { type: Number, default: 0 }
        },
        settings: {
            newCardsPerDay: Number,
            reviewCardsPerDay: Number,
            perDeck: { type: Map, of: PerDeckSettingsSchema }
        },
        history: { type: [StudyDaySchema], default: [] },
        last_synced_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now }
    },
    {
        collection: 'flashcard_progress',
        optimisticConcurrency: true,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

const FlashcardProgress: Model<IFlashcardProgress> =
    (models.FlashcardProgress as Model<IFlashcardProgress>) ||
    model<IFlashcardProgress>('FlashcardProgress', FlashcardProgressSchema);

export default FlashcardProgress;
