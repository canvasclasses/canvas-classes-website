# 📂 DATA SOURCE DOCUMENTATION - THE CRUCIBLE

## ⚠️ CRITICAL: Correct Data Sources

This document clarifies the correct data sources to prevent confusion from stale/archived files.

---

## ✅ CURRENT ACTIVE DATA SOURCES

### **Question Data**
**Location:** `/data/chapters/`

**Active Files:**
- `ch11_mole.json` - Mole Concept questions
- `ch11_atom.json` - Atomic Structure questions
- `ch11_periodic.json` - Periodic Table questions
- ... (all other chapter files)

**Format:**
```json
{
  "chapter_info": { ... },
  "questions": [
    {
      "display_id": "MOLE-001",
      "question_text": { "markdown": "...", "latex_validated": true },
      "options": [ { "id": "a", "text": "...", "is_correct": false } ],
      "solution": { "text_markdown": "...", "latex_validated": true },
      "metadata": { ... }
    }
  ]
}
```

**Key Characteristics:**
- Snake_case field names (`is_correct`, `text_markdown`)
- Nested structure with `chapter_info` and `questions` array
- LaTeX validation flags
- Proper metadata structure

---

## ❌ ARCHIVED/OBSOLETE DATA SOURCES

### **Old Question Format (DO NOT USE)**
**Location:** `/data/questions/` (ALL FILES ARCHIVED)

**Archived Files (21 total):**
1. `chapter_basic_concepts_mole_concept.json.OLD_ARCHIVED` - 179 questions (MOLE-013 to MOLE-199)
2. `chapter_atomic_structure.json.OLD_ARCHIVED` - ~224 KB
3. `chapter_structure_of_atom.json.OLD_ARCHIVED` - ~266 KB
4. `chapter_uncategorized.json.OLD_ARCHIVED` - ~162 KB
5. `chapter_chemical_equilibrium.json.OLD_ARCHIVED` - ~85 KB
6. `chapter_general_organic_chemistry.json.OLD_ARCHIVED`
7. `chapter_salt_analysis.json.OLD_ARCHIVED`
8. `chapter_hydrocarbons.json.OLD_ARCHIVED`
9. `chapter_coordination_compounds.json.OLD_ARCHIVED`
10. `chapter_chemical_bonding.json.OLD_ARCHIVED`
11. `chapter_stereochemistry.json.OLD_ARCHIVED`
12. `chapter_aldehydes_ketones_and_carboxylic_acids.json.OLD_ARCHIVED`
13. `chapter_biomolecules.json.OLD_ARCHIVED`
14. `chapter_solutions.json.OLD_ARCHIVED`
15. `chapter_amines.json.OLD_ARCHIVED`
16. `chapter_periodic_properties.json.OLD_ARCHIVED`
17. `chapter_d_and_f_block.json.OLD_ARCHIVED`
18. `chapter_chemical_kinetics.json.OLD_ARCHIVED`
19. `chapter_electrochemistry.json.OLD_ARCHIVED`
20. `chapter_aromatic_compounds.json.OLD_ARCHIVED`
21. `chapter_thermodynamics.json.OLD_ARCHIVED`

**Format (OLD - Don't Use):**
```json
[
  {
    "id": "MOLE-013",
    "textMarkdown": "...",
    "options": [ { "id": "a", "text": "...", "isCorrect": false } ],
    "solution": { "textSolutionLatex": "..." }
  }
]
```

**Why Archived:**
- Old camelCase format (`isCorrect`, `textMarkdown`)
- Flat array structure (no chapter info)
- From before database cleanup
- Contains questions that were deleted
- **All 21 files archived on February 17, 2026**

---

## 🗄️ MONGODB COLLECTIONS

### **Active Collection: `questions_v2`**
- Current production collection
- Contains all active questions
- Used by admin dashboard
- Synced from `/data/chapters/` files

**Current Status:**
- ch11_mole: 16 questions (MOLE-001 to MOLE-016)

### **Deprecated Collection: `questions`**
- Old collection (empty)
- Not used by current system
- Kept for historical reference only

---

## 📊 CURRENT QUESTION INVENTORY

### **Mole Concept Chapter (ch11_mole)**

**Source File:** `/data/chapters/ch11_mole.json`

**Question Count:** 16 questions

**ID Range:** MOLE-001 to MOLE-016

**Next Question ID:** MOLE-217

**Status:** ✅ Active, synced to MongoDB

---

## 🔄 INGESTION PIPELINE

### **Correct Workflow:**

1. **Create/Edit Questions** → `/data/chapters/ch11_mole.json`
2. **Run Pipeline** → `node scripts/complete_pipeline.js`
3. **Sync to MongoDB** → `questions_v2` collection
4. **View in Dashboard** → `http://localhost:3000/crucible/admin`

### **DO NOT:**
- ❌ Edit files in `/data/questions/` (archived)
- ❌ Use old format with camelCase
- ❌ Reference `questions` collection (deprecated)
- ❌ Start question IDs below MOLE-217

---

## 🚨 PREVENTING CONFUSION

### **For AI Agents:**

When asked about question counts or IDs:

1. **Always check:** `/data/chapters/ch11_mole.json`
2. **Never reference:** `/data/questions/chapter_basic_concepts_mole_concept.json.OLD_ARCHIVED`
3. **Verify in MongoDB:** `questions_v2` collection only
4. **Use workflow:** Follow `QUESTION_INGESTION_WORKFLOW.md`

### **For Developers:**

- The `/data/questions/` folder contains archived data only
- All active development uses `/data/chapters/` structure
- Pipeline script (`complete_pipeline.js`) reads from `/data/chapters/`
- Admin dashboard reads from `questions_v2` collection

---

## 📋 VERIFICATION CHECKLIST

Before adding new questions, verify:

- [ ] Checking correct file: `/data/chapters/ch11_mole.json`
- [ ] Last question ID in file: MOLE-216
- [ ] MongoDB `questions_v2` count: 16 questions
- [ ] Next question starts at: MOLE-217
- [ ] Not referencing archived files in `/data/questions/`

---

## 🔧 CLEANUP ACTIONS TAKEN

**Date:** February 17, 2026

**Actions:**
1. ✅ Archived **21 old chapter files** in `/data/questions/` → `.OLD_ARCHIVED`
2. ✅ Verified MongoDB `questions_v2` has correct 16 questions
3. ✅ Confirmed `questions` collection is empty (deprecated)
4. ✅ Documented correct data sources
5. ✅ Created archive script: `scripts/archive_old_chapter_files.js`

**Files Archived:**
- All old format chapter files (21 total)
- Includes: mole concept, atomic structure, chemical equilibrium, etc.
- Total size: ~1.2 MB of archived data

**Result:**
- ✅ No more confusion between current vs old questions
- ✅ Clear separation between active and archived data
- ✅ Single source of truth: `/data/chapters/` folder
- ✅ Future chapters won't clash with old files
- ✅ System ready for clean expansion

---

## 📞 SUMMARY

**Current State:**
- ✅ 16 active MOLE questions (MOLE-001 to MOLE-016)
- ✅ Stored in `/data/chapters/ch11_mole.json`
- ✅ Synced to MongoDB `questions_v2` collection
- ✅ Old 179-question file archived
- ✅ Next question: MOLE-217

**No Discrepancies - System is Clean**

---

**Last Updated:** February 17, 2026  
**Maintained By:** Canvas Classes Development Team
