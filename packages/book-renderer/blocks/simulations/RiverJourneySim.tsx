'use client';

// RiverJourneySim.tsx
// Class 9 Social Science — "A River's Journey" (Ch.2, rivers-waterfalls-meanders-and-deltas)
// A refined, animated side-on landscape: water flows continuously from a
// mountain source to the sea; a glowing droplet travels the whole course on
// Play and lights up each stage (Upper → Middle → Lower) with its landforms as
// it passes. Replaces the static 3-dot "A River's Journey" timeline.
//
// Anti-hallucination gate (§7): every fact below is taken verbatim from this
// book's own NCERT-sourced page text (the "A River's Journey" section of
// rivers-waterfalls-meanders-and-deltas):
//   Upper course — steep gradients, strong erosive force → V-shaped valleys,
//     waterfalls, rapids.
//   Middle course — river meanders, loses energy → oxbow lakes, floodplains.
//   Lower course — river slows, deposits sediment → deltas, levees, alluvial fans.
// Design system: _agents/workflows/SIMULATION_DESIGN_WORKFLOW.md (dark #0d1117
// root, indigo/amber/emerald palette, CSS @keyframes + requestAnimationFrame
// only — no animation libraries. SVG filters/gradients are native, not libs).

import { useState, useEffect, useRef, useCallback } from 'react';

type StageId = 'upper' | 'middle' | 'lower';

interface Stage {
  id: StageId;
  label: string;
  gradient: string;
  speed: string;
  process: string;
  landforms: string[];
  tip: string;
  accent: string;       // in-palette accent for this stage
  start: number;        // progress (0..1) where this stage begins on the river path
}

// Progress bands along the river path: upper 0–0.34, middle 0.34–0.68, lower 0.68–1.
const STAGES: Stage[] = [
  {
    id: 'upper',
    label: 'Upper course',
    gradient: 'Steep',
    speed: 'Fast & turbulent',
    process: 'Erosion — cutting downward',
    landforms: ['V-shaped valleys', 'Waterfalls', 'Rapids'],
    tip: 'Up here the river has one job: cut DOWN. All that energy carves deep, narrow valleys.',
    accent: '#fbbf24',  // amber — high energy
    start: 0,
  },
  {
    id: 'middle',
    label: 'Middle course',
    gradient: 'Gentle',
    speed: 'Moderate',
    process: 'Transport + sideways erosion',
    landforms: ['Meanders', 'Oxbow lakes', 'Floodplains'],
    tip: 'The river stops cutting down and starts swinging sideways — that is what carves the big looping bends.',
    accent: '#818cf8',  // indigo — primary
    start: 0.34,
  },
  {
    id: 'lower',
    label: 'Lower course',
    gradient: 'Nearly flat',
    speed: 'Slow',
    process: 'Deposition — dropping sediment',
    landforms: ['Deltas', 'Levees', 'Alluvial fans'],
    tip: 'Out of energy, the river drops everything it carried — building brand-new land where it meets the sea.',
    accent: '#34d399',  // emerald — new land / growth
    start: 0.68,
  },
];

function stageForProgress(p: number): StageId {
  if (p >= STAGES[2].start) return 'lower';
  if (p >= STAGES[1].start) return 'middle';
  return 'upper';
}

// The single river "spine" — source (top-left) to the delta at the sea. Used
// BOTH as the visible channel and (via getPointAtLength) as the droplet's
// track. Upper = steep drop + a vertical waterfall segment; middle = two
// pronounced meander loops; lower = a slow glide to the delta apex.
const RIVER_D =
  'M 150 82 L 206 138 L 250 176 L 258 192 L 264 236 ' +   // upper: steep descent + waterfall
  'Q 292 250 332 252 ' +                                   // spill into the middle course
  'C 388 254 382 302 432 304 ' +                           // meander loop 1 (bulges down)
  'C 488 306 472 258 542 268 ' +                           // meander loop 2 (rises)
  'C 598 276 590 308 650 304 ' +                           // settle
  'Q 742 300 838 302';                                     // glide to the delta apex

// Lower-course underlay (traces the tail of RIVER_D) drawn wider, so the river
// visibly broadens from mountain stream to lowland river before the delta.
const LOWER_D = 'M 542 268 C 598 276 590 308 650 304 Q 742 300 838 302';

