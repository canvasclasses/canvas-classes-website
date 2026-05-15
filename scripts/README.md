# scripts/

Hand-written Node.js scripts for one-off ingestion, validation, and migration tasks. **Not run by CI** — each script is invoked manually (`node scripts/foo.js`) when its purpose comes up.

## Conventions

- `insert_*.js` — ingestion. Inserts new questions into `questions_v2`. Always loads `MONGODB_URI` from `.env.local` via dotenv; never hardcodes a connection string. Follows the canonical batch script pattern in `_agents/workflows/QUESTION_INGESTION_WORKFLOW.md`.
- `update_*.js` — modify existing documents (set/unset a field on N docs).
- `validate_*.js` — read-only quality gates (e.g. `validate_pyq_metadata.js`, `validate_question_spacing.js`). Safe to run anytime.
- `backfill_*.js` — one-time re-derivation of a field across the collection (e.g. `backfill_concept_mastery.js`). Idempotent; safe to re-run.
- `_phase1_buffer_<prefix>.js` — **active** ingestion-workflow buffer. The `question-ingester` skill writes extracted SRC-tagged questions here in Phase 1, then a per-batch `insert_<prefix>_b<N>.js` consumes the buffer in Phase 2.
- `_archive/` — historical one-off audits and snapshots kept for context. **Do not run.** They were correct at the time of writing but reference cluster state, taxonomy snapshots, or schemas that have since moved.

## Active subdirectories

- `blog/`, `career-explorer/`, `book-page/`, `_snapshots/` — feature-scoped script collections, see each folder.

## Safety rules (mirrored from `CLAUDE.md` §3 and §8)

- Every write script that touches `questions_v2` must state, before running, how many docs will change and what the rollback is.
- Use `uuidv4()` for `_id` — never `new ObjectId()`.
- Set `deleted_at: null`, `status: 'published'` on new docs.
- Disconnect from MongoDB at the end (`await mongoose.disconnect()`).
- Never run a `.js` script with `node -e "..."` if it contains LaTeX — shell escaping corrupts backslashes.
