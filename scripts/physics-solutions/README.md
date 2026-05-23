# Physics Solution Toolkit

Mirror of `scripts/math-solutions/`, with one physics-specific extension: `fetch-batch.js` extracts image URLs from `question_text.markdown` and surfaces them as `image_urls[]` so the agent can `Read` each diagram before writing the solution.

The authoring rules are in [`_agents/workflows/physics-solution-workflow.md`](../../_agents/workflows/physics-solution-workflow.md). Read that first — it is the source of truth for voice, structure, and the 6-section pattern (🧠 🖼️ 🗺️ ⚡ 💡 ⚠️).

## Kickoff prompt — copy-paste for a new session

In a fresh Claude Code session, drop this in to start any physics chapter:

```
I want to generate solutions for physics chapter <PREFIX> (e.g. MIP, UNIT, K1D, NLM).
Before writing anything, read:
  • _agents/workflows/physics-solution-workflow.md  (rules + worked example)
  • scripts/physics-solutions/README.md             (this toolkit and per-batch flow)

Then start with batch 1: fetch the first 10 questions, write the batch file,
apply it, and stop for my review before continuing.
```

Replace `<PREFIX>` with the chapter code (MIP, UNIT, K1D, K2D, NLM, WEP, SHM, GRAV, KTG, WAVE, ELST, CURR, EMI, DUAL, etc.).

After the first batch the user reviews quality, then the agent continues with batches of 10 until the chapter is done, with an `audit.js` run at the end.

## Files

- **`fetch-batch.js`** — pulls N questions from a chapter, prints them as JSON. Includes `image_urls[]` extracted from markdown so the agent can read diagrams.
- **`apply-batch.js`** — takes a JS file with proposed solutions, validates them, writes to DB, appends to flag file.
- **`audit.js`** — end-of-chapter sweep: heuristic validation over every solution, answer-key gap check, optional manual-review sample.

All three connect to MongoDB via `MONGODB_URI` from `.env.local`.

## The agent workflow (per session)

You tell the agent: _"Do the next 10 MIP solutions."_

The agent loops:

```bash
# 1. Fetch next 10 questions to solve
node scripts/physics-solutions/fetch-batch.js MIP --count=10 --rewrite

# 2. For every question whose image_urls is non-empty, the agent reads the image
#    via the Read tool BEFORE writing the solution. Then it generates 10
#    solutions in its context and writes a batch file:
#
#    scripts/physics-solutions/_batch_MIP_1.js  (CommonJS, exports array)
#
#    Each entry: { display_id, solution, answer, verifier_note?, question_text_fix?, force_flag? }

# 3. Apply the batch
node scripts/physics-solutions/apply-batch.js scripts/physics-solutions/_batch_MIP_1.js

# 4. Remove the batch file (cleanup; the script is now redundant)
rm scripts/physics-solutions/_batch_MIP_1.js

# 5. Loop back to step 1 until the requested count is exhausted.
```

At chapter end:

```bash
node scripts/physics-solutions/audit.js MIP --sample=5
```

## Batch file format

```js
// scripts/physics-solutions/_batch_MIP_1.js
module.exports = [
  {
    display_id: 'MIP-001',
    solution: `**🧠 Bespoke Title Here**

...full pedagogical solution following physics-solution-workflow.md...

$\\boxed{\\text{Answer: (a) } 5\\,\\mathrm{m\\,s^{-1}}}$`,
    answer: { correct_option: 'a' },
    verifier_note: 'solver (c) vs verifier (a); tiebreaker chose (a)', // optional → yellow flag
    question_text_fix: { from: 'g = 9', to: 'g = 9.8' },               // optional OCR fix
  },
  {
    display_id: 'MIP-007',
    force_flag: { severity: 'blocking', note: 'Image referenced but missing; cannot solve' },
  },
];
```

## What `apply-batch.js` validates before writing

Every solution must pass:

- ≥ 800 chars total length
- Contains `**🧠`, `**🗺️`, `**⚡`, `**⚠️` headings (🖼️ and 💡 are optional per workflow)
- `$\boxed{...}$` appears in the last 300 chars
- Even count of `$` (no orphan math delimiters)
- No `$$` (workflow forbids display math)
- Matched `{` and `}`
- No forbidden phrases ("let's dive in", "in conclusion", literal template headings, etc.)
- No `Step 1 / Step 2` enumeration

Any failure → blocking flag is appended, no DB write for that item. The other items in the batch still go through.

## Reading images before solving

When `fetch-batch.js` reports `image_urls: ["https://..."]` for a question, the agent **must** view the diagram before writing the solution.

**For SVGs (the common case in this bank): convert with a dark background first.** The R2 SVGs are stroked/filled white, so loading them directly renders blank — the diagram is invisible against the default white viewer background. Always:

```bash
curl -s <url> -o /tmp/<display_id>.svg
magick -background black -density 150 /tmp/<display_id>.svg /tmp/<display_id>.png
# then Read /tmp/<display_id>.png
```

The PNG renders perfectly: vector arrows, point labels, angle markings, dashed reference lines — all clearly visible. Reading the raw SVG XML directly will NOT work; the path coordinates are not human/model-readable as a diagram.

**For PNG and JPG URLs (less common):** download with `curl` and `Read` directly — no conversion needed.

If a question's text references a figure but `image_urls` is empty, that's a data gap — flag the question with `force_flag: { severity: 'blocking', note: 'Image referenced in text but not present in question_text — cannot solve.' }`.

## Flag file conventions

See [`_agents/solution-flags/README.md`](../../_agents/solution-flags/README.md). Severity sections:

- 🔴 Blocking — no DB write happened
- 🟡 Needs verification — solution written but flagged for eyeballing
- ⚪ Soft quality — audit-time observation, not a hard problem

Entries are deduplicated by `display_id` within each section.

## Resuming after a crash

State lives entirely in the DB and the flag file. If a run is interrupted mid-batch:

- Already-applied batches are persistent.
- Unapplied batch files (`_batch_*.js`) can be re-run or deleted.
- Just re-run `fetch-batch.js` — it'll skip questions that now have solutions ≥ 300 chars unless you pass `--rewrite`.

## Related docs

- [`_agents/workflows/physics-solution-workflow.md`](../../_agents/workflows/physics-solution-workflow.md) — authoring rulebook.
- [`scripts/math-solutions/README.md`](../math-solutions/README.md) — math sibling toolkit (this one mirrors it).
- [`_agents/solution-flags/README.md`](../../_agents/solution-flags/README.md) — flag file index + triage instructions.
