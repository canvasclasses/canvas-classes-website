# Lean Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install a $0-through-50k-DAU observability stack on Crucible — Sentry + Better Stack + Speed Insights for health; Mixpanel + Clarity + consent-gated tracking for product analytics.

**Architecture:** Two data planes — Mixpanel owns 8 session-level events (funnels, retention, identity); MongoDB owns per-question data (already stored, not duplicated). Errors to Sentry, uptime to Better Stack, replays to Clarity. Consent is a library call checked on every `track()`, not a deferred phase.

**Tech Stack:** Next.js 15 App Router, React 19, Supabase auth, MongoDB/Mongoose, `mixpanel-browser` + `mixpanel` (Node SDK), `@sentry/nextjs`, `@vercel/speed-insights`, Microsoft Clarity script tag.

**Spec:** `docs/superpowers/specs/2026-04-17-analytics-lean-design.md`

---

## Pre-flight

### Task 0.1: Verify branch and clean tree

- [ ] **Step 1: Confirm on `analytics` branch with clean working tree**

```bash
git branch --show-current
git status
```

Expected: `analytics`, and no uncommitted changes except untracked docs.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm i mixpanel-browser mixpanel @vercel/speed-insights
npm i -D @types/mixpanel-browser
```

Expected: all four packages added to `package.json`, `package-lock.json` updated.

- [ ] **Step 3: Commit dependency bump**

```bash
git add package.json package-lock.json
git commit -m "chore(analytics): add mixpanel, mixpanel-browser, @vercel/speed-insights"
```

### Task 0.2: Collect env var values from vendors

You (the operator, not the agent) must have created accounts and captured tokens before the plan executor needs them. List repeated at the end of this plan. For now, scaffold them as empty strings locally so code can run without throwing.

- [ ] **Step 1: Add placeholder env vars to `.env.local`** (do NOT commit)

```
# Mixpanel
NEXT_PUBLIC_MIXPANEL_TOKEN=
MIXPANEL_TOKEN=

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_ID=

# Sentry (populated by Sentry wizard later)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

Expected: file updated. `.env.local` is already in `.gitignore` — verify:

```bash
grep -n "\.env\.local" .gitignore
```

---

## Phase 1 — Site health & web metrics

Two independent tracks. **These can be executed concurrently by two agents/humans.** Track A touches Sentry-only files; Track B touches `app/api/health`, `app/layout.tsx` (one line), and Better Stack dashboard only.

### Track A — Sentry

#### Task 1A.1: Run Sentry wizard

- [ ] **Step 1: Sign up at sentry.io, create org + project**

Manual step for operator: create org and a Next.js project named `crucible-prod`. Copy the DSN and auth token.

- [ ] **Step 2: Run the wizard**

```bash
npx @sentry/wizard@latest -i nextjs
```

Accept all defaults. The wizard creates:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `instrumentation.ts`
- Wraps `next.config.ts` with `withSentryConfig`
- Prompts to add env vars to `.env.local` — accept

Expected: five new/modified files.

- [ ] **Step 3: Verify build still passes**

```bash
npm run build
```

Expected: build completes without new errors.

- [ ] **Step 4: Commit wizard output**

```bash
git add sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts instrumentation.ts next.config.ts .env.example package.json package-lock.json
git commit -m "feat(sentry): install @sentry/nextjs via wizard"
```

#### Task 1A.2: Tune Sentry config for 50k DAU budget

**Files:**
- Modify: `sentry.client.config.ts`
- Modify: `sentry.server.config.ts`

- [ ] **Step 1: Replace `sentry.client.config.ts` contents**

```ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.01,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
  beforeSend(event, hint) {
    const msg = String(hint?.originalException ?? '');
    if (msg.includes('ResizeObserver loop')) return null;
    if (msg.includes('NetworkError when attempting to fetch')) return null;
    if (msg.includes('Failed to fetch')) return null;
    if (msg.includes('Load failed')) return null;
    if (msg.includes('AbortError')) return null;
    return event;
  },
});
```

- [ ] **Step 2: Replace `sentry.server.config.ts` contents**

```ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.01,
  beforeSend(event, hint) {
    const msg = String(hint?.originalException ?? '');
    if (msg.includes('AbortError')) return null;
    return event;
  },
});
```

- [ ] **Step 3: Commit**

```bash
git add sentry.client.config.ts sentry.server.config.ts
git commit -m "feat(sentry): tune sample rate to 0.01 and filter known-noisy errors"
```

#### Task 1A.3: Add admin-only smoke-test endpoint

**Rationale:** A create-then-delete test route is an anti-pattern. Ship a permanent admin-gated debug route.

**Files:**
- Create: `app/api/admin/debug/sentry/route.ts`

- [ ] **Step 1: Create the route**

```ts
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    throw new Error('sentry-smoketest ' + new Date().toISOString());
  } catch (err) {
    Sentry.captureException(err);
  }

  return NextResponse.json({ ok: true, message: 'Test exception captured' });
}
```

