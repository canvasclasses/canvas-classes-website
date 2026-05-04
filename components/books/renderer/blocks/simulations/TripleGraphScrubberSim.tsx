'use client';

// TripleGraphScrubberSim.tsx
// Class 9 Physics — Chapter 9: Motion (Pages 6 & 7 — graphs)
// Three stacked graphs (position-time, velocity-time, acceleration-time)
// driven by a single time slider. Lets the student see at a glance how
// the slope of pos-t becomes the value of v-t, and the slope of v-t
// becomes the value of a-t.
// Source: NCERT Class 9 Science (Exploration), §4.2 (graphical representation)
// and §4.3 (constant-acceleration kinematics).

import { useState } from 'react';

type Scenario = 'uniform' | 'accel' | 'brake' | 'multi' | 'freefall';

interface Cfg {
  id: Scenario;
  label: string;
  sublabel: string;
  T: number;            // duration (s)
  xMax: number;         // position axis max (m)
  vMax: number;         // velocity axis max (m/s)
  aMax: number;         // acceleration axis max (m/s²) — symmetric (so −aMax to +aMax)
  // returns position, velocity, acceleration at time t
  state: (t: number) => { x: number; v: number; a: number };
}

const SCENARIOS: Cfg[] = [
  {
    id: 'uniform',
    label: 'Uniform',
    sublabel: 'v = 10 m/s steady',
    T: 12, xMax: 130, vMax: 20, aMax: 5,
    state: (t) => ({ x: 10 * t, v: 10, a: 0 }),
  },
  {
    id: 'accel',
    label: 'Speeding up',
    sublabel: 'a = 2 m/s², u = 0',
    T: 12, xMax: 150, vMax: 26, aMax: 5,
    state: (t) => ({ x: 0.5 * 2 * t * t, v: 2 * t, a: 2 }),
  },
  {
    id: 'brake',
    label: 'Braking',
    sublabel: 'u = 20 m/s, a = −2 m/s²',
    T: 10, xMax: 110, vMax: 22, aMax: 5,
    state: (t) => {
      const tStop = 10;
      const tt = Math.min(t, tStop);
      return {
        x: 20 * tt + 0.5 * (-2) * tt * tt,
        v: Math.max(0, 20 - 2 * tt),
        a: t < tStop ? -2 : 0,
      };
    },
  },
  {
    id: 'multi',
    label: 'Three-phase',
    sublabel: 'speed up → cruise → brake',
    T: 12, xMax: 130, vMax: 20, aMax: 5,
    state: (t) => {
      // 0–4 s: a = +3 m/s² from rest → reaches 12 m/s, covers 24 m
      // 4–8 s: cruise at 12 m/s, covers 48 m more (24 → 72)
      // 8–12 s: a = −3 m/s² from 12 m/s → reaches 0 m/s in 4 s, covers 24 m more (72 → 96)
      if (t <= 4) return { x: 0.5 * 3 * t * t, v: 3 * t, a: 3 };
      if (t <= 8) {
        const tau = t - 4;
        return { x: 24 + 12 * tau, v: 12, a: 0 };
      }
      const tau = t - 8;
      return {
        x: 72 + 12 * tau + 0.5 * (-3) * tau * tau,
        v: Math.max(0, 12 - 3 * tau),
        a: t < 12 ? -3 : 0,
      };
    },
  },
  {
    id: 'freefall',
    label: 'Free fall',
    sublabel: 'a = g = 9.8 m/s², from rest',
    T: 4, xMax: 80, vMax: 40, aMax: 12,
    state: (t) => ({ x: 0.5 * 9.8 * t * t, v: 9.8 * t, a: 9.8 }),
  },
];

