---
description: Automatically process JEE question images and update the database
---

When the user uploads images for JEE questions, follow these steps to process them without requiring redundant instructions:

## ⚠️ CRITICAL: Database Architecture

This project has **TWO separate MongoDB collections**:

| Collection | Used by | Schema |
|---|---|---|
| `questions` | Old sync script (`sync_json_to_mongo.js`) | Flat: `chapter_id`, `meta.difficulty` |
| `questions_v2` | Admin dashboard, Crucible practice pages | Nested: `metadata.chapter_id`, `metadata.difficulty` |

**ALL new questions MUST go into `questions_v2`** via the migration script or direct insert.
Questions written only to the `questions` collection via `sync_json_to_mongo.js` will **NOT appear** in the admin dashboard or practice pages.

### Correct ingestion path for batch JSON ingestion:
1. Write questions to `data/questions/chapter_[name].json` with camelCase fields (`chapterId`, `textMarkdown`, `isPYQ`, etc.)
2. Run `node scripts/migrate_dnf_to_v2.js` (or equivalent per-chapter migration script) to insert into `questions_v2` with the correct schema.
3. Verify with: `node -e "const m=require('mongoose'); ..."` that `metadata.chapter_id` is set correctly.

### Chapter ID verification — ALWAYS verify before ingesting:
- Check `data/chapters/_index.json` for the exact `chapterId` value.
- **D & F Block** = `ch12_dblock` ✓
- **Do NOT guess** chapter IDs — always look them up from `_index.json`.

---

1. **Analyze Images**:
    - Use your vision capabilities to accurately transcribe the question, options, and explanation.
    - Identify the **Exam Source** (e.g., "JEE Main 2025 - Apr 7 Evening Shift").
    - Deduce the **Chapter ID** — **look it up from `data/chapters/_index.json`**, never guess.
    - Infer the **Concept Tags** (e.g., `TAG_PRAC_PURIFICATION_TECHNIQUES`).
    - Determine the **Difficulty** (Easy/Medium/Hard).
    - If solution to the question is not provided then **Generate Solution** acting as subject expert.

2. **Format Data**:
    - Ensure all mathematical symbols and chemical formulas use LaTeX (e.g., `$CH_3OH$`, `$$...$$`).
    - Use Markdown for structured text.
    - Generate a unique ID following the pattern: `jee_[year]_[shift_code]_[chapter_short]_[index]`.

3. **Update Local Question Bank**:
    - Add the question to the local JSON file: `data/questions/chapter_[name].json`.
    - Fields must be camelCase: `chapterId`, `textMarkdown`, `isPYQ`, `isTopPYQ`, `questionType`, `conceptTags`, `solution.textSolutionLatex`.

4. **Sync to MongoDB (questions_v2)**:
// turbo
    - Run the chapter-specific migration script to insert into `questions_v2`:
      `node scripts/migrate_dnf_to_v2.js` (adapt for each chapter)
    - The old `sync_json_to_mongo.js` writes to the WRONG collection — do NOT use it as the sole sync step.
    - After sync, verify: check admin dashboard at `/crucible/admin` and filter by the chapter to confirm questions appear.

5. **Final Verification**:
    - Confirm questions appear in the admin dashboard under the correct chapter filter.
    - Report the successful addition of the question(s).
    - Provide a summary of the chapter and tags assigned.