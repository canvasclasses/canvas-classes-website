// ─── Block Types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'text'
  | 'heading'
  | 'image'
  | 'classify_exercise'
  | 'interactive_image'
  | 'video'
  | 'audio_note'
  | 'molecule_2d'
  | 'molecule_3d'
  | 'latex_block'
  | 'practice_link'
  | 'callout'
  | 'table'
  | 'timeline'
  | 'comparison_card'
  | 'animation'
  | 'inline_quiz'
  | 'worked_example'
  | 'simulation'
  | 'section'
  | 'reasoning_prompt'
  | 'curiosity_prompt'
  // ─── ENGLISH BLOCKS (Class 9 Kaveri — see _agents/workflows/ENGLISH_BOOK_PAGE_WORKFLOW.md) ───
  | 'narrated_passage'
  | 'vocabulary_lab'
  | 'literary_devices_highlighter'
  | 'character_map'
  | 'theme_explorer'
  | 'tone_meter'
  | 'cultural_context_card'
  | 'comprehension_checkpoint'
  | 'writing_scaffold'
  | 'dialogue_role_play'
  | 'pronunciation_drill';

export interface BaseBlock {
  id: string;        // crypto.randomUUID() — stable, used for drag-drop keys
  type: BlockType;
  order: number;     // 0-indexed position on page
  /**
   * Audience tier for tiered access. Phase 0 = tag only (stored, not yet
   * enforced in the reader). Absent / 'core' = CBSE / all audiences;
   * 'competitive' = NEET/JEE depth, to be gated to paid plans in a later
   * phase. (Named `tier`, not `level`, to avoid clashing with HeadingBlock's
   * `level`.) See GBrain decision doc 2026-05-30-livebooks-leveling-and-pricing.
   */
  tier?: 'core' | 'competitive';
}

// 1. TEXT — markdown with inline LaTeX support
export interface TextBlock extends BaseBlock {
  type: 'text';
  markdown: string;  // Full markdown. Inline LaTeX via $...$
}

// 2. HEADING — section title within a page
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  text: string;
  level: 1 | 2 | 3; // h2/h3/h4 in context (h1 reserved for page title)
}

// 3. IMAGE — static image with optional caption
// When `align` is 'left' or 'right' AND `side_text` is set, the image renders
// inline with the text beside it (magazine-style). Otherwise it behaves as a
// centred figure at the chosen `width`.
export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;       // R2 CDN URL — empty string means image not yet uploaded
  alt: string;
  caption?: string;
  width?: 'full' | 'five_sixth' | 'three_quarter' | 'two_third' | 'half' | 'two_fifth' | 'third' | 'quarter';
  align?: 'center' | 'left' | 'right';   // horizontal placement — default 'center'
  side_text?: string;                    // markdown shown beside image when align ≠ 'center'
  generation_prompt?: string;  // AI image generation prompt — shown as placeholder until src is filled
  // Optional display crop. undefined = natural proportions (no crop, full height).
  // When set, the container is locked to that ratio and the image covers it (object-cover).
  aspect_ratio?: '16:9' | '16:5' | '4:3' | '3:2' | '1:1' | '21:9';
}

// 4. INTERACTIVE IMAGE — SVG/PNG with tappable hotspot annotations
export interface Hotspot {
  id: string;
  x: number;         // 0–1 relative to image width
  y: number;         // 0–1 relative to image height
  label: string;
  detail: string;    // Shown in popup on tap. Supports inline markdown.
  icon?: 'circle' | 'pin' | 'plus';
}
export interface InteractiveImageBlock extends BaseBlock {
  type: 'interactive_image';
  src: string;
  alt: string;
  hotspots: Hotspot[];
  caption?: string;
}

