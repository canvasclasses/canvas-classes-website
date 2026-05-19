'use client';

// Pulley System Simulator — Chapter 11: Machines
// Demonstrates Fixed, Single Movable, and Compound (block-and-tackle) pulley systems.
// Mechanical Advantage: Fixed=1, Movable=2, Compound=n (number of rope segments)
// Academic accuracy: MA doesn't save energy — effort × distance = load × distance / MA

import { useState } from 'react';

type PulleyType = 'fixed' | 'movable' | 'compound';

const TYPE_LABELS: Record<PulleyType, string> = {
  fixed: 'Fixed',
  movable: 'Single Movable',
  compound: 'Compound',
};

function getMA(type: PulleyType, ropes: number): number {
  if (type === 'fixed') return 1;
  if (type === 'movable') return 2;
  return ropes;
}

// ── SVG sub-components ────────────────────────────────────────────────────────

function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill={color} />
    </marker>
  );
}

function WeightBox({
  cx, y, label, color,
}: { cx: number; y: number; label: string; color: string }) {
  const W = 52, H = 34;
  return (
    <g>
      <rect x={cx - W / 2} y={y} width={W} height={H} rx={5}
        fill="#1e293b" stroke={color} strokeWidth={1.8} />
      <text x={cx} y={y + H / 2 + 5} textAnchor="middle"
        fill={color} fontSize={11} fontWeight={700}>{label}</text>
    </g>
  );
}

function PulleyWheel({
  cx, cy, r, color,
}: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#1e3a5f" stroke={color} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={r * 0.28} fill={color} opacity={0.85} />
    </g>
  );
}

// ── Fixed Pulley diagram ───────────────────────────────────────────────────────
function FixedDiagram({ loadN, effortN }: { loadN: number; effortN: number }) {
  const W = 400, H = 310;
  const cx = W / 2;
  const mountY = 24;
  const pulleyR = 28;
  const pulleyCy = mountY + pulleyR + 4;
  const ropeTopY = pulleyCy;
  const loadBoxTopY = 200;
  const effortArrowTop = 210;
  const effortArrowBottom = 270;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <ArrowMarker id="fp-effort" color="#34d399" />
        <ArrowMarker id="fp-load" color="#f87171" />
      </defs>

      {/* Ceiling mount */}
      <rect x={cx - 18} y={0} width={36} height={mountY} rx={4}
        fill="#334155" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1={cx} y1={mountY} x2={cx} y2={pulleyCy - pulleyR}
        stroke="#94a3b8" strokeWidth={2} />

      {/* Pulley */}
      <PulleyWheel cx={cx} cy={pulleyCy} r={pulleyR} color="#6366f1" />

      {/* Left rope: pulley → load box */}
      <line x1={cx - pulleyR + 3} y1={pulleyCy} x2={cx - 26} y2={loadBoxTopY}
        stroke="#94a3b8" strokeWidth={2.5} />

      {/* Right rope: pulley → effort (going up) */}
      <line x1={cx + pulleyR - 3} y1={pulleyCy} x2={cx + 26} y2={effortArrowTop}
        stroke="#94a3b8" strokeWidth={2.5} />

      {/* Effort arrow (person pulls down, so arrow points downward = effort going down) */}
      <line x1={cx + 26} y1={effortArrowTop} x2={cx + 26} y2={effortArrowBottom}
        stroke="#34d399" strokeWidth={2.5} markerEnd="url(#fp-effort)" />
      <text x={cx + 34} y={effortArrowBottom - 8} fill="#34d399" fontSize={10} fontWeight={700}>
        Effort
      </text>
      <text x={cx + 34} y={effortArrowBottom + 6} fill="#34d399" fontSize={10}>
        {effortN.toFixed(0)} N
      </text>

      {/* Load box */}
      <WeightBox cx={cx - 26} y={loadBoxTopY} label={`Load\n${loadN} N`} color="#f87171" />
      <text x={cx - 26} y={loadBoxTopY + 16} textAnchor="middle" fill="#f87171" fontSize={10} fontWeight={700}>Load</text>
      <text x={cx - 26} y={loadBoxTopY + 28} textAnchor="middle" fill="#f87171" fontSize={10}>{loadN} N</text>

      {/* Direction change note */}
      <text x={cx} y={H - 12} textAnchor="middle" fill="#64748b" fontSize={10}>
        Direction changes — force stays the same (MA = 1)
      </text>
    </svg>
  );
}

