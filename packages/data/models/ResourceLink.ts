import mongoose, { Schema } from 'mongoose';

/**
 * RESOURCE LINK — junction document mapping a Crucible concept (topic tag
 * and/or micro-concept) to a learning resource (livebook page, video lecture,
 * flashcard deck, etc.).
 *
 * This is the bridge that lets the recommendation engine answer the question:
 * "Student is weak on Hyperconjugation — where can they LEARN it?"
 *
 * The shape is intentionally generic so we can add resource types over time
 * (livebook pages first, then videos, then flashcard decks, then external
 * links) without schema migrations.
 *
 * Authoring: links are created/edited in the admin panel (TODO: build the
 * authoring UI under /crucible/admin/resource-links). They can also be
 * bulk-imported from a CSV via scripts/import_resource_links.js.
 *
 * The engine is launch-gated — see lib/recommendationEngine.ts. Even with
 * zero ResourceLink documents in the DB, the rest of the system works fine.
 */
export type ResourceType = 'book_page' | 'video_lecture' | 'flashcard_deck' | 'external';
export type ResourceDifficulty = 'foundation' | 'intermediate' | 'advanced';

export interface IResourceLink {
  _id: string;                      // uuid v4
  // ── Concept being taught ───────────────────────────────────────────────
  topic_tag_id: string;             // e.g. 'tag_atom_3' (canonical taxonomy id)
  micro_concept?: string;           // e.g. 'Hyperconjugation' (optional, sharper)
  chapter_id: string;               // e.g. 'ch11_atom' (denorm of taxonomy parent)

  // ── Resource ──────────────────────────────────────────────────────────
  resource_type: ResourceType;
  resource_id: string;              // book page slug, YouTube video id, deck slug…
  resource_title: string;           // "Hyperconjugation — what, why, how"
  resource_url: string;             // canonical route, e.g. /books/goc/hyperconjugation

  // ── Ranking metadata ──────────────────────────────────────────────────
  difficulty?: ResourceDifficulty;  // for picking foundation-vs-advanced
  duration_minutes?: number;        // for "5-min refresher" vs "20-min lecture"
  is_primary?: boolean;             // canonical resource for this concept

  // ── Bookkeeping ───────────────────────────────────────────────────────
  created_at: Date;
  updated_at: Date;
  created_by?: string;              // admin email
}

const ResourceLinkSchema = new Schema<IResourceLink>({
  _id: { type: String, required: true },

  topic_tag_id: { type: String, required: true, index: true },
  micro_concept: { type: String, index: true },
  chapter_id: { type: String, required: true, index: true },

  resource_type: {
    type: String,
    enum: ['book_page', 'video_lecture', 'flashcard_deck', 'external'],
    required: true,
  },
  resource_id: { type: String, required: true },
  resource_title: { type: String, required: true },
  resource_url: { type: String, required: true },

  difficulty: { type: String, enum: ['foundation', 'intermediate', 'advanced'] },
  duration_minutes: { type: Number },
  is_primary: { type: Boolean, default: false },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String },
}, {
  timestamps: false,
  collection: 'resource_links',
  optimisticConcurrency: true,
});

// Compound indexes — the engine queries by (tag_id, resource_type) and
// occasionally by (chapter_id, is_primary) for hub-level surfaces.
ResourceLinkSchema.index({ topic_tag_id: 1, resource_type: 1 });
ResourceLinkSchema.index({ chapter_id: 1, is_primary: 1 });

export const ResourceLink =
  (mongoose.models.ResourceLink as mongoose.Model<IResourceLink>) ||
  mongoose.model<IResourceLink>('ResourceLink', ResourceLinkSchema);
