// PUBLIC: no auth required. Generates a square PNG image (1080×1080) of the
// top-5 prediction results, designed for WhatsApp / Instagram sharing.
// Parents and counsellors in tier-2/3 cities consume info via WhatsApp; this
// is the lowest-friction way to push the predictor into their hands.
//
// Powered by Next.js's built-in `next/og` ImageResponse (no extra deps). The
// route accepts the same prediction inputs as /predict and re-runs the engine
// server-side so the share image always reflects fresh data — no risk of a
// stale cached client computing the wrong numbers.

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { predictColleges } from '@/features/college-predictor/lib/predictor';
import { predictBitsat } from '@/features/college-predictor/bitsat/predictor';
import { resolveEffectiveRank } from '@/features/college-predictor/lib/percentileToRank';
import { parentVerdict, type Bucket } from '@/features/college-predictor/lib/parentVocab';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

// Two tool variants share one renderer. Inputs differ but the visual is the
// same shape (logo / header / 5 cards / footer URL).
const JoSAASchema = z.object({
  tool: z.literal('jeemain'),
  rank: z.coerce.number().int().positive().max(2_000_000).optional(),
  percentile: z.coerce.number().min(0).max(100).optional(),
  // See /predict route — same CRL/CAT semantics. The label rendered on the
  // share-card PNG also adapts ("CRL N" when no conversion, "category rank N
  // — converted from CRL M" when one happened) so parents reading the image
  // see the same translation the UI showed.
  rank_type: z.enum(['CRL', 'CAT']).optional(),
  category: z.enum([
    'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
    'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)',
  ]),
  gender: z.enum(['Gender-Neutral', 'Female-only (including Supernumerary)']),
  home_state: z.string().min(2).max(50),
  year: z.coerce.number().int().min(2016).max(2030).optional(),
}).refine((d) => d.rank !== undefined || d.percentile !== undefined, {
  message: 'rank or percentile required',
});

const BitsatSchema = z.object({
  tool: z.literal('bitsat'),
  score: z.coerce.number().int().min(0).max(450),
  regime: z.enum(['modern', 'legacy']).optional(),
});

const RequestSchema = z.discriminatedUnion('tool', [JoSAASchema, BitsatSchema]);

const limiter = createRateLimiter({ max: 10, windowMs: 60_000 });

interface CardItem {
  title: string;
  subtitle: string;
  bucket: Bucket;
  probability: number;
}

