# PWA (Installable Student App) — Design

**Date:** 2026-06-26
**Status:** Approved (design); implementation pending
**Scope:** `apps/student` (canvasclasses.in) only. The admin app is unchanged.

---

## 1. Goal

Make the student-facing site installable as a Progressive Web App so a student can
add a "Canvas Classes" icon to their phone home screen and tap it to launch the
site **standalone** (no browser chrome), with a proper app-like feel and a graceful
offline fallback.

Stated user goal: *"anyone can install an icon on their phone and click that icon to
open the Canvas Classes application."* → This is an **installability + standalone
launch** project, **mobile-first**, not an offline-content project.

---

## 2. Decisions locked in

| # | Decision | Choice |
|---|---|---|
| 1 | **Depth** | Installable **+ a light service worker** (network-first navigation, branded offline fallback). **No** aggressive caching of pages/API/data. |
| 2 | **Install UX** | **Both** a dismissible bottom banner **and** a menu item. |
| 3 | **App icon** | The existing white **"Canvas" wordmark on `#050505`** (dark). Generate 192 / 512 / maskable. |
| 4 | **Platform** | **Mobile-only promotional UI.** Desktop stays *technically* installable via the browser's native address-bar button, but we surface **no** banner/menu item on desktop. |
| 5 | **App scope** | Student app only. Admin not installable. |
| 6 | **start_url** | `"/?utm_source=pwa"` (so GA/Mixpanel can measure app launches). |
| 7 | **iOS status bar** | `statusBarStyle: 'black'`. |
| 8 | **Banner trigger** | Appears after **~10 seconds** of engagement, mobile + not-installed + not-dismissed-recently only. |
| 9 | **SW tooling** | **Hand-rolled `public/sw.js`** (no new dependency). `@serwist/next` / `next-pwa` rejected. |

### Why hand-rolled SW (not @serwist/next)

`@serwist/next` (the maintained successor to `next-pwa`) auto-precaches **every**
build asset — the exact opposite of the "light, no aggressive caching" decision —
and would wrap `next.config.ts`, which is already wrapped by `withSentryConfig`.
A ~45-line hand-rolled SW does precisely the chosen behavior, adds zero
dependencies, needs no build-tool integration, and is trivially auditable against
the CSP. `next-pwa` is poorly maintained on Next 15 / App Router and is rejected.

---

## 3. Architecture

Three independent, separately-testable layers:

1. **Installability layer (static, no JS):** web app manifest + icons + apple meta
   tags + `theme_color`. This alone enables "Add to Home Screen" and standalone
   launch.
2. **Service-worker layer:** a minimal SW (network-first nav + offline fallback),
   registered by a small client component. Makes the Android custom-install prompt
   reliable and handles offline gracefully.
3. **Install-prompt UX layer:** a hook + a global banner + a navbar mobile-menu
   item — all client components, mobile-gated.

No new API routes, server actions, auth surfaces, or DB writes. CLAUDE.md §8
(security) is N/A. §10 (caching/cost) is respected because the SW deliberately
does **not** cache navigations, API, questions, or book data.

---

## 4. Files

### 4.1 New files

| File | Purpose |
|---|---|
| `apps/student/app/manifest.ts` | Web App Manifest via Next's `MetadataRoute.Manifest`. Next auto-emits `<link rel="manifest" href="/manifest.webmanifest">`. |
| `apps/student/public/icons/icon-192.png` | 192×192 wordmark on `#050505`, `purpose: any`. |
| `apps/student/public/icons/icon-512.png` | 512×512 wordmark on `#050505`, `purpose: any`. |
| `apps/student/public/icons/icon-maskable-512.png` | 512×512 with ~20% safe-zone padding, `purpose: maskable`, so OS crop never clips the wordmark. |
| `apps/student/public/icons/icon-maskable-192.png` | 192×192 maskable variant. |
| `apps/student/public/icons/apple-touch-icon.png` | 180×180 wordmark on `#050505` (opaque; iOS ignores transparency). |
| `apps/student/public/sw.js` | Minimal service worker (behavior in §6). |
| `apps/student/app/offline/page.tsx` | Static, dark-themed "You're offline" fallback with a "Try again" link (pure Server Component — see §7 for why no client button). |
| `apps/student/app/components/ServiceWorkerRegistrar.tsx` | `'use client'`; registers `/sw.js` on mount, **production only** (avoids dev HMR interference). |
| `apps/student/features/pwa/useInstallPrompt.ts` | Hook: captures `beforeinstallprompt`, detects iOS Safari + already-installed (standalone) + mobile, exposes `promptInstall()` and install state. |
| `apps/student/features/pwa/InstallBanner.tsx` | Global dismissible bottom banner (mobile-gated). |
| `apps/student/features/pwa/InstallAppButton.tsx` | "Install app" entry for the navbar **mobile menu** only. |
| `apps/student/features/pwa/IOSInstallSheet.tsx` | iOS "Share ⎙ → Add to Home Screen" instruction sheet, shared by banner + menu. |
| `scripts/generate-pwa-icons.js` | One-off `sharp` script rendering the icon PNGs from the wordmark SVG. Committed for reproducibility. |

