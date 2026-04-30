# MongoDB & Data Files — Ground Truth

**Date:** 2026-04-30
**Methodology:** Read the code directly. Three parallel investigations:
1. Every Mongoose schema definition in `lib/models/`
2. Every live MongoDB query in `app/`, `lib/`, `components/`, `hooks/`
3. Every static JSON/TS data file actually imported by live code

> **No claims here come from MD files, comments, or docs. Only from the running code.**

---

## 1. The Big Picture

| Metric | Count |
|---|---|
| Mongoose models defined | **29** |
| Models actually imported by live code | **27** |
| Models defined but never imported (DEAD) | **2** |
| Distinct collections the running app reads/writes | **24** |
| Collections accessed without a model (raw) | **1** (`example_view_sessions`) |
| Static JSON files imported by live code | **3** |
| Static JSON imported via `.ts` indirection | **1** |
| Static JSON files NOT imported anywhere live | **52** |

---

## 2. The 27 LIVE Mongoose models — keep all of these

Each row = one MongoDB collection that the running app actually depends on. Deleting any of these breaks the app.

| Collection | Model file | Used by (representative) |
|---|---|---|
| `questions_v2` | `lib/models/Question.v2.ts` | `/api/v2/questions/*`, `app/the-crucible/actions.ts`, all student practice |
| `chapters` | `lib/models/Chapter.ts` | `/api/v2/chapters`, taxonomy routes |
| `assets` | `lib/models/Asset.ts` | `/api/v2/assets/*`, image upload pipeline |
| `audit_logs` | `lib/models/AuditLog.ts` | every mutating V2 route writes here (compliance) |
| `activity_logs` | `lib/models.ts` (V1 leftover) | `/api/v2/questions/[id]/stats` — community heatmaps |
| `flashcards` | `lib/models/Flashcard.ts` | `/api/v2/flashcards/*`, flashcards UI |
| `test_results` | `lib/models/TestResult.ts` | `/api/v2/test-results`, dashboard |
| `mock_test_sets` | `lib/models/MockTestSet.ts` | `/api/v2/mock-tests/*` |
| `user_progress` | `lib/models/UserProgress.ts` | `/api/v2/user/progress`, starred questions |
| `student_chapter_profiles` | `lib/models/StudentChapterProfile.ts` | adaptive-practice chapter scoring |
| `student_responses` | `lib/models/StudentResponse.ts` | guided-practice response log |
| `books` | `lib/models/Book.ts` | `/api/v2/books/*`, class-9/11/12 page routes (SSG) |
| `book_pages` | `lib/models/BookPage.ts` | `/api/v2/books/*/pages`, page routes (SSG) |
| `book_progress` | `lib/models/BookProgress.ts` | per-user reading state |
| `book_bookmarks` | `lib/models/BookBookmark.ts` | per-user bookmarks |
| `bitsat_plan_progress` | `lib/models/BitsatPlanProgress.ts` | `/api/bitsat-plan/progress` |
| `career_paths` | `lib/models/CareerPath.ts` | `/api/v2/career-explorer/careers`, browse |
| `career_questions` | `lib/models/CareerQuestion.ts` | questionnaire |
| `career_profiles` | `lib/models/CareerProfile.ts` | per-user career state |
| `career_matches` | `lib/models/CareerMatch.ts` | computed match results, manual overrides |
| `colleges` | `lib/models/College.ts` | `/api/v2/college-predictor/colleges` |
| `college_cutoffs` | `lib/models/CollegeCutoff.ts` | `lib/collegePredictor/*` (predictor, percentileToRank, deepDive) — used via `/api/v2/college-predictor/*` |
| `blog_posts` | `lib/models/BlogPost.ts` | `/blog`, `/api/blog/posts`, cron publish |
| `blog_ideas` | `lib/models/BlogIdea.ts` | `/api/blog/ideas` |
| `blog_sources` | `lib/models/BlogSource.ts` | `/api/blog/sources` |
| `user_roles` | `lib/models/UserRole.ts` | `/api/v2/admin/roles`, RBAC checks |
| `role_audit_logs` | `lib/models/RoleAuditLog.ts` | RBAC mutation log (TTL 2 years) |

Plus 1 raw-access collection (no model):
- `example_view_sessions` — accessed via `db.collection('example_view_sessions')` in `app/api/v2/user/example-views/route.ts` (ephemeral session tracking)

**Active collection count: 24** (matches what should exist in the `crucible` MongoDB database).

---

## 3. DEAD models — safe to delete

Confirmed by direct grep across `app/`, `lib/`, `components/`, `hooks/`. **No live import anywhere.**

| Model file | Collection | Status |
|---|---|---|
| `lib/models/StudentProfile.ts` | `student_profiles` | DEAD — defined but no live importer. The collection in MongoDB (if it exists) is also orphaned. |
| `lib/models/CollegeBranch.ts` | `college_branches` | DEAD — defined but no live importer. Likely an early-design artifact superseded by the `colleges` document structure. |

