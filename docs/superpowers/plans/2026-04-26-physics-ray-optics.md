# Physics Ray Optics Simulator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the v1 Ray Optics simulator at `/physics/ray-optics` with a hub landing at `/physics`. Six phases (4 element + Sandbox + Challenge), live ray tracing, JEE-grade sign-convention readout, aberrations, dual-lens compound systems, and gamified challenge mode. Spec: `docs/superpowers/specs/2026-04-26-physics-ray-optics-design.md`.

**Architecture:** Modular folder under `app/physics/` using a Next.js route group `(simulators)` to keep URLs short. Pure ray-tracing math in `engine/*.ts` (testable in isolation via standalone scripts). UI broken into focused components — canvas, sign panel, image badges, controls, sidebar. Phase rendering driven by config (one `ElementPhase` powers all 4 element phases). Sandbox and Challenge are separate phase components that share the engine.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, lucide-react. **No** framer-motion in this build (per spec §11 — design workflow forbids animation libraries). Engine validation via standalone TypeScript scripts in `scripts/` run with `npx tsx` (matches existing project pattern).

---

## Conventions for this plan

- **Testing:** Project has no Jest/Vitest setup (CLAUDE.md §5). Per-task verification:
  - **Engine tasks** → run a standalone `scripts/validate_*.ts` via `npx tsx` and confirm "ALL PASSED" in output.
  - **UI tasks** → `npm run dev`, open the affected route, walk the listed checks. **Do not run `npm run build` locally** (memory: exhausts user's RAM).
- **Commits:** User commits themselves. Each task ends with **"Stop for user review"**. Do NOT run `git commit`. Stage with `git add`, list staged files, hand off.
- **Branch:** `physics` (already created).
- **Design system:** `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` is the single source of truth for colors, typography, components. Copy patterns verbatim. Background `#0d1117`, indigo accent, no third-party animation libraries.
- **Sign convention:** Cartesian (NCERT). Light goes left → right. Left of element = negative `x`; right = positive. Heights above axis = positive.
- **Paths use forward slashes.** Resolves on Windows bash.

---

## File Structure

### New files

```
app/physics/
├── layout.tsx                                      # /physics/* metadata + JSON-LD
├── page.tsx                                        # /physics — hub landing grid
└── (simulators)/                                   # route group, NOT in URL
    └── ray-optics/
        ├── page.tsx                                # /physics/ray-optics — server shell + dynamic import
        ├── RayOpticsSimulator.tsx                  # client: state, StepBar, phase routing, layout
        ├── engine/
        │   ├── types.ts                            # shared TS types
        │   ├── rayTrace.ts                         # paraxial image + principal rays + ray fan
        │   ├── aberrations.ts                      # spherical + chromatic
        │   └── challenges.ts                       # scenario list + validators
        ├── phases/
        │   ├── ElementPhase.tsx                    # config-driven for all 4 element phases
        │   ├── SandboxPhase.tsx                    # 1-2 elements, drag-only, compound math
        │   └── ChallengePhase.tsx                  # scenario runner + localStorage score
        └── components/
            ├── OpticsCanvas.tsx                    # SVG viewport
            ├── SignConventionPanel.tsx             # u, v, f, m, P, equation
            ├── ImageBadges.tsx                     # REAL · INVERTED · MAGN chips
            ├── ControlsPanel.tsx                   # sliders + toggles
            └── Sidebar.tsx                         # phase concept + Expert Tip

scripts/
├── validate_ray_trace.ts                           # validate engine/rayTrace.ts
└── validate_aberrations.ts                         # validate engine/aberrations.ts
```

### Modified files

- `app/sitemap.ts` — add `/physics` and `/physics/ray-optics` entries

---

## Task 1: Shared types in `engine/types.ts`

**Files:**
- Create: `app/physics/(simulators)/ray-optics/engine/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// app/physics/(simulators)/ray-optics/engine/types.ts

export type ElementType =
    | 'convex-lens'
    | 'concave-lens'
    | 'concave-mirror'
    | 'convex-mirror';

export type Phase =
    | 'convex-lens'
    | 'concave-lens'
    | 'concave-mirror'
    | 'convex-mirror'
    | 'sandbox'
    | 'challenge';

export interface OpticalElement {
    id: string;
    type: ElementType;
    position: number;       // cm, absolute (canvas origin = 0)
    focalLength: number;    // cm, signed per Cartesian convention
    aperture: number;       // cm, vertical extent of element (for ray-fan + aberration limits)
}

export interface ObjectState {
    position: number;       // cm, absolute (negative for real objects on the left)
    height: number;         // cm, positive (above axis)
}

export type ImageZone =
    | 'beyond-2F'
    | 'at-2F'
    | 'between-F-and-2F'
    | 'at-F'
    | 'between-F-and-pole'
    | 'behind-element'
    | 'at-infinity';

export interface OpticalImage {
    position: number;       // cm, absolute (NaN if at infinity)
    height: number;         // cm, signed (negative = inverted)
    isReal: boolean;        // true if light actually converges; false for virtual images
    isErect: boolean;       // height has same sign as object height
    magnification: number;  // signed
    zone: ImageZone;
}

export type RayKind =
    | 'parallel'
    | 'focal'
    | 'central'             // lens: through optical center; mirror: pole-symmetric
    | 'fan'
    | 'spherical-marginal'
    | 'chromatic-red'
    | 'chromatic-green'
    | 'chromatic-blue';

export interface RaySegment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isVirtual?: boolean;    // true = dashed (virtual extension)
}

export interface RayPath {
    kind: RayKind;
    segments: RaySegment[];
}

export interface RayDisplaySettings {
    mode: 'principal' | 'fan';
    showSpherical: boolean;
    showChromatic: boolean;
    whiteLight: boolean;
}

export interface ChallengeProgress {
    solved: string[];
    attempted: string[];
    currentIndex: number;
}

export interface SimulatorState {
    phase: Phase;
    object: ObjectState;
    elements: OpticalElement[];
    rays: RayDisplaySettings;
    challenge: ChallengeProgress;
}

// ---------- helpers ----------

export function isLens(type: ElementType): boolean {
    return type === 'convex-lens' || type === 'concave-lens';
}

export function isMirror(type: ElementType): boolean {
    return type === 'concave-mirror' || type === 'convex-mirror';
}

/**
 * Sign of focal length per Cartesian convention.
 * - convex lens: f > 0
 * - concave lens: f < 0
 * - concave mirror: f < 0  (focal point on left, in front of mirror)
 * - convex mirror: f > 0   (focal point on right, behind mirror)
 * Source: NCERT Class 12 Physics Part 2, Chapter 9 (Ray Optics).
 */
export function focalSign(type: ElementType): 1 | -1 {
    if (type === 'convex-lens' || type === 'convex-mirror') return 1;
    return -1;
}
```

- [ ] **Step 2: Verify file is syntactically valid**

Run: `npx tsc --noEmit "app/physics/(simulators)/ray-optics/engine/types.ts"`

Expected: no output (success). If errors appear, fix before continuing.

> **Note:** This is a single-file `tsc --noEmit` check, not a full project build. It does NOT exhaust RAM the way `npm run build` does — safe to run.

- [ ] **Step 3: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/engine/types.ts"
git status
```

Hand off to user. Suggested commit message: `feat(physics): add ray optics engine types`

---

## Task 2: Hub landing page `/physics`

**Files:**
- Create: `app/physics/layout.tsx`
- Create: `app/physics/page.tsx`

- [ ] **Step 1: Create the layout file**

```tsx
// app/physics/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: {
        default: 'Physics Lab — Canvas Classes',
        template: '%s — Physics Lab',
    },
    description: 'Interactive physics simulators built for JEE Main, JEE Advanced, and NEET.',
    openGraph: {
        title: 'Physics Lab — Canvas Classes',
        description: 'Interactive physics simulators for JEE & NEET.',
        type: 'website',
    },
};

export default function PhysicsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
```

- [ ] **Step 2: Create the hub landing page**

```tsx
// app/physics/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Physics Lab',
    description: 'Interactive physics simulators for JEE Main, JEE Advanced, and NEET. Ray optics, mechanics, electromagnetism, and more.',
    alternates: { canonical: '/physics' },
};

interface SimTile {
    slug: string;
    title: string;
    blurb: string;
    status: 'live' | 'coming-soon';
    accent?: string;
}

const SIMS: SimTile[] = [
    {
        slug: 'ray-optics',
        title: 'Ray Optics',
        blurb: 'Lenses, mirrors, sign conventions, aberrations, and compound systems.',
        status: 'live',
        accent: '#818cf8',
    },
    { slug: 'mechanics', title: 'Mechanics', blurb: 'Projectiles, circular motion, oscillations.', status: 'coming-soon' },
    { slug: 'electromagnetism', title: 'Electromagnetism', blurb: 'Fields, induction, circuits.', status: 'coming-soon' },
    { slug: 'modern-physics', title: 'Modern Physics', blurb: 'Photoelectric, Bohr atom, decay.', status: 'coming-soon' },
    { slug: 'waves', title: 'Waves & Wave Optics', blurb: 'Superposition, Doppler, YDSE.', status: 'coming-soon' },
    { slug: 'thermodynamics', title: 'Thermodynamics', blurb: 'PV cycles, kinetic theory.', status: 'coming-soon' },
];

export default function PhysicsHubPage() {
    return (
        <main className="px-4 py-10 md:py-16" style={{ background: '#0d1117', color: '#e2e8f0', minHeight: '100vh' }}>
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Physics <span style={{ color: '#7c3aed' }}>Lab</span>
                    </h1>
                    <p className="text-[11px] font-bold uppercase tracking-widest mt-2" style={{ color: '#475569' }}>
                        Interactive simulators built for JEE & NEET
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SIMS.map((sim) => (
                        <SimCard key={sim.slug} sim={sim} />
                    ))}
                </section>
            </div>
        </main>
    );
}

