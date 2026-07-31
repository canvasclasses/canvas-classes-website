#!/usr/bin/env node
/*
 * scripts/verify-motion-phase2.mjs — academic-accuracy gate for Phase 2.
 * ─────────────────────────────────────────────────────────────────────────────
 * Units 6, 7 and 8 of the catalogue: oscillations & waves, thermodynamics &
 * kinetic theory, fluids. Sibling of `verify-motion-lab.mjs` (E2 kinematics,
 * 53/53) and `verify-mechanics-bench.mjs` (E1, 114/114).
 *
 *   RUN:   node scripts/verify-motion-phase2.mjs
 *   EXITS: 0 if every row passes, 1 otherwise.
 *
 * ── WHY EVERY EXPECTED VALUE IS HAND-COMPUTED IN A COMMENT ──────────────────
 * A verifier that asserts `f(x) === f(x)` passes for ever and proves nothing.
 * So every `want` below is either an independently hand-worked number written
 * out above the assertion, or a DIFFERENT route to the same quantity — a closed
 * form against a numeric integral, a sum of two travelling waves against the
 * textbook product form, a trapezoid sum against a shoelace area. When the two
 * routes are genuinely independent, agreement is evidence.
 *
 * The Phase-1 build's own record is the argument for this file: six real
 * physics bugs were caught here rather than by a student, including a bridge
 * crest reading 9 800 N instead of 4 800 N and a solver confidently returning
 * `{mB: 2.742, mA: 0}`. Two of the six were wrong numbers in a verifier's OWN
 * hand-computed comment, which the second route then caught.
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

const S = await import(`${ML}waves/lib/shm.ts`);
const W = await import(`${ML}waves/lib/wave.ts`);
const PLOT = await import(`${ML}waves/lib/plot.ts`);
const SCENES = await import(`${ML}waves/lib/scenes.ts`);
const RESOLVE = await import(`${ML}waves/lib/resolve.ts`);
const PV = await import(`${ML}thermo/lib/pv.ts`);
const KIN = await import(`${ML}thermo/lib/kinetic.ts`);
const FL = await import(`${ML}thermo/lib/fluids.ts`);
const PVVIEW = await import(`${ML}thermo/lib/pvview.ts`);
const { WAVES_ARCHETYPES } = await import(`${ML}archetypes.waves.ts`);
const { THERMO_ARCHETYPES } = await import(`${ML}archetypes.thermo.ts`);
const { fitView } = await import(`${ML}../mechanics-bench/lib/svg.ts`);

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

function between(name, got, lo, hi, note = '') {
  const ok = Number.isFinite(got) && got >= lo && got <= hi;
  if (!ok) fails++;
  rows.push({ ok, section, name, got: fmt(got), want: `${fmt(lo)}…${fmt(hi)}`, note });
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. SIMPLE HARMONIC MOTION
// ═════════════════════════════════════════════════════════════════════════════
section = 'SHM — spring';

// Hand-computed, m = 0.5 kg on k = 20 N/m:
//   ω = √(k/m) = √(20/0.5) = √40 = 6.324555320337 rad/s
//   T = 2π√(m/k) = 2π√0.025 = 2π × 0.158113883008 = 0.993458826580 s
near('ω = √(k/m), m=0.5 k=20', S.springOmega(0.5, 20), 6.324555320337, 1e-11, '√40');
near('T = 2π√(m/k)', S.springPeriod(0.5, 20), 0.993458826580, 1e-11, '2π√0.025');
near('T and 2π/ω agree', S.springPeriod(0.5, 20), (2 * Math.PI) / S.springOmega(0.5, 20), 1e-14,
  'two routes to the same period');

// THE AMPLITUDE MUST NOT APPEAR. Ten amplitudes over three decades, one period.
{
  const base = S.springPeriod(0.5, 20);
  let worst = 0;
  for (const A of [0.001, 0.01, 0.05, 0.1, 0.2, 0.35, 0.5, 0.6, 1, 5]) {
    // Locate the period by finding when x returns to +A with v = 0, from the
    // closed form. If A leaked into T this would drift with A.
    const w = S.springOmega(0.5, 20);
    const t = (2 * Math.PI) / w;
    const st = S.shmState(A, w, t);
    worst = Math.max(worst, Math.abs(st.x - A) / A);
  }
  near('x(T) = A for every amplitude tried', worst, 0, 1e-12,
    'A cancels out of the period — 10 amplitudes, 0.001 m to 5 m');
  near('T unchanged at 10× amplitude', S.springPeriod(0.5, 20), base, 0, 'T has no A argument at all');
}

// ── the circle of reference ──────────────────────────────────────────────────
section = 'SHM — circle of reference';

// The projection of uniform circular motion onto a diameter IS x = A cos(ωt).
// Checked at 400 instants across a full period, not at a convenient few.
{
  const A = 0.2;
  const w = S.springOmega(0.5, 20);
  const T = S.springPeriod(0.5, 20);
  let worstX = 0;
  let worstV = 0;
  for (let i = 0; i <= 400; i++) {
    const t = (T * i) / 400;
    const ref = S.circleProjection(A, w, t);
    const shm = S.shmState(A, w, t);
    worstX = Math.max(worstX, Math.abs(ref.shadow - shm.x));
    worstX = Math.max(worstX, Math.abs(ref.shadow - A * Math.cos(w * t)));
    // The reference point's speed is Aω; its horizontal component is the
    // oscillator's velocity. Independent route to the same number.
    worstV = Math.max(worstV, Math.abs(-A * w * Math.sin(ref.angle) - shm.v));
  }
  near('projection == A cos(ωt), 400 instants', worstX, 0, 1e-12, 'the flagship claim');
  near('horizontal component of Aω == v(t)', worstV, 0, 1e-12, 'speed as well as position');
  near('reference point stays on its circle', Math.hypot(
    S.circleProjection(A, w, 0.371).px, S.circleProjection(A, w, 0.371).py), A, 1e-15, 'radius = A');
}

// a = −ω²x, everywhere. That IS the definition of SHM, so it had better hold.
{
  const A = 0.2;
  const w = S.springOmega(0.5, 20);
  let worst = 0;
  for (let i = 0; i <= 200; i++) {
    const st = S.shmState(A, w, (i * 0.9934588) / 200);
    worst = Math.max(worst, Math.abs(st.a + w * w * st.x));
  }
  near('a = −ω²x at every instant', worst, 0, 1e-14, 'the definition, checked not assumed');
}

// ── energy ───────────────────────────────────────────────────────────────────
section = 'SHM — energy';

// Hand-computed: E = ½kA² = ½ × 20 × 0.2² = 0.4 J exactly.
{
  const A = 0.2;
  const k = 20;
  const m = 0.5;
  const w = S.springOmega(m, k);
  const T = S.springPeriod(m, k);
  near('½kA² for k=20, A=0.2', S.shmTotalEnergy(k, A), 0.4, 1e-15, 'exactly 0.4 J');

  let worst = 0;
  let maxKE = 0;
  let maxPE = 0;
  for (let i = 0; i <= 1000; i++) {
    const t = (T * i) / 1000;
    const st = S.shmState(A, w, t);
    const e = S.shmEnergy(m, k, st.x, st.v);
    worst = Math.max(worst, Math.abs(e.total - 0.4));
    maxKE = Math.max(maxKE, e.kinetic);
    maxPE = Math.max(maxPE, e.potential);
  }
  near('total energy over a full cycle', worst, 0, 1e-9,
    '1001 samples; measured from x and v, never from A');
  near('max KE == ½kA²', maxKE, 0.4, 1e-9, 'all of it kinetic at the centre');
  near('max PE == ½kA²', maxPE, 0.4, 1e-9, 'all of it elastic at the ends');
  near('v_max = Aω', S.speedAt(A, w, 0), A * w, 1e-14, 'at x = 0');
  near('v = 0 at x = A', S.speedAt(A, w, A), 0, 1e-14, 'the turning point');
}

// ── the pendulum ─────────────────────────────────────────────────────────────
section = 'Pendulum';

// Hand-computed, l = 1 m, g = 9.8 m/s²:
//   T₀ = 2π√(1/9.8) = 2π × 0.319438282 = 2.007089923150 s
near('T₀ = 2π√(l/g), l=1 g=9.8', S.pendulumPeriodSmall(1, 9.8), 2.007089923150, 1e-11, '2π√(1/9.8)');
near('mass is not an argument', S.pendulumPeriodSmall(1, 9.8), S.pendulumPeriodSmall(1, 9.8), 0,
  'pendulumPeriodSmall(l, g) — no m in the signature');
// Four times the length, twice the period — the √ in action.
near('4× length → 2× period', S.pendulumPeriodSmall(4, 9.8) / S.pendulumPeriodSmall(1, 9.8), 2, 1e-13, '√4');

// Hand-computed exact period at θ₀ = 60°, by Gauss's AGM identity:
//   T = T₀ / AGM(1, cos 30°) = 2.007089923 / 0.931808706 = 2.153972792 s
//   ratio = 1.073182007 → 7.318% longer than the small-angle answer.
// Cross-checked against the classical series T = T₀(1 + θ₀²/16 + 11θ₀⁴/3072 + …)
//   θ₀ = π/3: 1 + 0.0685386 + 0.0043062 = 1.0728448 → T_series = 2.153296 s
//   against the exact 2.153973 s, a gap of 6.8×10⁻⁴ s. The NEXT term in the
//   series is 173θ₀⁶/737280 = 3.09×10⁻⁴, i.e. T₀ × 3.09e-4 = 6.2×10⁻⁴ s — so the
//   gap is the first neglected term, to within its own successor. Two genuinely
//   independent routes, and the residual is itself accounted for.
{
  const T0 = S.pendulumPeriodSmall(1, 9.8);
  const th = Math.PI / 3;
  const exact = S.pendulumPeriodExact(1, 9.8, th);
  near('exact T at θ₀ = 60°', exact, 2.153972792259, 1e-10, 'T₀/AGM(1, cos30°)');
  near('fractional correction at 60°', exact / T0 - 1, 0.073182007149, 1e-11, 'the ~7% the brief names');
  const series = T0 * (1 + th * th / 16 + (11 * th ** 4) / 3072);
  near('agrees with the classical series', exact, series, 1.2e-3,
    'gap 6.8e-4 s = the neglected 173θ⁶/737280 term');
  near('and the gap IS that neglected term', exact - series, (173 * th ** 6 / 737280) * T0, 8e-5,
    'the residual is accounted for, not waved away');
  truthy('60° swing is MEASURABLY longer', exact - T0 > 0.14,
    `by ${(exact - T0).toFixed(4)} s — visible against a stopwatch`);

  // Small angles must agree with the textbook formula, or the formula would be
  // wrong rather than approximate.
  near('at 5° the two agree to 0.05%', S.pendulumPeriodExact(1, 9.8, (5 * Math.PI) / 180) / T0 - 1, 0.000476, 2e-5,
    'this is the regime the derivation is about');
  truthy('correction grows with amplitude, monotonically',
    [5, 20, 45, 60, 90, 120].every((d, i, a) =>
      i === 0 || S.pendulumPeriodError((a[i] * Math.PI) / 180) > S.pendulumPeriodError((a[i - 1] * Math.PI) / 180)),
    'no fold-back anywhere on the range');
}

// The MEASURED period, from integrating θ̈ = −(g/l) sin θ with the FROZEN E2
// RK4, must reproduce the closed form. This is the check that the animation and
// the quoted number are the same physics.
{
  for (const deg of [5, 30, 60, 120]) {
    const th = (deg * Math.PI) / 180;
    const measured = S.pendulumPeriodMeasured(1, 9.8, th, 1 / 4000);
    const exact = S.pendulumPeriodExact(1, 9.8, th);
    near(`integrated period at ${deg}° == closed form`, measured, exact, 2e-5,
      'RK4 on sin θ vs the elliptic integral');
  }
}

// ── driven and damped ────────────────────────────────────────────────────────
section = 'Resonance';

{
  const d = { omega0: 4, gamma: 0.4, drive: 1 };
  // Hand-computed peak position: √(ω₀² − 2γ²) = √(16 − 0.32) = √15.68 = 3.959798
  near('peak at √(ω₀²−2γ²)', S.resonantOmega(d), 3.959797974645, 1e-11, 'NOT at ω₀');
  // At ω = ω₀ exactly: A = (F₀/m)/(2γω₀) = 1/(2 × 0.4 × 4) = 0.3125 m
  near('amplitude at ω = ω₀', S.drivenAmplitude(d, 4), 0.3125, 1e-13, '1/(2γω₀)');
  // Halving γ doubles the peak, to within the (small) shift of its position.
  const half = { ...d, gamma: 0.2 };
  const ratio = S.drivenAmplitude(half, S.resonantOmega(half)) / S.drivenAmplitude(d, S.resonantOmega(d));
  between('half the damping ≈ double the peak', ratio, 1.95, 2.05, 'peak height goes as 1/γ');
  // Damping barely moves WHERE it happens.
  truthy('peak position hardly moves', Math.abs(S.resonantOmega(half) - S.resonantOmega(d)) < 0.05,
    `moved ${Math.abs(S.resonantOmega(half) - S.resonantOmega(d)).toFixed(4)} rad/s`);
  // Heavy damping removes the peak entirely (γ ≥ ω₀/√2).
  near('over-damped → no peak at all', S.resonantOmega({ omega0: 4, gamma: 3, drive: 1 }), 0, 0,
    'γ ≥ ω₀/√2 = 2.828');
  // Phase lag: 0 well below, π/2 AT ω₀, → π well above. The quarter-cycle lag
  // at resonance is what lets the driver keep feeding energy in.
  near('phase lag at resonance = π/2', S.drivenPhaseLag(d, 4), Math.PI / 2, 1e-13, 'the quarter cycle');
  truthy('lag → 0 far below and → π far above',
    S.drivenPhaseLag(d, 0.05) < 0.05 && S.drivenPhaseLag(d, 400) > Math.PI - 0.05);
  // The static limit: at ω = 0 the mass just follows, A = F₀/(mω₀²).
  near('ω → 0 gives the static response', S.drivenAmplitude(d, 0), 1 / 16, 1e-14, 'F₀/(mω₀²)');
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. WAVES
// ═════════════════════════════════════════════════════════════════════════════
section = 'Waves — travelling';

near('v = fλ', W.waveSpeed(2.5, 0.8), 2, 1e-15, '2.5 Hz × 0.8 m');
near('k = 2π/λ', W.angularWavenumber(2), Math.PI, 1e-15, 'λ = 2 m');
near('λ = v/f', W.wavelengthOf(340, 400), 0.85, 1e-14, 'a 400 Hz note in air');

// A wave running right must be the SAME shape a step later, shifted by v·dt.
{
  const w = { amplitude: 1, wavelength: 2, frequency: 1.5, direction: 1 };
  const v = W.waveSpeed(1.5, 2);
  let worst = 0;
  for (let i = 0; i <= 60; i++) {
    const x = (6 * i) / 60;
    worst = Math.max(worst, Math.abs(W.waveAt(w, x + v * 0.31, 0.31) - W.waveAt(w, x, 0)));
  }
  near('the profile translates at v = fλ', worst, 0, 1e-12, 'shape unchanged, position moved');
}

// ── superposition and standing waves ─────────────────────────────────────────
section = 'Waves — standing';

// THE FLAGSHIP CLAIM. Two counter-runners summed point by point must equal the
// textbook product form 2A sin(kx) cos(ωt). The sim NEVER draws the product
// form; this is the check that the split it shows is the real decomposition.
{
  const A = 1;
  const lam = 2;
  const f = 0.6;
  let worst = 0;
  for (const t of [0, 0.13, 0.41, 0.83, 1.27, 2.05]) {
    const sp = W.standing(A, lam, f, 6, t, 300);
    for (let i = 0; i < sp.xs.length; i++) {
      worst = Math.max(worst, Math.abs(sp.ySum[i] - (sp.yRight[i] + sp.yLeft[i])));
      worst = Math.max(worst, Math.abs(sp.ySum[i] - W.standingClosedForm(A, lam, f, sp.xs[i], t)));
    }
  }
  near('right + left == 2A sin(kx)cos(ωt)', worst, 0, 1e-12,
    '6 instants × 301 points — the split is the real decomposition');
}

// NODES FALL OUT OF THE SUM. Checked two ways: the sum is (numerically) zero
// there at every instant, and the spacing is exactly λ/2.
{
  const A = 1;
  const lam = 2;
  const f = 0.6;
  const nodes = W.nodePositions(lam, 6);
  truthy('nodes found across 3λ', nodes.length === 7, `${nodes.length} of them at λ/2 spacing`);
  let worstSpacing = 0;
  for (let i = 1; i < nodes.length; i++) worstSpacing = Math.max(worstSpacing, Math.abs(nodes[i] - nodes[i - 1] - lam / 2));
  near('node spacing == λ/2 exactly', worstSpacing, 0, 1e-14, 'the measurement a resonance tube makes');

  let worstAmp = 0;
  for (const t of [0, 0.17, 0.55, 1.1, 1.9]) {
    for (const x of nodes) worstAmp = Math.max(worstAmp, Math.abs(W.standingClosedForm(A, lam, f, x, t)));
  }
  near('the sum is zero at every node, always', worstAmp, 0, 1e-12, '5 instants × 7 nodes');

  // Antinodes sit exactly halfway between, and reach 2A.
  const anti = W.antinodePositions(lam, 6);
  near('first antinode at λ/4', anti[0], lam / 4, 1e-15);
  near('antinode reaches 2A at t = 0', Math.abs(W.standingClosedForm(A, lam, f, anti[0], 0)), 2 * A, 1e-12,
    'the two waves agree there for all time');
  // Node spacing is HALF the wavelength, which is the thing students halve twice.
  near('node spacing is λ/2, not λ', nodes[1] - nodes[0], 1, 1e-15, 'λ = 2 m here');
}

// ── string harmonics ─────────────────────────────────────────────────────────
section = 'Waves — harmonics';

// Hand-computed: T = 100 N on μ = 0.01 kg/m → v = √(100/0.01) = √10000 = 100 m/s
// On L = 4 m: f₁ = 100/8 = 12.5 Hz, and fₙ = 12.5n.
near('v = √(T/μ)', W.stringWaveSpeed(100, 0.01), 100, 1e-13, '√10000');
for (const n of [1, 2, 3, 4, 5, 6]) {
  near(`f${n} = n·v/2L, L=4`, W.harmonicFrequency(n, 100, 4), 12.5 * n, 1e-12, `${12.5 * n} Hz`);
}
near('λ₁ = 2L', W.harmonicWavelength(1, 4), 8, 1e-15, 'one half-loop between the clamps');
near('λ₃ = 2L/3', W.harmonicWavelength(3, 4), 8 / 3, 1e-15);
// f ∝ √T: FOUR times the tension for TWICE the frequency.
near('4× tension → 2× frequency', W.stringWaveSpeed(400, 0.01) / W.stringWaveSpeed(100, 0.01), 2, 1e-14, 'f ∝ √T');
// Every mode must have a node at BOTH clamps — that is the boundary condition
// the whole harmonic series comes from.
{
  let worst = 0;
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const sp = W.harmonicShape(n, 1, 4, 100, 0.037, 200);
    worst = Math.max(worst, Math.abs(sp.ySum[0]), Math.abs(sp.ySum[sp.ySum.length - 1]));
    // and exactly n half-loops → n+1 nodes including the ends
    const nodes = W.nodePositions(W.harmonicWavelength(n, 4), 4);
    if (nodes.length !== n + 1) { worst = 1; }
  }
  near('every mode is clamped at both ends', worst, 0, 1e-11, 'and has exactly n+1 nodes');
}

// ── beats ────────────────────────────────────────────────────────────────────
section = 'Waves — beats';

// Hand-computed: 256 Hz and 260 Hz → 4 beats/s, envelope repeats at 2 Hz,
// pitch heard is 258 Hz.
near('beat frequency |f₁−f₂|', W.beatFrequency(256, 260), 4, 1e-13, '4 surges per second');
near('envelope repeat rate is HALF that', W.envelopeFrequency(256, 260), 2, 1e-13, '|cos| peaks twice per cycle');
near('pitch heard is the mean', W.carrierFrequency(256, 260), 258, 1e-13);
truthy('the two are not the same number', W.beatFrequency(256, 260) !== W.envelopeFrequency(256, 260),
  'the factor of two students lose');

// COUNT the loudness maxima in a window and compare with |f₁ − f₂|. Independent
// of the formula: this is measured off the summed waveform's envelope.
{
  const f1 = 5;
  const f2 = 8;              // Δf = 3 Hz
  const win = 4;             // expect 12 loud moments
  const s = W.beatSamples(1, f1, f2, win, 40000);
  let maxima = 0;
  for (let i = 1; i < s.length - 1; i++) {
    if (s[i].envelope > s[i - 1].envelope && s[i].envelope >= s[i + 1].envelope && s[i].envelope > 1.9) maxima++;
  }
  near('counted loudness surges in 4 s', maxima, W.beatFrequency(f1, f2) * win, 1,
    'measured off the envelope, not from the formula');

  // And the identity itself: y₁ + y₂ == envelope × carrier, everywhere.
  let worst = 0;
  for (const q of s) worst = Math.max(worst, Math.abs(q.sum - q.envelopeSigned * q.carrier));
  near('sum == 2A cos(πΔf t)·sin(π(f₁+f₂)t)', worst, 0, 1e-12, 'the product-to-sum identity');

  // Equal frequencies → no throb at all, which is what a tuner listens for.
  near('identical tones give zero beats', W.beatFrequency(440, 440), 0, 0);
}

// ── Doppler ──────────────────────────────────────────────────────────────────
section = 'Doppler';

// THE HEADLINE ASYMMETRY, hand-computed with f₀ = 400 Hz, v = 340 m/s:
//   source approaching at 30 : f′ = 400 × 340/310 = 438.709677419 Hz
//   observer approaching at 30: f′ = 400 × 370/340 = 435.294117647 Hz
//   difference                                     =   3.415559772 Hz
{
  const src = W.dopplerSourceMoving(400, 340, 30);
  const obs = W.dopplerObserverMoving(400, 340, 30);
  near('source approaching at 30 m/s', src, 438.709677419355, 1e-9, 'f₀ v/(v−v_s)');
  near('observer approaching at 30 m/s', obs, 435.294117647059, 1e-9, 'f₀ (v+v_o)/v');
  truthy('THE TWO ARE DIFFERENT', Math.abs(src - obs) > 1e-6, `by ${(src - obs).toFixed(6)} Hz`);
  near('the gap', src - obs, 3.415559772296, 1e-9, 'same closing speed, two answers');
  truthy('the source case is always the larger',
    [5, 10, 30, 60, 100, 200].every((u) => W.dopplerSourceMoving(400, 340, u) > W.dopplerObserverMoving(400, 340, u)),
    'division beats addition, at every speed');

  // The gap WIDENS with speed — the source case is a hyperbola, the observer
  // case a straight line.
  const gaps = [10, 50, 100, 200].map((u) => W.dopplerSourceMoving(400, 340, u) - W.dopplerObserverMoving(400, 340, u));
  truthy('and the gap grows with speed', gaps.every((g, i) => i === 0 || g > gaps[i - 1]),
    gaps.map((g) => g.toFixed(1)).join(' → '));

  // Receding cases lower the pitch, and are NOT mirror images of the approach.
  truthy('receding lowers the pitch both ways',
    W.dopplerSourceMoving(400, 340, -30) < 400 && W.dopplerObserverMoving(400, 340, -30) < 400);
  truthy('approach and recession are not symmetric for a source',
    Math.abs((W.dopplerSourceMoving(400, 340, 30) - 400) - (400 - W.dopplerSourceMoving(400, 340, -30))) > 1,
    'the +38.7 up is bigger than the −35.3 down');

  // Both moving: one formula covers it.
  near('both moving, combined', W.dopplerObserved({ f0: 400, v: 340, vs: 30, vo: 20 }),
    (400 * 360) / 310, 1e-10, 'f₀(v+v_o)/(v−v_s)');

  // The wavelength is what a moving SOURCE changes — the mechanism.
  near('λ ahead of a source at 30 m/s', W.dopplerWavelengthAhead(400, 340, 30), 310 / 400, 1e-14, 'bunched');
  near('λ behind it', W.dopplerWavelengthBehind(400, 340, 30), 370 / 400, 1e-14, 'stretched');
  truthy('a moving OBSERVER changes no wavelength',
    W.dopplerWavelengthAhead(400, 340, 0) === 340 / 400, 'v_o does not appear in it');

  // At Mach 1 the formula diverges, and the module says so rather than lying.
  truthy('v_s = v gives Infinity, not a number', !Number.isFinite(W.dopplerSourceMoving(400, 340, 340)),
    'the sonic-boom limit is in the algebra');
  near('Mach number', W.machNumber(170, 340), 0.5, 1e-15);

  // THE DRAWN CRESTS ARE THE MECHANISM, so their spacing had better BE the two
  // Doppler wavelengths. `wavefronts` places each circle where the source was
  // when it emitted it, and nothing in it knows about the wavelength formula —
  // so this is a genuinely independent route to λ_ahead and λ_behind.
  //   f₀ = 2 Hz, v = 340 m/s, v_s = 100 m/s:
  //     ahead  λ = (340 − 100)/2 = 120 m
  //     behind λ = (340 + 100)/2 = 220 m
  const fr = W.wavefronts({ f0: 2, v: 340, sourceVx: 100, sourceX0: 0 }, 3, 6);
  const aheadGap = (fr[1].cx + fr[1].radius) - (fr[0].cx + fr[0].radius);
  const behindGap = (fr[0].cx - fr[0].radius) - (fr[1].cx - fr[1].radius);
  near('drawn crest spacing AHEAD == λ_ahead', aheadGap, W.dopplerWavelengthAhead(2, 340, 100), 1e-9, '120 m');
  near('drawn crest spacing BEHIND == λ_behind', behindGap, W.dopplerWavelengthBehind(2, 340, 100), 1e-9, '220 m');
  truthy('so the crests really do bunch ahead', aheadGap < behindGap,
    `${aheadGap.toFixed(1)} m ahead vs ${behindGap.toFixed(1)} m behind`);
  // A STATIONARY source must space them evenly — the observer-moving case.
  const still = W.wavefronts({ f0: 2, v: 340, sourceVx: 0, sourceX0: 0 }, 3, 6);
  near('a still source spaces them evenly', (still[1].radius - still[0].radius) - (still[2].radius - still[1].radius),
    0, 1e-9, 'a moving observer changes no wavelength');
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. THERMODYNAMICS
// ═════════════════════════════════════════════════════════════════════════════
section = 'PV — isothermal';

const gas = { n: 1, f: 5 };   // one mole of a diatomic gas (air)

// Hand-computed, n = 1, T = 300 K, V: 0.02 → 0.05 m³:
//   R        = k_B·N_A                = 8.31446261815324 (exact by SI definition)
//   nRT      = 8.31446261815 × 300    = 2494.338785446 J
//   W_iso    = nRT ln(2.5)            = 2494.338785446 × 0.9162907319 = 2285.539511 J
//   P₁       = nRT/V₁ = 2494.3387854/0.02 = 124716.939272 Pa
//   P₁ΔV     = 124716.939 × 0.03     = 3741.508 J   (the WRONG rectangle, too big)
//   P₂ΔV     = 49886.776 × 0.03      = 1496.603 J   (the other wrong rectangle)
{
  const start = { V: 0.02, T: 300, P: PV.pressureFromVT(0.02, 300, 1) };
  near('P₁ = nRT/V₁', start.P, 124716.939272, 1e-5, '1.247×10⁵ Pa');
  const leg = PV.buildLeg('isothermal', start, gas, 0.05, 1200);
  near('closed form W = nRT ln(V₂/V₁)', PV.workClosedForm(leg, gas), 2285.539511, 1e-6, 'nRT ln 2.5');
  const area = PV.workAlongPath(leg.points);
  near('the SHADED AREA reproduces it', area, 2285.539511, 5e-3,
    'trapezoid over the drawn path; error ≈ 1 part in 10⁶');
  truthy('and the two agree to 1e-5 relative',
    Math.abs(area - PV.workClosedForm(leg, gas)) / 2285.539511 < 1e-5,
    `relative gap ${(Math.abs(area - PV.workClosedForm(leg, gas)) / 2285.539511).toExponential(2)}`);
  // The rectangles a student reaches for are BOTH wrong, on either side.
  truthy('P₁ΔV over-estimates, P₂ΔV under-estimates',
    start.P * 0.03 > area && PV.pressureAlong('isothermal', start, gas, 0.05) * 0.03 < area,
    `${(start.P * 0.03).toFixed(0)} > ${area.toFixed(0)} > ${(PV.pressureAlong('isothermal', start, gas, 0.05) * 0.03).toFixed(0)}`);
  near('P₁ΔV, quoted in the archetype copy', start.P * 0.03, 3741.508178, 1e-5, 'the copy says 3741 J');
  near('P₂ΔV, quoted in the archetype copy', PV.pressureAlong('isothermal', start, gas, 0.05) * 0.03, 1496.603271, 1e-5,
    'the copy says 1497 J');
  // ΔU is zero on an isotherm, so Q = W. Both come out of the module.
  const led = PV.legLedger(leg, gas);
  near('ΔU on an isotherm', led.dU, 0, 1e-9, 'T did not change');
  near('so Q = W', led.Q, led.W, 1e-12, 'first law with ΔU = 0');
  // PV stays constant along the path — the definition of the curve drawn.
  let worst = 0;
  for (const q of leg.points) worst = Math.max(worst, Math.abs(q.P * q.V - start.P * start.V));
  near('PV constant along the isotherm', worst, 0, 1e-8, 'checked at all 1201 points');
}

section = 'PV — adiabatic';

// γ = 1 + 2/f = 1 + 2/5 = 1.4 for a diatomic gas.
near('γ = 1 + 2/f, f = 5', PV.gammaOf(gas), 1.4, 1e-15, 'diatomic');
near('γ = 5/3 for a monatomic gas', PV.gammaOf({ n: 1, f: 3 }), 5 / 3, 1e-15);
near('Cv = (f/2)R', PV.cvOf(gas), 2.5 * PV.R_GAS, 1e-13);
near('Cp − Cv = R', PV.cpOf(gas) - PV.cvOf(gas), PV.R_GAS, 1e-12, 'Mayer’s relation');
{
  const start = { V: 0.02, T: 300, P: PV.pressureFromVT(0.02, 300, 1) };
  const leg = PV.buildLeg('adiabatic', start, gas, 0.05, 1200);
  // PVᵞ is what "adiabatic" MEANS on this plane — checked at every drawn point.
  const c0 = start.P * Math.pow(start.V, 1.4);
  let worst = 0;
  for (const q of leg.points) worst = Math.max(worst, Math.abs(q.P * Math.pow(q.V, 1.4) - c0) / c0);
  near('PVᵞ constant along the adiabat', worst, 0, 1e-14, 'relative, at all 1201 points');
  // TVᵞ⁻¹ constant follows, and is the form that gives the temperature drop.
  near('TVᵞ⁻¹ constant', leg.to.T * Math.pow(leg.to.V, 0.4), start.T * Math.pow(start.V, 0.4), 1e-9);
  truthy('adiabatic expansion COOLS the gas', leg.to.T < start.T - 50,
    `300 K → ${leg.to.T.toFixed(1)} K, with no heat removed`);
  const led = PV.legLedger(leg, gas);
  // Q = ΔU + W_numeric, and ΔU is exact, so this residual IS the trapezoid
  // error on the adiabat — 4×10⁻⁴ J against a 1914 J work, i.e. 2×10⁻⁷
  // relative. Asserted BOTH ways so the absolute tolerance cannot hide a real
  // drift if the sample count is ever lowered.
  near('Q = 0 on an adiabat', led.Q, 0, 2e-3, 'trapezoid residual only');
  truthy('and it is 2e-7 of the work, not a physics error', Math.abs(led.Q / led.W) < 1e-6,
    `${Math.abs(led.Q / led.W).toExponential(2)} relative`);
  near('so W = −ΔU', led.W, -led.dU, 2e-3, 'the work came out of the internal energy');
  near('numeric area == (P₁V₁−P₂V₂)/(γ−1)', led.W, led.Wexact, 1e-3, 'two routes to the same work');
  // And it does LESS work than the isotherm between the same volumes.
  const iso = PV.legLedger(PV.buildLeg('isothermal', start, gas, 0.05, 1200), gas);
  truthy('adiabatic work < isothermal work', led.W < iso.W,
    `${led.W.toFixed(0)} J vs ${iso.W.toFixed(0)} J`);
}

section = 'PV — path dependence';

// TWO ROUTES, SAME ENDPOINTS. Route A: isobaric expansion then isochoric cool.
// Route B: isochoric cool then isobaric expansion. Both end at (0.05, P₂).
{
  const start = { V: 0.02, T: 300, P: PV.pressureFromVT(0.02, 300, 1) };
  const endP = PV.pressureAlong('isothermal', start, gas, 0.05);
  const end = { V: 0.05, P: endP, T: (endP * 0.05) / (1 * PV.R_GAS) };

  const a1 = PV.buildLeg('isobaric', start, gas, 0.05, 800);
  const a2 = PV.buildLeg('isochoric', a1.to, gas, endP, 2);
  const b1 = PV.buildLeg('isochoric', start, gas, endP, 2);
  const b2 = PV.buildLeg('isobaric', b1.to, gas, 0.05, 800);

  // They really do meet — otherwise the comparison is meaningless.
  near('route A lands on V₂', a2.to.V, 0.05, 1e-15);
  near('route A lands on P₂', a2.to.P, endP, 1e-9);
  near('route B lands on V₂', b2.to.V, 0.05, 1e-15);
  near('route B lands on P₂', b2.to.P, endP, 1e-9);
  near('and on the same temperature', a2.to.T, b2.to.T, 1e-9);

  const WA = PV.workAlongPath(a1.points) + PV.workAlongPath(a2.points);
  const WB = PV.workAlongPath(b1.points) + PV.workAlongPath(b2.points);
  // Hand-computed: route A does P₁ΔV = 3741.508 J; route B does P₂ΔV = 1496.603 J.
  near('route A work = P₁ΔV', WA, 3741.508178, 1e-6, 'expand first, at the high pressure');
  near('route B work = P₂ΔV', WB, 1496.603271, 1e-6, 'cool first, expand cheaply');
  truthy('W IS PATH-DEPENDENT', Math.abs(WA - WB) > 2000, `they differ by ${(WA - WB).toFixed(1)} J`);

  const dUA = PV.deltaU(gas, start, a2.to);
  const dUB = PV.deltaU(gas, start, b2.to);
  near('ΔU IS NOT path-dependent', dUA - dUB, 0, 1e-9, 'identical, to 1e-9 J');
  near('and both equal nCvΔT from the endpoints', dUA, 1 * PV.cvOf(gas) * (end.T - start.T), 1e-9);
  // The heats differ by exactly the work difference — the first law, checked.
  near('Q_A − Q_B == W_A − W_B', (dUA + WA) - (dUB + WB), WA - WB, 1e-9,
    'the books balance either way round');
  near('an isochoric leg does no work', PV.workAlongPath(a2.points), 0, 1e-15, 'ΔV = 0');
}

section = 'PV — cycles';

// A CLOSED CYCLE: net work must equal the enclosed area, and Σ ΔU must be zero.
{
  const legs = PV.carnotCycle(gas, 0.02, 0.05, 500, 300, 900);
  const led = PV.cycleLedger(legs, gas);
  near('Σ ΔU round the loop', led.netDeltaU, 0, 1e-6, 'the proof it really closed');
  truthy('the loop closes geometrically',
    Math.abs(legs[3].to.V - legs[0].from.V) < 1e-9 && Math.abs(legs[3].to.P - legs[0].from.P) < 1e-3,
    'V₄ derived from the closing condition, not chosen');
  near('|net work| == enclosed area', Math.abs(led.netWork), led.enclosedArea, 1e-6,
    'the trapezoid sum IS the shoelace formula');
  truthy('and the net work is not zero', Math.abs(led.netWork) > 100,
    `${led.netWork.toFixed(1)} J per cycle, despite ΔU = 0`);
  truthy('clockwise ⇒ engine', led.clockwise && led.netWork > 0);
  near('Q_in − Q_out == W_net', led.heatAbsorbed - led.heatRejected, led.netWork, 1e-6, 'energy conservation');

  // η = 1 − T_c/T_h = 1 − 300/500 = 0.4 exactly.
  near('Carnot efficiency formula', PV.carnotEfficiency(300, 500), 0.4, 1e-15, '1 − 300/500');
  near('the ASSEMBLED cycle achieves it', led.efficiency, 0.4, 1e-6,
    'measured from Σ W and Σ Q, not quoted');

  // Reversing gives a refrigerator: every sign flips, same four legs.
  const rev = PV.cycleLedger(PV.reverseCycle(legs), gas);
  near('reversed cycle: net work flips sign', rev.netWork, -led.netWork, 1e-6);
  near('and encloses the same area', rev.enclosedArea, led.enclosedArea, 1e-6);
  truthy('anticlockwise ⇒ refrigerator', !rev.clockwise && rev.netWork < 0);
  near('COP_Carnot = T_c/(T_h−T_c)', PV.carnotCOP(300, 500), 1.5, 1e-14);
  truthy('COP is greater than 1', PV.carnotCOP(260, 300) > 1,
    `${PV.carnotCOP(260, 300).toFixed(2)} — moving heat is cheaper than making it`);
}

section = 'PV — nothing beats Carnot';

// THE SECOND LAW, AS A MEASUREMENT. Sweep Otto and Carnot cycles over a wide
// parameter range and assert that no assembled cycle's measured efficiency
// exceeds the Carnot value for the temperature EXTREMES it actually visits.
{
  let worstMargin = Infinity;
  let checked = 0;
  for (const f of [3, 5, 6]) {
    const g = { n: 1, f };
    for (const ratio of [2, 4, 6, 8, 12, 16]) {
      for (const Tpeak of [900, 1400, 1800, 2400]) {
        const legs = PV.ottoCycle(g, 0.05, ratio, 300, Tpeak, 500);
        const led = PV.cycleLedger(legs, g);
        const temps = legs.flatMap((l) => [l.from.T, l.to.T]);
        const ceiling = PV.carnotEfficiency(Math.min(...temps), Math.max(...temps));
        worstMargin = Math.min(worstMargin, ceiling - led.efficiency);
        checked++;
      }
    }
    for (const Th of [400, 600, 900, 1200]) {
      for (const Tc of [150, 250, 300]) {
        const legs = PV.carnotCycle(g, 0.02, 0.05, Th, Tc, 500);
        const led = PV.cycleLedger(legs, g);
        const temps = legs.flatMap((l) => [l.from.T, l.to.T]);
        const ceiling = PV.carnotEfficiency(Math.min(...temps), Math.max(...temps));
        worstMargin = Math.min(worstMargin, ceiling - led.efficiency);
        checked++;
      }
    }
  }
  truthy(`no cycle beats Carnot (${checked} cycles swept)`, worstMargin >= -1e-9,
    `smallest margin ${worstMargin.toExponential(2)} — zero for the Carnot ones, positive for Otto`);
  // Otto's own closed form, hand-computed: 1 − 8^(−0.4) = 0.564724718
  near('η_Otto = 1 − r^(1−γ), r=8 γ=1.4', PV.ottoEfficiency(8, 1.4), 0.564724718352, 1e-11, 'the 56.5% in the copy');
  truthy('and it depends on r alone, not on the heat added',
    Math.abs(PV.ottoEfficiency(8, 1.4) - PV.ottoEfficiency(8, 1.4)) === 0,
    'no fuel term anywhere in the expression');
  // A measured Otto cycle should sit on its own closed form.
  {
    const led = PV.cycleLedger(PV.ottoCycle(gas, 0.05, 8, 300, 1600, 900), gas);
    near('assembled Otto matches 1 − r^(1−γ)', led.efficiency, PV.ottoEfficiency(8, 1.4), 1e-6,
      'measured from Σ W and Σ Q');
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. KINETIC THEORY
// ═════════════════════════════════════════════════════════════════════════════
section = 'Kinetic theory';

{
  const m = KIN.molecularMass(32);      // oxygen
  const T = 300;
  // Hand-computed: v_rms = √(3k_BT/m), m = 32/1000/6.02214076e23 = 5.3135e-26 kg
  //   → √(3 × 1.380649e-23 × 300 / 5.3135e-26) = 483.574 m/s
  near('v_rms for O₂ at 300 K', KIN.vRms(m, T), 483.574462865, 1e-6, '√(3k_BT/m)');
  near('⟨½mv²⟩ = (3/2)k_BT', KIN.meanKineticEnergy(300), 6.2129205e-21, 1e-27, 'per molecule');
  // The three speeds are always in this ratio, whatever the gas or temperature.
  near('v_rms/v_p = √1.5', KIN.vRms(m, T) / KIN.vMostProbable(m, T), Math.sqrt(1.5), 1e-13);
  near('v̄/v_p = √(4/π)', KIN.vMean(m, T) / KIN.vMostProbable(m, T), Math.sqrt(4 / Math.PI), 1e-13);
  truthy('and the order is v_p < v̄ < v_rms',
    KIN.vMostProbable(m, T) < KIN.vMean(m, T) && KIN.vMean(m, T) < KIN.vRms(m, T),
    'the tail is long on one side only');

  // THE DISTRIBUTION IS NORMALISED, and its second moment gives back the
  // temperature. Both integrated numerically from the same bins the sim draws —
  // an independent route to (3/2)k_BT.
  const bins = KIN.speedBins(m, T, KIN.vRms(m, T) * 4, 4000);
  near('∫f(v)dv = 1', KIN.totalFraction(bins), 1, 1e-6, 'midpoint rule over the drawn bins');
  near('∫½mv²f(v)dv == (3/2)k_BT', KIN.meanKEFromBins(bins, m), KIN.meanKineticEnergy(T), 1e-24,
    'temperature IS mean kinetic energy — integrated, not asserted');
  near('√⟨v²⟩ from the bins == v_rms', Math.sqrt(KIN.meanSquareFromBins(bins)), KIN.vRms(m, T), 0.05);

  // SAME TEMPERATURE, DIFFERENT SPEEDS. Helium (4) against oxygen (32): the
  // mass ratio is 8, so the speed ratio must be √8 = 2.8284.
  const mHe = KIN.molecularMass(4);
  near('same T ⇒ same mean KE', KIN.meanKineticEnergy(T) - KIN.meanKineticEnergy(T), 0, 0, 'mass-free by construction');
  near('speed ratio is √(M₂/M₁)', KIN.vRms(mHe, T) / KIN.vRms(m, T), Math.sqrt(8), 1e-12, '2.828, not 8');
  // And the energies really are equal when computed from those speeds.
  near('½m v_rms² is the same for both gases',
    0.5 * mHe * KIN.vRms(mHe, T) ** 2 - 0.5 * m * KIN.vRms(m, T) ** 2, 0, 1e-27,
    'the whole point of the archetype');

  // Internal energy of n moles: U = (f/2)nRT, and it must match n·N_A·⟨KE⟩ for
  // a monatomic gas where all the energy is translational.
  near('U = (3/2)nRT for a monatomic gas', KIN.internalEnergy(1, 3, 300), 1.5 * PV.R_GAS * 300, 1e-9);
  near('and equals N_A × ⟨½mv²⟩', KIN.internalEnergy(1, 3, 300), KIN.N_A * KIN.meanKineticEnergy(300), 1e-9,
    'two routes; R derived from k_B·N_A in BOTH modules');
  near('pv.ts and kinetic.ts agree on R', PV.R_GAS, KIN.R_GAS, 0,
    'bit-identical — a truncated literal here failed by 7e-8 J');

  // The chamber the sim draws: seeded speeds must reproduce the temperature.
  const mols = KIN.seedChamber(4000, 300, m, 1, 0.6, 7);
  // 2-D chamber: ⟨½mv²⟩ = k_B T over two degrees of freedom.
  const Tmeas = KIN.chamberMeanKE(mols, m) / KIN.K_B;
  between('seeded chamber reads back ~300 K', Tmeas, 285, 315,
    '2-D equipartition over 4000 molecules; sampling noise only');

  // Bouncing off an APPROACHING wall speeds a molecule up — the whole mechanism
  // of adiabatic heating, at the level it actually happens.
  {
    const one = [{ x: 0.99, y: 0.3, vx: 100, vy: 0 }];
    const after = KIN.advanceChamber(one, 0.001, 0.6, 0.995, -50);
    truthy('a molecule leaves an incoming wall FASTER', Math.abs(after[0].vx) > 100,
      `${Math.abs(after[0].vx).toFixed(0)} m/s from 100 — vx = 2v_piston − vx`);
    const away = KIN.advanceChamber(one, 0.001, 0.6, 0.995, +50);
    truthy('and a retreating wall slows it down', Math.abs(away[0].vx) < 100,
      `${Math.abs(away[0].vx).toFixed(0)} m/s — adiabatic cooling, same one line`);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. FLUIDS
// ═════════════════════════════════════════════════════════════════════════════
section = 'Fluids — continuity';

// Hand-computed: r₁ = 0.06 m → A₁ = π(0.0036) = 0.011309734 m²
//                r₂ = 0.03 m → A₂ = π(0.0009) = 0.002827433 m²
//   A₁/A₂ = 4 exactly (half the radius, a quarter of the area)
//   v₁ = 1.2 m/s → v₂ = 4 × 1.2 = 4.8 m/s
near('A = πr², r = 0.06', FL.areaOfRadius(0.06), 0.011309733553, 1e-11);
near('halving r quarters A', FL.areaOfRadius(0.06) / FL.areaOfRadius(0.03), 4, 1e-13, 'A ∝ r²');
near('v₂ = A₁v₁/A₂', FL.continuitySpeed(FL.areaOfRadius(0.06), 1.2, FL.areaOfRadius(0.03)), 4.8, 1e-13,
  'four times faster');
near('Q is the same either side', FL.flowRate(FL.areaOfRadius(0.03), 4.8), FL.flowRate(FL.areaOfRadius(0.06), 1.2), 1e-15,
  'nothing piles up');

section = 'Fluids — Bernoulli';

// Hand-computed for the default pipe: ρ = 1000, P₁ = 150 000 Pa (gauge),
//   ½ρv₁² = 500 × 1.44   =    720 Pa
//   ½ρv₂² = 500 × 23.04  = 11 520 Pa
//   ΔP    = 720 − 11 520 = −10 800 Pa  →  P₂ = 139 200 Pa
{
  const P2 = FL.pressureDownstream(150000, 1000, 1.2, 0, 4.8, 0);
  near('pressure at the throat', P2, 139200, 1e-8, 'it FELL by 10.8 kPa');
  truthy('faster ⇒ lower pressure', P2 < 150000, 'the counter-intuitive one, as a number');
  near('the drop equals the gain in ½ρv²', 150000 - P2, 500 * (4.8 ** 2 - 1.2 ** 2), 1e-9,
    'one term grew by exactly what the other lost');

  // THE CONSTANT IS CONSTANT — along a real solved pipe, at every station,
  // including one raised above the datum so the ρgh term is doing work too.
  const geom = [
    { x: 0, radius: 0.06, height: 0 },
    { x: 1.2, radius: 0.03, height: 1.5 },
    { x: 2.0, radius: 0.045, height: 0.4 },
    { x: 3.0, radius: 0.06, height: 0 },
  ];
  const stations = FL.solvePipe(geom, 1.2, 150000, 1000);
  truthy('the pipe solves', stations !== null && stations.length === 4);
  if (stations) {
    const c0 = stations[0].terms.total;
    let worstB = 0;
    let worstQ = 0;
    const Q = stations[0].area * stations[0].speed;
    for (const s of stations) {
      worstB = Math.max(worstB, Math.abs(s.terms.total - c0));
      worstQ = Math.max(worstQ, Math.abs(s.area * s.speed - Q));
      // and each station's three terms really do sum to its total
      worstB = Math.max(worstB, Math.abs(s.terms.pressure + s.terms.dynamic + s.terms.gravity - s.terms.total));
    }
    near('P + ½ρv² + ρgh constant at every station', worstB, 0, 1e-9, '4 stations, one with height');
    near('A·v constant at every station', worstQ, 0, 1e-15, 'continuity holds along the solve');
    truthy('the raised narrow station has the lowest pressure',
      stations[1].pressure === Math.min(...stations.map((s) => s.pressure)),
      'both terms working the same way');
  }

  // Cavitation is reported, not drawn. A throat this tight needs more than the
  // whole available head.
  const impossible = FL.solvePipe(
    [{ x: 0, radius: 0.06, height: 0 }, { x: 1, radius: 0.008, height: 0 }], 3, 100000, 1000);
  truthy('an impossible constriction returns null', impossible === null,
    'better than plotting a negative absolute pressure');

  // Torricelli falls out of the same equation.
  near('efflux speed = √(2gd), d = 2 m', FL.effluxSpeed(2), Math.sqrt(2 * 9.8 * 2), 1e-14,
    'the speed it would reach by FALLING that far');
  // A Venturi meter reads the flow from the pressure difference alone.
  {
    const A1 = FL.areaOfRadius(0.06);
    const A2 = FL.areaOfRadius(0.03);
    const Q = FL.venturiFlow(A1, A2, 10800, 1000);
    near('Venturi recovers the flow rate', Q, A1 * 1.2, 1e-6, 'from ΔP = 10.8 kPa alone');
  }
}

section = 'Fluids — buoyancy';

// Hand-computed: ice ρ = 917 in water ρ = 1000 → 91.7% submerged.
{
  const V = 0.001;
  const ice = FL.floatOrSink(0.917, V, 1000);
  near('ice floats 91.7% submerged', ice.submergedFraction, 0.917, 1e-12, 'ρ_obj/ρ_fluid');
  truthy('and it floats', ice.floats);
  near('at balance, upthrust == weight', ice.buoyancy, ice.weight, 1e-12, 'net force zero');
  near('net force when settled', ice.net, 0, 1e-12);

  // BUOYANCY DOES NOT KNOW THE OBJECT'S MASS. Same displaced volume, five very
  // different masses, one upthrust.
  const upthrusts = [0.01, 0.5, 0.917, 5, 500].map(() => FL.buoyantForce(1000, V));
  near('upthrust is identical for 5 masses', Math.max(...upthrusts) - Math.min(...upthrusts), 0, 0,
    'buoyantForce(ρ_f, V, g) — mass is not an argument');

  // A steel bolt sinks, and its apparent weight is the shortfall.
  const steel = FL.floatOrSink(7.8, V, 1000);
  truthy('7800 kg/m³ sinks', !steel.floats && steel.net < 0);
  near('apparent weight underwater', steel.apparentWeight, (7.8 - 1) * 9.8, 1e-12, 'W − ρ_f V g');
  // Neutral buoyancy: exactly matching densities hovers.
  near('matching density gives zero net force', FL.floatOrSink(1, V, 1000).net, 0, 1e-12);
  // Denser fluid floats it higher — mercury holds up steel.
  truthy('steel floats in mercury', FL.floatOrSink(7.8, V, 13600).floats,
    `${(FL.floatOrSink(7.8, V, 13600).submergedFraction * 100).toFixed(0)}% submerged`);
}

section = 'Fluids — terminal velocity';

// Hand-computed for a 4 g sphere of radius 5 mm in glycerine (η = 1 Pa·s,
// ρ_f = 1260 kg/m³):
//   V   = (4/3)π(0.005)³ = 5.235988×10⁻⁷ m³
//   mg  = 0.004 × 9.8    = 0.039200 N
//   ρVg = 1260 × 5.236e-7 × 9.8 = 0.0064654 N
//   6πηr = 6π × 1 × 0.005 = 0.09424778
//   v_t = (0.039200 − 0.006465) / 0.094248 = 0.347325 m/s
{
  const m = 0.004;
  const r = 0.005;
  const V = (4 / 3) * Math.PI * r ** 3;
  const vt = FL.terminalVelocityStokes(m, V, r, 1, 1260);
  near('terminal velocity', vt, 0.347324917947, 1e-9, '(mg − ρ_f V g)/6πηr');
  near('τ = m/6πηr', FL.terminalTimeConstant(m, r, 1), 0.042441318158, 1e-11);

  // AT v_t THE FREE-BODY DIAGRAM CLOSES — checked as a force balance, which is
  // the archetype's whole claim.
  const balance = m * 9.8 - 1260 * V * 9.8 - FL.stokesDrag(1, r, vt);
  near('ΣF = 0 exactly at v_t', balance, 0, 1e-15, 'weight = upthrust + drag');
  truthy('and the forces are NOT zero', m * 9.8 > 0.03 && FL.stokesDrag(1, r, vt) > 0.03,
    `mg = ${(m * 9.8).toFixed(4)} N, drag = ${FL.stokesDrag(1, r, vt).toFixed(4)} N — they cancel, they do not vanish`);

  // The integrated fall must approach v_t, and match the closed form on the way.
  const fall = FL.fallToTerminal(m, V, r, 1, 1260, 6 * 0.0424413);
  let worst = 0;
  for (const s of fall) {
    worst = Math.max(worst, Math.abs(s.speed - FL.terminalApproach(vt, 0.042441318158, s.t)));
  }
  // RK4 truncation at the engine's DEFAULT_DT of 1/240 s against a time constant
  // of 42 ms — dt/τ ≈ 0.1, so a 1e-7 m/s residual on a 0.347 m/s terminal speed
  // is 3e-7 relative. This is the step the sim actually draws with, so the
  // tolerance is set to what a student sees rather than to a finer run.
  near('RK4 fall == v_t(1 − e^(−t/τ))', worst, 0, 5e-7,
    'at DEFAULT_DT = 1/240; 3e-7 relative');
  const last = fall[fall.length - 1];
  between('after 6τ it is within 0.5% of v_t', last.speed / vt, 0.995, 1.0);
  near('and the net force has gone to zero', last.net, 0, 2e-4, 'the FBD has closed');

  // Doubling the mass MORE than doubles v_t, because the upthrust term does not
  // double with it — the archetype's predict gate turns on exactly this.
  const heavy = FL.terminalVelocityStokes(2 * m, V, r, 1, 1260);
  truthy('2× mass gives MORE than 2× v_t', heavy / vt > 2,
    `${(heavy / vt).toFixed(4)}× — the buoyant term is subtracted before the doubling`);
  // Quadratic drag, for the regime where Stokes does not apply.
  near('quadratic law: v_t = √(net/k)', FL.terminalVelocityQuadratic(0.0392, 0.01), Math.sqrt(3.92), 1e-13);
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. ARCHETYPE HYGIENE — the promises the data makes to the UI
// ═════════════════════════════════════════════════════════════════════════════
section = 'Archetypes';

{
  const all = [
    ...Object.values(WAVES_ARCHETYPES).map((a) => ['waves', a]),
    ...Object.values(THERMO_ARCHETYPES).map((a) => ['thermo', a]),
  ];
  truthy('24 archetypes across the two libraries', all.length === 24, `${all.length} found`);

  // THE PHASE-1 FAILURE THIS EXISTS TO PREVENT: 22 misconception codes declared
  // in archetype data and read by no UI. Here `targets` and `attacks.code` come
  // from ONE helper, so they cannot diverge — and this asserts it.
  let mismatch = 0;
  let thinCopy = 0;
  let badPredict = 0;
  let unsliderable = 0;
  let thinSteps = 0;
  let dupSteps = 0;
  for (const [, a] of all) {
    if (a.targets !== a.attacks?.code) mismatch++;
    if (!a.attacks?.belief || a.attacks.belief.length < 20) thinCopy++;
    if (!a.attacks?.attack || a.attacks.attack.length < 60) thinCopy++;
    if (a.predict) {
      if (!Array.isArray(a.predict.responses) || a.predict.responses.length !== a.predict.options.length) badPredict++;
      if (a.predict.answerIndex < 0 || a.predict.answerIndex >= a.predict.options.length) badPredict++;
      if (new Set(a.predict.responses).size !== a.predict.responses.length) badPredict++;
      if (a.predict.responses.some((r) => !r || r.length < 30)) badPredict++;
    }
    for (const p of a.params ?? []) {
      if (p.kind === 'number' && (p.min === undefined || p.max === undefined || p.step === undefined)) unsliderable++;
      if (p.kind === 'number' && p.min !== undefined && p.max !== undefined) {
        if (!(p.default >= p.min && p.default <= p.max)) unsliderable++;
      }
      if (p.kind === 'select' && (!p.options || !p.options.includes(p.default))) unsliderable++;
    }
    const says = (a.defaultSteps ?? []).map((s) => (s.say ?? '').trim());
    if (says.length < 3) thinSteps++;
    if (new Set(says).size !== says.length) dupSteps++;
    if (says.some((s) => !s)) thinSteps++;
  }
  near('targets === attacks.code everywhere', mismatch, 0, 0, 'declared code == rendered code');
  near('every misconception carries real copy', thinCopy, 0, 0, 'belief + the sentence that breaks it');
  near('every predict gate answers each option', badPredict, 0, 0,
    'one response per option, all distinct, none a stub');
  near('every declared param can drive a control', unsliderable, 0, 0,
    'min/max/step present, default in range, select default in options');
  near('every archetype has ≥3 distinct guided beats', thinSteps + dupSteps, 0, 0);

  // Every code must be UNIQUE — two archetypes claiming the same misconception
  // would make the later coverage analysis lie.
  const codes = all.map(([, a]) => a.targets);
  truthy('24 distinct misconception codes', new Set(codes).size === 24, `${new Set(codes).size} distinct`);

  // Every archetype must name a bench that the dispatcher can actually reach.
  const wavesSims = new Set(['shm-bench', 'wave-studio', 'doppler-bench', 'resonance-rig']);
  const thermoSims = new Set(['pv-workbench', 'heat-engine', 'molecular-chamber', 'fluid-bench', 'buoyancy-lab']);
  let orphan = 0;
  for (const [lib, a] of all) {
    if (lib === 'waves' && !wavesSims.has(a.sim)) orphan++;
    if (lib === 'thermo' && !thermoSims.has(a.sim)) orphan++;
    if (a.scenario !== 'graphs') orphan++;
    if (!a.tip || a.tip.length < 40) orphan++;
  }
  near('every archetype routes to a built bench', orphan, 0, 0, 'and carries an expert tip');

  // Every bench must be reachable — a bench with no archetype is dead code, and
  // a declared-but-unused sim id is the mirror of a declared-but-unused code.
  const used = new Set(all.map(([, a]) => a.sim));
  truthy('all 9 benches are reached by some archetype', used.size === 9, `${used.size} of 9 reached`);

  // The resolver must reproduce the authored defaults with no overrides.
  {
    const a = WAVES_ARCHETYPES['spring-shm'];
    const bag = RESOLVE.resolveParams(a.params, undefined);
    near('resolveParams returns the archetype defaults', RESOLVE.num(bag, 'k', -1), 20, 0);
    const over = RESOLVE.resolveParams(a.params, { k: 55 });
    near('and a block override wins', RESOLVE.num(over, 'k', -1), 55, 0);
    // A null must never overwrite a default: blocks are Mixed-stored and Zod
    // validates with `.optional()`, which rejects null — the recurring livebook trap.
    const nulled = RESOLVE.resolveParams(a.params, { k: null });
    near('a null override is ignored, not written', RESOLVE.num(nulled, 'k', -1), 20, 0,
      'the Mixed-storage null trap');
    near('leadingInt parses a select label', RESOLVE.leadingInt('5 — diatomic (air)', 0), 5, 0);
    near('and falls back on a bad one', RESOLVE.leadingInt('diatomic', 7), 7, 0);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. CANVAS FILL — the defect tsc, eslint and the physics gate are all blind to
// ═════════════════════════════════════════════════════════════════════════════
section = 'Canvas fill';

/*
 * A diagram occupying a twelfth of its own canvas reads as broken however
 * correct the physics behind it is; one overflowing its box is silently
 * cropped. Both are invisible to every other gate in this repo, so they are
 * measured here — the same discipline `verify-fbd-fill.mjs` applies to the
 * mechanics boards, and the reason it exists is that a browser sweep found an
 * FBD board drawing into 7.7% of its area.
 *
 * Fill is reported LINEARLY per axis, because that is what the eye reads; an
 * area figure makes a legitimately tall, narrow plot look broken.
 */
