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

const FIRST_MARKDOWN_IMAGE = /!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)/;

// Pulls the first markdown image URL out of a post body, e.g. `![alt](url)`.
// Used as a thumbnail fallback when cover_image wasn't set at save time.
function extractFirstMarkdownImage(content: string): string | undefined {
  if (!content) return undefined;
  const match = content.match(FIRST_MARKDOWN_IMAGE);
  const url = match?.[1];
  if (!url) return undefined;
  // Only trust http(s) or site-relative paths — ignore data:, javascript:, etc.
  if (/^(https?:\/\/|\/)/i.test(url)) return url;
  return undefined;
}

// If the body's first image is the same URL as the hero cover_image, drop it
// so the detail page doesn't render the same picture twice (hero + body).
function stripLeadingCoverImage(content: string, coverUrl: string | undefined): string {
  if (!content || !coverUrl) return content;
  const match = content.match(FIRST_MARKDOWN_IMAGE);
  if (!match || match.index === undefined) return content;
  // Only strip if the match is at the top of the body (ignoring whitespace).
  if (content.slice(0, match.index).trim() !== '') return content;
  if (match[1] !== coverUrl) return content;
  return content.slice(match.index + match[0].length).replace(/^\s+/, '');
}

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
  const rawContent = rec.content || '';
  const image = rec.cover_image?.url || extractFirstMarkdownImage(rawContent);
  return {
    _id: rec._id,
    slug: rec.slug,
    title: rec.title,
    date: dateSource ? new Date(dateSource).toISOString() : new Date().toISOString(),
    excerpt: rec.excerpt || '',
    author: rec.author || 'Canvas Classes',
    tags: rec.tags || [],
    image,
    content: stripLeadingCoverImage(rawContent, image),
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
