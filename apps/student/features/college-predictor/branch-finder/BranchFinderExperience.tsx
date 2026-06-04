'use client';

// Branch Finder — the interactive "fog clearing" experience.
//
// Left rail: three groups of plain-language signal chips a parent/student taps.
// Right canvas: a scattered cloud of all the programs that starts muted and
// drifting ("the clutter"); as signals are added, the strong fits brighten,
// grow, glow and slide up into a tighter cluster while the rest sink, dim and
// stay scattered behind ("the clarity"). Clicking any card expands it into a
// detail modal — what it is, why it surfaced, its AI-era outlook and where it
// leads (career roles), with a handoff into the college predictor.
//
// All matching is pure tag-scoring from ./scoring — no API, fully client-side.

import { useEffect, useMemo, useRef, useState } from 'react';
import { ACCENT, Icons } from '../predictor-design/primitives';
import {
  BRANCH_PROFILES,
  BRANCH_ROLES,
  BRANCH_HUE,
  OUTLOOK_META,
  SUBJECT_SIGNALS,
  TRAIT_SIGNALS,
  VISION_SIGNALS,
  SignalFamily,
  SubjectKey,
  TraitKey,
  VisionKey,
  OutlookBucket,
} from './branchProfiles';
import {
  Selection,
  BranchScore,
  scoreAll,
  totalPicks,
  isAmbiguous,
  suggestNextSignals,
  SignalSuggestion,
} from './scoring';

const EMPTY: Selection = { subjects: [], traits: [], vision: [] };

// Scatter geometry. Cells are only a little wider/taller than a card so the
// cloud packs tightly with overlaps.
const CARD_W = 196;
const CELL_W = 208;
const CELL_H = 128;
const NARROW_BREAK = 720;

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Idle (no-pick) ordering — a stable pseudo-shuffle so the cloud looks scattered
// rather than ranked. Maps id → its position in the scattered cloud.
const IDLE_INDEX: Record<string, number> = (() => {
  const order = [...BRANCH_PROFILES.map((b) => b.id)].sort((a, b) => hashStr(a) - hashStr(b));
  return Object.fromEntries(order.map((id, i) => [id, i]));
})();

// Tidy slot for the ACTIVE (picks made) layout — near-grid, ranked, readable.
function slotPos(index: number, cols: number): { x: number; y: number } {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const jx = (hashStr('x' + index) % 36) - 18;
  const jy = (hashStr('y' + index) % 36) - 18;
  return { x: col * CELL_W + jx + 10, y: row * CELL_H + jy + 8 };
}

// Heavy-scatter slot for the IDLE cloud — columns are spread across the FULL
// canvas width (cellW = canvas / cols) so the cloud fans out wide instead of
// bunching left, plus large jitter and a per-column vertical stagger so rows
// don't line up. Bounded so nothing clips off-screen.
function idleSlot(index: number, cols: number, cellW: number, w: number): { x: number; y: number } {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const colStagger = (col % 2) * (CELL_H * 0.42);
  const jx = ((hashStr('jx' + index) % 100) / 100 - 0.5) * Math.min(cellW, CELL_W) * 0.72;
  const jy = ((hashStr('jy' + index) % 100) / 100 - 0.5) * CELL_H * 0.7;
  const x = Math.max(8, Math.min(col * cellW + jx + 14, Math.max(8, w - CARD_W - 8)));
  const y = row * CELL_H + colStagger + jy + 55;
  return { x, y };
}

function chipToggle<T extends string>(arr: T[], key: T): T[] {
  return arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key];
}

// ── Signal chip ───────────────────────────────────────────────────────────────
function SignalChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: 9,
        border: active ? `1px solid ${ACCENT}80` : '1px solid rgba(255,255,255,0.08)',
        background: active ? `${ACCENT}15` : 'rgba(255,255,255,0.02)',
        color: active ? '#fff' : '#cfcfd6',
        fontSize: 12.5,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      {label}
    </button>
  );
}

function RailGroup({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.14em',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 11,
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 8px ${accent}99`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            backgroundImage: `linear-gradient(90deg, ${accent}, ${accent}aa)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{children}</div>
    </div>
  );
}

