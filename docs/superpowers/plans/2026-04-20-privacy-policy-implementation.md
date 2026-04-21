# Privacy Policy & Terms Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing cookie banner with a signup-checkbox consent model, add formal Privacy Policy and Terms & Conditions pages, persist a minimal per-user consent record in Supabase user metadata, and surface a soft re-consent modal for any user whose stored versions are stale.

**Architecture:** A single source-of-truth file (`lib/legal/versions.ts`) holds the current policy versions. Consent is captured as three keys inside `auth.users.raw_user_meta_data` (`privacy_version`, `terms_version`, `consent_accepted_at`). A client-side `ConsentGate` mounted in the root layout compares stored versions against the current constants on every authenticated page and renders a blocking modal when they mismatch. The two documents live at `/privacy` and `/terms` as plain Next.js server components.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase Auth.

**Testing strategy:** This project has no automated test suite (per `CLAUDE.md`). Each task ends with a manual verification block (dev server + browser + Supabase dashboard checks) instead of a test run.

**Commits:** The product owner commits to git personally. Each task ends with a **"Commit point"** marker — stop there and let them review/commit before starting the next task. Do not run `git commit`, `git add`, or any mutating git command.

**Open legal items (fill in during Task 2 / Task 3):** The product owner must supply:
- Grievance Officer name and designation (default email: `support@canvasclasses.in`).
- Registered city for the governing-law clause.
- Retention windows for practice history and telemetry.

The code paths below use the literal strings `__GRIEVANCE_OFFICER_NAME__`, `__REGISTERED_CITY__`, and `__RETENTION_WINDOWS__` as fill-in markers that an engineer can grep for.

---

## File structure

### Create

| Path | Responsibility |
|---|---|
| `lib/legal/versions.ts` | Exported constants `PRIVACY_VERSION`, `TERMS_VERSION`, `LAST_UPDATED`. Single source of truth. |
| `app/terms/page.tsx` | Terms & Conditions document page. |
| `components/legal/ConsentGate.tsx` | Client component. Reads session metadata, compares to current versions, renders modal when stale. Mounted once in root layout. |
| `components/legal/ConsentRefreshModal.tsx` | Client component. Full-screen blocking modal rendered by `ConsentGate`. |
| `components/legal/acceptConsent.ts` | Server action that writes the three metadata keys to the calling user. |
| `app/account/page.tsx` | Authenticated page showing the user's consent record and an email-based deletion request link. |

### Modify

| Path | Change |
|---|---|
| `app/privacy/page.tsx` | Replace body with the formal Privacy Policy; remove `<RevokeConsentButton />`; import `LAST_UPDATED` from the version file. |
| `app/login/page.tsx` | Render a required consent checkbox when `isLogin === false`; disable submit and Google buttons until checked; include the three metadata keys in `supabase.auth.signUp`; redirect Google button to `/api/auth/google-direct/start?consent=1&...`. |
| `app/api/auth/google-direct/start/route.ts` | Read optional `consent` query param; embed `consent: true` inside the OAuth `state` JSON. |
| `app/api/auth/google-direct/callback/route.ts` | After `signInWithIdToken`, if `state.consent` is true, call `supabase.auth.updateUser` with the three metadata keys. |
| `app/layout.tsx` | Remove `<ConsentBanner />` import and JSX; add `<ConsentGate />` in its place. |
| `app/components/Footer.tsx` | Add two inline links (`Privacy Policy`, `Terms & Conditions`) next to the copyright line. |

### Delete

| Path | Reason |
|---|---|
| `components/ConsentBanner.tsx` | Banner removed entirely. |
| `app/privacy/RevokeConsentButton.tsx` | Revoke-consent flow does not exist in the new model. |
| `lib/analytics/consent.ts` | Cookie-based helpers unused after banner removal. Verify no remaining importers before deletion. |

---

## Task 1: Version constants and source-of-truth file

**Files:**
- Create: `lib/legal/versions.ts`

- [ ] **Step 1: Create the version constants file**

Create `lib/legal/versions.ts` with exactly this content:

```ts
/**
 * Legal document versions. Bumping either version string causes every user
 * with a stale stored version to see the re-consent modal on their next
 * authenticated page load. See docs/superpowers/specs/2026-04-20-privacy-policy-design.md
 * section 7.4 for the full update workflow.
 *
 * Remember to review Section 6 ("Sub-processors") of the Privacy Policy
 * whenever a new vendor is added or removed from the analytics stack.
 */
export const PRIVACY_VERSION = '1.0';
export const TERMS_VERSION = '1.0';
export const LAST_UPDATED = '2026-04-20';
```

- [ ] **Step 2: Verify type-check passes**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit point**

Stop. Diff: one new file. Let the product owner review and commit. Do not run `git commit`.

---

## Task 2: Privacy Policy page rewrite

**Files:**
- Modify: `app/privacy/page.tsx`
- Delete: `app/privacy/RevokeConsentButton.tsx`

- [ ] **Step 1: Delete the revoke-consent button file**

Delete `app/privacy/RevokeConsentButton.tsx` from the filesystem.

