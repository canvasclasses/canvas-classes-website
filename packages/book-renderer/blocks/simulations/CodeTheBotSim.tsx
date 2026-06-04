'use client';

// CodeTheBotSim.tsx
// Class 9 ICT — Chapter 8 (Fun with Logic) — flagship computational-thinking lab.
// A block-coding maze: the student assembles a program from command blocks to
// drive a bot to the goal. Levels ladder up the core CS concepts:
//   sequence → loops (repeat) → conditionals (if path ahead) → functions (define F).
//
// UX (v2): the maze + controls stay pinned (sticky) while you scroll the blocks,
// the currently-executing block is highlighted during playback, and a Step
// button + speed toggle let students walk through their program one move at a
// time. No facts to source — a pure logic playground. Tokens per
// _agents/workflows/SIMULATION_DESIGN_WORKFLOW.md.

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

// ── Program model ──────────────────────────────────────────────────────────
type Cmd =
  | { id: string; k: 'move' }
  | { id: string; k: 'left' }
  | { id: string; k: 'right' }
  | { id: string; k: 'call' }
  | { id: string; k: 'repeat'; n: number; body: Cmd[] }
  | { id: string; k: 'if'; body: Cmd[] };

let _seq = 0;
const nid = () => `c${_seq++}`;

// ── Maze model ─────────────────────────────────────────────────────────────
interface Level {
  name: string;
  concept: string;
  teaches: string;
  grid: string[];
  dir: 0 | 1 | 2 | 3; // 0=N 1=E 2=S 3=W
  allow: Array<Cmd['k']>;
  hint: string;
}

const LEVELS: Level[] = [
  {
    name: 'Straight Shot', concept: 'SEQUENCE', teaches: 'Instructions run top to bottom, in order.',
    grid: ['......', 'S....G', '......'], dir: 1,
    allow: ['move', 'left', 'right'],
    hint: 'The goal is straight ahead. Stack five Move blocks.',
  },
  {
    name: 'Turn the Corner', concept: 'SEQUENCE + TURN', teaches: 'Order matters — a wrong turn means a wrong path.',
    grid: ['....G', '....#', 'S....', '.....'], dir: 1,
    allow: ['move', 'left', 'right'],
    hint: 'Move across, then Turn Left and climb up to the flag.',
  },
  {
    name: 'The Long Hall', concept: 'LOOP', teaches: 'A Repeat block runs the same steps many times — no copy-paste.',
    grid: ['S..........G'], dir: 1,
    allow: ['move', 'left', 'right', 'repeat'],
    hint: 'Instead of ten Move blocks, use Repeat 10 with one Move inside.',
  },
  {
    name: 'The Staircase', concept: 'LOOP WITH A BODY', teaches: 'A loop body can hold several steps that repeat as a pattern.',
    grid: ['.....G', '....#.', '...##.', '..##..', '.##...', 'S#....'], dir: 0,
    allow: ['move', 'left', 'right', 'repeat'],
    hint: 'The path repeats: Move up, turn right, move, turn left. Wrap that pattern in a Repeat.',
  },
  {
    name: 'Mind the Gap', concept: 'CONDITIONAL', teaches: 'An If block acts only when a condition is true.',
    grid: ['S....G', '.####.'], dir: 1,
    allow: ['move', 'left', 'right', 'repeat', 'if'],
    hint: 'Use Repeat with an If "path ahead is clear" so the bot only moves when it safely can.',
  },
  {
    name: 'Define a Move', concept: 'FUNCTION', teaches: 'A function names a group of steps so you can reuse them.',
    grid: ['....G', '...#.', 'S..#.', '.#.#.', '.#...'], dir: 0,
    allow: ['move', 'left', 'right', 'repeat', 'if', 'call'],
    hint: 'Teach the bot one zig-zag in function F, then Call F again and again.',
  },
];

