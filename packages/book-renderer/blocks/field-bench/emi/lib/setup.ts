/*
 * field-bench/emi/lib/setup.ts — params bag → typed physics inputs. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable.
 *
 * ── WHY THIS FILE IS THE ONE THAT MATTERS FOR CORRECTNESS ───────────────────
 * `FieldArchetype.build()` returns a `FieldScene` — sources and surfaces, i.e.
 * a DRAWING. The EMI physics needs a band, a loop, a rod, a plate, a coil and a
 * current programme, none of which a FieldScene can hold.
 *
 * The tempting shortcut is for `build()` to make the drawing and the component
 * to read the same numbers again out of `block.params`. That is two readers of
 * one bag, which is how a canvas ends up drawing a 0.15 m band while the readout
 * quotes a 0.20 m one. So there is exactly ONE reader: `emiSetup`. `build()`
 * calls it and derives the scene FROM it, and the component calls it and derives
 * the readouts from it. A drift between picture and number is therefore not a
 * bug that can be introduced; it is a bug that cannot be expressed.
 *
 * ── HOW THE EXISTING FieldScene FIELDS ARE USED ─────────────────────────────
 * Nothing is added to the frozen `FieldScene` contract. Two existing fields are
 * read for their natural meaning:
 *
 *   • the field region is a `uniform-B` source whose `length` is the band's
 *     x-extent. `magneticOf` treats `uniform-B` as unbounded (correctly — that
 *     is what the kind means), so the BAND is EmiBench's own reading of
 *     `length`, and the sim never asks the engine to sample it.
 *   • the loop / rod circuit / plate is a `rectangle` GaussSurface. A closed
 *     rectangle is exactly what a loop is, `size` is exactly its width and
 *     height, and `FieldBenchBlock.allow_drag_surface` already means "let the
 *     student drag this" — which is the primary gesture of the Flux Machine.
 *
 * Both are documented at the point of use so a reader of `archetypes.emi.ts`
 * does not have to guess.
 */

import type { FieldScene, FieldSource, GaussSurface } from '../../types';
import { num, str, type ParamBag } from '../../lib/params';
import type { FieldBand, GeneratorSpec, LoopSpec } from './loop';
import type { RodSpec } from './motional';
import { RESISTIVITY, type PlateMaterial, type PlateSpec } from './eddy';
import type { CoilSpec, RampSpec } from './inductance';

/** Which sub-view of the EMI bench an archetype is about. */
export type EmiView = 'flux' | 'motional' | 'eddy' | 'inductance' | 'generator';

export interface EmiSetup {
  view: EmiView;
  /** The bounded uniform field region. */
  band: FieldBand;
  loop: LoopSpec;
  /** m — where the loop starts, and how far it may be dragged. */
  loopStartX: number;
  travel: { min: number; max: number };
  /** Degrees between the loop's normal and B. Only the tilt archetype moves it. */
  tiltDeg: number;
  rod: RodSpec;
  plate: PlateSpec;
  coil: CoilSpec;
  secondaryTurns: number;
  coupling: number;
  ramp: RampSpec;
  generator: GeneratorSpec;
  /** m/s — the speed the "slide it at a steady speed" control uses. */
  speed: number;
  gravity: number;
}

const MATERIALS: PlateMaterial[] = ['copper', 'aluminium', 'stainless'];

const materialOf = (p: ParamBag): PlateMaterial => {
  const s = str(p, 'material', 'aluminium');
  return (MATERIALS as string[]).includes(s) ? (s as PlateMaterial) : 'aluminium';
};

/**
 * Every number an EMI archetype can be tuned by, with the defaults chosen so
 * that the readouts land in ranges a student can hold in their head:
 *
 *   flux machine   B 1.2 T, loop 15 cm × 10 cm, R 0.20 Ω, v 0.50 m/s
 *                  → emf 60 mV, I 300 mA, F 36 mN, P 18 mW
 *   rod on rails   B 0.8 T, ℓ 25 cm, R 0.50 Ω, v 2.0 m/s
 *                  → emf 400 mV, I 800 mA, F 160 mN, P 320 mW
 *   eddy plate     B 0.6 T, 10 cm tall, 2 mm aluminium
 *                  → terminal speed about 3.5 cm/s solid, 14 cm/s with 4 slots
 *   coil           800 turns, 8 cm², 15 cm long → L 4.29 mH
 *
 * None of those is a coincidence; each was picked so the SI-prefix formatter
 * prints two or three significant figures without a prefix change mid-slider.
 */
