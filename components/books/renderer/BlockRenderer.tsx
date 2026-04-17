'use client';

import { ContentBlock } from '@/types/books';

import TextBlockRenderer from './blocks/TextBlockRenderer';
import HeadingBlockRenderer from './blocks/HeadingBlockRenderer';
import ImageBlockRenderer from './blocks/ImageBlockRenderer';
import InteractiveImageBlockRenderer from './blocks/InteractiveImageBlockRenderer';
import VideoBlockRenderer from './blocks/VideoBlockRenderer';
import AudioNoteBlockRenderer from './blocks/AudioNoteBlockRenderer';
import Molecule2DBlockRenderer from './blocks/Molecule2DBlockRenderer';
import Molecule3DBlockRenderer from './blocks/Molecule3DBlockRenderer';
import LatexBlockRenderer from './blocks/LatexBlockRenderer';
import PracticeLinkBlockRenderer from './blocks/PracticeLinkBlockRenderer';
import CalloutBlockRenderer from './blocks/CalloutBlockRenderer';
import TableBlockRenderer from './blocks/TableBlockRenderer';
import TimelineBlockRenderer from './blocks/TimelineBlockRenderer';
import ComparisonCardBlockRenderer from './blocks/ComparisonCardBlockRenderer';
import AnimationBlockRenderer from './blocks/AnimationBlockRenderer';
import InlineQuizRenderer from './blocks/InlineQuizRenderer';
import WorkedExampleRenderer from './blocks/WorkedExampleRenderer';
import SimulationBlockRenderer from './blocks/SimulationBlockRenderer';
import SectionBlockRenderer from './blocks/SectionBlockRenderer';
import ReasoningPromptRenderer from './blocks/ReasoningPromptRenderer';
import CuriosityPromptRenderer from './blocks/CuriosityPromptRenderer';
import ClassifyExerciseRenderer from './blocks/ClassifyExerciseRenderer';

export default function BlockRenderer({
  block,
  onQuizPass,
}: {
  block: ContentBlock;
  onQuizPass?: (blockId: string, score: number) => void;
}) {
  switch (block.type) {
    case 'text':              return <TextBlockRenderer block={block} />;
    case 'heading':           return <HeadingBlockRenderer block={block} />;
    case 'image':             return <ImageBlockRenderer block={block} />;
    case 'interactive_image': return <InteractiveImageBlockRenderer block={block} />;
    case 'video':             return <VideoBlockRenderer block={block} />;
    case 'audio_note':        return <AudioNoteBlockRenderer block={block} />;
    case 'molecule_2d':       return <Molecule2DBlockRenderer block={block} />;
    case 'molecule_3d':       return <Molecule3DBlockRenderer block={block} />;
    case 'latex_block':       return <LatexBlockRenderer block={block} />;
    case 'practice_link':     return <PracticeLinkBlockRenderer block={block} />;
    case 'callout':           return <CalloutBlockRenderer block={block} />;
    case 'table':             return <TableBlockRenderer block={block} />;
    case 'timeline':          return <TimelineBlockRenderer block={block} />;
    case 'comparison_card':   return <ComparisonCardBlockRenderer block={block} />;
    case 'animation':         return <AnimationBlockRenderer block={block} />;
    case 'inline_quiz':       return <InlineQuizRenderer block={block} onPass={score => onQuizPass?.(block.id, score)} />;
    case 'worked_example':    return <WorkedExampleRenderer block={block} />;
    case 'simulation':        return <SimulationBlockRenderer block={block} />;
    case 'section':           return <SectionBlockRenderer block={block} onQuizPass={onQuizPass} />;
    case 'reasoning_prompt':   return <ReasoningPromptRenderer block={block} />;
    case 'curiosity_prompt':   return <CuriosityPromptRenderer block={block} />;
    case 'classify_exercise':  return <ClassifyExerciseRenderer block={block} />;
    default:                   return null;
  }
}
