'use client';

// ──────────────────────────────────────────────────────────────────────────
// Ionization Energy Staircase
// Class 11 Chemistry · Chapter 3 (Periodicity) · JEE/NEET
//
// Teaches: successive ionization enthalpies (ΔᵢH₁, ΔᵢH₂, …) and the exam skill
// of "finding the group from the big jump" — the first electron pulled from a
// noble-gas core requires a huge energy spike, and the NUMBER of electrons
// removed *before* that jump = number of valence electrons = group.
//
// ACADEMIC SOURCE (anti-hallucination gate, per SIMULATION_DESIGN_WORKFLOW §7):
// Successive ionization enthalpy values (kJ/mol) are standard reference data,
// supplied verbatim by the task spec (consistent with NCERT / CRC Handbook of
// Chemistry & Physics tabulations). They are NOT generated from training
// knowledge — they are hardcoded exactly as given and must not be altered.
//
// SANITY CHECK on jump detection (asserted at module load, see below):
//   Na: jump IE1→IE2  → 1 valence e⁻ → Group 1
//   Mg: jump IE2→IE3  → 2 valence e⁻ → Group 2
//   Al: jump IE3→IE4  → 3 valence e⁻ → Group 13
// ──────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useRef, useEffect } from 'react';
import { TrendingUp, Target, Sparkles, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

// ── palette (surfaces + text from SIMULATION_DESIGN_WORKFLOW §3; orange/amber
//    primary accent per CLAUDE.md §7 Design System) ─────────────────────────
const C = {
  bg: '#0d1117',
  card: '#0B0F15',
  surface: '#151E32',
  text: '#e2e8f0',
  text2: '#94a3b8',
  muted: '#475569',
  ghost: '#64748b',
  orange: '#f97316', // orange-500
  amber: '#fbbf24',
  amberDark: '#d97706',
  amberLight: '#fcd34d',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  red: '#f87171',
  redDark: '#dc2626',
};

// ── DATASET (kJ/mol) — SUPPLIED VERBATIM. DO NOT INVENT OR ALTER. ───────────
type ElementIE = {
  symbol: string;
  name: string;
  Z: number;
  group: number;       // 1, 2, 13, 14 …
  valence: number;     // valence electrons = position of the big jump
  ies: number[];       // ΔᵢH₁, ΔᵢH₂, …
};

const ELEMENTS: ElementIE[] = [
  { symbol: 'Li', name: 'Lithium',   Z: 3,  group: 1,  valence: 1, ies: [520, 7298, 11815] },
  { symbol: 'Be', name: 'Beryllium', Z: 4,  group: 2,  valence: 2, ies: [899, 1757, 14849, 21007] },
  { symbol: 'B',  name: 'Boron',     Z: 5,  group: 13, valence: 3, ies: [801, 2427, 3660, 25026] },
  { symbol: 'C',  name: 'Carbon',    Z: 6,  group: 14, valence: 4, ies: [1086, 2353, 4620, 6223, 37831] },
  { symbol: 'Na', name: 'Sodium',    Z: 11, group: 1,  valence: 1, ies: [496, 4562, 6910, 9543, 13354] },
  { symbol: 'Mg', name: 'Magnesium', Z: 12, group: 2,  valence: 2, ies: [738, 1451, 7733, 10540, 13630] },
  { symbol: 'Al', name: 'Aluminium', Z: 13, group: 13, valence: 3, ies: [577, 1817, 2745, 11577, 14842] },
  { symbol: 'Si', name: 'Silicon',   Z: 14, group: 14, valence: 4, ies: [786, 1577, 3232, 4356, 16091] },
  { symbol: 'K',  name: 'Potassium', Z: 19, group: 1,  valence: 1, ies: [419, 3051, 4420, 5877, 7975] },
  { symbol: 'Ca', name: 'Calcium',   Z: 20, group: 2,  valence: 2, ies: [590, 1145, 4912, 6491, 8153] },
];

// ── JUMP DETECTION ──────────────────────────────────────────────────────────
// The "big jump" is the first successive step (IE_n → IE_{n+1}) whose ratio is
// far larger than the others. We pick the step with the LARGEST ratio
// IE_{n+1} / IE_n. The number of electrons removed BEFORE that jump (= n) is
// the count of valence electrons. jumpAfter is 1-indexed: the jump happens
// between IE_jumpAfter and IE_{jumpAfter+1}.
function detectJump(ies: number[]): { jumpAfter: number; ratio: number } {
  let best = { jumpAfter: 1, ratio: 0 };
  for (let i = 0; i < ies.length - 1; i++) {
    const ratio = ies[i + 1] / ies[i];
    if (ratio > best.ratio) best = { jumpAfter: i + 1, ratio };
  }
  return best;
}

// valence electrons from the big jump = index of the jump (electrons removed
// before the spike)
function valenceFromJump(ies: number[]): number {
  return detectJump(ies).jumpAfter;
}

// Map a valence-electron count to its s/p-block group number.
function groupFromValence(v: number): number {
  // 1 → Grp 1, 2 → Grp 2, 3 → Grp 13, 4 → Grp 14 (p-block offset of +10)
  return v <= 2 ? v : v + 10;
}

// ── module-load sanity assertions (dev guard, per workflow §7) ──────────────
(function sanityCheck() {
  const expect: Record<string, number> = { Na: 1, Mg: 2, Al: 3 };
  for (const sym of Object.keys(expect)) {
    const el = ELEMENTS.find((e) => e.symbol === sym)!;
    const v = valenceFromJump(el.ies);
    if (v !== expect[sym] || v !== el.valence) {
      // eslint-disable-next-line no-console
      console.warn(
        `[IonizationStaircaseSim] jump-detection mismatch for ${sym}: got ${v}, expected ${expect[sym]}`
      );
    }
  }
})();

// ── small helpers ────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('en-US');

type Tab = 'visualise' | 'challenge';
type Scale = 'log' | 'linear';

// Group choices offered in Part 2
const GROUP_CHOICES: { valence: number; group: number; label: string }[] = [
  { valence: 1, group: 1, label: 'Group 1' },
  { valence: 2, group: 2, label: 'Group 2' },
  { valence: 3, group: 13, label: 'Group 13' },
  { valence: 4, group: 14, label: 'Group 14' },
];

// ════════════════════════════════════════════════════════════════════════════
// BAR CHART (hand-rolled — no charting library)
// ════════════════════════════════════════════════════════════════════════════
function BarChart({
  ies,
  scale,
  highlightJump,
  hideValues,
}: {
  ies: number[];
  scale: Scale;
  highlightJump: boolean;
  hideValues: boolean;
}) {
  const { jumpAfter } = detectJump(ies);
  const max = Math.max(...ies);
  const min = Math.min(...ies);

  // height fraction (0..1) for each bar
  const heightFrac = (v: number) => {
    if (scale === 'linear') return v / max;
    // log scale — map [log(min*0.8), log(max)] → [0.06, 1]
    const lo = Math.log10(min * 0.8);
    const hi = Math.log10(max);
    const f = (Math.log10(v) - lo) / (hi - lo);
    return 0.08 + 0.92 * f;
  };

  return (
    <div className="w-full">
      {/* bars */}
      <div
        className="flex items-end justify-around gap-2 sm:gap-3 px-1"
        style={{ height: 230 }}
      >
        {ies.map((v, i) => {
          // a "core" electron is anything removed AFTER the big jump
          const isCoreFirst = highlightJump && i + 1 === jumpAfter + 1;
          const isValence = highlightJump && i + 1 <= jumpAfter;
          const barColor = !highlightJump
            ? C.orange
            : isValence
            ? C.orange
            : C.red;
          return (
            <div key={i} className="flex flex-col items-center flex-1 min-w-0 h-full justify-end">
              {/* value label */}
              <div
                className="text-[9px] sm:text-[10px] font-bold tabular-nums mb-1 text-center leading-none"
                style={{ color: isCoreFirst ? C.amberLight : C.text2, minHeight: 12 }}
              >
                {hideValues ? '?' : fmt(v)}
              </div>
              {/* bar */}
              <div
                className="w-full rounded-t-md relative"
                style={{
                  height: `${Math.max(heightFrac(v) * 100, 3)}%`,
                  background: `linear-gradient(to top, ${barColor}, ${
                    isValence || !highlightJump ? C.amber : C.redDark
                  })`,
                  boxShadow: isCoreFirst ? `0 0 16px ${C.amber}66` : 'none',
                  transition: 'height 0.45s cubic-bezier(.2,.8,.2,1), background 0.3s',
                  animation: isCoreFirst ? 'ie-pulse 1.6s ease-in-out infinite' : undefined,
                }}
              />
              {/* x label */}
              <div
                className="text-[10px] sm:text-[11px] font-black mt-1.5 leading-none"
                style={{ color: isCoreFirst ? C.amber : C.muted }}
              >
                IE<sub>{i + 1}</sub>
              </div>
            </div>
          );
        })}
      </div>

      {/* jump annotation */}
      {highlightJump && jumpAfter < ies.length && (
        <div
          className="mt-3 rounded-lg px-3 py-2.5 flex items-start gap-2"
          style={{
            background: 'rgba(251,191,36,0.10)',
            border: `1px solid ${C.amber}55`,
          }}
        >
          <Sparkles size={16} style={{ color: C.amber, marginTop: 1, flexShrink: 0 }} />
          <p className="text-xs sm:text-sm leading-snug" style={{ color: C.text2 }}>
            <span className="font-black" style={{ color: C.amber }}>
              Huge jump at IE
              <sub>{jumpAfter + 1}</sub>
            </span>{' '}
            — the next electron must come out of the stable{' '}
            <span style={{ color: C.amberLight }}>noble-gas core</span>.{' '}
            {jumpAfter} electron{jumpAfter > 1 ? 's' : ''} left easily{' '}
            <span className="font-black" style={{ color: C.text }}>
              → {jumpAfter} valence electron{jumpAfter > 1 ? 's' : ''} → Group{' '}
              {groupFromValence(jumpAfter)}
            </span>
            .
          </p>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PART 1 — VISUALISE
// ════════════════════════════════════════════════════════════════════════════
function VisualisePart() {
  const [symbol, setSymbol] = useState('Na');
  const [scale, setScale] = useState<Scale>('log');
  const [showJump, setShowJump] = useState(true);

  const el = ELEMENTS.find((e) => e.symbol === symbol)!;

  return (
    <div className="flex flex-col gap-5">
      {/* element selector */}
      <div>
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ color: C.amberDark }}
        >
          Pick an element
        </p>
        <div className="flex flex-wrap gap-2">
          {ELEMENTS.map((e) => {
            const active = e.symbol === symbol;
            return (
              <button
                key={e.symbol}
                onClick={() => setSymbol(e.symbol)}
                className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: active ? 'rgba(249,115,22,0.16)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? `${C.orange}88` : 'rgba(255,255,255,0.07)'}`,
                  color: active ? C.amber : C.text2,
                }}
              >
                {e.symbol}
                <span
                  className="ml-1.5 text-[10px] font-semibold"
                  style={{ color: active ? C.amberLight : C.muted }}
                >
                  Z{e.Z}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* readout + toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-black text-white leading-none">
            {el.name}{' '}
            <span className="text-base font-bold" style={{ color: C.muted }}>
              ({el.symbol})
            </span>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            Group {el.group} · {el.valence} valence electron{el.valence > 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* scale toggle */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: C.ghost }}>
              Scale
            </span>
            <div className="flex">
              {(['log', 'linear'] as Scale[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className="px-2.5 py-1 text-[11px] font-bold capitalize transition-all"
                  style={{
                    borderBottom: `2px solid ${scale === s ? C.orange : 'rgba(255,255,255,0.08)'}`,
                    color: scale === s ? C.amber : C.muted,
                    background: 'none',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {/* jump highlight toggle */}
          <button
            onClick={() => setShowJump((v) => !v)}
            className="self-end text-xs font-semibold transition-colors pb-0.5"
            style={{
              color: showJump ? C.amber : C.muted,
              borderBottom: `1px solid ${showJump ? `${C.amber}88` : 'rgba(255,255,255,0.1)'}`,
              background: 'none',
            }}
          >
            {showJump ? '✓ Big jump shown' : 'Show big jump'}
          </button>
        </div>
      </div>

      {/* chart on a canvas surface */}
      <div className="rounded-2xl p-4 pt-5" style={{ background: C.surface, border: 'rgba(255,255,255,0.05)' }}>
        <BarChart ies={el.ies} scale={scale} highlightJump={showJump} hideValues={false} />
      </div>

      {scale === 'linear' && (
        <p className="text-xs leading-snug" style={{ color: C.muted }}>
          On a <span style={{ color: C.text2 }}>linear scale</span> the later bars dwarf the early
          ones, so the pattern is hard to read. Switch to{' '}
          <span style={{ color: C.amber }}>log scale</span> to see every step clearly.
        </p>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PART 2 — GUESS THE GROUP
// ════════════════════════════════════════════════════════════════════════════
function ChallengePart() {
  // pool of mystery elements (use all — symbol hidden until reveal)
  const pool = ELEMENTS;
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * pool.length));
  const [guess, setGuess] = useState<number | null>(null); // valence guess
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const el = pool[idx];
  const trueValence = valenceFromJump(el.ies);
  const correct = guess === trueValence;

  const submit = (v: number) => {
    if (revealed) return;
    setGuess(v);
    setRevealed(true);
    setScore((s) => ({ right: s.right + (v === trueValence ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    let n = idx;
    if (pool.length > 1) {
      while (n === idx) n = Math.floor(Math.random() * pool.length);
    }
    setIdx(n);
    setGuess(null);
    setRevealed(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: C.amberDark }}>
            Mystery element
          </p>
          <p className="text-base leading-snug" style={{ color: C.text2 }}>
            Read the bars. Where is the{' '}
            <span style={{ color: C.amber }} className="font-bold">
              first big jump
            </span>
            ? That tells you the valence electrons — and the group.
          </p>
        </div>
        <div
          className="text-[11px] font-black uppercase tracking-widest tabular-nums px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', color: C.text2 }}
        >
          Score {score.right}/{score.total}
        </div>
      </div>

      {/* chart — values hidden until revealed */}
      <div className="rounded-2xl p-4 pt-5" style={{ background: C.surface }}>
        <BarChart ies={el.ies} scale="log" highlightJump={revealed} hideValues={!revealed} />
      </div>

      {/* group choices */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: C.amberDark }}>
          {revealed ? 'Your answer' : 'How many valence electrons / which group?'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GROUP_CHOICES.map((g) => {
            const chosen = guess === g.valence;
            const isAnswer = g.valence === trueValence;
            let bg = 'rgba(255,255,255,0.03)';
            let border = 'rgba(255,255,255,0.07)';
            let col = C.text2;
            if (revealed) {
              if (isAnswer) {
                bg = 'rgba(16,185,129,0.14)';
                border = `${C.emerald}88`;
                col = C.emeraldLight;
              } else if (chosen) {
                bg = 'rgba(220,38,38,0.14)';
                border = `${C.red}88`;
                col = C.red;
              } else {
                col = C.muted;
              }
            } else if (chosen) {
              bg = 'rgba(249,115,22,0.16)';
              border = `${C.orange}88`;
              col = C.amber;
            }
            return (
              <button
                key={g.valence}
                onClick={() => submit(g.valence)}
                disabled={revealed}
                className="px-3 py-2.5 rounded-lg text-center transition-all"
                style={{ background: bg, border: `1px solid ${border}`, color: col, cursor: revealed ? 'default' : 'pointer' }}
              >
                <div className="text-sm font-black">{g.label}</div>
                <div className="text-[10px] font-semibold" style={{ opacity: 0.8 }}>
                  {g.valence} valence e⁻
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* verdict */}
      {revealed && (
        <div
          className="rounded-xl px-4 py-3 flex flex-col gap-1.5"
          style={{
            background: correct ? 'rgba(16,185,129,0.10)' : 'rgba(220,38,38,0.10)',
            border: `1px solid ${correct ? `${C.emerald}55` : `${C.red}55`}`,
          }}
        >
          <div className="flex items-center gap-2">
            {correct ? (
              <CheckCircle2 size={18} style={{ color: C.emeraldLight }} />
            ) : (
              <XCircle size={18} style={{ color: C.red }} />
            )}
            <span
              className="text-sm font-black"
              style={{ color: correct ? C.emeraldLight : C.red }}
            >
              {correct ? 'Correct!' : 'Not quite.'}
            </span>
            <span className="text-sm font-bold text-white">
              It was {el.name} ({el.symbol}) — Group {el.group}.
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-snug" style={{ color: C.text2 }}>
            The big jump comes right after IE
            <sub>{trueValence}</sub>, so {trueValence} electron
            {trueValence > 1 ? 's' : ''} come{trueValence > 1 ? '' : 's'} off easily before the core
            resists. {trueValence} valence electron{trueValence > 1 ? 's' : ''} ⇒{' '}
            <span className="font-black" style={{ color: C.amber }}>
              Group {groupFromValence(trueValence)}
            </span>
            .
          </p>
        </div>
      )}

      {/* next */}
      <div className="flex justify-end">
        <button
          onClick={next}
          disabled={!revealed}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: revealed
              ? 'linear-gradient(to right, #f97316, #f59e0b)'
              : 'rgba(255,255,255,0.04)',
            color: revealed ? '#000' : C.muted,
            border: revealed ? 'none' : '1px solid rgba(255,255,255,0.08)',
            cursor: revealed ? 'pointer' : 'default',
          }}
        >
          Next element →
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function IonizationStaircaseSim() {
  const [tab, setTab] = useState<Tab>('visualise');

  return (
    <div className="p-4 md:p-6" style={{ background: C.bg, color: C.text, minHeight: '80vh' }}>
      {/* keyframes */}
      <style>{`
        @keyframes ie-pulse { 0%,100%{filter:brightness(1);} 50%{filter:brightness(1.45);} }
      `}</style>

      {/* header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Ionization Energy <span style={{ color: C.orange }}>Staircase</span>
          </h1>
          <p
            className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: C.muted }}
          >
            Successive ΔᵢH · Find the group from the big jump
          </p>
        </div>
        <div
          className="text-[10px] font-black uppercase tracking-widest pt-1"
          style={{ color: C.ghost }}
        >
          Class 11 · Periodicity
        </div>
      </div>

      {/* tab selector (underline style) */}
      <div className="flex gap-1 mb-6">
        <button
          onClick={() => setTab('visualise')}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-center transition-all"
          style={{
            borderBottom: `2px solid ${tab === 'visualise' ? C.orange : 'rgba(255,255,255,0.06)'}`,
            opacity: tab === 'visualise' ? 1 : 0.55,
            background: 'none',
          }}
        >
          <TrendingUp size={15} style={{ color: tab === 'visualise' ? C.amber : C.muted }} />
          <div className="text-left">
            <div className="text-xs font-black" style={{ color: tab === 'visualise' ? C.amber : C.text2 }}>
              Part 1 · Visualise
            </div>
            <div className="text-[10px]" style={{ color: C.muted }}>
              See the jump
            </div>
          </div>
        </button>
        <button
          onClick={() => setTab('challenge')}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-center transition-all"
          style={{
            borderBottom: `2px solid ${tab === 'challenge' ? C.orange : 'rgba(255,255,255,0.06)'}`,
            opacity: tab === 'challenge' ? 1 : 0.55,
            background: 'none',
          }}
        >
          <Target size={15} style={{ color: tab === 'challenge' ? C.amber : C.muted }} />
          <div className="text-left">
            <div className="text-xs font-black" style={{ color: tab === 'challenge' ? C.amber : C.text2 }}>
              Part 2 · Guess the Group
            </div>
            <div className="text-[10px]" style={{ color: C.muted }}>
              Test yourself
            </div>
          </div>
        </button>
      </div>

      {/* the rule (plain text, no card) */}
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: C.amberDark }}>
          The Exam Trick
        </p>
        <p className="text-white font-bold text-base sm:text-lg leading-snug">
          The position of the{' '}
          <span style={{ color: C.amber }}>first huge jump</span> in successive ionization energies
          tells you the <span style={{ color: C.orange }}>number of valence electrons</span> — and
          therefore the group.
        </p>
      </div>

      {/* body */}
      <div key={tab} style={{ animation: 'none' }}>
        {tab === 'visualise' ? <VisualisePart /> : <ChallengePart />}
      </div>
    </div>
  );
}
