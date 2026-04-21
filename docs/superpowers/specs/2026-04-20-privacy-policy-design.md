# Privacy Policy & Terms Management — Design Spec

**Date:** 2026-04-20
**Status:** Draft — pending user review
**Scope:** Replace the current ad-hoc consent banner with a signup-checkbox model, add formal Privacy Policy and Terms & Conditions pages, capture a minimal consent record on each user, and handle existing users via a soft re-consent modal.

---

## 1. Background

Crucible (`canvasclasses.in`) serves JEE/NEET Chemistry students, most of whom are under 18. The project currently exposes users to a generic `/privacy` page and a cookie consent banner. Neither satisfies India's Digital Personal Data Protection Act, 2023 (DPDP) nor the IT (Reasonable Security Practices) Rules, 2011 in a defensible way, and the cookie banner is UX friction the product owner wants removed.

## 2. Goals

1. Provide legally-styled, standalone Privacy Policy and Terms & Conditions documents.
2. Capture a durable, per-user record of which versions of each document the user accepted and when.
3. Surface the documents to users at the minimum number of sensible touchpoints.
4. Migrate existing users onto the new consent model with one click on their next login.
5. Give the product owner a single-constant lever to trigger re-consent when a policy materially changes.

## 3. Non-goals

- Cookie consent banner (explicitly removed).
- Verifiable parental-consent flow for minors (out of scope; minor-related clauses live inside the Privacy Policy text).
- Self-serve account deletion or data export UI (remains email-only).
- Separate Cookie Policy document (folded into the Privacy Policy).
- Multilingual document versions.
- DPDP Data Fiduciary registration or Data Protection Officer appointment.

## 4. Compliance posture (decided)

Minimal / pragmatic. Industry-aligned with Unacademy, Vedantu, Physics Wallah, and BYJU's. Accepts residual DPDP risk in exchange for a simpler user experience and lower build cost. The product owner has explicitly chosen this posture.

## 5. User-facing artifacts

| # | Artifact | Location | Purpose |
|---|---|---|---|
| 1 | Privacy Policy page | `/privacy` (existing URL, content rewritten) | The formal policy document. Dated, versioned. |
| 2 | Terms & Conditions page | `/terms` (new route) | The formal terms document. Dated, versioned. |
| 3 | Signup-form checkbox | `/login` signup section + Google OAuth pre-step | Required, unchecked by default. Submit disabled until ticked. |
| 4 | Re-consent modal | Rendered conditionally across all authenticated routes | Fires for any logged-in user whose stored `privacy_version` or `terms_version` is missing or stale. |
| 5 | Footer links | Global footer (`ConditionalFooter`) | Two small links: *Privacy Policy* and *Terms & Conditions*. |
| 6 | Consent record block on account page | `/account` (if exists; else added on a minimal Account page) | Read-only row: *"You agreed to Privacy Policy vX and Terms vY on <date>"* + *"Request account deletion"* mailto link. |

### 5.1 Removals

- `components/ConsentBanner.tsx` — deleted.
- `<ConsentBanner />` import and JSX in `app/layout.tsx` — removed.
- `app/privacy/RevokeConsentButton.tsx` — deleted. Revoking consent does not fit this model; the only exit is account deletion via email.
- `lib/analytics/consent.ts` cookie-based helpers — evaluated for removal or repurposing to read from Supabase user metadata instead of a cookie.

## 6. Data model

### 6.1 Source of truth

New file `lib/legal/versions.ts`:

```ts
export const PRIVACY_VERSION = '1.0';
export const TERMS_VERSION = '1.0';
export const LAST_UPDATED = '2026-04-20';
```

Bumping either constant is the only trigger for the re-consent modal. No database migration, feature flag, or deploy step beyond shipping the bump.

### 6.2 Per-user consent record

Stored in Supabase `auth.users.raw_user_meta_data` (JSONB, no schema migration). Three keys:

| Key | Type | Example |
|---|---|---|
| `privacy_version` | `string` | `"1.0"` |
| `terms_version` | `string` | `"1.0"` |
| `consent_accepted_at` | ISO 8601 timestamp | `"2026-04-20T14:32:17.123Z"` |

Updated via `supabase.auth.updateUser({ data: { ... } })` (client) or `supabase.auth.admin.updateUserById()` (server).

## 7. Flows

### 7.1 New email signup

1. User opens `/login` → signup form.
2. Form includes a required, unchecked checkbox:
   *"I have read and agree to the [Privacy Policy](/privacy) and [Terms & Conditions](/terms)."*
   Both links open in a new tab.
