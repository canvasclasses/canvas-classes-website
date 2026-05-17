# Architecture Deepening Backlog

Last updated: 2026-05-17 (after migration close-out audit on branch `code-refactor`).

This is a living list of architecture work that came out of running the
`improve-codebase-architecture` skill across the full repo after the
monorepo migration shipped. Items here are NOT bugs and NOT migration
blockers — they're deepening opportunities surfaced by depth audits of
each package + a code-reviewer + security-auditor sweep.

**Format** uses the vocabulary in
[`.claude/skills/improve-codebase-architecture/LANGUAGE.md`](../.claude/skills/improve-codebase-architecture/LANGUAGE.md):
**module / interface / depth / seam / adapter / locality / leverage**.
The **deletion test**: imagine deleting the module — if complexity vanishes,
it was a pass-through; if it reappears at N callers, it was earning its keep.

**Source of these findings:** six parallel audit agents on 2026-05-17 over
the post-migration codebase (4 depth audits per major package, plus
`code-reviewer` and `security-auditor` skill sweeps over `1561a5d..HEAD`).
Both review skills returned **no Critical or High findings** — the migration
is merge-ready as-is. Everything below is architecture polish.

---

## Load-bearing (worth doing soon)

### 1. Reuse `deps.isAdmin` in flashcard services

**Files**
- `packages/services/flashcards.ts:126-140` (POST)
- `packages/services/flashcards-by-id.ts:73-79` (PATCH), `:159-165` (DELETE)

**Problem**
Three handlers re-parse `process.env.ADMIN_EMAILS` inline instead of calling
`deps.isAdmin` from the `ServiceDeps` interface. `CLAUDE.md` §8.2 forbids
re-defining `isAdmin` locally. The DI seam exists precisely so admin checks
can be swapped per app — Shape B (bcrypt + JWT + `admin_accounts`,
[ADR-003](./adr/003-admin-auth-shape-a-first.md)) would mean editing
`apps/admin/lib/auth.ts:isAdmin` once. Inline env-var parsing breaks that.

**Solution**
Replace each inline check with `if (!user?.email || !deps.isAdmin(user.email)) return 403;`.
~9 lines deleted across 3 sites.

**Benefits**
- **Locality**: admin-check rule lives in one place per app.
- **Leverage**: Shape B migration swaps one function; no per-route edits.
- **Testability**: mock `deps.isAdmin`; no env-var setup needed.

**Surfaced by**: services depth audit + security-auditor (Medium).

---

### 2. Extract a `requireAdmin` helper inside `@canvas/services`

**Files**
- Same flashcards files as #1
- New helper: `packages/services/auth.ts` (or expanded `types.ts`)

**Problem**
Beyond the inline `isAdmin` issue, the entire "if not localhost, require auth,
require admin email" block is copy-pasted across flashcard POST / PATCH /
DELETE. Each handler repeats ~12 lines of ceremony before the actual
mutation logic. The next admin-mutation service added to the package will
copy it again. Pre-existing pattern, but the new package boundary makes the
fix one place.

**Solution sketch**
```ts
export async function requireAdmin(
  request: NextRequest,
  deps: ServiceDeps
): Promise<{ ok: true; user: User } | { ok: false; status: 401 | 403; error: string }>
```
Each handler shrinks to `const auth = await requireAdmin(req, deps); if (!auth.ok) return NextResponse.json(...);`.

**Benefits**
- **Depth**: turns three shallow gate blocks into one deep gate.
- **Leverage**: the next admin-mutation service gets the gate free.
- **Locality**: future auth-shape changes (Shape B) need to touch the helper, not every handler.

**Surfaced by**: services depth audit.

**Note**: Depends on #1 being done (so the helper can use `deps.isAdmin`
rather than re-importing the inline logic it replaces).

---

### 3. Lift the URL-param filter builder out of `questions.ts:GET`

**Files**
- `packages/services/questions.ts:90-234`

**Problem**
A 250-line GET handler bundles three separable concerns: (a) URL param
parsing + normalization (~130 lines), (b) three different query paths
(fast-path A: batch-by-IDs, fast-path B: cached chapter fetch, slow path:
dynamic query), (c) response formatting. The parsing block contains the
§4.5 legacy-param-bridge logic (the `is_pyq`/`exam_level`/`examBoard`
translation block) that CLAUDE.md says will be deleted "after Phase 4."

The 130-line parsing block touches no I/O — it's pure computation, only
untestable today because it sits inside an HTTP handler.

**Solution sketch**
Extract two pure functions:
```ts
function parseQuestionParams(searchParams: URLSearchParams): ParsedFilters
function buildMongoFilter(parsed: ParsedFilters, rbacFilter?: object): Filter
function buildProjection(parsed: ParsedFilters): Projection
```
The GET handler shrinks to: parse → check fast-path conditions → build
filter → query → format.

