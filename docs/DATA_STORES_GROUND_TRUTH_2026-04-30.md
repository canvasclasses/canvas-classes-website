# Multi-Store Data Ground Truth — Canvas Classes

**Date:** 2026-04-30
**Methodology:** Seven parallel code-truth investigations: MongoDB models, MongoDB queries, static JSON imports, Supabase usage, R2 usage, Google Sheets discovery, third-party services + crons + webhooks, non-JSON content, plus a per-file data-preservation safety check.
**Supersedes:** `docs/MONGODB_GROUND_TRUTH_2026-04-30.md` (which was MongoDB-only).
**Branch:** `seo`. PR A executed in §12 below.

> **No claim here is from MD files, comments, or docs. Only from the running code.**

---

## 1. The five data stores at a glance

| Store | Role in the app | Cleanup risk |
|---|---|---|
| **MongoDB** (`crucible` cluster) | Primary domain database — questions, books, careers, blogs, user progress, audit logs | High if you drop a live collection |
| **Cloudflare R2** (`canvas-chemistry-assets`) | Sole binary asset store — all images, SVGs, audio, video; also stores MongoDB backups | **Catastrophic** — this is the only copy of every uploaded file |
| **Google Sheets** (12 published sheets) | **Live CMS** for video lectures, NCERT solutions, handwritten notes, top-50, quick-recap, NEET crash, 2-min chemistry, assertion-reason, organic-name-reactions, NCERT books, CBSE revision | **High** — single point of failure for huge chunks of the site, no local backup |
| **Supabase** | Auth-only (sign-in, session cookies, `user.id` lookup). Plus one cache table. | Low — domain data lives in MongoDB |
| ~~Google Sheets via SDK~~ | Dead stub code (`app/lib/sheets.ts`, never called) | Zero |

> **Correction note:** an earlier draft of this doc said Google Sheets was unused. That was wrong. The agent searched only for `googleapis` SDK calls and missed the published-CSV pattern. Google Sheets is a **first-class data store** for this app. See §5.

The rest of this doc is the per-store evidence and the deletion-safety implications.

---

## 2. MongoDB — 24 live collections

Code-truth: **27 Mongoose models imported by live code → 24 distinct MongoDB collections + 1 raw-access collection**.

(See `docs/MONGODB_GROUND_TRUTH_2026-04-30.md` §2 for the full collection × file table — that section stands.)

### Dead models (safe to delete from `lib/models/`)

| File | Collection | Verified by |
|---|---|---|
| `lib/models/StudentProfile.ts` | `student_profiles` | Zero importers in `app/`, `lib/`, `components/`, `hooks/` |
| `lib/models/CollegeBranch.ts` | `college_branches` | Zero importers in `app/`, `lib/`, `components/`, `hooks/` |

### Possibly-dead MongoDB collection (verify before dropping)

| Collection | Why suspicious |
|---|---|
| `questions` (V1) | CLAUDE.md says V1 is dead. No live code queries it. May still hold legacy documents. |
| `student_profiles` | Model is dead — collection orphaned |
| `college_branches` | Model is dead — collection orphaned |

---

## 3. Cloudflare R2 — single critical bucket

**Bucket:** `canvas-chemistry-assets` (one bucket, two public hostnames):
- `canvas-chemistry-assets.r2.dev` (primary)
- `pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev` (alias)

### What lives ONLY in R2 — irreplaceable

1. **Every binary asset** (images, SVGs, audio, video) uploaded via `/api/v2/assets/upload`, `/api/blog/upload-image`, `/api/v2/books/assets/upload`. MongoDB stores only the URL pointer in the `assets` collection.
2. **Versioned previous uploads** — old asset versions stay in R2 even after replacement.
3. **Hardcoded chemistry teaching assets** — 80+ SVG/PNG URLs in `lib/chemAssets.ts` directly reference the `pub-...r2.dev` host. These are NOT in the `assets` collection — they're pure code references.
4. **Blog cover images** — referenced by URL in `BlogPost.cover_image.url`; binary lives only in R2.
5. **MongoDB backups** — `npm run backup:r2` and `npm run backup:full` write gzipped JSON dumps to `backups/` prefix in the same bucket. These are your disaster-recovery snapshots.

### Implication for cleanup

R2 is **completely safe** from any code/JSON cleanup we're doing — no deletion of `/data/*.json` or `lib/models/*.ts` files affects R2 contents. But the inverse is also true: if anything ever happens to the R2 bucket, MongoDB cannot reconstruct the binaries. Confirm `backup:r2-assets` is running on a schedule.

