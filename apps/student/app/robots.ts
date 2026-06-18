import { MetadataRoute } from 'next';

// Bot policy:
//   - BLOCK pure-training crawlers — they consume bandwidth on our
//     force-dynamic / ISR pages without ever sending traffic or citations
//     back. See the 2026-06 bill diagnostic for impact: post-block we
//     expected ~20-50% drop in Fast Origin Transfer within 48 hours.
//   - ALLOW on-demand answer crawlers (ChatGPT-User, Perplexity-User,
//     OAI-SearchBot, PerplexityBot, ClaudeBot) — these fetch when a user
//     asks the AI a question and produce citations + clickable links
//     back to canvasclasses.in. Blocking these would hurt GEO.
//   - ALLOW the regular search engines (Googlebot, Bingbot) — untouched
//     by this policy; they fall under the catch-all `*` rule.
//
// Note: Google-Extended is SEPARATE from Googlebot. Blocking
// Google-Extended stops Bard/Gemini training but does NOT affect
// google.com search ranking. Same for Applebot-Extended vs Applebot.
const blockedTrainingBots = [
    'GPTBot',             // OpenAI training
    'Google-Extended',    // Bard / Gemini training (separate from Googlebot)
    'Applebot-Extended',  // Apple Intelligence training (separate from Applebot)
    'CCBot',              // Common Crawl — feeds many LLM corpora
    'Bytespider',         // ByteDance / TikTok / Doubao
    'anthropic-ai',       // legacy Anthropic UA (kept for completeness)
    'Amazonbot',          // Amazon AI training
    'Meta-ExternalAgent', // Meta AI training
    'cohere-ai',          // Cohere training
];

// No-value crawlers (added 2026-06 after the Vercel bot breakdown showed these
// hammering the high-cardinality question surface — /the-crucible/q and
// /chemistry-questions — at ~0–8% cache hit, i.e. an ISR regeneration on nearly
// every request, while sending zero traffic or citations back. Blocking them
// leaves Google / Bing / the AI answer-bots untouched.
// NOTE: robots.txt only stops the COMPLIANT ones. Meta's crawler (already listed
// above as Meta-ExternalAgent — Vercel labels it "meta-webindexer") was the #1
// driver and ignores robots.txt, so it MUST also be blocked at the Vercel
// Firewall / Cloudflare WAF (edge-enforced — the only thing that actually stops it).
const blockedNoValueCrawlers = [
    'meta-externalfetcher', // Meta on-demand fetcher (sibling of Meta-ExternalAgent)
    'PetalBot',             // Huawei search — negligible value for a JEE/NEET (India) audience
    'YandexBot',            // Yandex search — negligible value for an India audience
    'AhrefsBot',            // SEO backlink scraper — no audience value
    'SemrushBot',           // SEO scraper
    'MJ12bot',              // Majestic SEO scraper
    'DotBot',               // Moz SEO scraper
    'DataForSeoBot',        // SEO scraper
    'BLEXBot',              // WebMeUp SEO scraper
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            ...blockedTrainingBots.map((userAgent) => ({
                userAgent,
                disallow: '/',
            })),
            ...blockedNoValueCrawlers.map((userAgent) => ({
                userAgent,
                disallow: '/',
            })),
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/crucible/admin', '/the-crucible/dashboard', '/login'],
            },
        ],
        sitemap: 'https://www.canvasclasses.in/sitemap.xml',
    };
}