// 5. VIDEO — short lecture clip
export interface VideoBlock extends BaseBlock {
  type: 'video';
  src: string;       // Cloudflare Stream ID or R2 direct URL
  provider: 'cloudflare_stream' | 'r2_direct' | 'youtube_nocookie';
  poster?: string;   // R2 URL of thumbnail
  title?: string;    // Short descriptor shown in page listing cards, e.g. "Crystallisation Explained"
  caption?: string;
  duration_sec: number;
  autoplay?: false;  // Always false — never autoplay educational video
}

// 6. AUDIO NOTE — teacher voice annotation
export interface AudioNoteBlock extends BaseBlock {
  type: 'audio_note';
  src: string;       // R2 URL — mp3 or m4a
  label: string;     // e.g. "Teacher note" or "Exam tip"
  duration_sec: number;
  transcript?: string;
}

// 7. MOLECULE 2D — structural chemistry formula
export interface Molecule2DBlock extends BaseBlock {
  type: 'molecule_2d';
  smiles: string;
  name: string;
  iupac?: string;
  rendered_svg_url?: string;
  caption?: string;
}

// 8. MOLECULE 3D — interactive 3D structure
export interface Molecule3DBlock extends BaseBlock {
  type: 'molecule_3d';
  smiles: string;
  name: string;
  caption?: string;
}

// 9. LATEX BLOCK — display (block-level) equation
export interface LatexBlock extends BaseBlock {
  type: 'latex_block';
  latex: string;     // Raw LaTeX, no $$ delimiters — added by renderer
  label?: string;    // e.g. "Equation 3.1"
  note?: string;
}

// 10. PRACTICE LINK — links to Crucible questions
export interface PracticeLinkBlock extends BaseBlock {
  type: 'practice_link';
  question_ids: string[];   // Array of display_ids e.g. ["CELL-001"]
  chapter_tag?: string;
  label: string;
  style: 'inline_quiz' | 'link_to_crucible';
}

// 11. CALLOUT — highlighted note/warning/tip box
export type CalloutVariant =
  | 'remember' | 'note' | 'warning' | 'exam_tip' | 'fun_fact'
  | 'threads_of_curiosity' | 'bridging_science' | 'india_science'
  | 'what_if' | 'quest_continues' | 'ready_to_go_beyond'
  // English-track variants — see ENGLISH_BOOK_PAGE_WORKFLOW.md §3.1
  | 'india_voice' | 'literature_in_life';
export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  variant: CalloutVariant;
  title?: string;
  markdown: string;
  // Optional thumbnail shown on the left side of note callouts (scientist profiles, etc.)
  image_src?: string;    // R2 CDN URL — empty string means not yet uploaded
  image_prompt?: string; // AI generation prompt — shown as placeholder spec until image is uploaded
}

// 12. TABLE — structured data table
export interface TableBlock extends BaseBlock {
  type: 'table';
  caption?: string;
  headers: string[];
  rows: string[][];
  highlight_row?: number[];
}

// 13. TIMELINE — sequential events / process steps
export interface TimelineEvent {
  id: string;
  label: string;
  detail?: string;
  icon?: string;
}
export interface TimelineBlock extends BaseBlock {
  type: 'timeline';
  title?: string;
  orientation: 'horizontal' | 'vertical';
  events: TimelineEvent[];
}

// 14. COMPARISON CARD — side-by-side comparison
export interface ComparisonColumn {
  heading: string;
  color?: string;
  points: string[];
}
export interface ComparisonCardBlock extends BaseBlock {
  type: 'comparison_card';
  title?: string;
  columns: ComparisonColumn[];  // Typically 2, max 3
}

// 15. ANIMATION — Lottie animation file
export interface AnimationBlock extends BaseBlock {
  type: 'animation';
  src: string;       // R2 URL — .lottie or .json
  caption?: string;
  loop: boolean;
  autoplay: boolean;
  width?: 'full' | 'half';
}

