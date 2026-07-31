/**
 * _verify_vector_archetypes.mts — computational check of the vector-board engine.
 *
 * There is no dev server in this workflow (CLAUDE.md §5.2), so the physics is
 * verified by evaluating each archetype directly and asserting against values
 * derived independently by hand. This is the same discipline used for the
 * math_graph label solver and the calc panel.
 *
 * Run:  npx tsx scripts/physics11-book/_verify_vector_archetypes.mts
 */

import {
  ARCHETYPES,
  seedVectors,
  tailOf,
  ALL_STEPS,
  type ArchetypeContext,
  type ShowFlags,
} from '../../packages/book-renderer/blocks/vector-board/archetypes';
import { magnitude, angle360, add } from '../../packages/book-renderer/blocks/simulations/vector-lab/lib/vectorMath';
import type { VectorSpec } from '../../packages/data/types/books';

const SHOW: ShowFlags = { grid: true, axes: true, components: true, angleArc: true, readout: true, formula: true };

let pass = 0;
let fail = 0;
function check(name: string, actual: number, expected: number, tol = 0.02) {
  const ok = Math.abs(actual - expected) <= tol;
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? '  ok  ' : '  FAIL'}  ${name}: got ${actual.toFixed(4)}, expected ${expected.toFixed(4)}`);
}
function checkBool(name: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? '  ok  ' : '  FAIL'}  ${name}: got ${actual}, expected ${expected}`);
}

function ctx(archetype: string, specs: VectorSpec[], t = 1, params = {}, step = ALL_STEPS): ArchetypeContext {
  return { vecs: seedVectors(specs), specs, params, units: 'N', show: SHOW, t, step };
}

console.log('\n── triangle-law / parallelogram-law: 3-4-5 right triangle ──');
{
  // A = 3 N along +x, B = 4 N along +y  →  |R| = 5, direction 53.13°.
  const specs: VectorSpec[] = [
    { label: 'A', mag: 3, angle: 0 },
    { label: 'B', mag: 4, angle: 90, tail: 'chain' },
  ];
  const r = ARCHETYPES['triangle-law'].build(ctx('triangle-law', specs));
  check('triangle-law |R|', magnitude(r.resultant!), 5);
  check('triangle-law direction', angle360(r.resultant!), 53.1301);

  // Same two vectors from a common tail must give the identical resultant —
  // the whole point of "triangle law and parallelogram law are one law".
  const pspecs: VectorSpec[] = [
    { label: 'A', mag: 3, angle: 0 },
    { label: 'B', mag: 4, angle: 90 },
  ];
  const p = ARCHETYPES['parallelogram-law'].build(ctx('parallelogram-law', pspecs));
  check('parallelogram-law |R| agrees', magnitude(p.resultant!), 5);
  check('parallelogram-law direction agrees', angle360(p.resultant!), 53.1301);
}

console.log('\n── parallelogram-law: the three textbook special cases ──');
{
  const cases: [number, number][] = [
    [0, 11],   // parallel   → R = A + B = 5 + 6
    [180, 1],  // antiparallel → R = |A − B|
    [90, Math.sqrt(61)], // perpendicular → √(25+36)
  ];
  for (const [between, expected] of cases) {
    const specs: VectorSpec[] = [
      { label: 'A', mag: 5, angle: 0 },
      { label: 'B', mag: 6, angle: between },
    ];
    const r = ARCHETYPES['parallelogram-law'].build(ctx('parallelogram-law', specs));
    check(`θ=${between}° → |R|`, magnitude(r.resultant!), expected);
  }
}

console.log('\n── vector-subtraction: A − B, and the B − A trap ──');
{
  // A = 5 N at 0°, B = 5 N at 90°  →  A − B has |·| = 5√2 at −45° (=315°).
  const specs: VectorSpec[] = [
    { label: 'A', mag: 5, angle: 0 },
    { label: 'B', mag: 5, angle: 90 },
  ];
  const r = ARCHETYPES['vector-subtraction'].build(ctx('vector-subtraction', specs));
  check('|A − B|', magnitude(r.resultant!), 5 * Math.SQRT2);
  check('A − B direction', angle360(r.resultant!), 315);
  // B − A must be exactly opposite — the misconception the block drills.
  check('B − A direction (opposite)', (angle360(r.resultant!) + 180) % 360, 135);
}

