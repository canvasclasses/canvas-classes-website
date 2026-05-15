'use client';

import { useEffect, useState } from 'react';
import { AnimationBlock } from '@/types/books';

const widthClass: Record<NonNullable<AnimationBlock['width']>, string> = {
  full: 'w-full',
  half: 'w-1/2 mx-auto',
};

export default function AnimationBlockRenderer({ block }: { block: AnimationBlock }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [LottiePlayer, setLottiePlayer] = useState<React.ComponentType<any> | null>(null);
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    // Dynamically import lottie-react to avoid SSR issues
    import('lottie-react').then((mod) => {
      setLottiePlayer(() => mod.default);
    });

    // If src is a .json URL, fetch the animation data
    if (block.src.endsWith('.json') || block.src.includes('.json')) {
      fetch(block.src)
        .then((r) => r.json())
        .then(setAnimationData)
        .catch(() => setAnimationData(null));
    }
  }, [block.src]);

  const wClass = widthClass[block.width ?? 'full'];

  if (!LottiePlayer) {
    return (
      <div className={`${wClass} my-4 aspect-video bg-[#0B0F15] border border-white/10 rounded-xl
        flex items-center justify-center`}>
        <span className="text-white/30 text-sm">Loading animation…</span>
      </div>
    );
  }

  return (
    <figure className={`${wClass} my-4`}>
      <div className="rounded-xl overflow-hidden border border-white/10">
        {animationData ? (
          <LottiePlayer
            animationData={animationData}
            loop={block.loop}
            autoplay={block.autoplay}
            className="w-full"
          />
        ) : (
          <LottiePlayer
            path={block.src}
            loop={block.loop}
            autoplay={block.autoplay}
            className="w-full"
          />
        )}
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-white/50 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
