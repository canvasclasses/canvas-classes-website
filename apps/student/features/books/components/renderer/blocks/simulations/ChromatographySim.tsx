'use client';

/**
 * Chromatography Simulator — Column & Paper Chromatography
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 12, Section 12.8.5 — Chromatography
 * Column: differential adsorption on silica gel stationary phase
 * Paper: differential partition; solvent rises by capillary action
 * Rf values (leaf pigments on silica/petroleum ether): β-carotene ~0.92,
 *   xanthophyll ~0.56, chlorophyll a ~0.22 — standard reference values
 */

import { useState, useRef } from 'react';
import { useAnimationFrame } from './_shared';

type Mode = 'column' | 'paper';

/* ── Data ──────────────────────────────────────────────────────────────── */

const COLUMN_COMPOUNDS = [
  {
    id: 'carotene',
    name: 'β-Carotene',
    color: '#fbbf24',
    rf: 0.92,
    adsorption: 'Low',
    note: 'Non-polar — barely attracted to silica. Moves fastest, elutes first.',
  },
  {
    id: 'xantho',
    name: 'Xanthophyll',
    color: '#34d399',
    rf: 0.56,
    adsorption: 'Medium',
    note: 'Moderately polar — medium silica interaction. Elutes second.',
  },
  {
    id: 'chloro',
    name: 'Chlorophyll a',
    color: '#818cf8',
    rf: 0.22,
    adsorption: 'High',
    note: 'Most polar — strong affinity for silica. Moves slowest, elutes last.',
  },
] as const;

const PAPER_COMPOUNDS = [
  { id: 'yellow', name: 'Yellow pigment', color: '#fbbf24', rf: 0.82 },
  { id: 'red',    name: 'Red pigment',    color: '#f87171', rf: 0.51 },
  { id: 'blue',   name: 'Blue pigment',   color: '#818cf8', rf: 0.20 },
] as const;

/* ── SVG layout constants ──────────────────────────────────────────────── */

const W = 560;
const H = 490;

// Column
const CCX = 200;      // column centre x
const COW = 84;       // outer width
const CWL = 6;        // wall thickness
const CIW = COW - 2 * CWL;  // inner width = 72
const CL  = CCX - COW / 2;  // left outer = 158
const CR  = CCX + COW / 2;  // right outer = 242
const CLI = CL + CWL;        // left inner = 164
const CRI = CR - CWL;        // right inner = 236
const CT  = 78;
const CB  = 420;
const CH  = CB - CT;         // = 342

// Paper
const PCX  = 160;
const PW   = 58;
const PL   = PCX - PW / 2;  // = 131
const PR   = PCX + PW / 2;  // = 189
const PT   = 58;
const PB   = 428;
const OY   = 392;    // origin line y

const BAND_H = 14;
const MAX_RF  = 0.92;

/* ── Helpers ───────────────────────────────────────────────────────────── */

function colBandY(rf: number, p: number): number {
  return CT + 10 + (rf / MAX_RF) * p * (CH - 10);
}

function papSpotY(rf: number, p: number): number {
  return OY - (OY - PT - 18) * rf * p;
}

function papFrontY(p: number): number {
  return OY - (OY - PT - 18) * p;
}

/* ── CSS animations ────────────────────────────────────────────────────── */

const CSS = `
  @keyframes chro-drip {
    0%   { opacity:0; transform:translateY(0px); }
    25%  { opacity:0.85; }
    100% { opacity:0; transform:translateY(13px); }
  }
  .chro-drip { animation: chro-drip 1.1s ease-in infinite; }
`;

/* ── Column SVG ────────────────────────────────────────────────────────── */

