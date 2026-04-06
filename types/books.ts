// ─── Block Types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'text'
  | 'heading'
  | 'image'
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
  | 'worked_example';

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
export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;       // R2 CDN URL
  alt: string;
  caption?: string;
  width?: 'full' | 'half' | 'third';
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

// ─── Union type ───────────────────────────────────────────────────────────────
export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
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
  | WorkedExampleBlock;


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
  tags?: string[];       // Links to Crucible taxonomy tags
  created_at: Date;
  updated_at: Date;
  published: boolean;
  reading_time_min?: number;
}

export interface BookChapter {
  number: number;
  title: string;
  slug: string;
  page_ids: string[];
  description?: string;
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
