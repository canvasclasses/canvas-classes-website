# Canvas Classes - Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- Mobile app companion
- Progress sync across devices
- Advanced analytics dashboard

---

## [2026-02-10] - The Crucible Performance & UX Update

### Added
- **Sanskrit Quote Loading Screen** - 3-second motivational transition when starting practice/exam
  - Quote: "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः" (Tasks accomplished through effort, not wishes)
  - ॐ symbol, decorative dividers, bouncing dot loader
  - Location: `components/question-bank/QuestionBankGame.tsx`

- **ISR Caching** - Enabled Incremental Static Regeneration for Crucible page
  - Revalidation: 1 hour (3600 seconds)
  - Improved load time from 3-4s to <1s for cached responses
  - Location: `app/the-crucible/page.tsx`

- **Home Navigation** - Added "← Canvas Home" link in Crucible header
  - Allows users to return to main site
  - Location: `components/question-bank/FocusDashboard.tsx`

- **Loading Screen** - Added `loading.tsx` for immediate visual feedback
  - Animated CRUCIBLE logo
  - Gradient loading bar
  - Location: `app/the-crucible/loading.tsx`

### Changed
- **Logo Design** - Enhanced CRUCIBLE logo with hot metal gradient
  - Colors: Orange (#f97316) → Amber (#fb923c) → Cream (#fef3c7) → White
  - Added orange glow shadow effect

- **Animated U** - Redesigned the "U" in CRUCIBLE as a crucible vessel
  - Lightning blue inner glow (cyan/sky gradient)
  - Rising animation simulating molten metal
  - Sparkle particles (cyan/white) floating upward
  - CSS animations in `globals.css`

- **Guide Section** - Redesigned from hidden tooltip to inline info card
  - Permanent visibility: "Select chapters → Configure session → Begin"
  - Indigo/purple gradient background

- **Session Config** - Compacted panel layout
  - Reduced header height (h-28 → h-16)
  - Reduced section spacing (space-y-8 → space-y-5)
  - Renamed "System Config" → "Session Config"

- **Begin Session Button** - Updated styling
  - Changed text from "Initialize System" → "Begin Session"
  - Orange gradient background (from-orange-500 to-amber-500)
  - Better disabled state feedback

### Technical
- Changed from `force-dynamic` to `force-static` with ISR
- Added `crucibleGlow` and `sparkle` keyframe animations to globals.css

---

## [2026-02-09] - Admin Panel Reorganization

### Changed
- **Top Bar Layout** - Reorganized admin panel header
  - Moved question selector and navigation after action buttons
  - Compact filter dropdowns (Chapters: w-32, Shift: w-36)
  - Enhanced navigation buttons with indigo styling

---

## [2026-02-07] - Taxonomy Management

### Added
- Chapter deletion functionality
- Question unlinking on chapter delete
- Child tag cleanup

---

## [2026-02-05] - Crucible Header Refinements

### Changed
- Split exam source titles into main heading + sub-heading
- Consistent styling for JEE Main PYQ titles

### Added
- Source filter with "Non-PYQs" option
- Dynamic source/reference field labeling

---

## [2026-02-02] - MongoDB Integration

### Added
- **MongoDB Atlas** as primary data store
  - Questions collection
  - Taxonomy collection (chapters/tags)
  - Activity logs collection

### Changed
- Migrated from Supabase-only to hybrid architecture
- Supabase now handles auth + user XP only

---

## [2026-01-28] - Lectures Page Update

### Fixed
- Button layout syntax error in LecturesClient.tsx
- Restored 60:40 button layout

---

## [2026-01-26] - Periodic Trends Enhancement

### Added
- Group 15 atomic/physical properties observations
- Inert pair effect explanation for Bismuth

---

## [2026-01-19] - Salt Analysis Mobile Optimization

### Changed
- Borax bead test UI refinements
- Collapsible anion/cation analysis tabs
- Floating navigation button repositioning
- Auto-hiding navigation bar

---

## [2026-01-14] - Mode Selection Redesign

### Changed
- Enhanced mode selection cards (Learning/Practice/Exam)
- Improved visual prominence and aesthetics

---

## [2026-01-13] - Video Card Simplification

### Removed
- "Quick Watch" buttons from video cards
- "Share" buttons from video cards

### Changed
- Cleaner, more focused video card design

---

## [2026-01-12] - Circuit Breaker Redesign

### Added
- Flashcard-style UI for assertion-reason
- Spaced repetition integration
- Chapter selection grid with statistics
- `useAssertionProgress` hook

### Changed
- Dynamic practice instead of fixed question limit
- SR feedback buttons (Again/Hard/Good/Easy)

---

## [2026-01-10] - Spaced Repetition System

### Added
- SM-2 spaced repetition algorithm
- LocalStorage progress persistence
- 4-button rating system
- Mastery statistics display

### Technical
- `useCrucibleProgress` hook with SR support
- `recordAttemptWithSR` function

---

## [2025-12] - Initial Platform Launch

### Added
- Core Next.js 16 app structure
- Interactive periodic table
- Flashcard system (basic)
- One-shot lectures integration
- NCERT solutions
- Basic question bank

---

## Legend

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features to be removed
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements
- **Technical** - Internal changes

---

*Keep this file updated with each significant change to the project.*
