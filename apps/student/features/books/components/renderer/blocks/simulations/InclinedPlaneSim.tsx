'use client';

// Inclined Plane Simulator — Chapter 11: Machines / Simple Machines
// Compares force needed along a ramp vs lifting straight up.
// Academic accuracy:
//   - MA (frictionless) = 1 / sin(θ) = L / h
//   - Work is conserved: W_ramp = W_lift (ignoring friction)
//   - With friction (μ=0.2): extra friction force = μ × N = μ × W × cos(θ)

import { useState } from 'react';

const FIXED_HEIGHT = 2; // metres — always 2 m tall ramp
const G = 9.8;
const MU = 0.2; // coefficient of kinetic friction (when enabled)

function toRad(deg: number) { return deg * Math.PI / 180; }

interface Physics {
  W: number;
  N: number;
  F_ramp: number;
  F_friction: number;
  ma: number;
  rampLen: number;
}

function calcPhysics(angleDeg: number, mass: number, friction: boolean): Physics {
  const theta = toRad(angleDeg);
  const W = mass * G;
  const N = W * Math.cos(theta);
  const F_parallel = W * Math.sin(theta);
  const F_friction = friction ? MU * N : 0;
  const F_ramp = F_parallel + F_friction;
  const rampLen = FIXED_HEIGHT / Math.sin(theta);
  const ma = W / F_ramp;
  return { W, N, F_ramp, F_friction, ma, rampLen };
}

// ── SVG diagram ────────────────────────────────────────────────────────────────

