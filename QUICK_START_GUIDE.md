# 🚀 QUICK START: Adding Questions to The Crucible

## 📸 Your Workflow: Handwritten Questions → Database

### **Step 1: Prepare Your Questions**

Take photos of your handwritten questions with:
- ✅ Difficulty marker (E/M/T) on the left
- ✅ Question text clearly written
- ✅ Options A, B, C, D
- ✅ Answer marked
- ✅ Solution (if available)

### **Step 2: Use AI Agent with This Prompt**

```
I have a handwritten chemistry question image. Please extract and format it for The Crucible database following these rules:

EXTRACTION RULES:
1. Extract difficulty: E→Easy, M→Medium, T→Hard
2. Convert all chemical formulas to LaTeX using \ce{}: H2O → \ce{H2O}
3. Convert all math to LaTeX: x^2 → $x^2$, fractions → $\frac{a}{b}$
4. Format options as A, B, C, D with LaTeX
5. Identify correct answer
6. If solution exists, extract it. If not, generate a 5-step detailed solution

SOLUTION REQUIREMENTS (if generating):
- Minimum 5 steps with clear titles
- Explain WHY, not just WHAT
- Include all calculations with units
- Use display math $$...$$ for key equations
- Add "Key Points to Remember" section
- Minimum 150 words for Medium/Hard questions

OUTPUT FORMAT:
Return a JSON object ready for MongoDB insertion following the schema in QUESTION_INGESTION_WORKFLOW.md

VALIDATION:
- All $ delimiters must be matched
- All { } must be matched
- All chemical formulas use \ce{}
- No spaces at $ boundaries
- Verify LaTeX renders correctly
```

### **Step 3: Review in Admin Dashboard**

1. Go to `/crucible/admin`
2. Click "Add Question"
3. Paste the AI-generated data
4. **Check LaTeX validation** - Red errors will show automatically
5. Preview the question
6. Assign chapter and tag
7. Save as "review" status

### **Step 4: Quality Check**

Before publishing:
- [ ] LaTeX renders without errors (green checkmark)
- [ ] All chemical formulas use `\ce{}`
- [ ] Solution has 5+ steps
- [ ] Solution explains WHY
- [ ] Chapter and tag assigned
- [ ] Difficulty matches complexity

---

## 🎨 FONT SPECIFICATIONS

### **Question Display:**
```css
Font: Inter / SF Pro Display (system font)
Size: 18px
Line Height: 1.75
Weight: 400 (Regular)
Color: #E5E7EB (Light gray)
```

### **Solution Display:**
```css
Font: Kalam (handwritten style)
Size: 17px
Line Height: 1.8
Weight: 400 (Regular)
Color: #D1D5DB (Softer gray)
```

### **Math/LaTeX:**
```
Font: Computer Modern (KaTeX default)
Professional mathematical typesetting
```

---

## 📝 EXAMPLE: Complete Workflow

### **Input (Your Handwritten Question):**
```
[M] Calculate the pH of 0.01 M HCl solution.
A) 1
B) 2
C) 3
D) 4
Answer: B
```

### **AI Agent Prompt:**
```
Extract this question following The Crucible rules. Generate a detailed solution since none is provided.
```

### **AI Output (JSON):**
```json
{
  "question_text": {
    "markdown": "Calculate the pH of $0.01\\,\\text{M}$ $\\ce{HCl}$ solution.",
    "latex_validated": true
  },
  "type": "SCQ",
  "options": [
    {"id": "a", "text": "$1$", "is_correct": false},
    {"id": "b", "text": "$2$", "is_correct": true},
    {"id": "c", "text": "$3$", "is_correct": false},
    {"id": "d", "text": "$4$", "is_correct": false}
  ],
  "solution": {
    "text_markdown": "**Step 1: Identify the Type of Acid**\n\n$\\ce{HCl}$ is a strong acid that completely dissociates in water:\n$$\\ce{HCl -> H+ + Cl-}$$\n\n**Step 2: Determine [H+] Concentration**\n\nSince $\\ce{HCl}$ completely dissociates:\n$$[\\ce{H+}] = [\\ce{HCl}] = 0.01\\,\\text{M} = 10^{-2}\\,\\text{M}$$\n\n**Step 3: Apply pH Formula**\n\nThe pH is defined as:\n$$\\text{pH} = -\\log[\\ce{H+}]$$\n\n**Step 4: Calculate pH**\n\n$$\\text{pH} = -\\log(10^{-2}) = -(-2) = 2$$\n\n**Step 5: Verify the Answer**\n\n- Strong acid with concentration $10^{-2}\\,\\text{M}$ gives pH = 2 ✓\n- pH < 7 confirms acidic nature ✓\n- Answer matches option B ✓\n\n**Conclusion:**\n\nThe pH of $0.01\\,\\text{M}$ $\\ce{HCl}$ solution is **2**.\n\n**Key Points to Remember:**\n- Strong acids completely dissociate in water\n- For strong acids: $[\\ce{H+}] = [\\text{Acid}]$\n- pH = $-\\log[\\ce{H+}]$\n- Lower pH means higher acidity\n- For $10^{-n}\\,\\text{M}$ strong acid, pH = $n$",
    "latex_validated": true
  },
  "metadata": {
    "difficulty": "Medium",
    "chapter_id": "ch11_ionic_eq",
    "tags": [{"tag_id": "tag_ionic_eq_4", "weight": 1.0}],
    "is_pyq": false,
    "is_top_pyq": false
  },
  "status": "review"
}
```

