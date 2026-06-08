# Unified Learner Persona — Architecture & Phased Plan

> ### ⚠️ DIRECTION CHANGE — 2026-06-07 (see [ADR-012](../adr/012-decouple-livebooks-from-crucible.md))
> **Live Books and Crucible are now DECOUPLED at the recommendation layer.** The original thesis below ("one persona, many surfaces, cross-surface *recommendation*") is amended:
> - **Dropped:** the "weak in Crucible → go watch this Live Book page/video" redirect (the `ResourceLink` cross-surface consumer). Crucible solutions are being made *self-sufficient* — they teach the concept and walk sibling variants in-context — so a redirect is redundant, and timestamp-level resource targeting was judged over-personalised. Students self-navigate to Books when they choose.
> - **Kept (the moat):** ONE durable, cross-*subject* learner model inside Crucible (chem/phys/math/bio). Live Books may still *feed* the persona (cheap, fire-and-forget, holistic/B2B signal) but the persona no longer *drives traffic back* to Books.
> - **Parked, not deleted:** the `ResourceLink` redirect path + book→persona dual-write stay in the tree (dormant, zero cost, revivable) — do not rip them out. **Implemented 2026-06-07:** a `CROSS_SURFACE_RESOURCES_ENABLED = false` flag in `recommendation-engine.ts` short-circuits both `ResourceLink` lookups (recommender returns practice-only; `getResourceForConcept` returns null), and all three parked/kept paths carry ADR-012 navigability comments. The book→persona feed is **kept** (holistic/B2B signal), not parked. Verified live (6/6) — practice-only even when a real `ResourceLink` row exists. Both apps typecheck clean.
> - **New centre of gravity:** the engine is re-pointed at **in-Crucible adaptive practice**. The flagship next feature is **question grouping / variant-skipping** (deferred until 2–3 chapters per subject are fully tagged + solved; design spec TBD). The AI tutor stays, scoped to Crucible (explain weakness / pick next question — it already degrades gracefully to "no external resource").
> - **Net effect:** the cross-surface tagging + sync dependency is removed; Books and Crucible develop independently. The "engine blocked on lecture content/ResourceLinks" dependency no longer gates the engine's value.
> Sections below are preserved for history; where they describe cross-surface *recommendation*, read them through this amendment.

> **Status:** Design approved 2026-06-06. **Phase 0 + Phase 1 shipped** — verified end-to-end against the live DB. Phase 0: skill graph · Books→persona dual-write · ResourceLinks seeded · recommender activated. Phase 1: `learning_events` spine · BKT-lite mastery prob · SM-2-lite spaced repetition · recommender surfaces review-due. **Phase 1 closed 2026-06-07** (test/batch route emits events; BKT tuning decided = leave-as-is/replay-later; only §1c modality signal deferred pending lecture events). **Phase 2 built 2026-06-07** — 2a persona-snapshot + route (14/14); 2b guardrailed LLM tutor + `/api/v2/user/tutor` (16/16); 2c model routing + caching. **⛔ Tutor live round-trip blocked on Anthropic account credit** (wiring authenticates; 400 billing). **Phase 3a foundation built 2026-06-07** — tenant dimension (`tenants`/`tenant_memberships` + `@canvas/data/tenancy` resolver) stamped onto every persona doc + event from birth; snapshot v2 carries `tenant_id`; verified 11/11; landed with 0 untagged legacy data. **2026-06-07 direction change (see banner above + ADR-012): Live Books decoupled from Crucible recommendation; engine re-centred on in-Crucible adaptive practice.** **Next: top up Anthropic credit (tutor live, Crucible-scoped); finish 2–3 fully-tagged+solved chemistry chapters; then build question grouping / variant-skipping (the new flagship); Phase 3b teacher dashboards on the tenant substrate as B2B demands.**
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
- ✅ **Audit #5 + event spine on the test/batch route (2026-06-07).** The *test/batch* route (`apps/student/app/api/v2/user/progress/batch/route.ts`) already wrote `StudentChapterProfile` (audit #5 was closed there). The one real gap was that a whole test sitting emitted **no** `learning_events` — the single-attempt + book routes did, the batch route did not. Fixed: the batch route now emits one `learning_event` per recorded attempt (`surface:'crucible'`, `verb:'answered'`, same invalid-attempt skip as the UserProgress loop), fire-and-forget. Verified end-to-end against the live DB. Student typechecks clean.
- ✅ **BKT param tuning — decided 2026-06-07: leave as-is, tune later via replay.** The current params (slip rate `pS=0.1`) are deliberately forgiving — they assume careless slips are common (and "silly-mistake" is a tracked weakness dimension). Two facts settled this: (1) a wrong answer *already* brings a skill back tomorrow via the spaced-repetition reset regardless of BKT, so responsiveness isn't reliant on the prob; (2) BKT prob mainly nudges *ranking* of weak skills. Rather than guess a sharper slip rate with no student data, we keep the conservative defaults and will replay the `learning_events` log against candidate params once real attempts accumulate — picking whichever best predicts the next answer. (Matches §5 "resist mastery over-engineering until data justifies.")
- ⏳ **Remaining Phase 1 tail:** modality-response signal only (§1c) — deferred until lecture/read events flow. **Phase 1 is otherwise complete; next up is Phase 2 (AI tutor).**

