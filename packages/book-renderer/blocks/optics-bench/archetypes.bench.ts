/*
 * optics-bench/archetypes.bench.ts — the Optical Bench library.
 * ─────────────────────────────────────────────────────────────────────────────
 * Ten constructions, all data. The engine ships once as code; every exercise on
 * every page is an `optics_bench` block naming one of these ids plus params, so
 * a new exercise costs a JSON block and no developer.
 *
 * Each archetype carries FOUR things the design laws ask for:
 *   • `params`      — the student sets the scene, so it is their problem (law 1)
 *   • `targets`     — the named misconception it attacks (law 2)
 *   • `probe`       — the question that FIRES that misconception's feedback,
 *                     asked after the step that puts the evidence on screen, and
 *                     locked until the student commits (law 2, delivered)
 *   • `defaultSteps`— a guided build-up; nothing is drawn before it is said (law 5)
 *
 * Pure — no React, no DOM. Every `build()` is total: bad params clamp, they
 * never throw.
 *
 * SIGN CONVENTION IN FORCE: NCERT Cartesian, light travels +x. The authoring
 * params are quoted the way a student says them out loud ("the object is 30 cm
 * in front of the lens", "a concave mirror of focal length 10 cm") and
 * `convention.ts` does the one conversion into signed Cartesian values.
 */

import type { Bench, OpticsArchetype, OpticsMisconception } from './types';
import { WHITE_SAMPLES } from './lib/spectral';

// ── The extension every archetype carries ────────────────────────────────────

/**
 * The question that makes a declared misconception real.
 *
 * Phase 1 shipped 22 misconception codes that no feedback path ever read — a
 * `targets` field is a promise, and this is how it gets kept. The probe is
 * asked AFTER the step that puts the contradicting evidence on screen, never
 * as a preamble, and the student's answer is locked in before anything is
 * revealed. Every wrong option names the specific belief it comes from.
 */
export interface MisconceptionProbe {
  /** Ask once the student has reached this guided step (0-based). */
  afterStep: number;
  prompt: string;
  options: string[];
  answerIndex: number;
  /** One reply per option. The wrong ones name the misconception. */
  perOption: string[];
  /** Shown after any answer — what is on screen that settles it. */
  reveal: string;
}

export interface OpticsArchetypeEx extends OpticsArchetype {
  probe?: MisconceptionProbe;
  /** Rays to trace by default. */
  rays?: number;
  /** Draw the classic three construction rays as well as the honest fan. */
  construction?: boolean;
  /** Let n depend on wavelength. Only dispersion needs it. */
  dispersion?: boolean;
  /** Extra note pinned under the readouts. */
  note?: string;
}

export type OpticsArchetypeMap = Record<string, OpticsArchetypeEx>;

// ── Param helpers ────────────────────────────────────────────────────────────

