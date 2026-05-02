# BITSAT 30-Day Plan Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `/bitsat-chemistry-revision` into a trimmed marketing landing + a Udemy/Coursera-style course shell at `/bitsat-chemistry-revision/plan`. UI/UX only — progress persistence stays localStorage, data stays static.

**Architecture:** Current 1405-line single-page client component → decomposed into `plan/` subfolder (shell, rails, day content, primitives) driven by a single static `planData.ts`. Routes: landing (trimmed), `/plan` (redirects to day 1), `/plan/day/[n]` (deep-link). Flat `#3b82f6` accent, Canvas tokens only, no gradients.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, lucide-react icons, CSS animations (prefer over framer-motion per existing `globals.css` INP comment).

---

## Conventions for this plan

- **Testing:** The project has no automated test suite (CLAUDE.md §5). Per-task verification = `npm run build` clean + manual browser walkthrough at the route affected. Do not invent a test runner.
- **Commits:** The user commits themselves. Each task ends with a **"Stop for user review"** checkpoint. Do NOT run `git commit` — stage changes with `git add` only, list staged files, and hand off to the user.
- **Icons:** Use `lucide-react` (already a dep). No inline SVG unless no lucide equivalent exists.
- **Animations:** Prefer CSS over `framer-motion` (existing globals.css comment: "replacing Framer Motion for INP").
- **Paths below use forward slashes.** On Windows bash this still resolves correctly.

---

## File Structure

### New files

```
app/bitsat-chemistry-revision/
├── plan/
│   ├── page.tsx                     # redirect to /day/1
│   ├── day/
│   │   └── [n]/
│   │       └── page.tsx             # deep-link day view (server component → renders PlanShell)
│   ├── PlanShell.tsx                # orchestrator: nav, layout, rail collapse state, drawer state, active day
│   ├── CurriculumRail.tsx           # left rail: phases + day rows + overall progress card
│   ├── ChecklistRail.tsx            # right rail: "Lock this in" todos, session-only state
│   ├── DayContent.tsx               # main column: breadcrumb, pill, title, tip, resource sections
│   ├── ResourceCard.tsx             # single resource row (replaces chip)
│   ├── ResourceDrawer.tsx           # iframe drawer (lifted verbatim from current client)
│   ├── TipCallout.tsx               # blue-tinted "Lock this in" inline callout
│   ├── FooterActions.tsx            # prev / mark complete / next sticky bar
│   └── planData.ts                  # PHASES, RESOURCE_META, KIND_GROUPS + new `checklist` per day
├── planTypes.ts                     # shared types (Day, Phase, Resource, ResourceKind)
├── BitsatLandingClient.tsx          # RENAMED from BitsatRevisionClient.tsx, trimmed
└── page.tsx                         # MODIFIED — imports renamed client, metadata tweaks
```

### Modified files

- `app/sitemap.ts` — add `/bitsat-chemistry-revision/plan` entry

### Deleted files

- `app/bitsat-chemistry-revision/BitsatRevisionClient.tsx` (renamed in Task 13)

---

## Task 1: Extract shared types to `planTypes.ts`

**Files:**
- Create: `app/bitsat-chemistry-revision/planTypes.ts`

- [ ] **Step 1: Create the types file**

```typescript
// app/bitsat-chemistry-revision/planTypes.ts

export type ResourceKind =
    | 'flashcards'
    | 'periodic'
    | 'trends'
    | 'oneshot'
    | 'crash-course'
    | 'twomin'
    | 'notes'
    | 'top50'
    | 'organic'
    | 'inorganic'
    | 'physical'
    | 'name-rxns'
    | 'wizard'
    | 'salt'
    | 'comingsoon';

export type Resource = {
    label: string;
    href: string;
    kind: ResourceKind;
    embedUrl?: string;
};

export type Day = {
    day: number;
    title: string;
    focus: string;
    tip?: string;
    checklist?: string[];   // NEW — 2-3 short imperatives, session-only check state
    resources: Resource[];
};

export type Phase = {
    id: string;
    label: string;
    days: string;        // "Days 1–7"
    goal: string;
    accent: string;      // legacy — still referenced by the landing's removed phase preview; keep for now
    gradient: string;    // ditto
    icon: string;        // lucide-react icon NAME (we'll resolve in the consumer); was ComponentType in old code
    items: Day[];
};

// Resource kind → UX grouping. Determines which section a resource appears in on the day view.
export type ResourceGroup = 'Videos' | 'Notes' | 'Flashcards' | 'Tools' | 'Coming Soon';

export const KIND_GROUP: Record<ResourceKind, ResourceGroup> = {
    'oneshot':       'Videos',
    'crash-course':  'Videos',
    'notes':         'Notes',
    'flashcards':    'Flashcards',
    'periodic':      'Tools',
    'trends':        'Tools',
    'physical':      'Tools',
    'organic':       'Tools',
    'inorganic':     'Tools',
    'name-rxns':     'Tools',
    'wizard':        'Tools',
    'salt':          'Tools',
    'top50':         'Tools',
    'twomin':        'Tools',
    'comingsoon':    'Coming Soon',
};

export const GROUP_ORDER: ResourceGroup[] = ['Videos', 'Notes', 'Flashcards', 'Tools', 'Coming Soon'];
```

**Note on `Phase.icon` change:** The current code types this as `React.ComponentType<...>`, which prevents it being in a pure-data file. We store the icon NAME as a string here; consumers map the string to a `lucide-react` component in their own module. That's the only semantic change.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean build, no new type errors (file is unused yet).

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/planTypes.ts`

- [ ] **Step 4: Stop for user review.**

---

## Task 2: Extract static plan data to `planData.ts` + populate `checklist`

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/planData.ts`
- Reference: current `app/bitsat-chemistry-revision/BitsatRevisionClient.tsx:226-625` (the PHASES, RESOURCE_META, helpers)

- [ ] **Step 1: Create the file with extracted constants**

