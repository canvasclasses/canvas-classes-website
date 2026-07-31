'use client';

// ──────────────────────────────────────────────────────────────────────────
// Identify the Unknown Element  ·  simulation_id: 'element-spectra-lab'
// Class 11 Chemistry · Chapter 2 (Structure of Atom) · Atomic Spectra page
//
// WHY THIS SIM EXISTS (and why it is not a third hydrogen sim):
//   The Atomic Spectra page already carries `hydrogen-spectrum-decoder`
//   (click a hydrogen line → decode the jump → Rydberg worksheet), and the
//   Bohr page carries `bohr-spectra` (fire a jump → watch the line appear).
//   Both are hydrogen-only. The page's headline claim — that a line spectrum
//   is a FINGERPRINT unique to each element — had no interactive at all, only
//   prose. This sim does that one job: match an unknown spectrum against
//   references, including two-element mixtures, which is how spectroscopy is
//   actually practised. Flipping to absorption shows the same lines invert,
//   which is the complementarity the comparison card can only assert.
//
// ACADEMIC SOURCES (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7):
// every wavelength below is a standard, published persistent line (NIST Atomic
// Spectra Database / standard spectroscopy tables), NOT generated. The
// hydrogen values match the Balmer figures already quoted on this page and in
// both sibling simulations, so the three agree line-for-line.
//   • H  (Balmer): 410.2 (Hδ), 434.0 (Hγ), 486.1 (Hβ), 656.3 (Hα)
//   • He: 447.1, 471.3, 492.2, 501.6, 587.6 (the D3 line found in the Sun in
//         1868), 667.8, 706.5
//   • Li: 610.4, 670.8 (the resonance doublet 670.776 / 670.791 nm)
//   • Na: 589.0 (D2) and 589.6 (D1) — the famous sodium doublet, which is why
//         a street lamp looks yellow
//   • Hg: 404.7, 435.8, 546.1, 577.0, 579.1 — the classic calibration lines
//   • Ne: 585.2, 588.2, 594.5, 597.6, 603.0, 607.4, 614.3, 621.7, 626.6,
//         633.4, 640.2, 650.7, 659.9 — the dense red/orange set behind neon
//         signage
//
// COLOUR: chrome follows the two-colour rule (ACCENT violet + ACCENT_2 sky,
// with the OK/BAD pastel pair for verdicts). The spectral lines themselves use
// WAVELENGTH-ACCURATE colour — that is physics, not decoration, and is the
// documented exception also used by BohrSpectraSim and the decoder sim.
// ──────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SimShell, SimHeader, SectionLabel, useCanvasSize,
  ACCENT, ACCENT_2, TEXT, BORDER, OK, BAD, TYPE, accentTint,
} from './_shared';

// Visible window drawn on every strip.
const LAM_MIN = 380;
const LAM_MAX = 720;

interface Element {
  symbol: string;
  name: string;
  lines: number[];   // nm
  note: string;
}

const ELEMENTS: Element[] = [
  { symbol: 'H',  name: 'Hydrogen',  note: 'Four Balmer lines — the simplest spectrum there is',
    lines: [410.2, 434.0, 486.1, 656.3] },
  { symbol: 'He', name: 'Helium',    note: 'Its yellow 587.6 nm line was seen in the Sun before anyone found helium on Earth',
    lines: [447.1, 471.3, 492.2, 501.6, 587.6, 667.8, 706.5] },
  { symbol: 'Li', name: 'Lithium',   note: 'A strong red resonance line — the reason lithium salts burn crimson',
    lines: [610.4, 670.8] },
  { symbol: 'Na', name: 'Sodium',    note: 'The D doublet at 589.0 / 589.6 nm — so close they look like one line',
    lines: [589.0, 589.6] },
  { symbol: 'Hg', name: 'Mercury',   note: 'Widely used to calibrate spectrometers because its lines are so sharp',
    lines: [404.7, 435.8, 546.1, 577.0, 579.1] },
  { symbol: 'Ne', name: 'Neon',      note: 'A dense forest of red and orange lines — hence the glow of neon signage',
    lines: [585.2, 588.2, 594.5, 597.6, 603.0, 607.4, 614.3, 621.7, 626.6, 633.4, 640.2, 650.7, 659.9] },
];

const byId = (s: string) => ELEMENTS.find((e) => e.symbol === s)!;

