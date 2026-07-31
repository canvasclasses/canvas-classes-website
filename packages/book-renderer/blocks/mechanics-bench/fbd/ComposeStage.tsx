'use client';

/*
 * fbd/ComposeStage.tsx — stage 1: the student builds the problem.
 * ─────────────────────────────────────────────────────────────────────────────
 * Design law #1: the student is the AUTHOR, not the audience. Not optional.
 * A slider on a scene we chose is a diagram; a scene they assembled is theirs,
 * and they defend their own diagram differently.
 *
 * They add bodies, seat them on a wedge, hang them from the ceiling, push them,
 * and set mass and μ per contact. The wedge's HYPOTENUSE is draggable: pull it
 * and the incline angle changes live, with everything resting on it re-seating,
 * re-orienting, and getting a rebuilt contact normal (see `setWedgeAngle`).
 *
 * μ is edited on the CONTACT, never on the body — one block can sit on two
 * different surfaces at once, and friction is a property of the pair.
 */

import React, { useMemo, useRef, useState } from 'react';
import type { Scene, Vec2 } from '../types';
import { WORLD } from '../types';
import { worldToScreen, screenToWorld, arcPath } from '../lib/svg';
import SceneView from './SceneView';
import {
  PRIMARY, SECONDARY, TEXT, accentTint, arrowRefPx, appliedArrowPx,
} from './theme';
import {
  StagePanels, useStageBox, useFittedView, sceneWorldBounds, mixedBounds, HIT, FIT_PAD,
} from './canvas';
import type { Spur } from './canvas';
import {
  addBody, addWedge, placeOnWedge, setWedgeAngle, setMass, setFriction,
  removeBody, attachToCeiling, addApplied, removeApplied, setApplied,
  wedgeVertices, findBody, contactsOn, sceneBounds, agentLabel, DEG,
} from './sceneEdit';
import { Card, ActionButton, Legend, usePointerDrag } from './ui';
import type { LegendRow } from './ui';
import { SimSlider, TYPE } from '../../simulations/_shared';

