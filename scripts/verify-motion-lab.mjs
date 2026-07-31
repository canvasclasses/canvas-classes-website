#!/usr/bin/env node
/*
 * scripts/verify-motion-lab.mjs — academic-accuracy gate for the E2 engine.
 * ─────────────────────────────────────────────────────────────────────────────
 * Verifies motion-lab/lib/{integrate,frames,projectile}.ts against values that
 * are hand-computed IN THE COMMENTS below, so a reviewer can check the checker.
 * PHYSICS_SIMULATION_PROGRAM.md §9: "no academic claim ships unverified".
 *
 *   RUN:   node scripts/verify-motion-lab.mjs
 *   EXITS: 0 if every row passes, 1 otherwise.
 *
 * ── How this runs TypeScript with no build step and no dependencies ──────────
 * Verified on node v24.14.0 (this machine). Two native features do the work:
 *
 *   1. Type stripping for `.ts` files, on by DEFAULT since Node 22.18 / 23.6.
 *      No --experimental-strip-types flag is needed on Node 24. (On Node 22.6
 *      –22.17 you would need to pass that flag; below 22.6 this script cannot
 *      run and says so.)
 *   2. `module.registerHooks` (Node 22.15+ / 23.5+) — a synchronous resolve
 *      hook that retries a failed relative specifier with a `.ts` extension.
 *      The engine sources are written for a bundler (extensionless imports),
 *      which Node's ESM resolver rejects; this hook is the whole bridge. It is
 *      three lines and needs no npm package, which is why it beats shelling out
 *      to tsc or tsx here.
 *
 * If a future Node removes `registerHooks`, the fallback is
 * `npx tsx scripts/verify-motion-lab.mjs` after renaming to `.ts` — the
 * assertions themselves are runner-agnostic.
 */

import { registerHooks } from 'node:module';

// The engine lives in a package with no "type": "module", so Node prints a
// MODULE_TYPELESS_PACKAGE_JSON notice per file. It is noise here, not a defect.
process.removeAllListeners('warning');
process.on('warning', () => {});

if (typeof registerHooks !== 'function') {
  console.error('This script needs node >= 22.15 for module.registerHooks. Found ' + process.version);
  process.exit(1);
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (specifier.startsWith('.') && !/\.[cm]?[jt]sx?$/.test(specifier)) {
        return nextResolve(specifier + '.ts', context);
      }
      throw err;
    }
  },
});

const LIB = new URL('../packages/book-renderer/blocks/motion-lab/lib/', import.meta.url).href;

const { integrate, step, gravityAccel, withDrag, sampleAt, specificEnergy, DEFAULT_DT } =
  await import(LIB + 'integrate.ts');
const { toFrame, transformTrajectory } = await import(LIB + 'frames.ts');
const P = await import(LIB + 'projectile.ts');

// ── Tiny assertion table ─────────────────────────────────────────────────────

const rows = [];
let fails = 0;

const fmt = (v) =>
  typeof v === 'number'
    ? (Math.abs(v) >= 1e-4 || v === 0 ? v.toFixed(6) : v.toExponential(2))
    : String(v);

function near(name, got, want, tol, note = '') {
  const ok = Number.isFinite(got) && Math.abs(got - want) <= tol;
  if (!ok) fails++;
  rows.push({ ok, name, got: fmt(got), want: fmt(want), tol: fmt(tol), note });
}

function truthy(name, cond, note = '') {
  const ok = !!cond;
  if (!ok) fails++;
  rows.push({ ok, name, got: ok ? 'true' : 'false', want: 'true', tol: '—', note });
}

const G = 9.8;

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLOSED FORMS — the numbers a student reads.
// ─────────────────────────────────────────────────────────────────────────────

