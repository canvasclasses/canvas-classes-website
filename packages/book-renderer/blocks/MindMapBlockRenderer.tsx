'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Plus, X, ArrowUpRight, ChevronRight } from 'lucide-react';
import { MindMapBlock, MindMapLeaf } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

/**
 * Chapter-end revision mind map. NOT a flashcard replacement — this is the
 * "shape of the chapter" (orientation), which then routes into the flashcard
 * deck (retrieval practice) via each leaf's "Test yourself" link. See
 * MindMapBlock in types/books.ts for the full rationale.
 *
 * Design brief (founder, 2026-07-26): professional, elegant, pastel — no
 * neon, no glow. Muted 7-hue palette in the same saturation/lightness family
 * as the platform's existing --book-accent steel blue; colour appears only as
 * thin strokes, hairline borders and low-alpha tints, never a saturated wash.
 *
 * LAYOUT — four vertical lanes, never a radial ring:
 *
 *     [leaf] · [branch] · (center) · [branch]
 *
 * Branches split left/right around the centre node. Only ONE branch opens at
 * a time, so only ONE leaf lane is ever needed — that is what lets four lanes
 * fit a ~680px reader column. Opening a branch shifts the whole map sideways
 * to make room (animated, so it reads as the map breathing rather than a
 * jump). Lanes are fixed, non-overlapping horizontal bands, so a leaf pill
 * can never collide with a branch pill — that is geometry, not spacing luck.
 *
 * CONNECTORS — the previous revision drew every line from node *centre* to
 * node *centre*, so lines visibly ran underneath the pills and radiated out
 * of the middle of the centre node's label. Instead, every path here is
 * anchored to a MEASURED pill edge (getBoundingClientRect against the
 * container) with a deliberate EDGE_GAP of clear space, and all branches on
 * a side share ONE trunk point on the centre pill's edge. Measuring rather
 * than hardcoding is what keeps the gap exact across container widths, font
 * scaling, and whatever label lengths a future chapter uses.
 */

// 7 muted pastel hues, same saturation/lightness family as --book-accent
// (#9fb2d4 ≈ hsl(215,32%,73%)). No neon, no saturation spikes.
const PALETTE = [
  '#d4ac8c', // terracotta
  '#d6c08c', // sand
  '#9fb2d4', // dusty blue — matches the platform's existing accent
  '#b8aad9', // lavender
  '#d9aab0', // rose
  '#9cc6c9', // teal
  '#a9c9ae', // sage
];

/** Clear space between a pill's edge and where its connector starts. */
const EDGE_GAP = 6;
/** Below this container width the lane layout can't breathe — use the list. */
const NARROW_PX = 560;
/** Column-shift animation, ms. Lines are re-measured across this window. */
const SHIFT_MS = 320;

// Lane centres as a % of container width, per open-state. Derived from a
// 680-unit reference: pills are 145 (branch) / 120 (leaf, centre) wide with
// 32–45 unit gutters, so the lanes are guaranteed not to overlap.
const LANES = {
  closed:    { leaf: 12.21, branchL: 23.90, center: 50.00, branchR: 76.10 },
  openLeft:  { leaf: 12.21, branchL: 36.40, center: 60.88, branchR: 85.96 },
  openRight: { leaf: 87.79, branchL: 14.04, center: 39.12, branchR: 63.60 },
};

/** Vertical centre (%) of branch i of k, spread symmetrically about the middle. */
function branchY(i: number, k: number) {
  if (k <= 1) return 50;
  const spacing = Math.min(27.5, 70 / (k - 1));
  return 50 + (i - (k - 1) / 2) * spacing;
}

