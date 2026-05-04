# Crucible — Architecture & Persona Reference

**Status:** Canonical reference. Read this before changing any Crucible code.
**Owner:** Canvas Classes · **Last revised:** 2026-05-04

> If anything in another doc, comment, or commit message contradicts this file,
> **this file wins**. The fix is to update this doc — never to silently diverge.
> Updates are allowed and encouraged, but they must be explicit and justified.

---

## 0. Why this file exists

Crucible is a JEE/NEET Chemistry question bank, but the *product* is the
**student persona** it builds and the personalised recommendations it will
serve from that persona. Several pieces (data model, write paths, schema
shape, UX patterns) only make sense in the context of that downstream goal,
and over the past months they have been broken at least once each by changes
that looked harmless in isolation. This file is the contract that keeps
those pieces aligned.

If you are about to:

- add a new question-attempt write path,
- change the `concept_mastery` shape,
- add a new practice mode,
- touch auth on any `/api/v2/*` route,
- skip persistence behind a UX gate,
- introduce a new data model that captures student signal,

…you are doing something that this file is responsible for keeping safe.
Re-read it first. Then come back and update it as part of your change.

---

## 1. North-star purpose

Crucible is not a quiz app. It is a **per-student persona engine** that:

1. Captures every meaningful signal a student emits while practising
   chemistry (correctness, time, difficulty, concept tags, recency,
   skip-and-view-solution, bookmarks, marked-for-review).
2. Aggregates those signals into a multi-dimensional profile of which
   concepts they're strong in, weak in, stale on, and improving on.
3. Uses that profile to surface *what to do next* — practice the right
   questions, watch the right lecture, read the right livebook section.

Everything below — schema, modes, APIs, UX rules — exists to serve this
loop. When a change makes the loop weaker (signal lost, profile fragmented,
recommendation bridge broken), it is wrong even if it ships and looks fine.

---

## 2. System overview

```
                     ┌──────────────────────────┐
                     │   Student-facing UI      │
                     │   /the-crucible/*        │
                     └─────────────┬────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        BrowseView            TestView           GuidedPractice
        (free practice)       (timed mock)      (microConcept loop)
              │                    │                    │
              └─────────┬──────────┴──────────┬─────────┘
                        ▼                     ▼
            POST /api/v2/user/progress    POST /api/v2/user/session-response
            POST /api/v2/user/progress/batch  (StudentResponse + StudentChapterProfile)
            POST /api/v2/test-results
            POST /api/v2/user/test-session
                        │
                        ▼
              ┌──────────────────────┐
              │  MongoDB (crucible)  │
              │ ──────────────────── │
              │  user_progress       │  ← canonical persona substrate
              │  student_chapter_    │  ← microConcept proficiency (rich)
              │      profile         │
              │  student_response    │  ← per-attempt log (guided mode)
              │  test_results        │  ← composite test docs (dashboard)
              │  questions_v2        │  ← question bank
              │  resource_links      │  ← bridge to livebooks/lectures
              └──────────────────────┘
                        │
                        ▼
              ┌──────────────────────┐
              │ Recommendation       │  ← bridge in place, gates closed
              │ Engine (stub today)  │     (lib/recommendationEngine.ts)
              └──────────────────────┘
                        │
                        ▼
              ┌──────────────────────┐
              │  Welcome Dashboard   │  ← /api/v2/user/welcome aggregator
              │  + livebook deeplinks│
              └──────────────────────┘
```

### 2.1 What's active, what's not

| Layer | Status |
|---|---|
| V2 question system (`questions_v2`, `/api/v2/*`, `/crucible/admin/*`) | **Active — only system to touch** |
| V1 question system (`questions`, `/api/questions/*`, `/the-crucible/admin/*`) | **Deprecated — do not write to** |
| Recommendation engine algorithm | **Stub** (returns `[]`); bridge wired |
| Premium / payment gating | **Not built** — launch blocker |
| Funnel analytics events | **Sparse** — only `chapter_opened`, `test-session`, `test-results` |

---

## 3. The three practice modes

