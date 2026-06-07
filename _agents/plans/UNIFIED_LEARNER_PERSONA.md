# Unified Learner Persona — Architecture & Phased Plan

> **Status:** Design approved 2026-06-06. **Phase 0 shipped** (0a skill graph · 0b Books→persona dual-write · 0c ResourceLinks seeded · 0d recommender activated) — verified end-to-end against the live DB. Phase 1 is next.
> **Companion ADR:** [`_agents/adr/011-unified-learner-persona.md`](../adr/011-unified-learner-persona.md)
> **Governs / touches Crucible-protected paths** (`packages/persona/`, `packages/data/models/UserProgress.ts`, `StudentChapterProfile.ts`, `ResourceLink.ts`). Read [`_agents/CRUCIBLE_ARCHITECTURE.md`](../CRUCIBLE_ARCHITECTURE.md) **before** implementing any phase here. Where this doc and that doc disagree, **CRUCIBLE_ARCHITECTURE.md wins** and this doc must be corrected.

---

## 0. The one-sentence thesis

**One student → one persona → many surfaces.** There is exactly one learner model per student, keyed by *skill* (not by book, chapter, class, or subject). Crucible questions, Live Book practice, Apply & Express, and future lectures/flashcards are all **producers** of signal into that model and **consumers** of its recommendations. AI tutoring and B2B school analytics are simply two more *readers* of the same model.

## 1. The most important finding: ~70% is already built

This is **not** a greenfield design. The substrate exists, wired-but-gated:

| Component | File | State today |
|---|---|---|
| Canonical persona doc | `packages/data/models/UserProgress.ts` (`concept_mastery: Map<tag_id, IConceptMastery>`) | Live, Crucible-only |
| Tiered-signal contract (high/medium/low) | `packages/persona/contract.ts` + `writer.ts` | Live |
| Canonical mutation surface | `packages/persona/writer.ts` → `user-progress-updater.ts` | Live |
| Rich micro-concept profile | `packages/data/models/StudentChapterProfile.ts` + `profile-engine.ts` | Live (guided mode only — audit #5 gap) |
| Recommendation bridge | `packages/data/models/ResourceLink.ts` + `recommendation-engine.ts` + `/api/v2/user/recommendations` | **Stubbed** — returns `[]`, awaiting content |
| Live Books practice history | `packages/data/models/BookPracticeAttempt.ts` + `practiceSelector.ts` | Live, **separate** lightweight model |

**The gap is convergence + activation, not invention.** Live Books writes to its own `book_practice_attempts`; Crucible writes to `UserProgress`; the recommendation engine that would join them is gated off. This plan connects them.

## 2. Non-negotiable design constraint (from CRUCIBLE_ARCHITECTURE.md §10)

> *"Forking the persona model is a sin. The cost of two parallel persona models is much higher than the cost of extending one. We're already paying that cost with UserProgress vs StudentChapterProfile; do not add a third."*

Therefore the unified persona **is `UserProgress.concept_mastery` extended to a global skill-key namespace** — NOT a new collection. Live Books feeds it **through `writer.ts`'s `applyAttemptToProgress`**, never by a direct write. This is verified feasible: `getTagName(id)` already returns `idToNode.get(id)?.name ?? id`, so arbitrary (non-chemistry) skill ids flow through the existing writer without crashing.

Other invariants this plan must keep (CRUCIBLE_ARCHITECTURE.md §9):
- Persistence is immediate on submit (fire-and-forget POST).
- Every attempt carries a `confidence` tier; mastery counters move on HIGH only; exposure on HIGH+MEDIUM.
- `concept_mastery` keeps the strict two-counter-set shape (`IConceptMastery`).
- `UserProgress` is mutated only through `writer.ts`.
- The recommendation bridge keeps the same contract; only the inner algorithm changes.

## 3. The layered architecture

```
 (6) AI TUTOR        — reads a versioned persona snapshot; explains, generates, picks resources
        ▲ reads (read-only contract; never queries raw events)
 (5) DECISION        — recommendation + path engine ("practice / learn / review / unlock next")
        ▲ reads        packages/persona/recommendation-engine.ts  (activate the stub)
 (4) PERSONA         — UserProgress.concept_mastery (skill-keyed) + StudentChapterProfile (rich)
        ▲ written via  packages/persona/writer.ts  (the ONLY mutation surface)
 (3) EVENT/ATTEMPT   — every interaction → an attempt through the writer (Phase 0)
        |             → a dedicated immutable event log (Phase 1, for replay at scale)
        ▲ tagged against
 (2) SKILL GRAPH     — one curriculum-agnostic skill namespace + prerequisite DAG
 (1) CONTENT         — questions, book pages, challenges, lectures, decks
```

### Layer 2 — The Skill Graph (the linchpin)

One global, curriculum-agnostic catalogue of skills. **Without this, a cross-subject persona is impossible.**

- **Skill ID namespace** (opaque strings, globally unique):
  - Crucible chemistry/physics/math tags keep their existing ids (`tag_atom_3`) — they are already skill ids.
  - Live Books skills get ids under a `bk:` namespace: `bk:<subject><class>:<chapter>:<concept>` — e.g. `bk:en9:ch4:reported_speech`, `bk:en9:*:comprehension`. NCF competencies map to `comp:C2` etc.
  - Convention, not a hard parser — ids are opaque everywhere except the registry.
- **Skill node shape:** `{ id, name, subject, grade, chapter_id?, kind: 'micro'|'topic'|'competency', prerequisites: string[] }`.
- **Prerequisite edges** form a DAG (`reported_speech` ← `tenses`; `goc_acidity` ← `resonance`). This is what powers "learn this first" and "unlock next" — i.e. a real self-paced *path*, not a flat weakness list.
- **Resolver:** `resolveSkillName(id)` returns the human name; `getTagName` (taxonomy lookup) gains a fallback to the skill registry so book skills render with real names in dashboards.
- **Pilot scope (Phase 0a):** seed English (Kaveri) skills + NCF competencies + map existing Crucible chemistry tags into the namespace; add prerequisite edges for one subject as proof.

> **The single biggest *ongoing* cost and risk of this whole programme is tagging discipline.** Every assessable item across every subject/class must carry correct skill ids, and the prerequisite DAG must be maintained. Garbage tags → garbage persona → useless AI. Fund a permanent taxonomy owner; this is core infrastructure, not a one-time project.

### Layer 3 — Attempts now, event log later

- **Phase 0:** every Live Books practice answer is recorded through the **existing writer** as an attempt tagged with its skill id, `confidence: 'high'` (deliberate practice), `source: 'book_practice'`. It lands in the same `concept_mastery` map as Crucible. The Apply & Express challenges do the same. (The per-page closing `inline_quiz` stays a page-completion signal only — it is not deliberate practice.) During transition this is a **dual-write**: keep `book_practice_attempts` (the existing adaptive selector still reads it) AND add the unified persona write.
- **Phase 1 (scale):** introduce one append-only `learning_events` collection as the immutable spine — `{ user_id, tenant_id, ts, surface, item_id, skill_ids[], verb, result, context(tier), session_id }`. Both surfaces emit to it. Its purpose is **replayability**: when the mastery algorithm improves, recompute the persona from history instead of losing the past (Crucible already relies on this idea via `reclassifyBrowseSession` / `backfill_concept_mastery.js`). The materialized persona stays `UserProgress` — the event log is a *producer/audit spine*, not a competing persona (so it does not violate the no-fork rule). Defer until the 200-entry `recent_attempts` window is genuinely insufficient.

### Layer 4 — The Persona (extended, not forked)

- `UserProgress.concept_mastery` becomes **globally skill-keyed**: chemistry tags + book skills + competencies all coexist (no collisions — different id namespaces). Mastery thresholds in `contract.ts` apply per skill regardless of origin (book practice difficulty 1–5 and Crucible difficulty live on *different* skill ids, so they never pollute each other).
- `StudentChapterProfile` (micro-concept proficiency + **dominant weakness type**: concept-gap / calc-error / time-pressure / silly-mistake) is generalized the same way; closing audit #5 (have all modes write it) is part of this programme. The *why* signal is gold for the AI layer.
- **Phase 1 additions** (extend `IConceptMastery` / profile, never fork): per-skill mastery *probability* (BKT or lightweight Elo) once data volume justifies; spaced-repetition `next_due` per skill (SM-2/FSRS from last-correct timestamps); modality-response signal (does this student improve more after reading vs watching?).

### Layer 5 — The Decision Engine (activate the stub)

Flip `recommendation-engine.ts` from `[]` to the algorithm its own header documents, now reading the unified `concept_mastery`:

- **Practice this** — weak skill → serve questions at the right difficulty from any surface's bank.
- **Learn this** — weak skill → `ResourceLink` → the right book page / lecture / flashcard (`getResourceForConcept` already exists). **Phase 0 seeds `ResourceLink` for the Kaveri pages** (competency/chapter tags → page slug), giving the first real "read this" recommendations.
- **Review due** — spaced repetition over correct attempts.
- **Unlock next** — prerequisite DAG → next skill once prereqs are mastered → a generated self-paced path.
- Activation follows CRUCIBLE_ARCHITECTURE.md §6.1 exactly; the API contract (`{ items, engine_status }`) does not change.

### Layer 6 — The AI Tutor (Phase 2)

- The AI reads a **stable, versioned "persona snapshot"** (compact JSON: per-skill mastery + weakness type + due reviews + recent trajectory + recommended next skills). It never queries raw events. This mirrors the existing discipline — *deterministic engine computes state; AI interprets, communicates, and generates*.
- Guardrail: AI suggestions are constrained to the skill graph + real `ResourceLink` rows — it can pick from real resources and generate targeted questions, but cannot invent resources.
- `contract.ts` is already written to be consumed by "AI features" — the snapshot is a thin read-projection over `concept_mastery` + `StudentChapterProfile` using the existing classifiers.

## 4. Why this plan (rationale)

1. **Evolutionary, not a rewrite** — formalizes and connects components that already exist; lowest risk, fastest value.
2. **Skill-key is the only representation** that is simultaneously cross-subject, AI-legible, and school-dashboard-able. Every other key (book/chapter) boxes us in.
3. **Extend-don't-fork** respects the codebase's hardest-won invariant and avoids a third parallel persona.
4. **Layer separation** keeps determinism where it matters (engine) and AI where it adds value (interpretation/generation) — the same split that already keeps Crucible writes safe.
5. **Replayability via the event log** future-proofs the intelligence: the mastery model *will* change.

## 5. Trade-offs (honest)

**Pros:** unified, replayable, AI-ready, B2B-ready, mostly already built, invariant-safe.

**Costs / risks:**
- **Tagging discipline is the make-or-break, permanent cost** (see Layer 2 warning).
- **Event volume** grows fast at scale → time-partition + archive cold data; keep the materialized persona O(1) to read.
- **Resist mastery over-engineering** — ship counters + tiers + spaced repetition first (mostly built); add BKT/IRT only when data justifies.
- **Privacy/compliance surface widens** — minors under India's DPDP Act; far more so once a school is involved (they demand data ownership + export). Design tenant isolation + consent in from the start.
- **Touching the protected core** (writer/UserProgress) demands surgical, additive, fire-and-forget changes that can never break the student flow.

## 6. Scaling

- **Persona = read-hot, write-incremental.** One materialized doc per student, updated on each attempt (today's pattern). Never recompute on read.
- **Event log = write-heavy** → partition by time, archive cold, keep a recent live window (mirrors the existing 200-cap instinct, system-wide).
- **Known debt to fix before real traffic:** the in-memory `Map`-based rate limiters (`packages/core/rate-limit.ts`) are per-instance → move to Redis (already flagged in CLAUDE.md §8.11 / DEEPENING_BACKLOG #5).
- **AI cost control** — cache persona snapshots; route routine asks to cheap models, hard ones to expensive.

## 7. B2B (schools / coaching) — the persona is the product

The persona + skill graph + engine **is the moat and the B2B asset.** Content is copyable; a clean, interoperable, multi-tenant adaptive engine with teacher analytics is what institutions buy. Requirements:

1. **Multi-tenancy** — add an `org_id` / `tenant_id` dimension to users, content visibility, and analytics, with hard data isolation. **Cheap to add now, brutal to retrofit** once there are thousands of individual students + a first school deal. This is the strongest argument for designing carefully *today*.
2. **Teacher dashboards** — the same persona substrate rolls up to a class/section skill-mastery heatmap + intervention lists. The #1 thing schools pay for.
3. **Syllabus mapping** — the explicit skill graph lets us claim "aligned to CBSE/ICSE/your board." The NCF competency tags already added to Kaveri are step one.
4. **Standards-based integration** — LTI 1.3 (embed in a school LMS), xAPI/Caliper (events flow into their analytics), SSO via SAML/OIDC. These turn "an app" into "a platform IT will approve."
5. **White-label + their own content** — theming; let schools tag their own questions into our skill graph (ingestion pipelines exist).
6. **Data ownership + compliance** — contracts, residency, export. Non-negotiable for institutional sales.

Pricing: per-seat SaaS or per-school license; the engine is the recurring-revenue asset.

## 8. Phased roadmap

### Phase 0 — Converge & seed (this programme's foundation)
- **0a. Skill Graph** — registry + global skill-id namespace + resolver + `getTagName` fallback; pilot-seed English (Kaveri) + NCF competencies + map Crucible tags; prerequisite edges for one subject. *(Additive, safe.)*
- **0b. Books → unified persona** — `applyBookAttemptToProgress` adapter in `@canvas/persona` (constructs a valid `IQuestionAttempt`, `confidence:'high'`, `source:'book_practice'`, `concept_tags:[skillId]`, calls `applyAttemptToProgress`); dual-write from the Live Books practice POST route, fire-and-forget so it can never break practice. *(Invariant-compliant.)*
- **0c. Seed `ResourceLink`** for Kaveri pages (skill/competency → page slug) so "learn this" has real targets.
- **0d. Activate the recommender** per CRUCIBLE_ARCHITECTURE.md §6.1: weak-skill filter + recency decay + ResourceLink lookup + practice fallback. Contract unchanged.

### Phase 1 — Deepen  ✅ core shipped 2026-06-06
- ✅ **Dedicated `learning_events` log** (`packages/data/models/LearningEvent.ts`) + `emitLearningEvent` (`packages/persona/learning-event.ts`), emitted fire-and-forget from both the Books path (`book-attempt.ts`) and the Crucible single-attempt route. Append-only replay spine; carries a `tenant_id` placeholder for Phase 3.
- ✅ **Per-skill mastery probability (BKT-lite)** + **spaced repetition (SM-2-lite)** — `IConceptMastery` extended with `mastery_prob`, `streak_correct`, `review_interval_days`, `last_correct_at`, `next_due_at` (all optional, backward-compatible). Pure math in `contract.ts` (`updateMasteryProb`, `nextReview`, `REVIEW_LADDER_DAYS`), computed in `user-progress-updater.ts` on HIGH attempts only.
- ✅ **Recommender wired** to surface `review_due` (skills past `next_due_at`, learned but due) after `weak_concept`, with `mastery_prob` nudging weak-skill ranking.
- ⏳ **Remaining Phase 1 tail:** finish audit #5 on the *test/batch* route (single-attempt route + guided already write `StudentChapterProfile`); modality-response signal (deferred — needs lecture/read events flowing first); BKT param tuning (current params are conservative — one slip barely moves a near-1.0 prob, by design).

### Phase 2 — AI
- Versioned persona-snapshot read contract. Guardrailed LLM tutor (explain weaknesses, pick next question, pick the right lecture) constrained to skill graph + ResourceLinks.

### Phase 3 — B2B
- `tenant_id` everywhere + isolation. Teacher dashboards. LTI 1.3 / xAPI / SSO. Compliance (DPDP, data export, residency).

## 9. The two things to internalize

1. **The skill graph is the whole game** — fund it like core infrastructure with a permanent owner.
2. **Add the tenant dimension early** — multi-tenancy is cheap now and brutal to retrofit once there are thousands of students and the first school on the table.
