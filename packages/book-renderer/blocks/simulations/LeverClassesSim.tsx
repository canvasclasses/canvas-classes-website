'use client';

// Lever Classes Simulator — Chapter 11: Levers
// Demonstrates 3 classes of levers with Indian examples and principle of moments.
// Principle of moments: F_effort × d_effort = F_load × d_load (balanced when equal).

import { useState, useCallback } from 'react';

type LeverClass = 1 | 2 | 3;

interface ClassDef {
  title: string;
  description: string;
  examples: string;
  emoji: string;
  // Default positions (0-100%) for fulcrum, effort, load
  defaultFulcrum: number;
  defaultEffort: number;
  defaultLoad: number;
  effortDirection: 'down' | 'up';  // Which way effort is applied
}

const CLASS_DEFS: Record<LeverClass, ClassDef> = {
  1: {
    title: 'Class 1',
    description: 'Fulcrum between effort and load',
    examples: 'Seesaw, scissors, crowbar, pliers',
    emoji: '⚖️',
    defaultFulcrum: 50,
    defaultEffort: 15,
    defaultLoad: 80,
    effortDirection: 'down',
  },
  2: {
    title: 'Class 2',
    description: 'Load between fulcrum and effort',
    examples: 'Wheelbarrow, bottle opener, nutcracker',
    emoji: '🛒',
    defaultFulcrum: 10,
    defaultEffort: 85,
    defaultLoad: 50,
    effortDirection: 'down',
  },
  3: {
    title: 'Class 3',
    description: 'Effort between fulcrum and load',
    examples: 'Tongs, tweezers, forearm/bicep',
    emoji: '🦾',
    defaultFulcrum: 10,
    defaultEffort: 45,
    defaultLoad: 85,
    effortDirection: 'up',
  },
};

