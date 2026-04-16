import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { MockTestSet } from '@/lib/models/MockTestSet';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';

// ── PATCH /api/v2/mock-tests/[id]/questions/[qid] — update a question ────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; qid: string }> }
) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const authorEmail = scriptAuth ? 'script' : user?.email;
    if (!scriptAuth && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const { id, qid } = await params;
    const body = await request.json();

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } });
    if (!set) return NextResponse.json({ success: false, error: 'Set not found' }, { status: 404 });

    interface MockQuestion {
      _id: string;
      [key: string]: unknown;
    }
    const qIndex = set.questions.findIndex((q: MockQuestion) => q._id === qid);
    if (qIndex === -1) return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });

    const question = set.questions[qIndex] as unknown as Record<string, unknown>;

    // Merge updates — support full or partial question body
    const updatable = [
      'question_text', 'type', 'options', 'answer', 'solution',
      'metadata', 'asset_ids', 'svg_scales', 'display_id', 'question_number', 'flags',
    ];
    for (const field of updatable) {
      if (body[field] !== undefined) {
        question[field] = body[field];
      }
    }

    question.updated_at = new Date();
    set.questions[qIndex] = question;
    set.markModified('questions');
    set.updated_at = new Date();
    set.updated_by = authorEmail ?? 'script';

    await set.save();

    return NextResponse.json({ success: true, data: question });
  } catch (err) {
    console.error('[mock-tests questions/[qid] PATCH]', err);
    return NextResponse.json({ success: false, error: 'Failed to update question' }, { status: 500 });
  }
}

// ── DELETE /api/v2/mock-tests/[id]/questions/[qid] — remove a question ───────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; qid: string }> }
) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const authorEmail = scriptAuth ? 'script' : user?.email;
    if (!scriptAuth && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const { id, qid } = await params;

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } });
    if (!set) return NextResponse.json({ success: false, error: 'Set not found' }, { status: 404 });

    const originalLength = set.questions.length;
    interface MockQuestion {
      _id: string;
      question_number?: number;
      [key: string]: unknown;
    }
    set.questions = set.questions.filter((q: MockQuestion) => q._id !== qid) as unknown[];

    if (set.questions.length === originalLength) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    // Re-number remaining questions sequentially
    set.questions.forEach((q: unknown, i: number) => {
      (q as unknown as { question_number?: number }).question_number = i + 1;
    });

    set.markModified('questions');
    set.updated_at = new Date();
    set.updated_by = authorEmail ?? 'script';

    await set.save();

    return NextResponse.json({ success: true, message: 'Question removed' });
  } catch (err) {
    console.error('[mock-tests questions/[qid] DELETE]', err);
    return NextResponse.json({ success: false, error: 'Failed to delete question' }, { status: 500 });
  }
}
