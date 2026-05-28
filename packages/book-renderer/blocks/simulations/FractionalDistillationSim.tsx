'use client';

/**
 * Fractional Distillation Column Simulator
 * Academic source: NCERT Class 11, Chapter 12 — Organic Chemistry: Some Basic Principles and Techniques
 * Fraction boiling-point ranges: standard petroleum chemistry (IUPAC / NCERT references).
 */

import { useState } from 'react';

// ── Fraction data ─────────────────────────────────────────────────────────────
const FRACTIONS = [
  {
    id: 'lpg',
    name: 'LPG / Refinery Gas',
    formula: 'C₁–C₄',
    bp: '< 30 °C',
    color: '#7dd3fc',
    yExit: 108,
    uses: 'Cooking gas, domestic heating, aerosol propellant',
    note: 'Lightest fraction — rises all the way to the top before condensing. Exits as a gas at room temperature.',
  },
  {
    id: 'petrol',
    name: 'Petrol (Gasoline)',
    formula: 'C₅–C₁₂',
    bp: '40–200 °C',
    color: '#34d399',
    yExit: 188,
    uses: 'Petrol engines, dry-cleaning solvent, lighter fluid',
    note: 'Second lightest — condenses just below the gas outlet after the LPG fraction exits.',
  },
  {
    id: 'kerosene',
    name: 'Kerosene / Jet Fuel',
    formula: 'C₁₂–C₁₆',
    bp: '150–270 °C',
    color: '#fbbf24',
    yExit: 268,
    uses: 'Aviation fuel (Jet A-1), kerosene lamps, stove fuel',
    note: 'Mid-column — needs a higher temperature to vaporise, so condenses at a lower height.',
  },
  {
    id: 'diesel',
    name: 'Diesel Oil',
    formula: 'C₁₅–C₂₀',
    bp: '250–350 °C',
    color: '#fb923c',
    yExit: 348,
    uses: 'Diesel engines, power generators, heating oil',
    note: 'Heavy fraction — vapours barely rise one-third of the way up before condensing.',
  },
  {
    id: 'luboil',
    name: 'Lubricating Oil & Wax',
    formula: 'C₂₀–C₅₀',
    bp: '300–400 °C',
    color: '#a78bfa',
    yExit: 428,
    uses: 'Machine lubricants, grease, paraffin wax, candles',
    note: 'Very high boiling point — barely vaporises before condensing back near the bottom.',
  },
  {
    id: 'bitumen',
    name: 'Bitumen (Residue)',
    formula: 'C₅₀+',
    bp: '> 400 °C',
    color: '#94a3b8',
    yExit: 500,
    uses: 'Road surfacing (asphalt), waterproofing, roofing felt',
    note: 'Never fully vaporises — remains as viscous residue and is drained from the bottom of the column.',
  },
] as const;

type FractionId = typeof FRACTIONS[number]['id'];

// ── SVG layout constants ──────────────────────────────────────────────────────
// Content lives in coords 0..720. The viewBox is offset left by VBOX_X so the
// temperature labels on the far left (which use textAnchor="end" and extend
// leftward from x≈29) have headroom and aren't clipped by the parent's
// overflow-hidden. Effect on render: sim shrinks slightly + shifts to the right.
const VBOX_W = 720;
const VBOX_X = -40;
const VBOX_VIEW_W = VBOX_W - VBOX_X; // 760
const CL  = 200;   // column left x
const CR  = 390;   // column right x  (wider column)
const CX  = (CL + CR) / 2;  // = 295
const CT  = 68;
const CB  = 520;
const COL_H = CB - CT;  // 452

// Temperature bar at x=50-64
const TB_CX = 42;   // temp bar centre
const TB_X  = TB_CX - 7;
const TB_W  = 14;

// ── CSS animations ────────────────────────────────────────────────────────────
const ANIM = `
  @keyframes fdFlicker {
    0%,100% { opacity:.55; transform:scaleY(1); }
    50%      { opacity:1;   transform:scaleY(1.3); }
  }
  @keyframes fdGlowPulse {
    0%,100% { opacity:.18; }
    50%     { opacity:.38; }
  }
  .fd-flame     { animation: fdFlicker 0.38s ease-in-out infinite; transform-origin: 50% 100%; }
  .fd-col-glow  { animation: fdGlowPulse 2s ease-in-out infinite; }
`;

