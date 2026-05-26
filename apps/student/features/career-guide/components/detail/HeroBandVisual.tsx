/*
 * HeroBandVisual — the thin animated strip running across the top of the
 * career-detail hero. Reuses one of the 12 per-career SVG visuals from the
 * index page (apps/student/features/career-guide/components/visuals.tsx)
 * so each career detail-page still has its own visual signature without
 * needing a second set of bespoke illustrations.
 *
 * The reused visual is rendered inside a fixed-aspect container with
 * `preserveAspectRatio` and a mask that fades the edges. Result: the
 * 400×132 index-page illustration becomes a 1400×64 fading strip.
 */

import { Visuals, type VisualKey } from '../visuals';

interface Props {
  visualKey: VisualKey;
}

export default function HeroBandVisual({ visualKey }: Props) {
  const Component = Visuals[visualKey];
  if (!Component) return null;
  return (
    <div className="cd-hero-band" aria-hidden>
      {/* The inner Visual fills the 64px-tall band. We let the SVG inside
          (which uses preserveAspectRatio="xMidYMid slice") stretch the
          illustration to fit. The CSS mask-image on .cd-hero-band fades
          the top + bottom edges so the band feels embedded in the page. */}
      <div style={{ width: '100%', height: '100%' }}>
        <Component />
      </div>
    </div>
  );
}
