'use client';

/*
 * motion-lab/waves/WaveStudio.tsx — the waves flagship.
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 8: "Wave Studio (superposition, beats,
 * standing waves, string harmonics) — a standing wave is two travelling waves,
 * made visible by splitting them apart."
 *
 * ── THE INVISIBLE MIDDLE STEP, AND HOW IT IS KEPT HONEST ────────────────────
 * The split toggle is the whole build. Every curve on this canvas is drawn from
 * `standing()` in `lib/wave.ts`, which returns the right-runner, the left-runner
 * and their point-by-point sum on ONE shared x grid. The sum is not a separate
 * closed-form curve that happens to look like the total — it is `yRight[i] +
 * yLeft[i]`, and `verify-motion-phase2.mjs` asserts it equals 2A sin(kx)cos(ωt)
 * to 1e-12 and that the marked nodes fall at exactly λ/2 spacing.
 *
 * That matters because the classic way to fake this lesson is to draw the
 * standing pattern from the product formula and then paint two decorative
 * travelling waves beside it. The student then has to take the connection on
 * trust — which is exactly what they could already do from the textbook.
 *
 * The nodes are the same argument: `nodePositions()` reads its answer off
 * sin(kx) = 0, i.e. off the sum. Nothing is drawn on afterwards.
 *
 * ── FOUR ARCHETYPES, ONE CANVAS ─────────────────────────────────────────────
 * Superposition, beats, the standing split and string harmonics are all "plot
 * two things and their sum". Beats plots against TIME rather than distance
 * (that is the only real difference, and the sim says so out loud); harmonics
 * is the standing split with the wavelength forced to 2L/n by the clamps.
 * Building them as four components would have produced four subtly different
 * pictures of the same idea.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { WavesArchetype } from './types';
import * as W from './lib/wave';
import { makePlot, polyline, px, py, type Plot } from './lib/plot';
import { resolveParams, num, bool, controlDefs, bagKey } from './lib/resolve';
import { useAnimationFrame } from '../../simulations/_shared';
import { PlotFrame, Span } from './svgparts';
import {
  LabFrame, Card, Toggle, ActionButton, Readout, NumericPanel, Segmented,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT,
  clamp, f1, f2, f3, type LegendRow, type ReadoutRow,
} from './ui';

const MAX_STAGE = 3;

type Mode = 'superposition' | 'beats' | 'standing' | 'harmonics';

const modeOf = (id: string): Mode =>
  id === 'beats' ? 'beats'
  : id === 'string-harmonics' ? 'harmonics'
  : id === 'standing-wave-split' ? 'standing'
  : 'superposition';

export default function WaveStudio({ block, arch }: { block: MotionBenchBlock; arch: WavesArchetype }) {
  const mode = modeOf(arch.id);
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);

  const [split, setSplit] = useState(() => bool(authored, 'split', false));
  const [showComponents, setShowComponents] = useState(() => bool(authored, 'show_components', true));
  const [markNodes, setMarkNodes] = useState(() => bool(authored, 'mark_nodes', true));
  const [showEnvelope, setShowEnvelope] = useState(() => bool(authored, 'show_envelope', true));
  const [allModes, setAllModes] = useState(() => bool(authored, 'show_all_modes', false));

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setStep(guided ? 0 : MAX_STAGE + 1);
    setPlaying(false); setT(0);
    setSplit(bool(authored, 'split', false));
  }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);   // NEVER true on mount
  const [slow, setSlow] = useState(false);
  const [everRan, setEverRan] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((dt) => setT((prev) => prev + dt * (slow ? 0.25 : 1)), { enabled: playing, target: wrapRef });

  // ── derived physics ───────────────────────────────────────────────────────
  const stringSpeed = W.stringWaveSpeed(c.tension, c.mu);
  const harmonicF = W.harmonicFrequency(c.harmonic, stringSpeed, c.length);
  const harmonicL = W.harmonicWavelength(c.harmonic, c.length);

  // Everything is one `standing()` call: two counter-runners plus their sum on a
  // shared grid. Harmonics is the same call with λ pinned by the clamps.
  const xMax = mode === 'harmonics' ? c.length : c.wavelength * 3;
  const lambda = mode === 'harmonics' ? harmonicL : c.wavelength;
  const freq = mode === 'harmonics' ? Math.min(harmonicF, 3) : c.frequency;
  const A = c.amplitude;

  const split3 = useMemo(
    () => W.standing(A, lambda, freq, xMax, t, 400),
    [A, lambda, freq, xMax, t]
  );

  const nodes = useMemo(() => W.nodePositions(lambda, xMax), [lambda, xMax]);
  const antinodes = useMemo(() => W.antinodePositions(lambda, xMax), [lambda, xMax]);

  const beats = useMemo(
    () => (mode === 'beats' ? W.beatSamples(A, c.f1, c.f2, beatWindow(c.f1, c.f2), 900) : []),
    [mode, A, c.f1, c.f2]
  );
  const beatF = W.beatFrequency(c.f1, c.f2);

  const modeShapes = useMemo(() => {
    if (mode !== 'harmonics' || !allModes) return [];
    return [1, 2, 3, 4].map((n) => ({
      n,
      pts: W.harmonicShape(n, A * 0.55, c.length, stringSpeed, t, 240),
    }));
  }, [mode, allModes, A, c.length, stringSpeed, t]);

  // ── the misconception, gated on its own evidence ──────────────────────────
  const ready = misconceptionReady(arch.targets, { stage, everRan, split, t, beatF, harmonic: c.harmonic });

  // ── legend ────────────────────────────────────────────────────────────────
  const legend: LegendRow[] = [];
  if (mode === 'beats') {
    legend.push({ color: ACCENT, label: `Tone 1 — ${f1(c.f1)} Hz` });
    legend.push({ color: ACCENT_2, label: `Tone 2 — ${f1(c.f2)} Hz` });
    legend.push({ color: 'rgba(226,232,240,0.9)', label: 'What the ear receives (the sum)', strong: true });
    if (showEnvelope && stage >= 2) legend.push({ color: 'rgba(255,255,255,0.55)', dashed: true, label: 'Envelope — 2A cos(πΔf t)' });
  } else {
    if (showComponents || split) {
      legend.push({ color: ACCENT, label: 'Running right →' });
      legend.push({ color: ACCENT_2, label: '← Running left' });
    }
    legend.push({ color: 'rgba(226,232,240,0.9)', label: 'Their sum, point by point', strong: true });
    if (markNodes && stage >= 3 && mode !== 'superposition') {
      legend.push({ color: 'rgba(226,232,240,0.95)', label: `Nodes of the sum — ${nodes.length}, spaced ${f2(lambda / 2)} m` });
    }
  }

  // ── readouts ──────────────────────────────────────────────────────────────
  const readout: ReadoutRow[] =
    mode === 'beats'
      ? [
          { label: 'Beat frequency |f₁ − f₂|', value: `${f2(beatF)} Hz`, color: ACCENT, strong: true },
          { label: 'Envelope repeat rate', value: `${f2(W.envelopeFrequency(c.f1, c.f2))} Hz`, color: ACCENT_2 },
          { label: 'Pitch you hear (mean)', value: `${f2(W.carrierFrequency(c.f1, c.f2))} Hz` },
          { label: 'Loud moments in this window', value: `${f1(beatF * beatWindow(c.f1, c.f2))}` },
        ]
      : mode === 'harmonics'
        ? [
            { label: `f${c.harmonic} = n·v/2L`, value: `${f2(harmonicF)} Hz`, color: ACCENT, strong: true },
            { label: 'Wave speed √(T/μ)', value: `${f1(stringSpeed)} m/s`, color: ACCENT_2 },
            { label: `λ${c.harmonic} = 2L/n`, value: `${f2(harmonicL)} m` },
            { label: 'Fundamental f₁', value: `${f2(W.harmonicFrequency(1, stringSpeed, c.length))} Hz` },
            { label: 'Half-loops on the string', value: `${c.harmonic}` },
            { label: 'Nodes (ends included)', value: `${c.harmonic + 1}` },
          ]
        : [
            { label: 'Wavelength λ', value: `${f2(lambda)} m`, color: ACCENT, strong: true },
            { label: 'Frequency f', value: `${f2(freq)} Hz`, color: ACCENT_2 },
            { label: 'Wave speed v = fλ', value: `${f2(W.waveSpeed(freq, lambda))} m/s` },
            { label: 'Amplitude of each wave', value: `${f2(A)} cm` },
            { label: 'Sum amplitude at an antinode', value: `${f2(2 * A)} cm` },
            ...(mode === 'standing'
              ? [{ label: 'Node spacing', value: `${f2(lambda / 2)} m = λ/2`, color: ACCENT_2 }]
              : []),
          ];

  const aspect = 2.3;

  return (
    <div ref={wrapRef}>
      <LabFrame
        title={block.title ?? arch.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · wave studio`}
        badge={<span className="tabular-nums">{`t = ${f2(t)} s`}</span>}
        guided={guided ? {
          steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
          onAdvance: () => setStep((s) => s + 1),
        } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        canvasAspect={aspect}
        maxCanvasHeight={400}
        renderCanvas={(w, h) =>
          mode === 'beats'
            ? <BeatsCanvas w={w} h={h} samples={beats} amp={A} showEnvelope={showEnvelope && stage >= 2}
                showComponents={showComponents && stage >= 1} tNow={t} window={beatWindow(c.f1, c.f2)} />
            : <WaveCanvas
                w={w} h={h} data={split3} amp={A} xMax={xMax}
                split={split && stage >= 1}
                showComponents={(showComponents || split) && stage >= 1}
                nodes={markNodes && stage >= 3 && mode !== 'superposition' ? nodes : []}
                antinodes={markNodes && stage >= 3 && mode === 'standing' ? antinodes : []}
                clamps={mode === 'harmonics'}
                extraModes={modeShapes}
              />
        }
        legend={legend}
        belowCanvas={
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={() => { setPlaying((p) => !p); setEverRan(true); }} disabled={stage < MAX_STAGE}>
              {playing ? '❚❚ Pause' : t > 0 ? '▶ Continue' : '▶ Set them running'}
            </ActionButton>
            <ActionButton accent={ACCENT_2} onClick={() => { setPlaying(false); setT(0); }} disabled={stage < MAX_STAGE}>
              ↺ Reset the clock
            </ActionButton>
            {mode !== 'beats' && (
              <Toggle on={split} label="pull the two waves apart" accent={ACCENT_2}
                onClick={() => { setSplit((s) => !s); setEverRan(true); }} disabled={stage < 1} />
            )}
            <Toggle on={slow} label="slow motion" onClick={() => setSlow((s) => !s)} />
          </div>
        }
        controls={
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Set it up</SectionLabel>
            {mode === 'harmonics' && (
              <>
                <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
                  Pick which harmonic to look at — the string can only do these.
                </p>
                <Segmented
                  value={String(c.harmonic)}
                  options={[1, 2, 3, 4, 5, 6].map((n) => ({ key: String(n), label: `n = ${n}` }))}
                  onChange={(k) => { setC((prev) => ({ ...prev, harmonic: parseInt(k, 10) })); setT(0); }}
                />
              </>
            )}
            {defs.map((d) => d.kind === 'number' && d.key !== 'harmonic' ? (
              <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 0.01} unit={d.unit ?? ''}
                accent={d.key === 'f2' || d.key === 'mu' || d.key === 'wave_amplitude' ? ACCENT_2 : ACCENT}
                format={(v) => ((d.step ?? 1) < 0.01 ? v.toFixed(3) : (d.step ?? 1) < 0.1 ? v.toFixed(2) : v.toFixed(1))}
                onChange={(v) => { setC((prev) => ({ ...prev, [d.key]: v })); }} />
            ) : null)}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {defs.some((d) => d.key === 'show_components') && (
                <Toggle on={showComponents} label="show the two waves separately"
                  onClick={() => setShowComponents((v) => !v)} />
              )}
              {defs.some((d) => d.key === 'mark_nodes') && (
                <Toggle on={markNodes} label="mark the nodes the sum produces" accent={ACCENT_2}
                  onClick={() => setMarkNodes((v) => !v)} />
              )}
              {defs.some((d) => d.key === 'show_envelope') && (
                <Toggle on={showEnvelope} label="draw the envelope" accent={ACCENT_2}
                  onClick={() => setShowEnvelope((v) => !v)} />
              )}
              {defs.some((d) => d.key === 'show_all_modes') && (
                <Toggle on={allModes} label="show the first four modes together"
                  onClick={() => setAllModes((v) => !v)} />
              )}
            </div>
          </div>
        }
        panels={
          <>
            <Readout rows={readout} footnote={
              mode === 'beats'
                ? 'Plotted against TIME — this is what one point of the medium does, not a snapshot of space.'
                : 'The sum is added point by point from the two curves above it. Nothing here is drawn from the product formula.'
            } />
            {mode === 'standing' && stage >= 3 && (
              <Card tone="plain">
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  Neighbouring nodes are <b style={{ color: ACCENT_2 }}>{f3(lambda / 2)} m</b> apart
                  {' '}and each antinode sits exactly halfway between two of them, {f3(lambda / 4)} m from either.
                  That is how a resonance tube measures the speed of sound: find two nodes, double the gap, multiply by f.
                </p>
              </Card>
            )}
            {mode === 'beats' && stage >= 2 && (
              <Card tone="plain">
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  The envelope crosses zero <b style={{ color: ACCENT }}>twice</b> per one of its own cycles — once
                  going down, once coming back up. Loudness does not care about the sign, so you hear{' '}
                  <b style={{ color: ACCENT }}>{f2(beatF)}</b> surges a second, not {f2(beatF / 2)}.
                </p>
              </Card>
            )}
            {block.numeric && (
              <NumericPanel prompt={block.numeric.prompt} answer={block.numeric.answer}
                tolerance={block.numeric.tolerance} unit={block.numeric.unit}
                reveal={block.numeric.worked_reveal} />
            )}
          </>
        }
        misconception={ready ? { belief: arch.attacks.belief, attack: arch.attacks.attack } : null}
        tip={arch.tip}
        caption={block.caption}
      />
    </div>
  );
}

// ── controls ─────────────────────────────────────────────────────────────────

interface Controls {
  amplitude: number; wavelength: number; frequency: number;
  f1: number; f2: number;
  length: number; tension: number; mu: number; harmonic: number;
}

const readControls = (b: ReturnType<typeof resolveParams>): Controls => ({
  amplitude: num(b, 'wave_amplitude', 1),
  wavelength: num(b, 'wavelength', 2),
  frequency: num(b, 'frequency', 0.8),
  f1: num(b, 'f1', 5),
  f2: num(b, 'f2', 6),
  length: num(b, 'length', 4),
  tension: num(b, 'tension', 100),
  mu: num(b, 'mu', 0.01),
  harmonic: num(b, 'harmonic', 1),
});

const numberOf = (c: Controls, key: string): number => {
  if (key === 'wave_amplitude') return c.amplitude;
  return (c as unknown as Record<string, number>)[key] ?? 0;
};

/** Enough time to hold three or four full beat cycles, so the throb is visible
 *  as a repeat rather than as one lump. */
