import mongoose, { Schema, Document, Model } from 'mongoose';
import { BookPage } from '@/types/books';

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

const BookPageModel: Model<IBookPage> =
  mongoose.models.BookPage || mongoose.model<IBookPage>('BookPage', BookPageSchema);

export default BookPageModel;
