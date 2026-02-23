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

export interface QuickRefTable {
  title: string;
  rows: [string, string, string][];
}
