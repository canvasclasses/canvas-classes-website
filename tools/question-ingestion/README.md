# Question Ingestion Bundle

**Standalone bundle** for inserting questions into `questions_v2`. Designed to work
on a machine that does NOT have the full project clone — only this folder and a
valid `.env.local` are required.

The bundle contains:

| File | Purpose |
|---|---|
| `README.md` | This file — schema rules, recent changes, anti-patterns |
| `package.json` | Lists deps (`dotenv`, `mongodb`, `uuid`) |
| `insert-template.js` | Template script. Copy + edit per batch. |
| `validate-question.js` | Lints a script before insert. Catches 13+ classes of mistake. |
| `taxonomy-snapshot.json` | Frozen list of valid `chapter_id` and `tag_id` values. |
| `refresh-taxonomy-snapshot.js` | (Run on the main Mac only.) Regenerates the snapshot from `taxonomyData_from_csv.ts`. |

If anything in this folder conflicts with `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md`
in the main project, that file wins. This bundle is a practical companion focused on
the metadata schema + a working insertion template.

---

## One-time setup on the other Mac

```bash
# Copy this folder anywhere you like:
cp -r tools/question-ingestion ~/canvas-ingestion
cd ~/canvas-ingestion

# Install Node dependencies:
npm install

# Place .env.local next to the bundle (must contain MONGODB_URI):
cp /path/to/your/.env.local .

# Smoke test — should print "OK — 1 question(s) pass validation":
node validate-question.js insert-template.js
```

The bundle looks for `.env.local` in the bundle folder first, then walks up to
common parent locations. Either keep it inside the bundle (recommended for the
standalone Mac) or symlink it.

## Per-batch workflow

```bash
# 1. Copy the template
cp insert-template.js insert_atom_b5.js

# 2. Edit the QUESTIONS array (and CHAPTER_ID / DISPLAY_ID_PREFIX if needed)

# 3. Validate before insert — runs in <2 seconds
node validate-question.js insert_atom_b5.js

# 4. If clean, run the actual insert
node insert_atom_b5.js
```

## Keeping the taxonomy snapshot in sync

The other Mac validates against `taxonomy-snapshot.json` shipped with this bundle.
Whenever the main project's taxonomy changes (new chapter, new topic tag, etc.),
the snapshot must be refreshed and the bundle re-copied:

```bash
# On THIS Mac (the one with the full project):
node tools/question-ingestion/refresh-taxonomy-snapshot.js
# Then re-copy the whole tools/question-ingestion/ folder to the other Mac.
```

The snapshot file has a `generated_at` timestamp. The validator prints this
timestamp on every run so you'll notice if the other Mac is running with stale
taxonomy data.

---

## What changed recently — read this first

The schema for `questions_v2.metadata` is **mid-migration** from a v1 to a v2 taxonomy.
Old fields are still required (legacy code reads them). New fields must be populated
on every new question. **Set both, kept in sync.**

### 1. Three-tier exam taxonomy (NEW)

| New field (set on all new questions) | Replaces | Why |
|---|---|---|
| `metadata.applicableExams: ('JEE'\|'NEET'\|...)[ ]` | `examBoard: 'JEE' \| 'NEET'` | Array — a question can target JEE *and* NEET simultaneously. Single field forced an artificial choice. |
| `metadata.sourceType: 'PYQ'\|'NCERT_Textbook'\|'NCERT_Exemplar'\|'Practice'\|'Mock'` | `is_pyq: boolean` | Boolean lumped NCERT examples / practice / mock all under one bucket. |
| `metadata.examDetails: { exam, year, month, phase, shift, paper }` | `metadata.exam_source` | Enum-constrained `exam` field (`'JEE_Main'\|'JEE_Advanced'\|'NEET_UG'\|'NEET_PG'`) — old field was a free-text string with inconsistent values. |

### 2. Browse mode now sorts by NCERT topic flow

The student-facing browse view orders questions by the **primary tag** (`metadata.tags[0].tag_id`)
matched against `app/the-crucible/lib/ncertTopicOrder.ts`. This means:

> **The first tag you put in `metadata.tags` MUST be the most-relevant topic for that question.**
> Secondary/related tags follow.

If a question is primarily about Bohr's Model with a side reference to electronic
configuration, set `tags[0].tag_id = 'tag_atom_6'` (Bohr) and `tags[1] = 'tag_atom_7'`
(electronic config). Reversing this order will misplace the question in the chapter flow.

`weight` values are **not** used for sorting. Set them to anything sensible (e.g., 1.0
for primary, 0.5 for secondary). The order in the array is what matters.

### 3. Chapter category fixes

These two were in the wrong category — fixed in `taxonomyData_from_csv.ts`:

| Chapter | Old `chapterType` | New `chapterType` |
|---|---|---|
| `ch11_periodic` (Classification of Elements) | `physical` | `inorganic` |
| `ch11_bonding` (Chemical Bonding) | `physical` | `inorganic` |

If your other system has an older copy of `taxonomyData_from_csv.ts`, sync it via git
pull. Don't edit it manually.

### 4. Question count display fix (no schema impact)

A streaming bug that capped browse mode at 160 questions per chapter was fixed.
This affects rendering only — no implication for ingestion.

---

## Required document shape

Every document inserted into `questions_v2` must have the following structure.
Fields marked **(both)** must be set on the new field *and* its legacy mirror.

