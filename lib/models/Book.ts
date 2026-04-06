import mongoose, { Schema, Document, Model } from 'mongoose';
import { Book, BookChapter } from '@/types/books';

export interface IBook extends Omit<Book, '_id'>, Document {}

const ChapterSchema = new Schema<BookChapter>(
  {
    number: { type: Number, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    page_ids: { type: [String], default: [] },
    description: String,
  },
  { _id: false }
);

const BookSchema = new Schema<IBook>(
  {
    _id: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subject: {
      type: String,
      required: true,
      enum: ['chemistry', 'biology', 'physics', 'mathematics'],
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'books',
  }
);

const BookModel: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default BookModel;
