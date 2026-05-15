import { Molecule3DBlock } from '@/types/books';

// 3Dmol.js WebGL integration requires a separate initialisation pass.
// This placeholder renders the molecule name and SMILES with a "3D view coming soon" notice.
// A full 3Dmol.js integration can be wired in without changing the block data shape.

export default function Molecule3DBlockRenderer({ block }: { block: Molecule3DBlock }) {
  return (
    <figure className="my-4 flex flex-col items-center">
      <div className="w-full max-w-sm bg-[#0B0F15] border border-white/10 rounded-xl p-6
        flex flex-col items-center justify-center gap-2 min-h-[180px]">
        <div className="text-3xl">🧬</div>
        <p className="text-sm font-semibold text-white/80">{block.name}</p>
        <p className="text-xs text-white/40 font-mono break-all text-center">{block.smiles}</p>
        <p className="text-xs text-orange-400/70 mt-2">3D interactive view</p>
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-white/50 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
