'use client';

// NewtonsThirdLawSim.tsx
// Class 9 Physics — Force and Laws of Motion (Chapter 2)
// Demonstrates Newton's Third Law: every action has an equal and opposite reaction.
// Source: NCERT Class 9 Science, Chapter 9 (Laws of Motion):
//   "To every action, there is an equal and opposite reaction and they act on two
//    different bodies." — Third Law of Motion (p. 118, NCERT 2023 edition)
// Design follows SIMULATION_DESIGN_WORKFLOW.md exactly.

import { useState, useMemo } from 'react';

// ── Scenario data ──────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 'rocket',
    title: 'Rocket & Exhaust',
    icon: '🚀',
    description: 'The rocket pushes exhaust gases backward. The gases push the rocket forward.',
    objectA: 'Rocket',
    objectB: 'Exhaust Gases',
    colorA: '#818cf8',
    colorB: '#94a3b8',
    forceOnA: 'Thrust (forward →)',
    forceOnB: 'Push (backward ←)',
    misconception: "The rocket doesn't \"push against air\" — it works in the vacuum of space because the exhaust itself is the reaction. This is why rockets work in space where there is no air.",
    layout: 'horizontal-rl', // rocket right, exhaust left
  },
  {
    id: 'swimmer',
    title: 'Swimmer & Wall',
    icon: '🏊',
    description: 'The swimmer pushes the wall backward. The wall pushes the swimmer forward.',
    objectA: 'Swimmer',
    objectB: 'Pool Wall',
    colorA: '#34d399',
    colorB: '#475569',
    forceOnA: 'Push forward (→)',
    forceOnB: 'Push backward (←)',
    misconception: "The wall doesn't \"help\" — it simply reacts. The swimmer provides all the energy. The wall is passive; it only exerts a force because the swimmer pushes it first.",
    layout: 'horizontal-lr', // swimmer left, wall right
  },
  {
    id: 'book-table',
    title: 'Book on Table',
    icon: '📚',
    description: 'The book pushes DOWN on the table (gravity reaction). The table pushes UP on the book (normal force).',
    objectA: 'Book',
    objectB: 'Table',
    colorA: '#f59e0b',
    colorB: '#334155',
    forceOnA: 'Normal force ↑',
    forceOnB: 'Weight reaction ↓',
    misconception: 'Weight (Earth pulling book down) and Normal force (table pushing book up) are NOT an action-reaction pair — they act on the same object (the book). The true pair is: book pushes table down ↔ table pushes book up.',
    layout: 'vertical', // book top, table bottom
  },
  {
    id: 'gun',
    title: 'Gun & Bullet',
    icon: '🔫',
    description: 'The gun pushes the bullet forward. The bullet pushes the gun backward (recoil).',
    objectA: 'Bullet',
    objectB: 'Gun',
    colorA: '#f87171',
    colorB: '#64748b',
    forceOnA: 'Forward push (→)',
    forceOnB: 'Recoil (←)',
    misconception: 'Both forces are equal in magnitude. The gun recoils less visibly because it is much heavier (same force, less acceleration: a = F/m). This is Newton\'s Second Law working alongside the Third.',
    layout: 'horizontal-rl', // bullet left, gun right
  },
] as const;

type ScenarioId = typeof SCENARIOS[number]['id'];

// ── SVG drawing helpers ────────────────────────────────────────────────────────