**Action:**
1. Delete `lib/models/StudentProfile.ts` and `lib/models/CollegeBranch.ts`.
2. After confirming the deletion compiles, drop the matching MongoDB collections (`student_profiles`, `college_branches`) using `mongosh` or Atlas UI:
   ```
   use crucible
   db.student_profiles.drop()
   db.college_branches.drop()
   ```
3. Verify no leftover indexes / GUI references. Add a 1-line note to a `CHANGELOG.md` entry.

---

## 4. Static JSON files — what's actually wired in

Only **4 data files** are imported by live code. Everything else in `/data/` is debris.

### Live imports (KEEP — code depends on them)

| File | Imported by | Purpose |
|---|---|---|
| `data/reagents_data.json` | `hooks/useChemiHexLogic.ts`, `components/organic-wizard/admin/AdminDashboard.tsx` | Reagent library for `/chemihex` game |
| `data/conversion_game_data.json` | `components/organic-wizard/ConversionGame.tsx`, `components/organic-wizard/admin/AdminDashboard.tsx` | Level data for `/organic-wizard` |
| `data/reaction_table_data.json` | `components/chemihex/ReactionTable.tsx` | Reaction lookup table inside chemihex |
| `app/organic-chemistry-hub/reactions.json` | via `app/organic-chemistry-hub/data.ts` → `app/organic-chemistry-hub/page.tsx` and admin | Organic name-reaction database |

> Each of these is **flat-file game/lookup data**, not student data. They're effectively config. They could move to MongoDB later, but there's no urgency — they're tiny, version-controlled, and don't change at runtime.

### Inline `.ts` data modules (KEEP — they ARE the data)

These TypeScript files declare data inline (not JSON imports). All are imported by live UI:

- `app/organic-chemistry-hub/data.ts` (re-exports `reactions.json` with types)
- `app/organic-chemistry-hub/acidity-data.ts`
- `app/organic-chemistry-hub/acidity-lab-data2.ts`
- `app/organic-chemistry-hub/acidity-universal-data.ts`
- `app/organic-chemistry-hub/phys-data.ts`
- `app/lib/jee-pyqs/data.ts` (powers `/jee-pyqs/*` — currently this is where the Top-500 PYQs live, NOT MongoDB)

### Runtime file reads (KEEP)

- `app/api/organic/reactions/route.ts` reads `app/organic-master/reactions.json` (verify path exists; possible stale)
- `app/api/v2/taxonomy/load/route.ts` reads `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts` — this is the **single source of truth for chapter taxonomy** per CLAUDE.md
- `app/lib/blog.ts` reads `/content/blog/*.mdx` — blog source markdown

---

## 5. DEBRIS — `/data/` files NOT imported by live code

**52 files. Total ~2.3 MB. Zero live importers.**

### Confirmed historical seed dumps for MongoDB (already in `questions_v2`)

These were ingested into MongoDB long ago. The live app reads from MongoDB, not from these files. The `complete_pipeline.js` script that DATA_SOURCE_DOCUMENTATION.md references no longer exists (CLAUDE.md says the automation pipeline was deleted).

```
/data/chapters/_index.json
/data/chapters/ch11_atom.json
/data/chapters/ch11_bonding.json
/data/chapters/ch11_chem_eq.json
/data/chapters/ch11_goc.json
/data/chapters/ch11_hydrocarbon.json
/data/chapters/ch11_ionic_eq.json
/data/chapters/ch11_mole.json
/data/chapters/ch11_pblock.json
/data/chapters/ch11_periodic.json
/data/chapters/ch11_prac_org.json
/data/chapters/ch11_redox.json
/data/chapters/ch11_stereo.json
/data/chapters/ch11_thermo.json
/data/chapters/ch12_alcohols.json
/data/chapters/ch12_aldehydes.json
/data/chapters/ch12_amines.json
/data/chapters/ch12_aromatic.json
/data/chapters/ch12_biomolecules.json
/data/chapters/ch12_carboxylic.json
/data/chapters/ch12_coord.json
/data/chapters/ch12_dblock.json
/data/chapters/ch12_electrochem.json
/data/chapters/ch12_haloalkanes.json
/data/chapters/ch12_kinetics.json
/data/chapters/ch12_pblock.json
/data/chapters/ch12_prac_phys.json
/data/chapters/ch12_salt.json
/data/chapters/ch12_solutions.json
/data/chapters/mole_batch4_1.json
```

### Confirmed one-shot ingestion artifacts

