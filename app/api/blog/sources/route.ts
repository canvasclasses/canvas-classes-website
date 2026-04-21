import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import { BlogSource, type BlogSourceStatus } from '@/lib/models/BlogSource';
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

function hashUrl(url: string): string {
  return crypto.createHash('sha256').update(url.trim().toLowerCase()).digest('hex').slice(0, 32);
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await authorize(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 200);
    const minScore = parseFloat(searchParams.get('min_score') || '0');

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (minScore > 0) query.relevance_score = { $gte: minScore };

    const sources = await BlogSource.find(query)
      .sort({ relevance_score: -1, fetched_at: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: sources });
  } catch (error) {
    console.error('GET /api/blog/sources error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await authorize(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [body];
    const inserted: unknown[] = [];
    const skipped: string[] = [];

    for (const item of items) {
      const url = typeof item.url === 'string' ? item.url.trim() : '';
      if (!url) continue;
      const url_hash = hashUrl(url);

      const existing = await BlogSource.findOne({ url_hash }).lean();
      if (existing) {
        skipped.push(url);
        continue;
      }

      const doc = new BlogSource({
        _id: uuidv4(),
        url,
        url_hash,
        source_name: typeof item.source_name === 'string' ? item.source_name : 'unknown',
        title: typeof item.title === 'string' ? item.title : url,
        summary: typeof item.summary === 'string' ? item.summary.slice(0, 2000) : '',
        categories: Array.isArray(item.categories) ? item.categories.filter((c: unknown) => typeof c === 'string').slice(0, 20) : [],
        published_at: item.published_at ? new Date(item.published_at) : undefined,
        relevance_score: Number.isFinite(item.relevance_score) ? Math.min(Math.max(item.relevance_score, 0), 1) : 0,
        relevance_reason: typeof item.relevance_reason === 'string' ? item.relevance_reason.slice(0, 500) : '',
      });
      await doc.save();
      inserted.push(doc);
    }

    return NextResponse.json({ success: true, inserted: inserted.length, skipped: skipped.length, data: inserted });
  } catch (error) {
    console.error('POST /api/blog/sources error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save sources' }, { status: 500 });
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

    const source = await BlogSource.findOne({ _id: id });
    if (!source) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const newStatus = body.status as BlogSourceStatus | undefined;
    if (newStatus && ['new', 'reviewed', 'drafted', 'ignored'].includes(newStatus)) {
      source.status = newStatus;
    }
    if (typeof body.used_in_post === 'string') source.used_in_post = body.used_in_post;

    await source.save();
    return NextResponse.json({ success: true, data: source });
  } catch (error) {
    console.error('PATCH /api/blog/sources error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update source' }, { status: 500 });
  }
}