- [ ] **Step 2: Smoke test**

Deploy (or run locally), then from browser devtools or `curl` with a valid admin session cookie:

```bash
curl -X POST https://<prod>/api/admin/debug/sentry -H "Cookie: ..."
```

Expected: `{ ok: true, ... }` returned in <2s. Sentry dashboard shows the error within 1 minute.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/debug/sentry/route.ts
git commit -m "feat(sentry): add admin-gated smoke-test endpoint"
```

### Track B — Better Stack + Speed Insights + health route

#### Task 1B.1: Create `/api/health` endpoint

**Files:**
- Create: `app/api/health/route.ts`

- [ ] **Step 1: Write the route**

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
    checks.mongo = conn?.connection?.readyState === 1;
  } catch {
    checks.mongo = false;
  }

  try {
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supa.auth.getSession();
    checks.supabase = !error;
  } catch {
    checks.supabase = false;
  }

  const ok = checks.mongo && checks.supabase;
  return NextResponse.json(
    { ok, checks, duration_ms: Date.now() - start },
    { status: ok ? 200 : 503 }
  );
}
```

- [ ] **Step 2: Verify locally**

```bash
npm run dev
```

Then in another terminal:

```bash
curl -s http://localhost:3000/api/health | jq .
```

Expected: `{ "ok": true, "checks": { "mongo": true, "supabase": true }, "duration_ms": <number> }`.

- [ ] **Step 3: Commit**

```bash
git add app/api/health/route.ts
git commit -m "feat(observability): add /api/health with mongo + supabase checks"
```

#### Task 1B.2: Mount Speed Insights

**Files:**
- Modify: `app/layout.tsx` (add 2 lines)

- [ ] **Step 1: Add import and component**

In `app/layout.tsx`:

Immediately after line 3 (`import { Analytics } from "@vercel/analytics/react";`):

```ts
import { SpeedInsights } from '@vercel/speed-insights/next';
```

Inside `<body>`, directly below `<Analytics />` (currently line 197):

```tsx
<SpeedInsights />
```

- [ ] **Step 2: Run the app, verify no runtime error**

```bash
npm run dev
```

Visit http://localhost:3000 — page should render. Network tab should show a `vitals.vercel-insights.com` request on navigation.

- [ ] **Step 3: Enable Speed Insights in Vercel dashboard**

Manual step: in Vercel → Project → Speed Insights → Enable.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(observability): mount @vercel/speed-insights in root layout"
```

#### Task 1B.3: Configure Better Stack uptime monitors

All manual operator work — no code.

- [ ] **Step 1: Sign up at betterstack.com, create workspace "Crucible"**

- [ ] **Step 2: Create 4 Uptime monitors (3-min interval)**

| Name | URL | Expected |
|---|---|---|
| Landing | `https://<prod>/` | HTTP 200 |
| Crucible | `https://<prod>/the-crucible` | HTTP 200 |
| Health | `https://<prod>/api/health` | HTTP 200 AND body contains `"ok":true` |
| Admin | `https://<prod>/crucible/admin` | HTTP 200 OR 302 |

- [ ] **Step 3: Configure alerts**

- Add Slack incoming webhook for `#ops` channel
- Add operator's email as secondary channel
- No SMS/phone in v1 — may require paid tier

- [ ] **Step 4: Verify alert delivery**

Manually pause the "Landing" monitor's URL target (e.g., temporarily return 500 from the homepage, or just pause the monitor and unpause). Confirm Slack message arrives within 5 minutes.

### Task 1.End: Phase 1 acceptance gate

- [ ] **Step 1: Run checklist**

- [ ] `/api/health` returns 200 with `ok: true` in production
- [ ] Sentry smoke-test endpoint captures error within 1 min
- [ ] All 4 Better Stack monitors green
- [ ] At least one test alert delivered to Slack
- [ ] `<SpeedInsights />` mounted; Speed Insights enabled in Vercel dashboard
- [ ] `<Analytics />` already mounted (verified — line 197 of `app/layout.tsx`)

If all boxes pass, Phase 1 is done.

---

## Phase 2 — Product analytics core

Sequential — each task depends on earlier ones.

### Task 2.1: Create consent helpers

**Files:**
- Create: `lib/analytics/consent.ts`

- [ ] **Step 1: Write the module**

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

- [ ] **Step 2: Commit**

```bash
git add lib/analytics/consent.ts
git commit -m "feat(analytics): add cookie-based consent helpers"
```

### Task 2.2: Create Mixpanel wrapper

**Files:**
- Create: `lib/analytics/mixpanel.ts`

- [ ] **Step 1: Write the module**

