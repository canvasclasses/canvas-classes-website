'use client';

// Weight on Different Worlds — Chapter 3: Gravitation
// W = mg — mass is constant, weight changes with gravitational field strength
// Compare weight on Earth, Moon, Mars, Jupiter, Saturn, Venus, Pluto

import { useState } from 'react';

interface World {
  name: string;
  g: number;       // m/s²
  color: string;
  emoji: string;
  radius: number;  // SVG planet radius
  desc: string;
}

const WORLDS: World[] = [
  { name: 'Sun',     g: 274.0, color: '#fde68a', emoji: '☀️', radius: 44, desc: 'Crushing — you\'d weigh 28× more than on Earth.' },
  { name: 'Jupiter', g: 24.79, color: '#fb923c', emoji: '🟠', radius: 40, desc: 'Largest planet — 2.5× Earth\'s surface gravity.' },
  { name: 'Neptune', g: 11.15, color: '#818cf8', emoji: '🔵', radius: 30, desc: 'Ice giant — slightly heavier than on Earth.' },
  { name: 'Saturn',  g: 10.44, color: '#fbbf24', emoji: '🪐', radius: 36, desc: 'Has rings! Surface gravity close to Earth\'s.' },
  { name: 'Earth',   g: 9.81,  color: '#4ade80', emoji: '🌍', radius: 32, desc: 'Our reference — g = 9.8 m/s² at sea level.' },
  { name: 'Venus',   g: 8.87,  color: '#f59e0b', emoji: '🟡', radius: 30, desc: 'Earth\'s twin in size but slightly lower gravity.' },
  { name: 'Mars',    g: 3.72,  color: '#f87171', emoji: '🔴', radius: 22, desc: 'Red planet — you\'d weigh just 38% of Earth weight.' },
  { name: 'Moon',    g: 1.62,  color: '#94a3b8', emoji: '🌕', radius: 18, desc: 'Lunar gravity — astronauts bounce because of this.' },
  { name: 'Pluto',   g: 0.62,  color: '#a78bfa', emoji: '⚫', radius: 12, desc: 'Dwarf planet — you could jump 10m high here!' },
];

const EARTH_G = 9.81;

function weightOf(mass: number, g: number) {
  return mass * g;
}

