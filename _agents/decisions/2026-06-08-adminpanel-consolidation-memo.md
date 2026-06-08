# Decision memo: the `<AdminPanel>` consolidation (backlog #8)

**Date:** 2026-06-08
**For:** co-developer who designed the admin/student app split (Phase 5)
**Status:** awaiting your call before any code is written. Nothing has been changed yet.

---

## Why this came up

`CLAUDE.md` §8.11 says: *"Six admin dashboards share a copy-pasted shell… if you're tempted to add a 7th, flag it before adding — that's the trigger to do the abstraction first."*

We just added the **7th** dashboard (`junior-bank`). So the documented trigger has fired, and the ask was: build the shared `<AdminPanel>` abstraction the backlog (`_agents/DEEPENING_BACKLOG.md` item #8) has been deferring, then migrate the existing dashboards onto it one commit at a time.

The seven dashboards in scope:
`apps/admin/app/{crucible, flashcards, blog, books, taxonomy, career-explorer, junior-bank}/page.tsx` + their workspace components.

---

## What I found when I actually read all seven

The backlog assumed these seven share "the same shape." When you read them, they **don't** — except in one place. Here's the honest breakdown of the four things we were asked to factor out:

### 1. The server auth gate — **genuinely identical (real duplication)**

6 of the 7 `page.tsx` files are literally this:

```ts
const admin = await requireSuperAdmin();   // or requireAdmin()
if (!admin) redirect('/');                 // blog uses redirect('/login?next=/blog')
return <Workspace />;
```

This is copy-pasted 6 times. It's the one piece that can be extracted with **zero behavior change**.

Note: `requireSuperAdmin()` is currently just an alias of `requireAdmin()` in `apps/admin/lib/adminAuth.ts` — both gate on `SUPER_ADMIN_EMAILS`. The two names exist for self-documentation.

Exception: **crucible** is a `'use client'` page with **no server gate at all** — it relies on the middleware plus a client-side redirect inside its data loader. So crucible can't join this layer.

### 2 / 3 / 4. Header, loading state, empty state — **divergent in every dashboard**

This is the surprise. Each workspace component has its own:

| Dashboard | Outer wrapper | Header is… |
|---|---|---|
| flashcards | `bg-gradient-to-b from-slate-950…` | a left **sidebar** header |
| books | `fixed inset-0 z-[60] bg-[#050505]` | a fixed **topbar** with a view-mode toggle + live page-title input |
| taxonomy | `bg-gray-900 pt-24` | a **card** header with subject tabs + a stats grid |
| blog | `bg-gray-950` | a **sticky** header with tab nav, shows `adminEmail` |
| junior-bank | `bg-[#050505]` | a simple header + "New question" button |
| career-explorer | `bg-[#050505]` | a server-rendered stats header + tiles |
| crucible | `fixed inset-0 … gray-900` | a ~1,600-line bespoke toolbar |

Loading states differ (spinner icon vs "Loading page…" vs full-screen loader vs none). Empty states differ. Even the "← back to admin home" link is pasted inline in all seven with **different** label/icon/color each time.

These headers aren't cosmetic variations — they carry **per-dashboard functionality** (subject tabs, view-mode toggle, page-title editing, tab navigation, stats). You can't collapse them into one generic header without changing what each page renders and does.

This is exactly what the backlog itself warned about in item #8: *"the pattern isn't stable enough to know what the right shape is yet. Premature."*

---

## The decision: how aggressive should the consolidation be?

There's a genuine tension. The instruction was "pure structural consolidation — do **not** change any dashboard's behavior." But the only way to unify the **headers** is to normalize their layout/palette, which **does** change behavior. The auth gate can be unified cleanly; the chrome can't. So it's a real either/or:

### Option A — Gate + opt-in chrome  *(my recommendation)*
- Build `<AdminPanel>` as a **server component that owns the auth gate + redirect** (one place instead of six), and **also** offers a shared header scaffold (page wrapper + back-link + title + subtitle + an "actions" slot).
- Migrate **all 6 server pages** onto the gate layer.
- Migrate **junior-bank** and **career-explorer** fully onto the chrome too — because they *already* use the simple `#050505` + back-link + title shape, so nothing renders differently.
- The 4 bespoke dashboards (flashcards / books / taxonomy / blog) adopt **only the gate**; they keep their custom headers. Crucible keeps its client toolbar (no server gate to migrate).
- **Result:** removes the 6× duplicated auth gate, gives future dashboards a real shell to start from, and **nothing renders differently anywhere.**
- **Cost:** `<AdminPanel>` has two modes (gate-only vs gate+chrome), which is slightly less tidy than a single shape.

### Option B — Auth gate only  *(smallest, safest)*
- `<AdminPanel>` is *just* the server auth-gate wrapper. Migrate the 6 server pages onto it. Leave every header/loading/empty/back-link exactly as-is.
- **Result:** smallest possible diff, fully mechanical, zero risk. Defers the header question (as the backlog has been doing) until the right shape is obvious.
- **Cost:** the headers stay duplicated; we've only solved a third of what §8.11 describes.

### Option C — Force full unification  *(what §8.11 literally imagines, but…)*
- Push all 7 headers/loading/empty states onto one generic `<AdminPanel title columns actions/>` shell.
- **Result:** maximal de-duplication.
- **Cost:** this **will change how most dashboards look and behave** (palette + layout normalization, and re-homing functional header controls). It's a large rewrite, not a mechanical migration, and it contradicts the "no behavior change" rule. High risk of regressions across all admin tools at once.

---

## My recommendation & the question for you

I'd go with **Option A**: it captures the only duplication that's actually real (the auth gate), gives the next dashboard a shell to lean on, and changes zero rendered output. Option C is the "purest" de-dup but I think it's premature — the headers are too functionally different right now, and a forced merge risks breaking working admin tools for a cosmetic win.

**You designed the app split — two things I'd value your read on:**

1. Do you agree the **auth gate** is the right (and maybe only) thing to centralize here, or did you have a broader shell in mind when you wrote the §8.11 note? Is there a reason you kept the gate inline per-page (e.g. you wanted each page to control its own redirect target, like blog's `?next=`)?
2. For the auth gate component itself: do you want it as a **server component wrapper** (`<AdminPanel gate="super">…</AdminPanel>` that runs the check and renders children), or as a **plain async helper** (`await requireAdminPage('/login?next=/blog')` called at the top of each page)? The wrapper is more "component-y"; the helper keeps each page's control flow visible. Both are behavior-identical.

Once you weigh in I'll implement it one dashboard per commit so the diff stays reviewable.
