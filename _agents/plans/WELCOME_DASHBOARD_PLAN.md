# Personalised Welcome Dashboard — Design Plan

**Owner:** Canvas Classes · **Status:** Plan ready for build · **Target:** Pre-paid-launch (within 30 days)

The returning student should land on something that feels like *their* product, not a chapter index. This document is the build brief.

---

## 1. Where it lives

- **Route:** `/the-crucible` (today the chapter index — replace it).
- **Component:** `app/the-crucible/components/CrucibleWelcomeView.tsx` (new). Render conditionally inside the existing `app/the-crucible/page.tsx`:
  - Logged out → keep current marketing landing (`CrucibleLanding.tsx`).
  - Logged in, **no prior attempts** → first-visit welcome (see §6).
  - Logged in, **has attempts** → personalised welcome dashboard.
- **Data source:** `GET /api/v2/user/welcome` (already shipped — see [route.ts](app/api/v2/user/welcome/route.ts)). Single round-trip; the page should feel instant on cold load.

---

## 2. Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  Good evening, Paaras.                            🔥 5 day   │  ← greeting + streak chip
│  You've answered 247 questions · 74% accuracy                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ PICK UP WHERE YOU LEFT OFF                           │  │  ← Resume card (priority 1)
│  │ Acidity & Basicity                          7/10 ✓   │  │
│  │ Last practiced 2 hours ago                           │  │
│  │                                       [ Continue → ] │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ── This week's weak spots ──                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  ← Weak concepts (priority 2)
│  │ Hyperconjug.│  │ Dipole moment│  │ Resonance   │         │
│  │ 38% · 8 q   │  │ 45% · 6 q    │  │ 51% · 11 q  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ── For you ──                          (engine warming up)  │  ← Recommendations (priority 3,
│  ┌──────────────────────────────────────────────────────┐  │     gated until content lands)
│  │ Empty state: "We'll surface personalised picks here   │  │
│  │  once you've practiced a bit more."                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ── Recent tests ──                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  ← Recent activity grid
│  │ GOC · 78%   │  │ Atom · 65%  │  │ Mole · 92%  │         │
│  │ 2 days ago  │  │ 4 days ago  │  │ 6 days ago  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  Browse all chapters →                                       │  ← Escape hatch
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Data contract

The `/api/v2/user/welcome` route returns `WelcomePayload` (shape exported from
[route.ts](app/api/v2/user/welcome/route.ts)). Fields are stable — UI binds against them
directly. Empty / null fields drive empty-state rendering; never block the
page on a single panel's data.

| Field | Drives | Empty handling |
|---|---|---|
| `greeting_name`, `greeting_bucket` | "Good evening, Paaras." header | Fall back to "Welcome back" |
| `streak.days`, `streak.is_active_today` | Streak chip (flame icon, glows when active) | Hide chip if `days === 0` |
| `resume` | Resume card | Hide entire card (drop to "Browse chapters" CTA) |
| `weak_concepts[]` | "This week's weak spots" row | Hide row if `length === 0` (low-data users) |
| `recent_tests[]` | "Recent tests" row | Hide row if `length === 0` |
| `recommendations[]` | "For you" row | Show **placeholder** copy (engine pending) |
| `is_first_visit` | Switches whole page to first-visit hero (§6) | n/a |

---

## 4. Behavioural details

### Greeting
- Time-bucket-aware: "Good morning / afternoon / evening / night" (already keyed by API).
- Name from supabase email local-part, capitalised. **No hallucination of full name.**
- Sub-line: "You've answered N questions · X% accuracy" — pulled from `stats`.

### Resume card
- The single most important element. Should be *the* primary CTA on the screen.
- Big chapter name (serif, matches existing BrowseView header).
- Recent-10 in-chapter score as a confidence signal: `7/10 ✓`.
- Time-ago relative ("2 hours ago", "yesterday", "3 days ago"). Show absolute date if older than a week.
- Continue button uses chapter category accent (Organic = violet, etc. — same palette as BrowseView).
- Tap → `deeplink_url` (browse mode of last chapter).