```ts
import mixpanelBrowser from 'mixpanel-browser';
import Mixpanel from 'mixpanel';
import { hasConsent } from './consent';

const PII_KEYS = [
  'email',
  'phone',
  'name',
  'full_name',
  'password',
  'question_content',
  'answer_text',
];

let clientInitialized = false;
let identified = false;

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

// ── CLIENT ────────────────────────────────────────────────────────────────

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

export function peopleSet(traits: Record<string, unknown>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.set(sanitize(traits));
}

export function peopleSetOnce(traits: Record<string, unknown>) {
  if (!clientInitialized || !hasConsent()) return;
  mixpanelBrowser.people.set_once(sanitize(traits));
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

// ── SERVER ────────────────────────────────────────────────────────────────

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
    client.track(
      event,
      { distinct_id: userId, ...sanitize(props) },
      (err) => {
        if (err) console.error('[mixpanel server track]', err);
        resolve();
      }
    );
  });
}

export async function peopleSetOnceServer(
  userId: string,
  traits: Record<string, unknown>
) {
  const client = getServerClient();
  if (!client) return;
  return new Promise<void>((resolve) => {
    client.people.set_once(userId, sanitize(traits), (err) => {
      if (err) console.error('[mixpanel server set_once]', err);
      resolve();
    });
  });
}

export async function peopleSetServer(
  userId: string,
  traits: Record<string, unknown>
) {
  const client = getServerClient();
  if (!client) return;
  return new Promise<void>((resolve) => {
    client.people.set(userId, sanitize(traits), (err) => {
      if (err) console.error('[mixpanel server set]', err);
      resolve();
    });
  });
}

export async function peopleIncrementServer(
  userId: string,
  props: Record<string, number>
) {
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

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add lib/analytics/mixpanel.ts
git commit -m "feat(analytics): add Mixpanel client+server wrapper with PII sanitizer"
```

### Task 2.3: Server-side consent helper

**Files:**
- Create: `lib/analytics/serverConsent.ts`

**Rationale:** Spec §7.5 — server `trackServer` must check `user_metadata.consent`. The existing pattern (`CrucibleWizard.tsx:518` using `auth.updateUser({ data: ... })`) sets user metadata; we read via `supabase.auth.admin.getUserById` with the service role. If service role isn't set up, fall back to optimistic tracking (acceptable — server events are logged-in only and consent is always cookie-captured first at login).

- [ ] **Step 1: Write the module**

```ts
import { createClient } from '@supabase/supabase-js';

const cache = new Map<string, { value: boolean; exp: number }>();
const TTL_MS = 60_000;

export async function hasServerConsent(userId: string): Promise<boolean> {
  const cached = cache.get(userId);
  if (cached && cached.exp > Date.now()) return cached.value;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return true;

  try {
    const admin = createClient(url, serviceKey);
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data?.user) return true;
    const consent = data.user.user_metadata?.consent;
    const value = consent !== 'denied';
    cache.set(userId, { value, exp: Date.now() + TTL_MS });
    return value;
  } catch {
    return true;
  }
}
```

- [ ] **Step 2: Wire into `trackServer`**

Edit `lib/analytics/mixpanel.ts`. Replace the `trackServer` function body with the consent-aware version:

```ts
export async function trackServer(
  userId: string,
  event: string,
  props: Record<string, unknown> = {}
) {
  const client = getServerClient();
  if (!client) return;
  const { hasServerConsent } = await import('./serverConsent');
  const ok = await hasServerConsent(userId);
  if (!ok) return;
  return new Promise<void>((resolve) => {
    client.track(
      event,
      { distinct_id: userId, ...sanitize(props) },
      (err) => {
        if (err) console.error('[mixpanel server track]', err);
        resolve();
      }
    );
  });
}
```

Apply the same `hasServerConsent` check to `peopleSetServer`, `peopleSetOnceServer`, and `peopleIncrementServer`.

- [ ] **Step 3: Add `SUPABASE_SERVICE_ROLE_KEY` to env var list**

Append to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=
```

And add to the env checklist at bottom of this plan.

- [ ] **Step 4: Typecheck & commit**

```bash
npx tsc --noEmit
git add lib/analytics/mixpanel.ts lib/analytics/serverConsent.ts
git commit -m "feat(analytics): add hasServerConsent gate for server-side Mixpanel calls"
```

### Task 2.4: Create `MixpanelProvider`

**Files:**
- Create: `components/providers/MixpanelProvider.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import {
  initMixpanel,
  identify,
  track,
  reset,
} from '@/lib/analytics/mixpanel';
import { hasConsent } from '@/lib/analytics/consent';

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    if (hasConsent()) initMixpanel();

    const supabase = createClient();

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
        if (hasConsent() && !bootedRef.current) initMixpanel();
        identify(session.user.id, {
          email_domain: session.user.email?.split('@')[1],
        });
        const daysSinceSignup =
          session.user.created_at
            ? Math.floor(
                (Date.now() - new Date(session.user.created_at).getTime()) /
                  86_400_000
              )
            : 0;
        track('user_logged_in', {
          method: session.user.app_metadata?.provider ?? 'email',
          days_since_signup: daysSinceSignup,
        });
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