function tempAtY(y: number): number {
  const ratio = (y - CT) / COL_H;
  return Math.round(30 + ratio * 470);
}

function riseDuration(yExit: number): number {
  return 1.8 + ((CB - yExit) / COL_H) * 3.2;
}

// ── Particles ─────────────────────────────────────────────────────────────────
function FractionParticles({ f, running }: { f: typeof FRACTIONS[number]; running: boolean }) {
  if (!running) return null;
  const dur = riseDuration(f.yExit);
  const xOffsets = [-22, -8, 8, 22];
  const delayStep = dur / xOffsets.length;
  return (
    <>
      {xOffsets.map((dx, i) => (
        <circle key={i} cx={CX + dx} cy={CB - 8} r={5} fill={f.color}>
          <animate attributeName="cy" from={CB - 8} to={f.yExit + 4}
            dur={`${dur}s`} begin={`${i * delayStep}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.85;0.85;0"
            keyTimes="0;0.06;0.88;1"
            dur={`${dur}s`} begin={`${i * delayStep}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="5;6.5;4;5"
            keyTimes="0;0.3;0.8;1"
            dur={`${dur}s`} begin={`${i * delayStep}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FractionalDistillationSim() {
  const [selected, setSelected] = useState<FractionId>('lpg');
  const [running, setRunning] = useState(false);
  const sel = FRACTIONS.find(f => f.id === selected)!;

  return (
    <div style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16 }}
      className="p-4 md:p-6 not-prose">
      <style>{ANIM}</style>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Fractional <span style={{ color: '#7c3aed' }}>Distillation</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: '#475569' }}>
            Crude Oil Column Simulator · Click any fraction to inspect
          </p>
        </div>
        {/* Start/Stop */}
        <button onClick={() => setRunning(r => !r)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shrink-0"
          style={{
            background: running ? 'rgba(239,68,68,0.13)' : 'rgba(99,102,241,0.18)',
            border: `1px solid ${running ? 'rgba(239,68,68,0.4)' : 'rgba(129,140,248,0.4)'}`,
            color: running ? '#f87171' : '#c4b5fd',
          }}>
          {running ? '⏹ Stop Heating' : '🔥 Start Separation'}
        </button>
      </div>

      {/* ── Full-width Column SVG ───────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden w-full"
        style={{
          background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}>
        <svg width="100%" viewBox={`${VBOX_X} 0 ${VBOX_VIEW_W} 600`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="fd-tempGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"   stopColor="#ef4444" />
              <stop offset="45%"  stopColor="#f97316" />
              <stop offset="75%"  stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Steel-clad column gradient — bright vertical highlight on left
                edge, mid-tone darker centre, soft shadow on right.
                Read together they give the column a curved, cylindrical look
                instead of reading as a flat rectangle. */}
            <linearGradient id="fd-colShell" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="rgba(186,210,232,0.55)" />
              <stop offset="18%"  stopColor="rgba(120,148,180,0.30)" />
              <stop offset="55%"  stopColor="rgba(60,80,110,0.45)" />
              <stop offset="85%"  stopColor="rgba(40,55,80,0.60)" />
              <stop offset="100%" stopColor="rgba(20,30,48,0.75)" />
            </linearGradient>

            {/* Inside of the column — vertical hot→cool gradient mirroring
                temperature axis (hot orange at the bottom, cooler blue up top). */}
            <linearGradient id="fd-colInside" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(56,189,248,0.10)" />
              <stop offset="50%"  stopColor="rgba(251,191,36,0.08)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.18)" />
            </linearGradient>

            {/* Bubble-cap tray — short metal cylinder with a domed top.
                In a real fractionating column, vapours bubble up through
                liquid pooled on each tray and partially condense there. */}
            <linearGradient id="fd-tray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(203,213,225,0.55)" />
              <stop offset="50%"  stopColor="rgba(148,163,184,0.35)" />
              <stop offset="100%" stopColor="rgba(100,116,139,0.55)" />
            </linearGradient>

            {/* Crude oil — dark amber→black gradient */}
            <linearGradient id="fd-oilGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#92400e" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#451a03" stopOpacity={0.95} />
            </linearGradient>

            {/* Furnace brick housing — warm dark gradient */}
            <linearGradient id="fd-furnace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3a1d12" />
              <stop offset="100%" stopColor="#1a0a06" />
            </linearGradient>

            {/* Receiver flask — cool glass */}
            <linearGradient id="fd-flask" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="rgba(186,214,236,0.45)" />
              <stop offset="50%"  stopColor="rgba(120,160,200,0.10)" />
              <stop offset="100%" stopColor="rgba(80,130,180,0.30)" />
            </linearGradient>
          </defs>

          {/* ══════════════════ TEMPERATURE BAR (LEFT AXIS) ══════════════════ */}
          <rect x={TB_X} y={CT} width={TB_W} height={COL_H}
            rx={7} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          <rect x={TB_X} y={CT} width={TB_W} height={COL_H}
            rx={7} fill="url(#fd-tempGrad)" opacity={0.8} />

          <text x={TB_X - 6} y={CT - 4} textAnchor="end" fontSize={13}
            fill="#38bdf8" fontWeight="800">30°C</text>
          <text x={TB_X - 6} y={CB + 16} textAnchor="end" fontSize={13}
            fill="#ef4444" fontWeight="800">500°C</text>

          <text x={12} y={CT + COL_H / 2} textAnchor="middle" fontSize={10}
            fill="#334155" fontWeight="700" letterSpacing={2}
            transform={`rotate(-90,12,${CT + COL_H / 2})`}>TEMP</text>

          {FRACTIONS.map(f => (
            <g key={`tick-${f.id}`}>
              <line x1={TB_X + TB_W + 4} y1={f.yExit} x2={CL - 14} y2={f.yExit}
                stroke={f.color} strokeWidth={1.5} opacity={0.45} />
              <text x={TB_X - 6} y={f.yExit + 5} textAnchor="end"
                fontSize={12} fill={f.color} fontWeight="700" opacity={0.85}>
                {tempAtY(f.yExit)}°
              </text>
            </g>
          ))}

          {/* ══════════════════ FURNACE + REBOILER (BOTTOM) ══════════════════ */}
          {/* Furnace housing — a brick block enclosing the crude-oil chamber
              and the flames. This is what students see in industrial photos. */}
          <rect x={CL - 18} y={CB - 6} width={(CR - CL) + 36} height={64} rx={3}
            fill="url(#fd-furnace)" stroke="rgba(60,40,30,0.85)" strokeWidth={1.5} />
          {/* Brick line texture */}
          {[14, 30, 46].map((dy, i) => (
            <line key={i} x1={CL - 16} y1={CB - 6 + dy} x2={CR + 16} y2={CB - 6 + dy}
              stroke="rgba(70,40,25,0.55)" strokeWidth={0.6} />
          ))}
          {/* Furnace label */}
          <text x={CR + 22} y={CB + 36} fontSize={9} fill="#78350f"
            fontWeight="800" letterSpacing={1}>FURNACE</text>

          {/* Reboiler / crude-oil chamber — dark window in the furnace */}
          <rect x={CL + 4} y={CB + 6} width={(CR - CL) - 8} height={26} rx={2}
            fill="url(#fd-oilGrad)" stroke="rgba(146,64,14,0.55)" strokeWidth={0.8} />
          <text x={CX} y={CB + 23} textAnchor="middle" fontSize={11}
            fill="#fbbf24" opacity={0.85} fontWeight="700" letterSpacing={0.5}>
            crude oil
          </text>

          {/* Flames inside the furnace (running) — multi-tier flicker */}
          {running ? (
            [{ x: CX - 36, h: 14 }, { x: CX - 12, h: 18 }, { x: CX + 12, h: 18 }, { x: CX + 36, h: 14 }].map((fl, i) => (
              <g key={i} className="fd-flame">
                <ellipse cx={fl.x} cy={CB + 50} rx={7} ry={fl.h / 2}
                  fill={i % 2 === 1 ? '#fbbf24' : '#f97316'} opacity={0.85} />
                <ellipse cx={fl.x} cy={CB + 50 + fl.h / 4} rx={3} ry={fl.h / 4}
                  fill="white" opacity={0.6} />
              </g>
            ))
          ) : (
            <text x={CX} y={CB + 50} textAnchor="middle" fontSize={10}
              fill="#475569" fontWeight="700" letterSpacing={0.8}>
              ↑ press Start to ignite ↑
            </text>
          )}

          {/* ══════════════════ COLUMN SHELL (CYLINDRICAL) ══════════════════ */}

          {/* Column inside — vertical hot→cool gradient (drawn first, behind
              the shell strokes and trays) */}
          <rect x={CL} y={CT} width={CR - CL} height={COL_H}
            fill="url(#fd-colInside)" />

          {/* Click-zones for section selection (transparent overlays) */}
          {FRACTIONS.map((f, i) => {
            const yTop = i === 0 ? CT : FRACTIONS[i - 1].yExit;
            const yBot = f.yExit;
            const isSelected = f.id === selected;
            return (
              <rect key={`band-${f.id}`}
                x={CL + 1} y={yTop} width={CR - CL - 2} height={yBot - yTop}
                fill={f.color}
                opacity={isSelected ? 0.18 : 0.03}
                style={{ transition: 'opacity 0.3s', cursor: 'pointer' }}
                onClick={() => setSelected(f.id)} />
            );
          })}

          {/* Rising vapour particles — drawn before trays so trays sit on top */}
          {FRACTIONS.map(f => (
            <FractionParticles key={f.id} f={f} running={running} />
          ))}

          {/* Bubble-cap trays at each fraction's exit height — the defining
              internal hardware of a fractionating column. Each tray has a
              base plate + a small dome on top representing the bubble caps. */}
          {FRACTIONS.slice(0, -1).map(f => {
            const isSelected = f.id === selected;
            return (
              <g key={`tray-${f.id}`}>
                {/* Tray plate (full width) */}
                <rect x={CL + 1} y={f.yExit - 4} width={CR - CL - 2} height={5} rx={1}
                  fill="url(#fd-tray)"
                  stroke={isSelected ? f.color : 'rgba(100,116,139,0.55)'}
                  strokeWidth={isSelected ? 1.1 : 0.7}
                  style={{ transition: 'all 0.3s' }} />
                {/* Liquid pool on tray (slight horizontal blue line) */}
                <line x1={CL + 4} y1={f.yExit - 3.5} x2={CR - 4} y2={f.yExit - 3.5}
                  stroke="rgba(125,211,252,0.35)" strokeWidth={0.7} />
                {/* Three bubble caps standing on the tray */}
                {[-32, 0, 32].map((dx, i) => (
                  <g key={i}>
                    {/* Cap dome */}
                    <ellipse cx={CX + dx} cy={f.yExit - 8} rx={6} ry={4}
                      fill="rgba(148,163,184,0.65)" stroke="rgba(100,116,139,0.7)" strokeWidth={0.6} />
                    {/* Cap stem (vapour riser) */}
                    <rect x={CX + dx - 1.5} y={f.yExit - 4} width={3} height={4}
                      fill="rgba(71,85,105,0.7)" />
                  </g>
                ))}
              </g>
            );
          })}

          {/* Column outer shell — drawn LAST so the cylindrical highlight reads
              over everything inside. Stroked + filled with the steel gradient. */}
          <rect x={CL} y={CT} width={CR - CL} height={COL_H}
            fill="url(#fd-colShell)" opacity={0.45}
            stroke="rgba(120,150,185,0.55)" strokeWidth={1.5} />

          {/* Left gloss highlight — bright vertical line at left edge */}
          <line x1={CL + 2.5} y1={CT + 4} x2={CL + 2.5} y2={CB - 4}
            stroke="rgba(255,255,255,0.40)" strokeWidth={1.6} strokeLinecap="round" />
          <line x1={CL + 6} y1={CT + 10} x2={CL + 6} y2={CB - 10}
            stroke="rgba(255,255,255,0.12)" strokeWidth={0.7} strokeLinecap="round" />
          {/* Right shadow */}
          <line x1={CR - 2.5} y1={CT + 4} x2={CR - 2.5} y2={CB - 4}
            stroke="rgba(0,0,0,0.45)" strokeWidth={1.4} strokeLinecap="round" />

          {/* Selected-fraction glow */}
          {running && (
            <rect x={CL} y={CT} width={CR - CL} height={COL_H}
              fill="none" stroke={sel.color} strokeWidth={1.5}
              className="fd-col-glow" />
          )}

          {/* ══════════════════ DOME CAP + VAPOUR OUTLET ══════════════════ */}

          {/* Dome cap (top of column) — half-ellipse on top of the shell */}
          <path d={`M ${CL - 4} ${CT + 4}
                    Q ${CL - 4} ${CT - 24} ${CX} ${CT - 26}
                    Q ${CR + 4} ${CT - 24} ${CR + 4} ${CT + 4} Z`}
            fill="url(#fd-colShell)" opacity={0.7}
            stroke="rgba(120,150,185,0.6)" strokeWidth={1.2} strokeLinejoin="round" />
          {/* Dome highlight */}
          <path d={`M ${CL + 4} ${CT}
                    Q ${CL + 6} ${CT - 18} ${CX - 12} ${CT - 22}`}
            fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth={1.2} strokeLinecap="round" />

          {/* Vapour outlet — pipe rising from dome, curving over to the right
              (towards an overhead condenser, conceptually). */}
          <path d={`M ${CX} ${CT - 26} L ${CX} ${CT - 44} L ${CX + 60} ${CT - 44}`}
            fill="none" stroke="rgba(120,150,185,0.65)" strokeWidth={7}
            strokeLinejoin="round" strokeLinecap="round" />
          <path d={`M ${CX} ${CT - 26} L ${CX} ${CT - 44} L ${CX + 60} ${CT - 44}`}
            fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={2.2}
            strokeLinejoin="round" strokeLinecap="round" />
          <text x={CX + 68} y={CT - 40} fontSize={10}
            fill="#475569" fontWeight="700" letterSpacing={0.5}>→ overhead condenser</text>
          <text x={CX + 68} y={CT - 28} fontSize={9}
            fill="#334155">(uncondensed gas)</text>

          {/* ══════════════════ COLLECTION ARMS + RECEIVER FLASKS ══════════════════ */}

          {FRACTIONS.map(f => {
            const isSelected = f.id === selected;
            const pipeEnd = CR + 60;
            const condX  = pipeEnd + 6;
            const flaskCX = condX + 28;
            const flaskTop = f.yExit - 4;
            const flaskBot = f.yExit + 18;
            return (
              <g key={`arm-${f.id}`} style={{ cursor: 'pointer' }} onClick={() => setSelected(f.id)}>
                {/* Side-draw pipe — thick metal */}
                <line x1={CR} y1={f.yExit} x2={pipeEnd} y2={f.yExit}
                  stroke={isSelected ? f.color : 'rgba(148,163,184,0.30)'}
                  strokeWidth={isSelected ? 5 : 4}
                  strokeLinecap="round"
                  style={{ transition: 'all 0.3s' }} />
                {/* Pipe highlight */}
                <line x1={CR} y1={f.yExit - 1.4} x2={pipeEnd} y2={f.yExit - 1.4}
                  stroke="rgba(255,255,255,0.25)" strokeWidth={1} strokeLinecap="round" />

                {/* Small condenser bump — short cylinder around the pipe.
                    Represents a heat exchanger that condenses the vapour
                    before it reaches the receiver flask. */}
                <rect x={pipeEnd - 6} y={f.yExit - 5} width={16} height={10} rx={2}
                  fill="rgba(125,211,252,0.18)" stroke="rgba(125,211,252,0.45)" strokeWidth={0.8} />
                <line x1={pipeEnd - 4} y1={f.yExit - 2} x2={pipeEnd + 8} y2={f.yExit - 2}
                  stroke="rgba(125,211,252,0.55)" strokeWidth={0.5} />

                {/* Receiver flask (Erlenmeyer / conical) — small glass flask
                    catching the eluted fraction. Tinted with fraction colour. */}
                <path d={`M ${flaskCX - 4} ${flaskTop}
                          L ${flaskCX - 4} ${flaskTop + 4}
                          L ${flaskCX - 12} ${flaskBot - 2}
                          Q ${flaskCX - 12} ${flaskBot} ${flaskCX - 10} ${flaskBot}
                          L ${flaskCX + 10} ${flaskBot}
                          Q ${flaskCX + 12} ${flaskBot} ${flaskCX + 12} ${flaskBot - 2}
                          L ${flaskCX + 4} ${flaskTop + 4}
                          L ${flaskCX + 4} ${flaskTop} Z`}
                  fill="url(#fd-flask)"
                  stroke={isSelected ? f.color : 'rgba(148,163,184,0.5)'}
                  strokeWidth={isSelected ? 1.2 : 0.9}
                  style={{ transition: 'all 0.3s' }} />
                {/* Fraction colour pooling at the bottom of the flask */}
                <path d={`M ${flaskCX - 10.5} ${flaskBot - 6}
                          L ${flaskCX - 11.5} ${flaskBot - 1}
                          Q ${flaskCX - 11.5} ${flaskBot - 0.5} ${flaskCX - 10} ${flaskBot - 0.5}
                          L ${flaskCX + 10} ${flaskBot - 0.5}
                          Q ${flaskCX + 11.5} ${flaskBot - 0.5} ${flaskCX + 11.5} ${flaskBot - 1}
                          L ${flaskCX + 10.5} ${flaskBot - 6} Z`}
                  fill={f.color} opacity={0.55} />

                {/* Drip from pipe into flask when running */}
                {running && (
                  <circle cx={pipeEnd + 14} cy={f.yExit} r={3} fill={f.color}>
                    <animate attributeName="cy" from={f.yExit} to={flaskBot - 6}
                      dur="0.9s" begin={`${FRACTIONS.indexOf(f) * 0.25}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.85;0.85;0"
                      keyTimes="0;0.6;1"
                      dur="0.9s" begin={`${FRACTIONS.indexOf(f) * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                )}

                {/* Name + BP */}
                <text x={flaskCX + 22} y={f.yExit - 4}
                  fontSize={13} fontWeight={isSelected ? '800' : '600'}
                  fill={isSelected ? f.color : '#64748b'}
                  style={{ transition: 'all 0.3s' }}>
                  {f.name}
                </text>
                <text x={flaskCX + 22} y={f.yExit + 11}
                  fontSize={11} fill={isSelected ? f.color : '#475569'} opacity={0.85}
                  style={{ transition: 'all 0.3s' }}>
                  {f.bp} · {f.formula}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Detail panel below simulation ──────────────────────────────── */}
      <div className="mt-4">
        {/* Fraction pill selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FRACTIONS.map(f => (
            <button key={f.id} onClick={() => setSelected(f.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                background: selected === f.id ? `${f.color}18` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selected === f.id ? `${f.color}50` : 'rgba(255,255,255,0.08)'}`,
                color: selected === f.id ? f.color : '#64748b',
              }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f.color }} />
              {f.name}
              <span className="text-[11px] opacity-70">{f.bp}</span>
            </button>
          ))}
        </div>

        {/* Selected fraction detail */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 p-4 rounded-xl"
          style={{ background: `${sel.color}08`, border: `1px solid ${sel.color}25` }}>
          {/* Left: identity */}
          <div className="flex flex-col gap-2 min-w-[160px]">
            <h3 className="text-lg font-black text-white leading-tight">{sel.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[12px] font-black px-2 py-0.5 rounded-full"
                style={{ background: `${sel.color}20`, color: sel.color, border: `1px solid ${sel.color}40` }}>
                {sel.formula}
              </span>
              <span className="text-[12px] font-black px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                {sel.bp}
              </span>
              <span className="text-[12px] font-black px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }}>
                {tempAtY(sel.yExit)} °C zone
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch"
            style={{ background: `${sel.color}20` }} />

          {/* Right: uses + note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#475569' }}>
                Uses
              </p>
              <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>{sel.uses}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#475569' }}>
                Why this height?
              </p>
              <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>{sel.note}</p>
            </div>
          </div>
        </div>

        {/* Expert Tip */}
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-black uppercase tracking-widest mr-2"
            style={{ color: '#6366f1' }}>Expert Tip</span>
          <span className="text-sm font-bold text-white italic">
            &ldquo;Lower boiling point = rises higher. The column is a continuous thermometer — each level is a different temperature.&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
}
