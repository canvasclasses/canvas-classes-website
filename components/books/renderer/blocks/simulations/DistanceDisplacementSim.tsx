'use client';

// DistanceDisplacementSim.tsx
// Class 9 Physics — Motion Chapter
// Shows why distance ≠ displacement via interactive preset journeys on a grid.
// NCERT Class 9 Science, Chapter 8 (Motion) — distance is total path length,
// displacement is shortest straight-line distance from initial to final position.
// Design: follows SIMULATION_DESIGN_WORKFLOW.md exactly.

import { useState, useCallback, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Step {
  dx: number; // grid units
  dy: number; // grid units (positive = up in SVG world, so we invert when drawing)
}

interface Scenario {
  id: string;
  label: string;
  description: string;
  steps: Step[];
  distance: number;
  displacement: number;
  insight: string;
}

// ── Scenarios ──────────────────────────────────────────────────────────────────
// Source: NCERT Class 9 Science Chapter 8 — Motion; concept examples adapted
// from standard Indian school textbook illustrations.

const SCENARIOS: Scenario[] = [
  {
    id: 'straight',
    label: 'Walk straight',
    description: 'Walk 6 m to the east.',
    steps: [{ dx: 6, dy: 0 }],
    distance: 6,
    displacement: 6,
    insight: 'When you move in a straight line, distance = displacement.',
  },
  {
    id: 'right-angle',
    label: 'Turn a corner',
    description: 'Walk 3 m east, then 4 m north.',
    steps: [{ dx: 3, dy: 0 }, { dx: 0, dy: 4 }],
    distance: 7,
    // Pythagoras: sqrt(3²+4²) = 5 — NCERT example
    displacement: 5,
    insight: 'The path (7 m) is longer than the straight-line gap (5 m).',
  },
  {
    id: 'back-and-forth',
    label: 'Back and forth',
    description: 'Walk 5 m east, then 5 m back west.',
    steps: [{ dx: 5, dy: 0 }, { dx: -5, dy: 0 }],
    distance: 10,
    displacement: 0,
    insight: 'You walked 10 m total but ended exactly where you started!',
  },
  {
    id: 'zigzag',
    label: 'Zigzag path',
    description: 'Walk 4 m east, 3 m north, then 4 m west.',
    steps: [{ dx: 4, dy: 0 }, { dx: 0, dy: 3 }, { dx: -4, dy: 0 }],
    distance: 11,
    // Final position is (0, 3) from origin → displacement = 3 m north
    displacement: 3,
    insight: 'The zigzag path is 11 m. The displacement is just 3 m straight north.',
  },
];

// ── Grid constants ──────────────────────────────────────────────────────────────

const CELL = 30;          // px per grid unit
const COLS = 12;
const ROWS = 10;
const SVG_W = COLS * CELL; // 360
const SVG_H = ROWS * CELL; // 300
// Origin in grid coords (col, row) — row increases downward in SVG
const ORIGIN_COL = 1;
const ORIGIN_ROW = 8;      // leaves space above for upward paths

// Grid coord → SVG pixel
function gx(col: number) { return col * CELL; }
function gy(row: number) { return row * CELL; }

// Apply steps to get waypoints in SVG space.
// dy > 0 = north = upward in screen = subtract from SVG y
function buildWaypoints(steps: Step[], revealedSteps: number) {
  const pts: { x: number; y: number }[] = [];
  let col = ORIGIN_COL;
  let row = ORIGIN_ROW;
  pts.push({ x: gx(col), y: gy(row) });
  for (let i = 0; i < Math.min(revealedSteps, steps.length); i++) {
    col += steps[i].dx;
    row -= steps[i].dy; // north = up = lower row index
    pts.push({ x: gx(col), y: gy(row) });
  }
  return pts;
}

// Cumulative distance for revealed steps
function liveDistance(steps: Step[], revealed: number): number {
  let d = 0;
  for (let i = 0; i < Math.min(revealed, steps.length); i++) {
    d += Math.abs(steps[i].dx) + Math.abs(steps[i].dy);
  }
  return d;
}

// Arrowhead marker path for a line from (x1,y1) to (x2,y2)
function arrowhead(x1: number, y1: number, x2: number, y2: number, size = 8) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - size * Math.cos(angle - Math.PI / 6);
  const ay = y2 - size * Math.sin(angle - Math.PI / 6);
  const bx = x2 - size * Math.cos(angle + Math.PI / 6);
  const by = y2 - size * Math.sin(angle + Math.PI / 6);
  return `M${ax},${ay} L${x2},${y2} L${bx},${by}`;
}

