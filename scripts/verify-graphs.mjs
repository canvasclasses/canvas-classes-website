#!/usr/bin/env node
/*
 * scripts/verify-graphs.mjs — academic-accuracy gate for Unit 1 (kinematics graphs).
 * ─────────────────────────────────────────────────────────────────────────────
 * Motion Graph Studio, Match-the-Motion and the Relative Motion Deck, on the
 * frozen E2 `motion-lab` engine. Sibling of `verify-motion-lab.mjs` (53/53),
 * `verify-motion-phase2.mjs` (224/224) and `verify-mechanics-phase2.mjs` (639).
 *
 *   RUN:   node scripts/verify-graphs.mjs
 *   EXITS: 0 if every row passes, 1 otherwise.
 *
 * ── WHY EVERY EXPECTED VALUE IS HAND-WORKED IN A COMMENT ────────────────────
 * A verifier that asserts f(x) === f(x) passes for ever and proves nothing. So
 * every `want` below is either an independently hand-computed number written out
 * above the assertion, or a genuinely DIFFERENT route to the same quantity — a
 * closed form against an RK4 integration, a trapezoid sum against an exact
 * triangle pair, a numeric minimisation against a differentiated closed form.
 * When the two routes are independent, agreement is evidence.
 *
 * ── THE CORE CHECK ──────────────────────────────────────────────────────────
 * §2 round-trips the three views BOTH ways: differentiating the sampled x–t
 * returns the v–t it was built from, and integrating that v–t returns the x–t.
 * That pair is the whole claim of this module — that the three panels are ONE
 * dataset rather than three drawings that happen to agree — so it is asserted
 * before anything else and to 1e-6.
 *
 * ── HOW THIS RUNS TypeScript WITH NO BUILD STEP ─────────────────────────────
 * Same `registerHooks` shim as `verify-fbd-fill.mjs`: Node ≥ 22.6 strips types
 * from `.ts` natively, and a synchronous resolve hook retries extensionless
 * relative specifiers with `.ts`. No npm package, no tsc, no bundler.
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

// The package has no "type": "module", so Node prints a MODULE_TYPELESS notice
// per file. Noise, not a defect.
process.removeAllListeners('warning');
process.on('warning', () => {});

if (typeof registerHooks !== 'function') {
  console.error('This script needs node >= 22.15 for module.registerHooks. Found ' + process.version);
  process.exit(1);
}

registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
      for (const ext of ['', '.ts', '/index.ts']) {
        if (ext === '' && existsSync(base) && !base.endsWith('.ts')) continue;
        if (existsSync(base + ext) && (base + ext).endsWith('.ts')) {
          return { url: pathToFileURL(base + ext).href, shortCircuit: true };
        }
      }
    }
    return next(spec, ctx);
  },
});

const ML = new URL('../packages/book-renderer/blocks/motion-lab/', import.meta.url).href;

const K = await import(`${ML}graphs/lib/kinematics.ts`);
const R = await import(`${ML}graphs/lib/relative.ts`);
const P = await import(`${ML}graphs/lib/plot.ts`);
const H = await import(`${ML}graphs/lib/handles.ts`);
const G = await import(`${ML}graphs/lib/grade.ts`);
const E = await import(`${ML}graphs/lib/evidence.ts`);
const { GRAPHS_ARCHETYPES } = await import(`${ML}archetypes.graphs.ts`);
// Compare against the OTHER libraries directly, not against the merged barrel.
// `MOTION_ARCHETYPES` used to be projectile + circular only; since 2026-07-30 it
// merges all five E2 libraries — including this one — so a `k in MOTION_ARCHETYPES`
// test now reports every graphs id as colliding with itself. The intent of this
// check is "graphs ids are disjoint from the libraries that already existed", so
// it must read those maps directly.
//
// Note the barrel's own `mergeArchetypes` now throws on any duplicate id across
// all five sources, which is a STRICTER guarantee than this assertion — and it is
// what makes MotionLab.tsx's id-based routing of `scenario: 'graphs'` safe. This
// check is kept because it names the failure in terms an author understands.
const { PROJECTILE_ARCHETYPES } = await import(`${ML}archetypes.projectile.ts`);
const { CIRCULAR_ARCHETYPES } = await import(`${ML}archetypes.circular.ts`);
const { WAVES_ARCHETYPES: WV } = await import(`${ML}archetypes.waves.ts`);
const { THERMO_ARCHETYPES: TH } = await import(`${ML}archetypes.thermo.ts`);
const OTHER_LIBS = {
  ...PROJECTILE_ARCHETYPES, ...CIRCULAR_ARCHETYPES, ...WV, ...TH,
};

// ── assertion table ──────────────────────────────────────────────────────────

const rows = [];
let fails = 0;
let section = '';

const fmt = (v) =>
  typeof v === 'number'
    ? (v === 0 || (Math.abs(v) >= 1e-4 && Math.abs(v) < 1e7) ? v.toFixed(6) : v.toExponential(3))
    : String(v);

function near(name, got, want, tol, note = '') {
  const ok = Number.isFinite(got) && Math.abs(got - want) <= tol;
  if (!ok) fails++;
  rows.push({ ok, section, name, got: fmt(got), want: fmt(want), note });
}

function truthy(name, cond, note = '') {
  const ok = !!cond;
  if (!ok) fails++;
  rows.push({ ok, section, name, got: ok ? 'true' : 'FALSE', want: 'true', note });
}

function falsy(name, cond, note = '') {
  const ok = !cond;
  if (!ok) fails++;
  rows.push({ ok, section, name, got: ok ? 'false' : 'TRUE', want: 'false', note });
}

function equals(name, got, want, note = '') {
  const ok = got === want;
  if (!ok) fails++;
  rows.push({ ok, section, name, got: String(got), want: String(want), note });
}

function between(name, got, lo, hi, note = '') {
  const ok = Number.isFinite(got) && got >= lo && got <= hi;
  if (!ok) fails++;
  rows.push({ ok, section, name, got: fmt(got), want: `${fmt(lo)}…${fmt(hi)}`, note });
}

/** Every archetype, entered once so the later sections can all share it. */
const ARCH = Object.entries(GRAPHS_ARCHETYPES);

// ═════════════════════════════════════════════════════════════════════════════
// 1. THE MODEL — a, v and x are one object
// ═════════════════════════════════════════════════════════════════════════════
section = 'Model — one dataset';

// UNIFORM: u = 5 m/s, a = 2 m/s², for 4 s.
//   a  = (v₁ − v₀)/Δt = (13 − 5)/4 = 2               ✔ by construction
//   x(4) = 5·4 + ½·2·16 = 20 + 16 = 36 m              (hand)
//   trapezoid = ½(5 + 13)·4 = 36 m                    (independent route)
const UNI = { ts: [0, 4], vs: [5, 13], x0: 0 };
near('segAccel(uniform) = 2 m/s²', K.segAccel(UNI, 0), 2, 1e-12, 'slope of the v segment');
near('nodePositions gives x(4) = 36 m', K.nodePositions(UNI)[1], 36, 1e-12, 'trapezoid, exact for PWL v');
near('xAt(4) agrees with the trapezoid', K.xAt(UNI, 4), 36, 1e-12);
near('xAt(2) = 5·2 + ½·2·4 = 14 m', K.xAt(UNI, 2), 14, 1e-12, 'hand-worked');
near('vAt(2) = 5 + 2·2 = 9 m/s', K.vAt(UNI, 2), 9, 1e-12);
near('aAt(2) = 2 m/s²', K.aAt(UNI, 2), 2, 1e-12);

// THREE-PHASE, with a genuine reversal:
//   u = 10, phases (a = −5, 4 s), (a = 0, 2 s), (a = +5, 2 s)
//   node velocities: 10 → 10 − 20 = −10 → −10 → −10 + 10 = 0
//   node positions : 0 → ½(10−10)·4 = 0 → 0 + (−10)·2 = −20 → −20 + ½(−10+0)·2 = −30
const TRI = K.modelFromPhases(0, 10, [{ a: -5, t: 4 }, { a: 0, t: 2 }, { a: 5, t: 2 }]);
equals('modelFromPhases builds 4 nodes', TRI.ts.length, 4);
near('node times [0,4,6,8] — last is 8 s', TRI.ts[3], 8, 1e-12);
near('node v: 10 → −10 after phase 1', TRI.vs[1], -10, 1e-12, 'v = u + at = 10 − 5·4');
near('node v: −10 held through phase 2', TRI.vs[2], -10, 1e-12);
near('node v: back to 0 after phase 3', TRI.vs[3], 0, 1e-12, '−10 + 5·2');
near('node x: 0 at t = 4 s', K.nodePositions(TRI)[1], 0, 1e-12, 'out 10 m and back 10 m');
near('node x: −20 m at t = 6 s', K.nodePositions(TRI)[2], -20, 1e-12);
near('node x: −30 m at t = 8 s', K.nodePositions(TRI)[3], -30, 1e-12, 'hand-worked');
near('segment accelerations: −5, 0, +5', K.segAccel(TRI, 0) + K.segAccel(TRI, 1) * 10 + K.segAccel(TRI, 2), 0, 1e-12,
  '−5 + 0 + 5 = 0, and the middle is exactly 0');
near('  seg 0 = −5', K.segAccel(TRI, 0), -5, 1e-12);
near('  seg 1 = 0', K.segAccel(TRI, 1), 0, 1e-12);
near('  seg 2 = +5', K.segAccel(TRI, 2), 5, 1e-12);

// ═════════════════════════════════════════════════════════════════════════════
// 2. THE ROUND TRIP — the core check
// ═════════════════════════════════════════════════════════════════════════════
section = 'Round trip x↔v↔a';

