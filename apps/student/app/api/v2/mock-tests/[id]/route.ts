// GET /api/v2/mock-tests/[id] — fetch a single mock test set. Admin gets
// drafts/archived; non-admin only sees published. The matching admin PATCH +
// DELETE live in apps/admin.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { MockTestSet } from '@canvas/data/models/MockTestSet';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const scriptAuth = hasScriptSecret(request);
    const user = scriptAuth ? null : await getAuthenticatedUser(request);
    const admin = scriptAuth || (await isLocalhostDev()) || isAdmin(user?.email);

    const set = await MockTestSet.findOne({ _id: id, deleted_at: { $in: [null, undefined] } }).lean();
    if (!set) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const mockSet = set as unknown as { status: string };
    if (!admin && mockSet.status !== 'published') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: set });
  } catch (err) {
    console.error('[mock-tests/[id] GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch mock test set' }, { status: 500 });
  }
}
