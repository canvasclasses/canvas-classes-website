import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { BlogPost, type BlogStatus } from '@canvas/data/models/BlogPost';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await connectToDatabase();
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;

    const post = await BlogPost.findOne({ _id: id, deleted_at: null }).lean();
    if (!post) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('GET /api/blog/posts/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await connectToDatabase();
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;

    const body = await request.json();
    const post = await BlogPost.findOne({ _id: id, deleted_at: null });
    if (!post) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const allowed: Array<keyof typeof body> = [
      'title', 'excerpt', 'content', 'tags', 'status', 'author',
      'cover_image', 'scheduled_for', 'seo', 'slug', 'source_refs', 'source',
    ];
    for (const key of allowed) {
      if (key in body) {
        if (key === 'status') {
          const s = body.status as BlogStatus;
          if (['idea', 'draft', 'review', 'scheduled', 'published', 'archived'].includes(s)) {
            post.status = s;
            if (s === 'published' && !post.published_at) post.published_at = new Date();
          }
        } else if (key === 'tags' && Array.isArray(body.tags)) {
          post.tags = body.tags.filter((t: unknown) => typeof t === 'string').slice(0, 20);
        } else if (key === 'source_refs' && Array.isArray(body.source_refs)) {
          post.source_refs = body.source_refs.filter((s: unknown) => typeof s === 'string').slice(0, 10);
        } else if (key === 'scheduled_for') {
          post.scheduled_for = body.scheduled_for ? new Date(body.scheduled_for) : null;
        } else if (key === 'cover_image') {
          post.cover_image = body.cover_image && typeof body.cover_image.url === 'string'
            ? { url: body.cover_image.url, alt: body.cover_image.alt || '' }
            : undefined;
        } else if (key === 'seo' && body.seo && typeof body.seo === 'object') {
          post.seo = {
            title: typeof body.seo.title === 'string' ? body.seo.title : post.seo?.title,
            description: typeof body.seo.description === 'string' ? body.seo.description : post.seo?.description,
            keywords: Array.isArray(body.seo.keywords)
              ? body.seo.keywords.filter((k: unknown) => typeof k === 'string').slice(0, 30)
              : post.seo?.keywords || [],
          };
        } else if (typeof body[key] === 'string') {
          (post as unknown as Record<string, unknown>)[key as string] = body[key];
        }
      }
    }
    post.updated_by = gate.user.email;

    await post.save();
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('PATCH /api/blog/posts/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await connectToDatabase();
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;

    const post = await BlogPost.findOne({ _id: id });
    if (!post) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    post.deleted_at = new Date();
    post.updated_by = gate.user.email;
    await post.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/blog/posts/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