function arrowH(x1: number, y: number, x2: number, color: string, strokeWidth = 3, label?: string, labelSide: 'above' | 'below' = 'above') {
  const dir = x2 > x1 ? 1 : -1;
  const tipX = x2;
  const ax = tipX - dir * 10;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d={`M${ax},${y - 5} L${tipX},${y} L${ax},${y + 5}`} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinejoin="round" />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={labelSide === 'above' ? y - 12 : y + 18}
          fill={color}
          fontSize={10}
          fontWeight={700}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function arrowV(x: number, y1: number, y2: number, color: string, strokeWidth = 3, label?: string) {
  const dir = y2 > y1 ? 1 : -1;
  const tipY = y2;
  const ay = tipY - dir * 10;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d={`M${x - 5},${ay} L${x},${tipY} L${x + 5},${ay}`} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinejoin="round" />
      {label && (
        <text
          x={x + 14}
          y={(y1 + y2) / 2 + 4}
          fill={color}
          fontSize={10}
          fontWeight={700}
          textAnchor="start"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// ── Scenario SVG visualizations ────────────────────────────────────────────────

function RocketSVG({ arrowLen, colorA, colorB }: { arrowLen: number; colorA: string; colorB: string }) {
  // Rocket on right, exhaust on left
  // Rocket body centered at x=320, exhaust cloud at x=160
  const rocketX = 310;
  const rocketY = 70;

  return (
    <svg width="100%" viewBox="0 0 500 220" style={{ display: 'block' }}>
      {/* Exhaust cloud (left) */}
      <ellipse cx={145} cy={110} rx={38} ry={22} fill="rgba(148,163,184,0.2)" stroke={colorB} strokeWidth={1.5} />
      <text x={145} y={105} fill={colorB} fontSize={11} fontWeight={700} textAnchor="middle">Exhaust</text>
      <text x={145} y={120} fill={colorB} fontSize={10} textAnchor="middle">Gases</text>

      {/* Rocket body */}
      <rect x={rocketX - 20} y={rocketY - 10} width={55} height={50} rx={8}
        fill="rgba(129,140,248,0.2)" stroke={colorA} strokeWidth={2} />
      {/* Rocket nose */}
      <polygon points={`${rocketX + 35},${rocketY + 15} ${rocketX + 55},${rocketY - 10} ${rocketX + 55},${rocketY + 40}`}
        fill="rgba(129,140,248,0.3)" stroke={colorA} strokeWidth={2} />
      {/* Rocket flame nozzle */}
      <path d={`M${rocketX - 20},${rocketY + 5} L${rocketX - 36},${rocketY + 15} L${rocketX - 20},${rocketY + 25}`}
        fill="rgba(251,191,36,0.4)" stroke="#fbbf24" strokeWidth={1.5} />

      <text x={rocketX + 18} y={rocketY + 20} fill={colorA} fontSize={11} fontWeight={700} textAnchor="middle">Rocket</text>

      {/* Force on exhaust: push left */}
      {arrowH(rocketX - 22, 140, rocketX - 22 - arrowLen, colorB, 2.5, 'Push ←', 'below')}

      {/* Force on rocket: thrust right */}
      {arrowH(rocketX + 37, 140, rocketX + 37 + arrowLen, colorA, 2.5, 'Thrust →', 'below')}

      {/* Equal sign label */}
      <text x={250} y={175} fill="#64748b" fontSize={12} fontWeight={700} textAnchor="middle">
        |F on Exhaust| = |F on Rocket|
      </text>
    </svg>
  );
}

function SwimmerSVG({ arrowLen, colorA, colorB }: { arrowLen: number; colorA: string; colorB: string }) {
  // Swimmer left, wall right
  const swimmerX = 130;
  const wallX = 360;
  const midY = 90;

  return (
    <svg width="100%" viewBox="0 0 500 220" style={{ display: 'block' }}>
      {/* Pool water */}
      <rect x={20} y={130} width={460} height={40} rx={4}
        fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.2)" strokeWidth={1} />
      <text x={250} y={150} fill="rgba(52,211,153,0.4)" fontSize={10} textAnchor="middle" fontWeight={700}>~ ~ ~ ~ water ~ ~ ~ ~</text>

      {/* Swimmer stick figure */}
      <circle cx={swimmerX} cy={midY - 26} r={12} fill="rgba(52,211,153,0.2)" stroke={colorA} strokeWidth={2} />
      <line x1={swimmerX} y1={midY - 14} x2={swimmerX} y2={midY + 14} stroke={colorA} strokeWidth={2.5} />
      {/* Arms — pushing right */}
      <line x1={swimmerX} y1={midY} x2={swimmerX + 30} y2={midY - 8} stroke={colorA} strokeWidth={2} />
      <line x1={swimmerX} y1={midY} x2={swimmerX - 14} y2={midY + 10} stroke={colorA} strokeWidth={2} />
      <line x1={swimmerX} y1={midY + 14} x2={swimmerX + 12} y2={midY + 34} stroke={colorA} strokeWidth={2} />
      <line x1={swimmerX} y1={midY + 14} x2={swimmerX - 12} y2={midY + 34} stroke={colorA} strokeWidth={2} />
      <text x={swimmerX} y={midY + 55} fill={colorA} fontSize={11} fontWeight={700} textAnchor="middle">Swimmer</text>

      {/* Wall */}
      <rect x={wallX - 6} y={midY - 40} width={20} height={90} rx={4}
        fill="rgba(71,85,105,0.5)" stroke={colorB} strokeWidth={2} />
      <text x={wallX + 4} y={midY + 65} fill={colorB} fontSize={11} fontWeight={700} textAnchor="middle">Wall</text>

      {/* Force on swimmer: push forward → */}
      {arrowH(swimmerX + 15, 155, swimmerX + 15 + arrowLen, colorA, 2.5, 'Push fwd →', 'below')}

      {/* Force on wall: push backward ← */}
      {arrowH(wallX - 8, 155, wallX - 8 - arrowLen, colorB, 2.5, 'Push back ←', 'below')}

      <text x={250} y={200} fill="#64748b" fontSize={12} fontWeight={700} textAnchor="middle">
        |F on Swimmer| = |F on Wall|
      </text>
    </svg>
  );
}

function BookTableSVG({ arrowLen, colorA, colorB }: { arrowLen: number; colorA: string; colorB: string }) {
  const bookX = 185;
  const bookY = 55;
  const tableY = 130;
  const centerX = 250;

  // Vertical arrows — arrowLen maps to up/down
  const halfArrow = Math.round(arrowLen * 0.7);

  return (
    <svg width="100%" viewBox="0 0 500 220" style={{ display: 'block' }}>
      {/* Book */}
      <rect x={bookX} y={bookY} width={130} height={50} rx={8}
        fill="rgba(245,158,11,0.2)" stroke={colorA} strokeWidth={2} />
      <text x={centerX} y={bookY + 28} fill={colorA} fontSize={12} fontWeight={700} textAnchor="middle">Book</text>

      {/* Table surface */}
      <rect x={60} y={tableY} width={380} height={24} rx={4}
        fill="rgba(51,65,85,0.7)" stroke={colorB} strokeWidth={2} />
      {/* Table legs */}
      <rect x={100} y={tableY + 24} width={12} height={36} rx={3} fill="#334155" />
      <rect x={388} y={tableY + 24} width={12} height={36} rx={3} fill="#334155" />
      <text x={centerX} y={tableY + 14} fill={colorB} fontSize={11} fontWeight={700} textAnchor="middle">Table</text>

      {/* Force on book: Normal ↑ (from table, acting on book) */}
      {arrowV(centerX - 30, tableY - 2, tableY - 2 - halfArrow, colorA, 2.5, 'Normal ↑')}

      {/* Force on table: Weight reaction ↓ (from book, acting on table) */}
      {arrowV(centerX + 30, bookY + 50, bookY + 50 + halfArrow, colorB, 2.5, 'Wt. ↓')}

      <text x={centerX} y={195} fill="#64748b" fontSize={12} fontWeight={700} textAnchor="middle">
        |Normal on Book| = |Weight on Table|
      </text>
    </svg>
  );
}

function GunSVG({ arrowLen, colorA, colorB }: { arrowLen: number; colorA: string; colorB: string }) {
  // Bullet on left, gun on right
  const bulletX = 110;
  const gunX = 290;
  const midY = 90;

  return (
    <svg width="100%" viewBox="0 0 500 220" style={{ display: 'block' }}>
      {/* Bullet */}
      <ellipse cx={bulletX} cy={midY} rx={18} ry={10} fill="rgba(248,113,113,0.25)" stroke={colorA} strokeWidth={2} />
      <polygon points={`${bulletX + 18},${midY} ${bulletX + 36},${midY - 8} ${bulletX + 36},${midY + 8}`}
        fill="rgba(248,113,113,0.35)" stroke={colorA} strokeWidth={1.5} />
      <text x={bulletX} y={midY + 28} fill={colorA} fontSize={11} fontWeight={700} textAnchor="middle">Bullet</text>

      {/* Gun body */}
      <rect x={gunX - 10} y={midY - 24} width={90} height={36} rx={6}
        fill="rgba(100,116,139,0.3)" stroke={colorB} strokeWidth={2} />
      {/* Barrel */}
      <rect x={gunX - 36} y={midY - 8} width={30} height={14} rx={3}
        fill="rgba(100,116,139,0.4)" stroke={colorB} strokeWidth={1.5} />
      {/* Handle */}
      <rect x={gunX + 40} y={midY + 10} width={22} height={30} rx={4}
        fill="rgba(100,116,139,0.3)" stroke={colorB} strokeWidth={1.5} />
      <text x={gunX + 35} y={midY + 8} fill={colorB} fontSize={11} fontWeight={700} textAnchor="middle">Gun</text>

      {/* Force on bullet: forward → */}
      {arrowH(bulletX + 40, 140, bulletX + 40 + arrowLen, colorA, 2.5, 'Forward →', 'below')}

      {/* Force on gun: recoil ← */}
      {arrowH(gunX - 12, 140, gunX - 12 - arrowLen, colorB, 2.5, 'Recoil ←', 'below')}

      <text x={250} y={197} fill="#64748b" fontSize={12} fontWeight={700} textAnchor="middle">
        |F on Bullet| = |F on Gun|
      </text>
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function NewtonsThirdLawSim() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [forceSlider, setForceSlider] = useState(5);
  const [showMisconception, setShowMisconception] = useState(false);

  const scenario = SCENARIOS[selectedScenario];

  // Arrow length: 20–90px proportional to forceSlider (1–10)
  const arrowLen = useMemo(() => 20 + (forceSlider - 1) * 8, [forceSlider]);

  const forceN = forceSlider * 10; // display as 10–100 N for realism

  const handleScenarioChange = (idx: number) => {
    setSelectedScenario(idx);
    setShowMisconception(false);
  };

  // ── Pick the right SVG ─────────────────────────────────────────────────────

  function renderScenarioSVG() {
    const props = { arrowLen, colorA: scenario.colorA, colorB: scenario.colorB };
    switch (scenario.id) {
      case 'rocket':     return <RocketSVG {...props} />;
      case 'swimmer':    return <SwimmerSVG {...props} />;
      case 'book-table': return <BookTableSVG {...props} />;
      case 'gun':        return <GunSVG {...props} />;
      default:           return null;
    }
  }

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
      <div style={{ marginBottom: 18 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#fff',
          margin: 0,
        }}>
          Newton&#39;s <span style={{ color: '#f59e0b' }}>Third Law</span>
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
          Action &amp; Reaction · Class 9 Physics
        </p>
      </div>

      {/* ── Scenario tab selector ── */}
      <div style={{
        display: 'flex',
        gap: 6,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {SCENARIOS.map((s, i) => {
          const active = i === selectedScenario;
          return (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(i)}
              style={{
                flex: '1 1 auto',
                padding: '8px 6px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: active
                  ? '1px solid rgba(245,158,11,0.55)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: active
                  ? 'rgba(245,158,11,0.15)'
                  : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 16, display: 'block', marginBottom: 2 }}>{s.icon}</span>
              {s.title}
            </button>
          );
        })}
      </div>

      {/* ── Description ── */}
      <p style={{
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 14,
        lineHeight: 1.6,
      }}>
        {scenario.description}
      </p>

      {/* ── SVG Visualization ── */}
      <div style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#0B0F15',
        marginBottom: 14,
      }}>
        {renderScenarioSVG()}
      </div>

      {/* ── Force magnitude bar chart ── */}
      <div style={{
        borderRadius: 12,
        padding: '14px 16px',
        background: '#0B0F15',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 14,
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#64748b',
          margin: '0 0 10px',
        }}>Force Magnitude (Newton&#39;s 3rd Law — always equal)</p>

        {/* Bar A */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: scenario.colorA, fontWeight: 700 }}>
              Force on {scenario.objectA}
            </span>
            <span style={{ fontSize: 12, color: scenario.colorA, fontWeight: 800 }}>
              {forceN} N
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(forceSlider / 10) * 100}%`,
              background: scenario.colorA,
              borderRadius: 5,
              transition: 'width 0.25s ease',
            }} />
          </div>
        </div>

        {/* Bar B */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: scenario.colorB, fontWeight: 700 }}>
              Force on {scenario.objectB}
            </span>
            <span style={{ fontSize: 12, color: scenario.colorB, fontWeight: 800 }}>
              {forceN} N
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(forceSlider / 10) * 100}%`,
              background: scenario.colorB,
              borderRadius: 5,
              transition: 'width 0.25s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── Force magnitude slider ── */}
      <div style={{ marginBottom: 16 }}>
        <label style={{
          fontSize: 12,
          color: '#94a3b8',
          display: 'block',
          marginBottom: 6,
          fontWeight: 600,
        }}>
          Force magnitude: <strong style={{ color: '#fbbf24' }}>{forceN} N</strong>
          <span style={{ color: '#475569', fontWeight: 400, marginLeft: 6 }}>
            (both arrows change together — they are always equal)
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={forceSlider}
          onChange={e => setForceSlider(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#f59e0b' }}
        />
      </div>

      {/* ── "Why don't they cancel?" panel ── */}
      <div style={{
        borderRadius: 12,
        padding: '14px 16px',
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.3)',
        marginBottom: 14,
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#818cf8',
          margin: '0 0 8px',
        }}>
          Why don&#39;t they cancel out?
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.65 }}>
          These forces do <strong>not</strong> cancel because they act on{' '}
          <strong style={{ color: '#818cf8' }}>different objects</strong>.
          Force on {scenario.objectA} acts on {scenario.objectA}.
          Force on {scenario.objectB} acts on {scenario.objectB}.
          You can only cancel forces that act on the{' '}
          <strong style={{ color: '#818cf8' }}>same object</strong>.
        </p>
      </div>

      {/* ── Common Misconception toggle ── */}
      <div style={{ marginBottom: 14 }}>
        <button
          onClick={() => setShowMisconception(v => !v)}
          style={{
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            border: showMisconception
              ? '1px solid rgba(248,113,113,0.5)'
              : '1px solid rgba(255,255,255,0.1)',
            background: showMisconception
              ? 'rgba(248,113,113,0.12)'
              : 'rgba(255,255,255,0.04)',
            color: showMisconception ? '#f87171' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          {showMisconception ? '✓ Hide Misconception' : '⚠ Common Misconception'}
        </button>

        {showMisconception && (
          <div style={{
            marginTop: 10,
            borderRadius: 10,
            padding: '12px 14px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
          }}>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#f87171',
              margin: '0 0 6px',
            }}>
              {scenario.title} — Misconception
            </p>
            <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.65 }}>
              {scenario.misconception}
            </p>
          </div>
        )}
      </div>

      {/* ── Force pair summary table ── */}
      <div style={{
        borderRadius: 12,
        padding: '14px 16px',
        background: '#0B0F15',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 14,
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#64748b',
          margin: '0 0 10px',
        }}>Action–Reaction Pair</p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          {/* Object A */}
          <div style={{
            flex: 1,
            borderRadius: 10,
            padding: '10px 12px',
            background: `rgba(${hexToRgb(scenario.colorA)}, 0.08)`,
            border: `1px solid rgba(${hexToRgb(scenario.colorA)}, 0.3)`,
          }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: scenario.colorA, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {scenario.objectA}
            </p>
            <p style={{ fontSize: 12, color: '#e2e8f0', margin: 0 }}>
              {scenario.forceOnA}
            </p>
          </div>

          {/* Equal sign */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 28 }}>
            <span style={{ fontSize: 18, color: '#64748b', fontWeight: 900 }}>=</span>
          </div>

          {/* Object B */}
          <div style={{
            flex: 1,
            borderRadius: 10,
            padding: '10px 12px',
            background: `rgba(${hexToRgb(scenario.colorB)}, 0.08)`,
            border: `1px solid rgba(${hexToRgb(scenario.colorB)}, 0.3)`,
          }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: scenario.colorB, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {scenario.objectB}
            </p>
            <p style={{ fontSize: 12, color: '#e2e8f0', margin: 0 }}>
              {scenario.forceOnB}
            </p>
          </div>
        </div>
      </div>

      {/* ── Key insight callout ── */}
      <div style={{
        borderRadius: 12,
        padding: '14px 16px',
        background: 'rgba(245,158,11,0.07)',
        border: '1px solid rgba(245,158,11,0.25)',
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#f59e0b',
          margin: '0 0 6px',
        }}>
          Key Insight
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.65 }}>
          For every action, there is an <strong>equal and opposite</strong> reaction.
          Forces always come in pairs — but always on <strong>different</strong> objects.
        </p>
      </div>
    </div>
  );
}

// ── Utility: hex → "r,g,b" for rgba() ─────────────────────────────────────────

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
