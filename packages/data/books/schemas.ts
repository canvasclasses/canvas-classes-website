/**
 * Zod schemas for the book content block union.
 *
 * Authoritative shape lives in `types/books.ts`. These schemas exist solely to
 * validate untrusted input on the page PUT route — they must stay in sync with
 * the TypeScript interfaces. When you add a new block type to `types/books.ts`,
 * add the matching schema here and plug it into `ContentBlockSchema` below.
 *
 * Design notes:
 *   • Every schema extends `BaseBlockSchema` so `id`, `type`, `order` stay required.
 *   • We use a discriminated union on `type` so errors point at the exact block
 *     (e.g. "blocks.3.variant: Invalid enum value").
 *   • String fields accept any length; markdown/latex validation is out of scope.
 *   • Unknown fields on a block are stripped by Zod's default `.strip()` behaviour —
 *     legacy extra keys are silently dropped on the next save, keeping old data compatible.
 */

import { z } from 'zod';

// ─── Shared primitives ────────────────────────────────────────────────────────

const BaseBlockSchema = z.object({
  id: z.string().min(1, 'block id is required'),
  order: z.number().int().nonnegative(),
  // Audience tier for tiered access (Phase 0 — stored, not yet enforced).
  // Must live here so it survives the page route's Zod .strip() on every save.
  tier: z.enum(['core', 'competitive']).optional(),
});

const HotspotSchema = z.object({
  id: z.string().min(1),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  label: z.string(),
  detail: z.string(),
  icon: z.enum(['circle', 'pin', 'plus']).optional(),
});

const TimelineEventSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  detail: z.string().optional(),
  icon: z.string().optional(),
});

const ComparisonColumnSchema = z.object({
  heading: z.string(),
  color: z.string().optional(),
  points: z.array(z.string()),
});

const InlineQuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string(),
  options: z.array(z.string()).min(2, 'quiz question must have at least 2 options'),
  correct_index: z.number().int().nonnegative(),
  explanation: z.string().optional(),
});

// ─── Concrete block schemas ───────────────────────────────────────────────────

const TextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('text'),
  markdown: z.string(),
});

const HeadingBlockSchema = BaseBlockSchema.extend({
  type: z.literal('heading'),
  text: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

const ImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('image'),
  src: z.string(), // empty string allowed — placeholder state
  alt: z.string(),
  caption: z.string().optional(),
  width: z.enum(['full', 'five_sixth', 'three_quarter', 'two_third', 'half', 'two_fifth', 'third', 'quarter']).optional(),
  align: z.enum(['center', 'left', 'right']).optional(),
  side_text: z.string().optional(),
  generation_prompt: z.string().optional(),
  aspect_ratio: z.enum(['16:9', '16:5', '4:3', '3:2', '1:1', '21:9']).optional(),
});

const InteractiveImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('interactive_image'),
  src: z.string(),
  alt: z.string(),
  hotspots: z.array(HotspotSchema),
  caption: z.string().optional(),
});

const VideoBlockSchema = BaseBlockSchema.extend({
  type: z.literal('video'),
  src: z.string(),
  provider: z.enum(['cloudflare_stream', 'r2_direct', 'youtube_nocookie']),
  poster: z.string().optional(),
  caption: z.string().optional(),
  duration_sec: z.number().nonnegative(),
  autoplay: z.literal(false).optional(),
});

const AudioNoteBlockSchema = BaseBlockSchema.extend({
  type: z.literal('audio_note'),
  src: z.string(),
  label: z.string(),
  duration_sec: z.number().nonnegative(),
  transcript: z.string().optional(),
});

const Molecule2DBlockSchema = BaseBlockSchema.extend({
  type: z.literal('molecule_2d'),
  smiles: z.string(),
  name: z.string(),
  iupac: z.string().optional(),
  rendered_svg_url: z.string().optional(),
  caption: z.string().optional(),
});

const Molecule3DBlockSchema = BaseBlockSchema.extend({
  type: z.literal('molecule_3d'),
  smiles: z.string(),
  name: z.string(),
  caption: z.string().optional(),
});

const LatexBlockSchema = BaseBlockSchema.extend({
  type: z.literal('latex_block'),
  latex: z.string(),
  label: z.string().optional(),
  note: z.string().optional(),
});

const PracticeLinkBlockSchema = BaseBlockSchema.extend({
  type: z.literal('practice_link'),
  question_ids: z.array(z.string()),
  chapter_tag: z.string().optional(),
  label: z.string(),
  style: z.enum(['inline_quiz', 'link_to_crucible']),
});

