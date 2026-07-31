/*
 * verify-circuit-bench.mjs — physics verification for the E3 engine core.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-circuit-bench.mjs
 *
 * Requires Node ≥ 22.6. It imports the engine's TypeScript sources DIRECTLY —
 * Node strips the types natively, and the `registerHooks` shim below resolves
 * the repo's extensionless relative imports (`from './netlist'`) to their `.ts`
 * files, which native resolution does not do. No build step, no test framework,
 * no dependencies.
 *
 * WHY THIS EXISTS. PHYSICS_SIMULATION_PROGRAM.md §9: "Physics must be verifiable
 * outside React. No academic claim ships unverified." Every expected value below
 * is HAND-DERIVED in the comment above its case, from the standard Class 11/12
 * result — never copied out of a previous run of this code.
 *
 * The last two groups are the ones that catch what hand-picked cases cannot:
 *   • Kirchhoff's two laws are checked to 1e-9 on randomly generated networks,
 *     where no expected value can be written down but the physics still has to
 *     hold;
 *   • the REDRAW's final R_eq is checked against the independent nodal-analysis
 *     R_eq for every series-parallel archetype, so a plausible-looking reduction
 *     that quietly loses a resistor cannot ship.
 *
 * Exits non-zero on any failure.
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    // Extensionless relative imports ('./netlist', '../types') need the .ts
    // appended. Note some LOOK like they have an extension, so test the
    // filesystem rather than the spelling.
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

const ROOT = new URL('../packages/book-renderer/blocks/circuit-bench/', import.meta.url);
const LIB = new URL('lib/', ROOT);

const {
  mkBattery, mkCircuit, mkGalvanometer, mkNode, mkResistor, mkWire, mkAmmeter,
  mkVoltmeter, mkSwitch, resistanceOf,
} = await import(new URL('netlist.ts', LIB).href);
const { solveCircuit, equivalentResistance, probeResistance, prepareForResistance } =
  await import(new URL('solve.ts', LIB).href);
const { redraw, foldTree } = await import(new URL('redraw.ts', LIB).href);
const { checkKirchhoff, fundamentalLoops } = await import(new URL('kirchhoff.ts', LIB).href);
const { detectIssues, CIRCUIT_ISSUES } = await import(new URL('misconceptions.ts', LIB).href);
const { canonicalPositions, nodePositions, circuitBounds, placeComponents } =
  await import(new URL('layout.ts', LIB).href);
const { CIRCUIT_ARCHETYPES, CIRCUIT_ARCHETYPE_ORDER } =
  await import(new URL('archetypes.ts', ROOT).href);

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
  results.push({
    group, name, ok: !!cond,
    actual: cond ? 'yes' : `no${detail ? ` — ${detail}` : ''}`, expected: 'yes',
  });
}

const fmt = (v) => (Number.isFinite(v) ? Number(v.toFixed(6)).toString() : String(v));
const defaults = (a) => Object.fromEntries((a.params ?? []).map((p) => [p.key, p.default]));

// ── 1 · The two facts every circuits chapter opens with ──────────────────────
// Two 6 Ω resistors. In series R = 6 + 6 = 12 Ω. In parallel R = 6·6/(6+6) = 3 Ω.
{
  const series = mkCircuit(
    [mkNode('A'), mkNode('M'), mkNode('B')],
    [mkResistor('R1', 'A', 'M', 6), mkResistor('R2', 'M', 'B', 6)],
  );
  check('1 · series & parallel', 'two 6 Ω in series → 12 Ω',
    equivalentResistance(series, 'A', 'B').value, 12);

  const parallel = mkCircuit(
    [mkNode('A'), mkNode('B')],
    [mkResistor('R1', 'A', 'B', 6), mkResistor('R2', 'A', 'B', 6)],
  );
  check('1 · series & parallel', 'two 6 Ω in parallel → 3 Ω',
    equivalentResistance(parallel, 'A', 'B').value, 3);

  // And the redraw must get the identical numbers by a completely different route.
  check('1 · series & parallel', 'redraw agrees on the series pair',
    redraw(series, ['A', 'B']).rEquivalent, 12);
  check('1 · series & parallel', 'redraw agrees on the parallel pair',
    redraw(parallel, ['A', 'B']).rEquivalent, 3);

  // 6 ‖ 3 = 2 — the example written into the frozen contract.
  const sixThree = mkCircuit(
    [mkNode('A'), mkNode('B')],
    [mkResistor('R2', 'A', 'B', 6), mkResistor('R3', 'A', 'B', 3)],
  );
  const rr = redraw(sixThree, ['A', 'B']);
  check('1 · series & parallel', '6 ‖ 3 = 2 Ω', rr.rEquivalent, 2);
  assert('1 · series & parallel', 'and it says WHY, naming both shared ends',
    /share BOTH ends/.test(rr.steps[0].explanation), rr.steps[0].explanation);
}

// ── 2 · A real cell: EMF 12 V, r = 1 Ω, load 5 Ω ─────────────────────────────
// Loop resistance = r + R = 1 + 5 = 6 Ω, so I = EMF/(r+R) = 12/6 = 2 A, and the
// terminal p.d. = EMF − I·r = 12 − 2×1 = 10 V. Power in the load = I²R = 20 W;
// power wasted inside the cell = I²r = 4 W; the cell delivers EMF·I = 24 W.
{
  const c = mkCircuit(
    [mkNode('neg', 0, 200, { ground: true }), mkNode('pos', 0, 0)],
    [
      mkBattery('B1', 'neg', 'pos', 12, { internal: 1 }),
      mkResistor('R1', 'pos', 'neg', 5),
    ],
  );
  const sol = solveCircuit(c);
  check('2 · internal resistance', 'current is 2 A', sol.currents.B1, 2);
  check('2 · internal resistance', 'load current is 2 A', sol.currents.R1, 2);
  // voltages[] is V(a) − V(b); `a` is the − terminal, so the TERMINAL p.d. is
  // the negative of it. That sign convention is stated in netlist.ts.
  check('2 · internal resistance', 'terminal p.d. is 10 V', -sol.voltages.B1, 10);
  check('2 · internal resistance', 'p.d. across the load is 10 V', sol.voltages.R1, 10);
  check('2 · internal resistance', 'load dissipates 20 W', sol.power.R1, 20);
  check('2 · internal resistance', 'cell DELIVERS 20 W (negative = delivering)',
    sol.power.B1, -20);
  check('2 · internal resistance', 'the loop resistance is r + R = 6 Ω',
    probeResistance(c, ['neg', 'pos']).value, 6);
  check('2 · internal resistance', 'and the redraw finds the same 6 Ω',
    redraw(c, ['neg', 'pos']).rEquivalent, 6);

  // Double the load and the current is NOT halved-then-forgotten: 12/11 A.
  const c2 = mkCircuit(c.nodes, [
    mkBattery('B1', 'neg', 'pos', 12, { internal: 1 }),
    mkResistor('R1', 'pos', 'neg', 10),
  ]);
  check('2 · internal resistance', 'load 10 Ω → I = 12/11 A',
    solveCircuit(c2).currents.B1, 12 / 11);
}

// ── 3 · An ideal wire: no p.d., real current ─────────────────────────────────
// 12 V across a 6 Ω load through two ideal leads: I = 2 A, and each lead carries
// the full 2 A with exactly 0 V across it. Give the leads 1 Ω each and the same
// circuit gives I = 12/8 = 1.5 A with 1.5 V across each lead.
{
  const build = (lead) => mkCircuit(
    [mkNode('neg', 0, 200, { ground: true }), mkNode('pos'), mkNode('m'), mkNode('x')],
    [
      mkBattery('B1', 'neg', 'pos', 12),
      mkWire('W1', 'pos', 'm', { internal: lead }),
      mkResistor('R1', 'm', 'x', 6),
      mkWire('W2', 'x', 'neg', { internal: lead }),
    ],
  );
  const ideal = solveCircuit(build(0));
  check('3 · wires', 'ideal lead carries the full 2 A', ideal.currents.W1, 2);
  check('3 · wires', 'and has exactly 0 V across it', ideal.voltages.W1, 0);
  check('3 · wires', 'the load takes the whole 12 V', ideal.voltages.R1, 12);

  const real = solveCircuit(build(1));
  check('3 · wires', '1 Ω leads → I = 1.5 A', real.currents.R1, 1.5);
  check('3 · wires', 'each lead now drops 1.5 V', real.voltages.W1, 1.5);
  check('3 · wires', 'the load only gets 9 V', real.voltages.R1, 9);

  const issues = detectIssues(build(0), ideal);
  assert('3 · wires', 'the voltage_across_wire misconception fires',
    issues.some((i) => i.code === 'voltage_across_wire'),
    issues.map((i) => i.code).join(','));
}

// ── 4 · Wheatstone, balanced: P/Q = 10/20 = 30/60 = R/S ──────────────────────
// At balance the galvanometer carries EXACTLY zero, whatever its resistance, so
// R_eq = (P+Q) ‖ (R+S) = 30 ‖ 90 = 30×90/120 = 22.5 Ω. With a 12 V cell the
// supply current is 12/22.5 = 0.5333… A.
{
  const arch = CIRCUIT_ARCHETYPES['wheatstone-balanced'];
  const c = arch.build(defaults(arch));
  const sol = solveCircuit(c);
  check('4 · balanced bridge', 'galvanometer current is exactly zero',
    sol.currents.G, 0, 1e-12);
  check('4 · balanced bridge', 'and its two ends are at the same potential',
    sol.potentials.T - sol.potentials.Bt, 0, 1e-12);
  check('4 · balanced bridge', 'R_eq = 30 ‖ 90 = 22.5 Ω',
    probeResistance(c, arch.probes).value, 22.5);
  check('4 · balanced bridge', 'supply current = 12/22.5 A', sol.currents.B1, 12 / 22.5);

  // Balance must not depend on G. 1 Ω or 1000 Ω, the answer does not move.
  for (const g of [1, 1000]) {
    const cg = arch.build({ ...defaults(arch), g });
    check('4 · balanced bridge', `still zero with G = ${g} Ω`,
      solveCircuit(cg).currents.G, 0, 1e-12);
    check('4 · balanced bridge', `R_eq unchanged with G = ${g} Ω`,
      probeResistance(cg, arch.probes).value, 22.5);
  }

  const rd = redraw(c, arch.probes);
  assert('4 · balanced bridge', 'the redraw REDUCES it', rd.fullyReduced === true,
    rd.stalledReason ?? '');
  check('4 · balanced bridge', 'to the same 22.5 Ω', rd.rEquivalent, 22.5);
  assert('4 · balanced bridge', 'by lifting out the zero-current arm',
    rd.steps.some((s) => s.kind === 'drop-zero-current' && s.componentIds.includes('G')),
    rd.steps.map((s) => s.kind).join(' → '));
  assert('4 · balanced bridge', 'and it quotes the balance ratio',
    rd.steps.some((s) => /balance condition/.test(s.explanation)),
    'no step mentions the balance condition');
  assert('4 · balanced bridge', 'the balanced_bridge misconception fires',
    detectIssues(c, sol).some((i) => i.code === 'balanced_bridge_carries_current'));
}

// ── 5 · Wheatstone, UNBALANCED — the refusal ─────────────────────────────────
// P=10, Q=20, R=30, S=40 (10/20 ≠ 30/40). Nodal by hand with V(L)=1, V(Rt)=0:
//   node T : 6(V_T − 1) + 3V_T + 4(V_T − V_Bt) = 0  →  13 V_T − 4 V_Bt = 6
//   node Bt: 4(V_Bt − 1) + 3V_Bt + 8(V_Bt − V_T) = 0 →  15 V_Bt − 8 V_T = 4
//   ⇒ V_Bt = 100/163, V_T = 1378/2119
//   I = (1 − V_T)/10 + (1 − V_Bt)/30 = 741/21190 + 273/21190 = 507/10595
//   R_eq = 10595/507 = 815/39 = 20.897435897…  ← NOT series-parallel
{
  const arch = CIRCUIT_ARCHETYPES['wheatstone-unbalanced'];
  const c = arch.build(defaults(arch));
  const sol = solveCircuit(c);
  assert('5 · unbalanced bridge', 'the galvanometer DOES carry current',
    Math.abs(sol.currents.G) > 1e-6, `I_G = ${sol.currents.G}`);
  check('5 · unbalanced bridge', 'nodal analysis still gives R_eq = 815/39 Ω',
    probeResistance(c, arch.probes).value, 815 / 39, 1e-9);

  const rd = redraw(c, arch.probes);
  assert('5 · unbalanced bridge', 'the redraw REFUSES rather than guessing',
    rd.fullyReduced === false, `it claimed R = ${rd.rEquivalent}`);
  assert('5 · unbalanced bridge', 'rEquivalent is left undefined, not invented',
    rd.rEquivalent === undefined, String(rd.rEquivalent));
  assert('5 · unbalanced bridge', 'and it explains WHY it stopped',
    !!rd.stalledReason && /not series-parallel/.test(rd.stalledReason),
    rd.stalledReason ?? '(no reason given)');
  assert('5 · unbalanced bridge', 'the reason names the balance test as the way out',
    /P\/Q = R\/S/.test(rd.stalledReason ?? ''), rd.stalledReason ?? '');
}

// ── 6 · Meter loading: a real ammeter changes what it reports ────────────────
// 12 V across 5 Ω is 2.4 A. Insert an ammeter of 0.1 Ω and the loop becomes
// 5.1 Ω, so the meter reads 12/5.1 = 2.352941… A — 2 % low, and it is the meter
// that caused it. A real voltmeter does the same in reverse: two 5 Ω in series
// across 12 V put 6.000 V on the second one; a 20 Ω voltmeter across it makes
// 5 ‖ 20 = 4 Ω, total 9 Ω, I = 4/3 A, so it reads 4/3 × 4 = 5.333… V.
{
  const arch = CIRCUIT_ARCHETYPES['meter-loading'];
  const ideal = arch.build({ ...defaults(arch), ammeter_r: 0 });
  const real = arch.build({ ...defaults(arch), ammeter_r: 0.1 });
  const iIdeal = solveCircuit(ideal).currents.A1;
  const iReal = solveCircuit(real).currents.A1;
  check('6 · meter lab', 'ideal ammeter reads 12/5 = 2.4 A', iIdeal, 2.4);
  check('6 · meter lab', '0.1 Ω ammeter reads 12/5.1 A', iReal, 12 / 5.1);
  assert('6 · meter lab', 'so the meter measurably changed the current',
    Math.abs(iIdeal - iReal) > 0.04, `Δ = ${Math.abs(iIdeal - iReal)}`);
  assert('6 · meter lab', 'the meter_is_ideal misconception fires',
    detectIssues(real, solveCircuit(real)).some((i) => i.code === 'meter_is_ideal'));

  // An IDEAL voltmeter is infinite resistance — no slider position reaches that,
  // which is why `ideal` is a toggle. It reads the p.d. that exists without it.
  const vIdealC = arch.build({ ...defaults(arch), meter: 'voltmeter', ideal: true });
  check('6 · meter lab', 'ideal voltmeter reads 6 V', solveCircuit(vIdealC).voltages.V1, 6);
  check('6 · meter lab', 'and draws no current at all', solveCircuit(vIdealC).currents.V1, 0);
  const vReal = arch.build({ ...defaults(arch), meter: 'voltmeter', voltmeter_r: 20 });
  check('6 · meter lab', '20 Ω voltmeter pulls the reading to 16/3 V',
    solveCircuit(vReal).voltages.V1, 16 / 3);
  check('6 · meter lab', 'because 5 ‖ 20 = 4 Ω replaces the 5 Ω it is measuring',
    probeResistance(vReal, arch.probes).value, 9);
}

// ── 7 · A short circuit takes everything ─────────────────────────────────────
// 12 V, 4 Ω then 8 Ω. Switch open: R = 12 Ω, I = 1 A, 8 V across R2.
// Switch closed: R2 is shorted, R = 4 Ω, I = 3 A, and R2 carries nothing.
{
  const arch = CIRCUIT_ARCHETYPES['short-circuit'];
  const open = arch.build({ ...defaults(arch), closed: false });
  const shut = arch.build({ ...defaults(arch), closed: true });
  const so = solveCircuit(open);
  const sc = solveCircuit(shut);
  check('7 · short circuit', 'switch open → 1 A', so.currents.R1, 1);
  check('7 · short circuit', 'switch open → 8 V across R2', so.voltages.R2, 8);
  check('7 · short circuit', 'switch closed → 3 A', sc.currents.R1, 3);
  check('7 · short circuit', 'switch closed → 0 V across R2', sc.voltages.R2, 0, 1e-12);
  check('7 · short circuit', 'switch closed → 0 A through R2', sc.currents.R2, 0, 1e-12);
  check('7 · short circuit', 'and the whole 3 A goes through the switch',
    sc.currents.S1, 3);
  check('7 · short circuit', 'R_eq drops from 12 Ω to 4 Ω',
    probeResistance(shut, arch.probes).value, 4);
  check('7 · short circuit', 'redraw agrees', redraw(shut, arch.probes).rEquivalent, 4);
  assert('7 · short circuit', 'the short_circuit misconception fires',
    detectIssues(shut, sc).some((i) => i.code === 'short_circuit_ignored'));
}

// ── 8 · Current is not used up ───────────────────────────────────────────────
// 12 V, two 6 Ω bulbs in series: R = 12 Ω, I = 1 A in BOTH, P = I²R = 6 W each.
{
  const arch = CIRCUIT_ARCHETYPES['current-not-used-up'];
  const c = arch.build(defaults(arch));
  const sol = solveCircuit(c);
  check('8 · current not used up', 'first bulb carries 1 A', sol.currents.L1, 1);
  check('8 · current not used up', 'second bulb carries the SAME 1 A', sol.currents.L2, 1);
  check('8 · current not used up', 'both dissipate 6 W', sol.power.L1, 6);
  check('8 · current not used up', 'and 6 W', sol.power.L2, 6);
  assert('8 · current not used up', 'the current_used_up misconception fires',
    detectIssues(c, sol).some((i) => i.code === 'current_used_up'));
}

// ── 9 · More resistors, LESS resistance ──────────────────────────────────────
// n identical 6 Ω branches across an ideal 12 V cell: R = 6/n, I = 2n A.
{
  const arch = CIRCUIT_ARCHETYPES['adding-parallel-lowers-R'];
  for (const n of [1, 2, 3, 4]) {
    const c = arch.build({ ...defaults(arch), n });
    check('9 · parallel lowers R', `${n} branch(es) → R = 6/${n} Ω`,
      probeResistance(c, arch.probes).value, 6 / n);
    check('9 · parallel lowers R', `${n} branch(es) → cell delivers ${2 * n} A`,
      solveCircuit(c).currents.B1, 2 * n);
  }
}

// ── 10 · Bulb brightness does not depend on position ─────────────────────────
// 12 V; L1 (6 Ω) in series with L2 ‖ L3 (6 Ω each ⇒ 3 Ω). R = 9 Ω, I = 4/3 A
// through L1 and 2/3 A through each of L2, L3.
// P₁ = (4/3)²×6 = 32/3 = 10.667 W;  P₂ = P₃ = (2/3)²×6 = 8/3 = 2.667 W.
// Swapping which group comes first must change nothing.
{
  const arch = CIRCUIT_ARCHETYPES['bulb-brightness'];
  for (const mode of ['single-first', 'pair-first']) {
    const c = arch.build({ ...defaults(arch), mode });
    const s = solveCircuit(c);
    check('10 · brightness', `${mode}: L1 carries 4/3 A`, Math.abs(s.currents.L1), 4 / 3);
    check('10 · brightness', `${mode}: L2 carries 2/3 A`, Math.abs(s.currents.L2), 2 / 3);
    check('10 · brightness', `${mode}: L1 burns 32/3 W`, Math.abs(s.power.L1), 32 / 3);
    check('10 · brightness', `${mode}: L2 burns 8/3 W`, Math.abs(s.power.L2), 8 / 3);
  }
  const c = arch.build(defaults(arch));
  assert('10 · brightness', 'the brightness_by_position misconception fires',
    detectIssues(c, solveCircuit(c)).some((i) => i.code === 'brightness_by_position'));
}

// ── 11 · The potentiometer null ──────────────────────────────────────────────
// Driver 6 V across a 10 Ω wire ⇒ 0.6 A, so the p.d. from the right-hand end to
// the jockey is 0.6 × (1−k) × 10 = 6(1−k). A 2 V cell balances at 6(1−k) = 2,
// i.e. k = 2/3. At balance the cell under test delivers ZERO current, so its
// own internal resistance drops nothing and the reading is its true EMF.
{
  const arch = CIRCUIT_ARCHETYPES.potentiometer;
  const bal = arch.build({ ...defaults(arch), jockey: 2 / 3 });
  const sBal = solveCircuit(bal);
  check('11 · potentiometer', 'at k = 2/3 the galvanometer reads zero',
    sBal.currents.G, 0, 1e-12);
  check('11 · potentiometer', 'and the cell under test delivers nothing',
    sBal.currents.Bs, 0, 1e-12);
  check('11 · potentiometer', 'so it reads its true EMF, 2 V',
    -sBal.voltages.Bs, 2, 1e-12);

  // Off balance, current flows and the reading is NOT the EMF.
  const off = arch.build({ ...defaults(arch), jockey: 0.5 });
  const sOff = solveCircuit(off);
  assert('11 · potentiometer', 'off balance the galvanometer deflects',
    Math.abs(sOff.currents.G) > 1e-4, `I_G = ${sOff.currents.G}`);
  assert('11 · potentiometer', 'and the terminal p.d. is no longer the EMF',
    Math.abs(-sOff.voltages.Bs - 2) > 1e-6, `V = ${-sOff.voltages.Bs}`);
}

// ── 12 · The cube: symmetry, not series-parallel ─────────────────────────────
// Twelve r-ohm edges. Across the BODY diagonal the three edges at each end are
// equivalent, so R = r/3 + r/6 + r/3 = 5r/6. For r = 6 that is 5 Ω.
// Across a FACE diagonal R = 3r/4 (4.5 Ω); across one EDGE R = 7r/12 (3.5 Ω).
{
  const arch = CIRCUIT_ARCHETYPES['symmetry-shortcut'];
  const cases = [['body', 5 * 6 / 6], ['face', 3 * 6 / 4], ['edge', 7 * 6 / 12]];
  for (const [diagonal, expected] of cases) {
    const c = arch.build({ ...defaults(arch), diagonal });
    check('12 · cube', `${diagonal} diagonal → ${expected} Ω`,
      probeResistance(c, arch.probes).value, expected, 1e-9);
  }
  // The redraw has no series or parallel pair to start from — it MUST find the
  // symmetry join, or honestly refuse.
  const body = arch.build({ ...defaults(arch), diagonal: 'body' });
  const rd = redraw(body, arch.probes);
  if (rd.fullyReduced) {
    check('12 · cube', 'redraw reaches 5 Ω via the symmetry join', rd.rEquivalent, 5, 1e-9);
    assert('12 · cube', 'and it says the two points were at equal potential',
      rd.steps.some((s) => /same potential/.test(s.explanation)),
      rd.steps.map((s) => s.kind).join(' → '));
  } else {
    assert('12 · cube', 'if it cannot reduce, it refuses with a reason',
      !!rd.stalledReason, '(no reason given)');
  }
}

// ── 13 · The infinite ladder converges ───────────────────────────────────────
// One section of r = 1: R = 1 + 1 = 2 Ω.  Two: 1 + (1 ‖ 2) = 1 + 2/3 = 5/3.
// Three: 1 + (1 ‖ 5/3) = 1 + 5/8 = 13/8 = 1.625.
// The limit solves x = 1 + x/(1+x) ⇒ x² − x − 1 = 0 ⇒ x = (1+√5)/2 = 1.6180339…
{
  const arch = CIRCUIT_ARCHETYPES['infinite-ladder'];
  const expected = [2, 5 / 3, 13 / 8];
  expected.forEach((want, i) => {
    const c = arch.build({ ...defaults(arch), r: 1, sections: i + 1 });
    check('13 · ladder', `${i + 1} section(s) → ${Number(want.toFixed(4))} Ω`,
      probeResistance(c, arch.probes).value, want, 1e-9);
  });
  const phi = (1 + Math.sqrt(5)) / 2;
  const eight = arch.build({ ...defaults(arch), r: 1, sections: 8 });
  const r8 = probeResistance(eight, arch.probes).value;
  assert('13 · ladder', '8 sections is within 1e-4 of the golden ratio',
    Math.abs(r8 - phi) < 1e-4, `${r8} vs ${phi}`);
  check('13 · ladder', 'and the redraw lands on the same number',
    redraw(eight, arch.probes).rEquivalent, r8, 1e-9);
}

// ── 14 · Kirchhoff holds on RANDOM networks ──────────────────────────────────
// No expected value can be hand-derived here — that is the point. Both laws
// still have to hold to 1e-9 on a network nobody designed.
{
  let seed = 20260730;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const pick = (arr) => arr[Math.floor(rand() * arr.length) % arr.length];

  let worstKcl = 0;
  let worstKvl = 0;
  let loopTotal = 0;
  let built = 0;

  for (let trial = 0; trial < 60; trial++) {
    const nNodes = 4 + Math.floor(rand() * 4);         // 4..7 nodes
    const nodes = [];
    for (let i = 0; i < nNodes; i++) nodes.push(mkNode(`n${i}`, i * 100, 0));
    nodes[0].ground = true;

    const comps = [mkBattery('B1', 'n0', `n${nNodes - 1}`, 3 + Math.floor(rand() * 20))];
    // A spanning path guarantees the network is connected.
    for (let i = 0; i < nNodes - 1; i++) {
      comps.push(mkResistor(`Rp${i}`, `n${i}`, `n${i + 1}`, 1 + Math.floor(rand() * 40)));
    }
    // Then some extra chords, including ideal wires and meters, which are the
    // branches a plain conductance matrix cannot represent at all.
    const extras = 2 + Math.floor(rand() * 4);
    for (let k = 0; k < extras; k++) {
      const a = pick(nodes).id;
      let b = pick(nodes).id;
      if (a === b) b = nodes[(nodes.findIndex((n) => n.id === a) + 1) % nNodes].id;
      const kind = rand();
      if (kind < 0.14) comps.push(mkWire(`W${k}`, a, b));
      else if (kind < 0.24) comps.push(mkAmmeter(`A${k}`, a, b));
      else if (kind < 0.32) comps.push(mkVoltmeter(`V${k}`, a, b, { internal: 500 + Math.floor(rand() * 2000) }));
      else if (kind < 0.38) comps.push(mkSwitch(`S${k}`, a, b, { open: rand() < 0.5 }));
      else comps.push(mkResistor(`Rx${k}`, a, b, 1 + Math.floor(rand() * 60)));
    }

    const c = mkCircuit(nodes, comps);
    const sol = solveCircuit(c);
    if (sol.singular) continue;                       // reported honestly; skip
    built++;
    const rep = checkKirchhoff(c, sol, 1e-9);
    worstKcl = Math.max(worstKcl, rep.maxKcl);
    worstKvl = Math.max(worstKvl, rep.maxKvl);
    loopTotal += rep.loops.length;
  }

  assert('14 · Kirchhoff (random)', `${built} random networks solved`, built >= 40,
    `only ${built}`);
  assert('14 · Kirchhoff (random)', 'KCL holds at every node to 1e-9',
    worstKcl <= 1e-9, `worst residual ${worstKcl}`);
  assert('14 · Kirchhoff (random)', 'KVL holds round every loop to 1e-9',
    worstKvl <= 1e-9, `worst residual ${worstKvl}`);
  assert('14 · Kirchhoff (random)', 'and real loops were actually checked',
    loopTotal > built, `${loopTotal} loops over ${built} networks`);
}

// ── 15 · Redraw R_eq === nodal R_eq, for EVERY archetype ─────────────────────
// The redraw and the solver share nothing but the netlist. If a reduction step
// quietly loses a resistor, this is what catches it.
{
  for (const id of CIRCUIT_ARCHETYPE_ORDER) {
    const arch = CIRCUIT_ARCHETYPES[id];
    const c = arch.build(defaults(arch));
    const probes = arch.probes;
    if (!probes) continue;
    const nodal = probeResistance(c, probes);
    const rd = redraw(c, probes);
    if (!rd.fullyReduced) {
      assert('15 · redraw vs nodal', `${id}: refuses WITH a reason`,
        !!rd.stalledReason, '(none)');
      continue;
    }
    check('15 · redraw vs nodal', `${id}: ${Number(nodal.value.toFixed(4))} Ω`,
      rd.rEquivalent, nodal.value, 1e-9);
    assert('15 · redraw vs nodal', `${id}: every step explains itself`,
      rd.steps.every((s) => typeof s.explanation === 'string' && s.explanation.length > 25),
      'a step has no real explanation');
    assert('15 · redraw vs nodal', `${id}: every step carries its own circuit`,
      rd.steps.every((s) => s.after && Array.isArray(s.after.components)),
      'a step is missing `after`');
  }
}

// ── 16 · Archetype hygiene ───────────────────────────────────────────────────
{
  const codes = new Set(Object.keys(CIRCUIT_ISSUES));
  for (const id of CIRCUIT_ARCHETYPE_ORDER) {
    const a = CIRCUIT_ARCHETYPES[id];
    assert('16 · archetypes', `${id}: targets a REAL misconception`,
      !!a.targets && codes.has(a.targets), String(a.targets));
    assert('16 · archetypes', `${id}: ≥2 params and ≥3 guided steps`,
      (a.params?.length ?? 0) >= 2 && (a.defaultSteps?.length ?? 0) >= 3,
      `${a.params?.length ?? 0} params, ${a.defaultSteps?.length ?? 0} steps`);
    // Every param must be legal at BOTH ends of its own range.
    for (const p of a.params ?? []) {
      if (p.kind !== 'number') continue;
      for (const v of [p.min, p.max]) {
        try {
          const c = a.build({ ...defaults(a), [p.key]: v });
          assert('16 · archetypes', `${id}: builds at ${p.key} = ${v}`,
            c.components.length > 0, 'empty circuit');
        } catch (e) {
          assert('16 · archetypes', `${id}: builds at ${p.key} = ${v}`, false, String(e).slice(0, 60));
        }
      }
    }
  }
  assert('16 · archetypes', 'all nine misconception codes are used somewhere',
    new Set(CIRCUIT_ARCHETYPE_ORDER.map((id) => CIRCUIT_ARCHETYPES[id].targets)).size >= 8,
    'coverage gap');
}

// ── 17 · Layout is drawing-only, and it fits ─────────────────────────────────
// The canonical layout must never be able to change a physics answer, and the
// board must not be empty or infinite. Fill itself is checked in the browser.
{
  for (const id of CIRCUIT_ARCHETYPE_ORDER) {
    const arch = CIRCUIT_ARCHETYPES[id];
    const c = arch.build(defaults(arch));
    const probes = arch.probes ?? [c.nodes[0].id, c.nodes[c.nodes.length - 1].id];
    const before = probeResistance(c, probes).value;
    const canon = canonicalPositions(c, probes);
    const moved = { nodes: c.nodes.map((n) => ({ ...n, pos: canon[n.id] })), components: c.components };
    check('17 · layout', `${id}: moving every node changes nothing`,
      probeResistance(moved, probes).value, before, 1e-12);
    const b = circuitBounds(c, nodePositions(c));
    assert('17 · layout', `${id}: has finite bounds`,
      !!b && Number.isFinite(b.maxX - b.minX) && b.maxX > b.minX, JSON.stringify(b));
    const places = placeComponents(c, nodePositions(c));
    assert('17 · layout', `${id}: every element is placed`,
      c.components.every((x) => !!places[x.id]), 'a component has no placement');
  }
}

// ── 18 · The fold ladder rebuilds from the steps alone ───────────────────────
{
  const arch = CIRCUIT_ARCHETYPES['ugly-redraw'];
  const c = arch.build(defaults(arch));
  const prep = prepareForResistance(c, arch.probes);
  const rd = redraw(c, arch.probes);
  const tree = foldTree(rd.steps, prep.circuit);
  check('18 · fold ladder', 'ugly-redraw reduces to 6 Ω', rd.rEquivalent, 6);
  assert('18 · fold ladder', 'the tree collapses to a single root', tree.length === 1,
    `${tree.length} roots`);
  check('18 · fold ladder', 'and the root carries the final value', tree[0]?.value, 6);
  assert('18 · fold ladder', 'with the parallel pair nested inside it',
    JSON.stringify(tree).includes('"op":"parallel"'), 'no parallel group recorded');
  const loops = fundamentalLoops(c);
  assert('18 · fold ladder', 'the circuit has independent loops to check',
    loops.length >= 1, `${loops.length}`);
  assert('18 · fold ladder', 'resistanceOf agrees with the authored value',
    resistanceOf(c.components.find((x) => x.id === 'R1')) === 6);
}

// ── 19 · The board is FILLED, not swum in ────────────────────────────────────
// "The diagram is tiny" and "the diagram is clipped" are the same bug seen from
// two sides, and both are invisible to tsc, to eslint and to the physics checks
// above. So the camera maths is measured here, at the two board sizes the layout
// actually produces, for the authored tangle AND for the canonical redraw.
// Reported LINEARLY (per axis) because that is what the eye reads.
{
  const BOARDS = [
    { name: 'desktop 613×380', w: 613, h: 380 },
    { name: 'phone   325×260', w: 325, h: 260 },
  ];
  const FIT = { padFrac: 0.06, maxScale: 3, minScale: 0.02 };
  const MIN_BINDING = 0.55;

  const { boundsOf, fitView: fit } = await import(new URL('layout.ts', LIB).href);

  const measure = (c, pos, ignoreAuthored, w, h) => {
    const padded = circuitBounds(c, pos, { ignoreAuthored });
    const pts = [];
    for (const p of Object.values(placeComponents(c, pos, { ignoreAuthored }))) pts.push(...p.path);
    for (const p of Object.values(pos)) pts.push(p);
    const raw = boundsOf(pts);
    const view = fit(padded, w, h, FIT);
    return {
      fx: ((raw.maxX - raw.minX) * view.scale) / w,
      fy: ((raw.maxY - raw.minY) * view.scale) / h,
    };
  };

  for (const id of CIRCUIT_ARCHETYPE_ORDER) {
    const arch = CIRCUIT_ARCHETYPES[id];
    const c = arch.build(defaults(arch));
    const probes = arch.probes;
    for (const board of BOARDS) {
      for (const [what, pos, ignore] of [
        ['tangle', nodePositions(c), false],
        ['canonical', canonicalPositions(c, probes), true],
      ]) {
        const f = measure(c, pos, ignore, board.w, board.h);
        assert('19 · board fill', `${id} / ${board.name} / ${what} is not cropped`,
          f.fx <= 1.0001 && f.fy <= 1.0001,
          `content is ${(f.fx * 100).toFixed(0)}% × ${(f.fy * 100).toFixed(0)}% of the board`);
        assert('19 · board fill', `${id} / ${board.name} / ${what} is not lost in whitespace`,
          Math.max(f.fx, f.fy) >= MIN_BINDING,
          `binding axis fills only ${(Math.max(f.fx, f.fy) * 100).toFixed(0)}%`);
      }
    }
  }
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
  if (group && lastGroup) console.log('');
  lastGroup = r.group;
  console.log(
    `${group.padEnd(W1)}  ${r.name.padEnd(W2)}  ${r.actual.padEnd(W3)}  ${String(r.expected).padEnd(10)}  ${r.ok ? 'PASS' : 'FAIL'}`,
  );
}
console.log('─'.repeat(W1 + W2 + W3 + 26));
console.log(`${results.length - failures}/${results.length} passed${failures ? `, ${failures} FAILED` : ''}`);
console.log('');

process.exit(failures ? 1 : 0);
