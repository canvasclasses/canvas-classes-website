import { useEffect } from 'react';
import type { useRouter } from 'next/navigation';

type Router = ReturnType<typeof useRouter>;

export interface AdminFilters {
  searchQuery: string;
  selectedSubjectFilter: 'chemistry' | 'physics' | 'maths' | 'all';
  selectedChapterFilter: string;
  selectedTypeFilter: string;
  selectedSourceFilter: string;
  selectedShiftFilter: string;
  selectedTopPYQFilter: string;
  selectedDifficultyFilter: string;
  selectedTagStatusFilter: string;
  selectedYearFilter: string;
  selectedTagFilter: string;
}

/**
 * Mirrors the admin filter state to URL search params so refresh + share preserve view.
 *
 * Defaults (subject=chemistry, others='all') are intentionally omitted from the URL
 * to keep it short — readers should infer defaults rather than expect every param.
 */
export function useAdminFilterUrlSync(filters: AdminFilters, router: Router) {
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.searchQuery) params.set('search', filters.searchQuery);
    if (filters.selectedSubjectFilter !== 'chemistry') params.set('subject', filters.selectedSubjectFilter);
    if (filters.selectedChapterFilter !== 'all') params.set('chapter', filters.selectedChapterFilter);
    if (filters.selectedTypeFilter !== 'all') params.set('type', filters.selectedTypeFilter);
    if (filters.selectedSourceFilter !== 'all') params.set('source', filters.selectedSourceFilter);
    if (filters.selectedShiftFilter !== 'all') params.set('shift', filters.selectedShiftFilter);
    if (filters.selectedTopPYQFilter !== 'all') params.set('topPyq', filters.selectedTopPYQFilter);
    if (filters.selectedDifficultyFilter !== 'all') params.set('difficulty', filters.selectedDifficultyFilter);
    if (filters.selectedTagStatusFilter !== 'all') params.set('tagStatus', filters.selectedTagStatusFilter);
    if (filters.selectedYearFilter !== 'all') params.set('year', filters.selectedYearFilter);
    if (filters.selectedTagFilter !== 'all') params.set('tag', filters.selectedTagFilter);

    const newUrl = params.toString() ? `?${params.toString()}` : '/admin';
    router.replace(newUrl, { scroll: false });
  }, [
    filters.searchQuery,
    filters.selectedSubjectFilter,
    filters.selectedChapterFilter,
    filters.selectedTypeFilter,
    filters.selectedSourceFilter,
    filters.selectedShiftFilter,
    filters.selectedTopPYQFilter,
    filters.selectedDifficultyFilter,
    filters.selectedTagStatusFilter,
    filters.selectedYearFilter,
    filters.selectedTagFilter,
    router,
  ]);
}
