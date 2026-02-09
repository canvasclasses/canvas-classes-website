# Canvas Classes - Project Architecture & Design System

> **Last Updated:** February 2026
> **Purpose:** This document provides a comprehensive overview of the Canvas Classes website architecture, design decisions, and feature implementations. It serves as a reference for developers and AI assistants to understand the project's evolution.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Design System](#design-system)
5. [Feature Directory](#feature-directory)
6. [Data Models](#data-models)
7. [Key Components](#key-components)
8. [Performance Optimizations](#performance-optimizations)
9. [Changelog](#changelog)

---

## 🎯 Project Overview

**Canvas Classes** is an educational platform for JEE/NEET Chemistry preparation, created by Paaras Sir. The platform focuses on:

- **Adaptive Learning**: The Crucible question bank with spaced repetition
- **Interactive Tools**: Periodic table, salt analysis simulator, Ksp calculator
- **Video Content**: One-shot lectures, 2-minute chemistry, detailed lectures
- **Study Materials**: Flashcards, NCERT solutions, handwritten notes

### Target Audience
- JEE Main & Advanced aspirants
- NEET chemistry students
- CBSE Class 11 & 12 students

---

## 🛠 Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | App Router, SSR/ISR, API Routes |
| **React** | 19.2.3 | UI Components |
| **TypeScript** | 5.x | Type Safety |
| **Tailwind CSS** | 4.x | Styling (with @theme) |

### Database & Auth
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | Primary data store (questions, taxonomy, activity logs) |
| **Mongoose** | ODM for MongoDB |
| **Supabase** | Authentication & user data (XP, profiles) |

### Key Libraries
| Library | Purpose |
|---------|---------|
| `framer-motion` | Animations & transitions |
| `lucide-react` | Icon system |
| `react-markdown` + `remark-math` + `rehype-katex` | Markdown & LaTeX rendering |
| `canvas-confetti` | Celebration effects |
| `jspdf` + `html2canvas` | PDF generation |

---

## 🏗 Architecture Patterns

### 1. App Router Structure
```
app/
├── page.tsx                    # Homepage
├── layout.tsx                  # Root layout with fonts, analytics
├── globals.css                 # Tailwind + custom animations
├── the-crucible/               # Question bank feature
│   ├── page.tsx                # ISR-cached page
│   ├── actions.ts              # Server actions (MongoDB)
│   ├── types.ts                # TypeScript interfaces
│   └── admin/                  # Admin panel
├── [feature]/                  # Feature pages
│   ├── page.tsx                # Main page
│   ├── [slug]/page.tsx         # Dynamic routes
│   └── lib/                    # Feature-specific utilities
└── api/                        # API routes
    ├── questions/              # CRUD operations
    ├── taxonomy/               # Chapter/tag management
    └── activity/               # Analytics logging
```

### 2. Data Flow Architecture
```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Client        │    │  Server      │    │   Database      │
│   Components    │───▶│  Actions     │───▶│   MongoDB       │
│   (React)       │    │  (Next.js)   │    │   Atlas         │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                                          │
         │              ┌──────────────┐            │
         └─────────────▶│  Supabase    │◀───────────┘
                        │  (Auth/XP)   │
                        └──────────────┘
```

### 3. Caching Strategy
| Page Type | Strategy | Revalidation |
|-----------|----------|--------------|
| The Crucible | ISR | 1 hour (3600s) |
| Flashcards | Static | Build time |
| Interactive tools | Client-side | N/A |
| API routes | Dynamic | Per-request |

---

## 🎨 Design System

### Color Palette

#### Primary Colors
```css
/* Brand Colors */
--orange-500: #f97316;     /* Primary accent */
--amber-400: #fbbf24;      /* Warm highlights */
--indigo-500: #6366f1;     /* Secondary accent */
--purple-600: #9333ea;     /* Tertiary accent */

/* Background (Dark Theme) */
--bg-primary: #050505;     /* Deepest black */
--bg-secondary: #0B0F15;   /* Card backgrounds */
--bg-tertiary: #0F1116;    /* Elevated surfaces */
--bg-surface: #151E32;     /* Interactive surfaces */
```

#### Semantic Colors
```css
/* Status Colors */
--success: #10b981;        /* Emerald - correct answers */
--error: #ef4444;          /* Red - incorrect answers */
--warning: #f59e0b;        /* Amber - warnings */
--info: #3b82f6;           /* Blue - information */
```

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo (CRUCIBLE) | System + Gradient | 3rem | 900 (Black) |
| Page Headers | Geist Sans | 2xl-4xl | 700-900 |
| Body Text | Geist Sans | sm-base | 400-500 |
| Code/Math | Geist Mono | sm | 400 |
| Handwritten Notes | Kalam | base | 400 |

### Animation System

#### Custom Keyframes (globals.css)
```css
/* Floating animations for decorative elements */
@keyframes float-slow    /* 12s, gentle float with rotation */
@keyframes float-medium  /* 8s, moderate movement */
@keyframes float-fast    /* 5s, quick responsive movement */

/* Crucible-specific */
@keyframes crucibleGlow  /* 2s, rising light effect in U */
@keyframes sparkle       /* 1.5s, particle sparkle effect */
```

### Component Patterns

#### Card Style
```tsx
className="bg-[#151E32] border border-white/5 rounded-xl p-6 shadow-lg"
```

#### Button Styles
```tsx
// Primary (Orange gradient)
className="bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold"

// Secondary (Ghost)
className="bg-white/5 border border-white/10 hover:bg-white/10"

// Accent (Indigo)
className="bg-indigo-600 hover:bg-indigo-500 text-white"
```

---

## 📁 Feature Directory

### Core Features

| Feature | Path | Description |
|---------|------|-------------|
| **The Crucible** | `/the-crucible` | Adaptive question bank with spaced repetition, practice/exam modes |
| **Flashcards** | `/chemistry-flashcards` | Spaced repetition flashcards by chapter |
| **Periodic Table** | `/interactive-periodic-table` | Interactive element explorer |
| **Salt Analysis** | `/salt-analysis` | Qualitative analysis simulator |

### Content Features

| Feature | Path | Description |
|---------|------|-------------|
| One-Shot Lectures | `/one-shot-lectures` | Complete chapter videos |
| 2-Minute Chemistry | `/2-minute-chemistry` | Quick concept videos |
| Detailed Lectures | `/detailed-lectures` | In-depth topic coverage |
| NCERT Solutions | `/ncert-solutions` | Textbook solutions |

### Tools

| Feature | Path | Description |
|---------|------|-------------|
| Ksp Calculator | `/solubility-product-ksp-calculator` | Solubility calculations |
| Periodic Trends | `/periodic-trends` | Trend visualizations |
| Name Reactions | `/organic-name-reactions` | Organic chemistry reactions |

---

## 📊 Data Models

### Question Model (MongoDB)
```typescript
interface Question {
  _id: string;
  text_markdown: string;
  type: 'SCQ' | 'MCQ' | 'Integer' | 'Assertion';
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  integer_answer?: string;
  tags: Array<{ tag_id: string; weight: number }>;
  meta: {
    difficulty: 'Easy' | 'Medium' | 'Hard';
    exam?: string;
    year?: number;
    avg_time_sec?: number;
  };
  chapter_id: string;
  is_pyq: boolean;
  is_top_pyq: boolean;
  solution: {
    text_latex?: string;
    video_url?: string;
    audio_url?: string;
    image_url?: string;
  };
  source_references: Array<{
    type: 'PYQ' | 'NCERT' | 'Book';
    pyqExam?: string;
    pyqYear?: number;
    pyqShift?: string;
  }>;
}
```

### Taxonomy Model
```typescript
interface Chapter {
  _id: string;
  slug: string;
  name: string;
  class: '11' | '12';
  order: number;
}

interface Tag {
  _id: string;
  slug: string;
  name: string;
  chapter_id: string;
}
```

### User Progress (LocalStorage)
```typescript
interface CrucibleProgress {
  starredIds: string[];
  masteredIds: string[];
  userNotes: Record<string, string>;
  srData: Record<string, {
    ease: number;
    interval: number;
    nextReview: string;
  }>;
}
```

---

## 🧩 Key Components

### FocusDashboard (`components/question-bank/FocusDashboard.tsx`)
- **Purpose**: Main configuration UI for The Crucible
- **Features**:
  - Chapter/PYQ selection grid
  - Session config (difficulty, quantity, mode)
  - Hot metal gradient logo with animated U
  - 3-second Shloka transition screen

### QuestionBankGame (`components/question-bank/QuestionBankGame.tsx`)
- **Purpose**: Core game engine for practice/exam modes
- **Features**:
  - Spaced repetition integration
  - Session persistence (localStorage)
  - Activity logging (4-bucket architecture)
  - Practice mode with SR rating buttons
  - Exam mode with final review

### QuestionCard (`components/question-bank/QuestionCard.tsx`)
- **Purpose**: Renders individual questions
- **Features**:
  - Markdown + LaTeX rendering
  - Option selection with feedback
  - Image/diagram support

### SolutionViewer (`components/question-bank/SolutionViewer.tsx`)
- **Purpose**: Displays question solutions
- **Features**:
  - LaTeX solution text
  - Video embed
  - Audio explanation
  - Handwritten solution images

---

## ⚡ Performance Optimizations

### 1. ISR (Incremental Static Regeneration)
```typescript
// app/the-crucible/page.tsx
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour cache
```

### 2. Loading States
- `loading.tsx` for route transitions
- Shloka screen for practice/exam start (3s)
- Skeleton components for data loading

### 3. Image Optimization
- Next.js Image component for all images
- WebP format preference
- Lazy loading below fold

### 4. Bundle Optimization
- Dynamic imports for heavy components
- Tree-shaking with ES modules
- CSS minification via Tailwind

---

## 📜 Changelog

### February 2026

#### The Crucible Refinements (Feb 9-10)
- **Logo**: Added hot metal gradient (orange→amber→cream→white)
- **Animated U**: Lightning blue glow with sparkle particles
- **Session Config**: Compacted layout, reduced spacing
- **Guide**: Redesigned as inline info card
- **Loading Screen**: 3-second Sanskrit quote transition
- **Caching**: Enabled ISR with 1-hour revalidation
- **Navigation**: Added "← Canvas Home" link

#### Admin Panel Updates (Feb 9)
- Reorganized top bar layout
- Added question navigation buttons
- Compact filter dropdowns

### January 2026

#### Spaced Repetition System
- Implemented SM-2 algorithm for flashcards
- Added rating buttons (Again/Hard/Good/Easy)
- LocalStorage progress persistence

#### Salt Analysis Simulator
- Dry tests visualization
- Borax bead test simulation
- Mobile optimization

### December 2025

#### Interactive Periodic Table
- Element detail modals
- Property filters
- Trend visualizations

#### Initial Platform Launch
- Core course structure
- Video integration
- NCERT solutions

---

## 🔗 Related Files

- **MongoDB Connection**: `lib/mongodb.ts`
- **Models**: `lib/models.ts`
- **Supabase Client**: `lib/supabase.ts`
- **Progress Hook**: `hooks/useCrucibleProgress.ts`
- **Activity Logger**: `hooks/useActivityLogger.ts`

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind for styling (no inline styles for layout)
- Group related CSS with comments

### Naming Conventions
- **Components**: PascalCase (`QuestionCard.tsx`)
- **Utilities**: camelCase (`formatTime.ts`)
- **API Routes**: kebab-case (`/api/questions`)
- **CSS Classes**: Tailwind utilities + custom classes in globals.css

### Git Workflow
- Feature branches from `main`
- Descriptive commit messages
- PR reviews before merge

---

*This document is maintained as a living reference. Update it when making significant architectural changes.*
