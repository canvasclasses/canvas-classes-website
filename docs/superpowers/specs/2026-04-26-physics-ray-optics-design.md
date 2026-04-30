# Physics — Ray Optics Simulator (v1) — Design Spec

**Date:** 2026-04-26
**Branch:** `physics`
**Status:** Design approved — ready for implementation plan
**Audience:** JEE Main, JEE Advanced, NEET (Class 11–12)

---

## 1. Goal

Ship a best-in-class interactive ray optics simulator covering lenses and mirrors at full JEE Advanced depth, as the first physics module on the Crucible / Canvas Classes platform. It must out-teach every existing free online lens tool (PhET, Walter Fendt, etc.) by combining a sandbox, a guided lesson flow, gamified challenges, and JEE-grade numerical readouts in one focused tool.

The simulator is the seed of a new `app/physics/` section that will scale to ~10 sims across mechanics, EM, modern physics, etc.

---

## 2. Scope

### In scope (v1)

- Four element phases: **convex lens**, **concave lens**, **concave mirror**, **convex mirror**
- **Sandbox** phase with drag-drop placement and **dual-element** compound systems (max 2 elements in v1)
- **Challenge** phase with 10–15 gamified scenarios, auto-grading, localStorage score
- **Live ray tracing** — 3 principal rays by default, toggle to 12-ray fan
- **Aberration toggles** — spherical and chromatic
- **Live sign-convention panel** — `u`, `v`, `f`, `m`, `P` (dioptres), with the lens/mirror equation evaluating in real time
- **Auto-classifier badges** on the image — REAL / VIRTUAL · ERECT / INVERTED · MAGNIFIED ×N · positional zone (BEYOND 2F, AT F, BETWEEN F&P, etc.)
- **Color-coded principal rays** — parallel ray, focal ray, central ray
- **Axis markers** — F and 2F shown explicitly on both sides of each element
- **Object & element drag** along the principal axis; object-height drag perpendicular
- **Sliders + drag** for all controls (drag = primary on desktop; sliders = primary on mobile)
- **Symbolic SVG element shapes** (textbook style — thin biconvex/biconcave outline; mirror = curved arc with hatched back)
- **Sidebar lessons** with phase concept and Expert Tip block (per design workflow)
- **Mobile responsive** — stacked layout below `lg:` breakpoint
- **Analytics** — Mixpanel events for phase changes, drags, aberration toggles, challenge attempts/solves
- **Hub landing page** at `/physics` listing available simulators (real page, not redirect)

### Out of scope (deferred to future siblings)

- Refraction & Snell's Law / Total Internal Reflection (own simulator)
- Prism dispersion / minimum deviation (own simulator)
- Optical instruments — eye, microscope, telescope (own simulator)
- Wave optics — YDSE, single slit, polarization (own simulator, different physics)
- Save / share configs, export ray diagram as PNG
- Class 10 "simple mode" (only if NCERT students request it)
- Silvered lens / lens-mirror hybrids (JEE Advanced edge case — defer until requested)
- Score sync to Supabase auth (localStorage only in v1)
- 3+ element compound systems (v1 caps at 2)

---

## 3. URL & file architecture

### Folder structure

```
app/physics/
├── page.tsx                            # /physics — hub landing, lists all sims
├── layout.tsx                          # shared metadata + JSON-LD for /physics/*
└── (simulators)/                       # Next.js route group — does NOT appear in URL
    └── ray-optics/
        ├── page.tsx                    # /physics/ray-optics
        ├── RayOpticsSimulator.tsx      # main: state, phase routing, layout
        ├── engine/
        │   ├── rayTrace.ts             # pure: lens/mirror ray geometry
        │   ├── aberrations.ts          # spherical + chromatic ray sets
        │   └── challenges.ts           # scenario list + validators
        ├── phases/
        │   ├── ElementPhase.tsx        # config-driven; renders all 4 element phases
        │   ├── SandboxPhase.tsx        # drag-drop + dual-element compound systems
        │   └── ChallengePhase.tsx      # gamified scenario runner
        └── components/
            ├── OpticsCanvas.tsx        # SVG viewport
            ├── SignConventionPanel.tsx # u, v, f, m, P, equation readout
            ├── ImageBadges.tsx         # REAL · INVERTED · MAGNIFIED chips
            ├── ControlsPanel.tsx       # sliders + toggles
            └── Sidebar.tsx             # phase concept text + Expert Tip
```

