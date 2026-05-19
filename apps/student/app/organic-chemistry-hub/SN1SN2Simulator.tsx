'use client';

// Source: NCERT Class 12 Chemistry Part I, Chapter 10 (Haloalkanes and Haloarenes),
// Section 10.5.1 "Nucleophilic Substitution Reactions". Specifically:
//   - SN2 is a single-step concerted reaction with backside attack of the nucleophile,
//     causing inversion of configuration (Walden inversion).
//   - SN1 proceeds via a planar (sp²) carbocation intermediate which is achiral; the
//     nucleophile attacks either face with equal probability, giving a racemic mixture.

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'sn2-mech' | 'sn2-stereo' | 'sn1-mech' | 'sn1-stereo';

const STEPS: { id: Phase; label: string }[] = [
  { id: 'sn2-mech',   label: 'SN2 Mechanism' },
  { id: 'sn2-stereo', label: 'SN2 Inversion' },
  { id: 'sn1-mech',   label: 'SN1 Mechanism' },
  { id: 'sn1-stereo', label: 'SN1 Racemization' },
];

const PHASE_ACCENT: Record<Phase, string> = {
  'sn2-mech':   '#818cf8',
  'sn2-stereo': '#34d399',
  'sn1-mech':   '#fbbf24',
  'sn1-stereo': '#f472b6',
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES (atom palette + animations)
// ─────────────────────────────────────────────────────────────────────────────

const SIM_CSS = `
.sn-atom-c     { fill:#2d3a5a; stroke:#6366f1; stroke-width:2.5; }
.sn-atom-x     { fill:#d64545; stroke:#991b1b; stroke-width:2.5; }
.sn-atom-nu    { fill:#0a2218; stroke:#34d399; stroke-width:2.5; }
.sn-atom-r     { fill:#8b5cf6; stroke:#5b21b6; stroke-width:2; }
.sn-atom-h     { fill:#0a2218; stroke:#34d399; stroke-width:2; }
.sn-bond       { stroke:rgba(99,102,241,0.45); stroke-width:5; stroke-linecap:round; fill:none; }
.sn-bond-faint { stroke:rgba(99,102,241,0.25); stroke-width:5; stroke-linecap:round; fill:none; stroke-dasharray:8 6; }
.sn-attack     { stroke:#fbbf24; stroke-width:3.5; stroke-dasharray:10 8; fill:none; }
.sn-text       { fill:#e2e8f0; font-weight:800; font-family:ui-sans-serif,system-ui,sans-serif; }
.sn-text-muted { fill:#64748b; font-weight:700; font-family:ui-sans-serif,system-ui,sans-serif; }
@keyframes sn-pulse { 0%,100%{filter:brightness(1);} 50%{filter:brightness(1.6);} }
.sn-pulse { animation: sn-pulse 1.6s ease-in-out infinite; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SHARED — TINY ATOM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function Atom({ x, y, r = 22, cls, label, sub }: {
  x: number; y: number; r?: number; cls: string; label: string; sub?: string;
}) {
  return (
    <g style={{ transition: 'transform 0.35s ease' }}>
      <circle cx={x} cy={y} r={r} className={cls} />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
        className="sn-text" fontSize={r > 18 ? 14 : 11}>{label}</text>
      {sub && (
        <text x={x} y={y + r + 12} textAnchor="middle" className="sn-text-muted" fontSize={10}>{sub}</text>
      )}
    </g>
  );
}

// Filled triangle representing a wedge bond (toward the viewer).
// Narrow at (x1,y1) — the central atom — and wider at (x2,y2) — the substituent.
function wedgePoints(x1: number, y1: number, x2: number, y2: number, w = 14): string {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * (w / 2);
  const py = ( dx / len) * (w / 2);
  return `${x1},${y1} ${x2 + px},${y2 + py} ${x2 - px},${y2 - py}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 — SN2 MECHANISM (concerted backside attack + umbrella inversion)
// ─────────────────────────────────────────────────────────────────────────────

function SN2MechCanvas({ t }: { t: number }) {
  // t ∈ [0,1]. 0 = before attack, 0.5 = transition state, 1 = after.
  // Side view: Br (right) — C (centre) — Nu (left), all on the horizontal axis.
  // Three R groups (a, b, c) form a tetrahedral tripod with C, drawn in a
  // standard wedge/dash 2D projection:
  //   a — top, plain bond (in plane of page)
  //   b — lower-left, wedge bond (toward viewer, in front of page)
  //   c — lower-right, dash bond (away from viewer, behind page)
  // The umbrella inverts: the whole tripod's x-component flips from -tetraX (Nu side)
  // to +tetraX (X side) as t goes 0 → 1. y/z components and wedge/dash designations
  // are preserved (Walden inversion in side view).
  const cx = 400, cy = 300;

  // Br moves out, Nu moves in
  const xDist  = 90  + t * 180;
  const nuDist = 270 - t * 180;
  const xBr = cx + xDist;
  const xNu = cx - nuDist;

  // Umbrella tilt direction: -1 at t=0 (toward Nu), +1 at t=1 (toward where Br was)
  const tilt = 2 * t - 1;
  const tetraX = 26;   // tetrahedral x-component magnitude (≈ bondLength × 1/3)

  // TS visibility (peak at t=0.5, narrow window)
  const tsVis = Math.max(0, 1 - Math.abs(t - 0.5) * 4.5);

  const groups = [
    // a: top — bond in plane of page (plain)
    { name: 'a', vx: 0,   vy: -70, color: '#8b5cf6', stroke: '#5b21b6', kind: 'plain' as const },
    // b: lower-left — wedge bond (front)
    { name: 'b', vx: -22, vy: 36,  color: '#f472b6', stroke: '#be185d', kind: 'wedge' as const },
    // c: lower-right — dash bond (back)
    { name: 'c', vx: 22,  vy: 36,  color: '#34d399', stroke: '#059669', kind: 'dash'  as const },
  ];

  const xBrBondOp = 1 - Math.min(1, t * 1.5);
  const nuBondOp  = Math.min(1, Math.max(0, (t - 0.05) * 1.5));

  return (
    <svg viewBox="0 0 800 600" width="100%" height="100%">
      {/* Reference axis (Nu—C—Br line) */}
      <line x1={120} y1={cy} x2={680} y2={cy} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 6" />

      {/* Nu—C bond (forming) */}
      <line x1={xNu + 22} y1={cy} x2={cx - 22} y2={cy}
        className={nuBondOp > 0.7 ? 'sn-bond' : 'sn-bond-faint'}
        style={{ opacity: Math.max(0.15, nuBondOp) }} />

      {/* C—Br bond (breaking) */}
      <line x1={cx + 22} y1={cy} x2={xBr - 22} y2={cy}
        className={xBrBondOp > 0.5 ? 'sn-bond' : 'sn-bond-faint'}
        style={{ opacity: Math.max(0.15, xBrBondOp) }} />

      {/* Three R-groups */}
      {groups.map((g) => {
        const x = cx + tilt * tetraX + g.vx;
        const y = cy + g.vy;
        // Compute bond endpoints, pulled back from atom edges
        const dx = x - cx, dy = y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const bx1 = cx + ux * 24, by1 = cy + uy * 24;
        const bx2 = x  - ux * 18, by2 = y  - uy * 18;

        return (
          <g key={g.name}>
            {/* Plain bond layer — visible at TS, hidden far from it */}
            {g.kind !== 'plain' && tsVis > 0.05 && (
              <line x1={bx1} y1={by1} x2={bx2} y2={by2}
                className="sn-bond" style={{ opacity: tsVis }} />
            )}
            {/* Wedge / dash / plain bond — fades out at TS */}
            {g.kind === 'plain' && (
              <line x1={bx1} y1={by1} x2={bx2} y2={by2} className="sn-bond" />
            )}
            {g.kind === 'wedge' && (
              <polygon points={wedgePoints(bx1, by1, bx2, by2, 14)}
                fill="rgba(99,102,241,0.65)" stroke="rgba(99,102,241,0.85)" strokeWidth={1}
                style={{ opacity: 1 - tsVis }} />
            )}
            {g.kind === 'dash' && (
              <line x1={bx1} y1={by1} x2={bx2} y2={by2}
                stroke="rgba(99,102,241,0.55)" strokeWidth={5} strokeLinecap="round"
                strokeDasharray="3 5"
                style={{ opacity: 1 - tsVis }} />
            )}
            <circle cx={x} cy={y} r={18} fill={g.color} stroke={g.stroke} strokeWidth={2} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              className="sn-text" fontSize={12}>{g.name}</text>
          </g>
        );
      })}

      {/* Central carbon */}
      <Atom x={cx} y={cy} r={22} cls="sn-atom-c" label="C" />

      {/* Br */}
      <g style={{ opacity: 1 - 0.4 * t }}>
        <Atom x={xBr} y={cy} r={22} cls="sn-atom-x" label="Br" sub={t > 0.55 ? 'leaving' : ''} />
      </g>

      {/* Nu */}
      <g>
        <Atom x={xNu} y={cy} r={22} cls="sn-atom-nu" label="OH⁻" sub={t < 0.45 ? 'attacks' : ''} />
      </g>

      {/* Attack arrow */}
      {t < 0.5 && (
        <g style={{ opacity: 1 - t * 1.8 }}>
          <path d={`M ${xNu + 30} ${cy - 30} Q ${(xNu + cx) / 2} ${cy - 50} ${cx - 28} ${cy - 8}`}
            className="sn-attack" markerEnd="url(#arrowAmber)" />
        </g>
      )}

      {/* TS label */}
      {tsVis > 0.15 && (
        <text x={cx} y={cy - 100} textAnchor="middle" className="sn-text" fontSize={13}
          style={{ opacity: tsVis }} fill="#fbbf24">[ Transition State ]</text>
      )}

      {/* Stage label */}
      <text x={cx} y={560} textAnchor="middle" className="sn-text" fontSize={13}>
        {t < 0.15 ? 'Reactants — Nu approaches opposite the leaving group'
          : t < 0.4 ? 'Bond to Nu forms as bond to Br weakens'
          : t < 0.6 ? 'Transition state — five partial bonds, a/b/c in one plane'
          : t < 0.85 ? 'Br leaves; umbrella inverts through the carbon'
          : 'Product — configuration inverted (wedge & dash on the right side now)'}
      </text>

      <defs>
        <marker id="arrowAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
        </marker>
      </defs>
    </svg>
  );
}

function SN2MechPhase() {
  const [t, setT] = useState(0);
  const stage = t < 0.4 ? 'approach' : t < 0.6 ? 'ts' : 'product';

  const sidebar = [
    { id: 'approach', title: '1 · Backside Attack',
      body: 'The nucleophile approaches the carbon along the line opposite the leaving group. This is the only geometry that lets the new bond form as the old one breaks.' },
    { id: 'ts', title: '2 · Transition State',
      body: 'At the halfway point, the Nu—C bond is half-formed and the C—Br bond is half-broken. The three other groups (a, b, c) are squeezed into a flat plane through the carbon — five partial bonds in a trigonal-bipyramidal arrangement.' },
    { id: 'product', title: '3 · Walden Inversion',
      body: 'As Br⁻ leaves, the three groups snap through to the opposite side, like an umbrella turning inside-out in the wind. The carbon ends up with the same four groups but in a mirrored 3D arrangement.' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#818cf8' }}>The Rule</p>
          <p className="text-white font-bold text-lg leading-snug">
            SN2 is one concerted step. The nucleophile pushes in from{' '}
            <span style={{ color: '#fbbf24' }}>180° opposite</span> the leaving group, flipping
            the carbon&rsquo;s 3D arrangement in the process.
          </p>
        </div>

        <div className="relative overflow-hidden flex items-center justify-center rounded-3xl"
          style={{ minHeight: 420,
            background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
            border: '1px solid rgba(99,102,241,0.2)' }}>
          <SN2MechCanvas t={t} />
        </div>

        <div className="flex items-center gap-4 pt-1">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#475569' }}>Reaction progress</span>
          <input type="range" min={0} max={100} value={Math.round(t * 100)}
            onChange={(e) => setT(Number(e.target.value) / 100)}
            className="flex-1" style={{ accentColor: '#818cf8' }} />
          <span className="text-[11px] font-black tabular-nums" style={{ color: '#c4b5fd' }}>{Math.round(t * 100)}%</span>
        </div>
      </div>

      <div className="flex flex-col py-1 gap-5">
        <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>What&rsquo;s Happening</h2>
        <div className="space-y-5 flex-grow">
          {sidebar.map(({ id, title, body }) => (
            <div key={id} style={{
              transition: 'all 0.3s ease',
              opacity: stage === id ? 1 : 0.35,
              transform: stage === id ? 'translateX(4px)' : 'none',
            }}>
              <h4 className="font-black text-[13px] uppercase tracking-widest mb-1"
                style={{ color: stage === id ? '#818cf8' : '#94a3b8' }}>{title}</h4>
              <p className="text-base leading-snug" style={{ color: '#94a3b8' }}>{body}</p>
            </div>
          ))}
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h5 className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</h5>
          <p className="text-white text-base font-bold leading-tight italic">
            &ldquo;Bulky groups (3° carbons) block the back face — that&rsquo;s why SN2 prefers methyl and 1° substrates.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3 — SN2 STEREO (concrete (R)-2-bromobutane → (S)-2-butanol)
// ─────────────────────────────────────────────────────────────────────────────

function StereoCenterSVG({ config, leaving, x = 200, y = 300, label }: {
  config: 'R' | 'S'; leaving?: 'Br' | 'OH'; x?: number; y?: number; label: string;
}) {
  // Tetrahedral carbon shown with two in-plane bonds (CH3 left, CH2CH3 right),
  // a wedge bond (toward viewer) and a dash bond (away from viewer).
  // For (R)-2-bromobutane: priorities Br(1) > CH2CH3 (2) > CH3 (3) > H (4) — but
  // CH2CH3 vs CH3 priorities are obvious from CIP. We draw H on the dash and
  // either Br or OH on the wedge. To convert (R) ↔ (S), we swap the wedge group's
  // position with H (i.e., flip front/back). For simplicity we depict R with the
  // halogen on the wedge (front) and H on the dash; S flips them.
  const onWedge = config === 'R';
  const lg = leaving ?? 'Br';
  const lgColor = lg === 'Br' ? '#d64545' : '#10b981';
  const lgStroke = lg === 'Br' ? '#991b1b' : '#065f46';

  return (
    <g>
      {/* CH3 - left (in plane) */}
      <line x1={x - 75} y1={y} x2={x - 24} y2={y} className="sn-bond" />
      <circle cx={x - 95} cy={y} r={18} fill="#2d3a5a" stroke="#6366f1" strokeWidth={2.5} />
      <text x={x - 95} y={y} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={11}>CH₃</text>

      {/* C2H5 - right (in plane) */}
      <line x1={x + 24} y1={y} x2={x + 75} y2={y} className="sn-bond" />
      <circle cx={x + 100} cy={y} r={20} fill="#2d3a5a" stroke="#6366f1" strokeWidth={2.5} />
      <text x={x + 100} y={y} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={11}>C₂H₅</text>

      {/* Wedge bond (front) */}
      <polygon points={`${x},${y - 8} ${x},${y + 8} ${x + (onWedge ? 0 : 0)},${y - (onWedge ? 65 : -65)} ${x - (onWedge ? 14 : -14)},${y - (onWedge ? 60 : -60)}`}
        fill="#e2e8f0" />
      {/* Dash bond (back) */}
      {[1, 2, 3, 4, 5].map((i) => (
        <line key={i}
          x1={x - 4 + i * 1.2} y1={y + (onWedge ? 8 + i * 9 : -8 - i * 9)}
          x2={x + 4 + i * 1.2} y2={y + (onWedge ? 8 + i * 9 : -8 - i * 9)}
          stroke="#94a3b8" strokeWidth={2.5} />
      ))}

      {/* Wedge atom (front group) */}
      <circle cx={x} cy={y - 78} r={20}
        fill={onWedge ? lgColor : '#0a2218'}
        stroke={onWedge ? lgStroke : '#34d399'} strokeWidth={2.5} />
      <text x={x} y={y - 78} textAnchor="middle" dominantBaseline="middle"
        className="sn-text" fontSize={11}>{onWedge ? lg : 'H'}</text>

      {/* Dash atom (back group) */}
      <circle cx={x} cy={y + 78} r={20}
        fill={onWedge ? '#0a2218' : lgColor}
        stroke={onWedge ? '#34d399' : lgStroke} strokeWidth={2.5} />
      <text x={x} y={y + 78} textAnchor="middle" dominantBaseline="middle"
        className="sn-text" fontSize={11}>{onWedge ? 'H' : lg}</text>

      {/* Central C */}
      <circle cx={x} cy={y} r={20} className="sn-atom-c" />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={13}>C</text>

      {/* Caption */}
      <text x={x} y={y + 140} textAnchor="middle" className="sn-text" fontSize={14}>{label}</text>
      <text x={x} y={y + 162} textAnchor="middle" className="sn-text-muted" fontSize={11}>
        {config === 'R' ? '(R) — clockwise priorities' : '(S) — counter-clockwise'}
      </text>
    </g>
  );
}

function SN2StereoPhase() {
  const [showPriorities, setShowPriorities] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>Walden Inversion</p>
        <p className="text-white font-bold text-lg leading-snug">
          A single chiral starting material gives a single chiral product —{' '}
          <span style={{ color: '#fbbf24' }}>but with the opposite configuration</span>.
          (R) becomes (S) (and vice versa) when the priorities don&rsquo;t change rank.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl"
        style={{ minHeight: 420,
          background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
          border: '1px solid rgba(52,211,153,0.2)' }}>
        <svg viewBox="0 0 800 500" width="100%" height="100%">
          <StereoCenterSVG config="R" leaving="Br" x={180} y={230} label="(R)-2-bromobutane" />

          {/* Reaction arrow */}
          <line x1={340} y1={230} x2={460} y2={230} stroke="#94a3b8" strokeWidth={2.5} markerEnd="url(#arrEnd)" />
          <text x={400} y={210} textAnchor="middle" className="sn-text" fontSize={12} fill="#94a3b8">OH⁻ (SN2)</text>
          <text x={400} y={252} textAnchor="middle" className="sn-text-muted" fontSize={11}>polar aprotic</text>

          <StereoCenterSVG config="S" leaving="OH" x={620} y={230} label="(S)-butan-2-ol" />

          {showPriorities && (
            <>
              <text x={180} y={70} textAnchor="middle" className="sn-text" fontSize={11} fill="#fbbf24">CIP: Br(1) &gt; C₂H₅(2) &gt; CH₃(3) &gt; H(4)</text>
              <text x={620} y={70} textAnchor="middle" className="sn-text" fontSize={11} fill="#fbbf24">CIP: OH(1) &gt; C₂H₅(2) &gt; CH₃(3) &gt; H(4)</text>
            </>
          )}

          <defs>
            <marker id="arrEnd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setShowPriorities((v) => !v)}
          className="self-start text-xs font-semibold transition-colors pb-0.5"
          style={{
            color: showPriorities ? '#fbbf24' : '#475569',
            borderBottom: `1px solid ${showPriorities ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`,
            background: 'none', outline: 'none',
          }}>
          {showPriorities ? '✓ CIP priorities shown' : 'Show CIP priorities'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>Why R Becomes S</p>
          <p className="text-base leading-snug" style={{ color: '#94a3b8' }}>
            The three other groups stayed put — only the Br/OH swap happened, and the
            new bond formed on the opposite face. Looking down the C—H axis, the
            priorities now trace the reverse direction. Same atoms, mirrored 3D
            arrangement. The product rotates plane-polarised light in the opposite
            direction from the starting material.
          </p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>Watch Out</p>
          <p className="text-base leading-snug" style={{ color: '#94a3b8' }}>
            The R/S label can stay the same in rare cases — if the leaving group and
            the nucleophile have <em>different</em> CIP ranks relative to the other
            substituents, the priority order can shift. The 3D inversion always
            happens; only the label might lie. Trust the geometry, not the letter.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4 — SN1 MECHANISM (ionization → planar carbocation → attack)
// ─────────────────────────────────────────────────────────────────────────────

function SN1MechCanvas({ t }: { t: number }) {
  // Two stages:
  //   0   → 0.5  : C—Br ionizes (slow). Carbon transitions sp³ → sp² (tetrahedral → planar).
  //   0.55→ 1   : Nu attacks one face (fast).
  // At t=0 the substrate is shown with proper tetrahedral wedge/dash geometry and Br on right.
  // As `flat` goes 0→1, each substituent lerps from its tetrahedral position to its planar
  // (120°-apart, in-plane) position; wedge/dash bonds fade to plain bonds.
  const cx = 400, cy = 300;

  const xBr = cx + 90 + t * 200;
  const brOpacity = t < 0.5 ? 1 - t * 0.5 : Math.max(0, 0.5 - (t - 0.5) * 1.2);

  // sp³ → sp² parameter
  const flat = Math.min(1, Math.max(0, (t - 0.1) / 0.4));

  // Substrate is a tertiary carbon: C(CH₃)(CH₃)(C₂H₅)Br
  // Tetrahedral positions (with Br on +x): three groups occupy x ≈ -tetraX
  //   a (top, plain): vx=0, vy=-70
  //   b (lower-left, wedge):  vx=-22, vy=36
  //   c (lower-right, dash):  vx=22,  vy=36
  // Planar (sp²) positions: 90° / 210° / 330° at radius 88
  const groups = [
    { name: 'C₂H₅',
      tx:   0, ty: -70,
      px:   0, py: -88,
      kind: 'plain' as const,
    },
    { name: 'CH₃',
      tx: -22, ty: 36,
      px: -76, py: 44,
      kind: 'wedge' as const,
    },
    { name: 'CH₃',
      tx:  22, ty: 36,
      px:  76, py: 44,
      kind: 'dash' as const,
    },
  ];

  // Substrate has umbrella tilted to -tetraX (Nu side, where Br isn't). At t=0 the C
  // looks tetrahedral; as Br leaves and C goes sp², the umbrella spreads into the plane.
  const tetraX = 26;
  const tetraTilt = -1 * (1 - flat);   // -1 at t=0, 0 at flat planar

  const nuY = 80 + Math.max(0, t - 0.55) * 320;
  const nuOpacity = t < 0.55 ? 0.3 : Math.min(1, (t - 0.55) * 3);
  const catVis = t > 0.4 && t < 0.85
    ? Math.min(1, (t - 0.4) * 5) * (1 - Math.max(0, (t - 0.75) * 4))
    : 0;

  return (
    <svg viewBox="0 0 800 600" width="100%" height="100%">
      {/* Plane indicator (visible once carbon is planar) */}
      {flat > 0.5 && (
        <ellipse cx={cx} cy={cy} rx={130} ry={18}
          fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth={1.5} strokeDasharray="6 6"
          style={{ opacity: flat }} />
      )}

      {/* Three R-groups: lerp from tetrahedral to planar */}
      {groups.map((g, idx) => {
        // Interpolate position: tetrahedral (with x-tilt) → planar
        const tetraXOffset = tetraTilt * tetraX;
        const startX = cx + g.tx + tetraXOffset;
        const startY = cy + g.ty;
        const endX = cx + g.px;
        const endY = cy + g.py;
        const x = startX + (endX - startX) * flat;
        const y = startY + (endY - startY) * flat;

        const dx = x - cx, dy = y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const bx1 = cx + ux * 24, by1 = cy + uy * 24;
        const bx2 = x  - ux * 20, by2 = y  - uy * 20;

        // Wedge/dash visible while tetrahedral; plain bond takes over once planar
        const specialOp = 1 - flat;
        const plainOp   = flat;

        return (
          <g key={idx}>
            {/* Plain bond — fades in as carbon flattens */}
            {(g.kind === 'plain' || plainOp > 0.05) && (
              <line x1={bx1} y1={by1} x2={bx2} y2={by2}
                className="sn-bond"
                style={{ opacity: g.kind === 'plain' ? 1 : plainOp }} />
            )}
            {/* Wedge — fades out as carbon flattens */}
            {g.kind === 'wedge' && specialOp > 0.05 && (
              <polygon points={wedgePoints(bx1, by1, bx2, by2, 14)}
                fill="rgba(99,102,241,0.65)" stroke="rgba(99,102,241,0.85)" strokeWidth={1}
                style={{ opacity: specialOp }} />
            )}
            {/* Dash — fades out as carbon flattens */}
            {g.kind === 'dash' && specialOp > 0.05 && (
              <line x1={bx1} y1={by1} x2={bx2} y2={by2}
                stroke="rgba(99,102,241,0.55)" strokeWidth={5} strokeLinecap="round"
                strokeDasharray="3 5"
                style={{ opacity: specialOp }} />
            )}
            <circle cx={x} cy={y} r={20} fill="#2d3a5a" stroke="#6366f1" strokeWidth={2.5} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              className="sn-text" fontSize={11}>{g.name}</text>
          </g>
        );
      })}

      {/* C—Br bond (breaking) */}
      <line x1={cx + 22} y1={cy} x2={xBr - 22} y2={cy}
        className={t < 0.4 ? 'sn-bond' : 'sn-bond-faint'}
        style={{ opacity: Math.max(0.1, 1 - t * 1.6) }} />

      {/* Br */}
      <g style={{ opacity: brOpacity }}>
        <Atom x={xBr} y={cy} r={22} cls="sn-atom-x" label="Br⁻" />
      </g>

      {/* Central carbon */}
      <g>
        <circle cx={cx} cy={cy} r={24} className="sn-atom-c"
          style={{ filter: catVis > 0 ? 'drop-shadow(0 0 12px rgba(251,191,36,0.6))' : 'none' }} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={13}>C</text>
        {catVis > 0 && (
          <text x={cx + 26} y={cy - 22} className="sn-text" fontSize={20} fill="#fbbf24"
            style={{ opacity: catVis }}>+</text>
        )}
      </g>

      {/* Nu (incoming) — only after carbocation forms */}
      <g style={{ opacity: nuOpacity }}>
        <Atom x={cx} y={nuY} r={22} cls="sn-atom-nu" label="OH⁻" />
        {t > 0.55 && t < 0.95 && (
          <path d={`M ${cx + 30} ${nuY + 20} Q ${cx + 60} ${(nuY + cy) / 2} ${cx + 26} ${cy - 18}`}
            className="sn-attack" markerEnd="url(#arrowAmber2)" />
        )}
      </g>

      {/* Stage label */}
      <text x={cx} y={560} textAnchor="middle" className="sn-text" fontSize={13}>
        {t < 0.15 ? 'Substrate — sp³ tetrahedral carbon, C—Br intact'
          : t < 0.4 ? 'Step 1 (slow) — C—Br heterolytically breaks'
          : t < 0.55 ? 'Carbocation — planar, sp² hybridized, achiral'
          : t < 0.85 ? 'Step 2 (fast) — Nu attacks one face'
          : 'Product formed'}
      </text>

      <defs>
        <marker id="arrowAmber2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
        </marker>
      </defs>
    </svg>
  );
}

function SN1MechPhase() {
  const [t, setT] = useState(0);
  const stage = t < 0.4 ? 'ionize' : t < 0.55 ? 'cation' : 'attack';

  const sidebar = [
    { id: 'ionize', title: '1 · Ionization (slow)',
      body: 'The C—Br bond breaks heterolytically — both electrons stay with bromide. Polar protic solvents (water, ethanol) stabilize the developing charges. This step sets the rate.' },
    { id: 'cation', title: '2 · Planar Carbocation',
      body: 'The carbon is now sp² hybridized with an empty p-orbital. All three remaining groups sit in one plane, 120° apart. The intermediate is achiral — both faces look identical to an incoming nucleophile.' },
    { id: 'attack', title: '3 · Nucleophile Attack (fast)',
      body: 'The nucleophile fills the empty p-orbital. Because it can come from above or below the plane with equal probability, the original 3D information is lost.' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>The Rule</p>
          <p className="text-white font-bold text-lg leading-snug">
            SN1 first <span style={{ color: '#fbbf24' }}>discards</span> the leaving group to form a
            flat carbocation. Only after that does the nucleophile arrive — and by then,
            the carbon has forgotten which side was which.
          </p>
        </div>

        <div className="relative overflow-hidden flex items-center justify-center rounded-3xl"
          style={{ minHeight: 420,
            background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
            border: '1px solid rgba(251,191,36,0.2)' }}>
          <SN1MechCanvas t={t} />
        </div>

        <div className="flex items-center gap-4 pt-1">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#475569' }}>Reaction progress</span>
          <input type="range" min={0} max={100} value={Math.round(t * 100)}
            onChange={(e) => setT(Number(e.target.value) / 100)}
            className="flex-1" style={{ accentColor: '#fbbf24' }} />
          <span className="text-[11px] font-black tabular-nums" style={{ color: '#fcd34d' }}>{Math.round(t * 100)}%</span>
        </div>
      </div>

      <div className="flex flex-col py-1 gap-5">
        <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>Two Steps, One Story</h2>
        <div className="space-y-5 flex-grow">
          {sidebar.map(({ id, title, body }) => (
            <div key={id} style={{
              transition: 'all 0.3s ease',
              opacity: stage === id ? 1 : 0.35,
              transform: stage === id ? 'translateX(4px)' : 'none',
            }}>
              <h4 className="font-black text-[13px] uppercase tracking-widest mb-1"
                style={{ color: stage === id ? '#fbbf24' : '#94a3b8' }}>{title}</h4>
              <p className="text-base leading-snug" style={{ color: '#94a3b8' }}>{body}</p>
            </div>
          ))}
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h5 className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</h5>
          <p className="text-white text-base font-bold leading-tight italic">
            &ldquo;The slow step doesn&rsquo;t involve the nucleophile at all — that&rsquo;s why SN1 rate ignores [Nu⁻].&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5 — SN1 RACEMIZATION (top vs bottom face attack → 50:50)
// ─────────────────────────────────────────────────────────────────────────────

function SN1StereoPhase() {
  const [face, setFace] = useState<'top' | 'bottom' | null>(null);

  // The flat carbocation (centre) shows two attack arrows. Selecting one shows
  // which product it gives. Both together show the 50:50 racemic outcome.
  const cx = 400, cy = 300;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#f472b6' }}>Racemization</p>
        <p className="text-white font-bold text-lg leading-snug">
          The planar carbocation is <span style={{ color: '#fbbf24' }}>achiral</span>.
          Top-face and bottom-face attack are equally likely, so a chiral starting
          material gives a 50:50 mix of (R) and (S) products — optically inactive.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setFace('top')}
          className="px-3 py-2 text-center transition-all"
          style={{
            borderBottom: `2px solid ${face === 'top' ? '#34d399' : 'rgba(255,255,255,0.06)'}`,
            opacity: face === 'top' ? 1 : 0.55, background: 'none', outline: 'none',
          }}>
          <div className="text-xs font-black" style={{ color: '#34d399' }}>Top-face attack</div>
          <div className="text-[10px]" style={{ color: '#475569' }}>gives one enantiomer</div>
        </button>
        <button onClick={() => setFace('bottom')}
          className="px-3 py-2 text-center transition-all"
          style={{
            borderBottom: `2px solid ${face === 'bottom' ? '#f472b6' : 'rgba(255,255,255,0.06)'}`,
            opacity: face === 'bottom' ? 1 : 0.55, background: 'none', outline: 'none',
          }}>
          <div className="text-xs font-black" style={{ color: '#f472b6' }}>Bottom-face attack</div>
          <div className="text-[10px]" style={{ color: '#475569' }}>gives the mirror image</div>
        </button>
        <button onClick={() => setFace(null)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>
          ↺ Show both
        </button>
      </div>

      <div className="relative overflow-hidden rounded-3xl"
        style={{ minHeight: 460,
          background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
          border: '1px solid rgba(244,114,182,0.2)' }}>
        <svg viewBox="0 0 800 500" width="100%" height="100%">
          {/* Plane through carbocation */}
          <ellipse cx={cx} cy={cy} rx={150} ry={20}
            fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth={1.5} strokeDasharray="6 6" />

          {/* Three substituents around C+ (sp²) */}
          {[
            { a: 210, label: 'CH₃' },
            { a: 330, label: 'CH₃' },
            { a:  90, label: 'C₂H₅' },
          ].map((g, i) => {
            const rad = (g.a * Math.PI) / 180;
            const gx = cx + Math.cos(rad) * 95;
            const gy = cy + Math.sin(rad) * 95;
            return (
              <g key={i}>
                <line x1={cx} y1={cy} x2={gx} y2={gy} className="sn-bond" />
                <circle cx={gx} cy={gy} r={20} fill="#2d3a5a" stroke="#6366f1" strokeWidth={2.5} />
                <text x={gx} y={gy} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={11}>{g.label}</text>
              </g>
            );
          })}

          {/* Carbocation centre */}
          <circle cx={cx} cy={cy} r={24} className="sn-atom-c"
            style={{ filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.6))' }} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={13}>C</text>
          <text x={cx + 26} y={cy - 22} className="sn-text" fontSize={20} fill="#fbbf24">+</text>

          {/* Top-face attack */}
          {(face === null || face === 'top') && (
            <g style={{ opacity: face === 'top' ? 1 : 0.65 }}>
              <circle cx={cx - 140} cy={120} r={20} className="sn-atom-nu" />
              <text x={cx - 140} y={120} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={11}>OH⁻</text>
              <path d={`M ${cx - 120} ${135} Q ${cx - 60} ${200} ${cx - 14} ${cy - 18}`}
                className="sn-attack" markerEnd="url(#arrTop)" />
              <text x={cx - 200} y={100} className="sn-text" fontSize={12} fill="#34d399">attack from top</text>
            </g>
          )}

          {/* Bottom-face attack */}
          {(face === null || face === 'bottom') && (
            <g style={{ opacity: face === 'bottom' ? 1 : 0.65 }}>
              <circle cx={cx + 140} cy={480} r={20} className="sn-atom-nu" />
              <text x={cx + 140} y={480} textAnchor="middle" dominantBaseline="middle" className="sn-text" fontSize={11}>OH⁻</text>
              <path d={`M ${cx + 120} ${465} Q ${cx + 60} ${400} ${cx + 14} ${cy + 18}`}
                className="sn-attack" markerEnd="url(#arrBot)" />
              <text x={cx + 200} y={490} className="sn-text" fontSize={12} fill="#f472b6">attack from bottom</text>
            </g>
          )}

          <defs>
            <marker id="arrTop" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
            </marker>
            <marker id="arrBot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ border: '1px solid rgba(52,211,153,0.25)', background: 'rgba(16,185,129,0.05)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#34d399' }}>Top attack</p>
          <p className="text-base font-bold leading-snug text-white">(R)-product</p>
          <p className="text-sm leading-snug mt-1" style={{ color: '#94a3b8' }}>Nu sits on the front face — same arrangement as starting material.</p>
        </div>
        <div className="rounded-xl p-4" style={{ border: '1px solid rgba(244,114,182,0.25)', background: 'rgba(244,114,182,0.05)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#f472b6' }}>Bottom attack</p>
          <p className="text-base font-bold leading-snug text-white">(S)-product</p>
          <p className="text-sm leading-snug mt-1" style={{ color: '#94a3b8' }}>Nu sits on the back face — mirror image of the top-attack product.</p>
        </div>
        <div className="rounded-xl p-4" style={{ border: '1px solid rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.05)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#fbbf24' }}>Net outcome</p>
          <p className="text-base font-bold leading-snug text-white">50 : 50 racemic mix</p>
          <p className="text-sm leading-snug mt-1" style={{ color: '#94a3b8' }}>Equal R and S means the product solution is optically inactive.</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SN1SN2Simulator() {
  const [phase, setPhase] = useState<Phase>('sn2-mech');
  const currentIndex = STEPS.findIndex((s) => s.id === phase);
  const next = STEPS[Math.min(currentIndex + 1, STEPS.length - 1)];
  const prev = STEPS[Math.max(currentIndex - 1, 0)];

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', minHeight: '80vh' }}>
      <style>{SIM_CSS}</style>

      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Stereochemistry <span style={{ color: '#7c3aed' }}>Lab</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            SN1 vs SN2 — How the Mechanism Decides Handedness
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          Class 12 · Haloalkanes &amp; Haloarenes
        </div>
      </div>

      {/* StepBar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {STEPS.map((s, i) => {
          const active = s.id === phase;
          const done = i < currentIndex;
          return (
            <button key={s.id}
              onClick={() => (done || active) && setPhase(s.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(129,140,248,0.15)' : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.25)',
                cursor: done || active ? 'pointer' : 'default',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: active ? '#6366f1' : done ? '#059669' : 'rgba(255,255,255,0.06)', color: 'white' }}>
                {done ? '✓' : i + 1}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Phase content */}
      <div className="mb-6">
        {phase === 'sn2-mech'   && <SN2MechPhase />}
        {phase === 'sn2-stereo' && <SN2StereoPhase />}
        {phase === 'sn1-mech'   && <SN1MechPhase />}
        {phase === 'sn1-stereo' && <SN1StereoPhase />}
      </div>

      {/* Back / Next */}
      <div className="flex justify-between items-center pt-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => setPhase(prev.id)}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            opacity: currentIndex === 0 ? 0.4 : 1,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
          }}>
          ← Back
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: PHASE_ACCENT[phase] }}>
          Phase {currentIndex + 1} of {STEPS.length}
        </span>
        <button onClick={() => setPhase(next.id)}
          disabled={currentIndex === STEPS.length - 1}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(99,102,241,0.18)',
            border: '1px solid rgba(129,140,248,0.4)',
            color: '#c4b5fd',
            opacity: currentIndex === STEPS.length - 1 ? 0.4 : 1,
            cursor: currentIndex === STEPS.length - 1 ? 'not-allowed' : 'pointer',
          }}>
          Next: {next.label} →
        </button>
      </div>
    </div>
  );
}
