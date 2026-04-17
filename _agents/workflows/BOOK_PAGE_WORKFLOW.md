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

#### 3.1.1 Inline images inside a text block

Text blocks can embed inline images using extended markdown syntax. Use these when a paragraph needs a visual **alongside** the prose — a photo, a small apparatus detail, a labelled close-up. For the **main** diagram of a concept, keep using a standalone `image` block (§3.4).

**Syntax:**
```
![alt text](src "position|caption")
```

**Position values:**

| Position | Behaviour |
|---|---|
| *(omitted)* | Full-width block, stands alone |
| `right` | Floats right, text wraps left (default for side visuals) |
| `left` | Floats left, text wraps right |
| `right-sm` / `left-sm` | Narrower float (~¼ column width) |
| `center-half` | Centred block at half width |

On mobile (< md) all floats collapse to full-width stacks.

**Rule — every inline image must ship with a generation prompt.** When you decide a paragraph warrants an inline image and the image has not yet been uploaded:

1. Write the inline markdown with a meaningful `alt`, a chosen `position`, and an optional caption
2. Set `src` to a placeholder of the form `PENDING:<short-slug>` (e.g. `PENDING:rust-flake`)
3. Append an `IMAGE_GENERATION_PROMPTS` HTML comment at the **end** of the text block's markdown that lists every pending slug with a full prompt using the §3.4.1 template

**Example inside a text block's `markdown`:**
```
Rust is not just discolouration — it actively eats the iron beneath.
![red-brown rust on an iron nail](PENDING:rust-flake "right|Rust flakes, exposing fresh metal")
Over weeks the oxide layer flakes off, exposing fresh iron to the air — so the attack never stops.

<!--
IMAGE_GENERATION_PROMPTS:
PENDING:rust-flake — Close-up macro photograph of red-brown rust flakes on the surface of an iron nail. Visible texture of cracked, peeling iron oxide layered over metal. Natural side lighting, shallow depth of field. Dark neutral background, crisp focus, editorial photography style.
-->
```

The §3.4.1 quality bar applies equally to inline prompts. Never write vague prompts like `diagram of rust` — be specific, visual, and technical. The agent that writes the paragraph owns both the text **and** the image spec.

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

### 3.11 `curiosity_prompt`

Open-ended curiosity hook. **Block 0 on Class 9 pages.** Primes the student's thinking before the concept is introduced — zero prior knowledge required. There is no "correct answer", no MCQ, no grading. It sets a scene and asks the student to wonder.

```json
{
  "id": "uuid",
  "type": "curiosity_prompt",
  "order": 0,
  "prompt": "Look at a glass of tap water. Do you think you're drinking pure H₂O — or something else? What's actually in there?",
  "hint": "Optional — one short line to nudge thinking if the student is stuck.",
  "reveal": "Optional — a short teacher-voice reflection shown after tapping 'Show reflection'. Frame it as 'here's what's interesting about this question', not 'here's the answer'."
}
```

**Rules:**
- **No `options` array.** `curiosity_prompt` is never an MCQ. For MCQ-style reasoning, use `reasoning_prompt` (§4B), placed mid-page after the concept is introduced.
- The `prompt` must be ponderable by a 9th grader with **zero prior knowledge** of the page's topic. If the student needs definitions first, the question belongs in `reasoning_prompt`, not here.
- `reveal` is optional. Use it only when a short reflection genuinely adds something; otherwise the act of wondering is the whole point.
- **Only ever used at Block 0.** Never place a `curiosity_prompt` mid-page.
- Class 11–12 pages do not use `curiosity_prompt` — they open with a `callout[fun_fact]` directly.

---

## 4. Standard Page Structure

### 4A. Class 11–12 (JEE / NEET) — Default Template

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

### 4B. Class 9 — Reasoning-Embedded Template

Class 9 pages embed reasoning development into the content itself — but reasoning tasks must be placed where the student has the tools to actually reason, not dropped on them cold.

