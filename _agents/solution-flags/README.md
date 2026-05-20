# Math Solution Flags — Index

Rolling list of every per-chapter flag file. Each file collects questions in that chapter that need manual attention — either because automation couldn't safely write a solution, or because the verifier disagreed with the solver, or because a soft-quality audit found something worth a human glance.

## How the flag system works

The `scripts/math-solutions/` toolkit appends to these files automatically. You don't need to edit them by hand for normal flagging — re-running `apply-batch.js` or `audit.js` updates them in place (entries are deduplicated by `display_id` within each severity section).

Severity meanings:

- **🔴 Blocking** — no solution was written; question is unusable until you intervene. Common causes: question text inconsistent with options, source PDF needs re-OCR, options corrupted.
- **🟡 Needs verification** — solution IS in the DB, but the answer-derivation agreed only after a tiebreaker, or another soft warning fired during write. Worth a quick eyeball before treating as final.
- **⚪ Soft quality** — solution is in the DB and passes hard validation, but the end-of-chapter audit flagged something subjective (e.g., a Method-3 section that reads like filler, a slightly short solution, a missing icon).

## How to triage

1. Open the chapter file.
2. Work top-down through 🔴 first (blockers), then 🟡 (verify), then ⚪ (soft).
3. For each, open the question in the admin UI (`admin.canvasclasses.in/crucible`) and either:
   - Fix the question text / answer manually and clear the line, OR
   - Ask the agent to re-process: `apply-batch.js` with `--only=<ID>`.
4. Once resolved, delete the line from the flag file. The toolkit will not re-add a resolved entry unless the same problem recurs.

## Chapter files

- [STLN](STLN-flags.md) — Straight Lines (Math)

_(More chapters will appear here as ingestion progresses.)_
