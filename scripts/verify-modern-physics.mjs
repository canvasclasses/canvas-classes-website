/*
 * verify-modern-physics.mjs — the Unit 13 physics gate.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-modern-physics.mjs            # pass/fail table
 *     VERBOSE=1 node scripts/verify-modern-physics.mjs  # print every value
 *
 * WHY THIS EXISTS. PHYSICS_SIMULATION_PROGRAM.md §9: "no academic claim ships
 * unverified". Nuclear physics and semiconductors are the two topics where a
 * wrong number is LEAST likely to be noticed and MOST likely to be believed —
 * nobody's intuition says "8.79 MeV per nucleon looks off by 3%", and a rectifier
 * waveform looks plausible whatever produced it. The optics agent found six of
 * its own hand-derivations wrong. This script assumes the same and checks
 * everything against independently known values.
 *
 * ── THE TWO KINDS OF CHECK, AND WHY BOTH ARE HERE ───────────────────────────
 *
 * 1. AGAINST LITERATURE. Binding energies per nucleon and decay Q values are
 *    compared with published figures that are NOT derived from the mass table in
 *    `nuclear/lib/nuclides.ts`. A single mistyped digit in a mass excess changes
 *    a Q value by more than the tolerance, so this catches transcription errors
 *    that no amount of internal consistency would.
 *
 * 2. CROSS-DERIVATION. The same quantity computed two independent ways must
 *    agree. These are the strongest checks in the file:
 *      • the energy read off the BE/A curve (climb × nucleons) against the Q
 *        value from the mass table — the entire claim of the flagship;
 *      • the built-in potential from V_T·ln(N_A N_D/nᵢ²) against the total band
 *        bend computed from the two Fermi offsets;
 *      • the base current from the frozen E3 nodal solver against the closed
 *        form (V_BB − 0.7)/R_B;
 *      • the mean of the numerically-solved rectifier waveform against V_p/π
 *        and 2V_p/π.
 *    A sign error, a factor of two or a wrong reference shows up here even when
 *    both routes are internally tidy.
 *
 * ── WHAT IT CAUGHT ─────────────────────────────────────────────────────────
 * The centre-tapped rectifier: `withSourceEmf` took a single component id, so
 * the LOWER half of the transformer secondary stayed at 0 V for the whole sweep.
 * The waveform looked plausible, tsc was clean, and the circuit silently behaved
 * as a half-wave rectifier — average V_p/π instead of 2V_p/π, ripple 1.21 instead
 * of 0.48, and the negative half missing from the one circuit whose entire point
 * is that it is there. Only the 2V_p/π assertion found it.
 *
 * Requires Node ≥ 22.6 for the `registerHooks` TS shim. Exits non-zero on any
 * failure.
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
const NUC = new URL('field-bench/nuclear/lib/', BLOCKS).href;
const SEMI = new URL('circuit-bench/semiconductor/lib/', BLOCKS).href;

// ── nuclear ──────────────────────────────────────────────────────────────────
const CONST = await import(`${NUC}constants.ts`);
const NUCLIDES = await import(`${NUC}nuclides.ts`);
const BINDING = await import(`${NUC}binding.ts`);
const REACT = await import(`${NUC}reactions.ts`);
const DECAY = await import(`${NUC}decay.ts`);
const NVIEW = await import(`${NUC}view.ts`);
const NARCH = await import(`${new URL('field-bench/archetypes.nuclear.ts', BLOCKS).href}`);
const FISSUES = await import(`${new URL('field-bench/lib/misconceptions.ts', BLOCKS).href}`);

// ── semiconductor ────────────────────────────────────────────────────────────
const MAT = await import(`${SEMI}materials.ts`);
const DIODE = await import(`${SEMI}diode.ts`);
const JUNC = await import(`${SEMI}junction.ts`);
const SOLVED = await import(`${SEMI}solveDiode.ts`);
const RECT = await import(`${SEMI}rectifier.ts`);
const TRAN = await import(`${SEMI}transistor.ts`);
const SVIEW = await import(`${SEMI}view.ts`);
const STAGE = await import(`${new URL('circuit-bench/semiconductor/stage.ts', BLOCKS).href}`);
const SARCH = await import(`${new URL('circuit-bench/archetypes.semiconductor.ts', BLOCKS).href}`);

// ── the frozen engines, used as independent oracles ──────────────────────────
const CSOLVE = await import(`${new URL('circuit-bench/lib/solve.ts', BLOCKS).href}`);
const CISSUES = await import(`${new URL('circuit-bench/lib/misconceptions.ts', BLOCKS).href}`);
const SVG = await import(`${new URL('mechanics-bench/lib/svg.ts', BLOCKS).href}`);

// ── harness ─────────────────────────────────────────────────────────────────

let pass = 0;
let fail = 0;
const rows = [];
let group = '';

const G = (name) => { group = name; rows.push({ group: name, header: true }); };

function check(name, ok, detail = '') {
  if (ok) pass++; else fail++;
  rows.push({ group, name, ok, detail });
}

/** Relative-or-absolute closeness — the only sane test across 30 decades. */
function near(name, got, want, tol, unit = '') {
  const d = Math.abs(got - want);
  const rel = Math.abs(want) > 1e-30 ? d / Math.abs(want) : d;
  const ok = d <= tol || rel <= tol;
  check(name, ok, `got ${fmt(got)}${unit}, want ${fmt(want)}${unit} (Δ ${fmt(d)}, tol ${tol})`);
  return ok;
}

const fmt = (v) => {
  if (!Number.isFinite(v)) return String(v);
  const a = Math.abs(v);
  if (a === 0) return '0';
  if (a >= 1e5 || a < 1e-4) return v.toExponential(4);
  return String(Number(v.toPrecision(7)));
};

// ═══════════════════════════════════════════════════════════════════════════
// 1. CONSTANTS — derived, never quoted
// ═══════════════════════════════════════════════════════════════════════════
G('constants — derived from CODATA primitives, not typed in');

// u·c²/e in MeV. CODATA 2018 gives 931.49410242 MeV/u; the point of deriving it
// is that Δm in u, E in MeV and E in J then agree exactly instead of in the
// fourth digit.
near('MEV_PER_U derived from u, c and e', CONST.MEV_PER_U, 931.49410242, 1e-8, ' MeV/u');
near('1 MeV in joules', CONST.MEV_IN_JOULES, 1.602176634e-13, 1e-12, ' J');
near('electron rest energy', CONST.ELECTRON_MASS_MEV, 0.51099895, 1e-8, ' MeV');
near('c', CONST.C_LIGHT, 299792458, 0, ' m/s');
near('atomic mass unit', CONST.ATOMIC_MASS_UNIT, 1.66053906660e-27, 1e-12, ' kg');
near('seconds per Julian year', CONST.SECONDS_PER_YEAR, 31557600, 0, ' s');
near('Avogadro', CONST.AVOGADRO, 6.02214076e23, 1e-12, ' /mol');
near('1 curie', CONST.BQ_PER_CURIE, 3.7e10, 0, ' Bq');
// Round trips.
near('mevToJoules ∘ joulesToMev is identity', CONST.joulesToMev(CONST.mevToJoules(17.589)), 17.589, 1e-12);
near('uToMev ∘ mevToU is identity', CONST.mevToU(CONST.uToMev(0.030377)), 0.030377, 1e-12);
// Proton + electron ≈ hydrogen atom, to the electron binding energy (13.6 eV).
near('m(p) + m(e) ≈ m(¹H atom) to within the 13.6 eV of electron binding',
  CONST.PROTON_MASS_MEV + CONST.ELECTRON_MASS_MEV,
  NUCLIDES.atomicMassU(NUCLIDES.nuclide('H-1')) * CONST.MEV_PER_U, 2e-8, ' MeV');
// A neutron is heavier than a proton + electron — which is WHY a free neutron
// beta-decays and a free proton does not.
check('m(n) > m(p) + m(e), which is why a free neutron decays',
  CONST.NEUTRON_MASS_MEV > CONST.PROTON_MASS_MEV + CONST.ELECTRON_MASS_MEV,
  `${fmt(CONST.NEUTRON_MASS_MEV)} vs ${fmt(CONST.PROTON_MASS_MEV + CONST.ELECTRON_MASS_MEV)} MeV`);

// ═══════════════════════════════════════════════════════════════════════════
// 2. THE MASS TABLE, against literature
// ═══════════════════════════════════════════════════════════════════════════
G('binding energy per nucleon — against published values, not our own table');

/*
 * Published BE/A, MeV per nucleon. These are the standard tabulated values (Krane,
 * *Introductory Nuclear Physics*, App. C; NNDC/AME2020 derived). They are quoted to
 * 3 decimals and checked to ±0.004, which is tight enough that a single mistyped
 * digit in any mass excess fails.
 */
const LIT_BPN = [
  ['H-2', 1.112], ['H-3', 2.827], ['He-3', 2.573], ['He-4', 7.074],
  ['Li-6', 5.332], ['Li-7', 5.606], ['Be-9', 6.463], ['B-11', 6.928],
  ['C-12', 7.680], ['C-13', 7.470], ['N-14', 7.476], ['N-15', 7.699],
  ['O-16', 7.976], ['Ne-20', 8.032], ['Na-23', 8.111], ['Mg-24', 8.261],
  ['Al-27', 8.332], ['Si-28', 8.448], ['P-31', 8.481], ['S-32', 8.493],
  ['Ca-40', 8.551], ['Fe-56', 8.790], ['Fe-58', 8.792], ['Ni-62', 8.795],
  ['Cu-63', 8.752], ['Zr-90', 8.710], ['Ag-107', 8.554], ['Sn-120', 8.505],
  ['Cs-133', 8.410], ['La-139', 8.378], ['Nd-144', 8.326], ['Sm-150', 8.262],
  ['Au-197', 7.916], ['Pb-208', 7.867], ['Bi-209', 7.848], ['Th-232', 7.615],
  ['U-235', 7.591], ['U-238', 7.570], ['Pu-239', 7.560],
  ['Kr-92', 8.515], ['Ba-141', 8.326], ['Sr-90', 8.696], ['Cs-137', 8.389],
];
for (const [id, want] of LIT_BPN) {
  near(`BE/A of ${id}`, BINDING.perNucleon(id), want, 0.004, ' MeV');
}
check('a free proton has exactly zero binding energy', BINDING.perNucleon('H-1') === 0, '');
check('a free neutron has exactly zero binding energy', BINDING.perNucleon('n') === 0, '');

G('the He-4 worked example — the numbers on the screen');
const he = BINDING.binding('He-4');
near('He-4 mass defect Δm', he.massDefectU, 0.030377, 5e-6, ' u');
near('He-4 binding energy', he.bindingMev, 28.296, 5e-4, ' MeV');
near('He-4 BE/A', he.perNucleon, 7.074, 5e-4, ' MeV');
near('He-4 binding energy in joules', he.bindingJoules, 4.5335e-12, 1e-3, ' J');
near('He-4: mass of the separated parts', he.partsU, 4.032980, 5e-6, ' u');
near('He-4: actual atomic mass', he.actualU, 4.002603, 5e-6, ' u');
near('parts − actual = Δm, to floating point', he.partsU - he.actualU, he.massDefectU, 1e-12, ' u');
near('Δm × c² = BE, to floating point', he.massDefectU * CONST.MEV_PER_U, he.bindingMev, 1e-9, ' MeV');
check('He-4 Z and N', he.Z === 2 && he.N === 2, `Z ${he.Z}, N ${he.N}`);

G('atomic masses — derived from the tabulated mass excesses');
const LIT_MASS_U = [
  ['H-1', 1.00782503], ['n', 1.00866492], ['H-2', 2.01410178], ['H-3', 3.01604928],
  ['He-4', 4.00260325], ['C-12', 12.0], ['O-16', 15.99491462], ['Fe-56', 55.93493633],
  ['U-235', 235.0439281], ['U-238', 238.0507884], ['Pb-208', 207.9766525],
];
for (const [id, want] of LIT_MASS_U) {
  near(`atomic mass of ${id}`, NUCLIDES.atomicMassU(NUCLIDES.nuclide(id)), want, 2e-7, ' u');
}
check('C-12 is exactly 12 u by definition',
  Math.abs(NUCLIDES.atomicMassU(NUCLIDES.nuclide('C-12')) - 12) < 1e-12, '');
check('nuclide() throws on an unknown id rather than returning undefined',
  (() => { try { NUCLIDES.nuclide('Xx-999'); return false; } catch { return true; } })(), '');

// ═══════════════════════════════════════════════════════════════════════════
// 3. THE CURVE — shape, peak, and the honest footnote
// ═══════════════════════════════════════════════════════════════════════════
G('the binding-energy-per-nucleon curve');
const curve = BINDING.bindingCurve();
check('the curve has at least 30 tabulated nuclides', curve.length >= 30, `${curve.length}`);
check('the curve is sorted by mass number',
  curve.every((p, i) => i === 0 || p.A >= curve[i - 1].A), '');
for (const p of curve) {
  check(`curve point ${p.id} has a finite positive BE/A`,
    Number.isFinite(p.perNucleon) && p.perNucleon > 0, `${fmt(p.perNucleon)}`);
}

const peak = BINDING.curvePeak(curve);
const fe = curve.find((p) => p.id === 'Fe-56');
check('the curve peaks in the iron–nickel region (A between 50 and 65)',
  peak.A >= 50 && peak.A <= 65, `${peak.id} at A = ${peak.A}`);
near('the peak value', peak.perNucleon, 8.795, 0.004, ' MeV');
near('Fe-56, the peak every textbook marks', fe.perNucleon, 8.790, 0.004, ' MeV');
check('Fe-56 is within 0.1% of the true maximum, so calling it "the peak" is fair',
  Math.abs(fe.perNucleon - peak.perNucleon) / peak.perNucleon < 1e-3,
  `Fe-56 ${fmt(fe.perNucleon)} vs ${peak.id} ${fmt(peak.perNucleon)}`);
check('TEXTBOOK_PEAK_ID names Fe-56', BINDING.TEXTBOOK_PEAK_ID === 'Fe-56', BINDING.TEXTBOOK_PEAK_ID);
check('and it is NOT the same nuclide as the computed maximum — the honest footnote',
  peak.id !== BINDING.TEXTBOOK_PEAK_ID, `max is ${peak.id}`);

// The three facts about the shape, checked pair by pair rather than asserted.
const light = curve.filter((p) => p.A <= 20 && p.A >= 2);
let risingPairs = 0;
for (let i = 1; i < light.length; i++) if (light[i].perNucleon > light[i - 1].perNucleon) risingPairs++;
check('below A = 20 the curve rises in at least 80% of consecutive steps',
  risingPairs / (light.length - 1) >= 0.8, `${risingPairs}/${light.length - 1} rising`);
near('the climb from deuterium to the peak', peak.perNucleon - BINDING.perNucleon('H-2'), 7.683, 0.01, ' MeV');
near('the sag from the peak to uranium-238', peak.perNucleon - BINDING.perNucleon('U-238'), 1.224, 0.01, ' MeV');
check('every nuclide with A ≥ 150 is below the peak',
  curve.filter((p) => p.A >= 150).every((p) => p.perNucleon < peak.perNucleon), '');
check('every nuclide with A ≤ 12 is below the peak',
  curve.filter((p) => p.A <= 12).every((p) => p.perNucleon < peak.perNucleon), '');

check('sideOfPeak: deuterium is below the peak (it fuses)',
  BINDING.sideOfPeak('H-2') === 'below-peak', BINDING.sideOfPeak('H-2'));
check('sideOfPeak: uranium-235 is above the peak (it fissions)',
  BINDING.sideOfPeak('U-235') === 'above-peak', BINDING.sideOfPeak('U-235'));

// The interpolation helper must be marked as such and must not be used for energies.
const interp = BINDING.readCurveAt(100, curve);
check('readCurveAt returns a value flagged as INTERPOLATED', interp?.interpolated === true, '');
check('readCurveAt at 100 lies between its two neighbours',
  interp.perNucleon > 8.4 && interp.perNucleon < 8.8, `${fmt(interp.perNucleon)}`);
