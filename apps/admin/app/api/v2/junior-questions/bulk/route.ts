// Admin API — bulk-insert Junior Questions. Used by the extraction-seeding
// scripts (IIT Foundation mining) and by any future import flow. Assigns
// sequential display_ids from a shared prefix and inserts in one batch.

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@canvas/data/db/mongodb';
import { JuniorQuestion } from '@canvas/data/models/JuniorQuestion';
import { JuniorQuestionBulkSchema } from '@canvas/data/schemas/juniorQuestion';
import { requireAdmin } from '@/lib/auth';
import { nextDisplayIds } from '@/lib/juniorDisplayId';

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;
  const email = gate.user?.email ?? 'script';

  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = JuniorQuestionBulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { prefix, questions } = parsed.data;

    const ids = await nextDisplayIds(prefix, questions.length);
    const now = new Date();
    const docs = questions.map((q, i) => ({
      _id: uuidv4(),
      display_id: ids[i],
      ...q,
      explanation: q.explanation ?? { markdown: '' },
      source: q.source ?? 'original',
      status: q.status ?? 'published',
      created_by: email,
      updated_by: email,
      created_at: now,
      updated_at: now,
    }));

    // ordered:false → one bad row doesn't abort the rest; we report inserted count.
    const res = await JuniorQuestion.insertMany(docs, { ordered: false });
    return NextResponse.json(
      { success: true, inserted: res.length, display_ids: res.map((d) => d.display_id) },
      { status: 201 },
    );
  } catch (err: unknown) {
    // Partial success on insertMany surfaces as a BulkWriteError with insertedDocs.
    if (err && typeof err === 'object' && 'insertedDocs' in err) {
      const inserted = (err as { insertedDocs: unknown[] }).insertedDocs?.length ?? 0;
      console.error('[junior-questions/bulk POST] partial', err);
      return NextResponse.json(
        { success: false, error: 'Some rows failed; others inserted', inserted },
        { status: 207 },
      );
    }
    console.error('[junior-questions/bulk POST]', err);
    return NextResponse.json({ success: false, error: 'Failed to bulk insert' }, { status: 500 });
  }
}
