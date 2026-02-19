# Question Database Guidelines & Best Practices

## Critical Rules for PYQ (Previous Year Questions)

### 1. **NEVER Embed Metadata in Question Text**

❌ **WRONG:**
```json
{
  "textMarkdown": "Using the rules for significant figures...\\n29 Jun 2022 (E)",
  "examSource": "JEE Main PYQ"
}
```

✅ **CORRECT:**
```json
{
  "textMarkdown": "Using the rules for significant figures...",
  "examSource": "JEE Main 2022 Jun 29 (Evening)",
  "pyqYear": 2022,
  "pyqMonth": "Jun",
  "pyqDay": 29,
  "pyqShift": "Morning" or "Evening"
}
```

**Why:** Question text should be clean and presentable. Metadata belongs in dedicated fields for filtering and analysis.

---

### 2. **Always Populate Dedicated PYQ Fields**

For every PYQ question, **ALL** of these fields must be populated:

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `isPYQ` | Boolean | `true` | Mark as PYQ |
| `pyqYear` | Number | `2023` | 4-digit year |
| `pyqMonth` | String | `"Jan"`, `"Jun"` | 3-letter month |
| `pyqDay` | Number | `27` | Day of month (1-31) |
| `pyqShift` | String | `"Morning"` or `"Evening"` | Exact spelling |
| `examSource` | String | `"JEE Main 2023 Jan 27 (Morning)"` | Structured format |

**Validation:**
- If `isPYQ === true`, then `pyqYear`, `pyqMonth`, `pyqDay`, and `pyqShift` MUST all be present
- For non-PYQs (`isPYQ === false`), these fields should be `null` or undefined

---

### 3. **examSource Format Standards**

**For JEE Main PYQs:**
```
"JEE Main {YEAR} {MONTH} {DAY} ({SHIFT})"
Examples:
- "JEE Main 2024 Jan 27 (Morning)"
- "JEE Main 2023 Jun 29 (Evening)"
```

**For JEE Advanced PYQs:**
```
"JEE Advanced {YEAR} Paper {1|2}"
Examples:
- "JEE Advanced 2023 Paper 1"
- "JEE Advanced 2022 Paper 2"
```

**For Non-PYQs:**
```
"Other" or specific source name
Examples:
- "Other"
- "NCERT Exercise"
- "Allen DPP"
```

❌ **NEVER use:**
- `"JEE Main PYQ"` (too generic)
- `"JEE Main 0"` (malformed)
- `"JEE Main 2023"` (missing shift details)

---

### 4. **Month Abbreviations (Standard)**

Always use 3-letter abbreviations:
```
Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
```

❌ **NEVER use:**
- Full month names: `"January"`, `"February"`
- Numbers: `"01"`, `"1"`
- Variations: `"Sept"`, `"June"`

---

### 5. **Shift Values (Standard)**

Only two allowed values:
- `"Morning"` (capitalized)
- `"Evening"` (capitalized)

❌ **NEVER use:**
- `"M"` or `"E"` (abbreviations)
- `"Afternoon"`, `"Night"`
- Variations in casing: `"morning"`, `"MORNING"`

---

## Data Integrity Rules

### 6. **No Trailing Whitespace in Text**

Question text should NEVER have trailing newlines or spaces:

❌ **WRONG:**
```json
"textMarkdown": "Question text here\\n\\n"
```

✅ **CORRECT:**
```json
"textMarkdown": "Question text here"
```

**Prevention:** Run `.trim()` and `.replace(/\\n+$/, '')` on all text fields before saving.

---

### 7. **Backup Before Bulk Operations**

Before running ANY script that modifies question data:
1. Create a timestamped backup: `{filename}_backup_{YYYYMMDD}.json`
2. Verify backup integrity
3. Run the script
4. Validate results before deleting backup

**Example:**
```bash
cp chapter_mole_concept.json chapter_mole_concept_backup_20260216.json
node scripts/process_questions.js
# Verify results
# Only then delete backup if everything is correct
```

---

### 8. **Validation After Every Import/Update**

After importing or updating questions, ALWAYS run validation:

```bash
node scripts/validate_questions.js
```

**Check for:**
- Missing required fields
- Malformed `examSource`
- Dates embedded in `textMarkdown`
- Inconsistent shift values
- Missing `pyqYear` for PYQs

---

## Frontend Integration Rules

### 9. **Always Use Dedicated Fields, Never Parse Text**

❌ **WRONG:**
```tsx
const year = question.examSource?.match(/\d{4}/)?.[0]
const shift = question.examSource?.split(' - ')[1]
```

✅ **CORRECT:**
```tsx
const year = question.pyqYear
const shift = question.pyqShift
```

**Why:** Parsing is fragile and breaks when format changes. Dedicated fields are reliable and type-safe.

---

### 10. **Type Safety - Always Update TypeScript Interfaces**

When adding new fields to questions:
1. Update `app/the-crucible/types.ts` first
2. Update MongoDB schema in `scripts/push_json_to_mongo.js`
3. Update any API types
4. Run TypeScript check: `npm run type-check`

---

## Common Anti-Patterns to Avoid

### ❌ Pattern 1: Generic examSource
```json
{
  "examSource": "JEE Main PYQ",  // Too generic!
  "pyqYear": null
}
```

### ❌ Pattern 2: Date in Text
```json
{
  "textMarkdown": "Question...\\n29 Jun 2022 (E)",  // Date should not be here!
  "examSource": "JEE Main PYQ"
}
```

### ❌ Pattern 3: Inconsistent Formatting
```json
{
  "pyqMonth": "June",  // Should be "Jun"
  "pyqShift": "M"      // Should be "Morning"
}
```

### ❌ Pattern 4: Missing Metadata
```json
{
  "isPYQ": true,
  "pyqYear": 2023,
  // Missing pyqMonth, pyqDay, pyqShift!
}
```

---

## Automated Prevention

### Scripts to Create/Update:

1. **`validate_pyq_metadata.js`** - Run before every MongoDB sync
   - Checks all PYQs have required fields
   - Validates format standards
   - Flags inconsistencies

2. **`clean_question_text.js`** - Run during import
   - Removes trailing whitespace
   - Extracts embedded dates
   - Populates metadata fields

3. **Pre-commit hook**
   - Validates question JSON files
   - Prevents commits with malformed data

---

## Migration Checklist

When processing old PYQ data:

- [ ] Extract dates from `textMarkdown`
- [ ] Populate `pyqYear`, `pyqMonth`, `pyqDay`, `pyqShift`
- [ ] Update `examSource` to structured format
- [ ] Remove date strings from question text
- [ ] Create backup before processing
- [ ] Validate all changes
- [ ] Sync to MongoDB
- [ ] Test frontend displays correctly
- [ ] Verify filters work in admin panel

---

## Quick Reference: Field Dependencies

```
if isPYQ === true:
  REQUIRED: pyqYear, pyqMonth, pyqDay, pyqShift, examSource
  examSource FORMAT: "JEE Main {YEAR} {MONTH} {DAY} ({SHIFT})"
  
if isPYQ === false:
  pyqYear = null
  pyqMonth = null
  pyqDay = null
  pyqShift = null
  examSource = "Other" or specific source
```

---

## Contact & Updates

**Last Updated:** 2026-02-16  
**Issue Tracker:** Document new patterns discovered during development  
**Review:** Update this document whenever new issues are identified
