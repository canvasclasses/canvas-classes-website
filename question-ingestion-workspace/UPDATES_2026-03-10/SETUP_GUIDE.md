# Complete Setup Guide for Mac Mini Question Ingestion Workspace

## Overview
This isolated workspace allows you to add questions to the Canvas Classes database without exposing the full application codebase. Perfect for secure, dedicated question ingestion on a separate machine.

## Initial Setup (One-Time)

### 1. Transfer This Folder to Mac Mini
Copy the entire `question-ingestion-workspace` folder to your Mac Mini using:
- AirDrop
- USB drive
- Network transfer
- Git (if you create a separate private repo)

### 2. Install Node.js
Ensure Node.js 18+ is installed on the Mac Mini:
```bash
node --version  # Should be v18 or higher
```

### 3. Install Dependencies
```bash
cd question-ingestion-workspace
npm install
```

### 4. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with the following credentials (get from main system admin):

```env
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/crucible?retryWrites=true&w=majority

# Cloudflare R2 Storage (REQUIRED for image/SVG uploads)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=canvas-chemistry-assets
R2_PUBLIC_URL=https://canvas-chemistry-assets.your_account_id.r2.dev

# OpenAI API (OPTIONAL - for AI-assisted extraction)
OPENAI_API_KEY=sk-your-openai-api-key

# Development Mode (keep as is)
NODE_ENV=development
```

### 5. Start the Admin Panel
```bash
npm run dev
```

The admin panel will be available at **http://localhost:3000**

## What You Can Do

### ✅ Available Features
- **Full Admin Panel** - Complete question management interface
- **Question CRUD** - Create, read, update, delete questions
- **Asset Uploads** - Upload SVG diagrams, images, audio
- **Taxonomy Management** - Assign chapters and concept tags
- **Top PYQ Marking** - Mark questions as Top PYQ using the star button
- **Bulk Operations** - Edit multiple questions at once
- **Export** - Export questions to PDF/PPT
- **Analytics** - View question statistics

### ❌ NOT Available
- Student-facing Crucible app (not needed for question ingestion)
- Authentication system (bypassed in dev mode)
- Deployment capabilities (read-only for production)

## Daily Workflow

### Adding Questions from Images

1. **Prepare Images**
   - Take clear screenshots of questions
   - One question per image works best
   - Ensure text is readable

2. **Open Admin Panel**
   ```bash
   npm run dev
   ```
   Navigate to http://localhost:3000

3. **Create New Question**
   - Click "Add Question" button
   - Select the chapter (e.g., "GOC")
   - Choose question type (SCQ, MCQ, NVT, etc.)

4. **Enter Question Details**
   - Type or paste question text (supports LaTeX: `$x^2$`)
   - Add options (for MCQ/SCQ)
   - Mark correct answer(s)
   - Write solution with detailed steps

5. **Upload Diagrams** (if needed)
   - Drag & drop SVG files into the upload zone
   - Link will be auto-inserted into markdown

6. **Tag the Question**
   - Assign primary concept tag (e.g., "Acidity & Basicity")
   - Add secondary tags if needed
   - Mark as PYQ if it's a past year question
   - Click the **star button** to mark as Top PYQ

7. **Save & Publish**
   - Click "Save" to store in database
   - Set status to "Published" when ready

## Top PYQ System - IMPORTANT

There are **two separate star systems**:

1. **Admin Star Button (⭐)** - This is what you use
   - Located in the admin panel question editor
   - Toggles `metadata.is_top_pyq` field
   - This is what the Top PYQ filter uses
   - Counter below shows how many Top PYQs in that chapter

2. **Student Bookmarks** - NOT related to Top PYQ
   - Students can bookmark questions for themselves
   - Does NOT affect Top PYQ filtering

**To mark a question as Top PYQ:**
1. Open the question in admin panel
2. Click the star button (⭐) in the toolbar
3. Star turns gold when active
4. Counter increments

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `.env.local`
- Ensure IP address is whitelisted in MongoDB Atlas
- Test connection: `ping cluster.mongodb.net`

### "Asset upload failed"
- Verify R2 credentials in `.env.local`
- Check R2 bucket permissions
- Ensure file size is under 10MB

### "Question not saving"
- Check browser console for errors (F12)
- Verify all required fields are filled
- Ensure chapter is selected

### Port 3000 already in use
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

## File Structure

```
question-ingestion-workspace/
├── app/
│   ├── admin/              # Admin panel UI
│   ├── api/
│   │   ├── v2/
│   │   │   ├── questions/  # Question CRUD API
│   │   │   ├── assets/     # File upload API
│   │   │   └── taxonomy/   # Chapter/tag API
│   └── layout.tsx
├── lib/
│   ├── mongodb.ts          # Database connection
│   ├── models/             # Mongoose schemas
│   └── r2Storage.ts        # R2 upload utilities
├── .env.local              # Your credentials (DO NOT COMMIT)
├── package.json
└── README.md
```

## Security Notes

- ✅ This workspace is **isolated** - no production deployment access
- ✅ MongoDB credentials are **local only** - not in git
- ✅ R2 credentials are **local only** - not in git
- ✅ No sensitive application code is exposed
- ⚠️ Keep `.env.local` secure - never share or commit
- ⚠️ This workspace has **full database write access** - be careful

## Syncing Questions Back to Main System

Questions are automatically synced because both systems connect to the **same MongoDB database**. Any question you add on the Mac Mini will immediately appear on the main system.

**No manual sync needed!**

## Getting Help

If you encounter issues:
1. Check this guide first
2. Review error messages in browser console (F12)
3. Check terminal output for server errors
4. Contact main system admin for credentials/access issues

## Updates

To get updates to the admin panel:
1. Get the latest `setup-workspace.sh` from main system
2. Run it again to copy updated files
3. Restart the dev server

---

**Last Updated:** March 10, 2026
**Version:** 1.0.0
