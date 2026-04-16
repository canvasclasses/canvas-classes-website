import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookBookmark extends Document {
  user_id: string;
  book_slug: string;
  page_slug: string;
  page_title: string;
  chapter_number: number;
  created_at: Date;
}

const BookBookmarkSchema = new Schema<IBookBookmark>(
  {
    user_id:        { type: String, required: true, index: true },
    book_slug:      { type: String, required: true },
    page_slug:      { type: String, required: true },
    page_title:     { type: String, required: true },
    chapter_number: { type: Number, required: true },
    created_at:     { type: Date, default: Date.now },
  },
  { collection: 'book_bookmarks' }
);

// One bookmark per user+page (toggle on/off via upsert + delete)
BookBookmarkSchema.index({ user_id: 1, book_slug: 1, page_slug: 1 }, { unique: true });
// Fast lookup for "all bookmarks for this book"
BookBookmarkSchema.index({ user_id: 1, book_slug: 1 });

const BookBookmarkModel: Model<IBookBookmark> =
  mongoose.models.BookBookmark ||
  mongoose.model<IBookBookmark>('BookBookmark', BookBookmarkSchema);

export default BookBookmarkModel;
