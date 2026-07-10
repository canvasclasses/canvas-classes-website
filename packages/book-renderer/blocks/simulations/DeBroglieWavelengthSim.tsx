'use client';

// ──────────────────────────────────────────────────────────────────────────
// de Broglie Wavelength  ·  simulation_id: 'debroglie-wavelength'
// Class 11 Chemistry · Chapter 2 (Structure of Atom) · §2.5.1 Dual nature page
//
// Kills ONE stubborn stumbling block: "If everything has a wave nature, why
// doesn't a cricket ball ever behave like a wave?" Students can plug numbers
// into λ = h/mv but have zero feel for SCALE. This sim makes them FEEL that
// every object really does have a de Broglie wavelength — but it only MATTERS
// (is observable as diffraction) when λ is comparable to the size of the
// object / the aperture it meets.
//
//   pick an object spanning ~36 orders of magnitude in mass
//        → λ collapses to absurd smallness as mass climbs
//        → compare λ to the object's OWN size (the punchline)
//
//   electron     → λ ≈ size of an atom        → wave nature OBSERVABLE
//   cricket ball → λ ≈ 10³³× smaller than ball → never diffracts
//
// ACADEMIC SOURCES (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7) —
// every number is standard NCERT Class 11 Chapter 2 §2.5.1 data, NOT generated
// from training knowledge:
//   • de Broglie relation:  λ = h / (m · v)
//   • Planck's constant:    h = 6.626 × 10⁻³⁴ J·s
//   • Object data (mass kg, typical speed m/s, characteristic size m, λ to
//     sanity-check the live formula λ = h/(m·v) — λ is COMPUTED, never hardcoded):
//       Electron:      m = 9.11 × 10⁻³¹,  v = 2.2 × 10⁶ (≈ Bohr first-orbit speed),
//                      size ≈ 1 × 10⁻¹⁰ m (atomic scale)  → λ ≈ 3.3 × 10⁻¹⁰ m
//                      (COMPARABLE to atomic spacing → wave nature observable;
//                       confirmed by Davisson–Germer electron diffraction, 1927)
//       Proton:        m = 1.67 × 10⁻²⁷,  v = 1 × 10⁵,  size ≈ 1 × 10⁻¹⁵ m → λ ≈ 4 × 10⁻¹² m
//       Dust speck:    m = 1 × 10⁻⁹,      v = 0.01,     size ≈ 1 × 10⁻⁴ m  → λ ≈ 6.6 × 10⁻²³ m
//       Grain of sand: m = 1 × 10⁻⁶,      v = 0.1,      size ≈ 5 × 10⁻⁴ m  → λ ≈ 6.6 × 10⁻²⁷ m
//       Cricket ball:  m = 0.16,          v = 40,       size ≈ 0.036 m     → λ ≈ 1.0 × 10⁻³⁴ m
//                      (≈10³³× smaller than the ball → never diffracts)
//       Person running:m = 60,            v = 5,        size ≈ 0.5 m       → λ ≈ 2.2 × 10⁻³⁶ m
//   • Punchline: wave nature is REAL for everything, but only OBSERVABLE when λ
//     is comparable to the size of the obstacle/aperture the object meets. For
//     an electron that happens at atomic scale; for any everyday object λ is so
//     many orders of magnitude smaller than any aperture that diffraction can
//     never be seen.
// ──────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

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
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
};

// ── physics constants ───────────────────────────────────────────────────────
const H_PLANCK = 6.626e-34; // J·s — Planck's constant

// de Broglie wavelength — COMPUTED live, never read from a table
const lambdaM = (massKg: number, speedMs: number) => H_PLANCK / (massKg * speedMs);

// ── scientific notation → "6.626 × 10⁻³⁴" (workflow §2, never "6.626e-34") ──
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function prettyExp(eNotation: string): string {
  const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return eNotation;
  const mantissa = m[1];
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return mantissa;
  const sup = String(Math.abs(expNum)).split('').map((d) => SUP_DIGITS[parseInt(d, 10)]).join('');
  const sign = expNum < 0 ? '⁻' : '';
  return `${mantissa} × 10${sign}${sup}`;
}