function SimCard({ sim }: { sim: SimTile }) {
    const isLive = sim.status === 'live';
    const inner = (
        <div
            className="p-5 rounded-xl h-full transition-all"
            style={{
                background: '#151E32',
                border: '1px solid rgba(255,255,255,0.05)',
                opacity: isLive ? 1 : 0.4,
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-black text-white">{sim.title}</h2>
                {!isLive && (
                    <span
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
                    >
                        Soon
                    </span>
                )}
            </div>
            <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>{sim.blurb}</p>
            {isLive && (
                <p className="text-[11px] font-black uppercase tracking-widest mt-4" style={{ color: sim.accent }}>
                    Open simulator →
                </p>
            )}
        </div>
    );
    return isLive ? (
        <Link href={`/physics/${sim.slug}`} className="block">{inner}</Link>
    ) : (
        <div>{inner}</div>
    );
}
```

- [ ] **Step 3: Verify in browser**

Run: `npm run dev` (if not already running), then open `http://localhost:3000/physics`.

Verify:
- Page renders with dark background `#0d1117`
- Heading reads "Physics Lab" with violet "Lab" accent
- 6 cards in a responsive grid (1 col on mobile, 2 on md, 3 on lg)
- Only the "Ray Optics" card is clickable; others are dimmed with "Soon" badge
- Clicking Ray Optics navigates to `/physics/ray-optics` (will 404 until Task 3 — that is expected)

- [ ] **Step 4: Stop for user review**

Stage:
```bash
git add app/physics/layout.tsx app/physics/page.tsx
git status
```

Suggested commit: `feat(physics): add hub landing page`

---

## Task 3: Ray optics page shell with placeholder

**Files:**
- Create: `app/physics/(simulators)/ray-optics/page.tsx`
- Create: `app/physics/(simulators)/ray-optics/RayOpticsSimulator.tsx`

- [ ] **Step 1: Create the route page (server component)**

```tsx
// app/physics/(simulators)/ray-optics/page.tsx
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const RayOpticsSimulator = dynamic(() => import('./RayOpticsSimulator'), {
    ssr: false,
});

export const metadata: Metadata = {
    title: 'Ray Optics Simulator',
    description: 'Interactive ray optics simulator: lenses, mirrors, sign conventions, aberrations, and compound systems. Built for JEE Main, JEE Advanced, and NEET.',
    alternates: { canonical: '/physics/ray-optics' },
};

export default function RayOpticsPage() {
    return <RayOpticsSimulator />;
}
```

- [ ] **Step 2: Create the placeholder simulator client component**

```tsx
// app/physics/(simulators)/ray-optics/RayOpticsSimulator.tsx
'use client';

export default function RayOpticsSimulator() {
    return (
        <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', minHeight: '80vh' }}>
            <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Ray Optics <span style={{ color: '#7c3aed' }}>Lab</span>
                    </h1>
                    <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
                        Interactive Lens & Mirror Bench
                    </p>
                </div>
            </div>
            <div
                className="mt-8 p-12 rounded-xl text-center"
                style={{ background: '#151E32', border: '1px solid rgba(255,255,255,0.05)' }}
            >
                <p className="text-sm" style={{ color: '#94a3b8' }}>Simulator under construction.</p>
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/physics/ray-optics`.

Verify:
- Page renders with dark background
- Header "Ray Optics Lab" with violet "Lab" accent
- Subtitle "Interactive Lens & Mirror Bench"
- Placeholder card "Simulator under construction" visible
- URL is exactly `/physics/ray-optics` (the `(simulators)` segment is hidden by the route group)

- [ ] **Step 4: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/page.tsx" "app/physics/(simulators)/ray-optics/RayOpticsSimulator.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): scaffold simulator route shell`

---

## Task 4: Engine — `rayTrace.ts` (image, principal rays, ray fan)

**Files:**
- Create: `app/physics/(simulators)/ray-optics/engine/rayTrace.ts`

**Math reference (Cartesian sign convention, from NCERT Class 12 Part 2 Ch 9):**

| Quantity | Lens | Mirror |
|---|---|---|
| Conjugate equation | `1/v − 1/u = 1/f` → `v = uf/(u + f)` | `1/v + 1/u = 1/f` → `v = uf/(u − f)` |
| Magnification | `m = v/u` | `m = −v/u` |

`u`, `v`, `f` measured **relative to the optical element**. The engine treats elements as if at origin internally; callers pass relative coordinates.

**Principal rays for a lens at origin** (light L→R):
1. **Parallel ray**: from object tip horizontally to lens, then through `(+f, 0)`.
2. **Focal ray**: from object tip through `(−f, 0)` to lens, then horizontal.
3. **Central ray**: undeviated through `(0, 0)`.

**Principal rays for a mirror at origin** (light L→R, reflects):
1. **Parallel ray**: horizontal to mirror, then reflects through `(f, 0)`. (For concave mirror f<0, F is on the left; for convex f>0, F is on the right and the reflected ray APPEARS to come from F — virtual extension.)
2. **Focal ray**: from object tip through `(f, 0)` to mirror, then reflects horizontal.
3. **Pole ray** (more robust than C-ray, which is degenerate when object is at C): from object tip to pole `(0, 0)`, reflects with mirrored angle (slope flips sign).

- [ ] **Step 1: Create the engine file**

```typescript
// app/physics/(simulators)/ray-optics/engine/rayTrace.ts
import {
    type ElementType,
    type ImageZone,
    type ObjectState,
    type OpticalElement,
    type OpticalImage,
    type RayPath,
    type RaySegment,
    isLens,
    isMirror,
} from './types';

const EPS = 1e-6;

/* ============================================================
 * Coordinate convention (Cartesian, NCERT Class 12 Ch 9)
 *
 *   Light travels left -> right.
 *   x measured from the optical element.
 *   Real object is on the left  -> u < 0.
 *   Lens real image on right    -> v > 0.
 *   Mirror real image on left   -> v < 0.
 *   y above axis = positive.
 * ========================================================== */

/* ---------- public API ---------- */

export function computeImage(object: ObjectState, element: OpticalElement): OpticalImage {
    const u = object.position - element.position;       // object distance, signed, relative to element
    const f = element.focalLength;                       // signed
    const ho = object.height;

    if (Math.abs(u + f) < EPS && isLens(element.type)) return atInfinity(ho);
    if (Math.abs(u - f) < EPS && isMirror(element.type)) return atInfinity(ho);

    const v = isLens(element.type) ? (u * f) / (u + f) : (u * f) / (u - f);
    const m = isLens(element.type) ? v / u : -v / u;
    const hi = m * ho;

    // "Real" classification:
    //   Lens real image: light converges on the OPPOSITE side from object -> v has opposite sign to u -> v > 0 for u < 0.
    //   Mirror real image: light converges on the SAME side as object -> v has same sign as u -> v < 0 for u < 0.
    const isReal = isLens(element.type) ? v > 0 : v < 0;

    return {
        position: element.position + v,
        height: hi,
        isReal,
        isErect: Math.sign(hi) === Math.sign(ho),
        magnification: m,
        zone: classifyZone(u, f, element.type),
    };
}

export function computePrincipalRays(
    object: ObjectState,
    element: OpticalElement,
    image: OpticalImage,
): RayPath[] {
    if (isLens(element.type)) return lensPrincipalRays(object, element, image);
    return mirrorPrincipalRays(object, element, image);
}

/**
 * Sample `count` rays uniformly across the element aperture.
 * Each fan ray leaves the object tip and refracts/reflects per paraxial rules.
 * Returns segments from object to element to image plane.
 */
export function computeRayFan(
    object: ObjectState,
    element: OpticalElement,
    image: OpticalImage,
    count = 12,
): RayPath[] {
    if (image.zone === 'at-infinity') return [];

    const xElem = element.position;
    const aperture = element.aperture;
    const yObj = object.height;
    const xObj = object.position;
    const xImg = image.position;
    const yImg = image.height;

    const rays: RayPath[] = [];
    for (let i = 0; i < count; i++) {
        // sample heights from -aperture/2 to +aperture/2, skipping center (which is the central principal ray)
        const t = (i + 0.5) / count;                     // 0..1 exclusive
        const yLensRel = (t - 0.5) * aperture;
        const xLens = xElem;
        const yLensAbs = yLensRel;

        const segments: RaySegment[] = [
            { x1: xObj, y1: yObj, x2: xLens, y2: yLensAbs },
        ];

        if (isLens(element.type)) {
            // After the lens, the ray heads toward the image point (or appears to, for virtual).
            segments.push({
                x1: xLens,
                y1: yLensAbs,
                x2: xImg,
                y2: yImg,
                isVirtual: !image.isReal,
            });
        } else {
            // Mirror: ray reflects backward through image point.
            segments.push({
                x1: xLens,
                y1: yLensAbs,
                x2: xImg,
                y2: yImg,
                isVirtual: !image.isReal,
            });
        }

        rays.push({ kind: 'fan', segments });
    }
    return rays;
}

/* ---------- internals ---------- */

function atInfinity(ho: number): OpticalImage {
    return {
        position: NaN,
        height: NaN,
        isReal: false,
        isErect: false,
        magnification: NaN,
        zone: 'at-infinity',
    };
}

function classifyZone(u: number, f: number, type: ElementType): ImageZone {
    const uAbs = Math.abs(u);
    const fAbs = Math.abs(f);
    if (Math.abs(uAbs - 2 * fAbs) < 0.5) return 'at-2F';
    if (Math.abs(uAbs - fAbs) < 0.5) return 'at-F';
    if (uAbs > 2 * fAbs) return 'beyond-2F';
    if (uAbs > fAbs && uAbs < 2 * fAbs) return 'between-F-and-2F';
    if (uAbs < fAbs) return 'between-F-and-pole';
    if ((isMirror(type) && Math.sign(u) === Math.sign(f) && fAbs > 0) ||
        (isLens(type) && f < 0)) {
        return 'behind-element';
    }
    return 'between-F-and-pole';
}

function lensPrincipalRays(
    object: ObjectState,
    element: OpticalElement,
    image: OpticalImage,
): RayPath[] {
    const xElem = element.position;
    const f = element.focalLength;
    const yObj = object.height;
    const xObj = object.position;
    const xImg = image.position;
    const yImg = image.height;

    // Parallel ray: from object tip horizontally to lens, then through (+f, 0) on the other side.
    const parallel: RayPath = {
        kind: 'parallel',
        segments: [
            { x1: xObj, y1: yObj, x2: xElem, y2: yObj },
            { x1: xElem, y1: yObj, x2: xImg, y2: yImg, isVirtual: !image.isReal },
        ],
    };

    // Focal ray: from object tip through (-f, 0) to lens at some height, then parallel to axis.
    // Slope from object to (-f, 0): (0 - yObj)/((xElem - f) - xObj)
    const xFocalNear = xElem - f; // object-side focal point
    const slopeFocal = (0 - yObj) / (xFocalNear - xObj);
    const yLensFocal = yObj + slopeFocal * (xElem - xObj);
    const focal: RayPath = {
        kind: 'focal',
        segments: [
            { x1: xObj, y1: yObj, x2: xElem, y2: yLensFocal },
            { x1: xElem, y1: yLensFocal, x2: xImg, y2: yLensFocal, isVirtual: !image.isReal },
        ],
    };

    // Central ray: undeviated through (xElem, 0).
    const slopeCentral = (0 - yObj) / (xElem - xObj);
    const yAtImg = yObj + slopeCentral * (xImg - xObj);
    const central: RayPath = {
        kind: 'central',
        segments: [
            { x1: xObj, y1: yObj, x2: xImg, y2: yAtImg, isVirtual: !image.isReal && false },
        ],
    };

    return [parallel, focal, central];
}

function mirrorPrincipalRays(
    object: ObjectState,
    element: OpticalElement,
    image: OpticalImage,
): RayPath[] {
    const xElem = element.position;
    const f = element.focalLength;
    const yObj = object.height;
    const xObj = object.position;
    const xImg = image.position;
    const yImg = image.height;

    // Parallel ray: object tip horizontally to mirror, then reflects through F.
    // F is at (xElem + f, 0). For concave mirror f<0 -> F to the left (real focal point).
    // For convex f>0 -> F to the right (virtual focal point); reflected ray APPEARS to come from F.
    const parallel: RayPath = {
        kind: 'parallel',
        segments: [
            { x1: xObj, y1: yObj, x2: xElem, y2: yObj },
            { x1: xElem, y1: yObj, x2: xImg, y2: yImg, isVirtual: !image.isReal },
        ],
    };

    // Focal ray: object tip through F to mirror, then reflects parallel to axis.
    const xF = xElem + f;
    const slope = (0 - yObj) / (xF - xObj);
    const yLensF = yObj + slope * (xElem - xObj);
    const focal: RayPath = {
        kind: 'focal',
        segments: [
            { x1: xObj, y1: yObj, x2: xElem, y2: yLensF },
            { x1: xElem, y1: yLensF, x2: xImg, y2: yLensF, isVirtual: !image.isReal },
        ],
    };

    // Pole ray: object tip to (xElem, 0), reflects with mirrored y-slope (angle of incidence = reflection).
    // After reflection, the ray heads back toward the image point in the LEFT direction.
    const central: RayPath = {
        kind: 'central',
        segments: [
            { x1: xObj, y1: yObj, x2: xElem, y2: 0 },
            { x1: xElem, y1: 0, x2: xImg, y2: yImg, isVirtual: !image.isReal },
        ],
    };

    return [parallel, focal, central];
}
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit "app/physics/(simulators)/ray-optics/engine/rayTrace.ts"`

Expected: no output (success).

- [ ] **Step 3: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/engine/rayTrace.ts"
git status
```

Suggested commit: `feat(physics/ray-optics): add ray-tracing engine`

> **Note:** Math validation happens in the next task — do not move past Task 5 until validation script passes.

---

## Task 5: Engine validation script — `validate_ray_trace.ts`

**Files:**
- Create: `scripts/validate_ray_trace.ts`

- [ ] **Step 1: Create the validation script**

```typescript
// scripts/validate_ray_trace.ts
//
// Standalone validation for engine/rayTrace.ts.
// Run: npx tsx scripts/validate_ray_trace.ts
//
// Validates against textbook NCERT Class 12 Ch 9 examples.
// Exits 0 on all-pass, 1 on any failure.

import { computeImage, computePrincipalRays } from '../app/physics/(simulators)/ray-optics/engine/rayTrace';
import type { ObjectState, OpticalElement } from '../app/physics/(simulators)/ray-optics/engine/types';

let failures = 0;

function approx(actual: number, expected: number, tol = 0.01, label = ''): void {
    const ok = Math.abs(actual - expected) < tol;
    const tag = ok ? 'PASS' : 'FAIL';
    console.log(`  [${tag}] ${label}: expected ${expected}, got ${actual.toFixed(4)}`);
    if (!ok) failures++;
}

function bool(actual: boolean, expected: boolean, label = ''): void {
    const ok = actual === expected;
    const tag = ok ? 'PASS' : 'FAIL';
    console.log(`  [${tag}] ${label}: expected ${expected}, got ${actual}`);
    if (!ok) failures++;
}

const obj = (position: number, height = 5): ObjectState => ({ position, height });
const elem = (
    type: OpticalElement['type'],
    focalLength: number,
    position = 0,
    aperture = 8,
): OpticalElement => ({ id: 'test', type, position, focalLength, aperture });

// ---------- TEST 1: Convex lens, object beyond 2F ----------
console.log('\nTEST 1: Convex lens, u=-30, f=+20 (object beyond 2F=40)');
{
    const img = computeImage(obj(-30), elem('convex-lens', 20));
    approx(img.position, 60, 0.01, 'image position v=+60');
    approx(img.height, -10, 0.01, 'image height (m=-2 * 5)');
    approx(img.magnification, -2, 0.01, 'magnification');
    bool(img.isReal, true, 'real image');
    bool(img.isErect, false, 'inverted (not erect)');
}

// ---------- TEST 2: Convex lens, object inside F (virtual image) ----------
console.log('\nTEST 2: Convex lens, u=-10, f=+20 (object inside F)');
{
    const img = computeImage(obj(-10), elem('convex-lens', 20));
    // 1/v - 1/(-10) = 1/20 -> 1/v = 1/20 - 1/10 = -1/20 -> v = -20
    approx(img.position, -20, 0.01, 'image position v=-20 (same side as object)');
    approx(img.magnification, 2, 0.01, 'magnification (virtual, erect, magnified)');
    bool(img.isReal, false, 'virtual image');
    bool(img.isErect, true, 'erect');
}

// ---------- TEST 3: Concave lens (always virtual + erect + diminished) ----------
console.log('\nTEST 3: Concave lens, u=-30, f=-20');
{
    const img = computeImage(obj(-30), elem('concave-lens', -20));
    // 1/v - 1/(-30) = 1/(-20) -> 1/v = -1/20 - 1/30 = -5/60 -> v = -12
    approx(img.position, -12, 0.01, 'image position v=-12');
    approx(img.magnification, 0.4, 0.01, 'magnification (diminished)');
    bool(img.isReal, false, 'virtual');
    bool(img.isErect, true, 'erect');
}

// ---------- TEST 4: Concave mirror, object at C (u = 2f) ----------
console.log('\nTEST 4: Concave mirror, u=-40, f=-20 (object at C)');
{
    const img = computeImage(obj(-40), elem('concave-mirror', -20));
    // 1/v + 1/(-40) = 1/(-20) -> 1/v = -1/20 + 1/40 = -1/40 -> v = -40
    approx(img.position, -40, 0.01, 'image at C (v=-40)');
    approx(img.magnification, -1, 0.01, 'magnification = -1 (same size, inverted)');
    bool(img.isReal, true, 'real');
    bool(img.isErect, false, 'inverted');
}

// ---------- TEST 5: Convex mirror (always virtual + erect + diminished) ----------
console.log('\nTEST 5: Convex mirror, u=-30, f=+20');
{
    const img = computeImage(obj(-30), elem('convex-mirror', 20));
    // 1/v + 1/(-30) = 1/20 -> 1/v = 1/20 + 1/30 = 5/60 -> v = +12
    approx(img.position, 12, 0.01, 'image v=+12 (behind mirror)');
    approx(img.magnification, 0.4, 0.01, 'magnification = 0.4');
    bool(img.isReal, false, 'virtual');
    bool(img.isErect, true, 'erect');
}

// ---------- TEST 6: Principal rays converge at image (convex lens) ----------
console.log('\nTEST 6: Principal rays converge at image (convex lens, u=-30, f=+20)');
{
    const o = obj(-30);
    const e = elem('convex-lens', 20);
    const img = computeImage(o, e);
    const rays = computePrincipalRays(o, e, img);
    if (rays.length !== 3) {
        console.log(`  [FAIL] expected 3 rays, got ${rays.length}`);
        failures++;
    } else {
        rays.forEach((r) => {
            const last = r.segments[r.segments.length - 1];
            approx(last.x2, img.position, 0.01, `${r.kind} ray endpoint x converges to image`);
            approx(last.y2, img.height, 0.01, `${r.kind} ray endpoint y converges to image`);
        });
    }
}

// ---------- TEST 7: Element offset (engine handles non-zero element position) ----------
console.log('\nTEST 7: Convex lens at x=+50, object at x=+20 (relative u=-30)');
{
    const img = computeImage(obj(20), elem('convex-lens', 20, 50));
    approx(img.position, 110, 0.01, 'image absolute position = element + v = 50 + 60');
}

// ---------- summary ----------
console.log(`\n${failures === 0 ? '✓ ALL PASSED' : `✗ ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
```

- [ ] **Step 2: Run the validation**

Run: `npx tsx scripts/validate_ray_trace.ts`

Expected output: each test prints `[PASS]` lines, final line `✓ ALL PASSED`. If any `[FAIL]` appears, fix the math in `engine/rayTrace.ts` before continuing — do NOT proceed with broken engine math.

- [ ] **Step 3: Stop for user review**

Stage:
```bash
git add scripts/validate_ray_trace.ts
git status
```

Suggested commit: `test(physics/ray-optics): validate ray-trace math against NCERT examples`

---

## Task 6: Engine — `aberrations.ts`

**Files:**
- Create: `app/physics/(simulators)/ray-optics/engine/aberrations.ts`

**Math reference:**

| Aberration | Formula |
|---|---|
| Spherical | Marginal rays use `f' = f · (1 − k·(h/aperture)²)` where `h` = ray height at element, `k ≈ 0.25`. |
| Chromatic (lens only) | `f_color = f · (n_green − 1) / (n_color − 1)`. Crown glass: `n_red = 1.514`, `n_green = 1.519`, `n_blue = 1.528` (Hecht, *Optics*, 5th ed., Appendix 4). |

Mirrors do not show chromatic aberration (reflection is wavelength-independent). Spherical aberration applies to both lenses and mirrors.

- [ ] **Step 1: Create the file**

```typescript
// app/physics/(simulators)/ray-optics/engine/aberrations.ts
import { computeImage } from './rayTrace';
import {
    type ObjectState,
    type OpticalElement,
    type OpticalImage,
    type RayPath,
    isLens,
    isMirror,
} from './types';

// Crown glass refractive indices (source: Hecht, Optics, 5th ed., Appendix 4)
const N_RED = 1.514;
const N_GREEN = 1.519;
const N_BLUE = 1.528;

// Visible amplification of spherical aberration. Tunable; 0.25 gives a clearly visible caustic
// without being unphysically extreme for an educational simulator.
const SPHERICAL_K = 0.25;

/**
 * Compute marginal ray paths exhibiting spherical aberration.
 * Marginal rays (height > aperture/4) focus at f' < f, producing a caustic.
 * Returns `count` rays sampled across the upper half of the aperture.
 */
export function computeSphericalRays(
    object: ObjectState,
    element: OpticalElement,
    count = 5,
): RayPath[] {
    const xElem = element.position;
    const f = element.focalLength;
    const aperture = element.aperture;
    const yObj = object.height;
    const xObj = object.position;

    const rays: RayPath[] = [];
    for (let i = 0; i < count; i++) {
        // sample marginal heights from aperture/4 to aperture/2 (and mirror to negative)
        const t = (i + 1) / (count + 1);
        const yLens = (aperture / 2) * (0.5 + 0.5 * t);  // upper marginal
        const fPrime = f * (1 - SPHERICAL_K * Math.pow(yLens / (aperture / 2), 2));

        // Recompute image position with fPrime
        const u = xObj - xElem;
        const v = isLens(element.type)
            ? (u * fPrime) / (u + fPrime)
            : (u * fPrime) / (u - fPrime);
        const xImg = xElem + v;
        const yImg = (isLens(element.type) ? v / u : -v / u) * yObj;

        // ray: object tip -> lens at yLens -> image
        rays.push({
            kind: 'spherical-marginal',
            segments: [
                { x1: xObj, y1: yObj, x2: xElem, y2: yLens },
                { x1: xElem, y1: yLens, x2: xImg, y2: yImg, isVirtual: false },
            ],
        });
    }
    return rays;
}

/**
 * Compute three colored images for chromatic aberration (red, green, blue).
 * Lenses only — mirrors are wavelength-independent.
 */
export function computeChromaticImages(
    object: ObjectState,
    element: OpticalElement,
): { red: OpticalImage; green: OpticalImage; blue: OpticalImage } | null {
    if (!isLens(element.type)) return null;

    const f = element.focalLength;
    return {
        red: computeImage(object, { ...element, focalLength: chromaticF(f, N_RED) }),
        green: computeImage(object, { ...element, focalLength: chromaticF(f, N_GREEN) }),
        blue: computeImage(object, { ...element, focalLength: chromaticF(f, N_BLUE) }),
    };
}

function chromaticF(fGreen: number, nColor: number): number {
    return fGreen * (N_GREEN - 1) / (nColor - 1);
}

/**
 * For a chromatic image, return the rendering color (used by the canvas component).
 */
export function chromaticColor(channel: 'red' | 'green' | 'blue'): string {
    switch (channel) {
        case 'red':   return '#f87171';
        case 'green': return '#86efac';
        case 'blue':  return '#60a5fa';
    }
}

// Re-exports for convenience
export { isLens, isMirror };
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit "app/physics/(simulators)/ray-optics/engine/aberrations.ts"`

Expected: no output.

- [ ] **Step 3: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/engine/aberrations.ts"
git status
```

Suggested commit: `feat(physics/ray-optics): add aberration engine`

---

## Task 7: Aberration validation script

**Files:**
- Create: `scripts/validate_aberrations.ts`

- [ ] **Step 1: Create the validation script**

```typescript
// scripts/validate_aberrations.ts
//
// Run: npx tsx scripts/validate_aberrations.ts

import { computeSphericalRays, computeChromaticImages } from '../app/physics/(simulators)/ray-optics/engine/aberrations';
import type { OpticalElement } from '../app/physics/(simulators)/ray-optics/engine/types';

let failures = 0;

function check(condition: boolean, label: string): void {
    const tag = condition ? 'PASS' : 'FAIL';
    console.log(`  [${tag}] ${label}`);
    if (!condition) failures++;
}

const obj = { position: -30, height: 5 };
const lens: OpticalElement = { id: 'l', type: 'convex-lens', position: 0, focalLength: 20, aperture: 8 };
const mirror: OpticalElement = { id: 'm', type: 'concave-mirror', position: 0, focalLength: -20, aperture: 8 };

// ---------- SPHERICAL ----------
console.log('\nTEST: Spherical aberration produces marginal rays converging short of paraxial focus');
{
    const rays = computeSphericalRays(obj, lens, 5);
    check(rays.length === 5, '5 marginal rays produced');

    const lastSegments = rays.map(r => r.segments[r.segments.length - 1]);
    const xImages = lastSegments.map(s => s.x2);
    // Marginal images should converge at x < paraxial v=60. All should be less than 60.
    check(xImages.every(x => x < 60), 'all marginal images converge short of paraxial 60 cm');
    // Furthest-out marginal ray (last in array) should focus closest to lens
    check(xImages[xImages.length - 1] < xImages[0], 'highest marginal ray focuses closest to lens');
}

// ---------- CHROMATIC ----------
console.log('\nTEST: Chromatic aberration — blue focuses closer than red');
{
    const ch = computeChromaticImages(obj, lens);
    if (!ch) {
        console.log('  [FAIL] chromatic returned null for lens');
        failures++;
    } else {
        check(ch.blue.position < ch.red.position, 'blue focuses closer to lens than red');
        check(ch.green.position > ch.blue.position && ch.green.position < ch.red.position,
              'green between blue and red');
    }
}

// ---------- CHROMATIC: mirrors return null ----------
console.log('\nTEST: Chromatic aberration not applicable to mirrors');
{
    const ch = computeChromaticImages(obj, mirror);
    check(ch === null, 'mirror returns null for chromatic');
}

console.log(`\n${failures === 0 ? '✓ ALL PASSED' : `✗ ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
```

- [ ] **Step 2: Run validation**

Run: `npx tsx scripts/validate_aberrations.ts`

Expected: all `[PASS]`, final `✓ ALL PASSED`. Fix engine if any fail.

- [ ] **Step 3: Stop for user review**

Stage:
```bash
git add scripts/validate_aberrations.ts
git status
```

Suggested commit: `test(physics/ray-optics): validate aberration math`

---

## Task 8: `OpticsCanvas.tsx` — SVG viewport

**Files:**
- Create: `app/physics/(simulators)/ray-optics/components/OpticsCanvas.tsx`

The canvas is the visual heart of the simulator. It draws: principal axis, F/2F markers, the optical element (symbolic), the object arrow, the image arrow, and the ray paths. All rendering is pure SVG; coordinate transforms map physical cm → SVG units via a single `cmToPx` factor.

- [ ] **Step 1: Create the component**

```tsx
// app/physics/(simulators)/ray-optics/components/OpticsCanvas.tsx
'use client';

import type {
    ObjectState,
    OpticalElement,
    OpticalImage,
    RayPath,
} from '../engine/types';
import { isLens } from '../engine/types';

interface Props {
    object: ObjectState;
    elements: OpticalElement[];
    images: OpticalImage[];               // one per element (same order)
    rays: RayPath[];                       // all ray paths to draw
    onObjectDrag?: (next: ObjectState) => void;
    onElementDrag?: (id: string, position: number) => void;
    width?: number;                        // SVG width in cm range to display (default 200 cm: -100..+100)
}

const PX_PER_CM = 4;                       // 4 px = 1 cm
const HEIGHT_CM = 60;                       // visible vertical range (±30 cm)
const AXIS_PADDING_CM = 6;                  // padding above/below for arrows

const RAY_COLORS: Record<string, string> = {
    parallel: '#fbbf24',
    focal:    '#34d399',
    central:  '#818cf8',
    fan:      'rgba(129,140,248,0.5)',
    'spherical-marginal': 'rgba(99,102,241,0.6)',
    'chromatic-red':   '#f87171',
    'chromatic-green': '#86efac',
    'chromatic-blue':  '#60a5fa',
};

export default function OpticsCanvas({
    object,
    elements,
    images,
    rays,
    onObjectDrag,
    onElementDrag,
    width = 200,
}: Props) {
    const W = width * PX_PER_CM;
    const H = HEIGHT_CM * PX_PER_CM;
    const cx = W / 2;                       // x=0 cm → SVG center
    const cy = H / 2;                       // y=0 cm → SVG vertical center

    const xToPx = (xCm: number) => cx + xCm * PX_PER_CM;
    const yToPx = (yCm: number) => cy - yCm * PX_PER_CM;     // SVG y inverted

    return (
        <div
            className="relative overflow-hidden flex items-center justify-center rounded-3xl"
            style={{
                minHeight: H,
                background: 'radial-gradient(circle at center, #1e204a 0%, #050614 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ minHeight: H, touchAction: 'none' }}
            >
                {/* ---------- principal axis ---------- */}
                <line
                    x1={0} y1={cy} x2={W} y2={cy}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth={1}
                    strokeDasharray="4 6"
                />

                {/* ---------- F / 2F markers per element ---------- */}
                {elements.map((el) => (
                    <FocalMarkers key={`m-${el.id}`} element={el} xToPx={xToPx} cy={cy} />
                ))}

                {/* ---------- elements ---------- */}
                {elements.map((el) => (
                    <ElementShape
                        key={`e-${el.id}`}
                        element={el}
                        xToPx={xToPx}
                        cy={cy}
                        onDrag={onElementDrag ? (x) => onElementDrag(el.id, x) : undefined}
                        viewportRect={{ W, H }}
                    />
                ))}

                {/* ---------- ray paths ---------- */}
                {rays.map((r, i) =>
                    r.segments.map((seg, j) => (
                        <line
                            key={`r-${i}-${j}`}
                            x1={xToPx(seg.x1)}
                            y1={yToPx(seg.y1)}
                            x2={xToPx(seg.x2)}
                            y2={yToPx(seg.y2)}
                            stroke={RAY_COLORS[r.kind] ?? '#818cf8'}
                            strokeWidth={r.kind === 'fan' ? 1 : 1.5}
                            strokeDasharray={seg.isVirtual ? '4 4' : undefined}
                            opacity={r.kind === 'fan' ? 0.5 : 0.95}
                        />
                    ))
                )}

                {/* ---------- object arrow (draggable) ---------- */}
                <ObjectArrow
                    object={object}
                    xToPx={xToPx}
                    yToPx={yToPx}
                    onDrag={onObjectDrag}
                    viewportRect={{ W, H }}
                />

                {/* ---------- image arrows ---------- */}
                {images.map((img, i) => (
                    <ImageArrow key={`i-${i}`} image={img} xToPx={xToPx} yToPx={yToPx} />
                ))}
            </svg>
        </div>
    );
}

/* ============================================================
 * SUB-COMPONENTS
 * ========================================================== */

function FocalMarkers({
    element,
    xToPx,
    cy,
}: {
    element: OpticalElement;
    xToPx: (cm: number) => number;
    cy: number;
}) {
    const fAbs = Math.abs(element.focalLength);
    const xF1 = xToPx(element.position - fAbs);
    const xF2 = xToPx(element.position + fAbs);
    const x2F1 = xToPx(element.position - 2 * fAbs);
    const x2F2 = xToPx(element.position + 2 * fAbs);
    const tickStyle = { stroke: 'rgba(148,163,184,0.5)', strokeWidth: 1 };
    return (
        <g>
            {/* F ticks */}
            <line x1={xF1} x2={xF1} y1={cy - 6} y2={cy + 6} {...tickStyle} />
            <line x1={xF2} x2={xF2} y1={cy - 6} y2={cy + 6} {...tickStyle} />
            <text x={xF1} y={cy + 18} fontSize={10} fill="#94a3b8" textAnchor="middle" fontWeight={700}>F</text>
            <text x={xF2} y={cy + 18} fontSize={10} fill="#94a3b8" textAnchor="middle" fontWeight={700}>F</text>
            {/* 2F ticks */}
            <line x1={x2F1} x2={x2F1} y1={cy - 4} y2={cy + 4} {...tickStyle} />
            <line x1={x2F2} x2={x2F2} y1={cy - 4} y2={cy + 4} {...tickStyle} />
            <text x={x2F1} y={cy + 18} fontSize={10} fill="#64748b" textAnchor="middle" fontWeight={700}>2F</text>
            <text x={x2F2} y={cy + 18} fontSize={10} fill="#64748b" textAnchor="middle" fontWeight={700}>2F</text>
        </g>
    );
}

function ElementShape({
    element,
    xToPx,
    cy,
    onDrag,
    viewportRect,
}: {
    element: OpticalElement;
    xToPx: (cm: number) => number;
    cy: number;
    onDrag?: (xCm: number) => void;
    viewportRect: { W: number; H: number };
}) {
    const xPx = xToPx(element.position);
    const halfH = element.aperture * PX_PER_CM;
    const top = cy - halfH;
    const bot = cy + halfH;

    // Pointer drag handler
    const onPointerDown = (e: React.PointerEvent<SVGElement>) => {
        if (!onDrag) return;
        e.preventDefault();
        const svg = (e.target as SVGElement).ownerSVGElement;
        if (!svg) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        const rect = svg.getBoundingClientRect();
        const scale = viewportRect.W / rect.width;
        const handle = (ev: PointerEvent) => {
            const cmX = ((ev.clientX - rect.left) * scale - viewportRect.W / 2) / PX_PER_CM;
            onDrag(cmX);
        };
        const stop = () => {
            window.removeEventListener('pointermove', handle);
            window.removeEventListener('pointerup', stop);
        };
        window.addEventListener('pointermove', handle);
        window.addEventListener('pointerup', stop);
    };

    if (isLens(element.type)) {
        // Symbolic biconvex / biconcave outline
        const isConvex = element.type === 'convex-lens';
        const widthPx = 14;
        const path = isConvex
            ? `M ${xPx} ${top} Q ${xPx + widthPx} ${cy} ${xPx} ${bot} Q ${xPx - widthPx} ${cy} ${xPx} ${top} Z`
            : `M ${xPx - widthPx} ${top} Q ${xPx} ${cy - 4} ${xPx - widthPx} ${bot} L ${xPx + widthPx} ${bot} Q ${xPx} ${cy + 4} ${xPx + widthPx} ${top} Z`;
        return (
            <g
                onPointerDown={onPointerDown}
                style={{ cursor: onDrag ? 'ew-resize' : 'default' }}
            >
                <path
                    d={path}
                    fill="rgba(129,140,248,0.18)"
                    stroke="#818cf8"
                    strokeWidth={2}
                />
                {/* Arrows on top + bottom indicating element type */}
                <Arrowhead x={xPx} y={top} dir={isConvex ? 'in' : 'out'} />
                <Arrowhead x={xPx} y={bot} dir={isConvex ? 'in' : 'out'} flip />
            </g>
        );
    }

    // Mirror — curved arc with hatched back
    const isConcave = element.type === 'concave-mirror';
    const arcDx = isConcave ? -10 : 10;
    return (
        <g
            onPointerDown={onPointerDown}
            style={{ cursor: onDrag ? 'ew-resize' : 'default' }}
        >
            <path
                d={`M ${xPx} ${top} Q ${xPx + arcDx} ${cy} ${xPx} ${bot}`}
                fill="none"
                stroke="#818cf8"
                strokeWidth={2.5}
            />
            {/* Hatching on back of mirror */}
            {Array.from({ length: 8 }).map((_, i) => {
                const yh = top + (i + 0.5) * (halfH * 2 / 8);
                const xh = xPx - arcDx;
                return (
                    <line
                        key={i}
                        x1={xh} y1={yh}
                        x2={xh - 6} y2={yh + 6}
                        stroke="#818cf8"
                        strokeWidth={1}
                        opacity={0.6}
                    />
                );
            })}
        </g>
    );
}

function Arrowhead({ x, y, dir, flip }: { x: number; y: number; dir: 'in' | 'out'; flip?: boolean }) {
    const dy = flip ? -6 : 6;
    return (
        <polygon
            points={`${x - 4},${y + dy} ${x + 4},${y + dy} ${x},${y}`}
            fill="#818cf8"
        />
    );
}

function ObjectArrow({
    object,
    xToPx,
    yToPx,
    onDrag,
    viewportRect,
}: {
    object: ObjectState;
    xToPx: (cm: number) => number;
    yToPx: (cm: number) => number;
    onDrag?: (next: ObjectState) => void;
    viewportRect: { W: number; H: number };
}) {
    const x = xToPx(object.position);
    const yBase = yToPx(0);
    const yTip = yToPx(object.height);

    const onPointerDown = (e: React.PointerEvent<SVGElement>) => {
        if (!onDrag) return;
        e.preventDefault();
        const svg = (e.target as SVGElement).ownerSVGElement;
        if (!svg) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        const rect = svg.getBoundingClientRect();
        const scale = viewportRect.W / rect.width;
        const handle = (ev: PointerEvent) => {
            const cmX = ((ev.clientX - rect.left) * scale - viewportRect.W / 2) / PX_PER_CM;
            const cmY = (viewportRect.H / 2 - (ev.clientY - rect.top) * scale) / PX_PER_CM;
            onDrag({
                position: Math.max(-100, Math.min(-1, cmX)),
                height:   Math.max(1, Math.min(10, cmY)),
            });
        };
        const stop = () => {
            window.removeEventListener('pointermove', handle);
            window.removeEventListener('pointerup', stop);
        };
        window.addEventListener('pointermove', handle);
        window.addEventListener('pointerup', stop);
    };

    return (
        <g
            onPointerDown={onPointerDown}
            style={{ cursor: onDrag ? 'move' : 'default' }}
        >
            <line x1={x} y1={yBase} x2={x} y2={yTip} stroke="#fbbf24" strokeWidth={2.5} />
            <polygon
                points={`${x - 5},${yTip + 6} ${x + 5},${yTip + 6} ${x},${yTip}`}
                fill="#fbbf24"
            />
            <circle cx={x} cy={yBase} r={5} fill="#fbbf24" opacity={0.4} />
        </g>
    );
}

function ImageArrow({
    image,
    xToPx,
    yToPx,
}: {
    image: OpticalImage;
    xToPx: (cm: number) => number;
    yToPx: (cm: number) => number;
}) {
    if (image.zone === 'at-infinity' || isNaN(image.position)) return null;
    const x = xToPx(image.position);
    const yBase = yToPx(0);
    const yTip = yToPx(image.height);
    const color = image.isReal ? '#10b981' : '#fbbf24';
    const isVirtual = !image.isReal;

    return (
        <g>
            <line
                x1={x} y1={yBase} x2={x} y2={yTip}
                stroke={color}
                strokeWidth={2.5}
                strokeDasharray={isVirtual ? '4 4' : undefined}
            />
            <polygon
                points={`${x - 5},${yTip + (image.height > 0 ? 6 : -6)} ${x + 5},${yTip + (image.height > 0 ? 6 : -6)} ${x},${yTip}`}
                fill={color}
                opacity={isVirtual ? 0.7 : 1}
            />
        </g>
    );
}
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit "app/physics/(simulators)/ray-optics/components/OpticsCanvas.tsx"`

Expected: no output. (You may need to also include `--jsx preserve` flags or rely on the project's `tsconfig.json` — running just this file should work since Next.js's tsconfig is at the root.)

If `tsc` complains about the route-group path, use the project tsconfig wildcard instead: `npx tsc --noEmit -p tsconfig.json` is too heavy — just confirm the file's syntax via your editor's TS server.

- [ ] **Step 3: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/components/OpticsCanvas.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): add SVG canvas component`

---

## Task 9: `SignConventionPanel.tsx`

**Files:**
- Create: `app/physics/(simulators)/ray-optics/components/SignConventionPanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/physics/(simulators)/ray-optics/components/SignConventionPanel.tsx
'use client';

import type { ObjectState, OpticalElement, OpticalImage } from '../engine/types';
import { isLens } from '../engine/types';

interface Props {
    object: ObjectState;
    elements: OpticalElement[];
    images: OpticalImage[];
}

export default function SignConventionPanel({ object, elements, images }: Props) {
    return (
        <div
            className="rounded-xl p-4"
            style={{ background: '#0B0F15', border: '1px solid rgba(255,255,255,0.05)' }}
        >
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>
                Sign Convention (Cartesian)
            </p>
            {elements.map((el, i) => (
                <ElementRow key={el.id} object={object} element={el} image={images[i]} index={i} />
            ))}
            {elements.length > 1 && (
                <CompoundRow images={images} />
            )}
        </div>
    );
}

function ElementRow({
    object,
    element,
    image,
    index,
}: {
    object: ObjectState;
    element: OpticalElement;
    image: OpticalImage;
    index: number;
}) {
    const u = object.position - element.position;
    const v = isNaN(image.position) ? null : image.position - element.position;
    const f = element.focalLength;
    const m = image.magnification;
    const P = isLens(element.type) ? 100 / f : null;

    return (
        <div className={index > 0 ? 'mt-3 pt-3' : ''} style={{ borderTop: index > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            {elements.length > 1 && (
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
                    Element {index + 1} — {element.type}
                </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[12px] font-mono">
                <Cell label="u" value={`${signed(u)} cm`} />
                <Cell label="v" value={v === null ? '∞' : `${signed(v)} cm`} />
                <Cell label="f" value={`${signed(f)} cm`} />
                <Cell label="m" value={`${signed(m, 2)}×`} />
                {P !== null && <Cell label="P" value={`${signed(P, 2)} D`} />}
            </div>
            <p className="text-[11px] mt-3 font-mono" style={{ color: '#94a3b8' }}>
                {isLens(element.type)
                    ? `1/v − 1/u = 1/f   →   1/(${fmt(v)}) − 1/(${fmt(u)}) = 1/(${fmt(f)}) ${verify(equationLens(u, v, f))}`
                    : `1/v + 1/u = 1/f   →   1/(${fmt(v)}) + 1/(${fmt(u)}) = 1/(${fmt(f)}) ${verify(equationMirror(u, v, f))}`
                }
            </p>
        </div>
    );
}

function CompoundRow({ images }: { images: OpticalImage[] }) {
    const mTotal = images.reduce((acc, img) => acc * (isNaN(img.magnification) ? 1 : img.magnification), 1);
    return (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#818cf8' }}>
                Compound system
            </p>
            <p className="text-[12px] font-mono" style={{ color: '#c4b5fd' }}>
                m_total = m₁ × m₂ × ... = {signed(mTotal, 2)}×
            </p>
        </div>
    );
}

function Cell({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-[10px] font-black uppercase tracking-widest mr-1" style={{ color: '#475569' }}>{label}</span>
            <span style={{ color: '#e2e8f0' }}>{value}</span>
        </div>
    );
}

function signed(n: number, dp = 1): string {
    if (isNaN(n)) return '—';
    const sign = n >= 0 ? '+' : '';
    return sign + n.toFixed(dp);
}

function fmt(n: number | null): string {
    if (n === null || isNaN(n)) return '∞';
    const sign = n >= 0 ? '+' : '';
    return sign + n.toFixed(0);
}

function equationLens(u: number, v: number | null, f: number): boolean {
    if (v === null) return false;
    return Math.abs((1 / v - 1 / u) - 1 / f) < 0.01;
}

function equationMirror(u: number, v: number | null, f: number): boolean {
    if (v === null) return false;
    return Math.abs((1 / v + 1 / u) - 1 / f) < 0.01;
}

function verify(ok: boolean): string {
    return ok ? '✓' : '';
}
```

- [ ] **Step 2: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/components/SignConventionPanel.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): add sign convention panel`

---

## Task 10: `ImageBadges.tsx`

**Files:**
- Create: `app/physics/(simulators)/ray-optics/components/ImageBadges.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/physics/(simulators)/ray-optics/components/ImageBadges.tsx
'use client';

import type { OpticalImage } from '../engine/types';

interface Props {
    image: OpticalImage;
}

export default function ImageBadges({ image }: Props) {
    if (image.zone === 'at-infinity') {
        return <Pill label="AT ∞" tone="muted" />;
    }
    return (
        <div className="flex flex-wrap gap-1.5">
            <Pill label={image.isReal ? 'REAL' : 'VIRTUAL'} tone={image.isReal ? 'success' : 'warning'} />
            <Pill label={image.isErect ? 'ERECT' : 'INVERTED'} tone={image.isErect ? 'success' : 'warning'} />
            <Pill label={magLabel(image.magnification)} tone="indigo" />
            {image.zone && image.zone !== 'at-infinity' && <Pill label={zoneLabel(image.zone)} tone="muted" />}
        </div>
    );
}

function Pill({ label, tone }: { label: string; tone: 'success' | 'warning' | 'indigo' | 'muted' }) {
    const palette: Record<string, { bg: string; border: string; color: string }> = {
        success: { bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.30)', color: '#6ee7b7' },
        warning: { bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.30)', color: '#fcd34d' },
        indigo:  { bg: 'rgba(129,140,248,0.10)', border: 'rgba(129,140,248,0.30)', color: '#c4b5fd' },
        muted:   { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', color: '#94a3b8' },
    };
    const p = palette[tone];
    return (
        <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded"
            style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color }}
        >
            {label}
        </span>
    );
}

function magLabel(m: number): string {
    if (isNaN(m)) return '—';
    const abs = Math.abs(m);
    if (Math.abs(abs - 1) < 0.05) return 'SAME SIZE';
    if (abs > 1) return `MAGNIFIED ${abs.toFixed(2)}×`;
    return `DIMINISHED ${abs.toFixed(2)}×`;
}

function zoneLabel(zone: string): string {
    return zone.replace(/-/g, ' ').toUpperCase();
}
```

- [ ] **Step 2: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/components/ImageBadges.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): add image classifier badges`

---

## Task 11: `ControlsPanel.tsx`

**Files:**
- Create: `app/physics/(simulators)/ray-optics/components/ControlsPanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/physics/(simulators)/ray-optics/components/ControlsPanel.tsx
'use client';

import type { ObjectState, OpticalElement, RayDisplaySettings } from '../engine/types';
import { focalSign, isLens } from '../engine/types';

interface Props {
    object: ObjectState;
    element: OpticalElement;
    rays: RayDisplaySettings;
    locked?: Set<string>;
    onObjectChange: (next: Partial<ObjectState>) => void;
    onElementChange: (next: Partial<OpticalElement>) => void;
    onRaysChange: (next: Partial<RayDisplaySettings>) => void;
}

export default function ControlsPanel({
    object,
    element,
    rays,
    locked = new Set(),
    onObjectChange,
    onElementChange,
    onRaysChange,
}: Props) {
    const sign = focalSign(element.type);
    const fAbs = Math.abs(element.focalLength);
    return (
        <div
            className="rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{ background: '#0B0F15', border: '1px solid rgba(255,255,255,0.05)' }}
        >
            <Slider
                label="Focal length |f|"
                value={fAbs}
                min={5}
                max={60}
                step={1}
                unit="cm"
                disabled={locked.has('element.focalLength')}
                onChange={(v) => onElementChange({ focalLength: v * sign })}
            />
            <Slider
                label="Object distance u"
                value={object.position}
                min={-100}
                max={-1}
                step={1}
                unit="cm"
                disabled={locked.has('object.position')}
                onChange={(v) => onObjectChange({ position: v })}
            />
            <Slider
                label="Object height"
                value={object.height}
                min={1}
                max={10}
                step={0.5}
                unit="cm"
                disabled={locked.has('object.height')}
                onChange={(v) => onObjectChange({ height: v })}
            />

            <div className="md:col-span-3 flex flex-wrap gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Toggle
                    label="Ray Fan (12 rays)"
                    active={rays.mode === 'fan'}
                    onClick={() => onRaysChange({ mode: rays.mode === 'fan' ? 'principal' : 'fan' })}
                />
                <Toggle
                    label="Spherical Aberration"
                    active={rays.showSpherical}
                    onClick={() => onRaysChange({ showSpherical: !rays.showSpherical })}
                />
                {isLens(element.type) && (
                    <>
                        <Toggle
                            label="Chromatic Aberration"
                            active={rays.showChromatic}
                            onClick={() => onRaysChange({ showChromatic: !rays.showChromatic })}
                        />
                        <Toggle
                            label="White Light"
                            active={rays.whiteLight}
                            onClick={() => onRaysChange({ whiteLight: !rays.whiteLight, showChromatic: !rays.whiteLight })}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function Slider({
    label, value, min, max, step, unit, disabled, onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    disabled?: boolean;
    onChange: (v: number) => void;
}) {
    return (
        <div style={{ opacity: disabled ? 0.4 : 1 }}>
            <div className="flex justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>{label}</span>
                <span className="text-[12px] font-mono" style={{ color: '#c4b5fd' }}>{value.toFixed(1)} {unit}</span>
            </div>
            <input
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#818cf8' }}
            />
        </div>
    );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
            style={{
                background: active ? 'rgba(129,140,248,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.08)'}`,
                color: active ? '#c4b5fd' : '#94a3b8',
            }}
        >
            {active ? '✓ ' : ''}{label}
        </button>
    );
}
```

- [ ] **Step 2: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/components/ControlsPanel.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): add controls panel`

