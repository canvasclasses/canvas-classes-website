// features/flashcards — chemistry flashcards study UI.
//
// Routes:
//   /chemistry-flashcards            → app/chemistry-flashcards/page.tsx
//   /chemistry-flashcards/[chapter]  → app/chemistry-flashcards/[chapter]/page.tsx
//
// Per-card progress sync goes through @/app/utils/progressSync.

export { default as FlashcardsClient } from './components/FlashcardsClient';
export { default as FlashcardsChapterClient } from './components/FlashcardsChapterClient';
export { default as StudyHeatmap } from './components/StudyHeatmap';
export * as flashcardsData from './lib/flashcardsData';
// Shared helpers moved out in Phase 5.13:
//   flashcardTaxonomy → @canvas/data/flashcards/flashcardTaxonomy (5.13a)
//   flashcardMarkdown → @canvas/ui/flashcardMarkdown (5.13b)
// Consumers import directly from those packages; this barrel no longer
// re-exports them.
export { useFlashcardMeta } from './hooks/useFlashcardMeta';
export { useFlashcardSettings } from './hooks/useFlashcardSettings';
