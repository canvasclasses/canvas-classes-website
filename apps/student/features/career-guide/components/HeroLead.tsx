'use client';

/*
 * HeroLead — the lead paragraph under the headline that contains a rotating
 * word (cycles through "obsolete / automated / transforming / emerging /
 * underrated" every 2.2s).
 *
 * The rotation is a small interaction signal — the page is alive, the
 * landscape is shifting — without being noisy. State + useEffect mean this
 * is a client component, but it's leaf-level and tiny, so it doesn't
 * meaningfully expand the client bundle.
 */

import { useEffect, useState } from 'react';

const ROTATE_WORDS = ['obsolete', 'automated', 'transforming', 'emerging', 'underrated'] as const;

export default function HeroLead() {
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % ROTATE_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  const word = ROTATE_WORDS[wordIdx];

  return (
    <p className="max-w-[720px] text-[18px] leading-[1.55] text-white/65 m-0">
      Five years ago, half the jobs on this page didn&apos;t exist. Three of the careers your relatives still
      recommend are quietly being{' '}
      <b style={{ color: 'var(--cg-accent)' }}>{word}</b> by AI right now.{' '}
      <b className="text-white font-medium">Honest career briefs</b> for students picking a college this
      admissions season — written by editors who interview practitioners, not assembled from a coaching-
      institute template.
    </p>
  );
}