---

## Task 12: `Sidebar.tsx`

**Files:**
- Create: `app/physics/(simulators)/ray-optics/components/Sidebar.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/physics/(simulators)/ray-optics/components/Sidebar.tsx
'use client';

import type { ReactNode } from 'react';

interface Props {
    title: string;
    body: ReactNode;
    expertTip: string;
    observation?: ReactNode;
}

export default function Sidebar({ title, body, expertTip, observation }: Props) {
    return (
        <div className="lg:col-span-4 flex flex-col py-1 gap-5">
            <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
                {title}
            </h2>
            <div className="text-base leading-snug" style={{ color: '#94a3b8' }}>{body}</div>
            {observation && (
                <div
                    className="rounded-lg p-3"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(129,140,248,0.2)' }}
                >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#818cf8' }}>
                        Live Observation
                    </p>
                    <div className="text-sm" style={{ color: '#c4b5fd' }}>{observation}</div>
                </div>
            )}
            <div className="pt-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>
                    Expert Tip
                </h5>
                <p className="text-white text-base font-bold leading-tight italic">&ldquo;{expertTip}&rdquo;</p>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/components/Sidebar.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): add sidebar component`

---

## Task 13: `ElementPhase.tsx` — config-driven phase for all 4 element types

**Files:**
- Create: `app/physics/(simulators)/ray-optics/phases/ElementPhase.tsx`

