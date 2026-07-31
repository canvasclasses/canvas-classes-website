'use client';

/*
 * optics-bench/wave/WaveBench.tsx — where the ray model runs out (mode 'wave').
 * ─────────────────────────────────────────────────────────────────────────────
 * No tracing happens here, on purpose. A sim that "bends" rays round a slit
 * teaches that diffraction is a kind of refraction, and that belief survives to
 * the exam hall. So this component draws the RAY MODEL'S PREDICTION as a dashed
 * outline, and the real intensity from `lib/wave.ts` beside it. The gap between
 * them is the content.
 *
 * ONE <text> on the canvas, as everywhere in this engine — the fringe spacing.
 * Everything else is in the legend and readouts.
 */

import * as React from 'react';
import type { OpticsBenchBlock } from '@canvas/data/types/books';
import { resolveArchetype, defaultParams, type OpticsArchetypeEx } from '../archetypes';
import {
  centralMaxHalfWidth, fringeWidth, intensityProfile, missingOrders, suggestedSpan,
  type WaveSpec,
} from '../lib/wave';
import { wavelengthCSS, colourName } from '../lib/spectral';
import {
  SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TEXT, TYPE, BORDER,
} from '../../simulations/_shared';
import InlineMarkdown from '../../InlineMarkdown';
import {
  Card, GuidedPanel, Legend, Pill, ProbeGate, Readouts, cm, sig, type LegendItem, type Row,
} from '../ui/parts';
import { GLASS, LIGHT, SIM_CANVAS, AXIS } from '../ui/theme';
import { isNarrow, stageHeight, useStageWidth } from '../ui/useStageWidth';

type Params = Record<string, number | string | boolean>;