### Phase 2 — AI
- ✅ **2a — Versioned persona-snapshot read contract (shipped 2026-06-07).** `packages/persona/persona-snapshot.ts` exports `PERSONA_SNAPSHOT_VERSION` (=1) + `buildPersonaSnapshot(userId)` — a **pure read-projection** (no mutation) over `UserProgress.concept_mastery` + `StudentChapterProfile`, computed with the existing `contract.ts` classifier (`computeProficiencyLevel`) and reusing the live `recommendation-engine`. Per skill it returns: name (resolved via taxonomy→skill-graph fallback), subject/kind, attempts, accuracy, `mastery_prob`, proficiency label, `due_for_review` + `next_due_at`, and a recent `trajectory` (improving/declining/steady/new from the HIGH-confidence attempt window). Plus a summary block, a dominant-weakness rollup across chapter profiles, and the top-5 recommendations. Served at `GET /api/v2/user/persona-snapshot` (authed, `force-dynamic` — genuinely per-user, §10.1). Verified end-to-end against the live DB (14/14 checks incl. real ResourceLink integration). Both apps typecheck clean.
- ✅ **2b — Guardrailed LLM tutor (built + verified 2026-06-07).** `packages/persona/tutor.ts` + `POST /api/v2/user/tutor`. The AI reads the snapshot and returns a plain-language weakness explanation + a chosen *next skill* + step type. **Structural guardrail (not prompt-hoped):** the prompt offers only the snapshot's real skill ids; `validateTutorOutput` rejects any off-list id and substitutes the engine's pick (recording a violation); the AI **never emits a resource URL** — it picks a skill + step (`practice`/`read`/`watch`) and the deterministic engine resolves the real `ResourceLink` (downgrading `read`/`watch`→`practice` when none exists). Pure prompt-builder + validator (no API spend); the Anthropic call is injected via DI (ADR-001) so the SDK dep lives in the student app, not the shared package. `@anthropic-ai/sdk@0.102` added to the student app. **16/16 pure guardrail unit tests pass.** Both apps typecheck clean.
- ✅ **2c — Model routing + snapshot caching (built 2026-06-07).** Routing: routine "what next" asks → `claude-haiku-4-5`; free-text questions → `claude-opus-4-8` (structured outputs; `effort` Opus-only). Per-user in-memory snapshot cache (60s TTL) + per-user LLM rate limit (12/min) on the tutor route.
- ⛔ **Live round-trip blocked on Anthropic account credit.** The live smoke test reached + authenticated against the API (HTTP 400 *billing* — "credit balance too low" — NOT auth/model error), confirming the SDK wiring, API key, model id, and request shape are all valid. The actual model round-trip can't run until the Anthropic account has credit. **This is the one thing standing between "built" and "live" for the tutor.**