- [ ] **Step 1: Create the phase component**

```tsx
// app/physics/(simulators)/ray-optics/phases/ElementPhase.tsx
'use client';

import { useMemo } from 'react';
import type { ObjectState, OpticalElement, RayDisplaySettings } from '../engine/types';
import { computeImage, computePrincipalRays, computeRayFan } from '../engine/rayTrace';
import { computeChromaticImages, computeSphericalRays } from '../engine/aberrations';
import OpticsCanvas from '../components/OpticsCanvas';
import SignConventionPanel from '../components/SignConventionPanel';
import ImageBadges from '../components/ImageBadges';
import ControlsPanel from '../components/ControlsPanel';
import Sidebar from '../components/Sidebar';

interface Props {
    object: ObjectState;
    element: OpticalElement;
    rays: RayDisplaySettings;
    sidebarTitle: string;
    sidebarBody: React.ReactNode;
    expertTip: string;
    onObjectChange: (next: Partial<ObjectState>) => void;
    onElementChange: (next: Partial<OpticalElement>) => void;
    onRaysChange: (next: Partial<RayDisplaySettings>) => void;
}

export default function ElementPhase({
    object,
    element,
    rays,
    sidebarTitle,
    sidebarBody,
    expertTip,
    onObjectChange,
    onElementChange,
    onRaysChange,
}: Props) {
    const image = useMemo(() => computeImage(object, element), [object, element]);

    const allRays = useMemo(() => {
        const principal = rays.mode === 'principal' ? computePrincipalRays(object, element, image) : computeRayFan(object, element, image, 12);
        const dim = rays.showChromatic
            ? principal.map((r) => ({ ...r, segments: r.segments.map((s) => ({ ...s })) }))
            : principal;
        const spherical = rays.showSpherical ? computeSphericalRays(object, element, 5) : [];
        const chromatic = rays.showChromatic ? chromaticRays(object, element) : [];
        return [...dim, ...spherical, ...chromatic];
    }, [object, element, rays, image]);

    const observation = (
        <span>
            Image is at <strong>{isNaN(image.position) ? '∞' : `${image.position.toFixed(1)} cm`}</strong>,
            magnification <strong>{isNaN(image.magnification) ? '—' : image.magnification.toFixed(2)}×</strong>.
        </span>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
            <div className="flex flex-col gap-4">
                <OpticsCanvas
                    object={object}
                    elements={[element]}
                    images={[image]}
                    rays={allRays}
                    onObjectDrag={onObjectChange}
                    onElementDrag={(_id, position) => onElementChange({ position })}
                />
                <ImageBadges image={image} />
                <ControlsPanel
                    object={object}
                    element={element}
                    rays={rays}
                    onObjectChange={onObjectChange}
                    onElementChange={onElementChange}
                    onRaysChange={onRaysChange}
                />
                <SignConventionPanel object={object} elements={[element]} images={[image]} />
            </div>
            <Sidebar
                title={sidebarTitle}
                body={sidebarBody}
                expertTip={expertTip}
                observation={observation}
            />
        </div>
    );
}

function chromaticRays(object: ObjectState, element: OpticalElement) {
    const ch = computeChromaticImages(object, element);
    if (!ch) return [];
    return [
        { kind: 'chromatic-red'   as const, segments: [{ x1: object.position, y1: object.height, x2: ch.red.position,   y2: ch.red.height }] },
        { kind: 'chromatic-green' as const, segments: [{ x1: object.position, y1: object.height, x2: ch.green.position, y2: ch.green.height }] },
        { kind: 'chromatic-blue'  as const, segments: [{ x1: object.position, y1: object.height, x2: ch.blue.position,  y2: ch.blue.height }] },
    ];
}
```

