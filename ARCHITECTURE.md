# ARCHITECTURE.md

**Status:** Canonical whole-app architecture reference.
**Last revised:** 2026-05-22 (post Phase 5 + biology + books-editor split).
**Scope:** Every app, every package, every external dependency.

> For Crucible-specific persona, mode, and recommendation invariants, see
> [`_agents/CRUCIBLE_ARCHITECTURE.md`](_agents/CRUCIBLE_ARCHITECTURE.md). This file
> covers the system shape; that file covers the domain logic that must never
> drift. If the two disagree, `CRUCIBLE_ARCHITECTURE.md` wins for persona;
> this file wins for topology.

---

## 1. The product in one paragraph

Canvas Classes is a JEE / NEET / CBSE prep platform serving **questions, solutions,
live books, flashcards, simulators, a career explorer, and a blog** to students in
classes 9–12. The flagship feature is **Crucible** — an adaptive question bank
(Chemistry, Physics, Maths, Biology) that captures every attempt, builds a per-
student persona, and serves recommendations from it. Live Books is an interactive
reader with 20+ block types (text, LaTeX, simulators, classify-exercises, etc.)
that the student reads and the admin authors via the same renderer. Career
Explorer is a 50-question instrument that maps responses to career profiles.

---

## 2. Monorepo topology

```
canvas/
├── apps/
│   ├── student/      → canvasclasses.in       (public + student-only surfaces)
│   └── admin/        → admin.canvasclasses.in (operator console, separate deploy)
├── packages/
│   ├── data/         @canvas/data             (Mongoose models, taxonomy, schemas, rbac)
│   ├── persona/      @canvas/persona          (mastery contract, writer, recommendations)
│   ├── services/     @canvas/services         (shared route handlers — DI'd auth)
│   ├── core/         @canvas/core             (R2, LaTeX validator, rate-limit, analytics)
│   ├── ui/           @canvas/ui               (MathRenderer, MoleculeViewer, flashcardMarkdown)
│   └── book-renderer/@canvas/book-renderer    (PageRenderer + 20 BlockRenderers + simulators)
├── scripts/                                   (ingestion + solution toolkits per subject)
└── _agents/                                   (architecture docs, ADRs, workflows)
```

**Two Next.js apps, six shared packages, one MongoDB cluster, one Supabase
project, one R2 bucket.** Both apps are deployed independently on Vercel; the
admin app is on a separate host so admin write routes are not network-reachable
from the public origin.

### 2.1 Package boundary rules (ADR-004)

1. **Apps must not import from each other.** `apps/student/` cannot import from
   `apps/admin/` and vice versa. tsc + workspace boundary enforce this.
2. **Packages must not import from apps.** No `packages/*/` file may reference
   `apps/*` or the `@/` alias. Packages use relative paths internally.
3. **Packages export named subpaths.** Imports are
   `from '@canvas/data/models/X'`, never `from '@canvas/data'` for deep modules.
4. **Both apps may import from any package.** Shared code lives in
   `packages/*/`; the apps are thin route shells plus app-specific features.

---

## 3. Apps

### 3.1 Student app — `apps/student/` (`canvasclasses.in`)

The student app serves every public-facing page and the student-only API surface.

#### Route groups

| Group | URL pattern | Purpose |
|---|---|---|
| **Crucible (V2 question bank)** | `/the-crucible`, `/the-crucible/q/[id]`, `/the-crucible/[chapterId]` | Browse/test/guided practice modes; question detail with solution |
| **Live Books** | `/books/[bookSlug]/[pageSlug]` | Interactive textbook reader (uses `@canvas/book-renderer`) |
| **NCERT class hubs** | `/class-9/[bookSlug]/[pageSlug]`, `/class-10`, `/class-11/chemistry/[pageSlug]`, `/class-12/chemistry/[pageSlug]`, `/cbse-class-{10,11,12}` | Per-class textbook + landing pages |
| **NCERT downloads** | `/download-ncert-books/[classSlug]/[chapterSlug]` | NCERT PDF directory |
| **Notes / lectures** | `/handwritten-notes/[chapter]`, `/detailed-lectures/[slug]`, `/one-shot-lectures`, `/quick-recap`, `/top-50-concepts`, `/2-minute-chemistry` | Long-form content (read-only) |
| **Exam-specific** | `/bitsat-chemistry-revision/plan/day/[n]`, `/neet-crash-course/[chapter]`, `/jee-main-pyqs/chemistry/[chapter]/[slug]`, `/jee-pyqs/[chapter]` | Exam-targeted question collections + study plans |
| **Career Explorer** | `/career-explorer/{browse,questionnaire/[id],results/[id],vision/[id],careers/[slug]}` | 50-question instrument + career catalog |
| **College Predictor** | `/college-predictor`, `/college-predictor/[slug]`, `/college-predictor/college/[slug]` | Rank → college mapping |
| **Simulators** | `/chemihex`, `/interactive-periodic-table`, `/inorganic-chemistry-hub` (VSEPR, bond-angles), `/organic-chemistry-hub`, `/organic-name-reactions`, `/organic-wizard`, `/physical-chemistry-hub`, `/salt-analysis`, `/solubility-product-ksp-calculator` | Interactive chemistry tools |
| **Flashcards** | `/chemistry-flashcards/[chapter]` | FSRS-scheduled flashcard decks |
| **Assertion-Reason** | `/assertion-reason` | A/R question format hub |
| **Blog** | `/blog`, `/blog/[slug]` | Blog index + post |
| **Auth + account** | `/login`, `/account`, `/auth/callback` | Supabase auth UI |
| **Static / legal** | `/`, `/about`, `/terms`, `/privacy` | Marketing + legal |