**Two reasoning block types, two different jobs:**
- `curiosity_prompt` (Block 0) — open-ended wonder. No MCQ, no prior knowledge required. Primes curiosity.
- `reasoning_prompt` (mid-page) — Application-level MCQ. Placed **after** the concept is introduced, so the student has definitions and mechanisms to apply.

```
Block 0:  curiosity_prompt    ← Open-ended hook (no MCQ, no wrong answer) — primes curiosity
Block 1:  callout[fun_fact]   ← Real-life anchor
Block 2:  text                ← Core concept introduction (definitions, what it IS)
Block 3:  heading[2]          ← Sub-section: first major part
Block 4:  text                ← Explanation / mechanism
Block 5:  reasoning_prompt    ← Application-level MCQ — student now has tools to reason with
Block 6:  image               ← Diagram (mandatory; src="" + generation_prompt)
Block 7:  simulation          ← With prediction challenge (where meaningful)
Block 8:  text                ← Deeper explanation / what the sim reveals
Block 9:  worked_example      ← NCERT solved example (if exists)
Block 10: callout[exam_tip]   ← Board exam insight (CBSE Class 9 — NOT JEE/NEET)
Block 11: inline_quiz         ← 3 questions: 1 recall + 1 application + 1 reasoning (always last)
```

#### curiosity_prompt — Block 0 rules

See §3.11 for the full block schema. Key constraints:
- **Answerable with zero prior knowledge** of the page's topic. If the student must know definitions first, the question belongs in `reasoning_prompt` instead.
- Open-ended tone, no options, no graded commit.
- One per page, always at `order: 0`.

#### reasoning_prompt — Class 9 rules

```json
{
  "id": "uuid",
  "type": "reasoning_prompt",
  "order": 5,
  "reasoning_type": "logical",
  "prompt": "You mix iron filings with sulfur powder. One classmate says the result is a compound of iron and sulfur. Another says it's just a mixture. Without doing any experiment, how would you decide who is right?",
  "options": [
    "The first classmate is right — combining any two substances always makes a compound",
    "You need to test whether the properties changed — a mixture keeps the individual properties of its components, while a compound has entirely new properties",
    "The second classmate is right — mixing never forms compounds under any condition",
    "You need a microscope to see whether the particles combined"
  ],
  "reveal": "A mixture retains the properties of its components — iron is still magnetic, sulfur still yellow and brittle. A compound has new properties — iron sulfide (FeS) is black, non-magnetic, and doesn't behave like either element. The answer isn't in the act of mixing; it's in what changed.",
  "difficulty_level": 2
}
```

**Placement rule — never skip.** A `reasoning_prompt` must appear **after** the text block(s) that introduce every concept the student needs to answer it. Test your placement: read the blocks above your `reasoning_prompt` as if you know nothing else. If you cannot answer the prompt from what's above, move the prompt later.

- ❌ **Never Block 0.** A reasoning MCQ before any content is a coin flip, not reasoning.
- ❌ **Never right after `curiosity_prompt` and `fun_fact`** — the student still has no concepts to apply.
- ✅ **After the first or second `text` block** that defines the concept — the student now has the vocabulary and mechanism to reason with.
- ✅ **Maximum one per page.** If a page has two distinct concepts that each warrant a reasoning check, place two `reasoning_prompt` blocks, each after its relevant concept.

**reasoning_type values and when to use:**
| Type | Use when | Example |
|---|---|---|
| `logical` | If-then relationships, cause and effect, identifying flawed reasoning | "If X, does Y always follow?" |
| `spatial` | Spatial relationships, diagrams, geometry, structures | "What shape will the shadow be?" |
| `quantitative` | Reasoning with numbers — NOT calculation, but estimation / plausibility | "Which is larger, and by roughly how much?" |
| `analogical` | Structural similarities between different domains | "How is this like a [different system]?" |

