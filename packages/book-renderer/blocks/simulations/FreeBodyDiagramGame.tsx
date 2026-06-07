'use client';

// FreeBodyDiagramGame.tsx
// Class 9 Physics — Chapter 6 "How Forces Affect Motion"
// A level-based free-body-diagram challenge. Each level gives a scenario with
// some fixed forces; the student adds/sizes their own force arrow(s) to hit a
// goal (balance the forces, make it accelerate a given way, lift it off), then
// predicts and reveals the resulting motion. Reuses the dark-theme SVG arrow
// style of ForceBalanceSim. Self-contained, no external deps.

import { useMemo, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
type Dir = 'right' | 'left' | 'up' | 'down';
type GoalDir = 'none' | Dir;

interface Force {
  label: string;
  dir: Dir;
  mag: number;      // N
  color: string;
  editable?: boolean;
}
interface Level {
  title: string;
  scenario: string;
  goal: GoalDir;          // 'none' = balance to zero net force
  goalText: string;
  fixed: Force[];
  editable: Force;        // the single force the student controls
  successNote: string;    // shown once the goal is met
}

// ── Geometry: screen angle for each direction (0=right, 90=down) ────────────
const DIR_ANGLE: Record<Dir, number> = { right: 0, left: 180, up: 270, down: 90 };
const DIR_ARROW: Record<Dir, string> = { right: '→', left: '←', up: '↑', down: '↓' };

const APPLIED = '#fb923c';   // student's force (orange-amber, the accent)
const FRICTION = '#60a5fa';
const WEIGHT = '#f87171';
const NORMAL = '#34d399';
const RESULT = '#fbbf24';

// ── Levels ─────────────────────────────────────────────────────────────────
const LEVELS: Level[] = [
  {
    title: 'Tug of War',
    scenario: 'The red team pulls the flag left with 50 N. Set your blue pull so the flag does not move.',
    goal: 'none',
    goalText: 'Make the net force zero (balanced)',
    fixed: [{ label: 'Red team', dir: 'left', mag: 50, color: FRICTION }],
    editable: { label: 'Your pull', dir: 'right', mag: 20, color: APPLIED, editable: true },
    successNote: 'Two equal, opposite pulls cancel: the net force is zero, so the flag stays still. That is a pair of balanced forces.',
  },
  {
    title: 'Get it Moving',
    scenario: 'A crate sits still. Friction can push back with up to 20 N. Push hard enough to start it moving to the right.',
    goal: 'right',
    goalText: 'Make the net force point right (crate accelerates right)',
    fixed: [{ label: 'Friction', dir: 'left', mag: 20, color: FRICTION }],
    editable: { label: 'Your push', dir: 'right', mag: 10, color: APPLIED, editable: true },
    successNote: 'Once your push beats the 20 N of friction, a net force acts to the right — and the crate accelerates that way (Newton’s second law).',
  },
  {
    title: 'Steady Speed',
    scenario: 'A box is already sliding right. Friction drags it back with 30 N. Set your push so it keeps moving at a constant speed.',
    goal: 'none',
    goalText: 'Make the net force zero (constant velocity)',
    fixed: [{ label: 'Friction', dir: 'left', mag: 30, color: FRICTION }],
    editable: { label: 'Your push', dir: 'right', mag: 10, color: APPLIED, editable: true },
    successNote: 'When your push exactly cancels friction, the net force is zero. By Newton’s first law a moving object then keeps a constant velocity — no force is needed to keep it going, only to cancel friction.',
  },
  {
    title: 'Lift Off',
    scenario: 'A 4 kg drone weighs 40 N downward. Set its upward thrust so it rises off the ground.',
    goal: 'up',
    goalText: 'Make the net force point up (drone rises)',
    fixed: [{ label: 'Weight', dir: 'down', mag: 40, color: WEIGHT }],
    editable: { label: 'Thrust', dir: 'up', mag: 20, color: APPLIED, editable: true },
    successNote: 'When thrust beats the 40 N weight, the net force points up and the drone accelerates upward. Match them exactly and it would hover.',
  },
];

// ── SVG arrow helper (same style as ForceBalanceSim) ────────────────────────
function ArrowSVG({ cx, cy, angle, length, color, width = 3, dashed = false, label }: {
  cx: number; cy: number; angle: number; length: number; color: string;
  width?: number; dashed?: boolean; label?: string;
}) {
  if (length < 2) return null;
  const rad = (angle * Math.PI) / 180;
  const tx = cx + Math.cos(rad) * length;
  const ty = cy + Math.sin(rad) * length;
  const headLen = 12, headWidth = 6;
  const ux = Math.cos(rad), uy = Math.sin(rad);
  const bx = tx - ux * headLen, by = ty - uy * headLen;
  const px = -uy * headWidth, py = ux * headWidth;
  return (
    <g>
      <line x1={cx} y1={cy} x2={bx} y2={by} stroke={color} strokeWidth={width}
        strokeLinecap="round" strokeDasharray={dashed ? '6 4' : undefined} />
      <polygon points={`${tx},${ty} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
      {label && (
        <text x={cx + ux * (length + 14)} y={cy + uy * (length + 14)} fill={color}
          fontSize={11} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{label}</text>
      )}
    </g>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function FreeBodyDiagramGame() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [mag, setMag] = useState(LEVELS[0].editable.mag);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState<boolean[]>(() => LEVELS.map(() => false));

  const level = LEVELS[levelIdx];
  const allForces: Force[] = [...level.fixed, { ...level.editable, mag }];

  // Net force in physics coords: x right-positive, y up-positive.
  const { netX, netY, netMag, netDir } = useMemo(() => {
    let x = 0, y = 0;
    for (const f of allForces) {
      if (f.dir === 'right') x += f.mag;
      else if (f.dir === 'left') x -= f.mag;
      else if (f.dir === 'up') y += f.mag;
      else if (f.dir === 'down') y -= f.mag;
    }
    const mn = Math.sqrt(x * x + y * y);
    let dir: GoalDir = 'none';
    if (mn >= 2) dir = Math.abs(x) >= Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'up' : 'down');
    return { netX: x, netY: y, netMag: mn, netDir: dir };
  }, [allForces]);

  const TOL = 2;
  const goalMet = level.goal === 'none' ? netMag < TOL : (netDir === level.goal && netMag >= TOL);

  // Net force arrow angle (screen coords): up is negative-y on screen.
  const netAngle = Math.atan2(-netY, netX) * (180 / Math.PI);

  // ── Layout ────────────────────────────────────────────────────────────────
  const SVG_W = 420, SVG_H = 300, CX = SVG_W / 2, CY = SVG_H / 2, BOX = 46, SCALE = 1.7;

  const card: React.CSSProperties = {
    background: '#0b0f15', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)',
    padding: 24, fontFamily: 'system-ui, sans-serif', color: '#e2e8f0', maxWidth: 940, margin: '0 auto',
  };
  const btn = (active: boolean): React.CSSProperties => ({
    padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
    border: active ? '1px solid #fb923c' : '1px solid rgba(255,255,255,0.12)',
    background: active ? 'rgba(251,146,60,0.15)' : 'rgba(255,255,255,0.04)',
    color: active ? '#fdba74' : '#cbd5e1',
  });

  function pickLevel(i: number) { setLevelIdx(i); setMag(LEVELS[i].editable.mag); setChecked(false); }

  return (
    <div style={card}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>Free-Body Challenge</h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Set your force arrow to solve each scenario · the net force decides the motion
        </p>
      </div>

      {/* Level tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {LEVELS.map((lv, i) => (
          <button key={i} onClick={() => pickLevel(i)} style={{
            ...btn(i === levelIdx),
            opacity: i === levelIdx ? 1 : 0.85,
          }}>
            {solved[i] ? '✓ ' : ''}{i + 1}. {lv.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        {/* SVG diagram */}
        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{
            width: '100%', background: '#060d1f', borderRadius: 12,
            border: '1px solid rgba(99,102,241,0.15)', display: 'block',
          }}>
            {[0.25, 0.5, 0.75].map(f => (
              <g key={f}>
                <line x1={SVG_W * f} y1={0} x2={SVG_W * f} y2={SVG_H} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                <line x1={0} y1={SVG_H * f} x2={SVG_W} y2={SVG_H * f} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
              </g>
            ))}
            {/* force arrows */}
            {allForces.map((f, i) => (
              <ArrowSVG key={i} cx={CX} cy={CY} angle={DIR_ANGLE[f.dir]}
                length={f.mag * SCALE} color={f.color} width={3} label={`${f.label} ${f.mag}N`} />
            ))}
            {/* resultant arrow (dashed) */}
            {netMag >= TOL && (
              <ArrowSVG cx={CX} cy={CY} angle={netAngle} length={Math.min(netMag * SCALE, 120)}
                color={RESULT} width={4} dashed />
            )}
            {/* central body */}
            <rect x={CX - BOX / 2} y={CY - BOX / 2} width={BOX} height={BOX} rx={7}
              fill={goalMet ? 'rgba(52,211,153,0.18)' : 'rgba(251,191,36,0.08)'}
              stroke={goalMet ? NORMAL : '#fbbf24'} strokeWidth={2} />
            {goalMet && (
              <rect x={CX - BOX / 2 - 4} y={CY - BOX / 2 - 4} width={BOX + 8} height={BOX + 8} rx={10}
                fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth={3} />
            )}
          </svg>

          {/* Net-force readout */}
          <div style={{
            marginTop: 10, display: 'flex', gap: 14, fontSize: 12, color: '#94a3b8',
            justifyContent: 'center',
          }}>
            <span>Net force: <b style={{ color: netMag < TOL ? NORMAL : RESULT }}>{Math.round(netMag)} N</b></span>
            <span>Direction: <b style={{ color: '#e2e8f0' }}>{netMag < TOL ? 'balanced' : DIR_ARROW[netDir as Dir] + ' ' + netDir}</b></span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{level.title}</div>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 10px' }}>{level.scenario}</p>
          <div style={{
            fontSize: 12, color: '#fdba74', background: 'rgba(251,146,60,0.08)',
            border: '1px solid rgba(251,146,60,0.2)', borderRadius: 8, padding: '7px 10px', marginBottom: 14,
          }}>🎯 Goal: {level.goalText}</div>

          {/* Editable force: magnitude slider */}
          <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              {level.editable.label} ({DIR_ARROW[level.editable.dir]} {level.editable.dir})
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: APPLIED }}>{mag} N</span>
          </div>
          <input type="range" min={0} max={100} step={1} value={mag}
            onChange={e => { setMag(Number(e.target.value)); setChecked(false); }}
            style={{ width: '100%', accentColor: APPLIED, height: 16 }} />

          <button onClick={() => { setChecked(true); if (goalMet) setSolved(prev => prev.map((v, k) => (k === levelIdx ? true : v))); }} style={{
            marginTop: 16, width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 800,
            background: 'linear-gradient(90deg,#fb923c,#f59e0b)', color: '#0b0f15',
          }}>Check my answer</button>

          {/* Feedback */}
          {checked && (
            <div style={{
              marginTop: 14, fontSize: 13, lineHeight: 1.5, borderRadius: 10, padding: '10px 12px',
              background: goalMet ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.08)',
              border: `1px solid ${goalMet ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.25)'}`,
              color: goalMet ? '#a7f3d0' : '#fecaca',
            }}>
              {goalMet ? (
                <>
                  <b>✓ Solved!</b> {level.successNote}
                  {levelIdx < LEVELS.length - 1 && (
                    <button onClick={() => pickLevel(levelIdx + 1)} style={{
                      ...btn(false), marginTop: 10, display: 'block',
                    }}>Next level →</button>
                  )}
                  {levelIdx === LEVELS.length - 1 && solved.slice(0, -1).every(Boolean) && (
                    <div style={{ marginTop: 8, color: '#fdba74', fontWeight: 700 }}>🏆 All levels cleared!</div>
                  )}
                </>
              ) : (
                <>
                  <b>Not yet.</b> The net force is {Math.round(netMag)} N{netMag >= TOL ? ` to the ${netDir}` : ' (balanced)'}.
                  {' '}{hint(level, netMag, netDir)}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function hint(level: Level, netMag: number, netDir: GoalDir): string {
  if (level.goal === 'none') return 'Adjust your force until it exactly cancels the other one.';
  if (netDir === oppositeOf(level.goal)) return `Your force is too small — increase it so the net force flips to point ${level.goal}.`;
  if (netMag < 2) return `Right now the forces balance. Make your force bigger so a net force points ${level.goal}.`;
  return `Aim for a net force pointing ${level.goal}.`;
}
function oppositeOf(d: GoalDir): GoalDir {
  return d === 'right' ? 'left' : d === 'left' ? 'right' : d === 'up' ? 'down' : d === 'down' ? 'up' : 'none';
}
