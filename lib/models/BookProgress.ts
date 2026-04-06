import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookProgress extends Document {
  user_id: string;
  book_slug: string;
  chapter_number: number;
  page_slug: string;
  completed_at: Date;
  quiz_score: number;   // 0–100
}

const BookProgressSchema = new Schema<IBookProgress>(
  {
    user_id:        { type: String, required: true, index: true },
    book_slug:      { type: String, required: true },
    chapter_number: { type: Number, required: true },
    page_slug:      { type: String, required: true },
    completed_at:   { type: Date, default: Date.now },
    quiz_score:     { type: Number, default: 100 },
  },
  { collection: 'book_progress' }
);

// One progress record per user+page (upsert on re-completion)
BookProgressSchema.index({ user_id: 1, book_slug: 1, page_slug: 1 }, { unique: true });

const BookProgressModel: Model<IBookProgress> =
  mongoose.models.BookProgress ||
  mongoose.model<IBookProgress>('BookProgress', BookProgressSchema);

export default BookProgressModel;
