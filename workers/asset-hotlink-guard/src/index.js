/**
 * asset-hotlink-guard — Cloudflare Worker in front of the R2 asset bucket.
 *
 * PURPOSE (Live Books security audit M-2, 2026-07-25)
 * ---------------------------------------------------
 * Live Books are public with no paywall, so the content is inherently
 * scrapeable. This Worker does NOT try to stop scraping (a no-Referer GET
 * still succeeds — that is the deliberate tradeoff). What it stops is the ONE
 * thing hotlink protection can stop: a rival embedding our expensive media
 * (recorded videos, generated images) directly into THEIR page via
 * `<img src="https://assets.canvasclasses.in/...">`, which serves our content
 * off OUR bandwidth bill under their brand. That request carries the rival's
 * domain in the Referer header; we block cross-origin Referers here.
 *
 * WHAT IS ALLOWED (must stay allowed — do not tighten without thought):
 *   • Requests with NO Referer header — bots, direct navigation, AI citation
 *     crawlers (ChatGPT / Perplexity / Claude), social-preview fetchers, and
 *     image-SEO crawlers. Blocking these would hurt GEO/SEO. FAIL OPEN.
 *   • Requests refered from our own properties (REFERER_ALLOWLIST).
 *   • A malformed/unparseable Referer — treated as "unknown", allowed
 *     (availability > strictness; this is best-effort protection).
 *
 * WHAT IS BLOCKED (only when ENFORCE === "true"):
 *   • A Referer whose host is not in the allowlist → 403.
 *   When ENFORCE !== "true" the Worker runs in LOG-ONLY mode: it logs what it
 *   *would* have blocked but serves the asset anyway. Always roll out in
 *   log-only first, read the logs, calibrate the allowlist, THEN enforce.
 *
 * Serving correctness: supports HTTP Range (video/audio seeking), conditional
 * requests (ETag / If-None-Match → 304), HEAD, and only GET/HEAD. Never lists
 * the bucket. Long immutable cache — object keys already carry unique suffixes.
 *
 * Bindings (wrangler.toml):
 *   ASSETS_BUCKET   R2 bucket binding (canvas-chemistry-assets)
 * Vars:
 *   ENFORCE            "true" to block, anything else = log-only
 *   REFERER_ALLOWLIST  comma-separated apex hosts (subdomains auto-allowed)
 */

/** Parse the comma-separated allowlist var into a clean lowercase array. */
function parseAllowlist(raw) {
  return (raw || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Referer policy. Returns true = serve, false = candidate for blocking.
 * Absent/malformed Referer → true (fail open). A present Referer must match an
 * allowlist host exactly, or be a subdomain of one (endsWith('.' + host)).
 */
function refererAllowed(referer, allowHosts) {
  if (!referer) return true; // bots, direct nav, AI/SEO crawlers — never block
  let host;
  try {
    host = new URL(referer).hostname.toLowerCase();
  } catch {
    return true; // unparseable — don't punish a weird-but-maybe-legit client
  }
  return allowHosts.some((h) => host === h || host.endsWith('.' + h));
}

/** Range: bytes=start-end → { offset, length } for R2, or null if unsatisfiable/absent. */
function parseRange(header, size) {
  if (!header || !header.startsWith('bytes=')) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m) return null;
  const [, s, e] = m;
  let start;
  let end;
  if (s === '' && e === '') return null;
  if (s === '') {
    // suffix range: last N bytes
    const n = parseInt(e, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    start = Math.max(0, size - n);
    end = size - 1;
  } else {
    start = parseInt(s, 10);
    end = e === '' ? size - 1 : parseInt(e, 10);
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) return null;
  end = Math.min(end, size - 1);
  return { offset: start, length: end - start + 1, start, end };
}

export default {
  async fetch(request, env) {
    // Only ever serve reads. No PUT/DELETE reaches R2 through this Worker.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    if (!key || key.endsWith('/')) {
      // Never expose a bucket/prefix listing.
      return new Response('Not Found', { status: 404 });
    }

    // ── Hotlink policy ──────────────────────────────────────────────────────
    const allowHosts = parseAllowlist(env.REFERER_ALLOWLIST);
    const referer = request.headers.get('Referer');
    if (!refererAllowed(referer, allowHosts)) {
      // Log in both modes so we can size the impact before/after enforcing.
      console.log(JSON.stringify({ event: 'hotlink', referer, key, enforced: env.ENFORCE === 'true' }));
      if (env.ENFORCE === 'true') {
        return new Response('Forbidden', { status: 403 });
      }
      // log-only: fall through and serve.
    }

    // ── Serve from R2 with range + conditional support ──────────────────────
    const ifNoneMatch = request.headers.get('If-None-Match') || undefined;

    // HEAD or conditional: a cheap metadata read first.
    const head = await env.ASSETS_BUCKET.head(key);
    if (!head) return new Response('Not Found', { status: 404 });

    const baseHeaders = new Headers();
    head.writeHttpMetadata(baseHeaders);
    baseHeaders.set('etag', head.httpEtag);
    baseHeaders.set('accept-ranges', 'bytes');
    // Keys carry unique suffixes and content is effectively immutable.
    if (!baseHeaders.has('cache-control')) {
      baseHeaders.set('cache-control', 'public, max-age=31536000, immutable');
    }

    // Conditional GET → 304.
    if (ifNoneMatch && ifNoneMatch.replace(/^W\//, '') === head.httpEtag.replace(/^W\//, '')) {
      return new Response(null, { status: 304, headers: baseHeaders });
    }

    if (request.method === 'HEAD') {
      baseHeaders.set('content-length', String(head.size));
      return new Response(null, { status: 200, headers: baseHeaders });
    }

    const range = parseRange(request.headers.get('Range'), head.size);
    if (range) {
      const obj = await env.ASSETS_BUCKET.get(key, { range: { offset: range.offset, length: range.length } });
      if (!obj) return new Response('Not Found', { status: 404 });
      const h = new Headers(baseHeaders);
      h.set('content-range', `bytes ${range.start}-${range.end}/${head.size}`);
      h.set('content-length', String(range.length));
      return new Response(obj.body, { status: 206, headers: h });
    }

    const obj = await env.ASSETS_BUCKET.get(key);
    if (!obj) return new Response('Not Found', { status: 404 });
    const h = new Headers(baseHeaders);
    h.set('content-length', String(head.size));
    return new Response(obj.body, { status: 200, headers: h });
  },
};
