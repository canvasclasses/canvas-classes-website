'use client';

/**
 * VelocityTimeGraphSim — Interactive v-t Graph Builder
 *
 * Academic source: NCERT Class 9 Science, Chapter 8 — Motion
 * Demonstrates: v = u + at, s = ut + ½at², area under v-t graph = displacement,
 *               slope of v-t graph = acceleration
 */

import { useState, useMemo } from 'react';

/* ── Layout constants ──────────────────────────────────────────────────── */

const SVG_W = 400;
const SVG_H = 260;
const PLOT_L = 55;
const PLOT_T = 20;
const PLOT_W = 310;
const PLOT_H = 200;
const PLOT_R = PLOT_L + PLOT_W;
const PLOT_B = PLOT_T + PLOT_H;

/* ── Styles ─────────────────────────────────────────────────────────────── */

const ROOT: React.CSSProperties = {
  background: '#050a14',
  borderRadius: 16,
  padding: 24,
  maxWidth: 900,
  margin: '0 auto',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#e2e8f0',
};

const CARD: React.CSSProperties = {
  background: '#0d1117',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '12px 16px',
};

const STAT_CARD: React.CSSProperties = {
  background: '#0d1117',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  padding: '10px 12px',
  textAlign: 'center',
};

const INSIGHT: React.CSSProperties = {
  background: 'rgba(245,158,11,0.08)',
  border: '1px solid rgba(245,158,11,0.2)',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 13,
  color: '#e2e8f0',
  lineHeight: 1.6,
  marginTop: 16,
};

const SLIDER_ROW: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 10,
};

const LABEL_COL: React.CSSProperties = {
  width: 150,
  fontSize: 13,
  color: '#94a3b8',
  flexShrink: 0,
};

const VALUE_COL: React.CSSProperties = {
  width: 72,
  fontSize: 13,
  color: '#f59e0b',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
  flexShrink: 0,
};

/* ── Component ──────────────────────────────────────────────────────────── */

