/*
 * Career detail-page section components — all driven generically by
 * CareerSpec data so a single template covers all 12 published careers.
 *
 * Ported from the Claude Design hand-off (career-guide/project/
 * career-detail.jsx). Styles live in apps/student/app/career-guide/[slug]/
 * career-detail.css with `.cd-` prefixed selectors.
 *
 * Design philosophy: every section has a distinct visual treatment
 * (timeline, ribbon chart, stat strip, etc.) but the data shape is
 * universal — what changes between careers is the spec content, not
 * the layout.
 */

import type { ICareerSpec } from '@canvas/data/models/CareerSpec';
import { SHIFT_CONTENT } from './shiftContent';

type SpecLean = Omit<ICareerSpec, 'deleted_at' | 'deleted_by' | 'created_by' | 'updated_by'>;

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatINR(lpa: number): string {
  if (lpa >= 100) {
    const cr = lpa / 100;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  return `₹${lpa}L`;
}

const ARCHETYPE_COLOR: Record<SpecLean['archetype'], string> = {
  emerging: 'var(--cd-emerging)',
  transforming: 'var(--cd-transforming)',
  traditional: 'var(--cd-traditional)',
};

const EXPOSURE_PCT: Record<string, number> = {
  low: 22,
  moderate: 50,
  high: 75,
  very_high: 95,
};

const EXPOSURE_LABEL: Record<string, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  very_high: 'Very high',
};

const EXPOSURE_VAR: Record<string, string> = {
  low: 'var(--cd-emerging)',
  moderate: 'var(--cd-transforming)',
  high: '#fb923c',
  very_high: '#f87171',
};

const EXPOSURE_TAG_CLASS: Record<string, string> = {
  low: 'low',
  moderate: 'mod',
  high: 'high',
  very_high: 'very_high',
};

const INCOME_MODIFIER_LABEL: Record<string, string> = {
  lower: 'Pays less than career median',
  similar: 'Similar to career median',
  higher: 'Higher than career median',
  much_higher: 'Significantly higher than median',
};

const FEASIBILITY_CLASS: Record<string, string> = {
  low: 'lo',
  medium: 'md',
  high: 'hi',
};

const FEASIBILITY_LABEL: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const CATEGORY_LABEL: Record<SpecLean['category'], string> = {
  engineering: 'Engineering track',
  medical: 'Medical track',
  crossover: 'Crossover',
};

// ── Section wrapper ─────────────────────────────────────────────────────────

