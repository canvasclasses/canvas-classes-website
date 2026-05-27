'use client';

/**
 * Eudiometer Virtual Lab
 *
 * Academic source: NCERT Class 11, Chapter 1 — Some Basic Concepts of Chemistry
 * (Section: Stoichiometry / Volume–Volume Analysis / Eudiometry).
 *
 * Pedagogical goal: let the student replicate the classical experimental
 * procedure that deduces an unknown hydrocarbon's formula from gas-volume
 * measurements alone. The student picks a hydrocarbon and an O₂ amount,
 * fires a spark, watches combustion, cools the mixture to condense water,
 * then absorbs CO₂ in KOH and excess O₂ in alkaline pyrogallol. The
 * resulting volume drops feed the standard combustion equation
 *   C_xH_y + (x + y/4) O₂ → x CO₂ + (y/2) H₂O
 * and the student solves for x and y to identify the gas.
 */

import { useMemo, useState } from 'react';

// ── Hydrocarbon catalog ──────────────────────────────────────────────────────
const HYDROCARBONS = [
  { id: 'CH4',     x: 1, y: 4, name: 'Methane',  formula: 'CH₄',     color: '#34d399', hint: 'Natural gas — the simplest alkane.' },
  { id: 'C2H4',    x: 2, y: 4, name: 'Ethylene', formula: 'C₂H₄',    color: '#fbbf24', hint: 'An alkene (one double bond).' },
  { id: 'C2H6',    x: 2, y: 6, name: 'Ethane',   formula: 'C₂H₆',    color: '#818cf8', hint: 'An alkane — saturated.' },
  { id: 'C3H8',    x: 3, y: 8, name: 'Propane',  formula: 'C₃H₈',    color: '#f472b6', hint: 'LPG component.' },
  { id: 'MYS_1',   x: 4, y: 6, name: 'Mystery A', formula: 'C?H?',   color: '#c4b5fd', hint: '— hidden until you solve —' },
  { id: 'MYS_2',   x: 2, y: 2, name: 'Mystery B', formula: 'C?H?',   color: '#fb923c', hint: '— hidden until you solve —' },
] as const;
type HydrocarbonId = typeof HYDROCARBONS[number]['id'];

// ── Phases ───────────────────────────────────────────────────────────────────
type Phase = 'setup' | 'ignite' | 'absorb' | 'deduce';
const PHASES: { id: Phase; label: string }[] = [
  { id: 'setup',   label: '1 · Setup' },
  { id: 'ignite',  label: '2 · Ignite' },
  { id: 'absorb',  label: '3 · Absorb' },
  { id: 'deduce',  label: '4 · Deduce' },
];

// ── CSS animations ───────────────────────────────────────────────────────────
const ANIM = `
  @keyframes eud-spark   { 0%,100% { opacity:0; } 30%,70% { opacity:1; transform:scale(1.2); } }
  @keyframes eud-flash   { 0%,100% { opacity:0; } 40% { opacity:1; } }
  @keyframes eud-rise    { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .eud-spark   { animation: eud-spark 0.7s ease-in-out infinite; transform-origin:center; }
  .eud-flash   { animation: eud-flash 0.6s ease-out 1; }
  .eud-rise-in { animation: eud-rise 0.5s ease-out 1; }
`;

// ── Tube geometry ────────────────────────────────────────────────────────────
const TUBE_X = 60;
const TUBE_W = 90;
const TUBE_TOP = 40;
const TUBE_BOT = 480;
const TUBE_H = TUBE_BOT - TUBE_TOP;
const MAX_VOL = 100; // mL — full tube
const RESERVOIR_TOP = 470;
const RESERVOIR_BOT = 560;

function volToHeight(vol: number) {
  return (vol / MAX_VOL) * TUBE_H;
}