### Resulting URLs

| Folder path | URL |
|---|---|
| `app/physics/page.tsx` | `/physics` |
| `app/physics/(simulators)/ray-optics/page.tsx` | `/physics/ray-optics` |

The `(simulators)` route group is purely organizational — Next.js strips it from the URL. Future physics simulators follow the same pattern: `app/physics/(simulators)/<slug>/page.tsx` → `/physics/<slug>`.

### Why this architecture (not chemistry-hub style)

Chemistry hubs (`inorganic-chemistry-hub/`, `organic-chemistry-hub/`) use long URLs and a redirect from the hub root to a default sim. We deliberately diverge for physics because:

1. **Shorter, more memorable URLs** — `/physics/ray-optics` beats `/physics-optics-hub/optics-bench`
2. **Modularity** — route groups let us add categories like `(calculators)/` later without polluting URLs
3. **Real hub landing page** — physics will host many topically-distinct sims (mechanics, EM, modern physics); a real landing page outperforms a redirect for both UX and SEO

---

## 4. Phases

The simulator runs as a single SPA with phase navigation via the StepBar pattern from `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` Section 4c.

| # | Phase id | Element preconfig | Sidebar lesson |
|---|---|---|---|
| 1 | `convex-lens` | `convex-lens`, u=−30, f=+20 | Real image when |u|>F; virtual when |u|<F. Watch image flip as the object crosses F. |
| 2 | `concave-lens` | `concave-lens`, u=−30, f=−20 | Always virtual, erect, diminished. *Why?* Virtual focus on same side as object. |
| 3 | `concave-mirror` | `concave-mirror`, u=−40, f=−20 | The five image cases: at ∞, beyond C, at C, between C & F, between F & P. |
| 4 | `convex-mirror` | `convex-mirror`, u=−30, f=+20 | Always virtual, erect, diminished. Driving-mirror analogy. |
| 5 | `sandbox` | empty bench, user drops 1–2 elements | No lesson — free play with all toggles available. |
| 6 | `challenge` | first scenario auto-loaded | Per-scenario hints; score tracker visible. |

---

## 5. State model

```ts
type ElementType =
  | 'convex-lens'
  | 'concave-lens'
  | 'concave-mirror'
  | 'convex-mirror';

type Phase =
  | 'convex-lens'
  | 'concave-lens'
  | 'concave-mirror'
  | 'convex-mirror'
  | 'sandbox'
  | 'challenge';

interface OpticalElement {
  id: string;
  type: ElementType;
  position: number;      // cm along principal axis (origin = canvas center)
  focalLength: number;   // cm, signed per Cartesian convention
  aperture: number;      // cm, height of element (for ray-fan and aberration limits)
}

interface ObjectState {
  position: number;      // cm (negative = left of first element by convention)
  height: number;        // cm
}

interface RayDisplaySettings {
  mode: 'principal' | 'fan';   // 3 rays vs 12 rays
  showSpherical: boolean;
  showChromatic: boolean;
  whiteLight: boolean;          // when true, implies showChromatic = true
}

interface ChallengeProgress {
  solved: Set<string>;          // scenario ids
  attempted: Set<string>;
  currentIndex: number;
}

interface SimulatorState {
  phase: Phase;
  object: ObjectState;
  elements: OpticalElement[];   // 1 in element phases; 1–2 in sandbox/challenge
  rays: RayDisplaySettings;
  challenge: ChallengeProgress;
}
```

State lives in `RayOpticsSimulator.tsx` via `useReducer`. Pure ray-tracing functions in `engine/rayTrace.ts` accept `(object, element)` and return `{ image, rayPaths }` — never read or write state directly.

---

## 6. Ray-tracing engine

**Sign convention:** Cartesian. Principal axis = x-axis. Light travels left → right. Distances measured from the optical center / pole; left of element = negative, right = positive. Heights above axis = positive.

### Equations (signed)

| Quantity | Lens | Mirror |
|---|---|---|
| Conjugate | `1/v − 1/u = 1/f` | `1/v + 1/u = 1/f` |
| Magnification | `m = v/u` | `m = −v/u` |
| Optical power | `P = 100/f_cm` (dioptres) | not shown |

### Principal rays (3, computed per element)

