# features/

Feature-folder home for `apps/student/`. Each subfolder is one feature
(crucible, notes, books, blog, simulations, etc.) and contains the
implementation files — components, hooks, lib helpers, types, data,
server actions, SEO helpers.

## Why this layout

Next.js routing requires `page.tsx`, `layout.tsx`, and `route.ts` files
to live under `apps/student/app/<route>/`. Those files are kept thin —
they're the routing surface, not the implementation. They import from
`@/features/<feature>/...` and render.

Everything else that belongs to a feature — its React components, its
business logic, its types, its data files — lives here. One canonical
home per feature. Future agents looking for "where does feature X live?"
get the answer in one folder.

## Slot contract

```
features/<feature>/
├── components/       — React components specific to this feature
├── lib/              — Feature-local utilities, data helpers, logic
├── hooks/            — React hooks specific to this feature
├── data/             — Static data (JSON, constants)
├── types.ts          — Feature-local TS types
├── schemas/          — Zod schemas
├── server-actions/   — Server actions ('use server')
├── seo.ts            — Metadata + JSON-LD helpers
├── __tests__/        — Tests (added in Phase 6)
├── README.md         — Feature documentation
└── index.ts          — Public surface (named re-exports)
```

Slots appear on-demand. A small feature might have only `components/` +
`README.md` + `index.ts`. A large one uses every slot.

## Import direction

- `app/<route>/page.tsx` imports from `@/features/<feature>/...` ✓
- `features/<feature>/...` imports from `@canvas/data`, `@canvas/persona`,
  `@canvas/core`, `@canvas/ui` ✓
- `features/<feature>/...` imports from `apps/student/lib/auth.ts` etc.
  (cross-feature shared utilities) ✓
- `features/A/` importing from `features/B/` ✗ — feature isolation rule.
  Shared cross-feature code lives at `apps/student/lib/`, `apps/student/components/`,
  or in a `@canvas/*` package.

## Per-feature READMEs

Each feature folder has its own README documenting its routes, public
surface, and any feature-specific conventions. Start there when entering
an unfamiliar feature.