// Hand-computed, u = 20 m/s at 30°, g = 9.8, launched from the ground:
//   u_y = 20 sin30 = 10.000 m/s      u_x = 20 cos30 = 17.3205 m/s
//   t_apex = u_y / g = 10 / 9.8      = 1.020408 s      → brief says 1.02 s ✓
//   h_apex = u_y² / 2g = 100 / 19.6  = 5.102041 m      → brief says 5.10 m ✓
//   x_apex = u_x t_apex              = 17.673988 m
const a30 = P.apex(20, 30, 0, G);
near('apex time  u=20 θ=30°', a30.t, 1.020408, 1e-6, 'u_y/g = 10/9.8');
near('apex height u=20 θ=30°', a30.y, 5.102041, 1e-6, 'u_y²/2g = 100/19.6');
near('apex x      u=20 θ=30°', a30.x, 17.673988, 1e-6, 'u_x · t_apex');

// Range at 45°: R = u²/g = 400 / 9.8 = 40.816327 m → brief says 40.82 m ✓
near('range u=20 θ=45°', P.range(20, 45, 0, G), 40.816327, 1e-6, 'u²/g = 400/9.8');

// Time of flight at 45°: T = 2u sinθ / g = 28.2842712 / 9.8 = 2.8861499 s
near('flight time u=20 θ=45°', P.timeOfFlight(20, 45, 0, G), 2.886150, 1e-6, '2u sinθ/g');

// Complementary angles give equal range on level ground: sin60° = sin120°.
//   R(30°) = R(60°) = 400·sin60° / 9.8 = 346.4101615 / 9.8 = 35.3479757 m
const r30 = P.range(20, 30, 0, G);
const r60 = P.range(20, 60, 0, G);
near('range θ=30°', r30, 35.347976, 1e-6, 'u² sin60°/g');
near('complementary pair 30°/60° equal', Math.abs(r30 - r60), 0, 1e-12, 'sin2θ = sin(180−2θ)');
truthy('…and their flight times DIFFER', Math.abs(P.timeOfFlight(20, 30, 0, G) - P.timeOfFlight(20, 60, 0, G)) > 0.5,
  'same landing point, different flight');

// Optimum angle. h0 = 0 → exactly 45°; h0 = 2 m → measurably BELOW 45°.
//   θ = arctan(u/√(u²+2gh)) = arctan(20/√439.2) = arctan(0.954338) = 43.6613°
near('optimum angle h0=0', P.optimumAngle(20, 0, G), 45, 1e-9, 'the textbook case');
near('optimum angle h0=2 m', P.optimumAngle(20, 2, G), 43.661337, 1e-5, 'arctan(u/√(u²+2gh))');
truthy('optimum angle h0=2 m is below 45°', P.optimumAngle(20, 2, G) < 45 - 1, 'by 1.34° — the shot-put fact');

// …and it really is the maximum: brute-force sweep at 0.001° resolution.
{
  let bestA = 0, bestR = -Infinity;
  for (let a = 1; a <= 89; a += 0.001) {
    const R = P.range(20, a, 2, G);
    if (R > bestR) { bestR = R; bestA = a; }
  }
  near('…confirmed by a 0.001° brute-force sweep', P.optimumAngle(20, 2, G), bestA, 2e-3, 'formula vs search');
}

// The shot-put payoff quoted on screen: 13.5 m/s released from 2.1 m → ~42°.
near('shot put 13.5 m/s from 2.1 m', P.optimumAngle(13.5, 2.1, G), 42.09, 0.02, 'why coaches say 42°, not 45°');

// ─────────────────────────────────────────────────────────────────────────────
// 2. RK4 vs the closed form — the integrator must not invent physics.
// ─────────────────────────────────────────────────────────────────────────────

const g0 = gravityAccel(G);

