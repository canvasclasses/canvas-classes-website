// features/blog — blog list + blog post pages.
//
// Routes:
//   /blog          → app/blog/page.tsx (list, server component, BlogGrid client child)
//   /blog/[slug]   → app/blog/[slug]/page.tsx (single post)
//
// Static post content lives at apps/student/content/blog/*.mdx and is loaded
// by lib/blog.ts at build time. DB-backed posts (drafts, admin-edited) go
// through lib/blogDb.ts which reads from @canvas/data.

export { default as BlogGrid } from './components/BlogGrid';
export { default as BlogPostContent } from './components/BlogPostContent';
export { getPublishedPosts, getPublishedPostBySlug, getPublishedSlugs, type PublicPost } from './lib/blogDb';
export * as blogFs from './lib/blog';
