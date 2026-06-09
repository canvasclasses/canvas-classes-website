// Admin API — Junior Question Bank (grades 6–10).
//   GET  : list / filter (admin-gated; bounded).
//   POST : create a single question.
// Bulk seeding lives in ./bulk/route.ts.

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@canvas/data/db/mongodb';
import { JuniorQuestion } from '@canvas/data/models/JuniorQuestion';
import { JuniorQuestionCreateSchema } from '@canvas/data/schemas/juniorQuestion';
import { requireAdmin } from '@/lib/auth';
import { nextDisplayIds } from '@/lib/juniorDisplayId';

const MAX_LIMIT = 200;

export async function GET(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  try {
    await connectToDatabase();
    const sp = request.nextUrl.searchParams;

    const filter: Record<string, unknown> = { deleted_at: null };
    if (sp.get('grade')) filter.grade = Number(sp.get('grade'));
    if (sp.get('subject')) filter.subject = sp.get('subject');
    if (sp.get('chapter_number')) filter.chapter_number = Number(sp.get('chapter_number'));
    if (sp.get('chapter_slug')) filter.chapter_slug = sp.get('chapter_slug');
    if (sp.get('book_slug')) filter.book_slug = sp.get('book_slug');
    if (sp.get('status')) filter.status = sp.get('status');
    if (sp.get('format')) filter.format = sp.get('format');
    const q = sp.get('q');
    if (q) filter['question_text.markdown'] = { $regex: q, $options: 'i' };

    const limit = Math.min(Number(sp.get('limit')) || 50, MAX_LIMIT);
    const skip = Math.max(Number(sp.get('skip')) || 0, 0);

    const [items, total] = await Promise.all([
      JuniorQuestion.find(filter)
        .sort({ chapter_number: 1, display_id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JuniorQuestion.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, data: items, total, limit, skip });
  } catch (err) {
    console.error('[junior-questions GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to list questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;
  const email = gate.user?.email ?? 'script';

  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = JuniorQuestionCreateSchema.safeParse(body?.question ?? body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    // display_id: caller supplies a prefix (e.g. "C9SCI-MIX"); we assign the
    // next number. Retry on the rare duplicate-key race.
    const prefix: string = (body?.prefix ?? '').toString().trim();
    if (!/^[A-Z0-9-]{2,24}$/.test(prefix)) {
      return NextResponse.json(
        { success: false, error: 'A display_id prefix (UPPER-CASE) is required, e.g. "C9SCI-MIX".' },
        { status: 400 },
      );
    }

    for (let attempt = 0; attempt < 4; attempt++) {
      const [display_id] = await nextDisplayIds(prefix, 1);
      try {
        const doc = await JuniorQuestion.create({
          _id: uuidv4(),
          display_id,
          ...data,
          explanation: data.explanation ?? { markdown: '' },
          source: data.source ?? 'original',
          status: data.status ?? 'published',
          created_by: email,
          updated_by: email,
          created_at: new Date(),
          updated_at: new Date(),
        });
        return NextResponse.json({ success: true, data: doc.toObject() }, { status: 201 });
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'code' in e && (e as { code: number }).code === 11000) {
          continue; // display_id collided — recompute and retry
        }
        throw e;
      }
    }
    return NextResponse.json({ success: false, error: 'Could not assign a unique display_id' }, { status: 409 });
  } catch (err) {
    console.error('[junior-questions POST]', err);
    return NextResponse.json({ success: false, error: 'Failed to create question' }, { status: 500 });
  }
}