interface Pos { r: number; c: number; }
function parseLevel(grid: string[]) {
  let start: Pos = { r: 0, c: 0 }, goal: Pos = { r: 0, c: 0 };
  const gems: string[] = [];
  const walls = new Set<string>();
  grid.forEach((row, r) => {
    row.split('').forEach((ch, c) => {
      if (ch === '#') walls.add(`${r},${c}`);
      else if (ch === 'S') start = { r, c };
      else if (ch === 'G') goal = { r, c };
      else if (ch === '*') gems.push(`${r},${c}`);
    });
  });
  return { start, goal, gems, walls, rows: grid.length, cols: grid[0].length };
}

const DR = [-1, 0, 1, 0]; // N E S W
const DC = [0, 1, 0, -1];

// ── Interpreter ────────────────────────────────────────────────────────────
interface Frame { r: number; c: number; dir: number; gems: Set<string>; crash?: string; activeId?: string; }

function runProgram(main: Cmd[], func: Cmd[], lvl: ReturnType<typeof parseLevel>, dir0: number): Frame[] {
  const frames: Frame[] = [];
  const collected = new Set<string>();
  let st = { r: lvl.start.r, c: lvl.start.c, dir: dir0 };
  let steps = 0;
  const MAX = 600;
  let crashed: string | undefined;

  frames.push({ ...st, gems: new Set(collected) });

  const ahead = () => {
    const nr = st.r + DR[st.dir], nc = st.c + DC[st.dir];
    if (nr < 0 || nc < 0 || nr >= lvl.rows || nc >= lvl.cols) return false;
    if (lvl.walls.has(`${nr},${nc}`)) return false;
    return true;
  };

  const exec = (cmds: Cmd[], depth: number) => {
    if (crashed || depth > 30) return;
    for (const cmd of cmds) {
      if (crashed) return;
      if (steps++ > MAX) { crashed = 'Too many steps — is there an endless loop?'; return; }
      if (cmd.k === 'move') {
        if (!ahead()) { crashed = 'Crash! The bot drove into a wall.'; frames.push({ ...st, gems: new Set(collected), crash: crashed, activeId: cmd.id }); return; }
        st = { ...st, r: st.r + DR[st.dir], c: st.c + DC[st.dir] };
        if (lvl.gems.includes(`${st.r},${st.c}`)) collected.add(`${st.r},${st.c}`);
        frames.push({ ...st, gems: new Set(collected), activeId: cmd.id });
      } else if (cmd.k === 'left') {
        st = { ...st, dir: (st.dir + 3) % 4 };
        frames.push({ ...st, gems: new Set(collected), activeId: cmd.id });
      } else if (cmd.k === 'right') {
        st = { ...st, dir: (st.dir + 1) % 4 };
        frames.push({ ...st, gems: new Set(collected), activeId: cmd.id });
      } else if (cmd.k === 'repeat') {
        for (let i = 0; i < cmd.n; i++) { if (crashed) return; exec(cmd.body, depth + 1); }
      } else if (cmd.k === 'if') {
        if (ahead()) exec(cmd.body, depth + 1);
      } else if (cmd.k === 'call') {
        exec(func, depth + 1);
      }
    }
  };

  exec(main, 0);
  return frames;
}

// ── Tree helpers ───────────────────────────────────────────────────────────
function addTo(list: Cmd[], targetId: string | 'ROOT' | 'FUNC', cmd: Cmd, rootKey: 'main' | 'func'): Cmd[] {
  if ((targetId === 'ROOT' && rootKey === 'main') || (targetId === 'FUNC' && rootKey === 'func')) {
    return [...list, cmd];
  }
  return list.map(c => {
    if ((c.k === 'repeat' || c.k === 'if')) {
      if (c.id === targetId) return { ...c, body: [...c.body, cmd] };
      return { ...c, body: addTo(c.body, targetId, cmd, rootKey) } as Cmd;
    }
    return c;
  });
}
function removeFrom(list: Cmd[], id: string): Cmd[] {
  return list.filter(c => c.id !== id).map(c =>
    (c.k === 'repeat' || c.k === 'if') ? ({ ...c, body: removeFrom(c.body, id) } as Cmd) : c
  );
}
function setRepeatN(list: Cmd[], id: string, n: number): Cmd[] {
  return list.map(c => {
    if (c.id === id && c.k === 'repeat') return { ...c, n };
    if (c.k === 'repeat' || c.k === 'if') return { ...c, body: setRepeatN(c.body, id, n) } as Cmd;
    return c;
  });
}
function countCmds(list: Cmd[]): number {
  return list.reduce((s, c) => s + 1 + ((c.k === 'repeat' || c.k === 'if') ? countCmds(c.body) : 0), 0);
}

