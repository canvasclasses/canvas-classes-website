# Industry intelligence (scout output)

The [industry scout](../../workflows/INDUSTRY_SCOUT.md) writes dated scan files here: `YYYY-MM-DD-scan.md`. The [founder advisor](../../workflows/FOUNDER_ADVISOR.md) reads the most recent ones so its "what to build next" suggestions are already aware of competitor moves — the first-mover-advantage loop.

This folder is **institutional** (part of the Canvas Brain), not the founder's personal GBrain. It holds market/competitor observations, not Canvas internals.

## Each scan file follows this shape

```markdown
---
type: industry-scan
date: YYYY-MM-DD
sources: [vidiq, web]
---

# JEE/NEET landscape scan — YYYY-MM-DD

## 🔥 Breakout / trending (act on first-mover)
- <competitor channel / topic that is spiking> — <evidence: views/growth/keyword> — **opportunity for us:** <concrete>

## 🧭 Content gaps (they cover, we don't / vice-versa)
- <topic students search for that we lack> — evidence

## 📣 Competitor moves
- <launch / pricing / format change a rival made> — why it matters

## 📌 Watchlist (recurring, no action yet)
- <thing to keep watching>
```

Keep every line **evidence-backed** (a metric, a URL, a vidiq data point) — same grounding rule as the rest of the brain. No speculation presented as fact.