console.log('\n── resolution: components of 10 N at 30° ──');
{
  const specs: VectorSpec[] = [{ label: 'F', mag: 10, angle: 30, draggable: true }];
  const r = ARCHETYPES['resolution'].build(ctx('resolution', specs));
  const along = r.arrows.find((a) => a.label === 'F∥')!;
  const perp = r.arrows.find((a) => a.label === 'F⊥')!;
  check('F cos30°', magnitude(along.to), 10 * Math.cos(Math.PI / 6));
  check('F sin30°', magnitude(perp.to), 10 * Math.sin(Math.PI / 6));

  // Inclined-plane style: axis tilted to 30° means the whole vector lies along it.
  const r2 = ARCHETYPES['resolution'].build(ctx('resolution', specs, 1, { axis_angle: 30 }));
  const along2 = r2.arrows.find((a) => a.label === 'F∥')!;
  const perp2 = r2.arrows.find((a) => a.label === 'F⊥')!;
  check('tilted axis: parallel component = full F', magnitude(along2.to), 10);
  check('tilted axis: perpendicular component = 0', magnitude(perp2.to), 0);
}

console.log('\n── analytical-addition: component sums ──');
{
  const specs: VectorSpec[] = [
    { label: 'A', mag: 5, angle: 0 },
    { label: 'B', mag: 5, angle: 90 },
    { label: 'C', mag: 5, angle: 180 },
  ];
  const r = ARCHETYPES['analytical-addition'].build(ctx('analytical-addition', specs));
  check('Σx (5 − 5)', r.resultant!.x, 0);
  check('Σy', r.resultant!.y, 5);
}

console.log('\n── polygon-equilibrium: three 120°-apart forces close the polygon ──');
{
  const balanced: VectorSpec[] = [
    { label: 'F₁', mag: 5, angle: 0, tail: 'chain' },
    { label: 'F₂', mag: 5, angle: 120, tail: 'chain' },
    { label: 'F₃', mag: 5, angle: 240, tail: 'chain' },
  ];
  const rb = ARCHETYPES['polygon-equilibrium'].build(ctx('polygon-equilibrium', balanced));
  check('balanced net force ≈ 0', magnitude(rb.resultant!), 0);
  checkBool('balanced flag', !!rb.balanced, true);

  const unbalanced: VectorSpec[] = [
    { label: 'F₁', mag: 5, angle: 0, tail: 'chain' },
    { label: 'F₂', mag: 5, angle: 120, tail: 'chain' },
    { label: 'F₃', mag: 3, angle: 240, tail: 'chain' },
  ];
  const ru = ARCHETYPES['polygon-equilibrium'].build(ctx('polygon-equilibrium', unbalanced));
  checkBool('unbalanced flag', !!ru.balanced, false);
  check('leftover net force', magnitude(ru.resultant!), 2);
}

console.log('\n── dot-cross: sign behaviour through 90° ──');
{
  for (const [between, expDot] of [[0, 30], [60, 15], [90, 0], [120, -15], [180, -30]] as [number, number][]) {
    const specs: VectorSpec[] = [
      { label: 'A', mag: 5, angle: 0 },
      { label: 'B', mag: 6, angle: between },
    ];
    const r = ARCHETYPES['dot-cross'].build(ctx('dot-cross', specs));
    const row = r.readouts!.find((x) => x.label === 'A · B')!;
    check(`θ=${between}° → A·B`, parseFloat(row.value), expDot, 0.06);
  }
}

console.log('\n── scalar-vs-vector: distance ≠ displacement ──');
{
  // 4 east then 3 north: distance 7, displacement 5.
  const specs: VectorSpec[] = [
    { label: 'leg 1', mag: 4, angle: 0, tail: 'chain' },
    { label: 'leg 2', mag: 3, angle: 90, tail: 'chain' },
  ];
  const r = ARCHETYPES['scalar-vs-vector'].build(ctx('scalar-vs-vector', specs));
  check('displacement', magnitude(r.resultant!), 5);
  check('road covered', parseFloat(r.readouts!.find((x) => x.label === 'Road covered')!.value), 7);
}

console.log('\n── tip-to-tail chaining: tails land where they should ──');
{
  const specs: VectorSpec[] = [
    { label: 'A', mag: 3, angle: 0 },
    { label: 'B', mag: 4, angle: 90, tail: 'chain' },
  ];
  const vecs = seedVectors(specs);
  check('vector 0 tail x', tailOf(vecs, specs, 0).x, 0);
  check('vector 1 tail x (= A head)', tailOf(vecs, specs, 1).x, 3);
  check('vector 1 tail y', tailOf(vecs, specs, 1).y, 0);
  check('chain end = resultant', magnitude(add(tailOf(vecs, specs, 1), vecs[1])), 5);
}