const CalloutBlockSchema = BaseBlockSchema.extend({
  type: z.literal('callout'),
  variant: z.enum([
    'remember', 'note', 'warning', 'exam_tip', 'fun_fact',
    'threads_of_curiosity', 'bridging_science', 'india_science',
    'what_if', 'quest_continues', 'ready_to_go_beyond',
    // English-track variants — see ENGLISH_BOOK_PAGE_WORKFLOW.md §3.1
    'india_voice', 'literature_in_life',
  ]),
  title: z.string().optional(),
  markdown: z.string(),
  image_src: z.string().optional(),    // thumbnail — empty string = not yet uploaded
  image_prompt: z.string().optional(), // AI generation spec for the thumbnail
});

const TableBlockSchema = BaseBlockSchema.extend({
  type: z.literal('table'),
  caption: z.string().optional(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  highlight_row: z.array(z.number().int().nonnegative()).optional(),
});

const TimelineBlockSchema = BaseBlockSchema.extend({
  type: z.literal('timeline'),
  title: z.string().optional(),
  orientation: z.enum(['horizontal', 'vertical']),
  events: z.array(TimelineEventSchema),
});

const ComparisonCardBlockSchema = BaseBlockSchema.extend({
  type: z.literal('comparison_card'),
  title: z.string().optional(),
  columns: z.array(ComparisonColumnSchema),
});

const AnimationBlockSchema = BaseBlockSchema.extend({
  type: z.literal('animation'),
  src: z.string(),
  caption: z.string().optional(),
  loop: z.boolean(),
  autoplay: z.boolean(),
  width: z.enum(['full', 'half']).optional(),
});

const ClassifyExerciseRowSchema = z.object({
  substance: z.string().min(1),
  is_solution: z.boolean(),
  explanation: z.string(),
});

const ClassifyExerciseBlockSchema = BaseBlockSchema.extend({
  type: z.literal('classify_exercise'),
  question: z.string().min(1),
  column_label: z.string().optional(),
  rows: z.array(ClassifyExerciseRowSchema).min(1),
});

const InlineQuizBlockSchema = BaseBlockSchema.extend({
  type: z.literal('inline_quiz'),
  questions: z.array(InlineQuizQuestionSchema).min(1),
  pass_threshold: z.number().min(0).max(1),
});

const WorkedExampleBlockSchema = BaseBlockSchema.extend({
  type: z.literal('worked_example'),
  label: z.string(),
  variant: z.enum(['solved_example', 'ncert_intext']),
  problem: z.string(),
  solution: z.string(),
  reveal_mode: z.enum(['always_visible', 'tap_to_reveal']),
  video_src: z.string().optional(),
});

const SimulationPredictionSchema = z.object({
  prompt: z.string().min(1),
  options: z.array(z.string()).min(2),
  reveal_after: z.string().min(1),
});

const SimulationBlockSchema = BaseBlockSchema.extend({
  type: z.literal('simulation'),
  simulation_id: z.string().min(1),
  title: z.string().optional(),
  prediction: SimulationPredictionSchema.optional(),
});

const ReasoningPromptBlockSchema = BaseBlockSchema.extend({
  type: z.literal('reasoning_prompt'),
  reasoning_type: z.enum(['logical', 'spatial', 'quantitative', 'analogical']),
  prompt: z.string(),
  options: z.array(z.string()).optional(),
  reveal: z.string(),
  difficulty_level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
});

const CuriosityPromptBlockSchema = BaseBlockSchema.extend({
  type: z.literal('curiosity_prompt'),
  prompt: z.string(),
  hint: z.string().optional(),
  reveal: z.string().optional(),
});

// ═════════════════════════════════════════════════════════════════════════════
// ENGLISH BLOCK SCHEMAS — Class 9 Kaveri
// Spec: _agents/workflows/ENGLISH_BOOK_PAGE_WORKFLOW.md §4
// ═════════════════════════════════════════════════════════════════════════════

const WordGlossSchema = z.object({
  word: z.string().min(1),
  occurrence: z.number().int().positive().optional(),
  meaning: z.string().min(1),
  pos: z.string().optional(),
  hindi: z.string().optional(),
  example: z.string().optional(),
});

const NarratedSentenceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  audio_url: z.string().optional(),
  glosses: z.array(WordGlossSchema).optional(),
});

const NarratedParagraphSchema = z.object({
  id: z.string().min(1),
  sentences: z.array(NarratedSentenceSchema).min(1),
  hinglish_commentary: z.string().optional(),
});

const NarratedPassageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('narrated_passage'),
  source_label: z.string().optional(),
  paragraphs: z.array(NarratedParagraphSchema).min(1),
});

const VocabCardSchema = z.object({
  id: z.string().min(1),
  word: z.string().min(1),
  pronunciation: z.string().optional(),
  audio_url: z.string().optional(),
  pos: z.string(),
  meaning: z.string().min(1),
  hindi: z.string().optional(),
  example: z.string().min(1),
  memory_hook: z.string().optional(),
});

