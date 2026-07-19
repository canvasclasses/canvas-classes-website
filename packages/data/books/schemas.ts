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
  // Bloom tier of the item (1=recall, 2=comprehension, 3=interpretation) — drives
  // the L1→L2→L3 ladder and the no-length-tell guard. Optional for legacy data.
  difficulty_level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
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
  objective: z.string().optional(), // §15.2 — outcome/driving question under the heading
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
  decorative: z.boolean().optional(),
  figure_key: z.string().optional(),
  figure_number: z.string().optional(),
});

const GalleryItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const GalleryBlockSchema = BaseBlockSchema.extend({
  type: z.literal('gallery'),
  items: z.array(GalleryItemSchema),
  aspect_ratio: z.enum(['16:9', '16:5', '4:3', '3:2', '1:1', '21:9']).optional(),
  figure_key: z.string().optional(),
  figure_number: z.string().optional(),
});

const InteractiveImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('interactive_image'),
  src: z.string(),
  alt: z.string(),
  hotspots: z.array(HotspotSchema),
  caption: z.string().optional(),
  generation_prompt: z.string().optional(),
  width: z.enum(['full', 'five_sixth', 'three_quarter', 'two_third', 'half', 'two_fifth', 'third', 'quarter']).optional(),
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
  figure_key: z.string().optional(),
  figure_number: z.string().optional(),
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
    'voices_that_inspire',
    // Social Science engagement-plan variant (2026-07-08) — renders via the
    // default NoteCallout card, no new renderer needed. See
    // _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md "Engagement retrofit" section.
    // (`career_spotlight` was here too but was promoted to its own block type —
    // see CareerSpotlightBlockSchema below — after founder feedback that a wall
    // of prose buries the actual list of professions.)
    'evidence_pack',
  ]),
  title: z.string().optional(),
  markdown: z.string(),
  markdown_hinglish: z.string().optional(), // Hinglish twin shown in HI mode (e.g. literature_in_life)
  image_src: z.string().optional(),    // thumbnail — empty string = not yet uploaded
  image_prompt: z.string().optional(), // AI generation spec for the thumbnail
});

const TableBlockSchema = BaseBlockSchema.extend({
  type: z.literal('table'),
  caption: z.string().optional(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  highlight_row: z.array(z.number().int().nonnegative()).optional(),
  figure_key: z.string().optional(),
  figure_number: z.string().optional(),
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
  reveal_after: z.string().min(1).optional(),
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
  english: z.string().optional(),
  example: z.string().min(1),
  memory_hook: z.string().optional(),
});

const VocabularyLabBlockSchema = BaseBlockSchema.extend({
  type: z.literal('vocabulary_lab'),
  mode: z.enum(['flashcards', 'binomials', 'affixes', 'idioms']),
  lang: z.enum(['english', 'hindi']).optional(),
  intro: z.string().optional(),
  cards: z.array(VocabCardSchema).min(1),
  self_check: z.array(InlineQuizQuestionSchema).max(3).optional(),
});

const DeviceMatchSchema = z.object({
  text: z.string().min(1),
  explanation: z.string().min(1),
  explanation_hinglish: z.string().optional(),
});

const DeviceHighlightSchema = z.object({
  id: z.string().min(1),
  device: z.enum([
    'simile', 'metaphor', 'personification', 'imagery',
    'alliteration', 'rhyme', 'symbolism', 'hyperbole', 'onomatopoeia',
    'vyangya', 'virodhabhas', 'samvadatmakta', 'sandeh', 'padavritti', 'refrain',
  ]),
  matches: z.array(DeviceMatchSchema).min(1),
});

const LiteraryDevicesHighlighterBlockSchema = BaseBlockSchema.extend({
  type: z.literal('literary_devices_highlighter'),
  lang: z.enum(['english', 'hindi']).optional(),
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
  description_hinglish: z.string().optional(),
  evidence: z.array(z.string()).min(1).max(3),
  reflection_prompt: z.string().min(1),
  reflection_prompt_hinglish: z.string().optional(),
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
  note_hinglish: z.string().optional(),
});

const ToneMeterBlockSchema = BaseBlockSchema.extend({
  type: z.literal('tone_meter'),
  segments: z.array(ToneSegmentSchema).min(2).max(10),
});

const CulturalContextCardBlockSchema = BaseBlockSchema.extend({
  type: z.literal('cultural_context_card'),
  reference: z.string().min(1),
  category: z.enum(['place', 'person', 'event', 'concept', 'tradition', 'history']),
  short_desc: z.string().min(1),
  detail: z.string().min(1),
  detail_hinglish: z.string().optional(),
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
  questions: z.array(ComprehensionQuestionSchema).min(1).max(10),
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

const PRACTICE_CONCEPT = z.enum([
  // English (Kaveri)
  'comprehension', 'vocab_in_context', 'grammar', 'interpretation', 'inference',
  // Science / Math (chapter-end practice banks) — see PracticeConceptTag in types/books.ts
  'concept', 'application', 'numerical', 'reasoning', 'recall',
]);

const PracticeQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).min(2, 'practice question must have at least 2 options'),
  correct_index: z.number().int().nonnegative(),
  explanation: z.string().optional(),
  concept_tag: PRACTICE_CONCEPT,
  difficulty: z.number().int().min(1).max(5),
});