### **Admin Dashboard Actions:**
1. Click "Add Question"
2. System auto-validates LaTeX → Shows green checkmark ✓
3. Assign chapter: "Ionic Equilibrium"
4. Assign tag: "pH Calculation (Acids/Bases)"
5. Generate display_id: "IONI-042"
6. Click "Save" → Status: "review"
7. After verification → Change status to "published"

---

## 🤖 RECOMMENDED AI AGENT CONFIGURATION

### **For Less Intelligent Agents (GPT-3.5, Claude Instant):**

Use this **strict template prompt**:

```
You are a question formatter for The Crucible chemistry database.

INPUT: [Paste handwritten question image or text]

FOLLOW THESE RULES EXACTLY:
1. Extract difficulty: E=Easy, M=Medium, T=Hard
2. Convert ALL chemistry formulas to \ce{}: H2O → \ce{H2O}
3. Convert ALL math to LaTeX: x^2 → $x^2$
4. If solution missing, generate using this structure:
   - Step 1: Understand the Problem
   - Step 2: Identify Key Concepts  
   - Step 3: Apply the Concept
   - Step 4: Calculate/Derive
   - Step 5: Conclusion
   - Key Points to Remember (3 points)
5. Minimum 150 words for Medium/Hard solutions

OUTPUT: Valid JSON matching the schema

VALIDATION CHECKLIST:
- [ ] All $ matched (even count per line)
- [ ] All { } matched
- [ ] Chemical formulas use \ce{}
- [ ] Solution has 5+ steps
- [ ] Includes Key Points section
```

### **For Advanced Agents (GPT-4, Claude Opus):**

Use this **flexible prompt**:

```
Extract and format this chemistry question for The Crucible following QUESTION_INGESTION_WORKFLOW.md rules.

Generate a high-quality, pedagogical solution if missing. Focus on:
- Clear step-by-step reasoning
- Proper LaTeX formatting (\ce{} for chemistry)
- Explaining WHY each step is taken
- Including Key Points for retention

Output: MongoDB-ready JSON with validated LaTeX.
```

---

## ⚡ BULK IMPORT WORKFLOW

For adding 100+ questions efficiently:

### **Option 1: Batch Processing Script**

```bash
# Process folder of images
node scripts/batch_import_questions.js --folder ./handwritten_questions --auto-generate-solutions
```

### **Option 2: CSV Import**

Create CSV with columns:
```
difficulty,question_text,option_a,option_b,option_c,option_d,correct_answer,solution,chapter_id
M,"Calculate pH of 0.01M HCl","1","2","3","4","B","","ch11_ionic_eq"
```

Then import:
```bash
node scripts/import_from_csv.js --file questions.csv --generate-missing-solutions
```

### **Option 3: API Endpoint**

```javascript
// POST /api/v2/questions/bulk
fetch('/api/v2/questions/bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    questions: [/* array of question objects */],
    auto_generate_solutions: true,
    validate_latex: true
  })
});
```

---

## 🎯 QUALITY METRICS

Track these metrics for each batch:

- **LaTeX Validation Rate:** Target 100%
- **Solution Quality Score:** Target 85+
- **Average Steps per Solution:** Target 5+
- **Average Word Count:** Target 150+ for Medium/Hard
- **Chapter Assignment Rate:** Target 100%
- **Tag Assignment Rate:** Target 100%

---

## 🔧 TROUBLESHOOTING

### **LaTeX Errors:**

| Error | Fix |
|-------|-----|
| Unmatched $ | Count $ signs, must be even per line |
| Unmatched { } | Check all \frac{}{}, \ce{}, etc. |
| Missing \ce{} | All chemical formulas need \ce{} |
| Double backslash | Use single \ for commands |

### **Solution Quality Issues:**

| Issue | Fix |
|-------|-----|
| Too short | Add more explanation, target 150+ words |
| Missing steps | Break into 5+ clear steps |
| No reasoning | Add WHY explanations, not just calculations |
| No Key Points | Add 3-5 takeaway points at end |

---

## 📞 SUPPORT RESOURCES

- **Full Workflow:** `/QUESTION_INGESTION_WORKFLOW.md`
- **LaTeX Guide:** `/docs/LATEX_GUIDE.md`
- **Taxonomy Reference:** `/app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`
- **Admin Dashboard:** `/crucible/admin`
- **API Docs:** `/docs/API.md`

---

**Ready to start?** Take a photo of your first question and use the AI agent prompt above! 🚀
