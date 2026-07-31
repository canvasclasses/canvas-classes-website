'use client';

/*
 * ALGEBRA TILES — a direct-manipulation game for solving linear equations.
 *
 * The student GRABS tiles with their finger and moves them. Drop a +1 onto a −1
 * and the zero-pair pops and vanishes. The equation banner above the mat rewrites
 * itself live on every move, so the symbolic math is a running consequence of what
 * the hand does. Goal: cancel the loose units (keeping BOTH sides fair) until the
 * x-tiles stand alone — then the mat splits the remaining tiles evenly and reveals x.
 *
 * Pedagogy: embodied / direct-manipulation cognition + concreteness fading (tiles →
 * symbols, shown simultaneously) + game-based learning. No operation buttons — the
 * operation IS the drag. Calm, no timer, mistakes are free (drag a tile back out).
 *
 * Self-contained: pointer-drag (works for mouse + touch), CSS pops, no libraries.
 * Registered as 'algebra-tiles-solver'. Companion to the step_solver (symbols).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SimShell, SimHeader, ExpertTip } from './_shared/components';
import { ACCENT, TEXT, OK, BAD, accentTint } from './_shared/tokens';

type Kind = 'x' | 'pos' | 'neg';
interface Tile { id: number; kind: Kind; x: number; y: number; popping?: boolean }

// Equations ax + b = c (solutions are whole numbers). b may be negative.
const LEVELS = [
  { a: 2, b: 3, c: 11 },   // 2x + 3 = 11  → x = 4
  { a: 3, b: -2, c: 7 },   // 3x − 2 = 7   → x = 3
  { a: 2, b: 5, c: 9 },    // 2x + 5 = 9   → x = 2
];

const W = 640, H = 268, MID = W / 2;
const UNIT = 30, XW = 58, XH = 30, GAP = 8, PAD = 16;

// Colour by meaning: x = primary accent; +1 / −1 = the sanctioned positive/negative
// semantic pair (green / red), like OK / BAD. sim-lint-ok
const COLOR: Record<Kind, string> = { x: ACCENT, pos: OK, neg: BAD }; // sim-lint-ok

/** Grid-lay a set of tiles inside a region [x0, x1]. */
function layout(kinds: { id: number; kind: Kind }[], x0: number): Tile[] {
  const out: Tile[] = [];
  const cols = 4;
  const xs = kinds.filter((k) => k.kind === 'x');
  const us = kinds.filter((k) => k.kind !== 'x');
  xs.forEach((k, i) => out.push({ id: k.id, kind: k.kind, x: x0 + PAD + i * (XW + GAP), y: PAD }));
  us.forEach((k, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    out.push({ id: k.id, kind: k.kind, x: x0 + PAD + col * (UNIT + GAP), y: PAD + XH + GAP + row * (UNIT + GAP) });
  });
  return out;
}

function buildLevel(lvl: { a: number; b: number; c: number }, seed: number): Tile[] {
  let id = seed;
  const leftKinds: { id: number; kind: Kind }[] = [];
  for (let i = 0; i < lvl.a; i++) leftKinds.push({ id: id++, kind: 'x' });
  for (let i = 0; i < Math.abs(lvl.b); i++) leftKinds.push({ id: id++, kind: lvl.b > 0 ? 'pos' : 'neg' });
  const rightKinds: { id: number; kind: Kind }[] = [];
  for (let i = 0; i < Math.abs(lvl.c); i++) rightKinds.push({ id: id++, kind: lvl.c > 0 ? 'pos' : 'neg' });
  return [...layout(leftKinds, 0), ...layout(rightKinds, MID)];
}

function sideOf(x: number, kind: Kind): 'L' | 'R' {
  const c = x + (kind === 'x' ? XW : UNIT) / 2;
  return c < MID ? 'L' : 'R';
}

