# ✅ Simplified Multi-Question Workflow - FINAL

## 🎯 Workflow Overview

**Input:**
- Page images (page-001.png, page-002.png, page-003.png)
- Each page contains **multiple questions** (5-10 questions per page)
- One answer key image (answer-key.png) with ALL answers
- ❌ **No solution images needed** - AI generates all solutions

**Process:**
1. Extract all questions from all pages **in sequence**
2. Extract all answers from answer key
3. Match answers to questions sequentially (by position)
4. Generate high-quality step-by-step solutions with AI
5. Validate and insert into MongoDB

---

## 📁 Folder Structure

```
automation/input/JEE-Main-Chemistry-PYQ/2024-Jan-24-Morning/
├── page-001.png          ← Questions 1-7 (7 questions)
├── page-002.png          ← Questions 8-15 (8 questions)
├── page-003.png          ← Questions 16-22 (7 questions)
├── page-004.png          ← Questions 23-30 (8 questions)
└── answer-key.png        ← Answers for ALL 30 questions
```

**File Naming:**
- **Page images**: Any name that sorts alphabetically (page-001.png, page-002.png, OR p1.png, p2.png, OR 001.png, 002.png)
- **Answer key**: Exactly `answer-key.png` (case-insensitive)
- **Important**: Pages are processed in alphabetical order

---

## 🔄 Detailed Workflow

### **Step 1: Extract Questions from All Pages**

```
Processing: page-001.png
  AI extracts: [Q1, Q2, Q3, Q4, Q5, Q6, Q7]
  ✅ 7 questions extracted

Processing: page-002.png
  AI extracts: [Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15]
  ✅ 8 questions extracted

Processing: page-003.png
  AI extracts: [Q16, Q17, Q18, Q19, Q20, Q21, Q22]
  ✅ 7 questions extracted

Processing: page-004.png
  AI extracts: [Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30]
  ✅ 8 questions extracted

TOTAL: 30 questions extracted
```

**What AI extracts per question:**
- Question text with LaTeX formatting
- Question type (SCQ, MCQ, NVT, etc.)
- Options (for SCQ/MCQ)
- Diagrams (if present, with bounding boxes)
- Chapter detection
- Difficulty estimation
- ❌ **NOT the answer** (comes from answer key)

### **Step 2: Extract Answers from Answer Key**

```
Processing: answer-key.png
  AI extracts: [B, A, C, D, A,C, 15.5, B, D, A, C, ...]
  ✅ 30 answers extracted
```

**Answer formats:**
- SCQ: Single letter (e.g., "B")
- MCQ: Multiple letters (e.g., "A,C")
- NVT: Number (e.g., "15.5")

### **Step 3: Match Answers Sequentially**

```
Q1 ← Answer[0] = B
Q2 ← Answer[1] = A
Q3 ← Answer[2] = C
Q4 ← Answer[3] = D
Q5 ← Answer[4] = A,C
...
Q30 ← Answer[29] = C
```

**Critical:** Matching is by **position**, not by page or filename.

### **Step 4: Generate Solutions with AI**

For each question:
```
Input to AI:
  - Question text
  - Options
  - Correct answer
  - Chapter context

AI generates:
  - Step 1: Understand the Problem
  - Step 2: Identify Key Concepts
  - Step 3: Apply the Concept
  - Step 4: Calculate/Derive
  - Step 5: Conclusion
  - Key Points to Remember
```

**Quality standards:**
- Minimum 80 words for SCQ/MCQ
- Minimum 60 words for NVT
- 5-step structure
- Proper LaTeX formatting
- Clear explanations

### **Step 5: Process Diagrams**

If question has diagrams:
```
- Crop diagram from page image
- Save to Mac Automator input folder
- Wait for SVG conversion
- Upload SVG to Cloudflare R2
- Insert markdown link into question text
```

### **Step 6: Validate**

Check:
- LaTeX syntax (no $$, no Unicode arrows)
- Required fields present
- Chapter ID exists in taxonomy
- Solution quality (word count, structure)
- Answer format correct for question type

### **Step 7: Insert into MongoDB**

```
Generate display_id: CK-001, CK-002, ...
Build document following QUESTION_INGESTION_WORKFLOW
Insert into questions_v2 collection
```

---

## 📊 Expected Output

```
============================================================
📁 Processing: JEE-Main-Chemistry-PYQ/2024-Jan-24-Morning
============================================================
📄 Found 4 page image(s)
📋 Found answer key: answer-key.png

📖 STEP 1: Extracting questions from all pages...

[Page 1/4] Processing: page-001.png
  ✅ Extracted 7 questions (Total: 7)
[Page 2/4] Processing: page-002.png
  ✅ Extracted 8 questions (Total: 15)
[Page 3/4] Processing: page-003.png
  ✅ Extracted 7 questions (Total: 22)
[Page 4/4] Processing: page-004.png
  ✅ Extracted 8 questions (Total: 30)

✅ Total questions extracted: 30

📋 STEP 2: Extracting answers from answer key...

✅ Extracted 30 answers

🔗 STEP 3: Matching answers to questions...

✅ Answers matched to 30 questions

⚙️  STEP 4: Processing individual questions...

[Q1/30] Processing...
  ✅ Inserted as CK-126

[Q2/30] Processing...
  ✅ Inserted as CK-127

[Q3/30] Processing...
  ✅ Inserted as CK-128

...

[Q30/30] Processing...
  ✅ Inserted as CK-155

============================================================
📊 Folder Complete
   ✅ 30 questions inserted
   ❌ 0 questions failed
============================================================

📊 PIPELINE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Folders processed: 1
📄 Pages processed: 4
📝 Questions extracted: 30
✅ Successfully inserted: 30
⚠️  Flagged for review: 0
❌ Failed: 0
🖼️  Diagrams processed: 5
🤖 Solutions generated: 30
⏱️  Time taken: 12m 34s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Estimated API cost: $0.54
   - Extraction: 4 requests ($0.012)
   - Solutions: 30 requests ($0.45)
```