const TONE_COLOR: Record<'green' | 'amber' | 'blue' | 'grey', { bg: string; fg: string; bd: string }> = {
  green: { bg: '#064E3B', fg: '#34D399', bd: '#10B98155' },
  amber: { bg: '#451A03', fg: '#FB923C', bd: '#F9731655' },
  blue:  { bg: '#082F49', fg: '#38BDF8', bd: '#0EA5E955' },
  grey:  { bg: '#18181B', fg: '#A1A1AA', bd: '#52525B55' },
};

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = limiter.check(ip);
    if (!rl.ok) {
      return new Response('Too many requests', { status: 429 });
    }

    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = RequestSchema.safeParse(params);
    if (!parsed.success) {
      return new Response('Invalid input', { status: 400 });
    }
    const input = parsed.data;

    let inputLabel: string;
    let cards: CardItem[] = [];

    if (input.tool === 'jeemain') {
      const targetYear = input.year ?? new Date().getFullYear();
      const resolution = resolveEffectiveRank({
        rank: input.rank,
        percentile: input.percentile,
        rank_type: input.rank_type,
        category: input.category,
        year: targetYear,
      });
      const effRank = resolution.effectiveRank;
      // Label adapts to whether a conversion happened, so the parent reading
      // the PNG sees both the original CRL they typed and the category rank
      // we matched against.
      if (input.category === 'OPEN' || input.category === 'OPEN (PwD)') {
        inputLabel = `CRL ${effRank.toLocaleString('en-IN')}`;
      } else if (resolution.converted) {
        inputLabel = `${input.category} rank ~${effRank.toLocaleString('en-IN')} (from CRL ${resolution.originalCrl!.toLocaleString('en-IN')})`;
      } else {
        inputLabel = `${input.category} rank ${effRank.toLocaleString('en-IN')}`;
      }
      const results = await predictColleges({
        rank: effRank,
        category: input.category,
        gender: input.gender,
        home_state: input.home_state,
        year: targetYear,
        include_unlikely: false,
      });
      // Group by college to avoid 5 rows of the same college's branches.
      const seenColleges = new Set<string>();
      for (const r of results) {
        if (seenColleges.has(r.college_id)) continue;
        seenColleges.add(r.college_id);
        cards.push({
          title: r.college_short_name,
          subtitle: r.branch_name,
          bucket: r.bucket,
          probability: r.probability_pct,
        });
        if (cards.length === 5) break;
      }
    } else {
      const regime = input.regime ?? 'modern';
      inputLabel = `BITSAT ${input.score} / ${regime === 'modern' ? 390 : 450}`;
      const results = await predictBitsat({
        score: input.score,
        regime,
        include_unlikely: false,
      });
      cards = results.slice(0, 5).map((r) => ({
        title: `BITS ${r.campus_name}`,
        subtitle: r.programme_name,
        bucket: r.bucket,
        probability: r.probability_pct,
      }));
    }

    if (cards.length === 0) {
      // Use a placeholder card so the render doesn't fail.
      cards.push({
        title: 'No matches yet',
        subtitle: 'Try a different filter combination',
        bucket: 'unlikely',
        probability: 0,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://canvasclasses.com';

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
            padding: '60px 56px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
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
                <span style={{ fontSize: 14, color: '#A1A1AA', letterSpacing: '0.06em' }}>
                  COLLEGE PREDICTOR
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: 'rgba(249, 115, 22, 0.1)',
                color: '#FB923C',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: 999,
                padding: '6px 14px',
              }}
            >
              {input.tool === 'bitsat' ? 'BITSAT 2026' : 'JEE MAIN 2026'}
            </div>
          </div>

          {/* Input headline */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 38 }}>
            <span style={{ fontSize: 18, color: '#A1A1AA' }}>Predicted top colleges for</span>
            <span style={{ fontSize: 52, fontWeight: 800, marginTop: 4, color: '#FFFFFF' }}>
              {inputLabel}
            </span>
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 }}>
            {cards.map((c, i) => {
              const v = parentVerdict(c.bucket, c.probability);
              const tone = TONE_COLOR[v.tone];
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '18px 22px',
                    background: '#151E32',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#A1A1AA',
                      marginRight: 18,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF' }}>{c.title}</span>
                    <span style={{ fontSize: 18, color: '#A1A1AA', marginTop: 2 }}>{c.subtitle}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginLeft: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        background: tone.bg,
                        color: tone.fg,
                        border: `1px solid ${tone.bd}`,
                        borderRadius: 999,
                        padding: '4px 12px',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {v.short}
                    </div>
                    <span style={{ fontSize: 26, fontWeight: 800, color: '#FB923C' }}>{c.probability}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              paddingTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span style={{ fontSize: 16, color: '#71717A' }}>
              Built on 5 years of {input.tool === 'bitsat' ? 'BITS' : 'JoSAA'} cutoff data · no ads, no spam
            </span>
            <span style={{ fontSize: 16, color: '#A1A1AA', fontWeight: 600 }}>
              {baseUrl.replace(/^https?:\/\//, '')}/college-predictor
            </span>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
        headers: {
          // Cache the image for 5 min — same prediction inputs should hit a CDN cache.
          'Cache-Control': 'public, max-age=300, s-maxage=300',
        },
      },
    );
  } catch (err) {
    console.error('Share-card render error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
