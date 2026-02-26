# 📋 Complete Workflow Summary - Automated Question Ingestion

## Overview

This pipeline automates the extraction of chemistry questions from PDF screenshots, following the **QUESTION_INGESTION_WORKFLOW** exactly. It handles answer keys, solutions, diagrams, and inserts questions into MongoDB with proper schema compliance.

---

## 🎯 Key Features

✅ **Answer Key Support** - Extracts answers from a single answer key image  
✅ **Solution Handling** - Extracts from images OR generates automatically  
✅ **Diagram Processing** - Crops, converts to SVG, uploads to R2  
✅ **Schema Compliance** - Follows QUESTION_INGESTION_WORKFLOW exactly  
✅ **Resumable** - SQLite progress tracking for crash recovery  
✅ **Cost-Effective** - ~₹1.50 per question with Claude API  

---

## 📁 Folder Structure

```
automation/input/
└── JEE-Main-Chemistry-PYQ/
    └── 2024-Jan-24-Morning/
        ├── q001.png              ← Question 1
        ├── q002.png              ← Question 2
        ├── q003.png              ← Question 3
        ├── q004.png              ← Question 4
        ├── q005.png              ← Question 5
        ├── answer-key.png        ← Answers for ALL questions (required)
        ├── solutions-001.png     ← Solution for Q1 (optional)
        ├── solutions-002.png     ← Solution for Q2 (optional)
        └── solutions-003.png     ← Solution for Q3 (optional)
```

**Naming Rules:**
- **Questions**: Any name (q001.png, page_001.png, screenshot_1.png)
- **Answer Key**: Exactly `answer-key.png` (case-insensitive)
- **Solutions**: `solutions-001.png`, `solutions-002.png`, etc.
  - Number must match question number
  - If missing, AI generates solution automatically

---

## 🔄 Complete Pipeline Flow

### **Stage 1: Question Extraction**
```
Input: q001.png, q002.png, q003.png, ...
Process:
  - AI extracts question text, options, type
  - Detects diagrams with bounding boxes
  - Determines difficulty and chapter
  - Does NOT extract answer (comes from answer key)
Output: Question objects (no answers yet)
```

### **Stage 1B: Answer Key Parsing** ⭐ NEW
```
Input: answer-key.png
Process:
  - AI extracts all answers in order
  - Example: "1. B, 2. A, 3. C, 4. D, 5. A"
  - Matches answers to questions by position
Output: Questions with matched answers
```

### **Stage 2: Diagram Processing**
```
Input: Questions with diagram bounding boxes
Process:
  - Crop diagrams from question images
  - Save to Mac Automator input folder
  - Wait for SVG conversion
  - Upload SVGs to Cloudflare R2
  - Insert markdown links into question text
Output: Questions with diagram URLs
```

### **Stage 3: Solution Generation**
```
Input: Questions with answers
Process:
  - Check if solutions-NNN.png exists
  - If yes: Extract solution from image
  - If no: AI generates detailed 5-step solution
Output: Questions with solutions
```

### **Stage 3B: Solution Matching** ⭐ NEW
```
Input: Questions + solution images map
Process:
  - For each question:
    - If solutions-NNN.png exists: extract it
    - If missing: generate with AI
  - Follow QUESTION_INGESTION_WORKFLOW format
  - Minimum 80 words, 5-step structure
Output: Questions with complete solutions
```

### **Stage 4: Validation**
```
Input: Complete questions
Process:
  - Validate LaTeX syntax (no $$, no Unicode arrows)
  - Check required fields
  - Verify chapter_id exists in taxonomy
  - Check solution quality (word count, steps)
  - Flag questions needing review
Output: Validated questions + warnings
```

### **Stage 5: MongoDB Insertion**
```
Input: Validated questions
Process:
  - Generate display_id (canonical prefix + sequence)
  - Build document following QUESTION_INGESTION_WORKFLOW
  - Insert into questions_v2 collection
  - Track insertion stats
Output: Questions in database
```

