# Crucible Landing Page — Redesign Instructions

## What we're changing
The current landing page (Mode Selection screen) is being replaced with a
single-page flow that has two collapsible steps:
**Step 1 — Chapter selector** → **Step 2 — Mode + session config**

No new pages or routes needed. This is purely a UI change to the existing
landing/home component.

---

## Step 1 — Replace the mode selection layout

Find the current landing page component (the one that renders
"What would you like to do?" with Guided Practice / Free Browse / Timed Test).

Replace its layout with two accordion-style step cards stacked vertically:

```
[ Step 1: Select a chapter  ›  ]   ← starts expanded
[ Step 2: How to practice?  ›  ]   ← starts collapsed + locked
```

Both steps share the same page. No navigation between them.

---

## Step 2 — Build Step 1 (Chapter Selector)

The chapter selector card works like this:

**Header** (always visible, tappable):
- Step number badge `1` (teal background when open or confirmed)
- Label: `STEP 1` in small caps
- Value: `"Select a chapter"` → updates to chapter name once selected
- Right side: chevron `›` rotates to point down when open, replaced by a
  green `✓` checkmark once a chapter is confirmed

**Body** (collapsible, starts open):
- Class 11 / Class 12 toggle tabs at the top
- Scrollable chapter list grouped by category (Physical / Inorganic /
  Organic / Practical), each with a colour dot and question count
- Use existing chapter data from wherever chapters are currently fetched

**On chapter tap:**
1. Highlight the selected row (teal left border + teal background tint)
2. Immediately collapse the Step 1 body (no separate confirm button needed)
3. Update the Step 1 header value to the selected chapter name
4. Add `confirmed` state to the header (show ✓, hide chevron, teal border)
5. Expand Step 2 body and scroll it into view smoothly (~280ms delay)

**Tapping Step 1 header after confirmation** re-opens it so the user can
change their chapter.

---

## Step 3 — Build Step 2 (Mode + Config)

**Header** (always visible, tappable to expand/collapse):
- Step number badge `2`
- Label: `STEP 2`
- Value: `"How do you want to practice?"`
- Starts collapsed. Opens automatically when chapter is confirmed.

**Body** (collapsible):

Before chapter is confirmed, show a locked state inside:
```
🔒  Pick a chapter first to unlock
```
This is dimmed (opacity 0.45) and not interactive.

After chapter is confirmed, show three mode options:

**A. Guided Practice card** (teal border, expanded by default):
- Header row: book icon, "Guided Practice" title, "RECOMMENDED" badge,
  collapse arrow
- Tapping header collapses/expands the config below it

- Inside the Guided Practice card, show three config sections:

  1. **Difficulty** — four buttons: Easy / Medium / Hard / Mixed
     Mixed is selected by default. Single select, one active at a time.

  2. **Session Length** — three tiles: 10 (Quick, ~12 min) / 20 (Standard,
     ~25 min) / 30 (Deep, ~40 min). 20 is selected by default.

  3. **"How this session works" toggle** — collapsed by default.
     Tapping expands three numbered steps:
     - `1` Warm-up (5 questions) — one per major concept, easy difficulty.
       We silently map your baseline.
     - `2` Adaptive practice — one at a time. After each, tap how it felt.
       We adjust the next question instantly.
     - `3` Session summary — see exactly what moved, what needs work, and
       what to focus on next time.

  4. **Start meta line** (above the CTA):
     `{questionCount} questions · {chapterName} · {difficulty} · {length}Q`
     Updates live as difficulty/length change.

  5. **"Begin Session →" button** — full width, teal background.
     On tap: navigate to the existing Guided Practice session flow, passing
     chapter, difficulty, and session length as params.

**B. Free Browse** — simple row card (icon + name + description + chevron).
Taps navigate to existing Free Browse flow.

**C. Timed Test** — same as Free Browse row. Taps navigate to existing
Timed Test flow.

---

## Step 4 — Routing / params

When "Begin Session →" is tapped, pass these to the existing session:
```
{
  chapterId:  <selected chapter id>,
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed',
  sessionLength: 10 | 20 | 30
}
```
Match the param names to whatever the existing Guided Practice session
already expects.

---

## Step 5 — Do NOT change

- The topbar / navbar — keep exactly as is
- The Guided Practice session screen itself (question cards, micro-feedback,
  summary) — untouched
- Free Browse flow — untouched
- Timed Test flow — untouched
- Chapter data source / API — use whatever currently feeds the chapter list

---

## Visual rules (match existing design system)

- Dark background: `#080909`
- Card background: `#0f1010`, border: `#222525`
- Teal accent: `#2dd4bf`, teal dim background: `rgba(45,212,191,0.09)`
- All tap targets minimum 44px height
- Collapse/expand animation: `max-height` transition,
  `0.38s cubic-bezier(0.16, 1, 0.3, 1)`
- Smooth scroll to Step 2 after chapter selection: `scrollIntoView` with
  `behavior: smooth`, `block: start`
- Add `-webkit-tap-highlight-color: transparent` to interactive elements
