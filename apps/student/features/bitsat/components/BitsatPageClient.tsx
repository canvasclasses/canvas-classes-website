'use client';

import { Suspense, useState, type ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import CutoffTable from './CutoffTable';
import BitsatScoreAnalytics from './BitsatScoreAnalytics';
import PredictorExperience from '@/features/college-predictor/predictor-design/PredictorExperience';
import type { BitsatIteration } from '../data/iterationCutoffs';
import { BITSAT_ACCENT, DISPLAY_FONT, MONO_FONT, PANEL_BG, PANEL_BORDER, Eyebrow } from './ui';

type Section = 'cutoffs' | 'analytics' | 'predictor';

// The three features carry their own explanation — these cards ARE the
// navigation, so a first-time visitor understands the page without a hero.
const FEATURES: { id: Section; label: string; desc: string; icon: ReactNode }[] = [
  {
    id: 'cutoffs',
    label: 'Iteration Cutoffs',
    desc: 'Closing scores for every branch — 2024 to 2026, across BITS Pilani, Goa & Hyderabad.',
    icon: <BarsIcon />,
  },
  {
    id: 'analytics',
    label: 'Score Analytics',
    desc: 'Live distribution of real candidate scores — average, percentiles and where you stand.',
    icon: <PulseIcon />,
  },
  {
    id: 'predictor',
    label: 'College Predictor',
    desc: 'Enter your BITSAT score and see Safe · Target · Reach branches across all campuses.',
    icon: <TargetIcon />,
  },
];

function sectionFromParam(value: string | null): Section {
  if (value === 'analytics' || value === 'predictor') return value;
  return 'cutoffs';
}

interface Props {
  iterations: BitsatIteration[];
}

function Inner({ iterations }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<Section>(sectionFromParam(searchParams.get('section')));

  function pick(next: Section) {
    setActive(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'cutoffs') params.delete('section');
    else params.set('section', next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pt-24">
      {/* Compact kicker — context only, no hero */}
      <div className="mb-7 flex justify-center">
        <Eyebrow>BITSAT 2026 · Canvas Classes</Eyebrow>
      </div>

      {/* Feature selector — self-explanatory cards that double as the nav */}
      <div role="tablist" aria-label="BITSAT tools" className="grid gap-3 sm:grid-cols-3">
        {FEATURES.map((f) => {
          const on = active === f.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => pick(f.id)}
              className="group relative flex cursor-pointer flex-col items-center rounded-2xl p-5 text-center transition-all duration-200"
              style={{
                background: on
                  ? 'linear-gradient(180deg, rgba(245,158,11,0.10), rgba(245,158,11,0.02))'
                  : PANEL_BG,
                border: on ? '1px solid rgba(245,158,11,0.45)' : PANEL_BORDER,
                boxShadow: on ? '0 14px 36px -20px rgba(245,158,11,0.55)' : 'none',
              }}
            >
              <span
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                style={{
                  background: on ? `${BITSAT_ACCENT}1f` : 'rgba(255,255,255,0.05)',
                  color: on ? BITSAT_ACCENT : '#8a8a96',
                  border: on ? `1px solid ${BITSAT_ACCENT}55` : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {f.icon}
              </span>
              <span
                style={{ fontFamily: DISPLAY_FONT, fontSize: 17.5, fontWeight: 600, letterSpacing: '-0.01em' }}
                className={on ? 'text-white' : 'text-zinc-200'}
              >
                {f.label}
              </span>
              <span className="mt-1.5 max-w-[260px] text-[12.5px] leading-relaxed text-zinc-500">
                {f.desc}
              </span>
              <span
                className="mt-3.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{ fontFamily: MONO_FONT, color: on ? BITSAT_ACCENT : '#6b6b76' }}
              >
                {on ? 'Viewing ↓' : 'Open →'}
              </span>
              {/* active bottom accent */}
              {on && (
                <span
                  aria-hidden
                  className="absolute inset-x-6 -bottom-px h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${BITSAT_ACCENT}, transparent)` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected feature */}
      <div role="tabpanel" className="mt-10 border-t border-white/5 pt-10">
        {active === 'cutoffs' && <CutoffTable iterations={iterations} />}
        {active === 'analytics' && <BitsatScoreAnalytics />}
        {active === 'predictor' && (
          <Suspense
            fallback={<div className="h-96 animate-pulse rounded-2xl border border-white/5 bg-[#0B0F15]" />}
          >
            {/* Live, maintained predictor locked to BITSAT — no JEE selector. */}
            <PredictorExperience lockExam="bitsat" />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default function BitsatPageClient({ iterations }: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 pt-16">
          <div className="h-96 animate-pulse rounded-2xl border border-white/5 bg-[#0B0F15]" />
        </div>
      }
    >
      <Inner iterations={iterations} />
    </Suspense>
  );
}

// ── Inline feature icons (stroke, inherit color) ─────────────────────────────
function BarsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 19V11M12 19V5M19 19v-6" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
