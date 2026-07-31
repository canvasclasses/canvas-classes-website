# SEO Dashboard — plan

Owner: Canvas. Started 2026-05-25. Status: PRs 1–4 shipped; **⚠️ PIPELINE DOWN since 2026-05-26 — see "2026-07-20 OUTAGE" section below before touching anything.**

## 2026-07-20 OUTAGE — pipeline dead, dashboard blank (diagnosed, NOT yet fixed)

**Symptom:** admin `/seo` pages render empty. Newest `gsc_metrics_daily` row is
**2026-05-26**; the UI's 7/28-day windows are entirely past the last data point.

**Root cause:** every sync run since ~Jun 1 fails with **`invalid_grant`** — the
OAuth refresh token is dead. The Decisions table below claims Testing-mode
refresh tokens "don't expire"; **that is WRONG**: Google expires refresh tokens
after **7 days while the OAuth consent screen is in Testing status** (regardless
of test-user membership). Token minted ~May 25 → died ~Jun 1. Publishing the
app to Production is what makes refresh tokens long-lived.

**Secondary findings (from `gsc_sync_runs`):**
- A 2026-05-29 run failed CrUX with `API key not valid` — `CRUX_API_KEY` needs
  verifying/re-issuing too.
- No cron-triggered run has logged since 2026-05-25 — after fixing auth, confirm
  the Vercel cron on the admin project is actually firing (check `CRON_SECRET`
  env + cron logs), don't assume.

**Fix runbook (founder — needs the Google account, ~15 min):**
1. ✅ DONE 2026-07-20: OAuth app published Testing → In production. Also done:
   OAuth client ID + (rotated) secret added to the Windows machine's root
   `.env.local` (this machine never had them — env files aren't synced across
   machines). ⚠️ The client secret was ROTATED (old one was view-once-hidden) —
   the old secret in the Mac's `.env.local` and in Vercel admin env is now
   INVALID; update both when doing step 2.
2. **← RESUME HERE.** Run `npx tsx scripts/seo/get-refresh-token.ts`, complete
   the browser sign-in with the GSC-owner Google account (blocked 2026-07-20:
   founder didn't have the account's 2FA/code access at hand — script got as
   far as "waiting for callback", so creds are confirmed working). Paste the new
   `GOOGLE_OAUTH_REFRESH_TOKEN` into root `.env.local` **and** update Vercel
   admin project env (Production + Preview) with BOTH the new refresh token AND
   the rotated `GOOGLE_OAUTH_CLIENT_SECRET`.
3. Verify `CRUX_API_KEY` (manual sync: `POST /api/v2/seo/sync` with
   `x-admin-secret`) — re-issue the key if still invalid.
4. Backfill the gap: `npx tsx scripts/seo/backfill-gsc.ts` — resumable, skips
   existing dates, so it fills May 27 → today only.
5. Redeploy admin so the cron picks up new env; next morning confirm a `cron`
   -triggered row in `/seo/sync` and the Freshness pill is green.

## Goal

A single admin-app surface at `admin.canvasclasses.in/seo` showing GSC search
performance + CrUX Core Web Vitals trends for `canvasclasses.in`. Data is
fetched on a daily cron into MongoDB; the dashboard reads from Mongo, never
from the live Google APIs.

Motivating incident: Google Search Console flagged a 283ms INP issue on
`/handwritten-notes` (May 2026). We want this kind of regression visible
on the operator dashboard the day it happens — not in a Google email weeks
later.

## Decisions

| Decision | Value | Why |
|---|---|---|
| Where | `apps/admin/` (operator tool) | Already auth-gated; admin landing has a card grid; matches Phase 5 split |
| Auth | OAuth2 installed-app + long-lived refresh token | Service-account email was silently rejected by GSC's "Add user" dialog (a documented quirk for some personal Google accounts). ~~OAuth refresh tokens issued to a Testing-mode app for a test user don't expire~~ **WRONG — Testing-mode refresh tokens expire after 7 days; this killed the pipeline on ~Jun 1 (see 2026-07-20 OUTAGE above). App must be published to Production for long-lived tokens.** |
| Data depth | Daily totals + top 1000 queries + top 1000 pages + device + country | Covers 99% of the views; ~10k Mongo docs/month |
| CWV source | Chrome UX Report API | Field data, free, would have caught the 283ms INP weeks earlier |
| Site scope | `canvasclasses.in` only | Single property; simpler config |
| Chart lib | Recharts (already in stack) | No new dep |

