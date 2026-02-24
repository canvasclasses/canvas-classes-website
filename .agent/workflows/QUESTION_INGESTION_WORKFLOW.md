# 📚 QUESTION INGESTION WORKFLOW
## Comprehensive Guide for AI Agents & Admins

---

## 🎯 OBJECTIVE
Add high-quality chemistry questions to The Crucible database with consistent formatting, accurate LaTeX rendering, and step-by-step solutions.

---

## 📋 INPUT FORMAT

### **Handwritten Question Format:**
```
[EMT] Question text here with chemical formulas
Options:
A) Option 1
B) Option 2  
C) Option 3
D) Option 4
Answer: C
Solution: [If provided, use it. If not, generate high-quality solution]
```

**Legend:**
- **E** = Easy
- **M** = Medium
- **T** = Tough (Hard)

---

## 🔧 STRICT RULES FOR AI AGENTS

### **RULE 1: Question Text Processing**

1. **LaTeX Formatting:**
   - Use `$...$` for ALL math — both inline and display (see Rule 12: `$$...$$` is BANNED)
   - ❌ NEVER use `$$...$$` — it breaks the renderer
   - Chemical formulas: Use `\ce{}` command: `\ce{H2SO4}`, `\ce{CaCO3}`
   - Subscripts: `H_{2}O` or `H_2O` (single char doesn't need braces)
   - Superscripts: `x^{2}` or `x^2` (single char doesn't need braces)
   - Fractions: `\frac{numerator}{denominator}` — ❌ NEVER use `\dfrac` (causes oversized rendering in inline math)
   - Greek letters: `\alpha`, `\beta`, `\Delta`, `\pi`
   - Arrows: `\rightarrow`, `\leftarrow`, `\leftrightarrow`
   - Equilibrium: `\rightleftharpoons`

   **MO Configuration Notation (CRITICAL):**
   - Antibonding orbitals use `^*` superscript: `\sigma^*`, `\pi^*`
   - The renderer auto-converts `^*` → `^{*}` for KaTeX compatibility
   - ✅ Write: `$\sigma_{1s}^2\sigma^*_{1s}^2\sigma_{2s}^2\sigma^*_{2s}^2\pi_{2p}^4\sigma_{2p}^2$`
   - ✅ Also valid: `$\sigma_{1s}^2\sigma^{*}_{1s}^2...$` (braced form, slightly safer)
   - ❌ Never write MO configs as plain text — always inside `$...$`
   - Example full MO config for CO/NO⁺ (10e⁻): `$\sigma_{1s}^2\sigma^*_{1s}^2\sigma_{2s}^2\sigma^*_{2s}^2\pi_{2p}^4\sigma_{2p}^2$`

2. **Chemical Equation Examples:**
   ```latex
   \ce{2H2 + O2 -> 2H2O}
   \ce{CaCO3 ->[heat] CaO + CO2}
   \ce{Fe^{2+} + 2OH- -> Fe(OH)2 v}
   ```

3. **Common Patterns:**
   - Temperature: `25\,°C` or `298\,K`
   - Units: `\text{mol}`, `\text{L}`, `\text{g}`
   - Concentration: `[\ce{H+}]` or `\text{[H}^+\text{]}`
   - pH: `\text{pH} = -\log[\ce{H+}]`

4. **CRITICAL: Markdown Formatting Standards**
   - **Bold text:** Use `**text**` for step headers (e.g., `**Step 1: Understand the problem**`)
   - **Bullet points:** Use `- item` for lists (e.g., `- Key point 1`)
   - **Tables:** Use markdown table syntax with `|` separators:
     ```markdown
     | Header 1 | Header 2 | Header 3 |
     |----------|----------|----------|
     | Cell A1  | Cell A2  | Cell A3  |
     | Cell B1  | Cell B2  | Cell B3  |
     ```
   - **NEVER** use plain text for tables - always use proper markdown table format

5. **MTC (Match The Column) Question Formatting — CRITICAL:**

   The renderer supports **three** MTC markdown formats. Always use **Format A** (pipe table) for new questions:

   **Format A — Pipe table (PREFERRED for new questions):**
   ```markdown
   | | List I (Molecule/Species) | | List II (Property/Shape) |
   |---|---|---|---|
   | A | $\mathrm{SO_2Cl_2}$ | I | Paramagnetic |
   | B | NO | II | Diamagnetic |
   | C | $\mathrm{NO_2^-}$ | III | Tetrahedral |
   | D | $\mathrm{I_3^-}$ | IV | Linear |
   ```
   - Header row: `| | List I (label) | | List II (label) |` — empty cells at positions 0 and 2 trigger colspan=2 rendering
   - Renders as a proper 4-column table with List I spanning cols 1-2 and List II spanning cols 3-4

   **Format B — Multiline text (also supported, legacy):**
   ```markdown
   **List I:**
   A. $\mathrm{XeF_4}$
   B. $\mathrm{SF_4}$
   C. $\mathrm{NH_4^+}$
   D. $\mathrm{BrF_3}$

   **List II:**
   I. See-saw
   II. Square planar
   III. Bent T-shaped
   IV. Tetrahedral
   ```

   **Format C — Inline text (also supported, legacy):**
   ```markdown
   **List I (Molecule):** A. $\mathrm{BrF_5}$ B. $\mathrm{H_2O}$ C. $\mathrm{ClF_3}$ D. $\mathrm{SF_4}$ **List II (Shape):** i. T-shape ii. See-saw iii. Bent iv. Square pyramidal
   ```

   All three formats render as a proper 4-column HTML table. Format A is most reliable.

5. **LaTeX Sizing & Font Standards (CRITICAL - Auto-Applied):**
   
   **Font Consistency:**
   - ALL LaTeX uses Inter font (same as text)
   - Applied via `.latex-math-inline` and `.latex-math-display` CSS classes
   - Overrides KaTeX's default Computer Modern serif font
   
   **Size Consistency:**
   - Question text: 0.68em (inline and display)
   - Options: 0.68em (inline and display)
   - Solutions: 0.68em (inline and display)
   - **All sections use identical sizing for uniformity**
   
   **Technical Implementation:**
   - Sizes applied via inline styles in LaTeXPreview component
   - Font applied via CSS with `!important` flag
   - AI agents do NOT need to adjust sizes or fonts manually
   - System automatically ensures consistency across all questions

### **RULE 2: Difficulty Mapping**

```javascript
E → "Easy"
M → "Medium"  
T → "Hard"
```

### **RULE 3: Question Type Detection**

**Automatic Detection Logic:**
```
IF question has 4 options AND exactly 1 correct answer:
  type = "SCQ" (Single Correct Question)

IF question has 4 options AND multiple correct answers:
  type = "MCQ" (Multi Correct Question)

IF question asks for numerical value:
  type = "NVT" (Numerical Value Type)

IF question has "Assertion" and "Reason":
  type = "AR" (Assertion-Reason)

IF question has statements to evaluate:
  type = "MST" (Multi-Statement)

IF question has two columns to match:
  type = "MTC" (Match The Column)
```

### **RULE 4: Option Processing**

1. **Format:**
   ```json
   {
     "id": "a",
     "text": "$\\ce{H2O}$ is water",
     "is_correct": true
   }
   ```

2. **LaTeX in Options:**
   - Always use LaTeX for formulas in options
   - Keep options concise (1-2 lines max)
   - Use consistent formatting across all options

3. **Correct Answer Marking:**
   - For SCQ: Mark exactly ONE option as `is_correct: true`
   - For MCQ: Mark ALL correct options as `is_correct: true`
   - For NVT: Store in `answer.integer_value` or `answer.decimal_value`

### **RULE 5: Solution Generation (CRITICAL)**

**When solution is NOT provided, generate following this structure:**

```markdown
**Step 1: Understand the Problem**
[Brief explanation of what's being asked]

**Step 2: Identify Key Concepts**
[List relevant chemistry concepts/formulas]

**Step 3: Apply the Concept**
[Show calculations or reasoning]
$$
[Display important equations here]
$$

**Step 4: Calculate/Derive**
[Step-by-step calculation with units]

**Step 5: Conclusion**
[Final answer with explanation]

**Key Points to Remember:**
- Point 1
- Point 2
- Point 3
```

**Solution Quality Standards:**
- ✅ Use numbered steps (minimum 3 steps)
- ✅ Include relevant formulas in LaTeX
- ✅ Show ALL intermediate calculations
- ✅ Explain WHY each step is taken
- ✅ Include units in calculations
- ✅ Add "Key Points" section at end
- ✅ Use display math `$$...$$` for important equations
- ✅ Minimum 150 words for Medium/Hard questions
- ✅ Use `\ce{}` for all chemical formulas

**Solution Font Style:**
- Use handwritten-style font (Caveat, Kalam, or Patrick Hand)
- Makes solution feel personal and approachable
- Implemented via CSS class `.solution-text`

### **RULE 6: Metadata Assignment**

**Chapter Assignment:**
```javascript
// Must match taxonomy chapter_id from taxonomyData_from_csv.ts
Examples:
- "ch11_mole" → Some Basic Concepts (Mole Concept)
- "ch11_atom" → Structure of Atom
- "ch12_solutions" → Solutions
- "ch12_kinetics" → Chemical Kinetics
```

**Tag Assignment:**
```javascript
// Must assign PRIMARY tag from chapter's tags
Examples for "ch11_mole":
- "tag_mole_1" → Laws Of Chemical Combination
- "tag_mole_2" → Concentration Terms
- "tag_mole_7" → Mole Basics

// Tag weight: Always 1.0 for primary tag
{
  "tag_id": "tag_mole_1",
  "weight": 1.0
}
```

**Exam Source (if PYQ) — CRITICAL RULES:**

**RULE: The `exam` field is MANDATORY for all PYQs. Never omit it.**

All questions uploaded so far (and until further notice) are **JEE Main** PYQs:
```json
{
  "exam": "JEE Main",
  "year": 2024,
  "month": "Apr",
  "day": 10,
  "shift": "Evening"
}
```

When JEE Advanced PYQs are added (user will explicitly notify), use:
```json
{
  "exam": "JEE Advanced",
  "year": 2023,
  "month": "Jun",
  "day": 4,
  "shift": "Paper 1"
}
```

**Field standards:**
- `exam`: `"JEE Main"` or `"JEE Advanced"` — always present, exact spelling
- `year`: 4-digit integer e.g. `2024`
- `month`: Short name e.g. `"Jan"`, `"Apr"`, `"Jun"`, `"Aug"`, `"Sep"`
- `day`: Integer day of month e.g. `10`
- `shift`: `"Morning"` or `"Evening"` for JEE Main; `"Paper 1"` or `"Paper 2"` for JEE Advanced

**Non-PYQ questions must NOT have `exam_source` field at all.**

**Admin dashboard filters:**
- "Mains PYQ" filter → matches `exam_source.exam` containing `"Main"`
- "Advanced PYQ" filter → matches `exam_source.exam` containing `"Adv"` or `"Advanced"`

**Ingestion script helper:**
```javascript
function src(year, month, day, shift) {
  return { exam: 'JEE Main', year, month, day, shift };
}
// Usage: src(2024, 'Apr', 10, 'Evening')
```

### **RULE 7: Display ID Generation**

**Format:** `{CHAPTER_PREFIX}-{ZERO_PADDED_3_DIGIT_SEQUENCE}`

**⚠️ CANONICAL PREFIX TABLE — ONE PREFIX PER CHAPTER, NO EXCEPTIONS:**

| chapter_id | Canonical Prefix | Example |
|---|---|---|
| `ch11_atom` | `ATOM` | ATOM-414 |
| `ch11_bonding` | `BOND` | BOND-177 |
| `ch11_chem_eq` | `CEQ` | CEQ-063 |
| `ch11_goc` | `GOC` | GOC-135 |
| `ch11_hydrocarbon` | `HC` | HC-151 |
| `ch11_ionic_eq` | `IEQ` | IEQ-078 |
| `ch11_mole` | `MOLE` | MOLE-213 |
| `ch11_pblock` | `PB11` | PB11-062 |
| `ch11_periodic` | `PERI` | PERI-131 |
| `ch11_prac_org` | `POC` | POC-085 |
| `ch11_redox` | `RDX` | RDX-080 |
| `ch11_thermo` | `THERMO` | THERMO-136 |
| `ch12_alcohols` | `ALCO` | ALCO-001 |
| `ch12_aldehydes` | `ALDO` | ALDO-007 |
| `ch12_amines` | `AMIN` | AMIN-008 |
| `ch12_biomolecules` | `BIO` | BIO-123 |
| `ch12_carboxylic` | `CARB` | CARB-001 |
| `ch12_coord` | `CORD` | CORD-236 |
| `ch12_dblock` | `DNF` | DNF-158 |
| `ch12_electrochem` | `EC` | EC-128 |
| `ch12_haloalkanes` | `HALO` | HALO-005 |
| `ch12_kinetics` | `CK` | CK-126 |
| `ch12_pblock` | `PB12` | PB12-121 |
| `ch12_phenols` | `PHEN` | PHEN-001 |
| `ch12_solutions` | `SOL` | SOL-135 |

**CRITICAL ID RULES:**
- ❌ **NEVER** use exam-based prefixes like `JM25APR7M-51` — these were a historical mistake, now fully corrected
- ❌ **NEVER** invent new prefixes (e.g., `PERD`, `BIOM`, `SOLN`, `THRM`, `ELEC`, `HYDR`, `KINE`) — all chapters already have a canonical prefix above
- ❌ **NEVER** include `PYQ` in the display_id (e.g., `DNF-PYQ-001` is WRONG)
- ✅ **ALWAYS** look up the canonical prefix from the table above before assigning any display_id
- ✅ **ALWAYS** query `questions_v2` for the current maximum number in that prefix before assigning the next ID
- ✅ **CORRECT:** `DNF-159`, `MOLE-414`, `ATOM-412`
- The fact that a question is a PYQ is stored in `metadata.is_pyq: true` — NOT in the ID
- Exam source/year is stored in `metadata.exam_source` — NOT in the display_id or question text

**chapter_id canonical values — ALWAYS use these exact strings:**
- ❌ WRONG: `ch11_equilibrium`, `ch11_thermodynamics`, `ch11_hydrocarbons`, `ch12_coordination`, `ch12_electrochemistry`
- ✅ CORRECT: `ch11_chem_eq`, `ch11_thermo`, `ch11_hydrocarbon`, `ch12_coord`, `ch12_electrochem`
- **Single source of truth:** `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`

**Auto-increment:** Before writing any insertion script, query the current max:
```javascript
const docs = await col.find({ display_id: /^CORD-/ }).toArray();
const max = Math.max(...docs.map(d => parseInt(d.display_id.split('-')[1])));
// next ID = CORD-(max+1) zero-padded to 3 digits
```

### **RULE 10: Question Text Cleanliness**

**NEVER embed exam date/year/shift in the question text (`question_text.markdown`).**

- ❌ WRONG: `"The metal that shows... \n\n**[05 Apr 2024 (M)]**"`
- ❌ WRONG: `"Which of the following... \n\n**[JEE Main PYQ]**"`
- ❌ WRONG: `"...is:\n\n**[28 Jul 2022 Morning]**"`
- ✅ CORRECT: Store exam info ONLY in `metadata.exam_source`:
  ```json
  "exam_source": { "exam": "JEE Main", "year": 2024, "month": "April", "day": 5, "shift": "Morning" }
  ```
- The admin dashboard and practice UI display exam source from metadata — it does NOT need to be in the question text
- Any `**[...]**` exam date/year/shift lines at the end of question text must be stripped before ingestion

### **RULE 11: Database Collection Target**

⚠️ **CRITICAL — This mistake caused 152 questions to be invisible in the admin dashboard.**

This project has **TWO separate MongoDB collections**:

| Collection | Used by | Schema |
|---|---|---|
| `questions` | Old sync script (`sync_json_to_mongo.js`) | Flat: `chapter_id`, `meta.difficulty` |
| `questions_v2` | Admin dashboard, Crucible practice pages | Nested: `metadata.chapter_id`, `metadata.difficulty` |

**ALL new questions MUST go into `questions_v2`.**
- `sync_json_to_mongo.js` writes to the WRONG collection — do NOT use it as the sole sync step
- Use the batch insertion script template (see AI Agent Workflow section) which targets `questions_v2`
- After insertion, verify questions appear in admin dashboard at `/crucible/admin` filtered by chapter

**Chapter ID verification — ALWAYS look up from `data/chapters/_index.json`, never guess:**
- D & F Block = `ch12_dblock`
- Mole Concept = `ch11_mole`
- Structure of Atom = `ch11_atom`

### **RULE 10: Script Batching — 10 Questions Per File**

**CRITICAL:** When writing question insertion scripts, always write exactly **10 questions per script file**.

- File naming: `insert_<chapter>_b<batch_number>.js` (e.g. `insert_cord_b1.js` for Q1-Q10)
- Each file is self-contained: includes its own `mongoose.connect`, question array, and `insertMany` call
- Run each file sequentially and verify count before proceeding to the next batch
- This prevents token limit errors during generation and keeps scripts reviewable
- Example batches for 228 questions: b1(Q1-10), b2(Q11-20), ... b23(Q221-228)

### **RULE 8: LaTeX Validation Checklist**

Before submitting, verify:
- [ ] All `$` delimiters are matched (even count per line)
- [ ] All `{` have matching `}`
- [ ] All `\left(` have matching `\right)`
- [ ] Chemical formulas use `\ce{}`
- [ ] No double backslashes `\\\`
- [ ] Subscripts/superscripts use braces for multi-char
- [ ] No spaces inside `$...$` at boundaries
- [ ] Display math `$$...$$` on separate lines
- [ ] MO configs: `\sigma^*`, `\pi^*` written inside `$...$` (renderer handles `^*` → `^{*}` automatically)
- [ ] No `\dfrac` anywhere — use `\frac` only (dfrac causes oversized fractions in inline math)
- [ ] MTC questions: use pipe-table Format A (see Rule 1.5)
- [ ] Option plain-text length ≤ 28 chars if grid layout is desired; otherwise vertical stack is used automatically

### **RULE 9: Quality Assurance**

**Before Adding Question:**
1. ✅ Question text is clear and unambiguous
2. ✅ All LaTeX renders correctly (no red errors)
3. ✅ Options are distinct and well-formatted
4. ✅ Correct answer is marked properly
5. ✅ Solution has minimum 3 steps
6. ✅ Solution explains WHY, not just WHAT
7. ✅ Chapter and tag are correctly assigned
8. ✅ Difficulty matches question complexity
9. ✅ Display ID follows naming convention
10. ✅ All chemical formulas use `\ce{}`

---

## 🎨 FONT SPECIFICATIONS

### **Question Text Font:**
```css
font-family: 'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif;
font-size: 1.125rem; /* 18px */
line-height: 1.75;
font-weight: 400;
color: #E5E7EB; /* Light gray for dark theme */
```

**Why this font?**
- Professional and clean
- Excellent readability
- Pairs perfectly with LaTeX rendering (Computer Modern)
- Widely available system font

### **Solution Text Font:**
```css
font-family: 'Kalam', 'Caveat', 'Patrick Hand', cursive;
font-size: 1.0625rem; /* 17px */
line-height: 1.8;
font-weight: 400;
color: #D1D5DB; /* Slightly softer gray */
```

**Why handwritten font?**
- Feels personal and approachable
- Mimics teacher's handwritten notes
- Creates emotional connection
- Makes learning feel less formal

**LaTeX Math Font:**
- Uses default Computer Modern (KaTeX/MathJax default)
- Professional mathematical typesetting
- Consistent across all platforms

---

## 🤖 AI AGENT WORKFLOW

### **IMPORTANT: Automated Database Insertion**

**The AI agent inserts questions directly into MongoDB via batch scripts — NOT via the POST API and NOT via manual copy-paste into the admin dashboard.**

- ✅ AI extracts questions from images/text
- ✅ AI generates solutions following 5-step format
- ✅ AI validates LaTeX automatically
- ✅ **AI inserts directly into MongoDB using `scripts/insert_mole_b4_*.js` pattern**
- ✅ Admin dashboard is ONLY for review/correction after insertion

**Why not the POST API (`/api/v2/questions`)?**
- The API auto-generates `display_id` from `chapter.question_sequence`, which is `0` for chapters whose questions were inserted directly (not via the API). This produces wrong IDs like `CH11-001` instead of `MOLE-250`.
- The `Chapter` Mongoose schema uses regex `/^chapter_[a-z_]+$/` which does not match our chapter IDs like `ch11_mole`, causing `Chapter.findById` to throw a Mongoose validation error and return HTTP 500.
- **Fix applied (2026-02-18):** The POST API now accepts a caller-supplied `display_id` in the request body and skips auto-generation when provided. However, for bulk AI-agent ingestion, direct MongoDB insertion remains the reliable approach.

**You do NOT manually copy-paste JSON into the admin dashboard.**

### **Step-by-Step Process:**

```python
def process_handwritten_question(image_or_text):
    # Step 1: Extract text from image (if needed)
    raw_text = extract_text(image_or_text)
    
    # Step 2: Parse difficulty
    difficulty = parse_difficulty(raw_text)  # E/M/T → Easy/Medium/Hard
    
    # Step 3: Extract question text
    question_text = extract_question(raw_text)
    question_text = convert_to_latex(question_text)
    
    # Step 4: Extract options
    options = extract_options(raw_text)
    options = [convert_to_latex(opt) for opt in options]
    
    # Step 5: Identify correct answer
    correct_answer = extract_answer(raw_text)
    
    # Step 6: Check for existing solution
    solution = extract_solution(raw_text)
    
    if not solution:
        # Step 7: Generate high-quality solution
        solution = generate_solution(
            question_text=question_text,
            options=options,
            correct_answer=correct_answer,
            difficulty=difficulty
        )
    else:
        solution = convert_to_latex(solution)
    
    # Step 8: Determine question type
    question_type = determine_type(question_text, options)
    
    # Step 9: Assign chapter and tags
    chapter_id, tag_id = assign_taxonomy(question_text, solution)
    
    # Step 10: Generate display ID
    display_id = generate_display_id(chapter_id)
    
    # Step 11: Validate LaTeX
    validation = validate_latex(question_text, solution, options)
    if not validation.is_valid:
        fix_latex_errors(validation.errors)
    
    # Step 12: Create question object
    question = {
        "_id": generate_uuid(),
        "display_id": display_id,
        "question_text": {
            "markdown": question_text,
            "latex_validated": True
        },
        "type": question_type,
        "options": format_options(options, correct_answer),
        "solution": {
            "text_markdown": solution,
            "latex_validated": True
        },
        "metadata": {
            "difficulty": difficulty,
            "chapter_id": chapter_id,
            "tags": [{"tag_id": tag_id, "weight": 1.0}],
            "is_pyq": False,
            "is_top_pyq": False
        },
        "status": "review",  # Start in review, not published
        "quality_score": 85,  # AI-generated default
        "created_by": "ai_agent",
        "updated_by": "ai_agent"
    }
    
    # Step 13: INSERT DIRECTLY INTO MONGODB (preferred for bulk ingestion)
    # Use a dedicated Node.js script that connects to MongoDB directly.
    # See scripts/insert_mole_b4_1.js as the canonical template.
    #
    # DO NOT use the POST API for bulk ingestion — see note above.
    result = run_node_script(f"scripts/insert_{chapter}_batch.js")
    
    if result.ok:
        print(f"✅ {display_id} inserted successfully")
    else:
        print(f"❌ {display_id} failed: {result.error}")
```

### **Batch Insertion Script (Canonical Template):**

For multiple questions, write a Node.js script that connects to MongoDB directly:

```bash
# Run the batch insertion script directly
node scripts/insert_mole_b4_1.js   # MOLE-250 to MOLE-259
node scripts/insert_mole_b4_2.js   # MOLE-260 to MOLE-269
node scripts/insert_mole_b4_3.js   # MOLE-270 to MOLE-277

# Output:
# ✅ MOLE-250
# ✅ MOLE-251
# ...
# 📊 10 inserted, 0 failed
# 👉 Review at: http://localhost:3000/crucible/admin
```

**Script Template (copy and adapt for each new batch):**

```javascript
// scripts/insert_<chapter>_batch_<n>.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const now = new Date();

// Build a question document
function mk(display_id, difficulty, type, markdown, options, answer, sol, tag_id) {
  const doc = {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: true },
    type, options: options || [],
    solution: { text_markdown: sol, latex_validated: true },
    metadata: {
      difficulty, chapter_id: 'ch11_mole',
      tags: [{ tag_id, weight: 1.0 }],
      is_pyq: false, is_top_pyq: false
    },
    status: 'review', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent',
    created_at: now, updated_at: now, deleted_at: null
  };
  if (answer) doc.answer = answer;
  return doc;
}

const questions = [ /* ... your question objects ... */ ];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try {
      await col.insertOne(doc);
      console.log(`  ✅ ${doc.display_id}`);
      ok++;
    } catch(e) {
      console.log(`  ❌ ${doc.display_id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
```

**Key rules for the script:**
- MongoDB collection name is `questions_v2` (NOT `questionv2s`)
- Always set `deleted_at: null` explicitly
- Always supply your own `display_id` — do NOT rely on auto-generation
- `chapter_id` must match exactly: e.g. `ch11_mole`, `ch11_atom`, etc.
- `tag_id` must be a valid tag from `taxonomyData_from_csv.ts` for that chapter
- Find the last `display_id` before starting: query `questions_v2` sorted by `display_id` descending

---

## ✅ RENDERING & QUALITY STANDARDS

### **Standardized Rendering System**

All rendering is handled automatically by the LaTeXPreview component. AI agents must follow these standards:

**1. Chemistry Formulas (`\ce{}` command):**
- ✅ Correct: `\ce{H2O}`, `\ce{CO2}`, `\ce{N2O5}`
- ✅ System automatically converts to proper LaTeX subscripts
- ✅ Handles arrows: `\ce{A -> B}` becomes →
- ❌ Never use plain text: `H2O` (wrong)
- ❌ Never manually add subscripts: `H_2O` in \ce{} (wrong)

**2. Markdown Formatting:**
- **Bold:** `**Step 1:**` → **Step 1:**
- **Bullets:** `- Point` → • Point
- **Tables:** Always use `|` markdown syntax (see Rule 1.4)

**CRITICAL: Avoid Mixed Text+Equation Formatting:**
- ❌ WRONG: `Purity = $\frac{\text{pure mass}}{\text{total mass}} \times 100$` (text + equation)
- ✅ CORRECT: `$$\text{Purity} = \frac{\text{pure mass}}{\text{total mass}} \times 100$$` (full equation)
- When formulas contain fractions or complex expressions, use display math `$$...$$`
- Never mix plain text with inline equations for definitions/formulas
- Ensures consistent sizing and readability

**3. LaTeX Equation Sizing & Font (FINAL STANDARDS - Auto-Applied):**

**Unified Sizing:**
- Question text: 0.68em (inline and display)
- Options: 0.68em (inline and display)
- Solutions: 0.68em (inline and display)
- **Complete uniformity across all sections**

**Font Consistency:**
- ALL LaTeX: Inter sans-serif font
- Matches surrounding text perfectly
- No serif fonts (Computer Modern) used
- Applied automatically via CSS

**Implementation:**
- LaTeXPreview component applies inline styles for size
- CSS classes `.latex-math-inline` and `.latex-math-display` force Inter font
- `!important` flag ensures no overrides
- Works immediately without manual intervention

**4. Option Layout (Auto-Applied):**
- Short text (≤ 28 plain chars per option): 2×2 grid
- Any option with LaTeX (`$...$`) or images: vertical stack
- Any option with bold markdown stripped length > 28 chars: vertical stack
- **System automatically chooses layout — keep options concise for grid view**
- ⚠️ At 20px font size, the half-width grid column fits ~28 chars. Options like "The C–C bond in ethyne is shorter than that in ethene" (51 chars) will wrap — use list view by keeping options ≤ 28 chars plain text, or accept vertical stack.

### **Quality Checklist for AI Agents**

Before submitting questions, verify:

- [ ] All chemistry formulas use `\ce{}` command
- [ ] Step headers use `**Step N:**` format
- [ ] Key points use `- Point` bullet format
- [ ] Tables use proper markdown `|` syntax
- [ ] LaTeX math uses `$...$` for inline, `$$...$$` for display
- [ ] Difficulty mapped correctly (E/M/T → Easy/Medium/Hard)
- [ ] Chapter and tag IDs match taxonomy
- [ ] Display ID follows format: `CHAPTER-NNN`
- [ ] Solution has exactly 5 steps
- [ ] "Key Points to Remember" section included

---

## 📊 EXAMPLE TRANSFORMATIONS

### **Example 1: Mole Concept Question**

**Input (Handwritten):**
```
[M] Calculate the number of moles in 18g of water.
A) 0.5 mol
B) 1.0 mol
C) 1.5 mol
D) 2.0 mol
Answer: B
```

**Output (JSON):**
```json
{
  "_id": "uuid-here",
  "display_id": "MOLE-015",
  "question_text": {
    "markdown": "Calculate the number of moles in $18\\,\\text{g}$ of $\\ce{H2O}$ (water).",
    "latex_validated": true
  },
  "type": "SCQ",
  "options": [
    {"id": "a", "text": "$0.5\\,\\text{mol}$", "is_correct": false},
    {"id": "b", "text": "$1.0\\,\\text{mol}$", "is_correct": true},
    {"id": "c", "text": "$1.5\\,\\text{mol}$", "is_correct": false},
    {"id": "d", "text": "$2.0\\,\\text{mol}$", "is_correct": false}
  ],
  "solution": {
    "text_markdown": "**Step 1: Identify the Given Data**\n\nMass of water = $18\\,\\text{g}$\n\n**Step 2: Find Molar Mass**\n\nMolar mass of $\\ce{H2O}$ = $2(1) + 16 = 18\\,\\text{g/mol}$\n\n**Step 3: Apply Mole Formula**\n\n$$\\text{Number of moles} = \\frac{\\text{Given mass}}{\\text{Molar mass}}$$\n\n**Step 4: Calculate**\n\n$$n = \\frac{18\\,\\text{g}}{18\\,\\text{g/mol}} = 1.0\\,\\text{mol}$$\n\n**Conclusion:**\nThe number of moles in $18\\,\\text{g}$ of water is $1.0\\,\\text{mol}$.\n\n**Key Points:**\n- Molar mass of $\\ce{H2O}$ = $18\\,\\text{g/mol}$\n- $1$ mole of any substance contains Avogadro's number of particles\n- Always include units in calculations",
    "latex_validated": true
  },
  "metadata": {
    "difficulty": "Medium",
    "chapter_id": "ch11_mole",
    "tags": [{"tag_id": "tag_mole_7", "weight": 1.0}],
    "is_pyq": false,
    "is_top_pyq": false
  },
  "status": "review"
}
```

### **Example 2: Chemical Equation Question**

**Input:**
```
[E] Balance the equation: Fe + O2 → Fe2O3
A) 2Fe + 3O2 → 2Fe2O3
B) 4Fe + 3O2 → 2Fe2O3
C) 3Fe + 2O2 → Fe2O3
D) Fe + O2 → Fe2O3
Answer: B
```

**Output:**
```json
{
  "question_text": {
    "markdown": "Balance the following chemical equation:\n\n$$\\ce{Fe + O2 -> Fe2O3}$$"
  },
  "options": [
    {"id": "a", "text": "$\\ce{2Fe + 3O2 -> 2Fe2O3}$", "is_correct": false},
    {"id": "b", "text": "$\\ce{4Fe + 3O2 -> 2Fe2O3}$", "is_correct": true},
    {"id": "c", "text": "$\\ce{3Fe + 2O2 -> Fe2O3}$", "is_correct": false},
    {"id": "d", "text": "$\\ce{Fe + O2 -> Fe2O3}$", "is_correct": false}
  ],
  "solution": {
    "text_markdown": "**Step 1: Write the Unbalanced Equation**\n\n$$\\ce{Fe + O2 -> Fe2O3}$$\n\n**Step 2: Count Atoms on Each Side**\n\nReactants: Fe = 1, O = 2\nProducts: Fe = 2, O = 3\n\n**Step 3: Balance Iron (Fe) Atoms**\n\nMultiply Fe by 2 on left:\n$$\\ce{2Fe + O2 -> Fe2O3}$$\n\nBut we need 4 Fe to balance with 2 $\\ce{Fe2O3}$:\n$$\\ce{4Fe + O2 -> 2Fe2O3}$$\n\n**Step 4: Balance Oxygen (O) Atoms**\n\nRight side has $2 \\times 3 = 6$ oxygen atoms\nLeft side needs 3 $\\ce{O2}$ molecules:\n$$\\ce{4Fe + 3O2 -> 2Fe2O3}$$\n\n**Step 5: Verify**\n\nReactants: Fe = 4, O = 6\nProducts: Fe = 4, O = 6 ✓\n\n**Key Points:**\n- Always balance one element at a time\n- Balance metals first, then non-metals\n- Check your work by counting atoms on both sides"
  },
  "metadata": {
    "difficulty": "Easy",
    "chapter_id": "ch11_mole",
    "tags": [{"tag_id": "tag_mole_1", "weight": 1.0}]
  }
}
```

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **❌ Wrong:** `H2O` → **✅ Correct:** `$\\ce{H2O}$` or `$H_2O$`
2. **❌ Wrong:** `Delta H` → **✅ Correct:** `$\\Delta H$`
3. **❌ Wrong:** `x^2+3` → **✅ Correct:** `$x^2 + 3$`
4. **❌ Wrong:** `[H+]` → **✅ Correct:** `$[\\ce{H+}]$`
5. **❌ Wrong:** Single-step solution → **✅ Correct:** Minimum 3 detailed steps
6. **❌ Wrong:** "The answer is B" → **✅ Correct:** Full explanation with reasoning
7. **❌ Wrong:** Missing units → **✅ Correct:** Always include units
8. **❌ Wrong:** `\frac{}{}` → **✅ Correct:** `\frac{num}{den}` with content

---

## 🚀 QUICK START CHECKLIST

For each question, verify:
- [ ] Difficulty extracted correctly (E/M/T)
- [ ] Question text has proper LaTeX
- [ ] All chemical formulas use `\ce{}`
- [ ] Options formatted consistently
- [ ] Correct answer marked
- [ ] Solution has 3+ steps
- [ ] Solution explains WHY
- [ ] Chapter ID assigned
- [ ] Primary tag assigned
- [ ] Display ID generated
- [ ] LaTeX validated (no errors)
- [ ] Status set to "review"

---

## 📞 SUPPORT

If LaTeX validation fails:
1. Check for unmatched `$`, `{`, `}`
2. Verify `\left` has matching `\right`
3. Use `\ce{}` for all chemical formulas
4. Check for typos in command names

For taxonomy questions:
- Refer to `/app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`
- Match chapter_id exactly
- Use tag_id from chapter's tags array

---

---

## 🔧 RENDERER CAPABILITIES & KNOWN FIXES (Updated 2026-02-20)

### MathRenderer.tsx — What It Handles Automatically

| Input | Renderer Action |
|---|---|
| `^*` in math (e.g. `\sigma^*`) | Auto-converts to `^{*}` for KaTeX |
| `\ce{H2O}` | Converts to `\mathrm{H_{2}O}` |
| Pipe-table MTC with `\| \| List I \| \| List II \|` header | Renders with colspan=2 on both headers |
| Multiline `**List I:**\nA. ...\n**List II:**\nI. ...` | Converts to 4-column table |
| Inline `**List I:** A. ... **List II:** I. ...` | Converts to 4-column table |
| `![alt](url)` | Renders as fixed-width image (scale × 2px) |
| `**bold**` | Renders as `<strong>` |
| `- item` | Renders as `<ul><li>` |

### Option Grid vs List Layout

`isShortOptions()` in `BrowseView.tsx` and `TestView.tsx` decides layout:
- **Grid (2×2):** All 4 options have plain-text length ≤ 28 chars AND no LaTeX/images
- **List (vertical):** Any option exceeds 28 chars, or contains `$` or `![`
- Threshold set for 20px font size in ~220px half-width column
- Strip `**` bold markers before measuring length

---

## 🚨 CRITICAL RULES ADDED 2026-02-21 (Based on Audit Findings)

### **RULE 12: LaTeX Delimiter Standards (ENFORCED)**

The database audit of 273 questions (thermodynamics, chemical equilibrium, ionic equilibrium) found systematic LaTeX errors. These rules are now mandatory:

**1. NEVER use `$$...$$` for display math in solutions.**
- `$$...$$` is NOT reliably supported by the renderer.
- ✅ Use `$...$` for ALL math — both inline and display.
- ❌ WRONG: `$$\Delta G = \Delta H - T\Delta S$$`
- ✅ CORRECT: `$\Delta G = \Delta H - T\Delta S$`

**2. NEVER use raw Unicode arrows (`→`, `←`, `⇌`) outside math blocks.**
- ❌ WRONG: `$\Delta G < 0$ → spontaneous`
- ✅ CORRECT: `$\Delta G < 0$ $\Rightarrow$ spontaneous`
- ✅ CORRECT: `$\Delta G < 0 \Rightarrow \text{spontaneous}$`

**3. NEVER write LaTeX commands (`\rightarrow`, `\frac`, `\Delta`, etc.) outside `$...$` delimiters.**
- ❌ WRONG: `$K_P = K_C$\rightarrow$K_C = K_P$` (bare `\rightarrow` between two math blocks)
- ✅ CORRECT: `$K_P = K_C \Rightarrow K_C = K_P$` (all inside one math block)
- When connecting two math expressions with an arrow, merge them into one block.

**4. LaTeX validation checklist (run before every insertion):**
- [ ] Count `$` signs per line — must be even
- [ ] No `$$` anywhere in the document
- [ ] No Unicode `→`, `←`, `⇌` outside `$...$`
- [ ] No `\rightarrow`, `\frac`, `\Delta` etc. outside `$...$`
- [ ] All `{` have matching `}`

---

### **RULE 13: Question Text Integrity (NEVER SHORTEN)**

**The question text (`question_text.markdown`) must be reproduced EXACTLY as given — never shortened, paraphrased, or compressed.**

- ❌ WRONG: Shortening "Calculate the standard enthalpy of formation of methane given the following data..." to "Find ΔH for methane."
- ✅ CORRECT: Preserve every word, every given value, every condition from the original question.
- ❌ WRONG: Removing given data (e.g., bond energies, constants, conditions) from the question text.
- ✅ CORRECT: All given data must appear in the question text exactly as in the source.

**This rule applies even when the question text seems long. JEE questions are precise — every word matters.**

---

### **RULE 14: Solution Quality Minimums (STRICTLY ENFORCED)**

The audit found 90+ thermodynamics questions with solutions that were just the final answer (3–15 words). This is unacceptable.

**Minimum solution requirements by question type:**

| Type | Minimum words | Minimum steps | Step-by-step required? |
|---|---|---|---|
| SCQ (Single Correct) | 80 words | 3 | ✅ Yes |
| MCQ (Multi Correct) | 100 words | 3 | ✅ Yes |
| NVT (Numerical) | 60 words | 3 | ✅ Yes |
| AR (Assertion-Reason) | 80 words | 2 | ✅ Yes |
| MTC (Match Column) | 60 words | 1 per match | ✅ Yes |
| MST (Multi-Statement) | 80 words | 1 per statement | ✅ Yes |

**NVT solutions MUST show full working — not just the final number:**
- ❌ WRONG: `$\Delta G = -747$ J mol⁻¹. **Answer: 747**`
- ✅ CORRECT:
  ```
  **Step 1 — Set up ICE table:**
  Let initial moles O₃ = 1. At 50% dissociation: O₃ = 0.5, O₂ = 0.75. Total = 1.25 mol.

  **Step 2 — Calculate partial pressures:**
  $P_{\text{O}_3} = 0.5/1.25 = 0.4\,\text{atm}$, $P_{\text{O}_2} = 0.75/1.25 = 0.6\,\text{atm}$

  **Step 3 — Calculate $K_p$:**
  $K_p = \frac{(0.6)^3}{(0.4)^2} = \frac{0.216}{0.16} = 1.35$

  **Step 4 — Apply $\Delta G^\circ = -RT\ln K_p$:**
  $\Delta G^\circ = -8.3 \times 300 \times \ln 1.35 = -2490 \times 0.3 = -747\,\text{J mol}^{-1}$

  **Answer: 747**
  ```

**Solution structure template (mandatory for all types):**
```markdown
**Step 1 — [Describe what you're doing]:**
[Explanation + calculation]

**Step 2 — [Next logical step]:**
[Explanation + calculation]

**Step 3 — [Final calculation or conclusion]:**
$[\text{final equation}]$

**Answer: [value/option]**
```

---

### **RULE 15: MTC (Match The Column) Question Formatting — Table Placement**

**CRITICAL: The answer table must NEVER appear in the question text.**

The question text must show ONLY the unmatched List-I and List-II items. The matching (A→II, B→III, etc.) belongs ONLY in the solution.

**❌ WRONG question text (answer embedded):**
```markdown
Match List-I with List-II:

| List-I | List-II |
|--------|---------|
| (A) Spontaneous process | (II) ΔG < 0 |   ← WRONG: answer shown
| (B) Isothermal process  | (III) ΔT = 0 |  ← WRONG: answer shown
```

**✅ CORRECT question text (no answers):**
```markdown
Match List-I with List-II:

| | List-I | | List-II |
|---|---|---|---|
| A | Spontaneous process | I | $\Delta H < 0$ |
| B | Process with $\Delta P=0, \Delta T=0$ | II | $\Delta G_{T,P} < 0$ |
| C | $\Delta H_{\text{reaction}}$ | III | Isothermal and isobaric process |
| D | Exothermic process | IV | [Bond energies of reactants] $-$ [Bond energies of products] |
```

**✅ CORRECT solution (matching with reasoning):**
```markdown
**Step 1 — Match A (Spontaneous process):**
Spontaneous process requires $\Delta G_{T,P} < 0$. → **A → II**

**Step 2 — Match B:**
$\Delta P = 0$ (isobaric) + $\Delta T = 0$ (isothermal) → **B → III**

**Step 3 — Match C:**
$\Delta H_{\text{rxn}} = \sum \text{BE(reactants)} - \sum \text{BE(products)}$ → **C → IV**

**Step 4 — Match D:**
Exothermic: $\Delta H < 0$ → **D → I**

**Final: A-II, B-III, C-IV, D-I → Answer: Option (1)**
```

---

### **RULE 16: Audit Findings Summary (2026-02-21)**

The following systematic issues were found and fixed across 273 questions:

| Chapter | Questions | Issues Fixed |
|---|---|---|
| ch11_thermo | 137 | 21 LaTeX fixes ($$, →) |
| ch11_chem_eq | 58 | 58 LaTeX fixes (all had $$) |
| ch11_ionic_eq | 78 | 77 LaTeX fixes (all had $$) |

**Remaining known issues (require manual re-ingestion):**
- ~90 thermodynamics NVT/SCQ questions have solutions that are too short (< 30 words, no steps).
- THERMO-070: MTC answer table was in question text — **fixed 2026-02-21**.
- THERMO-071, THERMO-132: Empty options — need re-ingestion with correct option text.
- Multiple SCQ questions (THERMO-026, 028, 048, 062, etc.) have 4–9 word solutions — need expansion.

**These questions need to be re-ingested or manually edited in the admin dashboard following RULE 14.**

---

### **RULE 17: Pre-Insertion Schema Compatibility Check (MANDATORY — NEVER SKIP)**

> **Why this rule exists:** On 2026-02-21, the admin dashboard showed ZERO questions because the `display_id` regex in `lib/models/Question.v2.ts` was `^[A-Z]{4}-\d{3}$` (exactly 4 letters). Existing questions had prefixes like `THERMO` (6), `EC` (2), `PB11` (4+digit), `HC` (2). Mongoose validation rejected ALL reads, making the entire database invisible. This was a silent failure — no error was thrown, the API just returned empty arrays.

**Before writing ANY batch insertion script, run this checklist:**

#### ✅ Step 1 — Verify your `display_id` prefix matches the schema regex

Open `lib/models/Question.v2.ts` and find the `display_id` field. The current regex is:
```
/^[A-Z0-9]{2,10}-\d{3,}$/
```
Test your prefix manually:
```bash
node -e "console.log(/^[A-Z0-9]{2,10}-\d{3,}$/.test('HC-001'))"   # must print: true
node -e "console.log(/^[A-Z0-9]{2,10}-\d{3,}$/.test('THERMO-001'))" # must print: true
```
**If it prints `false` → update the regex in `Question.v2.ts` BEFORE writing any scripts.**
Also add the new prefix to the canonical prefix table in `Question.v2.ts` (lines ~147–176).

#### ✅ Step 2 — Verify `_id` uses `uuidv4()`, NOT `new ObjectId()`

Every batch script MUST use:
```javascript
const { v4: uuidv4 } = require('uuid');
// ...
_id: uuidv4(),   // ✅ CORRECT — UUID v4 string
// NOT: new ObjectId()  ← ❌ WRONG — ObjectId is not a string
```
The Mongoose model stores `_id` as `String`. Inserting an `ObjectId` creates a type mismatch that causes Mongoose `.find()` to silently skip those documents.

#### ✅ Step 3 — Verify the collection name is `questions_v2`

```javascript
const col = mongoose.connection.db.collection('questions_v2');  // ✅
// NOT: 'questions'  ← ❌ wrong collection, invisible in admin dashboard
// NOT: 'questionv2s' ← ❌ wrong collection name
```

#### ✅ Step 4 — Verify `deleted_at: null` is set explicitly

```javascript
deleted_at: null,   // ✅ REQUIRED — the API query filters { deleted_at: null }
```
Without this, the question is invisible in the admin dashboard even though it exists in MongoDB.

#### ✅ Step 5 — Verify `chapter_id` matches `taxonomyData_from_csv.ts` exactly

```javascript
// ✅ Correct examples:
chapter_id: 'ch11_hydrocarbon'   // Hydrocarbons
chapter_id: 'ch11_thermo'        // Thermodynamics
chapter_id: 'ch12_coord'         // Coordination Compounds
// ❌ Wrong:
chapter_id: 'chapter_hydrocarbons'  // old format — NOT used in questions_v2
chapter_id: 'ch11_hydrocarbon_'     // trailing underscore
```

#### ✅ Step 6 — Run a post-insertion count check

After every batch script, immediately run:
```bash
node -e "
const { MongoClient } = require('mongodb');
const URI = process.env.MONGODB_URI || 'YOUR_URI_HERE';
async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const count = await col.countDocuments({ 'metadata.chapter_id': 'CHAPTER_ID_HERE' });
  console.log('Questions in chapter:', count);
  await client.close();
}
main();
"
```
Expected count must equal (previous count + questions inserted in this batch).

#### ✅ Step 7 — Canonical batch script template (copy this exactly)

```javascript
// scripts/insert_{chapter}_b{N}.js
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const URI = process.env.MONGODB_URI;
const now = new Date();

const questions = [
  {
    _id: uuidv4(),                    // ✅ UUID v4 string — NEVER ObjectId
    metadata: {
      chapter_id: 'ch11_hydrocarbon', // ✅ must match taxonomyData_from_csv.ts exactly
      display_id: 'HC-001',           // ✅ stored here AND at top level
      question_id: 'HC-001',
      difficulty: 'Medium',
      question_type: 'SCQ',
      is_pyq: true,
      exam_source: { exam: 'JEE Main', year: 2024, month: 'January', shift: 'Morning' },
      tags: [{ tag_id: 'tag_hydrocarbon_2', weight: 1.0 }],
    },
    display_id: 'HC-001',             // ✅ top-level display_id (required by schema)
    question_text: { markdown: '...', latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '...', is_correct: false },
      { id: 'b', text: '...', is_correct: true },
      { id: 'c', text: '...', is_correct: false },
      { id: 'd', text: '...', is_correct: false },
    ],
    answer: { correct_option: 'b' },
    solution: { text_markdown: '...', latex_validated: true },
    status: 'review',
    version: 1,
    quality_score: 85,
    needs_review: false,
    created_by: 'ai_agent',
    updated_by: 'ai_agent',
    created_at: now,
    updated_at: now,
    deleted_at: null,                 // ✅ REQUIRED — must be null, not undefined
    asset_ids: [],
  },
];

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2'); // ✅ correct collection
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try {
      await col.insertOne(doc);
      console.log(`  ✅ ${doc.display_id}`);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${doc.display_id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
```

**Key differences from old template:**
- Uses `MongoClient` directly (NOT `mongoose.connect`) — avoids Mongoose schema validation on insert, which is correct for bulk AI-agent ingestion
- `_id` is `uuidv4()` string
- `deleted_at: null` is explicit
- `display_id` appears at BOTH top level AND inside `metadata`
- Collection is `questions_v2`

---

### **RULE 18: KaTeX Fraction Rendering — How It Works (2026-02-21)**

The renderer uses a custom CSS fix in `app/globals.css` to make inline fractions (`$\frac{...}{...}$`) legible. Understanding this prevents confusion during QA.

#### What KaTeX does by default
KaTeX renders inline fractions in **textstyle** mode, which shrinks the numerator and denominator to ~70% of the surrounding text size via internal `.sizing.reset-sizeN.sizeN` CSS classes. This makes fractions like $\frac{-\Delta_r G^\circ}{2.303RT}$ very small and hard to read.

#### The fix applied (globals.css)
```css
/* zoom participates in layout flow — surrounding = signs reposition correctly */
.katex .mfrac {
  zoom: 1.35;
  display: inline-block;
}
```

**Why `zoom` and not `transform: scale` or `font-size` override:**

| Approach | Problem |
|---|---|
| `font-size: 1em` on sizing spans | Enlarges glyphs but KaTeX's `vlist` `top` offsets stay at original small values → text clips into the fraction line |
| `transform: scale(1.35)` | Doesn't participate in layout flow → surrounding `=` signs overlap the fraction |
| `zoom: 1.35` ✅ | Scales the already-correctly-spaced fraction output; layout flow updates so surrounding operators reposition correctly |

#### What AI agents must do
- **Nothing.** The CSS fix is global and automatic.
- Write fractions normally: `$\frac{numerator}{denominator}$`
- Do NOT add manual spacing hacks, `\displaystyle`, or `\dfrac` to work around sizing — the CSS handles it.
- `\dfrac` is acceptable if you want display-style fractions explicitly, but is not required.

#### If fractions look wrong after a renderer change
Check `app/globals.css` around the `.katex .mfrac` rule. The `zoom: 1.35` must be present. Do not remove it.

---

### **RULE 19: Question Text Must Be Verbatim — ABSOLUTE RULE**

**The `question_text.markdown` field must reproduce the source question EXACTLY as written — word for word, value for value, condition for condition.**

This is the single most important content rule. Violations corrupt the question bank and mislead students.

#### What "verbatim" means

| Source element | Required action |
|---|---|
| Full question stem | Copy exactly — no paraphrasing |
| All given numerical values | Include every value (e.g., `R = 8.314 J K⁻¹ mol⁻¹`) |
| All given conditions | Include (e.g., `at 298 K and 1 atm`) |
| All options (A/B/C/D) | Include full option text, not abbreviated |
| Units | Include exactly as given |
| Parenthetical instructions | Include (e.g., `(Nearest integer)`, `(Round off to 2 decimal places)`) |
| Hint/given data blocks | Include all `[Given: ...]` blocks verbatim |

#### Forbidden actions

- ❌ **Shortening:** "Find ΔH for methane" instead of the full question
- ❌ **Paraphrasing:** Changing "The enthalpy of combustion of propane..." to "Combustion enthalpy of C₃H₈..."
- ❌ **Dropping given data:** Removing `R = 8.314`, bond energies, or other constants from the question text
- ❌ **Dropping conditions:** Removing "at 298 K", "at 1 bar", "assuming ideal gas"
- ❌ **Dropping parenthetical instructions:** Removing "(Nearest integer)" or "(Round off to 2 decimal places)"
- ❌ **Merging options into prose:** Rewriting option text into the question stem

#### Correct approach

When ingesting from a screenshot or markdown file:
1. Transcribe the full question stem character by character.
2. Include every `[Given: ...]` block exactly as shown.
3. Include every option exactly as shown.
4. Only convert plain-text math to LaTeX — do not change the mathematical content.
5. If unsure whether to include something, **include it**.

**This rule applies to ALL question types: SCQ, MCQ, NVT, AR, MST, MTC.**

---

### **RULE 20: Mandatory Pre-Write LaTeX Checklist — Run BEFORE Every DB Write**

> **Why this rule exists:** On 2026-02-21, a corrected solution for THERMO-036 was written to the DB with LaTeX commands (`\rightarrow`, `\frac`, `\times`, `\ln`) outside `$...$` delimiters, and plain text leaking into math blocks. The rendered output was completely broken. This checklist prevents that class of error.

**Before writing ANY question text or solution to the database, verify every line passes ALL of these:**

- [ ] Every LaTeX command (`\rightarrow`, `\frac`, `\times`, `\ln`, `\Delta`, `\log`, `\cdot`, `\text`, etc.) is inside `$...$`
- [ ] Count `$` signs per line — must be even (no unclosed delimiters)
- [ ] NO `$$...$$` anywhere — use `$...$` only (see Rule 12)
- [ ] NO raw Unicode arrows `→`, `←`, `⇌` outside `$...$` (see Rule 12)
- [ ] NO LaTeX commands leaking as plain text (e.g. `\rightarrow` written outside math)
- [ ] Plain text units like `bar·L`, `J`, `K` stay as plain text — do NOT put them inside `$...$` where they render as italic math variables
- [ ] Step headers use `**Step N — description:**` format — plain markdown bold, no LaTeX inside the header
- [ ] Bullet points use `- ` prefix — plain markdown, no LaTeX in the bullet marker itself

**If ANY check fails — fix it before writing. Do not write broken LaTeX to the DB.**

> ⚠️ **CRITICAL — Script execution method:** NEVER use `node -e "..."` inline shell strings to write LaTeX content to the DB. Shell escaping layers corrupt backslashes (`\\\\` → `\\` → `\` → lost). **ALWAYS write a `.js` script file** (e.g. `scripts/fix_chapter_NNN.js`) and run it with `node scripts/fix_chapter_NNN.js`. Print the solution string to console before the DB write to visually confirm single backslashes are present.

#### Quick reference — correct vs wrong patterns

| Wrong | Correct |
|---|---|
| `Total work: = W_{1\rightarrow2} + ...` | `Total work: $W = W_{1 \rightarrow 2} + ...$` |
| `= -20 + 20\ln 2$` (odd `$`) | `$= -20 + 20\ln 2$` |
| `$$\Delta G = \Delta H - T\Delta S$$` | `$\Delta G = \Delta H - T\Delta S$` |
| `$\Delta G < 0$ → spontaneous` | `$\Delta G < 0 \Rightarrow \text{spontaneous}$` |
| `**Isobaric ($1 \rightarrow 2$):** \*\* ...` | `**Isobaric** ($1 \rightarrow 2$): ...` |
| `$6.2$ bar·L` (units in math) | `$6.2$ bar·L` ✅ (units outside math) |

---

**Document Version:** 1.6
**Last Updated:** 2026-02-21
**Maintained By:** The Crucible Admin Team