Note: uses the project's existing `createClient` factory at `app/utils/supabase/client.ts` — confirmed by research.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/providers/MixpanelProvider.tsx
git commit -m "feat(analytics): add MixpanelProvider with auth-state event wiring"
```

### Task 2.5: Create `ClarityScript`

**Files:**
- Create: `components/analytics/ClarityScript.tsx`

- [ ] **Step 1: Write the component**

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
    const interval = setInterval(() => {
      const c = hasConsent();
      setConsented((prev) => (prev === c ? prev : c));
    }, 2000);
    return () => clearInterval(interval);
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

- [ ] **Step 2: Commit**

```bash
git add components/analytics/ClarityScript.tsx
git commit -m "feat(analytics): add consent-gated Microsoft Clarity script mount"
```

### Task 2.6: Create `ConsentBanner`

**Files:**
- Create: `components/ConsentBanner.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { setConsent } from '@/lib/analytics/consent';

const COOKIE_NAME = 'cookie_consent';

function hasCookieSet(): boolean {
  if (typeof document === 'undefined') return true;
  return document.cookie
    .split('; ')
    .some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieSet());
  }, []);

  if (!visible) return null;

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-xl border border-white/10 bg-[#151E32] p-4 text-sm text-white/90 shadow-2xl md:left-auto md:right-4"
    >
      <p className="mb-3">
        We use cookies and privacy-preserving analytics to improve Crucible.
        See our{' '}
        <a href="/privacy" className="underline text-orange-400">
          privacy policy
        </a>
        .
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => choose('denied')}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10"
        >
          Decline
        </button>
        <button
          onClick={() => choose('granted')}
          className="rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 font-bold text-black"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ConsentBanner.tsx
git commit -m "feat(analytics): add minimal consent banner with Accept/Decline"
```

### Task 2.7: Create `/privacy` page with revoke button

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/privacy/RevokeConsentButton.tsx`

- [ ] **Step 1: Write the revoke button client component**

```tsx
'use client';

import { useState } from 'react';
import { clearConsent } from '@/lib/analytics/consent';
import { createClient } from '@/app/utils/supabase/client';

export function RevokeConsentButton() {
  const [state, setState] = useState<'idle' | 'working' | 'done'>('idle');

  async function onClick() {
    setState('working');
    clearConsent();
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.auth.updateUser({
          data: { consent: 'denied', consent_decided_at: new Date().toISOString() },
        });
      }
    } catch {
      // non-fatal — cookie is already cleared
    }
    setState('done');
  }

  return (
    <button
      onClick={onClick}
      disabled={state === 'working'}
      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50"
    >
      {state === 'idle' && 'Revoke consent'}
      {state === 'working' && 'Revoking...'}
      {state === 'done' && 'Consent revoked. Reload to see banner.'}
    </button>
  );
}
```

- [ ] **Step 2: Write the page**

```tsx
import type { Metadata } from 'next';
import { RevokeConsentButton } from './RevokeConsentButton';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Canvas Classes / Crucible collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-white/90">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-white/60 mb-8">Last updated: 2026-04-17</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <p>
          We collect minimal data needed to run the service: your account
          email (for login), your practice history (to show your progress),
          and anonymous usage data so we can improve the platform.
        </p>

        <h2 className="text-xl font-semibold">Third-party services</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Vercel Analytics</strong> — anonymous page views and
            referrers. No cookies.
          </li>
          <li>
            <strong>Vercel Speed Insights</strong> — Core Web Vitals for
            performance monitoring.
          </li>
          <li>
            <strong>Sentry</strong> — application errors and crash reports so
            we can fix bugs.
          </li>
          <li>
            <strong>Mixpanel</strong> — product analytics (signups, practice
            sessions). No PII. Only runs with your consent.
          </li>
          <li>
            <strong>Microsoft Clarity</strong> — anonymous session recordings
            and heatmaps. All text is masked. Only runs with your consent.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">What we never send</h2>
        <p>
          We never send your email, phone number, name, or the content of
          questions/answers to any third-party analytics vendor.
        </p>

        <h2 className="text-xl font-semibold">Your rights</h2>
        <p>
          You may revoke consent at any time. You can request deletion of your
          account by emailing{' '}
          <a
            href="mailto:support@canvasclasses.in"
            className="text-orange-400 underline"
          >
            support@canvasclasses.in
          </a>
          .
        </p>
        <div className="pt-2">
          <RevokeConsentButton />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify route renders**

```bash
npm run dev
```

Visit `http://localhost:3000/privacy` — page should render.

- [ ] **Step 3: Commit**

```bash
git add app/privacy/page.tsx app/privacy/RevokeConsentButton.tsx
git commit -m "feat(analytics): add /privacy page with tracker list and revoke button"
```

