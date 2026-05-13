// Canonical Crucible brand block — the crucible-vessel-with-flames icon,
// "THE CRUCIBLE" wordmark, and "Forge Your Rank" tagline. Single source
// for any surface that needs to render the Crucible identity:
//   - /the-crucible (the product landing)
//   - /handwritten-notes/[chapter] Crucible rail
//   - any future Crucible CTA / promo card
//
// If the brand mark or tagline ever changes, edit here only.
//
// SVG IDs are prefixed (default 'crucible-brand-') so multiple instances
// on the same page don't collide with each other or with the landing's
// inline SVG which uses bare 'flame-grad'/'vessel-grad'.

interface Props {
    /** Icon box size in px. Defaults to 38 (matches the landing nav). */
    iconSize?: number;
    /** Wordmark font-size. Defaults to 20. */
    wordmarkSize?: number;
    /** Tagline font-size. Defaults to 10. */
    taglineSize?: number;
    /** SVG id prefix — pass a unique one if mounting multiple brands. */
    idPrefix?: string;
}

export default function CrucibleBrand({
    iconSize = 38,
    wordmarkSize = 20,
    taglineSize = 10,
    idPrefix = 'crucible-brand',
}: Props) {
    const flameGradId = `${idPrefix}-flame-grad`;
    const vesselGradId = `${idPrefix}-vessel-grad`;
    const svgInner = Math.round(iconSize * 0.58); // ~58% of box, matches landing

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div
                style={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: Math.round(iconSize * 0.29),
                    background: 'linear-gradient(160deg,#1a0a00 0%,#2d1200 100%)',
                    border: '1px solid rgba(234,88,12,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow:
                        '0 0 14px rgba(234,88,12,0.2), inset 0 1px 0 rgba(255,160,60,0.1)',
                    flexShrink: 0,
                }}
            >
                <svg
                    width={svgInner}
                    height={svgInner}
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id={flameGradId} x1="11" y1="14" x2="11" y2="1" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#ea580c" />
                            <stop offset="55%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#fde68a" />
                        </linearGradient>
                        <linearGradient id={vesselGradId} x1="11" y1="12" x2="11" y2="21" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#78350f" />
                            <stop offset="100%" stopColor="#451a03" />
                        </linearGradient>
                    </defs>
                    {/* Crucible vessel body */}
                    <path
                        d="M5 13 Q4.5 21 11 21 Q17.5 21 17 13 Z"
                        fill={`url(#${vesselGradId})`}
                        stroke="rgba(234,88,12,0.5)"
                        strokeWidth="0.5"
                    />
                    {/* Vessel rim */}
                    <rect x="4" y="12" width="14" height="2" rx="1" fill="#92400e" />
                    {/* Center flame */}
                    <path
                        d="M11 13 C11 13 8.5 10 9 7 C9.5 4 11 2 11 2 C11 2 10 5 11.5 6.5 C12 5 12.5 3.5 13.5 3 C13 5 14 7 13 9 C14.5 7.5 15 5 14.5 3.5 C16 5.5 15.5 9 13.5 11 C14 10 14 9 13.5 8.5 C13 10 12 12 11 13 Z"
                        fill={`url(#${flameGradId})`}
                    />
                    {/* Left small flame */}
                    <path
                        d="M8 13 C8 13 6.5 11 7 9 C7.5 7.5 8.5 7 8.5 7 C8 8.5 8.5 10 9.5 10.5 C9 9 9.5 7.5 10 7 C9.5 8.5 10 10.5 9 12 C9.5 11 9.5 10 9 9.5 C8.5 11 8.5 12 8 13 Z"
                        fill="#f97316"
                        opacity="0.7"
                    />
                </svg>
            </div>
            <div>
                <div
                    style={{
                        fontSize: wordmarkSize,
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        background: 'linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.85) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1.1,
                    }}
                >
                    THE CRUCIBLE
                </div>
                <div
                    style={{
                        fontSize: taglineSize,
                        letterSpacing: '0.18em',
                        background: 'linear-gradient(90deg,#f97316,#fb923c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        marginTop: 2,
                    }}
                >
                    Forge Your Rank
                </div>
            </div>
        </div>
    );
}
