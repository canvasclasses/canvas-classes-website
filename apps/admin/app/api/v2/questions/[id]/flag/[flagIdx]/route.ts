import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import { requireAdmin } from '@/lib/auth';

// PATCH /api/v2/questions/[id]/flag/[flagIdx]/resolve
// Marks a specific flag as resolved (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; flagIdx: string }> }
) {
  try {
    const gate = await requireAdmin(request);
    if (!gate.ok) return gate.response;

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

    // No revalidateTag('questions') here: a flag's resolved state is NOT rendered on
    // any public page, and busting the whole bank cache on every flag-resolve (especially
    // during triage batches) caused mass ISR regeneration. The DB is correct immediately;
    // the cached admin list reflects it within the 1h ISR window. (vercel-cost #18)
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/v2/questions/[id]/flag/[flagIdx]/resolve]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
