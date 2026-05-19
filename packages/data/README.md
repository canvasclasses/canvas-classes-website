# @canvas/data

Shared data layer for both `apps/student` and `apps/admin`. Mongoose models, the
MongoDB connection, Zod request schemas, taxonomy + lookups, the `display_id`
generator, difficulty calibration, and the shared types that the models depend on.

## Layout

| Slot | What lives here |
|---|---|
| `models/` | All Mongoose schemas (Question.v2, UserProgress, StudentChapterProfile, TestResult, StudentResponse, Book, Flashcard, ActivityLog, …) |
| `db/mongodb.ts` | Connection pool — `connectToDatabase` default export |
| `schemas/question.ts` | Zod validation for `POST /questions` / `PATCH /questions/:id` payloads |
| `taxonomy/taxonomyData_from_csv.ts` | Single source of truth for chapters + tags |
| `taxonomy/lookup.ts` | `getTagName`, `getChapterName`, etc. — O(1) lookups |
| `id-generator/index.ts` | `generateDisplayId` + `CHAPTER_PREFIX_MAP` |
| `difficulty.ts` | Level 1–5 calibration utils (shared between admin write + student display) |
| `types/books.ts` | Book / BookPage / ContentBlock types (used by models AND ~30 importers across apps) |

## Public surface

**Primary pattern: subpath imports.** Every file in the package has a matching
entry in `package.json` `exports`, so consumers import by exact location:

```ts
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import connectToDatabase from '@canvas/data/db/mongodb';
import { TAXONOMY_FROM_CSV } from '@canvas/data/taxonomy/taxonomyData_from_csv';
import { generateDisplayId } from '@canvas/data/id-generator';
```

Subpaths win over the barrel because (a) they make the call graph greppable —
you can find every model usage by searching `@canvas/data/models/X` — and (b)
they avoid forcing the barrel to be an exhaustive map of every symbol the
package exports.

**Convenience barrel: `@canvas/data`.** The root `index.ts` re-exports the
most-touched symbols (Question.v2, UserProgress, StudentChapterProfile,
StudentResponse, mongo connection, taxonomy lookups, id generator, difficulty
helpers, schemas, the core book types). Use it for ad-hoc scripts or when you
need several symbols at once. It is NOT a contract — if a symbol you need
isn't re-exported, reach for the subpath; don't grow the barrel.

Anything reachable only via internal relative paths (e.g. helpers a model
imports from a sibling file) is internal — don't import it from outside the
package.

## Rules

- **No `@/` alias inside this package.** Imports between sibling files are
  relative (`./models/Question.v2`, `../db/mongodb`).
- **No imports from `apps/*`.** Packages must not know which app consumes them.
- **No imports from sibling packages yet.** Phase 2 (`@canvas/persona`) will
  import from here; this package must remain leaf in the dependency graph.
- Consumed as TS source (`main: "./index.ts"`) — Next.js compiles it via
  `transpilePackages: ['@canvas/data']`.
