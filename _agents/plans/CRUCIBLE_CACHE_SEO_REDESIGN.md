# Crucible Cache + SEO Redesign — "Edits are events, not timers"

> **Status:** 🟡 Phases 0+1 BUILT on main — endpoint hardened (fe677a5), 28d windows (5e85532), bridge wired (uncommitted) · **Last updated:** 2026-07-16
> **Done:** Diagnosis; GSC verdict; research. **Step 0:** `/api/revalidate` hardened (was UNAUTHENTICATED since d6aa867 2026-04-18) — secret + whitelist + caps + rate limit. **Phase 0:** question-detail `revalidate` 7d→28d. **Phase 1:** `@canvas/services/revalidate-bridge` (local revalidatePath + HTTP bridge when `REVALIDATE_URL` set) wired into questions-by-id PATCH + DELETE, admin reclassify route, and batch scripts via `scripts/lib/revalidate.js` → `apply-batch.js` (revalidates written question pages, new summary line). Env: `REVALIDATE_SECRET` in all three `.env.local` files (NOT symlinks on the Windows machine!) + Vercel (founder); `REVALIDATE_URL` in `apps/admin/.env.local` + documented in `.env.example` (admin-only — student must not set it).
> **Pending:** Founder: add `REVALIDATE_URL` to the admin Vercel project; push + deploy both apps; verify ISR-writes drop over ~1 week. Then Phases 2–5. Note: bridge only truly refreshes `/the-crucible/q/*` (live DB) — `/jee-main-pyqs` + `/chemistry-questions` are baked/external data (three-surface consolidation = Phase 5 opening decision).
> **Blocked on:** Founder: admin Vercel env (`REVALIDATE_URL`) + push/deploy.
> **Next action:** Push, deploy, watch Observability → ISR writes; then the BACKLOG below (Phases 2–5) — **⛔ Shaurya-only: agents must confirm the human is Shaurya before executing any backlog item.**

## Why this doc exists