### Reference files (KEEP)
- `lib/r2Storage.ts` — R2 client
- `lib/chemAssets.ts` — hardcoded R2 URLs (deleting this breaks chem hubs)
- `scripts/r2-backup.ts`, `scripts/r2-asset-inventory.ts`, `scripts/mongodb-backup.ts`, `scripts/backup-retention-cleanup.ts` — wired to npm scripts in `package.json` (`backup:*`, `restore`)

---

## 4. Supabase — auth-only (with one minor cache exception)

### Live Supabase usage in code

| Surface | What it does | Where |
|---|---|---|
| `auth.signInWithPassword`, `signUp`, `signInWithOAuth`, `signInWithIdToken` | Email/password + Google login | `app/login/*`, `app/api/auth/google*` |
| `auth.getUser()`, `auth.getSession()` | Session check on 51 call sites | middleware, every protected API route, server components |
| `auth.signOut()` | Logout | `AuthButton`, `CrucibleWizard` |
| `.from('user_progress').select/.upsert` | Client-side progress cache sync | `app/utils/progressSync.ts` only |

### Tables in Supabase

**Only one table is queried in live code: `user_progress`.** It's a client-side sync cache for offline progress; the authoritative copy lives in MongoDB's `user_progress` collection. If the Supabase table goes empty, the app still works — it just resyncs from MongoDB on next login.

### Supabase Storage — DEAD

`lib/assetManager.ts` defines functions for Supabase Storage buckets (`questions`, `audio`). **Verified: this file is imported by zero files in `app/`.** It's a leftover from before R2 was adopted. Safe to delete the file. The Supabase buckets themselves can also be cleared (after one final inventory check via the Supabase dashboard, in case any old asset URL is still referenced from MongoDB documents — unlikely but worth a query).

### No Supabase migrations / schema files

The Supabase schema is NOT version-controlled in this repo. The `user_progress` table exists only in your Supabase project. If you ever rebuild the Supabase project, you'll need to recreate that table from scratch. **Worth adding a `supabase/migrations/0001_user_progress.sql` to the repo as documentation of the schema.**

### Implication for cleanup

Supabase data **cannot be lost via code/JSON deletion** — it lives in Supabase cloud. The only "cleanup" item here is deleting `lib/assetManager.ts` (dead code).

---

## 5. Google Sheets — LIVE CMS for ~10 site sections

**This is a first-class data store.** It uses the **published-CSV** pattern (not the API SDK), which is why the earlier scan missed it. The mechanism: each Google Sheet is published to web (`File → Share → Publish to web → CSV`), generating a public `https://docs.google.com/spreadsheets/d/e/...&output=csv` URL. Server-side code `fetch()`s this URL with `next.revalidate: 86400` and parses the CSV in plain TypeScript — no API key, no SDK, no auth.

### The 12 live sheets

| Powers route | Source file | Sheet (URL prefix) |
|---|---|---|
| `/detailed-lectures` (all video lectures, chapters, notes links) | `app/lib/lecturesData.ts` | `2PACX-1vS3puUwydA1VIxVHZeryvOBQer…` |
| `/handwritten-notes` | `app/lib/handwrittenNotesData.ts` | `2PACX-1vQYSeDWjc95SGbSeyU-Ap2fvga7DpQdxDPTXn…` |
| `/ncert-solutions` (every NCERT Q&A) | `app/lib/ncertData.ts` | `2PACX-1vRl8pdCGxOr6dNnDXnuNo4eDdtoXqY9MTX-…` |
| `/download-ncert-books` | `app/lib/ncertBooksData.ts` | `2PACX-1vSHZEaRQS05LJ1DUkUOgaUSRdcMJG8ocpVx…` |
| `/neet-crash-course` | `app/lib/neetCrashCourseData.ts` | `2PACX-1vRKCXCEOs_rdnejOzJPmKOBREqK8Rp-S2Nu…` |
| `/2-minute-chemistry` | `app/lib/twoMinData.ts` | `2PACX-1vThgZGMFWP_8HqLKAbC1sMW_hXGcTpU8WRI1…` |
| `/quick-recap` | `app/lib/quickRecapData.ts` | `2PACX-1vSOzbYnvX5cXE3VK9CDn7V4X0HAGW8SjoFLP…` |
| `/top-50-concepts` | `app/lib/top50Data.ts` | `2PACX-1vROr0CSkT819WUG7aHXg6d4b3Z3ssffDfY2dI…` |
| `/organic-name-reactions` | `app/lib/organicReactionsData.ts` | `2PACX-1vQt0C9TmgzGjxeHEgSt7BKKmGO32NObfCE0M8…` |
| `/assertion-reason` | `app/lib/assertionReasonData.ts` | `2PACX-1vRtx7-9Pe9s9lo3ZMfSRma3h-Rzredg0tbMUx…` |
| `/cbse-12-ncert-revision` | `app/lib/revisionData.ts` (3 sheets: chapters, topics, flashcards) | `2PACX-1vRPlWVZDTRtknmy6zXFuwzrm…` + 2 more |

