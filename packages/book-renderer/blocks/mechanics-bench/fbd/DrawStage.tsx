'use client';

/*
 * fbd/DrawStage.tsx — stage 2 and 3: isolate the body, draw its forces, be graded.
 * ─────────────────────────────────────────────────────────────────────────────
 * The chosen body LIFTS OUT of the scene into its own panel, drawn at its real
 * world orientation (a block on a 30° incline stays tilted 30° — the FBD does
 * not un-rotate the world, and pretending otherwise is where "normal is
 * vertical" comes from).
 *
 * THE ANTI-GHOST-FORCE MECHANISM. When `require_agent` is on (the default),
 * placing an arrow immediately asks "what object is applying this?" and offers
 * only the objects that are actually in the scene, plus one honest escape hatch:
 * "nothing is touching it there". Choosing that is not punished — it is the
 * lesson. A force with no nameable agent is not a force, and the student
 * discovers that by trying to name it and finding the list empty.
 *
 * INTERACTION. Tap a palette kind to PLACE an arrow (touch-first — dragging out
 * of a sidebar button and onto a canvas is a desktop-only gesture), then drag its
 * head to aim and size it, and drag its tail to move where it acts. Every
 * gesture is pointer-events, so it behaves identically under a finger.
 */

import React, { useMemo, useState } from 'react';
import type {
  Scene, Body, Vec2, ForceKind, TrueForce, GradeResult, ReferenceFrame,
} from '../types';
import { WORLD } from '../types';
import { worldToScreen, screenToWorld } from '../lib/svg';
import type { View } from '../lib/svg';
import { Arrow } from './SceneView';
import {
  FORCE_STYLE, PALETTE_ORDER, PRIMARY, SECONDARY, TEXT, BAD, HINT_COLOR,
  accentTint, nPerPx, arrowRefPx,
} from './theme';
import {
  StagePanels, useStageBox, useFittedView, mixedBounds, localBounds,
  boardSvgStyle, HIT, FIT_PAD,
} from './canvas';
import type { Spur } from './canvas';
import {
  localOutline, bodyRadius, anchorCandidates, agentsIn, agentLabel, DEG,
} from './sceneEdit';
import { Card, Pill, ActionButton, Legend, Diagnostic, usePointerDrag } from './ui';
import type { LegendRow } from './ui';
import { fmtN } from './forces';
import type { DrawnForce } from './forces';
import { TYPE, BORDER } from '../../simulations/_shared';

// The drawing's shape and its conversion to grading input live in `forces.ts`
// (pure TS) so a node verifier can drive the grader without React. Re-exported
// here because this is where callers have always imported them from.
export type { DrawnForce } from './forces';
export { toStudentForces } from './forces';

/** Body-local → the body's own rotated frame (a wedge is never re-oriented:
 *  its `angleDeg` is an incline angle, not an orientation). */
function rotLocal(b: Body, p: Vec2): Vec2 {
  const rot = b.shape === 'wedge' ? 0 : (b.angleDeg ?? 0) * DEG;
  const c = Math.cos(rot), s = Math.sin(rot);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
}

// ── Panel ────────────────────────────────────────────────────────────────────

/** One switchable reference frame, supplied by the studio. */
export interface FrameChoice {
  id: string;
  label: string;
  frame: ReferenceFrame;
  /** One line: what changes about the physics when you stand here. */
  blurb: string;
}

export interface DrawStageProps {
  scene: Scene;
  body: Body;
  drawn: DrawnForce[];
  onChange: (next: DrawnForce[]) => void;
  requireAgent: boolean;
  /** Bodies the student may isolate, and the picker's callback. Choosing WHICH
   *  body to isolate is the first real decision in free-body analysis, and it
   *  used to be made for them every single time. */
  bodies: Body[];
  onPickBody: (id: string) => void;
  /** The frames this scene can be described from. Empty ⇒ no toggle. */
  frames: FrameChoice[];
  frameId: string;
  onPickFrame: (id: string) => void;
  grade: GradeResult | null;
  attempts: number;
  trueForces: TrueForce[];
  onCheck: () => void;
  onReset: () => void;
  prompt: string;
  successMessage?: string;
  showValues: boolean;
  /** Whether arrow LENGTHS are part of the grade. See the toggle below. */
  checkSizes: boolean;
  onToggleSizes: () => void;
}