A change to any mode that breaks the persona loop is a regression. All three
modes must produce comparable signal — that is the whole point.

| Mode | Component | Persistence path | Signal richness |
|---|---|---|---|
| **Browse** | `BrowseView.tsx` | `POST /api/v2/user/progress` per attempt (immediate) + `beforeunload` backstop | Per-attempt: correctness, selected_option, concept_tags, source='browse'. **Time-on-question not yet captured** (audit #12 — to fix). |
| **Test** | `TestView.tsx` | `POST /api/v2/user/progress/batch` + `POST /api/v2/test-results` + `POST /api/v2/user/test-session`, all unconditionally on submit | Per-attempt + per-test composite + time_spent_seconds + marked_for_review |
| **Guided** | `GuidedPracticeWizard.tsx` + `AdaptiveSession*` | `POST /api/v2/user/session-response` per attempt | Richest: includes microFeedback, stuckPoint, viewedSolutionBeforeAnswer |

### 3.1 The submit-then-reveal contract — UX invariant

In all three modes, **selecting an option must not auto-reveal the answer**.
The student selects → the system locks the selection on submit → the system
reveals correctness and solution. This is non-negotiable because:

- An auto-reveal lets the student "test" multiple options to find the right
  one, polluting the correctness signal beyond use.
- "Time to correct answer" measured under auto-reveal is meaningless for
  difficulty calibration.

If you add a new question type or a new mode, replicate the submit-then-
reveal pattern. See `BrowseView.onSelectOption` / `BrowseView.onSubmit` for
the canonical implementation.

### 3.2 The persistence + tiered-signal contract — data invariant

Two ideas combine here, and both must be honoured together. Reading either
in isolation will produce a wrong implementation.

**A. Persistence is immediate.** In all three modes, every submit results
in a POST that fires the moment the student commits, with `keepalive: true`,
plus a `beforeunload` / `pagehide` `navigator.sendBeacon` backstop. No
modal, no button, no "I'm done" gesture gates persistence — the May 2026
audit documented an incident where ~50 attempts per closed-tab session were
silently lost for months because of exactly that pattern.

**B. Persistence carries a *confidence tier*.** Browse-mode usage is
bimodal — half discovery / casual scrolling, half real practice — and
treating all browse data as equal-weight persona signal pollutes the
recommendation engine. We solve this by tagging every attempt with a
confidence tier and routing the tiers to different counter sets:

| Tier | Source | Mastery counters | Exposure counter | last_seen |
|---|---|---|---|---|
| `high`   | test, guided | ✅ | ✅ | ✅ |
| `medium` | browse default | ❌ | ✅ | ✅ |
| `low`    | browse session retroactively flagged "casual" | ❌ | ❌ | ✅ |

Mastery surfaces (weak-spot widget, recommendation engine, mastery_level,
overall_accuracy stat) read MASTERY counters only. Exposure surfaces
("you've seen N questions on Hyperconjugation", chapter familiarity)
read EXPOSURE. Casual attempts vanish from both — they only count as
"last seen" so the test generator still avoids re-showing the question.

**C. Browse exit modal — classification, not gating.** When the student
exits browse mode after answering at least one question, a modal asks:
*"Was this real practice, or just casual browsing?"* Two buttons:

- **Save to my progress** (default, primary) — closes the modal. Data
  stays at `medium`.
- **This was casual — don't count** — calls
  `PATCH /api/v2/user/progress/session-confidence` with the session id and
  `confidence: 'low'`. The endpoint walks `recent_attempts`, finds every
  attempt tagged with this session, decrements mastery + exposure
  counters, and tags them `low`. **No data is deleted.**

The modal is a *classification* tool, not a *save* gate. Closing the tab
mid-session still keeps everything at `medium` (default behaviour).

**D. session_id pipeline.** BrowseView generates a UUID per mount and
sends it on every attempt POST. Test mode and guided mode do not need a
session id — their attempts are always `high`-confidence and not
reclassifiable.

#### Invariant summary

If you find yourself doing any of the following, **stop**:

- Adding a "Save & Exit" / "Discard" button that controls persistence (re-read part A).
- Treating browse attempts as mastery signal — filtering on `times_attempted` and getting medium-confidence noise (re-read part B; mastery counters should already be HIGH-only).
- Storing tier as an enum on the schema but defaulting it to `medium` for test-mode attempts (test must always be `high`).
- Writing a new mode that doesn't pass `confidence` and `session_id` (or doesn't pass `session_id` for browse-style modes).