function ColumnSVG({ p, running }: { p: number; running: boolean }) {
  const exited = colBandY(MAX_RF, p) >= CB - BAND_H / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cc-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#1e204a" />
          <stop offset="100%" stopColor="#050614" />
        </radialGradient>
        <pattern id="silica" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.3" fill="rgba(148,163,184,0.18)" />
        </pattern>
        <clipPath id="col-clip">
          <rect x={CLI} y={CT} width={CIW} height={CH} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="url(#cc-bg)" />

      {/* Packing */}
      <rect x={CLI} y={CT} width={CIW} height={CH} fill="#111827" />
      <rect x={CLI} y={CT} width={CIW} height={CH} fill="url(#silica)" />

      {/* Bands (clipped) */}
      <g clipPath="url(#col-clip)">
        {COLUMN_COMPOUNDS.map(c => {
          const cy = colBandY(c.rf, p);
          if (cy >= CB) return null;
          return (
            <rect key={c.id}
              x={CLI} y={cy - BAND_H / 2}
              width={CIW} height={BAND_H}
              fill={c.color} opacity={0.72} rx={1} />
          );
        })}
      </g>

      {/* Glass walls */}
      <rect x={CL} y={CT} width={CWL} height={CH + 4}
        fill="rgba(147,197,253,0.14)" stroke="rgba(147,197,253,0.3)" strokeWidth={0.7} />
      <rect x={CRI} y={CT} width={CWL} height={CH + 4}
        fill="rgba(147,197,253,0.14)" stroke="rgba(147,197,253,0.3)" strokeWidth={0.7} />

      {/* Solvent reservoir */}
      <rect x={CL + 10} y={48} width={COW - 20} height={30}
        fill="rgba(56,189,248,0.09)" stroke="rgba(56,189,248,0.28)" strokeWidth={0.8} rx={2} />
      <text x={CCX} y={42} textAnchor="middle" fontSize={11} fill="#38bdf8"
        fontWeight="bold" fontFamily="sans-serif">SOLVENT ↓</text>

      {/* Stopcock */}
      <rect x={CCX - 16} y={CB + 1} width={32} height={8}
        fill="#1e293b" stroke="rgba(148,163,184,0.3)" strokeWidth={0.7} rx={2} />
      <rect x={CCX - 4} y={CB + 2} width={8} height={6} rx={1}
        fill={exited && running ? '#fbbf24' : '#0f172a'}
        style={{ transition: 'fill 0.4s' }} />

      {/* Drip */}
      {running && exited && (
        <ellipse cx={CCX} cy={CB + 19} rx={3} ry={4.5}
          fill="#fbbf24" className="chro-drip" />
      )}

      {/* Collection beaker */}
      <path d={`M ${CCX-20} ${CB+28} L ${CCX-26} ${CB+64} L ${CCX+26} ${CB+64} L ${CCX+20} ${CB+28}`}
        fill="rgba(147,197,253,0.03)" stroke="rgba(147,197,253,0.18)" strokeWidth={1} />
      {exited && (
        <path d={`M ${CCX-18} ${CB+50} L ${CCX-24} ${CB+62} L ${CCX+24} ${CB+62} L ${CCX+18} ${CB+50}`}
          fill="#fbbf24" opacity={0.3} />
      )}
      <text x={CCX} y={CB+76} textAnchor="middle" fontSize={10} fill="#475569"
        fontWeight="bold" fontFamily="sans-serif">ELUENT COLLECT</text>

      {/* SILICA GEL rotated label */}
      <text fontSize={8.5} fill="#334155" fontWeight="bold" fontFamily="sans-serif"
        textAnchor="middle"
        transform={`translate(${CL - 13}, ${CT + CH / 2}) rotate(-90)`}>
        SILICA GEL
      </text>

      {/* Compound labels (right side) — spread vertically to avoid overlap */}
      {COLUMN_COMPOUNDS.map((c, i) => {
        const cy = colBandY(c.rf, p);
        if (cy >= CB) return null;
        // At low progress bands cluster at top; use index-based minimum to prevent overlap
        const minY = CT + 8 + i * 28;
        const ly = Math.max(minY, Math.min(CB - 14, cy));
        return (
          <g key={`lbl-${c.id}`}>
            <line x1={CR} y1={ly} x2={CR + 16} y2={ly}
              stroke={c.color} strokeWidth={0.9} strokeDasharray="3,2" opacity={0.7} />
            <text x={CR + 20} y={ly - 4} fontSize={12} fill={c.color}
              fontWeight="bold" fontFamily="sans-serif">{c.name}</text>
            <text x={CR + 20} y={ly + 10} fontSize={11} fill="#94a3b8"
              fontFamily="sans-serif">Rf {c.rf.toFixed(2)} · {c.adsorption} ads.</text>
          </g>
        );
      })}

      {/* Exited label */}
      {exited && (
        <g>
          <text x={CR + 20} y={CB + 44} fontSize={12} fill="#fbbf24"
            fontWeight="bold" fontFamily="sans-serif">β-Carotene ✓</text>
          <text x={CR + 20} y={CB + 58} fontSize={11} fill="#94a3b8"
            fontFamily="sans-serif">First fraction eluted</text>
        </g>
      )}
    </svg>
  );
}

