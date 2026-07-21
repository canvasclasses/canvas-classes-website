import type { PageReadinessSummary } from '../books/readiness';

// ─── Block Types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'text'
  | 'heading'
  | 'image'
  | 'gallery'
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
  | 'meet_a_scientist'
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
  | 'pronunciation_drill'
  | 'chapter_practice'
  | 'apply_express'
  | 'reading_comprehension'
  | 'junior_practice'
  | 'practice_bank'
  | 'group_elements'
  // Life Skills blocks (Class 9 & 10 strand)
  | 'guided_practice'
  | 'reflection_journal'
  | 'habit_tracker'
  | 'focus_game'
  | 'attention_xray'
  | 'self_experiment'
  | 'guided_reveal'
  // Social Science engagement-plan blocks (2026-07-08) — see
  // _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md "Engagement retrofit" section.
  | 'perspective_scenario'
  | 'career_spotlight'
  // "You Solve It" — real, unsolved Indian problem the student must reason a
  // solution to (2026-07-10, founder design). See YouSolveItBlock below.
  | 'you_solve_it';

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
  objective?: string; // §15.2 — one-line outcome / driving question under a section heading
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
  // ── Figure numbering (§16) ──
  decorative?: boolean;     // hero/atmosphere image — NOT a numbered figure
  figure_key?: string;      // stable slug for cross-referencing, e.g. "atoms-diagram"
  figure_number?: string;   // assigned by the finaliser, e.g. "1.3" (renderer shows "Fig. 1.3")
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
  // AI generation spec for the base diagram, shown as a copyable placeholder
  // while src is empty (BOOK_PAGE_WORKFLOW §3.13). Preserved on save.
  generation_prompt?: string;
  // Block-level width preset — same options/meaning as ImageBlock['width'].
  // Optional; renderer defaults to 'full'. A tall/portrait diagram is
  // additionally height-capped by the renderer regardless of this setting.
  width?: 'full' | 'five_sixth' | 'three_quarter' | 'two_third' | 'half' | 'two_fifth' | 'third' | 'quarter';
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
  figure_key?: string;      // §16 — Equation series, opt-in (renderer shows "Eq. 1.5")
  figure_number?: string;
  /**
   * Renders inside a boxed, tinted card so a key definitional formula stands
   * out from surrounding prose (e.g. "% by mole of element = ..."). Use for
   * the one formula per concept worth anchoring visually — not every
   * intermediate calculation step, which would clutter the page.
   */
  highlight?: boolean;
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
  | 'india_voice' | 'literature_in_life'
  // "One Page from My Bookshelf" — a gem from another book the teacher has been
  // reading, paired thematically with the chapter. Authored from the curated
  // bank at ~/brain/wisdom_seeds/. Markdown convention (rendered by the dedicated
  // sub-renderer):
  //   - title: book title + author (e.g. "Gitanjali — Rabindranath Tagore (1910)")
  //   - paragraph(s): the teacher's framing in their voice ("I was reading…")
  //   - "> the borrowed line": rendered as a large pulled-out italic quote
  //   - "*— attribution*": rendered as a small italic attribution row
  //   - "?? a reflection prompt": rendered as a soft prompt at the bottom
  | 'voices_that_inspire'
  // "Real-World Application" — the "Connect" family enrichment card. A boxed,
  // elegant section for where a concept shows up in real life / industry, or
  // beyond-the-core depth. Distinct from the borderless "Did You Know" hook.
  | 'real_world';
export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  variant: CalloutVariant;
  title?: string;
  markdown: string;
  markdown_hinglish?: string; // Hinglish twin shown in HI mode (e.g. literature_in_life)
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
  figure_key?: string;      // §16 — Table series (renderer shows "Table 1.2")
  figure_number?: string;
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
  // Bloom tier: 1=recall, 2=comprehension, 3=interpretation. Drives the L1→L2→L3
  // ladder and the no-length-tell guard on the quiz bank.
  difficulty_level?: 1 | 2 | 3;
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
  // Shown below the sim after they've interacted — explains what actually happens.
  // Optional: a prediction may pose the guess without a canned reveal (the renderer
  // hides the reveal section when this is absent).
  reveal_after?: string;
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
  english?: string;             // Hindi track only — English meaning (the "scaffold flip" anchor)
  example: string;              // one short sentence using the word in everyday context
  memory_hook?: string;         // sound-alike, vivid image, or mnemonic — optional
}
export interface VocabularyLabBlock extends BaseBlock {
  type: 'vocabulary_lab';
  mode: VocabularyLabMode;
  lang?: 'english' | 'hindi';   // default 'english'. 'hindi' swaps card-back labels + uses hi-IN TTS.
  intro?: string;
  cards: VocabCard[];
  self_check?: InlineQuizQuestion[];  // optional 1–3 question mini-check; reuses inline-quiz shape
}

