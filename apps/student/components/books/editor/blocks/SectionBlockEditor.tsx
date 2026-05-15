'use client';

import { useCallback, useId } from 'react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent, DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { SectionBlock, SectionLayout, ContentBlock, BlockType } from '@/types/books';
import { UploadFn, defaultBlock } from '../BookWorkspace';
import AddBlockMenu from '../AddBlockMenu';

// Block editors — reuse all existing editors for child blocks
import TextBlockEditor from './TextBlockEditor';
import HeadingBlockEditor from './HeadingBlockEditor';
import ImageBlockEditor from './ImageBlockEditor';
import InteractiveImageEditor from './InteractiveImageEditor';
import VideoBlockEditor from './VideoBlockEditor';
import AudioNoteEditor from './AudioNoteEditor';
import Molecule2DEditor from './Molecule2DEditor';
import Molecule3DEditor from './Molecule3DEditor';
import LatexBlockEditor from './LatexBlockEditor';
import PracticeLinkEditor from './PracticeLinkEditor';
import CalloutBlockEditor from './CalloutBlockEditor';
import TableBlockEditor from './TableBlockEditor';
import TimelineEditor from './TimelineEditor';
import ComparisonCardEditor from './ComparisonCardEditor';
import AnimationBlockEditor from './AnimationBlockEditor';
import InlineQuizEditor from './InlineQuizEditor';
import WorkedExampleEditor from './WorkedExampleEditor';

// ─── Layout presets ──────────────────────────────────────────────────────────

const LAYOUTS: { value: SectionLayout; label: string; cols: number }[] = [
  { value: 'single-column', label: '1 col',  cols: 1 },
  { value: '50-50',         label: '50/50',  cols: 2 },
  { value: '60-40',         label: '60/40',  cols: 2 },
  { value: '40-60',         label: '40/60',  cols: 2 },
  { value: 'full-bleed',    label: 'Full',   cols: 1 },
];

const COLUMN_WIDTHS: Record<SectionLayout, string[]> = {
  'single-column': ['w-full'],
  '50-50':         ['w-1/2', 'w-1/2'],
  '60-40':         ['w-3/5', 'w-2/5'],
  '40-60':         ['w-2/5', 'w-3/5'],
  'full-bleed':    ['w-full'],
};

// ─── Labels & icons for child block preview ──────────────────────────────────

const CHILD_LABELS: Partial<Record<BlockType, string>> = {
  text: 'Text', heading: 'Heading', image: 'Image', interactive_image: 'Interactive Image',
  video: 'Video', audio_note: 'Audio', molecule_2d: 'Mol 2D', molecule_3d: 'Mol 3D',
  latex_block: 'Eq', practice_link: 'Practice', callout: 'Callout', table: 'Table',
  timeline: 'Timeline', comparison_card: 'Comparison', animation: 'Animation',
  inline_quiz: 'Quiz', worked_example: 'Example', simulation: 'Simulation',
};

const CHILD_ICONS: Partial<Record<BlockType, string>> = {
  text: '¶', heading: 'H', image: '🖼️', interactive_image: '🔍',
  video: '▶️', audio_note: '🎙️', molecule_2d: '⬡', molecule_3d: '🧬',
  latex_block: '∑', practice_link: '🎯', callout: '💡', table: '⊞',
  timeline: '⟶', comparison_card: '⇌', animation: '✨',
  inline_quiz: '🧠', worked_example: '📘', simulation: '⚙️',
};

// ─── Sortable child block ────────────────────────────────────────────────────

