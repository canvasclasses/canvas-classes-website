import { MetadataRoute } from 'next';

// Bot policy (verified against primary vendor docs 2026-07-18 — see
// _agents/plans/QUESTION_LIBRARY_SPEC.md §2 and SEO_PLAYBOOK Known gaps):
//   - BLOCK pure-training crawlers — they consume bandwidth on our
//     ISR pages without ever sending traffic or citations back.
//   - ALLOW on-demand answer/citation crawlers (ChatGPT-User, Perplexity-User,
//     OAI-SearchBot, PerplexityBot, Claude-User, Claude-SearchBot,
//     meta-externalfetcher) — these fetch when a user asks the AI a question
//     and produce citations + clickable links back to canvasclasses.in.
//   - ALLOW the regular search engines (Googlebot, Bingbot) — untouched
//     by this policy; they fall under the catch-all `*` rule. Bingbot also
//     grounds Microsoft Copilot citations.
//
// Anthropic runs THREE bots (their docs, 2026): ClaudeBot = TRAINING
// (block), Claude-User = user-triggered fetch (allow), Claude-SearchBot =
// search index (allow). Do not conflate them — ClaudeBot was wrongly
// treated as the citation bot here until 2026-07-18.
//
// Note: Google-Extended is SEPARATE from Googlebot. Blocking
// Google-Extended stops Gemini training/grounding but does NOT affect
// google.com ranking or AI Overviews eligibility (AIO is a Search feature
// governed by snippet controls, not Google-Extended). Same separation for
// Applebot-Extended (training, blocked) vs base Applebot (Siri/Spotlight,
// allowed).
const blockedTrainingBots = [
    'GPTBot',             // OpenAI training
    'Google-Extended',    // Gemini training/grounding (separate from Googlebot)
    'Applebot-Extended',  // Apple Intelligence training (separate from Applebot)
    'CCBot',              // Common Crawl — feeds many LLM corpora
    'Bytespider',         // ByteDance / TikTok / Doubao
    'anthropic-ai',       // legacy Anthropic UA (kept for completeness)
    'ClaudeBot',          // Anthropic TRAINING crawler (NOT the citation bot —
                          // those are Claude-User / Claude-SearchBot, allowed)
    'Amazonbot',          // Amazon AI training (Alexa answers use the separate
                          // Amzn-SearchBot, which stays allowed by catch-all)
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
    // 'meta-externalfetcher' was REMOVED from this list 2026-07-18: it is Meta
    // AI's USER-TRIGGERED link fetcher (same class as ChatGPT-User/Claude-User,
    // per Meta's crawler docs) — blocking it forfeited citations in Meta AI on
    // WhatsApp, the highest-reach AI surface for Indian students. The training
    // crawler (Meta-ExternalAgent) stays blocked above.
    'PetalBot',             // Huawei search — negligible value for a JEE/NEET (India) audience
    'YandexBot',            // Yandex search — negligible value for an India audience
    'AhrefsBot',            // SEO backlink scraper — no audience value
    'SemrushBot',           // SEO scraper
    'MJ12bot',              // Majestic SEO scraper
    'DotBot',               // Moz SEO scraper
    'DataForSeoBot',        // SEO scraper
    'BLEXBot',              // WebMeUp SEO scraper
];

// Answer/citation bots we ALLOW explicitly. They'd be allowed by the `*`
// catch-all anyway; explicit groups (a) document intent and (b) survive any
// future default-deny change. NOTE robots.txt semantics: a bot obeys its own
// most-specific user-agent group INSTEAD of `*`, so these groups must repeat
// the catch-all's disallow list.
const explicitAnswerBots = [
    'Claude-User',      // Anthropic: fetch when a Claude user asks a question
    'Claude-SearchBot', // Anthropic: Claude search index → citations
];

const CATCH_ALL_DISALLOW = ['/api/', '/crucible/admin', '/the-crucible/dashboard', '/login'];

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
            ...explicitAnswerBots.map((userAgent) => ({
                userAgent,
                allow: '/',
                disallow: CATCH_ALL_DISALLOW,
            })),
            {
                userAgent: '*',
                allow: '/',
                disallow: CATCH_ALL_DISALLOW,
            },
        ],
        sitemap: 'https://www.canvasclasses.in/sitemap.xml',
    };
}