- [ ] **Step 2: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/phases/ElementPhase.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): add element phase wrapper`

---

## Task 14: `RayOpticsSimulator.tsx` — main state, StepBar, element-phase routing

**Files:**
- Modify: `app/physics/(simulators)/ray-optics/RayOpticsSimulator.tsx`

This replaces the placeholder from Task 3 with the real simulator. For now we only wire up the **4 element phases** (skipping Sandbox + Challenge). Those come in later tasks.

- [ ] **Step 1: Replace the placeholder file**

```tsx
// app/physics/(simulators)/ray-optics/RayOpticsSimulator.tsx
'use client';

import { useReducer, useMemo } from 'react';
import type {
    ObjectState,
    OpticalElement,
    Phase,
    RayDisplaySettings,
    SimulatorState,
} from './engine/types';
import { focalSign } from './engine/types';
import ElementPhase from './phases/ElementPhase';

const PHASES: { id: Phase; label: string }[] = [
    { id: 'convex-lens',    label: 'Convex Lens' },
    { id: 'concave-lens',   label: 'Concave Lens' },
    { id: 'concave-mirror', label: 'Concave Mirror' },
    { id: 'convex-mirror',  label: 'Convex Mirror' },
    { id: 'sandbox',        label: 'Sandbox' },
    { id: 'challenge',      label: 'Challenge' },
];

