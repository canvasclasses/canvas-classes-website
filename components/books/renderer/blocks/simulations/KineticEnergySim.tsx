'use client';

// Kinetic Energy Simulator — Chapter 4: Work and Energy
// KE = ½mv² — Source: NCERT Class 9 Science Chapter 11
// Shows how KE scales quadratically with velocity and linearly with mass.
// Objects: ball (1 kg), cricket ball (0.16 kg), car (1000 kg), truck (5000 kg), bullet (0.01 kg)

import { useState, useCallback } from 'react';

interface ObjectType {
  id: string;
  label: string;
  emoji: string;
  mass: number;       // kg
  maxV: number;       // m/s (typical max slider value)
  color: string;
  desc: string;
}

const OBJECTS: ObjectType[] = [
  { id: 'ball',    label: 'Football',     emoji: '⚽', mass: 0.43, maxV: 30,   color: '#34d399', desc: 'A standard football, mass 0.43 kg.' },
  { id: 'stone',   label: 'Stone',        emoji: '🪨', mass: 2.0,  maxV: 20,   color: '#94a3b8', desc: '2 kg stone — more mass, more energy.' },
  { id: 'cyclist', label: 'Cyclist',      emoji: '🚴', mass: 80,   maxV: 15,   color: '#6366f1', desc: 'Person + bike ≈ 80 kg at up to 15 m/s.' },
  { id: 'car',     label: 'Car',          emoji: '🚗', mass: 1000, maxV: 40,   color: '#fbbf24', desc: 'Average car, 1000 kg at highway speeds.' },
  { id: 'bullet',  label: 'Bullet',       emoji: '🔫', mass: 0.01, maxV: 500,  color: '#f87171', desc: 'Bullet 0.01 kg — tiny mass, extreme velocity!' },
];

// NCERT: KE = ½mv²
function ke(m: number, v: number) { return 0.5 * m * v * v; }

function fmtEnergy(J: number): string {
  if (J >= 1e9)  return `${(J / 1e9).toFixed(2)} GJ`;
  if (J >= 1e6)  return `${(J / 1e6).toFixed(2)} MJ`;
  if (J >= 1e3)  return `${(J / 1e3).toFixed(2)} kJ`;
  if (J >= 1)    return `${J.toFixed(1)} J`;
  return `${(J * 1000).toFixed(1)} mJ`;
}

// Draw a simple velocity-KE graph (discrete points as dots)
function GraphSVG({ mass, v, maxV, color }: { mass: number; v: number; maxV: number; color: string }) {
  const W = 220, H = 120;
  const padL = 36, padB = 28, padR = 10, padT = 12;
  const pw = W - padL - padR, ph = H - padT - padB;
  const maxKE = ke(mass, maxV);

  const pts = Array.from({ length: 41 }, (_, i) => {
    const vi = (i / 40) * maxV;
    const ki = ke(mass, vi);
    const px = padL + (vi / maxV) * pw;
    const py = H - padB - (ki / maxKE) * ph;
    return { px, py };
  });

  const curKE = ke(mass, v);
  const curX = padL + (v / maxV) * pw;
  const curY = H - padB - (curKE / maxKE) * ph;

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.px.toFixed(1)} ${p.py.toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      {/* Axis labels */}
      <text x={padL + pw / 2} y={H - 4} textAnchor="middle" fill="#475569" fontSize={9}>Velocity (m/s)</text>
      <text x={8} y={padT + ph / 2} textAnchor="middle" fill="#475569" fontSize={9}
        transform={`rotate(-90 8 ${padT + ph / 2})`}>KE (J)</text>
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={padL} y1={H - padB - f * ph} x2={W - padR} y2={H - padB - f * ph}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      {/* Curve */}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} opacity={0.7} />
      {/* Current point */}
      <circle cx={curX} cy={curY} r={5} fill={color} />
      <line x1={curX} y1={H - padB} x2={curX} y2={curY} stroke={color} strokeWidth={1} strokeDasharray="3,2" />
      <line x1={padL} y1={curY} x2={curX} y2={curY} stroke={color} strokeWidth={1} strokeDasharray="3,2" />
    </svg>
  );
}