export default function ComposeStage({ scene, onChange, onReset, editable }: {
  scene: Scene;
  onChange: (next: Scene) => void;
  onReset: () => void;
  /** false locks the scene to the author's archetype (composition off). */
  editable: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(scene.bodies[0]?.id ?? null);

  // The board measures itself; the camera is fitted to it. Nothing here is a
  // fixed window any more — see fbd/canvas.tsx.
  const box = useStageBox();
  const { w, h } = box;
  const arrowRef = arrowRefPx(w || 430, h || 360);

  // Keyed on primitives, never on the scene object: the admin books-editor
  // autosaves on a debounce and recreates the block on every keystroke, and an
  // identity-keyed memo would re-fit the camera mid-gesture.
  const geomKey = JSON.stringify([
    scene.bodies.map((b) => [b.id, b.pos.x, b.pos.y, b.size?.w, b.size?.h, b.radius, b.angleDeg]),
    (scene.applied ?? []).map((a) => [a.id, a.body, a.mag, a.angleDeg]),
  ]);

  // Fit to what is actually DRAWN: bodies, fixtures, strings AND the composed
  // push arrows. Arrows are what overflow, so leaving them out re-creates the
  // clipping bug rather than fixing it.
  const bounds = useMemo(() => {
    const world = sceneWorldBounds(scene);
    const spurs: Spur[] = [];
    for (const a of scene.applied ?? []) {
      const b = findBody(scene, a.body);
      if (b) spurs.push({ at: b.pos as Vec2, angleDeg: a.angleDeg, px: appliedArrowPx(a.mag, arrowRef) });
    }
    return mixedBounds(world, spurs, w, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geomKey, w, h, arrowRef]);

  // The camera is frozen while the incline is being dragged: re-fitting under a
  // moving finger is the bug that shipped in an earlier sim.
  const [retilting, setRetilting] = useState(false);
  const view = useFittedView(bounds, w, h, retilting, FIT_PAD, 320);

  const selected = selectedId ? findBody(scene, selectedId) : undefined;
  const wedges = scene.bodies.filter((b) => b.shape === 'wedge');
  const groundContact = selected
    ? contactsOn(scene, selected.id).find((c) => c.bodyA === selected.id)
    : undefined;
  const push = selected ? (scene.applied ?? []).find((a) => a.body === selected.id) : undefined;

  // ── The live incline drag ──────────────────────────────────────────────────
  const dragWedgeId = useRef<string | null>(null);
  const retilt = usePointerDrag({
    svgRef,
    onMove: (pt) => {
      const id = dragWedgeId.current;
      if (!id) return;
      const wedge = findBody(scene, id);
      if (!wedge) return;
      const v = wedgeVertices(wedge);
      const world = screenToWorld(pt, view);
      const base = wedge.size?.w ?? 2.2;
      const rise = Math.max(0.08, world.y - v.base.y);
      onChange(setWedgeAngle(scene, id, Math.atan2(rise, base) / DEG));
    },
    onEnd: () => { dragWedgeId.current = null; setRetilting(false); },
  });

  const startRetilt = (id: string) => (e: React.PointerEvent) => {
    dragWedgeId.current = id;
    setRetilting(true);
    retilt(e);
  };

  const rows: LegendRow[] = scene.bodies.map((b) => ({
    id: b.id,
    color: b.fixed ? TEXT.secondary : PRIMARY,
    name: b.label ?? b.id,
    detail: b.fixed
      ? `${b.shape} · fixed`
      : `${b.shape} · ${b.mass.toFixed(1)} kg`,
    value: b.shape === 'wedge' ? `${Math.round(b.angleDeg ?? 0)}°` : undefined,
  }));
  for (const a of scene.applied ?? []) {
    rows.push({
      id: a.id, color: SECONDARY, name: 'Applied push',
      detail: `on ${agentLabel(scene, a.body)}, from ${agentLabel(scene, a.from)}`,
      value: `${a.mag.toFixed(0)} N`,
    });
  }

  const worldBox = sceneBounds(scene);

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-2" style={{ minHeight: 34 }}>
      <p className="text-[11px] leading-snug" style={{ color: TEXT.muted, maxWidth: '62%' }}>
        {editable
          ? wedges.length
            ? 'Tap a body to select it. Drag the slope to change the incline — everything on it follows.'
            : 'Tap a body to select it, then set its mass and how rough its surface is.'
          : 'This scene is set by the exercise. Tap a body to inspect it.'}
      </p>
      {editable && <ActionButton onClick={onReset}>Start over</ActionButton>}
    </div>
  );

  // The angle arc scales with the board so it stays readable on a phone without
  // swallowing a small wedge on a wide one.
  const arcR = Math.max(24, Math.min(44, w * 0.07));

  return (
    <StagePanels box={box} footer={footer} side={
      <>
        {editable && (
          <Card>
            <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>Add to the scene</div>
            <div className="grid grid-cols-2 gap-1.5">
              <ActionButton full onClick={() => onChange(addBody(scene, 'block'))}>Block on the ground</ActionButton>
              <ActionButton full onClick={() => onChange(addBody(scene, 'sphere'))}>Sphere on the ground</ActionButton>
              <ActionButton full onClick={() => onChange(addWedge(scene))}>Wedge (an incline)</ActionButton>
              <ActionButton full disabled={!selected || !wedges.length || selected.shape === 'wedge'}
                onClick={() => selected && wedges[0] && onChange(placeOnWedge(scene, selected.id, wedges[0].id))}>
                Put it on the wedge
              </ActionButton>
              <ActionButton full disabled={!selected || selected.fixed}
                onClick={() => selected && onChange(attachToCeiling(scene, selected.id))}>
                Hang it from a string
              </ActionButton>
              <ActionButton full disabled={!selected || selected.fixed || !!push}
                onClick={() => selected && onChange(addApplied(scene, selected.id))}>
                Push it with your hand
              </ActionButton>
            </div>
          </Card>
        )}

        {selected && (
          <Card>
            <div className={`${TYPE.sectionLabel} mb-2.5`} style={{ color: PRIMARY }}>
              {selected.label ?? selected.id} — properties
            </div>
            <div className="flex flex-col gap-2.5">
              {!selected.fixed && (
                <SimSlider label="Mass" value={Math.round(selected.mass * 10) / 10}
                  min={0.5} max={20} step={0.5} unit="kg" accent={PRIMARY}
                  disabled={!editable}
                  onChange={(v) => onChange(setMass(scene, selected.id, v))} />
              )}
              {selected.shape === 'wedge' && (
                <SimSlider label="Incline" value={Math.round(selected.angleDeg ?? 30)}
                  min={0} max={65} step={1} unit="°" accent={SECONDARY}
                  disabled={!editable}
                  onChange={(v) => onChange(setWedgeAngle(scene, selected.id, v))} />
              )}
              {groundContact && (
                <SimSlider label="Roughness" value={Math.round((groundContact.mu_s ?? 0) * 100) / 100}
                  min={0} max={1.2} step={0.05} accent={PRIMARY}
                  disabled={!editable}
                  format={(v) => `μs ${v.toFixed(2)}`}
                  onChange={(v) => onChange(setFriction(scene, groundContact.id, v))} />
              )}
              {push && (
                <>
                  <SimSlider label="Push size" value={Math.round(push.mag)} min={0} max={120} step={1}
                    unit="N" accent={SECONDARY} disabled={!editable}
                    onChange={(v) => onChange(setApplied(scene, push.id, { mag: v }))} />
                  <SimSlider label="Push angle" value={Math.round(push.angleDeg)} min={-90} max={90} step={5}
                    unit="°" accent={SECONDARY} disabled={!editable}
                    onChange={(v) => onChange(setApplied(scene, push.id, { angleDeg: v }))} />
                </>
              )}
              {groundContact && (
                <p className="text-[11px] leading-snug" style={{ color: TEXT.ghost }}>
                  Roughness belongs to this <b>pair</b> of surfaces — {selected.label ?? selected.id} against{' '}
                  {agentLabel(scene, groundContact.bodyB)} — not to either object on its own.
                </p>
              )}
              {editable && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {push && (
                    <ActionButton onClick={() => onChange(removeApplied(scene, push.id))}>Remove the push</ActionButton>
                  )}
                  {scene.bodies.length > 1 && (
                    <ActionButton onClick={() => { onChange(removeBody(scene, selected.id)); setSelectedId(null); }}>
                      Remove this body
                    </ActionButton>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        <Legend title="In this scene" rows={rows} selectedId={selectedId}
          onSelect={(id) => setSelectedId(scene.bodies.some((b) => b.id === id) ? id : selectedId)}
          empty="Nothing here yet — add a body." />

        {scene.contacts.some((c) => c.bodyB === WORLD.ground) && worldBox.maxY > 0 && (
          <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
            Every surface a body touches will push on it. Remember that when you draw the diagram — the
            grader derives it from exactly this list of contacts, so nothing here is a special case.
          </p>
        )}
      </>
    }>
      {box.ready && (
        <SceneView scene={scene} view={view} w={w} h={h} arrowRef={arrowRef}
          svgRef={svgRef} selectedId={selectedId} haloId={selectedId}
          onSelectBody={setSelectedId}
          onBackgroundDown={() => setSelectedId(null)}>

          {/* Every wedge gets an angle arc and two grab handles: one on the
              hypotenuse itself and one at the apex. Both retilt live.

              The handles are sized in VIEWBOX units, which are CSS pixels here,
              so they stay ≥40px across however far the camera zooms out. Sizing
              them in world units is how a grip becomes untappable on a phone. */}
          {wedges.map((wd) => {
            const v = wedgeVertices(wd);
            const baseS = worldToScreen(v.base, view);
            const apexS = worldToScreen(v.apex, view);
            const toeS = worldToScreen(v.toe, view);
            const midS = { x: (apexS.x + toeS.x) / 2, y: (apexS.y + toeS.y) / 2 };
            const theta = wd.angleDeg ?? 30;
            return (
              <g key={`wg-${wd.id}`}>
                {/* The angle at the toe — the incline angle, drawn where the
                    textbook draws it. No text: the value is in the legend. */}
                <path d={arcPath(toeS, arcR, 180 - theta, 180)} fill="none"
                  stroke={SECONDARY} strokeWidth={2} opacity={0.85} />
                {editable && (
                  <>
                    <line x1={apexS.x} y1={apexS.y} x2={toeS.x} y2={toeS.y}
                      stroke={SECONDARY} strokeWidth={22} opacity={0.001}
                      style={{ cursor: 'ns-resize', touchAction: 'none' }}
                      onPointerDown={startRetilt(wd.id)} />
                    <circle cx={midS.x} cy={midS.y} r={HIT.wedge.r}
                      fill={accentTint(SECONDARY, 0.3)} stroke={SECONDARY} strokeWidth={2}
                      style={{ pointerEvents: 'none' }}>
                      <animate attributeName="r"
                        values={`${HIT.wedge.r - 1};${HIT.wedge.r + 2};${HIT.wedge.r - 1}`}
                        dur="1.9s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={midS.x} cy={midS.y} r={HIT.wedge.hit} fill="transparent"
                      style={{ cursor: 'ns-resize', touchAction: 'none' }}
                      onPointerDown={startRetilt(wd.id)} />
                    <circle cx={apexS.x} cy={apexS.y} r={HIT.apex.r}
                      fill={accentTint(SECONDARY, 0.25)} stroke={SECONDARY} strokeWidth={1.8}
                      style={{ pointerEvents: 'none' }} />
                    <circle cx={apexS.x} cy={apexS.y} r={HIT.apex.hit} fill="transparent"
                      style={{ cursor: 'ns-resize', touchAction: 'none' }}
                      onPointerDown={startRetilt(wd.id)} />
                    <line x1={baseS.x} y1={baseS.y} x2={apexS.x} y2={apexS.y}
                      stroke={SECONDARY} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5}
                      style={{ pointerEvents: 'none' }} />
                  </>
                )}
              </g>
            );
          })}
        </SceneView>
      )}
    </StagePanels>
  );
}
