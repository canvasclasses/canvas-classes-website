# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This document describes the subject-level RBAC system implemented for the Canvas Classes admin dashboard. The system allows you to grant different faculty members access to specific subjects (Chemistry, Physics, Mathematics) while maintaining security and data isolation.

## Architecture

### 1. Database Layer (`UserRole` Collection)

**Location:** `/lib/models/UserRole.ts`

**Schema:**
```typescript
{
  email: string;           // User's email (unique, lowercase)
  role: 'super_admin' | 'subject_admin' | 'viewer';
  subjects: Subject[];     // ['chemistry', 'physics', 'mathematics']
  granted_by: string;      // Email of admin who granted access
  granted_at: Date;
  last_accessed_at: Date;
  is_active: boolean;
  notes: string;          // Optional notes
}
```

**Role Types:**
- **Super Admin**: Full access to all subjects, can manage roles, can delete questions
- **Subject Admin**: Can edit/create questions in assigned subjects only
- **Viewer**: Read-only access to assigned subjects

### 2. Authorization Layer (`/lib/rbac.ts`)

**Core Functions:**

- `getUserPermissions(email)` - Fetches user's complete permission set
- `canAccessChapter(email, chapterId)` - Checks if user can view a chapter
- `canEditQuestion(email, chapterId)` - Checks if user can edit questions in a chapter
- `canDeleteQuestion(email, chapterId)` - Checks if user can delete (super admin only)
- `getAccessibleChapters(email)` - Returns list of chapter IDs user can access
- `getQuestionFilter(email)` - Returns MongoDB filter for question queries

**Subject Mapping:**
- `ch11_*`, `ch12_*` → Chemistry
- `ph11_*`, `ph12_*` → Physics
- `ma_*` → Mathematics

### 3. API Layer

**Role Management APIs:**
- `GET /api/v2/admin/roles` - List all user roles (super admin only)
- `POST /api/v2/admin/roles` - Create/update user role (super admin only)
- `DELETE /api/v2/admin/roles?email=...` - Deactivate user role (super admin only)
- `GET /api/v2/admin/permissions` - Get current user's permissions

**Question APIs (Updated):**
- `GET /api/v2/questions` - Automatically filters by user's accessible subjects
- `POST /api/v2/questions` - Checks permission before creating
- `PATCH /api/v2/questions/[id]` - Checks permission before editing
- `DELETE /api/v2/questions/[id]` - Super admin only

### 4. Frontend Layer

**Components:**
- `/app/crucible/admin/components/RoleManagement.tsx` - UI for managing user roles
- `/app/crucible/admin/hooks/usePermissions.ts` - React hook for permission checks

## Security Measures

### ✅ Defense in Depth

1. **Database-level filtering** - MongoDB queries include RBAC filters
2. **API-level authorization** - Every endpoint checks permissions
3. **UI-level restrictions** - Frontend hides unauthorized actions
4. **Audit logging** - All role changes are logged

### ✅ Safety Mechanisms

1. **Self-modification prevention** - Users cannot change their own roles
2. **Fail-safe defaults** - Unknown users get no access
3. **Super admin protection** - At least one super admin must exist
4. **Soft deletes** - Roles are deactivated, not deleted
5. **Session validation** - Permissions checked on every request

### ✅ Data Isolation

- Subject admins can only see questions from their assigned subjects
- Chapter dropdowns automatically filtered by permissions
- Question counts reflect only accessible questions
- Export functions respect subject boundaries

## Setup Instructions

### Step 1: Grant Your First Role (Bootstrap)

Since you're the first user, you need to manually create your super admin role in MongoDB:

```javascript
// Run this in MongoDB Compass or mongosh
db.user_roles.insertOne({
  email: "your-email@example.com",  // Your Supabase login email
  role: "super_admin",
  subjects: [],  // Empty for super admin (gets all)
  granted_by: "system",
  granted_at: new Date(),
  is_active: true,
  notes: "Initial super admin"
});
```

### Step 2: Access Role Management UI

