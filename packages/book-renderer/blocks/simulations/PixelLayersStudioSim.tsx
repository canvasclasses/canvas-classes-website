'use client';

// PixelLayersStudioSim.tsx
// Class 9 ICT — Chapter 3 (Creating Visual Communication).
// The CONCEPTS behind GIMP/Photoshop/Canva, transferable to any editor:
//   1. Pixels & Colour — every screen colour is a mix of Red, Green, Blue; and
//      more pixels (resolution) means a smoother image.
//   2. Layers — stack images with opacity to composite (the reflection trick).
// No external facts to source. Tokens per SIMULATION_DESIGN_WORKFLOW.md.

import { useState } from 'react';

const ACCENT = '#818cf8';

function PixelsColour() {
  const [r, setR] = useState(99);
  const [g, setG] = useState(102);
  const [b, setB] = useState(241);
  const [res, setRes] = useState(10);
  const rgb = `rgb(${r},${g},${b})`;

  const Slider = ({ val, set, color, label }: { val: number; set: (n: number) => void; color: string; label: string }) => (
    <div className="flex items-center gap-3">
      <span className="text-xs font-black w-4" style={{ color }}>{label}</span>
      <input type="range" min={0} max={255} value={val} onChange={e => set(+e.target.value)} className="flex-1" style={{ accentColor: color }} />
      <span className="text-sm font-bold tabular-nums w-9 text-right" style={{ color: '#94a3b8' }}>{val}</span>
    </div>
  );

  // resolution grid: draw a disc on a res×res grid
  const cells = [];
  const cx = (res - 1) / 2, cy = (res - 1) / 2, rad = res * 0.46;
  for (let y = 0; y < res; y++) for (let x = 0; x < res; x++) {
    const inside = Math.hypot(x - cx, y - cy) <= rad;
    cells.push(<rect key={`${x},${y}`} x={x * (200 / res)} y={y * (200 / res)} width={200 / res} height={200 / res} fill={inside ? rgb : '#0a0e1a'} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5">
      <div className="flex flex-col gap-3">
        <p className="text-white font-bold text-base leading-snug">Every colour on a screen is just <span style={{ color: '#f87171' }}>Red</span> + <span style={{ color: '#34d399' }}>Green</span> + <span style={{ color: '#818cf8' }}>Blue</span> mixed in different amounts. Drag the sliders.</p>
        <Slider val={r} set={setR} color="#f87171" label="R" />
        <Slider val={g} set={setG} color="#34d399" label="G" />
        <Slider val={b} set={setB} color="#818cf8" label="B" />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-20 h-20 rounded-xl" style={{ background: rgb, border: '1px solid rgba(255,255,255,0.12)' }} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>This one pixel</p>
            <p className="text-sm font-bold tabular-nums" style={{ color: '#e2e8f0' }}>({r}, {g}, {b})</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-white font-bold text-base leading-snug">Resolution: more pixels = smoother. Watch the circle.</p>
        <div className="rounded-2xl p-3 flex items-center justify-center" style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <svg width={200} height={200} viewBox="0 0 200 200">{cells}</svg>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>Pixels:</span>
          <input type="range" min={4} max={40} value={res} onChange={e => setRes(+e.target.value)} className="flex-1" style={{ accentColor: ACCENT }} />
          <span className="text-sm font-black tabular-nums w-16 text-right" style={{ color: ACCENT }}>{res}×{res}</span>
        </div>
      </div>
    </div>
  );
}

function Layers() {
  const [op, setOp] = useState([100, 80, 100]); // bg, photo, reflection
  const [show, setShow] = useState([true, true, true]);
  const set = (i: number, v: number) => setOp(o => o.map((x, j) => (j === i ? v : x)));
  const tog = (i: number) => setShow(s => s.map((x, j) => (j === i ? !x : x)));
  const LAYER = [
    { name: 'Background', color: '#1e3a5f' },
    { name: 'Photo (a fish)', color: '#fbbf24' },
    { name: 'Reflection', color: '#fbbf24' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5">
      <div className="rounded-2xl p-3 flex items-center justify-center" style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)', minHeight: 220 }}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          {show[0] && <rect x={0} y={0} width={200} height={200} rx={10} fill={LAYER[0].color} opacity={op[0] / 100} />}
          {show[1] && <g opacity={op[1] / 100}><ellipse cx={100} cy={78} rx={42} ry={26} fill={LAYER[1].color} /><polygon points="58,78 38,64 38,92" fill={LAYER[1].color} /></g>}
          {show[2] && <g opacity={op[2] / 100} transform="translate(0,156) scale(1,-1)"><ellipse cx={100} cy={78} rx={42} ry={26} fill={LAYER[2].color} /><polygon points="58,78 38,64 38,92" fill={LAYER[2].color} /></g>}
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-white font-bold text-base leading-snug">Layers stack like transparent sheets. Lower the <span style={{ color: '#fbbf24' }}>reflection&rsquo;s opacity</span> to make a realistic mirror image — the exact GIMP trick.</p>
        {LAYER.map((l, i) => (
          <div key={l.name} className="rounded-lg p-2.5" style={{ background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{l.name}</span>
              <button onClick={() => tog(i)} className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: show[i] ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)', color: show[i] ? '#34d399' : '#64748b' }}>{show[i] ? '👁 shown' : 'hidden'}</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold" style={{ color: '#64748b' }}>Opacity</span>
              <input type="range" min={0} max={100} value={op[i]} onChange={e => set(i, +e.target.value)} className="flex-1" style={{ accentColor: ACCENT }} disabled={!show[i]} />
              <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color: '#94a3b8' }}>{op[i]}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PixelLayersStudioSim() {
  const [tab, setTab] = useState<'pixels' | 'layers'>('pixels');
  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-3xl font-black tracking-tight text-white">Pixel &amp; <span style={{ color: ACCENT }}>Layers Studio</span></h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>How Digital Images Work · Class 9 ICT</p>
      </div>
      <div className="flex gap-2 mb-5">
        {([['pixels', 'Pixels & Colour'], ['layers', 'Layers']] as [typeof tab, string][]).map(([t, label]) => {
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} className="px-3 py-2 transition-all" style={{ borderBottom: `2px solid ${active ? ACCENT : 'rgba(255,255,255,0.06)'}`, opacity: active ? 1 : 0.5, background: 'none' }}>
              <span className="text-xs font-black" style={{ color: ACCENT }}>{label}</span>
            </button>
          );
        })}
      </div>
      {tab === 'pixels' ? <PixelsColour /> : <Layers />}
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Designer&rsquo;s Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;Menus change between apps, but the ideas don&rsquo;t: an image is a grid of RGB pixels, and layers let you edit one thing without wrecking the rest.&rdquo;</p>
      </div>
    </div>
  );
}
