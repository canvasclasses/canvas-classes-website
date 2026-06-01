'use client';

/**
 * Chromatography Simulator — Column & Paper Chromatography
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 12, Section 12.8.5 — Chromatography
 * Column: differential adsorption on silica gel stationary phase
 * Paper: differential partition; solvent rises by capillary action
 * Rf values (leaf pigments on silica/petroleum ether): β-carotene ~0.92,
 *   xanthophyll ~0.56, chlorophyll a ~0.22 — standard reference values
 */

import { useState, useRef } from 'react';
import { useAnimationFrame } from './_shared';
import { Frac } from './_typography';

type Mode = 'column' | 'paper';

/* ── Data ──────────────────────────────────────────────────────────────── */

const COLUMN_COMPOUNDS = [
  {
    id: 'carotene',
    name: 'β-Carotene',
    color: '#fbbf24',
    rf: 0.92,
    adsorption: 'Low',
    note: 'Non-polar — barely attracted to silica. Moves fastest, elutes first.',
  },
  {
    id: 'xantho',
    name: 'Xanthophyll',
    color: '#34d399',
    rf: 0.56,
    adsorption: 'Medium',
    note: 'Moderately polar — medium silica interaction. Elutes second.',
  },
  {
    id: 'chloro',
    name: 'Chlorophyll a',
    color: '#818cf8',
    rf: 0.22,
    adsorption: 'High',
    note: 'Most polar — strong affinity for silica. Moves slowest, elutes last.',
  },
] as const;

const PAPER_COMPOUNDS = [
  { id: 'yellow', name: 'Yellow pigment', color: '#fbbf24', rf: 0.82 },
  { id: 'red',    name: 'Red pigment',    color: '#f87171', rf: 0.51 },
  { id: 'blue',   name: 'Blue pigment',   color: '#818cf8', rf: 0.20 },
] as const;

/* ── SVG layout constants ──────────────────────────────────────────────── */

const W = 560;
const H = 490;

// Column
const CCX = 200;      // column centre x
const COW = 84;       // outer width
const CWL = 6;        // wall thickness
const CIW = COW - 2 * CWL;  // inner width = 72
const CL  = CCX - COW / 2;  // left outer = 158
const CR  = CCX + COW / 2;  // right outer = 242
const CLI = CL + CWL;        // left inner = 164
const CRI = CR - CWL;        // right inner = 236
const CT  = 78;
const CB  = 420;
const CH  = CB - CT;         // = 342

// Paper
const PCX  = 160;
const PW   = 58;
const PL   = PCX - PW / 2;  // = 131
const PR   = PCX + PW / 2;  // = 189
const PT   = 58;
const PB   = 428;
const OY   = 392;    // origin line y

const BAND_H = 14;
const MAX_RF  = 0.92;

/* ── Helpers ───────────────────────────────────────────────────────────── */

function colBandY(rf: number, p: number): number {
  return CT + 10 + (rf / MAX_RF) * p * (CH - 10);
}

function papSpotY(rf: number, p: number): number {
  return OY - (OY - PT - 18) * rf * p;
}

function papFrontY(p: number): number {
  return OY - (OY - PT - 18) * p;
}

/* ── CSS animations ────────────────────────────────────────────────────── */

const CSS = `
  @keyframes chro-drip {
    0%   { opacity:0; transform:translateY(0px); }
    25%  { opacity:0.85; }
    100% { opacity:0; transform:translateY(13px); }
  }
  .chro-drip { animation: chro-drip 1.1s ease-in infinite; }
`;

/* ── Column SVG ────────────────────────────────────────────────────────── */
/*
 * Visual reference: standard laboratory column chromatography apparatus —
 * borosilicate glass column with ground-glass joint at the top, straight
 * cylindrical body, tapered conical bottom converging onto a Teflon stopcock
 * with horizontal handle, narrow drip tip, and a beaker for fraction
 * collection. Stationary phase (silica) is supported on a glass wool plug
 * inside the cone; a thin sand layer protects the silica surface on top.
 * (NCERT Class 12 Chemistry, §12.8.5 — apparatus diagram.)
 */

// Geometric constants for the new realistic column shape — all derived from
// the existing CT/CB/CCX so the band-position math (colBandY) is unchanged.
const TAPER_START = CB - 28;            // y where straight body begins to cone in
const NECK_HALF   = 12;                 // half-width of the cone outlet (above stopcock)
const STOP_Y      = CB + 3;             // top of stopcock body
const STOP_H      = 12;                 // stopcock body height
const STOP_HALF_W = 18;                 // half-width of stopcock barrel
const HANDLE_W    = 70;                 // horizontal Teflon handle width
const HANDLE_H    = 8;                  // handle thickness
const TIP_TOP     = STOP_Y + STOP_H;
const TIP_BOT     = TIP_TOP + 10;
const BEAKER_TOP  = TIP_BOT + 4;
const BEAKER_BOT  = BEAKER_TOP + 32;
const BEAKER_HALF = 38;

// Sand layer on top of silica (rests at the very top of the column body)
const SAND_Y      = CT;
const SAND_H      = 7;

// Glass wool plug — sits at the bottom of the silica, just inside the cone,
// where it physically supports the silica column in real life.
const WOOL_Y      = TAPER_START - 4;
const WOOL_H      = 5;