// E3. LITERARY DEVICES HIGHLIGHTER — passage with togglable highlighting per device.
//     The English analogue of a "simulator": abstraction made visible.
export type LiteraryDevice =
  | 'simile' | 'metaphor' | 'personification' | 'imagery'
  | 'alliteration' | 'rhyme' | 'symbolism' | 'hyperbole' | 'onomatopoeia'
  // Hindi track — गद्य narrative features (NCERT गंगा "कहानी का सौंदर्य")
  | 'vyangya' | 'virodhabhas' | 'samvadatmakta' | 'sandeh'
  // Hindi काव्य — पदावृत्ति (word/foot repetition) + refrain (a repeated line/chorus, टेक)
  | 'padavritti' | 'refrain';
export interface DeviceMatch {
  text: string;          // exact substring of the passage that demonstrates this device
  explanation: string;   // 1–2 sentences: what device, what reading it unlocks
  explanation_hinglish?: string; // Hinglish twin shown in HI mode
}
export interface DeviceHighlight {
  id: string;
  device: LiteraryDevice;
  matches: DeviceMatch[];
}
export interface LiteraryDevicesHighlighterBlock extends BaseBlock {
  type: 'literary_devices_highlighter';
  lang?: 'english' | 'hindi';  // default 'english'. 'hindi' renders Devanagari device labels (अलंकार / गद्य features).
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
  description_hinglish?: string;        // Hinglish twin shown in HI mode
  evidence: string[];        // 1–3 short verbatim quotes from the chapter
  reflection_prompt: string; // points outward, genuinely open
  reflection_prompt_hinglish?: string;  // Hinglish twin shown in HI mode
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
  note_hinglish?: string; // Hinglish twin shown in HI mode
}
export interface ToneMeterBlock extends BaseBlock {
  type: 'tone_meter';
  segments: ToneSegment[];  // 4–8 segments per chapter
}

