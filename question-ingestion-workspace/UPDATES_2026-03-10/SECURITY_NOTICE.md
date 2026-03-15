# 🔒 SECURITY NOTICE - READ BEFORE USE

## ⚠️ CRITICAL: Production Database Access

This workspace has **FULL READ/WRITE ACCESS** to the production Canvas Classes question database and asset storage.

### What This Means

✅ **Direct Production Access:**
- Questions you add are **immediately live** on canvasclasses.in
- No deployment, git push, or approval process
- Changes are **permanent and instant**
- Same system used on your other Mac Mini via deployed website

✅ **Asset Storage:**
- SVG, images, audio uploaded directly to production R2 bucket
- Assets immediately accessible on live website
- No deployment required

### Strict Usage Rules

**DO:**
- ✅ Use ONLY for adding new questions
- ✅ Follow the question ingestion workflow
- ✅ Tag questions properly with correct chapters/concepts
- ✅ Mark Top PYQs using the star button in admin panel
- ✅ Verify questions before publishing
- ✅ Keep `.env.local` file secure

**DO NOT:**
- ❌ Delete or modify existing questions without authorization
- ❌ Share credentials with anyone
- ❌ Commit `.env.local` to git (already in .gitignore)
- ❌ Use credentials for any other purpose
- ❌ Screenshot or share the `.env.local` file
- ❌ Transfer credentials via insecure channels

### Credentials Location

Production credentials are stored in:
```
.env.local
```

This file contains:
- MongoDB Atlas connection string (production database)
- Cloudflare R2 access keys (production asset storage)
- Admin email whitelist

**NEVER commit this file to version control.**

### Security Measures

1. **No Git Integration:**
   - This workspace is intentionally isolated
   - No git repository initialized
   - No deployment capabilities
   - `.env.local` is in .gitignore

2. **Local Only:**
   - Credentials stored locally on Mac Mini
   - Not synced to cloud or git
   - Not accessible remotely

3. **Admin Panel Only:**
   - No student-facing features
   - No authentication bypass on production
   - Full audit trail in MongoDB

### Workflow Verification

After adding questions:
1. Questions appear instantly in MongoDB
2. Verify on live site: https://canvasclasses.in/the-crucible
3. Check admin panel on deployed site for confirmation
4. No manual sync or deployment needed

### In Case of Security Breach

If credentials are compromised:
1. Immediately notify main system admin
2. Rotate MongoDB password in Atlas
3. Regenerate R2 access keys
4. Update `.env.local` on all systems

### Responsibility

By using this workspace, you acknowledge:
- You have full production database access
- All changes are immediate and permanent
- You will follow security guidelines strictly
- You understand the impact of your actions

---

**Last Updated:** March 10, 2026  
**Access Level:** Production Read/Write  
**Purpose:** Question Ingestion Only
