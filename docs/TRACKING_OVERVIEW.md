# Tracking Overview

A plain-English summary of what Crucible measures, and which third-party service it goes to. Nothing here includes student names, emails, passwords, phone numbers, or the text of questions/answers — those fields are automatically stripped before leaving our servers.

---

## 1. Mixpanel — what students do

Mixpanel is our product-analytics service. It answers questions like *"Are students finishing their practice sessions? Which chapters are the most opened?"* It only starts collecting after the user clicks **Accept** on the cookie banner.

### Events we record (one row per action)

| Event | When it fires | What we measure with it |
|---|---|---|
| `user_signed_up` | A brand-new student creates an account | Signup method (Google / email), email domain (e.g. `gmail.com`) — to understand where users come from |
| `user_logged_in` | Any login | Login method, how many days since signup — to see return-rate / stickiness |
| `user_logged_out` | The student logs out | (no extra details) |
| `chapter_opened` | A chapter practice page loads | Which chapter was opened — to see most/least popular chapters |
| `simulation_opened` | An interactive simulator loads (VSEPR, Flame Test, Cation/Anion flowcharts, Bond Angles, Biomolecules, etc.) | Which simulation, which subject — to see which interactive tools get used |
| `practice_session_started` | Student begins a test / practice set | Chapter, mode (guided / mixed difficulty), number of questions — to see test volume and mode preference |
| `practice_session_completed` | Student finishes a test | Chapter, mode, accuracy %, duration in seconds, correct-count, total-count — to measure performance trends and session length |
| `flag_submitted` | Student reports an issue on a question | The question's internal ID and the reason (wrong answer, typo, etc.) — to catch bad questions quickly |
| `admin_action` | An admin adds/edits/deletes a question | Which admin, what action — audit trail |

### Student profile (one row per student, updated over time)

| Attribute | Meaning |
|---|---|
| `signup_date` | When they created the account |
| `email_domain` | Just the part after `@` — helps us see if most users come from Gmail, a specific school, etc. |
| `last_active_at` | Last time they completed a practice session |
| `total_questions_answered` | Running total across all their sessions |
| `total_practice_minutes` | Running total of time spent practising |

---

## 2. Sentry — when something breaks

Sentry is our error-monitoring service. It is **not** tracking behavior — it only wakes up when code actually fails, so the dev team can fix it.

### What it captures

- **Error messages and stack traces** when an exception is thrown on the server or in the browser.
- **The page/URL** where the error happened.
- **Browser and OS** (e.g. "Chrome 131 on Windows 11") — to reproduce the bug.
- **A 1% sample of performance traces** (how long a page took to load) — to spot slowdowns without overwhelming our budget.

### What it does NOT capture

- No names, emails, IP addresses, cookies, or form values (we have `sendDefaultPii: false` turned on).
- Cancelled requests (`AbortError`) are ignored to avoid noise.

---

## 3. Vercel Analytics — page views

Vercel Analytics is our hosting provider's built-in page-view counter. Zero-config, privacy-friendly by design (it does not use cookies or build a profile per user).

### What it measures

- **Page views** per route (e.g. `/the-crucible/atoms` was opened X times today).
- **Approximate country** (e.g. India / US) based on request headers.
- **Device type** (mobile / tablet / desktop) and browser family.
- **Referrer** — where the visitor came from (Google search, a direct link, etc.).

It does **not** identify individual users — it just counts visits.

---

## 4. Vercel Speed Insights — how fast pages load

Same provider as above, but focused on performance rather than traffic.

### What it measures

- **Largest Contentful Paint (LCP)** — how long until the main content appears. Layman version: "how quickly did the page feel usable?"
- **Cumulative Layout Shift (CLS)** — how much the page jumps around while loading.
- **Interaction to Next Paint (INP)** — how fast the page responds to a click/tap.
- **Time to First Byte (TTFB)** — how quickly the server started replying.

These are the standard "Core Web Vitals" — used to catch slow pages and janky scrolling.

---

## 5. What we deliberately do NOT track

- Names, emails, phone numbers, passwords, full addresses.
- The text of the questions a student is reading or answering.
- The student's typed answer text.
- Raw IP addresses (Vercel/Sentry aggregate or drop these; Mixpanel server events turn off geo-lookup entirely).

Mixpanel only runs at all after the student taps **Accept** on the cookie banner. Sentry and Vercel's two tools run from the first visit because they either collect no personal data or only the minimum needed to debug a crash.