// Solvent reservoir level (above the silica, inside the flared top)
const SOLV_TOP    = 50;
const SOLV_BOT    = CT - 1;

// Column shape — straight body that tapers into a cone above the stopcock.
// Used as both the clip path for inner content and to draw the glass outline.
const COL_INNER_PATH =
  `M ${CLI} ${CT} ` +
  `L ${CRI} ${CT} ` +
  `L ${CRI} ${TAPER_START} ` +
  `L ${CCX + NECK_HALF} ${CB} ` +
  `L ${CCX - NECK_HALF} ${CB} ` +
  `L ${CLI} ${TAPER_START} Z`;

const COL_OUTER_PATH =
  `M ${CL} ${CT} ` +
  `L ${CR} ${CT} ` +
  `L ${CR} ${TAPER_START} ` +
  `L ${CCX + NECK_HALF + CWL - 1} ${CB + 1} ` +
  `L ${CCX - NECK_HALF - CWL + 1} ${CB + 1} ` +
  `L ${CL} ${TAPER_START} Z`;

function ColumnSVG({ p, running }: { p: number; running: boolean }) {
  const exited = colBandY(MAX_RF, p) >= CB - BAND_H / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cc-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#1e204a" />
          <stop offset="100%" stopColor="#050614" />
        </radialGradient>

        {/* Glass cylinder gradient — bright highlight on the left edge, mid-tone
            transparent in the middle, soft reflective shadow on the right.
            Read together they give the column a curved, 3D appearance. */}
        <linearGradient id="cc-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(226,240,255,0.55)" />
          <stop offset="20%"  stopColor="rgba(180,210,240,0.10)" />
          <stop offset="55%"  stopColor="rgba(150,190,225,0.05)" />
          <stop offset="85%"  stopColor="rgba(120,170,210,0.12)" />
          <stop offset="100%" stopColor="rgba(80,130,180,0.32)" />
        </linearGradient>

        {/* Silica gel packing — granular dot pattern over a cool dark base */}
        <pattern id="cc-silica" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#161c2c" />
          <circle cx="1.5" cy="2"   r="0.9" fill="rgba(203,213,225,0.20)" />
          <circle cx="4"   cy="4.5" r="0.7" fill="rgba(148,163,184,0.16)" />
        </pattern>

        {/* Top sand layer — warm amber tint to read as "sand" against the silica */}
        <pattern id="cc-sand" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="rgba(180,83,9,0.55)" />
          <circle cx="1" cy="1" r="0.6" fill="rgba(251,191,36,0.7)" />
          <circle cx="3" cy="3" r="0.5" fill="rgba(217,119,6,0.55)" />
        </pattern>

        {/* Glass wool plug — fluffy white/cream texture */}
        <pattern id="cc-wool" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="rgba(226,232,240,0.20)" />
          <circle cx="1.5" cy="2"   r="1.1" fill="rgba(248,250,252,0.55)" />
          <circle cx="4"   cy="3.5" r="0.9" fill="rgba(226,232,240,0.45)" />
        </pattern>

        {/* Mobile-phase solvent — pale blue gradient */}
        <linearGradient id="cc-solvent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(56,189,248,0.28)" />
          <stop offset="100%" stopColor="rgba(56,189,248,0.14)" />
        </linearGradient>

        {/* Clip everything that's "inside the column" to the column shape so
            bands, silica, wool naturally taper inside the cone region. */}
        <clipPath id="col-clip">
          <path d={COL_INNER_PATH} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="url(#cc-bg)" />

      {/* ════════════════════ INSIDE THE COLUMN ════════════════════ */}

      {/* Silica gel — fills the entire column shape */}
      <path d={COL_INNER_PATH} fill="#0f1320" />
      <path d={COL_INNER_PATH} fill="url(#cc-silica)" />

      {/* Sand layer on top of silica */}
      <rect x={CLI} y={SAND_Y} width={CIW} height={SAND_H} fill="url(#cc-sand)"
        clipPath="url(#col-clip)" />

      {/* Glass wool plug at the bottom of the silica (inside the cone) */}
      <rect x={CLI - 4} y={WOOL_Y} width={CIW + 8} height={WOOL_H} fill="url(#cc-wool)"
        clipPath="url(#col-clip)" />

      {/* Liquid solvent above the silica, inside the flared top */}
      <rect x={CLI} y={SOLV_TOP} width={CIW} height={SOLV_BOT - SOLV_TOP}
        fill="url(#cc-solvent)" />
      {/* Meniscus — slight upward curve at the solvent's surface, then a
          single highlight line along the top to read as a water/oil surface */}
      <path d={`M ${CLI} ${SOLV_TOP + 1} Q ${CCX} ${SOLV_TOP - 3} ${CRI} ${SOLV_TOP + 1}`}
        fill="none" stroke="rgba(125,211,252,0.55)" strokeWidth={1} />

      {/* ════════════════════ BANDS (clipped to column shape) ════════════════════ */}
      <g clipPath="url(#col-clip)">
        {COLUMN_COMPOUNDS.map(c => {
          const cy = colBandY(c.rf, p);
          if (cy >= CB) return null;
          return (
            <g key={c.id}>
              {/* main band */}
              <rect x={CLI - 4} y={cy - BAND_H / 2}
                width={CIW + 8} height={BAND_H}
                fill={c.color} opacity={0.78} />
              {/* soft top/bottom diffusion to suggest a real concentration gradient */}
              <rect x={CLI - 4} y={cy - BAND_H / 2 - 3}
                width={CIW + 8} height={3}
                fill={c.color} opacity={0.22} />
              <rect x={CLI - 4} y={cy + BAND_H / 2}
                width={CIW + 8} height={3}
                fill={c.color} opacity={0.22} />
            </g>
          );
        })}
      </g>

      {/* ════════════════════ GLASS ENVELOPE ════════════════════ */}

      {/* Ground-glass joint at the top — wider than the column body with a
          frosted look. This is where the solvent funnel sits in a real setup. */}
      <path d={`M ${CL - 14} 64
                Q ${CL - 14} 56 ${CL - 6} 56
                L ${CR + 6} 56
                Q ${CR + 14} 56 ${CR + 14} 64
                L ${CR + 4} 76
                L ${CL - 4} 76 Z`}
        fill="rgba(220,232,245,0.22)" stroke="rgba(186,214,236,0.55)" strokeWidth={1.2}
        strokeLinejoin="round" />
      {/* Frost texture on the joint */}
      <path d={`M ${CL - 11} 62 L ${CR + 11} 62 M ${CL - 12} 67 L ${CR + 12} 67 M ${CL - 11} 72 L ${CR + 11} 72`}
        stroke="rgba(255,255,255,0.10)" strokeWidth={0.7} />

      {/* Column glass outline — straight body that tapers into the cone.
          Stroked with the glass gradient for a curved 3D look. */}
      <path d={COL_OUTER_PATH} fill="url(#cc-glass)" opacity={0.4} />
      <path d={COL_OUTER_PATH} fill="none" stroke="rgba(186,214,236,0.55)"
        strokeWidth={1.1} strokeLinejoin="round" />

      {/* Left gloss highlight — reads as a curved cylindrical surface */}
      <line x1={CL + 2.5} y1={CT + 6} x2={CL + 2.5} y2={TAPER_START - 4}
        stroke="rgba(255,255,255,0.35)" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={CL + 5}   y1={CT + 10} x2={CL + 5}   y2={TAPER_START - 8}
        stroke="rgba(255,255,255,0.12)" strokeWidth={0.7} strokeLinecap="round" />

      {/* Right shadow line — completes the cylinder illusion */}
      <line x1={CR - 2.5} y1={CT + 6} x2={CR - 2.5} y2={TAPER_START - 4}
        stroke="rgba(15,23,42,0.45)" strokeWidth={1.2} strokeLinecap="round" />

      {/* ════════════════════ STOPCOCK ════════════════════ */}

      {/* Stopcock body (dark metal/PTFE shell) */}
      <rect x={CCX - STOP_HALF_W} y={STOP_Y} width={STOP_HALF_W * 2} height={STOP_H} rx={3}
        fill="#1f2937" stroke="rgba(148,163,184,0.5)" strokeWidth={0.9} />
      {/* Horizontal Teflon handle — the rotating control */}
      <rect x={CCX - HANDLE_W / 2} y={STOP_Y + STOP_H / 2 - HANDLE_H / 2}
        width={HANDLE_W} height={HANDLE_H} rx={5}
        fill="#475569" stroke="rgba(148,163,184,0.6)" strokeWidth={0.8} />
      <rect x={CCX - HANDLE_W / 2 + 2} y={STOP_Y + STOP_H / 2 - HANDLE_H / 2 + 1.5}
        width={HANDLE_W - 4} height={2} rx={1}
        fill="rgba(255,255,255,0.18)" />
      {/* Central pivot — the rotating plug; lights up amber when eluting */}
      <circle cx={CCX} cy={STOP_Y + STOP_H / 2} r={4}
        fill={exited && running ? '#fbbf24' : '#0b1220'}
        stroke="rgba(203,213,225,0.55)" strokeWidth={0.7}
        style={{ transition: 'fill 0.4s' }} />

      {/* ════════════════════ DRIP TIP ════════════════════ */}
      <path d={`M ${CCX - 5} ${TIP_TOP}
                L ${CCX + 5} ${TIP_TOP}
                L ${CCX + 2} ${TIP_BOT}
                L ${CCX - 2} ${TIP_BOT} Z`}
        fill="rgba(220,240,255,0.16)" stroke="rgba(186,214,236,0.55)" strokeWidth={0.9}
        strokeLinejoin="round" />

      {/* Falling droplet when the first band exits */}
      {running && exited && (
        <ellipse cx={CCX} cy={TIP_BOT + 8} rx={2.6} ry={4.3}
          fill="#fbbf24" className="chro-drip" />
      )}

      {/* ════════════════════ COLLECTION BEAKER ════════════════════ */}

      {/* Beaker — cylindrical with rounded bottom corners, small spout on right */}
      <path d={`M ${CCX - BEAKER_HALF} ${BEAKER_TOP}
                L ${CCX - BEAKER_HALF} ${BEAKER_BOT - 8}
                Q ${CCX - BEAKER_HALF} ${BEAKER_BOT} ${CCX - BEAKER_HALF + 8} ${BEAKER_BOT}
                L ${CCX + BEAKER_HALF - 8} ${BEAKER_BOT}
                Q ${CCX + BEAKER_HALF} ${BEAKER_BOT} ${CCX + BEAKER_HALF} ${BEAKER_BOT - 8}
                L ${CCX + BEAKER_HALF} ${BEAKER_TOP}`}
        fill="rgba(147,197,253,0.04)" stroke="rgba(147,197,253,0.42)" strokeWidth={1.2}
        strokeLinejoin="round" />
      {/* Spout (right lip) */}
      <path d={`M ${CCX + BEAKER_HALF} ${BEAKER_TOP + 1}
                L ${CCX + BEAKER_HALF + 8} ${BEAKER_TOP - 2}
                L ${CCX + BEAKER_HALF + 8} ${BEAKER_TOP + 2}`}
        fill="none" stroke="rgba(147,197,253,0.42)" strokeWidth={1.1}
        strokeLinejoin="round" />
      {/* Left highlight on beaker */}
      <line x1={CCX - BEAKER_HALF + 2.5} y1={BEAKER_TOP + 8}
        x2={CCX - BEAKER_HALF + 2.5} y2={BEAKER_BOT - 14}
        stroke="rgba(255,255,255,0.18)" strokeWidth={1} strokeLinecap="round" />

      {/* Eluted fraction filling the beaker bottom */}
      {exited && (
        <path d={`M ${CCX - BEAKER_HALF + 1.5} ${BEAKER_BOT - 22}
                  L ${CCX - BEAKER_HALF + 1.5} ${BEAKER_BOT - 8}
                  Q ${CCX - BEAKER_HALF + 1.5} ${BEAKER_BOT - 1.5} ${CCX - BEAKER_HALF + 8} ${BEAKER_BOT - 1.5}
                  L ${CCX + BEAKER_HALF - 8} ${BEAKER_BOT - 1.5}
                  Q ${CCX + BEAKER_HALF - 1.5} ${BEAKER_BOT - 1.5} ${CCX + BEAKER_HALF - 1.5} ${BEAKER_BOT - 8}
                  L ${CCX + BEAKER_HALF - 1.5} ${BEAKER_BOT - 22} Z`}
          fill="#fbbf24" opacity={0.35} />
      )}
      {/* Beaker volume tick marks */}
      <line x1={CCX - BEAKER_HALF + 4} y1={BEAKER_TOP + 18} x2={CCX - BEAKER_HALF + 10} y2={BEAKER_TOP + 18}
        stroke="rgba(147,197,253,0.35)" strokeWidth={0.6} />
      <line x1={CCX - BEAKER_HALF + 4} y1={BEAKER_TOP + 34} x2={CCX - BEAKER_HALF + 10} y2={BEAKER_TOP + 34}
        stroke="rgba(147,197,253,0.35)" strokeWidth={0.6} />

      {/* ════════════════════ TEXT LABELS ════════════════════ */}

      {/* Solvent label above the joint */}
      <text x={CCX} y={48} textAnchor="middle" fontSize={10} fill="#38bdf8"
        fontWeight="bold" fontFamily="sans-serif" letterSpacing={0.8}>SOLVENT ↓</text>

      {/* SILICA GEL rotated label (left side) */}
      <text fontSize={8.5} fill="#64748b" fontWeight="bold" fontFamily="sans-serif"
        textAnchor="middle" letterSpacing={1.2}
        transform={`translate(${CL - 18}, ${CT + CH / 2}) rotate(-90)`}>
        SILICA GEL
      </text>

      {/* Collection-flask label — placed to the side of the beaker to keep
          the full apparatus visible within the SVG viewBox (H=490). */}
      <text x={CCX + BEAKER_HALF + 8} y={BEAKER_TOP + 22} fontSize={9} fill="#64748b"
        fontWeight="bold" fontFamily="sans-serif" letterSpacing={1}>COLLECTION</text>
      <text x={CCX + BEAKER_HALF + 8} y={BEAKER_TOP + 32} fontSize={9} fill="#64748b"
        fontWeight="bold" fontFamily="sans-serif" letterSpacing={1}>FLASK</text>

      {/* Compound labels (right side) — same spacing logic as before so bands
          clustered at low progress don't visually collide. */}
      {COLUMN_COMPOUNDS.map((c, i) => {
        const cy = colBandY(c.rf, p);
        if (cy >= CB) return null;
        const minY = CT + 14 + i * 32;
        const ly = Math.max(minY, Math.min(CB - 14, cy));
        return (
          <g key={`lbl-${c.id}`}>
            <line x1={CR + 2} y1={ly} x2={CR + 18} y2={ly}
              stroke={c.color} strokeWidth={0.9} strokeDasharray="3,2" opacity={0.7} />
            <text x={CR + 22} y={ly - 4} fontSize={12} fill={c.color}
              fontWeight="bold" fontFamily="sans-serif">{c.name}</text>
            <text x={CR + 22} y={ly + 10} fontSize={11} fill="#94a3b8"
              fontFamily="sans-serif">Rf {c.rf.toFixed(2)} · {c.adsorption} ads.</text>
          </g>
        );
      })}

      {/* Exited label */}
      {exited && (
        <g>
          <text x={CR + 22} y={CB + 46} fontSize={12} fill="#fbbf24"
            fontWeight="bold" fontFamily="sans-serif">β-Carotene ✓</text>
          <text x={CR + 22} y={CB + 60} fontSize={11} fill="#94a3b8"
            fontFamily="sans-serif">First fraction eluted</text>
        </g>
      )}
    </svg>
  );
}

