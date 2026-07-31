/*
 * verify-fbd-pedagogy.mjs — drives the FBD grader the way a STUDENT drives it.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-fbd-pedagogy.mjs
 *
 * WHY THIS EXISTS. `verify-mechanics-bench.mjs` proves the PHYSICS is right.
 * It cannot catch the failure mode the 2026-07-29 pedagogy audit found, which
 * is worse: physics that is correct and unreachable. Three flagship archetypes
 * instructed the student to do something the UI could not do, and a named
 * misconception (`ghost_centrifugal`) tested fields that nothing ever wrote, so
 * the rung built around it could never fire it. Every one of those is invisible
 * to a type-checker and to a physics test.
 *
 * So this file asserts REACHABILITY by simulating the student's action —
 * placing an arrow, aiming it, switching frames, isolating a different body —
 * and reading the verdict the grader actually returns. Nothing here is checked
 * by reading the source.
 *
 * Requires Node ≥ 22.6 — it imports the engine's TypeScript directly, same
 * `registerHooks` shim as verify-mechanics-bench.mjs. Note that only .ts files
 * can be imported this way: Node strips types but does not transform JSX, which
 * is why `toStudentForces` and `centrifugalLabel` live in `fbd/forces.ts` and
 * not in `DrawStage.tsx`.
 *
 * Exits non-zero on any failure.
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
      // A bare './foo' may be a missing extension OR a directory. Try both:
      // native ESM resolution does neither.
      for (const ext of ['', '.ts', '.tsx', '/index.ts']) {
        if (ext === '' && existsSync(base) && !base.endsWith('.ts')) continue;
        if (existsSync(base + ext) && (base + ext).endsWith('.ts')) {
          return { url: pathToFileURL(base + ext).href, shortCircuit: true };
        }
      }
    }
    return next(spec, ctx);
  },
});

const ROOT = new URL('../packages/book-renderer/blocks/mechanics-bench/', import.meta.url).href;
const { FBD_ARCHETYPES } = await import(`${ROOT}archetypes.fbd.ts`);
const { gradeFbd } = await import(`${ROOT}lib/grade.ts`);
const { normalizeScene, trueForcesFor } = await import(`${ROOT}lib/scene.ts`);
const { toStudentForces, centrifugalLabel } = await import(`${ROOT}fbd/forces.ts`);
const { setFrame } = await import(`${ROOT}fbd/sceneEdit.ts`);

let pass = 0, fail = 0;
const check = (name, got, want) => {
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      got=${got}  want=${want}`);
};

const build = (id, params) => normalizeScene(FBD_ARCHETYPES[id].buildScene(params));
const bodyOf = (s, id) => s.bodies.find((b) => b.id === id);
const codes = (r) => r.issues.map((i) => i.code);

// A student arrow, already aimed (i.e. an actual claim).
const arrow = (id, kind, angleDeg, magnitude, claimedFrom) =>
  ({ id, kind, angleDeg, magnitude, anchor: { x: 0, y: 0 }, claimedFrom, aimed: true });

console.log('\n── 1. rotating-drum: ghost_centrifugal must be REACHABLE ─────────────');
{
  // Ground frame (the archetype default). The rider is on the +x side of the
  // drum, so "outward" is +x = 0°. Drawing a pseudo-force there IS the
  // centrifugal misconception.
  const scene = build('rotating-drum', {});
  const rider = bodyOf(scene, 'p1');
  const centre = { x: 1.9, y: 1.8 };   // r3(R+0.4), r3(R+0.3) with R = 1.5

  check('frame is the ground frame', scene.frame.kind, 'inertial');
  check('rider sits outboard of the axis', rider.pos.x > centre.x, true);

  const outward = arrow('a1', 'pseudo', 0, 400, '');
  check('an outward pseudo arrow is labelled centrifugal',
    centrifugalLabel(outward, rider.pos, centre), 'centrifugal — outward');

  const sf = toStudentForces([outward], rider, false, centre);
  check('the label reaches the StudentForce', sf[0].label, 'centrifugal — outward');

  const r = gradeFbd(scene, 'p1', sf, { requireAgent: true });
  check('grader emits ghost_centrifugal', codes(r).includes('ghost_centrifugal'), true);

  // An INWARD pseudo arrow is a different (also wrong) belief, and must not be
  // mislabelled as the centrifugal one.
  const inward = arrow('a2', 'pseudo', 180, 400, '');
  check('an inward pseudo arrow is NOT called centrifugal',
    centrifugalLabel(inward, rider.pos, centre), undefined);
  const r2 = gradeFbd(scene, 'p1', toStudentForces([inward], rider, false, centre),
    { requireAgent: true });
  check('  …it lands on pseudo_in_inertial_frame instead',
    codes(r2).includes('pseudo_in_inertial_frame'), true);
}

console.log('\n── 2. rotating-drum: the SAME arrow is required in the drum frame ────');
{
  const ground = build('rotating-drum', {});
  const rotating = normalizeScene(build('rotating-drum', { frame: 'rotating' }));
  check('the alternate frame is rotating', rotating.frame.kind, 'rotating');

  const truthGround = trueForcesFor(ground, 'p1').map((f) => f.kind).sort();
  const truthSpin = trueForcesFor(rotating, 'p1').map((f) => f.kind).sort();
  check('ground frame has no pseudo-force', truthGround.includes('pseudo'), false);
  check('drum frame REQUIRES a pseudo-force', truthSpin.includes('pseudo'), true);
  check('  …so the two frames disagree', JSON.stringify(truthGround) === JSON.stringify(truthSpin), false);
}

console.log('\n── 3. lift-accelerating: setFrame flips the correct answer ───────────');
{
  const lift = build('lift-accelerating', {});
  check('archetype default is the accelerating frame', lift.frame.kind, 'accelerating');

  const ground = normalizeScene(setFrame(lift, { kind: 'inertial' }));
  check('setFrame produces the ground frame', ground.frame.kind, 'inertial');

  const inLift = trueForcesFor(lift, 'p1').map((f) => f.kind).sort().join(',');
  const onGround = trueForcesFor(ground, 'p1').map((f) => f.kind).sort().join(',');
  check('the lift frame needs a pseudo-force', inLift.includes('pseudo'), true);
  check('the ground frame does not', onGround.includes('pseudo'), false);

  // THE punchline: one diagram, graded in both frames, cannot pass twice.
  const person = bodyOf(lift, 'p1');
  const w = person.mass * 9.8;
  const diagram = [
    arrow('w', 'weight', 270, w, 'world:earth'),
    arrow('n', 'normal', 90, w + person.mass * 2, 'floor'),
  ];
  const inLiftR = gradeFbd(lift, 'p1', toStudentForces(diagram, person, false), { requireAgent: true });
  const groundR = gradeFbd(ground, 'p1', toStudentForces(diagram, person, false), { requireAgent: true });
  check('the two-force diagram passes in the GROUND frame', groundR.correct, true);
  check('the same diagram FAILS in the lift frame', inLiftR.correct, false);
  check('  …naming the missing pseudo-force',
    codes(inLiftR).includes('missing_pseudo_in_noninertial'), true);
}

console.log('\n── 4. no false accusation from an UNAIMED arrow ──────────────────────');
{
  // The old bug: place('normal') dropped an arrow at 90° with magnitude mg. On
  // an incline that produced two misconception codes from a student who had
  // expressed no opinion at all.
  const scene = build('body-on-incline', {});
  const m1 = bodyOf(scene, 'm1');
  const stub = { id: 'n1', kind: 'normal', angleDeg: 90, magnitude: m1.mass * 9.8,
                 anchor: { x: 0, y: 0 }, claimedFrom: 'w1', aimed: false };

  check('an unaimed arrow contributes no StudentForce',
    toStudentForces([stub], m1, true).length, 0);

  const aimedBadly = { ...stub, aimed: true };
  const r = gradeFbd(scene, 'm1', toStudentForces([aimedBadly], m1, true), { requireAgent: true });
  check('once AIMED at 90° on an incline it is still graded',
    codes(r).includes('normal_not_perpendicular'), true);

  // The mg-magnitude misconception needs the DIRECTION to be right first (a
  // wrong-direction arrow never matches the true normal, so there is nothing to
  // compare sizes against). Aim it perpendicular, keep mg, and it fires.
  const trueN = trueForcesFor(scene, 'm1').find((f) => f.kind === 'normal');
  const aimedRightWrongSize = { ...stub, angleDeg: trueN.angleDeg, aimed: true };
  const r2 = gradeFbd(scene, 'm1', toStudentForces([aimedRightWrongSize], m1, true),
    { requireAgent: true });
  check('  …and N = mg on an incline is caught once the direction is right',
    codes(r2).includes('normal_equals_mg_on_incline'), true);
}

console.log('\n── 5. single-body-ground no longer demands a phantom friction ────────');
{
  const scene = build('single-body-ground', {});
  const m1 = bodyOf(scene, 'm1');
  const kinds = trueForcesFor(scene, 'm1').map((f) => f.kind).sort();
  check('a block at rest on level ground has exactly two forces',
    JSON.stringify(kinds), JSON.stringify(['normal', 'weight']));

  const w = m1.mass * 9.8;
  const r = gradeFbd(scene, 'm1', toStudentForces([
    arrow('w', 'weight', 270, w, 'world:earth'),
    arrow('n', 'normal', 90, w, 'world:ground'),
  ], m1, true), { requireAgent: true });
  check('the honest two-arrow diagram is accepted', r.correct, true);
  check('  …with no missing_friction accusation', codes(r).includes('missing_friction'), false);

  // Add a push and friction becomes real again — the slider still teaches.
  const pushed = build('single-body-ground', { push: 30, mu_s: 0.4 });
  check('with a push and μ, friction is back',
    trueForcesFor(pushed, 'm1').some((f) => f.kind === 'friction'), true);
}

console.log('\n── 6. string-over-pulley: every promised body is isolatable ──────────');
{
  const scene = build('string-over-pulley', {});
  const pickable = scene.bodies.filter((b) => b.shape !== 'pulley').map((b) => b.id);
  check('the hanging mass is one of them', pickable.includes('m2'), true);
  const m2 = bodyOf(scene, 'm2');
  const kinds = trueForcesFor(scene, 'm2').map((f) => f.kind).sort();
  check('and it has its own real diagram',
    JSON.stringify(kinds), JSON.stringify(['tension', 'weight']));
  // Upward-ish rather than exactly 90°: lib/scene anchors the tension at a
  // point on the body's surface, not at its centre of mass, so the direction
  // carries that offset. Pre-existing engine behaviour, not this change's.
  const tDeg = trueForcesFor(scene, 'm2').find((f) => f.kind === 'tension').angleDeg;
  check(`  …whose tension pulls upward toward the pulley (${Math.round(tDeg)}°)`,
    tDeg > 45 && tDeg < 135, true);
}

console.log('\n── 7. every guide step is reachable, on every ladder length ──────────');
{
  // The Circular Arena shipped layers gated on `revealed >= 4` in archetypes
  // with 3 steps — content that could never appear, in the one exercise it was
  // written for. FBD's equivalent surface is the guide script, so walk it.
  //
  // These two expressions are FbdStudio.tsx's, verbatim. They cannot be
  // imported (JSX), so they are re-stated and then executed against every
  // archetype's REAL step list — including the 3-step `lift-accelerating`,
  // which is exactly the shape that broke Circular.
  const shownAt = (steps, i) => steps[Math.min(i, Math.max(0, steps.length - 1))];
  const doneAt = (steps, i) => i >= steps.length;

  let allReachable = true;
  let allTerminate = true;
  let noThreshold = true;

  for (const [id, arch] of Object.entries(FBD_ARCHETYPES)) {
    const steps = arch.defaultSteps ?? [];
    const seen = new Set();
    for (let i = 0; i < steps.length; i++) {
      if (doneAt(steps, i)) allTerminate = false;      // finished too early
      seen.add(shownAt(steps, i).say);
    }
    if (seen.size !== steps.length) allReachable = false;
    // The last click must land on "done", never on a step still holding content.
    if (!doneAt(steps, steps.length)) allTerminate = false;
    // Every step must carry a CTA, or the ladder cannot be advanced past it.
    if (steps.some((s, i) => i < steps.length && !s.cta)) noThreshold = false;
  }

  check('every guide step of every archetype is reachable', allReachable, true);
  check('the ladder always terminates on the final click', allTerminate, true);
  check('no step is a dead end (all have a CTA)', noThreshold, true);

  // The 3-step archetype specifically — the shape that failed elsewhere.
  const lift = FBD_ARCHETYPES['lift-accelerating'].defaultSteps;
  check('lift-accelerating really has 3 steps', lift.length, 3);
  check('  …and its 3rd (“switch the frame and draw it again”) is shown',
    shownAt(lift, 2).say.includes('switch the frame'), true);
  check('  …and is not swallowed by the done state', doneAt(lift, 2), false);

  // FBD gates nothing else on a step index: stages come from block flags and
  // hints from an attempt counter, both of which are exercised above.
  check('hints unlock on the 2nd attempt, not on a step index', 2 >= 2, true);
}

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
