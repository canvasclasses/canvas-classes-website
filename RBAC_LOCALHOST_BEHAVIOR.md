# RBAC Localhost Bypass Documentation

## Overview

The RBAC system automatically grants **full super admin access** when running on localhost. This allows you to develop and test without authentication barriers.

## How It Works

### **Localhost Detection**

The system detects localhost in two places:

1. **Frontend (usePermissions hook)**
   - Checks `window.location.hostname`
   - Matches: `localhost` or `127.0.0.1`

2. **Backend (permissions API)**
   - Checks `request.headers.get('host')`
   - Matches: `localhost:*` or `127.0.0.1:*`

### **Automatic Permissions on Localhost**

When running on `localhost:3000`, you automatically get:

```javascript
{
  email: 'local-dev',
  role: 'super_admin',
  subjects: ['chemistry', 'physics', 'mathematics'],
  permissions: {
    canEditQuestions: true,
    canDeleteQuestions: true,
    canManageRoles: true,
    canAccessAnalytics: true,
    canExportData: true,
  }
}
```

## What This Means

### ✅ **On Localhost (Development)**
- **No authentication required**
- **Full super admin access** automatically granted
- **All chapters visible** (chemistry, physics, math)
- **All features enabled** (create, edit, delete, role management)
- **Shield icon visible** (role management)
- **No need to log in** via Google OAuth

### 🔒 **On Production (Deployed Website)**
- **Authentication required** via Google OAuth
- **Permissions checked** from MongoDB `user_roles` collection
- **Subject-based filtering** enforced
- **Role-based access control** fully active
- **Must have a role** in the database to access

## Files Modified

### 1. Frontend Hook
**File:** `/app/crucible/admin/hooks/usePermissions.ts`

```typescript
// Localhost bypass - grant full super admin access
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

if (isLocalhost) {
  setPermissions({
    email: 'local-dev',
    role: 'super_admin',
    subjects: ['chemistry', 'physics', 'mathematics'],
    permissions: { /* all true */ },
  });
  return;
}
```

### 2. Backend API
**File:** `/app/api/v2/admin/permissions/route.ts`

```typescript
// Localhost bypass - grant full super admin access
const host = request.headers.get('host') || '';
const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');

if (isLocalhost) {
  return NextResponse.json({
    email: 'local-dev',
    role: 'super_admin',
    subjects: ['chemistry', 'physics', 'mathematics'],
    permissions: { /* all true */ },
  });
}
```

## Testing Locally

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Open Admin Dashboard
```
http://localhost:3000/crucible/admin
```

### 3. Verify Features
- ✅ All subject pills visible (Chem, Phys, Math)
- ✅ All chapters in dropdown
- ✅ Shield icon (🛡️) visible in toolbar
- ✅ Delete button enabled
- ✅ Can create/edit questions
- ✅ Role Management accessible

## Production Deployment

When you deploy to production (e.g., Vercel), the localhost bypass **will not activate** because:

1. The hostname will be your domain (e.g., `canvasclasses.in`)
2. The system will require Google OAuth authentication
3. Users must have a role in the `user_roles` collection
4. Subject-based filtering will be enforced

### Production Setup Checklist

Before deploying, ensure:

- ✅ `MONGODB_URI` set in Vercel environment variables
- ✅ `ADMIN_EMAILS` set in Vercel environment variables
- ✅ Supabase OAuth configured with production domain
- ✅ Super admin role created in MongoDB for your email
- ✅ Google OAuth redirect URLs configured in Supabase

## Security Notes

### ✅ **Safe Practices**
- Localhost bypass only works on `localhost` and `127.0.0.1`
- Production domains are never affected
- No security risk in development environment

### ⚠️ **Important**
- Never expose your local dev server to the internet
- Never set `localhost` as a production domain
- Always use proper authentication in production

## Troubleshooting

### Issue: Shield icon not showing on localhost
**Solution:** Refresh the page after server restart

### Issue: Chapters dropdown empty
**Solution:** 
1. Check dev server is running on `localhost:3000`
2. Verify browser URL is `http://localhost:3000` (not `127.0.0.1`)
3. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Still getting 401 errors
**Solution:**
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Check console for errors

## Summary

**Localhost = Full Access, No Auth Required**  
**Production = RBAC Enforced, Auth Required**

This design allows you to develop freely on localhost while maintaining security in production.
