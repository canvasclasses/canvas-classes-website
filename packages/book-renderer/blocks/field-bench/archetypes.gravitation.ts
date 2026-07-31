/*
 * field-bench/archetypes.gravitation.ts — g-Explorer and the Orbit Sandbox.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * Gravitation is in the FIELD engine and not in a chapter of its own because it
 * is the same machinery: a source, an inverse-square field, a scalar potential
 * and a test body integrated by motion-lab's RK4. Putting it here is what lets
 * a student see that Coulomb and Newton differ in a constant and a sign, and
 * nowhere else.
 *
 * ── g-inside-earth: the graph with a corner ─────────────────────────────────
 * `point-mass` carrying a `radius` is a UNIFORM SPHERE, not a point. Inside it
 * the shell theorem does the work: every shell above you pulls in all
 * directions at once and cancels exactly, so only the mass at smaller r counts,
 * and that mass grows as r³. g ∝ r on the way out, g ∝ 1/r² on the way in, and
 * the two meet at the surface — the peak is AT the surface, not at the centre.
 * Students expect g to be biggest at the centre, or constant underground; both
 * are wrong and the graph settles it in one look.
 *
 * ── orbit-sandbox: design law #4 ────────────────────────────────────────────
 * The satellite is integrated by the SAME `integrate` that flies a projectile
 * in E2 and a released charge in `archetypes.electrostatic.ts`. An orbit is a
 * projectile that keeps missing — and it is also the cleanest disproof of
 * "things move along field lines": g points dead at the Earth's centre the
 * whole way round, and the satellite never once travels that way.
 */

import type { FieldArchetype, FieldScene } from './types';
import { num, type ParamBag } from './lib/params';
import { EARTH_MASS, EARTH_RADIUS } from './lib/constants';
import { orbitSpeed } from './lib/gravity';

export const GRAVITATION_ARCHETYPES: Record<string, FieldArchetype> = {
  // ── 15 ─────────────────────────────────────────────────────────────────────
  'g-inside-earth': {
    id: 'g-inside-earth',
    title: 'Dig downwards and gravity gets WEAKER',
    summary:
      'g against distance from the centre, drawn live as you move the probe. It rises in a straight line '
      + 'from zero at the centre, peaks exactly at the surface, then falls away as 1/r².',
    mode: 'sculptor',
    kind: 'gravitational',
    targets: 'g_constant_inside_earth',
    params: [
      { key: 'probeR', label: 'Probe distance', kind: 'number', default: 0.5, min: 0.05, max: 2.5, step: 0.05, unit: '× R' },
      { key: 'massEarths', label: 'Planet mass', kind: 'number', default: 1, min: 0.25, max: 2, step: 0.05, unit: '× Earth' },
      { key: 'radiusEarths', label: 'Planet radius', kind: 'number', default: 1, min: 0.5, max: 1.6, step: 0.05, unit: '× Earth' },
    ],
    build(p?: ParamBag): FieldScene {
      const R = EARTH_RADIUS * num(p, 'radiusEarths', 1);
      const M = EARTH_MASS * num(p, 'massEarths', 1);
      const rp = R * num(p, 'probeR', 0.5);
      const a = (40 * Math.PI) / 180;
      return {
        kind: 'gravitational',
        sources: [
          { id: 'planet', kind: 'point-mass', pos: { x: 0, y: 0 }, strength: M, radius: R, fixed: true, label: 'the planet' },
        ],
        testCharges: [
          { id: 'probe', pos: { x: rp * Math.cos(a), y: rp * Math.sin(a) }, charge: 1, mass: 1, label: '1 kg probe' },
        ],
      };
    },
    defaultSteps: [
      { say: 'A 1 kg probe on the surface, reading 9.8 N/kg. **Predict:** start digging down toward the centre — does g rise, fall, or stay put?', cta: 'Drag the probe inward' },
      { say: 'It falls, and it falls in a straight line. Everything above you now pulls upward as well as down, and for a uniform sphere those pulls cancel EXACTLY. Only the ball of mass beneath you counts.', cta: 'Go to the centre' },
      { say: 'Zero at the centre. Pulled equally in every direction, so pulled nowhere. Weightless in the middle of a planet — and still under enormous pressure, which is a different thing entirely.', cta: 'Climb back out and keep going' },
      { say: 'Look at the corner in the graph. g peaks exactly AT the surface, then drops as 1/r². Nowhere on Earth or above it is gravity stronger than at your feet.', cta: 'Done' },
    ],
  },

  // ── 16 ─────────────────────────────────────────────────────────────────────
  'orbit-sandbox': {
    id: 'orbit-sandbox',
    title: 'An orbit is a projectile that keeps missing',
    summary:
      'Fire a satellite sideways and let gravity do the rest. Too slow and it crashes, just right and it '
      + 'circles, faster and the ellipse opens out until at √2 × circular speed it never comes back.',
    mode: 'trajectory',
    kind: 'gravitational',
    targets: 'field_lines_are_paths',
    params: [
      { key: 'speedFactor', label: 'Launch speed', kind: 'number', default: 1, min: 0.45, max: 1.45, step: 0.01, unit: '× circular' },
      { key: 'altitudeKm', label: 'Altitude', kind: 'number', default: 629, min: 200, max: 3000, step: 10, unit: 'km' },
      { key: 'massEarths', label: 'Planet mass', kind: 'number', default: 1, min: 0.5, max: 2, step: 0.05, unit: '× Earth' },
    ],
    build(p?: ParamBag): FieldScene {
      const M = EARTH_MASS * num(p, 'massEarths', 1);
      const r = EARTH_RADIUS + num(p, 'altitudeKm', 629) * 1000;
      const v = orbitSpeed(r, M) * num(p, 'speedFactor', 1);
      return {
        kind: 'gravitational',
        sources: [
          { id: 'planet', kind: 'point-mass', pos: { x: 0, y: 0 }, strength: M, radius: EARTH_RADIUS, fixed: true, label: 'the planet' },
        ],
        // Launched sideways: position straight up, velocity straight across.
        // Gravity points at the centre for the whole flight and the satellite
        // never travels that way — the field line is not the path.
        testCharges: [
          { id: 'sat', pos: { x: 0, y: r }, vel: { x: v, y: 0 }, charge: 1000, mass: 1000, label: 'satellite' },
        ],
      };
    },
    defaultSteps: [
      { say: 'A satellite at the top, fired horizontally. Gravity pulls it straight down at the planet — it always does, the entire way round. **Predict:** what shape is the path?', cta: 'Launch it' },
      { say: 'A closed circle, with the force pointing at the centre at every instant and the motion at right angles to it. It is falling the whole time and never getting closer.', cta: 'Slow it down' },
      { say: 'Below circular speed the ellipse dips and it hits the ground — which is all a cannonball is. Newton drew exactly this picture.', cta: 'Speed it up past 1.41' },
      { say: 'At √2 times circular speed it has escape speed and never returns. Same field, same integrator that flies a projectile in the motion lab — an orbit really is a projectile that keeps missing.', cta: 'Done' },
    ],
  },
};
