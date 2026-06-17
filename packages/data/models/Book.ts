import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { Book, BookChapter } from '../types/books';

export type IBook = Omit<Document, '_id'> & { _id: string } & Omit<Book, '_id'>;

const ChapterSchema = new Schema<BookChapter>(
  {
    number: { type: Number, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    page_ids: { type: [String], default: [] },
    description: String,
    // Default false — new chapters are drafts until the admin explicitly
    // publishes them via POST /api/v2/books/[bookSlug]/chapters/[number]/publish.
    is_published: { type: Boolean, default: false },
  },
  { _id: false }
);

const BookSchema = new Schema<IBook>(
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: { type: String, required: true } as any,
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subject: {
      type: String,
      required: true,
      enum: ['chemistry', 'biology', 'physics', 'mathematics', 'science', 'social_science', 'english', 'ict', 'hindi'],
    },
    grade: { type: Number, required: true, min: 6, max: 12 },
    board: {
      type: String,
      enum: ['ncert', 'cbse', 'icse', 'custom'],
      default: 'ncert',
    },
    cover_image: String,
    chapters: { type: [ChapterSchema], default: [] },
    is_published: { type: Boolean, default: false },
    // English-track only — how renderer behaves when a block's audio_url is empty.
    // See ENGLISH_BOOK_PAGE_WORKFLOW.md §8.4.
    audio_fallback: {
      type: String,
      enum: ['tts', 'silent', 'hide'],
      required: false,
    },
    // Soft-delete (content protection, CLAUDE.md §0.6). Books are NEVER hard-deleted.
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
    deletion_reason: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'books',
  }
);

// ── Soft-delete middleware (content protection, CLAUDE.md §0.6) ──────────────
// Reads auto-exclude soft-deleted books. Bypass with .setOptions({ includeDeleted: true }).
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
for (const hook of SOFT_DELETE_HOOKS) (BookSchema as any).pre(hook, excludeSoftDeleted);

const BookModel: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default BookModel;
