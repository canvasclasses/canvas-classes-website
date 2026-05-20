---
description: Biology Solution Workflow — NCERT-anchored explanatory solutions for the Crucible bank
---

# BIOLOGY SOLUTION WORKFLOW v1.0

> **Use this doc when writing solutions for questions already in the bank** (i.e., `questions_v2` documents created via the `BIOLOGY_QUESTION_INGESTION_WORKFLOW`). It defines the canonical 6-section solution structure for NEET biology and the per-section voice rules. Companion to `math-solution-workflow.md`, `chemistry-solution-workflow.md`, and `physics-solution-workflow.md`.

---

## 1. Philosophy — "Anchor every answer to NCERT"

NEET biology has one defining property the other subjects don't: **the answer is almost always a line from the NCERT textbook**. ~85% of NEET PYQs map verbatim or near-verbatim to NCERT prose. A great biology solution doesn't derive the answer the way a math solution derives a result — it **points to where the answer lives in NCERT** and then explains *why* that line is the answer for this particular question.

The student's takeaway should be: *"Next time I see a question about the Z-scheme, I should remember Class 11 Ch 13 page 213."* That's a fundamentally different mental loop than "next time I see a quadratic, I should complete the square."

So the voice is closer to "your bio teacher walking you through the NCERT chapter open in front of both of you" than "your math teacher deriving from first principles." Plain-English, Hinglish-friendly, tier-2 North Indian student tone — same audience as math/chem solutions, but the texture is explanation + citation, not derivation.

---

## 2. The 6-section structure

Every biology solution markdown body uses these six emoji-tagged sections in order. Don't skip sections — if a section truly doesn't apply, write a single-line "not applicable" rationale instead of omitting it. Consistency across the bank matters for the student's mental rhythm.

```markdown
### 🧠 Reading the Question

[1–3 sentences. Restate what the question is really asking. Strip away the
distractor language. If it's an assertion-reason or match-column, decode the
mapping in plain words.]

### 🖼️ Visual Anchor

[For diagram-driven questions: describe what diagram the student should picture,
and which labelled part the question is testing. For chapters like
Cell, Nephron, Heart, Embryo Sac, Alimentary Canal, ATP-synthase, this section
is non-negotiable. For pure prose-recall questions (e.g., "Who proposed the
fluid mosaic model?"), write: "_No diagram needed for this one._"]

### 📖 NCERT Reference

[The exact NCERT anchor: Class, Chapter, Page (approximate is fine), and a
verbatim quote OR close paraphrase of the line that answers the question.
Format: "**Class 11, Ch 13 "Photosynthesis in Higher Plants", Page 213.**"
followed by the quoted line in a blockquote. If the question is from
NCERT Exemplar, cite Exemplar instead.]

### 🗺️ Working It Out

[3–8 sentences explaining WHY the cited NCERT line answers this specific
question. Walk through the option elimination. Use plain English. This is
where you connect the NCERT fact to the question's framing — students often
"know the NCERT line" but fail to map it onto a tricky question stem.]

### 💡 Memory Hook

[A mnemonic, acronym, or pattern that locks the answer in. Examples:
- "**SPAS** → **S**oluble in **P**lasma, **A**lveolar, **S**aturation" for
  oxygen transport
- "**3 G's of Z-scheme**: **G**et excited, **G**ive electron, **G**et it back"
- A visual analogy ("Nephron's loop of Henle is like a U-shaped pipe with a
  desalination pump on the way down")
Skip ONLY if you can't think of a good hook — don't write filler.]

### ⚠️ Where Students Get Stuck

[1–3 common misconceptions or trap-options the question is designed to exploit.
Be specific: name which option students typically pick wrongly and why.
Example: "Most students pick (b) because they confuse Calvin cycle and Krebs
cycle — both use NADP/NAD as electron carriers, but Calvin uses NADPH and
Krebs uses NADH."]
```

---

## 3. Section-specific voice rules

### 🧠 Reading the Question

- Always start with the verb "We're being asked …" or "The question is testing …"
- For assertion-reason: state the assertion in one sentence, the reason in one sentence, then say "We need to check both, and figure out if the reason actually explains the assertion."
- For match-column: state which column has the harder identifications.

### 🖼️ Visual Anchor

