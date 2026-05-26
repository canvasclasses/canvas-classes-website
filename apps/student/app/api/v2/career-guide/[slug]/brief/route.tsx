// PUBLIC: no auth required.
//
// Generates a vertical 1080×1920 PNG of a published CareerSpec — the
// "Parent Brief" surface from the V1 strategy doc. Designed to be shared
// through WhatsApp and family chat groups: parents read it on their phone,
// trust it, and have a real conversation with the student.
//
// Renders 6 sections, mirroring the layout sketched in the V1 plan:
//
//   1. Header band (Canvas logo + Career Brief label + career name + date)
//   2. What this career is in 2026 (one_line + misconception teaser)
//   3. Income reality (year 1 / 5 / 10 with p25 / median / p75)
//   4. AI risk over 10 years (3 horizons with confidence)
//   5. The path (degrees + min-viable-path + time to first income)
//   6. What nobody tells you (cons, top 2)
//   7. Two real examples (anonymised paths)
//   8. Editorial footer with source + URL
//
// Powered by Next.js's built-in `next/og` ImageResponse — same renderer the
// college-predictor share-card uses. No external deps.

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec, type ICareerSpec } from '@canvas/data/models/CareerSpec';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

const limiter = createRateLimiter({ max: 20, windowMs: 60_000 });

// Image shape — vertical / portrait so the brief feels like a phone-native
// document on WhatsApp. 9:16 ratio works in both WhatsApp chat and Status.
const WIDTH = 1080;
const HEIGHT = 1920;

