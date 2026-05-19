'use client';

// Power Simulator — Chapter 4: Work and Energy
// P = W/t = F × v — Source: NCERT Class 9 Science, Chapter 11
// Compares power of different activities and machines.
// Also introduces commercial unit of energy: 1 kWh = 3.6 × 10⁶ J

interface Activity {
  id: string;
  label: string;
  emoji: string;
  power: number;    // Watts
  color: string;
  desc: string;
}

// Reference power values — approximate real-world data
const ACTIVITIES: Activity[] = [
  { id: 'led',      label: 'LED Bulb',         emoji: '💡', power: 10,     color: '#fbbf24', desc: '10 W LED replaces a 60 W incandescent — 6× more efficient.' },
  { id: 'fan',      label: 'Ceiling Fan',       emoji: '🌀', power: 75,     color: '#60a5fa', desc: 'A ceiling fan running at full speed consumes about 75 W.' },
  { id: 'human',    label: 'Human (walking)',   emoji: '🚶', power: 100,    color: '#34d399', desc: 'A person walking briskly expends roughly 80–120 W of metabolic power.' },
  { id: 'cycle',    label: 'Cyclist (race)',    emoji: '🚴', power: 400,    color: '#818cf8', desc: 'A professional cyclist sustains ~400 W; Tour de France riders hit ~500 W.' },
  { id: 'horse',    label: '1 Horsepower',      emoji: '🐎', power: 746,    color: '#f87171', desc: '1 hp = 746 W — originally defined by James Watt using a horse.' },
  { id: 'car',      label: 'Small Car engine',  emoji: '🚗', power: 55000,  color: '#fb923c', desc: 'A 55 kW (75 hp) engine — typical for a compact hatchback.' },
  { id: 'train',    label: 'Electric Loco',     emoji: '🚂', power: 3000000, color: '#a78bfa', desc: 'A WAP-7 locomotive: ~6,000 hp = ~4.5 MW. Our example is 3 MW.' },
];

import { useState } from 'react';

const MAX_LOG_W = Math.log10(3000000);   // for log-scale bar

function fmtPower(W: number): string {
  if (W >= 1e6) return `${(W / 1e6).toFixed(2)} MW`;
  if (W >= 1e3) return `${(W / 1e3).toFixed(1)} kW`;
  return `${W} W`;
}

function fmtEnergy(J: number): string {
  if (J >= 1e9)  return `${(J / 1e9).toFixed(2)} GJ`;
  if (J >= 1e6)  return `${(J / 1e6).toFixed(2)} MJ`;
  if (J >= 1e3)  return `${(J / 1e3).toFixed(1)} kJ`;
  return `${J.toFixed(1)} J`;
}

