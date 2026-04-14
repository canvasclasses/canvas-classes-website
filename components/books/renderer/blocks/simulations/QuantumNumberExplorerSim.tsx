'use client';

// Quantum Number Explorer
// Students select values for n, l, mₗ, mₛ and see real-time validation,
// orbital designation, node counts, and their position in the Aufbau diagram.
//
// Academic source: NCERT Chemistry Class 11, Chapter 2 — Structure of Atom
// Section 2.6 — Quantum Mechanical Model of Atom
// Rules:
//   n = 1,2,3,...             (principal quantum number — shell)
//   l = 0,1,...,n−1           (azimuthal — subshell shape)
//   mₗ = −l,...,0,...,+l      (magnetic — orbital orientation)
//   mₛ = +½ or −½            (spin)

import { useState } from 'react';

/* ── Constants ──────────────────────────────────────────────────────────── */

const L_LABELS = ['s', 'p', 'd', 'f'] as const;
const L_SHAPES = ['Spherical', 'Dumbbell', 'Double dumbbell', 'Complex'] as const;

const QN = {
  n:  { color: '#818cf8', label: 'n',  name: 'Principal' },
  l:  { color: '#34d399', label: 'l',  name: 'Azimuthal' },
  ml: { color: '#fbbf24', label: 'mₗ', name: 'Magnetic' },
  ms: { color: '#f472b6', label: 'mₛ', name: 'Spin' },
} as const;

const SUB_COLORS: Record<string, string> = {
  s: '#818cf8', p: '#34d399', d: '#fbbf24', f: '#f472b6',
};

// Aufbau filling order — (n+l) rule; same n+l → lower n first
// Source: NCERT Section 2.6.5 — Aufbau Principle
const AUFBAU = [
  { n: 1, l: 0 }, { n: 2, l: 0 }, { n: 2, l: 1 }, { n: 3, l: 0 },
  { n: 3, l: 1 }, { n: 4, l: 0 }, { n: 3, l: 2 }, { n: 4, l: 1 },
  { n: 4, l: 2 }, { n: 4, l: 3 },
];

interface Preset { label: string; n: number; l: number; ml: number; ms: number }
const PRESETS: Preset[] = [
  { label: '1s ↑',              n: 1, l: 0, ml: 0,  ms: 0.5  },
  { label: '2p₋₁',             n: 2, l: 1, ml: -1, ms: 0.5  },
  { label: '3d₀',              n: 3, l: 2, ml: 0,  ms: -0.5 },
  { label: '4s ↑',              n: 4, l: 0, ml: 0,  ms: 0.5  },
  { label: '✗ n=2, l=2',       n: 2, l: 2, ml: 0,  ms: 0.5  },
  { label: '✗ n=3, l=1, mₗ=2', n: 3, l: 1, ml: 2,  ms: 0.5  },
];

/* ── Validation ─────────────────────────────────────────────────────────── */

function validate(n: number, l: number, ml: number) {
  const errors: string[] = [];
  // Source: NCERT Section 2.6.2 — l ranges from 0 to n−1
  if (l >= n)
    errors.push(`l = ${l} is not allowed when n = ${n}. The azimuthal quantum number must satisfy 0 ≤ l ≤ n−1, so l can only be 0 to ${n - 1}.`);
  // Source: NCERT Section 2.6.3 — mₗ ranges from −l to +l
  if (Math.abs(ml) > l)
    errors.push(`mₗ = ${ml > 0 ? '+' : ''}${ml} is not allowed when l = ${l}. The magnetic quantum number must satisfy −l ≤ mₗ ≤ +l${l === 0 ? ', so mₗ can only be 0' : `, so mₗ can be −${l} to +${l}`}.`);
  return { valid: errors.length === 0, errors };
}

/* ── Schematic orbital shape preview ────────────────────────────────────── */

function OrbitalPreview({ l }: { l: number }) {
  const s = 96, c = s / 2;
  const pos = SUB_COLORS[L_LABELS[l]] ?? '#818cf8';
  const neg = '#ef4444';

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {/* nucleus dot */}
      <circle cx={c} cy={c} r={2.5} fill="#e2e8f0" />

      {l === 0 && (
        <circle cx={c} cy={c} r={32} fill={`${pos}18`} stroke={pos}
          strokeWidth={1.5} />
      )}

      {l === 1 && (<>
        <ellipse cx={c} cy={c - 18} rx={15} ry={26}
          fill={`${pos}20`} stroke={pos} strokeWidth={1.5} />
        <ellipse cx={c} cy={c + 18} rx={15} ry={26}
          fill={`${neg}15`} stroke={neg} strokeWidth={1.5} />
        {/* nodal plane */}
        <line x1={c - 26} y1={c} x2={c + 26} y2={c}
          stroke={neg} strokeWidth={0.8} strokeDasharray="3,3" opacity={0.5} />
      </>)}

      {l === 2 && (<>
        {/* four-leaf clover (dxy-style) */}
        {[45, 135, 225, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const lx = c + Math.cos(rad) * 19;
          const ly = c + Math.sin(rad) * 19;
          return (
            <ellipse key={deg} cx={lx} cy={ly} rx={10} ry={19}
              transform={`rotate(${deg} ${lx} ${ly})`}
              fill={i % 2 === 0 ? `${pos}18` : `${neg}12`}
              stroke={i % 2 === 0 ? pos : neg} strokeWidth={1.2} />
          );
        })}
      </>)}

      {l === 3 && (<>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const lx = c + Math.cos(rad) * 24;
          const ly = c + Math.sin(rad) * 24;
          return (
            <ellipse key={deg} cx={lx} cy={ly} rx={7} ry={15}
              transform={`rotate(${deg} ${lx} ${ly})`}
              fill={i % 2 === 0 ? `${pos}15` : `${neg}10`}
              stroke={i % 2 === 0 ? pos : neg} strokeWidth={0.9} />
          );
        })}
      </>)}
    </svg>
  );
}