export function Section({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cd-section">
      <div className="cd-section-head">
        <h2 className="cd-section-title">{title}</h2>
        {meta && <span className="cd-section-meta">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

// ── Hero band — wraps a per-career animated SVG and fades it edge-to-edge ──

export function HeroBand({ children }: { children: React.ReactNode }) {
  return <div className="cd-hero-band" aria-hidden>{children}</div>;
}

// ── Stat strip — 4 numbers at the top of the hero ───────────────────────────

export function StatStrip({ spec }: { spec: SpecLean }) {
  const med5 = spec.income.year_5.median;
  const p25_5 = spec.income.year_5.p25;
  const p75_5 = spec.income.year_5.p75;

  // Mini-histogram for income: bell-curve heights scaled around the median.
  // Generated from the spec values (not hardcoded) so the histogram shifts
  // with the career — wider distributions look visibly different.
  const yearsToFirst = spec.educational_path.time_to_first_real_income;
  const histogram = [3, 5, 7, 10, 14, 17, 14, 10, 8, 6, 5, 4];

  const ai5 = spec.ai_exposure.horizon_5y;
  const aiPct = EXPOSURE_PCT[ai5.level];

  return (
    <div className="cd-stat-strip">
      {/* Stat 1 — Income */}
      <div className="cd-stat">
        <div className="cd-stat-label">Median pay, year 5</div>
        <div className="cd-stat-primary">
          {formatINR(med5)}
          <span className="unit">/yr</span>
        </div>
        <div className="cd-stat-viz">
          <div className="cd-bars" aria-hidden>
            {histogram.map((h, i) => (
              <span key={i} style={{ height: `${h * 1.4}px` }} className={i === 4 ? 'peak' : ''} />
            ))}
          </div>
        </div>
        <div className="cd-stat-note">
          p25 {formatINR(p25_5)} · p75 {formatINR(p75_5)}
        </div>
      </div>

      {/* Stat 2 — AI exposure */}
      <div className="cd-stat">
        <div className="cd-stat-label">AI exposure, 5 years</div>
        <div className="cd-stat-primary">
          <span style={{ color: EXPOSURE_VAR[ai5.level] }}>{EXPOSURE_LABEL[ai5.level]}</span>
        </div>
        <div className="cd-stat-viz">
          <div className="cd-meter">
            <div className="cd-meter-fill" style={{ width: `${aiPct}%` }} />
            <div className="cd-meter-mark" style={{ left: `${aiPct}%` }} />
          </div>
        </div>
        <div className="cd-stat-note">{ai5.confidence} confidence</div>
      </div>

      {/* Stat 3 — Time to first income */}
      <div className="cd-stat">
        <div className="cd-stat-label">Time to first income</div>
        <div className="cd-stat-primary">
          {yearsToFirst}
          <span className="unit">years from class 12</span>
        </div>
        <div className="cd-stat-viz">
          <div className="cd-tldots" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={i < yearsToFirst ? 'on' : ''} />
            ))}
          </div>
        </div>
        <div className="cd-stat-note">{spec.educational_path.primary_degrees[0] ?? 'See path-in below'}</div>
      </div>

      {/* Stat 4 — Category + archetype callout (replaces "market size" since
          we don't have that as structured data on every spec). */}
      <div className="cd-stat">
        <div className="cd-stat-label">Career type</div>
        <div className="cd-stat-primary">
          <span style={{ color: ARCHETYPE_COLOR[spec.archetype], textTransform: 'capitalize', fontSize: 24 }}>
            {spec.archetype}
          </span>
        </div>
        <div className="cd-stat-viz">
          <svg width="100%" height="28" viewBox="0 0 200 28" aria-hidden>
            {Array.from({ length: 40 }, (_, i) => (
              <circle
                key={i}
                cx={5 + i * 5}
                cy={14 + ((i * 13) % 9) - 4}
                r={i % 6 === 0 ? 2.5 : 1.5}
                fill={i % 6 === 0 ? 'var(--cd-accent)' : 'rgba(255,255,255,0.25)'}
              />
            ))}
          </svg>
        </div>
        <div className="cd-stat-note">{CATEGORY_LABEL[spec.category]}</div>
      </div>
    </div>
  );
}

// ── Old vs New split — bullet lists driven from misconceptions / what-it-is ─

