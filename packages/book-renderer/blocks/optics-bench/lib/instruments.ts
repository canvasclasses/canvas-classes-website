/*
 * optics-bench/lib/instruments.ts — THE INSTRUMENT ASSEMBLER's brain.
 * ─────────────────────────────────────────────────────────────────────────────
 * "You have just built a camera" only lands if the sim WORKED IT OUT. So there
 * is no flag anywhere that says which instrument is on the bench: recognition
 * reads the primitives and their arrangement, every time, from scratch.
 *
 *      lens                                    → a bare lens
 *      lens + a stop                           → the aperture, brightness, depth of field
 *      lens + stop + a screen at the image     → A CAMERA
 *      swap the screen for a retina welded on  → AN EYE      (the weld is the difference:
 *                                                 a camera focuses by moving the film,
 *                                                 an eyeball cannot, so its lens must change)
 *      make the eyeball too long               → MYOPIA      (the image lands short of the retina)
 *      add a diverging lens in front           → SPECTACLES
 *      two lenses, short objective, near object → A MICROSCOPE
 *      two lenses, long objective, far object   → A TELESCOPE
 *      + two prisms between them                → BINOCULARS
 *
 * Every one of those lines is a predicate below, and every predicate is about
 * geometry — which primitives, how far apart, which way round. Nothing is
 * declared. That is the point.
 *
 * Pure. No React, no DOM.
 *
 * SIGN CONVENTION IN FORCE: Cartesian. `f` on a Primitive is the CARTESIAN
 * focal length (converging lens > 0); `fAuthored` is the converging-positive
 * field the author typed. See convention.ts.
 */

import type {
  AssemblyState, Bench, ElementKind, InstrumentId, OpticalElement,
} from '../types';
import { cartesianFocal, isLens, isPowered, NEAR_POINT_CM } from './convention';
import { thinLensImage } from './formula';

export interface Primitive {
  id: string;
  kind: ElementKind;
  x: number;
  y: number;
  /** Cartesian focal length, cm. null when the element has no power. */
  f: number | null;
  /** The converging-positive value the author typed. */
  fAuthored: number | null;
  aperture: number;
  /** Eye only: the fixed lens→retina distance. THIS is what makes it an eye. */
  axial?: number;
  label?: string;
}

export interface BenchStructure {
  all: Primitive[];
  lenses: Primitive[];
  converging: Primitive[];
  diverging: Primitive[];
  mirrors: Primitive[];
  concaveMirrors: Primitive[];
  stops: Primitive[];
  screens: Primitive[];
  prisms: Primitive[];
  slabs: Primitive[];
  eyes: Primitive[];
  /** The object, and whether it is effectively at infinity. */
  object: { x: number; y: number; atInfinity: boolean } | null;
  /** First powered element the light meets. */
  firstPowered: Primitive | null;
}

/** Ratio of |u| to f beyond which an object counts as "far away" — i.e. the
 *  regime a telescope is for. Ten focal lengths puts the image within 11% of
 *  the focal plane, which is where a telescope objective actually works. */
const FAR_FACTOR = 10;