- [ ] **Step 2: Rewrite the Privacy Policy page**

Replace the entire contents of `app/privacy/page.tsx` with the formal policy below. The `<article className="prose prose-invert">`-style layout matches the existing dark theme.

```tsx
import type { Metadata } from 'next';
import { LAST_UPDATED, PRIVACY_VERSION } from '@/lib/legal/versions';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'The Privacy Policy of Canvas Classes / Crucible, describing how personal data is collected, used, and protected.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-white/90 leading-relaxed">
      <h1 className="text-3xl font-bold mb-1">Privacy Policy</h1>
      <p className="text-sm text-white/60 mb-10">
        Version {PRIVACY_VERSION} &middot; Last updated: {LAST_UPDATED}
      </p>

      <section className="space-y-8 text-[15px]">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Definitions</h2>
          <p>
            In this Privacy Policy, &ldquo;Company&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;, or &ldquo;our&rdquo; refers to Canvas Classes,
            operator of the Crucible platform at canvasclasses.in (the
            &ldquo;Platform&rdquo;). &ldquo;User&rdquo;, &ldquo;you&rdquo;, or
            &ldquo;your&rdquo; refers to any individual who accesses or uses the
            Platform. &ldquo;Personal Data&rdquo; means any information relating
            to an identified or identifiable individual. &ldquo;Processing&rdquo;
            means any operation performed on Personal Data, including
            collection, storage, use, disclosure, or deletion.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Scope and Consent</h2>
          <p>
            This Privacy Policy governs the Processing of Personal Data by the
            Company in connection with the Platform. By creating an account or
            otherwise using the Platform, you signify your acceptance of this
            Policy and consent to the Processing of your Personal Data in
            accordance with its terms. If you do not agree with any part of this
            Policy, you must not use the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Information We Collect
          </h2>
          <p className="mb-2">We collect the following categories of data:</p>
          <p className="mb-2">
            <strong>(a) Account Information.</strong> When you register, we
            collect your email address and, if you sign in via Google, the basic
            profile information Google discloses to us (name and profile picture,
            where provided).
          </p>
          <p className="mb-2">
            <strong>(b) Practice and Progress Data.</strong> The questions you
            attempt, your answers, the duration of your practice sessions, and
            any flags or reports you submit. This data is linked to your
            account so the Platform can show your progress and improve its
            recommendations.
          </p>
          <p>
            <strong>(c) Automatic Telemetry.</strong> Aggregated technical
            information such as pages visited, approximate country, device type,
            browser, and referring URL. Error reports generated by our
            monitoring tools include the page URL, browser and operating system,
            and the error stack trace; they do not include your name, email,
            IP address, or the content of any question or answer.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. Purpose of Processing
          </h2>
          <p>
            We Process your Personal Data solely for the operation, maintenance,
            and improvement of the Platform. Specifically, we use the data to
            (i) authenticate you and secure your account, (ii) display your
            learning progress and deliver the adaptive-practice features of the
            Platform, (iii) diagnose and fix technical errors, and (iv) analyse
            aggregate, non-identifying usage patterns so we can build better
            features for our users. We do not use your Personal Data for any
            purpose that is incompatible with these stated purposes.
          </p>
        </div>

        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-5">
          <h2 className="text-xl font-semibold mb-2">
            5. No Sale of Personal Data
          </h2>
          <p>
            We do not sell, rent, lease, or trade your Personal Data to any
            third party. We do not share your Personal Data with advertising
            networks, data brokers, or other third parties for marketing
            purposes. Our use of Personal Data is limited strictly to the
            internal analytics and product-improvement purposes described in
            Section 4 of this Policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Sub-processors</h2>
          <p className="mb-2">
            We rely on the following third-party service providers to operate
            the Platform. Each is bound by its own data-protection terms, and
            none receives your name, email, phone number, or the content of the
            questions or answers you interact with on the Platform.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Supabase</strong> &mdash; authentication and session
              storage.
            </li>
            <li>
              <strong>MongoDB Atlas</strong> &mdash; storage of the question
              bank and your practice history.
            </li>
            <li>
              <strong>Vercel</strong> &mdash; web hosting, page-view analytics,
              and performance monitoring.
            </li>
            <li>
              <strong>Sentry</strong> &mdash; error monitoring. Personal
              identifiers are suppressed.
            </li>
            <li>
              <strong>Mixpanel</strong> &mdash; aggregated product analytics
              (feature usage, funnel conversion). No direct identifiers are
              transmitted.
            </li>
            <li>
              <strong>Microsoft Clarity</strong> &mdash; anonymised session
              heatmaps. All text is masked.
            </li>
            <li>
              <strong>Cloudflare R2</strong> &mdash; storage of static assets
              (images, diagrams). Contains no user data.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Cookies and Similar Technologies
          </h2>
          <p>
            The Platform uses session cookies necessary for authentication and
            to remember your preferences. We do not use third-party advertising
            cookies and we do not build a cross-site advertising profile of
            you.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Data Retention</h2>
          <p>
            We retain your account data and practice history for as long as your
            account is active. If you request deletion of your account, your
            Personal Data will be removed within thirty (30) days of the
            request, save for any data we are legally required to retain.
            Aggregated, anonymised telemetry may be retained indefinitely for
            research and product-improvement purposes, as it is no longer
            Personal Data. __RETENTION_WINDOWS__
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Data Security</h2>
          <p>
            We employ industry-standard technical and organisational measures
            to protect Personal Data, including encryption in transit (HTTPS
            everywhere), access controls on administrative endpoints, and
            regular review of our authentication and session-management
            configuration. No system is perfectly secure, and we cannot
            guarantee absolute security; however, we continuously work to
            improve the Platform&rsquo;s security posture.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">10. Your Rights</h2>
          <p>
            You have the right to (a) access the Personal Data we hold about
            you, (b) request correction of inaccurate data, (c) request
            deletion of your data and termination of your account, and (d)
            withdraw your consent to further Processing (which will result in
            termination of your account). To exercise any of these rights,
            please write to us at{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
            . We will acknowledge your request within seven (7) business days
            and complete it within thirty (30) days.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">11. Users Under 18</h2>
          <p>
            The Platform is designed for students preparing for JEE, NEET, and
            CBSE examinations. We recognise that a substantial portion of our
            user base is under the age of eighteen. By creating an account and
            accepting this Policy, the User and, where the User is a minor, the
            User&rsquo;s parent or legal guardian, jointly acknowledge and
            consent to the Processing of the User&rsquo;s Personal Data as
            described in this Policy. A parent or legal guardian who becomes
            aware that their minor child has provided Personal Data to the
            Platform may, at any time, request review, correction, or deletion
            of that data by contacting us at the email address in Section 10.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            12. International Data Transfers
          </h2>
          <p>
            Our sub-processors may store and process Personal Data in
            jurisdictions outside India, including the United States and the
            European Union. By using the Platform, you consent to such
            transfers. Each sub-processor is selected in part for its compliance
            with recognised data-protection frameworks.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            13. Changes to This Policy
          </h2>
          <p>
            We may update this Policy from time to time. Each update is
            reflected in a change to the version number displayed at the top of
            this page. On any material change, existing users will be prompted
            to review and re-accept the updated Policy on their next sign-in to
            the Platform. Continued use of the Platform after a material change
            constitutes acceptance of the updated Policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">14. Grievance Officer</h2>
          <p>
            In accordance with Rule 5(9) of the Information Technology
            (Reasonable Security Practices and Procedures and Sensitive Personal
            Data or Information) Rules, 2011 and applicable provisions of the
            Digital Personal Data Protection Act, 2023, the contact details of
            the Grievance Officer are as follows:
          </p>
          <p className="mt-2">
            <strong>Name:</strong> __GRIEVANCE_OFFICER_NAME__
            <br />
            <strong>Email:</strong>{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            15. Governing Law and Jurisdiction
          </h2>
          <p>
            This Policy is governed by and construed in accordance with the
            laws of the Republic of India. Any dispute arising out of or in
            connection with this Policy shall be subject to the exclusive
            jurisdiction of the competent courts in __REGISTERED_CITY__, India.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            16. Contact Information
          </h2>
          <p>
            If you have any questions about this Policy or our Processing of
            your Personal Data, please write to us at{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`
