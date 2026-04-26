---
description: Crucible question-bank taxonomy, tagging, and post-insertion maintenance rules
---

# CRUCIBLE TAXONOMY & TAGGING RULES v1.0

> **Scope:** Everything that happens to a question **after** ingestion — taxonomy edits, tag assignment, micro-concept naming, bulk re-classification, backfills, audits. For initial ingestion of new questions, see `QUESTION_INGESTION_WORKFLOW.md`. When the two conflict, the ingestion workflow wins for new questions; this file wins for existing-question maintenance.

> **Status:** Canonical. Every AI agent working on the Crucible question bank must follow this file. Violations are treated as bugs.

---

## 0. PRIMARY DIRECTIVES

1. **Single source of truth** for the taxonomy is `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`. Every `chapter_id`, `tag_id`, and `microConcept` value stored on a question MUST resolve to a node in that file.
2. **Single source of truth** for question data is the `questions_v2` collection in MongoDB cluster `crucible-cluster`, database `crucible`. Never write to `questions` (V1 — frozen).
3. **Never bulk-update without a dry-run first.** Every script that mutates more than 5 documents must support a `--dry-run` mode that prints proposed changes without writing.
4. **Never delete questions.** Soft-delete only: set `deleted_at: new Date()` and `deleted_by`. Hard deletion is forbidden.
5. **Never edit `taxonomyData_from_csv.ts` by hand if the dashboard can do it.** The Taxonomy Dashboard at `/crucible/admin/taxonomy` writes via `POST /api/v2/taxonomy/save`. Manual edits are allowed only when the dashboard cannot express the change (e.g. structural reorderings, scripted rename).

---

## 1. TAXONOMY STRUCTURE

### Three-level hierarchy

```
chapter (id: chXX_<name>)
  └─ topic / primary tag (id: tag_<chapter-stem>_<N>)
       └─ micro_topic / microConcept (id: micro_<chapter-stem>_<N>_<M>, name: human-readable)
```

### Naming conventions (MANDATORY)

| Level | `id` format | `name` format | Example |
|---|---|---|---|
| chapter | `chXX_<short>` (snake_case, lowercase) | Sentence-case full title | `ch12_coord` → "Coordination Compounds" |
| topic (primary tag) | `tag_<chapter-stem>_<N>` where N is 1-based | Title Case, ≤ 60 chars, descriptive | `tag_coord_3` → "Crystal Field Theory (CFT)" |
| micro_topic | `micro_<chapter-stem>_<N>_<M>` where M is 1-based within its topic | Title Case, ≤ 60 chars, names a *single* sub-skill | `micro_coord_3_5` → "Crystal Field Stabilization Energy (CFSE)" |

**Forbidden:**
- Spaces, hyphens, capital letters, or accents in any `id`.
- Renaming a `name` and assuming the change is purely cosmetic — see §1.4.
- Reusing a freed-up `id`. Once a tag/micro is created, its id is permanent. To "remove" a concept, mark it deprecated (rename to "[DEPRECATED] …") and stop assigning new questions to it; do not delete the node if any non-deleted question still references it.

### 1.1 Adding a new primary tag

1. Pick the next free integer suffix for the chapter (`tag_<stem>_<N+1>`).
2. Add the node to `taxonomyData_from_csv.ts` immediately after the last existing tag for that chapter.
3. Add at least 3 micro-topics underneath it.
4. Update the chapter's entry in the `QUICK REFERENCE` block of `QUESTION_INGESTION_WORKFLOW.md` (the `TAGS (use tag_id exactly as shown)` line).
5. Re-classify questions onto the new tag in a separate, dry-run-first script.

### 1.2 Adding a new micro-topic

1. Pick the next free integer suffix within the parent tag (`micro_<stem>_<N>_<M+1>`).
2. The micro-topic name must describe a **single, testable sub-skill** — not a vague theme. Good: "AgNO₃ Precipitation Test (Counting Ionizable Cl⁻)". Bad: "Werner-style Questions".
3. Add the node to `taxonomyData_from_csv.ts` directly under its parent tag, in the order they should appear to learners.

### 1.3 Renaming a micro-topic

- Changing the `name` is allowed. The `id` MUST stay the same.
- After the rename, run a backfill script to update any question whose `metadata.microConcept` field stores the **old name as a string** (we store names, not ids — see §2). Without the backfill, audit reports will flag those questions as having unrecognized micro-concepts.