const PHASE_DEFAULTS: Record<Exclude<Phase, 'sandbox' | 'challenge'>, { object: ObjectState; element: OpticalElement }> = {
    'convex-lens':    { object: { position: -30, height: 5 }, element: { id: 'el', type: 'convex-lens',    position: 0, focalLength:  20, aperture: 8 } },
    'concave-lens':   { object: { position: -30, height: 5 }, element: { id: 'el', type: 'concave-lens',   position: 0, focalLength: -20, aperture: 8 } },
    'concave-mirror': { object: { position: -40, height: 5 }, element: { id: 'el', type: 'concave-mirror', position: 0, focalLength: -20, aperture: 8 } },
    'convex-mirror':  { object: { position: -30, height: 5 }, element: { id: 'el', type: 'convex-mirror',  position: 0, focalLength:  20, aperture: 8 } },
};

const SIDEBAR_CONTENT: Record<Exclude<Phase, 'sandbox' | 'challenge'>, { title: string; body: React.ReactNode; expertTip: string }> = {
    'convex-lens': {
        title: 'Convex Lens',
        body: <p>A converging lens has positive focal length. The image flips between <strong style={{ color: '#fbbf24' }}>real & inverted</strong> (when the object is beyond F) and <strong style={{ color: '#fbbf24' }}>virtual & erect</strong> (when the object is inside F). Drag the object across F to see the flip.</p>,
        expertTip: 'For a real image, u, v, f all have consistent signs in 1/v − 1/u = 1/f. Negative magnification means inverted.',
    },
    'concave-lens': {
        title: 'Concave Lens',
        body: <p>A diverging lens has <strong style={{ color: '#fbbf24' }}>negative</strong> focal length. The image is always virtual, erect, diminished, and on the same side as the object — regardless of object distance.</p>,
        expertTip: 'A concave lens cannot form a real image of a real object — try it.',
    },
    'concave-mirror': {
        title: 'Concave Mirror',
        body: (
            <>
                <p className="mb-2">A converging (concave) mirror has <strong style={{ color: '#fbbf24' }}>negative</strong> focal length. There are five image cases:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Object at ∞ → image at F</li>
                    <li>Object beyond C → image between F and C</li>
                    <li>Object at C → image at C, same size, inverted</li>
                    <li>Object between C and F → image beyond C, magnified</li>
                    <li>Object between F and pole → virtual, erect, magnified (shaving mirror!)</li>
                </ul>
            </>
        ),
        expertTip: 'A shaving mirror IS a concave mirror with the face inside F — that\'s why your face appears magnified.',
    },
    'convex-mirror': {
        title: 'Convex Mirror',
        body: <p>A diverging (convex) mirror has <strong style={{ color: '#fbbf24' }}>positive</strong> focal length. The image is always virtual, erect, diminished, and behind the mirror. This is why driver-side mirrors are convex — wider field of view, smaller image.</p>,
        expertTip: 'The text "Objects in mirror are closer than they appear" exists because of the diminished image.',
    },
};

