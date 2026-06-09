// Shared, dependency-free URL -> embeddable-src parser for student-added resources.
//
// SECURITY (CLAUDE.md §8.4 / §8.8): we never put a raw user-pasted string into an
// iframe src. We parse the URL, validate the host against a strict allowlist using
// `.endsWith()` suffix matching (never `.includes()`), extract + validate an id, and
// build the embed src OURSELVES from that id. Anything that doesn't parse to a known
// provider is treated as non-embeddable (saved as an "open in new tab" link instead).
//
// Imported by the client form, the render layer, and the server PUT validator — so it
// must stay free of React / browser-only APIs.

export type ParsedResource = {
    ok: boolean;
    embeddable: boolean;
    embedUrl?: string;   // safe, provider-built src (only when embeddable)
    normalizedUrl: string; // the https url we store (validated host)
};

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const DRIVE_ID = /^[A-Za-z0-9_-]{10,}$/;
const VIMEO_ID = /^\d{6,}$/;

function hostMatches(host: string, suffix: string): boolean {
    return host === suffix || host.endsWith('.' + suffix);
}

export function parseResourceUrl(raw: string): ParsedResource {
    const fail: ParsedResource = { ok: false, embeddable: false, normalizedUrl: '' };
    if (typeof raw !== 'string') return fail;
    const trimmed = raw.trim();
    if (!trimmed) return fail;

    let u: URL;
    try {
        u = new URL(trimmed);
    } catch {
        return fail;
    }
    if (u.protocol !== 'https:') return fail;
    const host = u.hostname.toLowerCase();

    // --- YouTube ---
    if (hostMatches(host, 'youtube.com') || hostMatches(host, 'youtu.be') || hostMatches(host, 'youtube-nocookie.com')) {
        const id = extractYouTubeId(u);
        if (id && YT_ID.test(id)) {
            return { ok: true, embeddable: true, embedUrl: `https://www.youtube.com/embed/${id}`, normalizedUrl: u.toString() };
        }
        return { ok: true, embeddable: false, normalizedUrl: u.toString() };
    }

    // --- Google Drive ---
    if (hostMatches(host, 'drive.google.com')) {
        const m = u.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
        const id = m?.[1];
        if (id && DRIVE_ID.test(id)) {
            return { ok: true, embeddable: true, embedUrl: `https://drive.google.com/file/d/${id}/preview`, normalizedUrl: u.toString() };
        }
        return { ok: true, embeddable: false, normalizedUrl: u.toString() };
    }

    // --- Vimeo ---
    if (hostMatches(host, 'vimeo.com')) {
        const m = u.pathname.match(/\/(\d+)/);
        const id = m?.[1];
        if (id && VIMEO_ID.test(id)) {
            return { ok: true, embeddable: true, embedUrl: `https://player.vimeo.com/video/${id}`, normalizedUrl: u.toString() };
        }
        return { ok: true, embeddable: false, normalizedUrl: u.toString() };
    }

    // Unknown host: allowed as an external link only (never embedded).
    return { ok: true, embeddable: false, normalizedUrl: u.toString() };
}

function extractYouTubeId(u: URL): string | null {
    const host = u.hostname.toLowerCase();
    if (hostMatches(host, 'youtu.be')) {
        return u.pathname.slice(1).split('/')[0] || null;
    }
    // watch?v=
    const v = u.searchParams.get('v');
    if (v) return v;
    // /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
    const m = u.pathname.match(/\/(?:embed|shorts|live|v)\/([^/?#]+)/);
    if (m?.[1]) return m[1];
    return null;
}
