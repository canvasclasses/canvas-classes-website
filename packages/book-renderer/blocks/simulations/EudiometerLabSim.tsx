'use client';

/**
 * Eudiometer Virtual Lab — v2 (instrument-panel redesign)
 *
 * Academic source: NCERT Class 11, Chapter 1 — Some Basic Concepts of Chemistry
 * (Stoichiometry / Volume–Volume Analysis / Eudiometry).
 *
 * Pedagogical goal: replicate the classical experimental procedure that
 * deduces an unknown hydrocarbon's molecular formula from gas-volume
 * measurements alone. The student picks a hydrocarbon and an O₂ amount,
 * fires a spark, watches H₂O condense, passes KOH through to absorb CO₂,
 * then derives x and y from the two volume contractions:
 *
 *   x = (V₁ − V₂) / V_gas
 *   y = 4·((V₀ − V₁) / V_gas − 1)
 *
 * Design: three-column instrument console — controls on the left, the
 * eudiometer tube + live stat tiles in the middle, lab notebook (balanced
 * equation + derivation) on the right. Action bar at the bottom drives
 * the four steps (Setup → Ignite → Absorb → Deduce).
 *
 * All CSS is scoped under `.eud-root` (prefixed `eud-*` class names and
 * `.eud-root`-scoped custom properties) so styles cannot leak into the
 * surrounding page.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

// ── Gas catalogue ─────────────────────────────────────────────────────────────
// x = carbons, y = hydrogens.  Combustion: CxHy + (x + y/4) O₂ → x CO₂ + (y/2) H₂O
const GASES = {
  methane:  { id: 'methane',  name: 'Methane',   formula: 'CH₄',  x: 1, y: 4,  desc: 'Natural gas — the simplest alkane.' },
  ethylene: { id: 'ethylene', name: 'Ethylene',  formula: 'C₂H₄', x: 2, y: 4,  desc: 'An alkene that ripens fruit.' },
  ethane:   { id: 'ethane',   name: 'Ethane',    formula: 'C₂H₆', x: 2, y: 6,  desc: 'Saturated, two-carbon alkane.' },
  propane:  { id: 'propane',  name: 'Propane',   formula: 'C₃H₈', x: 3, y: 8,  desc: 'LPG; common cooking fuel.' },
  mystA:    { id: 'mystA',    name: 'Mystery A', formula: 'CₓHᵧ', x: 2, y: 2,  desc: 'Hidden until you deduce its formula.', mystery: 'C₂H₂ (acetylene)' },
  mystB:    { id: 'mystB',    name: 'Mystery B', formula: 'CₓHᵧ', x: 4, y: 10, desc: 'Hidden until you deduce its formula.', mystery: 'C₄H₁₀ (butane)' },
} as const;
type GasKey = keyof typeof GASES;
type Gas = typeof GASES[GasKey] & { mystery?: string };

const STEPS = [
  { id: 0, name: 'Setup',  desc: 'Charge the tube' },
  { id: 1, name: 'Ignite', desc: 'Spark and condense' },
  { id: 2, name: 'Absorb', desc: 'Pass KOH solution' },
  { id: 3, name: 'Deduce', desc: 'Derive the formula' },
] as const;

// ── Scoped CSS ────────────────────────────────────────────────────────────────
const STYLES = `
.eud-root {
  --bg-0: #06080D;
  --bg-1: #0B0E16;
  --bg-2: #10141F;
  --bg-3: #161B28;
  --bg-4: #1D2333;

  --border: rgba(255, 255, 255, 0.06);
  --border-strong: rgba(255, 255, 255, 0.12);
  --border-accent: rgba(139, 126, 248, 0.35);

  --text-0: #F4F6FB;
  --text-1: #B7BEd0;
  --text-2: #6C7488;
  --text-3: #3E4558;

  --accent: #8B7EF8;
  --accent-soft: #B0A6FB;
  --accent-glow: rgba(139, 126, 248, 0.18);
  --accent-dim: rgba(139, 126, 248, 0.08);

  --gas: #4ADE92;
  --gas-soft: rgba(74, 222, 146, 0.22);
  --oxygen: #57B8F2;
  --oxygen-soft: rgba(87, 184, 242, 0.22);
  --co2: #F2B463;
  --co2-soft: rgba(242, 180, 99, 0.22);
  --water: rgba(82, 132, 188, 0.28);
  --water-line: rgba(140, 180, 220, 0.5);
  --spark: #FF7A6B;

  --radius-s: 6px;
  --radius-m: 10px;
  --radius-l: 14px;
  --radius-xl: 18px;

  --shadow-card: 0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.32);

  background: var(--bg-0);
  color: var(--text-0);
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--border);
}
.eud-root::before {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 22% 28%, rgba(139,126,248,0.10), transparent 60%),
    radial-gradient(ellipse 500px 350px at 78% 78%, rgba(87,184,242,0.06), transparent 60%);
  pointer-events: none;
  z-index: 0;
}
.eud-mono { font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace; }

/* App ── */
.eud-app {
  position: relative; z-index: 1;
  display: flex; flex-direction: column;
  padding: 22px 26px 24px;
  gap: 18px;
}

/* Header ── */
.eud-hdr { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.eud-hdr-l { display: flex; align-items: center; gap: 14px; }
.eud-hdr-mark {
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border-radius: 10px;
  background: linear-gradient(140deg, var(--accent-dim), transparent 70%), var(--bg-2);
  border: 1px solid var(--border-strong);
  color: var(--accent-soft);
}
.eud-hdr-title { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; color: var(--text-0); }
.eud-hdr-sub { font-size: 13.5px; color: var(--text-2); letter-spacing: 0.02em; margin-top: 2px; }
.eud-hdr-r {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-2);
}
.eud-hdr-tag {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: rgba(255,255,255,0.015);
}
.eud-hdr-dot {
  width: 6px; height: 6px; border-radius: 99px;
  background: var(--gas); box-shadow: 0 0 8px var(--gas);
  display: inline-block; margin-right: 6px;
}