const ACCENT = '#818cf8';
const CMD_META: Record<string, { label: string; color: string }> = {
  move: { label: 'Move', color: '#6366f1' },
  left: { label: 'Turn Left', color: '#818cf8' },
  right: { label: 'Turn Right', color: '#818cf8' },
  repeat: { label: 'Repeat', color: '#fbbf24' },
  if: { label: 'If path ahead clear', color: '#34d399' },
  call: { label: 'Call F', color: '#f472b6' },
};

export default function CodeTheBotSim() {
  const [lvlIdx, setLvlIdx] = useState(0);
  const level = LEVELS[lvlIdx];
  const lvl = useMemo(() => parseLevel(level.grid), [level.grid]);
  const hasFunc = level.allow.includes('call');

  const [main, setMain] = useState<Cmd[]>([]);
  const [func, setFunc] = useState<Cmd[]>([]);
  const [target, setTarget] = useState<string | 'ROOT' | 'FUNC'>('ROOT');

  // Frames are derived from the program — recompute whenever it (or level) changes.
  const frames = useMemo(() => runProgram(main, func, lvl, level.dir), [main, func, lvl, level.dir]);
  const [fi, setFi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<'none' | 'win' | 'fail'>('none');
  const [slow, setSlow] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  useEffect(() => stopTimer, []);

  const computeResult = useCallback((f: Frame): 'win' | 'fail' => {
    const reached = f.r === lvl.goal.r && f.c === lvl.goal.c;
    const allGems = lvl.gems.every(g => f.gems.has(g));
    return !f.crash && reached && allGems ? 'win' : 'fail';
  }, [lvl]);

  // Whenever the program or level changes, rewind to the start.
  useEffect(() => { stopTimer(); setPlaying(false); setFi(0); setResult('none'); }, [frames]);

  const switchLevel = (i: number) => {
    stopTimer(); setPlaying(false); setMain([]); setFunc([]); setTarget('ROOT'); setLvlIdx(i);
  };

  const add = (k: Cmd['k']) => {
    let cmd: Cmd;
    if (k === 'repeat') cmd = { id: nid(), k: 'repeat', n: 3, body: [] };
    else if (k === 'if') cmd = { id: nid(), k: 'if', body: [] };
    else cmd = { id: nid(), k } as Cmd;
    const intoFunc = target === 'FUNC' || (target !== 'ROOT' && isInFunc(func, target));
    if (intoFunc) setFunc(f => addTo(f, target, cmd, 'func'));
    else setMain(m => addTo(m, target, cmd, 'main'));
  };
  const remove = (id: string) => { setMain(m => removeFrom(m, id)); setFunc(f => removeFrom(f, id)); };
  const changeN = (id: string, d: number) => {
    setMain(m => setRepeatN(m, id, clampN(findN(m, id) + d)));
    setFunc(f => setRepeatN(f, id, clampN(findN(f, id) + d)));
  };

  const run = () => {
    stopTimer();
    setFi(0); setResult('none'); setPlaying(true);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      if (i >= frames.length) {
        stopTimer(); setPlaying(false);
        setResult(computeResult(frames[frames.length - 1]));
        setFi(frames.length - 1);
        return;
      }
      setFi(i);
    }, slow ? 720 : 380);
  };

  const step = () => {
    stopTimer(); setPlaying(false);
    setFi(i => {
      const n = Math.min(i + 1, frames.length - 1);
      if (n === frames.length - 1 && frames.length > 1) setResult(computeResult(frames[n]));
      else setResult('none');
      return n;
    });
  };

  const reset = () => { stopTimer(); setPlaying(false); setFi(0); setResult('none'); };

  const cur = frames[fi] ?? { r: lvl.start.r, c: lvl.start.c, dir: level.dir, gems: new Set<string>() };
  const activeId = (playing || fi > 0) ? cur.activeId : undefined;
  const totalCmds = countCmds(main) + countCmds(func);
  const atEnd = fi >= frames.length - 1;

  // ── grid rendering ──
  const CELL = Math.min(48, Math.floor(320 / Math.max(lvl.rows, lvl.cols)));
  const W = lvl.cols * CELL, H = lvl.rows * CELL;

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Code the <span style={{ color: ACCENT }}>Bot</span></h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Computational Thinking Lab · Class 9 ICT
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          {totalCmds} block{totalCmds === 1 ? '' : 's'} used
        </div>
      </div>

      {/* Level pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {LEVELS.map((l, i) => {
          const active = i === lvlIdx;
          return (
            <button key={l.name} onClick={() => switchLevel(i)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: active ? '#6366f1' : 'rgba(255,255,255,0.06)', color: 'white' }}>{i + 1}</span>
              {l.name}
            </button>
          );
        })}
      </div>

      {/* Concept banner */}
      <div className="mb-3">
        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: ACCENT }}>{level.concept}</p>
        <p className="text-white font-bold text-lg leading-snug">{level.teaches}</p>
      </div>

      {/* ── Sticky stage: maze + controls stay visible while editing blocks ── */}
      <div style={{ position: 'sticky', top: 4, zIndex: 5, background: '#0d1117', paddingTop: 6, paddingBottom: 8 }}>
        <div className="relative overflow-hidden flex items-center justify-center rounded-3xl py-3"
          style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)', minHeight: 180 }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            {Array.from({ length: lvl.rows }).map((_, r) =>
              Array.from({ length: lvl.cols }).map((__, c) => {
                const wall = lvl.walls.has(`${r},${c}`);
                return (
                  <rect key={`${r},${c}`} x={c * CELL + 1} y={r * CELL + 1} width={CELL - 2} height={CELL - 2} rx={5}
                    fill={wall ? '#0a0e1a' : 'rgba(129,140,248,0.06)'}
                    stroke={wall ? 'rgba(255,255,255,0.04)' : 'rgba(129,140,248,0.14)'} strokeWidth={1} />
                );
              })
            )}
            {/* goal */}
            <g transform={`translate(${lvl.goal.c * CELL + CELL / 2}, ${lvl.goal.r * CELL + CELL / 2})`}>
              <circle r={CELL * 0.34} fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth={2} />
              <text textAnchor="middle" dy={CELL * 0.13} fontSize={CELL * 0.4}>🏁</text>
            </g>
            {/* gems */}
            {lvl.gems.map(g => {
              const [r, c] = g.split(',').map(Number);
              const got = cur.gems.has(g);
              return <text key={g} x={c * CELL + CELL / 2} y={r * CELL + CELL * 0.66} textAnchor="middle" fontSize={CELL * 0.42} opacity={got ? 0.18 : 1}>💎</text>;
            })}
            {/* bot */}
            <g transform={`translate(${cur.c * CELL + CELL / 2}, ${cur.r * CELL + CELL / 2}) rotate(${cur.dir * 90})`}
              style={{ transition: 'transform 0.3s ease' }}>
              <circle r={CELL * 0.34} fill={cur.crash ? 'rgba(248,113,113,0.25)' : 'rgba(99,102,241,0.35)'} stroke={cur.crash ? '#f87171' : '#818cf8'} strokeWidth={2.5} />
              {/* two eyes + a forward chevron so it reads as a bot, not a play button */}
              <circle cx={-CELL * 0.1} cy={-CELL * 0.04} r={CELL * 0.05} fill="#0d1117" />
              <circle cx={CELL * 0.1} cy={-CELL * 0.04} r={CELL * 0.05} fill="#0d1117" />
              <path d={`M ${-CELL * 0.13} ${CELL * 0.16} L 0 ${CELL * 0.08} L ${CELL * 0.13} ${CELL * 0.16}`} fill="none" stroke={cur.crash ? '#f87171' : '#c4b5fd'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path d={`M 0 ${-CELL * 0.32} L ${CELL * 0.12} ${-CELL * 0.18} L ${-CELL * 0.12} ${-CELL * 0.18} Z`} fill={cur.crash ? '#f87171' : '#c4b5fd'} />
            </g>
          </svg>
        </div>

        {/* Run controls */}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <button onClick={run} disabled={playing || totalCmds === 0}
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: totalCmds === 0 ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#6366f1,#818cf8)', color: totalCmds === 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: playing || totalCmds === 0 ? 'default' : 'pointer' }}>
            {playing ? 'Running…' : '▶ Run'}
          </button>
          <button onClick={step} disabled={playing || totalCmds === 0 || atEnd}
            className="px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)', color: (playing || totalCmds === 0 || atEnd) ? '#475569' : '#c4b5fd' }}>
            Step ▸
          </button>
          <button onClick={reset}
            className="px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>↺ Reset</button>
          <button onClick={() => setSlow(s => !s)}
            className="px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: slow ? '#fbbf24' : '#94a3b8' }}>
            {slow ? '🐢 Slow' : '⚡ Fast'}
          </button>
          {result === 'win' && <span className="text-sm font-black" style={{ color: '#34d399' }}>✓ Solved! Try the next level.</span>}
          {result === 'fail' && <span className="text-sm font-bold" style={{ color: '#f87171' }}>{cur.crash ?? 'Not at the flag yet — tweak your blocks.'}</span>}
        </div>
      </div>

      <p className="text-base leading-snug mt-2 mb-4" style={{ color: '#94a3b8' }}>💡 {level.hint}</p>

      {/* ── Program editor (scrolls under the pinned maze) ── */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Command blocks — tap to add</p>
          <div className="flex flex-wrap gap-2">
            {level.allow.map(k => (
              <button key={k} onClick={() => add(k)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: `${CMD_META[k].color}22`, border: `1px solid ${CMD_META[k].color}66`, color: CMD_META[k].color }}>
                + {CMD_META[k].label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px]" style={{ color: '#64748b' }}>
          Adding to: <span style={{ color: ACCENT, fontWeight: 700 }}>{target === 'ROOT' ? 'Main program' : target === 'FUNC' ? 'Function F' : 'selected block'}</span>
          {' '}· tap a Repeat/If block to add inside it
        </p>

        <ProgramBox label="Main program" active={target === 'ROOT'} onSelectRoot={() => setTarget('ROOT')}>
          <ProgramList cmds={main} target={target} activeId={activeId} onSelect={setTarget} onRemove={remove} onChangeN={changeN} />
        </ProgramBox>

        {hasFunc && (
          <ProgramBox label="Function F (reusable)" active={target === 'FUNC'} onSelectRoot={() => setTarget('FUNC')} accent="#f472b6">
            <ProgramList cmds={func} target={target} activeId={activeId} onSelect={setTarget} onRemove={remove} onChangeN={changeN} />
          </ProgramBox>
        )}
      </div>

      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Coder&rsquo;s Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;Good programmers are lazy in the smart way: if you write the same block twice, a loop or a function can probably do it once.&rdquo;</p>
      </div>
    </div>
  );
}

// ── sub-components / helpers ───────────────────────────────────────────────
function ProgramBox({ label, active, onSelectRoot, children, accent = '#818cf8' }:
  { label: string; active: boolean; onSelectRoot: () => void; children: React.ReactNode; accent?: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: '#0B0F15', border: `1px solid ${active ? `${accent}66` : 'rgba(255,255,255,0.07)'}` }}>
      <button onClick={onSelectRoot} className="text-[10px] font-black uppercase tracking-widest mb-2 block"
        style={{ color: active ? accent : '#64748b' }}>{label}{active ? ' ◂ adding here' : ''}</button>
      <div className="flex flex-col gap-1.5 min-h-[36px]">{children}</div>
    </div>
  );
}

