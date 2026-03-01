# Resequencing ch12_carbonyl Questions (ALDO-016 to ALDO-258)

## Problem
250+ questions are out of order relative to the source PDF, making it hard to match questions to diagrams during image upload.

## Solution: 3 Options

---

### **Option 1: Manual Resequencing via Admin Dashboard (Recommended)**

**Pros:** No scripts, uses existing UI, full control  
**Cons:** Manual work for 243 questions

#### Steps:

1. **Export Current Questions**
   - Open `/crucible/admin`
   - Filter: Chapter = `Aldehydes, Ketones and Carboxylic Acids`
   - Click **Export** (FileDown icon)
   - Select all questions → Export to **Excel**

2. **Reorder in Spreadsheet**
   - Open exported file in Excel/Google Sheets
   - Sort by: `exam_year DESC`, `exam_month`, `exam_day`, `exam_shift`
   - This groups questions by paper (e.g., all "JEE Main 2024 Jan 31 Morning" together)
   - Manually drag rows to match your PDF sequence
   - Add column `new_sequence`: 16, 17, 18, 19... (for ALDO-016, ALDO-017...)
   - Add column `new_display_id`: formula `="ALDO-" & TEXT(new_sequence, "000")`

3. **Bulk Update via API**
   - Save spreadsheet as CSV
   - Use the script below to generate PATCH requests for each question

---

### **Option 2: Chronological Auto-Sequencing**

**Assumption:** Questions should be ordered by exam date (newest → oldest)

#### Steps:

1. Run this script to auto-sequence by exam metadata:

```bash
node scripts/auto_resequence_carbonyl_by_date.js
```

This will:
- Fetch all ALDO questions
- Sort by: year DESC, month, day, shift
- Assign ALDO-016, ALDO-017... in that order
- Generate a preview file for you to review
- Ask for confirmation before updating

**Caveat:** This assumes your PDF is organized chronologically. If not, use Option 1.

---

### **Option 3: Metadata-Based Mapping**

**Best for:** When you have a clear mapping of exam metadata → PDF page/sequence

#### Steps:

1. Create a mapping file `carbonyl_sequence_map.txt`:

```
# Format: exam_year | exam_month | exam_day | exam_shift | new_sequence
2024 | Jan | 31 | Morning | 16
2024 | Jan | 31 | Evening | 20
2024 | Jan | 30 | Morning | 24
...
```

2. Run the mapping script:

```bash
node scripts/apply_carbonyl_sequence_map.js carbonyl_sequence_map.txt
```

This will:
- Match each question by exam metadata
- Assign the new display_id based on your mapping
- Handle duplicates/conflicts

---

## Quick Fix Script (Option 2 Implementation)

I'll create `auto_resequence_carbonyl_by_date.js` that:
1. Uses the `/api/v2/questions` endpoint (no MongoDB connection needed)
2. Sorts questions chronologically
3. Shows you a preview
4. Asks for confirmation
5. Updates via PATCH requests

**Advantage:** Works even if MongoDB connection times out, uses your existing API.

---

## Recommendation

**Start with Option 2** (chronological auto-sequencing) to see if the default ordering matches your PDF.

If not, export to Excel (Option 1) and manually reorder the ~20-30 papers (each paper has 5-15 questions).

Once reordered in Excel, I can generate the bulk update script for you.

---

## After Resequencing

Add a `source_sequence` field to metadata:

```json
{
  "metadata": {
    "source_reference": {
      "pdf_page": 42,
      "pdf_sequence": 156,
      "verified_against_source": true
    }
  }
}
```

This prevents future scrambling.
