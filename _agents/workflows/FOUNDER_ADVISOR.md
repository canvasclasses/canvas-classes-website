# Founder Advisor — the AI that watches the whole company and tells the founder what to do next

> **What it is.** The first face of the [Canvas Brain](../brain/BRAIN.md). An agent (you, in a Claude Code session) reads the brain + the cockpit + the live system, sweeps the joints where things silently break, and returns **one prioritized brief: what to fix, what to build, what's quietly drifting.**
>
> **Runtime.** Runs on the founder's **Claude Max plan inside a Claude Code session — no API, no server, no cost beyond the session.** It is super-admin/founder-only by construction (it reads operational data). This is the manual stand-in for the scheduled watchdog layer until those agents are built; it does on demand what they will do on a schedule.
>
> **Invocation.** `/founder-advisor` (the skill), or "run the founder advisor", "what should I work on", "give me the company brief", "what's drifting".

## The prime directive: be grounded, never fabricate
Every line in the brief must trace to something you actually read or checked this run — a file, a grep result, a cockpit row, a state-file number. **If you cannot verify it cheaply, say "unverified" — do not invent a finding.** A confident wrong brief is worse than a short honest one. This is the §5.4 grounding rule applied to the advisor itself.

## What it reads (in order)
1. **The brain** — [`BRAIN.md`](../brain/BRAIN.md), [`systems-map.md`](../brain/systems-map.md), [`incidents.md`](../brain/incidents.md). This is the map of what matters and what has bitten us.
2. **The cockpit** — [`PROJECTS.md`](../PROJECTS.md): active projects, next actions, and especially the **⛔ Waiting-on-a-dependency** section (the most-forgotten work).
3. **The state files** — [`CRUCIBLE_STATE.md`](../state/CRUCIBLE_STATE.md), [`LIVE_BOOKS_STATE.md`](../state/LIVE_BOOKS_STATE.md) for current inventory/gap counts (don't re-query Mongo if the state file is fresh).
4. **The live system** — the cheap checks below.

## The sweep (cheap, grep/state-level checks across the joints)
Run the ones relevant to what changed recently (`git log`/`git status` to see). None of these need the DB or the API.

| Check | How (cheap) | Maps to |
|---|---|---|
| **Caching regressions** | grep public `apps/student/app/**/page.tsx` for `force-dynamic` and `revalidate = 0` / `revalidate = 60`; grep the layout tree for `cookies()`/`headers()` from `next/headers`. | Cost sentinel / the bill incident |
| **Unguarded write routes** | grep new/changed `app/api/**/route.ts` for `POST`/`PATCH`/`DELETE` lacking `requireAdmin`/`getAuthenticatedUser`/`gate`. | Security §8 |
| **Content-protection bypass** | grep new scripts for raw `book_pages` `deleteOne`/`deleteMany`/`$pull`/`updateOne` (should go through `book-writer.js`). **Also run the watchdog:** `node scripts/watchdogs/content-guard.js` (read-only; exit 2 = untracked loss). | Content guard / June-10 |
| **Stalled dependencies** | read the cockpit's Waiting-on-a-dependency list; flag anything blocked a long time or now unblockable. | Lost work |
| **Cross-system gaps (counts)** | read the state files for: questions missing tags/solutions, chapters with no micro_topics, unresolved flags. | Gap auditor |
| **Brain staleness** | spot-check that files/flags/routes the brain names still exist; fix stale entries. | how-to-update.md |
| **Student-signal (when available)** | if a fresh signal source exists, surface high-failure / never-attempted chapters. Otherwise mark "needs data". | Student-signal analyst |

## The brief format (what you return)
Keep it short, prioritized, and plain-English (the founder is non-technical — lead with the observable consequence, not the mechanism).

```
# Company brief — <date>

## 🔴 Needs you now (do this first)
1. <finding in plain English> — <why it matters / what breaks> 
   Evidence: <file/grep/state line you actually checked>
   Suggested action: <single concrete next step> · effort: <S/M/L>

## 🟡 Drifting (watch / soon)
- <finding> — evidence — suggested action

## 🟢 Opportunities (build next)
- <from student signals, stalled-but-unblockable work, or gaps that unlock a flagship>

## ✅ Checked and clean
- <joints you swept that were fine — so the founder knows coverage>

## Couldn't verify (needs data/DB/API)
- <anything you deliberately did NOT assert because you couldn't check it cheaply>
```

Rules for the brief:
- **Prioritize by consequence × reversibility.** A live cost leak or a content-loss risk outranks a cosmetic gap.
- **Never more than ~5 items in 🔴.** If everything is urgent, nothing is.
- **Cite evidence on every 🔴/🟡 line.** No evidence → it goes in "Couldn't verify".
- **Respect the guardrails:** the advisor *reports*. It does not mutate content/DB/config. If it recommends an action that touches Live Book content, that action must later go through `book-writer.js` with founder approval (§5.1).

## After the brief
- If the run surfaced a new incident root-cause or a new systems joint, **update the brain** (`incidents.md` / `systems-map.md`) per `how-to-update.md`.
- If it advanced or unblocked a project, **update the cockpit row** (CLAUDE.md §0.5).
- Offer to log anything decision-worthy to GBrain (CLAUDE.md §11).