const ChapterPracticeBlockSchema = BaseBlockSchema.extend({
  type: z.literal('chapter_practice'),
  title: z.string().optional(),
  intro: z.string().optional(),
  chapter_number: z.number().int().positive(),
  session_size: z.number().int().min(1).max(50).optional(),
  pass_threshold: z.number().min(0).max(1).optional(),
  questions: z.array(PracticeQuestionSchema).min(1).max(100),
});

// Junior practice — bank-backed; embeds NO questions (fetched at runtime from
// the junior_questions bank). See JuniorPracticeBlock in types/books.ts.
const JuniorPracticeBlockSchema = BaseBlockSchema.extend({
  type: z.literal('junior_practice'),
  title: z.string().optional(),
  intro: z.string().optional(),
  book_slug: z.string().min(1),
  chapter_number: z.number().int().positive(),
  session_size: z.number().int().min(1).max(50).optional(),
  pass_threshold: z.number().min(0).max(1).optional(),
  mode: z.enum(['practice', 'test']).optional(),
});

// PRACTICE BANK — section-navigated, source-tagged end-of-chapter bank.
const PRACTICE_SOURCE = z.enum(['ncert_exercise', 'ncert_exemplar', 'cbse_pyq', 'jee_neet', 'mcq']);
const PracticeBankItemSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('mcq'),
    id: z.string().min(1),
    source: PRACTICE_SOURCE,
    source_label: z.string().optional(),
    prompt: z.string().min(1),
    options: z.array(z.string()).min(2),
    correct_index: z.number().int().min(0),
    explanation: z.string().min(1),
  }),
  z.object({
    kind: z.literal('numerical'),
    id: z.string().min(1),
    source: PRACTICE_SOURCE,
    source_label: z.string().optional(),
    prompt: z.string().min(1),
    answer: z.string().optional(),
    solution: z.string().min(1),
  }),
]);
const PracticeBankSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  blurb: z.string().optional(),
  items: z.array(PracticeBankItemSchema).min(1),
});
const PracticeBankBlockSchema = BaseBlockSchema.extend({
  type: z.literal('practice_bank'),
  title: z.string().optional(),
  intro: z.string().optional(),
  sections: z.array(PracticeBankSectionSchema).min(1),
});

const GroupElementsBlockSchema = BaseBlockSchema.extend({
  type: z.literal('group_elements'),
  title: z.string().optional(),
  intro: z.string().optional(),
  element_symbols: z.array(z.string()).min(1),
});