// E7. CULTURAL CONTEXT CARD — standalone reference card for a place/person/concept
//     the non-native reader may not recognise.
export type CulturalContextCategory = 'place' | 'person' | 'event' | 'concept' | 'tradition' | 'history';
export interface CulturalContextCardBlock extends BaseBlock {
  type: 'cultural_context_card';
  reference: string;     // "Kashi" | "Triveni" | "Lord Vishweshwara"
  category: CulturalContextCategory;
  short_desc: string;    // one-line headline
  detail: string;        // 2–4 sentences in markdown
  detail_hinglish?: string; // Hinglish twin shown in HI mode
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
  questions: ComprehensionQuestion[];   // typically 1–3, up to 10
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

// E12. CHAPTER PRACTICE — adaptive, exam-like end-of-chapter practice.
//      Unlike inline_quiz (a fixed 3-question page closure), this is a graded
//      bank the reader works through; the selector (packages/data/books/
//      practiceSelector.ts) sequences questions by difficulty + concept using
//      the student's cumulative attempt history. Persists to BookPracticeAttempt.
export type PracticeConceptTag =
  // English (Kaveri)
  | 'comprehension'
  | 'vocab_in_context'
  | 'grammar'
  | 'interpretation'
  | 'inference'
  // Science / Math — added 2026-06-06 for the science chapter-end practice bank.
  // The adaptive selector groups by concept_tag as an opaque string, so these
  // extra values need no selector changes; they are never rendered as a label.
  | 'concept'        // conceptual understanding of a definition / law / principle
  | 'application'    // apply a concept to a new everyday scenario (no arithmetic)
  | 'numerical'      // calculation: plug into a formula, read a graph, compute
  | 'reasoning'      // analyse / predict / evaluate a claim or a multi-step situation
  | 'recall';        // a specific fact, value, name, or statement from the chapter
export interface PracticeQuestion {
  id: string;                  // stable within the book, e.g. 'ch1-pr-01'
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
  concept_tag: PracticeConceptTag;
  difficulty: 1 | 2 | 3 | 4 | 5;
}
export interface ChapterPracticeBlock extends BaseBlock {
  type: 'chapter_practice';
  title?: string;
  intro?: string;
  chapter_number: number;      // for attribution + cumulative-history scoping
  session_size?: number;       // questions served per session (default 8)
  pass_threshold?: number;     // 0–1, default 0.7
  questions: PracticeQuestion[];
}

// JUNIOR PRACTICE — bank-backed chapter practice for grades 6–10. Unlike
// `chapter_practice` (English; questions embedded in the block), this block
// embeds NO questions — the renderer fetches them from the junior_questions
// bank by book_slug + chapter_number at runtime. Authoring happens in the
// admin Junior Question Bank panel, not in the book editor.
export interface JuniorPracticeBlock extends BaseBlock {
  type: 'junior_practice';
  title?: string;
  intro?: string;
  book_slug: string;           // bank source (usually the page's own book)
  chapter_number: number;      // which chapter's questions to serve
  session_size?: number;       // default 10
  pass_threshold?: number;     // 0–1, default 0.7
  mode?: 'practice' | 'test';  // 'test' = timed, no per-question feedback
}

// PRACTICE BANK — the section-navigated, source-tagged end-of-chapter bank
// (founder design 2026-06-25). A single end-of-chapter block holding 4–5
// SUB-TOPIC sections; each section mixes NCERT exercises, CBSE PYQs and MCQs,
// every item carrying a source tag. The renderer is a two-pane UI: a section
// list on the left, the chosen section's bank on the right. Two item kinds:
// MCQ (gradable — pick → check → explanation) and numerical (tap-to-reveal
// worked solution). NCERT portion is frozen once added; the PYQ/MCQ portion is
// refreshed yearly. See _agents/plans/CHEMICAL_EQUILIBRIUM_BUILD.md.
export type PracticeSource = 'ncert_exercise' | 'ncert_exemplar' | 'cbse_pyq' | 'jee_neet' | 'mcq';

interface PracticeBankItemBase {
  id: string;                  // stable, e.g. 'ceq-pr-lechat-01'
  source: PracticeSource;
  source_label?: string;       // shown on the badge, e.g. 'NCERT 7.25', 'CBSE 2023', 'JEE Main 2024'
  prompt: string;              // markdown + LaTeX
}
export interface PracticeBankMCQ extends PracticeBankItemBase {
  kind: 'mcq';
  options: string[];
  correct_index: number;
  explanation: string;
}
export interface PracticeBankNumerical extends PracticeBankItemBase {
  kind: 'numerical';           // free-response / numerical — tap-to-reveal solution
  answer?: string;             // short final answer
  solution: string;            // full worked solution (markdown + LaTeX)
}
export type PracticeBankItem = PracticeBankMCQ | PracticeBankNumerical;

export interface PracticeBankSection {
  id: string;
  title: string;               // sub-topic, e.g. 'Le Chatelier & Factors'
  blurb?: string;              // optional one-liner under the section title
  items: PracticeBankItem[];
}
export interface PracticeBankBlock extends BaseBlock {
  type: 'practice_bank';
  title?: string;
  intro?: string;
  sections: PracticeBankSection[];
}

// GROUP ELEMENTS — a row of element buttons (looked up by symbol in the shared
// 118-element table at @canvas/data/periodic/elementsData) that each expand into
// a rich ElementDetailCard. Authored in-script: list the group's members by
// symbol, e.g. the nitrogen group ['N','P','As','Sb','Bi']. Built for the
// Class 12 p-Block chapters.
export interface GroupElementsBlock extends BaseBlock {
  type: 'group_elements';
  title?: string;
  intro?: string;
  element_symbols: string[]; // e.g. ['N','P','As','Sb','Bi']
}

// E13. APPLY & EXPRESS — the *productive* tier. Where `chapter_practice` (MCQ)
//      tests recognition, this tier makes students PRODUCE language — NCERT's
//      actual emphasis (CG-1 communication, CG-3 employ-in-writing): fill the
//      blank, predict the next word, build a word from affixes, compose your
//      own sentence, unscramble a line. Gamified (XP / streak / stars). Each
//      challenge is auto-checkable (sentence_compose uses a deterministic gate
//      + rubric self-check). Attempts persist to BookPracticeAttempt like MCQs.
export type ApplyExpressKind =
  | 'fill_blank'        // type the missing word(s); supports past-perfect drills
  | 'predict_word'      // guess the next word of a real line from the text
  | 'word_builder'      // pick the affix tile that forms the target word
  | 'sentence_compose'  // write your own sentence using a target word/phrase
  | 'unscramble'        // reorder shuffled tokens into the correct sentence
  | 'word_match'        // match each word/phrase to its meaning (tap a word, then its meaning)
  // ─── Grammar Gym kinds (used by apply_express with variant:'grammar') ───
  | 'transform'         // rewrite a whole sentence (direct→reported, active↔passive, tense shift)
  | 'spot_error'        // tap the wrong word in a sentence, then fix it
  | 'form_select';      // choose the correct grammatical form, each option carries reasoning

interface ApplyChallengeBase {
  id: string;
  kind: ApplyExpressKind;
  concept_tag: PracticeConceptTag;
  difficulty: 1 | 2 | 3 | 4 | 5;
  explanation?: string;
}
export interface FillBlankChallenge extends ApplyChallengeBase {
  kind: 'fill_blank';
  prompt: string;         // blanks marked with '____' (4+ underscores), in order
  answers: string[][];    // accepted answers per blank, positional
  choices?: string[];     // optional word-bank for a SINGLE-blank fill: when present
                          // the reader taps a chip instead of typing. Removes the
                          // whole class of spelling/typo false-negatives and is
                          // far friendlier on phones. Ignored for multi-blank fills.
  hint?: string;
}
export interface PredictWordChallenge extends ApplyChallengeBase {
  kind: 'predict_word';
  lead: string;           // the line up to the missing final word
  answers: string[];      // accepted next word(s)
  full_line?: string;     // the complete line, revealed after answering
}
export interface WordBuilderChallenge extends ApplyChallengeBase {
  kind: 'word_builder';
  base: string;           // e.g. 'respect'
  affixes: string[];      // tiles to choose from, e.g. ['un','dis','mis','im']
  correct: string;        // the affix that fits, e.g. 'dis'
  target: string;         // the formed word, e.g. 'disrespect'
  position?: 'prefix' | 'suffix';   // default 'prefix'
  meaning_hint?: string;
}
export interface SentenceComposeChallenge extends ApplyChallengeBase {
  kind: 'sentence_compose';
  word: string;           // the word/phrase to use, e.g. 'part and parcel'
  instruction: string;
  rubric: string[];       // self-check items shown with the model answer
  model_answer: string;
  min_words?: number;     // default 6
}
export interface UnscrambleChallenge extends ApplyChallengeBase {
  kind: 'unscramble';
  tokens: string[];       // shuffled words
  answer: string;         // the correct sentence
}
export interface WordMatchChallenge extends ApplyChallengeBase {
  kind: 'word_match';
  instruction?: string;
  // Each pair: left = the word/phrase, right = its meaning. The reader taps a
  // word, then the meaning they think it goes with. Scored correct only when
  // every word is paired with its OWN meaning. Authored in order; the meanings
  // are shuffled deterministically at render time so the layout isn't a giveaway.
  pairs: { left: string; right: string }[];
}
// ─── Grammar Gym challenges ────────────────────────────────────────────────
// Purpose-built for grammar competency: rewrite a sentence, hunt a mistake,
// or choose the correct form with reasoning. Rendered by ApplyExpressRenderer
// inside an apply_express block whose `variant` is 'grammar'.
export interface TransformChallenge extends ApplyChallengeBase {
  kind: 'transform';
  source: string;         // the sentence to rewrite, e.g. He said, "I am tired."
  instruction: string;    // e.g. 'Rewrite as reported speech'
  answers: string[];      // accepted rewrites (forgiving match); first is the model
  hint?: string;
  rule?: string;          // the grammar rule revealed after answering
}
export interface SpotErrorChallenge extends ApplyChallengeBase {
  kind: 'spot_error';
  tokens: string[];       // the sentence split into tappable words
  error_index: number;    // index of the wrong word in tokens
  fix: string;            // the correct replacement word/phrase
  fix_options?: string[]; // optional multiple-choice fixes (includes `fix`)
  rule?: string;          // why it was wrong, revealed after answering
}
export interface FormSelectChallenge extends ApplyChallengeBase {
  kind: 'form_select';
  prompt: string;         // sentence with a gap marked '____'
  options: string[];      // candidate forms, e.g. ['could','should','must']
  correct_index: number;
  option_reasons?: string[]; // per-option reasoning, shown on reveal
}
export type ApplyChallenge =
  | FillBlankChallenge
  | PredictWordChallenge
  | WordBuilderChallenge
  | SentenceComposeChallenge
  | UnscrambleChallenge
  | WordMatchChallenge
  | TransformChallenge
  | SpotErrorChallenge
  | FormSelectChallenge;

export interface ApplyExpressBlock extends BaseBlock {
  type: 'apply_express';
  title?: string;
  intro?: string;
  chapter_number: number;
  variant?: 'apply' | 'grammar';  // 'grammar' re-skins the block as a Grammar Gym
  challenges: ApplyChallenge[];
}

// E14. READING COMPREHENSION — the CBSE "Reading Skills" pillar (unseen passages).
//      A passage (discursive / factual / case-based / literary) followed by a mix
//      of question kinds. Checks BASIC understanding of the passage (competitive-
//      level items live in Crucible, not here). Friendly North-Indian-classroom
//      teacher voice in `intro` and `explanation`s. See ENGLISH_BOOK_PAGE_WORKFLOW §10.
export type ReadingPassageType = 'discursive' | 'factual' | 'case_based' | 'literary' | 'descriptive';
export interface ReadingMCQ {
  kind: 'mcq';
  id: string;
  question: string;
  options: string[];          // 4 options
  correct_index: number;      // 0-3
  explanation?: string;       // teacher-voice "why"
}
export interface ReadingAssertionReason {
  kind: 'assertion_reason';
  id: string;
  assertion: string;          // "Assertion (A): ..."
  reason: string;             // "Reason (R): ..."
  correct_index: number;      // 0-3 against the 4 standard A-R options (rendered by the component)
  explanation?: string;
}
export interface ReadingShortAnswer {
  kind: 'short_answer';
  id: string;
  question: string;
  model_answer: string;       // revealed for self-check; not auto-graded
  hint?: string;
}
export type ReadingQuestion = ReadingMCQ | ReadingAssertionReason | ReadingShortAnswer;
export interface ReadingComprehensionBlock extends BaseBlock {
  type: 'reading_comprehension';
  passage_type: ReadingPassageType;
  lang?: 'english' | 'hindi';  // 'hindi' localises the passage-type badge + the 4 assertion-reason option labels; default 'english' (Kaveri unaffected)
  title?: string;
  intro?: string;             // teacher-voice setup before the passage
  passage: string;            // markdown; paragraphs separated by a blank line
  numbered?: boolean;         // number the paragraphs (CBSE convention) — default false
  word_count?: number;        // shown as a badge; discursive 400-450, case-based 200-250
  source_note?: string;       // optional "(adapted from …)"
  questions: ReadingQuestion[];
}

/**
 * Meet a Scientist / Meet the Author — a biographical card placed inline on a
 * page (science, math, and English-author pages all use it). Authored by the
 * book-build scripts; read-only in the admin editor. The four long fields are
 * markdown. `portrait_src` is the R2 image URL (may be empty until the portrait
 * is generated); `portrait_prompt` is the image-generation prompt and must be
 * preserved through save so the portrait can be produced later.
 */
export interface MeetAScientistBlock extends BaseBlock {
  type: 'meet_a_scientist';
  name: string;
  years: string;              // e.g. "1893–1956" or "1950–present"
  nationality: string;
  portrait_src?: string;      // R2 URL; empty until the portrait is generated
  portrait_prompt?: string;   // image-gen prompt — kept so the portrait can be made later
  contribution: string;       // markdown
  connection: string;         // markdown — ties the figure to this chapter
  fun_detail: string;         // markdown
  learn_more: string;         // markdown
}

// ─── Union type ───────────────────────────────────────────────────────────────
// GALLERY — 2–6 images for ONE concept, shown as a swipeable carousel (§15.6)
// instead of a vertical stack. Each item is tap-to-zoom in the reader.
export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}
export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  items: GalleryItem[];
  aspect_ratio?: '16:9' | '16:5' | '4:3' | '3:2' | '1:1' | '21:9';
  // Overall carousel size as a fraction of the column — same presets/meaning as
  // ImageBlock['width'] (100/83/75/67/50/40/33/25%). Absent → full width.
  width?: 'full' | 'five_sixth' | 'three_quarter' | 'two_third' | 'half' | 'two_fifth' | 'third' | 'quarter';
  figure_key?: string;      // §16 — a gallery is one numbered figure (panels a/b/c)
  figure_number?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIFE SKILLS BLOCKS — Class 9 & 10 Life Skills strand
