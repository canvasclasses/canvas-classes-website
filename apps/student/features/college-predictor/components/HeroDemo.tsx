'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================================
// HeroDemo — auto-playing live predictor showcase.
//
// Implementation of the "live predictor" hero design from the Claude Design
// handoff bundle (Downloads/college-predictor-tool/project/predictor.jsx).
//
// What this is:
//   - A self-contained, auto-playing demo of the predictor surface.
//   - Cursor types a rank, then drags an animated slider through waypoints.
//   - College chips reshuffle between SAFE / TARGET / REACH columns as the
//     rank changes, with smooth translate/opacity transitions.
//   - "Try your own rank →" scrolls to the real predictor form below.
//
// Trade-off vs the prior 4-scene loop:
//   The previous version showed 4 disconnected scenes (predict / what-if /
//   share / drop-year). It read as a slideshow. This version is ONE coherent
//   live demo that mirrors the actual predictor — students see the bucketing
//   mechanic in action without needing to click anything.
//
// Data:
//   Uses an illustrative COLLEGES array (~30 entries, sized for visual balance
//   so the bucket model produces a satisfying reshuffle across the waypoints).
//   Not from MongoDB — running real predictor queries every 60ms during the
//   tween would be wasteful and would noticeably stall on a slow connection.
//   For the marketing surface, illustrative cutoffs are the right call.
// ============================================================================

// ── Illustrative cutoff dataset ──────────────────────────────────────────────
interface HeroCollege {
  id: string;
  name: string;
  branch: string;
  cutoff: number;
  tier: number;
}

const COLLEGES: HeroCollege[] = [
  { id: 'iiith_cse',    name: 'IIIT Hyderabad',  branch: 'Computer Science',       cutoff: 350,   tier: 1 },
  { id: 'iiitb_cse',    name: 'IIIT Bangalore',  branch: 'Computer Science',       cutoff: 3200,  tier: 1 },
  { id: 'nittr_cse',    name: 'NIT Trichy',      branch: 'Computer Science',       cutoff: 1800,  tier: 1 },
  { id: 'nitk_cse',     name: 'NIT Surathkal',   branch: 'Computer Science',       cutoff: 2400,  tier: 1 },
  { id: 'nitw_cse',     name: 'NIT Warangal',    branch: 'Computer Science',       cutoff: 2900,  tier: 1 },
  { id: 'iiitd_cse',    name: 'IIIT Delhi',      branch: 'Computer Science',       cutoff: 3500,  tier: 1 },
  { id: 'iiitall_it',   name: 'IIIT Allahabad',  branch: 'Information Technology', cutoff: 4500,  tier: 1 },
  { id: 'nittr_ece',    name: 'NIT Trichy',      branch: 'Electronics & Comm.',    cutoff: 4800,  tier: 2 },
  { id: 'mnnit_cse',    name: 'MNNIT Allahabad', branch: 'Computer Science',       cutoff: 6000,  tier: 2 },
  { id: 'nitk_ece',     name: 'NIT Surathkal',   branch: 'Electronics & Comm.',    cutoff: 6200,  tier: 2 },
  { id: 'nsut_cse',     name: 'NSUT Delhi',      branch: 'Computer Science',       cutoff: 6500,  tier: 2 },
  { id: 'nitw_ece',     name: 'NIT Warangal',    branch: 'Electronics & Comm.',    cutoff: 6800,  tier: 2 },
  { id: 'nitc_cse',     name: 'NIT Calicut',     branch: 'Computer Science',       cutoff: 7500,  tier: 2 },
  { id: 'dtu_cse',      name: 'DTU Delhi',       branch: 'Computer Science',       cutoff: 7800,  tier: 2 },
  { id: 'nitr_cse',     name: 'NIT Rourkela',    branch: 'Computer Science',       cutoff: 9500,  tier: 2 },
  { id: 'nitj_cse',     name: 'MNIT Jaipur',     branch: 'Computer Science',       cutoff: 10500, tier: 2 },
  { id: 'nitn_cse',     name: 'VNIT Nagpur',     branch: 'Computer Science',       cutoff: 11200, tier: 2 },
  { id: 'nitb_cse',     name: 'MANIT Bhopal',    branch: 'Computer Science',       cutoff: 13000, tier: 3 },
  { id: 'nittr_mech',   name: 'NIT Trichy',      branch: 'Mechanical',             cutoff: 14000, tier: 3 },
  { id: 'nitk_mech',    name: 'NIT Surathkal',   branch: 'Mechanical',             cutoff: 15500, tier: 3 },
  { id: 'nith_cse',     name: 'NIT Hamirpur',    branch: 'Computer Science',       cutoff: 16000, tier: 3 },
  { id: 'nitd_cse',     name: 'NIT Durgapur',    branch: 'Computer Science',       cutoff: 17000, tier: 3 },
  { id: 'nitp_cse',     name: 'NIT Patna',       branch: 'Computer Science',       cutoff: 17500, tier: 3 },
  { id: 'nitrp_cse',    name: 'NIT Raipur',      branch: 'Computer Science',       cutoff: 18500, tier: 3 },
  { id: 'nitg_cse',     name: 'NIT Goa',         branch: 'Computer Science',       cutoff: 22000, tier: 3 },
  { id: 'nits_cse',     name: 'NIT Silchar',     branch: 'Computer Science',       cutoff: 22500, tier: 3 },
  { id: 'nittr_civil',  name: 'NIT Trichy',      branch: 'Civil',                  cutoff: 22800, tier: 3 },
  { id: 'nita_cse',     name: 'NIT Agartala',    branch: 'Computer Science',       cutoff: 28000, tier: 4 },
  { id: 'nitsk_cse',    name: 'NIT Sikkim',      branch: 'Computer Science',       cutoff: 36000, tier: 4 },
  { id: 'nitm_cse',     name: 'NIT Manipur',     branch: 'Computer Science',       cutoff: 42000, tier: 4 },
];