const ChallengeBase = {
  id: z.string().min(1),
  concept_tag: PRACTICE_CONCEPT,
  difficulty: z.number().int().min(1).max(5),
  explanation: z.string().optional(),
};
const ApplyChallengeSchema = z.discriminatedUnion('kind', [
  z.object({ ...ChallengeBase, kind: z.literal('fill_blank'),
    prompt: z.string().min(1), answers: z.array(z.array(z.string().min(1)).min(1)).min(1), hint: z.string().optional() }),
  z.object({ ...ChallengeBase, kind: z.literal('predict_word'),
    lead: z.string().min(1), answers: z.array(z.string().min(1)).min(1), full_line: z.string().optional() }),
  z.object({ ...ChallengeBase, kind: z.literal('word_builder'),
    base: z.string().min(1), affixes: z.array(z.string().min(1)).min(2).max(8),
    correct: z.string().min(1), target: z.string().min(1),
    position: z.enum(['prefix', 'suffix']).optional(), meaning_hint: z.string().optional() }),
  z.object({ ...ChallengeBase, kind: z.literal('sentence_compose'),
    word: z.string().min(1), instruction: z.string().min(1),
    rubric: z.array(z.string().min(1)).min(1).max(5), model_answer: z.string().min(1),
    min_words: z.number().int().min(1).max(40).optional() }),
  z.object({ ...ChallengeBase, kind: z.literal('unscramble'),
    tokens: z.array(z.string().min(1)).min(3).max(20), answer: z.string().min(1) }),
  z.object({ ...ChallengeBase, kind: z.literal('word_match'),
    instruction: z.string().optional(),
    pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })).min(2).max(8) }),
  // ─── Grammar Gym kinds ───
  z.object({ ...ChallengeBase, kind: z.literal('transform'),
    source: z.string().min(1), instruction: z.string().min(1),
    answers: z.array(z.string().min(1)).min(1), hint: z.string().optional(), rule: z.string().optional() }),
  z.object({ ...ChallengeBase, kind: z.literal('spot_error'),
    tokens: z.array(z.string().min(1)).min(3).max(40), error_index: z.number().int().nonnegative(),
    fix: z.string().min(1), fix_options: z.array(z.string().min(1)).min(2).max(5).optional(),
    rule: z.string().optional() }),
  z.object({ ...ChallengeBase, kind: z.literal('form_select'),
    prompt: z.string().min(1), options: z.array(z.string().min(1)).min(2).max(5),
    correct_index: z.number().int().nonnegative(),
    option_reasons: z.array(z.string()).optional() }),
]);

const ApplyExpressBlockSchema = BaseBlockSchema.extend({
  type: z.literal('apply_express'),
  title: z.string().optional(),
  intro: z.string().optional(),
  chapter_number: z.number().int().positive(),
  variant: z.enum(['apply', 'grammar']).optional(),
  challenges: z.array(ApplyChallengeSchema).min(1).max(50),
});

// Reading Comprehension — CBSE "Reading Skills" unseen-passage block.
const ReadingQuestionSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('mcq'), id: z.string().min(1), question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(5), correct_index: z.number().int().nonnegative(),
    explanation: z.string().optional() }),
  z.object({ kind: z.literal('assertion_reason'), id: z.string().min(1),
    assertion: z.string().min(1), reason: z.string().min(1),
    correct_index: z.number().int().min(0).max(3), explanation: z.string().optional() }),
  z.object({ kind: z.literal('short_answer'), id: z.string().min(1), question: z.string().min(1),
    model_answer: z.string().min(1), hint: z.string().optional() }),
]);
const ReadingComprehensionBlockSchema = BaseBlockSchema.extend({
  type: z.literal('reading_comprehension'),
  passage_type: z.enum(['discursive', 'factual', 'case_based', 'literary', 'descriptive']),
  lang: z.enum(['english', 'hindi']).optional(),
  title: z.string().optional(),
  intro: z.string().optional(),
  passage: z.string().min(1),
  numbered: z.boolean().optional(),
  word_count: z.number().int().positive().optional(),
  source_note: z.string().optional(),
  questions: z.array(ReadingQuestionSchema).min(1).max(20),
});

