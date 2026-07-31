'use client';

/*
 * nuclear/DecayView.tsx — half-life is NOT half the time until it is gone.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * Textbooks assert N = N₀e^(−λt) and then use it. Where it comes FROM is never
 * shown, because it needs an animation: give every nucleus the same fixed chance
 * of decaying in the next instant, no memory of how long it has waited, and the
 * exponential is what a few hundred of them add up to. So this view runs a real
 * stochastic population — one seeded coin flip per surviving nucleus per step —
 * beside the smooth law, and NEITHER is used to compute the other.
 *
 * The count is visibly noisy at 400 nuclei and lands on the curve anyway. That
 * gap between "noisy individuals" and "smooth law" is the whole of statistical
 * physics in one picture, and it is the reason the population is small enough to
 * count rather than large enough to look tidy.
 *
 * ── Guided, never auto-playing (design law #5) ───────────────────────────────
 * There is NO animation loop in this file. `Run one half-life` advances the
 * simulation by exactly one half-life and stops. The grid is fully alive until
 * the student presses something, and the prediction is committed before the
 * second half-life runs — because "after two half-lives, how many are left?" only
 * teaches anything if the answer is not already on screen.
 *
 * The canvas renders ZERO `<text>` elements.
 */

import * as React from 'react';
import {
  decayConstant, decayCurve, fractionAfterHalfLives, halfLivesElapsed,
  measuredHalfLife, meanLifetime, sampleState, simulateDecay, worstDeviationInSigmas,
} from './lib/decay';
import { RADIOACTIVE, nuclide, prettyHalfLife, pretty } from './lib/nuclides';
import { axis, decayGrid, ticks } from './lib/view';
import { boxFor, AttackCard, Axes, Canvas, Chip, TickStrip, ACCENT_B } from './parts';
import type { NuclearArchetype } from '../archetypes.nuclear';
import type { ResolvedNuclear } from './lib/scene';
import { ActionButton, Card, Choice, Legend, Readout, Slider, Toggle, PredictGate } from '../ui';
import { si, fixed } from '../lib/format';
import { ACCENT, TEXT, SIM_CANVAS_BG, accentTint } from '../../simulations/_shared';
import { stageHeight } from '../useStageWidth';

const IDS = RADIOACTIVE.map((n) => n.id);
const SPAN = 6;