const ACCENT = '#f59e0b';

// ── Bucket model ─────────────────────────────────────────────────────────────
type Bucket = 'SAFE' | 'TARGET' | 'REACH';
function bucketFor(rank: number, cutoff: number): { b: Bucket; pct: number } | null {
  const ratio = rank / cutoff;
  if (ratio <= 0.55) return { b: 'SAFE',   pct: 99 };
  if (ratio <= 0.75) return { b: 'SAFE',   pct: Math.round(95 - (ratio - 0.55) * 60) };
  if (ratio <= 1.05) return { b: 'TARGET', pct: Math.round(78 - (ratio - 0.75) * 130) };
  if (ratio <= 1.40) return { b: 'REACH',  pct: Math.round(35 - (ratio - 1.05) * 65) };
  return null;
}

const fmtRank = (n: number) => Math.round(n).toLocaleString('en-IN');
function percentileFromRank(rank: number) {
  if (rank < 1) return '—';
  const total = 1_000_000; // approx total JEE Main candidates
  return ((1 - rank / total) * 100).toFixed(3);
}

// ── Chip layout constants ────────────────────────────────────────────────────
const CHIP_W = 312;
const CHIP_H = 60;
const CHIP_GAP_Y = 10;
const COL_GAP = 24;
const CHIP_HEADER_Y = 44;
const SURFACE_WIDTH = 3 * CHIP_W + 2 * COL_GAP;
const SURFACE_HEIGHT = CHIP_HEADER_Y + 4 * (CHIP_H + CHIP_GAP_Y);

