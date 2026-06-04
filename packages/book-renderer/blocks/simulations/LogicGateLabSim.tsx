'use client';

// LogicGateLabSim.tsx
// Class 9 ICT — Chapter 8 (Fun with Logic).
// Two tabs that reveal HOW computers "think":
//   1. Gate Lab — toggle inputs through AND / OR / NOT / XOR gates, watch the
//      bulb, and read the live truth table. Challenge: make the bulb light.
//   2. Binary Builder — flip bits and watch the decimal value; hit a target.
// Pure logic — no scientific facts to source. Design tokens per
// _agents/workflows/SIMULATION_DESIGN_WORKFLOW.md.

import { useState, useMemo } from 'react';

type Gate = 'AND' | 'OR' | 'NOT' | 'XOR';
const GATES: { id: Gate; label: string; desc: string; unary?: boolean; fn: (a: boolean, b: boolean) => boolean }[] = [
  { id: 'AND', label: 'AND', desc: 'ON only when BOTH inputs are ON', fn: (a, b) => a && b },
  { id: 'OR', label: 'OR', desc: 'ON when AT LEAST ONE input is ON', fn: (a, b) => a || b },
  { id: 'XOR', label: 'XOR', desc: 'ON when inputs are DIFFERENT', fn: (a, b) => a !== b },
  { id: 'NOT', label: 'NOT', desc: 'Flips the input: ON becomes OFF', unary: true, fn: (a) => !a },
];