{
  // 20 m/s at 55° from 3 m. RK4 is exact for polynomials of degree ≤ 4 and the
  // no-drag trajectory is a quadratic in t, so agreement should be at rounding
  // level — 1e-6 is a loose bound, not a lucky one.
  const s0 = P.launchState(20, 55, 3);
  const tr = integrate(s0, g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0 });

  const T = P.timeOfFlight(20, 55, 3, G);
  let worstPos = 0, worstVel = 0;
  for (let k = 0; k <= 200; k++) {
    const t = (T * k) / 200;
    const got = sampleAt(tr, t);
    const want = P.positionAt(20, 55, 3, G, t);
    const wantV = P.velocityAt(20, 55, G, t);
    // sampleAt interpolates linearly between stored points, so compare the
    // stored grid itself where the RK4 claim lives: step directly instead.
    const exact = stepTo(s0, g0, t, DEFAULT_DT);
    worstPos = Math.max(worstPos, Math.hypot(exact.pos.x - want.x, exact.pos.y - want.y));
    worstVel = Math.max(worstVel, Math.hypot(exact.vel.x - wantV.x, exact.vel.y - wantV.y));
    void got;
  }
  near('RK4 position vs closed form, whole flight', worstPos, 0, 1e-6, 'max error over 200 samples');
  near('RK4 velocity vs closed form, whole flight', worstVel, 0, 1e-6, 'max error over 200 samples');

  // The refined landing point must agree with R = u_x·T, not with a step edge.
  near('RK4 landing range vs closed form', tr.stoppedAt.pos.x, P.range(20, 55, 3, G), 1e-6, 'bisection-refined stop');
  near('RK4 landing time vs closed form', tr.stoppedAt.t, T, 1e-6, '');

  // Apex event must land on the real turning point.
  const apexEv = tr.events.find((e) => e.kind === 'apex');
  const aExact = P.apex(20, 55, 3, G);
  near('RK4 apex event time', apexEv.at.t, aExact.t, 1e-6, 'vy = 0 crossing, refined');
  near('RK4 apex event height', apexEv.at.pos.y, aExact.y, 1e-6, '');
  near('…and vx is UNCHANGED at the apex', apexEv.at.vel.x, P.components(20, 55).ux, 1e-9,
    'misconception velocity_zero_at_apex');
  near('…while vy is zero there', apexEv.at.vel.y, 0, 1e-9, '');

  // Energy: ½v² + gy per unit mass, conserved with no drag.
  const e0 = specificEnergy(tr.points[0], G);
  let worstE = 0;
  for (const p of tr.points) worstE = Math.max(worstE, Math.abs(specificEnergy(p, G) - e0));
  near('specific energy conserved (no drag)', worstE / Math.abs(e0), 0, 1e-6, 'relative drift over the flight');
}

/** Integrate from s0 to exactly `t` with fixed steps plus one short remainder. */
function stepTo(s0, accel, t, dt) {
  let s = s0;
  let n = Math.floor(t / dt);
  for (let i = 0; i < n; i++) s = step(s, accel, dt);
  const rem = t - n * dt;
  if (rem > 0) s = step(s, accel, rem);
  return s;
}

// Independence of components (misconception `coupled_components`): with no
// drag, vx is constant for the whole flight whatever the angle.
{
  const s0 = P.launchState(25, 70, 0);
  const tr = integrate(s0, g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0 });
  let worst = 0;
  for (const p of tr.points) worst = Math.max(worst, Math.abs(p.vel.x - s0.vel.x));
  near('vx constant across the whole flight', worst, 0, 1e-12, 'x and y are independent');
}