/* ── Paper SVG ─────────────────────────────────────────────────────────── */

function PaperSVG({ p }: { p: number }) {
  const front = papFrontY(p);
  const solventLvl = OY + 8;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cp-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#1e204a" />
          <stop offset="100%" stopColor="#050614" />
        </radialGradient>
        <clipPath id="pap-clip">
          <rect x={PL} y={PT} width={PW} height={PB - PT} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="url(#cp-bg)" />

      {/* Beaker */}
      <path d={`M ${PCX-55} 385 L ${PCX-66} 480 L ${PCX+66} 480 L ${PCX+55} 385`}
        fill="rgba(147,197,253,0.03)" stroke="rgba(147,197,253,0.18)" strokeWidth={1.2} />
      {/* Solvent fill in beaker */}
      <path d={`M ${PCX-53} ${solventLvl} L ${PCX-64} 478 L ${PCX+64} 478 L ${PCX+53} ${solventLvl}`}
        fill="rgba(56,189,248,0.07)" />
      <text x={PCX + 76} y={438} fontSize={10} fill="#38bdf8" fontWeight="bold"
        fontFamily="sans-serif">Solvent</text>
      <text x={PCX + 76} y={451} fontSize={10} fill="#475569" fontFamily="sans-serif">(mobile phase)</text>

      {/* Paper strip */}
      <rect x={PL} y={PT} width={PW} height={PB - PT}
        fill="rgba(226,232,240,0.055)" stroke="rgba(226,232,240,0.14)" strokeWidth={0.8} rx={1} />

      {/* Wetted region */}
      {p > 0.02 && (
        <rect x={PL + 1} y={front} width={PW - 2} height={PB - front}
          fill="rgba(56,189,248,0.06)" clipPath="url(#pap-clip)" />
      )}

      {/* Origin line */}
      <line x1={PL - 4} y1={OY} x2={PR + 4} y2={OY}
        stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} strokeDasharray="4,3" />
      <text x={PR + 8} y={OY + 4} fontSize={10} fill="#64748b" fontFamily="sans-serif">Origin</text>

      {/* Original mixed spot */}
      <circle cx={PCX} cy={OY} r={6.5}
        fill="rgba(148,163,184,0.5)" opacity={Math.max(0, 1 - p * 1.6)} />

      {/* Separated spots */}
      <g clipPath="url(#pap-clip)">
        {PAPER_COMPOUNDS.map(c => (
          <circle key={c.id}
            cx={PCX} cy={papSpotY(c.rf, p)} r={6.5}
            fill={c.color} opacity={Math.min(0.8, p * 2.2)} />
        ))}
      </g>

      {/* Solvent front */}
      {p > 0.03 && (
        <>
          <line x1={PL - 3} y1={front} x2={PR + 3} y2={front}
            stroke="rgba(56,189,248,0.6)" strokeWidth={1.1} />
          <text x={PR + 8} y={front + 4} fontSize={10} fill="#38bdf8"
            fontFamily="sans-serif">Solvent front</text>
        </>
      )}

      {/* Compound labels */}
      {p > 0.38 && PAPER_COMPOUNDS.map(c => {
        const sy = papSpotY(c.rf, p);
        const op = Math.min(1, (p - 0.38) * 3.5);
        return (
          <g key={`lbl-${c.id}`} style={{ opacity: op }}>
            <line x1={PR + 2} y1={sy} x2={PR + 16} y2={sy}
              stroke={c.color} strokeWidth={0.8} strokeDasharray="3,2" opacity={0.7} />
            <text x={PR + 20} y={sy - 4} fontSize={12} fill={c.color}
              fontWeight="bold" fontFamily="sans-serif">{c.name}</text>
            <text x={PR + 20} y={sy + 10} fontSize={11} fill="#94a3b8"
              fontFamily="sans-serif">Rf = {c.rf.toFixed(2)}</text>
          </g>
        );
      })}

    </svg>
  );
}

