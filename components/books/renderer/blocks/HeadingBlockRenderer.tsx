'use client';

import { HeadingBlock } from '@/types/books';

const levelClasses: Record<1 | 2 | 3, string> = {
  1: 'text-2xl font-bold text-white mt-8 mb-3',
  2: 'text-xl font-semibold text-white/90 mt-6 mb-2',
  3: 'text-lg font-medium text-white/80 mt-4 mb-2',
};

const Tag: Record<1 | 2 | 3, 'h2' | 'h3' | 'h4'> = { 1: 'h2', 2: 'h3', 3: 'h4' };

export default function HeadingBlockRenderer({ block }: { block: HeadingBlock }) {
  const Heading = Tag[block.level];
  return (
    <Heading className={levelClasses[block.level]}>
      {block.text}
    </Heading>
  );
}
