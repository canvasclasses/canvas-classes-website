'use client';

/*
 * Mendeleev's Gap Predictor — Class 11 Chemistry, Chapter 3 (Periodic Table)
 *
 * ANTI-HALLUCINATION GATE (workflow §7): the prediction-vs-actual numbers below
 * are the two celebrated cases from NCERT Class 11 Chemistry, Unit 3
 * ("Classification of Elements and Periodicity in Properties") and standard
 * history-of-chemistry references. They are quoted EXACTLY as supplied and must
 * not be altered:
 *
 *   Eka-aluminium → Gallium (Ga, discovered 1875, Lecoq de Boisbaudran)
 *     Mendeleev predicted: atomic mass ~68, density ~5.9 g/cm³, low m.p., oxide E2O3
 *     Actual Gallium:      atomic mass 69.7, density 5.91 g/cm³, m.p. 30.2 °C, oxide Ga2O3
 *
 *   Eka-silicon → Germanium (Ge, discovered 1886, Winkler)
 *     Mendeleev predicted: atomic mass ~72, density ~5.5 g/cm³, grey metal, oxide EO2 (d~4.7)
 *     Actual Germanium:    atomic mass 72.6, density 5.32 g/cm³, grey-white metalloid, oxide GeO2 (d 4.23)
 *
 * Neighbour atomic masses for the "interpolate from neighbours" interaction are
 * read from ELEMENTS in @canvas/data/periodic/elementsData. The averaging
 * is illustrative — the teaching point is "Mendeleev interpolated from known
 * neighbours", not exact arithmetic.
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ELEMENTS } from '@canvas/data/periodic/elementsData';
import { Sparkles, Target, FlaskConical, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

/* ------------------------------------------------------------------ palette */
const BG = '#0d1117';
const CARD = '#0B0F15';
const SURFACE = '#151E32';
const INDIGO = '#818cf8';
const INDIGO_BASE = '#6366f1';
const VIOLET = '#7c3aed';
const AMBER = '#fbbf24';
const EMERALD = '#34d399';
const TXT = '#e2e8f0';
const TXT2 = '#94a3b8';
const MUTED = '#475569';
const GHOST = '#64748b';

type Phase = 'gap' | 'predict' | 'reveal';
type CaseId = 'ekaAl' | 'ekaSi';

/* ------------------------------------------------------------ helper: mass */
function massOf(symbol: string): number {
  const el = ELEMENTS.find((e) => e.symbol === symbol);
  return el?.atomicMass ?? 0;
}

/* --------------------------------------------------------------- case data */
interface CaseData {
  id: CaseId;
  ekaName: string;
  actualSymbol: string;
  actualName: string;
  year: number;
  discoverer: string;
  groupLabel: string;
  /* neighbours used for the averaging interaction */
  neighbours: { symbol: string; pos: 'left' | 'right' | 'up' | 'down' }[];
  /* slider domain for the atomic-mass guess */
  guessMin: number;
  guessMax: number;
  /* the "averaging" suggestion the student is nudged toward */
  averageHint: number;
  /* prediction (Mendeleev) */
  predicted: { mass: number; density: number; oxide: string; note: string };
  /* actual (discovered element) */
  actual: { mass: number; density: number; oxide: string; oxideDensity: string; note: string };
}

