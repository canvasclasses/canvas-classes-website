# BITSAT 30-Day Plan — UI/UX Redesign

**Status:** Design approved · Date: 2026-04-22
**Scope:** `/bitsat-chemistry-revision` only. UI/UX only — no functionality changes.

---

## 1. Context

The current page (`app/bitsat-chemistry-revision/BitsatRevisionClient.tsx`, 1405 lines) is a single long-scroll marketing page: hero → Session 1 post-mortem (4 stat cards, donut, bar chart, 5 trap cards) → 30-day plan (4 phase accordions) → exam-day tactics → FAQ → footer CTA.

User-reported problems:

- Too much marketing/scare content before users reach the actionable plan.
- Heavy scrolling, dense colour use, multiple accent tones — reads as "AI slop".
- The roadmap feels buried; doesn't feel like a proper 30-day course experience.
- Inconsistent with "course platform" expectations (Udemy/Coursera patterns).

Progress persistence is verified **localStorage-only** (`STORAGE_KEY = 'bitsat-chem-plan-v1'`). No DB sync exists. Redesign does not add one.

---

## 2. Goals

1. Split marketing from the course itself. Landing page ≠ learning surface.
2. Make the 30-day plan feel like a real course: curriculum always visible, one day at a time, clear progress.
3. Consistent with existing Canvas design tokens (dark theme, Geist/Outfit fonts, `#050505`/`#0B0F15` surfaces, `border-white/[0.06]`).
4. Less flashy: remove orange→amber gradient as the dominant accent; replace with flat `#3b82f6` (blue-500) as the single accent.
5. Keep every resource, every day, every link. Preserve every existing behaviour (drawer, progress checkboxes, localStorage).

## 3. Non-goals

- No DB sync for progress.
- No changes to resources (videos, PDFs, flashcards, drawer iframe).
- No changes to taxonomy or content data.
- No mobile-app-specific UX — responsive web, but not a new app shell.
- No SEO regressions: current JSON-LD + metadata preserved on the landing page.

---

## 4. Target architecture

### 4.1 Route split

| Route | Purpose |
|---|---|
| `/bitsat-chemistry-revision` | **Landing.** Kept as the SEO-indexed marketing surface. Trimmed down: hero + Session 1 post-mortem + exam-day tactics + FAQ + footer. NO 30-day plan here. Primary CTA "Open the Plan" → `/bitsat-chemistry-revision/plan`. If localStorage has progress > 0, secondary CTA "Resume Day {N}" → `/bitsat-chemistry-revision/plan/day-{N}`. |
| `/bitsat-chemistry-revision/plan` | **Course shell.** Default view: landing on Day 1 (or the first incomplete day if the user has progress). |
| `/bitsat-chemistry-revision/plan/day-[n]` | **Deep-linkable day view.** Renders the course shell scrolled/focused on day `n`. Shareable URLs. |

Existing canonical URL for the landing page stays `/bitsat-chemistry-revision`. Structured-data (FAQ JSON-LD) stays on the landing.

### 4.2 Course shell layout (Option B with collapsible rails)

Three columns + sticky top bar + sticky bottom action bar:

```
┌─ 2px progress rail ────────────────────────────────────────────┐
│ nav: ← Overview | BITSAT Chemistry · 30-Day Plan     12/30 40%│
├────────────┬──────────────────────────────────────┬────────────┤
│ ‹          │                                       │          ›│
│ Curriculum │  Day content (breadcrumb, pill,       │ Checklist │
│ ‒ phase 1  │  title, subtitle, tip, videos,        │           │
│ ‒ phase 2  │  notes, flashcards)                   │           │
│ ‒ phase 3  │                                       │           │
│ ‒ phase 4  │                                       │           │
├────────────┴──────────────────────────────────────┴────────────┤
│ ← Day 04 Environmental    [Mark Day Complete]    Day 06 →      │
└────────────────────────────────────────────────────────────────┘
```

