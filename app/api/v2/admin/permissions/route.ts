import { NextRequest, NextResponse } from 'next/server';
import { getUserPermissions } from '@/lib/rbac';
import { createServerClient } from '@supabase/ssr';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return { id: 'local', email: 'local' };
  }
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
  });
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET /api/v2/admin/permissions - Get current user's permissions
export async function GET(request: NextRequest) {
  try {
    // Localhost bypass - grant full super admin access
    const host = request.headers.get('host') || '';
    const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
    
    if (isLocalhost) {
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
