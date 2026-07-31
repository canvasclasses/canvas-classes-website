/*
 * motion-lab/thermo/lib/pv.ts — processes on the PV plane.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no dependencies. Checked by
 * `scripts/verify-motion-phase2.mjs`.
 *
 * ── THE ONE IDEA THIS FILE EXISTS FOR ───────────────────────────────────────
 * Work is PATH-DEPENDENT; internal energy is not. Two processes that start at
 * the same point of the PV plane and finish at the same point do different
 * amounts of work and exchange different amounts of heat, but the change in
 * internal energy is identical — because U depends only on where you ARE
 * (through T = PV/nR), never on how you got there.
 *
 * The module is built so that this cannot be faked:
 *
 *   • `workAlongPath` integrates ∫P dV over the ACTUAL sampled polyline the
 *     renderer shades. It does not look up a formula per process kind. Change
 *     the drawn path and the number changes with it.
 *   • `deltaU` is computed from the endpoint temperatures ALONE and never sees
 *     the path at all — the asymmetry is structural, not commentary.
 *   • For a closed cycle, the trapezoid sum of ∮P dV over the legs and the
 *     shoelace area of the same closed polygon are the same arithmetic, so
 *     "net work = the area you enclosed" is an identity here rather than a
 *     claim. The verifier checks it to 1e-6 anyway.
 *
 * Convention: SI. P in pascals, V in m³, T in kelvin, n in moles, W is work
 * done BY the gas (positive on expansion), Q = ΔU + W (first law).
 */

/**
 * J·mol⁻¹·K⁻¹.
 *
 * DERIVED, not typed as a literal. Both k_B and N_A have been EXACT by SI
 * definition since 2019, so R = k_B·N_A is exact too — and deriving it keeps
 * this module bit-identical to `kinetic.ts`, which computes R the same way.
 * `verify-motion-phase2.mjs` compares U = (3/2)nRT against N_A⟨½mv²⟩ across the
 * two modules and a truncated 8.314462618 here made that check fail by 7×10⁻⁸ J
 * — small, but it is exactly the kind of quiet divergence that turns into "the
 * two panels disagree in the last digit" on screen.
 */
export const R_GAS = 1.380649e-23 * 6.02214076e23;

export interface GasState {
  /** Pa */
  P: number;
  /** m³ */
  V: number;
  /** K */
  T: number;
}

/** Degrees of freedom → the two heat capacities and γ. Monatomic f = 3,
 *  diatomic f = 5 (rigid), polyatomic f = 6. */
export interface GasModel {
  /** mol */
  n: number;
  /** Degrees of freedom per molecule. */
  f: number;
}

export const cvOf = (gas: GasModel): number => (gas.f / 2) * R_GAS;
export const cpOf = (gas: GasModel): number => (gas.f / 2 + 1) * R_GAS;
/** γ = Cp/Cv = 1 + 2/f. 5/3 monatomic, 7/5 diatomic. */
export const gammaOf = (gas: GasModel): number => 1 + 2 / gas.f;

/** Complete a state from any two of P, V, n: T = PV/nR. */
export const stateFromPV = (P: number, V: number, n: number): GasState => ({
  P, V, T: (P * V) / (n * R_GAS),
});

export const pressureFromVT = (V: number, T: number, n: number): number => (n * R_GAS * T) / V;
export const volumeFromPT = (P: number, T: number, n: number): number => (n * R_GAS * T) / P;

// ── Processes ────────────────────────────────────────────────────────────────

export type ProcessKind = 'isothermal' | 'adiabatic' | 'isobaric' | 'isochoric';

export interface Leg {
  kind: ProcessKind;
  from: GasState;
  to: GasState;
  /** The sampled polyline the renderer shades under. */
  points: { V: number; P: number }[];
}

/**
 * Where a process ends, given its kind and a target volume (or pressure, for
 * an isochoric leg, where the volume cannot change).
 *
 * Each branch is one line of algebra and it is the algebra the student is
 * being taught, so it is written out rather than routed through a generic
 * polytropic exponent — `PVⁿ = const` with n ∈ {1, γ, 0, ∞} is elegant and
 * teaches nobody anything the first time.
 */
