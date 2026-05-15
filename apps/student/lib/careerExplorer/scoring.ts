// Career-fit scoring engine — Phase 1 MVP.
//
// Called after a student completes the questionnaire. Runs three passes
// (hard filter → weighted score → bucket assignment) over every active
// CareerPath and returns an ordered list of matches. The output is stored
// as CareerMatch documents so admins can override buckets.
//
// This is deliberately simple; we will tune weights once real students use it.

import type { ICareerPath } from '@/lib/models/CareerPath';
import type { ICareerProfile } from '@/lib/models/CareerProfile';
import type { IMatchBreakdown, MatchBucket } from '@/lib/models/CareerMatch';

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

// ── normalisation helpers ────────────────────────────────────────────────────

/**
 * Map raw scores (which can range widely depending on how many questions feed
 * a facet) to a 0..100 percentile inside the vector itself. We normalise
 * against the max observed value so one facet being over-represented doesn't
 * drown another.
 */
function normaliseVector(v: Record<string, number>): Record<string, number> {
  const values = Object.values(v);
  if (values.length === 0) return {};
  const max = Math.max(...values.map(Math.abs), 1);
  const out: Record<string, number> = {};
  for (const [k, val] of Object.entries(v)) out[k] = (val / max) * 100;
  return out;
}

// ── per-dimension fit functions ──────────────────────────────────────────────

function aptitudeFit(profile: ICareerProfile, career: ICareerPath): number {
  const student = normaliseVector(profile.scores.aptitude || {});
  if (!career.cognitive_styles || career.cognitive_styles.length === 0) return 60;
  const hits = career.cognitive_styles
    .map((facet) => student[facet] ?? 0)
    .filter((v) => v > 0);
  if (hits.length === 0) return 30;
  const avg = hits.reduce((a, b) => a + b, 0) / hits.length;
  return clamp(avg);
}

function interestFit(profile: ICareerProfile, career: ICareerPath): number {
  const student = normaliseVector(profile.scores.interest || {});
  const primary = student[career.riasec_primary] ?? 0;
  const secondary =
    (career.riasec_secondary ?? []).reduce((sum, k) => sum + (student[k] ?? 0), 0) /
    Math.max(1, (career.riasec_secondary ?? []).length);
  return clamp(primary * 0.7 + secondary * 0.3);
}

function workStyleFit(profile: ICareerProfile, career: ICareerPath): number {
  // Compare normalised student preference (-100..+100 after scaling) against
  // career's position on each axis. Penalise the distance.
  const raw = profile.scores.work_style || {};
  // Scale each -2..+2 raw value to -100..+100.
  const s = {
    indoor_outdoor: (raw.indoor_outdoor ?? 0) * 50,
    desk_field: (raw.desk_field ?? 0) * 50,
    solo_team: (raw.solo_team ?? 0) * 50,
    public_facing: (raw.public_facing ?? 0) * 50,
    travel_appetite: (raw.travel_appetite ?? 0) * 50,
  };
  const c = {
    indoor_outdoor: career.indoor_outdoor - 50,            // -50..+50
    desk_field: career.desk_field - 50,
    solo_team: career.solo_team - 50,
    public_facing: (career.public_facing - 3) * 25,        // -50..+50
    travel_appetite:
      career.travel === 'none' ? -75 :
      career.travel === 'occasional' ? -25 :
      career.travel === 'frequent' ? 25 : 75,
  };
  const axes = Object.keys(s) as Array<keyof typeof s>;
  const dist = axes.reduce((acc, k) => acc + Math.abs(s[k] - c[k]), 0) / axes.length;
  return clamp(100 - dist);
}

function valuesFit(profile: ICareerProfile, career: ICareerPath): number {
  const v = normaliseVector(profile.scores.values || {});
  const score =
    (v.financial ?? 0) * 0.01 * avgRange(career.mid_salary_inr_lpa, 50) +
    (v.stability ?? 0) * 0.01 * scaleOneFive(career.job_stability) +
    (v.impact ?? 0) * 0.01 * scaleOneFive(career.impact) +
    (v.prestige ?? 0) * 0.01 * scaleOneFive(career.social_prestige_india) +
    (v.wlb ?? 0) * 0.01 * scaleOneFive(career.work_life_balance) +
    (v.autonomy ?? 0) * 0.01 * scaleOneFive(career.autonomy) +
    (v.creative ?? 0) * 0.01 * scaleOneFive(career.creative_expression);
  // score is roughly bounded by sum of weights (~7 * 100 = 700). Normalise.
  return clamp((score / 7));
}

function futureFit(profile: ICareerProfile, career: ICareerPath): number {
  const f = normaliseVector(profile.scores.future || {});
  const risk = f.risk_emerging ?? 0;
  const unconventional = f.unconventional ?? 0;
  // Students who score low on emerging-risk prefer established careers.
  // Students who score high reward emerging + hidden-gem roles.
  const emerging = (career.emerging_score - 3) * 25; // -50..+50
  const pref = (risk + unconventional) / 2; // 0..100
  // If pref is high, boost for emerging; if low, penalise.
  const alignment = ((pref - 50) * emerging) / 50; // -50..+50
  const trendBoost =
    career.demand_trajectory === 'exploding' ? 15 :
    career.demand_trajectory === 'growing' ? 8 :
    career.demand_trajectory === 'flat' ? 0 : -15;
  const automationPenalty = (career.automation_vulnerability - 3) * 8;
  return clamp(60 + alignment - automationPenalty + trendBoost);
}

