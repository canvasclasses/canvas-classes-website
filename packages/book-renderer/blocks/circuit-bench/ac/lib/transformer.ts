/*
 * circuit-bench/ac/lib/transformer.ts — turns, power, and the grid. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable.
 *
 * ── THE IDEAL TRANSFORMER, AND THE TRAP INSIDE IT ───────────────────────────
 * Both windings link the same flux, so each turn sees the same dΦ/dt:
 *
 *      V_s / V_p = N_s / N_p
 *
 * and an ideal one wastes nothing, so P_s = P_p, which forces
 *
 *      I_s / I_p = N_p / N_s
 *
 * The trap is real and common: a student who has learnt "step-up" concludes a
 * transformer creates power. It does the opposite of that — it trades voltage
 * for current at constant product. Step the voltage up ten times and the
 * current available falls to a tenth, exactly. `transformerState` therefore
 * always reports BOTH products so the sim can put them side by side, rather
 * than reporting the ratio and letting the student supply the wrong conclusion.
 *
 * ── WHY THE GRID RUNS AT 400 kV ─────────────────────────────────────────────
 * To deliver power P down a line of resistance R_line at transmission voltage V:
 *
 *      I = P / V           loss = I²R = P²R / V²
 *
 * The loss falls as the SQUARE of the transmission voltage, because it falls as
 * the square of the current. Ten times the voltage is a hundredth of the loss.
 * That single inverse-square is the entire reason the national grid exists in
 * the form it does, and it is one line of arithmetic — which is why this
 * archetype computes it from `I²R` rather than printing a percentage.
 *
 * `lineLoss` deliberately does NOT model the voltage drop's effect on the
 * delivered power (a real line delivers P − loss at the far end, so the sending
 * end must supply more). `transmissionState` reports both P_sent and
 * P_delivered so that distinction is visible instead of hidden in a fudge.
 *
 * ── UNITS ───────────────────────────────────────────────────────────────────
 * RMS volts and amps throughout, because that is what a transformer is rated in
 * and what a meter reads. Peak values never appear here; mixing the two is how
 * a "240 V" winding ends up quietly 339 V.
 */

export interface TransformerSpec {
  /** Primary turns. */ Np: number;
  /** Secondary turns. */ Ns: number;
  /** V, RMS, applied to the primary. */ Vp: number;
  /** Ω — the load across the secondary. */ load: number;
  /** 0…1. An ideal transformer is 1; a good iron-cored one is about 0.97. */
  efficiency: number;
}

export type TransformerKind = 'step-up' | 'step-down' | 'isolating';

export interface TransformerState {
  ratio: number;
  kind: TransformerKind;
  /** V, RMS. */ Vs: number;
  /** A, RMS — set by the load: I_s = V_s / R_load. */ Is: number;
  /** A, RMS — whatever the secondary demands, scaled by the turns and η. */ Ip: number;
  /** W — delivered to the load. */ Ps: number;
  /** W — drawn from the supply. */ Pp: number;
  /** W — Pp − Ps. Zero when η = 1. */ lost: number;
  efficiency: number;
}

/** N_s/N_p — the only number a transformer really has. */
export const turnsRatio = (t: TransformerSpec): number =>
  (t.Np > 0 ? t.Ns / t.Np : Number.NaN);

/**
 * The complete picture.
 *
 * ⚠ CAUSAL ORDER MATTERS AND IS EASY TO GET BACKWARDS. The secondary voltage is
 * fixed by the turns ratio; the secondary CURRENT is then fixed by the load, not
 * by the ratio. Only then is the primary current whatever is needed to supply
 * that power. Computing I_p from the ratio first and I_s from it second gives
 * the same numbers for a resistive load and teaches the wrong causality — and it
 * breaks the moment the load changes, because it would keep the primary current
 * constant while the lamp got brighter.
 *
 * Efficiency is charged to the PRIMARY: P_p = P_s/η, i.e. the supply has to send
 * more in than comes out. Applying it to the secondary instead would make a
 * lossy transformer look like it delivered less from the same input, which is
 * true, but it hides the fact that the loss is heat in the core and windings.
 */
export function transformerState(t: TransformerSpec): TransformerState {
  const ratio = turnsRatio(t);
  const Vs = t.Vp * ratio;
  const R = Math.max(t.load, 1e-9);
  const Is = Vs / R;
  const Ps = Vs * Is;
  const eta = Math.min(1, Math.max(1e-6, t.efficiency));
  const Pp = Ps / eta;
  const Ip = t.Vp > 0 ? Pp / t.Vp : 0;
  return {
    ratio,
    kind: ratio > 1 ? 'step-up' : ratio < 1 ? 'step-down' : 'isolating',
    Vs, Is, Ip, Ps, Pp,
    lost: Pp - Ps,
    efficiency: eta,
  };
}

/** I = P/V — the current a line must carry to deliver P at V. */
export const lineCurrent = (power: number, voltage: number): number =>
  (voltage > 0 ? power / voltage : Number.POSITIVE_INFINITY);

/** loss = I²R = P²R/V². Both forms, one function, so they cannot disagree. */
export function lineLoss(power: number, voltage: number, resistance: number): number {
  const I = lineCurrent(power, voltage);
  return Number.isFinite(I) ? I * I * resistance : Number.POSITIVE_INFINITY;
}

export interface TransmissionState {
  /** V, RMS — the transmission voltage. */ voltage: number;
  /** A — the line current. */ current: number;
  /** W — asked for at the far end. */ demand: number;
  /** W — I²R in the cables. */ loss: number;
  /** W — what the power station must send. */ sent: number;
  /** W — what arrives. */ delivered: number;
  /** 0…1. */ efficiency: number;
  /** V — the p.d. wasted along the cable, I·R. */ lineDrop: number;
}

/**
 * The grid calculation.
 *
 * `demand` is the power the far end needs, so the station sends demand + loss
 * and the far end receives exactly `demand` — which is why `delivered` equals
 * `demand` here and `sent` is the number that moves. A model that held the SENT
 * power fixed instead would show the delivered power falling, which is the same
 * physics told in a way that makes the efficiency harder to read.
 */
export function transmissionState(demand: number, voltage: number, resistance: number): TransmissionState {
  const current = lineCurrent(demand, voltage);
  const loss = Number.isFinite(current) ? current * current * resistance : Number.POSITIVE_INFINITY;
  const sent = demand + loss;
  return {
    voltage,
    current,
    demand,
    loss,
    sent,
    delivered: demand,
    efficiency: sent > 0 ? demand / sent : 0,
    lineDrop: Number.isFinite(current) ? current * resistance : Number.POSITIVE_INFINITY,
  };
}

/** How much the loss changes when the transmission voltage is scaled by `k`.
 *  Returns 1/k² — the inverse square, as a number a readout can print. */
export const lossScaling = (k: number): number => (k > 0 ? 1 / (k * k) : Number.POSITIVE_INFINITY);
