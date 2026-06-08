# ADR-011: Unified Learner Persona across Crucible and Live Books

> **⚠️ AMENDED by [ADR-012](012-decouple-livebooks-from-crucible.md) (2026-06-07):** the cross-*surface* recommendation bridge described here ("weak in Crucible → go consume a Live Book resource") is **dropped**. Live Books and Crucible are decoupled at the recommendation layer; the engine is re-centred on in-Crucible adaptive practice. The cross-*subject* persona, the writer/tier invariants, and the no-fork rule below all still stand. Read this ADR through ADR-012.

**Date:** 2026-06-06
**Status:** Accepted (recommendation-bridge portion amended by ADR-012)
**Full design:** [`_agents/plans/UNIFIED_LEARNER_PERSONA.md`](../plans/UNIFIED_LEARNER_PERSONA.md)
**Touches Crucible-protected paths** — see [`_agents/CRUCIBLE_ARCHITECTURE.md`](../CRUCIBLE_ARCHITECTURE.md) §3.2, §4, §6, §9.

## Context

Student progress lives in two disconnected models:

1. **Crucible** — a mature, tiered, skill-keyed learner model (`UserProgress.concept_mastery` + `StudentChapterProfile`), written only through `packages/persona/writer.ts`, with a recommendation bridge (`ResourceLink` + `recommendation-engine.ts`) that is wired but **stubbed** (`getRecommendations` returns `[]`, awaiting content).
2. **Live Books** — a separate lightweight model (`book_practice_attempts` + `practiceSelector.ts`), scoped to a single book, with its own in-session adaptive selector.

Neither knows about the other. We want one continuous persona spanning a student's whole journey (Class 8 → 10 → JEE/NEET), feedable by every surface, readable by a future AI tutor, and rollup-able for B2B school dashboards.

A new collection per surface ("a third persona model") is explicitly forbidden by CRUCIBLE_ARCHITECTURE.md §10: *"Forking the persona model is a sin… do not add a third."*

## Decision

**Converge onto the existing Crucible persona; do not fork.**

1. **The unified persona IS `UserProgress.concept_mastery`, extended to a global skill-id namespace.** Crucible taxonomy tags (`tag_atom_3`) and Live Books skills (`bk:en9:ch4:reported_speech`) coexist as distinct opaque ids in the same map. No collisions, no cross-pollution (different ids), no new persona collection. Verified feasible: `getTagName(id)` already returns `?? id` for unknown ids, so book skills flow through the existing writer.
2. **A canonical Skill Graph** (new, additive) gives every assessable item — Crucible question, book practice MCQ, Apply challenge, future lecture/flashcard — a global skill id, with prerequisite edges (a DAG) enabling "learn this first" and "unlock next."
3. **Live Books writes through the canonical writer.** A `@canvas/persona` adapter constructs a valid `IQuestionAttempt` (`confidence:'high'`, `source:'book_practice'`, `concept_tags:[skillId]`) and calls `applyAttemptToProgress`. The Live Books practice route dual-writes (keeps `book_practice_attempts` for the existing selector; adds the unified persona write) fire-and-forget so it can never break the student flow.
4. **Activate the recommendation engine** per §6.1 once `ResourceLink` is seeded (Kaveri pages first). Its API contract is unchanged; only the inner algorithm flips on.
5. **A dedicated immutable `learning_events` log is deferred to Phase 1** — it is a producer/audit spine for replayability, not a competing persona, and is only justified once the 200-entry `recent_attempts` window is insufficient.
6. **AI (Phase 2)** reads a versioned persona snapshot (a read-projection over the existing models via `contract.ts` classifiers); it never queries raw events and is guardrailed to the skill graph + real `ResourceLink` rows.
7. **B2B (Phase 3)** adds a `tenant_id` dimension + teacher rollups + LTI/xAPI/SSO + compliance. The tenant dimension should be planned early because it is brutal to retrofit.

## Consequences

**Positive:** one continuous cross-subject/class/surface persona; no third model; reuses the tested writer + tier contract; the stubbed recommender finally has cross-surface data + resources to recommend; AI- and B2B-ready by construction.

**Negative / costs:**
- The Skill Graph imposes a **permanent tagging-discipline cost** — every item across every subject must carry correct skill ids and the prerequisite DAG must be maintained. This is the dominant risk (garbage in → garbage persona).
- Touching the protected write path (`writer.ts` / `UserProgress`) requires surgical, additive, fire-and-forget changes.
- Multi-tenancy and an event log are real future builds, deliberately deferred.

## Invariants preserved

- `UserProgress` mutated only through `writer.ts` (the adapter calls it, never bypasses).
- `concept_mastery` keeps its strict two-counter-set shape; book attempts are `high` (deliberate practice) so they correctly move mastery counters.
- The recommendation bridge keeps the same API contract; only the algorithm changes.
- No new parallel persona collection.