- Don't reproduce the diagram in markdown — the actual figure should be attached as an asset.
- DO describe what the student should mentally visualise: "Picture the chloroplast cross-section: outer membrane, inner membrane, stroma in the middle, and stacks of green discs (grana) connected by stroma lamellae."
- Use NCERT figure numbers when citing: "see NCERT Class 11 Fig 13.4."

### 📖 NCERT Reference

- **Required for every PYQ solution.** No exceptions.
- For practice questions whose answer doesn't map to NCERT, write: "_This question goes beyond standard NCERT — the answer is rooted in [foundational principle]._"
- Use the 2023-Rationalised edition by default. If citing a pre-rationalised chapter (e.g. Transport in Plants), add: "_Note: this chapter was rationalised out of NCERT 2023 but is still in the NEET syllabus._"

### 🗺️ Working It Out

- Walk through each wrong option, not just the right one. Say *why* each distractor is wrong in 1 sentence.
- Avoid the phrase "obviously" — nothing is obvious to a student who got it wrong.
- For numerical questions (rare in biology — mostly genetics ratios, RQ values, energy yields), show the arithmetic.

### 💡 Memory Hook

- Best hooks are 3–5 words, alliterative, or rhyming.
- Avoid manufactured acronyms that the student would forget in a week. A good test: "Would I still remember this hook a month from now?"
- Existing NEET-coaching mnemonics (King-Philip-Came-Over-For-Good-Soup for taxonomy) are fine — cite the source if it's well-known.

### ⚠️ Where Students Get Stuck

- Be concrete about WHICH option is the trap. Don't write "students often confuse these" — write "students typically pick (c) because …"
- If the question is too easy to have a trap option, skip this section with: "_Straight-forward fact question — no major trap._"

---

## 4. Answer-key verification protocol (same as math)

Before writing the solution body:

1. Read the question text and the stored `correct_options` array.
2. Independently derive the answer from NCERT (don't peek at the stored answer first).
3. If your derivation matches the stored answer → write the solution.
4. If it doesn't match → **stop**. Don't write a solution that hand-waves to match a wrong stored answer. Add the question's `display_id` to `_agents/solution-flags/<PREFIX>-flags.md` with `force_flag: 'answer_mismatch'` and a one-paragraph explanation. A human resolves the conflict.

This is identical to the math workflow's force-flag rule. The principle: *we never bend physics, chemistry, math, or biology to fit a stored option that's wrong.*

---

## 5. Edge cases that flag

| Situation | Flag value |
|---|---|
| Stored answer doesn't match NCERT | `answer_mismatch` |
| Question references a figure that's missing from the assets | `image_pending` |
| Question text is corrupt or has OCR damage | `text_corrupt` |
| NCERT line doesn't actually answer the question (debatable PYQ) | `ncert_disputed` |
| Question is from a rationalised chapter and may not be in 2025+ syllabus | `legacy_rationalised_chapter` |

Flag files live at `_agents/solution-flags/<PREFIX>-flags.md` (one file per chapter prefix). A human reviews these before any flagged question goes live.

---

## 6. Tooling (same shape as math)

A biology equivalent of `scripts/math-solutions/` will be added when solution work begins. The pattern is:

- `scripts/biology-solutions/fetch-batch.js` → pulls N un-solved questions for a prefix into a local batch JSON
- (Author writes solution markdown into the batch file)
- `scripts/biology-solutions/apply-batch.js` → updates `solution.text_markdown` and related fields in `questions_v2`
- `scripts/biology-solutions/audit.js` → sanity-checks NCERT references, section completeness, no LaTeX, no missing emoji headers

Until the toolkit is built, write solutions through the admin UI's question editor at `admin.canvasclasses.in/crucible`.

---

## 7. Forbidden patterns

- **Don't author LaTeX.** Biology has no math content (genetics ratios are written as `3:1`, not `$3:1$`). The `MathRenderer` runs on every solution body, but biology solutions should never trip into it.
- **Don't fabricate NCERT line numbers.** If you can't find the exact page, omit it — don't guess. Wrong page numbers train students to distrust the citation.
- **Don't quote from coaching books** (Allen, Aakash, PW handouts) as if they were NCERT. Only NCERT and NCERT Exemplar count as primary sources.
- **Don't write multi-paragraph solutions when one paragraph would do.** Average target length: 200–400 words per solution. Genetics and biotechnology may run longer; cell biology should be shorter.
- **Don't use emoji except the six section headers.** No celebratory ✨ or ⭐ inside the body — those break the consistent rhythm.