#### `features/` (feature-module layout)

| Feature | What's in it |
|---|---|
| `auth/` | Login/signup UI, OAuth, server actions |
| `blog/` | Blog grid + post content components |
| `books/` | `BookReader.tsx`, free-page gate, NCERT data maps, progress/bookmark hooks |
| `career-explorer/` | Browse, Questionnaire, Results, Vision clients + scoring/facets lib |
| `college-predictor/` | Rank predictor + cutoff trend charts |
| `crucible/` | Browse / Test / Guided UI, adaptive session wizard, dashboard, test generator, server actions |
| `flashcards/` | Deck UI, study heatmap, FSRS sync, offline service-worker |
| `landing/` | Hero, bento, testimonials, FAQs (marketing) |
| `legal/` | Consent gate + versioning |
| `notes/` | Chapter TOC, hero, side-by-side practice, reading shell |
| `public-content/` | Assertion-reason, lectures, NEET crash, quick-recap, top-50 |
| `simulations/` | Organic reactions, salt analysis, VSEPR, KSp data + logic |

#### `lib/`

| File | Purpose |
|---|---|
| `auth.ts` | Route-handler auth: `getAuthenticatedUser`, `isAdmin`, `hasScriptSecret` |
| `bookAuth.ts` | Server-component auth: `requireAdmin`, `getUserId`, `isLocalhostDev` |
| `spacedRepetition.ts` | FSRS card scheduling + leech detection |
| `supabase.ts` | Supabase client singleton (anon key) |
| `uploadUtils.ts` | Image compress + R2 upload |

#### Server actions

- `features/auth/server-actions.ts` — `login`, `signup`, `signInWithGoogle`
- `features/crucible/server-actions/the-crucible.ts` — Question/chapter/taxonomy reads, cached with `unstable_cache`
- `features/crucible/server-actions/progress.ts` — Apply attempt, compute mastery, call persona engine

#### API surface — `apps/student/app/api/v2/*`

**Thin wrappers over `@canvas/services`** (handler logic lives in the package):
`questions`, `questions/[id]`, `flashcards`, `flashcards/[id]`, `chapters`,
`taxonomy/load`, `assets/upload`, `assets/[id]`, `export/ppt`.

**Student-only (auth required, owned by student app):**

| Endpoint | Purpose |
|---|---|
| `user/progress` (GET/POST) | Single-attempt write (browse); read starred + attempted ids |
| `user/progress/batch` (POST) | Batch attempts (test submit) |
| `user/progress/session-confidence` (PATCH) | Reclassify browse session tier |
| `user/session-response` (POST) | Guided-mode rich attempt |
| `user/test-session` (POST) | Test session for overlap detection |
| `test-results` (POST) | Composite test doc |
| `user/chapter-profile` (GET/POST) | StudentChapterProfile R/W |
| `user/starred` (GET/POST) | Bookmarks |
| `user/stats` (GET) | Lifetime stats |
| `user/welcome` (GET) | Personalised welcome aggregator |
| `user/recommendations` (GET) | Engine output (currently stub-gated) |
| `user/example-views` (POST) | Worked-example view tracking |
| `user/flashcard-progress` (GET/POST/DELETE) | FSRS card state |
| `user/flashcard-metadata` (GET/POST) | Deck progress |
| `user/flashcard-day` (POST) | Daily FSRS batch |
| `books/{bookmarks,progress,stats,user-state}` | Book reader state |
| `questions/[id]/flag` (POST) | Student flag submission |
| `notes-quicktest/[chapterId]` (POST) | Generate chapter quick-test |