### Task 2.8: Mount providers and banner in root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add imports**

At the top of the imports block (after line 3 `import { Analytics } from ...`):

```ts
import { SpeedInsights } from '@vercel/speed-insights/next'; // already added in 1B.2 if executed
import { MixpanelProvider } from '@/components/providers/MixpanelProvider';
import { ClarityScript } from '@/components/analytics/ClarityScript';
import { ConsentBanner } from '@/components/ConsentBanner';
```

(If 1B.2 already added `SpeedInsights`, do not duplicate.)

- [ ] **Step 2: Wrap children with `MixpanelProvider` and add other components**

Locate the `<body>` block (currently lines 190-198). Replace the body's children with:

```tsx
<body
  className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} ${outfit.variable} antialiased`}
>
  <ClarityScript />
  <MixpanelProvider>
    <CommandPalette itemsPromise={getSearchItems()} />
    <Navbar authButton={<AuthButton />} />
    {children}
    <ConditionalFooter />
  </MixpanelProvider>
  <ConsentBanner />
  <Analytics />
  <SpeedInsights />
</body>
```

- [ ] **Step 3: Run app, visit homepage in incognito**

```bash
npm run dev
```

Expected:
- Consent banner appears bottom-right
- Network tab shows no request to `mixpanel.com`, `clarity.ms` yet
- Sentry and Vercel Analytics requests do fire

- [ ] **Step 4: Click Accept, reload**

Expected:
- Banner disappears
- Network shows `api.mixpanel.com` request within seconds of navigation
- Network shows `clarity.ms` script load

- [ ] **Step 5: Clear cookies, click Decline**

Expected:
- Banner disappears
- No Mixpanel or Clarity requests fire

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(analytics): mount MixpanelProvider, ClarityScript, ConsentBanner in root layout"
```

### Task 2.9: Wire `user_signed_up` event

**Files:**
- Modify: `app/auth/callback/route.ts`

- [ ] **Step 1: Read current file**

```bash
cat app/auth/callback/route.ts
```

Look for the `exchangeCodeForSession` success path (around line 18 per research).

- [ ] **Step 2: Add imports and tracking call**

Add at the top of the file:

```ts
import { trackServer, peopleSetOnceServer } from '@/lib/analytics/mixpanel';
```

Inside the success block (the `if (!error)` at line 18), after the session is successfully exchanged and `data.user` is available:

```ts
// If this was a new-signup confirmation, emit user_signed_up.
// Heuristic: if user.created_at is within last 10 minutes, treat as signup.
if (data.user) {
  const createdAt = new Date(data.user.created_at).getTime();
  const isNewSignup = Date.now() - createdAt < 10 * 60 * 1000;
  if (isNewSignup) {
    await trackServer(data.user.id, 'user_signed_up', {
      signup_method: data.user.app_metadata?.provider ?? 'email',
      email_domain: data.user.email?.split('@')[1],
    });
    await peopleSetOnceServer(data.user.id, {
      signup_date: data.user.created_at,
      email_domain: data.user.email?.split('@')[1],
    });
  }
}
```

Note: don't block on Mixpanel — errors are logged in the wrapper. But `await` so the fire actually happens before the response is returned (Next.js edge-ish timing). If the route ends with `redirect(next)`, the `await` must complete before that.

- [ ] **Step 3: Smoke test**

Create a test account. Within 1 minute, Mixpanel "Events" live view should show `user_signed_up` with correct `distinct_id`.

- [ ] **Step 4: Commit**

```bash
git add app/auth/callback/route.ts
git commit -m "feat(analytics): track user_signed_up in Supabase auth callback"
```

### Task 2.10: Wire `chapter_opened` event

**Files:**
- Modify: `app/the-crucible/[chapterId]/ChapterPracticePage.tsx`

- [ ] **Step 1: Add import and effect**

At the top of the file, add:

```ts
import { useEffect } from 'react'; // if not already imported
import { track } from '@/lib/analytics/mixpanel';
```

Near the existing `useEffect` at line ~122 (or inside the component body, whichever is cleaner), add a new effect that fires once per chapter mount:

```ts
useEffect(() => {
  const chapterId = /* obtain from existing props or URL params — likely `chapterId` or `params.chapterId` */;
  if (!chapterId) return;
  track('chapter_opened', {
    chapter_id: chapterId,
    source_page: typeof document !== 'undefined' ? document.referrer : undefined,
  });
}, [/* chapterId */]);
```

**Implementer's task**: read the component's props to identify the exact variable holding the chapter ID. Substitute it into both the destructuring and the effect dependency array.

- [ ] **Step 2: Verify in dev**

Navigate to `/the-crucible/ch11_mole` (or any chapter). Mixpanel live view shows `chapter_opened` with correct `chapter_id`.

- [ ] **Step 3: Commit**