/* Stepper ── */
.eud-stepper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--border);
  border-radius: var(--radius-l);
  background: rgba(255,255,255,0.012);
  overflow: hidden;
}
.eud-step {
  padding: 14px 18px;
  display: flex; align-items: center; gap: 14px;
  position: relative;
  border-right: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.18s ease;
  background: transparent;
  border-top: none; border-bottom: none; border-left: none;
  font: inherit; color: inherit;
  text-align: left;
}
.eud-step:last-child { border-right: none; }
.eud-step:hover:not(.is-locked) { background: rgba(255,255,255,0.02); }
.eud-step.is-locked { cursor: not-allowed; opacity: 0.55; }
.eud-step.is-current { background: linear-gradient(180deg, var(--accent-dim), transparent 110%); }
.eud-step.is-current::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent);
}
.eud-step-n {
  width: 26px; height: 26px;
  border-radius: 8px;
  display: grid; place-items: center;
  font-family: ui-monospace, monospace;
  font-size: 13.5px;
  background: var(--bg-2);
  border: 1px solid var(--border-strong);
  color: var(--text-1);
  flex: 0 0 26px;
}
.eud-step.is-current .eud-step-n {
  background: var(--accent); border-color: var(--accent);
  color: var(--bg-0); font-weight: 600;
  box-shadow: 0 0 0 4px var(--accent-glow);
}
.eud-step.is-done .eud-step-n {
  background: rgba(74, 222, 146, 0.12);
  border-color: rgba(74, 222, 146, 0.5);
  color: var(--gas);
}
.eud-step-name {
  font-size: 14px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text-1);
}
.eud-step.is-current .eud-step-name { color: var(--text-0); }
.eud-step-desc { font-size: 13px; color: var(--text-2); margin-top: 2px; }

/* Grid ── */
.eud-grid {
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  gap: 14px;
  align-items: stretch;
}

.eud-card {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.004)),
    var(--bg-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-l);
  padding: 18px;
  box-shadow: var(--shadow-card);
  display: flex; flex-direction: column; gap: 14px;
  position: relative;
}
.eud-card-h {
  display: flex; align-items: baseline; justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.eud-card-title {
  font-size: 13px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-1);
}
.eud-card-title .accent { color: var(--accent-soft); }
.eud-card-tag {
  font-family: ui-monospace, monospace;
  font-size: 12.5px; color: var(--text-2);
  letter-spacing: 0.04em;
}

/* Controls ── */
.eud-section { display: flex; flex-direction: column; gap: 8px; }
.eud-label {
  display: flex; align-items: baseline; justify-content: space-between;
  font-size: 12.5px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--text-2);
}
.eud-label .val {
  font-family: ui-monospace, monospace;
  color: var(--text-0); font-size: 14px;
  letter-spacing: 0.02em;
}
.eud-label .val.gas { color: var(--gas); }
.eud-label .val.o2 { color: var(--oxygen); }

.eud-gas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.eud-gas-card {
  position: relative;
  background: rgba(255,255,255,0.015);
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  padding: 10px 11px;
  cursor: pointer;
  text-align: left;
  font: inherit; color: inherit;
  transition: all 0.16s ease;
  display: flex; flex-direction: column; gap: 4px;
  overflow: hidden;
}
.eud-gas-card:hover { background: rgba(255,255,255,0.03); border-color: var(--border-strong); }
.eud-gas-card.is-active {
  background: linear-gradient(180deg, var(--accent-dim), rgba(255,255,255,0.02));
  border-color: var(--border-accent);
  box-shadow: 0 0 0 1px var(--border-accent) inset;
}
.eud-gas-card .name { font-size: 14.5px; font-weight: 600; color: var(--text-0); }
.eud-gas-card .formula {
  font-family: ui-monospace, monospace;
  font-size: 12.5px; color: var(--text-2);
  letter-spacing: 0.04em;
}
.eud-gas-card.is-active .formula { color: var(--accent-soft); }
.eud-gas-card.is-mystery .formula { color: var(--text-3); letter-spacing: 0.12em; }
.eud-gas-card .mystery-glyph {
  position: absolute; right: 8px; top: 8px;
  width: 14px; height: 14px;
  border-radius: 99px;
  background: var(--bg-3);
  display: grid; place-items: center;
  font-size: 11px; color: var(--text-2);
  border: 1px solid var(--border);
}
.eud-gas-desc {
  font-size: 13.5px; color: var(--text-2);
  margin-top: 4px; font-style: italic;
}

/* Sliders ── */
.eud-slider-wrap { position: relative; height: 32px; display: flex; align-items: center; }
.eud-slider-track {
  position: absolute; left: 0; right: 0;
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 99px;
  overflow: hidden;
}
.eud-slider-fill {
  position: absolute; top: 0; bottom: 0; left: 0;
  border-radius: 99px;
  transition: width 0.18s ease;
}
.eud-slider-fill.gas { background: linear-gradient(90deg, transparent, var(--gas)); }
.eud-slider-fill.o2 { background: linear-gradient(90deg, transparent, var(--oxygen)); }
.eud-slider-input {
  width: 100%; height: 32px;
  appearance: none; background: transparent;
  position: relative; cursor: pointer;
  margin: 0;
}
.eud-slider-input::-webkit-slider-thumb {
  appearance: none;
  width: 16px; height: 16px;
  border-radius: 99px;
  background: var(--text-0);
  border: 3px solid var(--bg-1);
  box-shadow: 0 0 0 1px var(--border-strong), 0 2px 8px rgba(0,0,0,0.5);
  cursor: grab;
}
.eud-slider-input.gas::-webkit-slider-thumb {
  background: var(--gas);
  box-shadow: 0 0 0 1px rgba(74,222,146,0.4), 0 0 12px rgba(74,222,146,0.5);
}
.eud-slider-input.o2::-webkit-slider-thumb {
  background: var(--oxygen);
  box-shadow: 0 0 0 1px rgba(87,184,242,0.4), 0 0 12px rgba(87,184,242,0.5);
}
.eud-slider-input::-moz-range-thumb {
  width: 16px; height: 16px;
  border-radius: 99px;
  background: var(--text-0);
  border: 3px solid var(--bg-1);
  cursor: grab;
}
.eud-slider-input.gas::-moz-range-thumb { background: var(--gas); }
.eud-slider-input.o2::-moz-range-thumb { background: var(--oxygen); }
.eud-slider-ticks {
  display: flex; justify-content: space-between;
  margin-top: 4px;
  font-family: ui-monospace, monospace;
  font-size: 11.5px; color: var(--text-3);
}

