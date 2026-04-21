// Canonical facet keys used by the scoring engine and seed data.
// Keep these in sync with seed_questions.ts and the admin UI.

export const APTITUDE_FACETS = [
  'logical',
  'spatial',
  'verbal',
  'numerical',
  'kinesthetic',
  'interpersonal',
  'intrapersonal',
  'musical',
] as const;

export const INTEREST_FACETS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

// Work-style facets are directional: +1 favors the right label, -1 favors left.
// For example, solo_team = +2 means "strongly team", -2 means "strongly solo".
export const WORK_STYLE_FACETS = [
  'indoor_outdoor',        // -2 indoor .. +2 outdoor
  'desk_field',            // -2 desk .. +2 field
  'solo_team',             // -2 solo .. +2 team
  'structured_flex',       // -2 structured .. +2 flexible
  'public_facing',         // -2 behind-scenes .. +2 public
  'stakes',                // -2 steady .. +2 high-stakes
  'travel_appetite',       // -2 low .. +2 high
  'uniform_tolerance',     // -2 low .. +2 high (tolerate uniforms/rules)
] as const;

export const VALUES_FACETS = [
  'financial',
  'stability',
  'impact',
  'prestige',
  'wlb',
  'autonomy',
  'creative',
] as const;

export const FUTURE_FACETS = [
  'tech_comfort',
  'learning_orientation',
  'entrepreneurial',
  'risk_emerging',
  'unconventional',
  'ai_openness',
  'global_curiosity',
] as const;

export type AptitudeFacet = typeof APTITUDE_FACETS[number];
export type InterestFacet = typeof INTEREST_FACETS[number];
export type WorkStyleFacet = typeof WORK_STYLE_FACETS[number];
export type ValuesFacet = typeof VALUES_FACETS[number];
export type FutureFacet = typeof FUTURE_FACETS[number];

export const EMPTY_SCORES = () => ({
  aptitude: Object.fromEntries(APTITUDE_FACETS.map((k) => [k, 0])) as Record<AptitudeFacet, number>,
  interest: Object.fromEntries(INTEREST_FACETS.map((k) => [k, 0])) as Record<InterestFacet, number>,
  work_style: Object.fromEntries(WORK_STYLE_FACETS.map((k) => [k, 0])) as Record<WorkStyleFacet, number>,
  values: Object.fromEntries(VALUES_FACETS.map((k) => [k, 0])) as Record<ValuesFacet, number>,
  future: Object.fromEntries(FUTURE_FACETS.map((k) => [k, 0])) as Record<FutureFacet, number>,
});