**Benefits**
- **Testability**: `buildMongoFilter({ is_pyq: 'true', exam_level: 'mains' })`
  becomes a one-line unit test with no Mongoose.
- **Locality**: when the legacy-param bridge is finally deleted (per CLAUDE.md
  §4.5 deprecation table), you edit one function.
- **Leverage**: analytics/exports could reuse the same filter shape.

**Surfaced by**: services depth audit.

---

### 4. Pull `applyAttemptToProgress` into a pure `(state, event) → state` function

**Files**
- `packages/persona/writer.ts`

**Problem**
The densest single function in the persona pipeline (140 lines, mutates 7
sub-structures of a hydrated Mongoose `UserProgress` document in place).
[`CRUCIBLE_ARCHITECTURE.md`](./CRUCIBLE_ARCHITECTURE.md) identifies it as
the canonical mutation surface for student attempts. Past bug (audit #18:
streak math overwriting `prevPracticeDate` before reading it) lived here —
finding it required reading the whole function because the seam is at
"mutate a Mongoose doc," not at the actual state transition.

To test "given `recent_attempts=[a,b,c]` + new attempt `d`, the result is
`[d,a,b,c]`" you need a real DB or a complete Mongoose mock. The interface
shape blocks the test seam at the most important place in the codebase.

**Solution sketch**
Extract a pure value-oriented core:
```ts
// New: packages/persona/user-progress-updater.ts
export function updateUserProgressState(
  current: Readonly<IUserProgress>,
  attempt: IQuestionAttempt
): IUserProgress
```
Keep `applyAttemptToProgress(doc, attempt)` as a 3-line wrapper:
```ts
const updated = updateUserProgressState(progress.toObject() as IUserProgress, attempt);
Object.assign(progress, updated);
```
Public interface unchanged; opens an **internal seam** for tests.

**Benefits**
- **Testability** — biggest win in the codebase. Tier-gating rules,
  streak-math edge cases, the demo-question constraint all become
  pure-function tests.
- **Locality** preserved (no change to where the logic lives).
- **Leverage**: admin dashboards / AI training pipelines can simulate
  "what would this attempt do to the user's state" without touching the
  DB.

**Surfaced by**: persona depth audit.