**Public read (no auth):** `questions/[id]/stats`, `career-explorer/careers/*`,
`career-explorer/questions`, `college-predictor/{colleges,predict}`,
`mock-tests`, `mock-tests/[id]`, `test-results` (GET), `validate/latex`.

**Public write (no auth):** `career-explorer/profiles` (create + submit anonymous
profiles — career instrument is consciously walk-up usable).

### 3.2 Admin app — `apps/admin/` (`admin.canvasclasses.in`)

Operator console. Single-origin, gated end-to-end.

#### Panels (`apps/admin/app/`)

| Route | Purpose |
|---|---|
| `/` | Card-grid landing linking every panel (ADR-005) |
| `/crucible` | Question editor for `questions_v2` — add/edit/tag/curate, flags, mock tests, analytics |
| `/flashcards` | Flashcard authoring — bulk import, image scaling, markdown |
| `/books` | Live Books editor — chapters, pages, 21 block-type editors, split-pane preview (uses `@canvas/book-renderer`) |
| `/blog` | Blog publishing — draft/review/publish, image upload, AI idea queue |
| `/taxonomy` | Chapter ↔ topic-tag editor; auto-syncs `taxonomyData_from_csv.ts` |
| `/career-explorer` | Career taxonomy (9 layers) + 50-question instrument + match overrides |
| `/dashboard` | Per-user progress + cohort analytics |
| `/preview` | Render a single question/flashcard as the student would see it |
| `/login` | Auth (the only path the middleware leaves open) |

#### `features/admin/`

| Subfolder | Purpose |
|---|---|
| `components/` | Every admin UI — `QuestionAdmin.tsx`, `FlashcardAdminClient.tsx`, `BlogAdminClient.tsx`, `MockTestsAdmin.tsx`, `UserDashboard.tsx`, `AnalyticsDashboard.tsx`, `FlagsDashboard.tsx`, `RoleManagement.tsx`, `BulkImportModal.tsx`, `QuestionTaggingRow.tsx`, `AITagSuggestionsBox.tsx`, `LaTeXValidator.tsx`, `SVGDropZone.tsx`, `VideoDropZone.tsx`, etc. |
| `books-editor/` | `BookWorkspace.tsx` + 21 block-type editors (Text, Latex, Image, Video, Animation, Simulation, Molecule2D/3D, InteractiveImage, ClassifyExercise, Timeline, ComparisonCard, Heading, Section, Table, Callout, WorkedExample, PracticeLink, InlineQuiz, AudioNote, CuriosityPrompt) |
| `hooks/` | `useAdminFilterUrlSync`, `useAdminKeyNav`, `usePermissions` |

#### `lib/`

| File | Purpose |
|---|---|
| `auth.ts` | Same shape as student: `getAuthenticatedUser`, `isAdmin`, `hasScriptSecret` |
| `adminAuth.ts` | Server-component admin gates: `requireAdmin`, `isAdminRequest`, `getUserId`, `isLocalhostDev` |
| `serverActions/` | Server-action wrappers for write panels |

#### `middleware.ts` — the first gate

Protects every path except `/login`, `/api/auth/*`, `/_next/*`, static assets.

1. **Localhost dev bypass:** `NODE_ENV=development` + `VERCEL!=='1'` + hostname is `localhost`/`127.0.0.1` → pass through. Vercel previews fail this check (correctly).
2. **Supabase session check:** unsigned → redirect UI paths to `/login?next=...`, return 401 for `/api/*`.
3. **`ADMIN_EMAILS` allow-list (case-insensitive):** not in list → 403.

**Defense in depth:** middleware is line 1. Every route handler still calls
`requireAdmin()` or `getAuthenticatedUser() + isAdmin()`. Never rely on one
layer alone. CLAUDE.md §8 owns the full set of mandatory security rules.

#### API surface — `apps/admin/app/api/v2/*`

**The 9 shared wrappers** (same routes as student app, both call `@canvas/services`):
`questions`, `questions/[id]`, `flashcards`, `flashcards/[id]`, `chapters`,
`taxonomy/load`, `assets/upload`, `assets/[id]`, `export/ppt`.

**Admin-only** (no student equivalent):

