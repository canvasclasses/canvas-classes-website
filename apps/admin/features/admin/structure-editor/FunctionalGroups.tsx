'use client';

// Dedicated quick-insert buttons for the functional groups that come up most in
// JEE/NEET organic chemistry. Each button hands Ketcher's OWN functional-group
// template (the authoritative molfile in functionalGroupTemplates.ts, carrying
// the collapsed-abbreviation S-group + attachment point) to the native template
// tool. Result = exactly the native behaviour: click a button to "arm" the
// group, then click a bond terminal/atom on the canvas and it attaches as the
// proper literature abbreviation (NO₂, not N+2 O's), balancing valences.
//
// Falls back to addFragment() if the template tool isn't reachable, which still
// drops the correct collapsed abbreviation (just without click-to-attach).

import { useState } from 'react';
import type { Ketcher } from 'ketcher-core';
import { FG_TEMPLATES, type FgTemplate } from './functionalGroupTemplates';

export default function FunctionalGroups({
  ketcher,
  molfileToStruct,
}: {
  ketcher: Ketcher | null;
  molfileToStruct: ((mol: string) => unknown) | null;
}) {
  const [active, setActive] = useState<string | null>(null);

  async function place(t: FgTemplate) {
    if (!ketcher || !molfileToStruct) return;
    try {
      const struct = molfileToStruct(t.mol);
      const editor = (ketcher as unknown as {
        editor?: { tool?: (name: string, opts?: object) => void };
      }).editor;
      if (editor?.tool && struct) {
        // Arm the template tool — the next click on the canvas places/attaches it.
        editor.tool('template', { struct });
        setActive(t.label);
      } else {
        await ketcher.addFragment(t.mol);
      }
    } catch (e) {
      console.error('functional group placement failed', e);
      try {
        await ketcher.addFragment(t.mol);
      } catch {
        /* give up quietly */
      }
    }
  }

  return (
    <div className="border-b border-white/10 p-4">
      <h2 className="text-sm font-semibold text-white">Functional groups</h2>
      <p className="mt-1 text-xs text-white/50">
        Click a group, then click a bond end / atom on the canvas to attach it.
      </p>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {FG_TEMPLATES.map((t) => (
          <button
            key={t.label}
            title={t.title}
            onClick={() => place(t)}
            disabled={!ketcher}
            className={`rounded-lg border px-1 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
              active === t.label
                ? 'border-orange-400/60 bg-orange-500/15 text-orange-200'
                : 'border-white/10 bg-white/5 text-white/80 hover:border-orange-400/40 hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {active && (
        <p className="mt-2 text-[11px] leading-relaxed text-orange-300/80">
          {active} armed — click a bond end or atom to attach it. Pick another
          tool (e.g. a bond) to stop.
        </p>
      )}
    </div>
  );
}
