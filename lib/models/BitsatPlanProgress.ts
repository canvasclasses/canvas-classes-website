import mongoose, { Schema } from 'mongoose';

// Tracks per-user completion of days in the BITSAT 30-day Chemistry plan.
// _id is the Supabase user UUID. Used for retention analytics.

export interface IBitsatPlanProgress {
    _id: string;
    completed_days: number[];
    plan_version: string;
    created_at: Date;
    updated_at: Date;
}

const BitsatPlanProgressSchema = new Schema<IBitsatPlanProgress>(
    {
        _id: { type: String, required: true },
        completed_days: { type: [Number], default: [] },
        plan_version: { type: String, default: 'v1' },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    { _id: false, optimisticConcurrency: true }
);

BitsatPlanProgressSchema.pre('save', async function () {
    this.updated_at = new Date();
});

export const BitsatPlanProgress =
    (mongoose.models.BitsatPlanProgress as mongoose.Model<IBitsatPlanProgress>) ||
    mongoose.model<IBitsatPlanProgress>('BitsatPlanProgress', BitsatPlanProgressSchema);

export default BitsatPlanProgress;
