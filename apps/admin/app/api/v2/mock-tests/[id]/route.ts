// Admin PATCH + DELETE for a mock test set. The matching GET (which serves
// both admin-with-drafts and student-with-published) stays in apps/student
// because students need to load a published set to take it.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { MockTestSet } from '@canvas/data/models/MockTestSet';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

export async function PATCH(
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
    if (!set) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const allowedFields = [
      'title', 'exam', 'year', 'source', 'duration_minutes',
      'marks_correct', 'marks_incorrect', 'sections', 'description', 'status', 'slug',
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (set as unknown as Record<string, unknown>)[field] = body[field];
      }
    }

    if (body.questions !== undefined && Array.isArray(body.questions)) {
      set.questions = body.questions;
    }

    set.updated_at = new Date();
    set.updated_by = authorEmail ?? 'script';

    await set.save();

    return NextResponse.json({ success: true, data: set.toObject() });
  } catch (err) {
    console.error('[mock-tests/[id] PATCH]', err);
    return NextResponse.json({ success: false, error: 'Failed to update mock test set' }, { status: 500 });
  }
}

export async function DELETE(
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

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } });
    if (!set) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    set.deleted_at = new Date();
    set.deleted_by = authorEmail ?? 'script';
    set.updated_at = new Date();
    set.updated_by = authorEmail ?? 'script';

    await set.save();

    return NextResponse.json({ success: true, message: 'Mock test set deleted' });
  } catch (err) {
    console.error('[mock-tests/[id] DELETE]', err);
    return NextResponse.json({ success: false, error: 'Failed to delete mock test set' }, { status: 500 });
  }
}
