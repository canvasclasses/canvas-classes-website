'use client';

import { Molecule2DBlock } from '@/types/books';
import MoleculeViewer from '@/components/organic-wizard/MoleculeViewer';

export default function Molecule2DBlockRenderer({ block }: { block: Molecule2DBlock }) {
  return (
    <figure className="my-4 flex flex-col items-center">
      <div className="bg-[#0B0F15] border border-white/10 rounded-xl p-4 inline-block">
        {block.rendered_svg_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.rendered_svg_url} alt={block.name} className="max-w-full" />
        ) : (
          <MoleculeViewer smiles={block.smiles} width={280} height={200} />
        )}
      </div>

      <div className="mt-2 text-center">
        <p className="text-sm font-semibold text-white/90">{block.name}</p>
        {block.iupac && (
          <p className="text-xs text-white/50 mt-0.5 italic">{block.iupac}</p>
        )}
        {block.caption && (
          <p className="text-xs text-white/50 mt-1">{block.caption}</p>
        )}
      </div>
    </figure>
  );
}
