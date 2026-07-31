'use client';

/*
 * field-bench/FieldLab.tsx — Field Sculptor, Gauss Surface Lab, Magnetic Force
 * Playground and the Orbit Sandbox. One component, three modes.
 * ─────────────────────────────────────────────────────────────────────────────
 * They are one component because they are one scene graph: sources, a sampled
 * field, an optional closed surface, optional integrated paths. Splitting them
 * into three files would triple the drag handling, the camera and the legend to
 * get three views that must stay pixel-consistent with each other — and the
 * moment they drift, "it is the same field" stops being demonstrable.
 *
 * ── The five design laws, concretely ────────────────────────────────────────
 * 1. THE STUDENT IS THE AUTHOR. Charges, probes and the Gauss surface are all
 *    dragged directly; the sliders are the second-best way to do what the drag
 *    already does.
 * 2. IT GRADES REASONING. Every archetype names a misconception in `targets`,
 *    and the card for it appears only once the sim has SHOWN the contradicting
 *    evidence (see `evidence` below) — never as a preamble.
 * 3. IT SHOWS THE INVISIBLE MIDDLE STEP. For Gauss that is the measured
 *    integral standing beside the theorem's prediction while the surface moves.
 *    For the field it is the 90° crossing, MEASURED off the drawn contour
 *    rather than asserted.
 * 4. IT COMPOSES. Trajectories come from motion-lab's RK4 via `lib/trace.ts` —
 *    the same integrator that flies a projectile.
 * 5. IT IS GUIDED, NEVER AUTO-PLAYING. `reveal.ts` says which layer each click
 *    turns on. Nothing moves until a student presses something.
 *
 * ── Three implementation rules learned the hard way ─────────────────────────
 * • NEVER memoise on block identity. The admin books-editor autosaves on a
 *   debounce and recreates the block object on every keystroke; an
 *   identity-keyed memo would re-seed the scene continuously and yank a charge
 *   out from under a dragging finger. Everything here keys on `sceneKey`.
 * • NEVER gate a drag on the animation clock. Dragging works while a path is
 *   playing, paused, finished, or has never been run.
 * • RESPONSIVENESS IS MEASURED, NOT DECLARED — and an unmeasured width counts
 *   as NARROW (see `useStageWidth.ts`).
 */

import { useEffect, useMemo, useState } from 'react';
import type { FieldBenchBlock } from '@canvas/data/types/books';
import type { FieldScene, FieldSource, GaussSurface, Vec2 } from './types';
import { getFieldArchetype } from './archetypes';
import { resolveScene, sceneKey } from './lib/scene';
import { fieldVector, sampleE, sampleG, sampleBz, potentialAt, hasMagnetic } from './lib/field';
import { buildFieldLines, DEFAULT_SEEDS } from './lib/lines';
import { buildEquipotentials, suggestLevels } from './lib/equipotential';
import { computeFlux, fluxModelWarnings, surfaceScale } from './lib/flux';
import { previewPaths } from './lib/preview';
import { speedOf, cyclotronRadius, cyclotronPeriod, selectorSpeed } from './lib/trace';
import { frameBounds, fitScene } from './lib/view';
import { gAtRadius, gProfile, surfaceG, specificEnergy, orbitShape } from './lib/gravity';
import { unsupportedSources } from './lib/sources';
import { issueFor } from './lib/misconceptions';
import { si, signed, fixed, betweenDeg } from './lib/format';
import { layersAt, allLayers, type Layer } from './reveal';
import FieldCanvas, { type DragKind, type DrawnPath, type Particle, type VectorSample, type BGlyph } from './FieldCanvas';
import { GProfile, PlotKey } from './charts';
import {
  ACCENT_B, Card, Legend, Readout, GuidedPanel, MisconceptionCard, ModelNote,
  Slider, Toggle, ActionButton, Choice, chargeColour, type LegendRow, type ReadoutRow,
} from './ui';
import { useStageWidth, isNarrow, stageHeight } from './useStageWidth';
import { sampleAt, duration as trDuration } from '../motion-lab/lib/integrate';
import {
  SimShell, SimHeader, SectionLabel, useAnimationFrame,
  ACCENT, TEXT, OK, SIM_CANVAS_BG, accentTint,
} from '../simulations/_shared';

