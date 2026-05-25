// Public surface of @canvas/seo.
// Import sub-modules directly (./sync-gsc, ./sync-crux, ./url-groups,
// ./config) from route handlers and scripts. This file re-exports the
// commonly-used types for convenience.

export type { FetchedGscRow, SyncDayResult } from './sync-gsc';
export type { CruxFetchResult } from './sync-crux';
export { URL_GROUPS } from './url-groups';
