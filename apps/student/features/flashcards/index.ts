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
export * as spacedRepetition from './lib/spacedRepetition';
export * as flashcardTaxonomy from './lib/flashcardTaxonomy';
export * as flashcardMarkdown from './lib/flashcardMarkdown';
export { useFlashcardMeta } from './hooks/useFlashcardMeta';
export { useFlashcardSettings } from './hooks/useFlashcardSettings';
