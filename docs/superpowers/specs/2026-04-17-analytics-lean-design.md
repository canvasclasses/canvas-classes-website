# Analytics — Lean Design (Crucible)

**Status**: DRAFT — awaiting final user review
**Owner**: Paaras
**Supersedes**: `docs/ANALYTICS_MASTER_PLAN.md`
**Scale target**: 5k DAU today → 50k DAU horizon
**Budget**: $0/month hard cap, verified by projection at 50k DAU
**Date**: 2026-04-17

---

## 1. Intent

Crucible is pre-revenue, running blind past Vercel Analytics pageviews. This design installs the smallest observability stack that answers the questions a founder actually needs at this stage, sized to stay free through 50k DAU, with a clear deferral list for work that belongs to a later stage.

**Questions this stack must answer on day one:**

1. Is the site up? Is it throwing errors?
2. How many unique users were active today / this week / this month?
3. What do users who stay actually do? (session replay)
4. Do users come back on day 1, day 7, day 30 after signup?
5. How far do users get through the practice funnel: landing → chapter opened → session started → session completed?
6. Which chapters are most practiced this week?

**Questions explicitly deferred** (answered when the relevant feature exists or signal forces it):

- Revenue, MRR, ARPPU, churn — deferred until checkout ships.
- Per-question accuracy, time-per-question, difficulty distribution — already queryable from MongoDB `TestResult`/`StudentResponse`; no Mixpanel duplication.
- Feature-flagged experiments — deferred until traffic supports statistical significance.
- Multi-audience dashboards, runbook, on-call rotation — deferred until there is a second person on-call.

---

## 2. Why The Prior Plan Was Cut Down

The prior plan (`docs/ANALYTICS_MASTER_PLAN.md`) hit four problems that this design fixes by cutting rather than patching:

1. **Event volume blows the Mixpanel free tier at 50k DAU.** 50k DAU × ~5 sessions × ~20 questions = ~150M events/month on `question_answered` alone. The plan's 1:10 sampling barely fits under the 20M cap with zero headroom, and sampled funnels silently lie by 10× because Mixpanel does not auto-multiply.
2. **Phase 3D (Monetization) has no code to instrument.** No `pricing/`, `checkout/`, or webhook routes exist. The phase would produce dead code.
3. **Consent gating was deferred to Phase 5** while Phase 1 mounts Clarity without consent. Between the two merges, unconsented tracking fires. Fixed by making consent a Day-1 concern, not a phase.
4. **Parallel-agent gymnastics produced more merge risk than time saved.** `app/layout.tsx` is a shared contention point across most waves. Serial execution by one agent saves a day of coordination overhead.

The custom MongoDB KPI dashboard is also deferred: Mixpanel answers 9 of the original 10 KPIs natively, and the tenth (revenue) requires checkout to exist first.

---

## 3. Principles

1. **Two data planes, no duplication.** Mixpanel owns session-level funnels, retention, lifecycle, identity. MongoDB owns everything per-question (already stored in `TestResult.questions[]` and `StudentResponse`). A new analytics question is answered from whichever plane already has the data; new events only when neither does.
2. **Instrument shipping features, not imagined ones.** No events for features that don't exist yet. When checkout ships, add checkout events in the same PR.
3. **Consent gate is a library call, not a phase.** `hasConsent()` is checked inside `track()` and inside Clarity mount from the first commit. No retrofit window.
4. **Every new event passes a 50k-DAU volume check before merging.** Written into the runbook when the runbook ships.

---

## 4. Tool Stack

| Layer | Tool | Purpose | 50k DAU sizing |
|---|---|---|---|
| Pageviews | Vercel Analytics | Traffic, referrers, countries | Free within Vercel plan (already installed) |
| Web vitals | Vercel Speed Insights | LCP / FID / CLS per route | Free within Vercel plan |
| Errors | Sentry | Crashes, stack traces, limited performance traces | Free **if** app error rate stays <1%; mitigation path if breached in §8 |
| Session replay | Microsoft Clarity | Heatmaps, replays, rage-click detection | Free, unlimited — no cap ever |
| Product analytics | Mixpanel | 8 events → funnels, retention, lifecycle, identity | ~15M events/mo projected at 50k DAU; cap is 20M |
| Uptime | Better Stack | 4 monitors, 3-min interval, status page | Free tier (10 monitors) |

