# Book Page Builder — Canonical Workflow

> Single source of truth for building digital book pages in the NCERT Simplified platform.
> **When building any book page, follow this document exactly.**

---

## 1. What You Are Building

A **BookPage** is a focused, self-contained lesson page inside a digital textbook.  
Each page = one section of NCERT content, transformed from dry textbook prose into an engaging, JEE/NEET-ready learning unit.

**Target reader:** Class 11–12 student preparing for JEE/NEET. Smart, busy, and slightly intimidated. They need clarity first, then depth.

---

## 2. API — How to Create a Page

```
POST http://localhost:3000/api/v2/books/ncert-simplified/pages
Content-Type: application/json
```

Required body fields:
```json
{
  "title": "Page Title",
  "subtitle": "One-line hook — what they'll understand after reading",
  "slug": "url-safe-lowercase-with-hyphens",
  "chapter_number": 1,
  "page_number": N,
  "blocks": [ ...block array... ],
  "tags": []
}
```

**`page_number`** must be the correct position for the new page. Always query existing pages first:
```bash
curl http://localhost:3000/api/v2/books/ncert-simplified/pages
```

### Inserting a page mid-sequence (CRITICAL — follow exactly)

If the new page goes between existing pages, you MUST shift the existing pages first using the
reorder endpoint before creating the new page. **Never use PUT with only metadata to shift pages —
it wipes blocks.** Use PATCH /reorder instead:

```bash
# Step 1 — shift affected pages up (highest page_number first to avoid conflicts)
curl -X PATCH http://localhost:3000/api/v2/books/ncert-simplified/pages/reorder \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"slug": "last-page-slug",   "page_number": 5},
      {"slug": "middle-page-slug", "page_number": 4},
      {"slug": "target-slug",      "page_number": 3}
    ]
  }'

# Step 2 — create the new page at the now-free position
curl -X POST http://localhost:3000/api/v2/books/ncert-simplified/pages \
  -H "Content-Type: application/json" \
  -d '{ "page_number": 2, ... }'
```

The reorder endpoint updates ONLY `page_number` and `chapter_number` — blocks and all content
are completely untouched. It is safe to use for page reordering and chapter reassignment.

**`slug`** rules: lowercase, alphanumeric, hyphens only. No underscores. No spaces. E.g. `chromatography`, `qualitative-analysis`, `quantitative-nitrogen`.

---

## 3. Block Reference — All Types

Every block has `id` (UUID v4), `type`, `order` (0-indexed).

### 3.1 `text`
```json
{
  "id": "uuid",
  "type": "text",
  "order": 0,
  "markdown": "Markdown content with **bold**, *italic*, lists, inline $LaTeX$."
}
```
- Markdown headings (`##`, `###`) are valid inside text blocks
- Use `**bold**` for key terms on first introduction
- Use numbered lists for processes, bullet lists for properties

### 3.2 `heading`
```json
{
  "id": "uuid",
  "type": "heading",
  "order": 1,
  "text": "Section Title",
  "level": 2
}
```
- `level: 2` for main sub-sections (renders as h3)
- `level: 3` for sub-sub-sections (renders as h4)
- Never use level 1 — page title already uses it

### 3.3 `callout`
```json
{
  "id": "uuid",
  "type": "callout",
  "order": 2,
  "variant": "exam_tip",
  "title": "JEE / NEET Exam Insight",
  "markdown": "Bullet-point facts relevant to competitive exams."
}
```

Variants and when to use them:
| Variant | Purpose | Placement |
|---|---|---|
| `fun_fact` | Real-life hook to open the page | Block 0 (first block) |
| `exam_tip` | JEE/NEET facts, tricky distinctions, what exams actually ask | Near end, before quiz |
| `remember` | Critical definitions or rules the student must not get wrong | After relevant explanation |
| `note` | Additional context, not examinable | Optional |
| `warning` | Common mistakes / misconceptions | Optional |