// Spec: _agents/workflows/LIFE_SKILLS_WORKFLOW.md §5
// Renderers: packages/book-renderer/blocks/lifeskills/*
// Persistence: per-device localStorage (`canvas_practice:<block.id>`) for the
// pilot — server-side sync is a deliberate follow-up, not an oversight.
// ═══════════════════════════════════════════════════════════════════════════════

// LS1. GUIDED PRACTICE — timed, step-sequenced exercise (breathing pacer, focus
//      sprint, observation drill). The "do it now" block — the strand's core mechanic.
export interface GuidedPracticeStep {
  id: string;
  instruction: string;    // "Sit up straight. Let your shoulders drop."
  duration_sec?: number;  // timed steps auto-advance; untimed steps wait for a tap
}
export interface BreathPattern {
  inhale_sec: number;
  hold_sec?: number;      // hold after the inhale
  exhale_sec: number;
  hold_out_sec?: number;  // hold after the exhale
  cycles: number;
}
export interface GuidedPracticeBlock extends BaseBlock {
  type: 'guided_practice';
  practice_kind: 'breathing' | 'focus_timer' | 'meditation' | 'observation' | 'custom';
  title: string;                  // "The 2-Minute Breathing Reset"
  intro?: string;                 // one line on why this practice matters
  steps: GuidedPracticeStep[];    // with breath_pattern set, steps are pre-practice setup notes
  breath_pattern?: BreathPattern; // breathing kind only — drives the visual pacer
  audio_url?: string;             // optional guided audio track (R2)
  completion_note?: string;       // teacher-voice line shown when finished
}

