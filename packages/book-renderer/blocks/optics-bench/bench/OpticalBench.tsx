'use client';

/*
 * optics-bench/bench/OpticalBench.tsx — the Optical Bench (mode 'bench').
 * ─────────────────────────────────────────────────────────────────────────────
 * Ten archetypes, one component, because they are all the same thing: a bench
 * of surfaces, a source, and a real trace through them.
 *
 * ── What this file is responsible for ────────────────────────────────────────
 * 1. GUIDED, NEVER AUTO-PLAYING. The panel says what is about to happen; the
 *    student presses; one layer appears. Nothing is drawn before it is said.
 * 2. THE FORMULA AND THE TRACE, SIDE BY SIDE. The readout prints the paraxial
 *    answer from `formula.ts` and the traced answer from `trace.ts` as two
 *    separate numbers. When they disagree it says so, and names the reason.
 *    Hiding that gap would be hiding spherical aberration.
 * 3. THE MISCONCEPTION WIRING. Two of them fire from something the student DID:
 *      • `half_lens_half_image` — a live card the moment they move the cover
 *        slider, comparing the image against the uncovered trace.
 *      • `image_needs_screen`  — a "put a screen at the image" button that only
 *        appears when the image is virtual, and then shows what lands on it.
 *    The rest fire through the archetype's `probe`, which is asked after the
 *    step that puts the evidence on screen and is locked until they commit.
 * 4. NOTHING IS KEYED ON BLOCK IDENTITY. The admin books-editor recreates the
 *    block object on every keystroke; a reference-keyed memo would re-seed the
 *    student's sliders continuously. Every memo here keys on primitives.
 */

import * as React from 'react';
import type { OpticsBenchBlock } from '@canvas/data/types/books';
import type { Bench, OpticalElement } from '../types';
import { resolveArchetype, defaultParams, type OpticsArchetypeEx } from '../archetypes';
import { traceBench } from '../lib/trace';
import { cartesianFocal, explainSign, isLens, isMirror, isPowered } from '../lib/convention';
import { mirrorImage, thinLensImage, dioptres } from '../lib/formula';
import { colourName, wavelengthCSS } from '../lib/spectral';
import {
  SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TEXT, TYPE, BORDER, OK, BAD,
} from '../../simulations/_shared';
import InlineMarkdown from '../../InlineMarkdown';
import BenchCanvas, { type CanvasLayers } from '../ui/BenchCanvas';
import {
  ActionButton, Card, GuidedPanel, Legend, MisconceptionCard, Pill, ProbeGate,
  Readouts, TraceNotes, cm, sig, type LegendItem, type Row,
} from '../ui/parts';
import { GLASS, LIGHT } from '../ui/theme';
import { isNarrow, stageHeight, useStageWidth } from '../ui/useStageWidth';

type Params = Record<string, number | string | boolean>;

const KIND_LABEL: Record<string, string> = {
  'thin-lens': 'Lens', 'thick-lens': 'Lens (real glass)',
  'mirror-spherical': 'Mirror', 'mirror-plane': 'Plane mirror',
  aperture: 'Stop', screen: 'Screen', prism: 'Prism', slab: 'Glass', eye: 'Eye', grating: 'Slits',
};

const glyphFor = (el: OpticalElement): LegendItem['glyph'] =>
  isLens(el.kind) || el.kind === 'eye' ? 'lens'
    : isMirror(el.kind) ? 'mirror'
      : el.kind === 'aperture' ? 'stop'
        : el.kind === 'screen' ? 'screen' : 'glass';

