/*
 * verify-mechanics-phase2.mjs — physics verification for the Phase-2 E1 sims.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-mechanics-phase2.mjs
 *
 * Requires Node ≥ 22.6. It imports the TypeScript sources DIRECTLY — Node strips
 * the types natively, and the `registerHooks` shim below resolves the repo's
 * extensionless relative imports to their `.ts` files, which native resolution
 * does not do. No build step, no test framework, no dependencies. Same shim as
 * `verify-fbd-fill.mjs` and `verify-mechanics-bench.mjs`.
 *
 * WHY THIS EXISTS. PHYSICS_SIMULATION_PROGRAM.md §9: "Physics must be verifiable
 * outside React. No academic claim ships unverified." The Phase-1 record (§10)
 * lists six real physics bugs this layer caught — including a bridge-crest
 * normal force that read 9 800 N instead of 4 800 N, and a two-block scene that
 * solved to a confident wrong number. Every expected value below is derived in
 * the comment above its case from the standard Class-11 result, NOT copied out
 * of a previous run of this code.
 *
 * Some groups deliberately re-derive a quantity by a SECOND, independent route
 * (numeric work integral vs the analytic ledger; kinematics vs energy for the
 * rolling race) — agreement between two derivations is evidence; agreement
 * between a function and itself is not.
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

const BENCH = new URL('../packages/book-renderer/blocks/mechanics-bench/', import.meta.url);
const E = (f) => new URL(`energy/lib/${f}`, BENCH).href;
const R = (f) => new URL(`rotation/lib/${f}`, BENCH).href;

const track = await import(E('track.ts'));
const ledger = await import(E('ledger.ts'));
const coaster = await import(E('coaster.ts'));
const collide = await import(E('collide.ts'));
const spring = await import(E('spring.ts'));
const orbit = await import(E('orbit.ts'));
const inertia = await import(R('inertia.ts'));
const torque = await import(R('torque.ts'));
const rolling = await import(R('rolling.ts'));
const angmom = await import(R('angmom.ts'));

const { ENERGY_ARCHETYPES, ENERGY_ARCHETYPE_ORDER } =
  await import(new URL('archetypes.energy.ts', BENCH).href);
const { ROTATION_ARCHETYPES, ROTATION_ARCHETYPE_ORDER } =
  await import(new URL('archetypes.rotation.ts', BENCH).href);
const { MISCONCEPTION } = await import(new URL('energy/kit/phase2.ts', BENCH).href);

const G = 9.8;

// ── Tiny harness ─────────────────────────────────────────────────────────────

const results = [];
let failures = 0;

function check(group, name, actual, expected, tol = 1e-9) {
  const ok = typeof expected === 'number'
    ? Number.isFinite(actual) && Math.abs(actual - expected) <= tol
    : actual === expected;
  if (!ok) failures++;
  results.push({
    group, name, ok,
    actual: typeof actual === 'number' ? fmt(actual) : String(actual),
    expected: typeof expected === 'number' ? fmt(expected) : String(expected),
  });
}

function assert(group, name, cond, detail = '') {
  if (!cond) failures++;
  results.push({ group, name, ok: !!cond, actual: cond ? 'yes' : `no ${detail}`, expected: 'yes' });
}

const fmt = (v) =>
  !Number.isFinite(v) ? String(v)
    : Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-4 && v !== 0) ? v.toExponential(4)
      : v.toFixed(6);

// ═════════════════════════════════════════════════════════════════════════════
// 1. ENERGY LEDGER — a FRICTIONLESS track conserves KE + PE exactly.
//
// Track: (0,3) → (2,0) → (4,1.5) → (6,0). Released from rest at the top.
// PE zero is the lowest point, y = 0. Total = mgh = 2·9.8·3 = 58.8 J, and every
// sample must add to that. At the 1.5 m hump the speed is v = √(2g(3 − 1.5)) =
// √29.4 = 5.42218 m/s.
// ═════════════════════════════════════════════════════════════════════════════
{
  const pts = [{ x: 0, y: 3 }, { x: 2, y: 0 }, { x: 4, y: 1.5 }, { x: 6, y: 0 }];
  const o = { mass: 2, g: G, mu: 0, v0: 0 };
  const run = ledger.runTrack(pts, o, 400);

  check('1 · smooth track', 'total energy = mgh', run.total, 2 * G * 3);
  check('1 · smooth track', 'KE+PE+heat drift over 401 samples', run.drift, 0, 1e-9);
  check('1 · smooth track', 'no heat with mu = 0', run.heat, 0);
  assert('1 · smooth track', 'it reaches the end', run.stopped === false);

  // Speed at the top of the 1.5 m hump.
  const segs = track.segmentsOf(pts);
  const sHump = segs[0].len + segs[1].len;
  const atHump = ledger.stateAtS(pts, o, sHump);
  check('1 · smooth track', 'v at the 1.5 m hump = sqrt(2g·1.5)', atHump.v, Math.sqrt(2 * G * 1.5), 1e-9);
  check('1 · smooth track', 'PE at the hump = mgh', atHump.pe, 2 * G * 1.5, 1e-9);

  // The same height reached by a DIFFERENT path must give the same speed —
  // path independence, which is the archetype's whole claim.
  const straight = [{ x: 0, y: 3 }, { x: 6, y: 0 }];
  const endA = ledger.stateAtS(pts, o, track.trackLength(pts));
  const endB = ledger.stateAtS(straight, o, track.trackLength(straight));
  check('1 · smooth track', 'final speed is path-independent', endA.v, endB.v, 1e-9);
  check('1 · smooth track', 'and equals sqrt(2gh)', endA.v, Math.sqrt(2 * G * 3), 1e-9);
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. ENERGY LEDGER WITH FRICTION — heat = μmgd, and the three accounts still sum.
//
// FLAT track, d = 4 m, μ = 0.3, m = 2 kg, v0 = 8 m/s.
//   KE0  = ½·2·8²                 = 64 J
//   heat = μmgd = 0.3·2·9.8·4     = 23.52 J
//   KE_f = 64 − 23.52             = 40.48 J  →  v = √40.48 = 6.362389 m/s
// ═════════════════════════════════════════════════════════════════════════════
{
  const flat = [{ x: 0, y: 0 }, { x: 4, y: 0 }];
  const o = { mass: 2, g: G, mu: 0.3, v0: 8 };
  const run = ledger.runTrack(flat, o, 400);

  check('2 · friction', 'heat = mu*m*g*d', run.heat, 0.3 * 2 * G * 4);
  check('2 · friction', 'and frictionHeat() agrees', ledger.frictionHeat(o, 4), 0.3 * 2 * G * 4);
  check('2 · friction', 'KE+PE+heat drift', run.drift, 0, 1e-9);
  check('2 · friction', 'total stays at KE0', run.total, 64);
  const end = run.samples[run.samples.length - 1];
  check('2 · friction', 'final KE = 64 − 23.52', end.ke, 40.48, 1e-9);
  check('2 · friction', 'final speed = sqrt(40.48)', end.v, Math.sqrt(40.48), 1e-9);

  // A slower start stops part-way: it stops when ALL the KE has become heat.
  //   16 J / (0.3·2·9.8) = 2.721088 m
  const stops = ledger.runTrack(flat, { ...o, v0: 4 }, 200);
  assert('2 · friction', 'a slow start stops on the flat', stops.stopped === true);
  check('2 · friction', 'stop distance = KE0/(mu·m·g)', stops.endS, 16 / (0.3 * 2 * G), 1e-9);
  check('2 · friction', 'all 16 J ended up as heat', stops.heat, 16, 1e-9);

  // On a RAMP the heat depends on the HORIZONTAL run, not the ramp length:
  // μmg·cosθ·L = μmg·Δx. Ramp (0,2)→(3,0): L = 3.605551, Δx = 3.
  const ramp = [{ x: 0, y: 2 }, { x: 3, y: 0 }];
  const ro = { mass: 5, g: G, mu: 0.25, v0: 0 };
  const rrun = ledger.runTrack(ramp, ro, 300);
  check('2 · friction', 'ramp heat = mu·m·g·Δx (not ·L)', rrun.heat, 0.25 * 5 * G * 3, 1e-9);
  check('2 · friction', 'ramp drift', rrun.drift, 0, 1e-9);
  // KE at the bottom = mgh − heat = 5·9.8·2 − 36.75 = 98 − 36.75 = 61.25 J
  const rend = rrun.samples[rrun.samples.length - 1];
  check('2 · friction', 'ramp final KE = mgh − heat', rend.ke, 98 - 36.75, 1e-9);
}

// ═════════════════════════════════════════════════════════════════════════════
// 2b. INDEPENDENT CROSS-CHECK of the ledger.
//
// The ledger is analytic. Re-derive the SAME final speed from the work–energy
// theorem by numerically integrating ∫μmg·cosθ·ds over the track using only
// `poseAtS` (geometry, not the ledger), and by RK4-in-time on a single ramp.
// Two routes agreeing is evidence; a function agreeing with itself is not.
// ═════════════════════════════════════════════════════════════════════════════
{
  const pts = [{ x: 0, y: 3 }, { x: 2, y: 0.4 }, { x: 4.5, y: 1.2 }, { x: 7, y: 0 }];
  const o = { mass: 3, g: G, mu: 0.12, v0: 1.5 };
  const L = track.trackLength(pts);

  // Numeric friction work: Σ μ m g cosθ Δs, sampled from the GEOMETRY module
  // alone (`poseAtS`), never from the ledger's closed form. Summed ramp by ramp
  // rather than over one global grid: a global grid straddles the slope
  // discontinuities at the joins and leaves an O(1/N) artefact there — 1.4e-5 at
  // N = 200 000, which would force a tolerance loose enough to hide a real bug.
  let work = 0;
  for (const seg of track.segmentsOf(pts)) {
    const N = 20000;
    for (let i = 0; i < N; i++) {
      const s = seg.s0 + ((i + 0.5) * seg.len) / N;
      const pose = track.poseAtS(pts, s);
      work += o.mu * o.mass * G * pose.segment.cos * (seg.len / N);
    }
  }
  const y0 = pts[0].y;
  const yEnd = pts[pts.length - 1].y;
  const keNumeric = 0.5 * o.mass * o.v0 ** 2 + o.mass * G * (y0 - yEnd) - work;
  const end = ledger.stateAtS(pts, o, L);
  check('2b · cross-check', 'analytic KE vs numeric work integral', end.ke, keNumeric, 1e-6);
  check('2b · cross-check', 'analytic heat vs numeric work integral', end.heat, work, 1e-6);

  // RK4 in time down ONE ramp, comparing the final speed with v² = 2aL.
  //   ramp (0,1)→(2,0): L = 2.236068, sinθ = −0.4472136, cosθ = 0.8944272
  //   a = −g(sinθ + μcosθ) = −9.8(−0.4472136 + 0.12·0.8944272) = 3.331299 m/s²
  //   v = √(2·3.331299·2.236068) = 3.860051 m/s
  const one = [{ x: 0, y: 1 }, { x: 2, y: 0 }];
  const oo = { mass: 1, g: G, mu: 0.12, v0: 0 };
  const seg = track.segmentsOf(one)[0];
  const a = ledger.accelOn(seg, oo);
  let s = 0, v = 0;
  const dt = 1e-5;
  for (let i = 0; i < 2000000 && s < seg.len; i++) { v += a * dt; s += v * dt; }
  check('2b · cross-check', 'RK-stepped ramp speed vs sqrt(2aL)', v, Math.sqrt(2 * a * seg.len), 2e-3);
  check('2b · cross-check', 'ledger ramp speed vs sqrt(2aL)',
    ledger.stateAtS(one, oo, seg.len).v, Math.sqrt(2 * a * seg.len), 1e-9);
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. ROLLER COASTER — the loop needs v² ≥ gr at the top, so h ≥ 2.5r.
//
// r = 2 m, smooth. Release from exactly 2.5r = 5 m:
//   v²_bottom = 2g·5      = 98      m²/s²
//   v²_top    = 98 − 4g·2 = 19.6    m²/s²
//   g·r       = 9.8·2     = 19.6    m²/s²   →  headroom exactly 0, N_top = 0
//   N_bottom  = m·v²/r + mg = 1·98/2 + 9.8 = 58.8 N = 6mg  ← the classic 6mg
// ═════════════════════════════════════════════════════════════════════════════
{
  const spec = { releaseH: 5, loopR: 2, runIn: 0, mu: 0, mass: 1, g: G };
  const v = coaster.analyseLoop(spec);
  check('3 · coaster', 'v² at the loop bottom', v.vBottomSq, 98, 1e-9);
  check('3 · coaster', 'v² at the loop top', v.vTopSq, 19.6, 1e-9);
  check('3 · coaster', 'required v²_top = g·r', v.vTopMinSq, 19.6, 1e-9);
  check('3 · coaster', 'headroom at 2.5r is exactly zero', v.headroom, 0, 1e-9);
  check('3 · coaster', 'N at the top is exactly zero', v.nTop, 0, 1e-9);
  check('3 · coaster', 'N at the bottom = 6mg', v.nBottom, 6 * 1 * G, 1e-9);
  check('3 · coaster', 'minimum release height = 2.5r', v.minReleaseH, 5, 1e-12);
  assert('3 · coaster', 'exactly 2.5r clears', v.clears === true);

  // A hair below fails, and fails INSIDE the loop — not before it.
  const low = coaster.analyseLoop({ ...spec, releaseH: 4.9 });
  assert('3 · coaster', 'just under 2.5r comes off the track', low.clears === false);
  check('3 · coaster', 'and the failure is named', low.failure, 'falls-off-inside-loop');

  // "It only has to reach the top" — the misconception, priced.
  // v_top = 0 needs h = 2r = 4 m; the truth needs 5 m. 25% more.
  const naive = coaster.analyseLoop({ ...spec, releaseH: 4 });
  check('3 · coaster', 'at h = 2r the car arrives with v² = 0', naive.vTopSq, 0, 1e-9);
  assert('3 · coaster', 'and it does NOT clear the loop', naive.clears === false);

  // N first reaches zero at the TOP, nowhere earlier: sweep φ at critical.
  let minPhi = 0, minN = Infinity;
  for (let i = 0; i <= 720; i++) {
    const phi = (i / 720) * Math.PI;
    const n = coaster.normalAtAngle(spec, phi);
    if (n < minN) { minN = n; minPhi = phi; }
  }
  check('3 · coaster', 'N is smallest at φ = π (the top)', minPhi, Math.PI, 1e-6);
  check('3 · coaster', 'and its minimum is zero', minN, 0, 1e-9);
  check('3 · coaster', 'N(0) at the bottom = 6mg', coaster.normalAtAngle(spec, 0), 6 * G, 1e-9);

  // Friction on the run-in raises the required release height by exactly μd.
  check('3 · coaster', 'friction raises h_min by mu·d',
    coaster.minReleaseHeight(2, 0.2, 6), 5 + 0.2 * 6, 1e-12);
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. COLLISIONS, 1-D.
//
// (a) EQUAL masses, elastic, target at rest → they EXCHANGE velocities exactly.
//     v1 = ((m − m)u1 + 2m·0)/2m = 0 ;  v2 = (0 + 2m·u1)/2m = u1.
// (b) PERFECTLY INELASTIC (e = 0): both leave at v_com, momentum conserved,
//     KE loss = ½·μ_red·v_rel².  m1 = 3, u1 = 4, m2 = 5, u2 = −2:
//       v_com = (12 − 10)/8 = 0.25 m/s
//       μ_red = 15/8 = 1.875 ;  v_rel = 6  →  ΔKE = ½·1.875·36 = 33.75 J
// (c) CoM FRAME, elastic: both velocities are exactly REVERSED.
// ═════════════════════════════════════════════════════════════════════════════
{
  // (a)
  const eq = collide.collide1D(2, 5, 2, 0, 1);
  check('4 · collision 1-D', 'equal masses elastic: v1 = 0', eq.v1, 0, 1e-15);
  check('4 · collision 1-D', 'equal masses elastic: v2 = u1', eq.v2, 5, 1e-15);
  check('4 · collision 1-D', 'momentum conserved', 2 * eq.v1 + 2 * eq.v2, 2 * 5, 1e-15);
  check('4 · collision 1-D', 'KE conserved at e = 1',
    collide.ke1D(2, eq.v1) + collide.ke1D(2, eq.v2), collide.ke1D(2, 5), 1e-15);
  check('4 · collision 1-D', 'and keLoss() says zero', collide.keLoss(2, 5, 2, 0, 1), 0, 1e-15);

  // Also with both moving: 2 kg at 5 and 2 kg at −3 must swap to −3 and 5.
  const eq2 = collide.collide1D(2, 5, 2, -3, 1);
  check('4 · collision 1-D', 'both moving: v1 = u2', eq2.v1, -3, 1e-15);
  check('4 · collision 1-D', 'both moving: v2 = u1', eq2.v2, 5, 1e-15);

  // (b)
  const st = collide.collide1D(3, 4, 5, -2, 0);
  check('4 · collision 1-D', 'perfectly inelastic: v1 = v_com', st.v1, 0.25, 1e-15);
  check('4 · collision 1-D', 'perfectly inelastic: v2 = v_com', st.v2, 0.25, 1e-15);
  check('4 · collision 1-D', 'momentum conserved', 3 * st.v1 + 5 * st.v2, 3 * 4 + 5 * -2, 1e-13);
  const keBefore = collide.ke1D(3, 4) + collide.ke1D(5, -2);
  const keAfter = collide.ke1D(3, st.v1) + collide.ke1D(5, st.v2);
  check('4 · collision 1-D', 'KE loss = ½·μ_red·v_rel²', keBefore - keAfter, 33.75, 1e-12);
  check('4 · collision 1-D', 'and keLoss() agrees', collide.keLoss(3, 4, 5, -2, 0), 33.75, 1e-12);
  check('4 · collision 1-D', 'reduced mass = m1m2/(m1+m2)', collide.reducedMass(3, 5), 1.875, 1e-15);

  // Momentum is conserved for EVERY e — sweep it.
  let pWorst = 0;
  for (let i = 0; i <= 100; i++) {
    const e = i / 100;
    const r = collide.collide1D(3, 4, 5, -2, e);
    pWorst = Math.max(pWorst, Math.abs(3 * r.v1 + 5 * r.v2 - 2));
  }
  check('4 · collision 1-D', 'momentum conserved for every e in [0,1]', pWorst, 0, 1e-13);

  // (c) CoM frame: elastic ⇒ both velocities reverse, exactly.
  const m1 = 3, u1 = 4, m2 = 5, u2 = -2;
  const before = collide.toComFrame(m1, u1, m2, u2);
  const g1 = collide.collide1D(m1, u1, m2, u2, 1);
  const after = collide.toComFrame(m1, g1.v1, m2, g1.v2);
  check('4 · CoM frame', 'v_com is unchanged by the collision', after.vCom, before.vCom, 1e-13);
  check('4 · CoM frame', 'body 1 velocity is exactly reversed', after.v1, -before.v1, 1e-13);
  check('4 · CoM frame', 'body 2 velocity is exactly reversed', after.v2, -before.v2, 1e-13);
  check('4 · CoM frame', 'total momentum in the CoM frame is zero',
    m1 * before.v1 + m2 * before.v2, 0, 1e-13);
  // And the round trip back to the ground frame reproduces the collision.
  const back = collide.fromComFrame(-before.v1, -before.v2, before.vCom);
  check('4 · CoM frame', 'reverse-then-return reproduces v1', back.v1, g1.v1, 1e-13);
  check('4 · CoM frame', 'reverse-then-return reproduces v2', back.v2, g1.v2, 1e-13);
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. COLLISIONS, 2-D — the 90° result.
//
// Equal masses, elastic, one at rest, ANY off-centre hit: the two leave at
// exactly 90° to each other. p⃗ = p⃗₁ + p⃗₂ and p² = p₁² + p₂² (KE, equal masses)
// force p⃗₁·p⃗₂ = 0. This is the snooker fact, and it holds for every impact
// parameter except the degenerate head-on one where the target takes everything.
// ═════════════════════════════════════════════════════════════════════════════
{
  let worst = 0;
  for (let i = 1; i <= 19; i++) {
    const b = (i / 20) * 0.4;                       // r1 + r2 = 0.4
    const nDeg = collide.impactNormalDeg(b, 0.2, 0.2, 0);
    const out = collide.collide2D(1, { x: 6, y: 0 }, 1, { x: 0, y: 0 }, 1, nDeg);
    const ang = collide.separationAngleDeg(out.v1, out.v2);
    worst = Math.max(worst, Math.abs(ang - 90));
  }
  check('5 · collision 2-D', 'equal masses elastic separate at 90° (19 impact params)',
    worst, 0, 1e-9);

  // Head-on (b = 0) reduces to the 1-D exchange.
  const head = collide.collide2D(1, { x: 6, y: 0 }, 1, { x: 0, y: 0 }, 1,
    collide.impactNormalDeg(0, 0.2, 0.2, 0));
  check('5 · collision 2-D', 'head-on: shooter stops', Math.hypot(head.v1.x, head.v1.y), 0, 1e-12);
  check('5 · collision 2-D', 'head-on: target takes all of it', head.v2.x, 6, 1e-12);

  // Momentum and KE conserved componentwise for a glancing elastic hit.
  const nDeg = collide.impactNormalDeg(0.15, 0.2, 0.2, 0);
  const o = collide.collide2D(2, { x: 5, y: 1 }, 3, { x: -1, y: 0 }, 1, nDeg);
  check('5 · collision 2-D', 'px conserved', 2 * o.v1.x + 3 * o.v2.x, 2 * 5 + 3 * -1, 1e-12);
  check('5 · collision 2-D', 'py conserved', 2 * o.v1.y + 3 * o.v2.y, 2 * 1 + 3 * 0, 1e-12);
  check('5 · collision 2-D', 'KE conserved at e = 1',
    collide.ke2D(2, o.v1) + collide.ke2D(3, o.v2),
    collide.ke2D(2, { x: 5, y: 1 }) + collide.ke2D(3, { x: -1, y: 0 }), 1e-12);

  // With e < 1 momentum still holds and KE strictly drops.
  const half = collide.collide2D(2, { x: 5, y: 1 }, 3, { x: -1, y: 0 }, 0.5, nDeg);
  check('5 · collision 2-D', 'px conserved at e = 0.5', 2 * half.v1.x + 3 * half.v2.x, 7, 1e-12);
  assert('5 · collision 2-D', 'KE drops at e = 0.5',
    collide.ke2D(2, half.v1) + collide.ke2D(3, half.v2)
    < collide.ke2D(2, { x: 5, y: 1 }) + collide.ke2D(3, { x: -1, y: 0 }) - 1e-9);
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. SPRING BENCH — work is the AREA, and the naive answer is exactly double.
//
// k = 200 N/m, x = 0 → 0.1 m.
//   true  W = ½kx²      = ½·200·0.01 = 1.0 J
//   naive W = F(x)·x    = 20·0.1     = 2.0 J    ← exactly 2× for any linear spring
// Simpson's rule is exact for cubics, so it must reproduce the closed form for
// the stiffening law F = kx + βx³ too.
// ═════════════════════════════════════════════════════════════════════════════
{
  const hooke = { k: 200 };
  check('6 · spring', 'F(0.1) = kx', spring.forceAt(hooke, 0.1), 20, 1e-12);
  check('6 · spring', 'true work = ½kx²', spring.workExact(hooke, 0, 0.1), 1, 1e-12);
  check('6 · spring', 'naive F·x work', spring.naiveWork(hooke, 0, 0.1), 2, 1e-12);
  check('6 · spring', 'the naive answer is exactly 2×',
    spring.naiveWork(hooke, 0, 0.1) / spring.workExact(hooke, 0, 0.1), 2, 1e-12);
  check('6 · spring', 'Simpson reproduces ½kx²',
    spring.workBySimpson(hooke, 0, 0.1, 8), 1, 1e-12);

  // Stiffening band: F = 200x + 5000x³ over 0 → 0.2
  //   ½·200·0.04 + ¼·5000·0.0016 = 4 + 2 = 6 J
  const band = { k: 200, beta: 5000 };
  check('6 · spring', 'stiffening band exact work', spring.workExact(band, 0, 0.2), 6, 1e-12);
  check('6 · spring', 'Simpson matches it (exact for cubics)',
    spring.workBySimpson(band, 0, 0.2, 8), 6, 1e-12);
  // And ½kx² is now simply WRONG — by the βx⁴/4 term, 2 J of 6.
  check('6 · spring', 'the ½kx² shortcut misses 2 J here',
    6 - 0.5 * 200 * 0.04, 2, 1e-12);

  // Launching a block into a spring: ½mv² = ½kx² → x = v√(m/k)
  //   m = 0.5 kg, v = 3 m/s, k = 200  →  x = 3·√0.0025 = 0.15 m
  check('6 · spring', 'compression x = v√(m/k)', spring.compressionLinear(200, 0.5, 3), 0.15, 1e-12);
  check('6 · spring', 'and the numeric solver agrees',
    spring.compressionFor(hooke, 0.5, 3), 0.15, 1e-9);
  // Non-linear: the band stops it SOONER than Hooke would.
  assert('6 · spring', 'a stiffening band stops it sooner',
    spring.compressionFor(band, 0.5, 3) < 0.15 - 1e-6);
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. MOMENT-OF-INERTIA RACER — shape decides, mass and radius do not.
//
// a = g sin θ / (1 + k), k = I/mr².  θ = 30°, g sin 30° = 4.9 m/s².
//   sphere        k = 2/5  →  a = 4.9/1.4     = 3.5        m/s²
//   disc          k = 1/2  →  a = 4.9/1.5     = 3.266667   m/s²
//   hollow sphere k = 2/3  →  a = 4.9/(5/3)   = 2.94       m/s²
//   hoop          k = 1    →  a = 4.9/2       = 2.45       m/s²
// Order: sphere, disc, hollow sphere, hoop — and NOT changeable by mass or size.
// ═════════════════════════════════════════════════════════════════════════════
{
  check('7 · MoI racer', 'sphere a = g sinθ/(1+2/5)', inertia.rollingAccel('sphere', 30, G), 3.5, 1e-12);
  check('7 · MoI racer', 'disc a', inertia.rollingAccel('disc', 30, G), 4.9 / 1.5, 1e-12);
  check('7 · MoI racer', 'hollow sphere a', inertia.rollingAccel('hollow-sphere', 30, G), 2.94, 1e-12);
  check('7 · MoI racer', 'hoop a', inertia.rollingAccel('hoop', 30, G), 2.45, 1e-12);
  check('7 · MoI racer', 'a frictionless slider beats them all', inertia.slidingAccel(30, G), 4.9, 1e-12);

  // Load the dice: give the hoop 1/10 the mass and the sphere 5× the radius.
  const rows = inertia.race([
    { shape: 'hoop', mass: 0.2, radius: 0.05 },
    { shape: 'sphere', mass: 9, radius: 0.5 },
    { shape: 'disc', mass: 3, radius: 0.3 },
    { shape: 'hollow-sphere', mass: 0.7, radius: 0.42 },
  ], { distance: 2, thetaDeg: 30, g: G });
  const place = Object.fromEntries(rows.map((r) => [r.shape, r.place]));
  check('7 · MoI racer', 'sphere wins despite being the heaviest', place.sphere, 1);
  check('7 · MoI racer', 'disc second', place.disc, 2);
  check('7 · MoI racer', 'hollow sphere third', place['hollow-sphere'], 3);
  check('7 · MoI racer', 'hoop last despite being the lightest', place.hoop, 4);

  //   d = 2 m at a = 3.5  →  t = √(2·2/3.5) = 1.069045 s, v = 3.741657 m/s
  const sph = rows.find((r) => r.shape === 'sphere');
  check('7 · MoI racer', 'sphere time = sqrt(2d/a)', sph.time, Math.sqrt(4 / 3.5), 1e-12);
  check('7 · MoI racer', 'sphere finish speed = a·t', sph.finishSpeed, 3.5 * Math.sqrt(4 / 3.5), 1e-12);

  // SECOND, INDEPENDENT ROUTE: energy. mgh = ½mv²(1+k), h = d sin30° = 1 m.
  //   v = √(2·9.8·1/1.4) = √14 = 3.741657 m/s — the same number.
  check('7 · MoI racer', 'kinematic v matches the energy derivation',
    sph.finishSpeed, inertia.finishSpeedByEnergy('sphere', 1, G), 1e-12);
  for (const s of inertia.ROLL_SHAPES) {
    const a = inertia.rollingAccel(s, 30, G);
    check('7 · MoI racer', `${s}: kinematics = energy`,
      Math.sqrt(2 * a * 2), inertia.finishSpeedByEnergy(s, 1, G), 1e-12);
  }

  // The energy split — the hoop puts HALF its energy into spinning.
  check('7 · MoI racer', 'hoop rotational share = 1/2', inertia.rotationalShare('hoop'), 0.5, 1e-12);
  check('7 · MoI racer', 'sphere rotational share = 2/7', inertia.rotationalShare('sphere'), 2 / 7, 1e-12);
  check('7 · MoI racer', 'shares sum to 1',
    inertia.rotationalShare('disc') + inertia.translationalShare('disc'), 1, 1e-15);

  // μ_min = k tanθ/(1+k). Hoop at 30°: 1·0.5773503/2 = 0.288675
  check('7 · MoI racer', 'hoop needs mu ≥ k tanθ/(1+k)',
    inertia.minMuForRolling('hoop', 30), Math.tan(Math.PI / 6) / 2, 1e-12);
}

// ═════════════════════════════════════════════════════════════════════════════
// 8. ROLLING vs SLIDING — the contact point is standing still.
//
// v = 3 m/s, r = 0.4 m → rolling means ω = −v/r = −7.5 rad/s (clockwise).
//   contact point (φ = 270°): v = 0        EXACTLY
//   top          (φ =  90°): v = 2v = 6 m/s
//   centre                  : v = 3 m/s
//   front (φ = 0°) and back (φ = 180°): speed = √2·v = 4.242641 m/s at ±45°
// ═════════════════════════════════════════════════════════════════════════════
{
  const v = 3, r = 0.4;
  const w = rolling.rollingOmega(v, r);
  check('8 · rolling', 'rolling omega = −v/r', w, -7.5, 1e-15);
  check('8 · rolling', 'contact-point velocity is ZERO', rolling.slipVelocity(v, w, r), 0, 1e-12);
  assert('8 · rolling', 'isPureRolling agrees at 1e-12', rolling.isPureRolling(v, w, r, 1e-12));

  const bottom = rolling.rimVelocity(v, w, r, 270);
  check('8 · rolling', 'contact point |v| = 0', Math.hypot(bottom.x, bottom.y), 0, 1e-12);
  const top = rolling.rimVelocity(v, w, r, 90);
  check('8 · rolling', 'top of the wheel moves at 2v', top.x, 6, 1e-12);
  check('8 · rolling', 'and has no vertical velocity', top.y, 0, 1e-12);
  const front = rolling.rimVelocity(v, w, r, 0);
  check('8 · rolling', 'front of the wheel |v| = √2·v',
    Math.hypot(front.x, front.y), Math.SQRT2 * v, 1e-12);

  // Every rim point's speed equals 2v·|sin(φ/2 offset)| — check the whole rim is
  // between 0 and 2v, with the extremes only at the contact point and the top.
  let mx = 0, mn = Infinity;
  for (let i = 0; i < 360; i++) {
    const s = Math.hypot(...Object.values(rolling.rimVelocity(v, w, r, i)));
    mx = Math.max(mx, s); mn = Math.min(mn, s);
  }
  check('8 · rolling', 'no rim point exceeds 2v', mx, 6, 1e-9);
  check('8 · rolling', 'and none is negative', mn >= 0, true);

  // SLIPPING: a locked wheel (ω = 0) has its contact point moving at v.
  check('8 · rolling', 'locked wheel: contact point moves at v', rolling.slipVelocity(v, 0, r), 3, 1e-12);
  check('8 · rolling', 'locked wheel slip ratio = +1', rolling.slipRatio(v, 0, r), 1, 1e-12);
  // Wheelspin at twice the rolling rate: contact point goes BACKWARDS at v.
  check('8 · rolling', 'wheelspin slip ratio = −1', rolling.slipRatio(v, 2 * w, r), -1, 1e-12);

  // The cycloid cusp: after half a turn the marked point is at the top at 2v;
  // after a full turn (d = 2πr) it is back on the road at rest.
  check('8 · rolling', 'cycloid: speed at the cusp is 0',
    rolling.cycloidSpeed(v, r, 2 * Math.PI * r, 270), 0, 1e-9);
  check('8 · rolling', 'cycloid: speed at the peak is 2v',
    rolling.cycloidSpeed(v, r, Math.PI * r, 270), 6, 1e-9);
  const cusp = rolling.cycloidPoint(r, 2 * Math.PI * r, 270);
  check('8 · rolling', 'cycloid: the cusp touches the road (y = 0)', cusp.y, 0, 1e-12);

  // Rolling energy split matches the k-factor table.
  const e = rolling.rollingEnergy(2, 3, inertia.SHAPE_K.disc);
  check('8 · rolling', 'disc: rotational KE = ½ × translational', e.rotational, e.translational / 2, 1e-12);
  check('8 · rolling', 'disc: total = ¾mv²', e.total, 0.75 * 2 * 9, 1e-12);
}

// ═════════════════════════════════════════════════════════════════════════════
// 9. ANGULAR MOMENTUM CHAIR — halve I: ω doubles, KE DOUBLES.
//
// Core I = 2 kg m², two 3 kg weights. Start at r = 0.7 m:
//   I₀ = 2 + 2·3·0.49 = 4.94 kg m²
// To halve it we need I₁ = 2.47, i.e. 2·3·r² = 0.47 → r = 0.279881 m.
//   ω₁ = 2ω₀ ;  KE₁ = ½·(I₀/2)·(2ω₀)² = 2·½I₀ω₀²  → exactly 2×.
// The extra KE is work done by the person pulling in — nothing is created.
// ═════════════════════════════════════════════════════════════════════════════
{
  const state = { coreInertia: 2, weightMass: 3, armLength: 0.7, count: 2 };
  const I0 = angmom.chairInertia(state);
  check('9 · chair', 'I₀ = I_core + 2mr²', I0, 4.94, 1e-12);

  const rHalf = angmom.armLengthForInertia(state, I0 / 2);
  const t = angmom.pullIn(state, 4, rHalf);
  check('9 · chair', 'the arm length that halves I', t.I1, I0 / 2, 1e-9);
  check('9 · chair', 'L is conserved', t.L1, t.L0, 1e-9);
  check('9 · chair', 'omega DOUBLES', t.spinRatio, 2, 1e-9);
  check('9 · chair', 'omega1 = 8 rad/s', t.omega1, 8, 1e-9);
  check('9 · chair', 'KE DOUBLES', t.keRatio, 2, 1e-9);
  check('9 · chair', 'KE0 = ½I₀ω₀² = ½·4.94·16', t.ke0, 39.52, 1e-9);
  check('9 · chair', 'KE1 = 2·KE0', t.ke1, 79.04, 1e-9);
  check('9 · chair', 'the person did exactly the missing work', t.work, t.ke1 - t.ke0, 1e-12);
  check('9 · chair', 'and workToChangeInertia agrees',
    angmom.workToChangeInertia(I0, 4, I0 / 2), 39.52, 1e-9);

  // Letting the arms back OUT returns the energy: the work is negative.
  const back = angmom.pullIn({ ...state, armLength: rHalf }, t.omega1, 0.7);
  check('9 · chair', 'letting out returns to ω₀', back.omega1, 4, 1e-9);
  check('9 · chair', 'and gives the energy back', back.work, -(t.ke1 - t.ke0), 1e-9);
  check('9 · chair', 'L unchanged there too', back.L1, back.L0, 1e-9);

  // General: with L fixed, KE = L²/2I, so KE ratio ALWAYS equals the I ratio.
  let worst = 0;
  for (let i = 1; i <= 20; i++) {
    const r1 = 0.1 + (i / 20) * 0.9;
    const tr = angmom.pullIn(state, 3.3, r1);
    worst = Math.max(worst, Math.abs(tr.keRatio - tr.I0 / tr.I1));
  }
  check('9 · chair', 'KE ratio = I ratio for every arm length', worst, 0, 1e-9);
}

// ═════════════════════════════════════════════════════════════════════════════
// 10. TORQUE BENCH — force × PERPENDICULAR distance.
//
// Pivot at x = 1.0 on a 2 m beam. 3 kg hung at x = 0.6 (0.4 m to the LEFT) and
// 2 kg at x = 1.6 (0.6 m to the RIGHT):
//   τ_left  = (−0.4)·(3g)·sin270° = +0.4·3g = +11.76 N m  (CCW)
//   τ_right = (+0.6)·(2g)·sin270° = −0.6·2g = −11.76 N m  (CW)
//   Σ = 0 → balanced, even though the masses are different.
// A pull at 30° to the beam gives τ = F·r·sin30° = HALF what "F × r" predicts.
// ═════════════════════════════════════════════════════════════════════════════
{
  const loads = [
    { id: 'a', x: 0.6, mass: 3 },
    { id: 'b', x: 1.6, mass: 2 },
  ];
  const terms = torque.torqueTerms(loads, 1.0, G);
  check('10 · torque', 'left mass gives +0.4·3g', terms[0].torque, 0.4 * 3 * G, 1e-12);
  check('10 · torque', 'right mass gives −0.6·2g', terms[1].torque, -0.6 * 2 * G, 1e-12);
  check('10 · torque', 'net torque is zero', torque.netTorque(loads, 1.0, G), 0, 1e-12);
  assert('10 · torque', 'isBalanced agrees', torque.isBalanced(loads, 1.0, G) === true);
  check('10 · torque', 'the balance pivot is where we put it',
    torque.balancePivotX(loads, G), 1.0, 1e-12);

  // Move the pivot 10 cm and it is no longer balanced — by exactly Σ F · 0.1.
  //   ΣF (downward) = 5g = 49 N → the imbalance is 4.9 N m
  check('10 · torque', 'moving the pivot 0.1 m unbalances it by ΣF·0.1',
    Math.abs(torque.netTorque(loads, 1.1, G)), 5 * G * 0.1, 1e-12);

  // THE ANGLE. Same 20 N pull, 0.5 m out, at 90° then at 30°.
  const perp = torque.torqueOf({ id: 'p', x: 1.5, forceN: 20, angleDeg: 90 }, 1.0, G);
  const tilt = torque.torqueOf({ id: 't', x: 1.5, forceN: 20, angleDeg: 30 }, 1.0, G);
  check('10 · torque', 'perpendicular pull: τ = F·r', perp.torque, 10, 1e-12);
  check('10 · torque', 'pull at 30°: τ = F·r·sin30° — HALF', tilt.torque, 5, 1e-12);
  check('10 · torque', 'and the perpendicular distance halves too', tilt.perpDistance, 0.25, 1e-12);
  check('10 · torque', 'a pull ALONG the beam does nothing',
    torque.torqueOf({ id: 'z', x: 1.5, forceN: 20, angleDeg: 0 }, 1.0, G).torque, 0, 1e-12);

  // What mass balances a +10 N m (anticlockwise) pull?
  //
  // ⚠ SIGNS, and a hand-derivation this verifier caught being wrong. An UPWARD
  // 20 N pull on the RIGHT of the pivot turns the beam anticlockwise (+10 N m).
  // A hanging weight also turns it anticlockwise when it is on the LEFT — so
  // the balancing mass must go on the RIGHT, not the left. At x = 1.8 the lever
  // is +0.8 and the weight contributes lever·mg·sin270° = −0.8mg, so
  //   m = 10/(0.8·9.8) = 1.275510 kg.
  const one = [{ id: 'p', x: 1.5, forceN: 20, angleDeg: 90 }];
  check('10 · torque', 'balancing mass hangs 0.8 m out on the SAME side',
    torque.balancingMassAt(one, 1.0, 1.8, G), 10 / (0.8 * G), 1e-12);
  // On the far side it comes back NEGATIVE, which is the honest answer: no
  // hanging mass there can help, because it would have to push up.
  check('10 · torque', 'on the other side the answer is negative (must push up)',
    torque.balancingMassAt(one, 1.0, 0.2, G), -10 / (0.8 * G), 1e-12);
  assert('10 · torque', 'a mass ON the pivot cannot help',
    torque.balancingMassAt(one, 1.0, 1.0, G) === null);
}

// ═════════════════════════════════════════════════════════════════════════════
// 11. ORBIT SANDBOX — circular at √(GM/r), escape at √2 times that.
//
// Earth: GM = 3.986e14 m³/s², R = 6.371e6 m. At r = 7.0e6 m:
//   v_c = √(3.986e14/7.0e6) = √(5.694286e7) = 7546.05 m/s
//   v_e = √2 · v_c          = 10671.9  m/s
//   T   = 2π√(r³/GM) = 2π√(3.43e20/3.986e14) = 5828.5 s ≈ 97 min. Correct for LEO.
// The trajectory is integrated by motion-lab's RK4 — the SAME integrator the
// Projectile Playground uses — which is design law #4 enacted, not claimed.
// ═════════════════════════════════════════════════════════════════════════════
{
  const GM = orbit.EARTH.GM;
  const R = orbit.EARTH.radius;
  const r = 7.0e6;
  const vc = orbit.circularSpeed(GM, r);
  const ve = orbit.escapeSpeed(GM, r);

  check('11 · orbit', 'circular speed = sqrt(GM/r)', vc, Math.sqrt(GM / r), 1e-9);
  check('11 · orbit', 'escape speed = sqrt2 × circular', ve / vc, Math.SQRT2, 1e-12);
  check('11 · orbit', 'circular speed at 7000 km ≈ 7546 m/s', vc, 7546.05, 0.5);

  const circle = orbit.classifyOrbit(GM, R, r, vc);
  check('11 · orbit', 'exactly v_c is a circle', circle.kind, 'circle');
  check('11 · orbit', 'eccentricity 0', circle.eccentricity, 0, 1e-9);
  check('11 · orbit', 'semi-major axis = r', circle.semiMajor, r, 1);
  check('11 · orbit', 'period = 2π√(r³/GM)', circle.period,
    2 * Math.PI * Math.sqrt(r ** 3 / GM), 1e-6);

  check('11 · orbit', 'below v_c and it dips — ellipse or crash',
    ['ellipse', 'crash'].includes(orbit.classifyOrbit(GM, R, r, vc * 0.9).kind), true);
  check('11 · orbit', 'a slow shot crashes', orbit.classifyOrbit(GM, R, r, vc * 0.5).kind, 'crash');
  check('11 · orbit', 'between v_c and v_e it is an ellipse',
    orbit.classifyOrbit(GM, R, r, vc * 1.2).kind, 'ellipse');
  check('11 · orbit', 'at v_e it escapes', orbit.classifyOrbit(GM, R, r, ve).kind, 'escape');
  check('11 · orbit', 'above v_e it escapes', orbit.classifyOrbit(GM, R, r, ve * 1.3).kind, 'escape');
  check('11 · orbit', 'at v_e the eccentricity is exactly 1 (a parabola)',
    orbit.classifyOrbit(GM, R, r, ve).eccentricity, 1, 1e-9);

  // A horizontal launch ABOVE circular speed puts the launch point at PERIAPSIS.
  const fast = orbit.classifyOrbit(GM, R, r, vc * 1.2);
  check('11 · orbit', 'faster ⇒ launch point is the periapsis', fast.periapsis, r, 1);
  assert('11 · orbit', 'and the far side is higher', fast.apoapsis > r + 1);
  // Slower ⇒ launch point is the APOAPSIS. This is the "faster means lower
  // orbit" misconception, priced: firing faster raises the far side, not lowers it.
  const slow = orbit.classifyOrbit(GM, R, r, vc * 0.95);
  check('11 · orbit', 'slower ⇒ launch point is the apoapsis', slow.apoapsis, r, 1);
  assert('11 · orbit', 'and the far side is lower', slow.periapsis < r - 1);

  // THE INTEGRATION. A circular orbit must stay circular for a whole revolution.
  const path = orbit.orbitPath({ GM, R, r0: r, v0: vc });
  const range = orbit.radiusRange(path);
  const wobble = (range.max - range.min) / r;
  assert('11 · orbit', 'RK4 keeps the circle circular to 1 part in 1e6',
    wobble < 1e-6, `wobble = ${wobble.toExponential(2)}`);
  assert('11 · orbit', 'a full revolution was integrated',
    path.points.length > 1000, `${path.points.length} points`);

  // A slow shot really does hit the ground when integrated, not just on paper.
  const crash = orbit.orbitPath({ GM, R, r0: r, v0: vc * 0.5 });
  const crashR = Math.hypot(crash.stoppedAt.pos.x, crash.stoppedAt.pos.y);
  check('11 · orbit', 'the crash path stops at the surface', crashR, R, R * 1e-3);
}

// ═════════════════════════════════════════════════════════════════════════════
// 12. THE ARCHETYPE LIBRARY — every rung is authorable, guided and buildable.
//
// The Phase-1 QA report found four misconception codes that could never fire,
// three reveal layers gated above a step count that could never be reached, and
// a `plane` param with no UI. Those are all DATA defects, so they are checked
// here as data rather than trusted to review.
// ═════════════════════════════════════════════════════════════════════════════
{
  const all = [
    ...ENERGY_ARCHETYPE_ORDER.map((id) => ['energy', id, ENERGY_ARCHETYPES[id]]),
    ...ROTATION_ARCHETYPE_ORDER.map((id) => ['rotation', id, ROTATION_ARCHETYPES[id]]),
  ];

  assert('12 · archetypes', 'at least 12 archetypes exist', all.length >= 12, `${all.length}`);
  check('12 · archetypes', 'energy archetype count',
    ENERGY_ARCHETYPE_ORDER.length, Object.keys(ENERGY_ARCHETYPES).length);
  check('12 · archetypes', 'rotation archetype count',
    ROTATION_ARCHETYPE_ORDER.length, Object.keys(ROTATION_ARCHETYPES).length);

  const ids = new Set();
  for (const [family, id, a] of all) {
    assert('12 · archetypes', `${id}: id is unique across both families`, !ids.has(id));
    ids.add(id);
    assert('12 · archetypes', `${id}: id matches its key`, a.id === id, a.id);
    assert('12 · archetypes', `${id}: declares a misconception it attacks`,
      typeof a.targets === 'string' && a.targets.length > 0);
    assert('12 · archetypes', `${id}: has params metadata for the admin editor`,
      Array.isArray(a.params) && a.params.length > 0);
    assert('12 · archetypes', `${id}: has a guided script`,
      Array.isArray(a.defaultSteps) && a.defaultSteps.length >= 2);
    assert('12 · archetypes', `${id}: every step says something AND has a CTA`,
      a.defaultSteps.every((s) => s.say?.length > 10 && s.cta?.length > 0));
    assert('12 · archetypes', `${id}: mode is one the block type accepts`,
      ['fbd', 'pulley', 'solve'].includes(a.mode), a.mode);
    assert('12 · archetypes', `${id}: predict gate has ≥3 options`,
      !a.predict || a.predict.options.length >= 3);
    assert('12 · archetypes', `${id}: predict gate names its answer`,
      !a.predict || (a.predict.answer_index >= 0 && a.predict.answer_index < a.predict.options.length));
    assert('12 · archetypes', `${id}: every wrong option has its OWN feedback`,
      !a.predict || (a.predict.per_option?.length === a.predict.options.length
        && a.predict.per_option.every((s) => typeof s === 'string' && s.length > 20)));
    assert('12 · archetypes', `${id}: buildScene is pure and returns a bench spec`,
      typeof a.buildScene === 'function');
    assert('12 · archetypes', `${id}: the misconception it names has copy to render`,
      typeof MISCONCEPTION[a.targets]?.heading === 'string'
      && MISCONCEPTION[a.targets].body.length > 40, a.targets);
    assert('12 · archetypes', `${id}: family tag matches the file it came from`,
      a.family === family, a.family);

    // Build with defaults AND at both ends of every numeric param — an
    // archetype that throws or produces NaN at a slider extreme is a defect a
    // student finds before we do.
    const base = {};
    for (const p of a.params) base[p.key] = p.default;
    const variants = [{}, base];
    for (const p of a.params) {
      if (p.kind === 'number') {
        variants.push({ ...base, [p.key]: p.min });
        variants.push({ ...base, [p.key]: p.max });
      } else if (p.kind === 'select') {
        for (const opt of p.options ?? []) variants.push({ ...base, [p.key]: opt });
      } else if (p.kind === 'boolean') {
        variants.push({ ...base, [p.key]: true });
        variants.push({ ...base, [p.key]: false });
      }
    }
    let ok = true;
    let detail = '';
    for (const v of variants) {
      try {
        const scene = a.buildScene(v);
        const flat = JSON.stringify(scene);
        if (/null|NaN|Infinity/.test(flat)) { ok = false; detail = `non-finite in ${JSON.stringify(v)}`; break; }
      } catch (err) { ok = false; detail = `${err.message} at ${JSON.stringify(v)}`; break; }
    }
    assert('12 · archetypes', `${id}: builds cleanly at every param extreme`, ok, detail);
  }

  // ── No dead codes, in either direction ──────────────────────────────────
  // The Phase-1 audit found four misconception codes that could never fire and
  // one whose copy was displaced by a different code's heading. Both are data
  // defects, so both are checked as data.
  const declared = new Set(all.map(([, , a]) => a.targets));
  for (const code of Object.keys(MISCONCEPTION)) {
    assert('12 · archetypes', `code "${code}" is reachable from some archetype`,
      declared.has(code));
  }
  for (const code of declared) {
    assert('12 · archetypes', `code "${code}" has diagnostic copy`, !!MISCONCEPTION[code]);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 13. WIRING — is every declared thing actually reachable in the UI?
//
// The Phase-1 audit's single biggest finding was not wrong physics, it was DEAD
// WIRING: 22 `targets` codes in archetype data that no component read, three
// reveal layers gated above a step count that could never be reached, a `plane`
// param with no control, and a palette button whose only possible outcome was
// being marked wrong. None of those is visible to tsc or to eslint.
//
// Node cannot import a .tsx (it strips types but does not transform JSX), so
// these are SOURCE-TEXT checks. That is a real limitation and worth stating:
// they prove a case exists, not that it renders correctly. What they do catch is
// the exact defect class above — a declared thing with nothing on the other end.
// ═════════════════════════════════════════════════════════════════════════════
{
  const { readFileSync } = await import('node:fs');
  const read = (p) => readFileSync(fileURLToPath(new URL(p, BENCH)), 'utf8');

  const switchboard = read('energy/EnergyBench.tsx');
  const benches = new Set();
  for (const id of [...ENERGY_ARCHETYPE_ORDER, ...ROTATION_ARCHETYPE_ORDER]) {
    const a = ENERGY_ARCHETYPES[id] ?? ROTATION_ARCHETYPES[id];
    const defaults = Object.fromEntries(a.params.map((p) => [p.key, p.default]));
    benches.add(a.buildScene(defaults).bench);
  }
  for (const b of benches) {
    assert('13 · wiring', `bench "${b}" has a case in the switchboard`,
      switchboard.includes(`case '${b}':`));
  }

  const CANVASES = [
    'energy/EnergyLedger.tsx', 'energy/RollerCoaster.tsx', 'energy/CollisionStudio.tsx',
    'energy/SpringBench.tsx', 'energy/OrbitSandbox.tsx',
    'rotation/MoiRacer.tsx', 'rotation/TorqueBench.tsx', 'rotation/RollingBench.tsx',
    'rotation/ChairBench.tsx',
  ];
  // Comments are stripped before the source checks. Not fastidiousness: every
  // one of these files DOCUMENTS the zero-text rule in its own header, in the
  // words "ZERO <text> ELEMENTS", and a naive grep matched the documentation
  // rather than the code. A check that fires on its own rationale is worthless.
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  for (const f of CANVASES) {
    const src = strip(read(f));
    // §4E LABEL OVERLAP RULE, made structural: a label cannot collide with
    // another label if no label is ever placed on the canvas.
    assert('13 · wiring', `${f}: draws ZERO <text> on its canvas`,
      !/<text[\s>]/.test(src));
    // Design law #2: the archetype's declared misconception must be RENDERED.
    assert('13 · wiring', `${f}: renders the archetype's targets`,
      src.includes('<MisconceptionCard code={arch.targets}'));
    // Design law #5: nothing may auto-play. Every animation loop is gated.
    assert('13 · wiring', `${f}: no animation loop starts unbidden`,
      !/useAnimationFrame\((?![\s\S]{0,900}?enabled:)/.test(src)
      && !/useState\(true\)[^\n]*\/\/ *playing/.test(src));
    // The predict gate must be reachable and its answer must not leak early.
    assert('13 · wiring', `${f}: has a predict gate`, src.includes('<PredictGate'));
    // Sliders and buttons must clear the 44px phone floor — the shared
    // components own that, so what is checked is that they ARE the shared ones.
    assert('13 · wiring', `${f}: uses the shared 44px-floor controls`,
      src.includes('SimSlider') || src.includes('ActionButton'));
    // Mobile: a MEASURED container width, never a viewport media query.
    assert('13 · wiring', `${f}: stacks on a measured width, not a CSS breakpoint`,
      src.includes('useStageBox') && !/\blg:grid-cols/.test(src));
  }

  // Every guided step must be REACHABLE: a reveal gated above the step count is
  // a layer no student can ever see, which Phase 1 shipped three of.
  for (const id of [...ENERGY_ARCHETYPE_ORDER, ...ROTATION_ARCHETYPE_ORDER]) {
    const a = ENERGY_ARCHETYPES[id] ?? ROTATION_ARCHETYPES[id];
    // The benches gate their reveals at step >= 2 (predict at 1, action at 2).
    assert('13 · wiring', `${id}: its action gate (step 2) is inside the ladder`,
      a.defaultSteps.length > 2, `${a.defaultSteps.length} steps`);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 14. THE CAMERA TRAP THAT WOULD HAVE SHIPPED THE ORBIT SANDBOX AS ONE DOT.
//
// `lib/svg.fitView` quantises the scale onto a 1% ladder — Math.round(s*100)/100
// — so a slider nudge rescales in visible steps instead of shimmering. Correct
// at bench scale (60–90 px/m). Catastrophic at planetary scale: fitting a
// 16 000 km box into a 460 px board needs 0.0000229 px/m, and rounding THAT to
// two decimals gives exactly ZERO. Every point maps to the board's centre.
//
// `fbd/canvas.useFittedView` bakes quantisation in, so `energy/kit/stage`
// carries `useFreeView` for planetary scenes. Both halves are asserted here: the
// trap is real, and the replacement avoids it.
// ═════════════════════════════════════════════════════════════════════════════
{
  const { fitView } = await import(new URL('lib/svg.ts', BENCH).href);
  const far = 8.05e6;                       // ~ Earth radius + a 1 500 km orbit
  const b = { minX: -far, minY: -far, maxX: far, maxY: far };
  const q = fitView(b, 460, 460, { maxScale: 1e-3, minScale: 1e-9 });
  const u = fitView(b, 460, 460, { maxScale: 1e-3, minScale: 1e-9, quantise: false });
  check('14 · camera', 'the quantised fit really does collapse to zero', q.scale, 0, 0);
  assert('14 · camera', 'the unquantised fit is positive', u.scale > 0, String(u.scale));
  // 460 px across a 16.1 Mm box, less fitView's DEFAULT 2×10% padding:
  //   460 × 0.8 / 16.1e6 = 2.2857e-5 px/m.
  check('14 · camera', 'and it frames the box', u.scale, (460 * 0.8) / (2 * far), 1e-12);
  const { readFileSync: rf } = await import('node:fs');
  const orbitSrc = rf(fileURLToPath(new URL('energy/OrbitSandbox.tsx', BENCH)), 'utf8');
  assert('14 · camera', 'OrbitSandbox uses the unquantised camera',
    /const view = useFreeView\(/.test(orbitSrc));
}

// ── Report ───────────────────────────────────────────────────────────────────

const W1 = Math.max(...results.map((r) => r.group.length), 5);
const W2 = Math.max(...results.map((r) => r.name.length), 5);
const W3 = Math.max(...results.map((r) => r.actual.length), 6);

let lastGroup = '';
console.log('');
console.log(`${'GROUP'.padEnd(W1)}  ${'CHECK'.padEnd(W2)}  ${'GOT'.padEnd(W3)}  EXPECTED`);
console.log('─'.repeat(W1 + W2 + W3 + 26));
for (const r of results) {
  const group = r.group === lastGroup ? '' : r.group;
  lastGroup = r.group;
  console.log(
    `${group.padEnd(W1)}  ${r.name.padEnd(W2)}  ${r.actual.padEnd(W3)}  ${String(r.expected).padEnd(12)}  ${r.ok ? 'PASS' : 'FAIL'}`,
  );
}
console.log('─'.repeat(W1 + W2 + W3 + 26));
console.log(`${results.length - failures}/${results.length} passed${failures ? `, ${failures} FAILED` : ''}`);
console.log('');

process.exit(failures ? 1 : 0);