for (const [label, model] of [['uniform', UNI], ['three-phase', TRI]]) {
  const s = K.buildSamples(model);
  truthy(`${label}: samples are strictly increasing in t`,
    s.every((p, i) => i === 0 || p.t > s[i - 1].t - 1e-15), `${s.length} samples`);

  // (a) DIFFERENTIATE the sampled x–t → must return the v–t it was built from.
  //     A central difference of a quadratic is EXACT, so 1e-6 is not a fudge —
  //     the true agreement is at float precision. Points whose stencil straddles
  //     a kink in a are returned as null and excluded, because a central
  //     difference across a discontinuity is not a derivative of anything.
  const dx = K.derivativeSeries(s, (p) => p.x);
  let worstDx = 0;
  let checkedDx = 0;
  for (let i = 0; i < dx.length; i++) {
    if (dx[i].d == null) continue;
    checkedDx++;
    worstDx = Math.max(worstDx, Math.abs(dx[i].d - s[i].v));
  }
  truthy(`${label}: enough interior points to check`, checkedDx > 15, `${checkedDx} of ${s.length}`);
  near(`${label}: d(x–t)/dt === v–t`, worstDx, 0, 1e-6, 'worst absolute error over every non-straddling point');

  // (b) DIFFERENTIATE the sampled v–t → must return the a–t staircase.
  const dv = K.derivativeSeries(s, (p) => p.v);
  let worstDv = 0;
  let checkedDv = 0;
  for (let i = 0; i < dv.length; i++) {
    if (dv[i].d == null) continue;
    checkedDv++;
    worstDv = Math.max(worstDv, Math.abs(dv[i].d - s[i].a));
  }
  truthy(`${label}: enough interior points for a`, checkedDv > 15, `${checkedDv} of ${s.length}`);
  near(`${label}: d(v–t)/dt === a–t`, worstDv, 0, 1e-6);

  // (c) INTEGRATE the sampled v–t → must return the x–t. The trapezoid rule is
  //     exact for the v series (linear between samples by construction), so this
  //     is a genuinely independent route to the RK4-built positions.
  const ix = K.cumulativeIntegral(s, (p) => p.v, model.x0);
  let worstIx = 0;
  for (let i = 0; i < s.length; i++) worstIx = Math.max(worstIx, Math.abs(ix[i].y - s[i].x));
  near(`${label}: ∫v dt === x–t`, worstIx, 0, 1e-6, 'trapezoid vs RK4 — two independent routes');

  // (d) INTEGRATE the a–t staircase → must return the v–t.
  //
  //     a is piecewise CONSTANT, so the right instrument is a RECTANGLE sum, not
  //     a trapezoid. A trapezoid across the jump at a node averages the two
  //     accelerations and is wrong by ½·jump·Δt there — an artefact of the
  //     instrument, not of the data, and worth stating because the first draft of
  //     this file asserted the trapezoid and failed by 0.42 m/s at the kink. The
  //     product never integrates a by trapezoid either: the a–t bars ARE the
  //     rectangles, and `deltaVFromA` sums them exactly.
  if (K.segCount(model) === 1) {
    // With one segment a really is constant, so the trapezoid IS exact and the
    // stronger check is available.
    const iv = K.cumulativeIntegral(s, (p) => p.a, model.vs[0]);
    let worstIv = 0;
    for (let i = 0; i < s.length; i++) worstIv = Math.max(worstIv, Math.abs(iv[i].y - s[i].v));
    near(`${label}: ∫a dt === v–t (trapezoid, exact for one segment)`, worstIv, 0, 1e-9);
  }
  // Rectangle sum, computed HERE rather than by the library, so it is a genuinely
  // independent route: Σ a_i·Δt_i up to each node must equal that node's velocity.
  {
    let acc = model.vs[0];
    let worstRect = 0;
    for (let i = 0; i < K.segCount(model); i++) {
      acc += K.segAccel(model, i) * (model.ts[i + 1] - model.ts[i]);
      worstRect = Math.max(worstRect, Math.abs(acc - model.vs[i + 1]));
    }
    near(`${label}: Σ a·Δt === node velocities`, worstRect, 0, 1e-9,
      'rectangle sum — the exact instrument for a staircase');
  }
}

// Δv from the area under a–t. UNIFORM: 2 × 4 = 8 m/s, and 13 − 5 = 8.
near('area under a–t = Δv (uniform)', K.deltaVFromA(UNI), 8, 1e-12, '2·4 = 8, and 13 − 5 = 8');
// THREE-PHASE: (−5)(4) + 0(2) + (5)(2) = −20 + 10 = −10, and 0 − 10 = −10.
near('area under a–t = Δv (three-phase)', K.deltaVFromA(TRI), -10, 1e-12, '−20 + 0 + 10 = −10');
near('  … equals v_end − v_start', K.deltaVFromA(TRI), TRI.vs[3] - TRI.vs[0], 1e-12);

// ═════════════════════════════════════════════════════════════════════════════
// 3. SIGNED AREA — displacement subtracts, distance does not
// ═════════════════════════════════════════════════════════════════════════════
section = 'Signed area';

// Hand-worked for TRI:
//   seg 0 crosses zero. v goes 10 → −10 over 4 s, so it crosses at
//     t_c = 4 · 10/(10 − (−10)) = 2 s
//   pieces: ½·10·2 = +10 m, and ½·(−10)·2 = −10 m
//   seg 1: (−10)·2 = −20 m
//   seg 2: ½(−10 + 0)·2 = −10 m
//   NET      = 10 − 10 − 20 − 10 = −30 m
//   DISTANCE = 10 + 10 + 20 + 10 =  50 m
const pieces = K.areaPieces(TRI);
equals('the crossing splits seg 0 into two pieces', pieces.length, 4, 'one extra piece from the zero crossing');
near('crossing time in seg 0 = 2 s', pieces[0].t1, 2, 1e-12, '4 · 10/20');
near('signed area (displacement) = −30 m', K.signedArea(TRI), -30, 1e-12);
near('  … agrees with the node positions', K.signedArea(TRI), K.nodePositions(TRI)[3] - TRI.x0, 1e-12);
near('path length (distance) = 50 m', K.pathLength(TRI), 50, 1e-12);
truthy('distance ≠ |displacement| for this motion', Math.abs(K.pathLength(TRI) - Math.abs(K.signedArea(TRI))) > 1,
  '50 vs 30 — the motion reversed');

// Independent route to the distance: a dense trapezoid sum of |v|.
{
  const N = 200000;
  const t0 = K.tStart(TRI);
  const t1 = K.tEnd(TRI);
  const h = (t1 - t0) / N;
  let acc = 0;
  for (let i = 0; i < N; i++) {
    acc += 0.5 * (Math.abs(K.vAt(TRI, t0 + i * h)) + Math.abs(K.vAt(TRI, t0 + (i + 1) * h))) * h;
  }
  near('dense Σ|v|dt agrees with the exact triangles', acc, 50, 2e-4,
    'the kink at the crossing costs a trapezoid sum O(h²) — 2e-4 at N = 200 000');
}

// A motion that never reverses: the two must be EQUAL.
near('no reversal → distance = |displacement|',
  K.pathLength(UNI) - Math.abs(K.signedArea(UNI)), 0, 1e-12, 'both 36 m');
near('  … and both are 36 m', K.pathLength(UNI), 36, 1e-12);

// The displacement up to the turning point is the positive lobe only.
near('displacement over [0,2] = +10 m', K.signedArea(K.sliceModel(TRI, 0, 2)), 10, 1e-12);
near('distance over [0,8] via sliceModel = 50 m', K.pathLengthBetween(TRI, 0, 8), 50, 1e-12);

// ═════════════════════════════════════════════════════════════════════════════
// 4. UNIFORM ACCELERATION — the algebra against the integrator, to 1e-9
// ═════════════════════════════════════════════════════════════════════════════
section = 'Uniform acceleration';

// u = 5, a = 2, t = 4:
//   v = u + at   = 5 + 8 = 13 m/s
//   s = ut + ½at² = 20 + 16 = 36 m
//   v² = 169  and  u² + 2as = 25 + 2·2·36 = 25 + 144 = 169   ✔
const ua = K.uniformAccel(5, 2, 4);
near('v = u + at = 13 m/s', ua.v, 13, 1e-12);
near('s = ut + ½at² = 36 m', ua.s, 36, 1e-12);
near('v² = u² + 2as → both 169', ua.v * ua.v - ua.vSquared, 0, 1e-12, `v² = ${ua.v * ua.v}, u²+2as = ${ua.vSquared}`);
equals('no turning point inside [0,4]', ua.turnAt, null, 'u and a have the same sign');

{
  const s = K.buildSamples(UNI);
  const last = s[s.length - 1];
  near('RK4 endpoint v agrees with u + at', last.v, 13, 1e-9, 'RK4 is exact for a quadratic solution');
  near('RK4 endpoint x agrees with ut + ½at²', last.x, 36, 1e-9);
  // v² = u² + 2as evaluated on the integrated path, at a mid-run instant.
  const mid = K.sampleAt(s, 2.5);
  // x(2.5) = 5·2.5 + ½·2·6.25 = 12.5 + 6.25 = 18.75 ; v = 5 + 5 = 10 ; v² = 100
  //          u² + 2as = 25 + 2·2·18.75 = 25 + 75 = 100    ✔
  near('mid-run x(2.5) = 18.75 m', mid.x, 18.75, 1e-9, 'hand-worked');
  near('mid-run v(2.5) = 10 m/s', mid.v, 10, 1e-9);
  near('v² = u² + 2as holds mid-run', mid.v * mid.v - (25 + 2 * 2 * (mid.x - UNI.x0)), 0, 1e-9);
}

