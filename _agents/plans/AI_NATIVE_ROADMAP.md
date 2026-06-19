# Becoming an AI-Native Edtech Company — Strategy & Roadmap

> **Status:** 🟡 Strategy agreed, nothing built yet · **Last updated:** 2026-06-18
> **Done:** Diagnosis + architecture agreed with founder (this doc).
> **Pending:** Build the Canvas Brain substrate → founder advisor → content/navigator faces → scout; stand up the watchdog layer.
> **Blocked on:** — (founder to pick build order; Anthropic credit will be needed for any live LLM calls — see [Adaptive Persona Engine](UNIFIED_LEARNER_PERSONA.md) which is already blocked on the same top-up).
> **Next action:** Build a minimal **Canvas Brain** over existing *text* content + operations, then the **founder advisor** face on top of it.

> **Author:** Agent, commissioned by founder (paaras), 2026-06-18.
> **What this doc is:** the single record of the "make Canvas an AI-native company" thread, so it survives across chat sessions. If anything here is built, update the status header + the [PROJECTS.md](../PROJECTS.md) cockpit row in the same session (per CLAUDE.md §0.5).

> **⚙️ Runtime decision (2026-06-18, founder): until we offer faces to students, everything runs on the founder's Claude Max plan via Claude Code agent sessions — NO Anthropic API spend and NO deployed LLM endpoint.** Consequences, baked into the build below:
> - The **Canvas Brain is a repo-resident, git-diffable index** (`_agents/brain/`), mirroring the existing NCERT-corpus pattern — *not* a vector DB or a hosted service.
> - The **Founder advisor is an agent-run workflow + skill** (an agent session reads the brain and reports), *not* a server route calling the API.
> - This **sidesteps the Anthropic-credit blocker** entirely for the internal-only phases. The API/model-tier decision is deferred to when the **student-facing** tutor/navigator ship (that's the point at which paid, deployed inference is actually needed).

---

## 0. TL;DR (plain English)

Today we use AI like a fast employee: the founder has an idea, talks it through with AI, AI implements the final draft. That's **AI-assisted**. It's good, but nothing AI is *continuously watching the whole company* — so gaps between systems and silent failures go unnoticed for days or months.

We have proof this is a real, recurring weakness, not a worry:
- **The June 2026 Vercel bill spike (~10×)** — public pages quietly stopped using the cache; nobody noticed until the bill arrived.
- **The June 10 content deletion** — a whole "Classification of Matter" section *and the founder's recorded video* were hard-deleted, unnoticed for 4 days.

Both are the same failure: **work happens, but nothing stands guard over the whole system.**

The plan is to add two things on top of what we already do:

1. **A standing supervisory layer** — AI agents that run on a schedule (not when asked), watch the whole system, and bring problems to the founder. This is the *defensive* unlock — it makes incidents like the two above visible on day one.
2. **One company brain ("Canvas Brain") with three faces** — a single institutional memory that knows our content, our operations, our student data, and the industry, and can be asked questions or asked for improvements. This is the *offensive* unlock — the real moat in edtech.

The key insight: the founder asked for several different AIs (a content tutor, a navigator, an industry scout, a company-wide memory that suggests improvements). **They are not separate systems — they are one brain wearing different hats.** Build the brain once; put faces on it.

---

## 1. The three levels of AI maturity (where we are, where we're going)

| Level | What it means | Canvas status |
|---|---|---|
| **1. AI-assisted** | You ask, AI does. AI is a faster pair of hands. | ✅ We're strong here. |
| **2. AI-operated** | AI runs *standing jobs on its own schedule* — audits, monitors, reports — and brings problems to you. | ❌ The missing layer. Build next. |
| **3. AI-native product** | AI is *inside the product*: the learning itself adapts per student, automatically, and improves every week. | 🟡 Partly (adaptive persona engine, generative tutor proposal) — the long game. |

The growth unlock is adding level 2 (trust + defense) and pushing into level 3 (the moat).

---

## 2. The unifying architecture: one brain, two layers

There are **two** standing layers, and they share **one** substrate (the Canvas Brain).

### Layer A — the supervisory layer (defense)
Scheduled agents that watch the system and report. **Read-and-report by default** (see §5 security). Each writes findings into the Canvas Brain and/or the cockpit, and pings the founder only when a human is needed.

| Watchdog | What it does | Directly prevents |
|---|---|---|
| **Content guard** | Daily, diff every Live Book page against its last snapshot; flag any page that shrank, lost a video/image/audio link, or got deleted. | The June 10 content-deletion incident. Builds on existing `scripts/lib/book-writer.js` version history. |
| **Cost / perf sentinel** | Daily, scan for any public page that's `force-dynamic` or `revalidate=0`; watch Vercel usage trend. | The June 2026 bill spike. Encodes the CLAUDE.md §10 caching rules as an automated check. |
| **Gap auditor** | Find cross-system gaps: questions pointing at taxonomy that doesn't exist; questions with no solution or no tags; books referencing dead assets; broken Crucible↔Books links. | The "gaps between systems" the founder named. |
| **Student-signal analyst** | Read `userprogress`: chapters everyone fails, where students drop off, what's never attempted → weekly "what to build/fix" brief. | Silent product data nobody reads. |

### Layer B — the Canvas Brain + its three faces (offense)
One institutional memory, fed from every source, queried through different faces.

**What feeds the brain (inputs):**
- **Content** — books, question bank, written solutions, and *transcripts* of video solutions + lectures (videos need speech-to-text before they're searchable — the one genuinely new ingestion step).
- **Operations** — `PROJECTS.md`, decision/ADR docs, incident history, the watchdog findings from Layer A.
- **Industry** — the scout's findings (below).

**The three faces (outputs):**
1. **Founder advisor** *(founder-facing, build first)* — reads the brain (content + operations + watchdog findings + scout news) and tells the founder what to fix or build next. This is also where the watchdogs' "morning brief" lives — same face. **This is the face the founder personally asked for.**
2. **Student tutor** *(student-facing, build last)* — answers a student's doubt by *retrieving* the real Canvas solution/lecture for that concept and explaining it in our documented voice, linking the real video. Answers *as Canvas*, grounded and cited.
3. **Navigator** *(student/staff-facing)* — "where do I learn X?" / "what's next after this chapter?" — search + guided pathways across the ever-growing library so nothing gets lost.

### The industry scout (first-mover advantage)
A scheduled agent that watches the JEE/NEET landscape and writes findings *into the brain*, so the founder advisor's suggestions are already aware of competitor moves. **We already pay for vidiq** (the connected `vidiq_*` MCP) — it's literally competitor-content intelligence (rival channel breakouts, trending topics, keyword gaps). The scout uses vidiq + web search, subject to the SSRF rules in §5.

---

## 3. Critical correction: "continuously trained" ≠ fine-tuning

The founder's instinct was an AI "continuously trained on our content." The practical, cheaper, safer path that gets the *same observable result* (answers in our voice, grounded in our content) is **retrieval**, not literal model training:

| | Fine-tuning (what to avoid) | Retrieval (what we'll do) |
|---|---|---|
| New content searchable | Only after a retraining cycle | **Instantly**, the moment it's published |
| Source of answers | Baked into weights — can "remember" wrong | **Cites the real document** every time |
| Cost | Pay per training run, repeatedly | A fraction; no lock-in to a stale snapshot |
| Risk | Hallucinates confidently under our brand | Grounded + cited by default |

**Huge head start:** our style is already written down — the 6-section solution structure and the plain-English-for-tier-2/3-town voice live in `_agents/workflows/math-solution-workflow.md` and the `teacher-voice-profile.md` system. The AI imitates a *documented* voice plus real examples; it doesn't have to guess.

---

## 4. Canvas Brain vs. GBrain — keep them separate

- **GBrain** is the founder's *personal* brain (`~/brain/`, the `gbrain` MCP) — personal thinking, decisions, cross-company context. Stays private.
- **Canvas Brain** is the *institutional* memory — the product, content, incidents, student data, roadmap — that the whole operation (and its agents) can query.

They must not be merged. The founder advisor reads the Canvas Brain; the student-facing faces read only the student-safe slice of it (see §5.2).

---

## 5. SECURITY GUARDRAILS — mandatory for every part of this system

The founder explicitly asked us to be careful here. These rules extend CLAUDE.md §8 (security) and §0.6 (content protection) to the AI-native systems. **Any agent building any part of this must honor them.**

### 5.1 Standing agents are read-and-report by default
- A watchdog or scout **observes and reports**. It does **not** mutate content, the DB, or config on its own.
- If a standing agent ever needs to *act* (e.g. auto-revert a content loss), it must: (a) act only through the **sanctioned gateway** (`scripts/lib/book-writer.js` for book content — never raw Mongo per §0.6), (b) be **reversible** (snapshot + audit entry), (c) be **scoped** to a narrow, pre-approved action, and (d) be explicitly approved by the founder for that action class. Approval for one action does not authorize others.
- Remember the irony: an agent caused the June 10 content loss. Autonomy without guardrails is the thing we're protecting against, not adding.

### 5.2 The brain must enforce who-can-see-what (no data leakage)
- The Canvas Brain holds **operational and student data** alongside public content. The **student-facing faces (tutor, navigator) must only retrieve the student-safe, published slice** — never operational docs (`PROJECTS.md`, ADRs, incidents), never another student's data, never unpublished/`deleted_at` content.
- Enforce this at the **retrieval layer** (filter what can be returned per face/role), not just in the prompt. Treat the founder advisor as **super-admin-gated**; student faces as student-auth-gated and content-scoped. Reuse the existing RBAC (`@canvas/data/rbac`) and tenant model rather than inventing new auth.
- The brain becomes a high-value target *because* it knows everything — protect it accordingly.

### 5.3 Treat all ingested + retrieved content as data, never instructions (prompt injection)
- Lecture transcripts, web pages the scout fetches, and student input can contain text that tries to hijack the AI ("ignore your instructions…"). Retrieved content is **reference material**, never commands. Keep system instructions separate from retrieved text; never let a retrieved document change what the agent is allowed to do or reveal.

### 5.4 Grounded-and-cited, or don't answer
- A student-facing answer "in our style" must be built from **retrieved real content with a citation/link**, never free-generated. A wrong solution in our voice under our brand is worse than no answer. Any calculation an AI states must be checked, not trusted (same principle as the generative-tutor proposal, `ADAPTIVE_MICRO_QUIZ.md` §4.2).

### 5.5 External requests (scout) follow the SSRF rules
- The scout fetches user-/world-supplied URLs. Per CLAUDE.md §8.8: **HTTPS only**, hostname validated by strict `.endsWith()` suffix matching against an allowlist (never `.includes()`). The existing OPSIN/name-to-structure proxy (`/api/v2/iupac/name-to-structure`) is the in-repo pattern to copy.

### 5.6 The usual API + secret rules still apply
- Every new endpoint that writes gets an auth guard (§8.1–8.2); bodies validated with a schema/whitelist (§8.4); errors don't leak internals (§8.5); queries bounded with `.limit()` (§8.6). No `NODE_ENV` auth bypass (§8.3). API keys server-side only; never in `NEXT_PUBLIC_*` or client headers (§8.7).

### 5.7 Cost guardrails (the bill incident taught us this)
- Every standing agent and every LLM-backed face must have: a **schedule cap** (how often it can run), **turn/token caps** per run, **model tiering** (cheap model for routine passes, strong model only when needed), and **prompt caching**. A runaway loop or an uncapped per-turn API call is both a cost and a reliability bug. New public faces follow the §10 caching rules.

---

## 6. Phased roadmap

Build the foundation first, then the lowest-risk face, then expand outward.

1. **Canvas Brain substrate (minimal)** — ✅ **BUILT 2026-06-18.** A repo-resident, git-diffable institutional index at `_agents/brain/` (mirrors the NCERT corpus; runs on Claude Max, no API). Pointer-based: it *synthesizes + links* the existing canonical docs (`PROJECTS.md`, CLAUDE.md, state files, ADRs, SEO playbook) rather than duplicating them, and adds net-new institutional knowledge (systems map, incident log). Entry point: `_agents/brain/BRAIN.md`.
2. **Founder advisor face** — ✅ **BUILT 2026-06-18.** An agent-run workflow + skill (`/founder-advisor`), super-admin/founder only, no API. Reads the brain + live-checks the system (caching invariants, content-protection, cross-system gaps, stalled dependencies) and returns a prioritized "what to fix/build next" brief. Also the home of the watchdog "morning brief."
3. **Supervisory layer watchdogs** — ✅ **ALL BUILT 2026-06-18** in `scripts/watchdogs/` (read-only, exit-code alerting): **content guard** (+ `restore-helper.js`; clean against 673 pages), **cost/perf sentinel** (clean), **gap auditor** (found 55 orphan chapter_id + 828 dangling tags + 4,176 missing-solution backlog), **student-signal analyst** (sparse until usage grows), and a **morning-brief** runner that aggregates all four into one prioritized brief with worst-severity exit. Each is read-and-report. Remaining: **schedule** the morning brief (daily cron, alert on non-zero exit).
4. **Video/lecture transcript feed** → then the **Navigator** (search/pathways) → then the **Student tutor** (most public; ship last, only once grounding + §5.2/§5.4 are proven).
5. **Industry scout** — ✅ **BUILT 2026-06-18** (`/industry-scout` skill + `_agents/workflows/INDUSTRY_SCOUT.md`; agent-run on Max via vidiq MCP + web, writes dated scans to `_agents/brain/industry/`, read by the advisor).
6. **Content Radar** — ✅ **BUILT 2026-06-19** (`/content-radar` skill + `_agents/workflows/CONTENT_RADAR.md`; agent-run on Max). The tactical sibling of the scout: fuses our product data (student-signal) + vidiq YouTube intelligence + the exam calendar into a ranked "what to record this week, and when" brief in `_agents/brain/content-radar/`, read by the advisor. Light daily + heavy weekly. **Scheduling note (§5.1/§5.7 in practice):** vidiq is an interactively-authenticated claude.ai connector that a headless cron can't reach, so unattended runs would silently degrade — the schedule is therefore a launchd *reminder* (`scripts/content-radar/remind.sh`, daily 07:30 / weekly Mondays) that prompts the founder to run it in a live session, not a headless agent. Upgrading to truly unattended runs is a future decision (make vidiq reachable headlessly + authorize a headless agent).

---

## 7. What we already own (don't rebuild)

- **Scheduled agents / cron** — agents can already run on a clock without the founder starting them.
- **GBrain MCP** — personal brain (keep separate, but a reference for how a brain is structured).
- **NCERT corpus** — an existing repo-resident, citable, retrieval-grounded index (`_agents/ncert/`) — the working template for "grounded + cited" and an in-repo brain store.
- **vidiq MCP** — competitor-content intelligence the scout can use immediately.
- **`book-writer.js` version history + content-loss guard** — the data the content guard reads.
- **Documented teacher voice** — `teacher-voice-profile.md`, the solution-workflow docs — the style the tutor imitates.
- **RBAC + tenant model** (`@canvas/data/rbac`, `@canvas/data/tenancy`) — the access control the brain's faces reuse.
- **The cockpit + GBrain logging rituals** — how findings get surfaced and remembered.

---

## 8. Open questions

- **Brain storage at scale:** in-repo git-diffable index is chosen for now (built). Revisit a managed vector store only when content volume / semantic-search quality demands it — trade-off is diffability/auditability vs. scale.
- **Transcription:** which speech-to-text for video solutions + lectures, and where the transcripts live (wave 2).
- **Build order of faces:** founder advisor first — done. Confirm whether the content guard watchdog lands next.
- **Anthropic API:** deferred to the student-facing phase per the runtime decision above. Internal phases run on Claude Max, so the persona-tutor credit blocker does not apply here.

---

## Changelog
- **2026-06-18** — Doc created. Strategy agreed with founder across a multi-turn discussion: supervisory watchdog layer + one-brain-three-faces + scout + founder advisor; "continuously trained" corrected to retrieval; security guardrails (§5) written per founder's explicit request.
- **2026-06-19 (build)** — Shipped **Content Radar** (`/content-radar` + `_agents/workflows/CONTENT_RADAR.md` + `_agents/brain/content-radar/`): the tactical YouTube content-planning sibling of the industry scout, fusing product data + vidiq + exam calendar into a ranked "what to record this week" brief. Light-daily + heavy-weekly cadence via a launchd reminder (`scripts/content-radar/remind.sh`) — chosen over a headless cron because vidiq is an interactively-authed connector unreachable headlessly (would silently degrade). First live brief written; top call = RE-NEET 2026 last-48h chemistry (exam 21 Jun). Surfaced that the channel's subs are flat at 136K despite daily uploads.
- **2026-06-18 (build)** — Shipped on Claude Max (no API): Canvas Brain substrate (`_agents/brain/`), founder advisor (`/founder-advisor`), industry scout (`/industry-scout`), and the entire Layer-A watchdog suite (`scripts/watchdogs/`: content-guard + restore-helper, cost-sentinel, gap-auditor, student-signal, morning-brief). Also cleaned up 6 pre-§0.6 destructive book scripts (refuse-to-run guard). All Node watchdogs verified live. **Remaining: schedule the morning brief; the two student-facing faces (tutor, navigator) await the API decision.**
