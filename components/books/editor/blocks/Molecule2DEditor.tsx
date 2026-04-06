'use client';

import { Molecule2DBlock } from '@/types/books';
import MoleculeViewer from '@/components/organic-wizard/MoleculeViewer';

interface Props { block: Molecule2DBlock; onChange: (p: Partial<Molecule2DBlock>) => void; }

export default function Molecule2DEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Name</label>
          <input value={block.name} onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Ethanol"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">IUPAC</label>
          <input value={block.iupac ?? ''} onChange={(e) => onChange({ iupac: e.target.value })}
            placeholder="ethanol"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">SMILES</label>
        <input value={block.smiles} onChange={(e) => onChange({ smiles: e.target.value })}
          placeholder="CCO"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 font-mono focus:outline-none focus:border-orange-500/40" />
      </div>

      {block.smiles && (
        <div className="flex justify-center p-3 bg-[#0B0F15] border border-white/10 rounded-xl">
          <MoleculeViewer smiles={block.smiles} width={220} height={160} />
        </div>
      )}

      <div>
        <label className="text-xs text-white/40 mb-1 block">Caption</label>
        <input value={block.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Optional"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>
    </div>
  );
}