// A DECELERATION with a turning point inside the run: u = 10, a = −5, t = 4.
//   turn at t = −u/a = 2 s, and 0 < 2 < 4 so it is reported.
{
  const d = K.uniformAccel(10, -5, 4);
  near('turning point at t = −u/a = 2 s', d.turnAt, 2, 1e-12);
  //   s over the whole 4 s = 10·4 − ½·5·16 = 40 − 40 = 0 m
  near('net displacement over 4 s = 0 m', d.s, 0, 1e-12, 'out 10 m, back 10 m');
  near('v at 4 s = 10 − 20 = −10 m/s', d.v, -10, 1e-12);
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. THE HEADLINE MISCONCEPTION — a positive a on a negative v
// ═════════════════════════════════════════════════════════════════════════════
section = 'Sign of a vs direction of v';

// u = −12 m/s, a = +3 m/s². The acceleration is positive for the whole run.
//   v(t) = −12 + 3t   →  v(0) = −12, v(2) = −6, v(4) = 0, v(8) = +12
//   SPEED |v|         →      12,        6,        0,        12
//   so for 0 < t < 4 the acceleration is positive AND the body is slowing.
//   x(4) = −12·4 + ½·3·16 = −48 + 24 = −24 m
//   x(8) = −96 + 96 = 0 m
const NEG = { ts: [0, 8], vs: [-12, 12], x0: 0 };
near('a is +3 m/s² for the whole run', K.segAccel(NEG, 0), 3, 1e-12);
near('v(0) = −12 m/s', K.vAt(NEG, 0), -12, 1e-12);
near('v(2) = −6 m/s', K.vAt(NEG, 2), -6, 1e-12, 'positive a raised v from −12 to −6');
truthy('|v| FELL from 12 to 6 under a positive a',
  Math.abs(K.vAt(NEG, 2)) < Math.abs(K.vAt(NEG, 0)),
  'this is the misconception, asserted explicitly');
truthy('the body is still moving BACKWARDS at t = 2 s', K.vAt(NEG, 2) < 0,
  'a positive a did not reverse it, it only slowed it');
equals('speedTrend(−12, +3) = slowing-down', K.speedTrend(-12, 3), 'slowing-down');
equals('speedTrend(+12, +3) = speeding-up', K.speedTrend(12, 3), 'speeding-up');
equals('speedTrend(−12, −3) = speeding-up', K.speedTrend(-12, -3), 'speeding-up',
  'a NEGATIVE a on a negative v speeds it up — the mirror case');
equals('speedTrend(+12, −3) = slowing-down', K.speedTrend(12, -3), 'slowing-down');
equals('speedTrend(0, +3) = turning', K.speedTrend(0, 3), 'turning');
equals('speedTrend(5, 0) = steady', K.speedTrend(5, 0), 'steady');
// d|v|/dt = sign(v)·a — the one line the whole card is built on.
near('d|v|/dt at v = −12, a = +3 is −3', K.speedRate(-12, 3), -3, 1e-12, 'sign(v)·a');
near('d|v|/dt at v = +12, a = +3 is +3', K.speedRate(12, 3), 3, 1e-12);
near('turning point of NEG at t = 4 s', K.uniformAccel(-12, 3, 8).turnAt, 4, 1e-12);
near('x(4) = −24 m', K.xAt(NEG, 4), -24, 1e-12, 'hand: −48 + 24');
near('x(8) = 0 m — back where it started', K.xAt(NEG, 8), 0, 1e-12);
near('displacement over the run = 0 m', K.signedArea(NEG), 0, 1e-12);
near('distance over the run = 48 m', K.pathLength(NEG), 48, 1e-12, '2 × ½ · 12 · 4');
truthy('so distance ≠ |displacement| here too', K.pathLength(NEG) > 1 && Math.abs(K.signedArea(NEG)) < 1e-9);

// Retardation in both signs, on one motion. u = 20, (−5, 4 s), (−5, 4 s), (+5, 4 s).
{
  const RET = K.modelFromPhases(0, 20, [{ a: -5, t: 4 }, { a: -5, t: 4 }, { a: 5, t: 4 }]);
  //  v: 20 → 0 → −20 → 0
  near('phase 1 ends at v = 0', RET.vs[1], 0, 1e-12);
  near('phase 2 ends at v = −20 m/s', RET.vs[2], -20, 1e-12);
  near('phase 3 ends at v = 0', RET.vs[3], 0, 1e-12);
  equals('phase 1 (v>0, a<0) is retardation', K.speedTrend(10, -5), 'slowing-down');
  equals('phase 2 (v<0, a<0) is NOT retardation', K.speedTrend(-10, -5), 'speeding-up');
  equals('phase 3 (v<0, a>0) IS retardation', K.speedTrend(-10, 5), 'slowing-down',
    'braking with a POSITIVE acceleration');
}

// The flat-line classification, which is the other headline code.
equals('flatKind(v=0)  → at rest on the x–t panel', K.flatKind(0, -9.8), 'x-flat-at-rest');
equals('flatKind(v=4, a=0) → uniform velocity', K.flatKind(4, 0), 'v-flat-uniform-velocity');
equals('flatKind(v=4, a=2) → uniform acceleration', K.flatKind(4, 2), 'a-flat-uniform-accel');

// ═════════════════════════════════════════════════════════════════════════════
// 6. TANGENT vs CHORD — instantaneous against average
// ═════════════════════════════════════════════════════════════════════════════
section = 'Tangent vs chord';

// UNIFORM VELOCITY: they must coincide everywhere.
{
  const CV = { ts: [0, 4], vs: [7, 7], x0: 0 };
  near('uniform v: tangent at 1 s = 7 m/s', K.tangentSlope(CV, 1), 7, 1e-12);
  near('uniform v: chord [1,3] = 7 m/s', K.chordSlope(CV, 1, 3), 7, 1e-12);
  near('  … tangent and chord coincide', K.chordSlope(CV, 1, 3) - K.tangentSlope(CV, 2), 0, 1e-12);
  near('uniform v: average speed = 7 m/s', K.averageSpeed(CV, 1, 3), 7, 1e-12);
}

// UNIFORM ACCELERATION: the chord equals the tangent at the MIDPOINT, exactly.
//   chord over [1,3] = (x(3) − x(1))/2 = ((15 + 9) − (5 + 1))/2 = (24 − 6)/2 = 9
//   tangent at 2     = v(2) = 5 + 2·2 = 9                              ✔
near('uniform a: x(1) = 6 m', K.xAt(UNI, 1), 6, 1e-12, '5·1 + ½·2·1');
near('uniform a: x(3) = 24 m', K.xAt(UNI, 3), 24, 1e-12, '5·3 + ½·2·9');
near('uniform a: chord [1,3] = 9 m/s', K.chordSlope(UNI, 1, 3), 9, 1e-12);
near('uniform a: tangent at the midpoint = 9 m/s', K.tangentSlope(UNI, 2), 9, 1e-12);
near('  … chord === tangent at the midpoint', K.chordSlope(UNI, 1, 3) - K.tangentSlope(UNI, 2), 0, 1e-12,
  'true only while a is constant');
truthy('uniform a: chord ≠ tangent at an ENDPOINT',
  Math.abs(K.chordSlope(UNI, 1, 3) - K.tangentSlope(UNI, 1)) > 1,
  '9 vs 7 — which is why "average" and "at that instant" are different questions');

// NON-UNIFORM (the `tangent-vs-chord` archetype's own motion):
//   ts = [0,4,8], vs = [0,4,20]  →  a = 1 then 4
//   x(4) = ½(0+4)·4 = 8 ;  x(8) = 8 + ½(4+20)·4 = 56
//   markers at 0.2 and 0.8 of the 8 s run → 1.6 s and 6.4 s
//   x(1.6) = 0 + 0·1.6 + ½·1·1.6²  = 1.28
//   x(6.4) = 8 + 4·2.4 + ½·4·2.4²  = 8 + 9.6 + 11.52 = 29.12
//   chord  = (29.12 − 1.28)/4.8    = 27.84/4.8 = 5.80
//   tangent at the midpoint 4.0    = v(4) = 4.00
{
  const NU = { ts: [0, 4, 8], vs: [0, 4, 20], x0: 0 };
  near('non-uniform: x(4) = 8 m', K.xAt(NU, 4), 8, 1e-12);
  near('non-uniform: x(8) = 56 m', K.xAt(NU, 8), 56, 1e-12);
  near('non-uniform: x(1.6) = 1.28 m', K.xAt(NU, 1.6), 1.28, 1e-12, 'hand-worked');
  near('non-uniform: x(6.4) = 29.12 m', K.xAt(NU, 6.4), 29.12, 1e-12, 'hand-worked');
  near('non-uniform: chord [1.6, 6.4] = 5.8 m/s', K.chordSlope(NU, 1.6, 6.4), 5.8, 1e-12);
  near('non-uniform: tangent at the midpoint = 4 m/s', K.tangentSlope(NU, 4), 4, 1e-12);
  truthy('  … they DISAGREE when a is not constant',
    Math.abs(K.chordSlope(NU, 1.6, 6.4) - K.tangentSlope(NU, 4)) > 0.5, 'gap = 1.8 m/s');
  // Inside ONE segment, a symmetric chord equals the midpoint tangent EXACTLY —
  // that is the constant-acceleration result, and it is why the limit below has to
  // be taken across a kink to be a real limit at all. (The first draft of this
  // file centred the shrinking interval at 5 s, entirely inside the second
  // segment, and every difference came back as exactly zero: a limit that had
  // already arrived before it started.)
  near('inside one segment the chord is exact at the midpoint',
    K.chordSlope(NU, 4.5, 5.5) - K.tangentSlope(NU, 5), 0, 1e-12, 'a constant across [4.5, 5.5]');

  // Now straddle the kink at 4 s, where a jumps 1 → 4, and the chord genuinely
  // has to converge. Hand-worked:
  //   x(3) = ½·1·9 = 4.5 ; x(5) = 8 + 4·1 + ½·4·1 = 14
  //   chord[3,5] = (14 − 4.5)/2 = 4.75 against a tangent of 4.00 → gap 0.75
  //   the gap is first-order in h, so 0.075, 0.0075, 0.000075 follow
  near('chord over [3,5] = 4.75 m/s', K.chordSlope(NU, 3, 5), 4.75, 1e-12, 'hand-worked, straddling the kink');
  const closing = [1, 0.1, 0.01, 1e-4].map((h) => Math.abs(K.chordSlope(NU, 4 - h, 4 + h) - K.tangentSlope(NU, 4)));
  near('  … the h = 1 gap is 0.75 m/s', closing[0], 0.75, 1e-9);
  truthy('chord → tangent as the markers close', closing.every((v, i) => i === 0 || v < closing[i - 1]),
    closing.map((v) => v.toExponential(1)).join(' > '));
  near('  … falling first-order in h', closing[1], 0.075, 1e-9);
  near('  … and reaching the tangent in the limit', closing[3], 0, 2e-4);
}

// Average SPEED vs average VELOCITY on the reversing motion:
//   distance 50 m / 8 s = 6.25 m/s ;  displacement −30 m / 8 s = −3.75 m/s
near('average speed over TRI = 6.25 m/s', K.averageSpeed(TRI, 0, 8), 6.25, 1e-12, '50 / 8');
near('average velocity over TRI = −3.75 m/s', K.chordSlope(TRI, 0, 8), -3.75, 1e-12, '−30 / 8');
truthy('the two averages differ in sign AND size',
  K.averageSpeed(TRI, 0, 8) > 0 && K.chordSlope(TRI, 0, 8) < 0);
// (u+v)/2 is right for uniform a and WRONG for a multi-phase motion.
near('(u+v)/2 = average velocity when a is constant', (5 + 13) / 2 - K.chordSlope(UNI, 0, 4), 0, 1e-12);
truthy('(u+v)/2 ≠ average velocity for TRI',
  Math.abs((TRI.vs[0] + TRI.vs[3]) / 2 - K.chordSlope(TRI, 0, 8)) > 1, '5 vs −3.75');

// ═════════════════════════════════════════════════════════════════════════════
// 7. MODEL EDITS — one edit per panel, all landing on the same nodes
// ═════════════════════════════════════════════════════════════════════════════
section = 'Model edits';

{
  const m1 = K.setNodeV(TRI, 1, 0);
  near('setNodeV(1, 0) sets that node', m1.vs[1], 0, 1e-12);
  near('  … and leaves the others alone', m1.vs[0] + m1.vs[2] + m1.vs[3], 10 - 10 + 0, 1e-12);
  // Setting seg-0's a to −2.5 with v₀ = 10 over 4 s wants v₁ = 10 − 10 = 0, a
  // shift of +10 from −10 — and every later node moves by the same +10.
  const m2 = K.setSegAccel(TRI, 0, -2.5);
  near('setSegAccel(0, −2.5) → v₁ = 0', m2.vs[1], 0, 1e-12);
  near('  … seg 0 really is −2.5 now', K.segAccel(m2, 0), -2.5, 1e-12);
  near('  … later nodes shifted rigidly by +10', m2.vs[2], 0, 1e-12, 'was −10');
  near('  … so seg 1 is still 0 and seg 2 still +5', K.segAccel(m2, 1) + K.segAccel(m2, 2), 5, 1e-12);
  near('  … v₀ untouched', m2.vs[0], 10, 1e-12);
  // The tangent edit IS the node edit — that identity is the design.
  equals('setTangentSlope is setNodeV', K.setTangentSlope, K.setNodeV, 'x–t drags a slope, not a point');
  // resample preserves the motion at the handles
  const rs = K.resampleModel(UNI, 9);
  equals('resampleModel(9) gives 9 handles', rs.ts.length, 9);
  near('  … v preserved at every handle', Math.max(...rs.ts.map((t, i) => Math.abs(rs.vs[i] - K.vAt(UNI, t)))), 0, 1e-12);
  near('  … and it is the same motion (x(4) = 36)', K.xAt(rs, 4), 36, 1e-12,
    'exact, because the original nodes are a subset of the new ones');
  const flat = K.flatModel(0, 10, 11, 0, 0);
  equals('flatModel(11) gives 11 handles at 1 s spacing', flat.ts.length, 11);
  near('  … every velocity zero', Math.max(...flat.vs.map(Math.abs)), 0, 1e-12);
  near('  … so it goes nowhere', K.signedArea(flat), 0, 1e-12);
  // paintNodes ramps between the two ends of a sweep
  const painted = K.paintNodes(flat, 0, 0, 10, 10);
  near('paintNodes ramps 0 → 10 across the sweep', painted.vs[10], 10, 1e-12);
  near('  … and is linear at the midpoint', painted.vs[5], 5, 1e-12);
  near('  … so it covers ½·10·10 = 50 m', K.signedArea(painted), 50, 1e-12);
}

// ═════════════════════════════════════════════════════════════════════════════
// 8. RELATIVE MOTION
// ═════════════════════════════════════════════════════════════════════════════
section = 'Relative velocity';

// v_AB = −v_BA, for both same and opposite directions.
{
  const same = R.relative1D(20, 15);
  near('same direction: v_AB = 20 − 15 = 5 m/s', same.vAB, 5, 1e-12);
  near('  … v_BA = −5 m/s', same.vBA, -5, 1e-12);
  near('  … v_AB = −v_BA', same.vAB + same.vBA, 0, 1e-12, 'the one frame-independent fact');
  truthy('  … flagged as the same direction', same.sameDirection);

  const opp = R.relative1D(20, -15);
  near('opposite: v_AB = 20 − (−15) = 35 m/s', opp.vAB, 35, 1e-12, 'the speeds appear to ADD');
  near('  … v_AB = −v_BA still', opp.vAB + opp.vBA, 0, 1e-12);
  falsy('  … not flagged as the same direction', opp.sameDirection);

  // Overtake: 120 m + 180 m of train at 5 m/s of relative speed = 60 s.
  near('overtake time, same direction = 60 s', R.overtakeTime(20, 15, 120, 180), 60, 1e-12, '300 / 5');
  near('overtake time, opposite = 8.571429 s', R.overtakeTime(20, -15, 120, 180), 300 / 35, 1e-12);
  equals('equal velocities never pass', R.overtakeTime(20, 20, 120, 180), null);

  // Routed through the ENGINE's own frame transform, not a second subtraction.
  const t = R.solveTrains(20, 15, 120, 180);
  near('toFrame gives A as seen from B = 5 m/s', t.aSeenFromB.vel.x, 5, 1e-12,
    'engine lib/frames.ts, not a local formula');
  near('  … matching v_AB', t.aSeenFromB.vel.x - t.vAB, 0, 1e-12);
}

section = 'River crossing';

// w = 100 m, current 3 m/s, boat 5 m/s.
//  MIN TIME  — heading straight across: t = w/v_b = 100/5 = 20 s, drift = 3·20 = 60 m
//  ZERO DRIFT — sin θ = c/b = 0.6 → θ = 36.8699°, t = w/√(b²−c²) = 100/4 = 25 s
{
  const straight = R.solveRiver({ width: 100, current: 3, boat: 5, headingDeg: 0 });
  near('straight across: across component = 5 m/s', straight.vBoatGround.y, 5, 1e-12);
  near('straight across: along the bank = 3 m/s', straight.vBoatGround.x, 3, 1e-12);
  near('straight across: crossing time = 20 s', straight.crossTime, 20, 1e-12, 'w/v_b, hand-worked');
  near('straight across: drift = 60 m', straight.drift, 60, 1e-12);
  near('minTime heading is 0°', straight.minTime.headingDeg, 0, 1e-12);
  near('minTime time = 20 s', straight.minTime.time, 20, 1e-12);
  near('zero-drift heading = 36.8699°', straight.minDrift.headingDeg, (Math.asin(0.6) * 180) / Math.PI, 1e-9,
    'asin(c/b) = asin(0.6)');
  near('zero-drift time = 25 s', straight.minDrift.time, 25, 1e-9, 'w/√(b²−c²) = 100/4 — a second route');
  near('zero-drift drift = 0 m', straight.minDrift.drift, 0, 1e-12);
  falsy('zero drift is achievable when b > c', straight.minDrift.unavoidable);
  truthy('quickest is FASTER than zero-drift', straight.minTime.time < straight.minDrift.time,
    '20 s vs 25 s — the misconception, asserted');

  // Steer to the zero-drift heading and check the drift really vanishes.
  const aimed = R.solveRiver({ width: 100, current: 3, boat: 5, headingDeg: straight.minDrift.headingDeg });
  near('at that heading the along-bank velocity is 0', aimed.vBoatGround.x, 0, 1e-9);
  near('  … so the drift is 0 m', aimed.drift, 0, 1e-7);
  near('  … and it takes 25 s', aimed.crossTime, 25, 1e-9);

  // The ENGINE integrates the ground path; it must agree with the closed form.
  const path = R.riverPath({ width: 100, current: 3, boat: 5, headingDeg: 0 });
  const landed = path.stoppedAt ?? path.points[path.points.length - 1];
  near('integrated path lands at y = 100 m', landed.pos.y, 100, 1e-6, 'RK4 + bisection refine');
  near('integrated landing time = 20 s', landed.t, 20, 1e-6);
  near('integrated drift = 60 m', landed.pos.x, 60, 1e-6, 'the drawn line and the quoted number agree');

  // In the WATER's frame the boat travels at exactly the boat speed, always.
  const wp = R.riverPathInWaterFrame({ width: 100, current: 3, boat: 5, headingDeg: 25 });
  const wv = wp.points[10].vel;
  near('in the water frame the speed is exactly v_boat', Math.hypot(wv.x, wv.y), 5, 1e-9,
    'engine transformTrajectory, not a second formula');
  const wpStraight = R.riverPathInWaterFrame({ width: 100, current: 3, boat: 5, headingDeg: 0 });
  const wpEnd = wpStraight.stoppedAt ?? wpStraight.points[wpStraight.points.length - 1];
  near('  … and heading 0 gives zero water-frame drift', wpEnd.pos.x, 0, 1e-9);
}

// The current-beats-boat case: zero drift impossible, minimum is (w/b)√(c²−b²).
//   w = 100, c = 5, b = 3 → sin θ = b/c = 0.6, θ = 36.8699°
//   d_min = (100/3)·√(25−9) = (100/3)·4 = 133.3333 m,  t = 100/(3·0.8) = 41.6667 s
{
  const hard = R.solveRiver({ width: 100, current: 5, boat: 3, headingDeg: 0 });
  truthy('c > b → zero drift is unavoidable', hard.minDrift.unavoidable);
  near('min-drift heading = asin(b/c) = 36.8699°', hard.minDrift.headingDeg, (Math.asin(0.6) * 180) / Math.PI, 1e-9);
  near('min drift = (w/b)√(c²−b²) = 133.3333 m', hard.minDrift.drift, 400 / 3, 1e-9);
  near('  … taking 41.6667 s', hard.minDrift.time, 100 / 2.4, 1e-9);

  // Independent route: brute-force minimise the drift over the heading.
  let best = Infinity;
  let bestDeg = 0;
  for (let d = -89.9; d <= 89.9; d += 0.001) {
    const r = R.solveRiver({ width: 100, current: 5, boat: 3, headingDeg: d });
    if (r.drift != null && r.drift < best) { best = r.drift; bestDeg = d; }
  }
  near('brute-force minimum agrees with the closed form', best, 400 / 3, 2e-5,
    'scanned 180 000 headings — a genuinely different route');
  near('  … at the same heading', bestDeg, (Math.asin(0.6) * 180) / Math.PI, 1e-2);
}

section = 'Rain and the walker';

// Rain 10 m/s down, walk 5 m/s forward, no wind.
//   v_rain,man = (0 − 5, −10) = (−5, −10)
//   tilt from vertical = atan(5/10) = 26.5651° FORWARDS
//   apparent speed = √(25 + 100) = 11.1803 m/s
{
  const r = R.solveRain(10, 5, 0);
  near('relative x-component = −5 m/s', r.vRelative.x, -5, 1e-12, 'the rain acquires YOUR speed, backwards');
  near('relative y-component = −10 m/s', r.vRelative.y, -10, 1e-12, 'unchanged — a walk cannot alter a fall');
  near('umbrella tilt = 26.5651° forwards', r.umbrellaTiltDeg, (Math.atan2(5, 10) * 180) / Math.PI, 1e-9);
  near('apparent speed = 11.180340 m/s', r.apparentSpeed, Math.sqrt(125), 1e-12);
  truthy('the tilt is FORWARDS, not backwards', r.umbrellaTiltDeg > 0,
    'positive = into the direction of travel');

  const still = R.solveRain(10, 0, 0);
  near('stand still → tilt 0°', still.umbrellaTiltDeg, 0, 1e-12, 'the slant was never the rain’s');
  near('  … and the rain is unchanged', still.vRain.y, -10, 1e-12);
  truthy('walking faster tilts it further', R.solveRain(10, 12, 0).umbrellaTiltDeg > r.umbrellaTiltDeg);
  // A tailwind (+, blowing the way you walk) reduces the tilt; a headwind raises it.
  truthy('a tailwind reduces the tilt', R.solveRain(10, 5, 3).umbrellaTiltDeg < r.umbrellaTiltDeg);
  truthy('a headwind increases it', R.solveRain(10, 5, -3).umbrellaTiltDeg > r.umbrellaTiltDeg);
  // A wind exactly matching your walk makes the rain vertical again for you.
  near('wind = walk → tilt back to 0°', R.solveRain(10, 5, 5).umbrellaTiltDeg, 0, 1e-12,
    'you are then at rest relative to the air');
}

// ═════════════════════════════════════════════════════════════════════════════
// 9. MATCH THE MOTION — the grader, both ways
// ═════════════════════════════════════════════════════════════════════════════
section = 'Match grading';

// Target: cruise at 6 m/s for 4 s, brake to 0 over 2 s, wait 4 s.
//   ts = [0,4,6,10], vs = [6,6,0,0]
const TARGET = K.modelFromPhases(0, 6, [{ a: 0, t: 4 }, { a: -3, t: 2 }, { a: 0, t: 4 }]);
near('target ends at v = 0', TARGET.vs[3], 0, 1e-12);
near('target v at 5 s = 3 m/s', K.vAt(TARGET, 5), 3, 1e-12, 'halfway down the ramp');

// An EXACT reproduction on 11 one-second handles. The target's kinks are at 4 s
// and 6 s, both handle times, so it is exactly representable.
const EXACT = { ts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], vs: [6, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0], x0: 0 };
{
  const r = G.gradeMatch(TARGET, EXACT, 1.2, 'v');
  truthy('an exact sketch PASSES', r.pass, `maxErr = ${r.maxErr.toExponential(2)}`);
  near('  … with a max error of 0', r.maxErr, 0, 1e-12);
  equals('  … and no fault', r.fault, 'match');
  near('  … score 1', r.score, 1, 1e-12);
  equals('  … no error window to shade', r.window, null);
}