**Dropped vs the prior plan:** Better Stack Logs, custom MongoDB KPI dashboard page, `app/api/cron/rollup-kpis`, `kpi_daily` collection, `lib/models/KpiDaily.ts`, dedicated consent phase, runbook as an acceptance gate, parallel-agent execution map.

**Not adopted:** GA4 (bad funnel UX, privacy concerns), PostHog Cloud (1M events/mo too small), Amplitude Free (50k MTU cap breached immediately at 50k DAU), LogRocket / FullStory (no meaningful free tier), Datadog (paid, infra-oriented).

---

## 5. Event Taxonomy

Naming convention: `snake_case`, past tense. `distinct_id` = Supabase `auth.user.id`. Anonymous users fire nothing to Mixpanel; they appear in Vercel Analytics pageview data only.

### 5.1 The eight events

| Event | Properties | Fires from | Sampling |
|---|---|---|---|
| `user_signed_up` | `signup_method` (`email`\|`google`), `email_domain`, `target_exam`, `class`, `utm_source`, `utm_campaign`, `utm_medium` | Supabase signup callback | 1:1 |
| `user_logged_in` | `method`, `days_since_signup` | `MixpanelProvider` on `SIGNED_IN` auth state change only — **not** on page-refresh hydration of an already-authenticated user (hydration triggers `identify` silently) | 1:1 |
| `chapter_opened` | `chapter_id`, `source_page` | Chapter page client mount | 1:1 |
| `simulation_opened` | `simulation_id`, `subject` | Simulation component mount | 1:1 |
| `practice_session_started` | `chapter_id`, `mode` (`guided`\|`freestyle`\|`test`), `question_count`, `difficulty_range` | Server action that creates the session | 1:1 |
| `practice_session_completed` | `chapter_id`, `mode`, `accuracy`, `duration_sec`, `correct_count`, `total_count`, `session_id` | Server action that persists `TestResult` (server-side fire; client may navigate) | 1:1 |
| `flag_submitted` | `question_id`, `reason` | Flag modal submit | 1:1 |
| `admin_action` | `type` (`create`\|`edit`\|`delete`\|`bulk_import`), `entity` (`question`\|`tag`\|`chapter`), `entity_id` | Admin route handlers post-success | 1:1 |

### 5.2 User properties

Set via `mixpanel.people.set_once` on signup (immutable traits):

- `signup_date`
- `email_domain` (never full email)
- `target_exam` (`JEE Main` | `JEE Advanced` | `NEET` — if captured at signup)
- `class` (`11` | `12` | `dropper`)

Set via `mixpanel.people.set` on `practice_session_completed`:

- `last_active_at`

Set via `mixpanel.people.increment` on `practice_session_completed`:

- `total_questions_answered` (add `total_count`)
- `total_practice_minutes` (add `Math.round(duration_sec / 60)`)

### 5.3 Forbidden properties (hard PII blocklist)

`email`, `phone`, `name`, `full_name`, `password`, `question_content`, `answer_text`, raw user-submitted strings of any kind. Enforced by sanitizer in `lib/analytics/mixpanel.ts` that logs a dev console warning if a forbidden key is seen.

### 5.4 What is NOT in Mixpanel (and why)

| Not tracked | Why | Where it lives instead |
|---|---|---|
| `question_answered` | Would breach 20M cap at 50k DAU; sampled would break funnels | `TestResult.questions[]` in MongoDB |
| `lecture_progress` | Video infra not finalized | Add when lecture feature ships |
| `book_page_viewed` | Volume risk (debounced still noisy); low near-term value | Add when book engagement is a question being asked |
| `email_verified`, `password_reset_requested` | Infrequent, low analytical value | Supabase dashboard if needed |
| `pricing_viewed`, `checkout_*`, `subscription_*` | No checkout code exists | Add in same PR as checkout ships |
| `simulation_interacted` (debounced) | Volume risk; Clarity replays cover "what did they actually do" | Clarity |

### 5.5 Volume projection at 50k DAU

