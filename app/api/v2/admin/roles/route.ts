import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { UserRole } from '@/lib/models/UserRole';
import { RoleAuditLog } from '@/lib/models/RoleAuditLog';
import { getUserPermissions } from '@/lib/rbac';
import { getAuthenticatedUser } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';
import { z } from 'zod';

const RoleSchema = z.object({
  email: z.string().email(),
  role: z.enum(['super_admin', 'subject_admin', 'viewer']),
  subjects: z.array(z.enum(['chemistry', 'physics', 'mathematics'])),
  notes: z.string().max(500).optional(),
});

// GET /api/v2/admin/roles - List all user roles
export async function GET(request: NextRequest) {
  try {
    if (!(await isLocalhostDev())) {
      const user = await getAuthenticatedUser(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const permissions = await getUserPermissions(user.email!);
      if (!permissions.canManageRoles) {
        return NextResponse.json({ error: 'Forbidden: Only super admins can manage roles' }, { status: 403 });
      }
    }

    await connectToDatabase();

    const roles = await UserRole.find({ is_active: true })
      .select('-__v')
      .sort({ granted_at: -1 })
      .limit(500) // safety cap — if you ever have 500+ roles, add pagination
      .lean();

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

// POST /api/v2/admin/roles - Create or update a user role
export async function POST(request: NextRequest) {
  try {
    const isLocalDev = await isLocalhostDev();
    let userEmail = 'local-dev';

    if (!isLocalDev) {
      const user = await getAuthenticatedUser(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userEmail = user.email!;

      const permissions = await getUserPermissions(userEmail);
      if (!permissions.canManageRoles) {
        return NextResponse.json({ error: 'Forbidden: Only super admins can manage roles' }, { status: 403 });
      }
    }

    await connectToDatabase();
    const body = await request.json();
    const validated = RoleSchema.parse(body);

    // Prevent self-modification (except in local development)
    if (!isLocalDev && validated.email.toLowerCase() === userEmail.toLowerCase()) {
      return NextResponse.json({ 
        error: 'Cannot modify your own role. Ask another super admin.' 
      }, { status: 403 });
    }

    // Validate subjects based on role
    if (validated.role === 'super_admin' && validated.subjects.length > 0) {
      return NextResponse.json({ 
        error: 'Super admins should not have specific subjects (they get all)' 
      }, { status: 400 });
    }

    if (validated.role === 'subject_admin' && validated.subjects.length === 0) {
      return NextResponse.json({ 
        error: 'Subject admins must have at least one subject assigned' 
      }, { status: 400 });
    }

    // Upsert the role
    const existingRole = await UserRole.findOne({ email: validated.email.toLowerCase() });
    
    if (existingRole) {
      // Update existing role
      existingRole.role = validated.role;
      existingRole.subjects = validated.subjects;
      existingRole.notes = validated.notes;
      existingRole.granted_by = userEmail;
      existingRole.granted_at = new Date();
      await existingRole.save();

      // Audit log
      await RoleAuditLog.create({
        action: 'role_updated',
        user_id: userEmail,
        user_email: userEmail,
        resource_type: 'user_role',
        resource_id: existingRole._id.toString(),
        metadata: {
          target_email: validated.email,
          new_role: validated.role,
          new_subjects: validated.subjects,
        },
      });

      return NextResponse.json({ 
        message: 'Role updated successfully',
        role: existingRole 
      });
    } else {
      // Create new role
      const newRole = await UserRole.create({
        email: validated.email.toLowerCase(),
        role: validated.role,
        subjects: validated.subjects,
        granted_by: userEmail,
        notes: validated.notes,
      });

      // Audit log
      await RoleAuditLog.create({
        action: 'role_created',
        user_id: userEmail,
        user_email: userEmail,
        resource_type: 'user_role',
        resource_id: newRole._id.toString(),
        metadata: {
          target_email: validated.email,
          role: validated.role,
          subjects: validated.subjects,
        },
      });

      return NextResponse.json({ 
        message: 'Role created successfully',
        role: newRole 
      }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating/updating role:', error);
    return NextResponse.json({ error: 'Failed to create/update role' }, { status: 500 });
  }
}

// DELETE /api/v2/admin/roles?email=user@example.com - Deactivate a user role
export async function DELETE(request: NextRequest) {
  try {
    const isLocalDev = await isLocalhostDev();
    let userEmail = 'local-dev';

    if (!isLocalDev) {
      const user = await getAuthenticatedUser(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userEmail = user.email!;

      const permissions = await getUserPermissions(userEmail);
      if (!permissions.canManageRoles) {
        return NextResponse.json({ error: 'Forbidden: Only super admins can manage roles' }, { status: 403 });
      }
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get('email');

    if (!targetEmail) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    // Prevent self-deletion (except in local development)
    if (!isLocalDev && targetEmail.toLowerCase() === userEmail.toLowerCase()) {
      return NextResponse.json({ 
        error: 'Cannot delete your own role. Ask another super admin.' 
      }, { status: 403 });
    }

    const role = await UserRole.findOne({ email: targetEmail.toLowerCase() });
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Soft delete
    role.is_active = false;
    await role.save();

    // Audit log
    await RoleAuditLog.create({
      action: 'role_deleted',
      user_id: userEmail,
      user_email: userEmail,
      resource_type: 'user_role',
      resource_id: role._id.toString(),
      metadata: {
        target_email: targetEmail,
        previous_role: role.role,
        previous_subjects: role.subjects,
      },
    });

    return NextResponse.json({ message: 'Role deactivated successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