export default function DecayView({ resolved, arch, stageW, stacked }: {
  resolved: ResolvedNuclear;
  arch: NuclearArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const [id, setId] = React.useState<string>(
    typeof resolved.params.nuclide === 'string' ? String(resolved.params.nuclide) : 'I-131',
  );
  const [population, setPopulation] = React.useState(
    typeof resolved.params.population === 'number' ? resolved.params.population : 400,
  );
  const [grams, setGrams] = React.useState(
    typeof resolved.params.grams === 'number' ? resolved.params.grams : 1,
  );
  const seed = typeof resolved.params.seed === 'number' ? Math.round(resolved.params.seed) : 20260730;

  /** Elapsed time in HALF-LIVES. Advanced only by a press. Never by a clock. */
  const [elapsed, setElapsed] = React.useState(0);
  const [showActivity, setShowActivity] = React.useState(false);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);

  const nuc = nuclide(id);
  const run = React.useMemo(
    () => simulateDecay(Math.round(population), SPAN, seed),
    [population, seed],
  );
  const smooth = React.useMemo(() => decayCurve(Math.round(population), SPAN), [population]);

  const stepsPerHalfLife = 8;
  const stepIndex = Math.min(run.steps.length - 1, Math.round(elapsed * stepsPerHalfLife));
  const now = run.steps[stepIndex];

  /**
   * Which nuclei are dead AT THIS INSTANT.
   *
   * `simulateDecay` returns the final mask, which is the state at the END of the
   * run — using it directly would show every nucleus dead from the first press.
   * The per-nucleus death time is recovered by replaying the same seeded sequence,
   * which is why the generator has to be deterministic: the grid and the graph
   * must be two views of ONE run, not two runs that happen to look similar.
   */
  const deadBy = React.useMemo(() => {
    const n = Math.round(population);
    const order = new Array<number>(n).fill(Number.POSITIVE_INFINITY);
    // Replay: identical algorithm, recording WHEN each one went.
    let a = seed >>> 0;
    const rand = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let x = a;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
    const alive = new Array<boolean>(n).fill(true);
    const dt = 1 / stepsPerHalfLife;
    const p = 1 - Math.exp(-Math.LN2 * dt);
    const total = Math.round(SPAN * stepsPerHalfLife);
    for (let s = 1; s <= total; s++) {
      for (let i = 0; i < n; i++) {
        if (!alive[i]) continue;
        if (rand() < p) { alive[i] = false; order[i] = s * dt; }
      }
    }
    return order;
  }, [population, seed]);

  const aliveNow = deadBy.reduce((c, t) => c + (t > elapsed ? 1 : 0), 0);
  const state = React.useMemo(() => sampleState(id, grams, elapsed), [id, grams, elapsed]);
  const lambda = decayConstant(nuc.halfLife ?? 1);

  const w = Math.max(240, stageW || 320);
  const gridH = stageHeight(w, stacked ? 0.34 : 0.28, 190, 120);
  const plotH = stageHeight(w, stacked ? 0.46 : 0.38, 260, 160);
  const gridBox = React.useMemo(() => boxFor(w - 16, gridH), [w, gridH]);
  const plotBoxM = React.useMemo(() => boxFor(w - 16, plotH), [w, plotH]);

  const advance = () => setElapsed((e) => Math.min(SPAN, Math.round((e + 1) * 100) / 100));

  // Evidence: the second half-life has been run, so "a quarter is left" is on
  // screen and the card is a diagnosis rather than a spoiler.
  const evidence = elapsed >= 2;

  return (
    <div className="flex flex-col gap-3">
      {/* Predict gate FIRST, and above the graph — "commit before you look" only
          works if the question is above the thing you must not look at yet. */}
      {elapsed >= 1 && elapsed < 2 && predictChoice === null && (
        <PredictGate
          prompt={`One half-life has run and about half are gone. **After the SECOND half-life, how many of the original ${Math.round(population)} are left?**`}
          options={[
            'None — two half-lives is the whole lifetime',
            `About ${Math.round(population / 4)} — a quarter`,
            `About ${Math.round(population / 2)} — it stops halving`,
            'Impossible to say, it is random',
          ]}
          answerIndex={1}
          reveal={
            'A quarter. Each half-life halves whatever is STILL THERE, not the original amount — so the '
            + 'survivors after n half-lives are (1/2)ⁿ of the start, and (1/2)ⁿ is never zero.'
          }
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      {/* ══ the population grid ═════════════════════════════════════════════ */}
      <div
        className="overflow-hidden rounded-2xl p-2"
        style={{ background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}
      >
        <Canvas box={gridBox} label={`${Math.round(population)} nuclei; ${aliveNow} have not yet decayed.`}>
          <NucleiGrid box={gridBox} deadBy={deadBy} now={elapsed} />
        </Canvas>
      </div>

      <Legend rows={[
        { color: ACCENT, dot: true, label: 'not yet decayed', value: `${aliveNow}` },
        { color: TEXT.muted, dot: true, label: 'decayed', value: `${Math.round(population) - aliveNow}` },
        { color: ACCENT_B, label: 'time elapsed', value: `${fixed(elapsed, 2)} half-lives` },
      ]} />

      {/* ══ the two curves ══════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden rounded-2xl p-2"
        style={{ background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}
      >
        <Canvas box={plotBoxM} label="The counted survivors against the exponential law, over six half-lives.">
          <DecayPlot
            box={plotBoxM}
            smooth={smooth}
            steps={run.steps}
            n0={Math.round(population)}
            now={elapsed}
            span={SPAN}
            showActivity={showActivity}
          />
        </Canvas>
        <TickStrip
          box={plotBoxM}
          ticks={ticks(0, SPAN, 6)}
          unit="half-lives"
        />
      </div>

      <Legend rows={[
        { color: ACCENT, dashed: true, label: 'the law, N = N₀e^(−λt)' },
        { color: ACCENT_B, label: 'the counted survivors — noisy, and it does not care' },
        ...(showActivity ? [{ color: TEXT.secondary, dashed: true, label: 'activity A = λN, same shape' }] : []),
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          accent={ACCENT_B}
          disabled={elapsed >= SPAN || (elapsed >= 1 && elapsed < 2 && predictChoice === null)}
          onClick={advance}
        >
          {elapsed === 0 ? 'Run one half-life'
            : elapsed >= SPAN ? 'Six half-lives done' : `Run half-life number ${Math.round(elapsed) + 1}`}
        </ActionButton>
        {elapsed > 0 && (
          <ActionButton onClick={() => { setElapsed(0); setPredictChoice(null); }}>Reset the sample</ActionButton>
        )}
        <Toggle on={showActivity} label="Show activity A = λN" onClick={() => setShowActivity((v) => !v)} accent={ACCENT_B} />
      </div>

      {elapsed >= 2 && (
        <Card tone="second">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT_B }}>
            The halving table — and it never reaches zero
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const reached = elapsed >= n;
              return (
                <span
                  key={n}
                  className="text-[12px] tabular-nums"
                  style={{ color: reached ? TEXT.primary : TEXT.muted, fontWeight: reached ? 700 : 500 }}
                >
                  {n} → {fixed(fractionAfterHalfLives(n) * 100, n >= 5 ? 3 : 2)}%
                  {reached && <span style={{ color: ACCENT_B }}> ({Math.round(population * fractionAfterHalfLives(n))})</span>}
                </span>
              );
            })}
          </div>
          <p className="mt-2 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
            Your run reached half at <b className="tabular-nums">{fixed(measuredHalfLife(run) ?? 0, 3)}</b>{' '}
            half-lives, which is a measurement of a random process and so it is not exactly 1.000. The
            largest gap between the count and the law across the whole run was{' '}
            <b className="tabular-nums">{fixed(worstDeviationInSigmas(run), 2)}</b> standard deviations —
            noise, behaving like noise.
          </p>
        </Card>
      )}

      <Readout
        rows={[
          { label: 'nuclide', value: `${pretty(nuc)} — ${nuc.decay ?? 'unstable'}`, color: ACCENT },
          { label: 'half-life t½', value: prettyHalfLife(nuc.halfLife), color: ACCENT },
          { label: 'decay constant λ = ln2/t½', value: si(lambda, '/s') },
          { label: 'mean lifetime τ = 1/λ', value: prettyHalfLife(meanLifetime(nuc.halfLife ?? 1)) },
          { label: `nuclei in ${fixed(grams, 1)} g`, value: si(state.n0, '') },
          { label: 'fraction still there', value: `${fixed(state.fractionRemaining * 100, 3)}%`, color: ACCENT_B, strong: true },
          { label: 'activity A = λN', value: si(state.activityBq, 'Bq'), color: ACCENT_B, strong: true },
          { label: 'the same activity in curies', value: `${fixed(state.activityCi, 2)} Ci` },
        ]}
        footnote={`τ is LONGER than t½ by 1/ln2 = 1.4427 — a distinction worth marks. And note what λ is not: it is a probability per second, so a nucleus that has already survived ${fixed(elapsed, 1)} half-lives faces exactly the same λ as a fresh one.`}
      />

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>Sample</span>
          <div className="flex flex-wrap gap-1.5">
            {IDS.map((x) => (
              <Chip
                key={x}
                label={x}
                colour={x === id ? ACCENT_B : ACCENT}
                dim={x !== id}
                onClick={() => { setId(x); setElapsed(0); setPredictChoice(null); }}
                title={`${x}: ${prettyHalfLife(nuclide(x).halfLife)}`}
              />
            ))}
          </div>
        </div>
        <Slider
          label="Nuclei drawn"
          value={Math.round(population)}
          min={100}
          max={900}
          step={100}
          onChange={(v) => { setPopulation(v); setElapsed(0); setPredictChoice(null); }}
          format={(v) => String(Math.round(v))}
        />
        <Slider
          label="Sample mass"
          value={grams}
          min={0.1}
          max={10}
          step={0.1}
          unit="g"
          accent={ACCENT_B}
          onChange={setGrams}
          format={(v) => v.toFixed(1)}
        />
      </div>

      {evidence && <AttackCard code={arch.targets} />}

      <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
        Read the law backwards and it dates things: a fraction f left means{' '}
        <b className="tabular-nums">−log₂ f</b> half-lives have passed. A wood sample with a quarter of its
        carbon-14 is <b className="tabular-nums">{fixed(halfLivesElapsed(0.25), 0)}</b> half-lives old —{' '}
        {prettyHalfLife(halfLivesElapsed(0.25) * (nuclide('C-14').halfLife ?? 0))}. Same equation, one
        rearrangement.
      </p>
    </div>
  );
}

// ── The grid ─────────────────────────────────────────────────────────────────

/** ZERO `<text>`. Alive dots in the primary accent, decayed ones dimmed to the
 *  muted tier — which is the WCAG AA floor, not below it (tokens.ts). */
function NucleiGrid({ box, deadBy, now }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  deadBy: number[];
  now: number;
}) {
  const { x, y, w, h } = box.rect;
  const g = decayGrid(deadBy.length, w, h);
  const ox = x + (w - g.used.w) / 2;
  const oy = y + (h - g.used.h) / 2;

  return (
    <g>
      {deadBy.map((t, i) => {
        const col = i % g.cols;
        const row = Math.floor(i / g.cols);
        const alive = t > now;
        return (
          <circle
            key={i}
            cx={ox + (col + 0.5) * g.cell}
            cy={oy + (row + 0.5) * g.cell}
            r={alive ? g.dot : g.dot * 0.55}
            fill={alive ? ACCENT : TEXT.muted}
            opacity={alive ? 1 : 0.9}
          />
        );
      })}
    </g>
  );
}

// ── The two curves ───────────────────────────────────────────────────────────

function DecayPlot({ box, smooth, steps, n0, now, span, showActivity }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  smooth: { halfLives: number; remaining: number }[];
  steps: { halfLives: number; alive: number }[];
  n0: number;
  now: number;
  span: number;
  showActivity: boolean;
}) {
  const { x, y, w, h } = box.rect;
  const px = axis(0, span, x, x + w);
  const py = axis(0, n0, y + h, y);

  const smoothPath = smooth
    .map((p, i) => `${i ? 'L' : 'M'}${px(p.halfLives).toFixed(1)},${py(p.remaining).toFixed(1)}`)
    .join(' ');

  // Only the part of the run the student has actually reached is drawn. Drawing
  // the whole run at t = 0 would hand over every answer before the first press.
  const reached = steps.filter((s) => s.halfLives <= now + 1e-9);
  const countPath = reached
    .map((p, i) => `${i ? 'L' : 'M'}${px(p.halfLives).toFixed(1)},${py(p.alive).toFixed(1)}`)
    .join(' ');

  const gridY = [0.25, 0.5, 0.75, 1].map((f) => py(f * n0));
  const gridX = ticks(0, span, 6).map(px);

  return (
    <g>
      <Axes box={box} gridY={gridY} gridX={gridX} />

      {/* Halving guides at 1/2, 1/4, 1/8 — the numbers the lesson turns on. */}
      {[1, 2, 3].map((n) => (
        <line
          key={n}
          x1={x} y1={py(n0 * Math.pow(0.5, n))} x2={px(n)} y2={py(n0 * Math.pow(0.5, n))}
          stroke={accentTint(ACCENT_B, 0.35)} strokeWidth={1} strokeDasharray="2 3"
        />
      ))}

      <path d={smoothPath} fill="none" stroke={ACCENT} strokeWidth={1.8} strokeDasharray="6 4" opacity={0.85} />
      {showActivity && (
        <path d={smoothPath} fill="none" stroke={TEXT.secondary} strokeWidth={1.2} strokeDasharray="2 3" opacity={0.7} />
      )}
      {reached.length > 1 && <path d={countPath} fill="none" stroke={ACCENT_B} strokeWidth={2.4} />}

      {reached.length > 0 && (
        <circle
          cx={px(now)}
          cy={py(reached[reached.length - 1].alive)}
          r={Math.max(3, Math.min(5, Math.min(box.width, box.height) * 0.014))}
          fill={ACCENT_B}
        />
      )}
    </g>
  );
}
