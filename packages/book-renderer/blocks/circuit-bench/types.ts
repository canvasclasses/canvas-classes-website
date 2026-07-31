/*
 * circuit-bench/types.ts — E3 ENGINE CONTRACT. Frozen surface.
 * ─────────────────────────────────────────────────────────────────────────────
 * A netlist + nodal analysis + the TOPOLOGICAL REDRAW.
 *
 * The redraw is the reason this engine exists. Students cannot solve resistance
 * networks because they cannot see the topology through the drawing — an
 * exam-style tangle and its clean series/parallel form look nothing alike. So
 * the engine must not merely COMPUTE R_eq, it must be able to explain the
 * regrouping as an animation: colour nodes by potential, collapse equal-potential
 * wires, and reorganise the tangle into its canonical form step by step.
 * See PHYSICS_SIMULATION_PROGRAM.md §7.
 *
 * Pure — no React, no DOM. SI units throughout.
 */

export interface Vec2 { x: number; y: number }

// ── Netlist ──────────────────────────────────────────────────────────────────

export type ComponentKind =
  | 'resistor' | 'battery' | 'wire' | 'capacitor' | 'inductor'
  | 'ammeter' | 'voltmeter' | 'switch' | 'bulb' | 'galvanometer';

/**
 * A two-terminal element between two nodes.
 *
 * `a` and `b` are node ids. Orientation matters for sources and meters: current
 * is reported POSITIVE when it flows a → b internally, which is the convention
 * every sign question in this chapter turns on.
 */
export interface CircuitComponent {
  id: string;
  kind: ComponentKind;
  a: string;
  b: string;
  /** Ω for resistor/bulb, V for battery (EMF), F for capacitor, H for inductor. */
  value: number;
  /** Ω. A real battery's internal resistance, a real meter's coil resistance —
   *  the whole point of the Meter Lab is that these are not zero/infinite. */
  internal?: number;
  label?: string;
  /** Open switches are removed from the solve rather than given a huge R,
   *  which would make the matrix ill-conditioned instead of simply smaller. */
  open?: boolean;
  /** Layout only — never affects the solve. The redraw animates between the
   *  authored position and the canonical one. */
  pos?: Vec2;
}

export interface CircuitNode {
  id: string;
  pos?: Vec2;
  label?: string;
  /** Exactly one node must be the reference (0 V). If none is marked the
   *  solver picks the battery's negative terminal and says so. */
  ground?: boolean;
}

export interface Circuit {
  nodes: CircuitNode[];
  components: CircuitComponent[];
}

// ── Solve ────────────────────────────────────────────────────────────────────

export interface CircuitSolution {
  /** node id → potential in volts, referenced to ground. */
  potentials: Record<string, number>;
  /** component id → current in amps, positive a → b. */
  currents: Record<string, number>;
  /** component id → potential difference V(a) − V(b). */
  voltages: Record<string, number>;
  /** component id → power dissipated (W). Negative = delivering power. */
  power: Record<string, number>;
  /** Equivalent resistance between the two probe nodes, when asked. */
  rEquivalent?: number;
  singular: boolean;
  warnings: string[];
}

// ── The redraw — design law #3 for circuits ──────────────────────────────────

/**
 * One step of the regrouping. Replaying these in order IS the explanation:
 * each step names what it merged and why, so the student watches the tangle
 * become the canonical form instead of being handed R_eq.
 */
export interface RedrawStep {
  kind: 'merge-series' | 'merge-parallel' | 'collapse-wire' | 'drop-zero-current' | 'done';
  /** Components combined at this step. */
  componentIds: string[];
  /** Nodes that became one node (a wire collapse, or a symmetry short). */
  nodeIds?: string[];
  /** The component this group was replaced by (synthetic id + value). */
  replacement?: { id: string; kind: ComponentKind; value: number; a: string; b: string };
  /** Plain English: "R2 and R3 share both ends — that is parallel, 6‖3 = 2 Ω." */
  explanation: string;
  /** LaTeX for the working panel. */
  latex?: string;
  /** The circuit AFTER this step, so the UI can render each frame directly. */
  after: Circuit;
}

export interface RedrawResult {
  steps: RedrawStep[];
  /** True when the network reduced to a single element between the probes.
   *  A balanced-Wheatstone or a genuinely non-series-parallel network will not,
   *  and must say so rather than pretending. */
  fullyReduced: boolean;
  rEquivalent?: number;
  /** Set when reduction stalled — e.g. "this bridge is not series-parallel;
   *  check whether it is balanced, or use Kirchhoff directly." */
  stalledReason?: string;
}