function ChildBlockCard({
  block,
  dragHandleProps,
  onChange,
  onDelete,
  onUpload,
}: {
  block: ContentBlock;
  dragHandleProps: Record<string, unknown>;
  onChange: (patch: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onUpload: UploadFn;
}) {
  const [expanded, setExpanded] = useState(false);

  function renderEditor() {
    switch (block.type) {
      case 'text':             return <TextBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'heading':          return <HeadingBlockEditor block={block} onChange={onChange} />;
      case 'image':            return <ImageBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'interactive_image':return <InteractiveImageEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'video':            return <VideoBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'audio_note':       return <AudioNoteEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'molecule_2d':      return <Molecule2DEditor block={block} onChange={onChange} />;
      case 'molecule_3d':      return <Molecule3DEditor block={block} onChange={onChange} />;
      case 'latex_block':      return <LatexBlockEditor block={block} onChange={onChange} />;
      case 'practice_link':    return <PracticeLinkEditor block={block} onChange={onChange} />;
      case 'callout':          return <CalloutBlockEditor block={block} onChange={onChange} />;
      case 'table':            return <TableBlockEditor block={block} onChange={onChange} />;
      case 'timeline':         return <TimelineEditor block={block} onChange={onChange} />;
      case 'comparison_card':  return <ComparisonCardEditor block={block} onChange={onChange} />;
      case 'animation':        return <AnimationBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'inline_quiz':      return <InlineQuizEditor block={block} onChange={onChange} />;
      case 'worked_example':   return <WorkedExampleEditor block={block} onChange={onChange} onUpload={onUpload} />;
      default:                 return null;
    }
  }

  return (
    <div className={`bg-[#0B0F15] border rounded-lg overflow-hidden transition-colors
      ${expanded ? 'border-orange-500/30' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors shrink-0"
        >
          <GripVertical size={13} />
        </div>
        <button
          className="flex-1 flex items-center gap-1.5 text-left min-w-0"
          onClick={() => setExpanded(v => !v)}
        >
          <span className="text-sm w-4 text-center shrink-0">{CHILD_ICONS[block.type] || '?'}</span>
          <span className="text-[11px] font-medium text-white/40 shrink-0">{CHILD_LABELS[block.type] || block.type}</span>
        </button>
        <button onClick={onDelete} className="p-0.5 text-white/20 hover:text-red-400 transition-colors" title="Delete">
          <Trash2 size={11} />
        </button>
        <button onClick={() => setExpanded(v => !v)} className="p-0.5 text-white/25 hover:text-white/60 transition-colors">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      {expanded && (
        <div className="border-t border-white/8 px-3 py-2 bg-[#151E32]/30">
          {renderEditor()}
        </div>
      )}
    </div>
  );
}

function SortableChild({
  block, onChange, onDelete, onUpload,
}: {
  block: ContentBlock;
  onChange: (patch: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onUpload: UploadFn;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ChildBlockCard
        block={block}
        dragHandleProps={{ ...attributes, ...listeners }}
        onChange={onChange}
        onDelete={onDelete}
        onUpload={onUpload}
      />
    </div>
  );
}

// ─── Droppable column ────────────────────────────────────────────────────────

function DroppableColumn({
  colIdx,
  blocks,
  widthClass,
  onUpdateChild,
  onDeleteChild,
  onAddChild,
  onUpload,
}: {
  colIdx: number;
  blocks: ContentBlock[];
  widthClass: string;
  onUpdateChild: (colIdx: number, childId: string, patch: Partial<ContentBlock>) => void;
  onDeleteChild: (colIdx: number, childId: string) => void;
  onAddChild: (colIdx: number, type: BlockType) => void;
  onUpload: UploadFn;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${colIdx}`,
    data: { colIdx },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${widthClass} min-h-[60px] rounded-lg border border-dashed transition-colors p-2 flex flex-col gap-1.5
        ${isOver ? 'border-orange-500/40 bg-orange-500/5' : 'border-white/10 bg-white/[0.02]'}`}
    >
      <div className="text-[10px] font-medium text-white/25 uppercase tracking-wider mb-1">
        Column {colIdx + 1}
      </div>

      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.map(block => (
          <SortableChild
            key={block.id}
            block={block}
            onChange={(patch) => onUpdateChild(colIdx, block.id, patch)}
            onDelete={() => onDeleteChild(colIdx, block.id)}
            onUpload={onUpload}
          />
        ))}
      </SortableContext>

      {blocks.length === 0 && (
        <div className="text-[11px] text-white/20 text-center py-3">
          Drop blocks here
        </div>
      )}

      <AddBlockMenu
        onAdd={(type) => onAddChild(colIdx, type)}
        compact
        excludeTypes={['section']}
      />
    </div>
  );
}

// ─── Main section editor ─────────────────────────────────────────────────────

interface Props {
  block: SectionBlock;
  onChange: (patch: Partial<SectionBlock>) => void;
  onUpload: UploadFn;
}

export default function SectionBlockEditor({ block, onChange, onUpload }: Props) {
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // ── Layout change ────────────────────────────────────────────────────────

  const changeLayout = useCallback((newLayout: SectionLayout) => {
    const preset = LAYOUTS.find(l => l.value === newLayout)!;
    const currentCols = block.columns;
    let newColumns: ContentBlock[][];

    if (preset.cols === 1) {
      // Merge all columns into one
      newColumns = [currentCols.flat()];
    } else if (preset.cols === 2) {
      if (currentCols.length === 1) {
        // Split: keep existing in col 0, empty col 1
        newColumns = [currentCols[0], []];
      } else {
        // Already 2 columns — keep as-is
        newColumns = currentCols;
      }
    } else {
      newColumns = currentCols;
    }

    onChange({ layout: newLayout, columns: newColumns });
  }, [block.columns, onChange]);

  // ── Child block CRUD ─────────────────────────────────────────────────────

  const updateChild = useCallback((colIdx: number, childId: string, patch: Partial<ContentBlock>) => {
    const newColumns = block.columns.map((col, i) =>
      i === colIdx
        ? col.map(b => b.id === childId ? { ...b, ...patch } as ContentBlock : b)
        : [...col]
    );
    onChange({ columns: newColumns });
  }, [block.columns, onChange]);

  const deleteChild = useCallback((colIdx: number, childId: string) => {
    const newColumns = block.columns.map((col, i) =>
      i === colIdx ? col.filter(b => b.id !== childId) : [...col]
    );
    onChange({ columns: newColumns });
  }, [block.columns, onChange]);

  const addChild = useCallback((colIdx: number, type: BlockType) => {
    const col = block.columns[colIdx] || [];
    const newBlock = defaultBlock(type, col.length);
    const newColumns = block.columns.map((c, i) =>
      i === colIdx ? [...c, newBlock] : [...c]
    );
    onChange({ columns: newColumns });
  }, [block.columns, onChange]);

  // ── Drag & drop ──────────────────────────────────────────────────────────

  // Find which column a block ID belongs to
  function findColumn(blockId: string): number {
    for (let i = 0; i < block.columns.length; i++) {
      if (block.columns[i].some(b => b.id === blockId)) return i;
    }
    return -1;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromCol = findColumn(activeId);
    if (fromCol === -1) return;

    // Determine target column
    let toCol: number;
    let overBlockIdx: number;

    if (overId.startsWith('col-')) {
      // Dropped on a column droppable
      toCol = parseInt(overId.replace('col-', ''), 10);
      overBlockIdx = block.columns[toCol]?.length ?? 0;
    } else {
      // Dropped on another block
      toCol = findColumn(overId);
      if (toCol === -1) return;
      overBlockIdx = block.columns[toCol].findIndex(b => b.id === overId);
    }

    if (fromCol === toCol) {
      // Same column reorder
      const col = block.columns[fromCol];
      const oldIdx = col.findIndex(b => b.id === activeId);
      if (oldIdx === overBlockIdx) return;
      const newCol = arrayMove(col, oldIdx, overBlockIdx);
      const newColumns = block.columns.map((c, i) => i === fromCol ? newCol : [...c]);
      onChange({ columns: newColumns });
    } else {
      // Cross-column move
      const sourceCol = [...block.columns[fromCol]];
      const targetCol = [...block.columns[toCol]];
      const movedBlockIdx = sourceCol.findIndex(b => b.id === activeId);
      const [movedBlock] = sourceCol.splice(movedBlockIdx, 1);
      targetCol.splice(overBlockIdx, 0, movedBlock);
      const newColumns = block.columns.map((c, i) => {
        if (i === fromCol) return sourceCol;
        if (i === toCol) return targetCol;
        return [...c];
      });
      onChange({ columns: newColumns });
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const widths = COLUMN_WIDTHS[block.layout] || ['w-full'];

  // Collect all child block IDs across all columns for the DndContext
  const allChildIds = block.columns.flat().map(b => b.id);

  return (
    <div className="space-y-3">
      {/* Layout selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-white/40 font-medium">Layout</span>
        <div className="flex gap-1">
          {LAYOUTS.map(l => (
            <button
              key={l.value}
              onClick={() => changeLayout(l.value)}
              className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors
                ${block.layout === l.value
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional title */}
      <input
        type="text"
        value={block.title || ''}
        onChange={e => onChange({ title: e.target.value || undefined })}
        placeholder="Section title (optional)"
        className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-orange-500/40"
      />

      {/* Column container with drag-drop */}
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-2">
          {block.columns.map((col, colIdx) => (
            <DroppableColumn
              key={colIdx}
              colIdx={colIdx}
              blocks={col}
              widthClass={widths[colIdx] || 'w-full'}
              onUpdateChild={updateChild}
              onDeleteChild={deleteChild}
              onAddChild={addChild}
              onUpload={onUpload}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