Navigate to: `http://localhost:3000/privacy`
Expected:
- Page loads without error.
- Headline reads "Privacy Policy".
- Subheading shows "Version 1.0 &middot; Last updated: 2026-04-20".
- Section 5 ("No Sale of Personal Data") visually stands out (orange-tinted block).
- No "Revoke consent" button visible.
- All three fill-in markers (`__GRIEVANCE_OFFICER_NAME__`, `__REGISTERED_CITY__`, `__RETENTION_WINDOWS__`) are visible on the page so they cannot be missed.

Kill the dev server after verification.

- [ ] **Step 4: Commit point**

Stop. Diff: one file modified, one file deleted. Let the product owner review, fill in the three markers, and commit.

---

## Task 3: Terms & Conditions page

**Files:**
- Create: `app/terms/page.tsx`

- [ ] **Step 1: Create the Terms & Conditions page**

Create `app/terms/page.tsx` with this content:

```tsx
import type { Metadata } from 'next';
import { LAST_UPDATED, TERMS_VERSION } from '@/lib/legal/versions';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'The Terms and Conditions governing access to and use of Canvas Classes / Crucible.',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-white/90 leading-relaxed">
      <h1 className="text-3xl font-bold mb-1">Terms &amp; Conditions</h1>
      <p className="text-sm text-white/60 mb-10">
        Version {TERMS_VERSION} &middot; Last updated: {LAST_UPDATED}
      </p>

      <section className="space-y-8 text-[15px]">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            These Terms and Conditions (the &ldquo;Terms&rdquo;) govern your
            access to and use of the Crucible platform at canvasclasses.in (the
            &ldquo;Platform&rdquo;), operated by Canvas Classes (the
            &ldquo;Company&rdquo;). By creating an account or otherwise using
            the Platform, you represent that you have read, understood, and
            agreed to be bound by these Terms and by our Privacy Policy. If you
            do not agree to these Terms, you must not access or use the
            Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
          <p>
            The Platform is intended for students preparing for JEE, NEET, and
            CBSE examinations. By using the Platform, you represent and warrant
            that you are either (a) at least eighteen (18) years of age, or (b)
            a minor who has obtained the consent of a parent or legal guardian
            to access the Platform. A parent or legal guardian who permits a
            minor to use the Platform agrees to these Terms on the
            minor&rsquo;s behalf and remains responsible for the minor&rsquo;s
            use of the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Account Registration and Security
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account. You agree to notify the Company immediately at{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>{' '}
            of any unauthorised use of your account. The Company is not liable
            for any loss or damage arising from your failure to safeguard your
            credentials.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. User Conduct and Prohibited Uses
          </h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              copy, reproduce, distribute, or sell any portion of the Platform
              or its content without prior written permission;
            </li>
            <li>
              attempt to gain unauthorised access to any portion of the
              Platform, other user accounts, or the Company&rsquo;s systems;
            </li>
            <li>
              use automated scripts, scrapers, or bots to extract data from the
              Platform;
            </li>
            <li>
              interfere with the proper working of the Platform or the
              experience of other users;
            </li>
            <li>
              upload or transmit any content that is unlawful, defamatory,
              obscene, or infringes the rights of any third party;
            </li>
            <li>
              share your account credentials with any other person.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Intellectual Property
          </h2>
          <p>
            All content made available on the Platform &mdash; including but
            not limited to the question bank, interactive simulators,
            explanatory text, diagrams, videos, and branding &mdash; is the
            property of the Company or its licensors and is protected by
            copyright, trademark, and other intellectual-property laws. You are
            granted a limited, non-exclusive, non-transferable, revocable
            licence to access and use the content for your personal,
            non-commercial educational use. All rights not expressly granted
            are reserved.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Service &ldquo;As Is&rdquo;</h2>
          <p>
            The Platform is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis. While the Company takes reasonable care to
            ensure the accuracy of its content, it makes no warranty, express
            or implied, that the content is free from errors or that use of the
            Platform will result in any particular outcome, including success
            in any examination.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, the Company
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or for any loss of profits or
            data, arising out of or in connection with your use of or inability
            to use the Platform. The Company&rsquo;s total aggregate liability
            to any User under these Terms shall not exceed the amount, if any,
            paid by that User to the Company in the twelve (12) months
            preceding the claim.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless the Company and its
            officers, directors, and employees from and against any claims,
            liabilities, damages, losses, and expenses (including reasonable
            legal fees) arising out of your breach of these Terms or your
            misuse of the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
          <p>
            The Company may suspend or terminate your access to the Platform at
            any time, with or without notice, for any breach of these Terms or
            for any other conduct the Company reasonably considers harmful to
            the Platform or its users. You may terminate your account at any
            time by writing to{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            10. Governing Law and Jurisdiction
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of the Republic of India. Any dispute arising out of or in
            connection with these Terms shall be subject to the exclusive
            jurisdiction of the competent courts in __REGISTERED_CITY__, India.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            11. Contact Information
          </h2>
          <p>
            Questions regarding these Terms may be directed to{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`