export default function AlgebraTilesSolverSim() {
  const [li, setLi] = useState(0);
  const lvl = LEVELS[li % LEVELS.length];
  // Build tiles from id 0; spawned tiles use a SEPARATE id space starting at 5000
  // so a spawned tile can never collide with a starting tile's id (that collision
  // made onUp resolve a spawned −1 to an x-tile and silently skip the cancel).
  const idSeed = useRef(5000);
  const [tiles, setTiles] = useState<Tile[]>(() => buildLevel(lvl, 0));
  const matRef = useRef<HTMLDivElement>(null);
  // x/y track the LIVE drag position so the drop check never depends on React
  // having committed the last pointermove (robust to fast drags + automation).
  const drag = useRef<{ id: number; dx: number; dy: number; x: number; y: number } | null>(null);

  const reset = useCallback((l = lvl) => { setTiles(buildLevel(l, 0)); }, [lvl]);

  // ── Live equation + fairness, derived from tile state ──────────────────────
  const stats = useMemo(() => {
    const c = (side: 'L' | 'R', kind: Kind) => tiles.filter((t) => !t.popping && sideOf(t.x, t.kind) === side && t.kind === kind).length;
    const lx = c('L', 'x'), rx = c('R', 'x');
    const lu = c('L', 'pos') - c('L', 'neg'), ru = c('R', 'pos') - c('R', 'neg');
    const denom = lx - rx;
    const sol = denom !== 0 ? (ru - lu) / denom : null;
    const orig = lvl.c - lvl.b === 0 ? 0 : (lvl.c - lvl.b) / lvl.a;
    const fair = sol !== null && Math.abs(sol - orig) < 1e-9;
    const solved = lu === 0 && rx === 0 && lx >= 1 && ru > 0 && ru % lx === 0 && fair;
    return { lx, rx, lu, ru, fair, solved, answer: solved ? ru / lx : null };
  }, [tiles, lvl]);

  // ── Pointer drag (mouse + touch) ───────────────────────────────────────────
  const onMove = useCallback((e: PointerEvent) => {
    const d = drag.current; const mat = matRef.current; if (!d || !mat) return;
    const r = mat.getBoundingClientRect();
    const scale = W / r.width;
    let nx = (e.clientX - r.left) * scale - d.dx;
    let ny = (e.clientY - r.top) * scale - d.dy;
    nx = Math.max(2, Math.min(W - UNIT - 2, nx));
    ny = Math.max(2, Math.min(H - UNIT - 2, ny));
    d.x = nx; d.y = ny;
    setTiles((ts) => ts.map((t) => (t.id === d.id ? { ...t, x: nx, y: ny } : t)));
  }, []);

  const onUp = useCallback(() => {
    const d = drag.current;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    drag.current = null;
    if (!d) return;
    const fx = d.x, fy = d.y;  // final drop position, straight from the ref (not React state)
    // On drop, look for an opposite-sign unit tile overlapping on the same side → pop the zero-pair.
    setTiles((ts) => {
      const me = ts.find((t) => t.id === d.id);
      if (!me || me.kind === 'x') return ts;
      const mySide = sideOf(fx, me.kind);
      const partner = ts.find((t) =>
        t.id !== me.id && !t.popping && t.kind !== 'x' && t.kind !== me.kind &&
        sideOf(t.x, t.kind) === mySide && Math.hypot(t.x - fx, t.y - fy) < 42);
      // Make sure `me` is committed at its final drop position regardless.
      const settle = (arr: Tile[]) => arr.map((t) => (t.id === me.id ? { ...t, x: fx, y: fy } : t));
      if (!partner) return settle(ts);
      const popIds = new Set([me.id, partner.id]);
      setTimeout(() => setTiles((cur) => cur.filter((t) => !popIds.has(t.id))), 260);
      return settle(ts).map((t) => (popIds.has(t.id) ? { ...t, popping: true } : t));
    });
  }, [onMove]);

  const grab = useCallback((e: React.PointerEvent, id: number) => {
    if (stats.solved) return;
    const mat = matRef.current; if (!mat) return;
    const r = mat.getBoundingClientRect();
    const scale = W / r.width;
    const t = tiles.find((x) => x.id === id); if (!t) return;
    drag.current = { id, dx: (e.clientX - r.left) * scale - t.x, dy: (e.clientY - r.top) * scale - t.y, x: t.x, y: t.y };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [tiles, onMove, onUp, stats.solved]);

  // Spawn a fresh tile from a tray source and immediately start dragging it.
  const spawn = useCallback((e: React.PointerEvent, kind: Kind, side: 'L' | 'R') => {
    if (stats.solved) return;
    const mat = matRef.current; if (!mat) return;
    const r = mat.getBoundingClientRect();
    const scale = W / r.width;
    const id = idSeed.current++;
    const nx = Math.max(2, Math.min(W - UNIT - 2, (e.clientX - r.left) * scale - UNIT / 2));
    const ny = Math.max(2, Math.min(H - UNIT - 2, (e.clientY - r.top) * scale - UNIT / 2));
    const startX = side === 'L' ? MID / 2 : MID + MID / 2;
    const ix = Number.isFinite(nx) ? nx : startX, iy = Number.isFinite(ny) ? ny : PAD;
    setTiles((ts) => [...ts, { id, kind, x: ix, y: iy }]);
    drag.current = { id, dx: UNIT / 2, dy: UNIT / 2, x: ix, y: iy };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [onMove, onUp, stats.solved]);

  useEffect(() => () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); }, [onMove, onUp]);

  const label = (k: Kind) => (k === 'x' ? 'x' : k === 'pos' ? '+1' : '−1');

  const EqSide = ({ xc, u }: { xc: number; u: number }) => {
    const parts: React.ReactNode[] = [];
    if (xc !== 0) parts.push(<span key="x">{xc === 1 ? '' : xc}<i style={{ color: ACCENT }}>x</i></span>);
    if (u !== 0) parts.push(<span key="u">{parts.length ? (u > 0 ? ' + ' : ' − ') : (u < 0 ? '−' : '')}{Math.abs(u)}</span>);
    if (!parts.length) parts.push(<span key="0">0</span>);
    return <>{parts}</>;
  };

  return (
    <SimShell>
      <SimHeader
        title="Tile Lab —"
        accentWord="free the x"
        subtitle="Drag the tiles. Drop a +1 onto a −1 and they cancel out. Clear the loose ones — same on both sides — until only the x-tiles are left."
      />

      {/* Live equation banner — rewrites itself as you move tiles */}
      <div className="flex items-center justify-center gap-3 mt-1 mb-2">
        <span className="text-[19px] tabular-nums" style={{ color: TEXT.primary }}>
          <EqSide xc={stats.lx} u={stats.lu} /> <span style={{ color: TEXT.ghost }}>=</span> <EqSide xc={stats.rx} u={stats.ru} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: accentTint(stats.fair ? OK : BAD, 0.12), color: stats.fair ? OK : BAD, border: `1px solid ${accentTint(stats.fair ? OK : BAD, 0.34)}` }}>
          {stats.fair ? 'Balanced' : 'Not equal'}
        </span>
      </div>

      {/* The mat */}
      <div
        ref={matRef}
        className="relative mx-auto rounded-2xl select-none"
        style={{ width: '100%', maxWidth: W, aspectRatio: `${W} / ${H}`, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(255,255,255,0.08)', touchAction: 'none' }}
      >
        {/* = divider */}
        <div className="absolute top-0 bottom-0" style={{ left: '50%', width: 2, background: 'rgba(255,255,255,0.14)', transform: 'translateX(-1px)' }} />
        <span className="absolute text-white/30 font-bold" style={{ left: '50%', top: 6, transform: 'translateX(-50%)', fontSize: 18 }}>=</span>

        {tiles.map((t) => {
          const isX = t.kind === 'x';
          const w = isX ? XW : UNIT, h = isX ? XH : UNIT;
          const col = COLOR[t.kind];
          return (
            <div
              key={t.id}
              onPointerDown={(e) => grab(e, t.id)}
              className="absolute grid place-items-center rounded-lg font-bold transition-[opacity,transform] duration-200"
              style={{
                left: `${(t.x / W) * 100}%`, top: `${(t.y / H) * 100}%`,
                width: `${(w / W) * 100}%`, height: `${(h / H) * 100}%`,
                background: accentTint(col, 0.22), border: `1.5px solid ${col}`, color: col,
                fontSize: isX ? 15 : 12, fontStyle: isX ? 'italic' : 'normal',
                cursor: stats.solved ? 'default' : 'grab', touchAction: 'none',
                opacity: (t.popping || stats.solved) ? 0 : 1, transform: t.popping ? 'scale(0.2)' : 'scale(1)', zIndex: drag.current?.id === t.id ? 20 : 1,
              }}
            >
              {label(t.kind)}
            </div>
          );
        })}

        {/* Win reveal */}
        {stats.solved && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl motion-safe:animate-[at-in_0.3s_ease-out]" style={{ background: 'rgba(5,6,20,0.94)', backdropFilter: 'blur(2px)' }}>
            <div className="text-center px-6 py-5 rounded-2xl" style={{ background: 'rgba(11,15,21,0.9)', border: `1px solid ${accentTint(OK, 0.4)}` }}>
              <div className="text-[14px] mb-1.5" style={{ color: TEXT.secondary }}>
                {stats.lx} <i style={{ color: ACCENT }}>x</i>-tile{stats.lx > 1 ? 's' : ''} share {stats.ru} ones evenly…
              </div>
              <div className="text-[32px] font-bold leading-none" style={{ color: OK }}><i style={{ color: ACCENT }}>x</i> = {stats.answer}</div>
              <div className="text-[13px] mt-2" style={{ color: TEXT.ghost }}>You freed the <i style={{ color: ACCENT }}>x</i> — and kept it fair the whole way. 🎉</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes at-in{0%{opacity:0}100%{opacity:1}}`}</style>

      {/* Tray — drag out new tiles */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest" style={{ color: TEXT.ghost }}>drag out →</span>
          <div onPointerDown={(e) => spawn(e, 'pos', 'L')} className="grid place-items-center rounded-lg font-bold" role="button" aria-label="new +1 tile"
            style={{ width: 34, height: 34, background: accentTint(OK, 0.22), border: `1.5px solid ${OK}`, color: OK, fontSize: 12, cursor: 'grab', touchAction: 'none' }}>+1</div>
          <div onPointerDown={(e) => spawn(e, 'neg', 'L')} className="grid place-items-center rounded-lg font-bold" role="button" aria-label="new −1 tile"
            style={{ width: 34, height: 34, background: accentTint(BAD, 0.22), border: `1.5px solid ${BAD}`, color: BAD, fontSize: 12, cursor: 'grab', touchAction: 'none' }}>−1</div>
        </div>
        <button onClick={() => reset()} className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', color: TEXT.secondary, border: '1px solid rgba(255,255,255,0.12)' }}>↺ Reset</button>
        <button onClick={() => { const n = (li + 1) % LEVELS.length; setLi(n); reset(LEVELS[n]); }} className="text-[12px] font-medium underline underline-offset-2" style={{ color: ACCENT }}>New puzzle →</button>
      </div>

      {/* Coaching */}
      <div className="mt-3 text-center min-h-[38px] flex items-center justify-center">
        {stats.solved ? (
          <span className="text-[14px]" style={{ color: OK }}>Nice — the equation collapsed all the way down to the answer.</span>
        ) : !stats.fair ? (
          <span className="text-[14px]" style={{ color: BAD }}>The two sides aren&apos;t equal any more — add the <b>same</b> tile to the other side to make it fair again.</span>
        ) : stats.lu !== 0 ? (
          <span className="text-[14px]" style={{ color: TEXT.secondary }}>Drag a <span style={{ color: BAD }}>−1</span> from the tray onto each loose <span style={{ color: OK }}>+1</span> to cancel it — and do it on <b>both</b> sides.</span>
        ) : (
          <span className="text-[14px]" style={{ color: TEXT.secondary }}>The units are gone — now the x-tiles just share the ones on the right evenly.</span>
        )}
      </div>

      <ExpertTip>
        A +1 and a −1 make zero, so cancelling them changes nothing — that&apos;s the &quot;legal move&quot;. Do the same to both sides and the equation stays true while it gets simpler. That&apos;s solving.
      </ExpertTip>
    </SimShell>
  );
}
