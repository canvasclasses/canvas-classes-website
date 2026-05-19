// GET /api/v2/mock-tests — list mock test sets (admin: all; public: published only).
// The matching admin POST (create set) lives in apps/admin.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { MockTestSet } from '@canvas/data/models/MockTestSet';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const admin = hasScriptSecret(request) || (await isLocalhostDev()) || isAdmin((await getAuthenticatedUser(request))?.email);

    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam');         // 'JEE' | 'NEET'
    const status = searchParams.get('status');      // 'draft' | 'published' | 'archived'
    const includeQuestions = searchParams.get('includeQuestions') === 'true';

    const filter: Record<string, unknown> = { deleted_at: { $in: [null, undefined] } };
    if (!admin) filter.status = 'published';
    if (exam && ['JEE', 'NEET'].includes(exam)) filter.exam = exam;
    if (admin && status) filter.status = status;

    const limitParam = parseInt(searchParams.get('limit') || '100', 10);
    const safeLimit = Math.min(Math.max(1, limitParam), 200);

    const sets = await MockTestSet.find(filter)
      .sort({ exam: 1, year: -1, created_at: -1 })
      .limit(safeLimit)
      .lean();

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
