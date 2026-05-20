// @canvas/book-renderer — shared reader-side renderer for the Live Books platform.
//
// Migrated from apps/student/features/books/components/renderer/ during the
// books-editor admin migration. Two callers consume this package:
//   - apps/student/features/books/components/reader/BookReader.tsx
//   - apps/admin/features/admin/books-editor/BookWorkspace.tsx (preview pane)
//
// Subpath imports are the primary pattern:
//   import PageRenderer from '@canvas/book-renderer/PageRenderer';
//   import BlockRenderer from '@canvas/book-renderer/BlockRenderer';
//
// The barrel below mirrors the same defaults for `from '@canvas/book-renderer'`.

export { default as PageRenderer } from './PageRenderer';
export { default as BlockRenderer } from './BlockRenderer';
export {
  ExtraSimulatorsProvider,
  ExtraSimulatorsContext,
  type ExtraSimulators,
} from './simulators-context';