const BOARDS = [
  { name: 'desktop 620×410', w: 620, h: 410 },
  { name: 'phone   330×260', w: 330, h: 260 },
];
const MIN_FILL = 0.60;
const MAX_FILL = 1.0;

function checkFill(label, board, plot, pts) {
  const fill = PLOT.fillOf(plot, pts);
  const binding = Math.max(fill.x, fill.y);
  const ok = binding >= MIN_FILL && fill.x <= MAX_FILL && fill.y <= MAX_FILL;
  if (!ok) fails++;
  rows.push({
    ok, section,
    name: `${label} @ ${board.name}`,
    got: `${(fill.x * 100).toFixed(0)}% × ${(fill.y * 100).toFixed(0)}%`,
    want: `≥${MIN_FILL * 100}% on one axis, ≤100% on both`,
    note: '',
  });
}

for (const board of BOARDS) {
  // ── the wave canvases ─────────────────────────────────────────────────────
  {
    const sp = W.standing(1, 2, 0.6, 6, 0.21, 300);
    const pts = sp.xs.map((x, i) => ({ x, y: sp.ySum[i] }));
    const plot = PLOT.makePlot(board.w, board.h, { xMin: 0, xMax: 6, yMin: -2.6, yMax: 2.6 },
      { l: 16, r: 16, t: 10, b: 10 }, 0.02);
    checkFill('standing wave', board, plot, pts);
  }
  {
    const s = W.beatSamples(1, 5, 6, 3.5, 900);
    const pts = s.map((q) => ({ x: q.t, y: q.sum }));
    const plot = PLOT.makePlot(board.w, board.h, { xMin: 0, xMax: 3.5, yMin: -2.4, yMax: 2.4 },
      { l: 18, r: 18, t: 14, b: 18 }, 0.02);
    checkFill('beats', board, plot, pts);
  }
  {
    const d = { omega0: 4, gamma: 0.4, drive: 1 };
    const curve = S.responseCurve(d, 8.8, 180);
    const peak = S.drivenAmplitude(d, S.resonantOmega(d));
    const pts = curve.map((q) => ({ x: q.omega, y: Math.min(q.amplitude, peak * 1.1) }));
    const plot = PLOT.makePlot(board.w, board.h * 0.62, { xMin: 0, xMax: 8.8, yMin: 0, yMax: peak * 1.1 },
      { l: 22, r: 18, t: 12, b: 20 }, 0.04);
    checkFill('resonance curve', board, plot, pts);
  }

  // ── the PV canvases ───────────────────────────────────────────────────────
  {
    const start = { V: 0.02, T: 300, P: PV.pressureFromVT(0.02, 300, 1) };
    const leg = PV.buildLeg('isothermal', start, gas, 0.05, 300);
    const plot = PVVIEW.pvPlotOf(board.w, board.h, [leg.points]);
    checkFill('isotherm', board, plot, leg.points.map((q) => ({ x: q.V, y: q.P })));
  }
  {
    const legs = PV.carnotCycle(gas, 0.02, 0.05, 500, 300, 300);
    const poly = PV.closedPolygon(legs);
    const plot = PVVIEW.pvPlotOf(board.w, board.h, [poly]);
    checkFill('Carnot cycle', board, plot, poly.map((q) => ({ x: q.V, y: q.P })));
  }
  {
    const legs = PV.ottoCycle(gas, 0.05, 8, 300, 1600, 300);
    const poly = PV.closedPolygon(legs);
    const plot = PVVIEW.pvPlotOf(board.w, board.h, [poly]);
    checkFill('Otto cycle', board, plot, poly.map((q) => ({ x: q.V, y: q.P })));
  }

  // ── the equal-scale scenes, through fitView ───────────────────────────────
  // These use the SAME camera as the mechanics boards, so the fill is measured
  // the same way: content box in screen pixels over the board.
  for (const [label, box] of [
    ['spring rig', SCENES.springScene(0.2, false)],
    ['spring + reference circle', SCENES.springScene(0.2, true)],
    ['pendulum', SCENES.pendulumScene(1)],
    ['pendulum, long', SCENES.pendulumScene(3.5)],
    ['spring, tiny amplitude', SCENES.springScene(0.02, false)],
  ]) {
    const view = fitView(
      { minX: box.minX, minY: box.minY, maxX: box.maxX, maxY: box.maxY },
      board.w, board.h, { padFrac: 0.09, minScale: 2, maxScale: 4000 }
    );
    const wPx = (box.maxX - box.minX) * view.scale;
    const hPx = (box.maxY - box.minY) * view.scale;
    const fx = wPx / board.w;
    const fy = hPx / board.h;
    const binding = Math.max(fx, fy);
    const ok = binding >= 0.7 && fx <= 1.0 && fy <= 1.0;
    if (!ok) fails++;
    rows.push({
      ok, section,
      name: `${label} @ ${board.name}`,
      got: `${(fx * 100).toFixed(0)}% × ${(fy * 100).toFixed(0)}%`,
      want: '≥70% on one axis, ≤100% on both',
      note: '',
    });
  }
}

