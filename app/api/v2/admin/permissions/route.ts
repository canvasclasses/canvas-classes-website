import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getUserPermissions } from '@/lib/rbac';
import { isLocalhostDev } from '@/lib/bookAuth';

// GET /api/v2/admin/permissions - Get current user's permissions
export async function GET(request: NextRequest) {
  try {
    // Safe localhost bypass: only on actual localhost AND dev mode AND not Vercel
    if (await isLocalhostDev()) {
      return NextResponse.json({
        email: 'local-dev',
        role: 'super_admin',
        subjects: ['chemistry', 'physics', 'mathematics'],
        permissions: {
          canEditQuestions: true,
          canDeleteQuestions: true,
          canManageRoles: true,
          canAccessAnalytics: true,
          canExportData: true,
        },
      });
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getUserPermissions(user.email!);

    return NextResponse.json({
      email: permissions.email,
      role: permissions.role,
      subjects: permissions.subjects,
      permissions: {
        canEditQuestions: permissions.canEditQuestions,
        canDeleteQuestions: permissions.canDeleteQuestions,
        canManageRoles: permissions.canManageRoles,
        canAccessAnalytics: permissions.canAccessAnalytics,
        canExportData: permissions.canExportData,
      },
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
