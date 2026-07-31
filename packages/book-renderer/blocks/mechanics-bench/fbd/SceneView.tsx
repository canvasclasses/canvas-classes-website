'use client';

/*
 * fbd/SceneView.tsx — the world canvas.
 * ─────────────────────────────────────────────────────────────────────────────
 * Draws the composed scene: the ground/wall/ceiling fixtures, every body, the
 * strings, and the applied forces the student has added. It carries NO text (see
 * theme.ts) — a body is identified by selecting its row in the legend, which
 * halos it here.
 *
 * SIZING. The viewBox is the board's MEASURED pixel box and the SVG is absolutely
 * positioned inside it (`boardSvgStyle`), so one viewBox unit is one CSS pixel
 * and the element can neither overflow the wrapper nor be collapsed by a sidebar
 * growing next to it. The earlier shape — an aspect-ratio viewBox with
 * `width:100%` and no height — silently cropped 152px off the bottom of a
 * 360px-tall board. See `fbd/canvas.tsx` for the whole story.
 */

import React from 'react';
import type { Scene, Body, Vec2 } from '../types';
import { WORLD } from '../types';
import { worldToScreen, arrowPath } from '../lib/svg';
import type { View } from '../lib/svg';
import {
  FORCE_STYLE, PRIMARY, SECONDARY, TEXT, accentTint, appliedArrowPx,
} from './theme';
import { boardSvgStyle } from './canvas';
import { bodyOutline, sceneBounds, findBody, DEG } from './sceneEdit';

// ── Arrow ────────────────────────────────────────────────────────────────────

/**
 * One force arrow, in SCREEN coordinates. The geometry comes from the engine's
 * `arrowPath` (shaft + filled head) so FBD Studio and Pulley Lab cannot drift
 * into two different-looking arrowheads.
 *
 * Only the SHAFT carries the dash pattern — a dashed arrowhead reads as a
 * rendering bug rather than as "this force is not a real interaction".
 */
export function Arrow({ from, to, color, dashed, opacity = 1, width = 3.4, halo }: {
  from: Vec2; to: Vec2; color: string; dashed?: boolean;
  opacity?: number; width?: number; halo?: boolean;
}) {
  const { shaft, head } = arrowPath(from, to, Math.max(9, width * 3));
  return (
    <g opacity={opacity} style={{ pointerEvents: 'none' }}>
      {halo && (
        <path d={shaft} fill="none" stroke={color} strokeWidth={width + 8}
          strokeLinecap="round" opacity={0.22} />
      )}
      <path d={shaft} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dashed ? '9 6' : undefined} />
      {head && <path d={head} fill={color} stroke={color} strokeWidth={1} strokeLinejoin="round" />}
    </g>
  );
}

