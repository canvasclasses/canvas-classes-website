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
   - Use `$...$` for inline math: `$H_2O$`, `$\Delta H$`
   - Use `$$...$$` for display equations (centered, large)
   - Chemical formulas: Use `\ce{}` command: `\ce{H2SO4}`, `\ce{CaCO3}`
   - Subscripts: `H_{2}O` or `H_2O` (single char doesn't need braces)
   - Superscripts: `x^{2}` or `x^2` (single char doesn't need braces)
   - Fractions: `\frac{numerator}{denominator}`
   - Greek letters: `\alpha`, `\beta`, `\Delta`, `\pi`
   - Arrows: `\rightarrow`, `\leftarrow`, `\leftrightarrow`
   - Equilibrium: `\rightleftharpoons`

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

**Exam Source (if PYQ):**
```json
{
  "exam": "JEE Main",
  "year": 2024,
  "month": "January",
  "shift": "Shift 1"
}
```

### **RULE 7: Display ID Generation**

**Format:** `{CHAPTER_CODE}-{SEQUENCE}`

**Chapter Codes:**
```
Mole Concept → MOLE-001, MOLE-002, ...
Structure of Atom → ATOM-001, ATOM-002, ...
Periodic Table → PERD-001, PERD-002, ...
Chemical Bonding → BOND-001, BOND-002, ...
Thermodynamics → THRM-001, THRM-002, ...
Equilibrium → EQUI-001, EQUI-002, ...
Solutions → SOLN-001, SOLN-002, ...
Electrochemistry → ELEC-001, ELEC-002, ...
Kinetics → KINE-001, KINE-002, ...
```

**Auto-increment:** Check existing questions in chapter and use next number.

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
- Short text (< 50 chars avg): 2×2 grid
- Images in options: 2×2 grid
- Long text (≥ 50 chars avg): Vertical stack
- A/B/C/D labels: Rounded squares outside boxes, center-aligned
- **System automatically chooses layout**

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

**Document Version:** 1.0  
**Last Updated:** 2026-02-17  
**Maintained By:** The Crucible Admin Team
