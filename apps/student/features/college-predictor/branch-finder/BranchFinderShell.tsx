'use client';

// Client shell that owns the state shared between the scatter cloud and the
// "reality check" section, so the cloud's "See the real picture" button can
// pre-load a branch in the section and scroll to it.

import { useRef, useState } from 'react';
import BranchFinderExperience from './BranchFinderExperience';
import CareerRealitySection from './CareerRealitySection';

// Manual smooth scroll. Native `scroll-behavior: smooth` / `behavior:'smooth'`
// are no-ops site-wide because `body` has `overflow-x: hidden` (globals.css),
// which makes the body a scroll container and breaks smooth viewport scrolling.
// We tween with per-frame instant scrollTo, which works regardless. The rAF
// timestamp drives easing (no Date.now / Math.random — both banned here).
function smoothScrollTo(targetY: number, duration = 480) {
  const startY = window.scrollY;
  const dist = targetY - startY;
  if (Math.abs(dist) < 2) return;
  let startTs: number | null = null;
  const step = (ts: number) => {
    if (startTs === null) startTs = ts;
    const p = Math.min(1, (ts - startTs) / duration);
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
    window.scrollTo(0, startY + dist * ease);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function BranchFinderShell() {
  const [realityId, setRealityId] = useState('cse');
  const sectionRef = useRef<HTMLDivElement>(null);

  const goToReality = (id: string) => {
    setRealityId(id);
    // The section's top is fixed (card content grows downward), so we can read
    // its offset on the next frame and tween to it.
    requestAnimationFrame(() => {
      const el = sectionRef.current;
      if (!el) return;
      const targetY = el.getBoundingClientRect().top + window.scrollY - 8;
      smoothScrollTo(targetY);
    });
  };

  return (
    <>
      <BranchFinderExperience onSeeReality={goToReality} />
      <div ref={sectionRef} style={{ scrollMarginTop: 20, paddingTop: 72, marginTop: 28 }}>
        <CareerRealitySection selectedId={realityId} onSelect={setRealityId} />
      </div>
    </>
  );
}