/** An arrow described in world space (metres + physics degrees). */
export function WorldArrow({ at, angleDeg, lengthPx, view, ...rest }: {
  at: Vec2; angleDeg: number; lengthPx: number; view: View;
  color: string; dashed?: boolean; opacity?: number; width?: number; halo?: boolean;
}) {
  const from = worldToScreen(at, view);
  const to = {
    x: from.x + lengthPx * Math.cos(angleDeg * DEG),
    y: from.y - lengthPx * Math.sin(angleDeg * DEG),   // physics y is UP
  };
  return <Arrow from={from} to={to} {...rest} />;
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

function Fixtures({ scene, view, w, h }: { scene: Scene; view: View; w: number; h: number }) {
  const used = new Set<string>();
  for (const c of scene.contacts) used.add(c.bodyB);
  for (const s of scene.strings) for (const p of s.path) used.add(p);

  const b = sceneBounds(scene);
  const items: React.ReactNode[] = [];

  const hatch = (x1: number, y1: number, x2: number, y2: number, key: string, vertical: boolean) => {
    const n = 26;
    const ticks: React.ReactNode[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
      ticks.push(<line key={i} x1={px} y1={py}
        x2={px + (vertical ? -11 : 9)} y2={py + (vertical ? 9 : 11)}
        stroke={TEXT.muted} strokeWidth={1.4} opacity={0.55} />);
    }
    return <g key={key}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={TEXT.secondary} strokeWidth={2.2} opacity={0.8} />
      {ticks}
    </g>;
  };

  if (used.has(WORLD.ground)) {
    const y = worldToScreen({ x: 0, y: 0 }, view).y;
    items.push(hatch(6, y, w - 6, y, 'ground', false));
  }
  if (used.has(WORLD.ceiling)) {
    const y = worldToScreen({ x: 0, y: b.maxY + 0.45 }, view).y;
    items.push(
      <g key="ceiling">
        <line x1={6} y1={y} x2={w - 6} y2={y} stroke={TEXT.secondary} strokeWidth={2.2} opacity={0.8} />
        {Array.from({ length: 27 }, (_, i) => {
          const px = 8 + i * ((w - 16) / 26);
          return <line key={i} x1={px} y1={y} x2={px + 9} y2={y - 11} stroke={TEXT.muted} strokeWidth={1.4} opacity={0.55} />;
        })}
      </g>
    );
  }
  if (used.has(WORLD.wall)) {
    const x = worldToScreen({ x: b.minX - 0.25, y: 0 }, view).x;
    items.push(hatch(x, 6, x, h - 6, 'wall', true));
  }
  return <>{items}</>;
}

// ── Bodies ───────────────────────────────────────────────────────────────────

/**
 * The selection halo, as a box fitted to the body's own screen footprint.
 *
 * It used to be a circle of radius `bodyRadius(body) * scale + 16`. On a wedge
 * that radius is over a metre, so the "halo" came out as a 380px circle sliced
 * by the canvas edges and read as a mysterious arc drawn across the diagram —
 * clearly visible on `body-on-incline` and `block-on-movable-wedge` in the
 * 2026-07-29 browser pass. A box around the body's own outline cannot exceed
 * that outline by more than its padding, on any shape, at any zoom.
 */
function haloBox(body: Body, view: View) {
  const pts = bodyOutline(body).map((p) => worldToScreen(p, view));
  if (!pts.length) {
    const c = worldToScreen(body.pos, view);
    const r = (body.radius ?? 0.25) * view.scale;
    pts.push({ x: c.x - r, y: c.y - r }, { x: c.x + r, y: c.y + r });
  }
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const pad = 7;
  const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad;
  const y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  return { x: x0, y: y0, w: Math.max(10, x1 - x0), h: Math.max(10, y1 - y0) };
}

function BodyGlyph({ body, view, selected, dim, halo, onSelect }: {
  body: Body; view: View; selected?: boolean; dim?: boolean; halo?: boolean;
  onSelect?: (id: string) => void;
}) {
  const poly = bodyOutline(body);
  const centre = worldToScreen(body.pos, view);
  const accent = body.fixed ? TEXT.secondary : PRIMARY;
  const stroke = selected ? SECONDARY : accent;
  const opacity = dim ? 0.28 : 1;
  const common = {
    fill: accentTint(stroke, body.fixed ? 0.1 : 0.2),
    stroke,
    strokeWidth: selected ? 3 : 2,
    strokeLinejoin: 'round' as const,
  };

  const clickable = onSelect
    ? { onPointerDown: (e: React.PointerEvent) => { e.stopPropagation(); onSelect(body.id); },
        style: { cursor: 'pointer', touchAction: 'manipulation' as const } }
    : {};

  return (
    <g opacity={opacity} {...clickable}>
      {halo && (() => {
        const hb = haloBox(body, view);
        return (
          <rect x={hb.x} y={hb.y} width={hb.w} height={hb.h}
            rx={Math.min(14, Math.min(hb.w, hb.h) / 3)}
            fill="none" stroke={SECONDARY} strokeWidth={2} strokeDasharray="7 5" opacity={0.6}>
            {/* Only the opacity pulses. Growing the geometry is what turned this
                into a canvas-spanning arc in the first place. */}
            <animate attributeName="opacity" values="0.75;0.25;0.75" dur="1.7s" repeatCount="indefinite" />
          </rect>
        );
      })()}
      {poly.length > 0 ? (
        <polygon points={poly.map((p) => { const s = worldToScreen(p, view); return `${s.x},${s.y}`; }).join(' ')} {...common} />
      ) : body.shape === 'pulley' || (body.shape === 'sphere' && body.fixed) ? (
        <g>
          <circle cx={centre.x} cy={centre.y} r={(body.radius ?? 0.2) * view.scale}
            fill="none" stroke={stroke} strokeWidth={body.fixed && body.shape === 'sphere' ? 4 : 3} />
          {body.shape === 'pulley' && (
            <circle cx={centre.x} cy={centre.y} r={4} fill={stroke} />
          )}
        </g>
      ) : (
        <circle cx={centre.x} cy={centre.y} r={(body.radius ?? 0.25) * view.scale} {...common} />
      )}
      {/* Centre-of-mass dot — the anchor weight is drawn from. No text. */}
      {!body.fixed && <circle cx={centre.x} cy={centre.y} r={2.6} fill={stroke} opacity={0.85} />}
    </g>
  );
}

// ── Strings ──────────────────────────────────────────────────────────────────

function Strings({ scene, view }: { scene: Scene; view: View }) {
  const b = sceneBounds(scene);
  const pointFor = (id: string): Vec2 | null => {
    if (id === WORLD.ceiling) return null;   // resolved against the neighbour below
    const body = findBody(scene, id);
    return body ? body.pos : null;
  };
  return (
    <>
      {scene.strings.map((s) => {
        const pts: Vec2[] = [];
        s.path.forEach((id, i) => {
          if (id === WORLD.ceiling) {
            const nb = pointFor(s.path[i + 1] ?? s.path[i - 1]);
            if (nb) pts.push({ x: nb.x, y: b.maxY + 0.45 });
            return;
          }
          const p = pointFor(id);
          if (p) pts.push(p);
        });
        if (pts.length < 2) return null;
        const d = pts.map((p) => worldToScreen(p, view)).map((s2, i) => `${i ? 'L' : 'M'}${s2.x},${s2.y}`).join(' ');
        // sim-lint-ok — the string is drawn in the tension colour because the
        // string IS the tension axis; it is keyed to the legend like every arrow.
        return (
          <path key={s.id} d={d} fill="none"
            stroke={FORCE_STYLE.tension.color}
            strokeWidth={s.taut ? 2.6 : 2}
            strokeDasharray={s.taut ? undefined : '6 5'}
            opacity={s.taut ? 0.9 : 0.45} strokeLinecap="round" />
        );
      })}
    </>
  );
}

// ── The canvas ───────────────────────────────────────────────────────────────

export default function SceneView({
  scene, view, w, h, svgRef, selectedId, onSelectBody, haloId, dimIds, children,
  onBackgroundDown, arrowRef = 95,
}: {
  scene: Scene; view: View; w: number; h: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
  selectedId?: string | null;
  onSelectBody?: (id: string) => void;
  haloId?: string | null;
  dimIds?: string[];
  children?: React.ReactNode;
  onBackgroundDown?: (e: React.PointerEvent) => void;
  /** Reference arrow length for this board's width — see `arrowRefPx`. */
  arrowRef?: number;
}) {
  const dim = new Set(dimIds ?? []);
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      // The viewBox IS the measured pixel box, so this fills the wrapper exactly
      // at 1 unit = 1 CSS px. See the file header.
      style={boardSvgStyle}
      onPointerDown={onBackgroundDown}
    >
      <Fixtures scene={scene} view={view} w={w} h={h} />
      <Strings scene={scene} view={view} />
      {scene.bodies.map((b) => (
        <BodyGlyph key={b.id} body={b} view={view}
          selected={selectedId === b.id} halo={haloId === b.id}
          dim={dim.has(b.id)} onSelect={onSelectBody} />
      ))}
      {/* Applied forces are part of the SCENE the student built, so they show
          here even before the FBD stage — that is what makes it their problem. */}
      {(scene.applied ?? []).map((a) => {
        const body = findBody(scene, a.body);
        if (!body) return null;
        // sim-lint-ok — legend-keyed force colour, drawn inside the visualization.
        return (
          <WorldArrow key={a.id} at={body.pos} angleDeg={a.angleDeg}
            lengthPx={appliedArrowPx(a.mag, arrowRef)} view={view}
            color={FORCE_STYLE.applied.color} width={3.4} />
        );
      })}
      {children}
    </svg>
  );
}
