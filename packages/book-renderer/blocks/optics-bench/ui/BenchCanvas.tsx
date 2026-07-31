'use client';

/*
 * optics-bench/ui/BenchCanvas.tsx — the drawing, and it comes from the TRACE.
 * ─────────────────────────────────────────────────────────────────────────────
 * Every line on this canvas is a segment the ray tracer produced. The formula
 * panel beside it is computed independently and is never consulted here — so
 * when a wide lens shows its marginal rays crossing short of the paraxial
 * focus, that is the picture disagreeing with the formula, which is the point.
 *
 * ── Rules this file holds ────────────────────────────────────────────────────
 * • EXACTLY ONE <text>. Every other label lives in the legend below the canvas
 *   (`ui/parts.tsx`), keyed by the same glyph drawn here. Label collision is a
 *   recurring bug class in this repo and one text element cannot collide.
 * • Virtual segments (`real: false`) are DASHED. Students routinely read a
 *   back-extension construction line as actual light — the dash is the whole
 *   difference between "the image is there" and "the image looks like it is
 *   there", and it is the `image_needs_screen` misconception made visible.
 * • Fit to content, 60–75% linear fill, same scale on both axes. A stretched
 *   axis would make a 30° prism look like 60° and silently contradict the
 *   number printed next to it.
 * • Pointer events, never mouse events. Never gated on an animation clock —
 *   there isn't one, and a drag that only works while something is "playing"
 *   has shipped in this repo before.
 */

import * as React from 'react';
import type { Bench, OpticalElement, Vec2 } from '../types';
import type { OpticsTrace } from '../lib/trace';
import {
  boundsOf, fitView, padBounds, screenToWorld, unionBounds, worldToScreen,
  type Bounds, type View,
} from '../../mechanics-bench/lib/svg';
import { cartesianFocal, isLens, lensRadii, lensThickness } from '../lib/convention';
import { elementPolygon, slabLength } from '../lib/surfaces';
import { wavelengthCSS } from '../lib/spectral';
import { TEXT } from '../../simulations/_shared';
import {
  AXIS, GHOST, GLASS_FILL, GLASS_LINE, HARDWARE, LIGHT, RAY_BLOCKED, RAY_CONSTRUCTION,
  RAY_FAN, SIM_CANVAS, TICK,
} from './theme';

export interface CanvasLayers {
  rays: boolean;
  construction: boolean;
  image: boolean;
  intermediates: boolean;
  focalPoints: boolean;
}

export interface BenchCanvasProps {
  bench: Bench;
  trace: OpticsTrace;
  width: number;
  height: number;
  layers: CanvasLayers;
  /** THE one text element. Keep it short — it is a status line, not a caption. */
  status?: string;
  /** Colour rays by wavelength. Only dispersion needs it. */
  spectral?: boolean;
  /** Drag the object along the bench. */
  onDragObject?: (world: Vec2) => void;
  /** Drag an element along the bench (assembler). */
  onDragElement?: (id: string, x: number) => void;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
}

// ── Bounds of the meaningful content ─────────────────────────────────────────

function elementPoints(el: OpticalElement): Vec2[] {
  const y = el.y ?? 0;
  const a = el.aperture ?? 3;
  const poly = elementPolygon(el);
  if (poly) return poly;
  const pts: Vec2[] = [{ x: el.x, y: y - a }, { x: el.x, y: y + a }];
  if (el.kind === 'thick-lens') {
    const n = el.n ?? 1.5;
    const { R1, R2 } = lensRadii(el, n);
    const d = lensThickness(R1, R2, a);
    pts.push({ x: el.x - d / 2 - 0.2, y }, { x: el.x + d / 2 + 0.2, y });
  }
  if (el.kind === 'eye') {
    const axial = el.radius && el.radius > 0 ? el.radius : 2.5;
    pts.push({ x: el.x + axial, y: y - a * 1.4 }, { x: el.x + axial, y: y + a * 1.4 });
  }
  if (el.kind === 'aperture') {
    pts.push({ x: el.x, y: y - a - 1.2 }, { x: el.x, y: y + a + 1.2 });
  }
  return pts;
}

