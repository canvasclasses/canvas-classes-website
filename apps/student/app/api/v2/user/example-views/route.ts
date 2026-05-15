// POST /api/v2/user/example-views
// Records which worked examples a student viewed before a practice session.
// Fire-and-forget from client — silently ignored on auth failure.

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { chapterId, sessionId, viewedExamples, completedAll } = body;

    if (!chapterId || !sessionId || !Array.isArray(viewedExamples)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    await mongoose.connection.db!.collection('example_view_sessions').insertOne({
      studentId:      userId,
      chapterId,
      sessionId,
      viewedExamples, // [{ displayId, microConcept, timeSpentMs }]
      completedAll:   !!completedAll,
      viewedAt:       new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[example-views] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
