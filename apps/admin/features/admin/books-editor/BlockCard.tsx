'use client';

import { useState } from 'react';
import { Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { ContentBlock, BlockType } from '@canvas/data/types/books';
import { UploadFn } from './BookWorkspace';
import AddBlockMenu from './AddBlockMenu';

// Block editors (imported lazily via a switch — all defined in blocks/)
import TextBlockEditor from './blocks/TextBlockEditor';
import HeadingBlockEditor from './blocks/HeadingBlockEditor';
import ImageBlockEditor from './blocks/ImageBlockEditor';
import GalleryBlockEditor from './blocks/GalleryBlockEditor';
import InteractiveImageEditor from './blocks/InteractiveImageEditor';
import VideoBlockEditor from './blocks/VideoBlockEditor';
import AudioNoteEditor from './blocks/AudioNoteEditor';
import Molecule2DEditor from './blocks/Molecule2DEditor';
import Molecule3DEditor from './blocks/Molecule3DEditor';
import LatexBlockEditor from './blocks/LatexBlockEditor';
import PracticeLinkEditor from './blocks/PracticeLinkEditor';
import CalloutBlockEditor from './blocks/CalloutBlockEditor';
import TableBlockEditor from './blocks/TableBlockEditor';
import TimelineEditor from './blocks/TimelineEditor';
import ComparisonCardEditor from './blocks/ComparisonCardEditor';
import AnimationBlockEditor from './blocks/AnimationBlockEditor';
import InlineQuizEditor from './blocks/InlineQuizEditor';
import WorkedExampleEditor from './blocks/WorkedExampleEditor';
import SectionBlockEditor from './blocks/SectionBlockEditor';
import ClassifyExerciseEditor from './blocks/ClassifyExerciseEditor';
import CuriosityPromptBlockEditor from './blocks/CuriosityPromptBlockEditor';
import SimulationBlockEditor from './blocks/SimulationBlockEditor';
import JuniorPracticeEditor from './blocks/JuniorPracticeEditor';
import YouSolveItEditor from './blocks/YouSolveItEditor';

const BLOCK_LABELS: Record<BlockType, string> = {
  text: 'Text',
  heading: 'Heading',
  image: 'Image',
  gallery: 'Gallery',
  interactive_image: 'Interactive Image',
  video: 'Video',
  audio_note: 'Audio Note',
  molecule_2d: 'Molecule 2D',
  molecule_3d: 'Molecule 3D',
  latex_block: 'Equation',
  practice_link: 'Practice Link',
  practice_bank: 'Practice Bank',
  callout: 'Callout',
  table: 'Table',
  timeline: 'Timeline',
  comparison_card: 'Comparison',
  animation: 'Animation',
  inline_quiz: 'Quiz (Milestone)',
  worked_example: 'Worked Example',
  simulation: 'Simulation',
  section: 'Section',
  reasoning_prompt: 'Reasoning Prompt',
  curiosity_prompt: 'Curiosity Prompt',
  classify_exercise: 'Classify Exercise',
  meet_a_scientist: 'Meet a Scientist',
  // English blocks (Class 9 Kaveri) — script-authored, shown read-only in editor
  narrated_passage: 'Narrated Passage',
  vocabulary_lab: 'Vocabulary Lab',
  literary_devices_highlighter: 'Literary Devices',
  character_map: 'Character Map',
  theme_explorer: 'Theme Explorer',
  tone_meter: 'Tone Meter',
  cultural_context_card: 'Cultural Context',
  comprehension_checkpoint: 'Comprehension Check',
  reading_comprehension: 'Reading Comprehension',
  writing_scaffold: 'Writing Scaffold',
  dialogue_role_play: 'Dialogue / Role-play',
  pronunciation_drill: 'Pronunciation Drill',
  chapter_practice: 'Chapter Practice',
  apply_express: 'Apply & Express',
  junior_practice: 'Junior Practice (bank)',
  group_elements: 'Group Elements',
  // Life Skills + Social Science engagement blocks (script-authored; labels for the editor list)
  guided_practice: 'Guided Practice',
  reflection_journal: 'Reflection Journal',
  habit_tracker: 'Habit Tracker',
  focus_game: 'Focus Game',
  attention_xray: 'Attention X-Ray',
  self_experiment: 'Self-Experiment',
  guided_reveal: 'Guided Reveal',
  perspective_scenario: 'Perspective Scenario',
  career_spotlight: 'Career Spotlight',
  you_solve_it: 'You Solve It',
};

const BLOCK_ICONS: Record<BlockType, string> = {
  text: '¶',
  heading: 'H',
  image: '🖼️',
  gallery: '🖼',
  interactive_image: '🔍',
  video: '▶️',
  audio_note: '🎙️',
  molecule_2d: '⬡',
  molecule_3d: '🧬',
  latex_block: '∑',
  practice_link: '🎯',
  practice_bank: '📝',
  callout: '💡',
  table: '⊞',
  timeline: '⟶',
  comparison_card: '⇌',
  animation: '✨',
  inline_quiz: '🧠',
  worked_example: '📘',
  simulation: '⚙️',
  section: '▦',
  reasoning_prompt: '🧩',
  curiosity_prompt: '✦',
  classify_exercise: '⊡',
  meet_a_scientist: '🎓',
  // English blocks (Class 9 Kaveri)
  narrated_passage: '🔊',
  vocabulary_lab: '📖',
  literary_devices_highlighter: '🖋️',
  character_map: '🧑‍🤝‍🧑',
  theme_explorer: '🎭',
  tone_meter: '🎚️',
  cultural_context_card: '🏛️',
  comprehension_checkpoint: '✅',
  reading_comprehension: '📑',
  writing_scaffold: '✍️',
  dialogue_role_play: '💬',
  pronunciation_drill: '🗣️',
  chapter_practice: '◎',
  apply_express: '🎮',
  junior_practice: '🎓',
  group_elements: '🧪',
  guided_practice: '🧭',
  reflection_journal: '📓',
  habit_tracker: '📊',
  focus_game: '🎯',
  attention_xray: '🩻',
  self_experiment: '🔬',
  guided_reveal: '🎬',
  perspective_scenario: '⚖️',
  career_spotlight: '💼',
  you_solve_it: '◎',
};

function blockPreview(block: ContentBlock): string {
  try {
    switch (block.type) {
      case 'text':           return (block.markdown || '').slice(0, 80) || '(empty)';
      case 'heading':        return block.text || '(empty)';
      case 'image':          return block.caption || block.alt || block.src?.split('/').pop() || '(image)';
      case 'gallery':        return `${(block.items || []).length} image${(block.items || []).length !== 1 ? 's' : ''}`;
      case 'interactive_image': return `${(block.hotspots || []).length} hotspot${block.hotspots?.length !== 1 ? 's' : ''}`;
      case 'video':          return block.caption || block.src || '(video)';
      case 'audio_note':     return block.label || '(audio)';
      case 'molecule_2d':    return block.name || block.smiles || '(molecule)';
      case 'molecule_3d':    return block.name || block.smiles || '(molecule)';
      case 'latex_block':    return (block.latex || '').slice(0, 60) || '(equation)';
      case 'practice_link':  return block.label || '(link)';
      case 'practice_bank':  return `${(block.sections || []).length} sections · ${(block.sections || []).reduce((s, x) => s + (x.items || []).length, 0)} questions`;
      case 'group_elements': return `${(block.element_symbols || []).join(', ')}`;
      case 'callout':        return `${block.variant}: ${(block.markdown || '').slice(0, 60)}`;
      case 'table':          return `${(block.headers || []).length} cols × ${(block.rows || []).length} rows`;
      case 'timeline':       return `${(block.events || []).length} event${(block.events || []).length !== 1 ? 's' : ''}`;
      case 'comparison_card':return `${(block.columns || []).length} columns`;
      case 'animation':      return block.caption || block.src?.split('/').pop() || '(animation)';
      case 'inline_quiz':    return `${(block.questions || []).length} question${block.questions?.length !== 1 ? 's' : ''} · ${Math.round((block.pass_threshold ?? 0.7) * 100)}% to pass`;
      case 'worked_example': return block.label || '(example)';
      case 'simulation':     return block.title || block.simulation_id || '(simulation)';
      case 'section':           return `${block.layout} · ${block.columns.reduce((sum, col) => sum + col.length, 0)} blocks`;
      case 'reasoning_prompt':   return `${block.reasoning_type} · Level ${block.difficulty_level} · ${(block.prompt || '').slice(0, 60)}`;
      case 'curiosity_prompt':   return (block.prompt || '').slice(0, 80) || '(empty)';
      case 'classify_exercise':  return `${(block.rows || []).length} rows · ${(block.question || '').slice(0, 50)}`;
      case 'meet_a_scientist':   return `${block.name}${block.years ? ` (${block.years})` : ''}`;
      case 'junior_practice':    return `Ch ${block.chapter_number} · ${block.mode === 'test' ? 'test' : 'practice'} · ${block.session_size ?? 10} Qs`;
      case 'you_solve_it':       return block.title || '(you solve it)';
      default:                   return `(${(block as ContentBlock).type})`;
    }
  } catch {
    return `(${block.type})`;
  }
}

interface Props {
  block: ContentBlock;
  dragHandleProps: Record<string, unknown>;
  onChange: (patch: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onAddAfter: (type: BlockType) => void;
  onUpload: UploadFn;
}

export default function BlockCard({
  block, dragHandleProps, onChange, onDelete, onAddAfter, onUpload,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  function renderEditor() {
    switch (block.type) {
      case 'text':             return <TextBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'heading':          return <HeadingBlockEditor block={block} onChange={onChange} />;
      case 'image':            return <ImageBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'gallery':          return <GalleryBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'interactive_image':return <InteractiveImageEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'video':            return <VideoBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'audio_note':       return <AudioNoteEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'molecule_2d':      return <Molecule2DEditor block={block} onChange={onChange} />;
      case 'molecule_3d':      return <Molecule3DEditor block={block} onChange={onChange} />;
      case 'latex_block':      return <LatexBlockEditor block={block} onChange={onChange} />;
      case 'practice_link':    return <PracticeLinkEditor block={block} onChange={onChange} />;
      case 'callout':          return <CalloutBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'table':            return <TableBlockEditor block={block} onChange={onChange} />;
      case 'timeline':         return <TimelineEditor block={block} onChange={onChange} />;
      case 'comparison_card':  return <ComparisonCardEditor block={block} onChange={onChange} />;
      case 'animation':        return <AnimationBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'inline_quiz':      return <InlineQuizEditor block={block} onChange={onChange} />;
      case 'worked_example':   return <WorkedExampleEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'section':           return <SectionBlockEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'classify_exercise': return <ClassifyExerciseEditor block={block} onChange={onChange} />;
      case 'curiosity_prompt':  return <CuriosityPromptBlockEditor block={block} onChange={onChange} />;
      case 'simulation':        return <SimulationBlockEditor block={block} onChange={onChange} />;
      case 'junior_practice':   return <JuniorPracticeEditor block={block} onChange={onChange} />;
      case 'you_solve_it':      return <YouSolveItEditor block={block} onChange={onChange} onUpload={onUpload} />;
      case 'practice_bank':     return (
        <div className="text-xs text-white/40 leading-relaxed px-1 py-2 space-y-1">
          <p className="text-white/60 font-semibold">{block.title || 'Practice Bank'}</p>
          <p>{(block.sections || []).length} sections · {(block.sections || []).reduce((s, x) => s + (x.items || []).length, 0)} questions (NCERT exercises + Exemplar).</p>
          <p className="text-white/30">Authored via <code>scripts/practice/</code>. See the live preview on the right for the rendered bank.</p>
        </div>
      );
      case 'group_elements':    return (
        <div className="text-xs text-white/40 leading-relaxed px-1 py-2 space-y-1">
          <p className="text-white/60 font-semibold">{block.title || 'Group Elements'}</p>
          <p>Elements: <span className="font-mono text-white/70">{(block.element_symbols || []).join(', ') || '(none)'}</span></p>
          <p className="text-white/30">The element list is authored in-script (looked up in the shared periodic table by symbol). See the live preview on the right for the rendered cards.</p>
        </div>
      );
      default:                  return null;
    }
  }

  return (
    <div className={`group relative bg-[#0B0F15] border rounded-xl overflow-hidden transition-colors
      ${expanded ? 'border-orange-500/30' : 'border-white/5 hover:border-white/10'}`}>

      {/* Card header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors shrink-0"
        >
          <GripVertical size={15} />
        </div>

        {/* Icon + label + preview */}
        <button
          className="flex-1 flex items-center gap-2 text-left min-w-0"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="text-base w-5 text-center shrink-0">{BLOCK_ICONS[block.type]}</span>
          <span className="text-xs font-medium text-white/50 shrink-0">{BLOCK_LABELS[block.type]}</span>
          <span className="text-xs text-white/30 truncate">{blockPreview(block)}</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Audience tier tag — Core (default) vs Competitive (NEET/JEE).
              Phase 0: stored only; gated to paid plans in a later phase. */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange({ tier: block.tier === 'competitive' ? 'core' : 'competitive' } as Partial<ContentBlock>);
            }}
            title="Audience tier — tap to toggle. Core = CBSE / all students. Competitive = NEET / JEE depth (will be gated to paid plans later)."
            className={
              block.tier === 'competitive'
                ? 'px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-violet-500/20 text-violet-300 border border-violet-400/30 hover:bg-violet-500/30 transition-colors'
                : 'px-1.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide bg-white/5 text-white/30 border border-white/10 hover:text-white/55 hover:border-white/20 transition-colors'
            }
          >
            {block.tier === 'competitive' ? 'Comp' : 'Core'}
          </button>
          <AddBlockMenu onAdd={onAddAfter} afterId={block.id} compact />
          <button
            onClick={onDelete}
            className="p-1 text-white/20 hover:text-red-400 transition-colors rounded"
            title="Delete block"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 text-white/30 hover:text-white/70 transition-colors rounded"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Inline editor */}
      {expanded && (
        <div className="border-t border-white/8 px-4 py-3 bg-[#151E32]/40">
          {renderEditor()}
        </div>
      )}
    </div>
  );
}
