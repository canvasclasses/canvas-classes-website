# features/legal

Privacy policy, terms & conditions, about page, and the site-wide consent
gate that prompts users to accept policy updates.

## Routes

| Route | File | Notes |
|---|---|---|
| `/about` | `app/about/page.tsx` | Renders `AboutPage` from this feature |
| `/privacy` | `app/privacy/page.tsx` | Inline JSX; imports versions from this feature |
| `/terms` | `app/terms/page.tsx` | Inline JSX; imports versions from this feature |

## Public surface

```ts
import { AboutPage, ConsentGate, ConsentRefreshModal } from '@/features/legal';
import { PRIVACY_VERSION, TERMS_VERSION, LAST_UPDATED } from '@/features/legal/lib/versions';
import { acceptConsent } from '@/features/legal/lib/acceptConsent';
```

## Layout

```
features/legal/
├── components/
│   ├── AboutPage.tsx           ← /about route renders this
│   ├── ConsentGate.tsx         ← rendered globally in app/layout.tsx
│   └── ConsentRefreshModal.tsx ← rendered globally in app/layout.tsx
├── lib/
│   ├── versions.ts             ← PRIVACY_VERSION, TERMS_VERSION, LAST_UPDATED constants
│   └── acceptConsent.ts        ← client-side consent recording helper
├── index.ts
└── README.md
```

## When versions change

Bump `PRIVACY_VERSION` or `TERMS_VERSION` in `lib/versions.ts`. The
`ConsentRefreshModal` will prompt users who accepted older versions to
review and re-accept.

## Cross-feature dependencies

Outbound edges (legal importing from other features). Single-consumer edge —
if a second non-{landing} consumer of `FAQSection` appears, promote it to
`apps/student/components/`.

| File | Imports from | Symbol |
|---|---|---|
| `components/AboutPage.tsx` | `@/features/landing/components/FAQSection` | `FAQSection` (default) |