function ProgramList({ cmds, target, activeId, onSelect, onRemove, onChangeN, depth = 0 }:
  { cmds: Cmd[]; target: string; activeId?: string; onSelect: (id: string) => void; onRemove: (id: string) => void; onChangeN: (id: string, d: number) => void; depth?: number }) {
  if (cmds.length === 0) return <p className="text-[11px] italic" style={{ color: '#475569' }}>— empty —</p>;
  return (
    <>
      {cmds.map(c => {
        const meta = CMD_META[c.k];
        const isContainer = c.k === 'repeat' || c.k === 'if';
        const selected = target === c.id;
        const running = activeId === c.id;
        return (
          <div key={c.id} style={{ marginLeft: depth * 12 }}>
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all"
              style={{
                background: running ? `${meta.color}33` : `${meta.color}1a`,
                border: `1px solid ${running ? meta.color : selected ? meta.color : `${meta.color}40`}`,
                boxShadow: running ? `0 0 0 2px ${meta.color}55, 0 0 14px ${meta.color}55` : 'none',
                transform: running ? 'translateX(3px)' : 'none',
              }}>
              <span className="text-xs font-bold flex-1" style={{ color: meta.color }}>
                {running ? '▸ ' : ''}{meta.label}
              </span>
              {c.k === 'repeat' && (
                <span className="flex items-center gap-1">
                  <button onClick={() => onChangeN(c.id, -1)} className="w-7 h-7 rounded text-sm font-black" style={{ background: 'rgba(255,255,255,0.06)', color: '#fbbf24' }}>−</button>
                  <span className="text-xs font-black tabular-nums w-6 text-center" style={{ color: '#fbbf24' }}>{c.n}×</span>
                  <button onClick={() => onChangeN(c.id, 1)} className="w-7 h-7 rounded text-sm font-black" style={{ background: 'rgba(255,255,255,0.06)', color: '#fbbf24' }}>+</button>
                </span>
              )}
              {isContainer && (
                <button onClick={() => onSelect(c.id)} className="text-[10px] font-bold px-2 py-1.5 rounded"
                  style={{ background: selected ? `${meta.color}33` : 'rgba(255,255,255,0.05)', color: meta.color }}>
                  {selected ? '◂ inside' : 'add inside'}
                </button>
              )}
              <button onClick={() => onRemove(c.id)} className="w-7 h-7 rounded text-sm font-black flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>✕</button>
            </div>
            {isContainer && (
              <div className="mt-1 pl-2 ml-2" style={{ borderLeft: `2px solid ${meta.color}33` }}>
                <ProgramList cmds={c.body} target={target} activeId={activeId} onSelect={onSelect} onRemove={onRemove} onChangeN={onChangeN} depth={depth + 1} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function isInFunc(func: Cmd[], id: string): boolean {
  for (const c of func) {
    if (c.id === id) return true;
    if ((c.k === 'repeat' || c.k === 'if') && isInFunc(c.body, id)) return true;
  }
  return false;
}
function findN(list: Cmd[], id: string): number {
  for (const c of list) {
    if (c.id === id && c.k === 'repeat') return c.n;
    if (c.k === 'repeat' || c.k === 'if') { const f = findN(c.body, id); if (f >= 0) return f; }
  }
  return -1;
}
function clampN(n: number) { return Math.max(1, Math.min(12, n)); }
