'use client';

import dynamic from 'next/dynamic';
import { ContentBlock } from '@/types/books';

// These three are on virtually every page and cheap to hydrate — keep them
// in the main bundle so first paint doesn't wait on a chunk fetch.
import TextBlockRenderer from './blocks/TextBlockRenderer';
import HeadingBlockRenderer from './blocks/HeadingBlockRenderer';
import SectionBlockRenderer from './blocks/SectionBlockRenderer';

// Everything else is lazy-loaded on demand. ssr: true keeps the HTML in the
// SSR output (no layout shift / hydration mismatch). The client bundle only
// downloads renderers whose block types actually appear on this page.
const dynamicBlock = <P extends object>(loader: () => Promise<{ default: React.ComponentType<P> }>) =>
  dynamic(loader, { ssr: true });

const ImageBlockRenderer             = dynamicBlock(() => import('./blocks/ImageBlockRenderer'));
const InteractiveImageBlockRenderer  = dynamicBlock(() => import('./blocks/InteractiveImageBlockRenderer'));
const VideoBlockRenderer             = dynamicBlock(() => import('./blocks/VideoBlockRenderer'));
const AudioNoteBlockRenderer         = dynamicBlock(() => import('./blocks/AudioNoteBlockRenderer'));
const Molecule2DBlockRenderer        = dynamicBlock(() => import('./blocks/Molecule2DBlockRenderer'));
const Molecule3DBlockRenderer        = dynamicBlock(() => import('./blocks/Molecule3DBlockRenderer'));
const LatexBlockRenderer             = dynamicBlock(() => import('./blocks/LatexBlockRenderer'));
const PracticeLinkBlockRenderer      = dynamicBlock(() => import('./blocks/PracticeLinkBlockRenderer'));
const CalloutBlockRenderer           = dynamicBlock(() => import('./blocks/CalloutBlockRenderer'));
const TableBlockRenderer             = dynamicBlock(() => import('./blocks/TableBlockRenderer'));
const TimelineBlockRenderer          = dynamicBlock(() => import('./blocks/TimelineBlockRenderer'));
const ComparisonCardBlockRenderer    = dynamicBlock(() => import('./blocks/ComparisonCardBlockRenderer'));
const AnimationBlockRenderer         = dynamicBlock(() => import('./blocks/AnimationBlockRenderer'));
const InlineQuizRenderer             = dynamicBlock(() => import('./blocks/InlineQuizRenderer'));
const WorkedExampleRenderer          = dynamicBlock(() => import('./blocks/WorkedExampleRenderer'));
const SimulationBlockRenderer        = dynamicBlock(() => import('./blocks/SimulationBlockRenderer'));
const ReasoningPromptRenderer        = dynamicBlock(() => import('./blocks/ReasoningPromptRenderer'));
const CuriosityPromptRenderer        = dynamicBlock(() => import('./blocks/CuriosityPromptRenderer'));
const ClassifyExerciseRenderer      = dynamicBlock(() => import('./blocks/ClassifyExerciseRenderer'));

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
