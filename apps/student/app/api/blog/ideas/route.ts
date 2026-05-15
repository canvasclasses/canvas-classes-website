import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import { BlogIdea, type BlogIdeaStatus } from '@/lib/models/BlogIdea';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

export const runtime = 'nodejs';

async function authorize(request: NextRequest): Promise<{ ok: boolean; email: string } | null> {
  if (await isLocalhostDev()) return { ok: true, email: 'dev@localhost' };
  if (hasScriptSecret(request)) return { ok: true, email: 'script@canvas' };
  const user = await getAuthenticatedUser(request);
  if (user?.email && isAdmin(user.email)) return { ok: true, email: user.email };
  return null;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await authorize(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 200);
    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const ideas = await BlogIdea.find(query)
      .sort({ priority: -1, created_at: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: ideas });
  } catch (error) {
    console.error('GET /api/blog/ideas error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await authorize(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.slice(0, 4000) : '';
    const target_tags = Array.isArray(body.target_tags)
      ? body.target_tags.filter((t: unknown) => typeof t === 'string').slice(0, 20)
      : [];
    const priority = Number.isFinite(body.priority) ? Math.min(Math.max(Math.round(body.priority), 1), 5) : 3;
    const target_publish_date = body.target_publish_date ? new Date(body.target_publish_date) : undefined;

    if (!title || title.length > 240) {
      return NextResponse.json({ success: false, error: 'Title required, max 240 chars' }, { status: 400 });
    }

    const idea = new BlogIdea({
      _id: uuidv4(),
      title,
      description,
      target_tags,
      priority,
      target_publish_date,
      created_by: auth.email,
    });

    await idea.save();
    return NextResponse.json({ success: true, data: idea }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog/ideas error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create idea' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await authorize(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id : null;
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });

    const idea = await BlogIdea.findOne({ _id: id });
    if (!idea) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    if (typeof body.title === 'string') idea.title = body.title.trim();
    if (typeof body.description === 'string') idea.description = body.description.slice(0, 4000);
    if (Array.isArray(body.target_tags)) {
      idea.target_tags = body.target_tags.filter((t: unknown) => typeof t === 'string').slice(0, 20);
    }
    if (Number.isFinite(body.priority)) idea.priority = Math.min(Math.max(Math.round(body.priority), 1), 5);
    if (body.target_publish_date !== undefined) {
      idea.target_publish_date = body.target_publish_date ? new Date(body.target_publish_date) : undefined;
    }
    const newStatus = body.status as BlogIdeaStatus | undefined;
    if (newStatus && ['pending', 'drafted', 'archived'].includes(newStatus)) {
      idea.status = newStatus;
    }
    if (typeof body.drafted_post_id === 'string') idea.drafted_post_id = body.drafted_post_id;

    await idea.save();
    return NextResponse.json({ success: true, data: idea });
  } catch (error) {
    console.error('PATCH /api/blog/ideas error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update idea' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await authorize(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });

    await BlogIdea.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/blog/ideas error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete idea' }, { status: 500 });
  }
}
