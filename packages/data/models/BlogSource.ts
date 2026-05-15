import { Schema, model, models } from 'mongoose';

export type BlogSourceStatus = 'new' | 'reviewed' | 'drafted' | 'ignored';

export interface IBlogSource {
  _id: string;
  url: string;
  url_hash: string;
  source_name: string;
  title: string;
  summary: string;
  categories: string[];
  fetched_at: Date;
  published_at?: Date;
  relevance_score: number;
  relevance_reason?: string;
  status: BlogSourceStatus;
  used_in_post?: string;
}

const BlogSourceSchema = new Schema<IBlogSource>({
  _id: { type: String, required: true },
  url: { type: String, required: true },
  url_hash: { type: String, required: true, unique: true, index: true },
  source_name: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, default: '' },
  categories: { type: [String], default: [] },
  fetched_at: { type: Date, default: Date.now, index: true },
  published_at: { type: Date, default: null },
  relevance_score: { type: Number, default: 0, min: 0, max: 1 },
  relevance_reason: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'drafted', 'ignored'],
    default: 'new',
    index: true,
  },
  used_in_post: { type: String, default: null },
}, {
  collection: 'blog_sources',
  _id: false,
});

BlogSourceSchema.index({ status: 1, relevance_score: -1 });

export const BlogSource = models.BlogSource || model<IBlogSource>('BlogSource', BlogSourceSchema);
