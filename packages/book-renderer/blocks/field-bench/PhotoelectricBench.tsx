'use client';

/*
 * field-bench/PhotoelectricBench.tsx — the two knobs.
 * ─────────────────────────────────────────────────────────────────────────────
 * Brightness and colour, side by side, with a live I–V curve and a "pin this
 * curve" button so the student compares TWO settings rather than remembering
 * the last one. That comparison is the whole experiment: turning the brightness
 * up raises the plateau and leaves the zero crossing exactly where it was;
 * changing the colour moves the crossing and leaves the plateau alone.
 *
 * ── Guided, never auto-playing ──────────────────────────────────────────────
 * The lamp starts OFF. Nothing on the graph moves until the student presses
 * something, and the panel says what is about to happen first.
 *
 * ── What is exact and what is modelled ──────────────────────────────────────
 * Threshold, KE_max, stopping potential and saturation current are exact
 * (`lib/photoelectric.ts`). The SHAPE of the retarding branch assumes a uniform
 * spread of emission energies; where it reaches zero — the only number a
 * student reads off it — is exactly −V₀ regardless. The UI says so rather than
 * letting a modelled curve pass as a measured one.
 */

import { useEffect, useMemo, useState } from 'react';
import type { FieldBenchBlock } from '@canvas/data/types/books';
import { getFieldArchetype } from './archetypes';
import { resolveScene, sceneKey } from './lib/scene';
import {
  photoelectric, ivCurve, stoppingPotential, WORK_FUNCTIONS, STOPPING_SLOPE,
  type IVPoint,
} from './lib/photoelectric';
import { issueFor } from './lib/misconceptions';
import { si, fixed } from './lib/format';
import { IVCurve, PlotKey } from './charts';
import {
  ACCENT_B, Card, Legend, Readout, GuidedPanel, MisconceptionCard, ModelNote,
  Slider, Choice, ActionButton, Pill, type ReadoutRow,
} from './ui';
import { useStageWidth, isNarrow } from './useStageWidth';
import {
  SimShell, SimHeader, SectionLabel, ACCENT, TEXT, OK, BAD, SIM_CANVAS_BG, accentTint,
} from '../simulations/_shared';

const workFunctionOf = (name: string): number =>
  WORK_FUNCTIONS.find((w) => w.name === name)?.ev ?? 2.75;

