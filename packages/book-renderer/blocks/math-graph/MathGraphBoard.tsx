'use client';

// Core JSXGraph board — the reusable engine every math_graph block renders
// through. Client-only: JSXGraph touches window/DOM, so it is imported inside
// useEffect and this component is only ever mounted behind a dynamic(ssr:false)
// boundary (see MathGraphRenderer). Two build paths:
//   • archetype  → a named construction from archetypes.ts (richer geometry)
//   • spec       → the declarative board (functions + sliders + points + regions)
//
// The board is DARK-THEMED (the shelved 2026-06 version was a white inset — the
// main "unfinished" tell). All JSXGraph calls are wrapped defensively: attribute
// names have drifted across versions, so a theming attr the installed version
// rejects is ignored rather than crashing the board. The minimum guarantee is
// axes + curves render; theming degrades gracefully.
//
// SLIDERS (redesigned 2026-07-24, founder feedback): every slider — archetype
// or spec-mode — is an INVISIBLE JXG element, driven entirely by a real HTML
// <input type="range"> rendered in a sidebar OUTSIDE the canvas, to its left.
// Two problems this fixes at once: (1) sliders no longer float loose over the
// grid, distracting from the plot; (2) a JSXGraph "panel" polygon drawn behind
// them (the previous approach) was itself draggable and flashed a stray
// highlight outline — a plain CSS div never can be. The graph itself is now a
// true square (was reading as a cramped 16:9 strip), with the freed-up left
// space going to the slider sidebar.
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useId, useRef, useState } from 'react';
import type { MathGraphSpec, MathGraphChallenge } from '@canvas/data/types/books';
import { BOARD, TEXT, accentHex } from './theme';
import { ARCHETYPES, resolveArchetypeBounds, type LiveSliderMeta } from './archetypes';

const DEFAULT_BOUNDS = { xmin: -6, xmax: 6, ymin: -6, ymax: 6 };

type TableRow = { x: number; y: number };

export interface MathGraphBoardProps {
  spec?: MathGraphSpec;
  archetype?: string;
  archetypeParams?: Record<string, number | string | boolean>;
  compare?: boolean;                 // show the "Keep this curve" family builder
  challenge?: MathGraphChallenge;    // auto-checkable match-the-graph exercise
  height?: number;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const r = Math.round(n * 100) / 100;
  return Object.is(r, -0) ? '0' : String(r);
}

// Substitute current slider values into an expression string, for the live
// equation display. Whole-token replace only (so 'a' in 'max' is untouched).
function substituteSliders(expr: string, values: Record<string, number>): string {
  let out = expr;
  for (const [name, v] of Object.entries(values)) {
    out = out.replace(new RegExp(`\\b${name}\\b`, 'g'), fmt(v));
  }
  // light prettify for reading — not KaTeX (kept robust): * → ·, ^ stays
  return out.replace(/\*/g, '·');
}

