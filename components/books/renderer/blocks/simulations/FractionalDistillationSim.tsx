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
// Wider viewBox for full-width layout: 0 0 720 580
const VBOX_W = 720;
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
        <svg width="100%" viewBox={`0 0 ${VBOX_W} 580`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="fd-tempGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"   stopColor="#ef4444" />
              <stop offset="45%"  stopColor="#f97316" />
              <stop offset="75%"  stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="fd-colBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(56,189,248,0.05)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.08)" />
            </linearGradient>
            <linearGradient id="fd-oilGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#92400e" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#451a03" stopOpacity={0.95} />
            </linearGradient>
          </defs>

          {/* ── Temperature bar ── */}
          <rect x={TB_X} y={CT} width={TB_W} height={COL_H}
            rx={7} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          <rect x={TB_X} y={CT} width={TB_W} height={COL_H}
            rx={7} fill="url(#fd-tempGrad)" opacity={0.8} />

          {/* Temp axis labels — LEFT of bar, no overlap */}
          <text x={TB_X - 6} y={CT - 4} textAnchor="end" fontSize={13}
            fill="#38bdf8" fontWeight="800">30°C</text>
          <text x={TB_X - 6} y={CB + 16} textAnchor="end" fontSize={13}
            fill="#ef4444" fontWeight="800">500°C</text>

          {/* TEMP vertical label */}
          <text x={12} y={CT + COL_H / 2} textAnchor="middle" fontSize={10}
            fill="#334155" fontWeight="700" letterSpacing={2}
            transform={`rotate(-90,12,${CT + COL_H / 2})`}>TEMP</text>

          {/* Tick marks at each fraction exit — labels LEFT of bar */}
          {FRACTIONS.map(f => (
            <g key={`tick-${f.id}`}>
              {/* Short tick from bar right edge toward column */}
              <line x1={TB_X + TB_W + 4} y1={f.yExit} x2={CL - 6} y2={f.yExit}
                stroke={f.color} strokeWidth={1.5} opacity={0.45} />
              {/* Label to the LEFT of the bar */}
              <text x={TB_X - 6} y={f.yExit + 5} textAnchor="end"
                fontSize={12} fill={f.color} fontWeight="700" opacity={0.85}>
                {tempAtY(f.yExit)}°
              </text>
            </g>
          ))}

          {/* ── Column body ── */}
          <rect x={CL} y={CT} width={CR - CL} height={COL_H}
            fill="url(#fd-colBg)"
            stroke="rgba(99,102,241,0.3)" strokeWidth={1.5} rx={2} />

          {/* Section bands */}
          {FRACTIONS.map((f, i) => {
            const yTop = i === 0 ? CT : FRACTIONS[i - 1].yExit;
            const yBot = f.yExit;
            const isSelected = f.id === selected;
            return (
              <rect key={`band-${f.id}`}
                x={CL + 1} y={yTop} width={CR - CL - 2} height={yBot - yTop}
                fill={f.color}
                opacity={isSelected ? 0.18 : 0.04}
                style={{ transition: 'opacity 0.3s', cursor: 'pointer' }}
                onClick={() => setSelected(f.id)} />
            );
          })}

          {/* Section divider dashes */}
          {FRACTIONS.slice(0, -1).map(f => (
            <line key={`div-${f.id}`}
              x1={CL} y1={f.yExit} x2={CR} y2={f.yExit}
              stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="4 3" />
          ))}

          {/* Crude oil pool */}
          <rect x={CL + 2} y={CB - 44} width={CR - CL - 4} height={44}
            fill="url(#fd-oilGrad)" rx={2} />
          <text x={CX} y={CB - 18} textAnchor="middle" fontSize={12}
            fill="#d97706" opacity={0.85} fontWeight="700">crude oil</text>

          {/* Column glow when running */}
          {running && (
            <rect x={CL} y={CT} width={CR - CL} height={COL_H}
              fill="none" stroke={sel.color} strokeWidth={1.5} rx={2}
              className="fd-col-glow" />
          )}

          {/* Rising particles */}
          {FRACTIONS.map(f => (
            <FractionParticles key={f.id} f={f} running={running} />
          ))}

          {/* ── Column top cap ── */}
          <rect x={CL - 6} y={CT - 10} width={CR - CL + 12} height={10}
            fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.3)" strokeWidth={1} rx={2} />
          <line x1={CX - 28} y1={CT - 10} x2={CX - 28} y2={CT - 36}
            stroke="rgba(99,102,241,0.35)" strokeWidth={3} />
          <text x={CX - 28} y={CT - 42} textAnchor="middle" fontSize={11} fill="#475569">uncond.</text>

          {/* ── Collection arms + labels ── */}
          {FRACTIONS.map(f => {
            const isSelected = f.id === selected;
            const armEnd = CR + 90;
            return (
              <g key={`arm-${f.id}`} style={{ cursor: 'pointer' }} onClick={() => setSelected(f.id)}>
                {/* Pipe */}
                <line x1={CR} y1={f.yExit} x2={armEnd} y2={f.yExit}
                  stroke={isSelected ? f.color : 'rgba(255,255,255,0.12)'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  style={{ transition: 'all 0.3s' }} />
                {/* Dot */}
                <circle cx={armEnd + 6} cy={f.yExit} r={6}
                  fill={isSelected ? f.color : 'rgba(255,255,255,0.1)'}
                  style={{ transition: 'all 0.3s' }} />
                {/* Drip when running */}
                {running && (
                  <circle cx={armEnd + 6} cy={f.yExit} r={4} fill={f.color}>
                    <animate attributeName="cy" from={f.yExit} to={f.yExit + 16}
                      dur="0.9s" begin={`${FRACTIONS.indexOf(f) * 0.25}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.75;0"
                      dur="0.9s" begin={`${FRACTIONS.indexOf(f) * 0.25}s`} repeatCount="indefinite" />
                  </circle>
                )}
                {/* Name */}
                <text x={armEnd + 18} y={f.yExit - 5}
                  fontSize={13} fontWeight={isSelected ? '800' : '600'}
                  fill={isSelected ? f.color : '#64748b'}
                  style={{ transition: 'all 0.3s' }}>
                  {f.name}
                </text>
                {/* BP + formula */}
                <text x={armEnd + 18} y={f.yExit + 11}
                  fontSize={11} fill={isSelected ? f.color : '#475569'} opacity={0.85}
                  style={{ transition: 'all 0.3s' }}>
                  {f.bp} · {f.formula}
                </text>
              </g>
            );
          })}

          {/* ── Bottom boiler ── */}
          <rect x={CL + 8} y={CB} width={CR - CL - 16} height={32}
            fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.25)" strokeWidth={1.5} rx={4} />

          {/* ── Flames ── */}
          {running ? (
            [{ x: CX - 28, h: 22 }, { x: CX, h: 30 }, { x: CX + 28, h: 22 }].map((fl, i) => (
              <g key={i} className="fd-flame">
                <ellipse cx={fl.x} cy={CB + 48} rx={8} ry={fl.h / 2}
                  fill={i === 1 ? '#fbbf24' : '#f97316'} opacity={0.75} />
                <ellipse cx={fl.x} cy={CB + 48 + fl.h / 4} rx={4} ry={fl.h / 4}
                  fill="white" opacity={0.55} />
              </g>
            ))
          ) : (
            <text x={CX} y={CB + 46} textAnchor="middle" fontSize={11} fill="#334155">
              press Start ↓
            </text>
          )}
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
