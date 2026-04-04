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

// Script bypass: local ingestion scripts pass x-admin-secret header instead of browser cookies
function hasScriptSecret(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('x-admin-secret') === secret;
}

// ── GET /api/v2/mock-tests — list all sets (admin: all; public: published only) ──

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const admin = hasScriptSecret(request) || isAdmin((await getAuthenticatedUser(request))?.email);

    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam');         // 'JEE' | 'NEET'
    const status = searchParams.get('status');      // 'draft' | 'published' | 'archived'
    const includeQuestions = searchParams.get('includeQuestions') === 'true';

    const filter: Record<string, unknown> = { deleted_at: { $in: [null, undefined] } };
    if (!admin) filter.status = 'published';
    if (exam && ['JEE', 'NEET'].includes(exam)) filter.exam = exam;
    if (admin && status) filter.status = status;

    const sets = await MockTestSet.find(filter)
      .sort({ exam: 1, year: -1, created_at: -1 })
      .lean();

    // Project and attach question count
    interface MockTestSetWithCount {
      questions?: Record<string, unknown>[];
      question_count: number;
      [key: string]: unknown;
    }
    const setsWithData = sets.map((s): MockTestSetWithCount => {
      const { questions, ...rest } = s;
      return {
        ...(includeQuestions ? s : rest),
        question_count: Array.isArray(questions) ? questions.length : 0,
      };
    });

    return NextResponse.json({ success: true, data: setsWithData });
  } catch (err) {
    console.error('[mock-tests GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch mock test sets' }, { status: 500 });
  }
}

// ── POST /api/v2/mock-tests — create new set (admin only) ────────────────────

export async function POST(request: NextRequest) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const authorEmail = scriptAuth ? 'script' : user?.email;

    if (!scriptAuth && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: `Unauthorized — logged in as: ${user?.email ?? 'not logged in'}` }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();

    const {
      title,
      exam,
      year,
      source,
      duration_minutes,
      marks_correct = 4,
      marks_incorrect = -1,
      sections,
      description,
      status = 'draft',
    } = body;

    if (!title || !exam || !['JEE', 'NEET'].includes(exam)) {
      return NextResponse.json(
        { success: false, error: 'title and exam (JEE|NEET) are required' },
        { status: 400 }
      );
    }

    const defaultDuration = exam === 'NEET' ? 200 : 180;

    const newSet = new MockTestSet({
      _id: uuidv4(),
      title,
      exam,
      year: year ?? new Date().getFullYear(),
      source: source ?? 'Custom',
      duration_minutes: duration_minutes ?? defaultDuration,
      marks_correct,
      marks_incorrect,
      sections: sections ?? [],
      questions: [],
      description: description ?? '',
      status,
      created_by: authorEmail ?? 'script',
      updated_by: authorEmail ?? 'script',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newSet.save();

    return NextResponse.json({ success: true, data: newSet.toObject() }, { status: 201 });
  } catch (err: unknown) {
    console.error('[mock-tests POST]', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to create mock test set';
    const errorName = err instanceof Error ? err.name : '';
    return NextResponse.json({
      success: false,
      error: errorMessage,
      detail: errorName,
    }, { status: 500 });
  }
}