export default function MathGraphBoard({ spec, archetype, archetypeParams, compare, challenge, height }: MathGraphBoardProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);
  // Frozen-curve snapshotter from the archetype + the ghost ring buffer it fills.
  const snapshotRef = useRef<((opts?: { goal?: boolean; label?: string; color?: string }) => { curve: any; label?: any } | null) | null>(null);
  const ghostsRef = useRef<{ curve: any; label?: any }[]>([]);
  // Distinct hues for kept curves (violet is the LIVE curve, so it's excluded).
  // Each kept curve + its label share one colour so the student can tell them
  // apart. Length matches MAX_KEPT so every kept curve gets a unique colour.
  const KEPT_PALETTE = [accentHex('sky'), accentHex('amber'), accentHex('emerald'), accentHex('pink'), accentHex('orange')];
  const rawId = useId();
  const boardId = `mgb-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Live state driven by board 'update' events (slider drags), bridged to React.
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const [liveSliders, setLiveSliders] = useState<LiveSliderMeta[]>([]);
  // The governing equation, rebuilt from live slider values (shown under sliders).
  const [equationText, setEquationText] = useState<string | null>(null);
  // The STANDARD form ("y = {m}x + {c}") pinned to the bottom of the graph.
  const [generalForm, setGeneralForm] = useState<string | null>(null);
  // Worked-calculation rows for the panel below the graph — the flow x→sub→y.
  const [calcRows, setCalcRows] = useState<{ x: number; sub: string; y: number }[]>([]);
  // Live colour-coded key/value readouts (e.g. "sin θ = 0.90") — a boxed HTML
  // panel, never raw canvas text (see ArchetypeResult.readouts in archetypes.ts).
  const [readoutRows, setReadoutRows] = useState<{ label: string; value: string; color: string }[]>([]);
  // Legend entries shown in the graph corner, colour-matched to each curve.
  // `staticLegend` = a family figure's curves or the challenge Goal (set once);
  // `keptLegend` = compare-mode kept curves (grows/clears with the ghosts).
  const [staticLegend, setStaticLegend] = useState<{ label: string; color: string; dashed?: boolean }[]>([]);
  const [keptLegend, setKeptLegend] = useState<{ label: string; color: string; dashed?: boolean }[]>([]);
  // Compare-mode availability (archetype exposed a snapshotter) + kept-curve count.
  const [canCompare, setCanCompare] = useState(false);
  const [keptCount, setKeptCount] = useState(0);
  // Challenge: whether every target slider is currently within tolerance.
  const [matched, setMatched] = useState(false);

  const showTable = !!spec?.table && !archetype;
  const eqExpr = spec?.table?.expr ?? spec?.functions?.[0]?.expr ?? '';
  const tableLabel = spec?.table?.label ?? 'y';

  useEffect(() => {
    let board: any;
    let JXG: any;
    let cancelled = false;
    let raf = 0;

    (async () => {
      try {
        // Bare specifier only — jsxgraph 1.13's exports map blocks every deep
        // path (distrib/*), so this is the one import that resolves in webpack.
        const mod: any = await import('jsxgraph');
        JXG = (mod.JSXGraph ? mod : mod.default) ?? (typeof window !== 'undefined' ? (window as any).JXG : null) ?? mod;
        if (cancelled || !hostRef.current || !JXG?.JSXGraph) return;

        // A rebuild discards the old board, so any kept ghosts died with it.
        ghostsRef.current = [];
        setKeptCount(0);
        setCalcRows([]);     // cleared unless the new archetype provides calc()
        setReadoutRows([]);  // cleared unless the new archetype provides readouts()
        setKeptLegend([]);   // kept curves are gone with the old board
        const nextStaticLegend: { label: string; color: string; dashed?: boolean }[] = [];

        // Precedence: an author's explicit spec.bounds > the archetype's own
        // default (which may be a function of its params, so overriding `r`
        // still frames correctly) > the engine's generic box.
        const archBounds = resolveArchetypeBounds(archetype, archetypeParams ?? {});
        const b = spec?.bounds ?? archBounds ?? DEFAULT_BOUNDS;
        board = JXG.JSXGraph.initBoard(boardId, {
          boundingbox: [b.xmin, b.ymax, b.xmax, b.ymin],
          // Equal unit scale by default (a circle must look round), but an
          // author can opt out via spec.keepSquare — essential for graphs whose
          // axes have wildly different natural ranges (e.g. °C → °F).
          // Equal unit scale by default (a circle must look round). An author
          // opts out with spec.keepSquare:false; an archetype opts out via its
          // own bounds entry — needed for plots whose axes differ by orders of
          // magnitude (200 trials vs a probability of 0.5).
          keepAspectRatio: spec ? spec.keepSquare !== false : archBounds?.keepSquare !== false,
          axis: false,
          grid: false,
          showCopyright: false,
          showNavigation: false,
          // Disable JSXGraph's click-drag "selection" rectangle AND its
          // keyboard-focus behaviour — together they produced a stray blue/white
          // box over the plot on click (founder 2026-07-24). The sliders are
          // separate HTML, so keyboard access to the controls is unaffected.
          selection: { enabled: false, visible: false },
          keyboard: { enabled: false },
          pan: { enabled: true, needTwoFingers: true },
          zoom: { wheel: false, needShift: true },
        });
        boardRef.current = board;

        // ── Grid ─────────────────────────────────────────────────────────
        if (spec?.showGrid !== false) {
          try {
            board.create('grid', [], {
              strokeColor: BOARD.gridMajor,
              strokeOpacity: BOARD.gridMajorOpacity,
              majorStep: 1,
            } as any);
          } catch { /* grid attr drift — skip */ }
        }

        // ── Axes ─────────────────────────────────────────────────────────
        // Each axis gets its OWN tick-label placement so the numbers sit CLEAR
        // of the lines (founder 2026-07-24: 1..5 overlapped the axes): x-axis
        // numbers drop below the axis, y-axis numbers move to its left. Larger
        // font for readability.
        if (spec?.showAxes !== false) {
          const axisBase = { strokeColor: BOARD.axis, highlightStrokeColor: BOARD.axis, strokeWidth: 1 };
          const tickBase = { strokeColor: BOARD.tick, majorHeight: 6, drawLabels: true, insertTicks: true };
          try {
            board.create('axis', [[0, 0], [1, 0]], {
              ...axisBase,
              ticks: { ...tickBase, label: { strokeColor: BOARD.tickLabel, fontSize: 13, anchorX: 'middle', anchorY: 'top', offset: [0, -8] } },
            } as any);
            board.create('axis', [[0, 0], [0, 1]], {
              ...axisBase,
              ticks: { ...tickBase, label: { strokeColor: BOARD.tickLabel, fontSize: 13, anchorX: 'right', anchorY: 'middle', offset: [-10, 0] } },
            } as any);
          } catch { /* fall back to built-in axes */ }
        }

        // ── Collect sliders (archetype return value OR spec-mode) + draw
        //    everything else. Either path produces `meta`, a flat list of
        //    {name,min,max,color,jxg,step} the render below turns into HTML
        //    range inputs — the single unified path for both origins.
        let meta: LiveSliderMeta[] = [];
        let evalTable: ((x: number) => number) | null = null;
        // Live governing-equation formatter — from the archetype, or built from
        // the spec's first function expression for declarative graphs.
        let equationFor: ((v: Record<string, number>) => string) | null = null;
        // Worked-calculation formatter for one x → the panel below the graph.
        let calcFor: ((v: Record<string, number>, x: number) => { sub: string; y: number } | null) | null = null;
        // Live colour-coded key/value readouts → the small boxed HTML panel.
        let readoutsFor: ((v: Record<string, number>) => { label: string; value: string; color: string }[]) | null = null;

        if (archetype && ARCHETYPES[archetype]) {
          try {
            const result = ARCHETYPES[archetype](JXG, board, archetypeParams ?? {});
            meta = result?.sliders ?? [];
            equationFor = result?.equation ?? null;
            calcFor = result?.calc ?? null;
            readoutsFor = result?.readouts ?? null;
            snapshotRef.current = result?.snapshot ?? null;
            setCanCompare(!!result?.snapshot);
            setGeneralForm(result?.generalForm ?? null);
          } catch (err) {
            console.error('[math_graph] archetype failed:', archetype, err);
          }
        } else if (spec) {
          // Sliders — still JessieCode-created (so names resolve inside typed
          // expressions below) but INVISIBLE; position is a fixed dummy since
          // it's only ever moved via .setValue() from the HTML sidebar.
          (spec.sliders ?? []).forEach((s, i) => {
            if (!s.name) return;
            try {
              board.jc.parse(`${s.name} = slider([0,0],[1,0],[${s.min},${s.value},${s.max}]);`);
              const ref = board.select(s.name);
              if (ref) {
                try {
                  ref.setAttribute({
                    visible: false,
                    label: { visible: false },
                    point1: { visible: false },
                    point2: { visible: false },
                    baseline: { visible: false },
                    highline: { visible: false },
                  });
                } catch { /* attr drift */ }
                meta.push({ name: s.name, min: s.min, max: s.max, color: accentHex(undefined, i), jxg: ref, step: s.step });
              }
            } catch (err) {
              console.error('[math_graph] slider build failed:', s.name, err);
            }
          });

          // ── Functions ──────────────────────────────────────────────────
          // The curve is drawn on the canvas; its LABEL goes into the corner
          // legend (nextStaticLegend), never on the line (founder 2026-07-24).
          const fnList = (spec.functions ?? []).filter((f) => f.expr && f.expr.trim());
          fnList.forEach((f, i) => {
            let fn: ((x: number) => number) | null = null;
            try { fn = board.jc.snippet(f.expr, true, 'x', true); } catch { fn = null; }
            if (!fn) { console.error('[math_graph] function failed:', f.expr); return; }
            try {
              const color = accentHex(f.color, i);
              board.create('functiongraph', [fn, b.xmin, b.xmax], {
                strokeColor: color, strokeWidth: 2.5, highlightStrokeColor: color, dash: f.dashed ? 2 : 0,
              } as any);
              if (f.label) nextStaticLegend.push({ label: f.label, color, dashed: f.dashed });
            } catch (err) {
              console.error('[math_graph] function render failed:', f.expr, err);
            }
          });

          // ── Regions (inequality shading  y <op> expr) ─────────────────
          (spec.regions ?? []).forEach((r, i) => {
            if (!r.expr || !r.expr.trim()) return;
            try {
              const fn = board.jc.snippet(r.expr, true, 'x', true);
              const curve = board.create('functiongraph', [fn, b.xmin, b.xmax], {
                strokeColor: accentHex(r.color, i + 2),
                strokeWidth: 1.5,
                dash: 2,
              } as any);
              board.create('inequality', [curve], {
                inverse: r.op === '>' || r.op === '>=',
                fillColor: accentHex(r.color, i + 2),
                fillOpacity: 0.18,
              } as any);
            } catch (err) {
              console.error('[math_graph] region failed:', r.expr, err);
            }
          });

          // ── Points ─────────────────────────────────────────────────────
          (spec.points ?? []).forEach((p, i) => {
            try {
              board.create('point', [p.x, p.y], {
                name: p.label ?? '',
                withLabel: !!p.label,
                size: 4,
                fixed: !p.draggable,
                fillColor: accentHex(p.color, i + 1),
                strokeColor: accentHex(p.color, i + 1),
                label: { strokeColor: TEXT.primary, fontSize: 13 },
              } as any);
            } catch (err) {
              console.error('[math_graph] point failed', err);
            }
          });

          // ── Segments — straight connectors between two literal coordinates
          //    (triangle sides, room outlines, distance legs). Declarative
          //    sibling of the JXG 'segment' primitive archetypes already use
          //    internally. Labelled segments go into the corner legend, same
          //    as a labelled function — never drawn on the line itself.
          (spec.segments ?? []).forEach((s, i) => {
            try {
              const color = accentHex(s.color, i + 3);
              board.create('segment', [[s.from.x, s.from.y], [s.to.x, s.to.y]], {
                strokeColor: color, strokeWidth: 2.25, dash: s.dashed ? 2 : 0, highlightStrokeColor: color,
              } as any);
              if (s.label) nextStaticLegend.push({ label: s.label, color, dashed: s.dashed });
            } catch (err) {
              console.error('[math_graph] segment failed', err);
            }
          });

          // ── Annotations — free-floating labels for family/revision graphs
          //    (the Thomas-style "1 unit ↑" notes beside a curve).
          (spec.annotations ?? []).forEach((an) => {
            try {
              board.create('text', [an.x, an.y, an.text], {
                strokeColor: an.color ? accentHex(an.color) : TEXT.secondary,
                fontSize: 14, fixed: true, highlight: false, cssStyle: 'font-weight:600',
              } as any);
            } catch { /* annotation failed — non-fatal */ }
          });

          if (spec.table?.expr) {
            try { evalTable = board.jc.snippet(spec.table.expr, true, 'x', true); }
            catch { evalTable = null; }
          }

          // Spec-mode governing equation — first function's expr with the live
          // slider values substituted (only meaningful when it has sliders).
          const f0 = (spec.functions ?? []).find((f) => f.expr && f.expr.trim());
          if (f0 && meta.length) {
            equationFor = (v) => `${f0.label ?? 'y'} = ${substituteSliders(f0.expr, v)}`;
            // Standard form: the same expression UNsubstituted, with each slider
            // name braced so the renderer can colour-match it to its control.
            let gf = f0.expr;
            meta.forEach((m) => { gf = gf.replace(new RegExp(`\\b${m.name}\\b`, 'g'), `{${m.name}}`); });
            setGeneralForm(`${f0.label ?? 'y'} = ${gf.replace(/\*/g, '·')}`);
          }
        }

        // ── Challenge goal curve — temporarily drive the sliders to the target
        //    values, freeze a dashed "Goal" copy, then restore the student's
        //    starting position. Requires an archetype exposing snapshot().
        if (challenge?.targets && snapshotRef.current && meta.length) {
          try {
            const saved: Record<string, number> = {};
            meta.forEach((m) => { try { saved[m.name] = m.jxg.Value(); } catch { /* skip */ } });
            meta.forEach((m) => {
              const t = challenge.targets[m.name];
              if (typeof t === 'number') { try { m.jxg.setValue(t); } catch { /* skip */ } }
            });
            board.update();
            snapshotRef.current({ goal: true });
            nextStaticLegend.push({ label: 'Goal', color: accentHex('amber'), dashed: true });
            meta.forEach((m) => {
              if (typeof saved[m.name] === 'number') { try { m.jxg.setValue(saved[m.name]); } catch { /* skip */ } }
            });
            board.update();
          } catch (err) {
            console.error('[math_graph] challenge goal failed', err);
          }
        }
        setStaticLegend(nextStaticLegend);

        // ── Shared live-value tracking — drives the HTML slider sidebar
        //    (current-value readouts + governing equation) and the linked table.
        // A handful of whole-number sample inputs inside the view, for the
        // worked-calculation panel — the arithmetic behind a few plotted points.
        const sampleXs = [-2, -1, 0, 1, 2].filter((x) => x >= b.xmin && x <= b.xmax);

        // A point-driven archetype (draggable points, no sliders — e.g.
        // distance-explorer, midpoint-explorer) still needs its readouts/
        // equation to refresh live: JSXGraph fires 'update' on every drag
        // regardless of sliders, but the listener below was previously gated
        // on `meta.length`, so a zero-slider archetype's readouts/equation
        // closures (which read live point positions directly, not `vals`)
        // never re-ran after the initial mount. Widen the gate to any source
        // of live data, not just sliders/table.
        if (meta.length || evalTable || equationFor || calcFor || readoutsFor) {
          const refsByName: Record<string, any> = {};
          meta.forEach((m) => { refsByName[m.name] = m.jxg; });
          const readLive = () => {
            const vals: Record<string, number> = {};
            for (const name of Object.keys(refsByName)) {
              try { vals[name] = refsByName[name].Value(); } catch { /* skip */ }
            }
            setSliderValues(vals);
            if (equationFor) {
              try { setEquationText(equationFor(vals)); } catch { setEquationText(null); }
            }
            if (calcFor) {
              const rows: { x: number; sub: string; y: number }[] = [];
              for (const x of sampleXs) {
                let r: { sub: string; y: number } | null = null;
                try { r = calcFor(vals, x); } catch { r = null; }
                if (r && Number.isFinite(r.y)) rows.push({ x, sub: r.sub, y: r.y });
              }
              setCalcRows(rows);
            }
            if (readoutsFor) {
              try { setReadoutRows(readoutsFor(vals)); } catch { setReadoutRows([]); }
            }
            if (challenge?.targets) {
              const tol = challenge.tolerance ?? 0.3;
              setMatched(Object.entries(challenge.targets).every(([n, t]) =>
                Math.abs((vals[n] ?? Number.POSITIVE_INFINITY) - t) <= tol));
            }
            if (evalTable && spec?.table) {
              const rows: TableRow[] = [];
              const { from, to, step } = spec.table;
              const stp = step > 0 ? step : 1;
              for (let x = from; x <= to + 1e-9 && rows.length < 60; x += stp) {
                let y = NaN;
                try { y = evalTable(x); } catch { /* NaN */ }
                rows.push({ x, y });
              }
              setTableRows(rows);
            }
          };
          readLive();
          board.on('update', () => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(readLive);
          });
        }
        setLiveSliders(meta);
        board.update();
      } catch (err) {
        console.error('[math_graph] board init failed', err);
      }
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      try { if (board && JXG?.JSXGraph?.freeBoard) JXG.JSXGraph.freeBoard(board); } catch { /* ignore */ }
    };
    // Rebuild whenever the spec/archetype identity changes (editor live-preview).
  }, [boardId, spec, archetype, archetypeParams, challenge]);

  // ── Compare mode: freeze the current curve as a coloured ghost, so the
  //    student builds up a FAMILY of curves (Thomas Fig 1.29) by hand. Each
  //    kept curve gets a distinct colour; its equation goes into the corner
  //    legend (keptLegend), never on the line. Capped at one-per-colour.
  const MAX_GHOSTS = KEPT_PALETTE.length;
  const keepCurve = () => {
    const fn = snapshotRef.current;
    const board = boardRef.current;
    if (!fn || !board) return;
    try {
      const color = KEPT_PALETTE[ghostsRef.current.length % KEPT_PALETTE.length];
      const el = fn({ color });
      if (!el) return;
      ghostsRef.current.push(el);
      const label = equationText ?? `curve ${ghostsRef.current.length}`;
      setKeptLegend((prev) => {
        const next = [...prev, { label, color }];
        return next.length > MAX_GHOSTS ? next.slice(next.length - MAX_GHOSTS) : next;
      });
      if (ghostsRef.current.length > MAX_GHOSTS) {
        const oldest = ghostsRef.current.shift();
        try { board.removeObject(oldest!.curve); } catch { /* already gone */ }
      }
      board.update();
      setKeptCount(ghostsRef.current.length);
    } catch { /* snapshot failed — non-fatal */ }
  };
  const clearGhosts = () => {
    const board = boardRef.current;
    ghostsRef.current.forEach((g) => {
      try { board?.removeObject(g.curve); } catch { /* already gone */ }
    });
    ghostsRef.current = [];
    try { board?.update(); } catch { /* ignore */ }
    setKeptCount(0);
    setKeptLegend([]);
  };

  // The square graph GROWS to fill whatever width is left in the row after
  // the fixed-width sidebar(s) (founder feedback, 2026-07-24: a small pinned
  // size left a large dead gap on wide reading columns) — capped so it can't
  // become excessive on very wide screens. `height` prop overrides the cap.
  const boardMax = height ?? 640;

  return (
    <div className="flex flex-col gap-3">
    <div className="flex flex-col gap-3 md:flex-row md:items-start">
      {/* Slider control panel — plain HTML, never part of the JSXGraph canvas,
          so it can't be dragged/highlighted the way a canvas element can. */}
      {liveSliders.length > 0 && (
        <div
          className="w-full shrink-0 rounded-xl border p-3 md:w-48"
          style={{ background: BOARD.frame, borderColor: '#ffffff14' }}
        >
          <div className="flex flex-col gap-3">
            {liveSliders.map((s) => {
              const val = sliderValues[s.name] ?? s.min;
              const step = s.step ?? Math.max((s.max - s.min) / 200, 0.001);
              return (
                <div key={s.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold italic" style={{ color: s.color }}>{s.name}</span>
                    <span className="tabular-nums" style={{ color: TEXT.primary }}>{fmt(val)}</span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={step}
                    value={val}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      try { s.jxg.setValue(v); boardRef.current?.update(); } catch { /* ignore */ }
                      setSliderValues((prev) => ({ ...prev, [s.name]: v }));
                    }}
                    className="w-full cursor-pointer"
                    style={{ accentColor: s.color }}
                  />
                </div>
              );
            })}
          </div>

          {/* Governing equation — the payoff of moving the sliders, shown right
              below them so the drag→symbol link is unmissable. */}
          {equationText && (
            <div
              className="mt-3 rounded-lg border px-2.5 py-2"
              style={{ background: BOARD.canvas, borderColor: '#ffffff14' }}
            >
              <div className="text-[10px] uppercase tracking-wide" style={{ color: TEXT.ghost }}>
                Equation
              </div>
              <div className="mt-0.5 text-[15px] italic tabular-nums leading-snug" style={{ color: TEXT.primary }}>
                {equationText}
              </div>
            </div>
          )}

          {/* Compare / family builder — freeze curves to build up a coloured
              family, the way a textbook figure shows several shifts at once. */}
          {compare && canCompare && (
            <div className="mt-3 flex flex-col gap-1.5">
              <button
                onClick={keepCurve}
                className="rounded-lg border px-2 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: '#c4b5fd1a', borderColor: '#c4b5fd44', color: '#c4b5fd' }}
              >
                + Keep this curve
              </button>
              {keptCount > 0 && (
                <button
                  onClick={clearGhosts}
                  className="rounded-lg border px-2 py-1 text-[11px] transition-opacity hover:opacity-80"
                  style={{ borderColor: '#ffffff14', color: TEXT.secondary }}
                >
                  Clear {keptCount} kept
                </button>
              )}
              <p className="text-[10px] leading-snug" style={{ color: TEXT.ghost }}>
                Freeze a few and compare them side by side.
              </p>
            </div>
          )}

          {/* Match-the-graph challenge — live self-check against the dashed goal */}
          {challenge?.targets && (
            <div
              className="mt-3 rounded-lg border px-2.5 py-2"
              style={{
                background: matched ? '#6ee7b71a' : BOARD.canvas,
                borderColor: matched ? '#6ee7b755' : '#ffffff14',
              }}
            >
              <div className="text-[10px] uppercase tracking-wide" style={{ color: matched ? '#6ee7b7' : TEXT.ghost }}>
                {matched ? '✓ Matched' : 'Challenge'}
              </div>
              <p className="mt-0.5 text-[11px] leading-snug" style={{ color: matched ? '#6ee7b7' : TEXT.secondary }}>
                {matched
                  ? (challenge.success ?? 'That’s it — your curve sits on the dashed goal.')
                  : (challenge.prompt ?? 'Move the sliders until your curve lands on the dashed goal curve.')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Graph card — a true square that grows to fill the row's leftover
          width (md:w-auto resets the mobile w-full so flex-basis:0% from
          flex-1 governs sizing cleanly, not a competing explicit width). */}
      <div
        className="relative w-full overflow-hidden rounded-xl border md:w-auto md:flex-1"
        style={{ background: BOARD.canvas, borderColor: '#ffffff14', aspectRatio: '1 / 1', maxWidth: boardMax }}
      >
        <div
          id={boardId}
          ref={hostRef}
          className="h-full w-full"
          style={{ touchAction: 'pan-y', outline: 'none', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
        />
        {/* LEGEND — colour-matched key in the top-right corner, in its own box,
            so a curve's equation never sits on top of the line (founder
            2026-07-24). Static entries (family / Goal) first, then kept curves. */}
        {(staticLegend.length > 0 || keptLegend.length > 0) && (
          <div
            className="pointer-events-none absolute right-2 top-2 flex max-w-[55%] flex-col gap-1 rounded-lg border px-2.5 py-2"
            style={{ background: 'rgba(11,15,21,0.9)', borderColor: '#ffffff1f' }}
          >
            {[...staticLegend, ...keptLegend].map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="inline-block h-0 w-6 shrink-0 rounded"
                  style={{ borderTop: `3px ${e.dashed ? 'dashed' : 'solid'} ${e.color}` }}
                />
                <span className="truncate text-[15px] font-medium italic tabular-nums" style={{ color: e.color }}>{e.label}</span>
              </div>
            ))}
          </div>
        )}
        {/* READOUTS — live colour-coded key/value pairs (e.g. "sin θ = 0.90"),
            top-LEFT corner (opposite the curve legend) so the two never
            collide. Boxed HTML, matching the legend's visual language — never
            raw canvas text (founder 2026-07-24: unit-circle used to draw this
            straight onto the JSXGraph canvas at a smaller, unboxed size). */}
        {readoutRows.length > 0 && (
          <div
            className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1 rounded-lg border px-2.5 py-2"
            style={{ background: 'rgba(11,15,21,0.9)', borderColor: '#ffffff1f' }}
          >
            {readoutRows.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-[15px] font-medium italic tabular-nums">
                <span style={{ color: r.color }}>{r.label}</span>
                <span style={{ color: TEXT.secondary }}>=</span>
                <span style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}
        {/* STANDARD FORM — pinned bottom-centre, over the plot. pointer-events
            none so it can never intercept a drag. Each slider letter is
            coloured to match its control, so the student links the blue "c" in
            the formula to the blue slider they're moving. */}
        {generalForm && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-2">
            <div
              className="rounded-md border px-2.5 py-1 text-[13px] italic"
              style={{ background: 'rgba(11,15,21,0.88)', borderColor: '#ffffff14', color: TEXT.secondary }}
            >
              {generalForm.split(/(\{[^}]+\})/g).filter(Boolean).map((part, i) => {
                const token = part.match(/^\{([^}]+)\}$/);
                if (!token) return <span key={i}>{part}</span>;
                const name = token[1];
                const hit = liveSliders.find((s) => s.name === name);
                return (
                  <span key={i} className="font-bold" style={{ color: hit?.color ?? TEXT.primary }}>
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Linked equation + table panel */}
      {showTable && (
        <div
          className="w-full shrink-0 rounded-xl border p-3 md:w-56"
          style={{ background: BOARD.frame, borderColor: '#ffffff14' }}
        >
          <div className="mb-2">
            <div className="text-[10px] uppercase tracking-wide" style={{ color: TEXT.ghost }}>
              Equation
            </div>
            <div className="mt-0.5 text-sm italic" style={{ color: TEXT.primary }}>
              {tableLabel} = {eqExpr ? substituteSliders(eqExpr, sliderValues) : '—'}
            </div>
            {Object.keys(sliderValues).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]" style={{ color: TEXT.secondary }}>
                {Object.entries(sliderValues).map(([k, v]) => (
                  <span key={k} className="tabular-nums">
                    <span style={{ color: TEXT.ghost }}>{k}</span> = {fmt(v)}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: TEXT.ghost }}>
            Table
          </div>
          <div className="mt-1 max-h-56 overflow-y-auto">
            <table className="w-full text-xs tabular-nums" style={{ color: TEXT.secondary }}>
              <thead>
                <tr style={{ color: TEXT.ghost }}>
                  <th className="pb-1 pr-2 text-left font-medium">x</th>
                  <th className="pb-1 text-left font-medium">{tableLabel}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => (
                  <tr key={i}>
                    <td className="pr-2">{fmt(r.x)}</td>
                    <td style={{ color: TEXT.primary }}>{fmt(r.y)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    {/* Calculation panel — the FLOW, not a list of steps. Each card reads
        top-to-bottom: pick an x → drop it into the rule → out comes y, giving
        the point (x, y). The whole row updates live as the sliders move, so the
        student feels the machine working (founder 2026-07-24: make them feel
        the process, don't just show steps). */}
    {calcRows.length > 0 && (
      <div className="rounded-xl border p-3.5" style={{ background: BOARD.frame, borderColor: '#ffffff14' }}>
        <div className="mb-3 text-[13px]" style={{ color: TEXT.secondary }}>
          <span className="font-semibold" style={{ color: TEXT.primary }}>Every point comes from one x.</span>{' '}
          Drop an x into the rule and out comes its y — that pair <span className="italic">(x, y)</span> is a dot on the graph.
        </div>
        <div className="flex flex-wrap gap-2.5">
          {calcRows.map((r) => (
            <div
              key={r.x}
              className="flex min-w-[92px] flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-2.5"
              style={{ background: BOARD.canvas, borderColor: '#ffffff12' }}
            >
              <span className="rounded-md px-2 py-0.5 text-[13px] font-semibold tabular-nums"
                style={{ background: '#7dd3fc1f', color: accentHex('sky') }}>
                x = {r.x}
              </span>
              <span className="text-[13px]" style={{ color: TEXT.ghost }}>↓</span>
              <span className="text-center text-[12px] italic tabular-nums leading-tight" style={{ color: TEXT.secondary }}>
                {r.sub}
              </span>
              <span className="text-[13px]" style={{ color: TEXT.ghost }}>↓</span>
              <span className="rounded-md px-2 py-0.5 text-[13px] font-bold tabular-nums"
                style={{ background: '#c4b5fd1f', color: accentHex('violet') }}>
                y = {fmt(r.y)}
              </span>
              <span className="mt-0.5 text-[11px] tabular-nums" style={{ color: TEXT.ghost }}>
                ({r.x}, {fmt(r.y)})
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  );
}
