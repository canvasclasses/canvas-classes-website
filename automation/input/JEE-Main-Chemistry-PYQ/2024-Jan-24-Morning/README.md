# Example Trial Batch - JEE Main 2024 Jan 24 Morning

This folder demonstrates the correct structure for the automated question ingestion pipeline.

## Folder Contents

Place your files here following this naming convention:

```
2024-Jan-24-Morning/
├── q001.png              ← Question 1 screenshot
├── q002.png              ← Question 2 screenshot
├── q003.png              ← Question 3 screenshot
├── q004.png              ← Question 4 screenshot
├── q005.png              ← Question 5 screenshot
├── answer-key.png        ← Answer key for ALL questions (REQUIRED)
├── solutions-001.png     ← Solution for Q1 (optional)
├── solutions-002.png     ← Solution for Q2 (optional)
└── solutions-003.png     ← Solution for Q3 (optional)
```

## File Naming Rules

### Question Images
- **Any name works**: `q001.png`, `page_001.png`, `screenshot_1.png`
- **Format**: PNG or JPG
- **Order**: Alphabetically sorted by filename
- **Content**: One question per image (can have multiple parts)

### Answer Key Image
- **Name**: Exactly `answer-key.png` (case-insensitive)
- **Format**: PNG or JPG
- **Content**: All answers in order
  - Example: "1. B  2. A  3. C  4. D  5. A"
  - Can be horizontal list, vertical list, or table format
- **REQUIRED**: Must be present for pipeline to work

### Solution Images
- **Name**: `solutions-001.png`, `solutions-002.png`, etc.
- **Format**: PNG or JPG
- **Number**: Must match question number
  - `solutions-001.png` = solution for question 1
  - `solutions-002.png` = solution for question 2
- **Optional**: If missing, AI will generate solution automatically

## What Happens During Processing

1. **Question Extraction**
   - AI reads each question image
   - Extracts text, options, detects diagrams
   - Determines question type and difficulty

2. **Answer Matching**
   - AI reads `answer-key.png`
   - Extracts all answers in order
   - Matches to questions by position

3. **Solution Processing**
   - If `solutions-NNN.png` exists: extracts from image
   - If missing: AI generates detailed 5-step solution

4. **Diagram Processing**
   - Crops diagrams from questions
   - Converts to SVG via Mac Automator
   - Uploads to Cloudflare R2

5. **Database Insertion**
   - Validates LaTeX and schema
   - Generates display_id (e.g., CK-126)
   - Inserts into MongoDB questions_v2

## Running the Pipeline

### Test Mode (Recommended First)
```bash
cd /Users/CanvasClasses/Desktop/canvas/automation
node start_pipeline.js --dry-run
```

This will:
- ✅ Extract all questions
- ✅ Parse answer key
- ✅ Validate everything
- ❌ Skip database insertion (safe test)

### Full Run
```bash
node start_pipeline.js
```

This will:
- ✅ Complete extraction
- ✅ Process diagrams
- ✅ Generate/extract solutions
- ✅ Insert into MongoDB

## Expected Output

```
📁 Processing: JEE-Main-Chemistry-PYQ/2024-Jan-24-Morning
📸 Found 5 question images
📋 Found answer key
📝 Found 3 solution images

[1/5] Processing: q001.png
  ✅ Question extracted (type: SCQ)
  ✅ Answer matched: B
  ✅ Solution found (from solutions-001.png)
  ✅ Diagrams processed: 1
  ✅ Inserted as CK-126

[2/5] Processing: q002.png
  ✅ Question extracted (type: MCQ)
  ✅ Answer matched: A,C
  ⚠️  Solution generated (no image provided)
  ✅ Inserted as CK-127

...

📊 PIPELINE SUMMARY
✅ 5 questions inserted
⚠️  0 flagged for review
❌ 0 failed
💰 Estimated cost: $0.09 (₹7.50)
```

## Verification

After running, verify in admin dashboard:
1. Go to: http://localhost:3000/crucible/admin
2. Filter by chapter (e.g., "Chemical Kinetics")
3. Check:
   - Display IDs are correct (CK-126, CK-127, etc.)
   - Questions render properly
   - Solutions have 5-step format
   - Diagrams show correctly
   - Exam source shows (JEE Main 2024 Jan 24 Morning)

## Tips

- Start with 5 questions for trial
- Always include answer-key.png
- Solutions are optional (AI generates if missing)
- Check extracted JSON in `output/extracted_json/`
- Review flagged questions in `output/review_queue/`

## Troubleshooting

**"Answer key not found"**
- Check filename is exactly `answer-key.png`
- Must be in same folder as questions

**"Answer count mismatch"**
- Answer key has different number of answers
- Verify all questions were extracted

**"Solution not matching"**
- Check solution filename: `solutions-001.png`, not `solution-001.png`
- Number must match question number

---

**Ready to start! Add your images and run the pipeline.** 🚀
