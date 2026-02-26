# 🔐 Complete Setup Guide - Automated Question Ingestion Pipeline

## Step 1: API Key Setup (SECURE METHOD)

### Get Your Claude API Key

1. **Sign up at Anthropic Console**
   - Go to: https://console.anthropic.com/
   - Create account (free)
   - Add payment method (pay-as-you-go, no monthly fees)

2. **Create API Key**
   - Go to: https://console.anthropic.com/settings/keys
   - Click "Create Key"
   - Name it: "Canvas Question Pipeline"
   - **Copy the key immediately** (starts with `sk-ant-...`)
   - You'll only see it once!

3. **Cost Information**
   - **Per question**: ~₹1.50 ($0.018)
     - Extraction: $0.003
     - Solution: $0.015
   - **1000 questions**: ~₹1,500 ($18)
   - **Your $5 credit**: ~275 questions
   - Very economical for social cause work!

### Add API Key to .env.local (SECURE - NEVER SHARE IN CHAT)

**✅ CORRECT METHOD:**

```bash
# Open your .env.local file
nano /Users/CanvasClasses/Desktop/canvas/.env.local

# Add this line at the end (replace with your actual key)
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

# Save: Ctrl+O, Enter, Ctrl+X
```

**🔒 Why This Is Secure:**
- `.env.local` is in `.gitignore` (won't be committed to git)
- Only accessible on your local machine
- Pipeline reads from environment variables
- Never hardcoded in code files
- Never shared in chat or screenshots

**❌ NEVER DO THIS:**
- Don't paste API key in chat
- Don't commit to git
- Don't hardcode in JavaScript files
- Don't share screenshots with API key visible

### Verify API Key Setup

```bash
cd /Users/CanvasClasses/Desktop/canvas/automation

# Test if key is loaded
node -e "require('dotenv').config({path:'../.env.local'}); console.log('API Key:', process.env.ANTHROPIC_API_KEY ? '✅ Found (length: ' + process.env.ANTHROPIC_API_KEY.length + ')' : '❌ Missing')"
```

**Expected output:**
```
API Key: ✅ Found (length: 108)
```

If you see `❌ Missing`, check:
1. File path is correct: `/Users/CanvasClasses/Desktop/canvas/.env.local`
2. Key is on a new line
3. No spaces around `=`
4. Key starts with `sk-ant-`

---

## Step 2: Install Dependencies

```bash
cd /Users/CanvasClasses/Desktop/canvas/automation
npm install
```

This installs:
- `@anthropic-ai/sdk` - Claude AI API
- `sharp` - Image processing
- `sqlite3` - Progress tracking
- `commander` - CLI interface
- `uuid` - ID generation
- `mongoose` - MongoDB connection

---

## Step 3: Configure Mac Automator Paths

Your SVG automation uses two folders on Desktop. Update the paths in `pipeline/config.js`:

```javascript
// Find these lines (around line 13-14)
svgInput: path.join(process.env.HOME, 'Desktop/In - To Be Processed'),
svgOutput: path.join(process.env.HOME, 'Desktop/Out - Ready for Database'),
```

**Match your exact folder names from the screenshot you showed me.**

---

## Step 4: Organize Your Input Folders

### For JEE Main PYQ (Your Trial Batch)

```
automation/input/
└── JEE-Main-Chemistry-PYQ/
    └── 2024-Jan-24-Morning/
        ├── q001.png          ← Question 1
        ├── q002.png          ← Question 2
        ├── q003.png          ← Question 3
        ├── ...
        ├── answer-key.png    ← Answer key for all questions
        ├── solutions-001.png ← Solution for Q1 (if available)
        ├── solutions-002.png ← Solution for Q2 (if available)
        └── solutions-003.png ← Solution for Q3 (if available)
```

**Important Naming Rules:**
- **Questions**: Any name (q001.png, page_001.png, etc.)
- **Answer Key**: Exactly `answer-key.png` (case-insensitive)
- **Solutions**: `solutions-001.png`, `solutions-002.png`, etc.
  - Number matches question number
  - If no solution available, don't include that file

### For NEET Chapter-wise

```
automation/input/
└── NEET-Chemistry-PYQ-Chapterwise/
    └── Chemical Kinetics/
        ├── q001.png
        ├── q002.png
        ├── answer-key.png
        ├── solutions-001.png
        └── solutions-002.png
```

---

## Step 5: Understanding the Workflow

### What Happens to Each Image Type

**1. Question Images (q001.png, q002.png, etc.)**
- AI extracts question text, options, type
- Detects diagrams with bounding boxes
- Determines difficulty and chapter
- **Does NOT extract answer** (comes from answer key)

**2. Answer Key Image (answer-key.png)**
- AI extracts all answers in order
- Matches answers to questions by position
- Example: "1. B, 2. A, 3. C, 4. D"

**3. Solution Images (solutions-001.png, etc.)**
- AI extracts detailed solution
- Matches to question by number
- If missing, AI generates solution automatically

### Complete Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│  INPUT FOLDER                                               │
│  ├── q001.png, q002.png, q003.png  (questions)             │
│  ├── answer-key.png                 (answers for all)      │
│  └── solutions-001.png, etc.        (optional solutions)   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: Extract Questions                                 │
│  • Parse each question image                                │
│  • Extract text, options, detect diagrams                   │
│  • Store temporarily (no answer yet)                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: Extract Answer Key                                │
│  • Parse answer-key.png                                     │
│  • Extract all answers: "1. B, 2. A, 3. C..."              │
│  • Match answers to questions by position                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 3: Extract/Generate Solutions                        │
│  • If solutions-NNN.png exists: extract it                  │
│  • If missing: AI generates detailed solution               │
│  • Match to question by number                              │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 4: Process Diagrams                                  │
│  • Crop diagrams from questions                             │
│  • Convert to SVG via Mac Automator                         │
│  • Upload to Cloudflare R2                                  │
│  • Insert markdown links                                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 5: Validate & Insert                                 │
│  • Validate LaTeX, schema, completeness                     │
│  • Generate display_id (following canonical prefixes)       │
│  • Insert into MongoDB questions_v2                         │
│  • Following QUESTION_INGESTION_WORKFLOW exactly            │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 6: MongoDB Schema Compliance

The pipeline follows **QUESTION_INGESTION_WORKFLOW** exactly:

### Display ID Generation (Canonical Prefixes)

```javascript
// Automatic based on chapter
ch11_mole      → MOLE-001, MOLE-002, ...
ch11_atom      → ATOM-001, ATOM-002, ...
ch12_kinetics  → CK-001, CK-002, ...
ch12_alcohols  → ALCO-001, ALCO-002, ...
// See full table in QUESTION_INGESTION_WORKFLOW.md
```

### MongoDB Document Structure

```javascript
{
  _id: "uuid-v4-string",              // UUID, NOT ObjectId
  display_id: "CK-001",                // Top-level (required)
  
  question_text: {
    markdown: "...",                   // Full question with LaTeX
    latex_validated: true
  },
  
  type: "SCQ",                         // SCQ, MCQ, NVT, AR, MST, MTC
  
  options: [                           // For SCQ/MCQ only
    { id: "a", text: "...", is_correct: false },
    { id: "b", text: "...", is_correct: true },
    { id: "c", text: "...", is_correct: false },
    { id: "d", text: "...", is_correct: false }
  ],
  
  answer: "b",                         // For SCQ: single letter
                                       // For MCQ: ["a", "c"]
                                       // For NVT: number
  
  solution: {
    text_markdown: "**Step 1: ...**",  // Following 5-step format
    latex_validated: true
  },
  
  metadata: {
    difficulty: "Medium",              // Easy, Medium, Hard
    chapter_id: "ch12_kinetics",       // Exact from taxonomy
    tags: [
      { tag_id: "tag_kinetics_1", weight: 1.0 }
    ],
    is_pyq: true,                      // Always true for PYQs
    is_top_pyq: false,
    exam_source: {                     // For PYQs only
      exam: "JEE Main",                // Exact spelling
      year: 2024,
      month: "Jan",
      day: 24,
      shift: "Morning"
    }
  },
  
  status: "review",                    // Start in review
  version: 1,
  quality_score: 85,
  needs_review: false,
  
  created_by: "automation_pipeline",
  updated_by: "automation_pipeline",
  created_at: ISODate(),
  updated_at: ISODate(),
  deleted_at: null,                    // MUST be null, not undefined
  
  asset_ids: []
}
```

### Critical Schema Rules

1. **Collection**: `questions_v2` (NOT `questions`)
2. **_id**: UUID v4 string (NOT ObjectId)
3. **deleted_at**: Must be `null` explicitly
4. **display_id**: Both top-level AND in metadata
5. **chapter_id**: Exact match from `taxonomyData_from_csv.ts`
6. **exam_source**: Required for all PYQs, exact field names

---

## Step 7: Test Run (Trial Batch)

### Prepare Test Data

1. Create folder: `automation/input/JEE-Main-Chemistry-PYQ/2024-Jan-24-Morning/`
2. Add 3-5 question images
3. Add answer-key.png
4. Add solutions if available

### Dry Run (No Database Insertion)

```bash
cd /Users/CanvasClasses/Desktop/canvas/automation
node start_pipeline.js --dry-run
```

**This will:**
- ✅ Extract questions from images
- ✅ Parse answer key
- ✅ Extract/generate solutions
- ✅ Validate everything
- ❌ Skip database insertion (safe test)

**Check output in:**
- `output/extracted_json/` - Extracted data
- `output/review_queue/` - Flagged questions
- `logs/` - Detailed logs

### Full Run (With Database Insertion)

Once satisfied with dry run:

```bash
node start_pipeline.js
```

**Monitor the output:**
```
📁 Processing: JEE-Main-Chemistry-PYQ/2024-Jan-24-Morning
📸 Found 5 question images
📋 Found answer key
📝 Found 3 solution images

[1/5] Processing: q001.png
  ✅ Question extracted
  ✅ Answer matched: B
  ✅ Solution found (from solutions-001.png)
  ✅ Diagrams processed: 1
  ✅ Inserted as CK-126

[2/5] Processing: q002.png
  ✅ Question extracted
  ✅ Answer matched: A
  ⚠️  Solution generated (no image provided)
  ✅ Inserted as CK-127

...

📊 PIPELINE SUMMARY
✅ 5 questions inserted
⚠️  0 flagged for review
❌ 0 failed
💰 Estimated cost: $0.09 (₹7.50)
```

---

## Step 8: Verify in Admin Dashboard

1. Go to: http://localhost:3000/crucible/admin
2. Filter by chapter (e.g., "Chemical Kinetics")
3. Check:
   - Display IDs are correct (CK-126, CK-127, etc.)
   - Questions render properly
   - Solutions have 5-step format
   - Diagrams show correctly
   - Exam source shows (JEE Main 2024 Jan 24 Morning)

---

## Security Checklist

- [x] API key in `.env.local` (gitignored)
- [x] Never shared API key in chat
- [x] Never committed API key to git
- [x] MongoDB URI in `.env.local` (secure)
- [x] R2 credentials in `.env.local` (secure)

---

## Cost Tracking

The pipeline shows estimated costs after each run:

```
💰 Estimated API cost: $0.23
   - Extraction: 45 requests ($0.14)
   - Solutions: 42 requests ($0.67)
```

**Your $5 credit breakdown:**
- ~275 questions total
- Start with 5-10 for testing
- Then scale up gradually

---

## Troubleshooting

### "API Key Missing"
- Check `.env.local` has `ANTHROPIC_API_KEY=sk-ant-...`
- No spaces around `=`
- Run verify command from Step 1

### "Answer key not found"
- File must be named exactly `answer-key.png` (case-insensitive)
- Must be in same folder as question images

### "Solutions not matching"
- Solution files must be named `solutions-001.png`, `solutions-002.png`, etc.
- Number must match question number

### "Chapter not found"
- Use exact chapter names from taxonomy
- Or add mapping to `config.js` → `chapterMapping`

### "Display ID conflict"
- Pipeline auto-increments from last ID in database
- Check MongoDB for existing questions in that chapter

---

## Next Steps

1. ✅ Set up API key securely
2. ✅ Install dependencies
3. ✅ Configure Mac Automator paths
4. ✅ Prepare trial batch (5 questions)
5. ✅ Run dry-run test
6. ✅ Review extracted data
7. ✅ Run full pipeline
8. ✅ Verify in admin dashboard
9. ✅ Scale up to larger batches

---

**You're ready to automate! Start with your JEE Main trial batch and let me know how it goes.** 🚀
