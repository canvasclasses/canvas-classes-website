'use client';

import { VideoBlock } from '@/types/books';

export default function VideoBlockRenderer({ block }: { block: VideoBlock }) {
  return (
    <figure className="my-4">
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black aspect-video">
        {block.provider === 'r2_direct' && (
          <video
            src={block.src}
            poster={block.poster}
            controls
            preload="metadata"
            className="w-full h-full object-contain"
            playsInline
          />
        )}

        {block.provider === 'cloudflare_stream' && (
          <iframe
            src={`https://customer-stream.cloudflarestream.com/${block.src}/iframe`}
            className="w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}

        {block.provider === 'youtube_nocookie' && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${block.src}?rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
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