**difficulty_level guide for Class 9:**
- Level 1 (Comprehension): Recall a fact and state it. Minimum bar.
- Level 2 (Application): Apply a concept to a new but similar situation.
- Level 3 (Analysis): Break down a scenario, identify what is and isn't true.
- Level 4 (Evaluation): Evaluate a claim, identify the flaw, or construct a counter-argument.
- Level 5 (Pattern/Analogy): Identify a structural similarity across domains. Use sparingly.

Start with Level 2 on most pages. Level 3 when the concept naturally produces a testable prediction. Reserve Level 4–5 for chapters where the concept is well established and the student has had practice.

#### inline_quiz — Class 9 question mix

The final quiz on every Class 9 page must have exactly 3 questions in this order:
1. **Recall** (Level 1) — confirms the student read the page
2. **Application** (Level 2) — applies the concept to a new scenario
3. **Reasoning** (Level 3) — requires the student to think, not remember

Tag each question with `reasoning_level` for analytics:
```json
{ "id": "uuid", "question": "...", "options": [...], "correct_index": 0, "explanation": "...", "reasoning_level": 1 }
```

#### simulation prediction — when to use

Add `prediction` to a simulation block only when:
- There is a non-obvious outcome that the student can meaningfully predict
- The prediction has a concrete, observable answer in the simulation
- Getting it wrong teaches something (not just a trivial guess)

Do NOT add prediction to exploratory simulations (e.g., sliders that just visualise a formula).

```json
{
  "id": "uuid",
  "type": "simulation",
  "order": 6,
  "simulation_id": "free-fall-gravity",
  "title": "Free Fall Simulator",
  "prediction": {
    "prompt": "A 1 kg ball and a 10 kg ball are dropped from the same height at the same time. Which lands first?",
    "options": ["The 10 kg ball lands first", "The 1 kg ball lands first", "Both land at exactly the same time"],
    "reveal_after": "Both balls land at the same time. Gravitational acceleration (g = 9.8 m/s²) is independent of mass — every object in free fall accelerates identically. The only reason a feather falls slower on Earth is air resistance, not gravity. On the Moon, with no atmosphere, a feather and a hammer fall together."
  }
}
```

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

---

## 12. Hinglish Authoring — Class 9 Pages

Class 9 pages ship with a parallel `hinglish_blocks` array so the student can toggle between English and Hinglish. The target reader is a North Indian 9th grader (Himachal / Uttarakhand / Punjab belt) in an English-medium school who doesn't fully follow academic English and otherwise defaults to rote learning.

**What gets a Hinglish version:** only `text`-type blocks. Everything else (`heading`, `callout`, `image`, `worked_example`, `inline_quiz`, `timeline`, `table`, `comparison_card`, `simulation`, `reasoning_prompt`) renders in English in both modes.

### 12.1 The Core Rule — Re-explain, Do Not Translate

This is the most important rule in this section. Read it twice.

> **Close the English version mentally. Read it once for the concept only. Then re-explain that concept from scratch as a Hindi-medium teacher would — in your own sentence structure, your own rhythm, your own idioms.**

Translation keeps English clause structure, em-dash placement, and rhetorical patterns while swapping words. The result is Hinglish that *sounds like translated English*, not like a teacher actually talking. That is the failure mode to avoid.

Signs you've slipped into translation mode:
- Your Hinglish sentence has the same number of clauses, in the same order, as the English.
- You used an em-dash in the exact spot the English did.
- You translated a word literally when a well-known Hindi idiom would land better.
- Your closing line is a word-for-word mirror of the English closing line.

Signs you're re-explaining:
- Your Hinglish has more short sentences than the English did.
- You used idioms (*ratta maarna*, *dimaag lagao*) the English didn't contain.
- You reordered — started the paragraph with a different sentence than the English did, because Hindi rhythm wants it that way.
- A Hindi reader would read it and think "yes, this is how my teacher would say it," not "this is translated from English."

