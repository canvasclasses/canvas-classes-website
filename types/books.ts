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
  | 'curiosity_prompt';

export interface BaseBlock {
  id: string;        // crypto.randomUUID() — stable, used for drag-drop keys
  type: BlockType;
  order: number;     // 0-indexed position on page
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
  width?: 'full' | 'half' | 'third';
  align?: 'center' | 'left' | 'right';   // horizontal placement — default 'center'
  side_text?: string;                    // markdown shown beside image when align ≠ 'center'
  generation_prompt?: string;  // AI image generation prompt — shown as placeholder until src is filled
  // Optional display crop. undefined = natural proportions (no crop, full height).
  // When set, the container is locked to that ratio and the image covers it (object-cover).
  aspect_ratio?: '16:9' | '4:3' | '3:2' | '1:1' | '21:9';
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
export type CalloutVariant = 'remember' | 'note' | 'warning' | 'exam_tip' | 'fun_fact';
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
  | CuriosityPromptBlock;


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
  subject: 'chemistry' | 'biology' | 'physics' | 'mathematics';
  grade: number;         // 6–12
  board: 'ncert' | 'cbse' | 'icse' | 'custom';
  cover_image?: string;  // R2 URL
  chapters: BookChapter[];
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}
