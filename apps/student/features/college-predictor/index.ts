// features/college-predictor — JEE college admission predictor based on
// percentile/rank + category/quota inputs.
//
// Routes:
//   /college-predictor                → PredictorClient + TopColleges
//   /college-predictor/[slug]         → SEO landing pages (one per filter combo)
//   /college-predictor/college/[slug] → individual college deep-dive

export { default as PredictorClient } from './components/PredictorClient';
export { default as TopColleges } from './components/TopColleges';
export { default as TopCollegeCard } from './components/TopCollegeCard';
export { default as CutoffTrendChart } from './components/CutoffTrendChart';
export { TOP_COLLEGES } from './data/topCollegesData';
export { LANDING_CONFIGS } from './data/landingConfig';
export * as predictor from './lib/predictor';
export * as deepDive from './lib/deepDive';
export * as percentileToRank from './lib/percentileToRank';
export * as regions from './lib/regions';