| Group | Routes |
|---|---|
| `admin/*` | `permissions` (GET), `roles` (GET/PATCH), `revalidate` (POST), `debug/sentry` |
| `ai/*` | `analyze` (POST), `generate-solution` (POST) |
| `blog/*` | `blog/[id]` (PATCH publish) |
| `books/*` | `books`, `books/[bookSlug]`, `books/[bookSlug]/pages`, `books/[bookSlug]/pages/[pageSlug]`, `books/[bookSlug]/pages/[pageSlug]/publish`, `books/[bookSlug]/chapters/[chapterNumber]/publish`, `books/[bookSlug]/pages/reorder`, `books/assets/upload` |
| `career-explorer/*` | `careers`, `careers/[slug]`, `questions`, `questions/[id]`, `matches/[matchId]/override`, `profiles/[id]/*` (admin overrides) |
| `mock-tests/*` | `mock-tests`, `mock-tests/[id]`, `mock-tests/[id]/questions`, `mock-tests/[id]/questions/[qid]` |
| `questions/*` (admin-only sub-routes) | `questions/flagged` (GET), `questions/[id]/flag/[flagIdx]` (DELETE), `questions/[id]/reclassify` (POST) |
| `taxonomy/save` (POST) | Persist taxonomy from the editor |

---

## 4. Shared packages

### 4.1 `@canvas/data` — the data layer

Owns every Mongoose model, the canonical taxonomy, ID generation, difficulty
math, Zod schemas, and RBAC. **Single source of truth for data shape.**

**Models** (30 files in `packages/data/models/`):

| Domain | Models |
|---|---|
| Crucible (questions) | `Question.v2`, `Chapter`, `Asset`, `AuditLog`, `TestResult`, `MockTestSet`, `ResourceLink` |
| Persona | `UserProgress`, `StudentChapterProfile`, `StudentResponse`, `ActivityLog`, `ChapterView` |
| Flashcards | `Flashcard`, `FlashcardProgress` |
| Live Books | `Book`, `BookPage`, `BookProgress`, `BookBookmark` |
| Career Explorer | `CareerPath`, `CareerProfile`, `CareerQuestion`, `CareerMatch` |
| College Predictor | `College`, `CollegeCutoff` |
| Blog | `BlogPost`, `BlogIdea`, `BlogSource` |
| BITSAT plan | `BitsatPlanProgress` |
| RBAC / audit | `UserRole`, `RoleAuditLog` |

**Other key exports:**

| Path | Purpose |
|---|---|
| `db/mongodb.ts` | Mongoose connection singleton; reads `MONGODB_URI` |
| `taxonomy/taxonomyData_from_csv.ts` | Canonical exam → subject → chapter → topic tree |
| `taxonomy/lookup.ts` | `getTagName`, `getParentChapter`, `getChapterCategory` |
| `id-generator/index.ts` | `generateDisplayId`, `regenerateDisplayId` (e.g. `ATOM-042`) |
| `difficulty.ts` | Difficulty calc + calibration |
| `schemas/question.ts` | Zod validator used by service handlers |
| `rbac.ts` | `getUserPermissions`, `getQuestionFilter`, `canEditQuestion`, `getSubjectFromChapterId` |
| `books/{utils,schemas}.ts` | Block flatteners, reading-time, validators |
| `flashcards/flashcardTaxonomy.ts` | Flashcard subject/chapter map |
| `types/books.ts` | Shared content-block type definitions |

### 4.2 `@canvas/persona` — the learner model

Encodes the mastery contract (confidence tiers, mastery thresholds) and is the
ONLY surface that mutates `UserProgress`. See `CRUCIBLE_ARCHITECTURE.md` §4–§5
for the persona invariants this package enforces.

| File | Purpose |
|---|---|
| `contract.ts` | Read-side constants + classifiers: `ALLOWED_TIERS`, `MASTERY_THRESHOLDS`, `PROFICIENCY_ORDER`, `resolveConfidenceTier`, `computeChapterMasteryLevel`, `computeProficiencyLevel`, `shouldDropBack`, `computeDominantWeakness` |
| `writer.ts` | `applyAttemptToProgress(progress, attempt)` — canonical mutation surface. Callers save the doc themselves. |
| `user-progress-updater.ts` | `computeUserProgressUpdate(snapshot, attempt)` — pure value-oriented core of `writer.ts`. Safe to import from tests, AI replay, admin sims. |
| `profile-engine.ts` | `updateProfileFromResponse`, `updateProfileFromAttempt` — builds `StudentChapterProfile` rollups |
| `recommendation-engine.ts` | `getRecommendations(userId, opts)`, `getResourceForConcept(tagId)` — algorithm is stubbed today; bridge is wired |
| `scoring.ts` | `isAnswerCorrect` — pure answer evaluator (MCQ, fill-in-the-blank, range-check) |
| `index.ts` | Barrel exports |

**Rule:** new code that needs to write `UserProgress` calls `writer.ts`.
New code that needs to compute (not write) calls `user-progress-updater.ts`.
Never reach past either into raw `$set` mutations.

