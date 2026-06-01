# features/landing

Homepage + the marketing sections rendered on landing and various
SEO pages.

## Routes

| Route | Page file |
|---|---|
| `/` | `app/page.tsx` renders `LandingPage` |
| `/landing` | `app/landing/page.tsx` — alternate variant with NewHero, FeaturesBento, etc. |

## Layout

```
features/landing/
├── components/
│   ├── LandingPage.tsx       ← main homepage composition
│   ├── (landing/* originals, now flat in components/)
│   │   NewHero, FeaturesBento, PainSection, MethodSection,
│   │   ComparisonSection, StatsSection (landing variant),
│   │   TestimonialsSection, PaarasSirSection, FinalCTASection,
│   │   BentoShowcase, SocialProofSection, VedicLearningSection
│   ├── FAQSection.tsx        ← reused on multiple SEO pages
│   ├── NCERTSection.tsx
│   ├── OfferingsSection.tsx
│   ├── QuickRevisionCard.tsx
│   ├── StudentTestimonialCards.tsx
│   ├── WhyChooseUsSection.tsx
│   ├── ComingSoonTemplate.tsx ← used by cbse-class-* placeholder pages
│   └── DnsBlockedBanner.tsx
├── lib/
│   ├── searchIndices.ts      ← powers CommandPalette site search
│   └── seoData.ts            ← per-question SEO metadata for chemistry-questions/*
├── index.ts
└── README.md
```

## Cross-feature consumers

- `app/layout.tsx` imports `searchIndices` (for `CommandPalette`).
  (`BitsatBanner` was previously rendered here too — it was archived in
  2026-06 alongside the BITSAT 2026 plan; see `app/_bitsat-2026-archive/`.)
- `app/login/page.tsx` imports `DnsBlockedBanner`.
- `app/cbse-class-{10,11,12}/page.tsx` import `ComingSoonTemplate`.
- `app/chemistry-questions/*` pages import `seoData`.
- `app/sitemap.ts` dynamically imports `seoData`.
- `app/components/CommandPalette.tsx` imports `searchIndices`.

These are all legitimate "landing/marketing chrome" consumers; the names are
broad enough that no rename is needed. Site-level chrome that survives
deletion of the landing feature (Navbar, Footer, BreadcrumbSchema, analytics)
stays at `app/components/`.
