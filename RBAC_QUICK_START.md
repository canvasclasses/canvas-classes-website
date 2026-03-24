# RBAC Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Bootstrap Your Super Admin Role

Run this command with your email (the one you use to log in):

```bash
npx tsx scripts/bootstrap-super-admin.ts your-email@example.com
```

You should see:
```
✅ Super admin role created successfully!
   Email: your-email@example.com
   Role: super_admin
   Access: All subjects (Chemistry, Physics, Mathematics)
```

### Step 2: Add Role Management Tab to Admin Dashboard

You need to integrate the RoleManagement component into your admin dashboard UI. 

**Option A: Add as a new tab** (recommended)

Edit `/app/crucible/admin/page.tsx` and add a new tab for "Roles" alongside Analytics and Export.

**Option B: Add as a separate page**

Create `/app/crucible/admin/roles/page.tsx`:

```tsx
'use client';

import RoleManagement from '../components/RoleManagement';
import { usePermissions } from '../hooks/usePermissions';

export default function RolesPage() {
  const { permissions, loading } = usePermissions();

  if (loading) return <div>Loading...</div>;

  if (!permissions?.permissions.canManageRoles) {
    return <div>Access Denied: Super admin only</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <RoleManagement currentUserEmail={permissions.email} />
    </div>
  );
}
```

Then access it at `/crucible/admin/roles`

### Step 3: Grant Access to Math Faculty

1. Log in to the admin dashboard
2. Go to Role Management
3. Click "Add User"
4. Fill in:
   - **Email**: mathfaculty@example.com
   - **Role**: Subject Admin
   - **Subjects**: ✓ Mathematics
   - **Notes**: Math department faculty
5. Click "Save Role"

### Step 4: Grant Access to Physics Faculty

Repeat Step 3 with:
- **Email**: physicsfaculty@example.com
- **Subjects**: ✓ Physics

### Step 5: Test It!

1. Ask the math faculty to log in
2. They should only see math chapters (ma_*)
3. They can create/edit math questions
4. They cannot see chemistry or physics questions

## 🔒 Security Features

✅ **Automatic filtering** - Math faculty only see math questions  
✅ **API-level enforcement** - Backend blocks unauthorized access  
✅ **Audit logging** - All role changes are tracked  
✅ **Self-protection** - Users can't modify their own roles  
✅ **Fail-safe** - Unknown users get no access  

## 📋 What Each Role Can Do

### Super Admin (You)
- ✅ View all subjects
- ✅ Create/edit/delete all questions
- ✅ Manage user roles
- ✅ Access all features

### Subject Admin (Math Faculty)
- ✅ View math chapters only
- ✅ Create/edit math questions
- ❌ Cannot delete questions
- ❌ Cannot manage roles
- ❌ Cannot see chemistry/physics

### Viewer (Optional)
- ✅ View assigned subjects (read-only)
- ❌ Cannot create/edit questions

## 🛠️ Common Tasks

### Grant Multi-Subject Access
```
Email: multifaculty@example.com
Role: Subject Admin
Subjects: ✓ Chemistry  ✓ Physics
```

### Revoke Access
Click the trash icon next to the user in the role list.

### View Audit Log
Check MongoDB collection: `audit_logs` with filter `{ resource_type: "user_role" }`

## ⚠️ Important Notes

1. **First login**: After granting a role, user must log in via Google OAuth
2. **Permissions cache**: Changes take effect immediately (no logout needed)
3. **Backup super admin**: Always have at least 2 super admins
4. **Email case**: System automatically converts emails to lowercase

## 🆘 Troubleshooting

**User can't see any questions?**
- Check if role is active: `db.user_roles.findOne({ email: "user@example.com" })`
- Verify subjects are assigned for subject_admin role

**Getting "Forbidden" errors?**
- User trying to edit questions outside their subjects
- Only super admin can delete questions

**Role not working?**
- Verify user is logged in with the correct email
- Check browser console for API errors

## 📚 Full Documentation

See `RBAC_IMPLEMENTATION_GUIDE.md` for complete details.

---

**Need help?** Check the implementation guide or review API responses in browser DevTools.