// ── Background: grid + aurora + animated ribbons ─────────────────────────────
// EXPORTED separately so the page can render it as a sibling spanning the
// whole hero section (behind headline + predictor + trust strip). Rendering
// it INSIDE HeroDemo would scope the glow to just the predictor card, which
// makes the headline area look dead.
//
// The amber alpha was bumped from 0x30 (~18%) to 0x55 (~33%) and an extra
// focused glow added behind the headline so "more than a guess" pops without
// blowing out the predictor surface contrast.
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Faint grid — masked so it fades at the edges. Alpha dialled back to
          0.022 so the grid is a hint, not a print. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 80%)',
        }}
      />
      {/* PRIMARY amber aurora — toned down to a subtle halo behind the
          headline. Original was 0x55 / 0x22 — too hot; now 0x33 / 0x10. */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '-10%',
          width: 1400,
          height: 800,
          marginLeft: -700,
          background: `radial-gradient(50% 50% at 50% 50%, ${ACCENT}33 0%, ${ACCENT}10 40%, transparent 75%)`,
          filter: 'blur(50px)',
        }}
      />
      {/* Focused headline glow — tight & warm. Reduced 0x66 → 0x30 so it
          whispers behind the gradient line rather than washing over it. */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '10%',
          width: 700,
          height: 300,
          marginLeft: -350,
          background: `radial-gradient(60% 60% at 50% 50%, ${ACCENT}30 0%, transparent 75%)`,
          filter: 'blur(70px)',
        }}
      />
      {/* Purple aurora mid-left — toned back from 0x45 to 0x22 */}
      <div
        className="absolute"
        style={{
          left: '15%',
          top: '40%',
          width: 600,
          height: 500,
          background: 'radial-gradient(50% 50% at 50% 50%, #a855f722 0%, transparent 75%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Pink aurora mid-right — 0x35 → 0x18 */}
      <div
        className="absolute"
        style={{
          right: '10%',
          top: '50%',
          width: 500,
          height: 400,
          background: 'radial-gradient(50% 50% at 50% 50%, #ec489918 0%, transparent 75%)',
          filter: 'blur(90px)',
        }}
      />
      {/* Animated rank ribbons — opacity dialled back from 0.55 to 0.28 so
          they read as background motion, not foreground decoration. Gradient
          peaks also softened (amber 0.7 → 0.42, purple 0.55 → 0.32, pink
          0.45 → 0.22). Stroke widths normalised to 1.4 for a finer line. */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.28 }}
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
            <stop offset="50%" stopColor={ACCENT} stopOpacity="0.42" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rg3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Top ribbon — amber, drifts behind the headline */}
        <path d="M -50 180 Q 400 100 800 280 T 1650 200" stroke="url(#rg1)" strokeWidth="1.4" fill="none">
          <animate
            attributeName="d"
            values="M -50 180 Q 400 100 800 280 T 1650 200;
                    M -50 160 Q 400 260 800 180 T 1650 320;
                    M -50 180 Q 400 100 800 280 T 1650 200"
            dur="18s"
            repeatCount="indefinite"
          />
        </path>
        {/* Mid ribbon — purple, behind predictor */}
        <path d="M -50 480 Q 500 580 900 430 T 1650 510" stroke="url(#rg2)" strokeWidth="1.4" fill="none">
          <animate
            attributeName="d"
            values="M -50 480 Q 500 580 900 430 T 1650 510;
                    M -50 520 Q 500 400 900 560 T 1650 440;
                    M -50 480 Q 500 580 900 430 T 1650 510"
            dur="22s"
            repeatCount="indefinite"
          />
        </path>
        {/* Lower ribbon — pink, near the trust strip */}
        <path d="M -50 720 Q 600 660 1000 760 T 1650 700" stroke="url(#rg3)" strokeWidth="1.2" fill="none">
          <animate
            attributeName="d"
            values="M -50 720 Q 600 660 1000 760 T 1650 700;
                    M -50 740 Q 600 800 1000 680 T 1650 780;
                    M -50 720 Q 600 660 1000 760 T 1650 700"
            dur="26s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}

// ── Animated cursor SVG ──────────────────────────────────────────────────────
interface CursorState {
  x: number;
  y: number;
  pressed: boolean;
  visible: boolean;
  tight: boolean;
}