type P = Record<string, number | string | boolean> | undefined;
const num = (p: P, k: string, d: number): number => {
  const v = p?.[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
};
const str = (p: P, k: string, d: string): string => {
  const v = p?.[k];
  return typeof v === 'string' ? v : d;
};
const bool = (p: P, k: string, d: boolean): boolean => {
  const v = p?.[k];
  return typeof v === 'boolean' ? v : d;
};
/** Named media, so "put it under water" is one dropdown rather than a number
 *  nobody remembers. */
const MEDIA: Record<string, number> = { air: 1.0, water: 1.33, glycerine: 1.47, oil: 1.55 };
const mediumIndex = (name: string): number => MEDIA[name] ?? 1.0;

// ── 1. Converging lens ───────────────────────────────────────────────────────

const convergingLens: OpticsArchetypeEx = {
  id: 'converging-lens',
  title: 'Converging lens — the whole of ray optics in one picture',
  summary:
    'An object, a convex lens, and every ray it sends. Drag the object across the focus and watch the image walk out from infinity, shrink, invert and finally flip to the other side of the lens.',
  mode: 'bench',
  targets: 'rays_are_only_three' as OpticsMisconception,
  rays: 11,
  construction: true,
  params: [
    { key: 'f', label: 'Focal length', kind: 'number', default: 10, min: 4, max: 30, step: 0.5, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 30, min: 4, max: 70, step: 0.5, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 2, min: 0.5, max: 4, step: 0.1, unit: 'cm' },
    { key: 'aperture', label: 'Lens half-height', kind: 'number', default: 4, min: 1, max: 7, step: 0.25, unit: 'cm' },
    { key: 'glass', label: 'Lens model', kind: 'select', default: 'ideal', options: ['ideal', 'real glass'] },
  ],
  build(p): Bench {
    const f = num(p, 'f', 10);
    const u = Math.max(1, num(p, 'u', 30));
    const a = num(p, 'aperture', 4);
    const real = str(p, 'glass', 'ideal') === 'real glass';
    return {
      nMedium: 1,
      elements: [{
        id: 'L',
        kind: real ? 'thick-lens' : 'thin-lens',
        x: 0, focalLength: f, aperture: a, n: 1.5, label: 'Convex lens',
      }],
      sources: [{ id: 'S', x: -u, y: num(p, 'h', 2), kind: 'extended', rayCount: 11 }],
    };
  },
  defaultSteps: [
    { say: 'Here is the object and the lens. Nothing else — no rays yet, because the first question is not "where is the image" but "what light is there".', cta: 'Send out the light' },
    { say: 'Every point of the object throws light in EVERY direction. Only the cone that happens to hit the lens matters; the rest sails past and is lost. That cone is what you are looking at.', cta: 'Bend it at the lens' },
    { say: 'The lens takes that whole spreading cone and puts it back together at one point. Every ray in it — not three of them, all of them — arrives at the same place.', cta: 'Mark the image' },
    { say: 'Now the three rays a textbook draws are highlighted. Notice they are just three members of the fan. They are chosen because they are easy to draw, not because they are the only light.', cta: 'Change the lens' },
    { say: 'Switch the lens model to real glass and widen it. The outer rays now cross short of the others — real spheres do not focus perfectly, and the formula panel is a paraxial answer.', cta: 'Done' },
  ],
  probe: {
    afterStep: 3,
    prompt: 'The three construction rays are highlighted. If you erased them from the diagram and kept the rest of the fan, would the image still form?',
    options: [
      'No — those three rays are what makes the image',
      'Yes, and in exactly the same place',
      'Yes, but it would be somewhere slightly different',
      'Only if you draw at least one new ray to replace them',
    ],
    answerIndex: 1,
    perOption: [
      'That is the belief this whole picture is aimed at. The three rays are a DRAWING TRICK — they are picked because their paths are known without any arithmetic. The light does not know which three you chose.',
      'Exactly. They are three members of a fan of thousands, and the fan meets at one point with or without them.',
      'The whole fan already meets at ONE point — you can see it. Removing three members of a converging bundle does not move where the rest converge.',
      'You never needed to draw any rays at all. The lens was already bending every ray in the cone; drawing is how WE find the answer, not how light does it.',
    ],
    reveal:
      'Ray diagrams are bookkeeping. The three standard rays are chosen because you can predict them without calculating anything — parallel goes through F, through the centre goes straight, through F comes out parallel. Real light sends the entire cone, and every ray of it arrives at the same image point.',
  },
};

// ── 2. Diverging lens ────────────────────────────────────────────────────────

const divergingLens: OpticsArchetypeEx = {
  id: 'diverging-lens',
  title: 'Diverging lens — an image no screen can ever catch',
  summary:
    'A concave lens spreads every cone it receives. The rays leave still diverging, so they never meet: the image is where they only APPEAR to come from. Try to put a screen there and nothing lands.',
  mode: 'bench',
  targets: 'image_needs_screen' as OpticsMisconception,
  rays: 11,
  construction: true,
  params: [
    { key: 'f', label: 'Focal length', kind: 'number', default: 12, min: 4, max: 30, step: 0.5, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 24, min: 4, max: 70, step: 0.5, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 2.4, min: 0.5, max: 4, step: 0.1, unit: 'cm' },
    { key: 'aperture', label: 'Lens half-height', kind: 'number', default: 3.5, min: 1, max: 6, step: 0.25, unit: 'cm' },
  ],
  build(p): Bench {
    return {
      nMedium: 1,
      elements: [{
        id: 'L', kind: 'thin-lens', x: 0,
        focalLength: -Math.abs(num(p, 'f', 12)),
        aperture: num(p, 'aperture', 3.5), label: 'Concave lens',
      }],
      sources: [{ id: 'S', x: -Math.max(1, num(p, 'u', 24)), y: num(p, 'h', 2.4), kind: 'extended', rayCount: 11 }],
    };
  },
  defaultSteps: [
    { say: 'Same object, same distance — but this lens is thinner in the middle than at the edges. Watch what it does to a cone of light.', cta: 'Send the light' },
    { say: 'The rays leave MORE spread out than they arrived. They are diverging, so they will never cross. There is no point downstream where they meet.', cta: 'Extend them backwards' },
    { say: 'Now trace each emergent ray backwards — the dashed lines. THOSE meet, on the object\'s own side of the lens. Your eye, receiving this bundle, has no way to tell the light did not start there.', cta: 'Put a screen at the image' },
    { say: 'A screen at the image position catches nothing at all, because no light goes there. The image is real to your eye and absent from the screen. That is what "virtual" means.', cta: 'Done' },
  ],
  probe: {
    afterStep: 2,
    prompt: 'The dashed lines meet at a point 8 cm in front of the lens. If you hold a white card exactly there, what appears on it?',
    options: [
      'A sharp upright image',
      'A blurred version of the image',
      'Nothing — just the card, lit by whatever else is in the room',
      'An upside-down image',
    ],
    answerIndex: 2,
    perOption: [
      'Follow the solid rays: not one of them passes through that point. A card can only show light that lands on it, and none does.',
      'Blur happens when light lands in the wrong PLACE. Here no light lands there at all — there is nothing to be blurred.',
      'Right. The dashed lines are a construction, not light. They tell you where your eye thinks the light came from, which is a completely different claim from where the light went.',
      'Nothing lands there at all, so it cannot land upside down either. Check the solid rays — they all continue past on the far side.',
    ],
    reveal:
      'A virtual image is not a lesser image. Every mirror you have ever looked in gives one, and it looks perfect. What "virtual" means is precisely this: no light passes through the image point, so no screen can show it — but an eye, which works by receiving a diverging bundle and tracing it back, sees it perfectly well.',
  },
};

// ── 3. Object inside the focus ───────────────────────────────────────────────

const objectInsideFocus: OpticsArchetypeEx = {
  id: 'object-inside-focus',
  title: 'Object inside the focus — the magnifying glass',
  summary:
    'Bring the object closer than one focal length and the converging lens stops converging enough. The image flips to virtual, upright and enlarged — a real image that is not inverted, which breaks the rule most students think they learned.',
  mode: 'bench',
  targets: 'real_image_always_inverted_confusion' as OpticsMisconception,
  rays: 11,
  construction: true,
  params: [
    { key: 'f', label: 'Focal length', kind: 'number', default: 10, min: 4, max: 24, step: 0.5, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 5, min: 1, max: 24, step: 0.25, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 1.4, min: 0.4, max: 3, step: 0.1, unit: 'cm' },
    { key: 'aperture', label: 'Lens half-height', kind: 'number', default: 4, min: 1.5, max: 7, step: 0.25, unit: 'cm' },
  ],
  build(p): Bench {
    return {
      nMedium: 1,
      elements: [{
        id: 'L', kind: 'thin-lens', x: 0, focalLength: num(p, 'f', 10),
        aperture: num(p, 'aperture', 4), label: 'Convex lens',
      }],
      sources: [{ id: 'S', x: -Math.max(0.5, num(p, 'u', 5)), y: num(p, 'h', 1.4), kind: 'extended', rayCount: 11 }],
    };
  },
  defaultSteps: [
    { say: 'The object is now 5 cm from a 10 cm lens — INSIDE the focal length. Everything about the lens is unchanged; only the object moved.', cta: 'Send the light' },
    { say: 'The cone arriving at the lens is much wider than before, because the object is close. The lens bends every ray by the same rule as always.', cta: 'Follow them out' },
    { say: 'Bending them is not enough. They leave still spreading — just less than they arrived. No crossing point, so no real image.', cta: 'Trace them back' },
    { say: 'Backwards, the dashed lines meet far behind the object: a large, upright, virtual image. Same lens, same law, opposite kind of image — and the only thing that changed was where you put the object.', cta: 'Done' },
  ],
  probe: {
    afterStep: 3,
    prompt: 'This image is upright. Earlier, with the object at 30 cm, the same lens gave an inverted image. What decides which you get?',
    options: [
      'Whether the image is real or virtual',
      'The focal length of the lens',
      'How tall the object is',
      'Nothing decides it — it is a property of convex lenses',
    ],
    answerIndex: 0,
    perOption: [
      'Yes. A real image from a single lens is always inverted; a virtual one from a single lens is always upright. So "inverted" is not a rule you memorise separately — it comes free with real/virtual.',
      'The focal length is 10 cm in both cases. It did not change, and the image flipped anyway.',
      'Height only scales the image. Halve the object and you halve the image; you never turn it the right way up.',
      'It IS decided, and you have just watched it change with your own hands. Move the object across the focus and the image type flips with it.',
    ],
    reveal:
      'For one lens: object outside F → real and inverted; object inside F → virtual and upright. Students remember "real images are inverted" and then meet a mirror or a two-lens system and it stops working. The reliable version is the reasoning — do the emergent rays cross, or do they only appear to?',
  },
};

// ── 4. Concave mirror ────────────────────────────────────────────────────────

const concaveMirror: OpticsArchetypeEx = {
  id: 'concave-mirror',
  title: 'Concave mirror — where the sign convention comes from',
  summary:
    'A 10 cm concave mirror with the object at 30 cm. Every distance on the bench is measured and shown with its sign, so the minus signs in 1/v + 1/u = 1/f stop being a rule to memorise and become a description of which side things are on.',
  mode: 'bench',
  targets: 'sign_convention_dropped' as OpticsMisconception,
  rays: 9,
  construction: true,
  params: [
    { key: 'f', label: 'Mirror focal length', kind: 'number', default: 10, min: 4, max: 30, step: 0.5, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 30, min: 3, max: 70, step: 0.5, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 2.2, min: 0.5, max: 4, step: 0.1, unit: 'cm' },
    { key: 'aperture', label: 'Mirror half-height', kind: 'number', default: 4, min: 1, max: 8, step: 0.25, unit: 'cm' },
  ],
  build(p): Bench {
    return {
      nMedium: 1,
      elements: [{
        id: 'M', kind: 'mirror-spherical', x: 0,
        focalLength: Math.abs(num(p, 'f', 10)),   // converging-positive: a CONCAVE mirror
        aperture: num(p, 'aperture', 4), label: 'Concave mirror',
      }],
      sources: [{ id: 'S', x: -Math.max(1, num(p, 'u', 30)), y: num(p, 'h', 2.2), kind: 'extended', rayCount: 9 }],
    };
  },
  defaultSteps: [
    { say: 'Light travels left to right — that is the whole convention. Everything to the LEFT of the pole is a negative distance, everything to the right is positive. Nothing else to remember.', cta: 'Place the object' },
    { say: 'The object sits 30 cm to the left of the pole, so u = −30 cm. Not "30 cm, then add a minus later" — it is a position on a number line and its sign is where it is.', cta: 'Send the light' },
    { say: 'The mirror folds the light back. The reflected rays travel LEFTWARD now, and they cross in front of the mirror at −15 cm: real, inverted, half size.', cta: 'Read the signs' },
    { say: 'And the focal length: a concave mirror focuses light on the incoming side, so f = −10 cm in this convention even though the label on the box says 10 cm. That single conversion is the whole of the sign convention.', cta: 'Done' },
  ],
  probe: {
    afterStep: 2,
    prompt: 'The image forms 15 cm in FRONT of the mirror. What is v?',
    options: ['v = +15 cm', 'v = −15 cm', 'v = +30 cm', 'It has no sign — 15 cm is 15 cm'],
    answerIndex: 1,
    perOption: [
      'Positive means to the RIGHT of the pole, which is behind the mirror. This image is in front, on the same side as the object, so it is negative.',
      'Right. In front of the mirror is the negative side, because light comes from the left. And notice: for a MIRROR, negative v is the real image — the opposite of a lens, for the obvious reason that the light turned round.',
      '+30 is where the object is, mirrored across nothing. Read the position off the bench: the crossing is 15 cm from the pole.',
      'It has a sign the moment you choose a direction for light to travel — and you did, at the start. The sign is not decoration; it is what tells you which side.',
    ],
    reveal:
      'Substitute into 1/v + 1/u = 1/f with u = −30 and f = −10: 1/v = −1/10 + 1/30 = −2/30, so v = −15 cm. Every sign in that line is a position on the bench, not a rule. Drop one and you get +15 — an image behind the mirror that no light ever reaches.',
  },
};

// ── 5. Convex mirror ─────────────────────────────────────────────────────────

const convexMirror: OpticsArchetypeEx = {
  id: 'convex-mirror',
  title: 'Convex mirror — why every wing mirror is one',
  summary:
    'The bulging mirror on the driver\'s side. Wherever you put the object, the image is virtual, upright and smaller — and always between the pole and the focus, which is exactly why it can show you three lanes at once.',
  mode: 'bench',
  targets: 'image_needs_screen' as OpticsMisconception,
  rays: 9,
  construction: true,
  params: [
    { key: 'f', label: 'Mirror focal length', kind: 'number', default: 12, min: 4, max: 30, step: 0.5, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 25, min: 3, max: 70, step: 0.5, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 3, min: 0.5, max: 5, step: 0.1, unit: 'cm' },
    { key: 'aperture', label: 'Mirror half-height', kind: 'number', default: 4, min: 1, max: 8, step: 0.25, unit: 'cm' },
  ],
  build(p): Bench {
    return {
      nMedium: 1,
      elements: [{
        id: 'M', kind: 'mirror-spherical', x: 0,
        focalLength: -Math.abs(num(p, 'f', 12)),  // converging-positive ⇒ CONVEX is negative
        aperture: num(p, 'aperture', 4), label: 'Convex mirror',
      }],
      sources: [{ id: 'S', x: -Math.max(1, num(p, 'u', 25)), y: num(p, 'h', 3), kind: 'extended', rayCount: 9 }],
    };
  },
  defaultSteps: [
    { say: 'A convex mirror bulges toward you. Its centre of curvature is BEHIND it, so it spreads every bundle it reflects instead of gathering it.', cta: 'Send the light' },
    { say: 'The reflected rays travel back leftward, diverging. They never cross, so there is no real image anywhere in front of this mirror — and there never will be, for any object distance.', cta: 'Extend them back' },
    { say: 'Traced backwards, they meet BEHIND the mirror — a small upright virtual image, squeezed into the gap between the pole and the focus.', cta: 'Move the object' },
    { say: 'Drag the object as far away as you like. The image stays behind the mirror, stays upright, and never grows past the focus. Everything in a wide arc gets squeezed into that little window — which is why the wing mirror says "objects are closer than they appear".', cta: 'Done' },
  ],
  probe: {
    afterStep: 1,
    prompt: 'A driver wants to check the image in the wing mirror by holding a card behind the mirror where the image appears. What will they see on the card?',
    options: [
      'The image, upright and small',
      'Nothing — the card is behind the mirror, where no light goes',
      'The image, but reversed',
      'A blurred patch of light',
    ],
    answerIndex: 1,
    perOption: [
      'Follow the reflected rays: every one of them is travelling back towards the traffic. None goes through the mirror. There is no light behind it at all.',
      'Correct — and it is worth noticing this is true of EVERY mirror, including the one in your bathroom. Nothing you have ever seen in a mirror was light that got behind it.',
      'Reversed or not, no light reaches the card. The reflected bundle is entirely on the near side.',
      'A blur needs light in the wrong place. There is no light there to be blurred.',
    ],
    reveal:
      'Every plane and convex mirror gives only virtual images, and they are the images you have looked at your whole life. "Virtual" is not a warning that the image is poor — it is a statement about where the light went, and the answer is: not there.',
  },
};

// ── 6. Half the lens covered ─────────────────────────────────────────────────

const halfLensCovered: OpticsArchetypeEx = {
  id: 'half-lens-covered',
  title: 'Cover half the lens — the image does not halve',
  summary:
    'Slide a card up over the lens and watch what actually goes. The fan of rays thins, so the image dims — but every surviving ray still carries the WHOLE picture, so the image stays complete, the same size, in the same place.',
  mode: 'bench',
  targets: 'half_lens_half_image' as OpticsMisconception,
  rays: 15,
  params: [
    { key: 'f', label: 'Focal length', kind: 'number', default: 10, min: 4, max: 30, step: 0.5, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 30, min: 5, max: 70, step: 0.5, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 2.5, min: 0.5, max: 4, step: 0.1, unit: 'cm' },
    // Defaults to 0 on purpose. The misconception card that attacks
    // `half_lens_half_image` fires when the student MOVES this slider — not from
    // a default, and not from a timer. A declared target the sim announces by
    // itself teaches nobody anything.
    { key: 'cover', label: 'Cover the lens from below', kind: 'number', default: 0, min: 0, max: 90, step: 5, unit: '%' },
    { key: 'aperture', label: 'Lens half-height', kind: 'number', default: 4, min: 2, max: 7, step: 0.25, unit: 'cm' },
  ],
  build(p): Bench {
    const a = num(p, 'aperture', 4);
    const coverFrac = Math.min(0.9, Math.max(0, num(p, 'cover', 50) / 100));
    // The card blocks from the BOTTOM up. What is left is a clear window from
    // (−a + 2a·cover) to +a — modelled as an offset stop, which is exactly what
    // a hand held over a lens is. No special case anywhere in the engine.
    const lowEdge = -a + 2 * a * coverFrac;
    const clearHalf = Math.max(0.05, (a - lowEdge) / 2);
    const clearMid = (a + lowEdge) / 2;
    const elements: Bench['elements'] = [
      { id: 'L', kind: 'thin-lens', x: 0, focalLength: num(p, 'f', 10), aperture: a, label: 'Convex lens' },
    ];
    if (coverFrac > 0.001) {
      elements.push({
        id: 'CARD', kind: 'aperture', x: -0.35, y: clearMid, aperture: clearHalf, label: 'Card',
      });
    }
    return {
      nMedium: 1,
      elements,
      sources: [{ id: 'S', x: -Math.max(1, num(p, 'u', 30)), y: num(p, 'h', 2.5), kind: 'extended', rayCount: 15 }],
    };
  },
  defaultSteps: [
    { say: 'A convex lens making a normal real image. Fifteen rays, all of them crossing at one point. Note where the image is and how big it is.', cta: 'Bring up the card' },
    { say: 'Now slide the card up over the bottom of the lens. Watch the rays, not the image — half of them are stopped dead at the card and never reach the glass.', cta: 'Look at the image' },
    { say: 'The image has not moved and has not changed size. It is DIMMER, because fewer rays arrive — and that is the only thing that changed.', cta: 'Cover more' },
    { say: 'Cover 90% and it still holds. As long as ONE ray from each point of the object gets through, that point still has an image. Brightness is about how many rays; completeness is about whether any got through at all.', cta: 'Done' },
  ],
  probe: {
    afterStep: 1,
    prompt: 'Slide the card up until the bottom half of the lens is covered. Before you look at the image — commit: what will have happened to it?',
    options: [
      'The bottom half of the image has gone',
      'The top half of the image has gone',
      'The image is complete but dimmer',
      'The image is complete and half the size',
    ],
    answerIndex: 2,
    perOption: [
      'This is the classic one, and the ray diagram is the reason it is wrong. Follow ANY single point of the object: it sends a whole cone at the lens, and every ray in that cone lands at the same image point. Block half the cone and the point is still imaged — by the other half.',
      'Same mistake, other way up. There is no part of the lens that "belongs to" a part of the image. Every point of the object uses the WHOLE lens.',
      'Exactly. Half the rays, so half the light, so a dimmer picture — and not one piece of it missing.',
      'Size is set by where the rays cross, and that is decided by the focal length and the object distance. Neither of those changed when you put a card in front of the glass.',
    ],
    reveal:
      'The lens is not a window you look through — it is a collector. Every point of the object sends a cone to the ENTIRE lens, and the lens sends all of it back to one point. So covering part of the lens removes rays from every cone equally: the whole image dims, and nothing is lost. This is also why a large telescope mirror with a hole in the middle still gives a complete picture.',
  },
};

// ── 7. Refraction through a slab ─────────────────────────────────────────────

const refractionSlab: OpticsArchetypeEx = {
  id: 'refraction-slab',
  title: 'Glass slab — bent twice, and back where it started',
  summary:
    'A ray through a parallel-sided block bends at the first face and bends back by exactly the same amount at the second, so it emerges PARALLEL to where it began — just shifted sideways. Then drop the block into water and watch the whole effect nearly vanish.',
  mode: 'bench',
  targets: 'focal_length_fixed_in_water' as OpticsMisconception,
  rays: 1,
  params: [
    { key: 'i', label: 'Angle of incidence', kind: 'number', default: 45, min: 5, max: 85, step: 1, unit: '°' },
    { key: 'n', label: 'Glass index', kind: 'number', default: 1.5, min: 1.1, max: 2.4, step: 0.01 },
    { key: 'thickness', label: 'Slab thickness', kind: 'number', default: 6, min: 1, max: 14, step: 0.5, unit: 'cm' },
    { key: 'medium', label: 'Surrounded by', kind: 'select', default: 'air', options: ['air', 'water', 'glycerine', 'oil'] },
  ],
  build(p): Bench {
    const t = num(p, 'thickness', 6);
    const i = num(p, 'i', 45);
    return {
      nMedium: mediumIndex(str(p, 'medium', 'air')),
      elements: [{
        id: 'G', kind: 'slab', x: 0, y: 0,
        radius: t,            // for a flat body, `radius` carries the LENGTH
        aperture: 7, n: num(p, 'n', 1.5), tiltDeg: 90, label: 'Glass slab',
      }],
      // A single ray, aimed at the slab face at the requested incidence. The
      // slab is turned 90° so its long faces face the incoming light.
      sources: [{ id: 'S', x: -16, y: 0, kind: 'parallel-beam', beamAngleDeg: -(90 - i), rayCount: 1 }],
    };
  },
  defaultSteps: [
    { say: 'One ray, one glass block. Before anything happens: the ray is about to cross from air into glass, and glass is optically denser.', cta: 'Cross the first face' },
    { say: 'It bends TOWARDS the normal — sin i = n sin r, so r is smaller than i. Inside the glass the ray is running steeper than it was.', cta: 'Cross the second face' },
    { say: 'At the far face it goes glass → air, so it bends AWAY from the normal by exactly the same angle it gained. The emergent ray is parallel to the incident one. It was never permanently deflected — only displaced.', cta: 'Change the surroundings' },
    { say: 'Now change what surrounds the block. In water the two indices are much closer, so the bending at each face collapses and the shift shrinks. The glass never changed — only what it is compared against.', cta: 'Done' },
  ],
  probe: {
    afterStep: 2,
    prompt: 'The same glass block, same ray, but the whole bench is now under water. What happens to the sideways shift?',
    options: [
      'Unchanged — the glass has not changed',
      'Much smaller',
      'Much larger',
      'It disappears completely',
    ],
    answerIndex: 1,
    perOption: [
      'The glass has not changed, but bending never depended on glass alone — it depends on the RATIO of the two indices. Against air the ratio is 1.5; against water it is 1.5/1.33 = 1.13, so there is far less to bend.',
      'Right. n is always a comparison, never a property of one substance on its own. That is also the answer to "does a lens still work under water" — yes, but much more weakly.',
      'Larger would need a bigger index CONTRAST, and water raises the outside index towards the glass, which shrinks the contrast.',
      'Only if the water had exactly the same index as the glass — which is the trick used to make glass rods "vanish" in a beaker of oil.',
    ],
    reveal:
      'Refractive index is a comparison, so every refraction result depends on both media. A crown-glass lens of f = 10 cm in air becomes roughly f = 39 cm in water — same lens, same curvature, four times weaker — because 1/f carries the factor (n_glass/n_medium − 1), and that factor drops from 0.50 to 0.13.',
  },
};

// ── 8. Total internal reflection ─────────────────────────────────────────────

const totalInternalReflection: OpticsArchetypeEx = {
  id: 'total-internal-reflection',
  title: 'Total internal reflection — find the critical angle yourself',
  summary:
    'Sweep the angle inside the glass and watch the refracted ray flatten out, dim, and at 41.8° vanish completely. Past that, one hundred per cent of the light turns round. Then try it the other way — from air into glass — and discover it cannot happen at all.',
  mode: 'bench',
  targets: 'tir_without_denser_medium' as OpticsMisconception,
  rays: 1,
  params: [
    { key: 'angle', label: 'Angle inside the glass', kind: 'number', default: 45, min: 5, max: 88, step: 0.5, unit: '°' },
    { key: 'n', label: 'Glass index', kind: 'number', default: 1.5, min: 1.05, max: 2.4, step: 0.01 },
    { key: 'medium', label: 'Outside the glass', kind: 'select', default: 'air', options: ['air', 'water', 'glycerine', 'oil'] },
    { key: 'length', label: 'Block length', kind: 'number', default: 26, min: 10, max: 50, step: 1, unit: 'cm' },
  ],
  build(p): Bench {
    const angle = Math.min(88, Math.max(1, num(p, 'angle', 45)));
    const L = num(p, 'length', 26);
    // The ray enters the END face along the normal (no bending there), so the
    // angle it then makes with the TOP wall is exactly the angle the student
    // set — the quantity the critical angle is about, with nothing in between.
    return {
      nMedium: mediumIndex(str(p, 'medium', 'air')),
      elements: [{
        id: 'G', kind: 'slab', x: L / 2 - 2, y: -3.2,
        radius: L, aperture: 3.4, n: num(p, 'n', 1.5), label: 'Glass block',
      }],
      sources: [{ id: 'S', x: -6, y: -6.4, kind: 'parallel-beam', beamAngleDeg: 90 - angle, rayCount: 1 }],
    };
  },
  defaultSteps: [
    { say: 'A ray already inside the glass, heading up at the top surface. Everything here is about ONE angle: the one between that ray and the normal to the surface.', cta: 'Let it out' },
    { say: 'Below the critical angle, most of the light refracts out and bends AWAY from the normal, because it is going from dense to rare. A weak reflection also comes back — there always is one.', cta: 'Raise the angle' },
    { say: 'Push the angle up. The refracted ray swings flatter and flatter, hugging the surface, until at 41.8° it lies exactly along it. sin r has reached 1 and cannot go further.', cta: 'Go past it' },
    { say: 'One step past and Snell\'s law has no solution at all. There is no refracted ray — not a dim one, none. Every photon turns round. That is total internal reflection, and it needs no coating, no mirror, nothing but the two indices.', cta: 'Try it backwards' },
  ],
  probe: {
    afterStep: 3,
    prompt: 'Now send the ray the other way — from AIR into the glass, at 80°, almost along the surface. Does it total-internally reflect?',
    options: [
      'Yes, 80° is well past the critical angle',
      'No — going into the denser medium, there is always a refracted ray',
      'Only if the glass has a high enough index',
      'Yes, but only some of the light',
    ],
    answerIndex: 1,
    perOption: [
      'The critical angle only exists on the DENSE side. Coming from air, sin r = sin(80°)/1.5 = 0.66, which is a perfectly ordinary angle of 41°. Snell always has a solution going in.',
      'Correct, and it is worth seeing why: going rare → dense, sin r = sin i / n is always smaller than sin i, so it can never reach 1. TIR is not about steep angles; it is about which side of the boundary you started on.',
      'No index helps. A bigger n makes sin r SMALLER, which is further from the impossible case, not closer.',
      'Partial reflection happens at every boundary at every angle — but that is a few per cent, not "total". Total means Snell has no solution, and going into glass it always has one.',
    ],
    reveal:
      'θc = sin⁻¹(n₂/n₁) only has a value when n₁ > n₂ — light must be trying to LEAVE the denser medium. That is why you see the silver sheen looking up from underwater and never looking down at it, and why a diamond (n = 2.42, θc = 24°) traps light so well that almost nothing gets out except through the top.',
  },
};

// ── 9. Optical fibre ─────────────────────────────────────────────────────────

const opticalFibre: OpticsArchetypeEx = {
  id: 'optical-fibre',
  title: 'Optical fibre — the same 41.8°, thousands of times a second',
  summary:
    'A long thin block of the same glass. Light launched into the end face strikes the walls far past the critical angle, so it cannot escape — it bounces the whole length and comes out the far end. Nothing new: one boundary condition, applied over and over.',
  mode: 'bench',
  targets: 'tir_without_denser_medium' as OpticsMisconception,
  rays: 5,
  params: [
    { key: 'nCore', label: 'Core index', kind: 'number', default: 1.5, min: 1.05, max: 2.4, step: 0.01 },
    { key: 'cladding', label: 'Cladding', kind: 'select', default: 'air', options: ['air', 'water', 'glycerine', 'oil'] },
    { key: 'length', label: 'Fibre length', kind: 'number', default: 55, min: 20, max: 90, step: 5, unit: 'cm' },
    { key: 'coreRadius', label: 'Core half-width', kind: 'number', default: 1.1, min: 0.4, max: 3, step: 0.1, unit: 'cm' },
    { key: 'spread', label: 'Launch spread', kind: 'number', default: 5, min: 1, max: 9, step: 2, unit: 'rays' },
  ],
  build(p): Bench {
    const L = num(p, 'length', 55);
    const r = num(p, 'coreRadius', 1.1);
    return {
      nMedium: mediumIndex(str(p, 'cladding', 'air')),
      elements: [{
        id: 'F', kind: 'slab', x: L / 2, y: 0,
        radius: L, aperture: r, n: num(p, 'nCore', 1.5), label: 'Fibre core',
      }],
      sources: [{ id: 'S', x: -3.4, y: 0, kind: 'point', rayCount: Math.round(num(p, 'spread', 5)) }],
    };
  },
  defaultSteps: [
    { say: 'A very long, very thin block of ordinary glass. A point source sits just off the end face, throwing light into it at a spread of angles.', cta: 'Launch the light' },
    { say: 'The rays refract in at the end face, then run into the SIDE wall — and they meet it at a very shallow angle to the wall, which is a very STEEP angle to its normal. Far past 41.8°.', cta: 'Watch them bounce' },
    { say: 'So none of them get out. Each one reflects, crosses the core, hits the other wall at the same steep angle, and reflects again. The light is trapped in a pipe made of nothing but a change of index.', cta: 'Change the cladding' },
    { say: 'Now surround the core with something denser. The critical angle rises, the shallowest rays start leaking out through the walls, and the fibre begins to lose the signal — which is exactly the engineering problem real fibres are built around.', cta: 'Done' },
  ],
  probe: {
    afterStep: 2,
    prompt: 'This fibre works because of total internal reflection at the walls. What would happen if you polished the outside of the core and silvered it like a mirror instead?',
    options: [
      'The same — a mirror reflects too',
      'Better — mirrors are perfect reflectors',
      'Worse — a metal mirror absorbs a few per cent at every bounce, and there are thousands of bounces',
      'Nothing would change; the glass does the work either way',
    ],
    answerIndex: 2,
    perOption: [
      'A good mirror reflects about 95–98%. Total internal reflection reflects 100.000%, because there is no transmitted ray for the energy to go into. Over one bounce the difference is invisible; over ten thousand it is everything.',
      'This is the appealing wrong answer. No mirror is perfect — 0.98 to the power of 10 000 is effectively zero. TIR is not "very good reflection", it is the total absence of an alternative.',
      'Exactly. 0.98¹⁰⁰⁰⁰ ≈ 10⁻⁸⁸. TIR loses nothing at the boundary at all, which is the only reason a signal survives a hundred kilometres of glass.',
      'The glass alone does nothing — a bare glass rod in a fluid of the SAME index leaks straight out of the sides. It is the index step at the wall that traps the light.',
    ],
    reveal:
      'Total internal reflection is not a strong reflection. It is the case where Snell\'s law has no transmitted solution, so 100% of the energy must come back. That is why fibre optics is possible at all: a signal can survive tens of thousands of bounces, which no mirror on earth would let it do.',
  },
};

// ── 10. Prism dispersion ─────────────────────────────────────────────────────

const prismDispersion: OpticsArchetypeEx = {
  id: 'prism-dispersion',
  title: 'Prism — the one number that was never one number',
  summary:
    'A single white ray enters a 60° prism and seven come out. The prism adds nothing: it separates what was already there, because n is not 1.5 — it is 1.512 for violet and 1.497 for red, and that 1% is every rainbow you have ever seen.',
  mode: 'bench',
  targets: 'focal_length_fixed_in_water' as OpticsMisconception,
  rays: 1,
  dispersion: true,
  params: [
    { key: 'apex', label: 'Apex angle', kind: 'number', default: 60, min: 20, max: 75, step: 1, unit: '°' },
    { key: 'n', label: 'Index at 589 nm', kind: 'number', default: 1.5, min: 1.2, max: 1.9, step: 0.01 },
    { key: 'beam', label: 'Beam angle', kind: 'number', default: 18.6, min: -5, max: 45, step: 0.2, unit: '°' },
    { key: 'colours', label: 'Wavelengths traced', kind: 'number', default: 7, min: 1, max: 7, step: 1 },
    { key: 'size', label: 'Prism half-height', kind: 'number', default: 3, min: 1.5, max: 5, step: 0.25, unit: 'cm' },
  ],
  build(p): Bench {
    const beam = num(p, 'beam', 18.6);
    const count = Math.max(1, Math.min(7, Math.round(num(p, 'colours', 7))));
    const lambdas = count === 1 ? [589.3] : WHITE_SAMPLES.slice(0, count);
    return {
      nMedium: 1,
      elements: [{
        id: 'P', kind: 'prism', x: 0, y: 0,
        aperture: num(p, 'size', 3), apexDeg: num(p, 'apex', 60),
        n: num(p, 'n', 1.5), label: 'Prism',
      }],
      // One source per wavelength: same position, same direction, different
      // colour. The trace does the rest — the index it uses is a function of λ.
      sources: lambdas.map((w, i) => ({
        id: `S${i}`, x: -20, y: 0, kind: 'parallel-beam' as const,
        beamAngleDeg: beam, rayCount: 1, wavelength: w,
      })),
    };
  },
  defaultSteps: [
    { say: 'One ray of white light, one glass prism. Set the beam angle to about 18.6° and the ray will pass through at minimum deviation — running parallel to the base inside the glass.', cta: 'Enter the prism' },
    { say: 'It bends towards the normal going in, exactly as it did at the slab. Nothing new so far.', cta: 'Leave the prism' },
    { say: 'But the second face is NOT parallel to the first, so the second bend does not undo the first — it adds to it. The ray is permanently deviated, by 37.2° at this setting.', cta: 'Show the colours' },
    { say: 'Now trace all seven wavelengths. They were always in that one white ray; the prism simply gives each a slightly different n, so each is deviated by a slightly different angle and they fan apart.', cta: 'Done' },
  ],
  probe: {
    afterStep: 2,
    prompt: 'Everything so far used n = 1.5. Which ray does the prism bend the most?',
    options: [
      'They all bend equally — n = 1.5 for all of them',
      'The red one',
      'The violet one',
      'Whichever is brightest',
    ],
    answerIndex: 2,
    perOption: [
      'This is the assumption worth breaking. "n = 1.5" is shorthand for "n at 589 nm". Measure it at 400 nm and you get 1.512; at 700 nm, 1.497. One number was always an average.',
      'Red has the LOWEST index in glass, so it bends least — which is why it sits at the top of the emerging fan and at the outer edge of a rainbow.',
      'Right. Higher n means more bending, and violet sees the highest index. The whole spread here is about 1% in n and it produces a visible spectrum.',
      'Brightness is how much energy is in a ray. Bending depends on its wavelength, and the two are unrelated.',
    ],
    reveal:
      'n depends on wavelength — that is dispersion, and it is why "the refractive index of glass" is always quoted at a stated wavelength (589.3 nm, the sodium D line). The variation is tiny, about 1% across the visible range, and it is enough for a rainbow, for the coloured fringes in a cheap telescope, and for the entire field of spectroscopy.',
  },
};

export const BENCH_ARCHETYPES: OpticsArchetypeMap = {
  [convergingLens.id]: convergingLens,
  [divergingLens.id]: divergingLens,
  [objectInsideFocus.id]: objectInsideFocus,
  [concaveMirror.id]: concaveMirror,
  [convexMirror.id]: convexMirror,
  [halfLensCovered.id]: halfLensCovered,
  [refractionSlab.id]: refractionSlab,
  [totalInternalReflection.id]: totalInternalReflection,
  [opticalFibre.id]: opticalFibre,
  [prismDispersion.id]: prismDispersion,
};

export const BENCH_ARCHETYPE_ORDER = [
  'converging-lens', 'diverging-lens', 'object-inside-focus',
  'concave-mirror', 'convex-mirror', 'half-lens-covered',
  'refraction-slab', 'total-internal-reflection', 'optical-fibre', 'prism-dispersion',
];
