'use client';

import React from 'react';

// Icons ported verbatim from the design bundle (practice/ui.jsx).
type IP = React.SVGProps<SVGSVGElement>;
export const Icon = {
  bolt: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" /></svg>),
  flame: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3c.5 3-2 4-2 7a2 2 0 0 0 4 0c0-.8-.3-1.4-.3-1.4 2 1 3.3 3 3.3 5.4a5 5 0 1 1-10 0C7 10 11 9 12 3Z" fill="currentColor" /></svg>),
  star: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="m12 2 2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2Z" fill="currentColor" /></svg>),
  check: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="m20 6-11 11-5-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  arrow: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  arrowleft: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  play: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 5v14l11-7L7 5Z" fill="currentColor" /></svg>),
  target: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></svg>),
  pen: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 20h4L19 9l-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m14 6 4 4" stroke="currentColor" strokeWidth="1.8" /></svg>),
  blocks: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" /></svg>),
  brain: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V16a3 3 0 0 0 4 2.8M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V16a3 3 0 0 1-4 2.8M12 5v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  lock: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" /></svg>),
  trophy: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3M9 14h6l-1 3h-4l-1-3ZM8 20h8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" /></svg>),
  sparkle: (p: IP) => (<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3c.6 4 1.8 5.4 6 6-4.2.6-5.4 2-6 6-.6-4-1.8-5.4-6-6 4.2-.6 5.4-2 6-6Z" fill="currentColor" /></svg>),
};

// Circular progress ring. value 0..1
export function Ring({
  value, size = 120, stroke = 11, gid = 'rg', from = '#a855f7', to = '#ec4899',
  track = 'rgba(255,255,255,0.08)', children,
}: {
  value: number; size?: number; stroke?: number; gid?: string;
  from?: string; to?: string; track?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div className="ringwrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${gid})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="center">{children}</div>
    </div>
  );
}

export function StarRow({ count = 3, filled = 0, size = 22, gap = 5 }: { count?: number; filled?: number; size?: number; gap?: number }) {
  return (
    <div style={{ display: 'flex', gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: i < filled ? 'var(--gold)' : 'var(--surface-3)', display: 'grid' }}>
          <Icon.star style={{ width: size, height: size }} />
        </span>
      ))}
    </div>
  );
}

// Confetti burst on the #phub-confetti canvas (ported from the design bundle).
export function fireConfetti(opts: { x?: number; y?: number; count?: number } = {}) {
  const canvas = document.getElementById('phub-confetti') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const W = (canvas.width = window.innerWidth * dpr);
  const H = (canvas.height = window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  const colors = ['#a855f7', '#ec4899', '#4cc6f5', '#fbbf3c', '#3ddc97', '#ffffff'];
  const cx = (opts.x ?? 0.5) * W, cy = (opts.y ?? 0.32) * H;
  const N = opts.count ?? 150;
  const parts = Array.from({ length: N }).map(() => {
    const a = Math.random() * Math.PI * 2;
    const sp = (4 + Math.random() * 9) * dpr;
    return {
      x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6 * dpr,
      g: (0.18 + Math.random() * 0.12) * dpr, s: (5 + Math.random() * 7) * dpr,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0], life: 0, max: 90 + Math.random() * 50,
      shape: Math.random() < 0.5 ? 'rect' : 'circ',
    };
  });
  let raf = 0;
  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of parts) {
      p.life++; if (p.life > p.max) continue;
      alive = true;
      p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      ctx.fillStyle = p.c;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.shape === 'rect') ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (alive) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  }
  cancelAnimationFrame(raf);
  tick();
}
