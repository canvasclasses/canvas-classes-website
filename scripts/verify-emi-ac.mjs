/*
 * verify-emi-ac.mjs — physics verification for Unit 11 (Magnetism, EMI and AC).
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-emi-ac.mjs
 *
 * Requires Node >= 22.6. It imports the TypeScript sources DIRECTLY — Node
 * strips the types natively, and the `registerHooks` shim below resolves the
 * repo's extensionless relative imports (`from './loop'`) to their `.ts` files,
 * which native resolution does not do. No build step, no test framework, no
 * dependencies.
 *
 * WHY THIS EXISTS. PHYSICS_SIMULATION_PROGRAM.md §9: "Physics must be verifiable
 * outside React. No academic claim ships unverified." Phase 1 caught six real
 * physics bugs this way, four of them found by an agent consuming an engine it
 * had not written, and two of them were the AUTHOR'S OWN hand-derived reference
 * values being wrong.
 *
 * So every expected value below is HAND-DERIVED in the comment above its case,
 * from the standard Class 12 result — never copied out of a previous run of this
 * code. Where a value can only be reached by the code itself (a phase angle, a
 * quadrature), the check is an IDENTITY between two independent routes instead:
 *
 *   • mechanical power from a force and a speed, against electrical power from a
 *     current and a resistance;
 *   • the average of v·i by quadrature, against V_rms I_rms cos φ;
 *   • a phasor's vertical projection, against the waveform value;
 *   • the flux derivative in closed form, against a central difference;
 *   • M from the geometry, against √(L₁L₂).
 *
 * An identity cannot be satisfied by a plausible-looking wrong model, which is
 * what makes it worth more than a hand-checked number.
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

const BLOCKS = new URL('../packages/book-renderer/blocks/', import.meta.url);
const EMI = new URL('field-bench/emi/lib/', BLOCKS);
const AC = new URL('circuit-bench/ac/lib/', BLOCKS);

const {
  dOverlapDx, overlapWidth, placementOf, fluxOf, machineState, lenzSentence,
  tiltedFlux, projectedArea, generatorState,
} = await import(new URL('loop.ts', EMI).href);
const {
  motionalEmf, rodState, coastTimeConstant, coastVelocity, coastCharge,
  terminalVelocity, fallVelocity,
} = await import(new URL('motional.ts', EMI).href);
const {
  RESISTIVITY, LOOP_SHAPE_FACTOR, eddyLoopSize, eddyLoopResistance, eddyState,
  dragCoefficient, plateTerminalVelocity, plateCoastVelocity,
} = await import(new URL('eddy.ts', EMI).href);
const {
  MU0, selfInductance, mutualInductance, backEmf, mutualEmf, inductorEnergy,
  rampSample, rampEmfSummary, rampDuration,
} = await import(new URL('inductance.ts', EMI).href);
const { emiSetup, presentIn: _unusedPresent } = await import(new URL('setup.ts', EMI).href)
  .then((m) => ({ emiSetup: m.emiSetup, presentIn: null }));
const { emiContentFill, emiFrameBounds, FIT_PAD } = await import(new URL('view.ts', EMI).href);

const {
  reactanceL, reactanceC, acState, resonanceFrequency, resonanceOmega,
  qualityFactor, bandwidth, instantaneous, phasorAt, phasorProjection, phasorSet,
  phasorVoltageSum, averagePowerNumeric, rmsNumeric, frequencySweep, RAD, DEG,
} = await import(new URL('phasor.ts', AC).href);
const {
  timeConstantLR, finalCurrentLR, lrGrowth, lrDecay,
  omegaLC, freqLC, periodLC, lcSample,
  criticalResistance, dampingOf, lcrSample, lcrTrace,
} = await import(new URL('transient.ts', AC).href);
const {
  turnsRatio, transformerState, lineCurrent, lineLoss, transmissionState, lossScaling,
} = await import(new URL('transformer.ts', AC).href);
const { acSetup, presentIn, buildAcCircuit } = await import(new URL('setup.ts', AC).href);

const { EMI_ARCHETYPES, EMI_ARCHETYPE_ORDER, EMI_VIEW } =
  await import(new URL('field-bench/archetypes.emi.ts', BLOCKS).href);
const { AC_ARCHETYPES, AC_ARCHETYPE_ORDER, AC_VIEW } =
  await import(new URL('circuit-bench/archetypes.ac.ts', BLOCKS).href);
// The SIBLING field libraries, not the merged barrel. `FIELD_ARCHETYPES` merged
// EMI in on 2026-07-30, so testing `!FIELD_ARCHETYPES[id]` reports every EMI id
// as colliding with itself. The barrel's own `mergeArchetypes` throws on any
// duplicate across sources — a stricter guarantee — but this check is kept
// because it names the failure in terms an author can act on.
const FIELD_SIBLINGS = Object.assign(
  {},
  (await import(new URL('field-bench/archetypes.electrostatic.ts', BLOCKS).href)).ELECTROSTATIC_ARCHETYPES,
  (await import(new URL('field-bench/archetypes.gauss.ts', BLOCKS).href)).GAUSS_ARCHETYPES,
  (await import(new URL('field-bench/archetypes.magnetic.ts', BLOCKS).href)).MAGNETIC_ARCHETYPES,
  (await import(new URL('field-bench/archetypes.gravitation.ts', BLOCKS).href)).GRAVITATION_ARCHETYPES,
  (await import(new URL('field-bench/archetypes.modern.ts', BLOCKS).href)).MODERN_ARCHETYPES,
);
const { CIRCUIT_ARCHETYPES } = await import(new URL('circuit-bench/archetypes.ts', BLOCKS).href);
const { FIELD_ISSUES } = await import(new URL('field-bench/lib/misconceptions.ts', BLOCKS).href);
const { CIRCUIT_ISSUES } = await import(new URL('circuit-bench/lib/misconceptions.ts', BLOCKS).href);

void _unusedPresent;

// ── Tiny harness ─────────────────────────────────────────────────────────────

const results = [];
let failures = 0;

const fmt = (v) => (typeof v === 'number'
  ? (Number.isFinite(v) ? String(Number(v.toPrecision(10))) : String(v))
  : String(v));

function check(group, name, actual, expected, tol = 1e-9) {
  // Infinity is a real, expected answer here (X_C at DC, R across an open
  // branch), so it is compared by identity rather than by a difference —
  // Infinity − Infinity is NaN, which would fail a correct result.
  const ok = typeof expected === 'number'
    ? (Number.isFinite(expected)
      ? Number.isFinite(actual) && Math.abs(actual - expected) <= tol
      : actual === expected)
    : actual === expected;
  if (!ok) failures++;
  results.push({ group, name, ok, actual: fmt(actual), expected: fmt(expected) });
}

function assert(group, name, cond, detail = '') {
  if (!cond) failures++;
  results.push({
    group, name, ok: !!cond,
    actual: cond ? 'yes' : `no${detail ? ` — ${detail}` : ''}`, expected: 'yes',
  });
}

const defaults = (a) => Object.fromEntries((a.params ?? []).map((p) => [p.key, p.default]));

// ═════════════════════════════════════════════════════════════════════════════
// PART 1 — EMI
// ═════════════════════════════════════════════════════════════════════════════

// ── 1 · Flux geometry: the five placements ───────────────────────────────────
// Band [−0.15, 0.15] (0.30 m wide), loop 0.15 m wide × 0.10 m tall.
// The loop is FULLY INSIDE when its edges are both in the band, i.e. for
//   x_left = xc − 0.075 >= −0.15  and  x_right = xc + 0.075 <= 0.15
//   → xc in [−0.075, 0.075].
// It first touches at xc = −0.225 and is clear again at xc = +0.225.
{
  const G = '1 · flux geometry';
  const band = { x0: -0.15, x1: 0.15, B: 1.2 };
  const loop = { w: 0.15, h: 0.10, turns: 1, resistance: 0.20 };

  check(G, 'outside: no overlap at xc = −0.30', overlapWidth(band, loop, -0.30), 0);
  check(G, 'outside placement', placementOf(band, loop, -0.30), 'outside');

  // Entering at xc = −0.15: overlap runs from −0.15 to −0.075 → 0.075 m.
  check(G, 'entering: overlap at xc = −0.15', overlapWidth(band, loop, -0.15), 0.075);
  check(G, 'entering placement', placementOf(band, loop, -0.15), 'entering');

  // Fully inside at xc = 0: the whole 0.15 m of loop is over the band.
  check(G, 'fully inside: overlap = the whole loop', overlapWidth(band, loop, 0), 0.15);
  check(G, 'fully-inside placement', placementOf(band, loop, 0), 'fully-inside');
  check(G, 'fully inside at the near edge xc = −0.075', placementOf(band, loop, -0.075), 'fully-inside');

  // Exiting at xc = +0.15: overlap runs from 0.075 to 0.15 → 0.075 m.
  check(G, 'exiting: overlap at xc = +0.15', overlapWidth(band, loop, 0.15), 0.075);
  check(G, 'exiting placement', placementOf(band, loop, 0.15), 'exiting');

  // A band NARROWER than the loop: [−0.05, 0.05] is 0.10 m, loop is 0.15 m, so
  // the loop spans it and the overlap is the band's own width.
  const thin = { x0: -0.05, x1: 0.05, B: 1.2 };
  check(G, 'spanning: overlap = the band width', overlapWidth(thin, loop, 0), 0.10);
  check(G, 'spanning placement', placementOf(thin, loop, 0), 'spanning');

  // Φ = B × overlap × h.
  check(G, 'flux entering at xc = −0.15 (1.2 × 0.075 × 0.10)', fluxOf(band, loop, -0.15), 0.009);
  check(G, 'flux fully inside (1.2 × 0.15 × 0.10)', fluxOf(band, loop, 0), 0.018);
  check(G, 'flux outside is exactly zero', fluxOf(band, loop, -0.30), 0);
}

// ── 2 · The overlap derivative, and its one-sided corners ────────────────────
// d(overlap)/dxc is +1 while entering, 0 while fully inside, −1 while exiting,
// and 0 while spanning. At a corner it is genuinely two-valued, so `dir` picks.
{
  const G = '2 · dOverlap/dx';
  const band = { x0: -0.15, x1: 0.15, B: 1.2 };
  const loop = { w: 0.15, h: 0.10, turns: 1, resistance: 0.20 };

  check(G, 'entering, moving right → +1', dOverlapDx(band, loop, -0.15, +1), 1);
  check(G, 'entering, moving left → +1 (still the left edge binding)', dOverlapDx(band, loop, -0.15, -1), 1);
  check(G, 'fully inside → 0 either way (right)', dOverlapDx(band, loop, 0, +1), 0);
  check(G, 'fully inside → 0 either way (left)', dOverlapDx(band, loop, 0, -1), 0);
  check(G, 'exiting → −1', dOverlapDx(band, loop, 0.15, +1), -1);
  check(G, 'outside → 0', dOverlapDx(band, loop, -0.30, +1), 0);
  check(G, 'spanning a narrow band → 0', dOverlapDx({ x0: -0.05, x1: 0.05, B: 1.2 }, loop, 0, +1), 0);

  // THE CORNER. At xc = +0.075 the loop's right edge sits exactly on x1.
  // Moving RIGHT it begins to lose flux → −1. Moving LEFT it is fully inside
  // and the overlap is constant → 0. A two-sided derivative would average these
  // to −0.5 and report an EMF at the instant the EMF reverses.
  check(G, 'corner xc = +0.075, moving right → −1', dOverlapDx(band, loop, 0.075, +1), -1);
  check(G, 'corner xc = +0.075, moving left → 0', dOverlapDx(band, loop, 0.075, -1), 0);
  // Mirror corner: left edge exactly on x0.
  check(G, 'corner xc = −0.075, moving right → 0', dOverlapDx(band, loop, -0.075, +1), 0);
  check(G, 'corner xc = −0.075, moving left → +1', dOverlapDx(band, loop, -0.075, -1), 1);

  // Cross-check the closed form against a one-sided finite difference of the
  // overlap itself, away from the corners, where the two must agree exactly
  // (the function is piecewise LINEAR, so a difference is not an approximation).
  const eps = 1e-7;
  let agreed = 0;
  for (let xc = -0.30; xc <= 0.30 + 1e-12; xc += 0.005) {
    const nearCorner = [-0.225, -0.075, 0.075, 0.225].some((c) => Math.abs(xc - c) < 2 * eps);
    if (nearCorner) continue;
    const fd = (overlapWidth(band, loop, xc + eps) - overlapWidth(band, loop, xc)) / eps;
    if (Math.abs(fd - dOverlapDx(band, loop, xc, +1)) < 1e-6) agreed++;
    else {
      check(G, `finite difference agrees at xc = ${xc.toFixed(3)}`, fd, dOverlapDx(band, loop, xc, +1), 1e-6);
    }
  }
  assert(G, `finite difference agrees at all ${agreed} sampled positions`, agreed >= 110, `only ${agreed}`);
}

// ── 3 · A STATIONARY LOOP IN A STRONG FIELD HAS EXACTLY ZERO EMF ─────────────
// The headline claim of the whole unit. Φ = 3 × 0.15 × 0.10 = 45 mWb — the most
// the loop can hold — and dΦ/dt = 0, so emf = 0, current = 0, force = 0.
{
  const G = '3 · flux is not EMF';
  const strong = { x0: -0.30, x1: 0.30, B: 3 };
  const loop = { w: 0.15, h: 0.10, turns: 1, resistance: 0.20 };

  const parked = machineState(strong, loop, 0, 0);
  check(G, 'parked in 3 T: flux is 45 mWb', parked.flux, 0.045);
  check(G, 'parked in 3 T: dΦ/dt is exactly zero', parked.dFluxDt, 0, 0);
  check(G, 'parked in 3 T: emf is exactly zero', parked.emf, 0, 0);
  check(G, 'parked in 3 T: current is exactly zero', parked.current, 0, 0);
  check(G, 'parked in 3 T: force is exactly zero', parked.forceX, 0, 0);
  check(G, 'parked in 3 T: no mechanical power needed', parked.mechanicalPower, 0, 0);

  // MOVING inside a uniform field is also zero — it is the CHANGE that matters,
  // not the motion. This is the case a student gets wrong most often.
  const movingInside = machineState(strong, loop, 0, 1.5);
  check(G, 'moving fast INSIDE a uniform field: dΦ/dt is zero', movingInside.dFluxDt, 0, 0);
  check(G, 'moving fast INSIDE a uniform field: emf is zero', movingInside.emf, 0, 0);
  check(G, 'and the placement says why', movingInside.placement, 'fully-inside');

  // A weak field and a crawl DOES make an emf: B = 0.2 T, h = 0.10, v = 0.05
  //   → dΦ/dt = 0.2 × 0.10 × 0.05 = 0.001 Wb/s, emf = −1 mV.
  const weak = { x0: -0.15, x1: 0.15, B: 0.2 };
  const crawling = machineState(weak, loop, -0.15, 0.05);
  check(G, 'weak field, crawling: dΦ/dt = 1 mWb/s', crawling.dFluxDt, 0.001);
  check(G, 'weak field, crawling: emf = −1 mV', crawling.emf, -0.001);
  assert(G, 'a fifteenth of the flux and a real emf, versus 45 mWb and none',
    Math.abs(crawling.flux) < parked.flux / 10 && Math.abs(crawling.emf) > 0);

  // Zero speed anywhere gives exactly zero, at every position on the bench.
  let zeros = 0;
  for (let xc = -0.30; xc <= 0.30 + 1e-12; xc += 0.01) {
    const s = machineState(weak, loop, xc, 0);
    if (s.emf === 0 && s.current === 0 && s.forceX === 0) zeros++;
    else check(G, `v = 0 at xc = ${xc.toFixed(2)} gives no emf`, s.emf, 0, 0);
  }
  assert(G, `v = 0 gives exactly zero at all ${zeros} bench positions`, zeros >= 60, `only ${zeros}`);
}

// ── 4 · LENZ'S SIGN, IN BOTH DIRECTIONS ──────────────────────────────────────
// Convention: B_z > 0 is OUT of the page, positive circulation is CCW, and
// emf = −N dΦ/dt. Therefore:
//   pushing IN  → Φ_out rising  → emf < 0 → I < 0 = CLOCKWISE → own field INTO
//                 the page inside the loop → opposes the rise.
//   pulling OUT → Φ_out falling → emf > 0 → I > 0 = CCW → own field OUT of the
//                 page → props up the fall.
// Nothing in `loop.ts` special-cases this; it is arithmetic, and this group is
// the check that the arithmetic really produces Lenz and not anti-Lenz.
{
  const G = '4 · Lenz, both ways';
  const band = { x0: -0.15, x1: 0.15, B: 1.2 };
  const loop = { w: 0.15, h: 0.10, turns: 1, resistance: 0.20 };

  // Entering rightwards at xc = −0.15, v = +0.5:
  //   dΦ/dt = 1.2 × 0.10 × (+1) × 0.5 = +0.060 Wb/s
  //   emf = −0.060 V,  I = −0.060/0.20 = −0.300 A (clockwise)
  const inward = machineState(band, loop, -0.15, +0.5);
  check(G, 'entering: dΦ/dt = +60 mWb/s', inward.dFluxDt, 0.06);
  check(G, 'entering: emf = −60 mV', inward.emf, -0.06);
  check(G, 'entering: current = −300 mA', inward.current, -0.30);
  check(G, 'entering: sense is clockwise', inward.sense, 'cw');
  assert(G, 'entering: flux rising and current opposing it',
    inward.dFluxDt > 0 && inward.current < 0);

  // Exiting rightwards at xc = +0.15, v = +0.5:
  //   dΦ/dt = 1.2 × 0.10 × (−1) × 0.5 = −0.060 Wb/s, emf = +0.060 V, I = +0.300 A
  const outward = machineState(band, loop, +0.15, +0.5);
  check(G, 'exiting: dΦ/dt = −60 mWb/s', outward.dFluxDt, -0.06);
  check(G, 'exiting: emf = +60 mV', outward.emf, 0.06);
  check(G, 'exiting: current = +300 mA', outward.current, 0.30);
  check(G, 'exiting: sense is counter-clockwise', outward.sense, 'ccw');
  assert(G, 'exiting: flux falling and current supporting it',
    outward.dFluxDt < 0 && outward.current > 0);

  assert(G, 'THE CURRENT REVERSES between going in and coming out',
    Math.sign(inward.current) === -Math.sign(outward.current));

  // Reversing the MOTION instead of the position reverses it too: pulling the
  // loop back out of the left-hand edge (xc = −0.15, v = −0.5).
  const backOut = machineState(band, loop, -0.15, -0.5);
  check(G, 'pulled back out on the left: dΦ/dt = −60 mWb/s', backOut.dFluxDt, -0.06);
  check(G, 'pulled back out on the left: current = +300 mA', backOut.current, 0.30);
  assert(G, 'same position, opposite velocity, opposite current',
    Math.sign(inward.current) === -Math.sign(backOut.current));

  // THE FORCE ALWAYS OPPOSES THE MOTION — in all four combinations of edge and
  // direction. F_x = N I B h k, and it comes out negative for v > 0 every time.
  const cases = [
    ['entering, moving right', -0.15, +0.5],
    ['exiting, moving right', +0.15, +0.5],
    ['entering edge, moving left', -0.15, -0.5],
    ['exiting edge, moving left', +0.15, -0.5],
  ];
  for (const [label, xc, v] of cases) {
    const s = machineState(band, loop, xc, v);
    assert(G, `force opposes v — ${label}`, Math.sign(s.forceX) === -Math.sign(v),
      `F = ${s.forceX}, v = ${v}`);
    // |F| = |I| B h = 0.300 × 1.2 × 0.10 = 36 mN in every one of the four.
    check(G, `|force| = 36 mN — ${label}`, Math.abs(s.forceX), 0.036);
  }

  // And the sentence the panel prints is built from the signs, so it must track.
  assert(G, 'the Lenz sentence names clockwise when entering',
    /clockwise/.test(lenzSentence(inward)) && !/counter-clockwise/.test(lenzSentence(inward)));
  assert(G, 'the Lenz sentence names counter-clockwise when exiting',
    /counter-clockwise/.test(lenzSentence(outward)));
  assert(G, 'the fully-inside sentence says the flux is large and not changing',
    /not changing/.test(lenzSentence(machineState(band, loop, 0, 0.5))));
}

// ── 5 · POWER BALANCE IN THE FLUX MACHINE ────────────────────────────────────
// P_mech = −F_x·v and P_elec = I²R are computed from different quantities.
// At the defaults: F = 36 mN, v = 0.5 → 18 mW; I = 0.3 A, R = 0.2 Ω → 18 mW.
{
  const G = '5 · flux-machine power';
  const band = { x0: -0.15, x1: 0.15, B: 1.2 };
  const loop = { w: 0.15, h: 0.10, turns: 1, resistance: 0.20 };

  const s = machineState(band, loop, -0.15, 0.5);
  check(G, 'mechanical power = 18 mW', s.mechanicalPower, 0.018);
  check(G, 'electrical power = 18 mW', s.electricalPower, 0.018);
  check(G, 'and they are the SAME number', s.mechanicalPower - s.electricalPower, 0, 1e-15);

  // Sweep speed, field, resistance, turns and position. The identity must hold
  // everywhere, not at one lucky point.
  let n = 0;
  for (const B of [0.2, 0.8, 1.2, 2.5]) {
    for (const R of [0.05, 0.2, 1, 2]) {
      for (const turns of [1, 3, 12]) {
        for (const v of [-1.7, -0.35, 0.35, 1.7]) {
          for (const xc of [-0.20, -0.15, -0.09, 0, 0.09, 0.15, 0.20]) {
            const st = machineState({ ...band, B }, { ...loop, resistance: R, turns }, xc, v);
            const diff = Math.abs(st.mechanicalPower - st.electricalPower);
            if (diff <= 1e-9 * Math.max(1, st.electricalPower)) { n++; continue; }
            check(G, `power balance at B=${B} R=${R} N=${turns} v=${v} xc=${xc}`,
              st.mechanicalPower, st.electricalPower, 1e-9);
          }
        }
      }
    }
  }
  assert(G, `mechanical power = electrical power in all ${n} swept configurations`, n === 1344, `${n} of 1344`);

  // Power is never negative: nobody gets energy out of this for free.
  let nonneg = 0;
  for (const v of [-2, -0.5, 0, 0.5, 2]) {
    for (const xc of [-0.2, -0.15, 0, 0.15, 0.2]) {
      const st = machineState(band, loop, xc, v);
      if (st.mechanicalPower >= 0 && st.electricalPower >= 0) nonneg++;
    }
  }
  assert(G, `mechanical power is never negative (${nonneg}/25)`, nonneg === 25);

  // N turns: emf scales as N, so power scales as N².
  const one = machineState(band, { ...loop, turns: 1 }, -0.15, 0.5);
  const ten = machineState(band, { ...loop, turns: 10 }, -0.15, 0.5);
  check(G, '10 turns gives 10× the emf', ten.emf / one.emf, 10);
  check(G, '10 turns gives 100× the power', ten.electricalPower / one.electricalPower, 100);
}

// ── 6 · FLUX THROUGH A TILTED LOOP = B A cos θ ───────────────────────────────
// B = 1.2 T, A = 0.15 × 0.10 = 0.015 m², one turn → Φ(0) = 18 mWb.
//   θ = 60° → cos 60° = 0.5 exactly    → 9 mWb
//   θ = 45° → cos 45° = 0.7071067811865476 → 12.727922 mWb
//   θ = 90° → EXACTLY zero, not 6.1e-17
{
  const G = '6 · tilt';
  const B = 1.2;
  const A = 0.015;

  check(G, 'face-on: Φ = B A = 18 mWb', tiltedFlux(B, A, 1, 0), 0.018);
  check(G, 'θ = 60°: half of it', tiltedFlux(B, A, 1, 60), 0.009);
  check(G, 'θ = 45°: B A / √2', tiltedFlux(B, A, 1, 45), 0.018 / Math.SQRT2);
  check(G, 'θ = 90°: EXACTLY zero', tiltedFlux(B, A, 1, 90), 0, 0);
  check(G, 'θ = 270°: exactly zero too', tiltedFlux(B, A, 1, 270), 0, 0);
  check(G, 'θ = 180°: reversed, −18 mWb', tiltedFlux(B, A, 1, 180), -0.018);
  check(G, 'θ = 120°: −9 mWb', tiltedFlux(B, A, 1, 120), -0.009);
  check(G, '50 turns multiplies the linkage', tiltedFlux(B, A, 50, 0), 0.9);

  check(G, 'projected area face-on is the whole area', projectedArea(A, 0), A);
  check(G, 'projected area edge-on is exactly zero', projectedArea(A, 90), 0, 0);
  check(G, 'projected area at 60° is half', projectedArea(A, 60), A / 2);

  // A general table, against the cosine computed independently here.
  let cosOk = 0;
  for (let d = 0; d <= 360; d += 5) {
    const want = (d % 180 === 90) ? 0 : B * A * Math.cos(d * Math.PI / 180);
    if (Math.abs(tiltedFlux(B, A, 1, d) - want) <= 1e-15) cosOk++;
    else check(G, `Φ at θ = ${d}°`, tiltedFlux(B, A, 1, d), want, 1e-15);
  }
  assert(G, `Φ = B A cos θ at all ${cosOk} tabulated angles`, cosOk === 73, `${cosOk} of 73`);
}

// ── 7 · The rotating loop — where AC comes from ──────────────────────────────
// B = 0.5 T, A = 0.02 m², N = 50, f = 5 Hz → ω = 10π = 31.41592653589793 rad/s.
// Φ = B A cos ωt = 0.01 cos ωt; peak emf = N B A ω = 50 × 0.5 × 0.02 × 10π
//   = 0.5 × 31.41592653589793 = 15.707963267948966 V.
{
  const G = '7 · the generator';
  const g = { B: 0.5, area: 0.02, turns: 50, omega: 10 * Math.PI, resistance: 10 };

  check(G, 'peak emf = N B A ω = 15.708 V', generatorState(g, 0).peakEmf, 0.5 * 10 * Math.PI);
  check(G, 'at t = 0 the flux is at its maximum, B A = 10 mWb', generatorState(g, 0).flux, 0.01);
  check(G, 'and the emf there is exactly zero', generatorState(g, 0).emf, 0, 1e-15);

  // A quarter turn later: flux zero, emf at its peak. This is the counter-
  // intuitive pairing the archetype is built around.
  const quarter = (Math.PI / 2) / g.omega;
  check(G, 'a quarter turn on: flux is zero', generatorState(g, quarter).flux, 0, 1e-17);
  check(G, 'a quarter turn on: emf is at its peak', generatorState(g, quarter).emf, 0.5 * 10 * Math.PI);
  check(G, 'and the current is peak/R', generatorState(g, quarter).current, (0.5 * 10 * Math.PI) / 10);

  // emf = −N dΦ/dt, checked as a central difference of the flux this same
  // function reports. Two routes, one number.
  const h = 1e-6;
  let faraday = 0;
  for (let k = 0; k < 40; k++) {
    const t = (k / 40) * ((2 * Math.PI) / g.omega);
    const dPhi = (generatorState(g, t + h).flux - generatorState(g, t - h).flux) / (2 * h);
    const want = -g.turns * dPhi;
    if (Math.abs(generatorState(g, t).emf - want) < 1e-7) faraday++;
    else check(G, `emf = −N dΦ/dt at t = ${t.toExponential(2)}`, generatorState(g, t).emf, want, 1e-7);
  }
  assert(G, `emf = −N dΦ/dt at all ${faraday} sampled instants`, faraday === 40, `${faraday} of 40`);

  // Doubling the rotation rate doubles the peak emf.
  check(G, 'double ω doubles the peak emf',
    generatorState({ ...g, omega: 20 * Math.PI }, 0).peakEmf / generatorState(g, 0).peakEmf, 2);
}

// ── 8 · MOTIONAL EMF: ε = Bℓv, AND THE TWO POWERS ────────────────────────────
// B = 0.8 T, ℓ = 0.25 m, v = 2.0 m/s, R = 0.5 Ω, m = 0.05 kg.
//   ε = 0.8 × 0.25 × 2 = 0.400 V
//   I = 0.400 / 0.5 = 0.800 A
//   F = I ℓ B = 0.800 × 0.25 × 0.8 = 0.160 N
//   P_mech = F v = 0.160 × 2 = 0.320 W
//   P_elec = I²R = 0.64 × 0.5 = 0.320 W
{
  const G = '8 · motional EMF';
  const rod = { length: 0.25, B: 0.8, resistance: 0.5, mass: 0.05 };

  check(G, 'ε = Bℓv = 400 mV', motionalEmf(rod, 2), 0.4);
  const s = rodState(rod, 2);
  check(G, 'current = 800 mA', s.current, 0.8);
  check(G, 'magnetic force = 160 mN', s.magneticForce, 0.16);
  check(G, 'mechanical power = 320 mW', s.mechanicalPower, 0.32);
  check(G, 'electrical power = 320 mW', s.electricalPower, 0.32);
  check(G, 'THE TWO POWERS AGREE TO 1e-9', s.mechanicalPower - s.electricalPower, 0, 1e-9);

  // ε is linear in each of the three, one at a time.
  check(G, 'double the speed doubles ε', motionalEmf(rod, 4), 0.8);
  check(G, 'halve the rail gap halves ε', motionalEmf({ ...rod, length: 0.125 }, 2), 0.2);
  check(G, 'double the field doubles ε', motionalEmf({ ...rod, B: 1.6 }, 2), 0.8);
  check(G, 'zero speed gives exactly zero', motionalEmf(rod, 0), 0, 0);

  // The identity across a full sweep — 4 × 4 × 4 × 5 = 320 configurations.
  let n = 0;
  for (const B of [0.2, 0.8, 1.5, 2]) {
    for (const L of [0.05, 0.25, 0.4, 0.5]) {
      for (const R of [0.1, 0.5, 2, 5]) {
        for (const v of [0.1, 0.9, 2, 3.5, 5]) {
          const st = rodState({ length: L, B, resistance: R, mass: 0.05 }, v);
          if (Math.abs(st.mechanicalPower - st.electricalPower) <= 1e-9 * Math.max(1, st.electricalPower)) n++;
          else check(G, `powers agree at B=${B} ℓ=${L} R=${R} v=${v}`, st.mechanicalPower, st.electricalPower, 1e-9);
        }
      }
    }
  }
  assert(G, `mechanical = electrical power in all ${n} swept configurations`, n === 320, `${n} of 320`);

  // AND the rod must agree with the general flux machine: a rod on rails is the
  // k = +1 case of a loop with h = ℓ. Two models of the same physics.
  //
  // ⚠ The loop must STRADDLE the band edge for k to be 1. An earlier version of
  // this case put the loop at xc = −8 with the band starting at −10, where the
  // left edge sits EXACTLY on the boundary — which is the fully-inside case,
  // k = 0, and the check read 0 V. That is the verifier catching the author, not
  // the engine: at xc = −11 the loop's left edge is at −13, clear of the band.
  const wide = { x0: -10, x1: 10, B: 0.8 };
  const asLoop = machineState(wide, { w: 4, h: 0.25, turns: 1, resistance: 0.5 }, -11, 2);
  check(G, 'the loop model is genuinely in the entering state', asLoop.placement, 'entering');
  check(G, 'the loop model gives the same |emf| as ε = Bℓv', Math.abs(asLoop.emf), 0.4);
  check(G, 'the loop model gives the same |current|', Math.abs(asLoop.current), 0.8);
  check(G, 'the loop model gives the same |force|', Math.abs(asLoop.forceX), 0.16);
  check(G, 'the loop model gives the same power', asLoop.electricalPower, 0.32);
}

// ── 9 · Rod dynamics ─────────────────────────────────────────────────────────
// τ = mR/(B²ℓ²) = 0.05 × 0.5 / (0.64 × 0.0625) = 0.025 / 0.04 = 0.625 s
// v_terminal = mgR/(B²ℓ²) = 0.05 × 9.8 × 0.5 / 0.04 = 0.245 / 0.04 = 6.125 m/s
// q_coast = m v₀ / (Bℓ) = 0.05 × 2 / 0.2 = 0.500 C — independent of R.
{
  const G = '9 · rod dynamics';
  const rod = { length: 0.25, B: 0.8, resistance: 0.5, mass: 0.05 };

  check(G, 'coast time constant = 0.625 s', coastTimeConstant(rod), 0.625);
  check(G, 'v after one τ is v₀/e', coastVelocity(rod, 2, 0.625), 2 * Math.exp(-1));
  check(G, 'v after 3τ', coastVelocity(rod, 2, 1.875), 2 * Math.exp(-3));
  check(G, 'terminal velocity = 6.125 m/s', terminalVelocity(rod, 9.8), 6.125);
  check(G, 'at terminal velocity the magnetic force equals mg',
    rodState(rod, terminalVelocity(rod, 9.8)).magneticForce, 0.05 * 9.8);
  check(G, 'falling reaches 63.2% of v_terminal at t = τ',
    fallVelocity(rod, 0.625, 9.8) / 6.125, 1 - Math.exp(-1));
  check(G, 'total charge while coasting = 500 mC', coastCharge(rod, 2), 0.5);

  // The charge is the same however big the resistance is — a real surprise.
  check(G, 'charge is unchanged with 10× the resistance',
    coastCharge({ ...rod, resistance: 5 }, 2), 0.5);
  check(G, 'charge is unchanged with a tenth of the resistance',
    coastCharge({ ...rod, resistance: 0.05 }, 2), 0.5);
  // ...but the time constant is not.
  check(G, 'while τ scales with the resistance', coastTimeConstant({ ...rod, resistance: 5 }), 6.25);

  // Halving the resistance halves the terminal velocity — a better conductor
  // brakes harder.
  check(G, 'half the resistance, half the terminal velocity',
    terminalVelocity({ ...rod, resistance: 0.25 }, 9.8), 3.0625);
}

// ── 10 · Eddy-current braking ────────────────────────────────────────────────
// Aluminium ρ = 2.65e-8 Ω·m, thickness 2 mm, plate 0.10 m tall, B = 0.6 T.
//   R_loop = 16 ρ / t = 16 × 2.65e-8 / 0.002 = 2.12e-4 Ω  (independent of size)
//   solid (1 strip): a = 0.10 m
//     b = B² a² / R_loop = 0.36 × 0.01 / 2.12e-4 = 16.98113208 N·s/m
//     v_terminal = mg/b = 0.06 × 9.8 / 16.98113208 = 0.03462660 m/s
//   4 strips: a = 0.025 m, and b = 4 × 0.36 × 6.25e-4 / 2.12e-4 = 4.24528302
//     which is EXACTLY a quarter — the 1/slots scaling the exercise claims.
{
  const G = '10 · eddy braking';
  const plate = {
    height: 0.10, width: 0.12, thickness: 0.002,
    resistivity: RESISTIVITY.aluminium, mass: 0.06, slots: 1,
  };

  check(G, 'the shape factor is 16, and it is a stated assumption', LOOP_SHAPE_FACTOR, 16);
  check(G, 'aluminium resistivity is 2.65e-8 Ω·m', RESISTIVITY.aluminium, 2.65e-8);
  check(G, 'solid plate: eddy loop is the full plate height', eddyLoopSize(plate), 0.10);
  check(G, 'loop resistance = 16ρ/t = 212 µΩ', eddyLoopResistance(plate), 2.12e-4);
  check(G, 'loop resistance does NOT depend on the loop size',
    eddyLoopResistance({ ...plate, slots: 8 }), 2.12e-4);
  check(G, 'drag coefficient = 16.98 N·s/m', dragCoefficient(plate, 0.6), 0.0036 / 2.12e-4);
  check(G, 'terminal speed of the solid plate = 3.46 cm/s',
    plateTerminalVelocity(plate, 0.6, 9.8), (0.06 * 9.8) / (0.0036 / 2.12e-4));

  // Braking power at 1 m/s equals the drag coefficient (F = bv, P = bv²).
  check(G, 'power at 1 m/s equals b', eddyState(plate, 0.6, 1).power, 0.0036 / 2.12e-4);
  check(G, 'force at 1 m/s equals b', eddyState(plate, 0.6, 1).force, 0.0036 / 2.12e-4);
  check(G, 'force at v = 0 is exactly zero (no divide-by-zero)', eddyState(plate, 0.6, 0).force, 0, 0);
  check(G, 'eddy current in the solid plate at 1 m/s is 283 A',
    eddyState(plate, 0.6, 1).loopCurrent, 0.06 / 2.12e-4);

  // THE SCALING CLAIM: braking goes as 1/slots, exactly.
  const b1 = dragCoefficient(plate, 0.6);
  for (const s of [2, 3, 4, 5, 8, 10]) {
    check(G, `${s} strips brake exactly 1/${s} as hard`,
      dragCoefficient({ ...plate, slots: s }, 0.6), b1 / s);
    check(G, `${s} strips: terminal speed is ${s}× faster`,
      plateTerminalVelocity({ ...plate, slots: s }, 0.6, 9.8),
      plateTerminalVelocity(plate, 0.6, 9.8) * s);
  }

  // Braking goes as B², and as the thickness.
  check(G, 'double the field, four times the braking',
    dragCoefficient(plate, 1.2) / b1, 4);
  check(G, 'double the thickness, double the braking',
    dragCoefficient({ ...plate, thickness: 0.004 }, 0.6) / b1, 2);

  // Conductivity, not "being metal": stainless is 26.04× worse than aluminium.
  const stainless = { ...plate, resistivity: RESISTIVITY.stainless };
  check(G, 'stainless brakes 26.04× less than aluminium',
    b1 / dragCoefficient(stainless, 0.6), RESISTIVITY.stainless / RESISTIVITY.aluminium);
  assert(G, 'and copper brakes MORE than aluminium',
    dragCoefficient({ ...plate, resistivity: RESISTIVITY.copper }, 0.6) > b1);

  // Coasting is the same exponential as the rod and as an LR circuit.
  const tau = plate.mass / b1;
  check(G, 'coasting reaches v₀/e at t = m/b', plateCoastVelocity(plate, 0.6, 1, tau), Math.exp(-1));
}

// ── 11 · Self and mutual inductance ──────────────────────────────────────────
// N₁ = 800, A = 8e-4 m², ℓ = 0.15 m.
//   L₁ = μ₀ N₁² A / ℓ = 4π×10⁻⁷ × 640000 × 8×10⁻⁴ / 0.15
//   N₂ = 1600 → L₂ = 4 L₁ (turns squared), M = 2 L₁ (product of turns)
//   and therefore M = √(L₁ L₂) = √(4 L₁²) = 2 L₁ — an identity, checked as one.
{
  const G = '11 · inductance';
  const coil = { turns: 800, area: 8e-4, length: 0.15 };
  const L1 = (MU0 * 800 * 800 * 8e-4) / 0.15;
  const L2 = (MU0 * 1600 * 1600 * 8e-4) / 0.15;
  const M = (MU0 * 800 * 1600 * 8e-4) / 0.15;

  check(G, 'μ₀ = 4π × 10⁻⁷', MU0, 4 * Math.PI * 1e-7, 0);
  check(G, 'L = μ₀N²A/ℓ = 4.289 mH', selfInductance(coil), L1);
  check(G, 'double the turns gives 4× the inductance',
    selfInductance({ ...coil, turns: 1600 }) / selfInductance(coil), 4);
  check(G, 'double the length gives half the inductance',
    selfInductance({ ...coil, length: 0.30 }) / selfInductance(coil), 0.5);
  check(G, 'double the area gives double the inductance',
    selfInductance({ ...coil, area: 16e-4 }) / selfInductance(coil), 2);

  check(G, 'M = μ₀N₁N₂A/ℓ = 8.579 mH', mutualInductance(coil, 1600, 1), M);
  check(G, 'M = √(L₁L₂) at perfect coupling', mutualInductance(coil, 1600, 1), Math.sqrt(L1 * L2));
  check(G, 'half the coupling halves M', mutualInductance(coil, 1600, 0.5), M / 2);
  check(G, 'M is symmetric in the two coils',
    mutualInductance(coil, 1600, 1),
    mutualInductance({ ...coil, turns: 1600 }, 800, 1));

  // M = k√(L₁L₂) across a table of couplings and turn ratios.
  let mOk = 0;
  for (const k of [0.1, 0.35, 0.5, 0.8, 1]) {
    for (const n2 of [200, 800, 1600, 3200]) {
      const la = selfInductance(coil);
      const lb = selfInductance({ ...coil, turns: n2 });
      // Relative, not absolute: M spans 1e-3 to 1.4e-2 H across this table, and
      // a 1e-18 absolute bar is below one float epsilon of the larger values.
      const want = k * Math.sqrt(la * lb);
      if (Math.abs(mutualInductance(coil, n2, k) - want) <= 1e-14 * want) mOk++;
      else check(G, `M = k√(L₁L₂) at k=${k}, N₂=${n2}`, mutualInductance(coil, n2, k), want, 1e-14 * want);
    }
  }
  assert(G, `M = k√(L₁L₂) for all ${mOk} coupling/turns pairs`, mOk === 20, `${mOk} of 20`);

  // ε = −L dI/dt: THE opposition is to the change, not to the current.
  check(G, 'ε = −L dI/dt at 100 A/s', backEmf(L1, 100), -L1 * 100);
  check(G, 'a steady current gives exactly zero back-EMF', backEmf(L1, 0), 0, 0);
  check(G, 'a falling current flips the sign', backEmf(L1, -100), L1 * 100);
  check(G, 'ε₂ = −M dI₁/dt', mutualEmf(M, 100), -M * 100);
  check(G, 'a steady primary current induces exactly nothing', mutualEmf(M, 0), 0, 0);
  check(G, 'U = ½LI² at 2 A', inductorEnergy(L1, 2), 0.5 * L1 * 4);
  check(G, 'U at zero current is zero', inductorEnergy(L1, 0), 0, 0);
}

// ── 12 · The current ramp — biggest current, no EMF ──────────────────────────
// peak 2 A over 20 ms → dI/dt = 100 A/s while rising, 0 while holding,
// −100 A/s while falling. So ε = −L×100, 0, +L×100. The middle one is the point.
{
  const G = '12 · the ramp';
  const L = (MU0 * 800 * 800 * 8e-4) / 0.15;
  const ramp = { peak: 2, rampUp: 0.02, hold: 0.03, rampDown: 0.02 };

  check(G, 'the programme lasts 70 ms', rampDuration(ramp), 0.07);

  const rising = rampSample(ramp, L, 0.01);
  check(G, 'rising: current is 1 A half-way up', rising.current, 1);
  check(G, 'rising: dI/dt = 100 A/s', rising.dIdt, 100);
  check(G, 'rising: ε = −L × 100', rising.emf, -L * 100);
  check(G, 'rising phase is named', rising.phase, 'rising');

  const steady = rampSample(ramp, L, 0.035);
  check(G, 'HOLDING: current is at its PEAK, 2 A', steady.current, 2);
  check(G, 'HOLDING: dI/dt is exactly zero', steady.dIdt, 0, 0);
  check(G, 'HOLDING: ε is exactly zero — the whole lesson', steady.emf, 0, 0);
  check(G, 'steady phase is named', steady.phase, 'steady');
  check(G, 'HOLDING: energy stored is ½LI² = 8.579 mJ', steady.energy, 0.5 * L * 4);

  const falling = rampSample(ramp, L, 0.06);
  check(G, 'falling: dI/dt = −100 A/s', falling.dIdt, -100);
  check(G, 'falling: ε has FLIPPED SIGN and now drives the current', falling.emf, L * 100);
  check(G, 'falling phase is named', falling.phase, 'falling');

  check(G, 'before it starts: nothing', rampSample(ramp, L, -0.01).current, 0);
  check(G, 'after it ends: nothing', rampSample(ramp, L, 0.08).current, 0);
  check(G, 'after it ends: no emf either', rampSample(ramp, L, 0.08).emf, 0, 0);

  const sum = rampEmfSummary(ramp, L);
  check(G, 'summary: rising emf', sum.rising, -L * 100);
  check(G, 'summary: steady emf is exactly zero', sum.steady, 0, 0);
  check(G, 'summary: falling emf is equal and opposite', sum.falling, -sum.rising);
  assert(G, 'the biggest current in the run coincides with the smallest emf',
    Math.abs(steady.current) > Math.abs(rising.current)
    && Math.abs(steady.emf) < Math.abs(rising.emf));

  // A steeper ramp gives a bigger emf at the SAME peak current.
  const steep = rampSample({ ...ramp, rampUp: 0.005 }, L, 0.002);
  check(G, 'a 4× steeper ramp gives 4× the emf', steep.emf, -L * 400);

  // The corner is right-handed: at t = rampUp exactly, the hold has begun.
  check(G, 'at the corner t = rampUp the slope is already zero',
    rampSample(ramp, L, 0.02).dIdt, 0, 0);
  check(G, 'and the current there is the peak', rampSample(ramp, L, 0.02).current, 2);
}

// ═════════════════════════════════════════════════════════════════════════════
// PART 2 — AC
// ═════════════════════════════════════════════════════════════════════════════

// ── 13 · X_L = 2πfL and X_C = 1/(2πfC), across a sweep ───────────────────────
// L = 0.2 H at 50 Hz: X_L = 2π × 50 × 0.2 = 62.83185307179587 Ω
// C = 50 µF at 50 Hz: X_C = 1/(2π × 50 × 5e-5) = 63.66197723675813 Ω
{
  const G = '13 · reactance';
  check(G, 'X_L at 50 Hz, 0.2 H', reactanceL(50, 0.2), 2 * Math.PI * 50 * 0.2);
  check(G, 'X_C at 50 Hz, 50 µF', reactanceC(50, 50e-6), 1 / (2 * Math.PI * 50 * 50e-6));
  check(G, 'X_L at DC is exactly zero', reactanceL(0, 0.2), 0, 0);
  check(G, 'X_C at DC is INFINITE, not a big number', reactanceC(0, 50e-6), Number.POSITIVE_INFINITY);

  // A full sweep, both formulas, against arithmetic done here.
  let xOk = 0;
  for (const f of [1, 5, 12.5, 50, 60, 100, 250, 400, 1000, 5000]) {
    for (const L of [0.02, 0.2, 0.5, 1]) {
      const want = 2 * Math.PI * f * L;
      if (Math.abs(reactanceL(f, L) - want) <= 1e-12) xOk++;
      else check(G, `X_L at ${f} Hz, ${L} H`, reactanceL(f, L), want, 1e-12);
    }
    for (const C of [5e-6, 50e-6, 200e-6, 500e-6]) {
      const want = 1 / (2 * Math.PI * f * C);
      if (Math.abs(reactanceC(f, C) - want) <= 1e-9 * want) xOk++;
      else check(G, `X_C at ${f} Hz, ${C} F`, reactanceC(f, C), want, 1e-9 * want);
    }
  }
  assert(G, `both reactance formulas hold at all ${xOk} sweep points`, xOk === 80, `${xOk} of 80`);

  // Direction of travel: X_L rises with f, X_C falls. Monotone, no exceptions.
  let mono = true;
  for (let f = 5; f < 500; f += 5) {
    if (!(reactanceL(f + 5, 0.2) > reactanceL(f, 0.2))) mono = false;
    if (!(reactanceC(f + 5, 50e-6) < reactanceC(f, 50e-6))) mono = false;
  }
  assert(G, 'X_L strictly rises and X_C strictly falls across 5–500 Hz', mono);

  // At double the frequency X_L doubles and X_C halves. Exactly.
  check(G, 'double f doubles X_L', reactanceL(100, 0.2) / reactanceL(50, 0.2), 2);
  check(G, 'double f halves X_C', reactanceC(100, 50e-6) / reactanceC(50, 50e-6), 0.5);
}

// ── 14 · Series LCR: impedance, phase, power factor ──────────────────────────
// R = 30 Ω, L = 0.2 H, C = 50 µF at f = 120 Hz.
//   ω = 2π × 120 = 753.9822368615503 rad/s
//   X_L = 753.9822368615503 × 0.2 = 150.79644737231006 Ω
//   X_C = 1/(753.9822368615503 × 5e-5) = 26.525823848649224 Ω
//   X = 124.27062352366084 Ω
//   Z = √(30² + X²) = √(900 + 15443.187...) = 127.84047...
//   cos φ = R/Z = 30/127.84047 = 0.2346706...
//   I₀ = 100/Z = 0.7822263... A
{
  const G = '14 · series LCR';
  const c = { R: 30, L: 0.2, C: 50e-6, V0: 100, f: 120 };
  const s = acState(c);

  const XL = 2 * Math.PI * 120 * 0.2;
  const XC = 1 / (2 * Math.PI * 120 * 50e-6);
  const X = XL - XC;
  const Z = Math.hypot(30, X);

  check(G, 'X_L = 150.796 Ω', s.XL, XL);
  check(G, 'X_C = 26.526 Ω', s.XC, XC);
  check(G, 'X = X_L − X_C = 124.271 Ω', s.X, X);
  check(G, 'Z = √(R² + X²) = 127.840 Ω', s.Z, Z);
  check(G, 'φ = atan2(X, R) in degrees', s.phaseDeg, Math.atan2(X, 30) * RAD);
  assert(G, 'and the circuit is INDUCTIVE above resonance (φ > 0)', s.phaseDeg > 0);

  // THE ARITHMETIC TRAP: adding the ohms gives 207.3, not 127.8.
  check(G, 'the wrong answer (R + X_L + X_C) would be 207.3 Ω', 30 + XL + XC, 30 + XL + XC);
  assert(G, 'the phasor answer is much SMALLER than the arithmetic one', s.Z < 30 + XL + XC);
  assert(G, 'and it can never be smaller than R', s.Z >= 30);

  check(G, 'POWER FACTOR cos φ = R/Z', s.powerFactor, 30 / Z);
  check(G, 'and it equals cos of the reported phase', s.powerFactor, Math.cos(s.phaseDeg * DEG), 1e-12);
  check(G, 'I₀ = V₀/Z', s.I0, 100 / Z);
  check(G, 'V_rms = V₀/√2', s.Vrms, 100 / Math.SQRT2);
  check(G, 'I_rms = I₀/√2', s.Irms, (100 / Z) / Math.SQRT2);
  check(G, 'real power = V_rms I_rms cos φ', s.avgPower, (100 / Math.SQRT2) * ((100 / Z) / Math.SQRT2) * (30 / Z));
  check(G, 'and it equals I_rms² R by a different route', s.avgPower, s.Irms * s.Irms * 30, 1e-12);
  check(G, 'apparent power = V_rms I_rms', s.apparentPower, (100 / Math.SQRT2) * ((100 / Z) / Math.SQRT2));
  assert(G, 'apparent power exceeds real power off resonance', s.apparentPower > s.avgPower);

  // Element voltages, and the phasor sum that must reproduce the supply.
  check(G, 'V_R = I₀R', s.VR, (100 / Z) * 30);
  check(G, 'V_L = I₀X_L', s.VL, (100 / Z) * XL);
  check(G, 'V_C = I₀X_C', s.VC, (100 / Z) * XC);
  check(G, 'PHASOR SUM of the three = the supply, exactly', phasorVoltageSum(s), 100, 1e-12);
  assert(G, 'while the ARITHMETIC sum does not', Math.abs(s.VR + s.VL + s.VC - 100) > 1);

  // cos φ = R/Z across a wide sweep of everything.
  let pfOk = 0;
  for (const R of [0, 5, 30, 120]) {
    for (const L of [0, 0.05, 0.2, 1]) {
      for (const C of [0, 5e-6, 50e-6, 500e-6]) {
        for (const f of [5, 50, 120, 400]) {
          const st = acState({ R, L, C, V0: 100, f });
          if (!Number.isFinite(st.Z) || st.Z === 0) { pfOk++; continue; }
          if (Math.abs(st.powerFactor - R / st.Z) <= 1e-12) pfOk++;
          else check(G, `cos φ = R/Z at R=${R} L=${L} C=${C} f=${f}`, st.powerFactor, R / st.Z, 1e-12);
        }
      }
    }
  }
  assert(G, `cos φ = R/Z in all ${pfOk} configurations`, pfOk === 256, `${pfOk} of 256`);
}

// ── 15 · The pure elements: 90° and exactly zero average power ────────────────
// Pure L, 0.2 H at 50 Hz: X_L = 62.83185307 Ω, Z = X_L, φ = +90°, cos φ = 0,
//   I₀ = 100/62.83185307 = 1.5915494309 A, average power EXACTLY zero.
// Pure C, 50 µF at 50 Hz: X_C = 63.66197724 Ω, φ = −90°, cos φ = 0, P = 0.
// Pure R, 30 Ω: φ = 0, cos φ = 1, P = V₀²/2R = 10000/60 = 166.6666667 W.
{
  const G = '15 · pure elements';

  const r = acState({ R: 30, L: 0, C: 0, V0: 100, f: 50 });
  check(G, 'pure R: X = 0', r.X, 0, 0);
  check(G, 'pure R: Z = R', r.Z, 30);
  check(G, 'pure R: φ = 0', r.phaseDeg, 0, 0);
  check(G, 'pure R: power factor = 1', r.powerFactor, 1);
  check(G, 'pure R: average power = V₀²/2R = 166.667 W', r.avgPower, 10000 / 60);
  check(G, 'pure R: and the quadrature agrees', averagePowerNumeric(r, 100), 10000 / 60, 1e-12);

  const l = acState({ R: 0, L: 0.2, C: 0, V0: 100, f: 50 });
  const XL = 2 * Math.PI * 50 * 0.2;
  check(G, 'pure L: Z = X_L = 62.832 Ω', l.Z, XL);
  check(G, 'pure L: φ = +90° exactly', l.phaseDeg, 90, 1e-13);
  check(G, 'pure L: power factor = 0 exactly', l.powerFactor, 0, 0);
  check(G, 'pure L: I₀ = 1.592 A', l.I0, 100 / XL);
  check(G, 'pure L: AVERAGE POWER IS ZERO (formula)', l.avgPower, 0, 0);
  check(G, 'pure L: AVERAGE POWER IS ZERO (quadrature over a full cycle)',
    averagePowerNumeric(l, 100), 0, 1e-12);
  // ⚠ SAMPLED AT T/8, NOT T/4. With φ = 90°, p(t) = −(V₀I₀/2) sin 2ωt, which is
  // ZERO at t = T/4 — the first draft of this check sampled there and read 0,
  // "proving" the instantaneous power vanishes too. It peaks at T/8.
  check(G, 'pure L: p(t) at T/8 is −V₀I₀/2, its most negative',
    instantaneous(l, 100, 1 / (8 * 50)).p, (-100 * l.I0) / 2, 1e-10);
  assert(G, 'pure L: so the instantaneous power is genuinely large, in BOTH signs',
    Math.abs(instantaneous(l, 100, 1 / (8 * 50)).p) > 50
    && instantaneous(l, 100, 3 / (8 * 50)).p > 50);

  const cap = acState({ R: 0, L: 0, C: 50e-6, V0: 100, f: 50 });
  const XC = 1 / (2 * Math.PI * 50 * 50e-6);
  check(G, 'pure C: Z = X_C = 63.662 Ω', cap.Z, XC);
  check(G, 'pure C: φ = −90° exactly', cap.phaseDeg, -90, 1e-13);
  check(G, 'pure C: power factor = 0 exactly', cap.powerFactor, 0, 0);
  check(G, 'pure C: I₀ = 1.571 A', cap.I0, 100 / XC);
  check(G, 'pure C: AVERAGE POWER IS ZERO (formula)', cap.avgPower, 0, 0);
  check(G, 'pure C: AVERAGE POWER IS ZERO (quadrature over a full cycle)',
    averagePowerNumeric(cap, 100), 0, 1e-12);
  assert(G, 'pure C: current LEADS while pure L LAGS', cap.phaseDeg < 0 && l.phaseDeg > 0);

  // A capacitor at DC blocks completely — and says so rather than returning NaN.
  const dc = acState({ R: 30, L: 0, C: 50e-6, V0: 100, f: 0 });
  assert(G, 'a capacitor at DC is reported as blocking', dc.blockedByCapacitor === true);
  check(G, 'a capacitor at DC passes exactly no current', dc.I0, 0, 0);
  check(G, 'a capacitor at DC dissipates nothing', dc.avgPower, 0, 0);

  // Zero average power for L and C at EVERY frequency, not just 50 Hz.
  let zeroP = 0;
  for (const f of [3, 17, 50, 60, 137, 400, 1000]) {
    for (const [label, cc] of [['L', { R: 0, L: 0.2, C: 0, V0: 100, f }], ['C', { R: 0, L: 0, C: 50e-6, V0: 100, f }]]) {
      const st = acState(cc);
      const num = averagePowerNumeric(st, 100);
      if (st.avgPower === 0 && Math.abs(num) < 1e-11) zeroP++;
      else check(G, `pure ${label} at ${f} Hz has zero average power`, num, 0, 1e-11);
    }
  }
  assert(G, `pure L and pure C dissipate nothing at all ${zeroP} frequencies`, zeroP === 14, `${zeroP} of 14`);

  // And the quadrature must agree with the formula wherever there IS power.
  let quadOk = 0;
  for (const R of [5, 30, 120]) {
    for (const L of [0, 0.05, 0.2]) {
      for (const C of [0, 50e-6, 500e-6]) {
        for (const f of [17, 50, 120, 400]) {
          const st = acState({ R, L, C, V0: 100, f });
          const num = averagePowerNumeric(st, 100);
          if (Math.abs(num - st.avgPower) <= 1e-9 * Math.max(1, st.avgPower)) quadOk++;
          else check(G, `quadrature = V_rms I_rms cos φ at R=${R} L=${L} C=${C} f=${f}`, num, st.avgPower, 1e-9);
        }
      }
    }
  }
  assert(G, `quadrature agrees with the formula in all ${quadOk} cases`, quadOk === 108, `${quadOk} of 108`);
}

// ── 16 · RMS is the root of the mean of the square ───────────────────────────
// For a sine of peak 100 V: cycle average = 0 exactly; mean of the square is
// V₀²/2 = 5000 V²; root of that = 70.71067811865476 V = 100/√2.
{
  const G = '16 · RMS';
  const w = 2 * Math.PI * 50;
  check(G, 'RMS of a 100 V peak sine, by quadrature', rmsNumeric(100, w), 100 / Math.SQRT2, 1e-12);
  check(G, 'RMS of 325 V peak is 230 V (the mains)', rmsNumeric(325, w), 325 / Math.SQRT2, 1e-12);
  check(G, 'RMS scales linearly with the peak', rmsNumeric(200, w) / rmsNumeric(100, w), 2, 1e-12);
  check(G, 'RMS does not depend on the frequency',
    rmsNumeric(100, 2 * Math.PI * 400), 100 / Math.SQRT2, 1e-12);

  // The cycle AVERAGE of the same wave is zero — the reason RMS exists.
  const s = acState({ R: 30, L: 0, C: 0, V0: 100, f: 50 });
  let mean = 0;
  const N = 2000;
  for (let k = 0; k < N; k++) mean += instantaneous(s, 100, (k / N) * (1 / 50)).v;
  check(G, 'the cycle average of the voltage is zero', mean / N, 0, 1e-11);
  assert(G, 'while the RMS is emphatically not', rmsNumeric(100, w) > 70);
}

// ── 17 · THE PHASOR IS THE WAVEFORM ──────────────────────────────────────────
// The claim the whole AC bench rests on. A phasor of length V₀ at angle ωt has
// vertical projection V₀ sin(ωt), which IS v(t). Checked to 1e-12 over a sweep
// of frequency, phase and time — 4 × 4 × 25 = 400 instants, two quantities each.
{
  const G = '17 · phasor = waveform';

  check(G, 'projection of a phasor is its y component',
    phasorProjection(7, 1.3), phasorAt(7, 1.3).y, 0);
  check(G, 'a phasor standing straight up projects to its full length',
    phasorProjection(7, Math.PI / 2), 7, 1e-15);
  check(G, 'a phasor lying flat projects to zero',
    phasorProjection(7, 0), 0, 0);

  let vOk = 0;
  let iOk = 0;
  for (const f of [7, 50, 120, 400]) {
    for (const [R, L, C] of [[30, 0, 0], [0, 0.2, 0], [0, 0, 50e-6], [30, 0.2, 50e-6]]) {
      const st = acState({ R, L, C, V0: 100, f });
      if (!Number.isFinite(st.Z)) continue;
      const T = 1 / f;
      for (let k = 0; k < 25; k++) {
        const t = (k / 25) * T;
        const { v, i } = instantaneous(st, 100, t);
        const ps = phasorSet(st, 100, t);
        if (Math.abs(ps.source.y - v) <= 1e-12) vOk++;
        else check(G, `source phasor projects to v(t) at f=${f} t=${t.toExponential(2)}`, ps.source.y, v, 1e-12);
        if (Math.abs(ps.current.y - i) <= 1e-12) iOk++;
        else check(G, `current phasor projects to i(t) at f=${f} t=${t.toExponential(2)}`, ps.current.y, i, 1e-12);
      }
    }
  }
  assert(G, `the source phasor reproduces v(t) at all ${vOk} instants (1e-12)`, vOk === 400, `${vOk} of 400`);
  assert(G, `the current phasor reproduces i(t) at all ${iOk} instants (1e-12)`, iOk === 400, `${iOk} of 400`);

  // The angle BETWEEN the two phasors is the phase, and it does not change as
  // they turn — which is why one number can describe it.
  const st = acState({ R: 30, L: 0.2, C: 50e-6, V0: 100, f: 120 });
  let fixed = 0;
  for (let k = 0; k < 30; k++) {
    const t = (k / 30) * (1 / 120);
    const ps = phasorSet(st, 100, t);
    const gap = (ps.voltageAngle - ps.currentAngle) * RAD;
    if (Math.abs(gap - st.phaseDeg) <= 1e-11) fixed++;
    else check(G, `phasor gap = φ at t = ${t.toExponential(2)}`, gap, st.phaseDeg, 1e-11);
  }
  assert(G, `the angle between the phasors stays at φ for all ${fixed} instants`, fixed === 30);

  // V_R is in phase with I; V_L leads it by 90°; V_C lags it by 90°.
  const ps0 = phasorSet(st, 100, 0.003);
  check(G, 'V_R phasor is along the current', ps0.vR.y, phasorProjection(st.VR, ps0.currentAngle), 1e-15);
  check(G, 'V_L phasor leads the current by 90°',
    ps0.vL.y, phasorProjection(st.VL, ps0.currentAngle + Math.PI / 2), 1e-15);
  check(G, 'V_C phasor lags the current by 90°',
    ps0.vC.y, phasorProjection(st.VC, ps0.currentAngle - Math.PI / 2), 1e-15);
  // Head-to-tail, the three element phasors close on the source.
  check(G, 'the three element phasors add (x) to the source', ps0.vR.x + ps0.vL.x + ps0.vC.x, ps0.source.x, 1e-11);
  check(G, 'the three element phasors add (y) to the source', ps0.vR.y + ps0.vL.y + ps0.vC.y, ps0.source.y, 1e-11);
}

// ── 18 · RESONANCE ───────────────────────────────────────────────────────────
// L = 0.2 H, C = 50 µF → ω₀ = 1/√(LC) = 1/√(1e-5) = 316.2277660168379 rad/s
//   f₀ = ω₀/2π = 50.32921210448704 Hz
// At f₀: X_L = X_C = ω₀L = 63.24555320336758 Ω, so X = 0 and Z = R = 30 Ω,
//   φ = 0, cos φ = 1, I₀ = 100/30 = 3.3333333 A.
//   V_L = V_C = 3.3333333 × 63.24555320 = 210.8185107 V — twice the supply.
//   Q = (1/R)√(L/C) = √4000/30 = 63.24555320/30 = 2.108185107
{
  const G = '18 · resonance';
  const L = 0.2;
  const C = 50e-6;
  const w0 = 1 / Math.sqrt(L * C);
  const f0 = w0 / (2 * Math.PI);

  check(G, 'ω₀ = 1/√(LC) = 316.228 rad/s', resonanceOmega(L, C), w0);
  check(G, 'f₀ = 1/(2π√(LC)) = 50.329 Hz', resonanceFrequency(L, C), f0);
  check(G, 'Q = (1/R)√(L/C) = 2.108', qualityFactor(30, L, C), Math.sqrt(L / C) / 30);
  check(G, 'bandwidth = R/(2πL)', bandwidth(30, L), 30 / (2 * Math.PI * L));

  const s = acState({ R: 30, L, C, V0: 100, f: f0 });
  check(G, 'AT RESONANCE X_L = X_C', s.XL - s.XC, 0, 1e-11);
  check(G, 'so the reactive part X is zero', s.X, 0, 1e-11);
  check(G, 'THE IMPEDANCE IS PURELY R', s.Z, 30, 1e-12);
  check(G, 'THE PHASE IS ZERO', s.phaseDeg, 0, 1e-11);
  check(G, 'the power factor is 1', s.powerFactor, 1, 1e-12);
  check(G, 'the current is V/R — its largest possible value', s.I0, 100 / 30, 1e-12);
  check(G, 'and all the power is real', s.avgPower, s.apparentPower, 1e-11);
  check(G, 'V_L = V_C at resonance', s.VL - s.VC, 0, 1e-10);
  check(G, 'V_L = 210.8 V from a 100 V supply', s.VL, (100 / 30) * Math.sqrt(L / C), 1e-10);
  check(G, 'and V_L/V₀ is exactly Q', s.VL / 100, qualityFactor(30, L, C), 1e-12);
  check(G, 'while the phasor sum is still only 100 V', phasorVoltageSum(s), 100, 1e-10);

  // The impedance really is a MINIMUM there — not a maximum, which is the
  // misconception. Scan a decade either side.
  let dips = true;
  for (const df of [-40, -20, -10, -5, -1, 1, 5, 10, 20, 40, 200]) {
    const off = acState({ R: 30, L, C, V0: 100, f: f0 + df });
    if (!(off.Z > s.Z - 1e-12)) dips = false;
    if (!(off.Irms < s.Irms + 1e-12)) dips = false;
  }
  assert(G, 'Z is a minimum and I a maximum at f₀, checked either side', dips);

  // Below resonance the circuit is capacitive (φ < 0); above it, inductive.
  assert(G, 'below f₀ the current LEADS (capacitive)',
    acState({ R: 30, L, C, V0: 100, f: f0 / 2 }).phaseDeg < 0);
  assert(G, 'above f₀ the current LAGS (inductive)',
    acState({ R: 30, L, C, V0: 100, f: f0 * 2 }).phaseDeg > 0);

  // f₀ does not depend on R at all — the sharpness does.
  for (const R of [2, 10, 30, 100]) {
    const st = acState({ R, L, C, V0: 100, f: f0 });
    check(G, `at f₀ with R = ${R} Ω the impedance is still exactly R`, st.Z, R, 1e-12);
    check(G, `and the phase is still zero with R = ${R} Ω`, st.phaseDeg, 0, 1e-11);
  }
  assert(G, 'a smaller R gives a sharper resonance (bigger Q)',
    qualityFactor(2, L, C) > qualityFactor(100, L, C));

  // f₀ over a table of L and C, against 1/(2π√(LC)) computed here.
  let f0Ok = 0;
  for (const l of [0.02, 0.05, 0.2, 0.5, 1]) {
    for (const c of [5e-6, 50e-6, 200e-6, 500e-6]) {
      const want = 1 / (2 * Math.PI * Math.sqrt(l * c));
      if (Math.abs(resonanceFrequency(l, c) - want) <= 1e-12 * want) f0Ok++;
      else check(G, `f₀ at L=${l}, C=${c}`, resonanceFrequency(l, c), want, 1e-12 * want);
      // and the state at that frequency must be purely resistive
      const st = acState({ R: 30, L: l, C: c, V0: 100, f: want });
      if (Math.abs(st.Z - 30) <= 1e-9) f0Ok++;
      else check(G, `Z = R at f₀ for L=${l}, C=${c}`, st.Z, 30, 1e-9);
    }
  }
  assert(G, `f₀ correct and purely resistive at all ${f0Ok} L/C pairs`, f0Ok === 40, `${f0Ok} of 40`);
}

// ── 19 · The frequency sweep, and the crossing ───────────────────────────────
{
  const G = '19 · sweep';
  const c = { R: 30, L: 0.2, C: 50e-6, V0: 100, f: 50 };
  const sweep = frequencySweep(c, 5, 500, 160);
  const f0 = resonanceFrequency(0.2, 50e-6);

  check(G, 'the sweep has 161 points', sweep.length, 161);
  check(G, 'it starts at f_min', sweep[0].f, 5, 1e-9);
  check(G, 'it ends at f_max', sweep[sweep.length - 1].f, 500, 1e-9);
  assert(G, 'every point carries a finite impedance', sweep.every((p) => Number.isFinite(p.Z)));
  assert(G, 'X_L rises monotonically across the sweep',
    sweep.every((p, i) => i === 0 || p.XL > sweep[i - 1].XL));
  assert(G, 'X_C falls monotonically across the sweep',
    sweep.every((p, i) => i === 0 || p.XC < sweep[i - 1].XC));

  // X_L − X_C changes sign exactly once, at f₀.
  const signs = sweep.map((p) => Math.sign(p.XL - p.XC));
  let flips = 0;
  for (let i = 1; i < signs.length; i++) if (signs[i] !== signs[i - 1]) flips++;
  check(G, 'X_L − X_C changes sign exactly once', flips, 1);

  // The minimum of Z on the sweep sits at the point nearest f₀.
  let iMin = 0;
  for (let i = 1; i < sweep.length; i++) if (sweep[i].Z < sweep[iMin].Z) iMin = i;
  assert(G, 'the impedance minimum lands within one sweep step of f₀',
    Math.abs(sweep[iMin].f - f0) < (sweep[iMin + 1].f - sweep[iMin].f) * 1.5,
    `min at ${sweep[iMin].f.toFixed(3)} Hz, f₀ = ${f0.toFixed(3)} Hz`);
  let iMax = 0;
  for (let i = 1; i < sweep.length; i++) if (sweep[i].Irms > sweep[iMax].Irms) iMax = i;
  check(G, 'and the current maximum is at the same point', iMax, iMin);

  // The RC gate: at the top of a 5 Hz → 2 kHz sweep the capacitor's own p.d. has
  // collapsed while the current is at its largest.
  // At 2000 Hz with C = 50 µF: X_C = 1/(2π × 2000 × 5e-5) = 1.5915494 Ω,
  //   Z = √(900 + 2.5333) = 30.042... so V_C/V₀ = 1.5915/30.042 = 0.05298.
  const gate = acState({ R: 30, L: 0, C: 50e-6, V0: 100, f: 2000 });
  check(G, 'RC gate at 2 kHz: X_C = 1.592 Ω', gate.XC, 1 / (2 * Math.PI * 2000 * 5e-5));
  assert(G, 'RC gate at 2 kHz: the capacitor drops under 6% of the supply', gate.VC / 100 < 0.06);
  const low = acState({ R: 30, L: 0, C: 50e-6, V0: 100, f: 5 });
  assert(G, 'RC gate at 5 Hz: the capacitor takes over 99% of it', low.VC / 100 > 0.99);
  assert(G, 'and the current at 2 kHz is far larger than at 5 Hz', gate.I0 > low.I0 * 10);
}

// ── 20 · LR TRANSIENTS ───────────────────────────────────────────────────────
// ε = 12 V, R = 4 Ω, L = 2 H → τ = L/R = 0.5 s, I_final = ε/R = 3 A.
//   At t = 0: I = 0 and V_L = 12 V (the WHOLE supply across the coil).
//   At t = τ: I = 3(1 − e⁻¹) = 3 × 0.6321205588285577 = 1.8963616764856731 A
//             V_L = 12 e⁻¹ = 4.414553294057308 V
//   At t = 5τ: 1 − e⁻⁵ = 0.9932620530009145 → I = 2.9797861590027435 A
//   Energy at the end: ½LI² = 0.5 × 2 × 9 = 9 J
{
  const G = '20 · LR transient';
  const s = { emf: 12, R: 4, L: 2 };

  check(G, 'τ = L/R = 0.5 s', timeConstantLR(s), 0.5);
  check(G, 'final current = ε/R = 3 A', finalCurrentLR(s), 3);

  const t0 = lrGrowth(s, 0);
  check(G, 'at t = 0 the current is exactly ZERO', t0.current, 0, 0);
  check(G, 'at t = 0 the WHOLE 12 V is across the coil', t0.vL, 12);
  check(G, 'at t = 0 there is no p.d. across the resistor', t0.vR, 0, 0);
  check(G, 'at t = 0 the slope is ε/L = 6 A/s', t0.dIdt, 6);

  const tau = lrGrowth(s, 0.5);
  check(G, 'AT t = τ THE CURRENT IS 63.2% OF FINAL', tau.fraction, 1 - Math.exp(-1), 1e-15);
  check(G, 'which is 1.8964 A', tau.current, 3 * (1 - Math.exp(-1)));
  check(G, 'V_L at t = τ is 12/e = 4.4146 V', tau.vL, 12 * Math.exp(-1));
  check(G, 'V_R + V_L = ε at t = τ', tau.vR + tau.vL, 12, 1e-12);

  check(G, 'at 5τ the current is 99.33% of final', lrGrowth(s, 2.5).fraction, 1 - Math.exp(-5));
  check(G, 'energy stored at 5τ', lrGrowth(s, 2.5).energy, 0.5 * 2 * (3 * (1 - Math.exp(-5))) ** 2);

  // V_R + V_L = ε at EVERY instant, and the 63.2% figure is universal.
  let kvl = 0;
  let sixtyThree = 0;
  for (const R of [1, 4, 10, 40]) {
    for (const L of [0.1, 2, 5]) {
      for (const emf of [2, 12, 24]) {
        const sp = { emf, R, L };
        const t = timeConstantLR(sp);
        if (Math.abs(lrGrowth(sp, t).fraction - (1 - Math.exp(-1))) <= 1e-15) sixtyThree++;
        else check(G, `63.2% at t = τ for R=${R} L=${L}`, lrGrowth(sp, t).fraction, 1 - Math.exp(-1), 1e-15);
        for (const k of [0, 0.3, 1, 2.2, 6]) {
          const sm = lrGrowth(sp, k * t);
          if (Math.abs(sm.vR + sm.vL - emf) <= 1e-12 * emf) kvl++;
          else check(G, `V_R + V_L = ε at ${k}τ, R=${R} L=${L}`, sm.vR + sm.vL, emf, 1e-12 * emf);
        }
      }
    }
  }
  assert(G, `the current is 63.2% of final at t = τ in all ${sixtyThree} circuits`, sixtyThree === 36);
  assert(G, `V_R + V_L = ε at all ${kvl} sampled instants`, kvl === 180, `${kvl} of 180`);

  // A bigger coil is slower and settles at the SAME final current.
  check(G, 'triple the inductance triples τ', timeConstantLR({ ...s, L: 6 }), 1.5);
  check(G, 'but the final current is unchanged', finalCurrentLR({ ...s, L: 6 }), 3);

  // Decay: I₀ e^{−t/τ}, and the coil has become the source (V_L opposite V_R).
  const d = lrDecay(s, 3, 0.5);
  check(G, 'decay: I after one τ is 3/e = 1.1036 A', d.current, 3 * Math.exp(-1));
  check(G, 'decay: V_L is the negative of V_R — the coil is now driving', d.vL, -d.vR);
  check(G, 'decay: at t = 0 the current is still I₀', lrDecay(s, 3, 0).current, 3);
  check(G, 'decay: after 5τ almost nothing is left', lrDecay(s, 3, 2.5).current, 3 * Math.exp(-5));
}

// ── 21 · LC OSCILLATION: ω = 1/√(LC), ENERGY EXACTLY CONSTANT ────────────────
// L = 0.5 H, C = 200 µF → LC = 1e-4, so ω₀ = 1/√(1e-4) = 100 rad/s EXACTLY,
//   f₀ = 100/2π = 15.915494309189535 Hz, T = 2π/100 = 0.06283185307179587 s.
// Charged to 10 V: q₀ = C V = 2e-3 C. U = q₀²/2C = 4e-6/4e-4 = 0.01 J = 10 mJ.
// Peak current = q₀ω₀ = 2e-3 × 100 = 0.2 A, and ½LI² = 0.5 × 0.5 × 0.04 = 10 mJ.
{
  const G = '21 · LC oscillation';
  const s = { L: 0.5, C: 200e-6, q0: 2e-3 };

  check(G, 'ω₀ = 1/√(LC) = 100 rad/s exactly', omegaLC(s), 100, 1e-12);
  check(G, 'f₀ = 15.915 Hz', freqLC(s), 100 / (2 * Math.PI), 1e-12);
  check(G, 'T = 2π√(LC) = 62.83 ms', periodLC(s), 2 * Math.PI / 100, 1e-14);

  const t0 = lcSample(s, 0);
  check(G, 'at t = 0 the charge is q₀', t0.charge, 2e-3);
  check(G, 'at t = 0 the current is exactly zero', t0.current, 0, 0);
  check(G, 'at t = 0 the voltage is 10 V', t0.voltage, 10);
  check(G, 'at t = 0 all 10 mJ is in the capacitor', t0.energyC, 0.01);
  check(G, 'and none in the inductor', t0.energyL, 0, 0);

  // A quarter period later: the capacitor is EMPTY and the current is at its
  // MAXIMUM. This is the misconception the archetype attacks.
  const T = 2 * Math.PI / 100;
  const q1 = lcSample(s, T / 4);
  check(G, 'a quarter cycle on: the capacitor is empty', q1.charge, 0, 1e-17);
  check(G, 'a quarter cycle on: THE CURRENT IS AT ITS MAXIMUM, 200 mA', q1.current, 0.2, 1e-15);
  check(G, 'a quarter cycle on: all 10 mJ is now in the inductor', q1.energyL, 0.01, 1e-15);
  check(G, 'and none in the capacitor', q1.energyC, 0, 1e-30);
  assert(G, 'so "the current stops when the capacitor empties" is false',
    Math.abs(q1.current) > Math.abs(t0.current));

  // Half a period on the capacitor is charged the OTHER way round.
  check(G, 'half a cycle on: charge is −q₀', lcSample(s, T / 2).charge, -2e-3, 1e-15);
  check(G, 'a full cycle on: back to q₀', lcSample(s, T).charge, 2e-3, 1e-15);

  // ENERGY CONSTANT to 1e-9 (in fact to 1e-17) across many cycles.
  let econst = 0;
  const N = 400;
  for (let k = 0; k <= N; k++) {
    const sm = lcSample(s, (k / N) * 5 * T);
    if (Math.abs(sm.energyTotal - 0.01) <= 1e-9) econst++;
    else check(G, `total energy at k=${k}`, sm.energyTotal, 0.01, 1e-9);
  }
  assert(G, `total energy is constant at all ${econst} samples over 5 cycles (1e-9)`, econst === N + 1);

  // ω₀ over a table of L and C.
  let wOk = 0;
  for (const L of [0.05, 0.5, 2, 5]) {
    for (const C of [10e-6, 200e-6, 1000e-6]) {
      const want = 1 / Math.sqrt(L * C);
      if (Math.abs(omegaLC({ L, C, q0: 1e-3 }) - want) <= 1e-9 * want) wOk++;
      else check(G, `ω₀ at L=${L}, C=${C}`, omegaLC({ L, C, q0: 1e-3 }), want, 1e-9 * want);
      // and the energy is conserved there too
      const u0 = (1e-3 * 1e-3) / (2 * C);
      const mid = lcSample({ L, C, q0: 1e-3 }, 0.37 / want);
      if (Math.abs(mid.energyTotal - u0) <= 1e-12 * u0) wOk++;
      else check(G, `energy conserved at L=${L}, C=${C}`, mid.energyTotal, u0, 1e-12 * u0);
    }
  }
  assert(G, `ω₀ and energy conservation hold at all ${wOk} L/C pairs`, wOk === 24, `${wOk} of 24`);

  // The LC frequency IS the resonant frequency of the AC bench. Same physics,
  // two chapters — and the two modules must agree.
  check(G, 'the LC frequency equals the AC bench resonance for the same L and C',
    freqLC(s), resonanceFrequency(0.5, 200e-6), 1e-12);
}

// ── 22 · LCR DAMPING ─────────────────────────────────────────────────────────
// L = 0.5 H, C = 200 µF → R_critical = 2√(L/C) = 2√2500 = 100 Ω EXACTLY.
//   R = 20 Ω  → α = R/2L = 20 s⁻¹, ω_d = √(10000 − 400) = √9600 = 97.97958971
//   R = 100 Ω → α = 100 = ω₀ → critically damped
//   R = 200 Ω → over-damped, and slower to settle than critical
{
  const G = '22 · LCR damping';
  const base = { L: 0.5, C: 200e-6, q0: 2e-3 };

  check(G, 'R_critical = 2√(L/C) = 100 Ω exactly', criticalResistance(base), 100, 1e-12);
  check(G, 'under-damped at 20 Ω', dampingOf({ ...base, R: 20 }), 'under');
  check(G, 'critically damped at exactly 100 Ω', dampingOf({ ...base, R: 100 }), 'critical');
  check(G, 'over-damped at 200 Ω', dampingOf({ ...base, R: 200 }), 'over');
  check(G, 'undamped (R = 0) is still under-damped', dampingOf({ ...base, R: 0 }), 'under');

  const u = lcrSample({ ...base, R: 20 }, 0);
  check(G, 'under-damped starts at q₀', u.charge, 2e-3);
  check(G, 'under-damped starts at rest', u.current, 0, 0);
  check(G, 'α = R/2L = 20 s⁻¹', u.alpha, 20);
  check(G, 'ω_d = √(ω₀² − α²) = 97.98 rad/s', lcrSample({ ...base, R: 20 }, 0.001).omegaD, Math.sqrt(10000 - 400));
  assert(G, 'and ω_d is slightly BELOW the undamped ω₀', Math.sqrt(10000 - 400) < 100);

  // Initial conditions hold in all three regimes.
  for (const R of [0, 20, 100, 200, 400]) {
    check(G, `q(0) = q₀ at R = ${R} Ω`, lcrSample({ ...base, R }, 0).charge, 2e-3);
    check(G, `i(0) = 0 at R = ${R} Ω`, lcrSample({ ...base, R }, 0).current, 0, 0);
  }

  // With R = 0 the LCR solution must BE the LC solution.
  let sameAsLC = 0;
  for (let k = 0; k <= 60; k++) {
    const t = (k / 60) * 0.2;
    const a = lcrSample({ ...base, R: 0 }, t);
    const b = lcSample(base, t);
    if (Math.abs(a.charge - b.charge) < 1e-15 && Math.abs(a.current - b.current) < 1e-13) sameAsLC++;
    else check(G, `R = 0 reduces to LC at t = ${t.toFixed(4)}`, a.charge, b.charge, 1e-15);
  }
  assert(G, `R = 0 reproduces the LC solution at all ${sameAsLC} samples`, sameAsLC === 61);

  // ENERGY: total falls monotonically for R > 0, and energyLost accounts for it.
  let mono = true;
  let ledger = 0;
  const u0 = (2e-3 * 2e-3) / (2 * 200e-6);
  let prev = Infinity;
  for (let k = 0; k <= 200; k++) {
    const sm = lcrSample({ ...base, R: 20 }, (k / 200) * 0.3);
    if (sm.energyTotal > prev + 1e-15) mono = false;
    prev = sm.energyTotal;
    if (Math.abs(sm.energyTotal + sm.energyLost - u0) <= 1e-15) ledger++;
    else check(G, `energy ledger closes at k=${k}`, sm.energyTotal + sm.energyLost, u0, 1e-15);
  }
  assert(G, 'total energy falls monotonically with resistance present', mono);
  assert(G, `stored + lost = initial at all ${ledger} samples`, ledger === 201);
  check(G, 'the initial energy is 10 mJ', u0, 0.01);

  // The under-damped branch must agree with the critical branch AT the boundary
  // — the limit ω_d → 0 is where a naive implementation divides by zero.
  // Tolerance 1e-6 RELATIVE, not 1e-9. The two branches are different closed
  // forms and agree only in the limit: at R = 100(1 − 1e-9) the damped frequency
  // is ω_d = 4.5e-3 rad/s, so cos(ω_d t) differs from 1 by ~(ω_d t)²/2 ≈ 1e-8 at
  // t = 0.03 s. A 1e-9 bar was measuring the smallness of ω_d, not continuity.
  let limitOk = 0;
  for (const t of [0.001, 0.005, 0.01, 0.03]) {
    const nearly = lcrSample({ ...base, R: 100 * (1 - 1e-9) }, t);
    const crit = lcrSample({ ...base, R: 100 }, t);
    const tol = 1e-6 * Math.abs(crit.charge || 1);
    if (Math.abs(nearly.charge - crit.charge) < tol) limitOk++;
    else check(G, `under-damped → critical limit at t = ${t}`, nearly.charge, crit.charge, tol);
  }
  assert(G, `the under-damped form tends to the critical one at all ${limitOk} times`, limitOk === 4);

  // Over-damped is SLOWER than critical — more damping is not faster.
  const tSettle = (R) => {
    const tr = lcrTrace({ ...base, R }, 1, 2000);
    const first = tr.find((p) => Math.abs(p.charge) < 0.01 * 2e-3);
    return first ? first.t : Infinity;
  };
  const tCrit = tSettle(100);
  const tOver = tSettle(400);
  assert(G, 'critical damping settles fastest; 4× the resistance is SLOWER',
    tOver > tCrit, `critical ${tCrit}s vs over-damped ${tOver}s`);
  assert(G, 'the critically-damped charge never crosses zero (no overshoot)',
    lcrTrace({ ...base, R: 100 }, 0.5, 500).every((p) => p.charge >= -1e-18));
  assert(G, 'while the under-damped charge does cross zero',
    lcrTrace({ ...base, R: 20 }, 0.5, 500).some((p) => p.charge < 0));
}

// ── 23 · TRANSFORMER ─────────────────────────────────────────────────────────
// 500 : 5000 turns → ratio 10. V_p = 230 V → V_s = 2300 V.
//   Load 4600 Ω → I_s = 2300/4600 = 0.5 A, P_s = 2300 × 0.5 = 1150 W.
//   Ideal: P_p = 1150 W → I_p = 1150/230 = 5 A EXACTLY.
//   So I_s/I_p = 0.5/5 = 0.1 = N_p/N_s, and V_p I_p = V_s I_s = 1150 W.
{
  const G = '23 · transformer';
  const t = { Np: 500, Ns: 5000, Vp: 230, load: 4600, efficiency: 1 };
  const s = transformerState(t);

  check(G, 'turns ratio = 10', turnsRatio(t), 10);
  check(G, 'V_s/V_p = N_s/N_p', s.Vs / t.Vp, t.Ns / t.Np);
  check(G, 'V_s = 2300 V', s.Vs, 2300);
  check(G, 'it is a step-up transformer', s.kind, 'step-up');
  check(G, 'I_s = V_s/R_load = 500 mA', s.Is, 0.5);
  check(G, 'I_p = 5 A', s.Ip, 5);
  check(G, 'I_s/I_p = N_p/N_s', s.Is / s.Ip, t.Np / t.Ns, 1e-12);
  check(G, 'secondary power = 1150 W', s.Ps, 1150);
  check(G, 'primary power = 1150 W', s.Pp, 1150);
  check(G, 'AN IDEAL TRANSFORMER CONSERVES POWER', s.Pp - s.Ps, 0, 1e-12);
  check(G, 'and loses nothing', s.lost, 0, 1e-12);
  check(G, 'V_p I_p = V_s I_s', t.Vp * s.Ip, s.Vs * s.Is, 1e-12);

  // Step-down, and the identity in the other direction.
  const down = transformerState({ Np: 5000, Ns: 500, Vp: 2300, load: 46, efficiency: 1 });
  check(G, 'step-down: V_s = 230 V', down.Vs, 230);
  check(G, 'step-down is named as such', down.kind, 'step-down');
  check(G, 'step-down conserves power too', down.Pp - down.Ps, 0, 1e-12);
  check(G, 'equal turns is an isolating transformer',
    transformerState({ Np: 500, Ns: 500, Vp: 230, load: 46, efficiency: 1 }).kind, 'isolating');

  // A REAL transformer: the primary draws MORE than the secondary delivers.
  // η = 0.9: P_p = 1150/0.9 = 1277.777... W, I_p = 1277.7778/230 = 5.5555556 A.
  const real = transformerState({ ...t, efficiency: 0.9 });
  check(G, 'at η = 0.9 the primary draws 1277.8 W', real.Pp, 1150 / 0.9);
  check(G, 'the secondary still delivers 1150 W', real.Ps, 1150);
  check(G, 'and 127.8 W is lost as heat', real.lost, 1150 / 0.9 - 1150);
  assert(G, 'the primary ALWAYS draws at least as much as the secondary delivers',
    real.Pp > real.Ps);
  check(G, 'the primary current rises to 5.556 A', real.Ip, (1150 / 0.9) / 230);

  // Power conservation across a sweep of turns, voltage and load.
  let conserve = 0;
  let ratioOk = 0;
  for (const Np of [100, 500, 2000]) {
    for (const Ns of [50, 500, 5000, 20000]) {
      for (const Vp of [12, 230, 400]) {
        for (const load of [1, 46, 4600]) {
          const st = transformerState({ Np, Ns, Vp, load, efficiency: 1 });
          if (Math.abs(st.Pp - st.Ps) <= 1e-9 * Math.max(1, st.Ps)) conserve++;
          else check(G, `power conserved at ${Np}:${Ns}, ${Vp} V, ${load} Ω`, st.Pp, st.Ps, 1e-9);
          if (Math.abs(st.Vs / Vp - Ns / Np) <= 1e-12) ratioOk++;
          else check(G, `V_s/V_p = N_s/N_p at ${Np}:${Ns}`, st.Vs / Vp, Ns / Np, 1e-12);
        }
      }
    }
  }
  assert(G, `an ideal transformer conserves power in all ${conserve} configurations`, conserve === 108);
  assert(G, `V_s/V_p = N_s/N_p in all ${ratioOk} configurations`, ratioOk === 108);

  // The load sets the secondary current, so doubling the load halves it — and
  // the primary current follows, which is the causality the archetype teaches.
  const heavier = transformerState({ ...t, load: 2300 });
  check(G, 'halving the load doubles I_s', heavier.Is, 1);
  check(G, 'and doubles I_p with it', heavier.Ip, 10);
  check(G, 'while V_s is unmoved by the load', heavier.Vs, 2300);
}

// ── 24 · TRANSMISSION: THE INVERSE SQUARE ────────────────────────────────────
// Deliver 100 kW down a 10 Ω line.
//   1 kV:   I = 100 000/1000 = 100 A → loss = 100² × 10 = 100 000 W (all of it)
//   10 kV:  I = 10 A  → loss = 1 000 W   (a hundredth)
//   100 kV: I = 1 A   → loss = 10 W      (another hundredth)
{
  const G = '24 · transmission';
  const demand = 100000;
  const R = 10;

  check(G, 'at 1 kV the line carries 100 A', lineCurrent(demand, 1000), 100);
  check(G, 'and wastes 100 kW — the entire demand', lineLoss(demand, 1000, R), 100000);
  check(G, 'at 10 kV the line carries 10 A', lineCurrent(demand, 10000), 10);
  check(G, 'and wastes 1 kW', lineLoss(demand, 10000, R), 1000);
  check(G, 'at 100 kV the line carries 1 A', lineCurrent(demand, 100000), 1);
  check(G, 'and wastes just 10 W', lineLoss(demand, 100000, R), 10);

  check(G, 'THE LOSS FALLS AS 1/V² — ten times the volts, a hundredth of the loss',
    lineLoss(demand, 10000, R) / lineLoss(demand, 1000, R), 0.01, 1e-12);
  check(G, 'and the scaling helper agrees', lossScaling(10), 0.01);
  check(G, 'twenty times the volts, 1/400 of the loss', lossScaling(20), 1 / 400);

  const s1 = transmissionState(demand, 1000, R);
  check(G, 'at 1 kV the station must send 200 kW to deliver 100 kW', s1.sent, 200000);
  check(G, 'efficiency 50%', s1.efficiency, 0.5);
  check(G, 'the line drop is 1000 V — the whole transmission voltage', s1.lineDrop, 1000);

  const s2 = transmissionState(demand, 10000, R);
  check(G, 'at 10 kV it sends 101 kW', s2.sent, 101000);
  check(G, 'efficiency 99.01%', s2.efficiency, 100000 / 101000);
  check(G, 'and the far end still gets exactly what it asked for', s2.delivered, demand);

  const s3 = transmissionState(demand, 100000, R);
  check(G, 'at 100 kV efficiency is 99.99%', s3.efficiency, 100000 / 100010);
  assert(G, 'raising the voltage strictly improves efficiency',
    s3.efficiency > s2.efficiency && s2.efficiency > s1.efficiency);

  // Thickening the cables only helps LINEARLY — the argument for voltage.
  check(G, 'halving the cable resistance only halves the loss',
    lineLoss(demand, 1000, 5) / lineLoss(demand, 1000, 10), 0.5);
  assert(G, 'so doubling the voltage beats halving the resistance',
    lineLoss(demand, 2000, 10) < lineLoss(demand, 1000, 5));

  // loss = I²R and loss = P²R/V² are the same number, over a sweep.
  let bothWays = 0;
  for (const V of [500, 1000, 5000, 11000, 33000, 132000, 400000]) {
    for (const r of [1, 10, 50]) {
      const a = lineLoss(demand, V, r);
      const b = (demand * demand * r) / (V * V);
      if (Math.abs(a - b) <= 1e-9 * Math.max(1, b)) bothWays++;
      else check(G, `I²R = P²R/V² at ${V} V, ${r} Ω`, a, b, 1e-9);
    }
  }
  assert(G, `I²R and P²R/V² agree at all ${bothWays} sweep points`, bothWays === 21);
}

// ── 25 · Archetype library integrity ─────────────────────────────────────────
{
  const G = '25 · EMI archetypes';
  const emiIds = Object.keys(EMI_ARCHETYPES);
  check(G, 'twelve EMI archetypes', emiIds.length, 12);
  check(G, 'and the order list covers every one', EMI_ARCHETYPE_ORDER.length, 12);
  assert(G, 'every ordered id exists', EMI_ARCHETYPE_ORDER.every((id) => !!EMI_ARCHETYPES[id]));
  assert(G, 'and every archetype is in the order list',
    emiIds.every((id) => EMI_ARCHETYPE_ORDER.includes(id)));
  assert(G, 'no EMI id collides with the existing field-bench library',
    emiIds.every((id) => !FIELD_SIBLINGS[id]),
    emiIds.filter((id) => FIELD_SIBLINGS[id]).join(', '));

  for (const id of EMI_ARCHETYPE_ORDER) {
    const a = EMI_ARCHETYPES[id];
    check(G, `${id}: id matches its key`, a.id, id);
    assert(G, `${id}: has a real summary`, (a.summary ?? '').length > 40);
    assert(G, `${id}: at least 2 params (the student can change something)`, (a.params ?? []).length >= 2);
    assert(G, `${id}: at least 3 guided beats`, (a.defaultSteps ?? []).length >= 3);
    const says = (a.defaultSteps ?? []).map((s) => s.say.trim());
    assert(G, `${id}: no empty guided step`, says.every((s) => s.length > 0));
    assert(G, `${id}: no duplicate guided step`, new Set(says).size === says.length);
    assert(G, `${id}: every step has a CTA`, (a.defaultSteps ?? []).every((s) => (s.cta ?? '').length > 0));
    assert(G, `${id}: has a routing view`, !!EMI_VIEW[id], 'missing from EMI_VIEW');
    // Law 2 — and it is checked as DELIVERY, not intent: the code must exist AND
    // resolve to a message and a hint in the engine's own exhaustive table.
    assert(G, `${id}: declares a misconception`, !!a.targets, 'no targets');
    assert(G, `${id}: targets "${a.targets}" resolves to real copy`,
      !!a.targets && !!FIELD_ISSUES[a.targets]
      && (FIELD_ISSUES[a.targets].message ?? '').length > 60
      && (FIELD_ISSUES[a.targets].hint ?? '').length > 60,
      'not a FieldMisconception with a full message and hint');
    // The scene builds purely, from its own defaults, without throwing.
    let scene = null;
    try { scene = a.build(defaults(a)); } catch (e) { /* reported below */ }
    assert(G, `${id}: build() returns a scene`, !!scene && Array.isArray(scene.sources));
    assert(G, `${id}: the scene is magnetic`, scene && scene.kind === 'magnetic');
    // ...and it is IDEMPOTENT: the same params twice give the same scene.
    if (scene) {
      assert(G, `${id}: build() is deterministic`,
        JSON.stringify(a.build(defaults(a))) === JSON.stringify(scene));
    }
  }

  // The seven EMI codes added to `FieldMisconception` must each be the declared
  // target of at least one rung. A code with copy and no `targets` is a card that
  // can never appear — the declared-but-dead defect, seen from the other side.
  const EMI_CODES = [
    'emf_from_flux_not_its_rate', 'flux_ignores_orientation',
    'induced_current_has_a_fixed_direction', 'inductor_opposes_current_not_change',
    'steady_current_induces_a_secondary_emf', 'eddy_currents_are_about_being_metal',
    'induced_effects_are_free_energy',
  ];
  const emiTargeted = new Set(Object.values(EMI_ARCHETYPES).map((a) => a.targets));
  for (const code of EMI_CODES) {
    assert(G, `EMI code ${code} exists in the engine table`, !!FIELD_ISSUES[code]);
    assert(G, `EMI code ${code} is some rung's declared target`, emiTargeted.has(code));
  }
  assert(G, 'and the EMI rungs use no code the engine has never heard of',
    [...emiTargeted].every((t) => !!FIELD_ISSUES[t]));
}