function economicFit(profile: ICareerProfile, career: ICareerPath): number {
  const c = profile.constraints || {};
  const cap = c.financial_capacity; // 1..5
  if (!cap) return 70; // missing constraint — neutral
  const [loGov, hiGov] = career.education_cost?.govt_inr_lakh ?? [0, 0];
  const [loPriv, hiPriv] = career.education_cost?.private_inr_lakh ?? [hiGov, hiGov];
  // Map capacity to an affordable upper bound in ₹ lakh, rough ladders.
  const affordable = cap === 1 ? 2 : cap === 2 ? 6 : cap === 3 ? 15 : cap === 4 ? 40 : 100;
  const cheapest = Math.min(hiGov || Infinity, hiPriv || Infinity);
  if (!Number.isFinite(cheapest)) return 70;
  if (cheapest <= affordable) return 100;
  // Loan willingness extends capacity ~2x.
  if (c.loan_ok && cheapest <= affordable * 2) return 75;
  return clamp(100 - ((cheapest - affordable) / affordable) * 50);
}

// ── hard filters ─────────────────────────────────────────────────────────────

function hardFilter(profile: ICareerProfile, career: ICareerPath): string[] {
  const reasons: string[] = [];
  const c = profile.constraints || {};

  // Stream mismatch — only enforce when student has declared a stream.
  if (c.stream && c.stream !== 'Undecided' && career.required_stream?.length) {
    if (!career.required_stream.includes('Any') && !career.required_stream.includes(c.stream as 'PCM' | 'PCB' | 'PCMB' | 'Commerce' | 'Arts')) {
      reasons.push(`requires ${career.required_stream.join('/')} stream`);
    }
  }

  // Financial hard-no — only if student can't afford even with loan.
  if (c.financial_capacity === 1 && !c.loan_ok) {
    const [, hiGov] = career.education_cost?.govt_inr_lakh ?? [0, 0];
    if (hiGov > 3) reasons.push('education cost exceeds family capacity');
  }

  // International-only student shouldn't see low-mobility careers at the top.
  if (c.international === 'settle_abroad' && career.international_mobility <= 2) {
    reasons.push('limited international mobility');
  }

  return reasons;
}

// ── bucket assignment ────────────────────────────────────────────────────────

function assignBucket(
  score: number,
  career: ICareerPath,
  rankAmongNonGems: number,
  rankAmongGems: number,
): MatchBucket {
  if (score < 35) return 'stretch';
  if (career.hidden_gem && score >= 55 && rankAmongGems < 6) return 'hidden_gem';
  if (score >= 65 && rankAmongNonGems < 10) return 'strong_fit';
  if (score >= 50) return 'stretch';
  return 'stretch';
}

// ── helpers ──────────────────────────────────────────────────────────────────

function avgRange(r: [number, number] | undefined, cap = 50): number {
  if (!r) return 0;
  const avg = (r[0] + r[1]) / 2;
  return Math.min(100, (avg / cap) * 100);
}
function scaleOneFive(n: number | undefined): number {
  if (!n) return 50;
  return (n / 5) * 100;
}

// ── public API ───────────────────────────────────────────────────────────────

export interface ScoredMatch {
  career_id: string;
  score: number;
  bucket: MatchBucket;
  breakdown: IMatchBreakdown;
  exclusion_reasons?: string[];
}

/**
 * Phase-1 weights — deliberately round-number. Tune after real testing.
 */
const WEIGHTS = {
  aptitude: 0.2,
  interest: 0.2,
  work_style: 0.15,
  values: 0.15,
  future: 0.15,
  economic: 0.15,
};

export function scoreMatches(
  profile: ICareerProfile,
  careers: ICareerPath[],
): ScoredMatch[] {
  const intermediate = careers.map((career) => {
    const exclusion_reasons = hardFilter(profile, career);
    const breakdown: IMatchBreakdown = {
      aptitude: aptitudeFit(profile, career),
      interest: interestFit(profile, career),
      work_style: workStyleFit(profile, career),
      values: valuesFit(profile, career),
      future: futureFit(profile, career),
      economic: economicFit(profile, career),
    };
    const score =
      breakdown.aptitude * WEIGHTS.aptitude +
      breakdown.interest * WEIGHTS.interest +
      breakdown.work_style * WEIGHTS.work_style +
      breakdown.values * WEIGHTS.values +
      breakdown.future * WEIGHTS.future +
      breakdown.economic * WEIGHTS.economic;
    return { career, exclusion_reasons, breakdown, score };
  });

  // Sort by score desc for bucket assignment.
  intermediate.sort((a, b) => b.score - a.score);

  let nonGemRank = 0;
  let gemRank = 0;
  const result: ScoredMatch[] = intermediate.map((row) => {
    if (row.exclusion_reasons.length > 0) {
      return {
        career_id: row.career._id,
        score: Math.round(row.score),
        bucket: 'excluded',
        breakdown: row.breakdown,
        exclusion_reasons: row.exclusion_reasons,
      };
    }
    const isGem = !!row.career.hidden_gem;
    const bucket = assignBucket(
      row.score,
      row.career,
      isGem ? 999 : nonGemRank,
      isGem ? gemRank : 999,
    );
    if (isGem) gemRank++; else nonGemRank++;
    return {
      career_id: row.career._id,
      score: Math.round(row.score),
      bucket,
      breakdown: row.breakdown,
    };
  });

  return result;
}

/**
 * Group matches into the three curated lists the UI shows.
 */
export function curateLists(matches: ScoredMatch[]) {
  const strong_fits = matches.filter((m) => m.bucket === 'strong_fit').slice(0, 5);
  const hidden_gems = matches.filter((m) => m.bucket === 'hidden_gem').slice(0, 3);
  const stretch = matches
    .filter((m) => m.bucket === 'stretch')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return { strong_fits, hidden_gems, stretch };
}
