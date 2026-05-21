# Canvas Classes

JEE / NEET / CBSE preparation platform. Next.js 15 + React 19 + TypeScript + Tailwind 4, MongoDB Atlas, Supabase auth, Cloudflare R2 assets.

Two deployable apps, six shared packages, one MongoDB cluster.

## Where to look first

| If you want to… | Open |
|---|---|
| Understand the whole codebase | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Read agent / AI rules + security invariants | [`CLAUDE.md`](./CLAUDE.md) (auto-loaded by Claude Code) |
| Understand Crucible's persona pipeline | [`_agents/CRUCIBLE_ARCHITECTURE.md`](./_agents/CRUCIBLE_ARCHITECTURE.md) |
| See architecture decisions | [`_agents/adr/`](./_agents/adr/) |
| Run a workflow (ingest questions, author solutions, build a book page, etc.) | [`_agents/workflows/`](./_agents/workflows/) |
| Operate (backups, analytics, RBAC) | [`docs/`](./docs/) · [`_agents/RBAC.md`](./_agents/RBAC.md) |

## Quick start

```bash
npm install
npm run dev         # student app at http://localhost:3000
npm run lint        # ESLint across the workspace
```

The admin app (`apps/admin/`) runs separately — see its own `apps/admin/README.md`.

## Layout

```
apps/
  student/      canvasclasses.in        — public + student APIs
  admin/        admin.canvasclasses.in  — operator console
packages/
  data/         Mongoose models, taxonomy, RBAC, ID generator
  persona/      mastery contract, writer, recommendation engine
  services/    shared route handlers (DI'd auth) — both apps wrap these
  core/         R2, LaTeX validator, rate-limit, analytics
  ui/           MathRenderer, MoleculeViewer, flashcardMarkdown
  book-renderer/PageRenderer + 20 BlockRenderers + simulators
scripts/        ingestion + solution toolkits per subject
_agents/        architecture docs, ADRs, workflows, archive
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) §2–§4 for the full topology.

## Required env vars (`.env.local`, never committed)

```
MONGODB_URI=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_EMAILS=
```