**`exam_tip` format:**
```
**Key term or question:** Explanation.

**Another key term:** Explanation.

**Classic exam question:** "..." → Answer.
```

### 3.4 `image`
```json
{
  "id": "uuid",
  "type": "image",
  "order": 3,
  "src": "",
  "alt": "Descriptive alt text for accessibility",
  "caption": "📸 Caption text describing the diagram",
  "width": "full",
  "generation_prompt": "Detailed AI image generation prompt — see Section 3.4.1 below"
}
```
- Always `width: "full"` unless explicitly told otherwise
- **`src` should be empty string `""`** when the image has not been uploaded yet
- **Always include `generation_prompt`** — this is what the user will copy into an AI image generator
- Caption always starts with `📸 `
- The renderer shows the generation prompt as a copyable placeholder when `src` is empty
- When `src` is filled with an R2 URL later, the image renders normally

### 3.4.1 Writing a good `generation_prompt`

A generation prompt should be **specific, visual, and technical**. It tells an AI image generator exactly what to draw.

Structure: `[Name] + [Spatial layout of components] + [Process arrows] + [Label list] + [Inset if useful] + [Style]`

**Template:**
```
[Technique name] apparatus diagram. [Describe each component spatially — name it, 
describe its position, and any visible internal detail]. Show arrows indicating 
[what moves where — vapour/liquid/current/flow]. Label: [Component1], [Component2], 
[Component3], [Observable result]. [Inset diagram showing [variations or related 
forms] — optional, use only when notable variants exist]. Dark background, orange 
accent labels, clean technical illustration style.
```

**Rules for each clause:**

- **Opening line:** `[Technique] apparatus diagram.` — never use "Scientific diagram of"
- **Spatial layout:** Name every component, describe its position relative to others, and call out internal detail (e.g. "beads visible", "packed with silica gel")
- **Process arrows:** Always include for dynamic processes (distillation, chromatography, extraction). Write exactly what moves and in which direction. Omit only for purely static diagrams (crystal structure, molecular model).
- **Label list:** `Label: X, Y, Z.` — list the 3–5 most important labelled parts by name
- **Inset diagram:** Add `Inset diagram showing [X, Y, Z].` when there are meaningful variants worth showing (e.g. column types, solvent systems). Skip if there are no notable variants.
- **Style:** Always end with `Dark background, orange accent labels, clean technical illustration style.` — this matches the Canvas reader theme exactly. Never use "educational poster style" or "white labels".

**Good example** (fractional distillation):
> "Fractional distillation apparatus diagram. A round-bottom flask on a heat source, with a tall fractionating column (packed column with beads visible) fitted above it, connected at the top to a condenser leading to a collection flask. Show arrows indicating vapour rising up the column and liquid falling back down. Label: Round-bottom flask, Fractionating column, Condenser, Distillate. Inset diagram showing different types of fractionating columns (Vigreux, packed, spiral). Dark background, orange accent labels, clean technical illustration style."

**Every page must have at least one image block with a generation_prompt.** Use your chemistry knowledge to decide the best visual for each concept:
- Purification techniques → apparatus setup diagram with process arrows
- Qualitative tests → test tube colour change sequence, label each tube with reagent and observation
- Quantitative estimation → multi-stage apparatus diagram with labelled collection vessels
- Formulas/calculations → do NOT generate images for these; use `latex_block` instead

### 3.5 `worked_example`
```json
{
  "id": "uuid",
  "type": "worked_example",
  "order": 4,
  "label": "Problem 12.20",
  "variant": "ncert_intext",
  "problem": "Markdown statement of the problem with $LaTeX$ as needed.",
  "solution": "Step-by-step solution in markdown.\n\n**Step 1:** ...\n\n**Step 2:** ...\n\n**Answer:** ...",
  "reveal_mode": "tap_to_reveal"
}
```
- `variant`: `"ncert_intext"` for NCERT in-text problems; `"solved_example"` for other worked examples
- `reveal_mode`: always `"tap_to_reveal"` so students attempt before seeing answer
- `problem` and `solution` support full markdown + LaTeX
- Format solution as clear numbered/bold steps, ending with boxed answer