Navigate to: `http://localhost:3000/terms`
Expected:
- Page renders without error.
- Headline reads "Terms & Conditions".
- Version/date header shows "Version 1.0 · Last updated: 2026-04-20".
- `__REGISTERED_CITY__` marker is visible so it cannot be missed.

Kill the dev server.

- [ ] **Step 3: Commit point**

Stop. Diff: one new file. Let the product owner review and commit.

---

## Task 4: Consent-accepting server action

**Files:**
- Create: `components/legal/acceptConsent.ts`

- [ ] **Step 1: Create the server action**

Create `components/legal/acceptConsent.ts`:

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/utils/supabase/server';
import {
  PRIVACY_VERSION,
  TERMS_VERSION,
} from '@/lib/legal/versions';

type Result = { ok: true } | { ok: false; error: string };

export async function acceptConsent(): Promise<Result> {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: 'Authentication service not configured' };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: 'Not authenticated' };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      privacy_version: PRIVACY_VERSION,
      terms_version: TERMS_VERSION,
      consent_accepted_at: new Date().toISOString(),
    },
  });

  if (updateError) {
    console.error('acceptConsent failed:', updateError.message);
    return { ok: false, error: 'Failed to record consent' };
  }

  revalidatePath('/', 'layout');
  return { ok: true };
}
```

Note: the action only writes to the *calling* user&rsquo;s metadata via the session; it cannot target another user. It does not accept any parameters precisely for that reason &mdash; the version values come from the server-side constants, not from the client. This satisfies the &ldquo;no mass assignment, auth guard on every mutation&rdquo; rules in `CLAUDE.md` Section 8.

- [ ] **Step 2: Verify type-check passes**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit point**

Stop. One new file. Product owner commits.

---

## Task 5: ConsentRefreshModal (client)

**Files:**
- Create: `components/legal/ConsentRefreshModal.tsx`

- [ ] **Step 1: Create the modal component**

Create `components/legal/ConsentRefreshModal.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { acceptConsent } from './acceptConsent';