// Puzzles cycle deterministically — single elements first, then mixtures, so
// the difficulty ramps rather than being random.
const PUZZLES: string[][] = [
  ['He'],
  ['Hg'],
  ['H'],
  ['Na', 'H'],
  ['Ne'],
  ['Li', 'He'],
  ['H', 'Hg'],
];

/**
 * Wavelength → RGB. The standard piecewise visible-spectrum approximation
 * (Bruton), with intensity roll-off at the eye's limits, so 656 nm really
 * renders red and 486 nm really renders cyan.
 */
function lambdaToRGB(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440)      { r = -(nm - 440) / 60; g = 0; b = 1; }
  else if (nm >= 440 && nm < 490) { r = 0; g = (nm - 440) / 50; b = 1; }
  else if (nm >= 490 && nm < 510) { r = 0; g = 1; b = -(nm - 510) / 20; }
  else if (nm >= 510 && nm < 580) { r = (nm - 510) / 70; g = 1; b = 0; }
  else if (nm >= 580 && nm < 645) { r = 1; g = -(nm - 645) / 65; b = 0; }
  else if (nm >= 645 && nm <= 780){ r = 1; g = 0; b = 0; }

  let f = 1;
  if (nm >= 380 && nm < 420)      f = 0.3 + 0.7 * (nm - 380) / 40;
  else if (nm > 700 && nm <= 780) f = 0.3 + 0.7 * (780 - nm) / 80;

  const gamma = (c: number) => Math.round(255 * Math.pow(Math.max(0, c) * f, 0.8));
  return [gamma(r), gamma(g), gamma(b)];
}
const rgbCss = (nm: number, a = 1) => {
  const [r, g, b] = lambdaToRGB(nm);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

type Mode = 'emission' | 'absorption';

// ── One spectrum strip ────────────────────────────────────────────────────
// Every strip shares the same wavelength axis, so a reference sitting under
// the unknown lines up column-for-column — that alignment IS the comparison.
function SpectrumStrip({
  lines, mode, height, showAxis = false, dim = false,
}: {
  lines: number[]; mode: Mode; height: number; showAxis?: boolean; dim?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const { w: W, h: H } = dims.current;
    if (W < 10 || H < 10) return;
    ctx.clearRect(0, 0, W, H);

    const padX = 10;
    const stripH = showAxis ? H - 26 : H;
    const plotW = W - padX * 2;
    const xOf = (nm: number) => padX + ((nm - LAM_MIN) / (LAM_MAX - LAM_MIN)) * plotW;

    // Background: emission is a dark field; absorption is the full rainbow the
    // white-light beam started as.
    if (mode === 'absorption') {
      const g = ctx.createLinearGradient(padX, 0, padX + plotW, 0);
      for (let i = 0; i <= 20; i++) {
        const nm = LAM_MIN + (i / 20) * (LAM_MAX - LAM_MIN);
        g.addColorStop(i / 20, rgbCss(nm, dim ? 0.5 : 0.95)); // sim-lint-ok — real spectral colours
      }
      ctx.fillStyle = g;
      ctx.fillRect(padX, 0, plotW, stripH);
    } else {
      ctx.fillStyle = '#05060a';
      ctx.fillRect(padX, 0, plotW, stripH);
    }

    // The lines themselves.
    for (const nm of lines) {
      if (nm < LAM_MIN || nm > LAM_MAX) continue;
      const x = xOf(nm);
      if (mode === 'absorption') {
        ctx.fillStyle = `rgba(4,5,10,${dim ? 0.72 : 0.94})`;
        ctx.fillRect(x - 1.5, 0, 3, stripH);
      } else {
        ctx.fillStyle = rgbCss(nm, dim ? 0.55 : 1); // sim-lint-ok — real spectral colours
        ctx.shadowBlur = dim ? 0 : 9;
        ctx.shadowColor = rgbCss(nm, 0.85);          // sim-lint-ok
        ctx.fillRect(x - 1.5, 0, 3, stripH);
        ctx.shadowBlur = 0;
      }
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padX + 0.5, 0.5, plotW - 1, stripH - 1);

    if (showAxis) {
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.fillStyle = TEXT.secondary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      [400, 450, 500, 550, 600, 650, 700].forEach((nm) => {
        const x = xOf(nm);
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(x, stripH, 1, 4);
        ctx.fillStyle = TEXT.secondary;
        ctx.fillText(String(nm), x, stripH + 20);
      });
    }
  }, [lines, mode, showAxis, dim]);

  // useCanvasSize captures its callback once, so route resize repaints through
  // a ref that always holds the current closure.
  const drawRef = useRef<() => void>(() => {});
  useEffect(() => { drawRef.current = draw; }, [draw]);
  const onResize = useCallback(() => { drawRef.current(); }, []);
  const dims = useCanvasSize(ref, onResize);
  useEffect(() => { draw(); }, [draw]);

  return <canvas ref={ref} className="w-full block" style={{ height }} />;
}