// Meet a Scientist / Meet the Author — biographical card (science, math, English
// author pages). Read-only in the editor; authored by book-build scripts. Every
// field is listed so the page route's Zod .strip() does not drop it on save —
// especially `portrait_prompt`, which is needed to generate the portrait later.
const MeetAScientistBlockSchema = BaseBlockSchema.extend({
  type: z.literal('meet_a_scientist'),
  name: z.string().min(1),
  years: z.string().min(1),
  nationality: z.string().min(1),
  portrait_src: z.string().optional(),
  portrait_prompt: z.string().optional(),
  contribution: z.string().min(1),
  connection: z.string().min(1),
  fun_detail: z.string().min(1),
  learn_more: z.string().min(1),
});

// ─── Life Skills blocks (Class 9 & 10 strand — LIFE_SKILLS_WORKFLOW.md §5) ───

const GuidedPracticeStepSchema = z.object({
  id: z.string().min(1),
  instruction: z.string().min(1),
  duration_sec: z.number().int().positive().optional(),
});

const BreathPatternSchema = z.object({
  inhale_sec: z.number().positive(),
  hold_sec: z.number().positive().optional(),
  exhale_sec: z.number().positive(),
  hold_out_sec: z.number().positive().optional(),
  cycles: z.number().int().min(1).max(50),
});

const GuidedPracticeBlockSchema = BaseBlockSchema.extend({
  type: z.literal('guided_practice'),
  practice_kind: z.enum(['breathing', 'focus_timer', 'meditation', 'observation', 'custom']),
  title: z.string().min(1),
  intro: z.string().optional(),
  steps: z.array(GuidedPracticeStepSchema),
  breath_pattern: BreathPatternSchema.optional(),
  audio_url: z.string().optional(),
  completion_note: z.string().optional(),
});

const ReflectionJournalBlockSchema = BaseBlockSchema.extend({
  type: z.literal('reflection_journal'),
  prompt: z.string().min(1),
  placeholder: z.string().optional(),
  min_words: z.number().int().positive().optional(),
});

const HabitTrackerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('habit_tracker'),
  title: z.string().min(1),
  habit: z.string().min(1),
  duration_days: z.number().int().min(1).max(60),
  why: z.string().optional(),
  day_labels: z.array(z.string()).optional(),
});

const FocusGameBlockSchema = BaseBlockSchema.extend({
  type: z.literal('focus_game'),
  test_id: z.string().min(1),
  role: z.enum(['baseline', 'retest', 'standalone']),
  title: z.string().min(1),
  intro: z.string().optional(),
  duration_sec: z.number().int().min(30).max(600).optional(),
  completion_note: z.string().optional(),
});

const AttentionXrayCardSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  front: z.string().min(1),
  reveal: z.string().min(1),
});
const AttentionXrayBlockSchema = BaseBlockSchema.extend({
  type: z.literal('attention_xray'),
  title: z.string().min(1),
  intro: z.string().optional(),
  cards: z.array(AttentionXrayCardSchema).min(2).max(10),
  closing: z.string().min(1),
  watch_note: z.string().optional(),
});

const SelfExperimentOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  explanation: z.string().min(1),
});
const SelfExperimentBlockSchema = BaseBlockSchema.extend({
  type: z.literal('self_experiment'),
  title: z.string().min(1),
  intro: z.string().min(1),
  steps: z.array(z.string().min(1)).max(8).optional(),
  duration_sec: z.number().int().min(30).max(1800).optional(),
  prompt: z.string().min(1),
  options: z.array(SelfExperimentOptionSchema).min(2).max(12),
  min_select: z.number().int().min(1).max(12).optional(),
  completion_note: z.string().optional(),
});

const GuidedRevealCheckerOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  weight: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});
const GuidedRevealCheckerSchema = z.object({
  task_label: z.string().min(1),
  tasks: z.array(GuidedRevealCheckerOptionSchema).min(2).max(6),
  audio_label: z.string().min(1),
  audios: z.array(GuidedRevealCheckerOptionSchema).min(2).max(6),
  verdicts: z.object({ high: z.string().min(1), mild: z.string().min(1), clear: z.string().min(1) }),
});
const GuidedRevealStepSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['point', 'cost_checker']),
  kicker: z.string().optional(),
  headline: z.string().min(1),
  body: z.string().optional(),
  image_src: z.string().optional(),
  checker: GuidedRevealCheckerSchema.optional(),
});
const GuidedRevealBlockSchema = BaseBlockSchema.extend({
  type: z.literal('guided_reveal'),
  title: z.string().min(1),
  intro: z.string().optional(),
  steps: z.array(GuidedRevealStepSchema).min(2).max(20),
  outro: z.string().optional(),
});

