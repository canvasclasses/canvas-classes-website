---
name: math-solution-writer
description: Generate teacher-style pedagogical solutions for math questions already in the Crucible bank (`questions_v2` collection). Enforces the canonical math-solution-workflow — the "starting it right" philosophy, the 6-section structure (🧠 Reading the Question, 🖼️ Visual Sketch, 🗺️ Working It Out, ⚡ The Smart Move, 💡 A Different Angle, ⚠️ Where Students Get Stuck), plain-English voice for tier-2/3 town students, option-independent shortcuts, and the answer-key verification protocol with force-flag rules for inconsistent questions. Uses the `scripts/math-solutions/` toolkit (`fetch-batch.js` → write batch file → `apply-batch.js` → `audit.js`) which is pre-approved in `.claude/settings.local.json` so no permission prompts fire. Trigger when the user says "write solutions for [chapter]", "generate math solutions", "do the next N solutions", "refine solutions for STLN/CRCL/PRBL/etc.", "continue the math chapter", "complete the chapter solutions", "next batch of solutions", or mentions any math chapter prefix (STLN, CRCL, PRBL, QUAD, CMPL, MTRX, LIMS, DIFF, DFIN, PROB, TRRI, VCAL, TDGM, …) in a solution-writing context. Skip for: question ingestion (use the question-ingester skill instead), chemistry / physics solution writing (use chemistry-solution-workflow.md / physics-solution-workflow.md respectively), single-question hand-edits via the admin UI, or anything other than batched solution generation for math chapters in `questions_v2`.
---

# Math Solution Writer

You are writing solutions for math questions that already exist in `questions_v2`. **The canonical ruleset is [`_agents/workflows/math-solution-workflow.md`](../../../_agents/workflows/math-solution-workflow.md). Read it end-to-end before writing your first solution.** It contains the philosophy, the 6-section structure, the plain-English voice rules, the worked example, and the answer-verification policy. When anything below conflicts with the workflow doc, the workflow doc wins.

This skill is the **operational** layer: how to fetch a batch, write the batch file, apply it, and audit at the end. The rules for **what** to write live in the workflow doc.

## STEP 0 — Read these two files before doing anything

1. **[`_agents/workflows/math-solution-workflow.md`](../../../_agents/workflows/math-solution-workflow.md)** — the rules and the worked example. The worked example shows exactly what a complete solution looks like; study it carefully before writing your own.
2. **[`scripts/math-solutions/README.md`](../../../scripts/math-solutions/README.md)** — the toolkit and per-batch flow.

If you skip step 0 your solutions will drift from the established style. The 15 STLN-001..016 solutions in the bank were written under the latest workflow — `STLN-001`, `STLN-009`, `STLN-015` are good reference exemplars.

## STEP 1 — Confirm scope with the user (if unclear)

A typical kickoff: *"Write solutions for chapter STLN, batches of 10, stop after batch 1 for my review."* If the user is vague ("do some math solutions") ask:
- Which chapter prefix?
- How many at a time? (default: 10 per batch)
- Should you stop for review after batch 1, or run the full chapter?

## STEP 2 — Per-batch flow

For each batch:

```bash
# 1. Fetch the next N questions that need solutions
node scripts/math-solutions/fetch-batch.js <PREFIX> --count=10 --from=<LAST_ID>

# 2. For EACH question in the batch, independently:
#    (a) re-derive the answer from scratch
#    (b) compare with the stored answer (see answer-verification rules below)
#    (c) write the solution following the 6-section structure
#
#    Then bundle all N into a single CommonJS batch file:
#      scripts/math-solutions/_batch_<PREFIX>_<N>.js
#
#    Each entry: { display_id, solution, answer, verifier_note?, question_text_fix?, force_flag? }
#    (see the README's "Batch file format" section for the exact shape)

# 3. Apply the batch (the validator enforces structure, no permission prompts)
node scripts/math-solutions/apply-batch.js scripts/math-solutions/_batch_<PREFIX>_<N>.js

# 4. Clean up the batch file
rm scripts/math-solutions/_batch_<PREFIX>_<N>.js
```

**IMPORTANT** — LaTeX in batch files needs `\\` escapes since CommonJS template literals strip single backslashes. `\\frac{a}{b}`, `\\boxed{...}`, `\\sqrt{2}`. Single-backslash = silent corruption in the DB. The workflow doc covers this in detail.

## STEP 3 — Answer-key verification (per question, before writing)

The stored answer in the DB is **not** authoritative. ~30% of stored answers from older ingestion passes were null or wrong. Re-derive every answer independently.

| Situation | Action |
|---|---|
| Stored answer matches your derivation | Write solution; no `answer` field change |
| Stored answer is null | Fill it with your value |
| Stored answer disagrees (and you re-checked twice) | Overwrite with your value via `answer: { correct_option: '...' }` or `answer: { integer_value: N }` |
| Your derivation matches NO option | `force_flag: { severity: 'blocking', note: '...' }` — do not hand-wave to fit the stored option |

The boxed final line of the solution always shows **your** derived answer.

## STEP 4 — Question-text OCR sanity check

If the question text has an obvious OCR typo (`= 10` where `= 0` was meant, missing brace, two operators adjacent) AND the intended fix is unambiguous given the options, repair `question_text.markdown` via `question_text_fix: { from: '...', to: '...' }`. If the fix is ambiguous, force-flag instead.

## STEP 5 — End-of-chapter audit

When the chapter is done (or at any natural pause point):

```bash
node scripts/math-solutions/audit.js <PREFIX> --sample=5
```

This catches mechanical violations (missing icons, step numbering, forbidden phrases) and gives you 5 random IDs to spot-read for soft quality. Append any soft-quality issues to the chapter flag file.

## STEP 6 — Report back

Per batch, give the user:
- Count of solutions written, answer corrections applied, OCR fixes applied, flagged questions
- Any 🟡 (verify) or 🔴 (blocking) flags raised, with one-line diagnosis

At end of chapter:
- Total stats
- Audit results
- Flag file URL: `_agents/solution-flags/<PREFIX>-flags.md`
- Recommend: spot-check 3-5 solutions before declaring the chapter done

## Quality bar — what good looks like

A solution is good when a tier-2 town student reads it and thinks: *"now I see how to start that kind of problem — I can do the next one myself."* The 🧠 section does most of this work; the math derivation is secondary. The worked example in the workflow doc embodies this bar — study it.

A solution is bad when:
- The 🧠 section is a 2-line preamble before "the real work" in 🗺️ (it should be the heart of the solution).
- The ⚡ section is "plug each option and check" (must be option-independent — a real mathematical insight).
- The voice uses idioms / refined vocabulary (see the Plain English word-swap table in the workflow doc).
- Step numbering appears ("Step 1", "Step 2") — the validator will flag this but you should avoid it natively.
- The boxed answer doesn't match your derived value.

## Common pitfalls (read before your first batch)

1. **Don't skip Step 0.** The workflow doc has changed multiple times. What you remember from a prior session may be stale.
2. **Don't write more than 10 solutions per batch.** Quality drops as the batch grows; a 10-solution batch is the sweet spot.
3. **Verify the answer BEFORE writing the solution.** If you write first and verify second, you'll be tempted to fudge the derivation to match the stored answer.
4. **For coord-geometry problems, ALWAYS include a 🖼️ Visual Sketch.** Skip only for pure algebra (Vieta, AP/GP, identities).
5. **The 🧠 section is the most important.** Spend the most thought on it. Name the problem category, quote the visible clue from the question, state the first concrete move. Zero computation in this section.