// LS2. REFLECTION JOURNAL — private free-writing box, saved on-device only.
export interface ReflectionJournalBlock extends BaseBlock {
  type: 'reflection_journal';
  prompt: string;
  placeholder?: string;
  min_words?: number;   // gentle nudge shown under the box; never blocks saving
}

// LS3. HABIT TRACKER — N-day challenge with one check-in per calendar day.
export interface HabitTrackerBlock extends BaseBlock {
  type: 'habit_tracker';
  title: string;          // "7-Day Focus Challenge"
  habit: string;          // the daily action, stated concretely
  duration_days: number;  // 1–60
  why?: string;           // one line on what this builds
  day_labels?: string[];  // optional per-day task variation; length = duration_days
}

// LS4. FOCUS GAME — "The Steady Flame": a gradCPT/SART-style sustained-attention
// meter. Lanterns fade in and out on a steady cadence; tap every lit one but let
// the rare unlit one pass. Scored primarily on the STEADINESS of tap timing
// (response-time variability — the most validated behavioural marker of attention
// lapses), plus lapses caught/missed. It is a MEASURING instrument + one honest
// rep of the notice-and-return skill — NOT a standalone "focus trainer" (there is
// no evidence such games transfer to real-world focus; the chapter's daily
// practice does that). Scored per-device under `test_id` so a baseline run (p1)
// and a retest run (p10) can be compared. Renderer: blocks/lifeskills/FocusGameRenderer.
export interface FocusGameBlock extends BaseBlock {
  type: 'focus_game';
  test_id: string;                              // shared key linking baseline + retest
  role: 'baseline' | 'retest' | 'standalone';
  title: string;
  intro?: string;
  duration_sec?: number;                        // total run length; default 120
  completion_note?: string;
}