// ── Card (used in both scatter and narrow grid) ───────────────────────────────
function BranchCard({ s, hasPicks, onOpen }: { s: BranchScore; hasPicks: boolean; onOpen: (id: string) => void }) {
  const hue = BRANCH_HUE[s.branch.id] ?? 40;
  const ol = OUTLOOK_META[s.branch.outlook];
  const band = s.band;
  const matched = hasPicks && band !== 'faded';

  const wash = band === 'strong' ? 0.16 : band === 'maybe' ? 0.1 : band === 'faded' ? 0.04 : 0.08;
  const glowAlpha = band === 'strong' ? 0.42 : band === 'maybe' ? 0.16 : 0;
  const scale = band === 'strong' ? 1.05 : band === 'faded' ? 0.93 : 1;
  const borderColor =
    band === 'strong' ? ACCENT : band === 'maybe' ? `${ACCENT}66` : band === 'faded' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)';
  const restShadow =
    glowAlpha > 0
      ? `0 14px 38px -10px rgba(245,158,11,${glowAlpha}), 0 0 0 1px rgba(245,158,11,${glowAlpha * 0.5})`
      : band === 'faded'
        ? 'none'
        : '0 8px 22px -16px rgba(0,0,0,0.7)';

  // Gentle desynced float — still for faded cards so the background stays calm.
  const seed = hashStr(s.branch.id);
  const floatDuration = 7 + (seed % 6) * 1.1; // 7.0–12.5s — slow, dreamy drift
  const floatDelay = -((seed % 7) * 1.4); // desync start so the cloud never pulses in unison
  const floats = band !== 'faded';

  const subtitle =
    band === 'strong' && s.reasons.length > 0
      ? `Strong on ${s.reasons.slice(0, 2).join(', ')}${s.matchedCount > 2 ? ` +${s.matchedCount - 2} more` : ''}`
      : null;

  return (
    <div
      className={floats ? 'bf-float' : undefined}
      style={{ animationDuration: `${floatDuration}s`, animationDelay: `${floatDelay}s` }}
    >
      <button
        type="button"
        onClick={() => onOpen(s.branch.id)}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = `scale(${scale}) translateY(-4px)`;
          el.style.boxShadow = `0 22px 48px -12px rgba(245,158,11,${Math.max(0.4, glowAlpha)}), 0 0 0 1px ${ACCENT}88`;
          el.style.borderColor = ACCENT;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = `scale(${scale})`;
          el.style.boxShadow = restShadow;
          el.style.borderColor = borderColor;
        }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          textAlign: 'left',
          padding: '13px 13px 14px',
          borderRadius: 14,
          border: `1px solid ${borderColor}`,
          background: `linear-gradient(155deg, hsla(${hue}, 70%, 55%, ${wash}) 0%, #0b0e16 64%)`,
          transform: `scale(${scale})`,
          boxShadow: restShadow,
          transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease',
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          minHeight: 84,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span
              title={ol.label}
              style={{ width: 7, height: 7, borderRadius: '50%', background: ol.color, flexShrink: 0, opacity: band === 'faded' ? 0.6 : 1 }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: band === 'strong' ? `hsl(${hue}, 80%, 72%)` : '#7d7d88',
              }}
            >
              {s.branch.shortName}
            </span>
            {s.branch.track && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  fontWeight: 600,
                  color: '#9a9aa6',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 5,
                  padding: '1px 4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.branch.track}
              </span>
            )}
          </span>
          {matched && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: band === 'strong' ? ACCENT : '#9a9aa6',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {s.pct}%
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
            color: band === 'faded' ? '#8a8a94' : '#f5f5f7',
          }}
        >
          {s.branch.name}
        </div>

        {subtitle && <div style={{ color: '#9a9aa6', fontSize: 10.5, lineHeight: 1.35 }}>{subtitle}</div>}

        {/* match-strength bar along the bottom edge */}
        {matched && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(255,255,255,0.04)' }}>
            <div
              style={{
                width: `${s.pct}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${ACCENT}, #fbbf24)`,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        )}
      </button>
    </div>
  );
}

