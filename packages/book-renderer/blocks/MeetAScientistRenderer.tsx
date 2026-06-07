'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MeetAScientistBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

/**
 * Meet a Scientist / Meet the Author — biographical card. Always shows the
 * portrait (or an initials fallback while no image is generated), identity, and
 * the main contribution; the chapter connection, fun detail, and learn-more are
 * revealed on demand to keep the page tidy. Markdown fields render via
 * InlineMarkdown. Read-only in the admin editor — authored by book-build scripts.
 */

const ACCENT = '#f5a623'; // warm amber — matches the portraits' sepia tone + brand

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function Section({ label, children }: { label: string; children: string }) {
  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(245,166,35,0.7)' }}>
        {label}
      </div>
      <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/72">
        {children}
      </InlineMarkdown>
    </div>
  );
}

export default function MeetAScientistRenderer({ block }: { block: MeetAScientistBlock }) {
  const [expanded, setExpanded] = useState(false);
  const hasPortrait = !!block.portrait_src;

  return (
    <div
      className="my-6 rounded-2xl px-5 py-4"
      style={{ background: 'rgba(245,166,35,0.04)', border: '1.5px solid rgba(245,166,35,0.2)' }}
    >
      <div className="flex items-start gap-4">
        {/* Portrait, or initials fallback while no image is generated yet */}
        <div
          className="flex-shrink-0 rounded-xl overflow-hidden"
          style={{ width: 72, height: 72, background: 'rgba(245,166,35,0.1)' }}
        >
          {hasPortrait ? (
            <Image
              src={block.portrait_src as string}
              alt={block.name}
              width={72}
              height={72}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[24px] font-bold" style={{ color: ACCENT }}>
              {initials(block.name)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(245,166,35,0.65)' }}>
            Meet {block.nationality ? `the ${block.nationality}` : 'the'} mind
          </div>
          <div className="text-[16px] font-bold text-white leading-tight">{block.name}</div>
          <div className="text-[12px] text-white/45 mb-2">
            {block.years}
            {block.nationality ? ` · ${block.nationality}` : ''}
          </div>

          <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/78">
            {block.contribution}
          </InlineMarkdown>

          {expanded && (
            <>
              <Section label="Why it's here">{block.connection}</Section>
              <Section label="Did you know?">{block.fun_detail}</Section>
              <Section label="Learn more">{block.learn_more}</Section>
            </>
          )}

          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[12px] font-semibold mt-2"
            style={{ color: 'rgba(245,166,35,0.8)' }}
          >
            {expanded ? 'Show less ↑' : 'Read more →'}
          </button>
        </div>
      </div>
    </div>
  );
}
