export type Priority = 'high' | 'medium' | 'low';
export type Exam = 'both' | 'mains' | 'advanced';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Reaction {
  id: string;
  name: string;
  type: string;
  chapter: string;
  priority: Priority;
  exam: Exam;
  difficulty: Difficulty;
  tags: string[];
  summary: string;
  reactants: string;
  reagents: string;
  conditions: string;
  product: string;
  mechanism: string;
  stereo: string | null;
  mistake: string;
  hook: string;
  jee: string;
  videoUrl?: string;
  svgUrl?: string;
}

export interface QuickRefRow {
  name: string;
  value: string;
  note: string;
  svg?: string; // Using SVG string for portability
}

export interface QuickRefTable {
  title: string;
  description?: string;
  layout?: 'list' | 'grid';
  headers?: [string, string, string];
  rows: QuickRefRow[];
}