- **Left rail (272px / 56px collapsed):** Curriculum. Phase groups with day rows. Completed days: emerald check + emerald day-number in mono. Active day: `rgba(59,130,246,0.08)` background tint, blue-400 day-number, blue-500 ring on the check circle. Overall progress card at the top.
- **Main content:** Breadcrumb → day pill (blue `DAY 05` tag + phase name) → serif-weight Outfit H1 → subtitle → tip callout (blue-tinted — replaces current amber) → Videos/Notes/Flashcards sections each with count and resource cards. Resources remain single-card-per-row (already the pattern in the existing drawer-opening code — just visually cleaner).
- **Right rail (256px / 0px collapsed):** Checklist only — no "Up Next" card, no metadata. Title "Lock this in", subtitle, up-to-three todo rows.
- **Footer action bar:** `← Day N-1 · Title | [Mark Day Complete] | Title · Day N+1 →`. Sticky. Adjusts `left` and `right` offsets as rails collapse.
- **Collapse behaviour:** chevron at top of each rail toggles a body class (`left-collapsed`, `right-collapsed`). Right rail fully hidden when collapsed; a fixed "Checklist" edge tab on the right reopens it.

### 4.3 Visual language

Using **only** existing Canvas tokens — no new palette or fonts.

| Token | Value | Source |
|---|---|---|
| Page bg | `#050505` | CLAUDE.md |
| Card bg | `#0B0F15` | CLAUDE.md |
| Surface bg | `#151E32` | CLAUDE.md |
| Border 1 | `rgba(255,255,255,0.05)` | existing |
| Border 2 | `rgba(255,255,255,0.08)` | existing |
| Primary accent (new for this page) | `#3b82f6` (blue-500) | already loaded in `globals.css` for `newhero-*` |
| Accent tint bg | `rgba(59,130,246,0.08)` | — |
| Accent text | `#93c5fd` (blue-300) | — |
| Success (done) | `#10b981` (emerald-500) | existing |
| Body font | Geist (via `--font-geist-sans`) | `app/layout.tsx` |
| Display font | Outfit (via `--font-outfit`) | `app/layout.tsx` |
| Mono font | Geist Mono | `app/layout.tsx` |

**No gradients anywhere** on this page. The previous `from-orange-500 to-amber-500` gradient used on hero CTA / Mark Complete / progress bar is replaced by flat `#3b82f6`. (This is a deliberate override of the global pattern — scoped only to this redesign, since the user explicitly rejected orange/amber as "punchy" and "flashy".)

---

## 5. Component breakdown

New files under `app/bitsat-chemistry-revision/`:

```
/bitsat-chemistry-revision
├── page.tsx                       (landing — updated)
├── BitsatLandingClient.tsx        (renamed from BitsatRevisionClient.tsx, trimmed)
├── plan/
│   ├── page.tsx                   (redirect/default day)
│   ├── day/[n]/
│   │   └── page.tsx               (per-day deep link)
│   ├── PlanShell.tsx              (course shell: layout + rails + nav)
│   ├── CurriculumRail.tsx         (left rail)
│   ├── ChecklistRail.tsx          (right rail)
│   ├── DayContent.tsx             (main column)
│   ├── ResourceCard.tsx           (single card row, replaces chip)
│   ├── TipCallout.tsx             (blue-tinted)
│   ├── FooterActions.tsx          (prev / complete / next)
│   └── planData.ts                (PHASES exported from here — currently inline)
```

`planData.ts` holds the exact `PHASES` array from the current file, unchanged. `RESOURCE_META` also moves here.

The existing `ResourceDrawer` from `BitsatRevisionClient.tsx:763` is lifted to `plan/ResourceDrawer.tsx` and reused unchanged.

Existing `AnimatedCounter`, `DonutChart`, `BarChart` stay in `BitsatLandingClient.tsx` — they're only used on the landing.