// LS5. ATTENTION X-RAY — "The Notification Autopsy": an interactive reveal of how
// every innocent-looking part of a phone screen (the red badge, "tagged you", the
// timing, the streak, infinite scroll, autoplay) is a deliberate, tested design
// choice built to keep you scrolling. The student taps each card to flip it and
// see the hidden intent; a closing panel unlocks the business-model reveal (your
// attention is the product) landing on agency, not fear. Content-driven so the
// copy lives in the DB, not the renderer. Renderer: blocks/lifeskills/AttentionXrayRenderer.
export interface AttentionXrayCard {
  id: string;
  label: string;      // the innocent thing they see, e.g. "The little red dot"
  front: string;      // short glyph/text shown on the un-flipped card, e.g. "🔴 3"
  reveal: string;     // the hidden design intent (markdown), shown on flip
}
export interface AttentionXrayBlock extends BaseBlock {
  type: 'attention_xray';
  title: string;
  intro?: string;
  cards: AttentionXrayCard[];
  closing: string;        // business-model reveal (markdown), unlocks after cards flipped
  watch_note?: string;    // optional "watch The Social Dilemma" pointer (markdown)
}

// LS6. SELF EXPERIMENT — "do this small experiment, then tick what you noticed,
// then learn what each thing means." A student runs a short real-world experiment
// (e.g. 5 minutes without reaching for the phone), multi-selects which urges/
// sensations showed up from a fixed option list, and each selected option reveals
// a tailored plain-English explanation. Reusable across the strand (focus, stress,
// health). Selections persist per-device. Renderer: blocks/lifeskills/SelfExperimentRenderer.
export interface SelfExperimentOption {
  id: string;
  label: string;        // "A sudden itch to 'just check' something"
  explanation: string;  // what that signal means (markdown), revealed when selected
}
export interface SelfExperimentBlock extends BaseBlock {
  type: 'self_experiment';
  title: string;
  intro: string;             // sets up the experiment (markdown)
  steps?: string[];          // optional concrete setup steps
  duration_sec?: number;     // optional countdown timer for the experiment
  prompt: string;            // "Which of these showed up? Tick all that did."
  options: SelfExperimentOption[];
  min_select?: number;       // gentle nudge only; never blocks
  completion_note?: string;  // teacher-voice close (markdown)
}

// LS7. GUIDED REVEAL — a paced, click-to-advance "slide deck" walkthrough that
// takes the student through an argument ONE beat at a time (build-up: past beats
// settle into a dimmed trail, the current beat is the bright focus). Advance by
// click or keyboard (→/Space next, ← back). Content-driven and reusable platform-
// wide. Most beats are 'point' (kicker + headline + body + optional image); one
// special 'cost_checker' beat is a tiny interactive verdict tool (e.g. "will your
// study playlist cost you?" — pick task × audio → green/amber/red verdict).
// Renderer: blocks/lifeskills/GuidedRevealRenderer.
export interface GuidedRevealCheckerOption {
  id: string;
  label: string;
  weight: 0 | 1 | 2;   // interference weight: 0 none · 1 low · 2 high
}
export interface GuidedRevealChecker {
  task_label: string;                    // "What are you studying?"
  tasks: GuidedRevealCheckerOption[];    // weight = verbal/language load
  audio_label: string;                   // "What's playing?"
  audios: GuidedRevealCheckerOption[];   // weight = lyric clash
  // Verdict copy per tier (markdown); tier = task.weight × audio.weight
  // (>=4 high, >=2 mild, else clear).
  verdicts: { high: string; mild: string; clear: string };
}
export interface GuidedRevealStep {
  id: string;
  kind: 'point' | 'cost_checker';
  kicker?: string;         // small label above the headline, e.g. "The catch"
  headline: string;
  body?: string;           // markdown
  image_src?: string;      // optional visual
  checker?: GuidedRevealChecker;  // required when kind === 'cost_checker'
}
export interface GuidedRevealBlock extends BaseBlock {
  type: 'guided_reveal';
  title: string;
  intro?: string;          // one line before the first beat
  steps: GuidedRevealStep[];
  outro?: string;          // shown after the last beat (markdown)
}

