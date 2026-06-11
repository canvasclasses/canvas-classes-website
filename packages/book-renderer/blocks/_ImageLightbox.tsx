'use client';

import { useEffect } from 'react';

/**
 * Full-screen image viewer (§15.6 tap-to-zoom). Shared by ImageBlockRenderer
 * and the gallery block. Tap/click anywhere, the ✕, or Esc to close. Locks body
 * scroll while open. Renders the raw `src` at full resolution so dense
 * infographics and portrait images become legible.
 */
export default function ImageLightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image'}
    >
      <button
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center
          text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        ✕
      </button>
      <figure
        className="max-w-full max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[88vh] object-contain rounded-lg select-none"
          draggable={false}
        />
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-white/55 italic max-w-2xl">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
