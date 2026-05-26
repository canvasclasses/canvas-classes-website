import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@canvas/data/db/mongodb';
import { UserAccess } from '@canvas/data/models/UserAccess';
import { UserAccessAuditLog } from '@canvas/data/models/UserAccessAuditLog';
import {
  isSuperAdmin,
  invalidateAccessCache,
  getSubjectFromChapterId,
} from '@canvas/data/rbac';
import { getAuthenticatedUser } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

const GrantSchema = z.object({
  subject: z.enum(['chemistry', 'physics', 'mathematics', 'biology']),
  chapters: z.union([
    z.literal('all'),
    z.array(z.string()).min(1).max(100),
  ]),
  level: z.enum(['view', 'edit']),
});

const UserAccessBodySchema = z.object({
  email: z.string().email().transform((e) => e.toLowerCase()),
  grants: z.array(GrantSchema).max(50).refine(
    (g) => new Set(g.map((x) => x.subject)).size === g.length,
    { message: 'Duplicate subject in grants' },
  ),
  notes: z.string().max(500).optional(),
});

// Cross-field validation: every chapter ID in `chapters: string[]` must
// belong to the grant's subject.
function validateGrantChapters(grants: z.infer<typeof GrantSchema>[]): string | null {
  for (const g of grants) {
    if (g.chapters === 'all') continue;
    for (const chId of g.chapters) {
      const subj = getSubjectFromChapterId(chId);
      if (subj !== g.subject) {
        return `Chapter ${chId} does not belong to subject ${g.subject}`;
      }
    }
  }
  return null;
}

async function requireSuperAdmin(
  request: NextRequest,
): Promise<{ ok: true; actorEmail: string } | { ok: false; response: NextResponse }> {
  if (await isLocalhostDev()) return { ok: true, actorEmail: 'local-dev' };
  const user = await getAuthenticatedUser(request);
  if (!user?.email) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isSuperAdmin(user.email)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Forbidden: Only super admins can manage staff access' },
        { status: 403 },
      ),
    };
  }
  return { ok: true, actorEmail: user.email };
}

// GET /api/v2/admin/user-access — list all active user_access docs
// GET /api/v2/admin/user-access?email=foo — fetch one
export async function GET(request: NextRequest) {
  try {
    const guard = await requireSuperAdmin(request);
    if (!guard.ok) return guard.response;

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      const doc = await UserAccess.findOne({ email: email.toLowerCase() })
        .select('-__v')
        .lean();
      if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ userAccess: doc });
    }

    const docs = await UserAccess.find({ is_active: true })
      .select('-__v')
      .sort({ granted_at: -1 })
      .limit(500)
      .lean();

    return NextResponse.json({ userAccess: docs });
  } catch (err) {
    console.error('Error fetching user_access:', err);
    return NextResponse.json({ error: 'Failed to fetch user access' }, { status: 500 });
  }
}

// PUT /api/v2/admin/user-access — upsert by email
export async function PUT(request: NextRequest) {
  try {
    const guard = await requireSuperAdmin(request);
    if (!guard.ok) return guard.response;
    const actorEmail = guard.actorEmail;

    await connectToDatabase();
    const body = await request.json();
    const parsed = UserAccessBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const { email, grants, notes } = parsed.data;

    // Self-modification block.
    if (email === actorEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot modify your own access' },
        { status: 403 },
      );
    }

    // Cannot grant access to someone already a super admin.
    if (isSuperAdmin(email)) {
      return NextResponse.json(
        { error: 'Cannot grant access to a super admin — they already have full access via env' },
        { status: 400 },
      );
    }

    // Cross-field chapter ↔ subject validation.
    const chapterErr = validateGrantChapters(grants);
    if (chapterErr) {
      return NextResponse.json({ error: chapterErr }, { status: 400 });
    }

    const existing = await UserAccess.findOne({ email });
    const before = existing
      ? { grants: existing.grants, notes: existing.notes }
      : null;

    // Atomic upsert — avoids the E11000 race that bare findOne+create has.
    const after = await UserAccess.findOneAndUpdate(
      { email },
      {
        $set: {
          grants,
          notes,
          granted_by: actorEmail,
          granted_at: new Date(),
          is_active: true,
        },
        $setOnInsert: { email },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    if (!after) {
      // Shouldn't happen with upsert: true + new: true, but guard anyway.
      return NextResponse.json({ error: 'Failed to save user access' }, { status: 500 });
    }

    invalidateAccessCache(email);

    await UserAccessAuditLog.create({
      action: existing ? 'access_updated' : 'access_created',
      actor_email: actorEmail,
      target_email: email,
      changes: { before, after: { grants: after.grants, notes: after.notes } },
    });

    return NextResponse.json({ userAccess: after.toObject() });
  } catch (err) {
    console.error('Error upserting user_access:', err);
    return NextResponse.json({ error: 'Failed to save user access' }, { status: 500 });
  }
}

// DELETE /api/v2/admin/user-access?email=foo — soft-delete
export async function DELETE(request: NextRequest) {
  try {
    const guard = await requireSuperAdmin(request);
    if (!guard.ok) return guard.response;
    const actorEmail = guard.actorEmail;

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get('email');
    if (!targetEmail) {
      return NextResponse.json({ error: 'email parameter required' }, { status: 400 });
    }
    const normalized = targetEmail.toLowerCase();

    if (normalized === actorEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot delete your own access' },
        { status: 403 },
      );
    }

    const doc = await UserAccess.findOne({ email: normalized });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const before = { grants: doc.grants, notes: doc.notes };
    doc.is_active = false;
    await doc.save();

    invalidateAccessCache(normalized);

    await UserAccessAuditLog.create({
      action: 'access_deleted',
      actor_email: actorEmail,
      target_email: normalized,
      changes: { before, after: null },
    });

    return NextResponse.json({ message: 'Access removed' });
  } catch (err) {
    console.error('Error deleting user_access:', err);
    return NextResponse.json({ error: 'Failed to remove access' }, { status: 500 });
  }
}
