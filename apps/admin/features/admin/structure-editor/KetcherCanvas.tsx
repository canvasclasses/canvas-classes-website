'use client';

// The actual Ketcher embed. This module is imported ONLY through a
// `dynamic(() => import('./KetcherCanvas'), { ssr: false })` call in
// StructureEditorClient, so neither Ketcher's React bundle nor the
// ketcher-standalone Indigo/WASM worker is ever evaluated on the server.
//
// Engine: ketcher-standalone runs the full Indigo cheminformatics toolkit in a
// blob web worker (no backend). The CSP in apps/admin/next.config.ts grants the
// `worker-src 'self' blob:` + `connect-src blob:` this needs.

import { useState } from 'react';
import { Editor } from 'ketcher-react';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';
import * as KetcherCore from 'ketcher-core';
import type { Ketcher } from 'ketcher-core';
import 'ketcher-react/dist/index.css';

// Render every element symbol in black instead of Ketcher's default CPK palette
// (N blue, O red, S amber, Cl green, …). `ElementColor` is a runtime export of
// ketcher-core — a single shared label→color map that BOTH the atoms toolbar
// (each button's text colour) and the canvas atom labels read from. ketcher-core
// is a singleton in node_modules, so blanking this map once, before the Editor
// mounts, turns the whole editor monochrome. (It isn't in ketcher-core's typings,
// hence the cast.) This module is only ever loaded client-side via a
// dynamic(ssr:false) import, so this runs once in the browser before first paint.
const ElementColor = (KetcherCore as unknown as {
  ElementColor?: Record<string, string>;
}).ElementColor;
if (ElementColor) {
  for (const key of Object.keys(ElementColor)) ElementColor[key] = '#000';
}

// MolSerializer turns a Ketcher Struct (e.g. the current selection) into a
// molfile string for image export. It's grabbed from the SAME ketcher-core
// instance this module already imports — and passed UP to the export toolbar —
// so ketcher-core is never imported a second time. A separate dynamic
// import('ketcher-core') elsewhere would split this large module across chunks
// and corrupt webpack's runtime ("Cannot read properties of undefined (reading
// 'call')"). One import only.
const MolSerializer = (KetcherCore as unknown as {
  MolSerializer: new () => {
    serialize: (struct: unknown) => string;
    deserialize: (mol: string) => unknown;
  };
}).MolSerializer;

export type KetcherApi = {
  serializeStruct: (struct: unknown) => string;
  // Parse a molfile (e.g. a functional-group template) into a Ketcher Struct,
  // for handing to the template tool. Uses the same single ketcher-core import.
  molfileToStruct: (mol: string) => unknown;
};

export default function KetcherCanvas({
  onInit,
}: {
  onInit: (ketcher: Ketcher, api: KetcherApi) => void;
}) {
  // Construct the standalone provider once, lazily, on the client only.
  const [structServiceProvider] = useState(
    () => new StandaloneStructServiceProvider(),
  );

  return (
    <Editor
      staticResourcesUrl=""
      // Small-molecule organic drawing only — hide the peptide/RNA/polymer
      // "macromolecules" mode and its mode toggle entirely.
      disableMacromoleculesEditor
      structServiceProvider={structServiceProvider}
      errorHandler={(message: string) => {
        // Ketcher surfaces engine/parse errors here. Log for diagnostics; the
        // editor already shows its own in-canvas toast to the author.
        console.error('[Ketcher]', message);
      }}
      onInit={(ketcher: Ketcher) => {
        // Expose for ad-hoc console debugging, mirroring Ketcher's own docs.
        (window as unknown as { ketcher?: Ketcher }).ketcher = ketcher;
        // Default the Miew 3D viewer to its dark background. Its default 'light'
        // theme is a pale grey on which Miew's light bonds are nearly invisible
        // (low contrast). miewTheme isn't in the public setSettings whitelist, so
        // set it straight on the editor (setOptions merges — other settings keep).
        try {
          (ketcher.editor as unknown as { setOptions?: (o: string) => void })
            .setOptions?.(JSON.stringify({ miewTheme: 'dark' }));
        } catch {
          /* non-fatal — the user can still switch it in Settings → 3D Viewer */
        }
        onInit(ketcher, {
          serializeStruct: (struct) => new MolSerializer().serialize(struct),
          molfileToStruct: (mol) => new MolSerializer().deserialize(mol),
        });
      }}
    />
  );
}