export function emiSetup(view: EmiView, p?: ParamBag): EmiSetup {
  const halfBand = num(p, 'band_width', 0.30) / 2;
  const B = num(p, 'B', 1.2);

  const loopW = num(p, 'loop_w', 0.15);
  const loopH = num(p, 'loop_h', 0.10);

  const plateH = num(p, 'plate_h', 0.10);

  return {
    view,
    band: { x0: -halfBand, x1: halfBand, B },
    loop: {
      w: loopW,
      h: loopH,
      turns: Math.max(1, Math.round(num(p, 'turns', 1))),
      resistance: Math.max(0.01, num(p, 'R', 0.20)),
    },
    loopStartX: num(p, 'loop_x', -halfBand - loopW * 0.9),
    travel: {
      min: -halfBand - loopW * 1.4,
      max: halfBand + loopW * 1.4,
    },
    tiltDeg: num(p, 'tilt', 0),

    rod: {
      length: num(p, 'rail_gap', 0.25),
      B: num(p, 'B', 0.8),
      resistance: Math.max(0.01, num(p, 'R', 0.5)),
      mass: Math.max(1e-4, num(p, 'mass', 0.05)),
    },

    plate: {
      height: plateH,
      width: num(p, 'plate_w', 0.12),
      thickness: Math.max(1e-4, num(p, 'thickness', 0.002)),
      resistivity: RESISTIVITY[materialOf(p)],
      mass: Math.max(1e-4, num(p, 'mass', 0.06)),
      slots: Math.max(1, Math.round(num(p, 'slots', 1))),
    },

    coil: {
      turns: Math.max(1, Math.round(num(p, 'N1', 800))),
      area: num(p, 'area', 8e-4),
      length: Math.max(0.01, num(p, 'coil_len', 0.15)),
    },
    secondaryTurns: Math.max(1, Math.round(num(p, 'N2', 1600))),
    coupling: Math.min(1, Math.max(0, num(p, 'k', 1))),
    ramp: {
      peak: num(p, 'peak', 2),
      rampUp: Math.max(0.002, num(p, 'ramp_up', 0.02)),
      hold: Math.max(0, num(p, 'hold', 0.03)),
      rampDown: Math.max(0.002, num(p, 'ramp_down', 0.02)),
    },

    generator: {
      B: num(p, 'B', 0.5),
      area: num(p, 'gen_area', 0.02),
      turns: Math.max(1, Math.round(num(p, 'gen_turns', 50))),
      omega: 2 * Math.PI * num(p, 'gen_freq', 5),
      resistance: Math.max(0.01, num(p, 'R', 10)),
    },

    speed: num(p, 'v', view === 'motional' ? 2 : 0.5),
    gravity: num(p, 'g', 9.8),
  };
}

// ── The drawable scene, derived from the setup ────────────────────────────────

/** The band, as a `uniform-B` source carrying its x-extent in `length`. */
export function bandSource(s: EmiSetup): FieldSource {
  return {
    id: 'band',
    kind: 'uniform-B',
    pos: { x: (s.band.x0 + s.band.x1) / 2, y: 0 },
    strength: s.band.B,
    // Read by EmiBench as the band's x-extent — see the header. `uniform-B`
    // itself is unbounded, which is why the sim never samples it here.
    length: s.band.x1 - s.band.x0,
    label: 'uniform field, out of the page',
    fixed: true,
  };
}

/** The loop / rod circuit / plate, as a rectangle surface. */
export function circuitSurface(s: EmiSetup): GaussSurface {
  if (s.view === 'motional') {
    return {
      id: 'circuit',
      shape: 'rectangle',
      centre: { x: 0, y: 0 },
      size: { w: s.band.x1 - s.band.x0, h: s.rod.length },
      label: 'rod, rails and resistor',
    };
  }
  if (s.view === 'eddy') {
    return {
      id: 'plate',
      shape: 'rectangle',
      centre: { x: s.loopStartX, y: 0 },
      size: { w: s.plate.width, h: s.plate.height },
      label: 'conducting plate',
    };
  }
  return {
    id: 'loop',
    shape: 'rectangle',
    centre: { x: s.loopStartX, y: 0 },
    size: { w: s.loop.w, h: s.loop.h },
    label: 'the loop',
  };
}

/**
 * The FieldScene an EMI archetype hands back.
 *
 * `inductance` has no field region to draw — its physics is a current slope and
 * a coil, not a field in the plane — so it returns the coil's own interior field
 * as a single `uniform-B` and no surface. The component knows not to draw a band
 * for that view; nothing samples the source.
 */
export function buildEmiScene(s: EmiSetup): FieldScene {
  if (s.view === 'inductance') {
    return {
      kind: 'magnetic',
      sources: [{
        id: 'coil',
        kind: 'uniform-B',
        pos: { x: 0, y: 0 },
        strength: s.band.B,
        length: s.coil.length,
        label: 'field inside the coil',
        fixed: true,
      }],
    };
  }
  return {
    kind: 'magnetic',
    sources: [bandSource(s)],
    surfaces: [circuitSurface(s)],
  };
}
