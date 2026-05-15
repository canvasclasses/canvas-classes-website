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