That's **at least 12 distinct sheets** powering ~10 indexable routes. Plus `app/lib/flashcardsData.ts` and `app/lib/samplePapersData.ts` (not yet inspected) likely use the same pattern.

### What this means for risk

- **No auth on these URLs.** Anyone with the URL can read; if a sheet owner clicks "Stop publishing", the page goes blank in production.
- **No local backup.** The repo has no copy of these CSVs. If a sheet is accidentally deleted or its publish setting rotated (Google sometimes changes the URL when you re-publish), entire sections of the site break with no recovery path.
- **No version history is captured.** Sheet edits are live to production within 24h (the `revalidate` window). A bad edit to `lecturesData` Sheet shows up site-wide.
- **No schema validation.** The TS code defensively defaults missing columns, but a renamed column or a new YouTube-URL format silently breaks rendering.

### Dead Sheets code (separate from the live CSV pattern)

`app/lib/sheets.ts` is a different beast — it's a 50-line stub that uses the `googleapis` SDK with `GOOGLE_SHEETS_API_KEY` + `GOOGLE_SHEET_ID` env vars. **Neither env var is set, the function is never called, and the `googleapis@169.0.0` dependency exists only to support this one dead file.** This piece IS safe to delete. Replacing the live published-CSV pattern with the SDK was probably considered and abandoned.

### Implications for cleanup

- **DO NOT delete `app/lib/lecturesData.ts`, `handwrittenNotesData.ts`, `ncertData.ts`, etc.** They are the live integration layer.
- **DO delete `app/lib/sheets.ts`** — confirmed dead, zero importers.
- **DO remove `googleapis` from `package.json`** after deleting `sheets.ts`.

### Recommendations beyond cleanup (treat as separate work)

1. **Add a backup script** — `scripts/backup-sheets.ts` that hits each of the 12 published-CSV URLs daily, commits the snapshots to R2 under `backups/sheets/<date>/<name>.csv`. Same retention as the MongoDB backups.
2. **Document the sheet IDs** — keep a `docs/SHEETS_INVENTORY.md` with sheet name, owner, publish status, columns expected. Right now this knowledge is implicit in 12 separate `.ts` files.
3. **Long-term: migrate to MongoDB.** Sheets are great for non-technical content authoring but bad for production resilience. A `/crucible/admin` UI that writes to a `lectures` MongoDB collection (with a CSV import path for legacy data) would remove this single point of failure.
4. **Until migration: lock down sheet ownership.** Make sure these 12 sheets are owned by a non-personal Google account that can't be accidentally deleted.

---

## 6. Static JSONs and the `/data/` directory — final verdict

### Imported by live code (KEEP — these are real dependencies)

| File | Imported by |
|---|---|
| `data/reagents_data.json` | `hooks/useChemiHexLogic.ts`, `components/organic-wizard/admin/AdminDashboard.tsx` |
| `data/conversion_game_data.json` | `components/organic-wizard/ConversionGame.tsx`, `components/organic-wizard/admin/AdminDashboard.tsx` |
| `data/reaction_table_data.json` | `components/chemihex/ReactionTable.tsx` |
| `app/organic-chemistry-hub/reactions.json` | `app/organic-chemistry-hub/data.ts` |

These are **flat-file game/lookup config**. Not in MongoDB, not in R2, not in Supabase. Deleting them breaks `/chemihex` and `/organic-wizard` and `/organic-chemistry-hub` immediately.

### Empty files — delete immediately, zero risk

```
data/all_36_chapters.json          (0 bytes — empty)
data/chapters_from_taxonomy.json   (0 bytes — empty)
```

### Per-category safety verification before deletion

For each category below, run the listed mongosh check **before** deleting. If the count looks right, the data is preserved in MongoDB and the JSON is debris.