// Inside the band everywhere but not exact: +1.0 m/s against a 1.2 tolerance.
{
  const inside = { ...EXACT, vs: EXACT.vs.map((v) => v + 1) };
  const r = G.gradeMatch(TARGET, inside, 1.2, 'v');
  truthy('within tolerance everywhere PASSES', r.pass, `maxErr = ${r.maxErr.toFixed(3)}`);
  near('  … max error 1.0', r.maxErr, 1, 1e-9);
}

// Off by MORE than the tolerance: +2.0 m/s against 1.2.
{
  const off = { ...EXACT, vs: EXACT.vs.map((v) => v + 2) };
  const r = G.gradeMatch(TARGET, off, 1.2, 'v');
  falsy('off by more than the tolerance FAILS', r.pass, `maxErr = ${r.maxErr.toFixed(3)} > 1.2`);
  near('  … max error 2.0', r.maxErr, 2, 1e-9);
  equals('  … diagnosed as a constant offset', r.fault, 'offset');
  near('  … with the bias reported as +2', r.bias, 2, 1e-9);
  truthy('  … and copy that names the offset',
    /height/i.test(G.faultCopy(r, 'v').heading), G.faultCopy(r, 'v').heading);
}

// A mirror image: every velocity negated.
{
  const flipped = { ...EXACT, vs: EXACT.vs.map((v) => -v) };
  const r = G.gradeMatch(TARGET, flipped, 1.2, 'v');
  falsy('a mirrored sketch FAILS', r.pass);
  equals('  … diagnosed as a sign flip', r.fault, 'sign-flipped');
  truthy('  … and copy that names the direction',
    /other way/i.test(G.faultCopy(r, 'v').heading), G.faultCopy(r, 'v').heading);
}