{
  const G = '26 · AC archetypes';
  const acIds = Object.keys(AC_ARCHETYPES);
  check(G, 'fifteen AC archetypes', acIds.length, 15);
  check(G, 'and the order list covers every one', AC_ARCHETYPE_ORDER.length, 15);
  assert(G, 'every ordered id exists', AC_ARCHETYPE_ORDER.every((id) => !!AC_ARCHETYPES[id]));
  assert(G, 'and every archetype is in the order list',
    acIds.every((id) => AC_ARCHETYPE_ORDER.includes(id)));
  assert(G, 'no AC id collides with the existing circuit-bench library',
    acIds.every((id) => !CIRCUIT_ARCHETYPES[id]),
    acIds.filter((id) => CIRCUIT_ARCHETYPES[id]).join(', '));

  for (const id of AC_ARCHETYPE_ORDER) {
    const a = AC_ARCHETYPES[id];
    check(G, `${id}: id matches its key`, a.id, id);
    assert(G, `${id}: has a real summary`, (a.summary ?? '').length > 40);
    assert(G, `${id}: at least 2 params`, (a.params ?? []).length >= 2);
    assert(G, `${id}: at least 3 guided beats`, (a.defaultSteps ?? []).length >= 3);
    const says = (a.defaultSteps ?? []).map((s) => s.say.trim());
    assert(G, `${id}: no empty guided step`, says.every((s) => s.length > 0));
    assert(G, `${id}: no duplicate guided step`, new Set(says).size === says.length);
    assert(G, `${id}: has a routing view`, !!AC_VIEW[id], 'missing from AC_VIEW');
    assert(G, `${id}: declares a misconception`, !!a.targets, 'no targets');
    assert(G, `${id}: targets "${a.targets}" resolves to real copy`,
      !!a.targets && !!CIRCUIT_ISSUES[a.targets]
      && (CIRCUIT_ISSUES[a.targets].message ?? '').length > 60
      && (CIRCUIT_ISSUES[a.targets].hint ?? '').length > 60,
      'not a CircuitMisconception with a full message and hint');
    let circuit = null;
    try { circuit = a.build(defaults(a)); } catch (e) { /* reported below */ }
    assert(G, `${id}: build() returns a netlist`,
      !!circuit && Array.isArray(circuit.nodes) && Array.isArray(circuit.components));
    if (circuit) {
      // Every component's endpoints must be declared nodes, or the frozen
      // CircuitCanvas would silently invent them.
      const ids = new Set(circuit.nodes.map((x) => x.id));
      assert(G, `${id}: every component endpoint is a declared node`,
        circuit.components.every((c) => ids.has(c.a) && ids.has(c.b)),
        circuit.components.filter((c) => !ids.has(c.a) || !ids.has(c.b)).map((c) => c.id).join(','));
      assert(G, `${id}: exactly one ground`, circuit.nodes.filter((x) => x.ground).length === 1);
      assert(G, `${id}: component ids are unique`,
        new Set(circuit.components.map((c) => c.id)).size === circuit.components.length);
      assert(G, `${id}: the probes name real nodes`,
        !a.probes || (ids.has(a.probes[0]) && ids.has(a.probes[1])),
        `${a.probes}`);
      assert(G, `${id}: build() is deterministic`,
        JSON.stringify(a.build(defaults(a))) === JSON.stringify(circuit));
    }
  }

  // The nine AC codes added to `CircuitMisconception`. Eight are some rung's
  // declared target; `element_voltages_add_arithmetically` is deliberately not,
  // because two rungs demonstrate it and neither is mainly about it — it is
  // raised as a SECONDARY card by PhasorBench and SweepBench instead, so it is
  // exempted here BY NAME rather than by loosening the rule for all nine.
  const AC_CODES = [
    'reactance_is_a_resistance', 'impedances_add_arithmetically',
    'reactive_element_dissipates_power', 'resonance_is_maximum_impedance',
    'rms_is_the_cycle_average', 'phasor_is_a_different_quantity',
    'lc_current_stops_when_capacitor_empties', 'transformer_creates_power',
  ];
  const acTargeted = new Set(Object.values(AC_ARCHETYPES).map((a) => a.targets));
  for (const code of AC_CODES) {
    assert(G, `AC code ${code} exists in the engine table`, !!CIRCUIT_ISSUES[code]);
    assert(G, `AC code ${code} is some rung's declared target`, acTargeted.has(code));
  }
  assert(G, 'element_voltages_add_arithmetically has copy (secondary card only)',
    !!CIRCUIT_ISSUES.element_voltages_add_arithmetically);
  assert(G, 'and the AC rungs use no code the engine has never heard of',
    [...acTargeted].every((t) => !!CIRCUIT_ISSUES[t]));
}