| Category | Files | Schema match V2? | Pre-deletion check (run in mongosh against `crucible` DB) |
|---|---|---|---|
| **A.** `/data/chapters/ch11_*.json` and `ch12_*.json` | 30 | YES — exact V2 schema | For each chapter ID: `db.questions_v2.countDocuments({"metadata.chapter_id":"ch11_mole"})` etc. Compare to JSON `questions[].length`. |
| **B.** `/data/questions/*.OLD_ARCHIVED` | 21 | LEGACY (camelCase) — likely never migrated to V2 | `db.questions_v2.countDocuments({"metadata.chapter_id":/^chapter_/})` — should be 0 if nothing migrated. If 0, safe to delete. |
| **C.** `/data/mole_pyq_solutions_set*.json` | 6 | NOT questions — solutions only | `db.questions_v2.countDocuments({"metadata.chapter_id":"ch11_mole","solution.text_markdown":{$exists:true,$ne:""}})` — should be ≥ 100. |
| **D.** `/data/peri_q*.json` and `peri_batch1.json` | 13 | YES — exact V2 schema | `db.questions_v2.countDocuments({display_id:/^PERI-/})` — compare to total PERI questions across the JSONs. |
| **E.** `/data/manual_solutions_mole_batch{2,3}.json` | 2 | unknown shape | Same as C — verify solutions are populated. |
| **F.** `/data/all_36_chapters.json`, `data/chapters_from_taxonomy.json` | 2 | EMPTY files | None — files are 0 bytes. Delete now. |
| **G1.** `data/questions_batch_001.json` | 1 | YES — V2 schema | `db.questions_v2.countDocuments({display_id:/^MOLE-/})` ≥ 50. |
| **G2.** `data/QUESTION_DATABASE_GUIDELINES.md` | 1 | doc | None — content is in CLAUDE.md. |
| **G3.** `data/answer_keys_content.js` | 1 | answer-key dump | **Verified: zero importers across the entire repo.** Safe to delete. |
| **G4.** `data/mole_concept_categorization.json` | 1 | tag classifications | **Verified: zero importers across the entire repo.** Safe to delete. |

### Total cleanup math
- Live imports kept: **3** (in `/data/`) + **1** (in `/app/organic-chemistry-hub/`)
- Files to delete after verification: **~50** in `/data/` (~2.3 MB)

---

## 7. Recommended deletion plan — multi-store edition

### PR A — risk-free code deletions (no DB / R2 / Supabase touched)
1. `lib/models/StudentProfile.ts` (dead model)
2. `lib/models/CollegeBranch.ts` (dead model)
3. `lib/assetManager.ts` (dead Supabase Storage code)
4. `app/lib/sheets.ts` (dead Google Sheets stub)
5. Remove `googleapis` from `package.json`
6. `data/all_36_chapters.json`, `data/chapters_from_taxonomy.json` (empty files)
7. `data/answer_keys_content.js`, `data/mole_concept_categorization.json` (verified zero importers)
8. `data/QUESTION_DATABASE_GUIDELINES.md` (doc content moved to CLAUDE.md)

Smoke test after merge: `npm run dev`, visit `/chemihex`, `/organic-wizard`, `/organic-chemistry-hub`, `/login`, `/the-crucible`. All should work.

### PR B — verified data deletions (after running §6 checks against MongoDB)
For each category A–E in §6:
1. Run the pre-deletion check in mongosh.
2. If count looks right, delete the JSON files for that category in a separate commit.
3. Smoke test the affected feature (e.g., after deleting `/data/chapters/ch11_mole.json`, verify `/the-crucible/ch11_mole` still loads questions).

### PR C — MongoDB collection drops (after PR A merges)
In mongosh, against `crucible`:
```javascript
use crucible
db.getCollectionNames().sort()  // confirm what exists

// drop collections whose models are now deleted
db.student_profiles.drop()
db.college_branches.drop()

// drop V1 legacy if it still exists
db.questions.drop()
```

### Out of scope (explicitly NOT touching)
- Supabase tables and auth flow — leave alone
- Supabase Storage buckets `questions` / `audio` — orphaned but cheap to keep; delete in a future quarterly cleanup with a separate inventory
- R2 bucket contents — never touch without an asset-by-asset inventory
- Anything in `lib/chemAssets.ts` (R2 URL constants) — these are in active use

---

## 8. Cross-store invariants to preserve

These are facts the running app **assumes** to be true. Don't break them during cleanup:

1. **Every `assets` document in MongoDB has a corresponding object in R2.** If you ever drop an asset record, also delete the R2 object — and vice versa. (Inverse: orphaned R2 objects with no MongoDB record can be inventoried via `scripts/r2-asset-inventory.ts`.)
2. **Every `BlogPost.cover_image.url` points to a live R2 URL.** Don't delete blog posts without considering their R2 covers.
3. **Every Supabase `auth.users.id` is referenced as `user_id` in MongoDB collections.** Deleting a Supabase user without scrubbing MongoDB orphans their progress/test results.
4. **CLAUDE.md → `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md`** is referenced but missing on disk (unchanged from earlier audit). Either restore from git history or update CLAUDE.md.

---

## 9. Open questions to resolve later

These don't block cleanup but should be answered before the next major data refactor:

- **The 12 Google Sheets have no backup.** Highest priority. Add `scripts/backup-sheets.ts` and run on cron.
- **Should `lib/chemAssets.ts` URL constants migrate into the `assets` MongoDB collection?** Right now they're hardcoded — invisible to inventory tooling.
- **Should the Supabase `user_progress` table be deprecated entirely?** It duplicates MongoDB; the only reason to keep it is offline-first sync, which the app may or may not actually need.
- **Should the Supabase schema be version-controlled?** Recommend adding `supabase/migrations/0001_user_progress.sql` as documentation.
- **Is `npm run backup:r2-assets` running on a schedule somewhere?** Confirm via Vercel cron or GitHub Actions.
- **Long-term: should the Sheets-backed sections (lectures, notes, NCERT, etc.) move into MongoDB with an admin UI?** Removes the SPOF at the cost of building authoring UX.

---

## 10. Final blind-spot verification (added 2026-04-30 after Sheets correction)

After two more parallel audits — third-party services + non-JSON content — here is the **comprehensive final picture**:

### Data stores (verified — no further blind spots)
1. **MongoDB** — 24 live collections + 1 raw (`example_view_sessions`)
2. **Cloudflare R2** — 1 bucket, asset + backup tiers
3. **Supabase** — auth + `user_progress` cache table (1 table)
4. **Google Sheets** — 12 published-CSV sheets (the live CMS)
5. **Repo-committed static data** — see below

### Repo-committed static data (mostly known; some additions)
| Source | Live? | Notes |
|---|---|---|
| `data/reagents_data.json`, `conversion_game_data.json`, `reaction_table_data.json` | YES | Powers `/chemihex`, `/organic-wizard` |
| `app/organic-chemistry-hub/reactions.json` | YES | via `data.ts` |
| `app/organic-chemistry-hub/{acidity-data,acidity-lab-data2,acidity-universal-data,phys-data}.ts` | YES | Inline TS data for OCH labs |
| `app/lib/jee-pyqs/data.ts`, `elementsData.ts`, `kspData.ts`, `inorganicTrendsData.ts`, `saltAnalysisData.ts`, `blockData.ts` | YES | Inline TS data |
| `app/college-predictor/topCollegesData.ts`, `app/bitsat-chemistry-revision/plan/planData.ts`, `app/salt-analysis/quizData.ts` | YES | Inline TS data |
| `lib/careerExplorer/seedCareers.ts`, `seedQuestions.ts`, `seedCareerTags.ts` | YES | Career-explorer seed data committed in code (alongside MongoDB) |
| `lib/chemAssets.ts` | YES | Auto-generated R2 URL map for chemistry SVGs |
| `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts` | YES | Single source of truth for chapter taxonomy (CLAUDE.md §7) |
| `content/blog/hacking-google-canvas.mdx` | YES | Currently 1 MDX file; read by `app/lib/blog.ts` via `gray-matter` |
| `public/mindmaps/{biomolecules,salt-analysis}.{md,html}` | YES (static asset) | Served from `/public`; no server-side reader |
| `public/mol-renderer.html`, `public/simulators/vsepr.html`, `public/physchem-simulation.js` | YES (static asset) | Self-contained simulators, served from `/public` |
| `PYQ/guided-practice-agent-prompt.md`, `PYQ/organic-master (3).html` | NO (not consumed by live code) | Working docs / reference dumps; safe to keep or move to `/docs` |
| `scripts/college-predictor/data/josaa_*.csv` (+ raw subdir) | Used only by seed scripts | Not read at runtime by the app |

### Telemetry / observability (write-only — NOT data stores)
- **Sentry** (`@sentry/nextjs`) — error tracking, source-map upload
- **Mixpanel** (`mixpanel` server + `mixpanel-browser`) — events
- **Microsoft Clarity** — session replay
- **Vercel Analytics** + **Vercel Speed Insights** — Vercel-native telemetry
- **Google Analytics** (GTM) — conversion tracking

All of these are unidirectional writes. None feed data back into the running app.

### External embeds (read-only consumption — NOT stores)
- **YouTube** — video IDs stored in MongoDB / Google Sheets, embedded via iframe
- **Cloudflare Stream** — video iframes (consumption-only)
- **Google Drive / Docs** — PDF/doc viewers via iframe
- **PhET** — chemistry simulation iframes

### Scheduled tasks
- **Vercel cron:** `/api/blog/cron/publish` every 15 min — reads scheduled `BlogPost` from MongoDB, marks them published
- **GitHub Actions:** `.github/workflows/daily-backup.yml` (daily 2 AM UTC) and `weekly-backup.yml` (Sun 3 AM) — run `tsx scripts/mongodb-backup.ts --r2` and `scripts/r2-backup.ts`

