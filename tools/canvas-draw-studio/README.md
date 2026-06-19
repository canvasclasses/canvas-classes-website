# Canvas Draw Studio (local-only)

Two drawing tools in one window, running **entirely on your machine** — nothing is
deployed to the website, and no login is needed:

- **Structure Editor** — draw organic chemistry structures (Ketcher). Type a name
  to auto-draw it, attach functional groups (NO₂, COOH, …), trace over a blurry
  reference image, then export a clean SVG/PNG.
- **Diagram Editor** — physics & math figures (Excalidraw), with a built-in library
  of ~50 ready shapes (pulleys, circuits, optics, graphs). Open the **Library
  panel** (book icon) on the canvas to browse and drag them in.

Finished images **save to your Downloads folder** (Download SVG / Download PNG, or
Copy to clipboard). You then upload them through the normal admin UI when you want
them in a book or question. There is no cloud upload from this tool.

---

## Running it (the simple way)

1. Copy the whole `canvas-draw-studio` folder to wherever you like.
2. **Double-click `Start.command`.**
3. Your browser opens with both tools. Leave the small terminal window open while
   you work; close it (or press `Ctrl+C`) to stop.

The only requirement is that **Node is installed** on the machine (it already is on
the Canvas Macs; otherwise grab the LTS from [nodejs.org](https://nodejs.org)).

> **Two ways to get it onto a machine:**
> - **Copy the folder directly** (AirDrop / USB / Drive) — if it already has a
>   `dist/` folder, double-click `Start.command` and you're done, no install.
> - **From a fresh `git clone`** — the built `dist/` is *not* stored in git (it's a
>   big bundle that bloats the repo), so run **`npm install && npm run build`** once
>   first; after that, `Start.command` works forever. `Start.command` will tell you
>   this if `dist/` is missing.

> The first time you open `Start.command`, macOS may ask "are you sure?" because it
> was downloaded/copied. Right-click → **Open** once to approve it, and after that a
> double-click works.

---

## Offline

Everything works with **no internet** — drawing, functional groups, tracing,
shapes, and all exports. The **one** exception is the Structure Editor's
"Generate from name" box, which looks the name up via a public naming service
(OPSIN) and so needs a connection. If you're offline it just reports that the
service is unreachable; nothing else is affected.

---

## For developers (rebuilding after a code change)

This is a standalone [Vite](https://vite.dev) + React app, deliberately kept
**outside** the monorepo's `apps/*` / `packages/*` workspaces so it never enters a
Vercel build.

```bash
npm install        # once per machine
npm run dev        # live-reload dev server (for editing)
npm run build      # rebuild the committed dist/ that Start.command serves
npm run serve      # serve the built dist/ (same as Start.command)
```

The committed `dist/` is what makes the folder runnable with no install. After
changing anything in `src/`, run `npm run build` to refresh it.

### Where the code came from

The editor components are ported from the Canvas admin app
(`apps/admin/features/admin/{structure-editor,diagram-editor}`). Differences in
this local build:

- No Next.js — plain Vite/React, so the `next/dynamic` lazy-loads became plain
  imports and the `'use client'` directives were dropped.
- **No "Push to R2"** button — this build only downloads images to disk.
- "Generate from name" calls EBI's OPSIN service directly (the website routed it
  through a server proxy).
- Excalidraw's fonts are bundled locally (`public/excalidraw-assets/`) so the
  diagram editor renders offline.