// ── Movable Pulley diagram ─────────────────────────────────────────────────────
function MovableDiagram({ loadN, effortN }: { loadN: number; effortN: number }) {
  const W = 400, H = 310;
  const fixedAnchorX = 80;
  const fixedAnchorY = 30;
  const effortX = W - 80;
  const movPulleyR = 28;
  const movPulleyCy = 185;
  const movPulleyCx = W / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <ArrowMarker id="mv-effort" color="#34d399" />
      </defs>

      {/* Fixed anchor left */}
      <rect x={fixedAnchorX - 14} y={fixedAnchorY - 18} width={28} height={18} rx={3}
        fill="#334155" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <circle cx={fixedAnchorX} cy={fixedAnchorY} r={5} fill="#6366f1" />

      {/* Ceiling bar */}
      <rect x={40} y={0} width={W - 80} height={10} rx={3}
        fill="#334155" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* Rope 1: fixed anchor → movable pulley left */}
      <line x1={fixedAnchorX} y1={fixedAnchorY} x2={movPulleyCx - movPulleyR + 3} y2={movPulleyCy}
        stroke="#94a3b8" strokeWidth={2.5} />

      {/* Rope 2: effort side — from top right down to movable pulley right */}
      <line x1={effortX} y1={fixedAnchorY} x2={movPulleyCx + movPulleyR - 3} y2={movPulleyCy}
        stroke="#94a3b8" strokeWidth={2.5} />

      {/* Effort arrow going upward (person pulls up from right) */}
      <line x1={effortX} y1={260} x2={effortX} y2={fixedAnchorY + 10}
        stroke="#34d399" strokeWidth={2.5} markerEnd="url(#mv-effort)" />
      <text x={effortX + 8} y={240} fill="#34d399" fontSize={10} fontWeight={700}>Effort</text>
      <text x={effortX + 8} y={253} fill="#34d399" fontSize={10}>{effortN.toFixed(0)} N</text>

      {/* Movable pulley */}
      <PulleyWheel cx={movPulleyCx} cy={movPulleyCy} r={movPulleyR} color="#818cf8" />

      {/* Axle line going down to load */}
      <line x1={movPulleyCx} y1={movPulleyCy + movPulleyR} x2={movPulleyCx} y2={240}
        stroke="#94a3b8" strokeWidth={2} />

      {/* Load box */}
      <WeightBox cx={movPulleyCx} y={240} label="" color="#f87171" />
      <text x={movPulleyCx} y={256} textAnchor="middle" fill="#f87171" fontSize={10} fontWeight={700}>Load</text>
      <text x={movPulleyCx} y={268} textAnchor="middle" fill="#f87171" fontSize={10}>{loadN} N</text>

      {/* "2 rope segments" label */}
      <text x={movPulleyCx} y={movPulleyCy - movPulleyR - 10} textAnchor="middle"
        fill="#fbbf24" fontSize={10} fontWeight={600}>
        2 rope segments support the load
      </text>
      <line x1={movPulleyCx - movPulleyR - 2} y1={movPulleyCy - movPulleyR + 2}
        x2={movPulleyCx - movPulleyR - 2} y2={movPulleyCy + movPulleyR - 2}
        stroke="#fbbf24" strokeWidth={1.2} strokeDasharray="3,2" />
      <line x1={movPulleyCx + movPulleyR + 2} y1={movPulleyCy - movPulleyR + 2}
        x2={movPulleyCx + movPulleyR + 2} y2={movPulleyCy + movPulleyR - 2}
        stroke="#fbbf24" strokeWidth={1.2} strokeDasharray="3,2" />

      <text x={movPulleyCx} y={H - 12} textAnchor="middle" fill="#64748b" fontSize={10}>
        2 ropes share the load → effort = load ÷ 2 (MA = 2)
      </text>
    </svg>
  );
}