// 15b. CLASSIFY EXERCISE — student labels each row before seeing answers
export interface ClassifyExerciseRow {
  substance: string;     // Item to classify — e.g. "Steel", "Mist"
  is_solution: boolean;  // Correct answer
  explanation: string;   // Revealed after the student commits their answer
}
export interface ClassifyExerciseBlock extends BaseBlock {
  type: 'classify_exercise';
  question: string;       // Prompt shown above the table — e.g. "Which of these are true solutions?"
  column_label?: string;  // Header for the first column — default 'Substance'
  rows: ClassifyExerciseRow[];
}

// 16. INLINE QUIZ — milestone gate MCQ
export interface InlineQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}
export interface InlineQuizBlock extends BaseBlock {
  type: 'inline_quiz';
  questions: InlineQuizQuestion[];
  pass_threshold: number;  // 0–1, e.g. 0.7 = 70%
}

// 17. WORKED EXAMPLE — solved example or NCERT intext question
export interface WorkedExampleBlock extends BaseBlock {
  type: 'worked_example';
  label: string;           // e.g. "Solved Example 3.1" or "NCERT Intext 2.3"
  variant: 'solved_example' | 'ncert_intext';
  problem: string;         // Markdown + LaTeX
  solution: string;        // Markdown + LaTeX
  reveal_mode: 'always_visible' | 'tap_to_reveal';
  video_src?: string;      // R2 URL for walkthrough video
}

// 18. SIMULATION — embedded interactive lab/simulator
export interface SimulationPrediction {
  prompt: string;       // "What do you think will happen if...?"
  options: string[];    // e.g. ["Yes, it will double", "No, it won't change", "It depends"]
  reveal_after: string; // Shown below the sim after they've interacted — explains what actually happens
}
export interface SimulationBlock extends BaseBlock {
  type: 'simulation';
  simulation_id: string;  // e.g. 'fractional-distillation', 'crystallisation-column'
  title?: string;
  prediction?: SimulationPrediction; // Optional predict-observe-explain layer
}

// 21. CURIOSITY PROMPT — open-ended Block 0 hook for Class 9 pages
// No MCQ, no correct answer — primes curiosity before the concept is introduced.
export interface CuriosityPromptBlock extends BaseBlock {
  type: 'curiosity_prompt';
  prompt: string;   // Open-ended question answerable with zero prior knowledge
  hint?: string;    // Optional one-line nudge if the student feels stuck
  reveal?: string;  // Optional teacher-voice reflection shown after "I've thought about it"
}

// 20. REASONING PROMPT — mid-page application MCQ for Class 9 pages
export type ReasoningType = 'logical' | 'spatial' | 'quantitative' | 'analogical';
export interface ReasoningPromptBlock extends BaseBlock {
  type: 'reasoning_prompt';
  reasoning_type: ReasoningType;
  prompt: string;           // The reasoning question / scenario
  options?: string[];       // If provided: MCQ-style; if absent: open-ended (student just reads + thinks)
  reveal: string;           // Shown after committing — not "the answer" but "what to notice"
  difficulty_level: 1 | 2 | 3 | 4 | 5;
}