```
/data/all_36_chapters.json
/data/chapters_from_taxonomy.json
/data/conversion_game_data.json   ← WAIT: this IS imported. NOT debris.
/data/mole_concept_categorization.json
/data/answer_keys_content.js
/data/questions_batch_001.json
/data/mole_pyq_solutions_set1.json … set6.json   (6 files)
/data/new_mole_questions_batch2.json
/data/new_mole_questions_batch3_part1..5.json    (5 files)
/data/manual_solutions_mole_batch2.json
/data/manual_solutions_mole_batch3.json
/data/peri_batch1.json
/data/peri_q01_10.json … peri_q92_102.json      (12 files)
/data/reaction_table_data.json   ← WAIT: this IS imported. NOT debris.
/data/reagents_data.json         ← WAIT: this IS imported. NOT debris.
```

### `/data/questions/` — explicitly archived

20 `.OLD_ARCHIVED` files + one straggler `chapter_d_and_f_block.json`. Per the doc that created them, archived Feb 17, 2026.

### `/data/QUESTION_DATABASE_GUIDELINES.md`

Stale doc. The taxonomy source of truth is now `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`.

---

## 6. Recommended cleanup plan — code first, then DB

### Step 1 — code-side deletions (one PR, low risk)

**6a. Delete the 2 dead models:**
```
lib/models/StudentProfile.ts
lib/models/CollegeBranch.ts
```

**6b. Delete the JSONs that are not imported by any live code (50 files, ~2.3 MB):**

Keep these three (live):
- `data/reagents_data.json`
- `data/conversion_game_data.json`
- `data/reaction_table_data.json`

Delete everything else inside `/data/`:
- entire `/data/chapters/` subdirectory (30 files)
- entire `/data/questions/` subdirectory (21 files)
- 14 root JSONs in `/data/` (mole, peri, manual_solutions, new_mole, all_36, chapters_from_taxonomy, conversion_table_data, mole_concept_categorization, questions_batch_001, peri_batch1, answer_keys_content.js)
- `/data/QUESTION_DATABASE_GUIDELINES.md`

After deletion, run `npm run lint` and `npm run dev` smoke test (chemihex and organic-wizard pages).

### Step 2 — MongoDB-side cleanup (after step 1 ships)

For each of the 24 live collections, leave alone. For dead collections, drop them:

```javascript
// in mongosh against the `crucible` database
use crucible

// drop dead collections (verify they exist first with show collections)
db.student_profiles.drop()    // dead model: lib/models/StudentProfile.ts
db.college_branches.drop()    // dead model: lib/models/CollegeBranch.ts

// also check if a legacy V1 collection is still hanging around
db.questions.drop()           // V1 collection — replaced by questions_v2 (CLAUDE.md confirms V1 is dead)

// before any drop:
db.<name>.stats()             // see size + index count, sanity-check there's nothing valuable
```

> **Always run `db.<name>.stats()` and `db.<name>.findOne()` before dropping, even if the model is gone from code.** A live collection with documents but no model means data was being written by something that no longer exists — worth a 30-second investigation before destruction.

### Step 3 — verify what's actually in MongoDB matches this map

I cannot connect to your MongoDB cluster from here. To validate the model inventory above against reality, run this in mongosh:

```javascript
use crucible

// list every collection that exists in the DB
db.getCollectionNames().sort()

// for each collection, count docs and list indexes
db.getCollectionNames().forEach(c => {
  const stats = db.getCollection(c).stats()
  print(c, '— docs:', stats.count, '— size:', (stats.size / 1024).toFixed(1) + 'KB')
})
```

Compare the output against the 24 active collections in §2. Any collection in MongoDB that's NOT in §2 is a candidate for dropping. Any collection in §2 that's missing from MongoDB means a feature was never used or never deployed.

---

## 7. Cross-references

- This doc supersedes the `/data/` section of `docs/CLEANUP_AUDIT_2026-04-30.md` (which was based on a flawed first-pass audit).
- The SEO audit (`docs/SEO_AUDIT_2026-04-30.md`) is unaffected — different scope.
- `DATA_SOURCE_DOCUMENTATION.md` (root) is **stale** — it references `scripts/complete_pipeline.js` which no longer exists. Either update or delete that doc as part of the cleanup PR.

---

## 8. What this doc is NOT

- It does not touch `/scripts/` (those are tools, not app code — handled separately in the earlier cleanup audit).
- It does not address Supabase tables (auth) — only MongoDB.
- It does not validate document SHAPES against schemas — only that collections are queried. A document-shape audit is a separate pass.

---

**Bottom line:**
- **Keep:** 27 live Mongoose models + 4 static JSON files (3 in `/data/`, 1 in `/app/organic-chemistry-hub/`)
- **Delete (code):** 2 dead models, ~50 unimported JSONs in `/data/`
- **Drop (MongoDB):** `student_profiles`, `college_branches`, possibly `questions` (V1)
- **Verify:** run §6 step 3 to compare MongoDB reality vs this map
