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

_All four original load-bearing items (1–4) shipped on 2026-05-18 — see
[Completed](#completed) at the bottom of this doc. Add new load-bearing
items here as the next audits surface them._

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

## Completed

### 1. Reuse `deps.isAdmin` in flashcard services

**Completed:** 2026-05-18, in the same commit as #2 (`refactor(packages): deepening-backlog #1–4 — auth gate, filter builder, persona pure core`).

**What landed**
- `packages/services/flashcards.ts:POST` and `packages/services/flashcards-by-id.ts` (PATCH + DELETE): inline `process.env.ADMIN_EMAILS.split(',')…` parses replaced with `deps.isAdmin(user.email)` from the `ServiceDeps` interface.
- Two minor behaviour deltas worth recording: email comparison is now case-insensitive (matches the rest of the codebase via the canonical `isAdmin` helper); the `ADMIN_EMAILS` missing-config branch that returned a 500 collapsed to a 403 (less §8.5 disclosure surface, same lockout effect).
- The DI seam is now respected at every flashcard admin gate — a future Shape-B swap ([ADR-003](./adr/003-admin-auth-shape-a-first.md)) touches one function per app.

**Why this was worth doing soon (preserved rationale)**
`CLAUDE.md` §8.2 forbids re-defining `isAdmin` locally; three handlers were
in violation. The DI seam exists precisely so admin checks can be swapped
per app — inline env-var parsing breaks that. Locality + leverage + testability
all improved by eliminating the inline duplication.

---

### 2. Extract a `requireAdmin` helper inside `@canvas/services`

**Completed:** 2026-05-18, same commit as #1.

**What landed**
- New file `packages/services/auth.ts` exporting `requireAdmin(req, deps)` and `AdminGateResult` (discriminated union `{ ok: true; user: User \| null } \| { ok: false; response: NextResponse }`).
- Added `./auth` subpath to `packages/services/package.json` exports.
- Three flashcard mutating handlers (POST / PATCH / DELETE) reduced to 2 lines of gate ceremony each: `const gate = await requireAdmin(req, deps); if (!gate.ok) return gate.response;`. Net ~30 lines of duplicate ceremony deleted.
- Result shape carries `gate.user` even when callers don't use it today — future audit-log integration reads `gate.user?.email` without API churn.

**Why this was worth doing soon (preserved rationale)**
The "localhost bypass → require user → require admin email" preamble was
copy-pasted three times. The next admin-mutation service added to the
package would have copied it again. Centralising the gate turns three
shallow blocks into one deep one; future auth-shape changes touch the
helper, not every handler.

**Notes**
- Built on top of #1 (the helper uses `deps.isAdmin` rather than re-importing the inline logic).
- Helper exposed only via subpath import — `index.ts` barrel still exports only `ServiceDeps`. Matches the package's "subpath-first" convention.

---

### 3. Lift the URL-param filter builder out of `questions.ts:GET`

**Completed:** 2026-05-18, same commit as #1.

**What landed**
- New file `packages/services/questions-filters.ts` exporting pure helpers `parseQuestionParams`, `isSimpleChapterFetch`, `buildMongoFilter`, `buildProjection`, and the `PROJECTION_NO_SOLUTIONS` constant.
- Added `./questions-filters` subpath to `packages/services/package.json` exports.
- `questions.ts:GET` shrank: parse → resolve effective limit → fast-path A (batch by IDs) → fast-path B (cached chapter fetch) → slow path (RBAC + `buildMongoFilter` + `buildProjection` + query). The 130-line inline parsing block is gone; the `is_pyq` / `exam_level` / `examBoard` legacy-param bridge is now centralised inside `buildMongoFilter`.
- Edge case improvement: `?limit=abc` and other non-numeric inputs now resolve to the auth-aware default instead of propagating NaN to `.limit(NaN)`. Existing numeric paths (including `?limit=0`) preserved exactly.
- Symmetric use of `buildProjection({ excludeSolutions })` inside the cached `getCachedChapterQuestions` to keep the projection logic in one place.

**Why this was worth doing soon (preserved rationale)**
A 250-line GET handler bundled URL parsing, three query paths, and response
formatting. The parsing block was pure computation, only untestable because
it sat inside an HTTP handler. Extracting the pure functions opened the
test seam and — more concretely — turned the CLAUDE.md §4.5 Phase 4
legacy-param-bridge cleanup into a single-file delete instead of a
handler-spanning hunt.

---

### 4. Pull `applyAttemptToProgress` into a pure `(state, event) → state` function

**Completed:** 2026-05-18, same commit as #1.

**What landed**
- New file `packages/persona/user-progress-updater.ts` exporting `computeUserProgressUpdate(snapshot, attempt): UserProgressUpdate`, plus the supporting `UserProgressSnapshot` and `UserProgressUpdate` interfaces.
- Added `./user-progress-updater` subpath to `packages/persona/package.json` exports.
- `applyAttemptToProgress` in `writer.ts` shrank from 140 lines to a 35-line wrapper that: builds the snapshot, calls the pure function, then applies the change set via Mongoose's change-tracking surface (Map.set on `chapter_progress` / `concept_mastery`, direct array assignment for `recent_attempts` / `all_attempted_ids`, `Object.assign` on `stats`, primitive assignment for `updated_at`).
- Public function signature unchanged. CRUCIBLE_ARCHITECTURE.md §9 invariant #3 preserved: writer.ts remains the canonical mutation surface.
- The new file is genuinely isomorphic — no `'server-only'` marker, all model imports are `import type` (erased at compile). Tests, admin "what-if" simulators, and future AI replay pipelines can call it from any context.

**Why this was worth doing soon (preserved rationale)**
The densest single function in the persona pipeline (140 lines, mutating 7
sub-structures of a hydrated Mongoose doc in place) was the test seam at
the most important state transition in the codebase. The streak-math audit
#18 lived here precisely because there was no value-oriented seam to test
against. The pure function is now that seam.

**Invariant preserved**: writer remains the canonical mutation surface
([CRUCIBLE_ARCHITECTURE.md](./CRUCIBLE_ARCHITECTURE.md) §9 invariant #3).
No changes to the public function signature.

**Deferred follow-ups**
- Vitest specs for `computeUserProgressUpdate` (streak math, tier-gating, recent_attempts cap, exposure-only-on-MEDIUM, dedupe-on-existing-tag). Not blocking; the seam is now ready when test scaffolding lands.
- Optional `now: Date` parameter for full determinism. Trivial to add when tests are written.
- Trim `Object.assign(progress.stats, update.stats)` to only the actually-changed fields. Marginal save-payload win; current shape is correct.

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