**Invariant to preserve**: writer remains the canonical mutation surface
([CRUCIBLE_ARCHITECTURE.md](./CRUCIBLE_ARCHITECTURE.md) §9 invariant #3).
No changes to the public function signature.

---

## Polish (defer until triggered)

### 5. Port-and-adapter for rate-limiting

**Files**: `packages/core/rate-limit.ts`, all callers in `packages/services/` + route handlers.

**Problem**: in-memory `Map`-based limiter is module-scope. Each Vercel cold
start gets a fresh budget — limits don't coordinate across instances under
load. Pre-existing, not introduced by migration. CLAUDE.md §8.9 already
notes "Redis-based rate limiting (e.g. Upstash) should replace in-memory
maps at production scale."

**Solution shape**: factory + adapters. `createRateLimiter({ store: 'memory' | 'redis' })`.

**Trigger**: when traffic is high enough that per-instance budgets become a
real problem (you'll see it in monitoring as "users hitting limits faster
on hot instances"). **One adapter is a hypothetical seam** — don't introduce
the port until the Redis adapter is being written.

**Surfaced by**: data+core depth audit + both review agents (as known
non-blocker).

---

### 6. Field whitelist on `questions-by-id.ts:PATCH` metadata + `flashcards.ts:POST` body

**Files**: `packages/services/questions-by-id.ts:169-211`, `packages/services/flashcards.ts:154`.

**Problem**: `merged = { ...existing.metadata, ...body.metadata }` then
`$set: { metadata: merged }` lets any authenticated admin/subject-admin
write arbitrary metadata keys. RBAC limits cross-subject damage but not
within-subject. An admin can forge `metadata.is_top_pyq: true` to elevate a
low-quality question into the Top-PYQ pool. §8.6 violation. Pre-existing.
Same shape applies to `Flashcard.create({ ...body, ... })` in
`flashcards.ts:154`.

**Solution**: explicit allowed-keys list (whitelist) per write path.

**Trigger**: now-ish, but separately from the migration. Track as a security
ticket. Not merge-blocking — admin-only, well-trusted user base today.

**Surfaced by**: security-auditor (Medium).

---

### 7. Event-schema validation in analytics wrapper

**Files**: `packages/core/analytics/mixpanel.ts`, `mixpanel.server.ts`.

**Problem**: pass-through wrapper over Mixpanel. The interface mirrors
Mixpanel's almost exactly — the module is **shallow**: callers have to learn
essentially everything they'd learn calling Mixpanel directly. PII
protection becomes "did the developer remember to use `sanitize()`?" — a
defensive pattern, not a preventive one.

**Solution sketch**: Zod schema per event type. `trackAnalytics('chapter_opened', { chapterId, duration })`
validates props at compile time. Sanitization moves from defensive
post-processing to preventive schema enforcement.

**Trigger**: before adding the next analytics event. Today's N-events-no-schema
is the right size to be drowning, not yet at the size to be enforcing.

**Surfaced by**: data+core depth audit.

---

### 8. AdminPanel abstraction for repeated dashboards

**Files**: `apps/admin/features/admin/components/{FlagsDashboard, UserDashboard, RoleManagement, MockTestsAdmin, BlogAdminClient, ExportDashboard}.tsx`.

**Problem**: six components, 300–1,243 lines each, all implementing the
same shape: load → useState/useEffect → render filterable table → CRUD
actions. Each has exactly one caller (a route page.tsx). Deletion test:
complexity *concentrates* if inlined — doesn't multiply. So these are
**file-size-pressure extractions**, not real modules with depth.

**Solution shape**: `<AdminPanel title columns dataKey actions />` that owns
loading / error / filter / pagination internally. Each dashboard becomes
thin config.

**Trigger**: when adding the 7th dashboard. Three call sites is the floor
for justifying an abstraction; we're past that, but the pattern isn't
stable enough to know what the right shape is yet. Premature.

**Surfaced by**: features depth audit.

---

### 9. Consolidate the two `Question` interfaces in `apps/student/features/crucible/`

**Files**:
- `apps/student/features/crucible/types.ts` (legacy camelCase, kept for back-compat)
- `apps/student/features/crucible/components/types.ts` (canonical, matches `Question.v2` schema)

**Problem**: two type shapes for the same domain concept. `mapDocToQuestion()`
in `server-actions/the-crucible.ts` bridges them. Migration plan flagged
this as deferred Phase 4 polish. Deletion test: drop the legacy interface,
migrate importers, bridge simplifies.

**Solution**: pick canonical (the V2 schema shape), migrate ~15 importers,
delete the legacy file.

**Trigger**: whenever someone is about to add a new field to a Question and
has to choose which shape to add it to. Until then the bridge pays its own
tax.

**Surfaced by**: features depth audit.

---

## Already well-shaped — do not refactor

These are listed so future audits don't re-litigate them.

| Module | Why it's deep |
|---|---|
| `@canvas/data/rbac.ts` | Encapsulates role-state-machine + TTL+bounded cache. 5 functions hide ~250 lines. |
| `@canvas/core/r2-storage.ts` | Hides bucket config + validation + sanitization. (Three pre-existing bugs tracked separately: missing `'server-only'`, dead `r2Client` export, error.message leak — these don't change the depth assessment.) |
| `@canvas/core/redirect-validation.ts` | Shallow but earns it — 16 callers, prevents open-redirect across all of them. |
| `@canvas/persona/contract.ts` | Read-side classifiers. Single source for tier rules + mastery thresholds. Admin dashboards + AI pipelines can import without pulling the writers. |
| `@canvas/persona/scoring.ts` | Consolidates answer-correctness across 3+ call sites that previously diverged (server / TestView / BrowseView). |
| `apps/admin/features/admin/hooks/{useAdminFilterUrlSync, useAdminKeyNav, usePermissions}` | Correctly small adapters at legitimate seams (URL ↔ filter state, keyboard ↔ app state, HTTP ↔ permissions). Not shallow modules. |
| `@canvas/data/models/*` | 29 of 30 are intentionally thin data containers; `Question.v2` is the anchor for the question-bank schema and carries appropriate density. |
| `@canvas/services/index.ts` | Empty by design — package uses subpath imports per `package.json` `exports`. The barrel intentionally exports only `ServiceDeps`. |

---

## How to use this doc

- **New work**: before extracting a "service" or "helper," apply the
  deletion test. If the answer is "concentrates, doesn't multiply," you're
  splintering by file-size pressure — that's #8's pattern, don't add to it.
- **When tackling an item**: invoke `improve-codebase-architecture` skill and
  go through the grilling loop on that specific candidate. The skill expects
  you to walk the interface design tree with a human before writing code.
- **When deferring an item**: don't delete it from this list. Add a
  "Deferred: <date> because <reason>" note inline.
- **When completing an item**: move to a "Completed" section at the bottom
  with the commit hash. Don't delete — the rationale outlives the work.

## Cross-references

- [`_agents/MONOREPO_MIGRATION_PLAN.md`](./MONOREPO_MIGRATION_PLAN.md) — what shipped in Phases 0–6
- [`_agents/adr/`](./adr/) — architectural decisions (immutable)
- [`_agents/CRUCIBLE_ARCHITECTURE.md`](./CRUCIBLE_ARCHITECTURE.md) — domain invariants
- [`CLAUDE.md`](../CLAUDE.md) — security rules (§8), import direction (§7)
- [`.claude/skills/improve-codebase-architecture/`](../.claude/skills/improve-codebase-architecture/) — the skill that produced this list (vocabulary in `LANGUAGE.md`, dependency-category playbook in `DEEPENING.md`, interface-design questions in `INTERFACE-DESIGN.md`)