export default function WeightOnPlanetsSim() {
  const [mass, setMass] = useState(60);    // kg
  const [selected, setSelected] = useState<string>('Moon');

  const sel = WORLDS.find(w => w.name === selected) ?? WORLDS[7];
  const earthWeight = weightOf(mass, EARTH_G);
  const selWeight   = weightOf(mass, sel.g);
  const ratio       = sel.g / EARTH_G;

  // Spring balance: 0 = fully relaxed (spring stretched down), scale 0–274
  // Normalise spring extension to Earth as reference
  const springNorm = sel.g / 274; // 0 to 1 (Sun is max)
  const springExtension = 40 + springNorm * 90; // pixels

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0', maxWidth: 940, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Weight on Different Worlds</h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          W = m × g — your mass never changes, but your weight does
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — spring balance visual + planet list */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Spring balance */}
          <div style={{
            background: 'linear-gradient(180deg, #060a18 0%, #0a1020 100%)',
            border: `1px solid ${sel.color}30`,
            borderRadius: 14, padding: '16px 0 12px',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            gap: 40, marginBottom: 16,
          }}>
            {/* SVG spring balance */}
            <svg width={120} height={260} viewBox="0 0 120 260">
              {/* Hook at top */}
              <rect x={56} y={10} width={8} height={20} rx={3} fill="#94a3b8" />

              {/* Spring coils */}
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i}
                  d={`M ${50} ${34 + i * 8} Q ${30} ${38 + i * 8} ${50} ${42 + i * 8}`}
                  stroke="#60a5fa" strokeWidth={2} fill="none" />
              ))}

              {/* Gauge body */}
              <rect x={30} y={98} width={60} height={springExtension}
                rx={6} fill="#1e293b" stroke="#334155" strokeWidth={1.5} />

              {/* Scale markings inside gauge */}
              {[0, 25, 50, 75, 100].map((pct, i) => {
                const yPos = 100 + (i / 4) * (springExtension - 4);
                return (
                  <g key={i}>
                    <line x1={32} y1={yPos} x2={40} y2={yPos}
                      stroke="#475569" strokeWidth={1} />
                    <text x={42} y={yPos + 3} fill="#475569" fontSize={7}>
                      {Math.round(274 * (1 - i / 4))}N
                    </text>
                  </g>
                );
              })}

              {/* Needle — position based on weight */}
              <rect
                x={31} y={100}
                width={58} height={Math.max(2, (1 - springNorm) * (springExtension - 4))}
                rx={4} fill="rgba(255,255,255,0.05)" />
              <line
                x1={31} y1={100 + (1 - springNorm) * (springExtension - 4)}
                x2={89} y2={100 + (1 - springNorm) * (springExtension - 4)}
                stroke={sel.color} strokeWidth={2.5} />

              {/* Weight reading */}
              <rect x={22} y={102 + springExtension} width={76} height={28}
                rx={5} fill={`${sel.color}20`} stroke={sel.color} strokeWidth={1} />
              <text x={60} y={118 + springExtension} textAnchor="middle"
                fill={sel.color} fontSize={13} fontWeight={700}>
                {selWeight.toFixed(1)} N
              </text>

              {/* String + object */}
              <line x1={60} y1={130 + springExtension} x2={60} y2={160 + springExtension}
                stroke="#94a3b8" strokeWidth={1.5} />

              {/* Object (circle) */}
              <circle cx={60} cy={175 + springExtension * 0.3}
                r={18} fill={sel.color} opacity={0.85} />
              <text x={60} y={179 + springExtension * 0.3} textAnchor="middle"
                dominantBaseline="middle" fontSize={12} fontWeight={700} fill="#fff">
                {mass}kg
              </text>
            </svg>

            {/* Readings panel */}
            <div style={{ paddingTop: 16 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
                  letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
                  On {sel.name}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: sel.color, lineHeight: 1 }}>
                  {selWeight.toFixed(1)} N
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                  g = {sel.g} m/s²
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>On Earth</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#4ade80' }}>
                  {earthWeight.toFixed(1)} N
                </div>
              </div>

              <div style={{
                marginTop: 12,
                background: `${sel.color}12`,
                border: `1px solid ${sel.color}30`,
                borderRadius: 8, padding: '8px 10px',
              }}>
                <div style={{ fontSize: 11, color: sel.color, fontWeight: 700 }}>
                  {ratio >= 1 ? `${ratio.toFixed(2)}× heavier` : `${(ratio * 100).toFixed(0)}% of Earth weight`}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>{sel.desc}</div>
              </div>
            </div>
          </div>

          {/* Comparison bar chart */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '14px 16px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Weight on all worlds ({mass} kg person)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {WORLDS.map(w => {
                const wt = weightOf(mass, w.g);
                const bar = (w.g / 274) * 100;
                const isSelected = w.name === selected;
                return (
                  <button key={w.name}
                    onClick={() => setSelected(w.name)}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, width: 22 }}>{w.emoji}</span>
                      <span style={{ fontSize: 11, color: isSelected ? w.color : '#64748b',
                        fontWeight: isSelected ? 700 : 400, width: 60, flexShrink: 0 }}>
                        {w.name}
                      </span>
                      <div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.05)',
                        borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 6,
                          width: `${bar}%`,
                          background: isSelected ? w.color : `${w.color}60`,
                          transition: 'width 0.3s',
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: isSelected ? w.color : '#64748b',
                        fontWeight: isSelected ? 700 : 400, width: 54, textAlign: 'right', flexShrink: 0 }}>
                        {wt.toFixed(0)} N
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — controls + concepts */}
        <div style={{ width: 240, flexShrink: 0 }}>

          {/* Mass slider */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Your mass
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Mass (kg)</span>
              <span style={{ fontSize: 18, color: '#4ade80', fontWeight: 800 }}>{mass}</span>
            </div>
            <input type="range" min={10} max={200} step={5} value={mass}
              onChange={e => setMass(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#4ade80' }} />
            <p style={{ fontSize: 10, color: '#475569', margin: '4px 0 0' }}>
              Mass stays {mass} kg everywhere — only weight changes!
            </p>
          </div>

          {/* Planet selector */}
          <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Select world
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 20 }}>
            {WORLDS.map(w => (
              <button key={w.name} onClick={() => setSelected(w.name)} style={{
                padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                border: selected === w.name
                  ? `2px solid ${w.color}`
                  : '1px solid rgba(255,255,255,0.08)',
                background: selected === w.name ? `${w.color}1c` : 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}>
                <span style={{ fontSize: 16 }}>{w.emoji}</span>
                <span style={{ fontSize: 9, color: selected === w.name ? w.color : '#64748b',
                  fontWeight: 600 }}>{w.name}</span>
                <span style={{ fontSize: 9, color: '#475569' }}>{w.g} m/s²</span>
              </button>
            ))}
          </div>

          {/* Concepts */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Key Concepts
            </p>
            {[
              { term: 'Mass', def: 'Amount of matter. Constant everywhere. Unit: kg.' },
              { term: 'Weight', def: 'Gravitational force on mass. W = mg. Unit: N (Newton).' },
              { term: 'On Moon', def: `g_moon ≈ g_earth/6. ${mass} kg person weighs ${(mass * 1.62).toFixed(0)} N.` },
              { term: 'Weightlessness', def: 'Occurs in free fall — astronauts feel weightless in orbit.' },
            ].map(({ term, def }) => (
              <div key={term} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#fb923c', fontWeight: 700, marginBottom: 2 }}>{term}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{def}</div>
              </div>
            ))}
          </div>

          {/* Formula */}
          <div style={{
            marginTop: 12,
            background: 'rgba(251,146,60,0.07)',
            border: '1px solid rgba(251,146,60,0.2)',
            borderRadius: 10, padding: '12px 14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 15, color: '#fb923c', fontWeight: 700, marginBottom: 4 }}>
              W = m × g
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              = <span style={{ color: '#4ade80' }}>{mass}</span>
              {' × '}
              <span style={{ color: sel.color }}>{sel.g}</span>
              {' = '}
              <span style={{ color: '#fb923c', fontWeight: 700 }}>{selWeight.toFixed(1)} N</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
