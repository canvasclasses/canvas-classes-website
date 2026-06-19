# How to keep the Canvas Brain true

> A brain that goes stale silently is worse than no brain — it gives confident wrong answers. This is the maintenance protocol. It mirrors the cockpit ritual (CLAUDE.md §0.5): agent-maintained, not human-maintained, because humans forget.

## The core rule: pointer-first
Before adding anything, ask **"does this fact already have a canonical home?"** (a model, a workflow doc, a state file, an ADR, the cockpit).
- **Yes →** point to it from the relevant brain file. Do NOT copy the content. The canonical doc is the source of truth; the brain only links + summarizes.
- **No (it's net-new institutional knowledge — a systems joint, an incident, a synthesis) →** add it to the right brain file (`systems-map.md`, `incidents.md`, `company-overview.md`).

## When to update
- **A new incident / root-cause diagnosis** → add to `incidents.md` (with the standing rule that now guards it). Do this whenever CLAUDE.md §11 would have you log to GBrain a bug root cause.
- **A new system or a new joint between systems** → update `systems-map.md`.
- **A product/surface/audience change** → update `company-overview.md`.
- **A new canonical doc worth knowing about** → add a row to the pointer table in `BRAIN.md`.
- **The industry scout produces findings** (future) → it writes into an `industry/` folder here.

## When NOT to add
- Anything already in CLAUDE.md, a model, a workflow doc, the cockpit, or git history — link, don't duplicate.
- Conversation-only detail that won't matter in six weeks.
- Student content itself — that lives in `book_pages` / `questions_v2`; the brain points at the inventory state files, it is not a second copy of the content.

## Staleness check (the advisor does this)
When the [Founder Advisor](../workflows/FOUNDER_ADVISOR.md) runs, it spot-checks brain claims against reality (e.g. "does this file/flag/route the brain names still exist?"). If a brain entry names something that no longer exists, the entry is stale — fix or delete it in the same session. Recalled facts reflect what was true when written; verify before acting (same caution as the auto-memory rule).

## Separation from GBrain
Never copy founder-personal GBrain content (`~/brain/`) into here, and never copy institutional operational detail out to a student-facing surface. The brain's value depends on these boundaries holding.
