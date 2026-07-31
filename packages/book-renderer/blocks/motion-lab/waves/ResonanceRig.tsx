'use client';

/*
 * motion-lab/waves/ResonanceRig.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 8: "Resonance Rig (drive frequency
 * sweep, amplitude response curve) — damping decides the peak height."
 *
 * ── THE CURVE IS MEASURED, NOT DRAWN ────────────────────────────────────────
 * The response curve starts EMPTY. Every point on it is deposited by the
 * student visiting that drive frequency and reading the rig's steady-state
 * amplitude — so the curve is a record of an experiment they ran, not a figure
 * they were handed. The smooth theoretical curve is available on a toggle
 * AFTER at least eight points exist, which is the moment it stops being a
 * spoiler and becomes a confirmation.
 *
 * That ordering is the whole design. The Phase-1 audit's blunt verdict on the
 * inert surfaces was "a paragraph per machine that gives away the discovery
 * before the student has moved anything"; a resonance curve printed on arrival
 * is exactly that failure in graph form.
 *
 * ── TWO LANES, ONE SVG ──────────────────────────────────────────────────────
 * Top: the rig itself — a driver shaking a spring-mass at ω_drive, with the
 * mass responding at the steady-state amplitude and lagging by the phase δ.
 * Bottom: the response curve. One SVG so the marker under the rig and the
 * marker on the curve are guaranteed to be the same frequency in pixels, not
 * approximately.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { WavesArchetype } from './types';
import * as S from './lib/shm';
import { makePlot, polyline, px, py, type Plot } from './lib/plot';
import { resolveParams, num, bool, controlDefs, bagKey } from './lib/resolve';
import { useAnimationFrame } from '../../simulations/_shared';
import { Spring, Hatch, PlotFrame } from './svgparts';
import {
  LabFrame, Card, Toggle, ActionButton, Readout, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, BORDER, accentTint,
  clamp, f1, f2, f3, type LegendRow, type ReadoutRow,
} from './ui';

const MAX_STAGE = 3;
/** Points needed before the smooth curve may be revealed. */
const CURVE_UNLOCK = 8;