const CASES: Record<CaseId, CaseData> = {
  ekaAl: {
    id: 'ekaAl',
    ekaName: 'eka-aluminium',
    actualSymbol: 'Ga',
    actualName: 'Gallium',
    year: 1875,
    discoverer: 'Lecoq de Boisbaudran',
    groupLabel: 'Group III (Boron family)',
    // Al sits above the gap, Zn to the left, In below it — masses read from data file.
    neighbours: [
      { symbol: 'Al', pos: 'up' },
      { symbol: 'Zn', pos: 'left' },
      { symbol: 'In', pos: 'down' },
    ],
    guessMin: 40,
    guessMax: 120,
    averageHint: Math.round((massOf('Al') + massOf('In')) / 2), // ~71 from 27 & 115
    predicted: { mass: 68, density: 5.9, oxide: 'E₂O₃', note: 'low melting point' },
    actual: {
      mass: 69.7,
      density: 5.91,
      oxide: 'Ga₂O₃',
      oxideDensity: '',
      note: 'melts at 30.2 °C — in your hand!',
    },
  },
  ekaSi: {
    id: 'ekaSi',
    ekaName: 'eka-silicon',
    actualSymbol: 'Ge',
    actualName: 'Germanium',
    year: 1886,
    discoverer: 'Clemens Winkler',
    groupLabel: 'Group IV (Carbon family)',
    // Si above the gap, Ga to the left, As to the right, Sn below — masses from data file.
    neighbours: [
      { symbol: 'Si', pos: 'up' },
      { symbol: 'Ga', pos: 'left' },
      { symbol: 'As', pos: 'right' },
      { symbol: 'Sn', pos: 'down' },
    ],
    guessMin: 50,
    guessMax: 130,
    averageHint: Math.round((massOf('Ga') + massOf('As')) / 2), // ~72 from 70 & 75
    predicted: { mass: 72, density: 5.5, oxide: 'EO₂', note: 'grey metal' },
    actual: {
      mass: 72.6,
      density: 5.32,
      oxide: 'GeO₂',
      oxideDensity: '4.23',
      note: 'grey-white metalloid',
    },
  },
};