// ── 27 · The setups and the drawings agree with the physics ──────────────────
{
  const G = '27 · setup consistency';

  // The flux-machine archetype's own defaults must reproduce group 5's numbers.
  const fm = EMI_ARCHETYPES['flux-machine'];
  const setup = emiSetup('flux', defaults(fm));
  check(G, 'flux-machine setup: B = 1.2 T', setup.band.B, 1.2);
  check(G, 'flux-machine setup: band is 0.30 m wide', setup.band.x1 - setup.band.x0, 0.30);
  check(G, 'flux-machine setup: loop 0.15 × 0.10 m', setup.loop.w * setup.loop.h, 0.015);
  check(G, 'flux-machine setup: R = 0.20 Ω', setup.loop.resistance, 0.20);
  const st = machineState(setup.band, setup.loop, -0.15, setup.speed);
  check(G, 'and it gives the documented 60 mV', Math.abs(st.emf), 0.06);
  check(G, 'and the documented 18 mW, both ways', st.mechanicalPower, st.electricalPower, 1e-15);
  check(G, 'the loop starts OUTSIDE the band', placementOf(setup.band, setup.loop, setup.loopStartX), 'outside');
  assert(G, 'and the travel range reaches clear of both sides',
    placementOf(setup.band, setup.loop, setup.travel.min) === 'outside'
    && placementOf(setup.band, setup.loop, setup.travel.max) === 'outside');

  // The AC archetypes' own defaults must reproduce groups 14, 18, 20-24.
  const lcr = acSetup('phasor', defaults(AC_ARCHETYPES['series-lcr-phasor']));
  check(G, 'series-lcr-phasor setup: f = 120 Hz', lcr.circuit.f, 120);
  check(G, 'series-lcr-phasor setup: all three present',
    `${presentIn(lcr.elements).R}${presentIn(lcr.elements).L}${presentIn(lcr.elements).C}`, 'truetruetrue');
  check(G, 'and Z comes out at the documented 127.84 Ω', acState(lcr.circuit).Z,
    Math.hypot(30, 2 * Math.PI * 120 * 0.2 - 1 / (2 * Math.PI * 120 * 50e-6)));

  const pureL = acSetup('phasor', defaults(AC_ARCHETYPES['ac-inductor-only']));
  check(G, 'ac-inductor-only has NO resistor', pureL.circuit.R, 0, 0);
  check(G, 'and NO capacitor', pureL.circuit.C, 0, 0);
  check(G, 'so its average power is exactly zero', acState(pureL.circuit).avgPower, 0, 0);

  const pureC = acSetup('phasor', defaults(AC_ARCHETYPES['ac-capacitor-only']));
  check(G, 'ac-capacitor-only has no resistor', pureC.circuit.R, 0, 0);
  check(G, 'and its average power is exactly zero too', acState(pureC.circuit).avgPower, 0, 0);

  const lrSetup = acSetup('transient', defaults(AC_ARCHETYPES['lr-current-growth']));
  check(G, 'lr-current-growth setup: τ = 0.5 s', timeConstantLR(lrSetup.lr), 0.5);
  check(G, 'and the final current is 3 A', finalCurrentLR(lrSetup.lr), 3);

  const lcSetup = acSetup('transient', defaults(AC_ARCHETYPES['lc-oscillation']));
  check(G, 'lc-oscillation setup: ω₀ = 100 rad/s', omegaLC(lcSetup.lc), 100, 1e-12);
  check(G, 'and q₀ = 2 mC', lcSetup.lc.q0, 2e-3, 1e-18);

  const dampSetup = acSetup('transient', defaults(AC_ARCHETYPES['lcr-damping']));
  check(G, 'lcr-damping setup: R_critical = 100 Ω', criticalResistance(dampSetup.lcr), 100, 1e-12);
  check(G, 'and 20 Ω default is under-damped', dampingOf(dampSetup.lcr), 'under');

  const trSetup = acSetup('transformer', defaults(AC_ARCHETYPES['transformer-turns-ratio']));
  check(G, 'transformer setup gives I_p = 5 A', transformerState(trSetup.transformer).Ip, 5);

  const txSetup = acSetup('transmission', defaults(AC_ARCHETYPES['transmission-at-high-voltage']));
  check(G, 'transmission setup wastes 100 kW at 1 kV',
    transmissionState(txSetup.transmission.demand, txSetup.transmission.voltage, txSetup.transmission.resistance).loss,
    100000);

  // An empty / junk params bag must not produce NaN geometry anywhere.
  let clean = 0;
  for (const bag of [undefined, {}, { B: 'nonsense', R: null, elements: 'ZZZ', transient: 'nope' }]) {
    const e = emiSetup('flux', bag);
    const a = acSetup('phasor', bag);
    const ok = Number.isFinite(e.band.B) && Number.isFinite(e.loop.resistance)
      && Number.isFinite(a.circuit.R) && Number.isFinite(a.circuit.f)
      && Number.isFinite(machineState(e.band, e.loop, 0, 0.5).emf)
      && Number.isFinite(acState(a.circuit).Z);
    if (ok) clean++;
    else assert(G, `a junk params bag still yields finite physics: ${JSON.stringify(bag)}`, false);
  }
  assert(G, `all ${clean} junk/empty params bags fall back to finite defaults`, clean === 3);

  // The netlist builder must not drop an element the setup says is present.
  for (const el of ['R', 'L', 'C', 'RL', 'RC', 'LCR']) {
    const s = acSetup('phasor', { elements: el });
    const c = buildAcCircuit(s);
    const kinds = c.components.filter((x) => x.kind !== 'battery').map((x) => x.kind);
    const want = [
      presentIn(el).R ? 'resistor' : null,
      presentIn(el).L ? 'inductor' : null,
      presentIn(el).C ? 'capacitor' : null,
    ].filter(Boolean);
    check(G, `netlist for "${el}" holds exactly the right elements`, kinds.join(','), want.join(','));
  }
}

