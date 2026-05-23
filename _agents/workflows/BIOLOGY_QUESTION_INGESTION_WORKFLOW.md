---
description: Biology Question Ingestion Workflow — Two-Phase System (NEET-UG PYQs and practice)
---

# BIOLOGY QUESTION INGESTION WORKFLOW v1.0

> **Design principle:** Phase 1 and Phase 2 are ALWAYS separate operations. Never mix extraction and insertion in the same context window. Same rule as chemistry / physics / math — see those workflows for the full canonical Phase 1 / Phase 2 / Phase 3 (validator) / Phase 4 (insertion) machinery. This doc only enumerates the **biology-specific differences**.
>
> **Companion docs (shared canonical content):**
> - `QUESTION_INGESTION_WORKFLOW.md` — chemistry; canonical exam-metadata block, validator rules, retry-on-duplicate pattern, status policy
> - `PHYSICS_QUESTION_INGESTION_WORKFLOW.md` — physics sibling
> - `MATH_QUESTION_INGESTION_WORKFLOW.md` — math sibling
> - `biology-solution-workflow.md` — bespoke solution style for biology (NCERT-anchored, image-rich)

> **Tagging scope (project decision, 2026-05-20):** This workflow ingests biology questions tagged to the **topic level only** (`tag_<prefix>_<N>` rows defined in `taxonomyData_from_csv.ts`). Micro-concept tags are intentionally deferred — they'll be added per-chapter when ingestion depth (>200 questions in a chapter) makes them worth maintaining. Don't invent micro_topic IDs during Phase 1.

---

## QUICK REFERENCE (read this first)

### Biology Chapter Table — 32 chapters (canonical from `taxonomyData_from_csv.ts`)

> The prefixes below are **frozen** in `scripts/insert_questions.js` (`PREFIX_TO_CHAPTER` map). The insert script derives `chapter_id` and `subject` directly from `display_id`. Never invent new prefixes — if a chapter is missing, edit the insert script's table and this doc together.

```
CLASS 11 (19 chapters)
CHAPTER_ID                PREFIX   NAME
─────────────────────────────────────────────────────────────────────────────
bio11_living_world        TLW      The Living World
bio11_bio_class           BCLS     Biological Classification
bio11_plant_kingdom       PKGD     Plant Kingdom
bio11_animal_kingdom      AKGD     Animal Kingdom
bio11_morpho_plant        MOFP     Morphology of Flowering Plants
bio11_anato_plant         ANFP     Anatomy of Flowering Plants
bio11_struct_animal       SOIA     Structural Organisation in Animals
bio11_cell_unit           CUOL     Cell: The Unit of Life
bio11_biomol              BMOL     Biomolecules
bio11_cell_div            CCDV     Cell Cycle and Cell Division
bio11_photo               PHOT     Photosynthesis in Higher Plants
bio11_resp_plant          RPLN     Respiration in Plants
bio11_plant_growth        PGRO     Plant Growth and Development
bio11_breathing           BRTH     Breathing and Exchange of Gases
bio11_body_fluids         BDFL     Body Fluids and Circulation
bio11_excretion           EXCR     Excretory Products and Their Elimination
bio11_locomotion          LOMV     Locomotion and Movement
bio11_neural              NEUR     Neural Control and Coordination
bio11_chem_coord          CHCO     Chemical Coordination and Integration

CLASS 12 (13 chapters)
CHAPTER_ID                PREFIX   NAME
─────────────────────────────────────────────────────────────────────────────
bio12_sex_repro_plants    SRFP     Sexual Reproduction in Flowering Plants
bio12_human_repro         HMRP     Human Reproduction
bio12_repro_health        RPHL     Reproductive Health
bio12_inheritance         PIVR     Principles of Inheritance and Variation
bio12_mol_inh             MBIH     Molecular Basis of Inheritance
bio12_evolution           EVOL     Evolution
bio12_health_disease      HHDS     Human Health and Disease
bio12_microbes            MIHW     Microbes in Human Welfare
bio12_biotech_prin        BTPP     Biotechnology: Principles and Processes
bio12_biotech_app         BTAP     Biotechnology and Its Applications
bio12_org_pop             ORGP     Organisms and Populations
bio12_ecosystem           ECOS     Ecosystem
bio12_biodiversity        BDCV     Biodiversity and Conservation
```

> **Note on rationalisation:** NEET's official syllabus matches the post-2023 NCERT rationalisation. The six chapters dropped in 2023 — Transport in Plants, Mineral Nutrition, Digestion and Absorption, Reproduction in Organisms, Strategies for Enhancement in Food Production, Environmental Issues — are **not** in this taxonomy. If an old PYQ pulls verbatim from one of these chapters, tag it to the closest remaining chapter (e.g. transport-in-plants questions usually fit `bio11_anato_plant`; environmental-issues questions usually fit `bio12_biodiversity`) and add `force_flag: 'legacy_rationalised_chapter'` for human review.

