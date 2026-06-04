'use client';

// "Know Your Dream Career — A Reality Check"
//
// The honest second act below the cloud. Pick any branch and get a no-filter
// profile: what the day feels like, the myths vs the reality, the work setting,
// personality fit, what you'll study, top recruiters, the salary truth and who
// it's really for. Authored branches show the full card; the rest show a teaser
// + "coming soon" until filled. Controlled by the parent shell so the cloud's
// "See the real picture" button can drive it.

import { useMemo, useState } from 'react';
import { ACCENT, Icons } from '../predictor-design/primitives';
import { BRANCH_PROFILES, BRANCH_ROLES, BRANCH_HUE, OUTLOOK_META } from './branchProfiles';
import { CAREER_REALITY } from './careerReality';

// Simple line illustrations of the work, shown over the watercolor placeholder
// until a real image is supplied. Keyed by branch id; falls back to a briefcase.
const FIELD_ICON: Record<string, (c: string) => React.ReactElement> = {
  cse: (c) => (
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M2 20h20M9.5 9l-2 2 2 2M14.5 9l2 2-2 2" />
    </svg>
  ),
  mechanical: (c) => (
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </svg>
  ),
  cybersecurity: (c) => (
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.2-3 7.4-7 8.5-4-1.1-7-4.3-7-8.5V6z" />
      <circle cx="12" cy="11" r="1.6" />
      <path d="M12 12.6V15" />
    </svg>
  ),
  petroleum: (c) => (
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 21L11 4M18 21L13 4M8.5 12h7M4 21h16" />
      <path d="M11 4l2-1 2 1" />
    </svg>
  ),
  civil: (c) => (
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="9" height="12" />
      <path d="M7 12h.01M10 12h.01M7 15h.01M10 15h.01M13 6h7M20 6v6M16 6l4-2" />
      <path d="M2 21h20" />
    </svg>
  ),
  'bsc-physics': (c) => (
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </svg>
  ),
};

const DEFAULT_ICON = (c: string) => (
  <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
  </svg>
);

const sectionLabel: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.16em',
  color: '#5e5e6a',
  textTransform: 'uppercase',
  marginBottom: 9,
};

