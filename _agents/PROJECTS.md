# PROJECTS — the cockpit

> **Read this FIRST, at the start of every session.** It is the single air-traffic-control view of every active initiative: where each one stands, what to do next, and — most importantly — **what each one is blocked on**. You run many fronts in parallel and lose context when you switch; this file is the antidote. You should never have to remember "where was I?" — it's here.
>
> **This file is agent-maintained.** Per CLAUDE.md §0.5 (Project Ledger Protocol), the agent surfaces the relevant row when you return to a project (check-in) and updates the row + the project's detail doc + GBrain when work advances (check-out). If you ever find a row stale, that's a bug in the ritual — tell the agent to fix it.
>
> Status legend: 🟢 active/shipping · 🟡 in progress · ⛔ blocked (waiting on a dependency) · 💤 idle (untouched a while) · ✅ done. **"Next action" is always the single next concrete step.**

_Last reviewed: 2026-06-07_

## Cockpit

| Project | Status | Phase / where it is | Last touched | Next action | Blocked on |
|---|---|---|---|---|---|
| **Adaptive Persona Engine** | 🟡 | Phase 1 COMPLETE. **Phase 2 BUILT** (persona-snapshot + guardrailed AI tutor `POST /api/v2/user/tutor` + model routing; 14/14 & 16/16 tests). **Phase 3a foundation BUILT 2026-06-07** — tenant dimension stamped from birth: new `tenants`/`tenant_memberships` + `@canvas/data/tenancy` resolver; `tenant_id` on `UserProgress`/`StudentChapterProfile` (set at creation like `user_email`, writer.ts untouched) + every `learning_event`; snapshot v2 carries it. Verified 11/11; landed with 0 untagged legacy data. Both apps typecheck clean. **🔀 DIRECTION CHANGE 2026-06-07 (ADR-012): Live Books DECOUPLED from Crucible recommendation** — engine re-centred on in-Crucible adaptive practice; cross-surface redirect parked (not deleted); solutions become self-sufficient; flagship next feature = question grouping / variant-skipping (deferred until 2–3 chapters/subject done). | 2026-06-07 | **(1) Top up Anthropic credit** → tutor live (Crucible-scoped). **(2) Finish 2–3 fully tagged + solved chemistry chapters.** **(3) Build question grouping / variant-skipping** (design spec then). Phase 3b teacher dashboards as B2B demands. | **⛔ Anthropic credit:** tutor wiring authenticates but live call 400s on "credit too low" — needs top-up. |
| **Class 9 English — Kaveri** | 🟡 | Full content built + competency-deepening pass done (8 ch, 139 pages, Grammar Gyms, Hinglish, practice). **CBSE alignment research done** (verified against primary CBSE PDFs; killed the "40→50% for IX-X" myth) → GBrain `reference/2026-06-07-cbse-class9-assessment-model-and-livebook-roadmap.md`. **`reading_comprehension` block type shipped** (types + Zod schema + renderer + BlockRenderer wired, both typechecks clean). **Ch9 "Reading Skills: Unseen Passages" live** — intro + 4-step attack + discursive 430w passage + case-based 235w passage (with data table); 8 objective Qs spread 3/2/2/1 across A/B/C/D; mixed MCQ / assertion-reason / short-answer; teacher voice ("har jawab passage ke andar hai"). **NEW: `voices_that_inspire` callout variant shipped** (rose/amber warm card with pulled-out italic quote, attribution, reflection prompt) + **"One Page from My Bookshelf" pilot live on Ch1 themes page** (Tagore's *Where the mind is without fear* → Krishtakka). **wisdom_seeds capture pipeline live** at `~/brain/wisdom_seeds/` (README + template + first seed + pilot quality reference at `_pilots/ch1-tagore-grandmother.md`). | 2026-06-07 | Author discursive + case-based passages for ch2-8 (one of each per chapter); seed wisdom_seeds with more books as founder reads and roll out voices_that_inspire to ch2-8; record audio; build Ch2 "About the Poet" + standalone Writing pages | **⛔ Source:** needs the Kaveri PDF for poet bio + exact writing tasks; **⛔ Audio:** all `audio_url` empty (recording workflow) |
| **Class 9 Science — NCERT Simplified** | 🟡 | Ch6 fully built (11pp + 26-Q bank); **all 5 live chapters' inline quizzes fixed to §3.6.1 (232 Qs: length-tell 58→7%, B-bias 57→24%, difficulty 10→90%)**; "Free-Body Challenge" game built (`free-body-diagram`) on Ch6. Toolchains: `scripts/science-quiz/`, `scripts/science-practice/` | 2026-06-06 | Wire the unused physics sims (free-fall/friction/circular-motion etc.) into pages; add chapter-end practice banks to Ch1–5; publish+fix Ch8; Ch6 images + Hinglish | — |
| **Class 9 Math Live Book** | ⛔ | Part I (Ch1–8) COMPLETE, published:false | 2026-06-03 | Build Part II (DB ch 9–15) | **⛔ Source:** waiting on the NCERT PDFs for Part II |
| **Class 9 ICT Live Book** | 🟡 | Ch1 done; 9 sims built + UX v2 pass | 2026-06-04 | Build video-driven chapters 2–5 | Video source material |
| **Class 9 Hindi — Ganga (गंगा)** | 🟡 | All 12 chapters built (103 pp, `published:false`); question-quality pass DONE. **Image generation 90/112 done (Ch1–8 + Ch9 first 5/9), paused on ChatGPT daily image quota — resume after 18:34 IST on 2026-06-07.** CBSE-alignment research done; **अपठित बोध module batch-1 BUILT** (new ch13: 5 pages, 28 Qs MCQ+assertion-reason+short-answer, reuses shared `reading_comprehension` block now `lang:'hindi'`) → `_agents/plans/HINDI_CBSE_EXAM_ALIGNMENT.md`. Remaining gaps: लेखन / व्याकरण / model-papers | 2026-06-07 | (1) After 18:34 IST, finish images: Ch9 #6–#9, Ch10 (7), Ch11 (8), Ch12 (8) + ch13 अपठित (5). (2) Build **रचनात्मक लेखन module** (G2, 20 marks) or extend अपठित, then व्याकरण + model papers | **⛔ (soft)** ChatGPT image quota (until 18:34 IST 2026-06-07); CBSE गंगा-specific SQP not yet published |
| **Class 11 Chemistry Live Book** | 🟡 | ~55 pages; Ch1–2 + Practical complete, Ch3 unpublished, Ch4+ not started | (see state) | Continue chapters per `LIVE_BOOKS_STATE.md` | — |
| **Crucible question bank** | 🟢 | 15,226 live questions | 2026-05-31 | Micro-tag Physics/Maths once their taxonomy micro_topics are generated | **⛔ Taxonomy:** Physics & Maths have zero micro_topics in the taxonomy → can't micro-tag yet |
| **SEO Dashboard** | 🟡 | PR 1 of 3 landed | 2026-05-25 | Ship PR 2 | — |
| **BITSAT Predictor** | 🟡 | Data layer + predictor logic complete | (see plan) | Wire UI + API | — |
| **Welcome Dashboard** | 🟡 | API shipped, UI pending | 2026-05-22 | Build the UI against the shipped payload | — |
| **Livebook image automation** | 🟢 | Pipeline working (ChatGPT→cwebp→R2→block) | ongoing | Use as needed per book | — |
| **Project Ledger (this system)** | 🟢 | Cockpit + CLAUDE.md rituals + SessionStart hook + weekly review routine (Mon 09:08 IST) all live | 2026-06-06 | — (complete; tune cadence/format as needed) | — |

## ⛔ Waiting-on-a-dependency (the things most easily forgotten)

These are *built or partly built* but stalled on something external. When the dependency lands, the linked work can resume — **this section exists so that "I forgot X was waiting on Y" can't happen.**

- **Adaptive Persona Engine → AI tutor needs Anthropic credit to go live.** Phase 2 (persona-snapshot + guardrailed AI tutor + model routing) is BUILT and verified up to the live model call. The live round-trip 400s on "credit balance too low" — the SDK wiring, API key, model id, and request shape all authenticate fine. **Action: top up the Anthropic account, then ask the agent to re-run the tutor live smoke test.** No code change needed.
- **Adaptive Persona Engine → cross-surface content dependency REMOVED (2026-06-07, ADR-012).** The engine no longer needs lecture/audio + `ResourceLink` rows to deliver value — Live Books are decoupled and the engine is re-centred on in-Crucible adaptive practice. The `ResourceLink` "read/watch this" path is **parked, not deleted** (dormant, revivable). The real remaining work is content-internal to Crucible: finish per-chapter micro-tagging + difficulty + self-sufficient solutions for 2–3 chemistry chapters, which then unblocks the **question grouping / variant-skipping** flagship (its own `variant_group_id` tag + design spec, TBD).
- **Class 9 Math Part II → needs NCERT PDFs** for DB chapters 9–15.
- **Class 9 English audio → needs recording** (schemas ready; all `audio_url` empty).
- **Crucible Physics/Maths micro-tagging → needs taxonomy micro_topics generated** for those subjects.

## Where the detail lives (don't duplicate — link)

| Initiative | Detail doc |
|---|---|
| Adaptive Persona Engine | `_agents/plans/UNIFIED_LEARNER_PERSONA.md` + ADR-011 + **ADR-012 (decoupling, 2026-06-07)** + GBrain `decisions/2026-06-06-unified-learner-persona.md` |
| Live Books (all) | `_agents/state/LIVE_BOOKS_STATE.md` (auto-generated content inventory) |
| Hindi गंगा CBSE exam alignment | `_agents/plans/HINDI_CBSE_EXAM_ALIGNMENT.md` (blueprint + gap analysis + build plan) |
| Crucible bank | `_agents/state/CRUCIBLE_STATE.md` |
| Math / ICT books | `_agents/state/MATH_BOOK_BUILD.md`, `ICT_BOOK_BUILD.md` |
| SEO | `_agents/plans/SEO_DASHBOARD.md` + `_agents/SEO_PLAYBOOK.md` |
| BITSAT / Welcome | `_agents/plans/BITSAT_PREDICTOR_INTEGRATION.md`, `WELCOME_DASHBOARD_PLAN.md` |
| Tech debt | `_agents/DEEPENING_BACKLOG.md` |

## Standardised status header (for every plan/design doc)

So a project's detail doc tells you its state in 5 seconds, each `_agents/plans/*.md` carries this block at the top (the cockpit row is just its one-line summary):

```
> **Status:** 🟡 <one line> · **Last updated:** YYYY-MM-DD
> **Done:** <bullet or one line>
> **Pending:** <what's left>
> **Blocked on:** <dependency, or —>
> **Next action:** <single concrete next step>
```

`_agents/plans/UNIFIED_LEARNER_PERSONA.md` is the worked example.
