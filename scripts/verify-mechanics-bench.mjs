/*
 * verify-mechanics-bench.mjs — physics verification for the E1 engine core.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-mechanics-bench.mjs
 *
 * Requires Node ≥ 22.6 (verified on v24.14.0). It imports the engine's
 * TypeScript sources DIRECTLY — Node strips the types natively, and the
 * `registerHooks` shim below resolves the repo's extensionless relative imports
 * (`from './linalg'`) to their `.ts` files, which native resolution does not do.
 * No build step, no test framework, no dependencies.
 *
 * WHY THIS EXISTS. PHYSICS_SIMULATION_PROGRAM.md §9: "Physics must be verifiable
 * outside React. No academic claim ships unverified." Every expected value below
 * is hand-derived in the comment above its case, from the standard Class 11
 * result — not copied out of a previous run of this code.
 *
 * Exits non-zero on any failure.
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    // Extensionless relative imports ('./linalg', './archetypes.fbd') need the
    // .ts appended. Note the second one LOOKS like it has an extension, so test
    // the filesystem rather than the spelling.
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
      if (!existsSync(base)) {
        for (const ext of ['.ts', '.tsx', '/index.ts']) {
          if (existsSync(base + ext)) {
            return { url: pathToFileURL(base + ext).href, shortCircuit: true };
          }
        }
      }
    }
    return next(spec, ctx);
  },
});

const LIB = new URL('../packages/book-renderer/blocks/mechanics-bench/lib/', import.meta.url);
const { trueForcesFor, normalizeScene } = await import(new URL('scene.ts', LIB).href);
const { deriveConstraints, deriveContactCouplings } = await import(new URL('constraints.ts', LIB).href);
const { solveScene, solvedForcesFor } = await import(new URL('dynamics.ts', LIB).href);
const { gradeFbd } = await import(new URL('grade.ts', LIB).href);
const { cutSystem } = await import(new URL('cut.ts', LIB).href);
const { worldToScreen, arrowPath, labelOffset } = await import(new URL('svg.ts', LIB).href);

const G = 9.8;
const WORLD_GROUND = 'world:ground';
const WORLD_HAND = 'world:hand';

// ── Tiny harness ─────────────────────────────────────────────────────────────

const results = [];
let failures = 0;

function check(group, name, actual, expected, tol = 1e-6) {
  const ok = typeof expected === 'number'
    ? Number.isFinite(actual) && Math.abs(actual - expected) <= tol
    : actual === expected;
  if (!ok) failures++;
  results.push({
    group, name, ok,
    actual: typeof actual === 'number' ? actual.toFixed(4) : String(actual),
    expected: typeof expected === 'number' ? expected.toFixed(4) : String(expected),
  });
}

function assert(group, name, cond, detail = '') {
  if (!cond) failures++;
  results.push({ group, name, ok: !!cond, actual: cond ? 'yes' : `no ${detail}`, expected: 'yes' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Block on a FRICTIONLESS 30° incline.
//    Along the slope:  mg sin30 = ma        → a = g sin30 = 9.8 × 0.5 = 4.900 m/s²
//    Across the slope: N = mg cos30         → N = 2 × 9.8 × 0.86603 = 16.974 N
//    The answer must not depend on the mass; only N does.
// ─────────────────────────────────────────────────────────────────────────────
const inclineScene = (mu) => ({
  bodies: [
    { id: 'wedge', shape: 'wedge', mass: 0, pos: { x: 0, y: 0 }, angleDeg: 30, fixed: true },
    { id: 'm1', shape: 'block', mass: 2, pos: { x: 0, y: 0.5 }, size: { w: 0.4, h: 0.3 } },
  ],
  contacts: [{
    id: 'c1', bodyA: 'm1', bodyB: 'wedge', normalDeg: 120,
    ...(mu ? { mu_k: mu, mu_s: mu, slidingSign: -1 } : {}),
  }],
  strings: [],
});

{
  const sc = normalizeScene(inclineScene(null));
  const res = solveScene(sc);
  check('1 · frictionless 30° incline', 'dofDeg inferred (down-slope)',
    sc.bodies.find((b) => b.id === 'm1').dofDeg, 210);
  check('1 · frictionless 30° incline', 'a = g sin30', res.accelerations.m1, G * Math.sin(Math.PI / 6), 1e-5);
  check('1 · frictionless 30° incline', 'a numeric', res.accelerations.m1, 4.9, 1e-5);
  check('1 · frictionless 30° incline', 'N = mg cos30', res.normals.c1, 2 * G * Math.cos(Math.PI / 6), 1e-5);
  assert('1 · frictionless 30° incline', 'not singular', !res.singular, res.warnings.join(' | '));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Block sliding DOWN a 30° incline with μₖ = 0.2.
//    a = g(sin30 − μₖ cos30) = 9.8 × (0.5 − 0.2 × 0.86603) = 9.8 × 0.326795
//      = 3.20259 m/s²   (friction acts UP the slope, opposing the sliding)
// ─────────────────────────────────────────────────────────────────────────────
{
  const res = solveScene(inclineScene(0.2));
  const expected = G * (Math.sin(Math.PI / 6) - 0.2 * Math.cos(Math.PI / 6));
  check('2 · 30° incline, μk = 0.2', 'a = g(sin30 − 0.2cos30)', res.accelerations.m1, expected, 1e-5);
  check('2 · 30° incline, μk = 0.2', 'a numeric', res.accelerations.m1, 3.202589, 1e-5);
  check('2 · 30° incline, μk = 0.2', 'N unchanged by friction', res.normals.c1, 2 * G * Math.cos(Math.PI / 6), 1e-5);
  const f = trueForcesFor(inclineScene(0.2), 'm1').find((x) => x.kind === 'friction');
  check('2 · 30° incline, μk = 0.2', 'kinetic friction points up-slope', f.angleDeg, 30, 1e-6);
  check('2 · 30° incline, μk = 0.2', 'kinetic direction is KNOWN', f.directionKnown, true);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ATWOOD, 3 kg and 5 kg over a fixed massless pulley.
//    a = (m2 − m1)g / (m1 + m2) = 2 × 9.8 / 8 = 2.450 m/s²
//    T = 2 m1 m2 g / (m1 + m2) = 2 × 3 × 5 × 9.8 / 8 = 36.750 N
//    Down is positive for both, so the constraint is a₁ + a₂ = 0 and the
//    lighter mass gets the negative (upward) acceleration.
//    Masses sit at x = ±r so their string segments are exactly vertical.
// ─────────────────────────────────────────────────────────────────────────────
const atwood = {
  bodies: [
    { id: 'p1', shape: 'pulley', mass: 0, pos: { x: 0, y: 2 }, radius: 0.3, fixed: true },
    { id: 'm1', shape: 'block', mass: 3, pos: { x: -0.3, y: 0.5 }, size: { w: 0.3, h: 0.3 } },
    { id: 'm2', shape: 'block', mass: 5, pos: { x: 0.3, y: 0.5 }, size: { w: 0.3, h: 0.3 } },
  ],
  contacts: [],
  strings: [{ id: 's1', path: ['m1', 'p1', 'm2'], taut: true }],
};

{
  const segs = deriveConstraints(atwood);
  const eq = segs[0];
  check('3 · Atwood 3 / 5 kg', 'one constraint', segs.length, 1);
  check('3 · Atwood 3 / 5 kg', 'coeff a₁', eq.terms.find((t) => t.bodyId === 'm1').coeff, 1, 1e-9);
  check('3 · Atwood 3 / 5 kg', 'coeff a₂', eq.terms.find((t) => t.bodyId === 'm2').coeff, 1, 1e-9);
  const res = solveScene(atwood);
  check('3 · Atwood 3 / 5 kg', 'a₁ = −2.45 (3 kg rises)', res.accelerations.m1, -2.45, 1e-5);
  check('3 · Atwood 3 / 5 kg', 'a₂ = +2.45 (5 kg falls)', res.accelerations.m2, 2.45, 1e-5);
  check('3 · Atwood 3 / 5 kg', 'T = 36.75 N', res.tensions.s1, 36.75, 1e-5);
  assert('3 · Atwood 3 / 5 kg', 'no slack string', res.slackStrings.length === 0);
  assert('3 · Atwood 3 / 5 kg', 'ledger names the string',
    /string "s1"/i.test(eq.derivation), eq.derivation);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Block on a table (4 kg) + hanging block (6 kg), frictionless.
//    a = m2 g / (m1 + m2) = 6 × 9.8 / 10 = 5.880 m/s²
//    T = m1 m2 g / (m1 + m2) = 4 × 6 × 9.8 / 10 = 23.520 N
//    N on the table block = m1 g = 39.2 N (unaffected by the string).
//    Pulley centre is one radius BELOW the table top so the horizontal segment
//    leaves at exactly 0°; the hanging mass sits one radius to its right.
// ─────────────────────────────────────────────────────────────────────────────
const tableHang = {
  bodies: [
    { id: 'm1', shape: 'block', mass: 4, pos: { x: 0, y: 0 }, size: { w: 0.4, h: 0.4 } },
    { id: 'p1', shape: 'pulley', mass: 0, pos: { x: 2, y: -0.15 }, radius: 0.15, fixed: true },
    { id: 'm2', shape: 'block', mass: 6, pos: { x: 2.15, y: -1.5 }, size: { w: 0.3, h: 0.3 } },
  ],
  contacts: [{ id: 'c1', bodyA: 'm1', bodyB: WORLD_GROUND, normalDeg: 90 }],
  strings: [{ id: 's1', path: ['m1', 'p1', 'm2'], taut: true }],
};

{
  const sc = normalizeScene(tableHang);
  check('4 · table 4 kg + hanging 6 kg', 'table block DOF is horizontal',
    sc.bodies.find((b) => b.id === 'm1').dofDeg, 0);
  check('4 · table 4 kg + hanging 6 kg', 'hanging block DOF is down',
    sc.bodies.find((b) => b.id === 'm2').dofDeg, 270);
  const eq = deriveConstraints(sc)[0];
  check('4 · table 4 kg + hanging 6 kg', 'coeff a₁', eq.terms.find((t) => t.bodyId === 'm1').coeff, -1, 1e-9);
  check('4 · table 4 kg + hanging 6 kg', 'coeff a₂', eq.terms.find((t) => t.bodyId === 'm2').coeff, 1, 1e-9);
  const res = solveScene(sc);
  check('4 · table 4 kg + hanging 6 kg', 'a = 5.88 m/s²', res.accelerations.m1, 5.88, 1e-5);
  check('4 · table 4 kg + hanging 6 kg', 'both accelerate alike', res.accelerations.m2, 5.88, 1e-5);
  check('4 · table 4 kg + hanging 6 kg', 'T = 23.52 N', res.tensions.s1, 23.52, 1e-5);
  check('4 · table 4 kg + hanging 6 kg', 'N = m₁g = 39.2 N', res.normals.c1, 39.2, 1e-5);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MOVABLE PULLEY. String: m1 → fixed pA → movable pM → fixed pB → m2.
//    Length invariance visits pM TWICE (once on the way down, once on the way
//    back up), so its coefficient is 2 while each hanging mass gets 1:
//        a₁ + 2a₃ + a₂ = 0        (all measured down-positive)
//    which is the textbook a₁ + a₂ = 2a₃ with a₃ measured upward.
//    THE 2 IS NOT HARDCODED ANYWHERE — it comes out of the walk.
//    Geometry: pA.x = pM.x − (rA + rM) so both bight segments are vertical.
//    With m1 = m2 = 2 kg and pM carrying 4 kg the system balances: a = 0,
//    T = m1 g = 19.6 N, and 2T = 39.2 N = the movable pulley's weight.
// ─────────────────────────────────────────────────────────────────────────────
const movable = {
  bodies: [
    { id: 'pA', shape: 'pulley', mass: 0, pos: { x: -0.4, y: 3 }, radius: 0.2, fixed: true },
    { id: 'pB', shape: 'pulley', mass: 0, pos: { x: 0.4, y: 3 }, radius: 0.2, fixed: true },
    { id: 'pM', shape: 'pulley', mass: 4, pos: { x: 0, y: 1 }, radius: 0.2 },
    { id: 'm1', shape: 'block', mass: 2, pos: { x: -0.6, y: 1 }, size: { w: 0.3, h: 0.3 } },
    { id: 'm2', shape: 'block', mass: 2, pos: { x: 0.6, y: 1 }, size: { w: 0.3, h: 0.3 } },
  ],
  contacts: [],
  strings: [{ id: 's1', path: ['m1', 'pA', 'pM', 'pB', 'm2'], taut: true }],
};

{
  const eq = deriveConstraints(movable)[0];
  const cM = eq.terms.find((t) => t.bodyId === 'pM');
  const c1 = eq.terms.find((t) => t.bodyId === 'm1');
  const c2 = eq.terms.find((t) => t.bodyId === 'm2');
  check('5 · movable pulley', 'coeff a₁', c1.coeff, 1, 1e-6);
  check('5 · movable pulley', 'coeff a₂', c2.coeff, 1, 1e-6);
  check('5 · movable pulley', 'coeff a₃ = 2 (the 2:1 moment)', cM.coeff, 2, 1e-6);
  check('5 · movable pulley', 'movable pulley visited twice',
    eq.segments.filter((s) => s.bodyId === 'pM').length, 2);
  const res = solveScene(movable);
  check('5 · movable pulley', 'balanced: a₁ = 0', res.accelerations.m1, 0, 1e-6);
  check('5 · movable pulley', 'balanced: a₃ = 0', res.accelerations.pM, 0, 1e-6);
  check('5 · movable pulley', 'T = m₁g = 19.6 N', res.tensions.s1, 19.6, 1e-5);
  assert('5 · movable pulley', '2T carries the 4 kg pulley',
    Math.abs(2 * res.tensions.s1 - 4 * G) < 1e-5);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Body at rest on a horizontal surface, μₛ = 0.4.
//    Nothing pushes it, so the static friction REQUIRED is exactly 0 — and its
//    direction was never determined, which the grader must respect.
//    N = mg = 5 × 9.8 = 49.0 N.
// ─────────────────────────────────────────────────────────────────────────────
const atRest = {
  bodies: [{ id: 'm1', shape: 'block', mass: 5, pos: { x: 0, y: 0 }, size: { w: 0.4, h: 0.4 } }],
  contacts: [{ id: 'c1', bodyA: 'm1', bodyB: WORLD_GROUND, normalDeg: 90, mu_s: 0.4, slidingSign: 0 }],
  strings: [],
};

{
  const res = solveScene(atRest);
  check('6 · at rest, μs = 0.4', 'required friction = 0', res.frictions.c1, 0, 1e-9);
  check('6 · at rest, μs = 0.4', 'N = mg = 49.0 N', res.normals.c1, 49, 1e-6);
  check('6 · at rest, μs = 0.4', 'a = 0', res.accelerations.m1, 0, 1e-9);
  assert('6 · at rest, μs = 0.4', 'no "friction exceeds μsN" warning',
    !res.warnings.some((w) => /static friction/i.test(w)), res.warnings.join(' | '));
  const f = trueForcesFor(atRest, 'm1').find((x) => x.kind === 'friction');
  check('6 · at rest, μs = 0.4', 'static friction directionKnown = false', f.directionKnown, false);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. gradeFbd — the misconception engine.
//    7a  a forward "force of motion" on a block nothing touches in front
//        → ghost_motion_force
//    7b  both N and its reaction drawn on the same block
//        → third_law_pair_same_body
//    7c  a clean, complete diagram grades as correct
//    7d  the normal drawn vertical on a 30° incline
//        → normal_not_perpendicular, with the real 30° in the message
//    7e  18 N of static friction where μₛN = 0.4 × 49 = 19.6 N is available →
//        fine; 25 N → friction_exceeds_max naming 19.6 N
// ─────────────────────────────────────────────────────────────────────────────
const onGround = {
  bodies: [{ id: 'm1', shape: 'block', mass: 4, pos: { x: 0, y: 0 }, size: { w: 0.4, h: 0.4 } }],
  contacts: [{ id: 'c1', bodyA: 'm1', bodyB: WORLD_GROUND, normalDeg: 90 }],
  strings: [],
};

{
  const codes = (r) => r.issues.map((i) => i.code);

  const ghost = gradeFbd(onGround, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90 },
    { id: 'sf', kind: 'applied', onBody: 'm1', angleDeg: 0 },
  ]);
  assert('7 · grader', '7a ghost_motion_force raised',
    codes(ghost).includes('ghost_motion_force'), codes(ghost).join(','));
  assert('7 · grader', '7a message names the agent problem',
    /name the object applying this force/i.test(
      ghost.issues.find((i) => i.code === 'ghost_motion_force')?.message ?? ''));
  assert('7 · grader', '7a diagram is not correct', ghost.correct === false);

  const pair = gradeFbd(onGround, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90 },
    { id: 'sr', kind: 'normal', onBody: 'm1', angleDeg: 270 },
  ]);
  assert('7 · grader', '7b third_law_pair_same_body raised',
    codes(pair).includes('third_law_pair_same_body'), codes(pair).join(','));
  assert('7 · grader', '7b message says they act on different bodies',
    /different bodies/i.test(
      pair.issues.find((i) => i.code === 'third_law_pair_same_body')?.message ?? ''));

  const clean = gradeFbd(onGround, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270, magnitude: 39.2 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90, magnitude: 39.2 },
  ]);
  assert('7 · grader', '7c a correct diagram passes', clean.correct === true,
    clean.issues.map((i) => i.message).join(' | '));
  check('7 · grader', '7c nothing missing', clean.missing.length, 0);

  const tilted = gradeFbd(inclineScene(null), 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90 },
  ]);
  assert('7 · grader', '7d normal_not_perpendicular raised',
    codes(tilted).includes('normal_not_perpendicular'), codes(tilted).join(','));
  assert('7 · grader', '7d message states the real 30° tilt',
    /30\.0°/.test(tilted.issues.find((i) => i.code === 'normal_not_perpendicular')?.message ?? ''),
    tilted.issues.find((i) => i.code === 'normal_not_perpendicular')?.message);

  const tooMuch = gradeFbd(atRest, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270, magnitude: 49 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90, magnitude: 49 },
    { id: 'sf', kind: 'friction', onBody: 'm1', angleDeg: 0, magnitude: 25 },
  ]);
  assert('7 · grader', '7e friction_exceeds_max raised',
    codes(tooMuch).includes('friction_exceeds_max'), codes(tooMuch).join(','));
  assert('7 · grader', '7e message states μsN = 19.6 N',
    /19\.6 N/.test(tooMuch.issues.find((i) => i.code === 'friction_exceeds_max')?.message ?? ''),
    tooMuch.issues.find((i) => i.code === 'friction_exceeds_max')?.message);

  // Static friction's direction is undetermined, so drawing it either way must
  // never be marked wrong — the classic false negative this engine avoids.
  const eitherWay = gradeFbd(atRest, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270, magnitude: 49 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90, magnitude: 49 },
    { id: 'sf', kind: 'friction', onBody: 'm1', angleDeg: 180, magnitude: 0 },
  ]);
  assert('7 · grader', '7f no direction error on undetermined static friction',
    !codes(eitherWay).includes('friction_wrong_sense'), codes(eitherWay).join(','));

  // Missing forces.
  const bare = gradeFbd(onGround, 'm1', []);
  assert('7 · grader', '7g missing_weight + missing_normal',
    codes(bare).includes('missing_weight') && codes(bare).includes('missing_normal'),
    codes(bare).join(','));

  // A pseudo-force drawn in an inertial frame.
  const pseudo = gradeFbd(onGround, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90 },
    { id: 'sp', kind: 'pseudo', onBody: 'm1', angleDeg: 180 },
  ]);
  assert('7 · grader', '7h pseudo_in_inertial_frame',
    codes(pseudo).includes('pseudo_in_inertial_frame'), codes(pseudo).join(','));

  // …and in a rotating frame it is REQUIRED. Same body, opposite correct answer.
  const spinning = {
    ...onGround,
    frame: { kind: 'rotating', omega: 2, centre: { x: -1, y: 0 } },
  };
  const noPseudo = gradeFbd(spinning, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90 },
  ]);
  assert('7 · grader', '7i missing_pseudo_in_noninertial',
    codes(noPseudo).includes('missing_pseudo_in_noninertial'), codes(noPseudo).join(','));

  // The centrifugal ghost: an outward arrow in the GROUND frame.
  const centrifugal = gradeFbd(onGround, 'm1', [
    { id: 'sw', kind: 'weight', onBody: 'm1', angleDeg: 270 },
    { id: 'sn', kind: 'normal', onBody: 'm1', angleDeg: 90 },
    { id: 'sc', kind: 'unknown', onBody: 'm1', angleDeg: 0, label: 'centrifugal force' },
  ]);
  assert('7 · grader', '7j ghost_centrifugal',
    codes(centrifugal).includes('ghost_centrifugal'), codes(centrifugal).join(','));
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. THE CUT TOOL. Blocks A (2 kg) and B (3 kg) side by side on the ground; a
//    hand pushes A with 10 N.
//    Cutting around BOTH: the A–B contact pair becomes internal and vanishes;
//    the two weights, the two ground normals and the hand's push stay external.
//    Composite: a = F/(mA+mB) = 10/5 = 2.000 m/s², and the contact force
//    N = mB·a = 6.000 N — which the solver must independently agree with.
// ─────────────────────────────────────────────────────────────────────────────
const twoBlocks = {
  bodies: [
    { id: 'A', shape: 'block', mass: 2, pos: { x: -0.25, y: 0 }, size: { w: 0.5, h: 0.5 } },
    { id: 'B', shape: 'block', mass: 3, pos: { x: 0.25, y: 0 }, size: { w: 0.5, h: 0.5 } },
  ],
  contacts: [
    { id: 'cA', bodyA: 'A', bodyB: WORLD_GROUND, normalDeg: 90 },
    { id: 'cB', bodyA: 'B', bodyB: WORLD_GROUND, normalDeg: 90 },
    { id: 'cAB', bodyA: 'A', bodyB: 'B', normalDeg: 180 },
  ],
  strings: [],
  applied: [{ id: 'F', body: 'A', from: WORLD_HAND, mag: 10, angleDeg: 0, label: 'F' }],
};

{
  const cut = cutSystem(twoBlocks, ['A', 'B']);
  check('8 · cut tool', 'totalMass = 5 kg', cut.totalMass, 5, 1e-9);
  check('8 · cut tool', 'one internal pair', cut.internal.length, 1);
  check('8 · cut tool', 'internal pair is the A–B contact', cut.internal[0].a.sourceId, 'cAB');
  assert('8 · cut tool', 'the pair is equal and opposite',
    Math.abs(((cut.internal[0].a.angleDeg - cut.internal[0].b.angleDeg) % 360 + 360) % 360 - 180) < 1e-6);
  check('8 · cut tool', 'five external forces', cut.external.length, 5);
  assert('8 · cut tool', 'both weights stay external',
    cut.external.filter((f) => f.kind === 'weight').length === 2);
  assert('8 · cut tool', 'the hand\'s push stays external',
    cut.external.some((f) => f.kind === 'applied' && f.fromBody === WORLD_HAND));
  assert('8 · cut tool', 'no A–B normal survives the cut',
    !cut.external.some((f) => f.sourceId === 'cAB'));

  const res = solveScene(twoBlocks);
  check('8 · cut tool', 'a = F/(mA+mB) = 2 m/s²', res.accelerations.A, 2, 1e-6);
  check('8 · cut tool', 'A and B move together', res.accelerations.B, 2, 1e-6);
  check('8 · cut tool', 'contact force = mB·a = 6 N', res.normals.cAB, 6, 1e-6);
  check('8 · cut tool', 'ground normal on A = 19.6 N', res.normals.cA, 19.6, 1e-6);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Post-checks are REPORTED, never swallowed — and a broken assumption is
//    RE-SOLVED, not just complained about.
//    9a  A 5 kg block on a table tied to a 6 kg hanging mass, with μ = 0.1.
//        Assume it holds → the required static friction is m2 g = 58.8 N, but
//        only μₛN = 0.1 × 49 = 4.9 N is available. The assumption is disproved,
//        so the engine re-solves with kinetic friction:
//            a = (m2 g − μN)/(m1 + m2) = (58.8 − 4.9)/11 = 4.900 m/s²
//            T = m2(g − a) = 6 × 4.9 = 29.400 N
//            f = −4.900 N (signed along +x; the block slides +x, friction opposes)
//    9b  Static friction that IS enough: μₛ = 2.0 → available 98 N > 58.8 N.
// ─────────────────────────────────────────────────────────────────────────────
{
  const sticky = (mu) => ({
    ...tableHang,
    bodies: tableHang.bodies.map((b) => (b.id === 'm1' ? { ...b, mass: 5 } : b)),
    contacts: [{ id: 'c1', bodyA: 'm1', bodyB: WORLD_GROUND, normalDeg: 90, mu_s: mu, slidingSign: 0 }],
  });
  const slips = solveScene(sticky(0.1));
  assert('9 · post-checks', '9a warns that μsN is not enough',
    slips.warnings.some((w) => /static friction/i.test(w) && /4\.900/.test(w)),
    slips.warnings.join(' | '));
  assert('9 · post-checks', '9a says it re-solved as kinetic',
    slips.warnings.some((w) => /re-solved with kinetic friction/i.test(w)),
    slips.warnings.join(' | '));
  check('9 · post-checks', '9a re-solved a = 4.9 m/s²', slips.accelerations.m1, 4.9, 1e-5);
  check('9 · post-checks', '9a re-solved T = 29.4 N', slips.tensions.s1, 29.4, 1e-5);
  check('9 · post-checks', '9a kinetic friction = −4.9 N', slips.frictions.c1, -4.9, 1e-5);
  assert('9 · post-checks', '9a still not singular', slips.singular === false);

  const holds = solveScene(sticky(2.0));
  check('9 · post-checks', '9b a = 0 when friction holds', holds.accelerations.m1, 0, 1e-9);
  assert('9 · post-checks', '9b no warning when μsN is enough',
    !holds.warnings.some((w) => /static friction/i.test(w)), holds.warnings.join(' | '));

  // A string that must push is a string that has gone slack.
  const upsideDown = {
    bodies: [
      { id: 'anchor', shape: 'block', mass: 0, pos: { x: 0, y: 0 }, fixed: true },
      { id: 'm1', shape: 'block', mass: 1, pos: { x: 0, y: 1 }, size: { w: 0.2, h: 0.2 } },
    ],
    contacts: [],
    strings: [{ id: 's1', path: ['anchor', 'm1'], taut: true }],
  };
  const slack = solveScene(upsideDown);
  assert('9 · post-checks', '9c a string forced to push reports slack',
    slack.slackStrings.includes('s1'), JSON.stringify(slack.tensions));

  // A statically INDETERMINATE scene must be reported, not guessed at: a block
  // resting on two supports with the same normal has two unknown reactions and
  // only one perpendicular equation, so how the load splits between them is not
  // decidable by rigid-body statics. The engine must say so rather than invent
  // a split. (This is the four-legged-table problem.)
  const underdetermined = {
    bodies: [
      { id: 'm1', shape: 'block', mass: 1, pos: { x: 0, y: 0 }, size: { w: 0.6, h: 0.2 } },
    ],
    contacts: [
      { id: 'c1', bodyA: 'm1', bodyB: WORLD_GROUND, normalDeg: 90 },
      { id: 'c2', bodyA: 'm1', bodyB: WORLD_GROUND, normalDeg: 90 },
    ],
    strings: [],
  };
  const bad = solveScene(underdetermined);
  assert('9 · post-checks', '9d singular scenes are reported, not faked',
    bad.singular === true && bad.warnings.length > 0, JSON.stringify(bad.warnings));
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. svg.ts geometry — the y-flip lives in exactly one place.
//     A point 1 m ABOVE the view centre must land ABOVE the screen centre,
//     i.e. at a SMALLER screen y.
// ─────────────────────────────────────────────────────────────────────────────
{
  const view = { cx: 0, cy: 0, scale: 100, w: 800, h: 600 };
  const up = worldToScreen({ x: 0, y: 1 }, view);
  check('10 · svg geometry', 'x maps to viewport centre', up.x, 400, 1e-9);
  check('10 · svg geometry', 'physics +y maps to screen −y', up.y, 200, 1e-9);
  const right = worldToScreen({ x: 2, y: 0 }, view);
  check('10 · svg geometry', 'physics +x maps to screen +x', right.x, 600, 1e-9);

  const arrow = arrowPath({ x: 0, y: 0 }, { x: 100, y: 0 }, 10);
  assert('10 · svg geometry', 'arrow shaft stops short of the tip',
    /L 91\.5 0$/.test(arrow.shaft), arrow.shaft);
  assert('10 · svg geometry', 'arrow head is a closed triangle',
    arrow.head.startsWith('M 100 0') && arrow.head.endsWith('Z'), arrow.head);

  const off = labelOffset(90, 20);
  check('10 · svg geometry', 'label for "up" is offset upward on screen', off.dy, -20, 1e-9);
  check('10 · svg geometry', 'label for "up" has no x offset', off.dx, 0, 1e-9);
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. REGRESSION — a rough ground contact under a FIXED body must not poison
//     the scene. (Found by the FBD Studio agent: a bolted wedge with μ = 0.6
//     under it used to introduce an unpinned f and an a for a body that cannot
//     move, making a plain frictionless incline report singular with a = 0.)
//
//     A `fixed: true` body contributes no acceleration unknown and no equation
//     of motion; a contact between two pinned things is pure statics.
//     The block is unaffected:  a = g sin30 = 4.900 m/s²
//     Wedge–ground normal:      N₂ = Mg + mg cos²30 = 78.4 + 14.700 = 93.100 N
//     Wedge–ground friction:    f₂ = −mg sin30 cos30 = −8.487 N
//       (the block presses the wedge down-and-right with mg cos30 at 300°, whose
//        horizontal part is mg sin30 cos30; the ground must hold that back)
//     Available: μₛN₂ = 0.6 × 93.1 = 55.86 N ≫ 8.487 N, so nothing slides.
// ─────────────────────────────────────────────────────────────────────────────
{
  const base = inclineScene(null);
  const roughBase = {
    ...base,
    // Give the wedge real mass — M = 8 kg — so the ground reaction exercises
    // the full Mg + mg cos²θ result rather than just the block's share.
    bodies: base.bodies.map((b) => (b.id === 'wedge' ? { ...b, mass: 8 } : b)),
    contacts: [
      ...base.contacts,
      { id: 'c2', bodyA: 'wedge', bodyB: WORLD_GROUND, normalDeg: 90, mu_s: 0.6, mu_k: 0.45, slidingSign: 0 },
    ],
  };
  const res = solveScene(roughBase);
  assert('11 · fixed body + rough ground', 'not singular', !res.singular, res.warnings.join(' | '));
  check('11 · fixed body + rough ground', 'block still a = g sin30', res.accelerations.m1, 4.9, 1e-5);
  check('11 · fixed body + rough ground', 'block N unchanged', res.normals.c1, 2 * G * Math.cos(Math.PI / 6), 1e-5);
  check('11 · fixed body + rough ground', 'wedge a is identically 0', res.accelerations.wedge, 0, 1e-12);
  check('11 · fixed body + rough ground', 'wedge–ground N = 93.1 N', res.normals.c2, 93.1, 1e-4);
  check('11 · fixed body + rough ground', 'wedge–ground f = −mg sin30 cos30',
    res.frictions.c2, -2 * G * Math.sin(Math.PI / 6) * Math.cos(Math.PI / 6), 1e-4);
  assert('11 · fixed body + rough ground', 'no static-friction warning',
    !res.warnings.some((w) => /static friction/i.test(w)), res.warnings.join(' | '));
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. REGRESSION — STACKED BODIES MUST BE COUPLED. (Found by the FBD Studio
//     agent: `two-stacked-blocks` returned {mB: 2.742, mA: 0} with
//     singular: false — a wrong number delivered confidently, because nothing
//     tied the top block's acceleration to the bottom one's.)
//
//     mA = 2 kg on mB = 5 kg, hand pushes the BOTTOM block with 24 N.
//     μ between them 0.5 (μₖ 0.375); ground μₖ = 0.15, already sliding.
//
//       N(A on B)  = mA g                    = 19.600 N
//       N(B on gnd)= (mA + mB) g             = 68.600 N
//       ground friction = 0.15 × 68.6        = 10.290 N, backwards
//       ride-along ⇒ they share a:
//           a = (24 − 10.29)/(2 + 5) = 13.71/7 = 1.958571 m/s²
//       friction the top block needs = mA a   = 3.917143 N
//       available = μₛ N = 0.5 × 19.6        = 9.800 N  ✓ holds
//
//     12b  Make the interface slippery (μₛ 0.05, μₖ 0.0375): the cap drops to
//          0.98 N < 3.917 N, the ride-along assumption breaks, and the blocks
//          DECOUPLE — the top one is dragged along by kinetic friction alone:
//              f = 0.0375 × 19.6 = 0.735 N  →  a(mA) = 0.735/2 = 0.367500 m/s²
//              a(mB) = (24 − 10.29 − 0.735)/5 = 12.975/5 = 2.595000 m/s²
//          and a(mB) > a(mA), which is what "it slides out from under" means.
// ─────────────────────────────────────────────────────────────────────────────
const stacked = (muAB, muK) => ({
  bodies: [
    { id: 'mB', shape: 'block', mass: 5, pos: { x: 1.4, y: 0.25 }, size: { w: 1.0, h: 0.5 }, dofDeg: 0 },
    { id: 'mA', shape: 'block', mass: 2, pos: { x: 1.4, y: 0.68 }, size: { w: 0.62, h: 0.36 }, dofDeg: 0 },
  ],
  contacts: [
    { id: 'cAB', bodyA: 'mA', bodyB: 'mB', normalDeg: 90, mu_s: muAB, mu_k: muK, slidingSign: 0 },
    { id: 'cBg', bodyA: 'mB', bodyB: WORLD_GROUND, normalDeg: 90, mu_s: 0.2, mu_k: 0.15, slidingSign: 1 },
  ],
  strings: [],
  applied: [{ id: 'F1', body: 'mB', from: WORLD_HAND, mag: 24, angleDeg: 0, label: 'push' }],
});

{
  const ride = deriveConstraints(stacked(0.5, 0.375))
    .find((e) => e.id === 'contact_cAB_ride');
  assert('12 · stacked blocks', 'a ride-along constraint is derived', !!ride,
    'no contact_cAB_ride constraint');
  check('12 · stacked blocks', 'coeff a(mA)', ride?.terms.find((t) => t.bodyId === 'mA')?.coeff, 1, 1e-9);
  check('12 · stacked blocks', 'coeff a(mB)', ride?.terms.find((t) => t.bodyId === 'mB')?.coeff, -1, 1e-9);
  assert('12 · stacked blocks', 'ledger calls it an assumption',
    /ASSUMPTION/.test(ride?.derivation ?? ''), ride?.derivation);

  const res = solveScene(stacked(0.5, 0.375));
  assert('12 · stacked blocks', 'not singular', !res.singular, res.warnings.join(' | '));
  check('12 · stacked blocks', 'N between them = 19.6 N', res.normals.cAB, 19.6, 1e-5);
  check('12 · stacked blocks', 'N on the ground = 68.6 N', res.normals.cBg, 68.6, 1e-5);
  check('12 · stacked blocks', 'a(mB) = 13.71/7', res.accelerations.mB, 13.71 / 7, 1e-6);
  check('12 · stacked blocks', 'a(mA) = a(mB) — they ride together',
    res.accelerations.mA, 13.71 / 7, 1e-6);
  check('12 · stacked blocks', 'friction carrying the top block = mA·a',
    res.frictions.cAB, 2 * (13.71 / 7), 1e-6);
  assert('12 · stacked blocks', 'no warning — the assumption holds',
    !res.warnings.some((w) => /static friction/i.test(w)), res.warnings.join(' | '));

  const slip = solveScene(stacked(0.05, 0.0375));
  assert('12 · stacked blocks', '12b warns the ride-along broke',
    slip.warnings.some((w) => /static friction/i.test(w) && /0\.980/.test(w)),
    slip.warnings.join(' | '));
  check('12 · stacked blocks', '12b a(mA) = 0.3675 m/s²', slip.accelerations.mA, 0.3675, 1e-6);
  check('12 · stacked blocks', '12b a(mB) = 2.595 m/s²', slip.accelerations.mB, 2.595, 1e-6);
  assert('12 · stacked blocks', '12b they have decoupled',
    slip.accelerations.mB > slip.accelerations.mA + 1e-6);

  // Bodies coupled by a NORMAL were already fine — guard against regressing it.
  const sideBySide = {
    bodies: [
      { id: 'mA', shape: 'block', mass: 2, pos: { x: 1.0, y: 0.25 }, size: { w: 0.7, h: 0.5 }, dofDeg: 0 },
      { id: 'mB', shape: 'block', mass: 3, pos: { x: 1.75, y: 0.25 }, size: { w: 0.8, h: 0.5 }, dofDeg: 0 },
    ],
    contacts: [
      { id: 'cAB', bodyA: 'mA', bodyB: 'mB', normalDeg: 180, mu_s: 0, mu_k: 0, slidingSign: 0 },
      { id: 'cAg', bodyA: 'mA', bodyB: WORLD_GROUND, normalDeg: 90 },
      { id: 'cBg', bodyA: 'mB', bodyB: WORLD_GROUND, normalDeg: 90 },
    ],
    strings: [],
    applied: [{ id: 'F1', body: 'mA', from: WORLD_HAND, mag: 25, angleDeg: 0, label: 'push' }],
  };
  const side = solveScene(sideBySide);
  check('12 · stacked blocks', 'side-by-side still a = 25/5 = 5', side.accelerations.mA, 5, 1e-6);
  check('12 · stacked blocks', 'side-by-side contact N = mB·a = 15 N', side.normals.cAB, 15, 1e-6);

  // The ride-along coupling must reach the LEDGER, not just the solver — the
  // whole point is that the student sees why the two are tied together.
  const res2 = solveScene(stacked(0.5, 0.375));
  assert('12 · stacked blocks', 'the coupling appears in SolveResult.constraints',
    res2.constraints.some((e) => e.id === 'contact_cAB_ride'),
    res2.constraints.map((e) => e.id).join(','));

  // 12c  An INDETERMINATE contact must be reported, not invented. Put friction
  //      on the vertical interface between two side-by-side blocks: neither can
  //      move vertically, so how much friction acts there depends on the
  //      pressure distribution — rigid-body mechanics cannot decide it. The
  //      engine must say so and still solve the rest of the scene correctly.
  const indeterminate = {
    ...sideBySide,
    contacts: sideBySide.contacts.map((c) =>
      (c.id === 'cAB' ? { ...c, mu_s: 0.5, mu_k: 0.375 } : c)),
  };
  const ind = solveScene(indeterminate);
  const ride2 = deriveContactCouplings(indeterminate)
    .find((k) => k.contactId === 'cAB' && k.kind === 'ride-along');
  assert('12 · stacked blocks', '12c the coupling is flagged degenerate',
    !!ride2 && ride2.equation === null, JSON.stringify(ride2?.equation));
  assert('12 · stacked blocks', '12c not singular — the rest still solves',
    !ind.singular, ind.warnings.join(' | '));
  check('12 · stacked blocks', '12c a is still 5 m/s²', ind.accelerations.mA, 5, 1e-6);
  assert('12 · stacked blocks', '12c warns it is not decidable',
    ind.warnings.some((w) => /not decidable/i.test(w)), ind.warnings.join(' | '));
  check('12 · stacked blocks', '12c friction reported as 0, not invented',
    ind.frictions.cAB, 0, 1e-12);
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. A SHEAVE WITH MASS — the rung where T₁ ≠ T₂ for the first time.
//     Atwood, m₁ = 3 kg and m₂ = 5 kg, over a uniform disc M = 2 kg, r = 0.1 m,
//     so I = ½Mr² = 0.010 kg m² and I/r² = 1.000 kg (the sheave's "effective
//     mass" — it resists being spun up exactly as an extra 1 kg would resist
//     being dragged).
//
//       a  = (m₂ − m₁)g / (m₁ + m₂ + I/r²) = 2 × 9.8 / 9 = 2.177778 m/s²
//       T₁ = m₁(g + a) = 3 × 11.977778        = 35.933333 N   (the rising side)
//       T₂ = m₂(g − a) = 5 ×  7.622222        = 38.111111 N   (the falling side)
//
//     and the two differ by exactly what the torque needs:
//       (T₁ − T₂)·r = −0.217778 N m = I·α  with α = a/r = 21.77778 rad/s².
//     Sanity: set M = 0 and this must collapse back to the rung-2 answer,
//     a = 2.45 and one tension of 36.75 N.
// ─────────────────────────────────────────────────────────────────────────────
const massiveAtwood = (M) => {
  const r = 0.1;
  return {
    bodies: [
      {
        id: 'p1', shape: 'pulley', mass: M, pos: { x: 0, y: 2 }, radius: r, fixed: true,
        // Uniform disc about its centre, I = ½MR² (NCERT Class 11 table).
        ...(M > 0 ? { inertia: 0.5 * M * r * r } : {}),
      },
      { id: 'm1', shape: 'block', mass: 3, pos: { x: -r, y: 0.5 }, size: { w: 0.3, h: 0.3 } },
      { id: 'm2', shape: 'block', mass: 5, pos: { x: r, y: 0.5 }, size: { w: 0.3, h: 0.3 } },
    ],
    contacts: [],
    strings: [{ id: 's1', path: ['m1', 'p1', 'm2'], taut: true }],
  };
};

{
  const I = 0.5 * 2 * 0.1 * 0.1;          // 0.010 kg m²
  const aExp = 19.6 / 9;                  // 2.177778 m/s²
  const scene = massiveAtwood(2);
  const res = solveScene(scene);

  assert('13 · sheave with mass', 'not singular', !res.singular, res.warnings.join(' | '));
  check('13 · sheave with mass', 'a = (m₂−m₁)g/(m₁+m₂+I/r²)', res.accelerations.m2, aExp, 1e-6);
  check('13 · sheave with mass', 'a₁ = −a (3 kg rises)', res.accelerations.m1, -aExp, 1e-6);
  check('13 · sheave with mass', 'T₁ = m₁(g+a) = 35.933 N', res.tensions['s1#0'], 3 * (G + aExp), 1e-5);
  check('13 · sheave with mass', 'T₂ = m₂(g−a) = 38.111 N', res.tensions['s1#1'], 5 * (G - aExp), 1e-5);
  assert('13 · sheave with mass', 'THE POINT: T₁ ≠ T₂',
    Math.abs(res.tensions['s1#0'] - res.tensions['s1#1']) > 1e-3,
    `${res.tensions['s1#0']} vs ${res.tensions['s1#1']}`);
  // (T₁ − T₂)·r must be exactly Iα, with α = a/r and the rising side's sign.
  check('13 · sheave with mass', '(T₁−T₂)·r = Iα',
    (res.tensions['s1#0'] - res.tensions['s1#1']) * 0.1,
    I * (res.accelerations.m1 / 0.1), 1e-9);
  check('13 · sheave with mass', 'tensions[id] still a real number (run 0)',
    res.tensions.s1, 3 * (G + aExp), 1e-5);

  // The no-slip assumption must be NAMED, exactly like the ride-along one.
  const torque = res.constraints.find((c) => c.id === 'torque_s1_p1');
  assert('13 · sheave with mass', 'a torque row reaches the ledger', !!torque,
    res.constraints.map((c) => c.id).join(','));
  assert('13 · sheave with mass', 'the ledger names no-slip as an ASSUMPTION',
    /does not slip/i.test(torque?.derivation ?? '') && /ASSUMPTION/.test(torque?.derivation ?? ''),
    torque?.derivation);

  // The sheave's own FBD must show the two sides pulling differently.
  const onSheave = solvedForcesFor(scene, 'p1').filter((f) => f.kind === 'tension');
  check('13 · sheave with mass', 'sheave carries two tension arrows', onSheave.length, 2);
  assert('13 · sheave with mass', 'and their magnitudes differ',
    Math.abs((onSheave[0].magnitude ?? 0) - (onSheave[1].magnitude ?? 0)) > 1e-3,
    onSheave.map((f) => f.magnitude).join(' / '));

  // Collapse: a massless sheave must give back rung 2, exactly.
  const massless = solveScene(massiveAtwood(0));
  check('13 · sheave with mass', 'M = 0 collapses to a = 2.45', massless.accelerations.m2, 2.45, 1e-6);
  check('13 · sheave with mass', 'M = 0 collapses to T = 36.75', massless.tensions.s1, 36.75, 1e-6);
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. The split must be STRICTLY conditional on inertia — a massless sheave
//     keeps exactly ONE tension, or every rung below it silently changes.
// ─────────────────────────────────────────────────────────────────────────────
{
  const keys = (r) => Object.keys(r.tensions).filter((k) => k.startsWith('s1'));

  const plain = solveScene(atwood);
  check('14 · split is conditional', 'massless sheave: exactly one tension key',
    keys(plain).length, 1);
  check('14 · split is conditional', 'and it is the plain string id', keys(plain)[0], 's1');

  // inertia but no radius, and radius but no inertia, must BOTH stay unsplit —
  // a torque row needs r to convert the rope's acceleration into α.
  const noRadius = {
    ...atwood,
    bodies: atwood.bodies.map((b) => (b.id === 'p1' ? { ...b, inertia: 0.01, radius: 0 } : b)),
  };
  check('14 · split is conditional', 'inertia without radius does not split',
    keys(solveScene(noRadius)).length, 1);
  check('14 · split is conditional', 'radius without inertia does not split',
    keys(solveScene(atwood)).length, 1);

  // A rigid sheave has ONE angular acceleration; two wraps cannot each get their
  // own torque row. That must fail loudly rather than return a plausible number.
  const doubleWrapped = {
    bodies: [
      ...massiveAtwood(2).bodies,
      { id: 'm3', shape: 'block', mass: 1, pos: { x: -0.1, y: -1 }, size: { w: 0.3, h: 0.3 } },
      { id: 'm4', shape: 'block', mass: 1, pos: { x: 0.1, y: -1 }, size: { w: 0.3, h: 0.3 } },
    ],
    contacts: [],
    strings: [
      { id: 's1', path: ['m1', 'p1', 'm2'], taut: true },
      { id: 's2', path: ['m3', 'p1', 'm4'], taut: true },
    ],
  };
  const dw = solveScene(doubleWrapped);
  assert('14 · split is conditional', 'a twice-wrapped massive sheave is refused',
    dw.singular === true, JSON.stringify(dw.accelerations));
  assert('14 · split is conditional', 'and the refusal explains why',
    dw.warnings.some((w) => /wrapped 2 times/.test(w) && /single angular acceleration/.test(w)),
    dw.warnings.join(' | '));
}

// ── Report ───────────────────────────────────────────────────────────────────

const W1 = Math.max(...results.map((r) => r.group.length), 5);
const W2 = Math.max(...results.map((r) => r.name.length), 5);
const W3 = Math.max(...results.map((r) => r.actual.length), 6);

let lastGroup = '';
console.log('');
console.log(`${'GROUP'.padEnd(W1)}  ${'CHECK'.padEnd(W2)}  ${'GOT'.padEnd(W3)}  EXPECTED`);
console.log('─'.repeat(W1 + W2 + W3 + 24));
for (const r of results) {
  const group = r.group === lastGroup ? '' : r.group;
  lastGroup = r.group;
  console.log(
    `${group.padEnd(W1)}  ${r.name.padEnd(W2)}  ${r.actual.padEnd(W3)}  ${r.expected}  ${r.ok ? 'PASS' : 'FAIL'}`,
  );
}
console.log('─'.repeat(W1 + W2 + W3 + 24));
console.log(`${results.length - failures}/${results.length} passed${failures ? `, ${failures} FAILED` : ''}`);
console.log('');

process.exit(failures ? 1 : 0);