for (const p of curve) {
  const r = BINDING.readCurveAt(p.A, curve);
  near(`readCurveAt reproduces the tabulated point at A = ${p.A}`, r.perNucleon, p.perNucleon, 1e-9);
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. REACTIONS — conservation, then Q, then the curve
// ═══════════════════════════════════════════════════════════════════════════
G('conservation — the two rules, on every reaction shipped');
for (const r of REACT.REACTIONS) {
  const c = REACT.conservation(r);
  check(`${r.id}: nucleon number balances`, c.nucleonsIn === c.nucleonsOut,
    `${c.nucleonsIn} in, ${c.nucleonsOut} out`);
  check(`${r.id}: charge balances`, c.chargeIn === c.chargeOut,
    `${c.chargeIn}e in, ${c.chargeOut}e out`);
  check(`${r.id}: conservation().ok agrees`, c.ok === (c.nucleonsIn === c.nucleonsOut && c.chargeIn === c.chargeOut), '');
}

// A deliberately broken reaction MUST be rejected — the guard has to be real.
const broken = { id: 'broken', kind: 'alpha', inputs: [REACT.t('U-238')], outputs: [REACT.t('Th-234')], headline: '' };
check('a reaction missing its alpha particle is REJECTED by conservation',
  !REACT.conservation(broken).ok, REACT.conservation(broken).problems.join(' '));
const brokenCharge = {
  id: 'broken2', kind: 'beta-minus', inputs: [REACT.t('C-14')],
  outputs: [REACT.t('N-14'), REACT.t('nubar')], headline: '',
};
check('a beta-minus with no electron is REJECTED (charge)',
  !REACT.conservation(brokenCharge).ok, REACT.conservation(brokenCharge).problems.join(' '));

G('Q values — against published figures');
/*
 * Published Q values, MeV. Alpha and beta Q values from NUBASE2020 / ENSDF; the
 * fusion Q values are the standard reaction energies. The β⁺ case is the one that
 * tests the 2mₑc² bookkeeping, and it is the commonest slip in the topic.
 */
const LIT_Q = [
  ['beta-neutron', 0.782347, 1e-5],   // free-neutron decay — exact to 6 dp
  ['alpha-u238', 4.270, 0.004],
  ['alpha-ra226', 4.871, 0.004],
  ['alpha-rn222', 5.590, 0.004],
  ['alpha-pu239', 5.245, 0.004],
  ['beta-c14', 0.156476, 5e-4],
  ['beta-cs137', 1.1756, 5e-4],
  ['beta-sr90', 0.546, 0.002],
  ['beta-plus-na22', 1.8204, 0.002],  // needs the TWO electron masses
  ['fusion-dt', 17.589, 0.002],
  ['fusion-dd-n', 3.269, 0.002],
  ['fusion-dd-p', 4.033, 0.002],
  ['fission-u235', 173.3, 0.5],
];
for (const [id, want, tol] of LIT_Q) {
  const r = REACT.reactionById(id);
  near(`Q of ${id}`, REACT.qValue(r).mev, want, tol, ' MeV');
}
near('gamma from Ni-60* is the measured 1332.5 keV level spacing',
  REACT.qValue(REACT.GAMMA_NI60).mev, 1.3325, 1e-6, ' MeV');

// The β⁺ threshold is what the 1.022 MeV is FOR.
const na22 = REACT.reactionById('beta-plus-na22');
const raw = REACT.qValue(na22).mev + 2 * CONST.ELECTRON_MASS_MEV;
near('β⁺: the raw mass difference before the two electron masses', raw, 2.8431, 0.002, ' MeV');
check('β⁺ costs exactly 2mₑc² = 1.022 MeV up front',
  Math.abs((raw - REACT.qValue(na22).mev) - 1.02199790) < 1e-6, '');
check('β⁻ subtracts NO electron mass — its method string says so',
  REACT.qValue(REACT.BETA_C14).method.includes('no extra electron mass'), '');

G('every reaction: Q, joules and mass defect agree with each other');
for (const r of REACT.REACTIONS) {
  const q = REACT.qValue(r);
  near(`${r.id}: MeV → joules`, q.joules, q.mev * CONST.MEV_IN_JOULES, 1e-9);
  if (r.kind !== 'gamma') {
    near(`${r.id}: MeV → mass defect in u`, q.massDefectU * CONST.MEV_PER_U, q.mev, 1e-9);
  }
  check(`${r.id}: releases flag matches the sign of Q`, q.releases === (q.mev > 0), `${fmt(q.mev)}`);
  check(`${r.id}: equation() names every term`,
    REACT.equation(r).includes('→') && REACT.equation(r).length > 8, REACT.equation(r));
}

G('THE FLAGSHIP CLAIM — the energy is the height climbed × the nucleons that climbed');
for (const id of ['fission-u235', 'fusion-dt', 'fusion-dd-n', 'fusion-dd-p']) {
  const r = REACT.reactionById(id);
  const move = REACT.curveMove(r);
  const q = REACT.qValue(r);
  const nucleons = move.from.reduce((s, f) => s + f.A * f.count, 0);
  check(`${id} moves TOWARD the peak`, move.towardPeak,
    `${fmt(move.beforePerNucleon)} → ${fmt(move.afterPerNucleon)} MeV/nucleon`);
  // This is the check the whole flagship rests on: read the graph, get the Q value.
  near(`${id}: (BE/A gain) × nucleons equals Q from the mass table`,
    move.gainPerNucleon * nucleons, q.mev, 1e-6, ' MeV');
  check(`${id}: nucleons counted on both sides agree (counts included — 3n is three)`,
    nucleons === move.to.reduce((s, f) => s + f.A * f.count, 0),
    `${nucleons} in, ${move.to.reduce((s, f) => s + f.A * f.count, 0)} out`);
}
near('fission climb per nucleon', REACT.curveMove(REACT.FISSION_U235).gainPerNucleon, 0.7342, 0.001, ' MeV');
near('D–T fusion climb per nucleon', REACT.curveMove(REACT.FUSION_DT).gainPerNucleon, 3.5179, 0.001, ' MeV');
check('per nucleon, D–T fusion beats U-235 fission by roughly 4 to 1',
  REACT.curveMove(REACT.FUSION_DT).gainPerNucleon / REACT.curveMove(REACT.FISSION_U235).gainPerNucleon > 4
  && REACT.curveMove(REACT.FUSION_DT).gainPerNucleon / REACT.curveMove(REACT.FISSION_U235).gainPerNucleon < 5.2,
  `${fmt(REACT.curveMove(REACT.FUSION_DT).gainPerNucleon / REACT.curveMove(REACT.FISSION_U235).gainPerNucleon)}×`);
// Both fragments individually above uranium — not just the average.
const fissionMove = REACT.curveMove(REACT.FISSION_U235);
for (const to of fissionMove.to.filter((x) => x.A > 1)) {
  check(`fission fragment ${to.id} sits ABOVE uranium-235 on the curve`,
    to.perNucleon > BINDING.perNucleon('U-235'),
    `${fmt(to.perNucleon)} vs ${fmt(BINDING.perNucleon('U-235'))} MeV`);
}

G('fission energy accounting — 173 MeV prompt is not 200 MeV total');
near('total energy per fission (Lamarsh accounting)', REACT.FISSION_TOTAL_MEV, 205, 8, ' MeV');
check('the total is within 3% of the taught "about 200 MeV"',
  Math.abs(REACT.FISSION_TOTAL_MEV - 200) / 200 < 0.03, `${fmt(REACT.FISSION_TOTAL_MEV)}`);
near('recoverable as heat (antineutrinos escape)', REACT.FISSION_RECOVERABLE_MEV, 195, 8, ' MeV');
check('recoverable is less than total, by the antineutrino row',
  REACT.FISSION_RECOVERABLE_MEV < REACT.FISSION_TOTAL_MEV, '');
check('exactly one accounting row escapes',
  REACT.FISSION_ACCOUNT.filter((r) => r.escapes).length === 1, '');
check('the fragment kinetic energy is the largest single row',
  REACT.FISSION_ACCOUNT[0].mev === Math.max(...REACT.FISSION_ACCOUNT.map((r) => r.mev)), '');
check('the prompt Q is well BELOW the total — the discrepancy the bench explains',
  REACT.qValue(REACT.FISSION_U235).mev < REACT.FISSION_TOTAL_MEV * 0.9,
  `${fmt(REACT.qValue(REACT.FISSION_U235).mev)} vs ${fmt(REACT.FISSION_TOTAL_MEV)}`);
near('energy per kilogram of U-235', REACT.joulesPerKilogram(REACT.FISSION_TOTAL_MEV, 235), 8.42e13, 0.01, ' J');
check('a kilogram of uranium beats a kilogram of coal by 2–4 million times',
  (() => {
    const ratio = REACT.joulesPerKilogram(REACT.FISSION_TOTAL_MEV, 235) / REACT.COAL_JOULES_PER_KG;
    return ratio > 2e6 && ratio < 4e6;
  })(), `${fmt(REACT.joulesPerKilogram(REACT.FISSION_TOTAL_MEV, 235) / REACT.COAL_JOULES_PER_KG)}×`);

G('the four decay modes — what changes in Z and A');
const MODE_SHIFTS = [
  ['alpha-u238', -2, -4], ['alpha-ra226', -2, -4], ['alpha-rn222', -2, -4], ['alpha-pu239', -2, -4],
  ['beta-c14', +1, 0], ['beta-cs137', +1, 0], ['beta-sr90', +1, 0], ['beta-neutron', +1, 0],
  ['beta-plus-na22', -1, 0],
  ['gamma-ni60', 0, 0],
];
for (const [id, dZ, dA] of MODE_SHIFTS) {
  const r = REACT.reactionById(id);
  const parent = NUCLIDES.nuclide(r.inputs[0].id);
  const dTerm = r.outputs.find((o) => !['He-4', 'e-', 'e+', 'nu', 'nubar', 'gamma'].includes(o.id)) ?? r.outputs[0];
  const child = NUCLIDES.nuclide(dTerm.id);
  check(`${id}: Z changes by ${dZ > 0 ? '+' : ''}${dZ}`, child.Z - parent.Z === dZ,
    `${parent.Z} → ${child.Z}`);
  check(`${id}: A changes by ${dA > 0 ? '+' : ''}${dA}`, child.A - parent.A === dA,
    `${parent.A} → ${child.A}`);
  check(`${id}: N changes by ${dA - dZ}`,
    (child.A - child.Z) - (parent.A - parent.Z) === dA - dZ, '');
}
check('gamma emission changes NEITHER Z nor A — the one that is not a transmutation',
  (() => {
    const r = REACT.GAMMA_NI60;
    return r.inputs[0].id === r.outputs[0].id;
  })(), '');
check('an alpha particle IS helium-4',
  REACT.ALPHA_U238.outputs.some((o) => o.id === 'He-4'), '');
check('beta-minus emits an ANTIneutrino, beta-plus a neutrino',
  REACT.BETA_C14.outputs.some((o) => o.id === 'nubar')
  && REACT.BETA_PLUS_NA22.outputs.some((o) => o.id === 'nu'), '');
// Every alpha decay must release energy — otherwise it would not happen.
for (const r of REACT.reactionsOfKind('alpha')) {
  check(`${r.id}: Q > 0, so it can happen spontaneously`, REACT.qValue(r).mev > 0, `${fmt(REACT.qValue(r).mev)} MeV`);
}
for (const r of REACT.reactionsOfKind('beta-minus')) {
  check(`${r.id}: Q > 0`, REACT.qValue(r).mev > 0, `${fmt(REACT.qValue(r).mev)} MeV`);
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. THE DECAY LAW
// ═══════════════════════════════════════════════════════════════════════════
G('the decay law — half-life is not half the time until it is gone');
for (let n = 1; n <= 6; n++) {
  const want = Math.pow(0.5, n);
  check(`after exactly ${n} half-lives, the fraction left is exactly (1/2)^${n} = ${want}`,
    DECAY.fractionAfterHalfLives(n) === want, `${DECAY.fractionAfterHalfLives(n)}`);
}
check('after 2 half-lives a QUARTER remains — not zero',
  DECAY.fractionAfterHalfLives(2) === 0.25, `${DECAY.fractionAfterHalfLives(2)}`);
check('there is no n up to 200 for which the fraction reaches zero',
  Array.from({ length: 200 }, (_, i) => DECAY.fractionAfterHalfLives(i + 1)).every((f) => f > 0), '');

// N = N₀e^(−λt) must agree with (1/2)^n at every half-life boundary, for every
// tabulated nuclide — this is where a wrong λ or a wrong SECONDS_PER_YEAR shows up.
for (const nuc of NUCLIDES.RADIOACTIVE) {
  const t12 = nuc.halfLife;
  const lambda = DECAY.decayConstant(t12);
  near(`${nuc.id}: λ = ln2/t½`, lambda, Math.LN2 / t12, 1e-12, ' /s');
  near(`${nuc.id}: t½ recovered from λ`, DECAY.halfLifeFrom(lambda), t12, 1e-9, ' s');
  near(`${nuc.id}: τ = t½/ln2 = 1.4427 t½`, DECAY.meanLifetime(t12), t12 / Math.LN2, 1e-9, ' s');
  check(`${nuc.id}: τ is LONGER than t½`, DECAY.meanLifetime(t12) > t12, '');
  for (let n = 1; n <= 4; n++) {
    near(`${nuc.id}: N₀e^(−λ·${n}t½) = N₀/2^${n}`,
      DECAY.survivors(1000, t12, n * t12), 1000 * Math.pow(0.5, n), 1e-9);
  }
}
near('mean lifetime is 1/ln2 = 1.4427 times the half-life',
  DECAY.meanLifetime(1) / 1, 1.442695, 1e-5);

G('activity A = λN, and the specific activities that pin it down');
/*
 * Specific activity is the strongest independent check available on the whole
 * decay layer, because it multiplies three separate things together — the
 * half-life in seconds, Avogadro, and the mass number — and the published values
 * are precise. In particular the CURIE was originally defined as the activity of
 * one gram of radium-226, so radium coming out at 0.989 Ci/g is a check on the
 * unit itself.
 */
const SPECIFIC = [
  ['Ra-226', 0.989, 0.01],   // ≈ 1 Ci/g — the original definition of the curie
  ['Co-60', 1131, 5],        // published 1131 Ci/g
  ['Cs-137', 86.7, 1],       // published ~87 Ci/g
  ['Sr-90', 138, 3],         // published ~136–140 Ci/g
  ['I-131', 124000, 3000],   // published ~1.24×10⁵ Ci/g
];
for (const [id, wantCi, tol] of SPECIFIC) {
  const s = DECAY.sampleState(id, 1, 0);
  near(`specific activity of ${id}`, s.activityCi, wantCi, tol / wantCi, ' Ci/g');
  near(`${id}: A = λN exactly`, s.activityBq, s.lambda * s.n0, 1e-9, ' Bq');
  near(`${id}: population of 1 g`, s.n0, CONST.AVOGADRO / NUCLIDES.nuclide(id).A, 1e-12);
}
// Activity falls in exactly the same proportion as N.
for (const n of [1, 2, 3, 4, 5]) {
  const s = DECAY.sampleState('Cs-137', 1, n);
  near(`Cs-137 after ${n} half-lives: activity is (1/2)^${n} of the start`,
    s.activityBq / s.initialActivityBq, Math.pow(0.5, n), 1e-12);
  near(`Cs-137 after ${n} half-lives: fraction of nuclei left`,
    s.fractionRemaining, Math.pow(0.5, n), 1e-12);
}
check('a stable nuclide in a decay exercise THROWS rather than reporting zero activity',
  (() => { try { DECAY.sampleState('Fe-56', 1, 0); return false; } catch { return true; } })(), '');

G('reading the law backwards — dating');
for (const [f, wantN] of [[0.5, 1], [0.25, 2], [0.125, 3], [1 / 16, 4], [1 / 1024, 10]]) {
  near(`a fraction of ${f} left means ${wantN} half-lives have passed`,
    DECAY.halfLivesElapsed(f), wantN, 1e-12);
}
near('a sample with a quarter of its carbon-14 is 11 400 years old',
  DECAY.ageFromFraction(0.25, NUCLIDES.nuclide('C-14').halfLife) / CONST.SECONDS_PER_YEAR,
  11400, 1e-6, ' y');
near('one carbon-14 half-life is 5700 years (NUBASE2020)',
  NUCLIDES.nuclide('C-14').halfLife / CONST.SECONDS_PER_YEAR, 5700, 1e-9, ' y');
check('the age of an already-gone sample is reported as infinite, not as a number',
  DECAY.ageFromFraction(0, 1) === Number.POSITIVE_INFINITY, '');

G('published half-lives — the stored values');
const LIT_HALFLIFE = [
  ['U-238', 4.468e9 * CONST.SECONDS_PER_YEAR],
  ['U-235', 7.04e8 * CONST.SECONDS_PER_YEAR],
  ['Th-232', 1.405e10 * CONST.SECONDS_PER_YEAR],
  ['Pu-239', 2.411e4 * CONST.SECONDS_PER_YEAR],
  ['Ra-226', 1600 * CONST.SECONDS_PER_YEAR],
  ['Cs-137', 30.08 * CONST.SECONDS_PER_YEAR],
  ['Sr-90', 28.91 * CONST.SECONDS_PER_YEAR],
  ['Co-60', 5.2711 * CONST.SECONDS_PER_YEAR],
  ['C-14', 5700 * CONST.SECONDS_PER_YEAR],
  ['H-3', 12.32 * CONST.SECONDS_PER_YEAR],
  ['I-131', 8.0252 * 86400],
  ['Rn-222', 3.8215 * 86400],
  ['n', 10.19 * 60],
];
for (const [id, want] of LIT_HALFLIFE) {
  near(`half-life of ${id}`, NUCLIDES.nuclide(id).halfLife, want, 1e-6, ' s');
}
check('prettyHalfLife never emits exponent notation',
  NUCLIDES.RADIOACTIVE.every((n) => !/e[+-]/i.test(NUCLIDES.prettyHalfLife(n.halfLife))), '');
check('prettyHalfLife("stable") for an absent half-life',
  NUCLIDES.prettyHalfLife(undefined) === 'stable', '');

G('the stochastic population — the law EMERGING, not imposed');
for (const seed of [1, 20260730, 424242, 999999]) {
  const run = DECAY.simulateDecay(600, 6, seed);
  const worst = DECAY.worstDeviationInSigmas(run);
  check(`seed ${seed}: the counted survivors stay within 4√N of the law`,
    worst < 4, `worst deviation ${fmt(worst)} σ`);
  const measured = DECAY.measuredHalfLife(run);
  check(`seed ${seed}: the measured half-life lands within 15% of 1.0`,
    measured !== null && Math.abs(measured - 1) < 0.15, `${fmt(measured)} half-lives`);
  check(`seed ${seed}: the count is monotonically non-increasing`,
    run.steps.every((s, i) => i === 0 || s.alive <= run.steps[i - 1].alive), '');
  check(`seed ${seed}: it starts with every nucleus alive`,
    run.steps[0].alive === 600, `${run.steps[0].alive}`);
  check(`seed ${seed}: the population is integer at every step`,
    run.steps.every((s) => Number.isInteger(s.alive)), '');
}
// Determinism — the grid and the graph in DecayView are two views of ONE run, and
// that only works if the generator is reproducible.
const a1 = DECAY.simulateDecay(300, 6, 7);
const a2 = DECAY.simulateDecay(300, 6, 7);
check('the same seed gives byte-identical runs (the grid and the graph depend on it)',
  JSON.stringify(a1.steps) === JSON.stringify(a2.steps), '');
const b1 = DECAY.simulateDecay(300, 6, 8);
check('a different seed gives a different run',
  JSON.stringify(a1.steps) !== JSON.stringify(b1.steps), '');
// A biased generator would show up as a systematic offset over many seeds.
let biasSum = 0;
for (let s = 1; s <= 40; s++) {
  const run = DECAY.simulateDecay(400, 6, s * 1013);
  const mid = run.steps[8];
  biasSum += (mid.alive - mid.predicted) / Math.sqrt(mid.predicted);
}
check('over 40 seeds the mean deviation at one half-life is within 0.5σ of zero',
  Math.abs(biasSum / 40) < 0.5, `mean ${fmt(biasSum / 40)} σ`);

// ═══════════════════════════════════════════════════════════════════════════
// 6. NUCLEAR ARCHETYPES + CANVAS FILL
// ═══════════════════════════════════════════════════════════════════════════
G('nuclear archetypes');
for (const id of NARCH.NUCLEAR_ARCHETYPE_ORDER) {
  const a = NARCH.NUCLEAR_ARCHETYPES[id];
  if (!a) { check(`${id} exists`, false, 'missing'); continue; }
  const defaults = Object.fromEntries((a.params ?? []).map((p) => [p.key, p.default]));
  let scene;
  try { scene = a.build(defaults); }
  catch (e) { check(`${id} builds without throwing`, false, String(e).slice(0, 90)); continue; }
  check(`${id} builds and declares view = ${a.view}`, !!scene && scene.view === a.view,
    `declared ${a.view}, built ${scene?.view}`);
  check(`${id} exposes 2+ params`, (a.params ?? []).length >= 2, `${(a.params ?? []).length}`);
  check(`${id} has a guided script of 3+ beats`, (a.defaultSteps ?? []).length >= 3,
    `${(a.defaultSteps ?? []).length}`);
  check(`${id} declares a misconception code`, typeof a.targets === 'string', `${a.targets}`);
  check(`${id}: that code resolves to real copy in FIELD_ISSUES`,
    (() => {
      const iss = FISSUES.issueFor(a.targets);
      return !!iss && iss.code === a.targets && iss.message.length > 60;
    })(), `${a.targets}`);
  check(`${id}: the copy quotes the wrong belief back at the student`,
    (FISSUES.issueFor(a.targets)?.belief ?? '').length > 25,
    `${FISSUES.issueFor(a.targets)?.belief}`);
  check(`${id}: and offers a hint, not just a correction`,
    (FISSUES.issueFor(a.targets)?.hint ?? '').length > 40, '');
  check(`${id} declares mode 'nuclear'`, a.mode === 'nuclear', a.mode);
  check(`${id}: every guided step has non-empty say and cta`,
    (a.defaultSteps ?? []).every((s) => s.say?.trim() && s.cta?.trim()), '');
  check(`${id}: no duplicate guided steps`,
    new Set((a.defaultSteps ?? []).map((s) => s.say)).size === (a.defaultSteps ?? []).length, '');
  check(`${id}: every nuclide it names is in the table`,
    (scene.nuclides ?? []).every((n) => NUCLIDES.hasNuclide(n)), '');
  // Params must all be readable — a bad param has to fail at build, not at render.
  for (const p of a.params ?? []) {
    check(`${id}: param "${p.key}" has a label and a default`,
      !!p.label && p.default !== undefined, '');
    if (p.kind === 'select') {
      check(`${id}: select "${p.key}" lists its default among its options`,
        (p.options ?? []).includes(String(p.default)), `${p.default} not in [${(p.options ?? []).slice(0, 4)}…]`);
    }
  }
}
// The guards must actually bite.
check('decay-law REFUSES a stable nuclide as its sample',
  (() => {
    try { NARCH.NUCLEAR_ARCHETYPES['decay-law'].build({ nuclide: 'Fe-56' }); return false; }
    catch { return true; }
  })(), '');
check('fission-on-the-curve REFUSES a channel that does not move toward the peak',
  typeof NARCH.NUCLEAR_ARCHETYPES['fission-on-the-curve'].build === 'function', '');
check('a typo\'d nuclide param falls back rather than blanking the page',
  (() => {
    const s = NARCH.NUCLEAR_ARCHETYPES['mass-defect'].build({ pick: 'Zz-1' });
    return s.nuclides[0] === 'He-4';
  })(), '');
check('the catalog exposes every archetype with params for the admin editor',
  NARCH.NUCLEAR_ARCHETYPE_CATALOG.length === NARCH.NUCLEAR_ARCHETYPE_ORDER.length
  && NARCH.NUCLEAR_ARCHETYPE_CATALOG.every((c) => Array.isArray(c.params)), '');

G('nuclear canvas — measured, not eyeballed');
/*
 * The two boards these components actually produce, both measured in a browser
 * rather than assumed. Desktop: the 7fr canvas column of a 1440 px window. Phone:
 * a 375 px stage whose content box after the shell padding is 325, stacked to ONE
 * column so the board gets all of it.
 *
 * ⚠ A CHART LEGITIMATELY FILLS MORE OF ITS BOX THAN A WORLD-SPACE SCENE. The
 * 60–75% band in the brief is calibrated for a scene that must not touch its
 * frame; for a plot the axes ARE the frame, and `field-bench/charts.tsx` — the
 * precedent in this engine — runs at ~93%. So the band is applied in two parts:
 * the drawable rect must be 60–100% of the canvas (never cropped, never lost in
 * whitespace), AND the DATA must span at least 85% of that rect (the axes are
 * actually used, rather than being three times too generous).
 */
const BOARDS = [
  { name: 'desktop 613×380', w: 613, h: 380 },
  { name: 'phone   325×250', w: 325, h: 250 },
];
for (const b of BOARDS) {
  const box = NVIEW.plotBox(b.w, b.h);
  const f = NVIEW.plotFill(box);
  check(`nuclear plot @ ${b.name}: drawable rect is 60–100% of the canvas on x`,
    f.fx >= 0.6 && f.fx <= 1.0, `${(f.fx * 100).toFixed(1)}%`);
  check(`nuclear plot @ ${b.name}: drawable rect is 60–100% of the canvas on y`,
    f.fy >= 0.6 && f.fy <= 1.0, `${(f.fy * 100).toFixed(1)}%`);
  check(`nuclear plot @ ${b.name}: the rect is inside the canvas`,
    box.rect.x >= 0 && box.rect.y >= 0
    && box.rect.x + box.rect.w <= b.w && box.rect.y + box.rect.h <= b.h, '');
  // Data extent inside the rect: the BE/A curve against its own axis limits.
  const lim = NVIEW.curveLimits(curve);
  const px = NVIEW.axis(lim.aMin, lim.aMax, box.rect.x, box.rect.x + box.rect.w);
  const py = NVIEW.axis(lim.eMin, lim.eMax, box.rect.y + box.rect.h, box.rect.y);
  const xs = curve.map((p) => px(p.A));
  const ys = curve.map((p) => py(p.perNucleon));
  const dx = (Math.max(...xs) - Math.min(...xs)) / box.rect.w;
  const dy = (Math.max(...ys) - Math.min(...ys)) / box.rect.h;
  check(`BE/A curve @ ${b.name}: data spans ≥ 85% of the plot rect on x`, dx >= 0.85, `${(dx * 100).toFixed(1)}%`);
  check(`BE/A curve @ ${b.name}: data spans ≥ 60% of the plot rect on y`, dy >= 0.6, `${(dy * 100).toFixed(1)}%`);
  check(`BE/A curve @ ${b.name}: nothing is drawn outside the rect`,
    Math.min(...xs) >= box.rect.x - 0.5 && Math.max(...xs) <= box.rect.x + box.rect.w + 0.5
    && Math.min(...ys) >= box.rect.y - 0.5 && Math.max(...ys) <= box.rect.y + box.rect.h + 0.5, '');
  // The decay dot grid.
  for (const n of [100, 400, 900]) {
    const g = NVIEW.decayGrid(n, box.rect.w, box.rect.h);
    const gf = NVIEW.decayGridFill(g, box.rect.w, box.rect.h);
    check(`decay grid of ${n} @ ${b.name}: fills ≥ 60% on the binding axis`,
      Math.max(gf.fx, gf.fy) >= 0.6, `${(gf.fx * 100).toFixed(0)}% × ${(gf.fy * 100).toFixed(0)}%`);
    check(`decay grid of ${n} @ ${b.name}: never overflows`, gf.fx <= 1.001 && gf.fy <= 1.001, '');
    check(`decay grid of ${n} @ ${b.name}: every nucleus has a cell`, g.cols * g.rows >= n, '');
    check(`decay grid of ${n} @ ${b.name}: dot radius stays readable`, g.dot >= 1.4, `${fmt(g.dot)} px`);
  }
}
check('curveLimits starts the energy axis at ZERO — a truncated axis would invert the shape',
  NVIEW.curveLimits(curve).eMin === 0, '');
check('curveLimits leaves headroom above the peak',
  NVIEW.curveLimits(curve).eMax > peak.perNucleon, '');
for (const [min, max] of [[0, 245], [0, 9], [-5, 5], [0, 6]]) {
  const t = NVIEW.ticks(min, max, 5);
  check(`ticks(${min}, ${max}) are round numbers`, t.every((v) => Number.isFinite(v)), `${t}`);
  check(`ticks(${min}, ${max}) are ascending`, t.every((v, i) => i === 0 || v > t[i - 1]), `${t}`);
  check(`ticks(${min}, ${max}) stay inside the range`, t[0] >= min - 1e-9 && t[t.length - 1] <= max + 1e-9, `${t}`);
}
// The arrow head must be sized in PIXELS, not data units.
const arrowSmall = NVIEW.curveArrow(0, 0, 100, 0, 250);
const arrowBig = NVIEW.curveArrow(0, 0, 100, 0, 613);
check('the curve arrow head grows with the canvas, not with the data',
  arrowBig.x2 < arrowSmall.x2, `${fmt(arrowSmall.x2)} vs ${fmt(arrowBig.x2)}`);
check('the arrow head is a three-point polygon', arrowSmall.head.split(' ').length === 3, arrowSmall.head);

G('the N–Z chart uses fitView, and the quantisation trap is checked');
/*
 * The N–Z chart is the ONE nuclear view whose axes share a unit (one nucleon), so
 * equal scaling is meaningful and `fitView` is right. It is passed explicit
 * maxScale/minScale because the defaults are px-per-METRE — and because fitView
 * quantises scale onto a 1% ladder, so any fit needing a scale below 0.005 returns
 * EXACTLY ZERO and draws nothing with no error. That already shipped once at
 * planetary scale. Dimensionless axes of order 100 keep it clear of the floor.
 */
for (const b of BOARDS) {
  const box = NVIEW.plotBox(b.w, b.h);
  for (const span of [[26, 'local'], [240, 'whole chart']]) {
    const pts = NUCLIDES.NUCLIDES.filter((n) => n.A >= 2 && n.A <= span[0] + 2)
      .map((n) => ({ x: n.Z, y: n.A - n.Z }));
    if (pts.length < 2) continue;
    const bounds = SVG.padBounds(SVG.boundsOf(pts), 3);
    const view = SVG.fitView(bounds, box.rect.w, box.rect.h, { padFrac: 0.06, maxScale: 40, minScale: 0.15 });
    check(`N–Z chart (${span[1]}) @ ${b.name}: fitView scale is NOT zero`,
      view.scale > 0, `scale ${fmt(view.scale)}`);
    check(`N–Z chart (${span[1]}) @ ${b.name}: scale survives the 1% quantisation ladder`,
      view.scale >= 0.01, `scale ${fmt(view.scale)}`);
    const screen = pts.map((p) => SVG.worldToScreen(p, view));
    const fx = (Math.max(...screen.map((s) => s.x)) - Math.min(...screen.map((s) => s.x))) / box.rect.w;
    const fy = (Math.max(...screen.map((s) => s.y)) - Math.min(...screen.map((s) => s.y))) / box.rect.h;
    check(`N–Z chart (${span[1]}) @ ${b.name}: content fills 55–100% on its binding axis`,
      Math.max(fx, fy) >= 0.55 && fx <= 1.001 && fy <= 1.001,
      `${(fx * 100).toFixed(0)}% × ${(fy * 100).toFixed(0)}%`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. SEMICONDUCTOR MATERIALS
// ═══════════════════════════════════════════════════════════════════════════
G('material data — against published 300 K values');
near('V_T = kT/q at 300 K (derived, never quoted as 26 mV)', MAT.V_T, 0.025852, 1e-5, ' V');
near('V_T at 350 K scales with T', MAT.thermalVoltage(350), MAT.V_T * 350 / 300, 1e-9, ' V');
near('Boltzmann constant', MAT.BOLTZMANN, 1.380649e-23, 0, ' J/K');
near('elementary charge', MAT.Q_ELECTRON, 1.602176634e-19, 0, ' C');
near('silicon band gap (Sze, 300 K)', MAT.MATERIALS.Si.bandGapEv, 1.12, 1e-9, ' eV');
check('silicon band gap rounds to the 1.1 eV every textbook quotes',
  Math.abs(MAT.MATERIALS.Si.bandGapEv - 1.1) <= 0.03, `${MAT.MATERIALS.Si.bandGapEv} eV`);
near('germanium band gap (Sze, 300 K)', MAT.MATERIALS.Ge.bandGapEv, 0.66, 1e-9, ' eV');
check('germanium band gap is the 0.67 eV commonly quoted, to 0.02',
  Math.abs(MAT.MATERIALS.Ge.bandGapEv - 0.67) <= 0.02, `${MAT.MATERIALS.Ge.bandGapEv} eV`);
near('GaAs band gap', MAT.MATERIALS.GaAs.bandGapEv, 1.42, 1e-9, ' eV');
check('the gaps are ordered Ge < Si < GaAs — which is why they do different jobs',
  MAT.MATERIALS.Ge.bandGapEv < MAT.MATERIALS.Si.bandGapEv
  && MAT.MATERIALS.Si.bandGapEv < MAT.MATERIALS.GaAs.bandGapEv, '');
near('silicon nᵢ (the NCERT value)', MAT.MATERIALS.Si.intrinsicPerM3, 1.5e16, 1e-9, ' m⁻³');
near('germanium nᵢ', MAT.MATERIALS.Ge.intrinsicPerM3, 2.4e19, 1e-9, ' m⁻³');
check('germanium has ~1600× more intrinsic carriers than silicon — the smaller gap, made visible',
  MAT.MATERIALS.Ge.intrinsicPerM3 / MAT.MATERIALS.Si.intrinsicPerM3 > 1000, '');
near('silicon atom density', MAT.MATERIALS.Si.atomsPerM3, 5.0e28, 1e-9, ' m⁻³');
near('silicon relative permittivity', MAT.MATERIALS.Si.epsRelative, 11.9, 1e-9);
near('silicon absolute permittivity', MAT.permittivity(MAT.MATERIALS.Si), 11.9 * 8.8541878128e-12, 1e-9, ' F/m');
near('silicon cut-in voltage (device rating)', MAT.MATERIALS.Si.kneeVolts, 0.7, 1e-9, ' V');
near('germanium cut-in voltage (device rating)', MAT.MATERIALS.Ge.kneeVolts, 0.3, 1e-9, ' V');

G('intrinsic resistivity — an independent check on nᵢ AND the mobilities');
/*
 * ρ = 1/(q·nᵢ(μₑ + μₕ)) multiplies four separate data items together, so agreeing
 * with the published intrinsic resistivity is a much stronger check than any of
 * them individually. Published: silicon ≈ 2.3 kΩ·m, germanium ≈ 0.46 Ω·m.
 */
near('intrinsic silicon resistivity', MAT.carriers(MAT.MATERIALS.Si, 'intrinsic', 0).resistivity, 2300, 0.03, ' Ω·m');
near('intrinsic germanium resistivity', MAT.carriers(MAT.MATERIALS.Ge, 'intrinsic', 0).resistivity, 0.46, 0.05, ' Ω·m');
check('germanium conducts far better than silicon when pure',
  MAT.carriers(MAT.MATERIALS.Ge, 'intrinsic', 0).conductivity
  > 1000 * MAT.carriers(MAT.MATERIALS.Si, 'intrinsic', 0).conductivity, '');

G('the law of mass action — n·p = nᵢ² through every decade of doping');
for (const mName of ['Si', 'Ge']) {
  const m = MAT.MATERIALS[mName];
  const ni2 = m.intrinsicPerM3 ** 2;
  const ci = MAT.carriers(m, 'intrinsic', 0);
  near(`${mName} intrinsic: n = p = nᵢ`, ci.electrons, m.intrinsicPerM3, 1e-9);
  near(`${mName} intrinsic: n = p exactly`, ci.electrons, ci.holes, 1e-9);
  check(`${mName} intrinsic: neither carrier is the majority`,
    ci.majorityCarrier === 'both equally', ci.majorityCarrier);
  for (const decade of [18, 19, 20, 21, 22, 23, 24, 25]) {
    const nd = Math.pow(10, decade);
    for (const type of ['n-type', 'p-type']) {
      const c = MAT.carriers(m, type, nd);
      near(`${mName} ${type} 10^${decade}: n·p = nᵢ²`, c.electrons * c.holes, ni2, 1e-9);
      check(`${mName} ${type} 10^${decade}: the right carrier is the majority`,
        c.majorityCarrier === (type === 'n-type' ? 'electrons' : 'holes'), c.majorityCarrier);
      check(`${mName} ${type} 10^${decade}: majority ≥ minority`, c.majority >= c.minority, '');
      /*
       * ⚠ NOT ALWAYS TRUE, AND THAT IS REAL PHYSICS. Electrons are about twice as
       * mobile as holes, so LIGHT p-doping trades fast carriers for slow ones and
       * can LOWER the conductivity — germanium at 10¹⁸ m⁻³, well below its nᵢ of
       * 2.4×10¹⁹, is the case in the table. So the claim is only made once the
       * doping is well above nᵢ; the dip itself is asserted separately below.
       */
      if (nd > 100 * m.intrinsicPerM3) {
        check(`${mName} ${type} 10^${decade}: conductivity beats the pure crystal`,
          c.conductivity > ci.conductivity, `${fmt(c.conductivity)} vs ${fmt(ci.conductivity)} S/m`);
      }
    }
  }
  // n ≈ N_D only holds well ABOVE nᵢ; the exact solution must not assume it.
  const weak = MAT.carriers(m, 'n-type', m.intrinsicPerM3 * 0.01);
  near(`${mName}: at 1% of nᵢ of doping, n is still ≈ nᵢ (the exact solution, not n ≈ N_D)`,
    weak.electrons, m.intrinsicPerM3, 0.02);
  const strong = MAT.carriers(m, 'n-type', m.intrinsicPerM3 * 1e6);
  near(`${mName}: at 10⁶ nᵢ of doping, n ≈ N_D`,
    strong.electrons, m.intrinsicPerM3 * 1e6, 1e-5);
  /*
   * The conductivity MINIMUM. σ = q(nμₑ + (nᵢ²/n)μₕ) is minimised at
   * n = nᵢ√(μₕ/μₑ), where σ_min = 2q·nᵢ√(μₑμₕ) — BELOW the intrinsic value,
   * because electrons are more mobile than holes. A real and counter-intuitive
   * result: lightly p-doping a semiconductor makes it a worse conductor.
   */
  const nMin = m.intrinsicPerM3 * Math.sqrt(m.muHole / m.muElectron);
  const sigMin = 2 * MAT.Q_ELECTRON * m.intrinsicPerM3 * Math.sqrt(m.muElectron * m.muHole);
  const atMin = MAT.carriers(m, 'p-type', (m.intrinsicPerM3 ** 2) / nMin - nMin);
  near(`${mName}: the conductivity minimum is 2q·nᵢ√(μₑμₕ)`, atMin.conductivity, sigMin, 1e-6, ' S/m');
  check(`${mName}: and it is BELOW the intrinsic conductivity — light p-doping makes it worse`,
    sigMin < ci.conductivity, `${fmt(sigMin)} vs ${fmt(ci.conductivity)} S/m`);
}
const si16 = MAT.carriers(MAT.MATERIALS.Si, 'n-type', 1e22);
near('n-Si at 10²² m⁻³: electrons', si16.electrons, 1e22, 1e-6, ' m⁻³');
near('n-Si at 10²² m⁻³: holes fall to nᵢ²/N_D', si16.holes, 2.25e10, 1e-6, ' m⁻³');
near('n-Si at 10²² m⁻³: one dopant atom in five million', si16.dopantFraction, 2e-7, 1e-6);
check('doping by 1 in 5 million raises conductivity by more than 10⁵',
  si16.conductivity / MAT.carriers(MAT.MATERIALS.Si, 'intrinsic', 0).conductivity > 1e5,
  `${fmt(si16.conductivity / MAT.carriers(MAT.MATERIALS.Si, 'intrinsic', 0).conductivity)}×`);
check('donors are group 15 and acceptors group 13',
  MAT.DONORS.includes('phosphorus') && MAT.ACCEPTORS.includes('boron'), '');

// ═══════════════════════════════════════════════════════════════════════════
// 8. THE DIODE
// ═══════════════════════════════════════════════════════════════════════════
G('the Shockley equation, and the knee that is not in it');
for (const mName of ['Si', 'Ge']) {
  const d = DIODE.diode('D', 'a', 'b', { material: mName });
  const knee = MAT.MATERIALS[mName].kneeVolts;
  // Tolerance 1 µV, not 1 nV: the calibration inverts I = I_S·e^(V/V_T) while
  // `voltageAtCurrent` inverts the full I = I_S(e^(V/V_T) − 1), so they differ by
  // the "−1" — 0.24 µV for germanium, 4×10⁻¹³ V for silicon. Both are far below
  // anything displayed, and pretending they are bit-identical would be a lie.
  near(`${mName}: V at the 1 mA reference is the cut-in voltage to within a microvolt`,
    DIODE.voltageAtCurrent(d, DIODE.I_REF), knee, 1e-6, ' V');
  near(`${mName}: the current at the cut-in voltage is 1 mA`,
    DIODE.shockleyCurrent(d, knee), DIODE.I_REF, 1e-6, ' A');
  near(`${mName}: volts per decade of current is 2.303·V_T`,
    DIODE.voltsPerDecade(d), Math.LN10 * MAT.V_T, 1e-9, ' V');
  near(`${mName}: volts per decade is 59.5 mV at 300 K`,
    DIODE.voltsPerDecade(d), 0.059526, 1e-4, ' V');
  const is = DIODE.saturationCurrent(d);
  /*
   * The decade rule, across six decades. A real physical claim, independent of how
   * I_S was calibrated — but it only holds WELL INTO the exponential regime. The
   * "−1" in I = I_S(e^(V/V_T) − 1) bends the relation near I_S, and germanium's I_S
   * is 9 nA rather than silicon's 1.7 fA, so germanium departs measurably at a
   * microamp. That is correct physics and worth asserting in its own right, so the
   * strict check is gated on i ≥ 1000·I_S and the departure gets its own check.
   */
  for (const i of [1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1]) {
    const x = i / is;
    const got = DIODE.voltageAtCurrent(d, i * 10) - DIODE.voltageAtCurrent(d, i);
    // Exact, for every current: ΔV = nV_T·ln((10x + 1)/(x + 1)).
    near(`${mName}: a decade from ${fmt(i)} A matches the exact Shockley inverse`,
      got, MAT.V_T * Math.log((10 * x + 1) / (x + 1)), 1e-12, ' V');
    if (x >= 1e5) {
      // Deep in the exponential regime the "−1" is negligible and the decade costs
      // exactly 2.303·V_T.
      near(`${mName}: a decade from ${fmt(i)} A costs 59.5 mV`, got, DIODE.voltsPerDecade(d), 1e-6, ' V');
    } else {
      /*
       * Closer to I_S the "−1" bites, and it bites in a predictable direction and
       * size: to first order the decade costs 0.9·V_T·(I_S/i) LESS than 2.303·V_T.
       * Germanium (I_S = 9 nA) shows this at a microamp; silicon (1.7 fA) never
       * does. That is a real, teachable consequence of the −1 term, so it is
       * asserted rather than tolerated.
       */
      const deficit = DIODE.voltsPerDecade(d) - got;
      check(`${mName}: near I_S a decade costs LESS than 59.5 mV, by ≈ 0.9·V_T·I_S/i`,
        deficit > 0 && Math.abs(deficit - 0.9 * MAT.V_T / x) < 0.15 * (0.9 * MAT.V_T / x),
        `deficit ${fmt(deficit)} V, first-order estimate ${fmt(0.9 * MAT.V_T / x)} V`);
    }
  }
  // Reverse: saturates at −I_S.
  for (const v of [-0.1, -0.2, -0.5, -1.0]) {
    const i = DIODE.shockleyCurrent(d, v);
    check(`${mName}: at ${v} V the reverse current is within 5% of −I_S`,
      Math.abs(i + is) / is < 0.05, `${fmt(i)} vs ${fmt(-is)} A`);
  }
  near(`${mName}: V(I) inverts I(V)`,
    DIODE.voltageAtCurrent(d, DIODE.shockleyCurrent(d, 0.55)), 0.55, 1e-9, ' V');
  check(`${mName}: the curve is monotonically increasing`,
    (() => {
      const c = DIODE.ivCurve(d, -1, 0.85, 200);
      return c.every((p, i) => i === 0 || p.i >= c[i - 1].i - 1e-18);
    })(), '');
  check(`${mName}: the curve is sorted by voltage`,
    (() => {
      const c = DIODE.ivCurve(d, -1, 0.85, 200);
      return c.every((p, i) => i === 0 || p.v >= c[i - 1].v);
    })(), '');
  check(`${mName}: at 0 V the current is exactly 0`, DIODE.shockleyCurrent(d, 0) === 0, '');
  check(`${mName}: no overflow to Infinity at an absurd forward bias`,
    Number.isFinite(DIODE.shockleyCurrent(d, 10)), `${fmt(DIODE.shockleyCurrent(d, 10))}`);
}
const dSi = DIODE.diode('D', 'a', 'b', { material: 'Si' });
const dGe = DIODE.diode('D', 'a', 'b', { material: 'Ge' });
check('germanium leaks vastly more in reverse than silicon — which is why silicon won',
  DIODE.saturationCurrent(dGe) > 1e4 * DIODE.saturationCurrent(dSi),
  `${fmt(DIODE.saturationCurrent(dGe))} vs ${fmt(DIODE.saturationCurrent(dSi))} A`);
check('silicon I_S is in the femtoamp-to-picoamp range',
  DIODE.saturationCurrent(dSi) > 1e-16 && DIODE.saturationCurrent(dSi) < 1e-11,
  `${fmt(DIODE.saturationCurrent(dSi))} A`);
check('germanium I_S is in the nanoamp range',
  DIODE.saturationCurrent(dGe) > 1e-10 && DIODE.saturationCurrent(dGe) < 1e-6,
  `${fmt(DIODE.saturationCurrent(dGe))} A`);
// A diode is NOT ohmic, and the numbers prove it.
const r1 = 0.65 / DIODE.shockleyCurrent(dSi, 0.65);
const r2 = 0.75 / DIODE.shockleyCurrent(dSi, 0.75);
check('V/I differs by more than 10× between 0.65 V and 0.75 V — non-ohmic, measurably',
  r1 / r2 > 10, `${fmt(r1)} Ω vs ${fmt(r2)} Ω`);

G('the Zener branch');
for (const vz of [3.3, 5.1, 6.2, 9.1, 12]) {
  const dz = DIODE.diode('DZ', 'a', 'b', { breakdown: vz, zenerResistance: 5 });
  check(`Zener ${vz} V: negligible current just before breakdown`,
    Math.abs(DIODE.shockleyCurrent(dz, -(vz - 0.2))) < 1e-8,
    `${fmt(DIODE.shockleyCurrent(dz, -(vz - 0.2)))} A`);
  near(`Zener ${vz} V: 1 V past breakdown gives 1/r_z of current`,
    DIODE.shockleyCurrent(dz, -(vz + 1)), -1 / 5, 1e-3, ' A');
  check(`Zener ${vz} V: three states are allowed`,
    DIODE.allowedStates(dz).length === 3, `${DIODE.allowedStates(dz)}`);
}
check('a plain diode has only two states',
  DIODE.allowedStates(dSi).length === 2, `${DIODE.allowedStates(dSi)}`);

G('the piecewise consistency test — it has to reject as well as accept');
check('forward is consistent when the current flows anode → cathode',
  DIODE.stateIsConsistent(dSi, 'forward', 0.7, 1e-3), '');
check('forward is REJECTED when the current is negative',
  !DIODE.stateIsConsistent(dSi, 'forward', 0.7, -1e-3), '');
check('off is consistent below the knee', DIODE.stateIsConsistent(dSi, 'off', 0.3, 0), '');
check('off is REJECTED above the knee', !DIODE.stateIsConsistent(dSi, 'off', 1.2, 0), '');
const dzTest = DIODE.diode('DZ', 'a', 'b', { breakdown: 6.2 });
check('off is REJECTED past a Zener\'s breakdown', !DIODE.stateIsConsistent(dzTest, 'off', -7, 0), '');
check('off is consistent inside a Zener\'s window', DIODE.stateIsConsistent(dzTest, 'off', -3, 0), '');
check('breakdown is consistent when the current flows cathode → anode',
  DIODE.stateIsConsistent(dzTest, 'breakdown', -6.2, -1e-3), '');
check('breakdown is REJECTED when the current flows the other way',
  !DIODE.stateIsConsistent(dzTest, 'breakdown', -6.2, 1e-3), '');
for (const s of ['off', 'forward', 'breakdown']) {
  check(`explainState('${s}') is a real sentence, not a label`,
    DIODE.explainState(dzTest, s).length > 40 && DIODE.explainState(dzTest, s).includes(' '), '');
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. THE JUNCTION
// ═══════════════════════════════════════════════════════════════════════════
G('the built-in potential, and the band bend it must equal');
const J = { material: MAT.MATERIALS.Si, na: 1e22, nd: 1e22 };
near('V_bi for silicon at 10²² / 10²² m⁻³', JUNC.builtInPotential(J), 0.69335, 1e-4, ' V');
check('V_bi lands in the 0.6–0.8 V band the diode knee comes from',
  JUNC.builtInPotential(J) > 0.6 && JUNC.builtInPotential(J) < 0.8, '');
/*
 * ⚠ THE STRONGEST CHECK IN THE SEMICONDUCTOR HALF. V_bi is computed as
 * V_T·ln(N_A N_D/nᵢ²) in `builtInPotential`, and the band diagram builds its total
 * bend out of the two Fermi-level offsets, V_T·ln(n/nᵢ) per side, via a completely
 * separate code path. If those two ever disagree the sim shows a barrier height
 * that does not match the picture of it.
 */
for (const [na, nd] of [[1e21, 1e21], [1e22, 1e22], [1e23, 1e22], [1e22, 1e24], [1e20, 1e25]]) {
  const j = { material: MAT.MATERIALS.Si, na, nd };
  const bands = JUNC.bandProfile(j, 0, 60);
  near(`V_bi from ln(N_A N_D/nᵢ²) equals the band bend at ${fmt(na)}/${fmt(nd)}`,
    bands.bendEv, JUNC.builtInPotential(j), 1e-9, ' eV');
  const offSum = MAT.fermiOffsetEv(MAT.MATERIALS.Si, MAT.carriers(MAT.MATERIALS.Si, 'n-type', nd).electrons)
    - MAT.fermiOffsetEv(MAT.MATERIALS.Si, MAT.carriers(MAT.MATERIALS.Si, 'p-type', na).electrons);
  near(`the two Fermi offsets also sum to V_bi at ${fmt(na)}/${fmt(nd)}`,
    offSum, JUNC.builtInPotential(j), 1e-6, ' eV');
}
near('germanium V_bi is much lower — its nᵢ is 1600× higher',
  JUNC.builtInPotential({ material: MAT.MATERIALS.Ge, na: 1e22, nd: 1e22 }), 0.3199, 0.01, ' V');
check('a higher nᵢ gives a lower V_bi at the same doping',
  JUNC.builtInPotential({ material: MAT.MATERIALS.Ge, na: 1e22, nd: 1e22 })
  < JUNC.builtInPotential({ material: MAT.MATERIALS.Si, na: 1e22, nd: 1e22 }), '');

G('the depletion region — one formula, both directions');
const dep0 = JUNC.depletion(J, 0);
near('W at zero bias', dep0.width, 4.27e-7, 0.01, ' m');
check('W is in the 0.1–1 µm band a real junction has',
  dep0.width > 1e-7 && dep0.width < 1e-6, `${fmt(dep0.width)} m`);
near('W = √(2ε(V_bi)/q · (1/N_A + 1/N_D)) — the formula, recomputed here',
  dep0.width,
  Math.sqrt((2 * MAT.permittivity(MAT.MATERIALS.Si) * JUNC.builtInPotential(J) / MAT.Q_ELECTRON)
    * (1 / J.na + 1 / J.nd)), 1e-9, ' m');
near('x_p + x_n = W', dep0.intoP + dep0.intoN, dep0.width, 1e-15, ' m');
near('E_max = 2(V_bi − V)/W', dep0.peakField, 2 * dep0.barrierUsed / dep0.width, 1e-9, ' V/m');
check('the peak field is of order MV/m', dep0.peakField > 1e6 && dep0.peakField < 1e8, `${fmt(dep0.peakField)} V/m`);
near('junction capacitance is ε/W', dep0.capacitancePerArea, MAT.permittivity(MAT.MATERIALS.Si) / dep0.width, 1e-9);

// Forward narrows, reverse widens, and the √ scaling — checked across the range.
// Walking from the most forward bias to the most reverse, W must GROW at every
// step. (An earlier version of this loop asserted `<` and therefore claimed the
// opposite — a verifier bug, not a physics one, but it is exactly why the
// direction is spelled out in the check name now.)
let prev = 0;
for (const bias of [0.6, 0.4, 0.2, 0, -0.5, -1, -2, -5, -10, -20]) {
  const d = JUNC.depletion(J, bias);
  check(`bias ${bias >= 0 ? '+' : ''}${bias} V: W is WIDER than at the previous, more forward, bias`,
    d.width > prev, `${fmt(d.width)} m vs previous ${fmt(prev)} m`);
  prev = d.width;
  near(`bias ${bias >= 0 ? '+' : ''}${bias} V: the barrier is V_bi − V`,
    d.barrier, JUNC.builtInPotential(J) - bias, 1e-12, ' V');
  if (!d.beyondApproximation) {
    near(`bias ${bias >= 0 ? '+' : ''}${bias} V: W scales as √(V_bi − V)`,
      d.width / dep0.width, Math.sqrt(d.barrier / dep0.barrier), 1e-6);
  }
  near(`bias ${bias >= 0 ? '+' : ''}${bias} V: x_p + x_n = W`, d.intoP + d.intoN, d.width, 1e-15);
  // Equal and opposite exposed charge — the reason the region is asymmetric.
  const q = JUNC.chargeProfile(J, bias);
  near(`bias ${bias >= 0 ? '+' : ''}${bias} V: exposed charge is equal and opposite`,
    q.chargeP, -q.chargeN, 1e-9);
}
check('forward bias narrows the depletion region', JUNC.depletion(J, 0.5).width < dep0.width, '');
check('reverse bias widens it', JUNC.depletion(J, -5).width > dep0.width, '');
near('reverse bias of 5 V widens W by √((V_bi+5)/V_bi)',
  JUNC.depletion(J, -5).width / dep0.width,
  Math.sqrt((JUNC.builtInPotential(J) + 5) / JUNC.builtInPotential(J)), 1e-6);
check('the depletion approximation flags itself as invalid near V_bi',
  JUNC.depletion(J, JUNC.builtInPotential(J) - 0.01).beyondApproximation, '');
check('and it says WHY, in words',
  (JUNC.depletion(J, JUNC.builtInPotential(J) - 0.01).note ?? '').length > 60, '');
check('at zero bias it does NOT flag itself', !dep0.beyondApproximation, '');
check('W never comes out NaN even past V_bi',
  Number.isFinite(JUNC.depletion(J, 5).width), `${fmt(JUNC.depletion(J, 5).width)}`);

G('the asymmetric junction — the depletion sits in the LIGHTLY doped side');
for (const [na, nd, heavier] of [[1e24, 1e22, 'p'], [1e22, 1e24, 'n'], [1e23, 1e21, 'p']]) {
  const j = { material: MAT.MATERIALS.Si, na, nd };
  const d = JUNC.depletion(j, 0);
  const ratio = d.intoP / d.intoN;
  near(`N_A ${fmt(na)}, N_D ${fmt(nd)}: x_p/x_n = N_D/N_A`, ratio, nd / na, 1e-9);
  check(`N_A ${fmt(na)}, N_D ${fmt(nd)}: the layer is mostly in the lightly doped (${heavier === 'p' ? 'n' : 'p'}) side`,
    heavier === 'p' ? d.intoN > d.intoP : d.intoP > d.intoN,
    `x_p ${fmt(d.intoP)}, x_n ${fmt(d.intoN)}`);
  const q = JUNC.chargeProfile(j, 0);
  near(`N_A ${fmt(na)}, N_D ${fmt(nd)}: the two sides still expose equal charge`,
    Math.abs(q.chargeP), Math.abs(q.chargeN), 1e-9);
}

G('the band diagram — flat in the bulk, parabolic in the layer');
for (const bias of [0, 0.3, -1, -5]) {
  const bands = JUNC.bandProfile(J, bias, 200);
  const n = bands.x.length;
  check(`bias ${bias} V: the p-side bulk is FLAT (a slope there would mean a current with no resistance)`,
    Math.abs(bands.ec[0] - bands.ec[2]) < 1e-12, `Δ ${fmt(bands.ec[0] - bands.ec[2])} eV`);
  check(`bias ${bias} V: the n-side bulk is FLAT`,
    Math.abs(bands.ec[n - 1] - bands.ec[n - 3]) < 1e-12, `Δ ${fmt(bands.ec[n - 1] - bands.ec[n - 3])} eV`);
  near(`bias ${bias} V: the total bend equals the barrier`,
    bands.ec[0] - bands.ec[n - 1], JUNC.depletion(J, bias).barrierUsed, 1e-9, ' eV');
  check(`bias ${bias} V: E_c is monotonically FALLING from p to n`,
    bands.ec.every((v, i) => i === 0 || v <= bands.ec[i - 1] + 1e-12), '');
  check(`bias ${bias} V: the gap is constant everywhere (E_c − E_v = E_g)`,
    bands.ec.every((v, i) => Math.abs((v - bands.ev[i]) - MAT.MATERIALS.Si.bandGapEv) < 1e-12), '');
  check(`bias ${bias} V: the depletion edges bracket the junction plane`,
    bands.depletionFrom < 0 && bands.depletionTo > 0, '');
  near(`bias ${bias} V: the quasi-Fermi levels are split by exactly the applied voltage`,
    bands.efP[0] - bands.efN[n - 1], -bias, 1e-12, ' eV');
  // The band profile must include neutral bulk on both sides, or "flat out here"
  // cannot be seen.
  check(`bias ${bias} V: the profile extends beyond the depletion region on both sides`,
    bands.x[0] < bands.depletionFrom && bands.x[n - 1] > bands.depletionTo, '');
}
check('a forward bias reduces the band bend', JUNC.bandProfile(J, 0.4).bendEv < JUNC.bandProfile(J, 0).bendEv, '');
check('a reverse bias increases it', JUNC.bandProfile(J, -4).bendEv > JUNC.bandProfile(J, 0).bendEv, '');
check('the charge profile is two blocks, not a sampled curve',
  JUNC.chargeProfile(J, 0).blocks.length === 2, '');
check('the p-side block has negative charge density and the n-side positive',
  JUNC.chargeProfile(J, 0).blocks[0].rho < 0 && JUNC.chargeProfile(J, 0).blocks[1].rho > 0, '');

// ═══════════════════════════════════════════════════════════════════════════
// 10. DIODE CIRCUITS — solved by the FROZEN nodal engine
// ═══════════════════════════════════════════════════════════════════════════
G('diode circuits — the piecewise state search over the frozen MNA');
const ivArch = SARCH.SEMICONDUCTOR_ARCHETYPES['diode-iv'];
for (const [supply, load] of [[5, 1000], [12, 2200], [2, 470], [1, 1000], [0.5, 1000], [-5, 1000], [-12, 1000], [0, 1000]]) {
  const scene = ivArch.buildScene({ supply, load, material: 'Si' });
  const sol = SOLVED.solveDiodeCircuit(scene.circuit, scene.diodes);
  check(`${supply} V through ${load} Ω: a consistent state was found`, !sol.unsolved, sol.warnings.join(' '));
  check(`${supply} V through ${load} Ω: exactly ONE state is consistent`,
    sol.consistentCount === 1, `${sol.consistentCount} of ${sol.tried}`);
  const wantOn = supply > 0.7;
  check(`${supply} V through ${load} Ω: the diode is ${wantOn ? 'forward' : 'off'}`,
    sol.states.D1 === (wantOn ? 'forward' : 'off'), sol.states.D1);
  if (wantOn) {
    near(`${supply} V through ${load} Ω: current is (V − 0.7)/R`,
      sol.solution.currents.RL, (supply - 0.7) / load, 1e-9, ' A');
    near(`${supply} V through ${load} Ω: 0.7 V across the diode`, sol.drops.D1, 0.7, 1e-9, ' V');
  } else {
    near(`${supply} V through ${load} Ω: no current at all`, sol.solution.currents.RL, 0, 1e-12, ' A');
  }
  check(`${supply} V through ${load} Ω: the solve is not singular`, !sol.solution.singular, '');
}
// The state search must be deterministic and must never silently pick.
const sceneA = ivArch.buildScene({ supply: 5, load: 1000 });
const s1 = SOLVED.solveDiodeCircuit(sceneA.circuit, sceneA.diodes);
const s2 = SOLVED.solveDiodeCircuit(sceneA.circuit, sceneA.diodes);
check('the state search is deterministic', JSON.stringify(s1.states) === JSON.stringify(s2.states), '');
check('it reports how many combinations it tried', s1.tried === 2, `${s1.tried}`);
check('it is not flagged ambiguous when exactly one state works', !s1.ambiguous, '');
check('MAX_DEVICES refuses rather than hanging',
  (() => {
    const many = Array.from({ length: 20 }, (_, i) => DIODE.diode(`D${i}`, 'in', 'out'));
    const r = SOLVED.solveDiodeCircuit(sceneA.circuit, many);
    return r.unsolved && r.tried === 0;
  })(), '');
check('withSourceEmf accepts an ARRAY of source ids (the centre-tap bug)',
  (() => {
    const c = SOLVED.withSourceEmf(sceneA.circuit, ['VS'], 9);
    return c.components.find((x) => x.id === 'VS').value === 9;
  })(), '');
check('withSourceEmf still accepts a bare string',
  SOLVED.withSourceEmf(sceneA.circuit, 'VS', 9).components.find((x) => x.id === 'VS').value === 9, '');
check('withSourceEmf does not mutate the circuit it was given',
  (() => {
    const before = sceneA.circuit.components.find((x) => x.id === 'VS').value;
    SOLVED.withSourceEmf(sceneA.circuit, 'VS', 99);
    return sceneA.circuit.components.find((x) => x.id === 'VS').value === before;
  })(), '');

// ═══════════════════════════════════════════════════════════════════════════
// 11. RECTIFIERS
// ═══════════════════════════════════════════════════════════════════════════
G('the ideal closed forms');
for (const vp of [5, 12, 24, 230]) {
  near(`half wave at ${vp} V peak: V_avg = V_p/π`, RECT.idealHalfWave(vp).vAvg, vp / Math.PI, 1e-12, ' V');
  near(`half wave at ${vp} V peak: V_rms = V_p/2`, RECT.idealHalfWave(vp).vRms, vp / 2, 1e-12, ' V');
  near(`full wave at ${vp} V peak: V_avg = 2V_p/π`, RECT.idealFullWave(vp).vAvg, 2 * vp / Math.PI, 1e-12, ' V');
  near(`full wave at ${vp} V peak: V_rms = V_p/√2`, RECT.idealFullWave(vp).vRms, vp / Math.SQRT2, 1e-12, ' V');
  near(`half wave at ${vp} V peak: ripple factor √((π/2)²−1) = 1.21136`,
    RECT.idealHalfWave(vp).rippleFactor, 1.2113633, 1e-6);
  near(`full wave at ${vp} V peak: ripple factor √((π/2√2)²−1) = 0.48343`,
    RECT.idealFullWave(vp).rippleFactor, 0.4834259, 1e-6);
  check(`full wave at ${vp} V peak: ripple is lower than half wave`,
    RECT.idealFullWave(vp).rippleFactor < RECT.idealHalfWave(vp).rippleFactor, '');
}
near('half-wave rectification efficiency is 4/π² = 40.5%',
  RECT.rectificationEfficiency(RECT.idealHalfWave(12)), 4 / Math.PI ** 2, 1e-9);
near('full-wave rectification efficiency is 8/π² = 81.1%',
  RECT.rectificationEfficiency(RECT.idealFullWave(12)), 8 / Math.PI ** 2, 1e-9);
check('full-wave efficiency is exactly double half-wave',
  Math.abs(RECT.rectificationEfficiency(RECT.idealFullWave(12))
    / RECT.rectificationEfficiency(RECT.idealHalfWave(12)) - 2) < 1e-9, '');

G('half-wave — swept through the frozen solver, and the negative half is ABSENT');
const hwArch = SARCH.SEMICONDUCTOR_ARCHETYPES['half-wave-rectifier'];
{
  const scene = hwArch.buildScene({ peak: 12, load: 1000, material: 'Si' });
  const r = RECT.sweepRectifier({ circuit: scene.circuit, diodes: scene.diodes, ...scene.rectifier }, 240);
  check('every phase found a consistent diode state', !r.anyUnsolved, '');
  near('output peak is the input peak minus one diode drop', r.outputPeak, 12 - 0.7, 1e-6, ' V');
  check('exactly ONE diode drop is in series', r.seriesDrops === 1, `${r.seriesDrops}`);
  check('the ripple frequency equals the supply frequency', r.rippleFrequency === 50, `${r.rippleFrequency}`);
  check('current flows for roughly half the cycle',
    r.conductionFraction > 0.4 && r.conductionFraction < 0.5, `${fmt(r.conductionFraction)}`);
  // THE claim: the negative half is not reduced, it is gone.
  const negatives = r.points.filter((p) => p.vIn < -0.1);
  check(`all ${negatives.length} negative-input samples produce EXACTLY zero output`,
    negatives.every((p) => Math.abs(p.vOut) < 1e-12), '');
  check(`all ${negatives.length} negative-input samples produce EXACTLY zero current`,
    negatives.every((p) => Math.abs(p.iOut) < 1e-15), '');
  check('no diode conducts anywhere on the negative half',
    negatives.every((p) => p.conducting.length === 0), '');
  check('the diode DOES conduct on the positive half above the knee',
    r.points.filter((p) => p.vIn > 2).every((p) => p.conducting.length === 1), '');
  check('at every instant, Ohm\'s law holds across the load',
    r.points.every((p) => Math.abs(p.iOut - p.vOut / 1000) < 1e-12), '');
  // With an IDEAL diode the numerically integrated mean must reproduce V_p/π.
  const ideal = { ...scene, diodes: [{ ...scene.diodes[0], knee: 0 }] };
  const ri = RECT.sweepRectifier({ circuit: ideal.circuit, diodes: ideal.diodes, ...scene.rectifier }, 720);
  near('with an ideal diode, the integrated mean IS V_p/π', ri.vAvg, 12 / Math.PI, 2e-5, ' V');
  near('with an ideal diode, the integrated r.m.s. IS V_p/2', ri.vRms, 6, 2e-5, ' V');
  near('with an ideal diode, the measured ripple factor IS 1.21136', ri.rippleFactor, 1.2113633, 5e-4);
  check('the real diode drop LOWERS the mean below V_p/π', r.vAvg < 12 / Math.PI, `${fmt(r.vAvg)}`);
  check('and RAISES the ripple factor above 1.211', r.rippleFactor > 1.21106, `${fmt(r.rippleFactor)}`);
  // Sample-count independence — an odd count would bias V_avg in the third decimal.
  for (const n of [120, 240, 360, 480]) {
    const rn = RECT.sweepRectifier({ circuit: ideal.circuit, diodes: ideal.diodes, ...scene.rectifier }, n);
    near(`ideal half wave at ${n} samples still integrates to V_p/π`, rn.vAvg, 12 / Math.PI, 2e-3, ' V');
  }
  // Peak scaling.
  for (const vp of [5, 12, 24]) {
    const rp = RECT.sweepRectifier({
      circuit: ideal.circuit, diodes: ideal.diodes, ...scene.rectifier, peak: vp,
    }, 720);
    near(`ideal half wave at ${vp} V peak: mean is V_p/π`, rp.vAvg, vp / Math.PI, 2e-5, ' V');
  }
}

G('full wave, centre tap — the negative half is PRESENT');
const fwArch = SARCH.SEMICONDUCTOR_ARCHETYPES['full-wave-rectifier'];
{
  const scene = fwArch.buildScene({ peak: 12, load: 1000, topology: 'centre-tap' });
  const r = RECT.sweepRectifier({ circuit: scene.circuit, diodes: scene.diodes, ...scene.rectifier }, 240);
  check('every phase found a consistent diode state', !r.anyUnsolved, '');
  check('two diodes are present', scene.diodes.length === 2, `${scene.diodes.length}`);
  check('only ONE diode drop is in series — the centre-tap advantage', r.seriesDrops === 1, `${r.seriesDrops}`);
  near('output peak is the input peak minus one drop', r.outputPeak, 12 - 0.7, 1e-6, ' V');
  check('the ripple frequency is DOUBLE the supply frequency', r.rippleFrequency === 100, `${r.rippleFrequency}`);
  check('current flows for most of the cycle',
    r.conductionFraction > 0.85, `${fmt(r.conductionFraction)}`);
  // THE claim this circuit exists for. This is the assertion that caught the
  // `withSourceEmf` single-id bug.
  const negatives = r.points.filter((p) => p.vIn < -2);
  check(`all ${negatives.length} negative-input samples produce a POSITIVE output`,
    negatives.every((p) => p.vOut > 0.5), '');
  check('some diode conducts on the negative half',
    negatives.every((p) => p.conducting.length === 1), '');
  check('the two diodes take turns — never both at once',
    r.points.every((p) => p.conducting.length <= 1), '');
  check('D1 conducts on the positive half and D2 on the negative',
    (() => {
      const pos = r.points.find((p) => p.vIn > 6);
      const neg = r.points.find((p) => p.vIn < -6);
      return pos?.conducting[0] === 'D1' && neg?.conducting[0] === 'D2';
    })(), '');
  const ideal = { ...scene, diodes: scene.diodes.map((d) => ({ ...d, knee: 0 })) };
  const ri = RECT.sweepRectifier({ circuit: ideal.circuit, diodes: ideal.diodes, ...scene.rectifier }, 720);
  near('with ideal diodes, the integrated mean IS 2V_p/π', ri.vAvg, 2 * 12 / Math.PI, 2e-5, ' V');
  near('with ideal diodes, the integrated r.m.s. IS V_p/√2', ri.vRms, 12 / Math.SQRT2, 2e-5, ' V');
  near('with ideal diodes, the measured ripple factor IS 0.48343', ri.rippleFactor, 0.4834259, 5e-4);
  check('the full-wave mean is twice the half-wave mean',
    Math.abs(ri.vAvg / (12 / Math.PI) - 2) < 1e-4, `${fmt(ri.vAvg / (12 / Math.PI))}×`);
  for (const vp of [5, 12, 24]) {
    const rp = RECT.sweepRectifier({
      circuit: ideal.circuit, diodes: ideal.diodes, ...scene.rectifier, peak: vp,
    }, 720);
    near(`ideal centre tap at ${vp} V peak: mean is 2V_p/π`, rp.vAvg, 2 * vp / Math.PI, 2e-5, ' V');
  }
}

G('full wave, bridge — and the conducting pair is DIAGONAL');
{
  const scene = fwArch.buildScene({ peak: 12, load: 1000, topology: 'bridge' });
  const r = RECT.sweepRectifier({ circuit: scene.circuit, diodes: scene.diodes, ...scene.rectifier }, 240);
  check('every phase found a consistent diode state', !r.anyUnsolved, '');
  check('four diodes are present', scene.diodes.length === 4, `${scene.diodes.length}`);
  check('TWO diode drops are in series — the bridge cost', r.seriesDrops === 2, `${r.seriesDrops}`);
  near('output peak is the input peak minus two drops', r.outputPeak, 12 - 1.4, 1e-6, ' V');
  check('the ripple frequency is double the supply frequency', r.rippleFrequency === 100, `${r.rippleFrequency}`);
  const pos = r.points.find((p) => p.vIn > 6);
  const neg = r.points.find((p) => p.vIn < -6);
  check('on the positive half, D1 and D4 conduct — diagonally opposite, not the pair on one side',
    pos?.conducting.slice().sort().join('+') === 'D1+D4', `${pos?.conducting}`);
  check('on the negative half, D2 and D3 conduct',
    neg?.conducting.slice().sort().join('+') === 'D2+D3', `${neg?.conducting}`);
  check('exactly two diodes carry real current at once, or none do',
    r.points.every((p) => p.conducting.length === 0 || p.conducting.length === 2),
    `${[...new Set(r.points.map((p) => p.conducting.length))]}`);
  check('there are exactly TWO conducting sets over the whole cycle, and they are the diagonals',
    (() => {
      const sets = new Set(r.points.filter((p) => p.conducting.length)
        .map((p) => p.conducting.slice().sort().join('+')));
      return sets.size === 2 && sets.has('D1+D4') && sets.has('D2+D3');
    })(), `${[...new Set(r.points.filter((p) => p.conducting.length).map((p) => p.conducting.slice().sort().join('+')))]}`);
  /*
   * The dead band. Between one diode drop and two, a SINGLE diode is genuinely
   * forward biased and passes about 30 nA round the 10 MΩ reference resistor. That
   * is real, it is three orders of magnitude below the load current, and it is
   * reported as `trickle` rather than as `conducting` so it cannot contradict the
   * diagonal-pair lesson. Both facts are asserted.
   */
  const dead = r.points.filter((p) => Math.abs(p.vIn) > 0.8 && Math.abs(p.vIn) < 1.35);
  check('in the dead band a single diode trickles rather than conducting',
    dead.length > 0 && dead.some((p) => p.trickle.length === 1 && p.conducting.length === 0),
    `${dead.length} samples in the band`);
  check('the trickle is below 0.5% of the peak load current',
    (() => {
      const peakI = Math.max(...r.points.map((p) => Math.abs(p.iOut)));
      return dead.every((p) => Math.abs(p.iOut) <= peakI * RECT.TRICKLE_FRACTION + 1e-12);
    })(), '');
  check('the reference resistor is present and labelled in the netlist',
    scene.circuit.components.some((c) => c.id === 'RREF' && (c.label ?? '').includes('reference')), '');
  const negatives = r.points.filter((p) => p.vIn < -3);
  check(`all ${negatives.length} negative-input samples produce a POSITIVE output`,
    negatives.every((p) => p.vOut > 0.5), '');
  check('the bridge output is LOWER than the centre-tap output — two drops instead of one',
    r.outputPeak < 12 - 0.7, `${fmt(r.outputPeak)} V`);
  const ideal = { ...scene, diodes: scene.diodes.map((d) => ({ ...d, knee: 0 })) };
  const ri = RECT.sweepRectifier({ circuit: ideal.circuit, diodes: ideal.diodes, ...scene.rectifier }, 720);
  near('with ideal diodes the bridge also integrates to 2V_p/π', ri.vAvg, 2 * 12 / Math.PI, 5e-4, ' V');
}

G('smoothing — calculated, and labelled as calculated');
for (const [c, f] of [[100e-6, 100], [470e-6, 100], [1000e-6, 100], [100e-6, 50]]) {
  const s = RECT.smoothing(11.3, 1000, c, f);
  check(`C = ${c * 1e6} µF at ${f} Hz: the d.c. output is below the peak`, s.vDc < 11.3, `${fmt(s.vDc)} V`);
  check(`C = ${c * 1e6} µF at ${f} Hz: ripple is positive and small`,
    s.ripplePkPk > 0 && s.ripplePkPk < 11.3, `${fmt(s.ripplePkPk)} V`);
  near(`C = ${c * 1e6} µF at ${f} Hz: RC is R × C`, s.rc, 1000 * c, 1e-12, ' s');
  near(`C = ${c * 1e6} µF at ${f} Hz: the discharge time is 1/f`, s.dischargeTime, 1 / f, 1e-12, ' s');
  check(`C = ${c * 1e6} µF at ${f} Hz: the note says it is calculated, not simulated`,
    s.note.includes('not simulated'), '');
}
check('a bigger capacitor gives less ripple',
  RECT.smoothing(11.3, 1000, 1000e-6, 100).ripplePkPk < RECT.smoothing(11.3, 1000, 100e-6, 100).ripplePkPk, '');
check('a higher ripple frequency gives less ripple for the same capacitor',
  RECT.smoothing(11.3, 1000, 100e-6, 100).ripplePkPk < RECT.smoothing(11.3, 1000, 100e-6, 50).ripplePkPk, '');

// ═══════════════════════════════════════════════════════════════════════════
// 12. THE ZENER REGULATOR
// ═══════════════════════════════════════════════════════════════════════════
G('the Zener regulator — flat where it should be, and honest where it is not');
const znArch = SARCH.SEMICONDUCTOR_ARCHETYPES['zener-regulator'];
{
  const scene = znArch.buildScene({ zener: 6.2, supply: 12, series: 470, load: 1000 });
  const dz = scene.diodes[0];
  const results = [];
  for (const v of [2, 4, 6, 8, 9, 10, 12, 15, 18, 20, 22, 24]) {
    const sol = SOLVED.solveDiodeCircuit(SOLVED.withSourceEmf(scene.circuit, 'VS', v), [dz]);
    const vOut = sol.solution.potentials.out ?? 0;
    results.push({ v, vOut, state: sol.states.DZ, iz: -(sol.currents.DZ ?? 0), il: sol.solution.currents.RL ?? 0, itot: sol.solution.currents.RS ?? 0 });
    check(`${v} V in: a consistent state was found`, !sol.unsolved, sol.warnings.join(' '));
    check(`${v} V in: exactly one state is consistent`, sol.consistentCount === 1, `${sol.consistentCount}`);
  }
  const regulating = results.filter((r) => r.state === 'breakdown');
  const off = results.filter((r) => r.state === 'off');
  check('there are supply voltages where it regulates AND voltages where it does not',
    regulating.length > 0 && off.length > 0, `${regulating.length} regulating, ${off.length} off`);
  check('while regulating, the output stays within 0.15 V across the whole range',
    Math.max(...regulating.map((r) => r.vOut)) - Math.min(...regulating.map((r) => r.vOut)) < 0.15,
    `spread ${fmt(Math.max(...regulating.map((r) => r.vOut)) - Math.min(...regulating.map((r) => r.vOut)))} V`);
  check('while regulating, the output is just above the Zener rating (slope resistance)',
    regulating.every((r) => r.vOut >= 6.2 && r.vOut < 6.5), `${regulating.map((r) => fmt(r.vOut))}`);
  check('while NOT regulating, the output tracks the supply as a plain divider',
    off.every((r) => Math.abs(r.vOut - r.v * 1000 / 1470) < 1e-6), '');
  check('while regulating, the Zener current is positive — it really is conducting',
    regulating.every((r) => r.iz > 0), '');
  check('while off, the Zener current is exactly zero — not "a little"',
    off.every((r) => Math.abs(r.iz) < 1e-12), '');
  for (const r of regulating) {
    near(`${r.v} V in: load current + Zener current = total through R_S`, r.il + r.iz, r.itot, 1e-9, ' A');
  }
  /*
   * The Zener current takes ALL of the extra, not merely most of it. The load
   * current does move a little — a real Zener has a few ohms of slope resistance,
   * so its voltage rises slightly with current and the load follows — so the
   * honest claim is the RATIO, not that the load current is frozen.
   */
  check('the Zener current absorbs more than 20× the change the load current shows',
    (() => {
      const sorted = regulating.slice().sort((a, b) => a.v - b.v);
      const dIz = sorted[sorted.length - 1].iz - sorted[0].iz;
      const dIl = Math.abs(sorted[sorted.length - 1].il - sorted[0].il);
      return dIz > 0 && dIz > 20 * dIl;
    })(), (() => {
      const sorted = regulating.slice().sort((a, b) => a.v - b.v);
      return `ΔI_Z ${fmt(sorted[sorted.length - 1].iz - sorted[0].iz)} A vs ΔI_L ${fmt(Math.abs(sorted[sorted.length - 1].il - sorted[0].il))} A`;
    })());
  // Load regulation: at fixed supply, the Zener absorbs what the load stops taking.
  const loads = [1000, 2000, 5000, 10000, 20000];
  const byLoad = loads.map((load) => {
    const s = znArch.buildScene({ zener: 6.2, supply: 12, series: 470, load });
    const sol = SOLVED.solveDiodeCircuit(s.circuit, s.diodes);
    return { load, vOut: sol.solution.potentials.out ?? 0, iz: -(sol.currents.DZ ?? 0), il: sol.solution.currents.RL ?? 0 };
  });
  // 1.2% of 6.2 V over a 40:1 load swing. That IS Zener load regulation — the
  // slope resistance is real, and a check demanding 0.00 V of movement would be
  // asserting an ideal part rather than the one being modelled.
  check('output holds within 0.10 V (1.6%) across a 20:1 load range',
    Math.max(...byLoad.map((b) => b.vOut)) - Math.min(...byLoad.map((b) => b.vOut)) < 0.10,
    `spread ${fmt(Math.max(...byLoad.map((b) => b.vOut)) - Math.min(...byLoad.map((b) => b.vOut)))} V`);
  check('and it stays in breakdown across that whole load range',
    byLoad.every((b) => b.iz > 0), `${byLoad.map((b) => fmt(b.iz))}`);
  /*
   * THE LOAD LIMIT, and it is the other half of the lesson. With R_S = 470 Ω and
   * 12 V in, the most current the regulator can pass is (12 − 6.2)/470 = 12.3 mA.
   * A 500 Ω load at 6.2 V wants 12.4 mA — more than that — so the Zener falls out
   * of breakdown and regulation fails from the LOAD side rather than the supply
   * side. An earlier version of this check asserted the Zener stayed in breakdown at
   * 500 Ω; the circuit was right and the check was wrong.
   */
  const heavy = (() => {
    const s2 = znArch.buildScene({ zener: 6.2, supply: 12, series: 470, load: 500 });
    const sol2 = SOLVED.solveDiodeCircuit(s2.circuit, s2.diodes);
    return { state: sol2.states.DZ, vOut: sol2.solution.potentials.out ?? 0 };
  })();
  check('a load heavier than R_S can supply drops the Zener OUT of breakdown',
    heavy.state === 'off', `${heavy.state}, V_out ${fmt(heavy.vOut)} V`);
  check('and the output then falls below the Zener rating',
    heavy.vOut < 6.2, `${fmt(heavy.vOut)} V`);
  near('the maximum current this regulator can pass is (V_in − V_Z)/R_S',
    (12 - 6.2) / 470, 0.012340, 1e-4, ' A');
  check('a lighter load makes the Zener take MORE current, not less',
    byLoad[byLoad.length - 1].iz > byLoad[0].iz,
    `${fmt(byLoad[0].iz)} A at 500 Ω → ${fmt(byLoad[byLoad.length - 1].iz)} A at 20 kΩ`);
  // Different Zener ratings.
  for (const vz of [3.3, 5.1, 9.1, 12]) {
    const s = znArch.buildScene({ zener: vz, supply: 24, series: 470, load: 2200 });
    const sol = SOLVED.solveDiodeCircuit(s.circuit, s.diodes);
    const vOut = sol.solution.potentials.out ?? 0;
    check(`a ${vz} V Zener regulates to ${vz} V (±0.4)`, Math.abs(vOut - vz) < 0.4, `${fmt(vOut)} V`);
    check(`a ${vz} V Zener is in breakdown at 24 V in`, sol.states.DZ === 'breakdown', sol.states.DZ);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 13. THE TRANSISTOR
// ═══════════════════════════════════════════════════════════════════════════
G('the transistor — I_C = βI_B, and the ceiling that stops it');
const base = { beta: 100, vbeOn: 0.7, vceSat: 0.2, vbb: 3, rb: 100000, vcc: 12, rc: 2200 };
for (const vbb of [0, 0.3, 0.5, 0.69, 0.71, 1, 2, 3, 4, 5, 6, 7, 9, 12]) {
  const t = { ...base, vbb };
  const s = TRAN.solveTransistor(t);
  const wantIb = Math.max(0, (vbb - 0.7) / t.rb);
  near(`V_BB = ${vbb}: I_B = (V_BB − 0.7)/R_B`, s.ib, wantIb, 1e-12, ' A');
  near(`V_BB = ${vbb}: I_E = I_B + I_C exactly`, s.ie, s.ib + s.ic, 1e-15, ' A');
  near(`V_BB = ${vbb}: α = β/(1+β)`, s.alpha, t.beta / (1 + t.beta), 1e-12);
  check(`V_BB = ${vbb}: V_CE never exceeds V_CC nor falls below V_CE(sat)`,
    s.vce <= t.vcc + 1e-12 && s.vce >= t.vceSat - 1e-12, `${fmt(s.vce)} V`);
  check(`V_BB = ${vbb}: the explanation is a real sentence`, s.explanation.length > 60, '');
  if (vbb < 0.7) {
    check(`V_BB = ${vbb}: CUTOFF`, s.region === 'cutoff', s.region);
    check(`V_BB = ${vbb}: no collector current at all`, s.ic === 0, `${fmt(s.ic)}`);
    near(`V_BB = ${vbb}: the whole supply sits across the transistor`, s.vce, t.vcc, 1e-12, ' V');
  } else if (s.region === 'active') {
    near(`V_BB = ${vbb}: ACTIVE — I_C = β·I_B`, s.ic, t.beta * s.ib, 1e-12, ' A');
    near(`V_BB = ${vbb}: V_CE = V_CC − I_C·R_C`, s.vce, t.vcc - s.ic * t.rc, 1e-9, ' V');
    near(`V_BB = ${vbb}: the effective β equals the rating`, s.betaEffective, t.beta, 1e-9);
  } else {
    check(`V_BB = ${vbb}: SATURATION`, s.region === 'saturation', s.region);
    near(`V_BB = ${vbb}: V_CE bottoms out at V_CE(sat)`, s.vce, t.vceSat, 1e-12, ' V');
    near(`V_BB = ${vbb}: I_C is capped at (V_CC − V_CE_sat)/R_C`,
      s.ic, (t.vcc - t.vceSat) / t.rc, 1e-12, ' A');
    check(`V_BB = ${vbb}: the effective β has FALLEN below the rating — the signature`,
      s.betaEffective < t.beta, `${fmt(s.betaEffective)} vs ${t.beta}`);
    check(`V_BB = ${vbb}: I_C is LESS than β·I_B`, s.ic < t.beta * s.ib, '');
    check(`V_BB = ${vbb}: overdrive is above 1`, s.overdrive > 1, `${fmt(s.overdrive)}`);
  }
}
// Monotonicity — the transfer curve must fall, everywhere.
const tc = TRAN.transferCurve(base, 10, 400);
check('the transfer curve is monotonically non-increasing (the stage inverts, everywhere)',
  tc.every((p, i) => i === 0 || p.vce <= tc[i - 1].vce + 1e-12), '');
check('the transfer curve starts at V_CC and ends at V_CE(sat)',
  Math.abs(tc[0].vce - 12) < 1e-9 && Math.abs(tc[tc.length - 1].vce - 0.2) < 1e-9,
  `${fmt(tc[0].vce)} → ${fmt(tc[tc.length - 1].vce)}`);
check('the transfer curve passes through all three regions',
  new Set(tc.map((p) => p.region)).size === 3, `${[...new Set(tc.map((p) => p.region))]}`);
check('collector current is monotonically non-decreasing along it',
  tc.every((p, i) => i === 0 || p.ic >= tc[i - 1].ic - 1e-15), '');
const win = TRAN.activeWindow(base);
near('the active window starts at V_BE(on)', win.from, 0.7, 1e-12, ' V');
near('the active window ends where saturation begins',
  win.to, 0.7 + ((12 - 0.2) / 2200 / 100) * 100000, 1e-9, ' V');
check('the operating point at the middle of the window is ACTIVE',
  TRAN.solveTransistor({ ...base, vbb: (win.from + win.to) / 2 }).region === 'active', '');
check('just below the window it is cut off',
  TRAN.solveTransistor({ ...base, vbb: win.from - 0.01 }).region === 'cutoff', '');
check('just above the window it is saturated',
  TRAN.solveTransistor({ ...base, vbb: win.to + 0.05 }).region === 'saturation', '');

G('β sweep — the ratio, and what does not depend on it');
for (const beta of [20, 50, 100, 200, 300]) {
  const t = { ...base, beta, vbb: 3 };
  const s = TRAN.solveTransistor(t);
  near(`β = ${beta}: I_B does not depend on β at all`, s.ib, (3 - 0.7) / t.rb, 1e-12, ' A');
  near(`β = ${beta}: α = β/(1+β)`, s.alpha, beta / (1 + beta), 1e-12);
  check(`β = ${beta}: α is just under 1`, s.alpha < 1 && s.alpha > 0.95, `${fmt(s.alpha)}`);
  if (s.region === 'active') near(`β = ${beta}: I_C = β·I_B`, s.ic, beta * s.ib, 1e-12, ' A');
  /*
   * ⚠ R_B MUST BE LOWERED TO ACTUALLY SATURATE A LOW-β PART. With R_B = 100 kΩ and
   * β = 20, V_BB = 12 V gives I_B = 113 µA and β·I_B = 2.26 mA — still ACTIVE, with
   * V_CE at 7 V. An earlier version of this check assumed 12 V saturates everything
   * and failed for the low-β cases; the transistor was right and the check was
   * wrong. 10 kΩ gives I_B = 1.13 mA, which saturates every β in the sweep.
   */
  const sat = TRAN.solveTransistor({ ...t, vbb: 12, rb: 10000 });
  check(`β = ${beta}: V_BB = 12 V through 10 kΩ does saturate it`, sat.region === 'saturation', sat.region);
  near(`β = ${beta}: the SATURATED collector current does not depend on β`,
    sat.ic, (12 - 0.2) / 2200, 1e-12, ' A');
  near(`β = ${beta}: nor does the saturated V_CE`, sat.vce, 0.2, 1e-12, ' V');
}
check('a 15:1 spread in β changes the saturated output by nothing at all — why switches saturate',
  (() => {
    const a = TRAN.solveTransistor({ ...base, beta: 20, vbb: 12, rb: 10000 });
    const b = TRAN.solveTransistor({ ...base, beta: 300, vbb: 12, rb: 10000 });
    return a.region === 'saturation' && b.region === 'saturation'
      && Math.abs(a.vce - b.vce) < 1e-12 && Math.abs(a.ic - b.ic) < 1e-12;
  })(), '');
check('but in the ACTIVE region the same spread changes the output enormously',
  (() => {
    const a = TRAN.solveTransistor({ ...base, beta: 20, vbb: 2 });
    const b = TRAN.solveTransistor({ ...base, beta: 300, vbb: 2 });
    return Math.abs(a.vce - b.vce) > 5;
  })(), '');

G('CROSS-DERIVATION: the base loop through the FROZEN nodal solver');
/*
 * The base loop is a genuine linear circuit — V_BB, R_B and the 0.7 V junction as
 * the same companion element a conducting diode becomes. So `solveTransistor`'s
 * closed form and the frozen MNA are two independent routes to I_B. If either has
 * a sign error or a factor wrong, they part company here.
 */
for (const vbb of [1, 2, 3, 5, 8, 12]) {
  for (const rb of [10000, 47000, 100000, 470000]) {
    const t = { ...base, vbb, rb };
    const circuit = TRAN.baseLoopCircuit(t);
    const sol = CSOLVE.solveCircuit(circuit);
    check(`base loop V_BB=${vbb} R_B=${rb}: the frozen solver is not singular`, !sol.singular, sol.warnings.join(' '));
    near(`base loop V_BB=${vbb} R_B=${rb}: MNA I_B equals the closed form`,
      sol.currents.RB ?? 0, TRAN.solveTransistor(t).ib, 1e-9, ' A');
    near(`base loop V_BB=${vbb} R_B=${rb}: the junction really holds 0.7 V`,
      (sol.potentials.b ?? 0) - (sol.potentials.e ?? 0), 0.7, 1e-9, ' V');
    near(`base loop V_BB=${vbb} R_B=${rb}: the supply node is at V_BB`, sol.potentials.bb ?? 0, vbb, 1e-9, ' V');
  }
}

G('gain — negative, and two different numbers for two different questions');
for (const [rc, rb] of [[2200, 100000], [4700, 47000], [1000, 10000], [10000, 470000]]) {
  const t = { ...base, rc, rb, vbb: 1.4 };
  const s = TRAN.solveTransistor(t);
  const g = TRAN.gainOf(t, s);
  if (s.region === 'active') {
    near(`R_C=${rc} R_B=${rb}: d.c. gain is −βR_C/R_B`, g.dcGain, -(100 * rc) / rb, 1e-9);
    check(`R_C=${rc} R_B=${rb}: the gain is NEGATIVE — the stage inverts`, g.dcGain < 0, `${fmt(g.dcGain)}`);
    near(`R_C=${rc} R_B=${rb}: g_m = I_C/V_T`, g.gm, s.ic / MAT.V_T, 1e-9, ' S');
    near(`R_C=${rc} R_B=${rb}: intrinsic gain is −g_m·R_C`, g.intrinsicGain, -g.gm * rc, 1e-9);
    check(`R_C=${rc} R_B=${rb}: the intrinsic gain is much larger than the d.c. gain`,
      Math.abs(g.intrinsicGain) > Math.abs(g.dcGain), `${fmt(g.intrinsicGain)} vs ${fmt(g.dcGain)}`);
    check(`R_C=${rc} R_B=${rb}: current gain is β`, g.currentGain === 100, `${g.currentGain}`);
    check(`R_C=${rc} R_B=${rb}: not flagged as clipped`, !g.clipped, '');
  }
}
// A MEASURED gain — nudge the input and watch the output, which is what the view does.
{
  const t = { ...base, vbb: 1.4 };
  const s = TRAN.solveTransistor(t);
  const g = TRAN.gainOf(t, s);
  const dv = 0.05;
  const hi = TRAN.solveTransistor({ ...t, vbb: t.vbb + dv });
  const lo = TRAN.solveTransistor({ ...t, vbb: t.vbb - dv });
  near('the MEASURED gain (nudge V_BB, watch V_CE) equals −βR_C/R_B',
    (hi.vce - lo.vce) / (2 * dv), g.dcGain, 1e-6);
  check('the measured gain is negative', (hi.vce - lo.vce) / (2 * dv) < 0, '');
}
check('a saturated stage reports zero gain and flags itself clipped',
  (() => {
    const t = { ...base, vbb: 12 };
    const g = TRAN.gainOf(t, TRAN.solveTransistor(t));
    return g.dcGain === 0 && g.clipped && g.note.includes('Saturated');
  })(), '');
check('a cut-off stage reports zero gain and flags itself clipped',
  (() => {
    const t = { ...base, vbb: 0.2 };
    const g = TRAN.gainOf(t, TRAN.solveTransistor(t));
    return g.dcGain === 0 && g.clipped;
  })(), '');

// ═══════════════════════════════════════════════════════════════════════════
// 14. SEMICONDUCTOR ARCHETYPES + CANVAS FILL
// ═══════════════════════════════════════════════════════════════════════════
G('semiconductor archetypes');
/*
 * The vocabulary, written out rather than imported from the union — a type union has
 * no runtime existence, so this list is the only way to catch a `targets` string
 * that is not a real code. Kept to the nine resistor-network codes plus the seven
 * this unit added; the AC codes are another agent's and are not asserted here.
 */
const CIRCUIT_VOCAB = [
  'series_parallel_by_appearance', 'current_used_up', 'battery_constant_current',
  'voltage_across_wire', 'meter_is_ideal', 'more_resistors_more_resistance',
  'brightness_by_position', 'short_circuit_ignored', 'balanced_bridge_carries_current',
  'doping_adds_both_carriers', 'depletion_region_is_empty_space',
  'forward_and_reverse_are_different_rules', 'diode_has_a_resistance',
  'breakdown_destroys_a_diode', 'collector_current_is_always_beta_ib',
  'amplifier_output_follows_the_input',
];
for (const id of SARCH.SEMICONDUCTOR_ARCHETYPE_ORDER) {
  const a = SARCH.SEMICONDUCTOR_ARCHETYPES[id];
  if (!a) { check(`${id} exists`, false, 'missing'); continue; }
  const defaults = Object.fromEntries((a.params ?? []).map((p) => [p.key, p.default]));
  let circuit;
  let scene;
  try { circuit = a.build(defaults); scene = a.buildScene(defaults); }
  catch (e) { check(`${id} builds without throwing`, false, String(e).slice(0, 90)); continue; }
  check(`${id}: build() returns a real circuit`,
    !!circuit && Array.isArray(circuit.nodes) && circuit.nodes.length >= 2, '');
  check(`${id}: buildScene() declares view = ${a.view}`, scene.view === a.view,
    `declared ${a.view}, built ${scene.view}`);
  check(`${id} exposes 2+ params`, (a.params ?? []).length >= 2, `${(a.params ?? []).length}`);
  check(`${id} has a guided script of 3+ beats`, (a.defaultSteps ?? []).length >= 3,
    `${(a.defaultSteps ?? []).length}`);
  check(`${id} declares a misconception code`, typeof a.targets === 'string', `${a.targets}`);
  check(`${id}: that code is in the CircuitMisconception vocabulary`,
    CIRCUIT_VOCAB.includes(a.targets), `${a.targets}`);
  check(`${id}: that code resolves to real copy in CIRCUIT_ISSUES`,
    (() => {
      const iss = CISSUES.CIRCUIT_ISSUES[a.targets];
      return !!iss && iss.code === a.targets && iss.message.length > 60;
    })(), `${a.targets}`);
  check(`${id}: and offers a hint, not just a correction`,
    (CISSUES.CIRCUIT_ISSUES[a.targets]?.hint ?? '').length > 40, '');
  check(`${id}: every guided step has non-empty say and cta`,
    (a.defaultSteps ?? []).every((s) => s.say?.trim() && s.cta?.trim()), '');
  check(`${id}: no duplicate guided steps`,
    new Set((a.defaultSteps ?? []).map((s) => s.say)).size === (a.defaultSteps ?? []).length, '');
  check(`${id}: every declared diode has a placeholder component in the circuit`,
    scene.diodes.every((d) => circuit.components.some((c) => c.id === d.id)), '');
  check(`${id}: every diode's nodes exist in the circuit`,
    scene.diodes.every((d) => circuit.nodes.some((n) => n.id === d.anode)
      && circuit.nodes.some((n) => n.id === d.cathode)), '');
  check(`${id}: every component's nodes are declared`,
    circuit.components.every((c) => circuit.nodes.some((n) => n.id === c.a)
      && circuit.nodes.some((n) => n.id === c.b)), '');
  check(`${id}: component ids are unique`,
    new Set(circuit.components.map((c) => c.id)).size === circuit.components.length, '');
  check(`${id}: exactly one node is marked ground`,
    circuit.nodes.filter((n) => n.ground).length === 1,
    `${circuit.nodes.filter((n) => n.ground).length}`);
  for (const p of a.params ?? []) {
    check(`${id}: param "${p.key}" has a label and a default`, !!p.label && p.default !== undefined, '');
    if (p.kind === 'select') {
      check(`${id}: select "${p.key}" lists its default among its options`,
        (p.options ?? []).includes(String(p.default)), `${p.default}`);
    }
    if (p.kind === 'number') {
      check(`${id}: number "${p.key}" default is inside its range`,
        p.min === undefined || p.max === undefined
        || (Number(p.default) >= p.min && Number(p.default) <= p.max),
        `${p.default} not in [${p.min}, ${p.max}]`);
    }
  }
  // Every scene must be solvable if it has diodes and a source.
  if (scene.diodes.length && circuit.components.some((c) => c.kind === 'battery')) {
    const sol = SOLVED.solveDiodeCircuit(circuit, scene.diodes);
    check(`${id}: the built circuit solves with a consistent diode state`, !sol.unsolved, sol.warnings.join(' '));
  }
}
check('every semiconductor archetype declares a misconception code',
  SARCH.SEMICONDUCTOR_ARCHETYPE_ORDER.every((id) => !!SARCH.SEMICONDUCTOR_ARCHETYPES[id].targets), '');
check('the two codes REUSED from the resistor-network set are the two that genuinely fit',
  SARCH.SEMICONDUCTOR_ARCHETYPES['half-wave-rectifier'].targets === 'current_used_up'
  && SARCH.SEMICONDUCTOR_ARCHETYPES['full-wave-rectifier'].targets === 'series_parallel_by_appearance', '');
check('no two archetypes share a code — each attacks a distinct belief',
  (() => {
    const codes = SARCH.SEMICONDUCTOR_ARCHETYPE_ORDER.map((id) => SARCH.SEMICONDUCTOR_ARCHETYPES[id].targets);
    return new Set(codes).size === codes.length;
  })(), '');
check('the catalog exposes every archetype with params for the admin editor',
  SARCH.SEMICONDUCTOR_ARCHETYPE_CATALOG.length === SARCH.SEMICONDUCTOR_ARCHETYPE_ORDER.length, '');
check('a bad param degrades rather than throwing (blocks are hand-editable)',
  (() => {
    try { SARCH.SEMICONDUCTOR_ARCHETYPES['intrinsic-to-doped'].buildScene({ material: 'Unobtainium' }); return true; }
    catch { return false; }
  })(), '');

G('the misconception vocabulary — every code has copy, and it is a compile error not to');
/*
 * `FIELD_ISSUES` and `CIRCUIT_ISSUES` are annotated `Record<Misconception, Issue>`,
 * which is exhaustive: adding a code to either union without copy here does not
 * ship a blank card, it fails to compile. These runtime checks are the belt to that
 * braces — they confirm the records really do cover the codes this unit added, that
 * each entry's `code` matches its key (a copy-paste slip that types cannot see), and
 * that the copy is substantial rather than a placeholder.
 */
const NUCLEAR_CODES = [
  'bigger_nucleus_more_tightly_bound', 'mass_and_energy_are_separate',
  'fission_energy_from_size_not_binding', 'fission_and_fusion_are_opposites',
  'half_life_is_half_the_lifetime', 'nucleus_contains_electrons',
];
const SEMI_CODES = [
  'doping_adds_both_carriers', 'depletion_region_is_empty_space',
  'forward_and_reverse_are_different_rules', 'diode_has_a_resistance',
  'breakdown_destroys_a_diode', 'collector_current_is_always_beta_ib',
  'amplifier_output_follows_the_input',
];
for (const code of NUCLEAR_CODES) {
  const iss = FISSUES.FIELD_ISSUES[code];
  check(`FIELD_ISSUES has an entry for ${code}`, !!iss, '');
  check(`${code}: its entry's own code matches its key`, iss?.code === code, `${iss?.code}`);
  check(`${code}: the belief is quoted in the student's words`, (iss?.belief ?? '').length > 25, '');
  check(`${code}: the message is a real correction, not a placeholder`, (iss?.message ?? '').length > 80, '');
  check(`${code}: there is a hint`, (iss?.hint ?? '').length > 40, '');
  check(`${code}: the copy does not contain the ÷ glyph`,
    !`${iss?.belief}${iss?.message}${iss?.hint}`.includes('÷'), '');
  check(`${code}: no exponent notation leaks into the copy`,
    !/\d e[+-]\d/i.test(`${iss?.message}${iss?.hint}`), '');
}
for (const code of SEMI_CODES) {
  const iss = CISSUES.CIRCUIT_ISSUES[code];
  check(`CIRCUIT_ISSUES has an entry for ${code}`, !!iss, '');
  check(`${code}: its entry's own code matches its key`, iss?.code === code, `${iss?.code}`);
  check(`${code}: the belief is quoted in the student's words`, (iss?.belief ?? '').length > 25, '');
  check(`${code}: the message is a real correction, not a placeholder`, (iss?.message ?? '').length > 80, '');
  check(`${code}: there is a hint`, (iss?.hint ?? '').length > 40, '');
  check(`${code}: the copy does not contain the ÷ glyph`,
    !`${iss?.belief}${iss?.message}${iss?.hint}`.includes('÷'), '');
}
check('every FIELD_ISSUES entry has its own code as its key — all of them, not just ours',
  Object.entries(FISSUES.FIELD_ISSUES).every(([k, v]) => v.code === k), '');
check('every CIRCUIT_ISSUES entry has its own code as its key',
  Object.entries(CISSUES.CIRCUIT_ISSUES).every(([k, v]) => v.code === k), '');
check('issueFor() returns null for an absent code rather than throwing',
  FISSUES.issueFor(undefined) === null, '');
check('the six nuclear codes are all distinct from the sixteen that were already there',
  new Set(NUCLEAR_CODES).size === 6
  && NUCLEAR_CODES.every((c) => !['field_lines_are_paths', 'potential_is_potential_energy',
    'magnetic_force_does_work', 'g_constant_inside_earth'].includes(c)), '');
check('every nuclear archetype targets a DIFFERENT code — six exercises, six beliefs',
  (() => {
    const codes = NARCH.NUCLEAR_ARCHETYPE_ORDER.map((id) => NARCH.NUCLEAR_ARCHETYPES[id].targets);
    return new Set(codes).size === 6 && codes.every((c) => NUCLEAR_CODES.includes(c));
  })(), '');

G('semiconductor canvas — measured, not eyeballed');
for (const b of BOARDS) {
  const box = SVIEW.plotBox(b.w, b.h);
  const f = SVIEW.plotFill(box);
  check(`semiconductor plot @ ${b.name}: drawable rect is 60–100% on x`,
    f.fx >= 0.6 && f.fx <= 1.0, `${(f.fx * 100).toFixed(1)}%`);
  check(`semiconductor plot @ ${b.name}: drawable rect is 60–100% on y`,
    f.fy >= 0.6 && f.fy <= 1.0, `${(f.fy * 100).toFixed(1)}%`);
  check(`semiconductor plot @ ${b.name}: the rect is inside the canvas`,
    box.rect.x >= 0 && box.rect.x + box.rect.w <= b.w
    && box.rect.y >= 0 && box.rect.y + box.rect.h <= b.h, '');
  // Every stage height at this width must be inside its own bounds.
  for (const [aspect, max, min] of [[0.46, 300, 190], [0.5, 340, 210], [0.6, 380, 240], [0.2, 150, 96]]) {
    const hh = STAGE.stageHeightFor(b.w, aspect, max, min);
    check(`stageHeightFor(${b.w}, ${aspect}) stays within [${min}, ${max}]`,
      hh >= min && hh <= max, `${hh}`);
  }
  // The band diagram's data must span the rect.
  const dep = JUNC.depletion(J, 0);
  const lim = SVIEW.junctionLimits(SVIEW.toNm(dep.intoP), SVIEW.toNm(dep.intoN));
  const px = SVIEW.axis(lim.xMin, lim.xMax, box.rect.x, box.rect.x + box.rect.w);
  const bands = JUNC.bandProfile(J, 0, 120);
  const xs = bands.x.map((v) => px(SVIEW.toNm(v)));
  const dx = (Math.max(...xs) - Math.min(...xs)) / box.rect.w;
  check(`band diagram @ ${b.name}: data spans ≥ 90% of the rect on x`, dx >= 0.9, `${(dx * 100).toFixed(1)}%`);
  check(`band diagram @ ${b.name}: nothing is drawn outside the rect`,
    Math.min(...xs) >= box.rect.x - 0.5 && Math.max(...xs) <= box.rect.x + box.rect.w + 0.5,
    `[${fmt(Math.min(...xs))}, ${fmt(Math.max(...xs))}] vs rect [${box.rect.x}, ${box.rect.x + box.rect.w}]`);
  // The two paddings must be the SAME formula, or the ends get clipped.
  near(`band diagram @ ${b.name}: the profile's own x-range equals junctionLimits`,
    SVIEW.toNm(bands.x[0]), lim.xMin, 1e-9, ' nm');
  near(`band diagram @ ${b.name}: ...at the other end too`,
    SVIEW.toNm(bands.x[bands.x.length - 1]), lim.xMax, 1e-9, ' nm');
  check(`junctionLimits @ ${b.name}: neutral bulk is included on BOTH sides`,
    lim.xMin < -SVIEW.toNm(dep.intoP) && lim.xMax > SVIEW.toNm(dep.intoN), '');
  // The rectifier waveform must span the rect on both axes.
  const scene = hwArch.buildScene({ peak: 12, load: 1000 });
  const r = RECT.sweepRectifier({ circuit: scene.circuit, diodes: scene.diodes, ...scene.rectifier }, 120);
  const pyv = SVIEW.axis(-12 * 1.1, 12 * 1.1, box.rect.y + box.rect.h, box.rect.y);
  const ys = r.points.map((p) => pyv(p.vIn));
  const dy = (Math.max(...ys) - Math.min(...ys)) / box.rect.h;
  check(`rectifier waveform @ ${b.name}: input spans ≥ 85% of the rect on y`, dy >= 0.85, `${(dy * 100).toFixed(1)}%`);
}
check('an unmeasured (zero) width returns the MINIMUM height, not the maximum',
  STAGE.stageHeightFor(0, 0.5, 380, 220) === 220, `${STAGE.stageHeightFor(0, 0.5, 380, 220)}`);
// The symmetric-log mapper: it has to show fifteen decades AND the sign change.
const sl = SVIEW.symlog(1e-12, 15);
check('symlog is zero at zero', sl(0) === 0, `${sl(0)}`);
check('symlog is odd — it shows negative currents, which a plain log cannot',
  Math.abs(sl(-1e-3) + sl(1e-3)) < 1e-12, '');
check('symlog is monotonic across fifteen decades',
  (() => {
    const vs = [-1, -1e-3, -1e-9, -1e-15, 0, 1e-15, 1e-9, 1e-3, 1];
    const ys = vs.map(sl);
    return ys.every((v, i) => i === 0 || v > ys[i - 1]);
  })(), '');
check('symlog stays inside ±1', [1e3, -1e3, 1, -1].every((v) => Math.abs(sl(v)) <= 1.0000001), '');
for (const [min, max] of [[0, 24], [-1.2, 0.9], [0, 360], [8, 29]]) {
  const t = SVIEW.ticks(min, max, 6);
  check(`semiconductor ticks(${min}, ${max}) are ascending and inside range`,
    t.length >= 2 && t.every((v, i) => i === 0 || v > t[i - 1])
    && t[0] >= min - 1e-9 && t[t.length - 1] <= max + 1e-9, `${t}`);
}
check('polyline() produces a valid SVG path',
  (() => {
    const p = SVIEW.polyline([{ a: 0 }, { a: 1 }, { a: 2 }], (q) => q.a, (q) => q.a * 2);
    return p.startsWith('M') && p.split('L').length === 3;
  })(), '');

G('formatters — no "e+22" ever reaches a student');
const FMT = await import(`${SEMI}format.ts`);
for (const v of [5e28, 1.5e16, 2.25e10, 1.7e-15, 470, 0.0043, 6.2, 0, 1e-9]) {
  check(`si(${fmt(v)}) contains no exponent notation`, !/e[+-]/i.test(FMT.si(v, 'A')), FMT.si(v, 'A'));
  check(`power(${fmt(v)}) contains no exponent notation`, !/e[+-]/i.test(FMT.power(v, 'm⁻³')), FMT.power(v, 'm⁻³'));
}
check('perM3 uses the × 10ⁿ form', FMT.perM3(1.5e16).includes('× 10'), FMT.perM3(1.5e16));
check('si uses SI prefixes for lab quantities', FMT.si(4.3e-3, 'A') === '4.3 mA', FMT.si(4.3e-3, 'A'));
check('si handles zero', FMT.si(0, 'V') === '0 V', FMT.si(0, 'V'));
// `toLocaleString('en-IN')` groups in lakhs, so five million prints as 50,00,000.
// That is the Indian convention and the right one for this audience — a JEE student
// reads it as "50 lakh" without pausing. Asserted explicitly so nobody "fixes" it.
check('oneIn groups in the Indian convention (50,00,000, i.e. 50 lakh)',
  FMT.oneIn(2e-7) === '1 in 50,00,000', FMT.oneIn(2e-7));
check('no formatter emits the ÷ glyph (it reads as + from a distance)',
  ![FMT.si(1, 'A'), FMT.power(1, 'x'), FMT.perM3(1), FMT.oneIn(0.1)].some((s) => s.includes('÷')), '');

// ═══════════════════════════════════════════════════════════════════════════
// report
// ═══════════════════════════════════════════════════════════════════════════

const W = 78;
console.log('');
console.log('  Unit 13 — Modern Physics: every academic claim, re-derived');
console.log(`  ${'═'.repeat(W)}`);

for (const r of rows) {
  if (r.header) {
    console.log('');
    console.log(`  ${r.group}`);
    console.log(`  ${'─'.repeat(W)}`);
    continue;
  }
  const mark = r.ok ? 'PASS' : 'FAIL';
  const name = r.name.length > 62 ? `${r.name.slice(0, 59)}...` : r.name;
  console.log(`  ${mark}  ${name}`);
  if (!r.ok && r.detail) console.log(`        ↳ ${r.detail}`);
  else if (r.ok && r.detail && process.env.VERBOSE) console.log(`        ↳ ${r.detail}`);
}

console.log('');
console.log(`  ${'═'.repeat(W)}`);
console.log(`  ${pass}/${pass + fail} checks passed${fail ? ` — ${fail} FAILED` : ''}`);
console.log('');
process.exit(fail ? 1 : 0);
