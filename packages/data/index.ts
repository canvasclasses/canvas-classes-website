// @canvas/data — shared data layer
//
// Most callers in this monorepo use subpath imports (e.g.
// `@canvas/data/models/Question.v2`) per the `exports` map in package.json.
// This barrel is for the rare consumer that wants `from '@canvas/data'`
// directly, and for discoverability: each line here is "this package owns this".
//
// No `export *` — explicit names so the surface is visible at a glance.

// ── Database connection ──
export { default as connectToDatabase, mongoose } from './db/mongodb';

// ── Most-touched models ──
export { QuestionV2, type IQuestion } from './models/Question.v2';
export {
  UserProgress,
  type IQuestionAttempt,
  type AttemptConfidence,
} from './models/UserProgress';
export {
  StudentChapterProfile,
  type IStudentChapterProfile,
} from './models/StudentChapterProfile';
export {
  StudentResponse,
  type IStudentResponse,
  type StuckPoint,
} from './models/StudentResponse';
export { Chapter, type IChapter } from './models/Chapter';
export { Asset, type IAsset } from './models/Asset';
export { AuditLog, type IAuditLog } from './models/AuditLog';
export { ActivityLog, type IActivityLog } from './models/ActivityLog';
export { ResourceLink, type ResourceType } from './models/ResourceLink';
export { UserRole, type Subject, type RoleType, type IUserRole } from './models/UserRole';

// ── Taxonomy ──
export { TAXONOMY_FROM_CSV, type TaxonomyNode } from './taxonomy/taxonomyData_from_csv';
export { getTagName, getParentChapter, getChapterCategory } from './taxonomy/lookup';

// ── Display ID generator ──
export {
  generateDisplayId,
  regenerateDisplayId,
  getDisplayIdPrefix,
  type DisplayIdGenerationResult,
} from './id-generator';

// ── Difficulty calibration ──
// Imported namespace-style: `import { difficulty } from '@canvas/data'` then
// `difficulty.someUtil(...)` — see ./difficulty.ts for the function list.
export * as difficulty from './difficulty';

// ── Question payload schemas (Zod) ──
export * as questionSchemas from './schemas/question';

// ── Shared types ──
// Re-exported here because the data models depend on them; not every type from
// books.ts is a "data" concern (most are content-block shapes) so consumers
// importing block types should reach for `@canvas/data/types/books` directly.
export type { Book, BookChapter, BookPage } from './types/books';