// Format an INR LPA number with ₹ symbol and "L" / "Cr" suffix.
function formatINR(lpa: number): string {
  if (lpa >= 100) {
    const cr = lpa / 100;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  return `₹${lpa}L`;
}

// AI exposure level → visual signal.
const EXPOSURE_COLOR = {
  low:       { bar: '#34D399', label: 'LOW', text: '#6EE7B7' },
  moderate:  { bar: '#FBBF24', label: 'MODERATE', text: '#FDE68A' },
  high:      { bar: '#FB923C', label: 'HIGH', text: '#FED7AA' },
  very_high: { bar: '#FB7185', label: 'VERY HIGH', text: '#FECDD3' },
} as const;

const EXPOSURE_WIDTH = {
  low: '25%',
  moderate: '50%',
  high: '75%',
  very_high: '100%',
} as const;

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const ip = getClientIp(request);
    const rl = limiter.check(ip);
    if (!rl.ok) return new Response('Too many requests', { status: 429 });

    const { slug } = await context.params;
    if (typeof slug !== 'string' || slug.length < 2 || slug.length > 60 || !/^[a-z0-9-]+$/.test(slug)) {
      return new Response('Invalid slug', { status: 400 });
    }

    await connectToDatabase();
    const spec = await CareerSpec.findOne({ slug, status: 'published', deleted_at: null })
      .lean<ICareerSpec | null>();
    if (!spec) return new Response('Career brief not found', { status: 404 });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://canvasclasses.in';

    // Pick the worst-confidence horizon to call out as "What we know" — the
    // 1-year horizon is usually highest confidence, so we render all three but
    // highlight the 5-year (the planning-relevant one) as the headline.
    const aiNow = spec.ai_exposure.horizon_1y;
    const aiMid = spec.ai_exposure.horizon_5y;
    const aiFar = spec.ai_exposure.horizon_10y;

    // Cons: render top 2. The detail page shows all of them; this is a teaser
    // designed to drive curiosity, not exhaustively summarise.
    const topCons = spec.cons.slice(0, 2);

    // Example paths: render top 2 anonymised stories. Same logic — teaser.
    const topExamples = spec.example_paths?.slice(0, 2) ?? [];

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #050505 0%, #0B0F15 100%)',
            color: '#FFFFFF',
            padding: '64px 60px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* ── Section 1: Header band ─────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #F97316, #FBBF24)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0A0A0A',
                  fontWeight: 800,
                  fontSize: 28,
                }}
              >
                C
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>Canvas Classes</span>
                <span style={{ fontSize: 13, color: '#A1A1AA', letterSpacing: '0.08em' }}>
                  CAREER BRIEF · {spec.last_full_review ?? '2026'}
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: 'rgba(249, 115, 22, 0.1)',
                color: '#FB923C',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: 999,
                padding: '6px 14px',
              }}
            >
              {spec.archetype.toUpperCase()}
            </div>
          </div>

          {/* ── Career name + one-liner ────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40 }}>
            <span style={{ fontSize: 16, color: '#A1A1AA', letterSpacing: '0.04em' }}>
              {spec.category === 'engineering' ? 'Engineering track' : spec.category === 'medical' ? 'Medical track' : 'Crossover career'}
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 800,
                marginTop: 6,
                color: '#FFFFFF',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              {spec.display_name}
            </span>
            <span style={{ fontSize: 22, color: '#D4D4D8', marginTop: 16, lineHeight: 1.4 }}>
              {spec.one_line}
            </span>
          </div>

          {/* ── Section 3: Income reality ──────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 36,
              padding: '24px 28px',
              background: '#151E32',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: '#A1A1AA',
              }}
            >
              INCOME — WHAT PEOPLE ACTUALLY EARN
            </span>
            <span style={{ fontSize: 11, color: '#71717A', marginTop: 4, letterSpacing: '0.04em' }}>
              25th percentile · median · 75th percentile · INR per year
            </span>

            {([
              { label: 'Year 1', band: spec.income.year_1 },
              { label: 'Year 5', band: spec.income.year_5 },
              { label: 'Year 10', band: spec.income.year_10 },
            ] as const).map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: i === 0 ? 16 : 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 18, color: '#D4D4D8' }}>{row.label}</span>
                  <span style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.01em' }}>
                    <span style={{ color: '#A1A1AA' }}>{formatINR(row.band.p25)}</span>
                    <span style={{ color: '#FB923C', fontWeight: 800, margin: '0 8px' }}>
                      {formatINR(row.band.median)}
                    </span>
                    <span style={{ color: '#A1A1AA' }}>{formatINR(row.band.p75)}</span>
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 6,
                    height: 6,
                    width: '100%',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      borderRadius: 999,
                      background: 'linear-gradient(90deg, rgba(251,146,60,0.35), rgba(251,191,36,0.6), rgba(251,146,60,0.35))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Section 4: AI risk over 10 years ───────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 24,
              padding: '24px 28px',
              background: '#151E32',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: '#A1A1AA',
              }}
            >
              AI RISK OVER 10 YEARS
            </span>
            {([
              { label: '1 year', h: aiNow },
              { label: '5 years', h: aiMid },
              { label: '10 years', h: aiFar },
            ] as const).map((row, i) => {
              const c = EXPOSURE_COLOR[row.h.level];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginTop: i === 0 ? 16 : 12, gap: 16 }}>
                  <span style={{ fontSize: 16, color: '#D4D4D8', width: 100 }}>{row.label}</span>
                  <div
                    style={{
                      display: 'flex',
                      flex: 1,
                      height: 8,
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.05)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: EXPOSURE_WIDTH[row.h.level],
                        background: c.bar,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: '0.06em', width: 110, textAlign: 'right' }}>
                    {c.label}
                  </span>
                </div>
              );
            })}
            <span style={{ fontSize: 13, color: '#71717A', marginTop: 12, letterSpacing: '0.02em' }}>
              Read these as ranges, not predictions. Where uncertain, the brief says so.
            </span>
          </div>

          {/* ── Section 6: What nobody tells you (cons) ───────────────────── */}
          {topCons.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 24,
                padding: '24px 28px',
                background: 'rgba(244,63,94,0.06)',
                border: '1px solid rgba(244,63,94,0.18)',
                borderRadius: 18,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: '#FB7185',
                }}
              >
                WHAT NOBODY TELLS YOU
              </span>
              {topCons.map((c, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', marginTop: i === 0 ? 14 : 12 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#FECDD3' }}>{c.issue}</span>
                  <span style={{ fontSize: 14, color: '#D4D4D8', marginTop: 4, lineHeight: 1.4 }}>{c.explanation}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Section 7: Two real examples ──────────────────────────────── */}
          {topExamples.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: '#A1A1AA',
                }}
              >
                REAL PEOPLE WHO TOOK THIS PATH
              </span>
              <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
                {topExamples.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      padding: '18px 20px',
                      background: '#0B0F15',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 16,
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#71717A', letterSpacing: '0.12em', fontWeight: 700 }}>
                      PERSON {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: '#D4D4D8', marginTop: 8, lineHeight: 1.4 }}>
                      {ex.where_now}
                    </span>
                    <span style={{ fontSize: 14, color: '#FB923C', marginTop: 8, fontWeight: 700 }}>
                      {ex.income_range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Section 8: Footer ─────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              paddingTop: 28,
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, color: '#71717A' }}>
                This is editorial analysis, not prediction.
              </span>
              <span style={{ fontSize: 13, color: '#52525B', marginTop: 3 }}>
                Read the full brief at the link below — sources cited inside.
              </span>
            </div>
            <span style={{ fontSize: 15, color: '#A1A1AA', fontWeight: 600 }}>
              {baseUrl.replace(/^https?:\/\//, '')}/career-guide/{spec.slug}
            </span>
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        headers: {
          // Cache for 1 hour at the edge. Career specs change quarterly; an
          // hour of staleness on the shared image is fine — and beats hammering
          // the renderer for every WhatsApp recipient.
          'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (err) {
    console.error('Career brief render error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