// Perspective Scenario — Social Science engagement mechanic (2026-07-08, founder
// design). See PerspectiveScenarioBlock in types/books.ts for the full rationale.
const PerspectiveScenarioOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  real_position: z.string().min(1),
  perspective: z.string().min(1),
});
const PerspectiveScenarioBlockSchema = BaseBlockSchema.extend({
  type: z.literal('perspective_scenario'),
  title: z.string().min(1),
  role_frame: z.string().min(1),
  event_context: z.string().min(1),
  image_src: z.string().optional(),
  image_prompt: z.string().optional(),
  image_caption: z.string().optional(),
  source_note: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(PerspectiveScenarioOptionSchema).min(2).max(4),
  synthesis: z.string().min(1),
});

// Career Spotlight — see CareerSpotlightBlock in types/books.ts.
const CareerRoleSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(1),
});
const CareerSpotlightBlockSchema = BaseBlockSchema.extend({
  type: z.literal('career_spotlight'),
  title: z.string().min(1),
  intro: z.string().optional(),
  careers: z.array(CareerRoleSchema).min(2).max(6),
  closing: z.string().optional(),
});

// "You Solve It" — Social Science problem-solving mechanic (2026-07-10, founder
// design). See YouSolveItBlock in types/books.ts for the full rationale.
const YouSolveItSolutionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  upside: z.string().min(1),
  tradeoff: z.string().min(1),
});
const YouSolveItBlockSchema = BaseBlockSchema.extend({
  type: z.literal('you_solve_it'),
  title: z.string().min(1),
  problem: z.string().min(1),
  why_hard: z.string().min(1),
  image_src: z.string().optional(),
  image_prompt: z.string().optional(),
  image_caption: z.string().optional(),
  source_note: z.string().min(1),
  solutions: z.array(YouSolveItSolutionSchema).min(2).max(4),
  prompt: z.string().min(1),
  reality_check: z.string().min(1),
});

// ─── Child block union (excludes section to prevent nesting) ─────────────────

const ChildContentBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  HeadingBlockSchema,
  ImageBlockSchema,
  GalleryBlockSchema,
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
  MeetAScientistBlockSchema,
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
  ChapterPracticeBlockSchema,
  ApplyExpressBlockSchema,
  ReadingComprehensionBlockSchema,
  JuniorPracticeBlockSchema,
  // Life Skills blocks
  GuidedPracticeBlockSchema,
  ReflectionJournalBlockSchema,
  HabitTrackerBlockSchema,
  FocusGameBlockSchema,
  AttentionXrayBlockSchema,
  SelfExperimentBlockSchema,
  GuidedRevealBlockSchema,
  PerspectiveScenarioBlockSchema,
  CareerSpotlightBlockSchema,
  YouSolveItBlockSchema,
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
  GalleryBlockSchema,
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
  MeetAScientistBlockSchema,
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
  ChapterPracticeBlockSchema,
  ApplyExpressBlockSchema,
  ReadingComprehensionBlockSchema,
  JuniorPracticeBlockSchema,
  PracticeBankBlockSchema,
  GroupElementsBlockSchema,
  // Life Skills blocks (Class 9 & 10 strand)
  GuidedPracticeBlockSchema,
  ReflectionJournalBlockSchema,
  HabitTrackerBlockSchema,
  FocusGameBlockSchema,
  AttentionXrayBlockSchema,
  SelfExperimentBlockSchema,
  GuidedRevealBlockSchema,
  PerspectiveScenarioBlockSchema,
  CareerSpotlightBlockSchema,
  YouSolveItBlockSchema,
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