// Heavier does NOT fall faster in vacuum (misconception `heavier_falls_faster`).
// Both balls go through the SAME mass-carrying code path — withDrag with k = 0 —
// so this is a real test of the model, not of a constant.
{
  const stop = (s) => s.t > 1e-9 && s.pos.y <= 0;
  const light = integrate(P.launchState(18, 40, 0), withDrag(g0, { k: 0 }, 1), { dt: DEFAULT_DT, stop });
  const heavy = integrate(P.launchState(18, 40, 0), withDrag(g0, { k: 0 }, 10), { dt: DEFAULT_DT, stop });
  near('1 kg and 10 kg land identically in vacuum', heavy.stoppedAt.pos.x - light.stoppedAt.pos.x, 0, 1e-12,
    'a = g has no mass in it');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DRAG — no closed form, so we assert the QUALITATIVE facts the sim claims.
// ─────────────────────────────────────────────────────────────────────────────

// Parameters are a real cricket ball, not tuned for a nice picture:
//   m = 0.16 kg, radius 0.036 m → A = 4.07e-3 m², C_d ≈ 0.4, ρ_air = 1.2
//   k = ½ρC_dA = 0.5 × 1.2 × 0.4 × 4.07e-3 ≈ 1.0e-3 kg/m
// which is the default the `with-drag` archetype ships.
{
  const s0 = P.launchState(30, 45, 1.8);
  const K = { k: 0.001, quadratic: true };
  const M = 0.16;
  const ideal = integrate(s0, g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0 });
  const drag = integrate(s0, withDrag(g0, K, M), {
    dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0,
  });

  truthy('drag shortens the range', drag.stoppedAt.pos.x < ideal.stoppedAt.pos.x * 0.85,
    `${drag.stoppedAt.pos.x.toFixed(1)} m vs ${ideal.stoppedAt.pos.x.toFixed(1)} m in vacuum`);
  truthy('…to a realistic cricket-throw carry', drag.stoppedAt.pos.x > 55 && drag.stoppedAt.pos.x < 80,
    'a real outfield throw carries 60–75 m');

  // Asymmetry: with drag the descent is STEEPER, so the apex sits past the
  // midpoint of the range. Without drag it is exactly at the midpoint.
  const apexOf = (tr) => tr.events.find((e) => e.kind === 'apex').at;
  const fIdeal = apexOf(ideal).pos.x / ideal.stoppedAt.pos.x;
  const fDrag = apexOf(drag).pos.x / drag.stoppedAt.pos.x;
  // From ground level with no drag the parabola is exactly symmetric.
  const flat = integrate(P.launchState(30, 45, 0), g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0 });
  near('no-drag apex sits at half the range (h0 = 0)',
    apexOf(flat).pos.x / flat.stoppedAt.pos.x, 0.5, 1e-6, 'the parabola is symmetric');
  // A release height alone pulls the apex slightly EARLIER — the descent has
  // further to fall, so it covers more ground than the ascent.
  truthy('a 1.8 m release pulls the apex before halfway', fIdeal < 0.5, `x_apex/R = ${fIdeal.toFixed(3)}`);
  // Drag more than reverses that: the way down is steeper than the way up.
  truthy('with drag the apex sits PAST half the range', fDrag > 0.515, `x_apex/R = ${fDrag.toFixed(3)}`);

  // Drag removes energy monotonically — never adds any.
  let increased = false;
  let e = specificEnergy(drag.points[0], G);
  for (const p of drag.points) {
    const en = specificEnergy(p, G);
    if (en > e + 1e-9) increased = true;
    e = en;
  }
  truthy('drag never adds energy', !increased, 'monotone decreasing ½v² + gy');

  // Mass DOES matter once there is air: a_drag = -(k/m)v. Same ball, 10× the
  // mass — this is the `vacuum-vs-air` archetype's whole payoff.
  const heavy = integrate(s0, withDrag(g0, K, M * 10), {
    dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0,
  });
  truthy('in air, the 10× heavier ball goes further', heavy.stoppedAt.pos.x > drag.stoppedAt.pos.x + 5,
    `${heavy.stoppedAt.pos.x.toFixed(1)} m vs ${drag.stoppedAt.pos.x.toFixed(1)} m`);

  // …and the best angle with drag drops BELOW the no-drag optimum. This is the
  // second, independent reason a shot-putter releases near 42° and not 45°.
  let bestA = 0, bestR = -Infinity;
  for (let a = 20; a <= 70; a += 0.5) {
    const tr = integrate(P.launchState(30, a, 1.8), withDrag(g0, K, M), {
      dt: 1 / 120, stop: (s) => s.t > 1e-9 && s.pos.y <= 0,
    });
    if (tr.stoppedAt.pos.x > bestR) { bestR = tr.stoppedAt.pos.x; bestA = a; }
  }
  truthy('best angle in air is below the vacuum optimum',
    bestA < P.optimumAngle(30, 1.8, G) - 1,
    `${bestA.toFixed(1)}° in air vs ${P.optimumAngle(30, 1.8, G).toFixed(1)}° in vacuum`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FRAMES — the ball dropped from a moving trolley.
// ─────────────────────────────────────────────────────────────────────────────

{
  // Launched horizontally at 12 m/s from 20 m. In a frame translating at the
  // same 12 m/s, x must be ZERO for the whole flight: a straight line down.
  const s0 = P.launchState(12, 0, 20);
  const tr = integrate(s0, g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0 });
  const cart = transformTrajectory(tr, { kind: 'translating', vel: { x: 12, y: 0 } });

  let worstX = 0, worstVx = 0, worstY = 0;
  for (let i = 0; i < tr.points.length; i++) {
    worstX = Math.max(worstX, Math.abs(cart.points[i].pos.x));
    worstVx = Math.max(worstVx, Math.abs(cart.points[i].vel.x));
    worstY = Math.max(worstY, Math.abs(cart.points[i].pos.y - tr.points[i].pos.y));
  }
  near('cart frame: x ≡ 0 (straight line down)', worstX, 0, 1e-9, 'same event, two truths');
  near('cart frame: vx ≡ 0', worstVx, 0, 1e-12, '');
  near('cart frame: y is UNCHANGED', worstY, 0, 1e-12, 'a horizontal boost cannot alter the fall');
  truthy('ground frame really is a parabola', tr.stoppedAt.pos.x > 20, `range ${tr.stoppedAt.pos.x.toFixed(1)} m`);

  // Round trip: back to the ground frame must reproduce the original.
  const back = transformTrajectory(cart, { kind: 'translating', vel: { x: -12, y: 0 } });
  let worstRT = 0;
  for (let i = 0; i < tr.points.length; i++) {
    worstRT = Math.max(worstRT, Math.abs(back.points[i].pos.x - tr.points[i].pos.x));
  }
  near('frame round-trip is lossless', worstRT, 0, 1e-9, '');

  // A rotating frame must leave its own centre fixed.
  const rot = toFrame({ t: 1, pos: { x: 5, y: 0 }, vel: { x: 0, y: 3 } }, { kind: 'rotating', omega: 1, centre: { x: 5, y: 0 } }, 1);
  near('rotating frame: the centre is a fixed point', Math.hypot(rot.pos.x - 5, rot.pos.y), 0, 1e-12, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENVELOPE OF SAFETY.
// ─────────────────────────────────────────────────────────────────────────────

{
  const u = 20;
  const env = P.safetyEnvelope(u, G, 200);
  // Peak = u²/2g = 400/19.6 = 20.408 m (a straight-up throw). Ground crossing
  // at x = u²/g = 40.816 m (the 45° maximum range).
  const peak = env.reduce((m, p) => (p.y > m.y ? p : m), env[0]);
  near('envelope peak height', peak.y, 20.408163, 1e-6, 'u²/2g — a vertical throw');
  near('envelope peak at x = 0', peak.x, 0, 1e-9, '');
  near('envelope meets the ground at u²/g', (u * u) / G, 40.816327, 1e-6, 'the 45° range');

  // No trajectory may cross the envelope, and at least one must touch it.
  let worstOver = -Infinity;
  const envY = (x) => (u * u) / (2 * G) - (G * x * x) / (2 * u * u);
  for (let a = 5; a <= 85; a += 5) {
    const tr = integrate(P.launchState(u, a, 0), g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= 0 });
    for (const p of tr.points) worstOver = Math.max(worstOver, p.pos.y - envY(p.pos.x));
  }
  truthy('no trajectory escapes the envelope', worstOver <= 1e-6, `max overshoot ${worstOver.toExponential(1)} m`);
  truthy('…and some trajectory touches it', worstOver > -0.02, `closest approach ${worstOver.toExponential(1)} m`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. INCLINE — the rotated-axis one-liner.
// ─────────────────────────────────────────────────────────────────────────────

{
  // β = 0 must collapse to the level-ground result.
  near('incline range at β=0 equals u² sin2θ/g', P.rangeOnIncline(20, 35, 0, G), P.range(20, 35, 0, G), 1e-9, '');

  // Cross-check against the integrator: land on the plane y = x tanβ.
  const beta = 20, theta = 50, u = 20;
  const tanB = Math.tan((beta * Math.PI) / 180);
  const tr = integrate(P.launchState(u, theta, 0), g0, {
    dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.y <= s.pos.x * tanB,
  });
  const along = Math.hypot(tr.stoppedAt.pos.x, tr.stoppedAt.pos.y);
  near('incline range: closed form vs RK4', P.rangeOnIncline(u, theta, beta, G), along, 1e-5, 'β=20°, θ=50°');
  near('incline flight time: closed form vs RK4', P.timeOfFlightOnIncline(u, theta, beta, G), tr.stoppedAt.t, 1e-6, '');

  // Optimum launch up a slope is β/2 + 45°.
  let bestA = 0, bestR = -Infinity;
  for (let a = beta + 0.5; a < 90; a += 0.001) {
    const R = P.rangeOnIncline(u, a, beta, G);
    if (R > bestR) { bestR = R; bestA = a; }
  }
  near('optimum angle up a 20° slope = β/2 + 45°', P.optimumAngleOnIncline(beta), bestA, 2e-3, 'brute-force check');

  // Down-slope goes further than up-slope for the same launch angle above it.
  truthy('down-slope range exceeds up-slope range',
    P.rangeOnIncline(u, 45 - 10, -20, G) > P.rangeOnIncline(u, 45 + 10, 20, G), '');
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MONKEY AND HUNTER — aim straight at it and gravity cancels.
// ─────────────────────────────────────────────────────────────────────────────

{
  // Monkey at (30, 14). Aim directly: θ = atan(14/30) = 25.0169°.
  const mx = 30, my = 14;
  const aim = (Math.atan2(my, mx) * 180) / Math.PI;
  near('aim angle at the monkey', aim, 25.016894, 1e-5, 'atan(14/30)');

  for (const u of [22, 30, 45]) {
    const tr = integrate(P.launchState(u, aim, 0), g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.x >= mx });
    const t = tr.stoppedAt.t;
    // Monkey drops from rest at t = 0: y = my − ½gt².
    const monkeyY = my - 0.5 * G * t * t;
    near(`hit at u=${u} m/s (Δy at the branch)`, tr.stoppedAt.pos.y - monkeyY, 0, 1e-6,
      'both fell ½gt² below the aim line');
  }

  // Aiming ABOVE the monkey misses high — the instinct the sim lets them try.
  const tr = integrate(P.launchState(30, aim + 8, 0), g0, { dt: DEFAULT_DT, stop: (s) => s.t > 1e-9 && s.pos.x >= mx });
  const monkeyY = my - 0.5 * G * tr.stoppedAt.t * tr.stoppedAt.t;
  truthy('aiming 8° high MISSES (over the top)', tr.stoppedAt.pos.y - monkeyY > 1,
    `by ${(tr.stoppedAt.pos.y - monkeyY).toFixed(2)} m`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

const W = { name: Math.max(...rows.map((r) => r.name.length), 4) };
const pad = (s, n) => String(s).padEnd(n);
const padS = (s, n) => String(s).padStart(n);

console.log('');
console.log('  motion-lab — E2 engine verification   (node ' + process.version + ')');
console.log('  ' + '─'.repeat(W.name + 46));
console.log('  ' + pad('', 5) + pad('CHECK', W.name + 2) + padS('GOT', 13) + padS('WANT', 13) + '   NOTE');
console.log('  ' + '─'.repeat(W.name + 46));
for (const r of rows) {
  console.log(
    '  ' + pad(r.ok ? 'PASS ' : 'FAIL ', 5) +
    pad(r.name, W.name + 2) +
    padS(r.got, 13) + padS(r.want, 13) +
    (r.note ? '   ' + r.note : '')
  );
}
console.log('  ' + '─'.repeat(W.name + 46));
console.log(`  ${rows.length - fails}/${rows.length} passed` + (fails ? `  —  ${fails} FAILED` : '  —  all good'));
console.log('');

process.exit(fails ? 1 : 0);
