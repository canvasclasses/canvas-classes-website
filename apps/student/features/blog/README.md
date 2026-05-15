# features/blog

Blog list + single-post pages. Two content sources:
- File-based MDX posts at `apps/student/content/blog/*.mdx` (loaded by `lib/blog.ts`)
- DB-backed posts (drafts, admin-edited) via `lib/blogDb.ts` (reads from `@canvas/data` BlogPost model)

## Routes

| Route | File |
|---|---|
| `/blog` | `app/blog/page.tsx` — server component renders `BlogGrid` (client) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` — renders `BlogPostContent` (client) |

Admin blog routes (`app/api/blog/*`) handle drafts + publishing; they read/write
directly through `@canvas/data` (not via this feature).

## Layout

```
features/blog/
├── components/
│   ├── BlogGrid.tsx        ← list + search UI ('use client')
│   └── BlogPostContent.tsx ← markdown renderer for posts ('use client')
├── lib/
│   ├── blog.ts             ← FS-based MDX loader (build-time, gray-matter)
│   └── blogDb.ts           ← Mongo-backed post accessor
├── index.ts
└── README.md
```

## Why two sources

Older posts shipped as MDX in the repo (`content/blog/*.mdx`). Newer posts are
authored through the admin UI and stored in MongoDB. `lib/blog.ts` + `lib/blogDb.ts`
provide parallel APIs (`getPublishedPosts`, `getPublishedPostBySlug`) so consumers
don't care which source a given post came from.

When all content has been migrated to MongoDB, `lib/blog.ts` and `content/blog/`
can be removed.