// ── Compound Pulley diagram ────────────────────────────────────────────────────
function CompoundDiagram({
  ropes, loadN, effortN,
}: { ropes: number; loadN: number; effortN: number }) {
  const W = 400, H = 310;
  const blockW = 90;
  const upperCy = 50;
  const lowerCy = 190;
  const blockCx = W / 2;
  const ropeColors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  // Draw n rope segments between upper and lower block
  const ropeSpacing = blockW / (ropes + 1);
  const ropeSegments = Array.from({ length: ropes }, (_, i) => ({
    x: blockCx - blockW / 2 + ropeSpacing * (i + 1),
    color: ropeColors[i % ropeColors.length],
    label: i + 1,
  }));

  // Effort rope comes off the right side
  const effortX = blockCx + blockW / 2 + 24;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <ArrowMarker id="cp-effort" color="#34d399" />
      </defs>

      {/* Ceiling */}
      <rect x={30} y={0} width={W - 60} height={10} rx={3}
        fill="#334155" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* Upper fixed block */}
      <rect x={blockCx - blockW / 2} y={upperCy - 18} width={blockW} height={36} rx={6}
        fill="#1e3a5f" stroke="#6366f1" strokeWidth={2} />
      <text x={blockCx} y={upperCy + 5} textAnchor="middle"
        fill="#818cf8" fontSize={10} fontWeight={600}>Upper Block (fixed)</text>

      {/* Mount from ceiling to upper block */}
      <line x1={blockCx} y1={10} x2={blockCx} y2={upperCy - 18}
        stroke="#94a3b8" strokeWidth={2} />

      {/* Lower movable block */}
      <rect x={blockCx - blockW / 2} y={lowerCy - 18} width={blockW} height={36} rx={6}
        fill="#1e293b" stroke="#818cf8" strokeWidth={2} />
      <text x={blockCx} y={lowerCy + 5} textAnchor="middle"
        fill="#a5b4fc" fontSize={10} fontWeight={600}>Lower Block (moves)</text>

      {/* Rope segments between blocks */}
      {ropeSegments.map(seg => (
        <g key={seg.label}>
          <line x1={seg.x} y1={upperCy + 18} x2={seg.x} y2={lowerCy - 18}
            stroke={seg.color} strokeWidth={2.2} />
          <text x={seg.x} y={(upperCy + lowerCy) / 2 + 4} textAnchor="middle"
            fill={seg.color} fontSize={8} fontWeight={600}>{seg.label}</text>
        </g>
      ))}

      {/* Effort rope from lower block (or upper block) */}
      <line x1={blockCx + blockW / 2} y1={ropes % 2 === 0 ? upperCy : lowerCy}
        x2={effortX} y2={ropes % 2 === 0 ? upperCy : lowerCy}
        stroke="#94a3b8" strokeWidth={2.2} />
      <line x1={effortX} y1={ropes % 2 === 0 ? upperCy : lowerCy}
        x2={effortX} y2={275}
        stroke="#94a3b8" strokeWidth={2.2} />
      <line x1={effortX} y1={275} x2={effortX} y2={255}
        stroke="#34d399" strokeWidth={2.5} markerEnd="url(#cp-effort)" />
      <text x={effortX + 8} y={270} fill="#34d399" fontSize={10} fontWeight={700}>
        Effort
      </text>
      <text x={effortX + 8} y={282} fill="#34d399" fontSize={10}>
        {effortN.toFixed(0)} N
      </text>

      {/* Load hanging from lower block */}
      <line x1={blockCx} y1={lowerCy + 18} x2={blockCx} y2={240}
        stroke="#94a3b8" strokeWidth={2} />
      <WeightBox cx={blockCx} y={240} label="" color="#f87171" />
      <text x={blockCx} y={255} textAnchor="middle" fill="#f87171" fontSize={10} fontWeight={700}>Load</text>
      <text x={blockCx} y={267} textAnchor="middle" fill="#f87171" fontSize={10}>{loadN} N</text>

      <text x={W / 2} y={H - 6} textAnchor="middle" fill="#64748b" fontSize={10}>
        {ropes} rope segments → MA = {ropes}
      </text>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PulleySystemSim() {
  const [type, setType] = useState<PulleyType>('fixed');
  const [compoundRopes, setCompoundRopes] = useState(3);
  const [loadForce, setLoadForce] = useState(400);

  const ma = getMA(type, compoundRopes);
  const effort = loadForce / ma;
  const savePercent = ((1 - 1 / ma) * 100).toFixed(0);

  const typeButtons: PulleyType[] = ['fixed', 'movable', 'compound'];

  const infoTable = [
    { type: 'Fixed', ma: '1', tradeoff: 'Changes direction only' },
    { type: 'Movable', ma: '2', tradeoff: 'Pull twice the distance' },
    { type: 'Compound (n)', ma: 'n', tradeoff: 'Rope moves n × the load distance' },
  ];

  return (
    <div style={{
      background: '#0b0f15',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24,
      maxWidth: 940,
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Pulley System Explorer
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Mechanical Advantage = Load Force / Effort Force — compare three pulley configurations
        </p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT — SVG visualization */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #060d1f 0%, #0a0e1a 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {type === 'fixed' && <FixedDiagram loadN={loadForce} effortN={effort} />}
            {type === 'movable' && <MovableDiagram loadN={loadForce} effortN={effort} />}
            {type === 'compound' && (
              <CompoundDiagram ropes={compoundRopes} loadN={loadForce} effortN={effort} />
            )}
          </div>

          {/* Key insight callout */}
          <div style={{
            marginTop: 12,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10,
            padding: '10px 14px',
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#818cf8' }}>Energy Conservation: </strong>
              MA doesn't save energy — you pull the rope farther but with less force.
              Work In = Work Out (ignoring friction).
            </p>
          </div>

          {/* Info table */}
          <div style={{ marginTop: 14, overflowX: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse',
              fontSize: 11, color: '#94a3b8',
            }}>
              <thead>
                <tr>
                  {['Type', 'MA', 'Trade-off'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '6px 10px',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      color: '#64748b', fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 10,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {infoTable.map(row => (
                  <tr key={row.type} style={{
                    background: row.type.toLowerCase().startsWith(type)
                      ? 'rgba(99,102,241,0.07)' : 'transparent',
                  }}>
                    <td style={{ padding: '6px 10px', color: '#e2e8f0', fontWeight: 600 }}>{row.type}</td>
                    <td style={{ padding: '6px 10px', color: '#fbbf24', fontWeight: 700 }}>{row.ma}</td>
                    <td style={{ padding: '6px 10px' }}>{row.tradeoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Type selector */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Pulley Type
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {typeButtons.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: type === t ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                    background: type === t ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                    color: type === t ? '#818cf8' : '#94a3b8',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                    transition: 'all 0.15s',
                  }}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Compound ropes slider */}
          {type === 'compound' && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                  Number of Ropes
                </span>
                <span style={{ fontSize: 16, color: '#fbbf24', fontWeight: 700 }}>
                  {compoundRopes}
                </span>
              </div>
              <input
                type="range" min={2} max={5} value={compoundRopes}
                onChange={e => setCompoundRopes(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#fbbf24' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
                <span>2</span><span>5</span>
              </div>
            </div>
          )}

          {/* Load force slider */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                Load Force (N)
              </span>
              <span style={{ fontSize: 16, color: '#f87171', fontWeight: 700 }}>
                {loadForce}
              </span>
            </div>
            <input
              type="range" min={100} max={1000} step={10} value={loadForce}
              onChange={e => setLoadForce(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f87171' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
              <span>100 N</span><span>1000 N</span>
            </div>
          </div>

          {/* Live results */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '14px 12px',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Results
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Mechanical Advantage</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>{ma}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Effort Needed</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#34d399' }}>
                  {effort.toFixed(0)} N
                </span>
              </div>
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: 10,
                textAlign: 'center' as const,
              }}>
                {ma === 1 ? (
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    No force saved — direction only
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
                    You save {savePercent}% of the force!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Comparison bars */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Force Comparison
            </p>
            {[
              { label: 'Load', value: loadForce, max: loadForce, color: '#f87171' },
              { label: 'Effort', value: effort, max: loadForce, color: '#34d399' },
            ].map(bar => (
              <div key={bar.label} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{bar.label}</span>
                  <span style={{ fontSize: 11, color: bar.color, fontWeight: 700 }}>
                    {bar.value.toFixed(0)} N
                  </span>
                </div>
                <div style={{
                  height: 8, background: 'rgba(255,255,255,0.06)',
                  borderRadius: 4, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(bar.value / bar.max) * 100}%`,
                    background: bar.color,
                    borderRadius: 4,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