// just the "× 10⁻³⁴" power, for compact inline use
function prettyPow(value: number): string {
  if (value === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const sup = String(Math.abs(exp)).split('').map((d) => SUP_DIGITS[parseInt(d, 10)]).join('');
  return `10${exp < 0 ? '⁻' : ''}${sup}`;
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

// ── object catalogue (academic data — see header) ───────────────────────────
type Obj = {
  key: string;
  name: string;
  emoji: string;
  mass: number;    // kg
  speed: number;   // m/s  — typical / default speed
  vMin: number;    // m/s  — velocity slider bounds (kept physically sensible)
  vMax: number;
  size: number;    // m    — characteristic physical size
  sizeLabel: string;
};

const OBJECTS: Obj[] = [
  { key: 'electron', name: 'Electron', emoji: '🔵', mass: 9.11e-31, speed: 2.2e6, vMin: 2.2e5, vMax: 2.2e7, size: 1e-10, sizeLabel: 'atom scale (~0.1 nm)' },
  { key: 'proton', name: 'Proton', emoji: '🟣', mass: 1.67e-27, speed: 1e5, vMin: 1e4, vMax: 1e6, size: 1e-15, sizeLabel: 'nucleus scale (~1 fm)' },
  { key: 'dust', name: 'Dust speck', emoji: '🌫️', mass: 1e-9, speed: 0.01, vMin: 0.001, vMax: 0.1, size: 1e-4, sizeLabel: '~0.1 mm' },
  { key: 'sand', name: 'Grain of sand', emoji: '🟡', mass: 1e-6, speed: 0.1, vMin: 0.01, vMax: 1, size: 5e-4, sizeLabel: '~0.5 mm' },
  { key: 'cricket', name: 'Cricket ball', emoji: '🏏', mass: 0.16, speed: 40, vMin: 5, vMax: 45, size: 0.036, sizeLabel: '~3.6 cm' },
  { key: 'person', name: 'Person running', emoji: '🏃', mass: 60, speed: 5, vMin: 1, vMax: 10, size: 0.5, sizeLabel: '~0.5 m' },
];

// ── guided narrative beats (match the STEPS pattern in the sibling files) ───
type StepDef = { key: string; label: string; title: string; body: string; objIdx?: number };
const STEPS: StepDef[] = [
  {
    key: 'wave',
    label: 'Everything Is a Wave?',
    title: 'de Broglie: every moving object has a wavelength',
    body:
      'In 1924 de Broglie made a wild claim: matter is not just particles — every moving object also has a wave, with wavelength λ = h / (m·v). It is not a metaphor; the electron one really was caught diffracting (Davisson–Germer, 1927). Start with the electron and read its wavelength — it comes out to about the size of an atom. That is exactly why an electron behaves like a wave inside atoms.',
    objIdx: 0,
  },
  {
    key: 'climb',
    label: 'Slide Up the Mass',
    title: 'Heavier → the wavelength collapses',
    body:
      'Now climb the ladder of objects, from electron to proton to dust to sand to a cricket ball to a running person — about 36 powers of ten in mass. Because mass sits on the bottom of the fraction, λ shrinks just as fast. Watch the wavelength number free-fall, and watch the wave overlay flatten from a clear ripple into a dead-straight line.',
    objIdx: 4,
  },
  {
    key: 'never',
    label: 'Why We Never SEE It',
    title: 'The wave is real — but unimaginably too small to matter',
    body:
      "A wave only shows itself (bends, diffracts) when it meets a gap or obstacle about its own size. The electron's λ matches atomic spacing, so atoms diffract it. The cricket ball's λ is roughly 10³³ times smaller than the ball itself — smaller than a proton, smaller than anything that exists to diffract it. The wave is genuinely there; there is simply no aperture in the universe small enough to reveal it. THAT is why a cricket ball is never a wave in practice.",
    objIdx: 4,
  },
];

// log10 helper bounded for the comparison bar
const log10 = (x: number) => Math.log10(x);

export default function DeBroglieWavelengthSim() {
  const [stepIdx, setStepIdx] = useState(0);
  const [objIdx, setObjIdx] = useState(0);
  const obj = OBJECTS[objIdx];
  const [speed, setSpeed] = useState(OBJECTS[0].speed);

  // switch object → reset the velocity slider to that object's typical speed
  const pickObject = (idx: number) => {
    setObjIdx(idx);
    setSpeed(OBJECTS[idx].speed);
  };

  const goStep = (idx: number) => {
    setStepIdx(idx);
    const target = STEPS[idx].objIdx;
    if (target !== undefined) pickObject(target);
  };

  // ── live de Broglie computation ───────────────────────────────────────────
  const lam = lambdaM(obj.mass, speed);            // m — COMPUTED, never hardcoded
  const ratioLambdaOverSize = lam / obj.size;       // λ relative to the object's own size
  // how many orders of magnitude λ is below the object's size (positive = smaller)
  const ordersSmaller = log10(obj.size) - log10(lam);
  // observable when λ is within ~3 orders of magnitude of the object's own size
  const observable = ordersSmaller <= 3;

  // ── wave-overlay geometry ─────────────────────────────────────────────────
  // The wave's "relevance" maps the λ/size ratio to a visible amplitude + a
  // wavelength on the SVG. When λ ≈ size (electron) we draw a clear ripple;
  // when λ ≪ size (everyday objects) it collapses toward a straight line.
  // relevance: 1 when λ≈size, →0 as λ gets many orders smaller.
  const relevance = Math.max(0, Math.min(1, 1 - (ordersSmaller - 0) / 6)); // 0 orders→1, 6 orders→0
  const waveAmp = 2 + relevance * 26;               // px amplitude of the overlay ripple
  const waveCycles = 1.2 + relevance * 5.5;          // visible cycles across the panel
  const svgW = 520, svgH = 200;
  const midY = svgH * 0.62;
  const waveX0 = 40, waveX1 = svgW - 40;
  // build the sine path
  const wavePts: string[] = [];
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = waveX0 + t * (waveX1 - waveX0);
    const y = midY - Math.sin(t * waveCycles * Math.PI * 2) * waveAmp;
    wavePts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const wavePath = wavePts.join(' ');
  // a "to-scale" dot representing the object (visual cue only, area not literal)
  const objR = 10 + Math.min(26, Math.max(0, (log10(obj.size) + 10) * 2.2));

  // ── log comparison bar: λ vs object size on a shared log axis ──────────────
  // Axis spans from 1e-36 m (below smallest λ) to 1e1 m (above person).
  const AX_MIN = -36, AX_MAX = 1;
  const axFrac = (meters: number) => {
    const e = log10(meters);
    return Math.max(0, Math.min(1, (e - AX_MIN) / (AX_MAX - AX_MIN)));
  };
  const lamFrac = axFrac(lam);
  const sizeFrac = axFrac(obj.size);

  const step = STEPS[stepIdx];

  // small UI helper -----------------------------------------------------------
  const PaneLabel = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-1 h-3.5 rounded" style={{ background: accent }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.text2 }}>{children}</span>
    </div>
  );

  return (
    <div className="w-full rounded-2xl p-4 md:p-6" style={{ background: C.bg, color: C.text }}>
      {/* header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            de Broglie <span style={{ color: C.indigo }}>Wavelength</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            Everything is a wave — but only when λ matches its own size
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest pt-1 px-3 py-1.5 rounded-full"
          style={{ color: C.amber, background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)` }}>
          λ = h / (m·v)
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
        <div className="text-sm font-bold text-white mb-1">{step.title}</div>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>{step.body}</p>
      </div>

      {/* ── VISUAL PANEL (hero): the object + its wave overlay ── */}
      <div className="mb-4">
        <PaneLabel accent={C.indigo}>The Object &amp; Its Matter-Wave · the ripple flattens as mass climbs</PaneLabel>
        <div className="relative w-full rounded-xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full block" style={{ height: 200 }} preserveAspectRatio="xMidYMid meet">
            {/* baseline path of travel */}
            <line x1={waveX0} y1={midY} x2={waveX1} y2={midY} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="3 5" />
            {/* the de Broglie wave overlay */}
            <path d={wavePath} fill="none" stroke={observable ? C.indigoMid : C.ghost} strokeWidth={2.2}
              style={{ transition: 'all 0.4s ease', filter: observable ? `drop-shadow(0 0 6px ${C.indigo})` : 'none' }} />
            {/* the moving object */}
            <circle cx={(waveX0 + waveX1) / 2} cy={midY} r={objR}
              fill={observable ? C.indigo : C.surface} stroke={observable ? C.indigoLight : 'rgba(255,255,255,0.25)'} strokeWidth={1.5}
              style={{ transition: 'all 0.4s ease' }} />
            <text x={(waveX0 + waveX1) / 2} y={midY + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">
              {obj.emoji}
            </text>
            {/* verdict tag */}
            <text x={waveX0} y={22} fontSize={11} fontWeight={700} fill={observable ? C.emeraldLight : C.ghost}
              style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {observable ? '◆ wave nature observable' : '◆ wave nature unobservable'}
            </text>
            <text x={waveX1} y={22} textAnchor="end" fontSize={10} fontWeight={600} fill={C.text2}>
              {obj.name}
            </text>
            {/* amplitude hint label */}
            <text x={(waveX0 + waveX1) / 2} y={svgH - 12} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.muted}>
              {observable
                ? 'λ ≈ the size of the gap it meets → it bends (diffracts)'
                : 'λ ≪ any gap that exists → the wave is there but stays hidden'}
            </text>
          </svg>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* object selector */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>
              Object — light → heavy (≈ 36 powers of ten in mass)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {OBJECTS.map((o, i) => (
                <button key={o.key} onClick={() => pickObject(i)}
                  className="px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1"
                  style={{
                    background: objIdx === i ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                    color: objIdx === i ? C.indigoLight : C.text2,
                    border: `1px solid ${objIdx === i ? 'rgba(129,140,248,0.4)' : C.border}`,
                  }}
                  title={`${o.name} · mass ${prettyExp(o.mass.toExponential(2))} kg`}>
                  <span>{o.emoji}</span>{o.name}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] tabular-nums" style={{ color: C.ghost }}>
              <span>mass m = <strong style={{ color: C.text2 }}>{prettyExp(obj.mass.toExponential(2))}</strong> kg</span>
              <span>own size ≈ <strong style={{ color: C.text2 }}>{prettyExp(obj.size.toExponential(1))}</strong> m</span>
              <span className="opacity-80">({obj.sizeLabel})</span>
            </div>
          </div>

          {/* velocity slider */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2 flex justify-between" style={{ color: C.muted }}>
              <span>Speed v</span>
              <span style={{ color: C.indigoLight }} className="tabular-nums">
                {prettyExp(speed.toExponential(2))} m/s
              </span>
            </div>
            {/* log-scale velocity slider so the wide range is usable */}
            <input
              type="range"
              min={log10(obj.vMin)}
              max={log10(obj.vMax)}
              step={0.01}
              value={log10(speed)}
              onChange={(e) => setSpeed(Math.pow(10, parseFloat(e.target.value)))}
              className="w-full" style={{ accentColor: C.indigo }}
            />
            <p className="text-[11px] leading-snug mt-1.5" style={{ color: C.muted }}>
              Speed sits under m in the fraction too — <span style={{ color: C.indigoLight }}>slower → longer λ</span>. Even so,
              no everyday speed can rescue a heavy object's wavelength.
            </p>
          </div>
        </div>

        {/* live λ = h / (m·v) substitution */}
        <div className="mt-4 pt-4 flex items-center justify-center gap-3 flex-wrap text-lg"
          style={{ borderTop: `1px solid ${C.line}`, color: C.text }}>
          <span style={{ color: C.muted }} className="text-xs font-bold uppercase tracking-widest mr-1">de Broglie</span>
          <span style={{ fontStyle: 'italic' }}>λ</span>
          <span style={{ color: C.muted }}>=</span>
          <Frac
            num={<span style={{ color: C.amber, fontStyle: 'italic' }}>h</span>}
            den={<span className="tabular-nums"><span style={{ fontStyle: 'italic' }}>m</span>·<span style={{ fontStyle: 'italic' }}>v</span></span>}
          />
          <span style={{ color: C.muted }}>=</span>
          <Frac
            num={<span className="tabular-nums" style={{ color: C.amberLight }}>{prettyExp(H_PLANCK.toExponential(3))}</span>}
            den={<span className="tabular-nums" style={{ color: C.text2 }}>{prettyExp(obj.mass.toExponential(2))} × {prettyExp(speed.toExponential(2))}</span>}
          />
          <span style={{ color: C.muted }}>=</span>
          <strong className="tabular-nums" style={{ color: observable ? C.emeraldLight : C.indigoLight }}>
            {prettyExp(lam.toExponential(2))} m
          </strong>
        </div>
      </div>

      {/* ── THE PUNCHLINE PANEL: λ vs the object's own size (log axis) ── */}
      <div className="mb-2">
        <PaneLabel accent={C.amber}>λ vs the object&apos;s OWN size · on a shared log axis (metres)</PaneLabel>
      </div>
      <div className="rounded-xl p-4 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        {/* the log bar */}
        <div className="relative w-full" style={{ height: 64 }}>
          {/* track */}
          <div className="absolute left-0 right-0 rounded-full" style={{ top: 30, height: 4, background: 'rgba(255,255,255,0.07)' }} />
          {/* decade ticks */}
          {[-36, -30, -24, -18, -12, -6, 0].map((e) => {
            const f = (e - AX_MIN) / (AX_MAX - AX_MIN);
            return (
              <div key={e} className="absolute" style={{ left: `${f * 100}%`, top: 26 }}>
                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
                <div className="text-[10px] tabular-nums" style={{ color: C.muted, transform: 'translateX(-50%)', marginTop: 2 }}>
                  {prettyPow(Math.pow(10, e))}
                </div>
              </div>
            );
          })}
          {/* λ marker */}
          <div className="absolute flex flex-col items-center" style={{ left: `${lamFrac * 100}%`, top: 0, transform: 'translateX(-50%)', transition: 'left 0.4s ease' }}>
            <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: C.indigoLight }}>λ</span>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.indigo, boxShadow: `0 0 8px ${C.indigo}`, marginTop: 2 }} />
          </div>
          {/* size marker */}
          <div className="absolute flex flex-col items-center" style={{ left: `${sizeFrac * 100}%`, top: 40, transform: 'translateX(-50%)', transition: 'left 0.4s ease' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.amber, boxShadow: `0 0 8px ${C.amber}` }} />
            <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: C.amberLight, marginTop: 2 }}>own size</span>
          </div>
        </div>

        {/* the verdict line */}
        <div className="mt-3 pt-3 flex items-center flex-wrap gap-x-4 gap-y-1.5 text-sm tabular-nums"
          style={{ borderTop: `1px solid ${C.line}` }}>
          <span style={{ color: C.text2 }}>
            <span style={{ color: C.indigoLight }}>λ</span> is{' '}
            <strong style={{ color: observable ? C.emeraldLight : C.red }}>
              {ordersSmaller <= 0.5
                ? '≈ the same as'
                : `~10${prettyPow(Math.pow(10, Math.round(ordersSmaller))).slice(2)}× smaller than`}
            </strong>{' '}
            the object&apos;s own size
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
            style={{
              color: observable ? C.emeraldLight : C.ghost,
              background: observable ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${observable ? 'rgba(16,185,129,0.3)' : C.border}`,
            }}>
            {observable ? '✓ diffraction observable' : '✕ diffraction never observable'}
          </span>
          <span className="text-[11px]" style={{ color: C.ghost }}>
            λ/size = {prettyExp(ratioLambdaOverSize.toExponential(1))}
          </span>
        </div>
      </div>

      {/* ── PAYOFF callout ── */}
      <div className="mt-5 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.22)` }}>
        <span className="text-lg">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
          Every object truly has a matter-wave — the formula never returns zero. But a wave only reveals itself by
          bending when it meets a gap about <strong style={{ color: C.text }}>its own wavelength wide</strong>. The{' '}
          <strong style={{ color: C.indigoLight }}>electron&apos;s</strong> λ lands right at atomic scale, so atoms diffract
          it — that is the 1927 Davisson–Germer experiment. A{' '}
          <strong style={{ color: C.text }}>cricket ball&apos;s</strong> λ is about{' '}
          <strong style={{ color: C.amberLight }} className="tabular-nums">10³³ times smaller than the ball</strong> —
          smaller than a proton, smaller than any aperture that exists. The wave is real; the universe simply has no slit
          fine enough to show it. <strong style={{ color: C.text }}>That</strong> is why we never see everyday things behave
          like waves — not because they have none, but because λ is unimaginably too small to matter.
        </p>
      </div>
    </div>
  );
}