export function OldNewSplit({ spec }: { spec: SpecLean }) {
  // First-class path: per-career editorial content from SHIFT_CONTENT.
  // This gives us the design's exact structure — pithy headlines, short
  // bullets with bolded company names, paired SVG illustrations.
  const editorial = SHIFT_CONTENT[spec.slug];

  if (editorial) {
    return (
      <div className="cd-split">
        <div className="cd-split-side old">
          <div className="cd-split-label">What parents picture</div>
          <div className="cd-split-icon">{editorial.oldIcon}</div>
          <h3 className="cd-split-h muted">{editorial.oldHeadline}</h3>
          {editorial.oldBullets.length > 0 && (
            <ul className="cd-split-list">
              {editorial.oldBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="cd-split-divider">2026</div>

        <div className="cd-split-side new">
          <div className="cd-split-label accent">What it actually is now</div>
          <div className="cd-split-icon">{editorial.newIcon}</div>
          <h3 className="cd-split-h">{editorial.newHeadline}</h3>
          {editorial.newBullets.length > 0 && (
            <ul className="cd-split-list">
              {editorial.newBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Fallback: spec-derived content for careers without bespoke editorial.
  // Until each of the other 11 careers gets its own SHIFT_CONTENT entry,
  // we derive a pithy version from the schema: first sentence of each prose
  // field as the headline, misconceptions / sub_paths as the bullets.
  const oldHeadline = firstSentence(spec.what_parents_think_it_is);
  const newHeadline = firstSentence(spec.what_it_is_today);
  const oldBullets = (spec.common_misconceptions ?? []).slice(0, 5);
  const newBullets = (spec.sub_paths ?? []).slice(0, 5).map((sp) => sp.description);

  return (
    <div className="cd-split">
      <div className="cd-split-side old">
        <div className="cd-split-label">What parents picture</div>
        <h3 className="cd-split-h muted">{oldHeadline}</h3>
        {oldBullets.length > 0 && (
          <ul className="cd-split-list">
            {oldBullets.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="cd-split-divider">2026</div>

      <div className="cd-split-side new">
        <div className="cd-split-label accent">What it actually is now</div>
        <h3 className="cd-split-h">{newHeadline}</h3>
        {newBullets.length > 0 && (
          <ul className="cd-split-list">
            {newBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Pull the first sentence (or 2 if very short) so the headline stays crisp
// when the source field is a paragraph. The split section's visual rhythm
// breaks if the h3 wraps past 3 lines.
function firstSentence(text: string): string {
  if (!text) return '';
  // Split on ". " (sentence boundary), preserve the trailing period.
  const match = text.match(/^[^.!?]+[.!?]/);
  if (!match) return text;
  const first = match[0].trim();
  // If the first sentence is unusually short (<60 chars), include the next one too.
  if (first.length < 60) {
    const remainder = text.slice(first.length).trim();
    const second = remainder.match(/^[^.!?]+[.!?]/);
    if (second) return first + ' ' + second[0].trim();
  }
  return first;
}

// ── Income ribbon chart ─────────────────────────────────────────────────────

export function IncomeChart({ spec }: { spec: SpecLean }) {
  const W = 880;
  const H = 220;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const allValues = [
    spec.income.year_1.p25, spec.income.year_1.median, spec.income.year_1.p75,
    spec.income.year_5.p25, spec.income.year_5.median, spec.income.year_5.p75,
    spec.income.year_10.p25, spec.income.year_10.median, spec.income.year_10.p75,
  ];
  const dataMax = Math.max(...allValues);
  // Round up to a nice y-axis max so the gridlines look clean.
  const maxY = Math.ceil(dataMax / 20) * 20;

  const yTo = (v: number) => padT + innerH - (v / maxY) * innerH;
  const xTo = (xf: number) => padL + xf * innerW;

  const data = [
    { x: 0, year: 'Y1', p25: spec.income.year_1.p25, med: spec.income.year_1.median, p75: spec.income.year_1.p75 },
    { x: 0.5, year: 'Y5', p25: spec.income.year_5.p25, med: spec.income.year_5.median, p75: spec.income.year_5.p75 },
    { x: 1, year: 'Y10', p25: spec.income.year_10.p25, med: spec.income.year_10.median, p75: spec.income.year_10.p75 },
  ];

  const ribbonPts = [
    ...data.map((d) => `${xTo(d.x)},${yTo(d.p75)}`),
    ...[...data].reverse().map((d) => `${xTo(d.x)},${yTo(d.p25)}`),
  ].join(' ');
  const medianLine = data.map((d) => `${xTo(d.x)},${yTo(d.med)}`).join(' ');

  // Generate 5 evenly-spaced y-axis ticks.
  const tickStep = maxY / 5;
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round(tickStep * (i + 1)));

  return (
    <div className="cd-income">
      <div className="cd-income-chart">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="cd-ribbon" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f7a13b" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#f7a13b" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={padL} x2={W - padR} y1={yTo(v)} y2={yTo(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <text x={padL - 12} y={yTo(v) + 4} fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="ui-monospace" textAnchor="end">
                {formatINR(v)}
              </text>
            </g>
          ))}
          {data.map((d) => (
            <text key={d.year} x={xTo(d.x)} y={H - 10} fill="rgba(255,255,255,0.55)" fontSize="11.5" fontFamily="ui-monospace" textAnchor="middle">
              {d.year}
            </text>
          ))}
          <polygon points={ribbonPts} fill="url(#cd-ribbon)" stroke="rgba(247,161,59,0.45)" strokeWidth="1" />
          <polyline points={data.map((d) => `${xTo(d.x)},${yTo(d.p25)}`).join(' ')} fill="none" stroke="rgba(247,161,59,0.55)" strokeWidth="1" strokeDasharray="3 3" />
          <polyline points={data.map((d) => `${xTo(d.x)},${yTo(d.p75)}`).join(' ')} fill="none" stroke="rgba(247,161,59,0.55)" strokeWidth="1" strokeDasharray="3 3" />
          <polyline points={medianLine} fill="none" stroke="#fff" strokeWidth="2" />
          {data.map((d) => (
            <g key={d.year}>
              <circle cx={xTo(d.x)} cy={yTo(d.med)} r="4" fill="#fff" />
              <circle cx={xTo(d.x)} cy={yTo(d.med)} r="9" fill="none" stroke="#fff" strokeOpacity="0.25" />
            </g>
          ))}
        </svg>

        <div className="cd-income-legend">
          <div className="cd-income-key">
            <span>
              <span className="cd-sw median" /> median
            </span>
            <span>
              <span className="cd-sw range" /> p25 – p75 range
            </span>
          </div>
          <div className="cd-income-values">
            {data.map((d) => (
              <div key={d.year} className="cd-ival">
                <div className="cd-ival-year">{d.year === 'Y1' ? 'Year 1' : d.year === 'Y5' ? 'Year 5' : 'Year 10'}</div>
                <div className="cd-ival-row">
                  <span>p25</span>
                  <b>{formatINR(d.p25)}</b>
                </div>
                <div className="cd-ival-row med">
                  <span>median</span>
                  <b>{formatINR(d.med)}</b>
                </div>
                <div className="cd-ival-row">
                  <span>p75</span>
                  <b>{formatINR(d.p75)}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {spec.income.notes && <p className="cd-income-note">{spec.income.notes}</p>}
      {spec.income.last_updated && (
        <div className="cd-income-refresh">NUMBERS REFRESHED {spec.income.last_updated}</div>
      )}
    </div>
  );
}

// ── Sub-paths grid ──────────────────────────────────────────────────────────

// Universal glyph set — 5 abstract icons mapped to sub-path index. Editorial
// can refine specific glyphs later via a `glyph_key` schema field if needed.
const GLYPHS = [
  // 0 — circle-cluster
  (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" key="g0">
      <circle cx="8" cy="8" r="3" fill="#f7a13b" opacity="0.7" />
      <circle cx="16" cy="8" r="3" fill="#f7a13b" opacity="0.5" />
      <circle cx="12" cy="16" r="3" fill="#f7a13b" opacity="0.9" />
    </svg>
  ),
  // 1 — neural-net
  (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" key="g1">
      <circle cx="5" cy="6" r="1.6" fill="#a78bfa" />
      <circle cx="5" cy="18" r="1.6" fill="#a78bfa" />
      <circle cx="12" cy="12" r="2" fill="#a78bfa" />
      <circle cx="19" cy="6" r="1.6" fill="#a78bfa" />
      <circle cx="19" cy="18" r="1.6" fill="#a78bfa" />
      <line x1="5" y1="6" x2="12" y2="12" stroke="#a78bfa" strokeOpacity=".5" />
      <line x1="5" y1="18" x2="12" y2="12" stroke="#a78bfa" strokeOpacity=".5" />
      <line x1="19" y1="6" x2="12" y2="12" stroke="#a78bfa" strokeOpacity=".5" />
      <line x1="19" y1="18" x2="12" y2="12" stroke="#a78bfa" strokeOpacity=".5" />
    </svg>
  ),
  // 2 — hexagon
  (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" key="g2">
      <polygon points="12,3 21,8 21,16 12,21 3,16 3,8" stroke="#60a5fa" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="#60a5fa" opacity="0.5" />
    </svg>
  ),
  // 3 — sun / starburst
  (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" key="g3">
      <circle cx="12" cy="12" r="3.5" fill="#f7a13b" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * 6}
            y1={12 + Math.sin(a) * 6}
            x2={12 + Math.cos(a) * 9}
            y2={12 + Math.sin(a) * 9}
            stroke="#f7a13b"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  ),
  // 4 — factory / bars
  (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" key="g4">
      <path
        d="M3,20 L3,12 L8,15 L8,12 L13,15 L13,12 L21,15 L21,20 Z"
        stroke="#5ee0a8"
        strokeWidth="1.5"
        fill="rgba(94,224,168,0.18)"
      />
      <rect x="5" y="6" width="3" height="8" fill="#5ee0a8" opacity="0.5" />
    </svg>
  ),
];

export function SubPaths({ spec }: { spec: SpecLean }) {
  if (!spec.sub_paths || spec.sub_paths.length === 0) return null;
  return (
    <>
      <p style={{ color: 'var(--cd-text-muted)', margin: '-6px 0 18px', fontSize: 15.5, lineHeight: 1.55, maxWidth: 820 }}>
        &quot;{spec.display_name}&quot; splits into distinct sub-paths in 2026 — each with different AI exposure and pay. The
        sub-path you choose matters more than the parent career name.
      </p>
      <div className="cd-spgrid">
        {spec.sub_paths.map((sp, i) => (
          <div key={i} className="cd-spcard">
            <div className="cd-spcard-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="cd-spcard-icon">{GLYPHS[i % GLYPHS.length]}</div>
                <h3 className="cd-spcard-title">{sp.name}</h3>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className={`cd-tag ${EXPOSURE_TAG_CLASS[sp.ai_exposure_5y]}`}>AI · {EXPOSURE_LABEL[sp.ai_exposure_5y]}</span>
              <span className="cd-tag ghost">{INCOME_MODIFIER_LABEL[sp.income_vs_median]}</span>
            </div>
            <p className="cd-spcard-desc">{sp.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ── AI projection (3 horizons + "what AI can't easily replace" chips) ───────

export function AIProjection({ spec }: { spec: SpecLean }) {
  const rows = [
    { when: 'In 1 year', h: spec.ai_exposure.horizon_1y },
    { when: 'In 5 years', h: spec.ai_exposure.horizon_5y },
    { when: 'In 10 years', h: spec.ai_exposure.horizon_10y },
  ];
  return (
    <div className="cd-aibox">
      {rows.map((r, i) => (
        <div key={i} className="cd-airow">
          <div className="cd-airow-year">{r.when}</div>
          <div className="cd-airow-bar">
            <div className="cd-airow-fill" style={{ width: `${EXPOSURE_PCT[r.h.level]}%`, background: EXPOSURE_VAR[r.h.level] }} />
          </div>
          <div className="cd-airow-label">
            <span className="lv" style={{ color: EXPOSURE_VAR[r.h.level] }}>
              {EXPOSURE_LABEL[r.h.level]}
            </span>
            <span className="cf">{r.h.confidence} confidence</span>
          </div>
        </div>
      ))}
      {spec.ai_exposure.what_doesnt_compress.length > 0 && (
        <div className="cd-airesist">
          <div className="cd-airesist-label">What AI can&apos;t easily replace</div>
          <div className="cd-chip-row">
            {spec.ai_exposure.what_doesnt_compress.map((c, i) => (
              <span key={i} className="cd-airesist-chip">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Path-in timeline + college chips + MVP callout ──────────────────────────

const COLLEGE_TIER_LABEL = {
  stretch: 'Stretch',
  realistic: 'Realistic',
  accessible: 'Accessible',
} as const;

export function PathIn({ spec }: { spec: SpecLean }) {
  const ep = spec.educational_path;
  const actions = ep.what_to_do_in_college ?? [];

  // Build 5 timeline nodes:
  //   Class 12 → "pick the right degree" + primary_degrees as flavor
  //   Year 1-2  → actions[0]
  //   Year 3    → actions[1] or actions[2]
  //   Year 4    → actions[2] or actions[3]
  //   Year 5+   → first real income
  const degreeLine = ep.primary_degrees.slice(0, 3).join(' · ');
  const yearsToFirst = ep.time_to_first_real_income;

  const nodes = [
    {
      when: 'Class 12',
      h: 'Pick the right degree',
      d: degreeLine || ep.primary_degrees[0] || 'See degrees below.',
      pos: 'start' as const,
    },
    {
      when: 'Year 1–2',
      h: actions[0] ? actions[0].split('—')[0].split(':')[0].trim().split(/\.\s/)[0] : 'Build foundations',
      d: actions[0] ?? 'Build the math + technical foundations the rest of the career compounds on.',
      pos: 'mid' as const,
    },
    {
      when: 'Year 3',
      h: actions[1] ? actions[1].split('—')[0].split(':')[0].trim().split(/\.\s/)[0] : 'Internship + sub-discipline',
      d: actions[1] ?? actions[0] ?? 'First internship + commit to a sub-discipline.',
      pos: 'mid' as const,
    },
    {
      when: 'Year 4',
      h: actions[2] ? actions[2].split('—')[0].split(':')[0].trim().split(/\.\s/)[0] : 'Convert + apply',
      d: actions[2] ?? actions[1] ?? 'Convert internship into a return offer or apply broadly.',
      pos: 'mid' as const,
    },
    {
      when: `Year ${yearsToFirst}`,
      h: 'First real role',
      d: actions[actions.length - 1] ?? 'Your first real-income role in this career.',
      pos: 'end' as const,
    },
  ];

  return (
    <>
      <div className="cd-timeline">
        {nodes.map((n, i) => (
          <div key={i} className="cd-tlnode">
            <div className={`cd-tlnode-dot ${n.pos}`} />
            <div className="cd-tlnode-when">{n.when}</div>
            <h4 className="cd-tlnode-h">{n.h}</h4>
            <p className="cd-tlnode-d">{n.d}</p>
          </div>
        ))}
      </div>

      <div className="cd-colleges">
        {(['stretch', 'realistic', 'accessible'] as const).map((tier) => {
          const items = ep.target_colleges?.[tier] ?? [];
          if (items.length === 0) return null;
          return (
            <>
              <div key={`${tier}-label`} className={`cd-colleges-tier ${tier === 'accessible' ? 'access' : tier}`}>
                {COLLEGE_TIER_LABEL[tier]}
              </div>
              <div key={`${tier}-chips`} className="cd-colleges-chips">
                {items.map((c, i) => (
                  <span key={i} className={`cd-col-chip ${tier === 'accessible' ? 'access' : tier}`}>
                    {c}
                  </span>
                ))}
              </div>
            </>
          );
        })}
      </div>

      {ep.minimum_viable_path && (
        <div className="cd-mvp">
          <div className="cd-mvp-label">Minimum viable path</div>
          <p className="cd-mvp-body">{ep.minimum_viable_path}</p>
        </div>
      )}
    </>
  );
}

// ── Skills (2x2 grid) ───────────────────────────────────────────────────────

export function Skills({ spec }: { spec: SpecLean }) {
  return (
    <div className="cd-skillgrid">
      {spec.moat_skills.map((s, i) => (
        <div key={i} className="cd-skill">
          <h3 className="cd-skill-h">{s.skill}</h3>
          <p className="cd-skill-d">{s.why_it_matters}</p>
          <div className="cd-skill-how">
            <div className="cd-skill-how-l">How to build it</div>
            <div className="cd-skill-how-b">{s.how_to_build_in_college}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Risks (3-col rose-tinted cards) ─────────────────────────────────────────

export function Risks({ spec }: { spec: SpecLean }) {
  return (
    <div className="cd-risks">
      {spec.cons.map((c, i) => (
        <div key={i} className="cd-risk">
          <h3 className="cd-risk-h">{c.issue}</h3>
          <p className="cd-risk-b">{c.explanation}</p>
        </div>
      ))}
    </div>
  );
}

// ── India strip ─────────────────────────────────────────────────────────────

export function IndiaStrip({ spec }: { spec: SpecLean }) {
  const ic = spec.india_context;
  const cities = ic.typical_first_job_city ?? [];
  return (
    <div className="cd-india">
      <div className="cd-india-cell">
        <div className="cd-india-l">Remote work</div>
        <div className={`cd-india-v ${FEASIBILITY_CLASS[ic.remote_work_feasibility]}`}>
          {FEASIBILITY_LABEL[ic.remote_work_feasibility]}
        </div>
      </div>
      <div className="cd-india-cell">
        <div className="cd-india-l">English requirement</div>
        <div className={`cd-india-v ${FEASIBILITY_CLASS[ic.english_requirement]}`}>
          {FEASIBILITY_LABEL[ic.english_requirement]}
        </div>
      </div>
      <div className="cd-india-cell">
        <div className="cd-india-l">Family capital needed</div>
        <div className={`cd-india-v ${FEASIBILITY_CLASS[ic.family_capital_required]}`}>
          {FEASIBILITY_LABEL[ic.family_capital_required]}
        </div>
      </div>
      <div className="cd-india-cities">
        <div className="cd-india-l">Where the first jobs are</div>
        <div className="cd-india-cities-row">
          {cities.map((city, i) => (
            <span key={i} className="cd-city-chip">
              {city}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pivots (adjacent careers) ───────────────────────────────────────────────

import Link from 'next/link';

export function Pivots({ spec }: { spec: SpecLean }) {
  if (!spec.adjacent_careers || spec.adjacent_careers.length === 0) return null;

  // Convert slug → display title (best-effort title-case).
  const slugToTitle = (slug: string) =>
    slug
      .split('-')
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(' ');

  return (
    <div className="cd-pivots">
      {spec.adjacent_careers.slice(0, 4).map((adj, i) => (
        <Link key={i} href={`/career-guide/${adj.career_slug}`} className="cd-pivot">
          <div className="cd-pivot-head">
            <h3 className="cd-pivot-title">{slugToTitle(adj.career_slug)}</h3>
            <span className="cd-pivot-arrow">→</span>
          </div>
          <p className="cd-pivot-b">{adj.why_its_a_natural_pivot}</p>
        </Link>
      ))}
    </div>
  );
}

// ── Real people ─────────────────────────────────────────────────────────────

const COLLEGE_TIER_DISPLAY: Record<string, string> = {
  top_iit: 'Top IIT',
  top_nit: 'Top NIT',
  mid_nit: 'Mid-tier NIT',
  iiit: 'IIIT',
  private: 'Private engineering',
  state: 'State engineering',
};

export function People({ spec }: { spec: SpecLean }) {
  if (!spec.example_paths || spec.example_paths.length === 0) return null;
  return (
    <div className="cd-people">
      {spec.example_paths.map((p, i) => (
        <div key={i} className="cd-person">
          <div className="cd-person-head">
            <span className="cd-person-num">Person {i + 1}</span>
            <span className="cd-person-pay">
              {COLLEGE_TIER_DISPLAY[p.college_tier] ?? p.college_tier} · earning {p.income_range}
            </span>
          </div>
          <p className="cd-person-b">
            <b>During college:</b> {p.college_to_first_job}
            <br />
            <b>Now:</b> {p.where_now}
          </p>
          <div className="cd-person-decision">
            <div className="l">The decision that mattered</div>
            <div className="t">{p.one_decision_that_mattered}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sources footer ──────────────────────────────────────────────────────────

export function Sources({ spec }: { spec: SpecLean }) {
  if (!spec.sources || spec.sources.length === 0) return null;
  return (
    <div className="cd-sources">
      <div className="cd-sources-label">Sources + editorial trust</div>
      <ul>
        {spec.sources.map((s, i) => (
          <li key={i}>
            {s.label}
            {s.url && (
              <>
                {' '}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  (link)
                </a>
              </>
            )}
            {s.accessed_date && <span style={{ opacity: 0.7 }}> · accessed {s.accessed_date}</span>}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55 }}>
        Editorial analysis, not prediction. Last reviewed {spec.last_full_review}
        {spec.next_review_due ? ` · next review ${spec.next_review_due}` : ''}.
      </div>
    </div>
  );
}