function FakeCursor({ x, y, pressed, visible, tight }: CursorState) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px) scale(${pressed ? 0.92 : 1})`,
        transition: tight
          ? 'transform 0.04s linear, opacity 0.4s'
          : 'transform 0.7s cubic-bezier(.5,.1,.25,1), opacity 0.4s',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        zIndex: 50,
        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,.6))',
        willChange: 'transform',
      }}
    >
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
        <path
          d="M2 2 L2 20 L7 16 L10 22 L13 21 L10 15 L17 14 Z"
          fill="#fff"
          stroke="#0a0a0f"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      {pressed && (
        <span
          style={{
            position: 'absolute',
            left: -6,
            top: -6,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(245,158,11,0.25)',
            border: '1px solid rgba(245,158,11,0.6)',
          }}
        />
      )}
    </div>
  );
}

// ── College chip ─────────────────────────────────────────────────────────────
const PALETTE: Record<Bucket, { bg: string; border: string; text: string; glow: string }> = {
  SAFE:   { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(52,211,153,0.5)',  text: '#34d399', glow: 'rgba(16,185,129,0.25)' },
  TARGET: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(251,191,36,0.5)',  text: '#fbbf24', glow: 'rgba(245,158,11,0.25)' },
  REACH:  { bg: 'rgba(56,189,248,0.08)',  border: 'rgba(125,211,252,0.5)', text: '#7dd3fc', glow: 'rgba(56,189,248,0.25)' },
};

function CollegeChip({
  college,
  pos,
  bucket,
  pct,
  visible,
}: {
  college: HeroCollege;
  pos: { x: number; y: number };
  bucket: Bucket;
  pct: number;
  visible: boolean;
}) {
  const p = PALETTE[bucket];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: CHIP_W,
        height: CHIP_H,
        transform: `translate(${pos.x}px, ${pos.y}px) scale(${visible ? 1 : 0.92})`,
        opacity: visible ? 1 : 0,
        transition:
          'transform 0.65s cubic-bezier(.4,0,.2,1), opacity 0.45s ease, background 0.4s, border-color 0.4s',
        background: `linear-gradient(180deg, ${p.bg}, rgba(15,17,28,0.85))`,
        border: `1px solid ${p.border}`,
        borderRadius: 12,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 22px -12px ${p.glow}`,
        willChange: 'transform, opacity',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: '#f5f5f7',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '-0.005em',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {college.name}
        </div>
        <div
          style={{
            color: '#8b8b95',
            fontSize: 11.5,
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {college.branch}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <div
          style={{
            color: p.text,
            fontWeight: 700,
            fontSize: 16,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
          }}
        >
          {pct}%
        </div>
        <div style={{ color: p.text, fontSize: 9, letterSpacing: '0.12em', opacity: 0.85, fontWeight: 600 }}>
          {bucket}
        </div>
      </div>
    </div>
  );
}