export default function TripleGraphScrubberSim() {
  const [scenarioId, setScenarioId] = useState<Scenario>('accel');
  const [t, setT] = useState(0);

  const cfg = SCENARIOS.find(s => s.id === scenarioId)!;
  // Clamp t to scenario duration when scenario changes
  const tClamped = Math.min(t, cfg.T);
  const { x, v, a } = cfg.state(tClamped);

  // ── Geometry ──────────────────────────────────────────────────────────────
  const SVG_W = 720;
  const SINGLE_H = 130;
  const PAD_L = 50;
  const PAD_R = 18;
  const PAD_T = 12;
  const PAD_B = 22;
  const plotW = SVG_W - PAD_L - PAD_R;
  const plotH = SINGLE_H - PAD_T - PAD_B;

  const tToX = (tt: number) => PAD_L + (tt / cfg.T) * plotW;
  const xToY = (val: number, vMin: number, vMax: number) =>
    PAD_T + plotH - ((val - vMin) / (vMax - vMin)) * plotH;

  // ── Build curve paths ─────────────────────────────────────────────────────
  function buildPath(getter: (s: { x: number; v: number; a: number }) => number,
                     vMin: number, vMax: number) {
    const N = 80;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const tt = (i / N) * cfg.T;
      const val = getter(cfg.state(tt));
      const px = tToX(tt);
      const py = xToY(val, vMin, vMax);
      d += (i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`);
    }
    return d;
  }

  const xPath = buildPath(s => s.x, 0, cfg.xMax);
  const vPath = buildPath(s => s.v, 0, cfg.vMax);
  const aPath = buildPath(s => s.a, -cfg.aMax, cfg.aMax);

  return (
    <div className="p-4 md:p-6"
         style={{ background:'#0d1117', color:'#e2e8f0', minHeight:'80vh' }}>
      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Triple Graph <span style={{color:'#7c3aed'}}>Scrubber</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
             style={{color:'#475569'}}>
            One time slider. Three graphs. See how slope becomes value.
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1"
             style={{color:'#64748b'}}>
          NCERT Class 9 — §4.2 / §4.3
        </div>
      </div>

      {/* Scenario picker */}
      <div className="grid grid-cols-2 md:grid-cols-5 mb-4">
        {SCENARIOS.map(s => {
          const active = s.id === scenarioId;
          return (
            <button key={s.id}
                    onClick={() => { setScenarioId(s.id); setT(0); }}
                    className="px-2 py-2 text-center transition-all"
                    style={{
                      borderBottom: `2px solid ${active ? '#818cf8' : 'rgba(255,255,255,0.06)'}`,
                      opacity: active ? 1 : 0.5,
                      background:'none', outline:'none', cursor:'pointer',
                    }}>
              <div className="text-xs font-black" style={{color:'#c4b5fd'}}>{s.label}</div>
              <div className="text-[10px] truncate" style={{color:'#475569'}}>{s.sublabel}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
        {/* Three graphs stacked */}
        <div className="rounded-3xl overflow-hidden"
             style={{
               background:'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
               border:'1px solid rgba(99,102,241,0.2)',
               padding: 8,
             }}>
          {/* Position-time */}
          <Graph
            title="Position vs time"
            yLabel="x (m)"
            color="#34d399"
            value={x}
            unit="m"
            tToX={tToX}
            xToY={(vv) => xToY(vv, 0, cfg.xMax)}
            T={cfg.T}
            valMin={0}
            valMax={cfg.xMax}
            yTicks={[0, cfg.xMax / 2, cfg.xMax]}
            curvePath={xPath}
            tCurrent={tClamped}
            valCurrent={x}
            SVG_W={SVG_W}
            SINGLE_H={SINGLE_H}
            PAD_L={PAD_L}
            PAD_R={PAD_R}
            PAD_T={PAD_T}
            PAD_B={PAD_B}
            plotW={plotW}
            plotH={plotH}
          />
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }} />

          {/* Velocity-time */}
          <Graph
            title="Velocity vs time"
            yLabel="v (m/s)"
            color="#fbbf24"
            value={v}
            unit="m/s"
            tToX={tToX}
            xToY={(vv) => xToY(vv, 0, cfg.vMax)}
            T={cfg.T}
            valMin={0}
            valMax={cfg.vMax}
            yTicks={[0, cfg.vMax / 2, cfg.vMax]}
            curvePath={vPath}
            tCurrent={tClamped}
            valCurrent={v}
            SVG_W={SVG_W}
            SINGLE_H={SINGLE_H}
            PAD_L={PAD_L}
            PAD_R={PAD_R}
            PAD_T={PAD_T}
            PAD_B={PAD_B}
            plotW={plotW}
            plotH={plotH}
          />
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }} />

          {/* Acceleration-time */}
          <Graph
            title="Acceleration vs time"
            yLabel="a (m/s²)"
            color="#f87171"
            value={a}
            unit="m/s²"
            tToX={tToX}
            xToY={(vv) => xToY(vv, -cfg.aMax, cfg.aMax)}
            T={cfg.T}
            valMin={-cfg.aMax}
            valMax={cfg.aMax}
            yTicks={[-cfg.aMax, 0, cfg.aMax]}
            curvePath={aPath}
            tCurrent={tClamped}
            valCurrent={a}
            SVG_W={SVG_W}
            SINGLE_H={SINGLE_H}
            PAD_L={PAD_L}
            PAD_R={PAD_R}
            PAD_T={PAD_T}
            PAD_B={PAD_B}
            plotW={plotW}
            plotH={plotH}
            showZeroLine
          />

          {/* Time slider */}
          <div className="px-4 py-3" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest"
                    style={{color:'#94a3b8'}}>Time playhead</span>
              <span className="text-base font-black text-white">{tClamped.toFixed(2)} s</span>
            </div>
            <input type="range" min={0} max={cfg.T} step={0.05}
                   value={tClamped}
                   onChange={e=>setT(Number(e.target.value))}
                   style={{ width:'100%', accentColor:'#818cf8' }}/>
          </div>
        </div>

        {/* Live readout sidebar */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-4"
               style={{ background:'#0B0F15', border:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-3"
                 style={{color:'#64748b'}}>At t = {tClamped.toFixed(2)} s</div>

            <Readout label="Position" value={x.toFixed(2)} unit="m" color="#34d399"/>
            <Readout label="Velocity" value={v.toFixed(2)} unit="m/s" color="#fbbf24"/>
            <Readout label="Acceleration" value={a.toFixed(2)} unit="m/s²" color="#f87171"/>
          </div>

          {/* Slope-becomes-value insight */}
          <div className="rounded-2xl p-4"
               style={{ background:'#0B0F15', border:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2"
                 style={{color:'#6366f1'}}>The Slope-Value Bridge</div>
            <p className="text-sm font-bold text-white leading-snug">
              Watch the <span style={{color:'#34d399'}}>slope</span> of the position graph
              at the playhead. <br/>
              That slope <span style={{color:'#fbbf24'}}>= value</span> on the velocity graph.<br/>
              Then the slope of the velocity graph
              <span style={{color:'#f87171'}}> = value</span> on the acceleration graph.
            </p>
          </div>

          {/* Expert tip */}
          <div className="pt-3" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5"
               style={{color:'#6366f1'}}>Expert Tip</p>
            <p className="text-white text-sm font-bold leading-tight italic">
              &ldquo;A graph is not a route map. It tells you how one number changes
              with time — and the slope tells you how fast.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────

function Graph({
  title, yLabel, color, tToX, xToY, T, valMin, valMax, yTicks,
  curvePath, tCurrent, valCurrent,
  SVG_W, SINGLE_H, PAD_L, PAD_R, PAD_T, PAD_B, plotW, plotH,
  showZeroLine,
}: {
  title: string;
  yLabel: string;
  color: string;
  value: number;
  unit: string;
  tToX: (t: number) => number;
  xToY: (v: number) => number;
  T: number;
  valMin: number;
  valMax: number;
  yTicks: number[];
  curvePath: string;
  tCurrent: number;
  valCurrent: number;
  SVG_W: number;
  SINGLE_H: number;
  PAD_L: number;
  PAD_R: number;
  PAD_T: number;
  PAD_B: number;
  plotW: number;
  plotH: number;
  showZeroLine?: boolean;
}) {
  const playheadX = tToX(tCurrent);
  const playheadY = xToY(valCurrent);

  return (
    <div className="px-2 pt-2 pb-1">
      <div className="flex justify-between items-baseline px-2">
        <span className="text-[11px] font-black uppercase tracking-widest" style={{color}}>
          {title}
        </span>
        <span className="text-[10px]" style={{color:'#475569'}}>{yLabel}</span>
      </div>
      <svg viewBox={`0 0 ${SVG_W} ${SINGLE_H}`} width="100%" style={{ display:'block', height:'auto' }}>
        {/* Grid lines */}
        {yTicks.map((y, i) => (
          <line key={i}
                x1={PAD_L} y1={xToY(y)} x2={PAD_L + plotW} y2={xToY(y)}
                stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
        ))}
        {/* Time grid */}
        {Array.from({ length: Math.floor(T) + 1 }).map((_, i) => (
          <line key={i}
                x1={tToX(i)} y1={PAD_T} x2={tToX(i)} y2={PAD_T + plotH}
                stroke="rgba(255,255,255,0.04)" strokeWidth={1}/>
        ))}

        {/* Zero line for acceleration */}
        {showZeroLine && (
          <line x1={PAD_L} y1={xToY(0)} x2={PAD_L + plotW} y2={xToY(0)}
                stroke="rgba(255,255,255,0.2)" strokeWidth={1}/>
        )}

        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH}
              stroke="rgba(255,255,255,0.3)" strokeWidth={1}/>
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH}
              stroke="rgba(255,255,255,0.3)" strokeWidth={1}/>

        {/* Y tick labels */}
        {yTicks.map((y, i) => (
          <text key={i} x={PAD_L - 5} y={xToY(y) + 3} textAnchor="end"
                fontSize={10} fill="#64748b">{y}</text>
        ))}

        {/* Time tick labels (only at the bottom of the last graph would be ideal, but let's keep it minimal) */}
        {[0, Math.round(T/2), Math.round(T)].map((tt, i) => (
          <text key={i} x={tToX(tt)} y={SINGLE_H - 6} textAnchor="middle"
                fontSize={10} fill="#64748b">{tt}s</text>
        ))}

        {/* Curve */}
        <path d={curvePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"/>

        {/* Playhead vertical line */}
        <line x1={playheadX} y1={PAD_T} x2={playheadX} y2={PAD_T + plotH}
              stroke="rgba(255,255,255,0.4)" strokeWidth={1} strokeDasharray="3 3"/>

        {/* Playhead dot on curve */}
        <circle cx={playheadX} cy={playheadY} r={5} fill={color} stroke="#fff" strokeWidth={1.5}/>

        {/* Value readout floating near dot */}
        <text x={playheadX + 8} y={playheadY - 6}
              fontSize={10} fontWeight={800} fill={color}>
          {valCurrent.toFixed(1)}
        </text>
      </svg>
    </div>
  );
}

function Readout({ label, value, unit, color }:{
  label: string; value: string; unit: string; color: string;
}) {
  return (
    <div className="flex justify-between items-baseline mb-2.5">
      <span className="text-xs font-bold" style={{color:'#94a3b8'}}>{label}</span>
      <div>
        <span className="text-2xl font-black tabular-nums" style={{color}}>{value}</span>
        <span className="text-xs ml-1" style={{color:'#64748b'}}>{unit}</span>
      </div>
    </div>
  );
}