### 4.2 Changed files (surgical)

- **`apps/student/app/layout.tsx`**
  - Add a `viewport` export: `themeColor: '#050505'`.
  - Add to `metadata`: `applicationName: 'Canvas Classes'`, `appleWebApp: { capable: true, statusBarStyle: 'black', title: 'Canvas' }`.
  - Point `metadata.icons.apple` at `/icons/apple-touch-icon.png`.
  - Render `<ServiceWorkerRegistrar />` and `<InstallBanner />` inside `<body>`.
- **`apps/student/app/components/Navbar.tsx`**
  - Add one "Install app" item to the **mobile menu** section only (not the desktop cluster). Renders only when installable / iOS-not-installed; hidden once installed.

### 4.3 Untouched (explicitly)

The existing `apps/student/public/icon.png` and `apps/student/public/apple-icon.png`
(founder portraits) are **not** overwritten. New icons live under `/icons/`.

---

## 5. Manifest contents (`apps/student/app/manifest.ts`)

```
name:             "Canvas Classes — JEE & NEET Chemistry"
short_name:       "Canvas"
description:      (reuse the site description from layout metadata)
id:               "/"
start_url:        "/?utm_source=pwa"
scope:            "/"
display:          "standalone"
background_color: "#050505"          // splash background
theme_color:      "#050505"          // OS status/title-bar tint
                                     // (orientation omitted — don't lock tablet/desktop)
categories:       ["education"]
lang:             "en-IN"
dir:              "ltr"
icons:
  - 192×192  purpose: any        /icons/icon-192.png
  - 512×512  purpose: any        /icons/icon-512.png
  - 192×192  purpose: maskable   /icons/icon-maskable-192.png
  - 512×512  purpose: maskable   /icons/icon-maskable-512.png
```

`theme_color` is also emitted as `<meta name="theme-color">` via the layout
`viewport` export (Next 15 moved `themeColor` from `metadata` to `viewport`).

---

## 6. Service-worker behavior (`public/sw.js`)

Cache version constant: `cc-shell-v1`.

- **`install`** → `cache.addAll(['/offline', '/icons/icon-192.png', '/icons/icon-512.png'])`; `self.skipWaiting()`.
- **`activate`** → delete every cache whose name ≠ `cc-shell-v1`; `clients.claim()`.
- **`fetch`** → handle only **same-origin GET**:
  - **Navigations** (`request.mode === 'navigate'`): **network-first**; on network failure → `caches.match('/offline')`.
  - **Everything else**: plain `fetch(request)` passthrough. **No caching** of HTML, API responses, questions, or book data. No stale content; no ISR/Vercel interaction.
- The SW is served from origin root (`/sw.js`) → controls scope `/`.
- **CSP:** allowed with no change. `worker-src`/`child-src` fall back to
  `default-src 'self'`; `/sw.js` is same-origin. `manifest-src` falls back to
  `default-src 'self'`; the manifest is same-origin.
- **Invalidation:** bump `cc-shell-v1` → `v2` whenever the offline page or
  precached icons change.

### Registration

`ServiceWorkerRegistrar` (client): on mount, if
`process.env.NODE_ENV === 'production'` and `'serviceWorker' in navigator`,
`navigator.serviceWorker.register('/sw.js')`. Gating on production is standard
PWA practice (prevents dev HMR/caching headaches) and is **not** an auth bypass —
CLAUDE.md §8.3 concerns auth, which this does not touch.

---

## 7. Offline page (`app/offline/page.tsx`)

Fully static (no dynamic data, no `cookies()`/`headers()`/`searchParams`), dark
theme per the design system: deep `#050505` background, white text, orange/amber
CTA. Content: "You're offline" headline, a short line ("Reconnect to keep
studying"), and a **Try again** link.

**Important offline-hydration detail:** the SW precaches only the `/offline` HTML +
icons, *not* the app's JS chunks (deliberately — that's the "no aggressive caching"
decision). So when the cached `/offline` page is served with no network, its JS
won't load and nothing hydrates. The "Try again" control is therefore a plain
`<a href="/">` (works with zero JS — navigates home, which succeeds once the
network returns), **not** a `'use client'` button calling `location.reload()`
(which would silently do nothing offline). The page is a pure Server Component;
no client child is needed. Precached by the SW so it's available with no network.