### Landing page trim (`BitsatLandingClient.tsx`)

Kept sections:
- Hero (title + subtitle + primary CTA "Open the Plan" + secondary CTA "Session 1 Post-Mortem" + Resume Day N if progress exists)
- Session 1 Post-Mortem (4 stat cards + donut + bar + 5 trap cards)
- Exam-Day Tactics (4 rule cards)
- FAQ
- Footer CTA ("Open the Plan")

Removed sections:
- **30-day plan preview** — moves entirely to `/plan`.
- Footer copy about "bookmark this page, come back every day" is replaced with "Open the Plan" button only.

Accent re-palette on landing: the hero "Start Day 1" and "Open the Plan" orange-amber gradient is replaced with flat `#3b82f6`. Red/amber/emerald/purple in stat / trap / tactic cards stay (they're semantic — red for "trap", emerald for "free marks", etc.).

---

## 6. Functionality preservation

Every existing behaviour is preserved:

| Behaviour | Today | After |
|---|---|---|
| Day checkbox persistence | `localStorage` `bitsat-chem-plan-v1` | unchanged |
| Open resource in drawer | `ResourceDrawer` iframe | unchanged, lifted into `plan/` |
| Phase accordion state | `useState('phase1')` | replaced by "active phase = active day's phase" (curriculum rail is always expanded, all phases visible) |
| FAQ expand | `useState` per FAQ | unchanged |
| Hero CTA anchors (`#plan`, `#post-mortem`) | in-page anchors | `#post-mortem` stays, `#plan` becomes a link to `/plan` |
| SEO metadata / JSON-LD | in `page.tsx` | stays on landing |

---

## 7. Right-rail checklist data

The right rail displays a per-day "Lock this in" checklist with 2–3 items. The current `Day` type has only a single optional `tip: string`.

**Decision: extend the `Day` type with `checklist?: string[]`.**

- New optional field populated with 2–3 short imperatives per day, derived from the existing `focus` and `tip` strings (authoring task during implementation).
- Check state is **session-only** — tracked in React state, not persisted. No new localStorage keys, no new API calls. Closing/reopening the tab resets the checks. This keeps "don't change functionality" honest: progress persistence stays exactly as it is today (day-level only).
- Days without a checklist field render a collapsed right rail by default (edge-tab still available).

This is the smallest change that delivers the approved UX:
- Same kind of content as `focus`/`tip` (static strings in `planData.ts`).
- No new persistence surface.
- No coupling to Supabase, Mongo, or server actions.

---

## 8. Risks & migration notes

- **SEO:** removing the 30-day plan from the landing drops ~400 lines of indexable content. Landing keeps the post-mortem, traps, tactics, FAQ — still substantial. `/plan` and `/plan/day/[n]` get their own metadata so deep-linked days are indexable too.
- **Existing shared links:** any inbound link to `/bitsat-chemistry-revision#plan` should redirect to `/bitsat-chemistry-revision/plan`. Trivial in `page.tsx` via a client-side redirect on hash detection, or simply removing the `#plan` anchor and letting the anchor fall through (the section won't exist).
- **localStorage key stays unchanged.** Users with existing progress keep it.
- **Sitemap:** `/bitsat-chemistry-revision` priority 0.9 already in `app/sitemap.ts:33`. Add `/bitsat-chemistry-revision/plan` as a second entry.

---

## 9. Success criteria

- Landing page reads as a focused marketing surface — no 30-day accordion, hero + post-mortem + tactics + FAQ, single blue CTA.
- `/plan` renders a three-column course shell; both rails collapsible; sticky footer actions.
- Progress from localStorage is reflected everywhere: curriculum rail checks, progress chip, progress rail width, completion state on the current day.
- No new dependencies. No new fonts. No new colour tokens outside `#3b82f6`.
- `npm run build` succeeds; no new type errors; no ESLint warnings.
- Existing drawer-opening behaviour works for every resource kind.