## Architecture

```
Vercel cron (01:00 UTC daily)  ─→  POST /api/v2/seo/sync (admin app, x-admin-secret)
                                        │
                                        ├─ @canvas/seo/sync-gsc  → GSC API → upsert gsc_metrics_daily
                                        └─ @canvas/seo/sync-crux → CrUX API → upsert crux_metrics_daily
                                        └─ writes GscSyncRun (observability)

UI (RSC) ─→ server actions in apps/admin/features/seo/
        ─→ Mongo (gsc_metrics_daily, crux_metrics_daily)
        ─→ Recharts
```

## Data model

| Collection | Key | Notes |
|---|---|---|
| `gsc_metrics_daily` | `(date, dimension, key)` unique | dimension ∈ {total, query, page, device, country}; `total` rows have key=`'TOTAL'` |
| `crux_metrics_daily` | `(date, urlPattern, formFactor)` unique | LCP/INP/CLS p75 + "good" % per URL group |
| `gsc_sync_runs` | `startedAt` desc | One doc per sync run (cron or manual); powers the sync-log page |

## Env vars (root `.env.local`)

```
GOOGLE_OAUTH_CLIENT_ID=<…>.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-…
GOOGLE_OAUTH_REFRESH_TOKEN=1//…
GSC_SITE_URL=sc-domain:canvasclasses.in   # or https://www.canvasclasses.in/ for URL-prefix property
CRUX_API_KEY=AIza...
BRIEFING_SECRET=<64-char hex>             # scoped secret for the remote-routine x-briefing-secret header (PR 4)
SEO_SLACK_WEBHOOK=                        # OPTIONAL — if set, attachSynthesis posts the briefing to Slack
```

See Phase 0 below for how to obtain these.

## Phase 0 — Google Cloud setup (you, ~15 min, one-time)

1. **Cloud project**: console.cloud.google.com → New Project `canvas-seo-dashboard`.
2. **Enable APIs** (APIs & Services → Library): `Google Search Console API`, `Chrome UX Report API`.
3. **OAuth consent screen** (Google Auth Platform → Branding/Audience/Data Access):
   - Branding: App name "Canvas SEO Dashboard", your email as support + developer contact.
   - Audience: User type = External, publishing status = Testing, add your Google account as a Test user.
   - Data Access: add scope `.../auth/webmasters.readonly`.
4. **OAuth client** (Google Auth Platform → Clients): Create client → **Desktop app** → name "Canvas SEO CLI". Copy client ID + client secret.
5. **CrUX API key**: APIs & Services → Credentials → Create credentials → API key. (Optionally restrict to Chrome UX Report API.)
6. **Env vars (partial)**: in root `.env.local`, set `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GSC_SITE_URL`, `CRUX_API_KEY`.
7. **Run** `npx tsx scripts/seo/get-refresh-token.ts` — opens a consent URL in your browser, you sign in with the GSC-owner account, script prints `GOOGLE_OAUTH_REFRESH_TOKEN=…`. Paste it into `.env.local`.

> **Why not a service account?** We tried it first. Google Search Console's "Add user" dialog rejects service-account emails for some personal Google accounts (documented quirk; not user error). The OAuth installed-app flow works universally because the consent happens under a real user account that already owns the property.

## PR breakdown

### PR 1 — Sync foundation ✅ (this commit)

- `@canvas/seo` package with `gsc-client`, `crux-client`, `sync-gsc`, `sync-crux`, `url-groups`, `config`.
- Mongoose models: `GscMetricsDaily`, `CruxMetricsDaily`, `GscSyncRun`.
- Admin route: `POST /api/v2/seo/sync` (idempotent, gated by `requireAdmin`) + `GET` for recent runs.
- `googleapis` dep on admin app, `@canvas/seo` wired in.

**Smoke test (after Phase 0 done):**
```bash
curl -X POST http://localhost:3001/api/v2/seo/sync \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "content-type: application/json" \
  -d '{}'
```
Expect `{ success: true, status: 'ok', rowCounts: { total: 1, query: ~700, page: ~400, device: 2, country: ~50 }, cruxFetched: ~16 }`.

### PR 2 — Backfill + cron + sync log ✅

