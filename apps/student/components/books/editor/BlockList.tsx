'use client';

import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentBlock, BlockType } from '@/types/books';
import BlockCard from './BlockCard';
import { UploadFn } from './BookWorkspace';

interface SortableItemProps {
  block: ContentBlock;
  onChange: (patch: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onAddAfter: (type: BlockType) => void;
  onUpload: UploadFn;
}

function SortableItem({ block, onChange, onDelete, onAddAfter, onUpload }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BlockCard
        block={block}
        dragHandleProps={{ ...attributes, ...listeners }}
        onChange={onChange}
        onDelete={onDelete}
        onAddAfter={onAddAfter}
        onUpload={onUpload}
      />
    </div>
  );
}

interface Props {
  blocks: ContentBlock[];
  onReorder: (reordered: ContentBlock[]) => void;
  onUpdate: (id: string, patch: Partial<ContentBlock>) => void;
  onDelete: (id: string) => void;
  onAddAfter: (type: BlockType, afterId: string) => void;
  onUpload: UploadFn;
}

export default function BlockList({ blocks, onReorder, onUpdate, onDelete, onAddAfter, onUpload }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex((b) => b.id === active.id);
    const newIdx = blocks.findIndex((b) => b.id === over.id);
    onReorder(arrayMove(blocks, oldIdx, newIdx));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {blocks.map((block) => (
            <SortableItem
              key={block.id}
              block={block}
              onChange={(patch) => onUpdate(block.id, patch)}
              onDelete={() => onDelete(block.id)}
              onAddAfter={(type) => onAddAfter(type, block.id)}
              onUpload={onUpload}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