export function structureOf(bench: Bench): BenchStructure {
  const all: Primitive[] = bench.elements
    .slice()
    .sort((a, b) => a.x - b.x)
    .map((el) => ({
      id: el.id,
      kind: el.kind,
      x: el.x,
      y: el.y ?? 0,
      f: cartesianFocal(el),
      fAuthored: el.focalLength ?? null,
      aperture: el.aperture ?? 3,
      axial: el.kind === 'eye' ? (el.radius && el.radius > 0 ? el.radius : 2.5) : undefined,
      label: el.label,
    }));

  const lenses = all.filter((p) => isLens(p.kind));
  const mirrors = all.filter((p) => p.kind === 'mirror-spherical' || p.kind === 'mirror-plane');
  const src = bench.sources[0];
  const firstPowered = all.find((p) => isPowered(p.kind)) ?? null;

  const object = src
    ? {
        x: src.x,
        y: src.y ?? 0,
        atInfinity:
          src.kind === 'parallel-beam'
          || (firstPowered?.f != null
            && Math.abs(src.x - firstPowered.x) > FAR_FACTOR * Math.abs(firstPowered.f)),
      }
    : null;

  return {
    all,
    lenses,
    converging: lenses.filter((p) => (p.f ?? 0) > 0),
    diverging: lenses.filter((p) => (p.f ?? 0) < 0),
    mirrors,
    concaveMirrors: mirrors.filter((p) => p.kind === 'mirror-spherical' && (p.fAuthored ?? 0) > 0),
    stops: all.filter((p) => p.kind === 'aperture'),
    screens: all.filter((p) => p.kind === 'screen'),
    prisms: all.filter((p) => p.kind === 'prism'),
    slabs: all.filter((p) => p.kind === 'slab'),
    eyes: all.filter((p) => p.kind === 'eye'),
    object,
    firstPowered,
  };
}

/** The frozen `AssemblyState`, plus what the UI needs to explain itself. */
export interface OpticsAssembly extends AssemblyState {
  structure: BenchStructure;
  /** The structural facts that fired, in the order they were checked. This is
   *  what turns "you built a camera" into "you built a camera BECAUSE …". */
  evidence: string[];
  /** Not every next move is "add a primitive" — sometimes it is "make this one
   *  longer". The contract's `nextStep` can only express an addition, so the
   *  non-additive moves live here. */
  nextTransform?: { change: string; becomes: InstrumentId; because: string };
}