export default function PowerSim() {
  const [selected, setSelected] = useState<string>('human');
  const [F, setF] = useState(200);       // N — staircase mode
  const [h, setH] = useState(10);        // m — height climbed
  const [t, setT] = useState(30);        // seconds

  const act = ACTIVITIES.find(a => a.id === selected) ?? ACTIVITIES[2];

  // Staircase calculation
  const W_stair = F * h;                    // Work = mgh (F here = weight = mg)
  const P_stair = W_stair / t;             // Power = W / t
  const kWh = (act.power * 3600) / 3.6e6;  // kWh consumed by selected activity per hour

  // How long to heat 1 litre of water (≈ 4200 J / act.power s)
  const waterHeatTime = act.power > 0 ? (4200 / act.power).toFixed(1) : '—';

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
          Power & Energy Rate
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          P = W/t = F × v — power is how fast work is done
        </p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — power comparison + staircase */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Power comparison log-scale bars */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '14px 16px', marginBottom: 14,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Power comparison (log scale)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ACTIVITIES.map(a => {
                const logBar = ((Math.log10(a.power) / MAX_LOG_W) * 100).toFixed(1);
                const isSel = a.id === selected;
                return (
                  <button key={a.id} onClick={() => setSelected(a.id)} style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, width: 24 }}>{a.emoji}</span>
                      <span style={{
                        fontSize: 11, width: 120, flexShrink: 0,
                        color: isSel ? a.color : '#64748b',
                        fontWeight: isSel ? 700 : 400,
                      }}>
                        {a.label}
                      </span>
                      <div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.05)',
                        borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 6,
                          width: `${logBar}%`,
                          background: isSel ? a.color : `${a.color}55`,
                          transition: 'width 0.3s',
                          boxShadow: isSel ? `0 0 8px ${a.color}60` : 'none',
                        }} />
                      </div>
                      <span style={{
                        fontSize: 11, width: 62, textAlign: 'right', flexShrink: 0,
                        color: isSel ? a.color : '#64748b',
                        fontWeight: isSel ? 700 : 400,
                      }}>
                        {fmtPower(a.power)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 10, color: '#475569', marginTop: 10, margin: 0 }}>
              * Bar width uses log scale — each division is ×10 increase in power
            </p>
          </div>

          {/* Selected activity info card */}
          <div style={{
            background: `${act.color}0d`,
            border: `1px solid ${act.color}25`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 14,
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 36 }}>{act.emoji}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: act.color, marginBottom: 4 }}>
                {act.label} — {fmtPower(act.power)}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{act.desc}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Energy in 1 hour</div>
                  <div style={{ fontSize: 13, color: act.color, fontWeight: 700 }}>
                    {(act.power * 3600 / 1000).toFixed(1)} kJ = {kWh.toFixed(4)} kWh
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Time to heat 1 L water</div>
                  <div style={{ fontSize: 13, color: act.color, fontWeight: 700 }}>
                    {Number(waterHeatTime) > 3600
                      ? `${(Number(waterHeatTime) / 60).toFixed(0)} min`
                      : `${waterHeatTime} s`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Staircase calculation */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '14px 16px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Staircase Power Calculator
            </p>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              {/* Staircase SVG */}
              <svg width={100} height={100} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                {/* Steps */}
                {[0, 1, 2, 3, 4].map(i => (
                  <rect key={i}
                    x={10 + i * 16} y={80 - i * 14}
                    width={18} height={14 * (i + 1)}
                    fill="#1e293b" stroke="#334155" strokeWidth={1}
                  />
                ))}
                {/* Person at top */}
                <text x={78} y={18} fontSize={16} textAnchor="middle">🧗</text>
                {/* Height arrow */}
                <line x1={8} y1={80} x2={8} y2={10} stroke="#f87171" strokeWidth={1.5}
                  markerEnd="url(#h-arrow)" />
                <defs>
                  <marker id="h-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#f87171" />
                  </marker>
                </defs>
                <text x={5} y={50} fill="#f87171" fontSize={8} textAnchor="middle">h</text>
              </svg>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                  {[
                    { label: 'Weight F (N)', val: F, set: setF, min: 100, max: 1000, step: 10, color: '#f87171' },
                    { label: 'Height h (m)', val: h, set: setH, min: 1, max: 30, step: 1, color: '#6366f1' },
                    { label: 'Time t (s)',   val: t, set: setT, min: 5, max: 120, step: 5, color: '#fbbf24' },
                  ].map(({ label, val, set, min, max, step, color }) => (
                    <div key={label} style={{ flex: 1, minWidth: 80 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: '#64748b' }}>{label}</span>
                        <span style={{ fontSize: 12, color, fontWeight: 700 }}>{val}</span>
                      </div>
                      <input type="range" min={min} max={max} step={step} value={val}
                        onChange={e => set(Number(e.target.value))}
                        style={{ width: '100%', accentColor: color }} />
                    </div>
                  ))}
                </div>

                {/* Result */}
                <div style={{
                  marginTop: 12,
                  background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 8, padding: '10px 12px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Work = F × h = {F} × {h}</div>
                    <div style={{ fontSize: 12, color: '#818cf8', fontWeight: 600 }}>{W_stair.toLocaleString()} J</div>
                  </div>
                  <div style={{ fontSize: 22, color: '#6366f1', fontWeight: 800 }}>⚡</div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Power = W / t</div>
                    <div style={{ fontSize: 18, color: '#818cf8', fontWeight: 800 }}>{P_stair.toFixed(1)} W</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — concepts + kWh */}
        <div style={{ width: 240, flexShrink: 0 }}>

          {/* Formula box */}
          <div style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 10, padding: '14px 12px', marginBottom: 16, textAlign: 'center',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Formulae
            </p>
            {[
              { lhs: 'P', rhs: 'W / t', sub: 'Power = Work ÷ Time' },
              { lhs: 'P', rhs: 'F × v', sub: 'Power = Force × velocity' },
              { lhs: '1 W', rhs: '1 J/s', sub: '1 Watt = 1 Joule per second' },
              { lhs: '1 kWh', rhs: '3.6 × 10⁶ J', sub: 'Commercial unit of energy' },
            ].map(({ lhs, rhs, sub }) => (
              <div key={lhs} style={{
                marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#818cf8' }}>
                  {lhs} = {rhs}
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* kWh explainer */}
          <div style={{
            background: 'rgba(251,146,60,0.07)',
            border: '1px solid rgba(251,146,60,0.2)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 14,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Commercial Unit — kWh
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Electricity bills use <strong style={{ color: '#fb923c' }}>kilowatt-hours (kWh)</strong>.
              <br />
              1 kWh = 1000 W × 3600 s = <strong style={{ color: '#fbbf24' }}>3.6 × 10⁶ J</strong>.
              <br />
              Running a 1000 W kettle for 1 hour = <strong>1 unit</strong> of electricity.
            </p>
          </div>

          {/* Key concepts */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Key Concepts
            </p>
            {[
              { term: 'Power', def: 'Rate of doing work. Same work in less time → more power.' },
              { term: 'Unit: Watt', def: '1 W = 1 J/s. Named after James Watt (steam engine).' },
              { term: '1 Horsepower', def: '≈ 746 W. Watt defined it to sell steam engines.' },
              { term: 'Average power', def: 'P_avg = W_total / t_total' },
              { term: 'Efficiency', def: 'Useful power out / total power in × 100%. No machine is 100% efficient.' },
            ].map(({ term, def }) => (
              <div key={term} style={{ marginBottom: 9 }}>
                <div style={{ fontSize: 11, color: '#fb923c', fontWeight: 700 }}>{term}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{def}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
