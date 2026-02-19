# Question Database Management Rules

> [!IMPORTANT]
> These rules must be followed by all AI agents when modifying or adding questions to the database.

## 1. File Structure & Source of Truth

- **Primary Source**: The JSON files located in `data/questions/` are the **single source of truth** for question data.
- **Naming Convention**: `data/questions/[chapter_id].json`.
- **Do NOT** modify `questions.json` or `questions-migrated.json`. These are legacy files and should be deleted or ignored.
- **MongoDB Sync**: After modifying JSON files, run the sync script (or call the sync action) to update the database.

## 2. ID Generation Strategy

- **Format**: `[PREFIX]-[XXX]` (e.g., `MOLE-001`, `ATOM-042`).
- **Uniqueness**: IDs must be globally unique within the project (though primarily unique per chapter prefix).
- **Generation Logic**:
    1.  **Read** the target chapter file (e.g., `data/questions/chapter_basic_concepts_mole_concept.json`).
    2.  **Extract** all existing numeric suffixes for the given prefix.
    3.  **Find Max**: Determine the highest numeric value.
    4.  **Increment**: `Next ID = Max + 1`.
    5.  **Pad**: Format as 3-digit string (e.g., `042`).

> [!WARNING]
> **NEVER** reset numbering (e.g., starting from 001) based on a local file or partial list. **ALWAYS** read the existing full list first.

## 3. Adding New Questions

- **Validation**: Before adding, check if the question text already exists (fuzzy match) to prevent content duplication.
- **Schema**: Ensure all fields (textMarkdown, options, solution, meta) adhere to the `Question` type definition in `types.ts`.
- **LaTeX**: Use `$` for inline math and `$$` for block math. Ensure double backslashes `\\` are used in JSON strings.

## 4. Deletion

- **Soft Delete**: Preferably mark as `deprecated: true` if preserving history is important.
- **Hard Delete**: If deleting, ensure the ID is not reused immediately unless it was the *last* ID. (Better to burn IDs than reuse/conflict).

## 5. Migration/Legacy

- If you encounter `questions.json` or `mole_pyq_parsed.json`, consider them **obsolete**. Do not read from them unless performing a specific migration task.

## 6. LaTeX & Solution Standards

### LaTeX Formatting

- **Critical Rule**: All LaTeX must follow rules in [`.agent/rules/latex_formatting.md`](.agent/rules/latex_formatting.md)
- **Spacing**: ALWAYS add space before and after `$` delimiters
  - ✅ `The mass of $ CO_2 $ is`
  - ❌ `The mass of$CO_2$is`
- **Chemical Formulas**: Use `\\mathrm{}` for elements (e.g., `$ \\mathrm{H_2O} $`)

### Solutions

- **Required**: Every question MUST have a solution with `textSolutionLatex`
- **Structure**: Solutions should include:
  - Step-by-step explanation with clear headings
  - Proper LaTeX formatting throughout
  - Final answer clearly marked
- **Validation**: Before syncing, run `node scripts/validate_question_spacing.js`

### Auto-Fixing

- The sync script (`push_json_to_mongo.js`) automatically fixes spacing issues
- Both question text and solutions are corrected during sync
- Manual fixes: `node scripts/fix_spacing_all_questions.js` and `node scripts/fix_solution_latex.js`

## 7. PYQ Metadata Standards

> [!IMPORTANT]
> All PYQ (Previous Year Question) data MUST follow these strict guidelines to ensure data quality and enable proper filtering.

### Required Fields for PYQs

When `isPYQ === true`, ALL of the following fields MUST be populated:

| Field | Type | Example | Rules |
|-------|------|---------|-------|
| `pyqYear` | Number | `2023` | 4-digit year (2015-current) |
| `pyqMonth` | String | `"Jan"` | 3-letter abbreviation: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| `pyqDay` | Number | `27` | Day of month (1-31) |
| `pyqShift` | String | `"Morning"` | ONLY "Morning" or "Evening" (capitalized) |
| `examSource` | String | `"JEE Main 2023 Jan 27 (Morning)"` | Structured format (see below) |

### examSource Format Standards

**JEE Main:**
```
"JEE Main {YEAR} {MONTH} {DAY} ({SHIFT})"

✅ Examples:
- "JEE Main 2024 Jan 27 (Morning)"
- "JEE Main 2023 Jun 29 (Evening)"

❌ NEVER use:
- "JEE Main PYQ" (too generic)
- "JEE Main 0" (malformed)
- "JEE Main 2023" (missing details)
```

**JEE Advanced:**
```
"JEE Advanced {YEAR} Paper {1|2}"

✅ Examples:
- "JEE Advanced 2023 Paper 1"
- "JEE Advanced 2022 Paper 2"
```

### Critical Anti-Patterns to Avoid

❌ **NEVER embed metadata in question text:**
```json
{
  "textMarkdown": "Question text...\\n29 Jun 2022 (E)",  // WRONG!
  "examSource": "JEE Main PYQ"
}
```

✅ **ALWAYS use dedicated fields:**
```json
{
  "textMarkdown": "Question text...",  // Clean text
  "pyqYear": 2022,
  "pyqMonth": "Jun",
  "pyqDay": 29,
  "pyqShift": "Evening",
  "examSource": "JEE Main 2022 Jun 29 (Evening)"
}
```

### Validation

**Before syncing to MongoDB, ALWAYS run:**
```bash
node scripts/validate_pyq_metadata.js
```

This validates:
- All PYQs have required metadata fields
- No dates embedded in question text
- No trailing whitespace
- Correct month/shift values
- Proper examSource format

### Data Integrity Rules

1. **No trailing whitespace** - Question text must not end with `\n` or spaces
2. **Clean text** - Remove all date information from `textMarkdown`
3. **Consistent formatting** - Month must be 3-letter, shift must be capitalized
4. **Backup first** - Always create backup before bulk operations
5. **Validate after** - Run validation script after any PYQ data changes

### For Non-PYQs

If `isPYQ === false`, set all PYQ fields to `null`:
```json
{
  "isPYQ": false,
  "examSource": "Other",  // or "NCERT Exercise", "Allen DPP", etc.
  "pyqYear": null,
  "pyqMonth": null,
  "pyqDay": null,
  "pyqShift": null
}
```

### Related Documentation

- Full guidelines: `data/QUESTION_DATABASE_GUIDELINES.md`
- Extraction script: `scripts/extract_pyq_metadata.js`
- Validation script: `scripts/validate_pyq_metadata.js`