/** Vertical centres (%) for m leaves, centred on their branch then clamped in-frame. */
function leafYs(m: number, bY: number) {
  const spacing = Math.min(12, 84 / Math.max(m - 1, 1));
  const span = (m - 1) * spacing;
  let start = bY - span / 2;
  if (start + span > 92) start = 92 - span;
  if (start < 8) start = 8;
  return Array.from({ length: m }, (_, j) => start + j * spacing);
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Anchored = { d: string; color: string; strong: boolean; key: string };

export default function MindMapBlockRenderer({ block }: { block: MindMapBlock }) {
  const [openBranch, setOpenBranch] = useState<string | null>(null);
  const [selectedLeaf, setSelectedLeaf] = useState<MindMapLeaf | null>(null);
  const [paths, setPaths] = useState<Anchored[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [narrow, setNarrow] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const setNodeRef = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  // Split the branches into a right lane (read first, top-down) and a left lane.
  const { rightBranches, leftBranches, colorOf } = useMemo(() => {
    const colors = new Map<string, string>();
    block.branches.forEach((b, i) => colors.set(b.id, PALETTE[i % PALETTE.length]));
    const rightCount = Math.ceil(block.branches.length / 2);
    return {
      rightBranches: block.branches.slice(0, rightCount),
      leftBranches: block.branches.slice(rightCount),
      colorOf: (id: string) => colors.get(id) || PALETTE[0],
    };
  }, [block.branches]);

  const openSide: 'left' | 'right' | null = openBranch
    ? (leftBranches.some((b) => b.id === openBranch) ? 'left' : 'right')
    : null;
  const lanes = openSide === 'left' ? LANES.openLeft : openSide === 'right' ? LANES.openRight : LANES.closed;

  const activeBranch = block.branches.find((b) => b.id === openBranch) ?? null;
  const activeColor = activeBranch ? colorOf(activeBranch.id) : undefined;
  const activeLeafYs = activeBranch
    ? leafYs(
        activeBranch.children.length,
        branchY(
          (openSide === 'left' ? leftBranches : rightBranches).findIndex((b) => b.id === openBranch),
          (openSide === 'left' ? leftBranches : rightBranches).length
        )
      )
    : [];

  // ── Measure real pill edges and derive every connector path ────────────────
  const measure = useCallback(() => {
    const container = containerRef.current;
    const center = centerRef.current;
    if (!container || !center) return;

    const cb = container.getBoundingClientRect();
    if (cb.width === 0) return;
    setSize({ w: cb.width, h: cb.height });

    const rectOf = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left - cb.left,
        right: r.right - cb.left,
        cy: r.top - cb.top + r.height / 2,
      };
    };

    const c = rectOf(center);
    const trunkR = { x: c.right + EDGE_GAP, y: c.cy };
    const trunkL = { x: c.left - EDGE_GAP, y: c.cy };
    const curve = (sx: number, sy: number, ex: number, ey: number) => {
      const mx = (sx + ex) / 2;
      return sy === ey ? `M ${sx} ${sy} L ${ex} ${ey}` : `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}`;
    };

    const next: Anchored[] = [];

    for (const b of rightBranches) {
      const el = nodeRefs.current.get(b.id);
      if (!el) continue;
      const r = rectOf(el);
      next.push({
        key: `stem-${b.id}`,
        color: colorOf(b.id),
        strong: b.id === openBranch,
        d: curve(trunkR.x, trunkR.y, r.left - EDGE_GAP, r.cy),
      });
    }
    for (const b of leftBranches) {
      const el = nodeRefs.current.get(b.id);
      if (!el) continue;
      const r = rectOf(el);
      next.push({
        key: `stem-${b.id}`,
        color: colorOf(b.id),
        strong: b.id === openBranch,
        d: curve(trunkL.x, trunkL.y, r.right + EDGE_GAP, r.cy),
      });
    }

    if (activeBranch) {
      const bEl = nodeRefs.current.get(activeBranch.id);
      if (bEl) {
        const br = rectOf(bEl);
        const fromX = openSide === 'left' ? br.left - EDGE_GAP : br.right + EDGE_GAP;
        for (const leaf of activeBranch.children) {
          const lEl = nodeRefs.current.get(leaf.id);
          if (!lEl) continue;
          const lr = rectOf(lEl);
          const toX = openSide === 'left' ? lr.right + EDGE_GAP : lr.left - EDGE_GAP;
          next.push({
            key: `twig-${leaf.id}`,
            color: colorOf(activeBranch.id),
            strong: selectedLeaf?.id === leaf.id,
            d: curve(fromX, br.cy, toX, lr.cy),
          });
        }
      }
    }

    setPaths(next);
  }, [rightBranches, leftBranches, colorOf, openBranch, activeBranch, openSide, selectedLeaf]);

  // Re-measure every frame while the lanes animate, so lines stay glued to the
  // pills mid-shift rather than snapping to their final positions.
  useIsoLayoutEffect(() => {
    measure();
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      measure();
      if (now - start < SHIFT_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      setNarrow(container.getBoundingClientRect().width < NARROW_PX);
      measure();
    });
    ro.observe(container);
    setNarrow(container.getBoundingClientRect().width < NARROW_PX);
    return () => ro.disconnect();
  }, [measure]);

  const toggleBranch = (id: string) => {
    setOpenBranch((prev) => (prev === id ? null : id));
    setSelectedLeaf(null);
  };

  const hrefFor = (leaf: MindMapLeaf | null) =>
    leaf?.flashcardTopic && block.flashcardChapterSlug
      ? `/chemistry-flashcards/${block.flashcardChapterSlug}?topic=${encodeURIComponent(leaf.flashcardTopic)}`
      : null;

  const shell = 'my-8 rounded-2xl px-5 py-6 sm:px-7 sm:py-7';
  const shellStyle = { background: 'var(--book-surface, #181A21)', border: '1px solid rgba(255,255,255,0.07)' };

  const header = (
    <div className="mb-4">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Chapter revision</span>
      <h3 className="text-xl font-bold text-white/85 mt-1">{block.title}</h3>
      {block.intro && (
        <div className="mt-1.5">
          <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/60">{block.intro}</InlineMarkdown>
        </div>
      )}
    </div>
  );

  const detailPanel = (
    <div
      className="mt-4 rounded-xl px-5 py-4 min-h-[92px]"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {!selectedLeaf ? (
        <p className="text-[13px] text-white/45 italic text-center py-2">
          {openBranch
            ? 'Tap a sub-topic for its formula, shortcut and trap.'
            : 'Tap a topic, then a sub-topic, for its formula, shortcut and trap.'}
        </p>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: activeColor }}>
              {selectedLeaf.label}
            </span>
            {hrefFor(selectedLeaf) && (
              <a
                href={hrefFor(selectedLeaf)!}
                className="flex items-center gap-1 text-[11.5px] font-semibold whitespace-nowrap rounded-full px-2.5 py-1"
                style={{ color: activeColor, border: `1px solid ${activeColor}55` }}
              >
                Test yourself <ArrowUpRight size={12} strokeWidth={2.5} />
              </a>
            )}
          </div>
          {selectedLeaf.formula && (
            <div
              className="mb-3 rounded-lg px-3.5 py-2.5 text-center overflow-x-auto"
              style={{ background: `${activeColor}14`, border: `1px solid ${activeColor}40` }}
            >
              <InlineMarkdown paragraphClassName="text-[14.5px] leading-snug text-white/90">
                {selectedLeaf.formula}
              </InlineMarkdown>
            </div>
          )}
          <InlineMarkdown paragraphClassName="text-[13.5px] leading-relaxed text-white/82">
            {selectedLeaf.summary}
          </InlineMarkdown>
        </div>
      )}
    </div>
  );

  // ── Narrow fallback: the lane layout needs width, so below NARROW_PX we
  // render the same tree as a plain accordion instead of squashing the map.
  if (narrow) {
    return (
      <div className={shell} style={shellStyle} ref={containerRef}>
        {header}
        <div className="space-y-2">
          {block.branches.map((b) => {
            const color = colorOf(b.id);
            const isOpen = openBranch === b.id;
            return (
              <div key={b.id}>
                <button
                  onClick={() => toggleBranch(b.id)}
                  className="w-full flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-left"
                  style={{
                    background: isOpen ? `${color}1f` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isOpen ? `${color}99` : `${color}44`}`,
                  }}
                >
                  <span className="text-[13px] font-semibold" style={{ color: isOpen ? color : 'rgba(255,255,255,0.82)' }}>
                    {b.label}
                  </span>
                  {isOpen ? <X size={13} strokeWidth={2.5} style={{ color }} /> : <Plus size={13} strokeWidth={2.5} style={{ color: `${color}cc` }} />}
                </button>
                {isOpen && (
                  <div className="mt-1.5 ml-3 space-y-1.5">
                    {b.children.map((leaf) => {
                      const sel = selectedLeaf?.id === leaf.id;
                      return (
                        <button
                          key={leaf.id}
                          onClick={() => setSelectedLeaf(sel ? null : leaf)}
                          className="w-full flex items-center gap-1.5 rounded-lg px-3 py-2 text-left"
                          style={{
                            background: sel ? `${color}1f` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${sel ? `${color}88` : 'rgba(255,255,255,0.1)'}`,
                          }}
                        >
                          <ChevronRight size={12} strokeWidth={2.5} style={{ color: sel ? color : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                          <span className="text-[12.5px]" style={{ color: sel ? color : 'rgba(255,255,255,0.78)' }}>{leaf.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {detailPanel}
      </div>
    );
  }

  const pill = (x: number, y: number): React.CSSProperties => ({
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    transition: `left ${SHIFT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  });

  const renderBranch = (b: (typeof block.branches)[number], i: number, side: 'left' | 'right') => {
    const list = side === 'left' ? leftBranches : rightBranches;
    const color = colorOf(b.id);
    const isOpen = openBranch === b.id;
    return (
      <button
        key={b.id}
        ref={setNodeRef(b.id)}
        onClick={() => toggleBranch(b.id)}
        className="absolute z-10 flex items-center justify-center gap-1.5 rounded-full w-[145px] box-border py-[9px] px-3"
        style={{
          ...pill(side === 'left' ? lanes.branchL : lanes.branchR, branchY(i, list.length)),
          background: isOpen ? `${color}24` : `${color}12`,
          border: `1px solid ${isOpen ? `${color}94` : `${color}52`}`,
        }}
      >
        <span
          className="text-[11.5px] font-semibold leading-tight"
          style={{ color: isOpen ? color : 'rgba(255,255,255,0.82)' }}
        >
          {b.label}
        </span>
        {isOpen ? (
          <X size={11} strokeWidth={2.5} style={{ color, flexShrink: 0 }} />
        ) : (
          <Plus size={11} strokeWidth={2.5} style={{ color: `${color}cc`, flexShrink: 0 }} />
        )}
      </button>
    );
  };

  return (
    <div className={shell} style={shellStyle}>
      {header}

      <div ref={containerRef} className="relative w-full select-none" style={{ aspectRatio: '680 / 400' }}>
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {paths.map((p) => (
            <path
              key={p.key}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeOpacity={p.strong ? 0.75 : 0.42}
              strokeWidth={p.strong ? 1.4 : 1.15}
            />
          ))}
        </svg>

        <div
          ref={centerRef}
          className="absolute z-10 w-[120px] box-border text-center rounded-full py-[11px]"
          style={{
            ...pill(lanes.center, 50),
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <span className="text-[13px] font-bold text-white/88">{block.root_label}</span>
        </div>

        {rightBranches.map((b, i) => renderBranch(b, i, 'right'))}
        {leftBranches.map((b, i) => renderBranch(b, i, 'left'))}

        {activeBranch &&
          activeBranch.children.map((leaf, j) => {
            const sel = selectedLeaf?.id === leaf.id;
            const color = colorOf(activeBranch.id);
            return (
              <button
                key={leaf.id}
                ref={setNodeRef(leaf.id)}
                onClick={() => setSelectedLeaf(sel ? null : leaf)}
                className="absolute z-10 w-[120px] box-border text-center rounded-full py-[7px] px-2"
                style={{
                  ...pill(lanes.leaf, activeLeafYs[j] ?? 50),
                  background: sel ? `${color}24` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${sel ? `${color}99` : 'rgba(255,255,255,0.13)'}`,
                }}
              >
                <span
                  className="text-[11px] leading-tight"
                  style={{ color: sel ? color : 'rgba(255,255,255,0.75)', fontWeight: sel ? 600 : 400 }}
                >
                  {leaf.label}
                </span>
              </button>
            );
          })}
      </div>

      {detailPanel}
    </div>
  );
}