// One bad phase: only the last two handles are wrong.
{
  const onePhase = { ...EXACT, vs: EXACT.vs.map((v, i) => (i >= 9 ? v + 5 : v)) };
  const r = G.gradeMatch(TARGET, onePhase, 1.2, 'v');
  falsy('one wrong phase FAILS', r.pass);
  equals('  … diagnosed as one phase', r.fault, 'one-phase');
  truthy('  … and the window is localised near the end', r.window != null && r.window.t0 > 7,
    r.window ? `${r.window.t0.toFixed(1)}…${r.window.t1.toFixed(1)} s` : 'none');
}

// A flat blank sheet is not a match, and is not diagnosed as a near miss.
{
  const blank = K.flatModel(0, 10, 11, 0, 0);
  const r = G.gradeMatch(TARGET, blank, 1.2, 'v');
  falsy('the blank starting sheet FAILS', r.pass);
  near('  … max error 6 m/s', r.maxErr, 6, 1e-9, 'the whole cruise phase');
  truthy('  … score below 1', r.score < 1);
}

// Grading on POSITION instead, with a position tolerance.
{
  const r = G.gradeMatch(TARGET, EXACT, 0.5, 'x');
  truthy('grading on x also passes an exact sketch', r.pass, `maxErr = ${r.maxErr.toExponential(2)}`);
  const off = { ...EXACT, vs: EXACT.vs.map((v) => v + 2) };
  const r2 = G.gradeMatch(TARGET, off, 0.5, 'x');
  falsy('  … and fails one that drifts away in position', r2.pass);
}

// ═════════════════════════════════════════════════════════════════════════════
// 10. PLOT LAYOUT — the phone rules, asserted rather than trusted
// ═════════════════════════════════════════════════════════════════════════════
section = 'Layout rules';

truthy('an UNMEASURED width (0) counts as NARROW', P.isNarrow(0), 'this shipped as a real bug once');
truthy('a 375 px phone stage is narrow', P.isNarrow(375));
truthy('an admin preview pane of 380 px is narrow', P.isNarrow(380));
falsy('a 760 px reader column is not', P.isNarrow(760));
equals('the threshold is 640 px', P.NARROW_AT, 640);
equals('the panel floor is 96 px', P.PANEL_MIN, 96);

const BOARDS = [320, 340, 375, 414, 560, 639, 640, 760, 900, 1180];
const RANGES = { x: { min: -40, max: 60 }, v: { min: -15, max: 15 }, a: { min: -8, max: 8 } };

for (const w of BOARDS) {
  const h = P.stackHeight(w, 3);
  for (const focus of [null, 'x', 'v', 'a']) {
    const st = P.layoutStack(w, h, 0, 8, RANGES, { focus });
    const tag = `w=${w} focus=${focus ?? 'none'}`;
    // Every panel readable.
    const minPanel = Math.min(...st.panels.map((p) => p.h));
    truthy(`${tag}: every panel ≥ 96 px`, minPanel >= P.PANEL_MIN - 1e-9, `smallest = ${minPanel.toFixed(1)} px`);
    // The bands fill the box EXACTLY — a hairline seam is a visible defect.
    const used = st.panels.reduce((s, p) => s + p.h, 0) + st.gap * (st.panels.length - 1) + st.pad.t + st.pad.b;
    near(`${tag}: bands fill the box exactly`, used, st.h, 0.5);
    // Panels do not overlap and are in stacking order.
    truthy(`${tag}: panels are stacked, not overlapping`,
      st.panels.every((p, i) => i === 0 || p.top >= st.panels[i - 1].top + st.panels[i - 1].h - 1e-9));
    // Focus really does enlarge the focused panel.
    if (focus) {
      const f = st.panels.find((p) => p.key === focus);
      const others = st.panels.filter((p) => p.key !== focus);
      truthy(`${tag}: the focused panel is the tallest`, others.every((o) => f.h >= o.h - 1e-9),
        `${f.h.toFixed(0)} vs ${others.map((o) => o.h.toFixed(0)).join('/')}`);
    }
    // Height does NOT depend on focus — otherwise every card below jumps.
    equals(`${tag}: canvas height independent of focus`, st.h, P.stackHeight(w, 3));
  }
  // Tick labels cannot collide: the count is capped so spacing is ≥ 48 px.
  const st = P.layoutStack(w, h, 0, 8, RANGES, {});
  const ticks = P.timeTicks(st);
  let minGap = Infinity;
  for (let i = 1; i < ticks.length; i++) minGap = Math.min(minGap, P.sxT(st, ticks[i]) - P.sxT(st, ticks[i - 1]));
  truthy(`w=${w}: time-tick labels ≥ 48 px apart`, ticks.length < 2 || minGap >= 48,
    `${ticks.length} ticks, min gap ${Number.isFinite(minGap) ? minGap.toFixed(0) : '—'} px`);
  // Two y labels per panel, far apart, and inside the gutter.
  for (const p of st.panels) {
    const ls = P.panelYLabels(p);
    equals(`w=${w} ${p.key}: exactly two y labels`, ls.length, 2);
    truthy(`w=${w} ${p.key}: y labels ≥ 70 px apart`, Math.abs(ls[1].y - ls[0].y) >= 70,
      `${Math.abs(ls[1].y - ls[0].y).toFixed(0)} px`);
  }
  truthy(`w=${w}: the gutter has room for a label`, st.pad.l >= 30, `pad.l = ${st.pad.l}`);
}

