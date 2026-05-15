# @canvas/data

Shared data layer for both `apps/student` and `apps/admin`. Empty
scaffold — will be populated in Phase 1 of the monorepo migration.

Planned contents:

| Slot | What lives here |
|---|---|
| `models/` | All Mongoose schemas (Question.v2, UserProgress, StudentChapterProfile, TestResult, StudentResponse, Book, Flashcard, …) |
| `db/` | `mongodb.ts` — connection pool |
| `schemas/` | Zod validation schemas for write payloads |
| `taxonomy/` | `taxonomyData_from_csv.ts` + `taxonomyLookup` |
| `id-generator/` | `generateDisplayId` + `CHAPTER_PREFIX_MAP` |
| `difficulty/` | Level 1–5 calibration utils |
