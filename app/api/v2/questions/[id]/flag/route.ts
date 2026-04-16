import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';

// ── Flag types students can report ─────────────────────────────────────────
const VALID_FLAG_TYPES = [
  'wrong_answer',      // Marked answer seems incorrect
  'wrong_question',    // Question text has an error or typo
  'latex_rendering',   // Math / chemical formula not rendering properly
  'image_missing',     // Diagram or image not loading
  'option_error',      // One of the options has a mistake
  'solution_error',    // Solution explanation is wrong or missing steps
  'other',             // Free-text only
] as const;

type FlagType = typeof VALID_FLAG_TYPES[number];

// POST /api/v2/questions/[id]/flag
// Body: { type: FlagType, note?: string }
// Auth: Bearer token required (student must be logged in)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    // ── Parse body ──────────────────────────────────────────────────────────
    let body: { type?: string; note?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { type, note } = body;

    if (!type || !VALID_FLAG_TYPES.includes(type as FlagType)) {
      return NextResponse.json({
        success: false,
        error: `Invalid flag type. Must be one of: ${VALID_FLAG_TYPES.join(', ')}`,
      }, { status: 400 });
    }

    // Sanitise note — max 500 chars, strip control characters
    const cleanNote = note
      ? note.replace(/[\x00-\x1F\x7F]/g, ' ').trim().slice(0, 500)
      : undefined;

    // ── DB ──────────────────────────────────────────────────────────────────
    await connectToDatabase();

    const question = await QuestionV2.findOne({ _id: id, deleted_at: null });
    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    // Prevent duplicate unresolved flags from the same user for the same type
    interface QuestionFlag {
      flagged_by?: string;
      type?: string;
      resolved?: boolean;
      [key: string]: unknown;
    }
    const existingFlag = (question.flags ?? []).find(
      (f: unknown) => {
        const flag = f as QuestionFlag;
        return flag.flagged_by === user.id && flag.type === type && !flag.resolved;
      }
    );
    if (existingFlag) {
      return NextResponse.json({
        success: true,
        message: 'You have already flagged this question for this reason.',
        duplicate: true,
      });
    }

    // Push the new flag — always tagged source:'student' so it's never confused
    // with internal admin flags (source:'admin' or legacy undefined)
    const newFlag = {
      type,
      note: cleanNote,
      flagged_by: user.id,           // Supabase user UUID
      source: 'student' as const,
      flagged_at: new Date(),
      resolved: false,
    };

    await QuestionV2.updateOne(
      { _id: id },
      { $push: { flags: newFlag } }
    );

    return NextResponse.json({
      success: true,
      message: 'Thank you — your report has been sent to our team.',
    });

  } catch (err: unknown) {
    console.error('[POST /api/v2/questions/[id]/flag]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
