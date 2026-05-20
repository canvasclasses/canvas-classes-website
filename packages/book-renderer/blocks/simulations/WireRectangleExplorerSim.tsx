'use client';

// WireRectangleExplorerSim.tsx
// Class 9 Mathematics — Chapter 2 — Page 2 (Building Expressions)
// A wire of fixed length 20 cm is bent into rectangles. The student slides x
// (length), and the rectangle reshapes live: width = 10 - x.
// A small coordinate plot shows area = 10x - x² as a curve, with the current
// (x, area) point highlighted. Predict-the-max challenge teases quadratic
// behaviour the student will meet in higher chapters.

import { useState, useCallback, useMemo } from 'react';

const PERIMETER = 20;       // cm of wire
const HALF = 10;            // x + width = HALF

export default function WireRectangleExplorerSim() {
  const [x, setX] = useState(7);
  const [predictedMaxX, setPredictedMaxX] = useState<number | null>(null);
  const [showActualMax, setShowActualMax] = useState(false);

  const width = HALF - x;
  const area = x * (HALF - x);

  // SVG dimensions for the rectangle stage
  const STAGE_W = 360;
  const STAGE_H = 200;
  const SCALE = 30;            // px per cm
  const drawX = x * SCALE;
  const drawW = Math.max(0, width) * SCALE;

  // Curve plot dimensions
  const PLOT_W = 360;
  const PLOT_H = 200;
  const X_AX = { min: 0, max: HALF };
  const Y_AX = { min: 0, max: 30 }; // max area = 25 at x=5; round up

  function pX(xv: number) { return 30 + (xv - X_AX.min) / (X_AX.max - X_AX.min) * (PLOT_W - 60); }
  function pY(yv: number) { return PLOT_H - 30 - (yv - Y_AX.min) / (Y_AX.max - Y_AX.min) * (PLOT_H - 60); }

  // Pre-compute the curve path
  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const xv = X_AX.min + (X_AX.max - X_AX.min) * i / 100;
      const yv = xv * (HALF - xv);
      pts.push(`${i === 0 ? 'M' : 'L'} ${pX(xv)} ${pY(yv)}`);
    }
    return pts.join(' ');
  }, []);

  // Show the (x, area) marker
  const markerX = pX(x);
  const markerY = pY(area);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Wire-Rectangle <span style={{ color: '#f59e0b' }}>Explorer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Area = 10x − x² · Class 9 Mathematics
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        A wire of length <b>20 cm</b> is bent into a rectangle. Pick the length <b style={{ color: '#fbbf24' }}>x</b>; the width must be <b>(10 − x)</b> cm to use up exactly the same wire. The rectangle reshapes live, and the area is computed for you.
      </p>

      {/* Live rectangle stage */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14, padding: 8,
      }}>
        <svg width="100%" viewBox={`0 0 ${STAGE_W + 60} ${STAGE_H + 30}`} style={{ display: 'block' }}>
          {/* Rectangle */}
          {drawW > 0 && (
            <rect x={30} y={(STAGE_H - drawW) / 2 + 15}
              width={drawX} height={drawW}
              fill="rgba(245,158,11,0.18)" stroke="#fbbf24" strokeWidth={2.5} />
          )}
          {/* Length label */}
          <text x={30 + drawX / 2} y={(STAGE_H - drawW) / 2 + 15 - 8}
            fill="#fbbf24" fontSize={12} fontWeight={700} textAnchor="middle">
            x = {x} cm
          </text>
          {/* Width label */}
          {drawW > 0 && (
            <text x={30 + drawX + 8} y={(STAGE_H - drawW) / 2 + 15 + drawW / 2}
              fill="#fbbf24" fontSize={12} fontWeight={700} alignmentBaseline="middle">
              {width} cm
            </text>
          )}
        </svg>
      </div>

      {/* Slider */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center', marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Length x:</label>
        <input type="range" min={0.5} max={9.5} step={0.5} value={x}
          onChange={e => setX(parseFloat(e.target.value))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{x} cm</span>
      </div>

      {/* Live area readout */}
      <div style={{
        borderRadius: 10, padding: '12px 14px', marginBottom: 14,
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Live area
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
          Area = x × (10 − x) = <b>{x}</b> × <b>{width}</b> = <b style={{ color: '#fbbf24' }}>{area} sq cm</b>
          <br />
          Equivalently: 10x − x² = 10×{x} − {x}² = {10 * x} − {x * x} = <b style={{ color: '#fbbf24' }}>{area}</b>
        </p>
      </div>

      {/* Curve plot */}
      <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Area as a function of length (x ranges 0 → 10)
      </p>
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg width="100%" viewBox={`0 0 ${PLOT_W + 30} ${PLOT_H}`} style={{ display: 'block' }}>
          {/* Axes */}
          <line x1={pX(0)} y1={pY(0)} x2={pX(HALF)} y2={pY(0)} stroke="#fbbf24" strokeWidth={1.5} />
          <line x1={pX(0)} y1={pY(0)} x2={pX(0)} y2={pY(Y_AX.max)} stroke="#fbbf24" strokeWidth={1.5} />
          {/* Curve */}
          <path d={curvePath} stroke="#a78bfa" strokeWidth={2.5} fill="none" />
          {/* Marker */}
          <line x1={markerX} y1={pY(0)} x2={markerX} y2={markerY} stroke="rgba(245,158,11,0.45)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={pX(0)} y1={markerY} x2={markerX} y2={markerY} stroke="rgba(245,158,11,0.45)" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={markerX} cy={markerY} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} />
          <text x={markerX + 8} y={markerY - 8} fill="#fbbf24" fontSize={11} fontWeight={700}>({x}, {area})</text>
          {/* Axis labels */}
          {[0, 2, 4, 6, 8, 10].map(v => (
            <text key={v} x={pX(v)} y={pY(0) + 14} fill="#94a3b8" fontSize={9} textAnchor="middle">{v}</text>
          ))}
          {[0, 5, 10, 15, 20, 25].map(v => (
            <text key={v} x={pX(0) - 6} y={pY(v) + 3} fill="#94a3b8" fontSize={9} textAnchor="end">{v}</text>
          ))}
          <text x={pX(HALF)} y={pY(0) + 28} fill="#fbbf24" fontSize={10} fontWeight={700} textAnchor="end">x (length, cm)</text>
          <text x={pX(0) - 22} y={pY(Y_AX.max) + 6} fill="#fbbf24" fontSize={10} fontWeight={700}>area</text>
        </svg>
      </div>

      {/* Predict-the-max challenge */}
      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.25)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', margin: 0, marginBottom: 6 }}>
          Predict First — Where is the area biggest?
        </p>
        {predictedMaxX === null ? (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => (
              <button key={v} onClick={() => setPredictedMaxX(v)}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.08)', color: '#c7d2fe',
                }}>x = {v}</button>
            ))}
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
              You predicted <b>x = {predictedMaxX}</b> (area would be <b>{predictedMaxX * (HALF - predictedMaxX)}</b> sq cm).
            </p>
            {showActualMax ? (
              <p style={{ fontSize: 13, color: '#a78bfa', margin: 0, marginTop: 6, lineHeight: 1.6 }}>
                The area is largest at <b>x = 5</b> (the wire forms a <b>square</b>!), giving the maximum area of <b>25 sq cm</b>. Notice that 10x − x² is *not* a linear polynomial — it's <b>quadratic</b>. You'll meet quadratics formally in a later chapter.
              </p>
            ) : (
              <button onClick={() => setShowActualMax(true)}
                style={{
                  marginTop: 8, padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.12)', color: '#c7d2fe',
                }}>
                Reveal the actual maximum →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