export default function DrawStage(props: DrawStageProps) {
  const {
    scene, body, drawn, onChange, requireAgent, grade, attempts,
    trueForces, onCheck, onReset, prompt, successMessage, showValues,
    checkSizes, onToggleSizes, bodies, onPickBody, frames, frameId, onPickFrame,
  } = props;

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [askAgentFor, setAskAgentFor] = useState<string | null>(null);
  const [focusIssue, setFocusIssue] = useState<string | null>(null);

  const g = scene.g ?? 9.8;
  const weightN = body.mass * g;

  // The board measures itself (fbd/canvas.tsx). Everything below is expressed
  // against that measured pixel box, so nothing is a hardcoded window.
  const box = useStageBox();
  const { w, h } = box;
  const refPx = arrowRefPx(w || 430, h || 360);
  const perPx = nPerPx(weightN, refPx);

  const outline = localOutline(body).map((p) => rotLocal(body, p));

  /** Attachment points, as WORLD-frame offsets (see `DrawnForce.anchor`). */
  const anchors = useMemo(
    () => anchorCandidates(body).map((a) => ({ key: a.key, at: rotLocal(body, a.local) })),
    [body]
  );
  const snapWorld = (p: Vec2): Vec2 => {
    let best = anchors[0]?.at ?? { x: 0, y: 0 }, bestD = Infinity;
    for (const a of anchors) {
      const d = Math.hypot(a.at.x - p.x, a.at.y - p.y);
      if (d < bestD) { bestD = d; best = a.at; }
    }
    return best;
  };

  const lengthPxOf = React.useCallback(
    (mag: number) => Math.max(refPx * 0.32, Math.min(refPx * 1.77, mag / perPx)),
    [refPx, perPx]
  );

  // ── The camera ─────────────────────────────────────────────────────────────
  // Fitted to the union of the isolated body AND every arrow currently on it.
  // The arrows are what run off the edge, so a fit that ignores them just moves
  // the clipping bug rather than fixing it. Their lengths are in PIXELS (they
  // encode newtons) while the body is in metres, so `mixedBounds` solves the
  // mixed fit rather than guessing a margin.
  // Keyed on the DRAWING's numbers, never on an object identity — the admin
  // books-editor recreates the block on every keystroke.
  const drawnKey = JSON.stringify(drawn.map((f) => [f.anchor.x, f.anchor.y, f.angleDeg, f.magnitude, f.aimed]));

  const bounds = useMemo(() => {
    const world = localBounds(outline, bodyRadius(body));
    const spurs: Spur[] = drawn.map((f) => ({
      at: f.anchor, angleDeg: f.angleDeg,
      px: f.aimed === false ? refPx * 0.42 : lengthPxOf(f.magnitude),
    }));
    // A FLOOR of half a reference arrow in each direction, always. Without it an
    // empty board zooms the bare body to fill the whole canvas and then lurches
    // backwards the moment the first arrow is placed; with it, placing the
    // expected forces costs no re-frame at all. It also stops a body being
    // drawn edge-to-edge with nowhere for its arrows to go.
    for (const deg of [0, 90, 180, 270]) {
      spurs.push({ at: { x: 0, y: 0 }, angleDeg: deg, px: refPx * 0.55 });
    }
    return mixedBounds(world, spurs, w, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawnKey, body.id, w, h, refPx, lengthPxOf]);

  // Frozen while a handle is under the finger: an earlier sim shipped a camera
  // that zoomed out mid-drag and the handle ran away from the pointer.
  const [dragging, setDragging] = useState(false);
  const view: View = useFittedView(bounds, w, h, dragging, FIT_PAD, 1600);

  const toScreen = (offset: Vec2) => worldToScreen(offset, view);
  const centre = toScreen({ x: 0, y: 0 });

  // ── Editing ────────────────────────────────────────────────────────────────

  const place = (kind: ForceKind) => {
    const style = FORCE_STYLE[kind];
    const id = `sf${Date.now().toString(36)}${drawn.length}`;
    const f: DrawnForce = {
      id, kind,
      // `defaultDeg` is now only where the STUB points before the student aims
      // it — it is never graded. See `DrawnForce.aimed`: grading the palette's
      // own default meant accusing a student of a belief the software chose.
      angleDeg: style.defaultDeg,
      magnitude: weightN,
      aimed: false,
      anchor: style.anchorsAtCentre
        ? { x: 0, y: 0 }
        : snapWorld({
          x: bodyRadius(body) * 0.92 * Math.cos(style.defaultDeg * DEG),
          y: bodyRadius(body) * 0.92 * Math.sin(style.defaultDeg * DEG),
        }),
      claimedFrom: kind === 'weight' ? WORLD.earth : undefined,
    };
    onChange([...drawn, f]);
    setSelected(id);
    // Weight's agent is never in doubt — asking "who pulls it down?" for the one
    // force students DO get right is a nag. Every other kind gets asked.
    if (requireAgent && kind !== 'weight') setAskAgentFor(id);
  };

  const patch = (id: string, p: Partial<DrawnForce>) =>
    onChange(drawn.map((f) => (f.id === id ? { ...f, ...p } : f)));

  const remove = (id: string) => {
    onChange(drawn.filter((f) => f.id !== id));
    if (selected === id) setSelected(null);
    if (askAgentFor === id) setAskAgentFor(null);
  };

  const headDrag = usePointerDrag({
    svgRef,
    onStart: () => setDragging(true),
    onMove: (pt) => {
      if (!selected) return;
      const f = drawn.find((x) => x.id === selected);
      if (!f) return;
      const a = toScreen(f.anchor);
      const dx = pt.x - a.x, dy = a.y - pt.y;           // flip back to physics y
      const len = Math.hypot(dx, dy);
      if (len < 6) return;
      const angle = (Math.atan2(dy, dx) / DEG + 360) % 360;
      patch(selected, {
        angleDeg: Math.round(angle * 10) / 10,
        magnitude: Math.max(perPx * refPx * 0.32, Math.min(perPx * refPx * 1.77, len * perPx)),
        // THIS is the moment the arrow becomes a claim.
        aimed: true,
      });
    },
    onEnd: () => setDragging(false),
  });

  const tailDrag = usePointerDrag({
    svgRef,
    onStart: () => setDragging(true),
    onMove: (pt) => {
      if (!selected) return;
      patch(selected, { anchor: snapWorld(screenToWorld(pt, view)) });
    },
    onEnd: () => setDragging(false),
  });

  // ── Grading views ──────────────────────────────────────────────────────────

  const issues = grade?.issues ?? [];
  const flagged = new Set(issues.map((i) => i.forceId).filter(Boolean) as string[]);
  const solvedOk = !!grade?.correct;
  // Hints only after a SECOND failed attempt — a first miss is thinking, not failure.
  const showHints = attempts >= 2 && !solvedOk;
  const missingTrue = showHints
    ? trueForces.filter((t) => (grade?.missing ?? []).includes(t.id))
    : [];

  // Arrows the student has placed but not yet aimed. Nothing is graded while
  // any of these exist — see `DrawnForce.aimed`.
  const unaimed = drawn.filter((f) => f.aimed === false);

  const legendRows: LegendRow[] = drawn.map((f) => {
    const style = FORCE_STYLE[f.kind];
    const agent = f.aimed === false ? 'not aimed yet'
      : f.claimedFrom === undefined ? 'agent not named'
      : f.claimedFrom === '' ? 'no object applies it'
      : `from ${agentLabel(scene, f.claimedFrom)}`;
    return {
      id: f.id,
      color: flagged.has(f.id) ? BAD : style.color,   // sim-lint-ok — pass/fail pair
      name: style.label,
      detail: agent,
      value: f.aimed === false ? undefined
        : checkSizes || showValues || solvedOk ? `${fmtN(f.magnitude)} N` : undefined,
      dashed: style.dashed || f.aimed === false,
      muted: f.aimed === false,
      flagged: flagged.has(f.id),
    };
  });
  for (const t of missingTrue) {
    legendRows.push({
      id: `hint-${t.id}`, color: HINT_COLOR, name: 'Something acts here',
      detail: 'you have not drawn it', dashed: true, muted: true,
    });
  }

  const pending = askAgentFor ? drawn.find((f) => f.id === askAgentFor) : undefined;
  const agents = useMemo(() => agentsIn(scene, body.id), [scene, body.id]);
  const frameKind = scene.frame?.kind ?? 'inertial';

  /* Canvas footer — fixed height so swapping copy cannot reflow the board. */
  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-2" style={{ minHeight: 34 }}>
      <p className="text-[11px] leading-snug" style={{ color: TEXT.muted, maxWidth: '62%' }}>
        {unaimed.length > 0
          ? 'That arrow has no direction yet. Drag its big handle to point it — which way this force acts is your call, not the palette’s.'
          : selected
            ? 'Drag the big handle to aim and size it. Drag the small one to move where it acts.'
            : drawn.length === 0
              ? 'Tap a force in the palette to put it on the body.'
              : 'Tap an arrow to select it.'}
      </p>
      <div className="flex gap-2">
        {selected && (
          <ActionButton accent={BAD} onClick={() => remove(selected)}>Delete arrow</ActionButton>
        )}
        <ActionButton onClick={onReset}>Clear</ActionButton>
      </div>
    </div>
  );

  return (
    <StagePanels box={box} footer={footer} side={
      <>
        {/* WHERE ARE YOU STANDING. The punchline of the whole ladder: the same
            scene, described from two places, has two different correct
            diagrams. Two archetypes are built entirely around this and the
            control did not exist — `setFrame` was written and called from
            nowhere, so `lift-accelerating`'s own instruction ("switch the
            frame and draw it again") named an action the UI could not do.
            Switching keeps the arrows and drops the verdict on purpose: press
            Check again and watch the diagram that just passed now fail. */}
        {frames.length > 1 && (
          <Card tone="accent">
            <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: PRIMARY }}>
              Where are you standing?
            </div>
            <div className="flex flex-wrap gap-1.5">
              {frames.map((fr) => (
                <ActionButton key={fr.id} active={fr.id === frameId}
                  onClick={() => onPickFrame(fr.id)}>
                  {fr.label}
                </ActionButton>
              ))}
            </div>
            <p className="mt-1.5 text-[12px] leading-snug" style={{ color: TEXT.primary }}>
              {frames.find((fr) => fr.id === frameId)?.blurb}
            </p>
          </Card>
        )}

        {frames.length <= 1 && frameKind !== 'inertial' && (
          <Card tone="accent">
            <div className={TYPE.badge} style={{ color: PRIMARY }}>Non-inertial frame</div>
            <p className="mt-1 text-[12px] leading-snug" style={{ color: TEXT.primary }}>
              You are sitting {frameKind === 'rotating' ? 'on the rotating drum' : 'inside the accelerating box'},
              not on the ground. In this frame one extra force is real to you. In the ground frame it is not.
            </p>
          </Card>
        )}

        <Card>
          <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>{prompt}</p>
        </Card>

        {/* WHICH BODY. Arguably the first real decision in free-body analysis,
            and it used to be made for the student every single time — while
            three archetypes' own copy told them to "try the hanging mass" or
            "isolate the wedge". Changing the body starts a new diagram. */}
        {bodies.length > 1 && (
          <Card>
            <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
              Which body are you isolating?
            </div>
            <div className="flex flex-wrap gap-1.5">
              {bodies.map((b) => (
                <ActionButton key={b.id} active={b.id === body.id}
                  onClick={() => onPickBody(b.id)}>
                  {b.label ?? b.id}
                </ActionButton>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] leading-snug" style={{ color: TEXT.ghost }}>
              Every one of these has its own diagram, and a force on one of them is almost never a force on
              another. Switching here clears the arrows — that is the point.
            </p>
          </Card>
        )}

        {/* The agent question. Rendered in place of the palette so it reads as the
            natural next step of placing an arrow, not as an interruption. */}
        {pending ? (
          <Card tone="accent">
            <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: PRIMARY }}>
              What object is applying this {FORCE_STYLE[pending.kind].label.toLowerCase()}?
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {agents.map((a) => (
                <ActionButton key={a.id} full
                  onClick={() => { patch(pending.id, { claimedFrom: a.id }); setAskAgentFor(null); }}>
                  {a.label}
                </ActionButton>
              ))}
              <ActionButton full accent={BAD}
                onClick={() => { patch(pending.id, { claimedFrom: '' }); setAskAgentFor(null); }}>
                Nothing — it is just moving
              </ActionButton>
            </div>
          </Card>
        ) : (
          <Card>
            <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>Force palette</div>
            <div className="grid grid-cols-2 gap-1.5">
              {PALETTE_ORDER.map((k) => {
                const st = FORCE_STYLE[k];
                return (
                  <button key={k} type="button" onClick={() => place(k)}
                    className="rounded-lg px-2.5 py-2 text-left transition-all"
                    style={{
                      background: accentTint(st.color, 0.1),
                      border: `1px solid ${accentTint(st.color, 0.34)}`,
                      touchAction: 'manipulation',
                    }}>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full" style={{
                        width: 16, height: 3.5,
                        background: st.dashed
                          ? `repeating-linear-gradient(90deg, ${st.color} 0 4px, transparent 4px 8px)`
                          : st.color,
                      }} />
                      <span className="text-[12px] font-semibold" style={{ color: st.color }}>{st.label}</span>
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-tight" style={{ color: TEXT.ghost }}>
                      {st.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        <Legend title="Your diagram" rows={legendRows}
          selectedId={selected}
          onSelect={(id) => { if (!id.startsWith('hint-')) { setSelected(id); setFocusIssue(null); } }}
          empty="No forces yet. Every arrow you add will be named here." />

        {/* A "nothing applies it" claim is a teaching moment, not an error state. */}
        {drawn.some((f) => f.claimedFrom === '') && (
          <Card tone="bad">
            <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
              You said nothing applies one of these arrows. That is the honest answer — and it means the
              arrow is not a force. A force is one object acting on another; if you cannot name the other
              object, there is nothing there. Motion does not need a force to continue.
            </p>
          </Card>
        )}

        {/* Sizing is opt-in. A first free-body diagram is graded on WHAT is
            there, which way it points, and who applies it — grading the arrow
            lengths too would fail a student on arithmetic before they have any
            equations to do it with. Turning this on also unlocks the two
            magnitude misconceptions: f > μsN, and N = mg on an incline. */}
        <button type="button" onClick={onToggleSizes}
          className="self-start pb-0.5 text-[12px] font-semibold transition-colors"
          style={{
            color: checkSizes ? SECONDARY : TEXT.muted,
            borderBottom: `1px solid ${checkSizes ? accentTint(SECONDARY, 0.5) : 'rgba(255,255,255,0.1)'}`,
            background: 'none', touchAction: 'manipulation',
          }}>
          {checkSizes ? '✓ Arrow lengths count too' : 'Also check the arrow lengths'}
        </button>

        {/* The Check gate. Closed while any arrow is unaimed, because grading a
            stub means grading the palette's default — and a misconception panel
            is an accusation. See `DrawnForce.aimed`. */}
        {(() => {
          const ready = drawn.length > 0 && unaimed.length === 0;
          return (
            <div className="flex items-center gap-2">
              <button type="button" onClick={onCheck} disabled={!ready}
                title={unaimed.length > 0
                  ? 'Aim every arrow first — an arrow with no direction is not yet a claim about the physics.'
                  : undefined}
                className="flex-1 rounded-lg px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-all"
                style={{
                  background: ready ? accentTint(PRIMARY, 0.2) : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${ready ? accentTint(PRIMARY, 0.45) : BORDER.card}`,
                  color: ready ? PRIMARY : TEXT.muted,
                  cursor: ready ? 'pointer' : 'not-allowed',
                  touchAction: 'manipulation',
                }}>
                {unaimed.length > 0
                  ? `Aim ${unaimed.length} arrow${unaimed.length === 1 ? '' : 's'} first`
                  : 'Check my diagram'}
              </button>
              {grade && <Pill tone={solvedOk ? 'ok' : 'bad'}>{solvedOk ? 'Correct' : `${issues.length} to think about`}</Pill>}
            </div>
          );
        })()}

        {solvedOk && (
          <Card tone="ok">
            <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
              {successMessage ?? 'That is the complete free-body diagram. Every arrow has an object behind it, and nothing is there that should not be.'}
            </p>
          </Card>
        )}

        {/* Diagnostics: each names the misconception and asks a question. */}
        {issues.map((iss, i) => (
          <Diagnostic key={`${iss.code}-${i}`} code={iss.code} message={iss.message} hint={iss.hint}
            tone={iss.severity}
            located={focusIssue !== null && focusIssue === iss.forceId}
            onLocate={iss.forceId ? () => setFocusIssue((cur) => (cur === iss.forceId ? null : iss.forceId!)) : undefined} />
        ))}

        {attempts === 1 && !solvedOk && issues.length > 0 && (
          <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
            Fix what you can from the notes above. If the next check still misses something, the panel will
            show you where it acts — but not what it is.
          </p>
        )}
      </>
    }>
      {/* ── Isolation canvas ── viewBox = the measured pixel box, so 1 unit is
          1 CSS px: radii below are real screen sizes at every zoom. */}
      {box.ready && (
        <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} style={boardSvgStyle}
          onPointerDown={() => setSelected(null)}>

          {/* The isolated body. Nothing else — that IS the isolation. */}
          {outline.length ? (
            <polygon
              points={outline.map((p) => { const q = toScreen(p); return `${q.x},${q.y}`; }).join(' ')}
              fill={accentTint(PRIMARY, 0.2)} stroke={PRIMARY} strokeWidth={2.4} strokeLinejoin="round" />
          ) : (
            <circle cx={centre.x} cy={centre.y} r={(body.radius ?? 0.25) * view.scale}
              fill={accentTint(PRIMARY, 0.2)} stroke={PRIMARY} strokeWidth={2.4} />
          )}
          <circle cx={centre.x} cy={centre.y} r={3.2} fill={PRIMARY} />

          {/* Anchor candidates, shown only while an arrow is selected. */}
          {selected && anchors.map((a) => {
            const q = toScreen(a.at);
            return <circle key={a.key} cx={q.x} cy={q.y} r={3} fill={TEXT.muted} opacity={0.5} />;
          })}

          {/* "Something acts here" hints — a ring at the attachment point. It
              reveals THAT a force is missing without revealing which one. */}
          {missingTrue.map((t) => {
            const s = toScreen(t.applicationPoint ?? { x: 0, y: 0 });
            return (
              <circle key={t.id} cx={s.x} cy={s.y} r={13} fill="none"
                stroke={HINT_COLOR} strokeWidth={2} strokeDasharray="5 5">
                <animate attributeName="opacity" values="0.75;0.2;0.75" dur="1.9s" repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* The student's arrows. An UNAIMED one is drawn as a short dashed
              stub at reduced opacity: it is visibly a placeholder, so nothing
              on the canvas ever asserts a direction the student did not pick. */}
          {drawn.map((f) => {
            const style = FORCE_STYLE[f.kind];
            const stub = f.aimed === false;
            const from = toScreen(f.anchor);
            const len = stub ? refPx * 0.42 : lengthPxOf(f.magnitude);
            const to = { x: from.x + len * Math.cos(f.angleDeg * DEG), y: from.y - len * Math.sin(f.angleDeg * DEG) };
            const isFlagged = flagged.has(f.id);
            const dimmed = focusIssue !== null && focusIssue !== f.id;
            return (
              <g key={f.id}>
                {/* sim-lint-ok — BAD is the sanctioned pass/fail colour. */}
                <Arrow from={from} to={to}
                  color={isFlagged ? BAD : style.color}
                  dashed={style.dashed || stub}
                  width={selected === f.id ? 4.2 : 3.4}
                  opacity={dimmed ? 0.22 : stub ? 0.42 : 1}
                  halo={selected === f.id || focusIssue === f.id} />
                {/* Invisible fat hit target — a 3px arrow is not tappable. */}
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke="transparent" strokeWidth={28} strokeLinecap="round"
                  style={{ cursor: 'pointer', touchAction: 'none' }}
                  onPointerDown={(e) => { e.stopPropagation(); setSelected(f.id); setFocusIssue(null); }} />
              </g>
            );
          })}

          {/* Handles for the selected arrow: head aims + sizes, tail moves the
              attachment point. Both are pointer-driven, and each carries a
              transparent hit disc ≥40px across — the visible ring can stay
              small without the target becoming a phone-sized miss. */}
          {selected && (() => {
            const f = drawn.find((x) => x.id === selected);
            if (!f) return null;
            const stub = f.aimed === false;
            const from = toScreen(f.anchor);
            const len = stub ? refPx * 0.42 : lengthPxOf(f.magnitude);
            const to = { x: from.x + len * Math.cos(f.angleDeg * DEG), y: from.y - len * Math.sin(f.angleDeg * DEG) };
            return (
              <g>
                {/* Tail first, head last: on a SHORT arrow the two hit discs
                    overlap, and the head — aim and size, the gesture students
                    actually reach for — has to be the one that wins. */}
                <circle cx={from.x} cy={from.y} r={HIT.tail.r} fill={accentTint(SECONDARY, 0.25)}
                  stroke={SECONDARY} strokeWidth={1.8} style={{ pointerEvents: 'none' }} />
                <circle cx={from.x} cy={from.y} r={HIT.tail.hit} fill="transparent"
                  style={{ cursor: 'grab', touchAction: 'none' }}
                  onPointerDown={tailDrag} />
                <circle cx={to.x} cy={to.y} r={HIT.head.r} fill={accentTint(SECONDARY, 0.35)}
                  stroke={SECONDARY} strokeWidth={2} style={{ pointerEvents: 'none' }}>
                  {/* An unaimed arrow pulses its head: the one thing the student
                      still has to do is right there, asking to be dragged. */}
                  {stub && <animate attributeName="r"
                    values={`${HIT.head.r - 2};${HIT.head.r + 3};${HIT.head.r - 2}`}
                    dur="1.5s" repeatCount="indefinite" />}
                </circle>
                <circle cx={to.x} cy={to.y} r={HIT.head.hit} fill="transparent"
                  style={{ cursor: 'grab', touchAction: 'none' }}
                  onPointerDown={headDrag} />
              </g>
            );
          })()}
        </svg>
      )}
    </StagePanels>
  );
}

/** Bodies a student may isolate. A fixed wedge stays selectable on purpose —
 *  "draw the FBD of the wedge" is where the third-law pair finally lands
 *  somewhere other than the block. */
export function selectableBodies(scene: Scene): Body[] {
  return scene.bodies.filter((b) => b.shape !== 'pulley');
}
