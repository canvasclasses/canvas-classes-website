import 'server-only';
import mongoose, { Schema } from 'mongoose';

// Per-user state for the Study Planner (/study-planner; formerly /drop-year-planner).
// Model + collection name + API path keep the "drop-planner" identifier for
// continuity with already-saved user data — only the public page slug changed.
// _id is the Supabase user UUID. The `state` blob is the PlannerState document
// (completion, deadlines, diagnostic, revision queue, custom resources, settings,
// streak). The client is authoritative and sends the full validated blob on each
// write; the server stores it opaquely after Zod validation in the route handler.

export interface IDropPlannerProgress {
    _id: string;
    state: Record<string, unknown>;
    plan_version: string;
    created_at: Date;
    updated_at: Date;
}

const DropPlannerProgressSchema = new Schema<IDropPlannerProgress>(
    {
        _id: { type: String, required: true },
        state: { type: Schema.Types.Mixed, default: {} },
        plan_version: { type: String, default: 'v1' },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    { _id: false, optimisticConcurrency: true, minimize: false }
);

DropPlannerProgressSchema.pre('save', async function () {
    this.updated_at = new Date();
});

export const DropPlannerProgress =
    (mongoose.models.DropPlannerProgress as mongoose.Model<IDropPlannerProgress>) ||
    mongoose.model<IDropPlannerProgress>('DropPlannerProgress', DropPlannerProgressSchema);

export default DropPlannerProgress;
