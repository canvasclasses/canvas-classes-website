import { useCallback, useEffect } from 'react';

/**
 * Keyboard nav for the admin question list.
 *
 * Arrow Left/Up → previous question, Arrow Right/Down → next question.
 * Suppressed when focus is inside INPUT/TEXTAREA/SELECT so editing isn't hijacked.
 *
 * The caller passes a ref-backed `getQuestionIds` callback so this hook never
 * re-binds when the question list changes — the listener reads the latest list
 * at keypress time.
 */
export function useAdminKeyNav(params: {
  getQuestionIds: () => string[];
  onSelect: (nextId: string) => void;
  getCurrentId: () => string | null;
}) {
  const { getQuestionIds, onSelect, getCurrentId } = params;

  const handleKeyNav = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const ids = getQuestionIds();
    const currentId = getCurrentId();
    const idx = ids.findIndex(id => id === currentId);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx > 0) onSelect(ids[idx - 1]);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx >= 0 && idx < ids.length - 1) onSelect(ids[idx + 1]);
    }
  }, [getQuestionIds, getCurrentId, onSelect]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [handleKeyNav]);
}
