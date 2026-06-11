import { HeadingBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

const Tag: Record<1 | 2 | 3, 'h2' | 'h3' | 'h4'> = { 1: 'h2', 2: 'h3', 3: 'h4' };

// Section heading accent (sky) — distinct from the amber worked-example bar.
const SECTION_ACCENT = '#38bdf8';

export default function HeadingBlockRenderer({ block }: { block: HeadingBlock }) {
  const Heading = Tag[block.level];

  // Levels 1–2 open a sub-topic — mark them with a left accent bar + a tint that
  // fades to the right (§15.2 / heading-band convention), so a new section is
  // unmistakable instead of blending into the prose below. Level 3 stays plain.
  if (block.level <= 2) {
    return (
      <div
        className="mt-9 mb-4 rounded-r-lg pl-4 pr-4 py-2.5"
        style={{
          borderLeft: `3px solid ${SECTION_ACCENT}`,
          background: `linear-gradient(to right, ${SECTION_ACCENT}1F, ${SECTION_ACCENT}0A 45%, transparent 85%)`,
        }}
      >
        <Heading
          className={`${block.level === 1 ? 'text-[26px]' : 'text-[22px]'} font-bold text-white leading-snug tracking-tight m-0`}
        >
          <InlineMarkdown>{block.text}</InlineMarkdown>
        </Heading>
        {block.objective && (
          <p className="mt-1 text-[14px] italic leading-snug text-sky-200/70">
            <InlineMarkdown>{block.objective}</InlineMarkdown>
          </p>
        )}
      </div>
    );
  }

  // Level 3 — sub-sub-section, plain.
  return (
    <Heading className="text-lg font-medium text-sky-300/70 mt-5 mb-2">
      <InlineMarkdown>{block.text}</InlineMarkdown>
    </Heading>
  );
}