### 3.6 `inline_quiz`
```json
{
  "id": "uuid",
  "type": "inline_quiz",
  "order": 5,
  "pass_threshold": 0.67,
  "questions": [
    {
      "id": "uuid",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 2,
      "explanation": "Why C is correct, and why the others are wrong."
    }
  ]
}
```
- Always **last block** on the page
- Minimum 2 questions, maximum 5 questions
- `pass_threshold`: 1.0 for 1 question; 0.67 for 2–3 questions; 0.6 for 4–5 questions
- `correct_index` is 0-based
- Explanation must be educational — explain the concept, not just "C is correct because C"
- Options: always exactly 4, make distractors plausible
- Questions should test understanding, not just memorisation

### 3.7 `simulation`
```json
{
  "id": "uuid",
  "type": "simulation",
  "order": 6,
  "simulation_id": "fractional-distillation",
  "title": "Descriptive title"
}
```
- Only use if a simulation component exists at `components/books/renderer/blocks/simulations/`
- `simulation_id` must match an existing component registered in `SimulationBlockRenderer.tsx`

### 3.8 `table`
```json
{
  "id": "uuid",
  "type": "table",
  "order": 7,
  "caption": "Table title",
  "headers": ["Column 1", "Column 2", "Column 3"],
  "rows": [
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
  ]
}
```
- Use for comparison data — reaction products, test results, properties side by side
- Keep tables narrow (2–4 columns)

### 3.9 `comparison_card`
```json
{
  "id": "uuid",
  "type": "comparison_card",
  "order": 8,
  "title": "X vs Y",
  "columns": [
    { "heading": "Method A", "points": ["Point 1", "Point 2"] },
    { "heading": "Method B", "points": ["Point 1", "Point 2"] }
  ]
}
```
- Use when comparing two methods/techniques — exams love "distinguish between" questions
- Max 3 columns; 3–6 points per column

