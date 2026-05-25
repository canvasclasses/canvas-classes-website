'use client';

import { useState } from 'react';

// One button that:
//   1. Opens a modal with the generated share-card preview.
//   2. Offers "Share to WhatsApp" (Web Share API on mobile, fallback to copy).
//   3. Offers "Download image" (works everywhere).
//
// Used by both predictors — caller passes a params object that gets serialized
// into the share-card endpoint URL.

interface Props {
  /**
   * Params to pass to /api/v2/college-predictor/share-card. Caller's
   * responsibility to set `tool` and the right inputs for that tool.
   */
  params: Record<string, string | number | undefined>;
  className?: string;
}

function buildShareCardUrl(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  return `/api/v2/college-predictor/share-card?${sp.toString()}`;
}

export default function ShareCardButton({ params, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const url = buildShareCardUrl(params);

  async function handleShare() {
    setSharing(true);
    setFeedback(null);
    try {
      // Fetch the image as a Blob to attach to a Web Share or a download.
      const res = await fetch(url);
      if (!res.ok) throw new Error('Image fetch failed');
      const blob = await res.blob();
      const file = new File([blob], 'canvas-predictor.png', { type: 'image/png' });

      // Web Share API (level 2: files). Mobile Safari + Android Chrome.
      const canShareFiles =
        typeof navigator !== 'undefined' &&
        'canShare' in navigator &&
        navigator.canShare?.({ files: [file] });

      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: 'My college predictor results',
          text: 'Predicted top colleges via Canvas Classes',
        });
        setFeedback('Shared!');
      } else {
        // Desktop fallback: trigger a download.
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = 'canvas-predictor.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objUrl);
        setFeedback('Image downloaded');
      }
    } catch (err) {
      console.error(err);
      setFeedback('Share failed — please try again');
    } finally {
      setSharing(false);
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-zinc-200 transition-colors'
        }
        aria-label="Share prediction with parents"
      >
        Share with parents
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#0B0F15] border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-white/5">
              <div>
                <div className="text-base font-semibold text-white">Share with parents</div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  A clean summary image. Save it to your phone and send on WhatsApp.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors text-xl leading-none px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {/* Preview — the route returns a 1080×1080 PNG, displayed at
                  responsive size. Use loading="eager" since the user clicked
                  expecting an image. */}
              <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-square">
                <img
                  src={url}
                  alt="College predictor share card"
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-white/5 bg-black/20">
              <span className="text-[11px] text-zinc-500">
                {feedback ?? '1080×1080 · ideal for WhatsApp'}
              </span>
              <button
                type="button"
                onClick={handleShare}
                disabled={sharing}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs disabled:opacity-60 transition-opacity hover:opacity-90"
              >
                {sharing ? 'Preparing…' : 'Share or download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
