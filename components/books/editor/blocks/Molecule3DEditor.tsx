'use client';

import { Molecule3DBlock } from '@/types/books';

interface Props { block: Molecule3DBlock; onChange: (p: Partial<Molecule3DBlock>) => void; }

export default function Molecule3DEditor({ block, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Name</label>
          <input value={block.name} onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Benzene"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">SMILES</label>
          <input value={block.smiles} onChange={(e) => onChange({ smiles: e.target.value })}
            placeholder="c1ccccc1"
            className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
              text-sm text-white placeholder-white/25 font-mono focus:outline-none focus:border-orange-500/40" />
        </div>
      </div>
      <div>
        <label className="text-xs text-white/40 mb-1 block">Caption</label>
        <input value={block.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Optional"
          className="w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg
            text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40" />
      </div>
      <p className="text-xs text-white/30 italic">3D viewer renders in student preview</p>
    </div>
  );
}