/* ── Paper SVG ─────────────────────────────────────────────────────────── */
/*
 * Visual reference: standard ascending-paper-chromatography setup —
 * rectangular borosilicate chromatography chamber (tank/jar), sealed at the
 * top by a glass lid to keep the atmosphere saturated; a horizontal glass
 * suspension rod sits just below the lid; a filter-paper strip hangs from
 * the rod via a small paper clip; a shallow pool of mobile-phase solvent
 * (~1 cm) sits at the bottom of the chamber, with the paper's pencil
 * baseline kept just ABOVE the solvent level. As capillary action draws
 * the solvent up the paper, dissolved components partition between the
 * stationary water in the paper and the moving solvent, giving each a
 * characteristic Rf.
 * (NCERT Class 12 Chemistry, §12.8.5 — paper chromatography apparatus.)
 */

// Chamber geometry — surrounds the paper + solvent pool, leaves room on the
// right for compound/solvent labels outside the glass.
const CHAM_L     = 62;
const CHAM_R     = 254;
const CHAM_TOP   = 40;
const CHAM_BOT   = 470;

// Lid sits across the top of the chamber with small overhangs
const LID_L      = CHAM_L - 8;
const LID_R      = CHAM_R + 8;
const LID_TOP    = 22;
const LID_BOT    = 40;

