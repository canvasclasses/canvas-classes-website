// features/simulations — interactive chemistry/physics simulators.
//
// This feature is large (11 routes). Phase 4.9 moved cross-route shared bits
// here. Route-local simulator .tsx files still live inline at app/<route>/ to
// keep the migration tractable; future cleanup can relocate them.
//
// Routes (all stay at app/<route>/):
//   /chemihex, /salt-analysis, /solubility-product-ksp-calculator,
//   /organic-wizard, /organic-chemistry-hub, /inorganic-chemistry-hub,
//   /physical-chemistry-hub, /organic-name-reactions, /periodic-trends,
//   /interactive-periodic-table, /physics
//
// Most callers reach in via deep paths (e.g. `@/features/simulations/data/elementsData`).
// The named re-exports below cover the genuinely cross-feature surface — anything
// imported by other features (books, landing, flashcards) or by 2+ routes.

export { useChemiHexLogic } from './hooks/useChemiHexLogic';
export { useSaltQuizProgress } from './hooks/useSaltQuizProgress';
export { default as MoleculeViewer } from './components/organic-wizard/MoleculeViewer';
export { default as OrganicWizardGame } from './components/organic-wizard/ConversionGame';
export * as elementsData from './data/elementsData';
export * as kspData from './data/kspData';
export * as saltAnalysisData from './data/saltAnalysisData';
export * as organicReactionsData from './data/organicReactionsData';
export * as inorganicTrendsData from './data/inorganicTrendsData';
export * as hammettCalculator from './lib/hammettCalculator';