// ── Main component ───────────────────────────────────────────────────────────
export default function EudiometerLabSim() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [hcId, setHcId] = useState<HydrocarbonId>('CH4');
  const [hcVol, setHcVol] = useState(10); // mL
  const [o2Vol, setO2Vol] = useState(50); // mL
  const [ignited, setIgnited] = useState(false);
  const [absorbStep, setAbsorbStep] = useState(0); // 0 = none, 1 = after KOH, 2 = after pyrogallol
  const [guess, setGuess] = useState<{ x: number; y: number }>({ x: 1, y: 4 });
  const [revealed, setRevealed] = useState(false);

  const hc = HYDROCARBONS.find((h) => h.id === hcId)!;

  // ── Reaction stoichiometry ────────────────────────────────────────────────
  // C_xH_y + (x + y/4) O₂ → x CO₂ + (y/2) H₂O
  const o2NeededForFullCombustion = useMemo(() => hcVol * (hc.x + hc.y / 4), [hcVol, hc]);
  const o2IsLimiting = o2Vol < o2NeededForFullCombustion;

  // Volumes after combustion (water still as vapour — we'll condense in absorb phase)
  const co2Formed = o2IsLimiting
    ? (o2Vol / (hc.x + hc.y / 4)) * hc.x
    : hcVol * hc.x;
  const h2oFormed = o2IsLimiting
    ? (o2Vol / (hc.x + hc.y / 4)) * (hc.y / 2)
    : hcVol * (hc.y / 2);
  const o2Consumed = o2IsLimiting ? o2Vol : o2NeededForFullCombustion;
  const o2Remaining = o2Vol - o2Consumed;
  const hcConsumed = o2IsLimiting
    ? o2Vol / (hc.x + hc.y / 4)
    : hcVol;
  const hcRemaining = hcVol - hcConsumed;

  // After cooling (water condenses, doesn't count as gas volume)
  const totalAfterCool = co2Formed + o2Remaining + hcRemaining;
  const volAfterKOH = totalAfterCool - co2Formed; // KOH absorbs CO₂
  const volAfterPyrogallol = volAfterKOH - o2Remaining; // Pyrogallol absorbs O₂

  // ── Phase control ─────────────────────────────────────────────────────────
  function goNext() {
    const idx = PHASES.findIndex((p) => p.id === phase);
    if (idx < PHASES.length - 1) setPhase(PHASES[idx + 1].id);
  }
  function goBack() {
    const idx = PHASES.findIndex((p) => p.id === phase);
    if (idx > 0) setPhase(PHASES[idx - 1].id);
  }
  function resetAll() {
    setPhase('setup');
    setIgnited(false);
    setAbsorbStep(0);
    setRevealed(false);
    setGuess({ x: 1, y: 4 });
  }

  const phaseIdx = PHASES.findIndex((p) => p.id === phase);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', minHeight: '80vh' }}>
      <style>{ANIM}</style>

      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Eudiometer <span style={{ color: '#7c3aed' }}>Lab</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Deduce a hydrocarbon's formula from gas-volume measurements
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          Volume–Volume Analysis · NCERT Ch 1
        </div>
      </div>

      {/* StepBar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {PHASES.map((p, i) => {
          const active = p.id === phase;
          const done = i < phaseIdx;
          return (
            <button
              key={p.id}
              onClick={() => done && setPhase(p.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(129,140,248,0.15)' : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
                cursor: done ? 'pointer' : 'default',
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: active ? '#6366f1' : done ? '#059669' : 'rgba(255,255,255,0.06)', color: 'white' }}
              >
                {done ? '✓' : i + 1}
              </span>
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Main: stacked layout — SVG on top, controls below */}
      <div className="flex flex-col gap-6">
        {/* SVG canvas — centred with constrained width so the portrait
            eudiometer tube stays a sensible size */}
        <div
          className="relative overflow-hidden flex items-center justify-center rounded-3xl mx-auto w-full max-w-lg"
          style={{
            minHeight: 520,
            background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <EudiometerSVG
            phase={phase}
            hc={hc}
            hcVol={hcVol}
            o2Vol={o2Vol}
            ignited={ignited}
            absorbStep={absorbStep}
            o2IsLimiting={o2IsLimiting}
            hcConsumed={hcConsumed}
            hcRemaining={hcRemaining}
            co2Formed={co2Formed}
            o2Remaining={o2Remaining}
            totalAfterCool={totalAfterCool}
            volAfterKOH={volAfterKOH}
            volAfterPyrogallol={volAfterPyrogallol}
          />
        </div>

        {/* Controls — placed below the SVG, slightly constrained max-width
            for readability on wide screens */}
        <div className="flex flex-col py-1 gap-5 mx-auto w-full max-w-3xl">
          {phase === 'setup' && (
            <SetupPanel
              hcId={hcId}
              setHcId={(id) => {
                setHcId(id);
                setIgnited(false);
                setAbsorbStep(0);
                setGuess({ x: 1, y: 4 });
                setRevealed(false);
              }}
              hcVol={hcVol}
              setHcVol={setHcVol}
              o2Vol={o2Vol}
              setO2Vol={setO2Vol}
              hc={hc}
              o2NeededForFullCombustion={o2NeededForFullCombustion}
              o2IsLimiting={o2IsLimiting}
            />
          )}
          {phase === 'ignite' && (
            <IgnitePanel
              hc={hc}
              hcVol={hcVol}
              o2Vol={o2Vol}
              ignited={ignited}
              onIgnite={() => setIgnited(true)}
              co2Formed={co2Formed}
              h2oFormed={h2oFormed}
              o2Remaining={o2Remaining}
              hcRemaining={hcRemaining}
              o2IsLimiting={o2IsLimiting}
            />
          )}
          {phase === 'absorb' && (
            <AbsorbPanel
              absorbStep={absorbStep}
              setAbsorbStep={setAbsorbStep}
              totalAfterCool={totalAfterCool}
              volAfterKOH={volAfterKOH}
              volAfterPyrogallol={volAfterPyrogallol}
              co2Formed={co2Formed}
              o2Remaining={o2Remaining}
              hcRemaining={hcRemaining}
            />
          )}
          {phase === 'deduce' && (
            <DeducePanel
              hc={hc}
              hcVol={hcVol}
              o2Vol={o2Vol}
              co2Formed={co2Formed}
              o2Remaining={o2Remaining}
              o2Consumed={o2Consumed}
              guess={guess}
              setGuess={setGuess}
              revealed={revealed}
              setRevealed={setRevealed}
            />
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={goBack}
          disabled={phaseIdx === 0}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: phaseIdx === 0 ? '#334155' : '#94a3b8',
            cursor: phaseIdx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← Back
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(99,102,241,0.10)',
            border: '1px solid rgba(129,140,248,0.3)',
            color: '#a5b4fc',
          }}
        >
          ↺ Reset Lab
        </button>
        <button
          onClick={goNext}
          disabled={phaseIdx === PHASES.length - 1 || !canProceed(phase, ignited, absorbStep)}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(99,102,241,0.18)',
            border: '1px solid rgba(129,140,248,0.4)',
            color: phaseIdx === PHASES.length - 1 || !canProceed(phase, ignited, absorbStep) ? '#334155' : '#c4b5fd',
            cursor: phaseIdx === PHASES.length - 1 || !canProceed(phase, ignited, absorbStep) ? 'not-allowed' : 'pointer',
          }}
        >
          Next: {PHASES[phaseIdx + 1]?.label.split('·')[1]?.trim() ?? '—'} →
        </button>
      </div>
    </div>
  );
}