---

## 4. Data models — the persona substrate

### 4.1 `UserProgress` — the canonical persona document

One document per Supabase user (keyed by `_id = supabase user id`). This is
the substrate every persona surface (dashboard, weak-spot widget,
recommendation engine input) reads from.

**Critical sub-structures:**

| Field | Purpose | Notes |
|---|---|---|
| `recent_attempts[]` | Capped at 200, used for activity feed + `reclassifyBrowseSession` | Most recent first (unshift). Each element carries `confidence` + optional `session_id` — see §4.1.1 |
| `all_attempted_ids[]` | Uncapped, lightweight per-question index. Drives the test generator's "avoid recently-tested" logic | **HIGH-confidence attempts only** populate this. Browse-mode (medium/low) intentionally does not — see §3.2 part B |
| `chapter_progress: Map<chapter_id, …>` | Per-chapter rollup: total/correct/accuracy/last_attempted/mastery_level. **HIGH-confidence only** | mastery_level is computed: `Mastered (≥20 attempts, ≥80%) > Proficient (≥10, ≥60%) > Learning (≥5) > Beginner` |
| `concept_mastery: Map<tag_id, …>` | **The persona substrate.** Two parallel counter sets per tag: mastery (HIGH only) and exposure (HIGH+MEDIUM) | See §4.2 — strict shape contract |
| `starred_questions[]` | Bookmarks | Currently uncapped — audit #9 flagged FIFO eviction needed |
| `test_sessions[]` | Last test sessions for overlap detection | Capped to last 10 |
| `stats` | Lifetime totals + streak. **HIGH-confidence only** for `total_questions_attempted` / `total_correct` / `overall_accuracy` (browse should not inflate the dashboard's "official" mastery %) | Streak increment is currently broken — audit #18 |

#### 4.1.1 `IQuestionAttempt` shape

Every attempt — regardless of mode — is recorded as an `IQuestionAttempt` in
`recent_attempts[]`. The shape:

```ts
interface IQuestionAttempt {
  question_id: string;
  display_id: string;
  chapter_id: string;
  is_correct: boolean;
  time_spent_seconds: number;
  attempted_at: Date;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concept_tags: string[];
  source?: 'browse' | 'test' | 'guided';
  selected_option?: string | string[] | number | null;
  // Tier — see §3.2 part B. test/guided default 'high'; browse default 'medium';
  // browse retroactively casual-tagged → 'low'.
  confidence?: 'high' | 'medium' | 'low';
  // Browse-only: stable per-mount UUID. Used by reclassifyBrowseSession to
  // walk-and-relabel every attempt in the session without re-POSTing.
  session_id?: string;
}
```

`confidence` and `session_id` are optional in the schema for backwards
compatibility with pre-tier documents; **all new writers must set them**
(see the writer rule in §3.2 part D).

### 4.2 `concept_mastery` — strict canonical shape

This is the field every persona-driven feature depends on. Its shape is a
**locked contract** with two parallel counter sets:

```ts
interface IConceptMastery {
  tag_id: string;              // taxonomy id (e.g. 'tag_atom_3')
  tag_name: string;            // resolved via lib/taxonomyLookup.ts

  // ── MASTERY counters — HIGH-confidence only (test + guided + saved) ──
  times_attempted: number;
  times_correct: number;
  accuracy_percentage: number; // round(times_correct / times_attempted * 100)

  // ── EXPOSURE counter — HIGH + MEDIUM (browse default) ─────────────────
  exposure_count: number;

  // Updated for ANY non-low attempt (HIGH + MEDIUM update; LOW updates this
  // only — gives test generator a "last seen" signal even on casual touches).
  last_attempted_at?: Date;
}
```

#### Read rules — which counter set do I use?

| Surface | Counter | Why |
|---|---|---|
| Weak-spot widget | `times_attempted` ≥ 3, `accuracy_percentage` < 60 | Mastery — must be free of casual-browse noise |
| Recommendation engine input | mastery counters | Same |
| Mastery-level chip ("Proficient" etc.) | `chapter_progress` (HIGH only) | Same |
| "You've explored N concepts" headline | `exposure_count` (sum / count > 0) | Exposure — wants to reflect *all* engagement |
| Test generator's "avoid recently shown" | `last_attempted_at` | Last-seen — even casual touches count |
| Welcome dashboard chapter familiarity | `exposure_count` | Exposure |

#### Writer rules

Both writers (`recordAttempt` in `UserProgress.ts` and the batch route
`/api/v2/user/progress/batch/route.ts`) produce exactly this shape, with
`tag_name` looked up server-side via `getTagName(tag_id)` from
`lib/taxonomyLookup.ts`. Both honour the tier:

- HIGH attempt → increments mastery counters AND exposure_count AND last_attempted_at.
- MEDIUM attempt → increments exposure_count AND last_attempted_at only.
- LOW attempt → increments last_attempted_at only.

A retroactive reclassification (PATCH `/api/v2/user/progress/session-confidence`)
calls `reclassifyBrowseSession(sessionId, newTier)`, which walks every
attempt in `recent_attempts` matching the session id and **decrements old-tier
counters before incrementing new-tier counters** — so mastery and exposure
stay correct after the relabel. No data is deleted.

**Do not introduce a new writer that:**
- Writes a different field set (`total_attempted`, `correct_count`,
  `weak_areas`, etc. — those were the original shape and silently broke the
  feature for months).
- Writes without `tag_id` / `tag_name`.
- Skips `last_attempted_at` (recency decay needs it).
- **Conflates the two counter sets** — never write a single `times_attempted`
  that includes browse-mode counts. That defeats the entire tiered model and
  re-poisons the recommendation engine. The point of `exposure_count` is to
  *separate* exposure from mastery, not merge them.

If a new aggregate is needed, *extend* this interface — don't fork it.

### 4.3 `StudentChapterProfile` — the multi-dimensional profile

Lives in `lib/models/StudentChapterProfile.ts`. One doc per (user, chapter)
pair. Tracks dimensions richer than concept_mastery — microConcept-level
proficiency, dominant weakness, accuracy trends. Updated by the guided-
practice flow via `lib/profileEngine.ts`.

**Known gap (audit #5):** browse and test modes do not currently write to
this. The fancy persona is empty for ~90% of student traffic. The plan is
to have all three modes write to both `UserProgress.concept_mastery` (for
the lightweight rollup) AND `StudentChapterProfile` (for the rich
microConcept signal). Until that's done, treat `StudentChapterProfile` as
the source of truth ONLY for guided-practice users, and `concept_mastery`
as the source of truth for everyone else.

### 4.4 `TestResult` — composite test document for dashboard

One doc per submitted test. Stores per-question outcomes + score + timing.
Always persisted unconditionally on test submit (fix #3, May 2026). The
`saved_to_progress` flag distinguishes "show in dashboard" (true, default)
from "don't" (a future "this was just practice" toggle), but the doc itself
is always written.

### 4.5 `StudentResponse` — guided-mode per-attempt log

Per-attempt document for guided-practice sessions. Includes microFeedback,
stuckPoint, viewedSolutionBeforeAnswer. Drives the StudentChapterProfile
updates. If you add a new mode that supports rich feedback, write to this
collection too — don't invent a parallel one.

### 4.6 `ResourceLink` — the recommendation bridge

`lib/models/ResourceLink.ts`. Junction document mapping a topic_tag_id (and
optionally micro_concept) to a learning resource (book_page, video_lecture,
flashcard_deck, external). This is the table the recommendation engine
queries to answer "the student is weak on X — where can they LEARN it?"

**Today the collection is empty.** The schema is in place so the moment
livebook content is ready, populating this collection (admin authoring tool
or CSV import) is the only thing that activates the recommendation engine.

---

## 5. The persona pipeline

```
   student attempt (browse / test / guided)
              │
              ▼
   /api/v2/user/progress           /api/v2/user/progress/batch         /api/v2/user/session-response
              │                              │                                        │
              └─────────────┬────────────────┘                                        │
                            ▼                                                         ▼
                     UserProgress doc                                      StudentResponse doc
                  ┌──────────┴───────────┐                                            │
                  ▼                      ▼                                            ▼
      recent_attempts[200]      concept_mastery Map                       StudentChapterProfile
      all_attempted_ids[*]      chapter_progress Map                      (microConcept rollups)
      stats (totals, streak)
                            │
                            ▼
            ┌───────────────────────────────────┐
            │  Persona-driven surfaces:         │
            │  - /api/v2/user/welcome           │  ← aggregator
            │  - /api/v2/user/recommendations   │  ← engine bridge
            │  - dashboard                      │
            │  - weak-spot widget               │
            └───────────────────────────────────┘
```

### 5.1 What signal each path captures

Browse and test serve different questions and the data is modelled as
different questions. Test is the source of truth for **mastery**. Browse
is the source of truth for **exposure**. (See §3.2 for the full tiered-
signal contract.)

| Signal | Browse (medium) | Browse → casual (low) | Test (high) | Guided (high) |
|---|---|---|---|---|
| Correctness | ✅ exposure | — | ✅ mastery | ✅ mastery |
| Selected option | ✅ | ✅ | ✅ | ✅ |
| Concept tags | ✅ | ✅ | ✅ | ✅ |
| Time on question | ❌ deliberate — too noisy in browse | ❌ | ✅ | ✅ |
| Skip-and-view-solution | ❌ deliberate — expected behaviour in browse | ❌ | n/a | ✅ |
| Marked for review | n/a | n/a | ✅ | n/a |
| MicroFeedback (confidence/stuck) | n/a | n/a | n/a | ✅ |
| Updates `concept_mastery` mastery counters | ❌ | ❌ | ✅ | ✅ |
| Updates `concept_mastery` exposure_count | ✅ | ❌ | ✅ | ✅ |
| Updates `concept_mastery` last_attempted_at | ✅ | ✅ | ✅ | ✅ |
| Updates `chapter_progress` / `stats.total_*` | ❌ | ❌ | ✅ | ✅ |
| Populates `all_attempted_ids` (test-generator dedup) | ❌ | ❌ | ✅ | ✅ |

#### Why these "gaps" are deliberate, not bugs

A previous version of this doc (and an audit punch list) listed
time-on-question and skip-and-view-solution as missing signal in browse
mode. **They are not gaps.** Capturing them would actively hurt the
persona:

- **Time on question in browse** has too low a signal-to-noise ratio
  (students leave tabs open, alt-tab to YouTube, walk away). Test mode
  already captures this signal where it actually means something.
- **Skip-and-view-solution in browse** is the *expected* legitimate use
  case (browsing to learn from solutions). Treating it as a weakness
  signal punishes the right behaviour.

If a future change thinks "we should capture browse time-on-question to
improve recommendations," re-read §3.2 first.

---

## 6. The recommendation bridge

The bridge has **three components**, all in place; the algorithm is gated.

1. **`ResourceLink` model** (`lib/models/ResourceLink.ts`) — the junction
   table. Empty today; populated when livebook/lecture content is authored.
2. **`recommendationEngine` module** (`lib/recommendationEngine.ts`) —
   typed `getRecommendations(userId, opts)` and `getResourceForConcept(tagId)`.
   Stub implementation returns `[]` / `null`. The intended algorithm is
   documented in the file header.
3. **`/api/v2/user/recommendations` route** — calls the engine. Returns
   `{ items: [], engine_status: 'awaiting_content' | 'active' }`. UI is
   built against this contract; flipping the engine on requires no client
   changes.

### 6.1 Activation checklist (post-launch)

When livebook/lecture content is ready:

1. Populate `resource_links` collection (admin authoring tool or CSV
   import). Each entry maps `topic_tag_id` → `(resource_type, resource_id,
   resource_url, resource_title)`.
2. (Optional) Backfill `Question.v2.solution.learn_more` on key questions
   for per-question depth links.
3. Replace the stub block in `getRecommendations` with the real algorithm
   (already documented in the file header — weak-concept filter, recency
   decay, ResourceLink lookup, fallback).
4. The "For you" row on the welcome dashboard populates automatically.

### 6.2 Question schema hook for per-question links

`Question.v2.ts` `solution.learn_more` carries optional `book_page_ids` and
`lecture_ids` arrays. Use this for "Stuck on this exact question? Read this
section" CTAs that don't need to go through the engine. Authoring is
optional — the engine falls back to topic-level ResourceLink rows.

---

## 7. API surface & auth

### 7.1 Canonical auth — only one path

**Every** mutating route under `/api/v2/*` must call:

```ts
import { getUserIdFromRequest } from '@/lib/auth';
const userId = await getUserIdFromRequest(req);
if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

`getUserIdFromRequest` (and `getAuthenticatedUser`) supports **both** the
`Authorization: Bearer <token>` header (used by client-side fetch) and
session cookies (used by SSR and `navigator.sendBeacon`). Do not add a new
inline `getUserId` function in any route. Do not import `createClient`
from `@supabase/supabase-js` for auth purposes — only for queries against
public tables.

CLAUDE.md §8.3 forbids `process.env.NODE_ENV === 'development'` as an auth
bypass — Vercel previews trigger that condition. Use `isLocalhostDev()`
from `lib/bookAuth.ts` if you genuinely need a localhost-only path.

### 7.2 Endpoint catalog

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v2/user/progress` | POST | Single attempt write (browse mode, primary). Honors `confidence` + `session_id` |
| `/api/v2/user/progress` | GET | Read starred + attempted IDs + last 3 sessions |
| `/api/v2/user/progress/batch` | POST | Batch attempts (test mode). Honors `confidence` + `session_id` per attempt |
| `/api/v2/user/progress/session-confidence` | PATCH | Reclassify all attempts in a browse session to a new confidence tier (used by the BrowseView "casual" button) |
| `/api/v2/user/test-session` | POST | Record test session for overlap detection |
| `/api/v2/test-results` | POST | Composite test result for dashboard |
| `/api/v2/user/session-response` | POST | Guided-mode rich attempt |
| `/api/v2/user/chapter-profile` | GET/POST | Multi-dimensional profile read/write |
| `/api/v2/user/starred` | GET/POST | Bookmarks |
| `/api/v2/user/stats` | GET | Lifetime stats for dashboard |
| `/api/v2/user/welcome` | GET | Personalised welcome aggregator |
| `/api/v2/user/recommendations` | GET | Engine output (stub today) |
| `/api/v2/user/example-views` | POST | Worked-example view tracking |
| `/api/v2/questions/:id/flag` | POST | Student question-issue reports |
| `/api/v2/questions/:id/stats` | GET | Community option-distribution |

If you add an endpoint, add it here.

---

## 8. UX principles

These show up across every mode, every screen. New surfaces must conform.

1. **Submit-then-reveal**, never auto-reveal. (§3.1)
2. **Persistence is immediate, not gated**, with a `beforeunload` backstop. (§3.2)
3. **Dark theme only**, with chapter-category accent colour:
   - Physical → `#38bdf8` (sky)
   - Organic → `#c084fc` (violet)
   - Inorganic → `#34d399` (emerald)
   - Practical → `#fbbf24` (amber)
   - Default → `#fb923c` (orange)
   The accent flows through sidebar, active states, header badge, ambient
   gradients, and the Submit button (subtle tinted glass, never loud
   saturated fill).
4. **Topic-first organisation**. The sidebar / drawer surfaces topics from
   `taxonomyData_from_csv.ts`, ordered by `NCERT_TOPIC_ORDER` when
   defined. Don't introduce a parallel taxonomy.
5. **No watermark on browse view**. Anti-piracy lives at the auth wall and
   on user-triggered exports — not on the live UI.
6. **Stats chips, not stats text**. Header stats are colored chips
   (Answered neutral, Accuracy emerald, Saved/Bookmarks amber).
7. **Question number is plain bold mono**, not a serif "№ 01". Question
   text is sans (Geist), not serif. Both decisions are intentional —
   serifs on dark read flat at the sizes we use.

---

## 9. Critical invariants — do not violate

These are the non-negotiables. Each has been broken at least once and the
incident is the reason it's listed.

| Invariant | Why | Check before merging |
|---|---|---|
| All persistence is immediate on submit | Tab-close data loss | grep for `Save & Exit`, `Save Progress`, `setShowSaveModal`. None should gate persistence. |
| Every attempt POST carries `confidence` + (for browse-style modes) `session_id` | Tier model collapses without it | grep new POSTs to `/api/v2/user/progress*` — they must include `confidence` |
| Mastery counters (`times_attempted`, `accuracy_percentage`, `chapter_progress`, `stats.total_*`) only move on HIGH-confidence attempts | Browse signal poisons mastery | Read `recordAttempt` and the batch route — every counter increment is gated on tier |
| Test-mode attempts are always HIGH; browse-mode attempts are always MEDIUM (default) or LOW (casual-tagged) | Wrong tier = wrong counter set = wrong recommendations | grep TestView for `confidence:` — must be `'high'`. grep BrowseView — must be `'medium'`. |
| `concept_mastery` writes use the canonical shape with BOTH counter sets | Persona corruption | Diff against `IConceptMastery` in `lib/models/UserProgress.ts` — must include `exposure_count`. |
| All `/api/v2/*` mutating routes use `getUserIdFromRequest` | Auth drift across 9+ routes | grep `function getUserId` in `app/api/v2/` — must return zero hits. |
| V1 (`questions` collection, `/the-crucible/admin/*`) is read-only / untouched | Migration nightmare | grep new code for `models.ts` (V1) or `/api/questions/`. |
| Taxonomy edits go through the dashboard, not direct file edits | Source-of-truth drift | If `taxonomyData_from_csv.ts` is touched in a PR, dashboard usage must explain why. |
| Submit-then-reveal across all modes | Polluted correctness signal | New question types must replicate `BrowseView.onSelectOption` / `onSubmit` separation. |
| The recommendation bridge stays wired even while empty | UI-side regressions when engine activates | `/api/v2/user/recommendations` and `lib/recommendationEngine.ts` must keep returning the same contract; only the inner algorithm changes. |
| Chapter accent colour is derived from `currentChapter.category`, not hardcoded | Cross-chapter inconsistency | grep new screens for hardcoded `#fb923c` / `#7c3aed`. |
| `NODE_ENV === 'development'` is never used as an auth bypass | Vercel preview leak | grep `NODE_ENV === 'development'` in any route handler — must be zero. |

---

## 10. Common pitfalls

Patterns that look correct in isolation but break the persona pipeline.
The list is incomplete by design — add to it whenever you catch a class of
bug.

- **Buffering attempts in React state until "Save".** Tab close = data loss.
  Always POST on submit; modal is a *classification* surface, not a save gate.
- **Treating browse data as mastery signal.** Reading `concept_mastery` and
  filtering on `times_attempted >= 3 && accuracy < 60` is correct *because*
  the writers already restricted those counters to HIGH. If you change the
  writers to count browse into mastery, the weak-spot widget will fill up
  with noise from accidental clicks. Add to `exposure_count` instead.
- **Adding a "casual" toggle that deletes data instead of reclassifying.**
  Casual attempts must remain in `recent_attempts` (the test generator
  needs `last_attempted_at` to avoid re-showing the question; the audit
  trail needs the row). The PATCH endpoint relabels — it never deletes.
- **Capturing browse time-on-question or skip-and-view-solution.** These
  were misclassified as "audit gaps" in an earlier version of this doc.
  They are deliberate omissions; see §5.1 "Why these gaps are deliberate."
- **Forgetting to set `session_id` in a new browse-style mode.** Without
  it, the casual-tag PATCH cannot find the attempts to relabel. Test and
  guided do not need session_id (their attempts are always HIGH and not
  reclassifiable).
- **Local `getUserId` in a new route** because it's "just a small helper."
  Drifts from the canonical version, often missing cookie auth, and now you
  have 10 inline copies instead of 9.
- **Sending the client's `score` field** straight to MongoDB. Mass
  assignment — a malicious client can claim 100% on a 5-question test.
  Always recompute server-side from canonical answers.
- **Hardcoding `tag_id` strings in route handlers.** Use `getTagName()`
  from `lib/taxonomyLookup.ts` for display; treat tag ids as opaque
  identifiers everywhere else.
- **Adding a new "weakness" surface** that reads from `concept_mastery`
  with the old field names (`total_attempted`, `correct_count`,
  `weak_areas`). Those names are dead — read `times_attempted`,
  `times_correct`, `accuracy_percentage`.
- **Forking the persona model** because the existing one "doesn't quite
  fit." The cost of two parallel persona models is much higher than the
  cost of extending one. We're already paying that cost with
  `UserProgress` vs `StudentChapterProfile`; do not add a third.
- **Referencing a `canvas` MongoDB database**. There is no canvas
  database. The cluster is `crucible-cluster`, the database is
  `crucible`. The word "canvas" appears only in the R2 bucket name.

---

## 11. How to safely extend

### 11.1 Adding a new question type

1. Extend the `Question.v2.ts` `type` enum.
2. Add option/answer shape if needed.
3. Implement select / submit / reveal in the SAME submit-then-reveal
   pattern as existing types in `BrowseView.renderOption` /
   `BrowseView.onSubmit`.
4. Make sure attempts produce the same `concept_tags`, `is_correct`,
   `selected_option` payload — the persona pipeline cares about those.

### 11.2 Adding a new practice mode

1. Persist immediately on submit. Use existing endpoints
   (`/api/v2/user/progress` for single attempts, `/batch` for groups,
   `/test-results` for composite test docs). Do not invent a parallel
   collection.
2. Pass `source: '<mode_name>'` in the attempt payload so the persona can
   distinguish modes.
3. Add a `beforeunload` / `pagehide` backstop using `navigator.sendBeacon`.
4. Update the §3 table.
5. Update the persona pipeline diagram in §5.

### 11.3 Adding a new persona signal

1. Extend `IQuestionAttempt` (lifetime feed) and the relevant route's
   payload validation.
2. Decide whether the signal rolls up into `concept_mastery` (lightweight,
   per-tag) or `StudentChapterProfile` (rich, microConcept-level). Most
   new signals belong in `StudentChapterProfile`.
3. If the signal influences mastery, document the formula in a comment on
   the schema field — not in this file (which would rot).
4. Add the signal to the §5.1 capture-matrix table here.

### 11.4 Activating the recommendation engine

Follow §6.1.

### 11.5 Adding a new dashboard surface

1. If it needs aggregated read data, extend `WelcomePayload` in
   `/api/v2/user/welcome/route.ts` — don't add a new aggregator.
2. Render against the existing payload contract; handle empty fields
   gracefully (zero-state copy, not a broken layout).
3. Add an analytics event for the surface being viewed and clicked.

---

## 12. Document maintenance

This file lives at `_agents/CRUCIBLE_ARCHITECTURE.md`. It is referenced
from:

- `CLAUDE.md` (project root) — top-level guidance for any agent working
  on the codebase.
- New PRs touching `app/the-crucible/`, `app/crucible/admin/`,
  `app/api/v2/`, or `lib/models/UserProgress.ts` /
  `lib/models/StudentChapterProfile.ts` / `lib/recommendationEngine.ts`
  should reference (and update) this file in the description.

Whenever you change anything in §3 (modes), §4 (data models), §5 (persona
pipeline), §6 (recommendation bridge), §7 (auth/endpoints), §8 (UX
principles), or §9 (invariants), update this file in the same PR. A doc
that's stale by one PR is more harmful than no doc at all.
