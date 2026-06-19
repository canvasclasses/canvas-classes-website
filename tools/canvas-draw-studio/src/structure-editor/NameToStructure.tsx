// "Type a name → draw it" for the Structure Editor.
//
// In the website this called a server route that proxied OPSIN. This local build
// has no server, so it calls EBI's public OPSIN web service directly. That means
// THIS ONE FEATURE needs an internet connection — everything else in the editor
// (drawing, functional groups, tracing, export) works fully offline. If you're
// offline the button just reports the service is unreachable; nothing else breaks.

import { useState } from 'react';
import type { Ketcher } from 'ketcher-core';
import { Wand2 } from 'lucide-react';

const OPSIN_BASE = 'https://www.ebi.ac.uk/opsin/ws';

export default function NameToStructure({ ketcher }: { ketcher: Ketcher | null }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    const query = name.trim();
    if (!query || !ketcher || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${OPSIN_BASE}/${encodeURIComponent(query)}.smi`, {
        headers: { Accept: 'text/plain' },
      });
      if (res.status === 404) {
        setError(`Couldn't understand "${query}". Check the spelling/locants.`);
        return;
      }
      if (!res.ok) {
        setError('Naming service unavailable.');
        return;
      }
      const smiles = (await res.text()).trim();
      if (!smiles) {
        setError(`Couldn't understand "${query}".`);
        return;
      }
      await ketcher.setMolecule(smiles);
    } catch {
      setError('Could not reach the naming service — this feature needs internet.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-b border-white/10 p-4">
      <h2 className="text-sm font-semibold text-white">Generate from name</h2>
      <p className="mt-1 text-xs text-white/50">
        Type an IUPAC name to draw it on the canvas.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') generate();
          }}
          placeholder="e.g. 2-methylbut-2-ene"
          disabled={!ketcher || busy}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0B0F15] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-500/40 disabled:opacity-40"
        />
        <button
          onClick={generate}
          disabled={!ketcher || busy || !name.trim()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-sm font-bold text-black transition disabled:opacity-40"
        >
          <Wand2 className={`h-4 w-4 ${busy ? 'animate-pulse' : ''}`} />
          {busy ? 'Drawing…' : 'Draw'}
        </button>
      </div>
      {error && <div className="mt-2 text-xs text-amber-300">{error}</div>}
      <p className="mt-2 text-[11px] leading-relaxed text-white/30">
        Drawing a name replaces the current canvas. Names resolve via OPSIN
        (needs internet — the rest of the editor works offline).
      </p>
    </div>
  );
}
