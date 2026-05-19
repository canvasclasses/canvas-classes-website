// Admin POST — create a new mock test set. The public/admin-aware GET (lists
// sets) stays in apps/student because students need to enumerate published
// sets to take them.

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@canvas/data/db/mongodb';
import { MockTestSet } from '@canvas/data/models/MockTestSet';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const localDev = await isLocalhostDev();
    const authorEmail = scriptAuth ? 'script' : (user?.email ?? (localDev ? 'dev@localhost' : undefined));

    if (!scriptAuth && !localDev && !isAdmin(user?.email)) {
      return NextResponse.json({ success: false, error: `Unauthorized — logged in as: ${user?.email ?? 'not logged in'}` }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();

    const {
      title,
      exam,
      year,
      source,
      duration_minutes,
      marks_correct = 4,
      marks_incorrect = -1,
      sections,
      description,
      status = 'draft',
    } = body;

    if (!title || !exam || !['JEE', 'NEET'].includes(exam)) {
      return NextResponse.json(
        { success: false, error: 'title and exam (JEE|NEET) are required' },
        { status: 400 }
      );
    }

    const defaultDuration = exam === 'NEET' ? 200 : 180;

    const newSet = new MockTestSet({
      _id: uuidv4(),
      title,
      exam,
      year: year ?? new Date().getFullYear(),
      source: source ?? 'Custom',
      duration_minutes: duration_minutes ?? defaultDuration,
      marks_correct,
      marks_incorrect,
      sections: sections ?? [],
      questions: [],
      description: description ?? '',
      status,
      created_by: authorEmail ?? 'script',
      updated_by: authorEmail ?? 'script',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newSet.save();

    return NextResponse.json({ success: true, data: newSet.toObject() }, { status: 201 });
  } catch (err: unknown) {
    console.error('[mock-tests POST]', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to create mock test set';
    const errorName = err instanceof Error ? err.name : '';
    return NextResponse.json({
      success: false,
      error: errorMessage,
      detail: errorName,
    }, { status: 500 });
  }
}
