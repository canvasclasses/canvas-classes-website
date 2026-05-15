// features/notes — handwritten chapter notes (image-based + Crucible practice rail).
//
// Routes:
//   /handwritten-notes              → app/handwritten-notes/page.tsx (index)
//   /handwritten-notes/[chapter]    → app/handwritten-notes/[chapter]/page.tsx (single chapter)

export { default as HandwrittenNotesClient } from './components/HandwrittenNotesClient';
export { default as ChapterHero } from './components/ChapterHero';
export { default as ChapterNotesGrid } from './components/ChapterNotesGrid';
export { default as ChapterToolCard } from './components/ChapterToolCard';
export { default as ChapterTopicTOC } from './components/ChapterTopicTOC';
export { default as ChapterReadingShell } from './components/ChapterReadingShell';
export { default as CrucibleHeroRail } from './components/CrucibleHeroRail';
export { default as NextChapterCard } from './components/NextChapterCard';
export { default as SideBySidePractice } from './components/SideBySidePractice';
export { default as ViewTracker } from './components/ViewTracker';
export * from './data/handwrittenNotesData';
export * from './data/chapterMetadata';
export { getToolCardForSlug } from './data/toolCardConfig';
export { getChapterCrucibleStats } from './lib/chapterStats.server';
