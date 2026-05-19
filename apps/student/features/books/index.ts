// features/books — chapter-level digital book reader (multi-grade) + admin editor.
//
// Routes (student):
//   /books/[bookSlug]/[pageSlug]                → main book reader
//   /live-books                                  → coming-soon page
//   /class-9/[bookSlug]/[pageSlug]               → canonical class-9 path
//   /class-10/, /class-11/, /class-12/ + sub-paths
//   /cbse-class-10/, /cbse-class-11/, /cbse-class-12/  → CBSE-specific SEO
//   /ncert-solutions/                            → NCERT solutions hub
//   /download-ncert-books/                       → NCERT PDF downloads
//
// Routes (admin) live at app/api/v2/books/* and the editor UI is mounted via
// app/crucible/admin/* — those imports go through this feature.

export { default as BookReader } from './components/reader/BookReader';
export { default as PageRenderer } from './components/renderer/PageRenderer';
export { default as GradeLandingPage } from './components/GradeLandingPage';
export { useBookBookmarks } from './hooks/useBookBookmarks';
export { useBookProgress } from './hooks/useBookProgress';
export { useBookStats } from './hooks/useBookStats';
export { useBookUserState } from './hooks/useBookUserState';
export { SITE_URL, buildBookPageMetadata, buildBookPageJsonLd } from './lib/bookPageSeo';
// Phase 5.13c: utils moved to @canvas/data/books/utils. Consumers should
// import directly from the package; this re-export is a temporary bridge
// for any caller that still imports from this barrel.
export { flattenBlocks, computeReadingTime, computeContentTypes, extractVideoTitle } from '@canvas/data/books/utils';
export * as blockData from './data/blockData';
export * as ncertBooksData from './data/ncertBooksData';
export * as ncertData from './data/ncertData';
export * as ncertMapping from './data/ncertMapping';