// A narrow board gets a TALLER canvas than an aspect-driven sizer would give it —
// which is the whole point of `stackHeight`.
truthy('a 340 px board still gets ≥ 3 × 96 px of panel',
  P.stackHeight(340, 3) >= 3 * P.PANEL_MIN + 30, `${P.stackHeight(340, 3)} px`);
truthy('an authored height is a CEILING, not a fixed value',
  P.stackHeight(900, 3, 400) <= 400 || P.stackHeight(900, 3, 400) === P.stackHeight(900, 3),
  `${P.stackHeight(900, 3, 400)} px with maxH = 400`);
truthy('  … but never below the readable floor',
  P.stackHeight(900, 3, 120) >= 3 * P.PANEL_MIN, `${P.stackHeight(900, 3, 120)} px with maxH = 120`);

// One scale per axis PAIR: every panel shares the time scale exactly.
{
  const st = P.layoutStack(800, P.stackHeight(800, 3), 0, 8, RANGES, { focus: 'v' });
  near('the time scale is shared by every panel', P.sxT(st, 4) - st.pad.l, P.innerW(st) / 2, 1e-9,
    'one sxT, no per-panel x transform exists');
  // Round-trip the transforms.
  near('utT(sxT(t)) === t', P.utT(st, P.sxT(st, 3.7)), 3.7, 1e-9);
  for (const p of st.panels) {
    near(`uyP(syP(y)) === y on the ${p.key} panel`, P.uyP(p, P.syP(p, 4.2)), 4.2, 1e-9);
  }
  equals('panelAt finds the middle panel', P.panelAt(st, st.panels[1].top + 5).key, 'v');
  equals('panelAt returns null in the axis row', P.panelAt(st, st.h - 2), null);
}

// ═════════════════════════════════════════════════════════════════════════════
// 11. CANVAS FILL — measured, not eyeballed
// ═════════════════════════════════════════════════════════════════════════════
section = 'Canvas fill';

// "The graph is a flat line in an empty box" and "the graph is clipped" are the
// same bug from two sides, and both are invisible to tsc. Same discipline as
// verify-fbd-fill.mjs. The v and a panels' content includes the ZERO LINE,
// because the shading and the bars are drawn from the axis — so the axis is part
// of the drawing, not empty space.
const FILL_BOARDS = [{ name: 'desktop 620', w: 620 }, { name: 'phone 340', w: 340 }];
const MIN_FILL = 0.55;