// ── 28 · Canvas fill — measured, not eyeballed ────────────────────────────────
// The two boards the layout actually produces. Desktop: the canvas column of a
// 1440 px window at the aspect the stage gives it. Phone: a 375 px stage whose
// content box after the sim shell's padding is 327, stacked to one column.
//
// A drawing that fills less than 55% on BOTH axes is lost in whitespace; more
// than 100% on either is being cropped. `fitView`'s default maxScale of 400 px/m
// would clamp this bench's ~900 px/m camera and silently draw everything at 44%
// of its proper size, which is why `emi/lib/view.ts` overrides it — and why this
// group exists to prove the override is in force.
{
  const G = '28 · canvas fill';
  const BOARDS = [
    { name: 'desktop 613×409', w: 613, h: 409 },
    { name: 'phone 327×250', w: 327, h: 250 },
  ];
  for (const id of EMI_ARCHETYPE_ORDER) {
    const view = EMI_VIEW[id];
    if (view === 'inductance' || view === 'generator') continue; // plot stages, not world stages
    const s = emiSetup(view, defaults(EMI_ARCHETYPES[id]));
    for (const b of BOARDS) {
      const f = emiContentFill(s, b.w, b.h);
      assert(G, `${id} / ${b.name}: not cropped`,
        f.fx <= 1.0001 && f.fy <= 1.0001,
        `content is ${(f.fx * 100).toFixed(0)}% × ${(f.fy * 100).toFixed(0)}%`);
      assert(G, `${id} / ${b.name}: not lost in whitespace`,
        Math.max(f.fx, f.fy) >= 0.55,
        `binding axis fills only ${(Math.max(f.fx, f.fy) * 100).toFixed(0)}%`);
      // THE CLAMP CHECK, done properly. An earlier draft asserted `scale > 400`
      // as a proxy for "maxScale is overridden" — which is invalid, because on a
      // 327 px board the geometrically CORRECT scale is 294 px/m and below the
      // ceiling anyway. The real test is that the achieved scale equals the scale
      // the geometry demands: if the default maxScale = 400 were still in force,
      // the desktop board's 900 px/m would be silently cut to 400 and this would
      // fail while the fill checks above stayed green.
      const fb = emiFrameBounds(s);
      const ideal = Math.min(
        (b.w * (1 - 2 * FIT_PAD)) / (fb.maxX - fb.minX),
        (b.h * (1 - 2 * FIT_PAD)) / (fb.maxY - fb.minY),
      );
      assert(G, `${id} / ${b.name}: the camera uses the scale the geometry demands`,
        Math.abs(f.scale - Math.round(ideal * 100) / 100) < 0.02,
        `scale ${f.scale.toFixed(2)} px/m, geometry wants ${ideal.toFixed(2)} — a clamp is biting`);
    }
  }
}