export default function ResonanceRig({ block, arch }: { block: MotionBenchBlock; arch: WavesArchetype }) {
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);
  const [compare, setCompare] = useState(() => bool(authored, 'compare_damping', true));
  const [showCurve, setShowCurve] = useState(false);

  /** Frequencies the student has actually visited, and what the rig read there. */
  const [measured, setMeasured] = useState<{ omega: number; amplitude: number }[]>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setMeasured([]); setShowCurve(false); }, [seed]);

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setStep(guided ? 0 : MAX_STAGE + 1); setPlaying(false); setT(0); }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);   // NEVER true on mount
  const [everRan, setEverRan] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((dt) => setT((prev) => prev + dt), { enabled: playing, target: wrapRef });

  // ── the physics ───────────────────────────────────────────────────────────
  const drive: S.DriveSpec = { omega0: c.omega0, gamma: c.gamma, drive: c.drive };
  const driveHalf: S.DriveSpec = { ...drive, gamma: c.gamma / 2 };
  const amp = S.drivenAmplitude(drive, c.omegaDrive);
  const lag = S.drivenPhaseLag(drive, c.omegaDrive);
  const omegaRes = S.resonantOmega(drive);
  const peakAmp = omegaRes > 0 ? S.drivenAmplitude(drive, omegaRes) : S.drivenAmplitude(drive, 0);

  const omegaMax = Math.max(c.omega0 * 2.2, c.omegaDrive * 1.15, 2);
  const theory = useMemo(() => S.responseCurve(drive, omegaMax, 180), [drive.omega0, drive.gamma, drive.drive, omegaMax]); // eslint-disable-line react-hooks/exhaustive-deps
  const theoryHalf = useMemo(() => S.responseCurve(driveHalf, omegaMax, 180), [driveHalf.omega0, driveHalf.gamma, driveHalf.drive, omegaMax]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Record a reading whenever the student settles on a new drive frequency. */
  const record = () => {
    setMeasured((prev) => {
      if (prev.some((p) => Math.abs(p.omega - c.omegaDrive) < 1e-6)) return prev;
      return [...prev, { omega: c.omegaDrive, amplitude: amp }].sort((a, b) => a.omega - b.omega);
    });
    setEverRan(true);
  };

  const yMax = Math.max(
    peakAmp * 1.1,
    ...measured.map((m) => m.amplitude),
    compare && showCurve ? S.drivenAmplitude(driveHalf, S.resonantOmega(driveHalf) || 0) * 1.1 : 0,
    0.2
  );

  const ready = measured.length >= 4 && everRan;

  const legend: LegendRow[] = [
    { color: ACCENT, label: `Your readings — ${measured.length} taken`, strong: true },
    ...(showCurve ? [{ color: ACCENT, dashed: true, label: `Theory at γ = ${f2(c.gamma)}` }] : []),
    ...(showCurve && compare ? [{ color: ACCENT_2, dashed: true, label: `Half the damping, γ = ${f2(c.gamma / 2)}` }] : []),
    { color: 'rgba(255,255,255,0.5)', label: 'Where you are driving now' },
  ];

  const readout: ReadoutRow[] = [
    { label: 'Steady-state amplitude', value: `${f3(amp)} m`, color: ACCENT, strong: true },
    { label: 'Drive frequency', value: `${f2(c.omegaDrive)} rad/s` },
    { label: 'Natural frequency ω₀', value: `${f2(c.omega0)} rad/s`, color: ACCENT_2 },
    { label: 'Peak sits at √(ω₀²−2γ²)', value: omegaRes > 0 ? `${f2(omegaRes)} rad/s` : 'no peak — over-damped' },
    { label: 'Peak amplitude', value: `${f3(peakAmp)} m` },
    { label: 'Response lags the drive by', value: `${f1((lag * 180) / Math.PI)}°` },
  ];

  return (
    <div ref={wrapRef}>
      <LabFrame
        title={block.title ?? arch.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · resonance rig`}
        badge={<span className="tabular-nums">{`A = ${f3(amp)} m`}</span>}
        guided={guided ? {
          steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
          onAdvance: () => setStep((s) => s + 1),
        } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        canvasAspect={1.55}
        maxCanvasHeight={430}
        renderCanvas={(w, h) => (
          <RigCanvas
            w={w} h={h} t={t} amp={amp} lag={lag} omegaDrive={c.omegaDrive} drive={c.drive}
            measured={measured} theory={showCurve && stage >= 2 ? theory : []}
            theoryHalf={showCurve && compare && stage >= 2 ? theoryHalf : []}
            omegaMax={omegaMax} yMax={yMax} showRig={stage >= 1}
          />
        )}
        legend={legend}
        belowCanvas={
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={() => { setPlaying((p) => !p); setEverRan(true); }} disabled={stage < MAX_STAGE}>
              {playing ? '❚❚ Pause the driver' : '▶ Start the driver'}
            </ActionButton>
            <ActionButton accent={ACCENT_2} onClick={record} disabled={stage < 1}>
              ✚ Record this frequency
            </ActionButton>
            <ActionButton accent={ACCENT_2} onClick={() => { setMeasured([]); setShowCurve(false); }} disabled={!measured.length}>
              ↺ Clear the readings
            </ActionButton>
            <Toggle
              on={showCurve}
              label={measured.length >= CURVE_UNLOCK ? 'join the dots' : `join the dots (${measured.length}/${CURVE_UNLOCK})`}
              disabled={measured.length < CURVE_UNLOCK}
              onClick={() => setShowCurve((v) => !v)}
            />
          </div>
        }
        controls={
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Sweep the driver</SectionLabel>
            <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
              Move the drive frequency, let the rig settle, then press “Record this frequency”. The curve is yours to build —
              it is not printed for you.
            </p>
            {defs.map((d) => d.kind === 'number' ? (
              <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 0.05} unit={d.unit ?? ''}
                accent={d.key === 'gamma' ? ACCENT_2 : ACCENT}
                format={(v) => v.toFixed(2)}
                onChange={(v) => {
                  setC((prev) => ({ ...prev, [d.key]: v }));
                  // Changing the SYSTEM invalidates readings taken on the old
                  // one — silently keeping them would build a curve that is not
                  // the curve of anything.
                  if (d.key !== 'omega_drive') { setMeasured([]); setShowCurve(false); }
                }} />
            ) : null)}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {defs.some((d) => d.key === 'compare_damping') && (
                <Toggle on={compare} label="ghost a second damping value" accent={ACCENT_2}
                  onClick={() => setCompare((v) => !v)} />
              )}
            </div>
          </div>
        }
        panels={
          <>
            <Readout rows={readout} footnote="Amplitudes are the STEADY state — the value the rig settles to after the transient has died away." />
            {measured.length > 0 && measured.length < CURVE_UNLOCK && (
              <Card>
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  {measured.length} of {CURVE_UNLOCK} readings. Take them either side of ω₀ = {f2(c.omega0)} rad/s —
                  the interesting part of the curve is narrow, and a sweep that skips over it misses the whole effect.
                </p>
              </Card>
            )}
            {showCurve && compare && (
              <Card tone="accent">
                <SectionLabel accent={ACCENT}>What damping actually changes</SectionLabel>
                <div className="mt-2 flex flex-col gap-1">
                  <Line label={`Peak at γ = ${f2(c.gamma)}`} value={`${f3(peakAmp)} m`} color={ACCENT} />
                  <Line label={`Peak at γ = ${f2(c.gamma / 2)}`}
                    value={`${f3(S.drivenAmplitude(driveHalf, S.resonantOmega(driveHalf) || c.omega0))} m`} color={ACCENT_2} />
                  <Line label="Peak POSITION moved by"
                    value={`${f3(Math.abs((S.resonantOmega(driveHalf) || 0) - (omegaRes || 0)))} rad/s`} color={TEXT.primary} />
                </div>
                <p className="mt-2 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                  Halving γ roughly doubles the height and barely moves the position. Damping sets how bad resonance gets;
                  ω₀ sets where it happens.
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

function Line({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[12px]" style={{ color: TEXT.secondary }}>{label}</span>
      <span className="tabular-nums text-[14px] font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

interface Controls { omega0: number; gamma: number; drive: number; omegaDrive: number }

const readControls = (b: ReturnType<typeof resolveParams>): Controls => ({
  omega0: num(b, 'omega0', 4),
  gamma: num(b, 'gamma', 0.4),
  drive: num(b, 'drive', 1),
  omegaDrive: num(b, 'omega_drive', 3),
});

const numberOf = (c: Controls, key: string): number => {
  if (key === 'omega_drive') return c.omegaDrive;
  return (c as unknown as Record<string, number>)[key] ?? 0;
};

// ── the canvas: rig on top, curve below, one SVG (zero <text>) ───────────────

function RigCanvas({ w, h, t, amp, lag, omegaDrive, drive, measured, theory, theoryHalf, omegaMax, yMax, showRig }: {
  w: number; h: number; t: number; amp: number; lag: number; omegaDrive: number; drive: number;
  measured: { omega: number; amplitude: number }[];
  theory: { omega: number; amplitude: number }[];
  theoryHalf: { omega: number; amplitude: number }[];
  omegaMax: number; yMax: number; showRig: boolean;
}) {
  const rigH = h * 0.38;
  const plotH = h - rigH;
  const plot: Plot = makePlot(w, plotH, { xMin: 0, xMax: omegaMax, yMin: 0, yMax },
    { l: 22, r: 18, t: 12, b: 20 }, 0.04);
  const shift = (yv: number) => yv + rigH;

  // The rig. The driver's own displacement is the reference; the mass responds
  // at `amp` and LAGS by `lag`, which is why the two are drawn side by side.
  const midY = rigH * 0.55;
  const driverX = w * 0.14 + Math.cos(omegaDrive * t) * Math.min(18, drive * 12);
  const pxPerM = Math.min(w * 0.3 / Math.max(yMax, 1e-6), 900);
  const massX = w * 0.56 + amp * pxPerM * Math.cos(omegaDrive * t - lag);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={{ display: 'block' }}>
      {showRig && (
        <g style={{ pointerEvents: 'none' }}>
          <Hatch x={w * 0.05} y={midY - 26} len={52} angleDeg={90} color="rgba(255,255,255,0.35)" teeth={5} />
          {/* the driver rod */}
          <line x1={w * 0.05} y1={midY} x2={driverX} y2={midY} stroke={ACCENT_2} strokeWidth={3} />
          <circle cx={driverX} cy={midY} r={7} fill={accentTint(ACCENT_2, 0.5)} stroke={ACCENT_2} strokeWidth={2} />
          {/* the spring and the mass */}
          <Spring x1={driverX} y1={midY} x2={massX - 15} y2={midY} color={ACCENT} coils={12} amp={7} />
          <rect x={massX - 15} y={midY - 15} width={30} height={30} rx={4}
            fill={accentTint(ACCENT, 0.4)} stroke={ACCENT} strokeWidth={2.5} />
          {/* equilibrium reference, so the swing is measured against something */}
          <line x1={w * 0.56} y1={midY - 26} x2={w * 0.56} y2={midY + 26}
            stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4 4" />
          {/* the swing extent, so a big amplitude reads as big */}
          <line x1={w * 0.56 - amp * pxPerM} y1={midY + 30} x2={w * 0.56 + amp * pxPerM} y2={midY + 30}
            stroke={ACCENT} strokeWidth={2} opacity={0.6} />
        </g>
      )}

      <line x1={0} y1={rigH} x2={w} y2={rigH} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />

      <g transform={`translate(0,${rigH})`}>
        <PlotFrame plot={plot} xTicks={6} yTicks={4} zeroLine={false} />
        {theoryHalf.length > 0 && (
          <path d={polyline(plot, theoryHalf.map((q) => ({ x: q.omega, y: Math.min(q.amplitude, yMax * 1.6) })))}
            fill="none" stroke={ACCENT_2} strokeWidth={2} strokeDasharray="6 4" opacity={0.85} />
        )}
        {theory.length > 0 && (
          <path d={polyline(plot, theory.map((q) => ({ x: q.omega, y: Math.min(q.amplitude, yMax * 1.6) })))}
            fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="6 4" opacity={0.85} />
        )}
        {measured.map((m) => (
          <circle key={m.omega.toFixed(4)} cx={px(plot, m.omega)} cy={py(plot, Math.min(m.amplitude, yMax))}
            r={4.5} fill={ACCENT} stroke="rgba(255,255,255,0.85)" strokeWidth={1.2} />
        ))}
        <line x1={px(plot, omegaDrive)} y1={py(plot, plot.yMax)} x2={px(plot, omegaDrive)} y2={py(plot, plot.yMin)}
          stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <circle cx={px(plot, omegaDrive)} cy={py(plot, Math.min(amp, yMax))} r={6}
          fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2} />
      </g>
      {/* `shift` keeps the two lanes in one coordinate story even though the
          plot is translated — kept explicit so a future lane insertion cannot
          silently desynchronise the marker from the rig. */}
      <line x1={px(plot, omegaDrive)} y1={shift(0) - rigH} x2={px(plot, omegaDrive)} y2={rigH}
        stroke="rgba(255,255,255,0.0)" strokeWidth={0} />
    </svg>
  );
}
