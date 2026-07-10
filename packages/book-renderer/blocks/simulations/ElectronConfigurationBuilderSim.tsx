'use client';

// ──────────────────────────────────────────────────────────────────────────
// Electron Configuration Builder  ·  simulation_id: 'electron-configuration-builder'
// Class 11 Chemistry · Chapter 2 (Structure of Atom) · Electronic Configuration
//
// The electronic-configuration FINALE — the highest-marks topic of the chapter.
// Configuration feels like rote memorisation, and the chromium / copper
// "exceptions" feel arbitrary. This sim shows the configuration FOLLOWS three
// rules you can watch, one electron at a time:
//
//   1. Aufbau / (n+l) order — low energy first; 4s (n+l=4) fills before 3d (n+l=5)
//   2. Hund's rule          — singly fill every box of a subshell (parallel ↑)
//                             before any box gets its ↓ partner
//   3. Pauli exclusion      — max 2 electrons per box, opposite spins
//
// …and that even the two exceptions (Cr, Cu) have a REASON: a half-filled (d⁵)
// or fully-filled (d¹⁰) subshell is extra stable, so one 4s electron is promoted
// into 3d. The sim PREDICTS the plain-Aufbau config first (shown in red as the
// "wrong" guess), then visibly promotes the electron to the ACTUAL stable config.
//
// ACADEMIC SOURCES (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7) —
// every rule and number is standard NCERT Class 11 Chapter 2 §2.6.5–2.6.6, NOT
// generated from training knowledge:
//   • Aufbau order by (n+l), lower-n tiebreak (up to 4p, enough for Z≤36):
//       1s 2s 2p 3s 3p 4s 3d 4p   …(5s 4d 5p 6s 4f 5d 6p 7s beyond)
//   • Subshell capacities: s=2, p=6, d=10, f=14
//   • Orbitals (boxes) per subshell: s=1, p=3, d=5, f=7 ; each box holds 2 (↑↓)
//   • Hund's rule of maximum multiplicity: every orbital of a subshell gets one
//     electron (parallel spins) before any gets a second.
//   • Pauli exclusion: no two electrons share all four quantum numbers ⇒ a box
//     holds at most 2 electrons, and they must have opposite spins.
//   • Elements Z 1–36: H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar
//                       K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr
//   • The only two deviations within Z≤36:
//       Cr (24): actual [Ar] 3d⁵ 4s¹  (Aufbau predicts [Ar] 3d⁴ 4s²)
//       Cu (29): actual [Ar] 3d¹⁰ 4s¹ (Aufbau predicts [Ar] 3d⁹ 4s²)
//     Reason: a half-filled (d⁵) or completely filled (d¹⁰) subshell has extra
//     stability — symmetrical electron distribution + greater exchange energy.
//   • Noble-gas cores used for shorthand: He(2) Ne(10) Ar(18) Kr(36)
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';

// ── chrome palette (workflow §3) ────────────────────────────────────────────
const C = {
  bg: '#0d1117',
  card: '#0B0F15',
  surface: '#151E32',
  text: '#e2e8f0',
  text2: '#94a3b8',
  muted: '#475569',
  ghost: '#64748b',
  indigo: '#6366f1',
  indigoMid: '#818cf8',
  indigoLight: '#c4b5fd',
  amber: '#fbbf24',
  amberLight: '#fcd34d',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  red: '#f87171',
  redDeep: '#dc2626',
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
};

// ── Unicode superscripts (for "3d¹⁰" style configs) ─────────────────────────
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) =>
  String(n).split('').map((d) => SUP_DIGITS[parseInt(d, 10)] ?? d).join('');

// ── scientific notation → "6.022 × 10²³" (workflow §2) — kept for completeness
function prettyExp(eNotation: string): string {
  const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return eNotation;
  const mantissa = m[1];
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return mantissa;
  const s = String(Math.abs(expNum)).split('').map((d) => SUP_DIGITS[parseInt(d, 10)]).join('');
  return `${mantissa} × 10${expNum < 0 ? '⁻' : ''}${s}`;
}

// ── stacked fraction (workflow §2 — never the ÷ glyph) ──────────────────────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.1, margin: '0 3px' }}>
      <span style={{ padding: '0 5px 1px' }}>{num}</span>
      <span style={{ padding: '1px 5px 0', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>{den}</span>
    </span>
  );
}