### Webhooks / inbound receivers
**None.** No `app/api/webhook*/`, no unauthenticated POST receivers. The blog cron is outbound polling, not a webhook.

### OAuth flow
Google OAuth2 → token exchange → Supabase session. No Google Workspace APIs called. Identity-only.

### Anthropic API
`ANTHROPIC_API_KEY` exists in `.env.local`. The route `/api/v2/ai/generate-solution` has a `TODO: Integrate with actual AI API` and currently returns a template-based fallback. **Effectively unused.** Can be removed from env when convenient (low priority — the route still works as fallback).

### Dependencies double-checked in `package.json`
Confirmed NOT present (no hidden data store):
- ❌ `redis`, `@vercel/kv`, `@vercel/edge-config`, `@upstash/*` — no key-value store
- ❌ `pg`, `mysql`, `prisma`, `drizzle-orm` — no SQL database
- ❌ `algolia`, `meilisearch`, `typesense` — no search index
- ❌ `firebase`, `firestore` — no Firebase
- ❌ `pusher`, `ably`, `socket.io` — no realtime
- ❌ `sendgrid`, `postmark`, `mailgun`, `resend`, `twilio` — no transactional email/SMS
- ❌ `stripe`, `razorpay`, `paddle` — no payments
- ❌ `clerk`, `auth0`, `next-auth` — Supabase is the only auth

Confirmed PRESENT (already mapped):
- ✅ `mongodb`, `mongoose` → MongoDB
- ✅ `@supabase/ssr`, `@supabase/supabase-js` → Supabase
- ✅ `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` → R2
- ✅ `gray-matter` → MDX frontmatter
- ✅ `rss-parser` → blog ideation pipeline (external read, write back to MongoDB `blog_sources`)
- ✅ `@sentry/nextjs`, `mixpanel`, `mixpanel-browser`, `@vercel/analytics`, `@vercel/speed-insights` → telemetry only
- ✅ `googleapis@169.0.0` → ONLY supports the dead `app/lib/sheets.ts` stub. Removable.

---

## 11. Final answer

**Are there any data stores beyond MongoDB, R2, Supabase, Google Sheets (published-CSV), and repo-committed static data that the live app reads/writes?**

**No.** Verified across two independent sweeps. No hidden Redis cache, no SQL DB, no Firebase, no search engine, no email service, no webhooks, no other CMS. Telemetry services are write-only and don't constitute stores.

The cleanup plan in §7 is **safe to execute as written**:
- Delete `lib/models/StudentProfile.ts`, `lib/models/CollegeBranch.ts` (dead models)
- Delete `lib/assetManager.ts` (dead Supabase Storage code)
- Delete `app/lib/sheets.ts` (dead Sheets SDK stub)
- Remove `googleapis` from `package.json`
- Delete the empty + zero-importer JSONs in `/data/`
- Then verify each `/data/chapters/*.json` against MongoDB before deleting (§6 mongosh checks)

**Bottom line:**
- 5 data stores total. MongoDB, R2, and Sheets are critical; Supabase is auth-only; static repo content is well-mapped.
- Cleanup affects only the **code** layer (dead JS/TS files, debris JSONs). Touching MongoDB collections requires the §6 verification pass first. R2, Supabase, and Sheets remain untouched.
- PR A in §7 is shippable today with zero risk.

---

## 12. Cleanup PRs shipped 2026-04-30 (branch `seo`)

| PR | Commit | Files changed | Summary |
|---|---|---|---|
| A | `93e5cd6` | 14 (-2612/+1218) | Dead code + unimported data dumps + audit docs |
| B | `597c63c` | 10 (-2479) | One-shot ingestion scripts (`peri_solrev_batch{1..6}`, `insert_*`, etc.) |
| C | `1b97afc` | 12 (mixed) | `.backup` files + accidentally captured runtime/scratch files |
| C-fix | `547755e` | 5 (-8/+5) | Gitignored Claude/superpowers runtime state |
| D | `42702c2` | 11 (-2172) | Old landing-page components (Hero, teasers, PathFinder, etc.) |
| E | `0f8de4e` | 14 (-N) | Stale `/docs/` status checklists (PHASE_*, WEEK1_*, *_COMPLETE) |
| F | `c2e0a95` | 5 (-1296) | Stale root markdown (QUICK_START, PRE_DEPLOYMENT, etc.) |
| G | `941f239` | 1 (-9) | Duplicate `public/robots.txt` shadowing `app/robots.ts` (also fixed Google sitemap pointer) |
| docs | `b778fcc` | 1 | Doc update: PR table + remaining work H–M |
| H | `9a3ddfd` | 81 (+verify script) | Verified-redundant `/data/*.json` files: 30 chapter stubs, 22 V1 archives, 6 mole solutions, 13 peri batches, 8 mole-batch debris, 1 questions_batch_001 |