/** Grid of sampled field arrows. Odd counts put a sample on the axes. */
const VEC_NX = 9;
const VEC_NY = 7;

/** Contour grid. 96² is ~9 000 potential evaluations — imperceptible on a
 *  phone, and fine enough that the measured crossing angle reads 90.0°. */
const CONTOUR_N = 96;

/** Wall-clock seconds a path takes to play, whatever its physical duration. */
const PLAYBACK_SECONDS = 8;

export default function FieldLab({ block }: { block: FieldBenchBlock }) {
  const arch = getFieldArchetype(block.archetype);
  const key = sceneKey(block);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resolved = useMemo(() => resolveScene(block, arch), [key]);
  const mode = block.mode;

  // ── authored params, live ─────────────────────────────────────────────────
  const [params, setParams] = useState(resolved.params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setParams(resolved.params); }, [key]);
  const paramsKey = JSON.stringify(params);

  // A block that hand-authors its own sources is not re-built from the
  // archetype — the author's scene wins, and the sliders are hidden.
  const usesArchetype = !!arch && !block.sources?.length;
  const built: FieldScene = useMemo(
    () => (usesArchetype && arch ? { ...arch.build(params), kind: resolved.scene.kind } : resolved.scene),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramsKey, usesArchetype, arch?.id, key],
  );

  // ── the live, draggable scene ─────────────────────────────────────────────
  const [live, setLive] = useState<FieldScene>(built);
  useEffect(() => { setLive(built); }, [built]);

  const liveKey = useMemo(() => JSON.stringify([
    live.kind,
    live.sources.map((s) => [s.id, s.kind, s.pos.x, s.pos.y, s.strength, s.angleDeg, s.radius]),
    (live.testCharges ?? []).map((t) => [t.id, t.pos.x, t.pos.y, t.vel?.x, t.vel?.y, t.charge, t.mass]),
    (live.surfaces ?? []).map((g) => [g.id, g.shape, g.centre.x, g.centre.y, g.radius, g.size?.w, g.size?.h]),
  ]), [live]);

  // ── guided script ─────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const guided = resolved.guided && resolved.steps.length > 0;
  const done = !guided || step >= resolved.steps.length;
  const layers: Set<Layer> = guided && !done
    ? layersAt(resolved.archetypeId, mode, step)
    : allLayers(resolved.archetypeId, mode);

  // ── evidence flags — the gate on every misconception card ─────────────────
  const [ran, setRan] = useState(false);
  const [touchedProbe, setTouchedProbe] = useState(false);
  const [movedSurface, setMovedSurface] = useState(false);

  // ── manual layer toggles, available once the script is done ───────────────
  const [showLines, setShowLines] = useState(true);
  const [showEqui, setShowEqui] = useState(true);
  const [showVectors, setShowVectors] = useState(true);

  // Re-authoring the block (an editor keystroke, a new archetype) restarts the
  // script and clears every piece of evidence. A misconception card left up
  // from the PREVIOUS exercise would be feedback about something the student
  // is no longer looking at.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setStep(0);
    setRan(false);
    setTouchedProbe(false);
    setMovedSurface(false);
  }, [key]);

  const wantLines = layers.has('lines') && showLines && resolved.show.fieldLines;
  const wantEqui = layers.has('equipotentials') && showEqui && live.kind !== 'magnetic';
  const wantVectors = layers.has('vectors') && showVectors;
  const wantPath = layers.has('path');
  const wantArrows = layers.has('arrows');
  const wantProbe = layers.has('probe') || mode !== 'sculptor';
  const wantFlux = layers.has('flux');
  const wantPredicted = layers.has('predicted');

  // ── measurement ───────────────────────────────────────────────────────────
  const [wrapRef, wrapW] = useStageWidth<HTMLDivElement>();
  const [canvasRef, canvasW] = useStageWidth<HTMLDivElement>();
  const stacked = isNarrow(wrapW);
  const boardW = canvasW > 0 ? canvasW : 560;
  const boardH = stageHeight(boardW);

  // ── paths, camera ─────────────────────────────────────────────────────────
  const paths = useMemo(
    () => previewPaths(live, mode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveKey, mode],
  );

  const frame = useMemo(
    () => frameBounds(live, paths.flatMap((p) => p.points)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveKey, mode],
  );
  const view = useMemo(() => fitScene(frame, boardW, boardH), [frame, boardW, boardH]);

  // ── the drawn field ───────────────────────────────────────────────────────
  const span = Math.max(frame.maxX - frame.minX, frame.maxY - frame.minY);

  const lines = useMemo(() => (wantLines ? buildFieldLines(live, {
    ...DEFAULT_SEEDS,
    step: span / 260,
    maxSteps: 460,
    maxLines: 90,
    bounds: frame,
    sinkRadius: span * 0.012,
  }) : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [liveKey, wantLines, frame]);

  const equis = useMemo(() => {
    if (!wantEqui) return [];
    const opts = { bounds: frame, nx: CONTOUR_N, ny: CONTOUR_N };
    return buildEquipotentials(live, suggestLevels(live, opts, 7), opts);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [liveKey, wantEqui, frame]);

  const vectors: VectorSample[] = useMemo(() => {
    if (!wantVectors || live.kind === 'magnetic') return [];
    const out: VectorSample[] = [];
    let peak = 0;
    const raw: { at: Vec2; f: Vec2; m: number }[] = [];
    for (let j = 0; j < VEC_NY; j++) {
      for (let i = 0; i < VEC_NX; i++) {
        const at = {
          x: frame.minX + ((i + 0.5) / VEC_NX) * (frame.maxX - frame.minX),
          y: frame.minY + ((j + 0.5) / VEC_NY) * (frame.maxY - frame.minY),
        };
        const f = fieldVector(live, at);
        const m = Math.hypot(f.x, f.y);
        if (!Number.isFinite(m) || m === 0) continue;
        peak = Math.max(peak, m);
        raw.push({ at, f, m });
      }
    }
    for (const r of raw) {
      // Length is compressed, not proportional: a 1/r² field over a whole frame
      // spans four decades, and a proportional arrow would be either a dot or
      // off the screen. The compression is stated in the legend.
      const frac = peak > 0 ? Math.pow(r.m / peak, 0.32) : 0;
      out.push({ at: r.at, dir: { x: r.f.x / r.m, y: r.f.y / r.m }, frac });
    }
    return out;
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [liveKey, wantVectors, frame]);

  const bGlyphs: BGlyph[] = useMemo(() => {
    if (!hasMagnetic(live.sources)) return [];
    const out: BGlyph[] = [];
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 8; i++) {
        const at = {
          x: frame.minX + ((i + 0.5) / 8) * (frame.maxX - frame.minX),
          y: frame.minY + ((j + 0.5) / 6) * (frame.maxY - frame.minY),
        };
        const bz = sampleBz(live.sources, at);
        if (bz !== 0) out.push({ at, sign: Math.sign(bz) });
      }
    }
    return out;
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [liveKey, frame]);

  // ── the clock ─────────────────────────────────────────────────────────────
  const [tSim, setTSim] = useState(0);
  const [playing, setPlaying] = useState(false);
  const maxDuration = paths.length ? Math.max(...paths.map((p) => trDuration(p.trajectory))) : 0;

  // Playback is stretched to a fixed WALL-CLOCK length, not run in real time.
  // A cyclotron orbit takes 3 s and a low-Earth orbit takes 97 minutes; playing
  // either at 1× would be unwatchable at one end and asleep at the other. The
  // physics is untouched — the integration already happened; this only sets how
  // fast the play head walks it.
  useAnimationFrame((dt) => {
    setTSim((t) => Math.min(maxDuration, t + (dt * maxDuration) / PLAYBACK_SECONDS));
  }, { enabled: playing && maxDuration > 0, target: wrapRef });

  useEffect(() => { if (playing && tSim >= maxDuration - 1e-9) setPlaying(false); }, [playing, tSim, maxDuration]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setTSim(0); setPlaying(false); }, [liveKey]);

  // ── drag ──────────────────────────────────────────────────────────────────
  const onDrag = (kind: DragKind, id: string, world: Vec2) => {
    setLive((prev) => {
      if (kind === 'source') {
        return { ...prev, sources: prev.sources.map((s) => (s.id === id && !s.fixed ? { ...s, pos: world } : s)) };
      }
      if (kind === 'particle') {
        return {
          ...prev,
          testCharges: (prev.testCharges ?? []).map((t) => (t.id === id ? { ...t, pos: world } : t)),
        };
      }
      return {
        ...prev,
        surfaces: (prev.surfaces ?? []).map((g) => (g.id === id ? { ...g, centre: world } : g)),
      };
    });
    if (kind === 'particle') setTouchedProbe(true);
    if (kind === 'surface') setMovedSurface(true);
  };

  // ── readings ──────────────────────────────────────────────────────────────
  const probe = live.testCharges?.[0] ?? null;
  const surface: GaussSurface | null = live.surfaces?.[0] ?? null;

  const probeE = probe ? (live.kind === 'gravitational' ? sampleG(live.sources, probe.pos) : sampleE(live.sources, probe.pos)) : null;
  const probeV = probe ? potentialAt(live, probe.pos) : NaN;
  const probeMag = probeE ? Math.hypot(probeE.field.x, probeE.field.y) : 0;

  /** The crossing angle, MEASURED off the drawn contour: nearest contour
   *  vertex, central-difference tangent, angle to E. Reads 90.0° everywhere,
   *  and it reads it off the same polyline the student is looking at rather
   *  than off an identity we could have asserted without drawing anything. */
  const crossingDeg = useMemo(() => {
    if (!probe || !equis.length || !probeE || probeMag === 0) return NaN;
    let best: { loop: Vec2[]; i: number; d: number } | null = null;
    for (const e of equis) {
      for (const loop of e.loops) {
        for (let i = 1; i < loop.length - 1; i++) {
          const d = Math.hypot(loop[i].x - probe.pos.x, loop[i].y - probe.pos.y);
          if (!best || d < best.d) best = { loop, i, d };
        }
      }
    }
    if (!best) return NaN;
    const a = best.loop[best.i - 1];
    const b = best.loop[best.i + 1];
    return betweenDeg({ x: b.x - a.x, y: b.y - a.y }, probeE.field);
  }, [equis, probe, probeE, probeMag]);

  const flux = useMemo(
    () => (surface ? computeFlux(live, surface, { samples: 512 }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveKey],
  );
  const warnings = useMemo(() => fluxModelWarnings(live), [liveKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const unsupported = useMemo(() => unsupportedSources(live.sources), [liveKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── the misconception card ────────────────────────────────────────────────
  const issue = issueFor(arch?.targets);
  const evidence = (() => {
    switch (arch?.targets) {
      case 'field_lines_are_paths':
      case 'magnetic_force_does_work':
        return ran && tSim > 0;
      case 'flux_depends_on_surface_shape':
        return wantFlux && (movedSurface || paramsKey !== JSON.stringify(resolved.params));
      case 'flux_depends_on_position_inside':
        return wantFlux && movedSurface;
      case 'field_inside_conductor_nonzero':
        return wantFlux && !!flux && Math.abs(flux.flux) < 1e-6 && !!surface;
      case 'equipotential_not_perpendicular':
        return Number.isFinite(crossingDeg) && wantEqui && wantProbe;
      case 'field_needs_a_test_charge':
        return touchedProbe;
      case 'potential_is_potential_energy':
        return touchedProbe && Number.isFinite(probeV);
      case 'g_constant_inside_earth':
        return touchedProbe && !!probe && insidePlanet(live, probe.pos);
      default:
        return false;
    }
  })();

  // ── canvas payload ────────────────────────────────────────────────────────
  const drawnPaths: DrawnPath[] = wantPath
    ? paths.map((p) => ({
        id: p.id,
        pts: p.points,
        color: live.kind === 'gravitational' ? ACCENT_B : chargeColour(p.charge), // sim-lint-ok — real-world identity: sign of the charge
      }))
    : [];

  const particles: Particle[] = useMemo(() => {
    if (mode === 'trajectory') {
      return paths.map((p) => {
        const s = sampleAt(p.trajectory, Math.min(tSim, trDuration(p.trajectory)));
        const sp = speedOf(s);
        const e = sampleE(live.sources, s.pos).field;
        const bz = sampleBz(live.sources, s.pos);
        const g = sampleG(live.sources, s.pos).field;
        const f = live.kind === 'gravitational'
          ? g
          : { x: p.charge * (e.x + s.vel.y * bz), y: p.charge * (e.y - s.vel.x * bz) };
        const fm = Math.hypot(f.x, f.y);
        return {
          id: p.id,
          at: s.pos,
          charge: p.charge,
          vel: wantArrows && sp > 0 ? { x: s.vel.x / sp, y: s.vel.y / sp } : null,
          force: wantArrows && fm > 0 ? { x: f.x / fm, y: f.y / fm } : null,
        };
      });
    }
    if (!probe || !wantProbe) return [];
    const dir = probeMag > 0 && probeE ? { x: probeE.field.x / probeMag, y: probeE.field.y / probeMag } : null;
    return [{
      id: probe.id, at: probe.pos, charge: probe.charge,
      force: wantVectors ? dir : null, vel: null,
    }];
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [liveKey, mode, tSim, wantArrows, wantProbe, wantVectors, probeMag, paths]);

  // ── legend ────────────────────────────────────────────────────────────────
  const legend: LegendRow[] = [];
  if (wantLines) legend.push({ color: ACCENT, label: live.kind === 'gravitational' ? 'field lines (toward the mass)' : 'field lines' });
  if (wantVectors && vectors.length) legend.push({ color: ACCENT, label: 'sampled field — arrow length is compressed, not proportional' });
  if (wantEqui && equis.length) legend.push({ color: ACCENT_B, dashed: true, label: 'equipotentials' });
  if (surface) legend.push({ color: ACCENT_B, dashed: true, label: 'closed surface' });
  if (bGlyphs.length) legend.push({ color: ACCENT_B, label: 'B out of the page (⊙) / into it (⊗)' });
  for (const s of live.sources) {
    if (s.kind === 'uniform-E' || s.kind === 'uniform-B') continue;
    if (!s.label) continue;
    legend.push({
      color: s.kind === 'point-mass' ? TEXT.secondary : chargeColour(s.strength), // sim-lint-ok — real-world identity: sign of the charge
      dot: true,
      label: s.label,
      value: s.kind === 'point-mass' ? si(s.strength, 'kg') : signed(s.strength, s.kind === 'point-charge' ? 'C' : 'C/m'),
    });
  }
  if (drawnPaths.length) legend.push({ color: drawnPaths[0].color, label: 'the path it actually takes' });
  if (wantArrows) {
    legend.push({ color: TEXT.primary, label: 'velocity' });
    legend.push({ color: ACCENT, label: 'force' });
  }

  // ── readouts ──────────────────────────────────────────────────────────────
  const readout: ReadoutRow[] = [];
  const isGrav = live.kind === 'gravitational';

  if (mode === 'trajectory' && paths.length) {
    const p = paths[0];
    const s = sampleAt(p.trajectory, Math.min(tSim, trDuration(p.trajectory)));
    const v0 = speedOf(p.trajectory.points[0]);
    const sp = speedOf(s);
    readout.push({ label: 'speed now', value: si(sp, 'm/s'), color: ACCENT, strong: true });
    readout.push({ label: 'speed at launch', value: si(v0, 'm/s') });
    readout.push({
      label: 'change in speed',
      value: si(sp - v0, 'm/s'),
      color: Math.abs(sp - v0) < v0 * 1e-6 ? OK : TEXT.primary,
    });
    // ΔKE from launch to now — work MEASURED off the path, so a claim of zero
    // is a measurement rather than a restatement of the theory.
    readout.push({
      label: 'work done so far',
      value: si(0.5 * (probe?.mass ?? 1) * (sp * sp - v0 * v0), 'J'),
      color: Math.abs(sp - v0) < v0 * 1e-6 ? OK : TEXT.primary,
    });
    if (hasMagnetic(live.sources) && probe) {
      const bz = sampleBz(live.sources, probe.pos);
      if (bz !== 0 && probe.charge !== 0) {
        readout.push({ label: 'radius r = mv/(qB)', value: si(cyclotronRadius(probe.mass, v0, probe.charge, bz), 'm'), color: ACCENT_B });
        readout.push({ label: 'period T = 2πm/(qB)', value: si(cyclotronPeriod(probe.mass, probe.charge, bz), 's'), color: ACCENT_B });
      }
      const eSrc = live.sources.find((s2) => s2.kind === 'uniform-E');
      const bSrc = live.sources.find((s2) => s2.kind === 'uniform-B');
      if (eSrc && bSrc && bSrc.strength !== 0) {
        readout.push({ label: 'passes straight at E/B', value: si(selectorSpeed(eSrc.strength, bSrc.strength), 'm/s'), color: ACCENT_B });
      }
    }
    if (isGrav) {
      const planet = live.sources.find((s2) => s2.kind === 'point-mass');
      if (planet) {
        const r = Math.hypot(s.pos.x - planet.pos.x, s.pos.y - planet.pos.y);
        readout.push({ label: 'height above centre', value: si(r, 'm') });
        readout.push({
          label: 'orbit',
          // Classified from the LAUNCH radius measured off the planet, not off
          // the origin — the two coincide today and would silently stop
          // coinciding the moment a scene put the planet anywhere else.
          value: orbitShape(
            Math.hypot(p.trajectory.points[0].pos.x - planet.pos.x, p.trajectory.points[0].pos.y - planet.pos.y),
            v0, planet.strength,
          ),
          color: ACCENT_B,
        });
        readout.push({ label: 'energy per kg', value: si(specificEnergy(r, sp, planet.strength), 'J/kg') });
      }
    }
  } else if (mode === 'gauss' && flux) {
    readout.push({ label: 'flux, measured ∮E·n̂ dl', value: si(flux.flux, 'N·m²/C·m⁻¹'), color: ACCENT, strong: true });
    if (wantPredicted) {
      readout.push({ label: 'Gauss predicts q/ε₀', value: si(flux.predictedFlux, 'N·m²/C·m⁻¹'), color: ACCENT_B, strong: true });
      readout.push({
        label: 'they differ by',
        value: si(flux.flux - flux.predictedFlux, ''),
        color: Math.abs(flux.flux - flux.predictedFlux) <= Math.abs(flux.predictedFlux) * 1e-6 + 1e-12 ? OK : TEXT.primary,
      });
    }
    readout.push({ label: 'charge enclosed', value: signed(flux.enclosed, 'C/m') });
    readout.push({ label: 'surface', value: `${surface?.shape ?? '—'}, ${si(surfaceScale(surface ?? { id: '', shape: 'circle', centre: { x: 0, y: 0 } }), 'm')}` });
  } else if (probe) {
    readout.push({
      label: isGrav ? 'g at the probe' : 'field at the probe',
      value: si(probeMag, isGrav ? 'N/kg' : 'V/m'), color: ACCENT, strong: true,
    });
    if (Number.isFinite(probeV)) {
      readout.push({ label: isGrav ? 'potential' : 'potential V', value: si(probeV, isGrav ? 'J/kg' : 'V'), color: ACCENT_B });
      readout.push({ label: isGrav ? 'energy of 1 kg' : 'energy U = qV', value: si(probeV * probe.charge, 'J') });
    }
    if (Number.isFinite(crossingDeg)) {
      readout.push({
        label: 'line crosses contour at',
        value: `${fixed(crossingDeg, 1)}°`,
        color: Math.abs(crossingDeg - 90) < 1 ? OK : TEXT.primary,
      });
    }
    if (isGrav) {
      const planet = live.sources.find((s2) => s2.kind === 'point-mass');
      if (planet) {
        const r = Math.hypot(probe.pos.x - planet.pos.x, probe.pos.y - planet.pos.y);
        readout.push({ label: 'distance from centre', value: si(r, 'm') });
        readout.push({ label: 'surface value', value: si(surfaceG(planet.strength, planet.radius ?? 1), 'N/kg'), color: ACCENT_B });
      }
    }
  }

  // ── sliders ───────────────────────────────────────────────────────────────
  const setParam = (k: string, v: number | string | boolean) => setParams((p) => ({ ...p, [k]: v }));

  const planet = live.sources.find((s) => s.kind === 'point-mass');
  const profile = useMemo(() => {
    if (!planet || !probe) return null;
    const R = planet.radius ?? 1;
    const rProbe = Math.hypot(probe.pos.x - planet.pos.x, probe.pos.y - planet.pos.y);
    const rMax = Math.max(R * 2.6, rProbe * 1.15);
    return {
      points: gProfile(rMax, 240, planet.strength, R),
      R,
      rProbe,
      gProbe: gAtRadius(rProbe, planet.strength, R),
      gMax: surfaceG(planet.strength, R),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveKey]);

  const canLaunch = mode === 'trajectory' && maxDuration > 0;

  const advance = () => {
    const next = step + 1;
    setStep(next);
    const gained = layersAt(resolved.archetypeId, mode, next);
    if (gained.has('path') && !layersAt(resolved.archetypeId, mode, step).has('path')) {
      setTSim(0);
      setPlaying(true);
      setRan(true);
    }
  };

  const fire = () => { setTSim(0); setPlaying(true); setRan(true); };

  // ── render ────────────────────────────────────────────────────────────────
  const intro = (
    <div className="flex flex-col gap-3">
      {guided && !done ? (
        <GuidedPanel steps={resolved.steps} index={step} done={false} onAdvance={advance} />
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
        subtitle={`${resolved.archetypeId?.replace(/-/g, ' ') ?? mode} · field bench`}
        badge={canLaunch ? <span className="tabular-nums">{`t = ${si(tSim, 's')}`}</span> : undefined}
      />

      {/*
        The Tailwind `lg:` pair is the pre-measurement fallback only. Once
        `wrapW` is known the inline gridTemplateColumns wins, driven by the
        CONTAINER — so the admin editor's narrow preview pane stacks correctly
        even though the viewport behind it is a laptop.
      */}
      <div
        ref={wrapRef}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_5fr] lg:items-start"
        style={wrapW > 0
          ? { gridTemplateColumns: stacked ? 'minmax(0,1fr)' : 'minmax(0,7fr) minmax(0,5fr)', alignItems: stacked ? 'stretch' : 'start' }
          : undefined}
      >
        {/* ══ canvas column ══════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {stacked && intro}

          <div ref={canvasRef} className="relative overflow-hidden rounded-2xl"
            style={{ background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}>
            <FieldCanvas
              view={view} w={boardW} h={boardH}
              lines={lines}
              equipotentials={equis}
              vectors={vectors}
              sources={live.sources}
              bGlyphs={bGlyphs}
              surface={surface}
              paths={drawnPaths}
              particles={particles}
              draggable={{
                sources: mode !== 'trajectory',
                particles: wantProbe,
                surface: mode === 'gauss' && resolved.allowDragSurface,
              }}
              onDrag={onDrag}
            />
          </div>

          <Legend rows={legend} />

          {/* transport — a scrubber is not decoration: stepping the flight by
              hand is how a student inspects the moment the force turns. */}
          {canLaunch && (
            <div className="flex flex-wrap items-center gap-3">
              <ActionButton onClick={playing ? () => setPlaying(false) : fire} disabled={!wantPath}>
                {playing ? '❚❚ Pause' : tSim >= maxDuration - 1e-9 ? '↺ Again' : '▶ Release'}
              </ActionButton>
              <div className="flex flex-1 items-center gap-2" style={{ minWidth: 190 }}>
                <input
                  type="range" min={0} max={maxDuration || 1} step={(maxDuration || 1) / 400}
                  value={Math.min(tSim, maxDuration)}
                  onChange={(e) => { setPlaying(false); setTSim(parseFloat(e.target.value)); setRan(true); }}
                  disabled={!wantPath}
                  aria-label="Scrub through the motion"
                  className="flex-1"
                  style={{ accentColor: ACCENT, cursor: wantPath ? 'pointer' : 'not-allowed', minHeight: 44, touchAction: 'none' }}
                />
                <span className="tabular-nums text-[12px] font-semibold" style={{ color: TEXT.ghost, minWidth: 92, textAlign: 'right' }}>
                  {si(tSim, 's')} / {si(maxDuration, 's')}
                </span>
              </div>
            </div>
          )}

          {/* layer toggles, once the guided build-up has finished */}
          {done && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {resolved.show.fieldLines && <Toggle on={showLines} label="field lines" onClick={() => setShowLines((v) => !v)} />}
              {live.kind !== 'magnetic' && <Toggle on={showEqui} label="equipotentials" onClick={() => setShowEqui((v) => !v)} accent={ACCENT_B} />}
              <Toggle on={showVectors} label="sampled arrows" onClick={() => setShowVectors((v) => !v)} />
            </div>
          )}
        </div>

        {/* ══ sidebar ════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {!stacked && intro}

          {readout.length > 0 && (
            <Readout
              rows={readout}
              footnote={mode === 'gauss'
                ? 'This is a 2-D cross-section: the closed curve is a cylinder one metre long, so the flux is per metre of length. Nothing is rounded to make the two numbers agree.'
                : undefined}
            />
          )}

          {flux && flux.onBoundary.length > 0 && (
            <Card tone="bad">
              <div className="text-sm leading-snug" style={{ color: TEXT.primary }}>
                A charge is sitting ON the surface, not inside or outside it. The enclosed charge is genuinely
                undefined there — move the surface a little either way and the answer becomes definite again.
              </div>
            </Card>
          )}

          {profile && (
            <Card tone="second">
              <SectionLabel accent={ACCENT_B}>g against distance from the centre</SectionLabel>
              <div className="mt-1.5">
                <GProfile points={profile.points} surfaceR={profile.R} probeR={profile.rProbe}
                  probeG={profile.gProbe} maxG={profile.gMax} />
                <PlotKey items={[
                  { color: ACCENT, text: `g at the probe — ${si(profile.gProbe, 'N/kg')}` },
                  { color: ACCENT_B, text: `the surface, at ${si(profile.R, 'm')} — g peaks exactly here` },
                ]} />
              </div>
            </Card>
          )}

          {usesArchetype && (arch?.params?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-2.5">
              <SectionLabel>Set the scene</SectionLabel>
              {arch?.params?.map((p) => {
                if (p.kind === 'select') {
                  return (
                    <div key={p.key} className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>{p.label}</span>
                      <Choice options={p.options ?? []} value={String(params[p.key] ?? p.default)}
                        onChange={(v) => setParam(p.key, v)} />
                    </div>
                  );
                }
                if (p.kind === 'boolean') {
                  return (
                    <Toggle key={p.key} on={!!params[p.key]} label={p.label}
                      onClick={() => setParam(p.key, !params[p.key])} />
                  );
                }
                return (
                  <Slider key={p.key} label={p.label}
                    value={Number(params[p.key] ?? p.default)}
                    min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.1}
                    unit={p.unit ?? ''} onChange={(v) => setParam(p.key, v)}
                    format={(v) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2))} />
                );
              })}
              <ModelNote>
                {mode === 'gauss' && resolved.allowDragSurface
                  ? 'Drag the surface itself — that is the experiment. The sliders only resize it.'
                  : mode === 'trajectory'
                    ? 'Drag the particle to move its starting point. The sliders set everything else.'
                    : 'Drag a charge or the probe straight on the canvas.'}
              </ModelNote>
            </div>
          )}

          {warnings.map((wmsg, i) => <ModelNote key={i}>{wmsg}</ModelNote>)}
          {unsupported.length > 0 && (
            <ModelNote>
              {`This scene contains a ${unsupported[0].kind} source, which this engine does not model yet — it is drawn but contributes nothing, rather than being faked.`}
            </ModelNote>
          )}
          {mode !== 'gauss' && live.kind === 'electric' && live.sources.some((s) => s.kind === 'line-charge') && (
            <ModelNote>Charges shown as wires are long straight lines seen end-on, so their field falls as 1/r rather than 1/r².</ModelNote>
          )}
        </div>
      </div>
    </SimShell>
  );
}


/** True when the probe is inside a source that has a radius — the evidence gate
 *  for `g_constant_inside_earth`, which must not fire until the student has
 *  actually been underground. */
function insidePlanet(scene: FieldScene, p: Vec2): boolean {
  return scene.sources.some((s: FieldSource) =>
    s.kind === 'point-mass' && (s.radius ?? 0) > 0
    && Math.hypot(p.x - s.pos.x, p.y - s.pos.y) < (s.radius ?? 0));
}