// ── subshell / element data ─────────────────────────────────────────────────
type L = 's' | 'p' | 'd' | 'f';
const CAPACITY: Record<L, number> = { s: 2, p: 6, d: 10, f: 14 };
const BOXES: Record<L, number> = { s: 1, p: 3, d: 5, f: 7 };
const L_OF: Record<L, number> = { s: 0, p: 1, d: 2, f: 3 };
const SUB_COLOR: Record<L, string> = { s: C.indigoMid, p: C.emeraldLight, d: C.amber, f: '#f472b6' };

interface Subshell { n: number; l: L; key: string; nl: number }
const mk = (n: number, l: L): Subshell => ({ n, l, key: `${n}${l}`, nl: n + L_OF[l] });

// Aufbau order by (n+l), lower-n tiebreak — only need up to 4p for Z≤36.
const AUFBAU: Subshell[] = [
  mk(1, 's'), mk(2, 's'), mk(2, 'p'), mk(3, 's'),
  mk(3, 'p'), mk(4, 's'), mk(3, 'd'), mk(4, 'p'),
];

// Element symbols / names, Z = 1..36 (index 0 unused).
const SYMBOL = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
  'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
  'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
const NAME: Record<number, string> = {
  1: 'Hydrogen', 2: 'Helium', 3: 'Lithium', 4: 'Beryllium', 5: 'Boron', 6: 'Carbon',
  7: 'Nitrogen', 8: 'Oxygen', 9: 'Fluorine', 10: 'Neon', 11: 'Sodium', 12: 'Magnesium',
  13: 'Aluminium', 14: 'Silicon', 15: 'Phosphorus', 16: 'Sulphur', 17: 'Chlorine', 18: 'Argon',
  19: 'Potassium', 20: 'Calcium', 21: 'Scandium', 22: 'Titanium', 23: 'Vanadium', 24: 'Chromium',
  25: 'Manganese', 26: 'Iron', 27: 'Cobalt', 28: 'Nickel', 29: 'Copper', 30: 'Zinc',
  31: 'Gallium', 32: 'Germanium', 33: 'Arsenic', 34: 'Selenium', 35: 'Bromine', 36: 'Krypton',
};

// Noble-gas cores for the shorthand (symbol, Z).
const NOBLE: { sym: string; z: number }[] = [
  { sym: 'Kr', z: 36 }, { sym: 'Ar', z: 18 }, { sym: 'Ne', z: 10 }, { sym: 'He', z: 2 },
];

// The ONLY two anomalies within Z≤36. Each is a single 4s→3d promotion.
// Reason field is shown verbatim in the exception callout.
const EXCEPTIONS: Record<number, { reason: string }> = {
  24: { reason: 'half-filled 3d⁵' },   // Cr  [Ar] 3d⁵ 4s¹
  29: { reason: 'fully-filled 3d¹⁰' }, // Cu  [Ar] 3d¹⁰ 4s¹
};

// ── compute a configuration ─────────────────────────────────────────────────
// Returns ordered fill records {key, n, l, count}. `applyException` decides
// whether the Cr/Cu 4s→3d promotion is applied (true = ACTUAL, false = predicted).
interface Fill { key: string; n: number; l: L; count: number }

function buildConfig(z: number, applyException: boolean): Fill[] {
  let remaining = z;
  const fills: Fill[] = [];
  for (const ss of AUFBAU) {
    if (remaining <= 0) break;
    const take = Math.min(CAPACITY[ss.l], remaining);
    fills.push({ key: ss.key, n: ss.n, l: ss.l, count: take });
    remaining -= take;
  }
  if (applyException && EXCEPTIONS[z]) {
    // promote ONE electron from 4s into 3d (Cr: 3d⁴4s²→3d⁵4s¹, Cu: 3d⁹4s²→3d¹⁰4s¹)
    const s4 = fills.find((f) => f.key === '4s');
    const d3 = fills.find((f) => f.key === '3d');
    if (s4 && d3 && s4.count === 2) { s4.count = 1; d3.count += 1; }
  }
  return fills;
}