### 12.2 Voice — Pick One Teacher and Stay There

Imagine a single specific teacher — e.g. a Sharma sir, 40, teaches Science to a Class 9 section in Dehradun, explains things with scene-building and the occasional *zara socho*. Every Hinglish block on a page comes from that one voice.

**Do not oscillate** between:
- Formal literary Hindi (*vigyan ek prakriya hai*) and casual chat (*science basically ek process hai*) within the same page
- Second-person affectionate (*tum*) and lecturer-mode (*aap*)
- English-heavy (*scientists ne observe kiya*) and Hindi-heavy (*vaigyanikon ne avlokan kiya*) within the same paragraph

Pick the register and hold it across the whole page. The default register for this book:
- Second person **tum** (never aap, never tu)
- Common English words stay English: *scientist, theory, experiment, atom, hypothesis, result, strategy, question, course, skill, level*
- Hindi carries emotional weight and action verbs: *ruk ke poochha, baith gaya, haath kaanp gaye, samajh aa gayi, chhod diya*
- Sanskrit-origin Hindi only when the concept demands it: *dharma, gyaan-parampara, prakriti, parmanu* — and only with a short gloss if it's technical

### 12.3 Subheadings Stay in English

Bold subheadings inside a text block — anything written as `**Title.**` at the start of a section — are **kept in the original English**, exactly as written, even in Hinglish mode. They render in the accent colour and serve as visual anchors; a Hinglish version would be inconsistent across pages and loses the visual rhythm.

Only the prose paragraphs under each subheading are rewritten in Hinglish.

Example from page 1:
```
**The battlefield was silent.**        ← stays in English

Zara scene dekho. Kurukshetra ka       ← prose is Hinglish
maidan. Do foujein aamne-saamne...
```

### 12.4 Cultural Idiom Library

Use these instead of their direct translations. They land as "the way a teacher actually talks."

| Concept | Use this | Not this |
|---|---|---|
| Memorise / rote-learn | **ratta maarna** | yaad karna |
| Think hard / apply your mind | **dimaag lagao** | socho |
| Consider for a second | **zara socho** | ek minute socho |
| Straight up / honestly | **seedhi baat** | sachchi baat |
| Just this much / that's it | **bas itni si baat hai** | yeh hi baat hai |
| Got it? / Does it click? | **samajh aaya?** | samjhe? |
| Stick with it / hold on to it | **tike rehna / ade rehna** | rahna / ruka rehna |
| Quick dismissal | **"chhodo, pata nahi"** | "mujhe nahi maloom" |
| Pretending to know | **drama kar leta** | dikhawa karta |
| Scene-set opener | **zara scene dekho** | dekhiye / imagine karo |
| First stirring / opening | **pehli aahat** | shuruaat |
| A quick easy answer | **jhatpat-sa jawaab** | turant uttar |
| Nothing special about it | **isme kya baat hai** | koi baat nahi |

Add to this list as patterns repeat. Don't force an idiom where it doesn't fit — but when a concept has one of these natural Hinglish forms, use it.

### 12.5 Preserve the Conceptually Important Phrases

Some English phrases carry the actual point of the paragraph. If you drop them, the paragraph becomes a summary instead of an explanation. Before you finalise a Hinglish paragraph, check:

1. **What's the one thing this paragraph teaches?**
2. **Is that thing still explicit in my Hinglish version, or did I compress it away?**

Example from page 1, Marie Curie sentence:

> **English:** "Marie Curie asked *'what is this strange radiation?'* **rather than setting it aside as unexplained.**"

The bold half is the whole lesson — the *courage to not move on*. A translated version that said *"Marie Curie ne poochha 'yeh strange radiation kya hai?' aur matter ki samajh badal di"* would lose it.