---

## 1. BIOLOGY-SPECIFIC DIFFERENCES FROM CHEMISTRY/PHYSICS/MATH

### 1.1 No LaTeX. Text + images.

Biology questions never need LaTeX math delimiters. **Do not author any `$...$` blocks** in biology `question_text.markdown` or `solution.text_markdown`. The LaTeX validator that gates chemistry/physics/math ingestion is **bypassed** for `subject: 'biology'` documents (the validator already short-circuits on subjects without math content — see `validate_question_spacing.js`).

If a question references a chemical formula in passing (e.g., "ATP", "NADPH"), write it as plain text — never `\ce{}`. Plain text is the canonical render for biology.

### 1.2 Image-heavy questions are the norm

Roughly 30–40% of biology PYQs reference a figure (cell diagram, nephron, double helix, embryo sac, alimentary canal, etc.). For these:

- During Phase 1 extraction, **don't fabricate the figure**. Set `question_text.markdown` to the prose only, and add `force_flag: 'image_pending'` with a short description of what the figure shows.
- The image is uploaded separately via the admin UI's asset uploader after Phase 2 insertion. Wire the asset via `question_text.assets[].asset_id`.
- Never invent `[FIGURE: ...]` placeholder blocks in markdown — the admin handles image attachment.

### 1.3 Dominant question natures: assertion-reason, match-column, statement-truth

NEET biology lean ~60% toward these formats vs. straight MCQ. Use the existing `metadata.questionNature` field consistently:

| Pattern | `questionNature` value |
|---|---|
| "Assertion (A): … Reason (R): …" with 4 standard options | `'Comparative'` |
| "Match List-I with List-II" | `'Comparative'` |
| "Which of the following statements is/are correct?" | `'Conceptual'` |
| Straight single-correct fact recall | `'Recall'` |
| Diagram-labelling question | `'Graphical'` |
| Pathway/process step-ordering | `'Mechanistic'` |

