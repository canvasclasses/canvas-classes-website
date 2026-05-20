// @canvas/ui — shared visual components used by both apps.
//
// Subpath imports are the primary pattern:
//   import MathRenderer from '@canvas/ui/MathRenderer';
//   import { flashcardMarkdownComponents } from '@canvas/ui/flashcardMarkdown';
//
// The barrel below re-exports the same defaults for ad-hoc `from '@canvas/ui'`
// usage. Each component lives in a flat file at the package root; subfolders
// will appear only when a component has its own internal helpers.

export { default as MathRenderer } from './MathRenderer';
export { default as MoleculeViewer } from './MoleculeViewer';
export * from './flashcardMarkdown';
