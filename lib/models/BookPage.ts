import mongoose, { Schema, Document, Model } from 'mongoose';

// Blocks are stored as schema-less Mixed to support all 15 block types.
// ContentBlock type safety is enforced at the API layer via Zod, not here.
export interface IBookPage extends Document {
  book_id: string;
  chapter_number: number;
  page_number: number;
  slug: string;
  title: string;
  subtitle?: string;
  blocks: unknown[];
  tags: string[];
  published: boolean;
  reading_time_min?: number;
  created_at: Date;
  updated_at: Date;
}

const BookPageSchema = new Schema<IBookPage>(
  {
    book_id: { type: String, required: true, index: true },
    chapter_number: { type: Number, required: true },
    page_number: { type: Number, required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    blocks: { type: [Schema.Types.Mixed], default: [] },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    reading_time_min: Number,
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