1. **Parallel ray** — leaves the object tip parallel to the axis; refracts/reflects through F (on the other side for lens, on the same side for mirror).
2. **Focal ray** — leaves the object tip through F (or appears to come from F for diverging elements); emerges parallel to the axis.
3. **Central ray** — passes undeviated through the optical center (lens) or strikes the pole at angle of incidence = angle of reflection (mirror).

### Ray Fan mode

Sample 12 rays uniformly across the element's aperture (±aperture/2). For each, compute the refracted/reflected path and intersect with the image plane. Under paraxial approximation, all converge at the same image point. With aberrations toggled, they spread.

### Aberration math

| Aberration | Approach |
|---|---|
| **Spherical** | Marginal rays (height > aperture/4) use shifted focal length `f' = f · (1 − k·(h/aperture)²)`, k tunable (~0.25 for visible effect). Renders a caustic. |
| **Chromatic** | Decompose white into red (λ=700 nm), green (λ=550 nm), blue (λ=450 nm). For each color: `f_color = f · (n_green − 1) / (n_color − 1)` using crown-glass refractive indices (n_red=1.514, n_green=1.519, n_blue=1.528). Render three colored image arrows. |

NIST / textbook constants must be cited inline in code comments per `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` Section 7.

---

## 7. Layout

### Desktop (≥1024px)

Grid: `lg:grid-cols-[8fr_4fr]` (per design workflow Section 5).

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER: "Physics Lab" with violet "Lab" accent              │
├──────────────────────────────────────────────────────────────┤
│  STEPBAR: [Convex Lens][Concave Lens][Concave Mirror]        │
│           [Convex Mirror][Sandbox][Challenge]                │
├──────────────────────────────────────┬───────────────────────┤
│                                      │  SIDEBAR              │
│  SVG CANVAS                          │  Phase title          │
│  - Principal axis with F, 2F markers │  Concept body         │
│  - Object arrow (draggable)          │  Live observations    │
│  - Element (draggable along axis)    │  ─────────────        │
│  - Color-coded rays                  │  Expert Tip           │
│  - Image arrow + classifier badges   │                       │
│                                      │                       │
├──────────────────────────────────────┴───────────────────────┤
│  CONTROLS: sliders (f, u, h_obj) + toggles (Fan/Spherical/   │
│           Chromatic/White Light)                             │
├──────────────────────────────────────────────────────────────┤
│  SIGN-CONVENTION PANEL                                       │
│  u=−30 cm · v=+60 cm · f=+20 cm · m=−2.0× · P=+5 D           │
│  Lens eqn: 1/(+60) − 1/(−30) = 1/(+20) ✓                     │
└──────────────────────────────────────────────────────────────┘
```

### Mobile (<1024px)

Single-column stack:

1. Header (compact)
2. StepBar — horizontally scrollable
3. SVG canvas (full width, ~60vh tall)
4. ControlsPanel
5. SignConventionPanel
6. Sidebar (collapsed by default behind a "Concept" toggle pill)

Touch-drag works on object and element via pointer events with `touch-action: none`. Sliders remain primary input on mobile.

---

## 8. Sandbox + Dual-element compound systems

- "+ Add element" button drops a 2nd element on the bench (max 2 in v1).
- Each element type independently selectable from a dropdown above each element's slider group.
- **Compound image computation** (recursive): `image of element 1` becomes `object for element 2`. All positions are **absolute** (measured from canvas origin in cm). New `u` for element 2 = `image_absolute_position − element2.position`. If positive, the image lies on the right side of element 2 → it acts as a **virtual object** (allowed in compound mode). Height of intermediate image becomes object height for element 2 (sign preserved).
- Both images render on canvas: intermediate image at 40% opacity (dashed outline), final image at full opacity (solid).
- SignConventionPanel shows two rows (one per element) plus a `m_total = m₁ × m₂` summary row.
- Sliders are disabled in Sandbox; UX is pure drag.

---

## 9. Challenge Mode

### Scenarios (10–15 in v1, data-driven from `engine/challenges.ts`)

| Type | Example |
|---|---|
| Position the object | "Make a real, inverted, same-size image with this convex lens (f=+20)." Solution: u=−40 |
| Find the focal length | "Image at v=+60, object at u=−30. Find f." Solution: f=+20 |
| Identify image properties | "Predict: REAL or VIRTUAL? INVERTED or ERECT? Then drag to verify." |
| Trick / impossible | "Make a real image with a concave lens." → no valid u; correct answer is "impossible" |
| Compound | "Two convex lenses, f=+20 each, separated by 60 cm. Where does the final image form?" |

### Scenario shape

```ts
type LockableField =
  | 'object.position'
  | 'object.height'
  | 'element.focalLength'
  | 'element.position'
  | 'element.type';

