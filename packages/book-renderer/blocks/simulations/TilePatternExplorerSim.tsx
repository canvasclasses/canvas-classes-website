'use client';

// TilePatternExplorerSim.tsx
// Class 9 Mathematics — Chapter 2 — Page 7 (Linear Patterns)
// Visualises the NCERT Fig 2.4 "L-shaped staircase" tile pattern. Click to add
// or remove a stage. The number of squares at stage n follows 2n − 1.
// "Custom pattern" mode lets the student define a + d(n−1) and watch the formula
// emerge from the picture.

import { useState, useCallback, useMemo } from 'react';

const TILE_PX = 22;
const STAGE_GAP = 16;

// L-shape: stage n has 1 base square + (n-1) right tiles + (n-1) top tiles
function tilesForStage(n: number): { x: number; y: number }[] {
  // Returns grid coords (col, row) for each tile in the L for stage n.
  // base at (0, 0). Column extends down (positive y in screen), row extends right.
  // Wait — NCERT figure 2.4: stage 1 = single square; stage 2 = base + 1 right + 1 top
  // (forms an L-tromino); stage 3 has more right + more top.
  // Actually re-reading: stage 1 = 1, stage 2 = 3, stage 3 = 5, stage 4 = 7
  // → 2n − 1.
  // Visual: stage n has a column of n squares stacked vertically PLUS (n-1) extra
  // squares stacked horizontally to the right of the base. Total = n + (n-1) = 2n-1.
  const tiles: { x: number; y: number }[] = [];
  // Vertical stack (n squares going up): at column 0, rows 0 .. -(n-1)
  for (let i = 0; i < n; i++) tiles.push({ x: 0, y: -i });
  // Horizontal extension at base: columns 1 .. n-1, row 0
  for (let i = 1; i < n; i++) tiles.push({ x: i, y: 0 });
  return tiles;
}