/* Callouts ── */
.eud-callout {
  font-size: 13.5px; color: var(--text-2);
  padding: 8px 10px;
  background: rgba(255,255,255,0.018);
  border: 1px solid var(--border);
  border-radius: var(--radius-s);
  display: flex; align-items: center; gap: 8px;
}
.eud-callout.warn {
  color: #F2C77A;
  background: rgba(242,180,99,0.06);
  border-color: rgba(242,180,99,0.25);
}
.eud-callout.ok {
  color: var(--gas);
  background: rgba(74,222,146,0.05);
  border-color: rgba(74,222,146,0.2);
}
.eud-callout .ico {
  width: 14px; height: 14px; flex: 0 0 14px;
  display: grid; place-items: center;
  border-radius: 99px;
  font-size: 11px;
}

/* Eudiometer card ── */
.eud-eu-card {
  align-items: center;
  padding: 22px 22px 20px;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(139,126,248,0.05), transparent 70%),
    linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.004)),
    var(--bg-1);
  gap: 10px;
}
.eud-eu-head {
  width: 100%;
  display: flex; justify-content: space-between; align-items: baseline;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.eud-stat-row { display: flex; gap: 10px; width: 100%; margin-top: 4px; }
.eud-stat {
  flex: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  padding: 10px 12px;
  display: flex; flex-direction: column; gap: 4px;
}
.eud-stat.is-current { border-color: var(--border-accent); background: linear-gradient(180deg, var(--accent-dim), rgba(255,255,255,0.01)); }
.eud-stat .lbl {
  font-size: 11.5px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.14em;
  color: var(--text-2);
  display: flex; align-items: center; gap: 6px;
}
.eud-stat .lbl-dot { width: 6px; height: 6px; border-radius: 99px; background: var(--text-3); }
.eud-stat.is-initial .lbl-dot { background: var(--text-1); }
.eud-stat.is-ignite .lbl-dot { background: var(--co2); box-shadow: 0 0 6px var(--co2); }
.eud-stat.is-absorb .lbl-dot { background: var(--oxygen); box-shadow: 0 0 6px var(--oxygen); }
.eud-stat .v {
  font-family: ui-monospace, monospace;
  font-size: 20px; letter-spacing: -0.01em;
  color: var(--text-0); font-weight: 500;
}
.eud-stat .v.dim { color: var(--text-3); }
.eud-stat .v .unit { font-size: 12px; color: var(--text-2); margin-left: 2px; }
.eud-stat .delta {
  font-family: ui-monospace, monospace;
  font-size: 12px; color: var(--text-2);
}
.eud-stat .delta.minus { color: #F38B7A; }

.eud-tube-stage {
  width: 100%;
  flex: 1;
  display: flex; justify-content: center; align-items: stretch;
  position: relative;
  min-height: 460px;
}
.eud-tube-svg { width: 100%; height: 100%; max-height: 600px; }

/* Right panel ── */
.eud-eq {
  font-family: ui-monospace, monospace;
  font-size: 15px; line-height: 1.6;
  padding: 12px 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  letter-spacing: 0.01em;
}
.eud-eq .c-gas { color: var(--gas); }
.eud-eq .c-o2 { color: var(--oxygen); }
.eud-eq .c-co2 { color: var(--co2); }
.eud-eq .c-water { color: var(--water-line); }
.eud-eq .arrow { color: var(--text-2); margin: 0 8px; }
.eud-eq sub { font-size: 0.75em; vertical-align: sub; }

.eud-derivation {
  display: flex; flex-direction: column;
  gap: 8px;
  font-family: ui-monospace, monospace;
  font-size: 13.5px; line-height: 1.5;
  color: var(--text-1);
}
.eud-derivation .row {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 8px; padding: 8px 10px;
  background: rgba(255,255,255,0.015);
  border: 1px solid var(--border);
  border-radius: var(--radius-s);
}
.eud-derivation .row .lbl {
  color: var(--text-2);
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.eud-derivation .row .v { color: var(--text-0); font-size: 14.5px; }
.eud-derivation .row.is-hi { border-color: var(--border-accent); background: var(--accent-dim); }
.eud-derivation .row.is-hi .v { color: var(--accent-soft); }

.eud-formula-result {
  text-align: center;
  padding: 20px 14px;
  border-radius: var(--radius-m);
  background:
    radial-gradient(ellipse at center, var(--accent-dim), transparent 70%),
    rgba(255,255,255,0.015);
  border: 1px solid var(--border-accent);
}
.eud-formula-result .lbl {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-2);
  margin-bottom: 8px;
}
.eud-formula-result .f {
  font-family: ui-monospace, monospace;
  font-size: 34px; font-weight: 500;
  color: var(--accent-soft);
  letter-spacing: 0.02em;
}
.eud-formula-result .f sub { font-size: 0.55em; }
.eud-formula-result .note {
  font-size: 13px;
  color: var(--text-2);
  margin-top: 8px;
}
.eud-formula-result .note.match { color: var(--gas); }

/* Narrative ── */
.eud-narr-title { font-size: 16px; font-weight: 600; color: var(--text-0); letter-spacing: -0.005em; }
.eud-narr-list { margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.eud-narr-list li { font-size: 14px; color: var(--text-1); line-height: 1.55; display: flex; gap: 8px; }
.eud-narr-list .n {
  color: var(--accent-soft); flex: 0 0 16px;
  font-family: ui-monospace, monospace; font-size: 13px;
}

/* Action bar ── */
.eud-bar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px;
  padding: 10px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-l);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.012), rgba(255,255,255,0.002)),
    var(--bg-1);
  flex-wrap: wrap;
}
.eud-bar-left { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.eud-bar-right { display: flex; gap: 10px; flex-wrap: wrap; }
.eud-bar-hint {
  font-size: 13.5px;
  color: var(--text-2);
  display: flex; align-items: center; gap: 6px;
}
.eud-kbd {
  font-family: ui-monospace, monospace;
  font-size: 12.5px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  color: var(--text-1);
}

.eud-btn {
  appearance: none;
  border: 1px solid var(--border-strong);
  background: rgba(255,255,255,0.025);
  color: var(--text-0);
  padding: 9px 14px;
  border-radius: 9px;
  font: inherit;
  font-size: 14.5px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.14s ease;
}
.eud-btn:hover:not(:disabled) { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); }
.eud-btn.is-primary {
  background: linear-gradient(180deg, var(--accent), #6E61E0);
  border-color: rgba(139,126,248,0.6);
  color: #0A0814; font-weight: 600;
  box-shadow: 0 0 0 1px rgba(139,126,248,0.4) inset, 0 4px 20px rgba(139,126,248,0.3);
}
.eud-btn.is-fire {
  background: linear-gradient(180deg, #FF8266, #E55842);
  border-color: rgba(255,130,102,0.6);
  color: #1A0606; font-weight: 600;
  box-shadow: 0 0 0 1px rgba(255,130,102,0.4) inset, 0 4px 20px rgba(255,130,102,0.35);
}
.eud-btn.is-ghost { background: transparent; }
.eud-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Ignition flash ── */
@keyframes eud-flash-ignite {
  0%   { opacity: 0; }
  6%   { opacity: 1; }
  100% { opacity: 0; }
}
.eud-flash {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(255,200,140,0.95), rgba(255,140,90,0.4) 30%, transparent 70%);
  pointer-events: none;
  opacity: 0;
  z-index: 5;
  mix-blend-mode: screen;
}
.eud-flash.is-firing { animation: eud-flash-ignite 1.2s ease-out 1; }

@media (max-width: 1100px) {
  .eud-grid { grid-template-columns: 1fr; }
  .eud-tube-stage { min-height: 520px; }
  .eud-stat-row { flex-wrap: wrap; }
  .eud-stat { min-width: 100px; }
}
@media (max-width: 700px) {
  .eud-stepper { grid-template-columns: repeat(2, 1fr); }
  .eud-step:nth-child(2) { border-right: none; }
  .eud-step { border-bottom: 1px solid var(--border); }
  .eud-step:nth-child(3), .eud-step:nth-child(4) { border-bottom: none; }
  .eud-hdr-r { display: none; }
}
`;

// ── Pretty formula renderer ──────────────────────────────────────────────────
function Formula({
  x,
  y,
  kind,
}: {
  x?: number;
  y?: number;
  kind: 'gas' | 'o2' | 'co2' | 'water';
}) {
  const cls = 'c-' + kind;
  if (kind === 'o2') return <span className={cls}>O<sub>2</sub></span>;
  if (kind === 'water') return <span className={cls}>H<sub>2</sub>O</span>;
  if (kind === 'co2') return <span className={cls}>CO<sub>2</sub></span>;
  return (
    <span className={cls}>
      {x === 1 ? 'C' : (<>C<sub>{x}</sub></>)}
      {y === 0 ? '' : y === 1 ? 'H' : (<>H<sub>{y}</sub></>)}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function EudiometerLabSim() {
  const [step, setStep] = useState(0);
  const [gasKey, setGasKey] = useState<GasKey>('methane');
  const [vGas, setVGas] = useState(10);
  const [vO2, setVO2] = useState(50);
  const [firing, setFiring] = useState(false);

  const gas = GASES[gasKey] as Gas;
  const { x, y } = gas;

  // Stoichiometry
  const o2NeededPerMole = x + y / 4;
  const o2Needed = vGas * o2NeededPerMole;
  const enoughO2 = vO2 >= o2Needed;
  const excessO2 = Math.max(0, vO2 - o2Needed);

  const vInitial = vGas + vO2;
  const vAfterIgnition = enoughO2 ? vO2 - vGas * (y / 4) : null;
  const vAfterKOH = enoughO2 ? vO2 - vGas * (x + y / 4) : null;

  // Reset to step 0 when inputs change
  useEffect(() => {
    if (step > 0) setStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasKey, vGas, vO2]);

  // Tube layers per step
  type Layer = { id: string; formula: string; volume: number; color: string };
  const layers: Layer[] = useMemo(() => {
    if (step === 0) {
      return [
        { id: 'gas', formula: gas.formula, volume: vGas, color: '#4ADE92' },
        { id: 'o2', formula: 'O₂', volume: vO2, color: '#57B8F2' },
      ];
    }
    if (step === 1) {
      const vCO2 = vGas * x;
      const vO2left = vO2 - vGas * (x + y / 4);
      return [
        { id: 'co2', formula: 'CO₂', volume: vCO2, color: '#F2B463' },
        { id: 'o2', formula: 'O₂', volume: vO2left, color: '#57B8F2' },
      ].filter((l) => l.volume > 0.05);
    }
    if (step >= 2) {
      const vO2left = vO2 - vGas * (x + y / 4);
      return [
        { id: 'o2', formula: 'O₂', volume: vO2left, color: '#57B8F2' },
      ].filter((l) => l.volume > 0.05);
    }
    return [];
  }, [step, gas, vGas, vO2, x, y]);

  const totalGas = layers.reduce((s, l) => s + l.volume, 0);

  // Handlers
  const goNext = useCallback(() => {
    if (!enoughO2 && step === 0) return;
    if (step === 0) {
      setFiring(true);
      setTimeout(() => setStep(1), 350);
      setTimeout(() => setFiring(false), 1200);
    } else if (step < 3) {
      setStep(step + 1);
    }
  }, [step, enoughO2]);
  const goBack = useCallback(() => { if (step > 0) setStep(step - 1); }, [step]);
  const reset = useCallback(() => setStep(0), []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goBack(); }
      if (e.key === 'r' || e.key === 'R') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goBack, reset]);

  const accentLabel = step === 0 ? 'TOTAL' : step === 1 ? 'AFTER IGNITE' : 'AFTER KOH';
  const headTag =
    step === 0 ? 'PRE-IGNITION' :
    step === 1 ? 'POST-IGNITION' :
    step === 2 ? 'POST-KOH' :
                 'FINAL VOLUME';

  return (
    <div className="eud-root">
      <style>{STYLES}</style>
      <div className="eud-app">
        {/* HEADER */}
        <header className="eud-hdr">
          <div className="eud-hdr-l">
            <div className="eud-hdr-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 2 L7 8 L3.5 16 Q3 17.5 4.5 17.5 L15.5 17.5 Q17 17.5 16.5 16 L13 8 L13 2 Z"
                      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <line x1="7" y1="2" x2="13" y2="2" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="10" cy="13" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="eud-hdr-title">Eudiometer Lab</div>
              <div className="eud-hdr-sub">Volume–volume analysis of gaseous hydrocarbons</div>
            </div>
          </div>
          <div className="eud-hdr-r">
            <div className="eud-hdr-tag"><span className="eud-hdr-dot" />Apparatus armed</div>
            <div className="eud-hdr-tag">Mole Concept · CH 1</div>
          </div>
        </header>

        {/* STEPPER */}
        <div className="eud-stepper">
          {STEPS.map((s) => {
            const cur = step === s.id;
            const done = step > s.id;
            const locked = s.id > step;
            return (
              <button
                key={s.id}
                type="button"
                className={`eud-step${cur ? ' is-current' : ''}${done ? ' is-done' : ''}${locked ? ' is-locked' : ''}`}
                onClick={() => { if (!locked) setStep(s.id); }}
              >
                <div className="eud-step-n">{done ? '✓' : s.id + 1}</div>
                <div>
                  <div className="eud-step-name">{s.name}</div>
                  <div className="eud-step-desc">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* MAIN GRID */}
        <div className="eud-grid">
          <LeftPanel
            step={step}
            gasKey={gasKey}
            setGasKey={setGasKey}
            gas={gas}
            vGas={vGas} setVGas={setVGas}
            vO2={vO2} setVO2={setVO2}
            enoughO2={enoughO2}
            excessO2={excessO2}
            o2Needed={o2Needed}
            y={y}
            x={x}
          />

          {/* CENTER — eudiometer */}
          <div className="eud-card eud-eu-card">
            <div className="eud-eu-head">
              <div className="eud-card-title">Eudiometer <span className="accent">/ tube</span></div>
              <div className="eud-card-tag">{headTag}</div>
            </div>
            <div className="eud-stat-row">
              <Stat label="Initial"      value={vInitial}        isInitial isCurrent={step === 0} />
              <Stat label="After Ignite" value={vAfterIgnition} isIgnite  isCurrent={step === 1}
                    delta={vAfterIgnition != null ? -(vInitial - vAfterIgnition) : null}
                    dim={step < 1} />
              <Stat label="After KOH"    value={vAfterKOH}       isAbsorb  isCurrent={step >= 2}
                    delta={vAfterKOH != null && vAfterIgnition != null ? -(vAfterIgnition - vAfterKOH) : null}
                    dim={step < 2} />
            </div>
            <div className="eud-tube-stage">
              <Eudiometer
                layers={layers}
                totalGas={totalGas}
                accentLabel={accentLabel}
                firing={firing}
                bubbling={step === 2}
              />
              <div className={`eud-flash${firing ? ' is-firing' : ''}`} />
            </div>
          </div>

          <RightPanel
            step={step}
            gas={gas}
            x={x} y={y}
            vGas={vGas}
            vInitial={vInitial}
            vAfterIgnition={vAfterIgnition}
            vAfterKOH={vAfterKOH}
          />
        </div>

        {/* ACTION BAR */}
        <div className="eud-bar">
          <div className="eud-bar-left">
            <div className="eud-bar-hint">
              <span className="eud-kbd">←</span><span className="eud-kbd">→</span><span>step</span>
              <span className="eud-kbd" style={{ marginLeft: 8 }}>R</span><span>reset</span>
            </div>
            {!enoughO2 && step === 0 && (
              <div className="eud-callout warn">
                <span className="ico">!</span>
                Not enough O₂ — need {o2Needed.toFixed(1)} mL to fully combust this charge.
              </div>
            )}
          </div>
          <div className="eud-bar-right">
            {step > 0 && <button type="button" className="eud-btn is-ghost" onClick={goBack}>← Back</button>}
            {step > 0 && <button type="button" className="eud-btn is-ghost" onClick={reset}>Reset</button>}
            {step === 0 && (
              <button type="button" className="eud-btn is-fire" onClick={goNext} disabled={!enoughO2}>
                Spark ignition
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 1 L3 7.5 L6.5 7.5 L5 13 L10 6 L7 6 Z" fill="currentColor" />
                </svg>
              </button>
            )}
            {step === 1 && (
              <button type="button" className="eud-btn is-primary" onClick={goNext}>
                Introduce KOH
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </button>
            )}
            {step === 2 && (
              <button type="button" className="eud-btn is-primary" onClick={goNext}>
                Deduce formula →
              </button>
            )}
            {step === 3 && (
              <button type="button" className="eud-btn is-primary" onClick={reset}>
                Run another experiment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat tile ────────────────────────────────────────────────────────────────
function Stat({
  label, value, delta,
  isInitial, isIgnite, isAbsorb,
  isCurrent, dim,
}: {
  label: string;
  value: number | null;
  delta?: number | null;
  isInitial?: boolean;
  isIgnite?: boolean;
  isAbsorb?: boolean;
  isCurrent?: boolean;
  dim?: boolean;
}) {
  const cls = ['eud-stat',
    isInitial && 'is-initial',
    isIgnite && 'is-ignite',
    isAbsorb && 'is-absorb',
    isCurrent && 'is-current',
  ].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="lbl"><span className="lbl-dot" />{label}</div>
      <div className={`v${dim ? ' dim' : ''}`}>
        {value != null ? value.toFixed(1) : '—'}<span className="unit">mL</span>
      </div>
      {delta != null && !dim && (
        <div className={`delta${delta < 0 ? ' minus' : ''}`}>
          Δ {delta > 0 ? '+' : ''}{delta.toFixed(1)} mL
        </div>
      )}
    </div>
  );
}

// ── Left panel ───────────────────────────────────────────────────────────────
function LeftPanel({
  step, gasKey, setGasKey, gas, vGas, setVGas, vO2, setVO2,
  enoughO2, excessO2, o2Needed, x, y,
}: {
  step: number;
  gasKey: GasKey;
  setGasKey: (k: GasKey) => void;
  gas: Gas;
  vGas: number; setVGas: (v: number) => void;
  vO2: number; setVO2: (v: number) => void;
  enoughO2: boolean;
  excessO2: number;
  o2Needed: number;
  x: number; y: number;
}) {
  const gasFill = (vGas / 30) * 100;
  const o2Fill = (vO2 / 100) * 100;

  return (
    <div className="eud-card">
      <div className="eud-card-h">
        <div className="eud-card-title">
          {step === 0 ? (<>Setup <span className="accent">/ charge</span></>) :
           step === 1 ? (<>Ignition <span className="accent">/ combustion</span></>) :
           step === 2 ? (<>Absorption <span className="accent">/ KOH</span></>) :
                       (<>Deduction <span className="accent">/ formula</span></>)}
        </div>
        <div className="eud-card-tag">STEP {step + 1} / 4</div>
      </div>

      {step === 0 && (
        <>
          <div className="eud-section">
            <div className="eud-label"><span>Hydrocarbon</span><span className="val gas">{gas.formula}</span></div>
            <div className="eud-gas-grid">
              {Object.values(GASES).map((g) => {
                const active = g.id === gasKey;
                const mystery = 'mystery' in g;
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`eud-gas-card${active ? ' is-active' : ''}${mystery ? ' is-mystery' : ''}`}
                    onClick={() => setGasKey(g.id as GasKey)}
                  >
                    <div className="name">{g.name}</div>
                    <div className="formula">{g.formula}</div>
                    {mystery && <div className="mystery-glyph">?</div>}
                  </button>
                );
              })}
            </div>
            <div className="eud-gas-desc">{gas.desc}</div>
          </div>

          <div className="eud-section">
            <div className="eud-label"><span>Volume of gas</span><span className="val gas">{vGas} mL</span></div>
            <div className="eud-slider-wrap">
              <div className="eud-slider-track">
                <div className="eud-slider-fill gas" style={{ width: `${gasFill}%` }} />
              </div>
              <input
                type="range" min={1} max={30} step={1} value={vGas}
                className="eud-slider-input gas"
                onChange={(e) => setVGas(parseInt(e.target.value, 10))}
              />
            </div>
            <div className="eud-slider-ticks"><span>1</span><span>10</span><span>20</span><span>30</span></div>
          </div>

          <div className="eud-section">
            <div className="eud-label"><span>Volume of O₂</span><span className="val o2">{vO2} mL</span></div>
            <div className="eud-slider-wrap">
              <div className="eud-slider-track">
                <div className="eud-slider-fill o2" style={{ width: `${o2Fill}%` }} />
              </div>
              <input
                type="range" min={10} max={100} step={1} value={vO2}
                className="eud-slider-input o2"
                onChange={(e) => setVO2(parseInt(e.target.value, 10))}
              />
            </div>
            <div className="eud-slider-ticks"><span>10</span><span>40</span><span>70</span><span>100</span></div>
          </div>

          {enoughO2 ? (
            <div className="eud-callout ok">
              <span className="ico">✓</span>
              {o2Needed.toFixed(1)} mL O₂ consumed · {excessO2.toFixed(1)} mL excess
            </div>
          ) : (
            <div className="eud-callout warn">
              <span className="ico">!</span>
              Need ≥ {o2Needed.toFixed(1)} mL O₂ for full combustion
            </div>
          )}
        </>
      )}

      {step === 1 && (
        <StepNarrative
          title="A spark ignites the mixture"
          bullets={[
            'Platinum electrodes at the top of the sealed tube discharge a spark across the gas mixture.',
            'The hydrocarbon burns instantly in O₂. Water vapour produced is rapidly cooled and condenses onto the trough — its gaseous contribution vanishes.',
            'What remains in the gas phase: any excess O₂ plus all the CO₂ produced.',
          ]}
          measure={{ label: 'Volume contraction', value: `${(vGas * (1 + y / 4)).toFixed(1)} mL` }}
        />
      )}

      {step === 2 && (
        <StepNarrative
          title="KOH solution removes CO₂"
          bullets={[
            'Concentrated potassium hydroxide is admitted into the tube. CO₂ reacts with KOH to form K₂CO₃, dissolving into the liquid.',
            'Watch the level rise as carbon dioxide is scrubbed away.',
            'The volume remaining is pure unreacted O₂.',
          ]}
          measure={{ label: 'CO₂ absorbed', value: `${(vGas * x).toFixed(1)} mL` }}
        />
      )}

      {step === 3 && (
        <StepNarrative
          title="Two contractions, one formula"
          bullets={[
            'From the first contraction we count hydrogens. From the second we count carbons.',
            'Each is normalised by the volume of the original hydrocarbon — Avogadro’s principle lets us read mole ratios straight off volume ratios.',
          ]}
        />
      )}
    </div>
  );
}

function StepNarrative({
  title, bullets, measure,
}: {
  title: string;
  bullets: string[];
  measure?: { label: string; value: string };
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="eud-narr-title">{title}</div>
      <ul className="eud-narr-list">
        {bullets.map((b, i) => (
          <li key={i}>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {measure && (
        <div className="eud-callout ok" style={{ marginTop: 4 }}>
          <span className="ico">Σ</span>
          {measure.label}: <span className="eud-mono" style={{ marginLeft: 4, color: 'var(--text-0)' }}>{measure.value}</span>
        </div>
      )}
    </div>
  );
}

// ── Right panel ──────────────────────────────────────────────────────────────
function RightPanel({
  step, gas, x, y, vGas, vInitial, vAfterIgnition, vAfterKOH,
}: {
  step: number;
  gas: Gas;
  x: number; y: number;
  vGas: number;
  vInitial: number;
  vAfterIgnition: number | null;
  vAfterKOH: number | null;
}) {
  const dedX =
    vAfterIgnition != null && vAfterKOH != null ? (vAfterIgnition - vAfterKOH) / vGas : null;
  const dedY =
    vAfterIgnition != null ? 4 * ((vInitial - vAfterIgnition) / vGas - 1) : null;

  const o2Coef = x + y / 4;
  const waterCoef = y / 2;
  const fmtCoef = (c: number) =>
    c === 1 ? '' : Number.isInteger(c) ? c + '·' : c.toFixed(1) + '·';

  return (
    <div className="eud-card">
      <div className="eud-card-h">
        <div className="eud-card-title">Lab notebook <span className="accent">/ math</span></div>
        <div className="eud-card-tag">NCERT · CLASS 11</div>
      </div>

      <div>
        <div className="eud-label" style={{ marginBottom: 8 }}><span>Balanced reaction</span></div>
        <div className="eud-eq">
          <Formula x={x} y={y} kind="gas" />
          {' + '}
          <span className="c-o2">{fmtCoef(o2Coef)}</span>
          <Formula kind="o2" />
          <span className="arrow">→</span>
          <span className="c-co2">{x === 1 ? '' : x + '·'}</span>
          <Formula kind="co2" />
          {' + '}
          <span className="c-water">{waterCoef === 1 ? '' : waterCoef + '·'}</span>
          <Formula kind="water" />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.5 }}>
          Avogadro: equal volumes ↔ equal moles. Mole ratios = volume ratios.
        </div>
      </div>

      <div>
        <div className="eud-label" style={{ marginBottom: 8 }}><span>Volume bookkeeping</span></div>
        <div className="eud-derivation">
          <div className="row">
            <span className="lbl">V₀ initial</span>
            <span className="v">{vInitial.toFixed(1)} mL</span>
          </div>
          <div className="row" style={{ opacity: step >= 1 ? 1 : 0.45 }}>
            <span className="lbl">V₁ post-ignite</span>
            <span className="v">{vAfterIgnition != null && step >= 1 ? `${vAfterIgnition.toFixed(1)} mL` : '— —'}</span>
          </div>
          <div className="row" style={{ opacity: step >= 2 ? 1 : 0.45 }}>
            <span className="lbl">V₂ post-KOH</span>
            <span className="v">{vAfterKOH != null && step >= 2 ? `${vAfterKOH.toFixed(1)} mL` : '— —'}</span>
          </div>
          <div className="row" style={{ opacity: step >= 1 ? 1 : 0.45, marginTop: 6 }}>
            <span className="lbl">V₀ − V₁ (gas + H lost)</span>
            <span className="v">{step >= 1 && vAfterIgnition != null ? `${(vInitial - vAfterIgnition).toFixed(1)} mL` : '—'}</span>
          </div>
          <div className="row" style={{ opacity: step >= 2 ? 1 : 0.45 }}>
            <span className="lbl">V₁ − V₂ (CO₂ absorbed)</span>
            <span className="v">{step >= 2 && vAfterIgnition != null && vAfterKOH != null ? `${(vAfterIgnition - vAfterKOH).toFixed(1)} mL` : '—'}</span>
          </div>

          {step >= 3 && dedX != null && dedY != null && (
            <>
              <div className="row is-hi">
                <span className="lbl">x = (V₁ − V₂) / V<sub>gas</sub></span>
                <span className="v">{dedX.toFixed(2)} → <strong style={{ color: 'var(--text-0)' }}>{Math.round(dedX)}</strong></span>
              </div>
              <div className="row is-hi">
                <span className="lbl">y = 4·((V₀ − V₁)/V<sub>gas</sub> − 1)</span>
                <span className="v">{dedY.toFixed(2)} → <strong style={{ color: 'var(--text-0)' }}>{Math.round(dedY)}</strong></span>
              </div>
            </>
          )}
        </div>
      </div>

      {step >= 3 && dedX != null && dedY != null && (
        <div className="eud-formula-result">
          <div className="lbl">Deduced formula</div>
          <div className="f">
            C{Math.round(dedX) === 1 ? '' : <sub>{Math.round(dedX)}</sub>}
            H{Math.round(dedY) === 1 ? '' : <sub>{Math.round(dedY)}</sub>}
          </div>
          {gas.mystery ? (
            <div className="note match">↳ {gas.name} unmasked: {gas.mystery}</div>
          ) : (
            <div className="note match">↳ matches {gas.name} ({gas.formula})</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Eudiometer SVG ───────────────────────────────────────────────────────────
function Eudiometer({
  layers, totalGas, accentLabel, firing, bubbling,
}: {
  layers: { id: string; formula: string; volume: number; color: string }[];
  totalGas: number;
  accentLabel: string;
  firing: boolean;
  bubbling: boolean;
}) {
  // Geometry
  const W = 280;
  const H = 640;
  const tubeX = 88;
  const tubeW = 64;
  const tubeTop = 28;
  const tubeBottom = 540;
  const tubeH = tubeBottom - tubeTop;
  const mlToY = (ml: number) => tubeBottom - (ml / 100) * tubeH;

  let cursor = 0;
  const rendered = layers.map((l) => {
    const yBottom = mlToY(cursor);
    const yTop = mlToY(cursor + l.volume);
    cursor += l.volume;
    return { ...l, yTop, yBottom, yMid: (yTop + yBottom) / 2, height: yBottom - yTop };
  });

  const waterTopInTube = mlToY(totalGas);
  const troughTop = 540;
  const troughBottom = 612;
  const troughLeftX = 30;
  const troughRightX = 250;

  return (
    <svg className="eud-tube-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        {rendered.map((l) => (
          <linearGradient key={l.id + '-g'} id={`eud-grad-${l.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={l.color} stopOpacity="0.45" />
            <stop offset="50%" stopColor={l.color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={l.color} stopOpacity="0.55" />
          </linearGradient>
        ))}
        <linearGradient id="eud-water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(140,180,220,0.0)" />
          <stop offset="3%" stopColor="rgba(140,180,220,0.4)" />
          <stop offset="20%" stopColor="rgba(80,130,180,0.35)" />
          <stop offset="100%" stopColor="rgba(50,90,140,0.5)" />
        </linearGradient>
        <linearGradient id="eud-tube-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
        </linearGradient>
        <linearGradient id="eud-trough-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(140,180,220,0.55)" />
          <stop offset="100%" stopColor="rgba(40,70,110,0.65)" />
        </linearGradient>
        <clipPath id="eud-tube-clip">
          <rect x={tubeX} y={tubeTop} width={tubeW} height={tubeH + 12} rx="2" />
        </clipPath>
      </defs>

      {/* Trough */}
      <g>
        <path
          d={`M ${troughLeftX} ${troughTop}
              L ${troughLeftX} ${troughBottom - 14}
              Q ${troughLeftX} ${troughBottom} ${troughLeftX + 14} ${troughBottom}
              L ${troughRightX - 14} ${troughBottom}
              Q ${troughRightX} ${troughBottom} ${troughRightX} ${troughBottom - 14}
              L ${troughRightX} ${troughTop}
              Z`}
          fill="rgba(20,28,42,0.6)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <path
          d={`M ${troughLeftX + 2} ${troughTop + 8}
              L ${troughLeftX + 2} ${troughBottom - 14}
              Q ${troughLeftX + 2} ${troughBottom - 2} ${troughLeftX + 14} ${troughBottom - 2}
              L ${troughRightX - 14} ${troughBottom - 2}
              Q ${troughRightX - 2} ${troughBottom - 2} ${troughRightX - 2} ${troughBottom - 14}
              L ${troughRightX - 2} ${troughTop + 8}
              Z`}
          fill="url(#eud-trough-water)"
        />
        <line
          x1={troughLeftX + 4} y1={troughTop + 8}
          x2={troughRightX - 4} y2={troughTop + 8}
          stroke="rgba(180,210,240,0.4)" strokeWidth="1"
        />
      </g>

      {/* Tube body */}
      <g>
        <rect
          x={tubeX - 6} y={tubeTop - 14}
          width={tubeW + 12} height={tubeH + 22}
          rx="6"
          fill="rgba(8,12,20,0.8)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        {/* Stopper + electrodes */}
        <g>
          <line x1={tubeX - 6} y1={tubeTop - 14} x2={tubeX + tubeW + 6} y2={tubeTop - 14}
                stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={tubeX + tubeW * 0.3} y1={tubeTop - 14} x2={tubeX + tubeW * 0.42} y2={tubeTop + 8}
                stroke="rgba(220,220,220,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1={tubeX + tubeW * 0.7} y1={tubeTop - 14} x2={tubeX + tubeW * 0.58} y2={tubeTop + 8}
                stroke="rgba(220,220,220,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          {firing && (
            <g>
              <circle cx={tubeX + tubeW / 2} cy={tubeTop + 8} r="6" fill="rgba(255,220,150,0.9)" />
              <circle cx={tubeX + tubeW / 2} cy={tubeTop + 8} r="14" fill="rgba(255,180,100,0.4)" />
            </g>
          )}
        </g>

        {/* Inner clipped */}
        <g clipPath="url(#eud-tube-clip)">
          <rect
            x={tubeX} y={tubeTop}
            width={tubeW}
            height={Math.max(0, waterTopInTube - tubeTop)}
            fill="url(#eud-water-grad)"
            style={{ transition: 'height 0.6s cubic-bezier(0.4,0,0.2,1), y 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          />
          {totalGas < 100 && (
            <line
              x1={tubeX + 1} y1={waterTopInTube}
              x2={tubeX + tubeW - 1} y2={waterTopInTube}
              stroke="rgba(160,200,235,0.7)" strokeWidth="1"
              style={{ transition: 'y1 0.6s cubic-bezier(0.4,0,0.2,1), y2 0.6s cubic-bezier(0.4,0,0.2,1)' }}
            />
          )}

          {rendered.map((l) => (
            <g key={l.id}>
              <rect
                x={tubeX} y={l.yTop}
                width={tubeW} height={l.height}
                fill={`url(#eud-grad-${l.id})`}
                style={{ transition: 'y 0.6s cubic-bezier(0.4,0,0.2,1), height 0.6s cubic-bezier(0.4,0,0.2,1)' }}
              />
              <line
                x1={tubeX + 1} y1={l.yTop}
                x2={tubeX + tubeW - 1} y2={l.yTop}
                stroke={l.color}
                strokeWidth="1" strokeOpacity="0.6"
                style={{ transition: 'y1 0.6s cubic-bezier(0.4,0,0.2,1), y2 0.6s cubic-bezier(0.4,0,0.2,1)' }}
              />
              {l.height > 22 && (
                <g>
                  <text
                    x={tubeX + tubeW / 2} y={l.yMid - 3}
                    fontFamily="ui-monospace, monospace"
                    fontSize="13" fontWeight="500"
                    fill="rgba(255,255,255,0.95)" textAnchor="middle"
                  >
                    {l.formula}
                  </text>
                  <text
                    x={tubeX + tubeW / 2} y={l.yMid + 11}
                    fontFamily="ui-monospace, monospace"
                    fontSize="12"
                    fill="rgba(255,255,255,0.7)" textAnchor="middle"
                  >
                    {l.volume.toFixed(1)} mL
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>

        <rect
          x={tubeX} y={tubeTop}
          width={tubeW} height={tubeH}
          fill="url(#eud-tube-glass)"
          pointerEvents="none"
        />
        <rect
          x={tubeX} y={tubeTop}
          width={tubeW} height={tubeH}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
        />
      </g>

      {/* Graduations (left side) */}
      <g>
        {Array.from({ length: 21 }).map((_, i) => {
          const ml = i * 5;
          const y = mlToY(ml);
          const isMajor = ml % 10 === 0;
          return (
            <g key={ml}>
              <line
                x1={tubeX - 8} y1={y}
                x2={tubeX - (isMajor ? 2 : 4)} y2={y}
                stroke={isMajor ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}
                strokeWidth={isMajor ? 1 : 0.8}
              />
              {isMajor && ml % 20 === 0 && (
                <text
                  x={tubeX - 12} y={y + 3}
                  fontFamily="ui-monospace, monospace"
                  fontSize="11"
                  fill="rgba(255,255,255,0.5)"
                  textAnchor="end"
                  letterSpacing="0.04em"
                >
                  {ml}
                </text>
              )}
            </g>
          );
        })}
        <text
          x={tubeX - 12} y={tubeTop - 2}
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          fill="rgba(255,255,255,0.4)"
          textAnchor="end"
          letterSpacing="0.1em"
        >
          mL
        </text>
      </g>

      {/* Side indicator (right) */}
      <g>
        <line
          x1={tubeX + tubeW + 10} y1={waterTopInTube}
          x2={tubeX + tubeW + 22} y2={waterTopInTube}
          stroke="#B0A6FB"
          strokeOpacity="0.7"
          strokeWidth="1"
          style={{ transition: 'y1 0.6s cubic-bezier(0.4,0,0.2,1), y2 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <g transform={`translate(${tubeX + tubeW + 26}, ${waterTopInTube + 3})`}>
          <text
            fontFamily="ui-monospace, monospace"
            fontSize="12"
            fill="rgba(176,166,251,0.9)"
            letterSpacing="0.02em"
          >
            {totalGas.toFixed(1)} mL
          </text>
          <text
            y="11"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fill="rgba(176,166,251,0.5)"
            letterSpacing="0.1em"
          >
            {accentLabel}
          </text>
        </g>
      </g>

      {/* Bubbles during absorb */}
      {bubbling && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={tubeX + 12 + (i * 11)}
              cy={tubeBottom - 10}
              r={2 + (i % 2)}
              fill="rgba(180,220,255,0.7)"
            >
              <animate
                attributeName="cy"
                from={tubeBottom - 10}
                to={waterTopInTube + 10}
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
            </circle>
          ))}
        </g>
      )}
    </svg>
  );
}