console.log('\n── animation frames stay finite (t sweep) ──');
{
  const specs: VectorSpec[] = [
    { label: 'A', mag: 6, angle: 20 },
    { label: 'B', mag: 4, angle: 100 },
  ];
  let bad = 0;
  let frames = 0;
  for (const name of Object.keys(ARCHETYPES)) {
    const def = ARCHETYPES[name];
    const use = def.defaultVectors;
    const maxStep = (def.defaultSteps?.length ?? 0) + 1;
    for (let st = 0; st <= maxStep; st++) {
      for (let t = 0; t <= 1.0001; t += 0.1) {
        const r = def.build(ctx(name, use, t, {}, st));
        frames++;
        for (const a of r.arrows) {
          if (![a.from.x, a.from.y, a.to.x, a.to.y].every(Number.isFinite)) bad++;
        }
        for (const g of r.guides ?? []) {
          if (![g.from.x, g.from.y, g.to.x, g.to.y].every(Number.isFinite)) bad++;
        }
      }
    }
  }
  console.log(`  (swept ${frames} step×t frames across all ${Object.keys(ARCHETYPES).length} archetypes)`);
  checkBool('no NaN/Infinity across every step and animation frame', bad === 0, true);
}

console.log('\n── guided steps: nothing is drawn before it is explained ──');
{
  const tri = ARCHETYPES['triangle-law'];
  const specs = tri.defaultVectors;
  const counts = [0, 1, 2, 3].map((st) => tri.build(ctx('triangle-law', specs, 1, {}, st)).arrows.length);
  check('step 0 draws nothing', counts[0], 0);
  check('step 1 draws only A', counts[1], 1);
  check('step 2 draws A and B', counts[2], 2);
  check('step 3 draws A, B and R', counts[3], 3);

  // The resultant number must not leak into the readouts early — that would
  // hand the student the answer before the construction explains it.
  const early = tri.build(ctx('triangle-law', specs, 1, {}, 2));
  checkBool('|R| hidden before the final step', !early.readouts?.some((r) => r.label === '|R|'), true);
  checkBool('formula hidden before the final step', !early.formula, true);
  const done = tri.build(ctx('triangle-law', specs, 1, {}, 3));
  checkBool('|R| shown at the final step', !!done.readouts?.some((r) => r.label === '|R|'), true);
  checkBool('formula is multi-line at the final step', (done.formula?.length ?? 0) >= 2, true);

  // Every stepped archetype must fully reveal by the end of its own script.
  for (const [name, def] of Object.entries(ARCHETYPES)) {
    if (!def.defaultSteps) continue;
    const n = def.defaultSteps.length;
    const atEnd = def.build(ctx(name, def.defaultVectors, 1, {}, n)).arrows.length;
    const atAll = def.build(ctx(name, def.defaultVectors, 1, {}, ALL_STEPS)).arrows.length;
    check(`${name}: last step reveals everything`, atEnd, atAll);
  }
}

console.log('\n── formula strings are readable (no double minus, no NaN) ──');
{
  let ugly = 0, nan = 0, n = 0;
  for (const [name, def] of Object.entries(ARCHETYPES)) {
    // sweep sign combinations so negative components are actually exercised
    for (const angs of [[20, 100], [200, 300], [-40, 160], [95, 260]]) {
      const specs: VectorSpec[] = def.defaultVectors.map((v, i) => ({ ...v, angle: angs[i % 2] }));
      const r = def.build(ctx(name, specs));
      for (const line of r.formula ?? []) {
        n++;
        if (/-\s*-/.test(line) || /\+\s*-/.test(line)) { ugly++; console.log(`  FAIL ${name}: ${line}`); }
        if (/NaN|Infinity|undefined/.test(line)) { nan++; console.log(`  FAIL ${name}: ${line}`); }
      }
    }
  }
  console.log(`  (checked ${n} rendered formula lines)`);
  checkBool('no double/awkward signs in any formula line', ugly === 0, true);
  checkBool('no NaN/undefined in any formula line', nan === 0, true);
}

console.log(`\n${fail === 0 ? '✅' : '❌'}  ${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
