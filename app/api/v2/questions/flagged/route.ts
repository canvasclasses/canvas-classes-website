import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

// GET /api/v2/questions/flagged
// Returns all questions that have at least one student flag (unresolved by default).
// Only source:'student' flags are returned — internal admin flags are excluded.
// Query params:
//   resolved=true  → questions where all student flags are resolved
//   all=true       → all student-flagged questions regardless of resolved status
//   source=admin   → switch to admin-source flags instead (for internal use)
export async function GET(request: NextRequest) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const localDev = await isLocalhostDev();
    if (!scriptAuth && !localDev && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();

    const showAll = request.nextUrl.searchParams.get('all') === 'true';
    const showResolved = request.nextUrl.searchParams.get('resolved') === 'true';
    // source param defaults to 'student' — internal callers can pass source=admin
    const sourceParam = request.nextUrl.searchParams.get('source') ?? 'student';
    // Legacy admin flags have source undefined/null — match them when source=admin requested
    const sourceMatch = sourceParam === 'admin'
      ? { $in: ['admin', null, undefined] }
      : 'student';

    // Build query — all flag filters are scoped to the requested source
    interface FlagFilter {
      flags: Record<string, unknown>;
      $nor?: Array<Record<string, unknown>>;
    }
    let flagFilter: FlagFilter;
    if (showAll) {
      flagFilter = { flags: { $elemMatch: { source: sourceMatch } } };
    } else if (showResolved) {
      // questions that have at least one flag of this source, all of which are resolved
      flagFilter = {
        flags: { $elemMatch: { source: sourceMatch } },
        $nor: [{ flags: { $elemMatch: { source: sourceMatch, resolved: false } } }],
      };
    } else {
      // default: questions with at least one unresolved flag of this source
      flagFilter = { flags: { $elemMatch: { source: sourceMatch, resolved: false } } };
    }

    const questions = await QuestionV2.find({
      ...flagFilter,
      deleted_at: null,
    })
      .select('_id display_id question_text.markdown metadata.chapter_id metadata.subject flags')
      .sort({ 'flags.flagged_at': -1 })
      .limit(500)
      .lean();

    return NextResponse.json({ success: true, questions, total: questions.length });
  } catch (err: unknown) {
    console.error('[GET /api/v2/questions/flagged]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