### 4.3 `@canvas/services` — shared route handlers (ADR-001)

Pure-function route handlers for the **9 routes both apps host**. Each takes
a `ServiceDeps` arg that injects app-local auth helpers — so the same handler
runs under student auth in `apps/student/` and under admin auth in `apps/admin/`.

| Service file | Routes it serves | Notes |
|---|---|---|
| `questions.ts` | `GET /api/v2/questions`, `POST` | List + create. Calls `questions-filters.ts` for query parsing |
| `questions-by-id.ts` | `GET/PATCH /api/v2/questions/[id]` | Single Q read + update |
| `questions-filters.ts` | (helper) | Pure functions: `parseQuestionParams`, `buildMongoFilter`, `buildProjection`, `isSimpleChapterFetch`. §4.5 legacy-param bridge lives here. |
| `flashcards.ts` | `GET/POST /api/v2/flashcards` | List + create |
| `flashcards-by-id.ts` | `GET/PATCH/DELETE /api/v2/flashcards/[id]` | Single card R/W |
| `chapters.ts` | `GET /api/v2/chapters` | Chapter list |
| `taxonomy-load.ts` | `GET /api/v2/taxonomy/load` | Tree fetch |
| `assets-upload.ts` | `POST /api/v2/assets/upload` | R2 presigned upload |
| `assets-by-id.ts` | `GET/DELETE /api/v2/assets/[id]` | Asset proxy / removal |
| `export-ppt.ts` | `POST /api/v2/export/ppt` | PPTX export via pptxgenjs |
| `auth.ts` | (shared admin gate) | `requireAdmin(req, deps)` — used by every admin-mutation handler |
| `types.ts` | (types) | `ServiceDeps` interface |

**Rule:** any change to handler logic goes in `@canvas/services`. App-side
`route.ts` wrappers only ever change to add/remove Next.js segment config
(`runtime`, `maxDuration`).

### 4.4 `@canvas/core` — infrastructure utilities

| Path | Purpose |
|---|---|
| `rate-limit.ts` | `createRateLimiter` + `getClientIp`. In-memory `Map`-based; CLAUDE.md §8.11 calls out the multi-instance limitation. |
| `latex-validator.ts` | Validates KaTeX/MathML strings before storage |
| `redirect-validation.ts` | `sanitizeRedirect` — anti open-redirect / SSRF (strict `.endsWith` suffix matching) |
| `r2-storage.ts` | Cloudflare R2 client (`canvas-chemistry-assets` bucket) |
| `utils.ts` | `cn()` classname merger + small helpers |
| `analytics/{mixpanel.server,mixpanel.client}.ts` | Mixpanel event tracking, both sides |

### 4.5 `@canvas/ui` — shared rendering components

Three files. Anything more elaborate belongs to one app or to `book-renderer`.

| Component | Purpose |
|---|---|
| `MathRenderer.tsx` | KaTeX → DOM with hardened MathML allowlist (DOMPurify) |
| `MoleculeViewer.tsx` | 2D molecule via OpenChemLib. Used by organic-wizard + Live Books |
| `flashcardMarkdown.tsx` | Markdown component dict specialised for flashcard front/back |

### 4.6 `@canvas/book-renderer` — Live Books reader (ADR-007)

The reader-side render package. Both the student `BookReader.tsx` and the admin
books-editor's split-pane preview consume it.

| Export | Purpose |
|---|---|
| `PageRenderer.tsx` | Renders a whole book page; wraps `BlockRenderer` |
| `BlockRenderer.tsx` | Dispatches to 20+ lazy-loaded block renderers (Text, Heading, Section bundled; everything else `React.lazy`) |
| `blocks/*` | TextBlock, ImageBlock, VideoBlock, AudioNote, Molecule2D/3D, Latex, PracticeLink, Callout, Table, Timeline, ComparisonCard, Animation, InteractiveImage, ClassifyExercise, WorkedExample, InlineQuiz, CuriosityPrompt, Simulation, Heading, Section |
| `simulators-context.tsx` | React Context — `ExtraSimulatorsProvider` lets app-route-local simulators (currently only `atomic-models`) inject into the renderer without `book-renderer` knowing about them |

---

## 5. Data plane

### 5.1 MongoDB Atlas (`crucible-cluster`, db `crucible`)

