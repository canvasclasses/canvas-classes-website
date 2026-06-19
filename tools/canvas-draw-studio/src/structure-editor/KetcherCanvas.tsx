// The Ketcher embed. Ported verbatim from the admin app, minus the Next 'use
// client' directive (Vite has no SSR, so the module is always client-side).
//
// Engine: ketcher-standalone runs the full Indigo cheminformatics toolkit in a
// blob web worker — no backend, fully offline.

import { useState } from 'react';
import { Editor } from 'ketcher-react';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';
import * as KetcherCore from 'ketcher-core';
import type { Ketcher } from 'ketcher-core';
import 'ketcher-react/dist/index.css';

// Render every element symbol in black instead of Ketcher's default CPK palette
// (N blue, O red, S amber, Cl green, …). `ElementColor` is a runtime export of
// ketcher-core — a single shared label→color map that BOTH the atoms toolbar
// and the canvas atom labels read from. ketcher-core is a singleton, so blanking
// this map once, before the Editor mounts, turns the whole editor monochrome.
const ElementColor = (KetcherCore as unknown as {
  ElementColor?: Record<string, string>;
}).ElementColor;
if (ElementColor) {
  for (const key of Object.keys(ElementColor)) ElementColor[key] = '#000';
}

// MolSerializer turns a Ketcher Struct (e.g. the current selection) into a
// molfile string for image export. Grabbed from the SAME ketcher-core instance
// this module already imports — and passed UP to the export toolbar — so
// ketcher-core is never imported a second time.
const MolSerializer = (KetcherCore as unknown as {
  MolSerializer: new () => {
    serialize: (struct: unknown) => string;
    deserialize: (mol: string) => unknown;
  };
}).MolSerializer;

export type KetcherApi = {
  serializeStruct: (struct: unknown) => string;
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
        console.error('[Ketcher]', message);
      }}
      onInit={(ketcher: Ketcher) => {
        (window as unknown as { ketcher?: Ketcher }).ketcher = ketcher;
        try {
          (ketcher.editor as unknown as { setOptions?: (o: string) => void })
            .setOptions?.(JSON.stringify({ miewTheme: 'dark' }));
        } catch {
          /* non-fatal */
        }
        onInit(ketcher, {
          serializeStruct: (struct) => new MolSerializer().serialize(struct),
          molfileToStruct: (mol) => new MolSerializer().deserialize(mol),
        });
      }}
    />
  );
}
