'use client';

/**
 * WatermarkOverlay
 *
 * Renders a subtle, non-obstructive tiled watermark over any positioned container.
 * Usage: wrap the page content in a `relative` div and place <WatermarkOverlay /> inside it.
 *
 * - pointer-events: none  → clicks pass through completely
 * - user-select: none     → text selection unaffected
 * - opacity: 0.045        → barely visible on dark bg, clearly visible in screenshots
 * - CSS-only, no JS animation → zero performance cost
 *
 * Props:
 *   userLabel  — optional string (e.g. email) shown as a second layer of moving text
 *                If omitted, only the logo tile is shown.
 */

interface WatermarkOverlayProps {
  userLabel?: string;
}

export default function WatermarkOverlay({ userLabel }: WatermarkOverlayProps) {
  return (
    <>
      {/* ── Layer 1: Tiled logo grid ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          overflow: 'hidden',
          opacity: 0.045,
          backgroundImage: `url(/logo.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '140px auto',
          backgroundPosition: '0 0',
          transform: 'rotate(-25deg) scale(1.6)',
          transformOrigin: 'center center',
          filter: 'grayscale(1) brightness(2)',
        }}
      />

      {/* ── Layer 2: Drifting user-label (only when userLabel is provided) ── */}
      {userLabel && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 41,
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            overflow: 'hidden',
            opacity: 0.07,
          }}
        >
          {/* Render a grid of drifting labels — CSS animation, no JS */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {DRIFT_POSITIONS.map((pos, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.9)',
                  whiteSpace: 'nowrap',
                  transform: 'rotate(-25deg)',
                  animation: `wm-drift-${i % 3} ${14 + (i % 5) * 2}s linear infinite`,
                  fontFamily: 'monospace',
                }}
              >
                {userLabel}
              </span>
            ))}
          </div>

          <style>{`
            @keyframes wm-drift-0 {
              0%   { transform: rotate(-25deg) translateX(0px)   translateY(0px); }
              25%  { transform: rotate(-25deg) translateX(18px)  translateY(8px); }
              50%  { transform: rotate(-25deg) translateX(8px)   translateY(18px); }
              75%  { transform: rotate(-25deg) translateX(-10px) translateY(10px); }
              100% { transform: rotate(-25deg) translateX(0px)   translateY(0px); }
            }
            @keyframes wm-drift-1 {
              0%   { transform: rotate(-25deg) translateX(0px)   translateY(0px); }
              33%  { transform: rotate(-25deg) translateX(-14px) translateY(12px); }
              66%  { transform: rotate(-25deg) translateX(12px)  translateY(-8px); }
              100% { transform: rotate(-25deg) translateX(0px)   translateY(0px); }
            }
            @keyframes wm-drift-2 {
              0%   { transform: rotate(-25deg) translateX(0px)  translateY(0px); }
              50%  { transform: rotate(-25deg) translateX(20px) translateY(-14px); }
              100% { transform: rotate(-25deg) translateX(0px)  translateY(0px); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

// Pre-computed grid positions for the drifting label layer
// Spread across the viewport in a staggered pattern
const DRIFT_POSITIONS: { x: string; y: string }[] = [
  { x: '5%',  y: '8%'  }, { x: '35%', y: '5%'  }, { x: '65%', y: '10%' }, { x: '88%', y: '6%'  },
  { x: '12%', y: '22%' }, { x: '45%', y: '20%' }, { x: '75%', y: '25%' }, { x: '92%', y: '22%' },
  { x: '3%',  y: '38%' }, { x: '28%', y: '35%' }, { x: '55%', y: '40%' }, { x: '80%', y: '37%' },
  { x: '18%', y: '52%' }, { x: '48%', y: '55%' }, { x: '70%', y: '50%' }, { x: '90%', y: '54%' },
  { x: '8%',  y: '68%' }, { x: '38%', y: '65%' }, { x: '62%', y: '70%' }, { x: '85%', y: '67%' },
  { x: '22%', y: '80%' }, { x: '50%', y: '78%' }, { x: '72%', y: '83%' }, { x: '95%', y: '80%' },
  { x: '10%', y: '92%' }, { x: '40%', y: '90%' }, { x: '68%', y: '94%' }, { x: '88%', y: '91%' },
];