// Glass suspension rod (horizontal) — paper hangs from it via a clip
const ROD_Y      = 54;
const ROD_HX     = 80;     // half-length of rod

// Paper clip — small metal/plastic clip pinching paper to the rod
const CLIP_TOP   = PT - 8; // clip sits above paper top, around the rod
const CLIP_BOT   = PT + 6;

function PaperSVG({ p }: { p: number }) {
  const front = papFrontY(p);
  // Solvent pool is shallow, ~1 cm deep — placed BELOW the origin line so the
  // pencil baseline stays dry at p=0 (otherwise the spot dissolves immediately).
  const solventLvl = OY + 18;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cp-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#1e204a" />
          <stop offset="100%" stopColor="#050614" />
        </radialGradient>

        {/* Chamber glass — same gradient family as the column for visual
            cohesion. Highlight on left, mid-tone transparent middle, soft
            shadow on right gives a curved jar appearance. */}
        <linearGradient id="cp-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(226,240,255,0.45)" />
          <stop offset="25%"  stopColor="rgba(180,210,240,0.08)" />
          <stop offset="55%"  stopColor="rgba(150,190,225,0.04)" />
          <stop offset="80%"  stopColor="rgba(120,170,210,0.10)" />
          <stop offset="100%" stopColor="rgba(80,130,180,0.30)" />
        </linearGradient>

        {/* Filter-paper texture — faint vertical fibres */}
        <pattern id="cp-paper" x="0" y="0" width="3" height="24" patternUnits="userSpaceOnUse">
          <rect width="3" height="24" fill="rgba(244,242,232,0.16)" />
          <line x1="0.5" y1="0" x2="0.5" y2="24" stroke="rgba(214,211,201,0.12)" strokeWidth="0.3" />
          <line x1="2"   y1="0" x2="2"   y2="24" stroke="rgba(214,211,201,0.09)" strokeWidth="0.3" />
        </pattern>

        {/* Mobile-phase solvent gradient (same as column for consistency) */}
        <linearGradient id="cp-solvent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(56,189,248,0.30)" />
          <stop offset="100%" stopColor="rgba(56,189,248,0.14)" />
        </linearGradient>

        {/* Clip the wetted region & spots to the paper outline */}
        <clipPath id="pap-clip">
          <rect x={PL} y={PT} width={PW} height={PB - PT} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="url(#cp-bg)" />

      {/* ════════════════════ CHROMATOGRAPHY CHAMBER ════════════════════ */}

      {/* Chamber body — rectangular glass jar with rounded bottom corners */}
      <path d={`M ${CHAM_L} ${CHAM_TOP}
                L ${CHAM_L} ${CHAM_BOT - 12}
                Q ${CHAM_L} ${CHAM_BOT} ${CHAM_L + 12} ${CHAM_BOT}
                L ${CHAM_R - 12} ${CHAM_BOT}
                Q ${CHAM_R} ${CHAM_BOT} ${CHAM_R} ${CHAM_BOT - 12}
                L ${CHAM_R} ${CHAM_TOP} Z`}
        fill="url(#cp-glass)" opacity={0.4}
        stroke="rgba(186,214,236,0.5)" strokeWidth={1.2}
        strokeLinejoin="round" />

      {/* Glass highlights — left gloss + faint inner reflection */}
      <line x1={CHAM_L + 4} y1={CHAM_TOP + 10} x2={CHAM_L + 4} y2={CHAM_BOT - 24}
        stroke="rgba(255,255,255,0.30)" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={CHAM_L + 9} y1={CHAM_TOP + 16} x2={CHAM_L + 9} y2={CHAM_BOT - 34}
        stroke="rgba(255,255,255,0.10)" strokeWidth={0.6} strokeLinecap="round" />
      {/* Right shadow */}
      <line x1={CHAM_R - 4} y1={CHAM_TOP + 10} x2={CHAM_R - 4} y2={CHAM_BOT - 24}
        stroke="rgba(15,23,42,0.5)" strokeWidth={1.1} strokeLinecap="round" />

      {/* ════════════════════ SOLVENT POOL ════════════════════ */}
      <path d={`M ${CHAM_L + 2} ${solventLvl}
                L ${CHAM_L + 2} ${CHAM_BOT - 12}
                Q ${CHAM_L + 2} ${CHAM_BOT - 2} ${CHAM_L + 12} ${CHAM_BOT - 2}
                L ${CHAM_R - 12} ${CHAM_BOT - 2}
                Q ${CHAM_R - 2} ${CHAM_BOT - 2} ${CHAM_R - 2} ${CHAM_BOT - 12}
                L ${CHAM_R - 2} ${solventLvl} Z`}
        fill="url(#cp-solvent)" />
      {/* Meniscus on the solvent surface */}
      <path d={`M ${CHAM_L + 2} ${solventLvl + 1}
                Q ${(CHAM_L + CHAM_R) / 2} ${solventLvl - 4} ${CHAM_R - 2} ${solventLvl + 1}`}
        fill="none" stroke="rgba(125,211,252,0.65)" strokeWidth={1.2} />

      {/* ════════════════════ LID + SUSPENSION ROD ════════════════════ */}

      {/* Glass lid (sealed cover keeps the chamber atmosphere saturated) */}
      <rect x={LID_L} y={LID_TOP} width={LID_R - LID_L} height={LID_BOT - LID_TOP}
        rx={2}
        fill="rgba(100,116,139,0.45)" stroke="rgba(186,214,236,0.55)" strokeWidth={1} />
      <rect x={LID_L + 3} y={LID_TOP + 2.5} width={LID_R - LID_L - 6} height={2.5} rx={1}
        fill="rgba(255,255,255,0.20)" />

      {/* Glass suspension rod (horizontal) — paper hangs from this */}
      <line x1={PCX - ROD_HX} y1={ROD_Y} x2={PCX + ROD_HX} y2={ROD_Y}
        stroke="rgba(226,240,255,0.65)" strokeWidth={3.5} strokeLinecap="round" />
      <line x1={PCX - ROD_HX + 4} y1={ROD_Y - 0.7} x2={PCX + ROD_HX - 4} y2={ROD_Y - 0.7}
        stroke="rgba(255,255,255,0.55)" strokeWidth={1} strokeLinecap="round" />

      {/* Paper clip — small clamp pinching the paper to the rod */}
      <rect x={PL - 2} y={CLIP_TOP} width={PW + 4} height={CLIP_BOT - CLIP_TOP}
        rx={2}
        fill="rgba(148,163,184,0.55)" stroke="rgba(203,213,225,0.7)" strokeWidth={0.7} />
      <line x1={PL - 1} y1={CLIP_TOP + 2} x2={PR + 1} y2={CLIP_TOP + 2}
        stroke="rgba(255,255,255,0.30)" strokeWidth={0.7} />

      {/* ════════════════════ PAPER STRIP ════════════════════ */}

      {/* Filter-paper strip with subtle fibre texture */}
      <rect x={PL} y={PT} width={PW} height={PB - PT}
        fill="url(#cp-paper)" stroke="rgba(226,232,240,0.30)" strokeWidth={0.8} rx={1} />

      {/* Pencil baseline — students always mark this in pencil so it doesn't
          dissolve in the solvent. Drawn as a faint graphite-grey dashed line. */}
      <line x1={PL + 3} y1={OY} x2={PR - 3} y2={OY}
        stroke="rgba(180,180,180,0.55)" strokeWidth={0.8} strokeDasharray="3,2" />

      {/* Wetted region — translucent blue tint above the solvent front */}
      {p > 0.02 && (
        <rect x={PL + 0.6} y={front} width={PW - 1.2} height={PB - front - 0.6}
          fill="rgba(56,189,248,0.14)" clipPath="url(#pap-clip)" />
      )}

      {/* Original mixed spot — fades as components separate */}
      <circle cx={PCX} cy={OY} r={6.5}
        fill="rgba(148,163,184,0.55)" opacity={Math.max(0, 1 - p * 1.6)} />

      {/* Separated pigment spots — rise to their Rf-determined heights */}
      <g clipPath="url(#pap-clip)">
        {PAPER_COMPOUNDS.map(c => (
          <circle key={c.id}
            cx={PCX} cy={papSpotY(c.rf, p)} r={6.5}
            fill={c.color} opacity={Math.min(0.85, p * 2.2)} />
        ))}
      </g>

      {/* Solvent front — leading edge of the rising mobile phase */}
      {p > 0.03 && (
        <>
          <line x1={PL - 4} y1={front} x2={PR + 4} y2={front}
            stroke="rgba(56,189,248,0.75)" strokeWidth={1.3} />
          <text x={CHAM_R + 10} y={front + 4} fontSize={10} fill="#38bdf8"
            fontFamily="sans-serif">Solvent front</text>
          <line x1={PR + 4} y1={front} x2={CHAM_R + 8} y2={front}
            stroke="rgba(56,189,248,0.4)" strokeWidth={0.6} strokeDasharray="2,2" />
        </>
      )}

      {/* ════════════════════ TEXT LABELS ════════════════════ */}

      {/* Lid label (top-right outside the chamber) */}
      <text x={CHAM_R + 10} y={LID_TOP + 13} fontSize={9} fill="#64748b"
        fontWeight="bold" fontFamily="sans-serif" letterSpacing={0.8}>SEALED LID</text>

      {/* Suspension-rod label */}
      <text x={CHAM_R + 10} y={ROD_Y + 3} fontSize={9} fill="#64748b"
        fontWeight="bold" fontFamily="sans-serif" letterSpacing={0.8}>GLASS ROD</text>

      {/* Origin label (with leader from paper through chamber to outside) */}
      <line x1={PR + 4} y1={OY} x2={CHAM_R + 8} y2={OY}
        stroke="rgba(148,163,184,0.4)" strokeWidth={0.6} strokeDasharray="2,2" />
      <text x={CHAM_R + 10} y={OY + 4} fontSize={10} fill="#94a3b8" fontFamily="sans-serif">
        Origin (pencil line)
      </text>

      {/* Solvent label (right of chamber, aligned with pool) */}
      <line x1={CHAM_R - 2} y1={(solventLvl + CHAM_BOT) / 2} x2={CHAM_R + 8} y2={(solventLvl + CHAM_BOT) / 2}
        stroke="rgba(56,189,248,0.4)" strokeWidth={0.6} strokeDasharray="2,2" />
      <text x={CHAM_R + 10} y={(solventLvl + CHAM_BOT) / 2 + 4} fontSize={10} fill="#38bdf8"
        fontWeight="bold" fontFamily="sans-serif">Solvent</text>
      <text x={CHAM_R + 10} y={(solventLvl + CHAM_BOT) / 2 + 17} fontSize={10} fill="#64748b"
        fontFamily="sans-serif">(mobile phase)</text>

      {/* Compound labels — only visible once the spots have travelled enough
          to be visually distinct from the origin. */}
      {p > 0.38 && PAPER_COMPOUNDS.map(c => {
        const sy = papSpotY(c.rf, p);
        const op = Math.min(1, (p - 0.38) * 3.5);
        return (
          <g key={`lbl-${c.id}`} style={{ opacity: op }}>
            <line x1={PR + 2} y1={sy} x2={CHAM_R + 8} y2={sy}
              stroke={c.color} strokeWidth={0.8} strokeDasharray="3,2" opacity={0.7} />
            <text x={CHAM_R + 12} y={sy - 4} fontSize={12} fill={c.color}
              fontWeight="bold" fontFamily="sans-serif">{c.name}</text>
            <text x={CHAM_R + 12} y={sy + 10} fontSize={11} fill="#94a3b8"
              fontFamily="sans-serif">Rf = {c.rf.toFixed(2)}</text>
          </g>
        );
      })}

    </svg>
  );
}

