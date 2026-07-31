'use client';

/**
 * Dimension Lab — how a dimensional formula is BUILT, how it CHANGES across
 * quantities, and how it is USED to test an equation.
 *
 * Academic sources (nothing here is generated from memory — Rule 0):
 *   • NCERT Class 11 Physics, Ch.1 "Units and Measurement" (rationalised
 *     2026-27 reprint), §1.4 Dimensions of Physical Quantities, §1.5
 *     Dimensional Formulae and Dimensional Equations, §1.6 Dimensional
 *     Analysis and its Applications (principle of homogeneity; the statement
 *     that a dimensionally correct equation need NOT be a correct equation).
 *   • "Units, Dimensions and Error Analysis", Objective Physics Vol.1 ch.1 —
 *     Table 1.8 and the 37-row dimensional-formula table (the electrical and
 *     thermal rows: resistance [ML²T⁻³A⁻²], capacitance [M⁻¹L⁻²T⁴A²],
 *     permittivity [M⁻¹L⁻³T⁴A²], magnetic field [MT⁻²A⁻¹], inductance
 *     [ML²T⁻²A⁻²], electric potential [ML²T⁻³A⁻¹], charge [AT]).
 *
 * ── The problem this solves ────────────────────────────────────────────────
 * Students memorise "[ML²T⁻²]" as a string. They cannot derive it, so under
 * exam pressure they misremember a sign, and they never see why torque and
 * work land on the same triple. Three modes, one failure each:
 *
 *   BUILD  — the formula is ASSEMBLED by the student's own taps on the factors
 *            of the defining equation. The exponent arithmetic happens in
 *            front of them; nothing is pre-filled.
 *   MATCH  — set the exponents from memory. A wrong answer says WHICH exponent
 *            is off and in which direction. A right answer names every other
 *            quantity sharing that address — the same-dimensions families are
 *            learned by collision, not by reading a table.
 *   CHECK  — the principle of homogeneity, performed. Tap each term of an
 *            equation, see its dimensions on a shared baseline, and let the
 *            odd term expose itself by comparison.
 *
 * ── Design constraints (founder brief, 2026-07-29) ─────────────────────────
 * No boxes — structure comes from whitespace and hairline rules only.
 * Exactly THREE type sizes in this component: text-2xl (display readouts),
 * text-sm (prose + controls), text-[10px] (uppercase micro-labels, via
 * TYPE.sectionLabel). Two accents only (violet = the quantity/equation axis,
 * sky = the dimension ledger it feeds), both light-tier. Body text never drops
 * below TEXT.secondary — the muted tier is for micro-labels only.
 *
 * Loaded with { ssr: false } via SimulationBlockRenderer.
 */

import { useState, useMemo, useCallback } from 'react';
import {
  SimShell, SimHeader, SimTabs, SectionLabel,
  TEXT, ACCENTS, OK, BAD, BORDER, TYPE, accentTint, mulberry32,
} from './_shared';

// ── Accents: violet = quantity / equation, sky = the dimension ledger ────────
const A_Q = ACCENTS.violet;
const A_D = ACCENTS.sky;

// ── Dimension algebra ────────────────────────────────────────────────────────
// A dimension is the exponent 4-tuple [M, L, T, A]. Thermodynamic temperature,
// amount of substance and luminous intensity are out of scope here (NCERT lists
// all seven; Class 11 mechanics + electricity only ever needs these four).
type Dim = [number, number, number, number];
const BASES = ['M', 'L', 'T', 'A'] as const;

/** Which base dimensions are in play. Mechanics never needs the ampere, and a
 * permanently-visible A column is just noise for a Class 11 student who has not
 * reached electricity yet. */
type Scope = 'core' | 'all';