function canProceed(phase: Phase, ignited: boolean, absorbStep: number): boolean {
  if (phase === 'ignite') return ignited;
  if (phase === 'absorb') return absorbStep >= 2;
  return true;
}

// ─── SVG eudiometer ─────────────────────────────────────────────────────────
function EudiometerSVG(props: {
  phase: Phase;
  hc: typeof HYDROCARBONS[number];
  hcVol: number;
  o2Vol: number;
  ignited: boolean;
  absorbStep: number;
  o2IsLimiting: boolean;
  hcConsumed: number;
  hcRemaining: number;
  co2Formed: number;
  o2Remaining: number;
  totalAfterCool: number;
  volAfterKOH: number;
  volAfterPyrogallol: number;
}) {
  const {
    phase, hc, hcVol, o2Vol, ignited, absorbStep,
    co2Formed, o2Remaining, hcRemaining, totalAfterCool, volAfterKOH, volAfterPyrogallol,
  } = props;

  // What gases are in the tube right now?
  // Setup: hydrocarbon + O₂ as separate-colored bands (top = lighter density depiction).
  // Ignite (post-ignition): CO₂ + remaining O₂ + remaining HC + water vapour
  // Cool: water removed → CO₂ + O₂ + remaining HC
  // Absorb after KOH: O₂ + remaining HC
  // Absorb after Pyrogallol: remaining HC only (usually 0 with stoichiometric O₂)

  type Band = { vol: number; color: string; label: string };
  let bands: Band[] = [];
  let totalVol = hcVol + o2Vol;

  if (phase === 'setup' || (phase === 'ignite' && !ignited)) {
    bands = [
      { vol: hcVol, color: hc.color, label: hc.id.startsWith('MYS') ? 'Unknown' : hc.formula },
      { vol: o2Vol, color: '#60a5fa', label: 'O₂' },
    ];
    totalVol = hcVol + o2Vol;
  } else if (phase === 'ignite' && ignited) {
    // After combustion, before cooling — water still as vapour
    const h2oVol = (hcVol - hcRemaining) * (hc.y / 2);
    bands = [];
    if (hcRemaining > 0.01) bands.push({ vol: hcRemaining, color: hc.color, label: hc.formula });
    if (o2Remaining > 0.01) bands.push({ vol: o2Remaining, color: '#60a5fa', label: 'O₂' });
    if (co2Formed > 0.01)   bands.push({ vol: co2Formed,   color: '#94a3b8', label: 'CO₂' });
    if (h2oVol > 0.01)      bands.push({ vol: h2oVol,      color: '#7dd3fc', label: 'H₂O (vapour)' });
    totalVol = hcRemaining + o2Remaining + co2Formed + h2oVol;
  } else if (phase === 'absorb' && absorbStep === 0) {
    // Just cooled — water condensed out
    bands = [];
    if (hcRemaining > 0.01) bands.push({ vol: hcRemaining, color: hc.color, label: hc.formula });
    if (o2Remaining > 0.01) bands.push({ vol: o2Remaining, color: '#60a5fa', label: 'O₂' });
    if (co2Formed > 0.01)   bands.push({ vol: co2Formed,   color: '#94a3b8', label: 'CO₂' });
    totalVol = totalAfterCool;
  } else if (phase === 'absorb' && absorbStep === 1) {
    // After KOH — CO₂ gone
    bands = [];
    if (hcRemaining > 0.01) bands.push({ vol: hcRemaining, color: hc.color, label: hc.formula });
    if (o2Remaining > 0.01) bands.push({ vol: o2Remaining, color: '#60a5fa', label: 'O₂' });
    totalVol = volAfterKOH;
  } else if ((phase === 'absorb' && absorbStep >= 2) || phase === 'deduce') {
    // After pyrogallol — O₂ gone
    bands = [];
    if (hcRemaining > 0.01) bands.push({ vol: hcRemaining, color: hc.color, label: hc.formula });
    totalVol = volAfterPyrogallol;
  }

  // Layout bands from bottom up
  let cursorY = TUBE_BOT;
  const renderedBands = bands.map((b, idx) => {
    const h = volToHeight(b.vol);
    const y = cursorY - h;
    cursorY = y;
    return { ...b, y, h, idx };
  });

  // Water droplets in the reservoir if we've combusted
  const showWaterInReservoir = (phase === 'ignite' && ignited) || phase === 'absorb' || phase === 'deduce';

  return (
    <svg width="100%" height="100%" viewBox="0 0 360 580" style={{ minHeight: 520 }}>
      {/* Reservoir bowl */}
      <ellipse cx={TUBE_X + TUBE_W / 2} cy={RESERVOIR_BOT - 5} rx={120} ry={20} fill="#1e293b" stroke="rgba(148,163,184,0.5)" strokeWidth={1.5} />
      <path
        d={`M ${TUBE_X + TUBE_W / 2 - 120} ${RESERVOIR_BOT - 5}
            L ${TUBE_X + TUBE_W / 2 - 130} ${RESERVOIR_TOP + 10}
            Q ${TUBE_X + TUBE_W / 2 - 130} ${RESERVOIR_TOP} ${TUBE_X + TUBE_W / 2 - 110} ${RESERVOIR_TOP}
            L ${TUBE_X + TUBE_W / 2 + 110} ${RESERVOIR_TOP}
            Q ${TUBE_X + TUBE_W / 2 + 130} ${RESERVOIR_TOP} ${TUBE_X + TUBE_W / 2 + 130} ${RESERVOIR_TOP + 10}
            L ${TUBE_X + TUBE_W / 2 + 120} ${RESERVOIR_BOT - 5}`}
        fill="rgba(30,41,59,0.6)" stroke="rgba(148,163,184,0.3)" strokeWidth={1}
      />
      {/* Water level in reservoir */}
      <rect
        x={TUBE_X + TUBE_W / 2 - 125}
        y={RESERVOIR_TOP + 18}
        width={250}
        height={RESERVOIR_BOT - RESERVOIR_TOP - 23}
        fill="rgba(96,165,250,0.18)"
      />

      {/* Tube body */}
      <rect
        x={TUBE_X}
        y={TUBE_TOP - 5}
        width={TUBE_W}
        height={TUBE_BOT - TUBE_TOP + 5}
        rx={4}
        fill="rgba(15,23,42,0.6)"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth={1.5}
      />

      {/* Gradations */}
      {Array.from({ length: 11 }).map((_, i) => {
        const v = (i * MAX_VOL) / 10;
        const y = TUBE_BOT - volToHeight(v);
        return (
          <g key={i}>
            <line x1={TUBE_X} y1={y} x2={TUBE_X + 8} y2={y} stroke="rgba(148,163,184,0.4)" strokeWidth={1} />
            <text x={TUBE_X - 4} y={y + 3} textAnchor="end" fontSize={9} fill="#94a3b8" fontFamily="ui-monospace, monospace">
              {v}
            </text>
          </g>
        );
      })}

      {/* Gas bands */}
      {renderedBands.map((b) => (
        <g key={b.idx} className={phase === 'absorb' || (phase === 'ignite' && ignited) ? 'eud-rise-in' : ''}>
          <rect
            x={TUBE_X + 2}
            y={b.y}
            width={TUBE_W - 4}
            height={b.h}
            fill={b.color}
            opacity={0.65}
          />
          {b.h > 14 && (
            <text
              x={TUBE_X + TUBE_W / 2}
              y={b.y + b.h / 2 + 3}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="white"
            >
              {b.label} · {b.vol.toFixed(1)} mL
            </text>
          )}
        </g>
      ))}

      {/* Total volume readout, top */}
      <g>
        <rect x={TUBE_X + TUBE_W + 14} y={TUBE_TOP} width={110} height={50} rx={8} fill="rgba(15,23,42,0.7)" stroke="rgba(99,102,241,0.3)" />
        <text x={TUBE_X + TUBE_W + 22} y={TUBE_TOP + 18} fontSize={9} fontWeight={800} fill="#6366f1" letterSpacing={1.5}>
          TOTAL GAS
        </text>
        <text x={TUBE_X + TUBE_W + 22} y={TUBE_TOP + 38} fontSize={18} fontWeight={900} fill="#e2e8f0" fontFamily="ui-monospace, monospace">
          {totalVol.toFixed(1)} mL
        </text>
      </g>

      {/* Platinum electrodes + spark */}
      <line x1={TUBE_X + 20} y1={TUBE_TOP - 5} x2={TUBE_X + 25} y2={TUBE_TOP + 18} stroke="#cbd5e1" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={TUBE_X + TUBE_W - 20} y1={TUBE_TOP - 5} x2={TUBE_X + TUBE_W - 25} y2={TUBE_TOP + 18} stroke="#cbd5e1" strokeWidth={2.5} strokeLinecap="round" />
      {phase === 'ignite' && ignited && (
        <g className="eud-spark">
          <circle cx={TUBE_X + TUBE_W / 2} cy={TUBE_TOP + 22} r={8} fill="#fde047" opacity={0.6} />
          <circle cx={TUBE_X + TUBE_W / 2} cy={TUBE_TOP + 22} r={4} fill="#fef9c3" />
        </g>
      )}
      {phase === 'ignite' && ignited && (
        <rect
          className="eud-flash"
          x={TUBE_X + 2}
          y={TUBE_TOP - 3}
          width={TUBE_W - 4}
          height={TUBE_BOT - TUBE_TOP}
          fill="rgba(254,240,138,0.35)"
        />
      )}

      {/* Water droplets in reservoir after combustion */}
      {showWaterInReservoir && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={TUBE_X + TUBE_W / 2 - 80 + i * 36}
              cy={RESERVOIR_TOP + 28 + (i % 2) * 8}
              r={4}
              fill="#7dd3fc"
              opacity={0.7}
            />
          ))}
          <text x={TUBE_X + TUBE_W / 2} y={RESERVOIR_BOT + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#7dd3fc">
            H₂O condensed
          </text>
        </g>
      )}

      {/* Title above tube */}
      <text x={TUBE_X + TUBE_W / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={800} fill="#818cf8" letterSpacing={1.5}>
        EUDIOMETER TUBE
      </text>

      {/* Note: absorbent status indicator removed — duplicated in the sidebar.
          Keeps the SVG focused on the tube and gas-volume readout only. */}
    </svg>
  );
}

