import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { createServerClient } from '@supabase/ssr';

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

// PATCH /api/v2/questions/[id]/flag/[flagIdx]/resolve
// Marks a specific flag as resolved (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; flagIdx: string }> }
) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    if (!scriptAuth && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const { id, flagIdx } = await params;
    const idx = parseInt(flagIdx, 10);
    if (isNaN(idx) || idx < 0) {
      return NextResponse.json({ success: false, error: 'Invalid flag index' }, { status: 400 });
    }

    const question = await QuestionV2.findOne({ _id: id, deleted_at: null });
    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    if (!question.flags || idx >= question.flags.length) {
      return NextResponse.json({ success: false, error: 'Flag not found' }, { status: 404 });
    }

    // Use positional $ operator via arrayFilters for safety
    const updatePath = `flags.${idx}.resolved`;
    const updatePathDate = `flags.${idx}.resolved_at`;

    await QuestionV2.updateOne(
      { _id: id },
      { $set: { [updatePath]: true, [updatePathDate]: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/v2/questions/[id]/flag/[flagIdx]/resolve]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