export function recognise(bench: Bench): OpticsAssembly {
  const s = structureOf(bench);
  const ev: string[] = [];
  const base = { bench, structure: s, evidence: ev };

  const sep = (a: Primitive, b: Primitive) => Math.abs(b.x - a.x);
  const uOf = (p: Primitive) => (s.object ? s.object.x - p.x : -Infinity);

  // ── 1. Binoculars: a telescope with the light path folded ──────────────────
  if (s.converging.length >= 2 && s.prisms.length >= 2) {
    const first = s.converging[0];
    const last = s.converging[s.converging.length - 1];
    const between = s.prisms.filter((p) => p.x > first.x && p.x < last.x);
    if (between.length >= 2) {
      ev.push(`Two converging lenses with ${between.length} prisms between them.`);
      ev.push('Each prism turns the light through a right angle by total internal reflection, so the light path folds and the tube gets short and fat without losing any magnification.');
      // The erecting is deliberately NOT claimed here. Two reflections that
      // return a beam to its original direction compose to a rotation by 0° in
      // the plane of the fold — a pure translation, with no transverse flip. The
      // trace confirms it: the folded bench reports the same NEGATIVE angular
      // magnification as the straight telescope. Real Porro prisms erect because
      // the second pair folds in the PERPENDICULAR plane, which is out of the
      // plane of a 2-D bench. Saying otherwise would be a claim the picture
      // contradicts.
      ev.push('The image is still inverted: erecting it needs a second fold in the perpendicular plane, which is why a real Porro assembly is a pair of prisms at right angles.');
      return { ...base, recognised: 'binoculars' };
    }
  }

  // ── 2. Reflecting telescope: a big mirror doing the objective's job ────────
  if (s.concaveMirrors.length >= 1 && s.converging.length >= 1) {
    const mirror = s.concaveMirrors[0];
    if (s.firstPowered?.id === mirror.id || mirror.aperture >= s.converging[0].aperture) {
      ev.push('A concave mirror collects the light, and a converging lens looks at the image it makes.');
      ev.push('A mirror can be made far bigger than a lens — nothing has to pass through it.');
      return {
        ...base,
        recognised: 'telescope-reflecting',
        nextStep: {
          add: 'mirror-plane',
          becomes: 'telescope-reflecting',
          because: 'A flat mirror at 45° kicks the image out of the tube so your head is not blocking the light you came to collect. That is a Newtonian.',
        },
      };
    }
  }

  // ── 3. Two lenses and nothing to catch the image on ────────────────────────
  if (s.converging.length >= 2 && s.screens.length === 0 && s.eyes.length === 0) {
    const [obj, eye] = [s.converging[0], s.converging[s.converging.length - 1]];
    const fo = obj.f ?? 1;
    const fe = eye.f ?? 1;
    const d = sep(obj, eye);
    const u = uOf(obj);
    const far = s.object?.atInfinity ?? false;

    // The structural fork is the OBJECT, not a setting: a telescope looks at
    // something effectively at infinity through a long objective; a microscope
    // looks at something sitting just outside a very short objective's focus.
    if (far || (fo > fe && Math.abs(u) > FAR_FACTOR * fo)) {
      ev.push(`Objective f = ${fo.toFixed(1)} cm, eyepiece f = ${fe.toFixed(1)} cm — the objective is the long one.`);
      ev.push(`The object is effectively at infinity, so its image lands in the objective's focal plane.`);
      ev.push(`Separation ${d.toFixed(1)} cm ≈ f₀ + f_e = ${(fo + fe).toFixed(1)} cm: normal adjustment, final image at infinity.`);
      return {
        ...base,
        recognised: 'telescope-refracting',
        nextStep: {
          add: 'prism',
          becomes: 'binoculars',
          because: 'Two prisms fold the light back on itself and erect the image at the same time. The tube collapses to a third of its length and the view stops being upside down — that is the whole reason binoculars are short and fat.',
        },
      };
    }

    ev.push(`Objective f = ${fo.toFixed(1)} cm is the SHORT lens, and the object sits just outside its focus (u = ${u.toFixed(1)} cm).`);
    ev.push('So the objective makes a real, magnified image inside the tube — and the eyepiece then magnifies THAT.');
    ev.push('The two magnifications multiply. That is why a microscope reaches ×400 with two ordinary lenses.');
    return {
      ...base,
      recognised: 'microscope',
      nextTransform: {
        change: 'Make the objective long-focal and wide, and move the object to infinity',
        becomes: 'telescope-refracting',
        because: 'Nothing else changes. Same two lenses, same intermediate image, same eyepiece — only the objective\'s focal length and how far away the object is. A telescope IS a microscope pointed at something a long way off.',
      },
    };
  }

  // ── 4. The eye family. The `eye` primitive is a lens WELDED to a screen ────
  if (s.eyes.length >= 1) {
    const eye = s.eyes[0];
    const fEye = eye.f ?? 2.5;
    const axial = eye.axial ?? 2.5;
    const front = s.lenses.filter((p) => p.x < eye.x);

    if (front.length >= 1) {
      const spec = front[front.length - 1];
      const kindWord = (spec.f ?? 0) < 0 ? 'diverging' : 'converging';
      ev.push(`An eye with a ${kindWord} lens in front of it.`);
      ev.push(
        (spec.f ?? 0) < 0
          ? 'The diverging lens spreads the light first, so the eye\'s own lens has less work to do and the image lands back ON the retina. That is a pair of spectacles, and you just designed it.'
          : 'The converging lens does part of the bending in advance, moving the image forward onto the retina — the correction for a long-sighted eye.',
      );
      return {
        ...base,
        recognised: 'eye-corrected',
        nextTransform: {
          change: 'Sweep the spectacle power and watch the image walk across the retina',
          becomes: 'eye-corrected',
          because: 'There is exactly one power that lands it. Too weak and the image is still short; too strong and it overshoots behind the retina. That single value is the prescription.',
        },
      };
    }

    if (axial > fEye * 1.02) {
      ev.push(`The eyeball is ${axial.toFixed(2)} cm long but its lens focuses at ${fEye.toFixed(2)} cm.`);
      ev.push('Light from far away therefore comes to a point IN FRONT of the retina, and spreads again before it gets there. Distant things are blurred; near things are fine. That is myopia — and it is a length problem, not a lens problem.');
      return {
        ...base,
        recognised: 'eye-myopic',
        nextStep: {
          add: 'thin-lens',
          becomes: 'eye-corrected',
          because: 'The image is landing short. Put a DIVERGING lens in front: it spreads the light before the eye gets it, so the eye\'s focus point moves back — right onto the retina. Spectacles, invented from the geometry.',
        },
      };
    }

    ev.push(`A lens and a retina, ${axial.toFixed(2)} cm apart and rigidly attached.`);
    ev.push('That weld is the whole difference from a camera: the film cannot move, so focusing has to change the LENS instead. Your eye does it with muscle — accommodation.');
    return {
      ...base,
      recognised: 'eye',
      nextTransform: {
        change: 'Lengthen the eyeball past the focal length',
        becomes: 'eye-myopic',
        because: 'Grow the eye a couple of millimetres too long and distant objects focus before the retina. That is short sight, and it is why it usually appears during a growth spurt.',
      },
    };
  }

  // ── 5. One lens and something to catch the image on ────────────────────────
  if (s.converging.length === 1 && s.screens.length >= 1) {
    const lens = s.converging[0];
    const u = uOf(lens);
    const img = thinLensImage(u, lens.f ?? 10);
    const m = img.m ?? 0;
    const screen = s.screens[0];
    const focusError = img.v === null ? null : lens.x + img.v - screen.x;
    const stop = s.stops.find((p) => Math.abs(p.x - lens.x) < Math.max(2, lens.aperture));

    if (Math.abs(m) > 1) {
      ev.push(`|m| = ${Math.abs(m).toFixed(2)} — the image on the screen is BIGGER than the object.`);
      ev.push('Object close to the lens, screen far away: that is a projector, which is a camera run backwards.');
      return { ...base, recognised: 'projector' };
    }

    ev.push(`A converging lens, and a screen ${Math.abs(screen.x - lens.x).toFixed(1)} cm behind it.`);
    ev.push(`The image was already there in mid-air at v = ${img.v?.toFixed(1) ?? '∞'} cm. The screen does not make it — it catches it.`);
    if (focusError !== null) {
      ev.push(
        Math.abs(focusError) < 0.3
          ? 'The screen is exactly at the image: in focus.'
          : `The screen is ${Math.abs(focusError).toFixed(1)} cm ${focusError > 0 ? 'in front of' : 'behind'} the image — out of focus. Move the sensor, not the lens.`,
      );
    }
    if (stop) {
      ev.push(`The stop lets a ${(2 * stop.aperture).toFixed(1)} cm cone through: f/${(Math.abs(lens.f ?? 1) / (2 * stop.aperture)).toFixed(1)}. Narrower means dimmer, and a thicker slab of the world in focus at once.`);
    }
    return {
      ...base,
      recognised: 'camera',
      nextStep: stop
        ? {
            add: 'eye',
            becomes: 'eye',
            because: 'Now weld the sensor to the lens at a fixed distance and you have an eyeball. Focusing can no longer move the film — so the lens itself has to change shape. That is accommodation, and it is why your eyes get tired reading.',
          }
        : {
            add: 'aperture',
            becomes: 'camera',
            because: 'Add a stop in front of the lens. Less light gets through so the picture is dimmer — but the cone is narrower, so a much thicker slab of the world is sharp at once. That trade IS the f-number.',
          },
    };
  }

  // ── 6. Pinhole: no lens at all, and it still makes a picture ───────────────
  if (s.lenses.length === 0 && s.mirrors.length === 0 && s.screens.length >= 1 && s.stops.length >= 1) {
    const hole = s.stops[0];
    ev.push(`A ${(2 * hole.aperture).toFixed(2)} cm hole and a screen — no lens anywhere.`);
    ev.push('Each point of the object can only send ONE narrow pencil through the hole, so it lands in one place. That is all an image is.');
    return {
      ...base,
      recognised: 'pinhole',
      nextStep: {
        add: 'thin-lens',
        becomes: 'camera',
        because: 'A pinhole is sharp but starving — it throws away almost all the light. A lens gathers a whole cone and bends every ray of it back to the same point: bright AND sharp, which the hole could never be at once.',
      },
    };
  }

  // ── 7. One lens, nothing to catch the image ───────────────────────────────
  if (s.converging.length === 1 && s.screens.length === 0) {
    const lens = s.converging[0];
    const u = uOf(lens);
    const f = lens.f ?? 10;
    const far = s.object?.atInfinity ?? false;
    // A magnifier needs a NEAR object inside the focus. A telescope objective
    // also has one converging lens and nothing to catch the image on, and it is
    // not a magnifying glass — the object being at infinity is the difference.
    if (!far && Number.isFinite(u) && Math.abs(u) < f) {
      ev.push(`The object is ${Math.abs(u).toFixed(1)} cm away and the focal length is ${f.toFixed(1)} cm — the object is INSIDE the focus.`);
      ev.push('So the rays never converge. They leave still spreading, and your eye traces them back to a large, upright, virtual image behind the lens.');
      ev.push(`Held at the eye, it magnifies ×${(NEAR_POINT_CM / f).toFixed(1)}. A magnifying glass is a lens used deliberately wrong.`);
      return {
        ...base,
        recognised: 'magnifier',
        nextStep: {
          add: 'thin-lens',
          becomes: 'microscope',
          because: 'Add a second lens and hand it the FIRST lens\'s image as its object. The magnifications do not add — they multiply. ×5 then ×5 is ×25, and that is a compound microscope.',
        },
      };
    }
    // One converging lens and a real image in the air. WHICH instrument it is
    // about to become depends on where the object is — which is structure, not
    // a setting, so the suggestion is derived rather than authored.
    ev.push('One lens, an object, and nothing else — the whole of geometrical optics starts here.');
    if (far) {
      ev.push('The object is effectively at infinity, so the image lands in the focal plane. That is a telescope objective waiting for an eyepiece.');
      return {
        ...base,
        recognised: 'bare-lens',
        nextStep: {
          add: 'thin-lens',
          becomes: 'telescope-refracting',
          because: 'The image of the star is sitting in the focal plane, tiny and real. Put a short lens one focal length beyond it and look THROUGH that at the image — the angle it subtends grows by f₀/f_e.',
        },
      };
    }
    if (f <= 6 && Math.abs(u) < 4 * f) {
      ev.push(`A short ${f.toFixed(1)} cm lens with the object close to its focus — that is a microscope objective, and its image is real and enlarged.`);
      return {
        ...base,
        recognised: 'bare-lens',
        nextStep: {
          add: 'thin-lens',
          becomes: 'microscope',
          because: 'The first lens has already made a real image four times the size of the specimen. Add a second lens that treats THAT as its object, and the two magnifications multiply.',
        },
      };
    }
    const img = thinLensImage(u, f);
    ev.push(
      img.v != null
        ? `The rays cross at ${img.v.toFixed(1)} cm on the far side and carry on past: a real, inverted image ${Math.abs(img.m ?? 0).toFixed(2)}× the object, hanging in mid-air with nothing holding it.`
        : 'The object sits exactly at the focus, so the rays leave parallel and there is no image at any finite distance.',
    );
    return {
      ...base,
      recognised: 'bare-lens',
      nextStep: {
        add: 'screen',
        becomes: 'camera',
        because: 'The image is already there, hanging in mid-air where the rays cross. Put a sensor exactly at it and you have caught it. That is all a camera is — a lens, and something at the image.',
      },
    };
  }

  if (s.lenses.length === 1) {
    ev.push('A single diverging lens. It has a focus, but the rays never reach it — they only ever look as if they came from it.');
    return {
      ...base,
      recognised: 'bare-lens',
      nextStep: {
        add: 'thin-lens',
        becomes: 'camera',
        because: 'A diverging lens alone can never put an image on a screen. Add a converging lens and the pair can — which is exactly what a spectacle lens does in front of an eye.',
      },
    };
  }

  if (s.concaveMirrors.length >= 1) {
    ev.push('A concave mirror on its own — it images by folding the light back rather than passing it through.');
    return {
      ...base,
      recognised: null,
      nextStep: {
        add: 'thin-lens',
        becomes: 'telescope-reflecting',
        because: 'Put a small lens where the mirror\'s image forms and use it as an eyepiece. That is a reflecting telescope — and because nothing has to pass through a mirror, it can be built metres across.',
      },
    };
  }

  ev.push('Nothing recognisable yet — add a lens and an object to start.');
  return { ...base, recognised: null };
}