const ACCENT = '#818cf8';
function Bit({ on, onClick, label }: { on: boolean; onClick?: () => void; label?: string }) {
  return (
    <button onClick={onClick} disabled={!onClick}
      className="flex flex-col items-center gap-1"
      style={{ background: 'none', cursor: onClick ? 'pointer' : 'default' }}>
      <span className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black tabular-nums transition-all"
        style={{
          background: on ? 'rgba(52,211,153,0.18)' : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${on ? '#34d399' : 'rgba(255,255,255,0.12)'}`,
          color: on ? '#34d399' : '#475569',
        }}>{on ? 1 : 0}</span>
      {label && <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>{label}</span>}
    </button>
  );
}

function GateLab() {
  const [gate, setGate] = useState<Gate>('AND');
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const g = GATES.find(x => x.id === gate)!;
  const out = g.unary ? g.fn(a, false) : g.fn(a, b);

  const rows = useMemo(() => {
    const combos = g.unary ? [[false], [true]] : [[false, false], [false, true], [true, false], [true, true]];
    return combos.map(c => ({ inputs: c, out: g.unary ? g.fn(c[0], false) : g.fn(c[0], c[1]) }));
  }, [g]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {GATES.map(x => {
          const active = x.id === gate;
          return (
            <button key={x.id} onClick={() => setGate(x.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
              style={{ background: active ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.08)'}`, color: active ? '#c4b5fd' : '#94a3b8' }}>
              {x.label}
            </button>
          );
        })}
      </div>
      <p className="text-white font-bold text-base leading-snug">{g.label} gate — <span style={{ color: '#fbbf24' }}>{g.desc}</span>.</p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 items-center">
        {/* circuit */}
        <div className="rounded-2xl py-6 flex items-center justify-center gap-4"
          style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)', minHeight: 180 }}>
          <div className="flex flex-col gap-3">
            <Bit on={a} onClick={() => setA(v => !v)} label="A" />
            {!g.unary && <Bit on={b} onClick={() => setB(v => !v)} label="B" />}
          </div>
          <div className="text-2xl" style={{ color: '#475569' }}>→</div>
          <div className="px-4 py-3 rounded-xl text-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(129,140,248,0.4)' }}>
            <span className="text-sm font-black" style={{ color: ACCENT }}>{g.label}</span>
          </div>
          <div className="text-2xl" style={{ color: '#475569' }}>→</div>
          {/* bulb */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl" style={{ filter: out ? 'none' : 'grayscale(1) brightness(0.5)' }}>{out ? '💡' : '🔌'}</span>
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: out ? '#34d399' : '#475569' }}>{out ? 'ON (1)' : 'OFF (0)'}</span>
          </div>
        </div>

        {/* truth table */}
        <div className="rounded-xl p-3" style={{ background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Truth table</p>
          <div className="flex flex-col gap-1">
            {rows.map((row, i) => {
              const isCur = g.unary ? row.inputs[0] === a : (row.inputs[0] === a && row.inputs[1] === b);
              return (
                <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-md tabular-nums text-sm font-bold"
                  style={{ background: isCur ? 'rgba(129,140,248,0.12)' : 'transparent', color: isCur ? '#c4b5fd' : '#94a3b8' }}>
                  <span>{row.inputs.map(x => (x ? 1 : 0)).join(g.unary ? '' : '  ')}</span>
                  <span style={{ color: '#475569' }}>→</span>
                  <span style={{ color: row.out ? '#34d399' : '#f87171' }}>{row.out ? 1 : 0}</span>
                  {isCur && <span className="text-[10px]" style={{ color: ACCENT }}>◂ now</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BinaryBuilder() {
  const PLACES = [128, 64, 32, 16, 8, 4, 2, 1];
  const [bits, setBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const value = bits.reduce((s, b, i) => s + (b ? PLACES[i] : 0), 0);
  const [target, setTarget] = useState(13);
  const win = value === target;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white font-bold text-base leading-snug">
        Computers store everything in <span style={{ color: '#fbbf24' }}>binary</span> — just 0s and 1s. Each switch is worth double the one to its right. Flip the switches to build a number.
      </p>
      <div className="rounded-2xl py-6 px-3 flex flex-wrap items-end justify-center gap-2"
        style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        {PLACES.map((p, i) => (
          <div key={p} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold tabular-nums" style={{ color: '#64748b' }}>{p}</span>
            <Bit on={bits[i]} onClick={() => setBits(bs => bs.map((b, j) => (j === i ? !b : b)))} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)' }}>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>Decimal value</span>
          <span className="text-2xl font-black tabular-nums ml-2" style={{ color: ACCENT }}>{value}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: '#94a3b8' }}>Target:</span>
          <span className="text-xl font-black tabular-nums" style={{ color: '#fbbf24' }}>{target}</span>
          <button onClick={() => { setTarget(Math.floor(((target * 7 + 23) % 254) + 1)); setBits([false, false, false, false, false, false, false, false]); }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>New target ↺</button>
        </div>
        {win && <span className="text-sm font-black" style={{ color: '#34d399' }}>✓ Matched! That&rsquo;s how a number becomes bits.</span>}
      </div>
    </div>
  );
}

export default function LogicGateLabSim() {
  const [tab, setTab] = useState<'gates' | 'binary'>('gates');
  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-3xl font-black tracking-tight text-white">Logic <span style={{ color: ACCENT }}>Gate Lab</span></h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>How Computers Think · Class 9 ICT</p>
      </div>
      <div className="flex gap-2 mb-5">
        {([['gates', 'Logic Gates'], ['binary', 'Binary Builder']] as [typeof tab, string][]).map(([t, label]) => {
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} className="px-3 py-2 transition-all"
              style={{ borderBottom: `2px solid ${active ? ACCENT : 'rgba(255,255,255,0.06)'}`, opacity: active ? 1 : 0.5, background: 'none' }}>
              <span className="text-xs font-black" style={{ color: ACCENT }}>{label}</span>
            </button>
          );
        })}
      </div>
      {tab === 'gates' ? <GateLab /> : <BinaryBuilder />}
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Coder&rsquo;s Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;Every app, game and AI is built on millions of these tiny ON/OFF decisions — logic gates flipping faster than you can blink.&rdquo;</p>
      </div>
    </div>
  );
}