export default function KineticEnergySim() {
  const [objId, setObjId]   = useState<string>('cyclist');
  const [v, setV]           = useState(10);

  const obj = OBJECTS.find(o => o.id === objId) ?? OBJECTS[2];
  const KE = ke(obj.mass, v);
  // Compared to a reference velocity
  const KEhalf  = ke(obj.mass, v / 2);
  const KEdouble = ke(obj.mass, v * 2 > obj.maxV ? obj.maxV : v * 2);

  // Bar width scale: normalise to max possible KE for current object
  const maxKE = ke(obj.mass, obj.maxV);

  // Build comparison: all objects at current velocity (clamped to their maxV)
  const comparisons = OBJECTS.map(o => ({
    ...o,
    vel: Math.min(v, o.maxV),
    ene: ke(o.mass, Math.min(v, o.maxV)),
  }));
  const maxCompKE = Math.max(...comparisons.map(c => c.ene));

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0', maxWidth: 940, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Kinetic Energy Simulator
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          KE = ½mv² — doubling velocity quadruples kinetic energy
        </p>
      </div>

      {/* Object selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const }}>
        {OBJECTS.map(o => (
          <button key={o.id} onClick={() => { setObjId(o.id); setV(Math.min(v, o.maxV)); }} style={{
            padding: '5px 14px', borderRadius: 20,
            border: objId === o.id ? `1px solid ${o.color}` : '1px solid rgba(255,255,255,0.1)',
            background: objId === o.id ? `${o.color}18` : 'rgba(255,255,255,0.03)',
            color: objId === o.id ? o.color : '#94a3b8',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {o.emoji} {o.label} ({o.mass} kg)
          </button>
        ))}
      </div>

      {/* Main body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Energy gauge */}
          <div style={{
            background: 'linear-gradient(135deg, #060d1f 0%, #0a0e1a 100%)',
            border: `1px solid ${obj.color}22`,
            borderRadius: 14, padding: '20px 24px', marginBottom: 14,
          }}>
            {/* Moving object visualisation */}
            <div style={{ position: 'relative', height: 60, marginBottom: 16 }}>
              {/* Track */}
              <div style={{
                position: 'absolute', bottom: 12, left: 0, right: 0, height: 3,
                background: 'rgba(255,255,255,0.1)', borderRadius: 2,
              }} />
              {/* Object */}
              <div style={{
                position: 'absolute', bottom: 14,
                left: `${Math.min(85, (v / obj.maxV) * 80)}%`,
                fontSize: 28,
                transition: 'left 0.3s ease',
                filter: `drop-shadow(0 0 ${Math.min(20, v / 2)}px ${obj.color})`,
              }}>
                {obj.emoji}
              </div>
            </div>

            {/* KE bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: '#64748b', marginBottom: 5 }}>
                <span>Kinetic Energy</span>
                <span style={{ color: obj.color, fontWeight: 700, fontSize: 14 }}>{fmtEnergy(KE)}</span>
              </div>
              <div style={{ height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 7, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 7,
                  width: `${maxKE > 0 ? Math.min(100, (KE / maxKE) * 100) : 0}%`,
                  background: `linear-gradient(to right, ${obj.color}80, ${obj.color})`,
                  transition: 'width 0.3s',
                }} />
              </div>
            </div>

            {/* Quadratic insight */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px',
              }}>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>At v/2 = {(v / 2).toFixed(1)} m/s</div>
                <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{fmtEnergy(KEhalf)}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                  = {KE > 0 ? ((KEhalf / KE) * 100).toFixed(0) : 0}% of current KE
                </div>
              </div>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px',
              }}>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>At 2v = {Math.min(v * 2, obj.maxV)} m/s</div>
                <div style={{ fontSize: 13, color: obj.color, fontWeight: 600 }}>{fmtEnergy(KEdouble)}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                  ≈ {KE > 0 ? ((KEdouble / KE)).toFixed(1) : 0}× current KE
                </div>
              </div>
            </div>
          </div>

          {/* KE vs v graph */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '12px 16px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              KE vs Velocity (parabolic curve — v²!)
            </p>
            <GraphSVG mass={obj.mass} v={v} maxV={obj.maxV} color={obj.color} />
          </div>

          {/* Comparison bars */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '14px 16px', marginTop: 12,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              All objects at ~{v} m/s
            </p>
            {comparisons.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 14, width: 22 }}>{c.emoji}</span>
                <span style={{ fontSize: 11, color: c.id === objId ? c.color : '#64748b',
                  fontWeight: c.id === objId ? 700 : 400, width: 68, flexShrink: 0 }}>
                  {c.label}
                </span>
                <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 5,
                    width: `${maxCompKE > 0 ? (c.ene / maxCompKE) * 100 : 0}%`,
                    background: c.id === objId ? c.color : `${c.color}55`,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: c.id === objId ? c.color : '#64748b',
                  width: 60, textAlign: 'right', flexShrink: 0 }}>
                  {fmtEnergy(c.ene)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — controls + concepts */}
        <div style={{ width: 240, flexShrink: 0 }}>

          {/* Velocity slider */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Velocity
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>v (m/s)</span>
              <span style={{ fontSize: 20, color: obj.color, fontWeight: 800 }}>{v}</span>
            </div>
            <input type="range" min={0} max={obj.maxV} step={1} value={v}
              onChange={e => setV(Number(e.target.value))}
              style={{ width: '100%', accentColor: obj.color }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
              <span style={{ fontSize: 10, color: '#334155' }}>0</span>
              <span style={{ fontSize: 10, color: '#334155' }}>{obj.maxV} m/s</span>
            </div>
          </div>

          {/* Live formula */}
          <div style={{
            background: `${obj.color}0e`,
            border: `1px solid ${obj.color}30`,
            borderRadius: 10, padding: '14px 12px', marginBottom: 16,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Live Formula
            </p>
            <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.9 }}>
              <div>KE = ½ × <span style={{ color: obj.color }}>{obj.mass}</span> × <span style={{ color: '#60a5fa' }}>{v}</span>²</div>
              <div>= ½ × <span style={{ color: obj.color }}>{obj.mass}</span> × <span style={{ color: '#60a5fa' }}>{v * v}</span></div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: obj.color }}>{fmtEnergy(KE)}</span>
              </div>
            </div>
          </div>

          {/* Key concepts */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Key Concepts
            </p>
            {[
              { term: 'KE formula',   def: 'KE = ½mv² — depends on mass AND velocity.' },
              { term: 'v doubled',    def: 'KE becomes 4× (quadratic in v). This is why road speed matters so much in crashes.' },
              { term: 'Mass doubled', def: 'KE doubles (linear in m). A truck at 10 m/s has far more KE than a ball.' },
              { term: 'Unit',         def: '1 Joule = 1 kg·m²/s²' },
              { term: 'Work-Energy',  def: 'Net work done = change in KE (Work-Energy theorem).' },
            ].map(({ term, def }) => (
              <div key={term} style={{ marginBottom: 9 }}>
                <div style={{ fontSize: 11, color: '#fb923c', fontWeight: 700 }}>{term}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{def}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#64748b', marginTop: 12,
            padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.55 }}>
            {obj.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
