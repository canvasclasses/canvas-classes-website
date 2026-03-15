# Question Ingestion Workspace for Mac Mini

This is an isolated workspace for adding questions to the Canvas Classes question database. It contains only the essential files needed for question ingestion, without exposing the full application codebase.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your MongoDB URI (get from main system admin)
   - Add Cloudflare R2 credentials (for asset uploads)

3. **Start the Admin Panel**
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000

## What's Included

- **Admin Panel** (`/admin`) - Full question management interface
- **Question Ingestion Workflow** - AI-assisted question extraction from images
- **Taxonomy System** - Chapter and tag management
- **Asset Upload** - SVG, image, audio upload to R2
- **MongoDB Integration** - Direct database access for questions

## What's NOT Included

- Student-facing Crucible app
- Authentication system (bypassed in dev mode)
- Landing pages and marketing content
- Other unrelated features

## Security

- No sensitive production credentials are included
- MongoDB URI must be added manually
- R2 credentials must be added manually
- This workspace cannot deploy or modify production code

## Workflow

Follow the standard question ingestion workflow:
1. Use AI to extract questions from images
2. Review and edit in admin panel
3. Tag with proper chapter and concept tags
4. Mark as Top PYQ if applicable
5. Publish when ready

See `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md` for detailed steps.
