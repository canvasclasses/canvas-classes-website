'use client';

// DebugItSim.tsx
// Class 9 ICT — Chapter 8 (Fun with Logic).
// "Debugging" as sequence logic: each task's steps are scrambled (and sometimes
// a wrong step is mixed in). The student reorders — and drops any wrong step —
// to make the algorithm correct, then checks. Echoes the chapter's Jason story
// (a skipped/misordered step breaks the whole task). Pure logic, no sourcing.

import { useState } from 'react';

interface Puzzle {
  task: string;
  steps: string[];      // correct order
  scrambled: number[];  // initial display order (indices into steps)
  trap?: string;        // a wrong step to be removed (optional)
  why: string;
}

const PUZZLES: Puzzle[] = [
  {
    task: 'Open a bank account',
    steps: ['Take the account opening form', 'Fill in your details carefully', 'Sign at the marked place', 'Attach a photo ID copy', 'Submit the form with the deposit'],
    scrambled: [0, 2, 1, 4, 3],
    why: 'Jason skipped the signature and his account was rejected. Every step, in order, matters.',
  },
  {
    task: 'Send an email with an attachment',
    steps: ['Log in to your email', 'Click Compose', 'Type the receiver in the To box', 'Attach the file', 'Click Send'],
    scrambled: [1, 0, 3, 2, 4],
    trap: 'Delete your account',
    why: 'You must log in before you can compose — and one wrong step (deleting the account!) ruins everything.',
  },
  {
    task: 'Make the Scratch cat trace an L-shape',
    steps: ['Move 4 steps forward', 'Turn right 90°', 'Move 3 steps forward', 'Stop'],
    scrambled: [1, 0, 3, 2],
    why: 'Turn before moving and the cat heads the wrong way. Order changes the whole path.',
  },
];

const ACCENT = '#818cf8';

function PuzzleView({ p, onSolved }: { p: Puzzle; onSolved: () => void }) {
  // build initial item list: scrambled real steps + optional trap at a fixed spot
  const initial = () => {
    const items = p.scrambled.map(i => ({ key: `s${i}`, text: p.steps[i], real: i }));
    if (p.trap) items.splice(2, 0, { key: 'trap', text: p.trap, real: -1 });
    return items;
  };
  const [items, setItems] = useState(initial);
  const [status, setStatus] = useState<'idle' | 'ok' | 'no'>('idle');

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next); setStatus('idle');
  };
  const drop = (idx: number) => { setItems(items.filter((_, i) => i !== idx)); setStatus('idle'); };

  const check = () => {
    const reals = items.map(it => it.real);
    const correct = reals.length === p.steps.length && reals.every((r, i) => r === i);
    if (correct) { setStatus('ok'); onSolved(); } else setStatus('no');
  };
  const reset = () => { setItems(initial()); setStatus('idle'); };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-white font-bold text-lg leading-snug">Goal: <span style={{ color: '#fbbf24' }}>{p.task}</span></p>
      <p className="text-base leading-snug" style={{ color: '#94a3b8' }}>
        Put the steps in the right order with the arrows{p.trap ? ', and remove any step that does not belong (tap ✕)' : ''}. Then check.
      </p>
      <div className="flex flex-col gap-2">
        {items.map((it, idx) => {
          const isTrap = it.real === -1;
          return (
            <div key={it.key} className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: isTrap ? 'rgba(248,113,113,0.08)' : 'rgba(99,102,241,0.08)', border: `1px solid ${isTrap ? 'rgba(248,113,113,0.3)' : 'rgba(129,140,248,0.25)'}` }}>
              <span className="text-xs font-black tabular-nums w-5 text-center" style={{ color: '#64748b' }}>{idx + 1}</span>
              <span className="text-sm font-semibold flex-1" style={{ color: isTrap ? '#f87171' : '#e2e8f0' }}>{it.text}</span>
              <button onClick={() => move(idx, -1)} className="w-9 h-9 rounded-lg text-sm font-black flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.06)', color: '#a5b4fc' }}>▲</button>
              <button onClick={() => move(idx, 1)} className="w-9 h-9 rounded-lg text-sm font-black flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.06)', color: '#a5b4fc' }}>▼</button>
              <button onClick={() => drop(idx)} className="w-9 h-9 rounded-lg text-sm font-black flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>✕</button>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={check} className="px-5 py-2 rounded-lg text-sm font-bold"
          style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff' }}>Check the sequence</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>↺ Reset</button>
        {status === 'ok' && <span className="text-sm font-black" style={{ color: '#34d399' }}>✓ Debugged! {p.why}</span>}
        {status === 'no' && <span className="text-sm font-bold" style={{ color: '#f87171' }}>Not yet — a step is out of place{p.trap ? ' or one does not belong' : ''}.</span>}
      </div>
    </div>
  );
}

export default function DebugItSim() {
  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState<boolean[]>(PUZZLES.map(() => false));
  const markSolved = () => setSolved(s => s.map((v, i) => (i === idx ? true : v)));

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-3xl font-black tracking-tight text-white">Debug <span style={{ color: ACCENT }}>It!</span></h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Fix the Broken Sequence · Class 9 ICT</p>
      </div>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {PUZZLES.map((p, i) => {
          const active = i === idx;
          return (
            <button key={p.task} onClick={() => setIdx(i)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{ background: active ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.07)'}`, color: active ? '#c4b5fd' : 'rgba(255,255,255,0.35)' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: solved[i] ? '#059669' : active ? '#6366f1' : 'rgba(255,255,255,0.06)', color: 'white' }}>{solved[i] ? '✓' : i + 1}</span>
              Task {i + 1}
            </button>
          );
        })}
      </div>
      <PuzzleView key={idx} p={PUZZLES[idx]} onSolved={markSolved} />
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Coder&rsquo;s Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;Most of coding isn&rsquo;t writing new steps — it&rsquo;s finding the one step that&rsquo;s missing, extra, or in the wrong place. That&rsquo;s debugging.&rdquo;</p>
      </div>
    </div>
  );
}
