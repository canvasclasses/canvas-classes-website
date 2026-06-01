// Static mobile counterpart to HeroDemo. Renders the same visual story
// (one Safe / one Target / one Reach result mirroring the real predictor
// output) but with zero animation, zero rAF, zero scaled-transform — so it
// stays smooth on mobile Safari/Chrome where the animated demo stuttered
// and its cursor desynced from the slider. The "Try your own rank" pill
// scrolls to #predictor, matching the desktop CTA.

'use client';

const ACCENT = '#f59e0b';

// Three illustrative rows — one per bucket. Numbers match the COLLEGES table
// in HeroDemo so the implied math (CRL 10,181 → these buckets) is honest.
const ROWS = [
  {
    bucket: 'SAFE' as const,
    inst: 'NIT Durgapur',
    branch: 'Computer Science',
    pct: 92,
    state: 'West Bengal',
    nirf: 41,
  },
  {
    bucket: 'TARGET' as const,
    inst: 'MNNIT Allahabad',
    branch: 'Computer Science',
    pct: 54,
    state: 'Uttar Pradesh',
    nirf: 56,
  },
  {
    bucket: 'REACH' as const,
    inst: 'IIIT Hyderabad',
    branch: 'Computer Science',
    pct: 13,
    state: 'Telangana',
    nirf: 47,
  },
];

const PALETTE = {
  SAFE:   { fg: '#34d399', bg: 'rgba(16,185,129,0.10)', border: 'rgba(52,211,153,0.45)' },
  TARGET: { fg: '#fbbf24', bg: 'rgba(245,158,11,0.10)', border: 'rgba(251,191,36,0.45)' },
  REACH:  { fg: '#7dd3fc', bg: 'rgba(56,189,248,0.10)', border: 'rgba(125,211,252,0.45)' },
} as const;

function scrollToPredictor() {
  const el = document.getElementById('predictor');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function HeroPreviewMobile() {
  return (
    <div
      className="mx-auto"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        marginTop: 28,
        background: 'linear-gradient(180deg, rgba(20,22,34,0.9), rgba(12,13,22,0.95))',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 18,
        padding: 16,
        boxShadow: '0 30px 80px -40px rgba(0,0,0,0.7)',
      }}
    >
      {/* Header row — LIVE PREDICTOR chip + dataset label, same eyebrow style
          as HeroDemo so the mobile and desktop versions feel like the same
          tool, just frozen on mobile. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            color: '#fb7185',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#fb7185',
              boxShadow: '0 0 8px #fb7185',
            }}
          />
          PREVIEW
        </span>
        <span
          style={{
            color: '#5e5e6a',
            fontSize: 10,
            letterSpacing: '0.08em',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          JoSAA + BITSAT 2021–2025
        </span>
      </div>

      {/* User-input chip — mirrors HeroDemo's left card. */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            color: '#9a9aa6',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          YOUR CRL
        </div>
        <div
          style={{
            color: '#f5f5f7',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginTop: 2,
          }}
        >
          10,181
        </div>
        <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
          {['OPEN', 'OS · UP', 'JEE Main'].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10.5,
                color: '#cfcfd6',
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                letterSpacing: '0.02em',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bucket counts strip — visually communicates the breakdown without a
          chart. */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
        }}
      >
        {(['SAFE', 'TARGET', 'REACH'] as const).map((k) => {
          const p = PALETTE[k];
          return (
            <span
              key={k}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 8,
                background: p.bg,
                border: `1px solid ${p.border}`,
                color: p.fg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{k}</span>
              <span style={{ color: '#cfcfd6', fontWeight: 800 }}>
                {k === 'SAFE' ? 4 : k === 'TARGET' ? 3 : 3}
              </span>
            </span>
          );
        })}
      </div>

      {/* Three sample result rows — same compact-mobile design as the real
          ResultRow component below the form, so the preview previews exactly
          what the user gets. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ROWS.map((r) => {
          const p = PALETTE[r.bucket];
          return (
            <div
              key={r.inst}
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 10,
                alignItems: 'center',
                padding: '10px 14px 12px',
                background: 'linear-gradient(180deg, rgba(20,22,34,0.55), rgba(12,13,22,0.7))',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: p.fg,
                  opacity: 0.55,
                  borderRadius: '0 2px 2px 0',
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      color: '#f5f5f7',
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 14.5,
                      fontWeight: 600,
                      letterSpacing: '-0.012em',
                      lineHeight: 1.2,
                    }}
                  >
                    {r.branch}
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: 5,
                      border: `1px solid ${p.border}`,
                      background: p.bg,
                      color: p.fg,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                    }}
                  >
                    {r.bucket}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 3,
                    color: '#7d7d88',
                    fontSize: 11.5,
                    lineHeight: 1.35,
                  }}
                >
                  <span style={{ color: '#cfcfd6', fontWeight: 500 }}>{r.inst}</span>
                  <span style={{ color: '#3a3a44', margin: '0 5px' }}>·</span>
                  <span>{r.state}</span>
                  <span style={{ color: '#3a3a44', margin: '0 5px' }}>·</span>
                  <span>NIRF #{r.nirf}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 44 }}>
                <div
                  style={{
                    color: ACCENT,
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {r.pct}%
                </div>
                <div
                  style={{
                    color: '#5e5e6a',
                    fontSize: 9,
                    marginTop: 2,
                    letterSpacing: '0.14em',
                    fontWeight: 600,
                  }}
                >
                  CHANCE
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer line — gives the preview honest context, mirrors HeroDemo's
          footer strip. */}
      <div
        style={{
          marginTop: 12,
          color: '#7d7d88',
          fontSize: 10.5,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.02em',
        }}
      >
        sample only · your list is built from your rank
      </div>

      <button
        type="button"
        onClick={scrollToPredictor}
        style={{
          marginTop: 14,
          width: '100%',
          padding: '13px 16px',
          borderRadius: 12,
          background: `linear-gradient(180deg, ${ACCENT}, #f97316)`,
          border: 'none',
          color: '#0a0a0f',
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '-0.005em',
          cursor: 'pointer',
          boxShadow: `0 12px 28px -10px ${ACCENT}aa`,
        }}
      >
        Try your own rank →
      </button>
    </div>
  );
}