### 1.4 Splitting / merging tags

Treated as a structural migration — always two-phase, always dry-run-first.

**Splitting** `tag_X` → `tag_X` + `tag_Y`:
1. Create `tag_Y` and its micro-topics.
2. Write a script that classifies each question currently under `tag_X` into either X or Y based on explicit, listed criteria (do not rely on a model judging in bulk — list display_ids).
3. Run with `--dry-run`, review the assignment list, then apply.

**Merging** `tag_X` + `tag_Y` → `tag_X`:
1. Choose surviving tag (`tag_X`).
2. Map every micro of the absorbed tag (`tag_Y`) onto a micro of the surviving tag (or create a new micro under `tag_X` if no fit). Document the mapping in the script header.
3. Re-tag all questions, then mark `tag_Y` deprecated. Do not delete its taxonomy node — the dashboard expects every `tag_id` referenced by any question to resolve.

---

## 2. THE `metadata` FIELDS — WHAT GOES WHERE

Authoritative schema lives in `lib/models/Question.v2.ts` (`IQuestionMetadata`). This section describes **how to populate** each field, not what types to use.

### 2.1 `chapter_id` (required, immutable after insertion)

- Must equal a `chapter` node's `id` in `taxonomyData_from_csv.ts`.
- Changing the chapter of an existing question is a migration, not an edit. Use a dedicated script with audit log entries (see §5).

### 2.2 `tags` array (required, ordered)

```ts
tags: [
  { tag_id: 'tag_coord_3', weight: 1.0 },   // PRIMARY — index 0
  { tag_id: 'tag_coord_2', weight: 0.5 }    // SECONDARY — index 1+
]
```

Rules:
- **Index 0 is the primary tag.** All filtering, distribution audits, and reports use `tags[0]`.
- The primary tag's `weight` is always `1.0`.
- Secondary tags carry weight `0.3 – 0.7` based on relevance. Use sparingly — most questions are single-concept.
- A question's primary `tag_id` must have `parent_id === metadata.chapter_id`. Cross-chapter primary tags are forbidden (they cause silent invisibility in chapter filters).
- All secondary `tag_id`s should also belong to the same chapter; cross-chapter secondaries are allowed only when the question genuinely tests a concept from another chapter (rare).

### 2.3 `microConcept` (string, recommended on every question)

- Stores the **human-readable name** of a micro-topic (e.g. `"Stoichiometric Calculations (Mole, Mass, Volume)"`), NOT the id.
- The name must exactly match a `micro_topic` node's `name` whose `parent_id === metadata.tags[0].tag_id`. Case- and punctuation-sensitive.
- Forbidden values: empty string `""`, the literal string `"null"`, a raw id like `"micro_coord_1_1"`. Use `null` only if the question genuinely cannot be classified to a sub-skill (rare — flag for review instead).
- Why we store names, not ids: keeps reporting human-readable, allows the dashboard to show micro distribution without joining against the taxonomy, and is the convention already used by `ch11_mole` (the cleanest chapter).

### 2.4 `isMultiConcept` (boolean)

- `true` only if `tags.length >= 2` AND each secondary tag's weight ≥ 0.4.
- A question with one primary tag and a single weight-0.3 secondary is NOT multi-concept — it has a hint of another concept.
- When true, the `microConcept` field should describe the *primary* sub-skill being tested. Do not concatenate two micro names.

### 2.5 `questionNature` (enum)

| Value | Use when… |
|---|---|
| `Recall` | Direct fact retrieval — naming, classification, definition matching |
| `Rule_Application` | Apply a known rule/formula to a clean numeric or symbolic problem |
| `Mechanistic` | Trace a multi-step reasoning path (esp. organic mechanisms, multi-step CFSE/VBT chains) |
| `Synthesis` | Combine 2+ rules from different sub-topics, or work backwards from output to input |

Default during backfill if uncertain: `Rule_Application`. Never invent new enum values — extending the enum requires a schema migration in `Question.v2.ts`.

### 2.6 `difficultyLevel` (1–5, required)

- Set on insertion. Editing later is allowed only with a justification logged in `review_notes` and an `auditlogs` entry.
- Mapping from source markings: `E→1`, `EM→2`, `M→3`, `MH→4`, `H→5`. Unmarked → `3`.
- The deprecated string `difficulty` field should be left as `null` on new questions. Do not remove from existing docs.