### Streak chip
- Top-right of greeting. Flame icon + day count.
- `is_active_today === true` → chip glows / has slight animation (a single subtle pulse).
- `is_active_today === false` and streak > 0 → muted style with "Practice today to keep your streak" tooltip on hover.
- Streak === 0 → hide entirely (no shame).

### Weak spots row
- Up to 3 cards. Each shows tag_name, accuracy %, attempts.
- Clicking a card → `/the-crucible/<chapter_id>?mode=browse&topic=<tag_id>`. Lands directly inside the topic-filtered browse view (BrowseView already supports this filter).
- Visual: red-orange tint to differentiate from positive signals. Subtle, not alarming.

### Recommendations row
- Today: empty placeholder card with "We'll surface personalised picks here once you've practiced a bit more." copy and a small "Coming soon" badge.
- When the engine is activated (livebook + lecture content + ResourceLink rows in DB), this row populates automatically — no UI change required. The `engine_status` field on the API response distinguishes `awaiting_content` from `active` so we can swap copy if desired.

### Recent tests row
- Last 3 tests. Card per test: chapter name, score % with passing/failing color, time-ago.
- Tap → `/the-crucible/dashboard` (existing test-history dashboard) deep-linked to that test result.

### Browse-all escape hatch
- Below the personal sections. Soft link to the chapter index. For users who want to ignore the personalisation and just pick a chapter.

---

## 5. Non-functional requirements

- **Loading**: skeleton screen for the resume card; never block first paint on the API call. Render layout immediately, swap in data.
- **Errors**: 401 → redirect to login. Other errors → fall through to first-visit hero with a soft "Couldn't load your progress" toast.
- **Caching**: SSR with `revalidate: 0`. Returning users have to see fresh data (the streak chip in particular).
- **Analytics**: track `welcome_dashboard_viewed`, `welcome_resume_clicked`, `welcome_weak_concept_clicked`, `welcome_test_clicked`, `welcome_browse_all_clicked`. Drives funnel visibility for the engagement loop.
- **Accessibility**: card grid uses CSS grid with proper roles; keyboard nav works through cards in reading order.
- **Mobile**: stack vertically; resume card always full-width; weak/recommendation/recent rows scroll horizontally with snap.

---

## 6. First-visit experience

Users with `is_first_visit === true` see a different hero — no resume card, no weak concepts, no recent tests. Show:

1. Welcome by name.
2. A short "How Crucible works" three-card explainer (Browse / Test / Track).
3. A primary CTA: "Pick a chapter to start" → chapter index.

This isn't the personalised dashboard — it's an onboarding screen. Once they answer 5+ questions in a session, the next visit lands on the full personalised view.

---

## 7. Build order

1. **Component scaffold**: `CrucibleWelcomeView.tsx` with hardcoded data wired to the API contract.
2. **Wire to `/api/v2/user/welcome`**: replace hardcoded data, add SWR-style loading skeleton.
3. **Resume card polish**: time-ago helper, accent-color routing.
4. **Weak spots row**: card component reused for recommendations later.
5. **Recommendations row**: empty placeholder; identical layout so the swap is trivial.
6. **Recent tests row**: smallest cards.
7. **Escape hatch + analytics events**.
8. **First-visit branch**: separate hero component.
9. **Replace `/the-crucible/page.tsx`** routing logic to mount the new view.

Estimated effort: 2 days for one engineer.

---

## 8. Recommendation engine activation checklist (post-launch)

When livebook chapters and lecture content are ready, flipping the engine on requires only these steps — UI does not change:

1. Populate the `resource_links` Mongo collection (admin authoring tool or CSV import — see [ResourceLink.ts](lib/models/ResourceLink.ts)).
2. (Optional) Backfill `Question.v2.solution.learn_more` on key questions.
3. Replace the stub block in [recommendationEngine.ts](lib/recommendationEngine.ts) `getRecommendations` with the real algorithm (algorithm is documented in the file header).
4. The "For you" row populates automatically; the placeholder copy disappears because `engine_status` returns `'active'`.

That is all.