export default function PhotoelectricBench({ block }: { block: FieldBenchBlock }) {
  const arch = getFieldArchetype(block.archetype);
  const key = sceneKey(block);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resolved = useMemo(() => resolveScene(block, arch), [key]);

  const [params, setParams] = useState(resolved.params);
  const [step, setStep] = useState(0);
  const [lampOn, setLampOn] = useState(false);
  const [pinned, setPinned] = useState<{ curve: IVPoint[]; label: string } | null>(null);
  const [touchedBoth, setTouchedBoth] = useState({ intensity: false, frequency: false });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setParams(resolved.params);
    setStep(0);
    setLampOn(false);
    setPinned(null);
    setTouchedBoth({ intensity: false, frequency: false });
  }, [key]);

  const metal = String(params.metal ?? 'Sodium');
  const freqHz = Number(params.frequency ?? 8) * 1e14;
  const intensity = Number(params.intensity ?? 1);
  const phi = workFunctionOf(metal);

  const setup = { workFunctionEV: phi, frequencyHz: freqHz, intensityWm2: lampOn ? intensity : 0 };
  const result = useMemo(() => photoelectric(setup), [phi, freqHz, intensity, lampOn]);

  const vSpan = Math.max(1.2, stoppingPotential(16e14, phi) * 1.1);
  const curve = useMemo(
    () => ivCurve(setup, -vSpan, vSpan * 0.6, 160),
    [phi, freqHz, intensity, lampOn, vSpan],
  );

  const guided = resolved.guided && resolved.steps.length > 0;
  const done = !guided || step >= resolved.steps.length;

  const [wrapRef, wrapW] = useStageWidth<HTMLDivElement>();
  const stacked = isNarrow(wrapW);

  const setParam = (k: string, v: number | string) => {
    setParams((p) => ({ ...p, [k]: v }));
    if (k === 'intensity') setTouchedBoth((t) => ({ ...t, intensity: true }));
    if (k === 'frequency') setTouchedBoth((t) => ({ ...t, frequency: true }));
  };

  // Evidence for `potential_is_potential_energy`: the student has read a
  // stopping potential AND seen the energy beside it. Never before.
  const issue = issueFor(arch?.targets);
  const evidence = lampOn && result.emits && (touchedBoth.intensity || touchedBoth.frequency);

  const readout: ReadoutRow[] = [
    { label: 'photon energy hf', value: `${fixed(result.photonEnergyEV, 2)} eV`, color: ACCENT },
    { label: 'work function φ', value: `${fixed(phi, 2)} eV`, color: ACCENT_B },
    { label: 'threshold frequency', value: si(result.thresholdHz, 'Hz') },
    {
      label: 'max kinetic energy',
      value: result.emits ? `${fixed(result.kMaxEV, 2)} eV` : 'nothing comes out',
      color: result.emits ? OK : BAD, // sim-lint-ok — OK/BAD are the pass/fail pair
      strong: true,
    },
    {
      label: 'stopping potential V₀',
      value: result.emits ? `${fixed(result.stoppingVoltage, 2)} V` : '0 V',
      color: ACCENT_B, strong: true,
    },
    { label: 'saturation current', value: si(result.saturationCurrentA, 'A'), color: ACCENT },
    { label: 'photons per second', value: si(result.photonRate, '/s') },
  ];

  const intro = (
    <div className="flex flex-col gap-3">
      {guided && !done ? (
        <GuidedPanel steps={resolved.steps} index={step} done={false}
          onAdvance={() => { setLampOn(true); setStep(step + 1); }} />
      ) : (
        <Card tone="accent">
          <div className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>{resolved.summary}</div>
        </Card>
      )}
      {evidence && issue && <MisconceptionCard issue={issue} />}
    </div>
  );

  return (
    <SimShell>
      <SimHeader
        title={resolved.title}
        subtitle="photoelectric · field bench"
        badge={<span className="tabular-nums">{lampOn ? (result.emits ? 'emitting' : 'nothing emitted') : 'lamp off'}</span>}
      />

      <div
        ref={wrapRef}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_5fr] lg:items-start"
        style={wrapW > 0
          ? { gridTemplateColumns: stacked ? 'minmax(0,1fr)' : 'minmax(0,7fr) minmax(0,5fr)', alignItems: stacked ? 'stretch' : 'start' }
          : undefined}
      >
        {/* ══ the graph ══════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {stacked && intro}

          <div className="overflow-hidden rounded-2xl p-3"
            style={{ background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}>
            <IVCurve
              live={curve}
              pinned={pinned?.curve ?? null}
              stopping={result.emits ? result.stoppingVoltage : 0}
              saturation={result.saturationCurrentA}
            />
          </div>

          <PlotKey items={[
            { color: ACCENT, text: 'current now — its height is set by BRIGHTNESS' },
            { color: ACCENT_B, text: `stops at −V₀ — its position is set by COLOUR${result.emits ? ` (now ${fixed(result.stoppingVoltage, 2)} V)` : ''}` },
            ...(pinned ? [{ color: TEXT.ghost, text: `pinned: ${pinned.label}` }] : []),
          ]} />

          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={() => setLampOn((v) => !v)}>
              {lampOn ? 'Switch the lamp off' : 'Switch the lamp on'}
            </ActionButton>
            <ActionButton accent={ACCENT_B} disabled={!lampOn}
              onClick={() => setPinned({ curve, label: `${metal}, ${fixed(freqHz / 1e14, 1)}×10¹⁴ Hz, ${fixed(intensity, 1)} W/m²` })}>
              Pin this curve
            </ActionButton>
            {pinned && (
              <ActionButton accent={ACCENT_B} onClick={() => setPinned(null)}>Clear the pin</ActionButton>
            )}
            {lampOn && !result.emits && <Pill tone="bad">below threshold — no current at any brightness</Pill>}
          </div>

          <Legend rows={[
            { color: ACCENT, label: 'live curve' },
            { color: TEXT.ghost, dashed: true, label: 'pinned curve, for comparison' },
            { color: ACCENT_B, dashed: true, label: 'stopping potential −V₀' },
          ]} />
        </div>

        {/* ══ sidebar ════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {!stacked && intro}

          <Readout rows={readout} footnote="eV₀ = KE_max. Same fact, two different quantities — one in volts, one in joules." />

          <div className="flex flex-col gap-2.5">
            <SectionLabel>Set the experiment</SectionLabel>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>Cathode metal</span>
              <Choice options={WORK_FUNCTIONS.map((w) => w.name)} value={metal} onChange={(v) => setParam('metal', v)} />
            </div>
            <Slider label="Frequency" value={Number(params.frequency ?? 8)} min={3} max={16} step={0.1}
              unit="×10¹⁴ Hz" onChange={(v) => setParam('frequency', v)} format={(v) => v.toFixed(1)} />
            <Slider label="Brightness" value={intensity} min={0.2} max={5} step={0.1} unit="W/m²"
              accent={ACCENT_B} onChange={(v) => setParam('intensity', v)} format={(v) => v.toFixed(1)} />
          </div>

          <Card tone="second">
            <SectionLabel accent={ACCENT_B}>The graph Millikan used</SectionLabel>
            <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.secondary }}>
              Plot V₀ against frequency for any metal and the line has slope h/e ={' '}
              <b className="tabular-nums" style={{ color: ACCENT_B }}>{si(STOPPING_SLOPE, 'V·s')}</b>.
              Change the metal and the line shifts sideways; the slope does not move, because it is
              Planck&apos;s constant divided by the electron charge and has nothing to do with the metal.
            </p>
          </Card>

          <ModelNote>
            Threshold, maximum kinetic energy, stopping potential and saturation current are exact. The
            SHAPE of the left-hand branch assumes emitted electrons share out energies evenly — where it
            reaches zero is exactly −V₀ either way, and that is the only value read off it.
          </ModelNote>
        </div>
      </div>
    </SimShell>
  );
}
