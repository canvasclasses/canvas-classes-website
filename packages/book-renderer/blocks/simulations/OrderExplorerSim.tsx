'use client';

// OrderExplorerSim.tsx
// Class 12 Chemistry — Chemical Kinetics — Integrated rate laws (zero / first / second order).
// Centerpiece: the "shortcut staircase". Step through equal time intervals and SEE what is
// constant for each order:
//   • Zero order   → equal AMOUNT removed each interval  → reaches zero (completes).
//   • First order  → equal PERCENTAGE removed each interval → halves forever (never completes).
//   • Second order → equal step in 1/[A]                  → each half-life is twice the last.
// Slider/step-driven (no continuous animation), so it is robust in any tab state.

import { useState, useMemo } from 'react';

type Order = 0 | 1 | 2;

const ACCENT: Record<Order, string> = { 0: '#fbbf24', 1: '#818cf8', 2: '#f472b6' };
const ACCENT_BG: Record<Order, string> = {
  0: 'rgba(251,191,36,0.15)', 1: 'rgba(129,140,248,0.15)', 2: 'rgba(244,114,182,0.15)',
};
const TABS: { order: Order; label: string; sub: string }[] = [
  { order: 0, label: 'Zero order', sub: 'equal amount' },
  { order: 1, label: 'First order', sub: 'equal %' },
  { order: 2, label: 'Second order', sub: '1/[A] steps' },
];

const C0 = 100;            // start at 100% for readability
const MAX_INTERVAL = 8;    // intervals shown on the x-axis

