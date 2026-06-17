import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { BookPage } from '../types/books';

// Blocks are stored as schema-less Mixed to support all block types.
// ContentBlock type safety is enforced at the API layer, not here.
export type IBookPage = Omit<Document, '_id'> & { _id: string } & Omit<BookPage, '_id'>;

const BookPageSchema = new Schema<IBookPage>(
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: { type: String, required: true } as any,
    book_id: { type: String, required: true, index: true },
    chapter_number: { type: Number, required: true },
    page_number: { type: Number, required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blocks: { type: [Schema.Types.Mixed], default: [] } as any,
    // Hinglish parallel text blocks — same id as English TextBlock counterpart.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hinglish_blocks: { type: [Schema.Types.Mixed], default: [] } as any,
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    reading_time_min: Number,
    content_types: { type: [String], default: [] },
    video_title: { type: String, default: null },
    // §15.1 — 'chapter_opener' renders the bespoke cover + journey; absent = lesson.
    page_type: { type: String, enum: ['lesson', 'chapter_opener'], default: 'lesson' },
    // Soft-delete (content protection, CLAUDE.md §0.6). Pages are NEVER hard-deleted.
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
    deletion_reason: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'book_pages',
  }
);

BookPageSchema.index(
  { book_id: 1, chapter_number: 1, page_number: 1 },
  { unique: true }
);
BookPageSchema.index({ book_id: 1, slug: 1 }, { unique: true });

// ── Soft-delete middleware (content protection, CLAUDE.md §0.6) ──────────────
// Every read/update auto-excludes soft-deleted pages so deleted content never
// leaks to students or the editor. Bypass with `.setOptions({ includeDeleted: true })`
// (used only by the restore path). NOTE: the unique indexes above are not partial,
// so recreating a page with the same (book_id, slug) as a soft-deleted one would
// collide — restore the old page instead (Phase-2 follow-up: make indexes partial).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Mongoose 9 query middleware is promise-based — use an async hook, NOT the old
// `function(next){ next() }` callback signature (which throws "next is not a
// function" at query exec on Mongoose 9).
async function excludeSoftDeleted(this: any) {
  if (!this.getOptions?.().includeDeleted) {
    const filter = this.getFilter ? this.getFilter() : {};
    if (filter.deleted_at === undefined) this.where({ deleted_at: null });
  }
}
const SOFT_DELETE_HOOKS = [
  // NOTE: no 'count' — Mongoose 9 removed Query.prototype.count, and registering
  // a pre hook on a non-existent method corrupts the middleware chain (throws
  // "next is not a function" at query exec). Use countDocuments instead.
  'find', 'findOne', 'findOneAndUpdate', 'findOneAndReplace', 'findOneAndDelete',
  'countDocuments', 'distinct', 'updateOne', 'updateMany',
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
for (const hook of SOFT_DELETE_HOOKS) (BookPageSchema as any).pre(hook, excludeSoftDeleted);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BookPageSchema as any).pre('aggregate', async function (this: any) {
  if (!this.options?.includeDeleted) this.pipeline().unshift({ $match: { deleted_at: null } });
});

const BookPageModel: Model<IBookPage> =
  mongoose.models.BookPage || mongoose.model<IBookPage>('BookPage', BookPageSchema);

export default BookPageModel;
