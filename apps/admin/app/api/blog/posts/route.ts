import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@canvas/data/db/mongodb';
import { BlogPost, type BlogStatus } from '@canvas/data/models/BlogPost';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 200);
    const query: Record<string, unknown> = { deleted_at: null };
    if (status) query.status = status;

    const posts = await BlogPost.find(query)
      .sort({ updated_at: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('GET /api/blog/posts error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;

    const body = await request.json();

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const content = typeof body.content === 'string' ? body.content : '';
    const excerpt = typeof body.excerpt === 'string' ? body.excerpt : '';
    const tags = Array.isArray(body.tags) ? body.tags.filter((t: unknown) => typeof t === 'string').slice(0, 20) : [];
    const status: BlogStatus = ['idea', 'draft', 'review', 'scheduled', 'published', 'archived'].includes(body.status)
      ? body.status
      : 'draft';
    const source = ['manual', 'rss', 'idea'].includes(body.source) ? body.source : 'manual';
    const author = typeof body.author === 'string' ? body.author : 'Canvas Classes';
    const cover_image = body.cover_image && typeof body.cover_image.url === 'string'
      ? { url: body.cover_image.url, alt: body.cover_image.alt || '' }
      : undefined;
    const scheduled_for = body.scheduled_for ? new Date(body.scheduled_for) : undefined;
    const idea_id = typeof body.idea_id === 'string' ? body.idea_id : undefined;
    const source_refs = Array.isArray(body.source_refs)
      ? body.source_refs.filter((s: unknown) => typeof s === 'string').slice(0, 10)
      : [];
    const seo = body.seo && typeof body.seo === 'object' ? {
      title: typeof body.seo.title === 'string' ? body.seo.title : undefined,
      description: typeof body.seo.description === 'string' ? body.seo.description : undefined,
      keywords: Array.isArray(body.seo.keywords) ? body.seo.keywords.filter((k: unknown) => typeof k === 'string').slice(0, 30) : [],
    } : { keywords: [] };

    if (!title || title.length > 240) {
      return NextResponse.json({ success: false, error: 'Title required, max 240 chars' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });
    }

    const baseSlug = body.slug && typeof body.slug === 'string' ? slugify(body.slug) : slugify(title);
    let slug = baseSlug;
    let attempt = 0;
    while (await BlogPost.findOne({ slug }).lean()) {
      attempt += 1;
      slug = `${baseSlug}-${attempt}`;
      if (attempt > 20) break;
    }

    const doc = new BlogPost({
      _id: uuidv4(),
      slug,
      title,
      excerpt: excerpt || title,
      content,
      cover_image,
      tags,
      author,
      status,
      source,
      source_refs,
      idea_id,
      scheduled_for,
      seo,
      created_by: gate.user.email,
      updated_by: gate.user.email,
    });

    await doc.save();
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog/posts error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
