// Shared difficulty utilities — single source of truth for level↔label mapping.
//
// Internal scale (stored in MongoDB as metadata.difficultyLevel):
//   1 → Easy        (straightforward recall / direct formula application)
//   2 → Easy        (slightly more steps but still foundational)
//   3 → Medium      (multi-step reasoning, standard JEE Main level)
//   4 → Hard        (complex multi-concept, JEE Advanced level)
//   5 → Challenging (highest difficulty, reserved for exceptional questions)
//
// Student-facing labels: Easy | Medium | Hard | Challenging
// The admin dashboard shows the raw numeric level (1–5) for editorial precision.

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type DifficultyLabel = 'Easy' | 'Medium' | 'Hard' | 'Challenging';

/** Map a numeric level to a student-facing label */
export function difficultyLabel(level: DifficultyLevel | number): DifficultyLabel {
  if (level <= 2) return 'Easy';
  if (level === 3) return 'Medium';
  if (level === 4) return 'Hard';
  return 'Challenging';
}

/** Map a student-facing label to the MongoDB query condition for difficultyLevel */
export function difficultyQuery(label: DifficultyLabel): Record<string, unknown> {
  switch (label) {
    case 'Easy':        return { $lte: 2 };
    case 'Medium':      return { $eq: 3 };
    case 'Hard':        return { $eq: 4 };
    case 'Challenging': return { $eq: 5 };
  }
}

/** Filter predicate for client-side arrays */
export function matchesDifficultyLabel(level: number, label: DifficultyLabel): boolean {
  switch (label) {
    case 'Easy':        return level <= 2;
    case 'Medium':      return level === 3;
    case 'Hard':        return level === 4;
    case 'Challenging': return level === 5;
  }
}

/** Colour for difficulty badges — works with numeric levels */
export function difficultyColor(level: DifficultyLevel | number): string {
  if (level <= 2) return '#34d399'; // green  — Easy
  if (level === 3) return '#fbbf24'; // amber  — Medium
  if (level === 4) return '#f87171'; // red    — Hard
  return '#c084fc';                  // purple — Challenging
}

/** All student-facing labels in ascending order */
export const DIFFICULTY_LABELS: DifficultyLabel[] = ['Easy', 'Medium', 'Hard', 'Challenging'];

/** Human-readable label for admin dropdowns (shows both number and student name) */
export function adminDifficultyLabel(level: DifficultyLevel | number): string {
  return `Level ${level} — ${difficultyLabel(level as DifficultyLevel)}`;
}
