// archetypes.ts — the vector-board construction library.
// ─────────────────────────────────────────────────────────────────────────────
// Each archetype is a PURE function: current vector state in → a description of
// what to draw out. No React, no DOM, no side effects — so the physics can be
// verified with a plain node script, exactly like vectorMath.ts.
//
// This mirrors `math-graph/archetypes.ts`: the engine ships once as code, and
// every individual exercise on every page is DATA (a `vector_board` block).
// Extending what a board CAN do = code here; building an exercise = JSON.
//
// GUIDED STEPS (2026-07-27 redesign). A board is not an animation you watch —
// it is a construction you are TALKED THROUGH. `defaultSteps` gives an ordered
// list of {say, cta}: the panel states what is about to happen and why, the
// student clicks, one element appears, then the next statement follows. Nothing
// is on screen before it has been explained, and no number is revealed before
// the student has been shown where it comes from. `ctx.step` = how many stages
// have been revealed; `ctx.t` animates the newest one into place.
//
// CONVENTION (inherited from vectorMath.ts): all coordinates are PHYSICS
// coordinates — x right, y UP, angles in degrees CCW from +x. The SVG layer is
// the only place that flips y.
// ─────────────────────────────────────────────────────────────────────────────

import type { VectorSpec, VectorAccent } from '@canvas/data/types/books';
import {
  add,
  negate,
  fromPolar,
  magnitude,
  angleDeg,
  angle360,
  dot,
  cross2,
  angleBetween,
  parallelogramMagnitude,
  round,
  type Vec2,
} from '../simulations/vector-lab/lib/vectorMath';
import { C } from '../simulations/vector-lab/lib/theme';

// ── Palette ───────────────────────────────────────────────────────────────────
// Named accents map to the SIMULATION_DESIGN_WORKFLOW palette via Vector Lab's
// theme — no new colour values are invented here.
export const ACCENT: Record<VectorAccent, string> = {
  indigo: C.indigoMid,
  amber: C.amber,
  emerald: C.emeraldLight,
  pink: C.pink,
  red: C.red,
  violet: C.violetMid,
  ghost: C.ghost,
};

export const accentOf = (a?: VectorAccent): string => ACCENT[a ?? 'indigo'];

// ── Drawing description ───────────────────────────────────────────────────────

export interface DrawnArrow {
  from: Vec2;
  to: Vec2;
  color: string;
  label?: string;
  dashed?: boolean;
  opacity?: number;
  width?: number;
  /**
   * Where the label sits. Default 'tip'. Use 'mid' for any arrow whose TIP
   * coincides with another arrow's tip — in the triangle law the resultant ends
   * exactly where B ends, so tip-labelling stacks "B" and "R" on top of each
   * other. Caught in a browser pass, not by any type or schema check.
   */
  labelAt?: 'tip' | 'mid';
}

export interface DrawnArc {
  vertex: Vec2;
  fromDeg: number;
  toDeg: number;
  label?: string;
  color?: string;
  radiusPx?: number;
}

/** A thin dashed construction line (component guides, parallelogram sides). */
export interface DrawnGuide {
  from: Vec2;
  to: Vec2;
  color?: string;
  opacity?: number;
}

export interface Readout {
  label: string;
  value: string;
  color?: string;
  /** Emphasised row — the headline number of this board. */
  strong?: boolean;
}

export interface ArchetypeResult {
  arrows: DrawnArrow[];
  guides?: DrawnGuide[];
  arcs?: DrawnArc[];
  readouts?: Readout[];
  /**
   * The live law, ONE LINE PER ARRAY ENTRY (each is inline LaTeX). Split across
   * lines rather than one long string — a single wrapped line was unreadable on
   * a narrow sidebar.
   */
  formula?: string[];
  /** What a `target` exercise checks against. */
  resultant?: Vec2;
  /** Set true when the construction represents a balanced/closed system. */
  balanced?: boolean;
}

export interface ShowFlags {
  grid: boolean;
  axes: boolean;
  components: boolean;
  angleArc: boolean;
  readout: boolean;
  formula: boolean;
  /**
   * Label the axis ends East/West/North/South instead of x/y — for real-world
   * direction problems (displacement, compass bearings). Replaces the plain
   * axis labels; the axis LINES still pass through the computed origin.
   */
  compass: boolean;
}

/** One guided stage: what the teacher says, and the button that reveals it. */
export interface StepDef {
  say: string;
  cta: string;
}

export interface ArchetypeContext {
  /** Current value of each vector, as a DISPLACEMENT (not a position). */
  vecs: Vec2[];
  /** Author-supplied labels/colours/flags, index-aligned with `vecs`. */
  specs: VectorSpec[];
  params: Record<string, number | string | boolean>;
  units: string;
  show: ShowFlags;
  /** How many guided stages have been revealed. Un-stepped boards get ALL_STEPS. */
  step: number;
  /** Animation progress of the newest stage, 0 → 1. */
  t: number;
}