Correct version:
> *"Marie Curie ne ek ajeeb sa radiation dekha. Usko 'pata nahi kya hai, chhodo' bol ke aage nahi badhi. Usne poochha 'yeh hai kya cheez?' — aur matter ki poori samajh hi badal di."*

The *"chhodo, pata nahi bol ke aage nahi badhi"* line is how you carry the concept into Hinglish rhythm.

### 12.6 Closing Lines — Engineer for Hinglish Rhythm

The last line of a block lands hardest. Do not translate it; design it separately.

- English closing lines lean on parallel structure: *"You are not here to memorise the answers. You are here to learn how to ask."*
- Hinglish closing lines lean on clipped rhythm and a small emotional turn: *"Tum yahaan facts ratta maarne nahi aaye ho. Tum yahaan seekhne aaye ho ki sawaal kaise poochha jaata hai."*

A good closing line test: read your closing Hinglish sentence aloud. If it sounds like a textbook paraphrase, rewrite. If it sounds like how a teacher ends a thought before moving on, keep it.

### 12.7 Sentence Structure — De-mirror the English

- **Break long English compound sentences into two or three short Hindi sentences.** Hindi rhythm prefers short. "When Newton asked why the apple falls rather than simply accepting it does, he was doing what Arjuna did." → four short sentences in Hinglish.
- **Use em-dashes sparingly.** English prose uses them for pace; Hindi prose uses commas and fresh sentences.
- **Vary openers.** If the English paragraph opens with a noun phrase, try opening the Hinglish with a verb or a scene-set: *"Zara scene dekho..."*, *"Duniya ke jitne bhi bade thinkers..."*, *"Arjuna ko ladna aata tha."*
- **Preserve italic emphasis** — when English uses `*italic*` for a quoted thought or question, keep it italic in the Hinglish too.

### 12.8 Gita Shlok — Three-Part Format

When a page opens with a `fun_fact` callout containing a Gita verse (or any verse from Indian knowledge tradition), the markdown must have **three parts in this order**:

```
Sanskrit verse (Devanagari, italic)

Hindi rendering in Devanagari — simpler, conversational words a 9th grader
actually uses. Not literary Hindi. Not Sanskritised. If the Sanskrit word
has an everyday Hindi equivalent, use it.

English translation — a tight 1–2 sentence rendering focused on the idea,
not a word-for-word equivalent.
```

This block is the same in English and Hinglish mode — callouts do not get Hinglish versions. The Hindi line is written once, carefully, for the 9th grader reader.

Bad Hindi line (too literary):
> *"Yogasthaḥ kuru karmāṇi — yoga mein sthit hokar samatā-bhāv se karma karo."*

Good Hindi line (everyday words):
> *"Kaam mann laga ke karo, par result ki chinta chhod do — yahi yoga hai."*

### 12.9 Authoring Checklist — Run Before Saving

Before committing a Hinglish block, check every item:

- [ ] Same `id` as the English TextBlock (renderer matches on id)
- [ ] `type: "text"` and same `order` as the English block
- [ ] Every `**bold subheading**` is identical to the English — not translated
- [ ] Inline LaTeX / `\ce{}` formulas preserved exactly
- [ ] Italic quotes (`*...*`) preserved where they appear in English
- [ ] I closed the English mentally and re-explained, not substituted words
- [ ] Voice is one consistent teacher across the whole page
- [ ] At least one cultural idiom from §12.4 appears naturally in each paragraph
- [ ] The conceptually important phrase (§12.5) is still explicit, not compressed away
- [ ] Closing line is engineered, not translated
- [ ] Read aloud — sounds like a teacher, not a translated textbook

### 12.10 Reference Implementation

The authoritative example is page 1 of Chapter 0 of NCERT Class 9 Science — `what-is-science`. Both text blocks (`0e4f59ae-…` and `22fd127d-…`) are the proof-of-concept. When in doubt, open that page and read the Hinglish alongside the English to calibrate.