- **bulkWrite refactor** in `packages/seo/sync-gsc.ts` — replaced 1000 sequential `updateOne` calls with a single `bulkWrite` per (date, dimension). One day's sync dropped from ~95 s to ~9 s, which made the 480-day backfill viable.
- **Shared orchestrator** at `packages/seo/run-sync.ts` — owns the `GscSyncRun` bookkeeping so the admin `POST /api/v2/seo/sync` and the cron route stay thin wrappers around the same code. Avoids the duplication the original PR 1 route was carrying.
- **Cron route** at `apps/admin/app/api/cron/seo-sync/route.ts` — `GET`, verifies `Authorization: Bearer ${CRON_SECRET}` (Vercel attaches this automatically when the env var is set), falls through to `hasScriptSecret` and the localhost dev bypass for testing. Mirrors the `apps/student/app/api/blog/cron/publish/route.ts` pattern.
- **Cron schedule** in `apps/admin/vercel.json` — `0 2 * * *` (02:00 UTC / 07:30 IST). Late enough that any failure is noticed within the workday; early enough that fresh data is in the dashboard when the team opens it.
- **Backfill script** `scripts/seo/backfill-gsc.ts` — loops D-3 backwards N days (default 480). Resumable: skips dates that already have a `gsc_metrics_daily` row unless `--force`. 1 s sleep between days keeps us at ~60 QPM, well under GSC's 100 QPM per-user cap. Full 480-day run takes ~80 min.
- **Sync log UI** at `apps/admin/app/seo/sync/page.tsx` — server component lists the last 30 runs with status + trigger + GSC/CrUX row counts + duration. Header shows a Freshness pill (green ≤25 h, amber ≤48 h, red beyond). "Sync now" client island fires a manual run + `router.refresh()`s the table.