// ─── Setup panel ────────────────────────────────────────────────────────────
function SetupPanel(props: {
  hcId: HydrocarbonId;
  setHcId: (id: HydrocarbonId) => void;
  hcVol: number;
  setHcVol: (v: number) => void;
  o2Vol: number;
  setO2Vol: (v: number) => void;
  hc: typeof HYDROCARBONS[number];
  o2NeededForFullCombustion: number;
  o2IsLimiting: boolean;
}) {
  const { hcId, setHcId, hcVol, setHcVol, o2Vol, setO2Vol, hc, o2NeededForFullCombustion, o2IsLimiting } = props;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
        Setup the Experiment
      </h2>

      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#818cf8' }}>
          1. Pick a gas
        </p>
        <div className="grid grid-cols-2 gap-2">
          {HYDROCARBONS.map((h) => {
            const active = h.id === hcId;
            return (
              <button
                key={h.id}
                onClick={() => setHcId(h.id)}
                className="text-left px-3 py-2 rounded-lg transition-all"
                style={{
                  background: active ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <div className="text-sm font-bold" style={{ color: active ? '#c4b5fd' : '#94a3b8' }}>{h.name}</div>
                <div className="text-[10px] font-mono" style={{ color: active ? h.color : '#475569' }}>{h.formula}</div>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] mt-2 italic" style={{ color: '#64748b' }}>{hc.hint}</p>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#818cf8' }}>
            2. Volume of gas
          </p>
          <span className="text-sm font-bold font-mono" style={{ color: hc.color }}>{hcVol} mL</span>
        </div>
        <input
          type="range"
          min={5}
          max={20}
          step={1}
          value={hcVol}
          onChange={(e) => setHcVol(parseInt(e.target.value, 10))}
          className="w-full"
          style={{ accentColor: '#6366f1' }}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#818cf8' }}>
            3. Volume of O₂
          </p>
          <span className="text-sm font-bold font-mono" style={{ color: '#60a5fa' }}>{o2Vol} mL</span>
        </div>
        <input
          type="range"
          min={20}
          max={80}
          step={1}
          value={o2Vol}
          onChange={(e) => setO2Vol(parseInt(e.target.value, 10))}
          className="w-full"
          style={{ accentColor: '#60a5fa' }}
        />
        <p className="text-[10px] mt-1.5" style={{ color: o2IsLimiting ? '#fbbf24' : '#64748b' }}>
          {o2IsLimiting
            ? `⚠ O₂ is the limiting reagent — only ${o2Vol.toFixed(1)} mL out of ${o2NeededForFullCombustion.toFixed(1)} mL needed for complete combustion.`
            : `Excess O₂ — ${(o2Vol - o2NeededForFullCombustion).toFixed(1)} mL will remain unreacted.`}
        </p>
      </div>

      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Setup Tip</h5>
        <p className="text-white text-sm font-bold leading-tight italic">
          &ldquo;Use *excess* O₂ for cleanest results — the unreacted O₂ then shows up in the alkaline pyrogallol step.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ─── Ignite panel ───────────────────────────────────────────────────────────
function IgnitePanel(props: {
  hc: typeof HYDROCARBONS[number];
  hcVol: number;
  o2Vol: number;
  ignited: boolean;
  onIgnite: () => void;
  co2Formed: number;
  h2oFormed: number;
  o2Remaining: number;
  hcRemaining: number;
  o2IsLimiting: boolean;
}) {
  const { hc, hcVol, o2Vol, ignited, onIgnite, co2Formed, h2oFormed, o2Remaining, hcRemaining, o2IsLimiting } = props;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
        Fire the Spark
      </h2>

      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#818cf8' }}>
          The Reaction
        </p>
        <p className="text-white font-bold text-base leading-snug font-mono">
          {hc.id.startsWith('MYS') ? 'CₓHᵧ' : hc.formula} + (x + y/4) O₂ → x CO₂ + (y/2) H₂O
        </p>
        <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>
          A spark across the platinum electrodes ignites the gas mixture. After combustion, water condenses on the cool walls of the tube — its volume drops out of the gas count.
        </p>
      </div>

      {!ignited ? (
        <button
          onClick={onIgnite}
          className="px-5 py-3 rounded-lg text-base font-black uppercase tracking-wider transition-all"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            border: '1px solid rgba(251,191,36,0.5)',
            color: 'white',
            boxShadow: '0 0 20px rgba(239,68,68,0.3)',
          }}
        >
          ⚡ Fire Spark
        </button>
      ) : (
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>
            After Combustion
          </p>
          <div className="space-y-1.5 text-sm font-mono">
            <Row label={`${hc.id.startsWith('MYS') ? 'Unknown' : hc.formula} consumed`} value={`${(hcVol - hcRemaining).toFixed(2)} mL`} color={hc.color} />
            <Row label="O₂ consumed" value={`${(o2Vol - o2Remaining).toFixed(2)} mL`} color="#60a5fa" />
            <Row label="CO₂ formed" value={`${co2Formed.toFixed(2)} mL`} color="#94a3b8" />
            <Row label="H₂O formed (vapour)" value={`${h2oFormed.toFixed(2)} mL`} color="#7dd3fc" />
            {hcRemaining > 0.01 && <Row label={`${hc.formula} leftover`} value={`${hcRemaining.toFixed(2)} mL`} color="#fbbf24" />}
            {o2Remaining > 0.01 && <Row label="O₂ leftover" value={`${o2Remaining.toFixed(2)} mL`} color="#60a5fa" />}
          </div>
          {o2IsLimiting && (
            <p className="text-[11px] mt-2 italic" style={{ color: '#fbbf24' }}>
              O₂ ran out before all the hydrocarbon could burn. Add more O₂ in the setup phase for a clean experiment.
            </p>
          )}
        </div>
      )}

      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Why Platinum?</h5>
        <p className="text-white text-sm font-bold leading-tight italic">
          &ldquo;Platinum doesn't react with the gases or with combustion products. Any other metal would burn or oxidise and contaminate the result.&rdquo;
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span className="font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

// ─── Absorb panel ───────────────────────────────────────────────────────────
function AbsorbPanel(props: {
  absorbStep: number;
  setAbsorbStep: (n: number) => void;
  totalAfterCool: number;
  volAfterKOH: number;
  volAfterPyrogallol: number;
  co2Formed: number;
  o2Remaining: number;
  hcRemaining: number;
}) {
  const { absorbStep, setAbsorbStep, totalAfterCool, volAfterKOH, volAfterPyrogallol, co2Formed, o2Remaining, hcRemaining } = props;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
        Selective Absorption
      </h2>

      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#818cf8' }}>
          The Trick
        </p>
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          The tube now contains a mixture of CO₂, leftover O₂, and possibly leftover hydrocarbon. We can't tell them apart by looking — but each gas has its own selective absorbent. The **volume drop** after each absorbent step tells us how much of that gas was present.
        </p>
      </div>

      <div className="space-y-2">
        <AbsorbButton
          step={1}
          currentStep={absorbStep}
          onClick={() => setAbsorbStep(Math.max(absorbStep, 1))}
          label="Add KOH solution"
          target="CO₂"
          before={totalAfterCool}
          after={volAfterKOH}
          delta={co2Formed}
          color="#94a3b8"
        />
        <AbsorbButton
          step={2}
          currentStep={absorbStep}
          onClick={() => setAbsorbStep(Math.max(absorbStep, 2))}
          label="Add alkaline pyrogallol"
          target="O₂"
          before={volAfterKOH}
          after={volAfterPyrogallol}
          delta={o2Remaining}
          color="#60a5fa"
        />
      </div>

      {absorbStep >= 2 && (
        <div className="rounded-lg p-3" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#6ee7b7' }}>Final Reading</p>
          <p className="text-sm" style={{ color: '#a7f3d0' }}>
            Final gas volume: <span className="font-mono font-bold">{volAfterPyrogallol.toFixed(2)} mL</span>
            {hcRemaining > 0.01 ? ` (unreacted hydrocarbon — you used too little O₂!)` : ` (zero — everything absorbed)`}.
            Now use the volume drops in the Deduce step to find x and y.
          </p>
        </div>
      )}

      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Order Matters</h5>
        <p className="text-white text-sm font-bold leading-tight italic">
          &ldquo;Always absorb CO₂ before O₂. Pyrogallol absorbs both, but KOH is specific to CO₂ — so the first step is unambiguous.&rdquo;
        </p>
      </div>
    </div>
  );
}

function AbsorbButton({
  step, currentStep, onClick, label, target, before, after, delta, color,
}: {
  step: number; currentStep: number; onClick: () => void;
  label: string; target: string; before: number; after: number; delta: number; color: string;
}) {
  const done = currentStep >= step;
  const available = currentStep === step - 1;
  return (
    <button
      onClick={available ? onClick : undefined}
      disabled={!available}
      className="w-full text-left px-3 py-3 rounded-lg transition-all"
      style={{
        background: done ? 'rgba(52,211,153,0.08)' : available ? 'rgba(99,102,241,0.10)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${done ? 'rgba(52,211,153,0.25)' : available ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.05)'}`,
        cursor: available ? 'pointer' : 'default',
        opacity: !done && !available ? 0.5 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold" style={{ color: done ? '#6ee7b7' : available ? '#c4b5fd' : '#64748b' }}>
          {done ? '✓ ' : `${step}. `}{label}
        </span>
        <span className="text-[10px] font-mono font-bold" style={{ color }}>removes {target}</span>
      </div>
      {done && (
        <div className="text-xs font-mono" style={{ color: '#94a3b8' }}>
          {before.toFixed(2)} mL → {after.toFixed(2)} mL · drop = <span className="font-bold" style={{ color }}>{delta.toFixed(2)} mL of {target}</span>
        </div>
      )}
    </button>
  );
}

// ─── Deduce panel ───────────────────────────────────────────────────────────
function DeducePanel(props: {
  hc: typeof HYDROCARBONS[number];
  hcVol: number;
  o2Vol: number;
  co2Formed: number;
  o2Remaining: number;
  o2Consumed: number;
  guess: { x: number; y: number };
  setGuess: (g: { x: number; y: number }) => void;
  revealed: boolean;
  setRevealed: (v: boolean) => void;
}) {
  const { hc, hcVol, o2Vol, co2Formed, o2Consumed, guess, setGuess, revealed, setRevealed } = props;
  const xFromData = co2Formed / hcVol;
  const yFromData = 4 * (o2Consumed / hcVol - xFromData);
  const correct = guess.x === hc.x && guess.y === hc.y;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
        Deduce the Formula
      </h2>

      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#818cf8' }}>
          The data you collected
        </p>
        <div className="space-y-1.5 text-sm font-mono">
          <Row label="Hydrocarbon used" value={`${hcVol} mL`} color="#c4b5fd" />
          <Row label="O₂ consumed" value={`${o2Consumed.toFixed(2)} mL`} color="#60a5fa" />
          <Row label="CO₂ formed (from KOH)" value={`${co2Formed.toFixed(2)} mL`} color="#94a3b8" />
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>
          Apply the combustion ratio
        </p>
        <p className="text-sm font-mono" style={{ color: '#94a3b8' }}>
          CₓHᵧ + (x + y/4) O₂ → x CO₂ + (y/2) H₂O
        </p>
        <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>
          From CO₂: <span className="font-mono">x = {co2Formed.toFixed(2)} / {hcVol} = <span className="font-bold text-white">{xFromData.toFixed(2)}</span></span>
        </p>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          From O₂: <span className="font-mono">x + y/4 = {o2Consumed.toFixed(2)} / {hcVol} = <span className="font-bold text-white">{(o2Consumed / hcVol).toFixed(2)}</span></span>
        </p>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          ⇒ <span className="font-mono">y = 4 × ({(o2Consumed / hcVol).toFixed(2)} − {xFromData.toFixed(2)}) = <span className="font-bold text-white">{yFromData.toFixed(2)}</span></span>
        </p>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#818cf8' }}>
          Your answer
        </p>
        <div className="flex items-center gap-2">
          <span className="text-base text-white">C</span>
          <input
            type="number"
            min={1}
            max={8}
            value={guess.x}
            onChange={(e) => setGuess({ ...guess, x: parseInt(e.target.value || '0', 10) })}
            className="w-14 px-2 py-1.5 rounded-lg text-sm font-bold font-mono text-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
          />
          <span className="text-base text-white">H</span>
          <input
            type="number"
            min={1}
            max={20}
            value={guess.y}
            onChange={(e) => setGuess({ ...guess, y: parseInt(e.target.value || '0', 10) })}
            className="w-14 px-2 py-1.5 rounded-lg text-sm font-bold font-mono text-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
          />
          <button
            onClick={() => setRevealed(true)}
            className="ml-2 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: '#c4b5fd' }}
          >
            Check
          </button>
        </div>
      </div>

      {revealed && (
        <div
          className="rounded-lg p-3"
          style={{
            background: correct ? 'rgba(52,211,153,0.08)' : 'rgba(220,38,38,0.08)',
            border: `1px solid ${correct ? 'rgba(52,211,153,0.25)' : 'rgba(220,38,38,0.25)'}`,
          }}
        >
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: correct ? '#6ee7b7' : '#fca5a5' }}>
            {correct ? '✓ Correct!' : 'Not quite'}
          </p>
          <p className="text-sm" style={{ color: correct ? '#a7f3d0' : '#fecaca' }}>
            The hydrocarbon was <span className="font-bold font-mono">{hc.formula}</span> ({hc.name}). The combustion equation:
          </p>
          <p className="text-sm font-mono mt-1" style={{ color: '#e2e8f0' }}>
            {hc.formula} + {hc.x + hc.y / 4} O₂ → {hc.x} CO₂ + {hc.y / 2} H₂O
          </p>
        </div>
      )}

      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</h5>
        <p className="text-white text-sm font-bold leading-tight italic">
          &ldquo;In real JEE eudiometry problems, the H₂O term doesn't show up in volume measurements — but the *moles* of H₂O still matter, because they're how you derive y. Always work backwards from CO₂ to find x first, then use O₂ consumption to find y.&rdquo;
        </p>
      </div>
    </div>
  );
}