// PERSPECTIVE SCENARIO — Social Science engagement mechanic (2026-07-08, founder
// design). A real, documented Indian case (a genuine institutional/expert debate,
// not an invented hypothetical) presented as a decision the student must make.
// Every option represents an ACTUAL real-world position (a named committee/report/
// stakeholder group), not a right/wrong choice. Picking one reveals that
// position's real reasoning and tradeoff; the other options then unlock too, so
// the student sees all real perspectives regardless of which they picked. Closes
// on a synthesis note — explicitly NOT a verdict. See
// _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md "Engagement retrofit" section for
// the design rationale and the founder conversation that shaped this.
export interface PerspectiveScenarioOption {
  id: string;
  label: string;          // "Go with the Gadgil approach — protect nearly the whole range"
  real_position: string;  // "The Western Ghats Ecology Expert Panel's actual 2011 recommendation"
  perspective: string;    // that position's real reasoning + its real tradeoff (markdown)
}
export interface PerspectiveScenarioBlock extends BaseBlock {
  type: 'perspective_scenario';
  title: string;
  role_frame: string;       // "You're advising..." — puts the student in a real decision seat
  event_context: string;    // the real documented background (markdown), with dates/institutions named
  // Infographic (2026-07-08, founder request): offloads comparative/timeline
  // facts (who proposed what, when) to a visual so event_context can stay short.
  // Empty src + image_prompt set = placeholder state, same convention as ImageBlock.
  image_src?: string;
  image_prompt?: string;
  image_caption?: string;
  source_note: string;      // explicit citation of the real report(s)/case this is grounded in
  prompt: string;           // the decision question
  options: PerspectiveScenarioOption[];  // 2-4 real documented positions
  synthesis: string;        // closing note (markdown) — ties perspectives together, not a verdict
}

// CAREER SPOTLIGHT — Social Science engagement mechanic (2026-07-08, founder
// design). Was originally a `callout` variant rendering one dense paragraph;
// promoted to its own block after founder feedback that a wall of text buries
// the actual list of professions — this renders each role as its own scannable
// row instead. See _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md "Engagement
// retrofit" section.
export interface CareerRole {
  id: string;
  role: string;         // "Geographers & GIS analysts" — bolded, the scannable anchor
  description: string;  // what they actually do, tied back to the chapter's content
}
export interface CareerSpotlightBlock extends BaseBlock {
  type: 'career_spotlight';
  title: string;
  intro?: string;        // one line before the list, e.g. "Every discipline here has a real job built on it."
  careers: CareerRole[]; // 2-6 roles
  closing?: string;      // one line after the list, e.g. "None of these are historical curiosities."
}

// "YOU SOLVE IT" — Social Science problem-solving mechanic (2026-07-10, founder
// design). Distinct from perspective_scenario: where that block is about
// APPRECIATING why stakeholders disagree (and never asks the student to pick a
// solution), this one drops the student inside a real, unsolved Indian problem
// (e.g. the Kosi/Bihar floods), lays out the ACTUAL solutions being debated —
// each with its genuine upside AND its genuine catch — and asks them to commit
// to one and defend it, naming the biggest weakness of their own choice. The
// close is a reality-check ("where the debate actually stands"), grounded in
// real reports/experts and explicitly NOT "the one correct answer" — because the
// country itself hasn't settled it. Every instance must be web-verified against
// real documented sources before authoring (source_note always visible). One
// flagship per chapter. See _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md.
export interface YouSolveItSolution {
  id: string;
  label: string;     // the proposal, e.g. "Build a giant high dam in Nepal"
  upside: string;    // its real benefit (markdown)
  tradeoff: string;  // its real catch/cost (markdown)
}
export interface YouSolveItBlock extends BaseBlock {
  type: 'you_solve_it';
  title: string;
  problem: string;      // The Problem — real, named, current, with a human stake (markdown)
  why_hard: string;     // Why it's stubborn — the twist that keeps it unsolved (markdown)
  // Optional infographic — same empty-src placeholder convention as ImageBlock.
  image_src?: string;
  image_prompt?: string;
  image_caption?: string;
  source_note: string;  // explicit citation of the real report(s)/case this is grounded in
  solutions: YouSolveItSolution[]; // 2-4 real proposals actually on the table
  prompt: string;       // the decision question (asks student to commit + name their pick's weakness)
  reality_check: string; // "Where the debate actually stands" — grounding reveal, NOT a verdict (markdown)
}

export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | GalleryBlock
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
  | MeetAScientistBlock
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
  | PronunciationDrillBlock
  | ChapterPracticeBlock
  | ApplyExpressBlock
  | ReadingComprehensionBlock
  | JuniorPracticeBlock
  | PracticeBankBlock
  | GroupElementsBlock
  // ─── Life Skills blocks (Class 9 & 10 strand) ───
  | GuidedPracticeBlock
  | ReflectionJournalBlock
  | HabitTrackerBlock
  | FocusGameBlock
  | AttentionXrayBlock
  | SelfExperimentBlock
  | GuidedRevealBlock
  | PerspectiveScenarioBlock
  | CareerSpotlightBlock
  | YouSolveItBlock;


// ─── Page & Book documents ────────────────────────────────────────────────────