// ── Misconceptions ───────────────────────────────────────────────────────────

export type CircuitMisconception =
  | 'series_parallel_by_appearance'   // judged by drawing shape, not shared nodes
  | 'current_used_up'                 // "current is consumed by the first bulb"
  | 'battery_constant_current'        // treats a battery as a current source
  | 'voltage_across_wire'             // expects a p.d. across an ideal wire
  | 'meter_is_ideal'                  // forgets ammeter/voltmeter loading
  | 'more_resistors_more_resistance'  // fails for parallel additions
  | 'brightness_by_position'          // "the bulb nearer + is brighter"
  | 'short_circuit_ignored'
  | 'balanced_bridge_carries_current'
  // ── AC and transients (unit 11) ──────────────────────────────────────────
  // Added when the AC bench landed. Nothing above is DC-only by accident — those
  // nine were written for a chapter that had no frequency in it, and not one of
  // them can express a belief about reactance, phase or a transformer. Two of the
  // nine DC codes ARE honestly reused at 50 Hz and it is worth naming which:
  // `battery_constant_current` on the LR transient (the current is whatever the
  // circuit lets through, and at t = 0 the inductor lets through nothing) and
  // `voltage_across_wire` on the capacitor at high frequency (no impedance, no
  // p.d., however much current).
  | 'reactance_is_a_resistance'             // ohms that store instead of dissipating
  | 'impedances_add_arithmetically'         // Z = R + X_L + X_C
  | 'element_voltages_add_arithmetically'   // V_R + V_L + V_C = supply
  | 'reactive_element_dissipates_power'     // a pure L or C heats something
  | 'resonance_is_maximum_impedance'        // series resonance is a MINIMUM
  | 'rms_is_the_cycle_average'              // the average of a sine is zero
  | 'phasor_is_a_different_quantity'        // the phasor IS the wave, standing up
  | 'lc_current_stops_when_capacitor_empties'
  | 'transformer_creates_power'             // it trades volts for amps
  // ── Semiconductors (unit 13) ─────────────────────────────────────────────
  // Added when the Semiconductor Bench landed. Two of the nine DC codes ARE
  // honestly reused rather than duplicated, and it is worth naming which:
  // `current_used_up` on the half-wave rectifier (the diode current and the load
  // current are the same number at every instant, which is exactly what that code
  // says), and `series_parallel_by_appearance` on the bridge (the conducting pair
  // is decided by shared nodes and is DIAGONAL, not by which side of the diamond
  // a diode is drawn on). The seven below are the beliefs no existing code can
  // express, because none of them is about a resistor network.
  | 'doping_adds_both_carriers'                 // n·p = nᵢ² — doping TRADES them
  | 'depletion_region_is_empty_space'           // the atoms are all still there
  | 'forward_and_reverse_are_different_rules'   // one formula, with the sign of V in it
  | 'diode_has_a_resistance'                    // V/I is different at every point
  | 'breakdown_destroys_a_diode'                // it is the POWER that kills, not the volts
  | 'collector_current_is_always_beta_ib'       // saturation caps it, and β stops applying
  | 'amplifier_output_follows_the_input';       // common emitter INVERTS, and it clips

export interface CircuitIssue {
  code: CircuitMisconception;
  /**
   * The wrong belief in the STUDENT'S own words, quoted — "a conducting diode has
   * a resistance of about 0.7 V divided by the current".
   *
   * Optional because the original nine codes predate this field and their
   * `message` already opens by naming the belief. Where it IS present the card
   * leads with it, because a student who reads their own thought in quotation
   * marks engages with the correction instead of skimming a paragraph of correct
   * physics they think they already agree with.
   */
  belief?: string;
  message: string;
  hint?: string;
}

// ── Archetypes ───────────────────────────────────────────────────────────────

export interface CircuitArchetype {
  id: string;
  title: string;
  summary: string;
  params?: {
    key: string; label: string; kind: 'number' | 'boolean' | 'select';
    default: number | boolean | string;
    min?: number; max?: number; step?: number; options?: string[]; unit?: string;
  }[];
  build(params?: Record<string, number | string | boolean>): Circuit;
  /** Which two nodes R_eq is measured between, when the exercise asks. */
  probes?: [string, string];
  defaultSteps?: { say: string; cta: string }[];
  targets?: CircuitMisconception;
}
