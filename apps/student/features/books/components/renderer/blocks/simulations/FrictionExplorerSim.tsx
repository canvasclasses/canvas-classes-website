'use client';

// Friction Explorer — Chapter 10: Friction
// Demonstrates static vs kinetic friction on different surfaces.
// Academic accuracy: static friction ≤ μ_s × N; kinetic friction = μ_k × N.
// Object is stationary when push < max static friction; moving otherwise.

import { useState } from 'react';

type SurfaceKey = 'ice' | 'wood' | 'rubber' | 'sand' | 'concrete';

interface SurfaceData {
  label: string;
  mu_s: number;
  mu_k: number;
  color: string;
  emoji: string;
}

const SURFACES: Record<SurfaceKey, SurfaceData> = {
  ice:      { label: 'Ice',      mu_s: 0.10, mu_k: 0.05, color: '#93c5fd', emoji: '🧊' },
  wood:     { label: 'Wood',     mu_s: 0.40, mu_k: 0.30, color: '#d97706', emoji: '🪵' },
  rubber:   { label: 'Rubber',   mu_s: 0.80, mu_k: 0.65, color: '#f87171', emoji: '🔴' },
  sand:     { label: 'Sand',     mu_s: 0.55, mu_k: 0.45, color: '#fbbf24', emoji: '🏖️' },
  concrete: { label: 'Concrete', mu_s: 0.60, mu_k: 0.50, color: '#94a3b8', emoji: '🧱' },
};

const SURFACE_KEYS = Object.keys(SURFACES) as SurfaceKey[];

const g = 9.8; // m/s²