Copy the `yt()`, `pdf()`, `TOTAL_DAYS`, `PHASES`, `RESOURCE_META` constants from `BitsatRevisionClient.tsx`. Adjust:

1. Replace `React.ComponentType<{ className?: string; size?: number }>` references in `RESOURCE_META` icon field by keeping the lucide component references — BUT move the map into a separate **typed-as-string** helper if you want pure data. Since `RESOURCE_META` is already consumed client-side, keep the `ComponentType` references and mark the file with `'use client'` if needed. **Simpler: keep `RESOURCE_META` as a client-facing module that imports lucide icons directly.** That is fine — `planData.ts` doesn't need to be pure data.
2. Convert each `Phase.icon` from a component reference (e.g. `Layers`) to a string name (e.g. `'Layers'`). Add a local helper map that resolves string → component.
3. **Add `checklist?: string[]` to every day.** Use the pattern: 2–3 short imperatives derived from the existing `focus` text. Examples for the first four days:

```typescript
// Day 1 (Solid State — Lattices)
checklist: [
    'Memorise z = 1, 2, 4 for SC, BCC, FCC.',
    'Packing efficiency formulas for the three cubic types.',
    'FCC vs BCC density derivation.',
],

// Day 2 (Defects & Magnetic)
checklist: [
    'Schottky vs Frenkel — when each applies.',
    'F-centre definition and colour explanation.',
    'Ferro / ferri / anti-ferro magnetism distinctions.',
],

// Day 3 (Polymers + Everyday Life)
checklist: [
    'Addition vs condensation polymerisation.',
    'Monomers of Nylon-6, Nylon-6,6, Bakelite.',
    'PDI numerical walkthrough.',
],

// Day 4 (Environmental + Periodicity)
checklist: [
    'Greenhouse gases ranked by GWP.',
    'BOD vs COD distinction.',
    'Atomic radius / IE / EA / EN trends across period + group.',
],

// Day 5 (Chemical Bonding)
checklist: [
    'MOT for O₂ and F₂ — memorise bond order.',
    'VSEPR geometries through expanded octet.',
    'Formal charge & resonance practice set.',
],

// Day 6 (s-Block)
checklist: [
    'Diagonal relationship — Li/Mg, Be/Al anomalies.',
    'Lattice vs hydration enthalpy — solubility logic.',
    'Flame test colours for alkali metals.',
],

// Day 7 (Metallurgy)
checklist: [
    'Common ores per metal (Fe, Cu, Al, Zn, Hg).',
    'Froth flotation depressants.',
    'Ellingham diagram — when does the line cross?',
],
```

Populate the rest similarly using the existing `focus` and `tip` text as source material. Keep items ≤ 12 words each and imperative (verb-first) where natural. If a day's focus is particularly sparse, 2 items is fine.

4. Export `PHASES`, `RESOURCE_META`, `yt`, `pdf`, `TOTAL_DAYS`.
5. Add `'use client'` at the top — lucide icon imports require it.

- [ ] **Step 2: Add flat-day helper exports at the bottom of the file**

```typescript
// Flat array of all 30 days — useful for prev/next navigation and /day/[n] lookup
export const ALL_DAYS: Day[] = PHASES.flatMap((p) => p.items);

// Day → Phase lookup
export function phaseForDay(dayNum: number): Phase | undefined {
    return PHASES.find((p) => p.items.some((d) => d.day === dayNum));
}

export function dayByNumber(dayNum: number): Day | undefined {
    return ALL_DAYS.find((d) => d.day === dayNum);
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: clean build. No new warnings.

- [ ] **Step 4: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/planData.ts`

- [ ] **Step 5: Stop for user review.** Have the user spot-check the checklist content across 3-4 days before continuing.

---

## Task 3: Lift `ResourceDrawer` to its own file

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/ResourceDrawer.tsx`
- Reference: current `BitsatRevisionClient.tsx:761-817`

- [ ] **Step 1: Create the file**

Copy the `ResourceDrawer` component and its `DrawerState` type verbatim from `BitsatRevisionClient.tsx:761-817`. Add `'use client'` directive. Export both.

```typescript
// app/bitsat-chemistry-revision/plan/ResourceDrawer.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type DrawerState = { url: string; title: string } | null;

export function ResourceDrawer({ drawer, onClose }: { drawer: DrawerState; onClose: () => void }) {
    // ... exact copy of lines 763-816 ...
}
```

Keep `framer-motion` in this file only — the drawer's slide-in is visually important and the mass is small.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/ResourceDrawer.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 4: Create `TipCallout.tsx`

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/TipCallout.tsx`

- [ ] **Step 1: Create the component**

```typescript
// app/bitsat-chemistry-revision/plan/TipCallout.tsx
import { Lightbulb } from 'lucide-react';

export function TipCallout({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-500/[0.06] border border-blue-500/15 mb-10">
            <Lightbulb size={14} className="text-blue-300 shrink-0 mt-0.5" />
            <p className="text-[13.5px] leading-relaxed text-blue-100/90 m-0">
                <span className="text-blue-50 font-medium">Lock this in. </span>
                {text}
            </p>
        </div>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/TipCallout.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 5: Create `ResourceCard.tsx`

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/ResourceCard.tsx`

- [ ] **Step 1: Create the component**