// Mid-point for midpoint arrowhead on path
function midArrow(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return { mx, my };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function DistanceDisplacementSim() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState(0);

  const scenario = SCENARIOS[selectedScenario];
  const totalSteps = scenario.steps.length;
  const allRevealed = revealedSteps >= totalSteps;

  const waypoints = useMemo(
    () => buildWaypoints(scenario.steps, revealedSteps),
    [scenario.steps, revealedSteps],
  );

  const origin = waypoints[0];
  const current = waypoints[waypoints.length - 1];
  const originFull = { x: gx(ORIGIN_COL), y: gy(ORIGIN_ROW) };

  const liveDist = liveDistance(scenario.steps, revealedSteps);

  const selectScenario = useCallback((idx: number) => {
    setSelectedScenario(idx);
    setRevealedSteps(0);
  }, []);

  const handlePrev = () => setRevealedSteps(r => Math.max(0, r - 1));
  const handleNext = () => setRevealedSteps(r => Math.min(totalSteps, r + 1));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{
      background: '#0d1117',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16,
      padding: 24,
      maxWidth: 900,
      margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#fff',
          margin: 0,
        }}>
          Distance <span style={{ color: '#f59e0b' }}>vs</span> Displacement
        </h1>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#475569',
          marginTop: 4,
          marginBottom: 0,
        }}>
          Interactive Journey Explorer · Class 9 Physics
        </p>
      </div>

      {/* ── Scenario tabs ── */}
      <div style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 16,
      }}>
        {SCENARIOS.map((s, i) => {
          const active = i === selectedScenario;
          return (
            <button
              key={s.id}
              onClick={() => selectScenario(i)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: active
                  ? '1px solid rgba(245,158,11,0.6)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: active
                  ? 'rgba(245,158,11,0.15)'
                  : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ── Description ── */}
      <p style={{
        fontSize: 13,
        color: '#94a3b8',
        marginBottom: 14,
        lineHeight: 1.5,
      }}>
        {scenario.description}
      </p>

      {/* ── SVG Grid ── */}
      <div style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block' }}
        >
          {/* Grid lines */}
          {Array.from({ length: COLS + 1 }, (_, c) => (
            <line
              key={`vc${c}`}
              x1={gx(c)} y1={0} x2={gx(c)} y2={SVG_H}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1}
            />
          ))}
          {Array.from({ length: ROWS + 1 }, (_, r) => (
            <line
              key={`hr${r}`}
              x1={0} y1={gy(r)} x2={SVG_W} y2={gy(r)}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1}
            />
          ))}

          {/* Grid unit labels (top-left corner markers — subtle) */}
          {/* Compass rose */}
          <text x={SVG_W - 28} y={24} fill="#475569" fontSize={10} fontWeight={700} textAnchor="middle">N</text>
          <text x={SVG_W - 28} y={52} fill="#475569" fontSize={10} fontWeight={700} textAnchor="middle">S</text>
          <text x={SVG_W - 48} y={40} fill="#475569" fontSize={10} fontWeight={700} textAnchor="middle">W</text>
          <text x={SVG_W - 8}  y={40} fill="#475569" fontSize={10} fontWeight={700} textAnchor="middle">E</text>
          <line x1={SVG_W - 28} y1={28} x2={SVG_W - 28} y2={47} stroke="#475569" strokeWidth={1} />
          <line x1={SVG_W - 44} y1={37} x2={SVG_W - 12} y2={37} stroke="#475569" strokeWidth={1} />

          {/* Scale bar: 1 cell = 1 m */}
          <line x1={gx(1)} y1={SVG_H - 8} x2={gx(2)} y2={SVG_H - 8} stroke="#475569" strokeWidth={1.5} />
          <text x={gx(1.5)} y={SVG_H - 14} fill="#475569" fontSize={9} textAnchor="middle" fontWeight={700}>1 m</text>

          {/* Path segments (revealed) */}
          {waypoints.slice(0, -1).map((pt, i) => {
            const next = waypoints[i + 1];
            const { mx, my } = midArrow(pt.x, pt.y, next.x, next.y);
            return (
              <g key={`seg${i}`}>
                {/* Dashed amber path line */}
                <line
                  x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                />
                {/* Direction arrow at midpoint — shows travel direction */}
                <path
                  d={arrowhead(pt.x, pt.y, mx, my)}
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  fill="none"
                />
              </g>
            );
          })}

          {/* Arrowhead at the end of the last segment */}
          {waypoints.length >= 2 && (
            <path
              d={arrowhead(
                waypoints[waypoints.length - 2].x,
                waypoints[waypoints.length - 2].y,
                waypoints[waypoints.length - 1].x,
                waypoints[waypoints.length - 1].y,
                10,
              )}
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="none"
            />
          )}

          {/* Displacement arrow (only when all steps revealed and displacement > 0) */}
          {allRevealed && scenario.displacement > 0 && (
            <g>
              <line
                x1={originFull.x} y1={originFull.y}
                x2={current.x} y2={current.y}
                stroke="#34d399"
                strokeWidth={2.5}
              />
              <path
                d={arrowhead(originFull.x, originFull.y, current.x, current.y, 10)}
                stroke="#34d399"
                strokeWidth={2.5}
                fill="none"
              />
              {/* Label */}
              <text
                x={(originFull.x + current.x) / 2 + 6}
                y={(originFull.y + current.y) / 2 - 8}
                fill="#34d399"
                fontSize={11}
                fontWeight={700}
              >
                Displacement
              </text>
            </g>
          )}

          {/* Origin circle */}
          <circle
            cx={originFull.x} cy={originFull.y}
            r={6}
            fill="#f59e0b"
            stroke="#0B0F15"
            strokeWidth={2}
          />
          <text
            x={originFull.x}
            y={originFull.y + 18}
            fill="#fbbf24"
            fontSize={10}
            fontWeight={700}
            textAnchor="middle"
          >
            Start
          </text>

          {/* Character (current position) */}
          {revealedSteps > 0 && (
            <g>
              <circle
                cx={current.x} cy={current.y}
                r={7}
                fill={allRevealed ? '#34d399' : '#f59e0b'}
                stroke="#0B0F15"
                strokeWidth={2}
              />
              {allRevealed && scenario.displacement === 0 && (
                /* Overlapping start/end — extra ring to show same location */
                <circle
                  cx={current.x} cy={current.y}
                  r={13}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.6}
                />
              )}
              {allRevealed && (
                <text
                  x={current.x}
                  y={current.y - 14}
                  fill="#34d399"
                  fontSize={10}
                  fontWeight={700}
                  textAnchor="middle"
                >
                  End
                </text>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* ── Step controls ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
      }}>
        <button
          onClick={handlePrev}
          disabled={revealedSteps === 0}
          style={{
            padding: '7px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: revealedSteps === 0 ? 'not-allowed' : 'pointer',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            color: revealedSteps === 0 ? '#334155' : '#94a3b8',
            opacity: revealedSteps === 0 ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          ← Prev Step
        </button>

        <span style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: '#475569',
          letterSpacing: '0.05em',
        }}>
          Step {revealedSteps} / {totalSteps}
        </span>

        <button
          onClick={handleNext}
          disabled={allRevealed}
          style={{
            padding: '7px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: allRevealed ? 'not-allowed' : 'pointer',
            border: '1px solid rgba(245,158,11,0.35)',
            background: allRevealed ? 'rgba(255,255,255,0.03)' : 'rgba(245,158,11,0.12)',
            color: allRevealed ? '#334155' : '#fbbf24',
            opacity: allRevealed ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          Next Step →
        </button>
      </div>

      {/* ── Stats panel ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 14,
      }}>
        {/* Distance card */}
        <div style={{
          borderRadius: 12,
          padding: '14px 16px',
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.25)',
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#f87171',
            margin: '0 0 6px',
          }}>
            Distance
          </p>
          <p style={{
            fontSize: 28,
            fontWeight: 900,
            color: '#fbbf24',
            margin: '0 0 2px',
            lineHeight: 1,
          }}>
            {liveDist} m
          </p>
          <p style={{
            fontSize: 11,
            color: '#475569',
            margin: 0,
          }}>
            path length
          </p>
        </div>

        {/* Displacement card */}
        <div style={{
          borderRadius: 12,
          padding: '14px 16px',
          background: 'rgba(52,211,153,0.08)',
          border: '1px solid rgba(52,211,153,0.25)',
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#34d399',
            margin: '0 0 6px',
          }}>
            Displacement
          </p>
          <p style={{
            fontSize: 28,
            fontWeight: 900,
            color: allRevealed ? '#34d399' : '#475569',
            margin: '0 0 2px',
            lineHeight: 1,
          }}>
            {allRevealed ? `${scenario.displacement} m` : '—'}
          </p>
          <p style={{
            fontSize: 11,
            color: '#475569',
            margin: 0,
          }}>
            straight-line gap
          </p>
        </div>
      </div>

      {/* ── Insight box (appears when all steps revealed) ── */}
      {allRevealed && (
        <div style={{
          borderRadius: 12,
          padding: '14px 16px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#f59e0b',
            margin: '0 0 6px',
          }}>
            Key Insight
          </p>
          <p style={{
            fontSize: 14,
            color: '#e2e8f0',
            margin: 0,
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            {scenario.insight}
          </p>
        </div>
      )}
    </div>
  );
}