function RampDiagram({
  angleDeg, physics,
}: { angleDeg: number; physics: Physics }) {
  const SVG_W = 500, SVG_H = 280;
  const theta = toRad(angleDeg);

  // Ramp triangle geometry
  const baseX = 40;
  const groundY = SVG_H - 44;
  const heightPx = 160;
  const basePx = heightPx / Math.tan(theta); // base width in pixels (clamp)
  const clampedBase = Math.min(basePx, 320);

  const vertexBase = { x: baseX, y: groundY };                          // bottom-left
  const vertexTop  = { x: baseX, y: groundY - heightPx };               // top-left (vertical wall top)
  const vertexRight = { x: baseX + clampedBase, y: groundY };           // bottom-right

  // Block on ramp
  const rampAngle = Math.atan2(groundY - (groundY - heightPx), clampedBase); // same as theta
  const blockDist = 0.52; // fraction along ramp where block sits
  const rampVecX = (vertexRight.x - vertexTop.x);
  const rampVecY = (vertexRight.y - vertexTop.y);
  const blockCx = vertexTop.x + rampVecX * blockDist;
  const blockCy = vertexTop.y + rampVecY * blockDist;

  // Arrow lengths (scaled to physics values)
  const scale = 0.18;
  const wLen = Math.min(physics.W * scale, 90);
  const nLen = Math.min(physics.N * scale, 80);
  const fRampLen = Math.min(physics.F_ramp * scale, 80);
  const fFricLen = Math.min(physics.F_friction * scale, 60);

  // Perpendicular to ramp (for normal force)
  const perpX = -Math.sin(theta);
  const perpY = -Math.cos(theta);
  // Along ramp upward direction
  // Ramp up direction (from base toward top in SVG coordinate space: x right, y down)
  const rampUpX = -Math.cos(theta);
  const rampUpY = -Math.sin(theta);

  // Angle arc at base
  const arcR = 40;
  const arcEndX = vertexBase.x + arcR * Math.cos(Math.PI - theta); // left side angle
  const arcEndY = vertexBase.y + arcR * (-Math.sin(Math.PI - theta));
  // simpler: arc from horizontal to hypotenuse
  const arcX2 = vertexBase.x + arcR;
  const arcY2 = vertexBase.y;
  const arcX1 = vertexBase.x + arcR * Math.cos(theta);
  const arcY1 = vertexBase.y - arcR * Math.sin(theta);

  // "LIFT" comparison on the right side
  const liftX = SVG_W - 60;
  const liftTopY = groundY - heightPx;
  const liftBotY = groundY - 34;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <marker id="ip-red" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#f87171" />
        </marker>
        <marker id="ip-emerald" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#34d399" />
        </marker>
        <marker id="ip-indigo" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#818cf8" />
        </marker>
        <marker id="ip-orange" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#fb923c" />
        </marker>
        <marker id="ip-amber" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#fbbf24" />
        </marker>
      </defs>

      {/* Ground line */}
      <line x1={0} y1={groundY} x2={SVG_W - 80} y2={groundY}
        stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      {Array.from({ length: 18 }, (_, i) => (
        <line key={i} x1={i * 30} y1={groundY} x2={i * 30 - 8} y2={groundY + 8}
          stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      ))}

      {/* Ramp triangle */}
      <polygon
        points={`${vertexBase.x},${vertexBase.y} ${vertexTop.x},${vertexTop.y} ${vertexRight.x},${vertexRight.y}`}
        fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth={2}
      />

      {/* Height dimension line */}
      <line x1={vertexBase.x - 14} y1={vertexTop.y} x2={vertexBase.x - 14} y2={vertexBase.y}
        stroke="#64748b" strokeWidth={1.2} strokeDasharray="3,2" />
      <line x1={vertexBase.x - 20} y1={vertexTop.y} x2={vertexBase.x - 8} y2={vertexTop.y}
        stroke="#64748b" strokeWidth={1.2} />
      <line x1={vertexBase.x - 20} y1={vertexBase.y} x2={vertexBase.x - 8} y2={vertexBase.y}
        stroke="#64748b" strokeWidth={1.2} />
      <text x={vertexBase.x - 22} y={(vertexTop.y + vertexBase.y) / 2 + 4}
        textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600}>
        h=2m
      </text>

      {/* Ramp length label on hypotenuse */}
      {(() => {
        const midX = (vertexTop.x + vertexRight.x) / 2 + 12;
        const midY = (vertexTop.y + vertexRight.y) / 2 - 8;
        return (
          <text x={midX} y={midY} fill="#818cf8" fontSize={10} fontWeight={600}>
            L = {physics.rampLen.toFixed(1)}m
          </text>
        );
      })()}

      {/* Angle arc */}
      <path
        d={`M ${arcX2} ${arcY2} A ${arcR} ${arcR} 0 0 0 ${arcX1} ${arcY1}`}
        fill="none" stroke="#fbbf24" strokeWidth={1.5}
      />
      <text x={vertexBase.x + arcR + 8} y={vertexBase.y - 8}
        fill="#fbbf24" fontSize={11} fontWeight={700}>
        {angleDeg}°
      </text>

      {/* Block on ramp */}
      {(() => {
        const bW = 28, bH = 18;
        const transform = `translate(${blockCx}, ${blockCy}) rotate(${-angleDeg})`;
        const massLabel = `${Math.round(physics.W / G)}kg`;
        return (
          <g transform={transform}>
            <rect x={-bW / 2} y={-bH} width={bW} height={bH} rx={3}
              fill="#1e293b" stroke="#475569" strokeWidth={1.5} />
            <text x={0} y={-bH / 2 + 4} textAnchor="middle" fill="#94a3b8" fontSize={8}>
              {massLabel}
            </text>
          </g>
        );
      })()}

      {/* Weight arrow (straight down) */}
      <line
        x1={blockCx} y1={blockCy}
        x2={blockCx} y2={blockCy + wLen}
        stroke="#f87171" strokeWidth={2.5} markerEnd="url(#ip-red)"
      />
      <text x={blockCx + 6} y={blockCy + wLen * 0.6}
        fill="#f87171" fontSize={10} fontWeight={600}>
        W={physics.W.toFixed(0)}N
      </text>

      {/* Normal force arrow (perpendicular to ramp) */}
      <line
        x1={blockCx} y1={blockCy}
        x2={blockCx + perpX * nLen} y2={blockCy + perpY * nLen}
        stroke="#34d399" strokeWidth={2.5} markerEnd="url(#ip-emerald)"
      />
      <text
        x={blockCx + perpX * nLen * 1.15}
        y={blockCy + perpY * nLen * 1.15}
        fill="#34d399" fontSize={10} fontWeight={600} textAnchor="middle"
      >
        N
      </text>

      {/* Force along ramp (up the ramp) */}
      <line
        x1={blockCx} y1={blockCy}
        x2={blockCx + rampUpX * fRampLen} y2={blockCy + rampUpY * fRampLen}
        stroke="#818cf8" strokeWidth={2.5} markerEnd="url(#ip-indigo)"
      />
      <text
        x={blockCx + rampUpX * fRampLen - 8}
        y={blockCy + rampUpY * fRampLen - 8}
        fill="#818cf8" fontSize={10} fontWeight={600}
      >
        F={physics.F_ramp.toFixed(0)}N
      </text>

      {/* Friction arrow (down the ramp, dashed) */}
      {physics.F_friction > 0.1 && (
        <line
          x1={blockCx} y1={blockCy}
          x2={blockCx - rampUpX * fFricLen} y2={blockCy - rampUpY * fFricLen}
          stroke="#fb923c" strokeWidth={2} strokeDasharray="5,3"
          markerEnd="url(#ip-orange)"
        />
      )}

      {/* Vertical divider */}
      <line x1={SVG_W - 95} y1={groundY - heightPx - 10} x2={SVG_W - 95} y2={groundY}
        stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4,3" />

      {/* LIFT comparison (right side) */}
      <text x={liftX} y={liftTopY - 8} textAnchor="middle" fill="#64748b" fontSize={10} fontWeight={600}>
        LIFT
      </text>
      {/* Weight box */}
      <rect x={liftX - 20} y={liftBotY - 28} width={40} height={28} rx={4}
        fill="#1e293b" stroke="#f87171" strokeWidth={1.5} />
      <text x={liftX} y={liftBotY - 10} textAnchor="middle" fill="#f87171" fontSize={10}>
        {physics.W.toFixed(0)}N
      </text>
      {/* Lift rope */}
      <line x1={liftX} y1={liftTopY} x2={liftX} y2={liftBotY - 28}
        stroke="#94a3b8" strokeWidth={1.8} />
      {/* Lift force arrow going up */}
      <line x1={liftX} y1={liftTopY + 10} x2={liftX} y2={liftTopY - 18}
        stroke="#fbbf24" strokeWidth={2.5} markerEnd="url(#ip-amber)" />
      <text x={liftX} y={liftTopY - 22} textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={600}>
        {physics.W.toFixed(0)}N
      </text>

      {/* Comparison label at bottom */}
      <text x={(SVG_W - 95) / 2} y={groundY + 18} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        Ramp: <tspan fill="#818cf8" fontWeight={700}>{physics.F_ramp.toFixed(0)} N</tspan>
        {"  vs  "}
        Lift: <tspan fill="#fbbf24" fontWeight={700}>{physics.W.toFixed(0)} N</tspan>
      </text>
    </svg>
  );
}