type Action =
    | { type: 'set-phase'; phase: Phase }
    | { type: 'set-object'; next: Partial<ObjectState> }
    | { type: 'set-element'; next: Partial<OpticalElement> }
    | { type: 'set-rays'; next: Partial<RayDisplaySettings> };

const initial = (phase: Phase): SimulatorState => {
    if (phase === 'sandbox' || phase === 'challenge') {
        const def = PHASE_DEFAULTS['convex-lens'];
        return {
            phase,
            object: def.object,
            elements: [def.element],
            rays: { mode: 'principal', showSpherical: false, showChromatic: false, whiteLight: false },
            challenge: { solved: [], attempted: [], currentIndex: 0 },
        };
    }
    const def = PHASE_DEFAULTS[phase];
    return {
        phase,
        object: def.object,
        elements: [def.element],
        rays: { mode: 'principal', showSpherical: false, showChromatic: false, whiteLight: false },
        challenge: { solved: [], attempted: [], currentIndex: 0 },
    };
};

function reducer(state: SimulatorState, action: Action): SimulatorState {
    switch (action.type) {
        case 'set-phase':
            return initial(action.phase);
        case 'set-object':
            return { ...state, object: { ...state.object, ...action.next } };
        case 'set-element': {
            const next = { ...state.elements[0], ...action.next };
            // If element type changed, re-apply focal-length sign
            if (action.next.type) {
                next.focalLength = Math.abs(next.focalLength) * focalSign(next.type);
            }
            return { ...state, elements: [next, ...state.elements.slice(1)] };
        }
        case 'set-rays':
            return { ...state, rays: { ...state.rays, ...action.next } };
        default:
            return state;
    }
}

