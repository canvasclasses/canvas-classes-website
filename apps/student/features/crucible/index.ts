// features/crucible — the Crucible practice + question-admin platform.
//
// This is the largest feature surface. Routes:
//   /the-crucible                            → student practice landing
//   /the-crucible/[chapterId]                → chapter-level practice
//   /the-crucible/q/[slug]                   → single-question detail page
//   /the-crucible/dashboard                  → student dashboard
//   /crucible                                → admin landing
//   /crucible/admin                          → main question admin
//   /crucible/admin/{blog,books,flashcards,career-explorer,taxonomy}
//                                            → admin sub-routes
//   /crucible/admin/preview                  → admin question preview
//   /crucible/dashboard                      → admin user dashboard
//
// All API routes under app/api/v2/* are crucible-aligned but stay at the
// Next.js routing level.
//
// Phase 5 will split the /crucible/admin/* sub-tree out into apps/admin/;
// the admin components are organized under features/crucible/components/admin/
// to make that extraction surgical.
