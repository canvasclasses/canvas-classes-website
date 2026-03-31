# Question Ingestion Workspace

**Purpose:** Self-contained package for adding questions to the Crucible database.

## Contents

- `QUESTION_INGESTION_WORKFLOW.md` - Chemistry question ingestion workflow
- `MATH_INGESTION_WORKFLOW.md` - Mathematics question ingestion workflow
- `scripts/` - Template insertion scripts
- `examples/` - Example questions for reference

## Prerequisites

1. Node.js installed on your system
2. Access to the MongoDB database (MONGODB_URI in .env.local)
3. Images of questions to extract

## Quick Start

1. Copy this entire folder to your local machine
2. Create a `.env.local` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```
3. Read the appropriate workflow file for your subject
4. Run the extraction → insertion process

## Support

Contact the admin for database credentials and prefix assignments.