export default function OrderExplorerSim() {
  const [order, setOrder] = useState<Order>(0);
  const [revealed, setRevealed] = useState(1); // how many intervals stepped through
  // per-order tunable: zero → amount removed per interval (% of start);
  // first → percentage removed per interval; second → step added to 1/[A] (×10^-3).
  const [zeroDrop, setZeroDrop] = useState(20);
  const [firstPct, setFirstPct] = useState(50);
  const [secStep, setSecStep] = useState(10); // ×10^-3 per interval on 1/[A]

  // concentration after n equal time intervals
  const conc = useMemo(() => (n: number): number => {
    if (order === 0) return Math.max(0, C0 - zeroDrop * n);
    if (order === 1) return C0 * Math.pow(1 - firstPct / 100, n);
    // second order: 1/C = 1/C0 + s·n  (s in 1/%, here secStep×10^-3)
    return 1 / (1 / C0 + (secStep / 1000) * n);
  }, [order, zeroDrop, firstPct, secStep]);

  // smooth curve sampled over continuous interval-time τ
  const curve = useMemo(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= MAX_INTERVAL * 20; i++) {
      const tau = i / 20;
      pts.push([tau, conc(tau)]);
    }
    return pts;
  }, [conc]);

  // completion fact
  const completes = order === 0;
  const completeAt = order === 0 ? Math.ceil(C0 / zeroDrop) : null;

  // step values revealed so far
  const steps = useMemo(
    () => Array.from({ length: revealed + 1 }, (_, n) => ({ n, c: conc(n) })),
    [revealed, conc],
  );

  // ── plot geometry ─────────────────────────────────────────────
  const W = 560, H = 300, PAD_L = 44, PAD_B = 34, PAD_T = 16, PAD_R = 16;
  const px = (tau: number) => PAD_L + (tau / MAX_INTERVAL) * (W - PAD_L - PAD_R);
  const py = (c: number) => PAD_T + (1 - c / C0) * (H - PAD_T - PAD_B);
  const curvePath = curve.map(([t, c], i) => `${i === 0 ? 'M' : 'L'}${px(t).toFixed(1)},${py(c).toFixed(1)}`).join(' ');

  const accent = ACCENT[order];

  const ruleLine =
    order === 0
      ? `Each interval removes the SAME AMOUNT — ${zeroDrop}% of the start. After ${completeAt} intervals the reactant is gone.`
      : order === 1
        ? `Each interval removes the SAME PERCENTAGE — ${firstPct}% of whatever is left. It keeps halving toward zero but never reaches it.`
        : `Each interval adds the same step to 1/[A]. So the concentration falls ever more slowly — each successive half-life is longer than the one before.`;

  const dropDesc = (a: number, b: number) => {
    const amt = (a - b).toFixed(1);
    const pct = a > 0 ? (((a - b) / a) * 100).toFixed(1) : '0';
    return order === 0
      ? `−${amt} (a fixed amount)`
      : order === 1
        ? `−${pct}% (a fixed fraction)`
        : `−${amt}`;
  };

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* header */}
      <div className="mb-3">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Order <span style={{ color: '#7c3aed' }}>Explorer</span>
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
          What stays constant as a reaction runs?
        </p>
      </div>

      {/* order tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => {
          const active = t.order === order;
          return (
            <button key={t.order} onClick={() => { setOrder(t.order); setRevealed(1); }}
              className="px-3 py-2 rounded-lg text-left transition-all"
              style={{
                background: active ? ACCENT_BG[t.order] : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? ACCENT[t.order] : 'rgba(255,255,255,0.07)'}`,
                outline: 'none',
              }}>
              <div className="text-sm font-black" style={{ color: active ? ACCENT[t.order] : '#94a3b8' }}>{t.label}</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#475569' }}>{t.sub}</div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* plot */}
        <div className="lg:col-span-3">
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)' }}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              {/* gridlines at 25/50/75/100% */}
              {[0, 25, 50, 75, 100].map((c) => (
                <g key={c}>
                  <line x1={PAD_L} y1={py(c)} x2={W - PAD_R} y2={py(c)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                  <text x={PAD_L - 6} y={py(c) + 3} fill="#64748b" fontSize={9} textAnchor="end" style={{ fontVariantNumeric: 'tabular-nums' }}>{c}</text>
                </g>
              ))}
              {/* axes */}
              <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              {/* smooth curve */}
              <path d={curvePath} fill="none" stroke={accent} strokeWidth={2} opacity={0.45} />
              {/* staircase of revealed intervals */}
              {steps.map((s, i) => {
                if (i === 0) return null;
                const prev = steps[i - 1];
                return (
                  <g key={s.n}>
                    {/* horizontal at previous level */}
                    <line x1={px(prev.n)} y1={py(prev.c)} x2={px(s.n)} y2={py(prev.c)} stroke={accent} strokeWidth={2} />
                    {/* vertical drop */}
                    <line x1={px(s.n)} y1={py(prev.c)} x2={px(s.n)} y2={py(s.c)} stroke={accent} strokeWidth={2} strokeDasharray="4 3" />
                    {/* drop label */}
                    <text x={px(s.n) + 4} y={(py(prev.c) + py(s.c)) / 2} fill="#e2e8f0" fontSize={9} fontWeight={700} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {dropDesc(prev.c, s.c)}
                    </text>
                  </g>
                );
              })}
              {/* dots + value labels at revealed steps */}
              {steps.map((s) => (
                <g key={`d${s.n}`}>
                  <circle cx={px(s.n)} cy={py(s.c)} r={4} fill={accent} />
                  <text x={px(s.n)} y={py(s.c) - 8} fill={accent} fontSize={10} fontWeight={800} textAnchor="middle" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {s.c.toFixed(1)}
                  </text>
                  <text x={px(s.n)} y={H - PAD_B + 14} fill="#64748b" fontSize={9} textAnchor="middle">{s.n}</text>
                </g>
              ))}
              {/* axis titles */}
              <text x={(W) / 2} y={H - 4} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle">interval number (each interval = equal time)</text>
              <text x={12} y={H / 2} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle" transform={`rotate(-90 12 ${H / 2})`}>concentration (% of start)</text>
            </svg>
          </div>

          {/* stepper */}
          <div className="flex items-center gap-3 mt-3">
            <button onClick={() => setRevealed((r) => Math.min(MAX_INTERVAL, r + 1))}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: ACCENT_BG[order], border: `1px solid ${accent}`, color: accent, outline: 'none' }}>
              Step one interval →
            </button>
            <button onClick={() => setRevealed(1)}
              className="px-3 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', outline: 'none' }}>
              ↺ Reset
            </button>
            <span className="text-[11px]" style={{ color: '#475569' }}>{revealed} interval{revealed > 1 ? 's' : ''} shown</span>
          </div>
        </div>

        {/* sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* the rule */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: accent }}>The shortcut</p>
            <p className="text-white font-bold text-base leading-snug">{ruleLine}</p>
          </div>

          {/* tunable */}
          {order === 0 && (
            <Slider label={`Amount removed per interval: ${zeroDrop}% of start`} min={10} max={50} step={5} value={zeroDrop} onChange={setZeroDrop} accent={accent} />
          )}
          {order === 1 && (
            <Slider label={`Percentage removed per interval: ${firstPct}%`} min={10} max={50} step={5} value={firstPct} onChange={setFirstPct} accent={accent} />
          )}
          {order === 2 && (
            <Slider label={`Step added to 1/[A] per interval`} min={4} max={20} step={2} value={secStep} onChange={setSecStep} accent={accent} />
          )}

          {/* completion verdict */}
          <div style={{ borderRadius: 10, padding: '12px 14px', background: completes ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)', border: `1px solid ${completes ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.3)'}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: completes ? '#34d399' : '#f87171' }}>
              {completes ? 'This reaction completes' : 'This reaction never completes'}
            </p>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>
              {order === 0 && <>The straight line hits zero after <b style={{ color: '#fbbf24' }}>{completeAt} intervals</b>. Half-life is half of that — <b>{(completeAt! / 2).toFixed(1)} intervals</b>.</>}
              {order === 1 && <>The curve halves every interval (<b style={{ color: '#818cf8' }}>{firstPct === 50 ? 'one half-life per interval' : `${firstPct}% each time`}</b>) and only ever approaches zero. Its half-life is the same every time.</>}
              {order === 2 && <>It keeps halving, but each half-life is <b style={{ color: '#f472b6' }}>longer</b> than the one before — a more concentrated start clears faster, a dilute tail lingers.</>}
            </p>
          </div>

          {/* the contrast tip */}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Why it matters</p>
            <p className="text-white text-sm font-bold leading-tight italic">
              &ldquo;Zero order strips off a fixed <span style={{ color: '#fbbf24' }}>quantity</span>, so it finishes. First order strips off a fixed <span style={{ color: '#818cf8' }}>fraction</span>, so it never quite does.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange, accent }: {
  label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; accent: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold block mb-1" style={{ color: '#94a3b8' }}>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: accent }} />
    </div>
  );
}