```js
{
  _id: '<uuid v4>',                       // never new ObjectId() — must be uuidv4()
  display_id: '<PREFIX>-<NNN>',           // e.g. 'ATOM-261' — see PREFIX_MAP below
  question_text: { markdown: '...' },     // LaTeX inline only via $...$, never $$...$$
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ',

  options: [                              // present for SCQ/MCQ; omit for NVT
    { id: 'A', text: '...', is_correct: false },
    { id: 'B', text: '...', is_correct: true },
    { id: 'C', text: '...', is_correct: false },
    { id: 'D', text: '...', is_correct: false },
  ],

  answer: {                               // present for NVT; omit otherwise
    integer_value: 12,                    // or decimal_value, with optional tolerance + unit
  },

  solution: {
    text_markdown: '...',                 // ≥ 20 chars; LaTeX rules same as question
    asset_ids: { images: [], svg: [], audio: [] },  // optional
    video_url: undefined,                 // optional
    latex_validated: false,
  },

  metadata: {
    chapter_id: 'ch11_atom',              // MUST exist in taxonomyData_from_csv.ts
    subject: 'chemistry',                 // 'chemistry' | 'physics' | 'maths' | 'biology'
    difficultyLevel: 3,                   // 1-5 (L1, L2 = Easy; L3 = Medium; L4 = Tough; L5 = Advanced)

    tags: [                               // PRIMARY TAG FIRST. Browse sort depends on this.
      { tag_id: 'tag_atom_6', weight: 1.0 },   // primary — drives the sort
      { tag_id: 'tag_atom_7', weight: 0.5 },   // secondary (optional)
    ],

    // ── 3-tier exam taxonomy (new — always set these) ──
    applicableExams: ['JEE'],             // ['JEE'], ['NEET'], or ['JEE', 'NEET'] for dual-use
    sourceType: 'PYQ',                    // 'PYQ' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Practice' | 'Mock'
    examDetails: {                        // omit entirely for non-PYQ
      exam: 'JEE_Main',                   // 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG'
      year: 2025,
      month: 'Apr',                       // optional
      shift: 'Evening',                   // optional
      paper: 'Paper 1',                   // optional, JEE Adv only
    },

    // ── Legacy mirrors (set on every new question for back-compat) ──
    examBoard: 'JEE',                     // = applicableExams[0]
    is_pyq: true,                         // = (sourceType === 'PYQ')
    exam_source: {                        // = mirror of examDetails (different field names)
      exam: 'JEE Main',                   // free-text — match the spelling used by old data
      year: 2025,
      month: 'Apr',
      shift: 'Evening',
    },

    is_top_pyq: false,                    // true for curated "must-do" questions; default false
  },

  status: 'review',                       // 'draft' | 'review' | 'published' | 'archived'
  quality_score: 50,
  needs_review: false,
  version: 1,
  created_by: 'ingestion_script_<name>',
  updated_by: 'ingestion_script_<name>',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  asset_ids: [],
}
```

### Display ID prefixes

Always use the canonical prefix for the chapter. Mismatched prefixes break the admin
filter and the `generateNextDisplayId` retry logic.

| Class 11 Chemistry | Prefix | Class 12 Chemistry | Prefix |
|---|---|---|---|
| `ch11_mole` | `MOLE` | `ch12_solutions` | `SOL` |
| `ch11_atom` | `ATOM` | `ch12_electrochem` | `EC` |
| `ch11_periodic` | `PERI` | `ch12_kinetics` | `CK` |
| `ch11_bonding` | `BOND` | `ch12_pblock` | `PB12` |
| `ch11_thermo` | `THERMO` | `ch12_dblock` | `DNF` |
| `ch11_chem_eq` | `CEQ` | `ch12_coord` | `CORD` |
| `ch11_ionic_eq` | `IEQ` | `ch12_haloalkanes` | `HALO` |
| `ch11_redox` | `RDX` | `ch12_alcohols` | `ALCO` |
| `ch11_pblock` | `PB11` | `ch12_carbonyl` | `ALDO` |
| `ch11_goc` | `GOC` | `ch12_amines` | `AMIN` |
| `ch11_hydrocarbon` | `HC` | `ch12_biomolecules` | `BIO` |
| `ch11_prac_org` | `POC` | `ch12_salt` | `SALT` |

### Picking the right primary tag

The primary tag drives where the question appears in NCERT-ordered browse view.
For each Class 11/12 chemistry chapter, the canonical NCERT topic order is defined
in `app/the-crucible/lib/ncertTopicOrder.ts`. Pick the tag that best represents
the **single core concept** the question tests.

If the question genuinely spans multiple topics, pick the topic that appears
earliest in NCERT (so the student sees it as soon as they reach that section)
and add the secondary topic as `tags[1]`.

If you're unsure, the question is probably mis-categorized — flag it `status: 'review'`
and let a human pick the tag.

---

## Anti-patterns — never do these

1. **Don't use `node -e "..."`** for any script that contains LaTeX. Shell escaping
   corrupts backslashes. Always write a `.js` file.
2. **Don't set `_id: new ObjectId()`** — must be `uuidv4()`.
3. **Don't skip the legacy-mirror fields** (`examBoard`, `is_pyq`, `exam_source`) on
   new questions. Old read paths still depend on them until the migration completes.
4. **Don't put a secondary topic in `tags[0]`** — the primary slot drives the sort,
   so this misplaces the question in browse view.
5. **Don't generate `display_id` blindly** — query the current max for the prefix
   and increment, with a retry on E11000 duplicate key errors.
6. **Don't write `$$...$$` LaTeX delimiters** — only `$...$` for inline math. Double
   dollars cause oversized rendering.
7. **Don't fabricate exam metadata.** If you can't read the year/shift cleanly from
   the source PDF, write `NEEDS_REVIEW: <reason>` in that field and leave the year
   off. The fix-up scripts can backfill later.
