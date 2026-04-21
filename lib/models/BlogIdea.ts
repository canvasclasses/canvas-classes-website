import { Schema, model, models, Document } from 'mongoose';

export type BlogIdeaStatus = 'pending' | 'drafted' | 'archived';

export interface IBlogIdea extends Omit<Document, '_id'> {
  _id: string;
  title: string;
  description: string;
  target_tags: string[];
  priority: number;
  status: BlogIdeaStatus;
  target_publish_date?: Date;
  drafted_post_id?: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

const BlogIdeaSchema = new Schema<IBlogIdea>({
  _id: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 240 },
  description: { type: String, default: '', maxlength: 4000 },
  target_tags: { type: [String], default: [] },
  priority: { type: Number, default: 3, min: 1, max: 5 },
  status: {
    type: String,
    enum: ['pending', 'drafted', 'archived'],
    default: 'pending',
    index: true,
  },
  target_publish_date: { type: Date, default: null },
  drafted_post_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
}, {
  collection: 'blog_ideas',
});

BlogIdeaSchema.pre('save', async function () {
  this.updated_at = new Date();
});

export const BlogIdea = models.BlogIdea || model<IBlogIdea>('BlogIdea', BlogIdeaSchema);
