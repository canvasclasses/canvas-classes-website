# Company overview

> Net-new synthesis for the brain. For the authoritative technical detail, see [`CLAUDE.md`](../../CLAUDE.md) §1.

## What Canvas is
**Canvas Classes** is a JEE/NEET prep edtech platform — a question bank + adaptive practice + digital textbooks ("Live Books") covering Chemistry, Physics, Maths, and Biology. Audience skews **tier-2/3 town students**, which drives a house style: plain English, no jargon, teacher voice (see `teacher-voice-profile.md` and the solution-workflow docs). The platform is **dark-native** (every generated image has a dark background + light content).

## The products / surfaces
- **Crucible** — the question bank + adaptive practice. ~15,000+ live questions across the four subjects, with PYQ metadata, taxonomy tags, and teacher-style 6-section solutions. Student UI at `/the-crucible/`.
- **Live Books** — founder-authored digital textbooks (NCERT Simplified, class 9–12 + competitive). Pages of rich content blocks: text, video, audio, images, interactive simulations, quizzes, interactive graphs. **Founder-authored and irreplaceable** — hence the content-protection rules.
- **Adjacent tools** — college/BITSAT predictor, career explorer, study planner, mock tests, flashcards, blog, and a suite of admin authoring tools (structure editor, diagram editor, graph editor).

## The two-app split (Phase 5)
Monorepo, two Next.js apps in an npm workspace:
- `apps/student/` → `canvasclasses.in` — public student site.
- `apps/admin/` → `admin.canvasclasses.in` — operator console.
- Neither app may import from the other; everything shared goes through `packages/*` (`@canvas/{core,data,persona,services,ui,book-renderer}`).
- Both connect to one MongoDB cluster (`crucible` DB, `questions_v2` the active collection). Auth via Supabase. Assets on Cloudflare R2.

## The operating model (why the AI-native initiative exists)
The founder is **non-technical** and directs the entire codebase through AI. Many initiatives run in parallel; context is easily lost on switches — hence the cockpit ([`PROJECTS.md`](../PROJECTS.md)) and these rituals. The AI-native initiative ([`AI_NATIVE_ROADMAP.md`](../plans/AI_NATIVE_ROADMAP.md)) is about moving from "AI as a fast employee" to "AI that watches and understands the whole company."

## House guardrails that shape everything
- **Content protection** (CLAUDE.md §0.6): never hard-delete Live Book content; mutate only via `scripts/lib/book-writer.js`.
- **Caching discipline** (CLAUDE.md §10): public pages must be cacheable; `force-dynamic`/`revalidate=0` is forbidden on them.
- **Security by default** (CLAUDE.md §8): auth on every write, validate input, no secret leakage, SSRF allowlists.
- **Status policy**: all new questions ship `status:'published'`; problems are flagged, not held in review.