| Collection | Owner | Active? |
|---|---|---|
| `questions_v2` | Crucible | ✅ Active |
| `chapters` | Taxonomy | ✅ |
| `assets` | Question/book media | ✅ |
| `auditlogs` | Mutation history | ✅ |
| `userprogress` | Persona substrate | ✅ |
| `studentchapterprofiles` | Microconcept rollup | ✅ (guided mode primary) |
| `studentresponses` | Per-attempt rich log | ✅ |
| `testresults` | Composite test doc | ✅ |
| `mocktestsets` | Pre-curated papers | ✅ |
| `resourcelinks` | Recommendation bridge | ⚠️ Empty — schema in place |
| `flashcards`, `flashcardprogress` | Flashcards | ✅ |
| `books`, `bookpages`, `bookprogress`, `bookbookmarks` | Live Books | ✅ |
| `careerpaths`, `careerprofiles`, `careerquestions`, `careermatches` | Career Explorer | ✅ |
| `colleges`, `collegecutoffs` | College Predictor | ✅ |
| `blogposts`, `blogideas`, `blogsources` | Blog | ✅ |
| `bitsatplanprogress` | BITSAT 60-day plan | ✅ |
| `userroles`, `roleauditlogs`, `activitylog`, `chapterviews` | RBAC + observability | ✅ |
| `questions` | V1 legacy | ❌ Deprecated — never write |

**Connection:** every connection goes through `packages/data/db/mongodb.ts`,
reads `MONGODB_URI`. Never hardcoded.

> The word "canvas" appears only in the R2 bucket name. **There is no canvas
> database.** The cluster is `crucible-cluster`, the database is `crucible`.

### 5.2 Supabase

Auth only (no application data). Email/password + Google OAuth. Admin gate is
the `ADMIN_EMAILS` env allow-list — not a Supabase role.

Future direction (deferred from Phase 5): a `Shape B` admin auth (bcrypt + JWT
+ `admin_accounts` table) — see ADR-003. The DI pattern in ADR-001 keeps that
migration a drop-in swap.

### 5.3 Cloudflare R2

Bucket `canvas-chemistry-assets`. Stores question images, solution SVGs/videos,
book images, flashcard images, blog images. Access via presigned URLs from
`@canvas/core/r2-storage` (server side) and `@canvas/services/assets-upload`
(client → server upload flow).

### 5.4 Analytics

Mixpanel (server + client), wrapped via `@canvas/core/analytics/`. Cloudflare
Analytics + Google Analytics on the student app. CLAUDE.md tracks current
event sparsity as a gap (`chapter_opened`, `test-session`, `test-results` are
the few committed events).

---

## 6. Auth model

### 6.1 Two canonical files, no inline duplicates

**Both apps** keep auth in exactly two files. New code must import from these
— never define a local `getAuthenticatedUser` or `isAdmin`.

| Context | File | Functions |
|---|---|---|
| Route handlers (`/api/**`) | `lib/auth.ts` (per app) | `getAuthenticatedUser(request)`, `isAdmin(email)`, `hasScriptSecret(request)` |
| Server components / actions | `lib/bookAuth.ts` (student) / `lib/adminAuth.ts` (admin) | `requireAdmin()`, `getUserId()`, `isAdminRequest()`, `isLocalhostDev()` |

For service handlers in `@canvas/services` doing admin mutations, the shared
gate is `requireAdmin(req, deps)` from `packages/services/auth.ts`.

### 6.2 Defense in depth (admin)

1. **Network boundary:** admin app is on `admin.canvasclasses.in` only.
   Public DNS does not route admin paths anywhere.
2. **Middleware gate** (`apps/admin/middleware.ts`): Supabase session +
   `ADMIN_EMAILS` allow-list. Blocks unsigned and non-admin requests before
   they reach handlers.
3. **Per-route admin guards:** every mutating handler calls `requireAdmin()`
   or `getAuthenticatedUser() + isAdmin()`. Never rely on middleware alone.
4. **Future Phase 5.5d:** split MongoDB users so the student app gets
   read-only access to admin-managed collections. Deferred until Phase 5 is
   observed stable.

### 6.3 Hard rules (from CLAUDE.md §8)

- **`NODE_ENV === 'development'` is never used as an auth bypass.** Vercel
  previews set `NODE_ENV=development`. Use `isLocalhostDev()` instead.
- **Every POST/PATCH validates input** with a Zod schema or explicit
  whitelist. Never `$set: body`.
- **Error responses must not leak internals.** No `error.message`, no stacks.
- **Queries are bounded** with `.limit()`. Pagination capped.
- **Public-read endpoints** are explicit and rate-limited.

---

## 7. Routing topology summary

