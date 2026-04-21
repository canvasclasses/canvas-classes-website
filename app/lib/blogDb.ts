import connectToDatabase from '@/lib/mongodb';
import { BlogPost, type IBlogPost } from '@/lib/models/BlogPost';

export type PublicPost = {
  _id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  image?: string;
  content: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

function toPublic(p: IBlogPost | Record<string, unknown>): PublicPost {
  const rec = p as unknown as {
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    tags: string[];
    cover_image?: { url: string; alt?: string };
    content: string;
    published_at?: Date | string | null;
    created_at?: Date | string;
    seo?: { title?: string; description?: string; keywords?: string[] };
  };
  const dateSource = rec.published_at || rec.created_at;
  return {
    _id: rec._id,
    slug: rec.slug,
    title: rec.title,
    date: dateSource ? new Date(dateSource).toISOString() : new Date().toISOString(),
    excerpt: rec.excerpt || '',
    author: rec.author || 'Canvas Classes',
    tags: rec.tags || [],
    image: rec.cover_image?.url,
    content: rec.content || '',
    seo: rec.seo,
  };
}

export async function getPublishedPosts(): Promise<PublicPost[]> {
  await connectToDatabase();
  const rows = await BlogPost.find({
    status: 'published',
    deleted_at: null,
  })
    .sort({ published_at: -1, created_at: -1 })
    .limit(200)
    .lean();
  return rows.map(toPublic);
}

export async function getPublishedPostBySlug(slug: string): Promise<PublicPost | null> {
  await connectToDatabase();
  const row = await BlogPost.findOne({
    slug,
    status: 'published',
    deleted_at: null,
  }).lean();
  if (!row) return null;
  return toPublic(row);
}

export async function getPublishedSlugs(): Promise<string[]> {
  await connectToDatabase();
  const rows = await BlogPost.find({
    status: 'published',
    deleted_at: null,
  })
    .select('slug')
    .limit(500)
    .lean();
  return rows.map(r => (r as unknown as { slug: string }).slug);
}