const num = (p: Params, k: string, d: number): number => {
  const v = p[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
};

export default function WaveBench({ block }: { block: OpticsBenchBlock }) {
  const arch: OpticsArchetypeEx = React.useMemo(
    () => resolveArchetype(block.archetype, block.mode),
    [block.archetype, block.mode],
  );
  const blockParamsKey = JSON.stringify(block.params ?? {});

  const [params, setParams] = React.useState<Params>(() => ({
    ...defaultParams(arch), ...(block.params ?? {}),
  }));
  React.useEffect(() => {
    setParams({ ...defaultParams(arch), ...(JSON.parse(blockParamsKey) as Params) });
  }, [arch, blockParamsKey]);

  const [step, setStep] = React.useState(0);
  const [probePick, setProbePick] = React.useState<number | null>(null);
  const [stageRef, stageWidth] = useStageWidth<HTMLDivElement>();
  const narrow = isNarrow(stageWidth);

  const single = arch.id === 'single-slit';
  const spec: WaveSpec = React.useMemo(() => ({
    lambda: num(params, 'lambda', 600),
    d: single ? 0 : num(params, 'd', 0.5),
    a: num(params, 'a', single ? 0.15 : 0.1),
    D: num(params, 'D', single ? 120 : 100),
    slits: single ? 1 : Math.round(num(params, 'slits', 2)),
  }), [params, single]);

  const span = React.useMemo(() => suggestedSpan(spec), [spec]);
  const profile = React.useMemo(() => intensityProfile(spec, span, 601), [spec, span]);

  const steps = block.steps?.length ? block.steps : (arch.defaultSteps ?? []);
  const guided = block.guided !== false && steps.length > 0;
  const total = Math.max(1, steps.length);
  const n = guided ? step : Infinity;
  const at = (want: number) => n >= Math.min(want, total);
  const showReal = at(1);
  const showRayModel = num(params, 'compare', 1) !== 0;

  const probe = arch.probe;
  const probeDue = !!probe && guided && step >= probe.afterStep;

  // ── Canvas geometry ───────────────────────────────────────────────────────
  const W = narrow ? Math.max(240, stageWidth - 8) : Math.max(320, Math.round(stageWidth * 0.58) - 12);
  const H = stageHeight(stageWidth, 900, narrow ? 560 : 430, narrow ? 300 : 420, 240);
  const padL = 10, padR = 10, padT = 26, padB = 26;
  const plotW = Math.max(40, W - padL - padR);
  const bandH = Math.max(38, H * 0.26);
  const plotH = Math.max(40, H - padT - padB - bandH - 12);

  const xOf = (y: number) => padL + ((y + span) / (2 * span)) * plotW;
  const yOf = (I: number) => padT + bandH + 12 + plotH * (1 - I);

  const curve = React.useMemo(() => {
    let d = '';
    for (let i = 0; i < profile.length; i++) {
      const p = profile[i];
      d += `${i === 0 ? 'M' : 'L'} ${xOf(p.y).toFixed(2)} ${yOf(p.intensity).toFixed(2)} `;
    }
    return d;
  }, [profile, span, plotW, plotH, padL, padT, bandH]);

  const colour = wavelengthCSS(spec.lambda);   // sim-lint-ok — wavelength-accurate spectral colour: a 450 nm pattern drawn amber is a lie about what the student would see.

  const beta = fringeWidth(spec);
  const halfCentral = centralMaxHalfWidth(spec);
  const missing = missingOrders(spec);

  const rows: Row[] = single
    ? [
      { label: 'Central maximum', value: `${sig(2 * halfCentral, 2)} mm wide`, strong: true, colour: LIGHT,
        note: '2λD/a — the slit width is on the BOTTOM, so narrowing the slit widens the band.' },
      { label: 'Ray-model prediction', value: `${sig(spec.a, 3)} mm wide`, colour: GLASS,
        note: `A sharp-edged strip the width of the slit. The real band is ${sig((2 * halfCentral) / spec.a, 0)}× wider than that.` },
      { label: 'First minimum at', value: `${sig(halfCentral, 2)} mm`, colour: TEXT.primary,
        note: 'a sinθ = λ — the edge of the central band, where the slit splits into two halves that cancel in pairs.' },
    ]
    : [
      { label: 'Fringe width β', value: `${sig(beta, 3)} mm`, strong: true, colour: LIGHT,
        note: 'β = λD/d. Every fringe spacing you can produce comes out of this one combination — nothing else about the apparatus matters.' },
      { label: 'Ray-model prediction', value: 'two bright lines', colour: GLASS,
        note: 'One behind each slit, and dark everywhere else — including the centre of the screen, which is the brightest place on it.' },
      { label: 'Envelope half-width', value: spec.a > 0 ? `${sig(halfCentral, 2)} mm` : '—', colour: TEXT.primary,
        note: spec.a > 0 ? 'The single-slit diffraction of each slit, modulating the whole pattern.' : undefined },
    ];
  if (missing.length) {
    rows.push({
      label: 'Missing orders', value: missing.join(', '), colour: LIGHT,
      note: `d/a = ${sig(spec.d / spec.a, 2)}, so an envelope minimum lands exactly on an interference maximum. Those fringes are simply absent — which is the proof that both effects are happening at once.`,
    });
  }

  const legend: LegendItem[] = [
    { name: `${colourName(spec.lambda)} ${spec.lambda.toFixed(0)} nm`, colour, glyph: 'ray' },
    { name: 'Measured intensity', colour, glyph: 'ray' },
  ];
  if (showRayModel) legend.push({ name: 'What a ray model predicts', colour: GLASS, glyph: 'dashed' });

  const status = showReal
    ? (single ? `CENTRAL BAND ${sig(2 * halfCentral, 2)} mm` : `β = ${sig(beta, 3)} mm`)
    : 'RAY MODEL';

  return (
    <SimShell>
      <SimHeader
        title={arch.title.split('—')[0].trim()}
        subtitle={arch.summary}
        accent={LIGHT}
        badge={arch.targets ? <Pill tone="info">{arch.targets.replace(/_/g, ' ')}</Pill> : undefined}
      />

      {guided && (
        <StepBar
          accent={LIGHT}
          steps={steps.map((s, i) => ({ id: String(i), label: `${i + 1}` }))}
          currentId={String(Math.min(step, steps.length - 1))}
          onGo={(id) => setStep(Number(id))}
        />
      )}

      <div ref={stageRef} className={narrow ? 'flex flex-col gap-4' : 'grid gap-4'}
        style={narrow ? undefined : { gridTemplateColumns: '1.35fr 1fr' }}>
        <div className="flex flex-col gap-3">
          <svg
            width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
            role="img" aria-label="Fringe pattern and intensity profile"
            style={{ background: SIM_CANVAS, borderRadius: 12, display: 'block' }}
          >
            {/* The screen, painted with the real intensity. */}
            <rect x={padL} y={padT} width={plotW} height={bandH} rx={4} fill="#050505" />
            {showReal && profile.map((p, i) => {
              if (i % 2) return null;
              const x = xOf(p.y);
              const wPx = (plotW / profile.length) * 2 + 0.6;
              return (
                <rect
                  key={p.y}
                  x={x - wPx / 2} y={padT} width={wPx} height={bandH}
                  // sim-lint-ok — wavelength-accurate spectral colour. The whole
                  // point of the band is that it looks like what you would see.
                  fill={wavelengthCSS(spec.lambda, Math.max(0, Math.min(1, p.intensity)))}
                />
              );
            })}
            {/* The ray model's prediction, dashed, on the same screen. */}
            {showRayModel && (single ? (
              <rect
                x={xOf(-spec.a / 2)} y={padT} width={Math.max(1.5, xOf(spec.a / 2) - xOf(-spec.a / 2))}
                height={bandH} fill="none" stroke={GLASS} strokeWidth={1.4} strokeDasharray="4 3"
              />
            ) : (
              <g stroke={GLASS} strokeWidth={1.4} strokeDasharray="4 3" fill="none">
                <rect x={xOf(-spec.d / 2) - 1} y={padT} width={2.5} height={bandH} />
                <rect x={xOf(spec.d / 2) - 1} y={padT} width={2.5} height={bandH} />
              </g>
            ))}

            {/* Intensity profile. */}
            <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={AXIS} strokeWidth={1} />
            <line x1={xOf(0)} y1={yOf(0)} x2={xOf(0)} y2={yOf(1)} stroke={AXIS} strokeWidth={1} strokeDasharray="4 4" />
            {showReal && <path d={curve} fill="none" stroke={colour} strokeWidth={2} strokeLinejoin="round" />}

            {/* THE ONE TEXT ELEMENT. */}
            <text
              x={12} y={18} fill={TEXT.primary} fontSize={12} fontWeight={700}
              style={{ letterSpacing: '0.04em' }} stroke={SIM_CANVAS} strokeWidth={3}
              paintOrder="stroke"
            >
              {status}
            </text>
          </svg>
          <Legend items={legend} />
          <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
            The strip at the top is the screen as your eye would see it. The curve below is the same thing
            measured — intensity against position, across ±{sig(span, 1)} mm.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {guided && steps[Math.min(step, steps.length - 1)] && (
            <GuidedPanel
              step={step}
              total={steps.length}
              say={steps[Math.min(step, steps.length - 1)].say}
              cta={steps[Math.min(step, steps.length - 1)].cta}
              onNext={() => setStep((s) => Math.min(s + 1, steps.length))}
              onBack={() => setStep((s) => Math.max(0, s - 1))}
              done={step >= steps.length}
              accent={LIGHT}
            />
          )}

          {probeDue && probe && (
            <ProbeGate spec={probe} picked={probePick} onPick={setProbePick} accent={LIGHT} />
          )}

          <Readouts rows={rows} title="The numbers" />

          <Card>
            <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>Set the scene</div>
            <div className="flex flex-col gap-1">
              {(arch.params ?? []).map((p) => {
                const value = params[p.key];
                if (p.kind === 'boolean') {
                  return (
                    <div key={p.key} className="flex items-center justify-between gap-2 py-1" style={{ minHeight: 44 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: LIGHT }}>{p.label}</span>
                      <button
                        type="button"
                        onClick={() => setParams((q) => ({ ...q, [p.key]: !value }))}
                        style={{
                          minHeight: 44, minWidth: 76, touchAction: 'manipulation',
                          background: value ? 'rgba(252,211,77,0.16)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${value ? 'rgba(252,211,77,0.4)' : BORDER.card}`,
                          color: value ? LIGHT : TEXT.secondary,
                        }}
                        className="rounded-lg px-3 text-xs font-semibold"
                      >
                        {value ? 'Shown' : 'Hidden'}
                      </button>
                    </div>
                  );
                }
                if (p.kind === 'select') return null;
                return (
                  <SimSlider
                    key={p.key}
                    label={p.label}
                    accent={LIGHT}
                    value={typeof value === 'number' ? value : Number(p.default)}
                    min={p.min ?? 0}
                    max={p.max ?? 100}
                    step={p.step ?? 1}
                    unit={p.unit ?? ''}
                    onChange={(v) => setParams((q) => ({ ...q, [p.key]: v }))}
                  />
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {block.caption && (
        <p className="mt-4 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{block.caption}</InlineMarkdown>
        </p>
      )}

      <ExpertTip accent={LIGHT}>
        Ray optics is not wrong here — it is a limit. Every result on this screen collapses back to the
        ray-model prediction as the aperture grows past a few thousand wavelengths, which is why a lens
        bench never needs any of it, and why a slit always does.
      </ExpertTip>
    </SimShell>
  );
}

export { cm };