(Same enum as chemistry/physics — we don't introduce biology-specific values.)

**MTC table format (CRITICAL — renderer detects only this pattern):**

Every Match-the-Column question's `question_text.markdown` MUST use the canonical 4-column table layout below. The renderer (`packages/ui/MathRenderer.tsx`) applies the proper match-the-column styling (paired columns, bordered cells, `<th colspan="2">` headers) ONLY when it sees this exact header pattern — an empty cell before each list header.

✅ Canonical (use this):

```markdown
| | List I | | List II |
|---|---|---|---|
| A | first item  | I   | first match  |
| B | second item | II  | second match |
| C | third item  | III | third match  |
| D | fourth item | IV  | fourth match |
```

❌ Do NOT use:
- 2-column `| List I | List II |` with `(A)` / `(I)` labels embedded inside cells.
- Plain text lists like `List I: A. ... B. ... List II: I. ... II. ...`.

Use uppercase `A B C D` for list-I labels and uppercase `I II III IV` for list-II labels in their own narrow cells — no parentheses, no trailing period.

### 1.4 NCERT reference is REQUIRED for every NEET PYQ

NEET draws ~85% of questions verbatim from NCERT lines. Every PYQ ingested via this workflow MUST set `metadata.ncert_reference`:

```js
metadata: {
  // ... other fields ...
  ncert_reference: {
    class: 11,                              // required: 11 or 12
    chapter_number: 8,                      // NCERT TOC chapter number
    chapter_name: 'Cell: The Unit of Life', // NCERT title (informational)
    page: 132,                              // optional but recommended
    line: 'Para 2, Line 4',                 // free-text, e.g. "Fig 8.3 caption"
    edition: '2023-Rationalised',           // distinguishes pre/post rationalisation
  },
}
```

For practice questions (`sourceType: 'Practice'`) the NCERT reference is *optional* but encouraged when the question maps to a specific NCERT line.

> **Important:** `ncert_reference.chapter_number` is the **NCERT TOC chapter number**, not the Crucible sequence_order. The chapter number rationale lives in the NCERT physical book — e.g. "Cell: The Unit of Life" was Ch 8 in pre-2023 NCERT and remains Ch 8 in the 2023-Rationalised edition.

### 1.5 Exam attribution — NEET-specific rules

| Field | NEET (pre-2027) | NEET (2027+ online, multi-shift) |
|---|---|---|
| `applicableExams` | `['NEET']` | `['NEET']` |
| `sourceType` | `'PYQ'` | `'PYQ'` |
| `examDetails.exam` | `'NEET_UG'` | `'NEET_UG'` |
| `examDetails.year` | e.g. `2024` | e.g. `2027` |
| `examDetails.month` | `'May'` (or month of conduct) | `'May'` |
| `examDetails.shift` | **omit** (single-shift exam) | `'Shift-I'` or `'Shift-II'` |
| `examDetails.paper` | **omit** | **omit** (NEET has one paper) |
| `examDetails.phase` | **omit** EXCEPT for 2020 / re-test years (`'Phase-1'` / `'Phase-2'`) | omit unless re-test |

> NEET-UG is one paper, one shift, once a year through 2026. NTA has announced NEET moves online from 2027 with potential multiple shifts. Schema already supports `shift?: string` as optional — when 2027 ingestion starts, just populate the field.

### 1.6 Question source mix

Biology has three main source streams to ingest in this order:

1. **NEET-UG PYQs (2010–present)** — primary, ~50–80 Qs per year × 15 years ≈ 750–1200 Qs. The biggest single source.
2. **AIIMS / re-test PYQs (2010–2019)** — AIIMS merged into NEET in 2019, so older AIIMS PYQs are valuable for chapters with thin NEET coverage. Tag as `applicableExams: ['NEET']`, `sourceType: 'PYQ'`, and prefix `examDetails.phase` with `'AIIMS-Legacy'`.
3. **Coaching practice (Allen / Aakash / PW chapter modules)** — `sourceType: 'Practice'`, no `examDetails` required.

Never auto-translate NCERT exemplar problems into PYQs. Exemplar = `sourceType: 'NCERT_Exemplar'`.

---

## 2. CANONICAL EXAM-METADATA BLOCK (shared with chem/physics/math)

The shared block lives in `QUESTION_INGESTION_WORKFLOW.md` (chemistry). It's identical here except the `examDetails.exam` enum is constrained to `'NEET_UG'` (and `'NEET_PG'` once we expand into postgraduate medical, which is not in scope today).

---

## 3. STATUS POLICY (shared)

All new biology questions are inserted with `status: 'published'`. There is no review gate. If a question has a problem, **flag it via `flags[]`** instead of holding it in `'review'`. See CLAUDE.md §4.5 for the canonical policy.

---

## 4. PHASE 1 BUFFER FILE PATTERN

Same as chemistry/physics/math: `scripts/_phase1_buffer_<prefix>.js` exporting `{ questions: [...] }`. The buffer file must:

1. Export every question with a populated `metadata.ncert_reference` block (see §1.4)
2. Set `metadata.subject: 'biology'`
3. Set `metadata.chapter_id` to one of the 32 biology chapter IDs (or leave it null and let `insert_questions.js` derive it from the display_id prefix)
4. Use only the topic-level tags defined in the taxonomy (`tag_<prefix>_<N>`) — no `micro_topic` IDs yet
5. For PYQs without an answer key yet, use `answer_pending` mode per the chemistry workflow's bulk-apply pattern

Display IDs are auto-assigned by `insert_questions.js` using the prefix from `PREFIX_TO_CHAPTER`. Example: `CUOL-001`, `MBIH-042`.

---

## 5. PHASE 2 INSERTION

```bash
node scripts/insert_questions.js scripts/_phase1_buffer_cuol.js
```

The generic insert script handles biology with no changes (subject is derived from the `bio*` chapter prefix). Status is automatically `published`. `display_id` is auto-incremented per the live max for each prefix.

---

## 6. VALIDATOR

Run `node scripts/validate_pyq_metadata.js` after each insertion batch to confirm:
- `applicableExams` includes `'NEET'`
- `examDetails.exam === 'NEET_UG'` for PYQs
- `examDetails.shift` is **absent or null** for pre-2027 NEET PYQs (the validator will warn on populated shifts)
- `ncert_reference.class ∈ {11, 12}` is set on every PYQ
- Every question is tagged to at least one valid `tag_<prefix>_<N>` from the biology taxonomy

---

## 7. FIELD-NAMING RULES (canonical)

Same as chemistry/physics/math. Write to canonical schema fields only:
- `solution.text_markdown` (NOT `solution_markdown.text_markdown`)
- `question_text.markdown` (NOT `question_markdown`)
- `options[i].id` must be `'a' | 'b' | 'c' | 'd'`

See CLAUDE.md §4.5 for the full table.

---

## 8. ANTI-HALLUCINATION RULE (Rule 0)

Same as chemistry/physics/math: before extracting any question, quote the first 8 words verbatim from the source image. If you cannot quote them, the image is illegible — stop and flag it. Never generate biology content from training knowledge. If uncertain whether text came from the image or training data, write `NEEDS_REVIEW: [reason]` in that field. The biology training distribution is the most opinionated of the three NEET subjects (deep NCERT internalisation), and the temptation to "fill in" plausible NCERT phrasing is highest here. Don't.