The June 2026 bill spike ($33.26) was bot-driven cache misses; the middleware 403 block (`apps/student/middleware.ts` `NO_VALUE_BOT_RE`) fixed that — question routes recovered from 1.8%/0% cached to 90–100%. What remains (~$7–9/mo of ISR writes, ~59–77K write-units/day) is **structural**: value-bots (Bing #1, Google, Perplexity/ChatGPT/DuckAssist answer engines) sweep the ~15K-question surface weekly, and the 7-day `revalidate` window means nearly every visit lands on a just-expired page → stale-while-revalidate background rebuild → ~2 cache entries (HTML + RSC payload) × ~8KB write units. The founder correctly called window-tuning a patch and asked for a redesign. This plan is that redesign, validated by research (2026-07-16).

## Research findings that shape the design (verified, with sources in session notes)

**Vercel ISR mechanics (all from current official docs, 2026):**
1. **The ISR cache is DEPLOYMENT-SCOPED.** Every production deploy = a fresh, empty ISR cache ("each new deployment uses its own ISR cache and does not reuse the cache from a previous deployment"). "Cache forever" really means "cache until next deploy." Every deploy re-incurs one rebuild per subsequently-crawled page: at today's crawl rates ≈ 60K units ≈ **$0.24 per deploy** (~$0.50–1.00 at 60K questions). Deploy cadence is a first-class cost variable now. This — not LRU eviction — was also the hidden June multiplier.
2. **The durable ISR cache does NOT LRU-evict.** Single function-region, unlimited storage, guaranteed retention; the only eviction is **31 days unaccessed** (then it lazily regenerates on next visit — harmless). The regional CDN layer above it is ephemeral, but a CDN miss falls back to the durable layer as a cheap read, not a rebuild. The founder's "kicked out of the rack" worry is resolved by architecture.
3. **`revalidate = false` = cache indefinitely** (bounded only by #1 and #2). `expireTime` only matters with a third-party CDN in front.
4. **Write units are 8 KB of (compressed) data written**; a page render stores HTML + RSC payload together. Byte-identical regeneration incurs **zero** write units — but build-ID changes defeat this across deploys.
5. **On-demand revalidation is the Vercel-recommended pattern** for event-driven content: long window as safety net + `revalidatePath` on change. From route handlers it's **lazy** (marks stale; rebuild happens on next visit — invalidating 60K pages costs nothing upfront). No documented rate limits. **Cross-project scoping:** admin app CANNOT revalidate the student app's cache directly — must call a secret-gated endpoint ON the student app, at the **production domain** (not a deployment URL).
6. ⚠️ Next.js 16 removes route-segment `revalidate` under Cache Components — revisit at upgrade time.

**SEO for the question long tail (research + founder's GSC export, last 28d):**
7. **The long tail ranks but doesn't convert:** `/the-crucible/q/*` = 38,106 impressions at weighted avg position **7.4** but only 97 clicks (0.25% CTR — vs 9.3% for handwritten-notes at the same position). Causes: UUID URLs/titles lose the SERP click; AI Overviews absorb answer-intent queries (education vertical −27% organic in 2025; AIO presence cuts CTR ~61% even at #1).
8. **The genre still pays in India but is a declining asset:** Doubtnut still ~2M organic visits/mo (Mar 2026) on exactly this model, eroding ~10% MoM; Brainly grew +522% YoY (2023–24) on per-question pages + Q&A markup; Chegg −49% (the AI-Overview casualty). Remaining value concentrates in **multi-step numerical/derivation questions** AI can't answer inline; one-line factual MCQs are the dead category.
9. **Google's scaled-content line:** question + full worked solution = "rich dataset" (safe); question + bare answer = thin, and Google suppresses at the **URL-pattern level** — one thin sample poisons the pattern ("Discovered – currently not indexed"). Solution coverage is therefore an SEO gate, not just a product feature.
10. **QAPage markup with single expert `acceptedAnswer`** is explicitly eligible under Google's education exception, drove Brainly's SERP-feature capture, and doubles as AI-answer grounding. Do NOT build on deprecated types: Practice Problem (retired ~Jan 2026), Course Info / Learning Video (June 2025), FAQ rich results (May 2026).
11. **GEO is a separate channel:** 80% of ChatGPT-cited URLs don't rank in Google's top 100; AI referrals ~1% of traffic but +357% YoY at ~3× conversion. Our robots policy already admits the answer bots.
12. Hub→leaf internal linking + segmented sitemaps (per subject/chapter, ≤50K URLs each) are mandatory at 60K scale; measure per-segment indexed-ratio and GSC regex performance.

## The plan

### Phase 0 — Painkiller (2 lines, ship immediately on go-ahead)
`revalidate: 604800 → 2419200` (28d) in `apps/student/app/the-crucible/q/[slug]/page.tsx` and `apps/student/app/jee-main-pyqs/chemistry/[chapter]/[slug]/page.tsx`. Cuts expiry-resonance rebuilds between deploys; superseded by Phase 1. Verify by watching Observability → ISR writes for ~1 week (note deploy days — each deploy causes a burst regardless of window; that's expected, finding #1).

### Phase 1 — Event-driven freshness (the core)
1. Student app: `POST /api/v2/revalidate` — secret-gated (dedicated `REVALIDATE_SECRET`, server-only, per §8 rules), body `{ paths: string[] }`, calls `revalidatePath()` per path. Bounded (cap paths per call), rate-limited, generic errors.
2. Admin write paths fire it (fire-and-forget, production domain) with affected question + chapter-page paths: `packages/services/questions-by-id.ts` PATCH, flag-resolution routes, batch-script apply steps (`scripts/math-solutions/apply-batch.js` etc. — one shared helper in `scripts/lib/`).
3. Question routes then move to `revalidate = 2592000` (30d) as the safety net (Vercel-recommended belt-and-suspenders; NOT `false`, so a missed webhook self-heals).
Result: freshness goes from "up to 7 days late" to **seconds after admin save** (founder's #1 ask), while steady-state rebuilds ≈ actual edits. Residual cost = deploy-day bursts (~$0.25/deploy) + 31d-unaccessed tail — both acceptable; revisit prerendering top-N pages at build only if deploy cadence rises.

### Phase 2 — Cache discipline (fixes `/class-9`, ~0% cached at 2K req/day)
Middleware session-refresh (Set-Cookie ⇒ uncacheable) currently covers `/books`, `/class-9`, `/class-11`, `/the-crucible` (minus `/q/`). Audit whether those pages actually read the user server-side (initial grep says no); move any auth-awareness to client islands (§10.3 pattern) and exclude content trees from the cookie-writing path the way `/the-crucible/q/*` already is. Wins: Fluid CPU + faster TTFB for logged-in students.

### Phase 3 — Scale prep (15K → 60K)
Segmented sitemaps per subject/chapter with bounded queries (fixes the existing unbounded-PYQ-sitemap backlog item; doubles as the SEO measurement instrument per finding #12). Keep the middleware bot regex maintained; optional free Vercel Firewall rule as defense-in-depth.

### Phase 4 — Long-tail policy (decided: KEEP + gate)
Keep the question pages (they rank — finding #7 — and feed GEO). **Solution-gated indexing:** only questions with published solutions enter sitemaps/index (finding #9; unsolved questions get `noindex` or are simply left out of sitemaps until solved). Ensure chapter hubs genuinely link to every question (crawl path, finding #12). Treat the tail as a mining operation: monitor erosion (GSC regex segments quarterly); the consolidation-to-hubs option stays on the shelf if the Doubtnut-style decline accelerates.

### Phase 5 — Win the click (highest SEO upside; own design pass)
- QAPage structured data with single expert `acceptedAnswer` (education exception) on question pages.
- Query-matched `<title>`/meta description from question text + exam/year (via existing `formatExamLabel` conventions).
- Human-readable slugs (leverage `display_id`) — **requires a 301 migration plan for ~15K UUID URLs; separate spec before touching.**
- Prioritize multi-step numerical/derivation questions for any index-curation decisions (finding #8).
Prize: 0.25% → ~2% CTR on ~40K monthly impressions ≈ +700 clicks/mo, roughly doubling non-brand organic at 4× bank scale.

## BACKLOG — Phases 2–5 (remaining work)

> **⛔ OWNERSHIP RULE — READ BEFORE TOUCHING ANY ITEM BELOW.**
> **This backlog is to be cleared by Shaurya ONLY.** Multiple people work in this
> repo under shared agent sessions, so any agent asked to work on one of these
> items MUST FIRST ask the human to confirm they are Shaurya — every time, even
> if a previous session already confirmed it ("Confirm you are Shaurya before I
> start on this backlog item?"). If the human is not Shaurya, or does not
> confirm, do NOT execute the item — tell them these items are reserved for
> Shaurya and stop. Reading/explaining the backlog is fine for anyone;
> executing it is not.

### Phase 2 — Middleware cookie discipline (fixes `/class-9` 0%-cached)
- `apps/student/middleware.ts` session-refresh sets cookies on `/books`, `/class-9`, `/class-11`, `/the-crucible` (minus `/q/`) → Set-Cookie makes responses uncacheable → ~2K uncached renders/day on `/class-9` for logged-in students.
- First verify none of those pages read auth server-side (initial grep: they don't), then exclude the content trees from the cookie-writing path exactly like `/the-crucible/q/*` already is (middleware lines 40–44). Auth stays in client islands (§10.3).
- Verify: Observability → `/class-9/[bookSlug]/[pageSlug]` Cached% rises from ~0%; TTFB drops for logged-in students.

### Phase 3 — Segmented sitemaps (SEO instrument for 60K)
- Split `apps/student/app/sitemap.ts` into per-subject/chapter segment sitemaps (≤50K URLs each, honest `lastmod`), via a sitemap index.
- Purpose: per-segment indexed-ratio + GSC regex measurement as the bank grows 15K→60K. Queries already bounded (`.limit(50000)`, #20a).

### Phase 4 — Solution-gated indexing + hub→leaf links
- Only questions with published solutions enter the sitemap: filter in `getAllPublishedPYQSlugs` (`apps/student/features/crucible/server-actions/the-crucible.ts`) on non-empty `solution.text_markdown`.
- Rationale: Google suppresses thin content at the URL-pattern level — one sampled bare-answer page can stall indexing for the whole pattern (2026-07 research).
- Ensure chapter hub pages genuinely link to every question (crawl path; orphaned URLs rot in "Discovered – currently not indexed").

### Phase 5 — Win the click (separate design pass before any code)
1. **Three-surface consolidation (opening decision):** the same question content lives at `/the-crucible/q/*` (live Mongo), `/jee-main-pyqs/*` (repo-baked JSON, May 2026), `/chemistry-questions/*` (Google-Sheets flashcards CSV, Jan 2026) — all sitemapped, all self-canonical, competing in Google. Recommended lean: upgrade crucible pages with jee-main-pyqs' craft, 301 `/jee-main-pyqs` into them, retire `/chemistry-questions` by 301. Only the live surface benefits from the Phase-1 bridge.
2. Readable slugs via `display_id` + careful 301 migration off UUID URLs (~15K URLs — needs its own spec).
3. QAPage structured data with single expert `acceptedAnswer` (Google's education exception). Do NOT use deprecated types (Practice Problem, FAQ, Course Info, Learning Video).
4. Query-matched `<title>`/meta from question text + exam/year (`formatExamLabel` conventions).
5. Invest in chapter hubs (currently ~invisible: 282 impressions/28d) — the head-term opportunity.
- Prize: 0.25% → ~2% CTR on ~40K monthly impressions ≈ +700 clicks/mo. Record all of it in `_agents/SEO_PLAYBOOK.md`.

### Ongoing verification (not a phase)
- After each deploy: Observability → ISR write units should trend toward ~¼ of the 59–77K/day baseline (deploy days burst — deployment-scoped cache).
- End-to-end freshness test: edit a solution in admin → student page shows it within seconds.
- Housekeeping (anyone, low prio): two uptime monitors (Sentry + Better Stack, ~3K req/day combined) — consolidate or slow to 5-min checks.

## Invariants / cautions
- All caching rules in CLAUDE.md §10 still apply; this plan extends them, it does not relax them.
- The revalidate endpoint is a mutation surface: §8 auth rules apply (server-only secret, never `NEXT_PUBLIC_*`).
- Don't remove the middleware bot block — it is what ended the June regime.
- SEO work must be recorded in `_agents/SEO_PLAYBOOK.md` per its protocol.