export default function OpticalBench({ block }: { block: OpticsBenchBlock }) {
  // Memo on the archetype ID, never on the block object — the editor recreates
  // the block on every keystroke.
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

  const steps = block.steps?.length ? block.steps : (arch.defaultSteps ?? []);
  const guided = block.guided !== false && steps.length > 0;
  const [step, setStep] = React.useState(0);
  const [probePick, setProbePick] = React.useState<number | null>(null);
  const [coverTouched, setCoverTouched] = React.useState(false);
  const [screenProbe, setScreenProbe] = React.useState(false);
  const [numericAnswer, setNumericAnswer] = React.useState('');
  const [numericChecked, setNumericChecked] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);

  const [stageRef, stageWidth] = useStageWidth<HTMLDivElement>();
  const narrow = isNarrow(stageWidth);

  // ── The bench, and the trace of it ────────────────────────────────────────
  const baseBench: Bench = React.useMemo(() => arch.build(params), [arch, params]);
  const bench: Bench = React.useMemo(() => {
    if (!screenProbe) return baseBench;
    // The student asked to catch a virtual image. Put a real screen exactly
    // where they said the image is, and trace what lands on it.
    const t = traceBench(baseBench, { realFan: true, rayCount: arch.rays });
    const at = t.finalImage?.x;
    if (at === null || at === undefined || !Number.isFinite(at)) return baseBench;
    return {
      ...baseBench,
      elements: [
        ...baseBench.elements,
        { id: 'PROBE-SCREEN', kind: 'screen', x: at, aperture: 5, label: 'Your screen' },
      ],
    };
  }, [baseBench, screenProbe, arch.rays]);

  const trace = React.useMemo(
    () => traceBench(bench, {
      realFan: block.show?.realFan !== false,
      constructionRays: !!arch.construction && block.show?.constructionRays !== false,
      dispersion: !!arch.dispersion,
      rayCount: arch.rays,
    }),
    [bench, arch.construction, arch.dispersion, arch.rays, block.show?.realFan, block.show?.constructionRays],
  );

  // The same bench with nothing covering the lens — the comparison that makes
  // the `half_lens_half_image` card evidence rather than an assertion.
  const uncoveredTrace = React.useMemo(() => {
    if (arch.id !== 'half-lens-covered') return null;
    return traceBench(arch.build({ ...params, cover: 0 }), { realFan: true, rayCount: arch.rays });
  }, [arch, params]);

  // ── Layers, clamped to this archetype's own step count ────────────────────
  const total = Math.max(1, steps.length);
  const n = guided ? step : Infinity;
  const at = (want: number) => n >= Math.min(want, total);
  const layers: CanvasLayers = {
    focalPoints: true,
    rays: at(1),
    image: at(2) && block.show?.image !== false,
    intermediates: at(2),
    construction: at(3) && !!arch.construction,
  };

  // ── The powered element and its two answers ───────────────────────────────
  const primary = bench.elements.find((e) => isPowered(e.kind)) ?? null;
  const src = bench.sources[0];
  const hasPowered = !!primary;

  const u = primary && src ? src.x - primary.x : null;
  const fCart = primary ? cartesianFocal(primary) : null;
  const formula = primary && u !== null && fCart !== null && Number.isFinite(fCart)
    ? (isMirror(primary.kind) ? mirrorImage(u, fCart) : thinLensImage(u, fCart))
    : null;

  const tracedV = trace.finalImage?.x != null && primary ? trace.finalImage.x - primary.x : null;
  const gapPct = formula?.v != null && tracedV != null && Math.abs(formula.v) > 1e-6
    ? Math.abs((tracedV - formula.v) / formula.v) * 100
    : null;

  // ── Readouts ──────────────────────────────────────────────────────────────
  const rows: Row[] = [];
  if (primary && u !== null && fCart !== null) {
    rows.push({
      label: 'Object distance u', value: cm(u), colour: LIGHT,
      note: explainSign('u', u, primary.kind),
    });
    rows.push({
      label: 'Focal length f', value: Number.isFinite(fCart) ? cm(fCart) : '∞', colour: GLASS,
      note: isMirror(primary.kind)
        ? `You typed ${Math.abs(primary.focalLength ?? 0).toFixed(1)} cm. ${explainSign('f', fCart, primary.kind)}`
        : `${sig(dioptres(fCart), 2)} D. ${explainSign('f', fCart, primary.kind)}`,
    });
  }
  if (formula?.v != null) {
    rows.push({ label: 'Image distance v — formula', value: cm(formula.v), strong: true, colour: TEXT.primary });
  }
  if (hasPowered && tracedV != null) {
    rows.push({
      label: 'Image distance v — traced', value: cm(tracedV), strong: true,
      colour: gapPct != null && gapPct > 0.5 ? BAD : OK,   // sim-lint-ok — pass/fail pair
      note: gapPct == null ? undefined
        : gapPct > 0.5
          ? `The rays land ${gapPct.toFixed(1)}% away from the formula's answer. That gap is SPHERICAL ABERRATION — the formula is paraxial and this cone is not. Narrow the lens and the gap closes.`
          : `Within ${gapPct.toFixed(2)}% of the formula. The tracer and the formula are the same physics.`,
    });
  }
  if (trace.finalImage) {
    const img = trace.finalImage;
    if (img.x === null) {
      rows.push({ label: 'Image', value: 'at infinity', colour: GLASS, note: 'The emergent rays are parallel — which is exactly where a telescope and a relaxed eye put the image.' });
    } else {
      rows.push({
        label: 'Magnification m', value: img.magnification == null ? '—' : sig(img.magnification, 3),
        colour: LIGHT,
        note: img.magnification == null ? undefined
          : `${Math.abs(img.magnification) > 1 ? 'Enlarged' : Math.abs(img.magnification) < 1 ? 'Diminished' : 'Same size'}, ${img.inverted ? 'inverted' : 'erect'}.`,
      });
      rows.push({
        label: 'Nature', value: img.real ? 'REAL' : 'VIRTUAL',
        colour: img.real ? OK : LIGHT,   // sim-lint-ok — pass/fail pair
        note: img.real
          ? 'Light actually converges there — a screen at that place would show it.'
          : 'No light goes there. The dashed lines are where the emergent rays only APPEAR to come from.',
      });
    }
  }

  // ── Legend ────────────────────────────────────────────────────────────────
  const legend: LegendItem[] = [];
  if (layers.rays) {
    if (arch.dispersion) {
      const seen = new Set<number>();
      for (const s of bench.sources) {
        const w = s.wavelength ?? 550;
        if (seen.has(w)) continue;
        seen.add(w);
        legend.push({
          name: `${colourName(w)} ${w.toFixed(0)} nm`,
          // sim-lint-ok — wavelength-accurate spectral colour: a dispersion
          // legend in two shades of one accent is a lie about the physics.
          colour: wavelengthCSS(w),
          glyph: 'ray',
        });
      }
    } else {
      legend.push({ name: 'Traced rays', colour: LIGHT, glyph: 'ray' });
      if (layers.construction) legend.push({ name: 'The three construction rays', colour: LIGHT, glyph: 'ray', note: 'drawn brighter' });
    }
    legend.push({ name: 'Virtual — no light here', colour: LIGHT, glyph: 'dashed' });
  }
  legend.push({ name: 'Object', colour: LIGHT, glyph: 'arrow' });
  if (layers.image && trace.finalImage?.x != null) legend.push({ name: 'Image', colour: LIGHT, glyph: 'arrow' });
  for (const el of bench.elements) {
    const f = cartesianFocal(el);
    legend.push({
      name: el.label ?? KIND_LABEL[el.kind] ?? el.kind,
      colour: GLASS,
      glyph: glyphFor(el),
      value: f !== null && Number.isFinite(f) && (isLens(el.kind) || el.kind === 'mirror-spherical')
        ? `f = ${f.toFixed(1)} cm` : undefined,
    });
  }

  // ── Misconception wiring, fired by what the student did ───────────────────
  const cover = typeof params.cover === 'number' ? params.cover : 0;
  const throughNow = trace.rays.filter((r) => r.terminated !== 'missed-element').length;
  const throughBefore = uncoveredTrace
    ? uncoveredTrace.rays.filter((r) => r.terminated !== 'missed-element').length
    : 0;
  const halfLensCard = arch.id === 'half-lens-covered' && coverTouched && cover > 5 && uncoveredTrace;

  const img = trace.finalImage;
  const virtualImage = !!img && img.x !== null && !img.real;
  const probeScreenHits = trace.events.filter(
    (e) => e.kind === 'absorbed' && e.elementId === 'PROBE-SCREEN',
  ).length;

  // ── Numeric check ─────────────────────────────────────────────────────────
  const numeric = block.numeric;
  const numericOk = numeric && numericChecked
    ? Math.abs(parseFloat(numericAnswer) - numeric.answer) <= (numeric.tolerance ?? 0.05)
    : false;

  const probe = arch.probe;
  const probeDue = !!probe && guided && step >= probe.afterStep;

  const stageH = stageHeight(stageWidth, 900, narrow ? 620 : 470, narrow ? 300 : 460, 240);
  const canvasW = narrow ? Math.max(240, stageWidth - 8) : Math.max(300, Math.round(stageWidth * 0.58) - 12);

  const status = React.useMemo(() => {
    if (!layers.image || !img) return undefined;
    if (img.x === null) return 'IMAGE AT INFINITY';
    const kind = img.real ? 'REAL' : 'VIRTUAL';
    const orient = img.inverted ? 'inverted' : 'erect';
    return `${kind} · ${orient}${img.magnification != null ? ` · ×${Math.abs(img.magnification).toFixed(2)}` : ''}`;
  }, [layers.image, img]);

  const setParam = (key: string, value: number | string | boolean) => {
    if (key === 'cover') setCoverTouched(true);
    setParams((p) => ({ ...p, [key]: value }));
  };

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
          <BenchCanvas
            bench={bench}
            trace={trace}
            width={canvasW}
            height={stageH}
            layers={layers}
            status={status}
            spectral={!!arch.dispersion}
            selectedElementId={selected}
            onSelectElement={setSelected}
            onDragObject={
              typeof params.u === 'number' && primary
                ? (p) => {
                  const min = arch.params?.find((q) => q.key === 'u')?.min ?? 1;
                  const max = arch.params?.find((q) => q.key === 'u')?.max ?? 80;
                  const next = Math.min(max, Math.max(min, primary.x - p.x));
                  setParams((q) => ({
                    ...q,
                    u: Math.round(next * 4) / 4,
                    ...(typeof q.h === 'number'
                      ? { h: Math.min(6, Math.max(0.3, Math.round(Math.abs(p.y) * 10) / 10)) }
                      : {}),
                  }));
                }
                : undefined
            }
          />
          <Legend items={legend} />
          <TraceNotes notes={trace.warnings} />
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

          {halfLensCard && (
            <MisconceptionCard
              heading="You covered the lens. Look at what changed."
              accent={LIGHT}
              body={
                `**${throughBefore - throughNow} of ${throughBefore}** rays are now stopped by the card — so the image is dimmer. `
                + `But its height is **${sig(uncoveredTrace!.finalImage?.y, 2)} cm** before and **${sig(img?.y, 2)} cm** now, `
                + `and it is still at **${cm(uncoveredTrace!.finalImage?.x)}** and **${cm(img?.x)}**. `
                + `Nothing is missing. Every point of the object sends a cone to the WHOLE lens, so blocking part of the lens `
                + `removes rays from every cone equally — the picture dims, and no part of it disappears.`
              }
            />
          )}

          {virtualImage && !screenProbe && (
            <Card accent={GLASS}>
              <p className="text-sm leading-snug mb-2.5" style={{ color: TEXT.primary }}>
                The image is <strong>virtual</strong>. Do you believe it? Put a screen exactly where the dashed
                lines meet and see what lands on it.
              </p>
              <ActionButton accent={GLASS} onClick={() => setScreenProbe(true)}>
                Put a screen at the image
              </ActionButton>
            </Card>
          )}

          {screenProbe && (
            <MisconceptionCard
              heading={probeScreenHits === 0 ? 'Nothing landed on it' : 'Look at what you actually did'}
              accent={LIGHT}
              body={
                probeScreenHits === 0
                  ? 'Not one ray reaches the screen. A virtual image is not a faint image or a hard-to-catch image — there is no light at that place at all. Your eye can still see it perfectly, because an eye works by receiving a diverging bundle and tracing it back, which is a completely different job from catching light on a card.'
                  : `The screen sits between the object and the lens, so all it has done is **block the light on its way in** — ${probeScreenHits} rays absorbed, and the image is gone entirely. You have not caught a virtual image; you have stopped the experiment. That is the honest answer to "why can't I catch it": there was never any light there to catch, and putting something there only removes light from somewhere else.`
              }
            />
          )}
          {screenProbe && (
            <ActionButton tone="ghost" onClick={() => setScreenProbe(false)}>Take the screen away</ActionButton>
          )}

          <Readouts rows={rows} title="The numbers" />

          {(arch.params?.length ?? 0) > 0 && (
            <Card>
              <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
                Set the scene
              </div>
              <div className="flex flex-col gap-1">
                {(arch.params ?? []).map((p) => {
                  const value = params[p.key];
                  if (p.kind === 'select') {
                    return (
                      <div key={p.key} className="flex items-center gap-2 flex-wrap py-1" style={{ minHeight: 44 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: LIGHT, minWidth: 92 }}>{p.label}</span>
                        {(p.options ?? []).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setParam(p.key, opt)}
                            style={{
                              minHeight: 44, touchAction: 'manipulation',
                              background: value === opt ? 'rgba(252,211,77,0.16)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${value === opt ? 'rgba(252,211,77,0.4)' : BORDER.card}`,
                              color: value === opt ? LIGHT : TEXT.secondary,
                            }}
                            className="rounded-lg px-3 text-xs font-semibold"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    );
                  }
                  if (p.kind === 'boolean') {
                    return (
                      <div key={p.key} className="flex items-center justify-between gap-2 py-1" style={{ minHeight: 44 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: LIGHT }}>{p.label}</span>
                        <button
                          type="button"
                          onClick={() => setParam(p.key, !value)}
                          style={{
                            minHeight: 44, minWidth: 76, touchAction: 'manipulation',
                            background: value ? 'rgba(252,211,77,0.16)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${value ? 'rgba(252,211,77,0.4)' : BORDER.card}`,
                            color: value ? LIGHT : TEXT.secondary,
                          }}
                          className="rounded-lg px-3 text-xs font-semibold"
                        >
                          {value ? 'On' : 'Off'}
                        </button>
                      </div>
                    );
                  }
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
                      onChange={(v) => setParam(p.key, v)}
                    />
                  );
                })}
              </div>
            </Card>
          )}

          {numeric && (
            <Card accent={numericChecked ? (numericOk ? OK : BAD) : GLASS}>
              <p className="text-sm leading-snug mb-2" style={{ color: TEXT.primary }}>
                <InlineMarkdown>{numeric.prompt}</InlineMarkdown>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="number"
                  inputMode="decimal"
                  value={numericAnswer}
                  onChange={(e) => { setNumericAnswer(e.target.value); setNumericChecked(false); }}
                  aria-label={numeric.prompt}
                  style={{
                    minHeight: 44, width: 130, background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${BORDER.card}`, color: TEXT.primary, borderRadius: 8, padding: '0 10px',
                  }}
                />
                {numeric.unit && <span className="text-xs" style={{ color: TEXT.muted }}>{numeric.unit}</span>}
                <ActionButton accent={GLASS} onClick={() => setNumericChecked(true)} disabled={!numericAnswer}>
                  Check
                </ActionButton>
              </div>
              {numericChecked && (
                <p className="text-sm leading-snug mt-2" style={{ color: numericOk ? OK : TEXT.primary }}>
                  <InlineMarkdown>{numericOk ? numeric.worked_reveal : 'Not yet. Read the traced value off the panel above and try again.'}</InlineMarkdown>
                </p>
              )}
            </Card>
          )}
        </div>
      </div>

      {block.caption && (
        <p className="mt-4 text-sm leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{block.caption}</InlineMarkdown>
        </p>
      )}

      <ExpertTip accent={LIGHT}>
        Every line on that canvas came from tracing a ray through a surface, not from the formula in the
        panel. When the two agree, the formula is a shortcut worth trusting. When they do not, the picture
        is right and the formula is telling you its assumptions have run out.
      </ExpertTip>
    </SimShell>
  );
}