```
Student app  (canvasclasses.in, apps/student/)
  ├── Pages       — /the-crucible, /books, /class-*, /career-explorer, ...
  ├── Server      — features/<feature>/server-actions/*  (read-heavy, cached)
  └── /api/v2/*
       ├── Public read     — questions GET (anon-throttled), stats, careers, mock-tests
       ├── Student write   — user/progress, user/starred, test-results, flag, ...
       ├── Public write    — career-explorer/profiles (anonymous instrument)
       └── 9 shared wraps  — @canvas/services + student auth deps

Admin app    (admin.canvasclasses.in, apps/admin/)
  ├── Pages       — /, /crucible, /flashcards, /books, /blog, /taxonomy,
  │                  /career-explorer, /dashboard, /preview, /login
  ├── Middleware  — Supabase + ADMIN_EMAILS gate (all paths except /login + assets)
  └── /api/v2/*
       ├── 9 shared wraps     — @canvas/services + admin auth deps
       └── Admin-only routes  — admin/*, ai/*, blog/*, books/*, career-explorer/*,
                                 mock-tests/*, questions/* (flagged|reclassify|flag idx),
                                 taxonomy/save
```

Both apps share `@canvas/data` → MongoDB. Same cluster, same models. The hard
network boundary is the admin host.

---

## 8. Critical invariants (whole-app)

For the persona pipeline invariants — submit-then-reveal, confidence tiers,
canonical writer, the recommendation bridge — see `_agents/CRUCIBLE_ARCHITECTURE.md` §3, §4, §9.

System-wide rules that must hold across the codebase:

| Invariant | Why | Check |
|---|---|---|
| V2 is the only active question system | V1 retired; mixing systems breaks all reads | grep new code for `models.ts` (V1) or `/api/questions/` — must be 0 |
| All `/api/v2/*` mutations go through canonical auth | Drift across 30+ routes | grep `function getUserId` in `app/api/v2/` — must be 0 |
| `NODE_ENV === 'development'` is never an auth bypass | Vercel preview leak | grep — must be 0 |
| Apps don't import from each other | Boundary collapse | tsc workspace boundary enforces |
| Packages don't import from apps | Cycle / shape contamination | grep `from '@/'` and `from 'apps/'` in `packages/` — must be 0 |
| All new questions insert with `status: 'published'` | No review gate; flags handle issues | grep new ingestion code for `status: 'review'` — must be 0 |
| Canonical field names only (`solution.text_markdown`, `applicableExams`, `examDetails`) | Read paths only honour canonical fields | CLAUDE.md §4.5 |
| Exam labels use `formatExamLabel()` helper | Bespoke formatters drift | grep new code rendering exam strings — must call helper |
| `requireAdmin` from shared modules, never inline | Auth shape drift | grep new route handlers for `isAdmin` redefinitions |
| Connection via `MONGODB_URI` env, never hardcoded | Credential leak | grep for hardcoded mongodb URIs — must be 0 |
| Simulators follow `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` | Visual / academic drift | New simulator PR must reference the workflow |
| Ingestion follows the per-subject workflow doc | Field name + LaTeX corruption | `_agents/workflows/{CHEM,PHYS,MATH,BIO}_INGESTION_WORKFLOW.md` |

---

## 9. ADR index

All ADRs live in `_agents/adr/`. Each is one decision, one rationale, alternatives.

| # | Title | Decided |
|---|---|---|
| 001 | Service-layer DI pattern for shared route handlers | Extract handler logic to `@canvas/services`; apps inject auth via `ServiceDeps` |
| 002 | Split admin into its own Next.js app | `apps/admin/` on `admin.canvasclasses.in` — network-level isolation, not just middleware |
| 003 | Ship admin auth as Shape A; defer Shape B | Supabase + `ADMIN_EMAILS` now; bcrypt+JWT+admin_accounts is a future drop-in |
| 004 | `@canvas/*` package boundary rules | No app↔app imports; no app refs in packages; no `@/` in packages; subpath exports |
| 005 | Flatten admin URLs + landing page | `/admin/crucible` → `/crucible`; new card-grid `/` |
| 006 | OCH admin stays in student app as dev tool | Organic-chem hub editor is a dev tool, not production admin |
| 007 | Books editor migration to admin via shared renderer | Extract `@canvas/book-renderer`; promote `MoleculeViewer` to `@canvas/ui` |
| 008 | Biology as a first-class subject (NEET-UG track) | Single `chapterType: 'biology'` (32 chapters); optional `metadata.ncert_reference`; no botany/zoology split |

---

## 10. Other docs in `_agents/`

