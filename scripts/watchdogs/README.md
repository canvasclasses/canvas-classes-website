# Watchdogs — the AI-native supervisory layer (Layer A)

Standing agents that watch the whole system and **report** (never mutate). Each is the on-a-schedule version of a check the [Founder Advisor](../../_agents/workflows/FOUNDER_ADVISOR.md) does on demand. Design + rationale: [`_agents/plans/AI_NATIVE_ROADMAP.md`](../../_agents/plans/AI_NATIVE_ROADMAP.md) §2 (Layer A) and §5 (security: read-and-report by default).

## Built

| Watchdog | Script | Catches | Exit codes |
|---|---|---|---|
| **Content guard** | `content-guard.js` | Live Book content loss that bypassed the gateway — a page that shrank, lost a video/audio/image, or was deleted with no snapshot/audit (the 2026-06-10 signature). | `2`=🔴 untracked loss · `1`=🟡 warnings · `0`=clean · `3`=error |
| **Cost / perf sentinel** | `cost-sentinel.js` | Public pages that opt out of the edge cache (`force-dynamic`/`revalidate=0`), over-aggressive `revalidate=60`, and the E132 layout `cookies()`/`headers()` trap (the June-2026 bill spike). Code scan, no DB. | `2`=🔴 uncached public page · `1`=🟡 rev=60 · `0`=clean |
| **Gap auditor** | `gap-auditor.js` | Cross-system question-bank gaps: orphan `chapter_id` (not in taxonomy), dangling `tag_id`, published-with-no-chapter; reports the missing-solution backlog as an informational metric. | `2`=🔴 integrity gap · `1`=🟡 no-chapter · `0`=clean |
| **Student-signal analyst** | `student-signal.js` | High-failure / never-attempted chapters from `learning_events` + `user_progress`. Reports "too sparse" honestly below a usage floor. | `1`=high-failure chapters · `0`=clean/sparse |
| **Morning brief** | `morning-brief.js` | Orchestrator — runs all the above, aggregates into one prioritized brief, exits with the worst severity (the founder-facing daily output). | `2`/`1`/`0` = worst child severity |

Recovery companion: `restore-helper.js <pageId> <version>` — one-command, audited, reversible restore (wraps the gateway's `restorePageVersion`, which snapshots the current page first).

## Planned (next)
- **Vercel usage hook** — the cost sentinel scans code today; wire live Vercel usage stats when an API token is available.
- **Scheduling** — run `morning-brief.js` on a daily cron and alert only on a non-zero exit.

## How to run
```bash
node scripts/watchdogs/morning-brief.js          # the daily brief — runs all watchdogs
node scripts/watchdogs/morning-brief.js --json   # machine-readable aggregate

# or any single watchdog, human-readable or --json:
node scripts/watchdogs/content-guard.js
node scripts/watchdogs/cost-sentinel.js
node scripts/watchdogs/gap-auditor.js
node scripts/watchdogs/student-signal.js
```
All read-only. The DB-backed ones use `MONGODB_URI` from `.env.local` via `book-writer.js`. Safe to run anytime.

## Scheduling (when ready)
These are designed to run on a schedule and surface findings to the founder (the "morning brief"). Until they're wired to a scheduler, run them on demand or via the founder advisor. A non-zero exit code is the alert signal — a scheduler can notify only when exit ≠ 0. Keep them **read-and-report**: any *action* on a finding (e.g. a restore) is a separate, founder-initiated step through the gateway.