### 3.10 `latex_block`
```json
{
  "id": "uuid",
  "type": "latex_block",
  "order": 9,
  "latex": "\\frac{12 \\times m_2}{44 \\times m} \\times 100",
  "label": "Equation 12.1",
  "note": "Where m = mass of compound, m₂ = mass of CO₂"
}
```
- Use for display equations — important formulas that deserve their own line
- `latex` field: raw LaTeX without `$` delimiters
- JSON escaping: `\\frac`, `\\times` (double backslash in JSON = single `\` in LaTeX)

---

## 4. Standard Page Structure

Every page should follow this flow. Adjust as needed but don't skip the hook or the exam tip.

```
Block 0:  callout[fun_fact]   ← Real-life hook. Opens curiosity.
Block 1:  text                ← Core concept: what it is, why it matters
Block 2:  heading[2]          ← Sub-section: first major part
Block 3:  text                ← Explanation with steps / mechanism
Block 4:  image               ← Diagram — ALWAYS include; src="" + generation_prompt if not yet uploaded
Block 5:  heading[2]          ← Sub-section: second major part (if exists)
Block 6:  text                ← Explanation
Block 7:  image               ← Second diagram if section warrants one
Block 8:  worked_example      ← NCERT solved example (if exists in source)
Block 9:  comparison_card     ← (optional) if two methods being compared
Block 10: callout[exam_tip]   ← JEE/NEET exam insight
Block 11: inline_quiz         ← 2–4 questions, always last
```

**Images are mandatory.** Every page must have at least one image block.  
- If no real image is available: use `src: ""` with a detailed `generation_prompt` — the renderer shows it as a copyable placeholder.
- Never omit images — they are part of the content structure.
- **If content is simple:** fewer blocks is fine, but the image block stays.
- **If no worked example exists in source:** skip it entirely.

---

## 5. Tone & Style Guide

### Voice
- **Second person:** "When you heat this mixture…", "You've probably seen…", "Think about…"
- **Conversational but accurate:** Explain like a smart tutor, not a textbook
- **Analogy first:** Always lead with a real-world analogy before the technical definition
- **No fluff:** Every sentence earns its place. Cut anything that doesn't add understanding.

### Bold text
- Bold key terms on **first use only**
- Bold important numbers or thresholds
- Bold "wrong" vs "right" distinctions in exam_tip callouts

### Lists
- Use **numbered lists** for processes that have a fixed order
- Use **bullet lists** for properties, conditions, or items without a fixed order
- Keep list items concise — one idea per bullet

### What NOT to do
- ❌ Don't start with "In this section, we will learn..."
- ❌ Don't copy NCERT prose verbatim — rephrase in simpler English
- ❌ Don't use passive voice ("It is observed that...") — use active ("You observe...")
- ❌ Don't add LaTeX for things that don't need it — `25°C` not `$25°C$`
- ❌ Don't add emoji to body text — only in image captions
- ❌ Don't fabricate NCERT content — if unsure, write NEEDS_REVIEW

---

## 6. LaTeX Rules (Book Page Context)

The renderer uses **KaTeX** with **mhchem** extension loaded. Both `$...$` (inline) and `$$...$$` (display/block) are supported. `\ce{}` works for chemical formulas.

### 6.1 Correct delimiters

| Use case | Correct | Wrong |
|---|---|---|
| Inline math in text | `$x = 5$` | bare `x = 5` |
| Display (centred) equation | `$$\frac{a}{b}$$` | do not use display for simple inline values |
| Chemical formula | `$\ce{H2SO4}$` | `H₂SO₄` (unicode) or `$H_2SO_4$` |
| Fraction | `$\frac{a}{b}$` | `$\dfrac{a}{b}$` — causes oversized render |
| Greek letters | `$\alpha$`, `$\Delta$` | `α`, `Δ` (unicode outside `$`) |
| Reaction arrow | `$\rightarrow$` | `→` (unicode outside `$`) |
| Equilibrium arrow | `$\rightleftharpoons$` | `⇌` |
| Superscript ion | `$\ce{Fe^{2+}}$` | `Fe²⁺` |
| Subscript in formula | `$\ce{CuSO4.5H2O}$` | `CuSO₄·5H₂O` |
| Reaction equation | `$\ce{A + B -> C + D}$` | raw text |

### 6.2 mhchem `\ce{}` syntax (use this for all chemistry)

```
$\ce{H2SO4}$           → H₂SO₄
$\ce{Fe^{2+}}$         → Fe²⁺
$\ce{CuSO4.5H2O}$      → CuSO₄·5H₂O
$\ce{Na + C + N -> NaCN}$    → reaction with arrow
$\ce{2Na + S ->[\Delta] Na2S}$  → with heat symbol above arrow
$\ce{CO2 + Ca(OH)2 -> CaCO3 v + H2O}$  → with precipitate arrow
$\ce{[Fe(CN)6]^{4-}}$  → complex ion
```

### 6.3 JSON string escaping

In JavaScript string literals (single or double quoted), one backslash = `\\`:
```js
// In JS string:  "$\\ce{H2O}$"   →  stored in DB as:  "$\ce{H2O}$"  ✓
// In JS string:  "$\\frac{a}{b}$"  →  stored in DB as:  "$\frac{a}{b}$"  ✓
```

**Rule:** Always use `\\` before every LaTeX command in JavaScript strings.
- `"$\\ce{H2SO4}$"` ✓
- `"$\\frac{12}{44}$"` ✓
- `"$\\Delta H$"` ✓
- `"$\\text{CO}_2$"` ✓

**Display equations in text blocks** — put `$$...$$` on its own line inside the markdown string:
```js
markdown: 'Formula:\n\n$$\\frac{12 \\times m_2}{44 \\times m} \\times 100$$\n\nwhere...'
```

### 6.4 DO NOT use unicode chemistry outside math
```
❌  "water is H₂O"          →  use "water is $\\ce{H2O}$"
❌  "ΔH = -286 kJ"          →  use "$\\Delta H = -286$ kJ"
❌  "Fe²⁺ ions"             →  use "$\\ce{Fe^{2+}}$ ions"
❌  "CO₂ is absorbed"       →  use "$\\ce{CO2}$ is absorbed"
```

### 6.5 What NOT to do
- ❌ `\dfrac` — oversized rendering, use `\frac`
- ❌ Using `\text{CO}_2` instead of `\ce{CO2}` — mhchem is available, always use `\ce{}`
- ❌ Nested `$` delimiters — every `$` must be paired
- ❌ Missing backslash-escape in JS strings — `"\ce{H2O}"` is wrong, `"\\ce{H2O}"` is right

---

## 7. Worked Examples — Extraction Rules

When the source PDF contains a "Problem X.XX" with a "Solution":

1. Extract problem statement verbatim (clean up OCR artefacts)
2. Format solution as markdown steps: `**Step 1:** ...`, `**Step 2:** ...`
3. Final answer on its own line: `**Answer:** value with units`
4. Use `label: "Problem 12.XX"` matching the NCERT numbering
5. Place the `worked_example` block immediately after the concept it illustrates

---

## 8. Qualitative Analysis Pages — Special Pattern

For Lassaigne's test and element detection pages, use this additional block types:
- `table` block for test summary (element → reagent → positive result)
- `callout[remember]` for the sodium fusion reactions

---

## 9. Quantitative Estimation Pages — Special Pattern

For pages covering carbon/hydrogen/nitrogen/halogen estimation:
- Lead with what is being measured and why
- Show the formula as a `latex_block` OR inside a `text` block
- `worked_example` block for each NCERT Problem in the section
- `comparison_card` to compare two methods (e.g. Dumas vs Kjeldahl)
- `exam_tip` must include: formula, what each symbol means, and typical exam calculation trap

---

## 10. Page Inventory — Practical Organic Chemistry Chapter

| # | Slug | Title | Source Section | Status |
|---|------|--------|----------------|--------|
| 1 | sublimation | Sublimation | 12.8.1 | ✅ Done |
| 2 | crystallisation | Crystallisation | 12.8.2 | ✅ Done |
| 3 | distillation-basics | Distillation | 12.8.3 | ✅ Done |
| 4 | fractional-distillation | Fractional Distillation | 12.8.3 | ✅ Done |
| 5 | distillation-special-techniques | Special Distillation Techniques | 12.8.3 | ✅ Done |
| 6 | differential-extraction | Differential Extraction | 12.8.4 | ✅ Done |
| 7 | chromatography | Chromatography | 12.8.5 | ⬜ Next |
| 8 | qualitative-analysis | Qualitative Analysis | 12.9–12.9.2 | ⬜ |
| 9 | quantitative-ch | Estimation of C & H | 12.10.1 | ⬜ |
| 10 | quantitative-nitrogen | Estimation of Nitrogen | 12.10.2 | ⬜ |
| 11 | quantitative-halogens-sulphur | Estimation of Halogens & Sulphur | 12.10.3–12.10.4 | ⬜ |
| 12 | quantitative-phosphorus-oxygen | Estimation of P & O | 12.10.5–12.10.6 | ⬜ |

---

## 11. Anti-Hallucination Rule

> Before writing any chemistry content, quote the exact NCERT source text (or confirm from PDF extraction) for every factual claim. If you cannot verify a fact from the source, write `NEEDS_REVIEW: [reason]`.
>
> Never invent reactions, test results, reagent names, or numerical values. All chemistry must come from the source PDF or verified NCERT Class 11 Chemistry content.