const VIEW_W = 1000;
const VIEW_H = 470;
const DELTA = { x: 838, y: 302 };
// Distributary channels fanning from the delta apex into the sea.
const DELTA_CHANNELS: [number, number][] = [
  [978, 258], [990, 300], [980, 342], [936, 378], [900, 250],
];

export default function RiverJourneySim() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);          // 0..1 along the river
  const [manualStage, setManualStage] = useState<StageId | null>(null);

  const pathRef = useRef<SVGPathElement | null>(null);
  const lenRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const [drop, setDrop] = useState<{ x: number; y: number } | null>(null);

  // Which stage is "active": whatever the droplet is passing through while
  // playing, or the tab the reader clicked.
  const activeStage: StageId = manualStage ?? stageForProgress(progress);
  const active = STAGES.find((s) => s.id === activeStage)!;

  const placeDrop = useCallback((p: number) => {
    const path = pathRef.current;
    if (!path || !lenRef.current) return;
    const pt = path.getPointAtLength(p * lenRef.current);
    setDrop({ x: pt.x, y: pt.y });
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      lenRef.current = pathRef.current.getTotalLength();
      placeDrop(progress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // rAF drive: advance the droplet ~ one full journey every 11 seconds, then loop.
  const tick = useCallback((ts: number) => {
    if (lastTRef.current === null) lastTRef.current = ts;
    const dt = (ts - lastTRef.current) / 1000;
    lastTRef.current = ts;
    setProgress((prev) => {
      let next = prev + dt / 11;
      if (next >= 1) next = 0;              // loop the journey
      placeDrop(next);
      return next;
    });
    rafRef.current = requestAnimationFrame(tick);
  }, [placeDrop]);

  useEffect(() => {
    if (playing) {
      lastTRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing, tick]);

  function togglePlay() {
    setManualStage(null);
    setPlaying((p) => !p);
  }

  function selectStage(id: StageId) {
    setPlaying(false);
    const s = STAGES.find((x) => x.id === id)!;
    setManualStage(id);
    setProgress(s.start);
    placeDrop(s.start);
  }

  // Feature annotations only show while their stage is active — keeps the
  // scene clean but lets each landform name itself as the drop arrives.
  const featureLabels: { x: number; y: number; text: string; stage: StageId }[] = [
    { x: 300, y: 214, text: 'waterfall', stage: 'upper' },
    { x: 432, y: 366, text: 'oxbow lake', stage: 'middle' },
    { x: 912, y: 236, text: 'delta', stage: 'lower' },
  ];

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0' }}>
      <style>{`
        @keyframes rj-flow { to { stroke-dashoffset: -120; } }
        @keyframes rj-drop-glow { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.55); } }
        @keyframes rj-wave { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-7px); } }
        @keyframes rj-fall { to { transform: translateY(9px); } }
        @keyframes rj-mist { 0%,100% { opacity: .28; transform: scale(1); } 50% { opacity: .5; transform: scale(1.12); } }
        .rj-flow { animation: rj-flow 2.4s linear infinite; }
        .rj-drop { animation: rj-drop-glow 1.4s ease-in-out infinite; }
        .rj-fall { animation: rj-fall .9s linear infinite; }
        .rj-mist { animation: rj-mist 3.4s ease-in-out infinite; transform-origin: center; }
      `}</style>

      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            A River&rsquo;s <span style={{ color: '#38bdf8' }}>Journey</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            From mountain source to the sea
          </p>
        </div>
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-widest transition-colors"
          style={{
            background: playing ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#0284c7,#38bdf8)',
            color: playing ? '#94a3b8' : '#04121c',
            border: '1px solid rgba(56,189,248,0.35)',
          }}
        >
          {playing ? '❚❚ Pause the drop' : '▶ Follow a drop'}
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <svg width="100%" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="rj-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a1122" />
              <stop offset="55%" stopColor="#182142" />
              <stop offset="100%" stopColor="#2b2f57" />
            </linearGradient>
            <radialGradient id="rj-sun" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="rgba(251,191,36,0.30)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0)" />
            </radialGradient>
            <linearGradient id="rj-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a4569" />
              <stop offset="100%" stopColor="#232c47" />
            </linearGradient>
            <linearGradient id="rj-land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#33415c" />
              <stop offset="55%" stopColor="#222c3f" />
              <stop offset="100%" stopColor="#141a26" />
            </linearGradient>
            <linearGradient id="rj-plain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#33513a" />
              <stop offset="100%" stopColor="#1b2c1f" />
            </linearGradient>
            <linearGradient id="rj-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#12718c" />
              <stop offset="100%" stopColor="#06283a" />
            </linearGradient>
            <linearGradient id="rj-water" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a5e8ff" />
              <stop offset="55%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <radialGradient id="rj-dropfill" cx="0.5" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </radialGradient>
            <filter id="rj-soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="rj-softer" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          {/* Sky + sun glow */}
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#rj-sky)" />
          <circle cx="770" cy="120" r="150" fill="url(#rj-sun)" />

          {/* Sea (right of the shoreline; land is drawn over its left part) */}
          <rect x="720" y="302" width={VIEW_W - 720} height={VIEW_H - 302} fill="url(#rj-sea)" />
          {[316, 334, 352, 370].map((y, i) => (
            <path key={y} d={`M 840 ${y} q 22 -6 44 0 t 44 0 t 44 0`}
              fill="none" stroke="rgba(186,230,253,0.22)" strokeWidth="2.5"
              style={{ animation: `rj-wave ${3 + i * 0.6}s ease-in-out infinite` }} />
          ))}

          {/* Far hazy mountain range (atmospheric depth) */}
          <path d="M 0 250 L 120 150 L 210 190 L 300 132 L 410 186 L 520 150 L 640 196 L 640 260 L 0 260 Z"
            fill="url(#rj-far)" opacity="0.55" filter="url(#rj-soft)" />

          {/* Near landmass — mountain (left) sloping to the coast (right) */}
          <path
            d="M 0 470 L 0 250 L 150 78 L 250 158 L 372 214 L 520 252 L 680 282 L 838 302 L 838 470 Z"
            fill="url(#rj-land)"
          />
          {/* Ridgeline highlight for crispness */}
          <path d="M 0 250 L 150 78 L 250 158 L 372 214 L 520 252 L 680 282 L 838 302"
            fill="none" stroke="rgba(148,163,184,0.28)" strokeWidth="1.5" />
          {/* Green floodplain over the gentler middle→lower land */}
          <path d="M 372 214 L 520 252 L 680 282 L 838 302 L 838 470 L 372 470 Z"
            fill="url(#rj-plain)" opacity="0.8" />
          {/* Snow cap on the peak */}
          <path d="M 150 78 L 176 104 L 162 108 L 186 124 L 120 124 L 132 108 L 122 110 Z"
            fill="#eaf3ff" opacity="0.92" />
          {/* Valley mist near the waterfall base */}
          <ellipse cx="278" cy="248" rx="42" ry="12" fill="#dff3ff" className="rj-mist" filter="url(#rj-softer)" />

          {/* ── River ─────────────────────────────────────────────────────── */}
          {/* soft outer glow */}
          <path d={RIVER_D} fill="none" stroke="#38bdf8" strokeWidth="16" strokeLinecap="round"
            opacity="0.35" filter="url(#rj-soft)" />
          {/* lower-course widener (river broadens toward the sea) */}
          <path d={LOWER_D} fill="none" stroke="url(#rj-water)" strokeWidth="17" strokeLinecap="round"
            strokeLinejoin="round" opacity="0.95" />
          {/* main channel body */}
          <path ref={pathRef} d={RIVER_D} fill="none" stroke="url(#rj-water)" strokeWidth="7.5"
            strokeLinecap="round" strokeLinejoin="round" />
          {/* specular sheen */}
          <path d={RIVER_D} fill="none" stroke="#eaffff" strokeWidth="2" strokeLinecap="round"
            opacity="0.35" transform="translate(0,-1.4)" />
          {/* animated flow shimmer */}
          <path d={RIVER_D} fill="none" stroke="#f0fbff" strokeWidth="2.4" strokeLinecap="round"
            strokeDasharray="3 26" className="rj-flow" opacity="0.8" />

          {/* Waterfall cascade + spray */}
          <g>
            <rect x="253" y="176" width="10" height="60" rx="5" fill="#dff3ff" opacity="0.7" />
            <rect x="253" y="176" width="10" height="60" rx="5" fill="#ffffff" opacity="0.4" className="rj-fall" />
            <ellipse cx="258" cy="238" rx="16" ry="6" fill="#eaffff" className="rj-mist" filter="url(#rj-soft)" />
          </g>

          {/* Oxbow lake beside meander loop 1 (a cut-off, detached loop) */}
          <path d="M 410 344 a 24 13 0 1 0 48 0 a 24 13 0 1 0 -48 0"
            fill="none" stroke="url(#rj-water)" strokeWidth="7" opacity="0.7" />

          {/* Delta distributaries fanning into the sea */}
          {DELTA_CHANNELS.map(([x2, y2], i) => (
            <path key={i} d={`M ${DELTA.x} ${DELTA.y} Q ${(DELTA.x + x2) / 2} ${(DELTA.y + y2) / 2 - 8} ${x2} ${y2}`}
              fill="none" stroke="url(#rj-water)" strokeWidth={6.5 - i * 0.7} opacity="0.85" strokeLinecap="round" />
          ))}

          {/* Feature annotations — appear only for the active stage */}
          {featureLabels.map((f) => (
            <text key={f.text} x={f.x} y={f.y} textAnchor="middle"
              style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                fill: '#cbd5e1', opacity: activeStage === f.stage ? 0.85 : 0,
                transition: 'opacity 0.35s ease',
              }}>
              {f.text}
            </text>
          ))}

          {/* Stage markers + labels */}
          {STAGES.map((s) => {
            const path = pathRef.current;
            if (!path || !lenRef.current) return null;
            const pt = path.getPointAtLength((s.start + 0.11) * lenRef.current);
            const on = activeStage === s.id;
            return (
              <g key={s.id} style={{ transition: 'opacity 0.3s ease' }} opacity={on ? 1 : 0.55}>
                {on && <circle cx={pt.x} cy={pt.y - 30} r="15" fill={s.accent} opacity="0.18" filter="url(#rj-soft)" />}
                <circle cx={pt.x} cy={pt.y - 30} r={on ? 6 : 4} fill={s.accent} />
                <text x={pt.x} y={pt.y - 44} textAnchor="middle"
                  style={{ fontSize: 13, fontWeight: 800, fill: on ? '#ffffff' : '#94a3b8', letterSpacing: '0.02em' }}>
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* The travelling droplet */}
          {drop && (
            <g className="rj-drop">
              <circle cx={drop.x} cy={drop.y} r="17" fill={active.accent} opacity="0.22" filter="url(#rj-soft)" />
              <circle cx={drop.x} cy={drop.y} r="7.5" fill="url(#rj-dropfill)" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </div>

      {/* Controls: three stage tabs (underline style, §4g) */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {STAGES.map((s) => {
          const on = activeStage === s.id;
          return (
            <button key={s.id} onClick={() => selectStage(s.id)}
              className="pb-2 text-[13px] font-black uppercase tracking-wider transition-colors"
              style={{ color: on ? s.accent : '#64748b', borderBottom: `2px solid ${on ? s.accent : 'transparent'}`, marginBottom: -1 }}>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Active-stage detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-x-8 gap-y-4 mt-4">
        {/* Facts */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              ['Gradient', active.gradient],
              ['Water speed', active.speed],
              ['Main work', active.process],
            ].map(([label, val]) => (
              <div key={label} className="px-3 py-2 rounded-xl" style={{ background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>{label}</div>
                <div className="text-[13px] font-bold mt-0.5" style={{ color: '#e2e8f0' }}>{val}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: active.accent }}>Landforms it builds here</div>
            <div className="flex flex-wrap gap-2">
              {active.landforms.map((lf) => (
                <span key={lf} className="px-3 py-1 rounded-full text-[12px] font-semibold"
                  style={{ background: `${active.accent}1f`, color: active.accent, border: `1px solid ${active.accent}55` }}>
                  {lf}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Expert tip (§4j — sidebar ends with an Expert Tip) */}
        <div className="lg:pl-6 lg:border-l" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>What&rsquo;s really happening</div>
          <p className="text-white text-[15px] font-bold leading-snug italic">&ldquo;{active.tip}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}
