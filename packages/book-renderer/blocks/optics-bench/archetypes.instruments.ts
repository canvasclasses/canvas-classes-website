/*
 * optics-bench/archetypes.instruments.ts — THE INSTRUMENT ASSEMBLER (§6).
 * ─────────────────────────────────────────────────────────────────────────────
 * The centrepiece. Five archetypes, one continuous argument:
 *
 *      lens + object                    → an image, hanging in mid-air
 *      + a stop                         → brightness and depth of field
 *      + a sensor at the image          → A CAMERA
 *      sensor welded on at fixed length → AN EYE
 *      eyeball grown too long           → MYOPIA
 *      + a diverging lens in front      → SPECTACLES, invented by the student
 *      + a second lens (image 1 = object 2) → A MICROSCOPE
 *      first lens long-focal and wide   → A TELESCOPE
 *      + two prisms                     → BINOCULARS (erect, and short)
 *
 * Each archetype's `build()` returns the STARTING bench of its rung, not the
 * finished instrument. The student adds the next primitive from the palette,
 * and `lib/instruments.ts` then RECOGNISES what they made by reading the
 * structure. Nothing anywhere sets a flag saying "this is a camera" — which is
 * the entire reason the moment lands.
 *
 * Pure — no React, no DOM. Every `build()` is total.
 *
 * SIGN CONVENTION IN FORCE: NCERT Cartesian, light travels +x.
 */

import type { Bench, OpticalElement, OpticsMisconception } from './types';
import type { OpticsArchetypeEx, OpticsArchetypeMap } from './archetypes.bench';
import { NEAR_POINT_CM } from './lib/convention';