// ── 29 · Cross-checks: every claim by a SECOND, independent route ────────────
// The most valuable group in the file. A hand-picked expected value can be
// satisfied by a plausible-looking wrong model; an identity between two routes
// cannot. Nothing here has a written-down expected value — each case asserts
// that two different computations of the same physical quantity agree.
{
  const G = '29 · second routes';

  // (a) FARADAY ON THE SLIDING LOOP, by central difference of the flux.
  // `machineState` gets dΦ/dt from the analytic `dOverlapDx`. Here it is
  // recomputed as [Φ(x+h) − Φ(x−h)] / (2h) × v, which touches none of that code.
  // Corners are skipped because the derivative genuinely does not exist there.
  {
    const band = { x0: -0.15, x1: 0.15, B: 1.2 };
    const loop = { w: 0.15, h: 0.10, turns: 3, resistance: 0.4 };
    const corners = [-0.225, -0.075, 0.075, 0.225];
    const h = 1e-6;
    let ok = 0;
    for (const v of [-0.8, -0.2, 0.2, 0.8]) {
      for (let xc = -0.28; xc <= 0.28; xc += 0.007) {
        if (corners.some((c) => Math.abs(xc - c) < 1e-3)) continue;
        const fd = ((fluxOf(band, loop, xc + h) - fluxOf(band, loop, xc - h)) / (2 * h)) * v;
        const st = machineState(band, loop, xc, v);
        if (Math.abs(st.emf - -loop.turns * fd) <= 1e-6) ok++;
        else check(G, `emf = −N dΦ/dt at xc=${xc.toFixed(3)}, v=${v}`, st.emf, -loop.turns * fd, 1e-6);
      }
    }
    assert(G, `emf = −N dΦ/dt by finite difference at all ${ok} bench points`, ok >= 300, `only ${ok}`);
  }

  // (b) THE PHASOR TRIANGLE CLOSES, everywhere.
  // √(V_R² + (V_L − V_C)²) must be the supply amplitude, for every circuit at
  // every frequency — which is the same statement as Z = √(R² + X²), reached
  // through the three element voltages instead.
  {
    let ok = 0;
    for (const R of [1, 30, 90]) {
      for (const L of [0.02, 0.2, 0.8]) {
        for (const C of [5e-6, 50e-6, 400e-6]) {
          for (const f of [7, 25, 50, 120, 300, 900]) {
            const st = acState({ R, L, C, V0: 100, f });
            if (Math.abs(phasorVoltageSum(st) - 100) <= 1e-9) ok++;
            else check(G, `phasor triangle closes at R=${R} L=${L} C=${C} f=${f}`,
              phasorVoltageSum(st), 100, 1e-9);
          }
        }
      }
    }
    assert(G, `the phasor sum of the element voltages equals the supply in all ${ok} cases`,
      ok === 162, `${ok} of 162`);
  }

  // (c) AVERAGE POWER, THREE WAYS: V_rms I_rms cos φ, I_rms² R, and the integral
  // of v·i over a whole cycle. Only a resistor dissipates, so the third must
  // match the first two everywhere, including where they are zero.
  {
    let ok = 0;
    for (const R of [0, 8, 45]) {
      for (const L of [0, 0.15, 0.6]) {
        for (const C of [0, 30e-6, 300e-6]) {
          for (const f of [11, 50, 200]) {
            const st = acState({ R, L, C, V0: 100, f });
            if (!Number.isFinite(st.Z)) { ok++; continue; }
            const byFormula = st.avgPower;
            const byResistor = st.Irms * st.Irms * R;
            const byIntegral = averagePowerNumeric(st, 100);
            const tol = 1e-9 * Math.max(1, byFormula);
            if (Math.abs(byFormula - byResistor) <= tol && Math.abs(byFormula - byIntegral) <= 1e-8 * Math.max(1, byFormula)) ok++;
            else check(G, `three routes to average power at R=${R} L=${L} C=${C} f=${f}`,
              byIntegral, byResistor, 1e-8 * Math.max(1, byFormula));
          }
        }
      }
    }
    assert(G, `formula, I²R and the integral all agree in all ${ok} cases`, ok === 81, `${ok} of 81`);
  }

  // (d) THE EDDY DRAG COEFFICIENT, from the power instead of from the geometry.
  // `dragCoefficient` is built from B, the loop size and the loop resistance;
  // `eddyState().power / v²` comes from a current and a dissipation. Same number.
  {
    let ok = 0;
    for (const B of [0.15, 0.6, 1.4]) {
      for (const slots of [1, 2, 4, 7]) {
        for (const thickness of [0.0008, 0.002, 0.005]) {
          for (const material of ['copper', 'aluminium', 'stainless']) {
            const p = {
              height: 0.10, width: 0.12, thickness,
              resistivity: RESISTIVITY[material], mass: 0.06, slots,
            };
            for (const v of [0.05, 0.7]) {
              const fromPower = eddyState(p, B, v).power / (v * v);
              const fromGeometry = dragCoefficient(p, B);
              if (Math.abs(fromPower - fromGeometry) <= 1e-9 * fromGeometry) ok++;
              else check(G, `drag coefficient two ways, B=${B} slots=${slots} t=${thickness} ${material}`,
                fromPower, fromGeometry, 1e-9 * fromGeometry);
            }
          }
        }
      }
    }
    assert(G, `the eddy drag coefficient agrees from power and from geometry in all ${ok} cases`,
      ok === 216, `${ok} of 216`);
  }

  // (e) MOTIONAL EMF AGAINST THE GENERAL LOOP MODEL, across a sweep.
  // A rod on rails is the k = +1 case of the flux machine with h = ℓ. Two models
  // written independently; if they ever disagree, one of them is wrong.
  {
    let ok = 0;
    for (const B of [0.3, 0.8, 1.6]) {
      for (const len of [0.1, 0.25, 0.45]) {
        for (const R of [0.2, 1, 4]) {
          for (const v of [0.4, 1.5, 3.2]) {
            const rod = { length: len, B, resistance: R, mass: 0.05 };
            const rs = rodState(rod, v);
            // A band far wider than the loop, with the loop straddling its left
            // edge, is exactly the entering case.
            const st = machineState({ x0: -10, x1: 10, B },
              { w: 4, h: len, turns: 1, resistance: R }, -11, v);
            if (Math.abs(Math.abs(st.emf) - Math.abs(rs.emf)) <= 1e-12
              && Math.abs(st.electricalPower - rs.electricalPower) <= 1e-12) ok++;
            else check(G, `rod and loop agree at B=${B} ℓ=${len} R=${R} v=${v}`,
              Math.abs(st.emf), Math.abs(rs.emf), 1e-12);
          }
        }
      }
    }
    assert(G, `the rod model and the loop model agree in all ${ok} configurations`,
      ok === 81, `${ok} of 81`);
  }

  // (f) THE INDUCTOR'S BACK-EMF, by finite difference of the ramp's own current.
  // `rampSample` reports dI/dt analytically; here it is recomputed from the
  // current the same function reports, away from the corners where the slope
  // genuinely jumps.
  {
    const L = (MU0 * 800 * 800 * 8e-4) / 0.15;
    const ramp = { peak: 2, rampUp: 0.02, hold: 0.03, rampDown: 0.02 };
    const h = 1e-7;
    let ok = 0;
    for (let t = 0.001; t < 0.069; t += 0.001) {
      const nearCorner = [0.02, 0.05, 0.07].some((c) => Math.abs(t - c) < 1e-4);
      if (nearCorner) continue;
      const fd = (rampSample(ramp, L, t + h).current - rampSample(ramp, L, t - h).current) / (2 * h);
      const want = -L * fd;
      if (Math.abs(rampSample(ramp, L, t).emf - want) <= 1e-7) ok++;
      else check(G, `ε = −L dI/dt at t=${t.toFixed(3)}`, rampSample(ramp, L, t).emf, want, 1e-7);
    }
    assert(G, `ε = −L dI/dt by finite difference at all ${ok} sampled instants`, ok >= 60, `only ${ok}`);
  }

  // (g) LR: the coil's stored energy from ½LI², against the running integral of
  // V_L·I. Two completely different statements about the same joules.
  {
    const sp = { emf: 12, R: 4, L: 2 };
    let ok = 0;
    for (const tEnd of [0.1, 0.5, 1.2, 2.5]) {
      const N = 20000;
      let integral = 0;
      for (let k = 0; k < N; k++) {
        const t = (tEnd * (k + 0.5)) / N;
        const q = lrGrowth(sp, t);
        integral += q.vL * q.current * (tEnd / N);
      }
      const stored = lrGrowth(sp, tEnd).energy;
      if (Math.abs(integral - stored) <= 1e-6 * Math.max(stored, 1e-9)) ok++;
      else check(G, `∫V_L·I dt equals ½LI² by t=${tEnd}`, integral, stored, 1e-6 * Math.max(stored, 1e-9));
    }
    assert(G, `the coil's stored energy equals the work put into it, at all ${ok} times`, ok === 4);
    // And in the limit: ½L(ε/R)² = 0.5 × 2 × 9 = 9 J.
    check(G, 'the final stored energy is 9 J', lrGrowth(sp, 40).energy, 9, 1e-9);
  }

  // (h) TRANSFORMER: the efficiency really is applied to the primary.
  // P_p × η must be P_s for every η — the direction of the loss, checked rather
  // than assumed, because applying it to the secondary instead gives the same
  // ratio and the wrong story about where the heat is.
  {
    let ok = 0;
    for (const eta of [0.5, 0.72, 0.9, 0.97, 1]) {
      for (const Np of [200, 1000]) {
        for (const Ns of [100, 1000, 8000]) {
          const st = transformerState({ Np, Ns, Vp: 230, load: 500, efficiency: eta });
          if (Math.abs(st.Pp * eta - st.Ps) <= 1e-9 * Math.max(1, st.Ps)
            && st.Pp >= st.Ps - 1e-12) ok++;
          else check(G, `P_p × η = P_s at η=${eta}, ${Np}:${Ns}`, st.Pp * eta, st.Ps, 1e-9);
        }
      }
    }
    assert(G, `the loss is charged to the primary in all ${ok} cases`, ok === 30, `${ok} of 30`);
  }

  // (i) TRANSMISSION: sent − delivered must be exactly the loss, everywhere.
  {
    let ok = 0;
    for (const P of [1000, 100000, 5e6]) {
      for (const V of [400, 3300, 11000, 132000]) {
        for (const R of [0.5, 10, 60]) {
          const st = transmissionState(P, V, R);
          if (Math.abs((st.sent - st.delivered) - st.loss) <= 1e-9 * Math.max(1, st.loss)
            && Math.abs(st.loss - lineLoss(P, V, R)) <= 1e-9 * Math.max(1, st.loss)) ok++;
          else check(G, `sent − delivered = loss at P=${P} V=${V} R=${R}`,
            st.sent - st.delivered, st.loss, 1e-9);
        }
      }
    }
    assert(G, `the transmission ledger closes in all ${ok} cases`, ok === 36, `${ok} of 36`);
  }
}

