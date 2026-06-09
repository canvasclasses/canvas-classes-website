// Admin API — single Junior Question.
//   GET    : fetch one.
//   PATCH  : update (whitelisted fields via Zod).
//   DELETE : soft-delete (sets deleted_at).

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { JuniorQuestion } from '@canvas/data/models/JuniorQuestion';
import { JuniorQuestionPatchSchema } from '@canvas/data/schemas/juniorQuestion';
import { requireAdmin } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;
  try {
    await connectToDatabase();
    const { id } = await params;
    const doc = await JuniorQuestion.findOne({ _id: id, deleted_at: null }).lean();
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: doc });
  } catch (err) {
    console.error('[junior-questions/:id GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch question' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;
  const email = gate.user?.email ?? 'script';

  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const parsed = JuniorQuestionPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Explicit whitelist — never spread the raw body into $set (§8.6).
    const allowed = [
      'grade', 'subject', 'book_slug', 'chapter_number', 'chapter_slug', 'topic',
      'format', 'question_text', 'assertion', 'reason', 'options', 'explanation',
      'image_src', 'image_prompt', 'concept_tag', 'difficulty', 'source', 'status',
    ] as const;
    const update: Record<string, unknown> = { updated_by: email, updated_at: new Date() };
    for (const key of allowed) {
      if (key in parsed.data && parsed.data[key as keyof typeof parsed.data] !== undefined) {
        update[key] = parsed.data[key as keyof typeof parsed.data];
      }
    }

    const doc = await JuniorQuestion.findOneAndUpdate(
      { _id: id, deleted_at: null },
      { $set: update },
      { new: true, runValidators: true },
    ).lean();
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: doc });
  } catch (err) {
    console.error('[junior-questions/:id PATCH]', err);
    return NextResponse.json({ success: false, error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;
  const email = gate.user?.email ?? 'script';

  try {
    await connectToDatabase();
    const { id } = await params;
    const doc = await JuniorQuestion.findOneAndUpdate(
      { _id: id, deleted_at: null },
      { $set: { deleted_at: new Date(), updated_by: email, updated_at: new Date() } },
      { new: true },
    ).lean();
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[junior-questions/:id DELETE]', err);
    return NextResponse.json({ success: false, error: 'Failed to delete question' }, { status: 500 });
  }
}
