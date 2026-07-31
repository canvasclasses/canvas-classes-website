/*
 * motion-lab/graphs/lib/resolve.ts — authored JSON → flat numbers.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Everything the three benches draw is computed from
 * plain numbers resolved here, so the components stay layout-and-interaction
 * only and every physical claim stays checkable by a node script.
 *
 * Resolution order, same as `projectile/model.ts`:
 *      block.params[key]  →  archetype param default  →  hard default
 *
 * `MotionBenchBlock` has no `graphs` field (its typed sub-objects are
 * `projectile` and `circular`, and the block type is part of the frozen
 * contract), so every graphs setting travels in `params`. That is not a
 * workaround — `params` is exactly the generic bag the admin editor already
 * turns into form inputs from the archetype's own `params` metadata, which is
 * what makes a new exercise DATA rather than code.
 */

import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { GraphsArchetype, DriverAxis, RelativeScene } from '../types';
import { modelFromPhases, resampleModel, flatModel, type VtModel } from './kinematics';

type Bag = Record<string, number | string | boolean> | undefined;

const num = (bag: Bag, key: string, fallback: number): number =>
  bag && typeof bag[key] === 'number' && Number.isFinite(bag[key] as number) ? (bag[key] as number) : fallback;
const bool = (bag: Bag, key: string, fallback: boolean): boolean =>
  bag && typeof bag[key] === 'boolean' ? (bag[key] as boolean) : fallback;
const str = (bag: Bag, key: string, fallback: string): string =>
  bag && typeof bag[key] === 'string' ? (bag[key] as string) : fallback;

/** The archetype's `params` defaults, flattened into the same shape as `block.params`. */
function archDefaults(arch?: GraphsArchetype): Record<string, number | string | boolean> {
  const out: Record<string, number | string | boolean> = {};
  for (const p of arch?.params ?? []) out[p.key] = p.default;
  return out;
}

// ── Studio + Match ───────────────────────────────────────────────────────────

export interface StudioSetup {
  /** The authored motion — the target in Match mode, the starting point in Studio. */
  model: VtModel;
  /** Which graph the student drags. */
  driver: DriverAxis;
  /** True when the v panel is a freehand sketch surface rather than N nodes. */
  sketch: boolean;
  /** Handle count when sketching. */
  nodes: number;
  /** Show the live signed-area shading under v–t. */
  area: boolean;
  /** Show the tangent at the cursor on the x–t panel. */
  tangent: boolean;
  /** Show the chord between the two markers on the x–t panel. */
  chord: boolean;
  /** Show the running distance-vs-displacement ledger. */
  ledger: boolean;
  /** Show the uniform-acceleration algebra check. */
  equations: boolean;
  /** Match mode: which quantity is graded, and how close counts. */
  gradedOn: 'v' | 'x';
  tolerance: number;
  /** The two chord markers, as fractions of the run. */
  markA: number;
  markB: number;
  guided: boolean;
  steps: { say: string; cta: string }[];
  title: string;
}