```typescript
// app/bitsat-chemistry-revision/plan/ResourceCard.tsx
'use client';

import Link from 'next/link';
import { ChevronRight, Lock, Play, FileText, Layers, Lightbulb, ExternalLink } from 'lucide-react';
import { Resource, ResourceKind } from '../planTypes';

// glyph per kind — single blue-family colour, stays restrained
const GLYPH: Record<ResourceKind, { Icon: typeof Play; label: string }> = {
    'oneshot':      { Icon: Play,       label: 'Lecture' },
    'crash-course': { Icon: Play,       label: 'Crash-course lecture' },
    'twomin':       { Icon: Play,       label: '2-minute video' },
    'notes':        { Icon: FileText,   label: 'Handwritten notes' },
    'flashcards':   { Icon: Layers,     label: 'Flashcard deck' },
    'periodic':     { Icon: Lightbulb,  label: 'Interactive tool' },
    'trends':       { Icon: Lightbulb,  label: 'Interactive tool' },
    'physical':     { Icon: Lightbulb,  label: 'Interactive tool' },
    'organic':      { Icon: Lightbulb,  label: 'Interactive tool' },
    'inorganic':    { Icon: Lightbulb,  label: 'Interactive tool' },
    'name-rxns':    { Icon: Lightbulb,  label: 'Reference tool' },
    'wizard':       { Icon: Lightbulb,  label: 'Interactive tool' },
    'salt':         { Icon: Lightbulb,  label: 'Simulator' },
    'top50':        { Icon: FileText,   label: 'Reference' },
    'comingsoon':   { Icon: Lock,       label: 'Coming soon' },
};

type Props = {
    resource: Resource;
    onOpenDrawer: (url: string, title: string) => void;
};

export function ResourceCard({ resource, onOpenDrawer }: Props) {
    const g = GLYPH[resource.kind];
    const Icon = g.Icon;

    // Coming soon — disabled card, no click
    if (resource.kind === 'comingsoon') {
        return (
            <div className="grid grid-cols-[40px_1fr_auto] gap-3.5 items-center p-3 px-4 rounded-xl bg-[#0B0F15] border border-white/[0.05] opacity-60 cursor-not-allowed">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] grid place-items-center text-zinc-600">
                    <Lock size={16} />
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-medium text-zinc-500 m-0 mb-0.5">{resource.label}</h4>
                    <p className="text-xs text-zinc-600 m-0">Coming soon</p>
                </div>
                <span className="text-xs text-zinc-600 font-mono">Soon</span>
            </div>
        );
    }

    const commonClasses =
        'grid grid-cols-[40px_1fr_auto] gap-3.5 items-center p-3 px-4 rounded-xl bg-[#0B0F15] border border-white/[0.06] hover:border-blue-500/25 hover:bg-[#0E131B] transition-colors no-underline text-inherit cursor-pointer group';

    const content = (
        <>
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] grid place-items-center text-blue-300">
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <h4 className="text-sm font-medium text-white m-0 mb-0.5 leading-tight">
                    {resource.label}
                </h4>
                <p className="text-xs text-zinc-500 m-0">{g.label}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-mono">Open</span>
                <ChevronRight
                    size={14}
                    className="text-zinc-600 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all"
                />
            </div>
        </>
    );

    // Has embed → open drawer in place
    if (resource.embedUrl) {
        return (
            <button
                type="button"
                onClick={() => onOpenDrawer(resource.embedUrl!, resource.label)}
                className={commonClasses + ' text-left w-full'}
            >
                {content}
            </button>
        );
    }

    // External URL or internal route — Link
    const isExternal = resource.href.startsWith('http');
    return isExternal ? (
        <a href={resource.href} target="_blank" rel="noreferrer" className={commonClasses}>
            {content}
        </a>
    ) : (
        <Link href={resource.href} className={commonClasses}>
            {content}
        </Link>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/ResourceCard.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 6: Create `FooterActions.tsx`

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/FooterActions.tsx`

- [ ] **Step 1: Create the component**