/* ============================================================= MAIN COMPONENT */
export default function MendeleevGapPredictorSim() {
  const [caseId, setCaseId] = useState<CaseId>('ekaAl');
  const [phase, setPhase] = useState<Phase>('gap');
  const [guess, setGuess] = useState<number>(70);

  const data = CASES[caseId];

  const PHASES: { id: Phase; label: string; icon: React.ReactNode }[] = [
    { id: 'gap', label: 'The Gap', icon: <Target size={13} /> },
    { id: 'predict', label: 'Your Prediction', icon: <Sparkles size={13} /> },
    { id: 'reveal', label: 'The Reveal', icon: <FlaskConical size={13} /> },
  ];
  const phaseIndex = PHASES.findIndex((p) => p.id === phase);

  function switchCase(id: CaseId) {
    setCaseId(id);
    setPhase('gap');
    setGuess(70);
  }
  function resetAll() {
    setPhase('gap');
    setGuess(CASES[caseId].guessMin + Math.round((CASES[caseId].guessMax - CASES[caseId].guessMin) / 2));
  }

  // accuracy of the student's guess vs the actual discovered mass (for celebration)
  const guessOff = Math.abs(guess - data.actual.mass);
  const guessClose = guessOff <= 6;

  return (
    <div className="p-4 md:p-6" style={{ background: BG, color: TXT, minHeight: '80vh' }}>
      <style>{`
        @keyframes mgp-pulse { 0%,100%{filter:brightness(1);} 50%{filter:brightness(1.45);} }
        @keyframes mgp-glow { 0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,0.0);} 50%{box-shadow:0 0 24px 2px rgba(129,140,248,0.35);} }
        .mgp-gap-cell { animation: mgp-pulse 2.2s ease-in-out infinite; }
        .mgp-range { -webkit-appearance:none; appearance:none; height:6px; border-radius:999px; outline:none; }
        .mgp-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:22px; height:22px; border-radius:50%; background:${INDIGO_BASE}; border:3px solid #c4b5fd; cursor:pointer; box-shadow:0 0 12px rgba(99,102,241,0.6); }
        .mgp-range::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:${INDIGO_BASE}; border:3px solid #c4b5fd; cursor:pointer; }
      `}</style>

      {/* ---------- header ---------- */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Mendeleev&rsquo;s <span style={{ color: VIOLET }}>Gap Predictor</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: MUTED }}>
            How he predicted elements no one had ever seen
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: GHOST }}>
          {data.ekaName} → {data.actualName}
        </div>
      </div>

      {/* ---------- case toggle (underline tab style §4g) ---------- */}
      <div className="flex items-stretch gap-1 mb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {(Object.values(CASES)).map((c) => {
          const active = c.id === caseId;
          return (
            <button
              key={c.id}
              onClick={() => switchCase(c.id)}
              className="px-3 md:px-4 py-2 text-center transition-all"
              style={{
                borderBottom: `2px solid ${active ? VIOLET : 'rgba(255,255,255,0.06)'}`,
                opacity: active ? 1 : 0.5,
                background: 'none',
                outline: 'none',
              }}
            >
              <div className="text-xs md:text-sm font-black" style={{ color: active ? '#c4b5fd' : TXT2 }}>
                {c.ekaName}
              </div>
              <div className="text-[10px]" style={{ color: MUTED }}>
                → {c.actualName} ({c.actualSymbol}), {c.year}
              </div>
            </button>
          );
        })}
      </div>

      {/* ---------- StepBar (§4c) ---------- */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {PHASES.map((s, i) => {
          const active = s.id === phase;
          const done = i < phaseIndex;
          return (
            <button
              key={s.id}
              onClick={() => done && setPhase(s.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{
                background: active
                  ? 'rgba(129,140,248,0.15)'
                  : done
                    ? 'rgba(52,211,153,0.08)'
                    : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
                cursor: done ? 'pointer' : 'default',
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{
                  background: active ? INDIGO_BASE : done ? '#059669' : 'rgba(255,255,255,0.06)',
                  color: 'white',
                }}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s.icon}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ---------- phase content ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${caseId}-${phase}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {phase === 'gap' && <GapPhase data={data} />}
          {phase === 'predict' && (
            <PredictPhase data={data} guess={guess} setGuess={setGuess} guessClose={guessClose} guessOff={guessOff} />
          )}
          {phase === 'reveal' && <RevealPhase data={data} guess={guess} guessClose={guessClose} />}
        </motion.div>
      </AnimatePresence>

      {/* ---------- nav row (§4d) ---------- */}
      <div className="flex justify-between items-center pt-6">
        {phase !== 'gap' ? (
          <button
            onClick={() => setPhase(PHASES[phaseIndex - 1].id)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: TXT2 }}
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {phase !== 'reveal' ? (
          <button
            onClick={() => setPhase(PHASES[phaseIndex + 1].id)}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
            style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: '#c4b5fd' }}
          >
            Next: {PHASES[phaseIndex + 1].label}
            <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={resetAll}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
            style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}
          >
            <RotateCcw size={15} /> Try again
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================= PHASE 1: GAP */
function GapPhase({ data }: { data: CaseData }) {
  const up = data.neighbours.find((n) => n.pos === 'up');
  const left = data.neighbours.find((n) => n.pos === 'left');
  const right = data.neighbours.find((n) => n.pos === 'right');
  const down = data.neighbours.find((n) => n.pos === 'down');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6 items-start">
      {/* table fragment */}
      <div
        className="relative rounded-3xl flex items-center justify-center py-10 px-4"
        style={{
          minHeight: 360,
          background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: GHOST }}>
            A fragment of Mendeleev&rsquo;s table — {data.groupLabel}
          </p>
          {/* a 3x3 cross with the gap in the centre */}
          <div className="grid grid-cols-3 gap-3">
            <span />
            <NeighbourCell n={up} />
            <span />
            <NeighbourCell n={left} />
            <GapCell />
            <NeighbourCell n={right} />
            <span />
            <NeighbourCell n={down} />
            <span />
          </div>
          <p className="text-[11px] mt-2" style={{ color: GHOST }}>
            The bordered cell is empty — no element fit here in {data.year > 1875 ? 'Mendeleev&rsquo;s day' : 'the 1860s'}.
          </p>
        </div>
      </div>

      {/* sidebar narrative */}
      <div className="flex flex-col py-1 gap-5">
        <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: TXT }}>
          The bold move
        </h2>
        <div className="space-y-4">
          <p className="text-base leading-snug" style={{ color: TXT2 }}>
            When Mendeleev arranged the elements by mass and properties, some squares simply had{' '}
            <span style={{ color: AMBER }} className="font-bold">no known element</span> to fill them.
          </p>
          <p className="text-base leading-snug" style={{ color: TXT2 }}>
            Instead of forcing a wrong element in, he left the square{' '}
            <span style={{ color: '#c4b5fd' }} className="font-bold">deliberately empty</span> — and predicted the
            properties of whatever would one day be found there.
          </p>
          <p className="text-base leading-snug" style={{ color: TXT2 }}>
            He named this missing element <span style={{ color: VIOLET }} className="font-bold">{data.ekaName}</span>{' '}
            (&ldquo;eka&rdquo; = Sanskrit for &ldquo;one&rdquo; — i.e. one place below the element above it).
          </p>
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: INDIGO_BASE }}>
            Expert Tip
          </h5>
          <p className="text-white text-base font-bold leading-tight italic">
            &ldquo;An empty box that comes with a forecast is the boldest thing in all of chemistry.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function NeighbourCell({ n }: { n?: { symbol: string; pos: string } }) {
  if (!n) return <span />;
  const mass = massOf(n.symbol);
  return (
    <div
      className="w-[78px] h-[78px] rounded-xl flex flex-col items-center justify-center"
      style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <span className="text-xl font-black text-white">{n.symbol}</span>
      <span className="text-[10px] tabular-nums" style={{ color: TXT2 }}>
        {mass.toFixed(mass % 1 === 0 ? 0 : 2)}
      </span>
    </div>
  );
}

function GapCell() {
  return (
    <div
      className="mgp-gap-cell w-[78px] h-[78px] rounded-xl flex flex-col items-center justify-center"
      style={{ background: 'rgba(124,58,237,0.10)', border: '2px dashed rgba(196,181,253,0.7)' }}
    >
      <span className="text-2xl font-black" style={{ color: '#c4b5fd' }}>
        ?
      </span>
      <span className="text-[9px] uppercase tracking-wider" style={{ color: '#a5b4fc' }}>
        gap
      </span>
    </div>
  );
}

/* ========================================================= PHASE 2: PREDICT */
function PredictPhase({
  data,
  guess,
  setGuess,
  guessClose,
  guessOff,
}: {
  data: CaseData;
  guess: number;
  setGuess: (v: number) => void;
  guessClose: boolean;
  guessOff: number;
}) {
  const upN = data.neighbours.find((n) => n.pos === 'up');
  const downN = data.neighbours.find((n) => n.pos === 'down');
  const leftN = data.neighbours.find((n) => n.pos === 'left');
  const rightN = data.neighbours.find((n) => n.pos === 'right');

  // Choose the two neighbours that bracket the gap for the averaging illustration.
  const pair =
    upN && downN ? [upN, downN] : leftN && rightN ? [leftN, rightN] : data.neighbours.slice(0, 2);
  const avg = (massOf(pair[0].symbol) + massOf(pair[1].symbol)) / 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6 items-start">
      <div className="flex flex-col gap-6">
        {/* the averaging idea — plain text, no card (§4e) */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#c4b5fd' }}>
            The Method
          </p>
          <p className="text-white font-bold text-lg leading-snug">
            Mendeleev <span style={{ color: AMBER }}>interpolated</span> — he guessed the missing mass from the
            elements sitting right next to the gap.
          </p>
        </div>

        {/* neighbour masses + average hint */}
        <div
          className="rounded-2xl p-4 flex flex-wrap items-center justify-center gap-4"
          style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {pair.map((n, i) => (
            <React.Fragment key={n.symbol}>
              <div className="flex flex-col items-center">
                <span className="text-lg font-black text-white">{n.symbol}</span>
                <span className="text-sm tabular-nums" style={{ color: TXT2 }}>
                  {massOf(n.symbol).toFixed(massOf(n.symbol) % 1 === 0 ? 0 : 2)}
                </span>
              </div>
              {i === 0 && (
                <span className="text-2xl font-light" style={{ color: MUTED }}>
                  &amp;
                </span>
              )}
            </React.Fragment>
          ))}
          <span className="text-2xl font-light" style={{ color: MUTED }}>
            →
          </span>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: GHOST }}>
              average ≈
            </span>
            <span className="text-2xl font-black tabular-nums" style={{ color: AMBER }}>
              {avg.toFixed(0)}
            </span>
          </div>
        </div>

        {/* slider */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: GHOST }}>
              Your predicted atomic mass
            </span>
            <span className="text-3xl font-black tabular-nums" style={{ color: '#c4b5fd' }}>
              {guess}
            </span>
          </div>
          <input
            type="range"
            className="mgp-range w-full"
            min={data.guessMin}
            max={data.guessMax}
            step={1}
            value={guess}
            onChange={(e) => setGuess(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, ${INDIGO_BASE} 0%, ${INDIGO} ${((guess - data.guessMin) / (data.guessMax - data.guessMin)) * 100}%, rgba(255,255,255,0.08) ${((guess - data.guessMin) / (data.guessMax - data.guessMin)) * 100}%)`,
            }}
          />
          <div className="flex justify-between text-[10px] tabular-nums" style={{ color: MUTED }}>
            <span>{data.guessMin}</span>
            <span>{data.guessMax}</span>
          </div>

          {/* live feedback nudge */}
          <div
            className="rounded-xl px-4 py-3 text-sm leading-snug"
            style={{
              background: guessClose ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${guessClose ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
              color: guessClose ? '#6ee7b7' : TXT2,
            }}
          >
            {guessClose ? (
              <span>
                Beautiful — your guess is within {guessOff.toFixed(1)} of the real answer. That&rsquo;s essentially what
                Mendeleev did. Now reveal his actual forecast.
              </span>
            ) : (
              <span>
                Try setting your guess near the average of the neighbours (around{' '}
                <span style={{ color: AMBER }} className="font-bold tabular-nums">
                  {avg.toFixed(0)}
                </span>
                ). The element that was eventually found sits very close to it.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* sidebar */}
      <div className="flex flex-col py-1 gap-5">
        <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: TXT }}>
          Why averaging works
        </h2>
        <div className="space-y-4">
          <p className="text-base leading-snug" style={{ color: TXT2 }}>
            Across a period and down a group, atomic mass changes in a{' '}
            <span style={{ color: '#c4b5fd' }} className="font-bold">smooth, regular</span> way.
          </p>
          <p className="text-base leading-snug" style={{ color: TXT2 }}>
            So a missing element&rsquo;s mass should land roughly{' '}
            <span style={{ color: AMBER }} className="font-bold">between its neighbours&rsquo; masses</span> — the same
            logic you just used with the slider.
          </p>
          <p className="text-base leading-snug" style={{ color: TXT2 }}>
            Mendeleev applied this not just to mass, but to density, melting point and oxide formula too.
          </p>
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: INDIGO_BASE }}>
            Expert Tip
          </h5>
          <p className="text-white text-base font-bold leading-tight italic">
            &ldquo;Regular trends turn an empty box into a fillable blank — interpolate, don&rsquo;t guess.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================== PHASE 3: REVEAL */
function RevealPhase({ data, guess, guessClose }: { data: CaseData; guess: number; guessClose: boolean }) {
  const massError = useMemo(() => Math.abs(data.predicted.mass - data.actual.mass), [data]);
  const densError = useMemo(() => Math.abs(data.predicted.density - data.actual.density), [data]);
  const massPct = ((massError / data.actual.mass) * 100).toFixed(1);
  const densPct = ((densError / data.actual.density) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* celebration banner */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center gap-4"
        style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', animation: 'mgp-glow 3s ease-in-out infinite' }}
      >
        <Trophy size={28} style={{ color: EMERALD }} className="shrink-0" />
        <div>
          <p className="text-lg font-black text-white leading-tight">
            {data.ekaName} turned out to be <span style={{ color: EMERALD }}>{data.actualName}</span> ({data.actualSymbol}).
          </p>
          <p className="text-sm leading-snug" style={{ color: '#6ee7b7' }}>
            Discovered in {data.year} by {data.discoverer} — and it matched Mendeleev&rsquo;s forecast almost exactly.
            {guessClose ? ' Your own guess was right in the zone too.' : ` (Your guess: ${guess}.)`}
          </p>
        </div>
      </div>

      {/* three columns side by side */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4">
        {/* Mendeleev's prediction */}
        <RevealColumn
          accent={VIOLET}
          accentLight="#c4b5fd"
          tag="Mendeleev predicted"
          title={data.ekaName}
          rows={[
            { label: 'Atomic mass', value: `≈ ${data.predicted.mass}` },
            { label: 'Density', value: `≈ ${data.predicted.density} g/cm³` },
            { label: 'Oxide formula', value: data.predicted.oxide },
            { label: 'Character', value: data.predicted.note },
          ]}
        />

        {/* the actual element */}
        <RevealColumn
          accent="#059669"
          accentLight={EMERALD}
          tag="Actually discovered"
          title={`${data.actualName} (${data.actualSymbol})`}
          rows={[
            { label: 'Atomic mass', value: `${data.actual.mass}` },
            { label: 'Density', value: `${data.actual.density} g/cm³` },
            { label: 'Oxide formula', value: data.actual.oxide + (data.actual.oxideDensity ? ` (d ${data.actual.oxideDensity})` : '') },
            { label: 'Character', value: data.actual.note },
          ]}
        />

        {/* how close he was */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: CARD, border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: AMBER }}>
            How close he was
          </span>
          <ScoreStat label="Mass error" big={`${massError.toFixed(1)}`} unit="u" pct={massPct} />
          <ScoreStat label="Density error" big={`${densError.toFixed(2)}`} unit="g/cm³" pct={densPct} />
          <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-sm leading-snug" style={{ color: TXT2 }}>
              Decades before the element existed in any lab, he was off by barely a{' '}
              <span style={{ color: AMBER }} className="font-bold">couple of percent</span>. That precision is what
              convinced the world the periodic table was real.
            </p>
          </div>
        </div>
      </div>

      {/* closing line */}
      <p className="text-center text-base leading-snug" style={{ color: GHOST }}>
        Toggle to the other case above and watch the prediction land again —{' '}
        {data.id === 'ekaAl' ? 'eka-silicon → Germanium' : 'eka-aluminium → Gallium'}.
      </p>
    </div>
  );
}

function RevealColumn({
  accent,
  accentLight,
  tag,
  title,
  rows,
}: {
  accent: string;
  accentLight: string;
  tag: string;
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: CARD, border: `1px solid ${accent}55` }}>
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentLight }}>
          {tag}
        </span>
        <p className="text-lg font-black text-white leading-tight mt-0.5">{title}</p>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
              {r.label}
            </span>
            <span className="text-base font-bold text-white tabular-nums">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreStat({ label, big, unit, pct }: { label: string; big: string; unit: string; pct: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tabular-nums" style={{ color: AMBER }}>
          {big}
        </span>
        <span className="text-sm" style={{ color: TXT2 }}>
          {unit}
        </span>
        <span className="text-xs tabular-nums ml-1" style={{ color: GHOST }}>
          ({pct}% off)
        </span>
      </div>
    </div>
  );
}
