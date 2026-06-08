# ADR-012: Decouple Live Books from Crucible at the recommendation layer

**Date:** 2026-06-07
**Status:** Accepted — **amends [ADR-011](011-unified-learner-persona.md)** (does not supersede it)
**Touches Crucible-protected paths** — see [`_agents/CRUCIBLE_ARCHITECTURE.md`](../CRUCIBLE_ARCHITECTURE.md) and [`_agents/plans/UNIFIED_LEARNER_PERSONA.md`](../plans/UNIFIED_LEARNER_PERSONA.md).

## Context

ADR-011 established a unified, skill-keyed persona feedable by every surface, with a **cross-surface recommendation bridge** as a headline payoff: a student weak on a skill in Crucible would be redirected to the matching Live Book page/video (`ResourceLink` → "read/watch this"). Phase 0–3a built the substrate; the cross-surface recommendation consumer was wired but gated behind content (only 8 grammar `ResourceLink` rows existed).

On 2026-06-07 the team re-evaluated and concluded the cross-surface redirect is the wrong investment for the current stage:

1. **Crucible solutions are being designed to be self-sufficient** — each solution explains the underlying concept in depth and walks the sibling-question variants in-context. The teaching happens at the point of being stuck, inside the solution. A redirect to a separate book page *after* that solution is redundant.
2. **Resource-level targeting (e.g. exact video timestamps) is over-personalisation.** Exam-track students can self-navigate to the right page/video/topic when they choose to. The marginal benefit doesn't justify the machinery.
3. **The cross-surface tagging + sync discipline is the single largest complexity and dependency** in the programme (skill-graph-first ordering, content tagging, keeping two surfaces in lockstep). Removing it lets Live Books and Crucible develop **independently**, at their own pace.

## Decision

**Decouple Live Books from Crucible at the recommendation layer.**

1. **Drop the cross-surface redirect** ("weak in Crucible → go consume this Live Book resource"). The engine no longer drives traffic from Crucible to Books based on performance.
2. **Keep the durable cross-*subject* persona inside Crucible** (chem/phys/math/bio in one skill-keyed model). This is the moat and it is unaffected — what's dropped is the cross-*surface* recommendation, not the cross-*subject* model.
3. **Live Books may still *feed* the persona** (the existing fire-and-forget book→persona dual-write) for a holistic "what does this student know across surfaces" view that B2B teacher dashboards will want — but this is non-load-bearing and optional.
4. **Park, do not delete.** The `ResourceLink` model, the recommender's read/watch path, the book→persona adapter, and the seeded grammar links all stay in the tree — dormant, zero ongoing cost, and revivable if cross-surface recommendation is ever revisited.
5. **Re-centre the adaptive engine on in-Crucible practice.** The AI tutor remains, scoped to Crucible (explain weaknesses, pick the next question/skill); it already degrades gracefully when no external resource exists, so this requires *removing* scope, not rework.
6. **New flagship feature: question grouping / variant-skipping** — cluster near-identical questions (same micro-concept + same solution template) so a student who proves one variant can skip its derivatives (~500 questions/chapter → ~50–60 distinct varieties). Deferred until 2–3 chapters per subject are fully tagged + solved; design spec to be written then.

## Consequences

**Positive:**
- Removes the largest source of complexity and the "engine blocked on lecture content / ResourceLinks" dependency from the engine's critical path.
- Books and Crucible ship independently — no sync discipline.
- Teaching is concentrated at the highest-intent moment (inside the solution), which is pedagogically stronger than a redirect.
- Nothing built is wasted: the persona, mastery model, spaced repetition, event log, AI tutor, and multi-tenancy all operate within Crucible; the dropped piece (cross-surface redirect) degrades gracefully to "no external resource."

**Negative / costs (eyes open):**
- **The hard work is relocated, not eliminated** — it moves from cross-surface tagging/sync onto **solution quality**, which is now mission-critical with no fallback. Every Crucible solution must genuinely be self-sufficient.
- **Lose the cross-surface "wow" demo** ("weak → watch the book"). The cross-subject moat survives; the cross-surface flourish does not.
- **Discoverability for weaker/younger students** who don't know what they don't know is now on Live Books' own navigation/search, not on the engine. Mitigate with good in-book navigation, not by re-coupling.

## Invariants still preserved (unchanged from ADR-011)
- `UserProgress` mutated only through `writer.ts`; `concept_mastery` keeps its two-counter-set shape; mastery moves on HIGH confidence only.
- No new parallel persona collection; the persona stays `UserProgress.concept_mastery` (+ `StudentChapterProfile`), now exercised within Crucible.
- The recommendation bridge keeps its API contract; it simply has fewer external resources to return (often none), which the consumers already handle.

## What this changes in the docs
- `_agents/plans/UNIFIED_LEARNER_PERSONA.md` carries a "Direction change 2026-06-07" banner pointing here; its cross-surface-recommendation sections are read through this amendment.
- `_agents/PROJECTS.md` cockpit row + dependency section updated: the engine is no longer blocked on cross-surface content; next action is "finish 2–3 chemistry chapters, then build question grouping."
