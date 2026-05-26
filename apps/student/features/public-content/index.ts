// features/public-content — SEO-driven listing/content routes.
//
// Routes (13): /2-minute-chemistry, /assertion-reason, /bitsat-chemistry-revision
//   (archived — noindex'd since 2026-05-25), /chemistry-questions, /detailed-lectures,
//   /jee-main-pyqs/*, /neet-crash-course/*, /one-shot-lectures, /quick-recap,
//   /quiz/chemistry/*, /top-50-concepts, plus /download-ncert-books +
//   /ncert-solutions (which import their data from @/features/books).
// /jee-pyqs/* deleted 2026-05-25 — superseded by /the-crucible's question bank.
//
// Most callers reach in via deep paths (`@/features/public-content/data/<x>`),
// not this barrel — the per-route `page.tsx` files are tightly coupled to
// individual data files. Re-exports below cover the genuinely cross-feature bits.

export { default as QuestionMarkdown } from './components/QuestionMarkdown';
export { useAssertionProgress } from './hooks/useAssertionProgress';
