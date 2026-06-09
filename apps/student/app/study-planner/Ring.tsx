'use client';

import type { ReactNode } from 'react';

type Props = {
    pct: number;
    size?: number;
    stroke?: number;
    color?: string;
    track?: string;
    children?: ReactNode;
    glow?: boolean;
};

export function Ring({
    pct = 0, size = 76, stroke = 7, color = 'var(--accent)',
    track = 'rgba(255,255,255,.08)', children, glow = true,
}: Props) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const safe = Math.max(0, Math.min(100, pct));
    const off = c * (1 - safe / 100);
    return (
        <div className="dyp-ring" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={off}
                    style={{
                        transition: 'stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)',
                        filter: glow && safe > 0 ? `drop-shadow(0 0 6px color-mix(in srgb, ${color} 55%, transparent))` : 'none',
                    }}
                />
            </svg>
            <div className="dyp-ring-mid">{children}</div>
        </div>
    );
}