function contentBounds(bench: Bench, trace: OpticsTrace, showFoci: boolean): Bounds {
  let b: Bounds | null = null;
  for (const el of bench.elements) {
    b = unionBounds(b, boundsOf(elementPoints(el)));
    if (showFoci) {
      const f = cartesianFocal(el);
      if (f !== null && Number.isFinite(f) && Math.abs(f) < 400) {
        b = unionBounds(b, boundsOf([{ x: el.x - f, y: el.y ?? 0 }, { x: el.x + f, y: el.y ?? 0 }]));
      }
    }
  }
  for (const s of bench.sources) {
    b = unionBounds(b, boundsOf([{ x: s.x, y: 0 }, { x: s.x, y: s.y ?? 0 }]));
  }
  const img = trace.finalImage;
  if (img && img.x !== null && Math.abs(img.x) < 1e4) {
    b = unionBounds(b, boundsOf([{ x: img.x, y: 0 }, { x: img.x, y: img.y ?? 0 }]));
  }
  for (const { image } of trace.images) {
    if (image.x !== null && Math.abs(image.x) < 1e4) {
      b = unionBounds(b, boundsOf([{ x: image.x, y: image.y ?? 0 }]));
    }
  }
  if (!b) b = { minX: -10, minY: -5, maxX: 10, maxY: 5 };

  // A bench is nearly always much wider than it is tall. Give the vertical a
  // floor of a quarter of the horizontal span so a 60 cm fibre 2 cm across is
  // not scaled until the glass is a hairline.
  const w = Math.max(b.maxX - b.minX, 1);
  const h = b.maxY - b.minY;
  const wantH = Math.max(h, w * 0.26);
  const cy = (b.minY + b.maxY) / 2;
  return padBounds(
    { minX: b.minX, maxX: b.maxX, minY: cy - wantH / 2, maxY: cy + wantH / 2 },
    w * 0.045,
  );
}

// ── Element drawing ──────────────────────────────────────────────────────────

function lensPath(el: OpticalElement, view: View): string {
  const y = el.y ?? 0;
  const a = el.aperture ?? 3;
  const f = cartesianFocal(el) ?? 10;
  const converging = f > 0;
  const top = worldToScreen({ x: el.x, y: y + a }, view);
  const bot = worldToScreen({ x: el.x, y: y - a }, view);
  // Bulge is cosmetic; it only has to READ as convex or concave at a glance.
  const bulge = Math.max(3, Math.min(18, (a * view.scale) / 5));
  const k = converging ? bulge : -bulge;
  return (
    `M ${top.x} ${top.y} Q ${top.x + k} ${(top.y + bot.y) / 2} ${bot.x} ${bot.y} `
    + `Q ${bot.x - k} ${(top.y + bot.y) / 2} ${top.x} ${top.y} Z`
  );
}

function thickLensPath(el: OpticalElement, view: View): string {
  const y = el.y ?? 0;
  const a = el.aperture ?? 3;
  const n = el.n ?? 1.5;
  const { R1, R2 } = lensRadii(el, n);
  const d = lensThickness(R1, R2, a);
  const arc = (vx: number, R: number, dir: 1 | -1) => {
    const p1 = worldToScreen({ x: vx + sag(R, a) * (R > 0 ? 1 : -1) * 0, y: y + a * dir }, view);
    return p1;
  };
  const sag = (R: number, ap: number) => {
    const r = Math.abs(R);
    return r <= ap ? 0 : r - Math.sqrt(r * r - ap * ap);
  };
  const x1 = el.x - d / 2;
  const x2 = el.x + d / 2;
  const s1 = sag(R1, a) * (R1 > 0 ? 1 : -1);
  const s2 = sag(R2, a) * (R2 > 0 ? 1 : -1);
  const topA = worldToScreen({ x: x1 + s1, y: y + a }, view);
  const botA = worldToScreen({ x: x1 + s1, y: y - a }, view);
  const topB = worldToScreen({ x: x2 + s2, y: y + a }, view);
  const botB = worldToScreen({ x: x2 + s2, y: y - a }, view);
  const v1 = worldToScreen({ x: x1, y }, view);
  const v2 = worldToScreen({ x: x2, y }, view);
  void arc;
  return (
    `M ${topA.x} ${topA.y} Q ${v1.x} ${(topA.y + botA.y) / 2} ${botA.x} ${botA.y} `
    + `L ${botB.x} ${botB.y} Q ${v2.x} ${(topB.y + botB.y) / 2} ${topB.x} ${topB.y} Z`
  );
}