export interface ArchetypeDef {
  label: string;
  hint: string;
  defaultVectors: VectorSpec[];
  defaultShow?: Partial<ShowFlags>;
  /**
   * FRAME SIZING (2026-07-27 — fixes a twice-reported defect: boards were
   * rendering vectors at ~20% of the canvas because every archetype shared one
   * flat generic origin/scale regardless of its typical vector sizes or drag
   * range). Every archetype's board is sized by these three hints, computed
   * ONCE from the archetype's STATIC bounds (seed vectors + drag limits) —
   * never from the live dragged position, or the frame would rescale mid-drag
   * (the exact flicker bug already fixed once this session).
   *
   *   - frameAnchor: where the origin sits, as a FRACTION of the 460×420
   *     canvas — (0,0) top-left .. (1,1) bottom-right. Default {fx:0.5,fy:0.5}
   *     (centred — correct whenever a vector can be dragged in any direction).
   *   - frameQuadrant: which of the 4 directions from the anchor actually need
   *     room. Default all four. An archetype whose vectors only ever go, say,
   *     north-and-east should set `{ up: true, right: true }` and pair it with
   *     an anchor near the bottom-left corner — that alone can double or triple
   *     the usable scale, because the frame stops reserving space no vector
   *     will ever use.
   *   - frameReach: the radius (vector units) the frame must show without
   *     clipping. Defaults to the larger of (a) the sum of the default
   *     vectors' magnitudes — a safe upper bound even for chained/summed
   *     paths — and (b) `max_mag` (see VectorBoard's DraggableHead) if any
   *     vector is draggable, since a drag can reach that far in any direction.
   *
   * `defaultFrame` (exact origin/scale) remains as a full manual escape hatch
   * and wins over all three hints when set.
   */
  /**
   * @deprecated Since 2026-07-29 these three hints are IGNORED. `frame.ts` now
   * fits the frame to the archetype's real content bounding box (from its own
   * `build()`), which made anchor/quadrant/reach guesses unnecessary — and
   * strictly worse: guessing `reach` from the SUM of seed magnitudes left the
   * median board using 5% of the canvas. Fields are kept so existing archetype
   * definitions still compile; setting them has no effect. Use `defaultFrame`
   * for a genuine manual override. Do not add new usages.
   */
  frameAnchor?: { fx: number; fy: number };
  /** @deprecated Ignored — see `frameAnchor`. */
  frameQuadrant?: { up?: boolean; down?: boolean; left?: boolean; right?: boolean };
  /** @deprecated Ignored — see `frameAnchor`. */
  frameReach?: number;
  defaultFrame?: { originX: number; originY: number; scale: number };
  /** Guided construction script. Its length is the number of reveal clicks. */
  defaultSteps?: StepDef[];
  build: (ctx: ArchetypeContext) => ArchetypeResult;
}

/** Sentinel meaning "no guided mode — draw everything". */
export const ALL_STEPS = 99;

// ── Small helpers ─────────────────────────────────────────────────────────────

const num = (p: ArchetypeContext['params'], k: string, d: number): number =>
  typeof p[k] === 'number' ? (p[k] as number) : d;

const flag = (p: ArchetypeContext['params'], k: string, d = false): boolean =>
  typeof p[k] === 'boolean' ? (p[k] as boolean) : d;

/** Tail position of vector i, honouring `tail: 'chain'` (tip-to-tail drawing). */
export function tailOf(vecs: Vec2[], specs: VectorSpec[], i: number): Vec2 {
  if (specs[i]?.tail !== 'chain') return { x: 0, y: 0 };
  return vecs.slice(0, i).reduce(add, { x: 0, y: 0 });
}

const fmt = (n: number, dp = 1): string => round(n, dp).toFixed(dp);

/**
 * Render "a − b" readably when b is negative. Subtracting a negative component
 * printed as `(5.6 − −0.8)`, which is exactly the sort of thing that makes a
 * student distrust the panel. Turn it into `(5.6 + 0.8)`.
 */
const minusTerm = (a: number, b: number): string =>
  b < 0 ? `${fmt(a)} + ${fmt(-b)}` : `${fmt(a)} - ${fmt(b)}`;

/** Ease-out so a revealed element settles rather than stopping dead. */
const ease = (t: number): number => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);

/**
 * Per-element reveal progress. `step` counts how many stages have been REVEALED,
 * so element `idx` belongs to stage `idx + 1` — at step 0 nothing is on screen
 * yet, which is the whole point of the guided mode. Returns 0 (not yet shown),
 * an eased 0→1 (currently drawing itself in), or 1 (fully shown).
 */
const reveal = (step: number, idx: number, t: number): number =>
  step <= idx ? 0 : step > idx + 1 ? 1 : ease(t);

const scaled = (v: Vec2, k: number): Vec2 => ({ x: v.x * k, y: v.y * k });
const sumOf = (vecs: Vec2[]): Vec2 => vecs.reduce(add, { x: 0, y: 0 });

// ── The library ───────────────────────────────────────────────────────────────

