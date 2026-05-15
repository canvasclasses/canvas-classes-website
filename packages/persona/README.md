# @canvas/persona

Tiered persona pipeline shared across both apps. Empty scaffold —
populated in Phase 2.

Planned contents:

| Slot | What lives here |
|---|---|
| `lib/persona-writer.ts` | `applyAttemptToProgress` + `resolveConfidenceTier` |
| `lib/profile-engine.ts` | `updateProfileFromAttempt`, `createEmptyProfile` |
| `lib/recommendation-engine.ts` | `getRecommendations`, `getResourceForConcept` |
| `lib/question-scoring.ts` | `isAnswerCorrect` |

See `_agents/CRUCIBLE_ARCHITECTURE.md` §3–6 for the contract.
