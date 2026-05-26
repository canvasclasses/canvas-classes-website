/*
 * Build a deterministic 4-5 question FAQ for a career-spec detail page,
 * driven purely by spec fields. Used both for:
 *
 *   - FAQPage JSON-LD (consumed by Google rich-result rendering)
 *   - The visible "Common questions about this career" section on the page
 *
 * Both must produce identical question text and answer prose — Google
 * explicitly requires schema/page consistency or the rich-result is dropped.
 * Keep this file as the single source.
 */

import type { ICareerSpec, ExposureLevel } from '@canvas/data/models/CareerSpec';

export interface FaqEntry {
  q: string;
  a: string;
}

// We only read these fields, so accept any object that has the relevant
// subset. Lets the helper take either a full ICareerSpec or the SpecLean
// the detail page hands in (which omits audit fields).
type FaqInput = Pick<
  ICareerSpec,
  'display_name' | 'income' | 'educational_path' | 'ai_exposure' | 'cons' | 'adjacent_careers'
>;

const EXPOSURE_PHRASING: Record<ExposureLevel, string> = {
  low: 'low exposure — the work is largely resistant to AI compression',
  moderate: 'moderate exposure — parts of the work are being augmented or partially automated',
  high: 'high exposure — significant portions of the work are being reshaped by AI',
  very_high: 'very high exposure — the work itself is being substantially restructured by AI',
};

const slugToTitle = (slug: string): string =>
  slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');

const formatLpa = (n: number): string => {
  if (n >= 100) return `₹${(n / 100).toFixed(1).replace(/\.0$/, '')} cr`;
  return `₹${n} LPA`;
};

export function buildFaqs(spec: FaqInput): FaqEntry[] {
  const faqs: FaqEntry[] = [];
  const name = spec.display_name;

  // 1. Income — uses year_5 distribution
  if (spec.income?.year_5) {
    const y5 = spec.income.year_5;
    const sourceCount = spec.income.sources?.length ?? 0;
    const sourceClause = sourceCount > 0
      ? ` Numbers reflect ${sourceCount} cited source${sourceCount === 1 ? '' : 's'} last refreshed ${spec.income.last_updated}.`
      : '';
    faqs.push({
      q: `How much does a ${name} earn in India?`,
      a: `At year five, the median ${name} earns around ${formatLpa(y5.median)}, with the 25th percentile at ${formatLpa(y5.p25)} and the 75th percentile at ${formatLpa(y5.p75)}. The distribution widens further at year ten as senior roles diverge from generalist ones.${sourceClause}`,
    });
  }

  // 2. Path in — primary_degrees + time_to_first_real_income
  if (spec.educational_path) {
    const ep = spec.educational_path;
    const degrees = (ep.primary_degrees ?? []).slice(0, 3).join(', ');
    const yrs = ep.time_to_first_real_income;
    if (degrees && typeof yrs === 'number') {
      faqs.push({
        q: `What is the path to becoming a ${name}?`,
        a: `The primary undergraduate route is ${degrees}. Most graduates reach their first meaningful income around ${yrs} year${yrs === 1 ? '' : 's'} after class 12. The full brief covers stretch, realistic, and accessible target colleges plus the minimum-viable path for students who don't reach a top-tier institution.`,
      });
    }
  }

  // 3. AI exposure — 5y horizon + summary
  if (spec.ai_exposure?.horizon_5y) {
    const h5 = spec.ai_exposure.horizon_5y;
    const summary = (spec.ai_exposure.summary ?? '').trim();
    const phrasing = EXPOSURE_PHRASING[h5.level];
    const confidenceClause = h5.confidence
      ? ` (${h5.confidence} confidence)`
      : '';
    const summaryClause = summary ? ` ${summary}` : '';
    faqs.push({
      q: `Is ${name} AI-proof in 2026?`,
      a: `No career is fully AI-proof. Our five-year assessment for ${name} is ${phrasing}${confidenceClause}.${summaryClause}`,
    });
  }

  // 4. Cons — first item only, kept honest
  if (spec.cons && spec.cons.length > 0) {
    const top = spec.cons[0];
    faqs.push({
      q: `What are the downsides of a ${name} career?`,
      a: `${top.issue} ${top.explanation} The full brief lists every downside our editorial team named — we don't publish a career without them.`,
    });
  }

  // 5. Adjacent careers — exits
  if (spec.adjacent_careers && spec.adjacent_careers.length > 0) {
    const list = spec.adjacent_careers
      .slice(0, 3)
      .map((adj) => slugToTitle(adj.career_slug))
      .join(', ');
    faqs.push({
      q: `What are the related careers if ${name} doesn't work out?`,
      a: `Natural pivots include ${list}. Each one shares a meaningful overlap in skills, training, or work texture, so the transition cost is lower than starting over. The full brief explains the specific overlap for each pivot.`,
    });
  }

  return faqs;
}