---

## 🔐 MongoDB Schema Compliance

The pipeline follows **QUESTION_INGESTION_WORKFLOW** exactly:

### **Document Structure**
```javascript
{
  _id: "uuid-v4-string",              // UUID, NOT ObjectId
  display_id: "CK-001",                // Canonical prefix + sequence
  
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
  
  answer: "b",                         // SCQ: single letter
                                       // MCQ: ["a", "c"]
                                       // NVT: number
  
  solution: {
    text_markdown: "**Step 1: ...**",  // 5-step format
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
    exam_source: {                     // Required for PYQs
      exam: "JEE Main",                // Exact spelling
      year: 2024,
      month: "Jan",
      day: 24,
      shift: "Morning"
    }
  },
  
  status: "review",                    // Always start in review
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

### **Canonical Prefix Table**
```javascript
// Class 11
ch11_atom       → ATOM
ch11_bonding    → BOND
ch11_chem_eq    → CEQ
ch11_goc        → GOC
ch11_hydrocarbon → HC
ch11_ionic_eq   → IEQ
ch11_mole       → MOLE
ch11_pblock     → PB11
ch11_periodic   → PERI
ch11_prac_org   → POC
ch11_redox      → RDX
ch11_thermo     → THERMO

// Class 12
ch12_alcohols   → ALCO
ch12_aldehydes  → ALDO
ch12_amines     → AMIN
ch12_biomolecules → BIO
ch12_carbonyl   → CARB
ch12_coord      → CORD
ch12_dblock     → DNF
ch12_electrochem → EC
ch12_haloalkanes → HALO
ch12_kinetics   → CK
ch12_pblock     → PB12
ch12_phenols    → PHEN
ch12_solutions  → SOL
```

### **Critical Schema Rules**

1. **Collection**: `questions_v2` (NOT `questions`)
2. **_id**: UUID v4 string (NOT ObjectId)
3. **deleted_at**: Must be `null` explicitly
4. **display_id**: Both top-level AND in metadata
5. **chapter_id**: Exact match from `taxonomyData_from_csv.ts`
6. **exam_source**: Required for all PYQs

---

## 📝 LaTeX Formatting Rules

Following **QUESTION_INGESTION_WORKFLOW** strictly:

### **CRITICAL RULES**
1. ✅ Use `$...$` for ALL math (NEVER `$$...$$`)
2. ✅ Chemical formulas: `\ce{H2O}`, `\ce{CaCO3}`
3. ✅ Fractions: `\frac{numerator}{denominator}`
4. ✅ Greek letters: `\Delta`, `\alpha`, `\beta`
5. ✅ Arrows: `\rightarrow`, `\leftarrow`, `\rightleftharpoons`
6. ❌ NO Unicode arrows outside math blocks (`→`, `←`, `⇌`)
7. ❌ NO `\dfrac` (use `\frac` only)
8. ❌ NO LaTeX commands outside `$...$`

### **Solution Structure (Mandatory)**
```markdown
**Step 1: Understand the Problem**
[Brief explanation of what's being asked]

**Step 2: Identify Key Concepts**
[List relevant chemistry concepts/formulas]

**Step 3: Apply the Concept**
[Show reasoning and setup]

**Step 4: Calculate/Derive**
[Step-by-step calculation with units]

**Step 5: Conclusion**
[Final answer with explanation]

**Key Points to Remember:**
- Point 1
- Point 2
- Point 3
```

### **Quality Standards**
- Minimum 80 words for SCQ/MCQ
- Minimum 60 words for NVT
- Show ALL intermediate calculations
- Explain WHY each step is taken
- Include units in all calculations

---

## 💰 Cost Estimation

**Per Question:**
- Extraction: $0.003 (~₹0.25)
- Solution: $0.015 (~₹1.25)
- **Total: ~₹1.50 per question**

**Your $5 Credit:**
- ~275 questions total
- Start with 5-10 for testing
- Then scale up gradually

**Cost Control:**
- Rate limit: 10 requests/minute
- Batch processing: 5 questions at a time
- Skip solutions if already provided

---

## 🚀 Usage

### **1. Prepare Input Folder**
```bash
automation/input/JEE-Main-Chemistry-PYQ/2024-Jan-24-Morning/
├── q001.png
├── q002.png
├── q003.png
├── answer-key.png
└── solutions-001.png (optional)
```

### **2. Dry Run (Test Mode)**
```bash
cd automation
node start_pipeline.js --dry-run
```
- Extracts questions
- Parses answer key
- Validates everything
- **Does NOT insert into database**

### **3. Full Run**
```bash
node start_pipeline.js
```
- Complete pipeline
- Inserts into MongoDB
- Shows progress and stats

### **4. Skip Solutions (Use Existing)**
```bash
node start_pipeline.js --skip-solutions
```
- Only if all solution images provided
- Saves API costs

### **5. Skip Diagrams**
```bash
node start_pipeline.js --skip-diagrams
```
- For text-only questions
- Faster processing

### **6. View Stats**
```bash
node start_pipeline.js --stats
```
- Shows progress
- API usage
- Database counts

---

## 📊 Output

### **Console Output**
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

### **Files Created**
```
output/
├── extracted_json/
│   └── 2024-Jan-24-Morning_20260226.json
├── review_queue/
│   └── CK-127_needs_review.json
└── diagrams_cropped/
    └── diagram_001_20260226.png

logs/
└── pipeline_20260226_103045.log
```

---

## ✅ Verification Checklist

After pipeline run:

1. **Check Admin Dashboard**
   - Go to: http://localhost:3000/crucible/admin
   - Filter by chapter
   - Verify display IDs are correct

2. **Check Questions**
   - Question text renders properly
   - LaTeX displays correctly
   - Options show correctly
   - Answers are marked

3. **Check Solutions**
   - 5-step format present
   - LaTeX renders properly
   - Minimum word count met
   - Key points included

4. **Check Metadata**
   - Exam source shows correctly
   - Chapter assignment correct
   - Difficulty appropriate
   - Tags assigned

5. **Check Diagrams**
   - SVGs load properly
   - White text on transparent background
   - Proper scaling
   - Markdown links work

---

## 🔧 Troubleshooting

### **"Answer key not found"**
- File must be named exactly `answer-key.png`
- Case-insensitive
- Must be in same folder as questions

### **"Answer count mismatch"**
- Answer key has different number of answers than questions
- Check answer key image
- Verify all questions extracted

### **"Solution not matching"**
- Solution files must be named `solutions-001.png`, `solutions-002.png`
- Number must match question number
- Check file naming

### **"Chapter not found"**
- Use exact chapter names from taxonomy
- Or add mapping to `config.js` → `chapterMapping`

### **"Display ID conflict"**
- Pipeline auto-increments from last ID
- Check MongoDB for existing questions
- Verify canonical prefix table

### **"LaTeX validation failed"**
- Check for `$$...$$` (should be `$...$`)
- Check for Unicode arrows outside math
- Check for unmatched delimiters

---

## 📚 Documentation Files

- **SETUP_GUIDE.md** - Complete setup with API key security
- **README.md** - Full pipeline documentation
- **QUICKSTART.md** - 5-minute quick start
- **WORKFLOW_SUMMARY.md** - This file

---

## 🎯 Next Steps

1. ✅ Set up API key securely in `.env.local`
2. ✅ Install dependencies: `npm install`
3. ✅ Prepare trial batch (5 questions)
4. ✅ Run dry-run test
5. ✅ Review extracted data
6. ✅ Run full pipeline
7. ✅ Verify in admin dashboard
8. ✅ Scale up to larger batches

---

**Ready to automate! Start with your JEE Main trial batch.** 🚀