Conservative per-DAU daily event mix: 1 `user_logged_in`, 3 `chapter_opened`, 2 `simulation_opened`, 2 `practice_session_started`, 2 `practice_session_completed`, 0.05 `flag_submitted`, 0.01 `admin_action`. Total ≈ 10 events/DAU/day.

50,000 × 10 × 30 = **15,000,000 events/month**. Mixpanel free cap is 20,000,000. Headroom is ~5M, which absorbs spikes and onboards one or two additional events later without panic. **If a new event would push projected volume above 18M/mo, it does not ship.**

---

## 6. Architecture & Key Files

### 6.1 New files

| Path | Purpose |
|---|---|
| `lib/analytics/mixpanel.ts` | Client + server Mixpanel wrapper. Exports: `initMixpanel`, `identify`, `track`, `peopleSet`, `peopleSetOnce`, `peopleIncrement`, `reset`, `trackServer`, `peopleSetServer`, `peopleIncrementServer`. PII sanitizer applied to every call. |
| `lib/analytics/consent.ts` | `hasConsent()`, `setConsent('granted'\|'denied')`, `clearConsent()`. Cookie-based, 180-day expiry, SameSite=Lax. |
| `components/providers/MixpanelProvider.tsx` | Mounts in `app/layout.tsx`. Boots Mixpanel, subscribes to Supabase auth state for `identify` / `reset`, emits `user_logged_in` / `user_logged_out`. `useRef` boot guard for React strict mode. |
| `components/analytics/ClarityScript.tsx` | Conditional Clarity injection. No-op until `hasConsent()` is true. Re-checks on consent granted. |
| `components/ConsentBanner.tsx` | Minimal banner — Accept / Decline. Writes cookie, dismisses on choice. |
| `app/privacy/page.tsx` | Static page listing trackers, data collected, user rights, contact email. |
| `app/api/health/route.ts` | `GET` returns `{ ok, checks: { mongo, supabase }, duration_ms }`. `200` if all green, `503` otherwise. `dynamic = 'force-dynamic'`. |
| `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts` | Generated by `npx @sentry/wizard@latest -i nextjs`, then tuned per §7. |

### 6.2 Edited files

| Path | Change |
|---|---|
| `app/layout.tsx` | Add `<MixpanelProvider>`, `<ClarityScript />`, `<SpeedInsights />`, `<ConsentBanner />`. Verify `<Analytics />` (from `@vercel/analytics`) is mounted. |
| `next.config.ts` | Wrapped with `withSentryConfig` by wizard. |
| `app/the-crucible/actions.ts` | `trackServer(userId, 'practice_session_started', ...)` and `trackServer(userId, 'practice_session_completed', ...)` inside the server actions that create and persist sessions. Also `peopleSetServer` / `peopleIncrementServer` on completion. |
| `app/the-crucible/[chapterId]/*` (or equivalent chapter mount) | Client `track('chapter_opened', ...)` on mount. |
| Chapter hubs that mount simulators | Client `track('simulation_opened', ...)` on simulation component mount. |
| Flag modal component | `track('flag_submitted', ...)` on successful submission. |
| Supabase signup callback (wherever signup completes) | `track('user_signed_up', ...)` + `peopleSetOnce` for immutable traits. |
| `app/crucible/admin/*` write handlers / `app/api/v2/*` POST/PATCH/DELETE | `trackServer(adminUserId, 'admin_action', ...)` post-success. |
| `.env.local` and Vercel env | Add the variables listed in §9. |

### 6.3 Data flow (text diagram)

```
Client
  └─ MixpanelProvider boots → consent check → initMixpanel → identify on auth
  └─ track('chapter_opened') / track('simulation_opened') / track('flag_submitted') → Mixpanel
  └─ ClarityScript (consent-gated) → Microsoft Clarity
  └─ SpeedInsights → Vercel
  └─ Vercel Analytics → Vercel (always, cookieless)
  └─ Sentry browser SDK → captures errors + replay-on-error

Server
  └─ Supabase auth callback → track('user_signed_up')
  └─ app/the-crucible/actions.ts (session start / complete) → trackServer(...)
  └─ app/api/v2/* admin writes → trackServer(adminId, 'admin_action', ...)
  └─ app/api/health → scraped by Better Stack every 3 min
  └─ Sentry server SDK → captures exceptions + 1% transaction traces
```