function mirrorPath(el: OpticalElement, view: View): string {
  const y = el.y ?? 0;
  const a = el.aperture ?? 3;
  const f = cartesianFocal(el);
  const top = worldToScreen({ x: el.x, y: y + a }, view);
  const bot = worldToScreen({ x: el.x, y: y - a }, view);
  if (f === null || !Number.isFinite(f)) return `M ${top.x} ${top.y} L ${bot.x} ${bot.y}`;
  const R = 2 * f;
  const sag = Math.abs(R) <= a ? a * 0.5 : Math.abs(R) - Math.sqrt(R * R - a * a);
  // Cartesian: R < 0 (concave) puts the centre of curvature upstream, so the
  // rim bows toward −x. R > 0 (convex) bows the other way.
  const rimX = el.x + (R < 0 ? -sag : sag);
  const rim = worldToScreen({ x: rimX, y }, view);
  const vtx = worldToScreen({ x: el.x, y }, view);
  const ctrl = 2 * rim.x - vtx.x;
  return `M ${top.x} ${top.y} Q ${ctrl} ${vtx.y} ${bot.x} ${bot.y}`;
}

function ElementShape({ el, view, selected }:
  { el: OpticalElement; view: View; selected: boolean }) {
  const y = el.y ?? 0;
  const a = el.aperture ?? 3;
  const stroke = selected ? LIGHT : GLASS_LINE;
  const sw = selected ? 2.4 : 1.7;

  if (el.kind === 'thin-lens') {
    return <path d={lensPath(el, view)} fill={GLASS_FILL} stroke={stroke} strokeWidth={sw} />;
  }
  if (el.kind === 'thick-lens') {
    return <path d={thickLensPath(el, view)} fill={GLASS_FILL} stroke={stroke} strokeWidth={sw} />;
  }
  if (el.kind === 'mirror-spherical' || el.kind === 'mirror-plane') {
    const d = mirrorPath(el, view);
    return (
      <g>
        <path d={d} fill="none" stroke={stroke} strokeWidth={sw + 0.8} />
        <path d={d} fill="none" stroke={HARDWARE} strokeWidth={sw + 5} strokeOpacity={0.16}
          transform={`translate(${el.kind === 'mirror-plane' ? 4 : 5},0)`} />
      </g>
    );
  }
  if (el.kind === 'aperture') {
    const top = worldToScreen({ x: el.x, y: y + a }, view);
    const bot = worldToScreen({ x: el.x, y: y - a }, view);
    const bar = Math.max(5, view.h * 0.06);
    return (
      <g fill={HARDWARE}>
        <rect x={top.x - 3} y={0} width={6} height={Math.max(0, top.y)} rx={1.5} />
        <rect x={bot.x - 3} y={bot.y} width={6} height={Math.max(0, view.h - bot.y)} rx={1.5} />
        <rect x={top.x - 5} y={top.y - bar * 0.12} width={10} height={2.5} rx={1.2} opacity={0.9} />
        <rect x={bot.x - 5} y={bot.y - 1.2} width={10} height={2.5} rx={1.2} opacity={0.9} />
      </g>
    );
  }
  if (el.kind === 'screen') {
    const top = worldToScreen({ x: el.x, y: y + a }, view);
    const bot = worldToScreen({ x: el.x, y: y - a }, view);
    return (
      <g>
        <rect x={top.x - 3.5} y={top.y} width={7} height={Math.abs(bot.y - top.y)} rx={2}
          fill={GLASS_FILL} stroke={stroke} strokeWidth={sw} />
      </g>
    );
  }
  if (el.kind === 'eye') {
    const axial = el.radius && el.radius > 0 ? el.radius : 2.5;
    const lens = lensPath({ ...el, focalLength: Math.abs(el.focalLength ?? 2.5) }, view);
    const rt = worldToScreen({ x: el.x + axial, y: y + a * 1.35 }, view);
    const rb = worldToScreen({ x: el.x + axial, y: y - a * 1.35 }, view);
    const back = worldToScreen({ x: el.x + axial * 1.16, y }, view);
    return (
      <g>
        <path d={`M ${rt.x} ${rt.y} Q ${back.x} ${(rt.y + rb.y) / 2} ${rb.x} ${rb.y}`}
          fill="none" stroke={stroke} strokeWidth={sw + 1.2} />
        <path d={lens} fill={GLASS_FILL} stroke={stroke} strokeWidth={sw} />
      </g>
    );
  }
  const poly = elementPolygon(el);
  if (poly) {
    const pts = poly.map((p) => worldToScreen(p, view)).map((p) => `${p.x},${p.y}`).join(' ');
    return <polygon points={pts} fill={GLASS_FILL} stroke={stroke} strokeWidth={sw} />;
  }
  return null;
}

// ── Object / image arrows ────────────────────────────────────────────────────

