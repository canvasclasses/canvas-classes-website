# ADR-008: Add Biology as a first-class subject (NEET-UG track)

**Status:** Accepted
**Date:** 2026-05-20
**Tags:** taxonomy, subjects, neet, biology, schema

## Context

Through Phase 6 the Crucible bank covered three subjects — Chemistry,
Physics, Maths — keyed by `metadata.subject ∈ {'chemistry', 'physics',
'maths'}`. The Question.v2 schema, the Zod validator, and the
MockTestSet schema had already widened their `subject` enums to include
`'biology'` in anticipation, but no taxonomy, no prefix mappings, no
RBAC, and no admin UI surface existed for biology questions. Class 9
biology chapters (`bio9_*`) lived in the taxonomy as a side-effect of
the NCERT books feature, but those chapters never received question
ingestion.

The decision to actually start ingesting biology questions raised three
design choices that needed locking before code went in:

1. **Single subject vs. botany/zoology split.** NEET internally
   structures its biology paper as 50 botany + 50 zoology. Several
   coaching brands (Allen, Aakash) tag chapters that way internally.
   The first cut at this decision suggested adding three `chapterType`
   variants — `botany`, `zoology`, `biology_common` — to the existing
   `chapterType` union (which already had subject-specific groupings
   like `physical`/`inorganic`/`organic` for chemistry).
2. **Pre- vs. post-rationalisation chapter list.** The 2023 NCERT
   rationalisation removed 6 chapters from the Class 11–12 syllabus
   (Transport in Plants, Mineral Nutrition, Digestion and Absorption,
   Reproduction in Organisms, Strategies for Enhancement in Food
   Production, Environmental Issues). NEET 2024–2026 still tested some
   of them; NEET 2027+ likely won't.
3. **NCERT-line-level reference field.** ~85% of NEET PYQs trace
   verbatim to NCERT lines. Coaching brands track this; the Crucible
   schema didn't.

## Decision

### 1. Single `chapterType: 'biology'` — no botany/zoology subdivision.

The admin dashboard's subject pills (Chemistry, Physics, Maths) are the
operator's mental model. Splitting biology into three internal
sub-types would force a 4th and 5th pill (or worse, a hidden second
dimension on existing pills), creating a confusing operator UX. NEET's
50+50 botany/zoology split is a *paper-construction* concern, not a
*question-bank* concern — once we add a NEET mock-test paper builder, it
can derive botany/zoology assignment from chapter membership (a static
lookup table), without needing it baked into `chapterType`.

Concretely: all 32 biology chapters get `chapterType: 'biology'`, and
the `Subject` union in `UserRole.ts` / `usePermissions.ts` widens to
`'chemistry' | 'physics' | 'mathematics' | 'biology'`.

### 2. Post-rationalisation 32-chapter list.

The taxonomy reflects the **current** NEET 2026+ syllabus (19 Class 11
chapters + 13 Class 12 chapters). The 6 rationalised chapters are
excluded. PYQs from 2023 and earlier that pulled from those chapters
will be tagged to the closest remaining chapter, with a
`force_flag: 'legacy_rationalised_chapter'` for human review at solution
time.

Rationale: keeping the rationalised chapters would create dead taxonomy
nodes that need ongoing maintenance and would clutter the admin UI's
chapter picker forever. The blast radius of the alternative (re-tagging
old PYQs) is small and one-time.

### 3. Add `metadata.ncert_reference` to Question.v2 as an optional
   field for all subjects, **required** for biology PYQs.

```ts
ncert_reference?: {
  class: 11 | 12;
  chapter_number?: number;
  chapter_name?: string;
  page?: number;
  line?: string;
  edition?: string;   // e.g. "2023-Rationalised"
};
```

Optional everywhere in the schema, but `BIOLOGY_QUESTION_INGESTION_WORKFLOW.md`
mandates it for any PYQ with `applicableExams: ['NEET']`. Other
subjects can populate it opportunistically (NEET-style "from NCERT"
chemistry questions also benefit) but the workflow docs for those
subjects don't require it.

The field is **not indexed.** Access pattern is per-question read, not
filter-by-NCERT-page.