### 6.4 Identity lifecycle

- Before signup / login: anonymous. Nothing fires to Mixpanel. Vercel Analytics records pageview.
- On login (or first page load while authenticated): `MixpanelProvider` calls `identify(user.id, { email_domain, ... })`.
- On `SIGNED_IN` event: `track('user_logged_in', ...)`.
- On `SIGNED_OUT` event: `track('user_logged_out', ...)` then `reset()` (wipes distinct_id, generates new anon id).
- Server-side emission always passes an explicit `userId` — server has no Supabase session available through the Mixpanel SDK.

---

## 7. Tool Configuration Details

### 7.1 Sentry config (both client and server)

```ts
// sentry.client.config.ts (same shape on server, minus replay)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.01,              // 1% — aggressive for 50k DAU fit
  replaysSessionSampleRate: 0,         // never record without an error
  replaysOnErrorSampleRate: 1.0,       // always capture when something breaks
  integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
  beforeSend(event, hint) {
    const msg = String(hint.originalException ?? '');
    if (msg.includes('ResizeObserver loop')) return null;
    if (msg.includes('NetworkError when attempting to fetch')) return null;
    if (msg.includes('Failed to fetch')) return null;          // browser offline noise
    if (msg.includes('Load failed')) return null;              // Safari fetch abort
    if (msg.includes('AbortError')) return null;               // navigation aborts
    return event;
  },
});
```

**No Sentry test route.** Use `Sentry.captureException(new Error('sentry-smoketest'))` from an admin-gated debug endpoint that stays in the codebase, rather than creating and deleting a one-shot throwing route.

### 7.2 Mixpanel wrapper shape

`lib/analytics/mixpanel.ts` exports these functions; every client function checks `hasConsent()` first; every function runs props through `sanitize()` which strips forbidden keys:

- `initMixpanel()` — client boot, idempotent via module-level flag. Calls `mixpanelBrowser.init(token, { persistence: 'localStorage', ignore_dnt: false, track_pageview: false })`.
- `identify(userId, traits)` — calls `mixpanelBrowser.identify` + `people.set`.
- `track(event, props)` — no-op if no consent or not identified (single exception: `app_loaded` boot event is **not** emitted; we removed it from the taxonomy).
- `peopleSet(traits)`, `peopleSetOnce(traits)`, `peopleIncrement(props)`, `peopleTrackCharge(amount)` (reserved for when checkout ships).
- `reset()` — on logout.
- `trackServer(userId, event, props)`, `peopleSetServer(userId, traits)`, `peopleSetOnceServer`, `peopleIncrementServer` — server variants with explicit userId. Server variants read the user's stored consent flag (§7.5) via a lightweight helper `hasServerConsent(userId)` that queries Supabase user metadata. Server events are no-ops when the user has declined consent.

### 7.3 Clarity config

Script tag only injects when `hasConsent()` is true. Project masking set to "Strict" in the Clarity dashboard (masks all text + inputs by default). Re-injection on consent change handled by the provider.

### 7.4 Better Stack monitors

1. `GET https://<prod>/` — expect 200
2. `GET https://<prod>/the-crucible` — expect 200
3. `GET https://<prod>/api/health` — expect 200 JSON with `ok: true`
4. `GET https://<prod>/crucible/admin` — expect 200 or 302 (redirect to login)

3-minute interval, email + Slack webhook alerts. No SMS / phone escalation in v1 (potentially paid; defer).

### 7.5 Consent model

- **Banner shows** on first visit where no `cookie_consent` cookie is present.
- **Accept** → cookie `cookie_consent=granted`, Mixpanel + Clarity active immediately.
- **Decline** → cookie `cookie_consent=denied`, only Vercel Analytics (cookieless) + Sentry error-tracking (legitimate interest) remain.
- **Authenticated users**: on signup or on first explicit consent choice after login, the current cookie consent value is mirrored to a `consent` field on the Supabase user's `user_metadata` (`granted` | `denied`, with a `consent_decided_at` timestamp). Server-side `trackServer` / `peopleSetServer` etc. read this field via a `hasServerConsent(userId)` helper — a single `supabase.auth.admin.getUserById` call, result cached per-request via a `React.cache`-wrapped function.
- **Withdrawal**: `/privacy` page has a "Revoke consent" button that calls `clearConsent()` on the cookie, updates Supabase `user_metadata.consent = 'denied'` (if logged in), and re-renders the banner.