/**
 * The primitives the assembler palette offers, in the order the §6 arc uses
 * them. Kept here rather than in the UI so the arc and the recogniser cannot
 * drift apart.
 */
export const ASSEMBLER_PALETTE: { kind: ElementKind; label: string; blurb: string }[] = [
  { kind: 'thin-lens', label: 'Lens', blurb: 'Bends every ray from one point back to one point.' },
  { kind: 'aperture', label: 'Stop', blurb: 'Chooses how much of the lens gets used.' },
  { kind: 'screen', label: 'Sensor', blurb: 'Catches the image. Can be moved to focus.' },
  { kind: 'eye', label: 'Eyeball', blurb: 'A lens welded to a retina. The retina cannot move.' },
  { kind: 'prism', label: 'Prism', blurb: 'Folds the path and flips the image.' },
  { kind: 'mirror-spherical', label: 'Curved mirror', blurb: 'Collects light without passing it through glass.' },
];

/** The §6 arc, as data — used by the assembler for its progress rail. */
export const ASSEMBLY_ARC: { id: InstrumentId; label: string; oneLine: string }[] = [
  { id: 'bare-lens', label: 'Bare lens', oneLine: 'An image, hanging in mid-air.' },
  { id: 'camera', label: 'Camera', oneLine: 'A sensor put exactly where the image already was.' },
  { id: 'eye', label: 'Eye', oneLine: 'The sensor welded on — so the lens has to change instead.' },
  { id: 'eye-myopic', label: 'Myopia', oneLine: 'The eyeball grew too long. The image lands short.' },
  { id: 'eye-corrected', label: 'Spectacles', oneLine: 'A diverging lens pushes the image back onto the retina.' },
  { id: 'microscope', label: 'Microscope', oneLine: 'Image 1 becomes object 2. The magnifications multiply.' },
  { id: 'telescope-refracting', label: 'Telescope', oneLine: 'The same pair, aimed at infinity, with a long objective.' },
  { id: 'binoculars', label: 'Binoculars', oneLine: 'Two prisms fold the tube and erect the image.' },
];

/** A fresh element of the given kind, positioned after everything already on
 *  the bench. Used by the assembler's palette buttons. */
export function makeElement(kind: ElementKind, bench: Bench, id: string): OpticalElement {
  const rightmost = bench.elements.reduce((m, e) => Math.max(m, e.x), bench.sources[0]?.x ?? 0);
  const x = rightmost + 12;
  switch (kind) {
    case 'thin-lens': return { id, kind, x, focalLength: 8, aperture: 3, label: 'Lens' };
    case 'aperture': return { id, kind, x, aperture: 1.2, label: 'Stop' };
    case 'screen': return { id, kind, x, aperture: 4, label: 'Sensor' };
    case 'eye': return { id, kind, x, focalLength: 2.5, radius: 2.5, aperture: 1.2, label: 'Eye' };
    case 'prism': return { id, kind, x, aperture: 1.6, apexDeg: 90, n: 1.5, tiltDeg: 45, label: 'Prism' };
    case 'mirror-spherical': return { id, kind, x, focalLength: 20, aperture: 5, label: 'Mirror' };
    default: return { id, kind, x, aperture: 3 };
  }
}