export default function VelocityTimeGraphSim() {
  const [u, setU] = useState(10);       // initial velocity m/s
  const [a, setA] = useState(3);        // acceleration m/s²
  const [tMax, setTMax] = useState(6);  // time s

  const vFinal = useMemo(() => u + a * tMax, [u, a, tMax]);
  const displacement = useMemo(() => u * tMax + 0.5 * a * tMax * tMax, [u, a, tMax]);

  /* ── Coordinate helpers ─────────────────────────────────────────────── */

  const vMin = Math.min(0, u, vFinal);
  const vMax = Math.max(0, u, vFinal);
  const rawSpan = vMax - vMin;
  const span = Math.max(rawSpan, 8);
  const pad = span * 0.15;
  const yLo = vMin - pad;
  const yHi = vMax + pad;
  const yRange = yHi - yLo;

  const plotX = (t: number) => PLOT_L + (t / tMax) * PLOT_W;
  const plotY = (v: number) => PLOT_B - ((v - yLo) / yRange) * PLOT_H;

  /* ── Zero line ─────────────────────────────────────────────────────── */
  const zeroY = plotY(0);
  const zeroIsXAxis = Math.abs(zeroY - PLOT_B) < 1;

  /* ── Shaded area path ───────────────────────────────────────────────── */
  // Determine if velocity crosses zero
  const crossesZero = (u > 0 && vFinal < 0) || (u < 0 && vFinal > 0);
  const tCross = crossesZero && a !== 0 ? -u / a : null;

  const x0 = plotX(0);
  const xEnd = plotX(tMax);
  const y0 = plotY(u);
  const yEnd = plotY(vFinal);
  const yZero = plotY(0);

  let shadedPaths: { d: string; fill: string }[] = [];

  if (!crossesZero) {
    // Single shaded region
    const fill =
      u >= 0 && vFinal >= 0
        ? 'rgba(52,211,153,0.15)'
        : 'rgba(248,113,113,0.15)';
    const d = `M ${x0} ${y0} L ${xEnd} ${yEnd} L ${xEnd} ${yZero} L ${x0} ${yZero} Z`;
    shadedPaths = [{ d, fill }];
  } else if (tCross !== null && a !== 0) {
    const xCross = plotX(tCross);
    // Positive portion (0 → tCross)
    const dPos = `M ${x0} ${y0} L ${xCross} ${yZero} L ${xCross} ${yZero} L ${x0} ${yZero} Z`;
    // Negative portion (tCross → tMax)
    const dNeg = `M ${xCross} ${yZero} L ${xEnd} ${yEnd} L ${xEnd} ${yZero} L ${xCross} ${yZero} Z`;
    shadedPaths = [
      { d: dPos, fill: u >= 0 ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)' },
      { d: dNeg, fill: u >= 0 ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)' },
    ];
  }

  /* ── Slope triangle ─────────────────────────────────────────────────── */
  // Place triangle at 50%–75% of time range
  const tA = tMax * 0.5;
  const tB = tMax * 0.75;
  const vA = u + a * tA;
  const vB = u + a * tB;
  const triX1 = plotX(tA);
  const triY1 = plotY(vA);
  const triX2 = plotX(tB);
  const triY2 = plotY(vB);
  // Right angle corner is at (triX2, triY1)
  const triCornerX = triX2;
  const triCornerY = triY1;

  /* ── Y-axis tick labels (3 values) ─────────────────────────────────── */
  const yTick0 = yLo + yRange * 0.1;
  const yTick1 = yLo + yRange * 0.5;
  const yTick2 = yLo + yRange * 0.9;

  /* ── Area label center ──────────────────────────────────────────────── */
  const areaLabelX = PLOT_L + PLOT_W * 0.35;
  const areaLabelY = plotY((u + vFinal) / 2 / 2 + yLo / 4);

  return (
    <div style={ROOT}>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
          Velocity–Time Graph
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8' }}>
          Explore how initial velocity, acceleration, and time shape the v-t graph
        </div>
      </div>

      {/* SVG Graph */}
      <div style={{ ...CARD, padding: '16px 8px 8px' }}>
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block' }}
        >
          {/* Vertical dashed gridlines */}
          {[0.25, 0.5, 0.75].map((frac) => {
            const gx = plotX(tMax * frac);
            return (
              <line
                key={frac}
                x1={gx} y1={PLOT_T} x2={gx} y2={PLOT_B}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Shaded areas */}
          {shadedPaths.map((p, i) => (
            <path key={i} d={p.d} fill={p.fill} />
          ))}

          {/* Zero line (dashed) if not the x-axis */}
          {!zeroIsXAxis && (
            <line
              x1={PLOT_L} y1={zeroY} x2={PLOT_R} y2={zeroY}
              stroke="#475569"
              strokeWidth={1}
              strokeDasharray="5 4"
            />
          )}

          {/* X axis */}
          <line x1={PLOT_L} y1={PLOT_B} x2={PLOT_R} y2={PLOT_B} stroke="#334155" strokeWidth={1.5} />
          {/* Y axis */}
          <line x1={PLOT_L} y1={PLOT_T} x2={PLOT_L} y2={PLOT_B} stroke="#334155" strokeWidth={1.5} />

          {/* Velocity line */}
          <line
            x1={x0} y1={y0}
            x2={xEnd} y2={yEnd}
            stroke="#f59e0b"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Slope triangle */}
          <line
            x1={triX1} y1={triY1}
            x2={triCornerX} y2={triCornerY}
            stroke="#f59e0b"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            opacity={0.7}
          />
          <line
            x1={triCornerX} y1={triCornerY}
            x2={triX2} y2={triY2}
            stroke="#f59e0b"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            opacity={0.7}
          />
          {/* Right angle mark */}
          <rect
            x={triCornerX - 5}
            y={triY1 < triY2 ? triCornerY : triCornerY - 5}
            width={5}
            height={5}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={0.8}
            opacity={0.5}
          />
          {/* Δv label */}
          <text
            x={triCornerX + 4}
            y={(triY1 + triY2) / 2}
            fill="#f59e0b"
            fontSize={10}
            opacity={0.85}
          >
            Δv
          </text>
          {/* Δt label */}
          <text
            x={(triX1 + triX2) / 2 - 6}
            y={triCornerY + 12}
            fill="#f59e0b"
            fontSize={10}
            opacity={0.85}
          >
            Δt
          </text>

          {/* Area label */}
          <text
            x={areaLabelX}
            y={Math.max(PLOT_T + 30, Math.min(PLOT_B - 10, plotY((u + vFinal) / 2)))}
            fill="#94a3b8"
            fontSize={9.5}
            textAnchor="middle"
            opacity={0.8}
          >
            Area = displacement
          </text>

          {/* Endpoint dots */}
          <circle cx={x0} cy={y0} r={4} fill="#f59e0b" />
          <circle cx={xEnd} cy={yEnd} r={4} fill="#f59e0b" />

          {/* X-axis tick labels */}
          {[0, 0.5, 1].map((frac) => {
            const t = tMax * frac;
            const tx = plotX(t);
            return (
              <g key={frac}>
                <line x1={tx} y1={PLOT_B} x2={tx} y2={PLOT_B + 4} stroke="#334155" strokeWidth={1} />
                <text x={tx} y={PLOT_B + 14} fill="#94a3b8" fontSize={10} textAnchor="middle">
                  {t.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Y-axis tick labels */}
          {[yTick0, yTick1, yTick2].map((v, i) => {
            const ty = plotY(v);
            return (
              <g key={i}>
                <line x1={PLOT_L - 4} y1={ty} x2={PLOT_L} y2={ty} stroke="#334155" strokeWidth={1} />
                <text x={PLOT_L - 6} y={ty + 4} fill="#94a3b8" fontSize={10} textAnchor="end">
                  {v.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={PLOT_L - 40}
            y={PLOT_T + PLOT_H / 2}
            fill="#94a3b8"
            fontSize={11}
            textAnchor="middle"
            transform={`rotate(-90, ${PLOT_L - 40}, ${PLOT_T + PLOT_H / 2})`}
          >
            Velocity (m/s)
          </text>
          <text
            x={PLOT_L + PLOT_W / 2}
            y={SVG_H - 4}
            fill="#94a3b8"
            fontSize={11}
            textAnchor="middle"
          >
            Time (s)
          </text>
        </svg>
      </div>

      {/* Sliders */}
      <div style={{ ...CARD, marginTop: 12 }}>
        {/* Initial velocity */}
        <div style={SLIDER_ROW}>
          <span style={LABEL_COL}>Initial velocity u</span>
          <input
            type="range"
            min={0} max={30} step={1}
            value={u}
            onChange={(e) => setU(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#f59e0b' }}
          />
          <span style={VALUE_COL}>{u} m/s</span>
        </div>

        {/* Acceleration */}
        <div style={SLIDER_ROW}>
          <span style={LABEL_COL}>Acceleration a</span>
          <input
            type="range"
            min={-8} max={10} step={0.5}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#f59e0b' }}
          />
          <span style={VALUE_COL}>{a > 0 ? '+' : ''}{a} m/s²</span>
        </div>

        {/* Time */}
        <div style={{ ...SLIDER_ROW, marginBottom: 0 }}>
          <span style={LABEL_COL}>Time t</span>
          <input
            type="range"
            min={2} max={12} step={1}
            value={tMax}
            onChange={(e) => setTMax(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#f59e0b' }}
          />
          <span style={VALUE_COL}>{tMax} s</span>
        </div>
      </div>

      {/* Info panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12 }}>
        <div style={STAT_CARD}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Final Velocity v</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
            {vFinal.toFixed(1)}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>m/s</div>
        </div>
        <div style={STAT_CARD}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Displacement s</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#34d399', fontVariantNumeric: 'tabular-nums' }}>
            {displacement.toFixed(1)}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>m</div>
        </div>
        <div style={STAT_CARD}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Equations used</div>
          <div style={{ fontSize: 10, color: '#e2e8f0', lineHeight: 1.7, fontFamily: 'monospace' }}>
            <div>v = u + at</div>
            <div>s = ut + ½at²</div>
            <div>v² = u² + 2as</div>
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div style={INSIGHT}>
        The <strong>area under a v-t graph</strong> always equals displacement. The <strong>slope</strong> always equals acceleration.
      </div>
    </div>
  );
}
