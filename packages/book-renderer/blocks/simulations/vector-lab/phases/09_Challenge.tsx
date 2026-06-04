'use client';

// Module 9 — Read-the-Diagram Challenge. ★ The brief's stated end-goal:
// "solve problems just by looking at the vector diagrams."
// A scored quiz of three diagram-reading skills — resultant direction,
// equilibrium spotting, and the triangle-inequality size sense — each tied to a
// misconception from earlier modules. No new physics; pure diagram literacy.

import { useEffect, useRef, useState } from 'react';
import { add, sub, fromPolar, magnitude, angle360, type Vec2 } from '../lib/vectorMath';
import { frame } from '../lib/viewport';
import { C } from '../lib/theme';
import { Canvas, PhaseLayout, SideHeading } from '../components/ScenarioStage';
import { VectorArrow, Dot, Grid } from '../components/svg';
import { ExpertTip } from '../components/primitives';
import { useMastery } from '../learning/mastery';

const F = frame({ originX: 230, originY: 210, scale: 13 });

const OCTANTS = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
function octant(deg: number): string {
  return OCTANTS[Math.round(angle360({ x: Math.cos((deg * Math.PI) / 180), y: Math.sin((deg * Math.PI) / 180) }) / 45) % 8];
}
const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

interface Arrow {
  from: Vec2;
  to: Vec2;
  color: string;
  label: string;
}
interface Challenge {
  arrows: Arrow[];
  prompt: string;
  options: string[];
  correct: number;
  explain: string;
}

function makeDirection(): Challenge {
  const a = fromPolar(rnd(4, 8), rnd(0, 360));
  const b = fromPolar(rnd(4, 8), rnd(0, 360));
  const r = add(a, b);
  const correctLabel = octant(angle360(r));
  const distractors = [octant(angle360(sub(a, b))), octant(angle360(a) + 180), octant(angle360(b))].filter(
    (d) => d !== correctLabel
  );
  const opts = Array.from(new Set([correctLabel, ...distractors])).slice(0, 4);
  while (opts.length < 4) {
    const o = OCTANTS[Math.floor(Math.random() * 8)];
    if (!opts.includes(o)) opts.push(o);
  }
  const shuffled = shuffle(opts);
  return {
    arrows: [
      { from: { x: 0, y: 0 }, to: a, color: C.indigoMid, label: 'A' },
      { from: a, to: r, color: C.amber, label: 'B' },
    ],
    prompt: 'A and B are drawn tip-to-tail. Roughly which way does the resultant A + B point?',
    options: shuffled,
    correct: shuffled.indexOf(correctLabel),
    explain: `The resultant runs from A's tail to B's head — pointing ${correctLabel}. Drawing it back the other way is the classic "closing-the-loop" slip.`,
  };
}

function makeEquilibrium(): Challenge {
  const a = fromPolar(rnd(4, 7), rnd(0, 360));
  const b = fromPolar(rnd(4, 7), rnd(0, 360));
  const balanced = Math.random() < 0.5;
  const c = balanced ? fromPolar(magnitude(add(a, b)), angle360(add(a, b)) + 180) : fromPolar(rnd(4, 7), rnd(0, 360));
  const sum = add(add(a, b), c);
  const isBalanced = magnitude(sum) < 0.4;
  const opts = ['In equilibrium (forces balance)', 'Not balanced (it would accelerate)'];
  return {
    arrows: [
      { from: { x: 0, y: 0 }, to: a, color: C.indigoMid, label: 'F₁' },
      { from: { x: 0, y: 0 }, to: b, color: C.amber, label: 'F₂' },
      { from: { x: 0, y: 0 }, to: c, color: C.emeraldLight, label: 'F₃' },
    ],
    prompt: 'Three forces act on one point. Is the object in equilibrium?',
    options: opts,
    correct: isBalanced ? 0 : 1,
    explain: isBalanced
      ? 'Drawn tip-to-tail these three would close into a triangle — they sum to zero, so it balances.'
      : 'These would not close into a triangle — there is a leftover resultant, so the point accelerates.',
  };
}

