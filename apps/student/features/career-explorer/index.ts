// features/career-explorer — RIASEC-flavoured career discovery questionnaire.
//
// Routes:
//   /career-explorer                              → LandingClient
//   /career-explorer/browse                       → BrowseClient (catalog of careers)
//   /career-explorer/careers/[slug]               → individual career page (inline)
//   /career-explorer/questionnaire/[profileId]    → QuestionnaireClient
//   /career-explorer/results/[profileId]          → ResultsClient
//   /career-explorer/vision/[profileId]           → VisionClient

export { default as LandingClient } from './components/LandingClient';
export { default as BrowseClient } from './components/BrowseClient';
export { default as QuestionnaireClient } from './components/QuestionnaireClient';
export { default as ResultsClient } from './components/ResultsClient';
export { default as VisionClient } from './components/VisionClient';
export * as careerScoring from './lib/scoring';
export * as careerFacets from './lib/facets';
export * as careerResponses from './lib/applyResponse';
