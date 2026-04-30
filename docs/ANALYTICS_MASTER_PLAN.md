# Analytics Master Plan — Crucible

**Status**: DRAFT — awaiting acceptance before execution
**Owner**: Paaras
**Target scale**: 5k DAU today → 50k DAU horizon
**Budget**: $0/month hard cap
**Execution model**: Phased, with parallel sub-agents inside each phase
**Last updated**: 2026-04-17

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Locked Decisions](#2-locked-decisions)
3. [Tool-by-Tool Rationale](#3-tool-by-tool-rationale)
4. [Event Taxonomy (Canonical)](#4-event-taxonomy-canonical)
5. [Phase 1 — Foundation Observability](#5-phase-1--foundation-observability)
6. [Phase 2 — Mixpanel Core Integration](#6-phase-2--mixpanel-core-integration)
7. [Phase 3 — Event Instrumentation](#7-phase-3--event-instrumentation)
8. [Phase 4 — Custom Business KPI Dashboard](#8-phase-4--custom-business-kpi-dashboard)
9. [Phase 5 — Privacy & Consent](#9-phase-5--privacy--consent)
10. [Phase 6 — Dashboards, Alerts & Runbook](#10-phase-6--dashboards-alerts--runbook)
11. [Parallel Execution Map](#11-parallel-execution-map)
12. [Environment Variables](#12-environment-variables)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Acceptance Criteria](#14-acceptance-criteria)
15. [Appendix A — File Templates](#15-appendix-a--file-templates)
16. [Appendix B — MongoDB Aggregation Pipelines](#16-appendix-b--mongodb-aggregation-pipelines)
17. [Appendix C — Verification Scripts](#17-appendix-c--verification-scripts)

---

## 1. Executive Summary

Crucible currently has zero production analytics beyond `@vercel/analytics` pageviews. At 5k DAU we are blind to: user retention, funnel drop-off, revenue-per-user, session behaviour, error rates, uptime, and performance regressions.

This plan installs a **6-layer observability stack**, fully free for our scale, instrumented via 6 sequential phases that can be partly parallelised across sub-agents. Total build effort is **~10–14 engineer-days** if executed serially, **~3–4 wall-clock days** with the parallelisation map in §11.

**Layers:**

| # | Layer | Answers | Tool |
|---|---|---|---|
| 1 | Web analytics | Traffic, referrers, countries | Vercel Analytics (already in place) |
| 2 | Web vitals | Core Web Vitals, LCP, FID, CLS | Vercel Speed Insights |
| 3 | Product analytics | Funnels, retention, cohorts, revenue | **Mixpanel** (20M events/mo free) |
| 4 | Session replay + heatmaps | What users *actually* do | **Microsoft Clarity** (unlimited free) |
| 5 | Errors + performance traces | Crashes, slow routes, API latency | **Sentry** (5k errors/mo free) |
| 6 | Uptime + logs | Is the site up? What happened at 3am? | **Better Stack** (10 monitors + 1GB logs free) |

**Business KPIs** (DAU/MAU/MRR/retention) computed from MongoDB via a nightly rollup job, surfaced at `/crucible/admin/kpis`.

---

## 2. Locked Decisions

Once accepted, these do not change without explicit plan revision.

| Concern | Decision | Why |
|---|---|---|
| Page views | Vercel Analytics | Already installed, zero-config |
| Web vitals | Vercel Speed Insights | Native to platform |
| Product analytics | **Mixpanel** | 20M events/mo free >> PostHog 1M; drop-in API |
| Session replay | **Microsoft Clarity** | Truly unlimited, free forever |
| Error tracking | **Sentry** | Best-in-class Next.js SDK, free 5k/mo |
| Uptime + alerting | **Better Stack** | 10 monitors + status page free |
| Log aggregation | **Better Stack Logs** | 1GB/mo free, same vendor (one login) |
| Business KPIs | Custom MongoDB dashboard | Already have pattern at `/crucible/admin/AnalyticsDashboard.tsx` |
| Consent banner | Hand-rolled, 30-line component | No third-party dep, GDPR-defensible |
| Feature flags | **Deferred** | Not needed until A/B testing work starts |
| PII in events | Never send email/phone/raw text; IDs only | Compliance + privacy |

---

## 3. Tool-by-Tool Rationale

### 3.1 Mixpanel (vs PostHog)

| | Mixpanel Free | PostHog Cloud Free |
|---|---|---|
| Events/mo | 20,000,000 | 1,000,000 |
| Seats | Unlimited | Unlimited |
| Funnels | ✅ | ✅ |
| Retention | ✅ | ✅ |
| Cohorts | ✅ | ✅ |
| Revenue tracking | ✅ native | Manual |
| Data history | 5 years | 1 year |
| Session replay | ❌ | ✅ 5k/mo |
| Feature flags | ❌ | ✅ 1M reqs |

At 5k DAU × ~30 events/day ≈ 4.5M events/mo. Mixpanel leaves 15M headroom; PostHog would immediately cost money.

Session replay gap is filled by Clarity (unlimited free). Feature flags deferred.

### 3.2 Microsoft Clarity (always free)

Microsoft funds this as a loss-leader for advertising. No events cap, no session cap, no retention cap. Trade-off: data ships to Microsoft. Acceptable because no PII is captured (we mask by default).

### 3.3 Sentry (5k errors/mo free)

If error rate stays healthy (<0.5% of requests), 5k/mo is plenty at 5k DAU. Configured with `tracesSampleRate: 0.1` to keep performance-event budget low. If we breach, first move is a `beforeSend` filter to drop known-noisy errors, not a plan upgrade.

### 3.4 Better Stack (free tier)

- Uptime: 10 monitors, 3-min check interval
- Logs: 1GB/mo ingestion, 3-day retention
- Incident management + status page included

One vendor, one login, two products. Replaces UptimeRobot + Logtail + Statuspage.

### 3.5 What we explicitly did NOT pick

- **Google Analytics 4**: free unlimited, but terrible for product analytics, privacy concerns for EU traffic, poor funnel UX.
- **Amplitude Free**: 50k MTU cap — we'd breach it immediately at 150k MAU.
- **Plausible / Umami Cloud**: good for pageviews but lack cohorts/retention.
- **Datadog**: expensive, built for infra not product.
- **LogRocket / FullStory**: no meaningful free tier.

---

## 4. Event Taxonomy (Canonical)

**Naming convention**: `snake_case`, past tense (`user_signed_up`, not `sign_up`).
**Properties**: always include `chapter_id`, `mode`, `user_plan` when contextually relevant — pre-indexed in Mixpanel for fast filtering.
**Identity**: `distinct_id` = Supabase `auth.user.id`. Anonymous events fire only for public-page loads.

### 4.1 Auth & Lifecycle

| Event | Properties | Fires from |
|---|---|---|
| `user_signed_up` | `source`, `utm_campaign`, `utm_source`, `utm_medium`, `signup_method` (`email`\|`google`) | Supabase auth callback |
| `user_logged_in` | `method`, `days_since_signup` | Session hydration |
| `user_logged_out` | — | Logout handler |
| `password_reset_requested` | — | Forgot-password form |
| `email_verified` | `hours_to_verify` | Email verification callback |

### 4.2 Practice Engagement (core value loop)

| Event | Properties | Sampling | Fires from |
|---|---|---|---|
| `practice_session_started` | `chapter_id`, `mode` (`guided`\|`freestyle`\|`test`), `question_count`, `difficulty_range` | 1:1 | Server action start |
| `question_answered` | `question_id`, `display_id`, `correct`, `time_sec`, `difficulty`, `is_pyq`, `chapter_id` | **1:10** | Client, after grade |
| `practice_session_completed` | `score`, `accuracy`, `duration_sec`, `chapter_id`, `correct_count`, `total_count`, `mode` | 1:1 | Server action end |
| `test_reviewed` | `test_id`, `duration_sec`, `chapter_id` | 1:1 | Review page mount |
| `flag_submitted` | `question_id`, `reason` | 1:1 | Flag modal |

**Why sampling on `question_answered`**: at 5k DAU × 50 questions avg = 250k/day = 7.5M/mo. One event cuts 90% → 750k/mo. Mixpanel math stays comfortable.

### 4.3 Content Discovery

| Event | Properties |
|---|---|
| `chapter_opened` | `chapter_id`, `source_page` |
| `simulation_opened` | `simulation_id`, `subject` |
| `simulation_interacted` | `simulation_id`, `interaction_count` (debounced 5s) |
| `lecture_started` | `lecture_id`, `chapter_id` |
| `lecture_progress` | `lecture_id`, `percent` (fired at 25/50/75/100 only) |
| `book_opened` | `book_id` |
| `book_page_viewed` | `book_id`, `page_number` (debounced 10s) |

### 4.4 Monetization

| Event | Properties |
|---|---|
| `pricing_viewed` | `source_page` |
| `plan_selected` | `plan_id`, `billing_cycle` |
| `checkout_started` | `plan_id`, `amount`, `currency` |
| `checkout_completed` | `plan_id`, `amount`, `currency`, `payment_method` |
| `payment_failed` | `plan_id`, `error_code` |
| `subscription_renewed` | `plan_id`, `amount` |
| `subscription_cancelled` | `plan_id`, `reason` (if provided), `days_subscribed` |

**On `checkout_completed`** also call:
```ts
mixpanel.people.set({ plan, mrr, first_paid_at: new Date() });
mixpanel.people.track_charge(amount);
```
Unlocks Mixpanel's revenue reports natively.

### 4.5 Admin Actions (low volume, high value)

| Event | Properties |
|---|---|
| `admin_question_created` | `chapter_id`, `difficulty`, `type` |
| `admin_question_edited` | `question_id`, `fields_changed` (array) |
| `admin_bulk_import_run` | `batch_id`, `count`, `duration_ms` |
| `admin_tag_assigned` | `question_id`, `tag_id` |

### 4.6 User Properties (set via `mixpanel.people.set`)

Set on signup, updated on relevant events:

```ts
{
  email_domain,       // "gmail.com" — not full email
  signup_date,
  plan,               // "free" | "premium" | "pro"
  mrr,
  total_questions_answered,
  total_practice_minutes,
  current_streak_days,
  target_exam,        // "JEE Main" | "JEE Advanced" | "NEET"
  class,              // "11" | "12" | "dropper"
  last_active_at
}
```

**Forbidden properties**: email, phone, full name, raw question content, payment details beyond amount + plan.

---

## 5. Phase 1 — Foundation Observability

**Goal**: Catch errors, see user behaviour, know when site is down — without any code-level instrumentation.
**Blocks**: Nothing. Four fully independent sub-tasks.
**Parallelism**: 4 agents in parallel.
**Effort**: 3–4 hours total.

### 5.1 Sub-task 1A — Microsoft Clarity

**Steps:**
1. Sign up at https://clarity.microsoft.com, create a project "Crucible Production".
2. Copy the project ID (format: `abc123xyz`).
3. Add `NEXT_PUBLIC_CLARITY_ID=abc123xyz` to Vercel env vars (Production + Preview + Development).
4. Create `components/analytics/ClarityScript.tsx`:

```tsx
'use client';
import Script from 'next/script';

export function ClarityScript() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!id) return null;
  return (
    <Script id="clarity-script" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${id}");
      `}
    </Script>
  );
}
```

5. Mount in [app/layout.tsx](../app/layout.tsx) inside `<body>`, above `<Analytics />`. Gate on consent in Phase 5.
6. Configure Clarity masking: Settings → Masking → Strict (masks all text + inputs by default).

**Verification:**
- Deploy → open prod site in incognito → Clarity "Live" tab shows your session within 2 minutes.
- Clarity Recordings tab shows a replay within 10 minutes (text should be masked).

**Rollback:** Delete the `<ClarityScript />` import. One-line revert.

### 5.2 Sub-task 1B — Sentry

**Steps:**
1. Sign up at https://sentry.io, create org "Canvas" and project "crucible-prod" (Next.js).
2. Copy DSN.
3. In project root:

```bash
npx @sentry/wizard@latest -i nextjs
```

Wizard creates:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`
- Wraps [next.config.ts](../next.config.ts) with `withSentryConfig`.

4. Edit `sentry.client.config.ts`:

```ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,     // no replays without errors — saves quota
  replaysOnErrorSampleRate: 1.0,   // always replay when something breaks
  integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
  beforeSend(event, hint) {
    // Drop known-noisy errors
    const msg = hint.originalException?.toString() ?? '';
    if (msg.includes('ResizeObserver loop')) return null;
    if (msg.includes('NetworkError when attempting to fetch')) return null;
    return event;
  },
});
```

5. Edit `sentry.server.config.ts` — same `tracesSampleRate: 0.1`, no replay config.
6. Env vars to Vercel:
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_AUTH_TOKEN` (for source-map upload during build)
   - `SENTRY_ORG=canvas`
   - `SENTRY_PROJECT=crucible-prod`

**Verification:**
- Create `app/api/test-sentry/route.ts` that throws → hit it → error appears in Sentry within 1 min. Delete route afterwards.
- Sentry Performance tab shows traces after 24h of traffic.

**Rollback:** `git revert` the wizard commit. Removes config files and `next.config.ts` wrap.

### 5.3 Sub-task 1C — Vercel Speed Insights

**Steps:**
1. `npm i @vercel/speed-insights`
2. In [app/layout.tsx](../app/layout.tsx):

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

// inside <body>, next to <Analytics />:
<SpeedInsights />
```

3. Enable in Vercel dashboard: Project → Speed Insights → Enable.

**Verification:** After 24h, Vercel → Speed Insights tab shows p75 LCP/FID/CLS per route.

**Rollback:** Remove import + component.

### 5.4 Sub-task 1D — Better Stack Uptime + Health Route

**Steps:**

1. Create `app/api/health/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, boolean> = { mongo: false, supabase: false };
  const start = Date.now();

  try {
    const conn = await dbConnect();
    checks.mongo = conn.connection.readyState === 1;
  } catch { checks.mongo = false; }

  try {
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supa.auth.getSession();
    checks.supabase = !error;
  } catch { checks.supabase = false; }

  const ok = checks.mongo && checks.supabase;
  return NextResponse.json(
    { ok, checks, duration_ms: Date.now() - start },
    { status: ok ? 200 : 503 }
  );
}
```

2. Sign up at https://betterstack.com, create workspace.
3. Create 4 Uptime monitors (3-min interval):
   - `https://<prod-domain>/` (landing)
   - `https://<prod-domain>/the-crucible`
   - `https://<prod-domain>/api/health` (expect `200`)
   - `https://<prod-domain>/crucible/admin` (expect `200` or `302` to login)
4. Configure alerts: email + Slack webhook → #ops.
5. Create public status page (optional, public-facing).

**Verification:**
- Hit `/api/health` in browser → JSON with `ok: true`.
- Pause one monitor's URL → Slack alert arrives within 5 min.

**Rollback:** Delete health route; pause monitors in Better Stack.

### 5.5 Phase 1 Acceptance Checklist

- [ ] Clarity showing live sessions in prod
- [ ] Sentry recording test error
- [ ] Speed Insights collecting data (24h wait)
- [ ] Better Stack 4 monitors all green
- [ ] `/api/health` returning 200
- [ ] Slack alert channel receiving at least one test alert

---

## 6. Phase 2 — Mixpanel Core Integration

**Goal**: Identify users, emit one event end-to-end. No feature instrumentation yet.
**Blocks**: Phase 3 requires this complete.
**Parallelism**: single agent.
**Effort**: 3 hours.

### 6.1 Deliverables

1. `npm i mixpanel-browser mixpanel`
2. Create [lib/analytics/mixpanel.ts](../lib/analytics/mixpanel.ts) — see Appendix A.1.
3. Create [components/providers/MixpanelProvider.tsx](../components/providers/MixpanelProvider.tsx) — see Appendix A.2.
4. Mount `<MixpanelProvider>` in [app/layout.tsx](../app/layout.tsx) wrapping `{children}`.
5. Env vars:
   - `NEXT_PUBLIC_MIXPANEL_TOKEN` (client)
   - `MIXPANEL_TOKEN` (server — same value, different execution context)
6. Emit one boot event `app_loaded` on client mount to verify.

### 6.2 Built-in Guardrails (codified in `lib/analytics/mixpanel.ts`)

- **Consent gate**: `track()` no-ops when `hasConsent()` returns false (checked every call).
- **Anonymous filter**: `track()` no-ops if no `distinct_id` identified, except for the single `app_loaded` event.
- **PII sanitiser**: automatic stripper for known PII keys (`email`, `phone`, `name`, `password`, `question_content`). Logs a warning in dev if hit.
- **Sampler**: `trackSampled(event, props, rate)` for high-volume events.
- **Server/client parity**: `trackServer(userId, event, props)` accepts an explicit userId because server has no session.

### 6.3 Verification

- Log in on prod → open Mixpanel "Events" live view → confirm `user_logged_in` (from Phase 3A) or at minimum `app_loaded` appears with correct `distinct_id`.
- Log out → `reset()` fires. Emit next event → confirm new anonymous session, old identity not carried over.
- Send `{ email: "x" }` as a prop → verify it's stripped with a dev console warning.

### 6.4 Rollback

Delete `lib/analytics/mixpanel.ts`, `components/providers/MixpanelProvider.tsx`, and the provider mount. Revert `package.json`. One commit.

---

## 7. Phase 3 — Event Instrumentation

**Goal**: Instrument the 5 domains from §4. Each sub-agent owns one domain, touches disjoint files.
**Blocks**: Phase 2.
**Parallelism**: 5 agents in parallel.
**Effort**: 2–3 hours per sub-task.

### 7.1 Sub-task 3A — Auth & Lifecycle

**Files touched:**
- `lib/supabase/*` (auth callbacks)
- `app/login/*`, `app/signup/*` (form handlers)
- `components/providers/MixpanelProvider.tsx` (identify on session hydrate)

**Events to wire:**
- `user_signed_up` — in Supabase signup callback
- `user_logged_in` — on session hydration in provider
- `user_logged_out` — in logout handler, before `reset()`
- `password_reset_requested` — forgot-password form submit
- `email_verified` — verify-email callback

**On signup, also call:**
```ts
mixpanel.people.set({
  signup_date: new Date().toISOString(),
  email_domain: email.split('@')[1],
  plan: 'free',
  target_exam: selectedExam,  // if captured at signup
  class: selectedClass,
});
```

**Verification**: fresh signup flow end-to-end → all 3 core events (signed_up, logged_in, email_verified) appear in Mixpanel with correct user traits.

### 7.2 Sub-task 3B — Practice Engagement (HIGHEST PRIORITY)

**Files touched:**
- [app/the-crucible/actions.ts](../app/the-crucible/actions.ts) — server actions, use `trackServer()`
- [app/the-crucible/components/GuidedPracticeWizard.tsx](../app/the-crucible/components/GuidedPracticeWizard.tsx)
- [app/the-crucible/components/StepModeSelect.tsx](../app/the-crucible/components/StepModeSelect.tsx)
- [app/the-crucible/dashboard/DashboardClient.tsx](../app/the-crucible/dashboard/DashboardClient.tsx)

**Events:**
- `practice_session_started` — fire in the server action that creates the test session.
- `question_answered` — client-side after grade, **sampled 1:10** via `trackSampled(..., 0.1)`.
- `practice_session_completed` — fire in the server action that persists `TestResult`. **Must be server-side** — client may navigate away before firing.
- `test_reviewed` — client mount of review page.
- `flag_submitted` — flag modal submit handler.

**Also update user properties on `practice_session_completed`:**
```ts
mixpanel.people.increment({
  total_questions_answered: total_count,
  total_practice_minutes: Math.round(duration_sec / 60),
});
mixpanel.people.set({ last_active_at: new Date().toISOString() });
```

**Verification**: complete one guided practice session → all 4 events land in Mixpanel in correct order with matching `session_id` prop.

### 7.3 Sub-task 3C — Content Discovery

**Files touched:**
- [app/organic-chemistry-hub/](../app/organic-chemistry-hub/)
- [app/physical-chemistry-hub/](../app/physical-chemistry-hub/)
- [app/detailed-lectures/](../app/detailed-lectures/)
- [app/one-shot-lectures/](../app/one-shot-lectures/)
- [components/books/](../components/books/)

**Events:**
- `chapter_opened` — chapter page mount
- `simulation_opened` — simulation component mount
- `simulation_interacted` — debounced 5s after user interaction
- `lecture_started` — video play event
- `lecture_progress` — at 25/50/75/100% of duration (via video timeupdate, throttled)
- `book_opened` — book reader mount
- `book_page_viewed` — debounced 10s

**Verification**: navigate through each content type → correct events fire, debounces respect timing.

### 7.4 Sub-task 3D — Monetization

**Files touched:**
- Pricing page
- Checkout routes
- Stripe/Razorpay webhook handler (server-side)

**Events:** see §4.4.

**On `checkout_completed`** (server-side, from webhook):
```ts
import { trackServer, peopleSet, peopleTrackCharge } from '@/lib/analytics/mixpanel';
await trackServer(userId, 'checkout_completed', { plan_id, amount, currency, payment_method });
await peopleSet(userId, { plan: plan_id, mrr: amount, first_paid_at: new Date() });
await peopleTrackCharge(userId, amount);
```

**Verification**: run test checkout (Stripe test mode) → `checkout_completed` + revenue event appear; Mixpanel "Revenue" report shows the charge.

### 7.5 Sub-task 3E — Admin Actions

**Files touched:**
- [app/crucible/admin/](../app/crucible/admin/)
- [app/api/v2/](../app/api/v2/)

**Events:** see §4.5. Low volume, no sampling.

**Verification**: create/edit one question via admin panel → event lands.

### 7.6 Phase 3 Acceptance Checklist

- [ ] All 5 sub-tasks merged to main
- [ ] Mixpanel "Events" tab shows each event type at least once
- [ ] User profiles in Mixpanel show populated traits (plan, signup_date, etc.)
- [ ] No PII leaking (spot-check 20 random events)
- [ ] Event volume for 24h < 200k (pro-rata fits under free tier)

---

## 8. Phase 4 — Custom Business KPI Dashboard

**Goal**: Admin-only page answering all "how's the business doing" questions, backed by MongoDB.
**Blocks**: Nothing — can run parallel with Phases 1–3.
**Parallelism**: single agent.
**Effort**: 1.5–2 days.

### 8.1 Deliverables

1. `app/crucible/admin/kpis/page.tsx` — server component, admin-guarded via `requireAdmin()`.
2. `app/api/v2/admin/kpis/route.ts` — GET route, returns aggregated JSON, admin-guarded.
3. `app/api/cron/rollup-kpis/route.ts` — nightly cron, guarded by `CRON_SECRET` header.
4. `vercel.json` cron entry (see §8.4).
5. New MongoDB collection: `kpi_daily` — one document per UTC day with rolled-up numbers.
6. Mongoose model: `lib/models/KpiDaily.ts`.

### 8.2 KPIs Computed

| # | KPI | Source |
|---|---|---|
| 1 | DAU / WAU / MAU | distinct `user_id` in `TestResult` ∪ `auditlogs` |
| 2 | Stickiness | DAU / MAU |
| 3 | New signups / day | `auth.users.created_at` (Supabase via service role) |
| 4 | Retention (D1/D7/D30) | cohort table by signup week |
| 5 | MRR / ARR | active subscriptions × plan price |
| 6 | ARPPU | total revenue / paying users |
| 7 | Free→Paid conversion | paid users / total users |
| 8 | Practice minutes / day | sum `time_spent_seconds` from `TestResult.questions` |
| 9 | Top 10 chapters this week | grouped count on `TestResult.chapter_id` |
| 10 | Churn rate | cancelled subs / active subs (monthly) |

### 8.3 UI

Follows the existing [AnalyticsDashboard.tsx](../app/crucible/admin/AnalyticsDashboard.tsx) dark-theme pattern (donut + HBar components). Date range selector: 7d / 30d / 90d / YTD. Export-to-CSV button.

### 8.4 Cron Config (`vercel.json`)

```json
{
  "crons": [
    {
      "path": "/api/cron/rollup-kpis",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Runs 3am UTC daily. Route validates `request.headers.get('authorization') === 'Bearer ' + process.env.CRON_SECRET`.

### 8.5 Aggregation Pipelines

See Appendix B for full pipelines.

### 8.6 Acceptance

- [ ] `/crucible/admin/kpis` loads in <2s for 90-day range
- [ ] All 10 KPIs render with real numbers
- [ ] Cron runs successfully 2 nights in a row
- [ ] `kpi_daily` collection has documents dated correctly
- [ ] Non-admin user redirected away from the page

---

## 9. Phase 5 — Privacy & Consent

**Goal**: Defensible consent before trackers fire for EU / privacy-sensitive traffic.
**Blocks**: Mixpanel, Clarity, Sentry Replay all check consent gate.
**Parallelism**: 1 agent, independent.
**Effort**: 4 hours.

### 9.1 Deliverables

1. `components/ConsentBanner.tsx` — ~30 lines, shadcn-style. Stores choice in `cookie_consent=granted|denied` cookie, 180-day expiry.
2. `lib/analytics/consent.ts` — `hasConsent()` + `setConsent(value)` readers/writers.
3. `app/privacy/page.tsx` — plain page listing all trackers, what each collects, user rights, contact.
4. Update:
   - `lib/analytics/mixpanel.ts` — every `track` checks `hasConsent()`.
   - `components/analytics/ClarityScript.tsx` — gates script injection on consent.
   - `sentry.client.config.ts` — `replaysOnErrorSampleRate: 0` until consent.

### 9.2 Consent Matrix

| Tracker | Without consent | With consent |
|---|---|---|
| Vercel Analytics | ✅ (cookieless, pageviews only) | ✅ |
| Sentry error tracking | ✅ (legitimate interest) | ✅ |
| Sentry replay | ❌ | ✅ |
| Mixpanel | ❌ | ✅ |
| Clarity | ❌ | ✅ |
| Better Stack | ✅ (server-side only) | ✅ |

### 9.3 Acceptance

- [ ] Fresh browser (no cookie): banner shows; Mixpanel/Clarity/Replay silent.
- [ ] Click "Accept": all 3 fire within 1s, no reload needed.
- [ ] Click "Decline": only Vercel + Sentry errors active.
- [ ] `/privacy` page passes legal-read test.

---

## 10. Phase 6 — Dashboards, Alerts & Runbook

**Goal**: Stakeholder can answer any business question in <30s; on-call paged reliably.
**Blocks**: Phases 1–4.
**Parallelism**: 1 agent.
**Effort**: 1 day.

### 10.1 Mixpanel Dashboards (create 3)

**Dashboard 1 — Acquisition**
- Signups per day (line)
- Signups by source (bar, broken down by `utm_source`)
- Landing → Signup funnel
- Email verification rate

**Dashboard 2 — Engagement**
- DAU / WAU / MAU (line)
- Stickiness (DAU/MAU ratio, line)
- Practice funnel: `chapter_opened` → `practice_session_started` → `practice_session_completed`
- Retention cohort table (D1/D7/D30 by weekly signup cohort)
- Top 10 chapters by sessions this week
- Avg questions per session

**Dashboard 3 — Monetization**
- Pricing funnel: `pricing_viewed` → `plan_selected` → `checkout_started` → `checkout_completed`
- MRR trend (line)
- Free→Paid conversion rate
- Churn per month
- Revenue by plan (pie)

### 10.2 Sentry Alerts

| Condition | Channel | Threshold |
|---|---|---|
| Error rate > 1% over 5 min | Slack #ops | — |
| New unhandled exception type | Email | first occurrence |
| Transaction P95 > 3s on `/api/v2/*` | Slack #ops | 10 min window |
| Replay event count > 2× 7d avg | Email | anomaly |

### 10.3 Better Stack Alerts

Already configured in Phase 1. Add escalation:
- Monitor down 3 min, no ack → SMS to on-call
- Monitor down 10 min → phone call

### 10.4 Mixpanel Alerts

| Condition | Channel |
|---|---|
| Signups drop >50% DoD | Email |
| Payment success rate <95% over 1h | Slack |
| DAU drop >30% WoW | Email |

### 10.5 Runbook

Create `docs/ANALYTICS_RUNBOOK.md` covering:
- How to read each dashboard (screenshots + annotations)
- How to add a new event (code example)
- How to debug "my event didn't show up"
- How to add a new KPI to the custom dashboard
- How to handle a Sentry alert (triage → assign → resolve)
- Quota warning response: how to enable sampling on a runaway event
- Access: who has admin where, rotation process

### 10.6 Acceptance

- [ ] All 3 Mixpanel dashboards live with at least 1 week of data
- [ ] Synthetic error → Slack alert delivered <3 min
- [ ] Synthetic event → correct dashboard within 1 min
- [ ] Runbook passes 10-min read test by non-author

---

## 11. Parallel Execution Map

```
Wave 1 — Foundation (4 parallel agents, ~4h)
  ├── Agent-1A: Clarity          → touches app/layout.tsx, new components/analytics/ClarityScript.tsx
  ├── Agent-1B: Sentry            → touches next.config.ts, sentry.*.config.ts, instrumentation.ts
  ├── Agent-1C: Speed Insights    → touches app/layout.tsx (add SpeedInsights)
  └── Agent-1D: Better Stack      → touches app/api/health/route.ts

  ⚠ 1A and 1C both touch app/layout.tsx — merge sequentially OR give one agent both.

Wave 2 — Parallelisable pair (2 agents, ~3h each)
  ├── Agent-2: Mixpanel core      → lib/analytics/mixpanel.ts, components/providers/MixpanelProvider.tsx, app/layout.tsx
  └── Agent-5: Privacy + consent  → components/ConsentBanner.tsx, lib/analytics/consent.ts, app/privacy/page.tsx

  ⚠ Both touch app/layout.tsx. Merge Agent-2 first, then Agent-5 rebases.

Wave 3 — Instrumentation + KPI dashboard (6 parallel agents, ~2-3h each except 4)
  ├── Agent-3A: Auth events       → lib/supabase/*, auth pages
  ├── Agent-3B: Practice events   → app/the-crucible/*
  ├── Agent-3C: Content events    → hub pages, lectures, books
  ├── Agent-3D: Monetization      → pricing, checkout, webhooks
  ├── Agent-3E: Admin events      → app/crucible/admin/*, app/api/v2/*
  └── Agent-4: KPI dashboard      → app/crucible/admin/kpis/*, app/api/v2/admin/kpis/*, app/api/cron/*

  All 6 touch disjoint files. Near-zero merge conflicts.

Wave 4 — Final polish (1 agent, ~1 day)
  └── Agent-6: Dashboards + alerts + runbook (no code, just config + docs)
```

**Total wall-clock estimate with parallelisation**: 3–4 days.
**Serial estimate**: 10–14 days.

---

## 12. Environment Variables

Add to Vercel (Production + Preview) **and** `.env.local`:

```bash
# Clarity
NEXT_PUBLIC_CLARITY_ID=

# Mixpanel
NEXT_PUBLIC_MIXPANEL_TOKEN=
MIXPANEL_TOKEN=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=canvas
SENTRY_PROJECT=crucible-prod

# Better Stack
BETTERSTACK_SOURCE_TOKEN=

# Cron
CRON_SECRET=  # generate with `openssl rand -hex 32`
```

---

## 13. Risks & Mitigations

| # | Risk | Likelihood | Mitigation |
|---|---|---|---|
| 1 | Mixpanel free tier exceeded before 50k DAU | Medium | `question_answered` sampled 1:10; no `$pageview` to Mixpanel; anon traffic filtered |
| 2 | Sentry 5k errors/mo breached by a loud bug | Medium | `tracesSampleRate: 0.1`, `beforeSend` filter for noisy errors, alert on spike |
| 3 | Consent banner blocks legitimate analytics | Low | Sentry errors + Vercel Analytics run without consent (legitimate interest) |
| 4 | MongoDB load from nightly rollup | Low | Rollup at 3am UTC low-traffic window; reads indexed fields only |
| 5 | PII leaking to vendors | Medium | Sanitiser in `lib/analytics/mixpanel.ts`; Clarity masks by default; code review gate |
| 6 | Vercel cron doesn't fire (free tier limits) | Low | Vercel Hobby supports 2 cron invocations/day; we use 1. Monitor via Better Stack heartbeat. |
| 7 | Double-firing events on React strict mode | Medium | Provider uses `useRef` initialization guard |
| 8 | Server actions fail to track `practice_session_completed` | High impact | Fire server-side in same transaction as DB write; log to Sentry if tracking fails |

---

## 14. Acceptance Criteria

Plan is considered **complete** when:

- [ ] All 6 tools green with real production data
- [ ] Stakeholder can answer DAU, MRR, top-funnel drop-off from one bookmark
- [ ] On-call receives Slack ping <3 min for synthetic prod error
- [ ] Total monthly recurring cost: **$0**
- [ ] Event volume projected to stay under free tier through 25k+ DAU
- [ ] No PII flows to any third-party vendor (spot-checked)
- [ ] Runbook passes 10-min read test
- [ ] All phases have merged PRs with tests where applicable
- [ ] `docs/ANALYTICS_RUNBOOK.md` exists and is linked from this file

---

## 15. Appendix A — File Templates

### A.1 `lib/analytics/mixpanel.ts`

```ts
import mixpanelBrowser from 'mixpanel-browser';
import Mixpanel from 'mixpanel';
import { hasConsent } from './consent';

const PII_KEYS = ['email', 'phone', 'name', 'password', 'question_content', 'full_name'];

let clientInitialized = false;
let identified = false;

// ── CLIENT ──────────────────────────────────────────────────────────────────
export function initMixpanel() {
  if (typeof window === 'undefined') return;
  if (clientInitialized) return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;
  mixpanelBrowser.init(token, {
    api_host: 'https://api.mixpanel.com',
    persistence: 'localStorage',
    ignore_dnt: false,
    track_pageview: false, // we use Vercel Analytics for that
  });
  clientInitialized = true;
}

function sanitize(props: Record<string, unknown> = {}) {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (PII_KEYS.includes(k.toLowerCase())) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[analytics] PII key "${k}" stripped from event props`);
      }
      continue;
    }
    clean[k] = v;
  }
  return clean;
}

export function identify(userId: string, traits: Record<string, unknown> = {}) {
  if (!clientInitialized) return;
  if (!hasConsent()) return;
  mixpanelBrowser.identify(userId);
  mixpanelBrowser.people.set(sanitize(traits));
  identified = true;
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (!clientInitialized) return;
  if (!hasConsent()) return;
  // Allow the bootstrap event before identify; block all others
  if (!identified && event !== 'app_loaded') return;
  mixpanelBrowser.track(event, sanitize(props));
}

export function trackSampled(event: string, props: Record<string, unknown>, rate: number) {
  if (Math.random() > rate) return;
  track(event, { ...props, _sampled: true, _sample_rate: rate });
}

export function peopleSet(traits: Record<string, unknown>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.set(sanitize(traits));
}

export function peopleIncrement(props: Record<string, number>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.increment(props);
}

export function peopleTrackCharge(amount: number) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.track_charge(amount);
}

export function reset() {
  if (!clientInitialized) return;
  mixpanelBrowser.reset();
  identified = false;
}

// ── SERVER ──────────────────────────────────────────────────────────────────
let serverClient: ReturnType<typeof Mixpanel.init> | null = null;
function getServerClient() {
  if (serverClient) return serverClient;
  const token = process.env.MIXPANEL_TOKEN;
  if (!token) return null;
  serverClient = Mixpanel.init(token);
  return serverClient;
}

export async function trackServer(
  userId: string,
  event: string,
  props: Record<string, unknown> = {}
) {
  const client = getServerClient();
  if (!client) return;
  return new Promise<void>((resolve) => {
    client.track(event, { distinct_id: userId, ...sanitize(props) }, (err) => {
      if (err) console.error('[mixpanel server]', err);
      resolve();
    });
  });
}

export async function peopleSetServer(userId: string, traits: Record<string, unknown>) {
  const client = getServerClient();
  if (!client) return;
  return new Promise<void>((resolve) => {
    client.people.set(userId, sanitize(traits), (err) => {
      if (err) console.error('[mixpanel server people.set]', err);
      resolve();
    });
  });
}
```

### A.2 `components/providers/MixpanelProvider.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { initMixpanel, identify, track, reset } from '@/lib/analytics/mixpanel';

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    initMixpanel();
    track('app_loaded');

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        identify(data.user.id, {
          email_domain: data.user.email?.split('@')[1],
          signup_date: data.user.created_at,
        });
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        identify(session.user.id, {
          email_domain: session.user.email?.split('@')[1],
        });
        track('user_logged_in', { method: session.user.app_metadata?.provider ?? 'email' });
      } else if (event === 'SIGNED_OUT') {
        track('user_logged_out');
        reset();
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
```

### A.3 `lib/analytics/consent.ts`

```ts
const COOKIE = 'cookie_consent';
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function hasConsent(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c === `${COOKIE}=granted`);
}

export function setConsent(value: 'granted' | 'denied') {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=${value}; max-age=${MAX_AGE}; path=/; samesite=lax`;
}

export function clearConsent() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=; max-age=0; path=/`;
}
```

---

## 16. Appendix B — MongoDB Aggregation Pipelines

### B.1 DAU / WAU / MAU

```js
// For a given target date T, count distinct user_ids with activity in [T-Nd, T]
db.testresults.aggregate([
  { $match: { created_at: { $gte: ISODate("2026-04-16"), $lt: ISODate("2026-04-17") } } },
  { $group: { _id: "$user_id" } },
  { $count: "dau" }
]);
```

### B.2 Retention Cohort (D1)

```js
// Users who signed up on cohort day, then returned on day + 1
db.users.aggregate([
  { $match: { created_at: { $gte: cohortStart, $lt: cohortEnd } } },
  { $lookup: {
      from: "testresults",
      let: { uid: "$_id", signup: "$created_at" },
      pipeline: [
        { $match: { $expr: {
          $and: [
            { $eq: ["$user_id", "$$uid"] },
            { $gte: ["$created_at", { $add: ["$$signup", 1000 * 60 * 60 * 24] }] },
            { $lt:  ["$created_at", { $add: ["$$signup", 1000 * 60 * 60 * 48] }] },
          ]
        }}},
        { $limit: 1 }
      ],
      as: "d1_activity"
  }},
  { $group: {
      _id: null,
      total: { $sum: 1 },
      retained: { $sum: { $cond: [{ $gt: [{ $size: "$d1_activity" }, 0] }, 1, 0] } }
  }},
  { $project: { d1_retention: { $divide: ["$retained", "$total"] } } }
]);
```

### B.3 Practice Minutes / Day

```js
db.testresults.aggregate([
  { $match: { created_at: { $gte: ISODate("2026-04-10") } } },
  { $unwind: "$questions" },
  { $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
      total_seconds: { $sum: "$questions.time_spent_seconds" }
  }},
  { $project: {
      date: "$_id",
      total_minutes: { $divide: ["$total_seconds", 60] }
  }},
  { $sort: { date: 1 } }
]);
```

### B.4 Top Chapters This Week

```js
db.testresults.aggregate([
  { $match: { created_at: { $gte: sevenDaysAgo } } },
  { $group: { _id: "$chapter_id", sessions: { $sum: 1 } } },
  { $sort: { sessions: -1 } },
  { $limit: 10 }
]);
```

---

## 17. Appendix C — Verification Scripts

### C.1 `scripts/verify_analytics_events.js`

Fires a sample event to each service with a known marker, then prints curl URLs to inspect in each dashboard. Useful before final acceptance.

### C.2 `scripts/check_pii_in_events.js`

Queries Mixpanel export API for last 24h of events, checks for PII keys, alerts if any leaked.

*(Actual script contents to be written in the implementation phase — skeleton only here.)*

---

## End of Plan

**To accept**: reply "accepted" and I will spawn Wave 1 (4 parallel agents for Phase 1).
**To revise**: call out the section number and the change.
