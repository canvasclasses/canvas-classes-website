import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import { MockTestSet } from '@/lib/models/MockTestSet';
import { createServerClient } from '@supabase/ssr';

// ── Auth helper ───────────────────────────────────────────────────────────────

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

function hasScriptSecret(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('x-admin-secret') === secret;
}

// ── GET /api/v2/mock-tests/[id] — fetch single set with all questions ─────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const admin = scriptAuth || isAdmin(user?.email);

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } }).lean();
    if (!set) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    // Non-admins can only see published sets
    const mockSet = set as unknown as { status: string };
    if (!admin && mockSet.status !== 'published') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: set });
  } catch (err) {
    console.error('[mock-tests/[id] GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch mock test set' }, { status: 500 });
  }
}

// ── PATCH /api/v2/mock-tests/[id] — update set metadata (admin only) ─────────
// Supports partial update of set fields.
// To add/update/remove questions, use the question-specific endpoints below.

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const authorEmail = scriptAuth ? 'script' : user?.email;
    if (!scriptAuth && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } });
    if (!set) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    // Allowed top-level field updates
    const allowedFields = [
      'title', 'exam', 'year', 'source', 'duration_minutes',
      'marks_correct', 'marks_incorrect', 'sections', 'description', 'status', 'slug',
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (set as unknown as Record<string, unknown>)[field] = body[field];
      }
    }

    // Handle questions array replacement (full replace — used by bulk AI ingestion)
    if (body.questions !== undefined && Array.isArray(body.questions)) {
      set.questions = body.questions;
    }

    set.updated_at = new Date();
    set.updated_by = authorEmail ?? 'script';

    await set.save();

    return NextResponse.json({ success: true, data: set.toObject() });
  } catch (err) {
    console.error('[mock-tests/[id] PATCH]', err);
    return NextResponse.json({ success: false, error: 'Failed to update mock test set' }, { status: 500 });
  }
}

// ── DELETE /api/v2/mock-tests/[id] — soft delete (admin only) ────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const authorEmail = scriptAuth ? 'script' : user?.email;
    if (!scriptAuth && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } });
    if (!set) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    set.deleted_at = new Date();
    set.deleted_by = authorEmail ?? 'script';
    set.updated_at = new Date();
    set.updated_by = authorEmail ?? 'script';

    await set.save();

    return NextResponse.json({ success: true, message: 'Mock test set deleted' });
  } catch (err) {
    console.error('[mock-tests/[id] DELETE]', err);
    return NextResponse.json({ success: false, error: 'Failed to delete mock test set' }, { status: 500 });
  }
}
