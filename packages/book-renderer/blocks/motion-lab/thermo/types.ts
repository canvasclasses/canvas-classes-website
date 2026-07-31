/*
 * motion-lab/thermo/types.ts — Phase-2 thermodynamics + fluids vocabulary.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE types + data. No React, no DOM. Sibling of `waves/types.ts`, which owns
 * the shared `MisconceptionSpec` / `PredictSpec` records and the reasoning
 * behind them (a closed frozen union upstream; unwired `targets` codes in
 * Phase 1). Read that header first.
 *
 * Fluids live here rather than in a third directory because the build owns two
 * directories and units 6–7 of the catalogue — properties of matter, thermal
 * physics and thermodynamics — are one continuous argument about energy in bulk
 * matter. The Fluid Bench's Bernoulli ledger and the PV workbench's first-law
 * ledger are literally the same UI: three terms that trade while their sum
 * holds still.
 */

import type { MotionArchetype } from '../types';
import type { MisconceptionSpec, PredictSpec } from '../waves/types';

export type { MisconceptionSpec, PredictSpec };

/**
 * The thermodynamics + fluids half of the Phase-2 misconception vocabulary.
 * See `waves/types.ts` for why these are not `MotionMisconception` values and
 * what the build report asks for. Every code here is wired to a card a student
 * sees; the verifier asserts it.
 */
export type ThermoMisconception =
  | 'work_is_p_times_delta_v_always'
  | 'adiabatic_means_constant_temperature'
  | 'internal_energy_is_path_dependent'
  | 'cycle_does_no_work_because_it_returns'
  | 'efficiency_can_reach_one'
  | 'better_fuel_means_better_efficiency'
  | 'fridge_creates_cold'
  | 'all_molecules_move_at_the_same_speed'
  | 'heavier_gas_moves_faster_at_same_temperature'
  | 'narrow_pipe_means_higher_pressure'
  | 'buoyancy_depends_on_object_mass'
  | 'terminal_velocity_means_no_forces';

/** Which bench renders an archetype. */
export type ThermoSimId =
  | 'pv-workbench'
  | 'heat-engine'
  | 'molecular-chamber'
  | 'fluid-bench'
  | 'buoyancy-lab';

export interface ThermoArchetype extends Omit<MotionArchetype, 'targets' | 'scenario'> {
  /** Narrowed to the engine's existing scenario id — see waves/types.ts. */
  scenario: 'graphs';
  sim: ThermoSimId;
  /** For the design-law scorer. Always equal to `attacks.code`. */
  targets: ThermoMisconception;
  attacks: MisconceptionSpec<ThermoMisconception>;
  predict?: PredictSpec;
  tip: string;
}

export type ThermoArchetypeMap = Record<string, ThermoArchetype>;

// ── Shared param builders ────────────────────────────────────────────────────

type Param = NonNullable<MotionArchetype['params']>[number];

const num = (
  key: string, label: string, d: number, min: number, max: number, step: number, unit?: string
): Param => ({ key, label, kind: 'number', default: d, min, max, step, unit });

const flag = (key: string, label: string, d = true): Param =>
  ({ key, label, kind: 'boolean', default: d });

const pick = (key: string, label: string, d: string, options: string[]): Param =>
  ({ key, label, kind: 'select', default: d, options });

export { num as pNum, flag as pFlag, pick as pPick };

// Gas.
export const pMoles = (d = 1): Param => num('moles', 'Amount of gas', d, 0.1, 4, 0.1, 'mol');
export const pFreedom = (d = '5 — diatomic (air)'): Param =>
  pick('freedom', 'Molecule type', d, ['3 — monatomic (He, Ar)', '5 — diatomic (air)', '6 — polyatomic (CO₂)']);
export const pStartV = (d = 0.02): Param => num('v1', 'Starting volume', d, 0.005, 0.08, 0.001, 'm³');
export const pEndV = (d = 0.05): Param => num('v2', 'Finishing volume', d, 0.005, 0.12, 0.001, 'm³');
/** Range reaches 2600 K because a petrol engine's peak combustion temperature
 *  is ~2500 K — the verifier's param-hygiene check caught `T_peak = 1600`
 *  sitting outside an 80–1200 slider, which would have rendered a handle
 *  pinned to the end and a number the student could not reach. */
export const pTemp = (key = 'T', label = 'Temperature', d = 300): Param =>
  num(key, label, d, 80, 2600, 5, 'K');
export const pRatio = (d = 8): Param => num('ratio', 'Compression ratio', d, 2, 16, 0.5, ':1');

// Kinetic theory.
export const pMolarMass = (d = 32): Param => num('molar_mass', 'Molar mass', d, 2, 200, 1, 'g/mol');
export const pMolecules = (d = 120): Param => num('molecules', 'Molecules drawn', d, 30, 260, 10, '');

// Fluids.
export const pInletRadius = (d = 0.06): Param => num('r1', 'Inlet radius', d, 0.02, 0.12, 0.005, 'm');
export const pThroatRadius = (d = 0.03): Param => num('r2', 'Throat radius', d, 0.01, 0.12, 0.005, 'm');
export const pOutletRadius = (d = 0.06): Param => num('r3', 'Outlet radius', d, 0.02, 0.12, 0.005, 'm');
export const pInletSpeed = (d = 1.2): Param => num('v1', 'Inlet speed', d, 0.1, 6, 0.05, 'm/s');
export const pInletPressure = (d = 150): Param => num('p1', 'Inlet gauge pressure', d, 20, 400, 5, 'kPa');
export const pThroatHeight = (d = 0): Param => num('h2', 'Throat height', d, -2, 4, 0.1, 'm');
export const pFluidDensity = (d = 1000): Param => num('rho', 'Fluid density', d, 100, 14000, 50, 'kg/m³');

// Buoyancy / terminal velocity.
/** From 2 g (the ball bearing in the terminal-velocity rung) to 20 kg. The
 *  floor was 20 g and the terminal-velocity archetype's own default of 4 g sat
 *  below it — caught by the verifier, not by tsc. */
export const pObjectMass = (d = 0.6): Param => num('object_mass', 'Object mass', d, 0.002, 20, 0.002, 'kg');
export const pObjectVolume = (d = 0.001): Param =>
  num('object_volume', 'Object volume', d, 0.0001, 0.01, 0.0001, 'm³');
export const pViscosity = (d = 1.0): Param => num('eta', 'Viscosity η', d, 0.001, 3, 0.001, 'Pa·s');
export const pBallRadius = (d = 0.01): Param => num('radius', 'Ball radius', d, 0.002, 0.05, 0.001, 'm');
