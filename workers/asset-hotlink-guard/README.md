# asset-hotlink-guard — R2 hotlink protection (Live Books security audit M-2)

A Cloudflare Worker that sits in front of the R2 asset bucket
(`canvas-chemistry-assets`) on a **custom domain** and blocks cross-origin
hotlinking of our media — a rival embedding our recorded videos / generated
images into their own page and serving them off **our** bandwidth.

## What this does and does NOT do — read first

| | |
|---|---|
| ✅ **Stops** | A third-party site embedding `assets.canvasclasses.in/...` in their `<img>`/`<video>` — their page sends *their* domain as `Referer`, which we 403. Protects bandwidth + brand. |
| ❌ **Does NOT stop** | Scraping/copying. A `curl` / headless fetch sends **no** `Referer`, which we intentionally allow (bots, AI citation crawlers, SEO, direct navigation must keep working). Hotlink protection is a bandwidth-theft control, **not** an anti-scraping control. |

Live Books are public with no paywall; the content is copyable by definition.
This Worker narrows one specific abuse. Do not expect it to prevent replicas —
for that, see the audit's attribution/watermark/legal recommendations.

## Why this is a migration, not a toggle

Assets are currently served from Cloudflare's **managed** `pub-…​.r2.dev`
endpoint, which **cannot run a Worker or enforce Referer rules**. Enforcement
requires a **custom domain** in front of the bucket. But today:

- `R2_PUBLIC_URL = https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev`
- **204** hardcoded `pub-…​.r2.dev` references in `apps/` + `packages/` + `scripts/`
- **Thousands** of asset URLs stored inside `book_pages` blocks, notes data, etc.

All of that points at the r2.dev host. The custom domain and r2.dev host serve
the **same objects**, so adding the custom domain is non-breaking — but
*enforcement only applies to traffic on the custom domain*, so the payoff comes
only after content is migrated to reference it.

---

## Phased runbook (each phase is reversible)

### Phase 0 — Custom domain (Cloudflare dashboard; non-breaking, additive)
1. Ensure `canvasclasses.in` is a zone in the same Cloudflare account as the R2 bucket.
2. R2 → `canvas-chemistry-assets` → **Settings → Custom Domains → Connect Domain** → `assets.canvasclasses.in`. Cloudflare provisions the cert + DNS.
3. Verify: `https://assets.canvasclasses.in/<some-existing-key>` returns the same file as the r2.dev URL. **Both hosts now work** — nothing is broken, nothing migrated yet.
   - Rollback: disconnect the custom domain. No effect on live content (still on r2.dev).

### Phase 1 — Deploy the Worker in LOG-ONLY mode
```bash
cd workers/asset-hotlink-guard
npx wrangler deploy          # ENFORCE="false" in wrangler.toml
npx wrangler tail            # watch live logs
```
- With `ENFORCE="false"`, the Worker **serves everything** but logs any request it *would* have blocked (`{"event":"hotlink",...}`).
- Let it run while you use the site normally (reader, admin, mobile). Confirm your own traffic never appears as a hotlink. Calibrate `REFERER_ALLOWLIST` if a legitimate first-party host shows up (e.g. a Vercel preview domain).
   - Rollback: `npx wrangler delete` — custom domain then serves R2 directly, no policy.

### Phase 2 — Migrate content to the custom domain
Do these together, then redeploy the apps:
1. **Env:** set `R2_PUBLIC_URL=https://assets.canvasclasses.in` in the root `.env.local` **and** the Vercel project env (both apps + scripts read it). New uploads immediately use the new host.
2. **Code refs (204):** rewrite the hardcoded `pub-2ff04…​.r2.dev` host to `assets.canvasclasses.in` across `apps/` + `packages/` + `scripts/` (the anatomy-model proxy, ncertBooksData, handwrittenNotes.data, etc.). Keep the proxy routes — with a custom domain you can now also enable bucket CORS and retire them later.
3. **DB-stored URLs:** rewrite the host inside stored content. **CRITICAL (CLAUDE.md §0.6):** `book_pages` mutations MUST go through `scripts/lib/book-writer.js` (`savePage`) — it snapshots + guards against content loss. A raw `updateMany` on `book_pages` is a §0.6 violation. Write a migration that loads each page, string-replaces the host in `blocks` (and `hinglish_blocks`), and saves via the gateway. Notes/other collections can use their own writers.
   - Rollback: revert `R2_PUBLIC_URL`, revert the code rewrite, and (because the r2.dev host still works) old URLs keep resolving. Keep r2.dev enabled through this phase precisely so rollback is instant.

### Phase 3 — Enforce
Only after Phase 1 logs are clean and Phase 2 is fully deployed and verified:
```bash
# set ENFORCE = "true" in wrangler.toml
npx wrangler deploy
npx wrangler tail   # watch for any legit traffic getting 403'd
```
- Smoke-test immediately: load a book page with images + a video (seek it — confirms Range works), on desktop + mobile. Then open a JSFiddle/CodePen that `<img>`s one of your asset URLs → it should 403.
   - Rollback: set `ENFORCE="false"`, redeploy. Instant, no data change.

### Phase 4 (optional, later) — retire the r2.dev public endpoint
Once you're confident no content references the old host (grep code + spot-check
the DB), disable the bucket's r2.dev public URL so the custom domain is the only
door. **Do not do this until Phase 2 is provably complete** — any lingering
r2.dev URL 404s the moment it's disabled. This step is what makes enforcement
airtight (otherwise a rival can just hotlink the r2.dev host, which has no Worker).

---

## Risks / gotchas
- **Site-wide media breakage** if `REFERER_ALLOWLIST` is wrong or a first-party host is missed. Log-only Phase 1 exists to catch this before it can bite. The Worker fails **open** on absent/malformed Referer by design.
- **Video seeking** needs HTTP Range — the Worker implements 206/Range; verify after Phase 3.
- **SEO/GEO:** absent-Referer is always allowed, so Googlebot / image indexing / AI citation crawlers are unaffected. Do not "tighten" this to require a Referer.
- **Multi-instance limit:** none here — this is edge-global at Cloudflare, unlike the in-memory app rate limiters.
- **r2.dev stays open until Phase 4:** until then, enforcement is bypassable via the old host. That's an intentional safety margin for rollback, not the end state.

## Files
- `src/index.js` — the Worker (referer policy + range/conditional R2 serving)
- `wrangler.toml` — route + bucket binding + `ENFORCE`/`REFERER_ALLOWLIST` vars