// Fill records → display order. Electrons FILL in Aufbau order (4s before 3d),
// but a written configuration is grouped by shell — increasing n, then l — which
// is how NCERT and exam answers write it (e.g. Cr = [Ar] 3d⁵ 4s¹, Fe = [Ar] 3d⁶ 4s²).
// So we sort by (n, then l) here. The orbital boxes and the (n+l) chart elsewhere
// stay in fill order, which is correct for showing the build-up sequence.
function configString(fills: Fill[]): string {
  return [...fills]
    .sort((a, b) => a.n - b.n || L_OF[a.l] - L_OF[b.l])
    .map((f) => `${f.key}${sup(f.count)}`)
    .join(' ');
}

// Noble-gas shorthand: largest core with Z ≤ element-1, then the remainder.
function shorthand(z: number, fills: Fill[]): { core: string | null; rest: string } {
  const core = NOBLE.find((g) => g.z < z) ?? null;
  if (!core) return { core: null, rest: configString(fills) };
  let acc = 0;
  const rest = fills.filter((f) => {
    const before = acc;
    acc += f.count;
    return before >= core.z; // keep subshells whose electrons sit beyond the core
  });
  return { core: core.sym, rest: configString(rest) };
}

// ── per-box spin layout for a subshell (Hund + Pauli) ───────────────────────
// Given a subshell's electron count, return one entry per orbital box: 0, 1 (↑),
// or 2 (↑↓). Boxes are filled singly first (Hund), then paired.
function boxSpins(l: L, count: number): number[] {
  const nb = BOXES[l];
  const arr = new Array(nb).fill(0);
  let c = count;
  for (let i = 0; i < nb && c > 0; i++) { arr[i] = 1; c--; }   // one ↑ each (Hund)
  for (let i = 0; i < nb && c > 0; i++) { arr[i] = 2; c--; }   // add the ↓ partner
  return arr;
}

// How many electrons are "live" up to a given fill-step + within-subshell count.
// Used by the step animation to reveal electrons one at a time.

// ── guided narrative beats ──────────────────────────────────────────────────
type StepDef = { key: string; label: string; title: string; body: string };
const STEPS: StepDef[] = [
  {
    key: 'rules',
    label: 'Three Rules',
    title: 'Configuration is three rules, not memorisation',
    body:
      'An atom fills its orbital boxes in a fixed order, following three rules you can watch. AUFBAU: lowest-energy subshell first — ranked by (n+l), and on a tie the lower n wins (that is why 4s, with n+l=4, fills before 3d, with n+l=5). HUND: inside one subshell, put a single ↑ electron in every box before any box gets a second. PAULI: a box holds at most two electrons, and they must spin opposite ways (↑↓). Press Play and watch electrons drop in.',
  },
  {
    key: 'build',
    label: 'Build Any Atom',
    title: 'Pick an element and build it electron by electron',
    body:
      'Choose any element from hydrogen (Z=1) to krypton (Z=36). Use Step to drop electrons one at a time, or Play to watch the whole atom build. The running configuration string and the noble-gas shorthand update live, and the (n+l) chart on the right highlights which subshell is filling right now — and why it is next in line.',
  },
  {
    key: 'exception',
    label: 'Why Chromium Breaks',
    title: 'Why chromium and copper break the pattern',
    body:
      'Plain Aufbau predicts chromium as [Ar] 3d⁴ 4s² and copper as [Ar] 3d⁹ 4s². But nature prefers a half-filled (d⁵) or completely filled (d¹⁰) subshell — those are extra stable because the electrons are spread symmetrically and gain extra exchange energy. So ONE 4s electron is promoted into 3d. Select Cr or Cu: the sim shows the predicted config in red, then promotes the electron to reveal the real, more stable one. These are the only two exceptions up to Z=36.',
  },
];

// total number of "fill events" (each electron) up to and including a fill list
function totalElectrons(fills: Fill[]): number {
  return fills.reduce((a, f) => a + f.count, 0);
}