interface Challenge {
  id: string;
  title: string;
  prompt: string;
  setup: Partial<SimulatorState>;        // initial element + state
  locked: LockableField[];               // fields the user CANNOT change in this scenario
  acceptImpossible?: boolean;            // when true, an "Impossible" button is shown
  validate: (s: SimulatorState) => { passed: boolean; hint?: string };
  solutionExplanation: string;           // shown after solve
}
```

Example: a "Find f" challenge sets `locked: ['object.position', 'object.height', 'element.position', 'element.type']` so only the focal-length slider remains active.

### Validation tolerance

- Positions: ±1 cm
- Focal length: ±1 cm
- Magnification: ±0.05
- "Impossible" scenarios: pass when student clicks an "Impossible" button; fail if they try to drag.

### Score persistence

`localStorage` key `optics-bench-challenge-score`. Stored shape: `{ solved: string[], attempted: string[] }`. Read on mount, written on each attempt/solve. No auth; per-device only.

---

## 10. Hub landing page (`/physics`)

`app/physics/page.tsx` renders a grid of available simulators. v1 shows:

- **Ray Optics** — live tile with thumbnail (a small ray-tracing diagram)
- **Coming soon** placeholders for: Mechanics · Electromagnetism · Modern Physics · Waves · Thermodynamics

Each tile is a card per the design system (`bg-[#151E32] border border-white/5 rounded-xl`). Clicking the live tile routes to `/physics/ray-optics`. Coming-soon tiles are visually muted and non-clickable.

The page also includes:
- Page title "Physics Lab" matching the chemistry hub typographic scale
- Subtitle "Interactive simulators built for JEE & NEET"
- JSON-LD `EducationalOrganization` schema for SEO

---

## 11. Design system compliance

All visuals MUST follow `_agents/workflows/SIMULATION_DESIGN_WORKFLOW.md` exactly:

- Background hierarchy: `#0d1117` → `#0B0F15` → `#151E32`
- Primary accent: indigo (`#6366f1`, `#818cf8`, `#c4b5fd`)
- StepBar: pattern from Section 4c (verbatim)
- SVG canvas: radial gradient `radial-gradient(circle at center, #1e204a 0%, #050614 100%)` with indigo-tinted border
- Sidebar: pattern from Section 4j, with **Expert Tip** block at bottom (mandatory)
- Typography scale per Section 2 — never below `text-[10px]`
- **No animation libraries** (Framer Motion, GSAP forbidden — CSS `transition` and `@keyframes` only). This is a deliberate departure from the existing chemistry simulators, which use Framer Motion in violation of the workflow. New physics builds will be compliant.

### Ray colors (specific to optics)

| Ray | Color | Hex |
|---|---|---|
| Parallel ray | Amber | `#fbbf24` |
| Focal ray | Emerald | `#34d399` |
| Central ray | Indigo | `#818cf8` |
| Fan rays (when in fan mode) | Light indigo, 50% opacity | `rgba(129,140,248,0.5)` |
| Chromatic — red | `#f87171` | |
| Chromatic — green | `#86efac` | (light green, distinct from focal-ray emerald) |
| Chromatic — blue | `#60a5fa` | |
| Image arrow (real) | Solid emerald `#10b981` | |
| Image arrow (virtual) | Dashed amber `#fbbf24` | |

**Disambiguation rule:** when chromatic aberration is enabled, principal rays render at 30% opacity to keep visual focus on the colored split. When spherical is on, marginal rays render in a slightly desaturated indigo (`#6366f1` at 60% opacity) to distinguish them from paraxial principal rays.

---

## 12. Academic accuracy gates

Per design workflow Section 7:

- All equations shown to students must include unit labels.
- Refractive indices sourced from standard textbooks (NCERT Physics Part 2 Class 12 Chapter 9 — Ray Optics) and cited inline.
- Vector arrows (object, image) must scale with their actual heights — never decorative.
- Sign-convention readouts must match Cartesian / NCERT conventions exactly.
- Any uncertain physics fact must be marked with `// NEEDS_REVIEW: <reason>` rather than fabricated.

---

## 13. Analytics events

Wired through `lib/analytics/mixpanel`:

| Event | Properties |
|---|---|
| `optics_phase_change` | `from`, `to` |
| `optics_element_dragged` | `phase`, `elementType`, `axis` (object/element/height) |
| `optics_aberration_toggled` | `phase`, `type` (spherical/chromatic), `enabled` |
| `optics_ray_mode_toggled` | `phase`, `mode` (principal/fan) |
| `optics_challenge_attempted` | `scenarioId` |
| `optics_challenge_solved` | `scenarioId`, `attemptCount` |

Aligned with the platform's recent analytics implementation work (`docs/superpowers/specs/2026-04-17-analytics-lean-design.md`).

---

## 14. Decisions made (override before implementation if any are wrong)

1. Object icon = **upward-pointing arrow** (textbook standard; makes inversion visually obvious)
2. Distance unit = **cm** throughout (JEE/NEET convention)
3. Slider ranges in element phases (real objects only): `|f|` ∈ [5, 60] cm with sign set by element type; object distance `u` ∈ [−100, −1] cm; object height `h_obj` ∈ [1, 10] cm. In Sandbox, drag is the only input — no slider restrictions; positive `u` becomes possible only as a derived virtual-object scenario in compound systems.
4. **No Framer Motion** in this build — all motion via CSS `transition` and `@keyframes`
5. Score persistence = **localStorage** only (per-device, no auth required)
6. Hub landing at `/physics` is a real page (not a redirect)
7. Optical Power `P = 100/f` shown alongside `f` in the sign-convention panel (JEE Advanced flavor)
8. Symbolic SVG element shapes (textbook style); no realistic 3D rendering
9. v1 caps at 2 elements in Sandbox / compound challenges; 3+ deferred

---

## 15. Build size estimate

| File | LOC estimate |
|---|---|
| `RayOpticsSimulator.tsx` | 400–600 |
| `engine/rayTrace.ts` | 200–400 |
| `engine/aberrations.ts` | 150–250 |
| `engine/challenges.ts` | 300–500 |
| `phases/ElementPhase.tsx` | 200–300 |
| `phases/SandboxPhase.tsx` | 300–500 |
| `phases/ChallengePhase.tsx` | 250–400 |
| `components/*` (5 files) | 600–900 total |
| `app/physics/page.tsx` | 150–250 |
| `app/physics/layout.tsx` | 50–100 |
| `app/physics/(simulators)/ray-optics/page.tsx` | 50–100 |
| **Total** | **~2700–4400 LOC** |

This is large but distributed across small focused files (mostly under 500 LOC each), which keeps each file legible and editable in isolation.

---

## 16. Definition of done (for v1)

- [ ] All 6 phases functional
- [ ] Drag works on desktop (mouse) and mobile (touch) for object, element, object-height
- [ ] All sliders + toggles functional and respect min/max ranges
- [ ] Live sign-convention panel updates on every state change
- [ ] Auto-classifier badges accurate for all valid configurations
- [ ] Color-coded principal rays + axis F/2F markers visible at all times
- [ ] Aberration toggles produce visually distinct rays/images
- [ ] Sandbox supports 1 or 2 elements; compound image math correct
- [ ] Challenge mode ships with at least 10 scenarios; localStorage score works
- [ ] Hub landing page lists Ray Optics tile + 5 coming-soon tiles
- [ ] Mobile layout passes `lg:` breakpoint test on 360 px and 414 px widths
- [ ] All design-system colors / typography / patterns match `SIMULATION_DESIGN_WORKFLOW.md`
- [ ] No third-party animation libraries imported
- [ ] All physics constants and equations cited in inline comments
- [ ] Analytics events firing in dev console
- [ ] Lint passes (`npm run lint`)

---

## 17. Out of scope reminders (do not creep)

If during implementation the temptation arises to add any of the following, STOP and flag for v2:

- Refraction / Snell / TIR
- Prism / dispersion
- Optical instruments (eye, microscope, telescope)
- Wave optics
- Save/share/export
- 3+ element compound systems
- Silvered lens / lens-mirror hybrids
- Class 10 simple-mode toggle
- Supabase score sync