3. Submit button is disabled until the checkbox is ticked.
4. On submit, the server action `app/login/actions.ts`:
   a. Calls `supabase.auth.signUp({ email, password, options: { data: {...} } })` with the three consent keys set.
   b. On success, redirects to the intended post-signup destination.
5. The user never sees the re-consent modal on this session because their metadata is already current.

### 7.2 New Google-OAuth signup/login

1. User opens `/login`.
2. Same checkbox appears *above* the *Continue with Google* button. The OAuth button is disabled until the checkbox is ticked.
3. When the user clicks *Continue with Google*, the OAuth redirect encodes `consent=1` in the `state` parameter (or stores it in a short-lived server-readable cookie).
4. The OAuth callback (`app/login/callback/route.ts`) reads the consent signal:
   - If present and this is a new user, it writes the three metadata keys.
   - If present and this is an existing user whose stored version is stale, it refreshes the keys.
   - If absent, it proceeds without writing and lets Section 7.3 handle the re-consent modal.

### 7.3 Existing user on next login (soft re-consent)

1. User authenticates as usual.
2. On any authenticated route, a server component (e.g., `<ConsentGate />` wrapping the app shell, or an equivalent check in the authenticated route group's layout) inspects `session.user.user_metadata`:
   - If `privacy_version === PRIVACY_VERSION` **and** `terms_version === TERMS_VERSION`, render the page normally.
   - Otherwise render `<ConsentRefreshModal />` over the page content.
3. The modal is a full-screen overlay with:
   - Headline: *Updated Privacy Policy and Terms*.
   - Body: one-sentence summary + two inline links (*Read Privacy Policy* / *Read Terms*).
   - Single primary button: **I Agree**.
   - No dismiss button, no backdrop close, no decline option.
4. Clicking **I Agree** calls a server action that writes the three metadata keys and revalidates the page. Modal disappears.
5. If the user closes the tab or navigates to `/privacy` or `/terms` without agreeing, the modal reappears on their next authenticated page load.
6. The modal must not render on the public routes `/privacy`, `/terms`, `/login`, or `/login/callback` so that the user can actually read the documents before accepting.

### 7.4 Policy update (future)

When the product owner materially changes the Privacy Policy or Terms:

1. Update the document page content.
2. Bump the appropriate constant in `lib/legal/versions.ts` (e.g., `'1.0'` → `'1.1'`).
3. Update `LAST_UPDATED`.
4. Commit and deploy.

On next authenticated page load, every user's stored version compares unequal → Section 7.3 modal fires → they click **I Agree** → metadata updates to the new version. No further engineering work per update.

## 8. Document content

### 8.1 Privacy Policy

Tone: formal, numbered clauses, defined terms. Rendered on `/privacy` with a clear `Last updated: <LAST_UPDATED>` line at the top.

Sections:

1. Definitions (Company, Platform, User, Personal Data, Processing).
2. Scope and Consent.
3. Information We Collect — sub-sections for (a) Account Information, (b) Practice and Progress Data, (c) Automatic Telemetry.
4. Purpose of Processing — explicitly states data is used only for internal analytics and product improvement.
5. **No Sale of Personal Data** — prominent standalone clause. Explicit commitment that no User data is sold, rented, or shared with third parties for marketing.
6. Sub-processors — lists Supabase, MongoDB Atlas, Vercel, Sentry, Mixpanel, Microsoft Clarity, Cloudflare R2. One line per vendor describing purpose and that no PII is transmitted.
7. Cookies and Similar Technologies — describes session cookie usage; notes that no behavioural advertising cookies are used.
8. Data Retention.
9. Data Security.
10. User Rights — access, correction, deletion. Exercised via email to `support@canvasclasses.in`.
11. **Users Under 18** — explicit acknowledgement that much of the audience is under 18. By accepting this Policy and creating an account, the User and their parent or legal guardian jointly consent to the data processing described.
12. International Data Transfers.
13. Changes to This Policy — describes the version-bump mechanism and re-consent modal.
14. **Grievance Officer** — required under Rule 5(9) of the IT (Reasonable Security Practices) Rules, 2011 and the DPDP Act. Must include officer name, designation, and contact email. (Implementation will prompt the product owner for these values.)
15. Governing Law and Jurisdiction — India; exclusive jurisdiction in courts of the Company's registered city.
16. Contact Information.

### 8.2 Terms & Conditions

Tone: same formal register. Rendered on `/terms` with the same dated header.

Sections:

1. Acceptance of Terms.
2. Eligibility — user represents they are 18 or older, or have parental/guardian consent.
3. Account Registration and Security.
4. User Conduct and Prohibited Uses.
5. Intellectual Property — content, simulators, and the question bank are the Company's property; no reproduction without permission.
6. Service "As Is" Disclaimer — no guarantee of exam outcomes, no warranty of accuracy beyond reasonable effort.
7. Limitation of Liability.
8. Indemnification.
9. Termination.
10. Governing Law and Jurisdiction.
11. Contact Information.

## 9. Components and files to create or modify

### 9.1 Create

| Path | Purpose |
|---|---|
| `lib/legal/versions.ts` | Version constants. |
| `app/terms/page.tsx` | Terms & Conditions page. |
| `components/legal/ConsentRefreshModal.tsx` | Re-consent modal (client component). |
| `components/legal/ConsentGate.tsx` | Server component that checks session metadata and conditionally renders the modal. |
| `app/login/actions.ts` (extend) or `app/login/actions/consent.ts` | Server action to write consent metadata. |

### 9.2 Modify

| Path | Change |
|---|---|
| `app/privacy/page.tsx` | Rewrite body to the full formal Privacy Policy. Remove `<RevokeConsentButton />`. Keep route URL stable. |
| `app/login/page.tsx` (and any email/Google signup UI) | Add the required consent checkbox; disable submit/OAuth until ticked; pass consent signal into signup actions. |
| `app/login/callback/route.ts` | Read consent signal from OAuth state; write metadata if present and user is new or stale. |
| `app/layout.tsx` | Remove `<ConsentBanner />` import and JSX. |
| `app/components/ConditionalFooter.tsx` (or global footer component) | Add two links: Privacy Policy, Terms & Conditions. |
| Authenticated route-group layout (`app/(authenticated)/layout.tsx` or nearest equivalent) | Wrap children in `<ConsentGate>`. |

### 9.3 Delete

| Path | Reason |
|---|---|
| `components/ConsentBanner.tsx` | Banner removed. |
| `app/privacy/RevokeConsentButton.tsx` | Revoke-consent flow removed. |
| `lib/analytics/consent.ts` cookie helpers | Remove or refactor to read from Supabase metadata; cookie-based model is obsolete. |

## 10. Security and privacy considerations

- Consent-writing server actions must be authenticated; they may only update the calling user's metadata, never another user's.
- `raw_user_meta_data` is user-writable via the Supabase client. That is acceptable for this record because the risk of a user falsely claiming to have accepted terms is lower than the risk of *not* accepting and then disputing. If stronger audit is ever needed, upgrade to a dedicated `consents` table (deferred; see Section 3 non-goals).
- The re-consent modal must not leak into public routes (`/privacy`, `/terms`, `/login`, `/login/callback`).
- The consent checkbox value must be validated server-side at signup; a client-only check is insufficient.
- Sub-processor list in the Privacy Policy must be kept in sync with the actual analytics stack. A comment in `lib/legal/versions.ts` reminds future authors to review Section 6 of the Policy whenever a vendor is added or removed.

## 11. Open questions for implementation

These do not block the design; they are items the product owner must supply before the Privacy Policy can be published.

1. **Grievance Officer** — name, designation, and email for Section 14 of the Privacy Policy.
2. **Registered city and governing jurisdiction** — for Section 15 of the Privacy Policy and Section 10 of the Terms.
3. **Retention windows** — how long practice history and telemetry are retained (default proposal: practice history indefinitely while account is active, deleted within 30 days of account deletion request; telemetry aggregated after 12 months).
4. **Account page existence** — confirm whether `/account` already exists; if not, the design requires a minimal account page to host the consent record block.

## 12. Acceptance criteria

1. `/privacy` and `/terms` render the full formal documents with `Last updated: 2026-04-20` visible at the top.
2. A new user cannot complete signup (email or Google) without ticking the consent checkbox.
3. On successful signup, the new user's `auth.users.raw_user_meta_data` contains `privacy_version`, `terms_version`, and `consent_accepted_at`.
4. An existing user whose metadata lacks these keys sees the re-consent modal on their next authenticated page load, cannot dismiss it, and after clicking **I Agree** proceeds to their intended page.
5. Bumping either constant in `lib/legal/versions.ts` causes every user's next authenticated page load to show the modal again.
6. The cookie banner no longer appears anywhere in the application.
7. The footer on every page shows *Privacy Policy* and *Terms & Conditions* links.
8. No API route or server action that reads or writes consent metadata is accessible unauthenticated.

---

**Next step:** Implementation plan via `superpowers:writing-plans`.