export function endState(kind: ProcessKind, from: GasState, gas: GasModel, target: number): GasState {
  const g = gammaOf(gas);
  switch (kind) {
    case 'isothermal': {
      // T fixed → PV = const.
      const V = Math.max(target, 1e-12);
      return { P: (from.P * from.V) / V, V, T: from.T };
    }
    case 'adiabatic': {
      // Q = 0 → PVᵞ = const, and TVᵞ⁻¹ = const follows from PV = nRT.
      const V = Math.max(target, 1e-12);
      const P = from.P * Math.pow(from.V / V, g);
      return { P, V, T: (P * V) / (gas.n * R_GAS) };
    }
    case 'isobaric': {
      // P fixed → V/T = const.
      const V = Math.max(target, 1e-12);
      return { P: from.P, V, T: (from.P * V) / (gas.n * R_GAS) };
    }
    case 'isochoric': {
      // V fixed → P/T = const. Here `target` is the new PRESSURE.
      const P = Math.max(target, 1e-12);
      return { P, V: from.V, T: (P * from.V) / (gas.n * R_GAS) };
    }
  }
}

/** P at volume V along a process — the curve the renderer actually draws. */
export function pressureAlong(kind: ProcessKind, from: GasState, gas: GasModel, V: number): number {
  switch (kind) {
    case 'isothermal': return (from.P * from.V) / Math.max(V, 1e-12);
    case 'adiabatic': return from.P * Math.pow(from.V / Math.max(V, 1e-12), gammaOf(gas));
    case 'isobaric': return from.P;
    case 'isochoric': return from.P; // degenerate in V; sampled in P instead
  }
}

/**
 * Build a leg: its endpoint and the polyline between.
 *
 * `samples` controls how finely ∫P dV is approximated. It is generous by
 * default because the number under a hyperbola is what the student compares
 * against nRT ln(V₂/V₁), and a visibly-wrong third decimal would undermine the
 * whole "the area IS the work" claim. See the verifier for the measured error.
 */
export function buildLeg(
  kind: ProcessKind, from: GasState, gas: GasModel, target: number, samples = 1200
): Leg {
  const to = endState(kind, from, gas, target);
  const points: { V: number; P: number }[] = [];
  if (kind === 'isochoric') {
    // A vertical line on the PV plane: V never changes, so it sweeps no area
    // and does no work however far P moves. Two points are enough and the
    // trapezoid sum over them is exactly zero, which is the correct answer.
    points.push({ V: from.V, P: from.P }, { V: to.V, P: to.P });
  } else {
    for (let i = 0; i <= samples; i++) {
      const V = from.V + ((to.V - from.V) * i) / samples;
      points.push({ V, P: pressureAlong(kind, from, gas, V) });
    }
  }
  return { kind, from, to, points };
}

// ── Work — the shaded area, computed from the drawn path ─────────────────────

/**
 * W = ∫P dV by the trapezoid rule over the polyline.
 *
 * This is deliberately the same arithmetic the shading uses, so the number in
 * the ledger and the region on screen cannot disagree. Expansion (V rising)
 * gives positive work done BY the gas; compression gives negative.
 */
export function workAlongPath(points: { V: number; P: number }[]): number {
  let w = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    w += 0.5 * (a.P + b.P) * (b.V - a.V);
  }
  return w;
}

/** The closed-form work for each process — what the algebra says, quoted beside
 *  the measured area so the two can be compared rather than conflated. */
export function workClosedForm(leg: Leg, gas: GasModel): number {
  const { kind, from, to } = leg;
  switch (kind) {
    case 'isothermal':
      // W = nRT ln(V₂/V₁).
      return gas.n * R_GAS * from.T * Math.log(to.V / from.V);
    case 'adiabatic':
      // W = (P₁V₁ − P₂V₂)/(γ − 1) = nCv(T₁ − T₂): with Q = 0 the work comes
      // entirely out of internal energy, which is the whole content of the
      // "adiabatic expansion cools the gas" result.
      return (from.P * from.V - to.P * to.V) / (gammaOf(gas) - 1);
    case 'isobaric':
      return from.P * (to.V - from.V);
    case 'isochoric':
      return 0;
  }
}

