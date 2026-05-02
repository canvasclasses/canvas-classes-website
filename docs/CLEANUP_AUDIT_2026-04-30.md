# Stale & Unused Files Audit — Canvas Classes

**Date:** 2026-04-30
**Branch:** `seo`
**Methodology:** 5 parallel investigation agents (V1 legacy, data files, scripts, docs, components/routes), each cross-referenced against the live codebase.

> **TL;DR:** Roughly **150–200 files** and **~6 MB** are confirmed dead. Plus one critical CLAUDE.md inconsistency: it cites `.agent/rules/*.md` and `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md` as the canonical ruleset — **those files do not exist in the repo.**

---

## 0. CRITICAL — fix before anything else

CLAUDE.md (the project's own ruleset) tells every agent:
> "All question ingestion must follow `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md` exactly. Supporting rules live in `.agent/rules/latex_formatting.md`, `.agent/rules/question_management.md`, `.agent/rules/security_protocol.md`."

Reality on disk:
- `.agent/workflows/` exists but contains only `BLOG_DAILY_WORKFLOW.md`
- `.agent/rules/` **does not exist**

Either the files were accidentally deleted, never committed, or live in a different path (note: `_agents/` exists separately — that's where `SIMULATION_DESIGN_WORKFLOW.md` lives, per CLAUDE.md §6).

**Decide:**
- (a) restore those files from git history, OR
- (b) edit CLAUDE.md to point at where the actual canonical rules live now.

Until this is fixed, every future agent (Claude or otherwise) gets contradictory instructions.

---

## 1. HIGH-CONFIDENCE — safe to delete wholesale

### 1.1 `/data/` directory — **delete entirely** (~2.3 MB, ~50 files)
Zero imports across the codebase. Active questions live in MongoDB `questions_v2`; taxonomy lives in `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`. These are intermediate JSON dumps from past ingestion runs.

```
/data/all_36_chapters.json
/data/chapters_from_taxonomy.json
/data/conversion_game_data.json
/data/mole_concept_categorization.json
/data/answer_keys_content.js
/data/questions_batch_001.json
/data/mole_pyq_solutions_set{1..6}.json          (6 files)
/data/new_mole_questions_batch{2,3_part1..5}.json (6 files)
/data/manual_solutions_mole_batch{2,3}.json      (2 files)
/data/peri_batch1.json
/data/peri_q*.json                                (12 files: 01_10, 01_20, ...)
/data/reaction_table_data.json
/data/reagents_data.json
/data/chapters/_index.json
/data/chapters/ch1[12]_*.json                     (30 files)
/data/chapters/mole_batch4_1.json
```

**Keep:** `/PYQ/` (markdown/HTML guide, unrelated to JSON dumps).

---

### 1.2 `/.claude/worktrees/jovial-ramanujan/` — **delete entire directory**
Complete duplicate of the live codebase (497 TypeScript files). Worktrees are for isolated feature branches — this one is abandoned. Includes the duplicate `app/robots.ts`, `app/sitemap.ts`, and `public/robots.txt` we flagged in the SEO audit.

Verify it's not your active worktree first: `git worktree list`. If not listed, `git worktree remove .claude/worktrees/jovial-ramanujan` then delete the directory.

---

### 1.3 `/backups/` directory — **delete entirely**
Two timestamped MongoDB dumps from Feb 16, 2026 (~10 weeks old). If you need rolling backups, `npm run backup:r2` (already wired) writes to R2 and `npm run backup:cleanup` handles retention. Local backups are noise.

```
/backups/questions_2026-02-16T11-44-58-649Z/
/backups/questions_2026-02-16T11-45-15-601Z/
```

---

### 1.4 Stale docs in `/docs/` — **delete ~13 files**
Status / checklist / "phase complete" docs that go stale the moment the work ships:

```
docs/CLEANUP_COMPLETE.md
docs/COMPLETE_SUMMARY.md
docs/FINAL_STATUS.md
docs/READY_TO_USE.md
docs/PHASE_1_FIXES_COMPLETE.md
docs/PHASE_2_COMPLETE.md
docs/PHASE_3_COMPLETE.md
docs/WEEK1_DAY1_COMPLETE.md
docs/WEEK1_PROGRESS.md
docs/ADMIN_PANEL_V2_COMPLETE.md
docs/FLASHCARD_ISSUES_FIXED.md
docs/SVG_SCALING_FIX.md
docs/TEST_LOADING_FIX.md
```

Plus likely-stale design/migration drafts (review first):
```
docs/MIGRATION_PLAN.md          (calls existing system "fundamentally broken" — probably superseded)
docs/REDUNDANT_FILES_ANALYSIS.md (older version of this audit, ironic)
docs/TEST_MODE_ANALYSIS.md       (one-shot analysis)
```

**Keep:**
- `docs/SEO_AUDIT_2026-04-30.md` (this branch)
- `docs/CLEANUP_AUDIT_2026-04-30.md` (this file)
- `docs/ANALYTICS_MASTER_PLAN.md`, `docs/TRACKING_OVERVIEW.md` (active per git status)
- `docs/CRUCIBLE_SYSTEM_DESIGN.md`, `docs/TAXONOMY_ARCHITECTURE.md`, `docs/FLASHCARD_TAXONOMY_ARCHITECTURE.md` (architecture refs)
- `docs/BACKUP_*.md` (3 files — operational runbooks)
- `docs/superpowers/specs/` and `docs/superpowers/plans/` (active branches)
- `docs/GUIDED_PRACTICE_*.md`, `docs/DASHBOARD_*.md`, `docs/5_LEVEL_TAGGING_SYSTEM.md`, `docs/TAG_CHANGE_SAFETY_GUARANTEE.md`, `docs/FLASHCARD_ADMIN_GUIDE.md`, `docs/FLASHCARDS_MIGRATION_GUIDE.md` (verify each, but likely still useful)

---

### 1.5 Stale root markdown — **delete or archive**

| File | Action | Why |
|---|---|---|
| `README.md` | **Rewrite** | References Next.js 14; project is on 15. Outdated tech-stack description. |
| `QUICK_START_GUIDE.md` | **Delete** | Contradicts CLAUDE.md §3 (recommends `node -e "..."` for ingestion, which CLAUDE.md explicitly forbids due to LaTeX shell-escaping) |
| `PRE_DEPLOYMENT_CHECKLIST.md` | **Delete** | One-shot launch checklist, work shipped |
| `RBAC_SETUP_COMPLETE.md` | **Delete** | "Setup complete" status doc — purpose served |
| `NEET_INTEGRATION_GUIDE.md` | **Review then delete** | Not referenced from CLAUDE.md or code; possibly aspirational |
| `RENDERING_STANDARDS.md` | **Review then delete** | Orphaned, not referenced |
| `ARCHITECTURE.md` | **Archive to `/docs/archive/`** | ~200 lines duplicate CLAUDE.md §7. Useful reference but redundant. |
| `SECURITY_FIXES_CHANGELOG.md` | **Keep** | Audit trail, recent (Apr 2026) |
| `SECURITY_CODE_REVIEW_REPORT.md` | **Keep** | Pairs with the changelog |
| `DATA_SOURCE_DOCUMENTATION.md` | **Keep** | Prevents data-source confusion |
| `RBAC_IMPLEMENTATION_GUIDE.md` | **Keep** | Active system doc |
| `RBAC_QUICK_START.md` | **Keep** | Setup runbook |
| `RBAC_LOCALHOST_BEHAVIOR.md` | **Keep** | Dev runbook |
| `CHANGELOG.md` | **Keep** | Standard changelog |
| `CLAUDE.md` | **Keep** (and fix §0 above) | Authoritative |

---

### 1.6 Stale one-shot scripts in `/scripts/` — **delete 10 files**
Already-run batch ingestion + content-rewrite scripts:

```
scripts/peri_solrev_batch1.js   through batch6.js   (6 files)
scripts/insert_polymers_flashcards.js
scripts/insert_organic_reagents.js
scripts/setup_class9_physics_restructure.js
scripts/rewrite_hinglish_what_is_science.js
```

**Keep:** All scripts wired into `package.json` (`backup:*`, `restore`), all `validate_*.js` / `check_*.js` / `audit_*.js` / `inspect_*.js` (data-integrity tools), the entire `scripts/blog/` pipeline (active), `scripts/college-predictor/` (seed/validation), `scripts/career-explorer/` (seed).

> 70+ scripts total — this list is just the highest-confidence one-shots. A second pass after deletion can target more `insert_*.js` and `migrate_*.js` files once you confirm each has been run successfully.

---

### 1.7 Backup files — **delete 2 files**
```
app/api/v2/questions/route.ts.backup
app/crucible/admin/taxonomy/taxonomyData_from_csv.ts.backup
```
Inert version-control crutches. Git is the version control.

---

### 1.8 Dead landing-page components — **delete ~10 files**
All commented out in `app/page.tsx` lines 28–33 and not imported anywhere else:

```
app/components/Hero.tsx
app/components/PeriodicTablePreview.tsx
app/components/PeriodicTrendsTeaser.tsx
app/components/PathfinderQuiz.tsx
app/components/MyNotesSection.tsx
app/components/NCERTBoardsSection.tsx
app/components/SaltAnalysisTeaser.tsx
app/components/PathFinder.tsx
app/components/PathCard.tsx
app/components/GoalSelector.tsx
```

These are remnants from the old landing page; the active landing is `app/components/landing/LandingPage.tsx` → `NewHero` + `BentoShowcase` + `VedicLearningSection` + `StatsSection` + `PaarasSirSection` + `FinalCTASection`.

> Before deleting `Hero.tsx`, verify nothing in `app/landing/page.tsx` still imports it (see §2.1 below).

---

## 2. MEDIUM-CONFIDENCE — review before deleting

### 2.1 `/app/landing/page.tsx` — likely duplicate of `/app/page.tsx`
Both render the same landing experience (`LandingPage` component). Not in sitemap, not linked from Navbar/Footer. If `/landing` URL has no external backlinks, **redirect → `/`** in `next.config.ts` and delete the route folder.

### 2.2 `/app/class-10/page.tsx` — "ComingSoon" placeholder
Not in sitemap, not in Navbar (which links `/class-9`, `/class-11`, `/class-12`). Either ship Class 10 content or remove the route — placeholders bleed crawl budget.

### 2.3 Routes not in sitemap — confirm intent
- `/app/chemihex/page.tsx` — game/tool, decide if it should be public-indexed
- `/app/one-shot-lectures/page.tsx` — appears to be a real content page; should probably be added to the sitemap (see SEO audit §2.4)
- `/app/jee-pyqs/page.tsx` — real content, missing from sitemap (covered in SEO audit)

These aren't dead code — they're indexation oversights. Don't delete; **add to sitemap** instead.

### 2.4 More aggressive `/scripts/` cleanup
70+ scripts total. After the §1.6 deletions, do a second pass on:
- All remaining `insert_*.js` (verify they've been run)
- `migrate-difficulty-level.ts` (verify migration done)
- `r2-asset-inventory.ts` (one-shot or recurring?)

---

## 3. LOW-CONFIDENCE — leave alone

- `lib/models.ts` — agent flagged as legacy, but the file has been cleaned and now contains only the `ActivityLog` model used by `app/api/v2/questions/[id]/stats/route.ts` for community heatmaps. Keep.
- `_agents/` (with underscore) — referenced by CLAUDE.md §6 (`_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md`). Keep.
- `tools/question-ingestion/` — active per its own README; depends on the missing `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md` (see §0).
- `/.superpowers/brainstorm/` — local scratch, untracked. Harmless.

---

## 4. Quantified impact

| Bucket | Files | Disk |
|---|---|---|
| `/data/` wholesale | ~50 | ~2.3 MB |
| `/.claude/worktrees/jovial-ramanujan/` | ~500 | varies (large) |
| `/backups/` | 2 dirs | varies |
| `/docs/` stale status files | ~13 | small |
| Root MD cleanup | ~5 | small |
| `/scripts/` one-shots (phase 1) | 10 | small |
| Dead landing components | ~10 | small |
| `.backup` files | 2 | small |
| **Total confirmed dead** | **~590 files** | **~3+ MB** (ex-worktree) |

Most of the file count is the duplicated worktree. Most of the cognitive cleanup value is the docs + components — those are what slow you down when navigating the codebase.

---

## 5. Suggested deletion order

Each step is independent. Safe to do in one PR or split into chunks.

**PR 1 — Quick wins (zero risk):**
1. `public/robots.txt` (also flagged in SEO audit §1.1)
2. `/.claude/worktrees/jovial-ramanujan/` (after verifying `git worktree list`)
3. `/backups/`
4. The 2 `.backup` files in §1.7
5. The 10 stale one-shot scripts in §1.6

**PR 2 — Data dump cleanup:**
6. `/data/` directory wholesale (§1.1)

**PR 3 — Dead components:**
7. The 10 components in §1.8 — read app/page.tsx and app/landing/page.tsx first to confirm

**PR 4 — Docs cleanup:**
8. The 13 stale status docs in §1.4
9. Root MD cleanup in §1.5 (delete `QUICK_START_GUIDE.md`, `PRE_DEPLOYMENT_CHECKLIST.md`, `RBAC_SETUP_COMPLETE.md`; archive `ARCHITECTURE.md`; rewrite `README.md`)

**PR 5 — Fix CLAUDE.md inconsistency:**
10. Either restore `.agent/rules/*.md` and `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md` from git history, or update CLAUDE.md to point at where those rules actually live.

**PR 6 — Optional:**
11. Decide on `/app/landing/page.tsx` (§2.1) and `/app/class-10/page.tsx` (§2.2)
12. Second-pass `/scripts/` cleanup

---

## 6. Cross-references with the SEO audit

Several items in this cleanup overlap with `docs/SEO_AUDIT_2026-04-30.md`:
- Deleting `public/robots.txt` is SEO §1.1 + cleanup PR 1
- Deleting `/.claude/worktrees/jovial-ramanujan/` removes the duplicate `robots.ts`/`sitemap.ts` flagged there
- Cleaning the stale landing components (§1.8) doesn't change SEO directly but makes the SEO H1 fix (SEO §1.5) easier — fewer dead files to search through

Do PR 1 of cleanup before starting SEO Week 1 — it removes the duplicate-route conflict that's blocking sitemap indexation.