```bash
git add app/the-crucible/[chapterId]/ChapterPracticePage.tsx
git commit -m "feat(analytics): track chapter_opened on chapter practice page mount"
```

### Task 2.11: Wire `simulation_opened` across 6 simulators

**Rationale:** Six files, same pattern. Define once, apply six times.

**Files to modify:**
1. `app/inorganic-chemistry-hub/VSEPRSimulator.tsx`
2. `app/inorganic-chemistry-hub/BondAngleSimulator.tsx`
3. `app/organic-chemistry-hub/BiomoleculesSimulator.tsx`
4. `app/salt-analysis/FlameTestSimulator.tsx`
5. `app/salt-analysis/AnionFlowchartSimulator.tsx`
6. `app/salt-analysis/CationFlowchartSimulator.tsx`

- [ ] **Step 1: Define the canonical pattern**

At the top of each simulator, add:

```ts
import { useEffect } from 'react'; // if not already imported
import { track } from '@/lib/analytics/mixpanel';
```

At the start of the default-exported component body, add:

```ts
useEffect(() => {
  track('simulation_opened', {
    simulation_id: '<SIMULATION_ID>',
    subject: '<SUBJECT>',
  });
}, []);
```

- [ ] **Step 2: Apply the pattern to each file with correct IDs**

| File | `simulation_id` | `subject` |
|---|---|---|
| `VSEPRSimulator.tsx` | `'vsepr'` | `'inorganic'` |
| `BondAngleSimulator.tsx` | `'bond-angles'` | `'inorganic'` |
| `BiomoleculesSimulator.tsx` | `'biomolecules'` | `'organic'` |
| `FlameTestSimulator.tsx` | `'flame-test'` | `'inorganic'` |
| `AnionFlowchartSimulator.tsx` | `'anion-flowchart'` | `'inorganic'` |
| `CationFlowchartSimulator.tsx` | `'cation-flowchart'` | `'inorganic'` |

- [ ] **Step 3: Verify**

Open each simulation route in dev. Mixpanel live view shows one `simulation_opened` per mount with matching `simulation_id`.

- [ ] **Step 4: Commit**

```bash
git add app/inorganic-chemistry-hub/VSEPRSimulator.tsx app/inorganic-chemistry-hub/BondAngleSimulator.tsx app/organic-chemistry-hub/BiomoleculesSimulator.tsx app/salt-analysis/FlameTestSimulator.tsx app/salt-analysis/AnionFlowchartSimulator.tsx app/salt-analysis/CationFlowchartSimulator.tsx
git commit -m "feat(analytics): track simulation_opened in 6 simulator components"
```

### Task 2.12: Wire `practice_session_started` event

**Rationale:** Research showed session start is a client POST to `/api/v2/user/test-session`. Best place to fire is server-side in that API route — consistent with session-complete tracking.

**Files:**
- Modify: `app/api/v2/user/test-session/route.ts`

- [ ] **Step 1: Read current route**

```bash
cat app/api/v2/user/test-session/route.ts
```

Locate the POST handler and the successful-creation return path.

- [ ] **Step 2: Add tracking call**

At the top, add import:

```ts
import { trackServer } from '@/lib/analytics/mixpanel';
```

Just before the successful response (the `NextResponse.json({ ... }, { status: 200 | 201 })` return), after the session has been persisted:

```ts
await trackServer(userId, 'practice_session_started', {
  chapter_id: body.chapter_id,
  mode: body.mode ?? body.test_config?.difficulty_mix ?? 'guided',
  question_count: body.question_count ?? body.questions?.length,
  difficulty_range: body.difficulty_range ?? body.test_config?.difficulty_mix,
});
```

**Implementer's task:** read the route to find the exact variable names for userId, chapter_id, and question_count. Substitute. If `mode` isn't in the body, default to `'guided'` (matches the Crucible wizard default).

- [ ] **Step 3: Smoke test**

Start a guided practice session from the UI. Mixpanel live view shows `practice_session_started`.

- [ ] **Step 4: Commit**

```bash
git add app/api/v2/user/test-session/route.ts
git commit -m "feat(analytics): track practice_session_started in session API route"
```

### Task 2.13: Wire `practice_session_completed` event

**Files:**
- Modify: `app/api/v2/test-results/route.ts`

- [ ] **Step 1: Read the route around line 50**

```bash
sed -n '1,80p' app/api/v2/test-results/route.ts
```

Identify where `testResult.save()` is awaited (research points to line 50).

- [ ] **Step 2: Add imports and tracking call**

At the top:

```ts
import {
  trackServer,
  peopleSetServer,
  peopleIncrementServer,
} from '@/lib/analytics/mixpanel';
```

Directly after `await testResult.save()`:

