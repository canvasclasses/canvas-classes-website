import 'server-only';
import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Per-question practice history for Live Books adaptive chapter practice.
 *
 * Distinct from `BookProgress` (one page-completion record per page, keyed by
 * page_slug): a student answers many questions per chapter, and the adaptive
 * selector needs the *cumulative* history — this chapter plus every earlier
 * chapter — to ladder difficulty and surface spaced review. So this is an
 * append-style log: one document per attempt, queried by `{user_id, book_slug}`.
 */
export interface IBookPracticeAttempt extends Document {
  user_id: string;
  book_slug: string;
  chapter_number: number;
  question_id: string;       // stable id of the practice question within its block
  concept_tag: string;       // e.g. 'comprehension', 'vocab_in_context', 'grammar', 'interpretation'
  difficulty: number;        // 1–5
  correct: boolean;
  time_ms: number;           // time spent on the question
  attempted_at: Date;
}

const BookPracticeAttemptSchema = new Schema<IBookPracticeAttempt>(
  {
    user_id:        { type: String, required: true, index: true },
    book_slug:      { type: String, required: true },
    chapter_number: { type: Number, required: true },
    question_id:    { type: String, required: true },
    concept_tag:    { type: String, default: 'comprehension' },
    difficulty:     { type: Number, default: 1, min: 1, max: 5 },
    correct:        { type: Boolean, required: true },
    time_ms:        { type: Number, default: 0 },
    attempted_at:   { type: Date, default: Date.now },
  },
  { collection: 'book_practice_attempts' }
);

// Cumulative selection: "all of this user's attempts in this book", newest first.
BookPracticeAttemptSchema.index({ user_id: 1, book_slug: 1, attempted_at: -1 });
// Per-chapter slice for scoring a single practice session.
BookPracticeAttemptSchema.index({ user_id: 1, book_slug: 1, chapter_number: 1 });

const BookPracticeAttemptModel: Model<IBookPracticeAttempt> =
  mongoose.models.BookPracticeAttempt ||
  mongoose.model<IBookPracticeAttempt>('BookPracticeAttempt', BookPracticeAttemptSchema);

export default BookPracticeAttemptModel;