### 2.7 Exam taxonomy (`examBoard`, `sourceType`, `examDetails`)

See `QUESTION_INGESTION_WORKFLOW.md` §QUICK REFERENCE for canonical mappings. For maintenance work:

- Backfilling from the legacy `exam_source` field: read `exam_source.exam`, normalize ("JEE Main" → `JEE_Main`), populate the new tier-3 fields. Always run this as a dry-run script first.
- `is_pyq` and `is_top_pyq` are **deprecated**. Do not use them in new logic. Read `sourceType === 'PYQ'` instead. Existing values may be left in place.

---

## 3. CLASSIFICATION DECISION TREE (assigning a primary tag)

When choosing a primary tag for a question, walk this list top-down. The first match wins.

1. **Does the question's *answer* depend on a single, well-defined sub-skill?** → use the tag that owns that sub-skill.
2. **If the question chains two skills, which one is the bottleneck — i.e., the one a student would fail on?** → that's the primary. The other can be a secondary tag with weight 0.4–0.5.
3. **If the question is a "spot the wrong statement" / matching / NCERT-style fact dump** → tag it under the chapter's most factual primary tag (Basic Definitions, Applications, etc.), even if individual statements span multiple sub-topics.
4. **If you genuinely can't pick** → leave the document as-is, set `needs_review: true`, and add a flag with `type: 'tagging_uncertain'`. Never guess.

**Anti-patterns (do not do these):**
- Tag every magnetism question as "Color & Magnetic Properties" even when the *bottleneck* is CFT (predicting high/low spin from a ligand).
- Tag every "AgCl precipitation" question as "Basic Definitions & Ligands". Werner's-theory style precipitation tests belong under the Werner tag.
- Tag a multi-concept question with a long secondary chain. Cap secondary tags at 1 per question for normal use; 2 only for genuine multi-concept synthesis questions.

---

## 4. AUDITING & VALIDATION

### 4.1 The standard audit script

Every chapter has an audit script at `scripts/audit_<chapter>_tags.js`. Template: `scripts/audit_ch12_coord_tags.js` (use as a reference; copy & adapt the `CHAPTER_ID` and `TAG_NAMES` / `MICRO_TOPICS` blocks).

The audit MUST report:
1. Total questions (excluding `deleted_at`).
2. Counts of: missing primary tag, invalid primary tag (cross-chapter or unknown), missing `microConcept`, missing `questionNature`, missing/empty solution.
3. SCQ/AR option-correctness sanity (no-correct, multiple-correct).
4. NVT answer-presence sanity.
5. Per-primary-tag distribution.
6. Per-primary-tag micro-concept coverage: for each defined micro, how many questions use it; list any *unrecognized* micro-concept strings stored in the DB but not in the taxonomy.

### 4.2 When to run the audit

- After **any** taxonomy edit that touches a chapter.
- After **any** bulk re-tagging script.
- Before declaring a chapter "ingestion-complete".
- Periodically as part of a chapter health check.

### 4.3 Acceptance thresholds (target state for a "healthy" chapter)

| Field | Target |
|---|---|
| Invalid / unknown primary tag | 0 |
| Missing `microConcept` | 0 |
| Unrecognized micro-concept strings | 0 |
| Missing `difficultyLevel` | 0 |
| Missing `questionNature` | 0 |
| Missing solution | 0 |
| SCQ/AR option-correctness errors | 0 |
| NVT answer-presence errors | 0 |
| Defined micros with **zero** questions tagged | ≤ 20 % (some new sub-skills can lag PYQ pool) |

A chapter that doesn't meet all the "0" rows is **not healthy** and must not be promoted from `review` → `published` for new questions.

---

## 5. BULK MUTATION SCRIPTS

### 5.1 Naming and location

```
scripts/<verb>_<chapter>_<scope>_b<N>.js
```

Examples:
- `scripts/audit_ch12_coord_tags.js` — read-only audit
- `scripts/reclassify_ch12_coord_invalid_tags.js` — fix the 5 invalid-tag questions
- `scripts/backfill_ch12_coord_microconcept_b1.js` — backfill micro names in 30-question batches
- `scripts/migrate_ch12_coord_split_tag7.js` — structural split