/* ── Controls row ──────────────────────────────────────────────────────── */

function Controls({
  running, progress, onToggle, onSlider, onReset, label,
}: {
  running: boolean;
  progress: number;
  onToggle: () => void;
  onSlider: (v: number) => void;
  onReset: () => void;
  label: string;
}) {
  const done = progress >= 1;
  return (
    <div className="flex items-center gap-3 flex-wrap pt-1">
      <button onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0"
        style={{
          background: running ? 'rgba(239,68,68,0.13)' : 'rgba(99,102,241,0.18)',
          border: `1px solid ${running ? 'rgba(239,68,68,0.4)' : 'rgba(129,140,248,0.4)'}`,
          color: running ? '#f87171' : '#c4b5fd',
        }}>
        {running ? '⏸ Pause' : done ? `↺ Restart ${label}` : progress > 0 ? '▶ Resume' : `▶ Run ${label}`}
      </button>

      <div className="flex-1 flex items-center gap-2 min-w-[160px]">
        <span className="text-xs font-black uppercase tracking-wider shrink-0"
          style={{ color: '#475569' }}>Progress</span>
        <input type="range" min={0} max={100} value={Math.round(progress * 100)}
          onChange={e => onSlider(Number(e.target.value) / 100)}
          className="flex-1" style={{ accentColor: '#6366f1' }} />
        <span className="text-[11px] font-bold shrink-0" style={{ color: '#818cf8' }}>
          {Math.round(progress * 100)}%
        </span>
      </div>

      <button onClick={onReset}
        className="px-3 py-2 rounded-lg text-sm font-bold transition-all shrink-0"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(129,140,248,0.25)', color: '#a5b4fc' }}>
        ↺ Reset
      </button>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */

export default function ChromatographySim() {
  const [mode, setMode] = useState<Mode>('column');
  const containerRef = useRef<HTMLDivElement>(null);

  const [colP, setColP] = useState(0);
  const [colRunning, setColRunning] = useState(false);
  const colPRef = useRef(0);

  const [papP, setPapP] = useState(0);
  const [papRunning, setPapRunning] = useState(false);
  const papPRef = useRef(0);

  // Column animation — 9-second run-to-completion, gated on `colRunning`.
  // Uses real delta (in seconds) so pauses/tab-hides don't warp the progress
  // curve. Shared hook also pauses automatically when the container is
  // scrolled off-screen.
  useAnimationFrame(
    (delta) => {
      const newP = Math.min(1, colPRef.current + delta / 9);
      colPRef.current = newP;
      setColP(newP);
      if (newP >= 1) setColRunning(false);
    },
    { target: containerRef, enabled: colRunning }
  );

  // Paper animation — 8-second run-to-completion.
  useAnimationFrame(
    (delta) => {
      const newP = Math.min(1, papPRef.current + delta / 8);
      papPRef.current = newP;
      setPapP(newP);
      if (newP >= 1) setPapRunning(false);
    },
    { target: containerRef, enabled: papRunning }
  );

  function toggleCol() {
    if (colRunning) { setColRunning(false); return; }
    if (colP >= 1) { colPRef.current = 0; setColP(0); setTimeout(() => setColRunning(true), 20); return; }
    setColRunning(true);
  }
  function sliderCol(v: number) { setColRunning(false); colPRef.current = v; setColP(v); }
  function resetCol() { setColRunning(false); colPRef.current = 0; setColP(0); }

  function togglePap() {
    if (papRunning) { setPapRunning(false); return; }
    if (papP >= 1) { papPRef.current = 0; setPapP(0); setTimeout(() => setPapRunning(true), 20); return; }
    setPapRunning(true);
  }
  function sliderPap(v: number) { setPapRunning(false); papPRef.current = v; setPapP(v); }
  function resetPap() { setPapRunning(false); papPRef.current = 0; setPapP(0); }

  return (
    <div ref={containerRef} className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16 }}>
      <style>{CSS}</style>

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-black tracking-tight text-white">
          Chromatography <span style={{ color: '#7c3aed' }}>Lab</span>
        </h2>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
          style={{ color: '#475569' }}>Interactive Separation Simulator</p>
      </div>

      {/* Mode tabs */}
      <div className="flex mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {([
          ['column', 'Column Chromatography', 'Adsorption-based'],
          ['paper',  'Paper Chromatography',  'Partition / capillary'],
        ] as const).map(([key, label, sub]) => {
          const active = mode === key;
          return (
            <button key={key} onClick={() => setMode(key)}
              className="px-4 py-3 text-left transition-all"
              style={{
                background: 'none', outline: 'none',
                borderBottom: `2px solid ${active ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
                opacity: active ? 1 : 0.5,
                marginBottom: -1,
              }}>
              <div className="text-sm font-black" style={{ color: active ? '#818cf8' : '#94a3b8' }}>{label}</div>
              <div className="text-xs" style={{ color: '#475569' }}>{sub}</div>
            </button>
          );
        })}
      </div>

      {/* ── Column mode ─────────────────────────────────────────────────── */}
      {mode === 'column' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-5">
            {/* Canvas */}
            <div className="rounded-2xl overflow-hidden"
              style={{
                background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
              <ColumnSVG p={colP} running={colRunning} />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 py-1">
              <h3 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
                What's Happening
              </h3>
              <div className="space-y-4">
                {COLUMN_COMPOUNDS.map(c => (
                  <div key={c.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="text-[11px] font-black uppercase tracking-widest"
                        style={{ color: c.color }}>{c.name}</span>
                    </div>
                    <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>{c.note}</p>
                    <p className="text-[10px] font-bold mt-1" style={{ color: '#475569' }}>
                      Adsorption: {c.adsorption} · Rf ≈ {c.rf.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: '#6366f1' }}>Key Principle</p>
                <p className="text-sm font-bold leading-tight italic text-white">
                  &ldquo;Less adsorbed = moves faster. The compound least attracted to silica elutes first.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <Controls running={colRunning} progress={colP}
            onToggle={toggleCol} onSlider={sliderCol} onReset={resetCol}
            label="Column" />
        </div>
      )}

      {/* ── Paper mode ──────────────────────────────────────────────────── */}
      {mode === 'paper' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-5">
            {/* Canvas */}
            <div className="rounded-2xl overflow-hidden"
              style={{
                background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
              <PaperSVG p={papP} />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 py-1">
              <h3 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
                What's Happening
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: '#6366f1' }}>The Principle</p>
                  <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>
                    Solvent rises by capillary action. Each pigment partitions differently between
                    the water in the paper (stationary) and the moving solvent — giving each a unique Rf.
                  </p>
                </div>
                {PAPER_COMPOUNDS.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider"
                        style={{ color: c.color }}>{c.name}</span>
                      <span className="text-[10px] font-bold ml-2" style={{ color: '#475569' }}>
                        Rf = {c.rf.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg px-3 py-2.5 mt-2"
                  style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(129,140,248,0.14)' }}>
                  <p className="text-xs font-black text-center" style={{ color: '#818cf8' }}>
                    Rf = distance by spot ÷ distance by solvent front
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: '#6366f1' }}>Expert Tip</p>
                <p className="text-sm font-bold leading-tight italic text-white">
                  &ldquo;Rf is constant for a compound under fixed conditions — that&apos;s why it&apos;s used for identification, not just separation.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <Controls running={papRunning} progress={papP}
            onToggle={togglePap} onSlider={sliderPap} onReset={resetPap}
            label="Chromatography" />
        </div>
      )}
    </div>
  );
}