function Arrow({ base, tip, colour, dashed, width = 2.2, opacity = 1 }:
  { base: { x: number; y: number }; tip: { x: number; y: number };
    colour: string; dashed?: boolean; width?: number; opacity?: number }) {
  const dy = tip.y - base.y;
  const head = Math.min(9, Math.max(4, Math.abs(dy) * 0.32));
  const sgn = dy < 0 ? -1 : 1;
  return (
    <g opacity={opacity}>
      <line x1={base.x} y1={base.y} x2={tip.x} y2={tip.y + sgn * head * 0.6}
        stroke={colour} strokeWidth={width} strokeDasharray={dashed ? '5 4' : undefined} strokeLinecap="round" />
      <path
        d={`M ${tip.x} ${tip.y} L ${tip.x - head * 0.55} ${tip.y + sgn * head} L ${tip.x + head * 0.55} ${tip.y + sgn * head} Z`}
        fill={colour}
      />
    </g>
  );
}

// ── The canvas ───────────────────────────────────────────────────────────────

export default function BenchCanvas({
  bench, trace, width, height, layers, status, spectral,
  onDragObject, onDragElement, selectedElementId, onSelectElement,
}: BenchCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const prevView = React.useRef<View | null>(null);
  const [drag, setDrag] = React.useState<{ kind: 'object' | 'element'; id?: string } | null>(null);

  const w = Math.max(120, width);
  const h = Math.max(140, height);

  const view = React.useMemo(() => {
    const b = contentBounds(bench, trace, layers.focalPoints);
    // padFrac 0.13 puts the content at ~74% of the board on its binding axis —
    // inside the 60–75% the design workflow asks for, with room for arrowheads.
    const v = fitView(b, w, h, { padFrac: 0.13, maxScale: 4000, minScale: 0.05 });
    prevView.current = v;
    return v;
  }, [bench, trace, layers.focalPoints, w, h]);

  const toScreen = React.useCallback((p: Vec2) => worldToScreen(p, view), [view]);

  const clientToWorld = React.useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    if (r.width < 1) return null;
    const px = ((e.clientX - r.left) * w) / r.width;
    const py = ((e.clientY - r.top) * h) / r.height;
    return screenToWorld({ x: px, y: py }, view);
  }, [view, w, h]);

  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const p = clientToWorld(e);
    if (!p) return;
    if (drag.kind === 'object') onDragObject?.(p);
    else if (drag.id) onDragElement?.(drag.id, p.x);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!drag) return;
    setDrag(null);
    try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch { /* already released */ }
  };

  const src = bench.sources[0];
  const axisY = toScreen({ x: 0, y: 0 }).y;
  const img = trace.finalImage;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Optical bench ray diagram"
      style={{ background: SIM_CANVAS, borderRadius: 12, display: 'block', touchAction: 'none' }}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <defs>
        <clipPath id="ob-clip">
          <rect x={0} y={0} width={w} height={h} rx={12} />
        </clipPath>
      </defs>

      <g clipPath="url(#ob-clip)">
        {/* Principal axis — light travels left to right along it. */}
        <line x1={0} y1={axisY} x2={w} y2={axisY} stroke={AXIS} strokeWidth={1} strokeDasharray="6 6" />

        {/* Focal points and centres of curvature. */}
        {layers.focalPoints && bench.elements.map((el) => {
          const f = cartesianFocal(el);
          if (f === null || !Number.isFinite(f) || !(isLens(el.kind) || el.kind === 'mirror-spherical')) return null;
          const y = el.y ?? 0;
          const marks = el.kind === 'mirror-spherical'
            ? [el.x + f, el.x + 2 * f]
            : [el.x - f, el.x + f];
          return marks.map((mx, i) => {
            const p = toScreen({ x: mx, y });
            if (p.x < -20 || p.x > w + 20) return null;
            return (
              <g key={`${el.id}-f${i}`}>
                <line x1={p.x} y1={p.y - 5} x2={p.x} y2={p.y + 5} stroke={TICK} strokeWidth={1.4} />
                <circle cx={p.x} cy={p.y} r={2} fill={TICK} />
              </g>
            );
          });
        })}

        {/* THE RAYS. Every one of these is a traced segment. */}
        {layers.rays && trace.rays.map((ray) => {
          const meta = trace.meta[ray.id];
          const construction = meta?.role === 'construction' || meta?.role === 'chief';
          if (construction && !layers.construction) return null;
          const blocked = ray.terminated === 'missed-element';
          return ray.segments.map((seg, i) => {
            const a = toScreen(seg.from);
            const b = toScreen(seg.to);
            const colour = spectral
              // sim-lint-ok — wavelength-accurate spectral colour. A 486 nm ray
              // drawn in the house accent is a lie about the physics; dispersion
              // is unteachable without real colours.
              ? wavelengthCSS(seg.wavelength ?? 550, seg.real ? 0.95 : 0.5)
              : blocked ? RAY_BLOCKED
                : construction ? RAY_CONSTRUCTION : RAY_FAN;
            return (
              <line
                key={`${ray.id}-${i}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={colour}
                strokeWidth={construction ? 1.9 : 1.25}
                strokeOpacity={seg.real ? 1 : 0.75}
                // A back-extension is not light. The dash IS the difference
                // between "the image is there" and "it looks like it is there".
                strokeDasharray={seg.real ? undefined : '5 4'}
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* Intermediate images — the thing students never see drawn. */}
        {layers.intermediates && trace.images.map(({ elementId, image }) => {
          if (image.x === null || Math.abs(image.x) > 1e4) return null;
          if (img && image.x === img.x && image.y === img.y) return null;
          const base = toScreen({ x: image.x, y: 0 });
          const tip = toScreen({ x: image.x, y: image.y ?? 0 });
          if (Math.abs(tip.y - base.y) < 1.5) return null;
          return (
            <Arrow key={`mid-${elementId}`} base={base} tip={tip} colour={LIGHT}
              dashed={!image.real} width={1.6} opacity={0.5} />
          );
        })}

        {/* The optical hardware. */}
        {bench.elements.map((el) => (
          <g
            key={el.id}
            onPointerDown={(e) => {
              onSelectElement?.(el.id);
              if (!onDragElement) return;
              e.stopPropagation();
              (e.target as Element).setPointerCapture?.(e.pointerId);
              setDrag({ kind: 'element', id: el.id });
            }}
            style={{ cursor: onDragElement ? 'ew-resize' : 'default' }}
          >
            {/* Invisible grab band — a 2-px lens outline is not a touch target. */}
            {onDragElement && (() => {
              const p = toScreen({ x: el.x, y: el.y ?? 0 });
              return <rect x={p.x - 22} y={0} width={44} height={h} fill="transparent" />;
            })()}
            <ElementShape el={el} view={view} selected={selectedElementId === el.id} />
          </g>
        ))}

        {/* The object. */}
        {src && (() => {
          const base = toScreen({ x: src.x, y: 0 });
          const tip = toScreen({ x: src.x, y: src.y ?? 0 });
          const point = Math.abs(src.y ?? 0) < 1e-9;
          const beam = src.kind === 'parallel-beam';
          return (
            <g
              onPointerDown={(e) => {
                if (!onDragObject) return;
                e.stopPropagation();
                (e.target as Element).setPointerCapture?.(e.pointerId);
                setDrag({ kind: 'object' });
              }}
              style={{ cursor: onDragObject ? 'grab' : 'default' }}
            >
              {onDragObject && <rect x={base.x - 22} y={0} width={44} height={h} fill="transparent" />}
              {beam ? (
                <g opacity={0.85}>
                  <line x1={base.x} y1={base.y - 26} x2={base.x} y2={base.y + 26}
                    stroke={LIGHT} strokeWidth={2} strokeDasharray="2 5" />
                </g>
              ) : point ? (
                <circle cx={base.x} cy={base.y} r={4.5} fill={LIGHT} />
              ) : (
                <Arrow base={base} tip={tip} colour={LIGHT} width={2.6} />
              )}
            </g>
          );
        })()}

        {/* The image. */}
        {layers.image && img && img.x !== null && Math.abs(img.x) < 1e4 && (() => {
          const base = toScreen({ x: img.x, y: 0 });
          const tip = toScreen({ x: img.x, y: img.y ?? 0 });
          if (Math.abs(tip.y - base.y) < 1.5) {
            return <circle cx={base.x} cy={base.y} r={4.5} fill={LIGHT} fillOpacity={img.real ? 1 : 0.45}
              stroke={LIGHT} strokeWidth={1.4} strokeDasharray={img.real ? undefined : '3 3'} />;
          }
          return <Arrow base={base} tip={tip} colour={LIGHT} dashed={!img.real} width={2.6} />;
        })()}

        {/*
          THE ONE TEXT ELEMENT. Everything else — element names, ray types,
          numbers — is in the legend and the readouts below. One string cannot
          collide with another, which is why there is only one.
        */}
        {status && (
          <text
            x={12} y={20}
            fill={TEXT.primary}
            fontSize={12}
            fontWeight={700}
            style={{ letterSpacing: '0.04em', paintOrder: 'stroke', pointerEvents: 'none' }}
            stroke={SIM_CANVAS}
            strokeWidth={3}
          >
            {status}
          </text>
        )}
      </g>
    </svg>
  );
}

export { GHOST };