```typescript
// app/bitsat-chemistry-revision/plan/FooterActions.tsx
'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ALL_DAYS } from './planData';

type Props = {
    currentDay: number;
    isDone: boolean;
    onToggleDone: () => void;
    leftCollapsed: boolean;
    rightCollapsed: boolean;
};

export function FooterActions({ currentDay, isDone, onToggleDone, leftCollapsed, rightCollapsed }: Props) {
    const prev = ALL_DAYS.find((d) => d.day === currentDay - 1);
    const next = ALL_DAYS.find((d) => d.day === currentDay + 1);

    // inline style for dynamic widths — matches body class scheme
    const leftOffset = leftCollapsed ? '56px' : '272px';
    const rightOffset = rightCollapsed ? '0px' : '256px';

    return (
        <footer
            className="fixed bottom-0 flex items-center justify-between gap-4 px-12 py-3 bg-[#050505]/95 backdrop-blur-md border-t border-white/[0.06] z-30 transition-[left,right] duration-[240ms]"
            style={{ left: leftOffset, right: rightOffset }}
        >
            {prev ? (
                <Link
                    href={`/bitsat-chemistry-revision/plan/day/${prev.day}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/[0.04] hover:text-white text-sm transition-colors no-underline min-w-0"
                >
                    <ChevronLeft size={14} />
                    <span className="font-mono text-[11px] text-zinc-500">Day {String(prev.day).padStart(2, '0')}</span>
                    <span className="truncate max-w-[160px]">{prev.title}</span>
                </Link>
            ) : (
                <span />
            )}

            <button
                type="button"
                onClick={onToggleDone}
                className={
                    isDone
                        ? 'flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[13px] transition-colors hover:bg-emerald-500/25'
                        : 'flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-500 text-white font-semibold text-[13px] transition-colors hover:bg-blue-600'
                }
            >
                <Check size={14} strokeWidth={2.5} />
                {isDone ? `Day ${String(currentDay).padStart(2, '0')} Complete` : `Mark Day ${String(currentDay).padStart(2, '0')} Complete`}
            </button>

            {next ? (
                <Link
                    href={`/bitsat-chemistry-revision/plan/day/${next.day}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/[0.04] hover:text-white text-sm transition-colors no-underline min-w-0 justify-end"
                >
                    <span className="truncate max-w-[160px]">{next.title}</span>
                    <span className="font-mono text-[11px] text-zinc-500">Day {String(next.day).padStart(2, '0')}</span>
                    <ChevronRight size={14} />
                </Link>
            ) : (
                <span />
            )}
        </footer>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/FooterActions.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 7: Create `CurriculumRail.tsx`

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/CurriculumRail.tsx`

- [ ] **Step 1: Create the component**

```typescript
// app/bitsat-chemistry-revision/plan/CurriculumRail.tsx
'use client';

import Link from 'next/link';
import { Check, ChevronLeft, ChevronDown } from 'lucide-react';
import { PHASES, TOTAL_DAYS } from './planData';

type Props = {
    currentDay: number;
    completed: Set<number>;
    collapsed: boolean;
    onToggleCollapse: () => void;
};

export function CurriculumRail({ currentDay, completed, collapsed, onToggleCollapse }: Props) {
    const totalDone = completed.size;
    const overallPct = Math.round((totalDone / TOTAL_DAYS) * 100);

    return (
        <aside className="bg-[#050505] border-r border-white/[0.05] overflow-hidden relative overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-5 pb-2.5">
                {!collapsed && (
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        Curriculum
                    </span>
                )}
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="w-6 h-6 grid place-items-center text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded transition-colors"
                    aria-label={collapsed ? 'Expand curriculum' : 'Collapse curriculum'}
                    style={{ marginLeft: collapsed ? 'auto' : undefined, marginRight: collapsed ? 'auto' : undefined }}
                >
                    <ChevronLeft size={14} className={collapsed ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
            </div>

            {!collapsed && (
                <div className="mx-4 mb-4 p-3 rounded-xl bg-[#0B0F15] border border-white/[0.06]">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="font-[var(--font-outfit)] font-semibold text-[15px] text-white tracking-tight">
                            {totalDone} / {TOTAL_DAYS} days
                        </span>
                        <span className="text-[11px] text-zinc-500 tabular-nums">{overallPct}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-[width] duration-500"
                            style={{ width: `${overallPct}%` }}
                        />
                    </div>
                </div>
            )}

            {PHASES.map((phase) => {
                const phaseDays = phase.items.map((d) => d.day);
                const phaseDone = phaseDays.filter((d) => completed.has(d)).length;
                return (
                    <div key={phase.id} className="px-3 mb-3.5">
                        {!collapsed ? (
                            <div className="flex items-center justify-between px-2.5 py-2 mb-1 cursor-default rounded hover:bg-white/[0.02]">
                                <span className="flex items-center gap-2 min-w-0">
                                    <ChevronDown size={12} className="text-zinc-600 shrink-0" />
                                    <span className="text-[13px] font-medium text-zinc-200 tracking-tight truncate">
                                        {phase.label.replace(/^Phase \d+ · /, 'Phase ' + phase.id.replace('phase', '') + ' · ')}
                                    </span>
                                </span>
                                <span className="text-[11px] text-zinc-500 tabular-nums shrink-0">
                                    {phaseDone}/{phaseDays.length}
                                </span>
                            </div>
                        ) : null}

                        {phase.items.map((d) => {
                            const isDone = completed.has(d.day);
                            const isActive = d.day === currentDay;
                            return (
                                <Link
                                    key={d.day}
                                    href={`/bitsat-chemistry-revision/plan/day/${d.day}`}
                                    className={[
                                        'grid items-center gap-2.5 py-2 px-2.5 rounded no-underline transition-colors',
                                        collapsed ? 'grid-cols-1 justify-items-center py-2' : 'grid-cols-[18px_42px_1fr]',
                                        isActive
                                            ? 'bg-blue-500/[0.08] text-white'
                                            : isDone
                                            ? 'text-zinc-400 hover:bg-white/[0.03]'
                                            : 'text-zinc-400 hover:bg-white/[0.03] hover:text-white',
                                    ].join(' ')}
                                >
                                    <span
                                        className={[
                                            'w-4 h-4 rounded-full border grid place-items-center transition-all',
                                            isDone
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : isActive
                                                ? 'border-blue-500'
                                                : 'border-white/15',
                                        ].join(' ')}
                                    >
                                        {isDone && <Check size={10} strokeWidth={3} className="text-black" />}
                                    </span>
                                    {!collapsed && (
                                        <>
                                            <span
                                                className={[
                                                    'font-mono text-[11px] tabular-nums',
                                                    isDone ? 'text-emerald-400' : isActive ? 'text-blue-300 font-medium' : 'text-zinc-500',
                                                ].join(' ')}
                                            >
                                                Day {String(d.day).padStart(2, '0')}
                                            </span>
                                            <span
                                                className={[
                                                    'text-[13px] leading-tight truncate',
                                                    isActive ? 'text-white font-medium' : isDone ? 'text-zinc-500' : '',
                                                ].join(' ')}
                                            >
                                                {d.title.split('—')[0].trim()}
                                            </span>
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                );
            })}
        </aside>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/CurriculumRail.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 8: Create `ChecklistRail.tsx`

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/ChecklistRail.tsx`

- [ ] **Step 1: Create the component**

```typescript
// app/bitsat-chemistry-revision/plan/ChecklistRail.tsx
'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';

type Props = {
    dayNumber: number;
    items?: string[];
    collapsed: boolean;
    onToggleCollapse: () => void;
};

export function ChecklistRail({ dayNumber, items, collapsed, onToggleCollapse }: Props) {
    // Session-only check state. Reset when day changes.
    const [checked, setChecked] = useState<Set<number>>(new Set());

    useEffect(() => {
        setChecked(new Set());
    }, [dayNumber]);

    const toggle = (i: number) => {
        setChecked((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    if (collapsed) return null;

    return (
        <aside className="bg-[#050505] border-l border-white/[0.05] overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-5 pb-2.5">
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="w-6 h-6 grid place-items-center text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded transition-colors"
                    aria-label="Hide checklist"
                >
                    <ChevronRight size={14} />
                </button>
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Checklist</span>
            </div>

            <div className="px-5 pb-10">
                {items && items.length > 0 ? (
                    <>
                        <h3 className="font-[var(--font-outfit)] text-[13px] font-semibold text-white m-0 mb-1 tracking-tight">
                            Lock this in
                        </h3>
                        <p className="text-xs text-zinc-500 m-0 mb-4">
                            {items.length === 1 ? 'One thing to nail' : `${items.length} things to nail`} before marking done.
                        </p>
                        {items.map((item, i) => {
                            const isDone = checked.has(i);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => toggle(i)}
                                    className="w-full grid grid-cols-[16px_1fr] gap-2.5 items-start py-2.5 border-b border-white/[0.04] last:border-b-0 text-left cursor-pointer"
                                >
                                    <span
                                        className={[
                                            'w-3.5 h-3.5 mt-0.5 border rounded-[3px] grid place-items-center transition-all',
                                            isDone ? 'bg-emerald-500 border-emerald-500' : 'border-white/15',
                                        ].join(' ')}
                                    >
                                        {isDone && <Check size={9} strokeWidth={3} className="text-black" />}
                                    </span>
                                    <span
                                        className={[
                                            'text-[13px] leading-relaxed',
                                            isDone ? 'text-zinc-500 line-through decoration-white/20' : 'text-zinc-300',
                                        ].join(' ')}
                                    >
                                        {item}
                                    </span>
                                </button>
                            );
                        })}
                    </>
                ) : (
                    <p className="text-[13px] text-zinc-500 italic m-0">No checklist for this day.</p>
                )}
            </div>
        </aside>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/ChecklistRail.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 9: Create `DayContent.tsx`

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/DayContent.tsx`

- [ ] **Step 1: Create the component**

```typescript
// app/bitsat-chemistry-revision/plan/DayContent.tsx
'use client';

import Link from 'next/link';
import { Day } from '../planTypes';
import { phaseForDay, KIND_GROUP, GROUP_ORDER } from './planData';
import { TipCallout } from './TipCallout';
import { ResourceCard } from './ResourceCard';

type Props = {
    day: Day;
    onOpenDrawer: (url: string, title: string) => void;
};

export function DayContent({ day, onOpenDrawer }: Props) {
    const phase = phaseForDay(day.day);

    // Group resources by section (Videos/Notes/Flashcards/Tools/Coming Soon)
    const grouped = GROUP_ORDER.map((group) => ({
        group,
        items: day.resources.filter((r) => KIND_GROUP[r.kind] === group),
    })).filter((g) => g.items.length > 0);

    return (
        <main className="max-w-[820px] mx-auto px-16 pt-12 pb-36">
            <nav className="text-xs text-zinc-500 mb-5 flex items-center gap-1.5">
                <Link href="/bitsat-chemistry-revision" className="text-zinc-500 hover:text-zinc-300 no-underline">
                    Overview
                </Link>
                <span className="text-zinc-700">›</span>
                <span className="text-zinc-500">{phase?.label.split('·')[0].trim() ?? 'Phase'}</span>
                <span className="text-zinc-700">›</span>
                <span className="text-zinc-300">Day {day.day}</span>
            </nav>

            <div className="inline-flex items-center gap-2 p-1 bg-white/[0.03] border border-white/[0.08] rounded-full mb-4 text-xs animate-fade-in">
                <span className="bg-blue-500 text-white font-mono font-semibold px-2.5 py-1 rounded-full tracking-wider text-[11px]">
                    DAY {String(day.day).padStart(2, '0')}
                </span>
                <span className="pr-2.5 text-zinc-300">{phase?.label ?? ''}</span>
            </div>

            <h1 className="font-[var(--font-outfit)] font-bold text-4xl md:text-5xl leading-[1.1] tracking-tight text-white m-0 mb-3.5 animate-fade-in-up">
                {day.title.split('—')[0].trim()}
            </h1>

            <p className="text-base leading-[1.6] text-zinc-400 max-w-[62ch] m-0 mb-9 animate-fade-in-up">
                {day.focus}
            </p>

            {day.tip && <TipCallout text={day.tip} />}

            {grouped.map(({ group, items }) => (
                <section key={group} className="mb-9">
                    <div className="flex items-baseline justify-between mb-3.5">
                        <h2 className="font-[var(--font-outfit)] font-semibold text-[15px] text-white m-0 tracking-tight">
                            {group}
                        </h2>
                        <span className="text-xs text-zinc-500 tabular-nums">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {items.map((r, i) => (
                            <ResourceCard key={`${r.href}-${i}`} resource={r} onOpenDrawer={onOpenDrawer} />
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/DayContent.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 10: Create `PlanShell.tsx` (the orchestrator)

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/PlanShell.tsx`

- [ ] **Step 1: Create the component**

```typescript
// app/bitsat-chemistry-revision/plan/PlanShell.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, User } from 'lucide-react';
import { dayByNumber, TOTAL_DAYS } from './planData';
import { CurriculumRail } from './CurriculumRail';
import { ChecklistRail } from './ChecklistRail';
import { DayContent } from './DayContent';
import { FooterActions } from './FooterActions';
import { ResourceDrawer, DrawerState } from './ResourceDrawer';

const STORAGE_KEY = 'bitsat-chem-plan-v1';   // SAME key as legacy — preserves user progress

type Props = {
    initialDay: number;
};

export function PlanShell({ initialDay }: Props) {
    const day = dayByNumber(initialDay);

    const [completed, setCompleted] = useState<Set<number>>(new Set());
    const [hydrated, setHydrated] = useState(false);
    const [drawer, setDrawer] = useState<DrawerState>(null);
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);

    // localStorage hydration
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) setCompleted(new Set(arr));
            }
        } catch {}
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
        } catch {}
    }, [completed, hydrated]);

    const toggleDay = () => {
        setCompleted((prev) => {
            const next = new Set(prev);
            if (next.has(initialDay)) next.delete(initialDay);
            else next.add(initialDay);
            return next;
        });
    };

    if (!day) {
        return (
            <div className="min-h-screen bg-[#050505] text-white grid place-items-center">
                <div className="text-center">
                    <p className="text-zinc-400 mb-4">Day {initialDay} doesn&apos;t exist.</p>
                    <Link
                        href="/bitsat-chemistry-revision/plan/day/1"
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        Start from Day 1
                    </Link>
                </div>
            </div>
        );
    }

    const totalDone = completed.size;
    const overallPct = Math.round((totalDone / TOTAL_DAYS) * 100);
    const isDone = completed.has(initialDay);

    const leftW = leftCollapsed ? '56px' : '272px';
    const rightW = rightCollapsed ? '0px' : '256px';

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <ResourceDrawer drawer={drawer} onClose={() => setDrawer(null)} />

            {/* Progress rail */}
            <div className="sticky top-0 z-50 h-0.5 bg-white/[0.05]">
                <div
                    className="h-full bg-blue-500 transition-[width] duration-500"
                    style={{ width: `${overallPct}%` }}
                />
            </div>

            {/* Top nav */}
            <nav className="sticky top-0.5 z-40 flex items-center justify-between px-6 py-3.5 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.06]">
                <div className="flex items-center gap-5">
                    <Link
                        href="/bitsat-chemistry-revision"
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-[13px] px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors no-underline"
                    >
                        <ChevronLeft size={14} />
                        Overview
                    </Link>
                    <span className="font-[var(--font-outfit)] font-semibold text-[15px] text-white tracking-tight">
                        BITSAT Chemistry <span className="font-normal text-zinc-500">· 30-Day Plan</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs">
                        <span className="text-white tabular-nums font-medium">
                            {totalDone} / {TOTAL_DAYS}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-blue-300 font-medium tabular-nums">{overallPct}%</span>
                    </div>
                    <button
                        type="button"
                        className="w-8 h-8 grid place-items-center text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                        aria-label="Profile"
                    >
                        <User size={16} />
                    </button>
                </div>
            </nav>

            {/* Three-column layout */}
            <div
                className="grid min-h-[calc(100vh-74px)] transition-[grid-template-columns] duration-[240ms]"
                style={{ gridTemplateColumns: `${leftW} 1fr ${rightW}` }}
            >
                <CurriculumRail
                    currentDay={initialDay}
                    completed={completed}
                    collapsed={leftCollapsed}
                    onToggleCollapse={() => setLeftCollapsed((v) => !v)}
                />

                <DayContent day={day} onOpenDrawer={(url, title) => setDrawer({ url, title })} />

                <ChecklistRail
                    dayNumber={day.day}
                    items={day.checklist}
                    collapsed={rightCollapsed}
                    onToggleCollapse={() => setRightCollapsed((v) => !v)}
                />
            </div>

            {/* Right rail re-open tab */}
            {rightCollapsed && (
                <button
                    type="button"
                    onClick={() => setRightCollapsed(false)}
                    className="fixed right-0 top-[140px] px-2 py-3 bg-[#0B0F15] border border-white/[0.08] border-r-0 rounded-l-xl text-zinc-400 text-[11px] font-medium [writing-mode:vertical-rl] hover:text-white hover:bg-[#151E32] transition-colors z-20"
                >
                    Checklist
                </button>
            )}

            <FooterActions
                currentDay={initialDay}
                isDone={isDone}
                onToggleDone={toggleDay}
                leftCollapsed={leftCollapsed}
                rightCollapsed={rightCollapsed}
            />
        </div>
    );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/PlanShell.tsx`

- [ ] **Step 4: Stop for user review.**

---

## Task 11: Create `plan/day/[n]/page.tsx` (the route)

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/day/[n]/page.tsx`

- [ ] **Step 1: Create the route**

```typescript
// app/bitsat-chemistry-revision/plan/day/[n]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PlanShell } from '../../PlanShell';
import { ALL_DAYS, dayByNumber } from '../../planData';

export async function generateStaticParams() {
    return ALL_DAYS.map((d) => ({ n: String(d.day) }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ n: string }>;
}): Promise<Metadata> {
    const { n } = await params;
    const day = dayByNumber(Number(n));
    if (!day) return { title: 'BITSAT Chemistry · Day Not Found | Canvas Classes' };
    const cleanTitle = day.title.split('—')[0].trim();
    return {
        title: `Day ${day.day}: ${cleanTitle} · BITSAT Chemistry 30-Day Plan | Canvas Classes`,
        description: day.focus.slice(0, 160),
        alternates: { canonical: `/bitsat-chemistry-revision/plan/day/${day.day}` },
    };
}

export default async function DayPage({ params }: { params: Promise<{ n: string }> }) {
    const { n } = await params;
    const dayNum = Number(n);
    if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 30) notFound();
    return <PlanShell initialDay={dayNum} />;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean. Route `/bitsat-chemistry-revision/plan/day/[n]` appears in the route manifest.

- [ ] **Step 3: Run dev server, visit the route**

Run: `npm run dev`
Open: `http://localhost:3000/bitsat-chemistry-revision/plan/day/5`
Expected: Day 5 (Chemical Bonding) renders in the course shell. Left rail shows curriculum. Right rail shows checklist. Click a resource — drawer opens.

- [ ] **Step 4: Stage**

Run: `git add "app/bitsat-chemistry-revision/plan/day/[n]/page.tsx"`

- [ ] **Step 5: Stop for user review.** User should walk the course shell on day 5, confirm feel matches the v4 mockup.

---

## Task 12: Create `plan/page.tsx` (redirect to day 1)

**Files:**
- Create: `app/bitsat-chemistry-revision/plan/page.tsx`

- [ ] **Step 1: Create the redirect**

```typescript
// app/bitsat-chemistry-revision/plan/page.tsx
import { redirect } from 'next/navigation';

export default function PlanPage() {
    redirect('/bitsat-chemistry-revision/plan/day/1');
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean. `/bitsat-chemistry-revision/plan` is a server redirect.

- [ ] **Step 3: Walk the redirect in dev**

Open: `http://localhost:3000/bitsat-chemistry-revision/plan`
Expected: redirects to `/bitsat-chemistry-revision/plan/day/1`.

- [ ] **Step 4: Stage**

Run: `git add app/bitsat-chemistry-revision/plan/page.tsx`

- [ ] **Step 5: Stop for user review.**

---

## Task 13: Rename + trim landing client

**Files:**
- Create: `app/bitsat-chemistry-revision/BitsatLandingClient.tsx`
- Modify: `app/bitsat-chemistry-revision/page.tsx:1-96`
- Delete: `app/bitsat-chemistry-revision/BitsatRevisionClient.tsx`

This is the biggest task. Work in three sub-steps.

- [ ] **Step 1: Create `BitsatLandingClient.tsx` as a trimmed copy**

Start from the current `BitsatRevisionClient.tsx`. Keep these sections verbatim:
- All imports except `Flame`, `Lock`, `Clapperboard`, `FlaskConical`, `Microscope` (used only in removed plan code)
- `SESSION1_STATS`, `CHEM_DISTRIBUTION`, `MATHS_DISTRIBUTION`, `TONE_CLASSES`, `TRAPS`, `FAQS` constants
- `AnimatedCounter`, `DonutChart`, `BarChart`, `FAQItem` components

**Remove these constants entirely** (they now live in `plan/planData.ts`):
- `PHASES`, `RESOURCE_META`, `TOTAL_DAYS`, `yt`, `pdf`, `ResourceKind`, `Resource`, `Day`, `Phase` types

**Remove these components entirely:**
- `ResourceDrawer` (lifted in Task 3)
- `ResourceChip`
- `PhaseCard`

**Rewrite the main component to:**

```typescript
// app/bitsat-chemistry-revision/BitsatLandingClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    AlertTriangle, Atom, Brain, Calculator, Clock, Layers, Sparkles, Target, Timer,
    TrendingUp, Trophy,
} from 'lucide-react';
import { AnimatedCounter, DonutChart, BarChart, FAQItem } from './_landingParts';  // OR inline them — see below
// constants SESSION1_STATS, CHEM_DISTRIBUTION, MATHS_DISTRIBUTION, TONE_CLASSES, TRAPS, FAQS stay in this file
// OR extract to a sibling `landingData.ts`. For this task, keep them inline for minimum churn.

const PLAN_STORAGE_KEY = 'bitsat-chem-plan-v1';

export default function BitsatLandingClient() {
    const allTopics = useMemo(() => CHEM_DISTRIBUTION, []);
    const [resumeDay, setResumeDay] = useState<number | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(PLAN_STORAGE_KEY);
            if (raw) {
                const arr: number[] = JSON.parse(raw);
                if (Array.isArray(arr) && arr.length > 0) {
                    // Next-incomplete day = max(completed) + 1, clamped to 30.
                    const maxDone = arr.reduce((m, d) => (d > m ? d : m), 0);
                    setResumeDay(Math.min(30, maxDone + 1));
                }
            }
        } catch {}
        setHydrated(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white">

            {/* ============ HERO ============ */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
                <div className="relative max-w-6xl mx-auto px-5 md:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
                        <Target size={12} />
                        BITSAT 2026 · Session 2 Master Plan
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mx-auto animate-fade-in-up">
                        Crack BITSAT Chemistry in <span className="text-blue-400">30 Days</span>
                    </h1>
                    <p className="mt-5 md:mt-6 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
                        Built from real Session 1 data. The chapters JEE aspirants ignore, the calculation traps that wreck timing, and a daily plan mapped to every free Canvas resource you need.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
                        {hydrated && resumeDay !== null ? (
                            <>
                                <Link
                                    href={`/bitsat-chemistry-revision/plan/day/${resumeDay}`}
                                    className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors no-underline"
                                >
                                    Resume Day {resumeDay}
                                </Link>
                                <Link
                                    href="/bitsat-chemistry-revision/plan/day/1"
                                    className="px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors no-underline"
                                >
                                    Start from Day 1
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/bitsat-chemistry-revision/plan/day/1"
                                    className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors no-underline"
                                >
                                    Open the Plan
                                </Link>
                                <a
                                    href="#post-mortem"
                                    className="px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors no-underline"
                                >
                                    Read Session 1 Post-Mortem
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ============ POST-MORTEM ============ */}
            {/* COPY VERBATIM from current file lines 1182-1272, except: */}
            {/* - No framer-motion (replace `motion.div` with `div`, remove `initial`/`whileInView`/`transition` props) */}
            {/* - Keep red/amber/emerald/purple accents in stat cards + trap cards — they're semantic */}
            {/* - Replace the Session 1 "red-500" top chip's tone if needed; otherwise unchanged */}

            {/* ============ EXAM-DAY TACTICS ============ */}
            {/* COPY VERBATIM from current file lines 1308-1369, remove framer-motion */}

            {/* ============ FAQ ============ */}
            {/* COPY VERBATIM from current file lines 1371-1383 */}

            {/* ============ FOOTER CTA ============ */}
            <section className="py-16 md:py-20 border-t border-white/[0.05]">
                <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">
                        Ready to start? The plan is one click away.
                    </h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                        30 days. 4 phases. Every day mapped to a lecture, notes, and flashcards.
                    </p>
                    <Link
                        href="/bitsat-chemistry-revision/plan/day/1"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors no-underline"
                    >
                        <Sparkles size={16} />
                        Open the Plan
                    </Link>
                </div>
            </section>
        </div>
    );
}
```

**Critical:** the placeholder comments `{/* COPY VERBATIM ... */}` must be replaced with the actual JSX from the current file. Copy lines 1182-1272, 1308-1369, and 1371-1383, then strip framer-motion (`motion.div` → `div`, delete animation props) and confirm imports match.

- [ ] **Step 2: Update `page.tsx` to import the renamed client**

```typescript
// app/bitsat-chemistry-revision/page.tsx  — modify line 2
import BitsatLandingClient from './BitsatLandingClient';

// modify line 93
<BitsatLandingClient />
```

Metadata stays exactly as-is.

- [ ] **Step 3: Delete the old client**

Run: `rm app/bitsat-chemistry-revision/BitsatRevisionClient.tsx`

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 5: Run dev, walk the landing**

Open: `http://localhost:3000/bitsat-chemistry-revision`
Verify:
- Hero renders, blue accent, "Open the Plan" button routes to `/plan/day/1`
- Scroll: Post-Mortem, Exam-Day Tactics, FAQ render — no 30-day plan anywhere on this page
- With previous progress in localStorage: "Resume Day N" button appears in hero

- [ ] **Step 6: Stage**

```bash
git add app/bitsat-chemistry-revision/BitsatLandingClient.tsx
git add app/bitsat-chemistry-revision/page.tsx
git rm app/bitsat-chemistry-revision/BitsatRevisionClient.tsx
```

- [ ] **Step 7: Stop for user review.** This is the biggest single task — review the landing thoroughly, confirm every section still renders and the colour accent is fully blue (no stray orange/amber).

---

## Task 14: Update sitemap

**Files:**
- Modify: `app/sitemap.ts:33`

- [ ] **Step 1: Read current sitemap**

Run: `cat app/sitemap.ts | head -50`

- [ ] **Step 2: Add `/plan` entry**

After the line `{ path: '/bitsat-chemistry-revision', priority: 0.9, changeFrequency: 'weekly' as const },` add:

```typescript
{ path: '/bitsat-chemistry-revision/plan', priority: 0.85, changeFrequency: 'weekly' as const },
```

Individual day URLs (`/plan/day/[n]`) are intentionally NOT in the sitemap — they're deep links, the `/plan` entry plus internal links from the landing are sufficient for crawl coverage.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: clean. Visit `http://localhost:3000/sitemap.xml` and confirm `/plan` appears.

- [ ] **Step 4: Stage**

Run: `git add app/sitemap.ts`

- [ ] **Step 5: Stop for user review.**

---

## Task 15: Final verification walkthrough

**Files:** None modified.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: clean, no warnings, all routes in manifest.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Dev walkthrough — golden path**

Run: `npm run dev`

Walk this path with localStorage cleared first (`localStorage.clear()` in devtools):
1. `/bitsat-chemistry-revision` — hero shows "Open the Plan" (no Resume button because no progress).
2. Click **Open the Plan** → redirects/navigates to `/plan/day/1`.
3. Left rail shows all 30 days, Day 01 highlighted.
4. Right rail shows Day 01 checklist.
5. Click a resource (e.g. Solid State Notes) → drawer slides in from right with iframe.
6. Close drawer, click **Mark Day 01 Complete** → day 01 turns emerald in left rail, progress rail fills, progress chip updates.
7. Click Day 5 in left rail → URL changes to `/plan/day/5`, content updates.
8. Collapse left rail (chevron) → rail shrinks to 56px, shows check circles only. Footer action bar adjusts.
9. Collapse right rail → rail hides, edge tab appears on right. Click to reopen.
10. Navigate back to `/bitsat-chemistry-revision` → Hero now shows "Resume Day 2" (since Day 1 was marked done).
11. Refresh browser → Day 01 still marked complete (localStorage works).

- [ ] **Step 4: Dev walkthrough — edge cases**

1. Visit `/bitsat-chemistry-revision/plan/day/99` → 404.
2. Visit `/bitsat-chemistry-revision/plan` directly → redirects to `/plan/day/1`.
3. On Day 30, the "next" footer button disappears (no day 31).
4. On Day 1, the "prev" footer button disappears.
5. A day with no `tip` → no TipCallout in main, checklist in right rail still renders if `checklist` is populated.
6. A day with no `checklist` → right rail shows "No checklist for this day.".
7. Mobile view (resize to 375px): layout should stack — THIS IS OUT OF SCOPE for this plan. File a follow-up issue noting "responsive pass for /plan needed".

- [ ] **Step 5: Accessibility smoke test**

1. Tab through landing — all CTAs reachable, focus visible.
2. Tab through `/plan/day/5` — curriculum days, resource cards, checklist items, footer buttons all reachable.
3. `Esc` on drawer open — drawer closes (already supported in `ResourceDrawer`).

- [ ] **Step 6: Stop for user review.** Final walkthrough with user. When approved, user commits all staged changes.

---

## Self-review summary

- **Spec coverage:** ✓ Routes (§4.1) → Tasks 11, 12. Shell layout (§4.2) → Tasks 6–10. Visual (§4.3) → Tasks 4, 5, 7, 8, 9, 10, 13. Component breakdown (§5) → every file in §5 has a task. Landing trim (§5) → Task 13. Functionality preservation (§6) → same STORAGE_KEY, ResourceDrawer unchanged, explicitly re-verified in Task 15 step 3. Checklist data decision (§7) → Tasks 1, 2, 8. SEO notes (§8) → Task 11 (per-day metadata), Task 14 (sitemap), Task 13 (landing metadata unchanged).
- **Type consistency:** `DrawerState`, `Day`, `Phase`, `Resource`, `ResourceKind`, `ResourceGroup`, `KIND_GROUP`, `GROUP_ORDER`, `ALL_DAYS`, `dayByNumber`, `phaseForDay` are defined once (Task 1/2) and reused by name everywhere else. Component prop types named consistently: `currentDay`, `completed`, `collapsed`, `onToggleCollapse`.
- **Placeholder scan:** The only "TBD"-adjacent area is Task 13 Step 1's `COPY VERBATIM` comments. These are explicit ranges (`lines 1182-1272`, `1308-1369`, `1371-1383`) with explicit transformations listed — not placeholders. Task 2 Step 1 has a similar instruction for checklist authoring, with 7 worked examples and an explicit authoring rule.

---

## Open follow-ups (out of scope for this plan)

- Responsive / mobile pass for the course shell (not done — desktop-first).
- Proper per-day analytics events (`plan_day_viewed`, `plan_day_completed`).
- DB-backed progress sync when user is logged in (explicitly out of scope per user directive).
- A dedicated "first visit" onboarding overlay ("this is the curriculum, this is today's checklist").