export default function TilePatternExplorerSim() {
  const [stage, setStage] = useState(3);
  const [showFormula, setShowFormula] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [a, setA] = useState(1);   // first term
  const [d, setD] = useState(2);   // common difference

  const count = 2 * stage - 1;

  // For drawing
  const tiles = useMemo(() => tilesForStage(stage), [stage]);
  const maxX = stage - 1;
  const maxY = stage - 1;
  const stageW = (maxX + 1) * TILE_PX;
  const stageH = (maxY + 1) * TILE_PX;
  const SVG_PAD = 16;
  const SVG_W = stageW + SVG_PAD * 2;
  const SVG_H = stageH + SVG_PAD * 2;

  const sequence = customMode
    ? Array.from({ length: 7 }, (_, i) => a + d * i)
    : Array.from({ length: 7 }, (_, i) => 2 * (i + 1) - 1);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Tile-Pattern <span style={{ color: '#f59e0b' }}>Explorer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          The L-Staircase Pattern · Class 9 Mathematics
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        Click <b>Add Stage</b> to grow the L-shape one stage at a time. The squares are added in a fixed pattern. Watch the count: <b>1, 3, 5, 7, …</b> — the differences are constant. The formula emerges from the picture.
      </p>

      {/* Stage rendering */}
      <div style={{
        borderRadius: 12, padding: '20px 14px', marginBottom: 14,
        background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
        overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: STAGE_GAP, justifyContent: 'center', minHeight: stageH + 30 }}>
          <svg width={SVG_W} height={SVG_H}>
            {tiles.map((t, i) => {
              const px = SVG_PAD + t.x * TILE_PX;
              // y = -(stage-1) ... 0 → screen-y = SVG_H - PAD - TILE_PX - (-y)*TILE_PX
              const py = SVG_H - SVG_PAD - TILE_PX + t.y * TILE_PX;
              return (
                <rect key={i} x={px} y={py} width={TILE_PX - 1} height={TILE_PX - 1}
                  fill="rgba(245,158,11,0.6)" stroke="#fbbf24" strokeWidth={1.2} />
              );
            })}
          </svg>
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 10, marginBottom: 0 }}>
          Stage <b style={{ color: '#fbbf24', fontSize: 16 }}>{stage}</b> · <b style={{ color: '#fbbf24' }}>{count}</b> tiles
        </p>
      </div>

      {/* Stage controls */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
        <button onClick={() => setStage(Math.max(1, stage - 1))} disabled={stage <= 1}
          style={{
            padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700,
            cursor: stage <= 1 ? 'not-allowed' : 'pointer',
            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
            color: stage <= 1 ? '#475569' : '#94a3b8',
          }}>← Back</button>
        <button onClick={() => setStage(Math.min(8, stage + 1))} disabled={stage >= 8}
          style={{
            padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700,
            cursor: stage >= 8 ? 'not-allowed' : 'pointer',
            border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)',
            color: stage >= 8 ? '#475569' : '#fbbf24',
          }}>Add Stage →</button>
        <button onClick={() => setStage(1)}
          style={{
            padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
          }}>Reset</button>
      </div>

      {/* Sequence display */}
      <div style={{
        borderRadius: 10, padding: '12px 14px', marginBottom: 14,
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Sequence so far
        </p>
        <p style={{ fontSize: 18, color: '#fbbf24', margin: 0, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.08em' }}>
          {sequence.slice(0, stage).join(', ')}{stage < 7 ? ', …' : ''}
        </p>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 6 }}>
          Successive differences: <b style={{ color: '#34d399' }}>+{customMode ? d : 2}</b> each step — constant.
        </p>
      </div>

      <button onClick={() => setShowFormula(v => !v)}
        style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          border: '1px solid rgba(167,139,250,0.6)', background: showFormula ? 'rgba(167,139,250,0.18)' : 'rgba(167,139,250,0.08)',
          color: '#c7d2fe', marginBottom: 12,
        }}>
        {showFormula ? '● Hide formula' : '○ Show the nth-term formula'}
      </button>

      {showFormula && (
        <div style={{
          borderRadius: 10, padding: '12px 14px', marginBottom: 14,
          background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.25)',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', margin: 0, marginBottom: 6 }}>
            The nth-term formula
          </p>
          <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
            {customMode ? (
              <>Number of items at stage n = <b style={{ color: '#a78bfa' }}>{a} + {d}(n − 1) = {d}n + ({a - d})</b><br />
              At stage {stage}: <b>{a + d * (stage - 1)}</b>. This is a <b>linear polynomial</b> — degree 1.</>
            ) : (
              <>Number of squares at stage n = <b style={{ color: '#a78bfa' }}>2n − 1</b><br />
              At stage {stage}: 2 × {stage} − 1 = <b>{2 * stage - 1}</b>. This is a <b>linear polynomial</b> — degree 1.</>
            )}
          </p>
        </div>
      )}

      {/* Custom-mode toggle */}
      <button onClick={() => setCustomMode(v => !v)}
        style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          border: customMode ? '1px solid rgba(96,165,250,0.6)' : '1px solid rgba(255,255,255,0.08)',
          background: customMode ? 'rgba(96,165,250,0.18)' : 'rgba(255,255,255,0.04)',
          color: customMode ? '#60a5fa' : '#94a3b8',
        }}>
        {customMode ? '● Custom pattern (active)' : '○ Try a custom linear pattern'}
      </button>

      {customMode && (
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center' }}>
          <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>First term (a):</label>
          <input type="range" min={-20} max={20} step={1} value={a}
            onChange={e => setA(parseInt(e.target.value, 10))} style={{ accentColor: '#60a5fa' }} />
          <span style={{ fontSize: 13, color: '#60a5fa', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{a}</span>
          <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Common diff. (d):</label>
          <input type="range" min={-10} max={10} step={1} value={d}
            onChange={e => setD(parseInt(e.target.value, 10))} style={{ accentColor: '#60a5fa' }} />
          <span style={{ fontSize: 13, color: '#60a5fa', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{d}</span>
        </div>
      )}
    </div>
  );
}
