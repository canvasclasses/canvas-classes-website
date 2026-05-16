// @canvas/services — server-side route-handler logic shared between
// apps/student and apps/admin. Subpath imports are the primary pattern:
//
//   import { chaptersGET } from '@canvas/services/chapters';
//   import { questionsGET, questionsPOST } from '@canvas/services/questions';
//
// This barrel is intentionally empty of business-logic re-exports. The
// nine routes each live in a flat file and are imported via their subpaths
// (see package.json `exports`). Use this index only for shared types.

export type { ServiceDeps } from './types';