Batches: **30–50 questions per script** for backfills. **5–10** for re-classifications that need per-question judgement. Never one giant script.

### 5.2 Required preflight

Every mutation script MUST:
1. Load `MONGODB_URI` from `.env.local` via `dotenv` — never hardcoded.
2. Connect to db `crucible`, collection `questions_v2`.
3. Support `--dry-run` (default behavior should be dry-run; require an explicit `--apply` flag to actually write). The first version of any new script ships in dry-run mode and is run + reviewed before `--apply` is added.
4. Print a per-document line: `display_id | field | old_value → new_value`.
5. After `--apply`, write an `auditlogs` collection entry per document with: `{ entity_id, entity_type: 'question_v2', action: 'bulk_update', field_changes, actor: 'ai_agent', script_name, run_at }`.
6. Exit with non-zero status if validation fails before any write.

### 5.3 Allowed mutations without a fresh script

The following can be done via the admin UI or one-off `node -e` is **forbidden**; they must go through scripts:
- Changing primary tag of any question
- Changing `chapter_id`
- Setting / overwriting `microConcept` in bulk
- Soft-delete (`deleted_at`)
- Changing `difficultyLevel` for >1 question

The following are allowed via the admin UI:
- Editing question text, options, solution
- Adding/removing flags
- Promoting `review` → `published`
- Editing `review_notes`

### 5.4 Forbidden patterns

```bash
# DO NOT do this. Shell escaping mangles LaTeX backslashes and there is no audit log.
node -e "require('mongodb')..."

# DO NOT do this. No dry-run, no audit log, no batching.
db.questions_v2.updateMany({chapter_id:'ch12_coord'}, {$set: {...}})

# DO NOT do this. UUID v4 only.
{ _id: new ObjectId() }
```

---

## 6. THE `microConcept` BACKFILL PLAYBOOK

This is the most common maintenance task. Follow exactly.

1. **Audit first.** Run the chapter's audit script. Note the count of `microConcept EMPTY` and the list of `Unrecognized micro-concept strings`.
2. **Decide if the taxonomy is sufficient.** Look at the question content of empty-micro questions. If many of them naturally cluster around a sub-skill not yet in the micros list, add a new micro-topic to the taxonomy first (§1.2).
3. **Plan the assignment.** Group the empty-micro questions by their primary tag, then for each group write the assignment plan: which `display_id` → which micro name. Do this in batches of 30.
4. **Write the script.** One file per batch, named `scripts/backfill_<chapter>_microconcept_b<N>.js`. Each batch contains an explicit `[displayId, microName]` array. Never let the script "infer" assignments at runtime — every assignment must be pre-recorded in the script source.
5. **Dry-run, review, apply.** Look for: micros that don't match the parent tag; micros that don't exist in the taxonomy; questions where the chosen micro is too broad.
6. **Re-audit.** The "Missing microConcept" count must go down by exactly the batch size. The "Unrecognized micro-concept strings" count must stay 0.
7. **For questions where no existing micro fits:** either add a new micro to the taxonomy (preferred) or set `needs_review: true` and add a `tagging_uncertain` flag. Never invent a one-off micro-concept name that isn't in the taxonomy.

---

## 7. SECURITY & DATA HYGIENE

These rules are non-negotiable and apply to every script and API route:

- Connection string lives in `.env.local` only. Never hardcode, never commit.
- Scripts that mutate must use the script-secret header pattern (`hasScriptSecret`) when invoking API routes, OR connect directly via `MongoClient` from a script run on a trusted machine.
- Never log full question documents to stdout in production scripts (LaTeX bodies leak to logs). Log `display_id | field | summary` only.
- Soft-delete is the only delete. `deleted_at: null` is required on every active document.
- Audit log entries (collection `auditlogs`) are append-only. Do not edit or delete past entries.

---

## 8. CHANGE LOG FOR THIS DOCUMENT

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-04-25 | Initial draft. Codifies conventions extracted from `ch11_mole` (gold standard) and the existing ingestion workflow. |

---

**See also:**
- `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md` — adding new questions
- `_agents/workflows/solution-ingestion-workflow.md` — writing solutions
- `_agents/workflows/MOCK_TEST_INGESTION_WORKFLOW.md` — mock tests
- `lib/models/Question.v2.ts` — authoritative schema
- `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts` — taxonomy SOT