// ── Column header ────────────────────────────────────────────────────────────
function ColumnHeader({ label, count, color, x, width }: { label: string; count: number; color: string; x: number; width: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4px 12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
        <span style={{ color: '#e7e7ea', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em' }}>{label}</span>
      </div>
      <span style={{ color: '#5e5e6a', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </div>
  );
}

// ── Chip surface — scales the natural 936px-wide grid to fit narrower frames
function ChipSurface({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => setScale(Math.min(1, wrap.clientWidth / SURFACE_WIDTH));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={wrapRef} style={{ width: '100%', height: SURFACE_HEIGHT * scale, overflow: 'hidden' }}>
      <div style={{ width: SURFACE_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top center', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

// ── Main predictor demo ──────────────────────────────────────────────────────
function PredictorDemo() {
  const [rank, setRank] = useState(0);
  const [typedRank, setTypedRank] = useState('');
  const [phase, setPhase] = useState<'intro' | 'autoplay' | 'manual'>('intro');
  const [cursor, setCursor] = useState<CursorState>({ x: 140, y: 280, pressed: false, visible: true, tight: false });
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<'intro' | 'autoplay' | 'manual'>('intro');

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const waypoints = useMemo(
    () => [
      { rank: 8532, hold: 2400 },
      { rank: 2200, hold: 2400 },
      { rank: 14500, hold: 2400 },
      { rank: 25000, hold: 2200 },
      { rank: 6400, hold: 2400 },
    ],
    [],
  );

  // Intro sequence — cursor approaches the input and types the first rank
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setCursor({ x: 220, y: 240, pressed: false, visible: true, tight: false }), 100));
    timers.push(setTimeout(() => setCursor({ x: 200, y: 168, pressed: false, visible: true, tight: false }), 600));
    timers.push(setTimeout(() => setCursor((c) => ({ ...c, pressed: true })), 1300));
    timers.push(setTimeout(() => setCursor((c) => ({ ...c, pressed: false })), 1500));
    const target = '8532';
    target.split('').forEach((d, i) => {
      timers.push(
        setTimeout(() => {
          setTypedRank((prev) => prev + d);
          setRank(parseInt(target.slice(0, i + 1), 10));
        }, 1800 + i * 220),
      );
    });
    timers.push(setTimeout(() => setCursor({ x: 280, y: 230, pressed: false, visible: true, tight: false }), 3200));
    timers.push(setTimeout(() => {
      setPhase('autoplay');
      phaseRef.current = 'autoplay';
    }, 3700));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Autoplay loop — tween rank between waypoints, drag cursor along slider
  useEffect(() => {
    if (phase !== 'autoplay') return;
    let idx = 0;
    let from = 8532;
    let to = waypoints[0].rank;
    let segStart = performance.now();
    const SEG_DUR = 1800;
    let holding = false;
    let holdStart = 0;

    const tick = (now: number) => {
      if (phaseRef.current !== 'autoplay') return;
      const slider = sliderRef.current;
      const sliderRect = slider?.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (holding) {
        if (now - holdStart >= waypoints[idx].hold) {
          holding = false;
          from = to;
          idx = (idx + 1) % waypoints.length;
          to = waypoints[idx].rank;
          segStart = now;
        }
      } else {
        const t = Math.min(1, (now - segStart) / SEG_DUR);
        // Ease-in-out cubic
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const cur = from + (to - from) * e;
        setRank(cur);
        setTypedRank(fmtRank(cur));
        if (sliderRect && containerRect) {
          const pct = Math.min(1, Math.max(0, cur / 50000));
          const x = sliderRect.left - containerRect.left + sliderRect.width * pct;
          const y = sliderRect.top - containerRect.top + 8;
          setCursor({ x: x - 4, y: y - 4, pressed: t > 0.05 && t < 0.95, visible: true, tight: true });
        }
        if (t >= 1) {
          holding = true;
          holdStart = now;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    const hintT = setTimeout(() => setShowHint(true), 5000);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(hintT);
    };
  }, [phase, waypoints]);

  // Manual interaction handler
  const enterManual = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setPhase('manual');
    phaseRef.current = 'manual';
    setCursor((c) => ({ ...c, visible: false }));
    setShowHint(false);
  }, []);

  const handleSliderInteract = (e: React.MouseEvent | React.TouchEvent) => {
    enterManual();
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const update = (clientX: number) => {
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const newRank = Math.max(1, Math.round(pct * 50000));
      setRank(newRank);
      setTypedRank(fmtRank(newRank));
    };
    const initialX =
      'clientX' in e
        ? (e as React.MouseEvent).clientX
        : (e as React.TouchEvent).touches?.[0]?.clientX ?? 0;
    update(initialX);
    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = 'clientX' in ev ? (ev as MouseEvent).clientX : (ev as TouchEvent).touches?.[0]?.clientX ?? 0;
      update(cx);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('mousemove', onMove as EventListener);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove as EventListener);
    window.addEventListener('touchend', onUp);
  };

  // Compute bucketed positions
  const bucketed = useMemo(() => {
    const out: Record<Bucket, { college: HeroCollege; pct: number }[]> = { SAFE: [], TARGET: [], REACH: [] };
    if (rank < 1) return out;
    for (const c of COLLEGES) {
      const b = bucketFor(rank, c.cutoff);
      if (!b) continue;
      out[b.b].push({ college: c, pct: Math.max(8, Math.min(99, b.pct)) });
    }
    for (const k of Object.keys(out) as Bucket[]) {
      out[k].sort((a, b) => a.college.cutoff - b.college.cutoff);
      out[k] = out[k].slice(0, 4);
    }
    return out;
  }, [rank]);

  const chipPositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; bucket: Bucket; pct: number; college: HeroCollege }>();
    const colX: Record<Bucket, number> = {
      SAFE: 0,
      TARGET: CHIP_W + COL_GAP,
      REACH: 2 * (CHIP_W + COL_GAP),
    };
    for (const k of ['SAFE', 'TARGET', 'REACH'] as Bucket[]) {
      bucketed[k].forEach((entry, idx) => {
        map.set(entry.college.id, {
          x: colX[k],
          y: CHIP_HEADER_Y + idx * (CHIP_H + CHIP_GAP_Y),
          bucket: k,
          pct: entry.pct,
          college: entry.college,
        });
      });
    }
    return map;
  }, [bucketed]);

  // Keep all-ever-mounted chips so leaving chips can animate out
  const stableRef = useRef(new Map<string, { x: number; y: number; bucket: Bucket; pct: number; college: HeroCollege }>());
  for (const [id, p] of chipPositions) {
    stableRef.current.set(id, p);
  }

  const sliderPct = Math.min(1, Math.max(0, rank / 50000));
  const totalVisible = bucketed.SAFE.length + bucketed.TARGET.length + bucketed.REACH.length;

  function scrollToRealPredictor() {
    enterManual();
    const el = document.getElementById('predictor');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1180,
        margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(20,22,34,0.9), rgba(12,13,22,0.95))',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 22,
        padding: '26px 32px 30px',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02)',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em' }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 12px #ef4444',
                animation: 'hero-livepulse 1.6s ease-in-out infinite',
              }}
            />
            LIVE PREDICTOR
          </span>
          <span style={{ color: '#5e5e6a', fontSize: 11, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace" }}>
            JoSAA + BITSAT 2021–2025
          </span>
        </div>
        <div
          style={{
            padding: '5px 10px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.08)',
            background: phase === 'manual' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
            color: phase === 'manual' ? ACCENT : '#7d7d88',
            fontSize: 10.5,
            letterSpacing: '0.16em',
            fontWeight: 700,
            transition: 'all 0.3s',
          }}
        >
          {phase === 'manual' ? "YOU'RE DRIVING" : 'AUTO'}
        </div>
      </div>

      {/* Rank input + slider */}
      <div style={{ display: 'flex', gap: 22, alignItems: 'stretch', marginBottom: 28, flexWrap: 'wrap' }}>
        <div
          style={{
            flex: '0 0 auto',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '12px 18px',
            minWidth: 220,
            position: 'relative',
          }}
        >
          <div style={{ color: '#5e5e6a', fontSize: 10, letterSpacing: '0.16em', fontWeight: 700, marginBottom: 4 }}>YOUR CRL</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                color: '#f5f5f7',
                fontSize: 28,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                minWidth: 90,
              }}
            >
              {typedRank || <span style={{ opacity: 0.3 }}>0</span>}
            </span>
            {phase === 'intro' && typedRank.length < 4 && (
              <span style={{ display: 'inline-block', width: 2, height: 22, background: ACCENT, animation: 'hero-blink 0.9s steps(2) infinite' }} />
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={PILL}>OPEN</span>
            <span style={PILL}>OS · UP</span>
            <span style={PILL}>JEE Main</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#5e5e6a', letterSpacing: '0.16em', fontWeight: 700, marginBottom: 8 }}>
            <span>DRAG TO EXPLORE</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#9a9aa6' }}>
              1 ───── 50,000
            </span>
          </div>
          <div
            ref={sliderRef}
            onMouseDown={handleSliderInteract}
            onTouchStart={handleSliderInteract}
            style={{
              position: 'relative',
              height: 14,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 999,
              cursor: 'grab',
              touchAction: 'none',
            }}
          >
            {[0.2, 0.4, 0.6, 0.8].map((p) => (
              <span
                key={p}
                style={{ position: 'absolute', left: `${p * 100}%`, top: 4, bottom: 4, width: 1, background: 'rgba(255,255,255,0.08)' }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${sliderPct * 100}%`,
                background: `linear-gradient(90deg, ${ACCENT} 0%, #fbbf24 100%)`,
                borderRadius: 999,
                boxShadow: `0 0 18px ${ACCENT}66`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `calc(${sliderPct * 100}% - 11px)`,
                top: -4,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#fff',
                border: `3px solid ${ACCENT}`,
                boxShadow: `0 4px 14px ${ACCENT}aa, 0 0 0 6px ${ACCENT}22`,
              }}
            />
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9a9aa6', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
              CRL <span style={{ color: '#f5f5f7', fontWeight: 600 }}>{fmtRank(rank)}</span>
              {' · '}
              {percentileFromRank(rank)} percentile
            </span>
            <span
              style={{
                color: showHint && phase === 'autoplay' ? ACCENT : 'transparent',
                fontSize: 11.5,
                fontWeight: 600,
                transition: 'color 0.4s',
                letterSpacing: '0.01em',
              }}
            >
              ↑ grab the slider — try your own rank
            </span>
          </div>
        </div>
      </div>

      {/* Chip surface */}
      <ChipSurface>
        <div style={{ position: 'relative', width: SURFACE_WIDTH, margin: '0 auto', height: SURFACE_HEIGHT }}>
          <ColumnHeader label="SAFE" count={bucketed.SAFE.length} color="#34d399" x={0} width={CHIP_W} />
          <ColumnHeader label="TARGET" count={bucketed.TARGET.length} color="#fbbf24" x={CHIP_W + COL_GAP} width={CHIP_W} />
          <ColumnHeader label="REACH" count={bucketed.REACH.length} color="#7dd3fc" x={2 * (CHIP_W + COL_GAP)} width={CHIP_W} />

          <div
            style={{
              position: 'absolute',
              top: CHIP_HEADER_Y - 14,
              bottom: 0,
              left: CHIP_W + COL_GAP / 2,
              width: 1,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: CHIP_HEADER_Y - 14,
              bottom: 0,
              left: 2 * CHIP_W + COL_GAP + COL_GAP / 2,
              width: 1,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
            }}
          />

          {totalVisible === 0 && (
            <div
              style={{
                position: 'absolute',
                top: CHIP_HEADER_Y + 30,
                left: 0,
                right: 0,
                textAlign: 'center',
                color: '#5e5e6a',
                fontSize: 13,
              }}
            >
              {phase === 'intro' ? 'waiting for rank…' : 'type a rank to see colleges'}
            </div>
          )}

          {[...stableRef.current.entries()].map(([id, st]) => {
            const live = chipPositions.get(id);
            if (live) {
              return (
                <CollegeChip
                  key={id}
                  college={live.college}
                  pos={{ x: live.x, y: live.y }}
                  bucket={live.bucket}
                  pct={live.pct}
                  visible
                />
              );
            }
            return (
              <CollegeChip
                key={id}
                college={st.college}
                pos={{ x: st.x, y: st.y }}
                bucket={st.bucket}
                pct={st.pct}
                visible={false}
              />
            );
          })}
        </div>
      </ChipSurface>

      {/* Footer */}
      <div
        style={{
          marginTop: 22,
          paddingTop: 18,
          borderTop: '1px dashed rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {/* Trust chips — hidden on mobile because <TrustStrip /> rendered just
            below already shows the same data, and on narrow screens the
            duplication eats ~120-150px of scroll before the actual form. */}
        <div
          className="hidden sm:flex"
          style={{ gap: 14, alignItems: 'center', color: '#7d7d88', fontSize: 12, flexWrap: 'wrap' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
            5 yrs counseling data
          </span>
          <span style={{ color: '#3a3a44' }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{totalVisible} colleges visible</span>
          <span style={{ color: '#3a3a44' }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>90% Safe accuracy</span>
        </div>
        <button
          type="button"
          onClick={scrollToRealPredictor}
          style={{
            background: `linear-gradient(180deg, ${ACCENT}, #f97316)`,
            color: '#0a0a0f',
            border: 'none',
            borderRadius: 999,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '-0.005em',
            cursor: 'pointer',
            boxShadow: `0 8px 22px -8px ${ACCENT}aa, 0 1px 0 rgba(255,255,255,0.3) inset`,
          }}
        >
          Try your own rank →
        </button>
      </div>

      <FakeCursor {...cursor} />

      <style>{`
        @keyframes hero-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes hero-livepulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}

const PILL: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  color: '#9a9aa6',
  fontSize: 10.5,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 5,
  letterSpacing: '0.02em',
  border: '1px solid rgba(255,255,255,0.04)',
};

// ── Public component — predictor demo only.
// Backdrop is now rendered by the page so it spans the whole hero (behind
// headline + predictor + trust strip), not just the predictor card.
export default function HeroDemo() {
  return <PredictorDemo />;
}