// ── 30 · Tables that would fail silently if they drifted ─────────────────────
{
  const G = '30 · tables';

  // `presentIn` decides which elements are in the loop; getting one wrong would
  // give a pure-inductor rung a hidden resistor and a non-zero average power.
  const want = {
    R: [true, false, false], L: [false, true, false], C: [false, false, true],
    RL: [true, true, false], RC: [true, false, true], LCR: [true, true, true],
  };
  for (const [key, exp] of Object.entries(want)) {
    const got = presentIn(key);
    check(G, `presentIn("${key}") R`, got.R, exp[0]);
    check(G, `presentIn("${key}") L`, got.L, exp[1]);
    check(G, `presentIn("${key}") C`, got.C, exp[2]);
  }

  // The inverse-square scaling helper, against arithmetic done here.
  for (const k of [1, 2, 3, 10, 20, 100]) {
    check(G, `lossScaling(${k}) = 1/${k}²`, lossScaling(k), 1 / (k * k));
  }

  // The Lenz sentence must name the right sense in all four edge/direction
  // combinations, and must never claim a current when there is none.
  {
    const band = { x0: -0.15, x1: 0.15, B: 1.2 };
    const loop = { w: 0.15, h: 0.10, turns: 1, resistance: 0.20 };
    const cases = [
      ['entering rightwards', -0.15, 0.5, 'clockwise'],
      ['exiting rightwards', 0.15, 0.5, 'counter-clockwise'],
      ['entering edge leftwards', -0.15, -0.5, 'counter-clockwise'],
      ['exiting edge leftwards', 0.15, -0.5, 'clockwise'],
    ];
    for (const [label, xc, v, word] of cases) {
      const sentence = lenzSentence(machineState(band, loop, xc, v));
      // 'clockwise' is a substring of 'counter-clockwise', so the negative case
      // has to be tested too or the check passes on the wrong answer.
      const saysCounter = /counter-clockwise/.test(sentence);
      assert(G, `Lenz sentence says ${word} — ${label}`,
        word === 'counter-clockwise' ? saysCounter : (!saysCounter && /clockwise/.test(sentence)),
        sentence.slice(0, 70));
    }
    for (const xc of [0, -0.30, 0.30]) {
      const sentence = lenzSentence(machineState(band, loop, xc, xc === 0 ? 0.5 : 0.5));
      assert(G, `no current claimed at xc=${xc}`, !/clockwise/.test(sentence), sentence.slice(0, 60));
    }
  }

  // EVERY code in both engine tables — the nine DC and the nine AC, the nine
  // field and the seven EMI — must name itself and carry a full message AND hint.
  // A card with an empty hint renders as a heading and half a thought, and the
  // exhaustive `Record` catches a MISSING entry but not a thin one.
  for (const [code, issue] of Object.entries(FIELD_ISSUES)) {
    check(G, `field code ${code} names itself`, issue.code, code);
    assert(G, `field code ${code} has a real message`, (issue.message ?? '').length > 60);
    assert(G, `field code ${code} has a real hint`, (issue.hint ?? '').length > 60);
  }
  for (const [code, issue] of Object.entries(CIRCUIT_ISSUES)) {
    check(G, `circuit code ${code} names itself`, issue.code, code);
    assert(G, `circuit code ${code} has a real message`, (issue.message ?? '').length > 60);
    assert(G, `circuit code ${code} has a real hint`, (issue.hint ?? '').length > 60);
  }
  // Assert THIS unit's 16 codes are present and have copy — never a total count.
  // The original assertions pinned 18 and 16, and broke the moment Unit 13 added
  // its nuclear and semiconductor codes to the same two unions. A count is a
  // measure of the whole program, so it cannot belong to one unit's verifier; the
  // exhaustive `Record<Misconception, Issue>` guard already makes a code without
  // copy a compile error, which is the property that actually matters.
  const AC_CODES = [
    'reactance_is_a_resistance', 'impedances_add_arithmetically',
    'element_voltages_add_arithmetically', 'reactive_element_dissipates_power',
    'resonance_is_maximum_impedance', 'rms_is_the_cycle_average',
    'phasor_is_a_different_quantity', 'lc_current_stops_when_capacitor_empties',
    'transformer_creates_power',
  ];
  const EMI_CODES = [
    'emf_from_flux_not_its_rate', 'flux_ignores_orientation',
    'induced_current_has_a_fixed_direction', 'inductor_opposes_current_not_change',
    'steady_current_induces_a_secondary_emf', 'eddy_currents_are_about_being_metal',
    'induced_effects_are_free_energy',
  ];
  for (const c of AC_CODES) {
    assert(G, `circuit vocabulary carries ${c}`, !!CIRCUIT_ISSUES[c]);
  }
  for (const c of EMI_CODES) {
    assert(G, `field vocabulary carries ${c}`, !!FIELD_ISSUES[c]);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

const W1 = Math.max(...results.map((r) => r.group.length), 5);
const W2 = Math.min(96, Math.max(...results.map((r) => r.name.length), 5));
const W3 = Math.min(28, Math.max(...results.map((r) => r.actual.length), 6));

let lastGroup = '';
console.log('');
console.log('  Unit 11 — Magnetism, EMI and AC — physics verification');
console.log('  ' + '─'.repeat(W1 + W2 + W3 + 26));
console.log(`  ${'GROUP'.padEnd(W1)}  ${'CHECK'.padEnd(W2)}  ${'GOT'.padEnd(W3)}  EXPECTED`);
console.log('  ' + '─'.repeat(W1 + W2 + W3 + 26));
for (const r of results) {
  const group = r.group === lastGroup ? '' : r.group;
  if (group && lastGroup) console.log('');
  lastGroup = r.group;
  console.log(
    `  ${group.padEnd(W1)}  ${r.name.slice(0, W2).padEnd(W2)}  ${r.actual.slice(0, W3).padEnd(W3)}  `
    + `${String(r.expected).slice(0, 14).padEnd(14)}  ${r.ok ? 'PASS' : 'FAIL'}`,
  );
}
console.log('  ' + '─'.repeat(W1 + W2 + W3 + 26));
console.log(`  ${results.length - failures}/${results.length} passed${failures ? `, ${failures} FAILED` : ''}`);
console.log('');

process.exit(failures ? 1 : 0);