### Phase 3 — B2B
- ✅ **3a foundation — tenant dimension stamped from birth (built + verified 2026-06-07).** The irreversible-to-retrofit part. New additive models `Tenant` (`tenants`) + `TenantMembership` (`tenant_memberships`: user→tenant+role student/teacher/tenant_admin, +section for rollups). `@canvas/data/tenancy` resolver: `resolveTenantId(userId)` (cached 5min, fail-safe to `DEFAULT_TENANT_ID='public'`), `getMembership`, `invalidateTenantCache`, `tenantContentFilter`. `tenant_id` added (optional) to `UserProgress` + `StudentChapterProfile` and **stamped at doc-creation by the routes — an identity field like `user_email`, never touched by `writer.ts`** (invariant preserved). Threaded through every persona-doc creation site (progress single + batch, book-attempt, starred, test-session, server-action progress, session-response, chapter-profile) and every `emitLearningEvent` call (which already carried the `tenant_id` placeholder). Persona snapshot now surfaces `tenant_id` (bumped to **v2**). Verified end-to-end vs live DB (11/11): resolution, public fallback, doc + event stamping, snapshot tenant, content filter. **0 existing learner docs** → tenancy landed before any untagged data exists (ideal). `scripts/backfill_tenant_id.js` (dry-run default) stamps any pre-launch stragglers. Both apps typecheck clean.
- 🔒 **Security audit + code review (2026-06-07):** no Critical/High/Medium security issues — tenant isolation is server-resolved (never client-set) and the tutor guardrail is structurally sound. One **Important correctness bug fixed:** `resolveTenantId` was caching the error-fallback `'public'`, so a transient DB blip during a B2B student's first attempt could permanently misstamp their persona doc — now the fallback is returned **without** caching (only successful resolutions cache). Also: a valid `focusSkillId` beyond the 25-skill prompt cap is now always shown to the tutor. Both fixes verified (8/8).
- ⏳ **3b — Teacher dashboards.** Class/section skill-mastery heatmap + intervention lists, rolled up from `StudentChapterProfile` (indexed by `{tenant_id, chapterId}`) + `learning_events` (indexed by `{tenant_id, ts}`) and the membership roster. The substrate is now in place.
- ⏳ **3c — Standards integration.** LTI 1.3 (embed in school LMS), xAPI/Caliper (event export from `learning_events`), SSO (SAML/OIDC).
- ⏳ **3d — Compliance.** DPDP (minors), data residency (`Tenant.data_residency` placeholder exists), school data ownership/export.
- ⏳ **Content-level tenancy (follow-on).** Private per-school question/book banks via an optional `tenant_id` on content + `tenantContentFilter` on reads. Global/shared content (the default, and the bulk) needs no change. Deferred — content is copyable and not the moat; the learner model is.

## 9. The two things to internalize

1. **The skill graph is the whole game** — fund it like core infrastructure with a permanent owner.
2. **Add the tenant dimension early** — multi-tenancy is cheap now and brutal to retrofit once there are thousands of students and the first school on the table.

## 10. Where AI is actually needed — the three tiers (2026-06-07, post-decoupling)

After ADR-012, the engine's dependence on a live language model is *much smaller* than it looks. Sort every "AI" need into one of three tiers and the picture is clear:

**Tier 1 — the engine core: deterministic, required, $0 runtime AI.** Everything that decides *what a student sees next* is math + rules over good tags, with **no model in the request path**: mastery tracking (counters, BKT prob), spaced repetition, weak-skill detection, next-question selection, difficulty progression, question grouping / variant-skipping (once `variant_group_id` tags exist), and teacher dashboards. **With proper tagging, the entire adaptive loop runs with zero runtime AI** — cheap, fast, auditable. Crucially, **this core has no dependency on the Anthropic-credit blocker** — that only gates Tier 3.

**Tier 2 — AI at *build time*: high value, run-once, offline, cheap.** This is where AI earns its keep now — not deciding, but **manufacturing the tags + solutions the deterministic engine runs on**: proposing the skill graph / micro-skills from the question bank (the Physics/Maths domino), clustering questions into variant groups (AI proposes → human verifies), suggesting concept/micro/difficulty tags at ingestion, and drafting/checking solutions. Offline, batchable, human-verified, never touches a live student. **AI's primary role shifts from "deciding" to "fuelling."**

**Tier 3 — AI at *runtime*: optional, a premium layer.** A live model is only needed to *talk to the student in natural language* — explain a weakness in plain words, or answer a free-text doubt ("why moles here?"). This is the built (credit-blocked) tutor. Post-decoupling it is **optional, not required**: its "pick a resource" job is gone (no cross-surface resources) and its "pick next skill" job is **redundant with the deterministic Tier-1 engine**, so its unique remaining value narrows to **explanation + doubt-solving** — really a separate, opt-in "ask a doubt" surface. Self-sufficient solutions (the decoupling bet) further reduce even this need.

**Implication:** a fully functional adaptive engine ships on Tier 1 + Tier 2 with **no runtime AI cost and no Anthropic-credit dependency**. Tier 3 is a priced, opt-in feature added when desired. This is the ideal cost shape: always-on core is free per-student; AI is a one-time, batchable build expense; per-token runtime cost is opt-in only.
