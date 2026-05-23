# Chemistry Solution Toolkit

Mirror of `scripts/physics-solutions/` and `scripts/math-solutions/`, with two chemistry-specific extensions:

1. **`fetch-batch.js`** surfaces image URLs from `question_text.markdown` so structural diagrams can be rendered via the dark-background SVG conversion before solving.
2. **`apply-batch.js`** detects inline `📐 [Solution diagram: …]` markers in solutions and auto-appends them to `_agents/solution-flags/<PREFIX>-diagram-wishlist.md` for later Notion sync.

The authoring rules are in [`_agents/workflows/chemistry-solution-workflow.md`](../../_agents/workflows/chemistry-solution-workflow.md). Read that first — it is the source of truth for voice, structure, and the 6-section pattern (🧠 🖼️ 🗺️ ⚡ 💡 ⚠️).

## Kickoff prompt — copy-paste for a new session

In a fresh Claude Code session, drop this in to start any chemistry chapter:

```
I want to generate solutions for chemistry chapter <PREFIX> (e.g. MOLE, ATOM, GOC, SALT).
Before writing anything, read:
  • _agents/workflows/chemistry-solution-workflow.md  (rules + worked example)
  • scripts/chemistry-solutions/README.md             (this toolkit and per-batch flow)

Then start with batch 1: fetch the first 10 questions, write the batch file,
apply it, and stop for my review before continuing.
```

Replace `<PREFIX>` with the chapter code (MOLE, ATOM, PERI, BOND, GOC, SALT, ALCO, ALDE, AMIN, BIOM, CHEK, COMP, DBLO, EQUI, FBLO, ION, METH, NCHM, ORGC, POLY, REDX, SBLO, SOLID, SOLN, SUFR, THER, etc.).

After the first batch the user reviews quality, then the agent continues with batches of 10 until the chapter is done, with an `audit.js` run at the end.

## Files

- **`fetch-batch.js`** — pulls N questions from a chapter, prints them as JSON. Includes `image_urls[]` extracted from markdown so the agent can render structural diagrams.
- **`apply-batch.js`** — takes a JS file with proposed solutions, validates them, writes to DB, appends to flag file, **extracts 📐 markers** to the diagram wishlist file.
- **`audit.js`** — end-of-chapter sweep: heuristic validation over every solution, answer-key gap check, optional manual-review sample.

All three connect to MongoDB via `MONGODB_URI` from `.env.local`.

## The agent workflow (per session)

You tell the agent: _"Do the next 10 MOLE solutions."_

The agent loops:

```bash
# 1. Fetch next 10 questions to solve
node scripts/chemistry-solutions/fetch-batch.js MOLE --count=10 --rewrite

# 2. For every question whose image_urls is non-empty, the agent renders the
#    diagram via the dark-bg conversion BEFORE writing the solution:
#
#    curl -s <url> -o /tmp/<display_id>.svg
#    magick -background black -density 150 /tmp/<display_id>.svg /tmp/<display_id>.png
#    Read /tmp/<display_id>.png
#
#    Then it generates 10 solutions in its context. For any step that needs a
#    hand-drawn mechanism, the agent inserts a 📐 marker inline:
#
#    📐 [Solution diagram: arrow-pushing for the SN2 transition state — Nu⁻
#    attacks C from the back, Br⁻ leaves from the front, inversion of config.]
#
#    The agent writes a batch file:
#    scripts/chemistry-solutions/_batch_MOLE_1.js  (CommonJS, exports array)

# 3. Apply the batch
node scripts/chemistry-solutions/apply-batch.js scripts/chemistry-solutions/_batch_MOLE_1.js

# 4. Remove the batch file (cleanup; the script is now redundant)
rm scripts/chemistry-solutions/_batch_MOLE_1.js

# 5. Loop back to step 1 until the requested count is exhausted.
```

At chapter end:

```bash
node scripts/chemistry-solutions/audit.js MOLE --sample=5
```

## Reading structural diagrams before solving

When `fetch-batch.js` reports `image_urls: ["https://..."]` for a question, the agent **must** view the diagram before writing the solution.

**For SVGs (the common case): convert with a dark background first.** The R2 SVGs in this bank are stroked/filled white, so loading them directly renders blank. Always:

```bash
curl -s <url> -o /tmp/<display_id>.svg
magick -background black -density 150 /tmp/<display_id>.svg /tmp/<display_id>.png
# then Read /tmp/<display_id>.png
```

The PNG renders perfectly: structural formulas, reagent labels, reaction arrows, stereochemistry — all clearly visible. Reading the raw SVG XML directly will NOT work.

**For PNG and JPG URLs:** download with `curl` and `Read` directly — no conversion needed.

If a question's text references a structure but `image_urls` is empty, that is a data gap — flag the question with `force_flag: { severity: 'blocking', note: 'Structure referenced in text but not present in question_text — cannot solve.' }`.

