import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * LEARNING EVENT — the unified, append-only interaction spine (ADR-011, Phase 1).
 *
 * Every learning interaction across every surface (Crucible questions, Live
 * Book practice, future lectures/flashcards) emits ONE immutable event here,
 * keyed by global skill id. This is NOT a competing persona — the materialised
 * persona stays UserProgress.concept_mastery. The event log's job is
 * **replayability**: when the mastery algorithm improves, the persona can be
 * recomputed from history instead of losing the past. Append-only — never
 * updated or deleted in normal operation.
 *
 * `tenant_id` is reserved for Phase 3 (B2B multi-tenancy) — present so the
 * partition key exists before there is data to migrate.
 */
export interface ILearningEvent extends Document {
  user_id: string;
  tenant_id?: string;            // Phase 3 — B2B isolation (unset = default tenant)
  ts: Date;
  surface: 'crucible' | 'book' | 'lecture' | 'flashcard';
  verb: 'answered' | 'read' | 'watched' | 'reviewed';
  item_id: string;               // question/display id, book question id, page slug…
  skill_ids: string[];           // global skill ids (taxonomy tag or bk:/comp: id)
  correct?: boolean;
  score?: number;                // 0–100, for composite items
  difficulty?: number;           // 1–5
  duration_ms?: number;
  confidence?: 'high' | 'medium' | 'low';
  chapter_id?: string;
  book_slug?: string;
  session_id?: string;
}

const LearningEventSchema = new Schema<ILearningEvent>(
  {
    user_id:    { type: String, required: true },
    tenant_id:  { type: String },
    ts:         { type: Date, default: Date.now },
    surface:    { type: String, enum: ['crucible', 'book', 'lecture', 'flashcard'], required: true },
    verb:       { type: String, enum: ['answered', 'read', 'watched', 'reviewed'], required: true },
    item_id:    { type: String, required: true },
    skill_ids:  { type: [String], default: [] },
    correct:    { type: Boolean },
    score:      { type: Number },
    difficulty: { type: Number },
    duration_ms:{ type: Number },
    confidence: { type: String, enum: ['high', 'medium', 'low'] },
    chapter_id: { type: String },
    book_slug:  { type: String },
    session_id: { type: String },
  },
  { collection: 'learning_events' }
);

// Replay / per-user feed (newest first).
LearningEventSchema.index({ user_id: 1, ts: -1 });
// Per-skill history (cross-surface) — drives future per-skill replay + analytics.
LearningEventSchema.index({ user_id: 1, skill_ids: 1, ts: -1 });
// Tenant rollups (Phase 3 teacher dashboards).
LearningEventSchema.index({ tenant_id: 1, ts: -1 });

const LearningEventModel: Model<ILearningEvent> =
  mongoose.models.LearningEvent ||
  mongoose.model<ILearningEvent>('LearningEvent', LearningEventSchema);

export default LearningEventModel;
