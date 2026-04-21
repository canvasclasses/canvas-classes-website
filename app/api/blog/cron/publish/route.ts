import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';
import { hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

export const runtime = 'nodejs';

// Called by Vercel Cron (authenticated via CRON_SECRET header) or by admin scripts
// (x-admin-secret). Flips any `scheduled` post whose scheduled_for has arrived
// into `published` and stamps published_at.
export async function POST(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const hasVercelCron = cronSecret && request.headers.get('authorization') === `Bearer ${cronSecret}`;
    const isAllowed = hasVercelCron || hasScriptSecret(request) || (await isLocalhostDev());
    if (!isAllowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const now = new Date();
    const due = await BlogPost.find({
      status: 'scheduled',
      deleted_at: null,
      scheduled_for: { $lte: now },
    }).limit(50);

    let published = 0;
    for (const post of due) {
      post.status = 'published';
      if (!post.published_at) post.published_at = new Date();
      post.updated_by = 'cron';
      await post.save();
      published += 1;
    }

    return NextResponse.json({ success: true, published, at: now.toISOString() });
  } catch (error) {
    console.error('POST /api/blog/cron/publish error:', error);
    return NextResponse.json({ success: false, error: 'Publish cron failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