const VocabularyLabBlockSchema = BaseBlockSchema.extend({
  type: z.literal('vocabulary_lab'),
  mode: z.enum(['flashcards', 'binomials', 'affixes', 'idioms']),
  intro: z.string().optional(),
  cards: z.array(VocabCardSchema).min(1),
  self_check: z.array(InlineQuizQuestionSchema).max(3).optional(),
});

const DeviceMatchSchema = z.object({
  text: z.string().min(1),
  explanation: z.string().min(1),
});

const DeviceHighlightSchema = z.object({
  id: z.string().min(1),
  device: z.enum([
    'simile', 'metaphor', 'personification', 'imagery',
    'alliteration', 'rhyme', 'symbolism', 'hyperbole', 'onomatopoeia',
  ]),
  matches: z.array(DeviceMatchSchema).min(1),
});

const LiteraryDevicesHighlighterBlockSchema = BaseBlockSchema.extend({
  type: z.literal('literary_devices_highlighter'),
  passage: z.string().min(1),
  devices: z.array(DeviceHighlightSchema).min(1),
});

const CharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().optional(),
  bio: z.string().min(1),
  traits: z.array(z.string()).optional(),
  portrait_url: z.string().optional(),
  portrait_prompt: z.string().optional(),
});

const RelationshipSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().min(1),
});

const CharacterMapBlockSchema = BaseBlockSchema.extend({
  type: z.literal('character_map'),
  title: z.string().optional(),
  characters: z.array(CharacterSchema).min(2).max(6),
  relationships: z.array(RelationshipSchema),
});

const ThemeCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  evidence: z.array(z.string()).min(1).max(3),
  reflection_prompt: z.string().min(1),
});

const ThemeExplorerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('theme_explorer'),
  intro: z.string().optional(),
  themes: z.array(ThemeCardSchema).min(1).max(4),
});

const ToneSegmentSchema = z.object({
  id: z.string().min(1),
  excerpt: z.string().min(1),
  emotion: z.string().min(1),
  intensity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  note: z.string().min(1),
});

const ToneMeterBlockSchema = BaseBlockSchema.extend({
  type: z.literal('tone_meter'),
  segments: z.array(ToneSegmentSchema).min(2).max(10),
});

const CulturalContextCardBlockSchema = BaseBlockSchema.extend({
  type: z.literal('cultural_context_card'),
  reference: z.string().min(1),
  category: z.enum(['place', 'person', 'event', 'concept', 'tradition']),
  short_desc: z.string().min(1),
  detail: z.string().min(1),
  image_url: z.string().optional(),
  image_prompt: z.string().optional(),
});

const ComprehensionQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).min(2).optional(),
  correct_index: z.number().int().nonnegative().optional(),
  explanation: z.string().min(1),
});

const ComprehensionCheckpointBlockSchema = BaseBlockSchema.extend({
  type: z.literal('comprehension_checkpoint'),
  intro: z.string().optional(),
  questions: z.array(ComprehensionQuestionSchema).min(1).max(3),
});

const ScaffoldPartSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  text: z.string().min(1),
  annotation: z.string().min(1),
});

const WritingScaffoldBlockSchema = BaseBlockSchema.extend({
  type: z.literal('writing_scaffold'),
  task: z.string().min(1),
  format: z.enum(['letter', 'paragraph', 'essay', 'dialogue', 'diary_entry', 'speech', 'notice']),
  model_parts: z.array(ScaffoldPartSchema).min(1),
  tips: z.array(z.string()).optional(),
});

const DialogueCharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().optional(),
});

const DialogueLineSchema = z.object({
  id: z.string().min(1),
  character_id: z.string().min(1),
  text: z.string().min(1),
  audio_url: z.string().optional(),
  stage_direction: z.string().nullable().optional(),
});

const DebateFramesSchema = z.object({
  for: z.array(z.string()).min(1),
  against: z.array(z.string()).min(1),
});

const DialogueRolePlayBlockSchema = BaseBlockSchema.extend({
  type: z.literal('dialogue_role_play'),
  mode: z.enum(['dialogue', 'debate']),
  scene_description: z.string().optional(),
  characters: z.array(DialogueCharacterSchema).min(2),
  lines: z.array(DialogueLineSchema),
  debate_frames: DebateFramesSchema.nullable().optional(),
});

const PronunciationWordSchema = z.object({
  id: z.string().min(1),
  word: z.string().min(1),
  syllables: z.string().optional(),
  ipa: z.string().optional(),
  audio_url: z.string().optional(),
  context_sentence: z.string().optional(),
  common_mistake: z.string().optional(),
});

const PronunciationDrillBlockSchema = BaseBlockSchema.extend({
  type: z.literal('pronunciation_drill'),
  intro: z.string().optional(),
  words: z.array(PronunciationWordSchema).min(1).max(12),
});