export default function ElementSpectraLabSim() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [mode, setMode] = useState<Mode>('emission');
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const target = PUZZLES[puzzleIdx % PUZZLES.length];

  // The unknown's lines are simply the union of its constituent elements'
  // lines — which is exactly what a real mixed-gas spectrum is.
  const unknownLines = useMemo(
    () => [...new Set(target.flatMap((s) => byId(s).lines))].sort((a, b) => a - b),
    [target]
  );

  const toggle = (sym: string) => {
    if (checked) return;
    setPicked((p) => (p.includes(sym) ? p.filter((x) => x !== sym) : [...p, sym]));
  };

  const isCorrect =
    picked.length === target.length && target.every((t) => picked.includes(t));

  const nextPuzzle = () => {
    setPuzzleIdx((i) => i + 1);
    setPicked([]);
    setChecked(false);
  };

  // Per-element verdict: how many of its lines are actually present in the
  // unknown. A wrong pick usually matches SOME lines — that near-miss is the
  // whole lesson about why one shared line proves nothing.
  const matchOf = (sym: string) => {
    const el = byId(sym);
    const hit = el.lines.filter((l) => unknownLines.some((u) => Math.abs(u - l) < 0.6));
    return { hit: hit.length, total: el.lines.length };
  };

  const modeBtn = (m: Mode, label: string) => (
    <button
      key={m}
      onClick={() => setMode(m)}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
      style={{
        background: mode === m ? accentTint(ACCENT, 0.16) : 'rgba(255,255,255,0.04)',
        border: `1px solid ${mode === m ? accentTint(ACCENT, 0.45) : BORDER.card}`,
        color: mode === m ? ACCENT : TEXT.secondary,
      }}
    >
      {label}
    </button>
  );

  return (
    <SimShell style={{ minHeight: 'auto' }}>
      <SimHeader
        title="Identify the"
        accentWord="Unknown Element"
        subtitle="match the fingerprint — then flip it to absorption and watch the lines invert"
        badge={<span className="tabular-nums">{unknownLines.length} lines observed</span>}
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {modeBtn('emission', 'Emission')}
        {modeBtn('absorption', 'Absorption')}
        <span className="flex-1" />
        <button
          onClick={nextPuzzle}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}`, color: TEXT.secondary }}
        >
          New unknown →
        </button>
      </div>

      {/* ── THE UNKNOWN ── */}
      <SectionLabel accent={ACCENT} className="mb-2">The unknown sample</SectionLabel>
      <p className="text-base leading-relaxed mb-3" style={{ color: TEXT.secondary }}>
        {mode === 'emission'
          ? 'A glowing gas of unknown composition, viewed through a spectrometer. It may contain one element — or two.'
          : 'White light after passing through the same cool gas. Every wavelength the gas would emit has been removed instead.'}
      </p>
      <SpectrumStrip lines={unknownLines} mode={mode} height={104} showAxis />
      <p className="text-sm mt-2 mb-8" style={{ color: TEXT.ghost }}>Wavelength λ (nm)</p>

      {/* ── REFERENCE LIBRARY ── */}
      <SectionLabel accent={ACCENT_2} className="mb-2">Reference spectra</SectionLabel>
      <p className="text-base leading-relaxed mb-4" style={{ color: TEXT.secondary }}>
        Every strip below shares the unknown&apos;s wavelength axis, so a matching line sits in exactly
        the same column. Select the element — or elements — you think are present.
      </p>

      <div className="flex flex-col gap-2 mb-7">
        {ELEMENTS.map((el) => {
          const on = picked.includes(el.symbol);
          const inTarget = target.includes(el.symbol);
          const m = matchOf(el.symbol);
          const border = checked
            ? (inTarget ? accentTint(OK, 0.5) : on ? accentTint(BAD, 0.5) : BORDER.card)
            : on ? accentTint(ACCENT, 0.45) : BORDER.card;

          return (
            <button
              key={el.symbol}
              onClick={() => toggle(el.symbol)}
              className="w-full text-left rounded-xl px-4 py-3 transition-all"
              style={{
                background: on ? accentTint(ACCENT, 0.09) : 'transparent',
                border: `1px solid ${border}`,
                cursor: checked ? 'default' : 'pointer',
              }}
            >
              <div className="flex items-center gap-4">
                <div style={{ width: 118 }} className="shrink-0">
                  <div className="text-lg font-bold" style={{ color: on ? ACCENT : TEXT.primary }}>
                    {el.symbol}
                    <span className="ml-2 text-sm font-semibold" style={{ color: TEXT.secondary }}>{el.name}</span>
                  </div>
                  <div className="text-sm tabular-nums" style={{ color: TEXT.ghost }}>
                    {el.lines.length} lines
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <SpectrumStrip lines={el.lines} mode={mode} height={44} dim={!on && !checked} />
                </div>
                {checked && (
                  <div className="shrink-0 text-sm font-semibold tabular-nums text-right" style={{ width: 116 }}>
                    <span style={{ color: inTarget ? OK : TEXT.ghost }}>
                      {m.hit}/{m.total} lines
                    </span>
                    <div className="text-sm" style={{ color: inTarget ? OK : BAD }}>
                      {inTarget ? 'present' : m.hit > 0 ? 'partial only' : 'absent'}
                    </div>
                  </div>
                )}
              </div>
              {(on || checked) && (
                <div className="text-sm mt-2 leading-relaxed" style={{ color: TEXT.ghost }}>{el.note}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── VERDICT ── */}
      {!checked ? (
        <button
          onClick={() => setChecked(true)}
          disabled={picked.length === 0}
          className="px-6 py-3 rounded-xl text-base font-bold transition-all"
          style={{
            background: picked.length ? accentTint(ACCENT, 0.9) : 'rgba(255,255,255,0.04)',
            color: picked.length ? '#0d1117' : TEXT.muted,
            border: `1px solid ${picked.length ? accentTint(ACCENT, 0.6) : BORDER.card}`,
            cursor: picked.length ? 'pointer' : 'not-allowed',
          }}
        >
          Check my answer
        </button>
      ) : (
        <div className="pl-4" style={{ borderLeft: `2px solid ${isCorrect ? OK : BAD}` }}>
          <div className="text-lg font-bold mb-1.5" style={{ color: isCorrect ? OK : BAD }}>
            {isCorrect
              ? `Correct — the sample is ${target.map((t) => byId(t).name).join(' + ')}`
              : `Not quite — the sample is ${target.map((t) => byId(t).name).join(' + ')}`}
          </div>
          <p className="text-base leading-relaxed" style={{ color: TEXT.secondary }}>
            {target.length > 1
              ? 'A mixture shows every line of every element present, all superimposed. That is why identification means accounting for the whole pattern, not spotting one familiar line.'
              : 'Every other element scored zero — but look at how close some lines come. Helium sits at 587.6 nm and sodium at 589.0 nm: barely 1.4 nm apart, and on a low-resolution instrument they would blur into a single yellow line. Sharper optics separate them, which is why a spectrometer’s resolving power decides how confidently you can name an element.'}
            {' '}Switch to <strong style={{ color: ACCENT }}>absorption</strong> and the same lines turn from bright to dark at
            identical wavelengths — the fingerprint is the same either way.
          </p>
          <button
            onClick={nextPuzzle}
            className="mt-4 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: accentTint(ACCENT, 0.16), border: `1px solid ${accentTint(ACCENT, 0.45)}`, color: ACCENT }}
          >
            Try another sample →
          </button>
        </div>
      )}

      <p className={`${TYPE.body} mt-7 max-w-4xl`} style={{ color: TEXT.ghost }}>
        All wavelengths are published persistent lines from standard spectroscopy tables. This is
        genuinely how elements are identified in stars, in forensic labs and in industrial furnaces —
        helium was found in the Sun in 1868 by exactly this method, 27 years before anyone isolated it
        on Earth.
      </p>
    </SimShell>
  );
}