// ── Comparison bars ────────────────────────────────────────────────────────────

function ComparisonBars({ rampForce, liftForce }: { rampForce: number; liftForce: number }) {
  const max = liftForce;
  const bars = [
    { label: 'Ramp force', value: rampForce, color: '#818cf8' },
    { label: 'Lift force', value: liftForce, color: '#fbbf24' },
  ];
  return (
    <div style={{ marginTop: 10 }}>
      {bars.map(b => (
        <div key={b.label} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{b.label}</span>
            <span style={{ fontSize: 12, color: b.color, fontWeight: 700 }}>{b.value.toFixed(0)} N</span>
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (b.value / max) * 100)}%`,
              background: b.color,
              borderRadius: 5,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function InclinedPlaneSim() {
  const [angleDeg, setAngleDeg] = useState(20);
  const [mass, setMass] = useState(10);
  const [friction, setFriction] = useState(false);

  const phys = calcPhysics(angleDeg, mass, friction);

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
          Inclined Plane Explorer
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Compare the effort to push along a ramp vs lift straight up — ramp height is fixed at 2 m
        </p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT — SVG */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #060d1f 0%, #0a0e1a 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <RampDiagram angleDeg={angleDeg} physics={phys} />
          </div>

          {/* Key insight */}
          <div style={{
            marginTop: 12,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10,
            padding: '10px 14px',
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#818cf8' }}>Energy Conservation: </strong>
              Longer ramp (smaller angle) = less force, but more distance.
              Work = Force × Distance stays the same!
            </p>
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Angle slider */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                Angle θ
              </span>
              <span style={{ fontSize: 24, color: '#fbbf24', fontWeight: 800, lineHeight: 1 }}>
                {angleDeg}°
              </span>
            </div>
            <input
              type="range" min={5} max={60} value={angleDeg}
              onChange={e => setAngleDeg(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#fbbf24' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
              <span>5° (gentle)</span><span>60° (steep)</span>
            </div>
          </div>

          {/* Mass slider */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                Mass
              </span>
              <span style={{ fontSize: 18, color: '#f87171', fontWeight: 700 }}>
                {mass} kg
              </span>
            </div>
            <input
              type="range" min={2} max={50} value={mass}
              onChange={e => setMass(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f87171' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
              <span>2 kg</span><span>50 kg</span>
            </div>
          </div>

          {/* Friction toggle */}
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => setFriction(f => !f)}
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: 8,
                border: friction
                  ? '1px solid #fb923c'
                  : '1px solid rgba(255,255,255,0.1)',
                background: friction
                  ? 'rgba(251,146,60,0.15)'
                  : 'rgba(255,255,255,0.03)',
                color: friction ? '#fb923c' : '#94a3b8',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {friction ? 'Friction ON (μ = 0.2)' : 'Friction OFF (Frictionless)'}
            </button>
          </div>

          {/* Formula panel */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '14px 12px',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Formulas
            </p>
            {[
              {
                label: 'Weight',
                val: `${mass} × 9.8 = ${phys.W.toFixed(0)} N`,
                color: '#f87171',
              },
              {
                label: 'F_ramp = W × sin(θ)' + (friction ? ' + μN' : ''),
                val: `${phys.F_ramp.toFixed(1)} N`,
                color: '#818cf8',
              },
              {
                label: 'MA = 1/sin(θ)',
                val: phys.ma.toFixed(2),
                color: '#fbbf24',
              },
              {
                label: 'Ramp length = h/sin(θ)',
                val: `${phys.rampLen.toFixed(2)} m`,
                color: '#34d399',
              },
              ...(friction ? [{
                label: 'Friction = μ × N',
                val: `${phys.F_friction.toFixed(1)} N`,
                color: '#fb923c',
              }] : []),
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#64748b' }}>{row.label}</div>
                <div style={{ fontSize: 15, color: row.color, fontWeight: 700 }}>{row.val}</div>
              </div>
            ))}
          </div>

          {/* Comparison bars */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              Force Comparison
            </p>
            <ComparisonBars rampForce={phys.F_ramp} liftForce={phys.W} />
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
              Work to move up = {(phys.W * FIXED_HEIGHT).toFixed(0)} J either way
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