**Production prerequisite (must do before merging):**
1. Add five env vars to **Vercel project settings → admin → Production + Preview**:
   `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `GSC_SITE_URL`, `CRUX_API_KEY`.
2. Add `CRON_SECRET` to the same project (Vercel will surface a "Generate" button — let it generate a random string). The cron infrastructure auto-attaches it; no code change needed beyond the route already reading it.
3. After first deploy, run the backfill locally: `npx tsx scripts/seo/backfill-gsc.ts`. It writes to the same Mongo cluster as production, so the dashboard renders trend data from day one.
4. Share env vars with partner via secure channel (1Password vault recommended).

### PR 3 — Dashboard UI ✅

- **CrUX history backfill** — `crux-client.queryCruxHistory()` (uses Google's `records:queryHistoryRecord`) returns up to ~25 weekly snapshots per `(URL × form factor)` in a single call. `scripts/seo/backfill-crux.ts` calls it once per tracked URL × `{PHONE, ALL_FORM_FACTORS}` and bulk-upserts each weekly point keyed by `periodEnd`. Seeded 375 weekly snapshots in <30 s, giving the web-vitals page 6 months of trend on first render.
- **Shared aggregations** at `packages/seo/queries.ts` — every Mongo read for the dashboard lives here. `getDailyTotals`, `getWindowComparison`, `getTopQueries/Pages`, `getCwvSeries`, `getLatestCwvSnapshots`, `getLatestDataDate`. Pure data-access; no I/O outside Mongo. Window-vs-prior-window math is computed once with absolute + percentage deltas so the UI just renders.
- **Sub-nav layout** at `apps/admin/app/seo/layout.tsx` + `SeoSubnav` (client component for active-tab highlighting). All five `/seo/*` pages live under it so the back-link + breadcrumb + sub-nav code lives in one place.
- **Format helpers** at `apps/admin/features/admin/seo/format.ts` — `formatNumber/Ctr/Position/Ms/Cls`, `shortenUrl/Query`, plus `cwvVerdict()` + `CWV_THRESHOLDS` + `VERDICT_CLASSES` (good/ni/poor thresholds for LCP, INP, CLS — single source of truth). Used by the snapshot table cells and the chart threshold reference lines so they can't disagree.
- **UI primitives** at `apps/admin/features/admin/seo/components.tsx` — `KpiCard`, `DeltaPill` (green/red with TrendingUp/Down, `invert` flag for "lower is better" metrics like position), `EmptyState`, `DataAsOf` (green ≤3d, amber ≤5d, red beyond).
- **Charts** at `apps/admin/features/admin/seo/charts.tsx` — recharts wrappers: `ClicksSparkline`, `DailyTotalsChart` (dual-axis clicks + impressions), `CwvChart` (one per metric, with `ReferenceLine`s at good + poor thresholds). Client components — recharts uses refs to measure the DOM.
- **The four pages:**
  - `/seo` — 4 KPI cards (clicks, impressions, CTR, position) for last 7d vs prior 7d, then a 30-day daily-totals chart.
  - `/seo/queries` — top 100 queries by clicks over last 28d, with click-out to GSC's filter UI for each.
  - `/seo/pages` — top 100 pages by clicks over last 28d, with click-out to the live URL.
  - `/seo/web-vitals` — snapshot grid (sorted by INP, worst first — the framing matches the incident that triggered this whole project) + per-URL timeseries section with LCP/INP/CLS charts side-by-side. Each chart shows green (good) and amber (poor) threshold lines.
- **Admin landing tile** — added to `apps/admin/app/page.tsx` under "Operator tools".

**Engineering trade-off recorded:** scripts that touch Mongoose models hit the `server-only` package's unconditional throw when run via tsx (no Next bundler context). Solved with `scripts/seo/_shim-server-only.ts` — pre-populates the require cache with an empty module, must be the first import in any backfill script. Cleaner than refactoring the model files to drop the `server-only` marker (which preserves bundler safety for client components).

### PR 4 — Insights + AI morning briefing ✅

The dashboard up through PR 3 surfaced raw data; PR 4 turns it into action items.

**Rules engine** at `packages/seo/insights.ts` — pure functions that read the existing Mongo collections and produce typed `Insight[]` arrays grouped into Quick Wins / Issues / Trending. Six rule families today:
- CTR leak (high-impression pages with CTR below the expected-CTR-for-position benchmark)
- Striking-distance queries (queries at position 4-12 with > 200 impressions/window — the "push to top-3" opportunity)
- Ranking drop (queries that lost ≥ 3 positions over 28 days)
- CWV regression (URLs whose latest p75 is ≥ 20% worse than the 60-day median)
- Big gainers / losers (week-over-week click delta)

Each rule emits structured insights with `{ title, evidence, recommendation, estimatedImpact, drillDownUrl }` — the same shape the dashboard renders AND the JSON the AI consumes. Thresholds are at the top of `insights.ts` for easy tuning.

**Expected-CTR benchmark** at `packages/seo/expected-ctr.ts` — blended position→CTR table from Advanced Web Ranking + Sistrix + FirstPageSage 2024 studies. `expectedCtr(position)` linearly interpolates; underpins the CTR-leak rule.

**Three new API surfaces:**
- `GET /api/v2/seo/digest` — returns the structured digest as JSON; consumed by the dashboard server component AND the remote Claude routine.
- `POST /api/v2/seo/briefing` — runs the deterministic analysis and upserts today's `seo_briefings` row. Idempotent; preserves an existing LLM synthesis unless `clearSynthesis:true`.
- `POST /api/v2/seo/briefing/synthesis` — attaches a Claude-generated prose summary to an existing briefing row. Called by the remote routine; gated by the scoped `x-briefing-secret` header.

**Scoped auth for the routine:** `lib/auth.ts:hasBriefingSecret` adds a fourth tier to the admin gate that only applies at the two briefing-related routes. The remote routine carries a 64-char `BRIEFING_SECRET` that can only read SEO data + post a synthesis — it can't reach `/questions`, `/flashcards`, or any other admin endpoint. Smaller blast radius than reusing `ADMIN_SECRET`.

**Two new dashboard surfaces:**
- `/seo` — Insights landing. Replaces the old Overview. Health strip at top (traffic trend, CWV pass rate, win/issue counts), then three columns of `InsightCard`s with severity stripes + recommendation lines + drill-down links. Existing Overview demoted to `/seo/overview`.
- `/seo/briefings` — Past 14 days of morning briefings. Latest is expanded with Claude's markdown synthesis; older ones are collapsible details. "Generate today's briefing" button triggers the deterministic analysis on demand (synthesis still gets attached by the routine on its schedule, or via manual POST).

**Two new crons:**
- Vercel cron at `0 2 * * *` — already there from PR 2 (GSC + CrUX sync).
- Vercel cron at `30 2 * * *` — NEW. Runs `/api/cron/seo-briefing` which creates the deterministic briefing row. Synthesis is attached separately by the remote routine.
- Remote routine (Anthropic cloud) at `0 3 * * *` — NEW. ID `trig_01AK6xZZsKWmdWmwLZXSVvaB`. Fetches `/digest`, synthesizes via Claude Sonnet 4.6, POSTs to `/synthesis`. Manage at https://claude.ai/code/routines/trig_01AK6xZZsKWmdWmwLZXSVvaB.

**Why remote routine + scoped secret instead of backend `ANTHROPIC_API_KEY` call:**
1. User's Claude Max subscription covers the LLM cost (no pay-per-token).
2. Prompt edits don't require a backend redeploy — just update the routine via the `schedule` skill.
3. Scoped secret limits damage if the routine prompt or stored state ever leak.
4. Runs reliably in Anthropic's cloud sandbox even when the user's laptop is asleep.

**Why a separate Vercel cron + remote routine instead of merging them:**
- The deterministic part (`runBriefing()`) is fast (~1s), idempotent, and the dashboard needs it even on days when the LLM call fails. It belongs in our backend's cron.
- The synthesis depends on Claude availability + Max-plan quota. Keeping it in the routine means a Claude outage doesn't break the dashboard.
- 30-min buffer (02:30 UTC → 03:00 UTC) is well over the cron's typical run time.

### Production prerequisites for PR 4

1. **`BRIEFING_SECRET` in Vercel** (admin project, Production + Preview). Take the value from your local `.env.local`.
2. **(Optional) `SEO_SLACK_WEBHOOK` in Vercel** if you want Slack delivery. Format: `https://hooks.slack.com/services/...`. Get via Slack → "Incoming Webhooks" app.
3. **No code change needed to the routine.** It's already created and will fire at 03:00 UTC tomorrow.

---

## PR 5 — Generative Engine Optimization (planned)

GEO = optimizing for AI search engines (ChatGPT, Perplexity, Claude, Google AI Overviews) that synthesize answers rather than show 10 blue links. Different signals from SEO; emerging discipline.

**Components for PR 5:**

| Item | What | Implementation sketch |
|---|---|---|
| AI referral tracking | Parse Mixpanel / GA referrer logs for `chat.openai.com`, `perplexity.ai`, `you.com`, `gemini.google.com`, `claude.ai`, etc. → new `ai_referrals_daily` collection. | New cron + dashboard panel. ~1 day. |
| `llms.txt` generator | Emerging standard — like `robots.txt` but for LLM crawlers. Lists canonical content URLs by section. | `apps/student/app/llms.txt/route.ts` — generated from sitemap + book pages. ~3 hours. |
| Schema coverage report | Audit pages for FAQ / HowTo / Course / EducationalOrganization schema. Show which top-traffic pages are missing structured data. | Cheerio over rendered HTML. ~half a day. |
| Citability scorer | For top 50 pages, rule-based score against GEO best practices: first-paragraph definition, fact-dense bullets, schema present, citations to authoritative sources. | Pure function over fetched HTML. ~1 day. |
| AI mention monitor | Once a week, programmatically query ChatGPT / Perplexity for 20 target queries and detect canvasclasses.in citations. Track over time. | Weekly cron, uses official APIs (Perplexity), plus headless-browser for ChatGPT where no API. ~2 days. |
| GEO insights | Add new rule families to `insights.ts`: "page is cited by AI engines but doesn't have schema", "page lacks first-paragraph definition", "page has stale facts vs original sources". | Extends the existing insights engine — same UI rendering. ~half a day. |

**Why this isn't PR 4:** PR 4's insights engine + briefing routine is genuinely useful today with the data we already have. GEO needs separate data pipelines (AI referrals, AI mention queries, HTML scrapes) that take meaningful build time. Better to ship PR 4, let it accumulate signal for a couple weeks, then build PR 5 on top of the validated foundation.

## Out of scope (deferred — see "Phase 5 — Polish" in the original conversation)

- Anomaly alerts (Slack/email on click drops or CWV regressions)
- URL Inspection API integration
- Multi-property support
- Keyword-opportunity ranker (impression-rich, position-8-to-20 queries)
- Switching `gsc_metrics_daily` to a MongoDB time-series collection (current shape is fine up to ~5M docs)
