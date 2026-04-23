import { Schema, model, models } from 'mongoose';

export type BlogStatus = 'idea' | 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
export type BlogSourceKind = 'manual' | 'rss' | 'idea';

export interface IBlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image?: { url: string; alt?: string };
  tags: string[];
  author: string;
  status: BlogStatus;
  source: BlogSourceKind;
  source_refs: string[];
  idea_id?: string;
  scheduled_for?: Date;
  published_at?: Date;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  version: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  deleted_at?: Date | null;
}

const BlogPostSchema = new Schema<IBlogPost>({
  _id: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  title: { type: String, required: true, trim: true, maxlength: 240 },
  excerpt: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: true },
  cover_image: {
    url: { type: String },
    alt: { type: String },
  },
  tags: { type: [String], default: [], index: true },
  author: { type: String, default: 'Canvas Classes' },
  status: {
    type: String,
    enum: ['idea', 'draft', 'review', 'scheduled', 'published', 'archived'],
    default: 'draft',
    index: true,
  },
  source: {
    type: String,
    enum: ['manual', 'rss', 'idea'],
    default: 'manual',
  },
  source_refs: { type: [String], default: [] },
  idea_id: { type: String, default: null },
  scheduled_for: { type: Date, default: null, index: true },
  published_at: { type: Date, default: null, index: true },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: [String], default: [] },
  },
  version: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  updated_by: { type: String, required: true },
  deleted_at: { type: Date, default: null, index: true },
}, {
  collection: 'blog_posts',
  _id: false,
  optimisticConcurrency: true,
  versionKey: 'version',
});

BlogPostSchema.index({ status: 1, scheduled_for: 1 });
BlogPostSchema.index({ status: 1, published_at: -1 });
BlogPostSchema.index({ deleted_at: 1, status: 1 });

// Normalizes markdown content so the renderer (react-markdown + rehypeRaw)
// can't hit malformed-HAST or empty-string edge cases.
// Returns the cleaned string, or throws if the result is empty.
function normalizeContent(raw: string): string {
  let s = raw.replace(/\r\n/g, '\n');         // CRLF → LF
  s = s.replace(/\u0000/g, '');                // strip null bytes
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, ''); // zero-width chars (common LLM artifact)
  s = s.trim();
  if (!s) throw new Error('Blog content cannot be empty after normalization');
  return s;
}

// Pulls the first markdown image from a body, e.g. ![alt](url). Only
// accepts http(s) or site-relative paths so we don't accidentally promote
// data: URIs or javascript: URLs into the cover_image slot.
function firstMarkdownImage(content: string): { url: string; alt: string } | null {
  const m = content.match(/!\[([^\]]*)\]\((\S+?)(?:\s+"[^"]*")?\)/);
  if (!m) return null;
  const url = m[2];
  if (!/^(https?:\/\/|\/)/i.test(url)) return null;
  return { url, alt: m[1] || '' };
}

BlogPostSchema.pre('save', async function () {
  if (this.isModified('content')) {
    if (typeof this.content !== 'string') {
      throw new Error('Blog content must be a string');
    }
    this.content = normalizeContent(this.content);
  }

  // Auto-fill cover_image from the first inline markdown image when missing,
  // so blog list cards always have a thumbnail to show.
  if (!this.cover_image?.url && typeof this.content === 'string') {
    const found = firstMarkdownImage(this.content);
    if (found) {
      this.cover_image = { url: found.url, alt: found.alt || this.title || '' };
    }
  }

  this.updated_at = new Date();
});

export const BlogPost = models.BlogPost || model<IBlogPost>('BlogPost', BlogPostSchema);