export function ConsentRefreshModal() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAgree = () => {
    setError(null);
    startTransition(async () => {
      const result = await acceptConsent();
      if (!result.ok) {
        setError(result.error);
      }
      // On success, the page revalidates and the gate re-renders without the modal.
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F15] p-6 shadow-2xl">
        <h2
          id="consent-modal-title"
          className="text-lg font-semibold text-white mb-2"
        >
          Updated Privacy Policy and Terms
        </h2>
        <p className="text-sm text-white/75 leading-relaxed mb-4">
          We&rsquo;ve updated how we describe the data we collect and how the
          Platform is used. Please review the updated documents and confirm to
          continue using Crucible.
        </p>
        <div className="flex flex-col gap-1 text-sm mb-5">
          <a
            href="/privacy"
            target="_blank"
            rel="noopener"
            className="text-orange-400 underline"
          >
            Read Privacy Policy
          </a>
          <a
            href="/terms"
            target="_blank"
            rel="noopener"
            className="text-orange-400 underline"
          >
            Read Terms &amp; Conditions
          </a>
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-3" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={handleAgree}
          disabled={isPending}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 font-bold text-black disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'I Agree'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Render-only smoke check is deferred to Task 6, which mounts this modal via the gate.

- [ ] **Step 3: Commit point**

Stop. One new file. Product owner commits.

---

## Task 6: ConsentGate and root-layout wiring

**Files:**
- Create: `components/legal/ConsentGate.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create the gate component**

Create `components/legal/ConsentGate.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import {
  PRIVACY_VERSION,
  TERMS_VERSION,
} from '@/lib/legal/versions';
import { ConsentRefreshModal } from './ConsentRefreshModal';

const PUBLIC_PATHS = [
  '/privacy',
  '/terms',
  '/login',
  '/api/auth/google-direct/callback',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function ConsentGate() {
  const pathname = usePathname() ?? '';
  const [needsConsent, setNeedsConsent] = useState(false);

  useEffect(() => {
    if (isPublicPath(pathname)) {
      setNeedsConsent(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const supabase = createClient();
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        setNeedsConsent(false);
        return;
      }

      const meta = user.user_metadata ?? {};
      const stale =
        meta.privacy_version !== PRIVACY_VERSION ||
        meta.terms_version !== TERMS_VERSION;

      setNeedsConsent(stale);
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!needsConsent) return null;
  return <ConsentRefreshModal />;
}
```

- [ ] **Step 2: Wire the gate into the root layout**

Open `app/layout.tsx`. Make three changes:

1. Remove the import:

```tsx
import { ConsentBanner } from '@/components/ConsentBanner';
```

2. Add the new import near the other analytics/provider imports:

```tsx
import { ConsentGate } from '@/components/legal/ConsentGate';
```

3. Replace the `<ConsentBanner />` JSX with `<ConsentGate />`:

Before:
```tsx
        </MixpanelProvider>
        <ConsentBanner />
        <Analytics />
```

After:
```tsx
        </MixpanelProvider>
        <ConsentGate />
        <Analytics />
```

- [ ] **Step 3: Verify type-check passes**

Run: `npx tsc --noEmit`
Expected: no errors. If there is an error about `ConsentBanner` being unused or missing, confirm all references have been replaced.

- [ ] **Step 4: Manual verification (migration flow for existing users)**

Run: `npm run dev`

1. Log into an existing account.
2. Open the Supabase dashboard → Authentication → Users → that user → Raw User Meta Data.
3. Confirm that none of `privacy_version`, `terms_version`, `consent_accepted_at` is set.
4. Navigate to `http://localhost:3000/` (any non-public route).
5. Expected: full-screen modal appears with "Updated Privacy Policy and Terms" headline.
6. Click the two links; both open in new tabs; original tab still shows the modal.
7. Click **I Agree**.
8. Expected: modal closes within ~1 second; page becomes interactive.
9. Refresh the Supabase user row. Expected: metadata now contains `privacy_version: "1.0"`, `terms_version: "1.0"`, `consent_accepted_at: <ISO timestamp>`.
10. Navigate away and back; modal does not reappear.
11. Navigate to `/privacy` and `/terms` while logged in with stale metadata (repeat steps 2-3 to clear metadata first); expected: modal does not appear on those routes.

Kill the dev server.

- [ ] **Step 5: Commit point**

Stop. Two files changed, one created. Product owner commits.

---

## Task 7: Signup checkbox (email flow)

**Files:**
- Modify: `app/login/page.tsx`

- [ ] **Step 1: Add consent state and import version constants**

Open `app/login/page.tsx`. At the top of `LoginContent`, add the new `useState` hook and version import.

Add to the imports block:

```tsx
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal/versions'
```

Inside `LoginContent`, after the existing `useState` declarations, add:

```tsx
const [consentChecked, setConsentChecked] = useState(false)
```

- [ ] **Step 2: Write consent metadata on email signup**

Find the `supabase.auth.signUp` call (currently around line 66-69). Replace it with:

```tsx
const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            privacy_version: PRIVACY_VERSION,
            terms_version: TERMS_VERSION,
            consent_accepted_at: new Date().toISOString(),
        },
    },
})
```

- [ ] **Step 3: Render the consent checkbox only on signup**

Locate the closing `</AnimatePresence>` that wraps the email/password inputs (around line 201). Immediately after it, and before the submit button, add:

```tsx
{!isLogin && (
    <label className="flex items-start gap-2 text-xs text-zinc-400 select-none cursor-pointer">
        <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-0.5 accent-orange-500 cursor-pointer"
        />
        <span>
            I have read and agree to the{' '}
            <Link
                href="/privacy"
                target="_blank"
                rel="noopener"
                className="underline text-zinc-300 hover:text-white"
            >
                Privacy Policy
            </Link>{' '}
            and{' '}
            <Link
                href="/terms"
                target="_blank"
                rel="noopener"
                className="underline text-zinc-300 hover:text-white"
            >
                Terms &amp; Conditions
            </Link>
            .
        </span>
    </label>
)}
```

- [ ] **Step 4: Disable the primary button until the checkbox is ticked**

Change the submit button&rsquo;s `disabled` prop to include the consent check when in signup mode. Find the button (around line 217):

Before:
```tsx
<button
    type="submit"
    disabled={isLoading || isGoogleLoading}
    className="..."
>
```

After:
```tsx
<button
    type="submit"
    disabled={isLoading || isGoogleLoading || (!isLogin && !consentChecked)}
    className="..."
>
```

- [ ] **Step 5: Manual verification (email signup)**

Run: `npm run dev`

1. Navigate to `/login` and switch the pill to *Sign Up*.
2. Expected: the consent checkbox appears, unchecked. The **Create account** button is visibly disabled.
3. Fill in email and password. Button remains disabled.
4. Tick the checkbox. Button becomes enabled.
5. Click each link in the checkbox label. Both open in new tabs.
6. Submit the form with a fresh email.
7. Expected: success message ("Check your email to confirm your account!").
8. Open Supabase dashboard → Authentication → Users → find the new user → Raw User Meta Data.
9. Expected: `privacy_version: "1.0"`, `terms_version: "1.0"`, `consent_accepted_at: <ISO>`.
10. Switch back to *Sign In* mode. Checkbox should disappear; button should NOT require consent.

Kill the dev server.

- [ ] **Step 6: Commit point**

Stop. One file modified. Product owner commits.

---

## Task 8: Consent signal through Google OAuth

**Files:**
- Modify: `app/api/auth/google-direct/start/route.ts`
- Modify: `app/api/auth/google-direct/callback/route.ts`
- Modify: `app/login/page.tsx`

- [ ] **Step 1: Accept `consent` param in the OAuth start route**

Open `app/api/auth/google-direct/start/route.ts`. Replace the existing state construction block with:

```ts
const consent = searchParams.get('consent') === '1';

const state = encodeURIComponent(
    JSON.stringify({ next, consent }),
);
```

(The rest of the file is unchanged.)

- [ ] **Step 2: Write metadata in the OAuth callback when consent is signalled**

Open `app/api/auth/google-direct/callback/route.ts`. Two edits.

First, update the state-parsing block (around line 25-33) to extract `consent`:

```ts
let next = '/';
let consentFromSignup = false;
if (state) {
    try {
        const stateData = JSON.parse(decodeURIComponent(state));
        next = sanitizeRedirect(stateData.next, '/');
        consentFromSignup = stateData.consent === true;
    } catch (e) {
        console.error('Failed to parse state:', e);
    }
}
```

Second, after the successful `signInWithIdToken` call (just before `return NextResponse.redirect(new URL(next, request.url));`), insert:

```ts
if (consentFromSignup && data.user) {
    const { PRIVACY_VERSION, TERMS_VERSION } = await import('@/lib/legal/versions');
    const meta = data.user.user_metadata ?? {};
    const needsUpdate =
        meta.privacy_version !== PRIVACY_VERSION ||
        meta.terms_version !== TERMS_VERSION;

    if (needsUpdate) {
        const { error: metaError } = await supabase.auth.updateUser({
            data: {
                privacy_version: PRIVACY_VERSION,
                terms_version: TERMS_VERSION,
                consent_accepted_at: new Date().toISOString(),
            },
        });
        if (metaError) {
            console.error('Failed to write consent metadata:', metaError.message);
            // Non-fatal: ConsentGate will prompt them on the next page load.
        }
    }
}
```

Rationale: the metadata update is best-effort. If it fails (e.g. Supabase transient error), the user lands on the app and `ConsentGate` immediately shows the modal, which writes the metadata via the server action. One fallback path, no orphaned state.

- [ ] **Step 3: Gate the Google button and pass the consent signal**

Open `app/login/page.tsx`. Replace the existing `handleGoogleLogin` function with:

```tsx
const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setMessage(null)

    const consentParam = !isLogin ? '&consent=1' : ''
    window.location.href = `/api/auth/google-direct/start?next=${encodeURIComponent(nextPath)}${consentParam}`
}
```

Then update the Google button&rsquo;s `disabled` prop to also require consent in signup mode. Find the motion.button (around line 246):

Before:
```tsx
disabled={isGoogleLoading || isLoading}
```

After:
```tsx
disabled={isGoogleLoading || isLoading || (!isLogin && !consentChecked)}
```

- [ ] **Step 4: Manual verification (Google signup)**

Run: `npm run dev`

1. Navigate to `/login` and switch to *Sign Up*.
2. Expected: the *Continue with Google* button is disabled until the checkbox is ticked.
3. Tick the checkbox. Click *Continue with Google*. Complete Google OAuth with a fresh Google account (or one whose Supabase user metadata is empty).
4. Expected: user lands back on the app (post-OAuth redirect), NO re-consent modal appears.
5. Check Supabase dashboard for the user. Metadata should contain the three keys.
6. As a negative check: log out, switch to *Sign In*, click *Continue with Google* without ticking any checkbox. Metadata should be unchanged; the OAuth flow should complete and the user should land on the app.
7. If that user&rsquo;s metadata was already current, no modal appears. If it&rsquo;s stale, `ConsentGate` shows the modal (this is Task 6&rsquo;s behaviour, verified again here).

Kill the dev server.

- [ ] **Step 5: Commit point**

Stop. Three files modified. Product owner commits.

---

## Task 9: Remove the cookie banner and legacy consent cookie

**Files:**
- Delete: `components/ConsentBanner.tsx`
- Delete: `lib/analytics/consent.ts`

- [ ] **Step 1: Confirm no lingering importers**

Run: `Grep -r "ConsentBanner" app/ components/ lib/` and `Grep -r "@/lib/analytics/consent" app/ components/ lib/`.

Expected after Task 6: zero hits for `ConsentBanner`. Any hit for `@/lib/analytics/consent` must be resolved before deletion.

If any importer remains (e.g. the old `RevokeConsentButton` reference that Task 2 already deleted), clean it up first.

- [ ] **Step 2: Delete the banner and the cookie helpers**

Delete `components/ConsentBanner.tsx`.
Delete `lib/analytics/consent.ts`.

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds. If a stale import surfaces, fix that file and re-run.

- [ ] **Step 4: Commit point**

Stop. Two files deleted. Product owner commits.

---

## Task 10: Footer links

**Files:**
- Modify: `app/components/Footer.tsx`

- [ ] **Step 1: Add Privacy and Terms links to the bottom bar**

Open `app/components/Footer.tsx`. Find the bottom-bar block (around line 116-119):

```tsx
<div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
    <p>© {currentYear} Canvas Classes by Paaras Sir. All rights reserved.</p>
    <p>Made with <span className="text-red-500/80">❤️</span> for Students</p>
</div>
```

Replace with:

```tsx
<div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
    <p>© {currentYear} Canvas Classes by Paaras Sir. All rights reserved.</p>
    <div className="flex items-center gap-4">
        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms &amp; Conditions
        </Link>
    </div>
    <p>Made with <span className="text-red-500/80">❤️</span> for Students</p>
</div>
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`
Navigate to `http://localhost:3000/` and scroll to the footer.
Expected:
- Bottom row shows three items: copyright, two links, tagline.
- Clicking **Privacy Policy** navigates to `/privacy`.
- Clicking **Terms & Conditions** navigates to `/terms`.
- Footer layout is not broken on mobile widths (resize browser to ~400px).
- Footer still hides on `/the-crucible/admin/*`, `/crucible/admin/*`, `/organic-chemistry-hub`, and `/the-crucible` (existing behaviour preserved).

Kill the dev server.

- [ ] **Step 3: Commit point**

Stop. One file modified. Product owner commits.

---

## Task 11: Account page with consent record

**Files:**
- Create: `app/account/page.tsx`

- [ ] **Step 1: Create the account page**

Create `app/account/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Account',
};

function formatDate(iso: string | undefined | null): string {
  if (!iso) return 'unknown';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect('/login?next=/account');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/account');
  }

  const meta = user.user_metadata ?? {};
  const privacyVersion = (meta.privacy_version as string | undefined) ?? 'not recorded';
  const termsVersion = (meta.terms_version as string | undefined) ?? 'not recorded';
  const acceptedAt = formatDate(meta.consent_accepted_at as string | undefined);

  const deletionSubject = encodeURIComponent('Account deletion request');
  const deletionBody = encodeURIComponent(
    `Hello Canvas Classes team,\n\nI would like to request deletion of my account (${user.email}) and associated practice history.\n\nThank you.`,
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-white/90">
      <h1 className="text-2xl font-bold mb-1">Account</h1>
      <p className="text-sm text-white/60 mb-8">{user.email}</p>

      <section className="rounded-xl border border-white/10 bg-[#151E32] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Consent record</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">Privacy Policy version</dt>
            <dd>{privacyVersion}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">Terms &amp; Conditions version</dt>
            <dd>{termsVersion}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">Accepted on</dt>
            <dd>{acceptedAt}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#151E32] p-6">
        <h2 className="text-lg font-semibold mb-2">Delete your account</h2>
        <p className="text-sm text-white/70 mb-3">
          To request deletion of your account and all associated practice
          history, send us an email. We will acknowledge within seven business
          days and complete the deletion within thirty days.
        </p>
        <a
          href={`mailto:support@canvasclasses.in?subject=${deletionSubject}&body=${deletionBody}`}
          className="inline-block rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Request account deletion
        </a>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`

1. Log out and visit `/account`. Expected: redirect to `/login?next=/account`.
2. Log in. Expected: page renders with the two sections.
3. Consent record section shows the three stored values.
4. Click **Request account deletion**. Expected: the user&rsquo;s default mail client opens with the subject and body prefilled.
5. Navigate to `/account` from a fresh browser session after a stale-metadata login: expected the `ConsentGate` modal appears first; after agreeing, the account page shows the fresh values.

Kill the dev server.

- [ ] **Step 3: Commit point**

Stop. One new file. Product owner commits.

---

## Task 12: End-to-end verification and bump-drill

**Files:** none (verification only).

This task validates the two full user journeys and the policy-update lever.

- [ ] **Step 1: New-user email signup journey**

Run: `npm run dev`. Use an email you can receive mail on.

1. Visit `/` (logged out). No modal appears, footer shows both links.
2. Click a link in the footer header or navbar to sign in → `/login`.
3. Switch to *Sign Up*. Checkbox is unchecked, button disabled.
4. Enter credentials, tick the checkbox, submit. Confirmation email arrives.
5. Confirm email, land back on app. No modal appears.
6. Open Supabase user row: three metadata keys set.
7. Visit `/account`: values show Privacy v1.0, Terms v1.0, today&rsquo;s date.

- [ ] **Step 2: Existing-user re-consent journey**

1. Open Supabase dashboard, find an existing user whose metadata has none of the three keys (simulate by clearing them if needed).
2. Log in as that user.
3. Expected on landing: blocking modal appears.
4. Click *Read Privacy Policy* &mdash; opens in new tab, modal remains in old tab.
5. Back in the main tab, click **I Agree**.
6. Modal closes. Metadata now has the three keys.
7. Reload the page; modal does not return.

- [ ] **Step 3: Policy-update bump drill**

1. Open `lib/legal/versions.ts`. Change `PRIVACY_VERSION` to `'1.1'` and `LAST_UPDATED` to today. Save (dev server hot-reloads).
2. In any signed-in tab with stale metadata (v1.0), reload the page.
3. Expected: the modal appears again.
4. Click **I Agree**. Metadata updates to `privacy_version: "1.1"`.
5. Revert `lib/legal/versions.ts` to `'1.0'` / `2026-04-20` for now (the bump was a drill, not a real change). Save.
6. Reload. No modal.

- [ ] **Step 4: Public-route exemption check**

1. With stale metadata (clear keys in Supabase), visit `/privacy`, `/terms`, and `/login` in turn.
2. Expected: on none of these pages does the modal render.
3. Visit `/` (any non-public route). Modal appears.

- [ ] **Step 5: Banner-removal check**

1. Clear your cookies for the site.
2. Visit `/` in an incognito window.
3. Expected: no cookie banner anywhere.

- [ ] **Step 6: Build pass**

Run: `npm run build`
Expected: build succeeds with no errors related to the removed files or new imports.

- [ ] **Step 7: Final commit point**

Stop. No file changes in this task beyond the temporary bump in Step 3 (already reverted). Product owner performs final review of the full set of commits and tags the release if desired.

---

## Acceptance criteria (mirrors spec Section 12)

1. `/privacy` and `/terms` render the full formal documents with `Last updated: 2026-04-20` visible at the top. &mdash; *Tasks 2, 3.*
2. A new user cannot complete signup (email or Google) without ticking the consent checkbox. &mdash; *Tasks 7, 8.*
3. On successful signup, the new user&rsquo;s `auth.users.raw_user_meta_data` contains `privacy_version`, `terms_version`, and `consent_accepted_at`. &mdash; *Tasks 7, 8.*
4. An existing user whose metadata lacks these keys sees the re-consent modal on their next authenticated page load, cannot dismiss it, and after clicking **I Agree** proceeds to their intended page. &mdash; *Task 6.*
5. Bumping either constant in `lib/legal/versions.ts` causes every user&rsquo;s next authenticated page load to show the modal again. &mdash; *Tasks 1, 6, 12.*
6. The cookie banner no longer appears anywhere in the application. &mdash; *Task 9.*
7. The footer on every page shows *Privacy Policy* and *Terms & Conditions* links. &mdash; *Task 10.*
8. No API route or server action that reads or writes consent metadata is accessible unauthenticated. &mdash; *Task 4 (server action checks session); Task 8 (OAuth callback already requires authenticated exchange).*