export default function RayOpticsSimulator() {
    const [state, dispatch] = useReducer(reducer, initial('convex-lens'));

    const currentIndex = useMemo(() => PHASES.findIndex((p) => p.id === state.phase), [state.phase]);

    return (
        <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', minHeight: '80vh' }}>
            <Header phase={state.phase} />
            <StepBar currentIndex={currentIndex} onGo={(phase) => dispatch({ type: 'set-phase', phase })} />
            {renderPhase(state, dispatch)}
        </div>
    );
}

function renderPhase(state: SimulatorState, dispatch: React.Dispatch<Action>) {
    if (state.phase === 'sandbox') {
        return <ComingSoon label="Sandbox" />;
    }
    if (state.phase === 'challenge') {
        return <ComingSoon label="Challenge Mode" />;
    }
    const sb = SIDEBAR_CONTENT[state.phase];
    return (
        <ElementPhase
            object={state.object}
            element={state.elements[0]}
            rays={state.rays}
            sidebarTitle={sb.title}
            sidebarBody={sb.body}
            expertTip={sb.expertTip}
            onObjectChange={(next) => dispatch({ type: 'set-object', next })}
            onElementChange={(next) => dispatch({ type: 'set-element', next })}
            onRaysChange={(next) => dispatch({ type: 'set-rays', next })}
        />
    );
}

function Header({ phase }: { phase: Phase }) {
    return (
        <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                    Ray Optics <span style={{ color: '#7c3aed' }}>Lab</span>
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
                    Lens & Mirror Bench — JEE / NEET
                </p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
                Current: {phase.replace('-', ' ')}
            </div>
        </div>
    );
}

function StepBar({ currentIndex, onGo }: { currentIndex: number; onGo: (phase: Phase) => void }) {
    return (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
            {PHASES.map((s, i) => {
                const active = i === currentIndex;
                const done = i < currentIndex;
                return (
                    <button
                        key={s.id}
                        onClick={() => onGo(s.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
                        style={{
                            background: active ? 'rgba(129,140,248,0.15)' : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
                            color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.45)',
                            cursor: 'pointer',
                        }}
                    >
                        <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                            style={{ background: active ? '#6366f1' : done ? '#059669' : 'rgba(255,255,255,0.06)', color: 'white' }}
                        >
                            {done ? '✓' : i + 1}
                        </span>
                        {s.label}
                    </button>
                );
            })}
        </div>
    );
}

function ComingSoon({ label }: { label: string }) {
    return (
        <div
            className="p-12 rounded-xl text-center"
            style={{ background: '#151E32', border: '1px solid rgba(255,255,255,0.05)' }}
        >
            <p className="text-sm" style={{ color: '#94a3b8' }}>{label} — wired in a later task.</p>
        </div>
    );
}
```

- [ ] **Step 2: Stop for user review**

Stage:
```bash
git add "app/physics/(simulators)/ray-optics/RayOpticsSimulator.tsx"
git status
```

Suggested commit: `feat(physics/ray-optics): wire up element phases with state mgmt`

---

## Task 15: Browser verification — all 4 element phases

**No new files.** Pure verification.

- [ ] **Step 1: Run dev server**

If not already running: `npm run dev`. Then open `http://localhost:3000/physics/ray-optics`.

- [ ] **Step 2: Walk the convex-lens phase**

- Page loads with "Convex Lens" StepBar pill highlighted in indigo
- Sidebar reads "Convex Lens" with the lesson body
- Canvas shows: principal axis (dashed), F/2F markers, biconvex lens at center, amber object arrow on the left, green (real) image arrow on the right
- Move the focal-length slider — image position updates live
- Move the object-distance slider toward 0 — image moves further right, then flips to virtual (dashed amber arrow on the SAME side) when |u| < f
- Move the object-height slider — both arrows scale together
- Drag the object arrow with mouse — same effect as slider
- Drag the lens — image moves to track
- Sign-convention panel shows live u, v, f, m, P with the lens equation evaluating, ending in `✓` when valid
- Image badges read REAL · INVERTED · MAGNIFIED 2.00× · BEYOND 2F when u=−30, f=+20

- [ ] **Step 3: Walk the concave-lens phase**

- Click "Concave Lens" in StepBar
- Lens shape changes to biconcave outline
- Image is ALWAYS virtual + erect + diminished, regardless of object position
- Sign-convention panel shows negative `f` (e.g. f=−20)
- Power `P` is negative

- [ ] **Step 4: Walk the concave-mirror phase**

- Click "Concave Mirror"
- Element shape changes to a curved arc with hatching on the convex (back) side
- F/2F markers appear on the LEFT side (in front of mirror) since f < 0
- For default u=−40, f=−20: image is at v=−40 (real, inverted, same size — at C)
- Drag object inside F (e.g. u=−10) → image becomes virtual + erect + magnified
- Sign panel shows mirror equation `1/v + 1/u = 1/f`
- Power row should NOT appear (mirrors don't show P)

- [ ] **Step 5: Walk the convex-mirror phase**

- Click "Convex Mirror"
- Element shape: curved arc with hatching on the LEFT side
- F is on the RIGHT (positive)
- Image always virtual + erect + diminished

- [ ] **Step 6: Toggle ray fan + spherical aberration**

- In any element phase, click "Ray Fan (12 rays)" in controls
- Canvas shows 12 light-indigo rays converging at the image (instead of 3 colored principal rays)
- Click "Spherical Aberration"
- Additional indigo marginal rays appear, converging short of the paraxial focus

- [ ] **Step 7: Toggle chromatic aberration (lens phases only)**

- In a lens phase, click "Chromatic Aberration"
- Three colored arrows appear at slightly different positions (red, green, blue)
- "White Light" toggle should auto-enable chromatic

- [ ] **Step 8: Confirm Sandbox + Challenge are placeholders**

- Click "Sandbox" → "Sandbox — wired in a later task." card appears
- Click "Challenge" → "Challenge Mode — wired in a later task." card appears

- [ ] **Step 9: Stop for user review**

No code changes. If any of the above fail, file a bug and fix the relevant earlier task before continuing. If all pass, you have a working v1 element-phase simulator. Suggested commit (only if you want to mark a milestone): none — no files changed.

---





