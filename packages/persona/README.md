# @canvas/persona

The persona contract + the writers that encode it. Shared between
`apps/student` (today) and `apps/admin` + AI training pipelines (future).

## Why a package, not just code in `apps/student/lib/`

Admin dashboards will display student personas and AI training will produce
features from them. If admin and pipelines re-implemented "what does
`mastery_level: 'Mastered'` mean?" or "what proficiency level corresponds to
these counters?", they would drift from the student-side rules silently.

This package is the canonical home for those rules — constants, thresholds,
classifiers — alongside the writers that apply them. Whoever needs to read,
write, or display persona data imports the contract from here.

## Layout

| File | What lives here |
|---|---|
| `contract.ts` | **Read-side surface.** Constants (`MASTERY_THRESHOLDS`, `PROFICIENCY_ORDER`, `RECENT_ATTEMPTS_CAP`, `ALLOWED_TIERS`), pure classifiers (`computeChapterMasteryLevel`, `computeProficiencyLevel`, `shouldDropBack`, `dropOneLevel`, `computeDominantWeakness`, `resolveConfidenceTier`). Zero I/O, zero mutation — safe for any context. |
| `writer.ts` | `applyAttemptToProgress` — single mutation surface for the tiered counter contract on `UserProgress`. Mutates an in-memory hydrated mongoose doc; caller saves. Re-exports `resolveConfidenceTier` for back-compat. |
| `profile-engine.ts` | `updateProfileFromResponse`, `updateProfileFromAttempt`, `createEmptyProfile`, `createEmptyMicroConceptProfile` — mutators for `StudentChapterProfile`. Re-exports the classifiers from `contract.ts`. |
| `recommendation-engine.ts` | `getRecommendations`, `getResourceForConcept` — async DB reads. The recommendation bridge wired but currently stubbed. |
| `scoring.ts` | `isAnswerCorrect`, `QuestionType`, `ScorableQuestion` — pure scoring helpers. |

## Public surface

Subpath imports are the primary contract:

```ts
import { computeChapterMasteryLevel, MASTERY_THRESHOLDS } from '@canvas/persona/contract';
import { applyAttemptToProgress }                         from '@canvas/persona/writer';
import { updateProfileFromAttempt }                       from '@canvas/persona/profile-engine';
import { getRecommendations }                             from '@canvas/persona/recommendation-engine';
import { isAnswerCorrect }                                from '@canvas/persona/scoring';
```

The barrel (`@canvas/persona`) re-exports the most-touched symbols for
ad-hoc usage. It is NOT a contract — reach for the subpath when a symbol
isn't in the barrel.

## Rules

- **No `@/` alias inside this package.** Internal imports relative
  (`./contract`); cross-package imports use `@canvas/data/...`.
- **No imports from `apps/*`.** Packages must not know which app consumes them.
- **`@canvas/persona` may depend on `@canvas/data`** (models, taxonomy lookups).
  `@canvas/data` must NEVER depend on `@canvas/persona` — the cycle was
  intentionally broken in Phase 1 (removed `UserProgress.recordAttempt`
  instance method) to enable this.
- **Caller validates input.** The writer/profile-engine functions accept
  typed inputs and trust the caller has validated the request body. Every
  route handler in `apps/student/app/api/v2/user/...` validates the body
  before calling these functions; new consumers must do the same.
- Consumed as TS source — Next.js compiles via `transpilePackages: ['@canvas/persona']`.

## Reference

The contract these rules encode is described in narrative form at
`_agents/CRUCIBLE_ARCHITECTURE.md` §3.2 (tier modes) and §4.2
(`concept_mastery` shape). If `contract.ts` and the doc disagree, the doc
is the canonical reference and `contract.ts` is the bug.