function Pills({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map((it) => (
        <span
          key={it}
          style={{
            fontSize: 13,
            color: '#cfcfd6',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '5px 10px',
          }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function Meter({ leftLabel, rightLabel, value, color }: { leftLabel: string; rightLabel: string; value: number; color: string }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.04em',
          color: '#9a9aa6',
          marginBottom: 6,
        }}
      >
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div style={{ position: 'relative', height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)' }}>
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(98, Math.max(2, value))}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 10px ${color}aa`,
            border: '2px solid #0b0e16',
          }}
        />
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={sectionLabel}>{title}</div>
      {children}
    </div>
  );
}

export default function CareerRealitySection({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const authored = useMemo(() => new Set(Object.keys(CAREER_REALITY)), []);
  // Authored branches first in the picker so the live ones are easy to find.
  const ordered = useMemo(
    () => [...BRANCH_PROFILES].sort((a, b) => (authored.has(b.id) ? 1 : 0) - (authored.has(a.id) ? 1 : 0)),
    [authored],
  );

  const branch = BRANCH_PROFILES.find((b) => b.id === selectedId) ?? BRANCH_PROFILES[0];
  const reality = CAREER_REALITY[branch.id];
  const ol = OUTLOOK_META[branch.outlook];
  // Identity colours for the header mesh — the branch hue plus two analogous
  // neighbours so the gradient reads rich rather than flat.
  const hue = BRANCH_HUE[branch.id] ?? 40;
  const hue2 = (hue + 45) % 360;
  const hue3 = (hue + 320) % 360;
  const roles = BRANCH_ROLES[branch.id] ?? [];
  const handoffHref = branch.predictorBranch
    ? `/college-predictor?dream_branch=${encodeURIComponent(branch.predictorBranch)}#predictor`
    : null;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#9a9aa6',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            marginBottom: 16,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT }} />
          REALITY CHECK
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 'clamp(28px, 3.4vw, 46px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: '#f5f5f7',
          }}
        >
          Know Your Dream Career.{' '}
          <span
            style={{
              backgroundImage: `linear-gradient(90deg, ${ACCENT} 0%, #fbbf24 50%, ${ACCENT} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The real picture.
          </span>
        </h2>
        <p style={{ margin: '14px auto 0', maxWidth: 560, color: '#9a9aa6', fontSize: 16, lineHeight: 1.55 }}>
          What a career actually feels like — myths, money, work setting and fit, with the rosy bits stripped out.
        </p>
      </div>

      {/* Picker */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 7,
          justifyContent: 'center',
          maxHeight: 132,
          overflowY: 'auto',
          padding: '14px 8px',
          margin: '22px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {ordered.map((b) => {
          const isAuthored = authored.has(b.id);
          const active = b.id === selectedId;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect(b.id)}
              title={b.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 11px',
                borderRadius: 9,
                border: active ? `1px solid ${ACCENT}80` : '1px solid rgba(255,255,255,0.08)',
                background: active ? `${ACCENT}15` : 'rgba(255,255,255,0.02)',
                color: active ? '#fff' : isAuthored ? '#cfcfd6' : '#6f6f7a',
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: isAuthored ? ACCENT : 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
              {b.name}
              {!isAuthored && (
                <span style={{ fontSize: 8.5, fontFamily: "'JetBrains Mono', monospace", color: '#6f6f7a', letterSpacing: '0.05em' }}>SOON</span>
              )}
            </button>
          );
        })}
      </div>

      {/* The card */}
      <div
        style={{
          background: 'linear-gradient(180deg, #10131c, #0a0c12)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {/* Identity hero — an animated colour mesh built from the branch's hue. */}
        <div className="cr-hero" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(22px, 3vw, 34px)', background: '#0b0e16' }}>
          <div aria-hidden className="cr-blob cr-blob-a" style={{ background: `radial-gradient(circle, hsla(${hue}, 92%, 60%, 0.62), transparent 62%)` }} />
          <div aria-hidden className="cr-blob cr-blob-b" style={{ background: `radial-gradient(circle, hsla(${hue2}, 90%, 60%, 0.55), transparent 62%)` }} />
          <div aria-hidden className="cr-blob cr-blob-c" style={{ background: `radial-gradient(circle, hsla(${hue3}, 88%, 55%, 0.5), transparent 62%)` }} />
          {/* dark gradient for text legibility over the colour */}
          <div
            aria-hidden
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(8,9,14,0.25) 0%, rgba(8,9,14,0.5) 55%, rgba(10,12,18,0.88) 100%)' }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: reality ? 18 : 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.92)' }}>{branch.shortName}</span>
                  {branch.track && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 5, padding: '2px 6px' }}>
                      {branch.track}
                    </span>
                  )}
                </div>
                <h3 style={{ margin: 0, fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.45)' }}>
                  {branch.name}
                </h3>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 11px',
                  borderRadius: 999,
                  background: 'rgba(8,9,14,0.5)',
                  border: `1px solid ${ol.color}88`,
                  color: ol.color,
                  fontSize: 11.5,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              >
                <span>{ol.glyph}</span> {ol.label}
              </span>
            </div>
            {reality && (
              <div
                style={{
                  borderLeft: `3px solid hsl(${hue}, 85%, 66%)`,
                  background: 'rgba(10,12,18,0.42)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  borderRadius: '0 12px 12px 0',
                  padding: '14px 18px',
                  color: '#fff',
                  fontSize: 'clamp(16px, 1.6vw, 19px)',
                  fontWeight: 500,
                  lineHeight: 1.45,
                  textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                }}
              >
                {reality.hook}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
        {reality ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(20px, 3vw, 36px)' }}>
              {/* LEFT column */}
              <div>
                <Block title="A day in the life">
                  <p style={{ margin: 0, color: '#cfcfd6', fontSize: 16.5, lineHeight: 1.6 }}>{reality.dayInLife}</p>
                </Block>

                <Block title="Myth vs reality">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {reality.myths.map((m) => (
                      <div key={m.myth}>
                        <div style={{ display: 'flex', gap: 8, color: '#9a9aa6', fontSize: 15, lineHeight: 1.45, marginBottom: 4 }}>
                          <span style={{ color: '#f87171', fontWeight: 800, flexShrink: 0 }}>✗</span>
                          <span style={{ textDecoration: 'line-through', textDecorationColor: 'rgba(248,113,113,0.5)' }}>{m.myth}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, color: '#e2e2e8', fontSize: 15.5, lineHeight: 1.5 }}>
                          <span style={{ color: '#34d399', fontWeight: 800, flexShrink: 0 }}>✓</span>
                          <span>{m.reality}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Block>

                <Block title="The work, pictured">
                  {reality.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={reality.image}
                      alt={`A professional working in ${branch.name}`}
                      style={{ width: '100%', height: 'clamp(220px, 28vw, 300px)', objectFit: 'cover', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'relative',
                        height: 'clamp(220px, 28vw, 300px)',
                        borderRadius: 14,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: `radial-gradient(58% 64% at 26% 30%, hsla(${hue},72%,55%,0.5), transparent 62%), radial-gradient(54% 60% at 80% 72%, hsla(${hue2},66%,55%,0.42), transparent 62%), radial-gradient(50% 56% at 62% 18%, hsla(${hue3},62%,55%,0.36), transparent 62%), linear-gradient(180deg, #0c0f17, #0a0c12)`,
                      }}
                    >
                      {/* soft watercolor bleed */}
                      <div aria-hidden style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)' }} />
                      {/* field icon */}
                      <div aria-hidden style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(FIELD_ICON[branch.id] ?? DEFAULT_ICON)('rgba(255,255,255,0.55)')}
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 10,
                          left: 12,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9.5,
                          letterSpacing: '0.1em',
                          color: 'rgba(255,255,255,0.55)',
                          textTransform: 'uppercase',
                        }}
                      >
                        Illustration coming
                      </div>
                    </div>
                  )}
                </Block>
              </div>

              {/* RIGHT column */}
              <div>
                <Block title="The vibe">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <Meter leftLabel="Desk / remote" rightLabel="Field / site" value={reality.workSetting} color={ACCENT} />
                      <p style={{ margin: '7px 0 0', color: '#9a9aa6', fontSize: 13, lineHeight: 1.45 }}>{reality.workSettingNote}</p>
                    </div>
                    <div>
                      <Meter leftLabel="Introvert / solo" rightLabel="Extrovert / people" value={reality.social} color="#a78bfa" />
                      <p style={{ margin: '7px 0 0', color: '#9a9aa6', fontSize: 13, lineHeight: 1.45 }}>{reality.socialNote}</p>
                    </div>
                    <div>
                      <div style={{ color: '#9a9aa6', fontSize: 12.5, marginBottom: 7 }}>What makes you excel here:</div>
                      <Pills items={reality.excelQualities} />
                    </div>
                  </div>
                </Block>

                <Block title="The numbers, honestly">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ color: '#cfcfd6', fontSize: 15.5, lineHeight: 1.5 }}>
                      <span style={{ color: '#7d7d88' }}>Pay: </span>
                      {reality.salaryReality}
                    </div>
                    <div style={{ color: '#cfcfd6', fontSize: 15.5, lineHeight: 1.5 }}>
                      <span style={{ color: '#7d7d88' }}>Higher studies: </span>
                      {reality.higherStudies}
                    </div>
                    <div style={{ color: '#cfcfd6', fontSize: 15.5, lineHeight: 1.5 }}>
                      <span style={{ color: '#7d7d88' }}>Outlook: </span>
                      <span style={{ color: ol.color, fontWeight: 600 }}>{ol.label}</span> — {branch.outlookNote}
                    </div>
                  </div>
                </Block>

                <Block title="Top recruiters">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9aa6', fontSize: 11.5, marginBottom: 7 }}>
                        <span>🇮🇳</span> In India — where most students land
                      </div>
                      <Pills items={reality.indianRecruiters} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9a9aa6', fontSize: 11.5, marginBottom: 7 }}>
                        <span>🌐</span> Global — also hire (tougher to crack)
                      </div>
                      <Pills items={reality.globalRecruiters} />
                    </div>
                  </div>
                </Block>

                <Block title="What you'll study">
                  <Pills items={reality.subjects} />
                </Block>
              </div>
            </div>

            {/* Is this you? */}
            <div style={{ marginTop: 8 }}>
              <div style={sectionLabel}>Is this you?</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.25)' }}>
                  <div style={{ color: '#34d399', fontSize: 11.5, fontWeight: 700, marginBottom: 5 }}>✓ Great fit if</div>
                  <div style={{ color: '#dcdce2', fontSize: 15, lineHeight: 1.5 }}>{reality.fitFor}</div>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.25)' }}>
                  <div style={{ color: '#f87171', fontSize: 11.5, fontWeight: 700, marginBottom: 5 }}>✗ Probably not if</div>
                  <div style={{ color: '#dcdce2', fontSize: 15, lineHeight: 1.5 }}>{reality.notFor}</div>
                </div>
              </div>
            </div>

            {handoffHref && (
              <div style={{ marginTop: 22 }}>
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
              </div>
            )}
          </>
        ) : (
          /* coming-soon teaser using existing data */
          <div>
            <p style={{ margin: '0 0 18px', color: '#cfcfd6', fontSize: 17, lineHeight: 1.6 }}>{branch.plainLine}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 22 }}>
              <Block title="Where it leads">
                <Pills items={roles} />
              </Block>
              <Block title="AI-era outlook">
                <p style={{ margin: 0, color: '#cfcfd6', fontSize: 15.5, lineHeight: 1.55 }}>{branch.outlookNote}</p>
              </Block>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 12,
                background: `${ACCENT}0c`,
                border: `1px solid ${ACCENT}33`,
                color: '#cfcfd6',
                fontSize: 15,
              }}
            >
              {Icons.bolt(ACCENT)}
              The full reality check for {branch.name} is coming soon — we&apos;re writing these one honest branch at a time.
            </div>
          </div>
        )}
        </div>
      </div>

      <style>{`
        .cr-blob {
          position: absolute;
          width: 55%;
          height: 240%;
          border-radius: 50%;
          filter: blur(46px);
          pointer-events: none;
        }
        .cr-blob-a { top: -70%; left: -8%; animation: crBlobA 15s ease-in-out infinite; }
        .cr-blob-b { top: -90%; right: -6%; animation: crBlobB 19s ease-in-out infinite; }
        .cr-blob-c { top: -45%; left: 36%; animation: crBlobC 17s ease-in-out infinite; }
        @keyframes crBlobA { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10%, 8%) scale(1.12); } }
        @keyframes crBlobB { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-8%, 6%) scale(1.1); } }
        @keyframes crBlobC { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(6%, -7%) scale(1.14); } }
        @media (prefers-reduced-motion: reduce) { .cr-blob { animation: none; } }
      `}</style>
    </div>
  );
}