const ZERO: Dim = [0, 0, 0, 0];
const addDim = (a: Dim, b: Dim): Dim => [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
const sameDim = (a: Dim, b: Dim) => a.every((v, i) => v === b[i]);

const SUP: Record<string, string> = {
  '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
};
const sup = (n: number) => String(n).split('').map((c) => SUP[c] ?? c).join('');

/**
 * NCERT's own convention: a dimensionless quantity is written [M⁰L⁰T⁰], not
 * left blank — the zeros are the point. So when every exponent is zero we show
 * them all; otherwise we hide the zeros and show only what is present.
 */
function formatDim(d: Dim, { showAllZeros = true } = {}): string {
  const allZero = d.every((v) => v === 0);
  if (allZero && showAllZeros) return '[M⁰L⁰T⁰]';
  const parts = BASES.map((b, i) => (d[i] === 0 ? '' : `${b}${sup(d[i])}`)).filter(Boolean);
  return `[${parts.join(' ')}]`;
}

// ── Quantity catalogue ───────────────────────────────────────────────────────
// Every entry carries its DEFINING EQUATION broken into tappable factors, so
// BUILD mode derives the formula instead of asserting it.
interface Factor {
  label: string;      // what the student taps
  dim: Dim;           // what it contributes
  because: string;    // the one line that justifies the contribution
}
interface Quantity {
  id: string;
  name: string;
  equation: string;   // display form of the definition
  factors: Factor[];
  si: string;
  group: 'core' | 'competitive';
  note?: string;      // the "so what" line, shown once the build completes
}

// Reusable factor definitions — keeps the contributions consistent everywhere.
const F = {
  mass: { label: 'mass', dim: [1, 0, 0, 0] as Dim, because: 'A mass is a base quantity — it contributes M¹ and nothing else.' },
  length: { label: 'length', dim: [0, 1, 0, 0] as Dim, because: 'A length is a base quantity — L¹.' },
  time: { label: 'time', dim: [0, 0, 1, 0] as Dim, because: 'A time is a base quantity — T¹.' },
  perTime: { label: 'per time', dim: [0, 0, -1, 0] as Dim, because: 'Dividing by a time flips the sign: T⁻¹.' },
  area: { label: 'area', dim: [0, 2, 0, 0] as Dim, because: 'Area = length × length, so L².' },
  perArea: { label: 'per area', dim: [0, -2, 0, 0] as Dim, because: 'Dividing by an area gives L⁻².' },
  volume: { label: 'volume', dim: [0, 3, 0, 0] as Dim, because: 'Volume = length × length × length, so L³.' },
  perVolume: { label: 'per volume', dim: [0, -3, 0, 0] as Dim, because: 'Dividing by a volume gives L⁻³.' },
  velocity: { label: 'velocity', dim: [0, 1, -1, 0] as Dim, because: 'Velocity = length / time, so L¹T⁻¹.' },
  accel: { label: 'acceleration', dim: [0, 1, -2, 0] as Dim, because: 'Acceleration = velocity / time = (L/T)/T, so L¹T⁻².' },
  force: { label: 'force', dim: [1, 1, -2, 0] as Dim, because: 'Force = mass × acceleration = M¹L¹T⁻².' },
  energy: { label: 'energy', dim: [1, 2, -2, 0] as Dim, because: 'Energy = force × distance = M¹L²T⁻².' },
  charge: { label: 'charge', dim: [0, 0, 1, 1] as Dim, because: 'Charge = current × time = A¹T¹.' },
  current: { label: 'current', dim: [0, 0, 0, 1] as Dim, because: 'Electric current is a base quantity — A¹.' },
  perCurrent: { label: 'per current', dim: [0, 0, 0, -1] as Dim, because: 'Dividing by a current gives A⁻¹.' },
  perCharge: { label: 'per charge', dim: [0, 0, -1, -1] as Dim, because: 'Dividing by a charge gives A⁻¹T⁻¹.' },
  potential: { label: 'potential difference', dim: [1, 2, -3, -1] as Dim, because: 'Potential = energy / charge = M¹L²T⁻³A⁻¹.' },
};

const QUANTITIES: Quantity[] = [
  {
    id: 'area', name: 'Area', equation: 'area = length × breadth', si: 'm²', group: 'core',
    factors: [F.length, { ...F.length, label: 'breadth', because: 'A breadth is also just a length — another L¹.' }],
    note: 'Two lengths multiply, so the L exponent adds: 1 + 1 = 2. Nothing else appears, so area is [M⁰L²T⁰].',
  },
  {
    id: 'density', name: 'Density', equation: 'density = mass / volume', si: 'kg m⁻³', group: 'core',
    factors: [F.mass, F.perVolume],
    note: 'Dividing flips the sign of every exponent it touches — that is the whole trick behind negative powers.',
  },
  {
    id: 'velocity', name: 'Velocity', equation: 'velocity = displacement / time', si: 'm s⁻¹', group: 'core',
    factors: [F.length, F.perTime],
    note: 'Speed, velocity, a change in velocity — all of them are a length over a time. Dimensions cannot tell them apart.',
  },
  {
    id: 'acceleration', name: 'Acceleration', equation: 'acceleration = velocity / time', si: 'm s⁻²', group: 'core',
    factors: [F.velocity, F.perTime],
    note: 'The T exponent went from −1 to −2 because you divided by a time a second time. Every "per second" costs one more T.',
  },
  {
    id: 'force', name: 'Force', equation: 'force = mass × acceleration', si: 'N', group: 'core',
    factors: [F.mass, F.accel],
    note: 'This is the parent of half the table. Work, torque, pressure and power are all force with one more length or time attached.',
  },
  {
    id: 'momentum', name: 'Momentum', equation: 'momentum = mass × velocity', si: 'kg m s⁻¹', group: 'core',
    factors: [F.mass, F.velocity],
    note: 'Impulse = force × time gives the same triple — which is exactly why impulse equals change in momentum.',
  },
  {
    id: 'impulse', name: 'Impulse', equation: 'impulse = force × time', si: 'N s', group: 'core',
    factors: [F.force, F.time],
    note: 'Same address as momentum. Two quantities with the same dimensions can be equated — and here they genuinely are.',
  },
  {
    id: 'work', name: 'Work / Energy', equation: 'work = force × displacement', si: 'J', group: 'core',
    factors: [F.force, F.length],
    note: 'Kinetic energy, potential energy, heat and work all sit here. Anything that can be added to an energy must.',
  },
  {
    id: 'torque', name: 'Torque', equation: 'torque = force × perpendicular distance', si: 'N m', group: 'core',
    factors: [F.force, { ...F.length, label: 'perpendicular distance', because: 'A perpendicular distance is a length — L¹.' }],
    note: 'Identical to work, yet torque is not energy. Same dimensions never means same physics — it only means they CAN be compared.',
  },
  {
    id: 'power', name: 'Power', equation: 'power = work / time', si: 'W', group: 'core',
    factors: [F.energy, F.perTime],
    note: 'One extra "per second" on energy. That is the only difference between a joule and a watt.',
  },
  {
    id: 'pressure', name: 'Pressure / Stress', equation: 'pressure = force / area', si: 'Pa', group: 'core',
    factors: [F.force, F.perArea],
    note: 'Pressure, stress, Young\'s modulus and energy density all land on [M L⁻¹ T⁻²]. That family is worth memorising as one.',
  },
  {
    id: 'frequency', name: 'Frequency', equation: 'frequency = 1 / time period', si: 'Hz', group: 'core',
    factors: [F.perTime],
    note: 'Angular velocity has the same triple, because an angle is dimensionless.',
  },
  {
    id: 'strain', name: 'Strain', equation: 'strain = change in length / original length', si: 'none', group: 'core',
    factors: [F.length, { label: 'per length', dim: [0, -1, 0, 0], because: 'Dividing by a length gives L⁻¹ — and it cancels the L¹ above it.' }],
    note: 'The exponents cancel to zero. Strain has no units AND no dimensions — one of the very few quantities with neither.',
  },
  {
    id: 'surface-tension', name: 'Surface tension', equation: 'surface tension = force / length', si: 'N m⁻¹', group: 'core',
    factors: [F.force, { label: 'per length', dim: [0, -1, 0, 0], because: 'Dividing by a length gives L⁻¹.' }],
    note: 'The L exponent cancels completely: 1 − 1 = 0. A spring constant lands on the same [M T⁻²].',
  },
  {
    id: 'moment-inertia', name: 'Moment of inertia', equation: 'moment of inertia = mass × (distance)²', si: 'kg m²', group: 'core',
    factors: [F.mass, F.area],
    note: 'No T at all. Moment of inertia is a purely geometric-and-mass property — nothing about it involves time.',
  },
  {
    id: 'ang-momentum', name: 'Angular momentum', equation: 'angular momentum = momentum × distance', si: 'kg m² s⁻¹', group: 'core',
    factors: [{ label: 'momentum', dim: [1, 1, -1, 0], because: 'Momentum = mass × velocity = M¹L¹T⁻¹.' }, F.length],
    note: 'Planck\'s constant has exactly these dimensions — which is why h is measured in joule-seconds and appears wherever angular momentum is quantised.',
  },
  {
    id: 'planck', name: "Planck's constant", equation: 'h = energy / frequency', si: 'J s', group: 'core',
    factors: [F.energy, F.time],
    note: 'Dividing by a frequency is multiplying by a time. Same address as angular momentum.',
  },
  {
    id: 'grav-constant', name: 'Gravitational constant G', equation: 'G = force × (distance)² / (mass × mass)', si: 'N m² kg⁻²', group: 'core',
    factors: [
      F.force, F.area,
      { label: 'per mass²', dim: [-2, 0, 0, 0], because: 'Dividing by two masses gives M⁻².' },
    ],
    note: 'The M exponent goes 1 − 2 = −1. G is a dimensional constant: it has a fixed value AND dimensions.',
  },
  {
    id: 'viscosity', name: 'Coefficient of viscosity', equation: 'η = force / (area × velocity gradient)', si: 'Pa s', group: 'competitive',
    factors: [
      F.force, F.perArea,
      { label: 'per velocity gradient', dim: [0, 1, 1, 0], because: 'A velocity gradient is velocity per length = T⁻¹, so dividing by it gives T¹… and the L cancels back in.' },
    ],
    note: 'Lands on [M L⁻¹ T⁻¹] — one T away from pressure. Students mix these two up constantly.',
  },
  {
    id: 'charge', name: 'Electric charge', equation: 'charge = current × time', si: 'C', group: 'competitive',
    factors: [F.current, F.time],
    note: 'The ampere is the base quantity, not the coulomb. Charge is the derived one.',
  },
  {
    id: 'potential', name: 'Electric potential', equation: 'potential = work / charge', si: 'V', group: 'competitive',
    factors: [F.energy, F.perCharge],
    note: 'EMF has the same dimensions — both are energy per unit charge.',
  },
  {
    id: 'resistance', name: 'Resistance', equation: 'resistance = potential difference / current', si: 'Ω', group: 'competitive',
    factors: [F.potential, F.perCurrent],
    note: 'Every extra ampere in the denominator costs another A⁻¹ — that is the only difference between a volt and an ohm.',
  },
  {
    id: 'capacitance', name: 'Capacitance', equation: 'capacitance = charge / potential difference', si: 'F', group: 'competitive',
    factors: [
      F.charge,
      { label: 'per potential difference', dim: [-1, -2, 3, 1], because: 'Dividing by potential flips every exponent of [M¹L²T⁻³A⁻¹].' },
    ],
    note: 'The T exponent climbs to +4 — one of the very few quantities with a positive time power that large.',
  },
  {
    id: 'magnetic-field', name: 'Magnetic field B', equation: 'B = force / (charge × velocity)', si: 'T', group: 'competitive',
    factors: [
      F.force,
      { label: 'per charge', dim: [0, 0, -1, -1], because: 'Dividing by a charge gives A⁻¹T⁻¹.' },
      { label: 'per velocity', dim: [0, -1, 1, 0], because: 'Dividing by a velocity gives L⁻¹T¹.' },
    ],
    note: 'Lands on [M T⁻² A⁻¹] — the L cancels out entirely, which surprises almost everyone.',
  },
];

// Quantities sharing a dimensional address — computed, never hand-listed, so it
// can never fall out of sync with the catalogue.
function siblingsOf(q: Quantity): string[] {
  const dim = q.factors.reduce((acc, f) => addDim(acc, f.dim), ZERO);
  return QUANTITIES.filter((o) => o.id !== q.id && sameDim(o.factors.reduce((a, f) => addDim(a, f.dim), ZERO), dim))
    .map((o) => o.name);
}
const dimOf = (q: Quantity): Dim => q.factors.reduce((acc, f) => addDim(acc, f.dim), ZERO);

// ── Homogeneity equations for CHECK mode ─────────────────────────────────────
interface Term { text: string; dim: Dim; because: string }
interface EquationCase {
  id: string;
  statement: string;
  terms: Term[];
  verdict: 'consistent' | 'inconsistent';
  /** Shown after the verdict — the honest caveat NCERT insists on. */
  moral: string;
}

const L: Dim = [0, 1, 0, 0];
const V: Dim = [0, 1, -1, 0];
const V2: Dim = [0, 2, -2, 0];
const E: Dim = [1, 2, -2, 0];
const FORCE: Dim = [1, 1, -2, 0];
const T1: Dim = [0, 0, 1, 0];

const EQUATIONS: EquationCase[] = [
  {
    id: 'suvat-v',
    statement: 'v = u + a t',
    terms: [
      { text: 'v', dim: V, because: 'A velocity: length / time.' },
      { text: 'u', dim: V, because: 'Also a velocity.' },
      { text: 'a t', dim: V, because: 'Acceleration × time = (L T⁻²)(T) = L T⁻¹.' },
    ],
    verdict: 'consistent',
    moral: 'Every term is a velocity, so the equation survives the test. Passing does not prove it right — it only proves it is not obviously wrong.',
  },
  {
    id: 'suvat-s',
    statement: 's = u t + ½ a t²',
    terms: [
      { text: 's', dim: L, because: 'A displacement: L¹.' },
      { text: 'u t', dim: L, because: '(L T⁻¹)(T) = L¹. The time cancels.' },
      { text: '½ a t²', dim: L, because: '(L T⁻²)(T²) = L¹. The ½ is a pure number and has no dimensions at all.' },
    ],
    verdict: 'consistent',
    moral: 'Notice the ½ contributed nothing. Dimensional analysis is blind to every pure number — which is exactly its most important limitation.',
  },
  {
    id: 'suvat-s-wrong-const',
    statement: 's = u t + a t²',
    terms: [
      { text: 's', dim: L, because: 'A displacement: L¹.' },
      { text: 'u t', dim: L, because: '(L T⁻¹)(T) = L¹.' },
      { text: 'a t²', dim: L, because: '(L T⁻²)(T²) = L¹.' },
    ],
    verdict: 'consistent',
    moral: 'This equation passes the test and is still WRONG — the ½ is missing. This is NCERT\'s own warning made concrete: a dimensionally correct equation need not be a correct equation.',
  },
  {
    id: 'centripetal-wrong',
    statement: 'F = m v² / r²',
    terms: [
      { text: 'F', dim: FORCE, because: 'A force: M L T⁻².' },
      { text: 'm v² / r²', dim: [1, 0, -2, 0], because: '(M)(L² T⁻²)(L⁻²) = M T⁻². The two lengths cancel one power too many.' },
    ],
    verdict: 'inconsistent',
    moral: 'One power of L short. The correct relation is F = mv²/r — and dimensions caught the slip without you knowing any circular motion.',
  },
  {
    id: 'ke-ph',
    statement: '½ m v² = m g h',
    terms: [
      { text: '½ m v²', dim: E, because: '(M)(L² T⁻²) = M L² T⁻².' },
      { text: 'm g h', dim: E, because: '(M)(L T⁻²)(L) = M L² T⁻².' },
    ],
    verdict: 'consistent',
    moral: 'Both sides are energies, so they are allowed to be equal. This is NCERT Example 1.3, worked exactly this way.',
  },
  {
    id: 'pendulum',
    statement: 'T = 2π √(l / g)',
    terms: [
      { text: 'T', dim: T1, because: 'A time period: T¹.' },
      { text: '2π √(l / g)', dim: T1, because: 'l/g = L / (L T⁻²) = T², and the square root of T² is T¹. The 2π is dimensionless.' },
    ],
    verdict: 'consistent',
    moral: 'Dimensions can hand you this formula but never the 2π. That constant has to come from real physics or an experiment.',
  },
  {
    id: 'energy-power-mix',
    statement: '½ m v² = m g h + F v',
    terms: [
      { text: '½ m v²', dim: E, because: 'An energy: M L² T⁻².' },
      { text: 'm g h', dim: E, because: 'Also an energy: M L² T⁻².' },
      { text: 'F v', dim: [1, 2, -3, 0], because: '(M L T⁻²)(L T⁻¹) = M L² T⁻³ — that is a power, not an energy.' },
    ],
    verdict: 'inconsistent',
    moral: 'Two energies and a power. You may only add quantities with identical dimensions, so this equation is dead on arrival.',
  },
  {
    id: 'sine-arg',
    statement: 'y = a sin(v t)',
    terms: [
      { text: 'y', dim: L, because: 'A displacement: L¹.' },
      { text: 'a', dim: L, because: 'The amplitude is also a displacement: L¹.' },
      { text: 'v t  (the angle)', dim: L, because: '(L T⁻¹)(T) = L¹ — but the argument of a sine MUST be dimensionless. L¹ is not.' },
    ],
    verdict: 'inconsistent',
    moral: 'The two sides match, yet the formula is still wrong: whatever sits inside a sin, log or exponential must have zero dimensions. Here it is a length.',
  },
];

// ── Distractors ──────────────────────────────────────────────────────────────
/**
 * Three plausible WRONG dimensional formulae for a target. Every one of these is
 * a mistake students actually make, not a random perturbation:
 *   • a flipped sign (forgetting that dividing flips the exponent)
 *   • a time exponent off by one (the pressure-vs-viscosity confusion)
 *   • L and T swapped (reading the defining equation upside down)
 * Deterministic, so the same question always offers the same four options.
 */
function distractorsFor(d: Dim): Dim[] {
  const out: Dim[] = [];
  const push = (x: Dim) => {
    if (!sameDim(x, d) && !out.some((c) => sameDim(c, x))) out.push(x);
  };
  const firstNZ = d.findIndex((v) => v !== 0);
  if (firstNZ >= 0) { const x = [...d] as Dim; x[firstNZ] = -x[firstNZ]; push(x); }
  { const x = [...d] as Dim; x[2] -= 1; push(x); }
  { const x = [...d] as Dim; const t = x[1]; x[1] = x[2]; x[2] = t; push(x); }
  { const x = [...d] as Dim; x[2] += 1; push(x); }
  { const x = [...d] as Dim; x[1] += 1; push(x); }
  { const x = [...d] as Dim; x[0] += 1; push(x); }
  return out.slice(0, 3);
}

/** Correct answer plus its distractors, in a stable position that varies by seed. */
function optionsFor(d: Dim, seed: number): { opts: Dim[]; answer: number } {
  const wrong = distractorsFor(d);
  const at = seed % 4;
  const opts = [...wrong];
  opts.splice(at, 0, d);
  return { opts, answer: at };
}

// ── Small presentational helpers (no boxes — dividers and spacing only) ──────

/** A borderless, underline-affordance text button. The only control chrome. */
function TextButton({ children, onClick, active, accent = A_Q, disabled, title }: {
  children: React.ReactNode; onClick?: () => void; active?: boolean;
  accent?: string; disabled?: boolean; title?: string;
}) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} title={title}
      className="text-sm font-semibold transition-all"
      style={{
        background: 'none', border: 'none', outline: 'none', padding: '4px 0',
        color: disabled ? TEXT.ghost : active ? accent : TEXT.secondary,
        borderBottom: `1.5px solid ${active ? accent : 'transparent'}`,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}

/** The M / L / T / A exponent ledger — the sim's second axis, in sky. */
function Ledger({ dim, highlight, scope }: { dim: Dim; highlight?: number | null; scope: Scope }) {
  const shown = scope === 'core' ? 3 : 4;
  return (
    <div className="flex gap-6">
      {BASES.slice(0, shown).map((b, i) => {
        const lit = highlight === i;
        return (
          <div key={b} className="flex flex-col items-center" style={{ minWidth: 44 }}>
            <div className={TYPE.sectionLabel} style={{ color: lit ? A_D : TEXT.ghost }}>{b}</div>
            <div
              className="text-2xl font-bold tabular-nums transition-all"
              style={{ color: dim[i] === 0 ? TEXT.muted : A_D, transform: lit ? 'scale(1.12)' : 'none' }}
            >
              {dim[i]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── BUILD ────────────────────────────────────────────────────────────────────
// The student does NOT get a free reveal. Tapping a factor asks what that factor
// contributes; the ledger and the running formula only move once the answer is
// right. Same visual, but the student produces every exponent.
function BuildMode({ scope }: { scope: Scope }) {
  const pool = useMemo(
    () => QUANTITIES.filter((x) => scope === 'all' || x.group === 'core'),
    [scope],
  );
  const [qid, setQid] = useState('force'); // open on Force — the parent quantity
  const [taken, setTaken] = useState(0);
  const [lastBase, setLastBase] = useState<number | null>(null);
  const [pick, setPick] = useState<number | null>(null);  // which option was chosen
  const [wrong, setWrong] = useState<number[]>([]);       // options already rejected

  const q = useMemo(
    () => pool.find((x) => x.id === qid) ?? pool[0],
    [pool, qid],
  );
  const running = useMemo(
    () => q.factors.slice(0, taken).reduce((acc, f) => addDim(acc, f.dim), ZERO),
    [q, taken],
  );
  const done = taken >= q.factors.length;
  const asking = !done && pick === null;
  const { opts, answer } = useMemo(
    () => optionsFor(q.factors[Math.min(taken, q.factors.length - 1)].dim, taken + q.id.length),
    [q, taken],
  );

  const reset = useCallback(() => { setTaken(0); setLastBase(null); setPick(null); setWrong([]); }, []);
  const choose = (i: number) => {
    if (done || pick !== null) return;
    if (i === answer) {
      const f = q.factors[taken];
      const changed = f.dim.findIndex((v) => v !== 0);
      setLastBase(changed === -1 ? null : changed);
      setPick(i);
    } else if (!wrong.includes(i)) {
      setWrong((w) => [...w, i]);
    }
  };
  const advance = () => { setTaken((t) => t + 1); setPick(null); setWrong([]); };

  return (
    <div>
      <SectionLabel>Choose a quantity</SectionLabel>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 mb-7">
        {pool.map((x) => (
          <TextButton key={x.id} onClick={() => { setQid(x.id); reset(); }} active={x.id === q.id}>
            {x.name}
          </TextButton>
        ))}
      </div>

      <SectionLabel accent={A_Q}>Defining equation</SectionLabel>
      <div className="text-2xl font-bold mt-1 mb-1" style={{ color: TEXT.primary }}>{q.equation}</div>
      <div className="text-sm mb-6" style={{ color: TEXT.secondary }}>SI unit: {q.si}</div>

      <div className="mb-7" style={{ borderTop: `1px solid ${BORDER.hairline}`, paddingTop: 18 }}>
        <SectionLabel>Substitute the factors, one at a time</SectionLabel>
        <div className="mt-3 mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {q.factors.map((f, i) => {
            const usedUp = i < taken;
            const current = i === taken;
            return (
              <span key={`${f.label}-${i}`} className="flex items-center gap-3">
                {i > 0 && <span className="text-sm" style={{ color: TEXT.ghost }}>×</span>}
                <span className="text-sm font-semibold" style={{
                  color: usedUp ? A_D : current ? A_Q : TEXT.muted,
                  borderBottom: current ? `1.5px solid ${A_Q}` : 'none',
                  paddingBottom: 2,
                }}>
                  {f.label}{usedUp ? ` → ${formatDim(f.dim, { showAllZeros: false })}` : ''}
                </span>
              </span>
            );
          })}
        </div>

        {!done && (
          <div>
            <div className="text-sm mb-3" style={{ color: TEXT.primary, maxWidth: '62ch' }}>
              What does <span style={{ color: A_Q }}>{q.factors[taken].label}</span> contribute?
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-3 mb-4">
              {opts.map((o, i) => {
                const isWrong = wrong.includes(i);
                const isRight = pick === i;
                return (
                  <button
                    key={i} type="button" onClick={() => choose(i)} disabled={pick !== null || isWrong}
                    className="text-2xl font-bold tabular-nums transition-all"
                    style={{
                      background: 'none', border: 'none', outline: 'none', padding: '2px 0',
                      color: isRight ? OK : isWrong ? BAD : A_D, // sim-lint-ok
                      opacity: isWrong ? 0.4 : 1,
                      textDecoration: isWrong ? 'line-through' : 'none',
                      borderBottom: pick === null && !isWrong ? `1.5px solid ${accentTint(A_D, 0.35)}` : '1.5px solid transparent',
                      cursor: pick !== null || isWrong ? 'default' : 'pointer',
                    }}
                  >
                    {formatDim(o, { showAllZeros: false }) || '[1]'}
                  </button>
                );
              })}
            </div>
            {wrong.length > 0 && pick === null && (
              <div className="text-sm mb-3" style={{ color: TEXT.secondary, maxWidth: '62ch' }}>
                Not that one. Look at the defining equation again — is this factor multiplying or dividing?
              </div>
            )}
            {pick !== null && (
              <div className="text-sm mb-4" style={{ color: TEXT.primary, maxWidth: '62ch' }}>
                {q.factors[taken].because}
                <span className="ml-3"><TextButton onClick={advance} active accent={A_Q}>
                  {taken + 1 >= q.factors.length ? 'Finish →' : 'Next factor →'}
                </TextButton></span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-x-12 gap-y-6"
        style={{ borderTop: `1px solid ${BORDER.hairline}`, paddingTop: 18 }}>
        <div>
          <SectionLabel accent={A_D}>Exponent ledger</SectionLabel>
          <div className="mt-2"><Ledger dim={running} highlight={lastBase} scope={scope} /></div>
        </div>
        <div>
          <SectionLabel accent={A_D}>Dimensional formula</SectionLabel>
          <div className="text-2xl font-bold mt-2 tabular-nums" style={{ color: taken === 0 ? TEXT.muted : A_D }}>
            {taken === 0 ? '[ ? ]' : formatDim(running)}
          </div>
        </div>
      </div>

      {done && (
        <div className="mt-7" style={{ borderTop: `1px solid ${BORDER.hairline}`, paddingTop: 18 }}>
          <SectionLabel accent={A_Q}>Why it matters</SectionLabel>
          <p className="text-sm mt-2" style={{ color: TEXT.primary, maxWidth: '68ch' }}>{q.note}</p>
          {siblingsOf(q).length > 0 && (
            <p className="text-sm mt-3" style={{ color: TEXT.secondary, maxWidth: '68ch' }}>
              Same dimensions as: <span style={{ color: A_D }}>{siblingsOf(q).join(', ')}</span>.
            </p>
          )}
          <div className="mt-4"><TextButton onClick={reset}>Build it again</TextButton></div>
        </div>
      )}
    </div>
  );
}

// ── MATCH ────────────────────────────────────────────────────────────────────
// Deterministic order (fixed seed) — no Math.random, so two students comparing
// notes see the same sequence. Anything answered wrong is pushed back into the
// queue, so the session ends only when every quantity has been got right once.
function MatchMode({ scope }: { scope: Scope }) {
  const pool = useMemo(
    () => QUANTITIES.filter((x) => scope === 'all' || x.group === 'core'),
    [scope],
  );
  const order = useMemo(() => {
    const rnd = mulberry32(20260729);
    const idx = pool.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  }, [pool]);

  const [queue, setQueue] = useState<number[]>(order);
  const [guess, setGuess] = useState<Dim>([0, 0, 0, 0]);
  const [checked, setChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [cleared, setCleared] = useState(0);

  // Re-seed the queue whenever the scope changes.
  const scopeKey = scope + ':' + order.length;
  const [lastKey, setLastKey] = useState(scopeKey);
  if (lastKey !== scopeKey) {
    setLastKey(scopeKey); setQueue(order); setGuess([0, 0, 0, 0]);
    setChecked(false); setStreak(0); setCleared(0);
  }

  const bases = scope === 'core' ? 3 : 4;
  const finished = queue.length === 0;
  const q = finished ? pool[0] : pool[queue[0]];
  const answer = dimOf(q);
  const right = sameDim(guess, answer);

  const bump = (i: number, by: number) => {
    if (checked) return;
    setGuess((g) => {
      const n = [...g] as Dim;
      n[i] = Math.max(-4, Math.min(4, n[i] + by));
      return n;
    });
  };

  const check = () => {
    setChecked(true);
    if (right) {
      setStreak((s) => { const v = s + 1; setBest((b) => Math.max(b, v)); return v; });
    } else setStreak(0);
  };
  const next = () => {
    setQueue((qq) => {
      const [head, ...rest] = qq;
      // got it wrong → send it to the back, so it comes round again
      return right ? rest : [...rest, head];
    });
    if (right) setCleared((c) => c + 1);
    setGuess([0, 0, 0, 0]);
    setChecked(false);
  };
  const restart = () => {
    setQueue(order); setGuess([0, 0, 0, 0]); setChecked(false); setStreak(0); setCleared(0);
  };

  const diagnosis = BASES.slice(0, bases)
    .map((b, i) => ({ b, d: guess[i] - answer[i] }))
    .filter((x) => x.d !== 0)
    .map((x) => `${x.b} is ${Math.abs(x.d)} too ${x.d > 0 ? 'high' : 'low'}`);

  if (finished) {
    return (
      <div>
        <div className="text-2xl font-bold mb-2" style={{ color: OK }}>{/* sim-lint-ok */}
          Every quantity cleared.
        </div>
        <p className="text-sm mb-5" style={{ color: TEXT.primary, maxWidth: '62ch' }}>
          You got all {pool.length} of them right — including any you had to come back to.
          Best run without a mistake: {best}.
        </p>
        <TextButton onClick={restart} active accent={A_Q}>Go again</TextButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-baseline flex-wrap gap-3 mb-6">
        <div>
          <SectionLabel>Set the dimensions of</SectionLabel>
          <div className="text-2xl font-bold mt-1" style={{ color: A_Q }}>{q.name}</div>
        </div>
        <div className={TYPE.sectionLabel} style={{ color: TEXT.ghost }}>
          {cleared} of {pool.length} cleared · streak {streak} · best {best}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-5 mb-7">
        {BASES.slice(0, bases).map((b, i) => (
          <div key={b} className="flex flex-col items-center" style={{ minWidth: 60 }}>
            <div className={TYPE.sectionLabel} style={{ color: TEXT.ghost }}>{b}</div>
            <div className="flex items-center gap-2 mt-1">
              <button type="button" onClick={() => bump(i, -1)} disabled={checked}
                aria-label={`decrease ${b}`}
                className="text-sm font-semibold rounded-full transition-all"
                style={{
                  width: 26, height: 26, background: 'rgba(255,255,255,0.05)', border: 'none',
                  color: checked ? TEXT.muted : TEXT.secondary, cursor: checked ? 'default' : 'pointer',
                }}>−</button>
              <div className="text-2xl font-bold tabular-nums" style={{
                minWidth: 28, textAlign: 'center',
                color: checked ? (guess[i] === answer[i] ? OK : BAD) : guess[i] === 0 ? TEXT.muted : A_D, // sim-lint-ok
              }}>{guess[i]}</div>
              <button type="button" onClick={() => bump(i, 1)} disabled={checked}
                aria-label={`increase ${b}`}
                className="text-sm font-semibold rounded-full transition-all"
                style={{
                  width: 26, height: 26, background: 'rgba(255,255,255,0.05)', border: 'none',
                  color: checked ? TEXT.muted : TEXT.secondary, cursor: checked ? 'default' : 'pointer',
                }}>+</button>
            </div>
          </div>
        ))}
        <div className="flex flex-col justify-end">
          <div className="text-2xl font-bold" style={{ color: TEXT.secondary }}>{formatDim(guess)}</div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER.hairline}`, paddingTop: 16 }}>
        {!checked ? (
          <TextButton onClick={check} active accent={A_D}>Check my answer</TextButton>
        ) : (
          <div>
            <div className="text-sm font-semibold" style={{ color: right ? OK : BAD }}>{/* sim-lint-ok */}
              {right ? 'Correct.' : `Not yet — ${diagnosis.join(', ')}.`}
            </div>
            {!right && (
              <div className="text-sm mt-2" style={{ color: TEXT.primary }}>
                {q.name} is defined by <span style={{ color: A_Q }}>{q.equation}</span>, which gives{' '}
                <span style={{ color: A_D }}>{formatDim(answer)}</span>. This one comes round again.
              </div>
            )}
            {right && siblingsOf(q).length > 0 && (
              <div className="text-sm mt-2" style={{ color: TEXT.primary }}>
                {formatDim(answer)} is also the address of{' '}
                <span style={{ color: A_D }}>{siblingsOf(q).join(', ')}</span>. Same dimensions, different physics.
              </div>
            )}
            {right && siblingsOf(q).length === 0 && (
              <div className="text-sm mt-2" style={{ color: TEXT.primary }}>
                Nothing else in this list shares {formatDim(answer)} — this address belongs to {q.name} alone.
              </div>
            )}
            <div className="mt-4"><TextButton onClick={next} active accent={A_Q}>
              {right ? 'Next quantity →' : 'Try another →'}
            </TextButton></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CHECK ────────────────────────────────────────────────────────────────────
// A term's dimensions are never handed over. Tapping a term asks the student to
// work them out first; only a correct pick puts the term on the baseline. The
// verdict appears once every term is down, so the odd one out is exposed by
// comparison rather than by being coloured in advance.
function CheckMode() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [asking, setAsking] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const eq = EQUATIONS[idx];
  const allOut = revealed.length === eq.terms.length;

  const go = (d: number) => {
    setIdx((i) => (i + d + EQUATIONS.length) % EQUATIONS.length);
    setRevealed([]); setAsking(null); setWrong([]);
  };

  const { opts, answer } = useMemo(
    () => optionsFor(eq.terms[asking ?? 0].dim, (asking ?? 0) + eq.id.length),
    [eq, asking],
  );

  const pick = (i: number) => {
    if (asking === null) return;
    if (i === answer) {
      setRevealed((r) => (r.includes(asking) ? r : [...r, asking]));
      setAsking(null); setWrong([]);
    } else if (!wrong.includes(i)) setWrong((w) => [...w, i]);
  };

  // The odd term is identified by comparison, never pre-marked.
  const oddIndex = useMemo(() => {
    const counts = new Map<string, number>();
    eq.terms.forEach((t) => {
      const k = formatDim(t.dim);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });
    if (counts.size < 2) return -1;
    let rarest = ''; let n = Infinity;
    counts.forEach((v, k) => { if (v < n) { n = v; rarest = k; } });
    return eq.terms.findIndex((t) => formatDim(t.dim) === rarest);
  }, [eq]);

  return (
    <div>
      <div className="flex justify-between items-baseline flex-wrap gap-3 mb-5">
        <div>
          <SectionLabel>Is this equation dimensionally consistent?</SectionLabel>
          <div className="text-2xl font-bold mt-1" style={{ color: TEXT.primary }}>{eq.statement}</div>
        </div>
        <div className="flex gap-5">
          <TextButton onClick={() => go(-1)}>← Previous</TextButton>
          <TextButton onClick={() => go(1)}>Next →</TextButton>
        </div>
      </div>

      <div className="text-sm mb-6" style={{ color: TEXT.secondary, maxWidth: '68ch' }}>
        Tap a term and work out its dimensions yourself. You may only add quantities whose dimensions
        match — so once every term is on the table, the odd one out has nowhere to hide.
      </div>

      <div style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
        {eq.terms.map((t, i) => {
          const on = revealed.includes(i);
          const active = asking === i;
          return (
            <div key={t.text} className="py-4" style={{ borderBottom: `1px solid ${BORDER.hairline}` }}>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <button
                  type="button"
                  onClick={() => { if (!on) { setAsking(i); setWrong([]); } }}
                  className="text-2xl font-bold transition-all"
                  style={{
                    background: 'none', border: 'none', outline: 'none', padding: 0,
                    color: on ? TEXT.primary : active ? A_D : A_Q,
                    cursor: on ? 'default' : 'pointer',
                    borderBottom: on ? 'none' : `1.5px solid ${accentTint(active ? A_D : A_Q, 0.5)}`,
                    minWidth: 150, textAlign: 'left',
                  }}
                >{t.text}</button>
                {on && (
                  <span className="text-2xl font-bold tabular-nums"
                    style={{ color: allOut && i === oddIndex && eq.verdict === 'inconsistent' ? BAD : A_D }}>{/* sim-lint-ok */}
                    {formatDim(t.dim)}
                  </span>
                )}
              </div>

              {active && (
                <div className="mt-3">
                  <div className="text-sm mb-2" style={{ color: TEXT.primary }}>
                    What are the dimensions of this term?
                  </div>
                  <div className="flex flex-wrap gap-x-7 gap-y-3">
                    {opts.map((o, k) => {
                      const isWrong = wrong.includes(k);
                      return (
                        <button
                          key={k} type="button" onClick={() => pick(k)} disabled={isWrong}
                          className="text-2xl font-bold tabular-nums transition-all"
                          style={{
                            background: 'none', border: 'none', outline: 'none', padding: '2px 0',
                            color: isWrong ? BAD : A_D, // sim-lint-ok
                            opacity: isWrong ? 0.4 : 1,
                            textDecoration: isWrong ? 'line-through' : 'none',
                            borderBottom: isWrong ? '1.5px solid transparent' : `1.5px solid ${accentTint(A_D, 0.35)}`,
                            cursor: isWrong ? 'default' : 'pointer',
                          }}
                        >{formatDim(o)}</button>
                      );
                    })}
                  </div>
                  {wrong.length > 0 && (
                    <div className="text-sm mt-3" style={{ color: TEXT.secondary, maxWidth: '68ch' }}>
                      Not that one. Take the term apart factor by factor before you pick again.
                    </div>
                  )}
                </div>
              )}

              {on && (
                <div className="text-sm mt-2" style={{ color: TEXT.secondary, maxWidth: '68ch' }}>{t.because}</div>
              )}
            </div>
          );
        })}
      </div>

      {allOut && (
        <div className="mt-6">
          <div className="text-sm font-semibold" style={{ color: eq.verdict === 'consistent' ? OK : BAD }}>{/* sim-lint-ok */}
            {eq.verdict === 'consistent'
              ? 'Every term has the same dimensions — the equation passes.'
              : 'The terms do not match — the equation is wrong.'}
          </div>
          <p className="text-sm mt-2" style={{ color: TEXT.primary, maxWidth: '68ch' }}>{eq.moral}</p>
        </div>
      )}
    </div>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'build', label: 'Build' },
  { key: 'match', label: 'Match' },
  { key: 'check', label: 'Check' },
];

export default function DimensionLabSim() {
  const [tab, setTab] = useState('build');
  const [scope, setScope] = useState<Scope>('core');

  return (
    <SimShell>
      <SimHeader
        title="Dimension" accentWord="Lab"
        subtitle="Assemble a dimensional formula, recall it, then use it"
        badge={tab === 'build' ? 'Derive it' : tab === 'match' ? 'Recall it' : 'Apply it'}
        accent={A_Q}
      />
      <SimTabs tabs={TABS} active={tab} onChange={setTab} accent={A_Q} />

      {tab !== 'check' && (
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-7">
          <SectionLabel>Scope</SectionLabel>
          <TextButton onClick={() => setScope('core')} active={scope === 'core'}>
            Mechanics — M, L, T
          </TextButton>
          <TextButton onClick={() => setScope('all')} active={scope === 'all'}>
            Everything — adds electric current A
          </TextButton>
        </div>
      )}

      {tab === 'build' && <BuildMode key={scope} scope={scope} />}
      {tab === 'match' && <MatchMode scope={scope} />}
      {tab === 'check' && <CheckMode />}

      <div className="mt-7 text-sm" style={{ borderTop: `1px solid ${BORDER.hairline}`, paddingTop: 14, color: TEXT.secondary }}>
        {scope === 'core' && tab !== 'check'
          ? 'Mechanics needs only mass, length and time. Switch to Everything once you reach electricity — it adds the ampere, and works in exactly the same way.'
          : 'This lab tracks four base dimensions — mass, length, time and electric current. Temperature, amount of substance and luminous intensity are the other three, and they work in exactly the same way.'}
      </div>
    </SimShell>
  );
}