// ── Expand modal ──────────────────────────────────────────────────────────────
function BranchModal({
  s,
  hasPicks,
  onClose,
  onSeeReality,
}: {
  s: BranchScore;
  hasPicks: boolean;
  onClose: () => void;
  onSeeReality?: (id: string) => void;
}) {
  const ol = OUTLOOK_META[s.branch.outlook];
  const roles = BRANCH_ROLES[s.branch.id] ?? [];
  const matched = hasPicks && s.matchedCount > 0;
  const handoffHref = s.branch.predictorBranch
    ? `/college-predictor?dream_branch=${encodeURIComponent(s.branch.predictorBranch)}#predictor`
    : null;

  const sectionLabel: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.16em',
    color: '#5e5e6a',
    textTransform: 'uppercase',
    marginBottom: 8,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(4,4,9,0.74)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        animation: 'bfFade 0.18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative',
          width: 'min(560px, 100%)',
          maxHeight: '86vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #10131c, #0a0c12)',
          border: `1px solid ${ACCENT}55`,
          borderRadius: 20,
          boxShadow: `0 30px 90px -20px rgba(245,158,11,0.4), 0 0 0 1px ${ACCENT}22`,
          padding: '26px 26px 24px',
          animation: 'bfPop 0.2s cubic-bezier(.22,.61,.36,1)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 30,
            height: 30,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#cfcfd6',
            fontSize: 16,
            lineHeight: 1,
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: ACCENT,
            }}
          >
            {s.branch.shortName}
          </span>
          {s.branch.track && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                fontWeight: 600,
                color: '#9a9aa6',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 5,
                padding: '2px 6px',
              }}
            >
              {s.branch.track}
            </span>
          )}
        </div>

        <h3
          style={{
            margin: '0 0 12px',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: '#f5f5f7',
            paddingRight: 30,
          }}
        >
          {s.branch.name}
        </h3>

        <p style={{ margin: '0 0 20px', color: '#b8b8c0', fontSize: 14, lineHeight: 1.55 }}>{s.branch.plainLine}</p>

        <div style={{ marginBottom: 18 }}>
          <div style={sectionLabel}>Why it surfaced</div>
          {hasPicks ? (
            matched ? (
              <div style={{ color: '#cfcfd6', fontSize: 13.5, lineHeight: 1.5 }}>
                <span style={{ color: ACCENT, fontWeight: 700 }}>{s.pct}% match</span> — strong on{' '}
                {s.reasons.join(', ')}.
              </div>
            ) : (
              <div style={{ color: '#9a9aa6', fontSize: 13.5, lineHeight: 1.5 }}>
                Not a strong fit for the interests picked so far.
              </div>
            )
          ) : (
            <div style={{ color: '#9a9aa6', fontSize: 13.5, lineHeight: 1.5 }}>
              Select some interests on the left to see how strongly this fits.
            </div>
          )}
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={sectionLabel}>AI-era outlook</div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              padding: '11px 13px',
              borderRadius: 12,
              background: `${ol.color}10`,
              border: `1px solid ${ol.color}33`,
            }}
          >
            <span style={{ color: ol.color, fontWeight: 800, fontSize: 13, lineHeight: 1.4 }}>{ol.glyph}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: ol.color, fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{ol.label}</div>
              <div style={{ color: '#cfcfd6', fontSize: 12.5, lineHeight: 1.5 }}>{s.branch.outlookNote}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: handoffHref ? 22 : 4 }}>
          <div style={sectionLabel}>Where it leads</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roles.map((r) => (
              <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e2e2e8', fontSize: 13.5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {onSeeReality && (
            <button
              type="button"
              onClick={() => onSeeReality(s.branch.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 18px',
                borderRadius: 999,
                background: 'transparent',
                border: `1px solid ${ACCENT}88`,
                color: ACCENT,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              See the real picture {Icons.arrow(ACCENT)}
            </button>
          )}
          {handoffHref && (
            <a
              href={handoffHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 18px',
                borderRadius: 999,
                background: 'linear-gradient(to right, #f97316, #f59e0b)',
                color: '#000',
                fontSize: 13.5,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              See which colleges you can get {Icons.arrow('#000')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main experience ───────────────────────────────────────────────────────────
export default function BranchFinderExperience({ onSeeReality }: { onSeeReality?: (id: string) => void }) {
  const [sel, setSel] = useState<Selection>(EMPTY);
  const [openId, setOpenId] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Measure the canvas column so the scatter is responsive.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Close modal on Escape.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId]);

  const scored = useMemo(() => scoreAll(sel), [sel]);
  const picks = totalPicks(sel);
  const hasPicks = picks > 0;

  const rankIndex = useMemo(() => {
    const m: Record<string, number> = {};
    scored.forEach((s, i) => (m[s.branch.id] = i));
    return m;
  }, [scored]);

  const strongCount = scored.filter((s) => s.band === 'strong').length;
  const ambiguous = useMemo(() => (hasPicks ? isAmbiguous(scored) : false), [hasPicks, scored]);
  const suggestions: SignalSuggestion[] = useMemo(
    () => (ambiguous ? suggestNextSignals(sel, scored) : []),
    [ambiguous, sel, scored],
  );

  const effWidth = width || 1000;
  const narrow = effWidth < NARROW_BREAK;
  const cols = Math.max(2, Math.floor(effWidth / CELL_W));
  const rows = Math.ceil(scored.length / cols);
  // Idle columns fan out across the full canvas width so the cloud uses the
  // whole space instead of bunching to the left.
  const idleCellW = effWidth / cols;
  // Idle cloud needs extra room for the stagger + heavy jitter; active layout is tighter.
  const canvasHeight = rows * CELL_H + (hasPicks ? 70 : CELL_H * 0.5 + 120);

  const addSignal = (family: SignalFamily, key: string) => {
    setSel((prev) => {
      if (family === 'subjects') return { ...prev, subjects: chipToggle(prev.subjects, key as SubjectKey) };
      if (family === 'traits') return { ...prev, traits: chipToggle(prev.traits, key as TraitKey) };
      return { ...prev, vision: chipToggle(prev.vision, key as VisionKey) };
    });
  };

  const statusLine = (() => {
    if (!hasPicks) return 'Start picking what the student enjoys — the fog lifts as you go.';
    if (picks === 1) return 'Good start — add one or two more and the picture sharpens.';
    if (strongCount === 0) return 'No strong matches yet — try adding a dream or a favourite subject.';
    if (strongCount === 1) return "1 strong match — the picture's getting clear.";
    return `${strongCount} branches are standing out — the brighter the card, the better the fit.`;
  })();

  const openScore = openId ? scored.find((s) => s.branch.id === openId) ?? null : null;

  return (
    <div style={{ maxWidth: 1680, margin: '0 auto', padding: '0 20px' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 320px) minmax(0, 1fr)', gap: 22, alignItems: 'start' }}
        className="bf-grid"
      >
        {/* ── Left rail ──────────────────────────────────────────────────────── */}
        <aside
          style={{
            position: 'sticky',
            top: 16,
            maxHeight: 'calc(100vh - 32px)',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, rgba(20,22,34,0.6), rgba(12,13,22,0.55))',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18,
            padding: '20px 18px',
          }}
          className="bf-rail"
        >
          <RailGroup title="What are they good at / drawn to?" accent="#fbbf24">
            {SUBJECT_SIGNALS.map((sig) => (
              <SignalChip key={sig.key} label={sig.label} active={sel.subjects.includes(sig.key)} onClick={() => addSignal('subjects', sig.key)} />
            ))}
          </RailGroup>
          <RailGroup title="What do they love doing?" accent="#38bdf8">
            {TRAIT_SIGNALS.map((sig) => (
              <SignalChip key={sig.key} label={sig.label} active={sel.traits.includes(sig.key)} onClick={() => addSignal('traits', sig.key)} />
            ))}
          </RailGroup>
          <RailGroup title="What's the dream for the future?" accent="#a78bfa">
            {VISION_SIGNALS.map((sig) => (
              <SignalChip key={sig.key} label={sig.label} active={sel.vision.includes(sig.key)} onClick={() => addSignal('vision', sig.key)} />
            ))}
          </RailGroup>

          {hasPicks && (
            <button
              type="button"
              onClick={() => setSel(EMPTY)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: '#9a9aa6',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {Icons.refresh('#9a9aa6')} Start over
            </button>
          )}
        </aside>

        {/* ── Right canvas ───────────────────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, minHeight: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
            <span style={{ color: '#cfcfd6', fontSize: 13.5, lineHeight: 1.45 }}>{statusLine}</span>
          </div>

          {/* Future-outlook legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 14px', marginBottom: 14 }}>
            <span
              style={{
                color: '#5e5e6a',
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.14em',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
              }}
            >
              AI-era outlook
            </span>
            {(['booming', 'resilient', 'evolving', 'caution'] as OutlookBucket[]).map((k) => {
              const m = OUTLOOK_META[k];
              return (
                <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600, color: '#9a9aa6' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />
                  {m.label}
                </span>
              );
            })}
          </div>

          {/* "We need a little more" nudge */}
          {ambiguous && suggestions.length > 0 && (
            <div style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 14, border: `1px solid ${ACCENT}33`, background: `${ACCENT}0c` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                {Icons.bolt(ACCENT)}
                <span style={{ color: '#f5f5f7', fontSize: 13, fontWeight: 600 }}>One more thing — which sounds more like the student?</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {suggestions.map((sug) => (
                  <SignalChip key={`${sug.family}-${sug.key}`} label={sug.label} active={false} onClick={() => addSignal(sug.family, sug.key)} />
                ))}
              </div>
            </div>
          )}

          {/* The cloud */}
          <div ref={canvasRef}>
            {narrow ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {scored.map((s) => (
                  <div key={s.branch.id} style={{ opacity: s.band === 'faded' ? 0.32 : 1, transition: 'opacity 0.4s ease' }}>
                    <BranchCard s={s} hasPicks={hasPicks} onOpen={setOpenId} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ position: 'relative', height: canvasHeight, transition: 'height 0.5s ease' }}>
                {scored.map((s) => {
                  const di = hasPicks ? rankIndex[s.branch.id] : IDLE_INDEX[s.branch.id];
                  const { x, y } = hasPicks ? slotPos(di, cols) : idleSlot(di, cols, idleCellW, effWidth);
                  const opacity = s.band === 'strong' ? 1 : s.band === 'maybe' ? 0.96 : s.band === 'faded' ? 0.2 : 0.62;
                  const z = s.band === 'strong' ? 6 : s.band === 'maybe' ? 4 : s.band === 'faded' ? 1 : 2;
                  return (
                    <div
                      key={s.branch.id}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width: CARD_W,
                        opacity,
                        zIndex: z,
                        transition: 'left 0.6s cubic-bezier(.22,.61,.36,1), top 0.6s cubic-bezier(.22,.61,.36,1), opacity 0.5s ease',
                      }}
                    >
                      <BranchCard s={s} hasPicks={hasPicks} onOpen={setOpenId} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {openScore && (
        <BranchModal
          s={openScore}
          hasPicks={hasPicks}
          onClose={() => setOpenId(null)}
          onSeeReality={
            onSeeReality
              ? (id) => {
                  setOpenId(null);
                  onSeeReality(id);
                }
              : undefined
          }
        />
      )}

      <style>{`
        @media (max-width: 860px) {
          .bf-grid { grid-template-columns: 1fr !important; }
          .bf-rail { position: static !important; max-height: none !important; }
        }
        @keyframes bfFloat {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          25%  { transform: translate(4px, -8px) rotate(0.5deg); }
          50%  { transform: translate(-2px, -12px) rotate(-0.4deg); }
          75%  { transform: translate(-4px, -6px) rotate(0.35deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        .bf-float {
          animation-name: bfFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes bfFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bfPop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .bf-float { animation: none; }
        }
      `}</style>
    </div>
  );
}