---

## 8. Phased Rollout

### Phase 1 — Site health + web metrics (Day 1, ~4 hours)

Two parallel tracks, one person each:

**Track A:**
1. `npx @sentry/wizard@latest -i nextjs` — accepts all wizard defaults.
2. Tune `sentry.{client,server}.config.ts` per §7.1.
3. Add env vars to Vercel (Production + Preview): `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
4. Smoke test via admin debug endpoint; confirm event lands in Sentry within 1 minute.

**Track B:**
1. Create `app/api/health/route.ts` checking Mongo + Supabase.
2. `npm i @vercel/speed-insights`; add `<SpeedInsights />` in `app/layout.tsx`.
3. Enable Speed Insights in Vercel dashboard.
4. Sign up Better Stack, create 4 monitors per §7.4.
5. Configure Slack + email alerts.

**Phase 1 acceptance:**

- [ ] Sentry smoke test visible in Sentry within 1 min
- [ ] `/api/health` returns 200 with `ok: true`
- [ ] All 4 Better Stack monitors green
- [ ] At least one test alert delivered to Slack
- [ ] `<SpeedInsights />` mounted (data availability confirmed after 24h)
- [ ] `<Analytics />` confirmed mounted from prior `@vercel/analytics` install

### Phase 2 — Product analytics core (Days 2–3, ~1 day, sequential)

1. `npm i mixpanel-browser mixpanel`.
2. Write `lib/analytics/consent.ts`, `lib/analytics/mixpanel.ts` per §7.2 and Appendix A.
3. Write `components/providers/MixpanelProvider.tsx` per Appendix A.
4. Write `components/analytics/ClarityScript.tsx` per Appendix A (consent-gated from the start).
5. Write `components/ConsentBanner.tsx` — minimal two-button banner.
6. Write `app/privacy/page.tsx` — static content listing Mixpanel / Clarity / Sentry / Vercel trackers and user rights.
7. Mount `<MixpanelProvider>`, `<ClarityScript />`, `<ConsentBanner />` in `app/layout.tsx`.
8. Wire the 8 events:
   - `user_signed_up` in Supabase signup callback + `peopleSetOnce`.
   - `user_logged_in` / `user_logged_out` in `MixpanelProvider` auth state listener.
   - `chapter_opened` on chapter page mount.
   - `simulation_opened` on simulation component mount.
   - `practice_session_started` + `practice_session_completed` server-side in `app/the-crucible/actions.ts`, plus `peopleSetServer` / `peopleIncrementServer` on completion.
   - `flag_submitted` in flag modal.
   - `admin_action` in `app/crucible/admin/*` and `app/api/v2/*` write handlers.
9. Add env vars: `NEXT_PUBLIC_MIXPANEL_TOKEN`, `MIXPANEL_TOKEN`, `NEXT_PUBLIC_CLARITY_ID`.

**Phase 2 acceptance:**

- [ ] Fresh incognito: banner shows; Mixpanel and Clarity silent.
- [ ] Click Accept: Mixpanel and Clarity active within 1s, no page reload.
- [ ] Click Decline: only Vercel Analytics + Sentry active (confirm via network tab).
- [ ] Fresh signup → `user_signed_up` in Mixpanel with correct traits and `email_domain` (no `email`).
- [ ] Login → `user_logged_in`. Logout → `user_logged_out` + identity reset confirmed on next action.
- [ ] Complete a guided practice session → `practice_session_started` and `practice_session_completed` both land in correct order with matching `session_id`.
- [ ] Open a chapter, open a simulation, submit a flag → each event lands.
- [ ] Admin creates / edits a question → `admin_action` lands.
- [ ] Sanitizer test: fire a test event with `{ email: 'x' }` in dev → event appears with `email` stripped and a console warning.
- [ ] 24h event volume under 500k (projection fits).

### Phase 3 — Dashboards & alerts (Day 4, ~half day)

1. Mixpanel dashboard "Crucible Engagement":
   - DAU / WAU / MAU line
   - Stickiness (DAU/MAU)
   - Funnel: `chapter_opened` → `practice_session_started` → `practice_session_completed`
   - Retention cohort (weekly signup cohorts, D1/D7/D30 via `user_logged_in` or `practice_session_started`)
   - Top 10 chapters by `practice_session_completed` count this week
2. Sentry alerts:
   - Error rate > 1% over 5 minutes → Slack
   - New unhandled exception type (first occurrence) → email
   - Transaction P95 > 3s on `/api/v2/*` over 10 minutes → Slack
3. Verify Better Stack alerts from Phase 1 still delivering.

**Phase 3 acceptance:**

- [ ] Dashboard renders with at least 48h of real data
- [ ] Synthetic Sentry error → Slack within 3 min
- [ ] Synthetic event → visible in Mixpanel live view within 1 min

---

## 9. Environment Variables

Add to Vercel (Production + Preview) and `.env.local`:

```
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=
MIXPANEL_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

No `CRON_SECRET`, no `BETTERSTACK_SOURCE_TOKEN` — neither is used in this design.

---

## 10. Risks & Mitigations

| # | Risk | Likelihood | Mitigation |
|---|---|---|---|
| 1 | Sentry 5k errors/mo breached if app error rate >1% at 50k DAU | Medium | `tracesSampleRate: 0.01`; aggressive `beforeSend` filters; if breached repeatedly, drop Sentry Replay or migrate to self-hosted GlitchTip (Sentry-API-compatible, free) |
| 2 | A new event quietly breaches Mixpanel 20M cap | Medium | Hard rule: every new event requires a projected 50k-DAU volume calc in its PR description. Projections above 18M block merge. |
| 3 | Vercel Hobby limits (function invocations, bandwidth) hit before analytics matter at 50k DAU | High impact, out of scope | Flagged as a separate concern; not addressed by this plan |
| 4 | React strict mode double-fires `user_logged_in` | Medium | `useRef` boot guard in provider; manual verification in Phase 2 acceptance |
| 5 | `practice_session_completed` client-side race if fired from the client | High impact | Fired server-side from the action that persists `TestResult`; Mixpanel server SDK failure logged to Sentry but does not fail the user request |
| 6 | Consent banner missed for users who interact before accepting | Low | Banner is modal-style but dismissible via click-through; declined consent is the default — no tracking fires until explicit accept |
| 7 | Diaspora EU traffic triggers GDPR scrutiny without full consent-management-platform | Low/Medium | Banner + `/privacy` page + revoke path satisfy reasonable-effort. If any complaint arrives, upgrade to a certified CMP (deferred) |
| 8 | Server-side track failures lost silently | Low | `trackServer` catches SDK errors and calls `Sentry.captureException`; failure never blocks user-facing request |

---

## 11. Acceptance Criteria (full rollout)

- [ ] All six Phase 1 and Phase 2 acceptance items pass.
- [ ] Phase 3 dashboard live with 48h of real data.
- [ ] Total monthly recurring cost observed for 30 days: $0.
- [ ] Projected event volume at 50k DAU recomputed from real per-DAU averages, still under 18M/mo.
- [ ] No PII in the last 100 spot-checked Mixpanel events.
- [ ] `/privacy` page linked from footer.
- [ ] This spec is kept as the source of truth; the prior `docs/ANALYTICS_MASTER_PLAN.md` is either archived or deleted.

---

## 12. Explicit Deferral List

Written here so nothing is "forgotten" — each of these has a clear trigger for re-opening the work:

| Deferred | Re-open when |
|---|---|
| Monetization events (`pricing_viewed`, `checkout_*`, `subscription_*`, revenue tracking) | Checkout ships. Add in the same PR. |
| Custom MongoDB KPI dashboard (`/crucible/admin/kpis`, `kpi_daily` collection, nightly cron) | A specific product question cannot be answered in Mixpanel. |
| `question_answered` event | Mixpanel-level per-question analysis becomes necessary AND MongoDB can't serve it. Requires volume re-projection first. |
| Lecture / book content events | Lecture or book engagement is an active hypothesis under investigation. |
| Better Stack Logs, log aggregation | Vercel's built-in function logs prove insufficient for a specific incident. |
| Runbook, on-call rotation, escalation | A second person joins on-call. |
| Feature flags / A/B testing | Traffic supports stat-sig experiments (rule of thumb: ≥1k conversions per variant per week). |
| Consent banner upgrade to a certified CMP | Actual complaint or clear EU user concentration. |

---

## Appendix A — File Templates

### A.1 `lib/analytics/consent.ts`

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

### A.2 `lib/analytics/mixpanel.ts` (shape — full implementation in plan phase)

```ts
import mixpanelBrowser from 'mixpanel-browser';
import Mixpanel from 'mixpanel';
import { hasConsent } from './consent';

const PII_KEYS = ['email', 'phone', 'name', 'full_name', 'password', 'question_content', 'answer_text'];

let clientInitialized = false;
let identified = false;

function sanitize(props: Record<string, unknown> = {}) {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (PII_KEYS.includes(k.toLowerCase())) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[analytics] PII key "${k}" stripped`);
      }
      continue;
    }
    clean[k] = v;
  }
  return clean;
}

export function initMixpanel() {
  if (typeof window === 'undefined' || clientInitialized) return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;
  mixpanelBrowser.init(token, {
    persistence: 'localStorage',
    ignore_dnt: false,
    track_pageview: false,
  });
  clientInitialized = true;
}

export function identify(userId: string, traits: Record<string, unknown> = {}) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.identify(userId);
  mixpanelBrowser.people.set(sanitize(traits));
  identified = true;
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (!clientInitialized || !hasConsent() || !identified) return;
  mixpanelBrowser.track(event, sanitize(props));
}

export function peopleSetOnce(traits: Record<string, unknown>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.set_once(sanitize(traits));
}

export function peopleSet(traits: Record<string, unknown>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.set(sanitize(traits));
}

export function peopleIncrement(props: Record<string, number>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.increment(props);
}

export function reset() {
  if (!clientInitialized) return;
  mixpanelBrowser.reset();
  identified = false;
}

// Server — explicit userId because server has no session
let serverClient: ReturnType<typeof Mixpanel.init> | null = null;
function getServerClient() {
  if (serverClient) return serverClient;
  const token = process.env.MIXPANEL_TOKEN;
  if (!token) return null;
  serverClient = Mixpanel.init(token);
  return serverClient;
}

export async function trackServer(userId: string, event: string, props: Record<string, unknown> = {}) {
  const client = getServerClient();
  if (!client) return;
  return new Promise<void>((resolve) => {
    client.track(event, { distinct_id: userId, ...sanitize(props) }, (err) => {
      if (err) console.error('[mixpanel server]', err);
      resolve();
    });
  });
}

export async function peopleSetOnceServer(userId: string, traits: Record<string, unknown>) {
  const client = getServerClient();
  if (!client) return;
  return new Promise<void>((resolve) => {
    client.people.set_once(userId, sanitize(traits), (err) => {
      if (err) console.error('[mixpanel server set_once]', err);
      resolve();
    });
  });
}

export async function peopleIncrementServer(userId: string, props: Record<string, number>) {
  const client = getServerClient();
  if (!client) return;
  return new Promise<void>((resolve) => {
    client.people.increment(userId, props, (err) => {
      if (err) console.error('[mixpanel server increment]', err);
      resolve();
    });
  });
}
```

### A.3 `components/providers/MixpanelProvider.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { initMixpanel, identify, track, reset } from '@/lib/analytics/mixpanel';
import { hasConsent } from '@/lib/analytics/consent';

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    if (hasConsent()) initMixpanel();

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
        identify(session.user.id, { email_domain: session.user.email?.split('@')[1] });
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

### A.4 `components/analytics/ClarityScript.tsx`

```tsx
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { hasConsent } from '@/lib/analytics/consent';

export function ClarityScript() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasConsent());
    const onStorage = () => setConsented(hasConsent());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!id || !consented) return null;

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

### A.5 `app/api/health/route.ts`

```ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, boolean> = { mongo: false, supabase: false };
  const start = Date.now();

  try {
    const conn = await connectToDatabase();
    checks.mongo = conn.connection?.readyState === 1;
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

---

## End of Spec

Next step: once approved, this hands off to `writing-plans` to produce the implementation plan.
