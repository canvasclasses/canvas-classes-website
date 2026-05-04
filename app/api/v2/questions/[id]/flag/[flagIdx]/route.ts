import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

// PATCH /api/v2/questions/[id]/flag/[flagIdx]/resolve
// Marks a specific flag as resolved (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; flagIdx: string }> }
) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const localDev = await isLocalhostDev();
    if (!scriptAuth && !localDev && !isAdmin(user?.email)) {
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

    // Bust the questions cache so the resolved-flag state propagates to admin list view
    revalidateTag('questions');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/v2/questions/[id]/flag/[flagIdx]/resolve]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
