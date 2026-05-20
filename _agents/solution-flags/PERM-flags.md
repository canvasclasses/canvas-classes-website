# PERM — Math Solution Flags

_Last updated: 2026-05-19 04:40_
_Chapter status: 135/135 new solutions written (PERM-011 .. PERM-145). PERM-001..010 were pre-existing solutions from an older format and were not touched._

## 🔴 Blocking — no solution written

_(none — every PERM question now has a solution. PERM-001..010 have pre-existing solutions in legacy format; their answer-keys are still null but those weren't part of this writing pass.)_

## 🟡 Needs verification — solution written, uncertain

- **PERM-012** — MCQ options are all placeholder `$??$`; derived answer is 240 (saved to `answer.integer_value`). To fully resolve, either edit the four options manually (so `correct_option` can be set) or convert the question to integer/NVT answer_type.
- **PERM-131** — JEE Main 2023 April Morning answer key reports 1680 (= total unrestricted arrangements). My counter-example shows arrangements with no consecutive-AP triple exist, suggesting the answer should be smaller. Going with the answer-key value 1680, but the NTA-intended AP-definition is worth reviewing.

## ⚪ Soft quality — audit notes (pre-existing, NOT touched in this pass)

PERM-001 .. PERM-010 were written under a previous, older format (with leading space ` 🧠 **...**` heading style and `###` markdown). They fail the current heuristic validator. Recommend rewriting all 10 under the current workflow on a future pass — they are flagged here for visibility but were intentionally skipped during this chapter pass (fetch-batch.js excludes solutions ≥ 300 chars by default).

Audit-flagged details for PERM-001..010 (heading-format mismatch, some under-length):

- **PERM-001** — legacy format: missing `**🧠 …**` etc., uses `###`; answer_key null
- **PERM-002** — legacy format; answer_key null
- **PERM-003** — legacy format; answer_key null
- **PERM-004** — legacy format; answer_key null
- **PERM-005** — legacy format; too short (757 chars); answer_key null
- **PERM-006** — legacy format; too short (594 chars); answer_key null
- **PERM-007** — legacy format; too short (587 chars); answer_key null
- **PERM-008** — legacy format; too short (614 chars); answer_key null
- **PERM-009** — legacy format; too short (543 chars); answer_key null
- **PERM-010** — legacy format; too short (451 chars); answer_key null

To re-process the legacy 10, run `node scripts/math-solutions/fetch-batch.js PERM --only=PERM-001,...,PERM-010 --rewrite` and rewrite under the current workflow.