export default function FrictionExplorerSim() {
  const [surface, setSurface] = useState<SurfaceKey>('wood');
  const [mass, setMass]       = useState(5);
  const [pushForce, setPush]  = useState(30);

  const s = SURFACES[surface];
  const N          = mass * g;
  const maxStatic  = s.mu_s * N;
  const kinetic    = s.mu_k * N;
  const isMoving   = pushForce >= maxStatic;
  const frictionF  = isMoving ? kinetic : pushForce; // static exactly balances push
  const netForce   = isMoving ? pushForce - kinetic : 0;
  const accel      = isMoving ? netForce / mass : 0;

  // ── SVG layout ──────────────────────────────────────────────────────────────
  const SVG_W = 500, SVG_H = 240;
  const groundY   = SVG_H - 50;
  const BLOCK_W   = isMoving ? 58 : 50; // slight stretch when moving
  const BLOCK_H   = 40;
  const blockX    = SVG_W / 2 - (isMoving ? 34 : 25);
  const blockY    = groundY - BLOCK_H;
  const bCx       = blockX + BLOCK_W / 2;
  const bCy       = blockY + BLOCK_H / 2;

  // Arrow scale: max arrow pixel length 90
  const pushScale = pushForce > 0 ? Math.max(12, Math.min(90, pushForce * 0.5)) : 0;
  const fricScale = frictionF > 0 ? Math.max(8, Math.min(90, frictionF * 0.5)) : 0;
  const normScale = Math.min(70, N * 0.08);
  const wgtScale  = Math.min(70, N * 0.08);

  // Arrow endpoints
  const pushArrowX1 = blockX - 10;
  const pushArrowX2 = blockX - 10 - pushScale;
  const fricArrowX1 = blockX + BLOCK_W + 10;
  const fricArrowX2 = blockX + BLOCK_W + 10 + fricScale;
  const normArrowY1 = blockY - 6;
  const normArrowY2 = blockY - 6 - normScale;
  const wgtArrowY1  = groundY + 4;
  const wgtArrowY2  = groundY + 4 + wgtScale;

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, maxWidth: 940, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Friction Explorer
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Explore static vs kinetic friction on different surfaces — Ch 10
        </p>
      </div>

      {/* Body — responsive flex */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT — SVG visualization */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(160deg, #060d1f 0%, #0a0e1a 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }}>
              <defs>
                <marker id="fr-push-arrow" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#818cf8" />
                </marker>
                <marker id="fr-fric-arrow" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M7,0 L0,3.5 L7,7 Z" fill="#fb923c" />
                </marker>
                <marker id="fr-norm-arrow" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,7 L3.5,0 L7,7 Z" fill="#34d399" />
                </marker>
                <marker id="fr-wgt-arrow" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#f87171" />
                </marker>
                {isMoving && (
                  <filter id="fr-motion-blur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3 0" />
                  </filter>
                )}
              </defs>

              {/* Surface color strip */}
              <rect x={0} y={groundY} width={SVG_W} height={SVG_H - groundY}
                fill={s.color} opacity={0.15} />
              <line x1={0} y1={groundY} x2={SVG_W} y2={groundY}
                stroke={s.color} strokeWidth={2} opacity={0.5} />
              {/* Surface hash marks */}
              {Array.from({ length: 22 }, (_, i) => (
                <line key={i}
                  x1={i * 24} y1={groundY}
                  x2={i * 24 - 8} y2={groundY + 10}
                  stroke={s.color} strokeWidth={1} opacity={0.25} />
              ))}

              {/* Block — motion blur ghost when moving */}
              {isMoving && (
                <rect
                  x={blockX - 14} y={blockY} width={BLOCK_W + 8} height={BLOCK_H}
                  rx={4} fill="#1e293b" opacity={0.25}
                  filter="url(#fr-motion-blur)"
                />
              )}

              {/* Block */}
              <rect x={blockX} y={blockY} width={BLOCK_W} height={BLOCK_H}
                rx={4} fill="#1e293b" stroke={isMoving ? '#6366f1' : '#334155'} strokeWidth={2} />
              <line x1={blockX + BLOCK_W / 2} y1={blockY}
                x2={blockX + BLOCK_W / 2} y2={blockY + BLOCK_H}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <line x1={blockX} y1={blockY + BLOCK_H / 2}
                x2={blockX + BLOCK_W} y2={blockY + BLOCK_H / 2}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              {/* Mass label on block */}
              <text x={bCx} y={bCy + 4} textAnchor="middle"
                fill="#94a3b8" fontSize={11} fontWeight={600}>{mass} kg</text>

              {/* Push force arrow (pointing right, drawn from left of block leftward then arrowhead right) */}
              {pushForce > 0 && (
                <>
                  <line x1={pushArrowX1} y1={bCy}
                    x2={pushArrowX2} y2={bCy}
                    stroke="#818cf8" strokeWidth={2.5}
                    markerEnd="url(#fr-push-arrow)"
                    markerStart="none"
                  />
                  {/* Re-draw with correct direction: arrow points right (push is rightward) */}
                  <line x1={pushArrowX2} y1={bCy}
                    x2={pushArrowX1} y2={bCy}
                    stroke="#818cf8" strokeWidth={2.5}
                    markerEnd="url(#fr-push-arrow)"
                  />
                  <text x={pushArrowX2 - 2} y={bCy - 8}
                    textAnchor="middle" fill="#818cf8" fontSize={9} fontWeight={600}>
                    F = {pushForce} N
                  </text>
                </>
              )}

              {/* Friction arrow (pointing left, opposing motion) */}
              {frictionF > 0 && (
                <>
                  <line x1={fricArrowX1} y1={bCy}
                    x2={fricArrowX2} y2={bCy}
                    stroke="#fb923c" strokeWidth={2.5}
                    markerEnd="url(#fr-fric-arrow)"
                  />
                  <text x={fricArrowX2 + 2} y={bCy - 8}
                    textAnchor="middle" fill="#fb923c" fontSize={9} fontWeight={600}>
                    f = {frictionF.toFixed(1)} N
                  </text>
                </>
              )}

              {/* Normal force (upward) */}
              <line x1={bCx} y1={normArrowY1}
                x2={bCx} y2={normArrowY2}
                stroke="#34d399" strokeWidth={2.5}
                markerEnd="url(#fr-norm-arrow)"
              />
              <text x={bCx + 8} y={normArrowY2 + 4}
                fill="#34d399" fontSize={9} fontWeight={600}>
                N = {N.toFixed(1)} N
              </text>

              {/* Weight (downward) */}
              <line x1={bCx} y1={wgtArrowY1}
                x2={bCx} y2={wgtArrowY2}
                stroke="#f87171" strokeWidth={2.5}
                markerEnd="url(#fr-wgt-arrow)"
              />
              <text x={bCx + 8} y={wgtArrowY2 - 2}
                fill="#f87171" fontSize={9} fontWeight={600}>
                W = {N.toFixed(1)} N
              </text>

              {/* Status label */}
              <rect x={10} y={SVG_H - 28} width={SVG_W - 20} height={22}
                rx={6} fill="rgba(0,0,0,0.4)" />
              {isMoving ? (
                <text x={SVG_W / 2} y={SVG_H - 13} textAnchor="middle"
                  fill="#818cf8" fontSize={11} fontWeight={700}>
                  {'⚡ MOVING  a = ' + accel.toFixed(2) + ' m/s²  |  Net F = ' + netForce.toFixed(1) + ' N'}
                </text>
              ) : (
                <text x={SVG_W / 2} y={SVG_H - 13} textAnchor="middle"
                  fill="#34d399" fontSize={11} fontWeight={700}>
                  {'⚖️ STATIONARY  f = F_push  (static friction balances push)'}
                </text>
              )}
            </svg>
          </div>

          {/* Key insight */}
          <div style={{
            marginTop: 12,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10, padding: '10px 14px',
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#818cf8' }}>Key Insight: </strong>
              Static friction is always ≥ kinetic friction. That&apos;s why it&apos;s harder to
              START sliding than to KEEP sliding.
            </p>
          </div>
        </div>

        {/* RIGHT — controls */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Surface selector */}
          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: '#64748b', margin: '0 0 8px',
          }}>Surface</p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 6, marginBottom: 20,
          }}>
            {SURFACE_KEYS.map(k => (
              <button key={k} onClick={() => setSurface(k)} style={{
                padding: '7px 8px', borderRadius: 8, cursor: 'pointer',
                border: surface === k
                  ? `1px solid ${SURFACES[k].color}`
                  : '1px solid rgba(255,255,255,0.08)',
                background: surface === k
                  ? `${SURFACES[k].color}20`
                  : 'rgba(255,255,255,0.03)',
                color: surface === k ? SURFACES[k].color : '#94a3b8',
                fontSize: 12, fontWeight: 600, textAlign: 'left',
              }}>
                {SURFACES[k].emoji} {SURFACES[k].label}
              </button>
            ))}
          </div>

          {/* Mass slider */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Mass (kg)</span>
              <span style={{ fontSize: 14, color: '#34d399', fontWeight: 700 }}>{mass}</span>
            </div>
            <input type="range" min={2} max={20} value={mass}
              onChange={e => setMass(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#34d399' }} />
          </div>

          {/* Push force slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Push Force (N)</span>
              <span style={{ fontSize: 14, color: '#818cf8', fontWeight: 700 }}>{pushForce}</span>
            </div>
            <input type="range" min={0} max={200} value={pushForce}
              onChange={e => setPush(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#818cf8' }} />
          </div>

          {/* Surface data card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '12px', marginBottom: 14,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#64748b', margin: '0 0 10px',
            }}>
              {s.emoji} {s.label} — Friction Coefficients
            </p>
            {[
              { label: 'μ_s (static)',  val: s.mu_s, color: '#818cf8' },
              { label: 'μ_k (kinetic)', val: s.mu_k, color: '#fb923c' },
              { label: 'Max static f', val: maxStatic.toFixed(1) + ' N', color: '#818cf8' },
              { label: 'Kinetic f',    val: kinetic.toFixed(1) + ' N',   color: '#fb923c' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 6, alignItems: 'center',
              }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.color }}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* Live state */}
          <div style={{
            background: isMoving ? 'rgba(99,102,241,0.08)' : 'rgba(52,211,153,0.08)',
            border: `1px solid ${isMoving ? 'rgba(99,102,241,0.3)' : 'rgba(52,211,153,0.3)'}`,
            borderRadius: 10, padding: '12px',
          }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#64748b', margin: '0 0 8px',
            }}>Status</p>
            <p style={{
              margin: 0, fontSize: 14, fontWeight: 700,
              color: isMoving ? '#818cf8' : '#34d399',
            }}>
              {isMoving ? '⚡ Moving' : '⚖️ Stationary'}
            </p>
            {isMoving && (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>
                Acceleration: <strong style={{ color: '#818cf8' }}>{accel.toFixed(2)} m/s²</strong>
              </p>
            )}
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>
              Friction: <strong style={{ color: '#fb923c' }}>{frictionF.toFixed(1)} N</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
