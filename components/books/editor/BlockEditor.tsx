'use client';

import { ContentBlock, BlockType } from '@/types/books';
import BlockList from './BlockList';
import AddBlockMenu from './AddBlockMenu';
import { UploadFn } from './BookWorkspace';

interface Props {
  blocks: ContentBlock[];
  pageSubtitle: string;
  onSubtitleChange: (v: string) => void;
  onAddBlock: (type: BlockType, afterId?: string) => void;
  onUpdateBlock: (id: string, patch: Partial<ContentBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onReorder: (reordered: ContentBlock[]) => void;
  onUpload: UploadFn;
}

export default function BlockEditor({
  blocks, pageSubtitle, onSubtitleChange,
  onAddBlock, onUpdateBlock, onDeleteBlock, onReorder, onUpload,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      {/* Subtitle */}
      <input
        value={pageSubtitle}
        onChange={(e) => onSubtitleChange(e.target.value)}
        placeholder="Subtitle (optional)"
        className="w-full mb-6 text-base text-white/50 bg-transparent border-none outline-none
          placeholder-white/20 border-b border-white/5 pb-2 focus:border-white/20 transition-colors"
      />

      {/* Block list */}
      {blocks.length > 0 && (
        <BlockList
          blocks={blocks}
          onReorder={onReorder}
          onUpdate={onUpdateBlock}
          onDelete={onDeleteBlock}
          onAddAfter={onAddBlock}
          onUpload={onUpload}
        />
      )}

      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-3 text-white/20">
          <p className="text-sm">This page has no blocks yet</p>
          <p className="text-xs">Click below to add your first block</p>
        </div>
      )}

      {/* Add block button */}
      <div className="mt-4">
        <AddBlockMenu onAdd={(type) => onAddBlock(type)} />
      </div>
    </div>
  );
}