const beatWindow = (f1: number, f2: number): number => {
  const df = Math.abs(f1 - f2);
  return df > 1e-6 ? clamp(3.5 / df, 0.5, 12) : 4;
};

// ── canvases (zero <text> — §4E) ─────────────────────────────────────────────

function WaveCanvas({ w, h, data, amp, xMax, split, showComponents, nodes, antinodes, clamps, extraModes }: {
  w: number; h: number; data: W.StandingSplit; amp: number; xMax: number;
  split: boolean; showComponents: boolean;
  nodes: number[]; antinodes: number[]; clamps: boolean;
  extraModes: { n: number; pts: W.StandingSplit }[];
}) {
  // Split view stacks three lanes; joined view overlays them in one.
  const lanes = split ? 3 : 1;
  const laneH = h / lanes;
  const yWindow = amp * (split ? 1.5 : 2.6);

  const lane = (i: number): Plot =>
    makePlot(w, laneH, { xMin: 0, xMax, yMin: -yWindow, yMax: yWindow },
      { l: 16, r: 16, t: 10 + i * laneH, b: laneH - (laneH - 10) + (lanes - 1 - i) * laneH }, 0.02);

  // A lane's plot has to write into the full-height viewBox, so the padding
  // trick above is fiddly; build the transform directly instead.
  const laneY = (i: number, v: number): number =>
    i * laneH + laneH / 2 - (v / yWindow) * (laneH / 2 - 12);
  const laneX = (x: number): number => 16 + (x / xMax) * (w - 32);
  const path = (ys: number[], i: number): string =>
    data.xs.map((x, k) => `${k ? 'L' : 'M'}${laneX(x).toFixed(1)},${laneY(i, ys[k]).toFixed(1)}`).join('');

  const sumLane = split ? 2 : 0;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={{ display: 'block' }}>
      {/* baselines, one per lane */}
      {Array.from({ length: lanes }, (_, i) => (
        <line key={`b${i}`} x1={laneX(0)} y1={laneY(i, 0)} x2={laneX(xMax)} y2={laneY(i, 0)}
          stroke="rgba(255,255,255,0.16)" strokeWidth={1} strokeDasharray="4 5" />
      ))}

      {/* the clamped ends of a string */}
      {clamps && (
        <g style={{ pointerEvents: 'none' }}>
          <line x1={laneX(0)} y1={laneY(sumLane, -yWindow * 0.7)} x2={laneX(0)} y2={laneY(sumLane, yWindow * 0.7)}
            stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
          <line x1={laneX(xMax)} y1={laneY(sumLane, -yWindow * 0.7)} x2={laneX(xMax)} y2={laneY(sumLane, yWindow * 0.7)}
            stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
        </g>
      )}

      {/* the other three modes, ghosted behind */}
      {extraModes.map((m) => (
        <path key={m.n}
          d={m.pts.xs.map((x, k) => `${k ? 'L' : 'M'}${laneX(x).toFixed(1)},${laneY(sumLane, m.pts.ySum[k]).toFixed(1)}`).join('')}
          fill="none" stroke={ACCENT_2} strokeWidth={1.4} opacity={0.32} />
      ))}

      {/* the two counter-runners */}
      {showComponents && (
        <>
          <path d={path(data.yRight, split ? 0 : 0)} fill="none" stroke={ACCENT} strokeWidth={2}
            opacity={split ? 0.95 : 0.5} />
          <path d={path(data.yLeft, split ? 1 : 0)} fill="none" stroke={ACCENT_2} strokeWidth={2}
            opacity={split ? 0.95 : 0.5} />
        </>
      )}

      {/* their sum */}
      <path d={path(data.ySum, sumLane)} fill="none" stroke="rgba(226,232,240,0.95)" strokeWidth={2.6} />

      {/* nodes and antinodes — read off the sum, never drawn on */}
      {/* Nodes belong to the SUM, so they are drawn in the sum's own white —
          not a third hue. They are positions read off sin(kx) = 0, never a
          decorative overlay. */}
      {nodes.map((x) => (
        <circle key={`n${x.toFixed(3)}`} cx={laneX(x)} cy={laneY(sumLane, 0)} r={4.5}
          fill="rgba(226,232,240,0.95)" stroke="rgba(13,17,23,0.9)" strokeWidth={1.5} />
      ))}
      {antinodes.map((x) => (
        <line key={`a${x.toFixed(3)}`} x1={laneX(x)} y1={laneY(sumLane, -2 * amp)} x2={laneX(x)} y2={laneY(sumLane, 2 * amp)}
          stroke={ACCENT_2} strokeWidth={1} strokeDasharray="3 5" opacity={0.6} />
      ))}
      {nodes.length > 1 && (
        <Span x1={laneX(nodes[0])} x2={laneX(nodes[1])} y={laneY(sumLane, -yWindow * 0.72)}
          color="rgba(226,232,240,0.8)" />
      )}
    </svg>
  );
}