/** One technical term this page introduces, plus its plain-English definition. */
export interface GlossaryEntry {
  /** The term as it appears in the prose, e.g. "sporopollenin". Matched case-insensitively. */
  term: string;
  /** 1–2 plain sentences. Shown in the hover/tap popover. */
  definition: string;
}

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
  /**
   * Per-page glossary of the technical terms this page introduces. Authored by
   * the book page-module contracts (see the PAGE_MODULE_CONTRACT.md files under
   * `scripts/bio-book/` and `scripts/bio-book12/`).
   *
   * Consumed by the reader as **hover/tap definitions**: PageRenderer injects this
   * into `GlossaryProvider`, and TextBlockRenderer underlines the first occurrence
   * of each term in the prose and shows its definition in a popover. A
   * terminology-dense subject read by second-language students gets a
   * zero-navigation-cost lookup — comprehension, accessibility and localisation
   * in one feature.
   *
   * NOTE (2026-07-16): this field existed on ~1,754 authored entries across the two
   * Biology books for months while being absent from this type AND from the Zod
   * schema, so nothing rendered it and nothing flagged it. If you add a page-level
   * field, add it here too, or it silently becomes dead data.
   */
  glossary?: GlossaryEntry[];
  tags?: string[];       // Links to Crucible taxonomy tags
  created_at: Date;
  updated_at: Date;
  published: boolean;
  reading_time_min?: number;
  /**
   * Count of `worked_example` blocks on this page (computed on save, recurses
   * into section columns). Lets the reader compute chapter-continuous
   * "Solved Example N" numbering by summing preceding pages' counts without
   * loading every page's blocks. Maintained by scripts/lib/book-writer.js.
   */
  worked_example_count?: number;
  /** Deduplicated list of interactive block types on this page (computed on save). */
  content_types?: BlockType[];
  /** Title of the first video block on this page (computed on save). Shown as a preview in page listing cards. */
  video_title?: string | null;
  /**
   * NCF-SE 2023 competency this page builds — makes the curriculum claim
   * verifiable and queryable for progress analytics. Surfaced as a small chip
   * in the reader header. Set per page from the Kaveri section taxonomy.
   */
  competency?: { code: string; label: string };
  /**
   * Special page kinds. Absent / 'lesson' = a normal content page. A
   * 'chapter_opener' (§15.1) renders the bespoke full-bleed cover + auto journey
   * map instead of the normal block flow; it is not quiz-gated and is excluded
   * from chapter progress counts.
   */
  page_type?: 'lesson' | 'chapter_opener';
  /**
   * §16 — chapter-wide figure/table reference map (`figure_key` → rendered label
   * like "Fig. 1.3"), written onto every page in a chapter by the numbering
   * finaliser. The renderer uses it to resolve in-text `{fig:key}` tokens.
   */
  figure_refs?: Record<string, string>;
  /**
   * Automated readiness summary (computed on every save + by the recompute
   * backfill; see `packages/data/books/readiness.ts`). Powers the Book Readiness
   * dashboard so it reads pre-computed summaries instead of re-scanning blocks.
   * Stored as the `PageReadinessSummary` shape.
   */
  readiness?: PageReadinessSummary;
  /**
   * Human sign-off, separate from the automated checks above. A super-admin
   * toggles `reviewed` from the readiness dashboard once they have personally
   * validated the page; it feeds the page's readiness stage.
   */
  review?: { reviewed: boolean; reviewed_by?: string | null; reviewed_at?: Date | null };
  /**
   * Soft-delete (content protection, CLAUDE.md §0.6). A page is NEVER hard-deleted;
   * "delete" sets `deleted_at`. Reads exclude `deleted_at != null` via model
   * middleware. Restore by clearing these (see scripts/lib/book-writer.js).
   */
  deleted_at?: Date | null;
  deleted_by?: string | null;
  deletion_reason?: string | null;
}

/** One lesson page in the chapter-opener journey map (§15.1, auto-derived). */
export interface ChapterJourneyEntry {
  slug: string;
  title: string;
  subtitle?: string;
  sims: number;            // count of `simulation` blocks
  workedExamples: number;  // count of `worked_example` blocks
  checks: number;          // inline_quiz + reasoning_prompt + chapter_practice + apply_express
  readingTimeMin: number;
}

/** The full auto-derived journey passed to the chapter-opener page. */
export interface ChapterJourney {
  entries: ChapterJourneyEntry[];
  totals: { pages: number; sims: number; workedExamples: number; checks: number; readingTimeMin: number };
  firstPageSlug: string | null;
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
  subject: 'chemistry' | 'biology' | 'physics' | 'mathematics' | 'science' | 'social_science' | 'english' | 'ict' | 'hindi' | 'life_skills';
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
  /** Soft-delete (content protection, CLAUDE.md §0.6). Books are never hard-deleted. */
  deleted_at?: Date | null;
  deleted_by?: string | null;
  deletion_reason?: string | null;
}