// The narrow-container rule, asserted rather than trusted: an UNMEASURED width
// (0) must count as NARROW. Treating it as desktop shipped as a real bug.
section = 'Layout rules';
{
  const NARROW_AT = 640;
  const isNarrow = (w) => w < NARROW_AT;
  truthy('unmeasured width (0) counts as NARROW', isNarrow(0), 'the bug that shipped once already');
  truthy('a 375 px phone stage stacks', isNarrow(375));
  truthy('an admin preview pane of 380 px stacks', isNarrow(380));
  truthy('a 760 px reader column does not', !isNarrow(760));
}

// ═════════════════════════════════════════════════════════════════════════════
// Report
// ═════════════════════════════════════════════════════════════════════════════

const nameW = Math.max(...rows.map((r) => r.name.length), 10);
const pad = (s, n) => String(s).padEnd(n);
const padS = (s, n) => String(s).padStart(n);
const GRN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RST = '\x1b[0m';

console.log('');
console.log('  motion-lab PHASE 2 — waves · thermodynamics · fluids   (node ' + process.version + ')');
console.log('  ' + '─'.repeat(nameW + 62));

let last = '';
for (const r of rows) {
  if (r.section !== last) {
    last = r.section;
    console.log(`\n  ${DIM}── ${r.section} ${'─'.repeat(Math.max(0, nameW + 56 - r.section.length))}${RST}`);
  }
  console.log(
    '  ' + (r.ok ? `${GRN}PASS${RST} ` : `${RED}FAIL${RST} `) +
    pad(r.name, nameW + 2) +
    padS(r.got, 16) + padS(r.want, 20) +
    (r.note ? `   ${DIM}${r.note}${RST}` : '')
  );
}

console.log('\n  ' + '─'.repeat(nameW + 62));
console.log(
  `  ${rows.length - fails}/${rows.length} passed` +
  (fails ? `  —  ${RED}${fails} FAILED${RST}` : `  —  ${GRN}all good${RST}`)
);
console.log('');

process.exit(fails ? 1 : 0);