---

## 8. Install-prompt UX

### `useInstallPrompt` hook

Detects and exposes:
- `canPromptNatively` — `beforeinstallprompt` fired (Android / desktop Chromium); event stashed, `preventDefault()` called.
- `isIOS` — iOS Safari (no `beforeinstallprompt` API → manual instructions path).
- `isInstalled` — `matchMedia('(display-mode: standalone)').matches` or `navigator.standalone` (iOS) → suppress all install UI.
- `isMobile` — `matchMedia('(max-width: 768px)')` and/or coarse pointer.
- `promptInstall()` — calls the stashed event's `prompt()` and awaits `userChoice`.

### Banner (`InstallBanner`, rendered from layout → shows on every page)

- Shows when: `isMobile && !isInstalled && (canPromptNatively || isIOS) && !dismissedRecently`.
- Appears after **~10 seconds** on the page.
- Slim branded bar from the bottom (framer-motion, matches site). Tapping **Install**:
  - Android/Chromium → `promptInstall()` (native dialog).
  - iOS → open `IOSInstallSheet`.
- **Dismiss persists** in `localStorage` (`cc_pwa_install_dismissed` = timestamp); not shown again for **30 days**.

### Menu item (`InstallAppButton`, navbar mobile menu only)

- Rendered only in the mobile menu (Navbar hides itself on `/the-crucible/*`,
  `/books/*`, and book-reader routes — the global banner still covers those).
- Shows when `!isInstalled && (canPromptNatively || isIOS)`; hidden once installed.
- Same action as the banner (native prompt on Android, iOS sheet on iOS).

### iOS sheet (`IOSInstallSheet`)

Bottom sheet: "Install Canvas Classes — tap the **Share** icon ⎙, then **Add to
Home Screen**." Dark-themed, dismissible.

### Analytics

Fire lightweight Mixpanel/GA events using the existing providers:
`pwa_install_prompt_shown`, `pwa_install_accepted`, `pwa_install_dismissed`, and a
listener on the window `appinstalled` event.

---

## 9. iOS specifics

- `appleWebApp: { capable: true, statusBarStyle: 'black', title: 'Canvas' }` →
  full-screen dark launch, "Canvas" under the icon.
- iOS Safari never fires `beforeinstallprompt`; the iOS path is always the
  instruction sheet. Expected, not a bug.

---

## 10. Non-goals (out of scope)

- No offline reading/practice of questions or books (the rejected "Full offline" option).
- No push notifications, no background sync.
- No admin-app PWA.
- No desktop install banner / menu item (desktop stays natively installable only).
- No changes to CSP, robots, ISR windows, or any existing caching behavior.

---

## 11. Invariants preserved

- **§10 caching/cost:** SW never caches navigations/API/data → no stale content,
  no new ISR writes, no origin-transfer change. Offline page is static.
- **§9 surgical:** Navbar gets exactly one new item; layout gets metadata +
  two rendered components. No refactors.
- **CSP:** unchanged (same-origin SW + manifest covered by `default-src 'self'`).
- **Brand assets:** existing `icon.png` / `apple-icon.png` untouched.
- **Import boundaries:** all new code lives in `apps/student`; no cross-app or
  `packages/*` changes.

---

## 12. Verification plan (respecting "no local builds")

1. `npm run lint` (student) on all new TS/TSX. *(Lint doesn't typecheck
   `packages/*` or admin, but all new code is in `apps/student`, so coverage applies.)*
2. Run `node scripts/generate-pwa-icons.js` (lightweight `sharp`, not a full
   build) and visually confirm the generated PNGs.
3. **Manual acceptance (founder runs):** on a phone, or Chrome DevTools →
   Application → Manifest + Service Workers, plus Lighthouse "Installable" audit:
   - Manifest parses, icons resolve, "Installable" passes.
   - SW registers and activates; offline (DevTools → Network → Offline) shows the
     `/offline` page on navigation.
   - Banner appears on mobile after ~10s; dismiss persists; menu item shows in
     mobile menu; both hidden once installed.
   - Installed app launches standalone with the wordmark icon and dark status bar.

No dev server or production build will be started by the agent.