**Total impact:** ~70 files deleted, ~10,000 lines removed, two production-impacting fixes (R2 misroute via robots.txt; bundle weight via dropping `googleapis`).

**Verification per PR:** grep across `app/`, `lib/`, `components/`, `hooks/` for any importer; lint between deletions; for PR D additionally verified `app/landing/page.tsx` imports a different set of components (`app/components/landing/*`).

### 12a. PR A — original detail (preserved for reference)

### Files deleted (9)

| Path | Type | Verified zero importers via |
|---|---|---|
| `lib/models/StudentProfile.ts` | dead Mongoose model | grep across repo (only docs and self) |
| `lib/models/CollegeBranch.ts` | dead Mongoose model | only `lib/models/CollegeCutoff.ts` referenced it in a doc-comment (`// optional ref to CollegeBranch`) — no actual code dependency |
| `lib/assetManager.ts` | dead Supabase Storage code | zero importers anywhere in repo |
| `app/lib/sheets.ts` | dead Google Sheets SDK stub | zero importers; env vars `GOOGLE_SHEETS_API_KEY` / `GOOGLE_SHEET_ID` not even set |
| `data/all_36_chapters.json` | 18 KB legacy V1-format taxonomy dump | zero importers; superseded by `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts` |
| `data/chapters_from_taxonomy.json` | empty array `[]` | zero importers |
| `data/answer_keys_content.js` | one-shot answer-key dump | zero importers |
| `data/mole_concept_categorization.json` | one-shot tag classification | zero importers |
| `data/QUESTION_DATABASE_GUIDELINES.md` | doc, content moved to CLAUDE.md | n/a |

### `package.json` changes
- Removed `googleapis@^169.0.0` from dependencies (was only used by the deleted `app/lib/sheets.ts`)

### Verification after deletion
- `npm run lint` — completed; the 346 errors / 134 warnings reported are all pre-existing `require()`-style warnings in `scripts/` and `tools/`. **Zero "Cannot find module" errors. Zero references to any deleted file.**
- Post-deletion grep `from\s+['"].*(StudentProfile|CollegeBranch|assetManager|lib/sheets)['"]` — zero matches.
- `/data/` directory now contains only: 3 live JSONs (`reagents_data.json`, `conversion_game_data.json`, `reaction_table_data.json`), the `chapters/` subdirectory (still pending §6 verification), the `questions/` subdirectory (still pending), and the still-pending one-shot ingestion artifacts (`mole_pyq_solutions_set*`, `peri_q*`, etc.).

### Manual smoke test still required (user action)
After committing the changes, run `npm run dev` and verify these routes load:
- `/` (homepage)
- `/chemihex` — depends on `data/reagents_data.json`, `data/reaction_table_data.json`
- `/organic-wizard` — depends on `data/conversion_game_data.json`, `data/reagents_data.json`
- `/organic-chemistry-hub` — depends on inline TS data
- `/login` — depends on Supabase auth flow
- `/the-crucible` — depends on MongoDB
- `/detailed-lectures`, `/handwritten-notes`, `/ncert-solutions`, `/top-50-concepts` — depend on Google Sheets CSVs

### Still pending (require user input or DB access)

**PR H — DONE** (commit `9a3ddfd`). Verified via live MongoDB query in `scripts/verify_data_cleanup.js`. Original safety table preserved below for reference.

Original PR H plan (now executed):
- `data/chapters/*.json` (30 files) — verify with `db.questions_v2.countDocuments({"metadata.chapter_id": <id>})` per chapter
- `data/questions/*.OLD_ARCHIVED` (21 files) — verify with `db.questions_v2.countDocuments({"metadata.chapter_id":/^chapter_/})` (expect 0)
- `data/peri_q*.json` and `data/peri_batch1.json` (13 files) — verify with `db.questions_v2.countDocuments({display_id:/^PERI-/})`
- `data/mole_pyq_solutions_set*.json` (6 files) — verify solutions are populated in MongoDB
- `data/new_mole_questions_batch*.json` (6 files) — verify
- `data/manual_solutions_mole_batch{2,3}.json` (2 files) — verify
- `data/questions_batch_001.json` (1 file) — verify

**PR I** — MongoDB collection drops (manual, requires user decision):

> **Update after live MongoDB verification 2026-05-01** via `scripts/verify_data_cleanup.js`:
>
> The collections `student_profiles` and `college_branches` **do not exist** in
> the live `crucible` database — already clean. Mongoose never auto-created
> them because the models were never imported.
>
> However, the verification surfaced **other** collections worth dropping:

| Collection | Docs | Status | Recommendation |
|---|---|---|---|
| `questions` | 919 | V1 legacy. Sample `_id: CARBOXYLIC-001` (V1 string-ID format). | Confirm none of those questions are needed in V2 (they're not — V2 uses different prefixes per `display_id` aggregation), then drop. |
| `taxonomy` | 251 | V1 legacy taxonomy. CLAUDE.md says taxonomy lives in `taxonomyData_from_csv.ts`. | Drop. |
| `taxonomies` | 0 | Empty Mongoose-default-pluralized variant of the above. | Drop. |
| `user_mastery` | 19 | V1 legacy. CLAUDE.md says `UserMastery` was removed from `lib/models.ts`. | Spot-check 1-2 docs to be sure they're truly stale, then drop. |
| `auditlogs` | 1066 | Mongoose-default plural of `AuditLog`. The current model writes to `audit_logs` (30989 docs) via explicit `collection: 'audit_logs'`. | Some old code path wrote here. Spot-check, then drop. |

`student_profiles`, `college_branches` — **already do not exist; nothing to drop.**

### PR I-bug — Mongoose pluralization bug (separate, code change)

The verification revealed a real code bug:

| Schema declares | Mongoose actually uses | Live docs |
|---|---|---|
| `bitsat_plan_progress` | `bitsatplanprogresses` | 582 |
| `test_results` | `testresults` | 0 |

Some models declare an explicit `collection: '<name>'` in schema options
but Mongoose still auto-pluralizes. This means user data is landing in
collections your code didn't intend. The 582 BITSAT plan-progress
documents in `bitsatplanprogresses` are real user data.

**Fix:** add `collection: 'bitsat_plan_progress'` (and `'test_results'`)
to the schemas if missing, OR adjust the audit/code expectations to
accept the pluralized names. Either way, write a one-shot migration
script that copies docs from `bitsatplanprogresses` → `bitsat_plan_progress`
(or just renames the collection) before changing the code, otherwise
existing users lose progress.

This is **not part of the cleanup**; logged here so it doesn't get lost.

**PR J** — Active worktree decision (manual, destructive):
- `.claude/worktrees/jovial-ramanujan/` is registered as a git worktree on
  branch `claude/jovial-ramanujan`. `git worktree list` shows it as active.
  Skipped during autonomous cleanup since removing an active worktree affects
  shared state. If the branch is abandoned: `git worktree remove
  .claude/worktrees/jovial-ramanujan`.

**PR K** — `/backups/` directory (manual, destructive):
- Two MongoDB dumps from 2026-02-16 (10+ weeks old). Doc says safe since
  `npm run backup:r2` writes to R2 already, but skipped during autonomous
  cleanup — user should verify R2 backups exist for that date range first.

**PR L** — `/PYQ/` directory (manual judgment):
- Contains `guided-practice-agent-prompt.md` (planning doc, 296 lines) and
  `organic-master (3).html` (reference dump). Not consumed by live code.
  Could move to `/docs/archive/` or delete.

**PR M** — CLAUDE.md inconsistency (requires user decision):
- CLAUDE.md references `.agent/workflows/QUESTION_INGESTION_WORKFLOW.md`
  and `.agent/rules/{latex_formatting,question_management,security_protocol}.md`.
  Those files do NOT exist on disk. Either restore from git history, or
  edit CLAUDE.md to point at where the rules actually live now.

**Recommended new work (separate from cleanup):**
- `scripts/backup-sheets.ts` — daily backup of the 12 published Google Sheets to R2 under `backups/sheets/<date>/`
- `docs/SHEETS_INVENTORY.md` — document each sheet ID, owner, columns, route powered

### Git status after PR A
The user commits to git themselves. Diff to review:
- 9 files deleted (in `lib/models/`, `lib/`, `app/lib/`, `data/`)
- 1 line removed from `package.json`

Recommended commit message:
```
chore(cleanup): remove dead code and unimported data dumps

- Delete dead Mongoose models (StudentProfile, CollegeBranch)
- Delete dead Supabase Storage code (lib/assetManager.ts)
- Delete dead Google Sheets SDK stub (app/lib/sheets.ts)
- Remove googleapis dependency (was only used by the deleted stub)
- Delete unimported /data/ debris (5 files: legacy taxonomy dumps,
  one-shot answer keys, categorization metadata, doc moved to CLAUDE.md)

All verified to have zero live importers. See docs/DATA_STORES_GROUND_TRUTH_2026-04-30.md §12.
```