/* ── Controls row ──────────────────────────────────────────────────────── */

function Controls({
  running, progress, onToggle, onSlider, onReset, label,
}: {
  running: boolean;
  progress: number;
  onToggle: () => void;
  onSlider: (v: number) => void;
  onReset: () => void;
  label: string;
}) {
  const done = progress >= 1;
  return (
    <div className="flex items-center gap-3 flex-wrap pt-1">
      <button onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0"
        style={{
          background: running ? 'rgba(239,68,68,0.13)' : 'rgba(99,102,241,0.18)',
          border: `1px solid ${running ? 'rgba(239,68,68,0.4)' : 'rgba(129,140,248,0.4)'}`,
          color: running ? '#f87171' : '#c4b5fd',
        }}>
        {running ? '⏸ Pause' : done ? `↺ Restart ${label}` : progress > 0 ? '▶ Resume' : `▶ Run ${label}`}
      </button>

      <div className="flex-1 flex items-center gap-2 min-w-[160px]">
        <span className="text-xs font-black uppercase tracking-wider shrink-0"
          style={{ color: '#475569' }}>Progress</span>
        <input type="range" min={0} max={100} value={Math.round(progress * 100)}
          onChange={e => onSlider(Number(e.target.value) / 100)}
          className="flex-1" style={{ accentColor: '#6366f1' }} />
        <span className="text-[11px] font-bold shrink-0" style={{ color: '#818cf8' }}>
          {Math.round(progress * 100)}%
        </span>
      </div>

      <button onClick={onReset}
        className="px-3 py-2 rounded-lg text-sm font-bold transition-all shrink-0"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(129,140,248,0.25)', color: '#a5b4fc' }}>
        ↺ Reset
      </button>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */

export default function ChromatographySim() {
  const [mode, setMode] = useState<Mode>('column');
  const containerRef = useRef<HTMLDivElement>(null);

  const [colP, setColP] = useState(0);
  const [colRunning, setColRunning] = useState(false);
  const colPRef = useRef(0);

  const [papP, setPapP] = useState(0);
  const [papRunning, setPapRunning] = useState(false);
  const papPRef = useRef(0);

  // Column animation — 9-second run-to-completion, gated on `colRunning`.
  // Uses real delta (in seconds) so pauses/tab-hides don't warp the progress
  // curve. Shared hook also pauses automatically when the container is
  // scrolled off-screen.
  useAnimationFrame(
    (delta) => {
      const newP = Math.min(1, colPRef.current + delta / 9);
      colPRef.current = newP;
      setColP(newP);
      if (newP >= 1) setColRunning(false);
    },
    { target: containerRef, enabled: colRunning }
  );

  // Paper animation — 8-second run-to-completion.
  useAnimationFrame(
    (delta) => {
      const newP = Math.min(1, papPRef.current + delta / 8);
      papPRef.current = newP;
      setPapP(newP);
      if (newP >= 1) setPapRunning(false);
    },
    { target: containerRef, enabled: papRunning }
  );

  function toggleCol() {
    if (colRunning) { setColRunning(false); return; }
    if (colP >= 1) { colPRef.current = 0; setColP(0); setTimeout(() => setColRunning(true), 20); return; }
    setColRunning(true);
  }
  function sliderCol(v: number) { setColRunning(false); colPRef.current = v; setColP(v); }
  function resetCol() { setColRunning(false); colPRef.current = 0; setColP(0); }

  function togglePap() {
    if (papRunning) { setPapRunning(false); return; }
    if (papP >= 1) { papPRef.current = 0; setPapP(0); setTimeout(() => setPapRunning(true), 20); return; }
    setPapRunning(true);
  }
  function sliderPap(v: number) { setPapRunning(false); papPRef.current = v; setPapP(v); }
  function resetPap() { setPapRunning(false); papPRef.current = 0; setPapP(0); }

  return (
    <div ref={containerRef} className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16 }}>
      <style>{CSS}</style>

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-black tracking-tight text-white">
          Chromatography <span style={{ color: '#7c3aed' }}>Lab</span>
        </h2>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
          style={{ color: '#475569' }}>Interactive Separation Simulator</p>
      </div>

      {/* Mode tabs */}
      <div className="flex mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {([
          ['column', 'Column Chromatography', 'Adsorption-based'],
          ['paper',  'Paper Chromatography',  'Partition / capillary'],
        ] as const).map(([key, label, sub]) => {
          const active = mode === key;
          return (
            <button key={key} onClick={() => setMode(key)}
              className="px-4 py-3 text-left transition-all"
              style={{
                background: 'none', outline: 'none',
                borderBottom: `2px solid ${active ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
                opacity: active ? 1 : 0.5,
                marginBottom: -1,
              }}>
              <div className="text-sm font-black" style={{ color: active ? '#818cf8' : '#94a3b8' }}>{label}</div>
              <div className="text-xs" style={{ color: '#475569' }}>{sub}</div>
            </button>
          );
        })}
      </div>

      {/* ── Column mode ─────────────────────────────────────────────────── */}
      {mode === 'column' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-5">
            {/* Canvas */}
            <div className="rounded-2xl overflow-hidden"
              style={{
                background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
              <ColumnSVG p={colP} running={colRunning} />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 py-1">
              <h3 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
                What's Happening
              </h3>
              <div className="space-y-4">
                {COLUMN_COMPOUNDS.map(c => (
                  <div key={c.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="text-[11px] font-black uppercase tracking-widest"
                        style={{ color: c.color }}>{c.name}</span>
                    </div>
                    <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>{c.note}</p>
                    <p className="text-[10px] font-bold mt-1" style={{ color: '#475569' }}>
                      Adsorption: {c.adsorption} · Rf ≈ {c.rf.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: '#6366f1' }}>Key Principle</p>
                <p className="text-sm font-bold leading-tight italic text-white">
                  &ldquo;Less adsorbed = moves faster. The compound least attracted to silica elutes first.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <Controls running={colRunning} progress={colP}
            onToggle={toggleCol} onSlider={sliderCol} onReset={resetCol}
            label="Column" />
        </div>
      )}

      {/* ── Paper mode ──────────────────────────────────────────────────── */}
      {mode === 'paper' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-5">
            {/* Canvas */}
            <div className="rounded-2xl overflow-hidden"
              style={{
                background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
              <PaperSVG p={papP} />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 py-1">
              <h3 className="text-xl font-black uppercase tracking-tighter" style={{ color: '#e2e8f0' }}>
                What's Happening
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: '#6366f1' }}>The Principle</p>
                  <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>
                    Solvent rises by capillary action. Each pigment partitions differently between
                    the water in the paper (stationary) and the moving solvent — giving each a unique Rf.
                  </p>
                </div>
                {PAPER_COMPOUNDS.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider"
                        style={{ color: c.color }}>{c.name}</span>
                      <span className="text-[10px] font-bold ml-2" style={{ color: '#475569' }}>
                        Rf = {c.rf.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg px-3 py-2.5 mt-2"
                  style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(129,140,248,0.14)' }}>
                  <p className="text-xs font-black text-center inline-flex items-center justify-center flex-wrap w-full"
                    style={{ color: '#818cf8' }}>
                    Rf = <Frac num="distance by spot" den="distance by solvent front" />
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: '#6366f1' }}>Expert Tip</p>
                <p className="text-sm font-bold leading-tight italic text-white">
                  &ldquo;Rf is constant for a compound under fixed conditions — that&apos;s why it&apos;s used for identification, not just separation.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <Controls running={papRunning} progress={papP}
            onToggle={togglePap} onSlider={sliderPap} onReset={resetPap}
            label="Chromatography" />
        </div>
      )}
    </div>
  );
}