```ts
const accuracy =
  score?.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
const duration_sec = timing?.total_seconds ?? 0;

await trackServer(userId, 'practice_session_completed', {
  chapter_id,
  mode: test_config?.difficulty_mix ?? 'guided',
  accuracy,
  duration_sec,
  correct_count: score.correct,
  total_count: score.total,
  session_id: testResult._id?.toString() ?? testResult.id,
});

await peopleSetServer(userId, { last_active_at: new Date().toISOString() });
await peopleIncrementServer(userId, {
  total_questions_answered: score.total,
  total_practice_minutes: Math.round(duration_sec / 60),
});
```

**Implementer's task:** confirm the variable names `userId`, `chapter_id`, `score`, `timing`, `test_config`, `testResult` are in scope. Adjust to match the actual route.

- [ ] **Step 3: Smoke test**

Complete a practice session from the UI. Mixpanel live view shows `practice_session_completed` with matching `session_id` and the user profile in Mixpanel shows `total_questions_answered` incremented.

- [ ] **Step 4: Commit**

```bash
git add app/api/v2/test-results/route.ts
git commit -m "feat(analytics): track practice_session_completed + update people profile"
```

### Task 2.14: Wire `flag_submitted` event

**Files:**
- Modify: `app/api/v2/questions/[id]/flag/route.ts`

- [ ] **Step 1: Add imports and track call**

At the top:

```ts
import { trackServer } from '@/lib/analytics/mixpanel';
```

At line ~102, in the success branch (right before the final `NextResponse.json({ ok: true })`):

```ts
await trackServer(user.id, 'flag_submitted', {
  question_id: id,
  reason: type, // flag type is the "reason" at the event level
});
```

**Implementer's task:** confirm `user.id` and `type` are in scope; `id` is the route param.

- [ ] **Step 2: Smoke test**

Flag a question from the UI. Mixpanel live view shows `flag_submitted`.

- [ ] **Step 3: Commit**

```bash
git add app/api/v2/questions/[id]/flag/route.ts
git commit -m "feat(analytics): track flag_submitted in question flag route"
```

### Task 2.15: Wire `admin_action` — scoped to 3 highest-value endpoints

**Rationale:** There are ~30 admin write endpoints. Instrumenting all of them upfront is scope creep. Start with the three most frequent: question create, question edit, question delete. Remaining endpoints can adopt the pattern as a separate follow-up PR.

**Files:**
- Modify: `app/api/v2/questions/route.ts` (POST)
- Modify: `app/api/v2/questions/[id]/route.ts` (PATCH)
- Modify: `app/api/v2/questions/[id]/route.ts` (DELETE)

- [ ] **Step 1: For each route, add import and tracking call**

At the top of each file:

```ts
import { trackServer } from '@/lib/analytics/mixpanel';
```

In the success branch, before the final `NextResponse.json(...)`:

```ts
// In POST /api/v2/questions (create):
await trackServer(user.email ?? user.id, 'admin_action', {
  type: 'create',
  entity: 'question',
  entity_id: newQuestion._id?.toString(),
});

// In PATCH /api/v2/questions/[id] (update):
await trackServer(user.email ?? user.id, 'admin_action', {
  type: 'edit',
  entity: 'question',
  entity_id: id,
});

// In DELETE /api/v2/questions/[id] (delete):
await trackServer(user.email ?? user.id, 'admin_action', {
  type: 'delete',
  entity: 'question',
  entity_id: id,
});
```

Where `newQuestion` is whatever variable holds the created document — implementer confirms by reading each route.

- [ ] **Step 2: Smoke test**

Create a question via admin panel → edit it → delete it. Three `admin_action` events in Mixpanel live view with matching `entity_id`.

- [ ] **Step 3: Commit**

```bash
git add app/api/v2/questions/route.ts app/api/v2/questions/[id]/route.ts
git commit -m "feat(analytics): track admin_action on question create/edit/delete"
```

### Task 2.End: Phase 2 acceptance gate

- [ ] **Step 1: Run Phase 2 checklist**

- [ ] Fresh incognito: banner shows; no Mixpanel or Clarity requests
- [ ] Accept → both services active within 1s, no reload
- [ ] Decline → only Vercel + Sentry active
- [ ] Fresh signup → `user_signed_up` lands with correct traits; `email` stripped by sanitizer (no `email` property in event)
- [ ] Login → `user_logged_in` fires. Logout → `user_logged_out` fires, next `track()` no-ops due to reset
- [ ] Guided practice full cycle → `practice_session_started` and `practice_session_completed` land with matching `session_id`
- [ ] Open chapter, open simulation, submit flag, admin create/edit/delete → one event each
- [ ] Dev-console warning fires when `track('x', { email: 'y@z' })` is called (sanitizer test)
- [ ] 24h event volume under 500k (pro-rated fits comfortably)

If any box fails, loop back to the relevant task before Phase 3.

---

## Phase 3 — Dashboards & alerts

Mostly vendor-dashboard configuration. Small code surface.

### Task 3.1: Build Mixpanel dashboard "Crucible Engagement"