export default function ElectronConfigurationBuilderSim() {
  const [stepIdx, setStepIdx] = useState(0);
  const [z, setZ] = useState(24);                 // start on Chromium — the centrepiece
  const [filled, setFilled] = useState(24);       // electrons currently revealed
  const [playing, setPlaying] = useState(false);
  const [promoted, setPromoted] = useState(true); // for Cr/Cu: show the ACTUAL (promoted) config
  const playRef = useRef<number | null>(null);

  const isException = !!EXCEPTIONS[z];

  // the ACTUAL config (with promotion if applicable) and the PREDICTED one
  const actualFills = buildConfig(z, true);
  const predictedFills = buildConfig(z, false);
  // while not yet promoted, an exception element shows the predicted boxes
  const activeFills = isException && !promoted ? predictedFills : actualFills;

  const totalE = totalElectrons(actualFills);

  // ── play / step controls ──────────────────────────────────────────────────
  const stop = useCallback(() => {
    if (playRef.current) { window.clearInterval(playRef.current); playRef.current = null; }
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    // restart from empty if we're already full
    setFilled((f) => (f >= totalE ? 0 : f));
    setPromoted(false);
    setPlaying(true);
    playRef.current = window.setInterval(() => {
      setFilled((f) => {
        if (f + 1 >= totalE) {
          if (playRef.current) { window.clearInterval(playRef.current); playRef.current = null; }
          setPlaying(false);
          // on completion, if this is Cr/Cu, promote after a beat
          if (EXCEPTIONS[z]) window.setTimeout(() => setPromoted(true), 650);
          return totalE;
        }
        return f + 1;
      });
    }, 240);
  }, [stop, totalE, z]);

  const step = useCallback(() => {
    stop();
    setFilled((f) => {
      const next = Math.min(f + 1, totalE);
      if (next >= totalE && EXCEPTIONS[z]) window.setTimeout(() => setPromoted(true), 250);
      else setPromoted(false);
      return next;
    });
  }, [stop, totalE, z]);

  const reset = useCallback(() => { stop(); setFilled(0); setPromoted(false); }, [stop]);
  const fillAll = useCallback(() => { stop(); setFilled(totalE); setPromoted(true); }, [stop, totalE]);

  // when the element changes: reset the build & reset promotion state
  useEffect(() => {
    stop();
    setFilled(totalElectrons(buildConfig(z, true)));
    setPromoted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [z]);

  // jumping to the "exception" beat focuses Cr and forces the reveal flow
  const goStep = useCallback((idx: number) => {
    setStepIdx(idx);
    if (STEPS[idx].key === 'exception') {
      stop(); setZ(24); setFilled(totalElectrons(buildConfig(24, false))); setPromoted(false);
    }
    if (STEPS[idx].key === 'rules' || STEPS[idx].key === 'build') {
      // leave current element; nothing forced
    }
  }, [stop]);

  useEffect(() => () => { if (playRef.current) window.clearInterval(playRef.current); }, []);

  // ── derive what's currently revealed, box by box ──────────────────────────
  // Walk the active fill list, handing out `filled` electrons in order.
  let remainingShown = filled;
  const revealed: Array<Fill & { shown: number; isCurrent: boolean }> = [];
  for (const f of activeFills) {
    const shown = Math.max(0, Math.min(f.count, remainingShown));
    const isCurrent = remainingShown > 0 && remainingShown < f.count + 1 && shown < f.count
      ? true
      : (remainingShown > 0 && remainingShown <= f.count);
    revealed.push({ ...f, shown, isCurrent: shown > 0 && shown < f.count });
    remainingShown -= shown;
  }
  // the subshell currently filling = last one with 0 < shown < count, else last non-empty
  let currentKey = '';
  for (const r of revealed) {
    if (r.shown > 0) currentKey = r.key;
    if (r.shown > 0 && r.shown < r.count) { currentKey = r.key; break; }
  }

  // config strings reflect what's currently shown (so the string grows as you step)
  const shownFills: Fill[] = revealed.filter((r) => r.shown > 0).map((r) => ({ key: r.key, n: r.n, l: r.l, count: r.shown }));
  const fullStr = configString(shownFills);
  const sh = shorthand(z, shownFills);

  const atFull = filled >= totalE;
  const step3 = STEPS[stepIdx];

  // small UI helper -----------------------------------------------------------
  const PaneLabel = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-1 h-3.5 rounded" style={{ background: accent }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.text2 }}>{children}</span>
    </div>
  );

  // a single orbital box with ↑ / ↓ arrows
  const OrbitalBox = ({ spin, color }: { spin: number; color: string }) => (
    <div
      className="flex items-center justify-center rounded transition-all"
      style={{
        width: 26, height: 28,
        border: `1.5px solid ${spin > 0 ? color : 'rgba(255,255,255,0.10)'}`,
        background: spin > 0 ? `${color}1f` : 'rgba(255,255,255,0.02)',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1, color, letterSpacing: '-1px' }}>
        {spin === 2 ? '↑↓' : spin === 1 ? '↑' : ''}
      </span>
    </div>
  );

  return (
    <div className="w-full rounded-2xl p-4 md:p-6" style={{ background: C.bg, color: C.text }}>
      {/* header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Electron Configuration <span style={{ color: C.indigo }}>Builder</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            Watch three rules fill the boxes — even the exceptions have a reason
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest pt-1 px-3 py-1.5 rounded-full"
          style={{ color: C.amber, background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)` }}>
          Aufbau · Hund · Pauli
        </div>
      </div>

      {/* guided beat strip */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {STEPS.map((st, i) => {
          const active = i === stepIdx;
          return (
            <button key={st.key} onClick={() => goStep(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : C.border}`,
                color: active ? C.indigoLight : 'rgba(255,255,255,0.4)',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: active ? C.indigo : 'rgba(255,255,255,0.06)', color: '#fff' }}>{i + 1}</span>
              {st.label}
            </button>
          );
        })}
      </div>

      {/* narration */}
      <div className="mb-5 rounded-xl px-4 py-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="text-sm font-bold text-white mb-1">{step3.title}</div>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>{step3.body}</p>
      </div>

      {/* ── ELEMENT PICKER ── */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-start gap-4 flex-wrap">
          {/* big symbol tile */}
          <div className="rounded-xl flex flex-col items-center justify-center px-4 py-2 shrink-0"
            style={{ background: 'rgba(99,102,241,0.10)', border: `1px solid rgba(129,140,248,0.35)`, minWidth: 92 }}>
            <span className="text-[10px] font-bold tabular-nums" style={{ color: C.muted }}>Z = {z}</span>
            <span className="text-3xl font-black leading-none mt-0.5" style={{ color: C.indigoLight }}>{SYMBOL[z]}</span>
            <span className="text-[10px] mt-0.5" style={{ color: C.text2 }}>{NAME[z]}</span>
            {isException && (
              <span className="text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded"
                style={{ color: C.amberLight, background: 'rgba(251,191,36,0.12)' }}>exception ★</span>
            )}
          </div>

          {/* Z slider + periodic-ish strip */}
          <div className="flex-1 min-w-[240px]">
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2 flex justify-between" style={{ color: C.muted }}>
              <span>Atomic number Z</span>
              <span className="tabular-nums" style={{ color: C.indigoLight }}>{SYMBOL[z]} · {z}</span>
            </div>
            <input type="range" min={1} max={36} step={1} value={z}
              onChange={(e) => setZ(parseInt(e.target.value, 10))}
              className="w-full" style={{ accentColor: C.indigo }} />
            {/* compact element grid (H..Kr) */}
            <div className="flex flex-wrap gap-1 mt-3">
              {Array.from({ length: 36 }, (_, i) => i + 1).map((zz) => {
                const seld = zz === z;
                const exc = !!EXCEPTIONS[zz];
                return (
                  <button key={zz} onClick={() => setZ(zz)} title={`${NAME[zz]} (Z=${zz})`}
                    className="rounded text-[10px] font-bold tabular-nums transition-all"
                    style={{
                      width: 26, height: 22,
                      background: seld ? 'rgba(99,102,241,0.25)' : exc ? 'rgba(251,191,36,0.10)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${seld ? C.indigoMid : exc ? 'rgba(251,191,36,0.4)' : C.border}`,
                      color: seld ? C.indigoLight : exc ? C.amberLight : C.text2,
                    }}>
                    {SYMBOL[zz]}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] mt-2" style={{ color: C.muted }}>
              <span style={{ color: C.amberLight }}>★ amber</span> = the two configuration exceptions (Cr, Cu).
            </p>
          </div>
        </div>

        {/* build controls */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {!playing ? (
            <button onClick={play}
              className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'linear-gradient(to right, #6366f1, #818cf8)', color: '#fff' }}>
              ▶ Play
            </button>
          ) : (
            <button onClick={stop}
              className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: C.text, border: `1px solid ${C.border}` }}>
              ❚❚ Pause
            </button>
          )}
          <button onClick={step} disabled={atFull && !isException}
            className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: C.text2, border: `1px solid ${C.border}`, opacity: atFull && !isException ? 0.45 : 1 }}>
            Step ↦ <span className="tabular-nums">{Math.min(filled, totalE)}/{totalE} e⁻</span>
          </button>
          <button onClick={fillAll}
            className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: C.text2, border: `1px solid ${C.border}` }}>
            Fill all
          </button>
          <button onClick={reset}
            className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: C.text2, border: `1px solid ${C.border}` }}>
            ⟲ Reset
          </button>
        </div>
      </div>

      {/* ── ORBITAL BOXES + (n+l) ORDER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-4">
        {/* orbital boxes */}
        <div>
          <PaneLabel accent={C.indigo}>Orbital Boxes · Hund (singly first) + Pauli (max 2, opposite spins)</PaneLabel>
          <div className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex flex-col gap-2.5">
              {revealed.map((r) => {
                const spins = boxSpins(r.l, r.shown);
                const fullSpins = boxSpins(r.l, r.count);
                const color = SUB_COLOR[r.l];
                const active = r.key === currentKey && r.shown > 0 && r.shown < r.count;
                return (
                  <div key={r.key} className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-all"
                    style={{ background: active ? `${color}10` : 'transparent', border: `1px solid ${active ? `${color}40` : 'transparent'}` }}>
                    {/* label */}
                    <span className="text-sm font-bold tabular-nums shrink-0" style={{ width: 56, color: r.shown > 0 ? color : C.muted }}>
                      {r.key}{sup(r.shown)}
                    </span>
                    {/* boxes */}
                    <div className="flex gap-1.5">
                      {fullSpins.map((_, bi) => (
                        <OrbitalBox key={bi} spin={spins[bi]} color={color} />
                      ))}
                    </div>
                    {active && (
                      <span className="text-[10px] font-bold ml-auto whitespace-nowrap" style={{ color }}>filling…</span>
                    )}
                  </div>
                );
              })}
              {filled === 0 && (
                <p className="text-xs" style={{ color: C.muted }}>Press <strong style={{ color: C.text2 }}>Play</strong> or <strong style={{ color: C.text2 }}>Step</strong> to drop in the first electron.</p>
              )}
            </div>

            {/* Hund / Pauli legend */}
            <div className="flex items-center gap-4 mt-3 pt-3 text-[10px]" style={{ borderTop: `1px solid ${C.line}`, color: C.muted }}>
              <span className="flex items-center gap-1.5"><span style={{ color: C.emeraldLight, fontWeight: 800 }}>↑</span> first electron (Hund)</span>
              <span className="flex items-center gap-1.5"><span style={{ color: C.emeraldLight, fontWeight: 800 }}>↑↓</span> paired, opposite spins (Pauli)</span>
            </div>
          </div>
        </div>

        {/* (n+l) diagonal-order chart */}
        <div>
          <PaneLabel accent={C.amber}>Filling Order · lowest (n+l) first</PaneLabel>
          <div className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex flex-col gap-1">
              {AUFBAU.map((ss) => {
                const color = SUB_COLOR[ss.l];
                const isCur = ss.key === currentKey;
                const shownHere = revealed.find((r) => r.key === ss.key)?.shown ?? 0;
                // "fully done" tick: at capacity AND not the current one. (Cr/Cu 3d/4s
                // legitimately sit below the textbook capacity, so they never tick — correct.)
                const filledFull = shownHere >= CAPACITY[ss.l] && !isCur;
                return (
                  <div key={ss.key} className="flex items-center gap-2 px-2 py-1 rounded-md transition-all"
                    style={{
                      background: isCur ? `${color}14` : 'transparent',
                      border: `1px solid ${isCur ? `${color}45` : 'transparent'}`,
                    }}>
                    <span className="text-sm font-bold tabular-nums" style={{ width: 30, color: shownHere > 0 ? color : C.muted }}>{ss.key}</span>
                    <span className="text-[10px] tabular-nums" style={{ width: 58, color: C.ghost }}>n+l = {ss.nl}</span>
                    <span className="text-[10px] tabular-nums" style={{ color: shownHere > 0 ? C.text2 : C.muted }}>
                      {shownHere}/{CAPACITY[ss.l]} e⁻
                    </span>
                    {isCur && <span className="text-[10px] font-bold ml-auto" style={{ color }}>← now</span>}
                    {!isCur && filledFull && <span className="text-[10px] ml-auto" style={{ color: C.emeraldLight }}>✓</span>}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 text-[10px] leading-relaxed" style={{ borderTop: `1px solid ${C.line}`, color: C.muted }}>
              <strong style={{ color: C.text2 }}>Why 4s before 3d?</strong> 4s has n+l = <span className="tabular-nums">4</span>, 3d has n+l = <span className="tabular-nums">5</span>. Lower (n+l) is lower energy, so it fills first. On a tie, the lower n wins.
            </div>
          </div>
        </div>
      </div>

      {/* ── CONFIGURATION STRINGS ── */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.muted }}>Full configuration</div>
          <div className="text-base font-bold tabular-nums leading-relaxed" style={{ color: C.text }}>
            {fullStr || <span style={{ color: C.muted }}>—</span>}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.muted }}>Noble-gas shorthand</div>
          <div className="text-base font-bold tabular-nums leading-relaxed" style={{ color: C.text }}>
            {sh.rest || sh.core ? (
              <>
                {sh.core && <span style={{ color: C.amberLight }}>[{sh.core}]</span>} <span>{sh.rest}</span>
              </>
            ) : <span style={{ color: C.muted }}>—</span>}
          </div>
        </div>
      </div>

      {/* ── EXCEPTION SPOTLIGHT (Cr / Cu) ── */}
      {isException && (
        <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.05)', border: `1px solid rgba(251,191,36,0.28)` }}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-bold text-white">{NAME[z]} ({SYMBOL[z]}) breaks plain Aufbau</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* predicted (wrong) */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(220,38,38,0.07)', border: `1px solid rgba(248,113,113,0.30)` }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.red }}>Aufbau predicts (less stable)</div>
              <div className="text-sm font-bold tabular-nums" style={{ color: C.red }}>
                [{shorthand(z, predictedFills).core}] {shorthand(z, predictedFills).rest}
              </div>
            </div>
            {/* actual (right) */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(16,185,129,0.07)', border: `1px solid rgba(52,211,153,0.30)` }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.emeraldLight }}>Actually observed (stable)</div>
              <div className="text-sm font-bold tabular-nums" style={{ color: C.emeraldLight }}>
                [{shorthand(z, actualFills).core}] {shorthand(z, actualFills).rest}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button onClick={() => setPromoted((p) => !p)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{ background: promoted ? 'rgba(16,185,129,0.14)' : 'rgba(99,102,241,0.16)', color: promoted ? C.emeraldLight : C.indigoLight, border: `1px solid ${promoted ? 'rgba(52,211,153,0.4)' : 'rgba(129,140,248,0.4)'}` }}>
              {promoted ? '↩ Show predicted config' : '↑ Promote 4s → 3d electron'}
            </button>
            <span className="text-[11px]" style={{ color: C.text2 }}>
              {promoted ? 'Showing the real, more stable arrangement above.' : 'Click to move one 4s electron into 3d and watch the boxes change.'}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed mt-3" style={{ color: C.text2 }}>
            One <strong style={{ color: C.indigoLight }}>4s</strong> electron jumps into <strong style={{ color: C.amber }}>3d</strong> because a{' '}
            <strong style={{ color: C.amberLight }}>{EXCEPTIONS[z].reason}</strong> subshell is extra stable — its electrons sit in a symmetrical spread and gain extra exchange energy. The tiny energy cost of the jump is more than repaid by that stability.
          </p>
        </div>
      )}

      {/* ── PAYOFF ── */}
      <div className="mt-5 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.22)` }}>
        <span className="text-lg">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
          You never had to memorise a single configuration. <strong style={{ color: C.text }}>Aufbau</strong> sets the order (lowest n+l first),{' '}
          <strong style={{ color: C.text }}>Hund</strong> spreads electrons out one-per-box before pairing, and{' '}
          <strong style={{ color: C.text }}>Pauli</strong> caps each box at two opposite spins. Run those three rules and the configuration of any atom up to krypton just falls out — and the famous{' '}
          <strong style={{ color: C.amberLight }}>chromium and copper exceptions</strong> are not magic either: a half-filled{' '}
          <span className="tabular-nums">(d{sup(5)})</span> or full{' '}
          <span className="tabular-nums">(d{sup(10)})</span> shell is simply too stable to pass up.
        </p>
      </div>
    </div>
  );
}