function BeatsCanvas({ w, h, samples, amp, showEnvelope, showComponents, tNow, window: win }: {
  w: number; h: number; samples: W.BeatSample[]; amp: number;
  showEnvelope: boolean; showComponents: boolean; tNow: number; window: number;
}) {
  const plot = makePlot(w, h, { xMin: 0, xMax: win, yMin: -2.4 * amp, yMax: 2.4 * amp },
    { l: 18, r: 18, t: 14, b: 18 }, 0.02);
  const asPts = (pick: (s: W.BeatSample) => number) => samples.map((s) => ({ x: s.t, y: pick(s) }));
  const cur = tNow % Math.max(win, 1e-6);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={{ display: 'block' }}>
      <PlotFrame plot={plot} xTicks={6} yTicks={4} />
      {showComponents && (
        <>
          <path d={polyline(plot, asPts((s) => s.y1))} fill="none" stroke={ACCENT} strokeWidth={1.4} opacity={0.5} />
          <path d={polyline(plot, asPts((s) => s.y2))} fill="none" stroke={ACCENT_2} strokeWidth={1.4} opacity={0.5} />
        </>
      )}
      {/* The envelope is a REFERENCE curve, so it is white-dashed — the same
          convention the projectile module uses for its vacuum ghost. Two accents
          total on this canvas, never three. */}
      {showEnvelope && (
        <>
          <path d={polyline(plot, asPts((s) => s.envelope))} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.8} strokeDasharray="6 4" />
          <path d={polyline(plot, asPts((s) => -s.envelope))} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.8} strokeDasharray="6 4" />
        </>
      )}
      <path d={polyline(plot, asPts((s) => s.sum))} fill="none" stroke="rgba(226,232,240,0.95)" strokeWidth={2} />
      <line x1={px(plot, cur)} y1={py(plot, plot.yMax)} x2={px(plot, cur)} y2={py(plot, plot.yMin)}
        stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
    </svg>
  );
}

// ── evidence gates ───────────────────────────────────────────────────────────

function misconceptionReady(code: string, x: {
  stage: number; everRan: boolean; split: boolean; t: number; beatF: number; harmonic: number;
}): boolean {
  switch (code) {
    // The two pulses have to have crossed and come out again.
    case 'waves_destroy_each_other':
      return x.everRan && x.t > 0.9;
    // The throb has to have been counted at least once.
    case 'beat_frequency_is_half_the_difference':
      return x.everRan && x.beatF > 0 && x.t > 1 / Math.max(x.beatF, 0.2);
    // The split is the evidence. No split, no card.
    case 'standing_wave_is_a_single_wave':
      return x.split && x.stage >= 1;
    // Climbing off the fundamental is what makes the ladder visible.
    case 'string_pitch_depends_on_length_only':
      return x.stage >= MAX_STAGE && (x.harmonic > 1 || x.everRan);
    default:
      return x.stage >= MAX_STAGE && x.everRan;
  }
}