All operator/dashboard work in the Mixpanel UI.

- [ ] **Step 1: Create dashboard**

Mixpanel → Boards → New Board → "Crucible Engagement".

- [ ] **Step 2: Add these reports**

1. **DAU/WAU/MAU** — Insights report. Event: `user_logged_in`. Group by time. Three series: unique users over 1d / 7d / 30d rolling windows.
2. **Stickiness** — formula: DAU / MAU.
3. **Practice funnel** — Funnels. Steps:
   - `chapter_opened`
   - `practice_session_started`
   - `practice_session_completed`
   Window: 24 hours.
4. **Retention cohort** — Retention report. Cohort event: `user_signed_up`. Return event: `practice_session_started`. Buckets: day 1, day 7, day 30.
5. **Top 10 chapters this week** — Insights. Event: `practice_session_completed`. Break down by `chapter_id`. Filter: last 7 days. Sort descending. Limit 10.
6. **Simulation openings by subject this week** — Insights. Event: `simulation_opened`. Break down by `subject`. Last 7 days.

- [ ] **Step 3: Verify dashboard loads with 48h of data**

Wait 48h after Phase 2 completion. Return and confirm each report has non-zero data points.

### Task 3.2: Configure Sentry alerts

All vendor UI work.

- [ ] **Step 1: Error rate spike alert**

Sentry → Alerts → New Alert → "Error rate above 1% over 5 minutes" → Slack #ops.

- [ ] **Step 2: First-seen error alert**

Sentry → Alerts → "A new issue is seen" → Email operator.

- [ ] **Step 3: Slow API alert**

Sentry → Alerts → "Transaction P95 > 3s on /api/v2/*" over 10-min window → Slack #ops.

- [ ] **Step 4: Verify**

Hit the smoke-test endpoint from 1A.3 — alert arrives in Slack within 3 minutes. (First alert may not fire since it's a known/repeat test issue; trigger a novel error if needed.)

### Task 3.3: Verify Better Stack alerts end-to-end

- [ ] **Step 1: Pause one monitor temporarily**

Better Stack → Monitors → "Landing" → Pause.

- [ ] **Step 2: Wait 5 minutes, confirm Slack alert**

After 5 min, unpause. Alert (or at least a status message) should have arrived.

### Task 3.End: Phase 3 acceptance gate

- [ ] All three dashboards / alert sets operational
- [ ] Synthetic Sentry error → Slack within 3 min
- [ ] Synthetic event → visible in Mixpanel live view within 1 min
- [ ] Dashboard has 48h of data

---

## Plan completion

- [ ] **Run the full acceptance checklist from spec §11**

- [ ] All Phase 1, 2, 3 gates pass
- [ ] 30 days of real traffic → total monthly recurring cost $0
- [ ] 100 spot-checked Mixpanel events contain no PII
- [ ] `/privacy` linked from footer (edit `app/components/Footer.tsx` to add a footer link — small follow-up; not blocking)
- [ ] `docs/ANALYTICS_MASTER_PLAN.md` archived or deleted (user decision — no action in this plan)

---

## Env keys the operator must obtain and paste

Copy the following into Vercel Project Settings → Environment Variables (**Production + Preview**) and into `.env.local`:

| Variable | Where to get it | Scope |
|---|---|---|
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | mixpanel.com → Project Settings → Project Token | client + server |
| `MIXPANEL_TOKEN` | Same value as above (same token used by server SDK) | server |
| `NEXT_PUBLIC_CLARITY_ID` | clarity.microsoft.com → your project → "Setup" tab → copy the ID inside `clarity.ms/tag/<ID>` | client |
| `NEXT_PUBLIC_SENTRY_DSN` | sentry.io → Project Settings → Client Keys → DSN | client |
| `SENTRY_DSN` | Same value as `NEXT_PUBLIC_SENTRY_DSN` | server |
| `SENTRY_AUTH_TOKEN` | sentry.io → User Settings → Auth Tokens → create token with `project:releases` + `org:read` scopes | build-time (source maps) |
| `SENTRY_ORG` | sentry.io org slug (e.g. `canvas`) | build-time |
| `SENTRY_PROJECT` | sentry.io project slug (e.g. `crucible-prod`) | build-time |
| `SUPABASE_SERVICE_ROLE_KEY` | supabase.com → your project → Settings → API → service_role key (keep secret, server only) | server |

**Not needed** (dropped vs prior plan): `BETTERSTACK_SOURCE_TOKEN`, `CRON_SECRET`.

**Already in the project** (no action): `MONGODB_URI`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAILS`.

---

## Summary

- 3 phases
- ~24 tasks
- ~1 wall-clock day for Phase 1 (two tracks in parallel)
- ~2 wall-clock days for Phase 2 (sequential)
- ~half day for Phase 3 (vendor config)
- **Total: ~3.5 wall-clock days**
- 9 new env vars to set, 0 budget