## 📐 Solution-side diagram markers (chemistry-specific)

Within the solution markdown, at the precise step where a hand-drawn mechanism or 3D structure would help, the agent inserts:

```
📐 [Solution diagram: arrow-pushing for the hydride attack — H⁻ → C,
π electrons → O, producing the tetrahedral alkoxide intermediate.]
```

**Format rules:**
- Single line, on its own (a paragraph between text paragraphs).
- Starts with `📐 [Solution diagram:` and ends with `]`.
- Description must be specific enough that someone else can draw the diagram cold.

**What `apply-batch.js` does with them:**
- Detects each marker via regex `/📐\s*\[\s*Solution diagram:\s*([^\]]+)\s*\]/g`.
- Appends one row per marker to `_agents/solution-flags/<PREFIX>-diagram-wishlist.md`, with the display_id, the description, and `Status: Not started`.
- Avoids duplicates within the same wishlist (same display_id + description = skipped).
- The marker stays in the DB-stored solution. The student sees `📐 [Solution diagram: …]` inline until you replace it with the actual generated image.

**Use markers when:**
- ✅ Multi-arrow mechanism step where electron flow matters (SN2 transition state, aldol C-C bond formation, EAS arenium intermediate).
- ✅ Stereochemistry with wedge/dash bonds (E2 anti-periplanar, Zaitsev vs Hofmann).
- ✅ 3D conformation arguments (Newman projections, chair flip).
- ❌ Simple structural formulas the student already has in the question.
- ❌ Decorative "for clarity" pictures that don't teach a step the prose missed.

**Syncing the wishlist to Notion.** The local `.md` file is the source of truth during chapter work. At chapter end, the agent (or you) can bulk-add these rows to the `🖼️ Solution-Side Diagrams Wishlist` Notion database under the Crucible Development Tracker page. The Notion DB is the single canonical wishlist across all subjects.

## Batch file format

```js
// scripts/chemistry-solutions/_batch_MOLE_1.js
module.exports = [
  {
    display_id: 'MOLE-001',
    solution: `**🧠 Bespoke Title Here**

...full pedagogical solution following chemistry-solution-workflow.md...

📐 [Solution diagram: <if a hand-drawn mechanism would help here>]

$\\boxed{\\text{Answer: (a) } 5\\,\\mathrm{mol}}$`,
    answer: { correct_option: 'a' },
    verifier_note: 'solver (c) vs verifier (a); tiebreaker chose (a)', // optional → yellow flag
    question_text_fix: { from: 'NaO', to: 'NaOH' },                    // optional OCR fix
  },
  {
    display_id: 'MOLE-007',
    force_flag: { severity: 'blocking', note: 'Structure referenced but missing; cannot solve' },
  },
];
```

## What `apply-batch.js` validates before writing

Every solution must pass:

- ≥ 800 chars total length
- Contains `**🧠`, `**🗺️`, `**⚡`, `**⚠️` headings (🖼️ and 💡 are optional per workflow)
- `$\boxed{...}$` appears in the last 300 chars
- Even count of `$` (no orphan math delimiters)
- No `$$` (workflow forbids display math; chemistry's old `$$\boxed{...}$$` is now removed)
- Matched `{` and `}` (works with `\ce{[Cu(NH3)4]^{2+}}` and `\mathrm{[Cu(NH_3)_4]^{2+}}` since square brackets are not counted)
- No forbidden phrases ("let's dive in", "in conclusion", literal template headings)
- No `Step 1 / Step 2` enumeration

Any failure → blocking flag is appended, no DB write for that item. The other items in the batch still go through.

## Flag file conventions

See [`_agents/solution-flags/README.md`](../../_agents/solution-flags/README.md). Severity sections:

- 🔴 Blocking — no DB write happened
- 🟡 Needs verification — solution written but flagged for eyeballing
- ⚪ Soft quality — audit-time observation, not a hard problem

Entries are deduplicated by `display_id` within each section.

## Resuming after a crash

State lives entirely in the DB, the flag file, and the diagram-wishlist file. If a run is interrupted mid-batch:

- Already-applied batches are persistent.
- Unapplied batch files (`_batch_*.js`) can be re-run or deleted.
- Just re-run `fetch-batch.js` — it'll skip questions that now have solutions ≥ 300 chars unless you pass `--rewrite`.

## Related docs

- [`_agents/workflows/chemistry-solution-workflow.md`](../../_agents/workflows/chemistry-solution-workflow.md) — authoring rulebook.
- [`scripts/physics-solutions/README.md`](../physics-solutions/README.md) — physics sibling toolkit.
- [`scripts/math-solutions/README.md`](../math-solutions/README.md) — math sibling toolkit.
- [`_agents/solution-flags/README.md`](../../_agents/solution-flags/README.md) — flag file index + triage instructions.