type P = Record<string, number | string | boolean> | undefined;
const num = (p: P, k: string, d: number): number => {
  const v = p?.[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
};
const str = (p: P, k: string, d: string): string => {
  const v = p?.[k];
  return typeof v === 'string' ? v : d;
};

// ── 11. Camera ───────────────────────────────────────────────────────────────

const camera: OpticsArchetypeEx = {
  id: 'camera',
  title: 'Camera — a lens, and something put where the image already was',
  summary:
    'Start with nothing but a lens and an object. The image is already there, hanging in the air where the rays cross. Add a sensor at exactly that place and you have built a camera; add a stop and you have built the aperture, with brightness traded against depth of field.',
  mode: 'assembler',
  targets: 'image_needs_screen' as OpticsMisconception,
  rays: 13,
  params: [
    { key: 'f', label: 'Focal length', kind: 'number', default: 8, min: 3, max: 20, step: 0.5, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 40, min: 12, max: 90, step: 1, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 3, min: 0.5, max: 6, step: 0.25, unit: 'cm' },
    { key: 'stop', label: 'Aperture radius', kind: 'number', default: 1.5, min: 0.2, max: 3, step: 0.1, unit: 'cm' },
    { key: 'sensorOffset', label: 'Sensor off the image plane', kind: 'number', default: 0, min: -4, max: 4, step: 0.1, unit: 'cm' },
    { key: 'start', label: 'Start from', kind: 'select', default: 'bare lens', options: ['bare lens', 'with sensor', 'complete camera'] },
  ],
  build(p): Bench {
    const f = num(p, 'f', 8);
    const u = Math.max(f * 1.2, num(p, 'u', 40));
    const stop = num(p, 'stop', 1.5);
    const start = str(p, 'start', 'bare lens');
    // Where the image actually is — 1/v − 1/u = 1/f with u negative.
    const v = 1 / (1 / f - 1 / u);
    const elements: OpticalElement[] = [
      { id: 'L', kind: 'thin-lens', x: 0, focalLength: f, aperture: 3, label: 'Lens' },
    ];
    if (start === 'complete camera') {
      elements.push({ id: 'STOP', kind: 'aperture', x: -1, aperture: stop, label: 'Aperture stop' });
    }
    if (start !== 'bare lens') {
      elements.push({
        id: 'SENSOR', kind: 'screen', x: v + num(p, 'sensorOffset', 0), aperture: 3.4, label: 'Sensor',
      });
    }
    return {
      nMedium: 1,
      elements,
      sources: [{ id: 'S', x: -u, y: num(p, 'h', 3), kind: 'extended', rayCount: 13 }],
    };
  },
  defaultSteps: [
    { say: 'A lens and an object. That is the whole apparatus. The rays cross somewhere on the right, and where they cross there is an image — real, inverted, and floating in mid-air with nothing holding it.', cta: 'Add a sensor' },
    { say: 'Put a sensor exactly at the crossing point. It does not CREATE the image; it intercepts it. The lens had already done all the work before the sensor existed.', cta: 'Move it off' },
    { say: 'Slide the sensor away from that plane. Each object point now spreads into a disc instead of landing on a point — that is what "out of focus" is, and it is why a camera focuses by moving the sensor, not by changing the lens.', cta: 'Add the stop' },
    { say: 'Now put a stop in front. Fewer rays get through, so the picture is dimmer — but the cone is narrower, so a much thicker slab of the world lands within an acceptable blur. Dimmer for deeper: that trade IS the f-number.', cta: 'Done' },
  ],
  probe: {
    afterStep: 0,
    prompt: 'Before you add anything: right now, with just a lens and an object, is there an image?',
    options: [
      'No — there is nothing there for an image to form on',
      'Yes, at the crossing point, whether or not anything is there to catch it',
      'Only if you look through the lens',
      'Only once you put a screen there',
    ],
    answerIndex: 1,
    perOption: [
      'Look at the rays. They converge at a point and then carry on past it, diverging again. An image is a place where light from one object point arrives at one place — and that is happening already, in empty air.',
      'Exactly, and it is worth pausing on. A real image is a property of the LIGHT, not of the screen. Hold a lens up to a window and the image of the window is out there in the room right now; a piece of paper simply lets you see it.',
      'Looking is how YOU detect it. The rays cross whether anyone is watching or not.',
      'A screen makes it VISIBLE by scattering the light towards your eye. The rays were already crossing at that exact place before the screen arrived, and they still would if you took it away.',
    ],
    reveal:
      'This is the whole idea a camera is built on. A lens makes a real image in mid-air; a camera is a box that holds a sensor at exactly that place and keeps stray light out. Everything else — shutter, aperture, focus ring — is control over how much light and where the image plane sits.',
  },
};

// ── 12. Eye and spectacles ───────────────────────────────────────────────────

const eyeAndSpectacles: OpticsArchetypeEx = {
  id: 'eye-and-spectacles',
  title: 'Eye → myopia → spectacles, in three moves',
  summary:
    'The camera again, with one change: the sensor is welded to the lens and cannot move. So focusing has to change the lens instead. Then grow the eyeball two millimetres too long, watch distant objects blur, and work out the lens that fixes it — which is a prescription.',
  mode: 'assembler',
  targets: 'sign_convention_dropped' as OpticsMisconception,
  rays: 11,
  params: [
    { key: 'eyeFocal', label: 'Eye lens focal length', kind: 'number', default: 2.5, min: 1.8, max: 3.2, step: 0.05, unit: 'cm' },
    { key: 'eyeLength', label: 'Eyeball length', kind: 'number', default: 2.5, min: 2.0, max: 3.4, step: 0.05, unit: 'cm' },
    { key: 'spectacle', label: 'Spectacle power', kind: 'number', default: 0, min: -6, max: 6, step: 0.25, unit: 'D' },
    { key: 'object', label: 'Looking at', kind: 'select', default: 'a distant object', options: ['a distant object', 'a page at 25 cm'] },
    { key: 'pupil', label: 'Pupil radius', kind: 'number', default: 0.4, min: 0.15, max: 0.7, step: 0.05, unit: 'cm' },
  ],
  build(p): Bench {
    const fEye = num(p, 'eyeFocal', 2.5);
    const axial = num(p, 'eyeLength', 2.5);
    const power = num(p, 'spectacle', 0);
    const pupil = num(p, 'pupil', 0.4);
    const distant = str(p, 'object', 'a distant object') === 'a distant object';

    const elements: OpticalElement[] = [];
    if (Math.abs(power) > 0.01) {
      // P in dioptres → f in cm. A MINUS power is a diverging lens: the whole
      // content of a short-sight prescription is that sign.
      //
      // Its CLEAR aperture is set just inside the pupil on purpose. A real
      // spectacle lens is far bigger than a pupil, but the incoming bundle is
      // aimed across the first powered element, so a big spectacle would launch
      // a beam most of which the iris then throws away — a correctly focusing
      // eye drawn with two rays reaching it. What is drawn here is the bundle
      // that actually gets in, which is the bundle that forms the image.
      elements.push({
        id: 'SPEC', kind: 'thin-lens', x: -2, focalLength: 100 / power,
        aperture: pupil * 0.9, label: 'Spectacle lens',
      });
    }
    elements.push({
      id: 'EYE', kind: 'eye', x: 0, focalLength: fEye, radius: axial,
      aperture: pupil, label: 'Eye',
    });
    return {
      nMedium: 1,
      elements,
      sources: distant
        ? [{ id: 'S', x: -9, y: 0.9, kind: 'parallel-beam', beamAngleDeg: -2.2, rayCount: 11 }]
        : [{ id: 'S', x: -NEAR_POINT_CM, y: 1.2, kind: 'extended', rayCount: 11 }],
    };
  },
  defaultSteps: [
    { say: 'An eye: a lens with a screen welded 2.5 cm behind it. The weld is the whole difference from a camera — the retina cannot move, so focusing must change the LENS. That is accommodation, and it is a muscle.', cta: 'Look at something far' },
    { say: 'Light from far away arrives parallel. A relaxed 2.5 cm eye brings it to a point at exactly 2.5 cm — right on the retina. Sharp, with no effort at all.', cta: 'Grow the eyeball' },
    { say: 'Now drag the eyeball length up to about 2.9 cm. The lens has not changed. But the light still focuses at 2.5 cm, so it comes to a point in FRONT of the retina and has started spreading again by the time it lands. Distant things blur. That is myopia — a length problem, not a lens problem.', cta: 'Fix it' },
    { say: 'Add a lens in front. Which kind? The image is landing SHORT, so the light needs to be less converged when it reaches the eye — spread it first, with a diverging lens. Sweep the power until the image lands back on the retina.', cta: 'Done' },
  ],
  probe: {
    afterStep: 2,
    prompt: 'The image is forming in FRONT of the retina. What kind of spectacle lens fixes it?',
    options: [
      'A converging lens — positive power',
      'A diverging lens — negative power',
      'Either, as long as the strength is right',
      'No lens can fix it — the eyeball is the wrong length',
    ],
    answerIndex: 1,
    perOption: [
      'A converging lens bends the light MORE, so it comes to a point even sooner — even further in front of the retina. This is the correction for the opposite defect, long sight.',
      'Right. And notice that the whole prescription is in the minus sign: −2 D and +2 D are the same lens strength curing opposite problems, and swapping them makes the patient worse.',
      'The sign is not a detail. One of them moves the image back towards the retina and the other pushes it further away.',
      'The eyeball IS the wrong length — but you do not have to fix the eyeball. Bending the light before it arrives changes where it lands, which is all that is needed.',
    ],
    reveal:
      'A myopic eye focuses too soon, so the correcting lens must diverge: negative focal length, negative power. Its job is to take light from infinity and make it look as if it came from the eye\'s far point, which is why f = −(far point). Drop the minus sign and you have prescribed exactly the wrong glasses.',
  },
};

// ── 13. Compound microscope ──────────────────────────────────────────────────

const microscope: OpticsArchetypeEx = {
  id: 'microscope',
  title: 'Microscope — where the magnifications multiply',
  summary:
    'A very short objective throws a real, enlarged image inside the tube. That image — which students never see drawn — is then the OBJECT for the eyepiece. Two ordinary lenses, ×4 and ×5, and the result is ×20, because the second stage magnifies what the first stage made.',
  mode: 'assembler',
  targets: 'magnification_is_size_only' as OpticsMisconception,
  rays: 11,
  params: [
    { key: 'fObjective', label: 'Objective focal length', kind: 'number', default: 2, min: 0.5, max: 6, step: 0.1, unit: 'cm' },
    { key: 'fEyepiece', label: 'Eyepiece focal length', kind: 'number', default: 5, min: 2, max: 12, step: 0.25, unit: 'cm' },
    { key: 'u', label: 'Object distance', kind: 'number', default: 2.5, min: 0.6, max: 8, step: 0.05, unit: 'cm' },
    { key: 'h', label: 'Object height', kind: 'number', default: 0.1, min: 0.02, max: 0.4, step: 0.01, unit: 'cm' },
    { key: 'stage', label: 'Start from', kind: 'select', default: 'objective only', options: ['objective only', 'both lenses'] },
  ],
  build(p): Bench {
    const fo = num(p, 'fObjective', 2);
    const fe = num(p, 'fEyepiece', 5);
    const u = Math.max(fo * 1.02, num(p, 'u', 2.5));
    // Real image from the objective: 1/v = 1/f + 1/u, u = −|u|.
    const v = 1 / (1 / fo - 1 / u);
    const elements: OpticalElement[] = [
      { id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: fo, aperture: 1.2, label: 'Objective' },
    ];
    if (str(p, 'stage', 'objective only') === 'both lenses') {
      // Normal adjustment: the intermediate image sits at the eyepiece's front
      // focus, so the final image goes to infinity and the eye stays relaxed.
      elements.push({ id: 'EYE', kind: 'thin-lens', x: v + fe, focalLength: fe, aperture: 1.8, label: 'Eyepiece' });
    }
    return {
      nMedium: 1,
      elements,
      sources: [{ id: 'S', x: -u, y: num(p, 'h', 0.1), kind: 'extended', rayCount: 11 }],
    };
  },
  defaultSteps: [
    { say: 'A tiny object, 1 mm tall, sitting just outside the focus of a very short 2 cm lens. That "just outside" is the whole trick — it is what makes the image both real and hugely enlarged.', cta: 'Form the first image' },
    { say: 'There it is, 10 cm along the tube: real, inverted, and four times the size of the object. This is the intermediate image, and it is the thing a textbook diagram almost never shows you.', cta: 'Add the eyepiece' },
    { say: 'Now add the second lens and place it so the intermediate image sits at ITS focus. The eyepiece does not look at the specimen at all — it looks at the image the objective made, exactly as if that image were a real object hanging in the tube.', cta: 'Read the magnification' },
    { say: 'The objective gave ×4. The eyepiece then magnifies that by D/f = 25/5 = ×5. Total ×20 — the two stages MULTIPLY, because the second one works on what the first one produced.', cta: 'Done' },
  ],
  probe: {
    afterStep: 2,
    prompt: 'The objective magnifies ×4 and the eyepiece ×5. What is the total magnification?',
    options: ['×9', '×20', '×5 — the eyepiece is what you look through', '×4 — the eyepiece only makes it comfortable to view'],
    answerIndex: 1,
    perOption: [
      'Adding would be right if the two lenses each magnified the ORIGINAL object. They do not: the eyepiece never sees the specimen. It sees the objective\'s image, which is already four times too big, and multiplies that.',
      'Right — and the reason is on screen. Follow the rays: the bundle leaving the intermediate image is a bundle from an object 4× the original size, and the eyepiece treats it as exactly that.',
      'The eyepiece is what you look through, but it is magnifying an image that was already enlarged. Take the objective away and there is nothing at its focus to look at.',
      'The objective made the image; the eyepiece then enlarges the angle that image subtends. Both stages contribute, and they compound.',
    ],
    reveal:
      'M = m_objective × M_eyepiece. Stages of magnification multiply because each one acts on the output of the one before — the same reason two ×3 zoom stages give ×9 and not ×6. It is also why a microscope reaches ×400 with two lenses that are individually unremarkable, and why the last stage is quoted as an ANGULAR magnification: the final image is at infinity and has no size to measure.',
  },
};

// ── 14. Refracting telescope ─────────────────────────────────────────────────

const telescope: OpticsArchetypeEx = {
  id: 'telescope',
  title: 'Telescope — the same two lenses, aimed at infinity',
  summary:
    'Swap the microscope\'s stubby objective for a long, wide one and point it at something impossibly far away. Nothing else changes — same intermediate image, same eyepiece — but now the object has no size at all, so the only magnification that means anything is angular: f₀/f_e.',
  mode: 'assembler',
  targets: 'telescope_magnifies_like_microscope' as OpticsMisconception,
  rays: 9,
  params: [
    { key: 'fObjective', label: 'Objective focal length', kind: 'number', default: 100, min: 30, max: 200, step: 5, unit: 'cm' },
    { key: 'fEyepiece', label: 'Eyepiece focal length', kind: 'number', default: 5, min: 1, max: 20, step: 0.5, unit: 'cm' },
    { key: 'beamAngle', label: 'Object direction', kind: 'number', default: -1, min: -1.5, max: 1.5, step: 0.1, unit: '°' },
    { key: 'objectiveRadius', label: 'Objective radius', kind: 'number', default: 6, min: 2, max: 12, step: 0.5, unit: 'cm' },
    { key: 'stage', label: 'Start from', kind: 'select', default: 'objective only', options: ['objective only', 'both lenses'] },
  ],
  build(p): Bench {
    const fo = num(p, 'fObjective', 100);
    const fe = num(p, 'fEyepiece', 5);
    const R = num(p, 'objectiveRadius', 6);
    const alpha = num(p, 'beamAngle', -1);
    const elements: OpticalElement[] = [
      { id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: fo, aperture: R, label: 'Objective' },
    ];
    if (str(p, 'stage', 'objective only') === 'both lenses') {
      // THE EYEPIECE MUST BE BIG ENOUGH FOR THE FIELD, or the whole bundle is
      // vignetted and the diagram goes blank. The intermediate image sits
      // h = f₀·tan α off the axis, so a long objective or a wide field pushes it
      // further out — which is the real reason a wide-field telescope needs a
      // physically large eyepiece. Sizing it from the CURRENT field angle rather
      // than from a fixed fraction of the objective means every slider position
      // draws. (A fixed `max(1.2, R × 0.32)` looked reasonable and silently
      // emptied the canvas at f₀ = 150, f_e = 3 — the verifier caught it.)
      const hIntermediate = Math.abs(fo * Math.tan((alpha * Math.PI) / 180));
      elements.push({
        id: 'EYE', kind: 'thin-lens', x: fo + fe, focalLength: fe,
        aperture: Math.max(1.4, hIntermediate * 1.2 + 0.4), label: 'Eyepiece',
      });
    }
    return {
      nMedium: 1,
      elements,
      // A star has no height. It has a DIRECTION, and that is the only thing a
      // telescope can magnify — which is the point of the whole archetype.
      sources: [{
        id: 'S', x: -fo * 0.35, y: 0, kind: 'parallel-beam',
        beamAngleDeg: alpha, rayCount: 9,
      }],
    };
  },
  defaultSteps: [
    { say: 'The object is a star. It is so far away that every ray from it arrives PARALLEL — and it has no measurable size, only a direction. Note that: there is no object height anywhere on this bench.', cta: 'Form the image' },
    { say: 'Parallel light converges in the focal plane, so the objective makes a small real image exactly f₀ behind it. A longer objective puts that image further out and makes it bigger.', cta: 'Add the eyepiece' },
    { say: 'Put the eyepiece one focal length beyond that image and the light leaves parallel again — so a relaxed eye can look through it all day. The tube is f₀ + f_e long, which is why old refractors were enormous.', cta: 'Compare the angles' },
    { say: 'Now the only question that matters: the star subtended a tiny angle before, and a much bigger one now. The ratio is f₀/f_e = 20. Nothing got "bigger" — it got wider APART, and that is what a telescope does.', cta: 'Done' },
  ],
  probe: {
    afterStep: 3,
    prompt: 'This telescope is ×20. What exactly is 20 times bigger?',
    options: [
      'The size of the image compared with the object',
      'The angle the object subtends at your eye',
      'The distance you can see',
      'The brightness of the object',
    ],
    answerIndex: 1,
    perOption: [
      'Compared with WHAT? The star has no size — it is a point, unimaginably far away. Transverse magnification is a ratio of two heights, and one of them does not exist here. This is the trap.',
      'Right. Angular magnification: the angle out divided by the angle in. Two stars 1 arc-minute apart now look 20 arc-minutes apart, which is why you can finally tell there are two of them.',
      'A telescope does not shorten distance. The Moon is as far away through a telescope as without one; it just subtends a bigger angle.',
      'The objective does collect far more light, which makes faint things visible — but that is aperture, a different property, and it is not what ×20 refers to.',
    ],
    reveal:
      'A microscope quotes transverse magnification for its first stage because the specimen has a real size. A telescope cannot: its object is at infinity. So its whole specification is the angle ratio f₀/f_e, and its OTHER number — the aperture — controls brightness and resolution instead. The two instruments look identical and are specified by completely different quantities.',
  },
};

// ── 15. Binoculars ───────────────────────────────────────────────────────────

/**
 * The porro fold, computed rather than eyeballed.
 *
 * A 90°-apex prism turned +45° presents a face square-on to a horizontal beam:
 * the light enters undeviated, meets the hypotenuse at exactly 45° — past the
 * 41.8° critical angle — and turns straight up with no coating and no loss. A
 * second prism at +225° turns it back along +x, one fold-height higher.
 *
 * Two reflections rotate the beam cross-section by 180°, so the pair ERECTS the
 * telescope's inverted image. And because the light now travels a vertical leg
 * that costs no bench length, the tube gets shorter. Both facts fall out of the
 * trace; neither is drawn in.
 *
 * `1.414a` and `0.707a` below are √2·a and a/√2 for a prism of half-height a —
 * the entry face is centred on the axis when the prism's pivot sits a/√2 above
 * it, which is why the pivots are offset rather than on the axis.
 */
function porroFold(xA: number, a: number, height: number) {
  const s = Math.SQRT1_2 * a;     // a/√2  ≈ 0.707a
  const d = Math.SQRT2 * a;       // a·√2  ≈ 1.414a
  const prismA: OpticalElement = {
    id: 'P1', kind: 'prism', x: xA, y: s, aperture: a, apexDeg: 90, n: 1.5, tiltDeg: 45, label: 'Prism 1',
  };
  const prismB: OpticalElement = {
    id: 'P2', kind: 'prism', x: xA + d, y: height - s, aperture: a, apexDeg: 90, n: 1.5, tiltDeg: 225, label: 'Prism 2',
  };
  // Geometric path through the two prisms is 2·(√2 a) each; in glass of index n
  // that counts as 1/n of the same path for imaging, so the fold's EFFECTIVE
  // optical length is shorter than it looks by this much.
  const glass = 4 * d;
  const reduction = glass * (1 - 1 / 1.5);
  return { prismA, prismB, extraPath: height - reduction };
}

const binoculars: OpticsArchetypeEx = {
  id: 'binoculars',
  title: 'Binoculars — why they are short and fat instead of long and thin',
  summary:
    'Drop two 90° prisms into the telescope. Each turns the light through a right angle by total internal reflection — no coating, no loss — so the beam runs up and across instead of straight on, and the tube collapses. Same two lenses, same magnification, a third of the length.',
  mode: 'assembler',
  targets: 'magnification_is_size_only' as OpticsMisconception,
  rays: 9,
  params: [
    { key: 'fObjective', label: 'Objective focal length', kind: 'number', default: 30, min: 15, max: 60, step: 1, unit: 'cm' },
    { key: 'fEyepiece', label: 'Eyepiece focal length', kind: 'number', default: 4, min: 1.5, max: 10, step: 0.25, unit: 'cm' },
    { key: 'fold', label: 'Fold height', kind: 'number', default: 6, min: 4, max: 11, step: 0.5, unit: 'cm' },
    { key: 'prismSize', label: 'Prism half-height', kind: 'number', default: 1.6, min: 1, max: 2.4, step: 0.1, unit: 'cm' },
    { key: 'objectiveRadius', label: 'Objective radius', kind: 'number', default: 2.5, min: 1.2, max: 4, step: 0.1, unit: 'cm' },
    { key: 'stage', label: 'Start from', kind: 'select', default: 'straight telescope', options: ['straight telescope', 'folded binocular'] },
  ],
  build(p): Bench {
    const fo = num(p, 'fObjective', 30);
    const fe = num(p, 'fEyepiece', 4);
    const R = num(p, 'objectiveRadius', 2.5);
    const folded = str(p, 'stage', 'straight telescope') === 'folded binocular';
    const beam = { id: 'S', x: -fo * 0.3, y: 0, kind: 'parallel-beam' as const, beamAngleDeg: -1.2, rayCount: 9 };

    if (!folded) {
      return {
        nMedium: 1,
        elements: [
          { id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: fo, aperture: R, label: 'Objective' },
          { id: 'EYE', kind: 'thin-lens', x: fo + fe, focalLength: fe, aperture: Math.max(1, R * 0.6), label: 'Eyepiece' },
        ],
        sources: [beam],
      };
    }

    const a = num(p, 'prismSize', 1.6);
    const H = Math.max(2.9 * a, num(p, 'fold', 6));
    const xA = Math.max(fo * 0.4, 3 * a);
    const { prismA, prismB, extraPath } = porroFold(xA, a, H);
    // Normal adjustment along the FOLDED path: total optical length must still
    // be f₀ + f_e, and the fold has already used `extraPath` of it.
    const xE = fo + fe - extraPath;
    return {
      nMedium: 1,
      elements: [
        { id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: fo, aperture: R, label: 'Objective' },
        prismA,
        prismB,
        { id: 'EYE', kind: 'thin-lens', x: xE, y: H, focalLength: fe, aperture: Math.max(1, R * 0.6), label: 'Eyepiece' },
      ],
      sources: [beam],
    };
  },
  defaultSteps: [
    { say: 'A plain refracting telescope: objective, eyepiece, tube f₀ + f_e long. It works, it is ×7.5, and it is far too long to hold up at a cricket match.', cta: 'Drop in the first prism' },
    { say: 'A 90° prism turned 45°. The light goes in square-on, so it is not bent at the entry face at all — then it meets the sloping back at 45°, which is past the critical angle. Total internal reflection, no coating, no loss. It turns straight up.', cta: 'Drop in the second' },
    { say: 'A second prism sends it back along the original direction, one fold-height higher. The light has travelled the full optical distance, but a chunk of it went sideways — so the instrument is physically shorter than the light path inside it.', cta: 'Check which way up' },
    { say: 'Now check the magnification: still ×7.5, unchanged. The fold cost nothing optically — it only moved where the light travels. Notice too that the eyepiece has ended up ABOVE the objective, which is exactly why the eyepieces on real binoculars are offset from the big lenses.', cta: 'One thing this cannot show' },
    { say: 'The image is still upside down. Erecting it needs a SECOND fold in the perpendicular plane — out of the page — which is why a real Porro pair is a *pair* of prisms at right angles to each other. This bench folds in one plane only, so it can show you the shortening honestly and not the erecting. Two folds, two flips, and the view comes out the right way up.', cta: 'Done' },
  ],
  probe: {
    afterStep: 3,
    prompt: 'A pair of binoculars is marked "7 × 50". The 7 is the magnification. What is the 50?',
    options: [
      'The field of view in degrees',
      'The objective diameter in millimetres',
      'A second magnification, for zooming',
      'The eye relief in millimetres',
    ],
    answerIndex: 1,
    perOption: [
      'Field of view is usually printed separately, in degrees or as metres at 1000 m. The 50 is a size, not an angle.',
      'Right — 50 mm objectives. It says nothing about magnification and everything about light: doubling the diameter collects four times the light, which is why the big ones work at dusk and the small ones do not.',
      'There is only one magnification here, f₀/f_e = 7. The second number is an aperture.',
      'Eye relief matters if you wear glasses, but it is not what the second number means.',
    ],
    reveal:
      'The two numbers on any binocular are angular magnification and objective diameter, and they do different jobs: magnification spreads the image out, aperture decides how bright and how detailed it can be. Confusing "bigger" with "more magnified" is the same error as expecting a telescope to have a transverse magnification — size and angle are not the same measurement.',
  },
};

export const INSTRUMENT_ARCHETYPES: OpticsArchetypeMap = {
  [camera.id]: camera,
  [eyeAndSpectacles.id]: eyeAndSpectacles,
  [microscope.id]: microscope,
  [telescope.id]: telescope,
  [binoculars.id]: binoculars,
};

export const INSTRUMENT_ARCHETYPE_ORDER = [
  'camera', 'eye-and-spectacles', 'microscope', 'telescope', 'binoculars',
];
