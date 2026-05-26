import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';
import {
  getEffectiveAccess,
  isSuperAdmin,
  listSuperAdmins,
} from '@canvas/data/rbac';

// GET /api/v2/admin/permissions — return current user's effective access.
export async function GET(request: NextRequest) {
  try {
    if (await isLocalhostDev()) {
      return NextResponse.json({
        email: 'local-dev',
        isSuperAdmin: true,
        grants: [],
        superAdmins: listSuperAdmins(),
      });
    }

    const user = await getAuthenticatedUser(request);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isSuperAdmin(user.email)) {
      return NextResponse.json({
        email: user.email,
        isSuperAdmin: true,
        grants: [],
        superAdmins: listSuperAdmins(),
      });
    }

    // Non-super-admin staff don't get the super-admin roster — that list is
    // only consumed by StaffAccessManager (super-admin-gated UI), and
    // exposing it to anyone authenticated is a free phishing-target list.
    const access = await getEffectiveAccess(user.email);
    return NextResponse.json({
      email: user.email,
      isSuperAdmin: false,
      grants: access.isSuperAdmin ? [] : access.grants,
      superAdmins: [],
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