| Doc | Purpose |
|---|---|
| `CRUCIBLE_ARCHITECTURE.md` | Crucible persona/mode/recommendation invariants (deep-dive — read for any persona-touching change) |
| `DEEPENING_BACKLOG.md` | Refactor / consolidation opportunities surfaced by audits |
| `MEMORY_SNAPSHOT.md` | Frozen point-in-time handoff snapshot |
| `MONOREPO_MIGRATION_PLAN.md` | Phases 0–6 execution log + gates |

**Workflows** (`_agents/workflows/`) — single source of truth for repeating procedures:

| Doc | Procedure |
|---|---|
| `QUESTION_INGESTION_WORKFLOW.md` | Chemistry PYQ ingestion (canonical template all four subjects follow) |
| `PHYSICS_QUESTION_INGESTION_WORKFLOW.md` | Physics ingestion variant |
| `MATH_QUESTION_INGESTION_WORKFLOW.md` | Math ingestion variant |
| `BIOLOGY_QUESTION_INGESTION_WORKFLOW.md` | Biology (NEET-UG) ingestion variant |
| `MOCK_TEST_INGESTION_WORKFLOW.md` | Pre-curated paper insertion into `mock_test_sets` |
| `chemistry-solution-workflow.md` | Tiered chemistry solution authoring |
| `physics-solution-workflow.md` | Tiered physics solution authoring |
| `math-solution-workflow.md` | 6-section "how to start" math solution structure |
| `biology-solution-workflow.md` | 6-section biology solution structure (NCERT-anchored) |
| `BOOK_PAGE_WORKFLOW.md` | Live Books page authoring (two tracks: NCERT 9–10 vs. JEE/NEET 11–12) |
| `SIMULATION_DESIGN_WORKFLOW.md` | Canonical simulator color/typography/component ruleset |
| `CRUCIBLE_TAXONOMY_AND_TAGGING_RULES.md` | Post-insertion taxonomy maintenance + micro-concept naming |

---

## 11. Where things live — quick lookup

| I need to change… | Look at |
|---|---|
| Question data shape | `packages/data/models/Question.v2.ts` + `packages/data/schemas/question.ts` |
| What gets written when a student submits | `packages/persona/writer.ts` + `packages/persona/user-progress-updater.ts` |
| Recommendation algorithm | `packages/persona/recommendation-engine.ts` |
| The 9 shared API routes | `packages/services/<route>.ts` (NOT the app `route.ts` wrappers) |
| An admin-only API | `apps/admin/app/api/v2/<path>/route.ts` |
| A student-only API | `apps/student/app/api/v2/<path>/route.ts` |
| The question editor UI | `apps/admin/features/admin/components/QuestionAdmin.tsx` |
| The student question detail UI | `apps/student/features/crucible/components/` + `app/the-crucible/q/[id]/page.tsx` |
| Live Books page rendering | `packages/book-renderer/PageRenderer.tsx` + `BlockRenderer.tsx` |
| Live Books authoring | `apps/admin/features/admin/books-editor/BookWorkspace.tsx` |
| Add a new block type | Block renderer in `packages/book-renderer/blocks/`, block editor in `apps/admin/features/admin/books-editor/blocks/`, schema in `packages/data/types/books.ts` + `packages/data/books/schemas.ts` |
| Taxonomy edit | `admin.canvasclasses.in/taxonomy` UI → `POST /api/v2/taxonomy/save` (do NOT hand-edit `taxonomyData_from_csv.ts`) |
| Auth helper | `apps/{student,admin}/lib/auth.ts` (route handlers) or `lib/bookAuth.ts` / `lib/adminAuth.ts` (server components) |
| R2 upload | `packages/core/r2-storage.ts` + `packages/services/assets-upload.ts` |
| Mixpanel event | `packages/core/analytics/mixpanel.{server,client}.ts` |
| Add a simulator | New file in `packages/book-renderer/simulators/` OR app-route-local + register via `ExtraSimulatorsProvider`. Follow `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md`. |
| New ingestion script | `scripts/insert_<chapter>_b<N>.js`. Follow the per-subject workflow doc. Never `node -e "..."`. |
| New solution batch | `scripts/<subject>-solutions/` toolkit (math is the most polished — others catch up to it) |

---

## 12. Maintaining this doc

Update this file in the same PR as any change to:
- §2 monorepo topology
- §3 app routing / feature directories
- §4 package layout or exports
- §5 collections, env vars, or external services
- §6 auth model
- §9 ADR list (when adding a new one)

A doc that's stale by one PR is more harmful than no doc. If a change to the
codebase contradicts this file, **the fix is to update the doc**, not to
silently diverge.

Persona-specific (modes, tier model, concept_mastery shape, recommendation
bridge) — update `_agents/CRUCIBLE_ARCHITECTURE.md`. This file deliberately
defers to it for those topics.