// 19. SECTION — column layout container
export type SectionLayout = 'single-column' | '50-50' | '60-40' | '40-60' | 'full-bleed';
export interface SectionBlock extends BaseBlock {
  type: 'section';
  layout: SectionLayout;
  columns: ContentBlock[][];  // columns[0] = left, columns[1] = right (for 2-col)
  title?: string;             // optional visible section heading
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENGLISH BLOCKS — Class 9 Kaveri
// Spec: _agents/workflows/ENGLISH_BOOK_PAGE_WORKFLOW.md §4
// Renderers: packages/book-renderer/blocks/english/*
// ═══════════════════════════════════════════════════════════════════════════════

// E1. NARRATED PASSAGE — original literature text with per-sentence audio, tap-for-meaning glosses,
//     and an optional Hinglish teacher-voice commentary per paragraph.
export interface WordGloss {
  word: string;          // exact substring in the sentence's `text`
  occurrence?: number;   // 1-indexed; default 1. Set to 2+ if `word` repeats in the same sentence.
  meaning: string;       // plain-English definition
  pos?: string;          // 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom' | 'phrase'
  hindi?: string;        // Devanagari one- or two-word translation
  example?: string;      // a different sentence using the same word
}
export interface NarratedSentence {
  id: string;
  text: string;          // verbatim from Kaveri — NEVER paraphrased
  audio_url?: string;    // R2 URL of pre-recorded human audio; "" until recorded
  glosses?: WordGloss[];
}
export interface NarratedParagraph {
  id: string;
  sentences: NarratedSentence[];
  hinglish_commentary?: string;  // optional teacher-voice Hinglish under the paragraph
}
export interface NarratedPassageBlock extends BaseBlock {
  type: 'narrated_passage';
  source_label?: string;          // e.g. "Reading for Meaning · Part I" or "Stanza 2"
  paragraphs: NarratedParagraph[];
}

// E2. VOCABULARY LAB — multi-mode word workshop covering single words, binomials,
//     prefix/suffix word formation, and idioms.
export type VocabularyLabMode = 'flashcards' | 'binomials' | 'affixes' | 'idioms';
export interface VocabCard {
  id: string;
  word: string;                 // the word, binomial ("sink or swim"), affixed form, or idiom
  pronunciation?: string;       // informal respelling — "TEE-dee-us" — friendlier than IPA
  audio_url?: string;           // single-word audio (~1s); "" until recorded
  pos: string;
  meaning: string;
  hindi?: string;               // Devanagari one- or two-word gloss
  example: string;              // one short sentence using the word in everyday context
  memory_hook?: string;         // sound-alike, vivid image, or mnemonic — optional
}
export interface VocabularyLabBlock extends BaseBlock {
  type: 'vocabulary_lab';
  mode: VocabularyLabMode;
  intro?: string;
  cards: VocabCard[];
  self_check?: InlineQuizQuestion[];  // optional 1–3 question mini-check; reuses inline-quiz shape
}

// E3. LITERARY DEVICES HIGHLIGHTER — passage with togglable highlighting per device.
//     The English analogue of a "simulator": abstraction made visible.
export type LiteraryDevice =
  | 'simile' | 'metaphor' | 'personification' | 'imagery'
  | 'alliteration' | 'rhyme' | 'symbolism' | 'hyperbole' | 'onomatopoeia';
export interface DeviceMatch {
  text: string;          // exact substring of the passage that demonstrates this device
  explanation: string;   // 1–2 sentences: what device, what reading it unlocks
}
export interface DeviceHighlight {
  id: string;
  device: LiteraryDevice;
  matches: DeviceMatch[];
}
export interface LiteraryDevicesHighlighterBlock extends BaseBlock {
  type: 'literary_devices_highlighter';
  passage: string;       // 1–4 sentences of prose or one stanza of poetry
  devices: DeviceHighlight[];
}

// E4. CHARACTER MAP — interactive relationship graph for stories with 3+ named characters.
export interface Character {
  id: string;            // stable id used as relationship endpoint
  name: string;
  role?: string;         // narrator | protagonist | antagonist | co-protagonist | minor
  bio: string;           // 1–3 sentences — motivation-first, not appearance
  traits?: string[];     // 2–4 adjectives
  portrait_url?: string; // R2 URL of painterly portrait; "" until generated
  portrait_prompt?: string; // §7 painterly literary illustration prompt
}
export interface Relationship {
  from: string;          // Character.id
  to: string;            // Character.id
  label: string;         // "granddaughter of", "rival of", etc.
}
export interface CharacterMapBlock extends BaseBlock {
  type: 'character_map';
  title?: string;
  characters: Character[];
  relationships: Relationship[];
}

// E5. THEME EXPLORER — theme cards with textual evidence and open reflection prompts.
//     Each card is a conversation, not a moral.
export interface ThemeCard {
  id: string;
  title: string;             // phrase, e.g. "Learning has no expiry date"
  description: string;       // 1–2 sentences, neutral framing
  evidence: string[];        // 1–3 short verbatim quotes from the chapter
  reflection_prompt: string; // points outward, genuinely open
}
export interface ThemeExplorerBlock extends BaseBlock {
  type: 'theme_explorer';
  intro?: string;
  themes: ThemeCard[];
}

// E6. TONE METER — emotional arc visualisation across a chapter or poem.
export interface ToneSegment {
  id: string;
  excerpt: string;       // short verbatim text from the passage
  emotion: string;       // one word — wonder | dread | regret | tenderness | defiance | etc.
  intensity: 1 | 2 | 3 | 4 | 5;
  note: string;          // one sentence on why this segment carries this emotion
}
export interface ToneMeterBlock extends BaseBlock {
  type: 'tone_meter';
  segments: ToneSegment[];  // 4–8 segments per chapter
}

// E7. CULTURAL CONTEXT CARD — standalone reference card for a place/person/concept
//     the non-native reader may not recognise.
export type CulturalContextCategory = 'place' | 'person' | 'event' | 'concept' | 'tradition';
export interface CulturalContextCardBlock extends BaseBlock {
  type: 'cultural_context_card';
  reference: string;     // "Kashi" | "Triveni" | "Lord Vishweshwara"
  category: CulturalContextCategory;
  short_desc: string;    // one-line headline
  detail: string;        // 2–4 sentences in markdown
  image_url?: string;    // optional painterly illustration; "" until uploaded
  image_prompt?: string; // §7 painterly literary illustration prompt
}

// E8. COMPREHENSION CHECKPOINT — Kaveri's "Check Your Understanding" mid-passage.
//     Lighter weight than inline_quiz; questions can be MCQ or open-ended.
export interface ComprehensionQuestion {
  id: string;
  question: string;
  options?: string[];         // omit for open-ended ("Do you think… Why?")
  correct_index?: number;
  explanation: string;
}
export interface ComprehensionCheckpointBlock extends BaseBlock {
  type: 'comprehension_checkpoint';
  intro?: string;             // soft framing — "Pause and check"
  questions: ComprehensionQuestion[];   // 1–3 questions
}

// E9. WRITING SCAFFOLD — annotated model answer for Kaveri's Writing Task.
export type WritingFormat =
  | 'letter' | 'paragraph' | 'essay' | 'dialogue'
  | 'diary_entry' | 'speech' | 'notice';
export interface ScaffoldPart {
  id: string;
  label: string;              // "Subject line" | "Paragraph 1 — state the problem"
  text: string;               // the model text for this part
  annotation: string;         // why this works (tap-to-reveal in UI)
}
export interface WritingScaffoldBlock extends BaseBlock {
  type: 'writing_scaffold';
  task: string;               // verbatim from Kaveri's Writing Task
  format: WritingFormat;
  model_parts: ScaffoldPart[];
  tips?: string[];            // 2–4 practical writing tips
}

// E10. DIALOGUE / ROLE PLAY — scripted dialogue (one character per student) or debate
//      (For / Against sides with sentence frames).
export type DialogueMode = 'dialogue' | 'debate';
export interface DialogueCharacter {
  id: string;
  name: string;
  color?: string;             // dark-theme accent name, mapped by renderer
}
export interface DialogueLine {
  id: string;
  character_id: string;
  text: string;
  audio_url?: string;         // played when student is NOT this character
  stage_direction?: string | null; // italicised acting context
}
export interface DebateFrames {
  for: string[];              // sentence-starter prompts for the FOR side
  against: string[];          // sentence-starter prompts for the AGAINST side
}
export interface DialogueRolePlayBlock extends BaseBlock {
  type: 'dialogue_role_play';
  mode: DialogueMode;
  scene_description?: string;
  characters: DialogueCharacter[];  // for debate: typically [{ id: 'for' }, { id: 'against' }]
  lines: DialogueLine[];            // populated when mode === 'dialogue'
  debate_frames?: DebateFrames | null; // populated when mode === 'debate'
}

// E11. PRONUNCIATION DRILL — words where Hindi-English speakers commonly mispronounce.
export interface PronunciationWord {
  id: string;
  word: string;
  syllables?: string;         // "LIT-ruh-cher" — informal respelling with stress in CAPS
  ipa?: string;               // optional formal IPA
  audio_url?: string;         // recorded twice back-to-back for drill repetition
  context_sentence?: string;
  common_mistake?: string;    // one concrete Hindi-English mispronunciation pattern
}
export interface PronunciationDrillBlock extends BaseBlock {
  type: 'pronunciation_drill';
  intro?: string;
  words: PronunciationWord[];  // 4–8 per drill
}

// ─── Union type ───────────────────────────────────────────────────────────────
export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ClassifyExerciseBlock
  | InteractiveImageBlock
  | VideoBlock
  | AudioNoteBlock
  | Molecule2DBlock
  | Molecule3DBlock
  | LatexBlock
  | PracticeLinkBlock
  | CalloutBlock
  | TableBlock
  | TimelineBlock
  | ComparisonCardBlock
  | AnimationBlock
  | InlineQuizBlock
  | WorkedExampleBlock
  | SimulationBlock
  | SectionBlock
  | ReasoningPromptBlock
  | CuriosityPromptBlock
  // ─── English blocks (Class 9 Kaveri) ───
  | NarratedPassageBlock
  | VocabularyLabBlock
  | LiteraryDevicesHighlighterBlock
  | CharacterMapBlock
  | ThemeExplorerBlock
  | ToneMeterBlock
  | CulturalContextCardBlock
  | ComprehensionCheckpointBlock
  | WritingScaffoldBlock
  | DialogueRolePlayBlock
  | PronunciationDrillBlock;


// ─── Page & Book documents ────────────────────────────────────────────────────

export interface BookPage {
  _id: string;
  book_id: string;
  chapter_number: number;
  page_number: number;
  slug: string;          // e.g. "ch1-what-is-living" — URL-safe
  title: string;
  subtitle?: string;
  blocks: ContentBlock[];
  /**
   * Hinglish (Hindi-English mix) parallel explanations for text blocks only.
   * Each entry is a TextBlock whose `id` matches the English TextBlock it replaces.
   * Headings, callouts, images, quizzes etc. are always rendered in English.
   * When this array is empty or absent, the Hinglish toggle is hidden entirely.
   */
  hinglish_blocks?: TextBlock[];
  tags?: string[];       // Links to Crucible taxonomy tags
  created_at: Date;
  updated_at: Date;
  published: boolean;
  reading_time_min?: number;
  /** Deduplicated list of interactive block types on this page (computed on save). */
  content_types?: BlockType[];
  /** Title of the first video block on this page (computed on save). Shown as a preview in page listing cards. */
  video_title?: string | null;
}

export interface BookChapter {
  number: number;
  title: string;
  slug: string;
  page_ids: string[];
  description?: string;
  is_published: boolean;
}

export interface Book {
  _id: string;
  slug: string;          // e.g. "ncert-chemistry-class-11"
  title: string;
  subject: 'chemistry' | 'biology' | 'physics' | 'mathematics' | 'english';
  /**
   * How the renderer behaves when an audio_url is empty on blocks that support audio
   * (narrated_passage, vocabulary_lab, dialogue_role_play, pronunciation_drill).
   * Defaults to 'hide' for English books until first chapter's recording is done.
   * - 'tts'    — fall back to browser SpeechSynthesis (robotic but functional)
   * - 'silent' — show the play button, do nothing on tap (interim hold)
   * - 'hide'   — hide the play button entirely (default for Kaveri pre-recording)
   * See ENGLISH_BOOK_PAGE_WORKFLOW.md §8.4.
   */
  audio_fallback?: 'tts' | 'silent' | 'hide';
  grade: number;         // 6–12
  board: 'ncert' | 'cbse' | 'icse' | 'custom';
  cover_image?: string;  // R2 URL
  chapters: BookChapter[];
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}