/* ── Selector button ────────────────────────────────────────────────────── */

function Btn({ selected, color, onClick, disabled, label }: {
  selected: boolean; color: string; onClick: () => void;
  disabled?: boolean; label: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '6px 10px', borderRadius: 8, fontSize: 13,
      fontWeight: 700, fontFamily: 'monospace', minWidth: 36,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s',
      background: selected ? `${color}20` : disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
      border: `1.5px solid ${selected ? `${color}70` : disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
      color: selected ? color : disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.50)',
      opacity: disabled ? 0.4 : 1,
    }}>
      {label}
    </button>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function QuantumNumberExplorerSim() {
  const [n, setN] = useState(2);
  const [l, setL] = useState(1);
  const [ml, setMl] = useState(0);
  const [ms, setMs] = useState(0.5);

  const { valid, errors } = validate(n, l, ml);
  const designation = valid ? `${n}${L_LABELS[l]}` : '—';
  const shapeName = valid ? L_SHAPES[l] : '—';
  const radialNodes = valid ? n - l - 1 : 0;
  const angularNodes = valid ? l : 0;
  const totalNodes = valid ? n - 1 : 0;
  const numOrbitals = valid ? 2 * l + 1 : 0;
  const maxElectrons = valid ? 2 * (2 * l + 1) : 0;

  function applyPreset(p: Preset) { setN(p.n); setL(p.l); setMl(p.ml); setMs(p.ms); }

  return (
    <div style={{ background: '#050a14', borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-3">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 4 }}>
          Interactive Simulator
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>
          Quantum Number{' '}
          <span style={{ color: '#818cf8' }}>Explorer</span>
        </div>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-4">

        {/* ── Quantum number selectors ─────────────────────────────────── */}
        <div className="flex flex-col gap-3 p-4 rounded-xl"
          style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>

          {/* n — principal */}
          <div className="flex items-center gap-3">
            <div style={{ width: 72 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: QN.n.color }}>{QN.n.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>{QN.n.name}</div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 2, 3, 4].map(v => (
                <Btn key={v} label={String(v)} selected={n === v}
                  color={QN.n.color} onClick={() => setN(v)} />
              ))}
            </div>
          </div>

          {/* l — azimuthal */}
          <div className="flex items-center gap-3">
            <div style={{ width: 72 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: QN.l.color }}>{QN.l.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>{QN.l.name}</div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[0, 1, 2, 3].map(v => (
                <Btn key={v} label={`${v} (${L_LABELS[v]})`} selected={l === v}
                  color={QN.l.color} onClick={() => setL(v)} disabled={v >= n} />
              ))}
            </div>
          </div>

          {/* mₗ — magnetic */}
          <div className="flex items-center gap-3">
            <div style={{ width: 72 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: QN.ml.color }}>{QN.ml.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>{QN.ml.name}</div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[-3, -2, -1, 0, 1, 2, 3].map(v => (
                <Btn key={v} label={v > 0 ? `+${v}` : String(v)} selected={ml === v}
                  color={QN.ml.color} onClick={() => setMl(v)} disabled={Math.abs(v) > l} />
              ))}
            </div>
          </div>

          {/* mₛ — spin */}
          <div className="flex items-center gap-3">
            <div style={{ width: 72 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: QN.ms.color }}>{QN.ms.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>{QN.ms.name}</div>
            </div>
            <div className="flex gap-1.5">
              <Btn label="+½ ↑" selected={ms === 0.5}  color={QN.ms.color} onClick={() => setMs(0.5)} />
              <Btn label="−½ ↓" selected={ms === -0.5} color={QN.ms.color} onClick={() => setMs(-0.5)} />
            </div>
          </div>
        </div>

        {/* ── Validation result ────────────────────────────────────────── */}
        <div className="rounded-xl p-4" style={{
          background: valid ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
          border: `1px solid ${valid ? 'rgba(52,211,153,0.20)' : 'rgba(248,113,113,0.20)'}`,
        }}>
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 14, fontWeight: 800,
              color: valid ? '#34d399' : '#f87171' }}>
              {valid ? '✓ Valid Combination' : '✗ Not Allowed'}
            </span>
          </div>

          {valid ? (
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
              {/* Left — orbital info */}
              <div className="flex flex-col gap-3">
                {/* Orbital designation */}
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)',
                    textTransform: 'uppercase', letterSpacing: '0.1em' }}>Orbital</div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1,
                    color: SUB_COLORS[L_LABELS[l]] }}>{designation}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    {shapeName} shape
                  </div>
                </div>

                {/* Node counts */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Radial nodes',  val: radialNodes, formula: 'n−l−1' },
                    { label: 'Angular nodes', val: angularNodes, formula: 'l' },
                    { label: 'Total nodes',   val: totalNodes,   formula: 'n−1' },
                  ].map(nd => (
                    <div key={nd.label} className="text-center rounded-lg p-2"
                      style={{ background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace',
                        color: '#e2e8f0', lineHeight: 1 }}>{nd.val}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)',
                        textTransform: 'uppercase', marginTop: 3 }}>{nd.label}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.20)',
                        fontFamily: 'monospace' }}>= {nd.formula}</div>
                    </div>
                  ))}
                </div>

                {/* Electron capacity */}
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                  <span style={{ color: SUB_COLORS[L_LABELS[l]], fontWeight: 700 }}>
                    {numOrbitals}
                  </span>{' '}
                  orbital{numOrbitals > 1 ? 's' : ''} × <span style={{ color: '#f472b6', fontWeight: 700 }}>2</span> spins ={' '}
                  <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{maxElectrons}</span> max electrons in{' '}
                  <span style={{ fontWeight: 700 }}>{designation}</span>
                </div>
              </div>

              {/* Right — shape preview */}
              <div className="flex items-center justify-center rounded-xl p-2"
                style={{ background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)' }}>
                <OrbitalPreview l={l} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {errors.map((err, i) => (
                <p key={i} style={{ fontSize: 13, color: 'rgba(248,113,113,0.85)',
                  lineHeight: 1.55, margin: 0 }}>{err}</p>
              ))}
            </div>
          )}
        </div>

        {/* ── Aufbau Filling Order ─────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
            Aufbau Filling Order
          </div>
          <div className="flex flex-col gap-0.5">
            {AUFBAU.map((sub, idx) => {
              const key = `${sub.n}${L_LABELS[sub.l]}`;
              const orbCount = 2 * sub.l + 1;
              const isCurrent = valid && sub.n === n && sub.l === l;
              const subColor = SUB_COLORS[L_LABELS[sub.l]];

              return (
                <div key={idx} className="flex items-center gap-2 py-1 px-2 rounded-lg"
                  style={{
                    transition: 'all 0.2s',
                    background: isCurrent ? `${subColor}12` : 'transparent',
                    border: `1px solid ${isCurrent ? `${subColor}30` : 'transparent'}`,
                  }}>
                  {/* Filling order # */}
                  <span style={{ fontSize: 10, fontWeight: 700, width: 16,
                    textAlign: 'right', fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.20)' }}>
                    {idx + 1}
                  </span>
                  {/* Sublevel label */}
                  <span style={{ fontSize: 13, fontWeight: 700, width: 28,
                    fontFamily: 'monospace',
                    color: isCurrent ? subColor : 'rgba(255,255,255,0.45)' }}>
                    {key}
                  </span>
                  {/* n+l */}
                  <span style={{ fontSize: 10, width: 40, fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.20)' }}>
                    n+l={sub.n + sub.l}
                  </span>
                  {/* Orbital boxes */}
                  <div className="flex gap-1">
                    {Array.from({ length: orbCount }).map((_, oi) => {
                      const boxMl = -sub.l + oi;
                      const isThis = isCurrent && boxMl === ml;
                      return (
                        <div key={oi} className="flex flex-col items-center gap-0.5">
                          <div style={{
                            width: 24, height: 24, borderRadius: 5,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700,
                            transition: 'all 0.2s',
                            border: `1.5px solid ${isThis ? subColor : isCurrent ? `${subColor}50` : 'rgba(255,255,255,0.08)'}`,
                            background: isThis ? `${subColor}25` : isCurrent ? `${subColor}08` : 'rgba(255,255,255,0.02)',
                            color: isThis ? subColor : 'transparent',
                          }}>
                            {isThis ? (ms > 0 ? '↑' : '↓') : ''}
                          </div>
                          <span style={{ fontSize: 8, fontFamily: 'monospace',
                            color: isCurrent ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.12)' }}>
                            {boxMl >= 0 ? `+${boxMl}` : boxMl}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Marker */}
                  {isCurrent && (
                    <span style={{ fontSize: 10, color: subColor, fontWeight: 700,
                      marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                      ← selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quick Examples ──────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
            Quick Examples
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => applyPreset(p)} style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: p.label.startsWith('✗') ? '#f87171' : 'rgba(255,255,255,0.50)',
              }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