// ── The first law ────────────────────────────────────────────────────────────

/**
 * ΔU = nCvΔT.
 *
 * NOTE WHAT IS NOT AN ARGUMENT HERE: the path. Two legs with the same endpoints
 * return the same ΔU no matter how differently they were drawn, and no code in
 * this module can make it otherwise. That structural fact is the lesson.
 */
export const deltaU = (gas: GasModel, from: GasState, to: GasState): number =>
  gas.n * cvOf(gas) * (to.T - from.T);

/** Q = ΔU + W. Positive Q is heat absorbed BY the gas. */
export const heatIn = (dU: number, W: number): number => dU + W;

export interface LegLedger {
  W: number;
  dU: number;
  Q: number;
  /** Work from the closed form, for the side-by-side check. */
  Wexact: number;
}

export function legLedger(leg: Leg, gas: GasModel): LegLedger {
  const W = workAlongPath(leg.points);
  const dU = deltaU(gas, leg.from, leg.to);
  return { W, dU, Q: heatIn(dU, W), Wexact: workClosedForm(leg, gas) };
}

// ── Cycles ───────────────────────────────────────────────────────────────────

export interface CycleLedger {
  /** Σ W over the legs — the net work done by the gas per cycle, J. */
  netWork: number;
  /** |shoelace| of the closed polygon, J. Equal to |netWork| by construction. */
  enclosedArea: number;
  /** Σ ΔU — must be exactly zero round a closed loop. */
  netDeltaU: number;
  /** Heat taken in on the legs where Q > 0, J. */
  heatAbsorbed: number;
  /** Heat dumped on the legs where Q < 0, J (reported positive). */
  heatRejected: number;
  /** W_net / Q_in for an engine. NaN when no heat is absorbed. */
  efficiency: number;
  /** True if the loop runs clockwise on the PV plane, i.e. it is an ENGINE.
   *  Anticlockwise is a refrigerator / heat pump. */
  clockwise: boolean;
  perLeg: LegLedger[];
}

/**
 * The whole ledger for a closed sequence of legs.
 *
 * `netDeltaU` is summed rather than assumed. A cycle whose legs do not actually
 * close would show it there instead of silently reporting a plausible
 * efficiency — which is exactly the failure mode the QA report calls "a wrong
 * number delivered confidently".
 */
export function cycleLedger(legs: Leg[], gas: GasModel): CycleLedger {
  const perLeg = legs.map((l) => legLedger(l, gas));
  const netWork = perLeg.reduce((s, l) => s + l.W, 0);
  const netDeltaU = perLeg.reduce((s, l) => s + l.dU, 0);
  let heatAbsorbed = 0;
  let heatRejected = 0;
  for (const l of perLeg) {
    if (l.Q > 0) heatAbsorbed += l.Q;
    else heatRejected -= l.Q;
  }
  const poly = closedPolygon(legs);
  return {
    netWork,
    enclosedArea: Math.abs(shoelace(poly)),
    netDeltaU,
    heatAbsorbed,
    heatRejected,
    efficiency: heatAbsorbed > 1e-12 ? netWork / heatAbsorbed : NaN,
    clockwise: netWork > 0,
    perLeg,
  };
}

/** Every point of every leg, in order, as one closed loop. */
export function closedPolygon(legs: Leg[]): { V: number; P: number }[] {
  const out: { V: number; P: number }[] = [];
  for (const leg of legs) {
    for (let i = leg === legs[0] ? 0 : 1; i < leg.points.length; i++) out.push(leg.points[i]);
  }
  return out;
}

/**
 * Signed area of a closed polygon, ½Σ(V_i·P_{i+1} − V_{i+1}·P_i).
 *
 * Positive here means anticlockwise in (V, P). The trapezoid sum ∮P dV over the
 * same vertices is the NEGATIVE of this, term for term — which is why
 * `enclosedArea` and `|netWork|` agree to floating-point noise rather than to
 * a tolerance someone chose.
 */