// ─── Child block union (excludes section to prevent nesting) ─────────────────

const ChildContentBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  HeadingBlockSchema,
  ImageBlockSchema,
  InteractiveImageBlockSchema,
  VideoBlockSchema,
  AudioNoteBlockSchema,
  Molecule2DBlockSchema,
  Molecule3DBlockSchema,
  LatexBlockSchema,
  PracticeLinkBlockSchema,
  CalloutBlockSchema,
  TableBlockSchema,
  TimelineBlockSchema,
  ComparisonCardBlockSchema,
  AnimationBlockSchema,
  ClassifyExerciseBlockSchema,
  InlineQuizBlockSchema,
  WorkedExampleBlockSchema,
  SimulationBlockSchema,
  ReasoningPromptBlockSchema,
  CuriosityPromptBlockSchema,
  // English blocks (Class 9 Kaveri)
  NarratedPassageBlockSchema,
  VocabularyLabBlockSchema,
  LiteraryDevicesHighlighterBlockSchema,
  CharacterMapBlockSchema,
  ThemeExplorerBlockSchema,
  ToneMeterBlockSchema,
  CulturalContextCardBlockSchema,
  ComprehensionCheckpointBlockSchema,
  WritingScaffoldBlockSchema,
  DialogueRolePlayBlockSchema,
  PronunciationDrillBlockSchema,
]);

const SectionBlockSchema = BaseBlockSchema.extend({
  type: z.literal('section'),
  layout: z.enum(['single-column', '50-50', '60-40', '40-60', 'full-bleed']),
  columns: z.array(z.array(ChildContentBlockSchema)).min(1).max(2),
  title: z.string().optional(),
});

// ─── Union ───────────────────────────────────────────────────────────────────

export const ContentBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  HeadingBlockSchema,
  ImageBlockSchema,
  InteractiveImageBlockSchema,
  VideoBlockSchema,
  AudioNoteBlockSchema,
  Molecule2DBlockSchema,
  Molecule3DBlockSchema,
  LatexBlockSchema,
  PracticeLinkBlockSchema,
  CalloutBlockSchema,
  TableBlockSchema,
  TimelineBlockSchema,
  ComparisonCardBlockSchema,
  AnimationBlockSchema,
  ClassifyExerciseBlockSchema,
  InlineQuizBlockSchema,
  WorkedExampleBlockSchema,
  SimulationBlockSchema,
  SectionBlockSchema,
  ReasoningPromptBlockSchema,
  CuriosityPromptBlockSchema,
  // English blocks (Class 9 Kaveri)
  NarratedPassageBlockSchema,
  VocabularyLabBlockSchema,
  LiteraryDevicesHighlighterBlockSchema,
  CharacterMapBlockSchema,
  ThemeExplorerBlockSchema,
  ToneMeterBlockSchema,
  CulturalContextCardBlockSchema,
  ComprehensionCheckpointBlockSchema,
  WritingScaffoldBlockSchema,
  DialogueRolePlayBlockSchema,
  PronunciationDrillBlockSchema,
]);

export const ContentBlocksArraySchema = z.array(ContentBlockSchema);

/**
 * Convenience helper — returns a structured result for API handlers.
 * Use at the edge of untrusted input (e.g. PUT body) before hitting the DB.
 */
export function validateBlocks(input: unknown):
  | { ok: true; blocks: z.infer<typeof ContentBlocksArraySchema> }
  | { ok: false; error: string; issues: z.ZodIssue[] } {
  const result = ContentBlocksArraySchema.safeParse(input);
  if (!result.success) {
    const first = result.error.issues[0];
    const path = first.path.join('.');
    const msg = first.message;
    return {
      ok: false,
      error: path ? `${path}: ${msg}` : msg,
      issues: result.error.issues,
    };
  }

  // Post-parse: validate section column counts match layout
  const sectionIssues: z.ZodIssue[] = [];
  for (let i = 0; i < result.data.length; i++) {
    const block = result.data[i];
    if (block.type !== 'section') continue;
    const singleCol = block.layout === 'single-column' || block.layout === 'full-bleed';
    const expectedCols = singleCol ? 1 : 2;
    if (block.columns.length !== expectedCols) {
      sectionIssues.push({
        code: 'custom',
        path: [i, 'columns'],
        message: `Layout "${block.layout}" requires ${expectedCols} column(s), got ${block.columns.length}`,
      });
    }
  }
  if (sectionIssues.length > 0) {
    const first = sectionIssues[0];
    return {
      ok: false,
      error: `${first.path.join('.')}: ${first.message}`,
      issues: sectionIssues,
    };
  }

  return { ok: true, blocks: result.data };
}