---

## 💰 Cost Breakdown

**Per Question:**
- Extraction: ~$0.003 per page (shared across all questions on page)
- Solution: ~$0.015 per question
- **Average: ~$0.015-0.018 per question**

**Example (30 questions across 4 pages):**
- Extraction: 4 pages × $0.003 = $0.012
- Solutions: 30 questions × $0.015 = $0.45
- **Total: ~$0.46 for 30 questions**

**Your $5 Credit:**
- ~275-300 questions total
- Much more efficient than one-question-per-image approach

---

## ✅ Key Advantages

### **1. Simpler Workflow**
- ❌ No solution image extraction needed
- ❌ No complex solution matching logic
- ✅ AI generates all solutions (high quality, consistent)

### **2. Better Quality**
- AI-generated solutions are detailed and step-by-step
- Consistent formatting across all questions
- No OCR errors from solution images

### **3. Cost Effective**
- Extraction cost shared across multiple questions per page
- Only pay for solution generation (which you need anyway)

### **4. Robust**
- Sequential processing ensures correct order
- Answer matching by position (foolproof)
- No dependency on solution image availability

---

## 🚨 Critical Rules

### **1. Page Order Matters**
```
✅ CORRECT: page-001.png, page-002.png, page-003.png
✅ CORRECT: p1.png, p2.png, p3.png
✅ CORRECT: 001.png, 002.png, 003.png
❌ WRONG: page-3.png, page-1.png, page-2.png (wrong alphabetical order)
```

**Solution:** Use zero-padded numbers (001, 002, 003)

### **2. Answer Key Must Match Question Count**
```
✅ CORRECT: 30 questions → 30 answers in answer key
❌ WRONG: 30 questions → 28 answers (mismatch!)
```

**Pipeline behavior:**
- Warns about mismatch
- Continues processing
- Missing answers → flagged for review

### **3. Sequential Integrity**
```
Questions are numbered globally:
- Page 1: Q1, Q2, Q3, Q4, Q5, Q6, Q7
- Page 2: Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15
NOT:
- Page 1: Q1, Q2, Q3, Q4, Q5, Q6, Q7
- Page 2: Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8 ❌
```

### **4. Answer Key Format**
```
✅ CORRECT formats:
- "1. B  2. A  3. C  4. D"
- "Q1: B, Q2: A, Q3: C"
- Vertical list: "1. B\n2. A\n3. C"
- Table with question numbers and answers

❌ WRONG:
- Answers without numbers
- Random order
- Missing answers
```

---

## 🔧 Running the Pipeline

### **1. Prepare Your Data**
```bash
cd automation/input/JEE-Main-Chemistry-PYQ
mkdir 2024-Jan-24-Morning
cd 2024-Jan-24-Morning

# Add your files:
# - page-001.png, page-002.png, page-003.png, page-004.png
# - answer-key.png
```

### **2. Dry Run (Test)**
```bash
cd /Users/CanvasClasses/Desktop/canvas/automation
node start_pipeline.js --dry-run
```

**What it does:**
- Extracts all questions
- Extracts all answers
- Matches them
- Validates everything
- **Does NOT insert into database**
- Shows you what would be inserted

### **3. Full Run**
```bash
node start_pipeline.js
```

**What it does:**
- Complete extraction
- Answer matching
- Solution generation
- Diagram processing
- Validation
- **Inserts into MongoDB**

### **4. Verify Results**
```bash
# Open admin dashboard
http://localhost:3000/crucible/admin

# Filter by chapter
# Check questions render correctly
# Verify display IDs are sequential
```

---

## 📝 Files Created

### **Output Folder**
```
automation/output/
├── extracted_json/
│   └── 2024-Jan-24-Morning_20260226.json  ← All extracted data
├── review_queue/
│   └── review_Q15_1234567890.json         ← Flagged questions
└── diagrams_cropped/
    └── diagram_001_20260226.png           ← Cropped diagrams
```

### **Logs**
```
automation/logs/
└── pipeline_20260226_103045.log           ← Detailed logs
```

---

## ✅ Verification Checklist

After running the pipeline:

- [ ] Check total questions extracted matches expected
- [ ] Check answer count matches question count
- [ ] Verify questions in admin dashboard
- [ ] Check display IDs are sequential (CK-126, CK-127, CK-128...)
- [ ] Verify LaTeX renders correctly
- [ ] Check solutions have 5-step format
- [ ] Verify answers are correct
- [ ] Check diagrams load properly (if any)
- [ ] Verify exam source metadata

---

## 🎯 Summary

**This simplified workflow:**
- ✅ Handles multiple questions per page
- ✅ Processes pages in sequence
- ✅ Matches answers by position
- ✅ Generates high-quality AI solutions
- ✅ No solution image extraction needed
- ✅ Robust and cost-effective

**Ready to use!** Just prepare your page images and answer key, then run the pipeline.