export function shoelace(points: { V: number; P: number }[]): number {
  let a = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    a += p.V * q.P - q.V * p.P;
  }
  return a / 2;
}

// ── Named cycles ─────────────────────────────────────────────────────────────

/** 1 − T_c/T_h. The ceiling nothing can beat, and the reason it is a ceiling is
 *  that it is what a cycle with NO wasted temperature difference achieves. */
export const carnotEfficiency = (Tc: number, Th: number): number => 1 - Tc / Math.max(Th, 1e-9);

/**
 * A Carnot cycle: isothermal expansion at T_h, adiabatic expansion to T_c,
 * isothermal compression at T_c, adiabatic compression back.
 *
 * The fourth leg is not free to be chosen — the volume it must start from is
 * fixed by the requirement that the loop CLOSES, i.e. V₄ = V₁(V₃/V₂). Deriving
 * it rather than accepting a slider is what makes the returned cycle genuinely
 * closed, and `cycleLedger().netDeltaU` proves it.
 */
export function carnotCycle(gas: GasModel, V1: number, V2: number, Th: number, Tc: number, samples = 1200): Leg[] {
  const g = gammaOf(gas);
  const s1: GasState = { V: V1, T: Th, P: pressureFromVT(V1, Th, gas.n) };
  const legA = buildLeg('isothermal', s1, gas, V2, samples);
  // Adiabatic to T_c: TVᵞ⁻¹ = const → V₃ = V₂ (T_h/T_c)^{1/(γ−1)}.
  const V3 = V2 * Math.pow(Th / Tc, 1 / (g - 1));
  const legB = buildLeg('adiabatic', legA.to, gas, V3, samples);
  // Closing condition: V₄/V₁ = V₃/V₂.
  const V4 = (V1 * V3) / V2;
  const legC = buildLeg('isothermal', legB.to, gas, V4, samples);
  const legD = buildLeg('adiabatic', legC.to, gas, V1, samples);
  return [legA, legB, legC, legD];
}

/**
 * An Otto cycle (the petrol engine): adiabatic compression, isochoric heating,
 * adiabatic expansion, isochoric cooling.
 *
 * η = 1 − r^{1−γ} with r the compression ratio — and notice the fuel does not
 * appear. Compression ratio alone sets the ceiling, which is why engines are
 * described by it.
 */
export function ottoCycle(
  gas: GasModel, V1: number, ratio: number, T1: number, Tpeak: number, samples = 1200
): Leg[] {
  const V2 = V1 / Math.max(ratio, 1.01);
  const s1: GasState = { V: V1, T: T1, P: pressureFromVT(V1, T1, gas.n) };
  const legA = buildLeg('adiabatic', s1, gas, V2, samples);           // compress
  const P3 = pressureFromVT(V2, Math.max(Tpeak, legA.to.T * 1.01), gas.n);
  const legB = buildLeg('isochoric', legA.to, gas, P3, samples);      // burn
  const legC = buildLeg('adiabatic', legB.to, gas, V1, samples);      // power stroke
  const legD = buildLeg('isochoric', legC.to, gas, s1.P, samples);    // exhaust
  return [legA, legB, legC, legD];
}

/** η_Otto = 1 − r^{1−γ}. */
export const ottoEfficiency = (ratio: number, gamma: number): number =>
  1 - Math.pow(ratio, 1 - gamma);

/**
 * Coefficient of performance of a refrigerator: what you MOVE divided by what
 * you PAY. Q_c/|W_net|, and for a reversed Carnot it is T_c/(T_h − T_c) — a
 * number bigger than 1, which is why "efficiency" is the wrong word for a
 * fridge and the reason a heat pump is not a perpetual motion machine.
 */
export const carnotCOP = (Tc: number, Th: number): number => Tc / Math.max(Th - Tc, 1e-9);

/** Run any cycle backwards — the same legs, reversed. Anticlockwise on the PV
 *  plane: net work goes IN, heat is pumped from cold to hot. */
export function reverseCycle(legs: Leg[]): Leg[] {
  return [...legs].reverse().map((l) => ({
    kind: l.kind,
    from: l.to,
    to: l.from,
    points: [...l.points].reverse(),
  }));
}
