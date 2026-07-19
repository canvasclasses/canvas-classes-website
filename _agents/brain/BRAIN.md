# Canvas Brain — institutional memory (index)

> **What this is.** The company's long-term memory: what Canvas is, how its systems fit together, what has gone wrong, and where to find the canonical detail. It is **repo-resident and git-diffable** (mirrors `_agents/ncert/`), and it runs on the founder's **Claude Max plan via agent sessions — no API, no hosted service.** It is the substrate the [Founder Advisor](../workflows/FOUNDER_ADVISOR.md) reads, and (later) the student tutor + navigator.
>
> **Not** the founder's personal GBrain (`~/brain/`). That is private/cross-company. This is institutional/product. Keep them separate (AI_NATIVE_ROADMAP §4).
>
> **Pointer-based by rule.** The brain *synthesizes and links* the canonical docs — it does not duplicate them. When a fact has a canonical home (a model, a workflow doc, a state file), the brain points there. It only stores net-new institutional knowledge (the systems map, the incident log, the synthesis). Single source of truth always wins; if the brain disagrees with the canonical doc, the canonical doc is right and the brain entry is stale — fix it.

## Task router — read ONLY your lane, not the whole brain

> Starting a chat on one area? Read just the rows for that area, not everything. The brain's cross-cutting core (overview + systems-map + incidents) is small and worth a skim; the per-project detail lives in the cockpit + that project's docs, which this table points you to. **You do not need to read other projects' context to work on one.**

| If you're working on… | Read exactly these (skip the rest) |
|---|---|
| **Crucible question bank** (ingest / solutions / tags / flags) | `_agents/state/CRUCIBLE_STATE.md` (live counts) · `_agents/CRUCIBLE_ARCHITECTURE.md` · the subject workflow doc in `_agents/workflows/` · [`systems-map.md`](systems-map.md) (the Question joints) |
| **Crucible / landing-page UI** | `_agents/CRUCIBLE_ARCHITECTURE.md` · `apps/student/features/crucible/` · CLAUDE.md §7 (design system) + §10 (caching) |
| **Live Books** (authoring / pages / images) | `_agents/state/LIVE_BOOKS_STATE.md` · `_agents/workflows/BOOK_PAGE_WORKFLOW.md` · `_agents/plans/CONTENT_PROTECTION.md` + CLAUDE.md §0.6 · **publish-readiness of every chapter/page** → the Book Readiness dashboard `admin.../books/dashboard` (engine `packages/data/books/readiness.ts`; cockpit row "Book Readiness Dashboard") |
| **Taxonomy / tagging** | `packages/data/taxonomy/` · `_agents/workflows/CRUCIBLE_TAXONOMY_AND_TAGGING_RULES.md` |
| **Persona / adaptive engine** | `_agents/CRUCIBLE_ARCHITECTURE.md` (persona pipeline) · `_agents/plans/UNIFIED_LEARNER_PERSONA.md` |
| **SEO / any public page** | `_agents/SEO_PLAYBOOK.md` (incl. Part G title formulas) · CLAUDE.md §10 · `_agents/plans/QUESTION_LIBRARY_SPEC.md` (**the question-surface strategy** — one `/questions/*` library, free text solutions, phased migration; ⛔ Shaurya-only) · `_agents/plans/CRUCIBLE_CACHE_SEO_REDESIGN.md` (ISR/event-driven caching; Phases 3–5 absorbed into the Library spec) · GSC baselines: `_agents/data/gsc-baselines/` |
| **The AI-native system itself** (brain / watchdogs / advisor / scout) | `_agents/plans/AI_NATIVE_ROADMAP.md` · this brain · `scripts/watchdogs/README.md` |
| **Anything — "where do I stand?"** | `_agents/PROJECTS.md` (the cockpit) — one row per project |

Cross-cutting (always cheap to skim, applies to most tasks): [`company-overview.md`](company-overview.md), [`systems-map.md`](systems-map.md), [`incidents.md`](incidents.md).

## Map of the brain

| File | What it holds |
|---|---|
| [`company-overview.md`](company-overview.md) | What Canvas is, the products/surfaces, the two-app split, the audience. |
| [`systems-map.md`](systems-map.md) | The systems and **how they connect** — where the cross-system gaps live (the gap auditor's territory). |
| [`incidents.md`](incidents.md) | The failure log — what broke, root cause, the rule that now prevents recurrence. Pattern memory. |
| [`how-to-update.md`](how-to-update.md) | The maintenance protocol — who updates the brain, when, and how (so it can't go stale silently). |
| [`industry/`](industry/) | Industry-scout findings (dated market/competitor scans). Read by the founder advisor. |
| [`content-radar/`](content-radar/) | Content Radar briefs — dated "what to record on YouTube, and when" decisions (product data + vidiq + exam calendar). Read by the founder advisor. |

## The canonical sources this brain points at (don't duplicate — link)

| Topic | Canonical home |
|---|---|
| Project status / what's active / blocked | [`_agents/PROJECTS.md`](../PROJECTS.md) (the cockpit) |
| Repo rules, security, caching, conventions | [`CLAUDE.md`](../../CLAUDE.md) |
| Crucible architecture + invariants | [`_agents/CRUCIBLE_ARCHITECTURE.md`](../CRUCIBLE_ARCHITECTURE.md) |
| Live Books content inventory | [`_agents/state/LIVE_BOOKS_STATE.md`](../state/LIVE_BOOKS_STATE.md) |
| Authored reference textbooks (Reference-First rule → Live Books / Crucible) | [`_agents/reference-books/REFERENCE_LIBRARY.md`](../reference-books/REFERENCE_LIBRARY.md) — index + per-book maps (Mittal Physical Chemistry; Hewitt Conceptual Integrated Science) |
| Crucible question-bank inventory | [`_agents/state/CRUCIBLE_STATE.md`](../state/CRUCIBLE_STATE.md) |
| Content-protection system | [`_agents/plans/CONTENT_PROTECTION.md`](../plans/CONTENT_PROTECTION.md) |
| SEO / caching record | [`_agents/SEO_PLAYBOOK.md`](../SEO_PLAYBOOK.md) |
| Architecture decisions | [`_agents/adr/`](../adr/) |
| Tech debt / known gaps | [`_agents/DEEPENING_BACKLOG.md`](../DEEPENING_BACKLOG.md) |
| This AI-native initiative | [`_agents/plans/AI_NATIVE_ROADMAP.md`](../plans/AI_NATIVE_ROADMAP.md) |

## How the faces use this brain

- **Founder advisor** (built) — reads all of the above + live-checks the system, returns a prioritized brief. Super-admin/founder only.
- **Student tutor** (future) — reads ONLY the published, student-safe content slice. Never `company-overview`/`systems-map`/`incidents`/operations. Enforced at the retrieval layer (AI_NATIVE_ROADMAP §5.2).
- **Navigator** (future) — search + pathways over the student-safe content slice.
- **Industry scout** ✅ BUILT (`/industry-scout`) — scans the JEE/NEET market via the vidiq MCP + web, writes dated findings into `industry/` for the advisor to read.
- **Content Radar** ✅ BUILT (`/content-radar`) — the tactical sibling of the scout: fuses our product data (student-signal) + vidiq YouTube intelligence + the exam calendar into a ranked "what to record this week" brief in `content-radar/`. Light daily pass + heavy weekly digest. Read by the founder advisor.
- **Watchdog layer** ✅ BUILT (`scripts/watchdogs/`) — content guard, cost sentinel, gap auditor, student-signal analyst, and a morning-brief runner; read-only, exit-code alerting. See `scripts/watchdogs/README.md`.