for (const [id, arch] of Object.entries(GRAPHS_ARCHETYPES)) {
  if (arch.sim === 'relative-deck') continue;
  const p = Object.fromEntries((arch.params ?? []).map((q) => [q.key, q.default]));
  const model = K.modelFromPhases(
    p.x0 ?? 0, p.u ?? 0,
    [1, 2, 3].map((n) => ({ a: p[`seg${n}_a`] ?? 0, t: p[`seg${n}_t`] ?? 0 }))
  );
  const samples = K.buildSamples(model);
  const ranges = K.rangesOf(samples, model);

  for (const board of FILL_BOARDS) {
    const h = P.stackHeight(board.w, 3);
    const st = P.layoutStack(board.w, h, K.tStart(model), K.tEnd(model), ranges, {});
    for (const panel of st.panels) {
      const series =
        panel.key === 'x' ? samples.map((s) => ({ t: s.t, y: s.x }))
        : panel.key === 'v' ? [...samples.map((s) => ({ t: s.t, y: s.v })), { t: K.tStart(model), y: 0 }]
        // The a panel draws BARS, so its content is both ends of every bar plus
        // the zero line the bars stand on. Emitting one point per segment (the
        // first draft) collapsed a single-phase motion to a single point and
        // measured 0% fill for a panel that is drawn correctly.
        : [
            ...Array.from({ length: K.segCount(model) }, (_, i) => [
              { t: model.ts[i], y: K.segAccel(model, i) },
              { t: model.ts[i + 1], y: K.segAccel(model, i) },
            ]).flat(),
            { t: K.tStart(model), y: 0 },
            { t: K.tEnd(model), y: 0 },
          ];
      const f = P.fillOf(st, panel, series);
      truthy(`${id} @ ${board.name} ${panel.key}: not clipped`,
        f.fx <= 1.001 && f.fy <= 1.001, `${(f.fx * 100).toFixed(0)}% × ${(f.fy * 100).toFixed(0)}%`);
      truthy(`${id} @ ${board.name} ${panel.key}: fills ≥ 55% on an axis`,
        Math.max(f.fx, f.fy) >= MIN_FILL, `${(f.fx * 100).toFixed(0)}% × ${(f.fy * 100).toFixed(0)}%`);
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 12. HANDLES — a pointer at this pixel sets this velocity
// ═════════════════════════════════════════════════════════════════════════════
section = 'Handles and drags';

{
  const model = TRI;
  const samples = K.buildSamples(model);
  const ranges = K.rangesOf(samples, model);
  const w = 700;
  const st = P.layoutStack(w, P.stackHeight(w, 3), K.tStart(model), K.tEnd(model), ranges, { focus: 'v' });
  const pv = st.panels.find((p) => p.key === 'v');
  const pa = st.panels.find((p) => p.key === 'a');
  const px0 = st.panels.find((p) => p.key === 'x');

  // v-node handles: one per node, at the right pixel.
  const vh = H.handlesFor(st, model, 'v');
  equals('v-mode gives one handle per node', vh.length, model.ts.length);
  near('handle 1 sits on node 1', vh[1].cx, P.sxT(st, model.ts[1]), 1e-9);
  near('  … at its velocity', vh[1].cy, P.syP(pv, model.vs[1]), 1e-9);

  // Dragging it to a known pixel sets a known velocity.
  const dragged = H.applyDrag(model, vh[1], st, vh[1].cx, P.syP(pv, 3));
  near('drag v-node 1 to the 3 m/s pixel → v = 3', dragged.vs[1], 3, 1e-9);
  near('  … other nodes untouched', dragged.vs[0] - model.vs[0], 0, 1e-12);
  // Clamped rather than allowed to run off: 999 m/s is not a Class-11 velocity.
  const clamped = H.applyDrag(model, vh[1], st, vh[1].cx, P.syP(pv, 999));
  near('an out-of-panel drag clamps to the limit', clamped.vs[1], H.DEFAULT_LIMITS.vMax, 1e-9);

  // a-bar handles: one per segment, at the bar height.
  const ah = H.handlesFor(st, model, 'a');
  equals('a-mode gives one handle per segment', ah.length, K.segCount(model));
  near('bar 0 sits at a = −5', ah[0].cy, P.syP(pa, -5), 1e-9);
  const barDragged = H.applyDrag(model, ah[0], st, ah[0].cx, P.syP(pa, -2.5));
  near('drag bar 0 to −2.5 → segAccel = −2.5', K.segAccel(barDragged, 0), -2.5, 1e-9);
  near('  … v₁ moves to 0', barDragged.vs[1], 0, 1e-9, 'v₀ + a·Δt = 10 − 2.5·4');

  // x-tangent handles: the drag direction IS the velocity.
  const xh = H.handlesFor(st, model, 'x');
  equals('x-mode gives one tangent handle per node', xh.length, model.ts.length);
  truthy('each tangent handle hangs off a stub at its node', xh.every((q) => q.stub != null));
  {
    // Put the pointer 60 px along the direction that encodes v = 4 m/s and check
    // the drag recovers exactly 4.
    const hh = xh[1];
    const side = hh.side ?? 1;
    const nodeX = P.sxT(st, model.ts[1]);
    const nodeY = P.syP(px0, K.nodePositions(model)[1]);
    const slopePx = H.slopeToPixels(st, px0, 4);
    const ptr = { x: nodeX + side * 60, y: nodeY + side * 60 * slopePx };
    const tilted = H.applyDrag(model, hh, st, ptr.x, ptr.y);
    near('tilting the tangent to a 4 m/s slope sets v = 4', tilted.vs[1], 4, 1e-9,
      'pixels → m/s, the inverse of the drawing transform');
  }
  near('slopeToPixels is the inverse of pixelsToSlope',
    H.pixelsToSlope(st, px0, 100, H.slopeToPixels(st, px0, -7.5) * 100), -7.5, 1e-9);
  truthy('a positive velocity draws UPWARD on screen', H.slopeToPixels(st, px0, 5) < 0,
    'SVG y grows downward — getting this backwards mirrors every tangent');

  // Nearest-handle hit-testing, not first-within-radius.
  {
    const near1 = H.hitTest(vh, vh[2].cx + 4, vh[2].cy + 4, 40);
    equals('hitTest returns the NEAREST handle', near1 ? near1.index : -1, 2);
    equals('  … and null when nothing is close', H.hitTest(vh, 5, 5, 10), null);
  }

  // Handle radii are SCREEN pixels: doubling the data range must not shrink them.
  {
    const wide = P.layoutStack(w, P.stackHeight(w, 3), K.tStart(model), K.tEnd(model),
      { x: { min: -400, max: 600 }, v: { min: -150, max: 150 }, a: { min: -80, max: 80 } }, { focus: 'v' });
    const wideH = H.handlesFor(wide, model, 'v');
    near('handle radius is unchanged by a 10× data range', wideH[1].r, vh[1].r, 1e-9,
      'sized in CSS px, not data units');
    truthy('  … and is at least 4.5 px', wideH[1].r >= 4.5);
  }

  // Sketch painting spans the sweep.
  {
    const flat = K.flatModel(0, 8, 9, 0, 0);
    const fs = P.layoutStack(w, P.stackHeight(w, 3), 0, 8, ranges, { focus: 'v' });
    const fpv = fs.panels.find((q) => q.key === 'v');
    const from = { x: P.sxT(fs, 0), y: P.syP(fpv, 0) };
    const to = { x: P.sxT(fs, 8), y: P.syP(fpv, 8) };
    const painted = H.applySketch(flat, fs, from, to);
    near('a sweep paints the far end to 8 m/s', painted.vs[8], 8, 1e-6);
    near('  … and the midpoint to 4 m/s', painted.vs[4], 4, 1e-6, 'a straight ramp, not eight steps');
    const tapped = H.applySketch(flat, fs, null, { x: P.sxT(fs, 3), y: P.syP(fpv, 6) });
    near('a tap moves only the nearest handle', tapped.vs[3], 6, 1e-6);
    near('  … leaving its neighbour alone', tapped.vs[4], 0, 1e-12);
  }

  // Marker times clamp to the run.
  near('markerTimeAt clamps below', H.markerTimeAt(st, -500), K.tStart(model), 1e-9);
  near('markerTimeAt clamps above', H.markerTimeAt(st, 99999), K.tEnd(model), 1e-9);
  truthy('markerPoints sits on the x–t curve', (() => {
    const mk = H.markerPoints(st, model, 2, 6);
    return mk != null && Math.abs(mk.a.cy - P.syP(px0, K.xAt(model, 2))) < 1e-9;
  })());
}

// ═════════════════════════════════════════════════════════════════════════════
// 13. THE EVIDENCE GATE — no preamble, and nothing unreachable
// ═════════════════════════════════════════════════════════════════════════════
section = 'Evidence gates';

const CODES_USED = new Set();
for (const [id, arch] of Object.entries(GRAPHS_ARCHETYPES)) {
  CODES_USED.add(arch.targets);
  falsy(`${id}: the card is NOT a preamble`, E.evidenceReady(arch.targets, E.NO_EVIDENCE),
    'nothing seen, nothing done → the card must stay off');
  truthy(`${id}: the card IS reachable`, E.evidenceReady(arch.targets, E.FULL_EVIDENCE),
    'Phase 1 shipped four codes that could never fire');
}

// The headline gate needs its OWN evidence, not merely a finished run.
falsy('positive_a card needs the a-vs-v stretch, not just a finished run',
  E.evidenceReady('positive_a_means_speeding_up', { ...E.FULL_EVIDENCE, visitedTrend: false }),
  'a timer would be a preamble with extra steps');
falsy('flat-line card needs BOTH kinds of flat',
  E.evidenceReady('flat_xt_means_constant_velocity', { ...E.FULL_EVIDENCE, visitedFlat: { atRest: true, uniform: false } }));
falsy('turning-point card needs the turning point',
  E.evidenceReady('at_rest_means_zero_acceleration', { ...E.FULL_EVIDENCE, visitedTurn: false }));
falsy('distance card needs the two numbers to have separated',
  E.evidenceReady('distance_equals_displacement', { ...E.FULL_EVIDENCE, diverges: false }));
falsy('sketch card needs the student to have actually sketched',
  E.evidenceReady('xt_curve_is_the_path', { ...E.FULL_EVIDENCE, edited: false }));

// ═════════════════════════════════════════════════════════════════════════════
// 13b. CAN EACH ARCHETYPE SUPPLY ITS OWN EVIDENCE?
// ═════════════════════════════════════════════════════════════════════════════
section = 'Evidence is achievable';

/*
 * §13 proves each gate CAN open, given the evidence. This section proves the
 * evidence is actually PRESENT IN THAT ARCHETYPE'S OWN MOTION — which is a
 * different and stronger claim, and it is the one that caught a real defect:
 * the turning-point card was gated on `speedTrend(...) === 'turning'`, which
 * requires |v| ≤ 1e-9. A cursor moving in finite steps never lands there, so the
 * card was unreachable on the very archetype built around it — invisible to §13,
 * which supplies the flag directly, and invisible to tsc. Hence `turningTimes`.
 */
for (const [id, a] of ARCH) {
  if (a.sim === 'relative-deck') continue;
  const p = Object.fromEntries((a.params ?? []).map((q) => [q.key, q.default]));
  const m = K.modelFromPhases(p.x0 ?? 0, p.u ?? 0,
    [1, 2, 3].map((n) => ({ a: p[`seg${n}_a`] ?? 0, t: p[`seg${n}_t`] ?? 0 })));
  const s = K.buildSamples(m);

  switch (a.targets) {
    case 'at_rest_means_zero_acceleration':
      truthy(`${id}: the motion HAS a turning point`, K.turningTimes(m).length >= 1,
        K.turningTimes(m).map((t) => `${t.toFixed(2)} s`).join(', ') || 'NONE');
      truthy(`${id}: and a is non-zero there`,
        K.turningTimes(m).every((t) => Math.abs(K.aAt(m, t)) > 1e-6),
        'v = 0 with a = 0 would be a body simply at rest');
      break;

    case 'positive_a_means_speeding_up':
    case 'retardation_is_negative_acceleration':
      truthy(`${id}: the motion HAS a stretch where a opposes v`,
        s.some((q) => K.speedTrend(q.v, q.a) === 'slowing-down' && Math.abs(q.a) > 1e-6),
        'without it the card can never fire');
      truthy(`${id}: … and one where they agree, for the contrast`,
        s.some((q) => K.speedTrend(q.v, q.a) === 'speeding-up'));
      break;

    case 'flat_xt_means_constant_velocity':
      truthy(`${id}: the motion HAS a stretch at rest`, s.some((q) => Math.abs(q.v) < 0.35),
        'the flat x–t line');
      truthy(`${id}: … and one at uniform velocity`,
        s.some((q) => Math.abs(q.a) < 1e-6 && Math.abs(q.v) > 0.35), 'the flat v–t line');
      break;

    case 'distance_equals_displacement':
      truthy(`${id}: distance and |displacement| DO separate`,
        Math.abs(K.pathLength(m) - Math.abs(K.signedArea(m))) > 1,
        `${K.pathLength(m).toFixed(1)} m vs ${Math.abs(K.signedArea(m)).toFixed(1)} m`);
      break;

    case 'area_under_vt_is_speed':
      truthy(`${id}: there IS an area to shade`, Math.abs(K.signedArea(m)) > 1,
        `${K.signedArea(m).toFixed(1)} m`);
      break;

    case 'avg_equals_instantaneous':
      // The chord and the midpoint tangent must genuinely disagree, or the lesson
      // is a picture of two identical lines.
      {
        const t0 = K.tStart(m);
        const t1 = K.tEnd(m);
        const ma = t0 + (t1 - t0) * (p.mark_a ?? 0.2);
        const mb = t0 + (t1 - t0) * (p.mark_b ?? 0.8);
        const gap = Math.abs(K.chordSlope(m, ma, mb) - K.tangentSlope(m, (ma + mb) / 2));
        truthy(`${id}: chord and midpoint tangent DISAGREE`, gap > 0.5, `gap = ${gap.toFixed(2)} m/s`);
      }
      break;

    case 'average_v_is_mean_of_endpoints':
      // (u+v)/2 must be demonstrably WRONG here, or the attack has nothing to
      // point at. That needs more than one phase.
      truthy(`${id}: (u+v)/2 is demonstrably wrong for this motion`,
        Math.abs((m.vs[0] + m.vs[m.vs.length - 1]) / 2 - K.chordSlope(m, K.tStart(m), K.tEnd(m))) > 0.5,
        `(u+v)/2 = ${((m.vs[0] + m.vs[m.vs.length - 1]) / 2).toFixed(2)}, ` +
        `true average = ${K.chordSlope(m, K.tStart(m), K.tEnd(m)).toFixed(2)} m/s`);
      truthy(`${id}: … because it has more than one phase`, K.segCount(m) > 1, `${K.segCount(m)} phases`);
      break;

    case 'steeper_means_higher_up':
      // A shallow-but-high stretch has to exist, or "highest and slowest" is not
      // on screen to be pointed at.
      {
        const last = s[s.length - 1];
        const steepest = s.reduce((b, q) => (Math.abs(q.v) > Math.abs(b.v) ? q : b), s[0]);
        truthy(`${id}: the highest point is NOT the steepest`,
          Math.abs(last.v) < Math.abs(steepest.v) - 0.5,
          `end |v| = ${Math.abs(last.v).toFixed(1)}, max |v| = ${Math.abs(steepest.v).toFixed(1)} m/s`);
        truthy(`${id}: … and it really is the furthest along`,
          Math.abs(last.x) >= Math.max(...s.map((q) => Math.abs(q.x))) - 1e-9);
      }
      break;

    case 'xt_curve_is_the_path':
      truthy(`${id}: the student can edit it`, !!p.sketch || (a.reveals ?? []).flat().includes('edit'));
      break;

    default:
      break;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 14. ARCHETYPE DATA HYGIENE
// ═════════════════════════════════════════════════════════════════════════════
section = 'Archetype library';

truthy('at least 10 archetypes', ARCH.length >= 10, `${ARCH.length} built`);

// Codes the module declares. Kept as a literal list because a TS union is erased
// at runtime — and that literal is exactly what makes the "no dead code" check
// below possible.
const LOCAL_CODES = [
  'positive_a_means_speeding_up', 'retardation_is_negative_acceleration',
  'flat_xt_means_constant_velocity', 'steeper_means_higher_up', 'xt_curve_is_the_path',
  'area_under_vt_is_speed', 'distance_equals_displacement', 'average_v_is_mean_of_endpoints',
  'avg_equals_instantaneous', 'at_rest_means_zero_acceleration',
  'relative_velocity_adds_scalars', 'river_crossing_min_time_equals_min_drift',
  'rain_direction_is_absolute',
];
const UPSTREAM_CODES = [
  'radial_departure', 'centrifugal_in_ground', 'velocity_zero_at_apex', 'accel_zero_at_apex',
  'coupled_components', 'heavier_falls_faster', 'range_always_max_at_45',
  'speed_constant_in_ucm_means_no_accel', 'frame_confusion',
];
const VALID_CODES = new Set([...LOCAL_CODES, ...UPSTREAM_CODES]);

const STUDIO_PARAM_KEYS = new Set([
  'x0', 'u', 'seg1_a', 'seg1_t', 'seg2_a', 'seg2_t', 'seg3_a', 'seg3_t',
  'driver', 'sketch', 'nodes', 'area', 'tangent', 'chord', 'ledger', 'equations',
  'graded_on', 'tolerance', 'mark_a', 'mark_b',
]);
const RELATIVE_PARAM_KEYS = new Set([
  'scene', 'width', 'current', 'boat', 'heading', 'rain', 'walk', 'wind',
  'v_a', 'v_b', 'len_a', 'len_b', 'construction',
]);

for (const [id, a] of ARCH) {
  equals(`${id}: id matches its key`, a.id, id);
  equals(`${id}: scenario is 'graphs'`, a.scenario, 'graphs');
  truthy(`${id}: names a real bench`,
    ['graph-studio', 'match-the-motion', 'relative-deck'].includes(a.sim), a.sim);
  truthy(`${id}: targets is a known code`, VALID_CODES.has(a.targets), a.targets);
  equals(`${id}: targets === attacks.code`, a.targets, a.attacks?.code,
    'declaring one code and displaying another is a Phase-1 failure');
  truthy(`${id}: the belief is written out`, (a.attacks?.belief ?? '').length > 25);
  truthy(`${id}: and the sentence that breaks it`, (a.attacks?.attack ?? '').length > 60);
  truthy(`${id}: ≥ 2 params`, (a.params ?? []).length >= 2, `${(a.params ?? []).length}`);
  truthy(`${id}: ≥ 3 guided beats`, (a.defaultSteps ?? []).length >= 3, `${(a.defaultSteps ?? []).length}`);
  truthy(`${id}: every beat has copy and a CTA`,
    (a.defaultSteps ?? []).every((s) => (s.say ?? '').length > 40 && (s.cta ?? '').length > 2));
  truthy(`${id}: beats are distinct`,
    new Set((a.defaultSteps ?? []).map((s) => s.say)).size === (a.defaultSteps ?? []).length);
  truthy(`${id}: title + summary are real`, a.title?.length > 8 && a.summary?.length > 40);
  truthy(`${id}: has a closing tip`, (a.tip ?? '').length > 40);

  // Predict gates: one response per option, and a valid answer index.
  if (a.predict) {
    equals(`${id}: one predict response per option`, a.predict.responses.length, a.predict.options.length,
      'three wrong answers are three different pieces of reasoning');
    truthy(`${id}: answerIndex is in range`,
      a.predict.answerIndex >= 0 && a.predict.answerIndex < a.predict.options.length);
    truthy(`${id}: every response says something`, a.predict.responses.every((r) => r.length > 40));
    truthy(`${id}: options are distinct`, new Set(a.predict.options).size === a.predict.options.length);
  }

  // Every declared param key must be READ by its resolver. A declared parameter
  // with no control was the single most common decoration in Phase 1.
  const keys = (a.params ?? []).map((q) => q.key);
  const allowed = a.sim === 'relative-deck' ? RELATIVE_PARAM_KEYS : STUDIO_PARAM_KEYS;
  const stray = keys.filter((k) => !allowed.has(k));
  equals(`${id}: no param the resolver ignores`, stray.join(',') || 'none', 'none');

  // The reveal ladder, where the bench uses one.
  if (a.sim === 'graph-studio') {
    truthy(`${id}: has a reveal ladder`, Array.isArray(a.reveals));
    equals(`${id}: one reveal entry per beat`, (a.reveals ?? []).length, (a.defaultSteps ?? []).length);
    const flat = (a.reveals ?? []).flat();
    truthy(`${id}: 'edit' is reachable`, flat.includes('edit'),
      'a read-only flagship would be a moving diagram');
    truthy(`${id}: all three panels get revealed`,
      ['x', 'v', 'a'].every((k) => flat.includes(k)), flat.join(','));
    truthy(`${id}: every token is known`,
      flat.every((t) => ['x', 'v', 'a', 'area', 'tangent', 'chord', 'edit'].includes(t)));
  } else {
    equals(`${id}: no ladder on this bench`, a.reveals, undefined,
      'match gates editing only; the deck reveals arrows, not panels');
  }
}

// No dead codes: every declared local code is used by at least one archetype.
for (const code of LOCAL_CODES) {
  truthy(`code '${code}' is used by an archetype`, CODES_USED.has(code),
    'Phase 1 shipped 22 declared-but-unused codes');
}

// Id collisions with the engine's existing library would silently re-point saved
// pages at a different scene.
section = 'Id safety';
const clashes = Object.keys(GRAPHS_ARCHETYPES).filter((k) => k in OTHER_LIBS);
equals('no id collides with any other E2 library', clashes.join(',') || 'none', 'none',
  'archetype ids are stored on saved book pages');
equals('every graphs id is unique', new Set(Object.keys(GRAPHS_ARCHETYPES)).size, ARCH.length);

// Every studio archetype's authored params really do build a usable motion.
section = 'Authored motions';
for (const [id, a] of ARCH) {
  if (a.sim === 'relative-deck') continue;
  const p = Object.fromEntries((a.params ?? []).map((q) => [q.key, q.default]));
  const m = K.modelFromPhases(p.x0 ?? 0, p.u ?? 0,
    [1, 2, 3].map((n) => ({ a: p[`seg${n}_a`] ?? 0, t: p[`seg${n}_t`] ?? 0 })));
  truthy(`${id}: the motion has a real duration`, K.duration(m) > 0.5, `${K.duration(m).toFixed(1)} s`);
  const s = K.buildSamples(m);
  truthy(`${id}: every sample is finite`,
    s.every((q) => Number.isFinite(q.x) && Number.isFinite(q.v) && Number.isFinite(q.a)), `${s.length} samples`);
  // The round trip must hold for the AUTHORED motions too, not just the fixtures.
  const ix = K.cumulativeIntegral(s, (q) => q.v, m.x0);
  let worst = 0;
  for (let i = 0; i < s.length; i++) worst = Math.max(worst, Math.abs(ix[i].y - s[i].x));
  near(`${id}: ∫v dt === x–t`, worst, 0, 1e-6);
  const dxs = K.derivativeSeries(s, (q) => q.x);
  let worstD = 0;
  let checked = 0;
  for (let i = 0; i < dxs.length; i++) {
    if (dxs[i].d == null) continue;
    checked++;
    worstD = Math.max(worstD, Math.abs(dxs[i].d - s[i].v));
  }
  near(`${id}: d(x–t)/dt === v–t`, worstD, 0, 1e-6, `${checked} interior points`);
}

// Relative archetypes must solve to finite, sensible numbers at their defaults.
for (const [id, a] of ARCH) {
  if (a.sim !== 'relative-deck') continue;
  const p = Object.fromEntries((a.params ?? []).map((q) => [q.key, q.default]));
  if (p.scene === 'river') {
    const r = R.solveRiver({ width: p.width, current: p.current, boat: p.boat, headingDeg: p.heading });
    truthy(`${id}: the crossing is solvable at its defaults`, r.crossTime != null && r.crossTime > 0,
      `${r.crossTime?.toFixed(2)} s`);
    truthy(`${id}: min-time is no slower than min-drift`, r.minTime.time <= r.minDrift.time + 1e-9);
  } else if (p.scene === 'rain') {
    const r = R.solveRain(p.rain, p.walk, p.wind ?? 0);
    truthy(`${id}: the tilt is finite and forwards`, Number.isFinite(r.umbrellaTiltDeg) && r.umbrellaTiltDeg > 0,
      `${r.umbrellaTiltDeg.toFixed(2)}°`);
  } else {
    const r = R.solveTrains(p.v_a, p.v_b, p.len_a ?? 0, p.len_b ?? 0);
    near(`${id}: v_AB = −v_BA at its defaults`, r.vAB + r.vBA, 0, 1e-12);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// Report
// ═════════════════════════════════════════════════════════════════════════════

const nameW = Math.min(64, Math.max(...rows.map((r) => r.name.length), 10));
const pad = (s, n) => String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s).padEnd(n);
const padS = (s, n) => String(s).padStart(n);
const GRN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RST = '\x1b[0m';

console.log('');
console.log('  motion-lab UNIT 1 — motion graphs · match the motion · relative deck   (node ' + process.version + ')');
console.log('  ' + '─'.repeat(nameW + 58));

let last = '';
for (const r of rows) {
  if (r.section !== last) {
    last = r.section;
    console.log(`\n  ${DIM}── ${r.section} ${'─'.repeat(Math.max(0, nameW + 52 - r.section.length))}${RST}`);
  }
  console.log(
    '  ' + (r.ok ? `${GRN}PASS${RST} ` : `${RED}FAIL${RST} `) +
    pad(r.name, nameW + 2) +
    padS(r.got, 14) + padS(r.want, 16) +
    (r.note ? `   ${DIM}${r.note}${RST}` : '')
  );
}

console.log('\n  ' + '─'.repeat(nameW + 58));
console.log(
  `  ${rows.length - fails}/${rows.length} passed` +
  (fails ? `  —  ${RED}${fails} FAILED${RST}` : `  —  ${GRN}all good${RST}`)
);
console.log('');

process.exit(fails ? 1 : 0);
