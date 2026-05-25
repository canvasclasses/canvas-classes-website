'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import PredictorClient from './PredictorClient';
import BitsatPredictorClient from '../bitsat/BitsatPredictorClient';

// Two predictors share the same /college-predictor URL and surface, switched
// via a `?tool=` query param. The default (JEE Main) stays at the URL without
// any tool param so existing shared links keep working.

type Tool = 'jeemain' | 'bitsat';

function useToolFromUrl(): [Tool, (next: Tool) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get('tool');
  const tool: Tool = param === 'bitsat' ? 'bitsat' : 'jeemain';

  function setTool(next: Tool) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'jeemain') params.delete('tool');
    else params.set('tool', 'bitsat');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return [tool, setTool];
}

function Inner() {
  const [tool, setTool] = useToolFromUrl();
  // Local state mirrors the URL so the tab visually updates immediately on click
  // (router.replace is async). On mount, hydrate from the URL.
  const [active, setActive] = useState<Tool>(tool);
  function pick(next: Tool) {
    setActive(next);
    setTool(next);
  }

  return (
    <div>
      <div role="tablist" className="flex items-center gap-1 p-1 mb-5 rounded-full bg-white/5 border border-white/10 w-fit">
        <button
          role="tab"
          aria-selected={active === 'jeemain'}
          type="button"
          onClick={() => pick('jeemain')}
          className={`px-4 py-1.5 text-xs md:text-sm font-medium rounded-full transition-colors ${
            active === 'jeemain'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black'
              : 'text-zinc-300 hover:bg-white/5'
          }`}
        >
          JEE Main (NIT · IIIT · GFTI)
        </button>
        <button
          role="tab"
          aria-selected={active === 'bitsat'}
          type="button"
          onClick={() => pick('bitsat')}
          className={`px-4 py-1.5 text-xs md:text-sm font-medium rounded-full transition-colors ${
            active === 'bitsat'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black'
              : 'text-zinc-300 hover:bg-white/5'
          }`}
        >
          BITSAT (BITS Pilani · Goa · Hyderabad)
        </button>
      </div>

      {active === 'jeemain' ? <PredictorClient /> : <BitsatPredictorClient />}
    </div>
  );
}

export default function ToolTabSwitcher() {
  return (
    <Suspense fallback={<div className="h-96 rounded-2xl bg-[#0B0F15] border border-white/5 animate-pulse" />}>
      <Inner />
    </Suspense>
  );
}
