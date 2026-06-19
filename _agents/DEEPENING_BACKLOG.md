# Architecture Deepening Backlog

Last updated: 2026-06-15 (added the "Vercel cost / caching" section — items #16–22, label `vercel-cost` — from a Vercel cost audit).

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

**Partially addressed (2026-06-08) — re-scoped to the auth gate only.** When the
7th dashboard (`junior-bank`) triggered this item, a read of all seven dashboards
found the only genuinely-uniform duplication was the server auth gate, not the
header/loading/empty chrome (those are functionally divergent — subject tabs,
view-mode toggle, page-title input, tab nav, stats grids — and unifying them
would change rendered output). So **Option B** shipped: a gate-only
`apps/admin/features/admin/components/AdminPanel.tsx` server component that
collapses the `requireSuperAdmin/requireAdmin → redirect → render` preamble
across the six server pages (flashcards, blog, books, taxonomy, career-explorer,
junior-bank). The full `<AdminPanel title columns actions/>` chrome shell sketched
below was **deliberately declined** as premature — the per-dashboard chromes are
not stable enough to merge without behavior change. Rationale + the three options
considered: `_agents/decisions/2026-06-08-adminpanel-consolidation-memo.md`.
The remaining chrome-consolidation idea below stays open for if/when the headers
converge.

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

### 10. `requireSuperAdmin(req, deps)` helper to mirror the shipped `requireAdmin`

**Files**:
- `packages/services/assets-upload.ts:24,101` — direct `isSuperAdmin(authedEmail)` after a hand-rolled bypass+auth preamble
- `packages/services/assets-by-id.ts:19,38` — same shape
- `packages/services/export-ppt.ts:8,78` — same shape
- Counter-examples (correct pattern): `packages/services/flashcards.ts:116`, `flashcards-by-id.ts:65,136` use `requireAdmin(req, deps)` from `auth.ts`

**Problem**: backlog #2 (shipped 2026-05-18) introduced `requireAdmin(req, deps)`
in `packages/services/auth.ts` to collapse the "localhost bypass → authed user
→ admin-email check" preamble. Three handlers that need the *stricter*
super-admin tier never adopted that pattern — they import `isSuperAdmin`
directly from `@canvas/data/rbac` and re-implement their own preamble around
it. The service README explicitly says "New admin-mutation handlers in this
package MUST use this instead of re-implementing the gate inline" — these
three violate that contract. **Deletion test**: if the three inline
preambles vanish, the gate ceremony reappears in three places. A central
`requireSuperAdmin` helper concentrates it.

**Solution shape**: a sibling to the shipped `requireAdmin` that delegates
super-admin detection through `deps` (so the ADR-003 Shape-B swap stays
per-app). Same discriminated union return as `requireAdmin`. Requires adding
`isSuperAdmin` to the `ServiceDeps` surface OR keeping the env-var read in
`@canvas/data/rbac` and importing it inside `auth.ts` only.

**Trigger**: now-ish, or whenever the next handler needs a super-admin gate
(would otherwise copy the inline shape). Not security-blocking — the check
itself runs correctly in all three places today; this is pattern drift.

**Surfaced by**: 2026-06-01 packages depth audit. No security gap;
contract-violation of the service README.

---

### 11. Pure persona-write helper for the three user-progress routes

**Files**:
- `apps/student/app/api/v2/user/progress/route.ts:168–200`
- `apps/student/app/api/v2/user/session-response/route.ts:79–80`
- `apps/student/app/api/v2/user/chapter-profile/route.ts`

**Problem**: three handlers each implement an optimistic-concurrency retry
loop around a `UserProgress` write **plus** a "mirror" write to
`StudentChapterProfile` via `updateProfileFromAttempt`. The retry / concurrency
/ tier-gating ceremony is copy-pasted with subtle field-name drift
(`microConcept` vs `concept_tags`). **Deletion test**: drop the duplicate
retry blocks and they reappear in three places — the ceremony multiplies.

Sits next to shipped #4 (`computeUserProgressUpdate` pure core). #4 made the
in-memory state transition testable; this candidate addresses the
surrounding orchestration (concurrency + secondary write) that the pure core
doesn't cover.

**Solution shape**: a `performPersonaUpdate(userId, chapterId, attempt, deps)`
adapter inside `@canvas/persona` that owns concurrency + retry + the dual
write. Each route handler becomes "primary write → call helper → respond."
Lives between today's `writer.ts` (mutation surface) and the three HTTP
handlers. Preserves [CRUCIBLE_ARCHITECTURE.md](./CRUCIBLE_ARCHITECTURE.md)
§9 invariant #3 (writer.ts remains the canonical mutation surface).

**Trigger**: when the next persona-write surface is added (flashcard practice
or mock-test result writes are the obvious candidates) — that would be a 4th
copy of the ceremony. Until then the duplication is bounded at three.

**Surfaced by**: 2026-06-01 student-app depth audit.

---

### 12. Pure `derivePermissions` helpers alongside `usePermissions`

**Files**:
- `apps/admin/features/admin/hooks/usePermissions.ts` (the hook)
- `apps/admin/app/crucible/page.tsx:573–579` (only consumer today)

**Problem**: the Crucible editor derives two UI-RBAC booleans inline:
`canEditCurrent = canEdit(selectedQuestion.metadata.chapter_id)` and
`canEditAny = isSuperAdmin || grants.some(g => g.level === 'edit')`. Pure
functions of the RBAC contract data, but currently inlined in a 1,643-line
god-file. **Deletion test**: one consumer today, so deleting the (not-yet-
extracted) helpers concentrates nothing — this is one-adapter / hypothetical
seam by the backlog's own rule.

Worth tracking because the trigger is concrete: today's UI-RBAC gating
landed only in Crucible. Extending it to Staff Access, Flags Dashboard, the
planned Books editor, or Mock Tests admin will each re-derive the same two
booleans.

**Solution shape**: promote `canEditCurrent(grants, isSuperAdmin, chapterId)`
and `canEditAny(grants, isSuperAdmin)` to named exports of `usePermissions.ts`
(or a sibling pure file). The hook's data path stays unchanged; the new
helpers take `{ grants, isSuperAdmin }` and return booleans. Crucible page
imports and uses them; future dashboards do the same.

**Trigger**: when the second dashboard (likely Books editor or Staff Access)
adds the same fieldset-disabled UI-RBAC pattern. Until then this is
single-call-site; inline it stays.

**Surfaced by**: 2026-06-01 admin-app depth audit. Acknowledged as
"one-adapter = hypothetical seam" — listed so the second-consumer trigger
isn't forgotten.

---

### 13. Rotate `ADMIN_SECRET` + scrub the leaked literal from a workflow doc

**Files**:
- `_agents/workflows/MOCK_TEST_INGESTION_WORKFLOW.md` lines 15, 44, 53 — the literal string `‹leaked-admin-secret-redacted-2026-06-19›` appears 3× as the value of the `x-admin-secret` header
- Committed 2026-04-04 in `fb0698a` (feat: period trends chart, mock tests, flags, cleanup)

**Problem**: the format and naming convention of `‹leaked-admin-secret-redacted-2026-06-19›` strongly suggest this was the real production `ADMIN_SECRET` at the time of writing, not a placeholder. Per CLAUDE.md §8.2.1, the `x-admin-secret` header IS the script-secret bypass that lets backend scripts mutate admin-only routes without a Supabase session — anyone with read access to the git history can replay this value if it's still the live secret. The string has been on public GitHub for ~2 months.

**✅ In-repo scrub DONE 2026-06-19** — the literal is removed from `MOCK_TEST_INGESTION_WORKFLOW.md` (now `$ADMIN_SECRET`) and redacted here. **⏳ ROTATION still pending (founder-only):** the authoritative mitigation is rotating `ADMIN_SECRET` in Vercel — scrubbing the working tree does NOT remove it from git history.

**Solution shape** (two-part, with the harder part outside the codebase):
1. **Operationally (only you can do this):** verify whether `process.env.ADMIN_SECRET` in Vercel production + preview still equals `‹leaked-admin-secret-redacted-2026-06-19›`. If yes → rotate immediately. Don't bother rewriting git history; rotation is the only effective mitigation after public exposure.
2. **In-repo:** replace the three literal occurrences in the workflow doc with a placeholder (`<your-admin-secret>` or `$ADMIN_SECRET`). One-line edit each.

**Trigger**: today. The doc edit is mechanical; the rotation is the actual mitigation and only you can authorise it.

**Surfaced by**: 2026-06-02 credential-leakage audit.

---

### 14. Remove `NEXT_PUBLIC_ADMIN_SECRET` from `.env.example` + CLAUDE.md (landmine for future agents)

**Files**:
- `.env.example:36` — `NEXT_PUBLIC_ADMIN_SECRET=same_string_as_above_for_client_side_admin_calls`
- `CLAUDE.md:298` — lists `NEXT_PUBLIC_ADMIN_SECRET` in the shared env vars table

**Problem**: this variable is documented in two prominent places but **zero code reads it today** (grep across `apps/`, `packages/`, `scripts/` returns nothing). So it's not actively leaking — Next.js only inlines `NEXT_PUBLIC_*` env vars that source code references. **But** the moment any future agent adds `process.env.NEXT_PUBLIC_ADMIN_SECRET` somewhere (because the docs told them to use it for "client-side admin calls"), Next.js will inline the value into every client JS bundle and the script-secret bypass becomes browser-visible. Every visitor can then send `x-admin-secret` to bypass admin auth — that's a Critical auth bypass that turns on overnight, silently.

**Solution shape**: pure documentation hygiene.
- Delete the `NEXT_PUBLIC_ADMIN_SECRET` line from `.env.example`
- Remove it from CLAUDE.md §5.1's shared env vars table
- Add a one-line security note: client-side admin operations MUST use the Supabase session, never a bundled secret

**Trigger**: today. Cost is one PR; benefit is closing a footgun that's only one curious agent away from going live.

**Surfaced by**: 2026-06-02 credential-leakage audit. Related to #6 (field-whitelist hardening) as another §8.7-flavored hardening item.

---

### 15. Stop echoing raw `error.message` from `chemical-bonding-batch` route (§8.5)

**Files**:
- `apps/student/app/api/v2/questions/chemical-bonding-batch/route.ts:80-86`

**Problem**: the catch block does
```ts
const errorMessage = error instanceof Error ? error.message : String(error);
return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
```
which violates CLAUDE.md §8.5 ("Error Responses Must Not Leak Internals"). Mongoose / driver errors routinely embed schema field names, query shapes, connection-state hints, and occasionally credential fragments — anything from "duplicate key error: { user_secret: '...' }" upwards. Every other handler in `apps/student/app/api/v2/*` follows §8.5 (generic client message, full error in `console.error`); this one is the lone outlier.

**Solution shape**: replace the response payload with a generic message, keep the `console.error` line:
```ts
console.error('Error fetching Chemical Bonding questions:', error);
return NextResponse.json({ success: false, error: 'Failed to fetch questions' }, { status: 500 });
```

**Trigger**: today. One-line code fix; the audit log already exists. Aligns this handler with the §8.5 convention used everywhere else.

**Surfaced by**: 2026-06-02 credential-leakage audit.

---

## Vercel cost / caching (2026-06 cost audit)

**Label:** `vercel-cost`. These came out of a 6-agent cost fan-out on 2026-06-15
after the founder flagged ongoing ISR-write + Fluid-compute spend. Daily cost mix
was ≈ ISR Writes 42% · Fast Origin Transfer 21% · Fluid CPU 14% · Fluid Memory
10% · Web Analytics Events 7% · Function Invocations 4% — so compute + transfer
combined exceeds the ISR-writes line; chasing ISR writes alone misses half the
cost. The rules these all serve live in [`CLAUDE.md`](../CLAUDE.md) §10. Unlike the
architecture items above, these are **perf/cost**, not deepening — kept here so
there's one backlog, grouped under the `vercel-cost` label.

**Already fixed (2026-06-15, pending the founder's commit):**
- `/the-crucible` landing made cacheable — auth moved to a new `CrucibleLandingClient.tsx`; removed the page-level `cookies()`/`getUser()` read that silently overrode `revalidate = 3600`. (The `4e9f188` client-island sweep fixed the `[chapterId]` sub-page but **missed this index page** — a quiet `cookies()`-defeats-`revalidate` leak.)
- OG image `revalidate` 60 → 86400 — `apps/student/app/class-9/[bookSlug]/[pageSlug]/opengraph-image.tsx`.

**✅ Fixed 2026-06-19 (this session):** **#16** blog `generateStaticParams → []`; **#17** removed `revalidatePath('/','layout')` (login/signup/consent); **#19** dropped `<Analytics/>`+`<SpeedInsights/>` from the layout (deps/CSP left in place — harmless when unused, avoids lockfile churn); **#20** sitemap `.limit(50000)` + React `cache()` dedup on the question-detail double-fetch; **#21** middleware skips the Supabase session refresh when the request has no auth cookie (anon/bot); **#22** blog cron `*/15`→`0 * * * *` (hourly). **#18 partial:** dropped the flag-resolve bank-wide bust (flags aren't public); the PATCH/POST/DELETE (`questions-by-id.ts`) + create (`questions.ts`) + reclassify `revalidateTag('questions')` calls are **DEFERRED** — making them per-chapter needs a *coordinated read-side change* (the reads use **static** `tags:['questions']` in `unstable_cache`, which can't be made per-chapter without a per-chapter cache-factory; a naïve write-side-only change would break invalidation → permanently-stale pages). **The cost-sentinel watchdog (`scripts/watchdogs/cost-sentinel.js`) now flags all of these patterns** — whole-site busts, bank-wide `revalidateTag('questions')`, and `@vercel/analytics` imports — so they can't silently regress; it currently lists the 4 deferred #18 calls as 🟡.

**#1 cause is behavioral, not a ticket:** every production deploy cold-starts the
ISR cache (prebuilt pages re-write at build; lazy pages regenerate on first
post-deploy hit). 5+ deploys/day multiplies ISR writes. **Mitigation: batch
commits into fewer deploys.** Process note — no code item.

### 16. [vercel-cost] `blog/[slug]` pre-renders up to 500 pages every build

**Files**: `apps/student/app/blog/[slug]/page.tsx` (`generateStaticParams`) → `apps/student/features/blog/lib/blogDb.ts` (`getPublishedSlugs`, `.limit(500)`).

**Problem**: up to 500 Mongo-backed slugs are pre-rendered at every build, so each deploy writes up to ~500 ISR entries — multiplied by deploy frequency (≈2,500 writes/day at 5 deploys). Highest-impact remaining ISR-writes code item.

**Solution shape**: `generateStaticParams → return []` (lazy on-demand ISR) — the pattern already used on the question/PYQ leaf pages. Blog posts are crawled, not hot; first-request generation + ISR is the right trade.

**Trigger**: now — low-risk, high-leverage.

**Surfaced by**: 2026-06-15 cost audit (build-time pre-render agent).

---

### 17. [vercel-cost] `revalidatePath('/', 'layout')` busts the whole site on every login/signup

**Files**: `apps/student/features/auth/server-actions.ts` (login + signup), `apps/student/features/legal/lib/acceptConsent.ts`.

**Problem**: a root-layout cascade marks the **entire** site's cache stale on a continuous trigger (every login/signup/consent); the next crawl regenerates everything. Auth is already a client island (`AuthButton`), so nothing in the cached server render depends on the session — almost certainly dead weight.

**Solution shape**: remove the three `revalidatePath('/', 'layout')` calls (verify-then-delete; per §10.3 no cached server render should read session state).

**Trigger**: now.

**Surfaced by**: 2026-06-15 cost audit (revalidation-callers agent).

---

### 18. [vercel-cost] Bank-wide `revalidateTag('questions')` fired from 5 admin write paths

**Files**: `packages/services/questions-by-id.ts` (PATCH + DELETE), `packages/services/questions.ts` (POST/create), `apps/admin/app/api/v2/questions/[id]/reclassify/route.ts`, `apps/admin/app/api/v2/questions/[id]/flag/[flagIdx]/route.ts`.

**Problem**: the `'questions'` tag covers the **entire** cached bank, so one edit invalidates every chapter. Solution-writing / flag-triage batches → dozens of whole-bank busts → mass regeneration on next crawl. The flag-resolve call likely needn't touch the public cache at all.

**Solution shape**: per-chapter tags `questions:${chapterId}` — the model already exists in `questions-by-id.ts` (the `notes-quicktest:${chapterId}` path). Reclassify busts old + new chapter; flag-resolve probably drops the tag entirely.

**Trigger**: when next touching question write paths, or if admin-batch regeneration shows up in monitoring.

**Surfaced by**: 2026-06-15 cost audit (revalidation-callers agent).

---

### 19. [vercel-cost] ~~Drop redundant `@vercel/analytics` + `@vercel/speed-insights`~~ — DECIDED: KEEP (2026-06-20)

**DECISION (2026-06-20, founder): KEEP both.** Do NOT remove `<Analytics />` / `<SpeedInsights />`
from `apps/student/app/layout.tsx`, and do NOT uninstall the deps. The founder uses the Vercel
dashboards; the ~$0.52/cycle "Web Analytics Events" line is an accepted cost. A load-bearing guard
comment sits next to the components in `layout.tsx`. **This item is CLOSED — do not re-suggest removal.**

History: surfaced by the 2026-06-15 cost audit as redundant with GA / Cloudflare / Clarity /
Mixpanel. It was then removed twice (once in this session, once by a parallel-machine "multi-thread
catch-all" commit `5c46d91`) before the keep decision — a cross-machine ping-pong on the same file.
Analytics was never the cost driver (~7% of a small cycle); the real ISR-write fixes are #16–#18,
#20–#22 plus the Vercel Firewall block on `meta-webindexer`.

---

### 20. [vercel-cost] Unbounded sitemap PYQ load + double full-doc fetch on question detail

**Files**: `apps/student/features/crucible/server-actions/the-crucible.ts` (the PYQ-slug load called from `sitemap.ts`; `getQuestionBySlug`), `apps/student/app/the-crucible/q/[slug]/page.tsx` (generateMetadata + Page).

**Problem**: (a) the sitemap loads ALL ~4,750 published PYQs with **no `.limit()`** on every regen and every `/sitemap.xml` crawl → Fluid CPU + Memory; (b) the question-detail page fetches the full question doc **twice** per render (large `solution`/`question_text`) → Memory + Origin Transfer.

**Solution shape**: (a) add `.limit(50000)`; long-term split into a paginated sitemap index. (b) wrap `getQuestionBySlug` in React `cache()` so generateMetadata + Page share one read.

**Trigger**: (a) before the bank grows much past current size; (b) now — small change, halves reads on the highest-cardinality route.

**Surfaced by**: 2026-06-15 cost audit (heavy-query agent).

---

### 21. [vercel-cost] Middleware does a per-request Supabase `getUser()` on the hottest trees

**Files**: `apps/student/middleware.ts`.

**Problem**: the gated branch refreshes the Supabase session on every `/the-crucible/*` and `/books|/class-9|/class-11` request — including anonymous/bot traffic that discards the cookie — adding an Edge invocation + Supabase round-trip on the highest-traffic content trees.

**Solution shape**: short-circuit `NextResponse.next()` when the request carries no Supabase auth cookie, so anon/bot crawls skip the session refresh.

**Trigger**: when revisiting middleware, or if Edge invocation cost on these trees stands out.

**Surfaced by**: 2026-06-15 cost audit (middleware agent).

---

### 22. [vercel-cost] Blog-publish cron runs every 15 min

**Files**: `apps/student/vercel.json` (`/api/blog/cron/publish`, `*/15 * * * *`).

**Problem**: 96 runs/day, almost always a no-op (one capped query, usually zero rows). Highest-frequency cron in the repo; pure Function-Invocation waste.

**Solution shape**: drop to hourly (`0 * * * *`) — a scheduled post going live up to an hour late is fine. Query is already `.limit(50)`-bounded.

**Trigger**: now — one-line schedule change.

**Surfaced by**: 2026-06-15 cost audit (cron agent).

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