1. Log in to `/crucible/admin`
2. Navigate to the "Role Management" tab (you'll need to add this to the UI)
3. You should now see the role management interface

### Step 3: Grant Access to Faculty Members

**For Math Faculty:**
```
Email: mathfaculty@example.com
Role: Subject Admin
Subjects: [Mathematics]
Notes: Math department faculty
```

**For Physics Faculty:**
```
Email: physicsfaculty@example.com
Role: Subject Admin
Subjects: [Physics]
Notes: Physics department faculty
```

**For Chemistry Faculty:**
```
Email: chemfaculty@example.com
Role: Subject Admin
Subjects: [Chemistry]
Notes: Chemistry department faculty
```

### Step 4: Test Access

1. Ask faculty to log in via Google OAuth
2. They should only see chapters from their assigned subjects
3. They can create/edit questions only in their subjects
4. They cannot delete questions or manage roles

## Usage Examples

### Adding a New Subject Admin

1. Go to Role Management
2. Click "Add User"
3. Enter email: `newuser@example.com`
4. Select role: "Subject Admin"
5. Select subjects: Check "Mathematics"
6. Add notes: "New math faculty member"
7. Click "Save Role"

### Granting Multi-Subject Access

You can grant access to multiple subjects:
```
Email: multifaculty@example.com
Role: Subject Admin
Subjects: [Chemistry, Physics]  // Both checked
```

### Revoking Access

1. Find the user in the role list
2. Click the trash icon
3. Confirm deletion
4. User's role is deactivated (soft delete)

### Viewing Audit Trail

All role changes are logged in the `audit_logs` collection:
```javascript
db.audit_logs.find({ resource_type: "user_role" }).sort({ timestamp: -1 })
```

## Common Scenarios

### Scenario 1: Math Faculty Logs In

**What they see:**
- Only math chapters (ma_*) in chapter dropdown
- Only math questions in question list
- Can create/edit math questions
- Cannot delete any questions
- Cannot access role management

**What they cannot see:**
- Chemistry chapters (ch11_*, ch12_*)
- Physics chapters (ph11_*, ph12_*)
- Questions from other subjects

### Scenario 2: Super Admin Logs In

**What they see:**
- All chapters from all subjects
- All questions
- Can create/edit/delete any question
- Can manage user roles
- Can access all analytics

### Scenario 3: Viewer Logs In

**What they see:**
- Assigned subject chapters (read-only)
- Questions from assigned subjects
- Cannot create/edit/delete questions
- Can view analytics

## Troubleshooting

### User Can't See Any Questions

**Check:**
1. Is user's role active? `db.user_roles.findOne({ email: "user@example.com" })`
2. Does user have subjects assigned? (subject_admin must have at least one)
3. Are there questions in their assigned subjects?

### User Gets "Forbidden" Error

**Possible causes:**
1. User trying to edit questions outside their subjects
2. Subject admin trying to delete questions (only super admin can delete)
3. User trying to access role management (only super admin)

### Role Changes Not Taking Effect

**Solution:**
- User needs to log out and log back in
- Permissions are fetched on each request, but browser may cache

## Best Practices

### 1. Principle of Least Privilege
- Grant only necessary subjects
- Use "viewer" role for read-only access
- Reserve super admin for trusted administrators

### 2. Regular Audits
- Review active roles monthly
- Check `last_accessed_at` to identify inactive users
- Deactivate roles for users who left

### 3. Documentation
- Always add notes when creating roles
- Document why multi-subject access was granted
- Keep track of who has super admin access

### 4. Backup Super Admin
- Always have at least 2 super admins
- Use different email providers (don't rely on single domain)

## API Reference

### Get Current User Permissions
```typescript
GET /api/v2/admin/permissions

Response:
{
  email: "user@example.com",
  role: "subject_admin",
  subjects: ["mathematics"],
  permissions: {
    canEditQuestions: true,
    canDeleteQuestions: false,
    canManageRoles: false,
    canAccessAnalytics: true,
    canExportData: true
  }
}
```

### Create/Update Role
```typescript
POST /api/v2/admin/roles
Content-Type: application/json

{
  email: "newuser@example.com",
  role: "subject_admin",
  subjects: ["chemistry", "physics"],
  notes: "Chemistry and Physics faculty"
}

Response: { message: "Role created successfully", role: {...} }
```

### List All Roles
```typescript
GET /api/v2/admin/roles

Response: { roles: [...] }
```

### Delete Role
```typescript
DELETE /api/v2/admin/roles?email=user@example.com

Response: { message: "Role deactivated successfully" }
```

## Migration Notes

### Existing Questions
- All existing questions remain accessible
- No data migration required
- RBAC filters apply immediately

### Existing Users
- Users without roles get no access (fail-safe)
- You must grant roles to existing team members
- Use the bootstrap script to create your first super admin

## Future Enhancements

### Potential Additions:
1. **Chapter-level permissions** - More granular than subject-level
2. **Time-based access** - Temporary access grants
3. **Approval workflows** - Require approval for question publishing
4. **Delegation** - Subject admins can grant viewer access
5. **Activity monitoring** - Dashboard showing who edited what

## Support

For issues or questions:
1. Check MongoDB logs: `db.audit_logs.find().sort({ timestamp: -1 }).limit(10)`
2. Verify role configuration: `db.user_roles.find({ is_active: true })`
3. Check API responses in browser DevTools Network tab
4. Review server logs for authorization errors

---

**Last Updated:** March 2026  
**Version:** 1.0.0  
**Maintained By:** Canvas Classes Development Team