### 4. NEET PYQ shift handling: schema-ready, conventionally absent.

For NEET PYQs through 2026 (single-shift, single-paper exam),
`examDetails.shift` and `examDetails.paper` are **omitted entirely** —
not set to `null`, not set to empty string. The Mongoose schema's
`shift: { type: String }` already makes the field optional. When NEET
moves online in 2027 with shifts, ingestion just starts populating the
field, no schema change required. The `formatExamLabel()` helper
already handles the "no shift" rendering case (it falls through to
`"NEET 2024"` style labels).

## Consequences

### Positive

- **Operator UX stays uniform.** Biology is "another subject" with one
  pill, not a new dimension. Chemistry / Physics / Maths / Biology read
  as a flat list everywhere.
- **No new chapterType migrations.** The existing `chapterType: 'biology'`
  pattern (used by Class 9 chapters since the books feature) extends
  cleanly to Class 11–12.
- **NCERT citation is captured at ingestion time.** Retrofitting NCERT
  references onto already-ingested questions would be expensive and
  error-prone.
- **Shift handling is future-proof.** When NEET goes online, no schema
  migration is required — just a workflow doc update.

### Negative / open questions

- **Botany/zoology paper construction is deferred.** When we build the
  NEET mock-test paper builder, we'll need a static
  `chapter_id → 'botany' | 'zoology' | 'common'` lookup table somewhere
  (probably a constant in `packages/data/taxonomy/`). That hasn't been
  designed yet — it's deliberate scope deferral.
- **`'maths'` vs. `'mathematics'` drift persists.** Question.v2 uses
  `'maths'`, but `UserRole.ts` and `usePermissions.ts` use
  `'mathematics'`. This pre-existing drift is documented in the
  audit but not fixed in this change — adding biology mirrors the
  existing convention (both subject types now have an extra `'biology'`
  entry). A future ADR can normalise the math naming.
- **Display ID prefix `BIO` was already taken.** Chemistry's
  `ch12_biomolecules` uses prefix `BIO`. The biology chapter
  "Biomolecules" (`bio11_biomol`) therefore uses `BMOL` instead. This
  is a minor naming wart and worth flagging here so future maintainers
  don't accidentally re-collide it.

## Implementation footprint

Single PR, 5 phases. ~10 files modified, ~950 lines changed. All
additive — no behaviour change for chemistry / physics / maths.

| Phase | Files | Lines |
|---|---|---|
| 1. Routing layer | `scripts/insert_questions.js`, `packages/data/id-generator/index.ts`, `packages/data/rbac.ts`, `packages/data/models/UserRole.ts`, `apps/admin/features/admin/components/RoleManagement.tsx` | ~70 |
| 2. Taxonomy data | `packages/data/taxonomy/taxonomyData_from_csv.ts` | ~230 |
| 3. Admin filter pill | `apps/admin/app/crucible/page.tsx`, `apps/admin/features/admin/hooks/useAdminFilterUrlSync.ts`, `apps/admin/features/admin/hooks/usePermissions.ts`, `apps/admin/app/api/v2/admin/roles/route.ts`, `apps/admin/app/api/v2/admin/permissions/route.ts` | ~15 |
| 4. NCERT reference field | `packages/data/models/Question.v2.ts`, `packages/data/schemas/question.ts` | ~30 |
| 5. Workflow docs + ADR | `_agents/workflows/BIOLOGY_QUESTION_INGESTION_WORKFLOW.md`, `_agents/workflows/biology-solution-workflow.md`, `_agents/adr/008-biology-subject-addition.md`, `CLAUDE.md` | ~600 (new files) |

## Future work

- Build `scripts/biology-solutions/` toolkit (parallel to
  `scripts/math-solutions/`).
- Build the NEET mock-test paper builder with the botany/zoology
  static lookup table.
- Resolve the `'maths'` / `'mathematics'` naming drift across the
  codebase (separate ADR).
- Consider whether the duplicate prefix maps in
  `scripts/insert_questions.js` and `packages/data/id-generator/index.ts`
  should be consolidated into a single source of truth in `@canvas/data`.
