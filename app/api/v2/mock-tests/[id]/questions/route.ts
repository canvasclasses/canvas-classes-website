import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import { MockTestSet } from '@/lib/models/MockTestSet';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

// ── POST /api/v2/mock-tests/[id]/questions — add a new question to a set ─────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const localDev = await isLocalhostDev();
    const authorEmail = scriptAuth ? 'script' : (user?.email ?? (localDev ? 'dev@localhost' : undefined));
    if (!scriptAuth && !localDev && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } });
    if (!set) return NextResponse.json({ success: false, error: 'Set not found' }, { status: 404 });

    // Determine next question_number
    interface MockQuestion {
      question_number?: number;
      [key: string]: unknown;
    }
    const nextNumber = set.questions.length > 0
      ? Math.max(...set.questions.map((q: MockQuestion) => q.question_number ?? 0)) + 1
      : 1;

    const newQuestion = {
      _id: uuidv4(),
      question_number: body.question_number ?? nextNumber,
      display_id: body.display_id ?? `MT-${set.exam}-Q${String(nextNumber).padStart(3, '0')}`,

      question_text: {
        markdown: body.question_text?.markdown ?? '',
        latex_validated: body.question_text?.latex_validated ?? false,
      },
      type: body.type ?? 'SCQ',
      options: body.options ?? [],
      answer: body.answer ?? {},
      solution: {
        text_markdown: body.solution?.text_markdown ?? '',
        latex_validated: body.solution?.latex_validated ?? false,
        asset_ids: body.solution?.asset_ids ?? { images: [], svg: [], audio: [] },
        video_url: body.solution?.video_url,
        video_timestamp_start: body.solution?.video_timestamp_start,
      },
      metadata: {
        subject: body.metadata?.subject ?? 'chemistry',
        difficultyLevel: body.metadata?.difficultyLevel ?? 3,
        marks_correct: body.metadata?.marks_correct ?? set.marks_correct,
        marks_incorrect: body.metadata?.marks_incorrect ?? set.marks_incorrect,
        section: body.metadata?.section,
        topic_hint: body.metadata?.topic_hint,
      },
      flags: [],
      asset_ids: body.asset_ids ?? [],
      svg_scales: body.svg_scales ?? {},
      created_at: new Date(),
      updated_at: new Date(),
    };

    set.questions.push(newQuestion as unknown);
    set.updated_at = new Date();
    set.updated_by = authorEmail ?? 'script';

    await set.save();

    return NextResponse.json({ success: true, data: newQuestion }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: 'Validation failed', details: (err as Error & { errors?: unknown }).errors }, { status: 400 });
    }
    console.error('[mock-tests questions POST]', err);
    return NextResponse.json({ success: false, error: 'Failed to add question' }, { status: 500 });
  }
}