export function resolveStudio(block: MotionBenchBlock, arch?: GraphsArchetype): StudioSetup {
  const p = { ...archDefaults(arch), ...(block.params ?? {}) };

  const authored = modelFromPhases(
    num(p, 'x0', 0),
    num(p, 'u', 0),
    [1, 2, 3].map((n) => ({
      a: num(p, `seg${n}_a`, 0),
      t: num(p, `seg${n}_t`, n === 1 ? 4 : 0),
    }))
  );

  const sketch = bool(p, 'sketch', false);
  const nodes = Math.round(num(p, 'nodes', 12));
  const model = sketch ? resampleModel(authored, nodes) : authored;

  const rawDriver = str(p, 'driver', 'v');
  const driver: DriverAxis = rawDriver === 'x' || rawDriver === 'a' ? rawDriver : 'v';

  return {
    model,
    driver,
    sketch,
    nodes,
    area: bool(p, 'area', true),
    tangent: bool(p, 'tangent', driver === 'x'),
    chord: bool(p, 'chord', false),
    ledger: bool(p, 'ledger', false),
    equations: bool(p, 'equations', false),
    gradedOn: str(p, 'graded_on', 'v') === 'x' ? 'x' : 'v',
    tolerance: num(p, 'tolerance', 1.5),
    markA: clamp01(num(p, 'mark_a', 0.2)),
    markB: clamp01(num(p, 'mark_b', 0.8)),
    guided: !!block.guided && (block.steps ?? arch?.defaultSteps ?? []).length > 0,
    steps: block.steps ?? arch?.defaultSteps ?? [],
    title: block.title ?? arch?.title ?? 'Motion graphs',
  };
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * The blank sheet a Match attempt starts from: the same time span and the same
 * handle count as the target, every velocity zero.
 *
 * Deliberately flat rather than pre-seeded with a nearly-right shape. The
 * Phase-1 audit's sharpest finding about defaults was that FBD Studio pre-draws
 * the WRONG version of the force students get wrong and the RIGHT version of the
 * one they get right, which manufactures both false positives and false
 * confidence. A flat line expresses no belief at all.
 */
export function blankAttempt(target: VtModel, nodes: number): VtModel {
  return flatModel(target.ts[0], target.ts[target.ts.length - 1], nodes, target.x0, 0);
}

// ── Relative deck ────────────────────────────────────────────────────────────

export interface RelativeSetup {
  scene: RelativeScene;
  width: number;
  current: number;
  boat: number;
  heading: number;
  rain: number;
  walk: number;
  wind: number;
  vA: number;
  vB: number;
  lenA: number;
  lenB: number;
  /** Show the v_A − v_B construction rather than only the result. */
  construction: boolean;
  guided: boolean;
  steps: { say: string; cta: string }[];
  title: string;
}

export function resolveRelative(block: MotionBenchBlock, arch?: GraphsArchetype): RelativeSetup {
  const p = { ...archDefaults(arch), ...(block.params ?? {}) };
  const raw = str(p, 'scene', 'river');
  const scene: RelativeScene =
    raw === 'rain' || raw === 'trains' || raw === 'frame-swap' ? raw : 'river';

  return {
    scene,
    width: num(p, 'width', 100),
    current: num(p, 'current', 3),
    boat: num(p, 'boat', 5),
    heading: num(p, 'heading', 0),
    rain: num(p, 'rain', 10),
    walk: num(p, 'walk', 5),
    wind: num(p, 'wind', 0),
    vA: num(p, 'v_a', 20),
    vB: num(p, 'v_b', 15),
    lenA: num(p, 'len_a', 120),
    lenB: num(p, 'len_b', 180),
    construction: bool(p, 'construction', true),
    guided: !!block.guided && (block.steps ?? arch?.defaultSteps ?? []).length > 0,
    steps: block.steps ?? arch?.defaultSteps ?? [],
    title: block.title ?? arch?.title ?? 'Relative motion',
  };
}

/**
 * A stable CONTENT key for a resolved setup.
 *
 * Used to re-seed the live controls when the AUTHORED values change — never the
 * block's object identity. The admin books-editor autosaves on a debounce and
 * recreates the block object on every keystroke; an identity-keyed effect would
 * reset the student's sketch mid-drag. This has already shipped as a bug once
 * (a memo keyed on block identity, found by browser QA on the Ch.0 build).
 */
export const studioKey = (s: StudioSetup): string =>
  [s.model.ts.join(','), s.model.vs.join(','), s.model.x0, s.driver, s.sketch, s.nodes,
   s.gradedOn, s.tolerance, s.markA, s.markB].join('|');

export const relativeKey = (s: RelativeSetup): string =>
  [s.scene, s.width, s.current, s.boat, s.heading, s.rain, s.walk, s.wind,
   s.vA, s.vB, s.lenA, s.lenB].join('|');
