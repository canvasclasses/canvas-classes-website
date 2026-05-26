'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';

// Share button + preview modal for the Parent Brief PNG.
//
// Mirrors the pattern in apps/student/features/college-predictor/components/
// ShareCardButton.tsx: opens a modal with the live preview, then either
// (a) uses the Web Share API to push the PNG into WhatsApp / family chat groups
// on mobile, or (b) downloads the file on desktop where Share API doesn't
// support files.
//
// Deliberately quieter visual than the college-predictor share button — the
// career brief is more parent-conversation than viral-sharing.

interface Props {
  slug: string;
  displayName: string;
  className?: string;
}

export default function CareerBriefShareButton({ slug, displayName, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const briefUrl = `/api/v2/career-guide/${slug}/brief`;
  const filename = `canvas-career-${slug}.png`;

  async function handleShare() {
    setSharing(true);
    setFeedback(null);
    try {
      const res = await fetch(briefUrl);
      if (!res.ok) throw new Error('Image fetch failed');
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      const canShareFiles =
        typeof navigator !== 'undefined' &&
        'canShare' in navigator &&
        navigator.canShare?.({ files: [file] });

      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: `Career brief: ${displayName}`,
          text: `Honest career brief on ${displayName} — Canvas Classes`,
        });
        setFeedback('Shared!');
      } else {
        // Desktop fallback — trigger a file download. Same UX as the college-
        // predictor share-card; works in every browser.
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = filename;
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
          'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/80 transition-colors hover:border-orange-400/40 hover:bg-white/[0.06] hover:text-white'
        }
        aria-label="Share this career brief with parents"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share with parents
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F15]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/5 p-5">
              <div>
                <div className="text-base font-semibold text-white">Career brief preview</div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  {displayName} · 1080×1920 vertical PNG. Save it and send on WhatsApp.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-2 text-xl leading-none text-zinc-500 transition-colors hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {/* Preview — endpoint returns a 1080×1920 PNG, displayed at
                  responsive size. loading="eager" because the user clicked
                  expecting an image. */}
              <div className="relative overflow-hidden rounded-xl bg-black/50" style={{ aspectRatio: '9 / 16' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={briefUrl}
                  alt={`Career brief: ${displayName}`}
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-white/5 bg-black/20 px-5 py-4">
              <span className="text-[11px] text-zinc-500">
                {feedback ?? 'Vertical format — ideal for WhatsApp Status + chat'}
              </span>
              <button
                type="button"
                onClick={handleShare}
                disabled={sharing}
                className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
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
