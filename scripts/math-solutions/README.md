# Math Solution Toolkit

Three Node.js scripts that automate solution generation for math chapters in `questions_v2`. Designed so the agent (Claude Code, running on your Max plan) can churn through a chapter in batches without ever asking permission, with per-chapter flag files capturing anything that needs your manual review.

This toolkit replaces the old "ask the agent to do 10 questions, approve every tool call" loop.

## Kickoff prompt — copy-paste for a new session

In a fresh Claude Code session, drop this in to start any math chapter:

```
I want to generate solutions for math chapter <PREFIX> (e.g. STLN, CRCL, QUAD).
Before writing anything, read:
  • _agents/workflows/math-solution-workflow.md  (the rules and worked example)
  • scripts/math-solutions/README.md             (this toolkit and per-batch flow)

Then start with batch 1: fetch the first 10 questions, write the batch file,
apply it, and stop for my review before continuing. Use the math-solution-writer
skill if it's available.
```

Replace `<PREFIX>` with the chapter code (STLN, CRCL, PRBL, QUAD, CMPL, MTRX, LIMS, DFIN, PROB, TRRI, etc.).

After the first batch the user reviews quality, then the agent continues with batches of 10 until the chapter is done, with an `audit.js` run at the end.

## Files

- **`fetch-batch.js`** — pulls N questions from a chapter that need solutions, prints them as JSON.
- **`apply-batch.js`** — takes a JS file with proposed solutions, validates them, writes to DB, appends to flag file.
- **`audit.js`** — end-of-chapter sweep: heuristic validation over every solution, answer-key gap check, optional manual-review sample.

All three connect to MongoDB via `MONGODB_URI` from `.env.local`.

## The agent workflow (per session)

You tell the agent: _"Do the next 30 STLN solutions in batches of 5."_

The agent loops:

```bash
# 1. Fetch next 5 questions to solve
node scripts/math-solutions/fetch-batch.js STLN --count=5

# 2. Agent generates 5 solutions in its context, doing solver + verifier + (optional)
#    tiebreaker passes per question internally. Writes a batch file:
#
#    scripts/math-solutions/_batch_STLN_1.js  (CommonJS, exports array)
#
#    Each entry: { display_id, solution, answer, verifier_note?, question_text_fix?, force_flag? }

# 3. Apply the batch
node scripts/math-solutions/apply-batch.js scripts/math-solutions/_batch_STLN_1.js

# 4. Remove the batch file (cleanup; the script is now redundant)
rm scripts/math-solutions/_batch_STLN_1.js

# 5. Loop back to step 1 until the requested count is exhausted.
```

At chapter end:

```bash
node scripts/math-solutions/audit.js STLN --sample=5
```

The audit emits a summary, updates `_agents/solution-flags/STLN-flags.md` with any soft / blocking / verify entries, and prints 5 random IDs the agent (or you) should manually eyeball for soft quality.

## Permission setup (one-time)

`.claude/settings.local.json` already pre-approves:

- `Bash(node scripts/math-solutions/fetch-batch.js:*)`
- `Bash(node scripts/math-solutions/apply-batch.js:*)`
- `Bash(node scripts/math-solutions/audit.js:*)`
- `Bash(node scripts/math-solutions/_batch_*.js)`
- `Bash(rm scripts/math-solutions/_batch_*.js)`
- `Write(scripts/math-solutions/_batch_*.js)` / `Edit(scripts/math-solutions/_batch_*.js)`
- `Write(_agents/solution-flags/*.md)` / `Edit(_agents/solution-flags/*.md)`

After this, the agent never prompts you during solution work.

## Batch file format

```js
// scripts/math-solutions/_batch_STLN_1.js
module.exports = [
  {
    display_id: 'STLN-017',
    solution: `### 🧠 Why X works
...full pedagogical solution following math-solution-workflow.md...
$\\boxed{\\text{Answer: (a) 5}}$`,
    answer: { correct_option: 'a' },                                  // or { integer_value: 16 }
    verifier_note: 'solver (c) vs verifier (a); tiebreaker chose (a)', // optional → yellow flag
    question_text_fix: { from: 'x + 3y - 1 = 10', to: 'x + 3y - 1 = 0' }, // optional OCR fix
  },
  {
    display_id: 'STLN-022',
    force_flag: { severity: 'blocking', note: 'Image referenced but missing; cannot solve' },
    // when force_flag is set, no DB write happens — only the flag is appended
  },
];
```

## What `apply-batch.js` validates before writing

Every solution must pass:

- ≥ 800 chars total length
- Contains `### 🧠`, `### 🗺️`, `### ⚡`, `### ⚠️` headings (💡 is optional per workflow)
- `$\boxed{...}$` appears in the last 300 chars
- Even count of `$` (no orphan math delimiters)
- No `$$` (workflow forbids display math)
- Matched `{` and `}`
- No forbidden phrases ("let's dive in", "in conclusion", literal template headings like "Method 1: The Standard Approach", etc.)

Any failure → blocking flag is appended, no DB write for that item. The other items in the batch still go through.

## Flag file conventions

See [`_agents/solution-flags/README.md`](../../_agents/solution-flags/README.md). Severity sections:

- 🔴 Blocking — no DB write happened
- 🟡 Needs verification — solution written but flagged for eyeballing
- ⚪ Soft quality — audit-time observation, not a hard problem

Entries are deduplicated by `display_id` within each section. Resolved entries should be deleted manually.

## Resuming after a crash

State lives entirely in the DB and the flag file. If a run is interrupted mid-batch:

- Already-applied batches are persistent.
- Unapplied batch files (`_batch_*.js`) can be re-run or deleted.
- Just re-run `fetch-batch.js` — it'll skip questions that now have solutions ≥ 300 chars unless you pass `--rewrite`.

## Limits / things to know

- This toolkit assumes you're solving from a single Claude Code session — work pauses if the session ends or the laptop sleeps.
- Max plan rate windows apply: a heavy chapter (~100 questions) may bump into a window boundary; work resumes on the next window.
- The audit's heuristic checks are intentionally narrow. They catch structural errors, not subjective quality. The end-of-chapter manual sample (`--sample=N`) is where you (or the agent) do the soft-quality pass.

## Related docs

- [`_agents/workflows/math-solution-workflow.md`](../../_agents/workflows/math-solution-workflow.md) — the authoring rulebook every solution must follow.
- [`_agents/solution-flags/README.md`](../../_agents/solution-flags/README.md) — flag file index + triage instructions.