export default function LeverClassesSim() {
  const [leverClass, setLeverClass] = useState<LeverClass>(1);
  const [effortPos, setEffortPos]   = useState(CLASS_DEFS[1].defaultEffort);   // 0-100
  const [loadPos, setLoadPos]       = useState(CLASS_DEFS[1].defaultLoad);     // 0-100
  const [fulcrumPos, setFulcrumPos] = useState(CLASS_DEFS[1].defaultFulcrum);  // 0-100
  const [loadForce, setLoadForce]   = useState(150);

  const def = CLASS_DEFS[leverClass];

  // Compute arm lengths in the 0-100 scale
  const effortArm = Math.abs(effortPos - fulcrumPos);
  const loadArm   = Math.abs(loadPos   - fulcrumPos);
  const effortForce = loadArm > 0 ? (loadForce * loadArm) / Math.max(effortArm, 0.01) : 0;

  const effortMoment = effortForce * effortArm;
  const loadMoment   = loadForce   * loadArm;
  const balanced     = Math.abs(effortMoment - loadMoment) < 1;

  // Balance: set effortPos so effortArm = loadArm (moments balanced with current forces)
  const autoBalance = useCallback(() => {
    // effortForce × effortArm = loadForce × loadArm
    // We keep effortForce = effortForce and find the new effortArm: loadArm stays same.
    // But since effortForce is derived, we move effortPos so effortArm = loadArm
    // (balanced iff effortArm = loadArm for equal forces, or more generally find new effort pos)
    // Simplest: set effortArm = loadArm → both moments equal.
    // effortPos = fulcrumPos + (effortPos > fulcrumPos ? 1 : -1) * loadArm
    const dir = effortPos >= fulcrumPos ? 1 : -1;
    const newEP = Math.max(0, Math.min(100, fulcrumPos + dir * loadArm));
    setEffortPos(newEP);
  }, [effortPos, fulcrumPos, loadArm]);

  function selectClass(c: LeverClass) {
    setLeverClass(c);
    const d = CLASS_DEFS[c];
    setFulcrumPos(d.defaultFulcrum);
    setEffortPos(d.defaultEffort);
    setLoadPos(d.defaultLoad);
  }

  // ── SVG geometry ──────────────────────────────────────────────────────────────
  const SVG_W = 480, SVG_H = 300;
  const BEAM_X1 = 50, BEAM_X2 = 430;
  const BEAM_LEN = BEAM_X2 - BEAM_X1;
  const BEAM_NATURAL_Y = 155; // y when horizontal

  // Map 0-100 positions to SVG x
  function posToX(p: number) { return BEAM_X1 + (p / 100) * BEAM_LEN; }

  const fulcrumX = posToX(fulcrumPos);
  const effortX  = posToX(effortPos);
  const loadX    = posToX(loadPos);

  // Tilt: compute beam tilt based on net moment (for visual effect only; very slight)
  // Positive moment = load side goes down
  const netMoment = loadMoment - effortMoment; // positive → load side heavier
  const loadSide  = loadPos > fulcrumPos ? 1 : -1; // which side load is on
  // tilt angle in degrees (small): proportional to net moment, capped at ±12 deg
  const tiltDeg = balanced ? 0 : Math.max(-12, Math.min(12, (netMoment * loadSide) / 200));
  const tiltRad = tiltDeg * Math.PI / 180;

  // Beam endpoint y given tilt around fulcrum
  function beamY(bx: number) {
    const dx = bx - fulcrumX;
    return BEAM_NATURAL_Y + dx * Math.sin(tiltRad);
  }

  const beam1Y = beamY(BEAM_X1);
  const beam2Y = beamY(BEAM_X2);
  const effortY = beamY(effortX);
  const loadY   = beamY(loadX);
  const fulcrumY = BEAM_NATURAL_Y;

  // Arrow scales
  const eLen = Math.min(65, effortForce * 0.15);
  const lLen = Math.min(65, loadForce   * 0.15);

  // Effort arrow direction: down by default (class 1, 2), up for class 3
  const effortArrowDy = def.effortDirection === 'down' ? -1 : 1; // SVG y is flipped: -1 = upward in screen
  const effortArrowY2 = effortY + effortArrowDy * eLen;
  const loadArrowY2   = loadY   + lLen; // load always pulls down (weight)

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, maxWidth: 940, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Lever Classes Explorer
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Principle of moments: F_e × d_e = F_l × d_l — Ch 11
        </p>
      </div>

      {/* Class selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {([1, 2, 3] as LeverClass[]).map(c => (
          <button key={c} onClick={() => selectClass(c)} style={{
            flex: '1 1 130px',
            padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
            border: leverClass === c ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
            background: leverClass === c ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
            color: leverClass === c ? '#818cf8' : '#94a3b8',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{CLASS_DEFS[c].emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{CLASS_DEFS[c].title}</div>
            <div style={{ fontSize: 10, opacity: 0.75, lineHeight: 1.4 }}>
              {CLASS_DEFS[c].description}
            </div>
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT — SVG */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(160deg, #060d1f 0%, #0a0e1a 100%)',
            border: `1px solid ${balanced ? 'rgba(52,211,153,0.35)' : 'rgba(99,102,241,0.2)'}`,
            borderRadius: 14, overflow: 'hidden',
            boxShadow: balanced ? '0 0 16px rgba(52,211,153,0.12)' : 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }}>
              <defs>
                <marker id="lv-down-red" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#f87171" />
                </marker>
                <marker id="lv-eff-ind" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#818cf8" />
                </marker>
                <marker id="lv-eff-up-ind" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,7 L3.5,0 L7,7 Z" fill="#818cf8" />
                </marker>
              </defs>

              {/* Ground / support line */}
              <line x1={BEAM_X1 - 10} y1={BEAM_NATURAL_Y + 45}
                x2={BEAM_X2 + 10} y2={BEAM_NATURAL_Y + 45}
                stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />

              {/* Beam */}
              <line
                x1={BEAM_X1} y1={beam1Y}
                x2={BEAM_X2} y2={beam2Y}
                stroke={balanced ? '#34d399' : '#475569'} strokeWidth={10}
                strokeLinecap="round"
              />
              {/* Beam overlay (lighter top edge) */}
              <line
                x1={BEAM_X1} y1={beam1Y}
                x2={BEAM_X2} y2={beam2Y}
                stroke="rgba(255,255,255,0.06)" strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Fulcrum triangle */}
              <polygon
                points={`${fulcrumX - 14},${fulcrumY + 42} ${fulcrumX + 14},${fulcrumY + 42} ${fulcrumX},${fulcrumY + 2}`}
                fill="#334155" stroke="#64748b" strokeWidth={1.5}
              />
              <line x1={fulcrumX - 18} y1={fulcrumY + 42} x2={fulcrumX + 18} y2={fulcrumY + 42}
                stroke="#64748b" strokeWidth={2} />

              {/* Fulcrum label */}
              <text x={fulcrumX} y={fulcrumY + 56}
                textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={600}>
                Fulcrum
              </text>

              {/* Effort arm — dashed green line from fulcrum to effort point */}
              <line
                x1={fulcrumX} y1={BEAM_NATURAL_Y - 22}
                x2={effortX}  y2={BEAM_NATURAL_Y - 22}
                stroke="#34d399" strokeWidth={1.5} strokeDasharray="5,3"
              />
              <text
                x={(fulcrumX + effortX) / 2} y={BEAM_NATURAL_Y - 28}
                textAnchor="middle" fill="#34d399" fontSize={9}>
                d_e = {effortArm.toFixed(0)}
              </text>

              {/* Load arm — dashed orange line from fulcrum to load point */}
              <line
                x1={fulcrumX} y1={BEAM_NATURAL_Y - 10}
                x2={loadX}    y2={BEAM_NATURAL_Y - 10}
                stroke="#fb923c" strokeWidth={1.5} strokeDasharray="5,3"
              />
              <text
                x={(fulcrumX + loadX) / 2} y={BEAM_NATURAL_Y - 16}
                textAnchor="middle" fill="#fb923c" fontSize={9}>
                d_l = {loadArm.toFixed(0)}
              </text>

              {/* Effort arrow */}
              {effortArm > 0 && (
                <>
                  <line
                    x1={effortX} y1={effortY}
                    x2={effortX} y2={effortArrowY2}
                    stroke="#818cf8" strokeWidth={2.5}
                    markerEnd={def.effortDirection === 'down'
                      ? 'url(#lv-eff-ind)'
                      : 'url(#lv-eff-up-ind)'}
                  />
                  <text
                    x={effortX + (effortX < SVG_W / 2 ? -6 : 6)}
                    y={(effortY + effortArrowY2) / 2 + 4}
                    textAnchor={effortX < SVG_W / 2 ? 'end' : 'start'}
                    fill="#818cf8" fontSize={9} fontWeight={600}>
                    F_e={effortForce.toFixed(1)}N
                  </text>
                </>
              )}

              {/* Effort point dot */}
              <circle cx={effortX} cy={effortY} r={5} fill="#818cf8" />
              <text x={effortX} y={effortY + (def.effortDirection === 'down' ? 18 : -10)}
                textAnchor="middle" fill="#818cf8" fontSize={8}>Effort</text>

              {/* Load arrow (always down — weight) */}
              {loadArm > 0 && (
                <>
                  <line
                    x1={loadX} y1={loadY}
                    x2={loadX} y2={loadArrowY2}
                    stroke="#f87171" strokeWidth={2.5}
                    markerEnd="url(#lv-down-red)"
                  />
                  <text
                    x={loadX + (loadX > SVG_W / 2 ? 6 : -6)}
                    y={(loadY + loadArrowY2) / 2 + 4}
                    textAnchor={loadX > SVG_W / 2 ? 'start' : 'end'}
                    fill="#f87171" fontSize={9} fontWeight={600}>
                    F_l={loadForce}N
                  </text>
                </>
              )}

              {/* Load point dot */}
              <circle cx={loadX} cy={loadY} r={5} fill="#f87171" />
              <text x={loadX} y={loadY - 10}
                textAnchor="middle" fill="#f87171" fontSize={8}>Load</text>

              {/* Balance indicator */}
              {balanced && (
                <text x={SVG_W / 2} y={30}
                  textAnchor="middle" fill="#34d399" fontSize={12} fontWeight={700}>
                  ✓ BALANCED
                </text>
              )}

              {/* Moment equation at bottom */}
              <text x={SVG_W / 2} y={SVG_H - 12}
                textAnchor="middle" fill="#94a3b8" fontSize={10}>
                {`F_e × d_e = ${effortForce.toFixed(1)} × ${effortArm.toFixed(0)} = ${effortMoment.toFixed(0)}`}
                {'   vs   '}
                {`F_l × d_l = ${loadForce} × ${loadArm.toFixed(0)} = ${loadMoment.toFixed(0)}`}
              </text>
            </svg>
          </div>

          {/* Examples card */}
          <div style={{
            marginTop: 12,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10, padding: '10px 14px',
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#818cf8' }}>{def.emoji} {def.title} Examples: </strong>
              {def.examples}
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
              The longer the effort arm, the less effort is needed — mechanical advantage!
            </p>
          </div>
        </div>

        {/* RIGHT — controls */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Positions */}
          {[
            { label: 'Effort Position (%)', val: effortPos, set: setEffortPos, color: '#818cf8' },
            { label: 'Load Position (%)',   val: loadPos,   set: setLoadPos,   color: '#f87171' },
            { label: 'Fulcrum Position (%)',val: fulcrumPos,set: setFulcrumPos,color: '#94a3b8' },
          ].map(({ label, val, set, color }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 14, color, fontWeight: 700 }}>{val}</span>
              </div>
              <input type="range" min={0} max={100} value={val}
                onChange={e => set(Number(e.target.value))}
                style={{ width: '100%', accentColor: color }} />
            </div>
          ))}

          {/* Load force */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Load Force (N)</span>
              <span style={{ fontSize: 14, color: '#f87171', fontWeight: 700 }}>{loadForce}</span>
            </div>
            <input type="range" min={50} max={300} value={loadForce}
              onChange={e => setLoadForce(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f87171' }} />
          </div>

          {/* Moment display */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '12px', marginBottom: 12,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#64748b', margin: '0 0 10px',
            }}>Moments</p>
            <div style={{ fontSize: 12, lineHeight: 1.9 }}>
              <div>
                <span style={{ color: '#818cf8' }}>F_e × d_e</span>
                {' = '}
                <span style={{ color: '#818cf8', fontWeight: 700 }}>
                  {effortForce.toFixed(1)} × {effortArm.toFixed(0)} = {effortMoment.toFixed(0)}
                </span>
              </div>
              <div>
                <span style={{ color: '#f87171' }}>F_l × d_l</span>
                {' = '}
                <span style={{ color: '#f87171', fontWeight: 700 }}>
                  {loadForce} × {loadArm.toFixed(0)} = {loadMoment.toFixed(0)}
                </span>
              </div>
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                marginTop: 8, paddingTop: 8,
                color: balanced ? '#34d399' : '#fbbf24',
                fontWeight: 700, fontSize: 13,
              }}>
                {balanced ? '⚖️ Balanced!' : `Δ = ${Math.abs(effortMoment - loadMoment).toFixed(0)}`}
              </div>
            </div>
          </div>

          {/* Auto-balance button */}
          <button onClick={autoBalance} style={{
            width: '100%', padding: '10px', borderRadius: 8, cursor: 'pointer',
            border: '1px solid rgba(52,211,153,0.4)',
            background: 'rgba(52,211,153,0.1)',
            color: '#34d399', fontSize: 12, fontWeight: 700,
            marginBottom: 12,
          }}>
            ⚖️ Auto-Balance Effort Arm
          </button>

          {/* Arm summary */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#64748b', margin: '0 0 8px',
            }}>Arms & Force</p>
            {[
              { label: 'Effort arm',   val: effortArm.toFixed(1), color: '#34d399' },
              { label: 'Load arm',     val: loadArm.toFixed(1),   color: '#fb923c' },
              { label: 'MA',           val: (effortArm > 0 ? effortArm / Math.max(loadArm, 0.01) : 0).toFixed(2), color: '#818cf8' },
              { label: 'Effort needed',val: effortForce.toFixed(1) + ' N', color: '#818cf8' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 5, alignItems: 'center',
              }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
