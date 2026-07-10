'use client';

/**
 * Tiny on-device store for Life Skills practice state (pilot scope).
 * Key = `canvas_practice:<blockId>`. Deliberately per-device for the pilot —
 * server-side sync is a planned follow-up (LIFE_SKILLS_WORKFLOW.md §5.4),
 * not an oversight. Journal entries especially stay on-device by design.
 */

export function readPractice<T>(blockId: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`canvas_practice:${blockId}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writePractice<T>(blockId: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`canvas_practice:${blockId}`, JSON.stringify(value));
  } catch {
    // Storage full / private mode — practice still works, it just won't persist.
  }
}

/** Local calendar date as YYYY-MM-DD — habit check-ins are per-day, not per-24h. */
export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