function makeMagnitude(): Challenge {
  const ma = rnd(4, 8);
  const mb = rnd(4, 8);
  const between = rnd(35, 150);
  const a = fromPolar(ma, 0);
  const b = fromPolar(mb, between);
  return {
    arrows: [
      { from: { x: 0, y: 0 }, to: a, color: C.indigoMid, label: 'A' },
      { from: { x: 0, y: 0 }, to: b, color: C.amber, label: 'B' },
    ],
    prompt: 'How does | A + B | compare with | A | + | B | (just adding the sizes)?',
    options: ['Smaller than |A| + |B|', 'Exactly |A| + |B|', 'Larger than |A| + |B|'],
    correct: 0,
    explain: 'Whenever two vectors aren\'t perfectly parallel, the resultant is SHORTER than the sum of their sizes — the triangle inequality. They\'d only be equal at 0°.',
  };
}

const GENERATORS = [makeDirection, makeEquilibrium, makeMagnitude];

export default function ChallengePhase() {
  const { recordChallenge, complete } = useMastery();
  const seq = useRef(0);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const next = () => {
    const gen = GENERATORS[Math.floor(Math.random() * GENERATORS.length)];
    setChallenge(gen());
    setPicked(null);
    seq.current += 1;
  };

  // Generate the first challenge on mount (Math.random is client-only safe here).
  useEffect(() => {
    next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (i: number) => {
    if (picked !== null || !challenge) return;
    setPicked(i);
    setTotal((t) => t + 1);
    if (i === challenge.correct) {
      const newScore = score + 1;
      setScore(newScore);
      recordChallenge(newScore);
      complete('challenge');
    }
  };

  const revealed = picked !== null;

  return (
    <PhaseLayout
      scenarioTitle="Read the diagram — no formulas allowed"
      scenarioTag="Challenge"
      canvas={
        <Canvas>
          <Grid frame={F} />
          {challenge?.arrows.map((ar, i) => (
            <VectorArrow key={`${seq.current}-${i}`} from={ar.from} to={ar.to} frame={F} color={ar.color} label={ar.label} width={4} />
          ))}
          <Dot at={{ x: 0, y: 0 }} frame={F} color={C.amber} />
        </Canvas>
      }
      sidebar={
        <>
          <div className="flex items-center justify-between">
            <SideHeading>Challenge</SideHeading>
            <span className="text-sm font-black tabular-nums" style={{ color: C.emeraldLight }}>
              {score} / {total}
            </span>
          </div>

          <p className="text-white font-bold text-lg leading-snug">{challenge?.prompt}</p>

          <div className="flex flex-col gap-2">
            {challenge?.options.map((opt, i) => {
              const isCorrect = i === challenge.correct;
              const isPicked = i === picked;
              const bg = !revealed
                ? 'rgba(255,255,255,0.03)'
                : isCorrect
                  ? 'rgba(52,211,153,0.12)'
                  : isPicked
                    ? 'rgba(248,113,113,0.12)'
                    : 'rgba(255,255,255,0.03)';
              const border = !revealed
                ? 'rgba(255,255,255,0.1)'
                : isCorrect
                  ? 'rgba(52,211,153,0.5)'
                  : isPicked
                    ? 'rgba(248,113,113,0.5)'
                    : 'rgba(255,255,255,0.07)';
              const col = !revealed ? C.text : isCorrect ? C.emeraldLight : isPicked ? C.red : C.muted;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={revealed}
                  className="text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{ background: bg, border: `1px solid ${border}`, color: col, cursor: revealed ? 'default' : 'pointer' }}
                >
                  {revealed && isCorrect ? '✓ ' : revealed && isPicked ? '✗ ' : ''}
                  {opt}
                </button>
              );
            })}
          </div>

          {revealed ? (
            <>
              <p className="text-sm leading-snug" style={{ color: C.text2 }}>
                {challenge?.explain}
              </p>
              <button
                onClick={next}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all self-start"
                style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: C.indigoLight }}
              >
                Next diagram →
              </button>
            </>
          ) : (
            <p className="text-sm" style={{ color: C.muted }}>
              Look at the arrows and answer from the picture — that&rsquo;s the whole skill.
            </p>
          )}

          <ExpertTip>
            Examiners hide easy marks in diagrams. Train your eye: tail-to-head for the resultant, closed loop for
            balance, and the resultant is always shorter than the sizes added.
          </ExpertTip>
        </>
      }
    />
  );
}
