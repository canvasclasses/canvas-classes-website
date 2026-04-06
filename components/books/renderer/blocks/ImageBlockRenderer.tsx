'use client';

import Image from 'next/image';
import { ImageBlock } from '@/types/books';

const widthClass: Record<NonNullable<ImageBlock['width']>, string> = {
  full: 'w-full',
  half: 'w-1/2 mx-auto',
  third: 'w-1/3 mx-auto',
};

export default function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  const wClass = widthClass[block.width ?? 'full'];

  return (
    <figure className={`${wClass} my-4`}>
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-white/50 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