export const ARCHETYPES: Record<string, ArchetypeDef> = {
  // 1 ── Scalar vs vector: distance walked ≠ displacement.
  'scalar-vs-vector': {
    label: 'Scalars vs Vectors (walk the path)',
    hint: 'A dot walks the real route while the displacement arrow stays straight — distance ≠ displacement.',
    defaultVectors: [
      { label: 'leg 1', mag: 4, angle: 0, color: 'indigo', tail: 'chain' },
      { label: 'leg 2', mag: 3, angle: 90, color: 'amber', tail: 'chain' },
    ],
    defaultShow: { components: false, angleArc: false, axes: false, compass: true },
    // A scripted walk with no draggable vectors, and by construction it only
    // ever heads into the north-east quadrant from the start point — so the
    // frame only needs to reserve room up and to the right of the origin.
    // Anchoring the origin near the bottom-left corner instead of the canvas
    // centre lets the scale roughly TRIPLE versus the generic centred frame.
    frameAnchor: { fx: 0.1, fy: 0.82 },
    frameQuadrant: { up: true, right: true },
    defaultSteps: [
      {
        say: 'A student walks 4 km east, then turns and walks 3 km north. Let us trace the first part of the walk.',
        cta: 'Walk the first leg',
      },
      {
        say: 'Now the turn. Notice the second leg starts exactly where the first one ended — that is how a real journey works.',
        cta: 'Walk the second leg',
      },
      {
        say: 'The total road covered is 4 + 3 = 7 km. But how far is the student from where they started? Draw the straight arrow from start to finish and find out.',
        cta: 'Show the displacement',
      },
    ],
    build: ({ vecs, specs, units, step, t }) => {
      const displacement = sumOf(vecs);
      const arrows: DrawnArrow[] = [];
      let cursor: Vec2 = { x: 0, y: 0 };
      let walked = 0;

      for (let i = 0; i < vecs.length; i++) {
        const p = reveal(step, i, t);
        if (p <= 0) break;
        arrows.push({
          from: cursor,
          to: add(cursor, scaled(vecs[i], p)),
          color: accentOf(specs[i]?.color ?? 'ghost'),
          label: p >= 1 ? specs[i]?.label : undefined,
          width: 3,
        });
        walked += magnitude(vecs[i]) * p;
        cursor = add(cursor, scaled(vecs[i], p));
      }

      const dp = reveal(step, vecs.length, t);
      if (dp > 0) {
        arrows.push({
          from: { x: 0, y: 0 },
          to: scaled(displacement, dp),
          color: ACCENT.emerald,
          label: dp >= 1 ? 'displacement' : undefined,
          labelAt: 'mid',
          width: 4.5,
        });
      }

      const readouts: Readout[] = [];
      if (step >= 1) {
        readouts.push({ label: 'Road covered', value: `${fmt(walked)} ${units}`.trim(), color: ACCENT.ghost });
      }
      if (step >= vecs.length + 1) {
        readouts.push({
          label: 'Displacement',
          value: `${fmt(magnitude(displacement))} ${units}`.trim(),
          color: ACCENT.emerald,
          strong: true,
        });
      }

      return {
        arrows,
        resultant: displacement,
        readouts,
        formula:
          step >= vecs.length + 1
            ? ['$ \\text{distance} = 4 + 3 = 7 $', '$ \\text{displacement} = \\sqrt{4^2 + 3^2} = 5 $']
            : undefined,
      };
    },
  },

  // 2 ── Anatomy: one draggable arrow, everything about it read out live.
  'vector-anatomy': {
    label: 'Anatomy of a Vector',
    hint: 'Drag the tip — magnitude, direction and both components move together.',
    defaultVectors: [{ label: 'A', mag: 6, angle: 35, color: 'indigo', draggable: true }],
    defaultShow: { components: true, angleArc: true },
    build: ({ vecs, specs, units, show }) => {
      const a = vecs[0] ?? { x: 0, y: 0 };
      const guides: DrawnGuide[] = show.components
        ? [
            { from: { x: a.x, y: 0 }, to: a, color: ACCENT.ghost },
            { from: { x: 0, y: a.y }, to: a, color: ACCENT.ghost },
          ]
        : [];
      const arrows: DrawnArrow[] = [
        { from: { x: 0, y: 0 }, to: a, color: accentOf(specs[0]?.color), label: specs[0]?.label ?? 'A', width: 4.5 },
      ];
      if (show.components) {
        arrows.push(
          { from: { x: 0, y: 0 }, to: { x: a.x, y: 0 }, color: ACCENT.ghost, width: 2.5, opacity: 0.9 },
          { from: { x: 0, y: 0 }, to: { x: 0, y: a.y }, color: ACCENT.ghost, width: 2.5, opacity: 0.9 }
        );
      }
      return {
        arrows,
        guides,
        arcs: show.angleArc ? [{ vertex: { x: 0, y: 0 }, fromDeg: 0, toDeg: angleDeg(a), label: 'θ' }] : [],
        resultant: a,
        readouts: [
          { label: 'Magnitude', value: `${fmt(magnitude(a))} ${units}`.trim(), strong: true, color: ACCENT.indigo },
          { label: 'Direction', value: `${fmt(angle360(a))}°`, color: ACCENT.indigo },
          { label: 'x-component', value: `${fmt(a.x)} ${units}`.trim(), color: ACCENT.ghost },
          { label: 'y-component', value: `${fmt(a.y)} ${units}`.trim(), color: ACCENT.ghost },
        ],
        formula: [
          `$ A_x = A\\cos\\theta = ${fmt(magnitude(a))}\\cos ${fmt(angle360(a))}° = ${fmt(a.x)} $`,
          `$ A_y = A\\sin\\theta = ${fmt(magnitude(a))}\\sin ${fmt(angle360(a))}° = ${fmt(a.y)} $`,
        ],
      };
    },
  },

  // 3 ── Triangle law ★ — the tip-to-tail construction, taught one stage at a time.
  'triangle-law': {
    label: 'Triangle Law (tip-to-tail addition)',
    hint: 'Guided: draw A, slide B onto its tip, then close the triangle to get R.',
    defaultVectors: [
      { label: 'A', mag: 6, angle: 0, color: 'indigo', draggable: true },
      { label: 'B', mag: 5, angle: 65, color: 'amber', draggable: true, tail: 'chain' },
    ],
    defaultShow: { angleArc: true },
    defaultSteps: [
      {
        say: 'Two forces act on the same body. We will add them by drawing. Start with the first force, A — draw it to scale, from the corner.',
        cta: 'Draw A',
      },
      {
        say: 'Now the second force, B. Here is the one rule that matters: do NOT start it at the corner. Slide it — without turning it — so its tail sits on the TIP of A.',
        cta: 'Slide B onto A’s tip',
      },
      {
        say: 'You now have two sides of a triangle. The third side, drawn from where you started to where you finished, is the resultant R — the single force that would do the same job as both. Its length comes from $ R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta} $.',
        cta: 'Close the triangle',
      },
    ],
    build: ({ vecs, specs, units, step, t, show }) => {
      const a = vecs[0] ?? { x: 0, y: 0 };
      const b = vecs[1] ?? { x: 0, y: 0 };
      const r = add(a, b);

      const pa = reveal(step, 0, t);
      const pb = reveal(step, 1, t);
      const pr = reveal(step, 2, t);

      const arrows: DrawnArrow[] = [];
      if (pa > 0) {
        arrows.push({
          from: { x: 0, y: 0 },
          to: scaled(a, pa),
          color: accentOf(specs[0]?.color),
          label: pa >= 1 ? specs[0]?.label ?? 'A' : undefined,
          width: 4.5,
        });
      }
      if (pb > 0) {
        // B slides in from the origin to A's tip as it is revealed, so the
        // "pick it up and move it" idea is something the student watches happen.
        const tail = { x: a.x * pb, y: a.y * pb };
        arrows.push({
          from: tail,
          to: add(tail, b),
          color: accentOf(specs[1]?.color ?? 'amber'),
          label: pb >= 1 ? specs[1]?.label ?? 'B' : undefined,
          width: 4.5,
        });
      }
      if (pr > 0) {
        arrows.push({
          from: { x: 0, y: 0 },
          to: scaled(r, pr),
          color: ACCENT.emerald,
          label: pr >= 1 ? 'R' : undefined,
          labelAt: 'mid',
          width: 5,
        });
      }

      const between = angleBetween(a, b);
      const readouts: Readout[] = [];
      if (step >= 1) {
        readouts.push({ label: `|${specs[0]?.label ?? 'A'}|`, value: `${fmt(magnitude(a))} ${units}`.trim(), color: accentOf(specs[0]?.color) });
      }
      if (step >= 2) {
        readouts.push(
          { label: `|${specs[1]?.label ?? 'B'}|`, value: `${fmt(magnitude(b))} ${units}`.trim(), color: accentOf(specs[1]?.color ?? 'amber') },
          { label: 'Angle between', value: `${fmt(between)}°`, color: ACCENT.ghost }
        );
      }
      if (step >= 3) {
        readouts.push(
          { label: '|R|', value: `${fmt(magnitude(r))} ${units}`.trim(), color: ACCENT.emerald, strong: true },
          { label: 'Direction', value: `${fmt(angle360(r))}° from +x`, color: ACCENT.emerald }
        );
      }

      return {
        arrows,
        // Ghost of B still sitting at the origin while it slides across.
        guides: pb > 0 && pb < 1 ? [{ from: { x: 0, y: 0 }, to: b, color: ACCENT.amber, opacity: 0.25 }] : [],
        arcs: show.angleArc && step >= 3 ? [{ vertex: { x: 0, y: 0 }, fromDeg: angleDeg(a), toDeg: angleDeg(r), label: 'α' }] : [],
        resultant: r,
        readouts,
        formula:
          step >= 3
            ? [
                `$ R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta} $`,
                `$ = \\sqrt{${fmt(magnitude(a))}^2 + ${fmt(magnitude(b))}^2 + 2(${fmt(magnitude(a))})(${fmt(magnitude(b))})\\cos ${fmt(between)}°} $`,
                `$ = ${fmt(magnitude(r))}\\ \\mathrm{${units}} $`,
              ]
            : undefined,
      };
    },
  },

  // 4 ── Parallelogram law ★ — same sum from a common tail, with the NCERT
  // closed form re-substituting live as the arrows move.
  'parallelogram-law': {
    label: 'Parallelogram Law (with the live formula)',
    hint: 'Guided: both arrows from one corner, complete the parallelogram, then the diagonal is R.',
    defaultVectors: [
      { label: 'A', mag: 6, angle: 0, color: 'indigo', draggable: true },
      { label: 'B', mag: 5, angle: 60, color: 'amber', draggable: true },
    ],
    defaultShow: { angleArc: true },
    defaultSteps: [
      { say: 'This time we draw both forces from the SAME corner — the way they actually act on the body.', cta: 'Draw A' },
      { say: 'And B from that same corner. The angle between them, θ, is the quantity that decides everything.', cta: 'Draw B' },
      { say: 'Complete the shape into a parallelogram by drawing the two missing sides.', cta: 'Complete the parallelogram' },
      { say: 'The diagonal from the shared corner is the resultant. Same answer as the triangle law — a different picture of the same rule.', cta: 'Draw the diagonal' },
    ],
    build: ({ vecs, specs, units, step, t, show }) => {
      const a = vecs[0] ?? { x: 0, y: 0 };
      const b = vecs[1] ?? { x: 0, y: 0 };
      const r = add(a, b);
      const between = angleBetween(a, b);
      const magA = magnitude(a);
      const magB = magnitude(b);
      const closedForm = parallelogramMagnitude(magA, magB, between);

      const pa = reveal(step, 0, t);
      const pb = reveal(step, 1, t);
      const pp = reveal(step, 2, t);
      const pr = reveal(step, 3, t);

      const arrows: DrawnArrow[] = [];
      if (pa > 0) arrows.push({ from: { x: 0, y: 0 }, to: scaled(a, pa), color: accentOf(specs[0]?.color), label: pa >= 1 ? specs[0]?.label ?? 'A' : undefined, width: 4.5 });
      if (pb > 0) arrows.push({ from: { x: 0, y: 0 }, to: scaled(b, pb), color: accentOf(specs[1]?.color ?? 'amber'), label: pb >= 1 ? specs[1]?.label ?? 'B' : undefined, width: 4.5 });
      if (pr > 0) arrows.push({ from: { x: 0, y: 0 }, to: scaled(r, pr), color: ACCENT.emerald, label: pr >= 1 ? 'R' : undefined, width: 5 });

      const guides: DrawnGuide[] = [];
      if (pp > 0) {
        guides.push(
          { from: a, to: add(a, scaled(b, pp)), color: ACCENT.amber, opacity: 0.5 },
          { from: b, to: add(b, scaled(a, pp)), color: ACCENT.indigo, opacity: 0.5 }
        );
      }

      const readouts: Readout[] = [];
      if (step >= 1) readouts.push({ label: 'A', value: `${fmt(magA)} ${units}`.trim(), color: accentOf(specs[0]?.color) });
      if (step >= 2) {
        readouts.push(
          { label: 'B', value: `${fmt(magB)} ${units}`.trim(), color: accentOf(specs[1]?.color ?? 'amber') },
          { label: 'θ between', value: `${fmt(between)}°`, color: ACCENT.ghost }
        );
      }
      if (step >= 4) {
        readouts.push(
          { label: '|R|', value: `${fmt(closedForm)} ${units}`.trim(), color: ACCENT.emerald, strong: true },
          { label: 'α from A', value: `${fmt(Math.abs(angleDeg(r) - angleDeg(a)))}°`, color: ACCENT.emerald }
        );
      }

      return {
        arrows,
        guides,
        arcs: show.angleArc && step >= 2 ? [{ vertex: { x: 0, y: 0 }, fromDeg: angleDeg(a), toDeg: angleDeg(b), label: 'θ' }] : [],
        resultant: r,
        readouts,
        formula:
          step >= 4
            ? [
                `$ R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta} $`,
                `$ = \\sqrt{${fmt(magA)}^2 + ${fmt(magB)}^2 + 2(${fmt(magA)})(${fmt(magB)})\\cos ${fmt(between)}°} $`,
                `$ = ${fmt(closedForm)}\\ \\mathrm{${units}} $`,
              ]
            : undefined,
      };
    },
  },

  // 5 ── Subtraction ★ — A − B is A + (−B). The reversal is drawn, not asserted.
  'vector-subtraction': {
    label: 'Subtracting Vectors (A − B)',
    hint: 'Guided: turn B around to get −B, chain it onto A, then read off A − B.',
    defaultVectors: [
      { label: 'A', mag: 6, angle: 20, color: 'indigo', draggable: true },
      { label: 'B', mag: 4.5, angle: 100, color: 'amber', draggable: true },
    ],
    defaultShow: { angleArc: false },
    defaultSteps: [
      { say: 'Here are our two vectors, A and B, drawn from the same corner. We want A − B.', cta: 'Draw A and B' },
      { say: 'There is no new rule for subtraction. We rewrite it: $ \\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B}) $. So first, turn B right around — same length, opposite direction.', cta: 'Turn B around' },
      { say: 'Now it is an ordinary addition. Slide −B so its tail sits on A’s tip, exactly as before.', cta: 'Slide −B onto A’s tip' },
      { say: 'Close the triangle and you have A − B. Notice it leans towards A — that is always true of the vector named first.', cta: 'Show A − B' },
    ],
    build: ({ vecs, specs, units, params, step, t }) => {
      const a = vecs[0] ?? { x: 0, y: 0 };
      const b = vecs[1] ?? { x: 0, y: 0 };
      const diff = add(a, negate(b));

      const p1 = reveal(step, 0, t);
      const p2 = reveal(step, 1, t);
      const p3 = reveal(step, 2, t);
      const p4 = reveal(step, 3, t);

      const arrows: DrawnArrow[] = [];
      if (p1 > 0) {
        arrows.push(
          { from: { x: 0, y: 0 }, to: scaled(a, p1), color: accentOf(specs[0]?.color), label: p1 >= 1 ? specs[0]?.label ?? 'A' : undefined, width: 4.5 },
          { from: { x: 0, y: 0 }, to: scaled(b, p1), color: accentOf(specs[1]?.color ?? 'amber'), label: p1 >= 1 ? specs[1]?.label ?? 'B' : undefined, width: 4.5, opacity: step >= 2 ? 0.35 : 1 }
        );
      }
      if (p2 > 0) {
        // B rotates through 180° about the origin to become −B.
        const spun = fromPolar(magnitude(b), angleDeg(b) + 180 * p2);
        // Once step 3 starts, −B walks from the origin out to A's tip.
        const tail = p3 > 0 ? scaled(a, p3) : { x: 0, y: 0 };
        arrows.push({
          from: tail,
          to: add(tail, spun),
          color: ACCENT.pink,
          label: p2 >= 1 ? '−B' : undefined,
          width: 4.5,
        });
      }
      if (p4 > 0) {
        arrows.push({ from: { x: 0, y: 0 }, to: scaled(diff, p4), color: ACCENT.emerald, label: p4 >= 1 ? 'A − B' : undefined, labelAt: 'mid', width: 5 });
      }
      if (p4 >= 1 && flag(params, 'show_reverse')) {
        arrows.push({ from: { x: 0, y: 0 }, to: negate(diff), color: ACCENT.red, label: 'B − A', width: 3, dashed: true, opacity: 0.7 });
      }

      const readouts: Readout[] = [];
      if (step >= 1) {
        readouts.push(
          { label: '|A|', value: `${fmt(magnitude(a))} ${units}`.trim(), color: accentOf(specs[0]?.color) },
          { label: '|B|', value: `${fmt(magnitude(b))} ${units}`.trim(), color: accentOf(specs[1]?.color ?? 'amber') }
        );
      }
      if (step >= 4) {
        readouts.push(
          { label: '|A − B|', value: `${fmt(magnitude(diff))} ${units}`.trim(), color: ACCENT.emerald, strong: true },
          { label: 'Direction', value: `${fmt(angle360(diff))}°`, color: ACCENT.emerald }
        );
        if (flag(params, 'show_reverse')) {
          readouts.push({ label: 'B − A points', value: `${fmt(angle360(negate(diff)))}° — opposite`, color: ACCENT.red });
        }
      }

      return {
        arrows,
        resultant: diff,
        readouts,
        formula:
          step >= 4
            ? [
                `$ \\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B}) $`,
                `$ = (${minusTerm(a.x, b.x)})\\hat{i} + (${minusTerm(a.y, b.y)})\\hat{j} $`,
                `$ |\\vec{A} - \\vec{B}| = ${fmt(magnitude(diff))}\\ \\mathrm{${units}} $`,
              ]
            : undefined,
      };
    },
  },

  // 6 ── Resolution ★ — the payoff for the trigonometry page.
  'resolution': {
    label: 'Resolving into Components',
    hint: 'Guided: drop the perpendiculars, then read off A cos θ and A sin θ.',
    defaultVectors: [{ label: 'F', mag: 7, angle: 40, color: 'indigo', draggable: true }],
    defaultShow: { components: true, angleArc: true },
    defaultSteps: [
      { say: 'One force acts at an angle. Working with a slanting force is awkward — so we replace it with two forces at right angles that together do exactly the same job.', cta: 'Draw the force' },
      { say: 'Drop a perpendicular from the tip down to each axis. These two dashed lines box the arrow in.', cta: 'Drop the perpendiculars' },
      { say: 'The two sides of that box are the components. From the right triangle: the along-axis one is $ F\\cos\\theta $ and the upright one is $ F\\sin\\theta $.', cta: 'Show the components' },
    ],
    build: ({ vecs, specs, units, params, step, t }) => {
      const a = vecs[0] ?? { x: 0, y: 0 };
      const label = specs[0]?.label ?? 'F';
      const mag = magnitude(a);
      const th = angle360(a);
      const axisDeg = num(params, 'axis_angle', 0);
      const along = fromPolar(Math.cos(((th - axisDeg) * Math.PI) / 180) * mag, axisDeg);
      const perp = add(a, negate(along));

      const p1 = reveal(step, 0, t);
      const p2 = reveal(step, 1, t);
      const p3 = reveal(step, 2, t);

      const arrows: DrawnArrow[] = [];
      if (p1 > 0) arrows.push({ from: { x: 0, y: 0 }, to: scaled(a, p1), color: accentOf(specs[0]?.color), label: p1 >= 1 ? label : undefined, width: 4.5 });
      if (p3 > 0) {
        arrows.push(
          { from: { x: 0, y: 0 }, to: scaled(along, p3), color: ACCENT.amber, label: p3 >= 1 ? `${label}∥` : undefined, width: 3.5 },
          { from: { x: 0, y: 0 }, to: scaled(perp, p3), color: ACCENT.pink, label: p3 >= 1 ? `${label}⊥` : undefined, width: 3.5 }
        );
      }

      const readouts: Readout[] = [];
      if (step >= 1) {
        readouts.push(
          { label: `|${label}|`, value: `${fmt(mag)} ${units}`.trim(), color: accentOf(specs[0]?.color), strong: true },
          { label: 'θ', value: `${fmt(th - axisDeg)}°`, color: ACCENT.ghost }
        );
      }
      if (step >= 3) {
        readouts.push(
          { label: `${label}∥ (cos)`, value: `${fmt(magnitude(along))} ${units}`.trim(), color: ACCENT.amber },
          { label: `${label}⊥ (sin)`, value: `${fmt(magnitude(perp))} ${units}`.trim(), color: ACCENT.pink }
        );
      }

      return {
        arrows,
        guides: p2 > 0 ? [{ from: along, to: a, color: ACCENT.ghost }, { from: perp, to: a, color: ACCENT.ghost }] : [],
        arcs: step >= 1 ? [{ vertex: { x: 0, y: 0 }, fromDeg: axisDeg, toDeg: th, label: 'θ' }] : [],
        resultant: a,
        readouts,
        formula:
          step >= 3
            ? [
                `$ ${label}_{\\parallel} = ${label}\\cos\\theta = ${fmt(mag)}\\cos ${fmt(th - axisDeg)}° = ${fmt(magnitude(along))} $`,
                `$ ${label}_{\\perp} = ${label}\\sin\\theta = ${fmt(mag)}\\sin ${fmt(th - axisDeg)}° = ${fmt(magnitude(perp))} $`,
              ]
            : undefined,
      };
    },
  },

  // 7 ── Analytical addition — the component-table method, with a live table.
  'analytical-addition': {
    label: 'Adding by Components (i, j)',
    hint: 'Every vector split into x and y; the columns total to the resultant.',
    defaultVectors: [
      { label: 'A', mag: 5, angle: 30, color: 'indigo', draggable: true },
      { label: 'B', mag: 4, angle: 120, color: 'amber', draggable: true },
    ],
    defaultShow: { components: true },
    build: ({ vecs, specs, units, show }) => {
      const r = sumOf(vecs);
      const arrows: DrawnArrow[] = vecs.map((v, i) => ({
        from: { x: 0, y: 0 },
        to: v,
        color: accentOf(specs[i]?.color),
        label: specs[i]?.label,
        width: 3.5,
      }));
      arrows.push({ from: { x: 0, y: 0 }, to: r, color: ACCENT.emerald, label: 'R', width: 5 });

      const guides: DrawnGuide[] = show.components
        ? vecs.flatMap((v) => [
            { from: { x: v.x, y: 0 }, to: v, color: ACCENT.ghost, opacity: 0.5 },
            { from: { x: 0, y: v.y }, to: v, color: ACCENT.ghost, opacity: 0.5 },
          ])
        : [];

      const rows: Readout[] = vecs.map((v, i) => ({
        label: specs[i]?.label ?? `V${i + 1}`,
        value: `${fmt(v.x)} î  ${v.y < 0 ? '−' : '+'} ${fmt(Math.abs(v.y))} ĵ`,
        color: accentOf(specs[i]?.color),
      }));

      return {
        arrows,
        guides,
        resultant: r,
        readouts: [
          ...rows,
          { label: 'Σx', value: `${fmt(r.x)} ${units}`.trim(), color: ACCENT.emerald },
          { label: 'Σy', value: `${fmt(r.y)} ${units}`.trim(), color: ACCENT.emerald },
          { label: '|R|', value: `${fmt(magnitude(r))} ${units}`.trim(), color: ACCENT.emerald, strong: true },
          { label: 'Direction', value: `${fmt(angle360(r))}°`, color: ACCENT.emerald },
        ],
        formula: [
          `$ \\vec{R} = ${fmt(r.x)}\\hat{i} ${r.y < 0 ? '-' : '+'} ${fmt(Math.abs(r.y))}\\hat{j} $`,
          `$ |\\vec{R}| = \\sqrt{(${fmt(r.x)})^2 + (${fmt(r.y)})^2} = ${fmt(magnitude(r))} $`,
        ],
      };
    },
  },

  // 8 ── Polygon law & equilibrium — chain them; a closed polygon means ΣF = 0.
  'polygon-equilibrium': {
    label: 'Polygon Law / Equilibrium',
    hint: 'Chain the arrows tip-to-tail. When the polygon closes, the forces balance.',
    defaultVectors: [
      { label: 'F₁', mag: 5, angle: 0, color: 'indigo', draggable: true, tail: 'chain' },
      { label: 'F₂', mag: 5, angle: 120, color: 'amber', draggable: true, tail: 'chain' },
      { label: 'F₃', mag: 5, angle: 240, color: 'pink', draggable: true, tail: 'chain' },
    ],
    defaultShow: { angleArc: false },
    build: ({ vecs, specs, units, params, step, t }) => {
      const r = sumOf(vecs);
      const tol = num(params, 'balance_tolerance', 0.4);
      const balanced = magnitude(r) < tol;

      const arrows: DrawnArrow[] = [];
      let cursor: Vec2 = { x: 0, y: 0 };
      let shownAll = true;
      for (let i = 0; i < vecs.length; i++) {
        const p = reveal(step, i, t);
        if (p <= 0) { shownAll = false; break; }
        if (p < 1) shownAll = false;
        arrows.push({
          from: cursor,
          to: add(cursor, scaled(vecs[i], p)),
          color: accentOf(specs[i]?.color),
          label: p >= 1 ? specs[i]?.label : undefined,
          width: 4,
        });
        cursor = add(cursor, scaled(vecs[i], p));
      }
      if (!balanced && shownAll) {
        arrows.push({ from: cursor, to: { x: 0, y: 0 }, color: ACCENT.red, label: 'gap', labelAt: 'mid', width: 3, dashed: true, opacity: 0.9 });
      }

      return {
        arrows,
        resultant: r,
        balanced,
        readouts: [
          { label: 'Σx', value: `${fmt(r.x)} ${units}`.trim(), color: ACCENT.ghost },
          { label: 'Σy', value: `${fmt(r.y)} ${units}`.trim(), color: ACCENT.ghost },
          {
            label: 'Net force',
            value: balanced ? '0 — balanced ✓' : `${fmt(magnitude(r))} ${units}`.trim(),
            color: balanced ? ACCENT.emerald : ACCENT.red,
            strong: true,
          },
        ],
        formula: balanced
          ? ['$ \\Sigma\\vec{F} = 0 $', '$ \\text{the polygon closes} $']
          : [`$ \\Sigma\\vec{F} = ${fmt(r.x)}\\hat{i} ${r.y < 0 ? '-' : '+'} ${fmt(Math.abs(r.y))}\\hat{j} \\ne 0 $`],
      };
    },
  },

  // 9 ── Dot & cross (tier: competitive).
  'dot-cross': {
    label: 'Dot & Cross Products',
    hint: 'Drag either arrow — watch A·B pass through zero at 90° and turn negative.',
    defaultVectors: [
      { label: 'A', mag: 6, angle: 0, color: 'indigo', draggable: true },
      { label: 'B', mag: 5, angle: 55, color: 'amber', draggable: true },
    ],
    defaultShow: { angleArc: true },
    build: ({ vecs, specs, units, show }) => {
      const a = vecs[0] ?? { x: 0, y: 0 };
      const b = vecs[1] ?? { x: 0, y: 0 };
      const th = angleBetween(a, b);
      const d = dot(a, b);
      const cr = cross2(a, b);
      const projLen = magnitude(a) === 0 ? 0 : d / magnitude(a);
      const proj = fromPolar(projLen, angleDeg(a));

      return {
        arrows: [
          { from: { x: 0, y: 0 }, to: a, color: accentOf(specs[0]?.color), label: specs[0]?.label ?? 'A', width: 4.5 },
          { from: { x: 0, y: 0 }, to: b, color: accentOf(specs[1]?.color ?? 'amber'), label: specs[1]?.label ?? 'B', width: 4.5 },
          { from: { x: 0, y: 0 }, to: proj, color: ACCENT.emerald, label: 'B cos θ', width: 3.5 },
        ],
        guides: [{ from: b, to: proj, color: ACCENT.ghost }],
        arcs: show.angleArc ? [{ vertex: { x: 0, y: 0 }, fromDeg: angleDeg(a), toDeg: angleDeg(b), label: 'θ' }] : [],
        resultant: a,
        readouts: [
          { label: 'θ', value: `${fmt(th)}°`, color: ACCENT.ghost },
          { label: 'A · B', value: `${fmt(d)} ${units ? units + '²' : ''}`.trim(), color: d < 0 ? ACCENT.red : ACCENT.emerald, strong: true },
          { label: '|A × B|', value: `${fmt(Math.abs(cr))} ${units ? units + '²' : ''}`.trim(), color: ACCENT.violet },
          { label: 'A × B points', value: cr >= 0 ? 'out of the page (+k̂)' : 'into the page (−k̂)', color: ACCENT.violet },
        ],
        formula: [
          `$ \\vec{A}\\cdot\\vec{B} = AB\\cos\\theta = ${fmt(magnitude(a))} \\times ${fmt(magnitude(b))} \\times \\cos ${fmt(th)}° = ${fmt(d)} $`,
          `$ |\\vec{A}\\times\\vec{B}| = AB\\sin\\theta = ${fmt(Math.abs(cr))} $`,
        ],
      };
    },
  },
};

/** Catalogue for the admin picker — id + label + hint, no engine internals. */
export const ARCHETYPE_CATALOG = Object.entries(ARCHETYPES).map(([id, d]) => ({
  id,
  label: d.label,
  hint: d.hint,
  stepped: !!d.defaultSteps,
  stepCount: d.defaultSteps?.length ?? 0,
}));

/** Resolve an author's `vectors` (polar) into working Vec2 displacements. */
export function seedVectors(specs: VectorSpec[]): Vec2[] {
  return specs.map((s) => fromPolar(s.mag, s.angle));
}
